import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Bentuk Umum", content: `$ax^n + b$\n\n$x$ disebut variabel, biasanya berupa huruf alfabet\n$a$ disebut koefisien (bilangan pengali variabel)\n$b$ disebut konstanta, bilangan tunggal (tanpa variabel)\n$n$ disebut pangkat/derajat` },
  { heading: "B. Operasi", content: `1. Macam-macam suku\n   - Monomial (satu suku)\n   - Binomial (dua suku)\n   - Polinomial (banyak suku)\n\n2. Jumlah atau kurang\n   Menjumlahkan dan mengurangkan suku-suku sejenis.\n\n3. Perkalian\n   $a(b+c) = ab + ac$\n   $(a+b)(c+d) = ac + ad + bc + bd$\n   $(a+b)(a+b) = a^2 + 2ab + b^2$\n\n4. Pembagian\n   $\\frac{a^m}{a^n} = a^{m-n}$, dengan $a^n \\neq 0$` },
  { heading: "D. Faktorisasi", content: `1. Faktor Persekutuan\n   $ab \\pm ac = a(b \\pm c)$\n\n2. Selisih dua kuadrat\n   $a^2 - b^2 = (a+b)(a-b)$\n\n3. Bentuk $ax^2 + bx + c$\n   - Jika $a = 1$: $x^2 + bx + c = (x + p)(x + q)$ dengan $p + q = b$ dan $p \\times q = c$\n   - Jika $a \\neq 1$: $ax^2 + bx + c = (ax + p)(ax + q) / a$ dengan $p + q = b$ dan $p \\times q = a \\times c$` },
];

