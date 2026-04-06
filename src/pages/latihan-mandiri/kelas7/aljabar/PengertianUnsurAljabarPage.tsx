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

/* ── Soal 1 ── Suku-suku dan suku sejenis ────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan banyak suku dan kelompok suku-suku yang sejenis dari bentuk aljabar berikut!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "3x + 7y - 5x + 2y + 9" },
        { l: "b", expr: "4p^2 - 3pq + 6p - 8p^2 + 5pq" },
        { l: "c", expr: "6m^2 - 2mn + 9n^2 + 3mn - m^2 + 4n" },
        { l: "d", expr: "2a^2b - 5ab + 3b^2 - 4a^2b + 7ab - b^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-start gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-violet-500/30 text-violet-300 border border-violet-400/40" />
          <AlgExpr math={expr} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Koefisien, variabel, konstanta ─────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Dari bentuk aljabar <InlineMath math="5x^2 - 3xy + 8y - 12" />,
      tentukan:
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", text: "Semua variabel yang ada" },
        { l: "b", text: "Koefisien dari setiap suku yang memuat variabel" },
        { l: "c", text: "Nilai konstantanya" },
        { l: "d", text: "Banyaknya suku seluruhnya" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Soal cerita: kantong kelereng ─────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Dari gambar berikut, setiap kotak berisi <strong className="text-cyan-300">n</strong> buah
      kelereng. Di atas meja terdapat <strong className="text-cyan-300">3 kotak penuh</strong> dan{" "}
      <strong className="text-cyan-300">5 kelereng lepas</strong>.
    </p>
    <div className="pl-1 flex items-center gap-3 flex-wrap">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-12 h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
            <span className="text-cyan-300 font-bold text-sm font-body">n</span>
          </div>
        ))}
      </div>
      <span className="text-white/40 text-sm">+</span>
      <div className="flex gap-1 flex-wrap">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-cyan-400/25 border border-cyan-300/30" />
        ))}
      </div>
    </div>
    <div className="space-y-1.5 pl-1">
      {[
        { l: "a", text: "Nyatakan total kelereng di atas meja dalam bentuk aljabar!" },
        { l: "b", text: "Jika 2 kotak lagi ditambahkan, tuliskan bentuk aljabar barunya!" },
        { l: "c", text: "Jika n = 12, berapa total kelereng pada keadaan (a) dan (b)?" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Suku Sejenis", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Unsur Aljabar", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Soal Cerita", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const PengertianUnsurAljabarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🔣</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(167,139,250,0.5)' }}
          >
            PENGERTIAN DAN UNSUR-UNSUR
            <br />
            <span className="text-violet-300">BENTUK ALJABAR</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">3 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-400 font-body">✦ Kelas 7</span>
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
            className="text-sm text-white/30 hover:text-violet-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianUnsurAljabarPage;
