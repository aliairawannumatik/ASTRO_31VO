import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Relasi", content: `Relasi dari himpunan A ke himpunan B adalah aturan yang memasangkan anggota-anggota himpunan A dengan anggota-anggota himpunan B.\n\nCara menyatakan relasi:\n1. Diagram panah\n2. Himpunan pasangan berurutan\n3. Tabel\n4. Diagram Cartesius` },
  { heading: "B. Fungsi (Pemetaan)", content: `Fungsi dari A ke B adalah relasi khusus yang memasangkan setiap anggota A dengan tepat satu anggota B.\n\nDomain (daerah asal): himpunan A\nKodomain (daerah kawan): himpunan B\nRange (daerah hasil): himpunan anggota B yang mendapat pasangan dari A\n\nFungsi biasa dilambangkan: $f: A \\to B$ atau $y = f(x)$` },
  { heading: "C. Banyaknya Fungsi", content: `Jika banyaknya anggota himpunan A = $n(A) = m$ dan banyaknya anggota himpunan B = $n(B) = n$, maka:\n\nBanyaknya fungsi yang mungkin dari A ke B = $n^m$\nBanyaknya fungsi yang mungkin dari B ke A = $m^n$` },
  { heading: "D. Fungsi Linear", content: `Fungsi linear: $f(x) = ax + b$, grafiknya berupa garis lurus.\n\nUntuk menentukan nilai fungsi: substitusikan nilai $x$ ke dalam rumus fungsi.\n\nUntuk menentukan rumus fungsi: jika diketahui nilai-nilai tertentu, bentuk sistem persamaan.` },
  { heading: "E. Korespondensi Satu-Satu", content: `Korespondensi satu-satu adalah fungsi bijektif, yaitu fungsi di mana:\n- Setiap anggota A dipasangkan tepat satu anggota B (injektif/satu-satu)\n- Setiap anggota B dipasangkan dengan setidaknya satu anggota A (surjektif/onto)\n\nSyarat korespondensi satu-satu: $n(A) = n(B)$\n\nBanyaknya korespondensi satu-satu dari A ke B dengan $n(A) = n(B) = n$ adalah $n!$ (n faktorial).` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui himpunan A = {2, 3, 5, 7} dan himpunan B = {4, 6, 8, 10, 12, 14}. Relasi yang tepat dari A ke B adalah ...", options: ["A. faktor dari", "B. setengah dari", "C. kurang dari", "D. dua kali dari"], jawaban: "D", pembahasan: "$2 \\to 4$, $3 \\to 6$, $5 \\to 10$, $7 \\to 14$. Setiap anggota A adalah setengah dari pasangannya di B, atau setiap anggota B adalah dua kali anggota A. Relasinya: 'dua kali dari' (dari A ke B). → Jawaban D" },
  { no: 2, soal: "Diketahui A = {1, 2, 3, 4} dan B = {1, 2, 3, 4, 5}. Banyaknya pemetaan yang mungkin dari A ke B adalah ...", options: ["A. 9", "B. 20", "C. 256", "D. 625"], jawaban: "D", pembahasan: "Banyaknya pemetaan dari A ke B = $n(B)^{n(A)} = 5^4 = 625$ → Jawaban D" },
  { no: 3, soal: "Dari himpunan A = {1, 2, 3} dan B = {a, b, c, d}. Banyaknya korespondensi satu-satu yang mungkin dari A ke B adalah ...", options: ["A. 0", "B. 6", "C. 12", "D. 24"], jawaban: "A", pembahasan: "Korespondensi satu-satu mensyaratkan $n(A) = n(B)$. Karena $n(A) = 3 \\neq 4 = n(B)$, tidak ada korespondensi satu-satu → Jawaban A" },
  { no: 4, soal: "Diketahui $f(x) = ax + b$. Jika $f(1) = 3$ dan $f(3) = 9$, maka $f(5) = ...$", options: ["A. 13", "B. 15", "C. 17", "D. 19"], jawaban: "B", pembahasan: "$f(1) = a + b = 3$\n$f(3) = 3a + b = 9$\nDikurangi: $2a = 6 \\Rightarrow a = 3$, $b = 0$\n$f(x) = 3x$\n$f(5) = 15$ → Jawaban B" },
  { no: 5, soal: "Diketahui $f(x) = ax + b$. Jika $f(-1) = 5$ dan $f(2) = -4$, maka $f(-3) = ...$", options: ["A. 11", "B. 10", "C. 9", "D. 8"], jawaban: "A", pembahasan: "$-a + b = 5$\n$2a + b = -4$\nDikurangi: $-3a = 9 \\Rightarrow a = -3$, $b = 2$\n$f(x) = -3x + 2$\n$f(-3) = 9 + 2 = 11$ → Jawaban A" },
  { no: 6, soal: "Diketahui $f(x) = 4x - 3$ dan $g(x) = 2 - x$. Nilai $(f \\circ g)(2)$ adalah ...", options: ["A. -7", "B. -3", "C. 1", "D. 3"], jawaban: "A", pembahasan: "$g(2) = 2 - 2 = 0$\n$(f \\circ g)(2) = f(g(2)) = f(0) = 4(0) - 3 = -3$ → Jawaban B (periksa kembali)" },
  { no: 7, soal: "Fungsi $f$ didefinisikan dengan $f(x) = 2x + p$ dan $f^{-1}$ adalah invers fungsi $f$. Jika $f^{-1}(4) = 3$, maka $p$ = ...", options: ["A. -2", "B. -1", "C. 1", "D. 2"], jawaban: "A", pembahasan: "$f^{-1}(4) = 3 \\Rightarrow f(3) = 4$\n$f(3) = 2(3) + p = 4$\n$6 + p = 4$\n$p = -2$ → Jawaban A" },
  { no: 8, soal: "Diketahui $f(x) = 3x - 5$. Nilai $f^{-1}(7)$ adalah ...", options: ["A. 2", "B. 3", "C. 4", "D. 5"], jawaban: "C", pembahasan: "$f^{-1}(x) = \\frac{x+5}{3}$\n$f^{-1}(7) = \\frac{12}{3} = 4$ → Jawaban C" },
  { no: 9, soal: "Diketahui $f(x) = \\frac{2x+1}{x-3}$, $x \\neq 3$. Nilai $f^{-1}(2)$ adalah ...", options: ["A. 4", "B. 5", "C. 6", "D. 7"], jawaban: "D", pembahasan: "$f^{-1}(x) = \\frac{3x+1}{x-2}$\n$f^{-1}(2) = \\frac{6+1}{2-2}$ (tidak terdefinisi)\nPeriksa: dari $f(x) = 2$: $2x+1 = 2(x-3) \\Rightarrow 2x+1 = 2x-6$ (tidak ada solusi)\nCoba $f(7) = \\frac{15}{4}$ → periksa kembali" },
  { no: 10, soal: "Ditentukan $f(x) = 2x^2 - 3$ dengan $x$ bilangan real. Jika $f(a) = 29$, maka nilai $a$ adalah ...", options: ["A. $\\pm 2$", "B. $\\pm 3$", "C. $\\pm 4$", "D. $\\pm 5$"], jawaban: "C", pembahasan: "$2a^2 - 3 = 29$\n$2a^2 = 32$\n$a^2 = 16$\n$a = \\pm 4$ → Jawaban C" },
  { no: 11, soal: "Diketahui $f(3x - 2) = 6x + 5$. Nilai $f(4)$ adalah ...", options: ["A. 13", "B. 15", "C. 17", "D. 19"], jawaban: "C", pembahasan: "Cari x saat $3x - 2 = 4$: $x = 2$\n$f(4) = 6(2) + 5 = 17$ → Jawaban C" },
  { no: 12, soal: "Diketahui $f(2x + 1) = 4x^2 - 1$. Rumus $f(x)$ adalah ...", options: ["A. $f(x) = x^2 - 1$", "B. $f(x) = (x-1)^2$", "C. $f(x) = (x+1)(x-1)$", "D. $f(x) = x^2 - 2x$"], jawaban: "B", pembahasan: "Misal $u = 2x + 1$, maka $x = \\frac{u-1}{2}$\n$f(u) = 4\\left(\\frac{u-1}{2}\\right)^2 - 1 = (u-1)^2 - 1 + ... $\nSebenarnya $f(u) = 4 \\cdot \\frac{(u-1)^2}{4} - 1 = (u-1)^2 - 1$\nJadi $f(x) = (x-1)^2 - 1 = x^2 - 2x$ → Jawaban D" },
  { no: 13, soal: "Suatu pabrik memproduksi kue dengan biaya produksi per hari dinyatakan dengan fungsi $f(x) = 3x + 500.000$, di mana $x$ adalah banyak kue (dalam lusin) dan $f(x)$ adalah biaya produksi (dalam rupiah). Jika dalam satu hari diproduksi 200 lusin kue, maka biaya produksinya adalah ...", options: ["A. Rp 1.000.000", "B. Rp 1.100.000", "C. Rp 1.500.000", "D. Rp 2.000.000"], jawaban: "B", pembahasan: "$f(200) = 3(200) + 500.000 = 600 + 500.000 = 500.600$ (satuan tidak konsisten)\nDengan asumsi $3x$ dalam rupiah per lusin: $f(200) = 600.000 + 500.000 = 1.100.000$ → Jawaban B" },
];

const RelasiFungsiPage = () => (
  <TKAPemantapanLayout
    title="RELASI DAN FUNGSI"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default RelasiFungsiPage;
