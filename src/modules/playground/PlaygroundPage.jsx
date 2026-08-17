import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync.js';
import { getGameResults } from './PlaygroundService.js';
import { TriviaGame } from './components/TriviaGame.jsx';
import { MemoryGame } from './components/MemoryGame.jsx';
import { ClickerGame } from './components/ClickerGame.jsx';
import { TrophyShelf } from './components/TrophyShelf.jsx';
import { HiddenNoteReveal } from '../loveNotes/components/HiddenNoteReveal.jsx';
import { SkeletonLines } from '../../components/ui/Skeleton.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export function PlaygroundPage() {
  const { data: results, isLoading, refetch } = useAsync(() => getGameResults(), []);
  const [rewardKey, setRewardKey] = useState(null);
  const { push } = useToast();

  function handleUnlock(gameKey) {
    setRewardKey(gameKey);
    push('Reward unlocked — check the note icon above!', { type: 'success' });
    refetch();
  }

  return (
    <div className="space-y-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-oxblood-700">Playground</h1>
          <p className="text-charcoal-light mt-1">Little games with real rewards.</p>
        </div>
        <HiddenNoteReveal unlockKey={rewardKey || undefined} label="Open your latest reward" />
      </header>

      <section aria-labelledby="trophy-heading">
        <h2 id="trophy-heading" className="text-xl font-display font-semibold text-oxblood-700 mb-3">Trophy Shelf</h2>
        {isLoading ? <SkeletonLines count={2} /> : <TrophyShelf results={results} />}
      </section>

      <section aria-labelledby="trivia-heading">
        <h2 id="trivia-heading" className="text-xl font-display font-semibold text-oxblood-700 mb-3">How Well Do You Know Me?</h2>
        <TriviaGame onUnlock={handleUnlock} />
      </section>

      <section aria-labelledby="memory-heading">
        <h2 id="memory-heading" className="text-xl font-display font-semibold text-oxblood-700 mb-3">Memory Match</h2>
        <MemoryGame onUnlock={handleUnlock} />
      </section>

      <section aria-labelledby="clicker-heading">
        <h2 id="clicker-heading" className="text-xl font-display font-semibold text-oxblood-700 mb-3">Heart Collector</h2>
        <ClickerGame onUnlock={handleUnlock} />
      </section>
    </div>
  );
}
