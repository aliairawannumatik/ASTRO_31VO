import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Jenis-jenis Sudut", content: `- Sudut siku-siku: 90°\n- Sudut lancip: 0° < α < 90°\n- Sudut tumpul: 90° < α < 180°\n- Sudut lurus: 180°\n- Sudut refleks: 180° < α < 360°\n- Sudut penuh: 360°` },
  { heading: "B. Hubungan Antar Sudut", content: `1. Sudut berpelurus (suplemen): dua sudut berjumlah 180°\n   Jika sudut A dan sudut B berpelurus: $A + B = 180°$\n\n2. Sudut berpenyiku (komplemen): dua sudut berjumlah 90°\n   Jika sudut A dan sudut B berpenyiku: $A + B = 90°$\n\n3. Sudut bertolak belakang: dua sudut yang bertolak belakang nilainya sama.\n\n4. Sudut sehadap: $\\alpha_1 = \\alpha_2$ (pada dua garis sejajar)\n5. Sudut berseberangan dalam: $\\alpha_1 = \\alpha_2$\n6. Sudut berseberangan luar: $\\alpha_1 = \\alpha_2$\n7. Sudut sepihak (dalam): $\\alpha_1 + \\alpha_2 = 180°$` },
  { heading: "C. Hubungan Sudut pada Garis Sejajar", content: `Jika dua garis sejajar dipotong oleh garis lain (transversal):\n\n1. Sudut sehadap sama besar (F-angle)\n2. Sudut berseberangan dalam sama besar (Z-angle)\n3. Sudut berseberangan luar sama besar\n4. Sudut sepihak dalam berjumlah 180° (C-angle)` },
  { heading: "D. Jumlah Sudut Segitiga dan Segiempat", content: `Segitiga: jumlah ketiga sudut = 180°\nSegiempat: jumlah keempat sudut = 360°\n\nSudut luar segitiga = jumlah dua sudut dalam yang tidak berdekatan dengan sudut luar tersebut.` },
  { heading: "E. Sudut pada Lingkaran", content: `Sudut pusat = 2 × sudut keliling yang menghadap busur yang sama\n\nSudut keliling yang menghadap busur yang sama besarnya sama.\n\nSudut dalam setengah lingkaran = 90°` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Pelurus dari sudut 65° adalah …", options: ["A. 25°", "B. 35°", "C. 115°", "D. 125°"], jawaban: "C", pembahasan: "Pelurus = 180° - 65° = 115° → Jawaban C" },
  { no: 2, soal: "Penyiku dari sudut 38° adalah …", options: ["A. 42°", "B. 52°", "C. 62°", "D. 142°"], jawaban: "B", pembahasan: "Penyiku = 90° - 38° = 52° → Jawaban B" },
  { no: 3, soal: "Dua sudut bertolak belakang. Jika salah satu sudut besarnya $(3x + 15)°$ dan yang lain $(5x - 25)°$. Nilai x adalah …", options: ["A. 15", "B. 20", "C. 25", "D. 30"], jawaban: "B", pembahasan: "$3x + 15 = 5x - 25$\n$40 = 2x$\n$x = 20$ → Jawaban B" },
  { no: 4, soal: "Dua garis sejajar dipotong garis lain. Jika salah satu sudut sehadap $(4x - 20)°$ dan yang lain $(2x + 40)°$. Nilai sudut tersebut adalah …", options: ["A. 30°", "B. 60°", "C. 100°", "D. 120°"], jawaban: "C", pembahasan: "$4x - 20 = 2x + 40$\n$2x = 60$, $x = 30$\nSudut = $4(30) - 20 = 100°$ → Jawaban C" },
  { no: 5, soal: "Dua garis sejajar dipotong transversal. Sudut sepihak dalam besarnya $(3x + 30)°$ dan $(2x + 50)°$. Nilai x adalah …", options: ["A. 10", "B. 15", "C. 20", "D. 25"], jawaban: "C", pembahasan: "$(3x+30) + (2x+50) = 180$\n$5x + 80 = 180$\n$x = 20$ → Jawaban C" },
  { no: 6, soal: "Dalam segitiga ABC, sudut A = 55° dan sudut B = 75°. Sudut C adalah …", options: ["A. 30°", "B. 40°", "C. 50°", "D. 60°"], jawaban: "C", pembahasan: "$C = 180° - 55° - 75° = 50°$ → Jawaban C" },
  { no: 7, soal: "Sebuah segitiga memiliki sudut berturut-turut $(2x)°$, $(3x+5)°$, dan $(4x-5)°$. Nilai x adalah …", options: ["A. 15", "B. 20", "C. 25", "D. 30"], jawaban: "B", pembahasan: "$2x + 3x+5 + 4x-5 = 180$\n$9x = 180$, $x = 20$ → Jawaban B" },
  { no: 8, soal: "Sudut luar segitiga = 120°. Dua sudut dalam yang tidak bersebelahan dengan sudut luar itu adalah x° dan (x+20)°. Nilai x adalah …", options: ["A. 40", "B. 50", "C. 60", "D. 70"], jawaban: "B", pembahasan: "$x + (x+20) = 120$\n$2x = 100$, $x = 50$ → Jawaban B" },
  { no: 9, soal: "Pada persegi ABCD, diagonal berpotongan di titik O. Besar ∠AOB adalah …", options: ["A. 45°", "B. 60°", "C. 90°", "D. 120°"], jawaban: "C", pembahasan: "Diagonal persegi berpotongan tegak lurus → ∠AOB = 90° → Jawaban C" },
  { no: 10, soal: "Sudut pusat lingkaran yang menghadap suatu busur adalah 140°. Sudut keliling yang menghadap busur yang sama adalah …", options: ["A. 35°", "B. 60°", "C. 70°", "D. 140°"], jawaban: "C", pembahasan: "Sudut keliling = $\\frac{1}{2}$ × sudut pusat = 70° → Jawaban C" },
  { no: 11, soal: "Dua sudut saling berpelurus dengan perbandingan 2 : 7. Selisih kedua sudut tersebut adalah …", options: ["A. 40°", "B. 60°", "C. 80°", "D. 100°"], jawaban: "D", pembahasan: "Total = 180°, sudut: $\\frac{2}{9} \\times 180 = 40°$ dan $\\frac{7}{9} \\times 180 = 140°$\nSelisih = 100° → Jawaban D" },
  { no: 12, soal: "Dua sudut saling berpenyiku dengan perbandingan 1 : 4. Sudut terbesar adalah …", options: ["A. 18°", "B. 45°", "C. 60°", "D. 72°"], jawaban: "D", pembahasan: "$\\frac{4}{5} \\times 90° = 72°$ → Jawaban D" },
  { no: 13, soal: "Besar sudut pada jarum jam pukul 10.00 adalah …", options: ["A. 30°", "B. 45°", "C. 60°", "D. 90°"], jawaban: "C", pembahasan: "Dari angka 12 ke 10 = 2 jam mundur = 2 × 30° = 60° → Jawaban C" },
  { no: 14, soal: "Sudut berseberangan luar dari dua garis sejajar yang dipotong transversal adalah $(5x - 10)°$ dan $(3x + 30)°$. Nilai x adalah …", options: ["A. 10", "B. 15", "C. 20", "D. 25"], jawaban: "C", pembahasan: "$5x - 10 = 3x + 30$\n$2x = 40$, $x = 20$ → Jawaban C" },
  { no: 15, soal: "Dalam segiempat ABCD, sudut A = 80°, sudut B = 115°, sudut C = 90°. Besar sudut D adalah …", options: ["A. 60°", "B. 75°", "C. 80°", "D. 95°"], jawaban: "B", pembahasan: "$D = 360° - 80° - 115° - 90° = 75°$ → Jawaban B" },
];

const GarisSudutPage = () => (
  <TKAPemantapanLayout
    title="GARIS DAN SUDUT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default GarisSudutPage;
