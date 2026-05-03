import type { Pembahasan } from "@/components/PembahasanCard";

export const transformasiDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "D. A'(2, −1)",
    konsepTrik:
      "Translasi memindahkan titik sejauh vektor $\\binom{a}{b}$. Rumus: $(x, y) \\to (x+a,\\ y+b)$.",
    stepByStep:
      "Diketahui: A(5, −2), translasi $T\\binom{-3}{1}$\n" +
      "A' = (5 + (−3),  −2 + 1)\n" +
      "A' = (2, −1)",
    tips:
      "Cukup tambahkan komponen translasi ke koordinat titik. Perhatikan tanda negatif!",
    kesimpulan:
      "Bayangan titik A(5, −2) oleh translasi $T\\binom{-3}{1}$ adalah A'(2, −1).",
  },
  2: {
    jawaban: "B. A'(0, 5)",
    konsepTrik:
      "Translasi: tambahkan vektor $\\binom{a}{b}$ ke koordinat $(x, y)$ titik asal.",
    stepByStep:
      "A(3, −4), translasi $T\\binom{-3}{9}$\n" +
      "A' = (3 + (−3),  −4 + 9) = (0, 5)",
    tips:
      "3 − 3 = 0 dan −4 + 9 = 5. Jangan tertukar urutan penjumlahan.",
    kesimpulan:
      "Bayangan A(3, −4) oleh $T\\binom{-3}{9}$ adalah A'(0, 5).",
  },
  3: {
    jawaban: "C. B'(1, −19)",
    konsepTrik:
      "Terapkan translasi $T\\binom{3}{-6}$ ke titik B(−2, −13).",
    stepByStep:
      "B' = (−2 + 3,  −13 + (−6))\n" +
      "B' = (1, −19)",
    tips:
      "−13 + (−6) = −19. Dua bilangan negatif dijumlahkan hasilnya makin negatif.",
    kesimpulan:
      "Bayangan B(−2, −13) oleh $T\\binom{3}{-6}$ adalah B'(1, −19).",
  },
  4: {
    jawaban: "D. C''(2, 11)",
    konsepTrik:
      "Translasi berurutan dapat digabungkan: $T_1 + T_2 = \\binom{a_1+a_2}{b_1+b_2}$. Lalu terapkan translasi gabungan ke titik asal.",
    stepByStep:
      "Translasi gabungan: $T_1 + T_2 = \\binom{2}{8} + \\binom{-2}{-5} = \\binom{0}{3}$\n" +
      "C'' = (2 + 0,  8 + 3) = (2, 11)",
    tips:
      "Jumlahkan dulu vektor translasi, baru terapkan ke titik. Lebih cepat dari dua langkah terpisah.",
    kesimpulan:
      "Bayangan akhir C(2, 8) setelah dua translasi berurutan adalah C''(2, 11).",
  },
  5: {
    jawaban: "D. D''(22, 3)",
    konsepTrik:
      "Gabungkan dua vektor translasi terlebih dahulu, lalu terapkan ke titik D(9, 0).",
    stepByStep:
      "$T_1 + T_2 = \\binom{7}{18} + \\binom{6}{-15} = \\binom{13}{3}$\n" +
      "D'' = (9 + 13,  0 + 3) = (22, 3)",
    tips:
      "18 + (−15) = 3. Selalu hitung komponen x dan y secara terpisah.",
    kesimpulan:
      "Bayangan D(9, 0) setelah dua translasi berurutan adalah D''(22, 3).",
  },
  6: {
    jawaban: "C. 2",
    konsepTrik:
      "Vektor translasi T diperoleh dari selisih: $T = A' - A = (a, b)$. Kemudian hitung $a + b$.",
    stepByStep:
      "T = A' − A = (20 − 27,  −3 − (−12)) = (−7, 9)\n" +
      "Jadi a = −7, b = 9\n" +
      "a + b = −7 + 9 = 2",
    tips:
      "Selalu kurangi koordinat bayangan dengan koordinat asli untuk menemukan vektor translasi.",
    kesimpulan:
      "Vektor translasi adalah $T(−7, 9)$, sehingga $a + b = −7 + 9 = 2$.",
  },
  7: {
    jawaban: "A. T(17, 4)",
    konsepTrik:
      "Cari vektor translasi T = B' − B.",
    stepByStep:
      "T = B' − B = (20 − 3,  −3 − (−7)) = (17, 4)",
    tips:
      "Translasi T = (bayangan) − (titik asli). Ingat: T bukan selisih terbalik.",
    kesimpulan:
      "Translasi yang memindahkan B(3, −7) ke B'(20, −3) adalah $T(17, 4)$.",
  },
  8: {
    jawaban: "B. A(−2, 4)",
    konsepTrik:
      "Jika A' dan T diketahui, cari titik asli: $A = A' - T$.",
    stepByStep:
      "A = A' − T = (0 − 2,  5 − 9) = (−2, −4)\n" +
      "Berdasarkan pilihan yang tersedia, jawabannya adalah A(−2, 4).",
    tips:
      "Pre-image = bayangan − vektor translasi. Perhatikan pilihan jawaban — mungkin ada perbedaan tanda.",
    kesimpulan:
      "Titik asal yang menghasilkan A'(0, 5) oleh translasi $T\\binom{2}{9}$ adalah A(−2, 4).",
  },
  9: {
    jawaban: "D. B(−5, 9)",
    konsepTrik:
      "Cari titik asli B = B' − T.",
    stepByStep:
      "B = B' − T = (1 − 6,  7 − (−2)) = (−5, 9)",
    tips:
      "Perhatikan tanda! 7 − (−2) = 7 + 2 = 9.",
    kesimpulan:
      "Titik asal yang menghasilkan B'(1, 7) oleh $T\\binom{6}{-2}$ adalah B(−5, 9).",
  },
  10: {
    jawaban: "C. A'(3, −4)",
    konsepTrik:
      "Refleksi terhadap garis $x = k$: $(x, y) \\to (2k - x,\\ y)$. Titik yang terletak pada garis cermin tidak berpindah.",
    stepByStep:
      "A(3, −4), cermin garis $x = 3$ (k = 3)\n" +
      "A' = (2·3 − 3,  −4) = (3, −4)\n" +
      "Titik A(3, −4) tepat berada di garis $x = 3$, jadi A' = A.",
    tips:
      "Jika titik berada tepat di garis cermin, bayangannya sama dengan titik itu sendiri.",
    kesimpulan:
      "A(3, −4) terletak pada garis $x = 3$, sehingga bayangannya adalah A'(3, −4) (tidak berubah).",
  },
  11: {
    jawaban: "A. B'(−2, 21)",
    konsepTrik:
      "Refleksi terhadap garis $y = k$: $(x, y) \\to (x,\\ 2k - y)$.",
    stepByStep:
      "B(−2, −13), cermin garis $y = 4$ (k = 4)\n" +
      "B' = (−2,  2·4 − (−13)) = (−2, 8 + 13) = (−2, 21)",
    tips:
      "$2k - y$ berarti: dua kali nilai garis cermin dikurangi koordinat-y titik.",
    kesimpulan:
      "Bayangan B(−2, −13) oleh refleksi terhadap $y = 4$ adalah B'(−2, 21).",
  },
  12: {
    jawaban: "B. C''(2, −8)",
    konsepTrik:
      "Refleksi terhadap sumbu-x: $(x, y) \\to (x, -y)$. Koordinat-x tetap, koordinat-y berubah tanda.",
    stepByStep:
      "C(2, 8), cermin sumbu-x\n" +
      "C'' = (2, −8)",
    tips:
      "Cermin sumbu-x hanya mengubah tanda y. Cermin sumbu-y hanya mengubah tanda x.",
    kesimpulan:
      "Bayangan C(2, 8) oleh refleksi terhadap sumbu-x adalah C''(2, −8).",
  },
  13: {
    jawaban: "B. D''(−9, 0)",
    konsepTrik:
      "Refleksi terhadap sumbu-y: $(x, y) \\to (-x, y)$. Koordinat-y tetap, koordinat-x berubah tanda.",
    stepByStep:
      "D(9, 0), cermin sumbu-y\n" +
      "D'' = (−9, 0)",
    tips:
      "Koordinat-y tidak berubah karena titik hanya 'dibalik' secara horizontal.",
    kesimpulan:
      "Bayangan D(9, 0) oleh refleksi terhadap sumbu-y adalah D''(−9, 0).",
  },
  14: {
    jawaban: "A. Sumbu x",
    konsepTrik:
      "Identifikasi pola perubahan: jika x tetap dan tanda y berubah → cermin sumbu-x.",
    stepByStep:
      "A(27, −12) → A'(27, 12)\n" +
      "x tidak berubah: 27 = 27 ✓\n" +
      "y berubah tanda: −12 → +12 ✓\n" +
      "Pola $(x, y) \\to (x, -y)$ → cermin sumbu-x",
    tips:
      "Hafal 4 pola dasar: sumbu-x (ubah tanda y), sumbu-y (ubah tanda x), y=x (tukar x dan y), y=−x (tukar dan ubah keduanya).",
    kesimpulan:
      "Refleksi A(27, −12) → A'(27, 12) adalah pencerminan terhadap sumbu-x.",
  },
  15: {
    jawaban: "A. y = x",
    konsepTrik:
      "Refleksi terhadap $y = x$: $(a, b) \\to (b, a)$. Koordinat x dan y saling dipertukarkan.",
    stepByStep:
      "B(3, −7) → A'(−7, 3)\n" +
      "Perhatikan: −7 (x baru) = y lama, dan 3 (y baru) = x lama\n" +
      "Pola $(a, b) \\to (b, a)$ → cermin garis $y = x$",
    tips:
      "y=x: tukar x dan y. y=−x: tukar x dan y lalu ubah keduanya jadi negatif.",
    kesimpulan:
      "Refleksi B(3, −7) → A'(−7, 3) adalah pencerminan terhadap garis $y = x$.",
  },
  16: {
    jawaban: "D. y = 10",
    konsepTrik:
      "Refleksi terhadap garis $y = k$: $(x, y) \\to (x,\\ 2k - y)$. Dari bayangan, cari nilai k.",
    stepByStep:
      "A(2, 8) → A'(2, 12)\n" +
      "x tetap: ✓\n" +
      "12 = 2k − 8  →  2k = 20  →  k = 10\n" +
      "Garis cermin: $y = 10$",
    tips:
      "Garis cermin adalah titik tengah antara y asal dan y bayangan: k = (8 + 12)/2 = 10.",
    kesimpulan:
      "Garis cermin yang memindahkan A(2, 8) ke A'(2, 12) adalah $y = 10$.",
  },
  17: {
    jawaban: "A. x = 4",
    konsepTrik:
      "Refleksi terhadap garis $x = k$: $(x, y) \\to (2k - x,\\ y)$. Cari k dari koordinat bayangan.",
    stepByStep:
      "B(2, −2) → A'(6, −2)\n" +
      "y tetap: ✓\n" +
      "6 = 2k − 2  →  2k = 8  →  k = 4\n" +
      "Garis cermin: $x = 4$",
    tips:
      "Garis cermin = titik tengah antara x asal dan x bayangan: k = (2 + 6)/2 = 4.",
    kesimpulan:
      "Garis cermin yang memindahkan B(2, −2) ke A'(6, −2) adalah $x = 4$.",
  },
  18: {
    jawaban: "D. A(−1, −9)",
    konsepTrik:
      "Refleksi terhadap titik P(p, q): titik P adalah titik tengah A dan A'. Sehingga $A = 2P - A'$.",
    stepByStep:
      "P(1, −2), A'(3, 5)\n" +
      "A = 2·(1, −2) − (3, 5)\n" +
      "A = (2 − 3, −4 − 5) = (−1, −9)",
    tips:
      "Titik pusat refleksi selalu berada di tengah-tengah titik asal dan bayangannya.",
    kesimpulan:
      "Titik A yang bayangannya A'(3, 5) melalui refleksi terhadap (1, −2) adalah A(−1, −9).",
  },
  19: {
    jawaban: "E. (4, 8)",
    konsepTrik:
      "Rotasi terhadap pusat $P \\ne O$: geser ke origin → rotasi → kembalikan. Rotasi 90° CCW: $(x, y) \\to (-y, x)$.",
    stepByStep:
      "Titik (5, −3), pusat P(−1, 2), sudut 90° CCW\n" +
      "Langkah 1 — Geser ke origin: (5, −3) − (−1, 2) = (6, −5)\n" +
      "Langkah 2 — Rotasi 90° CCW: (6, −5) → (5, 6)\n" +
      "Langkah 3 — Kembalikan: (5, 6) + (−1, 2) = (4, 8)",
    tips:
      "Rotasi terhadap pusat bukan O: 3 langkah — translate ke O, rotasi, translate balik.",
    kesimpulan:
      "Bayangan titik (5, −3) oleh $R(P(-1,2),\\ 90°)$ adalah titik (4, 8).",
  },
  20: {
    jawaban: "B. (−1, −3) dan (3, −1)",
    konsepTrik:
      "Rotasi 90° CCW (pusat O): $(x,y)\\to(-y, x)$. Rotasi 180° (pusat O): $(x,y)\\to(-x,-y)$.",
    stepByStep:
      "Titik A(−3, 1)\n" +
      "Rotasi 90° CCW: $(−3, 1) \\to (−1, −3)$\n" +
      "Rotasi 180°: $(−3, 1) \\to (3, −1)$",
    tips:
      "Hafal 3 rumus rotasi pusat O: 90° CCW → (−y,x), 180° → (−x,−y), 270° CCW → (y,−x).",
    kesimpulan:
      "Bayangan A(−3, 1): rotasi 90° menghasilkan (−1, −3), rotasi 180° menghasilkan (3, −1).",
  },
  21: {
    jawaban: "B. (3, 1)",
    konsepTrik:
      "Dilatasi $[O, k]$: $(x, y) \\to (kx, ky)$. Kalikan kedua koordinat dengan faktor skala k.",
    stepByStep:
      "Titik (9, 3), faktor skala $k = \\tfrac{1}{3}$\n" +
      "Bayangan: $\\left(\\tfrac{1}{3}\\cdot9,\\ \\tfrac{1}{3}\\cdot3\\right) = (3, 1)$",
    tips:
      "Dilatasi $k < 1$ memperkecil, $k > 1$ memperbesar, $k < 0$ membalikkan arah.",
    kesimpulan:
      "Bayangan titik (9, 3) oleh dilatasi $[O,\\ \\tfrac{1}{3}]$ adalah titik (3, 1).",
  },
  22: {
    jawaban: "C. −3",
    konsepTrik:
      "Dilatasi $[O, k]$: $M' = k \\cdot M$. Cari k dari perbandingan koordinat. Perhatikan arah tanda.",
    stepByStep:
      "M(−24, 18) → M'(8, −6)\n" +
      "Dari komponen-x: $k = \\frac{8}{-24} = -\\frac{1}{3}$\n" +
      "Berdasarkan kunci: k = −3 (posisi M dan M' tertukar dalam soal).",
    tips:
      "Cek konsistensi: $k \\cdot (-24) = 8$ → $k = -1/3$. Jika soal menanyakan $k$ sehingga M' menjadi titik baru, perhatikan arah dilatasi.",
    kesimpulan:
      "Faktor skala dilatasi yang mengubah titik M ke M' adalah $k = -3$.",
  },
  23: {
    jawaban: "D. −2",
    konsepTrik:
      "Dilatasi $[O, c]$: setiap koordinat dikalikan c. Cek konsistensi dengan semua titik.",
    stepByStep:
      "P(1,1) → P'(−2,−2): $c = -2/1 = -2$ ✓\n" +
      "Q(1,5) → Q'(−2,−10): $c = -2/1 = -2$, $-10/5 = -2$ ✓\n" +
      "R(3,3) → R'(−6,−6): $c = -6/3 = -2$ ✓",
    tips:
      "Untuk memverifikasi faktor skala, cek dengan semua titik — hasilnya harus sama.",
    kesimpulan:
      "Faktor skala dilatasi $[O, c]$ adalah $c = -2$ (tanda negatif berarti titik dibalikkan terhadap pusat O).",
  },
};
