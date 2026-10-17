import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { detectEventConflicts } from '@/lib/conflict-detector';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');
    const club = searchParams.get('club');
    const status = searchParams.get('status');
    const academicYear = searchParams.get('academicYear');

    const where: any = {};
    if (semester) where.semester = semester;
    if (academicYear) where.academicYear = academicYear;
    if (club && club !== 'ALL') where.organizerClub = club;
    if (status && status !== 'ALL') where.status = status;

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
      include: {
        conflictsInitiated: true,
        conflictsTargeted: true,
        expenses: true,
      },
    });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      organizerClub,
      eventType,
      targetAudience,
      venue,
      startDate,
      endDate,
      expectedAttendees,
      budgetAllocated,
      academicYear = '2026-2027',
      semester = 'Odd 2026',
      createdById,
    } = body;

    if (!title || !venue || !startDate || !endDate || !organizerClub) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory fields: title, venue, dates, organizer' },
        { status: 400 }
      );
    }

    // 1. Fetch all currently active/verified events to check conflicts against
    const existingEvents = await prisma.event.findMany({
      where: {
        status: { in: ['VERIFIED', 'PENDING_REVIEW', 'FLAGGED_CONFLICT', 'RESOLVED'] },
      },
    });

    // 2. Run INCURSION Conflict Detection Engine
    const conflictResult = detectEventConflicts(
      {
        title,
        organizerClub,
        eventType: eventType || 'TECHNICAL',
        targetAudience: targetAudience || 'ALL_STUDENTS',
        venue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      existingEvents
    );

    // 3. Determine Event Status (System does NOT cancel automatically - empowers Core!)
    let initialStatus = 'PENDING_REVIEW';
    if (conflictResult.hasConflict) {
      initialStatus = 'FLAGGED_CONFLICT';
    } else if (organizerClub.includes('ACM')) {
      initialStatus = 'VERIFIED';
    }

    // 4. Create Event in Database
    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || '',
        organizerClub,
        eventType: eventType || 'TECHNICAL',
        targetAudience: targetAudience || 'ALL_STUDENTS',
        venue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: initialStatus,
        conflictSeverity: conflictResult.highestSeverity,
        conflictReason: conflictResult.hasConflict ? conflictResult.summary : null,
        expectedAttendees: Number(expectedAttendees) || 50,
        budgetAllocated: Number(budgetAllocated) || 0.0,
        academicYear,
        semester,
        createdById,
      },
    });

    // 5. If conflicts detected, log them in ConflictLog table
    if (conflictResult.hasConflict) {
      for (const clash of conflictResult.conflicts) {
        await prisma.conflictLog.create({
          data: {
            proposedEventId: newEvent.id,
            conflictingEventId: clash.conflictingEventId,
            conflictType: clash.type,
            severity: clash.severity,
            details: clash.details,
            isResolved: false,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      event: newEvent,
      conflictReport: conflictResult,
      message: conflictResult.hasConflict
        ? `Event created with flagged ${conflictResult.highestSeverity} severity conflicts for ACM Core verification.`
        : 'Event submitted and verified successfully.',
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
