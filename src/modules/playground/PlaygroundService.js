import { safeQuery, isSupabaseConfigured } from '../../services/supabaseClient.js';
import { DEMO_TRIVIA } from '../../lib/constants.js';

const LOCAL_KEY = 'gift-app:games';

function readLocalGames() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
  } catch {
    return {};
  }
}

function writeLocalGames(games) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(games));
}

export async function getTriviaQuestions() {
  if (!isSupabaseConfigured) return { data: DEMO_TRIVIA, error: null };
  const { data, error } = await safeQuery((client) => client.from('game_questions').select('*'));
  if (error || !data?.length) return { data: DEMO_TRIVIA, error: null };
  return { data, error: null };
}

/** Persists a game result. Falls back to localStorage when Supabase isn't configured. */
export async function saveGameResult(gameKey, { score, unlocked, unlockedPayload }) {
  if (!isSupabaseConfigured) {
    const games = readLocalGames();
    games[gameKey] = { score, unlocked, unlocked_payload: unlockedPayload || {}, updated_at: new Date().toISOString() };
    writeLocalGames(games);
    return { data: games[gameKey], error: null };
  }
  return safeQuery((client) =>
    client
      .from('games')
      .upsert({ game_key: gameKey, score, unlocked, unlocked_payload: unlockedPayload || {} }, { onConflict: 'game_key' })
      .select()
      .single()
  );
}

export async function getGameResults() {
  if (!isSupabaseConfigured) return { data: readLocalGames(), error: null };
  const { data, error } = await safeQuery((client) => client.from('games').select('*'));
  if (error) return { data: {}, error };
  const byKey = {};
  (data || []).forEach((row) => {
    byKey[row.game_key] = row;
  });
  return { data: byKey, error: null };
}
