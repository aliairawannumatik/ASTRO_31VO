/* ─────────────────────────────────────────────────────────────
   NUMATIK  –  Real MP3 background music tracks
   Files are served from /music/ in the public directory.
───────────────────────────────────────────────────────────── */

export type Mp3TrackInfo = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  accentColor: string;
  url: string;         // public URL path
  volume?: number;     // optional per-track volume (0-1), default 0.4
};

export const MP3_TRACKS: Mp3TrackInfo[] = [
  {
    id: "mp3-numatik-theme",
    name: "Disco Space",
    emoji: "🪩",
    description: "Tema resmi NUMATIK!",
    accentColor: "violet",
    url: "/music/numatik-theme.mp3",
    volume: 0.45,
  },
  {
    id: "mp3-dreams",
    name: "Dreams",
    emoji: "💭",
    description: "Melodi dreamy & santai",
    accentColor: "indigo",
    url: "/music/dreams.mp3",
    volume: 0.42,
  },
  {
    id: "mp3-happy-day",
    name: "Happy Day",
    emoji: "🌞",
    description: "Ceria & menyenangkan",
    accentColor: "yellow",
    url: "/music/happy-day.mp3",
    volume: 0.40,
  },
  {
    id: "mp3-motivation",
    name: "Motivation",
    emoji: "💪",
    description: "Semangat belajar penuh energi",
    accentColor: "amber",
    url: "/music/motivation.mp3",
    volume: 0.40,
  },
  {
    id: "mp3-optimistic",
    name: "Optimistic",
    emoji: "✨",
    description: "Positif & penuh harapan",
    accentColor: "amber",
    url: "/music/optimistic.mp3",
    volume: 0.42,
  },
  {
    id: "mp3-soft-presentation",
    name: "Soft Presentation",
    emoji: "🎶",
    description: "Lembut & fokus belajar",
    accentColor: "sky",
    url: "/music/soft-presentation.mp3",
    volume: 0.40,
  },
  {
    id: "mp3-tech-ambient",
    name: "Tech Ambient",
    emoji: "🌐",
    description: "Ambience teknologi modern",
    accentColor: "cyan",
    url: "/music/tech-ambient.mp3",
    volume: 0.38,
  },
  {
    id: "mp3-tech-corporate",
    name: "Tech Corporate",
    emoji: "🏢",
    description: "Profesional & produktif",
    accentColor: "blue",
    url: "/music/tech-corporate.mp3",
    volume: 0.40,
  },
  {
    id: "mp3-architect-tech",
    name: "Architect",
    emoji: "🏗️",
    description: "Corporate advertising beat",
    accentColor: "teal",
    url: "/music/architect-tech.mp3",
    volume: 0.40,
  },
  {
    id: "mp3-tech-news",
    name: "Tech News",
    emoji: "📰",
    description: "Dinamis & informatif",
    accentColor: "green",
    url: "/music/tech-news.mp3",
    volume: 0.40,
  },
];
