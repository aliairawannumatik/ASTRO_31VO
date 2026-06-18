import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, CheckCircle2, X } from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";

type ThemeDef = {
  id: Theme;
  emoji: string;
  name: string;
  desc: string;
  gradient: string;
  ring: string;
  dot: string;
  label: string;
};

const THEMES: ThemeDef[] = [
  {
    id: "dark",
    emoji: "🌌",
    name: "Luar Angkasa",
    desc: "Gelap & bintang ✨",
    gradient: "linear-gradient(135deg,#0f172a,#1e1b4b,#0e2240)",
    ring: "ring-violet-500 shadow-[0_0_18px_rgba(139,92,246,0.55)]",
    dot: "bg-violet-400",
    label: "Gelap",
  },
  {
    id: "white",
    emoji: "🤍",
    name: "Putih Bersih",
    desc: "Minimalis & polos 🕊️",
    gradient: "linear-gradient(135deg,#ffffff,#f8fafc,#f1f5f9)",
    ring: "ring-slate-400 shadow-[0_0_18px_rgba(148,163,184,0.5)]",
    dot: "bg-slate-400",
    label: "Putih",
  },
  {
    id: "ocean",
    emoji: "🌊",
    name: "Lautan Biru",
    desc: "Samudra dalam 🐋",
    gradient: "linear-gradient(135deg,#0c2a4a,#075985,#0369a1)",
    ring: "ring-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.5)]",
    dot: "bg-cyan-400",
    label: "Lautan",
  },
  {
    id: "light",
    emoji: "❄️",
    name: "Salju Cerah",
    desc: "Musim dingin ❄️",
    gradient: "linear-gradient(135deg,#e0f2fe,#f0f9ff,#ffffff)",
    ring: "ring-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.4)]",
    dot: "bg-blue-500",
    label: "Salju",
  },
  {
    id: "forest",
    emoji: "🌿",
    name: "Hutan Hijau",
    desc: "Alam segar 🍃",
    gradient: "linear-gradient(135deg,#bbf7d0,#dcfce7,#f0fdf4)",
    ring: "ring-green-500 shadow-[0_0_18px_rgba(34,197,94,0.45)]",
    dot: "bg-green-500",
    label: "Hutan",
  },
  {
    id: "sunset",
    emoji: "☁️",
    name: "Langit Cerah",
    desc: "Biru & awan ☁️",
    gradient: "linear-gradient(135deg,#38bdf8,#7dd3fc,#bae6fd,#e0f2fe)",
    ring: "ring-sky-400 shadow-[0_0_18px_rgba(14,165,233,0.5)]",
    dot: "bg-sky-400",
    label: "Langit",
  },
];

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
    setTimeout(() => {
      navigate("/menu");
    }, 350);
  };

  const handleSkip = () => {
    playPopSound();
    navigate("/menu");
  };

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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-[90] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0e1a40] border border-white/12 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">

              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 text-center">
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-500/30">
                  <span className="text-2xl">🎨</span>
                </div>
                <h2 className="font-display text-xl font-black text-white tracking-tight">
                  Pilih Tema Tampilan
                </h2>
                <p className="font-body text-xs text-white/50 mt-1">
                  Pilih tampilan yang paling kamu suka!
                </p>
              </div>

              {/* Theme grid */}
              <div className="px-5 pb-2">
                <div className="grid grid-cols-3 gap-2.5">
                  {THEMES.map((t) => {
                    const isActive = selected === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelect(t.id)}
                        className={`relative rounded-2xl py-3 px-2 flex flex-col items-center gap-1.5 border-2 transition-all duration-200 cursor-pointer ring-2 ring-transparent ${
                          isActive
                            ? `border-transparent ${t.ring}`
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* Gradient swatch */}
                        <div
                          className="w-full h-9 rounded-xl border border-black/10"
                          style={{ background: t.gradient }}
                        />
                        <span className="text-base leading-none">{t.emoji}</span>
                        <p className="font-display font-bold text-[10px] text-center text-white/80 leading-tight">
                          {t.label}
                        </p>

                        {/* Active dot */}
                        {isActive && (
                          <motion.div
                            layoutId="active-dot"
                            className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${t.dot} shadow-sm`}
                          />
                        )}

                        {/* Check icon overlay */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 rounded-2xl flex items-start justify-start p-1.5 pointer-events-none"
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${t.dot.replace("bg-", "text-")}`} />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected theme name */}
              <div className="px-5 py-3 text-center">
                <motion.p
                  key={selected}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-sm font-bold text-white/80"
                >
                  {THEMES.find((t) => t.id === selected)?.emoji}{" "}
                  {THEMES.find((t) => t.id === selected)?.name}
                </motion.p>
                <p className="font-body text-[11px] text-white/40 mt-0.5">
                  {THEMES.find((t) => t.id === selected)?.desc}
                </p>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                  disabled={confirming}
                  className="w-full py-3.5 rounded-2xl font-display font-black text-base text-white tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer disabled:opacity-70"
                >
                  {confirming ? "⏳ Memuat..." : "🚀 Mulai dengan tema ini!"}
                </motion.button>
              </div>

              {/* Info note */}
              <div className="mx-5 mb-5 rounded-xl bg-white/5 border border-white/8 px-4 py-2.5 flex items-start gap-2">
                <Settings className="w-3.5 h-3.5 text-white/40 flex-shrink-0 mt-0.5" />
                <p className="font-body text-[11px] text-white/40 leading-snug">
                  Ingin ganti tema nanti? Buka{" "}
                  <span className="text-white/65 font-semibold">Pengaturan → Tema Tampilan</span>{" "}
                  di menu utama.
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
