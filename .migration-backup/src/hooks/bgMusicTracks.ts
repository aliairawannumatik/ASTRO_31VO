/* ─────────────────────────────────────────────────────────────
   NUMATIK  –  Multi-Track Background Music Engine
   All music is synthesised in real-time via Web Audio API.
   Nothing runs until startMusic() is called.
───────────────────────────────────────────────────────────── */

// ── Global engine state ───────────────────────────────────────
let _ctx: AudioContext | null = null;
let _master: GainNode | null = null;
let _reverb: ConvolverNode | null = null;
let _wetGainNode: GainNode | null = null;
let _schedulerTimer: ReturnType<typeof setInterval> | null = null;
let _noteIdx = 0;
let _nextTime = 0;
let _isPlaying = false;
let _currentTrackId = 'fur-elise';

const LOOKAHEAD = 0.3;
const TICK_MS   = 80;

// ── Types ─────────────────────────────────────────────────────
type TimbreType = 'piano' | 'synth' | 'pad' | 'square' | 'marimba';

type Note = {
  f: number;       // main oscillator frequency (Hz); 0 = rest
  d: number;       // duration in beat units
  vel?: number;    // velocity 0–1
  bass?: number;   // secondary note frequency (played simultaneously)
  bassVel?: number;
  bassDur?: number; // beat-unit duration override for bass note
};

export type TrackInfo = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  accentColor: string;   // Tailwind colour name for active UI styling
  bpm: number;           // determines BEAT length
  pattern: Note[];
  timbre: TimbreType;
  reverbAmt: number;     // wet gain 0–1
  masterVol: number;     // master volume scalar applied to vel
};

// ── Frequency constants (Hz) ───────────────────────────────────
const B1  =  61.74;
const C2  =  65.41; const D2  =  73.42; const E2  =  82.41;
const F2  =  87.31; const G2  =  98.00; const A2  = 110.00; const B2  = 123.47;
const C3  = 130.81; const D3  = 146.83; const Eb3 = 155.56; const E3  = 164.81;
const F3  = 174.61; const Fs3 = 185.00; const G3  = 196.00; const Ab3 = 207.65;
const A3  = 220.00; const Bb3 = 233.08; const B3  = 246.94;
const C4  = 261.63; const Cs4 = 277.18; const D4  = 293.66; const Eb4 = 311.13;
const E4  = 329.63; const F4  = 349.23; const Fs4 = 369.99; const G4  = 392.00;
const Gs4 = 415.30; const A4  = 440.00; const Bb4 = 466.16; const B4  = 493.88;
const C5  = 523.25; const D5  = 587.33; const Eb5 = 622.25; const E5  = 659.25;
const F5  = 698.46; const Fs5 = 739.99; const G5  = 783.99; const A5  = 880.00;

// ── Track patterns ─────────────────────────────────────────────

// 1. Beethoven – Für Elise  (A minor, piano)
const FUR_ELISE: Note[] = [
  { f: E5,  d: 1,               vel: 0.62 },
  { f: Eb5, d: 1,               vel: 0.55 },
  { f: E5,  d: 1,               vel: 0.62 },
  { f: Eb5, d: 1,               vel: 0.55 },
  { f: E5,  d: 1,               vel: 0.62 },
  { f: B4,  d: 1,               vel: 0.55 },
  { f: D5,  d: 1,               vel: 0.60 },
  { f: C5,  d: 1,               vel: 0.55 },
  { f: A4,  d: 3, bass: A2,     vel: 0.68, bassVel: 0.38 },
  { f: E3,  d: 1, bass: A2,     vel: 0.38, bassVel: 0.30 },
  { f: A3,  d: 1,               vel: 0.42 },
  { f: E4,  d: 1,               vel: 0.42 },
  { f: A4,  d: 2, bass: A2,     vel: 0.56, bassVel: 0.35 },
  { f: B4,  d: 1,               vel: 0.50 },
  { f: E3,  d: 1, bass: E2,     vel: 0.38, bassVel: 0.30 },
  { f: Ab3, d: 1,               vel: 0.52 },
  { f: B4,  d: 1,               vel: 0.52 },
  { f: C5,  d: 3, bass: E2,     vel: 0.62, bassVel: 0.32 },
  { f: E4,  d: 1,               vel: 0.42 },
  { f: E5,  d: 1,               vel: 0.62 },
  { f: Eb5, d: 1,               vel: 0.55 },
  { f: E5,  d: 1,               vel: 0.62 },
  { f: Eb5, d: 1,               vel: 0.55 },
  { f: E5,  d: 1,               vel: 0.62 },
  { f: B4,  d: 1,               vel: 0.55 },
  { f: D5,  d: 1,               vel: 0.60 },
  { f: C5,  d: 1,               vel: 0.55 },
  { f: A4,  d: 3, bass: A2,     vel: 0.68, bassVel: 0.38 },
  { f: E3,  d: 1, bass: A2,     vel: 0.38, bassVel: 0.30 },
  { f: A3,  d: 1,               vel: 0.42 },
  { f: E4,  d: 1,               vel: 0.42 },
  { f: A4,  d: 2, bass: A2,     vel: 0.56, bassVel: 0.35 },
  { f: B4,  d: 1,               vel: 0.50 },
  { f: E3,  d: 1, bass: A2,     vel: 0.38, bassVel: 0.30 },
  { f: C5,  d: 1,               vel: 0.58 },
  { f: B4,  d: 1,               vel: 0.54 },
  { f: A4,  d: 5, bass: A2,     vel: 0.72, bassVel: 0.38 },
];

