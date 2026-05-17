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
  { no: 1, soal: "Keliling segitiga dengan sisi 5 cm, 12 cm, dan 13 cm adalah …", options: ["A. 28 cm", "B. 30 cm", "C. 34 cm", "D. 36 cm"], jawaban: "B", pembahasan: "Keliling = 5+12+13 = 30 cm → Jawaban B" },
  { no: 2, soal: "Luas segitiga dengan alas 8 cm dan tinggi 5 cm adalah …", options: ["A. 13 cm²", "B. 20 cm²", "C. 40 cm²", "D. 80 cm²"], jawaban: "B", pembahasan: "Luas = $\\frac{1}{2} \\times 8 \\times 5 = 20$ cm² → Jawaban B" },
  { no: 3, soal: "Persegi panjang memiliki panjang 10 cm dan lebar 6 cm. Luas persegi panjang tersebut adalah …", options: ["A. 32 cm²", "B. 48 cm²", "C. 60 cm²", "D. 80 cm²"], jawaban: "C", pembahasan: "Luas = 10 × 6 = 60 cm² → Jawaban C" },
  { no: 4, soal: "Diagonal sebuah persegi panjang 10 cm, lebarnya 6 cm. Luasnya adalah …", options: ["A. 24 cm²", "B. 36 cm²", "C. 48 cm²", "D. 60 cm²"], jawaban: "C", pembahasan: "Panjang = $\\sqrt{100-36} = 8$ cm\nLuas = 8 × 6 = 48 cm² → Jawaban C" },
  { no: 5, soal: "Luas trapesium dengan sisi sejajar 10 cm dan 14 cm, tinggi 8 cm adalah …", options: ["A. 80 cm²", "B. 96 cm²", "C. 100 cm²", "D. 112 cm²"], jawaban: "B", pembahasan: "Luas = $\\frac{1}{2}(10+14) \\times 8 = 96$ cm² → Jawaban B" },
  { no: 6, soal: "Luas belah ketupat dengan diagonal 12 cm dan 16 cm adalah …", options: ["A. 56 cm²", "B. 72 cm²", "C. 96 cm²", "D. 192 cm²"], jawaban: "C", pembahasan: "Luas = $\\frac{1}{2} \\times 12 \\times 16 = 96$ cm² → Jawaban C" },
  { no: 7, soal: "Keliling belah ketupat dengan diagonal 6 cm dan 8 cm adalah …", options: ["A. 20 cm", "B. 24 cm", "C. 28 cm", "D. 40 cm"], jawaban: "A", pembahasan: "Sisi = $\\sqrt{3^2+4^2} = 5$ cm\nKeliling = 4 × 5 = 20 cm → Jawaban A" },
  { no: 8, soal: "Luas layang-layang dengan diagonal 9 cm dan 14 cm adalah …", options: ["A. 36 cm²", "B. 63 cm²", "C. 72 cm²", "D. 126 cm²"], jawaban: "B", pembahasan: "Luas = $\\frac{1}{2} \\times 9 \\times 14 = 63$ cm² → Jawaban B" },
  { no: 9, soal: "Jajargenjang dengan alas 12 cm dan tinggi 7 cm. Luasnya adalah …", options: ["A. 42 cm²", "B. 63 cm²", "C. 84 cm²", "D. 96 cm²"], jawaban: "C", pembahasan: "Luas = 12 × 7 = 84 cm² → Jawaban C" },
  { no: 10, soal: "Sebuah persegi memiliki luas 225 cm². Kelilingnya adalah …", options: ["A. 45 cm", "B. 60 cm", "C. 75 cm", "D. 90 cm"], jawaban: "B", pembahasan: "Sisi = $\\sqrt{225} = 15$ cm\nKeliling = 4 × 15 = 60 cm → Jawaban B" },
  { no: 11, soal: "Trapesium sama kaki dengan sisi sejajar 8 cm dan 14 cm, kaki-kaki 5 cm. Luasnya adalah …", options: ["A. 36 cm²", "B. 44 cm²", "C. 48 cm²", "D. 52 cm²"], jawaban: "C", pembahasan: "Tinggi = $\\sqrt{5^2-3^2} = 4$ cm\nLuas = $\\frac{1}{2}(8+14) \\times 4 = 44$ cm² → Jawaban B" },
  { no: 12, soal: "Sebuah taman berbentuk persegi dengan keliling 48 m. Luas taman tersebut adalah …", options: ["A. 96 m²", "B. 108 m²", "C. 144 m²", "D. 192 m²"], jawaban: "C", pembahasan: "Sisi = 48/4 = 12 m\nLuas = 12² = 144 m² → Jawaban C" },
  { no: 13, soal: "Lantai ruangan berbentuk persegi panjang 8 m × 5 m. Akan dipasang keramik 40 cm × 40 cm. Banyak keramik yang diperlukan adalah …", options: ["A. 200 buah", "B. 250 buah", "C. 300 buah", "D. 400 buah"], jawaban: "B", pembahasan: "Luas lantai = 40.000 cm²\nLuas keramik = 1.600 cm²\nJumlah = 40.000/1.600 = 25... Periksa: 800 × 500 = 400.000 cm², per keramik 1600 cm² → 250 buah → Jawaban B" },
  { no: 14, soal: "Sebuah segitiga sama kaki memiliki panjang kaki 13 cm dan alas 10 cm. Luasnya adalah …", options: ["A. 48 cm²", "B. 52 cm²", "C. 56 cm²", "D. 60 cm²"], jawaban: "D", pembahasan: "Tinggi = $\\sqrt{13^2 - 5^2} = \\sqrt{144} = 12$ cm\nLuas = $\\frac{1}{2} \\times 10 \\times 12 = 60$ cm² → Jawaban D" },
  { no: 15, soal: "Jika alas dan tinggi segitiga diperbesar 2 kali, luasnya menjadi … kali luas semula.", options: ["A. 2 kali", "B. 4 kali", "C. 6 kali", "D. 8 kali"], jawaban: "B", pembahasan: "Luas baru = $\\frac{1}{2}(2a)(2t) = 2at = 4 \\times \\frac{1}{2}at$ → 4 kali → Jawaban B" },
];

const SegitigaSegiempatPage = () => (
  <TKAPemantapanLayout
    title="SEGITIGA DAN SEGIEMPAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default SegitigaSegiempatPage;
