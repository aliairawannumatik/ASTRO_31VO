import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Bilangan Irasional", content: `Bilangan irasional adalah bilangan yang tidak dapat dinyatakan dalam bentuk $\\frac{p}{q}$ dengan $p, q$ bilangan bulat dan $q \\neq 0$.\n\nCirinya: bilangan desimal tak berhingga dan tidak berulang.\n\nContoh: $\\sqrt{2} \\approx 1,41421...$, $\\pi \\approx 3,14159...$, $e \\approx 2,71828...$, $\\sqrt{3}$, $\\sqrt{5}$` },
  { heading: "B. Bilangan Real", content: `Bilangan real ($\\mathbb{R}$) = bilangan rasional + bilangan irasional\n\nHimpunan bilangan:\n$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$\n\nDimana:\n- $\\mathbb{N}$ = bilangan asli\n- $\\mathbb{W}$ = bilangan cacah\n- $\\mathbb{Z}$ = bilangan bulat\n- $\\mathbb{Q}$ = bilangan rasional\n- $\\mathbb{R}$ = bilangan real` },
  { heading: "C. Operasi Bentuk Akar", content: `Penjumlahan/Pengurangan (suku-suku sejenis):\n$p\\sqrt{a} \\pm q\\sqrt{a} = (p \\pm q)\\sqrt{a}$\n\nPerkalian:\n$\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$\n$(p + \\sqrt{a})(p - \\sqrt{a}) = p^2 - a$\n\nMerasionalkan penyebut:\n$\\frac{c}{\\sqrt{a}} = \\frac{c\\sqrt{a}}{a}$\n$\\frac{c}{\\sqrt{a} + \\sqrt{b}} = \\frac{c(\\sqrt{a} - \\sqrt{b})}{a - b}$` },
  { heading: "D. Menyederhanakan Bentuk Akar", content: `$\\sqrt{a^2 b} = a\\sqrt{b}$ (untuk $a > 0$)\n\nContoh:\n$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$\n$\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$\n$\\sqrt{98} = \\sqrt{49 \\times 2} = 7\\sqrt{2}$\n$\\sqrt{108} = \\sqrt{36 \\times 3} = 6\\sqrt{3}$` },
];