// 2. Beethoven – Moonlight Sonata  (A minor feel, triplet arpeggios under slow melody)
// BPM=156 (= 52 bpm × 3 triplet units per beat); each d=1 ≈ 0.385 s
// "bass" carries the slow melody note (held for 6 units = 2 real beats)
const MOONLIGHT: Note[] = [
  // Am  — melody: E5
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18, bass:E5,  bassVel:0.38, bassDur:6 },
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18 },
  // Am  — melody: D5
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18, bass:D5,  bassVel:0.36, bassDur:6 },
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18 },
  // Am  — melody: C5
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18, bass:C5,  bassVel:0.36, bassDur:6 },
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18 },
  // Am  — melody: B4
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18, bass:B4,  bassVel:0.38, bassDur:6 },
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18 },
  // E   — melody: A4
  { f: E2, d:1, vel:0.24 }, { f: B2, d:1, vel:0.20 }, { f: E3, d:1, vel:0.18, bass:A4,  bassVel:0.38, bassDur:6 },
  { f: E2, d:1, vel:0.24 }, { f: B2, d:1, vel:0.20 }, { f: E3, d:1, vel:0.18 },
  // E   — melody: Gs4
  { f: E2, d:1, vel:0.24 }, { f: B2, d:1, vel:0.20 }, { f: E3, d:1, vel:0.18, bass:Gs4, bassVel:0.36, bassDur:6 },
  { f: E2, d:1, vel:0.24 }, { f: B2, d:1, vel:0.20 }, { f: E3, d:1, vel:0.18 },
  // Am  — melody: A4
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18, bass:A4,  bassVel:0.40, bassDur:6 },
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18 },
  // Am  — long ending: E4
  { f: A2, d:1, vel:0.22 }, { f: E3, d:1, vel:0.20 }, { f: A3, d:1, vel:0.18, bass:E4,  bassVel:0.42, bassDur:12 },
  { f: A2, d:1, vel:0.20 }, { f: E3, d:1, vel:0.18 }, { f: A3, d:1, vel:0.16 },
  { f: A2, d:1, vel:0.18 }, { f: E3, d:1, vel:0.16 }, { f: A3, d:1, vel:0.15 },
  { f: A2, d:1, vel:0.18 }, { f: E3, d:1, vel:0.16 }, { f: A3, d:1, vel:0.15 },
];

