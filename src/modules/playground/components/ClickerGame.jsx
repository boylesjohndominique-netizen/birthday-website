import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { saveGameResult } from '../PlaygroundService.js';
import { useTheme } from '../../../app/providers/ThemeProvider.jsx';

const MILESTONES = [10, 25, 50];

export function ClickerGame({ onUnlock }) {
  const [hearts, setHearts] = useState(0);
  const [reachedMilestones, setReachedMilestones] = useState([]);
  const [burst, setBurst] = useState(0);
  const { prefersReducedMotion } = useTheme();

  async function handleClick() {
    const next = hearts + 1;
    setHearts(next);
    setBurst((b) => b + 1);

    const newlyReached = MILESTONES.filter((m) => next >= m && !reachedMilestones.includes(m));
    if (newlyReached.length) {
      setReachedMilestones((prev) => [...prev, ...newlyReached]);
      await saveGameResult('clicker', { score: next, unlocked: true });
      onUnlock?.('clicker');
    }
  }

  const nextMilestone = MILESTONES.find((m) => hearts < m);

  return (
    <Card className="text-center space-y-4">
      <p className="text-sm text-charcoal-light">
        {nextMilestone ? `${nextMilestone - hearts} more to the next surprise` : 'All milestones reached!'}
      </p>
      <p className="text-4xl font-display font-semibold text-oxblood-700" aria-live="polite">{hearts}</p>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Collect a heart, ${hearts} collected so far`}
        className="mx-auto h-24 w-24 rounded-full bg-crimson-500 text-ivory-100 flex items-center justify-center shadow-soft active:scale-90 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-700"
      >
        <Heart
          key={prefersReducedMotion ? 'static' : burst}
          size={36}
          fill="currentColor"
          className={prefersReducedMotion ? '' : 'animate-[floatUp_0.4s_ease-out]'}
          aria-hidden="true"
        />
      </button>
      {reachedMilestones.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-2 text-xs text-oxblood-400">
          {reachedMilestones.map((m) => (
            <li key={m} className="tag-pill">{m} hearts unlocked</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
