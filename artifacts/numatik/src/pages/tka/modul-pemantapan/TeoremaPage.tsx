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
  { no: 1, soal: "Diketahui ukuran segitiga:\ni. 1 cm, 1 cm, 1 cm\nii. 8 cm, 10 cm, 18 cm\niii. 12 cm, 21 cm, 8 cm\niv. 5 cm, 12 cm, 15 cm\nYang dapat membentuk suatu segitiga adalah ....", options: ["A. i dan iii", "B. iii dan iv", "C. i, iii dan iv", "D. i dan iv"] },
  { no: 2, soal: "Diketahui ukuran berikut:\ni. 2 cm, 2 cm, 2 cm\nii. 6 cm, 8 cm, 14 cm\niii. 7 cm, 15 cm, 25 cm\niv. 5 cm, 12 cm, 15 cm\nYang merupakan sisi pada segitiga adalah ..", options: ["A. i dan ii", "B. i dan iv", "C. ii dan iv", "D. iv saja"] },
  { no: 3, soal: "Perhatikan gambar! Dari pernyataan berikut yang benar adalah ....", options: ["A. $p = \\sqrt{r^2 + q^2}$", "B. $q = \\sqrt{r^2 - p^2}$", "C. $p = \\sqrt{q^2 - r^2}$", "D. $q = \\sqrt{r^2 + p^2}$"] },
  { no: 4, soal: "Panjang AC adalah..", options: ["A. 24 cm", "B. 28 cm", "C. 30 cm", "D. 32 cm"] },
  { no: 5, soal: "Perhatikan gambar! Panjang AD adalah....", options: ["A. 15 cm", "B. 17 cm", "C. 24 cm", "D. 25 cm"] },
  { no: 6, soal: "Perhatikan gambar berikut! Panjang BD adalah....", options: ["A. 12 cm", "B. 18 cm", "C. 18 cm", "D. 40 cm"] },
  { no: 7, soal: "Perhatikan gambar berikut! Keliling bangun ABCDE adalah....", options: ["A. 56 cm", "B. 74 cm", "C. 59 cm", "D. 86 cm"] },
  { no: 8, soal: "Perhatikan sisi-sisi segitiga di bawah\ni. 8, 15, dan 18\nii. 7, 24, dan 25\niii. 12, 15, dan 20\niv. 9, 12, dan 15\nYang merupakan tripel Pythagoras pada sisi-sisi segitiga diatas adalah...", options: ["A. i dan ii", "B. ii dan iii", "C. ii dan iv", "D. i dan iv"] },
  { no: 9, soal: "Besar kedua sudut segitiga $40°$ dan $70°$. Ditinjau dari panjang sisi dan besar sudutnya, jenis segitiga tersebut adalah....", options: ["A. segitiga lancip sama kaki", "B. segitiga siku-siku sama kaki", "C. segitiga tumpul sama kaki", "D. segitiga tumpul sembarang"] },
  { no: 10, soal: "Diketahui panjang sisi-sisi pada segitiga sebagai berikut:\n(1). 3 cm, 4 cm, 5 cm\n(2). 6 cm, 7 cm, 10 cm\n(3). 4 cm, 5 cm, 6 cm\n(4). 6 cm, 8 cm, 12 cm\nPanjang sisi-sisi diatas yang dapat membentuk segitiga tumpul adalah ...", options: ["A. (1) dan (2)", "B. (2) dan (3)", "C. (3) dan (4)", "D. (2) dan (4)"] },
  { no: 11, soal: "Perhatikan tabel berikut.\nPada tabel tersebut, segitiga yang merupakan segitiga siku-siku adalah .......", options: ["A. $\\triangle ABC$", "B. $\\triangle DEF$", "C. $\\triangle KLM$", "D. $\\triangle PQR$"] },
  { no: 12, soal: "Suatu segitiga mempunyai ukuran sisi-sisinya 8 cm, 15 cm, dan 20 cm. Segitiga tersebut merupakan jenis segitiga ....", options: ["A. lancip", "B. tumpul", "C. siku-siku", "D. sama kaki"] },
  { no: 13, soal: "Diketahui ukuran segitiga:\ni. 2 cm, 2 cm, 2 cm\nii. 6 cm, 8 cm, 14 cm\niii. 7 cm, 24 cm, 25 cm\niv. 5 cm, 12 cm, 15 cm\nYang merupakan segitiga tumpul adalah ..", options: ["A. i dan ii", "B. i dan iv", "C. ii dan iv", "D. iv saja"] },
  { no: 14, soal: "Diketahui sebuah segitiga memiliki sudut $45°$ dan $100°$, maka jika ditinjau dari sisinya dan sudut segitiga tersebut adalah......", options: ["A. Segitiga tumpul sama kaki", "B. Segitiga tumpul sebarang", "C. Segitiga lancip sama sisi", "D. Segitiga siku-siku sama kaki"] },
  { no: 15, soal: "Pernyataan yang benar untuk gambar di bawah adalah ...", options: ["A. $x = 6$ cm", "B. $x = 7$ cm", "C. luas segitiga $= 48$ cm$^2$", "D. keliling segitiga $= 21$ cm"] },
  { no: 16, soal: "Diketahui keliling belah ketupat 52 cm dan salah satu diagonalnya 24 cm. Luas belah ketupat ABCD adalah....", options: ["A. 312 cm$^2$", "B. 274 cm$^2$", "C. 240 cm$^2$", "D. 120 cm$^2$"] },
  { no: 17, soal: "Panjang diagonal dan lebar sebuah persegi panjang berturut-turut adalah 15 cm dan 9 cm. Panjang persegi panjang tersebut adalah ......", options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"] },
  { no: 18, soal: "Perhatikan gambar berikut.\nDari gambar diatas, berapa kira-kira panjang tali layar dari layang-layang agar layar tersebut menarik kapal pada sudut $45°$ dan berada pada ketinggian vertikal 150 m, seperti diperlihatkan pada gambar?", options: ["A. 175 m", "B. 212 m", "C. 285 m", "D. 300 m"] },
  { no: 19, soal: "Sebuah kapal berlayar dari pelabuhan Ambu menuju arah barat sejauh 100 mil ke pelabuhan Beta. Dari Beta ke arah selatan sejauh 50 mil menuju pelabuhan Cinta. Dari Cinta ke arah timur sejauh 170 mil ke pelabuhan Delta. Dari Delta ke arah utara sejauh 290 mil menuju pelabuhan Eco. Jarak terdekat dari pelabuhan Ambu ke pelabuhan Eco adalah...", options: ["A. 130 mil", "B. 170 mil", "C. 250 mil", "D. 260 mil"] },
  { no: 20, soal: "Perhatikan gambar.\nDiketahui AB = 15 cm, AF = 10 cm, BD = 12 cm. Luas bangun tersebut adalah ...", options: ["A. 140 cm$^2$", "B. 216 cm$^2$", "C. 250 cm$^2$", "D. 302 cm$^2$"] },
  { no: 21, soal: "Perhatikan gambar berikut.\nLuas daerah di atas adalah", options: ["A. 48 cm$^2$", "B. 98 cm$^2$", "C. 120 cm$^2$", "D. 144 cm$^2$"] },
  { no: 22, soal: "Kebun berbentuk belah ketupat dengan panjang masing-masing diagonalnya 12 m dan 16 m. Di sekeliling kebun akan ditanami pohon dengan jarak antar pohon 2 m.\nBanyaknya seluruh pohon adalah", options: ["A. 14 pohon", "B. 20 pohon", "C. 28 pohon", "D. 56 pohon"] },
  { no: 23, soal: "Perhatikan gambar layang-layang ABCD di bawah ini.\nJika panjang AC = 24 cm, panjang AB = 13 cm dan panjang AD = 20 cm. Hitunglah luas bangun layang-layang di atas!", options: [] },
  { no: 24, soal: "Perhatikan bangun datar jajargenjang ABCD di bawah ini.\nJika diketahui panjang AD = 13 cm, CD = 20 cm, dan BE = 15 cm. Hitunglah luas jajargenjang ABCD tersebut.", options: [] },
  { no: 25, soal: "Sebidang tanah berbentuk trapesium sama kaki, panjang sisi sejajarnya 24 m dan 14 m, dan jarak sisi sejajar 12 m. Jika sekeliling tanah tersebut dibuat pagar, panjang pagar seluruhnya adalah...", options: ["A. 50 m", "B. 51 m", "C. 62 m", "D. 64 m"] },
  { no: 26, soal: "Seseorang berada di atas gedung yang tingginya 12 m. Dia melihat dua buah benda A dan benda B di tanah dengan arah yang sama. Jika jarak pandang orang tersebut dengan benda A adalah 15 m dan dengan benda B adalah 20 m, maka jarak benda A dan benda B di tanah adalah...", options: ["A. 7 m", "B. 9 m", "C. 12 m", "D. 16 m"] },
  { no: 27, soal: "Pada gambar di bawah, jika panjang PR = 12 cm maka panjang QR dan PQ adalah ...", options: [] },
  {
    no: 28,
    soal: "Sebuah Helikopter terbang pada ketinggian 500 m di atas permukaan tanah. Helikopter tersebut melihat tiga titik di atas permukaan tanah, yaitu titik A, titik B, dan titik C.\nTentukanlah:\n1. jarak OA\n2. jarak AB\n3. jarak BC",
    options: [
      "A. $OA = 500$ m, $AB = 300$ m, $BC = 400$ m",
      "B. $OA = 400$ m, $AB = 300$ m, $BC = 500$ m",
      "C. $OA = 300$ m, $AB = 400$ m, $BC = 500$ m",
      "D. $OA = 500$ m, $AB = 400$ m, $BC = 300$ m",
    ],
  },
  { no: 29, soal: "Perhatikan gambar berikut.\nTentukanlah panjang sisi AB, AC, dan CD", options: [] },
  { no: 30, soal: "Hitunglah jarak antara titik $A(3, -2)$ dan titik $B(-5, 4)$ pada bidang koordinat Kartesius.", options: ["A. 8", "B. 10", "C. $10\\sqrt{2}$", "D. $\\sqrt{52}$"] },
  { no: 31, soal: "Jarak antara titik $P(k, 5)$ dan titik $Q(1, 1)$ adalah 5 satuan. Berapakah nilai k yang mungkin?", options: ["A. $k = 5$", "B. $k = 3$", "C. $k = -2$", "D. $k = 6$"] },
  { no: 32, soal: "Tiga titik di bidang koordinat adalah $K(2, 5)$, $L(6, 1)$, dan $M(10, 5)$. Tentukan jenis segitiga $\\triangle KLM$ dilihat dari panjang sisi-sisinya.", options: ["A. Segitiga Sembarang", "B. Segitiga Sama Kaki", "C. Segitiga Siku-siku", "D. Segitiga Sama Sisi"] },
  { no: 33, soal: "Titik $R(x, 0)$ terletak pada sumbu-x dan berjarak sama dari titik $A(2, 3)$ dan titik $B(5, -2)$. Berapakah koordinat titik R?", options: ["A. $R(4, 0)$", "B. $R(2, 0)$", "C. $R(3, 0)$", "D. $R\\left(\\frac{8}{3}, 0\\right)$"] },
];

const TeoremaPage = () => (
  <TKAPemantapanLayout
    title="TEOREMA PYTHAGORAS"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default TeoremaPage;
