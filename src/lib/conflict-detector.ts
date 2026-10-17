import { differenceInMinutes, isSameDay, format } from 'date-fns';

export interface ProposedEventInput {
  id?: string;
  title: string;
  organizerClub: string;
  eventType: string;
  targetAudience: string;
  venue: string;
  startDate: Date | string;
  endDate: Date | string;
}

export interface ExistingEventTarget {
  id: string;
  title: string;
  organizerClub: string;
  eventType: string;
  targetAudience: string;
  venue: string;
  startDate: Date | string;
  endDate: Date | string;
  status: string;
}

export interface DetectedConflict {
  type: 'VENUE_CLASH' | 'AUDIENCE_TIME_OVERLAP' | 'SAME_DAY_CONGESTION';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  conflictingEventId: string;
  conflictingEventTitle: string;
  conflictingOrganizer: string;
  message: string;
  details: string;
  recommendedActions: string[];
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  highestSeverity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  conflictCount: number;
  conflicts: DetectedConflict[];
  summary: string;
}

/**
 * Checks for time window overlap: (startA < endB && endA > startB)
 */
function isTimeOverlapping(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime();
}

/**
 * Normalizes venue strings for robust comparison
 */
function normalizeVenue(venue: string): string {
  return venue.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Evaluates whether two audiences have significant demographic overlap
 */
function audiencesOverlap(audA: string, audB: string, typeA: string, typeB: string): boolean {
  // Direct match
  if (audA === audB) return true;
  
  // Universal audience clashes with any student group
  if (audA === 'ALL_STUDENTS' || audB === 'ALL_STUDENTS') return true;

  // Technical demographic overlap
  const isTechA = audA === 'TECH_CS_IT' || ['TECHNICAL', 'WORKSHOP', 'HACKATHON'].includes(typeA);
  const isTechB = audB === 'TECH_CS_IT' || ['TECHNICAL', 'WORKSHOP', 'HACKATHON'].includes(typeB);
  if (isTechA && isTechB) return true;

  // Year overlap
  if (
    (audA === 'FIRST_SECOND_YEAR' && audB === 'FIRST_YEAR') ||
    (audB === 'FIRST_SECOND_YEAR' && audA === 'FIRST_YEAR')
  ) {
    return true;
  }

  return false;
}

/**
 * INCURSION Conflict Detection Engine
 * Inspects a proposed event against all existing verified/scheduled campus events
 */
export function detectEventConflicts(
  proposed: ProposedEventInput,
  existingEvents: ExistingEventTarget[]
): ConflictCheckResult {
  const pStart = new Date(proposed.startDate);
  const pEnd = new Date(proposed.endDate);
  const conflicts: DetectedConflict[] = [];

  for (const existing of existingEvents) {
    // Skip comparing against itself (when editing an existing event)
    if (proposed.id && existing.id === proposed.id) continue;
    
    // Skip cancelled or rejected events
    if (existing.status === 'REJECTED') continue;

    const eStart = new Date(existing.startDate);
    const eEnd = new Date(existing.endDate);

    const timeOverlaps = isTimeOverlapping(pStart, pEnd, eStart, eEnd);
    const sameVenue = normalizeVenue(proposed.venue) === normalizeVenue(existing.venue);
    const audienceClash = audiencesOverlap(
      proposed.targetAudience,
      existing.targetAudience,
      proposed.eventType,
      existing.eventType
    );

    // 1. CRITICAL: Exact Venue Clash (Hard overlap)
    if (timeOverlaps && sameVenue) {
      conflicts.push({
        type: 'VENUE_CLASH',
        severity: 'HIGH',
        conflictingEventId: existing.id,
        conflictingEventTitle: existing.title,
        conflictingOrganizer: existing.organizerClub,
        message: `Direct Venue Collision at ${proposed.venue}`,
        details: `Both "${proposed.title}" (${proposed.organizerClub}) and "${existing.title}" (${existing.organizerClub}) have reserved "${proposed.venue}" during an overlapping time slot (${format(pStart, 'p')} - ${format(pEnd, 'p')} vs ${format(eStart, 'p')} - ${format(eEnd, 'p')}).`,
        recommendedActions: [
          `Switch venue to an alternate hall (e.g. CS Seminar Hall 2 or Tech Lab 4)`,
          `Shift time slot by at least 2 hours to avoid physical collision`,
          `Consult ${existing.organizerClub} coordinator for venue co-sharing if related`,
        ],
      });
      continue; // Handled high severity
    }

    // 2. AUDIENCE / TIMING CLASH (Demographic Cannibalization)
    // E.g. ACM planning Tech workshop 5-7 PM while GDSC has technical event 5-7 PM
    if (timeOverlaps && audienceClash) {
      const isBothTechnical =
        (proposed.eventType === 'TECHNICAL' || proposed.targetAudience === 'TECH_CS_IT') &&
        (existing.eventType === 'TECHNICAL' || existing.targetAudience === 'TECH_CS_IT');

      const severity = isBothTechnical ? 'HIGH' : 'MEDIUM';

      conflicts.push({
        type: 'AUDIENCE_TIME_OVERLAP',
        severity,
        conflictingEventId: existing.id,
        conflictingEventTitle: existing.title,
        conflictingOrganizer: existing.organizerClub,
        message: `Audience Overlap with ${existing.organizerClub}: "${existing.title}"`,
        details: `Potential turnout split! "${proposed.title}" (${proposed.organizerClub}) and "${existing.title}" (${existing.organizerClub}) concurrently target ${proposed.targetAudience.replace(/_/g, ' ')} between ${format(pStart, 'p')} and ${format(pEnd, 'p')}.`,
        recommendedActions: [
          `Adjust start time by +2 hours or choose an adjacent day slot`,
          `Reach out to ${existing.organizerClub} to consider joint co-hosting or collaborative track`,
          `ACM Core override: proceed if audiences have sufficient departmental divergence`,
        ],
      });
      continue;
    }

    // 3. CONGESTION / BACK-TO-BACK LOGISTICS (Same Venue within 45 mins)
    if (sameVenue && isSameDay(pStart, eStart)) {
      const minDifference = Math.min(
        Math.abs(differenceInMinutes(pStart, eEnd)),
        Math.abs(differenceInMinutes(eStart, pEnd))
      );

      if (minDifference < 45) {
        conflicts.push({
          type: 'SAME_DAY_CONGESTION',
          severity: 'LOW',
          conflictingEventId: existing.id,
          conflictingEventTitle: existing.title,
          conflictingOrganizer: existing.organizerClub,
          message: `Tight Turnaround at ${proposed.venue} (${minDifference} mins buffer)`,
          details: `"${existing.title}" (${existing.organizerClub}) concludes only ${minDifference} minutes before or starts right after "${proposed.title}" in ${proposed.venue}. May cause AV teardown and seating delays.`,
          recommendedActions: [
            `Add a 30-minute buffer for soundcheck and stage handover`,
            `Notify venue supervisor for expedited changeover`,
          ],
        });
      }
    }
  }

  // Determine highest severity
  let highestSeverity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' = 'NONE';
  if (conflicts.some((c) => c.severity === 'HIGH')) {
    highestSeverity = 'HIGH';
  } else if (conflicts.some((c) => c.severity === 'MEDIUM')) {
    highestSeverity = 'MEDIUM';
  } else if (conflicts.length > 0) {
    highestSeverity = 'LOW';
  }

  let summary = 'No scheduling conflicts detected. Safe to submit.';
  if (highestSeverity === 'HIGH') {
    summary = `CRITICAL: ${conflicts.length} major conflict(s) detected. Requires ACM Core review or schedule adjustment.`;
  } else if (highestSeverity === 'MEDIUM') {
    summary = `WARNING: ${conflicts.length} audience overlap(s) detected. Turnout may be impacted.`;
  } else if (highestSeverity === 'LOW') {
    summary = `ADVISORY: ${conflicts.length} logistical warning(s) flagged (buffer/same day).`;
  }

  return {
    hasConflict: conflicts.length > 0,
    highestSeverity,
    conflictCount: conflicts.length,
    conflicts,
    summary,
  };
}
