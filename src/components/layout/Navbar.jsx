import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { NAV_ITEMS, APP_NAME } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ivory-200/85 theme-night:bg-oxblood-900/85 border-b border-oxblood-100/50">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between" aria-label="Primary">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-oxblood-600">
          <Heart size={20} className="text-crimson-500" fill="currentColor" aria-hidden="true" />
          <span className="hidden xs:inline">{APP_NAME}</span>
        </NavLink>

        <ul className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                    isActive ? 'bg-crimson-500 text-ivory-100' : 'text-charcoal hover:bg-blush-100'
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="icon-btn sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="sm:hidden border-t border-oxblood-100/50 bg-ivory-200 px-4 py-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-3 rounded-lg text-base font-medium transition-colors',
                    isActive ? 'bg-crimson-500 text-ivory-100' : 'text-charcoal hover:bg-blush-100'
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