// 3. Disco Space  (E minor funk, BPM=120, beat unit = 8th note = 0.25 s)
const DISCO_SPACE: Note[] = [
  { f: E2,  d:1,   vel:0.88 },
  { f: E2,  d:0.5, vel:0.58 },
  { f: 0,   d:0.5 },
  { f: G2,  d:1,   vel:0.82, bass:B4,  bassVel:0.65, bassDur:2 },
  { f: A2,  d:1,   vel:0.78 },
  { f: A2,  d:0.5, vel:0.56 },
  { f: 0,   d:0.5 },
  { f: G2,  d:1,   vel:0.75, bass:A4,  bassVel:0.60, bassDur:2 },
  { f: E2,  d:1,   vel:0.85 },
  { f: E2,  d:0.5, vel:0.52 },
  { f: 0,   d:0.5 },
  { f: B2,  d:1,   vel:0.78, bass:G4,  bassVel:0.62, bassDur:2 },
  { f: A2,  d:1,   vel:0.80 },
  { f: G2,  d:0.5, vel:0.62 },
  { f: E2,  d:0.5, vel:0.72 },
  { f: E2,  d:2,   vel:0.88, bass:E4,  bassVel:0.58, bassDur:4 },
  { f: E2,  d:1,   vel:0.80 },
  { f: 0,   d:0.5 },
  { f: G2,  d:0.5, vel:0.68 },
  { f: A2,  d:1,   vel:0.82, bass:D5,  bassVel:0.62, bassDur:2 },
  { f: B2,  d:0.5, vel:0.70 },
  { f: A2,  d:0.5, vel:0.65 },
  { f: G2,  d:1,   vel:0.75, bass:C5,  bassVel:0.58, bassDur:2 },
  { f: E2,  d:2,   vel:0.85, bass:B4,  bassVel:0.62, bassDur:4 },
  { f: E2,  d:2,   vel:0.72 },
];

// 4. DJ Remix  (E minor electronic, BPM=128, beat unit = 8th note ≈ 0.234 s)
const DJ_REMIX: Note[] = [
  { f: E2,  d:1, vel:0.92 },
  { f: E2,  d:1, vel:0.62, bass:E4,  bassVel:0.58, bassDur:2 },
  { f: E2,  d:1, vel:0.85 },
  { f: E2,  d:1, vel:0.58, bass:G4,  bassVel:0.58 },
  { f: B2,  d:1, vel:0.88 },
  { f: B2,  d:1, vel:0.58, bass:B4,  bassVel:0.56, bassDur:2 },
  { f: A2,  d:1, vel:0.85 },
  { f: A2,  d:1, vel:0.55, bass:A4,  bassVel:0.54 },
  { f: E2,  d:1, vel:0.92 },
  { f: E2,  d:1, vel:0.62, bass:E5,  bassVel:0.60, bassDur:2 },
  { f: E2,  d:1, vel:0.85 },
  { f: G2,  d:1, vel:0.60, bass:D5,  bassVel:0.56 },
  { f: A2,  d:1, vel:0.85 },
  { f: A2,  d:1, vel:0.55, bass:C5,  bassVel:0.55, bassDur:2 },
  { f: B2,  d:1, vel:0.82 },
  { f: B2,  d:1, vel:0.52, bass:B4,  bassVel:0.52 },
  { f: G2,  d:2, vel:0.88, bass:G4,  bassVel:0.58, bassDur:4 },
  { f: G2,  d:2, vel:0.70 },
  { f: A2,  d:2, vel:0.85, bass:A4,  bassVel:0.56, bassDur:4 },
  { f: E2,  d:2, vel:0.90, bass:E4,  bassVel:0.58, bassDur:4 },
];

// 5. Lo-Fi Chill  (A minor / C major, BPM=75, beat unit = quarter note = 0.8 s)
const LOFI_CHILL: Note[] = [
  { f: A3,  d:2, vel:0.52, bass:C5,  bassVel:0.44, bassDur:4 },
  { f: E3,  d:2, vel:0.44 },
  { f: C3,  d:2, vel:0.50, bass:B4,  bassVel:0.40, bassDur:4 },
  { f: G3,  d:2, vel:0.44 },
  { f: G3,  d:2, vel:0.52, bass:D5,  bassVel:0.44, bassDur:4 },
  { f: D3,  d:2, vel:0.44 },
  { f: F3,  d:2, vel:0.50, bass:A4,  bassVel:0.42, bassDur:4 },
  { f: C3,  d:2, vel:0.42 },
  { f: A3,  d:2, vel:0.52, bass:E5,  bassVel:0.42, bassDur:4 },
  { f: E3,  d:2, vel:0.44 },
  { f: G3,  d:2, vel:0.50, bass:D5,  bassVel:0.40, bassDur:4 },
  { f: C3,  d:2, vel:0.44 },
  { f: F3,  d:2, vel:0.52, bass:C5,  bassVel:0.44, bassDur:4 },
  { f: C3,  d:2, vel:0.44 },
  { f: E3,  d:4, vel:0.50, bass:A4,  bassVel:0.42, bassDur:4 },
];

