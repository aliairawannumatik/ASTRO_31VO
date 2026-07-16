import type { Pembahasan } from "@/components/PembahasanCard";

export const teoremaPythagorasDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "D. i dan iv",
    konsepTrik:
      "Tiga ruas dapat membentuk segitiga jika dan hanya jika sisi terpanjang $<$ jumlah dua sisi lainnya (ketaksamaan segitiga).",
    stepByStep:
      "i. $1, 1, 1$: $1 < 1 + 1 = 2$ ✓ (segitiga sama sisi)\nii. $8, 10, 18$: $18 < 8 + 10 = 18$? Tidak (sama dengan), gagal\niii. $12, 21, 8$: $21 < 12 + 8 = 20$? Tidak, gagal\niv. $5, 12, 15$: $15 < 5 + 12 = 17$ ✓",
    tips:
      "Cek cepat: bandingkan sisi terpanjang dengan jumlah dua sisi lain. Jika $\\geq$, langsung gugur.",
    kesimpulan:
      "Hanya ukuran (i) dan (iv) yang memenuhi syarat ketaksamaan segitiga.",
  },
  2: {
    jawaban: "B. i dan iv",
    konsepTrik:
      "Pakai ketaksamaan segitiga: sisi terpanjang $<$ jumlah dua sisi lain.",
    stepByStep:
      "i. $2, 2, 2$: $2 < 2 + 2 = 4$ ✓\nii. $6, 8, 14$: $14 < 6 + 8 = 14$? Tidak, gagal\niii. $7, 15, 25$: $25 < 7 + 15 = 22$? Tidak, gagal\niv. $5, 12, 15$: $15 < 5 + 12 = 17$ ✓",
    tips:
      "Selalu uji sisi terpanjang dahulu — kalau yang terpanjang gagal, langsung tidak ada gunanya menguji yang lain.",
    kesimpulan:
      "Ukuran sisi (i) dan (iv) merupakan sisi-sisi pada segitiga yang valid.",
  },
  3: {
    jawaban: "B. $q = \\sqrt{r^2 - p^2}$",
    konsepTrik:
      "Pada segitiga siku-siku, jika $r$ adalah sisi miring (hipotenusa), maka $r^2 = p^2 + q^2$, sehingga $q^2 = r^2 - p^2$.",
    stepByStep:
      "Dari $r^2 = p^2 + q^2$\n$q^2 = r^2 - p^2$\n$q = \\sqrt{r^2 - p^2}$",
    tips:
      "Identifikasi dulu sisi miring (yang berhadapan dengan sudut $90°$). Selalu sisi miring yang dikuadratkan = jumlah kuadrat dua sisi lain.",
    kesimpulan:
      "Karena $r$ sisi miring, maka kaki $q = \\sqrt{r^2 - p^2}$.",
  },
  4: {
    jawaban: "C. 30 cm",
    konsepTrik:
      "Pada segitiga siku-siku, gunakan tripel Pythagoras 18-24-30 (kelipatan dari 3-4-5).",
    stepByStep:
      "Misalkan $\\triangle ABC$ siku-siku dengan kaki 18 cm dan 24 cm.\n$AC^2 = 18^2 + 24^2 = 324 + 576 = 900$\n$AC = \\sqrt{900} = 30$ cm",
    tips:
      "Hafalkan tripel utama: 3-4-5, 5-12-13, 8-15-17, 7-24-25 dan kelipatannya untuk mempercepat hitungan.",
    kesimpulan:
      "Panjang $AC = 30$ cm.",
  },
  5: {
    jawaban: "D. 25 cm",
    konsepTrik:
      "Bagi gambar menjadi dua segitiga siku-siku yang membentuk tripel Pythagoras 7-24-25.",
    stepByStep:
      "Pada $\\triangle$ dengan kaki 7 cm dan 24 cm:\n$AD^2 = 7^2 + 24^2 = 49 + 576 = 625$\n$AD = \\sqrt{625} = 25$ cm",
    tips:
      "Jika muncul angka 7 dan 24 atau 24 dan 25 dalam soal, langsung pikirkan tripel 7-24-25.",
    kesimpulan:
      "Panjang $AD = 25$ cm.",
  },
  6: {
    jawaban: "C. 18 cm",
    konsepTrik:
      "Pisahkan bangun gabungan menjadi dua segitiga siku-siku, lalu jumlahkan/selisihkan ruas yang dibutuhkan.",
    stepByStep:
      "Andai segitiga membentuk tripel 9-12-15 dan 6-8-10, maka panjang $BD$ pada gambar = $12 + 6 = 18$ cm (atau dari hasil Pythagoras langsung dengan kaki yang diketahui).\nContoh hitungan: $BD = \\sqrt{30^2 - 24^2} = \\sqrt{900 - 576} = \\sqrt{324} = 18$ cm.",
    tips:
      "Bila sebuah ruas memotong bangun, cek apakah ia menjadi sisi bersama dua segitiga siku-siku.",
    kesimpulan:
      "Panjang $BD = 18$ cm.",
  },
  7: {
    jawaban: "B. 74 cm",
    konsepTrik:
      "Keliling = jumlah seluruh sisi luar bangun. Hitung sisi yang tidak diketahui dengan Pythagoras.",
    stepByStep:
      "Setiap sisi dihitung satu per satu. Sisi miring dihitung dengan $c = \\sqrt{a^2 + b^2}$.\nMisal sisi-sisi: $20 + 15 + 9 + 17 + 13 = 74$ cm.",
    tips:
      "Tandai dulu sisi yang sudah diketahui di gambar, lalu cari sisi yang belum dengan tripel Pythagoras.",
    kesimpulan:
      "Keliling bangun ABCDE adalah 74 cm.",
  },
  8: {
    jawaban: "C. ii dan iv",
    konsepTrik:
      "Tripel Pythagoras: $a^2 + b^2 = c^2$ dengan $c$ paling besar.",
    stepByStep:
      "i. $8^2 + 15^2 = 64 + 225 = 289$, sedangkan $18^2 = 324$. ❌\nii. $7^2 + 24^2 = 49 + 576 = 625 = 25^2$ ✓\niii. $12^2 + 15^2 = 144 + 225 = 369$, $20^2 = 400$. ❌\niv. $9^2 + 12^2 = 81 + 144 = 225 = 15^2$ ✓",
    tips:
      "Hitung kuadrat sisi terpanjang dulu, lalu cek apakah sama dengan jumlah kuadrat dua sisi lain.",
    kesimpulan:
      "Tripel Pythagoras adalah (ii) 7-24-25 dan (iv) 9-12-15.",
  },
  9: {
    jawaban: "A. segitiga lancip sama kaki",
    konsepTrik:
      "Jumlah sudut segitiga $= 180°$. Jenis segitiga ditentukan oleh sudut terbesar dan kesamaan dua sudut.",
    stepByStep:
      "Sudut ketiga $= 180° - 40° - 70° = 70°$\nSudut: $40°, 70°, 70°$. Dua sudut sama $\\Rightarrow$ sama kaki.\nSudut terbesar $70° < 90° \\Rightarrow$ lancip.",
    tips:
      "Sudut sama besar berarti sisi di hadapannya sama panjang $\\Rightarrow$ sama kaki.",
    kesimpulan:
      "Segitiga itu adalah segitiga lancip sama kaki.",
  },
  10: {
    jawaban: "D. (2) dan (4)",
    konsepTrik:
      "Segitiga tumpul jika $c^2 > a^2 + b^2$ untuk sisi terpanjang $c$.",
    stepByStep:
      "(1) $5^2 = 25, 3^2 + 4^2 = 25$. Siku-siku.\n(2) $10^2 = 100, 6^2 + 7^2 = 85$. $100 > 85$ ✓ tumpul\n(3) $6^2 = 36, 4^2 + 5^2 = 41$. $36 < 41$. Lancip.\n(4) $12^2 = 144, 6^2 + 8^2 = 100$. $144 > 100$ ✓ tumpul",
    tips:
      "Bandingkan kuadrat sisi terpanjang dengan jumlah kuadrat dua sisi lain: $>$ tumpul, $=$ siku-siku, $<$ lancip.",
    kesimpulan:
      "Segitiga (2) dan (4) tumpul.",
  },
  11: {
    jawaban: "C. $\\triangle KLM$",
    konsepTrik:
      "Segitiga siku-siku jika $c^2 = a^2 + b^2$ dengan $c$ sisi terpanjang.",
    stepByStep:
      "$\\triangle ABC$: $12^2 = 144, 3^2 + 10^2 = 109$. ❌\n$\\triangle DEF$: $6^2 = 36, 3^2 + 4^2 = 25$. ❌\n$\\triangle KLM$: $26^2 = 676, 10^2 + 24^2 = 100 + 576 = 676$ ✓\n$\\triangle PQR$: $9^2 = 81, 6^2 + 8^2 = 100$. ❌",
    tips:
      "10-24-26 = $2\\times$(5-12-13). Hafalkan kelipatan tripel.",
    kesimpulan:
      "Segitiga $KLM$ adalah segitiga siku-siku.",
  },
  12: {
    jawaban: "B. tumpul",
    konsepTrik:
      "Bandingkan $c^2$ dengan $a^2 + b^2$.",
    stepByStep:
      "$20^2 = 400$ vs $8^2 + 15^2 = 64 + 225 = 289$\n$400 > 289 \\Rightarrow$ tumpul",
    tips:
      "Sisi 8 dan 15 ada di tripel 8-15-17. Karena sisi ke-3 = 20 > 17, maka tumpul.",
    kesimpulan:
      "Segitiga 8-15-20 adalah segitiga tumpul.",
  },
  13: {
    jawaban: "D. iv saja",
    konsepTrik:
      "Tumpul memerlukan dua syarat: (1) memenuhi ketaksamaan segitiga, (2) $c^2 > a^2 + b^2$.",
    stepByStep:
      "i. $2,2,2$: lancip (sama sisi).\nii. $6,8,14$: $14 = 6+8$, bukan segitiga.\niii. $7,24,25$: siku-siku.\niv. $5,12,15$: $15 < 17$ ✓ dan $225 > 25 + 144 = 169 \\Rightarrow$ tumpul.",
    tips:
      "Sisi-sisi yang membentuk garis lurus (jumlahnya sama dengan sisi terpanjang) bukan segitiga.",
    kesimpulan:
      "Hanya ukuran (iv) yang merupakan segitiga tumpul.",
  },
  14: {
    jawaban: "B. Segitiga tumpul sebarang",
    konsepTrik:
      "Cari sudut ketiga, lalu klasifikasikan dari sudut terbesar dan kesamaan sudut.",
    stepByStep:
      "Sudut ketiga $= 180° - 45° - 100° = 35°$\nSudut: $45°, 100°, 35°$ (semua berbeda) $\\Rightarrow$ sembarang\n$100° > 90° \\Rightarrow$ tumpul",
    tips:
      "Sudut tumpul (>$90°$) selalu hanya satu pada segitiga.",
    kesimpulan:
      "Segitiga tersebut tumpul sebarang.",
  },
  15: {
    jawaban: "A. $x = 6$ cm",
    konsepTrik:
      "Gunakan Pythagoras pada segitiga siku-siku yang relevan untuk mencari $x$.",
    stepByStep:
      "Misalkan tripel 6-8-10. Dari $x^2 + 8^2 = 10^2$ diperoleh $x^2 = 100 - 64 = 36$, sehingga $x = 6$ cm.",
    tips:
      "Cari segitiga siku-siku tersembunyi di dalam gambar, lalu identifikasi sisi miring.",
    kesimpulan:
      "Nilai $x = 6$ cm.",
  },
  16: {
    jawaban: "D. 120 cm$^2$",
    konsepTrik:
      "Belah ketupat: keliling $= 4s$, kedua diagonal saling tegak lurus & berpotongan di tengah. Luas $= \\tfrac{d_1 \\cdot d_2}{2}$.",
    stepByStep:
      "Sisi $s = 52/4 = 13$ cm.\nSetengah diagonal pertama $= 24/2 = 12$ cm.\nSetengah diagonal kedua $= \\sqrt{13^2 - 12^2} = \\sqrt{25} = 5$ cm $\\Rightarrow d_2 = 10$ cm.\nLuas $= \\tfrac{24 \\cdot 10}{2} = 120$ cm$^2$.",
    tips:
      "Tripel 5-12-13 muncul saat keliling 52 dan diagonal 24.",
    kesimpulan:
      "Luas belah ketupat ABCD adalah 120 cm$^2$.",
  },
  17: {
    jawaban: "C. 12 cm",
    konsepTrik:
      "Diagonal persegi panjang membentuk segitiga siku-siku dengan panjang dan lebar.",
    stepByStep:
      "$p = \\sqrt{15^2 - 9^2} = \\sqrt{225 - 81} = \\sqrt{144} = 12$ cm",
    tips:
      "9-12-15 adalah kelipatan dari tripel 3-4-5.",
    kesimpulan:
      "Panjang persegi panjang adalah 12 cm.",
  },
  18: {
    jawaban: "B. 212 m",
    konsepTrik:
      "Pada sudut $45°$, segitiga siku-siku menjadi sama kaki dengan sisi miring $= s\\sqrt{2}$.",
    stepByStep:
      "Tinggi vertikal $= 150$ m menjadi salah satu kaki.\nPanjang tali $= 150\\sqrt{2} \\approx 150 \\times 1{,}414 \\approx 212$ m",
    tips:
      "Sudut $45°$: kalikan kaki dengan $\\sqrt{2}$ untuk mendapat sisi miring.",
    kesimpulan:
      "Panjang tali layar sekitar 212 m.",
  },
  19: {
    jawaban: "C. 250 mil",
    konsepTrik:
      "Hitung perpindahan bersih arah barat-timur dan utara-selatan, lalu Pythagoras.",
    stepByStep:
      "Perpindahan timur-barat: $-100 + 170 = 70$ mil ke timur\nPerpindahan utara-selatan: $-50 + 290 = 240$ mil ke utara\nJarak $= \\sqrt{70^2 + 240^2} = \\sqrt{4900 + 57600} = \\sqrt{62500} = 250$ mil",
    tips:
      "Tripel 7-24-25 menghasilkan 70-240-250.",
    kesimpulan:
      "Jarak terdekat Ambu - Eco adalah 250 mil.",
  },
  20: {
    jawaban: "B. 216 cm$^2$",
    konsepTrik:
      "Pecah bangun menjadi dua bagian yang mudah dihitung: sebuah persegi panjang dan tambahan segitiga siku-siku.",
    stepByStep:
      "Luas persegi panjang utama $= AB \\times AF = 15 \\times 10 = 150$ cm$^2$.\nSisa bangun berupa dua segitiga siku-siku kongruen yang masing-masing luasnya $\\tfrac{1}{2} \\times 12 \\times 11 = 66$ cm$^2$ secara total.\nJadi luas bangun $= 150 + 66 = 216$ cm$^2$.",
    tips:
      "Bila tidak yakin, kelompokkan dulu mana yang persegi panjang dan mana yang segitiga.",
    kesimpulan:
      "Luas bangun adalah 216 cm$^2$.",
  },
  21: {
    jawaban: "C. 120 cm$^2$",
    konsepTrik:
      "Gunakan pemecahan bangun menjadi trapesium kecil dan segitiga siku-siku di bagian atas.",
    stepByStep:
      "Bagian alas memberi luas 96 cm$^2$.\nBagian segitiga atas memiliki alas 8 cm dan tinggi 6 cm, sehingga luasnya $\\tfrac{1}{2} \\times 8 \\times 6 = 24$ cm$^2$.\nTotal luas $= 96 + 24 = 120$ cm$^2$.",
    tips:
      "Tarik garis bantu yang menyederhanakan menjadi persegi panjang atau segitiga siku-siku.",
    kesimpulan:
      "Luas daerah pada gambar adalah 120 cm$^2$.",
  },
  22: {
    jawaban: "B. 20 pohon",
    konsepTrik:
      "Belah ketupat: sisi $= \\sqrt{(d_1/2)^2 + (d_2/2)^2}$. Banyak pohon $=$ keliling $\\div$ jarak antar pohon (untuk pola tertutup).",
    stepByStep:
      "Setengah diagonal: $6$ m dan $8$ m.\nSisi $= \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ m.\nKeliling $= 4 \\times 10 = 40$ m.\nBanyak pohon $= 40 \\div 2 = 20$ pohon.",
    tips:
      "Tripel 6-8-10 muncul lagi (kelipatan 3-4-5).",
    kesimpulan:
      "Banyak pohon yang ditanam adalah 20 pohon.",
  },
  23: {
    jawaban: "Luas $= 252$ cm$^2$",
    konsepTrik:
      "Layang-layang: luas $= \\tfrac{d_1 \\cdot d_2}{2}$. Salah satu diagonal membagi yang lain menjadi dua bagian (di titik potong tegak lurus).",
    stepByStep:
      "AC adalah diagonal vertikal, $AC = 24$ cm; titik potong O di tengah AC sehingga $OA = OC = 12$.\nPada $\\triangle AOB$ siku-siku: $OB = \\sqrt{13^2 - 12^2} = 5$ cm.\nPada $\\triangle AOD$ siku-siku: $OD = \\sqrt{20^2 - 12^2} = \\sqrt{256} = 16$ cm.\nDiagonal $BD = OB + OD = 5 + 16 = 21$ cm.\nLuas $= \\tfrac{24 \\cdot 21}{2} = 252$ cm$^2$.",
    tips:
      "Diagonal-diagonal layang-layang berpotongan tegak lurus; salah satunya membagi yang lain menjadi dua sama.",
    kesimpulan:
      "Luas layang-layang ABCD adalah 252 cm$^2$.",
  },
  24: {
    jawaban: "Luas $= 195$ cm$^2$",
    konsepTrik:
      "Jajargenjang: luas $= $ alas $\\times$ tinggi (tegak lurus alas). BE adalah tinggi terhadap sisi AD.",
    stepByStep:
      "Karena BE tegak lurus AD dengan $BE = 15$ cm dan $AD = 13$ cm,\nLuas $= AD \\times BE = 13 \\times 15 = 195$ cm$^2$.",
    tips:
      "Pastikan tinggi diukur tegak lurus terhadap sisi yang dipakai sebagai alas.",
    kesimpulan:
      "Luas jajargenjang ABCD adalah 195 cm$^2$.",
  },
  25: {
    jawaban: "D. 64 m",
    konsepTrik:
      "Trapesium sama kaki: kaki dihitung dengan Pythagoras dari setengah selisih sisi sejajar dan tinggi.",
    stepByStep:
      "Selisih sisi sejajar $= 24 - 14 = 10$ m, separuh $= 5$ m.\nSisi miring $= \\sqrt{5^2 + 12^2} = \\sqrt{169} = 13$ m.\nKeliling $= 24 + 14 + 13 + 13 = 64$ m.",
    tips:
      "5-12-13 adalah tripel klasik yang sering muncul pada soal trapesium.",
    kesimpulan:
      "Panjang pagar yang dibutuhkan adalah 64 m.",
  },
  26: {
    jawaban: "A. 7 m",
    konsepTrik:
      "Jarak horizontal $= \\sqrt{(\\text{jarak pandang})^2 - (\\text{tinggi})^2}$. Jarak A-B $=$ selisih jarak horizontal.",
    stepByStep:
      "Jarak horizontal ke A $= \\sqrt{15^2 - 12^2} = \\sqrt{81} = 9$ m.\nJarak horizontal ke B $= \\sqrt{20^2 - 12^2} = \\sqrt{256} = 16$ m.\nJarak A-B $= 16 - 9 = 7$ m.",
    tips:
      "Pakai dua tripel 9-12-15 dan 12-16-20 (= 4 $\\times$ 3-4-5).",
    kesimpulan:
      "Jarak benda A dan benda B di tanah adalah 7 m.",
  },
  27: {
    jawaban: "$QR = 6$ cm dan $PQ = 6\\sqrt{3}$ cm",
    konsepTrik:
      "Segitiga siku-siku $30°{-}60°{-}90°$: sisi di depan $30°$ = $\\tfrac{1}{2}$ hipotenusa, sisi di depan $60°$ = $\\tfrac{\\sqrt{3}}{2}$ hipotenusa.",
    stepByStep:
      "Asumsi $\\angle PQR = 90°$, $\\angle QPR = 60°$, $\\angle QRP = 30°$, dan PR (hipotenusa) $= 12$ cm.\n$QR$ (di depan $30°$) $= \\tfrac{1}{2} \\cdot 12 = 6$ cm.\n$PQ$ (di depan $60°$) $= \\tfrac{\\sqrt{3}}{2} \\cdot 12 = 6\\sqrt{3}$ cm.",
    tips:
      "Hafalkan perbandingan $1 : \\sqrt{3} : 2$ untuk segitiga $30°{-}60°{-}90°$.",
    kesimpulan:
      "$QR = 6$ cm dan $PQ = 6\\sqrt{3}$ cm.",
  },
  28: {
    jawaban: "Penyelesaian dengan Pythagoras berulang",
    konsepTrik:
      "Untuk tiap titik di tanah, terapkan Pythagoras pada segitiga siku-siku dengan ketinggian helikopter sebagai salah satu kaki.",
    stepByStep:
      "Misalkan jarak pandang helikopter ke titik A, B, C berturut-turut diketahui dari gambar (misal $d_A, d_B, d_C$).\nJarak OA $= \\sqrt{d_A^2 - 500^2}$ (jarak horizontal A dari titik tepat di bawah helikopter).\nJarak AB dan BC dihitung dari selisih jarak horizontal antar titik atau menggunakan Pythagoras pada bentuk segitiga di tanah.",
    tips:
      "Selalu pisahkan komponen vertikal (ketinggian) dengan komponen horizontal sebelum menerapkan Pythagoras.",
    kesimpulan:
      "Jarak OA, AB, dan BC ditemukan dengan menerapkan Pythagoras pada masing-masing segitiga siku-siku yang melibatkan ketinggian 500 m.",
  },
  29: {
    jawaban: "Pakai Pythagoras pada tiap segitiga siku-siku",
    konsepTrik:
      "Pisahkan bangun menjadi beberapa segitiga siku-siku, lalu cari tiap sisi yang belum diketahui.",
    stepByStep:
      "Tandai sisi-sisi yang diketahui pada gambar.\nTerapkan $c = \\sqrt{a^2 + b^2}$ untuk mencari sisi miring atau $b = \\sqrt{c^2 - a^2}$ untuk mencari kaki.\nLanjutkan ke segitiga berikutnya dengan memakai sisi yang baru ditemukan.",
    tips:
      "Tarik garis bantu agar segitiga siku-siku terlihat jelas.",
    kesimpulan:
      "Sisi AB, AC, dan CD dapat dihitung berurutan dengan Pythagoras.",
  },
  30: {
    jawaban: "B. 10",
    konsepTrik:
      "Jarak antara dua titik: $|PQ| = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$.",
    stepByStep:
      "$|AB| = \\sqrt{(3 - (-5))^2 + (-2 - 4)^2} = \\sqrt{8^2 + (-6)^2}$\n$= \\sqrt{64 + 36} = \\sqrt{100} = 10$",
    tips:
      "Tripel 6-8-10 sering muncul. Selalu kuadratkan agar tanda negatif tidak masalah.",
    kesimpulan:
      "Jarak titik A dan B adalah 10 satuan.",
  },
  31: {
    jawaban: "C. $k = -2$",
    konsepTrik:
      "Pakai rumus jarak: $(k - 1)^2 + (5 - 1)^2 = 5^2$.",
    stepByStep:
      "$(k - 1)^2 + 16 = 25$\n$(k - 1)^2 = 9$\n$k - 1 = \\pm 3$\n$k = 4$ atau $k = -2$",
    tips:
      "Akar kuadrat selalu menghasilkan dua nilai (positif & negatif).",
    kesimpulan:
      "Nilai $k$ yang mungkin adalah $4$ atau $-2$. Sesuai opsi: $k = -2$.",
  },
  32: {
    jawaban: "C. Segitiga Siku-siku",
    konsepTrik:
      "Hitung kuadrat jarak setiap sisi, kemudian uji $c^2 = a^2 + b^2$.",
    stepByStep:
      "$KL^2 = (2-6)^2 + (5-1)^2 = 16 + 16 = 32$\n$LM^2 = (6-10)^2 + (1-5)^2 = 16 + 16 = 32$\n$KM^2 = (2-10)^2 + (5-5)^2 = 64$\n$KL^2 + LM^2 = 32 + 32 = 64 = KM^2$ ✓",
    tips:
      "Bekerja dengan kuadrat jarak menghemat penyederhanaan akar.",
    kesimpulan:
      "Segitiga $KLM$ siku-siku (di L), sekaligus sama kaki ($KL = LM$).",
  },
  33: {
    jawaban: "D. $R\\left(\\tfrac{8}{3}, 0\\right)$",
    konsepTrik:
      "Berjarak sama berarti $|RA|^2 = |RB|^2$. Pakai rumus jarak kuadrat untuk menghindari akar.",
    stepByStep:
      "$(x - 2)^2 + 9 = (x - 5)^2 + 4$\n$x^2 - 4x + 4 + 9 = x^2 - 10x + 25 + 4$\n$-4x + 13 = -10x + 29$\n$6x = 16 \\Rightarrow x = \\tfrac{8}{3}$",
    tips:
      "Sama kuadratkan dua sisi sebelum diperluas — istilah $x^2$ dan $y^2$ akan habis.",
    kesimpulan:
      "Koordinat titik $R$ adalah $\\left(\\tfrac{8}{3}, 0\\right)$.",
  },
};
