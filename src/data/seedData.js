// Seed data for IIM Visakhapatnam — PGP programme only
const now = new Date();

export const INSTITUTION = {
  shortName: 'IIM Vizag',
  fullName: 'Indian Institute of Management Visakhapatnam',
  programme: 'PGP',
  programmeFull: 'Post Graduate Programme in Management',
  domain: 'iimv.ac.in',
  tagline: 'PGP deadline engine for IIM Visakhapatnam',
};

/** Batches currently on campus for the two-year PGP */
export const PGP_BATCHES = ['PGP 2026', 'PGP 2025', 'All PGP'];

export const SEED_NOTICES = [
  {
    id: 'notice-1',
    title: 'McKinsey & Co. — Summer Associate Application',
    publisher: 'Placement Committee (PlaceCom)',
    publisherRole: 'IIMV PlaceCom',
    publisherVerified: true,
    category: 'PLACEMENT',
    categoryLabel: 'Placement & Internship',
    eligibleBatches: ['PGP 2026'],
    eligibleBranches: ['Finance', 'Strategy', 'Consulting', 'Analytics'],
    deadline: new Date(now.getTime() + 1 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    applicationUrl: 'https://placecom.iimv.ac.in/apply/mckinsey-sa-2026',
    location: 'Lecture Hall Complex & PlaceCom Portal',
    registrationFee: 'Free',
    requirements: 'PlaceCom-template résumé + CGPA sheet + SoP (max 300 words).',
    description: 'Mandatory registration for McKinsey Summer Associate roles for PGP 2026. Shortlisted students will receive Round 1 PST details on their @iimv.ac.in inbox.',
    officialNote: 'Strict deadline. No extensions under PlaceCom Rule 4.1.',
    whatsappFormatted: `🚨 *IIMV PLACECOM NOTICE* 🚨\n📌 *McKinsey — Summer Associate*\n👥 *Eligible*: PGP 2026 only\n⏰ *CLOSES IN*: 1h 45m\n🔗 *Apply*: https://placecom.iimv.ac.in/apply/mckinsey-sa-2026\n⚠️ Zero extensions. PulseLine zero-noise channel.`,
    stats: { views: 312, applied: 98, calendarAdded: 140 },
    history: [
      { timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), note: 'Published by PlaceCom Lead (P. Sharma)' }
    ]
  },
  {
    id: 'notice-2',
    title: 'Amazon — Associate Product Manager (APM) Campus Drive',
    publisher: 'Placement Committee (PlaceCom)',
    publisherRole: 'IIMV PlaceCom',
    publisherVerified: true,
    category: 'PLACEMENT',
    categoryLabel: 'Placement & Internship',
    eligibleBatches: ['PGP 2025'],
    eligibleBranches: ['Product', 'Strategy', 'Operations', 'Analytics'],
    deadline: new Date(now.getTime() + 6 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
    applicationUrl: 'https://placecom.iimv.ac.in/apply/amazon-apm-2025',
    location: 'Virtual — link mailed after registration',
    registrationFee: 'Free',
    requirements: 'Updated résumé + one product case write-up (1 page).',
    description: 'Full-time APM hiring for graduating PGP 2025. Online case assessment scheduled tonight; bring student ID for identity check.',
    officialNote: 'Only PGP 2025 students registered on PlaceCom portal may apply.',
    whatsappFormatted: `⚡ *IIMV PLACECOM NOTICE* ⚡\n📌 *Amazon APM Campus Drive*\n👥 *Eligible*: PGP 2025\n⏰ *CLOSES IN*: 6h 15m\n🔗 *Apply*: https://placecom.iimv.ac.in/apply/amazon-apm-2025\n⚠️ Assessment link sent only to verified applicants.`,
    stats: { views: 268, applied: 112, calendarAdded: 156 },
    history: [
      { timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), note: 'Published by Placement Coordinator (R. Verma)' }
    ]
  },
  {
    id: 'notice-3',
    title: 'HUL L.I.M.E. Season 16 — IIMV Campus Round',
    publisher: 'Consulting & Strategy Club',
    publisherRole: 'Recognised Student Club',
    publisherVerified: true,
    category: 'CASE_COMP',
    categoryLabel: 'Case Competition',
    eligibleBatches: ['PGP 2026', 'PGP 2025'],
    eligibleBranches: ['All specialisations'],
    deadline: new Date(now.getTime() + 21 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://unstop.com/competitions/hul-lime-season-16',
    location: 'Unstop + IIMV campus round (LHC)',
    registrationFee: 'Free',
    requirements: 'Teams of 3 from IIM Visakhapatnam. Executive summary pitch (3 slides).',
    description: 'HUL flagship marketing & strategy case competition. National finalists get PPI for Management Trainee + prize pool.',
    officialNote: 'Team leader must submit deck before deadline. PlaceCom endorsement required for PPI track.',
    whatsappFormatted: `🏆 *IIMV CLUB ALERT* 🏆\n📌 *HUL L.I.M.E. S16 — Campus Round*\n👥 *Eligible*: PGP 2026 & PGP 2025\n⏰ *CLOSES IN*: 21 hours\n🔗 *Register*: https://unstop.com/competitions/hul-lime-season-16\n💡 PPI track for national finalists.`,
    stats: { views: 410, applied: 126, calendarAdded: 188 },
    history: [
      { timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), note: 'Published by Consult Club Coordinator' }
    ]
  },
  {
    id: 'notice-4',
    title: 'FinCom — VC & Valuation Masterclass (Peak XV)',
    publisher: 'Finance Club (FinCom)',
    publisherRole: 'Recognised Student Club',
    publisherVerified: true,
    category: 'WORKSHOP',
    categoryLabel: 'Workshop & Masterclass',
    eligibleBatches: ['PGP 2026', 'PGP 2025'],
    eligibleBranches: ['All specialisations'],
    deadline: new Date(now.getTime() + 42 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://fincom.iimv.ac.in/masterclass-vc',
    location: 'Seminar Hall 2, Academic Block',
    registrationFee: '₹250 (certificate + Excel models)',
    requirements: 'Laptop with Excel; basic finance comfort.',
    description: 'Hands-on session with Peak XV (Sequoia India) VP on LBO, DCF, and term-sheet evaluation — open to both PGP batches.',
    officialNote: 'Limited to 60 seats, first-come-first-served.',
    whatsappFormatted: `📊 *IIMV FINCOM ALERT* 📊\n📌 *VC & Valuation Masterclass*\n👥 *Eligible*: All PGP\n⏰ *CLOSES IN*: 42 hours\n🔗 *Seat lock*: https://fincom.iimv.ac.in/masterclass-vc\n🎓 Excel model pack included.`,
    stats: { views: 198, applied: 41, calendarAdded: 72 },
    history: [
      { timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(), note: 'Published by FinCom Secretary' }
    ]
  },
  {
    id: 'notice-5',
    title: 'Media Cell — Brand Ambassador Auditions',
    publisher: 'Media Cell',
    publisherRole: 'Student Activity Body',
    publisherVerified: true,
    category: 'CLUB',
    categoryLabel: 'Club Event',
    eligibleBatches: ['PGP 2026', 'PGP 2025'],
    eligibleBranches: ['All specialisations'],
    deadline: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://forms.gle/iimv-mediacell-auditions',
    location: 'Student Activity Centre',
    registrationFee: 'Free',
    requirements: 'Portfolio link or 60-second intro video.',
    description: 'Join the Media Cell covering convocation, corporate talks, fest coverage, and official IIMV social channels.',
    officialNote: 'Auditions over the coming weekend on campus.',
    whatsappFormatted: `🎨 *IIMV MEDIA CELL* 🎨\n📌 *Brand Ambassador Auditions*\n👥 *Eligible*: PGP 2026 & PGP 2025\n⏰ *CLOSES IN*: 3 days\n🔗 *Form*: https://forms.gle/iimv-mediacell-auditions`,
    stats: { views: 156, applied: 28, calendarAdded: 34 },
    history: [
      { timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), note: 'Published by Media Cell Lead' }
    ]
  },
  {
    id: 'notice-6',
    title: 'BCG Strategy Challenge 2026 (EXPIRED DEMO)',
    publisher: 'Placement Committee (PlaceCom)',
    publisherRole: 'IIMV PlaceCom',
    publisherVerified: true,
    category: 'CASE_COMP',
    categoryLabel: 'Case Competition',
    eligibleBatches: ['PGP 2026'],
    eligibleBranches: ['Strategy', 'Consulting'],
    deadline: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://placecom.iimv.ac.in/closed/bcg-2026',
    location: 'Online',
    registrationFee: 'Free',
    requirements: 'Case deck submission.',
    description: 'BCG strategy challenge registration for IIMV PGP — now closed and archived.',
    officialNote: 'Archived automatically by PulseLine after deadline.',
    whatsappFormatted: `❌ *EXPIRED — IIMV PLACECOM* ❌\n📌 *BCG Strategy Challenge 2026*\n⏰ *STATUS*: CLOSED`,
    stats: { views: 520, applied: 186, calendarAdded: 210 },
    history: [
      { timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(), note: 'Published by PlaceCom' },
      { timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), note: 'System: Automatically archived' }
    ]
  }
];

