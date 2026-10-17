import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved') === 'true';

    const conflicts = await prisma.conflictLog.findMany({
      where: {
        isResolved: resolved,
      },
      include: {
        proposedEvent: true,
        conflictingEvent: true,
        resolvedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, conflicts });
  } catch (error: any) {
    console.error('Error fetching conflicts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch conflicts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      conflictId,
      action, // 'CORE_OVERRIDE' | 'RESOLVE' | 'REJECT_PROPOSED' | 'UPDATE_SCHEDULE'
      resolutionNotes,
      resolvedById,
      newVenue,
      newStartDate,
      newEndDate,
    } = body;

    if (!conflictId) {
      return NextResponse.json(
        { success: false, error: 'conflictId is required' },
        { status: 400 }
      );
    }

    const conflict = await prisma.conflictLog.findUnique({
      where: { id: conflictId },
      include: { proposedEvent: true, conflictingEvent: true },
    });

    if (!conflict) {
      return NextResponse.json(
        { success: false, error: 'Conflict record not found' },
        { status: 404 }
      );
    }

    let updatedEventStatus = 'VERIFIED';
    if (action === 'REJECT_PROPOSED') {
      updatedEventStatus = 'REJECTED';
    } else if (action === 'CORE_OVERRIDE') {
      updatedEventStatus = 'RESOLVED';
    } else {
      updatedEventStatus = 'RESOLVED';
    }

    // 1. Mark conflict log as resolved
    const updatedConflict = await prisma.conflictLog.update({
      where: { id: conflictId },
      data: {
        isResolved: true,
        resolutionNotes: resolutionNotes || `Action: ${action} executed by ACM Core verifier.`,
        resolvedAt: new Date(),
        resolvedById: resolvedById || null,
      },
    });

    // 2. Update proposed event status and any updated timing/venue
    const eventUpdateData: any = {
      status: updatedEventStatus,
      conflictSeverity: 'NONE',
    };

    if (newVenue) eventUpdateData.venue = newVenue;
    if (newStartDate) eventUpdateData.startDate = new Date(newStartDate);
    if (newEndDate) eventUpdateData.endDate = new Date(newEndDate);

    await prisma.event.update({
      where: { id: conflict.proposedEventId },
      data: eventUpdateData,
    });

    return NextResponse.json({
      success: true,
      conflict: updatedConflict,
      message: `Conflict resolved successfully via ${action}. Event marked as ${updatedEventStatus}.`,
    });
  } catch (error: any) {
    console.error('Error resolving conflict:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to resolve conflict' },
      { status: 500 }
    );
  }
}
