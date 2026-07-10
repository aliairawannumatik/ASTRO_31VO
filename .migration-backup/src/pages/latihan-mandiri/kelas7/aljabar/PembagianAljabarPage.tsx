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

const AlgExpr = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

/* ── Soal 1 ── Monomial ÷ Monomial ─────────────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil pembagian suku-suku berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "1", expr: "24a^5b^2 \\div 6a^2b" },
        { l: "2", expr: "45x^6y^4 \\div 9x^3y^2" },
        { l: "3", expr: "-36p^8q^5r^2 \\div 4p^3q^2" },
        { l: "4", expr: "56m^9n^5 \\div (-8m^4n^2)" },
        { l: "5", expr: "-90a^7b^6c^3 \\div (-15a^2b^3c)" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
          <span className="overflow-x-auto"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Pembagian Bertingkat ─────────────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil pembagian bertingkat berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "6", expr: "20y^8 \\div [15y^6 \\div (-3y^2)]" },
        { l: "7", expr: "42a^5b^4 \\div (-6a^2b^3 \\div 3ab)" },
        { l: "8", expr: "p^7q^8 \\div (p^3q^2 \\times p^2q^4)" },
        { l: "9", expr: "-n^6m^5 \\div [-n^4m^3 \\div (-n^2m)]" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <span className="overflow-x-auto flex-1"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Operasi Campuran ─────────────────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil operasi campuran berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "10", expr: "x^8y^6 \\div [x^2y \\times (-x^3y^3)]" },
        { l: "11", expr: "-a^9b^8 \\div (-a^2b^3 \\times a^4b^2)" },
        { l: "12", expr: "c^{12}d^7 \\div [-c^4d^2 \\times (-c^3d^5)]" },
        { l: "13", expr: "60p^6q^7 \\div (4p^2q^3 \\div 5pq^2)" },
        { l: "14", expr: "(m^5n^3 \\times m^2n^4) \\div (-m^4n^5 \\div mn)" },
        { l: "15", expr: "(-a^7b^5 \\div a^2b^2) \\div [a^2b \\times (-a^2b^2)]" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
          <span className="overflow-x-auto flex-1"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Polinomial ÷ Binomial ────────────────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil pembagian suku banyak berikut!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "16", expr: "(x^2 + 7x + 12) \\div (x + 4)" },
        { l: "17", expr: "(x^2 - 3x - 18) \\div (x - 6)" },
        { l: "18", expr: "(x^2 + 2x - 35) \\div (x + 7)" },
        { l: "19", expr: "(2x^2 + 7x - 15) \\div (2x - 3)" },
        { l: "20", expr: "(x^3 - 2x^2 - 5x + 6) \\div (x - 1)" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <span className="overflow-x-auto flex-1"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ── Sederhanakan ─────────────────────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil pembagian suku banyak berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "21", expr: "(3x^2 + x - 10) \\div (3x - 5)" },
        { l: "22", expr: "(x^3 - 7x + 6) \\div (x - 2)" },
        { l: "23", expr: "(2y^3 - 7y^2 + 2y + 3) \\div (2y + 1)" },
        { l: "24", expr: "(y^3 - 4y^2 - 7y + 10) \\div (y + 2)" },
        { l: "25", expr: "(y^3 + 27) \\div (y + 3)" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <span className="overflow-x-auto flex-1"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 6 ── Panjang sisi dari luas bangun aljabar ─────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Luas sebuah persegi panjang dinyatakan dalam bentuk aljabar. Tentukan panjangnya!
    </p>
    <div className="pl-1">
      <svg width="220" height="92" viewBox="0 0 220 92">
        <rect x={8} y={10} width={194} height={70} rx={6}
          fill="#818cf8" fillOpacity={0.07} stroke="#818cf8" strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i}
            x1={8 + i * 17} y1={10} x2={8 + i * 17 - 14} y2={80}
            stroke="#818cf8" strokeWidth={0.5} strokeOpacity={0.18} />
        ))}
        <text x={105} y={42} textAnchor="middle" fill="#a5b4fc" fontSize={11} fontFamily="monospace">
          L = (6x² + 11x − 10) cm²
        </text>
        <text x={105} y={88} textAnchor="middle" fill="#a5b4fc" fontSize={10} fontFamily="monospace">
          l = (2x + 5) cm
        </text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Tuliskan operasi pembagian untuk mencari panjang persegi panjang tersebut!" },
        { l: "b", text: "Tentukan panjangnya dalam bentuk aljabar yang sudah disederhanakan!" },
        { l: "c", text: "Jika x = 3, hitunglah panjang dan luas persegi panjang dalam satuan cm!" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 7 ── Pecahan aljabar sederhana ────────────────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakanlah pecahan-pecahan aljabar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "\\dfrac{12a^4b^3}{4a^2b}", hint: "bagi koefisien & eksponen" },
        { l: "b", expr: "\\dfrac{x^2 + 5x + 6}{x + 2}", hint: "faktorkan pembilang" },
        { l: "c", expr: "\\dfrac{2y^2 - 8}{y - 2}", hint: "faktorkan selisih kuadrat" },
        { l: "d", expr: "\\dfrac{3n^2 - 12n}{n - 4}", hint: "faktorkan GCF" },
      ].map(({ l, expr, hint }) => (
        <div key={l} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-amber-400/30 text-[10px] font-body shrink-0">{hint}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 8 ── Soal cerita: kebun petak ─────────────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Luas sebuah petak kebun berbentuk persegi panjang adalah{" "}
      <InlineMath math="(2n^2 + 9n + 4)" /> meter persegi.
      Jika lebarnya <InlineMath math="(n + 4)" /> meter, tentukan:
    </p>
    <div className="pl-1 flex gap-4 items-center flex-wrap">
      <svg width="168" height="82" viewBox="0 0 168 82">
        <rect x={8} y={8} width={152} height={62} rx={5}
          fill="#4ade80" fillOpacity={0.07} stroke="#4ade80" strokeWidth={1.5} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i}
            x1={8 + i * 20} y1={8} x2={8 + i * 20 - 12} y2={70}
            stroke="#4ade80" strokeWidth={0.6} strokeOpacity={0.15} />
        ))}
        <text x={84} y={42} textAnchor="middle" fill="#86efac" fontSize={9} fontFamily="monospace">(2n² + 9n + 4) m²</text>
        <text x={162} y={40} textAnchor="middle" fill="#86efac" fontSize={9}
          fontFamily="monospace" transform="rotate(90,162,40)">(n + 4) m</text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Panjang petak kebun dalam bentuk aljabar!" },
        { l: "b", text: "Keliling petak kebun dalam bentuk aljabar yang telah disederhanakan!" },
        { l: "c", text: "Luas dan keliling kebun jika n = 6!" },
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
    num: 1, tag: "Monomial ÷ Monomial", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Pembagian Bertingkat", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Operasi Campuran", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Polinomial ÷ Binomial", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Suku Banyak Lanjutan", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Panjang Sisi", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Pecahan Aljabar", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
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
const PembagianAljabarPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">➗</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(129,140,248,0.5)' }}
          >
            PEMBAGIAN BENTUK ALJABAR
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">8 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-body">✦ Kelas 7</span>
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
            className="text-sm text-white/30 hover:text-indigo-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembagianAljabarPage;
