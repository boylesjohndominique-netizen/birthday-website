import { format, isValid, parseISO, differenceInSeconds } from 'date-fns';

export function formatDisplayDate(dateLike, pattern = 'MMMM d, yyyy') {
  if (!dateLike) return '';
  const d = typeof dateLike === 'string' ? parseISO(dateLike) : dateLike;
  if (!isValid(d)) return '';
  return format(d, pattern);
}

export function getYear(dateLike) {
  if (!dateLike) return null;
  const d = typeof dateLike === 'string' ? parseISO(dateLike) : dateLike;
  if (!isValid(d)) return null;
  return d.getFullYear();
}

/** Returns { days, hours, minutes, seconds, totalSeconds, isPast } counting down to targetDate. */
export function getCountdownParts(targetDate) {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  if (!isValid(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isPast: false, isValid: false };
  }
  const totalSeconds = differenceInSeconds(target, new Date());
  const isPast = totalSeconds <= 0;
  const abs = Math.abs(totalSeconds);
  const days = Math.floor(abs / 86400);
  const hours = Math.floor((abs % 86400) / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  const seconds = Math.floor(abs % 60);
  return { days, hours, minutes, seconds, totalSeconds, isPast, isValid: true };
}

/** Deterministic day-of-year index, stable per calendar day in the local timezone. */
export function dayOfYearIndex(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
