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
    <text x="275" y="115" fontSize="9" fill="#67e8f9">x</text>
    <text x="155" y="28" fontSize="9" fill="#67e8f9">y</text>
    {children}
  </g>
);

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Bidak Catur Bergeser",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-700/20 border border-indigo-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <circle cx="110" cy="140" r="6" fill="#fbbf24" stroke="#fde68a" strokeWidth="2" />
            <text x="110" y="158" fontSize="9" fill="#fbbf24" textAnchor="middle">A(−2,−1)</text>
            <line x1="110" y1="140" x2="190" y2="80" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrA)" />
            <circle cx="190" cy="80" r="6" fill="#34d399" stroke="#6ee7b7" strokeWidth="2" />
            <text x="190" y="74" fontSize="9" fill="#34d399" textAnchor="middle">A'(2,2)</text>
            <text x="160" y="115" fontSize="9" fill="#fde68a" textAnchor="middle">+4 ke kanan, +3 ke atas</text>
          </Grid>
          <defs>
            <marker id="arrA" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#34d399" />
            </marker>
          </defs>
        </svg>
      </div>
    ),
    text:
      "Bidak A di koordinat (−2, −1) digeser 4 satuan ke kanan dan 3 satuan ke atas. Bidak baru A' berada di (2, 2). Pergeseran ini disebut TRANSLASI dengan vektor T = (4, 3).",
  },
  {
    title: "Situasi 2 — Atap Rumah Digeser",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <polygon points="80,140 130,140 105,100" fill="#fbbf24" fillOpacity="0.5" stroke="#fde68a" strokeWidth="1.5" />
            <text x="105" y="155" fontSize="8" fill="#fde68a" textAnchor="middle">Bangun asal</text>
            <polygon points="180,180 230,180 205,140" fill="#f472b6" fillOpacity="0.5" stroke="#f9a8d4" strokeWidth="1.5" />
            <text x="205" y="195" fontSize="8" fill="#f9a8d4" textAnchor="middle">Hasil translasi (5, −2)</text>
            <line x1="105" y1="120" x2="205" y2="160" stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrB)" />
          </Grid>
          <defs>
            <marker id="arrB" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#34d399" />
            </marker>
          </defs>
        </svg>
      </div>
    ),
    text:
      "Sebuah segitiga (atap rumah) digeser 5 satuan ke kanan dan 2 satuan ke bawah. Setiap titik bergeser dengan jumlah yang SAMA: T = (5, −2). Bentuk dan ukuran TIDAK berubah.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Titik P(3, 4) ditranslasi sejauh T = (2, 5). Koordinat P' = …",
    kind: "fill",
    answers: ["(5, 9)", "(5,9)", "5,9"],
    discussion: [
      "Translasi: (x, y) → (x + a, y + b).",
      "P'(3 + 2, 4 + 5) = P'(5, 9).",
    ],
  },
  {
    id: "g2",
    label: "Aturan umum translasi T = (a, b) terhadap titik (x, y) menghasilkan …",
    kind: "choice",
    options: [
      "(x − a, y − b)",
      "(x + a, y + b)",
      "(a + b, x + y)",
      "(ax, by)",
    ],
    correctIndex: 1,
    discussion: [
      "Setiap titik bergeser sejauh a satuan pada sumbu x dan b satuan pada sumbu y.",
      "Hasil: (x + a, y + b).",
    ],
  },
  {
    id: "g3",
    label:
      "Titik Q(−2, 5) ditranslasi T = (4, −3). Koordinat Q' = …",
    kind: "fill",
    answers: ["(2, 2)", "(2,2)", "2,2"],
    discussion: [
      "Q'(−2 + 4, 5 + (−3)) = Q'(2, 2).",
      "Komponen NEGATIF berarti bergeser ke KIRI atau ke BAWAH.",
    ],
  },
  {
    id: "g4",
    label:
      "Titik R(1, 7) menjadi R'(4, 3) setelah translasi. Tentukan vektor T = …",
    kind: "fill",
    answers: ["(3, -4)", "(3,-4)", "(3, −4)", "3, -4", "3,-4"],
    discussion: [
      "T = (R'x − Rx, R'y − Ry) = (4 − 1, 3 − 7) = (3, −4).",
    ],
  },
  {
    id: "g5",
    label:
      "Translasi T = (a, b) MENGUBAH bentuk atau ukuran bangun?",
    kind: "choice",
    options: [
      "Mengubah bentuk saja",
      "Mengubah ukuran saja",
      "Mengubah bentuk dan ukuran",
      "TIDAK mengubah keduanya (kongruen)",
    ],
    correctIndex: 3,
    discussion: [
      "Translasi mempertahankan BENTUK dan UKURAN.",
      "Hasil translasi KONGRUEN dengan bangun asal.",
    ],
  },
  {
    id: "g6",
    label:
      "Translasi T = (5, −2) artinya …",
    kind: "choice",
    options: [
      "5 ke kiri, 2 ke atas",
      "5 ke kanan, 2 ke atas",
      "5 ke kanan, 2 ke bawah",
      "5 ke kiri, 2 ke bawah",
    ],
    correctIndex: 2,
    discussion: [
      "Komponen x positif (5) → ke KANAN.",
      "Komponen y negatif (−2) → ke BAWAH.",
    ],
  },
  {
    id: "g7",
    label:
      "Pernyataan: Pada translasi, semua titik bergeser dengan jumlah yang SAMA.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Itulah ciri translasi: setiap titik bergeser dengan vektor sama.",
      "Karena itu bangun hasil kongruen dengan bangun asal.",
    ],
  },
  {
    id: "g8",
    label:
      "Titik A(0, 0) ditranslasi T = (−3, 4). A' = …",
    kind: "fill",
    answers: ["(-3, 4)", "(-3,4)", "(−3, 4)", "-3, 4", "-3,4"],
    discussion: ["A'(0 − 3, 0 + 4) = A'(−3, 4)."],
  },
  {
    id: "g9",
    label:
      "Titik B(2, 3) ditranslasi T = (−5, −1). B' = …",
    kind: "fill",
    answers: ["(-3, 2)", "(-3,2)", "(−3, 2)", "-3, 2", "-3,2"],
    discussion: ["B'(2 − 5, 3 − 1) = B'(−3, 2)."],
  },
  {
    id: "g10",
    label:
      "Translasi DILAKUKAN DUA KALI berturut-turut: T₁=(2,3) lalu T₂=(4,−1). Translasi tunggal yang setara = …",
    kind: "fill",
    answers: ["(6, 2)", "(6,2)", "6,2"],
    discussion: [
      "Komposisi translasi: jumlahkan komponennya.",
      "T = T₁ + T₂ = (2 + 4, 3 + (−1)) = (6, 2).",
    ],
  },
  {
    id: "g11",
    label:
      "Pernyataan: T = (0, 0) adalah translasi identitas — semua titik tetap.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. T(0, 0) tidak menggeser apapun.",
      "Setiap titik (x, y) → (x + 0, y + 0) = (x, y).",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan titik asal & vektor translasi dengan bayangannya:",
    kind: "match",
    pairs: [
      { left: "(1, 2) oleh T(3, 4)", right: "(4, 6)" },
      { left: "(−2, 5) oleh T(2, −3)", right: "(0, 2)" },
      { left: "(0, 0) oleh T(−5, 7)", right: "(−5, 7)" },
      { left: "(4, −3) oleh T(−4, 3)", right: "(0, 0)" },
    ],
    discussion: [
      "Tambahkan komponen vektor ke titik asal.",
      "Translasi (−4, 3) terhadap (4, −3) mengembalikan ke titik asal (0, 0).",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Aturan Translasi",
    text: "T = (a, b) memetakan (x, y) → (x + a, y + b). a = pergeseran horizontal, b = pergeseran vertikal.",
    tone: "violet",
  },
  {
    title: "Sifat Translasi",
    text: "Translasi mempertahankan BENTUK dan UKURAN (KONGRUEN). Semua titik bergeser dengan vektor SAMA. Tidak ada perputaran.",
    tone: "cyan",
  },
  {
    title: "Komposisi & Identitas",
    text: "T₁ ∘ T₂ = T(a₁+a₂, b₁+b₂). T(0, 0) = identitas (titik tetap). T invers dari (a, b) adalah (−a, −b).",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "translasi-game-arah",
    title: "🎯 Game 1 — Klasifikasi ARAH (Seret!)",
    description: "Seret setiap vektor translasi ke kategori ARAH gerakannya.",
    buckets: [
      { id: "kanan-atas", label: "Kanan + Atas (+x, +y)", emoji: "↗️", color: "emerald" },
      { id: "kiri-atas", label: "Kiri + Atas (−x, +y)", emoji: "↖️", color: "cyan" },
      { id: "kanan-bawah", label: "Kanan + Bawah (+x, −y)", emoji: "↘️", color: "amber" },
      { id: "kiri-bawah", label: "Kiri + Bawah (−x, −y)", emoji: "↙️", color: "rose" },
    ],
    items: [
      { id: "t1", label: "T(3, 5)", bucketId: "kanan-atas", emoji: "↗️" },
      { id: "t2", label: "T(−4, 2)", bucketId: "kiri-atas", emoji: "↖️" },
      { id: "t3", label: "T(6, −1)", bucketId: "kanan-bawah", emoji: "↘️" },
      { id: "t4", label: "T(−3, −7)", bucketId: "kiri-bawah", emoji: "↙️" },
      { id: "t5", label: "T(2, 9)", bucketId: "kanan-atas", emoji: "↗️" },
      { id: "t6", label: "T(−1, 4)", bucketId: "kiri-atas", emoji: "↖️" },
      { id: "t7", label: "T(8, −3)", bucketId: "kanan-bawah", emoji: "↘️" },
      { id: "t8", label: "T(−5, −2)", bucketId: "kiri-bawah", emoji: "↙️" },
    ],
  },
  {
    kind: "arrow-match",
    id: "translasi-game-bayangan",
    title: "🎯 Game 2 — Pasangkan Bayangan Titik",
    description: "Pasangkan titik & vektor translasi dengan BAYANGAN-nya. Tekan ◀ ▶.",
    rightOptions: [
      "(4, 6)",
      "(0, 2)",
      "(−5, 7)",
      "(0, 0)",
      "(7, 1)",
      "(−2, −4)",
      "(3, −1)",
    ],
    pairs: [
      { id: "b1", left: "(1, 2) oleh T(3, 4)", correctRight: "(4, 6)", emoji: "➡️" },
      { id: "b2", left: "(−2, 5) oleh T(2, −3)", correctRight: "(0, 2)", emoji: "➡️" },
      { id: "b3", left: "(0, 0) oleh T(−5, 7)", correctRight: "(−5, 7)", emoji: "➡️" },
      { id: "b4", left: "(4, −3) oleh T(−4, 3)", correctRight: "(0, 0)", emoji: "➡️" },
      { id: "b5", left: "(2, −4) oleh T(5, 5)", correctRight: "(7, 1)", emoji: "➡️" },
      { id: "b6", left: "(3, 1) oleh T(−5, −5)", correctRight: "(−2, −4)", emoji: "➡️" },
      { id: "b7", left: "(1, 2) oleh T(2, −3)", correctRight: "(3, −1)", emoji: "➡️" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Titik A(2, −3) ditranslasi T = (4, 5). A' = …",
    kind: "fill",
    answers: ["(6, 2)", "(6,2)", "6,2"],
    hint: "(x + a, y + b).",
    discussion: ["A'(2 + 4, −3 + 5) = A'(6, 2)."],
  },
  {
    id: "pp2",
    question: "Titik B(−1, 4) menjadi B'(3, −2). Vektor translasinya = …",
    kind: "fill",
    answers: ["(4, -6)", "(4,-6)", "(4, −6)", "4, -6", "4,-6"],
    hint: "Selisih bayangan dengan titik asal.",
    discussion: ["T = (3 − (−1), −2 − 4) = (4, −6)."],
  },
  {
    id: "pp3",
    question:
      "Titik P(0, 0) ditranslasi T₁=(2, 3) lalu T₂=(−5, 1). P akhir = …",
    kind: "fill",
    answers: ["(-3, 4)", "(-3,4)", "(−3, 4)", "-3, 4", "-3,4"],
    hint: "Jumlahkan kedua vektor lalu terapkan.",
    discussion: ["T total = (2 − 5, 3 + 1) = (−3, 4). P' = (−3, 4)."],
  },
  {
    id: "pp4",
    question:
      "Segitiga ABC dengan A(0,0), B(3,0), C(0,4) ditranslasi T(2,1). Bayangan B = …",
    kind: "fill",
    answers: ["(5, 1)", "(5,1)", "5,1"],
    hint: "Translasikan titik B saja.",
    discussion: ["B'(3 + 2, 0 + 1) = B'(5, 1)."],
  },
  {
    id: "pp5",
    question: "Pernyataan: Translasi mengubah ukuran bangun.",
    kind: "truefalse",
    correct: false,
    hint: "Apa yang TETAP setelah translasi?",
    discussion: [
      "SALAH. Translasi mempertahankan ukuran dan bentuk (kongruen).",
    ],
  },
  {
    id: "pp6",
    question:
      "Vektor invers dari T = (5, −7) yang mengembalikan titik ke posisi semula = …",
    kind: "fill",
    answers: ["(-5, 7)", "(-5,7)", "(−5, 7)", "-5, 7", "-5,7"],
    hint: "Tukar tanda komponennya.",
    discussion: ["Invers T = (−5, 7) → akan mengembalikan posisi semula."],
  },
  {
    id: "pp7",
    question: "T(0, 0) memetakan setiap titik (x, y) menjadi …",
    kind: "choice",
    options: ["(0, 0)", "(x, y)", "(−x, −y)", "(y, x)"],
    correctIndex: 1,
    hint: "Translasi identitas.",
    discussion: ["T(0, 0) tidak menggeser apapun → (x, y) tetap."],
  },
  {
    id: "pp8",
    question:
      "Sebuah robot di titik (1, 1) bergerak T₁=(3,4) lalu T₂=(2,-1). Posisi akhir robot = …",
    kind: "fill",
    answers: ["(6, 4)", "(6,4)", "6,4"],
    hint: "Komposisi translasi: jumlahkan komponennya.",
    discussion: [
      "T total = (3+2, 4−1) = (5, 3).",
      "Robot akhir: (1+5, 1+3) = (6, 4).",
    ],
  },
];

const TranslasiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Transformasi Geometri"
    title="Translasi (Pergeseran) — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami TRANSLASI ➡️! Kamu akan menemukan aturan (x, y) → (x + a, y + b), arah pergeseran, dan komposisi translasi — sambil bermain seret kartu mengelompokkan arah!"
    situations={situations}
    guidedIntro="Jawab soal-soal berurutan untuk menemukan aturan dan sifat translasi."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang translasi dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Menu Transformasi Geometri"
    scoreMessages={{
      perfect: "🌟 Mantap! Translasi sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang aturan (x+a, y+b).",
      low: "💪 Tetap semangat! Mulai dari arti tanda + dan − pada vektor.",
    }}
  />
);

export default TranslasiLKPDPage;
