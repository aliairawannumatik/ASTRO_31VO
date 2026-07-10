import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Segitiga", content: `Jenis segitiga berdasarkan sisi:\n- Sama sisi: ketiga sisi sama panjang\n- Sama kaki: dua sisi sama panjang\n- Sembarang: ketiga sisi berbeda\n\nJenis berdasarkan sudut:\n- Siku-siku: ada sudut 90°\n- Lancip: semua sudut < 90°\n- Tumpul: ada sudut > 90°\n\nRumus:\n- Keliling = $a + b + c$\n- Luas = $\\frac{1}{2} \\times alas \\times tinggi$\n- Luas dengan rumus Heron: $L = \\sqrt{s(s-a)(s-b)(s-c)}$ dengan $s = \\frac{a+b+c}{2}$` },
  { heading: "B. Persegi", content: `Semua sisi sama panjang dan semua sudut 90°.\n\n- Keliling = $4s$\n- Luas = $s^2$\n- Diagonal = $s\\sqrt{2}$\n- Jumlah diagonal: 2 diagonal yang sama panjang dan saling tegak lurus` },
  { heading: "C. Persegi Panjang", content: `Dua pasang sisi sejajar sama panjang, semua sudut 90°.\n\n- Keliling = $2(p + l)$\n- Luas = $p \\times l$\n- Diagonal = $\\sqrt{p^2 + l^2}$` },
  { heading: "D. Jajargenjang", content: `Dua pasang sisi sejajar dan sama panjang. Sudut berlawanan sama besar.\n\n- Keliling = $2(a + b)$\n- Luas = $alas \\times tinggi$` },
  { heading: "E. Trapesium", content: `Tepat satu pasang sisi sejajar (sisi sejajar: $a$ dan $b$, tinggi: $t$).\n\n- Luas = $\\frac{1}{2}(a + b) \\times t$\n- Keliling = $a + b + c + d$ (semua sisi)\n\nTrapesium sama kaki: kedua kaki sama panjang.` },
  { heading: "F. Belah Ketupat", content: `Semua sisi sama panjang, sudut berlawanan sama besar.\n\n- Keliling = $4s$\n- Luas = $\\frac{1}{2} d_1 \\times d_2$ (diagonal)\n- Sisi = $\\sqrt{\\left(\\frac{d_1}{2}\\right)^2 + \\left(\\frac{d_2}{2}\\right)^2}$` },
  { heading: "G. Layang-layang", content: `Dua pasang sisi berdekatan sama panjang.\n\n- Keliling = $2(a + b)$\n- Luas = $\\frac{1}{2} d_1 \\times d_2$\n- Salah satu diagonal merupakan sumbu simetri` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Perhatikan gambar berikut.\nKeliling bangun di atas adalah ...", options: ["A. 44 cm", "B. 48 cm", "C. 49 cm", "D. 52 cm"] },
  { no: 2, soal: "Perhatikan gambar berikut ini.\nKeliling bangun di atas adalah ...", options: ["A. 61 cm", "B. 84 cm", "C. 90 cm", "D. 94 cm"] },
  { no: 3, soal: "Perhatikan gambar.\nLuas gambar di samping adalah ...", options: ["A. 294 $cm^2$", "B. 290 $cm^2$", "C. 258 $cm^2$", "D. 250 $cm^2$"] },
  { no: 4, soal: "Perhatikan gambar berikut. Luas huruf capital di samping adalah ..", options: ["A. 425 $cm^2$", "B. 450 $cm^2$", "C. 500 $cm^2$", "D. 525 $cm^2$"] },
  { no: 5, soal: "Perhatikan gambar.\nDiketahui AB = 20 cm, AF = 13 cm dan BD = 10 cm. luas bangun di samping adalah ...", options: ["A. 280 $cm^2$", "B. 320 $cm^2$", "C. 360 $cm^2$", "D. 480 $cm^2$"] },
  { no: 6, soal: "Perhatikan gambar berikut.\nPanjang AD = BE = 17 cm dan DE = 15 cm. luas bangun AGBCHD adalah...", options: ["A. 375 $cm^2$", "B. 525 $cm^2$", "C. 600 $cm^2$", "D. 750 $cm^2$"] },
  { no: 7, soal: "Perhatikan gambar berikut.\nLuas daerah yang diarsir adalah ...", options: ["A. 60 $cm^2$", "B. 66 $cm^2$", "C. 72 $cm^2$", "D. 90 $cm^2$"] },
  { no: 8, soal: "Perhatikan gambar di bawah!\nLuas daerah yang diarsir adalah ....", options: ["A. 42 $cm^2$", "B. 56 $cm^2$", "C. 70 $cm^2$", "D. 84 $cm^2$"] },
  { no: 9, soal: "Perhatikan gambar persegi ABCD dan persegi panjang EFGH berikut!\nJika luas daerah yang tidak diarsir 68 $cm^2$ luas daerah yang diarsir adalah ....", options: ["A. 24 $cm^2$", "B. 28 $cm^2$", "C. 30 $cm^2$", "D. 56 $cm^2$"] },
  { no: 10, soal: "Sebuah taman bebentuk trapesium sama kaki dengan Panjang sisi yang sejajar adalah 40 m dan 16 m, tinggi trapesium 16 m. taman itu akan diterangi dengan lampu di pinggir taman dengan jarak tiang lampu adalah 4 m, maka banyaknya tiang yang dibutuhkan seluruhnya adalah ..", options: ["A. 18 tiang", "B. 20 tiang", "C. 24 tiang", "D. 28 tiang"] },
  { no: 11, soal: "Taman berbentuk lingkaran dengan Panjang diameter 14 m akan dipasangkan tiang lampu dengan jarak antar tiang 4 m. jika biaya 1 tiang lampu Rp 200.000,00, maka biaya seluruhnya untuk memasang tiang lampu tersebut adalah ..", options: ["A. Rp 2.200.000,00", "B. Rp 2.800.000,00", "C. Rp 3.300.000,00", "D. Rp 4.400.000,00"] },
  { no: 12, soal: "Lantai ruang tamu berukuran 4,2 m x 3,6 m. Jika akan ditutup dengan keramik persegi berukuran 30 cm. maka banyaknya keramik yang diperlukan adalah.....", options: ["A. 150", "B. 168", "C. 180", "D. 200"] },
  { no: 13, soal: "Sebuah kolam renang berbentuk persegi panjang, mempunyai ukuran panjang 20 meter dan lebar 10 meter. Di sekeliling kolam renang bagian luar akan dibuat jalan dengan lebar 1 meter. Jika jalan akan dipasang keramik dengan biaya Rp60.000,00 setiap meter persegi, maka biaya yang diperlukan untuk pemasangan keramik adalah", options: ["A. Rp1.860.000,00", "B. Rp3.600.000,00", "C. Rp3.840.000,00", "D. Rp12.000.000,00"] },
];

const SegitigaSegiempatPage = () => (
  <TKAPemantapanLayout
    title="SEGITIGA DAN SEGIEMPAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default SegitigaSegiempatPage;
