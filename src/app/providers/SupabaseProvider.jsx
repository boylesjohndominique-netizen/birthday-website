import { createContext, useContext, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient.js';

const SupabaseContext = createContext({ supabase: null, isConfigured: false });

export function SupabaseProvider({ children }) {
  const value = useMemo(() => ({ supabase, isConfigured: isSupabaseConfigured }), []);
  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  return useContext(SupabaseContext);
}
