import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Titik Potong Sumbu-y",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <line x1="20" y1="160" x2="260" y2="160" stroke="#94a3b8" strokeWidth="1" />
          <line x1="140" y1="20" x2="140" y2="180" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 60 50 Q 140 200 220 50" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          <circle cx="140" cy="80" r="5" fill="#fde68a" stroke="#fbbf24" strokeWidth="2" />
          <text x="155" y="78" fontSize="11" fontWeight="bold" fill="#fde68a">(0, c)</text>
          <text x="155" y="92" fontSize="9" fill="#a7f3d0">titik potong y</text>
          <text x="140" y="195" fontSize="11" fontWeight="bold" fill="#67e8f9" textAnchor="middle">x = 0 → f(0) = c</text>
        </svg>
      </div>
    ),
    text:
      "Titik potong PARABOLA dengan sumbu-y selalu pada (0, c) — yaitu nilai f(0) = a·0 + b·0 + c = c. Substitusi x = 0!",
  },
  {
    title: "Situasi 2 — Titik Potong Sumbu-x",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-violet-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 220" className="w-full">
          <rect width="280" height="220" fill="#0b1220" rx="8" />
          <line x1="20" y1="120" x2="260" y2="120" stroke="#94a3b8" strokeWidth="1" />
          <line x1="140" y1="20" x2="140" y2="200" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 50 60 Q 140 220 230 60" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="80" cy="120" r="5" fill="#34d399" stroke="#6ee7b7" strokeWidth="2" />
          <circle cx="200" cy="120" r="5" fill="#34d399" stroke="#6ee7b7" strokeWidth="2" />
          <text x="80" y="142" fontSize="10" fontWeight="bold" fill="#34d399" textAnchor="middle">(x₁, 0)</text>
          <text x="200" y="142" fontSize="10" fontWeight="bold" fill="#34d399" textAnchor="middle">(x₂, 0)</text>
          <text x="140" y="170" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">y = 0 → ax² + bx + c = 0</text>
          <text x="140" y="190" fontSize="10" fill="#fde68a" textAnchor="middle">selesaikan PK → akar = absis titik potong</text>
        </svg>
      </div>
    ),
    text:
      "Titik potong dengan sumbu-x diperoleh dengan SUBSTITUSI y = f(x) = 0, lalu menyelesaikan PK ax² + bx + c = 0. Jumlah titik potong = 0, 1, atau 2 — tergantung DISKRIMINAN!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Untuk mencari titik potong dgn sumbu-y, kita substitusi …",
    kind: "choice",
    options: ["y = 0", "x = 0", "f(x) = 0", "x = y"],
    correctIndex: 1,
    discussion: ["Sumbu-y → x = 0."],
  },
  {
    id: "g2",
    label: "Untuk f(x) = x² − 5x + 6, titik potong sumbu-y = …",
    kind: "fill",
    answers: ["(0, 6)", "(0,6)"],
    discussion: ["f(0) = 6 → (0, 6)."],
  },
  {
    id: "g3",
    label: "Untuk mencari titik potong sumbu-x, kita substitusi …",
    kind: "choice",
    options: ["x = 0", "y = 0", "x = y", "y = 1"],
    correctIndex: 1,
    discussion: ["Sumbu-x → y = 0 → ax² + bx + c = 0."],
  },
  {
    id: "g4",
    label:
      "Untuk f(x) = x² − 5x + 6, akar PK x² − 5x + 6 = 0 adalah …",
    kind: "choice",
    options: ["x = 2 dan x = 3", "x = −2 dan x = −3", "x = 1 dan x = 6", "x = 0 dan x = 5"],
    correctIndex: 0,
    discussion: ["(x−2)(x−3)=0 → x=2 atau x=3."],
  },
  {
    id: "g5",
    label: "Maka titik potong sumbu-x f(x) = x² − 5x + 6 adalah …",
    kind: "choice",
    options: ["(2, 0) dan (3, 0)", "(0, 2) dan (0, 3)", "(2, 6) dan (3, 6)", "(2, 0) dan (0, 3)"],
    correctIndex: 0,
    discussion: ["Akar PK = absis (x), ordinat = 0 → (2,0) dan (3,0)."],
  },
  {
    id: "g6",
    label:
      "Hitung diskriminan f(x) = x² − 4x + 4. D = …",
    kind: "fill",
    answers: ["0"],
    discussion: ["D = 16 − 16 = 0."],
  },
  {
    id: "g7",
    label: "Karena D = 0, parabola memotong sumbu-x di … titik.",
    kind: "fill",
    answers: ["1"],
    discussion: ["D = 0 → MENYENTUH 1 titik (parabola tangen)."],
  },
  {
    id: "g8",
    label:
      "Untuk f(x) = x² + 1, D = …",
    kind: "fill",
    answers: ["-4", "−4"],
    discussion: ["D = 0 − 4 = −4."],
  },
  {
    id: "g9",
    label: "Karena D < 0, parabola f(x) = x² + 1 memotong sumbu-x di … titik.",
    kind: "fill",
    answers: ["0"],
    discussion: ["D < 0 → TIDAK memotong sumbu-x."],
  },
  {
    id: "g10",
    label: "Pasangkan FK dengan banyaknya titik potong sumbu-x:",
    kind: "match",
    pairs: [
      { left: "f(x) = x² − 5x + 6 (D=1)", right: "2 titik" },
      { left: "f(x) = x² − 4x + 4 (D=0)", right: "1 titik" },
      { left: "f(x) = x² + 4 (D=−16)", right: "0 titik" },
      { left: "f(x) = x² − 9 (D=36)", right: "2 titik" },
    ],
    discussion: ["D > 0 = 2 titik; D = 0 = 1 titik; D < 0 = 0 titik."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Titik Potong Sumbu-y",
    text: "Substitusi x = 0 → f(0) = c. Titik potong = (0, c). Selalu tepat 1 titik!",
    tone: "cyan",
  },
  {
    title: "Titik Potong Sumbu-x",
    text: "Substitusi y = 0 → ax² + bx + c = 0. Selesaikan PK. Titik potong = (akar, 0).",
    tone: "amber",
  },
  {
    title: "Banyak Titik Potong x",
    text: "Bergantung pada D = b² − 4ac. D > 0 → 2 titik; D = 0 → 1 titik (menyentuh); D < 0 → 0 titik.",
    tone: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fk-titik-game-banyak",
    title: "🎯 Game 1 — Banyaknya Titik Potong Sumbu-x",
    description: "Seret tiap FK ke kategori banyaknya titik potong dgn sumbu-x!",
    buckets: [
      { id: "n0", label: "0 titik (D < 0)", emoji: "❌", color: "rose" },
      { id: "n1", label: "1 titik (D = 0)", emoji: "1️⃣", color: "amber" },
      { id: "n2", label: "2 titik (D > 0)", emoji: "✌️", color: "emerald" },
    ],
    items: [
      { id: "t1", label: "f(x) = x² − 5x + 6", bucketId: "n2", emoji: "📈" },
      { id: "t2", label: "f(x) = x² − 4x + 4", bucketId: "n1", emoji: "📈" },
      { id: "t3", label: "f(x) = x² + 1", bucketId: "n0", emoji: "📈" },
      { id: "t4", label: "f(x) = x² − 9", bucketId: "n2", emoji: "📈" },
      { id: "t5", label: "f(x) = x² + 6x + 9", bucketId: "n1", emoji: "📈" },
      { id: "t6", label: "f(x) = x² + 2x + 5", bucketId: "n0", emoji: "📈" },
      { id: "t7", label: "f(x) = 2x² − 8", bucketId: "n2", emoji: "📈" },
      { id: "t8", label: "f(x) = x² + 4", bucketId: "n0", emoji: "📈" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fk-titik-game-akar",
    title: "🎯 Game 2 — Titik Potong Sumbu-x",
    description: "Pasangkan tiap FK dengan titik potong sumbu-x-nya. Tekan ◀ ▶.",
    rightOptions: [
      "(2,0) & (3,0)",
      "(−2,0) & (−3,0)",
      "(−1,0) & (4,0)",
      "(−3,0) & (3,0)",
      "(0,0) & (5,0)",
      "(2,0) saja",
    ],
    pairs: [
      { id: "tp1", left: "f(x) = x² − 5x + 6", correctRight: "(2,0) & (3,0)", emoji: "🎯" },
      { id: "tp2", left: "f(x) = x² + 5x + 6", correctRight: "(−2,0) & (−3,0)", emoji: "🎯" },
      { id: "tp3", left: "f(x) = x² − 3x − 4", correctRight: "(−1,0) & (4,0)", emoji: "🎯" },
      { id: "tp4", left: "f(x) = x² − 9", correctRight: "(−3,0) & (3,0)", emoji: "🎯" },
      { id: "tp5", left: "f(x) = x² − 5x", correctRight: "(0,0) & (5,0)", emoji: "🎯" },
      { id: "tp6", left: "f(x) = x² − 4x + 4", correctRight: "(2,0) saja", emoji: "🎯" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Titik potong f(x) = 2x² − 7x + 3 dgn sumbu-y = …",
    kind: "choice",
    options: ["(0, 3)", "(0, −3)", "(0, 7)", "(0, 2)"],
    correctIndex: 0,
    hint: "f(0) = c.",
    discussion: ["c = 3 → (0, 3)."],
  },
  {
    id: "pp2",
    question: "Titik potong f(x) = x² + 4x − 5 dgn sumbu-x adalah …",
    kind: "choice",
    options: ["(1,0) & (−5,0)", "(−1,0) & (5,0)", "(1,0) & (5,0)", "(−1,0) & (−5,0)"],
    correctIndex: 0,
    hint: "(x+5)(x−1)=0.",
    discussion: ["x = 1 atau x = −5 → (1, 0) dan (−5, 0)."],
  },
  {
    id: "pp3",
    question:
      "Banyaknya titik potong f(x) = x² + 2x + 5 dengan sumbu-x = …",
    kind: "fill",
    answers: ["0"],
    hint: "D = 4 − 20 = −16.",
    discussion: ["D < 0 → TIDAK memotong sumbu-x."],
  },
  {
    id: "pp4",
    question:
      "Pernyataan: Parabola f(x) = x² − 6x + 9 menyentuh sumbu-x di tepat 1 titik.",
    kind: "truefalse",
    correct: true,
    hint: "D = 36 − 36 = 0.",
    discussion: ["BENAR. D = 0 → menyentuh di (3, 0)."],
  },
  {
    id: "pp5",
    question:
      "Titik potong f(x) = (2x − 1)(x + 4) dengan sumbu-x = …",
    kind: "choice",
    options: ["(1/2, 0) & (−4, 0)", "(−1/2, 0) & (4, 0)", "(2, 0) & (−4, 0)", "(1, 0) & (−4, 0)"],
    correctIndex: 0,
    hint: "Setiap faktor = 0.",
    discussion: ["2x − 1 = 0 → x = 1/2; x + 4 = 0 → x = −4."],
  },
  {
    id: "pp6",
    question:
      "Titik potong f(x) = (2x − 1)(x + 4) dengan sumbu-y = …",
    kind: "choice",
    options: ["(0, −4)", "(0, 4)", "(0, −1)", "(0, 1)"],
    correctIndex: 0,
    hint: "f(0) = (−1)(4) = −4.",
    discussion: ["f(0) = −4 → (0, −4)."],
  },
  {
    id: "pp7",
    question:
      "FK f(x) = −x² + 4x − 4 memiliki titik potong sumbu-x sebanyak …",
    kind: "fill",
    answers: ["1"],
    hint: "D = 16 − 16 = 0.",
    discussion: ["D = 0 → 1 titik (menyentuh)."],
  },
  {
    id: "pp8",
    question:
      "Pernyataan: Setiap parabola SELALU memotong sumbu-y di tepat 1 titik.",
    kind: "truefalse",
    correct: true,
    hint: "f(0) = c selalu ada.",
    discussion: ["BENAR. Setiap FK memiliki nilai f(0) = c → tepat 1 titik (0, c)."],
  },
];

const TitikPotongLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan FK"
    title="Titik Potong terhadap Sumbu — Penemuan Terbimbing"
    intro="Sobat Numatik 🎯! Saatnya MENEMBAK titik potong parabola dengan sumbu! Sumbu-y → substitusi x=0 → (0, c). Sumbu-x → substitusi y=0 → selesaikan PK. Banyaknya titik potong tergantung pada DISKRIMINAN!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus titik potong."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Menu Fungsi Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Titik potong sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang substitusi x=0 dan y=0.",
      low: "💪 Tetap semangat! Mulai dari titik potong sumbu-y.",
    }}
  />
);

export default TitikPotongLKPDPage;
