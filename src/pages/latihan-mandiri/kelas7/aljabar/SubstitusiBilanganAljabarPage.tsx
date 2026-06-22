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

/* ── Soal 1 ── Satu variabel (k = -3) ────────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan nilai masing-masing bentuk aljabar berikut jika{" "}
      <AlgExpr math="k = -3" />!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "5k^2 - 2k" },
        { l: "b", expr: "(-4k)^2" },
        { l: "c", expr: "(k + 7)^2" },
        { l: "d", expr: "-2k^3 + 6k" },
        { l: "e", expr: "k^2 - (k - 5)^2" },
        { l: "f", expr: "3k^2 + 4k - 9" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-sky-500/5 border border-sky-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-sky-500/30 text-sky-300 border border-sky-400/40" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Dua variabel ───────────────────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan nilai bentuk aljabar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "p^2 - 6p", keterangan: "untuk p = -4" },
        { l: "b", expr: "3m + 2m^2q", keterangan: "untuk m = 5 dan q = -2" },
        { l: "c", expr: "4r^2 - 3r^2s", keterangan: "untuk r = -3 dan s = 2" },
        { l: "d", expr: "x^3y - 2x^2y^2", keterangan: "untuk x = 2 dan y = -3" },
      ].map(({ l, expr, keterangan }) => (
        <div key={l} className="flex items-start gap-2.5 bg-teal-500/5 border border-teal-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
          <div className="flex flex-col gap-0.5">
            <AlgExpr math={expr} />
            <span className="text-teal-300/50 text-[11px] font-body">{keterangan}</span>
          </div>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0 pt-0.5">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Tiga variabel (a=-2, b=3, c=-4) ────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Jika <AlgExpr math="a = -2" />, <AlgExpr math="b = 3" />, dan{" "}
      <AlgExpr math="c = -4" />, hitunglah nilai dari bentuk-bentuk aljabar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "3ab - 2bc + 5ac" },
        { l: "b", expr: "(ab + c^2)^2" },
        { l: "c", expr: "a^2b - b^2c + c^2a" },
        { l: "d", expr: "3a(b^2 - 2c^2 + bc)" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Persegi panjang aljabar ───────────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Perhatikan persegi panjang berikut!
    </p>
    <div className="flex justify-center pl-1">
      <svg width="200" height="110" viewBox="0 0 200 110">
        <rect x={12} y={14} width={176} height={78} rx={6}
          fill="#38bdf8" fillOpacity={0.07} stroke="#38bdf8" strokeWidth={1.6} />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i}
            x1={12 + i * 19} y1={14} x2={12 + i * 19 - 12} y2={92}
            stroke="#38bdf8" strokeWidth={0.5} strokeOpacity={0.15} />
        ))}
        <text x={100} y={10} textAnchor="middle" fill="#7dd3fc" fontSize={10} fontFamily="monospace">3x + 1</text>
        <text x={196} y={56} textAnchor="middle" fill="#7dd3fc" fontSize={10}
          fontFamily="monospace" transform="rotate(90,196,56)">2y − 3</text>
      </svg>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Tentukan keliling dan luas persegi panjang di atas dinyatakan dalam x dan y!" },
        { l: "b", text: "Hitunglah keliling dan luas persegi panjang tersebut jika x = 3 dan y = 4!" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-sky-500/20 text-sky-300 border border-sky-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ── Tiga variabel m, n, p ─────────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Jika <AlgExpr math="m = 4" />, <AlgExpr math="n = -3" />, dan{" "}
      <AlgExpr math="p = -2" />, tentukan nilai dari bentuk aljabar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "5m^2 - 6mn + 8n^2" },
        { l: "b", expr: "14mn - 3mp + 10n^2 - 8np" },
        { l: "c", expr: "6m^2p - 4m^2n + 2mp^2" },
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

/* ── Soal 6 ── Kontekstual: ketinggian bola ──────────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <div className="flex gap-3 items-start">
      <div className="flex-1">
        <p className="font-body text-sm text-white/90 leading-relaxed">
          Sebuah bola dilontarkan ke atas dari sebuah gedung dan mencapai ketinggian{" "}
          <AlgExpr math="h" /> meter setelah <AlgExpr math="t" /> detik. Jika ketinggian
          bola dirumuskan dengan <AlgExpr math="h = 5t^2 - 8t + 3" />, tentukan
          ketinggian bola setelah <strong className="text-white">5 detik</strong> dilontarkan!
        </p>
      </div>
      <div className="shrink-0">
        <svg width="60" height="90" viewBox="0 0 60 90">
          <rect x={22} y={40} width={16} height={45} rx={2}
            fill="#6366f1" fillOpacity={0.25} stroke="#818cf8" strokeWidth={1} />
          <rect x={10} y={30} width={40} height={12} rx={2}
            fill="#6366f1" fillOpacity={0.35} stroke="#818cf8" strokeWidth={1} />
          <circle cx={30} cy={10} r={8}
            fill="#fbbf24" fillOpacity={0.7} stroke="#fcd34d" strokeWidth={1.5} />
          <line x1={30} y1={18} x2={30} y2={30}
            stroke="#fcd34d" strokeWidth={1} strokeDasharray="2,2" />
          <text x={30} y={83} textAnchor="middle" fill="#818cf8" fontSize={7} fontFamily="monospace">gedung</text>
        </svg>
      </div>
    </div>
  </div>
);

/* ── Soal 7 ── Kontekstual: berat muatan kapal ───────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <div className="flex gap-3 items-start">
      <div className="flex-1">
        <p className="font-body text-sm text-white/90 leading-relaxed">
          Sebuah kapal kargo mengangkut <AlgExpr math="x" /> ton beras dan{" "}
          <AlgExpr math="(3x - 5)" /> ton gula sehingga berat muatan seluruhnya{" "}
          <AlgExpr math="W" /> ton.
        </p>
        <div className="space-y-1.5 pl-1 mt-2.5">
          {[
            { l: "a", text: "Nyatakan W dalam x, kemudian sederhanakanlah!" },
            { l: "b", text: "Jika x = 8, hitunglah nilai W!" },
          ].map(({ l, text }) => (
            <div key={l} className="flex items-start gap-2.5">
              <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
              <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="shrink-0">
        <svg width="80" height="60" viewBox="0 0 80 60">
          <rect x={5} y={28} width={70} height={24} rx={3}
            fill="#059669" fillOpacity={0.2} stroke="#34d399" strokeWidth={1.2} />
          <polygon points="5,52 10,58 70,58 75,52"
            fill="#059669" fillOpacity={0.35} stroke="#34d399" strokeWidth={1} />
          <rect x={20} y={18} width={40} height={12} rx={2}
            fill="#059669" fillOpacity={0.25} stroke="#34d399" strokeWidth={1} />
          <text x={40} y={44} textAnchor="middle" fill="#6ee7b7" fontSize={7} fontFamily="monospace">KARGO</text>
        </svg>
      </div>
    </div>
  </div>
);

/* ── Soal 8 ── Pola bilangan dengan substitusi ────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Suatu pola bilangan ke-<AlgExpr math="n" /> dinyatakan dengan rumus{" "}
      <AlgExpr math="U_n = 3n^2 - 2n + 5" />.
    </p>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Tentukan suku ke-4 dari pola bilangan tersebut!" },
        { l: "b", text: "Tentukan suku ke-7 dari pola bilangan tersebut!" },
        { l: "c", text: "Jika nilai suatu suku adalah 128, tentukan n-nya!" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Satu Variabel", tagColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    gradient: "from-sky-900/50 to-cyan-900/30", border: "border-sky-500/25",
    bar: "from-sky-400 to-cyan-500", numBg: "bg-sky-500/30 text-sky-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Dua Variabel", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    gradient: "from-teal-900/40 to-emerald-900/25", border: "border-teal-500/25",
    bar: "from-teal-400 to-emerald-500", numBg: "bg-teal-500/30 text-teal-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Tiga Variabel", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/40 to-purple-900/25", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Bangun Datar", tagColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    gradient: "from-sky-900/40 to-blue-900/25", border: "border-sky-500/25",
    bar: "from-sky-400 to-blue-500", numBg: "bg-sky-500/30 text-sky-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Multi Variabel", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Kontekstual", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/35 to-orange-900/20", border: "border-amber-500/25",
    bar: "from-amber-400 to-orange-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Soal Cerita", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/40 to-teal-900/25", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-teal-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalTujuh />,
  },
  {
    num: 8, tag: "Pola Bilangan", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalDelapan />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const SubstitusiBilanganAljabarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-500/10 border border-sky-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🔁</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(56,189,248,0.5)' }}
          >
            SUBSTITUSI BILANGAN PADA BENTUK ALJABAR
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · Tugas - Latihan Mandiri</p>
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/aljabar"); }}
            className="text-sm text-white/30 hover:text-sky-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubstitusiBilanganAljabarPage;
