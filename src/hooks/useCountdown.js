import { useEffect, useState } from 'react';
import { getCountdownParts } from '../lib/date.js';

/** Ticks every second toward targetDate. Returns countdown parts + isValid/isPast flags. */
export function useCountdown(targetDate) {
  const [parts, setParts] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    setParts(getCountdownParts(targetDate));
    const id = setInterval(() => {
      setParts(getCountdownParts(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return parts;
}
