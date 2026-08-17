import { useState } from 'react';
import { Gift } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { getHiddenNoteByKey, getRandomNote } from '../LoveNotesService.js';
import { useTheme } from '../../../app/providers/ThemeProvider.jsx';

/**
 * A small icon trigger that reveals a hidden love note in a modal.
 * Pass unlockKey to fetch a specific note, or omit it for a random one.
 */
export function HiddenNoteReveal({ unlockKey, label = 'Reveal a hidden note', triggerClassName }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const { prefersReducedMotion } = useTheme();

  async function handleOpen() {
    setLoading(true);
    setOpen(true);
    const { data } = unlockKey ? await getHiddenNoteByKey(unlockKey) : await getRandomNote();
    setNote(data);
    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={label}
        className={triggerClassName || 'icon-btn text-blush-200 hover:bg-oxblood-700'}
      >
        <Gift size={18} aria-hidden="true" />
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="A little something" labelledBy="hidden-note-title">
        {loading ? (
          <p className="text-charcoal-light">Unwrapping…</p>
        ) : (
          <p
            className={
              prefersReducedMotion
                ? 'font-display text-2xl text-oxblood-700 leading-snug'
                : 'font-display text-2xl text-oxblood-700 leading-snug animate-[fadeIn_0.4s_ease-out]'
            }
          >
            &ldquo;{note?.note || 'You are loved more than words can carry.'}&rdquo;
          </p>
        )}
        <Button className="mt-5" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal>
    </>
  );
}
