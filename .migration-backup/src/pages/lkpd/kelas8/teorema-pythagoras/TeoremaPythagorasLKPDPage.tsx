import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import PythagorasInteractive from "@/components/PythagorasInteractive";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Tangga Bersandar",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-600/20 border border-orange-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <line x1="20" y1="140" x2="180" y2="140" stroke="#94a3b8" strokeWidth="2" />
          <line x1="60" y1="140" x2="60" y2="40" stroke="#475569" strokeWidth="3" strokeDasharray="4 3" />
          <line x1="60" y1="40" x2="140" y2="140" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
          <text x="40" y="95" fill="#a78bfa" fontSize="12" fontWeight="bold">3 m</text>
          <text x="100" y="155" fill="#475569" fontSize="11">4 m</text>
          <text x="115" y="80" fill="#fb923c" fontSize="13" fontWeight="bold">tangga = ?</text>
          <rect x="60" y="128" width="12" height="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        </svg>
      </div>
    ),
    text:
      "Sebuah tangga bersandar pada dinding. Kaki tangga 4 m dari dinding, dan ujung atas tangga setinggi 3 m di dinding. Berapa panjang tangga? Tangga, dinding, dan lantai membentuk SEGITIGA SIKU-SIKU. Sisi miring (tangga) selalu yang terpanjang — disebut HIPOTENUSA.",
  },
  {
    title: "Situasi 2 — Persegi pada Sisi Segitiga",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-600/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <polygon points="80,100 140,100 80,55" fill="#22d3ee" fillOpacity="0.3" stroke="#22d3ee" strokeWidth="2" />
          <rect x="80" y="100" width="60" height="40" fill="#fb923c" fillOpacity="0.3" stroke="#fb923c" strokeWidth="1.5" />
          <text x="110" y="125" fill="#fed7aa" fontSize="9" fontWeight="bold" textAnchor="middle">a²</text>
          <rect x="35" y="55" width="45" height="45" fill="#a78bfa" fillOpacity="0.3" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="57" y="80" fill="#ddd6fe" fontSize="9" fontWeight="bold" textAnchor="middle">b²</text>
          <polygon points="80,55 140,100 168,30" fill="#34d399" fillOpacity="0.3" stroke="#34d399" strokeWidth="1.5" />
          <text x="125" y="55" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">c²</text>
        </svg>
      </div>
    ),
    text:
      "Pada setiap segitiga siku-siku, jika kita gambar PERSEGI di tiap sisinya, ternyata: LUAS persegi pada sisi miring (c²) = jumlah luas dua persegi pada sisi siku-sikunya (a² + b²). Inilah TEOREMA PYTHAGORAS!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Segitiga siku-siku adalah segitiga yang salah satu sudutnya berukuran …",
    kind: "fill",
    answers: ["90", "90 derajat", "90°", "90 derajad"],
    discussion: [
      "Sudut siku-siku = 90°.",
      "Sisi-sisi yang membentuk sudut siku-siku disebut SISI SIKU-SIKU.",
      "Sisi yang berhadapan dengan sudut siku-siku disebut HIPOTENUSA (sisi miring).",
    ],
  },
  {
    id: "g2",
    label: "Pada segitiga siku-siku, sisi terpanjang selalu adalah …",
    kind: "choice",
    options: ["sisi siku-siku terpendek", "salah satu sisi siku-siku", "hipotenusa", "tidak ada aturan"],
    correctIndex: 2,
    discussion: [
      "Hipotenusa berhadapan dengan sudut terbesar yaitu 90°.",
      "Karena sisi BERSEBERANGAN dengan sudut terbesar adalah sisi terpanjang, maka hipotenusa adalah sisi terpanjang.",
    ],
  },
  {
    id: "g3",
    label:
      "Bunyi Teorema Pythagoras: Pada setiap segitiga siku-siku berlaku c² = … (a dan b sisi siku-siku, c hipotenusa).",
    kind: "fill",
    answers: ["a²+b²", "a^2+b^2", "a² + b²", "a^2 + b^2"],
    discussion: [
      "Bunyi Teorema Pythagoras: c² = a² + b².",
      "Artinya: kuadrat hipotenusa SAMA DENGAN jumlah kuadrat dua sisi siku-sikunya.",
      "Secara visual: luas persegi besar = jumlah luas dua persegi kecil.",
    ],
  },
  {
    id: "g4",
    label:
      "Untuk segitiga siku-siku dengan sisi siku-siku 6 dan 8, hipotenusa-nya adalah …",
    kind: "fill",
    answers: ["10"],
    discussion: [
      "c² = 6² + 8² = 36 + 64 = 100.",
      "c = √100 = 10.",
      "Triple 6-8-10 adalah kelipatan dari triple 3-4-5.",
    ],
  },
  {
    id: "g5",
    label:
      "Jika hipotenusa = 13 cm dan salah satu sisi siku-siku = 5 cm, panjang sisi siku-siku lainnya = …",
    kind: "fill",
    answers: ["12"],
    discussion: [
      "Gunakan c² = a² + b² → 13² = 5² + b².",
      "169 = 25 + b² → b² = 144 → b = √144 = 12.",
      "Triple 5-12-13 adalah triple Pythagoras klasik.",
    ],
  },
  {
    id: "g6",
    label: "Tiga bilangan asli (a, b, c) yang memenuhi a² + b² = c² disebut …",
    kind: "choice",
    options: ["tripel pythagoras", "deret pythagoras", "kelipatan pythagoras", "barisan pythagoras"],
    correctIndex: 0,
    discussion: [
      "Disebut TRIPLE PYTHAGORAS (Tripel Pythagoras).",
      "Contoh asli: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29).",
      "Setiap kelipatan dari triple juga merupakan triple, misal (6, 8, 10) atau (9, 12, 15).",
    ],
  },
  {
    id: "g7",
    label: "Manakah berikut yang BUKAN triple Pythagoras?",
    kind: "choice",
    options: ["(3, 4, 5)", "(5, 12, 13)", "(6, 7, 9)", "(8, 15, 17)"],
    correctIndex: 2,
    discussion: [
      "Cek: 6² + 7² = 36 + 49 = 85. Sedangkan 9² = 81. 85 ≠ 81 → BUKAN triple.",
      "Yang lain: 3²+4² = 25 = 5² ✓; 5²+12² = 169 = 13² ✓; 8²+15² = 289 = 17² ✓.",
    ],
  },
  {
    id: "g8",
    label:
      "Jika sebuah segitiga memiliki sisi a, b, c (c terpanjang) dan c² = a² + b², maka segitiga tersebut berjenis …",
    kind: "fill",
    answers: ["siku-siku", "siku siku", "siku-siku.", "sikusiku"],
    discussion: [
      "Konvers Teorema Pythagoras: Jika c² = a² + b², maka segitiga adalah SIKU-SIKU.",
      "Jika c² < a² + b² → segitiga LANCIP (semua sudut < 90°).",
      "Jika c² > a² + b² → segitiga TUMPUL (ada sudut > 90°).",
    ],
  },
  {
    id: "g9",
    label:
      "Segitiga dengan sisi 9, 12, 15 berjenis …",
    kind: "choice",
    options: ["siku-siku", "lancip", "tumpul", "sama sisi"],
    correctIndex: 0,
    discussion: [
      "Sisi terpanjang = 15. Cek: 15² = 225 vs 9² + 12² = 81 + 144 = 225.",
      "225 = 225 → SIKU-SIKU. (Triple 9-12-15 adalah kelipatan 3 dari 3-4-5).",
    ],
  },
  {
    id: "g10",
    label: "Segitiga dengan sisi 4, 5, 6 berjenis …",
    kind: "choice",
    options: ["siku-siku", "lancip", "tumpul", "tidak mungkin"],
    correctIndex: 1,
    discussion: [
      "Sisi terpanjang = 6. Cek: 6² = 36 vs 4² + 5² = 16 + 25 = 41.",
      "36 < 41 → LANCIP (semua sudut < 90°).",
    ],
  },
  {
    id: "g11",
    label: "Segitiga dengan sisi 5, 6, 8 berjenis …",
    kind: "choice",
    options: ["siku-siku", "lancip", "tumpul", "tidak mungkin"],
    correctIndex: 2,
    discussion: [
      "Sisi terpanjang = 8. Cek: 8² = 64 vs 5² + 6² = 25 + 36 = 61.",
      "64 > 61 → TUMPUL (ada sudut > 90°).",
    ],
  },
  {
    id: "g12",
    label:
      "Pada segitiga SIKU-SIKU SAMA KAKI, perbandingan sisi-sisinya (siku-siku : siku-siku : hipotenusa) adalah …",
    kind: "choice",
    options: ["1 : 1 : √2", "1 : √3 : 2", "1 : 1 : 2", "2 : 2 : 3"],
    correctIndex: 0,
    discussion: [
      "Sudut-sudutnya 45° : 45° : 90°.",
      "Misal kedua sisi siku-siku = 1, maka c² = 1² + 1² = 2 → c = √2.",
      "Perbandingan sisi: 1 : 1 : √2.",
    ],
  },
  {
    id: "g13",
    label:
      "Pada segitiga siku-siku dengan sudut 30° : 60° : 90°, perbandingan sisi (depan 30° : depan 60° : depan 90°) adalah …",
    kind: "choice",
    options: ["1 : √3 : 2", "1 : 1 : √2", "1 : 2 : 3", "1 : 2 : √3"],
    correctIndex: 0,
    discussion: [
      "Setengah dari segitiga sama sisi.",
      "Sisi depan 30° = 1, depan 60° = √3, depan 90° (hipotenusa) = 2.",
      "Perbandingan: 1 : √3 : 2.",
    ],
  },
  {
    id: "g14",
    label:
      "Sebuah segitiga siku-siku sama kaki memiliki sisi siku-siku 5 cm. Panjang hipotenusanya = …",
    kind: "choice",
    options: ["5√2 cm", "5√3 cm", "10 cm", "5 cm"],
    correctIndex: 0,
    discussion: [
      "Pakai perbandingan 1 : 1 : √2 → c = 5 × √2 = 5√2 cm.",
      "Atau hitung langsung: c² = 5² + 5² = 50 → c = √50 = 5√2.",
    ],
  },
  {
    id: "g15",
    label:
      "Pernyataan: Pada segitiga siku-siku, jika diketahui hipotenusa dan SATU sisi siku-siku, sisi siku-siku lainnya dapat dihitung dengan b² = c² − a².",
    kind: "truefalse",
    correctTrue: true,
    discussion: [
      "BENAR. Dari c² = a² + b², kita peroleh b² = c² − a².",
      "Lalu b = √(c² − a²).",
      "Catatan: c harus > a (hipotenusa > sisi siku-siku) agar hasil tidak negatif.",
    ],
  },
  {
    id: "g16",
    label: "Jodohkan setiap segitiga dengan jenisnya:",
    kind: "match",
    pairs: [
      { left: "Sisi 7, 24, 25", right: "Siku-siku" },
      { left: "Sisi 5, 6, 7", right: "Lancip" },
      { left: "Sisi 4, 5, 7", right: "Tumpul" },
      { left: "Sisi 6, 8, 11", right: "Bukan segitiga siku-siku" },
    ],
    discussion: [
      "(7,24,25): 25² = 625 = 7² + 24² = 49 + 576 → SIKU-SIKU.",
      "(5,6,7): 7² = 49 < 5² + 6² = 61 → LANCIP.",
      "(4,5,7): 7² = 49 > 4² + 5² = 41 → TUMPUL.",
      "(6,8,11): 11² = 121 ≠ 6² + 8² = 100 → BUKAN siku-siku (karena 121 > 100, sebenarnya tumpul).",
    ],
  },
  {
    id: "g17",
    label:
      "Urutkan langkah menghitung sisi siku-siku jika diketahui hipotenusa dan satu sisi:",
    kind: "sort",
    items: [
      "Tarik akar pangkat dua untuk memperoleh sisi yang dicari.",
      "Substitusikan nilai yang diketahui ke dalam persamaan.",
      "Tuliskan rumus c² = a² + b² dan ubah menjadi sisi yang dicari.",
      "Hitung selisih kuadrat hipotenusa dan kuadrat sisi yang diketahui.",
    ],
    correctOrder: [
      "Tuliskan rumus c² = a² + b² dan ubah menjadi sisi yang dicari.",
      "Substitusikan nilai yang diketahui ke dalam persamaan.",
      "Hitung selisih kuadrat hipotenusa dan kuadrat sisi yang diketahui.",
      "Tarik akar pangkat dua untuk memperoleh sisi yang dicari.",
    ],
    discussion: [
      "Contoh: hipotenusa c = 17 cm dan a = 8 cm.",
      "Langkah 1: b² = c² − a².",
      "Langkah 2: b² = 17² − 8².",
      "Langkah 3: b² = 289 − 64 = 225.",
      "Langkah 4: b = √225 = 15 cm.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Teorema & Konversnya",
    body:
      "Teorema: pada segitiga siku-siku, c² = a² + b² (c = hipotenusa).\nKonvers: jika c² = a² + b² → segitiga siku-siku.\nc² < a² + b² → lancip; c² > a² + b² → tumpul.",
    color: "cyan",
  },
  {
    title: "Triple Pythagoras",
    body:
      "Tripel asli yang sering muncul: (3,4,5), (5,12,13), (7,24,25), (8,15,17), (20,21,29).\nKelipatan triple juga merupakan triple. Contoh: (6,8,10), (9,12,15), (15,20,25).",
    color: "amber",
  },
  {
    title: "Sudut Khusus",
    body:
      "Siku-siku sama kaki (45°-45°-90°): sisi 1 : 1 : √2.\nSetengah segitiga sama sisi (30°-60°-90°): sisi 1 : √3 : 2.\nGunakan perbandingan ini untuk mempercepat perhitungan.",
    color: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-jenis-segitiga",
    title: "🎯 Game 1 — Jenis Segitiga Berdasarkan Sisi",
    description: "Seret setiap kelompok sisi ke kategori jenis segitiga yang TEPAT.",
    buckets: [
      { id: "siku", label: "SIKU-SIKU (c² = a² + b²)", emoji: "📐", color: "emerald" },
      { id: "lancip", label: "LANCIP (c² < a² + b²)", emoji: "🔺", color: "cyan" },
      { id: "tumpul", label: "TUMPUL (c² > a² + b²)", emoji: "🔻", color: "rose" },
    ],
    items: [
      { id: "i1", label: "(3, 4, 5)", bucketId: "siku", emoji: "📐" },
      { id: "i2", label: "(6, 8, 10)", bucketId: "siku", emoji: "📐" },
      { id: "i3", label: "(5, 12, 13)", bucketId: "siku", emoji: "📐" },
      { id: "i4", label: "(4, 5, 6)", bucketId: "lancip", emoji: "🔺" },
      { id: "i5", label: "(7, 8, 9)", bucketId: "lancip", emoji: "🔺" },
      { id: "i6", label: "(5, 6, 8)", bucketId: "tumpul", emoji: "🔻" },
      { id: "i7", label: "(4, 6, 9)", bucketId: "tumpul", emoji: "🔻" },
      { id: "i8", label: "(8, 15, 17)", bucketId: "siku", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-hipotenusa",
    title: "🎯 Game 2 — Cari Hipotenusa",
    description: "Pasangkan setiap segitiga siku-siku (sisi a, b) dengan panjang HIPOTENUSA-nya.",
    rightOptions: ["5", "10", "13", "17", "25", "5√2"],
    pairs: [
      { id: "p1", left: "a = 3, b = 4", correctRight: "5", emoji: "📐" },
      { id: "p2", left: "a = 6, b = 8", correctRight: "10", emoji: "📐" },
      { id: "p3", left: "a = 5, b = 12", correctRight: "13", emoji: "📐" },
      { id: "p4", left: "a = 8, b = 15", correctRight: "17", emoji: "📐" },
      { id: "p5", left: "a = 7, b = 24", correctRight: "25", emoji: "📐" },
      { id: "p6", left: "a = 5, b = 5", correctRight: "5√2", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    label:
      "Sebuah segitiga siku-siku memiliki sisi siku-siku 9 cm dan 12 cm. Panjang hipotenusanya adalah … cm.",
    kind: "fill",
    answers: ["15"],
    hint: "Gunakan c² = a² + b².",
    discussion: [
      "c² = 9² + 12² = 81 + 144 = 225.",
      "c = √225 = 15 cm.",
      "Ini adalah triple 9-12-15 (kelipatan 3 dari 3-4-5).",
    ],
  },
  {
    id: "p2",
    label:
      "Hipotenusa segitiga siku-siku 25 cm dan salah satu sisi siku-siku 7 cm. Sisi siku-siku lainnya = … cm.",
    kind: "fill",
    answers: ["24"],
    hint: "Gunakan b² = c² − a².",
    discussion: [
      "b² = 25² − 7² = 625 − 49 = 576.",
      "b = √576 = 24 cm.",
      "Triple 7-24-25.",
    ],
  },
  {
    id: "p3",
    label: "Tiga bilangan berikut yang merupakan TRIPLE PYTHAGORAS adalah …",
    kind: "choice",
    options: ["(8, 12, 15)", "(9, 40, 41)", "(10, 12, 14)", "(7, 8, 11)"],
    correctIndex: 1,
    hint: "Cek c² = a² + b² untuk setiap pilihan.",
    discussion: [
      "(9, 40, 41): 41² = 1681 = 81 + 1600 = 9² + 40² ✓ TRIPLE.",
      "(8,12,15): 15² = 225 ≠ 64+144 = 208.",
      "(10,12,14): 14² = 196 ≠ 100+144 = 244.",
      "(7,8,11): 11² = 121 ≠ 49+64 = 113.",
    ],
  },
  {
    id: "p4",
    label:
      "Segitiga dengan sisi 12 cm, 16 cm, dan 20 cm berjenis …",
    kind: "choice",
    options: ["siku-siku", "lancip", "tumpul", "tidak ada"],
    correctIndex: 0,
    hint: "Cek apakah memenuhi 12² + 16² = 20².",
    discussion: [
      "20² = 400. 12² + 16² = 144 + 256 = 400.",
      "400 = 400 → SIKU-SIKU.",
      "Ini kelipatan 4 dari triple 3-4-5.",
    ],
  },
  {
    id: "p5",
    label:
      "Tangga sepanjang 13 m bersandar pada dinding. Kaki tangga 5 m dari dinding. Tinggi ujung tangga di dinding = … m.",
    kind: "fill",
    answers: ["12"],
    hint: "Tangga adalah hipotenusa, jarak ke dinding adalah salah satu sisi siku-siku.",
    discussion: [
      "Tangga (hipotenusa) c = 13. Jarak (sisi siku-siku) a = 5.",
      "Tinggi b² = 13² − 5² = 169 − 25 = 144.",
      "b = 12 m.",
      "Triple 5-12-13.",
    ],
  },
  {
    id: "p6",
    label:
      "Sebuah persegi panjang berukuran 6 cm × 8 cm. Panjang diagonalnya adalah … cm.",
    kind: "fill",
    answers: ["10"],
    hint: "Diagonal membagi persegi panjang menjadi dua segitiga siku-siku.",
    discussion: [
      "Diagonal = hipotenusa segitiga siku-siku dengan sisi 6 dan 8.",
      "d² = 6² + 8² = 36 + 64 = 100.",
      "d = √100 = 10 cm.",
    ],
  },
  {
    id: "p7",
    label:
      "Sebuah segitiga siku-siku sama kaki memiliki sisi siku-siku 8 cm. Panjang hipotenusanya = …",
    kind: "choice",
    options: ["8√2 cm", "16 cm", "8√3 cm", "8 cm"],
    correctIndex: 0,
    hint: "Pakai perbandingan 1 : 1 : √2.",
    discussion: [
      "Pada siku-siku sama kaki, c = sisi × √2.",
      "c = 8 × √2 = 8√2 cm.",
      "Verifikasi: c² = 8² + 8² = 128. √128 = √(64×2) = 8√2.",
    ],
  },
  {
    id: "p8",
    label:
      "Sebuah kapal berlayar 6 km ke arah Utara, kemudian belok ke Timur sejauh 8 km. Jarak terpendek dari titik awal ke posisi sekarang = … km.",
    kind: "fill",
    answers: ["10"],
    hint: "Lintasan Utara dan Timur tegak lurus → membentuk segitiga siku-siku.",
    discussion: [
      "Arah Utara dan Timur saling tegak lurus, jadi membentuk segitiga siku-siku.",
      "Sisi siku-siku: 6 km dan 8 km.",
      "Jarak terpendek = hipotenusa = √(6² + 8²) = √100 = 10 km.",
    ],
  },
];

const TeoremaPythagorasLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab 7"
    title="Teorema Pythagoras — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo temukan keajaiban Pythagoras! Kamu akan membuktikan rumus c² = a² + b², mengenal triple Pythagoras, mengelompokkan jenis segitiga, dan mengeksplorasi sudut khusus — sambil bermain dengan segitiga siku-siku interaktif yang bisa kamu seret!"
    situations={situations}
    guidedIntro="Kerjakan soal-soal berikut secara berurutan. Setiap jawabanmu akan menuntun pada konsep Teorema Pythagoras. Tekan 'Periksa Jawaban' di bawah untuk melihat pembahasan lengkap."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-amber-500/10 p-5 md:p-6 shadow-[0_0_45px_rgba(34,211,238,0.18)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🎮</span>
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-cyan-200">
              Laboratorium Pythagoras
            </h3>
            <p className="text-sm text-white/70">
              Seret pegangan oranye atau ungu — saksikan luas tiga persegi memenuhi a² + b² = c² secara langsung!
            </p>
          </div>
        </div>
        <PythagorasInteractive />
        <p className="mt-3 text-xs text-white/65 italic">
          💡 Tantangan: ubah panjang sisi sehingga menjadi triple Pythagoras (3-4-5, 5-12-13, dst). Saat berhasil, segitiga akan menyala kuning!
        </p>
      </section>
    }
    games={games}
    practiceIntro="Kerjakan soal latihan untuk mengasah pemahamanmu tentang Teorema Pythagoras dan penerapannya."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/teorema-pythagoras"
    backLabel="Kembali ke Menu Teorema Pythagoras"
    scoreMessages={{
      perfect: "🌟 Luar biasa, Sobat Numatik! Pemahaman Teorema Pythagoras-mu sudah sempurna!",
      high: "👍 Bagus sekali! Periksa kembali bagian yang masih merah agar lebih mantap.",
      medium: "🚀 Sudah mulai paham. Ulangi penemuan terbimbing dan main lagi laboratorium Pythagoras-nya.",
      low: "💪 Tetap semangat! Mulai dari atas, perhatikan rumus c² = a² + b² dan triple Pythagoras.",
    }}
  />
);

export default TeoremaPythagorasLKPDPage;
