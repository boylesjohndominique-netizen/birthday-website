import { Trophy } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';

const LABELS = { trivia: 'Trivia Master', memory: 'Memory Match', clicker: 'Heart Collector' };

export function TrophyShelf({ results }) {
  const unlocked = Object.entries(results || {}).filter(([, r]) => r?.unlocked);

  if (!unlocked.length) {
    return <EmptyState icon={Trophy} title="No trophies yet" description="Play a game below to earn your first reward." />;
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3" aria-label="Trophy shelf">
      {unlocked.map(([key, r]) => (
        <li key={key}>
          <Card className="flex flex-col items-center text-center gap-1 py-4">
            <Trophy size={22} className="text-gold" aria-hidden="true" />
            <span className="text-sm font-medium text-oxblood-700">{LABELS[key] || key}</span>
            {typeof r.score === 'number' && <span className="text-xs text-oxblood-300">Score: {r.score}</span>}
          </Card>
        </li>
      ))}
    </ul>
  );
}
