import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Bilangan Rasional", content: `Bilangan rasional adalah bilangan yang dapat dinyatakan dalam bentuk $\\dfrac{p}{q}$ di mana $p$ dan $q$ bilangan bulat dan $q \\neq 0$.\n\nContoh: $\\frac{1}{2}$, $\\frac{-3}{4}$, $\\frac{5}{1} = 5$, $0,75 = \\frac{3}{4}$, $1,\\overline{3} = \\frac{4}{3}$` },
  { heading: "B. Operasi Pecahan", content: `1. Penjumlahan/Pengurangan:\n$\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{ad \\pm bc}{bd}$ (samakan penyebut terlebih dahulu)\n\n2. Perkalian:\n$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}$\n\n3. Pembagian:\n$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$` },
  { heading: "C. Bentuk Pecahan", content: `1. Pecahan biasa: $\\frac{p}{q}$\n\n2. Pecahan campuran: $a\\frac{p}{q} = a + \\frac{p}{q}$\n\n3. Desimal:\n   - Desimal berhingga: $\\frac{3}{4} = 0,75$\n   - Desimal tak berhingga berulang: $\\frac{1}{3} = 0,333...$\n\n4. Persen: $p\\% = \\frac{p}{100}$` },
  { heading: "D. Membandingkan Bilangan Rasional", content: `Untuk membandingkan $\\frac{a}{b}$ dan $\\frac{c}{d}$, samakan penyebutnya terlebih dahulu.\n\nAlternatif: kalikan silang:\n$\\frac{a}{b} < \\frac{c}{d}$ jika $ad < bc$ (untuk $b, d > 0$)` },
  { heading: "E. Bilangan Rasional pada Garis Bilangan", content: `Setiap bilangan rasional dapat diletakkan pada garis bilangan. Semakin ke kanan, semakin besar nilainya.\n\nUrutan bilangan rasional:\n$... < -1 < -\\frac{1}{2} < 0 < \\frac{1}{3} < \\frac{1}{2} < 1 < ...$` },
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
  {
    no: 2,
    type: "pgk",
    soal: "Perhatikan pernyataan-pernyataan berikut!",
    pernyataan: [
      "$\\dfrac{3}{4} + \\dfrac{2}{3} = \\dfrac{17}{12}$",
      "$\\dfrac{5}{6} - \\dfrac{3}{4} = \\dfrac{1}{12}$",
      "$\\dfrac{4}{5} \\times \\dfrac{3}{8} = \\dfrac{3}{10}$",
      "$\\dfrac{7}{9} \\div \\dfrac{14}{3} = 2$",
    ],
    options: [
      "(1) dan (2)",
      "(1) dan (3)",
      "(2) dan (3)",
      "(1), (2), dan (3)",
    ],
    jawaban: "D",
    pembahasan:
      "(1) $\\frac{3}{4}+\\frac{2}{3}=\\frac{9}{12}+\\frac{8}{12}=\\frac{17}{12}$ ✓\n" +
      "(2) $\\frac{5}{6}-\\frac{3}{4}=\\frac{10}{12}-\\frac{9}{12}=\\frac{1}{12}$ ✓\n" +
      "(3) $\\frac{4}{5}\\times\\frac{3}{8}=\\frac{12}{40}=\\frac{3}{10}$ ✓\n" +
      "(4) $\\frac{7}{9}\\div\\frac{14}{3}=\\frac{7}{9}\\times\\frac{3}{14}=\\frac{21}{126}=\\frac{1}{6}\\neq2$ ✗\n\n" +
      "Pernyataan yang benar: (1), (2), dan (3) → D",
  },

  // ─── 3 · PGKBS ────────────────────────────────────────────────────────────
  {
    no: 3,
    type: "pgkbs",
    soal: "Tentukan benar atau salah setiap pernyataan berikut!",
    pernyataan: [
      "$3,5 \\div 1,75 + 60\\% - 2\\frac{1}{2} = 0,1$",
      "$0,75 = \\dfrac{3}{5}$",
      "$1\\frac{2}{5} = 140\\%$",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan:
      "(1) $3,5\\div1,75=2$; $\\quad 2+0,6-2,5=0,1$ ✓ BENAR\n" +
      "(2) $0,75=\\frac{75}{100}=\\frac{3}{4}\\neq\\frac{3}{5}$ ✗ SALAH\n" +
      "(3) $1\\frac{2}{5}=\\frac{7}{5}=1,4=140\\%$ ✓ BENAR",
  },

  // ─── 4 · PG ───────────────────────────────────────────────────────────────
  {
    no: 4,
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
    no: 5,
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
  {
    no: 6,
    type: "pgkbs",
    soal: "Tentukan benar atau salah setiap pernyataan berikut!",
    pernyataan: [
      "$\\dfrac{1}{1-\\dfrac{3}{11}} = \\dfrac{11}{8}$",
      "$\\dfrac{1}{1-\\dfrac{3}{11}} + \\dfrac{1}{2} = \\dfrac{15}{8}$",
      "$\\dfrac{3}{1-\\dfrac{1}{4}} = 5$",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan:
      "(1) $1-\\frac{3}{11}=\\frac{8}{11}$, maka $\\frac{1}{\\frac{8}{11}}=\\frac{11}{8}$ ✓ BENAR\n" +
      "(2) $\\frac{11}{8}+\\frac{1}{2}=\\frac{11}{8}+\\frac{4}{8}=\\frac{15}{8}$ ✓ BENAR\n" +
      "(3) $1-\\frac{1}{4}=\\frac{3}{4}$, maka $\\frac{3}{\\frac{3}{4}}=3\\times\\frac{4}{3}=4\\neq5$ ✗ SALAH",
  },

  // ─── 7 · PG ───────────────────────────────────────────────────────────────
  {
    no: 7,
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
    no: 8,
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
    no: 9,
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
    no: 10,
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
  {
    no: 11,
    type: "pgk",
    soal: "Jamie membeli $6\\frac{2}{5}$ lot saham dengan harga total Rp7.200.000,00.\nPerhatikan pernyataan-pernyataan berikut!",
    pernyataan: [
      "$6\\frac{2}{5}$ lot $= \\dfrac{32}{5}$ lot dalam bentuk pecahan biasa",
      "Harga 1 lot saham adalah Rp1.125.000,00",
      "Harga 2 lot saham adalah Rp2.500.000,00",
      "Jika Jamie menjual 3 lot dengan harga yang sama, ia mendapat Rp3.375.000,00",
    ],
    options: [
      "(1) dan (2)",
      "(2) dan (4)",
      "(1), (2), dan (4)",
      "(1), (2), (3), dan (4)",
    ],
    jawaban: "C",
    pembahasan:
      "(1) $6\\frac{2}{5}=\\frac{30+2}{5}=\\frac{32}{5}$ ✓\n" +
      "(2) $7.200.000\\div\\frac{32}{5}=7.200.000\\times\\frac{5}{32}=1.125.000$ ✓\n" +
      "(3) $2\\times1.125.000=2.250.000\\neq2.500.000$ ✗\n" +
      "(4) $3\\times1.125.000=3.375.000$ ✓\n\n" +
      "Pernyataan yang benar: (1), (2), dan (4) → C",
  },

  // ─── 12 · PGKBS ───────────────────────────────────────────────────────────
  {
    no: 12,
    type: "pgkbs",
    soal: "Husein dapat mengecat tembok dalam 3 hari. Amir dalam 6 hari.\nTentukan benar atau salah setiap pernyataan berikut!",
    pernyataan: [
      "Kecepatan kerja bersama Husein dan Amir adalah $\\dfrac{1}{2}$ pekerjaan/hari",
      "Jika bekerja bersama, pengecatan selesai dalam 2 hari",
      "Amir dapat menyelesaikan $\\dfrac{3}{4}$ pekerjaan dalam 4 hari",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan:
      "(1) $\\frac{1}{3}+\\frac{1}{6}=\\frac{2}{6}+\\frac{1}{6}=\\frac{3}{6}=\\frac{1}{2}$ ✓ BENAR\n" +
      "(2) Waktu $=\\frac{1}{\\frac{1}{2}}=2$ hari ✓ BENAR\n" +
      "(3) Amir: $\\frac{1}{6}\\times4=\\frac{4}{6}=\\frac{2}{3}\\neq\\frac{3}{4}$ ✗ SALAH",
  },

  // ─── 13 · PG ──────────────────────────────────────────────────────────────
  {
    no: 13,
    type: "pg",
    soal: "Anida dapat menyelesaikan 1 stel seragam dalam 9 jam, Anisa dalam 6 jam. Waktu yang dibutuhkan Anida dan Anisa bekerja bersama-sama adalah ...",
    options: [
      "3 jam 30 menit",
      "3 jam 36 menit",
      "7 jam 30 menit",
      "7 jam 50 menit",
    ],
    jawaban: "B",
    pembahasan:
      "Kecepatan bersama:\n" +
      "$\\frac{1}{9}+\\frac{1}{6}=\\frac{2}{18}+\\frac{3}{18}=\\frac{5}{18}$ seragam/jam\n\n" +
      "Waktu $=\\dfrac{18}{5}=3\\frac{3}{5}$ jam\n\n" +
      "$\\frac{3}{5}\\times60=36$ menit\n\n" +
      "Jadi: 3 jam 36 menit → B",
  },

  // ─── 14 · PGK ─────────────────────────────────────────────────────────────
  {
    no: 14,
    type: "pgk",
    soal: "Pompa A mengisi kolam penuh dalam 3 jam, Pompa B dalam 4 jam, Pompa C dalam 6 jam.\nPerhatikan pernyataan-pernyataan berikut!",
    pernyataan: [
      "Kecepatan pengisian Pompa A adalah $\\dfrac{1}{3}$ kolam per jam",
      "Kecepatan ketiga pompa bersama-sama adalah $\\dfrac{3}{4}$ kolam per jam",
      "Jika ketiga pompa bekerja bersama, waktu yang diperlukan adalah $1\\dfrac{1}{3}$ jam",
      "Waktu yang diperlukan ketiga pompa bersama adalah 1 jam 30 menit",
    ],
    options: [
      "(1) dan (2)",
      "(2) dan (3)",
      "(1) dan (3)",
      "(1), (2), dan (3)",
    ],
    jawaban: "D",
    pembahasan:
      "(1) $\\frac{1}{3}$ kolam/jam ✓\n" +
      "(2) $\\frac{1}{3}+\\frac{1}{4}+\\frac{1}{6}=\\frac{4+3+2}{12}=\\frac{9}{12}=\\frac{3}{4}$ ✓\n" +
      "(3) Waktu $=\\frac{1}{\\frac{3}{4}}=\\frac{4}{3}=1\\frac{1}{3}$ jam ✓\n" +
      "(4) $1\\frac{1}{3}$ jam $=1$ jam $20$ menit $\\neq1$ jam 30 menit ✗\n\n" +
      "Pernyataan yang benar: (1), (2), dan (3) → D",
  },

  // ─── 15 · PGKBS ───────────────────────────────────────────────────────────
  {
    no: 15,
    type: "pgkbs",
    soal: "Tentukan benar atau salah setiap pernyataan berikut!",
    pernyataan: [
      "$0,\\overline{36} = \\dfrac{4}{11}$",
      "Jika $0,\\overline{36}=\\dfrac{a}{b}$ (bentuk paling sederhana), maka $a+b=14$",
      "$0,\\overline{6} = \\dfrac{2}{3}$",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan:
      "(1) $0,\\overline{36}=\\frac{36}{99}=\\frac{4}{11}$ ✓ BENAR\n" +
      "(2) $a=4,\\ b=11$, maka $a+b=15\\neq14$ ✗ SALAH\n" +
      "(3) $0,\\overline{6}=\\frac{6}{9}=\\frac{2}{3}$ ✓ BENAR",
  },

  // ─── 16 · PG ──────────────────────────────────────────────────────────────
  {
    no: 16,
    type: "pg",
    soal: "Jika $P = 0,\\overline{123}$, maka bentuk pecahan paling sederhana dari $P$ adalah ...",
    options: [
      "$\\dfrac{123}{999}$",
      "$\\dfrac{41}{333}$",
      "$\\dfrac{41}{999}$",
      "$\\dfrac{123}{333}$",
    ],
    jawaban: "B",
    pembahasan:
      "Misalkan $P=0,\\overline{123}=0,123123...$\n" +
      "$1000P=123,123123...$\n" +
      "$1000P-P=123 \\Rightarrow 999P=123$\n" +
      "$P=\\dfrac{123}{999}$\n\n" +
      "Sederhanakan: $\\gcd(123,999)=3$\n" +
      "$P=\\dfrac{123\\div3}{999\\div3}=\\dfrac{41}{333}$ → B",
  },

  // ─── 17 · PGK ─────────────────────────────────────────────────────────────
  {
    no: 17,
    type: "pgk",
    soal: "Perhatikan pernyataan-pernyataan berikut tentang $\\left(1-\\dfrac{1}{2}\\right)\\left(1-\\dfrac{1}{3}\\right)\\cdots\\left(1-\\dfrac{1}{n}\\right)$!",
    pernyataan: [
      "Setiap faktor ke-$k$ dapat ditulis sebagai $\\dfrac{k-1}{k}$",
      "$\\left(1-\\dfrac{1}{2}\\right)\\left(1-\\dfrac{1}{3}\\right)\\left(1-\\dfrac{1}{4}\\right) = \\dfrac{1}{4}$",
      "$\\left(1-\\dfrac{1}{2}\\right)\\left(1-\\dfrac{1}{3}\\right)\\cdots\\left(1-\\dfrac{1}{2026}\\right) = \\dfrac{1}{2026}$",
      "$\\left(1-\\dfrac{1}{2}\\right)\\left(1-\\dfrac{1}{3}\\right)\\cdots\\left(1-\\dfrac{1}{10}\\right) = \\dfrac{1}{5}$",
    ],
    options: [
      "(1) dan (2)",
      "(2) dan (3)",
      "(1) dan (3)",
      "(1), (2), dan (3)",
    ],
    jawaban: "D",
    pembahasan:
      "(1) $1-\\frac{1}{k}=\\frac{k-1}{k}$ ✓\n" +
      "(2) $\\frac{1}{2}\\times\\frac{2}{3}\\times\\frac{3}{4}=\\frac{1\\cdot2\\cdot3}{2\\cdot3\\cdot4}=\\frac{6}{24}=\\frac{1}{4}$ ✓\n" +
      "(3) Hasil teleskopik: $\\frac{1}{2}\\times\\frac{2}{3}\\times\\cdots\\times\\frac{2025}{2026}=\\frac{1}{2026}$ ✓\n" +
      "(4) $\\frac{1}{2}\\times\\frac{2}{3}\\times\\cdots\\times\\frac{9}{10}=\\frac{1}{10}\\neq\\frac{1}{5}$ ✗\n\n" +
      "Pernyataan yang benar: (1), (2), dan (3) → D",
  },

  // ─── 18 · PGKBS ───────────────────────────────────────────────────────────
  {
    no: 18,
    type: "pgkbs",
    soal: "Diketahui $x = 3 + \\dfrac{2}{3+\\dfrac{2}{3+\\dfrac{2}{\\ddots}}}$ (pecahan kontinu berulang tak berhingga).\nTentukan benar atau salah setiap pernyataan berikut!",
    pernyataan: [
      "Persamaan yang terbentuk adalah $x^2 - 3x - 2 = 0$",
      "Nilai positif $x$ yang memenuhi adalah $\\dfrac{3+\\sqrt{17}}{2}$",
      "$x^2 - 3x = 4$",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan:
      "Karena pola berulang, ganti bagian dalam dengan $x$:\n" +
      "$x=3+\\frac{2}{x}\\Rightarrow x^2=3x+2\\Rightarrow x^2-3x-2=0$ ✓ (1) BENAR\n\n" +
      "Rumus kuadrat: $x=\\dfrac{3\\pm\\sqrt{9+8}}{2}=\\dfrac{3\\pm\\sqrt{17}}{2}$\n" +
      "Nilai positif: $x=\\dfrac{3+\\sqrt{17}}{2}$ ✓ (2) BENAR\n\n" +
      "Dari $x^2-3x-2=0$: $x^2-3x=2\\neq4$ ✗ (3) SALAH",
  },

  // ─── 19 · PG ──────────────────────────────────────────────────────────────
  {
    no: 19,
    type: "pg",
    soal: "Jumlah semua bilangan bulat $n$ sehingga $\\dfrac{n+5}{n-2}$ merupakan bilangan bulat adalah ...",
    options: ["4", "6", "8", "12"],
    jawaban: "C",
    pembahasan:
      "Tulis ulang:\n" +
      "$\\dfrac{n+5}{n-2}=\\dfrac{(n-2)+7}{n-2}=1+\\dfrac{7}{n-2}$\n\n" +
      "Agar hasilnya bilangan bulat, $(n-2)$ harus membagi habis 7.\n" +
      "Faktor dari $7$: $\\pm1,\\ \\pm7$\n\n" +
      "$n-2\\in\\{-7,\\ -1,\\ 1,\\ 7\\}$\n" +
      "$n\\in\\{-5,\\ 1,\\ 3,\\ 9\\}$\n\n" +
      "Jumlah: $(-5)+1+3+9=8$ → C",
  },
];

const BilanganRasionalPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN RASIONAL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BilanganRasionalPage;
