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

const AlgExpr = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

/* ── Soal 1 ── Monomial Berpangkat ──────────────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil pemangkatan suku-suku berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "1", expr: "(-5b^3)^2" },
        { l: "2", expr: "(3x^2y^3)^4" },
        { l: "3", expr: "(-2p^4q^3r)^3" },
        { l: "4", expr: "(4a^2b^3c)^2" },
        { l: "5", expr: "(-6m^5n^2)^3" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Sifat-Sifat Pangkat ──────────────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakanlah menggunakan sifat-sifat pangkat!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "6",  expr: "(a^3)^2 \\times a^4" },
        { l: "7",  expr: "(2x^2)^3 \\div (4x^3)" },
        { l: "8",  expr: "[(3p^2)^2]^3" },
        { l: "9",  expr: "(5m^3)^2 \\times (-2m)^3" },
        { l: "10", expr: "\\dfrac{(6y^4)^2}{(3y^3)^2}" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Segitiga Pascal untuk (a+b)^n ────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Perhatikan pola koefisien Segitiga Pascal, lalu gunakan untuk menjabarkan bentuk berikut!
    </p>
    {/* Pascal's triangle visual */}
    <div className="pl-1">
      <svg width="260" height="88" viewBox="0 0 260 88">
        {[
          { row: ["1"],            y: 10 },
          { row: ["1","1"],        y: 28 },
          { row: ["1","2","1"],    y: 46 },
          { row: ["1","3","3","1"],y: 64 },
          { row: ["1","4","6","4","1"], y: 82 },
        ].map(({ row, y }, ri) => {
          const total = row.length;
          return row.map((val, ci) => {
            const x = 130 + (ci - (total - 1) / 2) * 36;
            return (
              <text key={`${ri}-${ci}`} x={x} y={y} textAnchor="middle"
                fill={ri === 4 ? "#93c5fd" : ri === 3 ? "#a5b4fc" : "#c4b5fd"}
                fontSize={ri === 4 ? 11 : 10} fontFamily="monospace" fontWeight={ri > 1 ? "600" : "400"}>
                {val}
              </text>
            );
          });
        })}
      </svg>
    </div>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "(x + 3)^2" },
        { l: "b", expr: "(2a - 1)^3" },
        { l: "c", expr: "(x + y)^4" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Kuadrat Binomial Satu Variabel ───────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Jabarkanlah bentuk kuadrat binomial berikut!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "11", expr: "(x + 8)^2" },
        { l: "12", expr: "(2y - 5)^2" },
        { l: "13", expr: "(-4n + 3)^2" },
        { l: "14", expr: "(6k - 1)^2" },
        { l: "15", expr: "(3a + 2b)^2" },
        { l: "16", expr: "(-5p + 4q)^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ── Kuadrat Binomial Suku Berpangkat ─────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Jabarkanlah bentuk-bentuk berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "17", expr: "(n^2 + 6)^2" },
        { l: "18", expr: "(3x^2 - 4y)^2" },
        { l: "19", expr: "(5a^2 + 2b)^2" },
        { l: "20", expr: "(4p^2 - 3p)^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 6 ── Kuadrat Binomial dengan Pecahan ──────────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Jabarkanlah bentuk kuadrat binomial berikut yang memuat pecahan!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "21", expr: "\\left(4n - \\dfrac{1}{4}\\right)^2" },
        { l: "22", expr: "\\left(3x + \\dfrac{1}{x}\\right)^2" },
        { l: "23", expr: "\\left(2p - \\dfrac{1}{2p}\\right)^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <span className="flex-1 overflow-x-auto"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 7 ── Luas persegi dengan sisi aljabar ─────────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan luas persegi berikut dalam bentuk aljabar yang sudah disederhanakan!
    </p>
    <div className="pl-1">
      <svg width="170" height="120" viewBox="0 0 170 120">
        <rect x={10} y={10} width={130} height={100} rx={6}
          fill="#f59e0b" fillOpacity={0.07} stroke="#f59e0b" strokeWidth={1.5} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i}
            x1={10 + i * 18} y1={10} x2={10 + i * 18 - 14} y2={110}
            stroke="#f59e0b" strokeWidth={0.5} strokeOpacity={0.2} />
        ))}
        <text x={75} y={60} textAnchor="middle" fill="#fcd34d" fontSize={10} fontFamily="monospace">
          s = (3x + 2) cm
        </text>
        <text x={75} y={115} textAnchor="middle" fill="#fbbf24" fontSize={9} fontFamily="monospace">
          Persegi
        </text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Tuliskan luas persegi tersebut sebagai kuadrat binomial!" },
        { l: "b", text: "Jabarkan dan sederhanakan bentuk kuadratnya!" },
        { l: "c", text: "Jika x = 5, hitunglah luas persegi dalam satuan cm²!" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 8 ── Soal cerita & sederhanakan ───────────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sebuah akuarium berbentuk kubus memiliki panjang rusuk{" "}
      <InlineMath math="(2k + 3)" /> cm.
    </p>
    <div className="pl-1 flex gap-4 items-center flex-wrap">
      <svg width="110" height="100" viewBox="0 0 110 100">
        {/* Cube wireframe */}
        <polygon points="15,75 65,75 65,25 15,25" fill="#22d3ee" fillOpacity={0.06} stroke="#22d3ee" strokeWidth={1.4} />
        <polygon points="65,25 95,10 95,60 65,75" fill="#22d3ee" fillOpacity={0.04} stroke="#22d3ee" strokeWidth={1.4} />
        <polygon points="15,25 65,25 95,10 45,10" fill="#22d3ee" fillOpacity={0.08} stroke="#22d3ee" strokeWidth={1.4} />
        <line x1={15} y1={75} x2={45} y2={60} stroke="#22d3ee" strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3,2" />
        <line x1={45} y1={60} x2={95} y2={60} stroke="#22d3ee" strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3,2" />
        <line x1={45} y1={60} x2={45} y2={10} stroke="#22d3ee" strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3,2" />
        <text x={55} y={54} textAnchor="middle" fill="#67e8f9" fontSize={8} fontFamily="monospace">(2k+3) cm</text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Nyatakan volume akuarium tersebut dalam bentuk aljabar (petunjuk: gunakan (a+b)³)!" },
        { l: "b", text: "Nyatakan luas permukaan akuarium dalam bentuk aljabar yang disederhanakan!" },
        { l: "c", text: "Jika k = 4, hitunglah volume dan luas permukaan akuarium dalam cm³ dan cm²!" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Monomial Berpangkat", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Sifat Pangkat", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Segitiga Pascal", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Kuadrat Binomial", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Suku Berpangkat", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Binomial Pecahan", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Luas Bangun", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalTujuh />,
  },
  {
    num: 8, tag: "Kontekstual", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    gradient: "from-teal-900/40 to-cyan-900/25", border: "border-teal-500/25",
    bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
    custom: <SoalDelapan />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const PemangkatanAljabarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">⚡</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(96,165,250,0.5)' }}
          >
            PEMANGKATAN BENTUK ALJABAR
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · Tugas - Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">8 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 font-body">✦ Kelas 7</span>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
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
            className="text-sm text-white/30 hover:text-blue-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PemangkatanAljabarPage;
