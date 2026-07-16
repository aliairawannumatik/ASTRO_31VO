import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Diskriminan & Jenis Akar",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 220" className="w-full">
          <rect width="280" height="220" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="12" fontWeight="bold" fill="#a78bfa" textAnchor="middle">D = b² − 4ac (DISKRIMINAN)</text>
          <rect x="20" y="38" width="240" height="40" rx="8" fill="#34d399" fillOpacity="0.4" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="58" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"D > 0  →  2 AKAR REAL berbeda"}</text>
          <text x="140" y="73" fontSize="9" fill="#fde68a" textAnchor="middle">parabola memotong sumbu-x di 2 titik</text>
          <rect x="20" y="86" width="240" height="40" rx="8" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="140" y="106" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">D = 0  →  AKAR KEMBAR (1 akar)</text>
          <text x="140" y="121" fontSize="9" fill="#fbbf24" textAnchor="middle">parabola menyentuh sumbu-x di 1 titik</text>
          <rect x="20" y="134" width="240" height="40" rx="8" fill="#ef4444" fillOpacity="0.4" stroke="#fca5a5" strokeWidth="1.5" />
          <text x="140" y="154" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"D < 0  →  TIDAK ADA AKAR REAL"}</text>
          <text x="140" y="169" fontSize="9" fill="#fca5a5" textAnchor="middle">parabola TIDAK memotong sumbu-x</text>
          <rect x="20" y="182" width="240" height="32" rx="6" fill="#22d3ee" fillOpacity="0.4" />
          <text x="140" y="204" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">D = bilangan KUADRAT → akar RASIONAL</text>
        </svg>
      </div>
    ),
    text:
      "DISKRIMINAN D = b²−4ac menentukan SIFAT AKAR PK tanpa harus mencari akarnya! D>0 → 2 akar real berbeda. D=0 → akar kembar. D<0 → tak ada akar real. Jika D = bilangan kuadrat → akar rasional.",
  },
  {
    title: "Situasi 2 — Visualisasi Parabola",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <line x1="20" y1="160" x2="260" y2="160" stroke="#94a3b8" strokeWidth="1" />
          <text x="140" y="178" fontSize="9" fill="#94a3b8" textAnchor="middle">sumbu-x</text>
          <path d="M 30 60 Q 60 180 90 60" fill="none" stroke="#34d399" strokeWidth="2" />
          <circle cx="42" cy="160" r="3" fill="#fde68a" />
          <circle cx="78" cy="160" r="3" fill="#fde68a" />
          <text x="60" y="48" fontSize="10" fontWeight="bold" fill="#34d399" textAnchor="middle">{"D > 0"}</text>
          <text x="60" y="195" fontSize="8" fill="#94a3b8" textAnchor="middle">2 titik potong</text>
          <path d="M 110 80 Q 140 200 170 80" fill="none" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="140" cy="160" r="3" fill="#fde68a" />
          <text x="140" y="68" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">D = 0</text>
          <text x="140" y="195" fontSize="8" fill="#94a3b8" textAnchor="middle">menyentuh</text>
          <path d="M 190 100 Q 220 200 250 100" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="220" y="88" fontSize="10" fontWeight="bold" fill="#ef4444" textAnchor="middle">{"D < 0"}</text>
          <text x="220" y="195" fontSize="8" fill="#94a3b8" textAnchor="middle">tak memotong</text>
        </svg>
      </div>
    ),
    text:
      "Secara GRAFIK, akar PK = titik potong parabola y = ax² + bx + c dengan sumbu-x. D menentukan banyaknya titik potong: 2 (D>0), 1 (D=0), atau 0 (D<0).",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Rumus diskriminan adalah D = …",
    kind: "choice",
    options: ["b² + 4ac", "b² − 4ac", "4ac − b²", "(b − 2a)²"],
    correctIndex: 1,
    discussion: ["D = b² − 4ac. Hafalkan!"],
  },
  {
    id: "g2",
    label: "Hitung D untuk x² − 5x + 6 = 0. D = …",
    kind: "fill",
    answers: ["1"],
    discussion: ["25 − 24 = 1."],
  },
  {
    id: "g3",
    label: "Karena D = 1 > 0, PK x² − 5x + 6 = 0 memiliki …",
    kind: "choice",
    options: ["2 akar real berbeda", "akar kembar", "tak ada akar real", "akar imajiner"],
    correctIndex: 0,
    discussion: ["D > 0 → 2 akar real berbeda."],
  },
  {
    id: "g4",
    label: "Hitung D untuk x² − 6x + 9 = 0. D = …",
    kind: "fill",
    answers: ["0"],
    discussion: ["36 − 36 = 0."],
  },
  {
    id: "g5",
    label: "Karena D = 0, PK tersebut memiliki …",
    kind: "choice",
    options: ["2 akar real berbeda", "akar kembar", "tak ada akar real", "tak hingga akar"],
    correctIndex: 1,
    discussion: ["D = 0 → akar kembar (1 akar saja, x = 3)."],
  },
  {
    id: "g6",
    label: "Hitung D untuk x² + x + 1 = 0. D = …",
    kind: "fill",
    answers: ["-3", "−3"],
    discussion: ["1 − 4 = −3."],
  },
  {
    id: "g7",
    label: "Karena D < 0, PK x² + x + 1 = 0 …",
    kind: "choice",
    options: ["2 akar real berbeda", "akar kembar", "tak ada akar real", "akar nol"],
    correctIndex: 2,
    discussion: ["D < 0 → tak ada akar real (akarnya bilangan kompleks)."],
  },
  {
    id: "g8",
    label:
      "PK x² + 4x + k = 0 memiliki AKAR KEMBAR. Tentukan k. Pakai D = 0: 16 − 4k = 0 → k = …",
    kind: "fill",
    answers: ["4"],
    discussion: ["D = 0 → 16 = 4k → k = 4."],
  },
  {
    id: "g9",
    label:
      "PK 2x² − 5x + k = 0 memiliki 2 akar real berbeda. Syaratnya …",
    kind: "choice",
    options: [
      "k = 25/8",
      "k > 25/8",
      "k < 25/8",
      "k = 0",
    ],
    correctIndex: 2,
    discussion: ["D > 0 → 25 − 8k > 0 → k < 25/8."],
  },
  {
    id: "g10",
    label: "Pernyataan: Jika D = 49, akar PK pasti BILANGAN BULAT/RASIONAL.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. D bilangan kuadrat (49 = 7²) → akar rasional.",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan PK dengan jenis akarnya:",
    kind: "match",
    pairs: [
      { left: "x² − 4x + 4 = 0 (D=0)", right: "Akar kembar" },
      { left: "x² − 5x + 6 = 0 (D=1)", right: "2 akar real beda" },
      { left: "x² + 1 = 0 (D=−4)", right: "Tak ada akar real" },
      { left: "x² − 7x + 12 = 0 (D=1)", right: "2 akar real beda" },
    ],
    discussion: ["Identifikasi tanda D dulu lalu pilih sifatnya."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Rumus Diskriminan",
    text: "D = b² − 4ac. Kunci untuk mengetahui jenis akar TANPA mencari akarnya.",
    tone: "violet",
  },
  {
    title: "Klasifikasi Akar",
    text: "D > 0 → 2 akar real berbeda. D = 0 → akar kembar. D < 0 → tidak ada akar real. D bilangan kuadrat → akar rasional.",
    tone: "cyan",
  },
  {
    title: "Hubungan Akar & Grafik",
    text: "Akar = titik potong parabola dengan sumbu-x. Banyaknya titik potong = banyaknya akar real (0, 1, atau 2).",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "disk-game-jenis",
    title: "🎯 Game 1 — Klasifikasi Akar",
    description: "Seret tiap PK ke jenis akar yang TEPAT berdasarkan D!",
    buckets: [
      { id: "j1", label: "2 akar real beda", emoji: "✌️", color: "emerald" },
      { id: "j2", label: "Akar kembar", emoji: "👬", color: "amber" },
      { id: "j3", label: "Tak ada akar real", emoji: "❌", color: "rose" },
    ],
    items: [
      { id: "z1", label: "x² − 4x + 4 = 0 (D=0)", bucketId: "j2", emoji: "📐" },
      { id: "z2", label: "x² − 5x + 6 = 0 (D=1)", bucketId: "j1", emoji: "📐" },
      { id: "z3", label: "x² + 1 = 0 (D=−4)", bucketId: "j3", emoji: "📐" },
      { id: "z4", label: "x² + 6x + 9 = 0 (D=0)", bucketId: "j2", emoji: "📐" },
      { id: "z5", label: "x² − x − 6 = 0 (D=25)", bucketId: "j1", emoji: "📐" },
      { id: "z6", label: "x² + x + 1 = 0 (D=−3)", bucketId: "j3", emoji: "📐" },
      { id: "z7", label: "2x² − 7x + 3 = 0 (D=25)", bucketId: "j1", emoji: "📐" },
      { id: "z8", label: "x² − 2x + 5 = 0 (D=−16)", bucketId: "j3", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "disk-game-d",
    title: "🎯 Game 2 — Hitung Diskriminan",
    description: "Pasangkan tiap PK dengan nilai D-nya. Tekan ◀ ▶.",
    rightOptions: ["−4", "−3", "0", "1", "9", "25", "49"],
    pairs: [
      { id: "h1", left: "x² − 5x + 6 = 0", correctRight: "1", emoji: "📐" },
      { id: "h2", left: "x² − 4x + 4 = 0", correctRight: "0", emoji: "📐" },
      { id: "h3", left: "x² + 1 = 0", correctRight: "−4", emoji: "📐" },
      { id: "h4", left: "x² + x + 1 = 0", correctRight: "−3", emoji: "📐" },
      { id: "h5", left: "x² − 5x + 4 = 0", correctRight: "9", emoji: "📐" },
      { id: "h6", left: "2x² − 7x + 3 = 0", correctRight: "25", emoji: "📐" },
      { id: "h7", left: "x² − 7x = 0", correctRight: "49", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Diskriminan PK 3x² + 5x − 2 = 0 = …",
    kind: "fill",
    answers: ["49"],
    hint: "25 + 24.",
    discussion: ["D = 25 − 4(3)(−2) = 25 + 24 = 49."],
  },
  {
    id: "pp2",
    question: "Jenis akar PK 4x² − 12x + 9 = 0 adalah …",
    kind: "choice",
    options: ["Akar kembar", "2 akar berbeda", "Tak ada akar real", "Akar imajiner"],
    correctIndex: 0,
    hint: "Hitung D dulu.",
    discussion: ["D = 144 − 144 = 0 → akar kembar."],
  },
  {
    id: "pp3",
    question: "PK x² + 6x + k = 0 memiliki akar kembar. Nilai k = …",
    kind: "fill",
    answers: ["9"],
    hint: "D = 0.",
    discussion: ["36 − 4k = 0 → k = 9."],
  },
  {
    id: "pp4",
    question:
      "PK x² + 2x + m = 0 memiliki 2 akar real berbeda. Syarat m …",
    kind: "choice",
    options: ["m = 1", "m > 1", "m < 1", "m ≥ 1"],
    correctIndex: 2,
    hint: "D > 0.",
    discussion: ["4 − 4m > 0 → m < 1."],
  },
  {
    id: "pp5",
    question:
      "PK 2x² − 4x + 5 = 0 memiliki D = …",
    kind: "fill",
    answers: ["-24", "−24"],
    hint: "16 − 40.",
    discussion: ["D = 16 − 4(2)(5) = 16 − 40 = −24."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: PK 2x² − 4x + 5 = 0 memiliki 2 akar real karena D besar.",
    kind: "truefalse",
    correct: false,
    hint: "Cek tanda D.",
    discussion: ["SALAH. D = −24 < 0 → tak ada akar real."],
  },
  {
    id: "pp7",
    question:
      "Diketahui parabola y = x² − 6x + 9 menyentuh sumbu-x di … titik.",
    kind: "fill",
    answers: ["1"],
    hint: "D = 0?",
    discussion: ["D = 0 → menyentuh sumbu-x di 1 titik (x = 3)."],
  },
  {
    id: "pp8",
    question:
      "PK (k − 1)x² + 4x + 4 = 0 memiliki akar kembar. Nilai k = …",
    kind: "fill",
    answers: ["2"],
    hint: "D = 0: 16 − 16(k−1) = 0.",
    discussion: ["16 − 16(k−1) = 0 → k − 1 = 1 → k = 2."],
  },
];

const DiskriminanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan PK"
    title="Diskriminan — Penemuan Terbimbing"
    intro="Sobat Numatik 🔍! Saatnya jadi DETEKTIF AKAR — gunakan DISKRIMINAN D = b² − 4ac untuk mengetahui SIFAT AKAR sebuah PK TANPA mencari akarnya! Kamu akan menemukan klasifikasi akar (D>0, D=0, D<0) dan kaitannya dengan grafik parabola."
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan peran diskriminan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Menu Persamaan Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Diskriminan sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang formula D = b² − 4ac dan klasifikasinya.",
      low: "💪 Tetap semangat! Mulai dari menghitung D dengan tepat.",
    }}
  />
);

export default DiskriminanLKPDPage;
