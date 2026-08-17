import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';

export function QuotesCarousel({ items }) {
  const [index, setIndex] = useState(0);

  if (!items.length) {
    return <EmptyState icon={Quote} title="No quotes yet" description="Add a favorites row with type = 'quote' in Supabase." />;
  }

  const current = items[index % items.length];

  return (
    <Card className="relative">
      <Quote size={22} className="text-gold mb-2" aria-hidden="true" />
      <p className="font-display text-xl text-oxblood-700 leading-snug min-h-[3.5rem]" aria-live="polite">
        {current.content || current.title}
      </p>
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
          aria-label="Previous quote"
          className="icon-btn"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <span className="text-xs text-oxblood-300">{(index % items.length) + 1} / {items.length}</span>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % items.length)}
          aria-label="Next quote"
          className="icon-btn"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}
