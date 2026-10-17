'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Calendar,
  AlertTriangle,
  Receipt,
  History,
  TrendingUp,
  IndianRupee,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import EventSubmissionModal from '@/components/EventSubmissionModal';
import ExpenseModal from '@/components/ExpenseModal';
import ConflictResolutionModal from '@/components/ConflictResolutionModal';

export default function Dashboard() {
  const { user, isAcmCore, isClubExec } = useAuth();

  const [budgetData, setBudgetData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [activeConflictToResolve, setActiveConflictToResolve] = useState<any | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resBudget, resEvents, resConflicts] = await Promise.all([
        fetch('/api/budget'),
        fetch('/api/events'),
        fetch('/api/conflicts?resolved=false'),
      ]);

      const dataBudget = await resBudget.json();
      const dataEvents = await resEvents.json();
      const dataConflicts = await resConflicts.json();

      if (dataBudget.success) setBudgetData(dataBudget.budget);
      if (dataEvents.success) setEvents(dataEvents.events || []);
      if (dataConflicts.success) setConflicts(dataConflicts.conflicts || []);
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const upcomingEvents = events
    .filter((e) => new Date(e.endDate) >= new Date() && e.status !== 'REJECTED')
    .slice(0, 5);

  const activeClash = conflicts.length > 0 ? conflicts[0] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Role Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#101D2C] to-[#172438] p-6 rounded-2xl border border-[#1E324B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              {budgetData?.semester || 'Odd 2026'} Session
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Campus Visibility & Fund Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            ACM Core Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Conflict-aware calendar orchestration and institutional treasury ledger. Active as{' '}
            <strong className="text-white">{user.name}</strong> ({user.role.replace('_', ' ')}).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isClubExec && (
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Propose Event
            </button>
          )}

          {isAcmCore && (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              Record Expense
            </button>
          )}

          <Link
            href="/calendar"
            className="px-4 py-2.5 rounded-xl bg-[#0B1522] hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-[#1E324B] transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            Calendar Grid
          </Link>
        </div>
      </div>

      {/* TOP PRIORITY: ACTIVE CONFLICT WARNING BANNER */}
      {activeClash && (
        <div className="bg-gradient-to-r from-amber-950/40 via-[#1A1813] to-[#101D2C] border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                    High Priority Clash Flagged
                  </span>
                  <span className="text-xs text-slate-400">Automated Conflict Engine</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Collision: {activeClash.proposedEvent?.title} vs {activeClash.conflictingEvent?.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {activeClash.details}
                </p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Venue: {activeClash.proposedEvent?.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Slot: {activeClash.proposedEvent?.startDate ? format(new Date(activeClash.proposedEvent.startDate), 'dd MMM, p') : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {isAcmCore ? (
                <button
                  onClick={() => setActiveConflictToResolve(activeClash)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Arbitrate & Resolve Clash
                </button>
              ) : (
                <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  Flagged for ACM Core Adjudication
                </span>
              )}
              <Link
                href="/conflicts"
                className="px-3.5 py-2.5 rounded-xl bg-[#0B1522] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-[#1E324B] transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* METRIC CARDS (Budget, Spent, Remaining, Conflicts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Semester Budget */}
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Semester Allocation</span>
            <IndianRupee className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{(budgetData?.totalBudget || 50000).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Approved ACM Chapter Cap</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Spent</span>
            <Receipt className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            ₹{(budgetData?.totalSpent || 0).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Burn Rate: <strong className="text-slate-200">{budgetData?.percentSpent || 0}%</strong> of cap
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Remaining Balance</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{(budgetData?.remainingBudget || 0).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-emerald-400/90 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fund Runway Stable</span>
          </div>
        </div>

        {/* Active Conflict Count */}
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Schedule Clashes</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span>{conflicts.length}</span>
            {conflicts.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Action Req
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <Link href="/conflicts" className="text-blue-400 hover:underline flex items-center gap-1">
              Inspect Conflict Hub <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: Category Spending Breakdown & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Breakdown against ₹50k Cap (2 Cols) */}
        <div className="lg:col-span-2 bg-[#101D2C] border border-[#1E324B] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-400" />
                Category-Wise Expenditure Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Transparent fund tracking against predefined category limits
              </p>
            </div>
            <Link
              href="/expenses"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View Ledger <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4 pt-2">
            {budgetData?.categoryBreakdown?.map((cat: any) => {
              const formattedName = cat.category.replace(/_/g, ' ');
              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{formattedName}</span>
                    <span className="text-slate-400 font-mono">
                      ₹{cat.amount.toLocaleString('en-IN')}{' '}
                      <span className="text-slate-500">/ ₹{cat.cap.toLocaleString('en-IN')}</span>{' '}
                      <span className={`font-bold ml-1 ${cat.isNearLimit ? 'text-amber-400' : 'text-slate-300'}`}>
                        ({cat.capPercentUsed}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#0B1522] rounded-full overflow-hidden border border-[#1E324B]/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.isNearLimit
                          ? 'bg-amber-500'
                          : cat.amount > 0
                          ? 'bg-blue-500'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.min(100, cat.capPercentUsed)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institutional Memory Reminder Card */}
          <div className="p-4 bg-[#0B1522] border border-[#1E324B] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <History className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Digital Institutional Memory Active</p>
                <p className="text-[11px] text-slate-400">
                  Historical turnout, spending patterns & handover logs preserved for future teams.
                </p>
              </div>
            </div>
            <Link
              href="/institutional-memory"
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
            >
              Explore Archive
            </Link>
          </div>
        </div>

        {/* Right: Upcoming Campus Events (1 Col) */}
        <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Campus Schedule
              </h2>
              <p className="text-xs text-slate-400">Upcoming club activities</p>
            </div>
            <Link
              href="/calendar"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              All Events
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No upcoming events scheduled.</p>
            ) : (
              upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    ev.status === 'FLAGGED_CONFLICT'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-[#0B1522] border-[#1E324B] hover:border-blue-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        ev.organizerClub.includes('ACM')
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {ev.organizerClub}
                    </span>
                    {ev.status === 'FLAGGED_CONFLICT' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Clashing
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{ev.title}</h3>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {format(new Date(ev.startDate), 'dd MMM, p')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {ev.venue}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EventSubmissionModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={fetchData}
        existingEvents={events}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={fetchData}
        events={events}
      />

      <ConflictResolutionModal
        conflict={activeConflictToResolve}
        onClose={() => setActiveConflictToResolve(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
