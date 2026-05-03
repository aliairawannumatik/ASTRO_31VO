import type { Pembahasan } from "@/components/PembahasanCard";

export const statistikaDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "B. 70 dan 80",
    konsepTrik:
      "Modus = nilai yang paling sering muncul. Median = nilai tengah data setelah diurutkan. Untuk data genap, median = rata-rata dua data tengah.",
    stepByStep:
      "Frekuensi tiap nilai: 65(1), 70(4), 80(3), 85(2), 90(1), 95(1) → total 12 data\n" +
      "Modus = 70 (muncul paling banyak, 4 kali)\n" +
      "Data diurutkan: 65, 70, 70, 70, 70, 80, 80, 80, 85, 85, 90, 95\n" +
      "Median = rata-rata data ke-6 dan ke-7 = $\\frac{80+80}{2} = 80$",
    tips:
      "Susun data dalam tabel frekuensi terlebih dahulu untuk memudahkan penghitungan modus dan median.",
    kesimpulan:
      "Modus = 70 (frekuensi terbanyak) dan Median = 80 (nilai tengah dari 12 data).",
  },
  2: {
    jawaban: "C. 6,5 dan 6,1",
    konsepTrik:
      "Urutkan data terlebih dahulu sebelum mencari median. Untuk 12 data (genap), median = rata-rata data ke-6 dan ke-7. Mean = jumlah semua data ÷ banyak data.",
    stepByStep:
      "Data diurutkan (12): 2, 3, 5, 5, 5, 6, 7, 7, 7, 7, 9, 10\n" +
      "Median = $\\frac{6+7}{2} = 6{,}5$\n" +
      "Mean = $\\frac{2+3+5+5+5+6+7+7+7+7+9+10}{12} = \\frac{73}{12} \\approx 6{,}1$",
    tips:
      "Urutan data sangat penting! Selalu urutkan data dari kecil ke besar sebelum mencari median.",
    kesimpulan:
      "Median = 6,5 dan Mean ≈ 6,1.",
  },
  3: {
    jawaban: "C. 7,5",
    konsepTrik:
      "Untuk data tabel frekuensi, hitung frekuensi kumulatif untuk menemukan posisi data tengah. Median = rata-rata data ke-n/2 dan ke-n/2+1.",
    stepByStep:
      "Total siswa = 2+4+5+5+9+3+4 = 32\n" +
      "Median = rata-rata data ke-16 dan ke-17\n" +
      "Frekuensi kumulatif: nilai 4(2), 5(6), 6(11), 7(16), 8(25), ...\n" +
      "Data ke-16 = nilai 7, data ke-17 = nilai 8\n" +
      "Median = $\\frac{7+8}{2} = 7{,}5$",
    tips:
      "Frekuensi kumulatif membantu menemukan 'letak' data ke-n tanpa harus menuliskan semua data satu per satu.",
    kesimpulan:
      "Median data dari tabel frekuensi dengan 32 siswa adalah 7,5.",
  },
  4: {
    jawaban: "B. Median data 6,5",
    konsepTrik:
      "Hitung semua ukuran statistik: mean, modus, median, dan jangkauan. Lalu verifikasi pernyataan mana yang benar.",
    stepByStep:
      "Total = 30 data\n" +
      "Mean = $\\frac{6+20+25+18+28+32+36+30}{30} = \\frac{195}{30} = 6{,}5$\n" +
      "Kumulatif: 2, 7, 12, 15, 19, ... → data ke-15 = nilai 6, ke-16 = nilai 7\n" +
      "Median = $\\frac{6+7}{2} = 6{,}5$ ✓",
    tips:
      "Jika soal meminta pernyataan yang benar/salah, hitung semua ukuran lalu bandingkan satu per satu.",
    kesimpulan:
      "Median data adalah 6,5 (sama dengan mean). Pernyataan B adalah yang benar.",
  },
  5: {
    jawaban: "C. 8",
    konsepTrik:
      "Mean dari data frekuensi = $\\frac{\\sum f_i \\cdot x_i}{\\sum f_i}$. Kalikan tiap nilai dengan frekuensinya, jumlahkan, bagi dengan total frekuensi.",
    stepByStep:
      "Total siswa = 2+4+6+5+3 = 20\n" +
      "Jumlah nilai = $6\\cdot2 + 7\\cdot4 + 8\\cdot6 + 9\\cdot5 + 10\\cdot3$\n" +
      "= 12 + 28 + 48 + 45 + 30 = 163\n" +
      "Mean = $\\frac{163}{20} = 8{,}15$ → pembulatan ke bilangan terdekat = 8",
    tips:
      "Buat kolom tambahan $f \\cdot x$ di tabel untuk mempermudah penjumlahan.",
    kesimpulan:
      "Mean nilai ulangan ≈ 8,15, dibulatkan menjadi 8.",
  },
  6: {
    jawaban: "A. 2 : 1",
    konsepTrik:
      "Gunakan rumus rata-rata gabungan: $\\bar{x}_{gab} = \\frac{n_1\\bar{x}_1 + n_2\\bar{x}_2}{n_1 + n_2}$. Buat persamaan dan cari perbandingan $n_1 : n_2$.",
    stepByStep:
      "Misal banyak putra = $x$, putri = $y$\n" +
      "$\\frac{7{,}2x + 8{,}1y}{x+y} = 7{,}5$\n" +
      "$7{,}2x + 8{,}1y = 7{,}5x + 7{,}5y$\n" +
      "$0{,}6y = 0{,}3x \\Rightarrow \\frac{x}{y} = 2$\n" +
      "Rasio putra : putri = 2 : 1",
    tips:
      "Pada masalah rata-rata gabungan, jika rata-rata gabungan lebih dekat ke salah satu kelompok, kelompok itu lebih banyak.",
    kesimpulan:
      "Perbandingan siswa putra dan putri = 2 : 1.",
  },
  7: {
    jawaban: "A. 12 orang",
    konsepTrik:
      "Gunakan sistem persamaan: total siswa diketahui (L + P = 36) dan rata-rata gabungan diketahui. Cari L (banyak laki-laki).",
    stepByStep:
      "L + P = 36, rata-rata gabungan 72\n" +
      "$\\frac{66L + 75P}{36} = 72 \\Rightarrow 66L + 75P = 2592$\n" +
      "Substitusi $P = 36 - L$:\n" +
      "$66L + 75(36-L) = 2592$\n" +
      "$-9L = 2592 - 2700 = -108 \\Rightarrow L = 12$",
    tips:
      "Buat dua persamaan (jumlah + rata-rata gabungan) lalu selesaikan dengan substitusi.",
    kesimpulan:
      "Banyak siswa laki-laki = 12 orang.",
  },
  8: {
    jawaban: "C. 4",
    konsepTrik:
      "Buat sistem persamaan: L + P = 20 dan persamaan rata-rata gabungan. Cari masing-masing, lalu hitung selisihnya.",
    stepByStep:
      "L + P = 20, rata-rata gabungan 7\n" +
      "$6L + 8{,}5P = 20 \\times 7 = 140$\n" +
      "Substitusi $L = 20 - P$:\n" +
      "$6(20-P) + 8{,}5P = 140$\n" +
      "$2{,}5P = 20 \\Rightarrow P = 8$, $L = 12$\n" +
      "Selisih = 12 − 8 = 4",
    tips:
      "Selisih L − P = 4. Periksa: rata-rata gabungan mendekati 6 (rata-rata laki-laki) → laki-laki lebih banyak.",
    kesimpulan:
      "Selisih banyak siswa laki-laki dan perempuan = 4 orang.",
  },
  9: {
    jawaban: "C. 104 orang",
    konsepTrik:
      "Pada diagram lingkaran, jumlah semua sudut = 360°. Cari sudut sektor Penjas, lalu hitung proporsinya dari total.",
    stepByStep:
      "Sudut Penjas = 360° − (30°+54°+48°+72°) = 360° − 204° = 156°\n" +
      "Banyak siswa Penjas = $\\frac{156}{360} \\times 240 = 104$ orang",
    tips:
      "Jumlah semua sudut = 360°. Cari sudut yang belum diketahui dengan pengurangan.",
    kesimpulan:
      "Banyak siswa yang gemar Penjas = 104 orang.",
  },
  10: {
    jawaban: "A. 180",
    konsepTrik:
      "Pada diagram lingkaran dengan persentase, gunakan proporsi: banyak buku = persentase × total buku.",
    stepByStep:
      "20% buku kesenian = 200 eksemplar\n" +
      "Total buku = $\\frac{200}{20\\%} = 1000$ eksemplar\n" +
      "Buku kesehatan = 18% × 1000 = 180 eksemplar",
    tips:
      "Gunakan salah satu data yang lengkap (persentase + jumlah) untuk mencari total, lalu hitung sisanya.",
    kesimpulan:
      "Banyak buku kesehatan = 180 eksemplar.",
  },
  11: {
    jawaban: "D. Rp 7.500.000,00",
    konsepTrik:
      "Penyusutan dalam satu tahun = harga tahun ini − harga tahun berikutnya. Baca nilai dari diagram garis.",
    stepByStep:
      "Harga 2015 = Rp 110.000.000\n" +
      "Harga 2016 = Rp 102.500.000\n" +
      "Penyusutan = 110.000.000 − 102.500.000 = Rp 7.500.000",
    tips:
      "Baca diagram garis dengan teliti. Nilai di sumbu-y harus dibaca dengan tepat sesuai skala.",
    kesimpulan:
      "Penyusutan harga mobil dari 2015 ke 2016 = Rp 7.500.000.",
  },
  12: {
    jawaban: "C. 11 orang",
    konsepTrik:
      "Hitung mean terlebih dahulu, lalu hitung berapa siswa dengan nilai di atas mean.",
    stepByStep:
      "Total = 2+3+4+5+3+2+1 = 20 siswa\n" +
      "Mean = $\\frac{3\\cdot2+4\\cdot3+5\\cdot4+6\\cdot5+7\\cdot3+8\\cdot2+9\\cdot1}{20} = \\frac{114}{20} = 5{,}7$\n" +
      "Nilai > 5,7: nilai 6(5), 7(3), 8(2), 9(1) → total = 5+3+2+1 = 11 siswa",
    tips:
      "Hitung mean dulu, baru tentukan mana nilai yang lebih besar dari mean tersebut.",
    kesimpulan:
      "Sebanyak 11 siswa memiliki nilai di atas rata-rata (5,7).",
  },
  13: {
    jawaban: "A. 55 orang",
    konsepTrik:
      "Total pengunjung 5 hari = mean × banyak hari. Pengunjung hari yang tidak diketahui = total − jumlah hari lain.",
    stepByStep:
      "Total 5 hari = 5 × 41 = 205 orang\n" +
      "Jumlah Senin, Selasa, Kamis, Jumat = 30+45+50+25 = 150\n" +
      "Pengunjung Rabu = 205 − 150 = 55 orang",
    tips:
      "Jika mean dan total hari diketahui, total keseluruhan = mean × n. Lalu kurangi data yang diketahui.",
    kesimpulan:
      "Pengunjung perpustakaan pada hari Rabu = 55 orang.",
  },
  14: {
    jawaban: "B",
    konsepTrik:
      "Pernyataan tentang statistik: mean tidak harus sama dengan median. Periksa pernyataan B: jika ada 23 anak setinggi tepat 130 cm dan 1 anak 133 cm, tinggi anak ke-25 bisa dihitung dari total.",
    stepByStep:
      "Total tinggi = 25 × 130 = 3250 cm\n" +
      "Jika 23 anak @ 130 cm, 1 anak @ 133 cm:\n" +
      "Total 24 anak = 23×130 + 133 = 3123 cm\n" +
      "Tinggi anak ke-25 = 3250 − 3123 = 127 cm ✓\n" +
      "Pernyataan B terbukti benar.",
    tips:
      "Untuk membuktikan pernyataan tentang data statistik, cari contoh konkret yang memenuhi kondisi tersebut.",
    kesimpulan:
      "Pernyataan B adalah yang pasti benar: satu anak memiliki tinggi 127 cm jika kondisi lainnya terpenuhi.",
  },
  15: {
    jawaban: "D. 8",
    konsepTrik:
      "Kuartil ketiga (Q₃) = median dari paruh atas data (setengah data bagian atas). Untuk 12 data, paruh atas = data ke-7 sampai ke-12.",
    stepByStep:
      "Data diurutkan (12): 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 10\n" +
      "Paruh atas (6 data terakhir): 6, 7, 8, 8, 9, 10\n" +
      "Q₃ = median dari paruh atas = $\\frac{8+8}{2} = 8$",
    tips:
      "Q₁ = median paruh bawah, Q₂ = median seluruh data, Q₃ = median paruh atas.",
    kesimpulan:
      "Kuartil ketiga (Q₃) = 8.",
  },
};
