import { useState } from 'react';
import { CheckSquare, Square, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';

export function TodoSection({ items, onToggle, onAdd }) {
  const [draft, setDraft] = useState('');
  const { push } = useToast();

  async function handleAdd(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setDraft('');
    const { error } = await onAdd(title);
    push(error ? "Couldn't save that — try again." : 'Added to the list.', { type: error ? 'error' : 'success' });
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleAdd} className="flex gap-2">
        <label htmlFor="new-todo" className="sr-only">Add a to-do</label>
        <input
          id="new-todo"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add something for us to do..."
          className="flex-1 rounded-full border border-oxblood-100 bg-white px-4 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-500"
        />
        <Button type="submit" variant="secondary" icon={Plus} aria-label="Add to-do">
          Add
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No to-dos yet" description="Add one above, or seed some in Supabase." />
      ) : (
        <ul className="space-y-2" aria-label="Shared to-do list">
          {items.map((item) => (
            <li key={item.id}>
              <Card
                as="button"
                onClick={() => onToggle(item.id, !item.completed)}
                aria-pressed={item.completed}
                className="w-full flex items-center gap-3 text-left"
              >
                {item.completed ? (
                  <CheckSquare size={20} className="text-crimson-500 shrink-0" aria-hidden="true" />
                ) : (
                  <Square size={20} className="text-oxblood-300 shrink-0" aria-hidden="true" />
                )}
                <span className={item.completed ? 'line-through text-charcoal-light' : 'text-charcoal'}>
                  {item.title}
                </span>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
