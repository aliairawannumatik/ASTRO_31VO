import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Kubus", content: `Kubus: bangun ruang berisi 6 sisi berbentuk persegi, 12 rusuk sama panjang, 8 titik sudut.\n\nJika rusuk = s:\n- Luas permukaan = $6s^2$\n- Volume = $s^3$\n- Diagonal ruang = $s\\sqrt{3}$\n- Diagonal sisi = $s\\sqrt{2}$` },
  { heading: "B. Balok", content: `Balok: bangun ruang dengan 6 sisi berbentuk persegi panjang (tiga pasang), 12 rusuk, 8 titik sudut.\n\nJika panjang = p, lebar = l, tinggi = t:\n- Luas permukaan = $2(pl + pt + lt)$\n- Volume = $p \\times l \\times t$\n- Diagonal ruang = $\\sqrt{p^2 + l^2 + t^2}$` },
  { heading: "C. Prisma", content: `Prisma: bangun ruang dengan dua sisi alas yang sama dan sejajar, sisi tegak berbentuk persegi panjang.\n\n- Luas permukaan = $2 \\times L_{alas} + K_{alas} \\times t$\n- Volume = $L_{alas} \\times t$\n\n(L = luas, K = keliling, t = tinggi prisma)` },
  { heading: "D. Limas", content: `Limas: bangun ruang dengan satu sisi alas dan sisi tegak berbentuk segitiga bertemu di satu titik (puncak).\n\n- Luas permukaan = $L_{alas} + \\sum L_{sisi\\ tegak}$\n- Volume = $\\frac{1}{3} \\times L_{alas} \\times t$\n\nUntuk limas segi empat beraturan:\n- Tinggi sisi tegak: apotema\n- Luas sisi tegak = $\\frac{1}{2} \\times alas \\times apotema$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Luas permukaan kubus dengan rusuk 8 cm adalah …", options: ["A. 192 cm²", "B. 256 cm²", "C. 384 cm²", "D. 512 cm²"], jawaban: "C", pembahasan: "$6 \\times 8^2 = 384$ cm² → Jawaban C" },
  { no: 2, soal: "Volume kubus dengan luas permukaan 294 cm² adalah …", options: ["A. 125 cm³", "B. 216 cm³", "C. 343 cm³", "D. 512 cm³"], jawaban: "C", pembahasan: "$6s^2 = 294 \\Rightarrow s^2 = 49 \\Rightarrow s = 7$\n$V = 7^3 = 343$ cm³ → Jawaban C" },
  { no: 3, soal: "Luas permukaan balok dengan p = 10 cm, l = 6 cm, t = 4 cm adalah …", options: ["A. 148 cm²", "B. 240 cm²", "C. 248 cm²", "D. 480 cm²"], jawaban: "C", pembahasan: "$2(10 \\times 6 + 10 \\times 4 + 6 \\times 4) = 2(60+40+24) = 248$ cm² → Jawaban C" },
  { no: 4, soal: "Volume balok dengan p = 12 cm, l = 8 cm, t = 5 cm adalah …", options: ["A. 240 cm³", "B. 360 cm³", "C. 480 cm³", "D. 960 cm³"], jawaban: "C", pembahasan: "$V = 12 \\times 8 \\times 5 = 480$ cm³ → Jawaban C" },
  { no: 5, soal: "Sebuah kolam renang berbentuk balok berukuran 20 m × 8 m × 1,5 m. Volume air yang dibutuhkan untuk mengisinya penuh adalah …", options: ["A. 160 m³", "B. 240 m³", "C. 280 m³", "D. 320 m³"], jawaban: "B", pembahasan: "$V = 20 \\times 8 \\times 1,5 = 240$ m³ → Jawaban B" },
  { no: 6, soal: "Prisma segitiga dengan luas alas 30 cm² dan tinggi prisma 15 cm. Volumenya adalah …", options: ["A. 150 cm³", "B. 300 cm³", "C. 450 cm³", "D. 600 cm³"], jawaban: "C", pembahasan: "$V = 30 \\times 15 = 450$ cm³ → Jawaban C" },
  { no: 7, soal: "Prisma segitiga siku-siku dengan sisi tegak 3 cm, 4 cm, 5 cm dan tinggi prisma 10 cm. Luas permukaannya adalah …", options: ["A. 132 cm²", "B. 156 cm²", "C. 180 cm²", "D. 204 cm²"], jawaban: "A", pembahasan: "Luas alas = $\\frac{1}{2} \\times 3 \\times 4 = 6$ cm², Keliling alas = 12 cm\n$L = 2 \\times 6 + 12 \\times 10 = 12 + 120 = 132$ cm² → Jawaban A" },
  { no: 8, soal: "Volume limas persegi dengan sisi alas 6 cm dan tinggi 8 cm adalah …", options: ["A. 48 cm³", "B. 72 cm³", "C. 96 cm³", "D. 144 cm³"], jawaban: "C", pembahasan: "$V = \\frac{1}{3} \\times 6^2 \\times 8 = \\frac{1}{3} \\times 288 = 96$ cm³ → Jawaban C" },
  { no: 9, soal: "Luas permukaan limas persegi beraturan dengan sisi alas 10 cm dan tinggi sisi tegak (apotema) 13 cm adalah …", options: ["A. 360 cm²", "B. 460 cm²", "C. 480 cm²", "D. 560 cm²"], jawaban: "A", pembahasan: "Luas alas = 100 cm²\nLuas 4 sisi tegak = $4 \\times \\frac{1}{2} \\times 10 \\times 13 = 260$ cm²\nTotal = 360 cm² → Jawaban A" },
  { no: 10, soal: "Diagonal ruang kubus yang panjang rusuknya 6 cm adalah …", options: ["A. $6\\sqrt{2}$ cm", "B. $6\\sqrt{3}$ cm", "C. $12$ cm", "D. $12\\sqrt{2}$ cm"], jawaban: "B", pembahasan: "$d = s\\sqrt{3} = 6\\sqrt{3}$ cm → Jawaban B" },
  { no: 11, soal: "Sebuah akuarium berbentuk balok dengan p = 60 cm, l = 40 cm, t = 50 cm, terisi air 3/4 bagian. Volume air dalam akuarium adalah …", options: ["A. 45.000 cm³", "B. 72.000 cm³", "C. 90.000 cm³", "D. 120.000 cm³"], jawaban: "C", pembahasan: "$V_{balok} = 120.000$ cm³\n$\\frac{3}{4} \\times 120.000 = 90.000$ cm³ → Jawaban C" },
  { no: 12, soal: "Balok dengan luas permukaan 376 cm². Jika p = 10 cm dan l = 8 cm, maka tinggi balok adalah …", options: ["A. 5 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"], jawaban: "B", pembahasan: "$2(80 + 10t + 8t) = 376$\n$80 + 18t = 188$\n$18t = 108$, $t = 6$ cm → Jawaban B" },
  { no: 13, soal: "Tinggi limas persegi dengan sisi alas 12 cm dan volume 576 cm³ adalah …", options: ["A. 10 cm", "B. 12 cm", "C. 14 cm", "D. 16 cm"], jawaban: "B", pembahasan: "$576 = \\frac{1}{3} \\times 144 \\times t \\Rightarrow t = 12$ cm → Jawaban B" },
  { no: 14, soal: "Prisma segi empat dengan alas persegi panjang 8 cm × 6 cm dan tinggi 10 cm. Volumenya adalah …", options: ["A. 360 cm³", "B. 420 cm³", "C. 480 cm³", "D. 540 cm³"], jawaban: "C", pembahasan: "$V = 8 \\times 6 \\times 10 = 480$ cm³ → Jawaban C" },
  { no: 15, soal: "Sebuah kotak kardus berbentuk kubus berisi 64 bola kecil berbentuk kubus dengan rusuk 2 cm. Rusuk kotak kardus adalah …", options: ["A. 6 cm", "B. 8 cm", "C. 10 cm", "D. 12 cm"], jawaban: "B", pembahasan: "$V_{kotak} = 64 \\times 8 = 512$ cm³\n$s = \\sqrt[3]{512} = 8$ cm → Jawaban B" },
];

const BangunRuangSisiDatarPage = () => (
  <TKAPemantapanLayout
    title="BANGUN RUANG SISI DATAR"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BangunRuangSisiDatarPage;
