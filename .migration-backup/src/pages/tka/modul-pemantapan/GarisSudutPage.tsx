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
  { no: 1, soal: "Perhatikan gambar.\n\nBesar $\\angle KLM$ adalah …", options: ["A. $15°$"], jawaban: "", pembahasan: "" },
  { no: 2, soal: "Perhatikan gambar berikut!\n\nPerhatikan pernyataan berikut!\n(i) Sudut 1 dan sudut 7, sudut luar berseberangan\n(ii) Sudut 1 dan sudut 6, sudut luar sepihak\n(iii) Sudut 4 dan sudut 6, sudut bertolak belakang\n(iv) Sudut 3 dan sudut 7, sudut sehadap\n\nPernyataan yang benar adalah ….", options: ["A. (i) dan (ii) saja"], jawaban: "", pembahasan: "" },
  { no: 3, soal: "Perhatikan gambar\n\n$\\angle A_1 = 103°$, maka besar $\\angle B_4$ dan $\\angle A_3$ berturut-turut adalah …", options: ["A. $13°$ dan $90°$"], jawaban: "", pembahasan: "" },
  { no: 4, soal: "Perhatikan gambar\n\nBesar $\\angle BCF$ adalah ….", options: ["A. $35°$"], jawaban: "", pembahasan: "" },
  { no: 5, soal: "Perhatikan gambar\n\nDiketahui besar $\\angle CBD = (2x + 5)°$ dan $\\angle ABD = (3x - 25)°$. Besar pelurus sudut CBD adalah ...", options: ["A. $82°$"], jawaban: "", pembahasan: "" },
  { no: 6, soal: "Suatu sudut besarnya 3 kali pelurusnya, maka sudut tersebut adalah…", options: ["A. $15°$"], jawaban: "", pembahasan: "" },
  { no: 7, soal: "Perhatikan gambar berikut.\n\nDari gambar di atas besar $\\angle QPR$ adalah ..", options: ["A. $18°$"], jawaban: "", pembahasan: "" },
  { no: 8, soal: "Perhatikan gambar berikut\n\nBesar $\\angle BAC$ adalah …", options: ["A. $80°$"], jawaban: "", pembahasan: "" },
  { no: 9, soal: "Perhatikan gambar berikut!\n\nBesar sudut ACB adalah ….", options: ["A. $55°$"], jawaban: "", pembahasan: "" },
  { no: 10, soal: "Besar sudut terkecil dari dua jarum jam pada pukul 22.10 adalah …", options: ["A. $145°$"], jawaban: "", pembahasan: "" },
  { no: 11, soal: "Besar sudut terkecil dari dua jarum jam pada pukul 07.20 adalah …", options: ["A. $90°$"], jawaban: "", pembahasan: "" },
  { no: 12, soal: "Diketahui besar $\\angle A = (2x + 3)°$ dan $\\angle B = (3x - 8)°$ saling berpelurus, maka penyiku sudut A adalah....", options: ["A. $13°$"], jawaban: "", pembahasan: "" },
  { no: 13, soal: "Perhatikan gambar berikut ini!\n\nJika $\\angle\\alpha = 3x° - y° - 15°$, $\\angle\\beta = 2y°$, $\\angle\\delta = y° - x° + 85°$, $\\angle\\theta = 2x° + y° - 20°$. Maka nilai dari $x + y = \\cdots$", options: ["A. 85"], jawaban: "", pembahasan: "" },
  { no: 14, soal: "Perhatikan gambar berikut:\n\nJika besar $\\angle a = 95°$ dan $\\angle b = 70°$ maka selisih besar sudut x dan y adalah...", options: ["A. $25°$"], jawaban: "", pembahasan: "" },
  { no: 15, soal: "Perhatikan gambar berikut:\n\nJika garis $l_1$ dan $l_2$ adalah dua garis yang sejajar, maka nilai x adalah...", options: ["A. $13°$"], jawaban: "", pembahasan: "" },
  { no: 16, soal: "Empat sudut terbentuk oleh dua garis berpotongan seperti pada gambar berikut:\n\nBila diketahui $q° = 45°$ maka:", options: ["A. $p = 135°$; $s = 45°$; $r = 135°$", "B. $p = 130°$; $s = 45°$; $r = 130°$", "C. $p = 135°$; $s = 40°$; $r = 135°$", "D. $p = 130°$; $s = 40°$; $r = 130°$"], jawaban: "", pembahasan: "" },
  { no: 17, soal: "Pada kubus ABCD.EFGH besar sudut BGE adalah...", options: ["A. $30°$"], jawaban: "", pembahasan: "" },
  { no: 18, soal: "Perhatikan gambar.\n\nBesar sudut AOB adalah ...", options: ["A. $70°$"], jawaban: "", pembahasan: "" },
  { no: 19, soal: "Perhatikan gambar berikut!\n\nJika besar $\\angle a = 35°$ dan $\\angle b = 45°$ maka jumlah besar sudut x dan y adalah ...", options: ["A. $285°$"], jawaban: "", pembahasan: "" },
  { no: 20, soal: "Perhatikan gambar berikut!\n\nJika diketahui AB sejajar CD, maka nilai x adalah ...", options: ["A. $15°$"], jawaban: "", pembahasan: "" },
  { no: 21, soal: "Perhatikan gambar berikut!\n\nBesar penyiku $\\angle SQR$ adalah ...", options: ["A. $9°$"], jawaban: "", pembahasan: "" },
  { no: 22, soal: "Perhatikan gambar berikut!\n\nBesar sudut nomor 1 adalah $95°$, dan sudut nomor 2 adalah $110°$. Besar sudut nomor 3 adalah ...", options: ["A. $5°$"], jawaban: "", pembahasan: "" },
  { no: 23, soal: "Perhatikan gambar berikut.\n\nBesar $\\angle BAC$ adalah...", options: ["A. $24°$"], jawaban: "", pembahasan: "" },
  { no: 24, soal: "Perhatikan gambar di bawah ini.\n\nDiketahui sudut SPT $= 83°$ dan sudut PQT $= 41°$. Garis PQ dan RS sejajar, demikian juga garis PS dan QT sejajar. Maka besar x = …", options: ["A. $41°$"], jawaban: "", pembahasan: "" },
  { no: 25, soal: "Dari gambar berikut, diketahui perbandingan x:y adalah 2:7. Besar sudut x adalah ...", options: ["A. $120°$"], jawaban: "", pembahasan: "" },
  { no: 26, soal: "Perhatikan gambar. Jika $\\angle EFB = 65°$ dan $\\angle FCD = 120°$, maka besar $\\angle BFC$ adalah...", options: ["A. $55°$"], jawaban: "", pembahasan: "" },
  { no: 27, soal: "Perhatikan gambar berikut. Besar sudut a adalah ...", options: ["A. $30°$"], jawaban: "", pembahasan: "" },
  { no: 28, soal: "Perhatikan gambar di bawah ini!\n\nNilai x adalah ...", options: ["A. $150°$"], jawaban: "", pembahasan: "" }
];

const GarisSudutPage = () => (
  <TKAPemantapanLayout
    title="GARIS DAN SUDUT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default GarisSudutPage;
