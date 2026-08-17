import { useState } from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider.jsx';

const CANDLE_COUNT = 5;

export function CandleInteraction({ onAllBlownOut }) {
  const [lit, setLit] = useState(Array.from({ length: CANDLE_COUNT }, () => true));
  const { prefersReducedMotion } = useTheme();

  function blowOut(index) {
    setLit((prev) => {
      const next = prev.map((v, i) => (i === index ? false : v));
      if (next.every((v) => !v)) onAllBlownOut?.();
      return next;
    });
  }

  const allOut = lit.every((v) => !v);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-blush-300">
        {allOut ? 'Make a wish. I hope it already came true.' : 'Tap each candle to blow it out.'}
      </p>
      <div className="flex items-end gap-3" role="group" aria-label="Birthday candles">
        {lit.map((isLit, i) => (
          <button
            key={i}
            type="button"
            onClick={() => blowOut(i)}
            disabled={!isLit}
            aria-pressed={!isLit}
            aria-label={isLit ? `Blow out candle ${i + 1}` : `Candle ${i + 1}, already out`}
            className="flex flex-col items-center gap-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-500 rounded"
          >
            <span
              className={
                isLit
                  ? prefersReducedMotion
                    ? 'block h-4 w-2.5 rounded-full bg-gold-soft mb-0.5'
                    : 'block h-4 w-2.5 rounded-full bg-gold-soft mb-0.5 animate-flicker'
                  : 'block h-0 w-2.5 mb-0.5'
              }
              aria-hidden="true"
            />
            <span className="block h-10 w-3 rounded-sm bg-crimson-400" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
