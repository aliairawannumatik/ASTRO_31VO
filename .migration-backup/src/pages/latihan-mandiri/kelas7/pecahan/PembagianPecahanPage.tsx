import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
const M = ({ math }: { math: string }) => <InlineMath math={math} />;

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

/* ── Soal 1 — sederhanakan pembagian ─────────────────── */
const SoalSatu = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakan pembagian pecahan berikut!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
      {[
        { l: "a", math: "\\dfrac{1}{6} \\div \\dfrac{1}{3}" },
        { l: "d", math: "3\\dfrac{1}{5} \\div 5\\dfrac{1}{3}" },
        { l: "b", math: "\\dfrac{8}{15} \\div \\dfrac{4}{5}" },
        { l: "e", math: "8\\dfrac{3}{4} \\div 5\\dfrac{1}{6}" },
        { l: "c", math: "9 \\div 1\\dfrac{1}{2}" },
        { l: "f", math: "9\\dfrac{3}{5} \\div 6\\dfrac{2}{7}" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-2 bg-violet-500/5 border border-violet-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
          <M math={math} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 — operasi campuran ────────────────────────── */
const SoalDua = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hitunglah hasil operasi pecahan berikut!
    </p>
    <div className="space-y-3 pl-1">
      {[
        { l: "a", math: "\\left(\\dfrac{2}{3} \\times 4\\dfrac{1}{2}\\right) \\div \\left(3\\dfrac{3}{4} : \\dfrac{5}{8}\\right)" },
        { l: "b", math: "\\left(5\\dfrac{1}{4} : 2\\dfrac{1}{3}\\right) + \\left(1\\dfrac{1}{2} \\times 3\\dfrac{1}{3}\\right)" },
        { l: "c", math: "\\left(9\\dfrac{3}{4} : 1\\dfrac{5}{8}\\right) + \\left(2\\dfrac{1}{3} \\times 3\\dfrac{3}{7}\\right)" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-start gap-2 bg-orange-500/5 border border-orange-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <span className="text-sm leading-loose"><M math={math} /></span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 — hasil kali dua bilangan ────────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hasil kali dua bilangan adalah 15. Jika salah satu bilangannya adalah{" "}
      <M math="3\dfrac{3}{4}" />, tentukan bilangan yang lain!
    </p>
  </div>
);

/* ── Soal 4 — luas persegi panjang ───────────────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Diketahui luas sebidang kebun berbentuk persegi panjang adalah{" "}
      <M math="87\dfrac{1}{2}" /> m². Jika panjang kebun tersebut{" "}
      <M math="12\dfrac{1}{2}" /> m, tentukan lebarnya!
    </p>
  </div>
);

/* ── Soal 5 — distribusi beras ───────────────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sebuah gudang menyimpan 72 kg beras untuk didistribusikan ke beberapa keluarga.
      Setiap keluarga mendapat <M math="2\dfrac{2}{5}" /> kg beras.
      Berapa keluarga yang dapat menerima jatah beras tersebut?
    </p>
  </div>
);

/* ── Soal 6 — tiang pagar ────────────────────────────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Di sepanjang tepi sungai yang panjangnya 360 meter akan dipasangi tiang pagar.
      Jarak antara dua buah tiang pagar adalah <M math="7\dfrac{1}{2}" /> meter.
      Berapa banyak tiang pagar yang diperlukan untuk kebutuhan tersebut?
    </p>
  </div>
);

/* ── Soal 7 — perkalian dan pembagian ────────────────── */
const SoalTujuh = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Sederhanakan perkalian dan pembagian pecahan-pecahan berikut!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
      {[
        { l: "a", math: "\\dfrac{3}{4} \\times \\left(-\\dfrac{4}{9}\\right)" },
        { l: "b", math: "-6 : \\dfrac{15}{8}" },
        { l: "c", math: "-\\dfrac{5}{8} \\times \\left(-\\dfrac{4}{15}\\right)" },
        { l: "d", math: "-4\\dfrac{2}{3} : \\left(-1\\dfrac{3}{4}\\right)" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-2 bg-teal-500/5 border border-teal-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
          <M math={math} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 8 — operasi kompleks ───────────────────────── */
const SoalDelapan = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hitunglah hasil operasi pecahan berikut!
    </p>
    <div className="space-y-3 pl-1">
      {[
        { l: "a", math: "\\left(-\\dfrac{1}{3} + \\dfrac{1}{2}\\right) \\times \\left(-\\dfrac{2}{5} - \\dfrac{1}{10}\\right)" },
        { l: "b", math: "\\left(-\\dfrac{2}{3} - \\dfrac{3}{4}\\right) : \\left[\\dfrac{1}{3} - \\left(-\\dfrac{1}{6}\\right)\\right]" },
        { l: "c", math: "-1\\dfrac{5}{6} + \\dfrac{2}{5} \\times \\left(-4\\dfrac{1}{2}\\right) + 3\\dfrac{3}{4}" },
        { l: "d", math: "3\\dfrac{1}{2} \\times \\left(-4\\dfrac{4}{7}\\right) + 6\\dfrac{3}{8} : 1\\dfrac{7}{16} - 8\\dfrac{3}{14}" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-start gap-2 bg-indigo-500/5 border border-indigo-500/15 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
          <span className="text-sm leading-loose"><M math={math} /></span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Penyederhanaan", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Operasi Campuran", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Kontekstual", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Kontekstual", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/40 to-green-900/25", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-green-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Kontekstual", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Kontekstual", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Perkalian & Pembagian", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    gradient: "from-teal-900/40 to-cyan-900/25", border: "border-teal-500/25",
    bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
    custom: <SoalTujuh />,
  },
  {
    num: 8, tag: "Operasi Kompleks", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalDelapan />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const PembagianPecahanPage = () => {
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
            <span className="text-[11px] text-indigo-300"><InlineMath math="\dfrac{a}{b}\div\dfrac{c}{d}" /></span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(129,140,248,0.5)' }}>
            PEMBAGIAN PECAHAN
            <br />
            <span className="text-indigo-300">DAN SIFAT OPERASINYA</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Pecahan · {t('practice.breadcrumb')}</p>
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/bilangan-rasional"); }}
            className="text-sm text-white/30 hover:text-indigo-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pecahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembagianPecahanPage;
