import { useEffect, useRef } from 'react';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { useTheme } from '../../app/providers/ThemeProvider.jsx';

/**
 * Ambient ownership of the page background: a soft pointer-following glow on
 * desktop pointer devices, a gentle starfield at night, and a static warm
 * gradient wash otherwise. Fully inert (no listeners, no animation) when the
 * visitor prefers reduced motion.
 */
function AmbientBackground() {
  const { isNight, prefersReducedMotion } = useTheme();
  const glowRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return undefined;

    let raf = null;
    function handleMove(e) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.setProperty('--x', `${e.clientX}px`);
          glowRef.current.style.setProperty('--y', `${e.clientY}px`);
        }
        raf = null;
      });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className={
          isNight
            ? 'absolute inset-0 bg-gradient-to-b from-oxblood-900 via-oxblood-800 to-oxblood-900'
            : 'absolute inset-0 bg-gradient-to-b from-ivory-200 via-blush-50 to-ivory-300'
        }
      />
      <div className="absolute inset-0 bg-grain" />

      {isNight &&
        Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className={prefersReducedMotion ? 'absolute rounded-full bg-gold-soft/70' : 'absolute rounded-full bg-gold-soft/70 animate-flicker'}
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: i % 5 === 0 ? 3 : 1.5,
              height: i % 5 === 0 ? 3 : 1.5,
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        ))}

      {!prefersReducedMotion && (
        <div
          ref={glowRef}
          className="absolute h-[420px] w-[420px] rounded-full blur-3xl opacity-30 transition-[background] duration-300"
          style={{
            left: 'var(--x, 50%)',
            top: 'var(--y, 30%)',
            transform: 'translate(-50%, -50%)',
            background: isNight
              ? 'radial-gradient(circle, rgba(201,161,90,0.35), transparent 70%)'
              : 'radial-gradient(circle, rgba(179,36,60,0.28), transparent 70%)',
          }}
        />
      )}
    </div>
  );
}

export function AppShell({ children }) {
  return (
    <div className="min-h-dvh flex flex-col relative">
      <AmbientBackground />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-crimson-500 focus:text-ivory-100 focus:px-4 focus:py-2 focus:rounded-full"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
