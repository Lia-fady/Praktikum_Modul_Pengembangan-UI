export const events = [
  {
    id: 1,
    title: 'Vue.js Mastery Workshop',
    date: 'Oct 12, 2026',
    loc: 'Tech Hub, Jakarta',
    cat: 'Workshop',
    desc: 'Learn advanced Vue 3 concepts, Composition API, and state management to build high-performance web applications interactively.',
    price: 'Free',
    seatsLeft: 12,
    summary:
      'Welcome to the biggest web interface development training event of the year! Gatherly is collaborating with the local developer community to host a comprehensive workshop designed specifically to bring together professionals, enthusiasts, and students.',
    agenda: [
      { time: '09:00 AM', label: 'Registration & QR Check-in Scanning' },
      { time: '10:00 AM', label: 'Session 1: Vue Router & Navigation Fundamentals' },
      { time: '11:30 AM', label: 'Coffee Break & Networking Session' },
      { time: '01:00 PM', label: 'Session 2: Layout System & Grid Implementation' },
      { time: '03:00 PM', label: 'Q&A & Closing Remarks' },
    ],
  },
  {
    id: 2,
    title: 'National Tech Meetup',
    date: 'Oct 15, 2026',
    loc: 'Main Auditorium, City Center',
    cat: 'Meetup',
    desc: 'A gathering of hundreds of developers and tech enthusiasts to share the latest industry trends and expand professional networks.',
    price: 'IDR 150.000',
    seatsLeft: 48,
    summary:
      'Join the national technology meetup focused on product innovation, cloud adoption, and community-driven solutions for the modern digital era.',
    agenda: [
      { time: '08:30 AM', label: 'Check-in & Networking' },
      { time: '09:30 AM', label: 'Opening Remarks' },
      { time: '10:00 AM', label: 'Developer Ecosystem Trends' },
      { time: '11:15 AM', label: 'Lightning Talks' },
      { time: '01:00 PM', label: 'Panel Discussion' },
    ],
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    date: 'Nov 02, 2026',
    loc: 'Innovation Center',
    cat: 'Competition',
    desc: 'Watch the best local startup founders pitch their innovative ideas live in front of a panel of renowned investors.',
    price: 'Free',
    seatsLeft: 9,
    summary:
      'Experience a highly competitive platform where promising startups present breakthrough ideas and receive direct feedback from investors and industry leaders.',
    agenda: [
      { time: '09:00 AM', label: 'Registration' },
      { time: '10:00 AM', label: 'Startup Showcase' },
      { time: '12:00 PM', label: 'Investor Roundtable' },
      { time: '02:00 PM', label: 'Pitch Finals' },
      { time: '04:00 PM', label: 'Awarding Ceremony' },
    ],
  },
  {
    id: 4,
    title: 'UI/UX Design Sprint',
    date: 'Nov 10, 2026',
    loc: 'Creative Studio',
    cat: 'Workshop',
    desc: 'A hands-on session on designing user interfaces by implementing layout systems and visual hierarchy principles.',
    price: 'IDR 250.000',
    seatsLeft: 18,
    summary:
      'This sprint dives deep into meaningfully designed interfaces, interaction patterns, and usability validation that help teams create stronger product experiences.',
    agenda: [
      { time: '09:30 AM', label: 'UI Research Review' },
      { time: '10:30 AM', label: 'Wireframing Workshop' },
      { time: '12:00 PM', label: 'Lunch Break' },
      { time: '01:00 PM', label: 'Prototype Critique' },
      { time: '03:00 PM', label: 'User Testing Simulation' },
    ],
  },
  {
    id: 5,
    title: 'Digital Marketing Seminar',
    date: 'Nov 20, 2026',
    loc: 'Grand Hotel Hall',
    cat: 'Seminar',
    desc: 'An in-depth seminar dissecting modern digital marketing strategies, from SEO optimization to user conversion tactics.',
    price: 'IDR 300.000',
    seatsLeft: 21,
    summary:
      'Explore practical strategies to scale acquisition channels, strengthen engagement, and optimize conversion using creative and measurable marketing frameworks.',
    agenda: [
      { time: '09:00 AM', label: 'Registration & Coffee' },
      { time: '10:00 AM', label: 'SEO & Growth Strategy' },
      { time: '11:15 AM', label: 'Paid Ads Fundamentals' },
      { time: '01:00 PM', label: 'Brand Positioning' },
      { time: '02:30 PM', label: 'Q&A & Networking' },
    ],
  },
  {
    id: 6,
    title: 'Community Leaders Summit',
    date: 'Dec 05, 2026',
    loc: 'Gatherly HQ',
    cat: 'Conference',
    desc: 'An exclusive year-end conference for community leaders to formulate sustainable ecosystem development strategies.',
    price: 'IDR 500.000',
    seatsLeft: 7,
    summary:
      'Gather industry leaders, local communities, and changemakers to align on sustainable ecosystem strategies and future-oriented collaboration frameworks.',
    agenda: [
      { time: '08:30 AM', label: 'Welcome Coffee' },
      { time: '09:30 AM', label: 'Opening Keynote' },
      { time: '10:30 AM', label: 'Community Strategy Panels' },
      { time: '12:30 PM', label: 'Lunch & Networking' },
      { time: '02:00 PM', label: 'Closing Commitments' },
    ],
  },
]

export const eventCategories = ['All', ...new Set(events.map((event) => event.cat))]

export function getEventById(id) {
  return events.find((event) => String(event.id) === String(id)) ?? null
}
