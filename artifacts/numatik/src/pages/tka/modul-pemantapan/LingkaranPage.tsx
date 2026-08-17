import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { getTkaContohSoal } from "@/data/tkaContohSoal";
import { latihanDasar as latihanOlimpiade, dasarImages as lingkaranImages } from "@/pages/OlimpiadeLingkaranPage";
import { lingkaranOlimpiadePembahasan } from "@/data/pembahasan/lingkaranOlimpiade";

const materiSections: MateriSection[] = [
  { heading: "A. Unsur-unsur Lingkaran", content: `- Pusat (O): titik yang berjarak sama dari semua titik pada lingkaran\n- Jari-jari (r): jarak dari pusat ke tepi lingkaran\n- Diameter (d): dua kali jari-jari, $d = 2r$\n- Busur: bagian keliling lingkaran\n- Tali busur: garis lurus menghubungkan dua titik pada lingkaran\n- Apotema: jarak terpendek dari pusat ke tali busur\n- Juring (sektor): daerah antara dua jari-jari dan busur\n- Tembereng: daerah antara tali busur dan busur` },
  { heading: "B. Keliling dan Luas Lingkaran", content: `Keliling (K): $K = 2\\pi r = \\pi d$\n\nLuas (L): $L = \\pi r^2$\n\nDengan $\\pi \\approx \\frac{22}{7}$ atau $\\pi \\approx 3,14$` },
  { heading: "C. Panjang Busur dan Luas Juring", content: `Panjang busur (PB) dengan sudut pusat α:\n$PB = \\dfrac{\\alpha}{360°} \\times 2\\pi r$\n\nLuas juring (LJ):\n$LJ = \\dfrac{\\alpha}{360°} \\times \\pi r^2$\n\nLuas tembereng:\n$L_{tembereng} = L_{juring} - L_{segitiga}$` },
  { heading: "D. Hubungan Sudut Pusat dan Sudut Keliling", content: `Sudut keliling yang menghadap busur yang sama:\n$\\angle keliling = \\dfrac{1}{2} \\angle pusat$\n\nSemua sudut keliling yang menghadap busur yang sama adalah sama besar.\n\nSudut keliling yang menghadap diameter = 90°` },
  { heading: "E. Garis Singgung Lingkaran", content: `Garis singgung lingkaran adalah garis yang hanya menyentuh lingkaran di satu titik (titik singgung).\n\nSifat: Garis singgung tegak lurus jari-jari di titik singgung.\n\nDua garis singgung dari titik luar:\n$PT^2 = PO^2 - r^2$\n\nGaris singgung persekutuan luar dua lingkaran:\n$d^2 = p^2 - (R-r)^2$\n\nGaris singgung persekutuan dalam:\n$d^2 = p^2 - (R+r)^2$\n\nDimana $p$ = jarak antar pusat, $R$ = jari-jari besar, $r$ = jari-jari kecil.` },
];

