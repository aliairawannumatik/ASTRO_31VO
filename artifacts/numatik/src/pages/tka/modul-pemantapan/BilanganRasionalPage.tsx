import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  {
    heading: "A. Pengertian Bilangan Rasional",
    content: `Bilangan rasional adalah bilangan yang dapat dinyatakan dalam bentuk $\\dfrac{p}{q}$ di mana $p$ dan $q$ bilangan bulat dan $q \\neq 0$.\n\nContoh: $\\frac{1}{2}$, $\\frac{-3}{4}$, $\\frac{5}{1} = 5$, $0{,}75 = \\frac{3}{4}$, $1{,}\\overline{3} = \\frac{4}{3}$`,
  },
  {
    heading: "B. Operasi Pecahan",
    content: `1. Penjumlahan/Pengurangan:\n$\\dfrac{a}{b} \\pm \\dfrac{c}{d} = \\dfrac{ad \\pm bc}{bd}$\n(samakan penyebut terlebih dahulu)\n\n2. Perkalian:\n$\\dfrac{a}{b} \\times \\dfrac{c}{d} = \\dfrac{ac}{bd}$\n\n3. Pembagian:\n$\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c} = \\dfrac{ad}{bc}$`,
  },
  {
    heading: "C. Bentuk Pecahan",
    content: `1. Pecahan biasa: $\\dfrac{p}{q}$\n\n2. Pecahan campuran: $a\\dfrac{p}{q} = a + \\dfrac{p}{q}$\n\n3. Desimal:\n   - Desimal berhingga: $\\dfrac{3}{4} = 0{,}75$\n   - Desimal tak berhingga berulang: $\\dfrac{1}{3} = 0{,}333...$\n\n4. Persen: $p\\% = \\dfrac{p}{100}$`,
  },
  {
    heading: "D. Membandingkan Bilangan Rasional",
    content: `Untuk membandingkan $\\dfrac{a}{b}$ dan $\\dfrac{c}{d}$, samakan penyebutnya terlebih dahulu.\n\nAlternatif: kalikan silang:\n$\\dfrac{a}{b} < \\dfrac{c}{d}$ jika $ad < bc$ (untuk $b, d > 0$)\n\nContoh: Urutkan $0{,}6;\\; 55\\%;\\; \\frac{2}{3}$ dari terkecil ke terbesar.\nUbah ke desimal: $0{,}600 > 0{,}550$ dan $\\frac{2}{3} \\approx 0{,}667$\nUrutan: $55\\% < 0{,}6 < \\frac{2}{3}$`,
  },
  {
    heading: "E. Bilangan Rasional pada Garis Bilangan",
    content: `Setiap bilangan rasional dapat diletakkan pada garis bilangan. Semakin ke kanan, semakin besar nilainya.\n\nUrutan bilangan rasional:\n$... < -1 < -\\dfrac{1}{2} < 0 < \\dfrac{1}{3} < \\dfrac{1}{2} < 1 < ...$`,
  },
  {
    heading: "F. Menentukan Penyelesaian yang Berkaitan dengan Bilangan Rasional",
    content: `Langkah-langkah menyelesaikan soal yang berkaitan dengan bilangan rasional:\n\n1. Baca soal dengan cermat dan identifikasi semua data bilangan rasional yang diketahui.\n2. Ubah semua bilangan ke bentuk yang seragam (pecahan biasa, desimal, atau persen) agar mudah dioprasikan.\n3. Tentukan operasi yang diperlukan (penjumlahan, pengurangan, perkalian, atau pembagian).\n4. Lakukan operasi sesuai aturan, kemudian sederhanakan hasilnya.\n5. Nyatakan jawaban dalam satuan atau bentuk yang diminta soal.\n\nContoh:\nSebuah tali panjang $3\\frac{1}{4}$ m. Dipotong $\\frac{2}{5}$ bagiannya. Sisa tali = ?\n$3\\frac{1}{4} \\times \\left(1 - \\frac{2}{5}\\right) = \\frac{13}{4} \\times \\frac{3}{5} = \\frac{39}{20} = 1\\frac{19}{20}$ m`,
  },
  {
    heading: "G. Estimasi/Pembulatan Bilangan Rasional",
    content: `Estimasi adalah menaksir nilai suatu bilangan rasional ke nilai terdekat tertentu, untuk mempermudah perhitungan.\n\nCara membulatkan:\n1. Bulatkan ke satuan terdekat: perhatikan angka persepuluhan.\n   - Jika angka persepuluhan $\\geq 5$, bulatkan ke atas.\n   - Jika angka persepuluhan $< 5$, bulatkan ke bawah.\n2. Estimasi persen: misalnya $\\frac{1}{3} \\approx 33\\%$ (bukan 33,3% — sudah cukup dekat).\n3. Estimasi pecahan: $\\frac{7}{8} \\approx 1$, $\\frac{1}{9} \\approx 0$.\n\nContoh:\n$38\\% \\times 520 \\approx 40\\% \\times 500 = \\frac{40}{100} \\times 500 = 200$\nHarga Rp29.750 → dibulatkan menjadi Rp30.000 untuk kemudahan estimasi belanja.`,
  },
];

