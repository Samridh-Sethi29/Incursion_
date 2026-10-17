# INCURSION — Conflict-Aware Events and Expenses Manager
### Track 2: ACM Campus Intelligence & Institutional Memory System

INCURSION is a full-stack campus management platform purpose-built for the ACM Core and campus student organizations. It resolves two critical operational challenges:
1. **Preventing Campus Event Clashes**: A centralized, conflict-aware event calendar that automatically flags venue collisions, demographic cannibalization (e.g. concurrent technical workshops targeting the same CS/IT audience), and schedule congestion.
2. **Transparent Fund Governance & Digital Memory**: An expense tracking ledger that tracks expenditures against a **₹50,000 semester budget**, maintains secure digital receipts for audits, and acts as an institutional memory retaining turnout data, spending patterns, and post-mortem lessons learned for succeeding executive teams.

---

## 🏛️ System Architecture & Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, FullCalendar support
- **Backend / APIs**: Next.js Server Components & Route Handlers (`/api/events`, `/api/conflicts`, `/api/expenses`, `/api/budget`, `/api/institutional-memory`)
- **Database & ORM**: Prisma ORM with relational schema (`Event`, `ConflictLog`, `Expense`, `BudgetSettings`, `User`). Pre-configured for instant standalone execution via SQLite (`dev.db`) with zero external database install required, and 100% plug-and-play compatible with PostgreSQL (Neon / Supabase / local Postgres).
- **Security & RBAC**: Role-Based Access Control differentiating **ACM Core Verifier**, **Club Executive** (GDSC, IEEE, CSI, Rotaract), and **Campus Members**.
- **Digital Receipts**: Built-in digital receipt storage and audit viewer supporting image/SVG/document bills.

---

## 🚀 Key Modules & Requirement Coverage

### 1. Centralized Campus Event Calendar (`/calendar`)
- Unified campus schedule where ACM leads and representatives from other clubs submit proposals.
- Real-time filtering by Organizer Club, Event Type (Technical, Hackathon, Seminar, Sports), Target Audience, and Verification Status.
- Visual status badges: Green (Verified ACM), Blue (Verified Club), Amber/Red (Clash Flagged).

### 2. Multi-Dimensional Conflict Detection Engine (`src/lib/conflict-detector.ts`)
- **Venue Collision (High Severity)**: Identifies physical space collisions (e.g., both ACM and another club reserving the Main Auditorium at the same time).
- **Audience Cannibalization (High/Medium Severity)**: Flags concurrent events targeting the same audience demographic (e.g., ACM Technical Workshop vs GDSC Technical Workshop both targeting CS/IT undergraduates between 5:00 PM and 7:00 PM).
- **Logistical Turnaround Warning (Low Severity)**: Flags back-to-back bookings within 45 minutes at the same venue.
- **Human-in-the-Loop Core Decision Rule**: As strictly required, *the system does NOT make automated cancellation decisions*. It surfaces early warnings, explains the rationale, and empowers the ACM Core with options:
  - `[Core Override & Approve]` (with logged justification)
  - `[Shift Venue]` (recommends alternate available halls)
  - `[Shift Time Slot]` (recommends adjacent non-conflicting slots)
  - `[Decline Proposal]`

### 3. Expense & Fund Management Module (`/expenses`)
- Real-time financial dashboard tracking disbursements against the **₹50,000 semester budget**.
- Category-wise spending breakdown and burn rate indicators (Refreshments & Food, Swag & Prizes, Logistics & AV, Marketing & Printing, Speaker Honorarium, Venue Facility).
- Digital receipt upload with immediate preview, transaction logs, and auditor signature metadata.

### 4. Digital Institutional Memory (`/institutional-memory`)
- Eliminates "starting from scratch" when leadership transitions each academic year.
- Historical turnout analysis (actual vs expected attendees).
- Budget vs actual spend variance.
- Preserved post-event notes (e.g., *"Extension cords in Lab 2 were short by 12 busters; procure heavy duty strips in advance"*, *"Moving by 1 hour avoided noise bleed from dance rehearsal"*).
- Exportable Executive Handover Dossier (JSON/CSV).

### 5. Interactive Role-Based Access Control Switcher
- Header includes a live role switcher allowing evaluators to instantly test permissions:
  - **Core Verifier**: Full rights to approve events, resolve/override clashes, and disburse expenses.
  - **Club Exec**: Propose club events, view conflict alerts, inspect schedule.
  - **Member**: Public view of confirmed calendar activities and transparency logs.

---

## 🛠️ Quickstart Guide

### 1. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Seed Data Included
The database is already initialized and pre-seeded with:
- The classic problem statement scenario:
  - `GDSC Cloud & DevOps Summit` (5:00 PM - 7:00 PM, Main Auditorium)
  - Clashing `ACM Systems & Rust Hands-On Workshop` (5:00 PM - 7:00 PM, Main Auditorium)
- Itemized semester expenses totaling ₹30,250 out of ₹50,000 semester cap with digital receipts attached.
- Historical events from previous semesters for Institutional Memory.

To re-seed fresh data at any time:
```bash
node prisma/seed.js
```

### 3. PostgreSQL Switching (Optional)
To switch from local SQLite to PostgreSQL:
1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. In `.env`, set:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/incursion?schema=public"
   ```
3. Run: `npx prisma db push`
