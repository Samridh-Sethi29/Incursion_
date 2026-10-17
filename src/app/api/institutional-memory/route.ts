import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');

    const where: any = {
      status: { in: ['COMPLETED', 'RESOLVED', 'VERIFIED'] },
    };

    if (semester && semester !== 'ALL') {
      where.semester = semester;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'desc' },
      include: {
        expenses: true,
        conflictsInitiated: true,
      },
    });

    // Compute memory stats
    const pastSemesters = await prisma.event.findMany({
      distinct: ['semester'],
      select: { semester: true, academicYear: true },
      orderBy: { semester: 'desc' },
    });

    const totalEventsArchived = events.length;
    let totalActualAttendees = 0;
    let totalExpectedAttendees = 0;
    let totalSpentHistorical = 0;
    let totalBudgetHistorical = 0;

    const learnings: {
      eventId: string;
      eventTitle: string;
      semester: string;
      notes: string;
      turnoutRate: string;
      budgetVariance: string;
      rating: number;
    }[] = [];

    for (const ev of events) {
      if (ev.actualAttendees) {
        totalActualAttendees += ev.actualAttendees;
        totalExpectedAttendees += ev.expectedAttendees;
      }
      totalBudgetHistorical += ev.budgetAllocated;

      const eventSpent = ev.expenses.reduce((sum, e) => sum + e.amount, 0);
      totalSpentHistorical += eventSpent;

      if (ev.outcomeNotes) {
        const turnoutRatio = ev.actualAttendees
          ? `${Math.round((ev.actualAttendees / ev.expectedAttendees) * 100)}%`
          : 'N/A';
        const varianceVal = ev.budgetAllocated - eventSpent;
        const budgetVariance =
          varianceVal >= 0 ? `+₹${varianceVal.toFixed(0)} surplus` : `-₹${Math.abs(varianceVal).toFixed(0)} deficit`;

        learnings.push({
          eventId: ev.id,
          eventTitle: ev.title,
          semester: ev.semester,
          notes: ev.outcomeNotes,
          turnoutRate: turnoutRatio,
          budgetVariance,
          rating: ev.ratingScore || 4,
        });
      }
    }

    return NextResponse.json({
      success: true,
      memory: {
        totalEventsArchived,
        totalActualAttendees,
        turnoutAccuracy:
          totalExpectedAttendees > 0
            ? Math.round((totalActualAttendees / totalExpectedAttendees) * 100)
            : 100,
        totalSpentHistorical,
        totalBudgetHistorical,
        semesters: pastSemesters,
        learnings,
        events,
      },
    });
  } catch (error: any) {
    console.error('Error fetching institutional memory:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch institutional memory' },
      { status: 500 }
    );
  }
}
