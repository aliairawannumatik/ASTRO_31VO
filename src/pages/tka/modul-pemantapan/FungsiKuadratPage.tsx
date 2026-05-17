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
  { no: 1, soal: "Fungsi $f(x) = 3(x - 1)^2 + 5$ dalam bentuk $f(x) = ax^2 + bx + c$. Nilai b dan c berturut-turut adalah …", options: ["A. -6 dan 8", "B. -6 dan 2", "C. -3 dan 8", "D. 3 dan 2"], jawaban: "A", pembahasan: "$f(x) = 3(x^2-2x+1)+5 = 3x^2-6x+8$. $b=-6$, $c=8$ → Jawaban A" },
  { no: 2, soal: "Jika titik $(3, a)$ terletak pada kurva $f(x) = 2x^2 - x + 4$, maka nilai $a$ = …", options: ["A. 19", "B. 17", "C. 16", "D. 13"], jawaban: "A", pembahasan: "$f(3) = 2(9)-3+4 = 18-3+4 = 19$ → Jawaban A" },
  { no: 3, soal: "Grafik fungsi $f(x) = x^2 - 2x - 3$ dipotong oleh garis $y = 5$. Salah satu absis titik potongnya adalah …", options: ["A. 1", "B. 2", "C. 4", "D. 5"], jawaban: "C", pembahasan: "$x^2-2x-8=0 \\Rightarrow (x-4)(x+2)=0 \\Rightarrow x=4$ atau $x=-2$ → Jawaban C" },
  { no: 4, soal: "Fungsi $f(x) = x^2 - x - 12$ memotong sumbu X di titik $(p, 0)$ dan $(q, 0)$. Jika $p > q$, maka p dan q adalah …", options: ["A. 4 dan 3", "B. 4 dan -3", "C. 3 dan -4", "D. 3 dan 2"], jawaban: "B", pembahasan: "$(x-4)(x+3)=0 \\Rightarrow x=4$ atau $x=-3$. $p=4$, $q=-3$ → Jawaban B" },
  { no: 5, soal: "Titik potong kurva $f(x) = x^2 + 4x + 7$ dengan sumbu Y adalah …", options: ["A. (0, 7)", "B. (0, 3)", "C. (-2, 0)", "D. (-3, 3)"], jawaban: "A", pembahasan: "$f(0) = 7$ → titik $(0,7)$ → Jawaban A" },
  { no: 7, soal: "Sumbu simetri dari kurva $f(x) = x^2 + 6x + 5$ adalah …", options: ["A. $x = -3$", "B. $x = -35$", "C. $x = 52$", "D. $x = 3$"], jawaban: "A", pembahasan: "$x_p = -\\frac{6}{2} = -3$ → Jawaban A" },
  { no: 8, soal: "Sumbu simetri pada fungsi $f(x) = (x + 6)^2 - 5$ adalah …", options: ["A. $x = 6$", "B. $x = 5$", "C. $x = -3$", "D. $x = -6$"], jawaban: "D", pembahasan: "Puncak di $x=-6$ → sumbu simetri $x=-6$ → Jawaban D" },
  { no: 9, soal: "Nilai minimum fungsi $f(x) = 3(x + 2)^2 + 5$ adalah …", options: ["A. 17", "B. 8", "C. 5", "D. -7"], jawaban: "C", pembahasan: "$a=3>0$, minimum saat $x=-2$: $f(-2)=5$ → Jawaban C" },
  { no: 10, soal: "Nilai maksimum fungsi $f(x) = -x^2 + 6x + 7$ adalah …", options: ["A. 18", "B. 16", "C. 12", "D. 9"], jawaban: "B", pembahasan: "$x_p=3$, $f(3)=-9+18+7=16$ → Jawaban B" },
  { no: 11, soal: "Koordinat titik balik pada kurva $f(x) = x^2 - 10x + 29$ adalah …", options: ["A. (-5, 5)", "B. (-5, 4)", "C. (5, -4)", "D. (5, 4)"], jawaban: "D", pembahasan: "$x_p=5$, $y_p=25-50+29=4$ → $(5,4)$ → Jawaban D" },
  { no: 17, soal: "Nilai diskriminan pada fungsi $f(x) = -x^2 + 2x + 15$ adalah …", options: ["A. 64", "B. 56", "C. 36", "D. 25"], jawaban: "A", pembahasan: "$D = 4 - 4(-1)(15) = 4+60 = 64$ → Jawaban A" },
  { no: 18, soal: "Di antara fungsi kuadrat berikut yang grafiknya memotong sumbu x di dua titik adalah …", options: ["A. $f(x) = x^2 + 6x + 9$", "B. $f(x) = x^2 - x + 3$", "C. $f(x) = x^2 + x - 20$", "D. $f(x) = x^2 - 2x + 1$"], jawaban: "C", pembahasan: "D > 0:\nA: D=0, B: D<0, C: $D=1+80=81>0$ ✓, D: D=0 → Jawaban C" },
  { no: 19, soal: "Fungsi kuadrat yang grafiknya menyinggung sumbu x adalah …\n(i) $f(x) = x^2 - 16$\n(ii) $f(x) = x^2 - 25$\n(iii) $f(x) = x^2 + x - 20$\n(iv) $f(x) = x^2 - 10x + 25$", options: ["A. (i)", "B. (ii)", "C. (iii)", "D. (iv)"], jawaban: "D", pembahasan: "Menyinggung sumbu x → D=0\n(iv) $D=100-100=0$ ✓ → Jawaban D" },
  { no: 20, soal: "Agar grafik $f(x) = x^2 + (m-1)x - (m-4) = 0$ menyinggung sumbu x, nilai $m$ adalah …", options: ["A. 5", "B. 3", "C. 2", "D. -3"], jawaban: "B", pembahasan: "D=0: $(m-1)^2+4(m-4)=0$\n$m^2+2m-15=0$\n$(m+5)(m-3)=0 \\Rightarrow m=3$ → Jawaban B" },
  { no: 21, soal: "Persamaan grafik fungsi kuadrat yang mempunyai titik balik maksimum $(1, 2)$ dan melalui titik $(2, 3)$ adalah …", options: ["A. $y = x^2 - 2x + 1$", "B. $y = x^2 - 2x + 3$", "C. $y = x^2 + 2x - 1$", "D. $y = x^2 + 2x + 1$"], jawaban: "B", pembahasan: "$y=a(x-1)^2+2$. Substitusi $(2,3)$: $3=a+2 \\Rightarrow a=1$\n$y=(x-1)^2+2=x^2-2x+3$ → Jawaban B" },
  { no: 24, soal: "Peluru ditembakkan vertikal dengan rumus $h(t) = 120t - t^2$ meter. Tinggi maksimum peluru adalah …", options: ["A. 4.800 m", "B. 4.500 m", "C. 3.600 m", "D. 3.000 m"], jawaban: "C", pembahasan: "$t_p=60$ s, $h(60)=7200-3600=3600$ m → Jawaban C" },
  { no: 25, soal: "Tinggi bola tiap detik: $h(t) = 80 + 2t - t^2$ (cm). Bola menyentuh tanah pada detik ke …", options: ["A. 5", "B. 8", "C. 10", "D. 16"], jawaban: "C", pembahasan: "$t^2-2t-80=0 \\Rightarrow (t-10)(t+8)=0 \\Rightarrow t=10$ → Jawaban C" },
  { no: 26, soal: "Persegi panjang mempunyai luas 42 cm² dan keliling 34 cm. Lebar persegi panjang itu adalah …", options: ["A. 2 cm", "B. 3 cm", "C. 5 cm", "D. 14 cm"], jawaban: "B", pembahasan: "$p+l=17$, $pl=42$\n$(x-3)(x-14)=0 \\Rightarrow$ lebar $= 3$ cm → Jawaban B" },
  { no: 28, soal: "Grafik fungsi $g(x) = x^2 + 3$ dapat diperoleh dari grafik $f(x) = x^2$ dengan cara …", options: ["A. Menggeser $f(x)$ 3 satuan ke kanan", "B. Menggeser $f(x)$ 3 satuan ke kiri", "C. Menggeser $f(x)$ 3 satuan ke bawah", "D. Menggeser $f(x)$ 3 satuan ke atas"], jawaban: "D", pembahasan: "$g(x)=f(x)+3$ → geser ke atas 3 satuan → Jawaban D" },
  { no: 29, soal: "Grafik $L(x) = x^2 + 2x - 3$ dari grafik $K(x) = (x+1)^2$ dengan cara …", options: ["A. Menggeser $K(x)$, 4 satuan ke kiri", "B. Menggeser $K(x)$, 3 satuan ke kiri", "C. Menggeser $K(x)$, 4 satuan ke bawah", "D. Menggeser $K(x)$, 3 satuan ke bawah"], jawaban: "C", pembahasan: "$L(x)=(x+1)^2-4=K(x)-4$ → geser ke bawah 4 satuan → Jawaban C" },
];

const FungsiKuadratPage = () => (
  <TKAPemantapanLayout
    title="FUNGSI KUADRAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default FungsiKuadratPage;
