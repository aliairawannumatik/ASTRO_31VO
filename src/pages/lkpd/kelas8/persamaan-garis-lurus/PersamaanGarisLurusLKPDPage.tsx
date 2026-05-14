import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import PGLGradientInteractive from "@/components/PGLGradientInteractive";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Tangga Sekolah",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 200 140" className="w-full">
          <rect width="200" height="140" fill="#0b1220" rx="8" />
          <line x1="20" y1="120" x2="180" y2="120" stroke="#475569" strokeWidth="1.5" />
          <polyline
            points="40,120 40,100 70,100 70,80 100,80 100,60 130,60 130,40 160,40 160,120"
            fill="#f59e0b"
            opacity="0.4"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <line x1="40" y1="120" x2="160" y2="40" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
          <text x="100" y="135" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
            naik 1 anak tangga setiap maju 1,5 langkah
          </text>
        </svg>
      </div>
    ),
    text:
      "Setiap anak tangga di sekolahmu memiliki ukuran sama. Garis miring di sisi tangga (pegangan) selalu LURUS dan punya KEMIRINGAN tertentu. Semakin curam tangga, semakin BESAR kemiringannya. Inilah ide GRADIEN — ukuran kecuraman sebuah garis lurus.",
  },
  {
    title: "Situasi 2 — Ojek Online",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 200 140" className="w-full">
          <rect width="200" height="140" fill="#0b1220" rx="8" />
          <line x1="20" y1="120" x2="180" y2="120" stroke="#475569" strokeWidth="1" />
          <line x1="20" y1="20" x2="20" y2="120" stroke="#475569" strokeWidth="1" />
          <line x1="20" y1="100" x2="180" y2="40" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="100" r="5" fill="#fde047" />
          <text x="28" y="95" fill="#fde047" fontSize="9" fontWeight="bold">tarif awal</text>
          <text x="100" y="135" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
            biaya per km × jarak + tarif awal
          </text>
        </svg>
      </div>
    ),
    text:
      "Tarif ojek online: Rp 5.000 (tarif awal) + Rp 2.500 × jarak (km). Jika kamu menggambar grafiknya, kamu mendapat GARIS LURUS. Tarif awal = titik mula garis (saat x=0) — disebut KONSTANTA. Biaya per km = kemiringan garis — disebut GRADIEN. Bentuknya: y = mx + c.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Persamaan garis lurus selalu memuat variabel x dan y dengan PANGKAT TERTINGGI sama dengan …",
    kind: "fill",
    answers: ["1", "satu"],
    discussion: [
      "Karena namanya 'linear' (linear = lurus, derajat 1).",
      "Bentuk seperti y = x² (pangkat 2) BUKAN garis lurus, melainkan parabola.",
      "Bentuk seperti y = 2x + 3 ATAU 3x − 4y = 12 adalah persamaan garis lurus.",
    ],
  },
  {
    id: "g2",
    label: "Manakah yang BUKAN persamaan garis lurus?",
    kind: "choice",
    options: ["y = 2x + 5", "y = x² − 1", "3x + 4y = 12", "y = −x"],
    correctIndex: 1,
    discussion: [
      "y = x² − 1 mempunyai pangkat 2 pada x → BUKAN garis lurus, melainkan parabola.",
      "Tiga pilihan lainnya semua memiliki pangkat 1, sehingga merupakan garis lurus.",
    ],
  },
  {
    id: "g3",
    label: "Bentuk umum persamaan garis lurus dengan gradien m dan titik potong sumbu y di c adalah …",
    kind: "fill",
    answers: ["y=mx+c", "y = mx + c", "y=mx + c"],
    discussion: [
      "Bentuk eksplisit: y = mx + c.",
      "m = gradien (kemiringan).",
      "c = konstanta = ordinat titik potong terhadap sumbu y.",
      "Contoh: y = 2x + 3 → m = 2, c = 3.",
    ],
  },
  {
    id: "g4",
    label: "Pada y = 4x − 7, nilai gradien (m) dan konstanta (c) berturut-turut adalah …",
    kind: "choice",
    options: ["m = 4, c = 7", "m = 4, c = −7", "m = −7, c = 4", "m = 7, c = −4"],
    correctIndex: 1,
    discussion: [
      "Bandingkan dengan y = mx + c.",
      "Koefisien x adalah m → m = 4.",
      "Suku tanpa variabel adalah c → c = −7 (perhatikan tanda minus).",
    ],
  },
  {
    id: "g5",
    label: "Pada bentuk implisit 2x + 3y − 12 = 0, untuk menggambar grafiknya cara TERMUDAH adalah mencari …",
    kind: "choice",
    options: [
      "satu titik saja",
      "dua titik (titik potong sumbu x dan sumbu y)",
      "tiga titik berurutan",
      "gradien terlebih dahulu",
    ],
    correctIndex: 1,
    discussion: [
      "DUA titik sudah cukup untuk menentukan satu garis lurus.",
      "Cara termudah: cari titik potong sumbu x (saat y = 0) dan titik potong sumbu y (saat x = 0).",
      "Contoh: 2x + 3y = 12 → saat y=0 → x=6 (titik (6,0)); saat x=0 → y=4 (titik (0,4)).",
      "Hubungkan dua titik tersebut dengan penggaris.",
    ],
  },
  {
    id: "g6",
    label: "Garis melalui titik potong sumbu x di (6, 0) dan titik potong sumbu y di (0, 4). Persamaan garis tersebut adalah …",
    kind: "choice",
    options: ["2x + 3y = 12", "3x + 2y = 12", "2x − 3y = 12", "x + y = 6"],
    correctIndex: 0,
    discussion: [
      "Substitusi (6,0) ke 2x + 3y → 2(6) + 3(0) = 12 ✓.",
      "Substitusi (0,4) ke 2x + 3y → 2(0) + 3(4) = 12 ✓.",
      "Maka persamaannya 2x + 3y = 12.",
    ],
  },
  {
    id: "g7",
    label: "GRADIEN sebuah garis menyatakan tingkat … garis tersebut.",
    kind: "fill",
    answers: ["kemiringan", "kecuraman"],
    discussion: [
      "Gradien (sering ditulis m) = ukuran KEMIRINGAN garis.",
      "Semakin besar |m|, semakin curam garis.",
      "m positif → garis naik ke kanan; m negatif → garis turun ke kanan.",
      "m = 0 → garis mendatar; m tak terdefinisi → garis tegak.",
    ],
  },
  {
    id: "g8",
    label:
      "Rumus gradien garis yang melalui titik (x₁, y₁) dan (x₂, y₂) adalah m = …",
    kind: "choice",
    options: [
      "(y₂ − y₁) / (x₂ − x₁)",
      "(x₂ − x₁) / (y₂ − y₁)",
      "(y₂ + y₁) / (x₂ + x₁)",
      "(y₁ − y₂) / (x₁ + x₂)",
    ],
    correctIndex: 0,
    discussion: [
      "m = perubahan y dibagi perubahan x = Δy / Δx.",
      "m = (y₂ − y₁) / (x₂ − x₁).",
      "Urutan SUBSTRAKSI atas dan bawah harus konsisten.",
    ],
  },
  {
    id: "g9",
    label:
      "Tentukan gradien garis yang melalui (1, 2) dan (4, 8). m = …",
    kind: "fill",
    answers: ["2"],
    discussion: [
      "m = (y₂ − y₁) / (x₂ − x₁) = (8 − 2) / (4 − 1) = 6/3 = 2.",
      "Setiap x bertambah 1, y bertambah 2. Garis NAIK.",
    ],
  },
  {
    id: "g10",
    label:
      "Gradien garis y = −3x + 5 adalah …",
    kind: "fill",
    answers: ["-3", "−3"],
    discussion: [
      "Bentuk eksplisit y = mx + c → m = koefisien x = −3.",
      "Garis TURUN karena m bernilai negatif.",
    ],
  },
  {
    id: "g11",
    label:
      "Untuk bentuk implisit ax + by + c = 0 (dengan b ≠ 0), gradien garis adalah m = …",
    kind: "choice",
    options: ["a/b", "−a/b", "−b/a", "b/a"],
    correctIndex: 1,
    discussion: [
      "Pindahkan ax dan c ke ruas kanan: by = −ax − c.",
      "Bagi semua dengan b: y = (−a/b)x + (−c/b).",
      "Maka m = −a/b dan konstantanya = −c/b.",
    ],
  },
  {
    id: "g12",
    label: "Gradien garis 2x + 5y − 10 = 0 adalah …",
    kind: "fill",
    answers: ["-2/5", "−2/5", "-0.4", "−0.4"],
    discussion: [
      "Gunakan m = −a/b dengan a = 2 dan b = 5.",
      "m = −2/5.",
      "Atau ubah ke bentuk eksplisit: 5y = −2x + 10 → y = (−2/5)x + 2.",
    ],
  },
  {
    id: "g13",
    label:
      "Persamaan garis yang melalui titik (x₁, y₁) dengan gradien m adalah …",
    kind: "choice",
    options: [
      "y − y₁ = m(x − x₁)",
      "y + y₁ = m(x + x₁)",
      "y − x = m(y₁ − x₁)",
      "y₁ = mx + x₁",
    ],
    correctIndex: 0,
    discussion: [
      "Rumus titik-gradien: y − y₁ = m(x − x₁).",
      "Sangat berguna jika diketahui SATU titik dan gradien.",
      "Contoh: m = 2 melalui (1, 3) → y − 3 = 2(x − 1) → y = 2x + 1.",
    ],
  },
  {
    id: "g14",
    label:
      "Tentukan persamaan garis melalui (2, 5) dengan gradien 3.",
    kind: "choice",
    options: ["y = 3x − 1", "y = 3x + 5", "y = 3x + 11", "y = 3x − 5"],
    correctIndex: 0,
    discussion: [
      "Gunakan y − y₁ = m(x − x₁).",
      "y − 5 = 3(x − 2) → y − 5 = 3x − 6 → y = 3x − 1. ✓",
      "Cek: x = 2 → y = 6 − 1 = 5 ✓.",
    ],
  },
  {
    id: "g15",
    label:
      "Persamaan garis yang melalui DUA titik (x₁, y₁) dan (x₂, y₂) adalah …",
    kind: "choice",
    options: [
      "(y − y₁)/(y₂ − y₁) = (x − x₁)/(x₂ − x₁)",
      "(y − y₁)(y₂ − y₁) = (x − x₁)(x₂ − x₁)",
      "y/y₁ = x/x₁",
      "y − y₁ = (x − x₁)",
    ],
    correctIndex: 0,
    discussion: [
      "Rumus dua titik: (y − y₁)/(y₂ − y₁) = (x − x₁)/(x₂ − x₁).",
      "Dapat juga dengan dua langkah: cari m terlebih dahulu, lalu pakai rumus titik-gradien.",
    ],
  },
  {
    id: "g16",
    label:
      "Tentukan persamaan garis yang melalui (1, 2) dan (3, 8).",
    kind: "choice",
    options: ["y = 3x − 1", "y = 2x", "y = 3x + 1", "y = −3x + 5"],
    correctIndex: 0,
    discussion: [
      "Cari m = (8 − 2)/(3 − 1) = 6/2 = 3.",
      "Pakai titik (1, 2): y − 2 = 3(x − 1) → y = 3x − 1. ✓",
      "Cek titik (3, 8): 3(3) − 1 = 8 ✓.",
    ],
  },
  {
    id: "g17",
    label:
      "Dua garis dikatakan SEJAJAR jika kedua gradiennya …",
    kind: "choice",
    options: [
      "sama (m₁ = m₂)",
      "berlawanan tanda",
      "hasil kalinya = −1",
      "hasil kalinya = 1",
    ],
    correctIndex: 0,
    discussion: [
      "Garis sejajar TIDAK pernah berpotongan.",
      "Syarat: m₁ = m₂ (gradien sama, konstanta boleh berbeda).",
      "Contoh: y = 2x + 1 sejajar dengan y = 2x − 5 (sama-sama m = 2).",
    ],
  },
  {
    id: "g18",
    label:
      "Dua garis dikatakan SALING TEGAK LURUS jika perkalian gradiennya sama dengan …",
    kind: "fill",
    answers: ["-1", "−1"],
    discussion: [
      "Syarat tegak lurus: m₁ × m₂ = −1.",
      "Contoh: y = 2x + 3 tegak lurus dengan y = (−1/2)x + 4 karena 2 × (−1/2) = −1.",
      "Garis mendatar (m = 0) tegak lurus dengan garis tegak (m tak terdefinisi).",
    ],
  },
  {
    id: "g19",
    label:
      "Garis k: y = 3x + 5. Manakah persamaan garis yang SEJAJAR dengan k?",
    kind: "choice",
    options: [
      "y = 3x − 2",
      "y = −3x + 5",
      "y = (1/3)x + 5",
      "y = (−1/3)x − 2",
    ],
    correctIndex: 0,
    discussion: [
      "Sejajar → gradien sama. Gradien k adalah 3.",
      "y = 3x − 2 juga memiliki m = 3 → SEJAJAR. ✓",
    ],
  },
  {
    id: "g20",
    label:
      "Garis k: y = 3x + 5. Manakah persamaan garis yang TEGAK LURUS k?",
    kind: "choice",
    options: [
      "y = 3x − 2",
      "y = −3x + 5",
      "y = (1/3)x + 5",
      "y = (−1/3)x + 1",
    ],
    correctIndex: 3,
    discussion: [
      "Tegak lurus → m₁ × m₂ = −1. Gradien k = 3.",
      "Cari m₂ = −1/3.",
      "y = (−1/3)x + 1 ✓ karena 3 × (−1/3) = −1.",
    ],
  },
  {
    id: "g21",
    label:
      "Pernyataan: Pada y = mx + c, KONSTANTA c adalah ordinat titik potong garis dengan sumbu y.",
    kind: "truefalse",
    correctTrue: true,
    discussion: [
      "BENAR. Ketika x = 0, maka y = m(0) + c = c.",
      "Jadi garis selalu memotong sumbu y di titik (0, c).",
    ],
  },
  {
    id: "g22",
    label:
      "Jodohkan setiap persamaan dengan gradiennya:",
    kind: "match",
    pairs: [
      { left: "y = 2x − 7", right: "m = 2" },
      { left: "3x + y = 5", right: "m = −3" },
      { left: "y = 5", right: "m = 0" },
      { left: "2x − 4y = 8", right: "m = 1/2" },
    ],
    discussion: [
      "y = 2x − 7 → eksplisit, m = 2.",
      "3x + y = 5 → y = −3x + 5, m = −3.",
      "y = 5 → garis mendatar, m = 0.",
      "2x − 4y = 8 → −4y = −2x + 8 → y = (1/2)x − 2, m = 1/2.",
    ],
  },
  {
    id: "g23",
    label:
      "Urutkan langkah MENGGAMBAR grafik 2x + y = 4 dengan metode dua titik:",
    kind: "sort",
    items: [
      "Plot kedua titik pada bidang Kartesius.",
      "Saat y = 0, hitung x. Diperoleh titik potong sumbu x.",
      "Hubungkan kedua titik dengan penggaris dan beri nama garisnya.",
      "Saat x = 0, hitung y. Diperoleh titik potong sumbu y.",
    ],
    correctOrder: [
      "Saat x = 0, hitung y. Diperoleh titik potong sumbu y.",
      "Saat y = 0, hitung x. Diperoleh titik potong sumbu x.",
      "Plot kedua titik pada bidang Kartesius.",
      "Hubungkan kedua titik dengan penggaris dan beri nama garisnya.",
    ],
    discussion: [
      "Cara ini disebut metode DUA TITIK (cara cepat untuk PGL).",
      "Saat x = 0 → y = 4 → titik (0, 4).",
      "Saat y = 0 → 2x = 4 → x = 2 → titik (2, 0).",
      "Tarik penggaris menghubungkan keduanya — itulah grafik 2x + y = 4.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Bentuk Persamaan Garis Lurus",
    body:
      "Bentuk eksplisit: y = mx + c (m = gradien, c = konstanta).\nBentuk implisit: ax + by + c = 0.\nDari implisit ke eksplisit: y = (−a/b)x + (−c/b).",
    color: "cyan",
  },
  {
    title: "Menghitung Gradien",
    body:
      "Dari y = mx + c: m langsung = koefisien x.\nDari ax + by + c = 0: m = −a/b.\nDari dua titik: m = (y₂ − y₁) / (x₂ − x₁).",
    color: "amber",
  },
  {
    title: "Hubungan Dua Garis",
    body:
      "Sejajar: m₁ = m₂.\nTegak lurus: m₁ × m₂ = −1.\nBerimpit: m₁ = m₂ DAN c₁ = c₂.\nBerpotongan biasa: m₁ ≠ m₂.",
    color: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-jenis-garis",
    title: "🎯 Game 1 — Jenis Garis Berdasarkan Gradien",
    description: "Seret setiap persamaan ke kategori jenis garis berdasarkan nilai gradiennya.",
    buckets: [
      { id: "naik", label: "Garis NAIK (m > 0)", emoji: "↗️", color: "emerald" },
      { id: "turun", label: "Garis TURUN (m < 0)", emoji: "↘️", color: "rose" },
      { id: "datar", label: "Garis MENDATAR (m = 0)", emoji: "↔️", color: "cyan" },
    ],
    items: [
      { id: "i1", label: "y = 3x + 1", bucketId: "naik", emoji: "📈" },
      { id: "i2", label: "y = −2x + 4", bucketId: "turun", emoji: "📉" },
      { id: "i3", label: "y = 5", bucketId: "datar", emoji: "➖" },
      { id: "i4", label: "y = (1/2)x − 3", bucketId: "naik", emoji: "📈" },
      { id: "i5", label: "y = −x", bucketId: "turun", emoji: "📉" },
      { id: "i6", label: "y = −7", bucketId: "datar", emoji: "➖" },
      { id: "i7", label: "y = 0,25x", bucketId: "naik", emoji: "📈" },
      { id: "i8", label: "3x + y = 5 (→ y = −3x + 5)", bucketId: "turun", emoji: "📉" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-hubungan",
    title: "🎯 Game 2 — Hubungan Dua Garis",
    description: "Pilih hubungan yang TEPAT antara garis k dan garis l untuk setiap pasangan.",
    rightOptions: ["SEJAJAR", "TEGAK LURUS", "BERPOTONGAN BIASA", "BERIMPIT"],
    pairs: [
      { id: "p1", left: "k: y = 2x + 3   |   l: y = 2x − 5", correctRight: "SEJAJAR", emoji: "║" },
      { id: "p2", left: "k: y = 2x + 1   |   l: y = (−1/2)x + 4", correctRight: "TEGAK LURUS", emoji: "⊥" },
      { id: "p3", left: "k: y = 3x + 2   |   l: y = 3x + 2", correctRight: "BERIMPIT", emoji: "≡" },
      { id: "p4", left: "k: y = x + 1   |   l: y = 4x − 2", correctRight: "BERPOTONGAN BIASA", emoji: "✕" },
      { id: "p5", left: "k: y = (1/3)x   |   l: y = −3x + 7", correctRight: "TEGAK LURUS", emoji: "⊥" },
      { id: "p6", left: "k: 2x + y = 4   |   l: 4x + 2y = 8", correctRight: "BERIMPIT", emoji: "≡" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    label:
      "Tentukan gradien garis yang melalui titik (−2, 3) dan (4, 15).",
    kind: "fill",
    answers: ["2"],
    hint: "Gunakan m = (y₂ − y₁)/(x₂ − x₁).",
    discussion: [
      "m = (15 − 3) / (4 − (−2)) = 12 / 6 = 2.",
      "Garis ini NAIK karena m positif.",
    ],
  },
  {
    id: "p2",
    label: "Gradien garis 4x − 2y + 6 = 0 adalah …",
    kind: "fill",
    answers: ["2"],
    hint: "Gunakan m = −a/b atau ubah ke bentuk y = mx + c.",
    discussion: [
      "Cara 1: m = −a/b = −4/(−2) = 2.",
      "Cara 2: −2y = −4x − 6 → y = 2x + 3 → m = 2.",
    ],
  },
  {
    id: "p3",
    label:
      "Persamaan garis melalui titik (3, −2) dengan gradien 4 adalah …",
    kind: "choice",
    options: ["y = 4x − 14", "y = 4x + 14", "y = 4x − 10", "y = 4x + 10"],
    correctIndex: 0,
    hint: "Pakai bentuk titik-gradien: y − y₁ = m(x − x₁).",
    discussion: [
      "y − (−2) = 4(x − 3) → y + 2 = 4x − 12 → y = 4x − 14.",
      "Cek: x = 3 → y = 12 − 14 = −2 ✓.",
    ],
  },
  {
    id: "p4",
    label:
      "Persamaan garis yang melalui titik (2, 1) dan (5, 7) adalah …",
    kind: "choice",
    options: ["y = 2x − 3", "y = 2x + 3", "y = (1/2)x", "y = −2x + 5"],
    correctIndex: 0,
    hint: "Cari m terlebih dahulu, lalu pakai titik-gradien.",
    discussion: [
      "m = (7 − 1)/(5 − 2) = 6/3 = 2.",
      "y − 1 = 2(x − 2) → y = 2x − 3.",
      "Cek (5, 7): 2(5) − 3 = 7 ✓.",
    ],
  },
  {
    id: "p5",
    label:
      "Garis k melalui (0, 4) dan (3, 1). Persamaan garis l yang SEJAJAR k dan melalui (0, −2) adalah …",
    kind: "choice",
    options: ["y = −x − 2", "y = x − 2", "y = −2x − 2", "y = 2x − 2"],
    correctIndex: 0,
    hint: "Hitung m garis k dulu — sejajar berarti m sama.",
    discussion: [
      "m_k = (1 − 4)/(3 − 0) = −3/3 = −1.",
      "Sejajar → m_l = −1.",
      "Melalui (0, −2) → konstanta c = −2.",
      "y = −x − 2.",
    ],
  },
  {
    id: "p6",
    label:
      "Persamaan garis yang melalui (4, 1) dan TEGAK LURUS terhadap y = 2x + 5 adalah …",
    kind: "choice",
    options: [
      "y = (−1/2)x + 3",
      "y = 2x − 7",
      "y = (1/2)x − 1",
      "y = −2x + 9",
    ],
    correctIndex: 0,
    hint: "Tegak lurus: m₁ × m₂ = −1.",
    discussion: [
      "Gradien y = 2x + 5 adalah 2.",
      "Tegak lurus → m baru = −1/2.",
      "Pakai (4, 1): y − 1 = (−1/2)(x − 4) → y = (−1/2)x + 2 + 1 = (−1/2)x + 3.",
    ],
  },
  {
    id: "p7",
    label:
      "Bu Sari berjualan kue. Modal awal Rp 50.000 dan setiap kue terjual untungnya Rp 2.000. Persamaan keuntungan y (rupiah) terhadap banyak kue terjual x adalah …",
    kind: "choice",
    options: [
      "y = 2.000x − 50.000",
      "y = 2.000x + 50.000",
      "y = 50.000x − 2.000",
      "y = 50.000 − 2.000x",
    ],
    correctIndex: 0,
    hint: "Modal awal = saat belum jual ada apa? Untung per kue = gradien.",
    discussion: [
      "Saat x = 0 (belum jual), keuntungan = −50.000 (rugi modal awal). Maka c = −50.000.",
      "Setiap kue terjual menambah Rp 2.000 → m = 2.000.",
      "y = 2.000x − 50.000.",
      "Bu Sari mulai untung saat 2.000x = 50.000 → x = 25 kue.",
    ],
  },
  {
    id: "p8",
    label:
      "Tarif taksi: tarif buka pintu Rp 7.000 + Rp 4.000 per km. Untuk perjalanan 12 km, total tarifnya adalah …",
    kind: "fill",
    answers: ["55000", "55.000", "Rp 55.000", "Rp55.000"],
    hint: "Buat persamaan dahulu: y = 4.000x + 7.000.",
    discussion: [
      "Tarif buka pintu = c = 7.000. Tarif per km = m = 4.000.",
      "y = 4.000x + 7.000.",
      "x = 12 → y = 4.000(12) + 7.000 = 48.000 + 7.000 = 55.000.",
      "Total tarif = Rp 55.000.",
    ],
  },
];

const PersamaanGarisLurusLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab 6"
    title="Persamaan Garis Lurus — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo temukan rahasia di balik GARIS LURUS! Kamu akan belajar bentuk persamaannya, mengenal GRADIEN, menentukan persamaan garis, dan mengeksplorasi hubungan dua garis — sambil bermain dengan laboratorium garis interaktif yang bisa kamu seret!"
    situations={situations}
    guidedIntro="Kerjakan soal-soal berikut secara berurutan. Setiap jawabanmu akan menuntun pada konsep persamaan garis lurus. Tekan 'Periksa Jawaban' di bawah untuk melihat pembahasan lengkap."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="rounded-3xl border border-emerald-300/30 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-teal-500/10 p-5 md:p-6 shadow-[0_0_45px_rgba(52,211,153,0.18)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🎮</span>
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-emerald-200">
              Laboratorium Garis Interaktif
            </h3>
            <p className="text-sm text-white/70">
              Seret titik biru (A) atau merah muda (B) — saksikan persamaan garis, gradien, dan konstanta berubah seketika!
            </p>
          </div>
        </div>
        <PGLGradientInteractive />
        <p className="mt-3 text-xs text-white/65 italic">
          💡 Tantangan: coba selesaikan setiap misi di atas grafik. Saat berhasil, kotak misi akan berkedip kuning!
        </p>
      </section>
    }
    games={games}
    practiceIntro="Kerjakan soal latihan untuk mengasah pemahamanmu tentang gradien, persamaan garis, dan hubungan dua garis."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/persamaan-garis-lurus"
    backLabel="Kembali ke Menu Persamaan Garis Lurus"
    scoreMessages={{
      perfect: "🌟 Luar biasa, Sobat Numatik! Pemahaman Persamaan Garis Lurus-mu sudah sempurna!",
      high: "👍 Bagus sekali! Periksa kembali bagian yang masih merah agar lebih mantap.",
      medium: "🚀 Sudah mulai paham. Ulangi penemuan terbimbing dan main lagi laboratorium garisnya.",
      low: "💪 Tetap semangat! Mulai dari atas, perhatikan rumus gradien dan bentuk y = mx + c.",
    }}
  />
);

export default PersamaanGarisLurusLKPDPage;
