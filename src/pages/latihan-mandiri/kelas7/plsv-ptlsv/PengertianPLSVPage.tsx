import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
const SubLabel = ({ letter, color }: { letter: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${color}`}>
    {letter}
  </span>
);

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

const M = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

/* ── Soal 1 ── Identifikasi PLSV ──────────────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Di antara kalimat-kalimat terbuka berikut, manakah yang merupakan{" "}
      <span className="text-amber-300 font-semibold">persamaan linear satu variabel (PLSV)</span>?
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "a", expr: "3n + 5 = 14" },
        { l: "b", expr: "9m - 2m = 21" },
        { l: "c", expr: "4b - 7 = 2b" },
        { l: "d", expr: "8 - 3pq = 20" },
        { l: "e", expr: "5cd + c = 11" },
        { l: "f", expr: "3 + \\dfrac{y}{4} = -5" },
        { l: "g", expr: "5n - \\dfrac{9}{n} = 18" },
        { l: "h", expr: "2x^2 + 3 = 11" },
        { l: "i", expr: "6n(n - 3) = 7" },
        { l: "j", expr: "5m - 4 = 3 + 2m" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-amber-500/30 text-amber-300 border border-amber-400/40" />
          <M math={expr} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Persamaan atau Kesamaan? ───────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Di antara kalimat-kalimat berikut, manakah yang merupakan{" "}
      <span className="text-yellow-300 font-semibold">persamaan</span> dan manakah yang merupakan{" "}
      <span className="text-lime-300 font-semibold">kesamaan</span>?
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "8m + 5 = 3m" },
        { l: "b", expr: "6n - 2n = 4n" },
        { l: "c", expr: "5(y - 3) = 5y - 15" },
        { l: "d", expr: "\\dfrac{3x}{9} - \\dfrac{x}{3} = 0" },
        { l: "e", expr: "4(a + 1) = 18 - a" },
        { l: "f", expr: "n(n + 2) = 15 + n" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-yellow-500/20 text-yellow-300 border border-yellow-400/30" />
          <span className="flex-1 overflow-x-auto"><M math={expr} /></span>
          <span className="ml-auto text-white/20 text-[11px] font-body shrink-0">persamaan / kesamaan?</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Ekuivalen atau Tidak? ──────────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Nyatakan pasangan-pasangan persamaan berikut{" "}
      <span className="text-green-300 font-semibold">"ekuivalen"</span> atau{" "}
      <span className="text-rose-300 font-semibold">"tidak ekuivalen"</span>!
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        {
          l: "a",
          left: "n + 7 = 12",
          right: "n = 12 - 7",
        },
        {
          l: "b",
          left: "m - 4 = 6",
          right: "3m - 4 = 9",
        },
        {
          l: "c",
          left: "x - 8 = 3",
          right: "15 + x = 26",
        },
        {
          l: "d",
          left: "y \\times 5 = 30",
          right: "6y \\div 2 = 25",
        },
        {
          l: "e",
          left: "3p - 5 = 7",
          right: "3p - 5 + 2 = 9",
        },
        {
          l: "f",
          left: "\\dfrac{2q}{3} = 8",
          right: "\\dfrac{2q}{3} \\times 2 = 16",
        },
      ].map(({ l, left, right }) => (
        <div key={l} className="flex items-center gap-2.5 bg-green-500/5 border border-green-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-green-500/20 text-green-300 border border-green-400/30" />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1">
            <M math={left} />
            <span className="text-white/40 text-xs font-body">dan</span>
            <M math={right} />
          </div>
          <span className="ml-auto text-white/20 text-[11px] font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Identifikasi PLSV", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/50 to-yellow-900/30", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Persamaan atau Kesamaan", tagColor: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
    gradient: "from-yellow-900/40 to-lime-900/25", border: "border-yellow-500/25",
    bar: "from-yellow-400 to-lime-500", numBg: "bg-yellow-500/30 text-yellow-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Ekuivalen atau Tidak", tagColor: "bg-green-500/20 text-green-300 border-green-400/40",
    gradient: "from-green-900/40 to-teal-900/25", border: "border-green-500/25",
    bar: "from-green-400 to-teal-500", numBg: "bg-green-500/30 text-green-200",
    custom: <SoalTiga />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const PengertianPLSVPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">⚖️</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(251,191,36,0.5)' }}
          >
            PENGERTIAN PLSV, KESAMAAN,
          </h1>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(251,191,36,0.5)' }}
          >
            DAN PERNYATAAN EKUIVALEN
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · PLSV & PtLSV · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">3 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 font-body">✦ Kelas 7</span>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${c.border} rounded-2xl`} />
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${c.bar} rounded-l-2xl`} />

              <div className="relative px-5 py-4 pl-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 ${c.numBg}`}>
                    {c.num}
                  </span>
                  <Tag label={c.tag} color={c.tagColor} />
                </div>
                <div className="pl-1">
                  {c.custom}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Back button ── */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-white/30 hover:text-amber-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPLSVPage;
