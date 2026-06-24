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

const M = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

/* ── Soal 1 ── Tabel Kalimat ──────────────────────────── */
const SoalSatu = () => {
  const rows = [
    { l: "a", terbuka: <span>□ + 5 = 13</span>,        contoh_benar: "8 + 5 = 13",  contoh_salah: "3 + 5 = 13",  pv: "8" },
    { l: "b", terbuka: <span>▽ ÷ 6 = 4</span>,         contoh_benar: "24 ÷ 6 = 4",  contoh_salah: "18 ÷ 6 = 4",  pv: "24" },
    { l: "c", terbuka: <span><M math="m + m = 3m" /></span>, contoh_benar: "–",       contoh_salah: "0 + 0 = 0",    pv: "–" },
    { l: "d", terbuka: <span><M math="y" /> faktor dari 24</span>, contoh_benar: "4 faktor dari 24", contoh_salah: "5 faktor dari 24", pv: "1, 2, 3, 4, 6, 8, 12, 24" },
    { l: "e", terbuka: <span><M math="(-x)^3 = -27" /></span>, contoh_benar: "(-3)³ = -27", contoh_salah: "(-2)³ = -27", pv: "3" },
    { l: "f", terbuka: <span><M math="p \times p < 15" /></span>, contoh_benar: "3 × 3 = 9 < 15", contoh_salah: "4 × 4 = 16 ≮ 15", pv: "1, 2, 3" },
  ];

  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        Salinlah tabel berikut, kemudian lengkapilah isinya!
      </p>
      <div className="overflow-x-auto rounded-xl border border-orange-500/20">
        <table className="w-full text-xs font-body">
          <thead>
            <tr className="bg-orange-500/20">
              <th className="px-2 py-2 text-orange-300 font-bold text-left w-6"> </th>
              <th className="px-3 py-2 text-orange-300 font-bold text-left">Kalimat terbuka</th>
              <th className="px-3 py-2 text-orange-300 font-bold text-left">Kalimat benar</th>
              <th className="px-3 py-2 text-orange-300 font-bold text-left">Kalimat salah</th>
              <th className="px-3 py-2 text-orange-300 font-bold text-left">Pengganti variabel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.l} className={i % 2 === 0 ? "bg-orange-500/5" : "bg-transparent"}>
                <td className="px-2 py-2.5 text-orange-400 font-bold">{r.l}.</td>
                <td className="px-3 py-2.5 text-white/85">{r.terbuka}</td>
                <td className="px-3 py-2.5">
                  <div className="h-5 border-b border-dashed border-orange-400/20 min-w-[80px]" />
                </td>
                <td className="px-3 py-2.5">
                  <div className="h-5 border-b border-dashed border-orange-400/20 min-w-[80px]" />
                </td>
                <td className="px-3 py-2.5">
                  <div className="h-5 border-b border-dashed border-orange-400/20 min-w-[80px]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Soal 2 ── Identifikasi kalimat ───────────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Di antara kalimat-kalimat berikut, manakah yang merupakan <span className="text-amber-300 font-semibold">kalimat terbuka</span>,{" "}
      <span className="text-emerald-300 font-semibold">kalimat benar</span>, dan{" "}
      <span className="text-rose-300 font-semibold">kalimat salah</span>?
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", text: <span><M math="n" /> adalah bilangan prima antara 15 dan 30.</span> },
        { l: "b", text: <span>Jumlah hari dalam bulan November adalah 30 hari.</span> },
        { l: "c", text: <span>Hasil kali dua bilangan positif selalu positif.</span> },
        { l: "d", text: <span>Jika sebuah toko buka selama <M math="x" /> jam sehari, total jam buka dalam seminggu adalah <M math="7x" />.</span> },
        { l: "e", text: <span>Luas persegi dengan sisi <M math="s" /> adalah <M math="s^2" />.</span> },
        { l: "f", text: <span><M math="6 \times 7 = 45" /></span> },
        { l: "g", text: <span><M math="p" /> adalah kelipatan 6 yang kurang dari 40.</span> },
        { l: "h", text: <span>Jika <M math="y = -3" />, maka nilai <M math="(-y)^2 = -9" />.</span> },
        { l: "i", text: <span>Jika <M math="(-4)^n = 16" />, maka <M math="n" /> adalah bilangan ganjil.</span> },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Tentukan pengganti variabel ────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan pengganti dari variabel berikut sehingga menjadi kalimat benar!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", text: <span>Satu tahun ada <M math="n" /> bulan.</span> },
        { l: "b", text: <span><M math="y" /> adalah bilangan ganjil, kelipatan 5, yang kurang dari 30.</span> },
        { l: "c", text: <span><M math="z" /> adalah bilangan bulat antara 18 dan 32 yang habis dibagi 5.</span> },
        { l: "d", text: <span><M math="p" /> adalah faktor dari 18.</span> },
        { l: "e", text: <span><M math="q \times 5 = 40" />, <M math="q" /> adalah bilangan bulat.</span> },
        { l: "f", text: <span><M math="n" /> adalah bilangan prima genap.</span> },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-yellow-500/20 text-yellow-300 border border-yellow-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Penyelesaian dari {3, 4, 9, 15, 20} ───── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan penyelesaian dari setiap kalimat terbuka berikut dengan variabel pada bilangan{" "}
      <span className="text-lime-300 font-bold font-body">3, 4, 9, 15, 20</span>!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", text: <span><M math="(x + 3)" /> lebih dari 12.</span> },
        { l: "b", text: <span><M math="(y - 1)" /> tidak lebih dari 8.</span> },
        { l: "c", text: <span><M math="\dfrac{z}{3}" /> lebih dari 2.</span> },
        { l: "d", text: <span><M math="2 \times n" /> adalah bilangan kuadrat sempurna.</span> },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5 bg-lime-500/5 border border-lime-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-lime-500/20 text-lime-300 border border-lime-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ── Penyelesaian dari {1, 2, …, 12} ────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan penyelesaian dari setiap kalimat terbuka berikut dengan variabel pada bilangan{" "}
      <span className="text-green-300 font-bold font-body">1, 2, 3, …, 12</span>!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", text: <span><M math="4 \times x < 25" />, <M math="x" /> faktor dari 20.</span> },
        { l: "b", text: <span><M math="(y \times y) < 50" />.</span> },
        { l: "c", text: <span><M math="5 \times m = 3m + 10" />.</span> },
        { l: "d", text: <span><M math="3 \times n = n + 16" />.</span> },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-start gap-2.5 bg-green-500/5 border border-green-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-green-500/20 text-green-300 border border-green-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Tabel Kalimat", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/50 to-amber-900/30", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Identifikasi Kalimat", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/40 to-yellow-900/25", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Pengganti Variabel", tagColor: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
    gradient: "from-yellow-900/40 to-lime-900/25", border: "border-yellow-500/25",
    bar: "from-yellow-400 to-lime-500", numBg: "bg-yellow-500/30 text-yellow-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Himpunan {3, 4, 9, 15, 20}", tagColor: "bg-lime-500/20 text-lime-300 border-lime-400/40",
    gradient: "from-lime-900/40 to-green-900/25", border: "border-lime-500/25",
    bar: "from-lime-400 to-green-500", numBg: "bg-lime-500/30 text-lime-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Himpunan {1, 2, …, 12}", tagColor: "bg-green-500/20 text-green-300 border-green-400/40",
    gradient: "from-green-900/40 to-teal-900/25", border: "border-green-500/25",
    bar: "from-green-400 to-teal-500", numBg: "bg-green-500/30 text-green-200",
    custom: <SoalLima />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const KalimatTerbukaTertutupPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">💬</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(251,146,60,0.5)' }}
          >
            KALIMAT TERBUKA DAN TERTUTUP
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-1">(Pernyataan)</p>
          <p className="text-white/40 text-xs text-center font-body mt-1">Kelas 7 · PLSV & PtLSV · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">5 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/20 text-orange-400 font-body">✦ Kelas 7</span>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
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
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-white/30 hover:text-orange-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default KalimatTerbukaTertutupPage;
