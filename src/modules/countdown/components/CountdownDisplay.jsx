import { useTheme } from '../../../app/providers/ThemeProvider.jsx';

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

/** progress: 0..1 fraction of the way to the target (for the ring). */
export function CountdownDisplay({ parts, progress = 0 }) {
  const { prefersReducedMotion } = useTheme();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-blush-100" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={prefersReducedMotion ? 'text-crimson-500' : 'text-crimson-500 transition-[stroke-dashoffset] duration-1000 ease-linear'}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-semibold text-oxblood-700" aria-hidden="true">
            {parts.days}
          </span>
          <span className="text-xs uppercase tracking-wide text-oxblood-300" aria-hidden="true">
            days left
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-sm" role="timer" aria-live="polite" aria-atomic="true">
        {UNITS.map((u) => (
          <div key={u.key} className="surface-card py-3 flex flex-col items-center">
            <span className="text-2xl font-display font-semibold text-oxblood-700 tabular-nums">
              {String(parts[u.key]).padStart(2, '0')}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-oxblood-300">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
