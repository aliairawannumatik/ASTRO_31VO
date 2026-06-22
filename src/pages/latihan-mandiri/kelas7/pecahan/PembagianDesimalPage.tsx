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

/* ── Soal 1 ── Bagi dengan 10 dan 1.000 ──────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Bagilah setiap bilangan desimal berikut dengan{" "}
      <InlineMath math="10" /> dan <InlineMath math="1.000" />!
    </p>
    <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-1">
      {[
        { l: "a", val: "57{,}4" },
        { l: "b", val: "6{,}035" },
        { l: "c", val: "0{,}92" },
        { l: "d", val: "408{,}6" },
      ].map(({ l, val }) => (
        <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-1.5">
          <SubLabel letter={l} color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
          <InlineMath math={val} />
          <span className="ml-auto text-white/20 text-xs font-body">÷ …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Bagi dengan 5, lalu 50 dan 5.000 ─────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Bagilah setiap bilangan berikut dengan <InlineMath math="5" />,
      kemudian tentukan juga hasil baginya dengan <InlineMath math="50" /> dan <InlineMath math="5.000" />!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "a", val: "38{,}5" },
        { l: "b", val: "9{,}75" },
        { l: "c", val: "2{,}465" },
        { l: "d", val: "14{,}08" },
      ].map(({ l, val }) => (
        <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-1.5">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <InlineMath math={val} />
          <span className="ml-auto text-white/20 text-xs font-body">÷ 5 / ÷ 50 / ÷ 5.000</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Operasi campuran (+ − × ÷) desimal ───── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan hasil operasi campuran berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "48{,}6 : 9{,}2 + 5{,}34 : 0{,}6" },
        { l: "b", expr: "96{,}48 : 12{,}4 - 0{,}75 \\times 6{,}8" },
        { l: "c", expr: "(3{,}6 \\times 1{,}25) : (63{,}84 : 8{,}4)" },
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

/* ── Soal 4 ── Cari bilangan kedua dari hasil kali ───── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hasil kali dua bilangan desimal adalah <strong className="text-emerald-300">32,856</strong>.
      Jika bilangan yang pertama adalah <InlineMath math="4{,}68" />, berapakah bilangan yang kedua?
    </p>
    <div className="pl-1 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5">
        <InlineMath math="4{,}68 \times \square = 32{,}856" />
      </div>
      <span className="text-white/30 text-sm font-body">→</span>
      <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-400/15 rounded-lg px-4 py-2.5">
        <InlineMath math="\square = 32{,}856 \div 4{,}68 = \ldots" />
      </div>
    </div>
  </div>
);

/* ── Soal 5 ── Lebar persegi panjang dari luas & panjang */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Luas sebuah persegi panjang adalah <InlineMath math="51{,}48 \text{ cm}^2" /> dan
      panjangnya <InlineMath math="7{,}8 \text{ cm}" />.
      Tentukanlah lebar persegi panjang tersebut!
    </p>
    <div className="pl-1">
      <svg width="230" height="100" viewBox="0 0 230 100">
        <rect x={12} y={10} width={168} height={78} rx={6}
          fill="#a78bfa" fillOpacity={0.07} stroke="#a78bfa" strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i}
            x1={12 + i * 15} y1={10}
            x2={12 + i * 15 - 20} y2={88}
            stroke="#a78bfa" strokeWidth={0.6} strokeOpacity={0.18} />
        ))}
        <text x={96} y={55} textAnchor="middle" fill="#c4b5fd" fontSize={11} fontFamily="monospace">
          L = 51,48 cm²
        </text>
        <text x={96} y={97} textAnchor="middle" fill="#c4b5fd" fontSize={10} fontFamily="monospace">
          p = 7,8 cm
        </text>
        <text x={196} y={54} textAnchor="middle" fill="#f0abfc" fontSize={10}
          fontFamily="monospace" transform="rotate(90,196,54)">
          l = ?
        </text>
      </svg>
    </div>
  </div>
);

/* ── Soal 6 ── Soal cerita: pita dipotong ────────────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sebuah rol pita memiliki panjang <strong className="text-rose-300">2,16 m</strong>.
      Pita tersebut dipotong menjadi beberapa bagian yang sama panjang sehingga masih
      tersisa <strong className="text-rose-300">6 cm</strong>.
      Berapa banyak potongan pita yang dapat dibuat jika setiap potongan lebih dari <InlineMath math="8 \text{ cm}" />?
    </p>
    <div className="pl-1">
      <svg width="260" height="44" viewBox="0 0 260 44">
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i}
            x={4 + i * 27} y={8} width={24} height={20} rx={3}
            fill="#f43f5e" fillOpacity={i < 8 ? 0.18 : 0.06}
            stroke="#f43f5e" strokeWidth={1} strokeOpacity={0.5} />
        ))}
        <text x={4 + 8 * 27 + 12} y={23} textAnchor="middle"
          fill="#fb7185" fontSize={8} fontFamily="monospace">sisa</text>
        <text x={130} y={40} textAnchor="middle" fill="#fb7185" fontSize={9} fontFamily="monospace">
          2,16 m = 216 cm
        </text>
      </svg>
    </div>
  </div>
);

/* ── Soal 7 ── Soal cerita: pembagian bensin ─────────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sebuah truk menghabiskan <strong className="text-amber-300">0,085 liter</strong> bensin
      untuk setiap kilometer perjalanan. Jika truk tersebut memiliki
      cadangan bensin <strong className="text-amber-300">6,375 liter</strong>, berapa kilometer
      jarak yang dapat ditempuh truk itu?
    </p>
    <div className="pl-1 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5">
        <InlineMath math="\text{jarak} = 6{,}375 \div 0{,}085 = \ldots \text{ km}" />
      </div>
    </div>
  </div>
);

/* ── Soal 8 ── Pola pembagian desimal ────────────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Perhatikan pola pembagian desimal berikut, lalu lengkapi baris yang kosong!
    </p>
    <div className="space-y-1.5 pl-1">
      {[
        { expr: "8{.}64 : 36 = 0{,}24", faded: false },
        { expr: "86{,}4 : 36 = \\ldots", faded: true },
        { expr: "864 : 36 = \\ldots", faded: true },
        { expr: "8{.}64 : 3{,}6 = \\ldots", faded: true },
        { expr: "8{.}64 : 0{,}36 = \\ldots", faded: true },
        { expr: "0{,}864 : 0{,}036 = \\ldots", faded: true },
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
      Apa pola yang kamu temukan dari pergeseran titik desimal pada setiap baris?
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
    num: 2, tag: "Bagi & Pola", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Operasi Campuran", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Mencari Bilangan", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Geometri", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Soal Cerita", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Kontekstual", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
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
const PembagianDesimalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">➗</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(192,132,252,0.5)' }}
          >
            PEMBAGIAN DESIMAL
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Pecahan · Tugas - Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">8 Soal Essay</span>
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/bilangan-rasional"); }}
            className="text-sm text-white/30 hover:text-purple-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Pecahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembagianDesimalPage;