// ─── Contoh Soal — TES KEMAMPUAN AKADEMIK · MODUL PEMANTAPAN 2026–2027 ───
// Sumber: soal dan pembahasan yang diunggah pengguna.
const contohSoal: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Bentuk paling sederhana dari aljabar $8x + 5y - 3z - 2x - 8y + 7z$ adalah …",
    options: [
      "A. $6x - 3y + 4z$",
      "B. $6x + 3y + 4z$",
      "C. $10x - 3y + 4z$",
      "D. $6x - 3y - 4z$",
    ],
    jawaban: "A",
    pembahasan: "Trik dan Tips:\nGunakan prinsip \"Suku Sejenis\": Kerjakan variabel yang sama secara terpisah ($x$ dengan $x$, $y$ dengan $y$, $z$ dengan $z$).\nPerhatikan koefisien negatif. Tanda negatif di depan koefisien dianggap melekat pada angka tersebut.\n\nStep by Step Penyelesaian:\nKelompokkan suku-suku yang memiliki variabel sama:\n$(8x - 2x) + (5y - 8y) + (-3z + 7z)$\n\nOperasikan masing-masing koefisien:\nVariabel $x$: $8 - 2 = 6 \\longrightarrow 6x$\nVariabel $y$: $5 - 8 = -3 \\longrightarrow -3y$\nVariabel $z$: $-3 + 7 = 4 \\longrightarrow 4z$\n\nGabungkan hasil akhirnya:\n$6x - 3y + 4z$\n\nJawaban: A",
  },
  {
    no: 2, type: "pgk",
    soal: "Cermati beberapa bentuk pemfaktoran aljabar berikut!\nManakah dari pemfaktoran di atas yang bernilai benar?",
    pernyataan: [
      "(i) $9x^2 - 16 = (3x - 4)(3x + 4)$",
      "(ii) $3x^2 + 5x - 2 = (3x - 1)(x - 2)$",
      "(iii) $x^2 + 2x - 15 = (x + 5)(x - 3)$",
      "(iv) $x^2 + 5x - 6 = (x - 6)(x + 1)$",
    ],
    jawaban: "Pernyataan (i) dan (iii) BENAR",
    jawabanPGK: [0, 2],
    pembahasan: "Trik dan Tips:\nSelisih Dua Kuadrat: Bentuk $a^2 - b^2$ selalu bisa dipecah menjadi $(a - b)(a + b)$.\nPerkalian Cepat: Untuk mengecek kebenaran faktor bentuk $x^2 + bx + c$, periksa apakah $p \\times q = c$ dan $p + q = b$.\n\nStep by Step Penyelesaian:\nUji Pernyataan (i):\n$9x^2 - 16 = (3x)^2 - 4^2 = (3x - 4)(3x + 4)$ (BENAR)\n\nUji Pernyataan (ii):\nKembangkan ruas kanan: $(3x - 1)(x - 2) = 3x^2 - 6x - x + 2 = 3x^2 - 7x + 2$.\nTidak cocok dengan $3x^2 + 5x - 2$ → (SALAH)\n\nUji Pernyataan (iii):\nPeriksa konstanta dan koefisien: $+5 \\times (-3) = -15$ dan $+5 + (-3) = +2$.\nMaka $x^2 + 2x - 15 = (x + 5)(x - 3)$ → (BENAR)\n\nUji Pernyataan (iv):\nKembangkan ruas kanan: $(x - 6)(x + 1) = x^2 - 5x - 6$.\nTanda koefisien tengah $-5x$ tidak cocok dengan $+5x$ → (SALAH)\n\nJawaban: Pernyataan (i) dan (iii) BENAR",
  },
  {
    no: 3, type: "pgkbs",
    soal: "Teks Informasi (Untuk Soal 3 & 4)\nTaman Kota\nSebuah taman berbentuk persegi panjang memiliki ukuran lebar $(2x - 1)$ meter. Panjang taman tersebut $4\\text{ m}$ lebihnya dari ukuran lebarnya.\n\nBerdasarkan informasi teks di atas, tentukan kebenaran untuk setiap pernyataan berikut!",
    pernyataan: [
      "a. Ukuran panjang taman adalah $(2x + 3)$ meter.",
      "b. Keliling taman tersebut dapat dinyatakan sebagai $(8x + 4)$ meter.",
      "c. Luas taman kota tersebut adalah $(4x^2 + 4x - 3)$ $\\text{m}^2$.",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Jawaban: Pernyataan a (BENAR), b (BENAR), c (BENAR)\n\nTrik dan Tips:\nUbah kalimat verbal \"4 m lebihnya dari lebar\" menjadi persamaan aljabar: $p = l + 4$.\nRumus dasar: $\\text{Keliling} = 2(p + l)$ dan $\\text{Luas} = p \\times l$.\n\nStep by Step Penyelesaian:\nMenentukan Model Aljabar Panjang ($p$):\n$p = l + 4$\n$p = (2x - 1) + 4 = 2x + 3$ (Pernyataan a BENAR)\n\nMenghitung Keliling ($K$):\n$K = 2(p + l)$\n$K = 2[(2x + 3) + (2x - 1)]$\n$K = 2(4x + 2) = 8x + 4$ (Pernyataan b BENAR)\n\nMenghitung Luas ($L$):\n$L = p \\times l$\n$L = (2x + 3)(2x - 1)$\n$L = 4x^2 - 2x + 6x - 3$\n$L = 4x^2 + 4x - 3$ (Pernyataan c BENAR)",
  },
  {
    no: 4, type: "pg",
    soal: "Di sekeliling taman kota tersebut akan dipasang pagar kawat pembatas setinggi $2\\text{ m}$. Jika panjang taman diketahui $15\\text{ m}$ dan harga kawat pembatas adalah $\\text{Rp}15.000\\text{/m}^2$, hitung total biaya pembelian kawat yang dibutuhkan!",
    options: [
      "A. $\\text{Rp}1.200.000$",
      "B. $\\text{Rp}1.320.000$",
      "C. $\\text{Rp}1.440.000$",
      "D. $\\text{Rp}1.560.000$",
    ],
    jawaban: "D",
    pembahasan: "Trik dan Tips:\nPagar dipasang melingkar, maka Luas Kawat = Keliling Pagar × Tinggi.\nTemukan nilai $x$ terlebih dahulu dari panjang yang diketahui untuk mendapatkan lebar sebenarnya.\n\nStep by Step Penyelesaian:\nCari Nilai $x$ dari Panjang:\n$p = 2x + 3$\n$15 = 2x + 3 \\longrightarrow 2x = 12 \\longrightarrow x = 6$\n\nHitung Lebar Sebenarnya ($l$):\n$l = 2x - 1 = 2(6) - 1 = 11\\text{ m}$\n\nHitung Keliling Taman:\n$K = 2 \\times (p + l) = 2 \\times (15 + 11) = 2 \\times 26 = 52\\text{ m}$\n\nHitung Luas Kawat Pembatas:\n$\\text{Luas Kawat} = \\text{Keliling} \\times \\text{Tinggi}$\n$\\text{Luas Kawat} = 52\\text{ m} \\times 2\\text{ m} = 104\\text{ m}^2$\n\nHitung Total Biaya:\n$\\text{Total Biaya} = 104\\text{ m}^2 \\times \\text{Rp}15.000/\\text{m}^2 = \\text{Rp}1.560.000$\n\nJawaban: D",
  },
  {
    no: 5, type: "pg",
    soal: "Bentuk sederhana dari pecahan aljabar $\\dfrac{3x^2 - 7x - 6}{9x^2 - 4}$ adalah …",
    options: [
      "A. $\\dfrac{x - 3}{3x - 2}$",
      "B. $\\dfrac{x - 3}{3x + 2}$",
      "C. $\\dfrac{x + 3}{3x - 2}$",
      "D. $\\dfrac{x + 3}{3x + 2}$",
    ],
    jawaban: "A",
    pembahasan: "Trik dan Tips:\nFaktorkan penyebut dulu ($9x^2 - 4$) karena berbentuk selisih kuadrat yang sangat mudah diprediksi: $(3x - 2)(3x + 2)$.\nSalah satu faktor penyebut dipastikan akan membagi habis faktor dari pembilang.\n\nStep by Step Penyelesaian:\nFaktorkan Pembilang ($3x^2 - 7x - 6$):\nCari kombinasi angka yang menghasilkan perkalian $3 \\times (-6) = -18$ dan jumlah $-7$, yaitu $-9$ dan $+2$.\n$3x^2 - 7x - 6 = (3x + 2)(x - 3)$\n\nFaktorkan Penyebut ($9x^2 - 4$):\nBentuk $a^2 - b^2$:\n$9x^2 - 4 = (3x - 2)(3x + 2)$\n\nSederhanakan Pecahan (Coret suku sejenis):\n$\\frac{3x^2 - 7x - 6}{9x^2 - 4} = \\frac{(3x + 2)(x - 3)}{(3x - 2)(3x + 2)} = \\frac{x - 3}{3x - 2}$\n\nJawaban: A",
  },
];

