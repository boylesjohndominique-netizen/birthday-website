import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const PHOTOS_BUCKET = 'photos';

/**
 * Resolve a public URL for a storage path in the photos bucket.
 * Falls back to a local placeholder path when Supabase isn't configured,
 * so the museum grid still renders something sensible in demo mode.
 */
export function getPhotoUrl(storagePath) {
  if (!storagePath) return '/icons/icon-512.png';
  if (!isSupabaseConfigured) return `/demo-photos/${storagePath.split('/').pop()}`;
  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(storagePath);
  return data?.publicUrl || '/icons/icon-512.png';
}

/**
 * For private galleries, swap getPhotoUrl for this signed-URL variant and set
 * the bucket to private in Supabase. See README.md "Security & privacy".
 */
export async function getSignedPhotoUrl(storagePath, expiresInSeconds = 3600) {
  if (!isSupabaseConfigured) return getPhotoUrl(storagePath);
  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) return getPhotoUrl(storagePath);
  return data.signedUrl;
}

export async function uploadPhoto(file, path) {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase is not configured yet.' } };
  }
  const { data, error } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  return { data, error };
}
