import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
const F = ({ n, d }: { n: string; d: string }) => (
  <InlineMath math={`\\dfrac{${n}}{${d}}`} />
);

const MF = ({ n, w, d }: { n: string; w: string; d: string }) => (
  <InlineMath math={`${w}\\dfrac{${n}}{${d}}`} />
);

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

const SubLabel = ({ letter, color }: { letter: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${color}`}>
    {letter}
  </span>
);

/* ── Soal 1 ───────────────────────────────────────────── */
const SoalSatu = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Nyatakan bilangan-bilangan berikut sebagai pecahan campuran!
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 pl-1">
      {[
        { l: "a", n: "11", d: "4" },
        { l: "b", n: "23", d: "5" },
        { l: "c", n: "29", d: "8" },
        { l: "d", n: "-17", d: "6" },
        { l: "e", n: "85", d: "9" },
        { l: "f", n: "-137", d: "12" },
      ].map(({ l, n, d }) => (
        <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/15 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
          <F n={n} d={d} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ───────────────────────────────────────────── */
const SoalDua = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Nyatakan bilangan-bilangan berikut sebagai pecahan biasa!
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 pl-1">
      {[
        { l: "a", w: "4", n: "3", d: "7" },
        { l: "b", w: "5", n: "2", d: "9" },
        { l: "c", w: "-6", n: "1", d: "4" },
        { l: "d", w: "8", n: "5", d: "6" },
        { l: "e", w: "11", n: "3", d: "8" },
        { l: "f", w: "-9", n: "2", d: "5" },
      ].map(({ l, w, n, d }) => (
        <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/15 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <MF w={w} n={n} d={d} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ───────────────────────────────────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan nilai-nilai berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", frac: <F n="1" d="4" />, of: "dari Rp4.800" },
        { l: "b", frac: <F n="3" d="4" />, of: "dari 1 jam (dalam menit)" },
        { l: "c", frac: <F n="2" d="5" />, of: "dari 1 kg (dalam ons)" },
        { l: "d", frac: <F n="7" d="8" />, of: "dari 16 liter (dalam mL)" },
      ].map(({ l, frac, of }) => (
        <div key={l} className="flex items-center gap-2.5 bg-cyan-500/5 border border-cyan-500/15 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <span className="font-body text-sm text-white/80">{frac} {of}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ───────────────────────────────────────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-2.5">
      <SubLabel letter="a" color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
      <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">
        Manakah yang lebih berat, <InlineMath math="\dfrac{3}{4}" /> dari 24 kg atau <InlineMath math="\dfrac{5}{8}" /> dari 32 kg?
      </p>
    </div>
    <div className="flex items-start gap-2.5">
      <SubLabel letter="b" color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
      <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">
        Berapa kg perbedaannya?
      </p>
    </div>
  </div>
);

/* ── Soal 5 ───────────────────────────────────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Susu full cream mengandung <InlineMath math="\dfrac{3}{8}" /> bagian lemak susu murni.
      Tentukan banyak lemak susu murni yang terdapat dalam kadar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", text: "480 gram susu full cream" },
        { l: "b", text: "720 gram susu full cream" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <p className="font-body text-sm text-white/80">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 6 (was 10) ──────────────────────────────────── */
const SoalSepuluh = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Nyatakan persen berikut sebagai pecahan biasa dalam bentuk yang paling sederhana!
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 pl-1">
      {[
        { l: "a", val: "25\\%" },
        { l: "b", val: "60\\%" },
        { l: "c", val: "84\\%" },
        { l: "d", val: "1\\tfrac{1}{2}\\%" },
        { l: "e", val: "83\\tfrac{1}{3}\\%" },
        { l: "f", val: "37\\tfrac{1}{2}\\%" },
      ].map(({ l, val }) => (
        <div key={l} className="flex items-center gap-2.5 bg-purple-500/5 border border-purple-500/15 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-purple-500/20 text-purple-300 border border-purple-400/30" />
          <InlineMath math={val} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 7 (was 11) ──────────────────────────────────── */
const SoalSebelas = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Nyatakan bilangan-bilangan berikut dalam bentuk persen!
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 pl-1">
      {[
        { l: "a", node: <F n="3" d="4" /> },
        { l: "b", node: <F n="9" d="25" /> },
        { l: "c", node: <F n="7" d="40" /> },
        { l: "d", node: <F n="6" d="15" /> },
        { l: "e", node: <F n="7" d="4" /> },
        { l: "f", node: <F n="11" d="6" /> },
      ].map(({ l, node }) => (
        <div key={l} className="flex items-center gap-2.5 bg-green-500/5 border border-green-500/15 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-green-500/20 text-green-300 border border-green-400/30" />
          <span>{node}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 8 (was 12) ──────────────────────────────────── */
const SoalDuaBelas = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan nilai-nilai berikut!
    </p>
    <div className="space-y-2 pl-1">
      <div className="flex items-center gap-2.5 bg-lime-500/5 border border-lime-500/15 rounded-lg px-3 py-2">
        <SubLabel letter="a" color="bg-lime-500/20 text-lime-300 border border-lime-400/30" />
        <p className="font-body text-sm text-white/80">8% dari Rp75.000</p>
      </div>
      <div className="flex items-center gap-2.5 bg-lime-500/5 border border-lime-500/15 rounded-lg px-3 py-2">
        <SubLabel letter="b" color="bg-lime-500/20 text-lime-300 border border-lime-400/30" />
        <span className="font-body text-sm text-white/80 flex items-center gap-1">
          <InlineMath math="17\tfrac{1}{2}\%" /> dari 60 kg
        </span>
      </div>
    </div>
  </div>
);

/* ── Soal 9 (was 13) ──────────────────────────────────── */
const SoalTigaBelas = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Banyak siswa dalam suatu kelas adalah 50 orang, dengan 36%-nya adalah siswa laki-laki.
      Berapa banyak siswa perempuan di kelas itu?
    </p>
  </div>
);

/* ── Soal 10 (was 14) ─────────────────────────────────── */
const SoalEmpatBelas = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Harga sebuah tas sekolah 35% lebih mahal dari harga kotak pensil seharga Rp60.000.
      Hitunglah harga tas sekolah tersebut!
    </p>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Pecahan Campuran", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Pecahan Biasa", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Nilai Pecahan", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Membandingkan", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Kontekstual", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Persen → Pecahan", tagColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    gradient: "from-purple-900/45 to-violet-900/25", border: "border-purple-500/25",
    bar: "from-purple-400 to-violet-500", numBg: "bg-purple-500/30 text-purple-200",
    custom: <SoalSepuluh />,
  },
  {
    num: 7, tag: "Pecahan → Persen", tagColor: "bg-green-500/20 text-green-300 border-green-400/40",
    gradient: "from-green-900/40 to-emerald-900/25", border: "border-green-500/25",
    bar: "from-green-400 to-emerald-500", numBg: "bg-green-500/30 text-green-200",
    custom: <SoalSebelas />,
  },
  {
    num: 8, tag: "Nilai Persen", tagColor: "bg-lime-500/20 text-lime-300 border-lime-400/40",
    gradient: "from-lime-900/35 to-green-900/20", border: "border-lime-500/25",
    bar: "from-lime-400 to-green-500", numBg: "bg-lime-500/30 text-lime-200",
    custom: <SoalDuaBelas />,
  },
  {
    num: 9, tag: "Kontekstual", tagColor: "bg-pink-500/20 text-pink-300 border-pink-400/40",
    gradient: "from-pink-900/40 to-rose-900/25", border: "border-pink-500/25",
    bar: "from-pink-400 to-rose-500", numBg: "bg-pink-500/30 text-pink-200",
    custom: <SoalTigaBelas />,
  },
  {
    num: 10, tag: "Kontekstual", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalEmpatBelas />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const PecahanCampuranPersenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🔣</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(52,211,153,0.5)' }}>
            PECAHAN CAMPURAN DAN PERSEN
            <br />
            <span className="text-emerald-300">SERTA BENTUK DESIMAL</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Pecahan · Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">10 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 font-body">✦ Kelas 7</span>
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
            className="text-sm text-white/30 hover:text-emerald-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Pecahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PecahanCampuranPersenPage;
