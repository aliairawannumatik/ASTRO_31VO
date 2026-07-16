import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Kotak Kado",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="40,120 160,120 200,90 80,90" fill="#f472b6" fillOpacity="0.5" stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="40,40 160,40 160,120 40,120" fill="#ec4899" fillOpacity="0.55" stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="160,40 200,15 200,90 160,120" fill="#db2777" fillOpacity="0.7" stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="40,40 80,15 200,15 160,40" fill="#fbcfe8" fillOpacity="0.8" stroke="#f9a8d4" strokeWidth="2" />
          <text x="100" y="138" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">p (panjang)</text>
          <text x="178" y="62" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">l</text>
          <text x="32" y="80" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">t</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah kotak kado berbentuk BALOK. Ukurannya: panjang p, lebar l, dan tinggi t. Pertanyaannya: berapa luas kertas pembungkus minimum dan berapa volume isinya?",
  },
  {
    title: "Situasi 2 — Akuarium",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="40,120 160,120 200,90 80,90" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="2" />
          <polygon points="40,40 160,40 160,120 40,120" fill="#0891b2" fillOpacity="0.45" stroke="#67e8f9" strokeWidth="2" />
          <rect x="40" y="65" width="120" height="55" fill="#3b82f6" fillOpacity="0.6" />
          <polygon points="160,65 200,40 200,90 160,120" fill="#3b82f6" fillOpacity="0.5" />
          <polygon points="160,40 200,15 200,90 160,120" fill="#0e7490" fillOpacity="0.7" stroke="#67e8f9" strokeWidth="2" />
          <polygon points="40,40 80,15 200,15 160,40" fill="#a5f3fc" fillOpacity="0.7" stroke="#67e8f9" strokeWidth="2" />
          <text x="100" y="100" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">AIR 💧</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah akuarium berbentuk balok berukuran 60 × 40 × 50 cm diisi air sampai 4/5 bagian. Berapa banyak air dalam akuarium tersebut? (1 liter = 1.000 cm³)",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Banyak SISI (bidang) pada balok adalah …",
    kind: "fill",
    answers: ["6", "enam"],
    discussion: [
      "Balok memiliki 6 sisi berbentuk PERSEGI PANJANG.",
      "Sisi-sisi yang berhadapan KONGRUEN (alas-tutup, depan-belakang, kiri-kanan).",
    ],
  },
  {
    id: "g2",
    label: "Banyak RUSUK pada balok adalah …",
    kind: "fill",
    answers: ["12", "dua belas"],
    discussion: [
      "Balok punya 12 rusuk: 4 panjang (p), 4 lebar (l), 4 tinggi (t).",
    ],
  },
  {
    id: "g3",
    label: "Banyak TITIK SUDUT pada balok adalah …",
    kind: "fill",
    answers: ["8", "delapan"],
    discussion: [
      "Balok memiliki 8 titik sudut, sama seperti kubus.",
    ],
  },
  {
    id: "g4",
    label: "Pernyataan: Pada balok, semua sisinya berbentuk persegi panjang yang KONGRUEN.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Yang KONGRUEN hanya sisi-sisi yang BERHADAPAN.",
      "Misal: alas dan tutup kongruen, depan-belakang kongruen, kiri-kanan kongruen.",
    ],
  },
  {
    id: "g5",
    label: "Luas sisi DEPAN sebuah balok dengan ukuran p × l × t adalah …",
    kind: "choice",
    options: ["p × l", "p × t", "l × t", "p + l + t"],
    correctIndex: 1,
    discussion: [
      "Sisi depan adalah persegi panjang dengan PANJANG p dan TINGGI t.",
      "Luas = p × t.",
    ],
  },
  {
    id: "g6",
    label: "Karena ada 3 PASANG sisi, LUAS PERMUKAAN balok p × l × t adalah …",
    kind: "choice",
    options: ["p + l + t", "p × l × t", "2(pl + pt + lt)", "2(p + l + t)"],
    correctIndex: 2,
    discussion: [
      "Luas alas-tutup = 2 × (p × l).",
      "Luas depan-belakang = 2 × (p × t).",
      "Luas kiri-kanan = 2 × (l × t).",
      "Total: L = 2pl + 2pt + 2lt = 2(pl + pt + lt).",
    ],
  },
  {
    id: "g7",
    label:
      "Sebuah balok berukuran 8 × 5 × 3 cm. Luas permukaannya = … cm².",
    kind: "fill",
    answers: ["158"],
    discussion: [
      "L = 2(pl + pt + lt) = 2(8×5 + 8×3 + 5×3) = 2(40 + 24 + 15) = 2 × 79 = 158 cm².",
    ],
  },
  {
    id: "g8",
    label: "VOLUME balok p × l × t adalah …",
    kind: "fill",
    answers: ["plt", "p×l×t", "pxlxt", "p.l.t", "p l t", "pxlxt", "p*l*t"],
    discussion: [
      "Volume = panjang × lebar × tinggi = p × l × t.",
      "Sering juga ditulis sebagai V = Luas Alas × tinggi.",
    ],
  },
  {
    id: "g9",
    label: "Sebuah balok berukuran 10 × 6 × 4 cm. Volume balok = … cm³.",
    kind: "fill",
    answers: ["240"],
    discussion: ["V = p × l × t = 10 × 6 × 4 = 240 cm³."],
  },
  {
    id: "g10",
    label: "Diagonal RUANG balok dengan ukuran p × l × t adalah …",
    kind: "choice",
    options: ["p + l + t", "√(p² + l² + t²)", "√(pl + pt + lt)", "plt"],
    correctIndex: 1,
    discussion: [
      "Pakai Pythagoras dua kali!",
      "Diagonal alas: d = √(p² + l²). Lalu diagonal ruang: dr² = d² + t² = p² + l² + t².",
      "dr = √(p² + l² + t²).",
    ],
  },
  {
    id: "g11",
    label:
      "Sebuah balok berukuran 3 × 4 × 12 cm. Diagonal ruangnya adalah … cm.",
    kind: "fill",
    answers: ["13"],
    discussion: [
      "dr = √(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13 cm.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan ciri unsur balok dengan jumlahnya:",
    kind: "match",
    pairs: [
      { left: "Sisi (Bidang)", right: "6" },
      { left: "Rusuk", right: "12" },
      { left: "Titik Sudut", right: "8" },
      { left: "Diagonal Ruang", right: "4" },
    ],
    discussion: [
      "Balok = kubus dengan sisi tidak harus sama.",
      "Jumlah unsur tetap sama: 6, 12, 8, dan 4 diagonal ruang.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Unsur Balok",
    text: "Sisi: 6 (3 pasang persegi panjang kongruen). Rusuk: 12 (4 p + 4 l + 4 t). Titik Sudut: 8. Diagonal Ruang: 4.",
    tone: "cyan",
  },
  {
    title: "Rumus Baku",
    text: "Luas Permukaan: L = 2(pl + pt + lt). Volume: V = p × l × t. Diagonal Ruang: dr = √(p² + l² + t²).",
    tone: "yellow",
  },
  {
    title: "Tips Cepat",
    text: "1 m³ = 1.000.000 cm³ = 1.000 liter. Untuk 'jumlah panjang seluruh rusuk' gunakan 4(p + l + t).",
    tone: "rose",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "balok-game-rumus",
    title: "🎯 Game 1 — Tarik Rumus ke Tempatnya!",
    description: "Seret setiap pernyataan ke kategori RUMUS yang tepat. Bisa di-tap & ketuk wadah juga!",
    buckets: [
      { id: "luas", label: "LUAS PERMUKAAN", emoji: "🟦", color: "cyan" },
      { id: "vol", label: "VOLUME", emoji: "📦", color: "amber" },
      { id: "diag", label: "DIAGONAL RUANG", emoji: "📐", color: "violet" },
      { id: "rusuk", label: "JUMLAH PANJANG RUSUK", emoji: "📏", color: "rose" },
    ],
    items: [
      { id: "r1", label: "2(pl + pt + lt)", bucketId: "luas", emoji: "🟦" },
      { id: "r2", label: "p × l × t", bucketId: "vol", emoji: "📦" },
      { id: "r3", label: "√(p² + l² + t²)", bucketId: "diag", emoji: "📐" },
      { id: "r4", label: "4(p + l + t)", bucketId: "rusuk", emoji: "📏" },
      { id: "r5", label: "Luas Alas × tinggi", bucketId: "vol", emoji: "📦" },
      { id: "r6", label: "2pl + 2pt + 2lt", bucketId: "luas", emoji: "🟦" },
    ],
  },
  {
    kind: "arrow-match",
    id: "balok-game-volume",
    title: "🎯 Game 2 — Cocokkan Volume Balok",
    description: "Pasangkan ukuran balok dengan VOLUME yang TEPAT. Tekan ◀ ▶ untuk mengganti.",
    rightOptions: ["24 cm³", "60 cm³", "120 cm³", "200 cm³", "240 cm³", "300 cm³", "480 cm³"],
    pairs: [
      { id: "b1", left: "2 × 3 × 4 cm", correctRight: "24 cm³", emoji: "📦" },
      { id: "b2", left: "5 × 4 × 3 cm", correctRight: "60 cm³", emoji: "📦" },
      { id: "b3", left: "10 × 4 × 3 cm", correctRight: "120 cm³", emoji: "📦" },
      { id: "b4", left: "10 × 5 × 4 cm", correctRight: "200 cm³", emoji: "📦" },
      { id: "b5", left: "8 × 6 × 5 cm", correctRight: "240 cm³", emoji: "📦" },
      { id: "b6", left: "12 × 8 × 5 cm", correctRight: "480 cm³", emoji: "📦" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah balok berukuran 12 × 8 × 6 cm. Luas permukaan balok = … cm².",
    kind: "fill",
    answers: ["432"],
    hint: "L = 2(pl + pt + lt).",
    discussion: [
      "L = 2(12×8 + 12×6 + 8×6) = 2(96 + 72 + 48) = 2 × 216 = 432 cm².",
    ],
  },
  {
    id: "p2",
    question: "Volume balok berukuran 15 × 10 × 8 cm = … cm³.",
    kind: "fill",
    answers: ["1200"],
    hint: "V = p × l × t.",
    discussion: ["V = 15 × 10 × 8 = 1.200 cm³."],
  },
  {
    id: "p3",
    question:
      "Sebuah akuarium berukuran 60 × 40 × 50 cm diisi air sampai 4/5 bagian. Banyak air = … liter.",
    kind: "fill",
    answers: ["96"],
    hint: "Cari volume penuh, kalikan 4/5, lalu ubah ke liter.",
    discussion: [
      "V penuh = 60 × 40 × 50 = 120.000 cm³.",
      "Air = 4/5 × 120.000 = 96.000 cm³ = 96 liter.",
    ],
  },
  {
    id: "p4",
    question:
      "Diagonal ruang sebuah balok berukuran 6 × 8 × 24 cm = … cm.",
    kind: "fill",
    answers: ["26"],
    hint: "dr = √(p² + l² + t²).",
    discussion: [
      "dr = √(6² + 8² + 24²) = √(36 + 64 + 576) = √676 = 26 cm.",
    ],
  },
  {
    id: "p5",
    question: "Jumlah panjang seluruh rusuk balok 9 × 7 × 5 cm = … cm.",
    kind: "fill",
    answers: ["84"],
    hint: "Total rusuk = 4(p + l + t).",
    discussion: ["4(9 + 7 + 5) = 4 × 21 = 84 cm."],
  },
  {
    id: "p6",
    question:
      "Volume sebuah balok 360 cm³. Jika panjang 10 cm dan lebar 6 cm, tinggi balok = … cm.",
    kind: "fill",
    answers: ["6"],
    hint: "t = V / (p × l).",
    discussion: ["t = 360 / (10 × 6) = 360 / 60 = 6 cm."],
  },
  {
    id: "p7",
    question:
      "Sebuah bak air berbentuk balok berukuran 80 × 60 × 50 cm. Berapa liter air maksimum yang dapat ditampung?",
    kind: "fill",
    answers: ["240"],
    hint: "Hitung volume cm³, lalu konversi ke liter.",
    discussion: [
      "V = 80 × 60 × 50 = 240.000 cm³ = 240 liter.",
    ],
  },
  {
    id: "p8",
    question:
      "Pernyataan: Luas alas dan luas tutup pada balok selalu SAMA.",
    kind: "truefalse",
    correct: true,
    hint: "Sisi yang berhadapan pada balok kongruen.",
    discussion: [
      "BENAR. Alas dan tutup adalah sisi yang berhadapan, jadi selalu kongruen.",
    ],
  },
];

const BalokLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab Bangun Ruang Sisi Datar"
    title="Balok — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo bongkar rahasia BALOK 📦! Kamu akan menemukan rumus luas permukaan, volume, hingga diagonal ruangnya — sambil bermain seret rumus ke tempatnya!"
    situations={situations}
    guidedIntro="Jawab pertanyaan berurutan. Setiap jawabanmu menuntun ke rumus baku. Tekan 'Lihat Skor Akhir' di bawah untuk membuka pembahasan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang balok lewat soal latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Datar"
    scoreMessages={{
      perfect: "🌟 Sempurna! Pemahaman balok-mu sudah top!",
      high: "👍 Bagus! Cek kembali jawaban yang merah.",
      medium: "🚀 Mulai paham. Ulangi penemuan terbimbing & main game-nya.",
      low: "💪 Tetap semangat! Mulai dari rumus L = 2(pl + pt + lt) dan V = p × l × t.",
    }}
  />
);

export default BalokLKPDPage;
