'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { detectEventConflicts, ConflictCheckResult } from '@/lib/conflict-detector';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface EventSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingEvents?: any[];
}

export default function EventSubmissionModal({
  isOpen,
  onClose,
  onSuccess,
  existingEvents = [],
}: EventSubmissionModalProps) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizerClub, setOrganizerClub] = useState(user.clubAffiliation || 'ACM Student Chapter');
  const [eventType, setEventType] = useState('TECHNICAL');
  const [targetAudience, setTargetAudience] = useState('TECH_CS_IT');
  const [venue, setVenue] = useState('Main Auditorium');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('19:00');
  const [expectedAttendees, setExpectedAttendees] = useState('80');
  const [budgetAllocated, setBudgetAllocated] = useState('5000');

  const [conflictPreview, setConflictPreview] = useState<ConflictCheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync organizer when user changes role
  useEffect(() => {
    if (user.clubAffiliation) {
      setOrganizerClub(user.clubAffiliation);
    }
  }, [user]);

  // Real-time conflict preview evaluation
  useEffect(() => {
    if (!title || !venue || !date || !startTime || !endTime) {
      setConflictPreview(null);
      return;
    }

    try {
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);

      if (endDateTime <= startDateTime) {
        setConflictPreview(null);
        return;
      }

      const result = detectEventConflicts(
        {
          title,
          organizerClub,
          eventType,
          targetAudience,
          venue,
          startDate: startDateTime,
          endDate: endDateTime,
        },
        existingEvents
      );

      setConflictPreview(result);
    } catch (e) {
      // invalid date formatting ignored while typing
    }
  }, [title, organizerClub, eventType, targetAudience, venue, date, startTime, endTime, existingEvents]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);

      if (endDateTime <= startDateTime) {
        setSubmitError('End time must be after start time.');
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          organizerClub,
          eventType,
          targetAudience,
          venue,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          expectedAttendees: parseInt(expectedAttendees) || 50,
          budgetAllocated: parseFloat(budgetAllocated) || 0,
          createdById: user.id,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit event');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E324B]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Propose Campus Event
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Input event details for centralized calendar visibility & automated conflict checking
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {submitError && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-sm text-red-400">
              {submitError}
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ACM Web3 & Rust Hands-on Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Organizer & Event Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Organizer Club / Chapter *
              </label>
              <select
                value={organizerClub}
                onChange={(e) => setOrganizerClub(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ACM Student Chapter">ACM Student Chapter</option>
                <option value="GDSC">GDSC (Google Developer Student Club)</option>
                <option value="IEEE CS">IEEE Computer Society</option>
                <option value="CSI Student Branch">CSI Student Branch</option>
                <option value="Rotaract Club">Rotaract Club</option>
                <option value="Robotics Club">Robotics Club</option>
                <option value="Fine Arts Club">Fine Arts & Cultural Club</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="TECHNICAL">Technical Workshop / Hands-on</option>
                <option value="HACKATHON">Hackathon / Coding Contest</option>
                <option value="SEMINAR">Guest Lecture / Seminar</option>
                <option value="CULTURAL">Cultural Event / Fest</option>
                <option value="SPORTS">Sports / Fitness</option>
                <option value="MEETING">General Body Meeting</option>
              </select>
            </div>
          </div>

          {/* Target Audience & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Target Audience *</span>
                <span className="text-[10px] text-slate-400 font-normal">Conflict factor</span>
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="TECH_CS_IT">Tech CS/IT Students</option>
                <option value="ALL_STUDENTS">All Campus Students</option>
                <option value="FIRST_YEAR">1st & 2nd Year Freshers</option>
                <option value="SENIORS">3rd & 4th Year Seniors</option>
                <option value="MANAGEMENT_DESIGN">Management & Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Venue Location *
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Main Auditorium">Main Auditorium (Capacity: 350)</option>
                <option value="Seminar Hall 2">Seminar Hall 2 (Capacity: 120)</option>
                <option value="Tech Lab 4">Tech Lab 4 - High Performance Lab (Capacity: 80)</option>
                <option value="CS Seminar Hall 1">CS Seminar Hall 1 (Capacity: 100)</option>
                <option value="Open Amphitheatre">Open Amphitheatre</option>
                <option value="Campus Medical Centre & Lawn">Campus Medical Centre & Lawn</option>
              </select>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                End Time *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Turnout & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Expected Attendees
              </label>
              <input
                type="number"
                min="5"
                max="1000"
                value={expectedAttendees}
                onChange={(e) => setExpectedAttendees(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                Estimated Budget (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={budgetAllocated}
                onChange={(e) => setBudgetAllocated(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Brief Description
            </label>
            <textarea
              rows={2}
              placeholder="Outline workshop syllabus, prerequisites, key speakers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0B1522] border border-[#1E324B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* DYNAMIC REAL-TIME CONFLICT PREVIEW INDICATOR */}
          {conflictPreview && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                conflictPreview.highestSeverity === 'HIGH'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : conflictPreview.highestSeverity === 'MEDIUM'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : conflictPreview.highestSeverity === 'LOW'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {conflictPreview.hasConflict ? (
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      conflictPreview.highestSeverity === 'HIGH'
                        ? 'text-red-400'
                        : conflictPreview.highestSeverity === 'MEDIUM'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`}
                  />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">
                      {conflictPreview.hasConflict
                        ? `${conflictPreview.highestSeverity} Conflict Detected (${conflictPreview.conflictCount} Clash)`
                        : 'Slot Clear • No Conflicts Found'}
                    </p>
                    {conflictPreview.hasConflict && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/40">
                        Core Review Flagged
                      </span>
                    )}
                  </div>

                  <p className="text-xs mt-1 text-slate-300">{conflictPreview.summary}</p>

                  {conflictPreview.conflicts.map((clash, idx) => (
                    <div key={idx} className="mt-2.5 pt-2.5 border-t border-white/10 text-xs space-y-1">
                      <p className="font-medium text-white">
                        Clashing with: <span className="underline">{clash.conflictingEventTitle}</span> ({clash.conflictingOrganizer})
                      </p>
                      <p className="text-slate-300 text-[11px]">{clash.details}</p>
                      {clash.recommendedActions.length > 0 && (
                        <div className="mt-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">System Suggestions:</span>
                          <ul className="list-disc list-inside text-[11px] text-slate-300 pl-1 mt-0.5">
                            {clash.recommendedActions.map((rec, rIdx) => (
                              <li key={rIdx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E324B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Evaluating & Submitting...' : 'Submit Proposed Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
