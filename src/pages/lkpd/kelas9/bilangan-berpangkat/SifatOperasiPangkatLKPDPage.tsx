import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Perkalian Pangkat Sama Basis",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 140" className="w-full">
          <rect width="280" height="140" fill="#0b1220" rx="8" />
          <text x="140" y="30" fontSize="14" fontWeight="bold" fill="#a78bfa" textAnchor="middle">2³ × 2² = ?</text>
          <text x="140" y="60" fontSize="12" fill="var(--icon-color)" textAnchor="middle">(2 × 2 × 2) × (2 × 2)</text>
          <text x="140" y="84" fontSize="12" fill="var(--icon-color)" textAnchor="middle">= 2 × 2 × 2 × 2 × 2</text>
          <text x="140" y="110" fontSize="16" fontWeight="bold" fill="#fbbf24" textAnchor="middle">= 2⁵ = 32</text>
          <text x="140" y="130" fontSize="10" fill="#67e8f9" textAnchor="middle">3 + 2 = 5 → pangkat DIJUMLAHKAN!</text>
        </svg>
      </div>
    ),
    text:
      "Saat MENGALIKAN dua bilangan dengan basis sama, ternyata pangkatnya DIJUMLAHKAN! Mengapa? Karena jumlah faktor totalnya bertambah. Inilah Sifat Pertama: aᵐ × aⁿ = aᵐ⁺ⁿ.",
  },
  {
    title: "Situasi 2 — Pangkat dari Pangkat",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 140" className="w-full">
          <rect width="280" height="140" fill="#0b1220" rx="8" />
          <text x="140" y="30" fontSize="14" fontWeight="bold" fill="#34d399" textAnchor="middle">(2³)² = ?</text>
          <text x="140" y="58" fontSize="12" fill="var(--icon-color)" textAnchor="middle">= 2³ × 2³</text>
          <text x="140" y="80" fontSize="12" fill="var(--icon-color)" textAnchor="middle">= 2³⁺³</text>
          <text x="140" y="106" fontSize="16" fontWeight="bold" fill="#fbbf24" textAnchor="middle">= 2⁶ = 64</text>
          <text x="140" y="128" fontSize="10" fill="#67e8f9" textAnchor="middle">3 × 2 = 6 → pangkat DIKALIKAN!</text>
        </svg>
      </div>
    ),
    text:
      "PANGKAT dari PANGKAT? Ternyata pangkatnya DIKALIKAN! (aᵐ)ⁿ = aᵐⁿ. Ini sifat keempat — sangat berguna untuk menyederhanakan ekspresi rumit!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Hasil 3² × 3⁴ = …",
    kind: "fill",
    answers: ["3⁶", "3^6", "36", "729"],
    discussion: [
      "Karena BASIS SAMA dan operasi PERKALIAN → pangkat DIJUMLAHKAN.",
      "3² × 3⁴ = 3²⁺⁴ = 3⁶ = 729.",
    ],
  },
  {
    id: "g2",
    label: "Aturan umum: aᵐ × aⁿ = …",
    kind: "choice",
    options: ["aᵐ⁻ⁿ", "aᵐ⁺ⁿ", "aᵐⁿ", "aᵐ÷ⁿ"],
    correctIndex: 1,
    discussion: [
      "Pada PERKALIAN dengan BASIS SAMA → pangkat dijumlahkan.",
      "aᵐ × aⁿ = aᵐ⁺ⁿ.",
    ],
  },
  {
    id: "g3",
    label: "Hasil 5⁵ ÷ 5² = …",
    kind: "fill",
    answers: ["5³", "5^3", "53", "125"],
    discussion: [
      "Pada PEMBAGIAN dengan basis sama → pangkat DIKURANGKAN.",
      "5⁵ ÷ 5² = 5⁵⁻² = 5³ = 125.",
    ],
  },
  {
    id: "g4",
    label: "Aturan umum: aᵐ ÷ aⁿ = …",
    kind: "choice",
    options: ["aᵐ⁺ⁿ", "aᵐ⁻ⁿ", "aᵐⁿ", "aᵐ/ⁿ"],
    correctIndex: 1,
    discussion: [
      "Pada PEMBAGIAN dengan basis sama → pangkat dikurangkan.",
      "aᵐ ÷ aⁿ = aᵐ⁻ⁿ (a ≠ 0).",
    ],
  },
  {
    id: "g5",
    label: "Hasil (2³)⁴ = …",
    kind: "fill",
    answers: ["2¹²", "2^12", "212", "4096"],
    discussion: [
      "PANGKAT dari PANGKAT → pangkat DIKALIKAN.",
      "(2³)⁴ = 2³ˣ⁴ = 2¹² = 4.096.",
    ],
  },
  {
    id: "g6",
    label: "Aturan umum: (aᵐ)ⁿ = …",
    kind: "choice",
    options: ["aᵐ⁺ⁿ", "aᵐ⁻ⁿ", "aᵐⁿ", "aᵐ⁄ⁿ"],
    correctIndex: 2,
    discussion: ["(aᵐ)ⁿ = aᵐⁿ — pangkat dikalikan."],
  },
  {
    id: "g7",
    label: "Hasil (2 × 5)³ = …",
    kind: "fill",
    answers: ["1000", "1.000"],
    discussion: [
      "Sifat distributif pangkat: (a × b)ⁿ = aⁿ × bⁿ.",
      "(2 × 5)³ = 2³ × 5³ = 8 × 125 = 1.000.",
      "Atau: (10)³ = 1.000.",
    ],
  },
  {
    id: "g8",
    label: "Aturan umum: (a × b)ⁿ = …",
    kind: "choice",
    options: ["aⁿ + bⁿ", "aⁿ × bⁿ", "(ab)ⁿ⁺¹", "n × a × b"],
    correctIndex: 1,
    discussion: ["(a × b)ⁿ = aⁿ × bⁿ — distributif terhadap perkalian."],
  },
  {
    id: "g9",
    label: "Hasil (6/3)² = …",
    kind: "fill",
    answers: ["4"],
    discussion: [
      "(a/b)ⁿ = aⁿ/bⁿ.",
      "(6/3)² = 6²/3² = 36/9 = 4.",
      "Atau: (2)² = 4.",
    ],
  },
  {
    id: "g10",
    label: "Aturan umum: (a/b)ⁿ = …",
    kind: "choice",
    options: ["aⁿ/bⁿ", "a/bⁿ", "(ab)ⁿ", "(a − b)ⁿ"],
    correctIndex: 0,
    discussion: ["(a/b)ⁿ = aⁿ/bⁿ — distributif terhadap pembagian (b ≠ 0)."],
  },
  {
    id: "g11",
    label:
      "Sederhanakan: (2³ × 2⁵) ÷ 2² = … (tulis sebagai pangkat 2).",
    kind: "fill",
    answers: ["2⁶", "2^6", "26", "64"],
    discussion: [
      "Numerator: 2³ × 2⁵ = 2⁸.",
      "2⁸ ÷ 2² = 2⁶ = 64.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan operasi pangkat dengan ATURAN-nya:",
    kind: "match",
    pairs: [
      { left: "aᵐ × aⁿ", right: "aᵐ⁺ⁿ (pangkat ditambah)" },
      { left: "aᵐ ÷ aⁿ", right: "aᵐ⁻ⁿ (pangkat dikurang)" },
      { left: "(aᵐ)ⁿ", right: "aᵐⁿ (pangkat dikali)" },
      { left: "(a × b)ⁿ", right: "aⁿ × bⁿ (distributif)" },
    ],
    discussion: [
      "Empat sifat dasar pangkat: + saat kali, − saat bagi, × saat pangkat-pangkat, distributif saat (a×b).",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Sifat Dasar Pangkat",
    text: "1) aᵐ × aⁿ = aᵐ⁺ⁿ. 2) aᵐ ÷ aⁿ = aᵐ⁻ⁿ. 3) (aᵐ)ⁿ = aᵐⁿ. 4) (ab)ⁿ = aⁿbⁿ. 5) (a/b)ⁿ = aⁿ/bⁿ.",
    tone: "violet",
  },
  {
    title: "Pangkat Khusus",
    text: "a⁰ = 1 (a ≠ 0). a⁻ⁿ = 1/aⁿ. a¹ = a. Pangkat NEGATIF berarti membalik (resiprok).",
    tone: "yellow",
  },
  {
    title: "Tips Cepat",
    text: "Selalu samakan BASIS sebelum operasi. Jika basis berbeda, hitung dulu nilainya. Hati-hati: 2³ + 2² ≠ 2⁵ (tidak ada sifat ini!).",
    tone: "rose",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "sifat-game-aturan",
    title: "🎯 Game 1 — Tarik Bentuk ke ATURAN-nya!",
    description: "Seret setiap bentuk operasi pangkat ke kategori SIFAT yang TEPAT.",
    buckets: [
      { id: "tambah", label: "Pangkat DIJUMLAH", emoji: "➕", color: "emerald" },
      { id: "kurang", label: "Pangkat DIKURANG", emoji: "➖", color: "rose" },
      { id: "kali", label: "Pangkat DIKALI", emoji: "✖️", color: "amber" },
      { id: "dist", label: "Distributif (a×b)ⁿ", emoji: "📐", color: "violet" },
    ],
    items: [
      { id: "s1", label: "3² × 3⁵", bucketId: "tambah", emoji: "➕" },
      { id: "s2", label: "7⁸ ÷ 7³", bucketId: "kurang", emoji: "➖" },
      { id: "s3", label: "(4²)³", bucketId: "kali", emoji: "✖️" },
      { id: "s4", label: "(2 × 5)⁴", bucketId: "dist", emoji: "📐" },
      { id: "s5", label: "(6 × 2)³", bucketId: "dist", emoji: "📐" },
      { id: "s6", label: "(5³)⁴", bucketId: "kali", emoji: "✖️" },
      { id: "s7", label: "10⁹ ÷ 10⁴", bucketId: "kurang", emoji: "➖" },
      { id: "s8", label: "8⁵ × 8²", bucketId: "tambah", emoji: "➕" },
    ],
  },
  {
    kind: "arrow-match",
    id: "sifat-game-hasil",
    title: "🎯 Game 2 — Pasangkan Hasil",
    description: "Pasangkan setiap operasi dengan HASIL pangkatnya yang tepat. Tekan ◀ ▶.",
    rightOptions: ["2⁵", "2⁶", "2⁷", "2⁸", "2⁹", "2¹⁰", "2¹²"],
    pairs: [
      { id: "h1", left: "2³ × 2²", correctRight: "2⁵", emoji: "⚡" },
      { id: "h2", left: "2⁴ × 2³", correctRight: "2⁷", emoji: "⚡" },
      { id: "h3", left: "(2²)³", correctRight: "2⁶", emoji: "⚡" },
      { id: "h4", left: "(2³)⁴", correctRight: "2¹²", emoji: "⚡" },
      { id: "h5", left: "2¹⁰ ÷ 2²", correctRight: "2⁸", emoji: "⚡" },
      { id: "h6", left: "2⁵ × 2⁴", correctRight: "2⁹", emoji: "⚡" },
      { id: "h7", left: "2¹² ÷ 2²", correctRight: "2¹⁰", emoji: "⚡" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Sederhanakan 4³ × 4⁵ = … (sebagai pangkat 4).",
    kind: "fill",
    answers: ["4⁸", "4^8", "48"],
    hint: "aᵐ × aⁿ = aᵐ⁺ⁿ.",
    discussion: ["4³ × 4⁵ = 4³⁺⁵ = 4⁸."],
  },
  {
    id: "pp2",
    question: "Hasil 6⁷ ÷ 6⁵ = …",
    kind: "fill",
    answers: ["36"],
    hint: "Setelah dapat pangkat, hitung nilainya.",
    discussion: ["6⁷ ÷ 6⁵ = 6² = 36."],
  },
  {
    id: "pp3",
    question: "Sederhanakan (3⁴)² = … (sebagai pangkat 3).",
    kind: "fill",
    answers: ["3⁸", "3^8", "38"],
    hint: "(aᵐ)ⁿ = aᵐⁿ.",
    discussion: ["(3⁴)² = 3⁴ˣ² = 3⁸ = 6.561."],
  },
  {
    id: "pp4",
    question: "Hasil (2 × 3)⁴ = …",
    kind: "fill",
    answers: ["1296", "1.296"],
    hint: "Pakai (ab)ⁿ = aⁿbⁿ atau hitung 6⁴.",
    discussion: [
      "(2 × 3)⁴ = 6⁴ = 1.296.",
      "Atau 2⁴ × 3⁴ = 16 × 81 = 1.296.",
    ],
  },
  {
    id: "pp5",
    question: "Sederhanakan (2³ × 2⁵) ÷ 2² = … (sebagai pangkat 2).",
    kind: "fill",
    answers: ["2⁶", "2^6", "26", "64"],
    hint: "Selesaikan numerator dulu, lalu kurangi pangkat.",
    discussion: [
      "Numerator = 2³⁺⁵ = 2⁸.",
      "2⁸ ÷ 2² = 2⁸⁻² = 2⁶ = 64.",
    ],
  },
  {
    id: "pp6",
    question: "Hasil (5⁰)⁷ = …",
    kind: "fill",
    answers: ["1"],
    hint: "5⁰ = 1, lalu pangkat 7.",
    discussion: ["5⁰ = 1 → 1⁷ = 1."],
  },
  {
    id: "pp7",
    question: "Sederhanakan (4/2)³ = …",
    kind: "fill",
    answers: ["8"],
    hint: "(a/b)ⁿ = aⁿ/bⁿ atau hitung dulu pembagian.",
    discussion: [
      "(4/2)³ = 2³ = 8.",
      "Atau 4³/2³ = 64/8 = 8.",
    ],
  },
  {
    id: "pp8",
    question:
      "Pernyataan: 2³ + 2² = 2⁵.",
    kind: "truefalse",
    correct: false,
    hint: "Apakah ada sifat 'pangkat dijumlah saat penjumlahan'?",
    discussion: [
      "SALAH. 2³ + 2² = 8 + 4 = 12, bukan 2⁵ = 32.",
      "Sifat aᵐ × aⁿ = aᵐ⁺ⁿ HANYA berlaku pada PERKALIAN, bukan PENJUMLAHAN.",
    ],
  },
];

const SifatOperasiPangkatLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bilangan Berpangkat"
    title="Sifat Operasi Pangkat — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo bongkar 5 SIFAT OPERASI PANGKAT ⚡! Kamu akan menemukan kapan pangkat ditambah, dikurang, atau dikali — sambil bermain seret kartu ke kategori sifat yang tepat!"
    situations={situations}
    guidedIntro="Jawab pertanyaan berurutan. Setiap jawabanmu menuntun ke 5 sifat dasar pangkat."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang sifat operasi pangkat lewat soal latihan!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Menu Bilangan Berpangkat"
    scoreMessages={{
      perfect: "🌟 Mantap! 5 sifat pangkat sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian merah dan ulangi.",
      medium: "🚀 Lumayan. Ulangi penemuan terbimbing dan main game-nya.",
      low: "💪 Tetap semangat! Ingat: kali → tambah, bagi → kurang, pangkat-pangkat → kali.",
    }}
  />
);

export default SifatOperasiPangkatLKPDPage;
