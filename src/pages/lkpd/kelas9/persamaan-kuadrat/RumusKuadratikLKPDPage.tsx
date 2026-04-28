import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Rumus ABC (Kuadratik)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="28" fontSize="13" fontWeight="bold" fill="#a78bfa" textAnchor="middle">PK: ax² + bx + c = 0</text>
          <text x="140" y="52" fontSize="10" fill="#fde68a" textAnchor="middle">Akar-akarnya:</text>
          <rect x="20" y="65" width="240" height="60" rx="10" fill="#22d3ee" fillOpacity="0.35" stroke="#67e8f9" strokeWidth="2" />
          <text x="140" y="92" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">x = (−b ± √(b² − 4ac)) / 2a</text>
          <text x="140" y="113" fontSize="10" fill="#fde68a" textAnchor="middle">"plus-minus" → 2 akar</text>
          <rect x="40" y="140" width="200" height="48" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="160" fontSize="11" fill="#fff" textAnchor="middle">D = b² − 4ac (DISKRIMINAN)</text>
          <text x="140" y="180" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">x = (−b ± √D) / 2a</text>
        </svg>
      </div>
    ),
    text:
      "Saat pemfaktoran SULIT (akar bukan bilangan bulat), gunakan RUMUS KUADRATIK / ABC: x = (−b ± √(b²−4ac)) / 2a. Tanda ± menghasilkan 2 akar (x₁ dan x₂). D = b²−4ac disebut DISKRIMINAN.",
  },
  {
    title: "Situasi 2 — Contoh Penerapan",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 220" className="w-full">
          <rect width="280" height="220" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="12" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">x² − 5x + 6 = 0 (a=1, b=−5, c=6)</text>
          <rect x="20" y="38" width="240" height="22" rx="6" fill="#a7f3d0" fillOpacity="0.3" />
          <text x="140" y="54" fontSize="10" fill="#fff" textAnchor="middle">D = (−5)² − 4(1)(6) = 25 − 24 = 1</text>
          <rect x="20" y="65" width="240" height="22" rx="6" fill="#fde68a" fillOpacity="0.3" />
          <text x="140" y="81" fontSize="10" fill="#fff" textAnchor="middle">x = (−(−5) ± √1) / 2(1) = (5 ± 1) / 2</text>
          <rect x="20" y="92" width="240" height="22" rx="6" fill="#fbbf24" fillOpacity="0.4" />
          <text x="140" y="108" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">x₁ = (5+1)/2 = 3, x₂ = (5−1)/2 = 2</text>
          <text x="140" y="135" fontSize="11" fontWeight="bold" fill="#22d3ee" textAnchor="middle">x² − 2x − 4 = 0 (a=1, b=−2, c=−4)</text>
          <rect x="20" y="148" width="240" height="22" rx="6" fill="#a7f3d0" fillOpacity="0.3" />
          <text x="140" y="164" fontSize="10" fill="#fff" textAnchor="middle">D = 4 + 16 = 20 = 4·5</text>
          <rect x="20" y="175" width="240" height="22" rx="6" fill="#fde68a" fillOpacity="0.3" />
          <text x="140" y="190" fontSize="10" fill="#fff" textAnchor="middle">x = (2 ± √20)/2 = (2 ± 2√5)/2</text>
          <rect x="20" y="200" width="240" height="18" rx="6" fill="#34d399" fillOpacity="0.4" />
          <text x="140" y="213" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">x = 1 ± √5</text>
        </svg>
      </div>
    ),
    text:
      "Rumus KUADRATIK bisa untuk SEMUA PK, termasuk yang akarnya BUKAN bilangan bulat (mengandung √). Identifikasi a, b, c dengan tepat termasuk TANDA-nya, lalu hitung D dulu sebelum menggunakan rumus.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Rumus kuadratik / ABC adalah x = …",
    kind: "choice",
    options: [
      "(b ± √(b² − 4ac)) / 2a",
      "(−b ± √(b² − 4ac)) / 2a",
      "(−b ± √(b² + 4ac)) / 2a",
      "(b ± √(4ac − b²)) / 2a",
    ],
    correctIndex: 1,
    discussion: ["x = (−b ± √(b²−4ac)) / 2a — hafalkan!"],
  },
  {
    id: "g2",
    label: "Untuk x² − 5x + 6 = 0, nilai (a, b, c) = …",
    kind: "choice",
    options: ["(1, 5, 6)", "(1, −5, 6)", "(−1, 5, −6)", "(1, −5, −6)"],
    correctIndex: 1,
    discussion: ["a=1, b=−5, c=6."],
  },
  {
    id: "g3",
    label: "Hitung D = b² − 4ac untuk x² − 5x + 6 = 0. D = …",
    kind: "fill",
    answers: ["1"],
    discussion: ["(−5)² − 4(1)(6) = 25 − 24 = 1."],
  },
  {
    id: "g4",
    label:
      "Hitung x untuk PK x² − 5x + 6 = 0 menggunakan rumus ABC. Akar-akarnya …",
    kind: "choice",
    options: ["x = 2 dan x = 3", "x = −2 dan x = −3", "x = 1 dan x = 6", "x = −1 dan x = −6"],
    correctIndex: 0,
    discussion: ["x = (5 ± 1)/2 → x = 3 atau x = 2."],
  },
  {
    id: "g5",
    label: "Untuk PK 2x² − 7x + 3 = 0, hitung D = …",
    kind: "fill",
    answers: ["25"],
    discussion: ["(−7)² − 4(2)(3) = 49 − 24 = 25."],
  },
  {
    id: "g6",
    label: "Akar-akar PK 2x² − 7x + 3 = 0 adalah …",
    kind: "choice",
    options: ["x = 3 dan x = 1/2", "x = −3 dan x = 1/2", "x = 3 dan x = −1/2", "x = 1 dan x = 3/2"],
    correctIndex: 0,
    discussion: ["x = (7 ± 5)/4 → x = 12/4 = 3 atau x = 2/4 = 1/2."],
  },
  {
    id: "g7",
    label: "PK x² − 4x + 1 = 0 memiliki D = …",
    kind: "fill",
    answers: ["12"],
    discussion: ["16 − 4 = 12."],
  },
  {
    id: "g8",
    label: "Akar-akar PK x² − 4x + 1 = 0 adalah …",
    kind: "choice",
    options: ["2 ± √3", "2 ± √2", "1 ± √3", "4 ± 2√3"],
    correctIndex: 0,
    discussion: ["x = (4 ± √12)/2 = (4 ± 2√3)/2 = 2 ± √3."],
  },
  {
    id: "g9",
    label: "Pernyataan: Rumus ABC HANYA berlaku jika PK bisa difaktorkan.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Rumus ABC berlaku untuk SEMUA PK (asal D ≥ 0 untuk akar real).",
    ],
  },
  {
    id: "g10",
    label: "Pasangkan PK dengan nilai DISKRIMINAN-nya:",
    kind: "match",
    pairs: [
      { left: "x² − 5x + 6 = 0", right: "1" },
      { left: "x² − 4x + 4 = 0", right: "0" },
      { left: "2x² − 7x + 3 = 0", right: "25" },
      { left: "x² − 4x + 1 = 0", right: "12" },
    ],
    discussion: ["D = b² − 4ac untuk masing-masing PK."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Rumus Kuadratik (ABC)",
    text: "x = (−b ± √(b² − 4ac)) / 2a. Berlaku untuk SEMUA persamaan kuadrat.",
    tone: "violet",
  },
  {
    title: "Diskriminan D",
    text: "D = b² − 4ac. Hitung D dulu sebelum mengakar! D ≥ 0 → akar real, D < 0 → tidak ada akar real.",
    tone: "cyan",
  },
  {
    title: "Strategi Pemilihan Metode",
    text: "Faktorisasi → cepat untuk koefisien kecil & akar bulat. Rumus ABC → wajib jika akar berupa bentuk akar atau koefisien sulit.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "abc-game-d",
    title: "🎯 Game 1 — Hitung Diskriminan",
    description: "Seret tiap PK ke nilai DISKRIMINAN-nya yang TEPAT!",
    buckets: [
      { id: "d0", label: "D = 0", emoji: "⚖️", color: "rose" },
      { id: "d1", label: "D = 1", emoji: "1️⃣", color: "cyan" },
      { id: "d9", label: "D = 9", emoji: "9️⃣", color: "violet" },
      { id: "d25", label: "D = 25", emoji: "🎯", color: "amber" },
      { id: "dneg", label: "D < 0", emoji: "❌", color: "emerald" },
    ],
    items: [
      { id: "d_a", label: "x² − 4x + 4 = 0", bucketId: "d0", emoji: "📐" },
      { id: "d_b", label: "x² − 5x + 6 = 0", bucketId: "d1", emoji: "📐" },
      { id: "d_c", label: "x² − 5x + 4 = 0", bucketId: "d9", emoji: "📐" },
      { id: "d_d", label: "2x² − 7x + 3 = 0", bucketId: "d25", emoji: "📐" },
      { id: "d_e", label: "x² + 1 = 0", bucketId: "dneg", emoji: "📐" },
      { id: "d_f", label: "x² + 2x + 1 = 0", bucketId: "d0", emoji: "📐" },
      { id: "d_g", label: "x² + 2 = 0", bucketId: "dneg", emoji: "📐" },
      { id: "d_h", label: "x² − 7x + 12 = 0", bucketId: "d1", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "abc-game-akar",
    title: "🎯 Game 2 — Tebak Akar via ABC",
    description: "Pasangkan tiap PK dengan akar-akarnya. Tekan ◀ ▶.",
    rightOptions: ["2, 3", "−1, 3", "1/2, 3", "1 ± √2", "2 ± √3", "−2 ± √3"],
    pairs: [
      { id: "abc1", left: "x² − 5x + 6 = 0", correctRight: "2, 3", emoji: "📐" },
      { id: "abc2", left: "x² − 2x − 3 = 0", correctRight: "−1, 3", emoji: "📐" },
      { id: "abc3", left: "2x² − 7x + 3 = 0", correctRight: "1/2, 3", emoji: "📐" },
      { id: "abc4", left: "x² − 2x − 1 = 0", correctRight: "1 ± √2", emoji: "📐" },
      { id: "abc5", left: "x² − 4x + 1 = 0", correctRight: "2 ± √3", emoji: "📐" },
      { id: "abc6", left: "x² + 4x + 1 = 0", correctRight: "−2 ± √3", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Tentukan akar PK x² + 7x + 12 = 0 dengan rumus ABC.",
    kind: "choice",
    options: ["−3, −4", "3, 4", "−3, 4", "3, −4"],
    correctIndex: 0,
    hint: "D = 49 − 48 = 1.",
    discussion: ["x = (−7 ± 1)/2 → x = −3 atau x = −4."],
  },
  {
    id: "pp2",
    question:
      "Akar PK 3x² + 5x − 2 = 0 adalah …",
    kind: "choice",
    options: ["x = 1/3, x = −2", "x = −1/3, x = 2", "x = 1, x = −2/3", "x = 3, x = −1"],
    correctIndex: 0,
    hint: "D = 25 + 24 = 49.",
    discussion: ["x = (−5 ± 7)/6 → x = 1/3 atau x = −2."],
  },
  {
    id: "pp3",
    question:
      "Diskriminan PK x² − 6x + 9 = 0 adalah …",
    kind: "fill",
    answers: ["0"],
    hint: "36 − 36.",
    discussion: ["D = 36 − 36 = 0 (akar kembar)."],
  },
  {
    id: "pp4",
    question:
      "Akar PK x² + 6x + 9 = 0 adalah …",
    kind: "choice",
    options: ["x = −3 (kembar)", "x = 3 (kembar)", "x = ±3", "x = ±9"],
    correctIndex: 0,
    hint: "D = 0 → akar kembar.",
    discussion: ["x = −6/2 = −3 (akar kembar)."],
  },
  {
    id: "pp5",
    question:
      "Akar PK x² − 6x + 4 = 0 dalam bentuk akar adalah …",
    kind: "choice",
    options: ["3 ± √5", "3 ± √2", "6 ± √5", "−3 ± √5"],
    correctIndex: 0,
    hint: "D = 36 − 16 = 20.",
    discussion: ["x = (6 ± √20)/2 = (6 ± 2√5)/2 = 3 ± √5."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Jika D = 0, maka PK memiliki AKAR KEMBAR (akar yang sama).",
    kind: "truefalse",
    correct: true,
    hint: "Hitung x = −b/2a.",
    discussion: ["BENAR. x₁ = x₂ = −b/2a saat D = 0."],
  },
  {
    id: "pp7",
    question: "Diskriminan PK 2x² + 3x − 5 = 0 = …",
    kind: "fill",
    answers: ["49"],
    hint: "9 + 40.",
    discussion: ["D = 9 − 4(2)(−5) = 9 + 40 = 49."],
  },
  {
    id: "pp8",
    question:
      "Akar PK 2x² + 3x − 5 = 0 = …",
    kind: "choice",
    options: ["x = 1, x = −5/2", "x = −1, x = 5/2", "x = 1, x = 5/2", "x = −1, x = −5/2"],
    correctIndex: 0,
    hint: "D = 49, √D = 7.",
    discussion: ["x = (−3 ± 7)/4 → x = 1 atau x = −5/2."],
  },
];

const RumusKuadratikLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan PK"
    title="Rumus Kuadratik (ABC) — Penemuan Terbimbing"
    intro="Sobat Numatik 📐! Saatnya belajar SENJATA AMPUH untuk PK: RUMUS KUADRATIK alias rumus ABC! Kamu akan menemukan rumus x = (−b ± √(b²−4ac))/2a dan menggunakannya untuk MEMECAHKAN PK apa pun, termasuk yang akarnya berupa bentuk akar."
    situations={situations}
    guidedIntro="Jawab berurutan untuk menerapkan rumus kuadratik."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Menu Persamaan Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Rumus ABC sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Hafalkan dulu rumus ABC dan hitung D.",
      low: "💪 Tetap semangat! Mulai dari identifikasi a, b, c.",
    }}
  />
);

export default RumusKuadratikLKPDPage;
