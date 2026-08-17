import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Sparkle, Star } from 'lucide-react';
import { INTRO, APP_NAME } from '../../lib/constants.js';
import { playSealChime } from '../../lib/sound.js';
import { useTheme } from '../../app/providers/ThemeProvider.jsx';

const STAGE = { SEALED: 'sealed', OPENING: 'opening', LETTER: 'letter' };

/**
 * Floating decorative shapes that drift on their own and lean toward the
 * cursor with springy physics (a gentle parallax, no snapping). Each shape
 * has its own depth so near shapes travel further than far ones.
 */
const FLOATING_SHAPES = [
  { icon: Heart, left: '7%', top: '16%', size: 20, depth: 1.8, delay: 0.0, duration: 5.2, className: 'text-crimson-300/50' },
  { icon: Sparkle, left: '88%', top: '20%', size: 24, depth: 1.3, delay: 0.6, duration: 6.0, className: 'text-gold-soft/60' },
  { icon: Star, left: '14%', top: '68%', size: 16, depth: 1.1, delay: 1.1, duration: 5.6, className: 'text-blush-300/70' },
  { icon: Heart, left: '80%', top: '72%', size: 18, depth: 1.9, delay: 0.3, duration: 5.8, className: 'text-crimson-400/40' },
  { icon: Sparkle, left: '24%', top: '30%', size: 14, depth: 0.9, delay: 1.6, duration: 6.4, className: 'text-gold/40' },
  { icon: Star, left: '68%', top: '12%', size: 14, depth: 0.8, delay: 0.9, duration: 5.4, className: 'text-blush-400/50' },
  { icon: Heart, left: '92%', top: '48%', size: 14, depth: 1.4, delay: 1.4, duration: 6.6, className: 'text-crimson-300/40' },
  { icon: Sparkle, left: '6%', top: '46%', size: 18, depth: 1.6, delay: 2.0, duration: 5.9, className: 'text-gold-soft/50' },
  { icon: Star, left: '42%', top: '8%', size: 12, depth: 0.7, delay: 2.4, duration: 6.8, className: 'text-blush-300/60' },
  { icon: Heart, left: '58%', top: '86%', size: 16, depth: 1.2, delay: 1.9, duration: 6.1, className: 'text-crimson-300/50' },
];

function FloatingShape({ springX, springY, icon: Icon, left, top, size, depth, delay, duration, className }) {
  const { prefersReducedMotion } = useTheme();
  const x = useTransform(springX, (v) => (prefersReducedMotion ? 0 : v * depth * 36));
  const y = useTransform(springY, (v) => (prefersReducedMotion ? 0 : v * depth * 30));

  return (
    <motion.div aria-hidden="true" className={`absolute ${className}`} style={{ left, top, x, y }}>
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 10, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon size={size} fill="currentColor" />
      </motion.div>
    </motion.div>
  );
}

function FloatingShapes({ springX, springY }) {
  const { prefersReducedMotion } = useTheme();

  // Track the pointer on fine-pointer devices; the springs give the shapes a
  // weighty, eased follow instead of a rigid 1:1 snap.
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const handlePointer = (e) => {
      springX.set((e.clientX / window.innerWidth) * 2 - 1);
      springY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', handlePointer);
    return () => window.removeEventListener('pointermove', handlePointer);
  }, [prefersReducedMotion, springX, springY]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLOATING_SHAPES.map((shape, i) => (
        <FloatingShape key={i} springX={springX} springY={springY} {...shape} />
      ))}
    </div>
  );
}

/**
 * Full-screen welcome gate shown on every load: a sealed envelope with a wax
 * seal. Tapping the seal breaks it, the flap folds open, a letter rises out,
 * and "Open the keepsake" lets the visitor into the app.
 *
 * MotionConfig (reducedMotion="user", set in App) downgrades the transform
 * animations to plain fades for visitors who prefer reduced motion; the
 * sequence still completes.
 */
