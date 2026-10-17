'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Sparkles,
  BookOpen,
  Award,
  TrendingUp,
  Download,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet,
} from 'lucide-react';
import { format } from 'date-fns';

export default function InstitutionalMemoryPage() {
  const [memoryData, setMemoryData] = useState<any>(null);
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMemory = async () => {
    setIsLoading(true);
    try {
      const url =
        selectedSemester !== 'ALL'
          ? `/api/institutional-memory?semester=${encodeURIComponent(selectedSemester)}`
          : '/api/institutional-memory';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMemoryData(data.memory);
      }
    } catch (err) {
      console.error('Error fetching institutional memory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, [selectedSemester]);

  const exportReport = () => {
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(memoryData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `ACM_Institutional_Memory_${selectedSemester}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Knowledge Continuity
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Executive Transition Archive</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Digital Institutional Memory
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Succeeding ACM executive teams never start from scratch. Access historical event turnouts, spending
            breakdowns, equipment caveats, and conflict learnings.
          </p>
        </div>

        {/* Export Dossier */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export Executive Handover Dossier
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Archived Events</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {memoryData?.totalEventsArchived || 0}
          </div>
          <p className="text-xs text-slate-400 mt-1">Multi-semester recorded activities</p>
        </div>

        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Campus Footfall</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            {memoryData?.totalActualAttendees || 0} Students
          </div>
          <p className="text-xs text-slate-400 mt-1">Directly reached across workshops</p>
        </div>

        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Turnout Turnaround</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {memoryData?.turnoutAccuracy || 100}%
          </div>
          <p className="text-xs text-slate-400 mt-1">Actual vs Expected capacity</p>
        </div>

        <div className="p-5 bg-[#101D2C] border border-[#1E324B] rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Historical Spend</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            ₹{(memoryData?.totalSpentHistorical || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">Total verified disbursements</p>
        </div>
      </div>

      {/* EXECUTIVE HANDOVER: POST-EVENT LESSONS LEARNED CARDS */}
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Institutional Lessons Learned & Post-Mortem Tips
            </h2>
          </div>
          <span className="text-xs text-slate-400">Preserved for successor leads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {memoryData?.learnings?.map((l: any, i: number) => (
            <div
              key={i}
              className="p-4 bg-[#0B1522] border border-[#1E324B] rounded-xl space-y-2 hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{l.eventTitle}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {l.semester}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{l.notes}"
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E324B] text-[11px] text-slate-400">
                <span>
                  Turnout: <strong className="text-emerald-400">{l.turnoutRate}</strong>
                </span>
                <span>
                  Variance: <strong className="text-slate-300">{l.budgetVariance}</strong>
                </span>
                <span>Rating: {'★'.repeat(l.rating)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORICAL EVENTS TABLE */}
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1E324B] flex items-center justify-between bg-[#0E1927]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Past Events Registry & Financial Audits
          </h3>
          <span className="text-xs text-slate-400">
            {memoryData?.events?.length || 0} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E324B] bg-[#0E1927] text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Event & Session</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4 text-center">Turnout (Exp / Act)</th>
                <th className="py-3 px-4 text-right">Allocated Budget</th>
                <th className="py-3 px-4 text-right">Actual Spent</th>
                <th className="py-3 px-4 text-center">Conflict History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E324B] text-slate-300">
              {memoryData?.events?.map((ev: any) => {
                const totalExp = ev.expenses?.reduce((s: number, x: any) => s + x.amount, 0) || 0;
                return (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{ev.title}</p>
                      <span className="text-[10px] text-indigo-400 font-semibold">
                        {ev.semester} • {ev.organizerClub}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{ev.venue}</td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-bold text-slate-200">
                        {ev.actualAttendees || '—'} / {ev.expectedAttendees}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-300">
                      ₹{ev.budgetAllocated.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      ₹{totalExp.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {ev.conflictReason ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Resolved Clash
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">None</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
