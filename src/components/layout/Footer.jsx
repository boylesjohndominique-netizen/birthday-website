import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-oxblood-700/60 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center gap-2 text-center">
        <p className="flex items-center gap-1.5 text-sm text-blush-300">
          Made with <Heart size={14} className="text-crimson-400" fill="currentColor" aria-hidden="true" /> just for you.
        </p>
        <p className="text-xs text-blush-300/60">A private keepsake — not indexed, not shared, just ours.</p>
      </div>
    </footer>
  );
}
