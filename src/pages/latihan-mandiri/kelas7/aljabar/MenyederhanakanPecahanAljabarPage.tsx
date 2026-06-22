import { useNavigate } from "react-router-dom";
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

const Frac = ({ math }: { math: string }) => (
  <span className="inline-flex items-center justify-center min-h-[2.5rem]">
    <InlineMath math={math} />
  </span>
);

/* ── Soal 1 ── Monomial & GCF (1–6) ──────────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakan pecahan-pecahan aljabar berikut!
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-1">
      {[
        { l: "1",  expr: "\\dfrac{c^3}{pc^2}" },
        { l: "2",  expr: "\\dfrac{xy + xz}{x}" },
        { l: "3",  expr: "\\dfrac{8m^2 - 4mn}{4m}" },
        { l: "4",  expr: "\\dfrac{18a^3 - 12a}{6a}" },
        { l: "5",  expr: "\\dfrac{-6p}{9p^2 + 3pq}" },
        { l: "6",  expr: "\\dfrac{3xy}{6x^2y - 9xy^2}" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex flex-col items-center gap-1.5 bg-orange-500/5 border border-orange-500/10 rounded-xl px-3 py-3">
          <SubLabel letter={l} color="bg-orange-500/30 text-orange-300 border border-orange-400/40" />
          <Frac math={expr} />
          <span className="text-white/20 text-xs font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Binomial & Selisih Kuadrat (7–12) ─────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakan pecahan berikut dengan memfaktorkan terlebih dahulu!
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-1">
      {[
        { l: "7",  expr: "\\dfrac{6p - 6q}{p^2 - pq}" },
        { l: "8",  expr: "\\dfrac{m^2 + mn}{mp + np}" },
        { l: "9",  expr: "\\dfrac{x - y}{x^2 - y^2}" },
        { l: "10", expr: "\\dfrac{9x^2 - 4}{3x + 2}" },
        { l: "11", expr: "\\dfrac{x + 5}{x^2 + 7x + 10}" },
        { l: "12", expr: "\\dfrac{x^2 + x - 30}{x - 5}" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex flex-col items-center gap-1.5 bg-amber-500/5 border border-amber-500/10 rounded-xl px-3 py-3">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <Frac math={expr} />
          <span className="text-white/20 text-xs font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Dua Variabel Bagian 1 (13–16) ─────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakanlah pecahan-pecahan aljabar berikut!
    </p>
    <div className="grid grid-cols-2 gap-3 pl-1">
      {[
        { l: "13", expr: "\\dfrac{m^2 - 9n^2}{m - 3n}" },
        { l: "14", expr: "\\dfrac{a^2 - ab}{a^2 - b^2}" },
        { l: "15", expr: "\\dfrac{x^2 + 2xy}{x^2 + 3xy + 2y^2}" },
        { l: "16", expr: "\\dfrac{x^2 - 7xy + 12y^2}{x^2 - 9y^2}" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex flex-col items-center gap-1.5 bg-violet-500/5 border border-violet-500/10 rounded-xl px-3 py-3">
          <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
          <Frac math={expr} />
          <span className="text-white/20 text-xs font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Dua Variabel Bagian 2 (17–20) ─────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Lanjutkan penyederhanaan pecahan dua variabel berikut!
    </p>
    <div className="grid grid-cols-2 gap-3 pl-1">
      {[
        { l: "17", expr: "\\dfrac{x^2 - 4y^2}{x^2 + 3xy - 10y^2}" },
        { l: "18", expr: "\\dfrac{3x^2 + 5xy - 2y^2}{x^2 - 4y^2}" },
        { l: "19", expr: "\\dfrac{2x^2 + 3xy - 2y^2}{4x^2 - y^2}" },
        { l: "20", expr: "\\dfrac{4x^2 - 9y^2}{2x^2 - xy - 6y^2}" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex flex-col items-center gap-1.5 bg-rose-500/5 border border-rose-500/10 rounded-xl px-3 py-3">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <Frac math={expr} />
          <span className="text-white/20 text-xs font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Monomial & GCF  (1–6)", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/50 to-amber-900/30", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Binomial & Kuadrat  (7–12)", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/40 to-yellow-900/25", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Dua Variabel  (13–16)", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/40 to-purple-900/25", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Dua Variabel  (17–20)", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalEmpat />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const MenyederhanakanPecahanAljabarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">➗</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(251,146,60,0.5)' }}
          >
            MENYEDERHANAKAN PECAHAN ALJABAR
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · Tugas - Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">20 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/20 text-orange-400 font-body">✦ Kelas 7</span>
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/aljabar"); }}
            className="text-sm text-white/30 hover:text-orange-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenyederhanakanPecahanAljabarPage;
