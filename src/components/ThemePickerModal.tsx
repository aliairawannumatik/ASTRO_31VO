import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, X, Gamepad2, BookOpen, ClipboardCheck,
  Trophy, Bot, Calculator, Zap, FileText,
} from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";

/* ── Theme definitions ─────────────────────────────────────── */
type ThemeDef = {
  id: Theme;
  emoji: string;
  name: string;
  gradient: string;
  ring: string;
  dot: string;
};

const THEMES: ThemeDef[] = [
  {
    id: "dark",
    emoji: "🌌",
    name: "Luar Angkasa",
    gradient: "linear-gradient(135deg,#0f172a,#1e1b4b,#0e2240)",
    ring: "ring-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.6)]",
    dot: "bg-violet-400",
  },
  {
    id: "white",
    emoji: "🤍",
    name: "Putih Bersih",
    gradient: "linear-gradient(135deg,#ffffff,#f8fafc,#f1f5f9)",
    ring: "ring-slate-400 shadow-[0_0_16px_rgba(148,163,184,0.5)]",
    dot: "bg-slate-400",
  },
  {
    id: "ocean",
    emoji: "🌊",
    name: "Lautan Biru",
    gradient: "linear-gradient(135deg,#0c2a4a,#075985,#0369a1)",
    ring: "ring-cyan-500 shadow-[0_0_16px_rgba(6,182,212,0.5)]",
    dot: "bg-cyan-400",
  },
  {
    id: "light",
    emoji: "❄️",
    name: "Salju Cerah",
    gradient: "linear-gradient(135deg,#e0f2fe,#f0f9ff,#ffffff)",
    ring: "ring-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.4)]",
    dot: "bg-blue-500",
  },
  {
    id: "forest",
    emoji: "🌿",
    name: "Hutan Hijau",
    gradient: "linear-gradient(135deg,#bbf7d0,#dcfce7,#f0fdf4)",
    ring: "ring-green-500 shadow-[0_0_16px_rgba(34,197,94,0.45)]",
    dot: "bg-green-500",
  },
  {
    id: "sunset",
    emoji: "☁️",
    name: "Langit Cerah",
    gradient: "linear-gradient(135deg,#38bdf8,#7dd3fc,#bae6fd,#e0f2fe)",
    ring: "ring-sky-400 shadow-[0_0_16px_rgba(14,165,233,0.5)]",
    dot: "bg-sky-400",
  },
];

/* ── Mini menu items to display in preview ─────────────────── */
const PREVIEW_ITEMS = [
  { icon: BookOpen,      label: "BUKU ANIMASI" },
  { icon: Gamepad2,      label: "GAME ARENA" },
  { icon: Bot,           label: "NUMATIK AI" },
  { icon: ClipboardCheck,label: "LKPD" },
  { icon: Trophy,        label: "OLIMPIADE" },
  { icon: Calculator,    label: "KALKULATOR" },
  { icon: Zap,           label: "HITUNG CEPAT" },
  { icon: FileText,      label: "BANK SOAL" },
];

/* ── Inline background per theme for the preview bg ─────────── */
const THEME_BG: Record<Theme, string> = {
  dark:   "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0e2240 100%)",
  white:  "linear-gradient(160deg,#ffffff 0%,#fafbfc 50%,#f5f7fa 100%)",
  ocean:  "linear-gradient(160deg,#061f3a 0%,#0c2a4a 40%,#075985 100%)",
  light:  "linear-gradient(160deg,#bfdbfe 0%,#dbeafe 30%,#e0f2fe 60%,#f0f9ff 100%)",
  forest: "linear-gradient(160deg,#bbf7d0 0%,#d1fae5 35%,#dcfce7 70%,#f0fdf4 100%)",
  sunset: "linear-gradient(160deg,#38bdf8 0%,#7dd3fc 25%,#bae6fd 55%,#e0f2fe 85%,#f0f9ff 100%)",
};

/* ── Card styles per theme ───────────────────────────────────── */
const CARD_STYLE: Record<Theme, { bg: string; border: string; text: string; sub: string; icon: string }> = {
  dark:   { bg: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.12)", text: "#e2e8f0", sub: "rgba(147,197,253,0.7)", icon: "#38bdf8" },
  white:  { bg: "linear-gradient(135deg,#2196f3,#00bcd4)", border: "transparent", text: "#ffffff", sub: "rgba(255,255,255,0.8)", icon: "#ffffff" },
  ocean:  { bg: "rgba(255,255,255,0.07)", border: "rgba(6,182,212,0.25)", text: "#cffafe", sub: "rgba(103,232,249,0.65)", icon: "#22d3ee" },
  light:  { bg: "rgba(255,255,255,0.75)", border: "rgba(59,130,246,0.2)", text: "#1e3a8a", sub: "#3b82f6", icon: "#2563eb" },
  forest: { bg: "rgba(255,255,255,0.65)", border: "rgba(34,197,94,0.25)", text: "#14532d", sub: "#16a34a", icon: "#15803d" },
  sunset: { bg: "rgba(255,255,255,0.75)", border: "rgba(14,165,233,0.25)", text: "#0c4a6e", sub: "#0369a1", icon: "#0284c7" },
};

/* ── Title colour per theme ──────────────────────────────────── */
const TITLE_COLOR: Record<Theme, string> = {
  dark:   "#fbbf24",
  white:  "#2196f3",
  ocean:  "#67e8f9",
  light:  "#1d4ed8",
  forest: "#166534",
  sunset: "#0369a1",
};

/* ── MenuPreview component ───────────────────────────────────── */
const MenuPreview = ({ theme }: { theme: Theme }) => {
  const card = CARD_STYLE[theme];
  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden relative"
      style={{ background: THEME_BG[theme] }}
    >
      {/* subtle star dots for dark/ocean themes */}
      {(theme === "dark" || theme === "ocean") && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.35,
        }} />
      )}

      <div className="relative z-10 flex flex-col items-center pt-3 px-3 pb-2 h-full">
        {/* Header */}
        <p className="font-display font-black text-[11px] tracking-widest mb-0.5"
           style={{ color: TITLE_COLOR[theme] }}>
          MENU UTAMA
        </p>
        <p className="font-body text-[8px] mb-2 opacity-50"
           style={{ color: TITLE_COLOR[theme] }}>
          Pilih menu yang ingin kamu jelajahi
        </p>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-1.5 w-full">
          {PREVIEW_ITEMS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-lg flex flex-col items-center gap-0.5 py-2 px-1"
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
              }}
            >
              <Icon
                style={{ color: card.icon, width: 12, height: 12 }}
              />
              <span
                className="font-display font-bold leading-tight text-center"
                style={{ color: card.text, fontSize: "6px" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main modal ──────────────────────────────────────────────── */
interface Props {
  open: boolean;
  onClose: () => void;
}

const ThemePickerModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [selected, setSelected] = useState<Theme>(theme);
  const [confirming, setConfirming] = useState(false);

  const handleSelect = (id: Theme) => {
    playPopSound();
    setSelected(id);
    setTheme(id);
  };

  const handleContinue = () => {
    playPopSound();
    setConfirming(true);
    setTimeout(() => navigate("/menu"), 350);
  };

  const handleSkip = () => {
    playPopSound();
    navigate("/menu");
  };

  const activeDef = THEMES.find((t) => t.id === selected)!;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-[90] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-gradient-to-br from-[#0f172a] via-[#1a1a3e] to-[#0e1a40] border border-white/10 rounded-3xl shadow-2xl shadow-black/70 overflow-hidden">

              {/* ── Header ── */}
              <div className="relative px-5 pt-5 pb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                  <span className="text-xl">🎨</span>
                </div>
                <div>
                  <h2 className="font-display text-[16px] font-black text-white leading-tight">
                    Pilih Tema Tampilan
                  </h2>
                  <p className="font-body text-[11px] text-white/45">
                    Preview langsung tampilan menu utama
                  </p>
                </div>
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/8 hover:bg-white/16 transition flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>

              {/* ── Live Preview ── */}
              <div className="px-5 pb-3">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                     style={{ height: 168 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selected}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      className="absolute inset-0"
                    >
                      <MenuPreview theme={selected} />
                    </motion.div>
                  </AnimatePresence>

                  {/* Preview label badge */}
                  <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15">
                    <span className="font-display text-[9px] font-bold text-white/70 tracking-widest uppercase">
                      Preview
                    </span>
                  </div>

                  {/* Active theme badge */}
                  <motion.div
                    key={`badge-${selected}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15"
                  >
                    <span className="text-[10px]">{activeDef.emoji}</span>
                    <span className="font-display text-[9px] font-bold text-white/80">
                      {activeDef.name}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* ── Theme selector grid ── */}
              <div className="px-5 pb-3">
                <div className="grid grid-cols-6 gap-2">
                  {THEMES.map((t) => {
                    const isActive = selected === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelect(t.id)}
                        title={t.name}
                        className={`relative rounded-xl flex flex-col items-center gap-1 py-2 px-1 border-2 transition-all duration-200 cursor-pointer ring-2 ring-transparent ${
                          isActive
                            ? `border-transparent ${t.ring}`
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/25"
                        }`}
                      >
                        {/* Gradient swatch */}
                        <div
                          className="w-full h-7 rounded-lg border border-black/10"
                          style={{ background: t.gradient }}
                        />
                        <span className="text-[13px] leading-none">{t.emoji}</span>

                        {/* Active dot */}
                        {isActive && (
                          <motion.div
                            layoutId="theme-active-dot"
                            className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${t.dot}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected name */}
                <motion.p
                  key={selected}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center font-display text-[12px] font-bold text-white/70 mt-2"
                >
                  {activeDef.emoji} {activeDef.name}
                </motion.p>
              </div>

              {/* ── CTA ── */}
              <div className="px-5 pb-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                  disabled={confirming}
                  className="w-full py-3.5 rounded-2xl font-display font-black text-[15px] text-white tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer disabled:opacity-70"
                >
                  {confirming ? "⏳ Memuat..." : "🚀 Mulai dengan tema ini!"}
                </motion.button>
              </div>

              {/* ── Info note ── */}
              <div className="mx-5 mb-5 rounded-xl bg-white/5 border border-white/8 px-4 py-2.5 flex items-start gap-2">
                <Settings className="w-3.5 h-3.5 text-white/35 flex-shrink-0 mt-0.5" />
                <p className="font-body text-[11px] text-white/40 leading-snug">
                  Ingin ganti tema nanti? Buka{" "}
                  <span className="text-white/60 font-semibold">Pengaturan → Tema Tampilan</span>{" "}
                  kapan saja dari menu utama.
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemePickerModal;