// 6. Space Ambient  (A minor drone pads, BPM=40, beat unit = quarter note = 1.5 s)
const SPACE_AMBIENT: Note[] = [
  { f: A2,  d:4, vel:0.38, bass:E4,  bassVel:0.30, bassDur:8 },
  { f: A2,  d:4, vel:0.32 },
  { f: E2,  d:4, vel:0.38, bass:B4,  bassVel:0.28, bassDur:8 },
  { f: E2,  d:4, vel:0.32 },
  { f: D2,  d:4, vel:0.38, bass:A4,  bassVel:0.28, bassDur:8 },
  { f: D2,  d:4, vel:0.32 },
  { f: G2,  d:4, vel:0.36, bass:D5,  bassVel:0.26, bassDur:8 },
  { f: G2,  d:4, vel:0.30 },
  { f: A2,  d:8, vel:0.40, bass:C5,  bassVel:0.30, bassDur:8 },
  { f: A2,  d:4, vel:0.28 },
  { f: A2,  d:4, vel:0.25 },
];

// 7. Retro Arcade  (C major 8-bit, BPM=160, beat unit = 8th note ≈ 0.1875 s)
const RETRO_ARCADE: Note[] = [
  { f: E5,  d:1, vel:0.80 }, { f: E5,  d:1, vel:0.80 }, { f: 0, d:1 },
  { f: E5,  d:1, vel:0.80 }, { f: 0, d:1 },
  { f: C5,  d:1, vel:0.75 }, { f: E5,  d:2, vel:0.82 },
  { f: G5,  d:2, vel:0.82 }, { f: 0, d:2 }, { f: G4,  d:2, vel:0.65 }, { f: 0, d:2 },
  { f: C5,  d:3, vel:0.78 }, { f: G4,  d:1.5, vel:0.65 }, { f: 0, d:0.5 },
  { f: E4,  d:3, vel:0.72 }, { f: A4,  d:2, vel:0.74 }, { f: B4,  d:2, vel:0.74 },
  { f: Bb4, d:1, vel:0.70 }, { f: A4,  d:2, vel:0.74 },
  { f: G4,  d:1.5, vel:0.70 }, { f: E5,  d:1.5, vel:0.80 },
  { f: G5,  d:1.5, vel:0.82 }, { f: A5,  d:2, vel:0.82 },
  { f: F5,  d:1.5, vel:0.76 }, { f: G5,  d:1, vel:0.80 }, { f: 0, d:1 },
  { f: E5,  d:2, vel:0.80 }, { f: C5,  d:1.5, vel:0.76 },
  { f: D5,  d:1.5, vel:0.76 }, { f: B4,  d:3, vel:0.74 }, { f: 0, d:1 },
];

// 8. Jazz Lounge  (C major / Am, BPM=90, beat unit = quarter note ≈ 0.667 s)
const JAZZ_LOUNGE: Note[] = [
  { f: C2,  d:1, vel:0.66, bass:E4,  bassVel:0.54, bassDur:2 },
  { f: E2,  d:1, vel:0.58 },
  { f: G2,  d:1, vel:0.62, bass:G4,  bassVel:0.50, bassDur:2 },
  { f: B2,  d:1, vel:0.55 },
  { f: A2,  d:1, vel:0.66, bass:C5,  bassVel:0.52, bassDur:2 },
  { f: C3,  d:1, vel:0.58 },
  { f: E3,  d:1, vel:0.62, bass:A4,  bassVel:0.50, bassDur:2 },
  { f: G2,  d:1, vel:0.55 },
  { f: D2,  d:1, vel:0.66, bass:F4,  bassVel:0.52, bassDur:2 },
  { f: F2,  d:1, vel:0.58 },
  { f: A2,  d:1, vel:0.62, bass:A4,  bassVel:0.50, bassDur:2 },
  { f: C3,  d:1, vel:0.55 },
  { f: G2,  d:1, vel:0.66, bass:D5,  bassVel:0.52, bassDur:2 },
  { f: B2,  d:1, vel:0.58 },
  { f: D3,  d:1, vel:0.62, bass:B4,  bassVel:0.50, bassDur:2 },
  { f: F3,  d:1, vel:0.55 },
  { f: C2,  d:1, vel:0.68, bass:E5,  bassVel:0.52, bassDur:4 },
  { f: E2,  d:1, vel:0.56 },
  { f: G2,  d:1, vel:0.60, bass:D5,  bassVel:0.48 },
  { f: A2,  d:1, vel:0.55 },
  { f: F2,  d:1, vel:0.65, bass:C5,  bassVel:0.50, bassDur:4 },
  { f: A2,  d:1, vel:0.56 },
  { f: C3,  d:1, vel:0.60, bass:A4,  bassVel:0.48 },
  { f: E3,  d:1, vel:0.54 },
  { f: G2,  d:2, vel:0.70, bass:G4,  bassVel:0.52, bassDur:4 },
  { f: B2,  d:2, vel:0.56 },
];

