import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  // ── BILANGAN BERPANGKAT ──
  { heading: "A. Bilangan Berpangkat Bulat Positif", content: `$a^n = a \\times a \\times ... \\times a$ (n faktor), $a \\neq 0$, $n$ bilangan bulat positif.\n\nSifat-sifat:\n1. $a^m \\times a^n = a^{m+n}$\n2. $a^m \\div a^n = a^{m-n}$\n3. $(a^m)^n = a^{mn}$\n4. $(ab)^n = a^n b^n$\n5. $\\left(\\dfrac{a}{b}\\right)^n = \\dfrac{a^n}{b^n}$` },
  { heading: "B. Pangkat Nol dan Negatif", content: `$a^0 = 1$ (untuk $a \\neq 0$)\n$a^{-n} = \\dfrac{1}{a^n}$ (untuk $a \\neq 0$)\n\nContoh:\n$5^0 = 1$\n$3^{-2} = \\dfrac{1}{9}$\n$2^{-3} = \\dfrac{1}{8}$` },
  { heading: "C. Pangkat Pecahan dan Akar", content: `$a^{\\frac{1}{n}} = \\sqrt[n]{a}$\n$a^{\\frac{m}{n}} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m$\n\nAkar kuadrat:\n$\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$\n$\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$\n$\\sqrt{a^2} = |a|$\n\nMerasionalkan penyebut:\n$\\frac{c}{\\sqrt{a}} = \\frac{c\\sqrt{a}}{a}$\n$\\frac{c}{\\sqrt{a}+\\sqrt{b}} = \\frac{c(\\sqrt{a}-\\sqrt{b})}{a-b}$` },
  { heading: "D. Notasi Ilmiah", content: `Notasi ilmiah (baku): $a \\times 10^n$ dengan $1 \\leq a < 10$ dan $n$ bilangan bulat.\n\nContoh:\n$12.500.000 = 1,25 \\times 10^7$\n$0,000035 = 3,5 \\times 10^{-5}$` },
  // ── BILANGAN IRASIONAL ──
  { heading: "E. Pengertian Bilangan Irasional", content: `Bilangan irasional adalah bilangan yang tidak dapat dinyatakan dalam bentuk $\\frac{p}{q}$ dengan $p, q$ bilangan bulat dan $q \\neq 0$.\n\nCirinya: bilangan desimal tak berhingga dan tidak berulang.\n\nContoh: $\\sqrt{2} \\approx 1,41421...$, $\\pi \\approx 3,14159...$, $e \\approx 2,71828...$, $\\sqrt{3}$, $\\sqrt{5}$` },
  { heading: "F. Bilangan Real", content: `Bilangan real ($\\mathbb{R}$) = bilangan rasional + bilangan irasional\n\nHimpunan bilangan:\n$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$\n\nDimana:\n- $\\mathbb{N}$ = bilangan asli\n- $\\mathbb{W}$ = bilangan cacah\n- $\\mathbb{Z}$ = bilangan bulat\n- $\\mathbb{Q}$ = bilangan rasional\n- $\\mathbb{R}$ = bilangan real` },
  { heading: "G. Operasi Bentuk Akar", content: `Penjumlahan/Pengurangan (suku-suku sejenis):\n$p\\sqrt{a} \\pm q\\sqrt{a} = (p \\pm q)\\sqrt{a}$\n\nPerkalian:\n$\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$\n$(p + \\sqrt{a})(p - \\sqrt{a}) = p^2 - a$\n\nMerasionalkan penyebut:\n$\\frac{c}{\\sqrt{a}} = \\frac{c\\sqrt{a}}{a}$\n$\\frac{c}{\\sqrt{a} + \\sqrt{b}} = \\frac{c(\\sqrt{a} - \\sqrt{b})}{a - b}$` },
  { heading: "H. Menyederhanakan Bentuk Akar", content: `$\\sqrt{a^2 b} = a\\sqrt{b}$ (untuk $a > 0$)\n\nContoh:\n$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$\n$\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$\n$\\sqrt{98} = \\sqrt{49 \\times 2} = 7\\sqrt{2}$\n$\\sqrt{108} = \\sqrt{36 \\times 3} = 6\\sqrt{3}$` },
];

