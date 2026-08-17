import { ScrollText } from 'lucide-react';

export function CuratorsNote({ note }) {
  if (!note) return null;
  return (
    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-oxblood-100/60">
      <ScrollText size={16} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm italic text-charcoal-light">{note}</p>
    </div>
  );
}