// 9. Waltz Klasik  (G major, BPM=150, beat unit = quarter note = 0.4 s, 3/4 feel)
const WALTZ_KLASIK: Note[] = [
  { f: G2,  d:1, vel:0.78, bass:G4,  bassVel:0.52, bassDur:2 }, { f: B3,  d:1, vel:0.46 }, { f: D4,  d:1, vel:0.44 },
  { f: G2,  d:1, vel:0.78, bass:A4,  bassVel:0.50, bassDur:2 }, { f: B3,  d:1, vel:0.46 }, { f: D4,  d:1, vel:0.44 },
  { f: C3,  d:1, vel:0.78, bass:B4,  bassVel:0.52, bassDur:2 }, { f: E3,  d:1, vel:0.46 }, { f: G3,  d:1, vel:0.44 },
  { f: C3,  d:1, vel:0.78, bass:C5,  bassVel:0.50, bassDur:2 }, { f: E3,  d:1, vel:0.46 }, { f: G3,  d:1, vel:0.44 },
  { f: D3,  d:1, vel:0.78, bass:D5,  bassVel:0.52, bassDur:2 }, { f: Fs3, d:1, vel:0.46 }, { f: A3,  d:1, vel:0.44 },
  { f: D3,  d:1, vel:0.78, bass:C5,  bassVel:0.48, bassDur:2 }, { f: Fs3, d:1, vel:0.46 }, { f: A3,  d:1, vel:0.44 },
  { f: G2,  d:1, vel:0.80, bass:B4,  bassVel:0.52, bassDur:4 }, { f: B3,  d:1, vel:0.46 }, { f: D4,  d:1, vel:0.44 },
  { f: G2,  d:1, vel:0.75                                      }, { f: D3,  d:1, vel:0.44 }, { f: B3,  d:1, vel:0.44 },
  { f: E3,  d:1, vel:0.78, bass:G4,  bassVel:0.50, bassDur:2 }, { f: G3,  d:1, vel:0.46 }, { f: B3,  d:1, vel:0.44 },
  { f: E3,  d:1, vel:0.75, bass:A4,  bassVel:0.48, bassDur:2 }, { f: G3,  d:1, vel:0.46 }, { f: B3,  d:1, vel:0.44 },
  { f: A2,  d:1, vel:0.78, bass:E5,  bassVel:0.52, bassDur:2 }, { f: E3,  d:1, vel:0.46 }, { f: A3,  d:1, vel:0.44 },
  { f: A2,  d:1, vel:0.75, bass:D5,  bassVel:0.48, bassDur:2 }, { f: E3,  d:1, vel:0.44 }, { f: A3,  d:1, vel:0.44 },
  { f: G2,  d:3, vel:0.82, bass:G4,  bassVel:0.54, bassDur:3 }, { f: B3,  d:3, vel:0.44 },
  { f: G2,  d:3, vel:0.72 },
];

