import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import SPLDVGraphInteractive from "@/components/SPLDVGraphInteractive";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Belanja di Kantin",
    visual: (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-rose-500/30 to-pink-500/20 border border-rose-300/40 p-3 text-center">
          <p className="text-3xl mb-1">🍫🍪</p>
          <p className="text-xs font-bold text-white">3 cokelat + 2 biskuit</p>
          <p className="text-sm font-bold text-yellow-200 mt-1">Rp 13.000</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 border border-cyan-300/40 p-3 text-center">
          <p className="text-3xl mb-1">🍫🍪</p>
          <p className="text-xs font-bold text-white">2 cokelat + 4 biskuit</p>
          <p className="text-sm font-bold text-yellow-200 mt-1">Rp 14.000</p>
        </div>
      </div>
    ),
    text:
      "Sasha membeli 3 cokelat dan 2 biskuit seharga Rp 13.000. Bayu membeli 2 cokelat dan 4 biskuit seharga Rp 14.000. Berapakah harga 1 cokelat dan 1 biskuit? Untuk menjawabnya, kamu butuh DUA persamaan dengan DUA variabel — inilah ide dasar SPLDV.",
  },
  {
    title: "Situasi 2 — Dua Garis Bertemu",
    visual: (
      <svg viewBox="0 0 200 160" className="w-full max-w-xs mx-auto">
        <rect width="200" height="160" fill="#0b1220" rx="8" />
        <line x1="20" y1="80" x2="180" y2="80" stroke="#475569" strokeWidth="1" />
        <line x1="100" y1="20" x2="100" y2="150" stroke="#475569" strokeWidth="1" />
        <line x1="20" y1="40" x2="180" y2="120" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="130" x2="180" y2="50" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="80" r="6" fill="#fde047" stroke="#facc15" strokeWidth="2" />
        <text x="108" y="74" fill="#fde047" fontSize="11" fontWeight="bold">SOLUSI</text>
        <text x="50" y="35" fill="#22d3ee" fontSize="10" fontWeight="bold">x + y = 5</text>
        <text x="125" y="60" fill="#f472b6" fontSize="10" fontWeight="bold">x − y = 1</text>
      </svg>
    ),
    text:
      "Setiap persamaan linear dua variabel digambar sebagai sebuah GARIS lurus pada bidang Cartesius. Jika kamu punya DUA persamaan, kamu punya DUA garis. Titik tempat keduanya berpotongan = solusi sistem. Inilah ide METODE GRAFIK!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Persamaan 2x + 3y = 12 mempunyai dua variabel, yaitu …",
    kind: "choice",
    options: ["x dan y", "2 dan 3", "3 dan 12", "x, y, 2"],
    correctIndex: 0,
    discussion: [
      "Variabel adalah huruf yang nilainya BELUM diketahui.",
      "Pada 2x + 3y = 12, huruf yang tidak diketahui adalah x dan y.",
      "Angka 2 dan 3 disebut KOEFISIEN, dan 12 disebut KONSTANTA.",
    ],
  },
  {
    id: "g2",
    label:
      "Persamaan Linear Dua Variabel (PLDV) selalu berbentuk umum …",
    kind: "fill",
    answers: ["ax+by=c", "ax + by = c", "ax+by = c"],
    discussion: [
      "Bentuk umum PLDV adalah ax + by = c.",
      "Dengan a, b, c bilangan real, dan a tidak nol DAN b tidak nol.",
      "Pangkat dari x dan y harus 1 (linear).",
    ],
  },
  {
    id: "g3",
    label:
      "Manakah yang BUKAN PLDV?",
    kind: "choice",
    options: ["3x + 2y = 7", "x + y = 0", "x² + y = 5", "5x − y = 1"],
    correctIndex: 2,
    discussion: [
      "PLDV harus berpangkat 1 (linear).",
      "x² + y = 5 mengandung x² (pangkat 2), jadi BUKAN linear.",
      "Pilihan lain semuanya berbentuk ax + by = c.",
    ],
  },
  {
    id: "g4",
    label:
      "Sistem Persamaan Linear Dua Variabel (SPLDV) terdiri dari … PLDV.",
    kind: "choice",
    options: ["satu", "dua atau lebih", "tiga", "empat"],
    correctIndex: 1,
    discussion: [
      "Kata 'sistem' berarti kumpulan dua atau lebih persamaan.",
      "SPLDV = dua atau lebih PLDV yang variabelnya SAMA dan harus terpenuhi semuanya.",
      "Di Kelas 8, biasanya kita kerjakan tepat dua persamaan.",
    ],
  },
  {
    id: "g5",
    label:
      "Periksa: apakah pasangan x = 2, y = 3 merupakan solusi dari x + y = 5?",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Substitusi: 2 + 3 = 5. ✔ Sama dengan ruas kanan.",
      "Jadi (2, 3) adalah penyelesaian dari x + y = 5.",
    ],
  },
  {
    id: "g6",
    label:
      "Apakah pasangan x = 2, y = 3 juga merupakan solusi dari x − y = 1?",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Substitusi: 2 − 3 = −1, padahal ruas kanan = 1.",
      "Karena hasilnya BERBEDA, (2, 3) BUKAN solusi dari x − y = 1.",
    ],
  },
  {
    id: "g7",
    label:
      "Solusi sebuah SPLDV adalah pasangan (x, y) yang …",
    kind: "choice",
    options: [
      "memenuhi salah satu persamaan saja",
      "memenuhi KEDUA persamaan sekaligus",
      "membuat ruas kiri lebih besar dari ruas kanan",
      "membuat semua variabel bernilai nol",
    ],
    correctIndex: 1,
    discussion: [
      "Solusi sistem harus memenuhi SEMUA persamaan dalam sistem.",
      "Inilah kenapa pada metode grafik kita cari TITIK POTONG dua garis.",
    ],
  },
  {
    id: "g8",
    label:
      "Pada metode GRAFIK, solusi SPLDV adalah …",
    kind: "choice",
    options: [
      "titik potong dua garis dengan sumbu X",
      "titik potong dua garis pada bidang Cartesius",
      "titik tengah dua garis",
      "titik perpotongan garis dengan sumbu Y",
    ],
    correctIndex: 1,
    discussion: [
      "Tiap PLDV digambar sebagai garis.",
      "Solusi sistem = titik di mana KEDUA garis berpotongan.",
      "Caranya: cari 2 titik tiap garis (biasanya titik potong sumbu X dan Y), gambar, lalu lihat perpotongannya.",
    ],
  },
  {
    id: "g9",
    label:
      "Urutkan langkah METODE SUBSTITUSI dari yang pertama sampai terakhir.",
    kind: "sort",
    items: [
      "Pilih salah satu persamaan, ubah ke bentuk x = ... atau y = ...",
      "Substitusikan ke persamaan yang lain.",
      "Selesaikan persamaan satu variabel yang dihasilkan.",
      "Substitusikan kembali untuk mendapatkan variabel kedua.",
    ],
    correctOrder: [
      "Pilih salah satu persamaan, ubah ke bentuk x = ... atau y = ...",
      "Substitusikan ke persamaan yang lain.",
      "Selesaikan persamaan satu variabel yang dihasilkan.",
      "Substitusikan kembali untuk mendapatkan variabel kedua.",
    ],
    discussion: [
      "Kata 'substitusi' artinya MENGGANTI.",
      "Kita ubah dulu salah satu persamaan agar 1 variabel berdiri sendiri.",
      "Lalu masukkan (substitusi) ke persamaan lain agar tinggal 1 variabel.",
      "Setelah ketemu satu nilai, substitusi balik untuk mencari yang lain.",
    ],
  },
  {
    id: "g10",
    label:
      "Pada SPLDV: x + y = 5 dan x − y = 1, jika kita JUMLAHKAN kedua persamaan ruas demi ruas, variabel y akan …",
    kind: "choice",
    options: ["bertambah", "tetap", "menjadi nol (hilang)", "menjadi 2y"],
    correctIndex: 2,
    discussion: [
      "(x + y) + (x − y) = 5 + 1.",
      "Ruas kiri: x + x + y − y = 2x + 0 = 2x.",
      "Variabel y HILANG karena +y dan −y saling meniadakan.",
      "Inilah ide METODE ELIMINASI: hilangkan dulu salah satu variabel.",
    ],
  },
  {
    id: "g11",
    label:
      "Lanjutan soal di atas: dari 2x = 6, maka nilai x = …",
    kind: "fill",
    answers: ["3"],
    discussion: [
      "2x = 6 → x = 6 ÷ 2 = 3.",
      "Selanjutnya substitusi x = 3 ke persamaan x + y = 5 → 3 + y = 5 → y = 2.",
      "Jadi solusinya (3, 2). Inilah METODE CAMPURAN (eliminasi + substitusi).",
    ],
  },
  {
    id: "g12",
    label:
      "Untuk MENGHILANGKAN variabel pada metode eliminasi, koefisien variabel itu di kedua persamaan harus …",
    kind: "choice",
    options: [
      "berbeda jauh nilainya",
      "SAMA besar (atau sama tapi berlawanan tanda)",
      "lebih besar dari ruas kanan",
      "berupa pecahan",
    ],
    correctIndex: 1,
    discussion: [
      "Agar bisa hilang dengan dijumlahkan/dikurangkan, koefisiennya harus SAMA.",
      "Kalau belum sama, kalikan persamaan dengan bilangan tertentu agar koefisiennya jadi sama.",
      "Tanda sama → KURANGKAN. Tanda berlawanan → JUMLAHKAN.",
    ],
  },
  {
    id: "g13",
    label:
      "Pada SPLDV: 2x + y = 8 dan x + y = 5, agar y dapat dihilangkan, kedua persamaan sebaiknya …",
    kind: "choice",
    options: [
      "DIJUMLAHKAN",
      "DIKURANGKAN (karena koefisien y sudah sama)",
      "DIKALIKAN dulu agar koefisien y berbeda",
      "DIBAGI dengan 2",
    ],
    correctIndex: 1,
    discussion: [
      "Koefisien y di kedua persamaan SUDAH SAMA = 1 (tanda sama positif).",
      "(2x + y) − (x + y) = 8 − 5 → x = 3.",
      "Karena tanda sama → KURANGKAN.",
    ],
  },
  {
    id: "g14",
    label:
      "Pasangkan setiap METODE dengan ide kuncinya.",
    kind: "match",
    pairs: [
      { left: "Metode Grafik", right: "Cari titik potong dua garis" },
      { left: "Metode Substitusi", right: "Ganti satu variabel dengan ekspresi variabel lain" },
      { left: "Metode Eliminasi", right: "Hilangkan satu variabel dengan +/−" },
      { left: "Metode Campuran", right: "Eliminasi dulu, lalu substitusi" },
    ],
    discussion: [
      "Grafik: visual, gambar dua garis lalu lihat perpotongannya.",
      "Substitusi: ganti, biasanya cocok jika satu persamaan mudah diubah jadi bentuk x=... atau y=...",
      "Eliminasi: hilangkan, cocok jika koefisien sudah/mudah disamakan.",
      "Campuran: eliminasi untuk dapat satu variabel, lalu substitusi untuk variabel sisanya.",
    ],
  },
  {
    id: "g15",
    label:
      "Kembali ke kasus belanja: 'cokelat' dimisalkan x dan 'biskuit' dimisalkan y. Model matematika dari belanja Sasha (3 cokelat + 2 biskuit = 13.000) adalah …",
    kind: "fill",
    answers: ["3x+2y=13000", "3x + 2y = 13000", "3x+2y = 13000"],
    discussion: [
      "Misal x = harga 1 cokelat, y = harga 1 biskuit.",
      "3 cokelat → 3x. 2 biskuit → 2y. Total Rp 13.000.",
      "Persamaan Sasha: 3x + 2y = 13.000.",
      "Persamaan Bayu: 2x + 4y = 14.000.",
      "Selesaikan dengan metode pilihanmu untuk menemukan x dan y!",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "📐 Bentuk Umum",
    text: "PLDV: ax + by = c, dengan a, b, c bilangan real (a ≠ 0, b ≠ 0). SPLDV: dua atau lebih PLDV dengan variabel sama yang harus terpenuhi bersamaan.",
    tone: "cyan",
  },
  {
    title: "🎯 Solusi SPLDV",
    text: "Pasangan (x, y) yang membuat KEDUA persamaan benar bersamaan. Pada grafik = TITIK POTONG dua garis.",
    tone: "violet",
  },
  {
    title: "🛠️ Empat Metode",
    text: "1) GRAFIK — gambar lalu cari titik potong. 2) SUBSTITUSI — ganti variabel. 3) ELIMINASI — hilangkan variabel. 4) CAMPURAN — eliminasi + substitusi.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-method",
    title: "🎯 Game 1 — Pilih Metode Paling Tepat",
    description:
      "Setiap SPLDV punya metode favoritnya. Tarik tiap kartu sistem ke metode paling efisien untuk menyelesaikannya.",
    buckets: [
      { id: "elim", label: "ELIMINASI (koefisien sudah sama)", emoji: "➖", color: "cyan" },
      { id: "sub", label: "SUBSTITUSI (sudah ada y=...)", emoji: "🔄", color: "violet" },
      { id: "camp", label: "CAMPURAN (perlu kalikan dulu)", emoji: "🔀", color: "amber" },
    ],
    items: [
      { id: "m1", label: "x + y = 7 dan x − y = 3", bucketId: "elim", emoji: "📘" },
      { id: "m2", label: "2x + y = 9 dan 2x − y = 5", bucketId: "elim", emoji: "📗" },
      { id: "m3", label: "y = 2x + 1 dan x + y = 7", bucketId: "sub", emoji: "📙" },
      { id: "m4", label: "x = 3 − y dan 2x + y = 5", bucketId: "sub", emoji: "📕" },
      { id: "m5", label: "3x + 2y = 12 dan 5x − 4y = 2", bucketId: "camp", emoji: "📓" },
      { id: "m6", label: "2x + 3y = 13 dan 4x + 5y = 23", bucketId: "camp", emoji: "📔" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-solusi",
    title: "🎯 Game 2 — Jodohkan Sistem dengan Solusinya",
    description:
      "Setiap sistem punya solusi (x, y). Tekan tombol panah ◀ ▶ untuk memilih solusi yang benar bagi tiap sistem, lalu cek hasilnya.",
    rightOptions: ["(1, 2)", "(2, 3)", "(3, 2)", "(4, 1)", "(5, 0)"],
    pairs: [
      { id: "j1", left: "x + y = 5 dan x − y = 1", correctRight: "(3, 2)", emoji: "🧩" },
      { id: "j2", left: "x + y = 3 dan 2x − y = 0", correctRight: "(1, 2)", emoji: "🧩" },
      { id: "j3", left: "x + y = 5 dan x − 2y = −4", correctRight: "(2, 3)", emoji: "🧩" },
      { id: "j4", left: "x + y = 5 dan 2x + y = 9", correctRight: "(4, 1)", emoji: "🧩" },
      { id: "j5", left: "x + y = 5 dan x − y = 5", correctRight: "(5, 0)", emoji: "🧩" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Manakah pasangan (x, y) berikut yang merupakan SOLUSI dari sistem: x + y = 6 dan x − y = 2?",
    kind: "choice",
    options: ["(2, 4)", "(3, 3)", "(4, 2)", "(5, 1)"],
    correctIndex: 2,
    hint: "Substitusikan setiap pilihan ke KEDUA persamaan. Solusi harus benar di keduanya.",
    discussion: [
      "Cek (4, 2): 4 + 2 = 6 ✔ dan 4 − 2 = 2 ✔.",
      "Karena memenuhi keduanya, (4, 2) adalah solusi sistem.",
    ],
  },
  {
    id: "p2",
    question:
      "Selesaikan dengan METODE ELIMINASI: x + y = 8 dan x − y = 2. Nilai x = …",
    kind: "fill",
    answers: ["5"],
    hint: "Jumlahkan kedua persamaan untuk menghilangkan y.",
    discussion: [
      "(x + y) + (x − y) = 8 + 2 → 2x = 10 → x = 5.",
      "(Selanjutnya substitusi: 5 + y = 8 → y = 3.)",
    ],
  },
  {
    id: "p3",
    question:
      "Lanjutan soal sebelumnya, nilai y = …",
    kind: "fill",
    answers: ["3"],
    hint: "Substitusikan x = 5 ke salah satu persamaan asli.",
    discussion: [
      "Substitusi x = 5 ke x + y = 8 → 5 + y = 8 → y = 3.",
      "Jadi solusinya (5, 3).",
    ],
  },
  {
    id: "p4",
    question:
      "Selesaikan dengan METODE SUBSTITUSI: y = x + 1 dan 2x + y = 7. Nilai x = …",
    kind: "fill",
    answers: ["2"],
    hint: "Substitusikan y = x + 1 ke persamaan kedua.",
    discussion: [
      "Substitusi y = x + 1 ke 2x + y = 7 → 2x + (x + 1) = 7 → 3x + 1 = 7 → 3x = 6 → x = 2.",
      "Lalu y = 2 + 1 = 3. Jadi solusinya (2, 3).",
    ],
  },
  {
    id: "p5",
    question:
      "Pernyataan: 'Sebuah SPLDV selalu memiliki tepat satu solusi.' Apakah benar?",
    kind: "truefalse",
    correct: false,
    hint: "Pikirkan dua garis yang sejajar atau dua garis yang berhimpit.",
    discussion: [
      "SPLDV bisa punya 3 kemungkinan: tepat 1 solusi (dua garis berpotongan), TIDAK ada solusi (dua garis sejajar), atau TAK HINGGA solusi (dua garis berhimpit).",
      "Jadi pernyataan tersebut SALAH.",
    ],
  },
  {
    id: "p6",
    question:
      "Pasangkan setiap sistem dengan jenis solusinya berdasarkan posisi kedua garisnya.",
    kind: "match",
    pairs: [
      { left: "Dua garis berpotongan", right: "Tepat 1 solusi" },
      { left: "Dua garis sejajar (berbeda)", right: "Tidak ada solusi" },
      { left: "Dua garis berhimpit", right: "Tak hingga solusi" },
    ],
    hint: "Lihat hubungan dua garis pada bidang Cartesius.",
    discussion: [
      "Berpotongan → bertemu di satu titik = 1 solusi.",
      "Sejajar berbeda → tidak pernah bertemu = TIDAK ADA solusi.",
      "Berhimpit (sama) → semua titik garis itu solusi = TAK HINGGA solusi.",
    ],
  },
  {
    id: "p7",
    question:
      "Harga 2 buku tulis dan 3 pensil = Rp 13.000. Harga 4 buku tulis dan 1 pensil = Rp 16.000. Misal x = harga buku tulis, y = harga pensil. Model matematikanya adalah …",
    kind: "choice",
    options: [
      "2x + 3y = 13000 dan 4x + y = 16000",
      "3x + 2y = 13000 dan x + 4y = 16000",
      "2x + 3y = 16000 dan 4x + y = 13000",
      "x + y = 13000 dan x + y = 16000",
    ],
    correctIndex: 0,
    hint: "Tulis tiap kalimat menjadi 'banyak × harga = total'.",
    discussion: [
      "2 buku → 2x. 3 pensil → 3y. Total Rp 13.000 → 2x + 3y = 13.000.",
      "4 buku → 4x. 1 pensil → y. Total Rp 16.000 → 4x + y = 16.000.",
    ],
  },
  {
    id: "p8",
    question:
      "Selesaikan sistem soal sebelumnya. Harga 1 buku tulis (x) adalah Rp …",
    kind: "fill",
    answers: ["3500", "3.500", "3,500", "Rp3500", "Rp 3500"],
    suffix: "rupiah",
    discussion: [
      "Sistem: 2x + 3y = 13.000 dan 4x + y = 16.000.",
      "Eliminasi: kalikan persamaan ke-2 dengan 3 → 12x + 3y = 48.000.",
      "Kurangkan dengan persamaan ke-1: (12x + 3y) − (2x + 3y) = 48.000 − 13.000 → 10x = 35.000 → x = 3.500.",
      "Substitusi: 4(3.500) + y = 16.000 → y = 2.000.",
      "Jadi 1 buku = Rp 3.500 dan 1 pensil = Rp 2.000.",
    ],
  },
];

const SPLDVLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab 5"
    title="Sistem Persamaan Linear Dua Variabel — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo menemukan sendiri rahasia SPLDV! Kamu akan belajar definisi PLDV & SPLDV, mengenal solusi, dan empat metode penyelesaian — sambil bermain dengan grafik interaktif yang bisa kamu seret untuk menemukan titik potong dua garis."
    situations={situations}
    guidedIntro="Kerjakan soal-soal berikut secara berurutan. Setiap jawabanmu akan menuntun pada konsep SPLDV. Tekan 'Periksa Jawaban' di bawah untuk melihat pembahasan lengkap."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="mb-6 rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-500/10 p-5 md:p-7 backdrop-blur">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/15 px-4 py-2 text-xs font-bold text-cyan-100">
            🎮 LABORATORIUM SPLDV INTERAKTIF
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-3">
            B. Eksplorasi Metode Grafik
          </h2>
          <p className="text-sm text-white/70 font-body mt-2 max-w-2xl mx-auto">
            Pilih salah satu sistem persamaan, lalu SERET titik putih ke perpotongan dua garis berwarna.
            Panel di kanan akan menunjukkan apakah titikmu memenuhi setiap persamaan. Solusi ditemukan saat
            titik tepat di perpotongan dan KEDUA persamaan terpenuhi (✓).
          </p>
        </div>
        <SPLDVGraphInteractive />
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs font-body">
          <div className="rounded-xl border border-cyan-200/20 bg-cyan-500/10 p-3 text-white/80">
            <p className="font-bold text-cyan-200 mb-1">🔍 Coba ini #1</p>
            <p>Pilih Sistem 1 lalu seret titik ke (3, 2). Kedua persamaan terpenuhi → itu solusinya!</p>
          </div>
          <div className="rounded-xl border border-violet-200/20 bg-violet-500/10 p-3 text-white/80">
            <p className="font-bold text-violet-200 mb-1">🔍 Coba ini #2</p>
            <p>Sistem 2: bandingkan koefisien y. Sama-sama 1 → cocok dieliminasi dengan dikurangkan.</p>
          </div>
          <div className="rounded-xl border border-emerald-200/20 bg-emerald-500/10 p-3 text-white/80">
            <p className="font-bold text-emerald-200 mb-1">🔍 Coba ini #3</p>
            <p>Sistem 3: lebih sulit secara grafik. Coba selesaikan dengan eliminasi → solusinya (2, 3).</p>
          </div>
        </div>
      </section>
    }
    games={games}
    practiceIntro="Sekarang giliranmu menerapkan apa yang sudah kamu temukan. Kerjakan dengan teliti — kembali ke grafik interaktif di atas bila ingin mengeceknya secara visual."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/spldv"
    backLabel="Kembali ke menu SPLDV"
    scoreMessages={{
      perfect: "Mantap, Sobat Numatik! Pemahaman SPLDV-mu sudah luar biasa.",
      high: "Bagus sekali! Periksa kembali bagian yang masih merah agar lebih mantap.",
      medium: "Sudah mulai paham. Ulangi penemuan terbimbing dan main lagi grafik interaktifnya.",
      low: "Tetap semangat! Mulai dari atas, perhatikan definisi PLDV dan langkah tiap metode.",
    }}
  />
);

export default SPLDVLKPDPage;
