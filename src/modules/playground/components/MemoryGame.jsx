import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Heart } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { useAsync } from '../../../hooks/useAsync.js';
import { getPhotos, getPhotoUrl } from '../../museum/MuseumService.js';
import { saveGameResult } from '../PlaygroundService.js';
import { SkeletonGrid } from '../../../components/ui/Skeleton.jsx';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PAIR_COUNT = 6;

export function MemoryGame({ onUnlock }) {
  const { data: photos, isLoading } = useAsync(() => getPhotos(), []);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [complete, setComplete] = useState(false);

  const sourcePhotos = useMemo(() => {
    if (!photos?.length) return [];
    // Repeat photos if there aren't enough to fill PAIR_COUNT unique pairs.
    const pool = [];
    while (pool.length < PAIR_COUNT) pool.push(...photos);
    return pool.slice(0, PAIR_COUNT);
  }, [photos]);

  function reset() {
    const deck = shuffle(
      sourcePhotos.flatMap((p, i) => [
        { key: `${p.id}-a-${i}`, photoId: p.id, url: getPhotoUrl(p.storage_path) },
        { key: `${p.id}-b-${i}`, photoId: p.id, url: getPhotoUrl(p.storage_path) },
      ])
    );
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setComplete(false);
  }

  useEffect(() => {
    if (sourcePhotos.length) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcePhotos.length]);

  async function handleFlip(idx) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].photoId)) return;
    const next = [...flipped, idx];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].photoId === cards[b].photoId) {
        const nextMatched = [...matched, cards[a].photoId];
        setTimeout(async () => {
          setMatched(nextMatched);
          setFlipped([]);
          if (nextMatched.length === PAIR_COUNT) {
            setComplete(true);
            await saveGameResult('memory', { score: moves + 1, unlocked: true });
            onUnlock?.('memory');
          }
        }, 500);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  if (isLoading) return <SkeletonGrid count={12} />;
  if (!cards.length) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-charcoal-light">Moves: {moves}</p>
        <Button variant="secondary" icon={RotateCcw} onClick={reset}>Reset</Button>
      </div>

      {complete && (
        <p className="text-center font-display text-lg text-oxblood-700 mb-4" role="status">
          Matched them all in {moves} moves. Reward unlocked!
        </p>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" role="group" aria-label="Memory match game">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.photoId);
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleFlip(idx)}
              aria-label={isFlipped ? 'Matched or revealed card' : 'Hidden card, tap to reveal'}
              className="aspect-square rounded-lg overflow-hidden border border-oxblood-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-500"
            >
              {isFlipped ? (
                <img src={card.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="h-full w-full flex items-center justify-center bg-blush-100 text-crimson-300">
                  <Heart size={18} aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