// 10. Cosmic Synthwave  (E minor, BPM=100, beat unit = 8th note = 0.3 s)
const COSMIC_SYNTHWAVE: Note[] = [
  { f: E2,  d:1, vel:0.88 }, { f: E2,  d:1, vel:0.82, bass:E4,  bassVel:0.62, bassDur:2 },
  { f: E2,  d:1, vel:0.88 }, { f: B2,  d:1, vel:0.76, bass:G4,  bassVel:0.58 },
  { f: A2,  d:1, vel:0.85 }, { f: A2,  d:1, vel:0.76, bass:A4,  bassVel:0.58, bassDur:2 },
  { f: G2,  d:1, vel:0.82 }, { f: B2,  d:1, vel:0.74, bass:B4,  bassVel:0.55 },
  { f: E2,  d:1, vel:0.88 }, { f: E2,  d:1, vel:0.80, bass:D5,  bassVel:0.62, bassDur:2 },
  { f: E2,  d:1, vel:0.85 }, { f: B2,  d:1, vel:0.74, bass:E5,  bassVel:0.60 },
  { f: G2,  d:1, vel:0.82 }, { f: G2,  d:1, vel:0.72, bass:D5,  bassVel:0.58, bassDur:2 },
  { f: A2,  d:1, vel:0.80 }, { f: B2,  d:1, vel:0.70, bass:B4,  bassVel:0.55 },
  { f: E2,  d:1, vel:0.88 }, { f: E2,  d:1, vel:0.82, bass:Fs5, bassVel:0.62, bassDur:2 },
  { f: E2,  d:1, vel:0.85 }, { f: G2,  d:1, vel:0.72, bass:E5,  bassVel:0.58 },
  { f: D2,  d:1, vel:0.88 }, { f: D2,  d:1, vel:0.80, bass:D5,  bassVel:0.60, bassDur:4 },
  { f: D2,  d:1, vel:0.82 }, { f: D2,  d:1, vel:0.72 },
  { f: A2,  d:2, vel:0.86, bass:C5,  bassVel:0.58, bassDur:4 },
  { f: B2,  d:4, vel:0.88, bass:B4,  bassVel:0.60, bassDur:4 },
];

// 11. Tropical Beats  (C major, BPM=105, beat unit = 8th note ≈ 0.286 s)
const TROPICAL_BEATS: Note[] = [
  { f: C4,  d:2, vel:0.72 },
  { f: E4,  d:1, vel:0.66 }, { f: G4,  d:1, vel:0.70 },
  { f: A4,  d:2, vel:0.74, bass:C3,  bassVel:0.50, bassDur:2 },
  { f: G4,  d:2, vel:0.70 },
  { f: E4,  d:1, vel:0.66 }, { f: C4,  d:1, vel:0.64 },
  { f: D4,  d:2, vel:0.70, bass:G2,  bassVel:0.48, bassDur:2 },
  { f: E4,  d:2, vel:0.72 },
  { f: F4,  d:1, vel:0.66 }, { f: G4,  d:1, vel:0.70 },
  { f: A4,  d:3, vel:0.75, bass:F2,  bassVel:0.48, bassDur:4 },
  { f: G4,  d:1, vel:0.68 },
  { f: F4,  d:1, vel:0.66 }, { f: E4,  d:1, vel:0.70 },
  { f: D4,  d:2, vel:0.68, bass:G2,  bassVel:0.48, bassDur:2 },
  { f: C4,  d:2, vel:0.74, bass:C3,  bassVel:0.52, bassDur:4 },
  { f: G3,  d:2, vel:0.60 },
  { f: E4,  d:2, vel:0.70, bass:C3,  bassVel:0.48, bassDur:2 },
  { f: G4,  d:2, vel:0.72, bass:G2,  bassVel:0.46, bassDur:2 },
  { f: E5,  d:2, vel:0.76, bass:C3,  bassVel:0.50, bassDur:4 },
  { f: D5,  d:1, vel:0.70 }, { f: C5,  d:1, vel:0.72 },
  { f: B4,  d:4, vel:0.74, bass:G2,  bassVel:0.48, bassDur:4 },
];

