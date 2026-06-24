import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Settings } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { playPopSound } from "@/hooks/useAudio";

type LangDef = {
  id: Language;
  flag: string;
  native: string;
  label: string;
  sub: string;
  gradient: string;
  ring: string;
  glow: string;
};

const LANGUAGES: LangDef[] = [
  {
    id: "id",
    flag: "🇮🇩",
    native: "Bahasa Indonesia",
    label: "Indonesia",
    sub: "Bahasa resmi aplikasi",
    gradient: "linear-gradient(135deg,#dc2626,#ffffff,#dc2626)",
    ring: "ring-red-400 shadow-[0_0_16px_rgba(220,38,38,0.55)]",
    glow: "rgba(220,38,38,0.35)",
  },
  {
    id: "en",
    flag: "🇬🇧",
    native: "English",
    label: "English",
    sub: "International language",
    gradient: "linear-gradient(135deg,#1d4ed8,#ffffff,#dc2626)",
    ring: "ring-blue-400 shadow-[0_0_16px_rgba(29,78,216,0.55)]",
    glow: "rgba(29,78,216,0.35)",
  },
  {
    id: "ja",
    flag: "🇯🇵",
    native: "日本語",
    label: "Japanese",
    sub: "にほんご",
    gradient: "linear-gradient(135deg,#dc2626,#ffffff,#dc2626)",
    ring: "ring-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.55)]",
    glow: "rgba(244,63,94,0.35)",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const LanguagePickerModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);
  const [confirming, setConfirming] = useState(false);

  const handleSelect = (id: Language) => {
    playPopSound();
    setSelected(id);
    setLanguage(id);
  };

  const handleContinue = () => {
    playPopSound();
    setConfirming(true);
    setLanguage(selected);
    setTimeout(() => navigate("/menu"), 350);
  };

  const activeDef = LANGUAGES.find((l) => l.id === selected)!;

  const floatingWords = [
    { text: "Halo!", lang: "id", x: "10%", y: "15%", delay: 0 },
    { text: "Hello!", lang: "en", x: "65%", y: "10%", delay: 0.4 },
    { text: "こんにちは！", lang: "ja", x: "45%", y: "38%", delay: 0.8 },
    { text: "Selamat belajar", lang: "id", x: "5%", y: "55%", delay: 1.2 },
    { text: "Let's learn!", lang: "en", x: "58%", y: "62%", delay: 0.6 },
    { text: "がんばって！", lang: "ja", x: "15%", y: "74%", delay: 1.0 },
    { text: "Matematika", lang: "id", x: "62%", y: "80%", delay: 0.2 },
    { text: "Mathematics", lang: "en", x: "2%", y: "85%", delay: 1.4 },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lang-picker-fullscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[90] flex flex-col"
        >
          {/* ── Top decorative area ── */}
          <div
            className="relative flex-1 min-h-0 overflow-hidden"
            style={{ background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0e2240 100%)" }}
          >
            {/* Star pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: 0.3,
              }}
            />

            {/* Floating translated words */}
            {floatingWords.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 0.55, 0.35, 0.55], y: [8, 0, -4, 0] }}
                transition={{ delay: w.delay, duration: 3.5, repeat: Infinity, repeatType: "loop" }}
                className="absolute font-display font-bold text-white/40 text-xs select-none pointer-events-none"
                style={{ left: w.x, top: w.y }}
              >
                {w.text}
              </motion.div>
            ))}

            {/* Center globe */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-6xl select-none"
              >
                🌏
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display font-black text-white/80 text-lg tracking-widest"
              >
                PILIH BAHASA
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="font-body text-white/40 text-xs"
              >
                Select your language · 言語を選んでください
              </motion.p>
            </div>

            {/* Preview label */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15">
              <Globe className="w-3 h-3 text-white/50" />
              <span className="text-[10px] font-body text-white/60 font-semibold uppercase tracking-widest">
                Language / Bahasa / 言語
              </span>
            </div>

            {/* Active language badge */}
            <motion.div
              key={`badge-${selected}`}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15"
            >
              <span className="text-sm">{activeDef.flag}</span>
              <span className="font-display text-[11px] font-bold text-white/85">
                {activeDef.native}
              </span>
            </motion.div>

            {/* Gradient fade into panel */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>

          {/* ── Bottom control panel ── */}
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
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-sm">🌐</span>
                </div>
                <div>
                  <p className="font-display text-[13px] font-black text-white leading-tight">
                    Pilih Bahasa
                  </p>
                  <p className="font-body text-[10px] text-white/40">
                    Pilih bahasa yang ingin kamu gunakan
                  </p>
                </div>
              </div>

              {/* Language cards */}
              <div className="flex flex-col gap-2 mb-4">
                {LANGUAGES.map((lang) => {
                  const isActive = selected === lang.id;
                  return (
                    <motion.button
                      key={lang.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(lang.id)}
                      className={`relative flex items-center gap-4 rounded-2xl px-4 py-3 border-2 transition-all duration-200 cursor-pointer text-left ${
                        isActive
                          ? `border-transparent ring-2 ${lang.ring} bg-white/10`
                          : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
                      }`}
                    >
                      <span className="text-3xl leading-none">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-black text-white text-sm leading-tight">
                          {lang.native}
                        </p>
                        <p className="font-body text-white/45 text-[11px] mt-0.5 truncate">
                          {lang.sub}
                        </p>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="active-lang-check"
                          className="w-5 h-5 rounded-full bg-cyan-400/80 flex items-center justify-center shrink-0"
                        >
                          <span className="text-[10px] font-black text-slate-900">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
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
                {confirming ? "⏳ Memuat..." : `${activeDef.flag} Lanjut ke Menu Utama`}
              </motion.button>

              {/* Info note */}
              <div className="flex items-center gap-2 mt-2.5">
                <Settings className="w-3 h-3 text-white/30 flex-shrink-0" />
                <p className="font-body text-[10px] text-white/35 leading-snug">
                  Bisa ganti bahasa kapan saja di{" "}
                  <span className="text-white/55 font-semibold">Pengaturan → Bahasa</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguagePickerModal;
