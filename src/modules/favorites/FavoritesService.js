import { safeQuery, isSupabaseConfigured } from '../../services/supabaseClient.js';

const DEMO_FAVORITES = [
  { id: 'demo-1', type: 'music', title: 'Our song', content: 'https://open.spotify.com/', meta: { artist: 'Placeholder Artist' }, is_surprise: false, completed: false, sort_order: 0 },
  { id: 'demo-2', type: 'quote', title: 'Something you said once', content: '"I didn\'t know a person could feel like home."', meta: {}, is_surprise: false, completed: false, sort_order: 1 },
  { id: 'demo-3', type: 'todo', title: 'Watch the sunset at that one spot again', content: null, meta: {}, is_surprise: false, completed: false, sort_order: 2 },
  { id: 'demo-4', type: 'todo', title: 'Try that ramen place downtown', content: null, meta: {}, is_surprise: false, completed: true, sort_order: 3 },
  { id: 'demo-5', type: 'link', title: 'The article you kept talking about', content: 'https://example.com', meta: {}, is_surprise: false, completed: false, sort_order: 4 },
  { id: 'demo-6', type: 'quote', title: 'Surprise', content: 'You are, without question, my favorite person.', meta: {}, is_surprise: true, completed: false, sort_order: 5 },
];

let demoStore = null;
function getDemoStore() {
  if (!demoStore) demoStore = DEMO_FAVORITES.map((f) => ({ ...f }));
  return demoStore;
}

export async function getFavorites() {
  if (!isSupabaseConfigured) {
    return { data: getDemoStore(), error: null };
  }
  return safeQuery((client) => client.from('favorites').select('*').order('sort_order', { ascending: true }));
}

export async function addFavorite(favorite) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore();
    const item = { id: `demo-${Date.now()}`, sort_order: store.length, completed: false, is_surprise: false, meta: {}, ...favorite };
    store.push(item);
    return { data: item, error: null };
  }
  return safeQuery((client) => client.from('favorites').insert(favorite).select().single());
}

export async function updateFavorite(id, patch) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore();
    const idx = store.findIndex((f) => f.id === id);
    if (idx === -1) return { data: null, error: { message: 'Not found' } };
    store[idx] = { ...store[idx], ...patch };
    return { data: store[idx], error: null };
  }
  return safeQuery((client) => client.from('favorites').update(patch).eq('id', id).select().single());
}

export async function deleteFavorite(id) {
  if (!isSupabaseConfigured) {
    demoStore = getDemoStore().filter((f) => f.id !== id);
    return { data: { id }, error: null };
  }
  return safeQuery((client) => client.from('favorites').delete().eq('id', id));
}

export async function toggleTodo(id, completed) {
  return updateFavorite(id, { completed });
}

export async function getRandomFavorite() {
  const { data, error } = await getFavorites();
  if (error || !data?.length) return { data: null, error };
  return { data: data[Math.floor(Math.random() * data.length)], error: null };
}