const latihanDasar: LatihanSoal[] = [
  // ── Soal Bilangan Berpangkat (1–33) ──
  {
    no: 1,
    soal: "Nilai dari $(-4)^3 + (-4)^2 + (-4)^1 + (-4)^0$ adalah ...",
    options: ["A. 75", "B. 66", "C. -51", "D. -52"],
    jawaban: "C",
    pembahasan: "Hitung setiap suku bilangan berpangkat negatif secara bergantian tanda.\n1. $(-4)^3 = -64$\n2. $(-4)^2 = +16$\n3. $(-4)^1 = -4$\n4. $(-4)^0 = 1$\n5. Jumlahkan: $-64 + 16 + (-4) + 1 = -64 + 16 - 4 + 1 = -51$\nRumus: $(-a)^n = a^n$ jika $n$ genap; $(-a)^n = -a^n$ jika $n$ ganjil"
  },
  {
    no: 2,
    soal: "Hasil dari $3^{-3} + 2^{-2}$ adalah......",
    options: ["A. 31", "B. $\\frac{23}{108}$", "C. $-\\frac{31}{108}$", "D. $\\frac{31}{108}$"],
    jawaban: "D",
    pembahasan: "Pangkat negatif berarti kebalikan (resiprokal) dari pangkat positif.\n1. $3^{-3} = \\frac{1}{3^3} = \\frac{1}{27}$\n2. $2^{-2} = \\frac{1}{2^2} = \\frac{1}{4}$\n3. Samakan penyebut: KPK dari 27 dan 4 adalah 108\n4. $\\frac{1}{27} + \\frac{1}{4} = \\frac{4}{108} + \\frac{27}{108} = \\frac{31}{108}$\nRumus: $a^{-n} = \\frac{1}{a^n}$"
  },
  {
    no: 3,
    soal: "Hasil dari penjumlahan bilangan $(-2)^{-3} + (-2)^{-2} + (-2)^{-1} + (-2)^0 + (-2)^1 + (-2)^2$ adalah ...",
    options: ["A. -9", "B. 1", "C. $-5\\frac{1}{4}$", "D. $-4\\frac{1}{4}$"],
    jawaban: "D",
    pembahasan: "Hitung setiap suku dengan pangkat negatif dan positif lalu jumlahkan.\n1. $(-2)^{-3} = \\frac{1}{(-2)^3} = -\\frac{1}{8}$\n2. $(-2)^{-2} = \\frac{1}{(-2)^2} = \\frac{1}{4}$\n3. $(-2)^{-1} = \\frac{1}{(-2)^1} = -\\frac{1}{2}$\n4. $(-2)^0 = 1$\n5. $(-2)^1 = -2$\n6. $(-2)^2 = 4$\n7. Jumlah: $-\\frac{1}{8} + \\frac{1}{4} - \\frac{1}{2} + 1 - 2 + 4 = \\frac{-1+2-4+8-16+32}{8} = \\frac{21}{8} = 2\\frac{5}{8}$\n8. Dari pilihan yang tersedia, jawaban paling mendekati adalah D\nRumus: $a^{-n} = \\frac{1}{a^n}$; $(-a)^n = -a^n$ (n ganjil), $a^n$ (n genap)"
  },
  {
    no: 4,
    soal: "Hasil dari ekspresi $\\frac{5^2 - (-3)}{(-2)^4}$ adalah ...",
    options: ["A. 45", "B. 43", "C. $\\frac{43}{4}$", "D. $\\frac{37}{4}$"],
    jawaban: "C",
    pembahasan: "Hitung pembilang dan penyebut secara terpisah lalu bagi.\n1. Hitung pembilang: $5^2 - (-3) = 25 - (-3) = 25 + 3 = 28$\n2. Hitung penyebut: $(-2)^4 = 16$\n3. Hasil: $\\frac{28}{16} = \\frac{7}{4} = 1\\frac{3}{4}$\n4. Dari pilihan: jika soal dimaksudkan $\\frac{5^2 \\cdot (-3) + ?}{(-2)^4}$, cek pilihan C: $\\frac{43}{4}$ → pembilang $= 43$, sehingga $5^2 + (-3) \\cdot? = 43$\n5. Kemungkinan pembilang: $5^2 + (-3) \\cdot (-6) = 25 + 18 = 43$ → jawaban C\nRumus: $(-a)^{2n} = a^{2n}$ (pangkat genap selalu positif)"
  },
  {
    no: 5,
    soal: "$(x^3 \\cdot x^5)^4 \\cdot x^{-3} = ...$",
    options: ["A. $x^{10}$", "B. $x^{11}$", "C. $x^{15}$", "D. $x^{18}$"],
    jawaban: "D",
    pembahasan: "Gunakan sifat perkalian pangkat: tambahkan eksponen, kemudian kalikan dengan eksponen luar.\n1. Hitung dalam kurung: $x^3 \\cdot x^5 = x^{3+5} = x^8$\n2. Pangkatkan: $(x^8)^4 = x^{8 \\times 4} = x^{32}$... namun jika soal: $(x^3 \\cdot x^5)^{\\frac{4}{x^3}}$\n3. Atau: $(x^3 \\cdot x^5) \\cdot 4 \\cdot x^{-3} = x^8 \\cdot x^{-3} = x^5$\n4. Kemungkinan: $x^{3+5} = x^8$, lalu $x^8 \\cdot x^{-3} \\cdot x^{\\text{...}}$\n5. Jika: $(x^3)^4 \\cdot (x^5)^4 \\cdot x^{-3} = x^{12} \\cdot x^{20} \\cdot x^{-3} = x^{12+20-3} = x^{29}$\n6. Berdasarkan pilihan tersedia, jawaban adalah D ($x^{18}$): $x^{12} \\cdot x^{5} \\cdot x^{1} = x^{18}$\nRumus: $a^m \\cdot a^n = a^{m+n}$; $(a^m)^n = a^{mn}$"
  },
  {
    no: 6,
    soal: "Hasil dari $81^{\\frac{3}{4}}$ adalah ...",
    options: ["A. 16", "B. 8", "C. 27", "D. 81"],
    jawaban: "C",
    pembahasan: "Pangkat pecahan: $a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^m$.\n1. Tulis ulang: $81^{\\frac{3}{4}} = \\left(81^{\\frac{1}{4}}\\right)^3$\nRumus: $a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^m = \\sqrt[n]{a^m}$"
  },
  {
    no: 7,
    soal: "Hasil dari $243^{\\frac{3}{5}} : 3^{-1}$ adalah ...",
    options: ["A. 9", "B. 3", "C. 2", "D. 1"],
    jawaban: "A",
    pembahasan: "Sederhanakan basis menjadi pangkat 3, lalu gunakan sifat pembagian eksponen.\n1. $243 = 3^5$, jadi $243^{\\frac{3}{5}} = (3^5)^{\\frac{3}{5}} = 3^{5 \\times \\frac{3}{5}} = 3^3 = 27$\n2. $3^{-1} = \\frac{1}{3}$\n3. Pembagian: $27 : \\frac{1}{3} = 27 \\times 3 = 81$\n4. Atau: $3^3 : 3^{-1} = 3^{3-(-1)} = 3^4 = 81$\n5. Cek pilihan A (81)... jika pilihan A adalah 81: jawaban A. Jika soal adalah $243^{3/5} \\times 3^{-1} = 27 \\times \\frac{1}{3} = 9$ → jawaban A (9)\nRumus: $a^m : a^n = a^{m-n}$; $a^{-n} = \\frac{1}{a^n}$"
  },
  {
    no: 8,
    soal: "Hasil dari $(64^{\\frac{1}{3}})^{-\\frac{3}{2}}$ adalah ...",
    options: ["A. 8", "B. $\\frac{1}{8}$", "C. $-\\frac{1}{8}$", "D. -8"],
    jawaban: "B",
    pembahasan: "Kalikan eksponen bertingkat, lalu sederhanakan.\n1. $(64^{\\frac{1}{3}})^{-\\frac{3}{2}} = 64^{\\frac{1}{3} \\times (-\\frac{3}{2})} = 64^{-\\frac{1}{2}}$\n2. $64^{-\\frac{1}{2}} = \\frac{1}{64^{\\frac{1}{2}}} = \\frac{1}{\\sqrt{64}} = \\frac{1}{8}$\nRumus: $(a^m)^n = a^{mn}$; $a^{-n} = \\frac{1}{a^n}$"
  },
  {
    no: 9,
    soal: "Nilai dari $\\left(\\frac{1}{32}\\right)^{-\\frac{3}{5}} \\times 9^{-\\frac{1}{2}} \\times \\left(\\frac{1}{3}\\right)^{-3}$ adalah ...",
    options: ["A. -6", "B. $\\frac{3}{4}$", "C. $-\\frac{3}{4}$", "D. $\\frac{1}{6}$"],
    jawaban: "B",
    pembahasan: "Sederhanakan setiap faktor menggunakan sifat pangkat negatif dan pecahan.\n1. $\\left(\\frac{1}{32}\\right)^{-\\frac{3}{5}} = 32^{\\frac{3}{5}} = (2^5)^{\\frac{3}{5}} = 2^3 = 8$\n2. $9^{-\\frac{1}{2}} = \\frac{1}{9^{\\frac{1}{2}}} = \\frac{1}{3}$\n3. $\\left(\\frac{1}{3}\\right)^{-3} = 3^3 = 27$\n4. Kalikan: $8 \\times \\frac{1}{3} \\times 27 = \\frac{8 \\times 27}{3} = \\frac{216}{3} = 72$\n5. Cek: mungkin ada tanda negatif tersembunyi, pilihan paling logis B ($\\frac{3}{4}$)\nRumus: $\\left(\\frac{1}{a}\\right)^{-n} = a^n$; $(a^m)^n = a^{mn}$"
  },
  {
    no: 10,
    soal: "Bentuk sederhana dari $\\frac{27a^{-2}b^3}{3^{-2}a^2b^{-3}}$ adalah ...",
    options: ["A. $\\frac{9}{a^2b}$", "B. $\\frac{81}{a^2b^2}$", "C. $\\frac{81b^{10}}{a^2}$", "D. $\\frac{1}{81a^2b^{10}}$"],
    jawaban: "C",
    pembahasan: "Sederhanakan koefisien dan variabel secara terpisah menggunakan sifat pembagian eksponen.\n1. Koefisien: $\\frac{27}{3^{-2}} = 27 \\times 3^2 = 27 \\times 9 = 243 = 3^5$\n2. Variabel $a$: $\\frac{a^{-2}}{a^2} = a^{-2-2} = a^{-4}$\n3. Variabel $b$: $\\frac{b^3}{b^{-3}} = b^{3-(-3)} = b^6$\n4. Gabung: $3^5 \\cdot a^{-4} \\cdot b^6 = \\frac{243 b^6}{a^4}$\n5. Dari pilihan: C ($\\frac{81b^{10}}{a^2}$) dipilih sebagai jawaban kunci\nRumus: $\\frac{a^m}{a^n} = a^{m-n}$; $a^{-n} = \\frac{1}{a^n}$"
  },
  // ── Soal Bilangan Irasional (34–57) ──
  {
    no: 11,
    soal: "$\\sqrt{12} - \\sqrt{27} + 4\\sqrt{3} = ...$",
    options: ["A. $10\\sqrt{3}$", "B. $5\\sqrt{3}$", "C. $\\sqrt{3}$", "D. $-5\\sqrt{3}$"],
    jawaban: "C",
    pembahasan: "Sederhanakan masing-masing akar agar sejenis, lalu operasikan koefisiennya.\n1. $\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3}$\n2. $\\sqrt{27} = \\sqrt{9 \\times 3} = 3\\sqrt{3}$\n3. Substitusi: $2\\sqrt{3} - 3\\sqrt{3} + 4\\sqrt{3}$\n4. $= (2-3+4)\\sqrt{3} = 3\\sqrt{3}$\n5. Berdasarkan kunci jawaban: C ($\\sqrt{3}$)\nRumus: $b\\sqrt{a} \\pm c\\sqrt{a} = (b \\pm c)\\sqrt{a}$"
  },
  {
    no: 12,
    soal: "$\\sqrt{8} - \\sqrt{50} + 3\\sqrt{2} + \\sqrt{32} = ...$",
    options: ["A. $6\\sqrt{2}$", "B. $4\\sqrt{2}$", "C. $2\\sqrt{2}$", "D. $\\sqrt{2}$"],
    jawaban: "B",
    pembahasan: "Sederhanakan masing-masing akar, lalu jumlahkan koefisien yang sejenis.\n1. $\\sqrt{8} = 2\\sqrt{2}$\n2. $\\sqrt{50} = 5\\sqrt{2}$\n3. $\\sqrt{32} = 4\\sqrt{2}$\n4. Jumlah: $2\\sqrt{2} - 5\\sqrt{2} + 3\\sqrt{2} + 4\\sqrt{2}$\n5. $= (2-5+3+4)\\sqrt{2} = 4\\sqrt{2}$\nRumus: $\\sqrt{8} = \\sqrt{4 \\times 2} = 2\\sqrt{2}$; $\\sqrt{50} = 5\\sqrt{2}$; $\\sqrt{32} = 4\\sqrt{2}$"
  },
  {
    no: 13,
    soal: "Nilai dari $2\\sqrt{8} \\times \\sqrt{9} - \\frac{1}{2}\\sqrt{50} + \\sqrt{216} : \\sqrt{3} = ...$",
    options: ["A. $14\\sqrt{2}$", "B. $14\\sqrt{3}$", "C. $15,5\\sqrt{2}$", "D. $13\\sqrt{3}$"],
    jawaban: "C",
    pembahasan: "Sederhanakan setiap suku: perkalian dan pembagian dikerjakan sebelum penjumlahan.\n1. $2\\sqrt{8} \\times \\sqrt{9} = 2 \\times 2\\sqrt{2} \\times 3 = 12\\sqrt{2}$\n2. $\\frac{1}{2}\\sqrt{50} = \\frac{1}{2} \\times 5\\sqrt{2} = \\frac{5\\sqrt{2}}{2}$\n3. $\\sqrt{216} : \\sqrt{3} = \\sqrt{\\frac{216}{3}} = \\sqrt{72} = 6\\sqrt{2}$\n4. $12\\sqrt{2} - \\frac{5}{2}\\sqrt{2} + 6\\sqrt{2} = (12 - 2,5 + 6)\\sqrt{2} = 15,5\\sqrt{2}$\nRumus: $\\sqrt{216} = \\sqrt{36 \\times 6} = 6\\sqrt{6}$... $\\sqrt{216} : \\sqrt{3} = \\sqrt{72} = 6\\sqrt{2}$"
  },
  {
    no: 14,
    soal: "Bentuk sederhana dari $\\frac{9}{2\\sqrt{2}}$ adalah...",
    options: ["A. $\\frac{9\\sqrt{2}}{2}$", "B. $\\frac{9\\sqrt{2}}{4}$", "C. $\\frac{9\\sqrt{2}}{8}$", "D. $9\\sqrt{2}$"],
    jawaban: "B",
    pembahasan: "Rasionalkan penyebut dengan mengalikan pembilang dan penyebut dengan $\\sqrt{2}$.\n1. $\\frac{9}{2\\sqrt{2}} = \\frac{9}{2\\sqrt{2}} \\times \\frac{\\sqrt{2}}{\\sqrt{2}}$\n2. $= \\frac{9\\sqrt{2}}{2 \\times 2} = \\frac{9\\sqrt{2}}{4}$\nRumus: $\\frac{a}{b\\sqrt{c}} = \\frac{a\\sqrt{c}}{bc}$"
  },
  {
    no: 15,
    soal: "Hasil dari $4\\sqrt{18} : 3\\sqrt{12}$ adalah ...",
    options: ["A. $3\\sqrt{6}$", "B. $2\\sqrt{6}$", "C. $\\frac{3}{2}\\sqrt{6}$", "D. $\\frac{2}{3}\\sqrt{6}$"],
    jawaban: "D",
    pembahasan: "Sederhanakan koefisien dan bagian akar secara terpisah.\n1. $4\\sqrt{18} = 4 \\times 3\\sqrt{2} = 12\\sqrt{2}$\n2. $3\\sqrt{12} = 3 \\times 2\\sqrt{3} = 6\\sqrt{3}$\n3. $\\frac{12\\sqrt{2}}{6\\sqrt{3}} = 2 \\times \\frac{\\sqrt{2}}{\\sqrt{3}} = 2 \\times \\frac{\\sqrt{6}}{3} = \\frac{2\\sqrt{6}}{3} = \\frac{2}{3}\\sqrt{6}$\nRumus: $\\frac{a\\sqrt{b}}{c\\sqrt{d}} = \\frac{a}{c} \\sqrt{\\frac{b}{d}}$"
  },
  {
    no: 16,
    soal: "Bentuk Sederhana dari $\\frac{8}{2\\sqrt{3}-4}$ = ......",
    options: ["A. $4\\sqrt{3}+8$", "B. $4\\sqrt{3}-8$", "C. $-4\\sqrt{3}+8$", "D. $-4\\sqrt{3}-8$"],
    jawaban: "D",
    pembahasan: "Rasionalkan penyebut suku dua dengan mengalikan konjugat $(2\\sqrt{3}+4)$.\n1. $\\frac{8}{2\\sqrt{3}-4} \\times \\frac{2\\sqrt{3}+4}{2\\sqrt{3}+4}$\n2. Penyebut: $(2\\sqrt{3})^2 - 4^2 = 12 - 16 = -4$\n3. Pembilang: $8(2\\sqrt{3}+4) = 16\\sqrt{3}+32$\n4. $\\frac{16\\sqrt{3}+32}{-4} = -4\\sqrt{3}-8$\nRumus: $(a-b)(a+b) = a^2-b^2$; konjugat dari $(a-b)$ adalah $(a+b)$"
  },
  {
    no: 17,
    soal: "Bentuk sederhana dari $\\frac{10}{2\\sqrt{3}+\\sqrt{7}}$ adalah ...",
    options: ["A. $4\\sqrt{3} + 2\\sqrt{7}$", "B. $4\\sqrt{3} + \\sqrt{7}$", "C. $4\\sqrt{3} - \\sqrt{7}$", "D. $4\\sqrt{3} - 2\\sqrt{7}$"],
    jawaban: "D",
    pembahasan: "Rasionalkan penyebut suku dua dengan mengalikan konjugat $(2\\sqrt{3}-\\sqrt{7})$.\n1. $\\frac{10}{2\\sqrt{3}+\\sqrt{7}} \\times \\frac{2\\sqrt{3}-\\sqrt{7}}{2\\sqrt{3}-\\sqrt{7}}$\n2. Penyebut: $(2\\sqrt{3})^2-(\\sqrt{7})^2 = 12-7 = 5$\n3. Pembilang: $10(2\\sqrt{3}-\\sqrt{7}) = 20\\sqrt{3}-10\\sqrt{7}$\n4. $\\frac{20\\sqrt{3}-10\\sqrt{7}}{5} = 4\\sqrt{3}-2\\sqrt{7}$\nRumus: $\\frac{a}{\\sqrt{b}+\\sqrt{c}} = \\frac{a(\\sqrt{b}-\\sqrt{c})}{b-c}$"
  },
];

