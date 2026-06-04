import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Sumbu Simetri",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-700/20 border border-fuchsia-300/40 p-3">
        <svg viewBox="0 0 280 220" className="w-full">
          <rect width="280" height="220" fill="#0b1220" rx="8" />
          <line x1="20" y1="180" x2="260" y2="180" stroke="#94a3b8" strokeWidth="1" />
          <line x1="140" y1="20" x2="140" y2="200" stroke="#f0abfc" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 60 60 Q 140 240 220 60" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          <circle cx="140" cy="140" r="6" fill="#fde68a" stroke="#fbbf24" strokeWidth="2" />
          <text x="148" y="135" fontSize="11" fontWeight="bold" fill="#fde68a">PUNCAK</text>
          <text x="148" y="148" fontSize="9" fill="#a7f3d0">(xₚ, yₚ)</text>
          <text x="155" y="35" fontSize="11" fontWeight="bold" fill="#f0abfc">x = xₚ</text>
          <text x="155" y="48" fontSize="9" fill="#f0abfc">SUMBU SIMETRI</text>
          <rect x="20" y="195" width="240" height="20" rx="6" fill="#a78bfa" fillOpacity="0.4" />
          <text x="140" y="210" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">xₚ = −b/(2a)</text>
        </svg>
      </div>
    ),
    text:
      "SUMBU SIMETRI parabola adalah garis vertikal x = xₚ yang membelah parabola jadi 2 bagian SAMA & CERMINAN. Rumus: xₚ = −b/(2a). Sumbu simetri MELEWATI titik puncak.",
  },
  {
    title: "Situasi 2 — Titik Puncak (Optimum)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-fuchsia-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="12" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">Titik Puncak (xₚ, yₚ)</text>
          <rect x="20" y="35" width="240" height="32" rx="6" fill="#22d3ee" fillOpacity="0.4" />
          <text x="140" y="55" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">xₚ = −b/(2a)</text>
          <rect x="20" y="72" width="240" height="32" rx="6" fill="#a78bfa" fillOpacity="0.4" />
          <text x="140" y="92" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">yₚ = f(xₚ) = −D/(4a)</text>
          <rect x="20" y="115" width="240" height="32" rx="6" fill="#fbbf24" fillOpacity="0.4" />
          <text x="140" y="135" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"a > 0 → MIN, a < 0 → MAKS"}</text>
          <rect x="40" y="158" width="200" height="32" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="178" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">D = b² − 4ac (sama dgn PK)</text>
        </svg>
      </div>
    ),
    text:
      "Titik puncak P(xₚ, yₚ) adalah titik EKSTREM parabola. xₚ = −b/(2a), yₚ = −D/(4a) (atau substitusi xₚ ke f). a > 0 → P = titik MIN; a < 0 → P = titik MAKS. yₚ = nilai optimum.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Rumus sumbu simetri parabola adalah xₚ = …",
    kind: "choice",
    options: ["−b/(2a)", "b/(2a)", "−b/a", "b² − 4ac"],
    correctIndex: 0,
    discussion: ["xₚ = −b/(2a). Hafalkan!"],
  },
  {
    id: "g2",
    label: "Untuk f(x) = x² − 4x + 3, sumbu simetrinya adalah x = …",
    kind: "fill",
    answers: ["2"],
    discussion: ["xₚ = −(−4)/(2·1) = 4/2 = 2."],
  },
  {
    id: "g3",
    label: "Substitusi xₚ = 2 ke f(x) = x² − 4x + 3 → yₚ = …",
    kind: "fill",
    answers: ["-1", "−1"],
    discussion: ["f(2) = 4 − 8 + 3 = −1."],
  },
  {
    id: "g4",
    label: "Maka titik puncak f(x) = x² − 4x + 3 adalah …",
    kind: "choice",
    options: ["(2, −1)", "(−2, 1)", "(−1, 2)", "(1, −2)"],
    correctIndex: 0,
    discussion: ["P = (xₚ, yₚ) = (2, −1)."],
  },
  {
    id: "g5",
    label:
      "Karena a = 1 > 0, titik puncak (2, −1) adalah titik … dgn nilai minimum yₚ = …",
    kind: "fill",
    answers: ["-1", "−1", "min -1"],
    discussion: ["Titik MIN. Nilai minimum f(x) = −1."],
  },
  {
    id: "g6",
    label: "Untuk f(x) = −x² + 6x − 5, sumbu simetri x = …",
    kind: "fill",
    answers: ["3"],
    discussion: ["xₚ = −6/(2·−1) = 3."],
  },
  {
    id: "g7",
    label: "Nilai f(3) untuk f(x) = −x² + 6x − 5 = …",
    kind: "fill",
    answers: ["4"],
    discussion: ["f(3) = −9 + 18 − 5 = 4."],
  },
  {
    id: "g8",
    label: "Karena a = −1 < 0, titik puncak (3, 4) adalah titik … dgn nilai maks = …",
    kind: "fill",
    answers: ["4", "maks 4"],
    discussion: ["Titik MAKS, dengan nilai maksimum f(x) = 4."],
  },
  {
    id: "g9",
    label:
      "Hitung yₚ langsung dgn rumus −D/(4a) untuk f(x) = x² − 4x + 3 (a=1, b=−4, c=3): D = 16 − 12 = 4 → yₚ = …",
    kind: "fill",
    answers: ["-1", "−1"],
    discussion: ["yₚ = −4/(4·1) = −1 ✓ (sama dengan substitusi)."],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Sumbu simetri SELALU melewati titik puncak parabola.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Titik puncak terletak tepat di sumbu simetri.",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan FK dengan sumbu simetrinya:",
    kind: "match",
    pairs: [
      { left: "f(x) = x² − 4x + 3", right: "x = 2" },
      { left: "f(x) = x² + 6x + 5", right: "x = −3" },
      { left: "f(x) = 2x² − 8x", right: "x = 2" },
      { left: "f(x) = x² − 9", right: "x = 0" },
    ],
    discussion: ["xₚ = −b/(2a) untuk masing-masing FK."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Sumbu Simetri",
    text: "x = xₚ = −b/(2a). Garis vertikal yang membelah parabola jadi 2 bagian cermin. Selalu lewat titik puncak.",
    tone: "fuchsia",
  },
  {
    title: "Titik Puncak (Optimum)",
    text: "P(xₚ, yₚ) dengan xₚ = −b/(2a) dan yₚ = f(xₚ) = −D/(4a). a > 0 → MIN; a < 0 → MAKS.",
    tone: "cyan",
  },
  {
    title: "Cara Cepat yₚ",
    text: "Hitung D = b² − 4ac dulu, lalu yₚ = −D/(4a). Atau substitusi xₚ ke f(x). Pilih yang lebih cepat!",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fk-puncak-game-jenis",
    title: "🎯 Game 1 — Titik MAKS atau MIN?",
    description: "Seret tiap FK ke jenis titik puncaknya!",
    buckets: [
      { id: "min", label: "Titik MIN (a > 0)", emoji: "🔻", color: "emerald" },
      { id: "maks", label: "Titik MAKS (a < 0)", emoji: "🔺", color: "amber" },
    ],
    items: [
      { id: "pq1", label: "f(x) = x² − 4x + 3", bucketId: "min", emoji: "📈" },
      { id: "pq2", label: "f(x) = −x² + 6x − 5", bucketId: "maks", emoji: "📉" },
      { id: "pq3", label: "f(x) = 3x² − 12x", bucketId: "min", emoji: "📈" },
      { id: "pq4", label: "f(x) = −2x² + 4x − 3", bucketId: "maks", emoji: "📉" },
      { id: "pq5", label: "f(x) = x² + 6x + 5", bucketId: "min", emoji: "📈" },
      { id: "pq6", label: "f(x) = −x² − 4x", bucketId: "maks", emoji: "📉" },
      { id: "pq7", label: "f(x) = 0.5x² − 3", bucketId: "min", emoji: "📈" },
      { id: "pq8", label: "f(x) = −5x² + 10x", bucketId: "maks", emoji: "📉" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fk-puncak-game-koord",
    title: "🎯 Game 2 — Titik Puncak (xₚ, yₚ)",
    description: "Pasangkan tiap FK dengan koordinat puncaknya. Tekan ◀ ▶.",
    rightOptions: [
      "(2, −1)",
      "(3, 4)",
      "(−3, −4)",
      "(0, −9)",
      "(2, −12)",
      "(1, 2)",
      "(−1, 2)",
    ],
    pairs: [
      { id: "pp1", left: "f(x) = x² − 4x + 3", correctRight: "(2, −1)", emoji: "🎯" },
      { id: "pp2", left: "f(x) = −x² + 6x − 5", correctRight: "(3, 4)", emoji: "🎯" },
      { id: "pp3", left: "f(x) = x² + 6x + 5", correctRight: "(−3, −4)", emoji: "🎯" },
      { id: "pp4", left: "f(x) = x² − 9", correctRight: "(0, −9)", emoji: "🎯" },
      { id: "pp5", left: "f(x) = 3x² − 12x", correctRight: "(2, −12)", emoji: "🎯" },
      { id: "pp6", left: "f(x) = −x² + 2x + 1", correctRight: "(1, 2)", emoji: "🎯" },
      { id: "pp7", left: "f(x) = −x² − 2x + 1", correctRight: "(−1, 2)", emoji: "🎯" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Sumbu simetri f(x) = 2x² − 8x + 5 adalah x = …",
    kind: "fill",
    answers: ["2"],
    hint: "−b/(2a).",
    discussion: ["xₚ = −(−8)/(2·2) = 8/4 = 2."],
  },
  {
    id: "pp2",
    question: "Nilai minimum dari f(x) = 2x² − 8x + 5 = …",
    kind: "fill",
    answers: ["-3", "−3"],
    hint: "f(2) = 8 − 16 + 5.",
    discussion: ["f(2) = −3."],
  },
  {
    id: "pp3",
    question: "Titik puncak f(x) = −x² + 4x + 5 adalah …",
    kind: "choice",
    options: ["(2, 9)", "(−2, 9)", "(2, −9)", "(4, 5)"],
    correctIndex: 0,
    hint: "xₚ = 2.",
    discussion: ["f(2) = −4 + 8 + 5 = 9 → P(2, 9)."],
  },
  {
    id: "pp4",
    question:
      "Pernyataan: Untuk f(x) = 3x² − 6x + 1, nilai yₚ = −D/(4a) = −(36 − 12)/12 = −2.",
    kind: "truefalse",
    correct: true,
    hint: "Hitung D dan substitusi.",
    discussion: ["D = 36 − 12 = 24 → yₚ = −24/12 = −2 ✓."],
  },
  {
    id: "pp5",
    question:
      "Sumbu simetri f(x) = (x − 3)² + 5 adalah x = …",
    kind: "fill",
    answers: ["3"],
    hint: "Bentuk vertex: f(x) = a(x − h)² + k → h = 3.",
    discussion: ["Sumbu simetri = h = 3."],
  },
  {
    id: "pp6",
    question: "Nilai maksimum f(x) = −2x² + 8x − 3 = …",
    kind: "fill",
    answers: ["5"],
    hint: "xₚ = 2 → f(2) = −8 + 16 − 3.",
    discussion: ["f(2) = 5."],
  },
  {
    id: "pp7",
    question:
      "Diketahui titik puncak parabola = (1, −4). Sumbu simetrinya …",
    kind: "choice",
    options: ["x = 1", "x = −4", "y = 1", "y = −4"],
    correctIndex: 0,
    hint: "Sumbu simetri = absis puncak.",
    discussion: ["x = xₚ = 1."],
  },
  {
    id: "pp8",
    question:
      "FK f(x) = x² + 2x + 5 memiliki nilai minimum = …",
    kind: "fill",
    answers: ["4"],
    hint: "xₚ = −1, f(−1) = 1 − 2 + 5 = 4.",
    discussion: ["f(−1) = 4."],
  },
];

const SumbuSimetriPuncakLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan FK"
    title="Sumbu Simetri & Titik Puncak — Penemuan Terbimbing"
    intro="Sobat Numatik 🪞! Ayo cari CERMIN parabola — SUMBU SIMETRI x = −b/(2a) — dan titik EKSTREM-nya: titik PUNCAK P(xₚ, yₚ). Inilah jantung parabola yang menentukan nilai MAKSIMUM atau MINIMUM!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus sumbu simetri & puncak."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Menu Fungsi Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Sumbu simetri & puncak sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang rumus xₚ = −b/(2a).",
      low: "💪 Tetap semangat! Mulai dari menghitung xₚ.",
    }}
  />
);

export default SumbuSimetriPuncakLKPDPage;
