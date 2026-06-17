// Web Audio API Synthesizer for cute retro game sounds
let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const sound = {
  getMuteState() {
    return isMuted;
  },
  setMuteState(muted) {
    isMuted = muted;
    return isMuted;
  },
  toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  },

  // Play a cute cat chirp/meow-like placement sound
  playPlace() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Primary chirp oscillator
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      // Quick pitch sweep up to make it sound cute and chirpy
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.1);

      // Volume envelope (fast decay)
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);

      // Secondary frequency (adds a slight cat-chirp resonance)
      const osc2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(400, now);
      osc2.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gainNode2.gain.setValueAtTime(0.06, now);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc2.connect(gainNode2);
      gainNode2.connect(ctx.destination);

      osc2.start(now);
      osc2.stop(now + 0.09);
    } catch (e) {
      console.warn("Web Audio failed:", e);
    }
  },

  // Play a quick spinning/flip sound for capturing pieces
  playFlip(index = 0) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      // Introduce a slight delay based on index so multi-flips cascade nicely!
      const now = ctx.currentTime + (index * 0.06);

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "triangle";
      // Sweeping frequency downwards
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.08);

      // Volume sweep
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn("Web Audio failed:", e);
    }
  },

  // Play a short click sound for buttons
  playClick() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, now);

      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn("Web Audio failed:", e);
    }
  },

  // Play an ascending pentatonic chime for game completion / winning
  playWin() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // C major pentatonic scale: C5 (523.25), D5 (587.33), E5 (659.25), G5 (783.99), A5 (880.00), C6 (1046.50)
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        const noteStart = now + (i * 0.12);
        const noteDuration = 0.35;

        gainNode.gain.setValueAtTime(0, noteStart);
        gainNode.gain.linearRampToValueAtTime(0.1, noteStart + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    } catch (e) {
      console.warn("Web Audio failed:", e);
    }
  },

  // Play a double soft warning beep for passes/no moves
  playPass() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      [750, 600].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        const noteStart = now + (i * 0.09);
        const noteDuration = 0.08;

        gainNode.gain.setValueAtTime(0.06, noteStart);
        gainNode.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    } catch (e) {
      console.warn("Web Audio failed:", e);
    }
  }
};
