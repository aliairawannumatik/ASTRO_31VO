import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, X, Gamepad2, BookOpen, ClipboardCheck,
  Trophy, Bot, Calculator, Zap, FileText, GraduationCap,
  ArrowLeftRight, Sigma, Brain, PlayCircle, FileQuestion,
  Rocket, User, Heart, Info,
} from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";

/* ── Theme definitions ─────────────────────────────────────── */
type ThemeDef = {
  id: Theme;
  emoji: string;
  name: string;
  swatch: string;
  ring: string;
  dot: string;
};

const THEMES: ThemeDef[] = [
  {
    id: "dark",   emoji: "🌌", name: "Luar Angkasa",
    swatch: "linear-gradient(135deg,#0f172a,#1e1b4b,#0e2240)",
    ring: "ring-violet-500 shadow-[0_0_14px_rgba(139,92,246,0.6)]", dot: "bg-violet-400",
  },
  {
    id: "white",  emoji: "🤍", name: "Putih Bersih",
    swatch: "linear-gradient(135deg,#ffffff,#f8fafc,#f1f5f9)",
    ring: "ring-slate-400 shadow-[0_0_14px_rgba(148,163,184,0.5)]", dot: "bg-slate-400",
  },
  {
    id: "sunset", emoji: "☁️", name: "Langit Cerah",
    swatch: "linear-gradient(135deg,#38bdf8,#7dd3fc,#bae6fd,#e0f2fe)",
    ring: "ring-sky-400 shadow-[0_0_14px_rgba(14,165,233,0.5)]", dot: "bg-sky-400",
  },
  {
    id: "ocean",  emoji: "🌊", name: "Lautan Biru",
    swatch: "linear-gradient(135deg,#0c2a4a,#075985,#0369a1)",
    ring: "ring-cyan-500 shadow-[0_0_14px_rgba(6,182,212,0.5)]", dot: "bg-cyan-400",
  },
  {
    id: "light",  emoji: "❄️", name: "Salju Cerah",
    swatch: "linear-gradient(135deg,#e0f2fe,#f0f9ff,#ffffff)",
    ring: "ring-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.4)]", dot: "bg-blue-500",
  },
  {
    id: "forest", emoji: "🌿", name: "Hutan Hijau",
    swatch: "linear-gradient(135deg,#bbf7d0,#dcfce7,#f0fdf4)",
    ring: "ring-green-500 shadow-[0_0_14px_rgba(34,197,94,0.45)]", dot: "bg-green-500",
  },
];

/* ── Per-theme visual tokens for the full-screen preview ─────── */
const PREVIEW_BG: Record<Theme, string> = {
  dark:   "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0e2240 100%)",
  white:  "linear-gradient(160deg,#ffffff 0%,#fafbfc 50%,#f5f7fa 100%)",
  ocean:  "linear-gradient(160deg,#061f3a 0%,#0c2a4a 40%,#075985 100%)",
  light:  "linear-gradient(160deg,#bfdbfe 0%,#dbeafe 35%,#e0f2fe 65%,#f0f9ff 100%)",
  forest: "linear-gradient(160deg,#bbf7d0 0%,#d1fae5 35%,#dcfce7 70%,#f0fdf4 100%)",
  sunset: "linear-gradient(160deg,#38bdf8 0%,#7dd3fc 25%,#bae6fd 55%,#e0f2fe 85%,#f0f9ff 100%)",
};

type CardTokens = { bg: string; border: string; text: string; sub: string; icon: string };
const CARD: Record<Theme, CardTokens> = {
  dark:   { bg:"rgba(255,255,255,0.07)", border:"rgba(255,255,255,0.13)", text:"#e2e8f0", sub:"rgba(147,197,253,0.65)", icon:"#38bdf8" },
  white:  { bg:"linear-gradient(135deg,#2196f3,#00bcd4)", border:"transparent", text:"#ffffff", sub:"rgba(255,255,255,0.8)", icon:"#ffffff" },
  ocean:  { bg:"rgba(255,255,255,0.08)", border:"rgba(6,182,212,0.28)", text:"#cffafe", sub:"rgba(103,232,249,0.65)", icon:"#22d3ee" },
  light:  { bg:"rgba(255,255,255,0.78)", border:"rgba(59,130,246,0.22)", text:"#1e3a8a", sub:"#3b82f6", icon:"#2563eb" },
  forest: { bg:"rgba(255,255,255,0.68)", border:"rgba(34,197,94,0.28)", text:"#14532d", sub:"#16a34a", icon:"#15803d" },
  sunset: { bg:"rgba(255,255,255,0.78)", border:"rgba(14,165,233,0.28)", text:"#0c4a6e", sub:"#0369a1", icon:"#0284c7" },
};

const TITLE_COLOR: Record<Theme, string> = {
  dark:"#fbbf24", white:"#2196f3", ocean:"#67e8f9",
  light:"#1d4ed8", forest:"#166534", sunset:"#0369a1",
};

const SUBTITLE_COLOR: Record<Theme, string> = {
  dark:"rgba(147,197,253,0.7)", white:"rgba(33,150,243,0.7)", ocean:"rgba(103,232,249,0.65)",
  light:"rgba(59,130,246,0.8)", forest:"rgba(22,163,74,0.8)", sunset:"rgba(3,105,161,0.7)",
};

