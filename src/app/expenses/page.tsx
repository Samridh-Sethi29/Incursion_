'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Receipt,
  IndianRupee,
  PlusCircle,
  Calendar,
  Filter,
  Download,
  FileText,
  Search,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import ExpenseModal from '@/components/ExpenseModal';
import ReceiptViewerModal from '@/components/ReceiptViewerModal';

export default function ExpensesPage() {
  const { isAcmCore } = useAuth();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState<any | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resExp, resBudget, resEvents] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/budget'),
        fetch('/api/events'),
      ]);

      const dataExp = await resExp.json();
      const dataBudget = await resBudget.json();
      const dataEvents = await resEvents.json();

      if (dataExp.success) setExpenses(dataExp.expenses || []);
      if (dataBudget.success) setBudgetData(dataBudget.budget);
      if (dataEvents.success) setEvents(dataEvents.events || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExpenses = expenses.filter((item) => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Treasury & Audit Module
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Semester Fund Governance</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            Expenses & Fund Management
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Transparent financial accounting with linked digital receipts, category caps, and expenditure analytics.
          </p>
        </div>

        {isAcmCore && (
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Record Transaction
          </button>
        )}
      </div>

      {/* FINANCIAL HEALTH OVERVIEW GAUGE (₹50k Semester Budget) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget Card */}
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Semester Budget</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{(budgetData?.totalBudget || 50000).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Allocated for {budgetData?.semester || 'Odd 2026'} ACM operations
          </p>
        </div>

        {/* Total Spent Card */}
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Disbursed</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            ₹{(budgetData?.totalSpent || 0).toLocaleString('en-IN')}
          </div>
          <div className="w-full bg-[#0B1522] h-2 rounded-full mt-2 overflow-hidden border border-[#1E324B]">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, budgetData?.percentSpent || 0)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {budgetData?.percentSpent || 0}% spent across {expenses.length} audited bills
          </p>
        </div>

        {/* Remaining Fund Balance */}
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Remaining Runway</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{(budgetData?.remainingBudget || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-400/90 font-medium mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Healthy chapter liquidity
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions by item name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B1522] border border-[#1E324B] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-[#0B1522] border border-[#1E324B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-full md:w-auto"
        >
          <option value="ALL">All Categories</option>
          <option value="REFRESHMENTS_FOOD">Refreshments & Food</option>
          <option value="SWAG_PRIZES">Swag & Prizes</option>
          <option value="MARKETING_PRINTING">Marketing & Printing</option>
          <option value="LOGISTICS_EQUIPMENT">Logistics & AV</option>
          <option value="SPEAKER_HONORARIUM">Speaker Honorarium</option>
          <option value="VENUE_BOOKING">Venue Facility</option>
        </select>
      </div>

      {/* EXPENSES TABLE */}
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E324B] bg-[#0E1927] text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Expense Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Linked Event</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4 text-center">Digital Bill / Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E324B] text-slate-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions match the criteria.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-medium">
                      {format(new Date(exp.date), 'dd MMM yyyy')}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{exp.title}</p>
                      {exp.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{exp.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                        {exp.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {exp.event ? (
                        <span className="text-slate-300 font-medium truncate block max-w-xs">
                          {exp.event.title}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">General Operational</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-emerald-400 text-sm">
                      ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {exp.receiptUrl ? (
                        <button
                          onClick={() => setSelectedReceiptExpense(exp)}
                          className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">No bill attached</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={fetchData}
        events={events}
      />

      <ReceiptViewerModal
        expense={selectedReceiptExpense}
        onClose={() => setSelectedReceiptExpense(null)}
      />
    </div>
  );
}
