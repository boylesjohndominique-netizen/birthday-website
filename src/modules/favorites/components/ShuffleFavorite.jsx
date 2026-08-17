import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { getRandomFavorite } from '../FavoritesService.js';
import { getRandomNote } from '../../loveNotes/LoveNotesService.js';

export function ShuffleFavorite() {
  const [open, setOpen] = useState(false);
  const [pair, setPair] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleShuffle() {
    setLoading(true);
    setOpen(true);
    const [{ data: favorite }, { data: note }] = await Promise.all([getRandomFavorite(), getRandomNote()]);
    setPair({ favorite, note });
    setLoading(false);
  }

  return (
    <>
      <Button
        variant="secondary"
        icon={Shuffle}
        onClick={handleShuffle}
        className="border-oxblood-400 text-blush-100 hover:bg-oxblood-700"
      >
        Shuffle a favorite
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="A little pairing" labelledBy="shuffle-title">
        {loading ? (
          <p className="text-charcoal-light">Shuffling…</p>
        ) : (
          <div className="space-y-4">
            {pair?.favorite && (
              <div>
                <p className="text-xs uppercase tracking-wide text-oxblood-300 mb-1">{pair.favorite.type}</p>
                <p className="font-display text-lg text-oxblood-700">{pair.favorite.title}</p>
                {pair.favorite.content && <p className="text-sm text-charcoal-light mt-1">{pair.favorite.content}</p>}
              </div>
            )}
            {pair?.note && (
              <p className="italic text-charcoal-light border-t border-oxblood-100 pt-3">&ldquo;{pair.note.note}&rdquo;</p>
            )}
          </div>
        )}
        <Button className="mt-5" onClick={() => setOpen(false)}>Close</Button>
      </Modal>
    </>
  );
}
