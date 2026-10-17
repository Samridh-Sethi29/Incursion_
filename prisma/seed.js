const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding INCURSION database...');

  // Clean old data
  await prisma.conflictLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.event.deleteMany();
  await prisma.budgetSettings.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Users
  const acmCore = await prisma.user.create({
    data: {
      id: 'usr-acm-lead-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@acm.campus.edu',
      role: 'ACM_CORE',
      clubAffiliation: 'ACM Student Chapter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
    },
  });

  const gdscLead = await prisma.user.create({
    data: {
      id: 'usr-gdsc-lead-2',
      name: 'Priya Patel',
      email: 'priya.patel@gdsc.campus.edu',
      role: 'CLUB_EXEC',
      clubAffiliation: 'GDSC',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    },
  });

  const ieeeLead = await prisma.user.create({
    data: {
      id: 'usr-ieee-lead-3',
      name: 'Karthik Nair',
      email: 'karthik.nair@ieee.campus.edu',
      role: 'CLUB_EXEC',
      clubAffiliation: 'IEEE CS',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    },
  });

  const member = await prisma.user.create({
    data: {
      id: 'usr-student-4',
      name: 'Rohan Verma',
      email: 'rohan.verma@campus.edu',
      role: 'MEMBER',
      clubAffiliation: 'General Student Body',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    },
  });

  // 2. Budget Settings (₹50,000 semester budget from problem statement example)
  await prisma.budgetSettings.create({
    data: {
      id: 'active_budget',
      academicYear: '2026-2027',
      semester: 'Odd 2026',
      totalBudget: 50000.0,
      capRefreshments: 15000.0,
      capPrizes: 15000.0,
      capLogistics: 10000.0,
      capMarketing: 5000.0,
      capSpeaker: 5000.0,
    },
  });

  // Helper date generators relative to today
  const today = new Date();
  const makeDate = (dayOffset, startHour, endHour) => {
    const start = new Date(today);
    start.setDate(today.getDate() + dayOffset);
    start.setHours(startHour, 0, 0, 0);

    const end = new Date(today);
    end.setDate(today.getDate() + dayOffset);
    end.setHours(endHour, 0, 0, 0);

    return { start, end };
  };

  // 3. Create Existing Events & The Prompt's Classic Conflict Scenario
  // GDSC Tech Nexus: 5 PM - 7 PM in Main Auditorium
  const gdscSlot = makeDate(3, 17, 19);
  const gdscEvent = await prisma.event.create({
    data: {
      id: 'evt-gdsc-nexus',
      title: 'GDSC Tech Nexus: Cloud Native & Kubernetes',
      description: 'Hands-on dive into microservices, containerization, and modern cloud deployment pipelines.',
      organizerClub: 'GDSC',
      eventType: 'TECHNICAL',
      targetAudience: 'TECH_CS_IT',
      venue: 'Main Auditorium',
      startDate: gdscSlot.start,
      endDate: gdscSlot.end,
      status: 'VERIFIED',
      conflictSeverity: 'NONE',
      expectedAttendees: 120,
      budgetAllocated: 8000.0,
      academicYear: '2026-2027',
      semester: 'Odd 2026',
      createdById: gdscLead.id,
    },
  });

  // Proposed ACM Technical Workshop: 5 PM - 7 PM (Exact clash with GDSC!)
  const acmSlot = makeDate(3, 17, 19);
  const acmClashEvent = await prisma.event.create({
    data: {
      id: 'evt-acm-rust-workshop',
      title: 'ACM Systems & Rust Hands-On Workshop',
      description: 'Zero-cost abstractions and memory safety in systems programming for computer science undergraduates.',
      organizerClub: 'ACM Student Chapter',
      eventType: 'TECHNICAL',
      targetAudience: 'TECH_CS_IT',
      venue: 'Main Auditorium',
      startDate: acmSlot.start,
      endDate: acmSlot.end,
      status: 'FLAGGED_CONFLICT',
      conflictSeverity: 'HIGH',
      conflictReason: 'Direct Venue & Audience Collision: Both ACM and GDSC scheduled major technical events targeting CS/IT students at 5:00 PM - 7:00 PM in Main Auditorium.',
      expectedAttendees: 90,
      budgetAllocated: 6500.0,
      academicYear: '2026-2027',
      semester: 'Odd 2026',
      createdById: acmCore.id,
    },
  });

  // Record Conflict Log for Core Decision
  await prisma.conflictLog.create({
    data: {
      id: 'cnf-log-01',
      proposedEventId: acmClashEvent.id,
      conflictingEventId: gdscEvent.id,
      conflictType: 'VENUE_CLASH',
      severity: 'HIGH',
      details: 'Physical venue collision and CS student demographic overlap. ACM workshop and GDSC workshop scheduled for 5:00 PM - 7:00 PM at Main Auditorium.',
      isResolved: false,
    },
  });

  // Additional Campus Events
  const ieeeSlot = makeDate(5, 14, 16);
  const ieeeEvent = await prisma.event.create({
    data: {
      id: 'evt-ieee-seminar',
      title: 'IEEE Emerging Trends in AI Ethics & Robotics',
      description: 'Distinguished lecture series discussing governance, automated decision pipelines, and neural networks.',
      organizerClub: 'IEEE CS',
      eventType: 'SEMINAR',
      targetAudience: 'ALL_STUDENTS',
      venue: 'Seminar Hall 2',
      startDate: ieeeSlot.start,
      endDate: ieeeSlot.end,
      status: 'VERIFIED',
      conflictSeverity: 'NONE',
      expectedAttendees: 75,
      budgetAllocated: 4000.0,
      academicYear: '2026-2027',
      semester: 'Odd 2026',
      createdById: ieeeLead.id,
    },
  });

  const rotaractSlot = makeDate(7, 10, 16);
  await prisma.event.create({
    data: {
      id: 'evt-rotaract-drive',
      title: 'Campus Life: Annual Blood Donation & Health Drive',
      description: 'Social welfare initiative in partnership with the Red Cross Society.',
      organizerClub: 'Rotaract Club',
      eventType: 'SPORTS',
      targetAudience: 'ALL_STUDENTS',
      venue: 'Campus Medical Centre & Lawn',
      startDate: rotaractSlot.start,
      endDate: rotaractSlot.end,
      status: 'VERIFIED',
      conflictSeverity: 'NONE',
      expectedAttendees: 200,
      budgetAllocated: 5000.0,
      academicYear: '2026-2027',
      semester: 'Odd 2026',
    },
  });

  const csiSlot = makeDate(10, 15, 18);
  await prisma.event.create({
    data: {
      id: 'evt-csi-hack',
      title: 'CSI Algorithm Sprint: 3-Hour Coding Challenge',
      description: 'Competitive programming contest featuring dynamic programming and graph algorithms.',
      organizerClub: 'CSI Student Branch',
      eventType: 'HACKATHON',
      targetAudience: 'TECH_CS_IT',
      venue: 'Tech Lab 4',
      startDate: csiSlot.start,
      endDate: csiSlot.end,
      status: 'VERIFIED',
      conflictSeverity: 'NONE',
      expectedAttendees: 80,
      budgetAllocated: 3500.0,
      academicYear: '2026-2027',
      semester: 'Odd 2026',
    },
  });

  // 4. Historical Events (Institutional Memory Archive)
  const pastDate1 = new Date('2025-10-14T10:00:00Z');
  const pastDate1End = new Date('2025-10-14T18:00:00Z');
  const pastEvent1 = await prisma.event.create({
    data: {
      id: 'evt-hist-hackathon-2025',
      title: 'ACM Incursion Hackathon 2025',
      description: 'Flagship 24-hour hackathon tackling urban transit and student mental wellness problems.',
      organizerClub: 'ACM Student Chapter',
      eventType: 'HACKATHON',
      targetAudience: 'TECH_CS_IT',
      venue: 'CS Main Labs 1 & 2',
      startDate: pastDate1,
      endDate: pastDate1End,
      status: 'COMPLETED',
      conflictSeverity: 'NONE',
      expectedAttendees: 120,
      actualAttendees: 138,
      budgetAllocated: 18000.0,
      academicYear: '2025-2026',
      semester: 'Odd 2025',
      outcomeNotes: 'Turnout surpassed capacity by 15%. High engagement on AI agent track. Lessons: Lab 2 had insufficient extension cords; future team must procure 12 heavy-duty spike strips in advance.',
      ratingScore: 5,
      createdById: acmCore.id,
    },
  });

  const pastDate2 = new Date('2025-11-20T16:00:00Z');
  const pastDate2End = new Date('2025-11-20T18:00:00Z');
  await prisma.event.create({
    data: {
      id: 'evt-hist-opensource-2025',
      title: 'ACM Git & Open Source Demystified',
      description: 'First year onboarding session for Git version control and GitHub pull request workflows.',
      organizerClub: 'ACM Student Chapter',
      eventType: 'WORKSHOP',
      targetAudience: 'FIRST_YEAR',
      venue: 'Lecture Hall 101',
      startDate: pastDate2,
      endDate: pastDate2End,
      status: 'COMPLETED',
      conflictSeverity: 'LOW',
      conflictReason: 'Audience clash avoided with cultural dance rehearsal by rescheduling from 3 PM to 4 PM.',
      expectedAttendees: 70,
      actualAttendees: 82,
      budgetAllocated: 4000.0,
      academicYear: '2025-2026',
      semester: 'Odd 2025',
      outcomeNotes: 'First-year enthusiasm was exceptional. Moving by 1 hour avoided dance practice noise from adjacent hall. Refreshment coupons worked better than open boxes.',
      ratingScore: 4,
      createdById: acmCore.id,
    },
  });

  // 5. Current Semester Expenses (Tracks against ₹50,000 budget)
  // Sample SVG Receipt Data URLs for previewing realistic bills
  const sampleReceiptUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='100%' height='100%' fill='%23172438' rx='8'/><rect x='20' y='20' width='360' height='220' fill='%23101D2C' rx='6' stroke='%231E324B' stroke-width='2'/><text x='40' y='60' fill='%232563EB' font-family='sans-serif' font-size='18' font-weight='bold'>CAMPUS VENDOR INVOICE</text><text x='40' y='95' fill='%2394A3B8' font-family='sans-serif' font-size='13'>Invoice No: INV-2026-8841</text><text x='40' y='125' fill='%23CBD5E1' font-family='sans-serif' font-size='14'>Item: Snacks & Packaged Juices</text><text x='40' y='155' fill='%23CBD5E1' font-family='sans-serif' font-size='14'>Approved by: ACM Core Treasury</text><line x1='40' y1='175' x2='360' y2='175' stroke='%231E324B' stroke-dasharray='4'/><text x='40' y='210' fill='%2316A37B' font-family='sans-serif' font-size='18' font-weight='bold'>TOTAL PAID: ₹ 6,800.00</text></svg>";

  const expensesData = [
    {
      title: 'High-Grade Vinyl Banners & Standees',
      amount: 3200.0,
      category: 'MARKETING_PRINTING',
      date: new Date(today.getTime() - 14 * 24 * 3600 * 1000),
      description: 'ACM semester branding roll-up standees and campus bulletin board posters.',
      receiptUrl: sampleReceiptUrl,
      receiptName: 'Bill_PrintCraft_Standees.pdf',
      receiptType: 'image/svg+xml',
      status: 'VERIFIED',
      semester: 'Odd 2026',
      academicYear: '2026-2027',
      loggedById: acmCore.id,
    },
    {
      title: 'Refreshments & High-Tea for Speaker Session',
      amount: 6800.0,
      category: 'REFRESHMENTS_FOOD',
      date: new Date(today.getTime() - 10 * 24 * 3600 * 1000),
      description: 'Samosas, cookies, tea, and bottled water for 85 attendees from Campus Cafeteria.',
      receiptUrl: sampleReceiptUrl,
      receiptName: 'Invoice_CampusCafe_8841.pdf',
      receiptType: 'image/svg+xml',
      status: 'VERIFIED',
      semester: 'Odd 2026',
      academicYear: '2026-2027',
      loggedById: acmCore.id,
    },
    {
      title: 'Custom ACM Holographic Stickers & Lanyards',
      amount: 8500.0,
      category: 'SWAG_PRIZES',
      date: new Date(today.getTime() - 6 * 24 * 3600 * 1000),
      description: 'Die-cut vinyl laptop stickers, custom woven lanyards, and badges for member kit.',
      receiptUrl: sampleReceiptUrl,
      receiptName: 'StickerMule_Receipt_9921.pdf',
      receiptType: 'image/svg+xml',
      status: 'VERIFIED',
      semester: 'Odd 2026',
      academicYear: '2026-2027',
      loggedById: acmCore.id,
    },
    {
      title: 'Auditorium Projection & Dual Wireless Lapel Mics',
      amount: 3800.0,
      category: 'LOGISTICS_EQUIPMENT',
      date: new Date(today.getTime() - 2 * 24 * 3600 * 1000),
      description: 'Sound technician overtime and external HDMI signal repeater hire.',
      receiptUrl: sampleReceiptUrl,
      receiptName: 'AV_Rental_TechSupply.pdf',
      receiptType: 'image/svg+xml',
      status: 'VERIFIED',
      semester: 'Odd 2026',
      academicYear: '2026-2027',
      loggedById: acmCore.id,
    },
    {
      title: 'Distinguished Guest Speaker Travel Honorarium',
      amount: 5000.0,
      category: 'SPEAKER_HONORARIUM',
      date: new Date(today.getTime() - 1 * 24 * 3600 * 1000),
      description: 'Cab reimbursement and token honorarium for visiting AI researcher from IIT.',
      receiptUrl: sampleReceiptUrl,
      receiptName: 'Cab_Reimbursement_IIT_Speaker.pdf',
      receiptType: 'image/svg+xml',
      status: 'VERIFIED',
      semester: 'Odd 2026',
      academicYear: '2026-2027',
      loggedById: acmCore.id,
    },
  ];

  for (const exp of expensesData) {
    await prisma.expense.create({ data: exp });
  }

  // Also add historical hackathon expenses
  await prisma.expense.create({
    data: {
      title: 'Incursion Hackathon 2025 Winner Cash Prizes',
      amount: 10000.0,
      category: 'SWAG_PRIZES',
      date: pastDate1,
      description: '1st & 2nd place track prize disbursement for Hackathon 2025.',
      receiptUrl: sampleReceiptUrl,
      receiptName: 'Prizes_BankTransfer_Audit.pdf',
      status: 'VERIFIED',
      semester: 'Odd 2025',
      academicYear: '2025-2026',
      eventId: pastEvent1.id,
      loggedById: acmCore.id,
    },
  });

  await prisma.expense.create({
    data: {
      title: 'Midnight Energy Drinks & Midnight Pizzas',
      amount: 7200.0,
      category: 'REFRESHMENTS_FOOD',
      date: pastDate1,
      description: '24-hour catering for 138 hackathon participants.',
      receiptUrl: sampleReceiptUrl,
      receiptName: 'Dominoes_MidnightCatering.pdf',
      status: 'VERIFIED',
      semester: 'Odd 2025',
      academicYear: '2025-2026',
      eventId: pastEvent1.id,
      loggedById: acmCore.id,
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Active Budget: ₹50,000 | Active Clashes: 1 (ACM vs GDSC)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
