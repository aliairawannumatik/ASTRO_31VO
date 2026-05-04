import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Rocket } from "lucide-react";

const accentColor = "#a78bfa";
const accentDim = "rgba(167,139,250,0.12)";
const borderColor = "rgba(167,139,250,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = { n: number; title: string; content?: string; math?: string; blockMath?: string; parts?: Part[]; badge?: Badge; type: "essay" | "mixed"; };
const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qf(1, "Soal Harga — UN Klasik", {
    badge: "UN", type: "mixed",
    content: "Harga 5 jeruk dan 3 apel = Rp 31.000. Harga 3 jeruk dan 7 apel = Rp 29.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan harga 1 jeruk dan 1 apel." },
      { label: "c.", text: "Berapa harga 4 jeruk dan 4 apel?" },
    ],
  }),
  Qf(2, "Soal Usia", {
    badge: "UN", type: "mixed",
    content: "Jumlah umur Ayah dan Anak sekarang adalah 50 tahun. Lima tahun yang lalu, umur Ayah empat kali umur Anak.",
    parts: [
      { label: "a.", text: "Misal umur Ayah = x dan umur Anak = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan SPLDV tersebut." },
      { label: "c.", text: "Tentukan umur Ayah dan Anak sekarang." },
    ],
  }),
  Qf(3, "Soal Bilangan Dua Angka", {
    badge: "UN", type: "mixed",
    content: "Suatu bilangan dua angka. Jumlah digitnya = 9. Bilangan tersebut adalah 45 lebih dari bilangan yang digitnya dibalik.",
    parts: [
      { label: "a.", text: "Misal digit puluhan = x dan satuan = y. Tuliskan bilangan asli dan bilangan hasil pembalikan." },
      { label: "b.", text: "Susun SPLDV." },
      { label: "c.", text: "Tentukan bilangan tersebut." },
    ],
  }),
  Qf(4, "Soal Keliling dan Luas", {
    badge: "ANBK", type: "mixed",
    content: "Keliling sebuah persegi panjang = 70 m. Panjangnya 5 m lebih dari lebarnya.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Tentukan panjang dan lebar." },
      { label: "c.", math: "\\text{Hitung luas persegi panjang tersebut.}" },
    ],
  }),
  Qf(5, "Soal Ayam dan Kelinci", {
    badge: "UN", type: "mixed",
    content: "Dalam sebuah kandang terdapat ayam dan kelinci. Jumlah kepala = 50 dan jumlah kaki = 160.",
    parts: [
      { label: "a.", text: "Misal ayam = x dan kelinci = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan SPLDV." },
      { label: "c.", text: "Berapa ekor ayam dan kelinci?" },
    ],
  }),
  Qf(6, "Soal Investasi", {
    badge: "TKA", type: "mixed",
    content: "Modal Rp 12.000.000 dibagi ke dua usaha. Usaha A memberikan keuntungan 10%/tahun dan usaha B memberikan 8%/tahun. Total keuntungan Rp 1.080.000.",
    parts: [
      { label: "a.", text: "Misal modal usaha A = x dan B = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa modal yang diinvestasikan ke masing-masing usaha?" },
    ],
  }),
  Qf(7, "Soal Campuran Larutan", {
    badge: "TKA", type: "mixed",
    content: "x liter larutan 40% asam dicampur dengan y liter larutan 10% asam untuk mendapatkan 15 liter larutan 30% asam.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa liter masing-masing larutan digunakan?" },
    ],
  }),
  Qf(8, "Soal Lahan Pertanian", {
    badge: "AKM", type: "mixed",
    content: "Lahan seluas 200 m² ditanami jagung dan kedelai. Keuntungan jagung Rp 30.000/m² dan kedelai Rp 20.000/m². Total keuntungan Rp 5.000.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan luas tanaman jagung dan kedelai." },
    ],
  }),
  Qf(9, "Soal Pipa Air", {
    badge: "TKA", type: "mixed",
    content: "Pipa A dapat mengisi tangki dalam x jam dan pipa B dalam y jam. Bersama-sama mengisi dalam 4 jam. Pipa B membutuhkan waktu 6 jam lebih lama dari pipa A.",
    parts: [
      { label: "a.", math: "\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{4} \\quad \\text{dan} \\quad y = x + 6" },
      { label: "b.", text: "Selesaikan sistem tersebut." },
      { label: "c.", text: "Berapa jam pipa A dan B masing-masing mengisi tangki?" },
    ],
  }),
  Qf(10, "Soal Gaji Pekerja", {
    badge: "ANBK", type: "mixed",
    content: "Gaji x pekerja tetap dan y pekerja kontrak berjumlah Rp 45.000.000/bulan. Setiap pekerja tetap mendapat Rp 3.000.000 dan kontrak Rp 1.500.000. Total pekerja = 20 orang.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa pekerja tetap dan kontrak?" },
    ],
  }),
  Qf(11, "Soal Diskon", {
    badge: "UN", type: "mixed",
    content: "Harga kemeja setelah diskon 20% = Rp 80.000. Harga celana setelah diskon 25% = Rp 150.000. Sebelum diskon, total harga kemeja dan celana = ...",
    parts: [
      { label: "a.", text: "Tentukan harga asli kemeja (sebelum diskon)." },
      { label: "b.", text: "Tentukan harga asli celana (sebelum diskon)." },
      { label: "c.", text: "Berapa total harga asli kemeja dan celana?" },
    ],
  }),
  Qf(12, "Soal Sudut Segitiga", {
    badge: "UN", type: "mixed",
    content: "Dalam segitiga, sudut A dan sudut B saling berpelengkap (jumlah = 90°). Sudut A = 3 kali sudut B dikurangi 10°.",
    parts: [
      { label: "a.", text: "Misal sudut A = x° dan B = y°. Susun SPLDV." },
      { label: "b.", text: "Selesaikan dan tentukan besar kedua sudut." },
      { label: "c.", text: "Jika sudut C = 180° − sudut A − sudut B, tentukan sudut C." },
    ],
  }),
  Qf(13, "Soal Produksi Pabrik", {
    badge: "TKA", type: "mixed",
    content: "Pabrik A memproduksi x unit/hari dan pabrik B y unit/hari. Dalam 5 hari pabrik A dan 3 hari pabrik B menghasilkan 1.100 unit. Dalam 2 hari A dan 4 hari B menghasilkan 880 unit.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa produksi per hari masing-masing pabrik?" },
    ],
  }),
  Qf(14, "Soal Uang — UN", {
    badge: "UN", type: "mixed",
    content: "Rudi memiliki lembaran uang Rp 50.000 dan Rp 100.000 sebanyak 30 lembar dengan nilai total Rp 2.100.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa lembar uang Rp 50.000 dan Rp 100.000?" },
    ],
  }),
  Qf(15, "Soal Populasi Bertumbuh", {
    badge: "AKM", type: "mixed",
    content: "Tahun lalu, jumlah siswa di dua sekolah = 1.200. Sekolah A bertambah 10% dan sekolah B bertambah 5% sehingga tahun ini jumlah total = 1.300 siswa.",
    parts: [
      { label: "a.", text: "Misal siswa sekolah A tahun lalu = x dan B = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa siswa di setiap sekolah tahun lalu?" },
    ],
  }),
  Qf(16, "Soal Nilai Ujian Berbobot", {
    badge: "ANBK", type: "mixed",
    content: "Nilai ujian Rina: teori = x dan praktik = y. Nilai akhir = 40% teori + 60% praktik = 82. Nilai teori = nilai praktik + 8.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan nilai teori dan praktik Rina." },
    ],
  }),
  Qf(17, "Soal Penerbangan", {
    badge: "TKA", type: "mixed",
    content: "Pesawat terbang ke arah timur (searah angin) menempuh 1.500 km dalam 3 jam. Ke arah barat (melawan angin) menempuh 1.500 km dalam 5 jam. Kecepatan pesawat di udara tenang = x km/jam, kecepatan angin = y km/jam.",
    parts: [
      { label: "a.", text: "Susun SPLDV dari perjalanan timur dan barat." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa kecepatan pesawat dan angin?" },
    ],
  }),
  Qf(18, "Soal Ujian Sekolah", {
    badge: "ANBK", type: "mixed",
    content: "Skor benar = 5 dan skor salah = −2. Dino mengerjakan 50 soal. Skor total Dino = 162.",
    parts: [
      { label: "a.", text: "Misal soal benar = x dan salah = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa soal yang dijawab benar dan salah?" },
    ],
  }),
  Qf(19, "Soal Pariwisata — ANBK", {
    badge: "ANBK", type: "mixed",
    content: "Tiket masuk museum: dewasa Rp 25.000 dan pelajar Rp 15.000. Pada Sabtu terjual 250 tiket dengan total Rp 5.250.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa tiket dewasa dan pelajar yang terjual?" },
    ],
  }),
];

const PenyelesaianMasalahPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <Rocket className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            PENYELESAIAN MASALAH SPLDV
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · Latihan Mandiri · 19 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border" style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(167,139,250,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>{q.n}</div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>{q.badge}</span>}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(167,139,250,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}{p.math && <InlineMath math={p.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← Kembali ke Menu SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenyelesaianMasalahPage;
