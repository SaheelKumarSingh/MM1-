export const STUDENT_INTERVIEWS = [
  {
    id: 'interview-1',
    name: 'Ananya R.',
    role: 'PGP 2026 · IIM Visakhapatnam',
    campus: 'IIM Visakhapatnam',
    quote: "I missed the Goldman Sachs PPT registration because it got buried under hundreds of unread messages in our section WhatsApp. Mess complaints were sitting on top of PlaceCom notices.",
    painSeverity: 'Critical',
    impact: 'Lost a high-stakes summer process slot',
    currentWorkaround: 'Starring messages & self-forwarding on WhatsApp',
    whyWorkaroundFails: 'When PlaceCom moved the deadline from 5 PM to 3 PM, my starred copy was already wrong.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tags: ['Missed Deadline', 'WhatsApp Clutter', 'Placement Anxiety']
  },
  {
    id: 'interview-2',
    name: 'Kabir M.',
    role: 'PGP 2025 · IIM Visakhapatnam',
    campus: 'IIM Visakhapatnam',
    quote: "Club forms get posted mid-thread. By the time I scroll back after a long day of classes and case prep, the Google Form is closed.",
    painSeverity: 'High',
    impact: 'Missed national case-comp qualifiers',
    currentWorkaround: 'Copying dates into Google Calendar manually',
    whyWorkaroundFails: 'Nobody does it when juggling PlaceCom, clubs, and academics.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tags: ['Manual Copy Error', 'Club Disconnect']
  },
  {
    id: 'interview-3',
    name: 'Priyesha S.',
    role: 'Senior Coordinator, PlaceCom',
    campus: 'IIM Visakhapatnam',
    quote: "We burn hours every day rebroadcasting the same deadline across section groups. Students still ping us at 11:59 asking where the link is.",
    painSeverity: 'Critical',
    impact: '15+ hours/week admin overhead & tracking errors',
    currentWorkaround: 'Excel sheets + manual WhatsApp broadcasts',
    whyWorkaroundFails: 'WhatsApp has no PGP batch eligibility gates or hard countdown.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tags: ['PlaceCom Burden', 'No Structured Publishing']
  },
  {
    id: 'interview-4',
    name: 'Rohan M.',
    role: 'Lead, Consulting & Strategy Club',
    campus: 'IIM Visakhapatnam',
    quote: "Masterclass turnout fell because PGP students muted club groups from notification fatigue. They didn't hate the content — they hated the noise.",
    painSeverity: 'High',
    impact: 'Poor turnout & wasted guest-speaker slots',
    currentWorkaround: 'Posters + Instagram + WhatsApp spam',
    whyWorkaroundFails: 'No reliable calendar reminder tied to a single official deadline.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    tags: ['Notification Fatigue', 'Muted Groups']
  },
  {
    id: 'interview-5',
    name: 'Career Development Office',
    role: 'Placements & Corporate Relations',
    campus: 'IIM Visakhapatnam',
    quote: "Recruiter trust takes a hit when eligible PGP candidates miss processes because of communication failure. We need a zero-noise audit trail for IIMV placement notices.",
    painSeverity: 'Institutional',
    impact: 'Risk to placement outcomes & recruiter relations',
    currentWorkaround: 'Desktop ERP / form links shared on WhatsApp',
    whyWorkaroundFails: 'Students live on mobile; ERP is not their daily habit.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    tags: ['Institutional Audit', 'Recruiter Trust']
  }
];

export const VALIDATION_STATS = [
  { label: 'IIMV PGP students reporting WhatsApp overload daily', value: '94%', subtitle: 'Pilot survey · PGP 2025 & 2026' },
  { label: 'Students who missed ≥1 deadline due to chat clutter', value: '72%', subtitle: 'Several reported placement impact' },
  { label: 'Hours wasted weekly by PlaceCom rebroadcasting', value: '14.5 hrs', subtitle: 'Replaced by 1-click PulseLine publish' },
  { label: 'Drop in deadline anxiety after countdown feed', value: '88%', subtitle: 'Measured in 2-week IIMV pilot' }
];

export const MONETIZATION_MODEL = {
  b2bSubscription: {
    tier1: 'Campus licence for IIMV PGP (single institute)',
    tier2: 'Multi-programme expansion (PGPEx / PhD later)',
    valueProp: 'Placement protection, compliance analytics & audit trails for IIM Visakhapatnam',
  },
  studentFreemium: {
    coreFeed: 'Free for all IIMV PGP students',
    proAddon: 'Optional pro tools later (prep reminders, SMS fallback)',
  }
};
