import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester') || 'Odd 2026';
    const academicYear = searchParams.get('academicYear') || '2026-2027';

    // 1. Get or create budget settings
    let budgetSetting = await prisma.budgetSettings.findFirst({
      where: { semester, academicYear },
    });

    if (!budgetSetting) {
      budgetSetting = await prisma.budgetSettings.findFirst();
    }

    const totalBudget = budgetSetting ? budgetSetting.totalBudget : 50000.0;

    // 2. Query expenses for this period
    const expenses = await prisma.expense.findMany({
      where: {
        semester,
        academicYear,
        status: { not: 'REJECTED' },
      },
      include: { event: true },
      orderBy: { date: 'asc' },
    });

    // 3. Aggregate totals
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const remainingBudget = Math.max(0, totalBudget - totalSpent);
    const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // 4. Category-wise breakdown
    const categoryCaps: Record<string, number> = {
      REFRESHMENTS_FOOD: budgetSetting?.capRefreshments || 15000.0,
      SWAG_PRIZES: budgetSetting?.capPrizes || 15000.0,
      LOGISTICS_EQUIPMENT: budgetSetting?.capLogistics || 10000.0,
      MARKETING_PRINTING: budgetSetting?.capMarketing || 5000.0,
      SPEAKER_HONORARIUM: budgetSetting?.capSpeaker || 5000.0,
      VENUE_BOOKING: 8000.0,
      MISCELLANEOUS: 5000.0,
    };

    const categoryTotals: Record<string, number> = {};
    for (const exp of expenses) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    }

    const categoryBreakdown = Object.keys(categoryCaps).map((cat) => {
      const amount = categoryTotals[cat] || 0;
      const cap = categoryCaps[cat];
      return {
        category: cat,
        amount,
        percentage: totalSpent > 0 ? Number(((amount / totalSpent) * 100).toFixed(1)) : 0,
        cap,
        capPercentUsed: Number(((amount / cap) * 100).toFixed(1)),
        isNearLimit: amount >= cap * 0.85,
      };
    });

    // 5. Monthly Trend
    const monthlyMap: Record<string, { spent: number; count: number }> = {};
    for (const exp of expenses) {
      const monthKey = format(new Date(exp.date), 'MMM yyyy');
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { spent: 0, count: 0 };
      }
      monthlyMap[monthKey].spent += exp.amount;
      monthlyMap[monthKey].count += 1;
    }

    const monthlyTrends = Object.keys(monthlyMap).map((m) => ({
      month: m,
      spent: monthlyMap[m].spent,
      eventCount: monthlyMap[m].count,
    }));

    return NextResponse.json({
      success: true,
      budget: {
        academicYear,
        semester,
        totalBudget,
        totalSpent,
        remainingBudget,
        percentSpent: Number(percentSpent.toFixed(1)),
        categoryBreakdown,
        monthlyTrends,
        status: percentSpent > 90 ? 'CRITICAL_BURN' : percentSpent > 70 ? 'MODERATE_BURN' : 'HEALTHY',
      },
    });
  } catch (error: any) {
    console.error('Error computing budget analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to compute budget' },
      { status: 500 }
    );
  }
}
