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

/* ── Soal 1 ── Kalikan dengan 10, 100, 1.000 ─────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Kalikanlah setiap bilangan desimal berikut dengan <InlineMath math="100" /> dan <InlineMath math="10.000" />!
    </p>
    <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-1">
      {[
        { l: "a", val: "3,6" },
        { l: "b", val: "0,045" },
        { l: "c", val: "12,08" },
        { l: "d", val: "0,00027" },
      ].map(({ l, val }) => (
        <div key={l} className="flex items-center gap-2.5">
          <SubLabel letter={l} color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
          <InlineMath math={val} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Perkalian dasar desimal ───────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hitunglah hasil perkalian bilangan-bilangan desimal berikut!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 pl-1">
      {[
        { l: "a", expr: "0{,}3 \\times 0{,}07" },
        { l: "b", expr: "2{,}4 \\times 0{,}0015" },
        { l: "c", expr: "315 \\times 0{,}032" },
        { l: "d", expr: "4{,}8 \\times 250" },
        { l: "e", expr: "6{,}25 \\times 1{,}6" },
        { l: "f", expr: "0{,}064 \\times 50{.}000" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-1.5">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <InlineMath math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Perkalian campuran (desimal × pecahan × %) */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil perkalian bilangan-bilangan campuran berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "5{,}4 \\times 3{,}72 \\times 1\\tfrac{1}{4}" },
        { l: "b", expr: "7{,}2 \\times 0{,}625 \\times 16\\%" },
        { l: "c", expr: "0{,}36 \\times 8{,}5 \\times \\tfrac{5}{12} \\times 40\\%" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-start gap-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <span className="flex-1 overflow-x-auto"><InlineMath math={expr} /></span>
          <span className="text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Luas persegi ──────────────────────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hitunglah luas setiap persegi dengan panjang sisi berikut!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
      {[
        { l: "a", sisi: "6{,}3 \\text{ cm}", svg: true, size: 63 },
        { l: "b", sisi: "3{,}75 \\text{ m}", svg: false },
        { l: "c", sisi: "0{,}92 \\text{ dm}", svg: false },
        { l: "d", sisi: "12{,}4 \\text{ cm}", svg: false },
      ].map(({ l, sisi }) => (
        <div key={l} className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
          <div className="flex flex-col gap-0.5">
            <span className="text-white/50 text-[10px] font-body">sisi =</span>
            <InlineMath math={sisi} />
          </div>
          <span className="ml-auto text-white/20 text-xs font-body">L = …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ── Luas persegi panjang ──────────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hitunglah luas persegi panjang yang panjangnya{" "}
      <InlineMath math="14{,}25 \text{ cm}" /> dan lebarnya{" "}
      <InlineMath math="8{,}16 \text{ cm}" />!
    </p>
    <div className="pl-1">
      <svg width="220" height="90" viewBox="0 0 220 90" className="rounded-lg overflow-hidden">
        <rect x={10} y={10} width={200} height={70} rx={6}
          fill="#a78bfa" fillOpacity={0.08} stroke="#a78bfa" strokeWidth={1.5} />
        <text x={110} y={56} textAnchor="middle" fill="#c4b5fd" fontSize={11} fontFamily="monospace">
          14,25 cm
        </text>
        <text x={200} y={47} textAnchor="middle" fill="#c4b5fd" fontSize={11}
          fontFamily="monospace" transform="rotate(90,200,47)">
          8,16 cm
        </text>
      </svg>
    </div>
  </div>
);

/* ── Soal 6 ── Konteks: harga bahan kue ──────────────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Seorang pedagang membeli <strong className="text-rose-300">12,5 kg</strong> tepung terigu
      seharga <InlineMath math="\text{Rp }14.800{,}00" /> per kg, dan{" "}
      <strong className="text-rose-300">3,75 liter</strong> minyak goreng seharga{" "}
      <InlineMath math="\text{Rp }19.600{,}00" /> per liter.
    </p>
    <div className="space-y-2 pl-1">
      {[
        { letter: "a", text: "Berapa total biaya pembelian tepung terigu?" },
        { letter: "b", text: "Berapa total biaya pembelian minyak goreng?" },
        { letter: "c", text: "Berapa total seluruh pengeluaran pedagang tersebut?" },
      ].map(({ letter, text }) => (
        <div key={letter} className="flex items-start gap-2.5">
          <SubLabel letter={letter} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 7 ── Konteks: tumpukan buku ────────────────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sebuah tumpukan terdiri atas <strong className="text-amber-300">24 keping ubin keramik</strong>.
      Tebal setiap ubin adalah <InlineMath math="0{,}85 \text{ cm}" />.
      Tentukan tinggi total tumpukan ubin tersebut dalam satuan cm dan mm!
    </p>
    <div className="pl-1 flex items-end gap-4">
      {/* Simple stack visual */}
      <svg width="70" height="100" viewBox="0 0 70 100">
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i}
            x={8} y={8 + i * 11} width={54} height={8}
            rx={2}
            fill="#f59e0b" fillOpacity={0.15 + i * 0.01}
            stroke="#f59e0b" strokeWidth={1} strokeOpacity={0.5}
          />
        ))}
        <text x={35} y={98} textAnchor="middle" fill="#fcd34d" fontSize={8} fontFamily="monospace">
          × 24 keping
        </text>
      </svg>
      <div className="space-y-1">
        <p className="font-body text-xs text-white/50">tebal tiap ubin = <InlineMath math="0{,}85 \text{ cm}" /></p>
        <p className="font-body text-xs text-amber-400/70">tinggi tumpukan = ?</p>
      </div>
    </div>
  </div>
);

