import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

/* ── Route map ────────────────────────────────────────── */
const routes: Record<string, string> = {
  "Bilangan Bulat": "/olimpiade/bilangan-bulat",
  "Bilangan Rasional": "/olimpiade/bilangan-rasional",
  "Bilangan Berpangkat": "/olimpiade/bilangan-berpangkat",
  "Bilangan Irasional": "/olimpiade/bilangan-irasional",
  "KPK dan FPB": "/olimpiade/kpk-fpb",
  "Modulo & Sisa Pembagian": "/olimpiade/modulo",
  "Himpunan": "/olimpiade/himpunan",
  "Relasi dan Fungsi": "/olimpiade/relasi-fungsi",
  "Perbandingan": "/olimpiade/perbandingan",
  "Aljabar": "/olimpiade/aljabar",
  "Persamaan & Pertidaksamaan LSV": "/olimpiade/plsv",
  "Persamaan Garis": "/olimpiade/persamaan-garis",
  "Persamaan Kuadrat": "/olimpiade/persamaan-kuadrat",
  "Fungsi Kuadrat": "/olimpiade/fungsi-kuadrat",
  "Aritmetika Sosial": "/olimpiade/aritmetika-sosial",
  "Pola Bilangan": "/olimpiade/pola-bilangan",
  "Sistem Persamaan Linear Dua Variabel": "/olimpiade/spldv",
  "Garis dan Sudut": "/olimpiade/garis-sudut",
  "Koordinat Cartesius": "/olimpiade/koordinat-cartesius",
  "Teorema Pythagoras": "/olimpiade/teorema-pythagoras",
  "Segitiga & Segiempat": "/olimpiade/segitiga-segiempat",
  "Lingkaran": "/olimpiade/lingkaran",
  "Bangun Ruang Sisi Datar": "/olimpiade/bangun-ruang-sisi-datar",
  "Bangun Ruang Sisi Lengkung": "/olimpiade/bangun-ruang-sisi-lengkung",
  "Kesebangunan & Kekongruenan": "/olimpiade/kesebangunan",
  "Transformasi Geometri": "/olimpiade/transformasi-geometri",
  "Statistika": "/olimpiade/statistika",
  "Peluang": "/olimpiade/peluang",
};

/* ── Category config ─────────────────────────────────── */
type Topic = { name: string; emoji: string };
type Category = {
  label: string;
  emoji: string;
  gradient: string;
  border: string;
  headerGrad: string;
  dot: string;
  badge: string;
  bar: string;
  topics: Topic[];
};

const categories: Category[] = [
  {
    label: "Teori Bilangan",
    emoji: "🔢",
    gradient: "from-blue-900 to-blue-950",
    border: "border-blue-700",
    headerGrad: "from-blue-800 to-blue-900",
    dot: "bg-blue-400",
    badge: "bg-blue-700 text-blue-200 border-blue-500",
    bar: "bg-blue-400",
    topics: [
      { name: "Bilangan Bulat", emoji: "🔵" },
      { name: "Bilangan Rasional", emoji: "⅔" },
      { name: "Bilangan Berpangkat", emoji: "²ⁿ" },
      { name: "Bilangan Irasional", emoji: "√" },
      { name: "KPK dan FPB", emoji: "÷" },
      { name: "Modulo & Sisa Pembagian", emoji: "%" },
    ],
  },
  {
    label: "Aljabar & Fungsi",
    emoji: "📐",
    gradient: "from-violet-900 to-violet-950",
    border: "border-violet-700",
    headerGrad: "from-violet-800 to-violet-900",
    dot: "bg-violet-400",
    badge: "bg-violet-700 text-violet-200 border-violet-500",
    bar: "bg-violet-400",
    topics: [
      { name: "Himpunan", emoji: "⊂" },
      { name: "Relasi dan Fungsi", emoji: "↦" },
      { name: "Perbandingan", emoji: "∶" },
      { name: "Aljabar", emoji: "𝑥" },
      { name: "Persamaan & Pertidaksamaan LSV", emoji: "=" },
      { name: "Persamaan Garis", emoji: "📈" },
      { name: "Persamaan Kuadrat", emoji: "²" },
      { name: "Fungsi Kuadrat", emoji: "∪" },
      { name: "Aritmetika Sosial", emoji: "💰" },
      { name: "Pola Bilangan", emoji: "…" },
      { name: "Sistem Persamaan Linear Dua Variabel", emoji: "xy" },
    ],
  },
  {
    label: "Geometri",
    emoji: "📏",
    gradient: "from-emerald-900 to-emerald-950",
    border: "border-emerald-700",
    headerGrad: "from-emerald-800 to-emerald-900",
    dot: "bg-emerald-400",
    badge: "bg-emerald-700 text-emerald-200 border-emerald-500",
    bar: "bg-emerald-400",
    topics: [
      { name: "Garis dan Sudut", emoji: "∠" },
      { name: "Koordinat Cartesius", emoji: "⊹" },
      { name: "Teorema Pythagoras", emoji: "△" },
      { name: "Segitiga & Segiempat", emoji: "◻" },
      { name: "Lingkaran", emoji: "○" },
      { name: "Bangun Ruang Sisi Datar", emoji: "⬡" },
      { name: "Bangun Ruang Sisi Lengkung", emoji: "⬤" },
      { name: "Kesebangunan & Kekongruenan", emoji: "≅" },
      { name: "Transformasi Geometri", emoji: "↻" },
    ],
  },
  {
    label: "Statistika & Peluang",
    emoji: "📊",
    gradient: "from-orange-900 to-orange-950",
    border: "border-orange-700",
    headerGrad: "from-orange-800 to-orange-900",
    dot: "bg-orange-400",
    badge: "bg-orange-700 text-orange-200 border-orange-500",
    bar: "bg-orange-400",
    topics: [
      { name: "Statistika", emoji: "📉" },
      { name: "Peluang", emoji: "🎲" },
    ],
  },
];

