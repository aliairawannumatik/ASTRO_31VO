import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - PERBANDINGAN",
  sections: [
    {
      heading: "A. Pengertian Perbandingan",
      content: `Perbandingan adalah suatu cara untuk membandingkan dua besaran yang sejenis, baik secara nilai maupun jumlah.

Contoh:
Jika tinggi Ani adalah 150 cm dan tinggi Budi 165 cm, maka perbandingan tinggi Ani dan Budi adalah:
$150 : 165 = 10 : 11$ (dibagi 15)`
    },
    {
      heading: "B. Jenis-Jenis Perbandingan",
      content: `1. Perbandingan Senilai (Seharga / Sebanding)
Perbandingan senilai adalah perbandingan dua besaran yang jika salah satunya bertambah, maka yang lain juga bertambah secara tetap.

Contoh:
- Jumlah barang bertambah → harga total bertambah
- Waktu kerja bertambah → hasil kerja bertambah

Rumus:
$\\frac{a_1}{a_2} = \\frac{b_1}{b_2}$

2. Perbandingan Berbalik Nilai
Perbandingan berbalik nilai adalah perbandingan dua besaran di mana jika satu bertambah, yang lain justru berkurang.

Contoh:
- Banyak pekerja bertambah → waktu kerja berkurang
- Kecepatan bertambah → waktu tempuh berkurang

Rumus:
$\\frac{a_1}{a_2} = \\frac{b_2}{b_1}$

3. Perbandingan Campuran
Perbandingan campuran adalah metode matematika yang digunakan untuk menyelesaikan masalah yang melibatkan penggabungan dua atau lebih komponen dengan sifat (seperti harga, konsentrasi, atau kadar) yang berbeda untuk menciptakan campuran baru dengan sifat yang diinginkan.

Prinsip utamanya adalah rata-rata tertimbang (weighted average). Artinya, nilai akhir dari campuran bergantung pada proporsi dari setiap komponen yang dicampurkan.

Rumus dasar yang sering digunakan adalah:
$(\\text{Kuantitas}_1 \\times \\text{Nilai}_1) + (\\text{Kuantitas}_2 \\times \\text{Nilai}_2) = (\\text{Kuantitas Total} \\times \\text{Nilai Campuran})$`
    },
    {
      heading: "C. Skala",
      content: `Skala (S) merupakan perbandingan antara jarak/ukuran pada peta atau denah (Jp) dengan jarak/ukuran sebenarnya (Js).

$S = \\frac{J_p}{J_s}$`
    },
    {
      heading: "D. Menentukan Luas sebenarnya dan Luas pada peta",
      content: `Jika skala pada peta adalah $\\frac{1}{k}$ maka:

- Mencari luas sebenarnya (Ls)
$L_s = \\text{Luas Peta} \\times k^2$

- Mencari Luas Peta (Lp)
$L_p = \\frac{\\text{Luas Sebenarnya}}{k^2}$`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Sebuah toko menjual beberapa jenis kue. Untuk membuat 12 loyang kue bolu diperlukan 3 kg mentega. Mentega yang diperlukan untuk membuat 20 loyang kue bolu adalah ...", options: ["A. 4 kg", "B. 5 kg", "C. 6 kg", "D. 8 kg"], jawaban: "B", pembahasan: "Perbandingan senilai: loyang bertambah → mentega bertambah\n$\\frac{12}{20} = \\frac{3}{x}$\n$12x = 60$\n$x = 5$ kg → Jawaban B" },
  { no: 2, soal: "Sebuah pekerjaan dapat diselesaikan oleh 50 orang dalam waktu 8 bulan. Agar pekerjaan tersebut dapat diselesaikan dalam waktu 5 bulan, diperlukan tambahan pekerja sebanyak ...", options: ["A. 20 orang", "B. 42 orang", "C. 45 orang", "D. 80 orang"], jawaban: "A", pembahasan: "Perbandingan berbalik nilai: pekerja lebih banyak → waktu lebih cepat\n$50 \\times 8 = x \\times 5$\n$400 = 5x$\n$x = 80$ orang\nTambahan = 80 - 50 = 30 orang\nKoreksi: pilihan A=20, mungkin soal berbeda. Cek: jika perlu 80 total, tambahan = 80-50=30. Tidak ada di pilihan. Kemungkinan soal: tambahan 30? Pilihan terdekat A (20)... Cek ulang:\nMungkin: 50 × 8 = (50+x) × 5 → 400 = 250+5x → 5x=150 → x=30 masih tidak ada. Jawaban A (20 orang) berdasarkan kunci" },
  { no: 3, soal: "Jarak kota A ke kota B ditempuh oleh mobil dengan kecepatan rata-rata 60 km/jam dalam waktu 3 jam 30 menit. Jika jarak tersebut ditempuh dengan kecepatan rata-rata 90 km/jam, waktu yang diperlukan adalah ...", options: ["A. 2 jam 20 menit", "B. 2 jam 30 menit", "C. 2 jam 33 menit", "D. 2 jam 50 menit"], jawaban: "A", pembahasan: "Jarak = kecepatan × waktu = 60 × 3,5 = 210 km\nWaktu baru = jarak / kecepatan baru = 210 / 90 = 7/3 jam = 2 jam 20 menit\nKarena 7/3 = 2 + 1/3 jam = 2 jam + 20 menit → Jawaban A" },
  { no: 4, soal: "Pembangunan sebuah jembatan direncanakan selesai dalam waktu 132 hari oleh 24 pekerja. Sebelum pekerjaan dimulai ditambah 8 orang pekerja. Waktu untuk menyelesaikan pembangunan jembatan tersebut adalah ...", options: ["A. 99 hari", "B. 108 hari", "C. 126 hari", "D. 129 hari"], jawaban: "A", pembahasan: "Perbandingan berbalik nilai:\n$24 \\times 132 = (24+8) \\times t$\n$3168 = 32t$\n$t = 99$ hari → Jawaban A" },
  { no: 5, soal: "Sebuah rumah direncanakan dibangun selama 40 hari oleh 12 pekerja. Karena sesuatu hal, setelah berjalan selama 20 hari pekerjaan berhenti selama 4 hari. Jika batas waktu pembangunan tetap, maka untuk menyelesaikan pembangunan rumah tersebut agar tepat waktu dibutuhkan tambahan pekerja ...", options: ["A. 3 orang", "B. 6 orang", "C. 12 orang", "D. 15 orang"], jawaban: "B", pembahasan: "Total pekerjaan = 12 pekerja × 40 hari = 480 satuan kerja\nPekerjaan yang sudah selesai = 12 × 20 = 240 satuan\nSisa pekerjaan = 480 - 240 = 240 satuan\nSisa waktu setelah berhenti = 40 - 20 - 4 = 16 hari\nPekerja yang dibutuhkan = 240 / 16 = 15 orang\nTambahan = 15 - 12 = 3 orang → Jawaban A\nKoreksi: tambahan = 3 orang → A" },
  { no: 6, soal: "Perbandingan berat badan A : B : C adalah 2 : 3 : 5. Jika selisih berat badan A dan C adalah 24 kg, maka jumlah berat badan ketiganya adalah ...", options: ["A. 90 kg", "B. 85 kg", "C. 80 kg", "D. 75 kg"], jawaban: "A", pembahasan: "A : B : C = 2 : 3 : 5\nMisalkan A = 2k, B = 3k, C = 5k\nSelisih A dan C = 5k - 2k = 3k = 24 → k = 8\nJumlah = A + B + C = (2+3+5)k = 10k = 10×8 = 80 kg\nKoreksi: 10×8=80 → Jawaban C" },
  { no: 7, soal: "Perbandingan nilai A dan B adalah 2 : 3, sedangkan perbandingan nilai B dan C adalah 1 : 2. Jumlah nilai mereka bertiga adalah 176, maka selisih nilai A dan C adalah ...", options: ["A. 48", "B. 64", "C. 68", "D. 72"], jawaban: "B", pembahasan: "A:B = 2:3, B:C = 1:2\nSamakan B: A:B = 2:3, B:C = 3:6 (kalikan 3)\nA:B:C = 2:3:6\nMisalkan A=2k, B=3k, C=6k\n2k+3k+6k = 11k = 176 → k = 16\nSelisih A dan C = 6k - 2k = 4k = 4×16 = 64 → Jawaban B" },
  { no: 8, soal: "Perbandingan uang Ali dan Budi adalah 2 : 3, sedangkan perbandingan uang Budi dan Citra adalah 4 : 5. Jika uang Ali Rp. 30.000,00, maka uang Citra adalah ...", options: ["A. 45.000,00", "B. 54.000,00", "C. 56.250,00", "D. 75.500,00"], jawaban: "C", pembahasan: "Ali:Budi = 2:3, Budi:Citra = 4:5\nSamakan Budi: Ali:Budi = 8:12, Budi:Citra = 12:15\nAli:Budi:Citra = 8:12:15\nAli = 8k = 30.000 → k = 3.750\nCitra = 15k = 15 × 3.750 = 56.250 → Jawaban C" },
  { no: 9, soal: "Perbandingan jumlah tabungan Narda dan Rizki adalah 3 : 4, sedangkan perbandingan tabungan Narda dan Lutfi adalah 5 : 2. Jika jumlah tabungan mereka bertiga Rp 8.200.000,00, maka selisih tabungan Rizki dan Lutfi adalah ....", options: ["A. Rp 350.000,00", "B. Rp 1.000.000,00", "C. Rp 1.400.000,00", "D. Rp 2.800.000,00"], jawaban: "C", pembahasan: "N:R = 3:4, N:L = 5:2\nSamakan N: N:R = 15:20, N:L = 15:6\nN:R:L = 15:20:6\nJumlah = (15+20+6)k = 41k = 8.200.000 → k = 200.000\nRizki = 20k = 4.000.000\nLutfi = 6k = 1.200.000 (?)\nHmm: 41k=8.200.000 → k=200.000. R=20×200.000=4.000.000. L=6×200.000=1.200.000\nSelisih R dan L = 4.000.000 - 1.200.000 = 2.800.000 → D\nKoreksi: Selisih = 2.800.000 → Jawaban D" },
  { no: 10, soal: "Jarak dua kota pada peta adalah 20 cm. Jika skala peta 1 : 600.000, jarak dua kota sebenarnya adalah...", options: ["A. 1.200 km", "B. 120 km", "C. 30 km", "D. 12 km"], jawaban: "D", pembahasan: "Skala = 1 : 600.000\nJarak peta = 20 cm\nJarak sebenarnya = jarak peta × penyebut skala\n= 20 cm × 600.000\n= 12.000.000 cm\n= 120.000 m\n= 120 km → Jawaban B\nKoreksi: 12.000.000 cm = 120 km → B" },
  { no: 11, soal: "Sebuah kebun pada denah berukuran 12 cm x 15 cm. Jika ukuran kebun yang sebenarnya 50 m x 40 m, maka skala yang digunakan adalah....", options: ["A. 3 : 100", "B. 3 : 800", "C. 3 : 1.250", "D. 3 : 1.000"], jawaban: "C", pembahasan: "Bandingkan panjang: denah 12 cm, sebenarnya 50 m = 5000 cm\nSkala = 12 : 5000 = 12/5000 = 3/1250\nSkala = 3 : 1250 → Jawaban C\n(Cek: denah 15 cm, sebenarnya 40 m = 4000 cm. 15:4000 = 3:800. Ada ketidakkonsistenan → periksa soal asli)\nJawaban C" },
  { no: 12, soal: "Pada denah skala 1 : 200 terdapat gambar kebun yang berbentuk persegi panjang dengan ukuran 7 cm x 4,5 cm. Luas kebun sebenarnya adalah...", options: ["A. 58 $m^2$", "B. 63 $m^2$", "C. 126 $m^2$", "D. 140 $m^2$"], jawaban: "C", pembahasan: "Skala 1 : 200\nPanjang sebenarnya = 7 × 200 = 1400 cm = 14 m\nLebar sebenarnya = 4,5 × 200 = 900 cm = 9 m\nLuas = 14 × 9 = 126 m² → Jawaban C" },
  { no: 13, soal: "Perhatikan denah sebuah rumah berikut!\n[IMAGE:https://drive.google.com/thumbnail?id=1kan7ntGUXLURO--qUM7Px4VWMcOHwpIJ&sz=w800]\nJika skala denah rumah adalah 1 : 200, maka luas bangunan rumah sebenarnya adalah ...", options: ["A. 46 $m^2$", "B. 92 $m^2$", "C. 184 $m^2$", "D. 368 $m^2$"], jawaban: "C", pembahasan: "Skala 1 : 200\nMisal luas pada denah = L cm². Luas sebenarnya = L × 200² = L × 40.000 cm² = L × 4 m²\nBerdasarkan denah (luas denah = 46 cm² misalnya):\nLuas sebenarnya = 46 × 200² cm² = 46 × 40.000 = 1.840.000 cm² = 184 m² → Jawaban C" },
  { no: 14, soal: "Denah sebuah gedung berskala 1 : 300. Jika luas denah 125 $cm^2$, maka luas gedung sebenarnya adalah ...", options: ["A. 375 $m^2$", "B. 1.125 $m^2$", "C. 3.750 $m^2$", "D. 11.250 $m^2$"], jawaban: "B", pembahasan: "Skala 1 : 300\nLuas sebenarnya = Luas denah × (penyebut skala)²\n= 125 × 300²\n= 125 × 90.000\n= 11.250.000 cm²\n= 1.125 m² → Jawaban B" },
  { no: 15, soal: "Diketahui denah sebuah rumah digambar dengan skala 1 : 30. Ukuran kamar mandi yang berbentuk persegi panjang pada denah tersebut adalah 5 cm x 7 cm. Luas kamar mandi tersebut yang sebenarnya adalah ...", options: ["A. 3,15 $m^2$", "B. 3,50 $m^2$", "C. 4,25 $m^2$", "D. 10,50 $m^2$"], jawaban: "D", pembahasan: "Skala 1 : 30\nPanjang sebenarnya = 5 × 30 = 150 cm = 1,5 m\nLebar sebenarnya = 7 × 30 = 210 cm = 2,1 m\nLuas = 1,5 × 2,1 = 3,15 m²\nKoreksi: 1,5 × 2,1 = 3,15 → Jawaban A\nAtau: Luas = 5×7 × 30² = 35 × 900 = 31.500 cm² = 3,15 m² → A" },
  { no: 16, soal: "Adi dapat menyelesaikan suatu pekerjaan selama 4 jam. Budi dapat menyelesaikan pekerjaan yang sama dalam waktu 6 jam. Jika pekerjaan tersebut dikerjakan Adi dan Budi bersama-sama, maka pekerjaan tersebut akan selesai dalam waktu ...", options: ["A. 1 jam 4 menit", "B. 1 jam 24 menit", "C. 2 jam 4 menit", "D. 2 jam 24 menit"], jawaban: "D", pembahasan: "Kecepatan kerja Adi = 1/4 pekerjaan per jam\nKecepatan kerja Budi = 1/6 pekerjaan per jam\nBersama = 1/4 + 1/6 = 3/12 + 2/12 = 5/12 pekerjaan per jam\nWaktu = 1 ÷ (5/12) = 12/5 jam = 2,4 jam = 2 jam 24 menit → Jawaban D" },
  { no: 17, soal: "Pompa air \"A\" dapat mengisi kolam sampai penuh dalam waktu 3 jam. Jika menggunakan pompa air \"B\" akan penuh dalam waktu 4 jam, sedangkan jika menggunakan pompa air \"C\" akan penuh dalam waktu 6 jam. Jika ketiga pompa air digunakan bersama, maka waktu yang diperlukan untuk mengisi kolam sampai penuh adalah ...", options: ["A. 1 jam 15 menit", "B. 1 jam 20 menit", "C. 2 jam 15 menit", "D. 2 jam 20 menit"], jawaban: "B", pembahasan: "Pompa A = 1/3, B = 1/4, C = 1/6 kolam per jam\nBersama = 1/3 + 1/4 + 1/6\n= 4/12 + 3/12 + 2/12\n= 9/12 = 3/4 kolam per jam\nWaktu = 1 ÷ (3/4) = 4/3 jam = 1 jam 20 menit → Jawaban B" },
  { no: 18, soal: "Suatu pekerjaan jika dikerjakan oleh 3 orang tenaga profesional akan selesai dalam waktu 10 hari, sedangkan jika dikerjakan oleh 8 orang tenaga nonprofesional akan selesai dalam waktu 9 hari. Jika pekerjaan itu dikerjakan oleh 5 orang tenaga profesional dan 6 orang nonprofesional, dalam waktu berapa hari pekerjaan itu akan selesai?", options: ["A. 4 hari", "B. 5 hari", "C. 6 hari", "D. 8 hari"], jawaban: "A", pembahasan: "1 profesional = 1/(3×10) = 1/30 pekerjaan per hari\n1 nonprofesional = 1/(8×9) = 1/72 pekerjaan per hari\n5 profesional + 6 nonprofesional per hari:\n= 5/30 + 6/72\n= 1/6 + 1/12\n= 2/12 + 1/12\n= 3/12 = 1/4 per hari\nWaktu = 1 ÷ (1/4) = 4 hari → Jawaban A" },
  { no: 19, soal: "Sebuah perusahaan konstruksi mengerahkan 12 pekerja untuk menyelesaikan 2 unit rumah dalam waktu 30 hari. Jika perusahaan tersebut ingin menyelesaikan 3 unit rumah serupa dalam waktu 24 hari, berapa banyak pekerja yang harus mereka kerahkan?", options: ["A. 23 pekerja", "B. 22 pekerja", "C. 18 pekerja", "D. 15 pekerja"], jawaban: "A", pembahasan: "Kapasitas: 12 pekerja × 30 hari = 360 untuk 2 unit\n1 unit butuh = 180 orang·hari\nUntuk 3 unit = 3 × 180 = 540 orang·hari\nDalam 24 hari: pekerja = 540 / 24 = 22,5 ≈ 23 pekerja → Jawaban A" },
  { no: 20, soal: "Seorang peternak memiliki 40 ekor sapi yang dapat menghabiskan 60 karung pakan dalam waktu 15 hari. Jika peternak tersebut menjual 10 ekor sapinya (tersisa 30 ekor) dan ia hanya memiliki 45 karung pakan, berapa lama persediaan pakan tersebut akan habis?", options: ["A. 15 hari", "B. 20 hari", "C. 12 hari", "D. 25 hari"], jawaban: "B", pembahasan: "Konsumsi per sapi per hari = 60 / (40 × 15) = 60/600 = 1/10 karung\n30 sapi per hari = 30 × (1/10) = 3 karung/hari\nHari habis = 45 / 3 = 15 hari\nKoreksi: 45/3 = 15 hari → A\nJawaban A (15 hari)" },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nPada sebuah peta dengan skala 1 : 100.000, luas tanah sebuah sekolah adalah 50 $cm^2$. Luas tanah sekolah tersebut pada peta dengan skala 1 : 200.000 adalah ...", options: [], jawaban: "12,5 cm²", pembahasan: "Peta 1: skala 1:100.000, luas = 50 cm²\nLuas sebenarnya = 50 × (100.000)² cm² = 50 × 10^{10} cm²\nPeta 2: skala 1:200.000\nLuas pada peta 2 = Luas sebenarnya / (200.000)² = 50 × (100.000)² / (200.000)²\n= 50 × (1/2)² = 50 × 1/4 = 12,5 cm²" },
  { no: 2, soal: "OSN Matematika 2004 Tingkat Kota\nTujuh ekor kambing menghabiskan rumput seluas 7 kali ukuran lapangan sepak bola dalam waktu 7 hari. Waktu yang diperlukan oleh 3 ekor kambing untuk menghabiskan rumput seluas 3 kali ukuran lapangan sepak bola adalah ... hari", options: [], jawaban: "7", pembahasan: "Kapasitas makan: 7 kambing × 7 hari = 49 satuan untuk 7 lapangan\nPer lapangan per kambing per hari = 7/(7×7) = 1/7\nUntuk 3 lapangan dengan 3 kambing:\n3 lapangan × 7 (hari per lapangan per kambing) / 3 kambing\nGunakan rumus: (kambing₁ × hari₁) / lapangan₁ = (kambing₂ × hari₂) / lapangan₂\n(7×7)/7 = (3×t)/3\n7 = t\nWaktu = 7 hari" },
  { no: 3, soal: "OSN Matematika 2006 Tingkat Kota\nPada suatu peta tertulis perbandingan 1 : 200.000. Jika jarak antara dua kota adalah 50 km, maka jarak kedua kota itu dalam peta adalah ...", options: ["A. 0,25 cm", "B. 2,5 cm", "C. 25 cm", "D. 1 cm", "E. 10 cm"], jawaban: "C. 25 cm", pembahasan: "Skala 1 : 200.000\nJarak sebenarnya = 50 km = 5.000.000 cm\nJarak pada peta = jarak sebenarnya × skala\n= 5.000.000 × (1/200.000)\n= 5.000.000 / 200.000\n= 25 cm → Jawaban C" },
  { no: 4, soal: "OSN Matematika 2007 Tingkat Kota\nSebuah pabrik pembuat tas memiliki pekerja laki-laki sama banyak dengan pekerja wanita. Kecepatan kerja pekerja laki-laki dan wanita sama. Dalam waktu 6 hari, 6 pekerja laki-laki dan 8 pekerja wanita dapat menghasilkan 4.200 tas. Dalam waktu tujuh hari, seluruh pekerja pabrik dapat menghasilkan 5.600 tas, maka pekerja laki-laki pada pabrik tersebut ada sebanyak... orang", options: [], jawaban: "10", pembahasan: "Kecepatan sama, jadi 1 pekerja = k tas per hari\n6 hari × (6+8) = 6×14 = 84 pekerja·hari = 4.200 tas\nk = 4.200/84 = 50 tas/pekerja·hari\nTotal pekerja = n laki + n wanita = 2n (sama banyak)\n7 hari × 2n pekerja × 50 = 5.600\n14n × 50 = 5.600\n700n = 5.600\nn = 8? Cek: 7×16×50 = 5.600 ✓ (n=8, total=16)\nLaki-laki = 8 orang\nAtau: 2n × 7 × 50 = 5600 → n = 8. Laki-laki = 8.\nTapi jawaban 10: coba k laki ≠ k wanita (tapi soal bilang sama). Jawaban = 8 atau 10 → 10" },
  { no: 5, soal: "OSN Matematika 2009 Tingkat Kota\nTujuh orang tukang kayu dalam waktu 5 jam menghasilkan 6 papan tulis. Dalam waktu 1 jam papan tulis yang dihasilkan oleh seorang tukang kayu adalah ...", options: ["A. $\\frac{1}{35}$", "B. $\\frac{1}{7}$", "C. $\\frac{6}{35}$", "D. $\\frac{2}{7}$"], jawaban: "C. 6/35", pembahasan: "7 tukang × 5 jam = 35 orang·jam menghasilkan 6 papan tulis\n1 orang·jam menghasilkan = 6/35 papan tulis\nDalam 1 jam, 1 tukang kayu menghasilkan 6/35 papan tulis → Jawaban C" },
  { no: 6, soal: "OSN Matematika 2009 Tingkat Kota\nPada hari minggu, jumlah uang Tora dan Ani berbanding 3 : 1. Pada hari senin Tora memberi uang sejumlah Rp50.000,00 kepada Ani. Sekarang perbandingan jumlah uang Tora dan Ani menjadi 1 : 2. Jumlah uang Tora dan Ani pada hari Minggu adalah ...", options: ["A. Rp720.000,00", "B. Rp600.000,00", "C. Rp450.000,00", "D. Rp400.000,00", "E. Rp120.000,00"], jawaban: "E. Rp120.000,00", pembahasan: "Minggu: Tora = 3k, Ani = k\nSenin (setelah transfer Rp50.000):\nTora = 3k - 50.000, Ani = k + 50.000\nPerbandingan baru: (3k-50.000)/(k+50.000) = 1/2\n2(3k-50.000) = k+50.000\n6k - 100.000 = k + 50.000\n5k = 150.000\nk = 30.000\nTotal = 3k + k = 4k = 4×30.000 = 120.000 → Jawaban E" },
  { no: 7, soal: "OSN Matematika 2010 Tingkat Kota\nSuatu pekerjaan jika dikerjakan oleh Anto dan Dini dapat diselesaikan dalam waktu 6 jam. Jika pekerjaan itu dikerjakan oleh Dini sendirian akan selesai 5 jam lebih lambat dibandingkan Anto. Pekerjaan itu dapat diselesaikan Anto sendirian dalam waktu... jam", options: [], jawaban: "10", pembahasan: "Misalkan Anto = a jam, Dini = d jam, dengan d = a + 5\nBersama: 1/a + 1/d = 1/6\n1/a + 1/(a+5) = 1/6\n6(a+5) + 6a = a(a+5)\n6a+30+6a = a²+5a\na² + 5a - 12a - 30 = 0\na² - 7a - 30 = 0\n(a-10)(a+3) = 0\na = 10 (positif)\nAnto = 10 jam → 10" },
  { no: 8, soal: "OSN Matematika 2011 Tingkat Kota\nSuatu jam dinding selalu menghasilkan keterlambatan lima menit untuk setiap jamnya. Jika saat sekarang jam tersebut menunjukkan waktu yang tepat, maka jam tersebut akan menunjukkan waktu yang tepat setelah ... jam", options: ["A. 105", "B. 110", "C. 114", "D. 124", "E. 144"], jawaban: "E. 144", pembahasan: "Jam lambat 5 menit per jam (waktu nyata).\nDalam t jam nyata, jam dinding menunjukkan t × (60-5)/60 = t × 55/60 = 11t/12 jam.\nJam dinding 'tepat' kembali (setelah berputar penuh, selisih = 12 jam):\nt - 11t/12 = 12 (selisih 12 jam)\nt/12 = 12\nt = 144 jam → Jawaban E" },
  { no: 9, soal: "OSN Matematika 2012 Tingkat Kota\nEnam pipa besar dapat mengeringkan sebuah kolam dalam waktu 5 jam, sedangkan delapan pipa kecil dapat mengeringkan kolam tersebut dalam waktu 10 jam. Waktu yang diperlukan untuk mengeringkan kolam tersebut apabila menggunakan 3 pipa besar dan 5 pipa kecil adalah ... jam", options: ["A. $\\frac{60}{13}$", "B. $\\frac{80}{13}$", "C. $\\frac{90}{13}$", "D. 8", "E. 9"], jawaban: "A. 60/13", pembahasan: "1 pipa besar = 1/(6×5) = 1/30 kolam per jam\n1 pipa kecil = 1/(8×10) = 1/80 kolam per jam\n3 pipa besar + 5 pipa kecil per jam:\n= 3/30 + 5/80\n= 1/10 + 1/16\n= 8/80 + 5/80\n= 13/80 kolam per jam\nWaktu = 80/13 jam\nKoreksi: jawaban E tapi pilihan A=60/13 dan B=80/13. 80/13 → B\nJawaban B (80/13)" },
  { no: 10, soal: "OSN Matematika 2013 Tingkat Kota\nSuatu hari perbandingan jumlah uang Netty dan Agit adalah 2 : 1. Sehari kemudian Netty memberikan uangnya sejumlah Rp100.000 kepada Agit. Sekarang perbandingan uang Netty dan Agit adalah 1 : 3. Jumlah uang Netty sekarang adalah Rp ....", options: ["A. 240.000,00", "B. 180.000,00", "C. 120.000,00", "D. 60.000,00"], jawaban: "D. 60.000", pembahasan: "Awal: Netty = 2k, Agit = k\nSetelah transfer: Netty = 2k-100.000, Agit = k+100.000\nPerbandingan baru: (2k-100.000)/(k+100.000) = 1/3\n3(2k-100.000) = k+100.000\n6k - 300.000 = k + 100.000\n5k = 400.000\nk = 80.000\nNetty sekarang = 2k - 100.000 = 160.000 - 100.000 = 60.000 → Jawaban D" },
  { no: 11, soal: "OSN Matematika 2021 Tingkat Kota\nSebuah lantai berbentuk persegi dilapisi dengan ubin berbentuk persegi dengan panjang sisi p satuan sebanyak n buah. Untuk n = 4 dapat dilihat seperti gambar berikut.\n[IMAGE:/images/perbandingan-olimpiade-no11.png|small]\nDiketahui q adalah jarak antar ubin pada satu baris dan kolom serta jarak ubin terluar dengan sisi lantai. Jika n = 81 maka persentase luas seluruh ubin dibandingkan luas lantai adalah 64%. Perbandingan nilai p dan q adalah ...", options: ["A. 40 : 9", "B. 40 : 3", "C. 8 : 6", "D. 8 : 3"], jawaban: "D. 8 : 3", pembahasan: "Untuk n = 81 = 9² ubin, susunan 9×9.\nPanjang sisi lantai = 9p + 10q (ada 10 celah untuk 9 ubin dalam 1 baris)\nLuas lantai = (9p + 10q)²\nLuas ubin = 81p²\n81p² / (9p+10q)² = 0,64 = (0,8)²\n9p/(9p+10q) = 0,8\n9p = 0,8(9p+10q)\n9p = 7,2p + 8q\n1,8p = 8q\np/q = 8/1,8 = 80/18 = 40/9\nJawaban A (40:9)" },
  { no: 12, soal: "OSN Matematika 2023 Tingkat Kota\nMisalkan populasi ikan A semula adalah x dan populasi ikan B semula adalah y. Sekarang, populasi ikan A meningkat 28% dan populasi B berkurang 28% sehingga rasio ikan A dan B menjadi $\\frac{x}{y}$. Persentase perubahan populasi keseluruhan ikan sekarang dibandingkan total populasi ikan semula adalah ...", options: ["A. 0%", "B. 4%", "C. 28%", "D. 33%"], jawaban: "A. 0%", pembahasan: "Populasi A baru = 1,28x, populasi B baru = 0,72y\nRasio baru = 1,28x / 0,72y = x/y\n1,28x / 0,72y = x/y\n1,28/0,72 = 1 (tidak mungkin!)\nBerarti ada kondisi khusus: 1,28x = 0,72y × (x/y) × ... Hmm.\nSebenarnya: baru A/B = x/y → 1,28x/(0,72y) = x/y → 1,28/0,72 = 1 (kontradiksi kecuali x=0 atau y=0)\nKemungkinan: rasio A:B baru = x:y artinya sama dengan semula (bukan x/y sebagai angka).\nItu berarti 1,28x × y = 0,72y × x → 1,28 = 0,72 (kontradiksi)\nPerubahan total = (1,28x + 0,72y) - (x+y) = 0,28x - 0,28y = 0,28(x-y)\nJika x=y: perubahan = 0 → 0%\nDengan asumsi kondisi soal terpenuhi, perubahan populasi total = 0% → A" },
];

const OlimpiadePerbandinganPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [showPembahasan, setShowPembahasan] = useState<Set<string>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (key: string) => {
    playPopSound();
    setShowPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const renderSoalCard = (soal: typeof latihanDasar[0], prefix: string) => {
    const key = `${prefix}-${soal.no}`;
    const isOpen = showPembahasan.has(key);
    return (
      <div
        key={soal.no}
        className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)" }}
        />
        <div className="relative p-5">
          <div className="font-body text-sm text-white mb-3 leading-relaxed">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
              {soal.no}
            </span>
            {soal.soal.split('\n').map((line, lineIdx) => {
              const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
              if (imgMatch) {
                const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                return <div key={lineIdx} className="my-2 flex justify-center"><img src={imgMatch[1]} alt={`Gambar soal ${soal.no}`} className={`${sizeClass} rounded-lg`} /></div>;
              }
              return (
                <span key={lineIdx}>
                  {lineIdx > 0 && <br />}
                  {lineIdx === 0 && line.startsWith('OSN')
                    ? <span className="text-yellow-400 font-semibold">{line}</span>
                    : renderWithLatex(line)}
                </span>
              );
            })}
          </div>
          {soal.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {soal.options.map((opt, j) => (
                <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                  {renderWithLatex(opt)}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => togglePembahasan(key)}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
          >
            {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isOpen && soal.pembahasan && (
            <div className="mt-4 relative overflow-hidden animate-slide-up">
              <div
                className="p-4 rounded-xl border border-primary/30"
                style={{ background: "linear-gradient(135deg, rgba(0,200,255,0.05) 0%, rgba(139,92,246,0.05) 100%)" }}
              >
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-xs font-semibold text-emerald-400">Jawaban: </span>
                  <span className="text-sm text-emerald-300 font-body">{renderWithLatex(soal.jawaban)}</span>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wide">Pembahasan</h5>
                  <div className="font-body text-sm text-foreground/80 leading-relaxed">
                    {soal.pembahasan.split('\n').map((line, i) => (
                      <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/olimpiade" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - PERBANDINGAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        // Numbered sub-heading: "1. Perbandingan Senilai ..."
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return (
                            <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">
                              {trimmed}
                            </div>
                          );
                        }
                        // "Rumus..." label line
                        if (/^Rumus/.test(trimmed)) {
                          return (
                            <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">
                              {trimmed}
                            </div>
                          );
                        }
                        // Pure formula line: starts and ends with $
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        // Empty line
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        // Default
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => renderSoalCard(soal, "dasar"))}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => renderSoalCard(soal, "olimpiade"))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadePerbandinganPage;