const latihanDasarTkaLama: LatihanSoal[] = [
  { no: 1, soal: "Perhatikan gambar!\nJika O adalah pusat lingkaran, jika r = 21 cm dan $\\pi = \\frac{22}{7}$, maka luas daerah yang diarsir adalah ...", options: ["A. 77 $cm^2$", "B. 154 $cm^2$", "C. 231 $cm^2$", "D. 308 $cm^2$"] },
  { no: 2, soal: "Perhatikan gambar lingkaran di samping! Jika O pusat lingkaran, dan panjang OP = 21 cm, maka panjang busur kecil PQ adalah.... ($\\pi = \\frac{22}{7}$)\nLuas juring dengan sudut pusat $120^0$ dan panjang jari-jari 7 cm adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 77 $cm^2$", "B. 51,33 $cm^2$", "C. 38,50 $cm^2$", "D. 14,67 $cm^2$"] },
  { no: 3, soal: "Perhatikanlah gambar berikut.\nDiketahui O adalah titik pusat lingkaran. Jika panjang busur QR = 60 cm, panjang busur PQ adalah...", options: ["A. 40 cm", "B. 45 cm", "C. 50 cm", "D. 55 cm"] },
  { no: 4, soal: "Perhatikan gambar!\nJika luas juring ORS = 60 $cm^2$, luas juring OPQ adalah...", options: ["A. 40 $cm^2$", "B. 75 $cm^2$", "C. 90 $cm^2$", "D. 105 $cm^2$"] },
  { no: 5, soal: "Pada suatu lingkaran dengan pusat O diketahui titik A, B, C, dan D pada keliling lingkaran, sehingga $\\angle AOB = 35°$ dan $\\angle COD = 140°$. Jika panjang busur AB = 14 cm, hitunglah panjang busur CD.", options: ["A. 28 cm", "B. 42 cm", "C. 56 cm", "D. 70 cm"] },
  { no: 6, soal: "Luas daerah yang diarsir pada gambar berikut adalah ...", options: ["A. 496,44 $cm^2$", "B. 718,2 $cm^2$", "C. 992,88 $cm^2$", "D. 1827 $cm^2$"] },
  { no: 7, soal: "Luas daerah yang diarsir pada gambar berikut adalah ...", options: ["A. 59,5 $cm^2$", "B. 112 $cm^2$", "C. 119 $cm^2$", "D. 224 $cm^2$"] },
  { no: 8, soal: "Keliling daerah yang diarsir pada gambar berikut adalah ...", options: ["A. 47,1 cm", "B. 62,8 cm", "C. 78,5 cm", "D. 94,2 cm"] },
  { no: 9, soal: "Keliling daerah yang diarsir pada gambar berikut adalah ...", options: [] },
  { no: 10, soal: "Luas daerah yang diarsir pada gambar berikut adalah ...", options: [] },
  { no: 11, soal: "Perhatikan gambar berikut!\nKeliling bangun tersebut adalah ...", options: ["A. 213,6 cm", "B. 221,2 cm", "C. 253,6 cm.", "D. 267,6 cm"] },
  { no: 12, soal: "Perhatikan gambar berikut\nJika total luas bangun di atas 480 $cm^2$, maka luas daerah persegi adalah ...", options: ["A. 24 $cm^2$", "B. 56 $cm^2$", "C. 72 $cm^2$", "D. 84 $cm^2$"] },
  { no: 13, soal: "Perhatikan gambar persegipanjang dan lingkaran berikut!\nDiketahui A dan B adalah pusat dua lingkaran yang kongruen dan saling bersinggungan luar. ABQP adalah persegi panjang. Luas daerah yang diarsir seluruhnya adalah 1.316 $cm^2$. Luas persegi panjang ABQP adalah....($\\pi = \\frac{22}{7}$)", options: ["A. 196 $cm^2$", "B. 392 $cm^2$", "C. 492 $cm^2$", "D. 512 $cm^2$"] },
  { no: 14, soal: "Perhatikan gambar di samping ini!\nDiketahui O adalah titik pusat lingkaran. Besar sudut AOB adalah ....", options: ["A. 15°", "B. 30°", "C. 45°", "D. 60°"] },
  { no: 15, soal: "Perhatikan gambar!\nTitik O adalah pusat lingkaran. Diketahui $\\angle ABE + \\angle ACE + \\angle ADE = 96°$ Besar $\\angle AOE$ adalah....", options: ["A. 32°", "B. 48°", "C. 64°", "D. 84°"] },
  { no: 16, soal: "Perhatikan gambar di bawah ini!,\nBesar $\\angle OAD = 20^0$, besar $\\angle OBD = 30^0$, maka besar sudut BOC adalah ....", options: ["A. $50^0$", "B. $70^0$", "C. $80^0$", "D. $100^0$"] },
  { no: 17, soal: "Pada gambar di bawah ini diketahui besar $\\angle AOC = 82^0$.\nBesar sudut $\\angle BDC$ adalah ...", options: ["A. $41^0$", "B. $49^0$", "C. $82^0$", "D. $98^0$"] },
  { no: 18, soal: "Perhatikan gambar berikut!\nJika besar sudut AOC = $112^0$, maka besar sudut ABC adalah ....", options: ["A. $124^0$", "B. $114^0$", "C. $68^0$", "D. $56^0$"] },
  { no: 19, soal: "Perhatikanlah gambar di bawah.\nHitunglah besar sudut $\\angle BAC$, $\\angle ADC$, $\\angle DAC$.", options: [] },
  { no: 20, soal: "Perhatikanlah gambar di bawah,\nHitunglah besar $\\angle DCB$, $\\angle BAD$, $\\angle ADC$", options: [] },
  { no: 21, soal: "Perhatikan gambar berikut!\nJika besar sudut COD = $48^0$, maka besar sudut ABC adalah ....", options: ["A. $132^0$", "B. $124^0$", "C. $122^0$", "D. $114^0$"] },
  { no: 22, soal: "Ayah akan membuat taman berbentuk lingkaran dengan jari-jari 35 m. Di sekeliling taman akan ditanami pohon cemara dengan jarak 1 m. Jika satu pohon memerlukan biaya Rp 25.000,00, seluruh biaya penanaman pohon cemara adalah....", options: ["A. Rp 5.900.000,00", "B. Rp 5.700.000,00", "C. Rp 5.500.000,00", "D. Rp 5.200.000,00"] },
  { no: 23, soal: "Sebuah roda yang berdiameter 50 cm berputar 60 kali. Jika $\\pi = 3,14$, maka jarak yang ditempuh adalah ....", options: ["A. 94,2 m", "B. 942 m", "C. 47,1 m", "D. 471 m"] },
  { no: 24, soal: "Sebuah roda berputar 40 kali menempuh jarak 52,8 m. Jika $\\pi = 22/7$, maka jari-jari roda tersebut adalah ....", options: ["A. 14 cm", "B. 21 cm", "C. 28 cm", "D. 42 cm"] },
  { no: 25, soal: "Seorang pengusaha akan membuat bianglala seperti yang ada di Dufan.\nJika tempat duduk pada bianglala sebanyak 44 buah dan masing-masing tempat duduk berjarak 3 m, berapakah panjang jari-jari bianglala?", options: ["A. 7 m", "B. 10,5 m", "C. 14 m", "D. 21 m"] },
  { no: 26, soal: "Perhatikan gambar berikut!\nKolam ikan Pak Arvin tampak seperti gambar di atas. Jika di sekeliling akan dipagari dengan kawat berduri dua kali putaran, maka dibutuhkan kawat berduri minimum sepanjang......", options: ["A. 72 m", "B. 86 m", "C. 144 m", "D. 172 m"] },
  { no: 27, soal: "Sebuah tonggak ditengah lapangan rumput berbentuk persegipanjang berukuran 15 m x 20 m. Seekor kambing diikat di tonggak dengan tali yang panjangnya 7 m. Berapa luas lapangan yang rumputnya tidak termakan kambing?", options: ["A. 100 $m^2$", "B. 146 $m^2$", "C. 154 $m^2$", "D. 300 $m^2$"] },
  { no: 28, soal: "Perhatikan gambar berikut!\nKolam pak Tedi bentuk dan ukuran Nampak seperti gambar.\nJika keliling kolam diberi pagar kawat dua kali putaran, maka dibutuhkan kawat minimum sepanjang ....", options: ["A. 66 m", "B. 88 m", "C. 132 m", "D. 180 m"] },
  { no: 29, soal: "Perhatikan gambar berikut.\nPanjang OP adalah ....", options: ["A. 16 cm", "B. 26 cm", "C. 34 cm", "D. 36 cm"] },
  { no: 30, soal: "Panjang jari-jari dua lingkaran masing-masing adalah 2 cm dan 10 cm. Panjang garis singgung persekutuan luarnya adalah 15 cm. Jarak kedua titik pusat lingkaran adalah ....", options: ["A. 13 cm", "B. 17 cm", "C. 23 cm", "D. 17 cm"] },
  { no: 31, soal: "Perhatikan gambar berikut.\nPada gambar tersebut, panjang jari-jari AD = 8 cm, panjang jari-jari BC = 3 cm, dan jarak AB = 13 cm. Luas trapesium ABCD adalah ....", options: ["A. 46 $cm^2$", "B. 56 $cm^2$", "C. 66 $cm^2$", "D. 76 $cm^2$"] },
  { no: 32, soal: "Perhatikan gambar berikut.\nPanjang garis singgung persekutuan dalam adalah ...", options: ["A. 12 cm", "B. 14 cm", "C. 16 cm", "D. 18 cm"] },
  { no: 33, soal: "Perbandingan jari-jari dua lingkaran adalah 1 : 2. Panjang garis singgung persekutuan dalam kedua lingkaran tersebut adalah 12 cm dan jarak antara kedua pusatnya 15 cm. Panjang jari-jari masing masing lingkaran adalah ....", options: ["A. 2 cm dan 4 cm", "B. 3 cm dan 6 cm", "C. 4 cm dan 8 cm", "D. 5 cm dan 10 cm"] },
  { no: 34, soal: "Perhatikan gambar di bawah ini.\nPanjang AD = 3,5 cm, panjang BE = 1,5 cm, dan jarak AB = 8 cm. Luas $\\triangle ABC$ adalah ....", options: ["A. $5\\sqrt{39}$", "B. $\\frac{1}{2}\\sqrt{39}$", "C. $\\frac{5}{2}\\sqrt{39}$", "D. $\\frac{3}{2}\\sqrt{39}$"] },
  { no: 35, soal: "Gambar berikut ini adalah penampang 6 buah kaleng cat yang berbentuk tabung dan berjari-jari 14 cm. Panjang tali terpendek yang dibutuhkan untuk mengikat keenam kaleng cat tersebut adalah ....", options: ["A. 256 cm", "B. 258 cm", "C. 260 cm", "D. 262 cm"] },
  { no: 36, soal: "Gambar di bawah ini adalah penampang 10 buah gelas berbentuk tabung dengan jari-jari 10 cm. Panjang tali minimal yang diperlukan untuk mengikat gelas-gelas tersebut dengan susunan seperti dalam gambar adalah ....", options: ["A. 261,8 cm", "B. 262,8 cm", "C. 261,6 cm", "D. 262,6 cm"] },
];

const LingkaranPage = () => (
  <TKAPemantapanLayout
    title="LINGKARAN"
    materiSections={materiSections}
    contohSoal={getTkaContohSoal("lingkaran")}
  latihanDasar={latihanOlimpiade.map((soal) => ({ ...soal, pembahasan: lingkaranOlimpiadePembahasan[soal.no] ? JSON.stringify(lingkaranOlimpiadePembahasan[soal.no]) : "" }))}
  gambarMap={Object.fromEntries(Object.entries(lingkaranImages).map(([no, src]) => [Number(no), <img src={src} alt={`Gambar soal ${no}`} className="mx-auto w-full max-w-sm rounded-lg border border-border/40 bg-background p-2" />]))}
  />
);

export default LingkaranPage;
