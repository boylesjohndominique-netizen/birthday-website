import { AlertTriangle } from 'lucide-react';
import { Button } from './Button.jsx';

export function ErrorState({ message = 'Something didn\'t load correctly.', onRetry }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-12 px-6" role="alert">
      <AlertTriangle size={28} className="text-crimson-500" aria-hidden="true" />
      <p className="text-sm text-charcoal-light max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