export function IntroGate({ onOpen }) {
  const [stage, setStage] = useState(STAGE.SEALED);
  const { isNight } = useTheme();

  // Springs shared by the envelope tilt and the floating shapes.
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 42, damping: 14, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 42, damping: 14, mass: 0.5 });

  // Lock background scrolling while the gate is up.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // After the flap opens and the letter rises, settle on the full letter view.
  useEffect(() => {
    if (stage !== STAGE.OPENING) return undefined;
    const timer = setTimeout(() => setStage(STAGE.LETTER), 1250);
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome letter"
      className={`fixed inset-0 z-50 overflow-y-auto ${isNight ? 'bg-oxblood-900' : 'bg-ivory-200'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Soft halo behind the envelope, then paper grain over it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isNight
            ? 'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(92,26,27,0.55), transparent 70%)'
            : 'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,253,251,0.95), transparent 70%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grain" />
      <FloatingShapes springX={springX} springY={springY} />

      <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-14">
        <AnimatePresence mode="wait">
          {stage === STAGE.LETTER ? (
            <Letter key="letter" onOpen={onOpen} />
          ) : (
            <Envelope
              key="envelope"
              stage={stage}
              springX={springX}
              springY={springY}
              onSeal={() => {
                playSealChime();
                setStage(STAGE.OPENING);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className={`absolute bottom-5 right-5 rounded-full px-3 py-1.5 text-sm underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-500 ${isNight ? 'text-blush-300 hover:text-ivory-100' : 'text-oxblood-400 hover:text-oxblood-600'}`}
      >
        {INTRO.skip}
      </button>
    </motion.div>
  );
}

function Envelope({ stage, springX, springY, onSeal }) {
  const opened = stage === STAGE.OPENING;
  const { isNight, prefersReducedMotion } = useTheme();
  const tiltX = useTransform(springX, (v) => (prefersReducedMotion ? 0 : v * 9));
  const tiltY = useTransform(springY, (v) => (prefersReducedMotion ? 0 : v * 7));

  return (
    <motion.div
      className="flex flex-col items-center"
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-crimson-500 font-semibold">
        {INTRO.overline}
      </p>

      {/* Envelope leans subtly toward the cursor */}
      <motion.div style={{ x: tiltX, y: tiltY }} className="relative">
        <motion.div
          className="relative"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="relative w-[min(92vw,30rem)] aspect-[30/19]"
            style={{ perspective: 1000 }}
          >
            {/* The letter inside — parked at rest (y: 0) it sits fully within
                the envelope, hidden behind the opaque pocket. When the seal
                breaks it rises out in front of the folded flap (zIndex follows
                the rise, so it never flashes over the closed flap). */}
            <motion.div
              className="absolute inset-x-3 top-2 bottom-2 rounded-lg border border-oxblood-100/60 bg-ivory-100 shadow-card"
              initial={false}
              animate={opened ? { y: '-60%', zIndex: 40 } : { y: '0%', zIndex: 15 }}
              transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-2 rounded-t-lg bg-gradient-to-b from-oxblood-100/50 to-transparent"
              />
              {/* Postmark on the paper */}
              <div
                aria-hidden="true"
                className="absolute right-4 top-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-crimson-300/70"
              >
                <Heart size={14} className="text-crimson-400" fill="currentColor" />
              </div>
            </motion.div>

            {/* Envelope pocket — layered shadows for weight */}
            <div
              className="absolute inset-0 z-20 rounded-keepsake bg-ivory-100"
              style={{
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(92,26,27,0.08), 0 30px 60px -20px rgba(92,26,27,0.45), 0 10px 20px -10px rgba(92,26,27,0.3)',
              }}
            >
              {/* Pocket shading + address block */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-keepsake bg-[radial-gradient(ellipse_at_bottom,rgba(92,26,27,0.07),transparent_72%)]"
              />
              <div className="absolute inset-x-0 bottom-9 flex flex-col items-center">
                <p className="text-[0.62rem] uppercase tracking-[0.35em] text-oxblood-400/80">
                  {INTRO.envelopeTo}
                </p>
                <p className="mt-1.5 font-script text-4xl leading-none text-oxblood-600">
                  {INTRO.recipientName}
                </p>
              </div>
            </div>

            {/* Front flap — folds up around its top edge when opened */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-30 h-1/2 origin-top"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              initial={false}
              animate={{ rotateX: opened ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="h-full w-full bg-gradient-to-b from-ivory-200 via-ivory-100 to-ivory-300" />
            </motion.div>

            {/* Wax seal — the button that breaks it. x/y keeps it perfectly
                centered even while framer-motion animates its scale. */}
            <AnimatePresence>
              {!opened && (
                <motion.button
                  type="button"
                  onClick={onSeal}
                  autoFocus
                  aria-label="Break the seal and open the letter"
                  className="absolute left-1/2 top-1/2 z-40 flex h-[4.6rem] w-[4.6rem] items-center justify-center rounded-full bg-gradient-to-br from-crimson-400 to-crimson-600 text-ivory-100 ring-4 ring-crimson-600/25 transition-colors hover:from-crimson-500 hover:to-crimson-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson-500"
                  style={{
                    x: '-50%',
                    y: '-50%',
                    boxShadow:
                      'inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.25), 0 12px 22px -8px rgba(92,26,27,0.6)',
                  }}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.94 }}
                  exit={{ scale: 0.2, rotate: 26, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeIn' }}
                >
                  <Heart size={30} fill="currentColor" aria-hidden="true" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        className={`mt-10 text-sm ${isNight ? 'text-blush-300' : 'text-charcoal-light'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {INTRO.hint}
      </motion.p>
    </motion.div>
  );
}

function Letter({ onOpen }) {
  const { isNight } = useTheme();

  return (
    <motion.div
      className="relative w-[min(92vw,36rem)] rounded-keepsake bg-ivory-100 p-8 shadow-[0_40px_90px_-24px_rgba(92,26,27,0.45)] sm:p-12"
      initial={{ opacity: 0, y: 44, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {/* Stationery frame + paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 rounded-keepsake border border-oxblood-100/80"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-keepsake bg-grain" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-3 rounded-t-keepsake bg-gradient-to-b from-oxblood-100/60 to-transparent"
      />

      <div className="relative flex flex-col items-center pt-4">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-crimson-500">
          {INTRO.overline}
        </p>
        <h2 className="mt-4 text-center font-display text-3xl leading-tight text-oxblood-700 sm:text-[2.75rem]">
          {INTRO.letterTitle}
        </h2>

        <span aria-hidden="true" className="mt-6 flex items-center gap-2.5 text-crimson-400">
          <span className="h-px w-12 bg-crimson-300/60" />
          <Heart size={14} fill="currentColor" />
          <span className="h-px w-12 bg-crimson-300/60" />
        </span>

        <p className="mt-6 max-w-md text-center leading-relaxed text-charcoal-light">
          {INTRO.letterBody}
        </p>

        <button type="button" onClick={onOpen} autoFocus className="btn-primary mt-10 px-9">
          {INTRO.cta}
        </button>

        <p className={`mt-10 font-script text-3xl ${isNight ? 'text-blush-300' : 'text-crimson-500'}`}>
          {INTRO.signature}
        </p>
        <p className={`mt-3 text-xs tracking-wide ${isNight ? 'text-blush-300/70' : 'text-oxblood-300/70'}`}>
          {APP_NAME}
        </p>
      </div>
    </motion.div>
  );
}
