import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  {
    heading: "A. Menggambar Grafik Fungsi Kuadrat",
    content: `Fungsi kuadrat adalah fungsi yang berbentuk $y = ax^2 + bx + c$ dengan $a \\neq 0$

Gambaran Grafik Fungsi kuadrat:
$D > 0$ : Grafik memotong sumbu-x di dua titik
$D = 0$ : Grafik menyinggung sumbu-x
$D < 0$ : Grafik tidak memotong sumbu-x
dengan $D = b^2 - 4ac$

Definit positif : $a > 0$ dan $D < 0$
Definit negatif : $a < 0$ dan $D < 0$`,
  },
  {
    heading: "B. Menggambar Grafik Fungsi Kuadrat (4 Langkah)",
    content: `1) Titik potong sumbu x: saat $y = 0$

2) Titik potong sumbu y: saat $x = 0$

3) Sumbu simetri: $x_p = -\\dfrac{b}{2a}$

4) Nilai optimum (titik puncak): $y_p = -\\dfrac{D}{4a}$`,
  },
  {
    heading: "C. Menyusun Fungsi Kuadrat",
    content: `1. Diketahui titik puncak $(x_p, y_p)$ dan melalui titik $(x, y)$:
$y = a(x - x_p)^2 + y_p$

2. Memotong sumbu-x di $(x_1, 0)$ dan $(x_2, 0)$ dan melalui titik $(x, y)$:
$y = a(x - x_1)(x - x_2)$

3. Grafik melalui tiga titik:
$y = ax^2 + bx + c$`,
  },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Fungsi $f(x) = 3(x - 1)^2 + 5$ dapat dinyatakan dalam bentuk $f(x) = ax^2 + bx + c$. Nilai b dan c berturut-turut adalah ...", options: ["A. -6 dan 8", "B. -6 dan 2", "C. -3 dan 8", "D. 3 dan 2"] , jawaban: "A", pembahasan: "Jabarkan: $f(x) = 3(x-1)^2 + 5 = 3(x^2 - 2x + 1) + 5 = 3x^2 - 6x + 8$. Jadi $b = -6$, $c = 8$. Jawaban A." },
  { no: 2, soal: "Jika titik $(3, a)$ terletak pada kurva $f(x) = 2x^2 - x + 4$, maka nilai $a$ = ...", options: ["A. 19", "B. 17", "C. 16", "D. 13"] , jawaban: "A", pembahasan: "Substitusi $x = 3$: $f(3) = 2(3)^2 - 3 + 4 = 18 - 3 + 4 = 19$. Jawaban A." },
  { no: 3, soal: "Grafik fungsi $f(x) = x^2 - 2x - 3$ dipotong oleh garis $y = 5$. Salah satu absis titik potongnya adalah ...", options: ["A. 1", "B. 2", "C. 4", "D. 5"] , jawaban: "C", pembahasan: "$x^2 - 2x - 3 = 5 \\Rightarrow x^2 - 2x - 8 = 0 \\Rightarrow (x - 4)(x + 2) = 0$.\nAbsis titik potong: $x = 4$ atau $x = -2$. Jawaban C." },
  { no: 4, soal: "Fungsi $f(x) = x^2 - x - 12$ memotong sumbu X di titik $(p, 0)$ dan $(q, 0)$. Jika $p > q$, maka nilai p dan q berturut-turut adalah ...", options: ["A. 4 dan 3", "B. 4 dan -3", "C. 3 dan -4", "D. 3 dan 2"] , jawaban: "B", pembahasan: "$x^2 - x - 12 = 0 \\Rightarrow (x - 4)(x + 3) = 0 \\Rightarrow x = 4$ atau $x = -3$.\nKarena $p > q$: $p = 4$, $q = -3$. Jawaban B." },
  { no: 5, soal: "Titik potong kurva $f(x) = x^2 + 4x + 7$ dengan sumbu Y adalah ...", options: ["A. (0, 7)", "B. (0, 3)", "C. (-2, 0)", "D. (-3, 3)"] , jawaban: "A", pembahasan: "Titik potong sumbu Y diperoleh saat $x = 0$: $f(0) = 7$. Titik $(0, 7)$. Jawaban A." },
  { no: 6, soal: "Kurva yang mempunyai sumbu simetri di $x = 1$ adalah ...", options: ["A.", "B.", "C.", "D."], svgOptions: [<img src="/no_6_opsi_A.png" alt="Opsi A" className="mt-1 block max-w-[165px] w-full" />, <img src="/no_6_opsi_B.png" alt="Opsi B" className="mt-1 block max-w-[165px] w-full" />, <img src="/no_6_opsi_C.png" alt="Opsi C" className="mt-1 block max-w-[165px] w-full" />, <img src="/no_6_opsi_D.png" alt="Opsi D" className="mt-1 block max-w-[165px] w-full" />] , jawaban: "B", pembahasan: "Sumbu simetri parabola $y = ax^2 + bx + c$ adalah $x = -\\dfrac{b}{2a}$.\nPilih grafik yang sumbu simetri vertikalnya tepat berada pada garis $x = 1$. Jawaban B." },
  { no: 7, soal: "Sumbu simetri dari kurva $f(x) = x^2 + 6x + 5$ adalah ...", options: ["A. $x = -3$", "B. $x = -35$", "C. $x = 52$", "D. $x = 3$"] , jawaban: "A", pembahasan: "$x_p = -\\dfrac{b}{2a} = -\\dfrac{6}{2(1)} = -3$. Jawaban A." },
  { no: 8, soal: "Sumbu simetri pada fungsi $f(x) = (x + 6)^2 - 5$ adalah ...", options: ["A. $x = 6$", "B. $x = 5$", "C. $x = -3$", "D. $x = -6$"] , jawaban: "D", pembahasan: "Bentuk vertex $f(x) = (x + 6)^2 - 5$ memberikan puncak di $(-6, -5)$, sehingga sumbu simetri $x = -6$. Jawaban D." },
  { no: 9, soal: "Nilai minimum fungsi $f(x) = 3(x + 2)^2 + 5$ adalah ...", options: ["A. 17", "B. 8", "C. 5", "D. -7"] , jawaban: "C", pembahasan: "Bentuk vertex $f(x) = 3(x + 2)^2 + 5$ dengan $a = 3 > 0$ membuka ke atas.\nNilai minimum saat $x = -2$: $f(-2) = 0 + 5 = 5$. Jawaban C." },
  { no: 10, soal: "Nilai maksimum fungsi $f(x) = -x^2 + 6x + 7$ adalah ...", options: ["A. 18", "B. 16", "C. 12", "D. 9"] , jawaban: "B", pembahasan: "$a = -1 < 0$ ⇒ memiliki nilai maksimum.\n$x_p = -\\dfrac{b}{2a} = -\\dfrac{6}{-2} = 3$.\n$f(3) = -9 + 18 + 7 = 16$. Jawaban B." },
  { no: 11, soal: "Koordinat titik balik pada kurva $f(x) = x^2 - 10x + 29$ adalah ...", options: ["A. (-5, 5)", "B. (-5, 4)", "C. (5, -4)", "D. (5, 4)"] , jawaban: "D", pembahasan: "$x_p = -\\dfrac{b}{2a} = \\dfrac{10}{2} = 5$.\n$y_p = 25 - 50 + 29 = 4$.\nTitik balik $(5, 4)$. Jawaban D." },
  { no: 12, soal: "Diketahui fungsi $f(x) = -x^2 + bx + c$ mempunyai koordinat titik balik minimum $(-5, 11)$. Nilai b dan c berturut-turut adalah ...", options: ["A. -10 dan 14", "B. -10 dan 36", "C. 10 dan 14", "D. 10 dan 36"] , jawaban: "D", pembahasan: "Catatan: secara matematis $a = -1 < 0$ menghasilkan titik balik MAKSIMUM, bukan minimum (kemungkinan typo). Mengasumsikan $f(x) = x^2 + bx + c$ dengan titik puncak $(-5, 11)$:\n$x_p = -\\dfrac{b}{2} = -5 \\Rightarrow b = 10$.\n$f(-5) = 25 - 50 + c = 11 \\Rightarrow c = 36$.\nJawaban D ($b = 10$, $c = 36$)." },
  { no: 13, soal: "Grafik dari fungsi $f(x) = x^2 - 2x - 15$ adalah ...", options: ["A.", "B.", "C.", "D."], svgOptions: [q13Svg('A'), q13Svg('B'), q13Svg('C'), q13Svg('D')] , jawaban: "B", pembahasan: "$f(x) = x^2 - 2x - 15 = (x - 5)(x + 3)$ ⇒ akar $x = 5$ dan $x = -3$.\n$a = 1 > 0$ ⇒ membuka ke atas. Titik balik di $x_p = 1$, $y_p = -16$.\nGrafik yang sesuai: opsi B. Jawaban B." },
  { no: 14, soal: "Perhatikan gambar! Gambar tersebut adalah grafik fungsi kuadrat ...", options: ["A. $y = x^2 + 2x + 3$", "B. $y = x^2 - 2x - 3$", "C. $y = -x^2 + 2x - 3$", "D. $y = -x^2 - 2x + 3$", "E. $y = -x^2 + 2x + 3$"], svgQuestion: q14Svg() , jawaban: "E", pembahasan: "Dari grafik: akar $x = -1$ dan $x = 3$, titik puncak $(1, 4)$ di atas sumbu X (parabola membuka ke bawah, $a < 0$).\n$y = a(x + 1)(x - 3)$. Substitusi puncak $(1,4)$: $4 = a(2)(-2) = -4a \\Rightarrow a = -1$.\n$y = -(x + 1)(x - 3) = -x^2 + 2x + 3$. Jawaban E." },
  { no: 15, soal: "Perhatikan grafik $f(x) = ax^2 + bx + c$. Nilai a, b dan c yang mungkin adalah ...", options: ["A. $a < 0$, $b > 0$, $c > 0$", "B. $a < 0$, $b > 0$, $c < 0$", "C. $a < 0$, $b < 0$, $c > 0$", "D. $a > 0$, $b < 0$, $c < 0$"], svgQuestion: q15Svg() , jawaban: "C", pembahasan: "Grafik membuka ke bawah ⇒ $a < 0$.\nSumbu simetri di kiri sumbu Y ($x_p < 0$): $-\\dfrac{b}{2a} < 0$, dengan $a < 0$ maka $b < 0$.\nTitik potong sumbu Y di atas sumbu X ⇒ $c > 0$.\nJadi $a < 0$, $b < 0$, $c > 0$. Jawaban C." },
  { no: 16, soal: "Fungsi $f(x) = ax^2 + bx + c$ mempunyai $a < 0$, $b > 0$ dan $c < 0$. Grafik yang sesuai adalah ...", options: ["A.", "B.", "C.", "D."], svgOptions: [q16Svg('A'), q16Svg('B'), q16Svg('C'), q16Svg('D')] , jawaban: "B", pembahasan: "$a < 0$ ⇒ membuka ke bawah ($\\cap$).\n$x_p = -\\dfrac{b}{2a}$ dengan $b > 0, a < 0$ ⇒ $x_p > 0$ (puncak di kanan sumbu Y).\n$c < 0$ ⇒ memotong sumbu Y di bawah sumbu X.\nGrafik yang sesuai: opsi B. Jawaban B." },
  { no: 17, soal: "Nilai diskriminan pada fungsi $f(x) = -x^2 + 2x + 15$ adalah ...", options: ["A. 64", "B. 56", "C. 36", "D. 25"] , jawaban: "A", pembahasan: "$D = b^2 - 4ac = 2^2 - 4(-1)(15) = 4 + 60 = 64$. Jawaban A." },
  { no: 18, soal: "Diantara fungsi kuadrat berikut yang grafiknya memotong sumbu x di dua titik adalah ...", options: ["A. $f(x) = x^2 + 6x + 9$", "B. $f(x) = x^2 - x + 3$", "C. $f(x) = x^2 + x - 20$", "D. $f(x) = x^2 - 2x + 1$"] , jawaban: "C", pembahasan: "Memotong sumbu X di dua titik ⇒ $D > 0$.\nA: $D = 36 - 36 = 0$\nB: $D = 1 - 12 = -11 < 0$\nC: $D = 1 - 4(-20) = 81 > 0$ ✓\nD: $D = 4 - 4 = 0$\nJawaban C." },
  { no: 19, soal: "Perhatikan fungsi kuadrat berikut:\n(i) $f(x) = x^2 - 16$\n(ii) $f(x) = x^2 - 25$\n(iii) $f(x) = x^2 + x - 20$\n(iv) $f(x) = x^2 - 10x + 25$\nFungsi kuadrat yang grafiknya menyinggung sumbu x adalah ...", options: ["A. (i)", "B. (ii)", "C. (iii)", "D. (iv)"] , jawaban: "D", pembahasan: "Menyinggung sumbu X ⇒ $D = 0$.\n(i) $D = 0 + 64 > 0$\n(ii) $D = 0 + 100 > 0$\n(iii) $D = 1 + 80 > 0$\n(iv) $D = 100 - 100 = 0$ ✓\nJawaban D." },
  { no: 20, soal: "Supaya grafik fungsi $f(x) = x^2 + (m - 1)x - (m - 4) = 0$ menyinggung sumbu x, maka nilai $m$ = ...", options: ["A. 5", "B. 3", "C. 2", "D. -3"] , jawaban: "B", pembahasan: "Menyinggung sumbu X ⇒ $D = 0$.\n$D = (m-1)^2 - 4(1)(-(m-4)) = (m-1)^2 + 4(m-4)$\n$= m^2 + 2m - 15 = 0$\n$(m + 5)(m - 3) = 0 \\Rightarrow m = -5$ atau $m = 3$.\nDari pilihan, $m = 3$. Jawaban B." },
  { no: 21, soal: "Persamaan grafik fungsi kuadrat yang mempunyai titik balik maksimum $(1, 2)$ dan melalui titik $(2, 3)$ adalah ...", options: ["A. $y = x^2 - 2x + 1$", "B. $y = x^2 - 2x + 3$", "C. $y = x^2 + 2x - 1$", "D. $y = x^2 + 2x + 1$", "E. $y = x^2 - 2x - 3$"] , jawaban: "B", pembahasan: "Bentuk vertex (puncak $(1,2)$): $y = a(x - 1)^2 + 2$.\nSubstitusi $(2, 3)$: $3 = a(1) + 2 \\Rightarrow a = 1$.\n$y = (x - 1)^2 + 2 = x^2 - 2x + 3$. Jawaban B." },
  { no: 22, soal: "Grafik $y = px^2 + (p + 2)x - p + 4$ memotong sumbu X di dua titik. Batas-batas nilai p yang memenuhi adalah ...", options: ["A. $p < -2$ atau $p > -\\frac{2}{5}$", "B. $p < \\frac{2}{5}$ atau $p > 2$", "C. $p < 2$ atau $p > 10$", "D. $\\frac{2}{5} < p < 2$", "E. $2 < p < 10$"] , jawaban: "B", pembahasan: "Memotong sumbu X di dua titik ⇒ $D > 0$ dan $p \\neq 0$.\n$D = (p+2)^2 - 4p(-p+4) = 5p^2 - 12p + 4 > 0$\nAkar $5p^2 - 12p + 4 = 0$: $p = \\dfrac{12 \\pm 8}{10} = 2$ atau $\\dfrac{2}{5}$.\n$D > 0$ ⇔ $p < \\dfrac{2}{5}$ atau $p > 2$. Jawaban B." },
  { no: 23, soal: "Fungsi kuadrat $f(x) = (k + 3)x^2 - 2kx + (k - 2)$ merupakan fungsi definit positif. Nilai k yang memenuhi adalah ...", options: ["A. $k > -3$", "B. $k < 6$", "C. $k < -3$", "D. $k > 6$", "E. $-3 < k < 6$"] , jawaban: "D", pembahasan: "Definit positif ⇒ $a > 0$ dan $D < 0$.\n$a = k + 3 > 0 \\Rightarrow k > -3$.\n$D = 4k^2 - 4(k+3)(k-2) = -4k + 24 < 0 \\Rightarrow k > 6$.\nGabungan: $k > 6$. Jawaban D." },
  { no: 24, soal: "Sebuah peluru ditembakkan vertikal memiliki rumus ketinggian per detik, $h(t) = (120t - t^2)$ meter. Tinggi tembakan maksimum peluru itu adalah ...", options: ["A. 4.800 m", "B. 4.500 m", "C. 3.600 m", "D. 3.000 m"] , jawaban: "C", pembahasan: "$h(t) = 120t - t^2$, $a = -1 < 0$ ⇒ ada maksimum.\n$t_p = -\\dfrac{120}{-2} = 60$ detik.\n$h(60) = 7200 - 3600 = 3600$ m. Jawaban C." },
  { no: 25, soal: "Sebuah bola digelindingkan pada bidang miring dari atas ke bawah. Tinggi bola tiap detiknya memiliki rumus $h(t) = 80 + 2t - t^2$ (dalam cm). Bola akan menyentuh tanah pada detik ke- ...", options: ["A. 5", "B. 8", "C. 10", "D. 16"] , jawaban: "C", pembahasan: "Bola menyentuh tanah ⇒ $h(t) = 0$.\n$80 + 2t - t^2 = 0 \\Rightarrow t^2 - 2t - 80 = 0 \\Rightarrow (t - 10)(t + 8) = 0$.\nAmbil $t = 10$ (positif). Jawaban C." },
  { no: 26, soal: "Sebuah persegi panjang mempunyai luas 42 cm² dan kelilingnya 34 cm. Lebar persegi panjang itu adalah ...", options: ["A. 2 cm", "B. 3 cm", "C. 5 cm", "D. 14 cm"] , jawaban: "B", pembahasan: "Misal panjang $p$, lebar $l$. $pl = 42$, $2(p + l) = 34 \\Rightarrow p + l = 17$.\n$p, l$ akar persamaan $x^2 - 17x + 42 = 0 \\Rightarrow (x - 3)(x - 14) = 0$.\nLebar = 3 cm. Jawaban B." },
  { no: 27, soal: "Perhatikan gambar berikut. Untuk $x \\in$ bilangan asli, luas maksimum bidang yang diarsir adalah ...", options: ["A. 30 cm²", "B. 36 cm²", "C. 41 cm²", "D. 48 cm²"], svgQuestion: q27Svg() , jawaban: "C", pembahasan: "Total luas = $(7 - x)(x + 1) + 5 \\times 5 = -x^2 + 6x + 7 + 25 = -x^2 + 6x + 32$.\nMaksimum di $x = 3$ (bilangan asli ✓): $-9 + 18 + 32 = 41$ cm². Jawaban C." },
  { no: 28, soal: "Grafik fungsi $g(x) = x^2 + 3$ dapat diperoleh dari grafik $f(x) = x^2$. Cara yang tepat adalah ...", options: ["A. Menggeser $f(x)$ 3 satuan ke kanan", "B. Menggeser $f(x)$ 3 satuan ke kiri", "C. Menggeser $f(x)$ 3 satuan ke bawah", "D. Menggeser $f(x)$ 3 satuan ke atas"] , jawaban: "D", pembahasan: "$g(x) = x^2 + 3 = f(x) + 3$ ⇒ grafik $f(x)$ digeser 3 satuan ke ATAS. Jawaban D." },
  { no: 29, soal: "Grafik fungsi $L(x) = x^2 + 2x - 3$ dapat diperoleh dari grafik $K(x) = (x + 1)^2$. Cara yang tepat adalah ...", options: ["A. Menggeser $K(x)$, 4 satuan ke kiri", "B. Menggeser $K(x)$, 3 satuan ke kiri", "C. Menggeser $K(x)$, 4 satuan ke bawah", "D. Menggeser $K(x)$, 3 satuan ke bawah"], jawaban: "C", pembahasan: "$L(x) = x^2 + 2x - 3 = (x + 1)^2 - 4 = K(x) - 4$ ⇒ grafik $K(x)$ digeser 4 satuan ke BAWAH. Jawaban C." },
];

const FungsiKuadratPage = () => (
  <TKAPemantapanLayout
    title="FUNGSI KUADRAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default FungsiKuadratPage;