/* ── Menu items to show in preview ──────────────────────────── */
const PREVIEW_ITEMS = [
  { icon: GraduationCap, label: "RUANG GURU" },
  { icon: BookOpen,      label: "BUKU ANIMASI" },
  { icon: Gamepad2,      label: "GAME ARENA" },
  { icon: Bot,           label: "NUMATIK AI" },
  { icon: ClipboardCheck,label: "LKPD" },
  { icon: Trophy,        label: "OLIMPIADE" },
  { icon: Calculator,    label: "KALKULATOR" },
  { icon: Zap,           label: "HITUNG CEPAT" },
  { icon: Brain,         label: "TES AKADEMIK" },
  { icon: ArrowLeftRight,label: "KONVERSI" },
  { icon: Sigma,         label: "RUMUS" },
  { icon: PlayCircle,    label: "VIDEO" },
  { icon: FileText,      label: "BANK SOAL" },
  { icon: FileQuestion,  label: "LATIHAN" },
  { icon: Rocket,        label: "TENTANG" },
  { icon: User,          label: "BIOGRAFI" },
  { icon: Heart,         label: "DONASI" },
  { icon: Info,          label: "PETUNJUK" },
];

/* ── Full-screen menu preview ────────────────────────────────── */
const FullMenuPreview = ({ theme }: { theme: Theme }) => {
  const c = CARD[theme];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: PREVIEW_BG[theme] }}>
      {/* Star pattern overlay for dark/ocean */}
      {(theme === "dark" || theme === "ocean") && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }} />
      )}

      {/* Leaf/nature pattern for forest */}
      {theme === "forest" && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(34,197,94,0.15) 2px, transparent 2px)",
          backgroundSize: "32px 32px",
          opacity: 0.6,
        }} />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-6 px-5 pb-2">
        {/* Nav bar mock */}
        <div className="w-full flex justify-between items-center mb-5 opacity-50">
          <div className="h-3 w-12 rounded-full" style={{ background: TITLE_COLOR[theme], opacity: 0.4 }} />
          <div className="h-3 w-16 rounded-full" style={{ background: TITLE_COLOR[theme], opacity: 0.4 }} />
        </div>

        {/* Title */}
        <h1
          className="font-display font-black text-2xl tracking-widest mb-1"
          style={{ color: TITLE_COLOR[theme] }}
        >
          MENU UTAMA
        </h1>
        <p className="font-body text-xs mb-5" style={{ color: SUBTITLE_COLOR[theme] }}>
          Pilih menu yang ingin kamu jelajahi
        </p>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
          {PREVIEW_ITEMS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-xl flex flex-col items-center gap-1.5 py-3 px-2"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
              }}
            >
              <Icon style={{ color: c.icon, width: 18, height: 18 }} />
              <span
                className="font-display font-bold text-center leading-tight"
                style={{ color: c.text, fontSize: "9px" }}
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
  onContinue?: () => void;
}

const ThemePickerModal = ({ open, onClose, onContinue }: Props) => {
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
    setTimeout(() => {
      if (onContinue) {
        onContinue();
      } else {
        navigate("/menu");
      }
    }, 350);
  };

  const handleSkip = () => {
    playPopSound();
    navigate("/menu");
  };

  const activeDef = THEMES.find((t) => t.id === selected)!;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="theme-picker-fullscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[80] flex flex-col"
        >
          {/* ── Full-screen preview (fills all space above the panel) ── */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <FullMenuPreview theme={selected} />
              </motion.div>
            </AnimatePresence>

            {/* Preview label */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15">
              <span className="text-[10px] font-body text-white/60 font-semibold uppercase tracking-widest">
                Preview Menu Utama
              </span>
            </div>

            {/* Active theme badge */}
            <motion.div
              key={`badge-${selected}`}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15"
            >
              <span className="text-sm">{activeDef.emoji}</span>
              <span className="font-display text-[11px] font-bold text-white/85">
                {activeDef.name}
              </span>
            </motion.div>

            {/* Gradient fade into the panel */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>

          {/* ── Bottom control panel ────────────────────────────────── */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
            className="relative z-20 bg-gradient-to-b from-[#0e1326] to-[#0a0f1e] border-t border-white/10 shadow-2xl shadow-black/60"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>

            <div className="px-5 pt-1 pb-5">

              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <span className="text-sm">🎨</span>
                  </div>
                  <div>
                    <p className="font-display text-[13px] font-black text-white leading-tight">
                      Pilih Tema
                    </p>
                    <p className="font-body text-[10px] text-white/40">
                      Ketuk untuk preview langsung
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="w-7 h-7 rounded-full bg-white/8 hover:bg-white/18 transition flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-white/50" />
                </button>
              </div>

              {/* Theme selector strip */}
              <div className="grid grid-cols-6 gap-2 mb-3">
                {THEMES.map((t) => {
                  const isActive = selected === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelect(t.id)}
                      title={t.name}
                      className={`relative rounded-xl flex flex-col items-center gap-1 py-2 px-1 border-2 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? `border-transparent ring-2 ${t.ring}`
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/25 ring-0"
                      }`}
                    >
                      <div
                        className="w-full h-7 rounded-lg border border-black/10"
                        style={{ background: t.swatch }}
                      />
                      <span className="text-[13px] leading-none">{t.emoji}</span>

                      {isActive && (
                        <motion.div
                          layoutId="active-theme-dot"
                          className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${t.dot}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* CTA button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                disabled={confirming}
                className="w-full py-3.5 rounded-2xl font-display font-black text-[15px] text-white tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer disabled:opacity-70"
              >
                {confirming ? "⏳ Memuat..." : `🚀 Mulai dengan ${activeDef.name}!`}
              </motion.button>

              {/* Info note */}
              <div className="flex items-center gap-2 mt-2.5">
                <Settings className="w-3 h-3 text-white/30 flex-shrink-0" />
                <p className="font-body text-[10px] text-white/35 leading-snug">
                  Bisa ganti tema kapan saja di{" "}
                  <span className="text-white/55 font-semibold">Pengaturan → Tema Tampilan</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemePickerModal;
