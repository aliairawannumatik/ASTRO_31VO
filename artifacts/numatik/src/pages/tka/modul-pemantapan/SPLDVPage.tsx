import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const contohSoal: LatihanSoal[] = [
  // ── Soal 1 — PG ─────────────────────────────────────────────────────────────
  {
    no: 1, type: "pg",
    soal: "Diberikan sistem persamaan linear dua variabel $x + y = 7$ dan $x - y = 3$. Himpunan penyelesaian dari sistem tersebut adalah …",
    options: [
      "A. $\\{(2, 5)\\}$",
      "B. $\\{(5, -2)\\}$",
      "C. $\\{(5, 2)\\}$",
      "D. $\\{(-5, 2)\\}$",
    ],
    jawaban: "C",
    pembahasan: "Gunakan metode eliminasi untuk menghilangkan variabel $y$:\n$$\\begin{aligned} x + y &= 7 \\\\ x - y &= 3 \\\\ \\hline 2x &= 10 \\quad (+)\\\\ x &= 5 \\end{aligned}$$\nSubstitusi $x = 5$ ke persamaan pertama:\n$$5 + y = 7 \\implies y = 2$$\nHimpunan Penyelesaian $= \\{(5, 2)\\}$\nJawaban: C",
  },

  // ── Soal 2 — PGKBS ──────────────────────────────────────────────────────────
  {
    no: 2, type: "pgkbs",
    soal: "Diketahui sistem persamaan linear dua variabel $4x - 2y = 10$ dan $2x + y = 9$ memiliki penyelesaian $x = m$ dan $y = n$. Tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Nilai $n$ sama dengan $4$.",
      "Nilai $m$ sama dengan $3$.",
      "Nilai dari $2m - n$ adalah $2$.",
      "Nilai $m < n$.",
    ],
    jawabanBS: ["S", "S", "S", "S"],
    pembahasan: "Eliminasi variabel $x$ untuk mencari $y$ ($n$):\n$$\\begin{aligned} 4x - 2y = 10 &\\;(\\times 1) \\implies 4x - 2y = 10 \\\\ 2x + y = 9 &\\;(\\times 2) \\implies 4x + 2y = 18 \\\\ \\hline &\\quad\\quad -4y = -8 \\quad (-) \\\\ &\\quad\\quad y = 2 \\end{aligned}$$\nMaka $n = 2$ (bukan 4) → Pernyataan (1) SALAH\nSubstitusi $y = 2$ ke persamaan (2): $2x + 2 = 9 \\Rightarrow x = 3{,}5$\nMaka $m = 3{,}5$ (bukan 3) → Pernyataan (2) SALAH\n$2m - n = 2(3{,}5) - 2 = 5$ (bukan 2) → Pernyataan (3) SALAH\n$m = 3{,}5 > n = 2$, sehingga $m > n$ (bukan $m < n$) → Pernyataan (4) SALAH",
  },

  // ── Soal 3 — PGKBS (bacaan: Toko Busana Indah) ──────────────────────────────
  {
    no: 3, type: "pgkbs",
    soal: "📖 Bacaan (untuk Soal 3 dan 4)\nIbu Sarah membeli 3 potong kemeja dan 2 potong celana di toko \"Busana Indah\" seharga Rp450.000,00. Ibu Maya membeli 2 potong kemeja dan 1 potong celana di toko yang sama seharga Rp260.000,00. Ibu Rini berniat membeli 4 potong kemeja dan 3 potong celana di toko tersebut.\n\nBerdasarkan teks di atas, tentukan kategorisasi Tepat atau Tidak Tepat untuk setiap pernyataan berikut!",
    pernyataan: [
      "Harga satu potong kemeja di toko \"Busana Indah\" adalah Rp70.000,00.",
      "Harga dua potong celana di toko \"Busana Indah\" adalah Rp240.000,00.",
      "Ibu Rini harus membayar total Rp640.000,00 di toko \"Busana Indah\".",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Misalkan $x$ = harga 1 kemeja, $y$ = harga 1 celana.\nSistem persamaan:\n$3x + 2y = 450.000 \\quad \\text{--- (1)}$\n$2x + y = 260.000 \\quad \\text{--- (2)} \\implies y = 260.000 - 2x$\nSubstitusi $y$ ke (1):\n$$3x + 2(260.000 - 2x) = 450.000$$\n$$3x + 520.000 - 4x = 450.000 \\implies -x = -70.000 \\implies x = 70.000$$\nHarga 1 kemeja = Rp70.000,00 → TEPAT\n$y = 260.000 - 2(70.000) = 120.000$; harga 2 celana $= 2 \\times 120.000 = 240.000$ → TEPAT\nBelanjaan Ibu Rini $= 4(70.000) + 3(120.000) = 280.000 + 360.000 = 640.000$ → TEPAT",
  },

  // ── Soal 4 — PG (lanjutan bacaan Toko Busana Indah) ─────────────────────────
  {
    no: 4, type: "pg",
    soal: "Berdasarkan bacaan pada Soal 3, apabila Ibu Rini hendak melunasi belanjaannya sebesar Rp640.000,00 menggunakan pecahan uang Rp100.000,00, berapa lembar uang kertas yang minimal harus ia bayarkan?",
    options: [
      "A. 6 lembar",
      "B. 7 lembar",
      "C. 8 lembar",
      "D. 10 lembar",
    ],
    jawaban: "B",
    pembahasan: "Total belanja Ibu Rini = Rp640.000,00; pecahan uang = Rp100.000,00.\n$$\\frac{640.000}{100.000} = 6{,}4 \\text{ lembar}$$\nKarena lembaran harus utuh dan mencukupi, dibulatkan ke atas:\n$6{,}4 \\rightarrow 7$ lembar\nDengan 7 lembar uang Rp100.000,00 (total Rp700.000,00), cukup membayar dan mendapat kembalian Rp60.000,00.\nJawaban: B",
  },

  // ── Soal 5 — PG ─────────────────────────────────────────────────────────────
  {
    no: 5, type: "pg",
    soal: "Diberikan sistem persamaan:\n$$\\frac{1}{x} + \\frac{3}{y} = \\frac{5}{6} \\quad \\text{dan} \\quad \\frac{3}{x} - \\frac{1}{y} = \\frac{1}{2}$$\nPenyelesaian dari sistem persamaan tersebut adalah $(x, y) = \\dots$",
    options: [
      "A. $(2, 4)$",
      "B. $(3, 4)$",
      "C. $(4, 3)$",
      "D. $(2, 3)$",
    ],
    jawaban: "D",
    pembahasan: "Misalkan $a = \\dfrac{1}{x}$ dan $b = \\dfrac{1}{y}$, sehingga:\n$a + 3b = \\dfrac{5}{6} \\implies 6a + 18b = 5 \\quad\\text{--- (1)}$\n$3a - b = \\dfrac{1}{2} \\implies 6a - 2b = 1 \\quad\\text{--- (2)}$\nEliminasi variabel $a$ dengan (1) $-$ (2):\n$$20b = 4 \\implies b = \\frac{1}{5}$$\nSubstitusi $b = \\dfrac{1}{5}$ ke (2):\n$$6a - \\frac{2}{5} = 1 \\implies 6a = \\frac{7}{5} \\implies a = \\frac{7}{30}$$\nKembalikan ke variabel asli:\n$x = \\dfrac{1}{a} = \\dfrac{30}{7}$, $\\quad y = \\dfrac{1}{b} = 5$\nHasil: $\\left(\\dfrac{30}{7},\\, 5\\right)$",
  },
];

