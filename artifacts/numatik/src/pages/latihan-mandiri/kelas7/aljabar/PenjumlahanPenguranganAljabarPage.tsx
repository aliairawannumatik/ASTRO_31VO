import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
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

/* ── Soal 1 ── Sederhanakan bentuk aljabar ───────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakanlah bentuk-bentuk aljabar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "8a + 14b - 5a - 9b" },
        { l: "b", expr: "6p^2 - 8p + 11 - 3p^2 + 5p - 4" },
        { l: "c", expr: "3(2x - 4y) + 5(x + 3y)" },
        { l: "d", expr: "4(3m^2 - 2m + 1) - 2(m^2 + 5m - 3)" },
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

/* ── Soal 2 ── Keliling bangun dari ekspresi aljabar ─── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan keliling setiap bangun berikut dalam bentuk aljabar!
    </p>
    <div className="flex flex-wrap gap-8 pl-1 items-end">
      {/* Segitiga sama kaki */}
      <div className="flex flex-col items-center gap-1.5">
        <SubLabel letter="a" color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
        <svg width="110" height="90" viewBox="0 0 110 90">
          <polygon points="55,8 10,82 100,82"
            fill="#818cf8" fillOpacity={0.08} stroke="#818cf8" strokeWidth={1.5} />
          <text x="55" y="5" textAnchor="middle" fill="#a5b4fc" fontSize={9} fontFamily="monospace">(3x+2) cm</text>
          <text x="10" y="92" textAnchor="start" fill="#a5b4fc" fontSize={9} fontFamily="monospace">(5x−1) cm</text>
          <text x="64" y="92" textAnchor="start" fill="#a5b4fc" fontSize={9} fontFamily="monospace">(3x+2) cm</text>
        </svg>
        <p className="text-indigo-300/60 text-[10px] font-body">segitiga sama kaki</p>
      </div>
      {/* Persegi panjang */}
      <div className="flex flex-col items-center gap-1.5">
        <SubLabel letter="b" color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
        <svg width="140" height="80" viewBox="0 0 140 80">
          <rect x={8} y={10} width={124} height={58} rx={5}
            fill="#818cf8" fillOpacity={0.08} stroke="#818cf8" strokeWidth={1.5} />
          <text x="70" y="8" textAnchor="middle" fill="#a5b4fc" fontSize={9} fontFamily="monospace">(4y+3) cm</text>
          <text x="134" y="42" textAnchor="middle" fill="#a5b4fc" fontSize={9}
            fontFamily="monospace" transform="rotate(90,134,42)">(2y−1) cm</text>
        </svg>
        <p className="text-indigo-300/60 text-[10px] font-body">persegi panjang</p>
      </div>
    </div>
  </div>
);

/* ── Soal 3 ── Jumlah dua bentuk aljabar ─────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan jumlah dari:
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", a: "7x + 3", b: "5x - 8" },
        { l: "b", a: "3a - 4b + 2c", b: "-5a + 7b - c" },
        { l: "c", a: "4p^2 - 3p + 6", b: "2p^2 + 8p - 9" },
        { l: "d", a: "2x^2 - xy + 3y^2", b: "5xy - 4y^2 + x^2" },
      ].map(({ l, a, b }) => (
        <div key={l} className="flex items-center gap-2 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2 flex-wrap">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <AlgExpr math={`(${a})`} />
          <span className="text-white/40 text-sm">dan</span>
          <AlgExpr math={`(${b})`} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Operasi P dan Q ───────────────────────── */
