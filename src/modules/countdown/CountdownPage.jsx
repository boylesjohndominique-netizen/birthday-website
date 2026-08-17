import { useMemo, useState } from 'react';
import { BIRTHDAY_EVENT_KEY, FALLBACK_BIRTHDAY_ISO } from '../../lib/constants.js';
import { useAsync } from '../../hooks/useAsync.js';
import { getEvent, markCelebrated } from './CountdownService.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { CountdownDisplay } from './components/CountdownDisplay.jsx';
import { CandleInteraction } from './components/CandleInteraction.jsx';
import { CelebrationReveal } from './components/CelebrationReveal.jsx';
import { SkeletonLines } from '../../components/ui/Skeleton.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';

const YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

export function CountdownPage() {
  const { data: event, isLoading, isError, refetch } = useAsync(() => getEvent(BIRTHDAY_EVENT_KEY), []);
  const target = event?.event_at || FALLBACK_BIRTHDAY_ISO;
  const parts = useCountdown(target);
  const [wishMade, setWishMade] = useState(false);
  const [celebratedMarked, setCelebratedMarked] = useState(false);

  const progress = useMemo(() => {
    // Progress ring fills as the (assumed ~1 year) window elapses.
    const remaining = Math.max(parts.totalSeconds, 0);
    return 1 - Math.min(remaining / YEAR_IN_SECONDS, 1);
  }, [parts.totalSeconds]);

  async function handleAllOut() {
    setWishMade(true);
    if (parts.isPast && !celebratedMarked) {
      setCelebratedMarked(true);
      await markCelebrated(BIRTHDAY_EVENT_KEY);
    }
  }

  return (
    <div className="space-y-10 max-w-lg mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-display font-semibold text-oxblood-700">
          {parts.isPast ? "It's your day" : 'Counting down to your day'}
        </h1>
        {event?.description && <p className="text-charcoal-light mt-2">{event.description}</p>}
      </header>

      {isLoading && <SkeletonLines count={4} />}
      {isError && <ErrorState message="Couldn't load the countdown right now." onRetry={refetch} />}

      {!isLoading && !isError && (
        <>
          {!parts.isPast && <CountdownDisplay parts={parts} progress={progress} />}

          {parts.isPast && !wishMade && (
            <CandleInteraction onAllBlownOut={handleAllOut} />
          )}

          {parts.isPast && wishMade && (
            <CelebrationReveal
              message={event?.meta?.celebration_message || 'Here is to another year of us. I love you more than this app could ever say.'}
              musicUrl={event?.meta?.music_url}
            />
          )}
        </>
      )}
    </div>
  );
}
