import { getPhotoUrl } from '../MuseumService.js';
import { formatDisplayDate } from '../../../lib/date.js';

export function PhotoGrid({ photos, onSelect }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4" aria-label="Photo archive">
      {photos.map((photo, index) => (
        <li key={photo.id}>
          <button
            type="button"
            onClick={() => onSelect(index)}
            className="group relative block w-full aspect-[3/4] overflow-hidden rounded-keepsake surface-card p-0 [perspective:800px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-500"
            aria-label={`Open photo: ${photo.caption || 'untitled'}${photo.taken_on ? `, ${formatDisplayDate(photo.taken_on)}` : ''}`}
          >
            <img
              src={getPhotoUrl(photo.storage_path)}
              alt={photo.caption || 'A photo from the archive'}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transform-none [transform-style:preserve-3d] group-hover:[transform:rotateY(3deg)_rotateX(2deg)] motion-reduce:group-hover:[transform:none]"
            />
            {photo.is_special && (
              <span className="absolute top-2 right-2 tag-pill bg-gold-soft/90 text-oxblood-800">Special</span>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-oxblood-900/80 via-oxblood-900/20 to-transparent p-3">
              <p className="text-ivory-100 text-xs font-medium truncate text-left">{photo.caption}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
