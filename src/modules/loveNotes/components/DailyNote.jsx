import { Sparkles } from 'lucide-react';
import { useAsync } from '../../../hooks/useAsync.js';
import { getDailyNote } from '../LoveNotesService.js';
import { Card } from '../../../components/ui/Card.jsx';
import { SkeletonLines } from '../../../components/ui/Skeleton.jsx';

export function DailyNote() {
  const { data, isLoading } = useAsync(() => getDailyNote(), []);

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start gap-3">
        <Sparkles size={20} className="text-gold shrink-0 mt-1" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-oxblood-300 font-medium mb-1">
            {data?.isSpecial ? 'A note for today' : 'Note of the day'}
          </p>
          {isLoading ? (
            <SkeletonLines count={2} />
          ) : (
            <p className="font-display text-xl text-oxblood-700 leading-snug" aria-live="polite">
              &ldquo;{data?.note}&rdquo;
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
