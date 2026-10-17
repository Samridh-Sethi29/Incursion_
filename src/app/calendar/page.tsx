'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Calendar as CalendarIcon,
  Filter,
  PlusCircle,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Search,
  IndianRupee,
  Layers,
} from 'lucide-react';
import { format } from 'date-fns';
import EventSubmissionModal from '@/components/EventSubmissionModal';

export default function CalendarPage() {
  const { user, isClubExec, isAcmCore } = useAuth();

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [clubFilter, setClubFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (clubFilter !== 'ALL' && ev.organizerClub !== clubFilter) return false;
    if (typeFilter !== 'ALL' && ev.eventType !== typeFilter) return false;
    if (statusFilter !== 'ALL' && ev.status !== statusFilter) return false;
    if (
      searchQuery &&
      !ev.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.venue.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Centralized Campus Registry
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">All-Club Unified Schedule</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            Campus Event Calendar
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time multi-club event visibility to proactively prevent scheduling collisions and demographic splits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#101D2C] p-1 rounded-xl border border-[#1E324B]">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'GRID' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Card Grid
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'LIST' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline List
            </button>
          </div>

          {isClubExec && (
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Propose Event
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, keyword, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B1522] border border-[#1E324B] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="px-3 py-2 bg-[#0B1522] border border-[#1E324B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Clubs</option>
            <option value="ACM Student Chapter">ACM Student Chapter</option>
            <option value="GDSC">GDSC</option>
            <option value="IEEE CS">IEEE CS</option>
            <option value="CSI Student Branch">CSI</option>
            <option value="Rotaract Club">Rotaract</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#0B1522] border border-[#1E324B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="TECHNICAL">Technical Workshop</option>
            <option value="HACKATHON">Hackathon</option>
            <option value="SEMINAR">Seminar / Lecture</option>
            <option value="SPORTS">Sports / Drive</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0B1522] border border-[#1E324B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="FLAGGED_CONFLICT">Flagged Conflict</option>
            <option value="RESOLVED">Resolved</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* EVENTS DISPLAY */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((ev) => {
            const isAcm = ev.organizerClub.includes('ACM');
            const isConflict = ev.status === 'FLAGGED_CONFLICT';
            const isResolved = ev.status === 'RESOLVED';

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] flex flex-col justify-between ${
                  isConflict
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    : isAcm
                    ? 'bg-[#101D2C] border-blue-500/30 hover:border-blue-400'
                    : 'bg-[#101D2C] border-[#1E324B] hover:border-slate-500'
                }`}
              >
                <div>
                  {/* Badge & Organizer */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isAcm
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {ev.organizerClub}
                    </span>

                    {isConflict ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Clash Flagged
                      </span>
                    ) : isResolved ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Core Resolved
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">{ev.title}</h3>

                  {/* Conflict rationale if flagged */}
                  {isConflict && ev.conflictReason && (
                    <div className="mt-2.5 p-2 bg-amber-500/15 border border-amber-500/30 rounded-lg text-[11px] text-amber-200 leading-tight">
                      <strong>Reason:</strong> {ev.conflictReason}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{ev.description}</p>
                </div>

                {/* Footer metadata */}
                <div className="pt-4 mt-4 border-t border-[#1E324B]/70 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {format(new Date(ev.startDate), 'EEE, dd MMM yyyy')} •{' '}
                      {format(new Date(ev.startDate), 'p')} - {format(new Date(ev.endDate), 'p')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Audience: {ev.targetAudience.replace(/_/g, ' ')}</span>
                    <span>Cap: ~{ev.expectedAttendees}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TIMELINE LIST VIEW */
        <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl overflow-hidden divide-y divide-[#1E324B]">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="p-4 hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#0B1522] border border-[#1E324B] flex flex-col items-center justify-center shrink-0 text-center">
                  <span className="text-[10px] font-bold uppercase text-blue-400">
                    {format(new Date(ev.startDate), 'MMM')}
                  </span>
                  <span className="text-lg font-black text-white leading-none">
                    {format(new Date(ev.startDate), 'dd')}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">
                    {format(new Date(ev.startDate), 'EEE')}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{ev.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 bg-blue-500/20 text-blue-400 rounded">
                      {ev.organizerClub}
                    </span>
                    {ev.status === 'FLAGGED_CONFLICT' && (
                      <span className="text-[10px] font-bold px-2 py-0.2 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Clash Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{ev.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {format(new Date(ev.startDate), 'p')} - {format(new Date(ev.endDate), 'p')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {ev.venue}
                    </span>
                    <span>Audience: {ev.targetAudience}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-xs font-bold text-slate-300">
                  ₹{ev.budgetAllocated?.toLocaleString('en-IN') || 0}
                </span>
                <span className="block text-[10px] text-slate-500">Allocated Budget</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101D2C] border border-[#1E324B] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {selectedEvent.organizerClub} • {selectedEvent.eventType}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {selectedEvent.status === 'FLAGGED_CONFLICT' && (
              <div className="p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-xl space-y-1">
                <span className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Scheduling Conflict Flagged by System
                </span>
                <p className="text-xs text-slate-200">{selectedEvent.conflictReason}</p>
                <p className="text-[11px] text-amber-300/80 mt-1">
                  System empowers ACM Core with override & reschedule capabilities.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 p-4 bg-[#0B1522] rounded-xl border border-[#1E324B] text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Date & Slot</span>
                <span className="text-slate-200 font-semibold">
                  {format(new Date(selectedEvent.startDate), 'dd MMM yyyy, p')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Venue</span>
                <span className="text-slate-200 font-semibold">{selectedEvent.venue}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Target Audience</span>
                <span className="text-slate-200 font-semibold">
                  {selectedEvent.targetAudience.replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Estimated Budget</span>
                <span className="text-emerald-400 font-bold font-mono">
                  ₹{selectedEvent.budgetAllocated?.toLocaleString('en-IN') || 0}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0B1522] p-3 rounded-xl border border-[#1E324B]">
                {selectedEvent.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E324B]">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      <EventSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={fetchEvents}
        existingEvents={events}
      />
    </div>
  );
}
