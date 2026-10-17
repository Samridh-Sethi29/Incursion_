<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7F00FF,50:3B82F6,100:06B6D4&height=250&section=header&text=SyncACM&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Conflict-Aware%20Events%20%26%20Expenses%20Manager&descAlignY=58&descSize=24" width="100%" alt="SyncACM banner"/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=900&color=A855F7&center=true&vCenter=true&width=760&lines=%F0%9F%93%85+One+calendar+for+the+whole+campus;%E2%9A%A0%EF%B8%8F+Clashes+flagged+before+they+happen;%F0%9F%92%B8+Every+rupee+tracked%2C+every+bill+stored;%F0%9F%A7%A0+Institutional+memory+for+every+future+ACM+team;%F0%9F%A4%9D+The+core+team+decides.+Always." alt="Typing animation"/>
</a>

<br/>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-18181B?style=for-the-badge&logo=shadcnui&logoColor=white)
![FullCalendar](https://img.shields.io/badge/FullCalendar-EF4444?style=for-the-badge&logo=googlecalendar&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-A855F7?style=for-the-badge&logo=auth0&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

![License](https://img.shields.io/badge/license-MIT-22C55E?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-F59E0B?style=flat-square)
![Status](https://img.shields.io/badge/status-hackathon_ready-EC4899?style=flat-square)
![Track](https://img.shields.io/badge/ACM-Track_2-8B5CF6?style=flat-square)

### [✨ Features](#-features) · [🧩 How It Works](#-how-it-works) · [🏗️ Architecture](#%EF%B8%8F-architecture) · [🗄️ Data Model](#%EF%B8%8F-data-model) · [🚀 Quick Start](#-quick-start) · [🗺️ Roadmap](#%EF%B8%8F-roadmap)

</div>

---

## 🎯 The Problem

> *"We are planning a technical workshop from 5 to 7 PM, and another club already has a major technical event during the same period."*

Every semester, campus clubs collide. Event details live in WhatsApp groups and Instagram stories, expenses hide in scattered spreadsheets and crumpled bills, and each new executive team **starts from zero**.

<table>
<tr>
<td width="50%" valign="top">

### 😩 Before SyncACM

- 💬 Event info buried in chat groups
- 💥 Two big events, same audience, same evening
- 📉 "Where did the ₹50,000 go?"
- 🧾 Bills lost, receipts unlinked
- 🔁 New team, no history, repeat mistakes

</td>
<td width="50%" valign="top">

### 😎 After SyncACM

- 📅 **One** verified, campus-wide calendar
- ⚠️ Conflicts flagged *automatically*, before approval
- 📊 Live budget, category and semester breakdowns
- 🔒 Receipts stored securely and linked to events
- 🧠 Years of events and spending, searchable forever

</td>
</tr>
</table>

---

## ✨ Features

<div align="center">

| | Feature | What you get |
|---|---|---|
| 📅 | **Centralized Campus Calendar** | Any executive or club rep submits an event (name, date, time, venue, type, expected audience, organizer). The ACM core verifies it. |
| ⚠️ | **Smart Conflict Detection** | Time-overlap + audience-overlap + venue checks run on every submission, with severity levels. |
| 💸 | **Expense & Fund Manager** | Log amount, category, date, linked event, description and a receipt upload. |
| 📊 | **Auto Analytics** | Monthly and semester spend, remaining budget, category-wise breakdown, all computed live. |
| 🧠 | **Institutional Memory** | Past events, their expenses, spending patterns and historical conflicts, preserved for successors. |
| 🔐 | **Role-Based Access** | Members, club executives and ACM core verifiers each see and do the right things. |
| 🔔 | **Early Alerts** | In-app and email heads-up to the core team when a proposed event overlaps another. |
| 🧾 | **Secure Receipt Vault** | Bills on Cloudinary / S3, linked to the exact expense and event. |
| 🛡️ | **Human-in-the-loop** | The system **only flags**. It never cancels or reschedules automatically. |

</div>

---

## 🧩 How It Works

### 🔄 End-to-End Workflow

```mermaid
flowchart LR
    A([👤 Executive / Club Rep]) -->|Submits event| B[📝 Event Form]
    B --> C{{⚙️ Conflict Engine}}
    C -->|No overlap| D[🟢 Pending Verification]
    C -->|Overlap found| E[🟠 Pending + Conflict Flag]
    D --> F([🛡️ ACM Core Review])
    E -->|🔔 Alert sent| F
    F -->|Approve| G[✅ Published on Calendar]
    F -->|Request change| H[✏️ Back to Organizer]
    F -->|Reject| I[❌ Rejected with reason]
    H --> B
    G --> J[💸 Expenses logged against event]
    J --> K[🧾 Receipts uploaded]
    K --> L[(🧠 Institutional Memory)]
    G --> L

    classDef user fill:#8B5CF6,stroke:#6D28D9,color:#fff,stroke-width:2px
    classDef engine fill:#F59E0B,stroke:#B45309,color:#111,stroke-width:2px
    classDef ok fill:#22C55E,stroke:#15803D,color:#fff,stroke-width:2px
    classDef warn fill:#F97316,stroke:#C2410C,color:#fff,stroke-width:2px
    classDef bad fill:#EF4444,stroke:#B91C1C,color:#fff,stroke-width:2px
    classDef mem fill:#06B6D4,stroke:#0E7490,color:#fff,stroke-width:2px
    class A,F user
    class C engine
    class D,G ok
    class E,H warn
    class I bad
    class L mem
```

### ⚠️ The Conflict Engine

A proposed event is compared against every **approved or pending** event. A clash is raised when **time overlaps** *and* at least one more factor matches.

```mermaid
flowchart TD
    S([New / edited event]) --> T{Time ranges<br/>overlap?}
    T -->|No| OK[🟢 No conflict]
    T -->|Yes| AUD{Same target<br/>audience?}
    AUD -->|Yes| VEN{Same venue?}
    AUD -->|No| VEN2{Same venue?}
    VEN -->|Yes| CRIT[🔴 CRITICAL<br/>Audience + venue clash]
    VEN -->|No| HIGH[🟠 HIGH<br/>Audience clash]
    VEN2 -->|Yes| MED[🟡 MEDIUM<br/>Venue double-booked]
    VEN2 -->|No| LOW[🔵 INFO<br/>Parallel events, different audience]
    CRIT & HIGH & MED & LOW --> NOTE[📬 Notify ACM core.<br/>Core decides. Nothing is auto-cancelled.]

    classDef g fill:#22C55E,color:#fff,stroke:#15803D
    classDef r fill:#EF4444,color:#fff,stroke:#B91C1C
    classDef o fill:#F97316,color:#fff,stroke:#C2410C
    classDef y fill:#EAB308,color:#111,stroke:#A16207
    classDef b fill:#3B82F6,color:#fff,stroke:#1D4ED8
    classDef p fill:#8B5CF6,color:#fff,stroke:#6D28D9
    class OK g
    class CRIT r
    class HIGH o
    class MED y
    class LOW b
    class NOTE p
```

<details>
<summary><b>🧮 Click to see the overlap logic</b></summary>

```ts
// lib/conflicts.ts
type Slot = { start: Date; end: Date };

// Two ranges overlap when each starts before the other ends.
export const overlaps = (a: Slot, b: Slot) =>
  a.start < b.end && b.start < a.end;

export function detectConflicts(proposed: EventInput, existing: Event[]) {
  return existing
    .filter((e) => e.id !== proposed.id && e.status !== "REJECTED")
    .filter((e) => overlaps(proposed, e))
    .map((e) => {
      const sameAudience = e.audience.some((a) => proposed.audience.includes(a));
      const sameVenue = e.venueId === proposed.venueId;

      const severity =
        sameAudience && sameVenue ? "CRITICAL" :
        sameAudience              ? "HIGH"     :
        sameVenue                 ? "MEDIUM"   : "INFO";

      return { conflictingEventId: e.id, severity, sameAudience, sameVenue };
    });
}
```

> The result is stored as a `ConflictFlag` and **shown to the core team**. It never blocks or cancels anything on its own.

</details>

### 🎬 The Example Scenario, Visualised

```mermaid
gantt
    title Friday - Campus Event Timeline (conflict detected)
    dateFormat HH:mm
    axisFormat %H:%M
    section 🟣 ACM
    Technical Workshop (proposed) :crit, acm, 17:00, 2h
    section 🟠 Other Clubs
    Major Tech Event - Robotics Club :active, rob, 16:30, 3h
    Cultural Rehearsal :done, cul, 18:00, 2h
    section ⚠️ System
    Overlap flagged 17:00 - 19:00 :milestone, flag, 17:00, 0h
```

---

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ Frontend - Next.js (App Router)"]
        UI[Tailwind + shadcn/ui]
        CAL[FullCalendar]
        DASH[Dashboard Charts]
    end

    subgraph SERVER["⚙️ Backend - Next.js API Routes"]
        AUTH[NextAuth.js<br/>Sessions + RBAC]
        EVT[Events API]
        CON[Conflict Engine]
        EXP[Expenses API]
        ANA[Analytics API]
        NOT[Notifier]
    end

    subgraph DATA["💾 Data & Storage"]
        PRISMA[Prisma ORM]
        PG[(PostgreSQL)]
        S3[(Cloudinary / S3<br/>Receipts)]
    end

    UI --> AUTH
    CAL --> EVT
    DASH --> ANA
    EVT --> CON --> NOT
    EVT --> PRISMA
    EXP --> PRISMA
    ANA --> PRISMA
    EXP --> S3
    PRISMA --> PG

    style CLIENT fill:#1e1b4b,stroke:#8B5CF6,color:#fff
    style SERVER fill:#022c22,stroke:#22C55E,color:#fff
    style DATA fill:#431407,stroke:#F97316,color:#fff
```

### 🔐 Role-Based Access Control

```mermaid
flowchart LR
    M[👤 Member] --> E[🎓 Club Executive] --> C[🛡️ ACM Core Verifier]
    style M fill:#3B82F6,color:#fff,stroke:#1D4ED8
    style E fill:#8B5CF6,color:#fff,stroke:#6D28D9
    style C fill:#EC4899,color:#fff,stroke:#BE185D
```

| Capability | 👤 Member | 🎓 Executive | 🛡️ ACM Core |
|---|:---:|:---:|:---:|
| View verified calendar | ✅ | ✅ | ✅ |
| Submit / edit own events | ❌ | ✅ | ✅ |
| See conflict warnings | ❌ | ✅ (own events) | ✅ (all) |
| Verify / reject events | ❌ | ❌ | ✅ |
| Log expenses and upload receipts | ❌ | ✅ | ✅ |
| Approve expenses, set budgets | ❌ | ❌ | ✅ |
| View full financial dashboard | ❌ | 🔸 own events | ✅ |
| Browse historical archive | 🔸 events only | ✅ | ✅ |

---

## 🗄️ Data Model

```mermaid
erDiagram
    USER ||--o{ EVENT : organizes
    USER ||--o{ EXPENSE : records
    CLUB ||--o{ EVENT : hosts
    VENUE ||--o{ EVENT : "booked for"
    EVENT ||--o{ EXPENSE : incurs
    EVENT ||--o{ CONFLICT_FLAG : "triggers"
    EXPENSE ||--o| RECEIPT : "backed by"
    SEMESTER ||--o{ BUDGET : defines
    BUDGET ||--o{ EXPENSE : "deducted from"

    USER {
        string id PK
        string name
        string email
        enum role "MEMBER | EXECUTIVE | CORE"
    }
    CLUB {
        string id PK
        string name
        boolean isACM
    }
    EVENT {
        string id PK
        string name
        datetime startAt
        datetime endAt
        enum type "TECHNICAL | CULTURAL | SPORTS | ..."
        string[] audience
        int expectedAttendance
        enum status "PENDING | APPROVED | REJECTED"
    }
    VENUE {
        string id PK
        string name
        int capacity
    }
    CONFLICT_FLAG {
        string id PK
        enum severity "INFO | MEDIUM | HIGH | CRITICAL"
        string resolutionNote
        boolean resolved
    }
    EXPENSE {
        string id PK
        decimal amount
        enum category
        date spentOn
        string description
        enum status "PENDING | APPROVED"
    }
    RECEIPT {
        string id PK
        string url
        string publicId
    }
    SEMESTER {
        string id PK
        string label
        date startsOn
        date endsOn
    }
    BUDGET {
        string id PK
        decimal total
    }
```

<details>
<summary><b>📄 Core Prisma schema (click to expand)</b></summary>

```prisma
enum Role        { MEMBER EXECUTIVE CORE }
enum EventStatus { PENDING APPROVED REJECTED }
enum Severity    { INFO MEDIUM HIGH CRITICAL }
enum Category    { VENUE FOOD MARKETING EQUIPMENT PRIZES SWAG TRAVEL MISC }

model Event {
  id                 String       @id @default(cuid())
  name               String
  startAt            DateTime
  endAt              DateTime
  type               String
  audience           String[]
  expectedAttendance Int
  status             EventStatus  @default(PENDING)
  organizer          User         @relation(fields: [organizerId], references: [id])
  organizerId        String
  club               Club         @relation(fields: [clubId], references: [id])
  clubId             String
  venue              Venue?       @relation(fields: [venueId], references: [id])
  venueId            String?
  expenses           Expense[]
  conflicts          ConflictFlag[]

  @@index([startAt, endAt])
}

model Expense {
  id          String    @id @default(cuid())
  amount      Decimal   @db.Decimal(10, 2)
  category    Category
  spentOn     DateTime
  description String
  event       Event?    @relation(fields: [eventId], references: [id])
  eventId     String?
  receiptUrl  String?
  receiptId   String?
  semesterId  String
}
```

</details>

---

## 📊 Dashboard Preview

Sample data for a **₹50,000** semester budget. These are the charts your core team sees at a glance.

### 🥧 Category-wise Spending

```mermaid
pie showData title Spend by Category (₹)
    "Venue & Logistics" : 8500
    "Food & Refreshments" : 7200
    "Marketing & Print" : 4800
    "Equipment" : 3500
    "Prizes & Swag" : 2800
    "Misc" : 1200
```

### 📈 Monthly Expenditure vs Plan

```mermaid
xychart-beta
    title "Monthly Spend (₹) - Semester Budget ₹50,000"
    x-axis [Aug, Sep, Oct, Nov, Dec]
    y-axis "Rupees" 0 --> 14000
    bar [3200, 9800, 12500, 6400, 0]
    line [10000, 10000, 10000, 10000, 10000]
```

### 🎯 Budget Gauge

<div align="center">

| 💰 Total Budget | 🔥 Spent | 🟢 Remaining | 📉 Used |
|:---:|:---:|:---:|:---:|
| **₹50,000** | **₹28,000** | **₹22,000** | **56%** |

![progress](https://img.shields.io/badge/Budget_Used-56%25-F59E0B?style=for-the-badge&labelColor=1f2937)
![remaining](https://img.shields.io/badge/Remaining-₹22,000-22C55E?style=for-the-badge&labelColor=1f2937)
![conflicts](https://img.shields.io/badge/Open_Conflicts-3-EF4444?style=for-the-badge&labelColor=1f2937)

</div>

---

## 🧠 Institutional Memory

Nothing is ever deleted when a team graduates. Successors inherit:

```mermaid
mindmap
  root((🧠 Archive))
    📅 Past Events
      Attendance vs expected
      Venue and timing used
      Organizer and club
    💸 Finances
      Cost per event
      Category trends
      Over / under-spend by semester
    ⚠️ Conflict History
      Which slots clash most
      How the core resolved them
    🧾 Receipts
      Linked to each expense
      Audit-ready
    📝 Notes
      Lessons learned
      Vendor contacts
```

> 💡 *Planning a hackathon? Search last year's: what it cost, what clashed, and which slots stayed free.*

---

## 🧰 Tech Stack

<div align="center">

| Layer | Technology | Why |
|---|---|---|
| 🎨 **Frontend** | Next.js · Tailwind CSS · shadcn/ui · FullCalendar | Fast, accessible UI with a rich drag-and-view calendar |
| ⚙️ **Backend** | Next.js API Routes (Node.js) | One deployable, shared types end-to-end |
| 🗄️ **Database** | PostgreSQL + Prisma | Relational integrity for events ↔ expenses ↔ receipts |
| ☁️ **Storage** | Cloudinary / AWS S3 | Secure, signed receipt uploads |
| 🔐 **Auth** | NextAuth.js | OAuth / credentials sessions with role claims |

</div>

---

## 📁 Project Structure

```bash
syncacm/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                 # demo data: clubs, venues, ₹50k semester budget
├── src/
│   ├── app/
│   │   ├── (auth)/login/
│   │   ├── calendar/           # FullCalendar view + conflict badges
│   │   ├── events/             # submit, verify, history
│   │   ├── expenses/           # log, filter, receipts
│   │   ├── dashboard/          # budget gauges and charts
│   │   ├── archive/            # institutional memory
│   │   └── api/
│   │       ├── events/
│   │       ├── conflicts/
│   │       ├── expenses/
│   │       ├── analytics/
│   │       └── upload/         # signed upload endpoint
│   ├── components/ui/          # shadcn components
│   ├── lib/
│   │   ├── conflicts.ts        # overlap engine
│   │   ├── auth.ts             # NextAuth config + RBAC helpers
│   │   ├── analytics.ts        # monthly / semester aggregations
│   │   └── notify.ts           # alerts
│   └── middleware.ts           # route protection by role
└── .env.example
```

---

## 🔌 API Reference

| Method | Endpoint | Role | Description |
|:---:|---|:---:|---|
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/events` | All | List verified events (filter by date, club, type) |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/events` | Exec+ | Submit event, runs conflict check, returns flags |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/events/check` | Exec+ | Dry-run conflict check before submitting |
| ![PATCH](https://img.shields.io/badge/PATCH-F59E0B?style=flat-square) | `/api/events/:id/verify` | Core | Approve / reject / request changes |
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/conflicts` | Core | Open conflict flags with severity |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/expenses` | Exec+ | Record expense (+ receipt URL) |
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/analytics/summary` | Core | Spent, remaining, category and month breakdown |
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/archive` | Exec+ | Historical events, expenses and conflicts |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/upload/sign` | Exec+ | Signed upload params for Cloudinary / S3 |

<details>
<summary><b>📨 Example: submitting the conflicting workshop</b></summary>

```http
POST /api/events
Content-Type: application/json

{
  "name": "Technical Workshop: Intro to Docker",
  "startAt": "2026-11-06T17:00:00+05:30",
  "endAt":   "2026-11-06T19:00:00+05:30",
  "type": "TECHNICAL",
  "audience": ["CSE-2ND-YEAR", "CSE-3RD-YEAR"],
  "expectedAttendance": 120,
  "venueId": "venue_seminar_hall"
}
```

```json
{
  "event": { "id": "evt_8f2a", "status": "PENDING" },
  "conflicts": [
    {
      "severity": "HIGH",
      "with": "Robotics Club - Major Tech Event",
      "overlap": "17:00 - 19:00",
      "sharedAudience": ["CSE-2ND-YEAR"],
      "message": "Potential audience clash. Core team review required."
    }
  ],
  "autoActionTaken": "none"
}
```

</details>

---

## 🚀 Quick Start

### 1️⃣ Clone and install

```bash
git clone https://github.com/<your-username>/syncacm.git
cd syncacm
npm install
```

### 2️⃣ Configure environment

```bash
cp .env.example .env
```

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/syncacm"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Receipt storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Optional: email alerts
SMTP_HOST=""
SMTP_USER=""
SMTP_PASS=""
```

### 3️⃣ Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4️⃣ Run it

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

> 🔑 **Demo logins (after seeding):** `member@demo.dev` · `exec@demo.dev` · `core@demo.dev`

---

## ✅ Requirements Checklist

| Mandatory requirement | Status |
|---|:---:|
| Centralized campus event calendar with submission and ACM verification | ✅ |
| Automatic overlap / conflict detection for same-audience events | ✅ |
| Expense module: amount, category, date, event, description, receipts | ✅ |
| Monthly / semester spend, remaining budget, category breakdown | ✅ |
| Institutional memory of events, expenses, patterns, conflicts | ✅ |
| Required tech stack (Next.js, Tailwind, shadcn, FullCalendar, Prisma, PostgreSQL, S3/Cloudinary, NextAuth) | ✅ |

| Good-to-have | Status |
|---|:---:|
| Role-based access control | ✅ |
| Dashboard indicators (spent, remaining, conflict warnings) | ✅ |
| Early overlap alerts for the core team | ✅ |
| Secure receipt storage linked to events and categories | ✅ |

### 🚫 What We Deliberately Avoid

| ❌ Anti-pattern | 🛡️ Our answer |
|---|---|
| Scattered spreadsheets and loose bills | One database, receipts linked to expenses |
| WhatsApp / Instagram as the source of truth | A single verified calendar for all clubs |
| Starting from scratch every year | Permanent, searchable archive |
| Auto-cancelling events | **Flag only.** The core team always makes the call |

---

## 🗺️ Roadmap

```mermaid
timeline
    title SyncACM Roadmap
    section ✅ MVP
        Core : Calendar and event submission
             : Conflict engine
             : Expense tracking and receipts
    section 🔨 Next
        Insights : Semester dashboards
                 : Role-based access
                 : Email and in-app alerts
    section 🔮 Future
        Smart : Suggest free slots automatically
              : iCal / Google Calendar sync
              : CSV / PDF financial export
              : Budget forecasting from past semesters
```

---

## 🤝 Contributing

1. 🍴 Fork the repo
2. 🌿 Create a branch: `git checkout -b feature/amazing-idea`
3. 💾 Commit: `git commit -m "feat: add amazing idea"`
4. 🚀 Push and open a Pull Request

---

## 👥 Team

<div align="center">

| 🧑‍💻 Name | 🎯 Role | 🔗 Links |
|:---:|:---:|:---:|
| *Your Name* | Full-stack | [GitHub](https://github.com/) · [LinkedIn](https://linkedin.com/) |
| *Teammate* | Frontend | [GitHub](https://github.com/) · [LinkedIn](https://linkedin.com/) |
| *Teammate* | Backend | [GitHub](https://github.com/) · [LinkedIn](https://linkedin.com/) |

</div>

---

<div align="center">

### 📜 License

Released under the **MIT License**.

<br/>

**Built with 💜 for the ACM core, and for every team that comes after.**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,50:3B82F6,100:7F00FF&height=140&section=footer" width="100%" alt="footer"/>

</div>
