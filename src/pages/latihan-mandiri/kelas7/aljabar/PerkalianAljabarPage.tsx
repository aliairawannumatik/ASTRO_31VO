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

/* ── Soal 1 ── Monomial × Monomial ───────────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil perkalian suku-suku berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "1", expr: "5 \\times b \\times 3c \\times 2d" },
        { l: "2", expr: "-4 \\times (-2p) \\times 3qr \\times (-q)" },
        { l: "3", expr: "6a \\times 4bc \\times (-5b)" },
        { l: "4", expr: "9xy \\times 2z^2y \\times (-3x^2)" },
        { l: "5", expr: "3p^2 \\times (-4pq) \\times 2q^2 \\times (-p^2)" },
        { l: "6", expr: "-5ab^2 \\times 3a^2b \\times (-2ab) \\times (-b^2a)" },
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

/* ── Soal 2 ── Monomial × Polynomial ─────────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil perkalian bentuk-bentuk aljabar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "7",  expr: "3b(5b + 4c)" },
        { l: "8",  expr: "4p(3p^2 - 6p)" },
        { l: "9",  expr: "-6q^2(4q - 5r)" },
        { l: "10", expr: "2ab(3a^2 - 4ab + b^2)" },
        { l: "11", expr: "-3mn(2m^2 - 5mn - n^2)" },
        { l: "12", expr: "4x^2y(3x^2 - 2xy + 5y^2 - xy^2)" },
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

/* ── Soal 3 ── Keliling bangun aljabar ───────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan keliling bangun-bangun berikut!
    </p>
    <div className="flex flex-wrap gap-10 pl-1 items-end">
      {/* Persegi panjang */}
      <div className="flex flex-col items-center gap-1.5">
        <SubLabel letter="a" color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
        <svg width="150" height="88" viewBox="0 0 150 88">
          <rect x={8} y={10} width={134} height={64} rx={5}
            fill="#22d3ee" fillOpacity={0.07} stroke="#22d3ee" strokeWidth={1.5} />
          <text x={75} y={7} textAnchor="middle" fill="#67e8f9" fontSize={9} fontFamily="monospace">(4x + 3)</text>
          <text x={148} y={46} textAnchor="middle" fill="#67e8f9" fontSize={9}
            fontFamily="monospace" transform="rotate(90,148,46)">(2x − 1)</text>
        </svg>
        <p className="text-cyan-300/50 text-[10px] font-body">persegi panjang</p>
      </div>
      {/* Trapesium */}
      <div className="flex flex-col items-center gap-1.5">
        <SubLabel letter="b" color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
        <svg width="150" height="100" viewBox="0 0 150 100">
          <polygon points="30,10 120,10 142,82 8,82"
            fill="#22d3ee" fillOpacity={0.07} stroke="#22d3ee" strokeWidth={1.5} />
          <text x={75} y={7} textAnchor="middle" fill="#67e8f9" fontSize={9} fontFamily="monospace">3x</text>
          <text x={75} y={94} textAnchor="middle" fill="#67e8f9" fontSize={9} fontFamily="monospace">(5x + 2)</text>
          <text x={2} y={50} textAnchor="start" fill="#67e8f9" fontSize={9} fontFamily="monospace" transform="rotate(-8,2,50)">2y</text>
          <text x={128} y={50} textAnchor="start" fill="#67e8f9" fontSize={9} fontFamily="monospace" transform="rotate(8,128,50)">2y</text>
        </svg>
        <p className="text-cyan-300/50 text-[10px] font-body">trapesium sama kaki</p>
      </div>
    </div>
  </div>
);

