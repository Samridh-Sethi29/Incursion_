export type UserRole = 'ACM_CORE' | 'CLUB_EXEC' | 'MEMBER';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubAffiliation: string;
  avatar?: string;
}

export type EventType =
  | 'TECHNICAL'
  | 'WORKSHOP'
  | 'HACKATHON'
  | 'CULTURAL'
  | 'SEMINAR'
  | 'SPORTS'
  | 'MEETING';

export type TargetAudience =
  | 'ALL_STUDENTS'
  | 'TECH_CS_IT'
  | 'FIRST_YEAR'
  | 'SENIORS'
  | 'MANAGEMENT_DESIGN';

export type EventStatus =
  | 'PENDING_REVIEW'
  | 'VERIFIED'
  | 'FLAGGED_CONFLICT'
  | 'RESOLVED'
  | 'REJECTED'
  | 'COMPLETED';

export type ConflictSeverity = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

export type ExpenseCategory =
  | 'VENUE_BOOKING'
  | 'REFRESHMENTS_FOOD'
  | 'SWAG_PRIZES'
  | 'SPEAKER_HONORARIUM'
  | 'MARKETING_PRINTING'
  | 'LOGISTICS_EQUIPMENT'
  | 'MISCELLANEOUS';

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  organizerClub: string;
  eventType: EventType | string;
  targetAudience: TargetAudience | string;
  venue: string;
  startDate: string;
  endDate: string;
  status: EventStatus | string;
  conflictSeverity: ConflictSeverity | string;
  conflictReason?: string | null;
  expectedAttendees: number;
  actualAttendees?: number | null;
  budgetAllocated: number;
  academicYear: string;
  semester: string;
  outcomeNotes?: string | null;
  ratingScore?: number | null;
  expenses?: ExpenseRecord[];
  conflictsInitiated?: ConflictLogRecord[];
  conflictsTargeted?: ConflictLogRecord[];
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory | string;
  date: string;
  description?: string | null;
  eventId?: string | null;
  event?: {
    id: string;
    title: string;
    organizerClub: string;
  } | null;
  receiptUrl?: string | null;
  receiptName?: string | null;
  receiptType?: string | null;
  status: 'PENDING_APPROVAL' | 'VERIFIED' | 'REJECTED' | string;
  semester: string;
  academicYear: string;
  createdAt: string;
}

export interface ConflictLogRecord {
  id: string;
  proposedEventId: string;
  proposedEvent?: EventRecord;
  conflictingEventId: string;
  conflictingEvent?: EventRecord;
  conflictType: string;
  severity: ConflictSeverity | string;
  details: string;
  isResolved: boolean;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface BudgetSummary {
  academicYear: string;
  semester: string;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentSpent: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    cap: number;
  }[];
  monthlyTrends: {
    month: string;
    spent: number;
    eventCount: number;
  }[];
}
