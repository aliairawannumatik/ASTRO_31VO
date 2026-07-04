import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, Layers, TrendingUp, Replace, Minus, Shuffle, FileText, Rocket } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const subtopicBase = [
  { route: "/latihan-mandiri/kelas-8/spldv/definisi",             icon: Layers,     color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", count: "8" },
  { route: "/latihan-mandiri/kelas-8/spldv/metode-grafik",        icon: TrendingUp, color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)",  count: "11" },
  { route: "/latihan-mandiri/kelas-8/spldv/metode-substitusi",    icon: Replace,    color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.3)",  count: "8" },
  { route: "/latihan-mandiri/kelas-8/spldv/metode-eliminasi",     icon: Minus,      color: "#fb923c", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.3)",  count: "8" },
  { route: "/latihan-mandiri/kelas-8/spldv/metode-campuran",      icon: Shuffle,    color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.3)", count: "8" },
  { route: "/latihan-mandiri/kelas-8/spldv/model-spldv",          icon: FileText,   color: "#facc15", bg: "rgba(250,204,21,0.10)",  border: "rgba(250,204,21,0.3)",  count: "10" },
  { route: "/latihan-mandiri/kelas-8/spldv/penyelesaian-masalah", icon: Rocket,     color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", count: "8" },
];

const hubUi = {
  id: {
    title: "SISTEM PERSAMAAN LINEAR DUA VARIABEL",
    soal: "Soal",
    labels: [
      "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV",
      "PENYELESAIAN SPLDV DENGAN METODE GRAFIK",
      "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI",
      "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI",
      "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN",
      "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV",
      "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV",
    ],
  },
  en: {
    title: "SYSTEM OF LINEAR EQUATIONS IN TWO VARIABLES",
    soal: "Problems",
    labels: [
      "DEFINITION & STANDARD FORM OF SLETV — RELATION TO LINEAR EQUATIONS",
      "SOLVING SLETV — GRAPHICAL METHOD",
      "SOLVING SLETV — SUBSTITUTION METHOD",
      "SOLVING SLETV — ELIMINATION METHOD",
      "SOLVING SLETV — MIXED METHOD",
      "BUILDING MODELS FROM SLETV WORD PROBLEMS",
      "SOLVING REAL-WORLD PROBLEMS WITH SLETV",
    ],
  },
  ja: {
    title: "二元一次連立方程式",
    soal: "問題",
    labels: [
      "連立方程式の定義と標準形",
      "グラフ法による解法",
      "代入法による解法",
      "加減法による解法",
      "混合法による解法",
      "連立方程式の立式",
      "連立方程式の応用問題",
    ],
  },
};

const SPLDVPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const hu = hubUi[language as keyof typeof hubUi] ?? hubUi.id;
  const subtopics = subtopicBase.map((s, i) => ({
    ...s,
    label: hu.labels[i],
    badge: `${s.count} ${hu.soal}`,
  }));

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "rgba(167,139,250,0.15)", border: "1.5px solid rgba(167,139,250,0.35)" }}>
            <BookOpen className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: "#a78bfa", textShadow: "0 0 24px #a78bfa88" }}>
            {hu.title}
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · {t('practice.breadcrumb')} · 7 {t('practice.suffixSubTopik')} · 61 Soal UN/ANBK/TKA</p>
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.route}
                onClick={() => { playPopSound(); navigate(s.route); }}
                className="group flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-300 cursor-pointer border"
                style={{
                  background: s.bg,
                  borderColor: s.border,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: s.color + "25", border: `1.5px solid ${s.border}` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white/90 leading-snug">{s.label}</p>
                  <span className="text-[11px] font-bold mt-0.5 inline-block" style={{ color: s.color }}>{s.badge}</span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: s.color }} />
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body"
          >
            {t('practice.backToGrade8')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SPLDVPage;
