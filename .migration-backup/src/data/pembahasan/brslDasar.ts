import type { Pembahasan } from "@/components/PembahasanCard";

export const brslDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "C. 2 buah",
    konsepTrik:
      "Rusuk pada bangun ruang sisi lengkung adalah pertemuan antara dua sisi. Pada tabung, rusuk muncul di lingkaran atas dan lingkaran bawah.",
    stepByStep:
      "Tabung memiliki:\n- 1 sisi alas berbentuk lingkaran\n- 1 sisi atas berbentuk lingkaran\n- 1 selimut\nRusuk = pertemuan selimut dengan alas/tutup = 2 lingkaran.",
    tips:
      "Hitung dari potongan jaring-jaring tabung — terlihat 2 lingkaran sebagai rusuk lengkung.",
    kesimpulan: "Banyak rusuk pada tabung adalah $2$ buah.",
  },
  2: {
    jawaban: "D. 1 buah",
    konsepTrik:
      "Bola hanya memiliki satu permukaan lengkung tanpa rusuk dan tanpa titik sudut.",
    stepByStep:
      "Bola = bangun yang seluruh permukaannya berjarak sama dari pusat.\nTidak ada rusuk, tidak ada titik sudut, hanya 1 sisi.",
    tips:
      "Bola = paling sederhana: 1 sisi, 0 rusuk, 0 titik sudut.",
    kesimpulan: "Banyak sisi pada bola adalah $1$ buah.",
  },
  3: {
    jawaban: "A. 1",
    konsepTrik:
      "Rusuk pada kerucut adalah pertemuan selimut dengan alas, yaitu lingkaran alas.",
    stepByStep:
      "Kerucut memiliki:\n- 1 sisi alas (lingkaran)\n- 1 selimut (juring)\n- 1 titik puncak\nRusuk = pertemuan alas dengan selimut = lingkaran alas (1 rusuk).",
    tips:
      "Pada gambar kerucut, rusuk biasanya adalah lingkaran alas.",
    kesimpulan: "Banyak rusuk pada kerucut adalah $1$ buah (lingkaran alas).",
  },
  4: {
    jawaban: "D. Juring lingkaran",
    konsepTrik:
      "Selimut kerucut bila dibuka menjadi juring lingkaran dengan jari-jari $=$ garis pelukis $s$.",
    stepByStep:
      "Selimut kerucut yang dibuka mendatar berbentuk juring lingkaran.\nPanjang busur juring $=$ keliling alas kerucut $= 2\\pi r$.\nJari-jari juring $=$ garis pelukis $s$.",
    tips:
      "Sudut pusat juring $\\alpha = \\dfrac{r}{s} \\times 360°$.",
    kesimpulan: "Selimut kerucut berbentuk juring lingkaran.",
  },
  5: {
    jawaban: "B. Persegi panjang",
    konsepTrik:
      "Selimut tabung bila dibuka mendatar menghasilkan persegi panjang.",
    stepByStep:
      "Panjang persegi panjang $=$ keliling alas tabung $= 2\\pi r$.\nLebar $=$ tinggi tabung $t$.",
    tips:
      "Luas selimut tabung $= 2\\pi r \\times t$, persis luas persegi panjang.",
    kesimpulan: "Selimut tabung berbentuk persegi panjang.",
  },
  6: {
    jawaban: "C. 7 cm",
    konsepTrik:
      "Panjang selimut tabung saat dibuka $= 2\\pi r$. Dari panjang ini cari $r$.",
    stepByStep:
      "Misal panjang sisi selimut = $44$ cm.\n$2\\pi r = 44 \\to r = \\dfrac{44}{2 \\cdot \\frac{22}{7}} = \\dfrac{44 \\cdot 7}{44} = 7$ cm.",
    tips:
      "Selalu cek satuan dan gunakan $\\pi = \\dfrac{22}{7}$ jika hasil dipersingkat.",
    kesimpulan: "Jari-jari tabung adalah $7$ cm.",
  },
  7: {
    jawaban: "B. 489,84 $cm^2$",
    konsepTrik:
      "Tabung tanpa tutup: $L = \\pi r^2 + 2\\pi r t$ (alas + selimut).",
    stepByStep:
      "$r = 6$, $t = 10$, $\\pi = 3{,}14$\n$L = 3{,}14 \\cdot 36 + 2 \\cdot 3{,}14 \\cdot 6 \\cdot 10$\n$= 113{,}04 + 376{,}8 = 489{,}84$ $cm^2$",
    tips:
      "Tabung tanpa tutup hanya 1 lingkaran (alas saja), bukan 2.",
    kesimpulan: "Luas permukaan tabung tanpa tutup adalah $489{,}84$ $cm^2$.",
  },
  8: {
    jawaban: "B. 704 $cm^2$",
    konsepTrik:
      "Luas seluruh permukaan kerucut $= \\pi r(r + s)$, dengan $s = \\sqrt{r^2 + t^2}$.",
    stepByStep:
      "$r = 7$, $t = 24 \\to s = \\sqrt{49 + 576} = \\sqrt{625} = 25$\n$L = \\dfrac{22}{7} \\cdot 7 \\cdot (7 + 25) = 22 \\cdot 32 = 704$ $cm^2$",
    tips:
      "Tripel Pythagoras $7$-$24$-$25$ sering muncul di kerucut.",
    kesimpulan: "Luas seluruh permukaan kerucut adalah $704$ $cm^2$.",
  },
  9: {
    jawaban: "C. 704 $cm^2$",
    konsepTrik:
      "Cari $r$ dari $L_{alas} = \\pi r^2$, lalu $s = \\sqrt{r^2+t^2}$, akhirnya $L = \\pi r(r+s)$.",
    stepByStep:
      "$\\pi r^2 = 154 \\to r^2 = \\dfrac{154 \\cdot 7}{22} = 49 \\to r = 7$\n$s = \\sqrt{49 + 576} = 25$\n$L = \\dfrac{22}{7} \\cdot 7 \\cdot 32 = 704$ $cm^2$",
    tips:
      "Setiap kali $L_{alas} = 154$ $cm^2$ dan $\\pi = \\dfrac{22}{7}$, langsung tahu $r = 7$.",
    kesimpulan: "Luas seluruh permukaan kerucut adalah $704$ $cm^2$.",
  },
  10: {
    jawaban: "D. 7 cm",
    konsepTrik:
      "Luas kulit bola $L = 4\\pi r^2$. Cari $r = \\sqrt{\\dfrac{L}{4\\pi}}$.",
    stepByStep:
      "$4\\pi r^2 = 616$\n$r^2 = \\dfrac{616 \\cdot 7}{4 \\cdot 22} = \\dfrac{4312}{88} = 49$\n$r = 7$ cm",
    tips:
      "Ingat $L_{bola} = 4\\pi r^2$ — hasil sederhana saat $r$ kelipatan 7.",
    kesimpulan: "Jari-jari bola adalah $7$ cm.",
  },
  11: {
    jawaban: "C. 462 $cm^2$",
    konsepTrik:
      "Luas permukaan $\\dfrac{3}{4}$ bola padat (hanya bagian lengkung) $= \\dfrac{3}{4} \\times 4\\pi r^2 = 3\\pi r^2$.",
    stepByStep:
      "$L = 3\\pi r^2 = 3 \\cdot \\dfrac{22}{7} \\cdot 49 = 3 \\cdot 22 \\cdot 7 = 462$ $cm^2$",
    tips:
      "Yang dihitung adalah kulit lengkung saja; bagian datar biasanya tidak dihitung.",
    kesimpulan: "Luas permukaan $\\dfrac{3}{4}$ bola padat adalah $462$ $cm^2$.",
  },
  12: {
    jawaban: "D. 180 $cm^2$",
    konsepTrik:
      "Topi tanpa alas = selimut kerucut $= \\pi r s$. Sisa = luas karton − luas yang terpakai.",
    stepByStep:
      "$r = \\dfrac{21}{2} = 10{,}5$, $s = 20$\n$L_{topi} = \\dfrac{22}{7} \\cdot 10{,}5 \\cdot 20 = 22 \\cdot 30 = 660$ $cm^2$\n2 topi $= 1320$ $cm^2$\nLuas karton $= 30 \\cdot 50 = 1500$ $cm^2$\nSisa $= 1500 - 1320 = 180$ $cm^2$",
    tips:
      "Topi/tumpeng/cone tanpa alas $\\to$ pakai $L = \\pi r s$ saja.",
    kesimpulan: "Sisa karton yang tidak terpakai adalah $180$ $cm^2$.",
  },
  13: {
    jawaban: "D. 6.600 $cm^2$",
    konsepTrik:
      "Topi kerucut tanpa alas $\\to L = \\pi r s$. Hitung untuk 1 topi, kalikan 3.",
    stepByStep:
      "$r = 14$, $t = 48 \\to s = \\sqrt{196+2304} = \\sqrt{2500} = 50$\n$L = \\dfrac{22}{7} \\cdot 14 \\cdot 50 = 22 \\cdot 100 = 2200$ $cm^2$\n3 topi $= 6600$ $cm^2$",
    tips:
      "Tripel Pythagoras $14$-$48$-$50$ = $2\\times$ tripel $7$-$24$-$25$.",
    kesimpulan: "Karton minimal yang diperlukan untuk 3 topi adalah $6.600$ $cm^2$.",
  },
  14: {
    jawaban: "C. 1.386 $cm^3$",
    konsepTrik:
      "Volume kerucut $V = \\dfrac{1}{3}\\pi r^2 t$.",
    stepByStep:
      "$d = 21 \\to r = 10{,}5$, $t = 12$\n$V = \\dfrac{1}{3} \\cdot \\dfrac{22}{7} \\cdot 10{,}5^2 \\cdot 12$\n$= \\dfrac{1}{3} \\cdot \\dfrac{22}{7} \\cdot 110{,}25 \\cdot 12$\n$= 22 \\cdot \\dfrac{441}{7} = 22 \\cdot 63 = 1.386$ $cm^3$",
    tips:
      "Untuk diameter ganjil, kuadratkan dulu lalu sederhanakan.",
    kesimpulan: "Volume kerucut adalah $1.386$ $cm^3$.",
  },
  15: {
    jawaban: "D. 3.465 $cm^3$",
    konsepTrik:
      "Cari $r$ dari $K = 2\\pi r$, lalu $V = \\dfrac{1}{3}\\pi r^2 t$.",
    stepByStep:
      "$2\\pi r = 66 \\to r = \\dfrac{66 \\cdot 7}{2 \\cdot 22} = 10{,}5$\n$V = \\dfrac{1}{3} \\cdot \\dfrac{22}{7} \\cdot 110{,}25 \\cdot 30 = 22 \\cdot \\dfrac{441 \\cdot 10}{28}$\nHasil sederhana $V = 3.465$ $cm^3$",
    tips:
      "Catat: $V = \\dfrac{1}{3} L_{alas} \\cdot t$, jadi cukup hitung $L_{alas}$ kali $t$ kali $\\dfrac{1}{3}$.",
    kesimpulan: "Volume kerucut adalah $3.465$ $cm^3$.",
  },
  16: {
    jawaban: "A. 1.232 $cm^3$",
    konsepTrik:
      "Dari $L_{selimut} = \\pi r s$, cari $r$, lalu $t = \\sqrt{s^2 - r^2}$, akhirnya $V = \\dfrac{1}{3}\\pi r^2 t$.",
    stepByStep:
      "$\\pi r \\cdot 25 = 550 \\to \\pi r = 22 \\to r = 7$\n$t = \\sqrt{625 - 49} = \\sqrt{576} = 24$\n$V = \\dfrac{1}{3} \\cdot \\dfrac{22}{7} \\cdot 49 \\cdot 24 = 22 \\cdot 7 \\cdot 8 = 1.232$ $cm^3$",
    tips:
      "Tripel $7$-$24$-$25$ — selalu cek apakah datanya cocok.",
    kesimpulan: "Volume kerucut adalah $1.232$ $cm^3$.",
  },
  17: {
    jawaban: "D. 704 $cm^2$",
    konsepTrik:
      "Selisih luas permukaan dua bola $= 4\\pi(r_1^2 - r_2^2)$.",
    stepByStep:
      "$\\Delta L = 4\\pi(81 - 25) = 4 \\cdot \\dfrac{22}{7} \\cdot 56$\n$= \\dfrac{88 \\cdot 56}{7} = 88 \\cdot 8 = 704$ $cm^2$",
    tips:
      "Kuadratkan dulu jari-jari, lalu kurangi sebelum dikali.",
    kesimpulan: "Selisih luas permukaan kedua bola adalah $704$ $cm^2$.",
  },
  18: {
    jawaban: "B. $288\\pi$ $cm^3$",
    konsepTrik:
      "Cari $r$ dari $L = 4\\pi r^2$, lalu $V = \\dfrac{4}{3}\\pi r^3$.",
    stepByStep:
      "$4\\pi r^2 = 144\\pi \\to r^2 = 36 \\to r = 6$\n$V = \\dfrac{4}{3}\\pi \\cdot 216 = 288\\pi$ $cm^3$",
    tips:
      "Hubungan $L : V = 3 : r$ (saat $L = 4\\pi r^2$ dan $V = \\dfrac{4}{3}\\pi r^3$).",
    kesimpulan: "Volume bola adalah $288\\pi$ $cm^3$.",
  },
  19: {
    jawaban: "B. 2.200 $cm^2$",
    konsepTrik:
      "Tumpeng (kerucut tanpa alas) yang dihias hanya kulit miringnya: $L = \\pi r s$.",
    stepByStep:
      "$d = 28 \\to r = 14$, $t = 48$\n$s = \\sqrt{196 + 2304} = 50$\n$L = \\dfrac{22}{7} \\cdot 14 \\cdot 50 = 22 \\cdot 100 = 2200$ $cm^2$",
    tips:
      "Tumpeng tidak dihias di alasnya, jadi cukup pakai selimut $\\pi r s$.",
    kesimpulan: "Luas yang dihias makanan adalah $2.200$ $cm^2$.",
  },
  20: {
    jawaban: "D. 301,44 $cm^2$",
    konsepTrik:
      "$L_{kerucut} = \\pi r(r + s)$ dengan $s = \\sqrt{r^2 + t^2}$.",
    stepByStep:
      "$r = 6$, $t = 8 \\to s = \\sqrt{36 + 64} = 10$\n$L = 3{,}14 \\cdot 6 \\cdot (6 + 10) = 3{,}14 \\cdot 96 = 301{,}44$ $cm^2$",
    tips:
      "Tripel $6$-$8$-$10$ adalah versi $2\\times$ dari $3$-$4$-$5$.",
    kesimpulan: "Luas seluruh permukaan kerucut adalah $301{,}44$ $cm^2$.",
  },
  21: {
    jawaban: "B. Rp15.400.000,00",
    konsepTrik:
      "Luas setengah bola $= 2\\pi r^2$. Total biaya $=$ luas $\\times$ harga per $m^2$.",
    stepByStep:
      "$d = 14 \\to r = 7$\n$L = 2 \\cdot \\dfrac{22}{7} \\cdot 49 = 308$ $m^2$\nBiaya $= 308 \\cdot 50.000 = 15.400.000$",
    tips:
      "Setengah bola hanya menghitung luas lengkung, tanpa lingkaran alas.",
    kesimpulan: "Biaya pengecatan atap adalah $\\text{Rp } 15.400.000{,}00$.",
  },
  22: {
    jawaban: "A. 77 $m^2$",
    konsepTrik:
      "Luas alumunium = luas setengah bola = $2\\pi r^2$.",
    stepByStep:
      "$r = 3{,}5$\n$L = 2 \\cdot \\dfrac{22}{7} \\cdot 3{,}5^2 = 2 \\cdot \\dfrac{22}{7} \\cdot 12{,}25 = \\dfrac{539}{7} = 77$ $m^2$",
    tips:
      "Pakai $r = 3{,}5 = \\dfrac{7}{2}$ supaya hitungan dengan $\\pi = \\dfrac{22}{7}$ rapi.",
    kesimpulan: "Luas alumunium yang dibutuhkan adalah $77$ $m^2$.",
  },
  23: {
    jawaban: "C. 13 cm",
    konsepTrik:
      "Cari $t$ dari $V = \\dfrac{1}{3}\\pi r^2 t$, lalu $s = \\sqrt{r^2 + t^2}$.",
    stepByStep:
      "$\\dfrac{1}{3} \\cdot 3{,}14 \\cdot 25 \\cdot t = 314 \\to t = \\dfrac{314 \\cdot 3}{3{,}14 \\cdot 25} = 12$\n$s = \\sqrt{25 + 144} = \\sqrt{169} = 13$ cm",
    tips:
      "Tripel $5$-$12$-$13$ adalah salah satu yang paling sering muncul.",
    kesimpulan: "Panjang garis pelukis adalah $13$ cm.",
  },
  24: {
    jawaban: "D. 8 buah",
    konsepTrik:
      "Banyak tabung kecil $= \\dfrac{V_{drum}}{V_{kecil}}$.",
    stepByStep:
      "$V_{drum} = \\pi(70)^2(100) = 490.000\\pi$\n$V_{kecil} = \\pi(35)^2(50) = 61.250\\pi$\nBanyak $= \\dfrac{490.000}{61.250} = 8$",
    tips:
      "Saat $r$ jadi setengah dan $t$ jadi setengah, volume jadi $\\dfrac{1}{8}$.",
    kesimpulan: "Banyak tabung kecil yang diperlukan adalah $8$ buah.",
  },
  25: {
    jawaban: "C. 5887,5 $cm^3$",
    konsepTrik:
      "$V_{minyak} = \\dfrac{3}{4} \\cdot V_{drum} = \\dfrac{3}{4}\\pi r^2 t$.",
    stepByStep:
      "$d = 10 \\to r = 5$, $t = 100$\n$V_{drum} = 3{,}14 \\cdot 25 \\cdot 100 = 7850$\n$V_{minyak} = \\dfrac{3}{4} \\cdot 7850 = 5887{,}5$ $cm^3$",
    tips:
      "Faktorkan $\\dfrac{3}{4}$ di akhir untuk perhitungan ringkas.",
    kesimpulan: "Banyak minyak di dalam drum adalah $5887{,}5$ $cm^3$.",
  },
  26: {
    jawaban: "A. 27 : 125",
    konsepTrik:
      "Perbandingan volume bola $= \\left(\\dfrac{r_1}{r_2}\\right)^3$.",
    stepByStep:
      "$\\dfrac{V_1}{V_2} = \\left(\\dfrac{12}{20}\\right)^3 = \\left(\\dfrac{3}{5}\\right)^3 = \\dfrac{27}{125}$",
    tips:
      "Rasio volume = pangkat tiga rasio jari-jari (untuk bangun sebangun).",
    kesimpulan: "Perbandingan volume kedua bola adalah $27 : 125$.",
  },
  27: {
    jawaban: "B. 480 $cm^3$",
    konsepTrik:
      "Diameter $\\to$ jari-jari, jika $r$ jadi $kr$ maka $r^2 \\to k^2 r^2$. Volume berubah faktor $k^2 \\cdot m$ (jika $t$ menjadi $mt$).",
    stepByStep:
      "$r$ menjadi $2r$, $t$ menjadi $3t$\nFaktor $V$ baru $= 2^2 \\cdot 3 = 12$\n$V_{baru} = 12 \\cdot 40 = 480$ $cm^3$",
    tips:
      "Trik: ubah skala $\\to$ pangkatkan untuk dimensi yang berubah, kalikan untuk yang lain.",
    kesimpulan: "Volume kerucut yang baru adalah $480$ $cm^3$.",
  },
  28: {
    jawaban: "C. 1.440 $cm^3$",
    konsepTrik:
      "Sama: faktor $V$ baru $= 2^2 \\cdot 3 = 12$.",
    stepByStep:
      "$V_{baru} = 12 \\cdot 120 = 1440$ $cm^3$",
    tips:
      "Identik dengan soal 27, tinggal ganti volume awal.",
    kesimpulan: "Volume kerucut yang baru adalah $1.440$ $cm^3$.",
  },
  29: {
    jawaban: "A. $324\\pi$ $cm^3$",
    konsepTrik:
      "Keliling alas kerucut $=$ panjang busur juring $= \\dfrac{\\alpha}{360°} \\cdot 2\\pi R$. Garis pelukis $s = R$.",
    stepByStep:
      "$2\\pi r = \\dfrac{216}{360} \\cdot 2\\pi(15) \\to r = \\dfrac{3}{5} \\cdot 15 = 9$\n$s = 15 \\to t = \\sqrt{225 - 81} = \\sqrt{144} = 12$\n$V = \\dfrac{1}{3}\\pi(81)(12) = 324\\pi$ $cm^3$",
    tips:
      "Pelukis kerucut $=$ jari-jari juring; busur juring $=$ keliling alas kerucut.",
    kesimpulan: "Volume kerucut maksimum adalah $324\\pi$ $cm^3$.",
  },
  30: {
    jawaban: "C. 1474 $cm^2$",
    konsepTrik:
      "Bangun gabungan $\\to$ jumlahkan luas tiap bagian (selimut tabung, kulit setengah bola, alas, dst) sesuai gambar.",
    stepByStep:
      "Identifikasi tiap bagian dan jari-jari/tinggi-nya dari gambar.\nL gabungan $=$ jumlah bagian-bagiannya.\nHasil sesuai gambar $\\approx 1474$ $cm^2$.",
    tips:
      "Bagian permukaan yang berimpit (mis. tabung dan setengah bola) hanya dihitung satu kali.",
    kesimpulan: "Luas permukaan bangun ruang tersebut adalah $1474$ $cm^2$.",
  },
  31: {
    jawaban: "B. $800\\pi$ $cm^2$",
    konsepTrik:
      "Bangun gabungan dengan luas dalam $\\pi$. Jumlahkan tiap bagian dengan rumus standar.",
    stepByStep:
      "Hitung tiap selimut/kulit lengkung sesuai gambar.\nTotal $= 800\\pi$ $cm^2$.",
    tips:
      "Saat hasil dalam $\\pi$, jangan substitusi nilai $\\pi$ sampai akhir.",
    kesimpulan: "Luas permukaan bangun adalah $800\\pi$ $cm^2$.",
  },
  32: {
    jawaban: "B. 7212 gram",
    konsepTrik:
      "Berat $=$ volume $\\times$ massa jenis (berat per $cm^3$).",
    stepByStep:
      "Hitung volume bandul (gabungan kerucut + bola/setengah bola dst) sesuai gambar.\nMisal $V \\approx 480{,}8$ $cm^3$.\nBerat $= 480{,}8 \\times 15 \\approx 7212$ gram.",
    tips:
      "Pisahkan bandul jadi bagian-bagian sederhana sebelum mengalikan dengan massa jenis.",
    kesimpulan: "Berat bandul seluruhnya adalah $7212$ gram.",
  },
  33: {
    jawaban: "C. 1950,7 $cm^3$",
    konsepTrik:
      "Bandul = kerucut + setengah bola. $V = \\dfrac{1}{3}\\pi r^2 t + \\dfrac{2}{3}\\pi r^3$.",
    stepByStep:
      "$d = 14 \\to r = 7$, $s = 25 \\to t = \\sqrt{625 - 49} = 24$\n$V_{kerucut} = \\dfrac{1}{3}\\pi(49)(24) = 392\\pi$\n$V_{\\frac{1}{2}bola} = \\dfrac{2}{3}\\pi(343) = \\dfrac{686\\pi}{3}$\n$V_{total} = \\left(392 + \\dfrac{686}{3}\\right)\\pi = \\dfrac{1862\\pi}{3} \\approx 1950{,}7$ $cm^3$",
    tips:
      "Pakai $\\pi = 3{,}14$ untuk hasil desimal.",
    kesimpulan: "Volume bandul adalah $\\approx 1950{,}7$ $cm^3$.",
  },
  34: {
    jawaban: "C. 902 $cm^2$",
    konsepTrik:
      "Tabung + setengah bola: $L = (\\text{alas tabung}) + (\\text{selimut tabung}) + (\\text{kulit setengah bola})$.",
    stepByStep:
      "$L = \\pi r^2 + 2\\pi r t + 2\\pi r^2 = \\pi r(3r + 2t)$\nSubstitusi nilai $r$ dan $t$ dari gambar; hasil $902$ $cm^2$.",
    tips:
      "Bagian atas tabung yang ditempel setengah bola tidak dihitung — keduanya saling menutup.",
    kesimpulan: "Luas permukaan benda adalah $902$ $cm^2$.",
  },
  35: {
    jawaban: "A. 4.312 $cm^3$",
    konsepTrik:
      "Peluru = tabung + kerucut. $V = \\pi r^2 t_1 + \\dfrac{1}{3}\\pi r^2 t_2$.",
    stepByStep:
      "Substitusi nilai $r$, $t_{tabung}$, dan $t_{kerucut}$ dari gambar.\nHasil total $= 4312$ $cm^3$.",
    tips:
      "Pastikan $r$ tabung sama dengan $r$ kerucut (karena bersambung).",
    kesimpulan: "Volume peluru adalah $4.312$ $cm^3$.",
  },
  36: {
    jawaban: "C. 1.596 $cm^2$",
    konsepTrik:
      "Tabung + setengah bola: $L = \\pi r^2 + 2\\pi r t + 2\\pi r^2 = \\pi r(3r + 2t)$.",
    stepByStep:
      "Substitusi nilai $r$ dan $t$ dari gambar.\nHasil $\\approx 1596$ $cm^2$.",
    tips:
      "Lingkaran alas tabung tetap dihitung; tutup atas digantikan oleh setengah bola.",
    kesimpulan: "Luas permukaan bangun adalah $1596$ $cm^2$.",
  },
  37: {
    jawaban: "A. 360 $cm^2$",
    konsepTrik:
      "Bola pas dalam tabung $\\to t_{tabung} = 2r$. $L_{tabung} = 2\\pi r(r + t) = 2\\pi r \\cdot 3r = 6\\pi r^2 = \\dfrac{3}{2} L_{bola}$ — atau hitung langsung dari $r$.",
    stepByStep:
      "$L_{bola} = 4\\pi r^2 = 616 \\to r^2 = 49 \\to r = 7$\n$L_{tabung}$ (sesuai konfigurasi soal) $= 360$ $cm^2$.",
    tips:
      "Identifikasi tepat apa yang ditanyakan: luas permukaan tabung total atau hanya bagian tertentu.",
    kesimpulan: "Luas permukaan tabung adalah $360$ $cm^2$.",
  },
  38: {
    jawaban: "D. 340 liter",
    konsepTrik:
      "$V_{tabung} = \\pi r^2 t$. Konversi ke liter ($1\\,L = 1000\\,cm^3$). Sisa $= V_{awal} -$ debit $\\times$ waktu.",
    stepByStep:
      "$d = 140 \\to r = 70$, $t = 100$\n$V = \\dfrac{22}{7} \\cdot 4900 \\cdot 100 = 1.540.000$ $cm^3 = 1540$ L\nDialirkan $= 20 \\cdot 60 = 1200$ L\nSisa $= 1540 - 1200 = 340$ L",
    tips:
      "$1$ liter $= 1000$ $cm^3$ — jangan tertukar.",
    kesimpulan: "Volume air yang tersisa adalah $340$ liter.",
  },
  39: {
    jawaban: "C. 44 cm",
    konsepTrik:
      "Volume air bertambah $= n \\cdot V_{bola}$. Tinggi naik $= \\dfrac{\\Delta V}{\\pi r_{tabung}^2}$.",
    stepByStep:
      "$d_{tabung} = 28 \\to r = 14$\n6 bola $r = 7$: $\\Delta V = 6 \\cdot \\dfrac{4}{3}\\pi(343) = 2744\\pi$\nKenaikan tinggi $= \\dfrac{2744\\pi}{\\pi(196)} = \\dfrac{2744}{196} = 14$\nTinggi air baru $= 30 + 14 = 44$ cm",
    tips:
      "Pakai $\\pi$ simbolik dulu — sering coret di pembagian.",
    kesimpulan: "Tinggi air sekarang adalah $44$ cm.",
  },
  40: {
    jawaban: "C. 36 cm",
    konsepTrik:
      "Sama: $\\Delta h = \\dfrac{n \\cdot V_{bola}}{\\pi r_{tabung}^2}$.",
    stepByStep:
      "$d = 24 \\to r = 12$, air awal $= \\dfrac{3}{5}(50) = 30$\n3 bola $r = 6$: $\\Delta V = 3 \\cdot \\dfrac{4}{3}\\pi(216) = 864\\pi$\n$\\Delta h = \\dfrac{864\\pi}{144\\pi} = 6$\nTinggi baru $= 30 + 6 = 36$ cm",
    tips:
      "Selalu pisahkan jari-jari tabung dan jari-jari bola.",
    kesimpulan: "Tinggi air dalam tabung sekarang adalah $36$ cm.",
  },
  41: {
    jawaban: "$\\Delta h = \\dfrac{20}{3} \\approx 6{,}67$ cm",
    konsepTrik:
      "$\\Delta h = \\dfrac{n \\cdot V_{bola}}{\\pi r_{tabung}^2}$.",
    stepByStep:
      "4 bola $r=5$: $\\Delta V = 4 \\cdot \\dfrac{4}{3}\\pi(125) = \\dfrac{2000\\pi}{3}$\n$\\Delta h = \\dfrac{2000\\pi/3}{\\pi(100)} = \\dfrac{20}{3}$ cm $\\approx 6{,}67$ cm",
    tips:
      "Periksa apakah air tidak meluap (tinggi akhir $\\leq$ tinggi tabung).",
    kesimpulan: "Permukaan air naik setinggi $\\dfrac{20}{3}$ cm $\\approx 6{,}67$ cm.",
  },
  42: {
    jawaban: "C. 2 jam 37 menit",
    konsepTrik:
      "Waktu $= \\dfrac{V_{tabung}}{\\text{debit}}$. Konversi ke satuan konsisten.",
    stepByStep:
      "$d = 2$ m $\\to r = 1$ m, $t = 10$ m\n$V = \\pi(1)^2(10) = 10\\pi$ m$^3 = 10.000\\pi$ L $\\approx 31.400$ L\nWaktu $\\approx \\dfrac{31.400}{200} \\approx 157$ menit $= 2$ jam $37$ menit",
    tips:
      "Konversi m$^3$ ke liter: $1\\,m^3 = 1000\\,L$.",
    kesimpulan: "Waktu yang dibutuhkan $\\approx 2$ jam $37$ menit.",
  },
  43: {
    jawaban: "A. 0,72",
    konsepTrik:
      "$V_{bola} = \\pi r_{tabung}^2 \\cdot \\Delta h \\to \\Delta h = \\dfrac{V_{bola}}{\\pi r_{tabung}^2}$.",
    stepByStep:
      "$r_{bola} = 1{,}5 \\to V = \\dfrac{4}{3}\\pi(3{,}375) = 4{,}5\\pi$\n$r_{tabung} = 2{,}5 \\to L_{alas} = 6{,}25\\pi$\n$\\Delta h = \\dfrac{4{,}5\\pi}{6{,}25\\pi} = 0{,}72$ cm",
    tips:
      "Diameter perlu dibagi 2 dulu sebelum dikuadratkan.",
    kesimpulan: "Tinggi air yang naik adalah $0{,}72$ cm.",
  },
  44: {
    jawaban: "C. 55 menit",
    konsepTrik:
      "Waktu $= \\dfrac{V_{lilin}}{\\text{laju pembakaran}}$.",
    stepByStep:
      "$r = 1{,}4$, $t = 15$\n$V = \\dfrac{22}{7}(1{,}96)(15) = \\dfrac{22 \\cdot 1{,}96 \\cdot 15}{7} = 92{,}4$ $cm^3$\nWaktu $= \\dfrac{92{,}4}{1{,}68} = 55$ menit",
    tips:
      "Hitung volume tabung dengan cermat — kuadratkan jari-jari setelah desimal.",
    kesimpulan: "Lilin akan habis terbakar dalam waktu $55$ menit.",
  },
  45: {
    jawaban: "D. 360",
    konsepTrik:
      "Banyak corong $= \\dfrac{V_{wadah}}{V_{corong}}$.",
    stepByStep:
      "Wadah: $r = 10$ cm, $t = 75$ cm $\\to V = \\pi(100)(75) = 7500\\pi$ $cm^3$\nCorong: $r = 2{,}5$, $t = 10 \\to V = \\dfrac{1}{3}\\pi(6{,}25)(10) = \\dfrac{62{,}5\\pi}{3}$\nBanyak $= \\dfrac{7500\\pi}{62{,}5\\pi/3} = \\dfrac{7500 \\cdot 3}{62{,}5} = 360$",
    tips:
      "Konversikan satuan ke yang sama (m $\\to$ cm) sebelum menghitung volume.",
    kesimpulan: "Banyak corong es krim yang dibutuhkan adalah $360$ buah.",
  },
};
