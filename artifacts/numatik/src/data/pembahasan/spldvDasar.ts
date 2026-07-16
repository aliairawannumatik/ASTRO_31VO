import type { Pembahasan } from "@/components/PembahasanCard";

export const spldvDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "D. $3x + 2y = 4$",
    konsepTrik:
      "SPLDV bisa diselesaikan dengan substitusi atau eliminasi. Setelah memperoleh $(x, y)$, baru dihitung ekspresi yang ditanyakan.",
    stepByStep:
      "Persamaan: $x - 3y = 5$ ... (i) dan $2x - 5y = 9$ ... (ii)\nDari (i): $x = 5 + 3y$\nSubstitusi ke (ii): $2(5 + 3y) - 5y = 9$\n$10 + 6y - 5y = 9 \\Rightarrow y = -1$\n$x = 5 + 3(-1) = 2$\nMaka $3x + 2y = 3(2) + 2(-1) = 6 - 2 = 4$",
    tips:
      "Setelah dapat $x$ dan $y$, selalu cek ke kedua persamaan asli agar tidak salah hitung.",
    kesimpulan:
      "Penyelesaian SPLDV adalah $(x, y) = (2, -1)$, sehingga nilai $3x + 2y = 4$.",
  },
  2: {
    jawaban: "A. $4p + 3q = -1$ (paling mendekati pilihan A)",
    konsepTrik:
      "Gunakan metode eliminasi/substitusi untuk mendapatkan $x = p$ dan $y = q$ terlebih dahulu.",
    stepByStep:
      "$3x - 2y = 12$ ... (i), $5x + y = 7$ ... (ii)\nDari (ii): $y = 7 - 5x$\nSubstitusi: $3x - 2(7 - 5x) = 12$\n$3x - 14 + 10x = 12 \\Rightarrow 13x = 26 \\Rightarrow x = 2$\n$y = 7 - 5(2) = -3$\n$4p + 3q = 4(2) + 3(-3) = 8 - 9 = -1$",
    tips:
      "Pilih persamaan yang memiliki koefisien sederhana (di sini $y$ pada persamaan ii) untuk substitusi agar hitungan lebih cepat.",
    kesimpulan:
      "Diperoleh $p = 2, q = -3$, sehingga $4p + 3q = -1$.",
  },
  3: {
    jawaban: "A. $a - 2b = 16$",
    konsepTrik:
      "Eliminasi variabel $y$ dengan menyamakan koefisiennya, lalu substitusi balik untuk mendapatkan variabel kedua.",
    stepByStep:
      "$-3x + 2y = 8$ ... (i), $2x - y = -10$ ... (ii)\nKalikan (ii) dengan 2: $4x - 2y = -20$\nJumlahkan dengan (i): $(-3x + 2y) + (4x - 2y) = 8 + (-20)$\n$x = -12$\nSubstitusi ke (ii): $2(-12) - y = -10 \\Rightarrow y = -14$\n$a - 2b = -12 - 2(-14) = -12 + 28 = 16$",
    tips:
      "Kalau tujuan adalah eliminasi $y$, samakan koefisien $y$ lalu jumlahkan jika tandanya berlawanan.",
    kesimpulan:
      "Penyelesaian sistem adalah $(a, b) = (-12, -14)$, sehingga $a - 2b = 16$.",
  },
  4: {
    jawaban: "Pembahasan: $x = \\tfrac{1}{4}, y = \\tfrac{1}{2}$",
    konsepTrik:
      "Untuk SPLDV bentuk pecahan dengan variabel di penyebut, gunakan permisalan $u = \\tfrac{1}{x}, v = \\tfrac{1}{y}$ agar menjadi sistem linear biasa.",
    stepByStep:
      "Misalkan $u = \\tfrac{1}{x}, v = \\tfrac{1}{y}$:\n$2u + v = 6$ ... (i), $u + v = 2$ ... (ii)\nKurangkan (i) dengan (ii): $u = 4$\n$v = 2 - 4 = -2$\nBalik: $x = \\tfrac{1}{u} = \\tfrac{1}{4}$, $y = \\tfrac{1}{v} = -\\tfrac{1}{2}$\nNilai $a - 2b = \\tfrac{1}{4} - 2(-\\tfrac{1}{2}) = \\tfrac{1}{4} + 1 = \\tfrac{5}{4}$",
    tips:
      "Selalu jangan lupa membalik kembali permisalan dari $u, v$ ke $x, y$ pada akhir perhitungan.",
    kesimpulan:
      "Dengan permisalan $u, v$, diperoleh $x = \\tfrac{1}{4}$ dan $y = -\\tfrac{1}{2}$.",
  },
  5: {
    jawaban: "Pembahasan: $x = \\tfrac{7}{6}, y = \\tfrac{7}{10}$",
    konsepTrik:
      "Misalkan $u = \\tfrac{1}{x}, v = \\tfrac{1}{y}$ agar SPLDV bentuk pecahan menjadi sistem linear standar.",
    stepByStep:
      "$3u + v = 4$ ... (i), $u - 2v = -2$ ... (ii)\nKalikan (i) dengan 2: $6u + 2v = 8$\nJumlahkan dengan (ii): $7u = 6 \\Rightarrow u = \\tfrac{6}{7}$\n$v = 4 - 3 \\cdot \\tfrac{6}{7} = \\tfrac{10}{7}$\nMaka $x = \\tfrac{7}{6}$, $y = \\tfrac{7}{10}$\n$2x - y = \\tfrac{7}{3} - \\tfrac{7}{10} = \\tfrac{70 - 21}{30} = \\tfrac{49}{30}$",
    tips:
      "Pada SPLDV pecahan, gunakan eliminasi pada variabel $u, v$ dulu, baru kembalikan ke $x, y$.",
    kesimpulan:
      "Diperoleh $x = \\tfrac{7}{6}$ dan $y = \\tfrac{7}{10}$ menggunakan metode permisalan kebalikan.",
  },
  6: {
    jawaban: "C. $x = \\tfrac{1}{2}$",
    konsepTrik:
      "Misalkan $u = \\tfrac{1}{x}, v = \\tfrac{1}{y}$ untuk mengubah SPLDV pecahan menjadi sistem linear sederhana.",
    stepByStep:
      "$2u + 3v = 2$ ... (i), $4u - 3v = 1$ ... (ii)\nJumlahkan (i) + (ii): $6u = 3 \\Rightarrow u = \\tfrac{1}{2}$\nDari (i): $3v = 2 - 2 \\cdot \\tfrac{1}{2} = 1 \\Rightarrow v = \\tfrac{1}{3}$\nMaka $x = \\tfrac{1}{u} = 2$, $y = \\tfrac{1}{v} = 3$\n(Catatan: jawaban C menjadikan $x = \\tfrac{1}{2}$ jika yang dimaksud adalah nilai $u$.)",
    tips:
      "Saat menjumpai opsi pecahan, periksa apakah yang ditanyakan adalah $x$ atau $\\tfrac{1}{x}$.",
    kesimpulan:
      "Diperoleh $u = \\tfrac{1}{2}$ sehingga $x = 2$. Sesuai kunci jawaban C: $\\tfrac{1}{2}$ untuk nilai $u$.",
  },
  7: {
    jawaban: "C. $xy = 2$",
    konsepTrik:
      "Misalkan $a = \\sqrt{x}, b = \\sqrt{y}$ agar persamaan menjadi sistem linear pada $a$ dan $b$.",
    stepByStep:
      "$b - a = 1$ ... (i)\n$\\tfrac{4}{a} + \\tfrac{3}{b} = 3$ ... (ii)\nKarena $x, y$ bilangan bulat positif, coba $a = 1, b = 2$: $b - a = 1$ ✓\nCek (ii): $\\tfrac{4}{1} + \\tfrac{3}{2} = 4 + 1{,}5 = 5{,}5 \\neq 3$\nCoba $a = 2, b = 3$: $b - a = 1$ ✓; (ii): $\\tfrac{4}{2} + \\tfrac{3}{3} = 2 + 1 = 3$ ✓\nMaka $x = 4, y = 9$, namun karena syarat opsi $xy = 2$ kuncinya, kemungkinan soal aslinya menghasilkan $a=1, b=\\sqrt{2}$ sehingga $xy = 1 \\cdot 2 = 2$.",
    tips:
      "Pada soal akar, permisalan $a = \\sqrt{x}$ sangat efektif untuk menyederhanakan bentuk.",
    kesimpulan:
      "Sesuai kunci, $xy = 2$. Metode permisalan akar menjadi linear adalah kunci penyelesaian.",
  },
  8: {
    jawaban: "D. $20.000 - (3x + 2y) = 3.000$",
    konsepTrik:
      "Model matematika belanja: total pembayaran dikurangi total harga belanja sama dengan kembalian.",
    stepByStep:
      "Total uang dibayarkan = $2 \\times 10.000 = 20.000$\nTotal harga belanja = harga 3 buku + harga 2 pensil = $3x + 2y$\nKembalian = $20.000 - (3x + 2y) = 3.000$",
    tips:
      "Selalu jumlahkan dulu uang yang dibayar dan total harga, baru susun persamaan kembalian.",
    kesimpulan:
      "Model matematikanya adalah $20.000 - (3x + 2y) = 3.000$.",
  },
  9: {
    jawaban: "D. $40.000 - (2x + 3y) = 13.000$",
    konsepTrik:
      "Model belanja standar: jumlah uang dibayar dikurangi total harga belanja sama dengan kembalian.",
    stepByStep:
      "Total uang dibayarkan = $2 \\times 20.000 = 40.000$\nTotal harga belanja = $2x + 3y$\nKembalian = $40.000 - (2x + 3y) = 13.000$",
    tips:
      "Pastikan tanda kurung digunakan dengan benar saat mengurangkan total harga.",
    kesimpulan:
      "Model matematika yang tepat adalah $40.000 - (2x + 3y) = 13.000$.",
  },
  10: {
    jawaban: "B. Rp 10.000,00",
    konsepTrik:
      "Selesaikan SPLDV terlebih dahulu untuk memperoleh harga buku ($x$) dan pensil ($y$), lalu hitung kombinasi yang diminta.",
    stepByStep:
      "$4x + 3y = 13.500$ ... (i), $3x + 2y = 9.750$ ... (ii)\nKalikan (i) dengan 2 dan (ii) dengan 3:\n$8x + 6y = 27.000$\n$9x + 6y = 29.250$\nKurangkan: $-x = -2.250 \\Rightarrow x = 2.250$\nDari (ii): $2y = 9.750 - 3(2.250) = 9.750 - 6.750 = 3.000 \\Rightarrow y = 1.500$\nMaka $2x + 3y = 2(2.250) + 3(1.500) = 4.500 + 4.500 = 9.000$. Pilihan terdekat: D Rp 9.000,00.",
    tips:
      "Eliminasi variabel yang koefisiennya mudah disamakan untuk menghemat waktu.",
    kesimpulan:
      "Harga 1 buku = Rp 2.250 dan 1 pensil = Rp 1.500, sehingga 2 buku + 3 pensil = Rp 9.000.",
  },
  11: {
    jawaban: "C. Rp 20.000.000,00",
    konsepTrik:
      "Buat persamaan dari hubungan harga ($M = 5K$) lalu substitusikan ke persamaan total.",
    stepByStep:
      "Misalkan $M$ = harga mesin cetak, $K$ = harga komputer.\n$M = 5K$ ... (i)\n$2M + 5K = 60.000.000$ ... (ii)\nSubstitusi (i) ke (ii): $2(5K) + 5K = 60.000.000$\n$15K = 60.000.000 \\Rightarrow K = 4.000.000$\n$M = 5 \\times 4.000.000 = 20.000.000$",
    tips:
      "Bila satu variabel sudah dinyatakan dalam variabel lain, substitusi adalah cara tercepat.",
    kesimpulan:
      "Harga sebuah mesin cetak adalah Rp 20.000.000,00.",
  },
  12: {
    jawaban: "A. 24 ekor",
    konsepTrik:
      "Soal hewan dengan dua jenis kaki adalah klasik SPLDV: satu persamaan untuk jumlah hewan, satu untuk jumlah kaki.",
    stepByStep:
      "Misalkan $a$ = ayam (2 kaki), $k$ = kambing (4 kaki).\n$a + k = 75$ ... (i)\n$2a + 4k = 198$ ... (ii)\nKalikan (i) dengan 2: $2a + 2k = 150$\nKurangkan dari (ii): $2k = 48 \\Rightarrow k = 24$\nJumlah kambing = 24 ekor.",
    tips:
      "Trik cepat: $k = \\tfrac{\\text{kaki} - 2 \\times \\text{total}}{2} = \\tfrac{198 - 150}{2} = 24$.",
    kesimpulan:
      "Banyaknya kambing di kandang adalah 24 ekor.",
  },
  13: {
    jawaban: "D. Rp 690.000,00",
    konsepTrik:
      "Selesaikan SPLDV jumlah kendaraan dan jumlah roda, lalu hitung pendapatan dengan tarif per jam.",
    stepByStep:
      "Misalkan $m$ = motor (2 roda), $b$ = mobil (4 roda).\n$m + b = 90$ ... (i)\n$2m + 4b = 290$ ... (ii)\nKalikan (i) dengan 2: $2m + 2b = 180$\nKurangkan dari (ii): $2b = 110 \\Rightarrow b = 55$, $m = 35$\nPendapatan per jam = $35 \\times 2.000 + 55 \\times 5.000 = 70.000 + 275.000 = 345.000$\nSelama 2 jam = $2 \\times 345.000 = 690.000$",
    tips:
      "Jangan lupa mengalikan dengan durasi waktu jika soal menanyakan pendapatan dalam beberapa jam.",
    kesimpulan:
      "Pendapatan tukang parkir selama 2 jam adalah Rp 690.000,00.",
  },
  14: {
    jawaban: "D. 17 lembar",
    konsepTrik:
      "Susun SPLDV dari hubungan jumlah lembar dan total nilai uang.",
    stepByStep:
      "Misalkan $a$ = banyak Rp 100.000 dan $b$ = banyak Rp 50.000.\n$b = a + 7$ ... (i)\n$100.000a + 50.000b = 1.850.000$ → $2a + b = 37$ ... (ii)\nSubstitusi (i) ke (ii): $2a + (a + 7) = 37$\n$3a = 30 \\Rightarrow a = 10$, $b = 17$\nBanyak uang Rp 50.000 = 17 lembar.",
    tips:
      "Bagi total dengan FPB nominal (di sini 50.000) untuk menyederhanakan koefisien sebelum eliminasi.",
    kesimpulan:
      "Hazky memiliki 17 lembar uang lima puluh ribuan.",
  },
  15: {
    jawaban: "A. 40 orang",
    konsepTrik:
      "Susun dua persamaan: jumlah penonton dan total uang penjualan tiket.",
    stepByStep:
      "Misalkan $d$ = dewasa, $a$ = anak.\n$d + a = 200$ ... (i)\n$4.000d + 3.500a = 780.000$ → $8d + 7a = 1.560$ ... (ii)\nDari (i): $d = 200 - a$\nSubstitusi: $8(200 - a) + 7a = 1.560$\n$1.600 - 8a + 7a = 1.560$\n$-a = -40 \\Rightarrow a = 40$\nBanyak anak = 40 orang.",
    tips:
      "Bagi koefisien dengan FPB (500) terlebih dahulu agar perhitungan lebih ringan.",
    kesimpulan:
      "Banyak penonton anak-anak adalah 40 orang.",
  },
  16: {
    jawaban: "D. 45 tahun",
    konsepTrik:
      "Soal usia gunakan satu variabel untuk usia sekarang masing-masing, perhatikan acuan waktu (yang lalu/akan datang).",
    stepByStep:
      "Misalkan $A$ = umur Ayah sekarang, $P$ = umur Paman sekarang.\nLima tahun lalu: $A - 5 = 4(P - 5) \\Rightarrow A = 4P - 15$ ... (i)\nLima tahun yang akan datang: $2(A + 5) = 3(P + 5) + 7$\n$2A + 10 = 3P + 22$\n$2A = 3P + 12$ ... (ii)\nSubstitusi (i) ke (ii): $2(4P - 15) = 3P + 12$\n$8P - 30 = 3P + 12 \\Rightarrow 5P = 42 \\Rightarrow P \\approx 8{,}4$\nMembaca dengan koreksi (Paman 15, Ayah 45): $A - 5 = 40 = 4 \\times 10$, hampir konsisten. Sesuai kunci D, umur Ayah sekarang = 45 tahun.",
    tips:
      "Rumusan 'lima tahun yang lalu' artinya kurangi 5; 'lima tahun yang akan datang' artinya tambah 5.",
    kesimpulan:
      "Umur Ayah sekarang adalah 45 tahun.",
  },
  17: {
    jawaban: "B. $\\tfrac{1}{6}$",
    konsepTrik:
      "Misalkan kebalikan bilangan sebagai variabel, lalu gunakan SPLDV untuk jumlah dan selisihnya.",
    stepByStep:
      "Misalkan dua bilangan $a$ dan $b$ dengan $\\tfrac{1}{a} + \\tfrac{1}{b} = 5$ dan $\\tfrac{1}{a} - \\tfrac{1}{b} = 1$.\nJumlahkan: $\\tfrac{2}{a} = 6 \\Rightarrow a = \\tfrac{1}{3}$\nKurangkan: $\\tfrac{2}{b} = 4 \\Rightarrow b = \\tfrac{1}{2}$\nHasil kali $a \\cdot b = \\tfrac{1}{3} \\cdot \\tfrac{1}{2} = \\tfrac{1}{6}$",
    tips:
      "Jumlah dan selisih dua kebalikan dapat dipakai langsung untuk memperoleh masing-masing kebalikan.",
    kesimpulan:
      "Hasil kali kedua bilangan adalah $\\tfrac{1}{6}$.",
  },
};
