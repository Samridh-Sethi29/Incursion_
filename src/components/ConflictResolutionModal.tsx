'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';

interface ConflictResolutionModalProps {
  conflict: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ConflictResolutionModal({
  conflict,
  onClose,
  onSuccess,
}: ConflictResolutionModalProps) {
  const { user, isAcmCore } = useAuth();

  const [actionType, setActionType] = useState<'CORE_OVERRIDE' | 'CHANGE_VENUE' | 'CHANGE_TIME' | 'REJECT_PROPOSED'>('CORE_OVERRIDE');
  const [resolutionNotes, setResolutionNotes] = useState('ACM Core reviewed: Approved with co-promotion agreement between chapters.');
  const [newVenue, setNewVenue] = useState('Seminar Hall 2');
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('16:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!conflict) return null;

  const proposed = conflict.proposedEvent;
  const existing = conflict.conflictingEvent;

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let payload: any = {
        conflictId: conflict.id,
        action: actionType,
        resolutionNotes,
        resolvedById: user.id,
      };

      if (actionType === 'CHANGE_VENUE') {
        payload.newVenue = newVenue;
      } else if (actionType === 'CHANGE_TIME' && newDate) {
        payload.newStartDate = `${newDate}T${newStartTime}:00`;
        payload.newEndDate = `${newDate}T${newEndTime}:00`;
      }

      const res = await fetch('/api/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to resolve conflict');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error executing conflict resolution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E324B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ACM Core Conflict Verification Center</h2>
              <p className="text-xs text-slate-400">Human-in-the-loop conflict adjudication & schedule arbitration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleResolve} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Rationale Alert Banner */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                {conflict.conflictType.replace(/_/g, ' ')} • {conflict.severity} SEVERITY
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                Core Decision Required
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1">{conflict.details}</p>
          </div>

          {/* Side-by-side Clash Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Clashing Existing Event */}
            <div className="p-4 bg-[#0B1522] border border-[#1E324B] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Existing Event (Verified)
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                  {existing?.organizerClub}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{existing?.title}</h4>
              <div className="space-y-1 text-xs text-slate-300">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {existing?.venue}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {existing?.startDate ? format(new Date(existing.startDate), 'p') : ''} -{' '}
                  {existing?.endDate ? format(new Date(existing.endDate), 'p') : ''}
                </p>
                <p className="text-[11px] text-slate-400">Audience: {existing?.targetAudience}</p>
              </div>
            </div>

            {/* Proposed Clashing Event */}
            <div className="p-4 bg-[#0B1522] border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Proposed Clashing Event
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                  {proposed?.organizerClub}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{proposed?.title}</h4>
              <div className="space-y-1 text-xs text-slate-300">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {proposed?.venue}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {proposed?.startDate ? format(new Date(proposed.startDate), 'p') : ''} -{' '}
                  {proposed?.endDate ? format(new Date(proposed.endDate), 'p') : ''}
                </p>
                <p className="text-[11px] text-slate-400">Audience: {proposed?.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* Action Choice Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Adjudication Action
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActionType('CORE_OVERRIDE');
                  setResolutionNotes('ACM Core verified: Proceed with simultaneous schedule; cross-club promotion agreed.');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'CORE_OVERRIDE'
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-[#0B1522] border-[#1E324B] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-xs font-bold text-blue-400">Core Override</span>
                <span className="text-[10px] block mt-0.5">Approve both as planned</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActionType('CHANGE_VENUE');
                  setResolutionNotes('ACM Core rescheduled proposed venue to eliminate spatial clash.');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'CHANGE_VENUE'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white'
                    : 'bg-[#0B1522] border-[#1E324B] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-xs font-bold text-emerald-400">Shift Venue</span>
                <span className="text-[10px] block mt-0.5">Move to alternate hall</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActionType('CHANGE_TIME');
                  setResolutionNotes('ACM Core adjusted time window to avoid audience cannibalization.');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'CHANGE_TIME'
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-[#0B1522] border-[#1E324B] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-xs font-bold text-purple-400">Shift Slot</span>
                <span className="text-[10px] block mt-0.5">Pick adjacent time slot</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActionType('REJECT_PROPOSED');
                  setResolutionNotes('ACM Core rejected proposed event due to insurmountable calendar collision.');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'REJECT_PROPOSED'
                    ? 'bg-red-600/20 border-red-500 text-white'
                    : 'bg-[#0B1522] border-[#1E324B] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-xs font-bold text-red-400">Reject</span>
                <span className="text-[10px] block mt-0.5">Decline proposed slot</span>
              </button>
            </div>
          </div>

          {/* Conditional Options */}
          {actionType === 'CHANGE_VENUE' && (
            <div className="p-3 bg-[#0B1522] border border-[#1E324B] rounded-xl space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Alternate Venue Recommendation</label>
              <select
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                className="w-full px-3 py-2 bg-[#101D2C] border border-[#1E324B] rounded-lg text-sm text-white"
              >
                <option value="Tech Lab 4">Tech Lab 4 (High Performance Computing Lab)</option>
                <option value="Seminar Hall 2">Seminar Hall 2</option>
                <option value="CS Seminar Hall 1">CS Seminar Hall 1</option>
                <option value="Open Amphitheatre">Open Amphitheatre</option>
              </select>
            </div>
          )}

          {actionType === 'CHANGE_TIME' && (
            <div className="p-3 bg-[#0B1522] border border-[#1E324B] rounded-xl grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#101D2C] border border-[#1E324B] rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300">Start Time</label>
                <input
                  type="time"
                  required
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#101D2C] border border-[#1E324B] rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300">End Time</label>
                <input
                  type="time"
                  required
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#101D2C] border border-[#1E324B] rounded-lg text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Audit Resolution Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Institutional Memory & Audit Log Rationale *
            </label>
            <input
              type="text"
              required
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="Explain why this decision was reached for succeeding core teams..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1E324B]">
            <span className="text-[11px] text-slate-400">
              Resolved by: <strong className="text-white">{user.name}</strong> ({user.role})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Dismiss
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Recording Decision...' : 'Commit Core Decision'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
