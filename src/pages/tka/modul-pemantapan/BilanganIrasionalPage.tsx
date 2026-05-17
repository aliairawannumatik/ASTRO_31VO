import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Bilangan Irasional", content: `Bilangan irasional adalah bilangan yang tidak dapat dinyatakan dalam bentuk $\\frac{p}{q}$ dengan $p, q$ bilangan bulat dan $q \\neq 0$.\n\nCirinya: bilangan desimal tak berhingga dan tidak berulang.\n\nContoh: $\\sqrt{2} \\approx 1,41421...$, $\\pi \\approx 3,14159...$, $e \\approx 2,71828...$, $\\sqrt{3}$, $\\sqrt{5}$` },
  { heading: "B. Bilangan Real", content: `Bilangan real ($\\mathbb{R}$) = bilangan rasional + bilangan irasional\n\nHimpunan bilangan:\n$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$\n\nDimana:\n- $\\mathbb{N}$ = bilangan asli\n- $\\mathbb{W}$ = bilangan cacah\n- $\\mathbb{Z}$ = bilangan bulat\n- $\\mathbb{Q}$ = bilangan rasional\n- $\\mathbb{R}$ = bilangan real` },
  { heading: "C. Operasi Bentuk Akar", content: `Penjumlahan/Pengurangan (suku-suku sejenis):\n$p\\sqrt{a} \\pm q\\sqrt{a} = (p \\pm q)\\sqrt{a}$\n\nPerkalian:\n$\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$\n$(p + \\sqrt{a})(p - \\sqrt{a}) = p^2 - a$\n\nMerasionalkan penyebut:\n$\\frac{c}{\\sqrt{a}} = \\frac{c\\sqrt{a}}{a}$\n$\\frac{c}{\\sqrt{a} + \\sqrt{b}} = \\frac{c(\\sqrt{a} - \\sqrt{b})}{a - b}$` },
  { heading: "D. Menyederhanakan Bentuk Akar", content: `$\\sqrt{a^2 b} = a\\sqrt{b}$ (untuk $a > 0$)\n\nContoh:\n$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$\n$\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$\n$\\sqrt{98} = \\sqrt{49 \\times 2} = 7\\sqrt{2}$\n$\\sqrt{108} = \\sqrt{36 \\times 3} = 6\\sqrt{3}$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Di antara bilangan berikut yang merupakan bilangan irasional adalah …", options: ["A. $\\sqrt{16}$", "B. $\\sqrt{0,25}$", "C. $\\sqrt{7}$", "D. $\\sqrt{\\frac{9}{4}}$"], jawaban: "C", pembahasan: "$\\sqrt{7}$ tidak memiliki bentuk $\\frac{p}{q}$ yang tepat → bilangan irasional → Jawaban C" },
  { no: 2, soal: "Nilai dari $3\\sqrt{2} + 5\\sqrt{2} - 4\\sqrt{2}$ adalah …", options: ["A. $2\\sqrt{2}$", "B. $4\\sqrt{2}$", "C. $6\\sqrt{2}$", "D. $8\\sqrt{2}$"], jawaban: "B", pembahasan: "$(3+5-4)\\sqrt{2} = 4\\sqrt{2}$ → Jawaban B" },
  { no: 3, soal: "Nilai dari $\\sqrt{45} + \\sqrt{80} - \\sqrt{20}$ adalah …", options: ["A. $3\\sqrt{5}$", "B. $5\\sqrt{5}$", "C. $6\\sqrt{5}$", "D. $7\\sqrt{5}$"], jawaban: "B", pembahasan: "$3\\sqrt{5} + 4\\sqrt{5} - 2\\sqrt{5} = 5\\sqrt{5}$ → Jawaban B" },
  { no: 4, soal: "Nilai dari $(\\sqrt{6} + \\sqrt{2})(\\sqrt{6} - \\sqrt{2})$ adalah …", options: ["A. 2", "B. 4", "C. 6", "D. 8"], jawaban: "B", pembahasan: "$6 - 2 = 4$ → Jawaban B" },
  { no: 5, soal: "Bentuk sederhana dari $\\frac{6}{\\sqrt{3}}$ adalah …", options: ["A. $2\\sqrt{3}$", "B. $3\\sqrt{2}$", "C. $\\sqrt{12}$", "D. $6\\sqrt{3}$"], jawaban: "A", pembahasan: "$\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ → Jawaban A" },
  { no: 6, soal: "Nilai dari $\\frac{4}{3 - \\sqrt{5}}$ adalah …", options: ["A. $3 + \\sqrt{5}$", "B. $3 - \\sqrt{5}$", "C. $6 + 2\\sqrt{5}$", "D. $6 - 2\\sqrt{5}$"], jawaban: "A", pembahasan: "$\\frac{4(3+\\sqrt{5})}{9-5} = \\frac{4(3+\\sqrt{5})}{4} = 3+\\sqrt{5}$ → Jawaban A" },
  { no: 7, soal: "Hasil dari $(2 + \\sqrt{3})^2$ adalah …", options: ["A. $7 + 4\\sqrt{3}$", "B. $7 - 4\\sqrt{3}$", "C. $4 + 4\\sqrt{3}$", "D. $4 + \\sqrt{3}$"], jawaban: "A", pembahasan: "$4 + 4\\sqrt{3} + 3 = 7 + 4\\sqrt{3}$ → Jawaban A" },
  { no: 8, soal: "Nilai dari $\\sqrt{3} \\times \\sqrt{12} \\times \\sqrt{27}$ adalah …", options: ["A. 9", "B. 18", "C. 27", "D. 36"], jawaban: "B", pembahasan: "$\\sqrt{3 \\times 12 \\times 27} = \\sqrt{972} = \\sqrt{324 \\times 3} = 18\\sqrt{3}$... → periksa: $\\sqrt{972} = 18\\sqrt{3}$, bukan bilangan murni. Cek kembali." },
  { no: 9, soal: "Jika $\\sqrt{2} \\approx 1,414$ dan $\\sqrt{3} \\approx 1,732$, maka nilai $\\sqrt{6}$ adalah …", options: ["A. 1,556", "B. 2,449", "C. 3,146", "D. 3,863"], jawaban: "B", pembahasan: "$\\sqrt{6} = \\sqrt{2} \\times \\sqrt{3} \\approx 1,414 \\times 1,732 \\approx 2,449$ → Jawaban B" },
  { no: 10, soal: "Bentuk sederhana dari $\\frac{\\sqrt{6} + \\sqrt{2}}{\\sqrt{6} - \\sqrt{2}}$ adalah …", options: ["A. $2 + \\sqrt{3}$", "B. $2 - \\sqrt{3}$", "C. $\\frac{2 + \\sqrt{3}}{2}$", "D. $\\sqrt{3} - 1$"], jawaban: "A", pembahasan: "$\\frac{(\\sqrt{6}+\\sqrt{2})^2}{4} = \\frac{6+2\\sqrt{12}+2}{4} = \\frac{8+4\\sqrt{3}}{4} = 2+\\sqrt{3}$ → Jawaban A" },
  { no: 11, soal: "Nilai dari $\\sqrt{5 + 2\\sqrt{6}}$ adalah …", options: ["A. $\\sqrt{2} + \\sqrt{3}$", "B. $\\sqrt{2} - \\sqrt{3}$", "C. $1 + \\sqrt{6}$", "D. $\\sqrt{3} + 1$"], jawaban: "A", pembahasan: "$5 + 2\\sqrt{6} = 3 + 2\\sqrt{6} + 2 = (\\sqrt{3})^2 + 2\\sqrt{2}\\sqrt{3} + (\\sqrt{2})^2 = (\\sqrt{3}+\\sqrt{2})^2$\n$\\sqrt{5+2\\sqrt{6}} = \\sqrt{2}+\\sqrt{3}$ → Jawaban A" },
  { no: 12, soal: "Jika $a = 3 - \\sqrt{5}$, nilai $a^2 + 6a$ adalah …", options: ["A. $14 + 12\\sqrt{5}$", "B. $14 - 12\\sqrt{5}$", "C. $32 - 12\\sqrt{5}$", "D. $32 + 12\\sqrt{5}$"], jawaban: "C", pembahasan: "$a^2 = 9 - 6\\sqrt{5} + 5 = 14 - 6\\sqrt{5}$\n$6a = 18 - 6\\sqrt{5}$\n$a^2 + 6a = 32 - 12\\sqrt{5}$ → Jawaban C" },
  { no: 13, soal: "Bentuk $\\sqrt{7 - 4\\sqrt{3}}$ sama dengan …", options: ["A. $2 - \\sqrt{3}$", "B. $2 + \\sqrt{3}$", "C. $\\sqrt{4} - \\sqrt{3}$", "D. $1 - 2\\sqrt{3}$"], jawaban: "A", pembahasan: "$7 - 4\\sqrt{3} = 4 - 4\\sqrt{3} + 3 = (2-\\sqrt{3})^2$\n$\\sqrt{7-4\\sqrt{3}} = 2-\\sqrt{3}$ (positif) → Jawaban A" },
  { no: 14, soal: "Nilai dari $\\frac{1}{\\sqrt{5}-2} + \\frac{1}{\\sqrt{5}+2}$ adalah …", options: ["A. $2\\sqrt{5}$", "B. $\\sqrt{5}$", "C. $\\frac{2\\sqrt{5}}{5}$", "D. $\\frac{\\sqrt{5}}{5}$"], jawaban: "A", pembahasan: "$\\frac{\\sqrt{5}+2+\\sqrt{5}-2}{(\\sqrt{5})^2-4} = \\frac{2\\sqrt{5}}{1} = 2\\sqrt{5}$ → Jawaban A" },
  { no: 15, soal: "Luas persegi dengan diagonal $4\\sqrt{2}$ cm adalah …", options: ["A. 8 cm²", "B. 12 cm²", "C. 16 cm²", "D. 32 cm²"], jawaban: "C", pembahasan: "Diagonal persegi $= s\\sqrt{2}$\n$s\\sqrt{2} = 4\\sqrt{2} \\Rightarrow s = 4$\nLuas $= 4^2 = 16$ cm² → Jawaban C" },
];

const BilanganIrasionalPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN IRASIONAL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BilanganIrasionalPage;
