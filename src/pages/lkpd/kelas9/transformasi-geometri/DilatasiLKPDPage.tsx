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
    title: "Situasi 1 — Foto Diperbesar 2× (k = 2)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-700/20 border border-teal-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <circle cx="150" cy="120" r="3" fill="#fbbf24" />
            <text x="155" y="118" fontSize="9" fill="#fbbf24">O</text>
            <polygon points="170,100 190,100 180,80" fill="#34d399" fillOpacity="0.6" stroke="#6ee7b7" strokeWidth="1.5" />
            <text x="180" y="115" fontSize="8" fill="#34d399" textAnchor="middle">asal</text>
            <polygon points="190,80 230,80 210,40" fill="#f472b6" fillOpacity="0.5" stroke="#f9a8d4" strokeWidth="1.5" />
            <text x="210" y="55" fontSize="8" fill="#f472b6" textAnchor="middle">2× besar</text>
            <line x1="150" y1="120" x2="230" y2="40" stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="2 2" />
          </Grid>
        </svg>
      </div>
    ),
    text:
      "Foto kecil diperbesar 2× dari titik O. Setiap titik (x, y) menjadi (2x, 2y). Bentuk SAMA (sebangun), tapi UKURAN bertambah. Inilah DILATASI dengan faktor skala k = 2.",
  },
  {
    title: "Situasi 2 — Pola Diperkecil ½× (k = ½)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 300 240" className="w-full">
          <rect width="300" height="240" fill="#0b1220" rx="8" />
          <Grid>
            <circle cx="150" cy="120" r="3" fill="#fbbf24" />
            <rect x="190" y="40" width="60" height="50" fill="#22d3ee" fillOpacity="0.55" stroke="#67e8f9" strokeWidth="1.5" />
            <text x="220" y="68" fontSize="8" fill="#22d3ee" textAnchor="middle">asal</text>
            <rect x="170" y="80" width="30" height="25" fill="#f472b6" fillOpacity="0.55" stroke="#f9a8d4" strokeWidth="1.5" />
            <text x="185" y="96" fontSize="7" fill="#f472b6" textAnchor="middle">½×</text>
            <line x1="150" y1="120" x2="250" y2="40" stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="2 2" />
          </Grid>
        </svg>
      </div>
    ),
    text:
      "Pola persegi panjang diperkecil ½ kali dari O. Setiap titik (x, y) menjadi (½x, ½y). Hasilnya bangun SEBANGUN tapi LEBIH KECIL. Faktor skala k = ½ (0 < k < 1 → mengecil).",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Dilatasi A(2, 3) dengan pusat O dan faktor k = 3 menghasilkan A' = …",
    kind: "fill",
    answers: ["(6, 9)", "(6,9)", "6,9"],
    discussion: [
      "Aturan: D[O, k] memetakan (x, y) → (kx, ky).",
      "A'(3·2, 3·3) = A'(6, 9).",
    ],
  },
  {
    id: "g2",
    label: "Aturan dilatasi D[O, k]: (x, y) → …",
    kind: "choice",
    options: ["(x + k, y + k)", "(kx, ky)", "(k − x, k − y)", "(x/k, y/k)"],
    correctIndex: 1,
    discussion: ["Setiap koordinat DIKALIKAN dengan k. → (kx, ky)."],
  },
  {
    id: "g3",
    label:
      "Dilatasi B(8, −4) dengan pusat O dan k = ½ menghasilkan B' = …",
    kind: "fill",
    answers: ["(4, -2)", "(4,-2)", "(4, −2)", "4, -2", "4,-2"],
    discussion: [
      "B'(½·8, ½·(−4)) = B'(4, −2).",
      "k = ½ → bangun MENGECIL setengah.",
    ],
  },
  {
    id: "g4",
    label:
      "Dilatasi C(3, 2) dengan pusat O dan k = −2 menghasilkan C' = …",
    kind: "fill",
    answers: ["(-6, -4)", "(-6,-4)", "(−6, −4)", "-6, -4", "-6,-4"],
    discussion: [
      "C'(−2·3, −2·2) = C'(−6, −4).",
      "k NEGATIF → bangun TERBALIK terhadap pusat O.",
    ],
  },
  {
    id: "g5",
    label: "Jika k > 1, bangun hasil dilatasi …",
    kind: "choice",
    options: ["mengecil", "membesar", "tetap", "tidak terdefinisi"],
    correctIndex: 1,
    discussion: ["k > 1 → ukuran membesar (skala lebih dari satu)."],
  },
  {
    id: "g6",
    label: "Jika 0 < k < 1, bangun hasil dilatasi …",
    kind: "choice",
    options: ["mengecil", "membesar", "tetap", "berbentuk lain"],
    correctIndex: 0,
    discussion: ["0 < k < 1 → ukuran mengecil (skala kurang dari satu)."],
  },
  {
    id: "g7",
    label: "Jika k = 1, bangun hasil dilatasi …",
    kind: "choice",
    options: ["mengecil", "membesar", "tetap (identitas)", "terbalik"],
    correctIndex: 2,
    discussion: ["k = 1 → identitas, semua titik tetap."],
  },
  {
    id: "g8",
    label: "Jika k < 0, bangun hasil dilatasi …",
    kind: "choice",
    options: [
      "tetap di posisi yang sama",
      "berpindah ke seberang pusat (terbalik)",
      "tidak ada bayangan",
      "menjadi bayangan refleksi",
    ],
    correctIndex: 1,
    discussion: [
      "k < 0 → bayangan di SEBERANG pusat (terbalik posisi).",
      "Misal k = −1 sama dengan rotasi 180° terhadap O.",
    ],
  },
  {
    id: "g9",
    label:
      "Pernyataan: Dilatasi mempertahankan BENTUK (sebangun) tetapi BISA mengubah UKURAN.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Sudut tetap, panjang sisi berubah dengan rasio k.",
      "Bayangan SEBANGUN dengan asal (kecuali k = ±1).",
    ],
  },
  {
    id: "g10",
    label:
      "Sebuah segitiga dengan luas 12 cm² didilatasikan k = 3. Luas bayangan = …",
    kind: "fill",
    answers: ["108"],
    discussion: [
      "Luas bayangan = k² × luas asal = 9 × 12 = 108 cm².",
      "INGAT: panjang × k, luas × k², volume × k³.",
    ],
  },
  {
    id: "g11",
    label: "Pengaruh faktor skala k pada panjang sisi adalah … kali.",
    kind: "choice",
    options: ["k", "k²", "k³", "1/k"],
    correctIndex: 0,
    discussion: ["Panjang berubah faktor k (linear)."],
  },
  {
    id: "g12",
    label: "Pasangkan setiap dilatasi dengan bayangannya:",
    kind: "match",
    pairs: [
      { left: "(2, 4) – D[O, 3]", right: "(6, 12)" },
      { left: "(8, 6) – D[O, ½]", right: "(4, 3)" },
      { left: "(3, −2) – D[O, −2]", right: "(−6, 4)" },
      { left: "(5, 7) – D[O, 1]", right: "(5, 7)" },
    ],
    discussion: [
      "Kalikan setiap koordinat dengan k.",
      "k = 1 → identitas (titik tetap).",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Aturan Dilatasi",
    text: "D[O, k] memetakan (x, y) → (kx, ky). k = faktor skala. Pusat dilatasi (di sini O) selalu titik tetap.",
    tone: "emerald",
  },
  {
    title: "Pengaruh Nilai k",
    text: "k > 1 → membesar. 0 < k < 1 → mengecil. k = 1 → tetap. k < 0 → terbalik di seberang pusat. k = −1 sama dengan rotasi 180°.",
    tone: "violet",
  },
  {
    title: "Skala Panjang, Luas, Volume",
    text: "Panjang × k. Luas × k². Volume × k³. Bangun hasil SEBANGUN dengan asal (sudut sama, sisi proporsional).",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "dilatasi-game-jenis",
    title: "🎯 Game 1 — Membesar/Mengecil/Tetap (Seret!)",
    description: "Seret setiap dilatasi ke kategori PENGARUH-nya berdasarkan nilai k.",
    buckets: [
      { id: "besar", label: "MEMBESAR (|k| > 1)", emoji: "🔼", color: "emerald" },
      { id: "kecil", label: "MENGECIL (0 < |k| < 1)", emoji: "🔽", color: "amber" },
      { id: "tetap", label: "TETAP (k = 1)", emoji: "🟰", color: "cyan" },
      { id: "balik", label: "TERBALIK (k < 0)", emoji: "🔄", color: "rose" },
    ],
    items: [
      { id: "d1", label: "k = 4", bucketId: "besar", emoji: "🔼" },
      { id: "d2", label: "k = ½", bucketId: "kecil", emoji: "🔽" },
      { id: "d3", label: "k = 1", bucketId: "tetap", emoji: "🟰" },
      { id: "d4", label: "k = −3", bucketId: "balik", emoji: "🔄" },
      { id: "d5", label: "k = 0,25", bucketId: "kecil", emoji: "🔽" },
      { id: "d6", label: "k = 5", bucketId: "besar", emoji: "🔼" },
      { id: "d7", label: "k = −0,5", bucketId: "balik", emoji: "🔄" },
      { id: "d8", label: "k = 1 (lagi)", bucketId: "tetap", emoji: "🟰" },
    ],
  },
  {
    kind: "arrow-match",
    id: "dilatasi-game-bayangan",
    title: "🎯 Game 2 — Cari Bayangan Dilatasi",
    description: "Pasangkan setiap dilatasi titik dengan BAYANGAN-nya. Tekan ◀ ▶.",
    rightOptions: [
      "(6, 9)",
      "(4, -2)",
      "(-6, -4)",
      "(2, 4)",
      "(0, 0)",
      "(-1, -3)",
      "(10, 5)",
    ],
    pairs: [
      { id: "g1", left: "(2, 3) – D[O, 3]", correctRight: "(6, 9)", emoji: "🔭" },
      { id: "g2", left: "(8, −4) – D[O, ½]", correctRight: "(4, -2)", emoji: "🔭" },
      { id: "g3", left: "(3, 2) – D[O, −2]", correctRight: "(-6, -4)", emoji: "🔭" },
      { id: "g4", left: "(2, 4) – D[O, 1]", correctRight: "(2, 4)", emoji: "🔭" },
      { id: "g5", left: "(0, 0) – D[O, 99]", correctRight: "(0, 0)", emoji: "🔭" },
      { id: "g6", left: "(2, 6) – D[O, −½]", correctRight: "(-1, -3)", emoji: "🔭" },
      { id: "g7", left: "(4, 2) – D[O, 2.5]", correctRight: "(10, 5)", emoji: "🔭" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Dilatasi P(3, 5) dengan pusat O dan k = 2 = …",
    kind: "fill",
    answers: ["(6, 10)", "(6,10)", "6,10"],
    hint: "(kx, ky).",
    discussion: ["P'(6, 10)."],
  },
  {
    id: "pp2",
    question: "Dilatasi Q(10, −6) dengan pusat O dan k = ½ = …",
    kind: "fill",
    answers: ["(5, -3)", "(5,-3)", "(5, −3)", "5, -3", "5,-3"],
    hint: "Bagi 2 (atau kalikan ½).",
    discussion: ["Q'(5, −3)."],
  },
  {
    id: "pp3",
    question: "Dilatasi R(−2, 4) dengan pusat O dan k = −3 = …",
    kind: "fill",
    answers: ["(6, -12)", "(6,-12)", "(6, −12)", "6, -12", "6,-12"],
    hint: "Kalikan dengan −3.",
    discussion: ["R'(−2·−3, 4·−3) = (6, −12)."],
  },
  {
    id: "pp4",
    question:
      "Sebuah persegi memiliki sisi 4 cm. Setelah dilatasi k = 5, sisi bayangan = … cm.",
    kind: "fill",
    answers: ["20"],
    hint: "Panjang × k.",
    discussion: ["sisi' = k × sisi = 5 × 4 = 20 cm."],
  },
  {
    id: "pp5",
    question:
      "Sebuah persegi memiliki LUAS 16 cm². Setelah dilatasi k = 3, luas bayangan = … cm².",
    kind: "fill",
    answers: ["144"],
    hint: "Luas × k².",
    discussion: ["Luas bayangan = k² × Luas asal = 9 × 16 = 144 cm²."],
  },
  {
    id: "pp6",
    question:
      "Sebuah kubus memiliki VOLUME 8 cm³. Setelah dilatasi k = 2, volume bayangan = … cm³.",
    kind: "fill",
    answers: ["64"],
    hint: "Volume × k³.",
    discussion: ["V' = k³ × V = 8 × 8 = 64 cm³."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Dilatasi dengan k = 1 mengembalikan setiap titik ke posisi asal.",
    kind: "truefalse",
    correct: true,
    hint: "k = 1 = identitas.",
    discussion: ["BENAR. (1·x, 1·y) = (x, y)."],
  },
  {
    id: "pp8",
    question:
      "Sebuah segitiga ABC dengan A(0, 0), B(4, 0), C(0, 6) didilatasi k = ½ dari O. Koordinat C' = …",
    kind: "fill",
    answers: ["(0, 3)", "(0,3)", "0,3"],
    hint: "Kalikan koordinat C dengan ½.",
    discussion: ["C'(½·0, ½·6) = (0, 3)."],
  },
  {
    id: "pp9",
    question:
      "Garis y = 2x + 3 didilatasi terhadap pusat O(0, 0) dengan k = 2. Persamaan bayangan garis tersebut adalah y = …",
    kind: "fill",
    answers: ["2x + 6", "y = 2x + 6", "2x+6"],
    hint: "Substitusi x = x'/k dan y = y'/k ke persamaan asal, lalu sederhanakan.",
    discussion: [
      "Aturan: x = x'/k dan y = y'/k (balik transformasi).",
      "Substitusi ke y = 2x + 3: y'/2 = 2(x'/2) + 3",
      "y'/2 = x' + 3 → y' = 2x' + 6.",
      "Jadi bayangan garis: y = 2x + 6 (konstanta dikali k, gradien tetap).",
    ],
  },
  {
    id: "pp10",
    question:
      "Bayangan suatu garis setelah dilatasi D[O, 3] adalah y = x − 9. Persamaan garis asalnya adalah y = …",
    kind: "fill",
    answers: ["x - 3", "x − 3", "x-3", "y = x - 3", "y = x − 3"],
    hint: "Kebalikan: konstanta bayangan = k × konstanta asal. Cari konstanta asal.",
    discussion: [
      "Jika dilatasi D[O, k] menghasilkan bayangan y = mx + kc, maka garis asal adalah y = mx + c.",
      "Bayangan: y = x − 9, dengan k = 3 → kc = −9 → c = −3.",
      "Gradien tetap: m = 1.",
      "Garis asal: y = x − 3.",
      "Cek: dilatasi y = x − 3 dengan k = 3 → y'/3 = x'/3 − 3 → y' = x' − 9 ✓",
    ],
  },
  {
    id: "pp11",
    question:
      "Titik P(5, 4) didilatasi terhadap pusat A(2, 1) dengan k = 3. Bayangan P' = …",
    kind: "fill",
    answers: ["(11, 10)", "(11,10)", "11,10", "11, 10"],
    hint: "Rumus: x' = a + k(x − a), y' = b + k(y − b). Pusat (a, b) = (2, 1).",
    discussion: [
      "x' = 2 + 3(5 − 2) = 2 + 9 = 11.",
      "y' = 1 + 3(4 − 1) = 1 + 9 = 10.",
      "P' = (11, 10).",
    ],
  },
  {
    id: "pp12",
    question:
      "Titik Q(1, 5) didilatasi terhadap pusat B(3, 2) dengan k = −2. Bayangan Q' = …",
    kind: "fill",
    answers: ["(7, -4)", "(7,-4)", "(7, −4)", "7,-4", "7, -4"],
    hint: "Rumus: x' = a + k(x − a), y' = b + k(y − b). Pusat (a, b) = (3, 2), k = −2.",
    discussion: [
      "x' = 3 + (−2)(1 − 3) = 3 + (−2)(−2) = 3 + 4 = 7.",
      "y' = 2 + (−2)(5 − 2) = 2 + (−2)(3) = 2 − 6 = −4.",
      "Q' = (7, −4).",
      "k negatif → bayangan berada di SEBERANG pusat B.",
    ],
  },
];

const DilatasiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Transformasi Geometri"
    title="Dilatasi (Perubahan Ukuran) — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami DILATASI 🔭! Kamu akan menemukan aturan (kx, ky), efek nilai k pada ukuran (besar/kecil/tetap/terbalik), serta hubungan k dengan luas & volume — sambil bermain seret kartu mengelompokkan jenis dilatasi!"
    situations={situations}
    guidedIntro="Jawab berurutan. Kamu akan menemukan aturan dilatasi pusat O dan pengaruh nilai k."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang dilatasi dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Menu Transformasi Geometri"
    scoreMessages={{
      perfect: "🌟 Mantap! Dilatasi sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang aturan (kx, ky) dan efek k.",
      low: "💪 Tetap semangat! Ingat: panjang × k, luas × k², volume × k³.",
    }}
  />
);

export default DilatasiLKPDPage;