const materiSections: MateriSection[] = [
  { heading: "A. Persamaan Linear Dua Variabel (PLDV)", content: `Bentuk umum PLDV: $ax + by = c$ dengan $a, b \\neq 0$, variabel x dan y.` },
  { heading: "B. Sistem Persamaan Linear Dua Variabel (SPLDV)", content: `$a_1x + b_1y = c_1$\n$a_2x + b_2y = c_2$` },
  { heading: "C. Penyelesaian SPLDV", content: `Penyelesaian SPLDV digunakan untuk menentukan nilai (x, y) yang memenuhi kedua persamaan melalui metode sebagai berikut:\na. Metode Grafik\nb. Metode Substitusi\nc. Metode Eliminasi\nd. Metode Campuran` },
  { heading: "D. Penyelesaian Soal Menggunakan Metode Campuran", content: `$x + 3y = 2$ (persamaan 1)\n$2x + y = 9$ (persamaan 2)\n\nLangkah berikutnya adalah menyamakan koefisien salah satu variabel untuk dihilangkan (dieliminasi), bisa koefisien x atau koefisien y. Pada kasus ini kita coba pilih untuk menyamakan koefisien x yaitu dengan cara $\\times 2$ pada persamaan 1 agar sama-sama 2x seperti pada uraian berikut:\n\n$x + 3y = 2 \\quad \\times 2 \\quad \\Rightarrow \\quad 2x + 6y = 4$\n$2x + y = 9 \\quad \\times 1 \\quad \\Rightarrow \\quad 2x + y = 9$\n$\\hspace{5.5cm} 5y = -5$\n$\\hspace{5.5cm} y = -1$\n\nUntuk mendapatkan nilai variabel x kita substitusikan nilai y yang sudah diketahui ke salah satu persamaan, baik persamaan 1 ataupun persamaan 2.\n\nKita coba substitusikan $y = -1$ ke persamaan 1 yaitu $x + 3y = 2$\n$x + 3(-1) = 2$\n$x - 3 = 2$\n$x = 2 + 3$\n$x = 5$\n\nJadi, penyelesaian SPLDV di atas adalah $x = 5$ dan $y = -1$ atau $(5, -1)$` },
  { heading: "E. SPLDV Memiliki Penyelesaian Tak Hingga", content: `Pada kasus SPLDV dimana memiliki penyelesaian tak hingga adalah ketika sistem persamaan yang ada membentuk PLDV.\n\nContoh:\nTentukan penyelesaian SPLDV berikut:\n$x + y = 5$\n$2x + 2y = 10$\n\nKedua persamaan tersebut sebenarnya adalah persamaan yang sama (persamaan kedua adalah 2 kali persamaan pertama), sehingga memiliki tak hingga penyelesaian.` },
  { heading: "F. SPLDV Tidak Memiliki Himpunan Penyelesaian", content: `Pada kasus SPLDV dimana kedua persamaan memiliki persamaan yang sama namun dengan hasil yang berbeda (tidak konsisten).\n\nContoh:\nTentukan penyelesaian SPLDV berikut:\n$x + y = 5$\n$x + y = -3$\n\nKedua persamaan tersebut tidak konsisten karena sisi kiri sama tetapi sisi kanan berbeda, sehingga tidak memiliki penyelesaian.` },
  { heading: "G. SPLDV Memiliki 1 Himpunan Penyelesaian", content: `Pada kasus SPLDV dimana kedua persamaan tidak membentuk PLDV dan tidak terdapat 2 persamaan yang sama dengan menghasilkan nilai yang berbeda.\n\nIni adalah kasus yang paling umum dijumpai dalam soal-soal SPLDV.` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui sistem persamaan $x - 3y - 5 = 0$ dan $2x - 5y = 9$. Nilai dari $3x + 2y$ adalah", options: ["A. -1", "B. 1", "C. 3", "D. 4"] },
  { no: 2, soal: "Penyelesaian sistem persamaan $3x - 2y = 12$ dan $5x + y = 7$ adalah $x = p$ dan $y = q$. Nilai dari $4p + 3q$ adalah ...", options: ["A. -2", "B. 7", "C. 14", "D. 16"] },
  { no: 3, soal: "Jika a dan b merupakan penyelesaian dari sistem persamaan $-3x + 2y = 8$ dan $2x - y = -10$, nilai dari $a - 2b$ adalah ...", options: ["A. 16", "B. 32", "C. 40", "D. 48"] },
  { no: 4, soal: "Penyelesaian dari $\\frac{2}{x} + \\frac{1}{y} = 6$ dan $\\frac{1}{x} + \\frac{1}{y} = 2$ adalah $x = a$ dan $y = b$. Nilai dari $a - 2b$ adalah ...", options: ["A. -2", "B. 7", "C. 14", "D. 16"] },
  { no: 5, soal: "Diketahui $\\frac{3}{x} + \\frac{1}{y} = 4$ dan $\\frac{1}{x} - \\frac{2}{y} = -2$. Nilai $2x - y$ adalah ...", options: ["A. 0", "B. 2", "C. 4", "D. 8"] },
  { no: 6, soal: "Diketahui sistem persamaan berikut:\n$\\frac{2}{x} + \\frac{3}{y} = 2$\n$\\frac{4}{x} - \\frac{3}{y} = 1$\nNilai x sama dengan ...", options: ["A. 2", "B. 3", "C. $\\frac{1}{2}$", "D. $\\frac{1}{3}$"] },
  { no: 7, soal: "Perhatikan sistem persamaan 'campuran' berikut:\n$\\sqrt{y} - \\sqrt{x} = 1$\n$\\frac{4}{\\sqrt{x}} + \\frac{3}{\\sqrt{y}} = 3$\nJika diketahui x dan y adalah bilangan bulat positif, maka nilai dari xy adalah ...", options: ["A. 6", "B. 3", "C. 2", "D. 5"] },
  { no: 8, soal: "Hanna membeli 3 buah buku dan 2 buah pensil. Hanna membayar dengan dua lembar uang Rp 10.000,00 dan mendapatkan kembalian Rp 3.000,00. Jika harga sebuah buku x rupiah dan pensil y rupiah, maka model matematikanya adalah..", options: ["A. $10.000 - 3x - 2y = 3.000$", "B. $10.000 - 3x + 2y = 3.000$", "C. $20.000 - (3x - 2y) = 3.000$", "D. $20.000 - (3x + 2y) = 3.000$"] },
  { no: 9, soal: "Indra membeli 2 buah buku dan 3 buah pensil. Indra membayar dengan dua lembar uang Rp 20.000,00 dan mendapatkan kembalian Rp 13.000,00. Jika harga sebuah buku x rupiah dan pensil y rupiah, maka model matematikanya adalah..", options: ["A. $20.000 - 2x - 3y = 13.000$", "B. $20.000 - 2x + 3y = 13.000$", "C. $40.000 - (2x - 3y) = 13.000$", "D. $40.000 - (2x + 3y) = 13.000$"] },
  { no: 10, soal: "Harga 4 buku tulis dan 3 pensil adalah Rp. 13.500,00. Harga 3 buku tulis dan 2 pensil adalah Rp. 9.750,00. Harga 2 buku tulis dan 3 pensil adalah ..", options: ["A. Rp 11.250,00", "B. Rp 10.000,00", "C. Rp 9.500,00", "D. Rp 9.000,00"] },
  { no: 11, soal: "Jika harga sebuah mesin cetak adalah 5 kali harga sebuah komputer sedangkan harga 2 buah mesin cetak dan 5 buah komputer adalah Rp 60.000.000,00, maka harga sebuah mesin cetak adalah ...", options: ["A. Rp 8.000.000,00", "B. Rp 12.000.000,00", "C. Rp 20.000.000,00", "D. Rp 24.000.000,00"] },
  { no: 12, soal: "Di kandang Pak Karto terdapat ayam dan kambing sebanyak 75 ekor. Jika banyaknya kaki ada 198 buah maka banyaknya kambing adalah ....", options: ["A. 24 ekor", "B. 23 ekor", "C. 22 ekor", "D. 21 ekor"] },
  { no: 13, soal: "Tempat parkir pada saat itu menampung 90 kendaraan sepeda motor dan mobil, sedangkan jumlah roda seluruhnya ada 290 buah. Jika tarif parkir sepeda motor Rp2.000,00/jam dan mobil Rp5.000,00/jam, maka pendapatan tukang parkir saat itu selama 2 jam adalah ....", options: ["A. Rp345.000,00", "B. Rp325.000,00", "C. Rp285.000,00", "D. Rp690.000,00"] },
  { no: 14, soal: "Hazky mengambil uang di bank sebesar Rp.1.850.000,00 yang terdiri dari uang seratus ribuan dan uang lima puluh ribuan. Jika banyaknya uang lima puluh ribuan 7 lembar lebih banyak dari uang seratus ribuan, maka banyaknya uang lima puluh ribuan adalah...", options: ["A. 10 lembar", "B. 12 lembar", "C. 15 lembar", "D. 17 lembar"] },
  { no: 15, soal: "Dalam sebuah tempat pertunjukan terdapat 200 orang yang terdiri dari penonton dewasa dan anak-anak. Dari penjualan tiket diperoleh uang sebesar Rp 780.000,00. Jika harga tiket orang dewasa Rp 4.000,00 dan harga tiket anak-anak Rp 3.500,00, banyak penonton anak-anak adalah....", options: ["A. 40 orang", "B. 35 orang", "C. 30 orang", "D. 160 orang"] },
  { no: 16, soal: "Lima tahun yang lalu, usia Ayah adalah empat kali usia Paman. Lima tahun yang akan datang, dua kali usia Ayah sama dengan tiga kali usia Paman ditambah 7 tahun. Berapakah usia Ayah sekarang?", options: ["A. 40 tahun", "B. 35 tahun", "C. 25 tahun", "D. 45 tahun"] },
  { no: 17, soal: "Jumlah dua buah kebalikan bilangan adalah 5, sedangkan selisihnya adalah 1. (Kebalikan bilangan x adalah $\\frac{1}{x}$). Tentukan hasil kali kedua bilangan tersebut.", options: ["A. 6", "B. $\\frac{1}{6}$", "C. 5", "D. $\\frac{1}{5}$"] },
];

const SPLDVPage = () => (
  <TKAPemantapanLayout
    title="SISTEM PERSAMAAN LINEAR DUA VARIABEL"
    materiSections={materiSections}
    contohSoal={contohSoal}
    latihanDasar={latihanDasar}
  />
);

export default SPLDVPage;