// 12. Piano Klasik  (G major simple melody, BPM=88)
const PIANO_KLASIK: Note[] = [
  { f: G4,  d:2, vel:0.60 }, { f: A4,  d:2, vel:0.58 },
  { f: B4,  d:2, vel:0.62, bass:G2,  bassVel:0.40, bassDur:4 },
  { f: C5,  d:2, vel:0.60 },
  { f: D5,  d:2, vel:0.65, bass:C3,  bassVel:0.42, bassDur:4 },
  { f: E5,  d:2, vel:0.62 },
  { f: D5,  d:4, vel:0.68, bass:D3,  bassVel:0.44, bassDur:4 },
  { f: G4,  d:2, vel:0.60 }, { f: G4,  d:2, vel:0.55 },
  { f: E5,  d:2, vel:0.65, bass:E3,  bassVel:0.42, bassDur:4 },
  { f: D5,  d:2, vel:0.60 },
  { f: C5,  d:2, vel:0.62, bass:C3,  bassVel:0.40, bassDur:4 },
  { f: B4,  d:2, vel:0.58 },
  { f: A4,  d:4, vel:0.65, bass:A2,  bassVel:0.42, bassDur:4 },
  { f: G4,  d:4, vel:0.70, bass:G2,  bassVel:0.44, bassDur:4 },
];

// ── Track registry ─────────────────────────────────────────────
export const TRACKS: TrackInfo[] = [];

// ── Reverb builder ─────────────────────────────────────────────
function buildReverb(ctx: AudioContext): ConvolverNode {
  const conv = ctx.createConvolver();
  const len  = Math.floor(ctx.sampleRate * 2.2);
  const buf  = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
  }
  conv.buffer = buf;
  return conv;
}

// ── ADSR per timbre ────────────────────────────────────────────
function getADSR(timbre: TimbreType, vel: number, dur: number) {
  switch (timbre) {
    case 'pad':
      return { attack: 0.40, decay: 0.80, sustain: vel * 0.65, release: 1.40 };
    case 'square':
      return { attack: 0.004, decay: 0.04, sustain: vel * 0.55, release: 0.08 };
    case 'marimba':
      return { attack: 0.003, decay: 0.10, sustain: vel * 0.05, release: 0.12 };
    case 'synth':
      return { attack: 0.020, decay: 0.10, sustain: vel * 0.50, release: 0.18 };
    default: // piano
      return { attack: 0.010, decay: 0.14, sustain: vel * 0.42, release: Math.min(0.55, dur * 0.38) };
  }
}

// ── Oscillator layers per timbre ───────────────────────────────
type OscLayer = { f: number; type: OscillatorType; g: number };

function getOscLayers(timbre: TimbreType, freq: number): OscLayer[] {
  switch (timbre) {
    case 'synth':
      return [{ f: freq, type: 'sawtooth', g: 1.0 }];
    case 'square':
      return [{ f: freq, type: 'square', g: 1.0 }];
    case 'pad':
      return [
        { f: freq,       type: 'sine', g: 1.00 },
        { f: freq * 1.5, type: 'sine', g: 0.14 },
      ];
    case 'marimba':
      return [
        { f: freq,     type: 'sine', g: 1.00 },
        { f: freq * 4, type: 'sine', g: 0.10 },
      ];
    default: // piano
      return [
        { f: freq,     type: 'triangle', g: 1.00 },
        { f: freq * 2, type: 'sine',     g: 0.20 },
        { f: freq * 3, type: 'sine',     g: 0.06 },
      ];
  }
}

