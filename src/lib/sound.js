// Tiny Web Audio helpers for the app's sound moments. Everything is
// synthesized at runtime — no audio files to download, so it works offline
// in the PWA. Sounds are only ever triggered from user gestures (clicks),
// which keeps them inside the browser's autoplay rules.

let audioCtx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/** Schedule one soft tone: quick attack, long bell-like decay. */
function playTone(ctx, { freq, start, duration = 1.8, gain = 0.12, type = 'triangle' }) {
  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();
  const t0 = ctx.currentTime + start;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);

  envelope.gain.setValueAtTime(0.0001, t0);
  envelope.gain.linearRampToValueAtTime(gain, t0 + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(envelope).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/**
 * Soft music-box arpeggio (E6 → G6 → B6) for the moment the wax seal breaks.
 * Harmless no-op if the browser can't create an audio context.
 */
export function playSealChime() {
  const ctx = getContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  // E6 · G6 · B6 — a gentle major arpeggio, each note with a faint shimmer octave.
  const notes = [1318.51, 1567.98, 1975.53];
  notes.forEach((freq, i) => {
    playTone(ctx, { freq, start: t + i * 0.09, duration: 1.8, gain: i === 0 ? 0.14 : 0.11 });
    playTone(ctx, { freq: freq * 2, start: t + i * 0.09 + 0.02, duration: 1.1, gain: 0.03, type: 'sine' });
  });
  // Warm low root underneath so it doesn't feel thin.
  playTone(ctx, { freq: 659.25, start: t + 0.05, duration: 2.4, gain: 0.05, type: 'sine' });
}
