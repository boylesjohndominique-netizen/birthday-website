import { Link } from 'react-router-dom';
import { Image, Heart, Sparkle, Gamepad2, ArrowRight } from 'lucide-react';
import { RECIPIENT_NAME, BIRTHDAY_EVENT_KEY, FALLBACK_BIRTHDAY_ISO } from '../../lib/constants.js';
import { DailyNote } from '../loveNotes/components/DailyNote.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useAsync } from '../../hooks/useAsync.js';
import { getEvent } from '../countdown/CountdownService.js';

const QUICK_LINKS = [
  { to: '/museum', label: 'Museum', description: 'Every moment, on display', icon: Image },
  { to: '/favorites', label: 'Favorites', description: 'Your songs, your lists, your things', icon: Heart },
  { to: '/countdown', label: 'Countdown', description: "Watching the days until your day", icon: Sparkle },
  { to: '/playground', label: 'Playground', description: 'Little games with real rewards', icon: Gamepad2 },
];

export function HomePage() {
  const { data: event } = useAsync(() => getEvent(BIRTHDAY_EVENT_KEY), []);
  const target = event?.event_at || FALLBACK_BIRTHDAY_ISO;
  const { days, isPast } = useCountdown(target);

  return (
    <div className="space-y-10">
      <section aria-labelledby="home-heading" className="pt-4 sm:pt-10">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-soft font-semibold mb-3">
          A private keepsake
        </p>
        <h1 id="home-heading" className="text-4xl sm:text-5xl font-display font-semibold text-ivory-100 leading-tight max-w-2xl">
          For {RECIPIENT_NAME}, with everything I have.
        </h1>
        <p className="mt-4 text-blush-300 max-w-xl">
          {isPast
            ? 'Happy birthday — everything here is for you.'
            : `${days} day${days === 1 ? '' : 's'} until your day. Until then, wander around — there's a lot here I made just for you.`}
        </p>
      </section>

      <section aria-label="Note of the day">
        <DailyNote />
      </section>

      <section aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className="sr-only">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map(({ to, label, description, icon: Icon }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full flex items-center gap-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-soft">
                <div className="h-12 w-12 shrink-0 rounded-full bg-blush-100 flex items-center justify-center text-crimson-500">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg font-semibold text-oxblood-700">{label}</p>
                  <p className="text-sm text-charcoal-light">{description}</p>
                </div>
                <ArrowRight size={18} className="text-oxblood-300 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
