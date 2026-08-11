import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { getTkaContohSoal } from "@/data/tkaContohSoal";

const materiSections: MateriSection[] = [
  { heading: "A. Sistem Koordinat Kartesius", content: `Sistem koordinat kartesius memposisikan titik dengan acuan sumbu-x (mendatar) dan sumbu-y (tegak) yang saling tegak lurus.\n\n- Sumbu X: ke kanan positif, ke kiri negatif\n- Sumbu Y: ke atas positif, ke bawah negatif\n- Titik potong = titik asal O(0, 0)\n- Koordinat titik ditulis (x, y)\n  - x = absis (jarak dari sumbu-Y)\n  - y = ordinat (jarak dari sumbu-X)` },
  { heading: "B. Kuadran", content: `Sumbu-X dan sumbu-Y membagi bidang menjadi 4 kuadran:\n- Kuadran I: x > 0, y > 0\n- Kuadran II: x < 0, y > 0\n- Kuadran III: x < 0, y < 0\n- Kuadran IV: x > 0, y < 0` },
  { heading: "C. Jarak Antara 2 Titik", content: `Jarak titik $P(x_1, y_1)$ ke $Q(x_2, y_2)$:\n\n$|PQ| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$` },
  { heading: "D. Titik Tengah Segmen", content: `Titik tengah antara $A(x_1, y_1)$ dan $B(x_2, y_2)$:\n\n$M = \\left(\\dfrac{x_1 + x_2}{2},\\ \\dfrac{y_1 + y_2}{2}\\right)$` },
  { heading: "E. Jarak Titik ke Garis", content: `Jarak titik $A(x_1, y_1)$ ke garis $ax + by + c = 0$:\n\n$d = \\dfrac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}$` },
  { heading: "F. Posisi Relatif", content: `Posisi relatif titik $T(x_2, y_2)$ terhadap titik acuan $D(x_1, y_1)$:\n\n$T_D = (x_2 - x_1,\\ y_2 - y_1)$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Perhatikan titik-titik pada koordinat kartesius berikut.\nTitik yang berkoordinat (1, 3) adalah.....", options: ["A. titik A", "B. titik B", "C. titik C", "D. titik D"] },
  { no: 2, soal: "Perhatikan gambar berikut. Koordinat titik Q adalah....", options: ["A. $(3, 1)$", "B. $(3, -1)$", "C. $(1, 3)$", "D. $(-1, 3)$"] },
  { no: 3, soal: "Perhatikan gambar di samping!\nKoordinat-koordinat di bawah ini yang sesuai dengan gambar adalah....", options: ["A. $A(-2, -4)$", "B. $B(5, 4)$", "C. $C(-2, 6)$", "D. $D(1, -4)$"] },
  { no: 4, soal: "Pada persegi EFGH dibawah ini, tentukan koordinat titik E dan G?", options: ["A. $E(0,0)$ dan $G(a,0)$", "B. $E(0,-1)$ dan $G(a,a)$", "C. $E(0,0)$ dan $G(a,a)$", "D. $E(0,-1)$ dan $G(a,0)$"] },
  { no: 5, soal: "Titik $P(-5, 7)$ terletak di kuadran...", options: ["A. II", "B. IV", "C. I", "D. III"] },
  { no: 6, soal: "Perhatikan gambar di samping!\nKoordinat titik C dan D berturut-turut $C(4, -3)$ dan $D(4, 1)$, bangun ABCD disebut...", options: ["A. jajargenjang", "B. layang-layang", "C. persegi", "D. persegi panjang"] },
  { no: 7, soal: "Bangun yang terbentuk dari titik $M(0,3)$, $N(0,-3)$ dan $O(7,0)$ adalah bangun ....", options: ["A. Segitiga sama sisi", "B. Segitiga sembarang", "C. Segitiga sama kaki", "D. Segitiga siku-siku"] },
  { no: 8, soal: "Diketahui titik $A(3,1)$, $B(3, 5)$, $C(-2, 5)$. Jika ketiga titik tersebut dihubungkan akan membentuk", options: ["A. segitiga sama sisi", "B. segitiga sama kaki", "C. segitiga siku-siku", "D. segitiga sembarang"] },
  { no: 9, soal: "Diketahui dalam koordinat Kartesius terdapat titik P, Q, dan R. Titik $P(4, 6)$ dan titik $Q(7, 1)$. Jika titik P, Q, dan R dihubungkan akan membentuk segitiga siku-siku, maka koordinat titik R adalah ....", options: ["A. $(6, 5)$", "B. $(4, 5)$", "C. $(6, 1)$", "D. $(4, 1)$"] },
  { no: 10, soal: "Diketahui segiempat ABCD dengan koordinat titik $A(-2, 5)$, $B(-2, 1)$, $C(4, 1)$, dan $D(4,5)$. Segiempat ABCD berbentuk....", options: ["A. persegi", "B. persegi panjang", "C. jajargenjang", "D. trapesium"] },
  { no: 11, soal: "Diketahui koordinat titik $A(-3, 5)$; $B(-5, 1)$; $C(-3, -3)$; dan $D(-1, 1)$. Jika keempat titik tersebut dihubungkan, ABCD membentuk bangun...", options: ["A. trapesium", "B. layang-layang", "C. jajargenjang", "D. belahketupat"] },
  { no: 12, soal: "Diketahui koordinat titik $A(-3, 5)$; $B(-5, 1)$; $C(-3, -3)$; dan $D(-1,1)$. Jika keempat titik tersebut dihubungkan, ABCD membentuk bangun ...", options: ["A. Trapesium", "B. Layang-Layang", "C. Jajargenjang", "D. Belahketupat"] },
  { no: 13, soal: "Jarak titik $(-3, 5)$ terhadap sumbu-x adalah ...", options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 8 satuan"] },
  { no: 14, soal: "Jarak titik $(-4, -5)$ terhadap sumbu-y adalah ...", options: ["A. 4 satuan", "B. 5 satuan", "C. 8 satuan", "D. 9 satuan"] },
  { no: 15, soal: "Jarak antara titik $P(3, 5)$ dan garis $x = -2$ adalah...", options: ["A. 7", "B. 3", "C. 1", "D. 5"] },
  { no: 16, soal: "Jarak antara titik $A(2, 3)$ dan $B(10, -3)$ adalah...", options: ["A. 12", "B. 14", "C. 10", "D. 8"] },
  { no: 17, soal: "Koordinat titik R berada di tengah-tengah garis PQ. Jika titik $P(-2, 5)$ dan $Q(4, -11)$, koordinat titik R adalah ...", options: ["A. $(2, -6)$", "B. $(1, -6)$", "C. $(1, -3)$", "D. $(3, 1)$"] },
  { no: 18, soal: "Titik tengah dari segmen garis yang menghubungkan titik $A(2, 8)$ dan $B(10, 4)$ adalah...", options: ["A. $(4, 2)$", "B. $(6, 6)$", "C. $(12, 12)$", "D. $(8, 4)$"] },
  { no: 19, soal: "Titik $M(5, -2)$ adalah titik tengah dari segmen garis PQ. Jika koordinat titik P adalah $(8, 3)$, maka koordinat titik Q adalah...", options: ["A. $(3, -5)$", "B. $(2, -7)$", "C. $(6.5, 0.5)$", "D. $(11, -1)$"] },
  { no: 20, soal: "Titik $M(4, -1)$ adalah titik tengah dari ruas garis AB. Jika koordinat titik A adalah $(1, 5)$, maka koordinat titik B adalah...", options: ["A. $(2.5, 2)$", "B. $(5, 4)$", "C. $(7, -7)$", "D. $(3, -6)$"] },
  { no: 21, soal: "Titik M adalah titik tengah dari $A(1, 1)$ dan $B(3, 5)$. Jarak dari titik M ke garis $x = 7$ adalah...", options: ["A. 3", "B. 4", "C. 5", "D. 2"] },
  { no: 22, soal: "Luas segitiga yang titik-titik sudutnya adalah $P(0, 0)$, $Q(6, 4)$, dan $R(8, 2)$ adalah...", options: ["A. 12", "B. 10", "C. 14", "D. 20"] },
  { no: 23, soal: "Titik $P(x, 5)$ berjarak 10 satuan dari titik $Q(-4, -1)$. Salah satu nilai x yang mungkin adalah...", options: ["A. 2", "B. 12", "C. 6", "D. 4"] },
  { no: 24, soal: "Jarak tegak lurus dari titik $P(2, 5)$ ke garis $3x + 4y - 6 = 0$ adalah ...", options: ["A. 5", "B. 4", "C. 20", "D. 26"] },
  { no: 25, soal: "Jarak titik $(3, -5)$ terhadap titik acuan $(0, 1)$ adalah ...", options: ["A. Tiga langkah ke kanan dan enam langkah ke atas", "B. Tiga langkah ke kanan dan enam langkah ke bawah", "C. Tiga langkah ke kiri dan enam langkah ke atas", "D. Enam langkah ke kanan dan tiga langkah ke atas"] },
];

const KoordinatCartesiusPage = () => (
  <TKAPemantapanLayout
    title="KOORDINAT KARTESIUS"
    materiSections={materiSections}
    contohSoal={getTkaContohSoal("koordinat-kartesius")}
    latihanDasar={latihanDasar}
  />
);

export default KoordinatCartesiusPage;
