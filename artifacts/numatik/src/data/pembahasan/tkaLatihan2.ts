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
  11: {
    jawaban: "Pernyataan 1: BENAR  |  Pernyataan 2: SALAH  |  Pernyataan 3: BENAR",
    konsepTrik:
      "Gunakan fungsi $B(x) = 3.000x + 40.000$ untuk biaya, pendapatan $= 7.000x$, dan keuntungan $= 7.000x - B(x)$. Hitung masing-masing untuk nilai $x$ yang diminta.",
    stepByStep:
      "Pernyataan 1: Biaya produksi 30 bungkus\n$B(30) = 3.000(30) + 40.000 = 90.000 + 40.000 = 130.000$ ✓ BENAR\n\nPernyataan 2: Pendapatan dari 25 bungkus\n$P(25) = 7.000 \\times 25 = 175.000$\nPernyataan menyebut Rp170.000 → salah! ✗ SALAH\n\nPernyataan 3: Keuntungan dari 30 bungkus\n$B(30) = 130.000$\n$P(30) = 7.000 \\times 30 = 210.000$\nKeuntungan $= 210.000 - 130.000 = 80.000$ ✓ BENAR",
    tips:
      "Pernyataan 2 adalah jebakan: 7.000 × 25 = 175.000, bukan 170.000. Jangan hitung di kepala untuk angka-angka seperti ini — tulis dan verifikasi.",
    kesimpulan:
      "Pernyataan 1 BENAR (B(30)=Rp130.000). Pernyataan 2 SALAH (pendapatan 25 bungkus = Rp175.000, bukan Rp170.000). Pernyataan 3 BENAR (keuntungan = Rp80.000).",
  },

  12: {
    jawaban: "BENAR: A, B, C (semua benar)",
    konsepTrik:
      "Substitusikan $x = 50$ ke rumus biaya, hitung pendapatan, lalu hitung keuntungan sebagai selisihnya.",
    stepByStep:
      "A. Biaya produksi 50 bungkus:\n$B(50) = 3.000(50) + 40.000 = 150.000 + 40.000 = 190.000$ ✓ BENAR\n\nB. Pendapatan dari 50 bungkus:\n$P(50) = 7.000 \\times 50 = 350.000$ ✓ BENAR\n\nC. Keuntungan dari 50 bungkus:\n$K = P - B = 350.000 - 190.000 = 160.000$ ✓ BENAR",
    tips:
      "Urutan yang benar: hitung biaya dulu → hitung pendapatan → baru keuntungan. Jangan langsung mengurangi tanpa menghitung B(50) terlebih dahulu.",
    kesimpulan:
      "Semua tiga pernyataan BENAR: biaya = Rp190.000, pendapatan = Rp350.000, keuntungan = Rp160.000 untuk pesanan 50 bungkus.",
  },

  13: {
    jawaban: "C. Rp120.000",
    konsepTrik:
      "Cek setiap paket: apakah memenuhi KEDUA kebutuhan (internet ≥ 14 GB DAN telepon ≥ 60 mnt)? Jika tidak memenuhi salah satunya, paket tersebut gugur — berapapun harganya.",
    stepByStep:
      "Kebutuhan Rina: ≥ 14 GB internet, ≥ 60 mnt telepon\n\n× IndosatOreo Keluarga (Rp100.000): 15 GB ✓, 50 mnt < 60 mnt ✗ → GUGUR (telepon kurang)\n\n× TelkomIndo Personal + add-on (Rp80.000+25.000 = Rp105.000): 15 GB ✓, 50 mnt < 60 mnt ✗ → GUGUR (telepon kurang)\n\n× IndosatOreo Personal (Rp60.000): 8 GB < 14 GB ✗ → GUGUR\n\n✓ TelkomIndo Keluarga (Rp120.000): 20 GB ✓, 100 mnt ≥ 60 mnt ✓ → MEMENUHI!\n\nSatu-satunya pilihan yang valid = Rp120.000",
    tips:
      "Jebakan utama: IndosatOreo Keluarga (Rp100.000) tampak lebih murah, tetapi hanya menyediakan 50 mnt telepon — tidak cukup untuk 60 mnt. Telepon menjadi faktor penentu di soal ini.",
    kesimpulan:
      "Satu-satunya paket yang memenuhi kedua kebutuhan Rina (≥14 GB dan ≥60 mnt) adalah TelkomIndo Keluarga seharga Rp120.000 → Jawaban C.",
  },

  14: {
    jawaban: "BENAR: hanya A  |  SALAH: B, C, D, E",
    konsepTrik:
      "Budi butuh ≥ 18 GB internet DAN ≥ 80 mnt telepon. Cek setiap pernyataan berdasarkan dua syarat ini sekaligus.",
    stepByStep:
      "Kebutuhan Budi: ≥ 18 GB, ≥ 80 mnt\n\nA. TelkomIndo Keluarga: 20 GB ≥ 18 ✓, 100 mnt ≥ 80 ✓ → BENAR\n\nB. IndosatOreo Keluarga: 15 GB < 18 ✗, 50 mnt < 80 ✗ → SALAH\n\nC. IndosatOreo Keluarga + add-on 5 GB:\n   Total biaya = Rp100.000 + Rp20.000 = Rp120.000 (biaya benar)\n   Total internet = 15 + 5 = 20 GB ≥ 18 ✓\n   Telepon = 50 mnt < 80 mnt ✗ → kebutuhan BELUM tercukupi → SALAH\n\nD. TelkomIndo Keluarga tidak perlu add-on karena 20 GB cukup untuk internet,\n   namun pernyataan ini SALAH karena alasannya tidak lengkap — 20 GB\n   memang sudah cukup, tetapi yang menjadi syarat utama justru telepon\n   (100 mnt ≥ 80 mnt), yang tidak disebutkan. → SALAH\n\nE. 'Paling hemat adalah TelkomIndo Keluarga + add-on 5 GB' → SALAH\n   TelkomIndo Keluarga saja (Rp120.000) sudah memenuhi semua syarat;\n   tidak perlu add-on yang akan menambah biaya menjadi Rp145.000.",
    tips:
      "Opsi C dan D adalah jebakan yang mengalihkan dari syarat TELEPON. Selalu periksa KEDUA syarat (internet DAN telepon) sebelum menyimpulkan suatu paket 'sudah cukup'.",
    kesimpulan:
      "Hanya pernyataan A yang BENAR: TelkomIndo Keluarga (Rp120.000) memenuhi kebutuhan Budi tanpa tambahan apa pun.",
  },

  15: {
    jawaban: "Pernyataan 1: SALAH  |  Pernyataan 2: BENAR  |  Pernyataan 3: SALAH",
    konsepTrik:
      "Hitung selisih harga secara langsung. Untuk pernyataan 3, tambahkan biaya add-on ke masing-masing paket lalu hitung selisihnya.",
    stepByStep:
      "Pernyataan 1: Selisih IndosatOreo Personal vs TelkomIndo Personal\n= Rp80.000 − Rp60.000 = Rp20.000 (bukan Rp15.000) ✗ SALAH\n\nPernyataan 2: Kebutuhan 8 GB internet, 20 mnt telepon\n IndosatOreo Personal: Rp60.000, 8 GB ✓, 30 mnt ≥ 20 mnt ✓ → memenuhi\n Apakah ada yang lebih murah? Tidak ada paket di bawah Rp60.000 ✓ BENAR\n\nPernyataan 3: Kebutuhan 12 GB, 40 mnt\n TelkomIndo Personal (10 GB, 50 mnt) + add-on 5 GB:\n   = Rp80.000 + Rp25.000 = Rp105.000 (15 GB ✓, 50 mnt ✓)\n IndosatOreo Personal (8 GB, 30 mnt) + add-on 5 GB:\n   = Rp60.000 + Rp20.000 = Rp80.000 (13 GB ✓, 30 mnt < 40 mnt ✗)\n IndosatOreo Personal + add-on tidak memenuhi syarat telepon!\n Selisih yang valid: Rp105.000 − Rp80.000 = Rp25.000 ≠ Rp10.000 ✗ SALAH",
    tips:
      "Pernyataan 3 punya dua kesalahan: (1) selisih bukan Rp10.000 melainkan Rp25.000, dan (2) IndosatOreo Personal + add-on tetap tidak memenuhi 40 mnt telepon.",
    kesimpulan:
      "Pernyataan 1 SALAH (selisih Rp20.000). Pernyataan 2 BENAR (IndosatOreo Personal paling hemat untuk 8GB/20mnt). Pernyataan 3 SALAH (selisih Rp25.000 dan IndosatOreo Personal tidak memenuhi kebutuhan telepon).",
  },

  16: {
    jawaban: "C. 21.560 cm³",
    konsepTrik:
      "Volume tabung: $V = \\pi r^2 t$. Ingat bahwa yang diberikan adalah diameter ($d$), bukan jari-jari ($r$). Gunakan $r = d \\div 2$ terlebih dahulu, dan manfaatkan $\\pi = \\frac{22}{7}$ agar perhitungan tetap bilangan bulat.",
    stepByStep:
      "Diketahui: $d = 28$ cm → $r = 14$ cm, $t = 35$ cm, $\\pi = \\frac{22}{7}$\n\n$V = \\pi r^2 t$\n$= \\frac{22}{7} \\times 14^2 \\times 35$\n$= \\frac{22}{7} \\times 196 \\times 35$\n\nSederhanakan: $\\frac{196}{7} = 28$\n$= 22 \\times 28 \\times 35$\n$= 22 \\times 980$\n$= 21.560$ cm³",
    tips:
      "Trik cepat: saat $r$ habis dibagi 7 (misalnya $r=14$, maka $r^2=196$ dan $196 \\div 7 = 28$), sederhanakan dulu sebelum mengalikan. Ini menghindari perkalian bilangan besar.",
    kesimpulan:
      "Volume ember Regu Merah adalah $21.560$ cm³ → Jawaban C.",
  },

  17: {
    jawaban: "D. 108 kali",
    konsepTrik:
      "Ubah volume ember ke satuan mL (1 cm³ = 1 mL), lalu bagi dengan kapasitas gelas ukur. Karena hasilnya tidak bulat, bulatkan ke ATAS — gelas tidak bisa diisi sebagian untuk menyelesaikan tugasnya.",
    stepByStep:
      "Volume ember Regu Merah = 21.560 cm³ = 21.560 mL\nKapasitas gelas ukur = 200 mL\n\nJumlah tuang = $\\frac{21.560}{200} = 107{,}8$\n\nKarena tidak bisa tuang 0,8 gelas, maka tuang ke-108 diperlukan:\nMinimal = 108 kali\n\nVerifikasi:\n107 kali × 200 mL = 21.400 mL < 21.560 mL → belum penuh\n108 kali × 200 mL = 21.600 mL ≥ 21.560 mL → penuh ✓",
    tips:
      "Soal meminta 'minimal berapa kali' → selalu bulatkan KE ATAS saat hasil bagi tidak bulat. Jika dibulatkan ke bawah (107), ember tidak akan penuh.",
    kesimpulan:
      "Gelas ukur 200 mL harus dituangkan minimal 108 kali agar ember Regu Merah terisi penuh → Jawaban D.",
  },

  18: {
    jawaban: "C. 16.940 cm³",
    konsepTrik:
      "Hitung volume ember Regu Putih dengan rumus yang sama, lalu kurangi volume Regu Merah (yang sudah dihitung di soal 16). Perhatikan $r = d \\div 2 = 35 \\div 2 = 17{,}5$ cm.",
    stepByStep:
      "Regu Putih: $d = 35$ cm → $r = 17{,}5$ cm, $t = 40$ cm, $\\pi = \\frac{22}{7}$\n\n$V_{\\text{Putih}} = \\frac{22}{7} \\times (17{,}5)^2 \\times 40$\n$= \\frac{22}{7} \\times 306{,}25 \\times 40$\n\nSederhanakan: $306{,}25 \\div 7 = 43{,}75$\n$= 22 \\times 43{,}75 \\times 40$\n$= 22 \\times 1.750$\n$= 38.500$ cm³\n\nSelisih:\n$V_{\\text{Putih}} - V_{\\text{Merah}} = 38.500 - 21.560 = 16.940$ cm³",
    tips:
      "Jika $r$ tidak habis dibagi 7, tetap sederhanakan $\\frac{\\pi \\times r^2}{7}$ terlebih dahulu untuk mengurangi risiko kesalahan. Contoh: $\\frac{306{,}25}{7} = 43{,}75$ → kalikan dengan 22 dan tinggi.",
    kesimpulan:
      "Selisih volume ember Regu Putih dan Regu Merah adalah $16.940$ cm³ → Jawaban C.",
  },

  19: {
    jawaban: "C. 12 m",
    konsepTrik:
      "Tangga, dinding, dan lantai membentuk segitiga siku-siku. Panjang tangga = sisi miring (hipotenusa), jarak dari dinding = alas, tinggi dinding = sisi tegak. Gunakan Teorema Pythagoras: $a^2 + b^2 = c^2$.",
    stepByStep:
      "Diketahui:\n• Panjang tangga (hipotenusa) $= 13$ m\n• Jarak dari kaki dinding (alas) $= 5$ m\n• Tinggi dinding $= ?$\n\nTeorama Pythagoras:\n$\\text{tinggi}^2 + 5^2 = 13^2$\n$\\text{tinggi}^2 = 169 - 25 = 144$\n$\\text{tinggi} = \\sqrt{144} = 12$ m\n\n(Tripel Pythagoras yang terkenal: 5 – 12 – 13 ✓)",
    tips:
      "Hafalkan tripel Pythagoras umum: 3-4-5, 5-12-13, 8-15-17, 7-24-25. Jika Anda mengenali 5 dan 13, langsung tahu jawabannya adalah 12 tanpa perlu menghitung akar.",
    kesimpulan:
      "Tinggi dinding yang dapat dijangkau tangga dekorasi adalah 12 m → Jawaban C.",
  },

  20: {
    jawaban: "C. (−5, 1)",
    konsepTrik:
      "Aturan pencerminan terhadap sumbu-y: tanda koordinat $x$ berubah menjadi lawannya, sedangkan koordinat $y$ tetap. $(x, y) \\xrightarrow{\\text{sumbu-}y} (-x, y)$",
    stepByStep:
      "Titik asal: $R(5, 1)$\n\nCermin terhadap sumbu-$y$:\n$(x, y) \\to (-x, y)$\n$(5, 1) \\to (-5, 1)$\n\nBayangan: $R'(-5, 1)$\n\nVerifikasi: $R$ dan $R'$ berjarak sama dari sumbu-y → $|5| = |-5| = 5$ ✓",
    tips:
      "Ingat 4 aturan cermin dasar:\n• Sumbu-x: $(x, y) \\to (x, -y)$ — y berubah tanda\n• Sumbu-y: $(x, y) \\to (-x, y)$ — x berubah tanda\n• $y = x$: $(x, y) \\to (y, x)$ — tukar posisi\n• $y = -x$: $(x, y) \\to (-y, -x)$ — tukar dan negasikan",
    kesimpulan:
      "Bayangan $R(5, 1)$ setelah dicerminkan terhadap sumbu-y adalah $R'(-5, 1)$ → Jawaban C.",
  },

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