const SoalEmpat = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Diketahui <InlineMath math="P = 5x + 3y" /> dan <InlineMath math="Q = 2x - 4y + 1" />.
      Tentukan nilai-nilai berikut yang dinyatakan dalam <InlineMath math="x" /> dan <InlineMath math="y" />!
    </p>
    <div className="grid grid-cols-2 gap-2 pl-1">
      {[
        { l: "a", expr: "P + Q" },
        { l: "b", expr: "P - Q" },
        { l: "c", expr: "2P + Q" },
        { l: "d", expr: "3P - 2Q" },
        { l: "e", expr: "P + 3Q" },
        { l: "f", expr: "4P - \\tfrac{1}{2}Q" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ── Soal cerita: angkutan kota ────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sebuah angkot dapat mengangkut <strong className="text-teal-300">12 penumpang</strong>,
      1 sopir, dan 1 kenek dengan berat rata-rata <strong className="text-teal-300">k kg</strong>.
      Angkot itu juga memuat bagasi seberat <InlineMath math="(3k - 8)" /> kg.
    </p>
    <div className="pl-1">
      <svg width="180" height="60" viewBox="0 0 180 60">
        <rect x={5} y={10} width={155} height={38} rx={8}
          fill="#2dd4bf" fillOpacity={0.08} stroke="#2dd4bf" strokeWidth={1.5} />
        <rect x={160} y={20} width={16} height={18} rx={4}
          fill="#2dd4bf" fillOpacity={0.12} stroke="#2dd4bf" strokeWidth={1} />
        {[30, 60, 90, 120].map((x) => (
          <rect key={x} x={x} y={17} width={20} height={14} rx={3}
            fill="#2dd4bf" fillOpacity={0.15} stroke="#2dd4bf" strokeOpacity={0.4} strokeWidth={1} />
        ))}
        <circle cx={35} cy={52} r={7} fill="#2dd4bf" fillOpacity={0.2} stroke="#2dd4bf" strokeWidth={1.5} />
        <circle cx={130} cy={52} r={7} fill="#2dd4bf" fillOpacity={0.2} stroke="#2dd4bf" strokeWidth={1.5} />
        <text x={90} y={36} textAnchor="middle" fill="#5eead4" fontSize={9} fontFamily="monospace">12 penumpang + sopir + kenek</text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Nyatakan total berat muatan angkot seluruhnya (penumpang + bagasi) dalam bentuk aljabar yang sederhana!" },
        { l: "b", text: "Jika k = 55, berapa kg total berat muatan angkot tersebut?" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Page ─────────────────────────────────────────────── */
const PenjumlahanPenguranganAljabarPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const cards = [
    {
      num: 1, tag: "Sederhanakan", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      gradient: isDark ? "from-emerald-900/40 to-green-900/25" : "from-emerald-50/80 to-green-50/60", border: "border-emerald-500/25",
      bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
      custom: <SoalSatu />,
    },
    {
      num: 2, tag: "Keliling Bangun", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
      gradient: isDark ? "from-indigo-900/40 to-violet-900/25" : "from-indigo-50/80 to-violet-50/60", border: "border-indigo-500/25",
      bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
      custom: <SoalDua />,
    },
    {
      num: 3, tag: "Penjumlahan", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      gradient: isDark ? "from-rose-900/40 to-pink-900/25" : "from-rose-50/80 to-pink-50/60", border: "border-rose-500/25",
      bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
      custom: <SoalTiga />,
    },
    {
      num: 4, tag: "Operasi P & Q", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      gradient: isDark ? "from-amber-900/35 to-yellow-900/20" : "from-amber-50/80 to-yellow-50/60", border: "border-amber-500/25",
      bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
      custom: <SoalEmpat />,
    },
    {
      num: 5, tag: "Kontekstual", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
      gradient: isDark ? "from-teal-900/40 to-cyan-900/25" : "from-teal-50/80 to-cyan-50/60", border: "border-teal-500/25",
      bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
      custom: <SoalLima />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">➕</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(192,132,252,0.5)' }}
          >
            PENJUMLAHAN DAN PENGURANGAN
            <br />
            <span className="text-purple-300">BENTUK ALJABAR</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">5 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-400 font-body">✦ Kelas 7</span>
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
            className="text-sm text-white/30 hover:text-purple-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanPenguranganAljabarPage;
