import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const routes: Record<string, string> = {
  "Bilangan Bulat": "/tka/modul-pemantapan/bilangan-bulat",
  "Bilangan Rasional": "/tka/modul-pemantapan/bilangan-rasional",
  "Bilangan Berpangkat": "/tka/modul-pemantapan/bilangan-berpangkat",
  "Bilangan Irasional": "/tka/modul-pemantapan/bilangan-irasional",
  "KPK dan FPB": "/tka/modul-pemantapan/kpk-fpb",
  "Modulo & Sisa Pembagian": "/tka/modul-pemantapan/modulo",
  "Himpunan": "/tka/modul-pemantapan/himpunan",
  "Relasi dan Fungsi": "/tka/modul-pemantapan/relasi-fungsi",
  "Perbandingan": "/tka/modul-pemantapan/perbandingan",
  "Aljabar": "/tka/modul-pemantapan/aljabar",
  "Persamaan & Pertidaksamaan LSV": "/tka/modul-pemantapan/plsv",
  "Persamaan Garis": "/tka/modul-pemantapan/persamaan-garis",
  "Persamaan Kuadrat": "/tka/modul-pemantapan/persamaan-kuadrat",
  "Fungsi Kuadrat": "/tka/modul-pemantapan/fungsi-kuadrat",
  "Aritmetika Sosial": "/tka/modul-pemantapan/aritmetika-sosial",
  "Pola Bilangan": "/tka/modul-pemantapan/pola-bilangan",
  "Sistem Persamaan Linear Dua Variabel": "/tka/modul-pemantapan/spldv",
  "Garis dan Sudut": "/tka/modul-pemantapan/garis-sudut",
  "Koordinat Kartesius": "/tka/modul-pemantapan/koordinat-cartesius",
  "Teorema Pythagoras": "/tka/modul-pemantapan/teorema-pythagoras",
  "Segitiga & Segiempat": "/tka/modul-pemantapan/segitiga-segiempat",
  "Lingkaran": "/tka/modul-pemantapan/lingkaran",
  "Bangun Ruang Sisi Datar": "/tka/modul-pemantapan/bangun-ruang-sisi-datar",
  "Bangun Ruang Sisi Lengkung": "/tka/modul-pemantapan/bangun-ruang-sisi-lengkung",
  "Kesebangunan & Kekongruenan": "/tka/modul-pemantapan/kesebangunan",
  "Transformasi Geometri": "/tka/modul-pemantapan/transformasi-geometri",
  "Statistika": "/tka/modul-pemantapan/statistika",
  "Peluang": "/tka/modul-pemantapan/peluang",
};

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
      { name: "Koordinat Kartesius", emoji: "⊹" },
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

const BookSVG = () => (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
    <defs>
      <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="36" height="48" rx="3" fill="url(#bg1)" opacity="0.9" />
    <rect x="16" y="8" width="36" height="48" rx="3" fill="url(#bg1)" opacity="0.6" />
    <rect x="12" y="18" width="24" height="2" rx="1" fill="white" opacity="0.7" />
    <rect x="12" y="24" width="20" height="2" rx="1" fill="white" opacity="0.5" />
    <rect x="12" y="30" width="22" height="2" rx="1" fill="white" opacity="0.5" />
    <rect x="12" y="36" width="18" height="2" rx="1" fill="white" opacity="0.4" />
  </svg>
);

const StarChip = ({ color }: { color: string }) => (
  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border font-body ${color}`}>
    ✦ MATERI & LATIHAN
  </span>
);

const TKAModulPemantapanPage = () => {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleClick = (name: string) => {
    const path = routes[name];
    if (path) { playPopSound(); navigate(path); }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/tka" />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-400/10 border border-cyan-400/30 flex items-center justify-center mb-5 shadow-[0_0_32px_rgba(34,211,238,0.2)]">
            <BookSVG />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-1"
            style={{ textShadow: '0 0 40px rgba(34,211,238,0.5)' }}>
            MODUL PEMANTAPAN TKA
          </h1>
          <h2 className="font-display text-sm md:text-base font-semibold text-center mb-2"
            style={{ color: '#22d3ee', textShadow: '0 0 20px rgba(34,211,238,0.4)' }}>
            Oleh : Irawan Sutiawan, M.Pd
          </h2>
          <p className="text-white/50 text-sm text-center font-body mb-4">
            Materi & latihan dasar untuk persiapan TKA Matematika SMP
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { v: "28", l: "Topik", color: "bg-cyan-500/15 border-cyan-400/30 text-cyan-300" },
              { v: "4", l: "Kategori", color: "bg-blue-500/15 border-blue-400/30 text-blue-300" },
              { v: "TKA", l: "Siap Ujian", color: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300" },
            ].map(({ v, l, color }) => (
              <div key={l} className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border font-body ${color}`}>
                <span className="text-sm">{v}</span>
                <span className="opacity-70 font-normal">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">
          {categories.map((cat, ci) => (
            <div key={cat.label}
              className={`relative rounded-2xl overflow-hidden border ${cat.border}`}
              style={{ animationDelay: `${ci * 0.06}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />

              <div className={`relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r ${cat.headerGrad} border-b ${cat.border}`}>
                <span className="text-xl leading-none">{cat.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-sm font-bold text-white">{cat.label}</p>
                  <p className="font-body text-[10px] text-white/40">{cat.topics.length} topik</p>
                </div>
                <StarChip color={cat.badge} />
              </div>

              <div className="relative px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cat.topics.map((topic, ti) => {
                  const hasRoute = !!routes[topic.name];
                  return (
                    <button
                      key={topic.name}
                      onClick={() => handleClick(topic.name)}
                      disabled={!hasRoute}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all duration-200 shadow-md
                        ${hasRoute
                          ? "bg-white/20 hover:bg-white/30 border border-white/40 hover:border-white/70 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                          : "bg-white/5 border border-white/10 cursor-not-allowed opacity-40"}`}
                      style={{ animationDelay: `${(ci * 0.06) + (ti * 0.025)}s` }}
                    >
                      <div className={`w-1.5 h-9 rounded-full shrink-0 ${cat.bar} opacity-80 group-hover:opacity-100 transition-opacity`} />
                      <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 text-base group-hover:scale-110 transition-transform">
                        {topic.emoji}
                      </div>
                      <span className="font-body text-sm text-white/90 group-hover:text-white leading-snug flex-1 transition-colors font-medium">
                        {topic.name}
                      </span>
                      {hasRoute && (
                        <svg className="w-4 h-4 text-white/40 group-hover:text-white/80 shrink-0 transition-all group-hover:translate-x-1 duration-200"
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

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-full bg-cyan-500/8 border border-cyan-400/20 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-lg shrink-0">📘</span>
            <p className="font-body text-xs text-white/55 leading-relaxed">
              Setiap topik memuat <span className="text-cyan-300 font-semibold">materi ringkas</span> dan{" "}
              <span className="text-cyan-300 font-semibold">latihan dasar</span> untuk memantapkan pemahaman sebelum menghadapi TKA.
            </p>
          </div>
          <button
            onClick={() => { playPopSound(); navigate("/tka"); }}
            className="text-sm text-white/30 hover:text-cyan-400 transition-colors cursor-pointer font-body mt-1"
          >
            ← Kembali ke TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAModulPemantapanPage;