/* ── Soal 8 ── Pola perkalian desimal ────────────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Perhatikan pola perkalian desimal berikut, lalu lengkapi baris yang kosong!
    </p>
    <div className="space-y-1.5 pl-1 font-mono text-sm">
      {[
        { expr: "72 \\times 35 = 2{.}520", faded: false },
        { expr: "7{,}2 \\times 35 = \\ldots", faded: true },
        { expr: "72 \\times 3{,}5 = \\ldots", faded: true },
        { expr: "7{,}2 \\times 3{,}5 = \\ldots", faded: true },
        { expr: "0{,}72 \\times 3{,}5 = \\ldots", faded: true },
        { expr: "0{,}072 \\times 0{,}35 = \\ldots", faded: true },
      ].map(({ expr, faded }, i) => (
        <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-1.5 border
          ${faded
            ? "bg-teal-500/5 border-teal-500/10"
            : "bg-teal-500/15 border-teal-400/30"}`}>
          <span className={`text-[10px] font-bold font-body w-4 shrink-0 ${faded ? "text-teal-400/40" : "text-teal-300"}`}>
            {i + 1}.
          </span>
          <InlineMath math={expr} />
        </div>
      ))}
    </div>
    <p className="font-body text-xs text-white/40 pl-1 pt-1 italic">
      Apa pola yang kamu temukan dari geser titik desimal di setiap baris?
    </p>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Pangkat 10", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Perkalian Dasar", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Campuran", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Luas Persegi", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Luas Persegi Panjang", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Kontekstual", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Soal Cerita", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalTujuh />,
  },
  {
    num: 8, tag: "Pola", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    gradient: "from-teal-900/40 to-cyan-900/25", border: "border-teal-500/25",
    bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
    custom: <SoalDelapan />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const PerkalianDesimalPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">✖️</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(56,189,248,0.5)' }}
          >
            PERKALIAN DESIMAL
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Pecahan · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">8 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 font-body">✦ Kelas 7</span>
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/bilangan-rasional"); }}
            className="text-sm text-white/30 hover:text-sky-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pecahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianDesimalPage;