// ─── Latihan Soal — 20 soal: PG, PG Kompleks (4 pernyataan), dan PG Benar-Salah (3 pernyataan) ───
// Pola: PG (1,4,7,...) · PGK (2,5,8,...) · PGKBS (3,6,9,...).
const latihanDasar: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Koefisien variabel $x$ dari bentuk aljabar $-x^2 - (m + 1)x + 3m$ adalah ...",
    options: ["A. $-1$", "B. $1$", "C. $m + 1$", "D. $-m - 1$"], jawaban: "D",
    pembahasan: "Suku yang mengandung $x$ adalah $-(m+1)x$. Jadi koefisien $x = -(m+1) = -m-1$ → Jawaban D",
  },
  {
    no: 2, type: "pgk",
    soal: "Pada bentuk aljabar $7x^2 - 5xy - 9y^2 + 8$, perhatikan pernyataan berikut!",
    pernyataan: [
      "Koefisien $x^2$ adalah $7$.",
      "Koefisien $xy$ adalah $5$.",
      "Koefisien $y^2$ dijumlahkan dengan konstanta menghasilkan $-1$.",
      "Konstanta pada bentuk aljabar tersebut adalah $-8$.",
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua pernyataan benar"],
    jawaban: "A", jawabanPGK: [0, 2],
    pembahasan: "(1) Benar, koefisien $x^2=7$. (2) Salah, koefisien $xy=-5$. (3) Benar, $-9+8=-1$. (4) Salah, konstanta adalah $8$. Jadi yang benar (1) dan (3) → Jawaban A",
  },
  {
    no: 3, type: "pgkbs",
    soal: "Sederhanakan bentuk aljabar $4x + 12y - 10z - 8x + 5y - 7z$. Tentukan Benar atau Salah!",
    pernyataan: [
      "Koefisien $x$ pada hasil sederhana adalah $-4$.",
      "Koefisien $y$ pada hasil sederhana adalah $17$.",
      "Hasil sederhananya adalah $-4x + 17y - 17z$.",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Gabungkan suku sejenis: $4x-8x=-4x$, $12y+5y=17y$, dan $-10z-7z=-17z$. Jadi hasilnya $-4x+17y-17z$.",
  },
  {
    no: 4, type: "pg",
    soal: "Bentuk sederhana dari $5ab + 4bc - 3ac - 2ac - 8bc - ab$ adalah ...",
    options: ["A. $4ab - 4bc - 5ac$", "B. $4ab + 2bc - 11ac$", "C. $6ab - 2bc + 5ac$", "D. $6ab + 4bc + 5ac$"], jawaban: "A",
    pembahasan: "$5ab-ab=4ab$, $4bc-8bc=-4bc$, dan $-3ac-2ac=-5ac$. Hasilnya $4ab-4bc-5ac$ → Jawaban A",
  },
  {
    no: 5, type: "pgk",
    soal: "Diberikan bentuk $P=-3p(p^3-2p^2)+2(p^2-3p+6)$. Pernyataan yang benar adalah ...",
    pernyataan: [
      "$-3p(p^3-2p^2)=-3p^4+6p^3$.",
      "$2(p^2-3p+6)=2p^2-6p+12$.",
      "Bentuk sederhana $P=-3p^4+6p^3+2p^2-6p+12$.",
      "Derajat tertinggi dari $P$ adalah $3$.",
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua pernyataan benar"],
    jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "(1), (2), dan (3) benar berdasarkan distributif. (4) salah karena suku tertinggi adalah $-3p^4$, sehingga derajatnya $4$. → Jawaban B",
  },
  {
    no: 6, type: "pgkbs",
    soal: "Hasil pengurangan $3x-4$ dari $2x+5$ adalah $-x+9$. Tentukan Benar atau Salah!",
    pernyataan: [
      "Kalimat tersebut berarti $(2x+5)-(3x-4)$.",
      "Tanda di depan $3x-4$ berubah saat dikurangkan.",
      "Hasilnya adalah $x+1$.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "$(2x+5)-(3x-4)=2x+5-3x+4=-x+9$. Jadi pernyataan (1) dan (2) benar, sedangkan (3) salah.",
  },
  {
    no: 7, type: "pg",
    soal: "Hasil dari $(-8m^2n^3) \\cdot (2k^3n^2)$ adalah ...",
    options: ["A. $-16k^3m^2n^{12}$", "B. $-16k^3m^3n^2$", "C. $16k^3m^2n^{12}$", "D. $-16k^3m^2n^5$"], jawaban: "D",
    pembahasan: "Kalikan koefisien dan jumlahkan pangkat $n$: $(-8)(2)k^3m^2n^{3+2}=-16k^3m^2n^5$ → Jawaban D",
  },
  {
    no: 8, type: "pgk",
    soal: "Perhatikan hasil perkalian $(2x-2)(x+5)$. Pernyataan yang benar adalah ...",
    pernyataan: [
      "Suku pertama hasil perkalian adalah $2x^2$.",
      "Suku silang menghasilkan $10x-2x=8x$.",
      "Suku konstanta hasil perkalian adalah $-10$.",
      "Hasil akhirnya adalah $2x^2+12x-10$.",
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua pernyataan benar"],
    jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "(1), (2), dan (3) benar. Hasil perkalian adalah $2x^2+8x-10$, sehingga (4) salah → Jawaban B",
  },
  {
    no: 9, type: "pgkbs",
    soal: "Perhatikan bentuk $\u005cleft(2a-\u005cfrac{1}{a}\u005cright)^2$, dengan $a\\neq0$. Tentukan Benar atau Salah!",
    pernyataan: [
      "Suku pertama hasil pengembangan adalah $4a^2$.",
      "Suku tengah hasil pengembangan adalah $-4$.",
      "Hasil akhirnya adalah $4a^2-4+\\frac{1}{a^2}$.",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Gunakan $(u-v)^2=u^2-2uv+v^2$: $4a^2-4+\\frac{1}{a^2}$.",
  },
  {
    no: 10, type: "pg",
    soal: "Hasil dari $(-3x-4y)^2$ adalah ...",
    options: ["A. $-9x^2-24xy-16y^2$", "B. $9x^2-24xy-16y^2$", "C. $-9x^2+24xy-16y^2$", "D. $9x^2+24xy+16y^2$"], jawaban: "D",
    pembahasan: "$(u+v)^2=u^2+2uv+v^2$. Jadi $(-3x-4y)^2=9x^2+24xy+16y^2$ → Jawaban D",
  },
  {
    no: 11, type: "pgk",
    soal: "Perhatikan penyederhanaan $(2x+3)^2-(x-2)^2$. Pernyataan yang benar adalah ...",
    pernyataan: [
      "$(2x+3)^2=4x^2+12x+9$.",
      "$(x-2)^2=x^2-4x+4$.",
      "Hasil pengurangannya adalah $3x^2+16x+5$.",
      "Koefisien $x$ pada hasil akhir adalah $8$.",
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua pernyataan benar"],
    jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "(1) dan (2) adalah pengembangan yang benar. Selisihnya $3x^2+16x+5$, sehingga (3) benar dan (4) salah → Jawaban B",
  },
  {
    no: 12, type: "pgkbs",
    soal: "Perhatikan pemfaktoran $6x^2+3x-18$ dan $4x^2-9$. Tentukan Benar atau Salah!",
    pernyataan: [
      "$6x^2+3x-18=3(2x-3)(x+2)$.",
      "$4x^2-9=(2x-3)(2x+3)$.",
      "Faktor persekutuan kedua bentuk tersebut adalah $2x-3$.",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "$6x^2+3x-18=3(2x^2+x-6)=3(2x-3)(x+2)$ dan $4x^2-9=(2x-3)(2x+3)$. Faktor persekutuannya $2x-3$.",
  },
  {
    no: 13, type: "pg",
    soal: "Pemfaktoran bentuk kuadrat $x^2-3ax+2a^2$ adalah ...",
    options: ["A. $(x-2a)(x+a)$", "B. $(x+2a)(x+a)$", "C. $(x-2a)(x-a)$", "D. $(x+2a)(x-a)$"], jawaban: "C",
    pembahasan: "Dua suku yang jumlahnya $-3a$ dan hasil kalinya $2a^2$ adalah $-2a$ dan $-a$. Jadi faktornya $(x-2a)(x-a)$ → Jawaban C",
  },
  {
    no: 14, type: "pgk",
    soal: "Perhatikan pemfaktoran berikut. Pernyataan yang benar adalah ...",
    pernyataan: [
      "$4x^2-9=(2x-3)(2x+3)$.",
      "$2x^2+x-3=(2x-3)(x+1)$.",
      "$x^2+x-6=(x+3)(x-2)$.",
      "$x^2+4x-5=(x-5)(x+1)$.",
    ],
    options: ["A. (1) dan (2) saja", "B. (2) dan (3) saja", "C. (1) dan (3) saja", "D. (2) dan (4) saja"],
    jawaban: "C", jawabanPGK: [0, 2],
    pembahasan: "(1) benar dan (3) benar. (2) menghasilkan $2x^2-x-3$, sedangkan (4) menghasilkan $x^2-4x-5$. Jadi jawaban C.",
  },
  {
    no: 15, type: "pgkbs",
    soal: "Tentukan Benar atau Salah untuk pemfaktoran berikut!",
    pernyataan: [
      "$x^2-2x=x(x-2)$.",
      "$x^2-9=(x+3)(x-3)$.",
      "$x^2+3x-10=(x+5)(x-2)$.",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Ketiga pemfaktoran benar jika dikalikan kembali: $x(x-2)=x^2-2x$, selisih kuadrat menghasilkan $x^2-9$, dan $(x+5)(x-2)=x^2+3x-10$.",
  },
  {
    no: 16, type: "pg",
    soal: "Bentuk paling sederhana dari $\\frac{2x^2+5x-12}{4x^2-9}$ adalah ...",
    options: ["A. $\\frac{x+4}{2x-3}$", "B. $\\frac{x+4}{2x+3}$", "C. $\\frac{x-4}{2x-3}$", "D. $\\frac{x-4}{2x+3}$"], jawaban: "B",
    pembahasan: "$2x^2+5x-12=(2x-3)(x+4)$ dan $4x^2-9=(2x-3)(2x+3)$. Setelah dicoret, hasilnya $\\frac{x+4}{2x+3}$ → Jawaban B",
  },
  {
    no: 17, type: "pgk",
    soal: "Perhatikan penjumlahan pecahan aljabar $\\frac{3}{2x}+\\frac{4}{x+2}$. Pernyataan yang benar adalah ...",
    pernyataan: [
      "KPK penyebutnya adalah $2x(x+2)$.",
      "Pembilang pecahan pertama setelah disamakan adalah $3(x+2)$.",
      "Pembilang pecahan kedua setelah disamakan adalah $4(2x)$.",
      "Hasilnya adalah $\\frac{11x+6}{2x(x+2)}$.",
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua pernyataan benar"],
    jawaban: "D", jawabanPGK: [0, 1, 2, 3],
    pembahasan: "Semua pernyataan benar. Pembilang gabungan $3(x+2)+4(2x)=11x+6$, sehingga jawaban D.",
  },
  {
    no: 18, type: "pgkbs",
    soal: "Perhatikan pengurangan $\\frac{3}{a-b}-\\frac{2}{a+b}$, dengan $a\\neq b$ dan $a\\neq-b$. Tentukan Benar atau Salah!",
    pernyataan: [
      "Penyebut bersama dapat ditulis $(a-b)(a+b)=a^2-b^2$.",
      "Pembilang setelah disamakan adalah $3(a+b)-2(a-b)$.",
      "Hasil akhirnya adalah $\\frac{a+5b}{a^2-b^2}$.",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "$3(a+b)-2(a-b)=3a+3b-2a+2b=a+5b$. Jadi hasilnya $\\frac{a+5b}{a^2-b^2}$.",
  },
  {
    no: 19, type: "pg",
    soal: "Diketahui keliling sebuah persegi panjang adalah 48 cm. Jika lebarnya 6 cm kurang dari panjangnya, luas persegi panjang tersebut adalah ...",
    options: ["A. $135$ cm$^2$", "B. $225$ cm$^2$", "C. $567$ cm$^2$", "D. $616$ cm$^2$"], jawaban: "A",
    pembahasan: "Misalkan panjang $p$ dan lebar $p-6$. $2(p+p-6)=48$ memberi $p=15$ dan lebar $9$. Luas $=15\\times9=135$ cm² → Jawaban A",
  },
  {
    no: 20, type: "pgk",
    soal: "Kebun Pak Ogah berbentuk persegi panjang. Panjang diagonalnya dinyatakan dengan $(5x-15)$ meter dan $(3x+5)$ meter. Pernyataan yang benar adalah ...",
    pernyataan: [
      "Karena keduanya menyatakan diagonal yang sama, $5x-15=3x+5$.",
      "Nilai $x$ adalah $10$.",
      "Panjang diagonal kebun adalah $35$ meter.",
      "Panjang diagonal kebun adalah $50$ meter.",
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua pernyataan benar"],
    jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "$5x-15=3x+5$ memberi $2x=20$, sehingga $x=10$. Diagonal $=5(10)-15=35$ meter. Jadi (1), (2), dan (3) benar → Jawaban B",
  },
];

const AljabarPage = () => (
  <TKAPemantapanLayout
    title="ALJABAR"
    materiSections={materiSections}
    contohSoal={contohSoal}
    latihanDasar={latihanDasar}
  />
);

export default AljabarPage;
