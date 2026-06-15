import { useState, useCallback } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Settings, Volume2, VolumeX, Music2, Music4, Type, ChevronDown } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useSound } from "@/contexts/SoundContext";
import { useMusic } from "@/contexts/MusicContext";
import { useFont, FONT_OPTIONS, FontKey } from "@/contexts/FontContext";
import { TRACKS } from "@/hooks/bgMusicTracks";
import { MP3_TRACKS } from "@/hooks/mp3Tracks";
import { SFX_EFFECTS, playSfxById } from "@/hooks/soundEffects";

// ── Theme definitions for the selector grid ───────────────────
type ThemeDef = {
  id: Theme;
  emoji: string;
  name: string;
  desc: string;
  gradient: string;        // inline background for preview swatch
  activeBorder: string;    // Tailwind border class when active
  activeShadow: string;    // arbitrary shadow class when active
  activeDot: string;       // dot color class
  ready: boolean;          // whether this theme is fully supported
};

const THEME_DEFS: ThemeDef[] = [
  {
    id: "dark",
    emoji: "🌌",
    name: "Luar Angkasa",
    desc: "Galaksi & bintang ✨",
    gradient: "linear-gradient(135deg,#0f172a,#1e1b4b,#0e2240)",
    activeBorder: "border-violet-500",
    activeShadow: "shadow-[0_0_16px_rgba(139,92,246,0.4)]",
    activeDot: "bg-violet-400",
    ready: true,
  },
  {
    id: "white",
    emoji: "🤍",
    name: "Putih Bersih",
    desc: "Minimalis & polos 🕊️",
    gradient: "linear-gradient(135deg,#ffffff,#f8fafc,#f1f5f9)",
    activeBorder: "border-slate-400",
    activeShadow: "shadow-[0_0_16px_rgba(148,163,184,0.5)]",
    activeDot: "bg-slate-400",
    ready: true,
  },
  {
    id: "ocean",
    emoji: "🌊",
    name: "Lautan Biru",
    desc: "Kedalaman samudra 🐋",
    gradient: "linear-gradient(135deg,#0c2a4a,#075985,#0369a1)",
    activeBorder: "border-cyan-500",
    activeShadow: "shadow-[0_0_16px_rgba(6,182,212,0.4)]",
    activeDot: "bg-cyan-400",
    ready: false,
  },
  {
    id: "light",
    emoji: "❄️",
    name: "Salju Cerah",
    desc: "Musim dingin putih ❄️",
    gradient: "linear-gradient(135deg,#e0f2fe,#f0f9ff,#ffffff)",
    activeBorder: "border-blue-500",
    activeShadow: "shadow-[0_0_16px_rgba(59,130,246,0.35)]",
    activeDot: "bg-blue-500",
    ready: false,
  },
  {
    id: "forest",
    emoji: "🌿",
    name: "Hutan Hijau",
    desc: "Alam segar & daun 🍃",
    gradient: "linear-gradient(135deg,#bbf7d0,#dcfce7,#f0fdf4)",
    activeBorder: "border-green-500",
    activeShadow: "shadow-[0_0_16px_rgba(34,197,94,0.4)]",
    activeDot: "bg-green-500",
    ready: false,
  },
  {
    id: "sunset",
    emoji: "☕",
    name: "Krem Hangat",
    desc: "Hangat & lembut seperti kopi ☕",
    gradient: "linear-gradient(135deg,#fdf6e3,#f5e6c8,#e8d5a3,#d4b87a)",
    activeBorder: "border-amber-700",
    activeShadow: "shadow-[0_0_16px_rgba(160,120,64,0.45)]",
    activeDot: "bg-amber-700",
    ready: false,
  },
];

function getThemeGradient(t: Theme): string {
  const map: Record<Theme, string> = {
    dark:   "gradient-space",
    light:  "gradient-snow",
    white:  "gradient-white",
    forest: "gradient-forest",
    ocean:  "gradient-ocean",
    sunset: "gradient-sunset",
  };
  return map[t] ?? "gradient-space";
}