/* ── Trophy SVG ──────────────────────────────────────── */
const TrophySVG = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
    <defs>
      <linearGradient id="tg1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Cup body */}
    <path d="M16 8 h32 v18 a16 16 0 0 1-32 0 Z" fill="url(#tg1)" />
    {/* Handles */}
    <path d="M16 12 Q6 12 6 22 Q6 30 16 30" stroke="url(#tg2)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M48 12 Q58 12 58 22 Q58 30 48 30" stroke="url(#tg2)" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Stem */}
    <rect x="28" y="42" width="8" height="10" fill="url(#tg2)" rx="1" />
    {/* Base */}
    <rect x="18" y="52" width="28" height="5" fill="url(#tg1)" rx="2.5" />
    {/* Star on cup */}
    <path d="M32 16 l1.8 5.5 h5.8 l-4.7 3.4 1.8 5.5 L32 27l-4.7 3.4 1.8-5.5-4.7-3.4h5.8Z"
      fill="#fff" fillOpacity="0.55" />
  </svg>
);

/* ── Star chip decoration ─────────────────────────────── */
const StarChip = ({ color }: { color: string }) => (
  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border font-body ${color}`}>
    ✦ MATERI & SOAL
  </span>
);

/* ── Page ─────────────────────────────────────────────── */
const OlimpiadePage = () => {
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleClick = (name: string) => {
    const path = routes[name];
    if (path) { playPopSound(); navigate(path); }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/menu" />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Hero header ── */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-yellow-400/10 border border-amber-400/30 flex items-center justify-center mb-5 shadow-[0_0_32px_rgba(251,191,36,0.2)]">
            <TrophySVG />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-2"
            style={{ textShadow: '0 0 40px rgba(251,191,36,0.5)' }}>
            OLIMPIADE MATEMATIKA
          </h1>
          <p className="text-white/50 text-sm text-center font-body mb-4">
            Latihan soal & materi tingkat olimpiade SMP
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { v: "28", l: "Topik", color: "bg-amber-500/15 border-amber-400/30 text-amber-300" },
              { v: "4", l: "Kategori", color: "bg-blue-500/15 border-blue-400/30 text-blue-300" },
              { v: "OSN", l: "2003–2025", color: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300" },
            ].map(({ v, l, color }) => (
              <div key={l} className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border font-body ${color}`}>
                <span className="text-sm">{v}</span>
                <span className="opacity-70 font-normal">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Category sections ── */}
        <div className="flex flex-col gap-5 animate-slide-up">
          {categories.map((cat, ci) => (
            <div key={cat.label}
              className={`relative rounded-2xl overflow-hidden border ${cat.border}`}
              style={{ animationDelay: `${ci * 0.06}s` }}>
              {/* bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />

              {/* Category header */}
              <div className={`relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r ${cat.headerGrad} border-b ${cat.border}`}>
                <span className="text-xl leading-none">{cat.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-sm font-bold text-white">{cat.label}</p>
                  <p className="font-body text-[10px] text-white/40">{cat.topics.length} topik</p>
                </div>
                <StarChip color={cat.badge} />
              </div>

              {/* Topic grid */}
              <div className="relative px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.topics.map((topic, ti) => {
                  const hasRoute = !!routes[topic.name];
                  return (
                    <button
                      key={topic.name}
                      onClick={() => handleClick(topic.name)}
                      disabled={!hasRoute}
                      className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all duration-200
                        ${hasRoute
                          ? "bg-black/30 hover:bg-black/45 border border-white/15 hover:border-white/30 cursor-pointer"
                          : "bg-black/20 border border-white/8 cursor-not-allowed opacity-40"}`}
                      style={{ animationDelay: `${(ci * 0.06) + (ti * 0.025)}s` }}
                    >
                      {/* Colored left indicator */}
                      <div className={`w-1 h-8 rounded-full shrink-0 ${cat.bar} opacity-70 group-hover:opacity-100 transition-opacity`} />

                      {/* Emoji badge */}
                      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center shrink-0 text-sm
                        group-hover:scale-105 transition-transform">
                        {topic.emoji}
                      </div>

                      {/* Name */}
                      <span className="font-body text-xs text-white/80 group-hover:text-white leading-snug flex-1 transition-colors">
                        {topic.name}
                      </span>

                      {/* Arrow */}
                      {hasRoute && (
                        <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 shrink-0 transition-colors group-hover:translate-x-0.5 duration-200"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-full bg-amber-500/8 border border-amber-400/20 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-lg shrink-0">🏅</span>
            <p className="font-body text-xs text-white/55 leading-relaxed">
              Setiap topik memuat <span className="text-amber-300 font-semibold">materi ringkas</span>,{" "}
              <span className="text-amber-300 font-semibold">latihan dasar</span>, dan{" "}
              <span className="text-amber-300 font-semibold">soal OSN 2003–2025</span> dari tingkat kota hingga nasional.
            </p>
          </div>
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-white/30 hover:text-amber-400 transition-colors cursor-pointer font-body mt-1"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadePage;
