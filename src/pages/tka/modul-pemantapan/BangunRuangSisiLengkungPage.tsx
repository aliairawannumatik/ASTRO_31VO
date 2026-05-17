import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Tabung (Silinder)", content: `Tabung: bangun ruang dengan dua sisi alas dan tutup berbentuk lingkaran, sisi selimut berbentuk persegi panjang.\n\nJika jari-jari = r dan tinggi = t:\n- Luas selimut = $2\\pi rt$\n- Luas permukaan = $2\\pi r(r + t)$\n- Volume = $\\pi r^2 t$` },
  { heading: "B. Kerucut", content: `Kerucut: bangun ruang dengan satu sisi alas berbentuk lingkaran dan satu sisi selimut berbentuk juring lingkaran.\n\nJika jari-jari = r, tinggi = t, garis pelukis = s:\n- $s = \\sqrt{r^2 + t^2}$\n- Luas selimut = $\\pi rs$\n- Luas permukaan = $\\pi r(r + s)$\n- Volume = $\\frac{1}{3} \\pi r^2 t$` },
  { heading: "C. Bola", content: `Bola: bangun ruang dengan semua titik pada permukaannya berjarak sama dari pusat.\n\nJika jari-jari = r:\n- Luas permukaan = $4\\pi r^2$\n- Volume = $\\frac{4}{3} \\pi r^3$` },
  { heading: "D. Perbandingan Volume", content: `Tabung : Kerucut : Bola\nDengan r dan t yang sama:\n$V_{tabung} : V_{kerucut} : V_{bola} = 3 : 1 : 2$\n\n(Catatan: r dan t/d harus sesuai)` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Luas permukaan tabung dengan r = 7 cm dan t = 15 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 484 cm²", "B. 726 cm²", "C. 968 cm²", "D. 1.010 cm²"], jawaban: "C", pembahasan: "$2\\pi r(r+t) = 2 \\times \\frac{22}{7} \\times 7 \\times (7+15) = 44 \\times 22 = 968$ cm² → Jawaban C" },
  { no: 2, soal: "Volume tabung dengan diameter 14 cm dan tinggi 10 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 770 cm³", "B. 1.540 cm³", "C. 3.080 cm³", "D. 6.160 cm³"], jawaban: "B", pembahasan: "$r = 7$ cm\n$V = \\frac{22}{7} \\times 49 \\times 10 = 1.540$ cm³ → Jawaban B" },
  { no: 3, soal: "Volume kerucut dengan r = 6 cm dan t = 14 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 264 cm³", "B. 528 cm³", "C. 792 cm³", "D. 1.056 cm³"], jawaban: "B", pembahasan: "$V = \\frac{1}{3} \\times \\frac{22}{7} \\times 36 \\times 14 = \\frac{1}{3} \\times 1584 = 528$ cm³ → Jawaban B" },
  { no: 4, soal: "Luas selimut kerucut dengan r = 10 cm dan garis pelukis 26 cm adalah … (gunakan $\\pi = 3,14$)", options: ["A. 816,4 cm²", "B. 1.256 cm²", "C. 1.632,8 cm²", "D. 2.198,4 cm²"], jawaban: "A", pembahasan: "$L = \\pi rs = 3,14 \\times 10 \\times 26 = 816,4$ cm² → Jawaban A" },
  { no: 5, soal: "Tinggi kerucut dengan r = 5 cm dan garis pelukis 13 cm adalah …", options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"], jawaban: "C", pembahasan: "$t = \\sqrt{13^2-5^2} = \\sqrt{144} = 12$ cm → Jawaban C" },
  { no: 6, soal: "Luas permukaan bola dengan r = 14 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 616 cm²", "B. 1.232 cm²", "C. 2.464 cm²", "D. 4.928 cm²"], jawaban: "C", pembahasan: "$4\\pi r^2 = 4 \\times \\frac{22}{7} \\times 196 = 2.464$ cm² → Jawaban C" },
  { no: 7, soal: "Volume bola dengan diameter 21 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 1.386 cm³", "B. 2.772 cm³", "C. 4.851 cm³", "D. 9.702 cm³"], jawaban: "C", pembahasan: "$r = 10,5$ cm\n$V = \\frac{4}{3} \\times \\frac{22}{7} \\times 1157,625 = 4851$ cm³ → Jawaban C" },
  { no: 8, soal: "Sebuah drum berbentuk tabung berdiameter 60 cm dan tinggi 100 cm. Volumenya adalah … (gunakan $\\pi = 3,14$)", options: ["A. 18.840 cm³", "B. 113.040 cm³", "C. 282.600 cm³", "D. 565.200 cm³"], jawaban: "C", pembahasan: "$r=30$, $V=3,14 \\times 900 \\times 100 = 282.600$ cm³ → Jawaban C" },
  { no: 9, soal: "Sebuah kerucut memiliki volume 1.232 cm³ dan jari-jari 7 cm. Tinggi kerucut adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 18 cm", "B. 20 cm", "C. 24 cm", "D. 28 cm"], jawaban: "C", pembahasan: "$1232 = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times t \\Rightarrow 1232 = \\frac{154}{3} t \\Rightarrow t = 24$ cm → Jawaban C" },
  { no: 10, soal: "Luas permukaan belahan bola padat dengan r = 7 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 154 cm²", "B. 308 cm²", "C. 462 cm²", "D. 616 cm²"], jawaban: "C", pembahasan: "Luas = $2\\pi r^2 + \\pi r^2 = 3\\pi r^2 = 3 \\times \\frac{22}{7} \\times 49 = 462$ cm² → Jawaban C" },
  { no: 11, soal: "Jari-jari bola diperbesar 3 kali. Volume bola baru adalah … kali volume bola semula.", options: ["A. 3 kali", "B. 9 kali", "C. 18 kali", "D. 27 kali"], jawaban: "D", pembahasan: "$V_{baru} = \\frac{4}{3}\\pi(3r)^3 = 27 \\times \\frac{4}{3}\\pi r^3 = 27V$ → Jawaban D" },
  { no: 12, soal: "Tabung dan kerucut memiliki alas dan tinggi yang sama. Perbandingan volume tabung dan kerucut adalah …", options: ["A. 1 : 3", "B. 2 : 1", "C. 3 : 1", "D. 1 : 2"], jawaban: "C", pembahasan: "$V_{tabung} : V_{kerucut} = \\pi r^2 t : \\frac{1}{3}\\pi r^2 t = 3:1$ → Jawaban C" },
  { no: 13, soal: "Sebuah topi berbentuk kerucut dengan r = 21 cm dan t = 28 cm. Luas bahan untuk membuat topi adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 1.386 cm²", "B. 2.310 cm²", "C. 2.772 cm²", "D. 3.234 cm²"], jawaban: "B", pembahasan: "$s = \\sqrt{21^2+28^2} = \\sqrt{1225} = 35$ cm\n$L_{selimut} = \\frac{22}{7} \\times 21 \\times 35 = 2310$ cm² → Jawaban B" },
  { no: 14, soal: "Volume bola yang luas permukaannya $616$ cm² adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. $\\frac{1372}{3}$ cm³", "B. $1437\\frac{1}{3}$ cm³", "C. $2156$ cm³", "D. $4312$ cm³"], jawaban: "B", pembahasan: "$4 \\times \\frac{22}{7} \\times r^2 = 616 \\Rightarrow r^2 = 49 \\Rightarrow r = 7$\n$V = \\frac{4}{3} \\times \\frac{22}{7} \\times 343 = \\frac{4312}{3} = 1437\\frac{1}{3}$ cm³ → Jawaban B" },
  { no: 15, soal: "Sebuah embung berbentuk setengah bola berdiameter 14 m. Volume air yang dapat ditampung adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 359,33 m³", "B. 718,67 m³", "C. 1.437,33 m³", "D. 2.874,67 m³"], jawaban: "A", pembahasan: "$r = 7$, $V_{setengah bola} = \\frac{1}{2} \\times \\frac{4}{3} \\times \\frac{22}{7} \\times 343 = \\frac{2156}{3} \\approx 718,67$ → Jawaban B" },
];

const BangunRuangSisiLengkungPage = () => (
  <TKAPemantapanLayout
    title="BANGUN RUANG SISI LENGKUNG"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BangunRuangSisiLengkungPage;
