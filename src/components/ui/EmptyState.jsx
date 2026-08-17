import { HeartCrack } from 'lucide-react';

export function EmptyState({ icon: Icon = HeartCrack, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-12 px-6">
      <Icon size={32} className="text-blush-300/70" aria-hidden="true" />
      <h3 className="text-lg font-display font-semibold text-ivory-100">{title}</h3>
      {description && <p className="text-sm text-blush-300 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
