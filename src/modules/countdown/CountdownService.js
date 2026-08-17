import { safeQuery, isSupabaseConfigured } from '../../services/supabaseClient.js';
import { FALLBACK_BIRTHDAY_ISO } from '../../lib/constants.js';

export async function getEvent(eventKey) {
  if (!isSupabaseConfigured) {
    return {
      data: { event_key: eventKey, name: 'Birthday', event_at: FALLBACK_BIRTHDAY_ISO, celebrated: false, description: null },
      error: null,
    };
  }
  const { data, error } = await safeQuery((client) =>
    client.from('events').select('*').eq('event_key', eventKey).maybeSingle()
  );
  if (!data && !error) {
    return {
      data: { event_key: eventKey, name: 'Birthday', event_at: FALLBACK_BIRTHDAY_ISO, celebrated: false, description: null },
      error: null,
    };
  }
  return { data, error };
}

/** Marks the event as celebrated. Requires a write policy permitting this — see schema.sql. */
export async function markCelebrated(eventKey) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return safeQuery((client) =>
    client.from('events').update({ celebrated: true }).eq('event_key', eventKey).select().maybeSingle()
  );
}
