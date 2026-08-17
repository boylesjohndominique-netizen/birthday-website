import { Star } from 'lucide-react';
import { useAsync } from '../../../hooks/useAsync.js';
import { getSpecialExhibit } from '../MuseumService.js';
import { PhotoGrid } from './PhotoGrid.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { SkeletonGrid } from '../../../components/ui/Skeleton.jsx';

/** Unlocked once the birthday event fires or a game unlock grants access. */
export function SpecialExhibit({ unlocked, onSelectPhoto }) {
  const { data: photos, isLoading } = useAsync(() => getSpecialExhibit(), []);

  if (!unlocked) {
    return (
      <EmptyState
        icon={Star}
        title="A special exhibit, sealed for now"
        description="This unlocks on your birthday, or after a game reward. Come back soon."
      />
    );
  }

  if (isLoading) return <SkeletonGrid count={3} />;

  if (!photos?.length) {
    return <EmptyState icon={Star} title="Nothing marked special yet" description="Mark a photo is_special in Supabase to feature it here." />;
  }

  return <PhotoGrid photos={photos} onSelect={(i) => onSelectPhoto(photos, i)} />;
}
