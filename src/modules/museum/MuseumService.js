import { safeQuery, isSupabaseConfigured } from '../../services/supabaseClient.js';
import { getPhotoUrl as resolvePhotoUrl } from '../../services/storageService.js';
import { DEMO_PHOTOS } from '../../lib/constants.js';

export { resolvePhotoUrl as getPhotoUrl };

export async function getPhotos() {
  if (!isSupabaseConfigured) {
    return { data: DEMO_PHOTOS, error: null };
  }
  return safeQuery((client) => client.from('photos').select('*').order('sort_order', { ascending: true }));
}

export async function getPhotosByTag(tag) {
  const { data, error } = await getPhotos();
  if (error || !data) return { data: null, error };
  if (!tag) return { data, error: null };
  return { data: data.filter((p) => (p.tags || []).includes(tag)), error: null };
}

export function getAllTags(photos) {
  const set = new Set();
  (photos || []).forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function getAllYears(photos) {
  const set = new Set();
  (photos || []).forEach((p) => {
    if (p.taken_on) set.add(new Date(p.taken_on).getFullYear());
  });
  return Array.from(set).sort((a, b) => b - a);
}

export async function getSpecialExhibit() {
  const { data, error } = await getPhotos();
  if (error || !data) return { data: [], error };
  return { data: data.filter((p) => p.is_special), error: null };
}
