import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Faktor dan Kelipatan", content: `Faktor dari suatu bilangan adalah bilangan yang habis membagi bilangan tersebut.\nKelipatan dari suatu bilangan adalah hasil perkalian bilangan itu dengan 1, 2, 3, ...\n\nContoh:\nFaktor dari 12: 1, 2, 3, 4, 6, 12\nKelipatan dari 4: 4, 8, 12, 16, 20, 24, ...` },
  { heading: "B. Bilangan Prima dan Faktorisasi Prima", content: `Bilangan prima adalah bilangan yang tepat memiliki 2 faktor, yaitu 1 dan bilangan itu sendiri.\n\nDaftar bilangan prima: 2, 3, 5, 7, 11, 13, 17, 19, 23, ...\n\nFaktorisasi prima: menyatakan suatu bilangan sebagai perkalian bilangan-bilangan prima.\n\nContoh:\n$60 = 2^2 \\times 3 \\times 5$\n$84 = 2^2 \\times 3 \\times 7$` },
  { heading: "C. FPB (Faktor Persekutuan Terbesar)", content: `FPB dari dua atau lebih bilangan adalah faktor persekutuan terbesar dari bilangan-bilangan tersebut.\n\nCara menghitung FPB:\n- Pilih faktor prima yang sama\n- Gunakan pangkat terkecil\n\nContoh: FPB(60, 84)\n$60 = 2^2 \\times 3 \\times 5$\n$84 = 2^2 \\times 3 \\times 7$\nFPB = $2^2 \\times 3 = 12$` },
  { heading: "D. KPK (Kelipatan Persekutuan Terkecil)", content: `KPK dari dua atau lebih bilangan adalah kelipatan persekutuan terkecil dari bilangan-bilangan tersebut.\n\nCara menghitung KPK:\n- Pilih SEMUA faktor prima yang muncul\n- Gunakan pangkat terbesar\n\nContoh: KPK(60, 84)\n$60 = 2^2 \\times 3 \\times 5$\n$84 = 2^2 \\times 3 \\times 7$\nKPK = $2^2 \\times 3 \\times 5 \\times 7 = 420$` },
  { heading: "E. Hubungan KPK dan FPB", content: `$\\text{KPK}(a, b) \\times \\text{FPB}(a, b) = a \\times b$\n\nContoh:\nKPK(12, 18) × FPB(12, 18) = 12 × 18\n36 × 6 = 216 ✓` },
  { heading: "F. Aplikasi KPK dan FPB", content: `KPK digunakan saat mencari:\n- Saat dua kejadian bertemu kembali (serentak)\n- Waktu paling awal/cepat yang memenuhi syarat berganda\n\nFPB digunakan saat:\n- Membagi sesuatu menjadi kelompok sama besar tanpa sisa\n- Ukuran terbesar dari suatu pembagian` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Faktorisasi prima dari 180 adalah …", options: ["A. $2^2 \\times 3^2 \\times 5$", "B. $2^2 \\times 3 \\times 5^2$", "C. $2^3 \\times 3 \\times 5$", "D. $2 \\times 3^3 \\times 5$"], jawaban: "A", pembahasan: "$180 = 4 \\times 45 = 4 \\times 9 \\times 5 = 2^2 \\times 3^2 \\times 5$ → Jawaban A" },
  { no: 2, soal: "FPB dari 48 dan 72 adalah …", options: ["A. 12", "B. 24", "C. 36", "D. 48"], jawaban: "B", pembahasan: "$48 = 2^4 \\times 3$, $72 = 2^3 \\times 3^2$\nFPB = $2^3 \\times 3 = 24$ → Jawaban B" },
  { no: 3, soal: "KPK dari 12, 18, dan 24 adalah …", options: ["A. 36", "B. 48", "C. 72", "D. 144"], jawaban: "C", pembahasan: "$12=2^2\\times3$, $18=2\\times3^2$, $24=2^3\\times3$\nKPK = $2^3\\times3^2 = 72$ → Jawaban C" },
  { no: 4, soal: "FPB dan KPK dari dua bilangan adalah 6 dan 60. Jika salah satu bilangan 12, bilangan lain adalah …", options: ["A. 15", "B. 20", "C. 24", "D. 30"], jawaban: "D", pembahasan: "$FPB \\times KPK = a \\times b \\Rightarrow 6 \\times 60 = 12 \\times b$\n$b = 30$ → Jawaban D" },
  { no: 5, soal: "Tiga lampu berkedip setiap 4, 6, dan 8 detik. Jika serentak berkedip pukul 20.00, mereka akan serentak kembali pertama kali pada pukul …", options: ["A. 20.00.12", "B. 20.00.24", "C. 20.00.36", "D. 20.00.48"], jawaban: "B", pembahasan: "KPK(4,6,8) = 24 detik\nPukul 20.00 + 24 detik = 20.00.24 → Jawaban B" },
  { no: 6, soal: "Dua bus berangkat dari terminal yang sama. Bus A setiap 15 menit, bus B setiap 20 menit. Keduanya berangkat bersamaan pukul 07.00. Mereka berangkat bersama lagi pada pukul …", options: ["A. 07.45", "B. 08.00", "C. 08.15", "D. 08.30"], jawaban: "B", pembahasan: "KPK(15,20) = 60 menit\nPukul 07.00 + 60 menit = 08.00 → Jawaban B" },
  { no: 7, soal: "Pak Anton memiliki 48 buku dan 36 pensil yang akan dibagi rata kepada siswa. Banyak siswa terbanyak yang dapat menerima pembagian tersebut adalah …", options: ["A. 6 siswa", "B. 12 siswa", "C. 16 siswa", "D. 24 siswa"], jawaban: "B", pembahasan: "FPB(48, 36) = 12 siswa → Jawaban B" },
  { no: 8, soal: "Seorang petani mempunyai 60 jeruk, 90 mangga, dan 75 pepaya. Ia ingin membuat keranjang yang isinya sama (tiap keranjang berisi ketiga buah dengan jumlah sama). Keranjang terbanyak yang dapat dibuat adalah …", options: ["A. 10 keranjang", "B. 12 keranjang", "C. 15 keranjang", "D. 20 keranjang"], jawaban: "C", pembahasan: "FPB(60, 90, 75) = 15 → Jawaban C" },
  { no: 9, soal: "KPK dari $2^3 \\times 3^2$ dan $2^2 \\times 3^3 \\times 5$ adalah …", options: ["A. $2^2 \\times 3^2$", "B. $2^3 \\times 3^3$", "C. $2^3 \\times 3^3 \\times 5$", "D. $2^2 \\times 3^2 \\times 5$"], jawaban: "C", pembahasan: "Ambil pangkat terbesar: $2^3 \\times 3^3 \\times 5$ → Jawaban C" },
  { no: 10, soal: "Tiga orang berjaga secara bergantian. Andi berjaga setiap 6 hari, Budi setiap 8 hari, Candra setiap 12 hari. Jika mereka berjaga bersama pada tanggal 1 Januari, mereka akan berjaga bersama lagi pada tanggal …", options: ["A. 25 Januari", "B. 1 Februari", "C. 25 Februari", "D. 1 Maret"], jawaban: "B", pembahasan: "KPK(6,8,12) = 24 hari\n1 Januari + 24 hari = 25 Januari → Jawaban A" },
  { no: 11, soal: "Bilangan terbesar yang jika digunakan untuk membagi 72 dan 90 memberikan sisa yang sama adalah …", options: ["A. 6", "B. 9", "C. 18", "D. 36"], jawaban: "C", pembahasan: "FPB(72, 90) = $2 \\times 3^2 = 18$ → Jawaban C" },
  { no: 12, soal: "Bilangan yang memiliki tepat 3 faktor adalah …", options: ["A. 4", "B. 6", "C. 8", "D. 9"], jawaban: "A", pembahasan: "Faktor dari 4: 1, 2, 4 (tepat 3 faktor) → bilangan prima kuadrat → Jawaban A" },
  { no: 13, soal: "Selisih KPK dan FPB dari bilangan 36 dan 48 adalah …", options: ["A. 120", "B. 132", "C. 144", "D. 156"], jawaban: "B", pembahasan: "$36=2^2\\times3^2$, $48=2^4\\times3$\nFPB=$2^2\\times3=12$, KPK=$2^4\\times3^2=144$\nSelisih = 144-12 = 132 → Jawaban B" },
  { no: 14, soal: "Banyak bilangan antara 1 dan 100 yang merupakan bilangan prima adalah …", options: ["A. 21", "B. 24", "C. 25", "D. 26"], jawaban: "C", pembahasan: "Prima 1-100: 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97 = 25 bilangan → Jawaban C" },
  { no: 15, soal: "Jika FPB(a, 30) = 6 dan KPK(a, 30) = 90, nilai a adalah …", options: ["A. 12", "B. 15", "C. 18", "D. 24"], jawaban: "C", pembahasan: "$a \\times 30 = 6 \\times 90 = 540$\n$a = 18$ → Jawaban C" },
];

const KPKFPBPage = () => (
  <TKAPemantapanLayout
    title="KPK DAN FPB"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default KPKFPBPage;
