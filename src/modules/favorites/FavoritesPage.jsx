import { useMemo, useState } from 'react';
import { Link2, PartyPopper } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync.js';
import { getFavorites, addFavorite, toggleTodo } from './FavoritesService.js';
import { MusicSection } from './components/MusicSection.jsx';
import { TodoSection } from './components/TodoSection.jsx';
import { QuotesCarousel } from './components/QuotesCarousel.jsx';
import { ShuffleFavorite } from './components/ShuffleFavorite.jsx';
import { SkeletonLines } from '../../components/ui/Skeleton.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useTheme } from '../../app/providers/ThemeProvider.jsx';

export function FavoritesPage() {
  const { data: favorites, isLoading, isError, refetch } = useAsync(() => getFavorites(), []);
  const [items, setItems] = useState(null);
  const [surpriseOpen, setSurpriseOpen] = useState(null);
  const { prefersReducedMotion } = useTheme();

  const list = items || favorites || [];

  const byType = useMemo(() => {
    const groups = { music: [], todo: [], quote: [], link: [], video: [], surprise: [] };
    list.forEach((f) => {
      if (f.is_surprise) groups.surprise.push(f);
      else if (groups[f.type]) groups[f.type].push(f);
    });
    return groups;
  }, [list]);

  async function handleToggle(id, completed) {
    setItems((prev) => (prev || favorites).map((f) => (f.id === id ? { ...f, completed } : f)));
    await toggleTodo(id, completed);
  }

  async function handleAddTodo(title) {
    const { data, error } = await addFavorite({ type: 'todo', title, completed: false });
    if (!error && data) {
      setItems((prev) => [...(prev || favorites), data]);
    }
    return { error };
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ivory-100">Favorites Hub</h1>
          <p className="text-blush-300 mt-1">Your songs, your quotes, our list of things to do.</p>
        </div>
        <ShuffleFavorite />
      </header>

      {isLoading && <SkeletonLines count={6} />}
      {isError && <ErrorState message="Favorites didn't load." onRetry={refetch} />}

      {!isLoading && !isError && (
        <>
          {byType.surprise.length > 0 && (
            <section aria-labelledby="surprises-heading">
              <h2 id="surprises-heading" className="text-xl font-display font-semibold text-ivory-100 mb-3">
                Surprises
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {byType.surprise.map((s) => (
                  <Card
                    key={s.id}
                    as="button"
                    onClick={() => setSurpriseOpen(s)}
                    className="flex items-center gap-3 text-left"
                  >
                    <PartyPopper size={20} className="text-crimson-500 shrink-0" aria-hidden="true" />
                    <span className="font-medium text-oxblood-700">{s.title}</span>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="music-heading">
            <h2 id="music-heading" className="text-xl font-display font-semibold text-ivory-100 mb-3">Music</h2>
            <MusicSection items={byType.music} />
          </section>

          <section aria-labelledby="quotes-heading">
            <h2 id="quotes-heading" className="text-xl font-display font-semibold text-ivory-100 mb-3">Quotes</h2>
            <QuotesCarousel items={byType.quote} />
          </section>

          <section aria-labelledby="todos-heading">
            <h2 id="todos-heading" className="text-xl font-display font-semibold text-ivory-100 mb-3">To-do together</h2>
            <TodoSection items={byType.todo} onToggle={handleToggle} onAdd={handleAddTodo} />
          </section>

          <section aria-labelledby="links-heading">
            <h2 id="links-heading" className="text-xl font-display font-semibold text-ivory-100 mb-3">Links & videos</h2>
            {byType.link.length + byType.video.length === 0 ? (
              <EmptyState icon={Link2} title="Nothing saved yet" description="Add favorites with type = 'link' or 'video' in Supabase." />
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...byType.link, ...byType.video].map((item) => (
                  <li key={item.id}>
                    <Card as="a" href={item.content} target="_blank" rel="noopener noreferrer" className="block">
                      <p className="font-medium text-oxblood-700">{item.title}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <Modal
        isOpen={Boolean(surpriseOpen)}
        onClose={() => setSurpriseOpen(null)}
        title={surpriseOpen?.title}
        labelledBy="surprise-title"
      >
        <p
          className={
            prefersReducedMotion
              ? 'font-display text-xl text-oxblood-700'
              : 'font-display text-xl text-oxblood-700 animate-[fadeIn_0.4s_ease-out]'
          }
        >
          {surpriseOpen?.content}
        </p>
        <Button className="mt-5" onClick={() => setSurpriseOpen(null)}>Close</Button>
      </Modal>
    </div>
  );
}