// Tailwind colour map for track accent colours
// (full class strings required so Tailwind JIT can detect them)
const ACCENT: Record<string, { border: string; bg: string; shadow: string; text: string; dot: string }> = {
  violet:  { border: "border-violet-500",  bg: "bg-violet-900/30",  shadow: "shadow-[0_0_18px_rgba(139,92,246,0.35)]",  text: "text-violet-300",  dot: "bg-violet-400"  },
  blue:    { border: "border-blue-500",    bg: "bg-blue-900/30",    shadow: "shadow-[0_0_18px_rgba(59,130,246,0.35)]",   text: "text-blue-300",    dot: "bg-blue-400"    },
  indigo:  { border: "border-indigo-500",  bg: "bg-indigo-900/30",  shadow: "shadow-[0_0_18px_rgba(99,102,241,0.35)]",   text: "text-indigo-300",  dot: "bg-indigo-400"  },
  pink:    { border: "border-pink-500",    bg: "bg-pink-900/30",    shadow: "shadow-[0_0_18px_rgba(236,72,153,0.35)]",   text: "text-pink-300",    dot: "bg-pink-400"    },
  cyan:    { border: "border-cyan-500",    bg: "bg-cyan-900/30",    shadow: "shadow-[0_0_18px_rgba(6,182,212,0.35)]",    text: "text-cyan-300",    dot: "bg-cyan-400"    },
  teal:    { border: "border-teal-500",    bg: "bg-teal-900/30",    shadow: "shadow-[0_0_18px_rgba(20,184,166,0.35)]",   text: "text-teal-300",    dot: "bg-teal-400"    },
  sky:     { border: "border-sky-500",     bg: "bg-sky-900/30",     shadow: "shadow-[0_0_18px_rgba(14,165,233,0.35)]",   text: "text-sky-300",     dot: "bg-sky-400"     },
  green:   { border: "border-green-500",   bg: "bg-green-900/30",   shadow: "shadow-[0_0_18px_rgba(34,197,94,0.35)]",    text: "text-green-300",   dot: "bg-green-400"   },
  amber:   { border: "border-amber-500",   bg: "bg-amber-900/30",   shadow: "shadow-[0_0_18px_rgba(245,158,11,0.35)]",   text: "text-amber-300",   dot: "bg-amber-400"   },
  rose:    { border: "border-rose-500",    bg: "bg-rose-900/30",    shadow: "shadow-[0_0_18px_rgba(244,63,94,0.35)]",    text: "text-rose-300",    dot: "bg-rose-400"    },
  fuchsia: { border: "border-fuchsia-500", bg: "bg-fuchsia-900/30", shadow: "shadow-[0_0_18px_rgba(217,70,239,0.35)]",   text: "text-fuchsia-300", dot: "bg-fuchsia-400" },
  yellow:  { border: "border-yellow-500",  bg: "bg-yellow-900/30",  shadow: "shadow-[0_0_18px_rgba(234,179,8,0.35)]",    text: "text-yellow-300",  dot: "bg-yellow-400"  },
};

const ACCENT_LIGHT: Record<string, { border: string; bg: string; shadow: string; text: string }> = {
  violet:  { border: "border-violet-500", bg: "bg-violet-50",  shadow: "shadow-[0_0_18px_rgba(139,92,246,0.2)]",  text: "text-violet-700" },
  blue:    { border: "border-blue-500",   bg: "bg-blue-50",    shadow: "shadow-[0_0_18px_rgba(59,130,246,0.2)]",   text: "text-blue-700"   },
  indigo:  { border: "border-indigo-500", bg: "bg-indigo-50",  shadow: "shadow-[0_0_18px_rgba(99,102,241,0.2)]",   text: "text-indigo-700" },
  pink:    { border: "border-pink-500",   bg: "bg-pink-50",    shadow: "shadow-[0_0_18px_rgba(236,72,153,0.2)]",   text: "text-pink-700"   },
  cyan:    { border: "border-cyan-500",   bg: "bg-cyan-50",    shadow: "shadow-[0_0_18px_rgba(6,182,212,0.2)]",    text: "text-cyan-700"   },
  teal:    { border: "border-teal-500",   bg: "bg-teal-50",    shadow: "shadow-[0_0_18px_rgba(20,184,166,0.2)]",   text: "text-teal-700"   },
  sky:     { border: "border-sky-500",    bg: "bg-sky-50",     shadow: "shadow-[0_0_18px_rgba(14,165,233,0.2)]",   text: "text-sky-700"    },
  green:   { border: "border-green-500",  bg: "bg-green-50",   shadow: "shadow-[0_0_18px_rgba(34,197,94,0.2)]",    text: "text-green-700"  },
  amber:   { border: "border-amber-500",  bg: "bg-amber-50",   shadow: "shadow-[0_0_18px_rgba(245,158,11,0.2)]",   text: "text-amber-700"  },
  rose:    { border: "border-rose-500",   bg: "bg-rose-50",    shadow: "shadow-[0_0_18px_rgba(244,63,94,0.2)]",    text: "text-rose-700"   },
  fuchsia: { border: "border-fuchsia-500",bg: "bg-fuchsia-50", shadow: "shadow-[0_0_18px_rgba(217,70,239,0.2)]",   text: "text-fuchsia-700"},
  yellow:  { border: "border-yellow-500", bg: "bg-yellow-50",  shadow: "shadow-[0_0_18px_rgba(234,179,8,0.2)]",    text: "text-yellow-700" },
};

