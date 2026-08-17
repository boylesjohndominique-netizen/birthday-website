import { useState } from 'react';
import { Sun, Moon, SunMoon, Lock, Unlock } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { isSupabaseConfigured } from '../../services/supabaseClient.js';

const MODES = [
  { value: 'auto', label: 'Automatic', icon: SunMoon },
  { value: 'day', label: 'Day', icon: Sun },
  { value: 'night', label: 'Night', icon: Moon },
];

export function SettingsPage() {
  const { mode, setMode, secretUnlocked, unlockSecret, lockSecret } = useTheme();
  const [passphrase, setPassphrase] = useState('');
  const { push } = useToast();

  function handleUnlock(e) {
    e.preventDefault();
    const ok = unlockSecret(passphrase);
    push(ok ? 'Secret mode unlocked.' : "That's not quite it.", { type: ok ? 'success' : 'error' });
    setPassphrase('');
  }

  return (
    <div className="space-y-8 max-w-lg">
      <header>
        <h1 className="text-3xl font-display font-semibold text-ivory-100">Settings</h1>
        <p className="text-blush-300 mt-1">Small preferences, so the app feels right.</p>
      </header>

      <section aria-labelledby="theme-heading">
        <h2 id="theme-heading" className="text-lg font-display font-semibold text-ivory-100 mb-3">Theme</h2>
        <div className="flex gap-2" role="radiogroup" aria-labelledby="theme-heading">
          {MODES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              onClick={() => setMode(value)}
              className={`flex-1 flex flex-col items-center gap-1.5 rounded-lg border py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-500 ${
                mode === value ? 'border-crimson-400 bg-blush-100 text-oxblood-700' : 'border-oxblood-700 text-blush-300 hover:bg-oxblood-800'
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="secret-heading">
        <h2 id="secret-heading" className="text-lg font-display font-semibold text-ivory-100 mb-3">Secret mode</h2>
        <Card>
          {secretUnlocked ? (
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm text-charcoal">
                <Unlock size={16} className="text-crimson-500" aria-hidden="true" /> Unlocked for this session.
              </p>
              <Button variant="secondary" onClick={lockSecret}>Lock again</Button>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="space-y-3">
              <label htmlFor="passphrase" className="flex items-center gap-2 text-sm font-medium text-oxblood-700">
                <Lock size={16} aria-hidden="true" /> Enter the passphrase
              </label>
              <div className="flex gap-2">
                <input
                  id="passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="flex-1 rounded-full border border-oxblood-100 bg-white px-4 py-2.5 text-sm text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-500"
                  autoComplete="off"
                />
                <Button type="submit">Unlock</Button>
              </div>
              <p className="text-xs text-oxblood-300">
                This is a light surprise gate, not real security. True privacy requires Supabase Auth — see the README.
              </p>
            </form>
          )}
        </Card>
      </section>

      <section aria-labelledby="status-heading">
        <h2 id="status-heading" className="text-lg font-display font-semibold text-ivory-100 mb-3">Connection</h2>
        <Card>
          <p className="text-sm text-charcoal">
            Supabase: {isSupabaseConfigured ? <span className="text-crimson-500 font-medium">connected</span> : <span className="text-oxblood-400 font-medium">not configured — running on demo content</span>}
          </p>
        </Card>
      </section>
    </div>
  );
}
