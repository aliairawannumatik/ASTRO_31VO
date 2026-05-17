import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Statistika", content: `Statistika adalah ilmu yang mempelajari cara pengumpulan, pengolahan, penyajian, dan analisis data.\n\nJenis data:\n- Data kualitatif: bukan berupa angka (warna, jenis kelamin)\n- Data kuantitatif: berupa angka (berat, tinggi, nilai)\n  - Data diskrit: hasil hitungan (jumlah siswa)\n  - Data kontinu: hasil pengukuran (tinggi badan)` },
  { heading: "B. Ukuran Pemusatan Data", content: `1. Mean (Rata-rata):\n$\\bar{x} = \\dfrac{\\sum x_i}{n}$\n\n2. Median (Nilai Tengah):\n- Data ganjil: nilai tengah setelah diurutkan\n- Data genap: rata-rata dua nilai tengah\n\n3. Modus: nilai yang paling sering muncul` },
  { heading: "C. Ukuran Penyebaran Data", content: `1. Jangkauan (Range): nilai max − nilai min\n\n2. Kuartil:\n- Q1 = kuartil bawah (25%)\n- Q2 = median (50%)\n- Q3 = kuartil atas (75%)\n- Jangkauan interkuartil (IQR) = Q3 − Q1\n\n3. Simpangan baku (standar deviasi):\n$SD = \\sqrt{\\dfrac{\\sum(x_i - \\bar{x})^2}{n}}$` },
  { heading: "D. Penyajian Data", content: `1. Tabel frekuensi\n2. Diagram batang\n3. Diagram garis\n4. Diagram lingkaran (pie chart)\n5. Histogram\n6. Ogive (poligon frekuensi kumulatif)\n\nFrekuensi relatif = $\\dfrac{f_i}{n} \\times 100\\%$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Nilai ujian 8 siswa: 75, 80, 65, 90, 85, 70, 80, 75. Rata-rata nilai tersebut adalah …", options: ["A. 76,25", "B. 77,5", "C. 78,75", "D. 80"], jawaban: "C", pembahasan: "Jumlah = 620, rata-rata = 620/8 = 77,5 → Jawaban B" },
  { no: 2, soal: "Nilai: 7, 5, 9, 6, 8, 7, 8, 9, 5, 6. Mediannya adalah …", options: ["A. 6,5", "B. 7", "C. 7,5", "D. 8"], jawaban: "C", pembahasan: "Urutan: 5,5,6,6,7,7,8,8,9,9\nMedian = (7+8)/2 = 7,5 → Jawaban C" },
  { no: 3, soal: "Data: 4, 6, 7, 8, 6, 9, 5, 6, 8, 7. Modusnya adalah …", options: ["A. 5", "B. 6", "C. 7", "D. 8"], jawaban: "B", pembahasan: "6 muncul 3 kali (terbanyak) → Modus = 6 → Jawaban B" },
  { no: 4, soal: "Rata-rata 6 bilangan adalah 12. Jika satu bilangan ditambahkan menjadi 7 bilangan, rata-ratanya menjadi 13. Bilangan yang ditambahkan adalah …", options: ["A. 16", "B. 18", "C. 19", "D. 21"], jawaban: "C", pembahasan: "Jumlah 6 bilangan = 72\nJumlah 7 bilangan = 91\nBilangan baru = 91 - 72 = 19 → Jawaban C" },
  { no: 5, soal: "Data nilai: 65, 70, 75, 80, 85, 90, 95. Jangkauannya adalah …", options: ["A. 25", "B. 30", "C. 35", "D. 40"], jawaban: "B", pembahasan: "Jangkauan = 95 - 65 = 30 → Jawaban B" },
  { no: 6, soal: "Data terurut: 3, 5, 7, 8, 9, 11, 13, 15. Kuartil atas (Q3) adalah …", options: ["A. 11", "B. 12", "C. 13", "D. 14"], jawaban: "B", pembahasan: "Q3 = median data bagian atas (9,11,13,15) = (11+13)/2 = 12 → Jawaban B" },
  { no: 7, soal: "Diagram lingkaran menunjukkan hobi siswa. Jika total 200 siswa, 90° menunjukkan hobi membaca. Banyak siswa yang hobi membaca adalah …", options: ["A. 40", "B. 45", "C. 50", "D. 90"], jawaban: "C", pembahasan: "$\\frac{90}{360} \\times 200 = 50$ siswa → Jawaban C" },
  { no: 8, soal: "Rata-rata berat badan 10 siswa adalah 55 kg. Jika seorang siswa yang beratnya 65 kg pergi dan diganti siswa baru, rata-rata menjadi 54 kg. Berat badan siswa baru adalah …", options: ["A. 50 kg", "B. 52 kg", "C. 54 kg", "D. 55 kg"], jawaban: "D", pembahasan: "Jumlah awal = 550\nJumlah setelah perubahan = 540\n540 = 550 - 65 + x\nx = 55 kg → Jawaban D" },
  { no: 9, soal: "Dari 40 nilai ujian, rata-rata = 72. Jika ada kesalahan: satu nilai yang seharusnya 85 tercatat 58. Rata-rata yang benar adalah …", options: ["A. 72,675", "B. 73,35", "C. 74,025", "D. 75,5"], jawaban: "A", pembahasan: "Jumlah = 2.880\nJumlah benar = 2.880 + 27 = 2.907\nRata-rata benar = 2907/40 = 72,675 → Jawaban A" },
  { no: 10, soal: "Dalam tabel distribusi frekuensi, frekuensi kelas 60-69 adalah 8 dari 40 data. Frekuensi relatifnya adalah …", options: ["A. 15%", "B. 20%", "C. 25%", "D. 30%"], jawaban: "B", pembahasan: "$\\frac{8}{40} \\times 100\\% = 20\\%$ → Jawaban B" },
  { no: 11, soal: "Lima bilangan: 10, 12, 15, x, 18. Rata-ratanya 14. Nilai x adalah …", options: ["A. 11", "B. 13", "C. 15", "D. 17"], jawaban: "B", pembahasan: "10+12+15+x+18 = 70\n55 + x = 70, x = 15 → Jawaban C" },
  { no: 12, soal: "Data: 6, 7, 8, 9, 10. Simpangan rata-ratanya adalah …", options: ["A. 1,2", "B. 1,5", "C. 2", "D. 2,5"], jawaban: "A", pembahasan: "Rata-rata = 8\n$\\frac{|6-8|+|7-8|+|8-8|+|9-8|+|10-8|}{5} = \\frac{2+1+0+1+2}{5} = \\frac{6}{5} = 1,2$ → Jawaban A" },
  { no: 13, soal: "Nilai rata-rata 15 siswa kelompok A adalah 78, rata-rata 10 siswa kelompok B adalah 83. Rata-rata gabungan adalah …", options: ["A. 79,5", "B. 80", "C. 80,5", "D. 81"], jawaban: "B", pembahasan: "$\\bar{x} = \\frac{15 \\times 78 + 10 \\times 83}{25} = \\frac{1170+830}{25} = \\frac{2000}{25} = 80$ → Jawaban B" },
  { no: 14, soal: "Median dari data: 22, 28, 35, 41, 47, 52, 59 adalah …", options: ["A. 35", "B. 41", "C. 44", "D. 47"], jawaban: "B", pembahasan: "Data = 7 nilai (ganjil), median = nilai ke-4 = 41 → Jawaban B" },
  { no: 15, soal: "Data: 5, 7, 9, 11, 13. Rata-rata, median, dan modus berturut-turut adalah …", options: ["A. 9, 9, tidak ada", "B. 9, 9, 9", "C. 9, tidak ada, 9", "D. tidak ada, 9, 9"], jawaban: "A", pembahasan: "Rata-rata = 45/5 = 9, Median = 9, tidak ada modus (semua berbeda) → Jawaban A" },
];

const StatistikaPage = () => (
  <TKAPemantapanLayout
    title="STATISTIKA"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default StatistikaPage;
