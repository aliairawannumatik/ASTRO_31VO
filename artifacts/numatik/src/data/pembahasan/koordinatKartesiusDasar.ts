import type { Pembahasan } from "@/components/PembahasanCard";

export const koordinatKartesiusDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "A. Titik A (sesuai gambar)",
    konsepTrik:
      "Pasangan koordinat $(x, y)$ dibaca dengan $x$ dahulu (jarak horizontal dari sumbu-Y) lalu $y$ (jarak vertikal dari sumbu-X).",
    stepByStep:
      "Titik berkoordinat $(1, 3)$ berarti:\n• Bergeser $1$ satuan ke kanan dari sumbu-Y\n• Bergeser $3$ satuan ke atas dari sumbu-X\nLetaknya di kuadran I.\nIdentifikasi titik pada gambar yang berada di posisi tersebut.",
    tips:
      "Selalu baca koordinat dalam urutan (absis, ordinat) atau (x, y).",
    kesimpulan:
      "Titik dengan koordinat $(1, 3)$ adalah titik yang ditunjukkan pada gambar (sesuai kunci A).",
  },
  2: {
    jawaban: "B. $(3, -1)$ (sesuai gambar)",
    konsepTrik:
      "Untuk titik di kuadran IV: $x$ positif dan $y$ negatif.",
    stepByStep:
      "Bacalah posisi titik Q pada gambar:\n• Hitung jarak horizontal dari sumbu-Y\n• Hitung jarak vertikal dari sumbu-X dengan tanda yang sesuai (atas = positif, bawah = negatif)\nSesuai gambar, $Q = (3, -1)$.",
    tips:
      "Periksa kuadran tempat titik berada untuk membantu menentukan tanda koordinat.",
    kesimpulan:
      "Koordinat titik $Q$ adalah $(3, -1)$.",
  },
  3: {
    jawaban: "B. $B(5, 4)$",
    konsepTrik:
      "Cocokkan setiap pilihan koordinat dengan posisi titik berlabel pada gambar.",
    stepByStep:
      "Periksa setiap titik pada gambar dan bandingkan dengan opsi.\nMenurut posisi pada gambar, titik B berada di koordinat $(5, 4)$ — kuadran I dengan absis $5$ dan ordinat $4$.",
    tips:
      "Titik di kuadran I memiliki kedua koordinat positif.",
    kesimpulan:
      "Koordinat yang sesuai dengan gambar adalah $B(5, 4)$.",
  },
  4: {
    jawaban: "C. $E(0, 0)$ dan $G(a, a)$",
    konsepTrik:
      "Pada persegi EFGH dengan sisi $a$ dan satu sudut di titik asal, sudut diagonal berseberangan berada di $(a, a)$.",
    stepByStep:
      "Bila $E$ di titik asal $(0, 0)$, maka:\n• $F$ di $(a, 0)$\n• $G$ di $(a, a)$ (sudut diagonal terhadap $E$)\n• $H$ di $(0, a)$\n$E$ dan $G$ adalah dua sudut diagonal, sehingga $G(a, a)$.",
    tips:
      "Titik diagonal dari $(0,0)$ pada persegi sisi $a$ selalu berada di $(a, a)$.",
    kesimpulan:
      "$E(0, 0)$ dan $G(a, a)$.",
  },
  5: {
    jawaban: "A. Kuadran II",
    konsepTrik:
      "Pembagian kuadran:\nI: $x > 0, y > 0$\nII: $x < 0, y > 0$\nIII: $x < 0, y < 0$\nIV: $x > 0, y < 0$",
    stepByStep:
      "$P(-5, 7)$: $x = -5 < 0$, $y = 7 > 0$.\n$x$ negatif dan $y$ positif → kuadran II.",
    tips:
      "Hapalkan urutan kuadran melawan jarum jam mulai dari kanan atas.",
    kesimpulan:
      "Titik $P(-5, 7)$ terletak di kuadran II.",
  },
  6: {
    jawaban: "D. Persegi panjang",
    konsepTrik:
      "Periksa panjang sisi sejajar dan sudut. Bila sepasang sisi sejajar memiliki panjang berbeda namun semua sudut $90°$, itu persegi panjang.",
    stepByStep:
      "$C(4, -3)$ dan $D(4, 1)$: $CD$ vertikal panjang $|1 - (-3)| = 4$.\nDari gambar, $A$ dan $B$ membentuk sisi sejajar dengan $CD$, dengan panjang $AB = 4$ pula.\n$AD$ horizontal dengan panjang berbeda dari $AB$.\nSemua sudut $90°$, sisi sejajar tidak sama panjang dengan sisi tetangganya → persegi panjang.",
    tips:
      "Persegi panjang: 2 pasang sisi sejajar sama panjang, semua sudut siku-siku.",
    kesimpulan:
      "Bangun ABCD adalah persegi panjang.",
  },
  7: {
    jawaban: "C. Segitiga sama kaki",
    konsepTrik:
      "Hitung panjang ketiga sisi dengan rumus jarak dua titik. Sama kaki bila tepat dua sisinya sama panjang.",
    stepByStep:
      "$M(0, 3), N(0, -3), O(7, 0)$.\n$MN = \\sqrt{0 + 36} = 6$\n$MO = \\sqrt{49 + 9} = \\sqrt{58}$\n$NO = \\sqrt{49 + 9} = \\sqrt{58}$\nKarena $MO = NO$, segitiga adalah sama kaki.",
    tips:
      "Untuk segitiga, hitung semua tiga sisi sebelum menyimpulkan jenisnya.",
    kesimpulan:
      "Segitiga $MNO$ adalah segitiga sama kaki.",
  },
  8: {
    jawaban: "C. Segitiga siku-siku",
    konsepTrik:
      "Sisi vertikal dan horizontal yang bertemu di satu titik membentuk sudut $90°$.",
    stepByStep:
      "$A(3, 1), B(3, 5), C(-2, 5)$.\n$AB$ vertikal (absis sama) panjang $|5 - 1| = 4$.\n$BC$ horizontal (ordinat sama) panjang $|3 - (-2)| = 5$.\n$AB \\perp BC$ di titik $B$ → siku-siku di $B$.",
    tips:
      "Dua titik dengan absis sama membentuk garis vertikal; dua titik dengan ordinat sama membentuk garis horizontal.",
    kesimpulan:
      "Segitiga $ABC$ adalah segitiga siku-siku di $B$.",
  },
  9: {
    jawaban: "D. $(4, 1)$",
    konsepTrik:
      "Untuk membentuk segitiga siku-siku dengan dua titik diketahui, titik ketiga sering kali memiliki absis dari satu titik dan ordinat dari titik lainnya.",
    stepByStep:
      "$P(4, 6), Q(7, 1)$. Pilih $R(4, 1)$:\n$PR$ vertikal: panjang $|6 - 1| = 5$\n$QR$ horizontal: panjang $|7 - 4| = 3$\n$PR \\perp QR$ di $R$ → siku-siku di $R$ ✓",
    tips:
      "Cara cepat: ambil $(x_P, y_Q)$ atau $(x_Q, y_P)$ untuk mendapatkan siku-siku.",
    kesimpulan:
      "Koordinat titik $R$ adalah $(4, 1)$.",
  },
  10: {
    jawaban: "B. Persegi panjang",
    konsepTrik:
      "Hitung panjang sisi-sisinya. Bila dua pasang sisi sejajar sama panjang dan sudut siku-siku, maka persegi panjang.",
    stepByStep:
      "$A(-2, 5), B(-2, 1), C(4, 1), D(4, 5)$.\n$AB$: vertikal, panjang $4$.\n$BC$: horizontal, panjang $6$.\n$CD$: vertikal, panjang $4$.\n$DA$: horizontal, panjang $6$.\nDua pasang sisi sejajar sama panjang, sisi bersebelahan tidak sama → persegi panjang.",
    tips:
      "Bila keempat sisinya sama panjang, hasilnya adalah persegi.",
    kesimpulan:
      "Bangun ABCD adalah persegi panjang.",
  },
  11: {
    jawaban: "D. Belah ketupat",
    konsepTrik:
      "Belah ketupat: keempat sisinya sama panjang, diagonalnya saling tegak lurus dan saling membagi dua.",
    stepByStep:
      "$A(-3, 5), B(-5, 1), C(-3, -3), D(-1, 1)$.\n$AB = \\sqrt{4 + 16} = \\sqrt{20}$\n$BC = \\sqrt{4 + 16} = \\sqrt{20}$\n$CD = \\sqrt{4 + 16} = \\sqrt{20}$\n$DA = \\sqrt{4 + 16} = \\sqrt{20}$\nKeempat sisinya sama → belah ketupat.\nDiagonal $AC$ vertikal dan $BD$ horizontal → saling tegak lurus.",
    tips:
      "Belah ketupat = jajar genjang dengan keempat sisi sama panjang.",
    kesimpulan:
      "Bangun ABCD adalah belah ketupat.",
  },
  12: {
    jawaban: "D. Belah ketupat",
    konsepTrik:
      "Sama dengan nomor 11: keempat sisinya sama panjang.",
    stepByStep:
      "Titik-titik identik dengan nomor 11.\n$AB = BC = CD = DA = \\sqrt{20}$\nKeempat sisi sama panjang → belah ketupat.",
    tips:
      "Persegi adalah kasus khusus belah ketupat dengan sudut $90°$.",
    kesimpulan:
      "Bangun ABCD adalah belah ketupat.",
  },
  13: {
    jawaban: "C. 5 satuan",
    konsepTrik:
      "Jarak titik $(x, y)$ ke sumbu-X adalah $|y|$.",
    stepByStep:
      "Titik $(-3, 5)$: jarak ke sumbu-X = $|5| = 5$ satuan.",
    tips:
      "Jarak ke sumbu-X gunakan ordinat; jarak ke sumbu-Y gunakan absis.",
    kesimpulan:
      "Jarak titik tersebut terhadap sumbu-X adalah $5$ satuan.",
  },
  14: {
    jawaban: "A. 4 satuan",
    konsepTrik:
      "Jarak titik $(x, y)$ ke sumbu-Y adalah $|x|$.",
    stepByStep:
      "Titik $(-4, -5)$: jarak ke sumbu-Y = $|-4| = 4$ satuan.",
    tips:
      "Tanda koordinat tidak memengaruhi jarak — gunakan harga mutlak.",
    kesimpulan:
      "Jarak titik tersebut terhadap sumbu-Y adalah $4$ satuan.",
  },
  15: {
    jawaban: "D. 5",
    konsepTrik:
      "Jarak titik $(x_0, y_0)$ ke garis vertikal $x = k$ adalah $|x_0 - k|$.",
    stepByStep:
      "$P(3, 5)$, garis $x = -2$.\nJarak = $|3 - (-2)| = |5| = 5$",
    tips:
      "Garis $x = k$ adalah garis vertikal; garis $y = k$ adalah garis horizontal.",
    kesimpulan:
      "Jarak titik $P$ ke garis $x = -2$ adalah $5$ satuan.",
  },
  16: {
    jawaban: "C. 10",
    konsepTrik:
      "Rumus jarak dua titik: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.",
    stepByStep:
      "$A(2, 3), B(10, -3)$.\n$d = \\sqrt{(10 - 2)^2 + (-3 - 3)^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10$",
    tips:
      "Hapalkan tripel Pythagoras seperti $6\\text{-}8\\text{-}10$ untuk hitungan cepat.",
    kesimpulan:
      "Jarak antara titik $A$ dan $B$ adalah $10$ satuan.",
  },
  17: {
    jawaban: "C. $(1, -3)$",
    konsepTrik:
      "Titik tengah segmen: $M = \\left(\\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2}\\right)$.",
    stepByStep:
      "$P(-2, 5), Q(4, -11)$.\n$M = \\left(\\dfrac{-2 + 4}{2}, \\dfrac{5 + (-11)}{2}\\right) = (1, -3)$",
    tips:
      "Titik tengah = rata-rata absis dan rata-rata ordinat.",
    kesimpulan:
      "Koordinat titik $R$ (titik tengah $PQ$) adalah $(1, -3)$.",
  },
  18: {
    jawaban: "B. $(6, 6)$",
    konsepTrik:
      "Rata-rata kedua titik untuk mendapat titik tengah.",
    stepByStep:
      "$A(2, 8), B(10, 4)$.\nTitik tengah = $\\left(\\dfrac{2 + 10}{2}, \\dfrac{8 + 4}{2}\\right) = (6, 6)$",
    tips:
      "Periksa hasil dengan memastikan kedua jarak ke A dan B sama.",
    kesimpulan:
      "Titik tengahnya adalah $(6, 6)$.",
  },
  19: {
    jawaban: "B. $(2, -7)$",
    konsepTrik:
      "Bila $M$ titik tengah $PQ$, maka $Q = 2M - P$ (refleksi $P$ terhadap $M$).",
    stepByStep:
      "$M(5, -2), P(8, 3)$.\n$Q = (2 \\cdot 5 - 8, 2 \\cdot (-2) - 3) = (2, -7)$",
    tips:
      "Untuk mencari ujung lain: kalikan dua titik tengah, kurangi titik yang diketahui.",
    kesimpulan:
      "Koordinat titik $Q$ adalah $(2, -7)$.",
  },
  20: {
    jawaban: "C. $(7, -7)$",
    konsepTrik:
      "$B = 2M - A$ untuk menentukan ujung lain dari ruas garis.",
    stepByStep:
      "$M(4, -1), A(1, 5)$.\n$B = (2 \\cdot 4 - 1, 2 \\cdot (-1) - 5) = (7, -7)$",
    tips:
      "Cek: titik tengah $A(1,5)$ dan $B(7,-7)$ = $(4, -1) = M$ ✓.",
    kesimpulan:
      "Koordinat titik $B$ adalah $(7, -7)$.",
  },
  21: {
    jawaban: "C. 5",
    konsepTrik:
      "Cari titik tengah $M$ dulu, lalu hitung jaraknya ke garis vertikal.",
    stepByStep:
      "$A(1, 1), B(3, 5)$.\n$M = \\left(\\dfrac{1 + 3}{2}, \\dfrac{1 + 5}{2}\\right) = (2, 3)$\nJarak $M$ ke garis $x = 7$: $|2 - 7| = 5$",
    tips:
      "Selesaikan langkah demi langkah: titik tengah dulu, jarak kemudian.",
    kesimpulan:
      "Jarak titik $M$ ke garis $x = 7$ adalah $5$ satuan.",
  },
  22: {
    jawaban: "B. 10",
    konsepTrik:
      "Rumus luas segitiga dari koordinat:\n$L = \\dfrac{1}{2}|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|$",
    stepByStep:
      "$P(0, 0), Q(6, 4), R(8, 2)$.\n$L = \\dfrac{1}{2}|0(4 - 2) + 6(2 - 0) + 8(0 - 4)|$\n$= \\dfrac{1}{2}|0 + 12 - 32| = \\dfrac{1}{2}(20) = 10$",
    tips:
      "Disebut juga rumus shoelace; tanda mutlak penting agar hasil positif.",
    kesimpulan:
      "Luas segitiga $PQR$ adalah $10$ satuan luas.",
  },
  23: {
    jawaban: "D. 4",
    konsepTrik:
      "Gunakan rumus jarak: $\\sqrt{(x - x_Q)^2 + (y - y_Q)^2} = 10$.",
    stepByStep:
      "$P(x, 5), Q(-4, -1)$, jarak = $10$.\n$(x + 4)^2 + (5 + 1)^2 = 100$\n$(x + 4)^2 + 36 = 100$\n$(x + 4)^2 = 64$\n$x + 4 = \\pm 8$\n$x = 4$ atau $x = -12$",
    tips:
      "Akar kuadrat selalu memberi dua kemungkinan: positif dan negatif.",
    kesimpulan:
      "Salah satu nilai $x$ yang mungkin adalah $4$.",
  },
  24: {
    jawaban: "B. 4",
    konsepTrik:
      "Rumus jarak titik $(x_1, y_1)$ ke garis $ax + by + c = 0$:\n$d = \\dfrac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}$",
    stepByStep:
      "$P(2, 5)$, garis $3x + 4y - 6 = 0$.\n$d = \\dfrac{|3(2) + 4(5) - 6|}{\\sqrt{3^2 + 4^2}} = \\dfrac{|6 + 20 - 6|}{\\sqrt{25}} = \\dfrac{20}{5} = 4$",
    tips:
      "Penyebut $\\sqrt{a^2 + b^2}$; sering disederhanakan menjadi $5$ untuk koefisien $3, 4$.",
    kesimpulan:
      "Jarak tegak lurus dari $P$ ke garis tersebut adalah $4$ satuan.",
  },
  25: {
    jawaban: "B. Tiga langkah ke kanan dan enam langkah ke bawah",
    konsepTrik:
      "Posisi relatif terhadap titik acuan: $T_D = (x_T - x_D, y_T - y_D)$.",
    stepByStep:
      "Titik $(3, -5)$ relatif terhadap acuan $(0, 1)$:\n$(3 - 0, -5 - 1) = (3, -6)$\nArtinya: $3$ langkah ke kanan (x positif) dan $6$ langkah ke bawah (y negatif).",
    tips:
      "Tanda positif $x$ = kanan, negatif $x$ = kiri; positif $y$ = atas, negatif $y$ = bawah.",
    kesimpulan:
      "Posisi relatifnya: tiga langkah ke kanan dan enam langkah ke bawah.",
  },
};
