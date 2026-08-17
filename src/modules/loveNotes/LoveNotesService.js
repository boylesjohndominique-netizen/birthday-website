import { safeQuery } from '../../services/supabaseClient.js';
import { isSupabaseConfigured } from '../../services/supabaseClient.js';
import { DEMO_LOVE_NOTES } from '../../lib/constants.js';
import { dayOfYearIndex } from '../../lib/date.js';

async function fetchAllNotes() {
  if (!isSupabaseConfigured) {
    return { data: DEMO_LOVE_NOTES.map((note, i) => ({ id: `demo-${i}`, note, note_index: i, visible: true })), error: null };
  }
  return safeQuery((client) =>
    client.from('love_notes').select('*').eq('visible', true).order('note_index', { ascending: true })
  );
}

/** Deterministic "note of the day" — same note all day, changes daily. */
export async function getDailyNote(date = new Date()) {
  const { data, error } = await fetchAllNotes();
  if (error || !data?.length) {
    return { data: { note: "You are loved, today and every day.", isFallback: true }, error };
  }

  // Birthday special note takes priority if today matches special_date.
  const todayISO = date.toISOString().slice(0, 10);
  const special = data.find((n) => n.special_date === todayISO);
  if (special) return { data: { ...special, isSpecial: true }, error: null };

  const idx = dayOfYearIndex(date) % data.length;
  return { data: data[idx], error: null };
}

/** A specific note revealed by an unlock_key (museum easter eggs, game rewards). */
export async function getHiddenNoteByKey(unlockKey) {
  if (!isSupabaseConfigured) {
    const fallback = DEMO_LOVE_NOTES[Math.floor(Math.random() * DEMO_LOVE_NOTES.length)];
    return { data: { note: fallback }, error: null };
  }
  return safeQuery((client) => client.from('love_notes').select('*').eq('unlock_key', unlockKey).maybeSingle());
}

export async function getRandomNote() {
  const { data, error } = await fetchAllNotes();
  if (error || !data?.length) return { data: null, error };
  return { data: data[Math.floor(Math.random() * data.length)], error: null };
}
