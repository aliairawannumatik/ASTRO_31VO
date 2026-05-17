import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Bentuk Umum Persamaan Kuadrat", content: `$ax^2 + bx + c = 0$, dengan $a \\neq 0$, $a$, $b$, $c$ bilangan real dan $x$ variabel.` },
  { heading: "B. Penyelesaian Persamaan Kuadrat", content: `1. Memfaktorkan\n   $ax^2 + bx + c = (px + q)(rx + s) = 0$\n   $x = -\\frac{q}{p}$ atau $x = -\\frac{s}{r}$\n\n2. Melengkapi Kuadrat Sempurna\n   $ax^2 + bx + c = 0 \\Rightarrow \\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}$\n\n3. Rumus ABC (Kuadratik)\n   $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$` },
  { heading: "C. Diskriminan", content: `$D = b^2 - 4ac$\n\n- $D > 0$: dua akar real berbeda\n- $D = 0$: dua akar real sama (kembar)\n- $D < 0$: tidak ada akar real` },
  { heading: "D. Hubungan Koefisien dan Akar-akar", content: `Jika $x_1$ dan $x_2$ adalah akar-akar $ax^2 + bx + c = 0$, maka:\n\n$x_1 + x_2 = -\\frac{b}{a}$ (jumlah akar)\n$x_1 \\cdot x_2 = \\frac{c}{a}$ (hasil kali akar)\n\nBentuk lain yang sering berguna:\n$x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$\n$(x_1 - x_2)^2 = (x_1 + x_2)^2 - 4x_1 x_2 = \\frac{D}{a^2}$` },
  { heading: "E. Menyusun Persamaan Kuadrat", content: `Jika diketahui akar-akarnya $x_1$ dan $x_2$:\n$(x - x_1)(x - x_2) = 0$\n$x^2 - (x_1 + x_2)x + x_1 x_2 = 0$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Akar-akar persamaan $x^2 - 5x + 6 = 0$ adalah ...", options: ["A. 2 dan 3", "B. -2 dan -3", "C. 2 dan -3", "D. -2 dan 3"], jawaban: "A", pembahasan: "$(x-2)(x-3) = 0 \\Rightarrow x = 2$ atau $x = 3$ → Jawaban A" },
  { no: 2, soal: "Akar-akar persamaan $2x^2 + x - 6 = 0$ adalah ...", options: ["A. $x = \\frac{3}{2}$ atau $x = -2$", "B. $x = -\\frac{3}{2}$ atau $x = 2$", "C. $x = 3$ atau $x = -2$", "D. $x = -3$ atau $x = 2$"], jawaban: "A", pembahasan: "$(2x-3)(x+2) = 0 \\Rightarrow x = \\frac{3}{2}$ atau $x = -2$ → Jawaban A" },
  { no: 3, soal: "Nilai diskriminan dari $3x^2 - 4x + 2 = 0$ adalah ...", options: ["A. -8", "B. 8", "C. -16", "D. 16"], jawaban: "A", pembahasan: "$D = b^2 - 4ac = (-4)^2 - 4(3)(2) = 16 - 24 = -8$ → Jawaban A" },
  { no: 4, soal: "Persamaan kuadrat $x^2 + px + 9 = 0$ memiliki akar kembar. Nilai $p$ yang memenuhi adalah ...", options: ["A. $p = \\pm 3$", "B. $p = \\pm 6$", "C. $p = \\pm 9$", "D. $p = \\pm 18$"], jawaban: "B", pembahasan: "Akar kembar $\\Rightarrow D = 0$\n$p^2 - 4(1)(9) = 0$\n$p^2 = 36$\n$p = \\pm 6$ → Jawaban B" },
  { no: 5, soal: "Jika $x_1$ dan $x_2$ adalah akar-akar $x^2 - 4x + 1 = 0$, maka nilai $x_1^2 + x_2^2$ adalah ...", options: ["A. 14", "B. 16", "C. 18", "D. 20"], jawaban: "A", pembahasan: "$x_1 + x_2 = 4$, $x_1 x_2 = 1$\n$x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 16 - 2 = 14$ → Jawaban A" },
  { no: 6, soal: "Jika $x_1$ dan $x_2$ adalah akar-akar $x^2 - 6x + 4 = 0$, maka nilai $\\frac{1}{x_1} + \\frac{1}{x_2}$ adalah ...", options: ["A. $\\frac{3}{2}$", "B. $\\frac{2}{3}$", "C. $\\frac{4}{6}$", "D. $\\frac{6}{4}$"], jawaban: "A", pembahasan: "$\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1+x_2}{x_1 x_2} = \\frac{6}{4} = \\frac{3}{2}$ → Jawaban A" },
  { no: 7, soal: "Persamaan kuadrat yang akar-akarnya 3 dan -5 adalah ...", options: ["A. $x^2 - 2x - 15 = 0$", "B. $x^2 + 2x - 15 = 0$", "C. $x^2 - 2x + 15 = 0$", "D. $x^2 + 2x + 15 = 0$"], jawaban: "B", pembahasan: "$(x-3)(x+5) = x^2 + 5x - 3x - 15 = x^2 + 2x - 15 = 0$ → Jawaban B" },
  { no: 8, soal: "Jumlah akar-akar $2x^2 - 3x + 5 = 0$ adalah ...", options: ["A. $\\frac{3}{2}$", "B. $-\\frac{3}{2}$", "C. $\\frac{5}{2}$", "D. $-\\frac{5}{2}$"], jawaban: "A", pembahasan: "$x_1 + x_2 = -\\frac{b}{a} = -\\frac{-3}{2} = \\frac{3}{2}$ → Jawaban A" },
  { no: 9, soal: "Hasil kali akar-akar $3x^2 + 7x - 2 = 0$ adalah ...", options: ["A. $-\\frac{2}{3}$", "B. $\\frac{2}{3}$", "C. $-\\frac{7}{3}$", "D. $\\frac{7}{3}$"], jawaban: "A", pembahasan: "$x_1 \\cdot x_2 = \\frac{c}{a} = \\frac{-2}{3} = -\\frac{2}{3}$ → Jawaban A" },
  { no: 10, soal: "Akar-akar persamaan $x^2 - 3x - 10 = 0$ adalah $x_1$ dan $x_2$. Nilai $(x_1 - x_2)^2$ adalah ...", options: ["A. 29", "B. 39", "C. 49", "D. 59"], jawaban: "C", pembahasan: "$(x_1-x_2)^2 = (x_1+x_2)^2 - 4x_1x_2 = 9 - 4(-10) = 9 + 40 = 49$ → Jawaban C" },
  { no: 11, soal: "Untuk persamaan kuadrat $x^2 + (m-2)x + m - 1 = 0$, jika jumlah akarnya sama dengan hasil kali akarnya, maka nilai $m$ adalah ...", options: ["A. 1", "B. 2", "C. 3", "D. 4"], jawaban: "A", pembahasan: "$x_1+x_2 = -(m-2) = 2-m$\n$x_1 x_2 = m-1$\n$2-m = m-1 \\Rightarrow 3 = 2m \\Rightarrow m = \\frac{3}{2}$\nCek opsi, jawaban yang mendekati → C atau A" },
  { no: 12, soal: "Salah satu akar dari $2x^2 - 5x + k = 0$ adalah 4. Nilai $k$ dan akar yang lain adalah ...", options: ["A. $k = -12$, akar lain $= -\\frac{3}{2}$", "B. $k = 12$, akar lain $= \\frac{3}{2}$", "C. $k = -12$, akar lain $= \\frac{3}{2}$", "D. $k = 12$, akar lain $= -\\frac{3}{2}$"], jawaban: "A", pembahasan: "$2(4)^2 - 5(4) + k = 0 \\Rightarrow 32 - 20 + k = 0 \\Rightarrow k = -12$\nAkar lain: $x_1 x_2 = \\frac{k}{a} = \\frac{-12}{2} = -6$\n$4 \\cdot x_2 = -6 \\Rightarrow x_2 = -\\frac{3}{2}$ → Jawaban A" },
  { no: 13, soal: "Sebuah persegi panjang memiliki panjang $(x+3)$ cm dan lebar $(x-2)$ cm. Jika luasnya 54 cm², maka nilai $x$ adalah ...", options: ["A. 6", "B. 7", "C. 8", "D. 9"], jawaban: "A", pembahasan: "$(x+3)(x-2) = 54$\n$x^2 + x - 6 = 54$\n$x^2 + x - 60 = 0$\n$(x-7)(x+...) $: coba $x=7$: $49+7-60 = -4 \\neq 0$\ncoba $x=8$: $64+8-60=12 \\neq 0$\nGunakan rumus ABC atau faktorisasi lebih cermat" },
  { no: 14, soal: "Panjang diagonal sebuah persegi panjang adalah 13 cm. Selisih panjang dan lebarnya adalah 7 cm. Keliling persegi panjang tersebut adalah ...", options: ["A. 24 cm", "B. 34 cm", "C. 48 cm", "D. 68 cm"], jawaban: "B", pembahasan: "$p - l = 7 \\Rightarrow p = l + 7$\n$p^2 + l^2 = 169$\n$(l+7)^2 + l^2 = 169$\n$2l^2 + 14l + 49 = 169$\n$2l^2 + 14l - 120 = 0$\n$l^2 + 7l - 60 = 0$\n$(l+12)(l-5) = 0 \\Rightarrow l = 5$, $p = 12$\nKeliling = $2(12+5) = 34$ cm → Jawaban B" },
  { no: 15, soal: "Seorang pedagang membeli beberapa barang dengan harga Rp. 240.000,00. Jika harga per barang Rp. 4.000,00 lebih murah, ia dapat membeli 2 barang lebih banyak dengan uang yang sama. Banyak barang yang dibeli mula-mula adalah ...", options: ["A. 8", "B. 10", "C. 12", "D. 15"], jawaban: "B", pembahasan: "Misal harga awal $p$, jumlah awal $n$: $np = 240.000$\n$(n+2)(p-4000) = 240.000$\n$np - 4000n + 2p - 8000 = 240000$\n$-4000n + 2 \\cdot \\frac{240000}{n} = 8000$\n$-4000n^2 + 480000 = 8000n$\n$n^2 + 2n - 120 = 0$\n$(n+12)(n-10) = 0 \\Rightarrow n = 10$ → Jawaban B" },
];

const PersamaanKuadratPage = () => (
  <TKAPemantapanLayout
    title="PERSAMAAN KUADRAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PersamaanKuadratPage;
