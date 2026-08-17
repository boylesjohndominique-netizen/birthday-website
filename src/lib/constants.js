// Central place for user-editable content and configuration.
// Replace these via .env (see README.md) — no code changes needed for normal customization.

export const RECIPIENT_NAME = import.meta.env.VITE_RECIPIENT_NAME || 'My Love';

export const BIRTHDAY_EVENT_KEY = import.meta.env.VITE_BIRTHDAY_EVENT_KEY || 'birthday';

// Fallback birthday used only if Supabase has no matching event row yet (demo mode).
export const FALLBACK_BIRTHDAY_ISO = '2026-12-31T00:00:00+08:00';

// Simple client-side "secret mode" gate for a bit of surprise UX.
// This is NOT real security — true privacy requires Supabase Auth + RLS. See README.md.
export const SECRET_PASSPHRASE = import.meta.env.VITE_SECRET_PASSPHRASE || 'ourfirstdate';

export const APP_NAME = 'A Keepsake, For You';

// Copy for the welcome envelope that opens the app on every visit.
export const INTRO = {
  overline: 'A private keepsake',
  hint: 'Tap the seal to open',
  envelopeName: `For ${RECIPIENT_NAME}`,
  letterTitle: `For ${RECIPIENT_NAME}, with everything I have.`,
  letterBody:
    'A little world of ours — photos, favorites, notes, and games. ' +
    'Take your time wandering; it was made slowly, like all good things.',
  cta: 'Open the keepsake',
  skip: 'Skip for now',
  signoff: 'A keepsake, from me to you.',
};

export const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/museum', label: 'Museum' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/countdown', label: 'Countdown' },
  { to: '/playground', label: 'Playground' },
  { to: '/settings', label: 'Settings' },
];

// Demo/fallback content shown when Supabase isn't configured yet, or a table is empty.
// Replace real content in Supabase — these exist so the app is usable on first run.
export const DEMO_LOVE_NOTES = [
  'Every timeline I run through in my head, you are in the good ones.',
  'You make ordinary Tuesdays feel like they deserve a soundtrack.',
  'I still remember exactly where I was standing when you laughed for the first time around me.',
  'If I had to pick your laugh out of a crowd of a thousand, I would, every time.',
  'Some people search their whole lives for someone as easy to love as you.',
  'You are the calm I did not know I needed and the excitement I did not expect.',
  'I like the version of me that exists when I am around you.',
];

export const DEMO_PHOTOS = [
  { id: 'demo-1', storage_path: 'sample/photo-01.jpg', caption: 'The trip we almost cancelled', taken_on: '2024-04-12', tags: ['travel', 'sunsets'], curator_note: 'This is the one where you insisted the ferry would be "fine."', is_special: false },
  { id: 'demo-2', storage_path: 'sample/photo-02.jpg', caption: 'Rainy day, good coffee', taken_on: '2024-06-02', tags: ['home', 'quiet'], curator_note: 'Neither of us wanted to leave that cafe.', is_special: false },
  { id: 'demo-3', storage_path: 'sample/photo-03.jpg', caption: 'The look right before you laughed', taken_on: '2024-09-19', tags: ['candid'], curator_note: null, is_special: false },
  { id: 'demo-4', storage_path: 'sample/photo-04.jpg', caption: 'A quiet kind of happy', taken_on: '2025-01-05', tags: ['home'], curator_note: null, is_special: true },
];

export const DEMO_TRIVIA = [
  { id: 'q1', question: 'Where did we go on our first real date?', choices: ['The cafe downtown', 'The beach at Dumaguete', 'A movie theater', 'Nowhere, we stayed in'], answer_index: 0 },
  { id: 'q2', question: "What's my go-to comfort food?", choices: ['Ramen', 'Adobo', 'Pizza', 'Sinigang'], answer_index: 1 },
  { id: 'q3', question: 'Which season do I love most?', choices: ['Summer', 'Rainy season', 'Christmas season', 'Whichever one you\'re in'], answer_index: 3 },
];
