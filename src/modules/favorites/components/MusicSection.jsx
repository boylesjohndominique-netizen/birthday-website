import { Music2, ExternalLink } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';

export function MusicSection({ items }) {
  if (!items.length) {
    return <EmptyState icon={Music2} title="No songs yet" description="Add a favorites row with type = 'music' in Supabase." />;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Favorite music">
      {items.map((item) => (
        <li key={item.id}>
          <Card className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blush-100 flex items-center justify-center text-crimson-500 shrink-0">
              <Music2 size={18} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-oxblood-700 truncate">{item.title}</p>
              {item.meta?.artist && <p className="text-xs text-charcoal-light truncate">{item.meta.artist}</p>}
            </div>
            {item.content && (
              <a
                href={item.content}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.title} in a new tab`}
                className="icon-btn shrink-0"
              >
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
