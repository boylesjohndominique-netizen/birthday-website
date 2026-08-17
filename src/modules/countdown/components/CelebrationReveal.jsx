import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Music, PartyPopper } from 'lucide-react';
import { RECIPIENT_NAME } from '../../../lib/constants.js';
import { Button } from '../../../components/ui/Button.jsx';
import { useTheme } from '../../../app/providers/ThemeProvider.jsx';

export function CelebrationReveal({ message, musicUrl }) {
  const firedRef = useRef(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const { prefersReducedMotion } = useTheme();

  useEffect(() => {
    if (firedRef.current || prefersReducedMotion) return;
    firedRef.current = true;
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#B3243C', '#C9A15A', '#F4D9D6'];

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [prefersReducedMotion]);

  function tryPlayMusic() {
    if (!musicUrl) return;
    const win = window.open(musicUrl, '_blank', 'noopener,noreferrer');
    if (!win) setAudioBlocked(true);
  }

  return (
    <div className="surface-card p-8 text-center space-y-4" role="status" aria-live="assertive">
      <PartyPopper size={32} className="mx-auto text-crimson-500" aria-hidden="true" />
      <h2 className="text-3xl font-display font-semibold text-oxblood-700">
        Happy Birthday, {RECIPIENT_NAME}.
      </h2>
      <p className="text-charcoal-light max-w-md mx-auto">{message}</p>
      {musicUrl && (
        <div>
          <Button icon={Music} onClick={tryPlayMusic}>
            Play our song
          </Button>
          {audioBlocked && (
            <p className="text-xs text-oxblood-300 mt-2">
              Your browser blocked autoplay — tap the button again to open it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