const PengaturanPage = () => {
  const { theme, isDark, setTheme: applyTheme } = useTheme();
  const { soundOn, toggleSound, sfxId, setSfxId, volume, setVolume: setSfxVolume } = useSound();
  const { musicOn, toggleMusic, trackId, setTrackId, musicVolume, setMusicVolume: setMusicVol } = useMusic();
  const { fontKey, setFont } = useFont();

  const [shakingBtn, setShakingBtn] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tema: false,
    font: false,
    musik: false,
    suara: false,
  });
  const toggleSection = useCallback((key: string) => {
    playPopSound();
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const triggerShake = useCallback((id: string) => {
    setShakingBtn(id);
    setTimeout(() => setShakingBtn(null), 400);
  }, []);

  const handlePickTheme = (t: Theme) => {
    playPopSound();
    applyTheme(t);
  };

  const handleToggleSound = () => {
    if (soundOn) {
      toggleSound();
    } else {
      toggleSound();
      setTimeout(() => playPopSound(), 50);
    }
  };

  const handleSetFont = (key: FontKey) => {
    playPopSound();
    setFont(key);
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${getThemeGradient(theme)}`}>
      <Starfield />
      <PageNavigation />

      <style>{`
        @keyframes numatik-shake-anim {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-5px) rotate(-1.5deg); }
          30%  { transform: translateX(5px) rotate(1.5deg); }
          45%  { transform: translateX(-4px) rotate(-1deg); }
          60%  { transform: translateX(4px) rotate(1deg); }
          75%  { transform: translateX(-2px); }
          90%  { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        .numatik-shake { animation: numatik-shake-anim 0.4s ease; }

        .numatik-music-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px;
          border-radius: 50%; background: linear-gradient(135deg,#8b5cf6,#d946ef);
          box-shadow: 0 0 8px rgba(139,92,246,0.5); cursor: pointer; border: 2px solid white;
        }
        .numatik-music-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg,#8b5cf6,#d946ef);
          box-shadow: 0 0 8px rgba(139,92,246,0.5); cursor: pointer; border: 2px solid white;
        }
        .numatik-sfx-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px;
          border-radius: 50%; background: linear-gradient(135deg,#06b6d4,#3b82f6);
          box-shadow: 0 0 8px rgba(6,182,212,0.5); cursor: pointer; border: 2px solid white;
        }
        .numatik-sfx-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg,#06b6d4,#3b82f6);
          box-shadow: 0 0 8px rgba(6,182,212,0.5); cursor: pointer; border: 2px solid white;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .accordion-content.open {
          max-height: 3000px;
          transition: max-height 0.5s cubic-bezier(0,0,0.2,1);
        }
      `}</style>

      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col gap-4 py-24">

        {/* ── Hero Header ── */}
        <div className="text-center mb-1">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 ${
            isDark
              ? "bg-gradient-to-br from-blue-600/25 to-violet-600/25 border border-white/10 shadow-[0_0_24px_rgba(99,102,241,0.25)]"
              : "bg-gradient-to-br from-blue-100 to-violet-100 border border-blue-200/60 shadow-lg"
          }`}>
            <Settings className={`w-8 h-8 ${isDark ? "text-blue-300" : "text-blue-600"}`} />
          </div>
          <h1 className={`font-display text-4xl font-black tracking-tight ${
            isDark
              ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-300"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600"
          }`}>
            Pengaturan
          </h1>
          <p className={`font-body text-sm mt-1.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
            Sesuaikan aplikasi sesuai keinginanmu ✨
          </p>
        </div>

        {/* ── TEMA TAMPILAN ── */}
        <div className={`relative rounded-2xl overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-blue-500/10 to-violet-500/5 border border-white/10 backdrop-blur-xl shadow-[0_4px_32px_rgba(99,102,241,0.12)]"
            : "bg-white/92 backdrop-blur-xl border border-blue-100/80 shadow-xl"
        }`}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-400 to-violet-500 rounded-r-full" />
          <div className="px-5 py-5 pl-6">

            {/* Section header — clickable */}
            <button
              onClick={() => toggleSection("tema")}
              className="w-full flex items-center gap-3 mb-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                <span className="text-[18px] leading-none">🎨</span>
              </div>
              <div className="flex-1 text-left">
                <h2 className={`font-display text-[15px] font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  Tema Tampilan
                </h2>
                <p className={`font-body text-[11px] ${isDark ? "text-white/40" : "text-gray-400"}`}>
                  Pilih tampilan yang kamu suka
                </p>
              </div>
              <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                openSections.tema ? "rotate-180" : ""
              } ${isDark ? "text-white/40" : "text-gray-400"}`} />
            </button>

          </div>

          {/* Accordion content */}
          <div className={`accordion-content${openSections.tema ? " open" : ""}`}>
            <div className="accordion-inner px-5 pb-5 pl-6 pt-4">
              {/* Theme grid — 3 columns */}
              <div className="grid grid-cols-3 gap-2">
                {THEME_DEFS.map((td) => {
                  const isActive = theme === td.id;
                  return (
                    <button
                      key={td.id}
                      onClick={() => handlePickTheme(td.id)}
                      className={`relative rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 border-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? `${td.activeBorder} ${td.activeShadow} ${isDark ? "bg-white/10" : "bg-white"}`
                          : isDark
                            ? "border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/7"
                            : "border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-white"
                      }`}
                    >
                      <div className="w-full h-8 rounded-lg border border-black/10" style={{ background: td.gradient }} />
                      <span className="text-[17px] leading-none">{td.emoji}</span>
                      <p className={`font-display font-bold text-[10px] text-center leading-tight ${isDark ? "text-white/80" : "text-gray-700"}`}>
                        {td.name}
                      </p>
                      {/* Ready / Not Ready badge */}
                      <span className={`text-[8px] font-bold font-display px-1.5 py-0.5 rounded-full leading-none ${
                        td.ready
                          ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                          : isDark
                            ? "bg-white/10 text-white/35 ring-1 ring-white/10"
                            : "bg-gray-200 text-gray-400 ring-1 ring-gray-300"
                      }`}>
                        {td.ready ? "✓ Ready" : "Not Ready"}
                      </span>
                      {isActive && (
                        <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${td.activeDot}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── GAYA FONT ── */}
        <div className={`relative rounded-2xl overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-white/10 backdrop-blur-xl shadow-[0_4px_32px_rgba(245,158,11,0.10)]"
            : "bg-white/92 backdrop-blur-xl border border-amber-100/80 shadow-xl"
        }`}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 to-orange-500 rounded-r-full" />
          <div className="px-5 py-5 pl-6">

            <button
              onClick={() => toggleSection("font")}
              className="w-full flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                <Type className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex-1 text-left">
                <h2 className={`font-display text-[15px] font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  Gaya Font
                </h2>
                <p className={`font-body text-[11px] ${isDark ? "text-white/40" : "text-gray-400"}`}>
                  Font yang nyaman untuk belajar
                </p>
              </div>
              <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                openSections.font ? "rotate-180" : ""
              } ${isDark ? "text-white/40" : "text-gray-400"}`} />
            </button>

          </div>

          {/* Accordion content */}
          <div className={`accordion-content${openSections.font ? " open" : ""}`}>
            <div className="accordion-inner px-5 pb-5 pl-6 pt-4">
              <div className="flex flex-col gap-2">
                {FONT_OPTIONS.map((font) => {
                  const isActive = fontKey === font.key;
                  return (
                    <button
                      key={font.key}
                      onClick={() => handleSetFont(font.key)}
                      className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-2 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? isDark
                            ? "border-amber-500/70 bg-amber-500/12 shadow-[0_0_14px_rgba(245,158,11,0.2)]"
                            : "border-amber-400 bg-amber-50 shadow-[0_0_14px_rgba(245,158,11,0.15)]"
                          : isDark
                            ? "border-white/8 bg-white/4 hover:border-amber-500/40"
                            : "border-gray-200 bg-gray-50 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{font.emoji}</span>
                        <div className="text-left">
                          <p
                            className={`text-sm font-semibold leading-tight ${isActive ? (isDark ? "text-amber-300" : "text-amber-700") : isDark ? "text-white" : "text-gray-800"}`}
                            style={{ fontFamily: font.displayFont }}
                          >
                            {font.label}
                          </p>
                          <p className={`font-body text-[11px] mt-0.5 ${isDark ? "text-white/35" : "text-gray-400"}`}>
                            {font.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs ${isActive ? (isDark ? "text-amber-400" : "text-amber-600") : isDark ? "text-white/20" : "text-gray-300"}`}
                          style={{ fontFamily: font.bodyFont }}
                        >
                          Aa
                        </span>
                        {isActive && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDark ? "bg-amber-400" : "bg-amber-500"}`} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── MUSIK LATAR ── */}
        <div className={`relative rounded-2xl overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-white/10 backdrop-blur-xl shadow-[0_4px_32px_rgba(139,92,246,0.12)]"
            : "bg-white/92 backdrop-blur-xl border border-violet-100/80 shadow-xl"
        }`}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-r-full" />
          <div className="px-5 py-5 pl-6">

            {/* Section header + inline toggle switch */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSection("musik")}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                  <Music2 className="w-[18px] h-[18px] text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`font-display text-[15px] font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    Musik Latar
                  </h2>
                  <p className={`font-body text-[11px] ${
                    musicOn
                      ? isDark ? "text-violet-300/80" : "text-violet-500"
                      : isDark ? "text-white/35" : "text-gray-400"
                  }`}>
                    {musicOn ? "🎵 Musik sedang diputar" : "🔕 Musik dimatikan"}
                  </p>
                </div>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 mr-2 ${
                  openSections.musik ? "rotate-180" : ""
                } ${isDark ? "text-white/40" : "text-gray-400"}`} />
              </button>
              {/* Pill toggle */}
              <button
                onClick={() => { playPopSound(); toggleMusic(); triggerShake("music-toggle"); }}
                className={`relative rounded-full transition-all duration-300 flex-shrink-0 ${shakingBtn === "music-toggle" ? "numatik-shake" : ""} ${
                  musicOn
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_14px_rgba(139,92,246,0.5)]"
                    : isDark ? "bg-white/15" : "bg-gray-300"
                }`}
                style={{ width: "52px", height: "28px" }}
              >
                <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-300 ${musicOn ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

          </div>

          {/* Accordion content */}
          <div className={`accordion-content${openSections.musik ? " open" : ""}`}>
            <div className="accordion-inner px-5 pb-5 pl-6 pt-4">

            {/* Volume slider */}
            <div className={`rounded-xl px-4 py-3 mb-4 ${isDark ? "bg-white/5 border border-white/8" : "bg-gray-50 border border-gray-100"}`}>
              <div className="flex items-center justify-between mb-2.5">
                <p className={`font-display text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-500"}`}>
                  🎚️ Volume Musik
                </p>
                <span className={`font-display text-xs font-bold px-2 py-0.5 rounded-full ${
                  isDark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"
                }`}>
                  {musicVolume}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-white/25" : "text-gray-400"}`} />
                <div className="relative flex-1 h-6 flex items-center">
                  <div className={`absolute w-full h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
                  <div className="absolute h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 pointer-events-none" style={{ width: `${musicVolume}%` }} />
                  <input
                    type="range" min={0} max={100} step={5} value={musicVolume}
                    onChange={(e) => setMusicVol(Number(e.target.value))}
                    className="relative w-full h-1.5 appearance-none bg-transparent cursor-pointer numatik-music-slider"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
                <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-violet-300" : "text-violet-600"}`} />
              </div>
            </div>

            {/* Track list */}
            <div className="flex flex-col gap-1.5 max-h-[440px] overflow-y-auto pr-0.5" style={{ scrollbarWidth: "thin" }}>

              <p className={`font-body text-[10px] font-bold uppercase tracking-widest mb-1 px-1 ${isDark ? "text-violet-400/60" : "text-violet-500"}`}>
                🎵 Pilih Musik
              </p>

              {MP3_TRACKS.map((track) => {
                const isActive = trackId === track.id;
                const ac  = ACCENT[track.accentColor]  ?? ACCENT["violet"];
                const acl = ACCENT_LIGHT[track.accentColor] ?? ACCENT_LIGHT["violet"];
                return (
                  <button
                    key={track.id}
                    onClick={() => { playPopSound(); setTrackId(track.id); if (!musicOn) toggleMusic(); }}
                    className={`w-full rounded-xl px-4 py-2.5 flex items-center gap-3 border transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? isDark
                          ? `${ac.border} ${ac.bg} ${ac.shadow}`
                          : `${acl.border} ${acl.bg} ${acl.shadow}`
                        : isDark
                          ? "border-white/7 bg-white/4 hover:border-white/15 hover:bg-white/6"
                          : "border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-white"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{track.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`font-display font-bold text-sm leading-tight truncate ${
                          isActive ? (isDark ? ac.text : acl.text) : isDark ? "text-white/85" : "text-gray-800"
                        }`}>{track.name}</p>
                        <span className={`text-[8px] font-bold rounded px-1 py-0.5 flex-shrink-0 ${
                          isDark ? "bg-violet-900/50 text-violet-300" : "bg-violet-100 text-violet-600"
                        }`}>MP3</span>
                      </div>
                      <p className={`font-body text-[10px] mt-0.5 truncate ${
                        isActive ? (isDark ? "text-white/45" : "text-gray-500") : isDark ? "text-white/28" : "text-gray-400"
                      }`}>{track.description}</p>
                    </div>
                    {isActive && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDark ? ac.dot : acl.border.replace("border-","bg-")}`} />}
                  </button>
                );
              })}

              {TRACKS.length > 0 && (
                <>
                  <div className={`flex items-center gap-2 my-1 ${isDark ? "text-white/15" : "text-gray-300"}`}>
                    <div className="flex-1 h-px bg-current" />
                    <p className={`font-body text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-blue-400/55" : "text-blue-400"}`}>🎹 Sintesis</p>
                    <div className="flex-1 h-px bg-current" />
                  </div>
                  {TRACKS.map((track) => {
                    const isActive = trackId === track.id;
                    const ac  = ACCENT[track.accentColor]  ?? ACCENT["violet"];
                    const acl = ACCENT_LIGHT[track.accentColor] ?? ACCENT_LIGHT["violet"];
                    return (
                      <button
                        key={track.id}
                        onClick={() => { playPopSound(); setTrackId(track.id); if (!musicOn) toggleMusic(); }}
                        className={`w-full rounded-xl px-4 py-2.5 flex items-center gap-3 border transition-all duration-200 cursor-pointer text-left ${
                          isActive
                            ? isDark ? `${ac.border} ${ac.bg} ${ac.shadow}` : `${acl.border} ${acl.bg} ${acl.shadow}`
                            : isDark ? "border-white/7 bg-white/4 hover:border-white/15" : "border-gray-200 bg-gray-50/80 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{track.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-display font-bold text-sm leading-tight truncate ${
                            isActive ? (isDark ? ac.text : acl.text) : isDark ? "text-white/85" : "text-gray-800"
                          }`}>{track.name}</p>
                          <p className={`font-body text-[10px] mt-0.5 truncate ${
                            isActive ? (isDark ? "text-white/45" : "text-gray-500") : isDark ? "text-white/28" : "text-gray-400"
                          }`}>{track.description}</p>
                        </div>
                        {isActive && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDark ? ac.dot : acl.border.replace("border-","bg-")}`} />}
                      </button>
                    );
                  })}
                </>
              )}

            </div>
            </div>
          </div>

        </div>

        {/* ── EFEK SUARA ── */}
        <div className={`relative rounded-2xl overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-white/10 backdrop-blur-xl shadow-[0_4px_32px_rgba(6,182,212,0.12)]"
            : "bg-white/92 backdrop-blur-xl border border-cyan-100/80 shadow-xl"
        }`}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
          <div className="px-5 py-5 pl-6">

            {/* Section header + inline toggle switch */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSection("suara")}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
                  <Volume2 className="w-[18px] h-[18px] text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`font-display text-[15px] font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    Efek Suara
                  </h2>
                  <p className={`font-body text-[11px] ${
                    soundOn
                      ? isDark ? "text-cyan-300/80" : "text-cyan-600"
                      : isDark ? "text-white/35" : "text-gray-400"
                  }`}>
                    {soundOn ? "🔊 Suara tombol aktif" : "🔇 Suara dimatikan"}
                  </p>
                </div>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 mr-2 ${
                  openSections.suara ? "rotate-180" : ""
                } ${isDark ? "text-white/40" : "text-gray-400"}`} />
              </button>
              {/* Pill toggle */}
              <button
                onClick={() => { handleToggleSound(); triggerShake("sound-toggle"); }}
                className={`relative rounded-full transition-all duration-300 flex-shrink-0 ${shakingBtn === "sound-toggle" ? "numatik-shake" : ""} ${
                  soundOn
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_14px_rgba(6,182,212,0.5)]"
                    : isDark ? "bg-white/15" : "bg-gray-300"
                }`}
                style={{ width: "52px", height: "28px" }}
              >
                <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-300 ${soundOn ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

          </div>

          {/* Accordion content */}
          <div className={`accordion-content${openSections.suara ? " open" : ""}`}>
            <div className="accordion-inner px-5 pb-5 pl-6 pt-4">

            {/* Volume slider */}
            <div className={`rounded-xl px-4 py-3 mb-5 ${isDark ? "bg-white/5 border border-white/8" : "bg-gray-50 border border-gray-100"}`}>
              <div className="flex items-center justify-between mb-2.5">
                <p className={`font-display text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-500"}`}>
                  🔉 Volume Efek Suara
                </p>
                <span className={`font-display text-xs font-bold px-2 py-0.5 rounded-full ${
                  isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-cyan-100 text-cyan-700"
                }`}>
                  {volume}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-white/25" : "text-gray-400"}`} />
                <div className="relative flex-1 h-6 flex items-center">
                  <div className={`absolute w-full h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
                  <div className="absolute h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 pointer-events-none" style={{ width: `${volume}%` }} />
                  <input
                    type="range" min={0} max={100} step={5} value={volume}
                    onChange={(e) => setSfxVolume(Number(e.target.value))}
                    onMouseUp={() => { if (soundOn) playSfxById(sfxId); }}
                    onTouchEnd={() => { if (soundOn) playSfxById(sfxId); }}
                    className="relative w-full h-1.5 appearance-none bg-transparent cursor-pointer numatik-sfx-slider"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
                <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
              </div>
            </div>

            {/* SFX grid */}
            <p className={`font-display text-xs font-semibold mb-2.5 ${isDark ? "text-white/55" : "text-gray-500"}`}>
              🎛️ Variasi Suara Tombol
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SFX_EFFECTS.map((sfx) => {
                const active = sfxId === sfx.id;
                return (
                  <button
                    key={sfx.id}
                    onClick={() => { setSfxId(sfx.id); if (soundOn) playSfxById(sfx.id); }}
                    className={`rounded-xl px-3 py-2.5 flex items-center gap-2.5 border transition-all duration-200 cursor-pointer text-left ${
                      active
                        ? isDark
                          ? "border-violet-500/80 bg-violet-500/15 shadow-[0_0_14px_rgba(139,92,246,0.3)]"
                          : "border-violet-400 bg-violet-50 shadow-[0_0_14px_rgba(139,92,246,0.15)]"
                        : isDark
                          ? "border-white/7 bg-white/4 hover:border-violet-500/40"
                          : "border-gray-200 bg-gray-50 hover:border-violet-300"
                    }`}
                  >
                    <span className="text-xl leading-none flex-shrink-0">{sfx.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`font-display font-bold text-xs leading-tight ${
                        active ? (isDark ? "text-violet-200" : "text-violet-800") : isDark ? "text-white/80" : "text-gray-700"
                      }`}>{sfx.name}</p>
                      <p className={`font-body text-[9px] leading-tight mt-0.5 truncate ${
                        active ? (isDark ? "text-violet-400/70" : "text-violet-500/80") : isDark ? "text-white/30" : "text-gray-400"
                      }`}>{sfx.description}</p>
                    </div>
                    {active && <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-violet-400" />}
                  </button>
                );
              })}
            </div>

            </div>
          </div>

        </div>

        {/* Footer note */}
        <div className={`text-center py-2`}>
          <p className={`font-body text-[11px] ${isDark ? "text-white/25" : "text-gray-400"}`}>
            {isDark ? "✨ Mode Luar Angkasa — bintang menemanimu belajar" : "🌟 Semangat belajar hari ini!"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default PengaturanPage;
