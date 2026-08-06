import type { Pembahasan } from "@/components/PembahasanCard";

export const tkaLatihan2Pembahasan: Record<number, Pembahasan> = {
  /* ── KONTEKS 1–3: DATA AKTIVITAS GUNUNG API ── */
  1: {
    jawaban: "C. 66.197 kali",
    konsepTrik:
      "Jumlahkan seluruh data dalam tabel satu per satu secara berurutan agar tidak ada yang terlewat. Tips cepat: kelompokkan bilangan yang mudah dijumlahkan terlebih dahulu.",
    stepByStep:
      "Semeru   = 29.131\nIbu      = 21.100\nIli Lewotolok = 11.500\nDukono   =  3.324\nAnak Krakatau = 696\nMarapi   =    436\nDempo    =      5\nLewotobi =      5\n─────────────────\nTotal    = 29.131 + 21.100 = 50.231\n50.231 + 11.500 = 61.731\n61.731 +  3.324 = 65.055\n65.055 +    696 = 65.751\n65.751 +    436 = 66.187\n66.187 +      5 = 66.192\n66.192 +      5 = 66.197\nTotal erupsi = 66.197 kali",
    tips:
      "Susun penjumlahan dari bilangan terbesar ke terkecil untuk meminimalkan kesalahan hitung. Perhatikan jebakan di soal: pilihan B (65.197) dan D (67.197) hanya berbeda 1.000 dari jawaban benar.",
    kesimpulan:
      "Total seluruh erupsi 8 gunung api di Indonesia sepanjang tahun 2023 adalah 66.197 kali → Jawaban C.",
  },

  2: {
    jawaban: "BENAR: A, B, C, D  |  SALAH: E",
    konsepTrik:
      "Untuk soal kompleks, cek setiap pernyataan langsung dengan data tabel. Jangan tebak — verifikasi satu per satu.",
    stepByStep:
      "A. Semeru > 25.000? → 29.131 > 25.000 ✓ BENAR\nB. Ibu > 20.000? → 21.100 > 20.000 ✓ BENAR\nC. Dukono > 3.000? → 3.324 > 3.000 ✓ BENAR\nD. Dempo = Lewotobi? → keduanya = 5 ✓ BENAR\nE. Anak Krakatau > 700? → 696 > 700? ✗ SALAH\n   (696 kurang dari 700, bukan lebih dari 700!)",
    tips:
      "Pernyataan E adalah jebakan klasik: 696 sangat dekat dengan 700 tetapi TIDAK lebih dari 700. Bacalah kata kunci 'lebih dari' dengan teliti.",
    kesimpulan:
      "Pernyataan A, B, C, dan D semuanya benar. Hanya pernyataan E yang salah karena 696 < 700.",
  },

  3: {
    jawaban: "Pernyataan 1: SALAH  |  Pernyataan 2: BENAR  |  Pernyataan 3: BENAR",
    konsepTrik:
      "Pernyataan 1 membutuhkan perbandingan perkalian: '2 kali lipat'. Hitung dulu 2 × erupsi Ibu, lalu bandingkan dengan erupsi Semeru.",
    stepByStep:
      "Pernyataan 1: 'Semeru > 2 × Ibu'\n2 × Ibu = 2 × 21.100 = 42.200\nSemeru = 29.131\n29.131 < 42.200 → Semeru TIDAK lebih dari dua kali lipat Ibu → SALAH\n\nPernyataan 2: Ili Lewotolok + Dukono\n= 11.500 + 3.324 = 14.824 → sama persis ✓ BENAR\n\nPernyataan 3: Marapi < Anak Krakatau\nMarapi = 436, Anak Krakatau = 696\n436 < 696 → Marapi memang lebih sedikit ✓ BENAR",
    tips:
      "Pernyataan 1 adalah jebakan: Semeru memang paling banyak, tetapi bukan berarti ia > 2× Ibu. Selalu hitung dulu sebelum menyimpulkan.",
    kesimpulan:
      "Pernyataan 1 SALAH (29.131 < 42.200). Pernyataan 2 BENAR (11.500 + 3.324 = 14.824). Pernyataan 3 BENAR (436 < 696).",
  },

  /* ── KONTEKS 4–6: SAMPAH PLASTIK ── */
  4: {
    jawaban: "C. 9,6 juta ton",
    konsepTrik:
      "Persentase dari total = (persen / 100) × total. Di sini: 15% dari 64 juta ton.",
    stepByStep:
      "Diketahui:\n• Total sampah plastik = 64 juta ton per tahun\n• Tingkat daur ulang saat ini = 15%\n\nHitung:\nSampah didaur ulang = 15% × 64 juta ton\n= $\\frac{15}{100}$ × 64\n= 0,15 × 64\n= 9,6 juta ton",
    tips:
      "Cara cepat menghitung 15%: hitung 10% dulu (= 6,4), lalu tambah separuhnya (= 3,2). Hasilnya: 6,4 + 3,2 = 9,6.",
    kesimpulan:
      "Total sampah plastik yang berhasil didaur ulang saat ini adalah 9,6 juta ton → Jawaban C.",
  },

  5: {
    jawaban: "BENAR: B, C, E  |  SALAH: A, D",
    konsepTrik:
      "Cek setiap pernyataan dengan data tabel dan konteks soal. Perhatikan nilai persentase 'Lainnya' yang sudah dinyatakan di tabel.",
    stepByStep:
      "A. Kantong (22,4) > Botol + Kemasan (16,0 + 12,8 = 28,8)?\n   22,4 > 28,8? ✗ SALAH\n\nB. Tidak didaur ulang = (100% − 15%) × 64 = 85% × 64 = 54,4 juta ton ✓ BENAR\n\nC. Pengurangan 30% = 30% × 64 = 19,2 juta ton ✓ BENAR\n\nD. Jenis 'Lainnya' = 15%? → Tabel menunjukkan 20% ✗ SALAH\n\nE. Botol minuman = 16,0 juta ton > 15 juta ton ✓ BENAR",
    tips:
      "Untuk pernyataan A: jangan hanya bandingkan Kantong dengan Botol saja, soal meminta Botol + Kemasan Makanan digabung. Pernyataan D: 'Lainnya' tercantum jelas di tabel = 20%, bukan 15%.",
    kesimpulan:
      "Pernyataan B (54,4 juta ton tidak didaur ulang), C (target pengurangan 19,2 juta ton), dan E (Botol > 15 juta ton) semuanya BENAR.",
  },

  6: {
    jawaban: "Pernyataan 1: BENAR  |  Pernyataan 2: SALAH  |  Pernyataan 3: BENAR",
    konsepTrik:
      "Pernyataan 2 membutuhkan perhitungan: 30% × 64 ≠ 20. Hitung dulu sebelum memutuskan.",
    stepByStep:
      "Pernyataan 1: Didaur ulang < 10 juta ton?\n15% × 64 = 9,6 juta ton < 10 juta ton ✓ BENAR\n\nPernyataan 2: Daur ulang 30% → 20 juta ton?\n30% × 64 = 19,2 juta ton ≠ 20 juta ton ✗ SALAH\n\nPernyataan 3: Botol minuman (16,0) > Kemasan makanan (12,8)?\n16,0 > 12,8 ✓ BENAR",
    tips:
      "Pernyataan 2 adalah jebakan: 30% dari 64 = 19,2, BUKAN 20. Jangan asumsikan — hitung selalu!",
    kesimpulan:
      "Pernyataan 1 BENAR (9,6 < 10). Pernyataan 2 SALAH (19,2 ≠ 20). Pernyataan 3 BENAR (16 > 12,8).",
  },

  /* ── KONTEKS 7–9: BANTUAN SOSIAL ── */
  7: {
    jawaban: "B. Rp40.000",
    konsepTrik:
      "Bantuan per KK per bulan = Total dana ÷ (Jumlah KK × Lama program). Perlu membagi dua kali: dengan jumlah KK, lalu dengan jumlah bulan.",
    stepByStep:
      "Diketahui:\n• Total dana = Rp1.200.000.000\n• Jumlah KK = 5.000\n• Lama program = 6 bulan\n\nHitung total KK-bulan:\n5.000 × 6 = 30.000 KK-bulan\n\nBantuan per KK per bulan:\n= Rp1.200.000.000 ÷ 30.000\n= Rp40.000",
    tips:
      "Cara lain: hitung dulu bantuan per KK untuk seluruh program:\nRp1.200.000.000 ÷ 5.000 = Rp240.000\nLalu bagi per bulan: Rp240.000 ÷ 6 = Rp40.000. Hasilnya sama.",
    kesimpulan:
      "Setiap KK menerima bantuan sebesar Rp40.000 per bulan → Jawaban B.",
  },

  8: {
    jawaban: "BENAR: A, B, C, D, E (semua benar)",
    konsepTrik:
      "Verifikasi setiap pernyataan langsung dari tabel data. Soal ini melatih ketelitian membaca tabel.",
    stepByStep:
      "Data: A=600, B=700, C=500, D=800, E=650, Lainnya=1.750\n\nA. D (800) terbanyak di antara 5 kecamatan? → 800 > 700 > 650 > 600 > 500 ✓ BENAR\n\nB. C (500) paling sedikit? → 500 < 600 < 650 < 700 < 800 ✓ BENAR\n\nC. Lainnya = 1.750 KK? → Sesuai tabel ✓ BENAR\n\nD. Selisih A dan C = 600 − 500 = 100? ✓ BENAR\n\nE. B (700) > E (650)? → 700 > 650 ✓ BENAR",
    tips:
      "Pada soal kompleks 'semua benar', periksa tetap satu per satu. Jangan langsung menyimpulkan tanpa verifikasi masing-masing.",
    kesimpulan:
      "Semua lima pernyataan (A–E) adalah BENAR berdasarkan data tabel bantuan sosial.",
  },

  9: {
    jawaban: "Pernyataan 1: SALAH  |  Pernyataan 2: BENAR  |  Pernyataan 3: SALAH",
    konsepTrik:
      "Baca tabel dengan teliti: jangan tertukar antara kecamatan B dan D, serta hitung selisih dengan benar.",
    stepByStep:
      "Pernyataan 1: Kecamatan D = 700 KK?\nData tabel: D = 800 KK (bukan 700!) ✗ SALAH\n\nPernyataan 2: Total A–E = 3.250 KK?\nA+B+C+D+E = 600+700+500+800+650\n= 1.300 + 500 + 800 + 650\n= 1.800 + 800 + 650\n= 2.600 + 650 = 3.250 ✓ BENAR\n\nPernyataan 3: B lebih banyak 100 KK dari E?\nSelisih B − E = 700 − 650 = 50 KK (bukan 100!) ✗ SALAH",
    tips:
      "Pernyataan 1 menukar nilai D (800) dengan nilai B (700) — jebakan umum. Pernyataan 3: 700 − 650 = 50, bukan 100. Selalu hitung manual!",
    kesimpulan:
      "Pernyataan 1 SALAH (D=800, bukan 700). Pernyataan 2 BENAR (total 3.250). Pernyataan 3 SALAH (selisih 50, bukan 100).",
  },

  /* ── KONTEKS 10–12: KERIPIK SINGKONG ── */
  10: {
    jawaban: "C. 23 bungkus",
    konsepTrik:
      "Keuntungan = Pendapatan − Biaya. Buat pertidaksamaan dengan memasukkan fungsi biaya dan harga jual, lalu selesaikan untuk $x$.",
    stepByStep:
      "Diketahui:\n• Biaya produksi: $B(x) = 3.000x + 40.000$\n• Harga jual per bungkus: Rp7.000\n• Pendapatan: $P(x) = 7.000x$\n• Target keuntungan ≥ Rp50.000\n\nKeuntungan = Pendapatan − Biaya:\n$K(x) = 7.000x − (3.000x + 40.000)$\n$K(x) = 4.000x − 40.000$\n\nSyarat:\n$4.000x − 40.000 \\geq 50.000$\n$4.000x \\geq 90.000$\n$x \\geq 22{,}5$\n\nKarena bungkus harus bilangan bulat:\n$x_{\\min} = 23$ bungkus",
    tips:
      "Kunci: $x \\geq 22{,}5$ dibulatkan ke ATAS menjadi 23, bukan 22. Jika hanya 22 bungkus:\n$K(22) = 4.000(22) − 40.000 = 88.000 − 40.000 = 48.000 < 50.000$ (belum memenuhi target).\nJika 23 bungkus: $K(23) = 92.000 − 40.000 = 52.000 \\geq 50.000$ ✓",
    kesimpulan:
      "Jumlah bungkus minimal yang harus dijual untuk mencapai target keuntungan Rp50.000 adalah 23 bungkus → Jawaban C.",
  },
};