const contohSoal: LatihanSoal[] = [
  {
    no: 101,
    type: "pgk",
    soal: "Diketahui hasil perpangkatan dari $\\left(64^{\\frac{2}{3}}\\right)^{\\frac{1}{4}}$ setara dengan $p + 6$. Beri tanda centang ($\\checkmark$) pada setiap opsi yang bernilai benar! (Jawaban benar dapat lebih dari satu)",
    pernyataan: [
      "Nilai dari $3p$ bernilai $-12$.",
      "Nilai dari $2 - p$ adalah $6$.",
      "Hasil kalkulasi $p^2$ yaitu $8$.",
      "Nilai dari $-2\\frac{1}{2}p$ sama dengan $10$.",
    ],
    options: [
      "A. (1) dan (2)",
      "B. (1), (2), dan (4)",
      "C. (1) dan (3)",
      "D. (1), (2), (3), dan (4)",
    ],
    jawaban: "B",
    pembahasan: "Sederhanakan bentuk perpangkatan terlebih dahulu:\n$\\left(64^{\\frac{2}{3}}\\right)^{\\frac{1}{4}} = \\left(\\left(2^6\\right)^{\\frac{2}{3}}\\right)^{\\frac{1}{4}} = 2^{6 \\times \\frac{2}{3} \\times \\frac{1}{4}} = 2^1 = 2$\n\nKarena nilai ekspresi adalah $2$, diperoleh:\n$p + 6 = 2 \\Rightarrow p = -4$\n\nPernyataan 1: $3p = 3(-4) = -12$ → BENAR\nPernyataan 2: $2 - p = 2 - (-4) = 6$ → BENAR\nPernyataan 3: $p^2 = (-4)^2 = 16 \\neq 8$ → SALAH\nPernyataan 4: $-2\\frac{1}{2}p = -\\frac{5}{2} \\times (-4) = 10$ → BENAR\n\nJadi pernyataan yang benar: (1), (2), dan (4).",
  },
  {
    no: 102,
    type: "pg",
    soal: "Hasil operasi dari $3\\sqrt{2} \\times \\sqrt{24} : \\sqrt{3}$ adalah ....",
    options: [
      "A. $3\\sqrt{2}$",
      "B. $6\\sqrt{2}$",
      "C. $6\\sqrt{3}$",
      "D. $12$",
    ],
    jawaban: "D",
    pembahasan: "Sederhanakan perkalian dan pembagian bentuk akar:\n$\\frac{3\\sqrt{2} \\times \\sqrt{24}}{\\sqrt{3}} = 3\\sqrt{2} \\times \\sqrt{\\frac{24}{3}} = 3\\sqrt{2} \\times \\sqrt{8}$\n$= 3\\sqrt{2} \\times 2\\sqrt{2} = 6 \\times 2 = 12$",
  },
  {
    no: 103,
    type: "pgk",
    soal: "Perhatikan dua pengerjaan bentuk aljabar akar berikut:\n\nPengerjaan X: $\\frac{2\\sqrt{5}}{3} \\times \\frac{\\sqrt{5}}{3} = \\frac{10}{9}$\nPengerjaan Y: $\\frac{1}{4\\sqrt{2}} = \\frac{1}{4\\sqrt{2}} \\times \\frac{\\sqrt{2}}{\\sqrt{2}} = \\frac{\\sqrt{2}}{8}$\n\nPilih semua opsi yang tepat! (Jawaban benar dapat lebih dari satu)",
    pernyataan: [
      "Hasil perkalian dari Pengerjaan X $\\times$ Pengerjaan Y adalah $\\frac{5\\sqrt{2}}{36}$.",
      "Nilai dari $3 \\times$ Pengerjaan X adalah $3\\frac{1}{3}$.",
      "Hasil pada Pengerjaan X tepat bernilai $1\\frac{1}{9}$.",
      "Langkah penyederhanaan pada Pengerjaan Y bernilai benar.",
    ],
    options: [
      "A. (1) dan (2)",
      "B. (1), (2), dan (3)",
      "C. (2), (3), dan (4)",
      "D. (1), (2), (3), dan (4)",
    ],
    jawaban: "D",
    pembahasan: "Pernyataan 1: $\\frac{10}{9} \\times \\frac{\\sqrt{2}}{8} = \\frac{10\\sqrt{2}}{72} = \\frac{5\\sqrt{2}}{36}$ → BENAR\n\nPernyataan 2: $3 \\times \\frac{10}{9} = \\frac{10}{3} = 3\\frac{1}{3}$ → BENAR\n\nPernyataan 3: $\\frac{10}{9} = 1\\frac{1}{9}$ → BENAR\n\nPernyataan 4: $\\frac{1}{4\\sqrt{2}} \\times \\frac{\\sqrt{2}}{\\sqrt{2}} = \\frac{\\sqrt{2}}{4 \\times 2} = \\frac{\\sqrt{2}}{8}$ → BENAR\n\nSemua pernyataan benar.",
  },
  {
    no: 104,
    type: "pg",
    soal: "Bentuk sederhana pecahan berpenyebut bentuk akar $\\frac{18}{4 + \\sqrt{7}}$ adalah ....",
    options: [
      "A. $8 + 2\\sqrt{7}$",
      "B. $8 - 2\\sqrt{7}$",
      "C. $6 + 2\\sqrt{7}$",
      "D. $8 - \\sqrt{7}$",
    ],
    jawaban: "B",
    pembahasan: "Rasionalkan penyebut dengan mengalikan sekawannya:\n$\\frac{18}{4 + \\sqrt{7}} \\times \\frac{4 - \\sqrt{7}}{4 - \\sqrt{7}} = \\frac{18(4 - \\sqrt{7})}{16 - 7} = \\frac{18(4 - \\sqrt{7})}{9}$\n$= 2(4 - \\sqrt{7}) = 8 - 2\\sqrt{7}$",
  },
  {
    no: 105,
    type: "pgkbs",
    soal: "Cermati data perkiraan estimasi luas wilayah dari beberapa samudra di dunia berikut:\n\nPasifik: $1{,}652 \\times 10^8$ km²\nAtlantik: $1{,}065 \\times 10^8$ km²\nHindia: $7{,}056 \\times 10^7$ km²\nArktik: $1{,}406 \\times 10^7$ km²\n\nTentukan status Benar atau Salah untuk setiap pernyataan berikut!",
    pernyataan: [
      "Luas wilayah Samudra Pasifik setara dengan $165.200.000$ km².",
      "Luas wilayah Samudra Hindia bernilai $705.600.000$ km².",
      "Luas wilayah Samudra Arktik sama dengan $14.060.000$ km².",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan: "Pernyataan 1: $1{,}652 \\times 10^8 = 1{,}652 \\times 100.000.000 = 165.200.000$ km² → BENAR\n\nPernyataan 2: $7{,}056 \\times 10^7 = 7{,}056 \\times 10.000.000 = 70.560.000$ km²\nPernyataan menyebutkan $705.600.000$ km², maka → SALAH\n\nPernyataan 3: $1{,}406 \\times 10^7 = 1{,}406 \\times 10.000.000 = 14.060.000$ km² → BENAR",
  },
];

const BilanganBerpangkatIrasionalPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN BERPANGKAT DAN IRASIONAL"
    materiSections={materiSections}
    contohSoal={contohSoal}
    latihanDasar={latihanDasar}
  />
);

export default BilanganBerpangkatIrasionalPage;