/* ── Soal 4 ── Binomial × Binomial (distributif) ─────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Jabarkanlah bentuk perkalian berikut menggunakan hukum distributif!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "14", expr: "(x + 3)(x + 7)" },
        { l: "15", expr: "(2a - 3)(a + 5)" },
        { l: "16", expr: "(3p + 4)(2p - 1)" },
        { l: "17", expr: "(5 - 2m)(4 - 3m)" },
        { l: "18", expr: "(4n - 3)(5n + 2)" },
        { l: "19", expr: "(2x + 7y)(3x - 4y)" },
        { l: "20", expr: "(6a - b)(3a + 5b)" },
        { l: "21", expr: "(3p + 2q)(4p - 7q)" },
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

/* ── Soal 5 ── Perkalian dengan tanda kurung ganda ───── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakanlah hasil perkalian berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "3(x+2)(x-4)" },
        { l: "b", expr: "(2p-1)(p+3) - 4(p^2 - p)" },
        { l: "c", expr: "(3a+b)^2 - (3a-b)^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
          <span className="flex-1 overflow-x-auto"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 6 ── Luas bangun dengan sisi aljabar ───────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan luas persegi panjang berikut dalam bentuk aljabar yang sudah disederhanakan!
    </p>
    <div className="pl-1">
      <svg width="210" height="92" viewBox="0 0 210 92">
        <rect x={8} y={10} width={194} height={70} rx={6}
          fill="#a78bfa" fillOpacity={0.07} stroke="#a78bfa" strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i}
            x1={8 + i * 17} y1={10} x2={8 + i * 17 - 14} y2={80}
            stroke="#a78bfa" strokeWidth={0.5} strokeOpacity={0.18} />
        ))}
        <text x={105} y={50} textAnchor="middle" fill="#c4b5fd" fontSize={11} fontFamily="monospace">
          p = (3x + 5) cm
        </text>
        <text x={105} y={88} textAnchor="middle" fill="#c4b5fd" fontSize={10} fontFamily="monospace">
          l = (2x − 1) cm
        </text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Tuliskan luas persegi panjang tersebut sebagai perkalian dua binomial!" },
        { l: "b", text: "Jabarkan dan sederhanakan hasil perkaliannya!" },
        { l: "c", text: "Jika x = 4, hitunglah luas persegi panjang itu dalam satuan cm²!" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 7 ── Pola perkalian khusus ─────────────────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Gunakan pola perkalian khusus untuk menjabarkan!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "(a + 6)^2", hint: "(a+b)^2" },
        { l: "b", expr: "(3x - 4)^2", hint: "(a-b)^2" },
        { l: "c", expr: "(2m + 5)(2m - 5)", hint: "(a+b)(a-b)" },
        { l: "d", expr: "(4p + q)(4p - q)", hint: "(a+b)(a-b)" },
      ].map(({ l, expr, hint }) => (
        <div key={l} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-amber-400/30 text-[10px] font-body shrink-0">pola <AlgExpr math={hint} /></span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 8 ── Soal cerita: luas kebun ───────────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sebuah kebun berbentuk persegi panjang. Panjangnya{" "}
      <InlineMath math="(3n + 4)" /> meter dan lebarnya{" "}
      <InlineMath math="(n + 6)" /> meter.
    </p>
    <div className="pl-1 flex gap-4 items-center flex-wrap">
      <svg width="160" height="80" viewBox="0 0 160 80">
        <rect x={8} y={8} width={144} height={62} rx={5}
          fill="#4ade80" fillOpacity={0.07} stroke="#4ade80" strokeWidth={1.5} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i}
            x1={8 + i * 19} y1={8} x2={8 + i * 19 - 12} y2={70}
            stroke="#4ade80" strokeWidth={0.6} strokeOpacity={0.15} />
        ))}
        <text x={80} y={42} textAnchor="middle" fill="#86efac" fontSize={9} fontFamily="monospace">(3n + 4) m</text>
        <text x={156} y={40} textAnchor="middle" fill="#86efac" fontSize={9}
          fontFamily="monospace" transform="rotate(90,156,40)">(n + 6) m</text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Nyatakan luas kebun dalam bentuk aljabar yang telah disederhanakan!" },
        { l: "b", text: "Nyatakan keliling kebun dalam bentuk aljabar yang telah disederhanakan!" },
        { l: "c", text: "Jika n = 5, hitunglah luas dan keliling kebun tersebut!" },
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
    num: 1, tag: "Monomial × Monomial", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Monomial × Polynomial", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Keliling Bangun", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Binomial × Binomial", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Sederhanakan", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Luas Bangun", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Pola Khusus", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
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
const PerkalianAljabarPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/10 border border-fuchsia-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">✖️</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(232,121,249,0.5)' }}
          >
            PERKALIAN BENTUK ALJABAR
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">8 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/20 text-fuchsia-400 font-body">✦ Kelas 7</span>
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
            className="text-sm text-white/30 hover:text-fuchsia-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianAljabarPage;