const contohSoal: LatihanSoal[] = [
  // ─── CONTOH 1 · PG ─────────────────────────────────────────────────────────
  {
    no: 101,
    type: "pg",
    soal: "Diketahui empat bilangan $\\dfrac{3}{4};\\; 0{,}6;\\; 45\\%;\\; \\dfrac{4}{5}$. Urutan bilangan tersebut dari yang terkecil ke terbesar adalah ....",
    options: [
      "A. $\\dfrac{3}{4};\\; 0{,}6;\\; 45\\%;\\; \\dfrac{4}{5}$",
      "B. $45\\%;\\; \\dfrac{3}{4};\\; 0{,}6;\\; \\dfrac{4}{5}$",
      "C. $45\\%;\\; 0{,}6;\\; \\dfrac{4}{5};\\; \\dfrac{3}{4}$",
      "D. $45\\%;\\; 0{,}6;\\; \\dfrac{3}{4};\\; \\dfrac{4}{5}$",
    ],
    jawaban: "D",
    pembahasan: `Ubah semua bilangan ke pecahan dengan penyebut yang sama (penyebut 20):
$0{,}6 = \\dfrac{6}{10} = \\dfrac{12}{20}$
$45\\% = \\dfrac{45}{100} = \\dfrac{9}{20}$
$\\dfrac{3}{4} = \\dfrac{15}{20}$
$\\dfrac{4}{5} = \\dfrac{16}{20}$

Urutan dari terkecil: $\\dfrac{9}{20} < \\dfrac{12}{20} < \\dfrac{15}{20} < \\dfrac{16}{20}$

Jadi, urutan dari terkecil ke terbesar: $45\\% < 0{,}6 < \\dfrac{3}{4} < \\dfrac{4}{5}$.
Jawaban: D`,
  },

  // ─── CONTOH 2 · PG (estimasi/konteks belanja) ──────────────────────────────
  {
    no: 102,
    type: "pg",
    soal: "Dodi akan membeli susu dan biskuit di minimarket. Kebetulan sedang ada promo akhir bulan dengan diskon 15% untuk semua produk. Harga sebelum diskon: 1 liter susu Rp35.000 dan 1 kotak biskuit Rp28.000. Jika Dodi membeli 2 liter susu dan 3 kotak biskuit, estimasi harga yang harus dibayar adalah ....",
    options: [
      "A. Rp98.000",
      "B. Rp114.000",
      "C. Rp132.000",
      "D. Rp148.000",
    ],
    jawaban: "C",
    pembahasan: `Harga 1 liter susu setelah diskon 15%:
$= \\text{Rp}35.000 - (15\\% \\times \\text{Rp}35.000)$
$= \\text{Rp}35.000 - \\text{Rp}5.250 = \\text{Rp}29.750$
Dibulatkan → estimasi $\\text{Rp}30.000$.

Harga 1 kotak biskuit setelah diskon 15%:
$= \\text{Rp}28.000 - (15\\% \\times \\text{Rp}28.000)$
$= \\text{Rp}28.000 - \\text{Rp}4.200 = \\text{Rp}23.800$
Dibulatkan → estimasi $\\text{Rp}24.000$.

Total 2 liter susu + 3 kotak biskuit:
$= 2(\\text{Rp}30.000) + 3(\\text{Rp}24.000)$
$= \\text{Rp}60.000 + \\text{Rp}72.000 = \\text{Rp}132.000$
Jawaban: C`,
  },

  // ─── CONTOH 3 · PGK (konteks lahan kebun buah) ─────────────────────────────
  {
    no: 103,
    type: "pgk",
    soal: `Perhatikan bacaan berikut untuk menjawab soal nomor 3 dan 4.

Kebun Buah Pak Eko
Pak Eko memiliki sebidang lahan untuk berkebun. Diketahui $\\dfrac{3}{8}$ bagian lahan ditanami mangga, $\\dfrac{1}{4}$ bagian ditanami rambutan, $\\dfrac{1}{5}$ bagian ditanami durian, dan sisanya ditanami pepaya. Luas lahan yang ditanami pepaya adalah $42\\text{ m}^2$. Pak Eko menjual hasil panen berdasarkan luas lahan. Harga jual per meter persegi: mangga Rp8.000, rambutan Rp15.000, durian Rp20.000, dan pepaya Rp5.000.

Berdasarkan bacaan tersebut, pilihlah semua jawaban yang benar. Jawaban benar lebih dari satu.`,
    pernyataan: [
      "Luas lahan yang ditanami mangga adalah $90\\text{ m}^2$.",
      "Luas seluruh lahan Pak Eko adalah $300\\text{ m}^2$.",
      "Luas lahan yang ditanami rambutan adalah $60\\text{ m}^2$.",
      "Luas lahan yang ditanami durian adalah $48\\text{ m}^2$.",
    ],
    options: [
      "(1) dan (2)",
      "(1) dan (3)",
      "(2) dan (4)",
      "(1), (3), dan (4)",
    ],
    jawaban: "D",
    pembahasan: `Tentukan bagian lahan pepaya terlebih dahulu:
$= 1 - \\dfrac{3}{8} - \\dfrac{1}{4} - \\dfrac{1}{5}$
$= \\dfrac{40}{40} - \\dfrac{15}{40} - \\dfrac{10}{40} - \\dfrac{8}{40} = \\dfrac{7}{40}$ bagian

$\\dfrac{7}{40}$ bagian $= 42\\text{ m}^2$, sehingga luas seluruh lahan $= 42 \\times \\dfrac{40}{7} = 240\\text{ m}^2$.

Pernyataan (1): Mangga $= \\dfrac{3}{8} \\times 240 = 90\\text{ m}^2$ ✓ BENAR
Pernyataan (2): Luas seluruh lahan $240\\text{ m}^2 \\neq 300\\text{ m}^2$ ✗ SALAH
Pernyataan (3): Rambutan $= \\dfrac{1}{4} \\times 240 = 60\\text{ m}^2$ ✓ BENAR
Pernyataan (4): Durian $= \\dfrac{1}{5} \\times 240 = 48\\text{ m}^2$ ✓ BENAR

Jawaban: D — Pernyataan (1), (3), dan (4) benar.`,
  },

  // ─── CONTOH 4 · PGKBS (masih konteks kebun Pak Eko) ───────────────────────
  {
    no: 104,
    type: "pgkbs",
    soal: `Berdasarkan bacaan Kebun Buah Pak Eko (soal nomor 3), tentukan Benar atau Salah untuk setiap pernyataan berikut.`,
    pernyataan: [
      "Hasil penjualan durian merupakan yang terbesar di antara keempat komoditas.",
      "Hasil penjualan mangga lebih besar daripada hasil penjualan rambutan.",
      "Hasil penjualan pepaya lebih kecil daripada hasil penjualan mangga.",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan: `Hitung hasil penjualan masing-masing komoditas:
Mangga: $90 \\times \\text{Rp}8.000 = \\text{Rp}720.000$
Rambutan: $60 \\times \\text{Rp}15.000 = \\text{Rp}900.000$
Durian: $48 \\times \\text{Rp}20.000 = \\text{Rp}960.000$
Pepaya: $42 \\times \\text{Rp}5.000 = \\text{Rp}210.000$

Pernyataan (1): Durian = Rp960.000 (tertinggi) ✓ BENAR
Pernyataan (2): Mangga (Rp720.000) < Rambutan (Rp900.000), jadi mangga TIDAK lebih besar ✗ SALAH
Pernyataan (3): Pepaya (Rp210.000) < Mangga (Rp720.000) ✓ BENAR`,
  },

  // ─── CONTOH 5 · PG (operasi campuran pecahan) ──────────────────────────────
  {
    no: 105,
    type: "pg",
    soal: "Hasil dari $\\dfrac{3}{5} \\times \\dfrac{10}{9} - \\left(\\dfrac{5}{6} - \\dfrac{1}{4}\\right)$ adalah ....",
    options: [
      "A. $-\\dfrac{5}{12}$",
      "B. $-\\dfrac{1}{12}$",
      "C. $\\dfrac{1}{12}$",
      "D. $\\dfrac{2}{3}$",
    ],
    jawaban: "C",
    pembahasan: `Ikuti aturan urutan operasi: kerjakan perkalian dan operasi dalam kurung terlebih dahulu.

$\\dfrac{3}{5} \\times \\dfrac{10}{9} - \\left(\\dfrac{5}{6} - \\dfrac{1}{4}\\right)$
$= \\dfrac{3 \\times 10}{5 \\times 9} - \\left(\\dfrac{10}{12} - \\dfrac{3}{12}\\right)$
$= \\dfrac{30}{45} - \\dfrac{7}{12}$
$= \\dfrac{2}{3} - \\dfrac{7}{12}$
$= \\dfrac{8}{12} - \\dfrac{7}{12}$
$= \\dfrac{1}{12}$

Jawaban: C`,
  },
];

const latihanDasar: LatihanSoal[] = [
  // ─── 1 · PG ───────────────────────────────────────────────────────────────
  {
    no: 1,
    type: "pg",
    soal: "Hasil dari $1\\frac{1}{2} + 2\\frac{2}{3} \\times 1\\frac{2}{5}$ adalah ...",
    options: [
      "$3\\frac{1}{2}$",
      "$5\\frac{7}{30}$",
      "$4\\frac{13}{15}$",
      "$6\\frac{1}{5}$",
    ],
    jawaban: "B",
    pembahasan:
      "Perkalian dikerjakan lebih dulu (bukan penjumlahan):\n" +
      "$2\\frac{2}{3} \\times 1\\frac{2}{5} = \\frac{8}{3} \\times \\frac{7}{5} = \\frac{56}{15}$\n\n" +
      "Kemudian penjumlahan:\n" +
      "$1\\frac{1}{2} + \\frac{56}{15} = \\frac{3}{2} + \\frac{56}{15} = \\frac{45}{30} + \\frac{112}{30} = \\frac{157}{30} = 5\\frac{7}{30}$",
  },

  // ─── 2 · PGK ──────────────────────────────────────────────────────────────

  // ─── 3 · PGKBS ────────────────────────────────────────────────────────────

  // ─── 4 · PG ───────────────────────────────────────────────────────────────
  {
    no: 2,
    type: "pg",
    soal: "Urutan bilangan dari terkecil ke terbesar dari $0,6$ ; $55\\%$ ; $\\dfrac{2}{3}$ ; $0,54$ adalah ...",
    options: [
      "$55\\%$ ; $0,54$ ; $0,6$ ; $\\frac{2}{3}$",
      "$0,54$ ; $55\\%$ ; $0,6$ ; $\\frac{2}{3}$",
      "$\\frac{2}{3}$ ; $0,6$ ; $55\\%$ ; $0,54$",
      "$0,54$ ; $55\\%$ ; $\\frac{2}{3}$ ; $0,6$",
    ],
    jawaban: "B",
    pembahasan:
      "Ubah semua ke bentuk desimal:\n" +
      "$0,6=0{,}600$;  $55\\%=0{,}550$;  $\\frac{2}{3}\\approx0{,}667$;  $0,54=0{,}540$\n\n" +
      "Urutan terkecil ke terbesar: $0{,}540 < 0{,}550 < 0{,}600 < 0{,}667$\n" +
      "Jadi: $0,54 < 55\\% < 0,6 < \\frac{2}{3}$ → B",
  },

  // ─── 5 · PGK ──────────────────────────────────────────────────────────────
  {
    no: 3,
    type: "pgk",
    soal: "Perhatikan pernyataan-pernyataan berikut!",
    pernyataan: [
      "$0,45 < 78\\%$",
      "$78\\% < 0,85$",
      "$0,85 < \\dfrac{7}{8}$",
      "$\\dfrac{7}{8} > 0,9$",
    ],
    options: [
      "(1) dan (2)",
      "(2) dan (3)",
      "(1), (2), dan (3)",
      "(2), (3), dan (4)",
    ],
    jawaban: "C",
    pembahasan:
      "(1) $0,45 < 0,78$ ✓\n" +
      "(2) $0,78 < 0,85$ ✓\n" +
      "(3) $0,85 < \\frac{7}{8}=0,875$ ✓\n" +
      "(4) $\\frac{7}{8}=0,875 < 0,9$, jadi $\\frac{7}{8}>0,9$ adalah SALAH ✗\n\n" +
      "Pernyataan yang benar: (1), (2), dan (3) → C",
  },

  // ─── 6 · PGKBS ────────────────────────────────────────────────────────────

  // ─── 7 · PG ───────────────────────────────────────────────────────────────
  {
    no: 4,
    type: "pg",
    soal: "Hasil dari $\\dfrac{\\dfrac{2}{1} - \\dfrac{3}{4}}{\\dfrac{1}{1} + \\dfrac{4}{2}}$ adalah ...",
    options: [
      "$\\dfrac{5}{12}$",
      "$\\dfrac{7}{12}$",
      "$\\dfrac{5}{9}$",
      "$\\dfrac{9}{5}$",
    ],
    jawaban: "A",
    pembahasan:
      "Pembilang: $2 - \\frac{3}{4} = \\frac{8}{4} - \\frac{3}{4} = \\frac{5}{4}$\n" +
      "Penyebut: $1 + \\frac{4}{2} = 1 + 2 = 3$\n\n" +
      "Hasil: $\\dfrac{\\frac{5}{4}}{3} = \\frac{5}{4} \\times \\frac{1}{3} = \\frac{5}{12}$ → A",
  },

  // ─── 8 · PGK ──────────────────────────────────────────────────────────────
  {
    no: 5,
    type: "pgk",
    soal: "Pak Hari mempunyai sejumlah uang. Seperlimanya untuk membeli kaos, duapertiganya untuk membeli baju, dan sisanya Rp60.000,00 untuk membeli topi.\nPerhatikan pernyataan-pernyataan berikut!",
    pernyataan: [
      "Bagian uang untuk kaos dan baju adalah $\\dfrac{13}{15}$ dari total",
      "Sisa uang yang digunakan untuk topi adalah $\\dfrac{2}{15}$ dari total",
      "Total uang Pak Hari adalah Rp450.000,00",
      "Uang yang digunakan membeli kaos adalah Rp75.000,00",
    ],
    options: [
      "(1) dan (2)",
      "(2) dan (3)",
      "(1), (2), dan (3)",
      "(1), (2), (3), dan (4)",
    ],
    jawaban: "C",
    pembahasan:
      "(1) $\\frac{1}{5}+\\frac{2}{3}=\\frac{3}{15}+\\frac{10}{15}=\\frac{13}{15}$ ✓\n" +
      "(2) Sisa $=1-\\frac{13}{15}=\\frac{2}{15}$ ✓\n" +
      "(3) Total $=60.000\\div\\frac{2}{15}=60.000\\times\\frac{15}{2}=450.000$ ✓\n" +
      "(4) Kaos $=\\frac{1}{5}\\times450.000=90.000\\neq75.000$ ✗\n\n" +
      "Pernyataan yang benar: (1), (2), dan (3) → C",
  },

  // ─── 9 · PGKBS ────────────────────────────────────────────────────────────
  {
    no: 6,
    type: "pgkbs",
    soal: "Ibu membeli gula $6\\frac{2}{3}$ kg. Di rumah masih ada $10\\frac{5}{6}$ kg. Semua gula dimasukkan ke kantong plastik masing-masing $1\\frac{3}{4}$ kg.\nTentukan benar atau salah setiap pernyataan berikut!",
    pernyataan: [
      "Total gula yang tersedia adalah $17\\frac{1}{2}$ kg",
      "Dibutuhkan tepat 10 kantong plastik untuk semua gula",
      "Gula yang tersisa setelah 10 kantong penuh adalah $\\frac{1}{4}$ kg",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan:
      "(1) $6\\frac{2}{3}+10\\frac{5}{6}=\\frac{20}{3}+\\frac{65}{6}=\\frac{40}{6}+\\frac{65}{6}=\\frac{105}{6}=17\\frac{1}{2}$ kg ✓ BENAR\n" +
      "(2) $17\\frac{1}{2}\\div1\\frac{3}{4}=\\frac{35}{2}\\div\\frac{7}{4}=\\frac{35}{2}\\times\\frac{4}{7}=10$ tepat ✓ BENAR\n" +
      "(3) Karena habis tepat 10 kantong, sisa gula = 0 kg $\\neq\\frac{1}{4}$ kg ✗ SALAH",
  },

  // ─── 10 · PG ──────────────────────────────────────────────────────────────
  {
    no: 7,
    type: "pg",
    soal: "Pada kegiatan sosial diterima terigu sebanyak $21\\frac{3}{4}$ kg dan $23\\frac{1}{4}$ kg. Setiap warga menerima $2\\frac{1}{2}$ kg. Banyak warga yang menerima terigu tersebut adalah ...",
    options: ["21 orang", "20 orang", "18 orang", "15 orang"],
    jawaban: "C",
    pembahasan:
      "Total terigu:\n" +
      "$21\\frac{3}{4}+23\\frac{1}{4}=21+23+\\frac{3}{4}+\\frac{1}{4}=44+1=45$ kg\n\n" +
      "Banyak warga:\n" +
      "$45\\div2\\frac{1}{2}=45\\div\\frac{5}{2}=45\\times\\frac{2}{5}=18$ orang → C",
  },

  // ─── 11 · PGK ─────────────────────────────────────────────────────────────

  // ─── 12 · PGKBS ───────────────────────────────────────────────────────────

  // ─── 13 · PG ──────────────────────────────────────────────────────────────

  // ─── 14 · PGK ─────────────────────────────────────────────────────────────

  // ─── 15 · PGKBS ───────────────────────────────────────────────────────────

  // ─── 16 · PG ──────────────────────────────────────────────────────────────

  // ─── 17 · PGK ─────────────────────────────────────────────────────────────

  // ─── 18 · PGKBS ───────────────────────────────────────────────────────────

  // ─── 19 · PG ──────────────────────────────────────────────────────────────

  // ─── 20 · PG ──────────────────────────────────────────────────────────────
  {
    no: 8,
    type: "pg",
    soal: "Dina akan mengemas tepung beras ke dalam kantong plastik berukuran $\\dfrac{1}{2}\\text{ kg}$ dan $\\dfrac{1}{4}\\text{ kg}$. Berat tepung beras yang akan dikemas adalah $24{,}3\\text{ kg}$. Kemasan $\\dfrac{1}{2}\\text{ kg}$ akan digunakan terlebih dahulu. Berat sisa tepung beras yang tidak dapat dikemas sesuai ukuran kantong adalah ....",
    options: [
      "A. $\\dfrac{1}{20}\\text{ kg}$",
      "B. $\\dfrac{1}{10}\\text{ kg}$",
      "C. $\\dfrac{3}{20}\\text{ kg}$",
      "D. $\\dfrac{1}{5}\\text{ kg}$",
    ],
    jawaban: "A",
    pembahasan:
      "Gunakan kantong $\\frac{1}{2}$ kg terlebih dahulu:\n" +
      "$24{,}3 \\div \\frac{1}{2} = 48{,}6$ → 48 kantong penuh\n" +
      "Tepung terpakai: $48 \\times \\frac{1}{2} = 24\\text{ kg}$\n" +
      "Sisa: $24{,}3 - 24 = 0{,}3\\text{ kg}$\n\n" +
      "Gunakan kantong $\\frac{1}{4}$ kg:\n" +
      "$0{,}3 \\div \\frac{1}{4} = 1{,}2$ → hanya 1 kantong penuh\n" +
      "Tepung terpakai: $1 \\times \\frac{1}{4} = 0{,}25\\text{ kg}$\n" +
      "Sisa akhir: $0{,}3 - 0{,}25 = 0{,}05\\text{ kg} = \\dfrac{1}{20}\\text{ kg}$\n\n" +
      "Jawaban: A",
  },

  // ─── 21 · PGKBS ───────────────────────────────────────────────────────────
  {
    no: 9,
    type: "pgkbs",
    soal: "Diketahui sekarung kedelai dengan berat $36\\text{ kg}$. Kedelai tersebut akan dijual dalam kemasan plastik kecil. Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
    pernyataan: [
      "Jika terdapat 24 kemasan plastik, setiap kemasan berisi $1{,}5\\text{ kg}$ kedelai.",
      "Jika setiap kemasan berisi $5\\text{ kg}$ kedelai, sisa kedelai yang tidak dikemas adalah $2\\text{ kg}$.",
      "Jika setiap kemasan berisi $2\\dfrac{1}{4}\\text{ kg}$ kedelai, banyak kemasan plastik adalah 16 buah.",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan:
      "(1) $36 \\div 24 = 1{,}5\\text{ kg}$ per kemasan ✓ BENAR\n\n" +
      "(2) $36 \\div 5 = 7{,}2$ → 7 kemasan penuh → terpakai $7 \\times 5 = 35\\text{ kg}$\n" +
      "Sisa: $36 - 35 = 1\\text{ kg} \\neq 2\\text{ kg}$ ✗ SALAH\n\n" +
      "(3) $36 \\div 2\\frac{1}{4} = 36 \\div \\frac{9}{4} = 36 \\times \\frac{4}{9} = 16$ kemasan ✓ BENAR",
  },

  // ─── 22 · PG (estimasi) ────────────────────────────────────────────────────
  {
    no: 10,
    type: "pg",
    soal: "Diketahui operasi bilangan $4{,}2 \\times 19{,}7 + 13{,}81 - 32{,}47 = m$. Perkiraan hasil dari $(m - 20)$ adalah ....",
    options: ["A. 20", "B. 40", "C. 80", "D. 100"],
    jawaban: "B",
    pembahasan:
      "Gunakan pembulatan ke bilangan yang nyaman:\n" +
      "$4{,}2 \\approx 4,\\quad 19{,}7 \\approx 20,\\quad 13{,}81 \\approx 14,\\quad 32{,}47 \\approx 32$\n\n" +
      "$m \\approx 4 \\times 20 + 14 - 32 = 80 + 14 - 32 = 62$\n\n" +
      "$m - 20 \\approx 62 - 20 = 42 \\approx 40$\n\n" +
      "(Nilai sejati: $4{,}2 \\times 19{,}7 = 82{,}74$; $m = 82{,}74 + 13{,}81 - 32{,}47 = 64{,}08$; $m-20 = 44{,}08$)\n" +
      "Jawaban: B",
  },

  // ─── 23 · PG (urutan → kode) ───────────────────────────────────────────────
  {
    no: 11,
    type: "pg",
    soal: "Diketahui kode warna menggunakan huruf yang nilainya disusun dari terbesar ke terkecil. Huruf beserta nilainya: $B = \\dfrac{3}{5}$; $I = 0{,}48$; $R = \\dfrac{1}{3}$; $U = 7\\%$. Kode warna tersebut adalah ....",
    options: ["A. BIRU", "B. RUBI", "C. UBIR", "D. IURB"],
    jawaban: "A",
    pembahasan:
      "Ubah semua ke desimal:\n" +
      "$B = \\frac{3}{5} = 0{,}600$\n" +
      "$I = 0{,}480$\n" +
      "$R = \\frac{1}{3} \\approx 0{,}333$\n" +
      "$U = 7\\% = 0{,}070$\n\n" +
      "Urutan dari terbesar ke terkecil: $B > I > R > U$\n\n" +
      "Kode warna: **BIRU** → A",
  },

  // ─── 24 · PG ──────────────────────────────────────────────────────────────
  {
    no: 12,
    type: "pg",
    soal: "Hasil dari $\\dfrac{2}{5} \\times \\dfrac{5}{6} - \\dfrac{3}{4} \\div \\dfrac{9}{2}$ adalah ....",
    options: [
      "A. $-\\dfrac{1}{6}$",
      "B. $\\dfrac{1}{6}$",
      "C. $\\dfrac{1}{3}$",
      "D. $\\dfrac{5}{6}$",
    ],
    jawaban: "B",
    pembahasan:
      "Perkalian dan pembagian dikerjakan lebih dulu (kiri ke kanan):\n" +
      "$\\frac{2}{5} \\times \\frac{5}{6} = \\frac{10}{30} = \\frac{1}{3}$\n\n" +
      "$\\frac{3}{4} \\div \\frac{9}{2} = \\frac{3}{4} \\times \\frac{2}{9} = \\frac{6}{36} = \\frac{1}{6}$\n\n" +
      "Sekarang pengurangan:\n" +
      "$\\frac{1}{3} - \\frac{1}{6} = \\frac{2}{6} - \\frac{1}{6} = \\frac{1}{6}$\n\n" +
      "Jawaban: B",
  },

  // ─── 25 & 26 · Konteks Kaveling ────────────────────────────────────────────
  // ─── 25 · PGKBS ───────────────────────────────────────────────────────────
  {
    no: 13,
    type: "pgkbs",
    soal: `Perhatikan teks berikut untuk menjawab soal nomor 25 dan 26.

Tanah Kaveling
Seorang pengembang memiliki sebidang tanah berbentuk persegi panjang berukuran $80\\text{ m} \\times 40\\text{ m}$ yang dibagi menjadi kaveling rumah berukuran sama, masing-masing $8\\text{ m} \\times 4\\text{ m}$. Kaveling-kaveling tersebut diberi nomor urut 1, 2, 3, dan seterusnya hingga semuanya bernomor.

Berdasarkan teks tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut.`,
    pernyataan: [
      "Kaveling bernomor ganjil merupakan $\\dfrac{1}{2}$ bagian dari total kaveling.",
      "Kaveling bernomor prima merupakan $\\dfrac{1}{5}$ bagian dari total kaveling.",
      "Kaveling bernomor lebih dari 12 merupakan $\\dfrac{22}{25}$ bagian dari total kaveling.",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan:
      "Total kaveling: $\\dfrac{80 \\times 40}{8 \\times 4} = \\dfrac{3200}{32} = 100$ kaveling\n\n" +
      "(1) Ganjil: nomor 1, 3, 5, …, 99 → 50 kaveling = $\\dfrac{50}{100} = \\dfrac{1}{2}$ ✓ BENAR\n\n" +
      "(2) Bilangan prima ≤ 100: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 → 25 bilangan prima\n" +
      "$\\dfrac{25}{100} = \\dfrac{1}{4} \\neq \\dfrac{1}{5}$ ✗ SALAH\n\n" +
      "(3) Bernomor > 12 → kaveling 13 s.d. 100 = 88 kaveling = $\\dfrac{88}{100} = \\dfrac{22}{25}$ ✓ BENAR",
  },

  // ─── 26 · PGK ─────────────────────────────────────────────────────────────

  // ─── 27 · PGK ─────────────────────────────────────────────────────────────
  {
    no: 14,
    type: "pgk",
    soal: "Perhatikan perhitungan bilangan pecahan berikut.\n$P = \\dfrac{4}{7} \\div \\dfrac{8}{21}, \\quad Q = \\dfrac{3}{8} \\times \\dfrac{4}{15}, \\quad R = \\dfrac{7}{12} + \\dfrac{5}{6}, \\quad S = \\dfrac{11}{12} - \\dfrac{5}{6}$\nBerdasarkan informasi tersebut, pilihlah semua jawaban yang benar. Jawaban benar lebih dari satu.",
    pernyataan: [
      "Nilai $P = \\dfrac{2}{3}$",
      "Nilai $Q = \\dfrac{1}{10}$",
      "Nilai $R = \\dfrac{17}{12}$",
      "Nilai $S = \\dfrac{1}{6}$",
    ],
    options: [
      "(1) dan (2)",
      "(2) dan (3)",
      "(3) dan (4)",
      "(1), (2), dan (3)",
    ],
    jawaban: "B",
    pembahasan:
      "$P = \\dfrac{4}{7} \\div \\dfrac{8}{21} = \\dfrac{4}{7} \\times \\dfrac{21}{8} = \\dfrac{84}{56} = \\dfrac{3}{2}$; pernyataan $P=\\frac{2}{3}$ ✗ SALAH\n\n" +
      "$Q = \\dfrac{3}{8} \\times \\dfrac{4}{15} = \\dfrac{12}{120} = \\dfrac{1}{10}$ ✓ BENAR\n\n" +
      "$R = \\dfrac{7}{12} + \\dfrac{5}{6} = \\dfrac{7}{12} + \\dfrac{10}{12} = \\dfrac{17}{12}$ ✓ BENAR\n\n" +
      "$S = \\dfrac{11}{12} - \\dfrac{5}{6} = \\dfrac{11}{12} - \\dfrac{10}{12} = \\dfrac{1}{12}$; pernyataan $S=\\frac{1}{6}$ ✗ SALAH\n\n" +
      "Pernyataan yang benar: (2) dan (3) → B",
  },

  // ─── 28 & 29 · Konteks Persediaan Beras ────────────────────────────────────
  // ─── 28 · PGK ─────────────────────────────────────────────────────────────

  // ─── 29 · PG ──────────────────────────────────────────────────────────────
  {
    no: 15,
    type: "pg",
    soal: "Berdasarkan teks Persediaan Beras Bu Kartika (soal 28), biaya pembelian beras tambahan untuk acara syukuran adalah ....",
    options: [
      "A. Rp96.000",
      "B. Rp108.000",
      "C. Rp120.000",
      "D. Rp216.000",
    ],
    jawaban: "B",
    pembahasan:
      "Kebutuhan beras untuk acara:\n" +
      "$75 \\text{ tamu} \\times 0{,}12\\text{ kg} = 9\\text{ kg}$\n\n" +
      "Harga beras per kg:\n" +
      "$\\text{Rp}1.200.000 \\div 100\\text{ kg} = \\text{Rp}12.000\\text{/kg}$\n\n" +
      "Total biaya:\n" +
      "$9 \\times \\text{Rp}12.000 = \\text{Rp}108.000$\n\n" +
      "Jawaban: B",
  },
];

const BilanganRasionalPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN RASIONAL"
    materiSections={materiSections}
    contohSoal={contohSoal}
    latihanDasar={latihanDasar}
  />
);

export default BilanganRasionalPage;
