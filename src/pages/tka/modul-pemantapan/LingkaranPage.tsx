import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Unsur-unsur Lingkaran", content: `- Pusat (O): titik yang berjarak sama dari semua titik pada lingkaran\n- Jari-jari (r): jarak dari pusat ke tepi lingkaran\n- Diameter (d): dua kali jari-jari, $d = 2r$\n- Busur: bagian keliling lingkaran\n- Tali busur: garis lurus menghubungkan dua titik pada lingkaran\n- Apotema: jarak terpendek dari pusat ke tali busur\n- Juring (sektor): daerah antara dua jari-jari dan busur\n- Tembereng: daerah antara tali busur dan busur` },
  { heading: "B. Keliling dan Luas Lingkaran", content: `Keliling (K): $K = 2\\pi r = \\pi d$\n\nLuas (L): $L = \\pi r^2$\n\nDengan $\\pi \\approx \\frac{22}{7}$ atau $\\pi \\approx 3,14$` },
  { heading: "C. Panjang Busur dan Luas Juring", content: `Panjang busur (PB) dengan sudut pusat α:\n$PB = \\dfrac{\\alpha}{360°} \\times 2\\pi r$\n\nLuas juring (LJ):\n$LJ = \\dfrac{\\alpha}{360°} \\times \\pi r^2$\n\nLuas tembereng:\n$L_{tembereng} = L_{juring} - L_{segitiga}$` },
  { heading: "D. Hubungan Sudut Pusat dan Sudut Keliling", content: `Sudut keliling yang menghadap busur yang sama:\n$\\angle keliling = \\dfrac{1}{2} \\angle pusat$\n\nSemua sudut keliling yang menghadap busur yang sama adalah sama besar.\n\nSudut keliling yang menghadap diameter = 90°` },
  { heading: "E. Garis Singgung Lingkaran", content: `Garis singgung lingkaran adalah garis yang hanya menyentuh lingkaran di satu titik (titik singgung).\n\nSifat: Garis singgung tegak lurus jari-jari di titik singgung.\n\nDua garis singgung dari titik luar:\n$PT^2 = PO^2 - r^2$\n\nGaris singgung persekutuan luar dua lingkaran:\n$d^2 = p^2 - (R-r)^2$\n\nGaris singgung persekutuan dalam:\n$d^2 = p^2 - (R+r)^2$\n\nDimana $p$ = jarak antar pusat, $R$ = jari-jari besar, $r$ = jari-jari kecil.` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Keliling lingkaran dengan jari-jari 14 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 44 cm", "B. 66 cm", "C. 88 cm", "D. 176 cm"], jawaban: "C", pembahasan: "$K = 2 \\times \\frac{22}{7} \\times 14 = 88$ cm → Jawaban C" },
  { no: 2, soal: "Luas lingkaran dengan diameter 21 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 346,5 cm²", "B. 462 cm²", "C. 1.386 cm²", "D. 3.241,5 cm²"], jawaban: "A", pembahasan: "$r = 10,5$ cm\n$L = \\frac{22}{7} \\times 10,5^2 = \\frac{22}{7} \\times 110,25 = 346,5$ cm² → Jawaban A" },
  { no: 3, soal: "Panjang busur dengan jari-jari 14 cm dan sudut pusat 90° adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 11 cm", "B. 22 cm", "C. 33 cm", "D. 44 cm"], jawaban: "B", pembahasan: "$PB = \\frac{90}{360} \\times 2 \\times \\frac{22}{7} \\times 14 = \\frac{1}{4} \\times 88 = 22$ cm → Jawaban B" },
  { no: 4, soal: "Luas juring dengan jari-jari 21 cm dan sudut pusat 60° adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 154 cm²", "B. 231 cm²", "C. 462 cm²", "D. 693 cm²"], jawaban: "B", pembahasan: "$LJ = \\frac{60}{360} \\times \\frac{22}{7} \\times 21^2 = \\frac{1}{6} \\times 1386 = 231$ cm² → Jawaban B" },
  { no: 5, soal: "Sudut pusat yang menghadap suatu busur adalah 80°. Sudut kelilingnya adalah …", options: ["A. 20°", "B. 40°", "C. 80°", "D. 160°"], jawaban: "B", pembahasan: "Sudut keliling = $\\frac{1}{2} \\times 80° = 40°$ → Jawaban B" },
  { no: 6, soal: "Dua sudut keliling yang menghadap busur yang sama besarnya 35°. Sudut pusatnya adalah …", options: ["A. 17,5°", "B. 35°", "C. 70°", "D. 140°"], jawaban: "C", pembahasan: "Sudut pusat = 2 × sudut keliling = 70° → Jawaban C" },
  { no: 7, soal: "Panjang garis singgung dari titik P ke lingkaran berjari-jari 5 cm adalah 12 cm. Jarak titik P ke pusat lingkaran adalah …", options: ["A. 7 cm", "B. 11 cm", "C. 13 cm", "D. 17 cm"], jawaban: "C", pembahasan: "$PO = \\sqrt{12^2+5^2} = \\sqrt{169} = 13$ cm → Jawaban C" },
  { no: 8, soal: "Sebuah roda berputar 100 kali menempuh jarak 314 m. Jari-jari roda tersebut adalah … (gunakan $\\pi = 3,14$)", options: ["A. 0,5 m", "B. 1 m", "C. 1,5 m", "D. 2 m"], jawaban: "A", pembahasan: "Keliling = 314/100 = 3,14 m\n$2\\pi r = 3,14 \\Rightarrow r = 0,5$ m → Jawaban A" },
  { no: 9, soal: "Luas tembereng dengan jari-jari 14 cm, sudut pusat 90° adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 42 cm²", "B. 56 cm²", "C. 98 cm²", "D. 154 cm²"], jawaban: "B", pembahasan: "Luas juring = $\\frac{90}{360} \\times \\frac{22}{7} \\times 196 = 154$ cm²\nLuas segitiga = $\\frac{1}{2} \\times 14 \\times 14 = 98$ cm²\nLuas tembereng = 154 - 98 = 56 cm² → Jawaban B" },
  { no: 10, soal: "Dua lingkaran berjari-jari 8 cm dan 3 cm berpusat di A dan B. Jika AB = 13 cm, panjang garis singgung persekutuan luarnya adalah …", options: ["A. 10 cm", "B. 12 cm", "C. 13 cm", "D. 15 cm"], jawaban: "B", pembahasan: "$d = \\sqrt{13^2-(8-3)^2} = \\sqrt{169-25} = \\sqrt{144} = 12$ cm → Jawaban B" },
  { no: 11, soal: "Keliling setengah lingkaran dengan diameter 28 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 44 cm", "B. 72 cm", "C. 88 cm", "D. 100 cm"], jawaban: "B", pembahasan: "Keliling = $\\pi r + d = \\frac{22}{7} \\times 14 + 28 = 44 + 28 = 72$ cm → Jawaban B" },
  { no: 12, soal: "Luas lingkaran dengan keliling 44 cm adalah … (gunakan $\\pi = \\frac{22}{7}$)", options: ["A. 77 cm²", "B. 121 cm²", "C. 154 cm²", "D. 308 cm²"], jawaban: "C", pembahasan: "$2\\pi r = 44 \\Rightarrow r = 7$ cm\n$L = \\pi r^2 = \\frac{22}{7} \\times 49 = 154$ cm² → Jawaban C" },
  { no: 13, soal: "Sudut keliling yang menghadap diameter = …", options: ["A. 45°", "B. 60°", "C. 90°", "D. 180°"], jawaban: "C", pembahasan: "Sudut keliling yang menghadap diameter (busur setengah lingkaran) = 90° → Jawaban C" },
  { no: 14, soal: "Titik P di luar lingkaran berjarak 10 cm dari pusat O. Jika jari-jari lingkaran 6 cm, panjang garis singgung dari P ke lingkaran adalah …", options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"], jawaban: "C", pembahasan: "$PT = \\sqrt{10^2-6^2} = \\sqrt{64} = 8$ cm → Jawaban C" },
  { no: 15, soal: "Panjang tali busur yang berjarak 5 cm dari pusat lingkaran berjari-jari 13 cm adalah …", options: ["A. 16 cm", "B. 20 cm", "C. 24 cm", "D. 26 cm"], jawaban: "C", pembahasan: "Setengah tali busur = $\\sqrt{13^2-5^2} = 12$ cm\nTali busur = 24 cm → Jawaban C" },
];

const LingkaranPage = () => (
  <TKAPemantapanLayout
    title="LINGKARAN"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default LingkaranPage;
