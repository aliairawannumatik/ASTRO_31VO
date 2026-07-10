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
    title: "Situasi 1 — Roda Berputar 90°",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-pink-700/20 border border-fuchsia-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <circle cx="150" cy="120" r="3" fill="#fbbf24" />
            <text x="155" y="118" fontSize="9" fill="#fbbf24">O</text>
            <circle cx="210" cy="80" r="6" fill="#34d399" stroke="#6ee7b7" strokeWidth="2" />
            <text x="218" y="76" fontSize="9" fill="#34d399">A(3, 2)</text>
            <line x1="150" y1="120" x2="210" y2="80" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="110" cy="60" r="6" fill="#f472b6" stroke="#f9a8d4" strokeWidth="2" />
            <text x="60" y="56" fontSize="9" fill="#f472b6">A'(−2, 3)</text>
            <line x1="150" y1="120" x2="110" y2="60" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 200 95 A 30 30 0 0 0 165 80" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="200" y="65" fontSize="9" fill="#fbbf24">90°</text>
          </Grid>
        </svg>
      </div>
    ),
    text:
      "Titik A(3, 2) dirotasi 90° BERLAWANAN arah jarum jam (positif) terhadap titik O. Hasilnya A'(−2, 3). Pola: x dan y SALING TUKAR, lalu x baru dibalik tandanya!",
  },
  {
    title: "Situasi 2 — Putaran Setengah Lingkaran (180°)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <circle cx="150" cy="120" r="3" fill="#fbbf24" />
            <circle cx="210" cy="80" r="6" fill="#34d399" stroke="#6ee7b7" strokeWidth="2" />
            <text x="218" y="76" fontSize="9" fill="#34d399">B(3, 2)</text>
            <circle cx="90" cy="160" r="6" fill="#f472b6" stroke="#f9a8d4" strokeWidth="2" />
            <text x="40" y="172" fontSize="9" fill="#f472b6">B'(−3, −2)</text>
            <line x1="90" y1="160" x2="210" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="150" y="60" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Rotasi 180° → balik tanda KEDUANYA</text>
          </Grid>
        </svg>
      </div>
    ),
    text:
      "Rotasi 180° terhadap O memetakan B(3, 2) menjadi B'(−3, −2). Aturannya: TUKAR tanda baik x maupun y. Hasil ini SAMA dengan refleksi terhadap titik O!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Rotasi A(4, 1) sebesar 90° (berlawanan jarum jam) terhadap O menghasilkan A' = …",
    kind: "fill",
    answers: ["(-1, 4)", "(-1,4)", "(−1, 4)", "-1, 4", "-1,4"],
    discussion: [
      "Aturan rotasi 90° (CCW): (x, y) → (−y, x).",
      "A'(−1, 4).",
    ],
  },
  {
    id: "g2",
    label: "Aturan rotasi R(O, 90°) berlawanan arah jarum jam: (x, y) → …",
    kind: "choice",
    options: ["(y, −x)", "(−y, x)", "(−x, −y)", "(x, −y)"],
    correctIndex: 1,
    discussion: [
      "Rotasi 90° CCW: (x, y) → (−y, x).",
      "Tukar koordinat lalu balik tanda x baru.",
    ],
  },
  {
    id: "g3",
    label:
      "Rotasi B(3, −5) sebesar 180° terhadap O menghasilkan B' = …",
    kind: "fill",
    answers: ["(-3, 5)", "(-3,5)", "(−3, 5)", "-3, 5", "-3,5"],
    discussion: [
      "Aturan rotasi 180°: (x, y) → (−x, −y).",
      "B'(−3, 5). Kedua tanda dibalik.",
    ],
  },
  {
    id: "g4",
    label: "Aturan rotasi R(O, 180°): (x, y) → …",
    kind: "choice",
    options: ["(y, x)", "(−y, −x)", "(−x, −y)", "(x, y)"],
    correctIndex: 2,
    discussion: ["Setengah putaran membalikkan kedua tanda → (−x, −y)."],
  },
  {
    id: "g5",
    label:
      "Rotasi C(2, 6) sebesar 270° (berlawanan jarum jam) atau −90° terhadap O = …",
    kind: "fill",
    answers: ["(6, -2)", "(6,-2)", "(6, −2)", "6, -2", "6,-2"],
    discussion: [
      "Aturan rotasi 270° CCW (= 90° CW): (x, y) → (y, −x).",
      "C'(6, −2).",
    ],
  },
  {
    id: "g6",
    label: "Aturan rotasi R(O, 270°) atau R(O, −90°): (x, y) → …",
    kind: "choice",
    options: ["(y, −x)", "(−y, x)", "(−x, −y)", "(x, y)"],
    correctIndex: 0,
    discussion: ["Rotasi 270° CCW = 90° searah jarum jam. (x, y) → (y, −x)."],
  },
  {
    id: "g7",
    label:
      "Rotasi D(0, 0) sebesar berapa pun terhadap O = …",
    kind: "fill",
    answers: ["(0, 0)", "(0,0)", "0,0"],
    discussion: [
      "Titik O adalah pusat rotasi → titik tetap.",
      "D' = (0, 0). Rotasi tidak menggesernya.",
    ],
  },
  {
    id: "g8",
    label:
      "Rotasi 90° SEARAH jarum jam SAMA dengan rotasi … berlawanan arah.",
    kind: "choice",
    options: ["90°", "180°", "270°", "360°"],
    correctIndex: 2,
    discussion: [
      "90° searah = 360° − 90° = 270° berlawanan arah.",
      "Aturan keduanya: (x, y) → (y, −x).",
    ],
  },
  {
    id: "g9",
    label:
      "Pernyataan: Rotasi mempertahankan bentuk dan ukuran (kongruen).",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Rotasi adalah ISOMETRI — bentuk dan ukuran tidak berubah.",
      "Yang berubah hanya orientasi terhadap pusat rotasi.",
    ],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Rotasi 360° terhadap titik manapun mengembalikan titik ke posisi semula.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Rotasi 360° = satu putaran penuh = identitas.",
      "(x, y) → (x, y).",
    ],
  },
  {
    id: "g11",
    label:
      "Rotasi P(1, 2) sebesar 90° CCW LALU 90° CCW LAGI terhadap O = …",
    kind: "fill",
    answers: ["(-1, -2)", "(-1,-2)", "(−1, −2)", "-1, -2", "-1,-2"],
    discussion: [
      "90° + 90° = 180°.",
      "P → 180° → P'(−1, −2).",
      "Atau langkah demi langkah: (1,2) → (−2,1) → (−1,−2).",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan rotasi terhadap O dengan ATURAN-nya:",
    kind: "match",
    pairs: [
      { left: "R(O, 90°)", right: "(x, y) → (−y, x)" },
      { left: "R(O, 180°)", right: "(x, y) → (−x, −y)" },
      { left: "R(O, 270°)", right: "(x, y) → (y, −x)" },
      { left: "R(O, 360°)", right: "(x, y) → (x, y)" },
    ],
    discussion: [
      "90°: tukar lalu balik x baru.",
      "180°: balik kedua tanda.",
      "270°: tukar lalu balik y baru.",
      "360°: tetap (identitas).",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Aturan Rotasi terhadap O",
    text: "R(O, 90°): (x, y) → (−y, x). R(O, 180°): (x, y) → (−x, −y). R(O, 270°): (x, y) → (y, −x). R(O, 360°): (x, y) → (x, y).",
    tone: "violet",
  },
  {
    title: "Arah Putaran",
    text: "POSITIF (+) = berlawanan arah jarum jam. NEGATIF (−) = searah jarum jam. R(O, −90°) = R(O, 270°). R(O, 180°) sama untuk kedua arah.",
    tone: "rose",
  },
  {
    title: "Sifat Rotasi",
    text: "Rotasi adalah ISOMETRI: ukuran & bentuk dipertahankan (kongruen). Pusat rotasi adalah titik TETAP. Komposisi rotasi = jumlahkan sudutnya.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "rotasi-game-aturan",
    title: "🎯 Game 1 — Pilih Aturan Rotasi (Seret!)",
    description: "Seret setiap pemetaan ke jenis ROTASI terhadap O yang sesuai.",
    buckets: [
      { id: "r90", label: "Rotasi 90° (CCW)", emoji: "↺", color: "emerald" },
      { id: "r180", label: "Rotasi 180°", emoji: "🔄", color: "violet" },
      { id: "r270", label: "Rotasi 270° (CCW)", emoji: "↻", color: "amber" },
      { id: "r360", label: "Rotasi 360° (identitas)", emoji: "🌀", color: "rose" },
    ],
    items: [
      { id: "x1", label: "(3, 4) → (−4, 3)", bucketId: "r90", emoji: "🔄" },
      { id: "x2", label: "(3, 4) → (−3, −4)", bucketId: "r180", emoji: "🔄" },
      { id: "x3", label: "(3, 4) → (4, −3)", bucketId: "r270", emoji: "🔄" },
      { id: "x4", label: "(3, 4) → (3, 4)", bucketId: "r360", emoji: "🔄" },
      { id: "x5", label: "(2, 5) → (−5, 2)", bucketId: "r90", emoji: "🔄" },
      { id: "x6", label: "(2, 5) → (5, −2)", bucketId: "r270", emoji: "🔄" },
      { id: "x7", label: "(−1, 6) → (1, −6)", bucketId: "r180", emoji: "🔄" },
      { id: "x8", label: "(7, −2) → (7, −2)", bucketId: "r360", emoji: "🔄" },
    ],
  },
  {
    kind: "arrow-match",
    id: "rotasi-game-bayangan",
    title: "🎯 Game 2 — Cari Bayangan Rotasi",
    description: "Pasangkan setiap rotasi titik dengan BAYANGAN-nya. Tekan ◀ ▶.",
    rightOptions: [
      "(−2, 3)",
      "(−3, −2)",
      "(2, −3)",
      "(3, 2)",
      "(−1, 4)",
      "(−4, −1)",
      "(1, −4)",
    ],
    pairs: [
      { id: "rb1", left: "A(3, 2) – R(O, 90°)", correctRight: "(−2, 3)", emoji: "↺" },
      { id: "rb2", left: "A(3, 2) – R(O, 180°)", correctRight: "(−3, −2)", emoji: "🔄" },
      { id: "rb3", left: "A(3, 2) – R(O, 270°)", correctRight: "(2, −3)", emoji: "↻" },
      { id: "rb4", left: "A(3, 2) – R(O, 360°)", correctRight: "(3, 2)", emoji: "🌀" },
      { id: "rb5", left: "B(4, 1) – R(O, 90°)", correctRight: "(−1, 4)", emoji: "↺" },
      { id: "rb6", left: "B(4, 1) – R(O, 180°)", correctRight: "(−4, −1)", emoji: "🔄" },
      { id: "rb7", left: "B(4, 1) – R(O, 270°)", correctRight: "(1, −4)", emoji: "↻" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Rotasi P(2, 3) sebesar 90° (CCW) terhadap O = …",
    kind: "fill",
    answers: ["(-3, 2)", "(-3,2)", "(−3, 2)", "-3, 2", "-3,2"],
    hint: "(x, y) → (−y, x).",
    discussion: ["P'(−3, 2)."],
  },
  {
    id: "pp2",
    question: "Rotasi Q(−4, 5) sebesar 180° terhadap O = …",
    kind: "fill",
    answers: ["(4, -5)", "(4,-5)", "(4, −5)", "4, -5", "4,-5"],
    hint: "Balik kedua tanda.",
    discussion: ["Q'(4, −5)."],
  },
  {
    id: "pp3",
    question: "Rotasi R(1, −6) sebesar 270° (CCW) terhadap O = …",
    kind: "fill",
    answers: ["(-6, -1)", "(-6,-1)", "(−6, −1)", "-6, -1", "-6,-1"],
    hint: "(x, y) → (y, −x).",
    discussion: ["R'(−6, −1)."],
  },
  {
    id: "pp4",
    question: "Rotasi S(7, 0) sebesar 90° (CCW) terhadap O = …",
    kind: "fill",
    answers: ["(0, 7)", "(0,7)", "0,7"],
    hint: "(x, y) → (−y, x).",
    discussion: ["S'(0, 7)."],
  },
  {
    id: "pp5",
    question:
      "Rotasi 90° CCW DUA KALI terhadap O sama dengan rotasi … °",
    kind: "fill",
    answers: ["180", "180°"],
    hint: "Jumlahkan sudut.",
    discussion: ["90° + 90° = 180°."],
  },
  {
    id: "pp6",
    question:
      "Rotasi T(3, −2) sebesar −90° (searah jarum jam) terhadap O = …",
    kind: "fill",
    answers: ["(-2, -3)", "(-2,-3)", "(−2, −3)", "-2, -3", "-2,-3"],
    hint: "−90° CW = 270° CCW: (x, y) → (y, −x).",
    discussion: ["T'(−2, −3)."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Rotasi mengubah ukuran bangun.",
    kind: "truefalse",
    correct: false,
    hint: "Rotasi adalah ISOMETRI.",
    discussion: ["SALAH. Rotasi mempertahankan ukuran (kongruen)."],
  },
  {
    id: "pp8",
    question:
      "Sebuah jarum jam menunjuk angka 12. Setelah berputar 90° searah jarum jam, jarum menunjuk angka …",
    kind: "fill",
    answers: ["3"],
    hint: "Jam analog: 90° = 3 jam.",
    discussion: ["360°/12 = 30° per angka. 90°/30° = 3 angka. 12 + 3 = 3."],
  },
];

const RotasiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Transformasi Geometri"
    title="Rotasi (Perputaran) — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami ROTASI 🔄! Kamu akan menemukan aturan rotasi 90°, 180°, 270°, dan 360° terhadap titik O — sambil bermain seret kartu mengelompokkan jenis rotasi!"
    situations={situations}
    guidedIntro="Jawab berurutan. Pola pemetaan akan menuntunmu ke aturan tiap rotasi standar."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang rotasi dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Menu Transformasi Geometri"
    scoreMessages={{
      perfect: "🌟 Mantap! Rotasi sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang aturan 90°, 180°, 270°.",
      low: "💪 Tetap semangat! Mulai hafal R(O, 90°): (x,y) → (−y, x).",
    }}
  />
);

export default RotasiLKPDPage;