// ── Note scheduler ─────────────────────────────────────────────
function scheduleNote(
  ctx: AudioContext,
  dry: GainNode,
  wet: ConvolverNode,
  freq: number,
  vel: number,
  startTime: number,
  dur: number,
  timbre: TimbreType = 'piano',
) {
  if (freq <= 0 || vel <= 0) return;

  const adsr = getADSR(timbre, vel, dur);
  const stop = startTime + dur + adsr.release;

  const envGain = ctx.createGain();
  envGain.gain.setValueAtTime(0.001, startTime);
  envGain.gain.linearRampToValueAtTime(vel * 0.92, startTime + adsr.attack);
  envGain.gain.exponentialRampToValueAtTime(Math.max(adsr.sustain, 0.001), startTime + adsr.attack + adsr.decay);
  envGain.gain.setValueAtTime(Math.max(adsr.sustain, 0.001), startTime + dur);
  envGain.gain.exponentialRampToValueAtTime(0.001, stop);

  const layers = getOscLayers(timbre, freq);

  // Vibrato LFO (piano only)
  let lfoGain: GainNode | null = null;
  if (timbre === 'piano') {
    const lfo = ctx.createOscillator();
    lfoGain = ctx.createGain();
    lfo.frequency.value  = 5.2;
    lfoGain.gain.value   = freq * 0.0025;
    lfo.connect(lfoGain);
    lfo.start(startTime);
    lfo.stop(stop);
  }

  layers.forEach(({ f, type, g }) => {
    const osc = ctx.createOscillator();
    osc.type            = type;
    osc.frequency.value = f;
    if (lfoGain) lfoGain.connect(osc.frequency);
    const hg = ctx.createGain();
    hg.gain.value = g;
    osc.connect(hg);
    hg.connect(envGain);
    osc.start(startTime);
    osc.stop(stop);
  });

  // Lowpass filter
  const lpf = ctx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = timbre === 'synth' ? 1800 :
                        timbre === 'square' ? 8000 :
                        Math.min(4000, freq * 9);
  lpf.Q.value = timbre === 'synth' ? 2.5 : 0.5;

  envGain.connect(lpf);
  lpf.connect(dry);
  lpf.connect(wet);
}

// ── Lookahead scheduler loop ───────────────────────────────────
function schedule(track: TrackInfo) {
  if (!_ctx || !_master || !_reverb || !_isPlaying) return;
  const BEAT = 60 / track.bpm;
  const now  = _ctx.currentTime;
  while (_nextTime < now + LOOKAHEAD) {
    const note = track.pattern[_noteIdx % track.pattern.length];
    const dur  = note.d * BEAT;
    const vel  = (note.vel ?? 0.5) * track.masterVol;
    const timbre = track.timbre;

    scheduleNote(_ctx, _master, _reverb, note.f, vel, _nextTime, dur, timbre);

    if (note.bass != null) {
      const bVel  = (note.bassVel ?? (note.vel ?? 0.5) * 0.5) * track.masterVol;
      const bDur  = note.bassDur != null ? note.bassDur * BEAT : dur * 1.3;
      scheduleNote(_ctx, _master, _reverb, note.bass, bVel, _nextTime, bDur, timbre);
    }

    _nextTime += dur;
    _noteIdx++;
  }
}

// ── Public API ─────────────────────────────────────────────────
export function getCurrentTrackId(): string { return _currentTrackId; }

let _musicVolume = 0.6;
export function setMusicVolume(v: number) {
  _musicVolume = Math.max(0, Math.min(1, v));
  if (_master) _master.gain.value = _musicVolume;
}
export function getMusicVolume(): number { return _musicVolume; }

export function startMusic(trackId?: string) {
  if (trackId) _currentTrackId = trackId;
  const track = TRACKS.find(t => t.id === _currentTrackId) ?? TRACKS[0];

  if (_isPlaying) stopMusic();

  try {
    if (!_ctx) _ctx = new AudioContext();
    if (_ctx.state === 'suspended') _ctx.resume();

    _master = _ctx.createGain();
    _master.gain.value = _musicVolume;
    _master.connect(_ctx.destination);

    _reverb = buildReverb(_ctx);
    _wetGainNode = _ctx.createGain();
    _wetGainNode.gain.value = track.reverbAmt;
    _reverb.connect(_wetGainNode);
    _wetGainNode.connect(_ctx.destination);

    _nextTime = _ctx.currentTime + 0.1;
    _noteIdx  = 0;
    _isPlaying = true;

    schedule(track);
    _schedulerTimer = setInterval(() => schedule(track), TICK_MS);
  } catch (e) {
    console.warn('BgMusic start failed:', e);
  }
}

export function stopMusic() {
  _isPlaying = false;
  if (_schedulerTimer !== null) {
    clearInterval(_schedulerTimer);
    _schedulerTimer = null;
  }
  if (_master) { try { _master.disconnect(); } catch { /* ignore */ } _master = null; }
  if (_reverb) { try { _reverb.disconnect(); } catch { /* ignore */ } _reverb = null; }
  if (_wetGainNode) { try { _wetGainNode.disconnect(); } catch { /* ignore */ } _wetGainNode = null; }
}

export function isMusicPlaying(): boolean { return _isPlaying; }
