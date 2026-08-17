import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-oxblood-100/50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center gap-2 text-center">
        <p className="flex items-center gap-1.5 text-sm text-charcoal-light">
          Made with <Heart size={14} className="text-crimson-500" fill="currentColor" aria-hidden="true" /> just for you.
        </p>
        <p className="text-xs text-oxblood-300">A private keepsake — not indexed, not shared, just ours.</p>
      </div>
    </footer>
  );
}
