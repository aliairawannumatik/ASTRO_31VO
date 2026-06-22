import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
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
      Hitunglah jumlah bilangan-bilangan desimal berikut!
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        { l: "a", text: "7,43 dan 15,6" },
        { l: "b", text: "124,8 dan 53,07" },
        { l: "c", text: "2,34; 11,9; dan 5,08" },
        { l: "d", text: "62,5; 14,37; dan 3,208" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-center gap-3 bg-green-500/5 border border-green-500/15 rounded-lg px-4 py-2.5">
          <SubLabel letter={l} color="bg-green-500/20 text-green-300 border border-green-400/30" />
          <p className="font-body text-sm text-white/80">{text}</p>
          <span className="text-green-300/30 text-xs ml-auto font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ───────────────────────────────────────────── */
const SoalDua = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Hitunglah selisih bilangan-bilangan desimal berikut!
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        { l: "a", text: "27,54 dikurangi 13,8" },
        { l: "b", text: "8,005 dikurangi 3,47" },
        { l: "c", text: "50,3 dikurangi 22,68" },
        { l: "d", text: "100 dikurangi 34,275" },
      ].map(({ l, text }) => (
        <div key={l} className="flex items-center gap-3 bg-rose-500/5 border border-rose-500/15 rounded-lg px-4 py-2.5">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <p className="font-body text-sm text-white/80">{text}</p>
          <span className="text-rose-300/30 text-xs ml-auto font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ───────────────────────────────────────────── */
const SoalTiga = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Selesaikan operasi campuran penjumlahan dan pengurangan desimal berikut!
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        { l: "a", math: "0{,}724 + 0{,}651 - 0{,}839" },
        { l: "b", math: "23{,}07 - 14{,}5 + 9{,}328" },
        { l: "c", math: "47{,}3 - 12{,}86 - 8{,}054" },
        { l: "d", math: "5{,}2 + 11{,}045 - 7{,}63 + 1{,}9" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-3 bg-cyan-500/5 border border-cyan-500/15 rounded-lg px-4 py-2.5">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <InlineMath math={math} />
          <span className="text-cyan-300/30 text-xs ml-auto font-body">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ───────────────────────────────────────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Dari angka-angka <strong className="text-white">2, 5, 7, 4,</strong> dan <strong className="text-white">9</strong> dibuat bilangan desimal dua angka di belakang koma dengan setiap angka digunakan tepat satu kali.
    </p>
    <div className="space-y-2 pl-1">
      {[
        { letter: "a", text: "Tentukan bilangan desimal terbesar yang dapat dibentuk!" },
        { letter: "b", text: "Tentukan bilangan desimal terkecil yang dapat dibentuk!" },
        { letter: "c", text: "Hitunglah selisih antara bilangan desimal terbesar dan terkecil tersebut!" },
      ].map(({ letter, text }) => (
        <div key={letter} className="flex items-start gap-2.5 bg-violet-500/5 border border-violet-500/15 rounded-lg px-4 py-2.5">
          <SubLabel letter={letter} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ───────────────────────────────────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Isilah titik-titik berikut dengan bilangan desimal yang tepat!
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        { l: "a", math: "\\ldots + 4{,}37 = 10{,}5" },
        { l: "b", math: "8{,}9 - \\ldots = 3{,}25" },
        { l: "c", math: "\\ldots + 6{,}08 + 1{,}4 = 15{,}0" },
        { l: "d", math: "12{,}6 - \\ldots - 2{,}45 = 5{,}7" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-2.5">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <InlineMath math={math} />
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 6 ───────────────────────────────────────────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan nilai <InlineMath math="n" /> yang memenuhi persamaan berikut!
    </p>
    <div className="grid grid-cols-2 gap-3 pl-1">
      {[
        { l: "a", math: "n + 3{,}8 = 9{,}15" },
        { l: "b", math: "n - 2{,}47 = 6{,}3" },
        { l: "c", math: "7{,}2 + n = 12{,}05" },
        { l: "d", math: "15{,}6 - n = 8{,}74" },
      ].map(({ l, math }) => (
        <div key={l} className="flex items-center gap-3 bg-sky-500/5 border border-sky-500/15 rounded-lg px-4 py-2.5">
          <SubLabel letter={l} color="bg-sky-500/20 text-sky-300 border border-sky-400/30" />
          <InlineMath math={math} />
          <span className="text-sky-300/30 text-xs ml-auto">n = …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 7 ───────────────────────────────────────────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Selesaikan soal cerita berikut!
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        {
          letter: "a",
          text: "Sebuah tali memiliki panjang 8,5 meter. Tali itu dipotong sepanjang 3,75 meter untuk membuat jaring. Kemudian disambung lagi tali baru sepanjang 2,4 meter. Berapa meter panjang tali sekarang?",
        },
        {
          letter: "b",
          text: "Suhu di puncak gunung pada pagi hari adalah −2,8°C. Menjelang siang suhu naik 7,35°C, namun pada malam hari turun kembali 5,6°C. Berapakah suhu pada malam hari?",
        },
        {
          letter: "c",
          text: "Sebuah ember berisi 15,6 liter air. Diambil 4,75 liter untuk mencuci, lalu diisi lagi 3,2 liter. Berapa liter air yang ada di dalam ember sekarang?",
        },
      ].map(({ letter, text }) => (
        <div key={letter} className="flex items-start gap-2.5 bg-teal-500/5 border border-teal-500/15 rounded-lg px-4 py-3">
          <SubLabel letter={letter} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 8 ───────────────────────────────────────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Lakukan pengukuran atau pencarian data, lalu selesaikan dengan operasi penjumlahan dan pengurangan desimal!
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        {
          letter: "a",
          text: "Ukurlah panjang meja belajarmu, lebar jendela kamarmu, dan tinggi kursimu (dalam meter). Hitunglah jumlah dan selisih dari dua pengukuran mana saja!",
        },
        {
          letter: "b",
          text: "Catat harga tiga makanan yang kamu beli hari ini (dalam puluhan ribu rupiah). Nyatakan dalam desimal, lalu hitung total pengeluaran dan kembaliannya dari uang Rp50.000!",
        },
        {
          letter: "c",
          text: "Lihat laporan cuaca di kotamu selama 3 hari terakhir. Catat suhu tertinggi dan terendah setiap hari. Hitunglah selisih suhu tertinggi dan terendah rata-ratanya!",
        },
      ].map(({ letter, text }) => (
        <div key={letter} className="flex items-start gap-2.5 bg-fuchsia-500/5 border border-fuchsia-500/15 rounded-lg px-4 py-3">
          <SubLabel letter={letter} color="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30" />
          <p className="font-body text-sm text-white/80 leading-relaxed pt-0.5">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Penjumlahan", tagColor: "bg-green-500/20 text-green-300 border-green-400/40",
    gradient: "from-green-900/50 to-emerald-900/30", border: "border-green-500/25",
    bar: "from-green-400 to-emerald-500", numBg: "bg-green-500/30 text-green-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Pengurangan", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Operasi Campuran", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Eksplorasi", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/40 to-purple-900/25", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Melengkapi", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Nilai n", tagColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    gradient: "from-sky-900/40 to-blue-900/25", border: "border-sky-500/25",
    bar: "from-sky-400 to-blue-500", numBg: "bg-sky-500/30 text-sky-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Kontekstual", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    gradient: "from-teal-900/40 to-cyan-900/25", border: "border-teal-500/25",
    bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
    custom: <SoalTujuh />,
  },
  {
    num: 8, tag: "Investigasi", tagColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
    gradient: "from-fuchsia-900/40 to-pink-900/25", border: "border-fuchsia-500/25",
    bar: "from-fuchsia-400 to-pink-500", numBg: "bg-fuchsia-500/30 text-fuchsia-200",
    custom: <SoalDelapan />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const PenjumlahanPenguranganDesimalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">➕</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(74,222,128,0.5)' }}
          >
            PENJUMLAHAN DAN PENGURANGAN
            <br />
            <span className="text-green-300">BENTUK DESIMAL</span>
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Pecahan · Tugas - Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">8 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-green-500/10 border border-green-400/20 text-green-400 font-body">✦ Kelas 7</span>
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
            className="text-sm text-white/30 hover:text-green-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Pecahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanPenguranganDesimalPage;
