import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { INTRO, APP_NAME } from '../../lib/constants.js';
import { useTheme } from '../../app/providers/ThemeProvider.jsx';

const STAGE = { SEALED: 'sealed', OPENING: 'opening', LETTER: 'letter' };

/**
 * Full-screen welcome gate shown on every load: a sealed envelope with a wax
 * seal. Tapping the seal breaks it, the flap folds open, a letter rises out,
 * and "Open the keepsake" lets the visitor into the app.
 *
 * Framer Motion's MotionConfig (reducedMotion="user", set in App) downgrades
 * the transform animations to plain fades for visitors who prefer reduced
 * motion; the sequence still completes.
 */
export function IntroGate({ onOpen }) {
  const [stage, setStage] = useState(STAGE.SEALED);
  const { isNight } = useTheme();

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
    const timer = setTimeout(() => setStage(STAGE.LETTER), 1200);
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome letter"
      className={`fixed inset-0 z-50 overflow-y-auto bg-grain ${isNight ? 'bg-oxblood-900' : 'bg-ivory-200'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {stage === STAGE.LETTER ? (
            <Letter key="letter" onOpen={onOpen} />
          ) : (
            <Envelope key="envelope" stage={stage} onSeal={() => setStage(STAGE.OPENING)} />
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

function Envelope({ stage, onSeal }) {
  const opened = stage === STAGE.OPENING;
  const { isNight } = useTheme();

  return (
    <motion.div
      className="flex flex-col items-center"
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <p className="mb-6 text-center text-xs uppercase tracking-[0.25em] text-crimson-500 font-semibold">
        {INTRO.overline}
      </p>

      <motion.div
        className="relative"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="relative h-72 w-[min(88vw,22rem)] overflow-hidden rounded-keepsake border border-oxblood-100 bg-ivory-100 shadow-soft"
          style={{ perspective: 900 }}
        >
          {/* Rising letter, hidden in the pocket until the seal breaks */}
          <motion.div
            className="absolute inset-x-1.5 top-1.5 bottom-1.5 z-10 rounded-md border border-oxblood-100 bg-ivory-100"
            initial={false}
            animate={{ y: opened ? '12%' : '102%' }}
            transition={{ duration: 0.65, delay: 0.55, ease: 'easeOut' }}
          />

          {/* Envelope flap — folds up around its top edge when opened */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-20 h-1/2 origin-top bg-gradient-to-b from-ivory-300 to-ivory-200"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            initial={false}
            animate={{ rotateX: opened ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Wax seal — the button that breaks it */}
          <AnimatePresence>
            {!opened && (
              <motion.button
                type="button"
                onClick={onSeal}
                autoFocus
                aria-label="Break the seal and open the letter"
                className="absolute left-1/2 top-[38%] z-30 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-crimson-500 text-ivory-100 shadow-soft ring-4 ring-crimson-600/30 transition-colors hover:bg-crimson-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson-500"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                exit={{ scale: 0.25, rotate: 24, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeIn' }}
              >
                <Heart size={26} fill="currentColor" aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Envelope front */}
          <p className="absolute inset-x-0 bottom-8 text-center font-display text-xl text-oxblood-700">
            {INTRO.envelopeName}
          </p>
        </div>
      </motion.div>

      <motion.p
        className={`mt-8 text-sm ${isNight ? 'text-blush-300' : 'text-charcoal-light'}`}
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
      className="relative w-[min(92vw,34rem)] rounded-keepsake border border-oxblood-100 bg-ivory-100 p-8 shadow-soft sm:p-10"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-2 rounded-t-keepsake bg-gradient-to-b from-oxblood-100/70 to-transparent"
      />
      <Heart className="mx-auto text-crimson-500" size={28} fill="currentColor" aria-hidden="true" />
      <h2 className="mt-5 text-center font-display text-3xl leading-snug text-oxblood-700">
        {INTRO.letterTitle}
      </h2>
      <p className="mt-4 text-center leading-relaxed text-charcoal-light">{INTRO.letterBody}</p>
      <div className="mt-9 flex justify-center">
        <button
          type="button"
          onClick={onOpen}
          autoFocus
          className="group inline-flex items-center gap-2 rounded-full bg-crimson-500 px-7 py-3 font-medium text-ivory-100 shadow-soft transition-colors hover:bg-crimson-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-500"
        >
          {INTRO.cta}
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
      <p className={`mt-7 text-center text-sm ${isNight ? 'text-blush-300' : 'text-oxblood-300'}`}>
        {INTRO.signoff}
      </p>
      <p className={`mt-1 text-center text-xs ${isNight ? 'text-blush-300/70' : 'text-oxblood-300/70'}`}>
        {APP_NAME}
      </p>
    </motion.div>
  );
}