export const STUDENT_PROFILES = [
  {
    id: 'prof-1',
    name: 'Aarav Sharma',
    rollNo: '2024PGP042',
    batch: 'PGP 2026',
    branch: 'Finance & Strategy',
    email: 'aarav.s@iimv.ac.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'prof-2',
    name: 'Sneha Kulkarni',
    rollNo: '2024PGP108',
    batch: 'PGP 2026',
    branch: 'Marketing & Analytics',
    email: 'sneha.k@iimv.ac.in',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'prof-3',
    name: 'Vikramaditya Roy',
    rollNo: '2023PGP118',
    batch: 'PGP 2025',
    branch: 'Operations & Consulting',
    email: 'vikram.roy@iimv.ac.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  }
];

/** Demo accounts — password for all: iimvpgp
 *  Club/committee emails are the allow-list: each email maps to exactly one body.
 */
export const DEMO_USERS = [
  {
    id: 'user-student-1',
    email: 'aarav.s@iimv.ac.in',
    password: 'iimvpgp',
    role: 'student',
    name: 'Aarav Sharma',
    title: 'PGP 2026',
    profileId: 'prof-1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-student-2',
    email: 'sneha.k@iimv.ac.in',
    password: 'iimvpgp',
    role: 'student',
    name: 'Sneha Kulkarni',
    title: 'PGP 2026',
    profileId: 'prof-2',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-student-3',
    email: 'vikram.roy@iimv.ac.in',
    password: 'iimvpgp',
    role: 'student',
    name: 'Vikramaditya Roy',
    title: 'PGP 2025',
    profileId: 'prof-3',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-publisher-1',
    email: 'placecom@iimv.ac.in',
    password: 'iimvpgp',
    role: 'publisher',
    name: 'Priya Sharma',
    title: 'PlaceCom Lead',
    organization: 'Placement Committee (PlaceCom)',
    publisherRole: 'IIMV PlaceCom',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-publisher-2',
    email: 'consult@iimv.ac.in',
    password: 'iimvpgp',
    role: 'publisher',
    name: 'Rohan Mehta',
    title: 'Club Head',
    organization: 'Consulting & Strategy Club',
    publisherRole: 'Recognised Student Club',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-publisher-3',
    email: 'fincom@iimv.ac.in',
    password: 'iimvpgp',
    role: 'publisher',
    name: 'Ananya Iyer',
    title: 'FinCom Secretary',
    organization: 'Finance Club (FinCom)',
    publisherRole: 'Recognised Student Club',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-publisher-4',
    email: 'media@iimv.ac.in',
    password: 'iimvpgp',
    role: 'publisher',
    name: 'Kabir Nair',
    title: 'Media Cell Lead',
    organization: 'Media Cell',
    publisherRole: 'Student Activity Body',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-admin-1',
    email: 'cao@iimv.ac.in',
    password: 'iimvpgp',
    role: 'admin',
    name: 'Career Development Office',
    title: 'IIMV Admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
];

/** Quick lookup: authorised club/committee emails only */
export const AUTHORIZED_PUBLISHER_EMAILS = DEMO_USERS
  .filter((u) => u.role === 'publisher')
  .map((u) => ({ email: u.email, organization: u.organization }));

export const INSTITUTION_METRICS = {
  activeDeadlines: 5,
  avgResponseTimeMin: 14,
  placementCompliance: '99.4%',
  totalStudentsEngaged: 420,
  broadcastsDelivered: 86,
  missedDeadlineRateBefore: '18.2%',
  missedDeadlineRateAfter: '0.6%',
  topPublishers: [
    { name: 'Placement Committee (PlaceCom)', count: 42, compliance: '100%' },
    { name: 'Consulting & Strategy Club', count: 28, compliance: '98%' },
    { name: 'Finance Club (FinCom)', count: 19, compliance: '96%' },
    { name: 'Media Cell', count: 14, compliance: '92%' },
  ]
};
