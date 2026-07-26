import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
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

type ThemeStyles = {
  topBg: string;
  topTextTitle: string;
  topTextSub: string;
  topBadgeBg: string;
  topBadgeText: string;
  topBadgeBorder: string;
  floatingWordColor: string;
  starOpacity: number;
  panelBg: string;
  panelBorder: string;
  dragHandle: string;
  headerTitle: string;
  headerSub: string;
  cardInactive: string;
  cardText: string;
  cardSubText: string;
  checkBg: string;
  checkText: string;
  infoText: string;
  infoIcon: string;
  infoHighlight: string;
};

function getThemeStyles(theme: string): ThemeStyles {
  switch (theme) {
    case "ocean":
      return {
        topBg: "linear-gradient(160deg,#0c2a4a 0%,#0d3d62 50%,#0a2540 100%)",
        topTextTitle: "text-sky-100/90",
        topTextSub: "text-sky-200/50",
        topBadgeBg: "bg-sky-900/50 backdrop-blur-sm",
        topBadgeText: "text-sky-100/85",
        topBadgeBorder: "border-sky-400/30",
        floatingWordColor: "text-sky-200/40",
        starOpacity: 0.25,
        panelBg: "bg-gradient-to-b from-[#0d3a5c] to-[#0a2540]",
        panelBorder: "border-sky-400/20",
        dragHandle: "bg-sky-300/25",
        headerTitle: "text-sky-50",
        headerSub: "text-sky-200/50",
        cardInactive: "border-sky-400/20 bg-sky-300/8 hover:bg-sky-300/12 hover:border-sky-400/35",
        cardText: "text-sky-50",
        cardSubText: "text-sky-200/55",
        checkBg: "bg-sky-400/80",
        checkText: "text-slate-900",
        infoText: "text-sky-300/40",
        infoIcon: "text-sky-300/35",
        infoHighlight: "text-sky-200/60",
      };

    case "light":
    case "white":
      return {
        topBg: "linear-gradient(160deg,#c7d2fe 0%,#e0e7ff 50%,#bfdbfe 100%)",
        topTextTitle: "text-indigo-900/85",
        topTextSub: "text-indigo-700/55",
        topBadgeBg: "bg-white/60 backdrop-blur-sm",
        topBadgeText: "text-indigo-900/85",
        topBadgeBorder: "border-indigo-300/50",
        floatingWordColor: "text-indigo-700/35",
        starOpacity: 0.08,
        panelBg: "bg-gradient-to-b from-white to-indigo-50",
        panelBorder: "border-indigo-200/60",
        dragHandle: "bg-indigo-300/40",
        headerTitle: "text-indigo-900",
        headerSub: "text-indigo-600/60",
        cardInactive: "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300",
        cardText: "text-indigo-900",
        cardSubText: "text-indigo-600/65",
        checkBg: "bg-indigo-500",
        checkText: "text-white",
        infoText: "text-indigo-500/55",
        infoIcon: "text-indigo-400/50",
        infoHighlight: "text-indigo-700/75",
      };

    case "forest":
      return {
        topBg: "linear-gradient(160deg,#bbf7d0 0%,#86efac 50%,#d1fae5 100%)",
        topTextTitle: "text-green-900/85",
        topTextSub: "text-green-800/55",
        topBadgeBg: "bg-white/55 backdrop-blur-sm",
        topBadgeText: "text-green-900/85",
        topBadgeBorder: "border-green-400/45",
        floatingWordColor: "text-green-800/35",
        starOpacity: 0.06,
        panelBg: "bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7]",
        panelBorder: "border-green-300/50",
        dragHandle: "bg-green-400/35",
        headerTitle: "text-green-900",
        headerSub: "text-green-700/60",
        cardInactive: "border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300",
        cardText: "text-green-900",
        cardSubText: "text-green-700/65",
        checkBg: "bg-green-600",
        checkText: "text-white",
        infoText: "text-green-600/55",
        infoIcon: "text-green-500/50",
        infoHighlight: "text-green-800/75",
      };

    case "sunset":
      return {
        topBg: "linear-gradient(160deg,#fed7aa 0%,#fde68a 40%,#fca5a5 100%)",
        topTextTitle: "text-orange-900/85",
        topTextSub: "text-orange-800/55",
        topBadgeBg: "bg-white/55 backdrop-blur-sm",
        topBadgeText: "text-orange-900/85",
        topBadgeBorder: "border-orange-400/40",
        floatingWordColor: "text-orange-800/35",
        starOpacity: 0.05,
        panelBg: "bg-gradient-to-b from-[#fff7ed] to-[#ffedd5]",
        panelBorder: "border-orange-200/60",
        dragHandle: "bg-orange-400/35",
        headerTitle: "text-orange-900",
        headerSub: "text-orange-700/60",
        cardInactive: "border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300",
        cardText: "text-orange-900",
        cardSubText: "text-orange-700/65",
        checkBg: "bg-orange-500",
        checkText: "text-white",
        infoText: "text-orange-600/55",
        infoIcon: "text-orange-500/50",
        infoHighlight: "text-orange-800/75",
      };

    default:
      return {
        topBg: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0e2240 100%)",
        topTextTitle: "text-white/80",
        topTextSub: "text-white/40",
        topBadgeBg: "bg-black/30 backdrop-blur-sm",
        topBadgeText: "text-white/85",
        topBadgeBorder: "border-white/15",
        floatingWordColor: "text-white/40",
        starOpacity: 0.3,
        panelBg: "bg-gradient-to-b from-[#0e1326] to-[#0a0f1e]",
        panelBorder: "border-white/10",
        dragHandle: "bg-white/20",
        headerTitle: "text-white",
        headerSub: "text-white/40",
        cardInactive: "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20",
        cardText: "text-white",
        cardSubText: "text-white/45",
        checkBg: "bg-cyan-400/80",
        checkText: "text-slate-900",
        infoText: "text-white/35",
        infoIcon: "text-white/30",
        infoHighlight: "text-white/55",
      };
  }
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const LanguagePickerModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Language>(language);
  const [confirming, setConfirming] = useState(false);

  const s = getThemeStyles(theme);

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
            style={{ background: s.topBg }}
          >
            {/* Star/dot pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(100,100,200,0.3) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: s.starOpacity,
              }}
            />

            {/* Floating translated words */}
            {floatingWords.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 0.55, 0.35, 0.55], y: [8, 0, -4, 0] }}
                transition={{ delay: w.delay, duration: 3.5, repeat: Infinity, repeatType: "loop" }}
                className={`absolute font-display font-bold text-xs select-none pointer-events-none ${s.floatingWordColor}`}
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
                className={`font-display font-black text-lg tracking-widest ${s.topTextTitle}`}
              >
                {t("selectLanguage").toUpperCase()}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className={`font-body text-xs ${s.topTextSub}`}
              >
                Select your language · 言語を選んでください
              </motion.p>
            </div>

            {/* Preview label */}
            <div className={`absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full border ${s.topBadgeBg} ${s.topBadgeBorder}`}>
              <Globe className={`w-3 h-3 ${s.topBadgeText} opacity-60`} />
              <span className={`text-[10px] font-body font-semibold uppercase tracking-widest ${s.topBadgeText}`}>
                Language / Bahasa / 言語
              </span>
            </div>

            {/* Active language badge */}
            <motion.div
              key={`badge-${selected}`}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full border ${s.topBadgeBg} ${s.topBadgeBorder}`}
            >
              <span className="text-sm">{activeDef.flag}</span>
              <span className={`font-display text-[11px] font-bold ${s.topBadgeText}`}>
                {activeDef.native}
              </span>
            </motion.div>

            {/* Gradient fade into panel */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* ── Bottom control panel ── */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
            className={`relative z-20 border-t shadow-2xl ${s.panelBg} ${s.panelBorder}`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className={`w-9 h-1 rounded-full ${s.dragHandle}`} />
            </div>

            <div className="px-5 pt-1 pb-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-sm">🌐</span>
                </div>
                <div>
                  <p className={`font-display text-[13px] font-black leading-tight ${s.headerTitle}`}>
                    {t("selectLanguage")}
                  </p>
                  <p className={`font-body text-[10px] ${s.headerSub}`}>
                    {t("languageSubtitle")}
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
                          : s.cardInactive
                      }`}
                    >
                      <span className="text-3xl leading-none">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-display font-black text-sm leading-tight ${s.cardText}`}>
                          {lang.native}
                        </p>
                        <p className={`font-body text-[11px] mt-0.5 truncate ${s.cardSubText}`}>
                          {lang.sub}
                        </p>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="active-lang-check"
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${s.checkBg}`}
                        >
                          <span className={`text-[10px] font-black ${s.checkText}`}>✓</span>
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
                {confirming ? t("loading") : `${activeDef.flag} ${t("languageContinueText")}`}
              </motion.button>

              {/* Info note */}
              <div className="flex items-center gap-2 mt-2.5">
                <Settings className={`w-3 h-3 flex-shrink-0 ${s.infoIcon}`} />
                <p className={`font-body text-[10px] leading-snug ${s.infoText}`}>
                  {t("changeLanguageHint")}{" "}
                  <span className={`font-semibold ${s.infoHighlight}`}>{t("settingsLanguage")}</span>
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
