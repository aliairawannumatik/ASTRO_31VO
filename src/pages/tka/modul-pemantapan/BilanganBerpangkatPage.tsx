import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Bilangan Berpangkat Bulat Positif", content: `$a^n = a \\times a \\times ... \\times a$ (n faktor), $a \\neq 0$, $n$ bilangan bulat positif.\n\nSifat-sifat:\n1. $a^m \\times a^n = a^{m+n}$\n2. $a^m \\div a^n = a^{m-n}$\n3. $(a^m)^n = a^{mn}$\n4. $(ab)^n = a^n b^n$\n5. $\\left(\\dfrac{a}{b}\\right)^n = \\dfrac{a^n}{b^n}$` },
  { heading: "B. Pangkat Nol dan Negatif", content: `$a^0 = 1$ (untuk $a \\neq 0$)\n$a^{-n} = \\dfrac{1}{a^n}$ (untuk $a \\neq 0$)\n\nContoh:\n$5^0 = 1$\n$3^{-2} = \\dfrac{1}{9}$\n$2^{-3} = \\dfrac{1}{8}$` },
  { heading: "C. Pangkat Pecahan dan Akar", content: `$a^{\\frac{1}{n}} = \\sqrt[n]{a}$\n$a^{\\frac{m}{n}} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m$\n\nAkar kuadrat:\n$\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$\n$\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$\n$\\sqrt{a^2} = |a|$\n\nMerasionalkan penyebut:\n$\\frac{c}{\\sqrt{a}} = \\frac{c\\sqrt{a}}{a}$\n$\\frac{c}{\\sqrt{a}+\\sqrt{b}} = \\frac{c(\\sqrt{a}-\\sqrt{b})}{a-b}$` },
  { heading: "D. Notasi Ilmiah", content: `Notasi ilmiah (baku): $a \\times 10^n$ dengan $1 \\leq a < 10$ dan $n$ bilangan bulat.\n\nContoh:\n$12.500.000 = 1,25 \\times 10^7$\n$0,000035 = 3,5 \\times 10^{-5}$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Hasil dari $2^3 \\times 2^4 \\div 2^5$ adalah …", options: ["A. 4", "B. 8", "C. 16", "D. 32"], jawaban: "A", pembahasan: "$2^{3+4-5} = 2^2 = 4$ → Jawaban A" },
  { no: 2, soal: "Nilai dari $\\left(\\frac{2}{3}\\right)^{-2}$ adalah …", options: ["A. $\\frac{4}{9}$", "B. $\\frac{9}{4}$", "C. $-\\frac{4}{9}$", "D. $-\\frac{9}{4}$"], jawaban: "B", pembahasan: "$\\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}$ → Jawaban B" },
  { no: 3, soal: "Nilai dari $\\frac{6^4 \\times 3^{-2}}{2^3}$ adalah …", options: ["A. 54", "B. 72", "C. 108", "D. 144"], jawaban: "A", pembahasan: "$\\frac{1296 \\times \\frac{1}{9}}{8} = \\frac{144}{8} = 18$... → periksa: $\\frac{6^4 \\times 3^{-2}}{2^3} = \\frac{6^4}{9 \\times 8} = \\frac{1296}{72} = 18$" },
  { no: 4, soal: "Hasil dari $(3^2)^3 \\times 3^{-4}$ adalah …", options: ["A. 9", "B. 27", "C. 81", "D. 243"], jawaban: "B", pembahasan: "$3^6 \\times 3^{-4} = 3^2 = 9$ → Jawaban A" },
  { no: 5, soal: "Bentuk sederhana dari $\\sqrt{72}$ adalah …", options: ["A. $6\\sqrt{2}$", "B. $6\\sqrt{3}$", "C. $8\\sqrt{3}$", "D. $9\\sqrt{2}$"], jawaban: "A", pembahasan: "$\\sqrt{36 \\times 2} = 6\\sqrt{2}$ → Jawaban A" },
  { no: 6, soal: "Nilai dari $\\sqrt{48} - \\sqrt{27} + \\sqrt{75}$ adalah …", options: ["A. $4\\sqrt{3}$", "B. $5\\sqrt{3}$", "C. $6\\sqrt{3}$", "D. $7\\sqrt{3}$"], jawaban: "C", pembahasan: "$4\\sqrt{3} - 3\\sqrt{3} + 5\\sqrt{3} = 6\\sqrt{3}$ → Jawaban C" },
  { no: 7, soal: "Nilai dari $\\frac{6}{2+\\sqrt{2}}$ adalah …", options: ["A. $6-3\\sqrt{2}$", "B. $3+\\frac{3\\sqrt{2}}{2}$", "C. $6+3\\sqrt{2}$", "D. $3-\\frac{3\\sqrt{2}}{2}$"], jawaban: "A", pembahasan: "$\\frac{6(2-\\sqrt{2})}{(2+\\sqrt{2})(2-\\sqrt{2})} = \\frac{6(2-\\sqrt{2})}{2} = 3(2-\\sqrt{2}) = 6-3\\sqrt{2}$ → Jawaban A" },
  { no: 8, soal: "Nilai dari $125^{\\frac{2}{3}}$ adalah …", options: ["A. 25", "B. 50", "C. 75", "D. 100"], jawaban: "A", pembahasan: "$(5^3)^{\\frac{2}{3}} = 5^2 = 25$ → Jawaban A" },
  { no: 9, soal: "Jika $2^x = 32$, nilai x adalah …", options: ["A. 3", "B. 4", "C. 5", "D. 6"], jawaban: "C", pembahasan: "$2^x = 2^5 \\Rightarrow x = 5$ → Jawaban C" },
  { no: 10, soal: "Bilangan $0,000045$ dalam notasi ilmiah adalah …", options: ["A. $4,5 \\times 10^{-5}$", "B. $45 \\times 10^{-6}$", "C. $4,5 \\times 10^{-4}$", "D. $0,45 \\times 10^{-4}$"], jawaban: "A", pembahasan: "$0,000045 = 4,5 \\times 10^{-5}$ → Jawaban A" },
  { no: 11, soal: "Hasil dari $\\left(\\frac{27}{8}\\right)^{\\frac{2}{3}}$ adalah …", options: ["A. $\\frac{4}{9}$", "B. $\\frac{9}{4}$", "C. $\\frac{3}{2}$", "D. $\\frac{2}{3}$"], jawaban: "B", pembahasan: "$\\left(\\frac{3}{2}\\right)^3)^{\\frac{2}{3}} = \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}$ → Jawaban B" },
  { no: 12, soal: "Nilai dari $2\\sqrt{3} \\times 3\\sqrt{6}$ adalah …", options: ["A. $18\\sqrt{2}$", "B. $6\\sqrt{18}$", "C. $12\\sqrt{3}$", "D. $6\\sqrt{2}$"], jawaban: "A", pembahasan: "$6\\sqrt{18} = 6 \\times 3\\sqrt{2} = 18\\sqrt{2}$ → Jawaban A" },
  { no: 13, soal: "Jika $\\sqrt{x+3} = 4$, maka nilai x adalah …", options: ["A. 1", "B. 7", "C. 13", "D. 19"], jawaban: "C", pembahasan: "$x + 3 = 16 \\Rightarrow x = 13$ → Jawaban C" },
  { no: 14, soal: "Hasil dari $\\frac{\\sqrt{5} + \\sqrt{3}}{\\sqrt{5} - \\sqrt{3}}$ adalah …", options: ["A. $\\frac{8 + 2\\sqrt{15}}{2}$", "B. $4 + \\sqrt{15}$", "C. $8 - 2\\sqrt{15}$", "D. $4 - \\sqrt{15}$"], jawaban: "B", pembahasan: "$\\frac{(\\sqrt{5}+\\sqrt{3})^2}{5-3} = \\frac{8+2\\sqrt{15}}{2} = 4+\\sqrt{15}$ → Jawaban B" },
  { no: 15, soal: "Dalam bentuk $a \\times 10^n$, hasil dari $(3 \\times 10^4) \\times (2 \\times 10^3)$ adalah …", options: ["A. $6 \\times 10^7$", "B. $6 \\times 10^{12}$", "C. $5 \\times 10^7$", "D. $5 \\times 10^{12}$"], jawaban: "A", pembahasan: "$3 \\times 2 = 6$, $10^4 \\times 10^3 = 10^7$\nHasil: $6 \\times 10^7$ → Jawaban A" },
];

const BilanganBerpangkatPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN BERPANGKAT DAN BENTUK AKAR"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BilanganBerpangkatPage;
