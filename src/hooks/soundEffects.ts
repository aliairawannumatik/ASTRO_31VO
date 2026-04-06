/* ─────────────────────────────────────────────────────────────
   NUMATIK – 10 synthesized button sound effects (Web Audio API)
───────────────────────────────────────────────────────────── */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const ctx = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = _currentVolume;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
};

const dest = () => {
  ctx();
  return masterGain!;
};

let _currentSfxId = "pop-klasik";
export const setCurrentSfxId = (id: string) => { _currentSfxId = id; };
export const getCurrentSfxId = () => _currentSfxId;

let _currentVolume = 0.8;
export const setVolume = (val: number) => {
  _currentVolume = Math.max(0, Math.min(1, val));
  if (masterGain) masterGain.gain.value = _currentVolume;
};
export const getCurrentVolume = () => _currentVolume;

export type SfxInfo = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  accentColor: string;
};

export const SFX_EFFECTS: SfxInfo[] = [
  { id: "pop-klasik",  name: "Pop Klasik",   emoji: "🔊", description: "Klik pop bawaan",         accentColor: "violet" },
  { id: "laser",       name: "Laser",         emoji: "⚡", description: "Tembakan laser sci-fi",   accentColor: "cyan"   },
  { id: "pixel",       name: "Pixel Click",   emoji: "🎮", description: "8-bit arcade retro",      accentColor: "green"  },
  { id: "water",       name: "Tetesan",       emoji: "💧", description: "Tetes air jernih",        accentColor: "sky"    },
  { id: "bell",        name: "Lonceng",       emoji: "🔔", description: "Genta lembut",            accentColor: "yellow" },
  { id: "woosh",       name: "Woosh",         emoji: "🌬️", description: "Desiran angin cepat",     accentColor: "teal"   },
  { id: "impact",      name: "Impact",        emoji: "💥", description: "Hentakan tegas & kuat",   accentColor: "rose"   },
  { id: "sparkle",     name: "Sparkle",       emoji: "✨", description: "Kilau bintang beruntun",  accentColor: "pink"   },
  { id: "ding",        name: "Ding",          emoji: "🎵", description: "Nada lonceng musikal",    accentColor: "indigo" },
  { id: "robot",       name: "Robot",         emoji: "🤖", description: "Blip suara robot",        accentColor: "amber"  },
];

// ── Individual synthesizers ────────────────────────────────────

function popKlasik() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.05);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
  g.gain.setValueAtTime(0.22, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(g); g.connect(d);
  osc.start(t); osc.stop(t + 0.15);
}

function laser() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(1400, t);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.18);
  g.gain.setValueAtTime(0.13, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  const osc2 = c.createOscillator(); const g2 = c.createGain();
  osc2.type = "square";
  osc2.frequency.setValueAtTime(2800, t);
  osc2.frequency.exponentialRampToValueAtTime(200, t + 0.14);
  g2.gain.setValueAtTime(0.05, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  osc.connect(g); g.connect(d);
  osc2.connect(g2); g2.connect(d);
  osc.start(t); osc.stop(t + 0.18);
  osc2.start(t); osc2.stop(t + 0.14);
}

function pixel() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.setValueAtTime(1320, t + 0.02);
  osc.frequency.setValueAtTime(660, t + 0.04);
  osc.frequency.setValueAtTime(990, t + 0.06);
  g.gain.setValueAtTime(0.15, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  osc.connect(g); g.connect(d);
  osc.start(t); osc.stop(t + 0.09);
}

function water() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(720, t + 0.05);
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.15);
  g.gain.setValueAtTime(0.0, t);
  g.gain.linearRampToValueAtTime(0.22, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  osc.connect(g); g.connect(d);
  osc.start(t); osc.stop(t + 0.22);
}

