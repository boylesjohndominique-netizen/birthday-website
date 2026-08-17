import { HeartCrack } from 'lucide-react';

export function EmptyState({ icon: Icon = HeartCrack, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-12 px-6">
      <Icon size={32} className="text-oxblood-300" aria-hidden="true" />
      <h3 className="text-lg font-display font-semibold text-oxblood-600">{title}</h3>
      {description && <p className="text-sm text-charcoal-light max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
