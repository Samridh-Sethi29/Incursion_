import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');
    const academicYear = searchParams.get('academicYear');
    const category = searchParams.get('category');
    const eventId = searchParams.get('eventId');

    const where: any = {};
    if (semester) where.semester = semester;
    if (academicYear) where.academicYear = academicYear;
    if (category && category !== 'ALL') where.category = category;
    if (eventId) where.eventId = eventId;

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            organizerClub: true,
          },
        },
      },
    });

    const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    return NextResponse.json({
      success: true,
      expenses,
      totalAmount,
      count: expenses.length,
    });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      amount,
      category,
      date,
      description,
      eventId,
      receiptUrl,
      receiptName,
      receiptType,
      semester = 'Odd 2026',
      academicYear = '2026-2027',
      loggedById,
    } = body;

    if (!title || !amount || !category || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory fields: title, amount, category, date' },
        { status: 400 }
      );
    }

    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        description: description || '',
        eventId: eventId || null,
        receiptUrl: receiptUrl || null,
        receiptName: receiptName || (receiptUrl ? 'Uploaded_Receipt' : null),
        receiptType: receiptType || (receiptUrl?.startsWith('data:image') ? 'image' : 'document'),
        status: 'VERIFIED',
        semester,
        academicYear,
        loggedById: loggedById || null,
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json({
      success: true,
      expense: newExpense,
      message: 'Expense and digital receipt recorded successfully.',
    });
  } catch (error: any) {
    console.error('Error logging expense:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log expense' },
      { status: 500 }
    );
  }
}
