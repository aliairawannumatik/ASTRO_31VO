import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  {
    heading: "A. Konsep Dasar Pythagoras",
    content: `1. Kuadrat bilangan
$a^2 = a \\times a$ atau $a^2 = (-a) \\times (-a)$

2. Akar dari bilangan pada konsep Teorema Pythagoras diambil yang hasilnya positif karena sisi pada segitiga adalah bilangan positif.
$x^2 = p^2$ maka $x = p$
$x^2 = p$ maka $x = \\sqrt{p}$
$\\sqrt{a^2p} = a\\sqrt{p}$

3. Jika a, b, c merupakan sisi segitiga dan c merupakan sisi yang paling panjang, maka untuk membuat suatu segitiga harus dipenuhi syarat:
$c < a + b$

4. Jika a, b, c merupakan sisi segitiga dan c paling panjang:
$c^2 > a^2 + b^2$ : segitiga tumpul di C
$c^2 = a^2 + b^2$ : segitiga siku-siku di C
$c^2 < a^2 + b^2$ : segitiga lancip di C`,
  },
  {
    heading: "B. Teorema Pythagoras",
    content: `Diketahui segitiga siku-siku dengan sisi terpanjang c (sisi miring yang berhadapan dengan sudut siku-siku), sisi tegak a dan b, maka berlaku:

"Sisi terpanjang (sisi miring) kuadrat sama dengan jumlah kuadrat sisi-sisi lainnya."

$c^2 = a^2 + b^2$`,
  },
  {
    heading: "C. Jarak Antara 2 Titik Koordinat",
    content: `$|PQ| = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$

$|PQ|$: jarak titik P dan Q`,
  },
  {
    heading: "D. Sudut Khusus pada Segitiga Siku-siku",
    content: `1. Sudut $30°$ dan $60°$
Pada segitiga siku-siku dengan sudut $30°$, $60°$, dan $90°$:
- Sisi di depan sudut $30°$ = $\\frac{1}{2}$ sisi miring
- Sisi di depan sudut $60°$ = $\\frac{\\sqrt{3}}{2}$ sisi miring

2. Sudut $45°$
Pada segitiga siku-siku sama kaki dengan sudut $45°$, $45°$, dan $90°$:
- Kedua sisi tegak sama panjang
- Sisi miring = $\\sqrt{2}$ kali sisi tegak`,
  },
  {
    heading: "E. Tripel Pythagoras",
    content: `Tripel Pythagoras adalah 3 bilangan asli yang memenuhi teorema Pythagoras.\n\nTripel dasar yang sering muncul:\n- 3, 4, 5 (dan kelipatannya: 6,8,10 ; 9,12,15 ; ...)\n- 5, 12, 13 (dan kelipatannya: 10,24,26 ; ...)\n- 7, 24, 25\n- 8, 15, 17\n- 9, 40, 41`,
  },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui ukuran segitiga:\ni. 1 cm, 1 cm, 1 cm\nii. 8 cm, 10 cm, 18 cm\niii. 12 cm, 21 cm, 8 cm\niv. 5 cm, 12 cm, 15 cm\nYang dapat membentuk suatu segitiga adalah …", options: ["A. i dan iii", "B. iii dan iv", "C. i, iii dan iv", "D. i dan iv"] },
  { no: 2, soal: "Diketahui ukuran berikut:\ni. 2 cm, 2 cm, 2 cm\nii. 6 cm, 8 cm, 14 cm\niii. 7 cm, 15 cm, 25 cm\niv. 5 cm, 12 cm, 15 cm\nYang merupakan sisi pada segitiga adalah …", options: ["A. i dan ii", "B. i dan iv", "C. ii dan iv", "D. iv saja"] },
  { no: 8, soal: "Perhatikan sisi-sisi segitiga:\ni. 8, 15, dan 18\nii. 7, 24, dan 25\niii. 12, 15, dan 20\niv. 9, 12, dan 15\nYang merupakan tripel Pythagoras adalah …", options: ["A. i dan ii", "B. ii dan iii", "C. ii dan iv", "D. i dan iv"], jawaban: "C", pembahasan: "ii: $7^2 + 24^2 = 49 + 576 = 625 = 25^2$ ✓\niv: $9^2 + 12^2 = 81 + 144 = 225 = 15^2$ ✓ → Jawaban C" },
  { no: 10, soal: "Panjang sisi-sisi segitiga berikut yang membentuk segitiga tumpul adalah …\n(1) 3, 4, 5\n(2) 6, 7, 10\n(3) 4, 5, 6\n(4) 6, 8, 12", options: ["A. (1) dan (2)", "B. (2) dan (3)", "C. (3) dan (4)", "D. (2) dan (4)"], jawaban: "D", pembahasan: "Segitiga tumpul: $c^2 > a^2 + b^2$\n(2): $10^2 = 100 > 36+49 = 85$ ✓\n(4): $12^2 = 144 > 36+64 = 100$ ✓ → Jawaban D" },
  { no: 12, soal: "Suatu segitiga mempunyai sisi-sisi 8 cm, 15 cm, dan 20 cm. Segitiga tersebut adalah …", options: ["A. lancip", "B. tumpul", "C. siku-siku", "D. sama kaki"], jawaban: "B", pembahasan: "$20^2 = 400$, $8^2 + 15^2 = 64 + 225 = 289$\n$400 > 289$ → segitiga tumpul → Jawaban B" },
  { no: 16, soal: "Keliling belah ketupat 52 cm dan salah satu diagonalnya 24 cm. Luas belah ketupat ABCD adalah …", options: ["A. 312 cm²", "B. 274 cm²", "C. 240 cm²", "D. 120 cm²"], jawaban: "C", pembahasan: "Sisi = 52/4 = 13 cm\nSetengah diagonal 1 = 12 cm\nSetengah diagonal 2 = $\\sqrt{13^2 - 12^2} = \\sqrt{25} = 5$ cm\nDiagonal 2 = 10 cm\nLuas = $\\frac{1}{2} \\times 24 \\times 10 = 120$ cm² → Jawaban D" },
  { no: 17, soal: "Panjang diagonal dan lebar sebuah persegi panjang berturut-turut adalah 15 cm dan 9 cm. Panjang persegi panjang tersebut adalah …", options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"], jawaban: "C", pembahasan: "$p = \\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = 12$ cm → Jawaban C" },
  { no: 19, soal: "Sebuah kapal berlayar dari pelabuhan Ambu ke arah barat 100 mil ke pelabuhan Beta. Dari Beta ke selatan 50 mil ke pelabuhan Cinta. Dari Cinta ke timur 170 mil ke pelabuhan Delta. Dari Delta ke utara 290 mil ke pelabuhan Eco. Jarak terdekat dari Ambu ke Eco adalah …", options: ["A. 130 mil", "B. 170 mil", "C. 250 mil", "D. 260 mil"], jawaban: "D", pembahasan: "Koordinat: Ambu(0,0), Beta(-100,0), Cinta(-100,-50), Delta(70,-50), Eco(70,240)\nJarak Ambu ke Eco = $\\sqrt{70^2 + 240^2} = \\sqrt{4900 + 57600} = \\sqrt{62500} = 250$ mil → Jawaban C" },
  { no: 25, soal: "Sebidang tanah berbentuk trapesium sama kaki, panjang sisi sejajarnya 24 m dan 14 m, dan jarak sisi sejajar 12 m. Jika sekeliling tanah dibuat pagar, panjang pagar seluruhnya adalah …", options: ["A. 50 m", "B. 51 m", "C. 62 m", "D. 64 m"], jawaban: "C", pembahasan: "Kaki trapesium = $\\sqrt{12^2 + 5^2} = \\sqrt{169} = 13$ m\nKeliling = 24 + 14 + 13 + 13 = 64 m → Jawaban D" },
  { no: 30, soal: "Jarak antara titik $A(3, -2)$ dan titik $B(-5, 4)$ pada bidang koordinat Kartesius adalah …", options: ["A. 8", "B. 10", "C. $10\\sqrt{2}$", "D. $\\sqrt{52}$"], jawaban: "B", pembahasan: "$d = \\sqrt{(-5-3)^2 + (4-(-2))^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10$ → Jawaban B" },
  { no: 31, soal: "Jarak antara titik $P(k, 5)$ dan titik $Q(1, 1)$ adalah 5 satuan. Berapakah nilai k yang mungkin?", options: ["A. $k = 5$", "B. $k = 3$", "C. $k = -2$", "D. $k = 6$"], jawaban: "B", pembahasan: "$\\sqrt{(k-1)^2 + 16} = 5$\n$(k-1)^2 = 9$\n$k-1 = \\pm 3 \\Rightarrow k = 4$ atau $k = -2$\nDari pilihan, $k = -2$ → Jawaban C" },
  { no: 32, soal: "Tiga titik di bidang koordinat: $K(2,5)$, $L(6,1)$, $M(10,5)$. Jenis segitiga $\\triangle KLM$ dilihat dari panjang sisinya adalah …", options: ["A. Segitiga Sembarang", "B. Segitiga Sama Kaki", "C. Segitiga Siku-siku", "D. Segitiga Sama Sisi"], jawaban: "B", pembahasan: "KL = $\\sqrt{16+16} = 4\\sqrt{2}$, LM = $\\sqrt{16+16} = 4\\sqrt{2}$, KM = 8\nDua sisi sama → sama kaki → Jawaban B" },
];

const TeoremaPage = () => (
  <TKAPemantapanLayout
    title="TEOREMA PYTHAGORAS"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default TeoremaPage;
