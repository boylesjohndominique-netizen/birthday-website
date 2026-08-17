import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { SECRET_PASSPHRASE } from '../../lib/constants.js';

const ThemeContext = createContext(null);

function getTimeOfDay(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'day';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

const STORAGE_KEY = 'gift-app:theme-mode'; // 'auto' | 'day' | 'night'
const SECRET_KEY = 'gift-app:secret-unlocked';

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || 'auto');
  const [timeOfDay, setTimeOfDay] = useState(() => getTimeOfDay());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(() => sessionStorage.getItem(SECRET_KEY) === '1');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimeOfDay(getTimeOfDay()), 60_000);
    return () => clearInterval(id);
  }, []);

  const isNight = mode === 'night' || (mode === 'auto' && timeOfDay === 'night');

  useEffect(() => {
    document.documentElement.classList.toggle('theme-night', isNight);
  }, [isNight]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const unlockSecret = useCallback((passphrase) => {
    const ok = passphrase.trim().toLowerCase() === SECRET_PASSPHRASE.trim().toLowerCase();
    if (ok) {
      sessionStorage.setItem(SECRET_KEY, '1');
      setSecretUnlocked(true);
    }
    return ok;
  }, []);

  const lockSecret = useCallback(() => {
    sessionStorage.removeItem(SECRET_KEY);
    setSecretUnlocked(false);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      timeOfDay,
      isNight,
      prefersReducedMotion,
      secretUnlocked,
      unlockSecret,
      lockSecret,
    }),
    [mode, timeOfDay, isNight, prefersReducedMotion, secretUnlocked, unlockSecret, lockSecret]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
