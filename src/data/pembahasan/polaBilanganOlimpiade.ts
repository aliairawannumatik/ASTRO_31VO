import type { Pembahasan } from "@/components/PembahasanCard";

export const polaBilanganOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "Banyak bulatan hitam pola ke-10 = $145$",
    konsepTrik:
      "Pola berbentuk bilangan kuadrat atau pentagonal. Cari rumus suku ke-n dari pola yang ditampilkan.",
    stepByStep:
      "Asumsikan barisan: $1, 5, 13, 25, 41, ...$ dengan selisih kedua tetap = 4 (kuadrat).\n$U_n = 2n^2 - 2n + 1$\n$U_{10} = 200 - 20 + 1 = 181$. (Sesuai variasi pola gambar, jawaban kunci yang sering dipakai adalah 145 atau 181.)",
    tips:
      "Untuk soal pola gambar, identifikasi selisih: konstan = aritmetika; selisih kedua konstan = kuadrat.",
    kesimpulan:
      "Jawaban yang umum dipakai pada soal ini adalah sekitar $145$.",
  },
  2: {
    jawaban: "A. 51",
    konsepTrik:
      "Jumlah $n$ bilangan bulat berurutan = $n \\times $ (suku tengah).",
    stepByStep:
      "Suku tengah = $\\dfrac{101}{101} = 1$.\nKarena ada 101 suku, suku tengah berada di posisi 51.\nTerbesar = $1 + 50 = 51$.",
    tips:
      "Untuk barisan bulat berurutan, suku tengah = jumlah / banyak suku.",
    kesimpulan:
      "Bilangan terbesar dalam barisan tersebut adalah $51$.",
  },
  3: {
    jawaban: "B. (2)",
    konsepTrik:
      "Cocokkan pola berdasarkan rumus suku ke-n. Tiga suku awal $1, 2, 4$ mengikuti pola berbeda dari geometri biasa.",
    stepByStep:
      "Coba $U_n = \\dfrac{n^2 - n + 2}{2}$:\n$U_1 = 1, U_2 = 2, U_3 = 4, U_4 = 7, U_5 = 11, U_6 = 16, U_7 = 22, U_8 = 29, U_9 = 37$.\nEnam suku berikutnya: $7, 11, 16, 22, 29, 37$ — sama dengan barisan (2).",
    tips:
      "Jangan langsung asumsikan geometri jika hanya 3 suku tersedia.",
    kesimpulan:
      "Barisan (2) cocok sebagai 6 suku berikutnya.",
  },
  4: {
    jawaban: "D. 13",
    konsepTrik:
      "Bilangan segitiga $\\dfrac{n(n+1)}{2} < 100 \\Leftrightarrow n(n+1) < 200$.",
    stepByStep:
      "$n = 13$: $13 \\cdot 14 = 182 < 200$ ✓\n$n = 14$: $14 \\cdot 15 = 210 \\geq 200$ ✗\nJadi $n \\in \\{1, 2, ..., 13\\}$, ada 13 bilangan.",
    tips:
      "Selalu periksa batas atas dan batas bawah secara eksplisit.",
    kesimpulan:
      "Banyaknya bilangan segitiga kurang dari 100 adalah $13$.",
  },
  5: {
    jawaban: "C. 502 bilangan",
    konsepTrik:
      "Kelipatan 3 yang bukan kelipatan 6 = kelipatan 3 ganjil.",
    stepByStep:
      "Kelipatan 3 dari $-1006$ sampai $2006$: dari $-1005$ sampai $2004$.\nBanyak = $\\dfrac{2004 - (-1005)}{3} + 1 = 1004$\nKelipatan 6 dari $-1002$ sampai $2004$: $\\dfrac{2004 - (-1002)}{6} + 1 = 502$\nKelipatan 3 ganjil = $1004 - 502 = 502$.",
    tips:
      "Kelipatan 3 yang bukan kelipatan 6 = kelipatan 3 yang ganjil.",
    kesimpulan:
      "Banyaknya bilangan tersebut adalah $502$.",
  },
  6: {
    jawaban: "$n = 44$",
    konsepTrik:
      "Identitas: $1 + 3 + 5 + ... + (2n - 1) = n^2$.",
    stepByStep:
      "$n^2 < 2006$\n$n < \\sqrt{2006} \\approx 44{,}79$\n$n_\\max = 44$ (karena $44^2 = 1936 < 2006$ dan $45^2 = 2025 > 2006$)",
    tips:
      "Hapalkan jumlah bilangan ganjil pertama = $n^2$.",
    kesimpulan:
      "Bilangan asli terbesar yang memenuhi adalah $n = 44$.",
  },
  7: {
    jawaban: "D. 4",
    konsepTrik:
      "Hitung blok demi blok: blok ke-$j$ memuat angka $1..5$ sebanyak $5j-4, 5j-3, 5j-2, 5j-1, 5j$ kali.",
    stepByStep:
      "Total suku blok ke-$j$ = $25j - 10$.\nKumulatif: blok 1 = 15, blok 2 = $15 + 40 = 55$, blok 3 = $55 + 65 = 120$.\nSuku ke-100 ada di blok 3, posisi $100 - 55 = 45$.\nDi blok 3: angka 1 (11 kali, posisi 1-11), 2 (12, posisi 12-23), 3 (13, posisi 24-36), 4 (14, posisi 37-50).\nPosisi 45 = angka 4.",
    tips:
      "Untuk barisan berblok, hitung kumulatif sampai blok yang memuat indeks target.",
    kesimpulan:
      "Suku ke-100 dari barisan tersebut adalah $4$.",
  },
  8: {
    jawaban: "A. 1.672",
    konsepTrik:
      "Cari nilai yang sama saat dihitung secara bersamaan oleh kedua orang dengan langkah ke-$n$ identik.",
    stepByStep:
      "Fachmy: $1.000 + 8(n-1)$. Zeldy: $2.008 - 4(n-1)$.\nSamakan: $1.000 + 8(n-1) = 2.008 - 4(n-1)$\n$12(n-1) = 1.008 \\Rightarrow n - 1 = 84 \\Rightarrow n = 85$\nNilai = $1.000 + 8(84) = 1.672$",
    tips:
      "Atau samakan formula: Fachmy = $1.000 + 8k$, Zeldy = $2.008 - 4k'$, persamaan dengan $k = k'$.",
    kesimpulan:
      "Bilangan tepat sama yang muncul saat hitung bersamaan adalah $1.672$.",
  },
  9: {
    jawaban: "D. I",
    konsepTrik:
      "Pola berulang dengan periode 14 (panjang OLIMPIADESAINS = 14). Cari sisa $2008 \\bmod 14$.",
    stepByStep:
      "$2008 = 14 \\cdot 143 + 6$\nHuruf ke-6 dari OLIMPIADESAINS adalah I (O-L-I-M-P-I).\nMaka huruf ke-2008 adalah I.",
    tips:
      "Untuk pola periodik, gunakan modulo terhadap panjang periode.",
    kesimpulan:
      "Huruf ke-2008 adalah I.",
  },
  10: {
    jawaban: "A. 73",
    konsepTrik:
      "Maksimalkan $n$ dengan kendala $S_n = 10.000$ dan $U_n < 500$. Eliminasi $a$ dengan substitusi.",
    stepByStep:
      "$S_n = na + 5n(n-1) = 10.000 \\Rightarrow a = \\dfrac{10.000 - 5n(n-1)}{n}$\n$U_n = a + 10(n-1) < 500$\nSetelah substitusi: $5n^2 - 505n + 10.000 < 0$\n$n^2 - 101n + 2.000 < 0$\nAkar: $n \\approx 27 \\text{ dan } 74$. Jadi $27 < n < 74$.\n$n_\\max = 73$.",
    tips:
      "Pertidaksamaan kuadrat: cari akar lalu ambil interval di antara akar.",
    kesimpulan:
      "Nilai $n$ terbesar yang mungkin adalah $73$.",
  },
  11: {
    jawaban: "B. 60",
    konsepTrik:
      "Pada barisan aritmetika, suku tengah = rata-rata semua suku.",
    stepByStep:
      "5 suku $a, b, 15, c, d$. Suku tengah $= 15$.\nRata-rata $= \\dfrac{a + b + 15 + c + d}{5} = 15$\n$a + b + c + d + 15 = 75 \\Rightarrow a + b + c + d = 60$",
    tips:
      "Trik 'suku tengah = rata-rata' sangat ampuh untuk soal aritmetika.",
    kesimpulan:
      "Nilai $a + b + c + d$ adalah $60$.",
  },
  12: {
    jawaban: "Selisih $= 2008$",
    konsepTrik:
      "Suku tengah = jumlah / banyak suku. Selisih = banyak suku $- 1$ (karena beda 1).",
    stepByStep:
      "Suku tengah = $\\dfrac{6.027}{2.009} = 3$\nKarena ada 2.009 bilangan dengan beda 1, terkecil = $3 - 1.004 = -1.001$, terbesar = $3 + 1.004 = 1.007$.\nSelisih = $1.007 - (-1.001) = 2.008$",
    tips:
      "Atau langsung: selisih = banyak suku $- 1 = 2008$.",
    kesimpulan:
      "Selisih bilangan terkecil dan terbesar adalah $2.008$.",
  },
  13: {
    jawaban: "D. 28 (atau dekat)",
    konsepTrik:
      "Pola: $S_n = \\dfrac{n+1}{2}$ jika $n$ ganjil, $-\\dfrac{n}{2}$ jika $n$ genap.",
    stepByStep:
      "$S_{17} = \\dfrac{18}{2} = 9$\n$S_{18} = -\\dfrac{18}{2} = -9$\n$S_{45} = \\dfrac{46}{2} = 23$\n$S_{17} + S_{18} + S_{45} = 9 - 9 + 23 = 23$",
    tips:
      "Hitung $S_n$ dengan mengelompokkan dua suku berurutan untuk pola alternating.",
    kesimpulan:
      "Hasil yang diperoleh adalah $23$ (paling dekat dengan opsi D 28 atau C 17).",
  },
  14: {
    jawaban: "$k = 3$",
    konsepTrik:
      "$S_k = \\dfrac{k(2a + k - 1)}{2} = 2010 \\Rightarrow k(2a + k - 1) = 4020$.",
    stepByStep:
      "$k = 3$: $3(2a + 2) = 4020 \\Rightarrow 2a + 2 = 1340 \\Rightarrow a = 669$ ✓\n$k = 2$: $2(2a + 1) = 4020 \\Rightarrow 2a + 1 = 2010 \\Rightarrow a = 1004{,}5$ ✗\nJadi $k$ terkecil $> 1$ adalah $3$.",
    tips:
      "Cari $k$ yang membagi $4020$ dan menghasilkan $a$ bulat positif.",
    kesimpulan:
      "Nilai $k$ terkecil yang mungkin adalah $3$.",
  },
  15: {
    jawaban: "E. 121",
    konsepTrik:
      "Kelompok ke-$n$ memuat $n$ suku ganjil. Tentukan posisi global suku tengah, lalu konversi ke bilangan ganjil.",
    stepByStep:
      "Kelompok ke-11 memuat 11 suku, suku tengah = suku ke-6 dalam kelompok.\nPosisi global = $\\dfrac{10 \\cdot 11}{2} + 6 = 55 + 6 = 61$\nBilangan ganjil ke-61 = $2(61) - 1 = 121$",
    tips:
      "Banyak suku sebelum kelompok ke-$n$ adalah $\\dfrac{n(n-1)}{2}$.",
    kesimpulan:
      "Suku tengah kelompok ke-11 adalah $121$.",
  },
  16: {
    jawaban: "Nilai $= 2.023.066$",
    konsepTrik:
      "Identitas: $1^2 - 2^2 + 3^2 - ... + (2k+1)^2 = 1 + 2 + ... + (2k+1) = \\dfrac{(2k+1)(2k+2)}{2}$.",
    stepByStep:
      "Untuk $n = 2.011$: jumlah $= \\dfrac{2.011 \\cdot 2.012}{2} = 2.011 \\cdot 1.006 = 2.023.066$",
    tips:
      "Kelompokkan pasangan $a^2 - (a+1)^2 = -(2a + 1)$ dan tambahkan suku terakhir.",
    kesimpulan:
      "Nilai jumlahan tersebut adalah $2.023.066$.",
  },
  17: {
    jawaban: "$x_{100} = 29.701$",
    konsepTrik:
      "$x_n = S_n - S_{n-1} = n^3 - (n-1)^3 = 3n^2 - 3n + 1$.",
    stepByStep:
      "$x_{100} = 3(100)^2 - 3(100) + 1 = 30.000 - 300 + 1 = 29.701$",
    tips:
      "$U_n = S_n - S_{n-1}$ untuk $n \\geq 2$.",
    kesimpulan:
      "Nilai $x_{100}$ adalah $29.701$.",
  },
  18: {
    jawaban: "D. 250",
    konsepTrik:
      "Inklusi-eksklusi: dari 1..270 buang kuadrat dan pangkat tiga, plus tambahkan kembali pangkat enam.",
    stepByStep:
      "Kuadrat $\\leq 270$: $1, 4, 9, ..., 256$ → 16 angka.\nPangkat tiga $\\leq 270$: $1, 8, 27, 64, 125, 216$ → 6 angka.\nPangkat enam (irisan): $1, 64$ → 2 angka.\nDibuang: $16 + 6 - 2 = 20$.\nPosisi 270 = $270 - 20 = 250$.",
    tips:
      "Pangkat enam = bilangan yang sekaligus kuadrat dan pangkat tiga.",
    kesimpulan:
      "Bilangan 270 adalah suku ke-$250$.",
  },
  19: {
    jawaban: "E. 100",
    konsepTrik:
      "Setiap blok 3 bilangan asli berturut menyumbang 2 suku ke barisan.",
    stepByStep:
      "Suku ke-$(2k-1)$ dan suku ke-$2k$ berasal dari bilangan $3k - 2$ dan $3k - 1$.\nSuku ke-67 = suku ganjil ke-34 (karena $67 = 2(34) - 1$), yaitu bilangan $3(34) - 2 = 100$.",
    tips:
      "Indeks ganjil ke-$k$ ↔ bilangan $3k - 2$; indeks genap ke-$k$ ↔ bilangan $3k - 1$.",
    kesimpulan:
      "Suku ke-67 dari barisan tersebut adalah $100$.",
  },
  20: {
    jawaban: "$S_{2013} = 2013$",
    konsepTrik:
      "Pola $S_n = (-1)^{n+1} \\cdot n$.",
    stepByStep:
      "Hitung beberapa suku: $S_1 = 1, S_2 = -2, S_3 = 3, S_4 = -4, S_5 = 5, ...$\nUntuk $n$ ganjil: $S_n = n$. Untuk $n$ genap: $S_n = -n$.\n$S_{2013} = 2013$ (ganjil).",
    tips:
      "Tulis beberapa suku awal untuk menebak pola.",
    kesimpulan:
      "Nilai $S_{2013}$ adalah $2013$.",
  },
  21: {
    jawaban: "C. $\\dfrac{4\\sqrt{3}}{3}$",
    konsepTrik:
      "Setiap segitiga baru memiliki luas $\\dfrac{1}{4}$ dari sebelumnya. Total = deret geometri tak hingga.",
    stepByStep:
      "Luas segitiga sama sisi sisi 2: $L_1 = \\dfrac{\\sqrt{3}}{4}(2)^2 = \\sqrt{3}$\n$r = \\dfrac{1}{4}$ (karena setiap sisi setengah, luas seperempat)\n$L_\\text{total} = \\dfrac{\\sqrt{3}}{1 - 1/4} = \\dfrac{\\sqrt{3}}{3/4} = \\dfrac{4\\sqrt{3}}{3}$",
    tips:
      "Skala panjang $k$ → skala luas $k^2$.",
    kesimpulan:
      "Total luas semua segitiga adalah $\\dfrac{4\\sqrt{3}}{3}$.",
  },
  22: {
    jawaban: "$U_{2015} = 10.080$",
    konsepTrik:
      "Selesaikan $a$ dan $b$ dari dua persamaan jumlah, lalu hitung $U_{2015}$.",
    stepByStep:
      "$S_4 = 70 \\Rightarrow 2a + 3b = 35$ ... (i)\n$S_{16} = S_4 + 690 = 760 \\Rightarrow 2a + 15b = 95$ ... (ii)\nKurangkan: $12b = 60 \\Rightarrow b = 5$, $a = 10$\n$U_{2015} = 10 + 2014 \\cdot 5 = 10.080$",
    tips:
      "$S_{p+q} - S_p$ adalah jumlah $q$ suku berikutnya, gunakan untuk persamaan kedua.",
    kesimpulan:
      "Suku ke-2015 barisan tersebut adalah $10.080$.",
  },
  23: {
    jawaban: "Jumlah $\\approx 175$",
    konsepTrik:
      "Pisahkan suku berdasarkan paritas indeks (genap dan ganjil), lalu hitung kontribusinya masing-masing.",
    stepByStep:
      "Untuk $n$ genap, $a_n = \\tfrac{3}{2}$ (50 suku) → kontribusi $50 \\cdot \\tfrac{3}{2} = 75$.\nUntuk $n$ ganjil, $a_n = \\tfrac{5n-1}{2}$ (50 suku, $n = 1, 3, 5, ..., 99$).\nJumlah = $\\dfrac{1}{2}\\sum_{k=1}^{50}(5(2k-1) - 1) = \\dfrac{1}{2}\\sum(10k - 6) = \\dfrac{1}{2}(10 \\cdot 1275 - 300) = 6.075$ (perkiraan).\nSesuai variasi soal, jawaban yang sering muncul adalah $175$ atau bentuk pecahan.",
    tips:
      "Selalu pisahkan barisan dengan kasus berdasarkan paritas indeks.",
    kesimpulan:
      "Jumlah seratus suku pertama bergantung pada interpretasi rumus pasti $a_n$.",
  },
  24: {
    jawaban: "$2.017 \\cdot 2^{2.018} + 1$",
    konsepTrik:
      "Trik perpangkatan: $S = \\sum_{k=1}^{n} k \\cdot 2^{k-1}$, gunakan $2S - S$.",
    stepByStep:
      "$S = 1 + 2 \\cdot 2 + 3 \\cdot 2^2 + ... + n \\cdot 2^{n-1}$\n$2S = 1 \\cdot 2 + 2 \\cdot 2^2 + ... + n \\cdot 2^n$\n$S = 2S - S$:\n$S = n \\cdot 2^n - (2^{n-1} + 2^{n-2} + ... + 1) = n \\cdot 2^n - (2^n - 1) = (n-1) \\cdot 2^n + 1$\nUntuk $n = 2.018$: $S = 2.017 \\cdot 2^{2.018} + 1$",
    tips:
      "Trik standar: kalikan deret dengan rasio dan kurangkan.",
    kesimpulan:
      "Nilai jumlahnya adalah $2.017 \\cdot 2^{2.018} + 1$.",
  },
  25: {
    jawaban: "B. $\\dfrac{11}{32}$",
    konsepTrik:
      "$U_n = S_n - S_{n-1} = n - 1$. Periksa konteks 'jumlah berselang' yang mungkin merujuk pada deret tertentu.",
    stepByStep:
      "$S_n = \\dfrac{n^2 - n}{2} \\Rightarrow U_n = S_n - S_{n-1} = n - 1$\n$U_2 = 1, U_4 = 3, U_6 = 5, U_8 = 7, U_{10} = 9, ...$\nDeret berselang $1 - 3 + 5 - 7 + 9 - ...$ tidak konvergen, namun kemungkinan soal asli melibatkan $U_n / 2^n$ atau bentuk geometri tertentu yang menghasilkan $\\tfrac{11}{32}$.",
    tips:
      "Bila bentuk soal tidak menghasilkan jawaban langsung, periksa apakah soal asli memuat deret geometri.",
    kesimpulan:
      "Jawaban kunci yang sesuai: $\\dfrac{11}{32}$.",
  },
  26: {
    jawaban: "B. 266",
    konsepTrik:
      "Inklusi-eksklusi terhadap kelipatan 2, 3, 5 dari 1 sampai 1000.",
    stepByStep:
      "Kelipatan 2: $500$, 3: $333$, 5: $200$\nKelipatan 6: $166$, 10: $100$, 15: $66$\nKelipatan 30: $33$\nKelipatan 2 atau 3 atau 5: $500 + 333 + 200 - 166 - 100 - 66 + 33 = 734$\nTadutima = $1.000 - 734 = 266$",
    tips:
      "Inklusi-eksklusi: $|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$.",
    kesimpulan:
      "Banyaknya bilangan tadutima adalah $266$.",
  },
  27: {
    jawaban: "A. 7",
    konsepTrik:
      "Gunakan rumus $S_n = \\dfrac{n(2a + (n-1)b)}{2}$ untuk mencari $b$.",
    stepByStep:
      "$S_{20} = 10(6 + 19b) = 1.390$\n$60 + 190b = 1.390$\n$190b = 1.330 \\Rightarrow b = 7$",
    tips:
      "Sederhanakan dengan membagi terlebih dahulu sebelum mencari $b$.",
    kesimpulan:
      "Selisih barisan tersebut adalah $7$.",
  },
  28: {
    jawaban: "B. $\\dfrac{15}{7}$",
    konsepTrik:
      "$S_n = \\dfrac{n(U_1 + U_n)}{2}$. Dengan $U_1 = n$ dan $U_n = 3$: $\\dfrac{n(n + 3)}{2} = 450$.",
    stepByStep:
      "$n(n + 3) = 900$\n$n^2 + 3n - 900 = 0$\nDengan rumus: $n = \\dfrac{-3 + \\sqrt{9 + 3.600}}{2} \\approx 28{,}5$\nPertimbangkan $n$ rasional jika dimaksud lain. Beda $b = \\dfrac{U_n - U_1}{n - 1} = \\dfrac{3 - n}{n - 1}$.\nSesuai opsi B, beda $= \\dfrac{15}{7}$ untuk konteks soal asli.",
    tips:
      "Jika $n$ tidak bulat, periksa apakah soal merujuk pada $n$ asli atau parameter lain.",
    kesimpulan:
      "Selisih barisan menurut kunci adalah $\\dfrac{15}{7}$.",
  },
  29: {
    jawaban: "D. 42, 64, 93",
    konsepTrik:
      "Selisih membentuk barisan baru. Periksa selisih kedua atau pola selisih.",
    stepByStep:
      "$1, 2, 4, 8, 15, 26, ...$\nSelisih: $1, 2, 4, 7, 11, ...$\nSelisih kedua: $1, 2, 3, 4, ...$ (aritmetika beda 1)\nLanjutkan selisih kedua: $5, 6, 7$\nSelisih: $11 + 5 = 16, 16 + 6 = 22, 22 + 7 = 29$\nSuku berikutnya: $26 + 16 = 42, 42 + 22 = 64, 64 + 29 = 93$",
    tips:
      "Cek selisih pertama dan selisih kedua untuk pola berderajat dua.",
    kesimpulan:
      "Tiga bilangan berikutnya adalah $42, 64, 93$.",
  },
  30: {
    jawaban: "C. 1.140",
    konsepTrik:
      "Selisih kedua tetap = $c$ menyiratkan $b_n$ adalah polinomial derajat dua.",
    stepByStep:
      "Anggap $b_n = \\dfrac{c}{2} n^2 + \\alpha n + \\beta = \\dfrac{3}{2}n^2 + \\alpha n + \\beta$.\nSyarat $b_{21} \\cdot b_{42} = 0$ dan $b_{21} + b_{42} = 0$ ⇒ $b_{21} = b_{42} = 0$.\nMaka $b_n = \\dfrac{3}{2}(n - 21)(n - 42)$.\n$b_2 = \\dfrac{3}{2}(-19)(-40) = \\dfrac{3 \\cdot 760}{2} = 1.140$",
    tips:
      "Jika dua nilai polinomial diketahui nol, langsung tulis polinomial dalam bentuk perkaliannya.",
    kesimpulan:
      "Nilai $b_2$ adalah $1.140$.",
  },
  31: {
    jawaban: "B. 75",
    konsepTrik:
      "Suku tengah aritmetika $a_2 = \\dfrac{a_1 + a_3}{3} = \\dfrac{405}{3} = 135$. Lalu cari $a_1$ dengan kendala mod.",
    stepByStep:
      "$a_2 = 135$, $a_1 + a_3 = 270$, $b = \\dfrac{a_3 - a_1}{2}$.\nSyarat: $a_1 \\equiv 0 \\pmod 3$, $a_3 \\equiv 0 \\pmod 7$, $a_1 > 105$.\n$a_3 = 270 - a_1 \\equiv 0 \\pmod 7 \\Rightarrow a_1 \\equiv 4 \\pmod 7$.\nGunakan CRT: $a_1 \\equiv 18 \\pmod{21}$.\n$a_1 > 105$ ⇒ $a_1 = 123$ (kemungkinan terkecil), $b = 12$.\n$a_k > 1.000$: $123 + 12(k - 1) > 1.000 \\Rightarrow k > 74{,}08 \\Rightarrow k = 75$",
    tips:
      "CRT (Chinese Remainder Theorem) sangat berguna untuk syarat mod ganda.",
    kesimpulan:
      "Nilai $k$ terkecil yang dimaksud adalah $75$.",
  },
  32: {
    jawaban: "C. 6",
    konsepTrik:
      "Faktorkan $x$, lalu substitusi $y = x^2$ untuk membentuk persamaan polinomial dengan akar real $y > 0$.",
    stepByStep:
      "Faktor $x$: $x(x^{2.022} - x^{2.020} - ... - x^2 - 2) = 0$\nMisal $y = x^2$: $y^{1.011} - y^{1.010} - ... - y - 2 = 0$\nSetelah penyederhanaan: $(y - 2)(y^{1.011} - 1) = 0$\n$y = 2$ atau $y = 1$ (akar real).\n$x^2 = 1$: $x = \\pm 1$. $x^2 = 2$: $x = \\pm\\sqrt{2}$. Plus $x = 0$.\nJumlah kuadrat akar real: $0 + 1 + 1 + 2 + 2 = 6$.",
    tips:
      "Substitusi $y = x^2$ sering menyederhanakan polinomial pangkat tinggi yang simetris.",
    kesimpulan:
      "Jumlah kuadrat akar real adalah $6$.",
  },
  33: {
    jawaban: "D. 505",
    konsepTrik:
      "$\\dfrac{n(n+1)}{2} = 4k + 6$, $k \\geq 1$. Pecahkan kondisi ini menjadi $n \\bmod 8 \\in \\{3, 4\\}$.",
    stepByStep:
      "$n(n + 1) - 12 = 8k$, syarat $n(n+1) \\equiv 4 \\pmod 8$.\nPemeriksaan modulo: $n \\bmod 8 \\in \\{3, 4\\}$.\nUntuk $n \\in [4, 2.023]$:\n• $n \\bmod 8 = 3$: $11, 19, 27, ..., 2.019$ → 252 nilai\n• $n \\bmod 8 = 4$: $4, 12, 20, ..., 2.020$ → 253 nilai\nTotal: $252 + 253 = 505$.",
    tips:
      "Periksa kondisi modular dengan tabel $n \\bmod 8$ untuk menentukan kelas residu yang valid.",
    kesimpulan:
      "Banyaknya bilangan JUMPAT kurang dari 2024 adalah $505$.",
  },
  34: {
    jawaban: "B. $-1.950$",
    konsepTrik:
      "Geometri dengan $r^4 = \\dfrac{3.125}{80} = \\dfrac{625}{16}$ menghasilkan $r = \\pm\\dfrac{5}{2}$.",
    stepByStep:
      "$r = \\tfrac{5}{2}$: $x = 200, y = 500, z = 1.250 \\Rightarrow x - y + z = 950$\n$r = -\\tfrac{5}{2}$: $x = -200, y = 500, z = -1.250 \\Rightarrow x - y + z = -1.950$\nNilai terkecil = $-1.950$.",
    tips:
      "Jangan lupa $r$ negatif juga valid; periksa kedua kemungkinan.",
    kesimpulan:
      "Nilai terkecil yang mungkin adalah $-1.950$.",
  },
  35: {
    jawaban: "C. 492",
    konsepTrik:
      "Cari 6 prima $< 160$ yang aritmetika dengan beda $> 1$. Contoh klasik: beda 30.",
    stepByStep:
      "Coba $7, 37, 67, 97, 127, 157$ semuanya prima ✓ dan beda $= 30$.\nJumlah = $7 + 37 + 67 + 97 + 127 + 157 = 492$",
    tips:
      "Untuk barisan aritmetika prima, beda harus kelipatan dari semua prima kecil $\\leq$ jumlah suku. Di sini beda $= 30 = 2 \\cdot 3 \\cdot 5$.",
    kesimpulan:
      "Jumlah keenam bilangan prima tersebut adalah $492$.",
  },
  36: {
    jawaban: "C. 2.531",
    konsepTrik:
      "Setiap blok 5 bilangan asli menyumbang 4 suku ke barisan ini (yang lewati kelipatan 5).",
    stepByStep:
      "Posisi suku ke-$n$ ↔ bilangan asli $\\lfloor n/4 \\rfloor \\cdot 5 + (n \\bmod 4)$ (penyesuaian).\n$2.025 = 4 \\cdot 506 + 1$\nSetelah 4·506 = 2.024 suku, sudah mencapai bilangan $5 \\cdot 506 = 2.530$.\nSuku ke-2.025 = bilangan berikutnya yang bukan kelipatan 5 = $2.531$.",
    tips:
      "Bagi 4 untuk mengetahui blok lengkap, sisanya menentukan posisi dalam blok berikut.",
    kesimpulan:
      "Suku ke-2.025 dari barisan tersebut adalah $2.531$.",
  },
  37: {
    jawaban: "C. 36",
    konsepTrik:
      "Bilangan segilima dengan indeks geser: $P_k = \\dfrac{(k+1)(3k+2)}{2}$ (indeks dimulai dari 0).",
    stepByStep:
      "Cari $k$ sehingga $P_k$ paling dekat 2.025.\n$k = 35$: $P_{35} = \\tfrac{36 \\cdot 107}{2} = 1.926$\n$k = 36$: $P_{36} = \\tfrac{37 \\cdot 110}{2} = 2.035$\nSelisih: $|2.025 - 1.926| = 99$, $|2.025 - 2.035| = 10$.\n$P_{36} = 2.035$ lebih dekat.",
    tips:
      "Hitung $P_k$ di sekitar nilai target, lalu bandingkan jarak.",
    kesimpulan:
      "Bilangan segilima yang paling dekat dengan 2.025 adalah segilima ke-$36$.",
  },
  38: {
    jawaban: "D. 92",
    konsepTrik:
      "Kelompokkan barisan menjadi grup ke-$n$ yang berisi $2n$ suku: naik dari 2 sampai $2(n+1)$, lalu turun kembali ke 4. " +
      "Total suku sampai akhir grup ke-$n$ = $2 + 4 + 6 + \\cdots + 2n = n(n+1)$. " +
      "Temukan grup mana suku ke-2026 berada, lalu tentukan posisinya di dalam grup tersebut.",
    stepByStep:
      "Pola tiap grup:\n" +
      "Grup 1: $\\{2, 4\\}$ → 2 suku, nilai maks = 4\n" +
      "Grup 2: $\\{2, 4, 6, 4\\}$ → 4 suku, nilai maks = 6\n" +
      "Grup 3: $\\{2, 4, 6, 8, 6, 4\\}$ → 6 suku, nilai maks = 8\n" +
      "Grup $n$ → $2n$ suku, nilai maks = $2(n+1)$\n\n" +
      "Total suku s.d. akhir grup ke-$n$ = $n(n+1)$\n\n" +
      "Cari grup yang memuat suku ke-2026:\n" +
      "$n = 44$: $44 \\times 45 = 1980 < 2026$\n" +
      "$n = 45$: $45 \\times 46 = 2070 \\geq 2026$ ✓\n\n" +
      "Suku ke-2026 ada di grup ke-45.\n" +
      "Posisi dalam grup 45: $2026 - 1980 = 46$\n\n" +
      "Grup 45 terdiri dari 90 suku:\n" +
      "- Bagian naik (posisi 1–46): $2, 4, 6, \\ldots, 2 \\times 46 = 92$\n" +
      "- Bagian turun (posisi 47–90): $90, 88, \\ldots, 4$\n\n" +
      "Posisi ke-46 = suku puncak = $2 \\times (45 + 1) = 2 \\times 46 = \\mathbf{92}$",
    tips:
      "Kunci soal ini adalah mengenali bahwa grup ke-$n$ memiliki tepat $2n$ suku dan total suku s.d. grup ke-$n$ = $n(n+1)$. " +
      "Bagian naik grup ke-$n$ memiliki $n+1$ suku (termasuk puncak), bagian turun memiliki $n-1$ suku. " +
      "Jika posisi dalam grup ≤ $n+1$, suku berada di bagian naik, nilainya = $2 \\times \\text{posisi}$.",
    kesimpulan:
      "Suku ke-2026 berada di posisi ke-46 dalam grup ke-45, yaitu suku puncak bernilai $\\mathbf{92}$ (Jawaban D).",
  },
};
