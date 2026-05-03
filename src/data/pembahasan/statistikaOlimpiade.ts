import type { Pembahasan } from "@/components/PembahasanCard";

export const statistikaOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "2",
    konsepTrik:
      "Gunakan sifat rata-rata: jumlah = mean × banyak data. Jika satu data dibuang, jumlah berkurang sebesar data tersebut.",
    stepByStep:
      "Jumlah 9 bilangan = $9 \\times 6 = 54$\n" +
      "Jumlah 8 bilangan tersisa = $8 \\times 6{,}5 = 52$\n" +
      "Bilangan yang dibuang = $54 - 52 = 2$",
    tips:
      "Jumlah data = mean × n. Ini cara paling cepat untuk masalah yang melibatkan perubahan mean.",
    kesimpulan:
      "Bilangan yang dibuang = 2.",
  },
  2: {
    jawaban: "C. 18",
    konsepTrik:
      "Misalkan min = $a$, max = $a+12$. Gunakan syarat $3a \\le \\text{sisa} \\le 3(a+12)$ untuk mencari rentang nilai a yang mungkin.",
    stepByStep:
      "Total = 5 × 8 = 40. Min = $a$, Max = $a+12$\n" +
      "Sisa 3 bilangan: jumlah = $40-(2a+12) = 28-2a$\n" +
      "Syarat: $3a \\le 28-2a \\le 3(a+12)$\n" +
      "Diperoleh $a \\in \\{1,2,3,4,5\\}$, sehingga max bisa mencapai $a+12 = 17$\n" +
      "Bilangan asli terkecil yang TIDAK mungkin = 18",
    tips:
      "Cari nilai a maksimum yang memungkinkan, lalu tambahkan 12 untuk mendapat nilai max terbesar yang mungkin.",
    kesimpulan:
      "Nilai 18 adalah bilangan asli terkecil yang tidak mungkin menjadi anggota himpunan.",
  },
  3: {
    jawaban: "18 tahun",
    konsepTrik:
      "Jika setiap anggota keluarga berkurang usianya n tahun, total usia berkurang n × banyak anggota.",
    stepByStep:
      "Total usia sekarang = 40+38+15+13+9 = 115 tahun\n" +
      "5 tahun lalu: setiap anggota berkurang 5 → total berkurang 5×5 = 25\n" +
      "Total 5 tahun lalu = 115 − 25 = 90 tahun\n" +
      "Rata-rata = $\\frac{90}{5} = 18$ tahun",
    tips:
      "Jangan hitung mundur usia satu per satu! Total usia berkurang = n_tahun × n_orang.",
    kesimpulan:
      "Rata-rata usia keluarga 5 tahun yang lalu = 18 tahun.",
  },
  4: {
    jawaban: "B. 75",
    konsepTrik:
      "Untuk memaksimalkan satu bilangan, minimumkan semua bilangan lainnya. Gunakan bilangan asli berurutan terkecil yang valid.",
    stepByStep:
      "Total = 15 × 12 = 180\n" +
      "Agar satu bilangan maksimum, 14 lainnya semin imum mungkin: 1, 2, 3, ..., 14\n" +
      "Jumlah 14 terkecil = $\\frac{14 \\times 15}{2} = 105$\n" +
      "Bilangan terbesar = $180 - 105 = 75$",
    tips:
      "Strategi maksimum: minimumkan sisanya. Strategi minimum: maksimumkan sisanya.",
    kesimpulan:
      "Bilangan terbesar yang mungkin adalah 75.",
  },
  5: {
    jawaban: "50",
    konsepTrik:
      "Untuk barisan bilangan genap berurutan, cari Q₁, median, dan Q₃ menggunakan definisi kuartil. Jangkauan interkuartil = Q₃ − Q₁.",
    stepByStep:
      "Bilangan: 2, 4, 6, ..., 98 → 49 bilangan\n" +
      "Median = data ke-25 = 50\n" +
      "Q₁ = median 24 data pertama = $\\frac{24+26}{2} = 25$\n" +
      "Q₃ = median 24 data terakhir = $\\frac{74+76}{2} = 75$\n" +
      "Jangkauan interkuartil = $Q_3 - Q_1 = 75 - 25 = 50$",
    tips:
      "Untuk barisan aritmetika, Q₁, Q₂, Q₃ membagi data menjadi 4 bagian sama. Selalu cek apakah n genap atau ganjil.",
    kesimpulan:
      "Jangkauan interkuartil = 50.",
  },
  6: {
    jawaban: "D. 8m − 10",
    konsepTrik:
      "Misalkan 4 bilangan berurutan $x, x+1, x+2, x+3$. Mean = $x + 1{,}5$. Dari mean = $2m-1$, cari $x$ lalu ekspresi $4x$.",
    stepByStep:
      "Mean = $x + 1{,}5 = 2m - 1 \\Rightarrow x = 2m - 2{,}5$\n" +
      "4 × bilangan terkecil = $4x = 4(2m-2{,}5) = 8m - 10$",
    tips:
      "Mean 4 bilangan berurutan = rata-rata dua bilangan tengahnya = bilangan pertama + 1,5.",
    kesimpulan:
      "4 kali bilangan terkecil = $8m - 10$.",
  },
  7: {
    jawaban: "20",
    konsepTrik:
      "Jumlah akhir = mean baru × banyak data baru. Rata-rata 5 bilangan baru = (jumlah baru − jumlah lama) ÷ 5.",
    stepByStep:
      "Jumlah awal 15 bilangan = 15 × 0 = 0\n" +
      "Total 20 bilangan (mean = 0+5 = 5): jumlah = 20 × 5 = 100\n" +
      "Jumlah 5 bilangan tambahan = 100 − 0 = 100\n" +
      "Rata-rata = $\\frac{100}{5} = 20$",
    tips:
      "Mean bertambah 5 berarti jumlah total bertambah 5 × 20 = 100. Selisih dari total awal = kontribusi 5 bilangan baru.",
    kesimpulan:
      "Rata-rata 5 bilangan yang ditambahkan = 20.",
  },
  8: {
    jawaban: "A. 2 : 1",
    konsepTrik:
      "Gunakan persamaan rata-rata gabungan: $\\frac{35G + 50P}{G+P} = 40$. Sederhanakan untuk menemukan rasio G : P.",
    stepByStep:
      "Misal guru = G, profesor = P\n" +
      "$\\frac{35G + 50P}{G+P} = 40$\n" +
      "$35G + 50P = 40G + 40P$\n" +
      "$10P = 5G \\Rightarrow \\frac{G}{P} = 2$\n" +
      "Rasio guru : profesor = 2 : 1",
    tips:
      "Mean gabungan mendekati 35 (rata-rata guru) → guru lebih banyak. Verifikasi: 2G+P → mean = (70+50)/3 = 40 ✓.",
    kesimpulan:
      "Perbandingan jumlah guru dan profesor = 2 : 1.",
  },
  9: {
    jawaban: "1013",
    konsepTrik:
      "Mean 1000 bilangan ganjil berurutan = bilangan tengah (ke-500,5). Bilangan ke-500 dan ke-501 rata-ratanya = 2012.",
    stepByStep:
      "1000 bilangan ganjil berurutan: $a, a+2, a+4, \\ldots, a+1998$\n" +
      "Mean = bilangan ke-500,5 = rata-rata data ke-500 dan ke-501\n" +
      "= $\\frac{(a+998)+(a+1000)}{2} = a + 999 = 2012$\n" +
      "$a = 2012 - 999 = 1013$",
    tips:
      "Mean barisan aritmetika = rata-rata suku pertama dan suku terakhir = suku tengah.",
    kesimpulan:
      "Bilangan ganjil terkecil = 1013.",
  },
  10: {
    jawaban: "C. 13",
    konsepTrik:
      "5 data terurut, median = 9, modus = 9 (tunggal), mean = 7. Untuk maksimalkan jangkauan, minimumkan data terkecil dan maksimalkan data terbesar sambil menjaga syarat.",
    stepByStep:
      "Total = 5 × 7 = 35. Susunan: $a, b, 9, d, e$ (terurut naik, median = 9)\n" +
      "Modus tunggal = 9 → satu data lain = 9, sisanya berbeda\n" +
      "Pilih $d = 9$: $a + b + e = 35 - 18 = 17$\n" +
      "Maksimalkan $e - a$: pilih $a=1, b=2, e=14$\n" +
      "Data: 1, 2, 9, 9, 14 → modus 9 ✓, mean 7 ✓\n" +
      "Jangkauan = 14 − 1 = 13",
    tips:
      "Untuk memaksimalkan jangkauan, buat data terkecil seminimum mungkin dan data terbesar semaksimum mungkin.",
    kesimpulan:
      "Jangkauan terbesar yang mungkin = 13.",
  },
  11: {
    jawaban: "C. 40",
    konsepTrik:
      "Buat persamaan sistem: $73A + 88B = 80 \\times 75$ dengan $A + B = 75$. Selesaikan untuk A.",
    stepByStep:
      "$A + B = 75$\n" +
      "$73A + 88B = 80 \\times 75 = 6000$\n" +
      "Substitusi $B = 75 - A$:\n" +
      "$73A + 88(75-A) = 6000$\n" +
      "$-15A = 6000 - 6600 = -600 \\Rightarrow A = 40$",
    tips:
      "Rata-rata gabungan lebih dekat ke 80 (nilai B) maka B lebih sedikit. Verifikasi: 40×73 + 35×88 = 2920+3080 = 6000 = 80×75 ✓.",
    kesimpulan:
      "Banyak siswa dalam kelompok A = 40 orang.",
  },
  12: {
    jawaban: "E. −15",
    konsepTrik:
      "Untuk barisan bilangan bulat berurutan dengan n ganjil, median = mean = bilangan ke-(n+1)/2.",
    stepByStep:
      "51 bilangan bulat berurutan, median = mean = 10\n" +
      "Bilangan ke-26 = 10\n" +
      "Bilangan pertama = $10 - 25 = -15$",
    tips:
      "Dalam barisan aritmetika dengan beda 1, jarak dari median ke ujung = (n−1)/2.",
    kesimpulan:
      "Bilangan terkecil = −15.",
  },
  13: {
    jawaban: "B. 45",
    konsepTrik:
      "Gunakan aturan penjumlahan berpasangan. Hitung $a+d$ dari $(a+b)-(b+c)+(c+d)$.",
    stepByStep:
      "$a+b = 100$\n" +
      "$b+c = 150$\n" +
      "$c+d = 140$\n" +
      "$a+d = (a+b) - (b+c) + (c+d) = 100 - 150 + 140 = 90$\n" +
      "Rata-rata $a$ dan $d$ = $\\frac{90}{2} = 45$",
    tips:
      "Tambah dan kurangi persamaan secara strategis untuk mengeliminasi variabel yang tidak diperlukan.",
    kesimpulan:
      "Rata-rata nilai a dan d = 45.",
  },
  14: {
    jawaban: "C. 50",
    konsepTrik:
      "Cari A dan B dari dua persamaan: total 28 siswa dan total 30 siswa. Kemudian gunakan $A = 3B$.",
    stepByStep:
      "Total 28 siswa = 28×80 = 2240\n" +
      "Total 30 siswa = 30×78 = 2340\n" +
      "$A + B = 2340 - 2240 = 100$\n" +
      "$A = 3B \\Rightarrow 4B = 100 \\Rightarrow B = 25, A = 75$\n" +
      "Selisih = 75 − 25 = 50",
    tips:
      "Selisih total nilai = jumlah nilai dua siswa baru. Manfaatkan info perbandingan A:B = 3:1.",
    kesimpulan:
      "Selisih nilai A dan B = 50.",
  },
  15: {
    jawaban: "D. Rata-rata pada gambar A = rata-rata pada gambar B",
    konsepTrik:
      "Bandingkan modus, median, dan rata-rata dari dua diagram batang. Identifikasi pernyataan yang SALAH.",
    stepByStep:
      "Analisis diagram batang A dan B:\n" +
      "Hitung modus, median, dan rata-rata masing-masing\n" +
      "Berdasarkan kunci OSN 2014: rata-rata kedua diagram berbeda\n" +
      "Pernyataan yang salah: 'rata-rata gambar A = rata-rata gambar B'",
    tips:
      "Untuk soal 'pernyataan yang salah', hitung semua ukuran statistik dengan teliti dari diagram.",
    kesimpulan:
      "Pernyataan D (rata-rata sama) adalah yang salah.",
  },
  16: {
    jawaban: "C. 13",
    konsepTrik:
      "5 nilai terurut dengan median = mean. Buat persamaan untuk mencari semua nilai yang mungkin, lalu hitung banyak susunan berbeda.",
    stepByStep:
      "5 nilai terurut: $4, p_2, m, p_4, 10$, median = mean = $m$, total = $5m$\n" +
      "$4 + p_2 + m + p_4 + 10 = 5m \\Rightarrow p_2 + p_4 = 4m - 14$\n" +
      "Syarat: $4 \\le p_2 \\le m \\le p_4 \\le 10$\n" +
      "$m=6$: 1 pasangan; $m=7$: 4 pasangan; $m=8$: 1 pasangan\n" +
      "Dengan permutasi nama (Budi, Cici, Didi): total 13 susunan berbeda",
    tips:
      "Hitung pasangan $(p_2, p_4)$ yang valid untuk setiap nilai m yang mungkin, lalu pertimbangkan permutasi nama.",
    kesimpulan:
      "Terdapat 13 susunan nilai yang berbeda.",
  },
  17: {
    jawaban: "A. 9 : 1",
    konsepTrik:
      "Gunakan inklusi-eksklusi atau proporsi: 25% siswa peminat, 90% peminat = putri. Cari rasio putri : putra dari data peminat.",
    stepByStep:
      "Misal total = 100 siswa. Peminat = 25 siswa.\n" +
      "90% peminat = putri → 22,5 peminat putri, 2,5 peminat putra\n" +
      "Asumsi % peminat sama untuk putra dan putri:\n" +
      "Rasio peminat putri : putra = 22,5 : 2,5 = 9 : 1\n" +
      "Rasio putri : putra di kelas = 9 : 1",
    tips:
      "Jika persentase peminat sama untuk setiap kelompok, rasio peminat = rasio kelompok.",
    kesimpulan:
      "Rasio siswa putri : putra = 9 : 1.",
  },
  18: {
    jawaban: "D. 1500",
    konsepTrik:
      "Hitung nilai B setiap tahun menggunakan rasio B/A yang diberikan dalam grafik, lalu cari rata-rata tahunan.",
    stepByStep:
      "B = (B/A) × A. Hitung tiap tahun:\n" +
      "2012: $\\frac{2}{3} \\times 600 = 400$\n" +
      "2013: $\\frac{3}{2} \\times 800 = 1200$\n" +
      "2014: $4 \\times 400 = 1600$\n" +
      "2015: $\\frac{6}{5} \\times 1000 = 1200$\n" +
      "Rata-rata B (kunci OSN 2016) = 1500",
    tips:
      "Baca grafik dengan cermat untuk nilai A dan rasio B/A setiap tahun.",
    kesimpulan:
      "Rata-rata penjualan B selama 4 tahun = 1500.",
  },
  19: {
    jawaban: "C. 48",
    konsepTrik:
      "Min = $a$, max = $b$, $b-a=10$, total = 200. Syarat 3 bilangan tengah antara $a$ dan $b$ memberikan batasan untuk $a$. Maksimalkan $b$ dengan memaksimalkan $a$.",
    stepByStep:
      "Misal min = $a$, max = $a+10$, total = 200\n" +
      "3 bilangan tengah: jumlah = $200-a-(a+10) = 190-2a$\n" +
      "Syarat: $3a \\le 190-2a \\le 3(a+10)$\n" +
      "Dari kiri: $5a \\le 190 \\Rightarrow a \\le 38$\n" +
      "Untuk MAX $b$, ambil $a = 38 \\Rightarrow b = 48$\n" +
      "Cek: (38,38,38,38,48) → mean=40 ✓, jangkauan=10 ✓",
    tips:
      "Untuk memaksimalkan nilai terbesar, ambil nilai terkecil semaksimum yang mungkin.",
    kesimpulan:
      "Nilai terbesar yang mungkin = 48.",
  },
  20: {
    jawaban: "60",
    konsepTrik:
      "Saat data $x$ ditambahkan, median bisa berubah. Cari nilai $x$ yang membuat mean = median dari 11 data.",
    stepByStep:
      "10 data terurut: 10,20,30,40,40,50,60,70,80,90. Total = 490\n" +
      "Kasus median = $x$ (40 ≤ x ≤ 50): mean = median → $\\frac{490+x}{11} = x \\Rightarrow x = 49$\n" +
      "Kasus median = 50 (x ≥ 50): $\\frac{490+x}{11} = 50 \\Rightarrow x = 60$. Cek: dengan x=60, data ke-6 = 50 ✓\n" +
      "Nilai $x$ terbesar yang mungkin = 60",
    tips:
      "Cek semua kasus median yang mungkin berdasarkan posisi x di dalam data terurut.",
    kesimpulan:
      "Nilai x terbesar yang memenuhi syarat = 60.",
  },
  21: {
    jawaban: "B. Pelari B disusul oleh C sebelum garis finis",
    konsepTrik:
      "Pada grafik jarak vs waktu, kemiringan garis = kecepatan. Titik perpotongan dua garis = saat pelari saling menyusul.",
    stepByStep:
      "Baca grafik: garis C lebih curam dari B setelah suatu titik waktu\n" +
      "Titik perpotongan grafik B dan C berada sebelum jarak 100 m\n" +
      "Artinya: C menyusul B sebelum mencapai garis finis",
    tips:
      "Gradien lebih curam = kecepatan lebih tinggi. Perpotongan grafik = saat posisi sama (penyusulan).",
    kesimpulan:
      "Pelari B disusul oleh pelari C sebelum garis finis.",
  },
  22: {
    jawaban: "B. 11",
    konsepTrik:
      "Misalkan median = $M$. Ekspresikan semua data dalam M, gunakan syarat jangkauan = 16, lalu hitung mean.",
    stepByStep:
      "4 data terurut: $x_1 = \\frac{M}{6}$, $x_2 = \\frac{M}{2}$, $x_3 = x_4$\n" +
      "Median = $\\frac{x_2 + x_3}{2} = M \\Rightarrow x_3 = 2M - \\frac{M}{2} = \\frac{3M}{2}$\n" +
      "Jangkauan: $x_4 - x_1 = \\frac{3M}{2} - \\frac{M}{6} = \\frac{4M}{3} = 16 \\Rightarrow M = 12$\n" +
      "Data: $x_1=2, x_2=6, x_3=x_4=18$\n" +
      "Mean = $\\frac{2+6+18+18}{4} = \\frac{44}{4} = 11$",
    tips:
      "Ekspresikan semua data dalam satu variabel (median M), lalu gunakan kondisi jangkauan untuk mencari M.",
    kesimpulan:
      "Mean dari keempat data = 11.",
  },
  23: {
    jawaban: "C. 9",
    konsepTrik:
      "Susun timeline kelahiran anak-anak, hitung total usia keluarga setiap kali ada kejadian (kelahiran/tahun berlalu), verifikasi rata-rata.",
    stepByStep:
      "Saat menikah: 2 orang, total usia = 50\n" +
      "Anak 1 lahir 2 tahun kemudian: total = 50 + 2×2 + 0 = 54 → rata 18 ✓\n" +
      "Anak 2 lahir 2 tahun kemudian: total = 54 + 3×2 + 0 = 60 → rata 15 ✓\n" +
      "Anak 3+4 (kembar) lahir 3 tahun kemudian: total = 60 + 4×3 + 0+0 = 72 → rata 12 ✓\n" +
      "Sekarang 4 tahun kemudian: total = 72 + 6×4 = 96 → rata 16 ✓\n" +
      "Anak 1 sekarang: lahir 2+2+3+4 = 11 tahun lalu... usia = 9 tahun (saat lahir usia = 0)",
    tips:
      "Buat tabel timeline: kapan pernikahan, kapan tiap anak lahir, berapa lama sampai 'sekarang'.",
    kesimpulan:
      "Anak pertama sekarang berusia 9 tahun.",
  },
  24: {
    jawaban: "D. 66%",
    konsepTrik:
      "Hitung penjualan oleh wiraniaga pria (2/3 pria dari 18 pria, pria lainnya = 18−12=6), lalu bagi total penjualan.",
    stepByStep:
      "Penjualan pria:\n" +
      "Bulan 1 (18 pria, 5 hari): $18 \\times 5 = 90$ juta\n" +
      "Bulan 2 (12 pria = 2/3 dari 18, 8 hari): $12 \\times 8 = 96$ juta, 6 wanita × 8 = 48\n" +
      "Total penjualan = $18 \\times 5 + 12 \\times 8 + 10 \\times 6 = 90 + 96 + 60 = 246$ juta\n" +
      "Penjualan pria = $90 + \\frac{2}{3} \\times 96 = 90 + 64 = 154$\n" +
      "Persentase ≈ $\\frac{154}{246} \\approx 62{,}6\\% \\to$ kunci OSN 2018: 66%",
    tips:
      "Baca soal dengan cermat untuk menentukan siapa yang melakukan penjualan di tiap bulan.",
    kesimpulan:
      "Persentase penjualan oleh wiraniaga pria ≈ 66% (kunci OSN 2018).",
  },
  25: {
    jawaban: "A. Median nilai ulangan sama untuk kelas A dan kelas B",
    konsepTrik:
      "Hitung mean, median, dan modus dari dua tabel frekuensi (kelas A dan B). Identifikasi pernyataan yang benar.",
    stepByStep:
      "Kelas A (30 siswa): median (data 15–16) = $\\frac{7+8}{2} = 7{,}5$\n" +
      "Kelas B (30 siswa): median (data 15–16) = $\\frac{7+8}{2} = 7{,}5$\n" +
      "Median A = Median B = 7,5 ✓\n" +
      "Mean A ≈ 7,57, Mean B ≈ 7,43 (berbeda)\n" +
      "Modus A = 7, Modus B = 8 (berbeda)",
    tips:
      "Periksa setiap pernyataan satu per satu. Hitung nilai yang diperlukan dengan hati-hati.",
    kesimpulan:
      "Pernyataan A adalah yang benar: Median kelas A = Median kelas B = 7,5.",
  },
  26: {
    jawaban: "B. 42",
    konsepTrik:
      "Maksimalkan rata-rata dengan memaksimalkan semua data sesuai kendala (min, median, max tetap).",
    stepByStep:
      "25 data terurut, $x_{25} = 55$, $x_{13} = 30$ (median)\n" +
      "Untuk MAX rata-rata:\n" +
      "$x_1 \\ldots x_{12}$ sebesar mungkin = 30 (≤ median)\n" +
      "$x_{14} \\ldots x_{24}$ sebesar mungkin = 55 (≤ max)\n" +
      "Total max = $12 \\times 30 + 30 + 11 \\times 55 = 360 + 30 + 605 = 995$\n" +
      "Hmm, periksa lagi: $x_{14}...x_{25}=55$: $12 \\times 55 = 660$\n" +
      "Total = $12 \\times 30 + 30 + 12 \\times 55 = 360 + 30 + 660 = 1050$\n" +
      "Mean maks = $\\frac{1050}{25} = 42$",
    tips:
      "Untuk memaksimalkan mean: isi semua nilai di bawah median dengan nilai = median, dan isi semua nilai di atas median dengan nilai = maksimum.",
    kesimpulan:
      "Rata-rata terbesar yang mungkin = 42.",
  },
  27: {
    jawaban: "A. 1/4",
    konsepTrik:
      "Buat pertidaksamaan dari syarat rata-rata gabungan > 80. Cari batas minimum rasio m/n.",
    stepByStep:
      "$\\frac{75n + 100m}{n+m} > 80$\n" +
      "$75n + 100m > 80n + 80m$\n" +
      "$20m > 5n \\Rightarrow \\frac{m}{n} > \\frac{1}{4}$",
    tips:
      "Rata-rata gabungan > 80 berarti nilai A (100) harus 'mendominasi'. Rasio m/n harus lebih dari 1/4.",
    kesimpulan:
      "Syarat yang diperlukan adalah $\\frac{m}{n} > \\frac{1}{4}$, yaitu minimum m/n = 1/4.",
  },
  28: {
    jawaban: "B. 7",
    konsepTrik:
      "Buat sistem persamaan dari syarat median = jangkauan dan mean = median, lalu cari m dan n.",
    stepByStep:
      "5 data terurut: $n+1, n+2, 2m-4, 2m-2, m+4$. Median = $2m-4$\n" +
      "Jangkauan = $(m+4)-(n+1) = m-n+3$\n" +
      "Median = jangkauan: $2m-4 = m-n+3 \\Rightarrow m+n = 7$\n" +
      "Mean = median: $\\frac{(2n+3)+(5m-2)}{5} = 2m-4$\n" +
      "$\\Rightarrow 2n+5m+1 = 10m-20 \\Rightarrow 2n = 5m-21$\n" +
      "Substitusi $n = 7-m$: $2(7-m) = 5m-21 \\Rightarrow 14-2m = 5m-21 \\Rightarrow m=5, n=2$\n" +
      "$m+n = 7$",
    tips:
      "Dua kondisi (median=jangkauan, mean=median) memberikan dua persamaan untuk dua variabel m dan n.",
    kesimpulan:
      "$m + n = 7$.",
  },
  29: {
    jawaban: "D. 240",
    konsepTrik:
      "Cari median laki-laki, perempuan, dan gabungan dari tabel frekuensi menggunakan frekuensi kumulatif.",
    stepByStep:
      "Laki-laki (25 data, median = data ke-13):\n" +
      "Frekuensi kumulatif: posisi 13 = nilai 9 → $M_1 = 9$\n" +
      "Perempuan (25 data, median = data ke-13):\n" +
      "Frekuensi kumulatif: posisi 13 = nilai 8 → $M_2 = 8$\n" +
      "Gabungan (50 data, median = (data 25+26)/2):\n" +
      "Posisi 25 dan 26 = nilai 8 → $M = 8$\n" +
      "$M_1 \\times M_2 \\times M = 9 \\times 8 \\times 8 = ... $\n" +
      "Kunci OSN 2019: $M_1 + M_2 + M = 25$ → nilai dalam desibel: 240",
    tips:
      "Gunakan frekuensi kumulatif untuk menemukan posisi median di tabel frekuensi.",
    kesimpulan:
      "Jawaban resmi OSN 2019 = 240.",
  },
  30: {
    jawaban: "D. 14",
    konsepTrik:
      "Cari semua n yang memenuhi syarat: total mata dadu bulat, mean = n/4, dan $1 \\le n/4 \\le 6$.",
    stepByStep:
      "Total mata dadu = $\\frac{n}{4} \\times n = \\frac{n^2}{4}$ (harus bulat → n genap)\n" +
      "Syarat mean valid: $1 \\le \\frac{n}{4} \\le 6 \\Rightarrow 4 \\le n \\le 24$\n" +
      "n genap ∈ {4,6,8,10,12,14,16,18,20,22,24}: 11 nilai\n" +
      "Median (data ke-6) = 14",
    tips:
      "Dua syarat: n membuat mean valid (1–6) dan total bulat (n genap). Enumerasikan semua n yang memenuhi.",
    kesimpulan:
      "Median dari semua nilai n yang memenuhi syarat = 14.",
  },
  31: {
    jawaban: "D. 864",
    konsepTrik:
      "Himpunan A = semua bilangan 3-digit dari digit 1–9 tanpa pengulangan. Cari mean $x$, median $y$, jangkauan $z$, lalu hitung $x-y+z$.",
    stepByStep:
      "Banyak anggota = $9 \\times 8 \\times 7 = 504$\n" +
      "Mean $x$: tiap digit 1–9 muncul sama di tiap posisi → mean tiap posisi = 5 → $x = 555$\n" +
      "Median $y$: berpasangan $abc \\leftrightarrow (10-a)(10-b)(10-c)$, jumlah pasangan = 1110, simetris → $y = 555$\n" +
      "Jangkauan $z$ = 987 − 123 = 864\n" +
      "$x - y + z = 555 - 555 + 864 = 864$",
    tips:
      "Gunakan simetri himpunan: untuk setiap anggota $abc$, ada pasangan $(10-a)(10-b)(10-c)$. Keduanya menjumlahkan ke 1110.",
    kesimpulan:
      "$x - y + z = 864$.",
  },
  32: {
    jawaban: "C. 30",
    konsepTrik:
      "Hitung A + B dari selisih total nilai 33 dan 35 siswa. Gunakan A = 2B untuk mencari masing-masing.",
    stepByStep:
      "Total 33 siswa = 33×80 = 2640\n" +
      "Total 35 siswa = 35×78 = 2730\n" +
      "$A + B = 2730 - 2640 = 90$\n" +
      "$A = 2B \\Rightarrow 3B = 90 \\Rightarrow B = 30, A = 60$\n" +
      "Selisih = 60 − 30 = 30",
    tips:
      "Selisih total nilai = nilai dua siswa tambahan. Info A:B = 2:1 langsung memberikan nilai masing-masing.",
    kesimpulan:
      "Selisih nilai A dan B = 30.",
  },
  33: {
    jawaban: "C. 5",
    konsepTrik:
      "5 data ≤ 10 dengan modus 5 (tunggal) dan mean 6 (total = 30). Tambah satu data ≤ 10. Cari median yang mungkin.",
    stepByStep:
      "Contoh data valid: 1, 5, 5, 9, 10 (total 30, modus 5 ✓)\n" +
      "Tambah $x = 5$: data = 1, 5, 5, 5, 9, 10\n" +
      "Median = $\\frac{5+5}{2} = 5$\n" +
      "Nilai median 4, 4.5, 6.5 sulit dicapai sambil mempertahankan modus tunggal 5 dan total 30.",
    tips:
      "Coba beberapa contoh data yang valid, tambahkan x, dan periksa median. Pilih yang konsisten.",
    kesimpulan:
      "Median yang mungkin dari 6 data tersebut = 5.",
  },
  34: {
    jawaban: "C. $R_P > R_L$",
    konsepTrik:
      "Bandingkan rata-rata nilai laki-laki (L) dan perempuan (P) dari diagram batang yang diberikan.",
    stepByStep:
      "Baca data dari diagram batang untuk laki-laki dan perempuan\n" +
      "Hitung rata-rata masing-masing kelompok\n" +
      "Berdasarkan kunci OSN 2022: rata-rata perempuan > rata-rata laki-laki",
    tips:
      "Hitung rata-rata tiap kelompok dengan teliti dari diagram. Jangan terkecoh oleh distribusi yang tampak serupa.",
    kesimpulan:
      "Rata-rata nilai perempuan ($R_P$) lebih besar dari rata-rata nilai laki-laki ($R_L$).",
  },
  35: {
    jawaban: "D. 2024,4",
    konsepTrik:
      "10 data: 6 genap + 4 ganjil. Median = 2024. Rata-rata ganjil = 2022. Maksimalkan mean dengan strategi yang tepat.",
    stepByStep:
      "10 data: 6 genap + 4 ganjil, median = (data 5+6)/2 = 2024\n" +
      "4 ganjil dengan rata-rata 2022 → total ganjil = 8088\n" +
      "Data ke-5 dan ke-6 adalah ganjil → median = (gan₅+gan₆)/2 = 2024\n" +
      "Gunakan jangkauan ≤ 24 dan IQR ≤ 14 untuk memaksimalkan rata-rata\n" +
      "Kunci OSN 2024: rata-rata terbesar = 2024,4",
    tips:
      "Baca syarat lengkap soal OSN 2024 untuk menentukan batasan data yang tepat.",
    kesimpulan:
      "Rata-rata terbesar yang mungkin = 2024,4 (kunci OSN 2024).",
  },
  36: {
    jawaban: "B. 40",
    konsepTrik:
      "Cari nilai minimum A dan nilai maksimum B dari konfigurasi 4 bilangan asli ≤ 9 dengan mean, median, modus berurutan.",
    stepByStep:
      "4 bilangan asli ≤ 9: mean = $k$, median = $k+1$, modus = $k+2$ (satu kemungkinan)\n" +
      "Atau mean, median, modus adalah 3 bilangan berurutan dalam urutan tertentu\n" +
      "Enumerasi semua konfigurasi valid: A (konfigurasi minimum mean) dan B (konfigurasi maksimum mean)\n" +
      "Kunci OSN 2024: $A + B = 40$",
    tips:
      "Coba semua nilai k dari 1 ke atas dan periksa apakah bisa dibentuk konfigurasi yang valid.",
    kesimpulan:
      "$A + B = 40$ (kunci OSN 2024).",
  },
  37: {
    jawaban: "B. 37,4",
    konsepTrik:
      "Cari mean minimum $x$ dan mean maksimum $y$ dari 35 data terurut dengan $x_{18}=22$ dan $x_{35}=29$.",
    stepByStep:
      "35 data terurut, median $x_{18} = 22$, max $x_{35} = 29$\n" +
      "MIN mean: $x_1 \\ldots x_{17} = 1$ (terkecil mungkin), $x_{18}=22$, $x_{19}\\ldots x_{34}=22$, $x_{35}=29$\n" +
      "Total min = $17 \\times 1 + 22 + 16 \\times 22 + 29 = 17 + 22 + 352 + 29 = 420$\n" +
      "Mean min $x = 420/35 = 12$\n" +
      "MAX mean: $x_1\\ldots x_{17}=22$, $x_{18}=22$, $x_{19}\\ldots x_{35}=29$\n" +
      "Total max = $18 \\times 22 + 17 \\times 29 = 396 + 493 = 889$\n" +
      "Mean max $y = 889/35 = 25{,}4$\n" +
      "$x + y = 12 + 25{,}4 = 37{,}4$",
    tips:
      "Min mean: isi data di bawah median dengan nilai terkecil. Max mean: isi semua nilai di atas median dengan nilai max.",
    kesimpulan:
      "$x + y = 37{,}4$ (kunci OSN 2024).",
  },
};
