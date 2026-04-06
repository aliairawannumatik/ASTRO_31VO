import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const M = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

const NumBadge = ({ n, color }: { n: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 font-body ${color}`}>
    {n}
  </span>
);

/* ── Soal A ── Model Matematika ────────────────────────── */
const SoalA = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Untuk soal nomor 1 sampai dengan nomor 4, buatlah{" "}
      <span className="text-lime-300 font-semibold">model matematikanya</span>!
    </p>

    {/* Soal 1 */}
    <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="1" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Jumlah tiga bilangan bulat <span className="text-lime-300 font-semibold">genap</span> yang berurutan
          adalah <span className="text-lime-300 font-semibold">72</span>.{" "}
          <span className="text-white/50 italic">(Misalkan bilangan genap pertama adalah <M math="n" />).</span>
        </p>
      </div>
    </div>

    {/* Soal 2 */}
    <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="2" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Harga sebuah <span className="text-lime-300 font-semibold">penggaris</span> lebih murah{" "}
          <span className="text-lime-300 font-semibold">Rp3.000</span> dari harga sebuah{" "}
          <span className="text-lime-300 font-semibold">buku gambar</span>. Harga 5 penggaris dan 2 buku gambar
          seluruhnya adalah <span className="text-lime-300 font-semibold">Rp33.000</span>.{" "}
          <span className="text-white/50 italic">(Misalkan harga sebuah buku gambar = <M math="x" /> rupiah).</span>
        </p>
      </div>
    </div>

    {/* Soal 3 */}
    <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="3" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Uang <span className="text-lime-300 font-semibold">Kakak</span> adalah{" "}
          <span className="text-lime-300 font-semibold">5 kali</span> uang{" "}
          <span className="text-lime-300 font-semibold">Adik</span>. Jumlah uang Kakak dan Adik adalah{" "}
          <span className="text-lime-300 font-semibold">Rp180.000</span>.{" "}
          <span className="text-white/50 italic">(Misalkan uang Adik = <M math="q" /> rupiah).</span>
        </p>
      </div>
    </div>

    {/* Soal 4 */}
    <div className="bg-lime-500/5 border border-lime-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="4" color="bg-lime-500/30 text-lime-200 border border-lime-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Panjang sebuah <span className="text-lime-300 font-semibold">persegi panjang</span> lebih{" "}
          <span className="text-lime-300 font-semibold">8 cm</span> dari tiga kali lebarnya.
          Keliling persegi panjang tersebut adalah{" "}
          <span className="text-lime-300 font-semibold">64 cm</span>.{" "}
          <span className="text-white/50 italic">(Misalkan lebar persegi panjang = <M math="y" /> cm).</span>
        </p>
      </div>
    </div>
  </div>
);

/* ── Soal B ── Penyelesaian Lengkap ────────────────────── */
const SoalB = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Untuk soal-soal berikut, jawablah dengan{" "}
      <span className="text-green-300 font-semibold">selengkapnya</span>!
    </p>

    {/* Soal 5 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-2">
      <div className="flex items-start gap-2.5">
        <NumBadge n="5" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <div className="space-y-2">
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Jumlah tiga bilangan <span className="text-green-300 font-semibold">ganjil</span> yang berurutan
            adalah <span className="text-green-300 font-semibold">99</span>.
          </p>
          <div className="flex flex-wrap gap-2 pl-1">
            {[
              { l: "a", t: "Jika bilangan pertama adalah n, nyatakan bilangan kedua dan ketiga dalam n!" },
              { l: "b", t: "Tentukan bilangan-bilangan tersebut!" },
            ].map(({ l, t }) => (
              <div key={l} className="flex items-start gap-2 bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-2 w-full">
                <span className="text-green-400 font-bold text-xs mt-0.5 shrink-0">{l}.</span>
                <span className="font-body text-xs text-white/70 leading-relaxed">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Soal 6 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="6" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Harga sebuah <span className="text-green-300 font-semibold">tablet</span> adalah{" "}
          <span className="text-green-300 font-semibold">4 kali</span> harga sebuah{" "}
          <span className="text-green-300 font-semibold">speaker</span>. Harga 3 buah speaker dan 2 buah tablet
          seluruhnya adalah <span className="text-green-300 font-semibold">Rp6.600.000</span>.{" "}
          <span className="text-white/50 italic">(Misalkan harga sebuah speaker = <M math="s" /> rupiah).</span>{" "}
          Berapakah harga sebuah tablet?
        </p>
      </div>
    </div>

    {/* Soal 7 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="7" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Jumlah tiga buah bilangan bulat adalah{" "}
          <span className="text-green-300 font-semibold">84</span>.
          Bilangan pertama adalah <span className="text-green-300 font-semibold">2 kali</span> bilangan kedua,
          dan bilangan kedua <span className="text-green-300 font-semibold">5 lebihnya</span> dari bilangan
          ketiga. Tentukan ketiga bilangan tersebut masing-masing!
        </p>
      </div>
    </div>

    {/* Soal 8 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="8" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Harga sebuah <span className="text-green-300 font-semibold">spidol</span> lebih mahal{" "}
          <span className="text-green-300 font-semibold">Rp4.000</span> dari harga sebuah{" "}
          <span className="text-green-300 font-semibold">pulpen</span>. Harga 3 spidol dan 5 pulpen
          seluruhnya adalah <span className="text-green-300 font-semibold">Rp48.000</span>.
          Berapakah harga 2 buah spidol?
        </p>
      </div>
    </div>

    {/* Soal 9 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="9" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Selembar papan berbentuk <span className="text-green-300 font-semibold">persegi panjang</span> dengan
          ukuran <span className="text-green-300 font-semibold">40 cm × 25 cm</span>. Bagian tepi papan dipotong
          selebar <M math="x" /> cm dari masing-masing sisi. Jika keliling papan yang sudah dipotong adalah{" "}
          <span className="text-green-300 font-semibold">88 cm</span>, tentukan lebar pemotongan yang dilakukan!
        </p>
      </div>
    </div>

    {/* Soal 10 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="10" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          <span className="text-green-300 font-semibold">Dani</span>,{" "}
          <span className="text-green-300 font-semibold">Eka</span>, dan{" "}
          <span className="text-green-300 font-semibold">Fani</span> mengumpulkan kelereng. Eka mengumpulkan{" "}
          <span className="text-green-300 font-semibold">3 kali</span> kelereng Fani. Jumlah kelereng Dani dan
          Eka adalah <span className="text-green-300 font-semibold">5 kali</span> kelereng Fani. Di antara
          mereka bertiga, siapakah yang mengumpulkan kelereng paling banyak?
        </p>
      </div>
    </div>

    {/* Soal 11 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-2">
      <div className="flex items-start gap-2.5">
        <NumBadge n="11" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <div className="space-y-2">
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Sebuah <span className="text-green-300 font-semibold">kolam renang</span> berbentuk persegi panjang
            dengan ukuran lebarnya{" "}
            <span className="text-green-300 font-semibold">8 m kurang</span> dari panjangnya. Keliling kolam
            tersebut adalah <span className="text-green-300 font-semibold">48 m</span>.
          </p>
          <div className="flex flex-wrap gap-2 pl-1">
            {[
              { l: "a", t: "Tentukan panjang dan lebar kolam renang tersebut!" },
              { l: "b", t: "Tentukan luas kolam renang tersebut!" },
            ].map(({ l, t }) => (
              <div key={l} className="flex items-start gap-2 bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-2 w-full">
                <span className="text-green-400 font-bold text-xs mt-0.5 shrink-0">{l}.</span>
                <span className="font-body text-xs text-white/70 leading-relaxed">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Soal 12 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="12" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Umur <span className="text-green-300 font-semibold">Rian</span> sekarang{" "}
          <span className="text-green-300 font-semibold">25 tahun lebih muda</span> dari umur{" "}
          <span className="text-green-300 font-semibold">Pamannya</span>. Sepuluh tahun yang akan datang,
          jumlah umur keduanya adalah{" "}
          <span className="text-green-300 font-semibold">65 tahun</span>.
          Berapa umur Paman dan Rian sekarang?
        </p>
      </div>
    </div>

    {/* Soal 13 */}
    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 space-y-1.5">
      <div className="flex items-start gap-2.5">
        <NumBadge n="13" color="bg-green-500/25 text-green-200 border border-green-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Seorang pedagang memiliki{" "}
          <span className="text-green-300 font-semibold">24 keping</span> uang logam yang terdiri dari
          koin <span className="text-green-300 font-semibold">Rp1.000</span> dan koin{" "}
          <span className="text-green-300 font-semibold">Rp2.000</span>. Nilai total seluruh uang logam
          tersebut adalah <span className="text-green-300 font-semibold">Rp37.000</span>.
          Tentukan banyak masing-masing koin!
        </p>
      </div>
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Membuat Model Matematika", tagColor: "bg-lime-500/20 text-lime-300 border-lime-400/40",
    gradient: "from-lime-900/50 to-green-900/30", border: "border-lime-500/25",
    bar: "from-lime-400 to-green-500", numBg: "bg-lime-500/30 text-lime-200",
    custom: <SoalA />,
  },
  {
    num: 2, tag: "Penerapan Persamaan pada Soal Cerita", tagColor: "bg-green-500/20 text-green-300 border-green-400/40",
    gradient: "from-green-900/50 to-teal-900/30", border: "border-green-500/25",
    bar: "from-green-400 to-teal-500", numBg: "bg-green-500/30 text-green-200",
    custom: <SoalB />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const ModelMatematikaPLSVPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-500/20 to-green-500/10 border border-lime-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">📝</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(132,204,22,0.5)' }}
          >
            MODEL MATEMATIKA DAN
          </h1>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(132,204,22,0.5)' }}
          >
            PENERAPAN PERSAMAAN
          </h1>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(132,204,22,0.5)' }}
          >
            PADA SOAL CERITA
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · PLSV & PtLSV · Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">13 Soal</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-lime-500/10 border border-lime-400/20 text-lime-400 font-body">✦ Kelas 7</span>
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
            className="text-sm text-white/30 hover:text-lime-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMatematikaPLSVPage;