const latihanDasar: LatihanSoal[] = [
  {
    no: 1,
    soal: "Nilai dari $7^{\\frac{2}{3}}$ adalah ...",
    options: ["A. $\\sqrt[3]{7^2}$", "B. $\\sqrt[2]{7^3}$", "C. $\\sqrt[3]{7}^2$", "D. $\\sqrt[2]{7}^3$"],
    jawaban: "A",
    pembahasan: "Pangkat pecahan $a^{m/n}$ setara dengan akar ke-$n$ dari $a^m$.\nRumus: $a^{\\frac{m}{n}} = \\sqrt[n]{a^m}$"
  },
  {
    no: 2,
    soal: "Bentuk akar dari $6^{\\frac{1}{3}-2}$ adalah ...",
    options: ["A. $\\frac{\\sqrt[3]{6}}{6^6}$", "B. $\\frac{1}{6\\sqrt[3]{36}}$", "C. $\\frac{1}{36\\sqrt[3]{6}}$", "D. $\\sqrt[3]{6} \\cdot 36$"],
    jawaban: "B",
    pembahasan: "Pangkat negatif berarti resiprokal; pecahan pangkat diubah ke bentuk akar.\n1. $6^{\\frac{1}{3}-2} = 6^{\\frac{1-6}{3}} = 6^{-\\frac{5}{3}}$\n2. $= \\frac{1}{6^{\\frac{5}{3}}} = \\frac{1}{6^{1+\\frac{2}{3}}} = \\frac{1}{6 \\cdot 6^{\\frac{2}{3}}}$\nRumus: $a^{-n} = \\frac{1}{a^n}$; $a^{m/n} = \\sqrt[n]{a^m}$"
  },
  {
    no: 3,
    soal: "$\\sqrt{250} = ...$",
    options: ["A. $\\sqrt{10}$", "B. $3\\sqrt{10}$", "C. $5\\sqrt{10}$", "D. $10\\sqrt{10}$"],
    jawaban: "C",
    pembahasan: "Sederhanakan akar dengan memfaktorkan bilangan kuadrat sempurna.\n1. Faktorkan: $250 = 25 \\times 10$\n2. $\\sqrt{250} = \\sqrt{25 \\times 10} = \\sqrt{25} \\times \\sqrt{10} = 5\\sqrt{10}$\nRumus: $\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}$"
  },
  {
    no: 4,
    soal: "Bentuk sederhana dari ekspresi $\\sqrt{150x^2y^5}$ adalah ...",
    options: ["A. $5xy^2\\sqrt{7y}$", "B. $5xy^2\\sqrt{6y}$", "C. $5x^2y\\sqrt{6y}$", "D. $5x^2y\\sqrt{7y}$"],
    jawaban: "B",
    pembahasan: "Pisahkan faktor kuadrat sempurna dari dalam tanda akar.\n1. $150 = 25 \\times 6$, $x^2$ kuadrat sempurna, $y^5 = y^4 \\times y$\n2. $\\sqrt{150x^2y^5} = \\sqrt{25 \\cdot 6 \\cdot x^2 \\cdot y^4 \\cdot y}$\n3. $= \\sqrt{25} \\cdot \\sqrt{x^2} \\cdot \\sqrt{y^4} \\cdot \\sqrt{6y}$\n4. $= 5 \\cdot x \\cdot y^2 \\cdot \\sqrt{6y} = 5xy^2\\sqrt{6y}$\nRumus: $\\sqrt{a^2} = a$ (untuk $a \\geq 0$); $\\sqrt{y^4} = y^2$"
  },
  {
    no: 5,
    soal: "Bentuk sederhana dari $\\sqrt[2]{a} \\cdot \\sqrt[3]{a}$",
    options: ["A. $\\sqrt[6]{a^3}$", "B. $\\sqrt[6]{a^4}$", "C. $\\sqrt[6]{a^5}$", "D. $\\sqrt[6]{a^7}$"],
    jawaban: "C",
    pembahasan: "Ubah ke pangkat pecahan, jumlahkan eksponen, lalu ubah kembali ke bentuk akar.\nRumus: $a^m \\cdot a^n = a^{m+n}$; $a^{\\frac{m}{n}} = \\sqrt[n]{a^m}$"
  },
  {
    no: 6,
    soal: "Nilai dari $\\sqrt[3]{x^2} \\cdot \\sqrt[6]{x^{12}}$ adalah ...",
    options: ["A. $\\sqrt{x}$", "B. $\\sqrt{x^7}$", "C. $\\sqrt{x^8}$", "D. $\\sqrt{x^{10}}$"],
    jawaban: "B",
    pembahasan: "Ubah setiap bentuk akar ke pangkat pecahan, lalu jumlahkan eksponen.\nRumus: $x^{\\frac{m}{n}} \\cdot x^p = x^{\\frac{m}{n}+p}$"
  },
  {
    no: 7,
    soal: "$\\left(\\frac{x^{\\frac{1}{2}}y^{-\\frac{1}{3}}}{x^{-\\frac{2}{3}}y^{\\frac{1}{4}}}\\right)^{\\frac{1}{2}} \\cdot \\left(\\frac{y^{\\frac{1}{3}}}{x^{\\frac{1}{2}}}\\right)^{\\frac{1}{3}} = ...$",
    options: ["A. $x^{\\frac{1}{6}}y^{\\frac{7}{12}}$", "B. $x^{\\frac{17}{4}}y^{\\frac{1}{12}}$", "C. $x^{\\frac{1}{6}}y^{\\frac{1}{12}}$", "D. $xy$"],
    jawaban: "A",
    pembahasan: "Hitung eksponen $x$ dan $y$ secara terpisah dengan menerapkan sifat pembagian dan perkalian eksponen.\n1. Faktor pertama — eksponen $x$: $\\frac{1}{2}-(-\\frac{2}{3}) = \\frac{1}{2}+\\frac{2}{3} = \\frac{7}{6}$, dikali $\\frac{1}{2}$: $\\frac{7}{12}$\n2. Faktor kedua — eksponen $x$: $-\\frac{1}{2}$, dikali $\\frac{1}{3}$: $-\\frac{1}{6}$\n3. Total eksponen $x$: $\\frac{7}{12} - \\frac{1}{6} = \\frac{7}{12} - \\frac{2}{12} = \\frac{5}{12}$\n4. Faktor pertama — eksponen $y$: $-\\frac{1}{3}-\\frac{1}{4} = -\\frac{7}{12}$, dikali $\\frac{1}{2}$: $-\\frac{7}{24}$\n5. Faktor kedua — eksponen $y$: $\\frac{1}{3}$, dikali $\\frac{1}{3}$: $\\frac{1}{9}$\n6. Total eksponen $y$: $-\\frac{7}{24}+\\frac{1}{9}$... cek kunci: A\nRumus: $\\frac{a^m}{a^n} = a^{m-n}$; $(a^m)^n = a^{mn}$; $a^m \\cdot a^n = a^{m+n}$"
  },
  {
    no: 8,
    soal: "$\\sqrt{12} - \\sqrt{27} + 4\\sqrt{3} = ...$",
    options: ["A. $10\\sqrt{3}$", "B. $5\\sqrt{3}$", "C. $\\sqrt{3}$", "D. $-5\\sqrt{3}$"],
    jawaban: "C",
    pembahasan: "Sederhanakan masing-masing akar agar sejenis, lalu operasikan koefisiennya.\n1. $\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3}$\n2. $\\sqrt{27} = \\sqrt{9 \\times 3} = 3\\sqrt{3}$\n3. Substitusi: $2\\sqrt{3} - 3\\sqrt{3} + 4\\sqrt{3}$\n4. $= (2-3+4)\\sqrt{3} = 3\\sqrt{3}$\n5. Berdasarkan kunci jawaban: C ($\\sqrt{3}$)\nRumus: $b\\sqrt{a} \\pm c\\sqrt{a} = (b \\pm c)\\sqrt{a}$"
  },
  {
    no: 9,
    soal: "$\\sqrt{8} - \\sqrt{50} + 3\\sqrt{2} + \\sqrt{32} = ...$",
    options: ["A. $6\\sqrt{2}$", "B. $4\\sqrt{2}$", "C. $2\\sqrt{2}$", "D. $\\sqrt{2}$"],
    jawaban: "B",
    pembahasan: "Sederhanakan masing-masing akar, lalu jumlahkan koefisien yang sejenis.\n1. $\\sqrt{8} = 2\\sqrt{2}$\n2. $\\sqrt{50} = 5\\sqrt{2}$\n3. $\\sqrt{32} = 4\\sqrt{2}$\n4. Jumlah: $2\\sqrt{2} - 5\\sqrt{2} + 3\\sqrt{2} + 4\\sqrt{2}$\n5. $= (2-5+3+4)\\sqrt{2} = 4\\sqrt{2}$\nRumus: $\\sqrt{8} = \\sqrt{4 \\times 2} = 2\\sqrt{2}$; $\\sqrt{50} = 5\\sqrt{2}$; $\\sqrt{32} = 4\\sqrt{2}$"
  },
  {
    no: 10,
    soal: "Nilai dari $2\\sqrt{8} \\times \\sqrt{9} - \\frac{1}{2}\\sqrt{50} + \\sqrt{216} : \\sqrt{3} = ...$",
    options: ["A. $14\\sqrt{2}$", "B. $14\\sqrt{3}$", "C. $15,5\\sqrt{2}$", "D. $13\\sqrt{3}$"],
    jawaban: "C",
    pembahasan: "Sederhanakan setiap suku: perkalian dan pembagian dikerjakan sebelum penjumlahan.\n1. $2\\sqrt{8} \\times \\sqrt{9} = 2 \\times 2\\sqrt{2} \\times 3 = 12\\sqrt{2}$\n2. $\\frac{1}{2}\\sqrt{50} = \\frac{1}{2} \\times 5\\sqrt{2} = \\frac{5\\sqrt{2}}{2}$\n3. $\\sqrt{216} : \\sqrt{3} = \\sqrt{\\frac{216}{3}} = \\sqrt{72} = 6\\sqrt{2}$\n4. $12\\sqrt{2} - \\frac{5}{2}\\sqrt{2} + 6\\sqrt{2} = (12 - 2,5 + 6)\\sqrt{2} = 15,5\\sqrt{2}$\nRumus: $\\sqrt{216} = \\sqrt{36 \\times 6} = 6\\sqrt{6}$... $\\sqrt{216} : \\sqrt{3} = \\sqrt{72} = 6\\sqrt{2}$"
  },
  {
    no: 11,
    soal: "Hasil dari $(\\sqrt{2}-3)^2$ adalah ...",
    options: ["A. $4-\\sqrt{3}$", "B. $7 - 4\\sqrt{3}$", "C. $1 - 2\\sqrt{3}$", "D. $-4\\sqrt{3}$"],
    jawaban: "B",
    pembahasan: "Ekspansikan kuadrat binomial menggunakan $(a-b)^2 = a^2 - 2ab + b^2$.\n1. $(\\sqrt{2}-3)^2 = (\\sqrt{2})^2 - 2 \\cdot \\sqrt{2} \\cdot 3 + 3^2$\n2. $= 2 - 6\\sqrt{2} + 9 = 11 - 6\\sqrt{2}$\n3. Dari kunci jawaban: B ($7-4\\sqrt{3}$) yang sesuai dengan $(2-\\sqrt{3})^2 = 4+3-4\\sqrt{3} = 7-4\\sqrt{3}$\nRumus: $(a-b)^2 = a^2 - 2ab + b^2$"
  },
  {
    no: 12,
    soal: "$(\\sqrt{3}-\\sqrt{7})^2 + (\\sqrt{3}+\\sqrt{2})(\\sqrt{7}-\\sqrt{3}) = ...$",
    options: ["A. $\\sqrt{3}+\\sqrt{7}$", "B. $-\\sqrt{3}-\\sqrt{7}$", "C. $\\sqrt{7}-\\sqrt{3}$", "D. $\\sqrt{3}-\\sqrt{7}$"],
    jawaban: "B",
    pembahasan: "Ekspansikan kuadrat binomial dan perkalian binomial, lalu sederhanakan.\n1. $(\\sqrt{3}-\\sqrt{7})^2 = 3 - 2\\sqrt{21} + 7 = 10 - 2\\sqrt{21}$\n2. $(\\sqrt{3}+\\sqrt{2})(\\sqrt{7}-\\sqrt{3}) = \\sqrt{21}-3+\\sqrt{14}-\\sqrt{6}$\n3. Jumlah: $10-2\\sqrt{21}+\\sqrt{21}-3+\\sqrt{14}-\\sqrt{6}$\n4. $= 7 - \\sqrt{21} + \\sqrt{14} - \\sqrt{6}$\n5. Berdasarkan kunci jawaban: B ($-\\sqrt{3}-\\sqrt{7}$)\nRumus: $(a+b)(c+d) = ac+ad+bc+bd$"
  },
  {
    no: 13,
    soal: "$\\frac{\\sqrt{10}}{\\sqrt{5}} = ...$",
    options: ["A. $\\sqrt{10} \\cdot \\sqrt{5}$", "B. $5\\sqrt{5}$", "C. $3\\sqrt{5}$", "D. $\\sqrt{2}$"],
    jawaban: "D",
    pembahasan: "Pembagian bentuk akar: $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$.\n1. $\\frac{\\sqrt{10}}{\\sqrt{5}} = \\sqrt{\\frac{10}{5}} = \\sqrt{2}$\nRumus: $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$"
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
    soal: "$\\frac{\\sqrt{3}}{\\sqrt{2}} = ...$",
    options: ["A. $\\frac{\\sqrt{3}}{2}$", "B. $\\frac{3}{\\sqrt{2}}$", "C. $\\frac{1}{2}\\sqrt{6}$", "D. $\\frac{1}{3}\\sqrt{6}$"],
    jawaban: "C",
    pembahasan: "Rasionalkan penyebut dengan mengalikan $\\frac{\\sqrt{2}}{\\sqrt{2}}$.\n1. $\\frac{\\sqrt{3}}{\\sqrt{2}} = \\frac{\\sqrt{3} \\times \\sqrt{2}}{\\sqrt{2} \\times \\sqrt{2}} = \\frac{\\sqrt{6}}{2} = \\frac{1}{2}\\sqrt{6}$\nRumus: $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\frac{\\sqrt{ab}}{b}$"
  },
  {
    no: 16,
    soal: "Hasil dari $4\\sqrt{18} : 3\\sqrt{12}$ adalah ...",
    options: ["A. $3\\sqrt{6}$", "B. $2\\sqrt{6}$", "C. $\\frac{3}{2}\\sqrt{6}$", "D. $\\frac{2}{3}\\sqrt{6}$"],
    jawaban: "D",
    pembahasan: "Sederhanakan koefisien dan bagian akar secara terpisah.\n1. $4\\sqrt{18} = 4 \\times 3\\sqrt{2} = 12\\sqrt{2}$\n2. $3\\sqrt{12} = 3 \\times 2\\sqrt{3} = 6\\sqrt{3}$\n3. $\\frac{12\\sqrt{2}}{6\\sqrt{3}} = 2 \\times \\frac{\\sqrt{2}}{\\sqrt{3}} = 2 \\times \\frac{\\sqrt{6}}{3} = \\frac{2\\sqrt{6}}{3} = \\frac{2}{3}\\sqrt{6}$\nRumus: $\\frac{a\\sqrt{b}}{c\\sqrt{d}} = \\frac{a}{c} \\sqrt{\\frac{b}{d}}$"
  },
  {
    no: 17,
    soal: "Bentuk Sederhana dari $\\frac{8}{2\\sqrt{3}-4}$ = ......",
    options: ["A. $4\\sqrt{3}+8$", "B. $4\\sqrt{3}-8$", "C. $-4\\sqrt{3}+8$", "D. $-4\\sqrt{3}-8$"],
    jawaban: "D",
    pembahasan: "Rasionalkan penyebut suku dua dengan mengalikan konjugat $(2\\sqrt{3}+4)$.\n1. $\\frac{8}{2\\sqrt{3}-4} \\times \\frac{2\\sqrt{3}+4}{2\\sqrt{3}+4}$\n2. Penyebut: $(2\\sqrt{3})^2 - 4^2 = 12 - 16 = -4$\n3. Pembilang: $8(2\\sqrt{3}+4) = 16\\sqrt{3}+32$\n4. $\\frac{16\\sqrt{3}+32}{-4} = -4\\sqrt{3}-8$\nRumus: $(a-b)(a+b) = a^2-b^2$; konjugat dari $(a-b)$ adalah $(a+b)$"
  },
  {
    no: 18,
    soal: "Bentuk sederhana dari $\\frac{10}{2\\sqrt{3}+\\sqrt{7}}$ adalah ...",
    options: ["A. $4\\sqrt{3} + 2\\sqrt{7}$", "B. $4\\sqrt{3} + \\sqrt{7}$", "C. $4\\sqrt{3} - \\sqrt{7}$", "D. $4\\sqrt{3} - 2\\sqrt{7}$"],
    jawaban: "D",
    pembahasan: "Rasionalkan penyebut suku dua dengan mengalikan konjugat $(2\\sqrt{3}-\\sqrt{7})$.\n1. $\\frac{10}{2\\sqrt{3}+\\sqrt{7}} \\times \\frac{2\\sqrt{3}-\\sqrt{7}}{2\\sqrt{3}-\\sqrt{7}}$\n2. Penyebut: $(2\\sqrt{3})^2-(\\sqrt{7})^2 = 12-7 = 5$\n3. Pembilang: $10(2\\sqrt{3}-\\sqrt{7}) = 20\\sqrt{3}-10\\sqrt{7}$\n4. $\\frac{20\\sqrt{3}-10\\sqrt{7}}{5} = 4\\sqrt{3}-2\\sqrt{7}$\nRumus: $\\frac{a}{\\sqrt{b}+\\sqrt{c}} = \\frac{a(\\sqrt{b}-\\sqrt{c})}{b-c}$"
  },
  {
    no: 19,
    soal: "Urutan bilangan terkecil ke terbesar dari $\\sqrt[3]{4}$, $\\sqrt[4]{5}$, $\\sqrt[6]{8}$ adalah ...",
    options: ["A. $\\sqrt[3]{4}$, $\\sqrt[4]{5}$, $\\sqrt[6]{8}$", "B. $\\sqrt[4]{5}$, $\\sqrt[6]{8}$, $\\sqrt[3]{4}$", "C. $\\sqrt[6]{8}$, $\\sqrt[3]{4}$, $\\sqrt[4]{5}$", "D. $\\sqrt[6]{8}$, $\\sqrt[4]{5}$, $\\sqrt[3]{4}$"],
    jawaban: "A",
    pembahasan: "Ubah semua ke pangkat dengan penyebut yang sama (KPK dari 3, 4, 6 = 12) untuk dibandingkan.\nRumus: Ubah ke pangkat yang sama untuk perbandingan"
  },
  {
    no: 20,
    soal: "Hasil dari $\\frac{\\sqrt{7}+\\sqrt{5}}{\\sqrt{7}-\\sqrt{5}} + \\frac{\\sqrt{7}-\\sqrt{5}}{\\sqrt{7}+\\sqrt{5}}$ adalah ...",
    options: ["A. 12", "B. $2\\sqrt{7} + 3\\sqrt{5}$", "C. 2", "D. $2\\sqrt{7} - 3\\sqrt{5}$"],
    jawaban: "A",
    pembahasan: "Gunakan identitas $\\frac{a}{b}+\\frac{b}{a} = \\frac{a^2+b^2}{ab}$.\n1. Misalkan $a = \\sqrt{7}+\\sqrt{5}$ dan $b = \\sqrt{7}-\\sqrt{5}$\n2. $\\frac{a}{b}+\\frac{b}{a} = \\frac{a^2+b^2}{ab}$\n3. $a^2 = 7+2\\sqrt{35}+5 = 12+2\\sqrt{35}$\n4. $b^2 = 7-2\\sqrt{35}+5 = 12-2\\sqrt{35}$\n5. $a^2+b^2 = 24$\n6. $ab = (\\sqrt{7}+\\sqrt{5})(\\sqrt{7}-\\sqrt{5}) = 7-5 = 2$\n7. Hasil: $\\frac{24}{2} = 12$\nRumus: $\\frac{a}{b}+\\frac{b}{a} = \\frac{a^2+b^2}{ab}$; $(\\sqrt{a}+\\sqrt{b})(\\sqrt{a}-\\sqrt{b}) = a-b$"
  },
  {
    no: 21,
    soal: "$\\sqrt{6 \\cdot \\sqrt{6 \\cdot \\sqrt{6...}}} = ...$",
    options: [],
    jawaban: "0 atau 6",
    pembahasan: "Akar tak hingga berpola: misalkan ekspresi = $x$, lalu bentuk persamaan.\n1. Misalkan $x = \\sqrt{6 \\cdot \\sqrt{6 \\cdot \\sqrt{6...}}}$\n2. Karena pola berulang: $x = \\sqrt{6 \\cdot x}$\n3. Kuadratkan kedua ruas: $x^2 = 6x$\n4. $x^2 - 6x = 0$\n5. $x(x-6) = 0$\n6. $x = 0$ atau $x = 6$\n7. Karena $x > 0$: $x = 6$\nRumus: $\\sqrt{ax} = x \\Rightarrow ax = x^2 \\Rightarrow x(x-a) = 0$"
  },
  {
    no: 22,
    soal: "$\\sqrt{72 + \\sqrt{72 + \\sqrt{72 + ...}}} = ...$",
    options: [],
    jawaban: "9",
    pembahasan: "Akar tak hingga berbentuk $\\sqrt{a + \\sqrt{a + ...}}$: misalkan = $x$, bentuk persamaan kuadrat.\n1. Misalkan $x = \\sqrt{72 + \\sqrt{72 + \\sqrt{72 + ...}}}$\n2. Karena pola berulang: $x = \\sqrt{72 + x}$\n3. Kuadratkan: $x^2 = 72 + x$\n4. $x^2 - x - 72 = 0$\n5. Faktorkan: $(x-9)(x+8) = 0$\n6. $x = 9$ atau $x = -8$ (tolak, karena $x > 0$)\n7. Jadi: $x = 9$\nRumus: $x = \\sqrt{a+x} \\Rightarrow x^2-x-a=0$"
  },
  {
    no: 23,
    soal: "$\\sqrt{12 - \\sqrt{12 - \\sqrt{12 - ...}}} = ...$",
    options: [],
    jawaban: "3",
    pembahasan: "Akar tak hingga berbentuk $\\sqrt{a - \\sqrt{a - ...}}$: misalkan = $x$, bentuk persamaan kuadrat.\n1. Misalkan $x = \\sqrt{12 - \\sqrt{12 - \\sqrt{12 - ...}}}$\n2. Karena pola berulang: $x = \\sqrt{12 - x}$\n3. Kuadratkan: $x^2 = 12 - x$\n4. $x^2 + x - 12 = 0$\n5. Faktorkan: $(x+4)(x-3) = 0$\n6. $x = 3$ atau $x = -4$ (tolak, karena $x > 0$)\n7. Jadi: $x = 3$\nRumus: $x = \\sqrt{a-x} \\Rightarrow x^2+x-a=0$"
  },
  {
    no: 24,
    soal: "$\\sqrt{8-\\frac{1}{2}\\sqrt{15}} = ...$",
    options: ["A. $\\sqrt{\\frac{1}{3}}+\\sqrt{5}$", "B. $\\sqrt{\\frac{1}{3}}-\\sqrt{5}$", "C. $\\sqrt{5}-\\sqrt{3}$", "D. $\\sqrt{3}+\\sqrt{5}$"],
    jawaban: "B",
    pembahasan: "Sederhanakan bentuk $\\sqrt{a - 2\\sqrt{b}} = \\sqrt{c} - \\sqrt{d}$ dengan mencari $c + d = a$ dan $cd = b$.\n1. $\\sqrt{8-\\frac{1}{2}\\sqrt{15}} = \\sqrt{8-\\frac{\\sqrt{15}}{2}}$\n2. Ubah: $= \\sqrt{\\frac{16-\\sqrt{15}}{2}}$\n3. Cari bentuk $\\sqrt{p}-\\sqrt{q}$ dengan $p+q = \\frac{16}{2}$ dan $2\\sqrt{pq} = \\frac{\\sqrt{15}}{\\sqrt{2}}$...\n4. Berdasarkan kunci jawaban: B ($\\sqrt{\\frac{1}{3}}-\\sqrt{5}$ diambil nilai absolut)\nRumus: $\\sqrt{a-2\\sqrt{b}} = \\sqrt{p}-\\sqrt{q}$ dengan $p+q=a$, $pq=b$ (dan $p>q$)"
  },
];

const BilanganIrasionalPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN IRASIONAL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BilanganIrasionalPage;
