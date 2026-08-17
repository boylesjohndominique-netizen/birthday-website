import { useMemo, useState } from 'react';
import { useAsync } from '../../hooks/useAsync.js';
import { getPhotos, getAllTags, getAllYears } from './MuseumService.js';
import { PhotoGrid } from './components/PhotoGrid.jsx';
import { PhotoLightbox } from './components/PhotoLightbox.jsx';
import { TimelineFilter } from './components/TimelineFilter.jsx';
import { SpecialExhibit } from './components/SpecialExhibit.jsx';
import { HiddenNoteReveal } from '../loveNotes/components/HiddenNoteReveal.jsx';
import { SkeletonGrid } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useAsync as useAsyncEvent } from '../../hooks/useAsync.js';
import { getEvent } from '../countdown/CountdownService.js';
import { BIRTHDAY_EVENT_KEY } from '../../lib/constants.js';
import { Image } from 'lucide-react';

export function MuseumPage() {
  const { data: photos, isLoading, isError, refetch } = useAsync(() => getPhotos(), []);
  const { data: event } = useAsyncEvent(() => getEvent(BIRTHDAY_EVENT_KEY), []);
  const [activeTag, setActiveTag] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { photos, index }

  const filtered = useMemo(() => {
    if (!photos) return [];
    return photos.filter((p) => {
      const tagOk = !activeTag || (p.tags || []).includes(activeTag);
      const yearOk = !activeYear || (p.taken_on && new Date(p.taken_on).getFullYear() === activeYear);
      return tagOk && yearOk;
    });
  }, [photos, activeTag, activeYear]);

  const tags = useMemo(() => getAllTags(photos), [photos]);
  const years = useMemo(() => getAllYears(photos), [photos]);
  const exhibitUnlocked = Boolean(event?.celebrated);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-oxblood-700">The Museum</h1>
          <p className="text-charcoal-light mt-1">Every moment we've kept, on display.</p>
        </div>
        <HiddenNoteReveal label="Find a hidden note" />
      </header>

      {isLoading && <SkeletonGrid count={9} />}
      {isError && <ErrorState message="The archive didn't load. Check your connection." onRetry={refetch} />}

      {!isLoading && !isError && (
        <>
          <TimelineFilter
            tags={tags}
            years={years}
            activeTag={activeTag}
            activeYear={activeYear}
            onTagChange={setActiveTag}
            onYearChange={setActiveYear}
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={Image}
              title="No photos match those filters"
              description="Try clearing a filter, or add more photos in Supabase."
            />
          ) : (
            <PhotoGrid photos={filtered} onSelect={(i) => setLightbox({ photos: filtered, index: i })} />
          )}

          <section aria-labelledby="special-exhibit-heading" className="pt-6 border-t border-oxblood-100/60">
            <h2 id="special-exhibit-heading" className="text-xl font-display font-semibold text-oxblood-700 mb-4">
              Special Exhibit
            </h2>
            <SpecialExhibit
              unlocked={exhibitUnlocked}
              onSelectPhoto={(exhibitPhotos, i) => setLightbox({ photos: exhibitPhotos, index: i })}
            />
          </section>
        </>
      )}

      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox((prev) => ({ ...prev, index: i }))}
        />
      )}
    </div>
  );
}