function bell() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const ratios = [1, 2.756, 5.404];
  const vols   = [0.18, 0.09, 0.04];
  const decays = [0.55, 0.45, 0.35];
  ratios.forEach((r, i) => {
    const osc = c.createOscillator(); const g = c.createGain();
    osc.type = "sine"; osc.frequency.value = 523 * r;
    g.gain.setValueAtTime(vols[i], t);
    g.gain.exponentialRampToValueAtTime(0.001, t + decays[i]);
    osc.connect(g); g.connect(d);
    osc.start(t); osc.stop(t + decays[i]);
  });
}

function woosh() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const dur = c.sampleRate * 0.22;
  const buf = c.createBuffer(1, dur, c.sampleRate);
  const da = buf.getChannelData(0);
  for (let i = 0; i < dur; i++) da[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  const flt = c.createBiquadFilter();
  flt.type = "bandpass";
  flt.frequency.setValueAtTime(150, t);
  flt.frequency.exponentialRampToValueAtTime(2400, t + 0.1);
  flt.frequency.exponentialRampToValueAtTime(500, t + 0.22);
  flt.Q.value = 2.5;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0, t);
  g.gain.linearRampToValueAtTime(0.28, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  src.connect(flt); flt.connect(g); g.connect(d);
  src.start(t);
}

function impact() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const osc = c.createOscillator(); const og = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, t);
  osc.frequency.exponentialRampToValueAtTime(28, t + 0.14);
  og.gain.setValueAtTime(0.38, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  osc.connect(og); og.connect(d);
  osc.start(t); osc.stop(t + 0.14);
  const dur = Math.floor(c.sampleRate * 0.12);
  const buf = c.createBuffer(1, dur, c.sampleRate);
  const da = buf.getChannelData(0);
  for (let i = 0; i < dur; i++) da[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.025));
  const src = c.createBufferSource(); src.buffer = buf;
  const flt = c.createBiquadFilter(); flt.type = "lowpass"; flt.frequency.value = 400;
  const ng = c.createGain(); ng.gain.setValueAtTime(0.35, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  src.connect(flt); flt.connect(ng); ng.connect(d);
  src.start(t);
}

function sparkle() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const freqs = [1200, 1600, 2100, 2600, 3000];
  freqs.forEach((f, i) => {
    const delay = i * 0.035;
    const osc = c.createOscillator(); const g = c.createGain();
    osc.type = "sine"; osc.frequency.value = f;
    g.gain.setValueAtTime(0.13, t + delay);
    g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.12);
    osc.connect(g); g.connect(d);
    osc.start(t + delay); osc.stop(t + delay + 0.12);
  });
}

function ding() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = "sine"; osc.frequency.value = 1047;
  g.gain.setValueAtTime(0.22, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
  osc.connect(g); g.connect(d);
  osc.start(t); osc.stop(t + 0.55);
  const osc2 = c.createOscillator(); const g2 = c.createGain();
  osc2.type = "sine"; osc2.frequency.value = 2094;
  g2.gain.setValueAtTime(0.07, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  osc2.connect(g2); g2.connect(d);
  osc2.start(t); osc2.stop(t + 0.25);
}

function robot() {
  const c = ctx(); const t = c.currentTime; const d = dest();
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.setValueAtTime(440, t + 0.04);
  osc.frequency.setValueAtTime(330, t + 0.08);
  osc.frequency.setValueAtTime(550, t + 0.11);
  osc.frequency.setValueAtTime(275, t + 0.14);
  g.gain.setValueAtTime(0.13, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  const flt = c.createBiquadFilter(); flt.type = "bandpass"; flt.frequency.value = 800; flt.Q.value = 4;
  osc.connect(flt); flt.connect(g); g.connect(d);
  osc.start(t); osc.stop(t + 0.18);
}

// ── Dispatcher ────────────────────────────────────────────────
const SFX_MAP: Record<string, () => void> = {
  "pop-klasik": popKlasik,
  "laser":      laser,
  "pixel":      pixel,
  "water":      water,
  "bell":       bell,
  "woosh":      woosh,
  "impact":     impact,
  "sparkle":    sparkle,
  "ding":       ding,
  "robot":      robot,
};

export const playSfxById = (id: string) => {
  try {
    (SFX_MAP[id] ?? popKlasik)();
  } catch {}
};
