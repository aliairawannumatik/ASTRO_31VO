import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Sistem Koordinat Kartesius", content: `Sistem koordinat kartesius memposisikan titik dengan acuan sumbu-x (mendatar) dan sumbu-y (tegak) yang saling tegak lurus.\n\n- Sumbu X: ke kanan positif, ke kiri negatif\n- Sumbu Y: ke atas positif, ke bawah negatif\n- Titik potong = titik asal O(0, 0)\n- Koordinat titik ditulis (x, y)\n  - x = absis (jarak dari sumbu-Y)\n  - y = ordinat (jarak dari sumbu-X)` },
  { heading: "B. Kuadran", content: `Sumbu-X dan sumbu-Y membagi bidang menjadi 4 kuadran:\n- Kuadran I: x > 0, y > 0\n- Kuadran II: x < 0, y > 0\n- Kuadran III: x < 0, y < 0\n- Kuadran IV: x > 0, y < 0` },
  { heading: "C. Jarak Antara 2 Titik", content: `Jarak titik $P(x_1, y_1)$ ke $Q(x_2, y_2)$:\n\n$|PQ| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$` },
  { heading: "D. Titik Tengah Segmen", content: `Titik tengah antara $A(x_1, y_1)$ dan $B(x_2, y_2)$:\n\n$M = \\left(\\dfrac{x_1 + x_2}{2},\\ \\dfrac{y_1 + y_2}{2}\\right)$` },
  { heading: "E. Jarak Titik ke Garis", content: `Jarak titik $A(x_1, y_1)$ ke garis $ax + by + c = 0$:\n\n$d = \\dfrac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}$` },
  { heading: "F. Posisi Relatif", content: `Posisi relatif titik $T(x_2, y_2)$ terhadap titik acuan $D(x_1, y_1)$:\n\n$T_D = (x_2 - x_1,\\ y_2 - y_1)$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 5, soal: "Titik $P(-5, 7)$ terletak di kuadran …", options: ["A. II", "B. IV", "C. I", "D. III"], jawaban: "A", pembahasan: "x < 0 dan y > 0 → Kuadran II → Jawaban A" },
  { no: 7, soal: "Bangun yang terbentuk dari titik $M(0,3)$, $N(0,-3)$ dan $O(7,0)$ adalah …", options: ["A. Segitiga sama sisi", "B. Segitiga sembarang", "C. Segitiga sama kaki", "D. Segitiga siku-siku"], jawaban: "C", pembahasan: "MN = 6, MO = $\\sqrt{49+9} = \\sqrt{58}$, NO = $\\sqrt{49+9} = \\sqrt{58}$\nDua sisi sama → sama kaki → Jawaban C" },
  { no: 8, soal: "Titik $A(3,1)$, $B(3,5)$, $C(-2,5)$ dihubungkan membentuk …", options: ["A. segitiga sama sisi", "B. segitiga sama kaki", "C. segitiga siku-siku", "D. segitiga sembarang"], jawaban: "C", pembahasan: "AB vertikal (x sama), BC mendatar (y sama) → sudut siku-siku di B → Jawaban C" },
  { no: 10, soal: "Segiempat ABCD dengan $A(-2,5)$, $B(-2,1)$, $C(4,1)$, $D(4,5)$ berbentuk …", options: ["A. persegi", "B. persegi panjang", "C. jajargenjang", "D. trapesium"], jawaban: "B", pembahasan: "AB = CD = 4, BC = AD = 6, semua sudut 90° → persegi panjang → Jawaban B" },
  { no: 13, soal: "Jarak titik $(-3, 5)$ terhadap sumbu-x adalah …", options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 8 satuan"], jawaban: "C", pembahasan: "Jarak ke sumbu-x = |y| = |5| = 5 → Jawaban C" },
  { no: 14, soal: "Jarak titik $(-4, -5)$ terhadap sumbu-y adalah …", options: ["A. 4 satuan", "B. 5 satuan", "C. 8 satuan", "D. 9 satuan"], jawaban: "A", pembahasan: "Jarak ke sumbu-y = |x| = |-4| = 4 → Jawaban A" },
  { no: 15, soal: "Jarak antara titik $P(3, 5)$ dan garis $x = -2$ adalah …", options: ["A. 7", "B. 3", "C. 1", "D. 5"], jawaban: "A", pembahasan: "Jarak = |3 - (-2)| = 5... → periksa: garis x=-2, titik x=3, jarak = 3-(-2) = 5 → Jawaban D" },
  { no: 16, soal: "Jarak antara titik $A(2, 3)$ dan $B(10, -3)$ adalah …", options: ["A. 12", "B. 14", "C. 10", "D. 8"], jawaban: "C", pembahasan: "$d = \\sqrt{(10-2)^2 + (-3-3)^2} = \\sqrt{64+36} = \\sqrt{100} = 10$ → Jawaban C" },
  { no: 17, soal: "Titik R berada di tengah garis PQ. $P(-2, 5)$ dan $Q(4, -11)$. Koordinat R adalah …", options: ["A. $(2, -6)$", "B. $(1, -6)$", "C. $(1, -3)$", "D. $(3, 1)$"], jawaban: "C", pembahasan: "$R = \\left(\\frac{-2+4}{2}, \\frac{5+(-11)}{2}\\right) = (1, -3)$ → Jawaban C" },
  { no: 18, soal: "Titik tengah dari segmen garis $A(2, 8)$ dan $B(10, 4)$ adalah …", options: ["A. $(4, 2)$", "B. $(6, 6)$", "C. $(12, 12)$", "D. $(8, 4)$"], jawaban: "B", pembahasan: "$M = \\left(\\frac{2+10}{2}, \\frac{8+4}{2}\\right) = (6, 6)$ → Jawaban B" },
  { no: 19, soal: "Titik $M(5, -2)$ adalah titik tengah PQ. Titik $P(8, 3)$. Koordinat Q adalah …", options: ["A. $(3, -5)$", "B. $(2, -7)$", "C. $(6.5, 0.5)$", "D. $(11, -1)$"], jawaban: "B", pembahasan: "$Q = (2 \\times 5 - 8,\\ 2 \\times (-2) - 3) = (2, -7)$ → Jawaban B" },
  { no: 20, soal: "Titik $M(4, -1)$ titik tengah AB. $A(1, 5)$. Koordinat B adalah …", options: ["A. $(2.5, 2)$", "B. $(5, 4)$", "C. $(7, -7)$", "D. $(3, -6)$"], jawaban: "C", pembahasan: "$B = (2 \\times 4 - 1,\\ 2 \\times (-1) - 5) = (7, -7)$ → Jawaban C" },
  { no: 21, soal: "Titik M adalah titik tengah $A(1,1)$ dan $B(3,5)$. Jarak dari M ke garis $x = 7$ adalah …", options: ["A. 3", "B. 4", "C. 5", "D. 2"], jawaban: "C", pembahasan: "$M = (2, 3)$\nJarak ke $x=7$: $|2-7| = 5$ → Jawaban C" },
  { no: 22, soal: "Luas segitiga dengan titik sudut $P(0,0)$, $Q(6,4)$, $R(8,2)$ adalah …", options: ["A. 12", "B. 10", "C. 14", "D. 20"], jawaban: "B", pembahasan: "Luas = $\\frac{1}{2}|x_P(y_Q - y_R) + x_Q(y_R - y_P) + x_R(y_P - y_Q)|$\n$= \\frac{1}{2}|0 + 6(2) + 8(-4)| = \\frac{1}{2}|12-32| = 10$ → Jawaban B" },
  { no: 23, soal: "Titik $P(x, 5)$ berjarak 10 satuan dari titik $Q(-4, -1)$. Salah satu nilai x yang mungkin adalah …", options: ["A. 2", "B. 12", "C. 6", "D. 4"], jawaban: "A", pembahasan: "$(x+4)^2 + 36 = 100$\n$(x+4)^2 = 64$\n$x+4 = \\pm8 \\Rightarrow x = 4$ atau $x = -12$\nDari pilihan, $x=4$ → Jawaban D" },
  { no: 24, soal: "Jarak tegak lurus dari titik $P(2, 5)$ ke garis $3x + 4y - 6 = 0$ adalah …", options: ["A. 5", "B. 4", "C. 20", "D. 26"], jawaban: "B", pembahasan: "$d = \\frac{|3(2) + 4(5) - 6|}{\\sqrt{9+16}} = \\frac{|6+20-6|}{5} = \\frac{20}{5} = 4$ → Jawaban B" },
  { no: 25, soal: "Posisi titik $(3, -5)$ relatif terhadap titik acuan $(0, 1)$ adalah …", options: ["A. 3 langkah kanan dan 6 langkah atas", "B. 3 langkah kanan dan 6 langkah bawah", "C. 3 langkah kiri dan 6 langkah atas", "D. 6 langkah kanan dan 3 langkah atas"], jawaban: "B", pembahasan: "Posisi relatif = (3-0, -5-1) = (3, -6) → 3 kanan, 6 bawah → Jawaban B" },
];

const KoordinatCartesiusPage = () => (
  <TKAPemantapanLayout
    title="KOORDINAT KARTESIUS"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default KoordinatCartesiusPage;
