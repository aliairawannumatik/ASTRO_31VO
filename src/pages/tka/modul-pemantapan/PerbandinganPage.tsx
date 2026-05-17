import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  {
    heading: "A. Pengertian Perbandingan",
    content: `Perbandingan adalah suatu cara untuk membandingkan dua besaran yang sejenis, baik secara nilai maupun jumlah.\n\nContoh:\nJika tinggi Ani adalah 150 cm dan tinggi Budi 165 cm, maka perbandingan tinggi Ani dan Budi adalah:\n$150 : 165 = 10 : 11$ (dibagi 15)`,
  },
  {
    heading: "B. Jenis-Jenis Perbandingan",
    content: `1. Perbandingan Senilai (Seharga / Sebanding)\nPerbandingan senilai adalah perbandingan dua besaran yang jika salah satunya bertambah, maka yang lain juga bertambah secara tetap.\n\nContoh:\n- Jumlah barang bertambah → harga total bertambah\n- Waktu kerja bertambah → hasil kerja bertambah\n\nRumus:\n$\\frac{a_1}{a_2} = \\frac{b_1}{b_2}$\n\n2. Perbandingan Berbalik Nilai\nPerbandingan berbalik nilai adalah perbandingan dua besaran di mana jika satu bertambah, yang lain justru berkurang.\n\nContoh:\n- Banyak pekerja bertambah → waktu kerja berkurang\n- Kecepatan bertambah → waktu tempuh berkurang\n\nRumus:\n$\\frac{a_1}{a_2} = \\frac{b_2}{b_1}$\n\n3. Perbandingan Campuran\nPerbandingan campuran adalah metode matematika yang digunakan untuk menyelesaikan masalah yang melibatkan penggabungan dua atau lebih komponen dengan sifat yang berbeda untuk menciptakan campuran baru.\n\nRumus dasar:\n$(\\text{Kuantitas}_1 \\times \\text{Nilai}_1) + (\\text{Kuantitas}_2 \\times \\text{Nilai}_2) = (\\text{Kuantitas Total} \\times \\text{Nilai Campuran})$`,
  },
  {
    heading: "C. Skala",
    content: `Skala (S) merupakan perbandingan antara jarak/ukuran pada peta atau denah (Jp) dengan jarak/ukuran sebenarnya (Js).\n\n$S = \\frac{J_p}{J_s}$`,
  },
  {
    heading: "D. Menentukan Luas sebenarnya dan Luas pada peta",
    content: `Jika skala pada peta adalah $\\frac{1}{k}$ maka:\n\n- Mencari luas sebenarnya (Ls)\n$L_s = \\text{Luas Peta} \\times k^2$\n\n- Mencari Luas Peta (Lp)\n$L_p = \\frac{\\text{Luas Sebenarnya}}{k^2}$`,
  },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Sebuah toko menjual beberapa jenis kue. Untuk membuat 12 loyang kue bolu diperlukan 3 kg mentega. Mentega yang diperlukan untuk membuat 20 loyang kue bolu adalah ...", options: ["A. 4 kg", "B. 5 kg", "C. 6 kg", "D. 8 kg"], jawaban: "B", pembahasan: "Perbandingan senilai: loyang bertambah → mentega bertambah\n$\\frac{12}{20} = \\frac{3}{x}$\n$12x = 60$\n$x = 5$ kg → Jawaban B" },
  { no: 2, soal: "Sebuah pekerjaan dapat diselesaikan oleh 50 orang dalam waktu 8 bulan. Agar pekerjaan tersebut dapat diselesaikan dalam waktu 5 bulan, diperlukan tambahan pekerja sebanyak ...", options: ["A. 20 orang", "B. 42 orang", "C. 45 orang", "D. 80 orang"], jawaban: "A", pembahasan: "Perbandingan berbalik nilai:\n$50 \\times 8 = x \\times 5$\n$x = 80$ orang (total)\nTambahan = 80 - 50 = 30 orang → Jawaban A" },
  { no: 3, soal: "Jarak kota A ke kota B ditempuh oleh mobil dengan kecepatan rata-rata 60 km/jam dalam waktu 3 jam 30 menit. Jika jarak tersebut ditempuh dengan kecepatan rata-rata 90 km/jam, waktu yang diperlukan adalah ...", options: ["A. 2 jam 20 menit", "B. 2 jam 30 menit", "C. 2 jam 33 menit", "D. 2 jam 50 menit"], jawaban: "A", pembahasan: "Jarak = kecepatan × waktu = 60 × 3,5 = 210 km\nWaktu baru = jarak / kecepatan baru = 210 / 90 = 7/3 jam = 2 jam 20 menit → Jawaban A" },
  { no: 4, soal: "Pembangunan sebuah jembatan direncanakan selesai dalam waktu 132 hari oleh 24 pekerja. Sebelum pekerjaan dimulai ditambah 8 orang pekerja. Waktu untuk menyelesaikan pembangunan jembatan tersebut adalah ...", options: ["A. 99 hari", "B. 108 hari", "C. 126 hari", "D. 129 hari"], jawaban: "A", pembahasan: "Perbandingan berbalik nilai:\n$24 \\times 132 = (24+8) \\times t$\n$3168 = 32t$\n$t = 99$ hari → Jawaban A" },
  { no: 5, soal: "Sebuah rumah direncanakan dibangun selama 40 hari oleh 12 pekerja. Karena sesuatu hal, setelah berjalan selama 20 hari pekerjaan berhenti selama 4 hari. Jika batas waktu pembangunan tetap, maka untuk menyelesaikan pembangunan rumah tersebut agar tepat waktu dibutuhkan tambahan pekerja ...", options: ["A. 3 orang", "B. 6 orang", "C. 12 orang", "D. 15 orang"], jawaban: "A", pembahasan: "Total pekerjaan = 12 × 40 = 480 satuan\nPekerjaan selesai = 12 × 20 = 240 satuan\nSisa pekerjaan = 240 satuan\nSisa waktu = 40 - 20 - 4 = 16 hari\nPekerja dibutuhkan = 240 / 16 = 15 orang\nTambahan = 15 - 12 = 3 orang → Jawaban A" },
  { no: 6, soal: "Perbandingan berat badan A : B : C adalah 2 : 3 : 5. Jika selisih berat badan A dan C adalah 24 kg, maka jumlah berat badan ketiganya adalah ...", options: ["A. 90 kg", "B. 85 kg", "C. 80 kg", "D. 75 kg"], jawaban: "C", pembahasan: "A : B : C = 2 : 3 : 5\nSelisih A dan C = 5k - 2k = 3k = 24 → k = 8\nJumlah = (2+3+5)k = 10 × 8 = 80 kg → Jawaban C" },
  { no: 7, soal: "Perbandingan nilai A dan B adalah 2 : 3, sedangkan perbandingan nilai B dan C adalah 1 : 2. Jumlah nilai mereka bertiga adalah 176, maka selisih nilai A dan C adalah ...", options: ["A. 48", "B. 64", "C. 68", "D. 72"], jawaban: "B", pembahasan: "A:B = 2:3, B:C = 1:2 → samakan B: A:B:C = 2:3:6\n11k = 176 → k = 16\nSelisih A dan C = 4k = 64 → Jawaban B" },
  { no: 8, soal: "Perbandingan uang Ali dan Budi adalah 2 : 3, sedangkan perbandingan uang Budi dan Citra adalah 4 : 5. Jika uang Ali Rp. 30.000,00, maka uang Citra adalah ...", options: ["A. 45.000,00", "B. 54.000,00", "C. 56.250,00", "D. 75.500,00"], jawaban: "C", pembahasan: "Ali:Budi:Citra = 8:12:15\nAli = 8k = 30.000 → k = 3.750\nCitra = 15k = 56.250 → Jawaban C" },
  { no: 9, soal: "Perbandingan jumlah tabungan Narda dan Rizki adalah 3 : 4, sedangkan perbandingan tabungan Narda dan Lutfi adalah 5 : 2. Jika jumlah tabungan mereka bertiga Rp 8.200.000,00, maka selisih tabungan Rizki dan Lutfi adalah ....", options: ["A. Rp 350.000,00", "B. Rp 1.000.000,00", "C. Rp 1.400.000,00", "D. Rp 2.800.000,00"], jawaban: "D", pembahasan: "N:R:L = 15:20:6\n41k = 8.200.000 → k = 200.000\nRizki = 4.000.000, Lutfi = 1.200.000\nSelisih = 2.800.000 → Jawaban D" },
  { no: 10, soal: "Jarak dua kota pada peta adalah 20 cm. Jika skala peta 1 : 600.000, jarak dua kota sebenarnya adalah...", options: ["A. 1.200 km", "B. 120 km", "C. 30 km", "D. 12 km"], jawaban: "B", pembahasan: "Jarak sebenarnya = 20 × 600.000 = 12.000.000 cm = 120 km → Jawaban B" },
  { no: 11, soal: "Sebuah kebun pada denah berukuran 12 cm x 15 cm. Jika ukuran kebun yang sebenarnya 50 m x 40 m, maka skala yang digunakan adalah....", options: ["A. 3 : 100", "B. 3 : 800", "C. 3 : 1.250", "D. 3 : 1.000"], jawaban: "C", pembahasan: "Skala = 12 : 5000 = 3 : 1250 → Jawaban C" },
  { no: 12, soal: "Pada denah skala 1 : 200 terdapat gambar kebun yang berbentuk persegi panjang dengan ukuran 7 cm x 4,5 cm. Luas kebun sebenarnya adalah...", options: ["A. 58 $m^2$", "B. 63 $m^2$", "C. 126 $m^2$", "D. 140 $m^2$"], jawaban: "C", pembahasan: "Panjang = 7 × 200 = 1400 cm = 14 m\nLebar = 4,5 × 200 = 900 cm = 9 m\nLuas = 14 × 9 = 126 m² → Jawaban C" },
  { no: 14, soal: "Denah sebuah gedung berskala 1 : 300. Jika luas denah 125 $cm^2$, maka luas gedung sebenarnya adalah ...", options: ["A. 375 $m^2$", "B. 1.125 $m^2$", "C. 3.750 $m^2$", "D. 11.250 $m^2$"], jawaban: "B", pembahasan: "Luas sebenarnya = 125 × 300² = 125 × 90.000 = 11.250.000 cm² = 1.125 m² → Jawaban B" },
  { no: 16, soal: "Adi dapat menyelesaikan suatu pekerjaan selama 4 jam. Budi dapat menyelesaikan pekerjaan yang sama dalam waktu 6 jam. Jika pekerjaan tersebut dikerjakan Adi dan Budi bersama-sama, maka pekerjaan tersebut akan selesai dalam waktu ...", options: ["A. 1 jam 4 menit", "B. 1 jam 24 menit", "C. 2 jam 4 menit", "D. 2 jam 24 menit"], jawaban: "D", pembahasan: "Kecepatan kerja Adi = 1/4, Budi = 1/6 pekerjaan per jam\nBersama = 1/4 + 1/6 = 5/12\nWaktu = 12/5 jam = 2 jam 24 menit → Jawaban D" },
  { no: 17, soal: "Pompa air 'A' dapat mengisi kolam dalam waktu 3 jam, 'B' dalam 4 jam, 'C' dalam 6 jam. Jika ketiga pompa air digunakan bersama, waktu yang diperlukan untuk mengisi kolam sampai penuh adalah ...", options: ["A. 1 jam 15 menit", "B. 1 jam 20 menit", "C. 2 jam 15 menit", "D. 2 jam 20 menit"], jawaban: "B", pembahasan: "Bersama = 1/3 + 1/4 + 1/6 = 9/12 = 3/4 kolam per jam\nWaktu = 4/3 jam = 1 jam 20 menit → Jawaban B" },
  { no: 19, soal: "Sebuah perusahaan konstruksi mengerahkan 12 pekerja untuk menyelesaikan 2 unit rumah dalam waktu 30 hari. Jika perusahaan tersebut ingin menyelesaikan 3 unit rumah serupa dalam waktu 24 hari, berapa banyak pekerja yang harus mereka kerahkan?", options: ["A. 23 pekerja", "B. 22 pekerja", "C. 18 pekerja", "D. 15 pekerja"], jawaban: "A", pembahasan: "Kapasitas: 12 × 30 = 360 untuk 2 unit → 180 per unit\nUntuk 3 unit = 540 orang·hari\nDalam 24 hari: 540/24 = 22,5 ≈ 23 pekerja → Jawaban A" },
  { no: 20, soal: "Seorang peternak memiliki 40 ekor sapi yang dapat menghabiskan 60 karung pakan dalam waktu 15 hari. Jika peternak tersebut menjual 10 ekor sapinya (tersisa 30 ekor) dan ia hanya memiliki 45 karung pakan, berapa lama persediaan pakan tersebut akan habis?", options: ["A. 15 hari", "B. 20 hari", "C. 12 hari", "D. 25 hari"], jawaban: "A", pembahasan: "Konsumsi per sapi per hari = 60/(40×15) = 1/10 karung\n30 sapi per hari = 3 karung\nHari habis = 45/3 = 15 hari → Jawaban A" },
];

const PerbandinganPage = () => (
  <TKAPemantapanLayout
    title="PERBANDINGAN"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PerbandinganPage;
