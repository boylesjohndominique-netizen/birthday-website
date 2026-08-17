import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPhotoUrl } from '../MuseumService.js';
import { formatDisplayDate } from '../../../lib/date.js';
import { CuratorsNote } from './CuratorsNote.jsx';
import { Tag } from '../../../components/ui/Tag.jsx';

export function PhotoLightbox({ photos, index, onClose, onNavigate }) {
  const panelRef = useRef(null);
  const photo = photos[index];

  useEffect(() => {
    panelRef.current?.focus();
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + photos.length) % photos.length);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [index, photos.length, onClose, onNavigate]);

  if (!photo) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-oxblood-900/85 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo: ${photo.caption || 'untitled'}`}
        className="surface-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="icon-btn absolute top-3 right-3 bg-white/70"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <img
          src={getPhotoUrl(photo.storage_path)}
          alt={photo.caption || 'A photo from the archive'}
          className="w-full max-h-[55vh] object-contain bg-oxblood-900/5 rounded-t-keepsake"
        />

        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <button
              type="button"
              onClick={() => onNavigate((index - 1 + photos.length) % photos.length)}
              aria-label="Previous photo"
              className="icon-btn"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <span className="text-xs text-oxblood-300">{index + 1} / {photos.length}</span>
            <button
              type="button"
              onClick={() => onNavigate((index + 1) % photos.length)}
              aria-label="Next photo"
              className="icon-btn"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>

          <h3 className="text-xl font-display font-semibold text-oxblood-700">{photo.caption}</h3>
          {photo.taken_on && <p className="text-sm text-oxblood-300 mt-0.5">{formatDisplayDate(photo.taken_on)}</p>}

          {photo.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {photo.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}

          <CuratorsNote note={photo.curator_note} />
        </div>
      </div>
    </div>,
    document.body
  );
}
