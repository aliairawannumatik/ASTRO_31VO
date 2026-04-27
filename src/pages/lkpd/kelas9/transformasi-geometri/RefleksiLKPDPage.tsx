import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const Grid = ({ children }: { children: React.ReactNode }) => (
  <g>
    {Array.from({ length: 13 }).map((_, i) => (
      <line key={`v${i}`} x1={20 + i * 20} y1="20" x2={20 + i * 20} y2="220" stroke="#1e3a5f" strokeWidth="0.5" />
    ))}
    {Array.from({ length: 11 }).map((_, i) => (
      <line key={`h${i}`} x1="20" y1={20 + i * 20} x2="280" y2={20 + i * 20} stroke="#1e3a5f" strokeWidth="0.5" />
    ))}
    <line x1="20" y1="120" x2="280" y2="120" stroke="#67e8f9" strokeWidth="1.5" />
    <line x1="150" y1="20" x2="150" y2="220" stroke="#67e8f9" strokeWidth="1.5" />
    {children}
  </g>
);

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Bayangan di Cermin (Sumbu y)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <line x1="150" y1="10" x2="150" y2="230" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="158" y="20" fontSize="9" fill="#fbbf24">cermin (sumbu y)</text>
            <circle cx="210" cy="80" r="6" fill="#34d399" stroke="#6ee7b7" strokeWidth="2" />
            <text x="218" y="76" fontSize="9" fill="#34d399">A(3, 2)</text>
            <circle cx="90" cy="80" r="6" fill="#f472b6" stroke="#f9a8d4" strokeWidth="2" />
            <text x="50" y="76" fontSize="9" fill="#f472b6">A'(−3, 2)</text>
            <line x1="90" y1="80" x2="210" y2="80" stroke="#a7f3d0" strokeWidth="0.7" strokeDasharray="2 2" />
          </Grid>
        </svg>
      </div>
    ),
    text:
      "Cermin di SUMBU Y memetakan A(3, 2) menjadi A'(−3, 2). Nilai x BERLAWANAN tanda, nilai y TETAP. Ini disebut REFLEKSI (PENCERMINAN).",
  },
  {
    title: "Situasi 2 — Cermin Diagonal (Garis y = x)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <line x1="50" y1="220" x2="250" y2="20" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
            <text x="240" y="35" fontSize="9" fill="#fbbf24">y = x</text>
            <circle cx="210" cy="100" r="6" fill="#34d399" stroke="#6ee7b7" strokeWidth="2" />
            <text x="218" y="96" fontSize="9" fill="#34d399">B(3, 1)</text>
            <circle cx="170" cy="60" r="6" fill="#f472b6" stroke="#f9a8d4" strokeWidth="2" />
            <text x="178" y="56" fontSize="9" fill="#f472b6">B'(1, 3)</text>
            <line x1="170" y1="60" x2="210" y2="100" stroke="#a7f3d0" strokeWidth="0.7" strokeDasharray="2 2" />
          </Grid>
        </svg>
      </div>
    ),
    text:
      "Cermin garis y = x memetakan B(3, 1) menjadi B'(1, 3). Koordinat x dan y SALING TUKAR! Ini cermin diagonal — sangat menarik!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Refleksi A(4, 5) terhadap SUMBU X menghasilkan A' = …",
    kind: "fill",
    answers: ["(4, -5)", "(4,-5)", "(4, −5)", "4, -5", "4,-5"],
    discussion: [
      "Refleksi terhadap SUMBU X: (x, y) → (x, −y).",
      "x tetap, y berlawanan tanda. → A'(4, −5).",
    ],
  },
  {
    id: "g2",
    label:
      "Refleksi B(−3, 7) terhadap SUMBU Y menghasilkan B' = …",
    kind: "fill",
    answers: ["(3, 7)", "(3,7)", "3,7"],
    discussion: [
      "Refleksi terhadap SUMBU Y: (x, y) → (−x, y).",
      "x berlawanan tanda, y tetap. → B'(3, 7).",
    ],
  },
  {
    id: "g3",
    label: "Aturan refleksi terhadap SUMBU X: (x, y) → …",
    kind: "choice",
    options: ["(−x, y)", "(x, −y)", "(y, x)", "(−x, −y)"],
    correctIndex: 1,
    discussion: [
      "Sumbu X = cermin horizontal. y dibalik tandanya.",
      "(x, y) → (x, −y).",
    ],
  },
  {
    id: "g4",
    label: "Aturan refleksi terhadap SUMBU Y: (x, y) → …",
    kind: "choice",
    options: ["(−x, y)", "(x, −y)", "(y, x)", "(−x, −y)"],
    correctIndex: 0,
    discussion: ["Sumbu Y = cermin vertikal. x dibalik tandanya. → (−x, y)."],
  },
  {
    id: "g5",
    label:
      "Refleksi C(2, 5) terhadap GARIS y = x menghasilkan C' = …",
    kind: "fill",
    answers: ["(5, 2)", "(5,2)", "5,2"],
    discussion: [
      "Refleksi terhadap y = x: (x, y) → (y, x). x dan y SALING TUKAR.",
      "C'(5, 2).",
    ],
  },
  {
    id: "g6",
    label:
      "Refleksi D(3, −4) terhadap GARIS y = −x menghasilkan D' = …",
    kind: "fill",
    answers: ["(4, -3)", "(4,-3)", "(4, −3)", "4, -3", "4,-3"],
    discussion: [
      "Refleksi terhadap y = −x: (x, y) → (−y, −x).",
      "D'(−(−4), −3) = D'(4, −3).",
    ],
  },
  {
    id: "g7",
    label:
      "Refleksi E(2, 3) terhadap TITIK ASAL O(0,0) menghasilkan E' = …",
    kind: "fill",
    answers: ["(-2, -3)", "(-2,-3)", "(−2, −3)", "-2, -3", "-2,-3"],
    discussion: [
      "Refleksi terhadap titik O: (x, y) → (−x, −y).",
      "E'(−2, −3). Ini juga setara dengan rotasi 180° terhadap O.",
    ],
  },
  {
    id: "g8",
    label:
      "Pernyataan: Refleksi mempertahankan bentuk dan ukuran (kongruen).",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Bayangan refleksi KONGRUEN dengan asal.",
      "Yang berubah: ORIENTASI (kiri ↔ kanan).",
    ],
  },
  {
    id: "g9",
    label:
      "Refleksi P(0, 6) terhadap sumbu X = …",
    kind: "fill",
    answers: ["(0, -6)", "(0,-6)", "(0, −6)", "0, -6", "0,-6"],
    discussion: ["P'(0, −6). x = 0 tetap, y dibalik."],
  },
  {
    id: "g10",
    label:
      "Refleksi Q(−5, 0) terhadap sumbu Y = …",
    kind: "fill",
    answers: ["(5, 0)", "(5,0)", "5,0"],
    discussion: ["Q'(5, 0). x dibalik, y = 0 tetap."],
  },
  {
    id: "g11",
    label:
      "Pernyataan: Refleksi DUA KALI terhadap sumbu yang SAMA mengembalikan titik ke posisi semula.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Refleksi adalah involusi: dua kali = identitas.",
      "Misal: A(3, 2) → A'(−3, 2) → A''(3, 2) (kembali).",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan jenis refleksi dengan ATURAN-nya:",
    kind: "match",
    pairs: [
      { left: "Sumbu X", right: "(x, y) → (x, −y)" },
      { left: "Sumbu Y", right: "(x, y) → (−x, y)" },
      { left: "Garis y = x", right: "(x, y) → (y, x)" },
      { left: "Titik O(0,0)", right: "(x, y) → (−x, −y)" },
    ],
    discussion: [
      "Sumbu X balik y. Sumbu Y balik x.",
      "y = x tukar koordinat. Titik O balik keduanya.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Refleksi Sumbu",
    text: "Sumbu X: (x, y) → (x, −y). Sumbu Y: (x, y) → (−x, y). Cermin pada sumbu MEMBALIK tanda yang TEGAK LURUS sumbu.",
    tone: "cyan",
  },
  {
    title: "Refleksi Garis Diagonal",
    text: "y = x: (x, y) → (y, x) (tukar). y = −x: (x, y) → (−y, −x) (tukar lalu balik tanda). x = h: (x, y) → (2h − x, y). y = k: (x, y) → (x, 2k − y).",
    tone: "violet",
  },
  {
    title: "Sifat Refleksi",
    text: "Bayangan KONGRUEN dengan asal. Orientasi terbalik (mirror). Refleksi dua kali pada sumbu sama = identitas. Setara satu rotasi pada sudut tertentu.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "refleksi-game-aturan",
    title: "🎯 Game 1 — Pilih ATURAN Refleksi (Seret!)",
    description: "Seret setiap pemetaan ke jenis CERMIN yang sesuai.",
    buckets: [
      { id: "sx", label: "Sumbu X", emoji: "↔️", color: "emerald" },
      { id: "sy", label: "Sumbu Y", emoji: "↕️", color: "cyan" },
      { id: "yx", label: "Garis y = x", emoji: "⤢", color: "amber" },
      { id: "o", label: "Titik O(0,0)", emoji: "⭕", color: "rose" },
    ],
    items: [
      { id: "r1", label: "(3, 4) → (3, −4)", bucketId: "sx", emoji: "🪞" },
      { id: "r2", label: "(−5, 2) → (5, 2)", bucketId: "sy", emoji: "🪞" },
      { id: "r3", label: "(2, 7) → (7, 2)", bucketId: "yx", emoji: "🪞" },
      { id: "r4", label: "(4, 3) → (−4, −3)", bucketId: "o", emoji: "🪞" },
      { id: "r5", label: "(1, 8) → (1, −8)", bucketId: "sx", emoji: "🪞" },
      { id: "r6", label: "(6, 0) → (−6, 0)", bucketId: "sy", emoji: "🪞" },
      { id: "r7", label: "(−5, 1) → (1, −5)", bucketId: "yx", emoji: "🪞" },
      { id: "r8", label: "(2, −9) → (−2, 9)", bucketId: "o", emoji: "🪞" },
    ],
  },
  {
    kind: "arrow-match",
    id: "refleksi-game-bayangan",
    title: "🎯 Game 2 — Cari Bayangan Refleksi",
    description: "Pasangkan setiap titik & cermin dengan BAYANGAN-nya. Tekan ◀ ▶.",
    rightOptions: [
      "(2, −5)",
      "(−2, 5)",
      "(5, 2)",
      "(−2, −5)",
      "(−5, −2)",
      "(2, 5)",
    ],
    pairs: [
      { id: "rb1", left: "A(2, 5) – sumbu X", correctRight: "(2, −5)", emoji: "🪞" },
      { id: "rb2", left: "A(2, 5) – sumbu Y", correctRight: "(−2, 5)", emoji: "🪞" },
      { id: "rb3", left: "A(2, 5) – y = x", correctRight: "(5, 2)", emoji: "🪞" },
      { id: "rb4", left: "A(2, 5) – titik O", correctRight: "(−2, −5)", emoji: "🪞" },
      { id: "rb5", left: "A(2, 5) – y = −x", correctRight: "(−5, −2)", emoji: "🪞" },
      { id: "rb6", left: "A(2, 5) – tidak direfleksi", correctRight: "(2, 5)", emoji: "🪞" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Refleksi P(−2, 7) terhadap sumbu X = …",
    kind: "fill",
    answers: ["(-2, -7)", "(-2,-7)", "(−2, −7)", "-2, -7", "-2,-7"],
    hint: "(x, y) → (x, −y).",
    discussion: ["P'(−2, −7)."],
  },
  {
    id: "pp2",
    question: "Refleksi Q(4, −3) terhadap sumbu Y = …",
    kind: "fill",
    answers: ["(-4, -3)", "(-4,-3)", "(−4, −3)", "-4, -3", "-4,-3"],
    hint: "(x, y) → (−x, y).",
    discussion: ["Q'(−4, −3)."],
  },
  {
    id: "pp3",
    question: "Refleksi R(5, 1) terhadap garis y = x = …",
    kind: "fill",
    answers: ["(1, 5)", "(1,5)", "1,5"],
    hint: "Tukar x dan y.",
    discussion: ["R'(1, 5)."],
  },
  {
    id: "pp4",
    question: "Refleksi S(−3, 4) terhadap titik O = …",
    kind: "fill",
    answers: ["(3, -4)", "(3,-4)", "(3, −4)", "3, -4", "3,-4"],
    hint: "(x, y) → (−x, −y).",
    discussion: ["S'(3, −4)."],
  },
  {
    id: "pp5",
    question: "Refleksi T(2, 5) terhadap garis y = −x = …",
    kind: "fill",
    answers: ["(-5, -2)", "(-5,-2)", "(−5, −2)", "-5, -2", "-5,-2"],
    hint: "(x, y) → (−y, −x).",
    discussion: ["T'(−5, −2)."],
  },
  {
    id: "pp6",
    question:
      "Bayangan A(3, −2) terhadap sumbu Y direfleksikan lagi terhadap sumbu X = …",
    kind: "fill",
    answers: ["(-3, 2)", "(-3,2)", "(−3, 2)", "-3, 2", "-3,2"],
    hint: "Lakukan dua langkah berurutan.",
    discussion: [
      "A → sumbu Y → A'(−3, −2).",
      "A' → sumbu X → A''(−3, 2).",
    ],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Refleksi mengubah ukuran bangun.",
    kind: "truefalse",
    correct: false,
    hint: "Apa yang berubah & yang tetap?",
    discussion: [
      "SALAH. Refleksi mempertahankan ukuran (kongruen).",
      "Yang berubah hanya ORIENTASI.",
    ],
  },
  {
    id: "pp8",
    question:
      "Refleksi titik (a, 0) (di sumbu X) terhadap sumbu X = …",
    kind: "choice",
    options: ["(a, 0)", "(−a, 0)", "(0, a)", "(0, −a)"],
    correctIndex: 0,
    hint: "Titik di sumbu pencerminan tetap di tempat.",
    discussion: [
      "y = 0, sehingga −y = 0. Titik tetap.",
      "Setiap titik DI sumbu pencerminan = titik tetap.",
    ],
  },
];

const RefleksiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Transformasi Geometri"
    title="Refleksi (Pencerminan) — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami REFLEKSI 🪞! Kamu akan menemukan aturan pencerminan terhadap sumbu X, sumbu Y, garis y = x, y = −x, dan titik asal — sambil bermain seret kartu menyortir aturan!"
    situations={situations}
    guidedIntro="Jawab berurutan. Pola pemetaan akan menuntunmu ke aturan tiap jenis refleksi."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang refleksi dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Menu Transformasi Geometri"
    scoreMessages={{
      perfect: "🌟 Mantap! Refleksi sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang 4 aturan dasar refleksi.",
      low: "💪 Tetap semangat! Hafal pola: sumbu X balik y, sumbu Y balik x.",
    }}
  />
);

export default RefleksiLKPDPage;
