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
  { no: 1, soal: "Hasil dari $\\frac{3}{4} + \\frac{2}{5}$ adalah …", options: ["A. $\\frac{5}{9}$", "B. $\\frac{23}{20}$", "C. $\\frac{6}{9}$", "D. $\\frac{5}{20}$"], jawaban: "B", pembahasan: "$\\frac{15}{20} + \\frac{8}{20} = \\frac{23}{20}$ → Jawaban B" },
  { no: 2, soal: "Hasil dari $2\\frac{1}{3} - 1\\frac{3}{4}$ adalah …", options: ["A. $\\frac{7}{12}$", "B. $\\frac{5}{12}$", "C. $\\frac{1}{12}$", "D. $1\\frac{1}{12}$"], jawaban: "A", pembahasan: "$\\frac{7}{3} - \\frac{7}{4} = \\frac{28-21}{12} = \\frac{7}{12}$ → Jawaban A" },
  { no: 3, soal: "Hasil dari $\\frac{3}{5} \\times \\frac{10}{9}$ adalah …", options: ["A. $\\frac{1}{3}$", "B. $\\frac{2}{3}$", "C. $\\frac{30}{45}$", "D. $\\frac{5}{4}$"], jawaban: "B", pembahasan: "$\\frac{30}{45} = \\frac{2}{3}$ → Jawaban B" },
  { no: 4, soal: "Hasil dari $\\frac{4}{9} \\div \\frac{8}{3}$ adalah …", options: ["A. $\\frac{1}{6}$", "B. $\\frac{3}{2}$", "C. $\\frac{32}{27}$", "D. $6$"], jawaban: "A", pembahasan: "$\\frac{4}{9} \\times \\frac{3}{8} = \\frac{12}{72} = \\frac{1}{6}$ → Jawaban A" },
  { no: 5, soal: "Nilai dari $\\left(\\frac{1}{2} + \\frac{1}{3}\\right) \\times \\frac{6}{5}$ adalah …", options: ["A. $\\frac{1}{5}$", "B. $1$", "C. $\\frac{6}{5}$", "D. $\\frac{5}{6}$"], jawaban: "B", pembahasan: "$\\frac{5}{6} \\times \\frac{6}{5} = 1$ → Jawaban B" },
  { no: 6, soal: "Diurutkan dari terkecil: $\\frac{2}{3}$, $0,7$, $\\frac{3}{5}$, $65\\%$ adalah …", options: ["A. $\\frac{3}{5} < 65\\% < \\frac{2}{3} < 0,7$", "B. $65\\% < \\frac{3}{5} < \\frac{2}{3} < 0,7$", "C. $\\frac{3}{5} < \\frac{2}{3} < 0,7 < 65\\%$", "D. $0,7 < 65\\% < \\frac{2}{3} < \\frac{3}{5}$"], jawaban: "A", pembahasan: "$\\frac{3}{5}=0,6$; $65\\%=0,65$; $\\frac{2}{3}\\approx0,667$; $0,7=0,7$\nUrutan: $0,6 < 0,65 < 0,667 < 0,7$ → Jawaban A" },
  { no: 7, soal: "Seorang pedagang memiliki $3\\frac{1}{4}$ kg beras. Ia menjual $1\\frac{3}{8}$ kg. Sisa beras adalah …", options: ["A. $1\\frac{5}{8}$", "B. $1\\frac{7}{8}$", "C. $2\\frac{1}{8}$", "D. $2\\frac{3}{8}$"], jawaban: "B", pembahasan: "$3\\frac{1}{4} - 1\\frac{3}{8} = \\frac{13}{4} - \\frac{11}{8} = \\frac{26-11}{8} = \\frac{15}{8} = 1\\frac{7}{8}$ → Jawaban B" },
  { no: 8, soal: "Nilai dari $\\frac{0,6 \\times 1,5}{0,3 + 0,6}$ adalah …", options: ["A. 0,5", "B. 1", "C. 1,5", "D. 3"], jawaban: "B", pembahasan: "$\\frac{0,9}{0,9} = 1$ → Jawaban B" },
  { no: 9, soal: "Bilangan $0,3\\overline{6}$ dapat dinyatakan sebagai pecahan …", options: ["A. $\\frac{11}{30}$", "B. $\\frac{33}{90}$", "C. $\\frac{11}{30}$", "D. $\\frac{33}{100}$"], jawaban: "A", pembahasan: "Misal $x = 0,3\\overline{6} = 0,3666...$\n$10x = 3,666...$, $100x = 36,666...$\n$100x - 10x = 33$, $90x = 33$, $x = \\frac{33}{90} = \\frac{11}{30}$ → Jawaban A" },
  { no: 10, soal: "Setiap hari Andi menghabiskan $\\frac{2}{5}$ dari uang jajannya. Jika uang jajan Andi Rp50.000 per hari, dalam seminggu Andi menghabiskan …", options: ["A. Rp70.000", "B. Rp100.000", "C. Rp140.000", "D. Rp200.000"], jawaban: "C", pembahasan: "Per hari = $\\frac{2}{5} \\times 50.000 = 20.000$\nSeminggu = $7 \\times 20.000 = 140.000$ → Jawaban C" },
  { no: 11, soal: "Hasil dari $\\frac{2}{3} \\times \\left(\\frac{3}{4} + \\frac{1}{6}\\right) - \\frac{1}{4}$ adalah …", options: ["A. $\\frac{1}{4}$", "B. $\\frac{7}{12}$", "C. $\\frac{5}{12}$", "D. $\\frac{1}{3}$"], jawaban: "C", pembahasan: "$\\frac{3}{4} + \\frac{1}{6} = \\frac{9+2}{12} = \\frac{11}{12}$\n$\\frac{2}{3} \\times \\frac{11}{12} = \\frac{11}{18}$\n$\\frac{11}{18} - \\frac{1}{4} = \\frac{22-9}{36} = \\frac{13}{36}$" },
  { no: 12, soal: "Dari sebuah tali yang panjangnya $4\\frac{1}{2}$ m, dipotong $1\\frac{2}{3}$ m dan $\\frac{5}{6}$ m. Sisa tali adalah …", options: ["A. $1\\frac{5}{6}$ m", "B. $2$ m", "C. $2\\frac{1}{6}$ m", "D. $2\\frac{1}{2}$ m"], jawaban: "B", pembahasan: "$4\\frac{1}{2} - 1\\frac{2}{3} - \\frac{5}{6} = \\frac{9}{2} - \\frac{5}{3} - \\frac{5}{6}$\n$= \\frac{27-10-5}{6} = \\frac{12}{6} = 2$ → Jawaban B" },
  { no: 13, soal: "Luas persegi panjang dengan panjang $\\frac{5}{4}$ m dan lebar $\\frac{3}{5}$ m adalah …", options: ["A. $\\frac{3}{4}$ m²", "B. $\\frac{3}{5}$ m²", "C. $\\frac{5}{4}$ m²", "D. $\\frac{75}{20}$ m²"], jawaban: "A", pembahasan: "Luas = $\\frac{5}{4} \\times \\frac{3}{5} = \\frac{15}{20} = \\frac{3}{4}$ m² → Jawaban A" },
  { no: 14, soal: "Jika $x = \\frac{3}{4}$ dan $y = \\frac{2}{3}$, nilai dari $\\frac{x+y}{x-y}$ adalah …", options: ["A. $\\frac{17}{1}$", "B. 17", "C. $\\frac{17}{1}$", "D. $\\frac{1}{17}$"], jawaban: "B", pembahasan: "$x+y = \\frac{9+8}{12} = \\frac{17}{12}$, $x-y = \\frac{9-8}{12} = \\frac{1}{12}$\n$\\frac{17/12}{1/12} = 17$ → Jawaban B" },
  { no: 15, soal: "Nilai dari $\\frac{\\frac{1}{2} + \\frac{1}{3}}{\\frac{1}{4} - \\frac{1}{6}}$ adalah …", options: ["A. 10", "B. 12", "C. 8", "D. 6"], jawaban: "A", pembahasan: "Pembilang = $\\frac{5}{6}$, Penyebut = $\\frac{1}{12}$\n$\\frac{5/6}{1/12} = 10$ → Jawaban A" },
];

const BilanganRasionalPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN RASIONAL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BilanganRasionalPage;
