'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  History,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import ConflictResolutionModal from '@/components/ConflictResolutionModal';

export default function ConflictsPage() {
  const { isAcmCore } = useAuth();

  const [activeConflicts, setActiveConflicts] = useState<any[]>([]);
  const [resolvedConflicts, setResolvedConflicts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
  const [selectedConflict, setSelectedConflict] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConflicts = async () => {
    setIsLoading(true);
    try {
      const [resActive, resResolved] = await Promise.all([
        fetch('/api/conflicts?resolved=false'),
        fetch('/api/conflicts?resolved=true'),
      ]);

      const dataActive = await resActive.json();
      const dataResolved = await resResolved.json();

      if (dataActive.success) setActiveConflicts(dataActive.conflicts || []);
      if (dataResolved.success) setResolvedConflicts(dataResolved.conflicts || []);
    } catch (err) {
      console.error('Error fetching conflicts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Collision Mitigation Hub
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Core Decision Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Conflict Resolution Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Automated conflict detection surfaces collisions in advance. The system empowers the ACM Core with
            adjudication choices—never automated cancellations.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#101D2C] p-1 rounded-xl border border-[#1E324B]">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ACTIVE'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Active Clashes ({activeConflicts.length})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'RESOLVED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved History ({resolvedConflicts.length})
          </button>
        </div>
      </div>

      {/* ACTIVE TAB CONTENT */}
      {activeTab === 'ACTIVE' && (
        <div className="space-y-4">
          {activeConflicts.length === 0 ? (
            <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">All Schedules Synchronized</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                No active calendar clashes or audience demographic conflicts detected across campus clubs.
              </p>
            </div>
          ) : (
            activeConflicts.map((cnf) => {
              const proposed = cnf.proposedEvent;
              const conflicting = cnf.conflictingEvent;

              return (
                <div
                  key={cnf.id}
                  className="bg-[#101D2C] border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-5"
                >
                  {/* Alert Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E324B] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/30">
                        {cnf.severity} SEVERITY • {cnf.conflictType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-400">Flagged by Conflict Engine</span>
                    </div>

                    {isAcmCore && (
                      <button
                        onClick={() => setSelectedConflict(cnf)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Sparkles className="w-4 h-4" />
                        Adjudicate Clash
                      </button>
                    )}
                  </div>

                  {/* Conflict Rationale Details */}
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                    <strong>Algorithmic Rationale:</strong> {cnf.details}
                  </div>

                  {/* Side-by-Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Event 1: Proposed */}
                    <div className="p-4 bg-[#0B1522] border border-amber-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Proposed Clashing Proposal
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                          {proposed?.organizerClub}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{proposed?.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{proposed?.description}</p>
                      <div className="pt-2 border-t border-[#1E324B] space-y-1 text-xs text-slate-300">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-semibold">{proposed?.venue}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {proposed?.startDate ? format(new Date(proposed.startDate), 'dd MMM yyyy, p') : ''} -{' '}
                          {proposed?.endDate ? format(new Date(proposed.endDate), 'p') : ''}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Target Demographic: <strong className="text-slate-300">{proposed?.targetAudience}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Event 2: Existing */}
                    <div className="p-4 bg-[#0B1522] border border-[#1E324B] rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Already Scheduled / Verified
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                          {conflicting?.organizerClub}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{conflicting?.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{conflicting?.description}</p>
                      <div className="pt-2 border-t border-[#1E324B] space-y-1 text-xs text-slate-300">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span className="font-semibold">{conflicting?.venue}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          {conflicting?.startDate ? format(new Date(conflicting.startDate), 'dd MMM yyyy, p') : ''} -{' '}
                          {conflicting?.endDate ? format(new Date(conflicting.endDate), 'p') : ''}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Target Demographic: <strong className="text-slate-300">{conflicting?.targetAudience}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* RESOLVED TAB CONTENT */}
      {activeTab === 'RESOLVED' && (
        <div className="space-y-3">
          {resolvedConflicts.length === 0 ? (
            <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl p-12 text-center text-slate-400 text-xs">
              No historical conflicts resolved yet.
            </div>
          ) : (
            resolvedConflicts.map((cnf) => (
              <div
                key={cnf.id}
                className="bg-[#101D2C] border border-[#1E324B] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                    <span className="text-xs text-slate-400">
                      {cnf.resolvedAt ? format(new Date(cnf.resolvedAt), 'dd MMM yyyy, p') : ''}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {cnf.proposedEvent?.title} ⚡ {cnf.conflictingEvent?.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    <strong className="text-slate-400">Resolution Decision:</strong> {cnf.resolutionNotes}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 font-mono">
                    Audited by ACM Core
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL */}
      <ConflictResolutionModal
        conflict={selectedConflict}
        onClose={() => setSelectedConflict(null)}
        onSuccess={fetchConflicts}
      />
    </div>
  );
}
