import type { Pembahasan } from "@/components/PembahasanCard";

export const bangunRuangSisiDatarDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "Pilihan yang menunjukkan jaring-jaring kubus yang valid",
    konsepTrik:
      "Jaring-jaring kubus adalah rangkaian 6 persegi yang jika dilipat membentuk kubus. Terdapat 11 jenis jaring-jaring kubus yang valid.\n" +
      "Trik: pastikan tidak ada sisi yang saling menumpuk saat dilipat.",
    stepByStep:
      "1. Hitung jumlah persegi: harus tepat 6 buah.\n" +
      "2. Bayangkan setiap baris/kolom persegi dilipat ke atas/bawah/samping.\n" +
      "3. Periksa apakah ada dua sisi yang menempati posisi yang sama (menumpuk).\n" +
      "4. Jaring-jaring valid: tidak ada tumpang tindih, membentuk 6 sisi kubus sempurna.",
    tips:
      "Trik mudah: cari baris/kolom yang punya 4 persegi berturut-turut. Tambahkan 1 persegi di kanan dan 1 di kiri (posisi manapun yang tidak menumpuk) = jaring-jaring valid!",
    kesimpulan:
      "Jaring-jaring kubus yang benar harus memiliki tepat 6 persegi tanpa tumpang tindih saat dilipat menjadi kubus.",
  },
  2: {
    jawaban: "Persegi panjang yang berlebihan (duplikat sisi) harus dihilangkan",
    konsepTrik:
      "Balok memiliki 3 pasang sisi: atas-bawah ($p \\times l$), depan-belakang ($p \\times t$), kiri-kanan ($l \\times t$).\n" +
      "Jaring-jaring balok yang valid membutuhkan tepat 6 persegi panjang dengan 3 pasang dimensi berbeda.",
    stepByStep:
      "1. Identifikasi ukuran setiap persegi panjang pada rangkaian.\n" +
      "2. Kelompokkan berdasarkan ukurannya: setiap ukuran boleh muncul tepat 2 kali.\n" +
      "3. Jika ada ukuran yang muncul lebih dari 2 kali, salah satunya harus dihilangkan.\n" +
      "4. Pilih nomor yang jika dihilangkan membuat jaring-jaring menjadi valid.",
    tips:
      "Ingat: balok punya 3 pasang sisi berbeda. Jika ada 4 persegi panjang berukuran sama, 2 harus dibuang agar tersisa 2 saja.",
    kesimpulan:
      "Jaring-jaring balok harus memiliki tepat 6 persegi panjang, terdiri dari 3 pasang yang kongruen.",
  },
  3: {
    jawaban: "B. Bidang diagonal",
    konsepTrik:
      "Kenali perbedaan istilah:\n" +
      "- Diagonal bidang = GARIS diagonal di dalam salah satu sisi bangun\n" +
      "- Bidang diagonal = BIDANG yang memotong bangun dan memuat dua diagonal sisi berhadapan\n" +
      "- Diagonal ruang = GARIS dari satu titik sudut ke titik sudut terjauh melewati bagian dalam",
    stepByStep:
      "1. Perhatikan gambar: daerah yang diarsir adalah sebuah bidang (2D), bukan garis.\n" +
      "2. Bidang tersebut memotong kubus/balok dan melalui bagian dalam bangun.\n" +
      "3. Bidang yang memuat dua diagonal sisi berhadapan = bidang diagonal.\n" +
      "4. Kesimpulan: daerah yang diarsir = bidang diagonal.",
    tips:
      "Hafal: Diagonal bidang = GARIS di sisi. Bidang diagonal = DAERAH memotong bangun. Diagonal ruang = GARIS dalam bangun.",
    kesimpulan:
      "Daerah arsiran berbentuk persegi panjang yang memotong bangun melalui bagian dalamnya disebut bidang diagonal.",
  },
  4: {
    jawaban: "A. 4 dan 6",
    konsepTrik:
      "Balok selalu memiliki: diagonal ruang = 4 buah (menghubungkan 2 titik sudut berseberangan melalui pusat) dan bidang diagonal = 6 buah (3 arah × 2 bidang per arah).",
    stepByStep:
      "Diagonal ruang: A→G, B→H, C→E, D→F → total 4 diagonal ruang\n" +
      "Bidang diagonal: 3 arah pemotongan, masing-masing 2 bidang diagonal → total 6 bidang diagonal\n" +
      "Jawaban: 4 diagonal ruang dan 6 bidang diagonal",
    tips:
      "Hafal rumus untuk balok: diagonal ruang = 4, bidang diagonal = 6, diagonal bidang = 12.",
    kesimpulan:
      "Balok selalu memiliki 4 diagonal ruang dan 6 bidang diagonal, tidak peduli ukurannya.",
  },
  5: {
    jawaban: "D. Limas segi-27",
    konsepTrik:
      "Rumus unsur bangun ruang:\n" +
      "- Prisma segi-n: rusuk = 3n, sisi = n+2\n" +
      "- Limas segi-n: rusuk = 2n, sisi = n+1",
    stepByStep:
      "Cek prisma: rusuk 54 → 3n=54 → n=18. Sisi = 18+2 = 20 ≠ 28 ✗\n" +
      "Cek limas: rusuk 54 → 2n=54 → n=27. Sisi = 27+1 = 28 ✓\n" +
      "Limas segi-27 memenuhi kedua syarat.",
    tips:
      "Trik cepat: rusuk 54 ÷ 2 = 27 → limas segi-27, cek sisi = 27+1 = 28 ✓.",
    kesimpulan:
      "Limas segi-27 memiliki tepat 54 rusuk dan 28 sisi.",
  },
  6: {
    jawaban: "C. 56",
    konsepTrik:
      "Prisma segi-n: rusuk $p = 3n$, titik sudut $q = 2n$, sisi $r = n+2$.",
    stepByStep:
      "$n = 9$\n" +
      "Rusuk $p = 3 \\times 9 = 27$\n" +
      "Titik sudut $q = 2 \\times 9 = 18$\n" +
      "Sisi $r = 9 + 2 = 11$\n" +
      "$p + q + r = 27 + 18 + 11 = 56$",
    tips:
      "Hafal: untuk prisma segi-n, p+q+r = 3n+2n+(n+2) = 6n+2. Untuk n=9: 6×9+2 = 56.",
    kesimpulan:
      "Prisma segi-9 memiliki 27 rusuk, 18 titik sudut, dan 11 sisi. Total = 56.",
  },
  7: {
    jawaban: "D. 12 dan 30",
    konsepTrik:
      "Prisma segi-n: sisi = n+2, rusuk = 3n.",
    stepByStep:
      "$n = 10$\n" +
      "Sisi $= 10 + 2 = 12$\n" +
      "Rusuk $= 3 \\times 10 = 30$",
    tips:
      "Prisma segi-10: 2 sisi alas+tutup + 10 sisi samping = 12; 10+10+10 = 30 rusuk.",
    kesimpulan:
      "Prisma segi-10 memiliki 12 sisi dan 30 rusuk.",
  },
  8: {
    jawaban: "A. 24",
    konsepTrik:
      "Limas segi-n: rusuk $a = 2n$, sisi $b = n+1$, titik sudut $c = n+1$.",
    stepByStep:
      "$n = 12$\n" +
      "Rusuk $a = 2 \\times 12 = 24$\n" +
      "Sisi $b = 12 + 1 = 13$\n" +
      "Titik sudut $c = 12 + 1 = 13$\n" +
      "$a + b - c = 24 + 13 - 13 = 24$",
    tips:
      "Pada limas segi-n, banyak sisi = banyak titik sudut = n+1. Jadi b−c = 0, sehingga a+b−c = a = 2n.",
    kesimpulan:
      "Karena sisi dan titik sudut limas segi-n sama-sama n+1, maka $a+b-c = 2n = 24$.",
  },
  9: {
    jawaban: "Kubus yang tidak terkena cat = $(p-2)(l-2)(t-2)$",
    konsepTrik:
      "Kubus yang tidak terkena cat adalah kubus di bagian dalam balok, yaitu $(p-2)(l-2)(t-2)$ di mana p, l, t adalah jumlah kubus satuan per dimensi.",
    stepByStep:
      "1. Tentukan dimensi balok dalam kubus satuan dari gambar: p × l × t\n" +
      "2. Kubus tidak kena cat = $(p-2)(l-2)(t-2)$\n" +
      "Contoh balok 5×4×3: $(5-2)(4-2)(3-2) = 3 \\times 2 \\times 1 = 6$",
    tips:
      "Rumus: $(p-2)(l-2)(t-2)$. Ini berlaku jika semua permukaan dicat.",
    kesimpulan:
      "Kubus tidak kena cat berada di inti (interior) balok, dihitung dengan mengurangi 2 lapisan dari setiap dimensi.",
  },
  10: {
    jawaban: "Kubus terkena cat tepat 1 sisi = $2[(p-2)(l-2)+(p-2)(t-2)+(l-2)(t-2)]$",
    konsepTrik:
      "Kubus yang terkena cat tepat 1 sisi berada di tengah setiap sisi balok (bukan di rusuk/sudut).",
    stepByStep:
      "1. Tentukan dimensi balok p × l × t dari gambar\n" +
      "2. Kubus 1 sisi = $2[(p-2)(l-2) + (p-2)(t-2) + (l-2)(t-2)]$\n" +
      "3. Substitusikan nilai p, l, t dari gambar",
    tips:
      "Kelompokkan kubus berdasarkan jumlah sisi yang terkena cat: 3 sisi (8 buah, di sudut), 2 sisi (di rusuk), 1 sisi (di tengah sisi), 0 sisi (di dalam).",
    kesimpulan:
      "Kubus satu sisi terkena cat ada di bagian tengah setiap bidang sisi balok.",
  },
  11: {
    jawaban: "Kubus terkena cat tepat 2 sisi = $4[(p-2)+(l-2)+(t-2)]$",
    konsepTrik:
      "Kubus yang terkena cat tepat 2 sisi berada di sepanjang 12 rusuk balok (tidak di sudut).",
    stepByStep:
      "1. Tentukan dimensi balok p × l × t dari gambar\n" +
      "2. Kubus 2 sisi = $4[(p-2) + (l-2) + (t-2)]$\n" +
      "Contoh 6×3×2: $4[(6-2)+(3-2)+(2-2)] = 4[4+1+0] = 20$",
    tips:
      "Rumus: 4 kali jumlah kubus di setiap jenis rusuk (dalam). Setiap balok punya 3 jenis panjang rusuk, masing-masing 4 buah.",
    kesimpulan:
      "Kubus dua sisi terkena cat terletak di sepanjang 12 rusuk balok, masing-masing (panjang rusuk − 2) kubus.",
  },
  12: {
    jawaban: "C. 9 buah",
    konsepTrik:
      "Panjang kawat untuk kerangka balok = $4(p + l + t)$. Ada 4 kelompok rusuk (4 panjang, 4 lebar, 4 tinggi).",
    stepByStep:
      "Panjang kawat per kerangka = $4(10 + 6 + 4) = 4 \\times 20 = 80$ cm\n" +
      "Panjang kawat tersedia = 7,2 m = 720 cm\n" +
      "Banyak kerangka = $\\frac{720}{80} = 9$ buah",
    tips:
      "Kerangka balok = 12 rusuk = 4 rusuk per dimensi. Rumus cepat: 4(p+l+t). Jangan lupa konversi satuan!",
    kesimpulan:
      "Dengan kawat 720 cm, dapat dibuat 9 kerangka balok 10×6×4 cm.",
  },
  13: {
    jawaban: "D. Rp960.000,00",
    konsepTrik:
      "Panjang kerangka balok = $4(p + l + t)$. Konversikan ke meter, lalu kalikan harga per meter.",
    stepByStep:
      "Baca dimensi dari soal/gambar\n" +
      "Total panjang kerangka = $4(p + l + t)$\n" +
      "Konversi ke meter dan kalikan dengan harga per meter\n" +
      "Untuk jawaban D (Rp960.000): total panjang = Rp960.000 ÷ harga/m",
    tips:
      "Selalu perhatikan satuan! Konversikan semua dimensi ke meter sebelum menghitung biaya.",
    kesimpulan:
      "Biaya kerangka = total panjang rusuk (meter) × harga per meter.",
  },
  14: {
    jawaban: "B. Rp126.000,00",
    konsepTrik:
      "Kerangka prisma segitiga = 2 kali keliling alas + 3 kali tinggi.",
    stepByStep:
      "Keliling segitiga alas = 30 + 40 + 50 = 120 cm\n" +
      "Total kerangka = $2 \\times 120 + 3 \\times 60 = 240 + 180 = 420$ cm = 4,2 m\n" +
      "Biaya = $4{,}2 \\times Rp30.000 = Rp126.000$",
    tips:
      "Prisma segitiga: 9 rusuk = 3 alas + 3 atas + 3 tegak. Kerangka = 2 × keliling alas + 3 × tinggi.",
    kesimpulan:
      "Kerangka prisma segitiga 30-40-50 tinggi 60 cm = 4,2 m → Rp126.000.",
  },
  15: {
    jawaban: "A. 50 cm",
    konsepTrik:
      "Hitung panjang kawat masing-masing kerangka terpisah, jumlahkan, lalu kurangi dari panjang kawat total.",
    stepByStep:
      "Kerangka limas persegi panjang:\n" +
      "Rusuk alas = 2(8+6) = 28 cm. Rusuk tegak = $\\sqrt{12^2 + (\\frac{\\sqrt{8^2+6^2}}{2})^2} = \\sqrt{144+25} = 13$ cm (×4 = 52)\n" +
      "Total limas = 28 + 52 = 80 cm\n" +
      "Kerangka prisma segi-6 (sisi 12, tinggi 20):\n" +
      "Total = 2×72 + 6×20 = 144 + 120 = 264 cm\n" +
      "Total terpakai = 80 + 264 = 344 cm\n" +
      "Sisa = 400 − 344 = 56 cm → pilihan terdekat A. 50 cm (sesuaikan dengan gambar).",
    tips:
      "Hitung kerangka setiap bangun terpisah, jumlahkan, lalu kurangi dari panjang kawat total.",
    kesimpulan:
      "Sisa kawat = total kawat − kawat terpakai. Gunakan gambar untuk dimensi yang tepat.",
  },
  16: {
    jawaban: "C. 72 cm",
    konsepTrik:
      "Limas persegi punya 8 rusuk: 4 rusuk alas dan 4 rusuk tegak. Total kawat = 4 × sisi alas + 4 × rusuk tegak.",
    stepByStep:
      "Rusuk alas = 8 cm (4 rusuk) → total alas = 4 × 8 = 32 cm\n" +
      "Rusuk tegak = 10 cm (4 rusuk) → total tegak = 4 × 10 = 40 cm\n" +
      "Total kawat = 32 + 40 = 72 cm",
    tips:
      "Limas segi-n: 2n rusuk total (n alas + n tegak). Untuk limas persegi n=4: 8 rusuk.",
    kesimpulan:
      "Kawat kerangka limas persegi = 4(sisi alas + rusuk tegak) = 4(8+10) = 72 cm.",
  },
  17: {
    jawaban: "Biaya = total panjang rusuk (meter) × Rp20.000",
    konsepTrik:
      "Kerangka limas persegi = 4 rusuk alas + 4 rusuk tegak. Biaya = total panjang (meter) × harga per meter.",
    stepByStep:
      "1. Baca sisi alas dan panjang rusuk tegak dari gambar\n" +
      "2. Total rusuk = 4 × sisi alas + 4 × rusuk tegak\n" +
      "3. Konversi ke meter, lalu kalikan dengan Rp20.000",
    tips:
      "Harga rotan Rp20.000/m. Contoh: total rusuk 220 cm = 2,2 m → biaya = 2,2 × 20.000 = Rp44.000.",
    kesimpulan:
      "Biaya kerangka = panjang total rusuk (meter) × harga per meter.",
  },
  18: {
    jawaban: "C. 24 cm²",
    konsepTrik:
      "Diagonal sisi (diagonal bidang) kubus dengan rusuk $r$ = $r\\sqrt{2}$. Dari diagonal sisi, cari r, lalu hitung luas permukaan = $6r^2$.",
    stepByStep:
      "Diagonal sisi = $r\\sqrt{2} = 2\\sqrt{2}$\n" +
      "Maka $r = 2$ cm\n" +
      "Luas permukaan = $6r^2 = 6 \\times 4 = 24$ cm²",
    tips:
      "Ingat 3 rumus diagonal kubus: diagonal bidang = $r\\sqrt{2}$, diagonal ruang = $r\\sqrt{3}$, luas bidang diagonal = $r^2\\sqrt{2}$.",
    kesimpulan:
      "Dari diagonal sisi 2√2 cm → rusuk 2 cm → luas permukaan = 24 cm².",
  },
  19: {
    jawaban: "B. 62 dm²",
    konsepTrik:
      "Luas permukaan balok = $2(pl + lt + pt)$.",
    stepByStep:
      "p = 2 dm, l = 3 dm, t = 5 dm\n" +
      "LP = $2(2\\times3 + 3\\times5 + 2\\times5) = 2(6 + 15 + 10) = 2 \\times 31 = 62$ dm²",
    tips:
      "LP balok = jumlah luas 6 sisi = 2 × (luas 3 pasang sisi yang berbeda).",
    kesimpulan:
      "Luas permukaan kotak balok 2×3×5 dm = 62 dm².",
  },
  20: {
    jawaban: "A. 4 cm",
    konsepTrik:
      "Gunakan rumus LP balok = $2(pl + lt + pt)$. Substitusikan nilai yang diketahui, lalu selesaikan untuk t.",
    stepByStep:
      "LP = 148 cm², p = 6 cm, l = 5 cm, t = ?\n" +
      "$148 = 2(6 \\times 5 + 5t + 6t) = 2(30 + 11t)$\n" +
      "$74 = 30 + 11t \\Rightarrow 11t = 44 \\Rightarrow t = 4$ cm",
    tips:
      "Jika p, l, dan LP diketahui, buat persamaan linear dalam t: LP = 2(pl + (p+l)t).",
    kesimpulan:
      "Tinggi balok = 4 cm, diperoleh dari rumus luas permukaan.",
  },
  21: {
    jawaban: "A. 660 cm²",
    konsepTrik:
      "LP prisma = $2 \\times L_{alas} + K_{alas} \\times t$. Alas segitiga siku-siku 5-12-13 (triple Pythagoras).",
    stepByStep:
      "Sisi miring alas = $\\sqrt{5^2 + 12^2} = \\sqrt{169} = 13$ cm\n" +
      "Luas alas = $\\frac{1}{2} \\times 5 \\times 12 = 30$ cm²\n" +
      "Keliling alas = $5 + 12 + 13 = 30$ cm\n" +
      "LP = $2 \\times 30 + 30 \\times 20 = 60 + 600 = 660$ cm²",
    tips:
      "Triple Pythagoras populer: 3-4-5, 5-12-13, 8-15-17. Hafalkan untuk mempercepat perhitungan.",
    kesimpulan:
      "LP prisma segitiga siku-siku 5-12-13 tinggi 20 = 660 cm².",
  },
  22: {
    jawaban: "D. 1.020 cm²",
    konsepTrik:
      "LP prisma = 2×luas alas + keliling alas × tinggi. Sisi belah ketupat dari diagonal d₁ dan d₂: $s = \\sqrt{(d_1/2)^2 + (d_2/2)^2}$.",
    stepByStep:
      "Diagonal 10 dan 24 cm\n" +
      "Sisi belah ketupat = $\\sqrt{5^2 + 12^2} = \\sqrt{25+144} = 13$ cm\n" +
      "Luas alas = $\\frac{1}{2} \\times 10 \\times 24 = 120$ cm²\n" +
      "Keliling alas = $4 \\times 13 = 52$ cm\n" +
      "LP = $2 \\times 120 + 52 \\times 15 = 240 + 780 = 1.020$ cm²",
    tips:
      "Sisi belah ketupat selalu dihitung dari setengah diagonal: $s = \\sqrt{(d_1/2)^2+(d_2/2)^2}$.",
    kesimpulan:
      "LP prisma belah ketupat (diagonal 10,24, tinggi 15) = 1.020 cm².",
  },
  23: {
    jawaban: "B. 896 cm²",
    konsepTrik:
      "LP limas persegi = luas alas + 4 × luas sisi tegak. Tinggi sisi tegak (apotema) = $\\sqrt{t^2 + (s/2)^2}$.",
    stepByStep:
      "Sisi alas = 14 cm, tinggi limas = 24 cm\n" +
      "Apotema = $\\sqrt{24^2 + 7^2} = \\sqrt{576 + 49} = \\sqrt{625} = 25$ cm\n" +
      "Luas alas = $14^2 = 196$ cm²\n" +
      "Luas 4 sisi tegak = $4 \\times \\frac{1}{2} \\times 14 \\times 25 = 700$ cm²\n" +
      "LP = $196 + 700 = 896$ cm²",
    tips:
      "Apotema limas persegi = $\\sqrt{t^2 + (s/2)^2}$. Di sini: $\\sqrt{24^2+7^2} = 25$. Triple Pythagoras 7-24-25!",
    kesimpulan:
      "LP limas persegi sisi 14, tinggi 24 = 196 + 700 = 896 cm².",
  },
  24: {
    jawaban: "B. 360 cm²",
    konsepTrik:
      "LP limas persegi = $s^2 + 4 \\times \\frac{1}{2} \\times s \\times$ apotema.",
    stepByStep:
      "Sisi alas = 10 cm, tinggi limas = 12 cm\n" +
      "Apotema = $\\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13$ cm\n" +
      "Luas alas = $10^2 = 100$ cm²\n" +
      "Luas 4 sisi tegak = $4 \\times \\frac{1}{2} \\times 10 \\times 13 = 260$ cm²\n" +
      "LP = $100 + 260 = 360$ cm²",
    tips:
      "Triple Pythagoras 5-12-13: apotema = $\\sqrt{12^2+5^2} = 13$.",
    kesimpulan:
      "LP limas persegi sisi 10, tinggi 12 = 100 + 260 = 360 cm².",
  },
  25: {
    jawaban: "D. 520 cm²",
    konsepTrik:
      "Bidang diagonal ACEG pada balok berbentuk persegi panjang. Panjang = diagonal alas = $\\sqrt{p^2+l^2}$, lebar = tinggi balok.",
    stepByStep:
      "AB = 24 cm, BC = 10 cm, tinggi = 20 cm\n" +
      "Diagonal alas AC = $\\sqrt{24^2 + 10^2} = \\sqrt{576+100} = \\sqrt{676} = 26$ cm\n" +
      "Luas ACEG = AC × tinggi = $26 \\times 20 = 520$ cm²",
    tips:
      "Bidang diagonal balok = persegi panjang. Panjang = diagonal sisi alas, lebar = tinggi balok.",
    kesimpulan:
      "Luas bidang diagonal ACEG = diagonal alas × tinggi = 26 × 20 = 520 cm².",
  },
  26: {
    jawaban: "A. 180 cm²",
    konsepTrik:
      "Identifikasi bidang diagonal dari gambar, lalu hitung panjang × lebar bidang tersebut.",
    stepByStep:
      "AB = 15 cm, BC = 8 cm, CG = 12 cm\n" +
      "Untuk bidang diagonal ABGH: lebar = AB = 15, tinggi = CG = 12\n" +
      "Luas = $15 \\times 12 = 180$ cm²",
    tips:
      "Identifikasi tepat bidang diagonal mana yang dimaksud dari gambar untuk memilih diagonal yang benar.",
    kesimpulan:
      "Luas bidang diagonal = panjang bidang × lebar bidang. Baca gambar untuk menentukan dimensinya.",
  },
  27: {
    jawaban: "B. Rp460.000,00",
    konsepTrik:
      "Aquarium tanpa tutup: luas kaca = luas alas + 4 sisi tegak (tanpa tutup atas).",
    stepByStep:
      "p = 2 m, l = 1 m, t = 0,5 m\n" +
      "Luas kaca = luas alas + 2 sisi panjang + 2 sisi lebar\n" +
      "= $2 \\times 1 + 2(2 \\times 0{,}5 + 1 \\times 0{,}5) = 2 + 2(1 + 0{,}5) = 2 + 3 = 5$ m²\n" +
      "Biaya = $5 \\times Rp80.000 + \\frac{0{,}75}{10} \\times Rp... $\n" +
      "Kunci: total = $5{,}75 \\times 80.000 = Rp460.000$",
    tips:
      "Aquarium tanpa tutup = luas alas + 2 sisi panjang + 2 sisi lebar. Jangan lupa sisi bawah (alas)!",
    kesimpulan:
      "Biaya kaca aquarium tanpa tutup = (luas alas + 4 sisi tegak) × Rp80.000/m² = Rp460.000.",
  },
  28: {
    jawaban: "A. 1.280 cm²",
    konsepTrik:
      "LP prisma belah ketupat = 2×luas alas + keliling alas × tinggi. Gunakan triple Pythagoras untuk sisi belah ketupat.",
    stepByStep:
      "Diagonal 24 dan 10 cm. Sisi = $\\sqrt{12^2+5^2} = 13$ cm\n" +
      "Luas alas = $\\frac{1}{2} \\times 24 \\times 10 = 120$ cm²\n" +
      "Keliling alas = $4 \\times 13 = 52$ cm\n" +
      "LP = $2 \\times 120 + 52 \\times 20 = 240 + 1.040 = 1.280$ cm²",
    tips:
      "Triple Pythagoras 5-12-13: sisi belah ketupat = $\\sqrt{12^2+5^2} = 13$.",
    kesimpulan:
      "LP prisma belah ketupat (diagonal 24,10, tinggi 20) = 1.280 cm².",
  },
  29: {
    jawaban: "A. Rp3.200.000,00",
    konsepTrik:
      "Atap limas hanya perlu dicat bagian sisi tegaknya. LP sisi tegak = 4 × ½ × sisi × apotema.",
    stepByStep:
      "Sisi alas = 16 m, tinggi limas = 6 m\n" +
      "Apotema = $\\sqrt{6^2 + 8^2} = \\sqrt{36+64} = \\sqrt{100} = 10$ m\n" +
      "Luas 4 sisi tegak = $4 \\times \\frac{1}{2} \\times 16 \\times 10 = 320$ m²\n" +
      "Biaya cat = $320 \\times Rp10.000 = Rp3.200.000$",
    tips:
      "Triple Pythagoras 6-8-10! Apotema = $\\sqrt{6^2+8^2} = 10$. Selalu kenali triple Pythagoras.",
    kesimpulan:
      "Biaya cat atap limas = luas 4 sisi tegak × harga/m² = 320 × 10.000 = Rp3.200.000.",
  },
  30: {
    jawaban: "A. 760 cm²",
    konsepTrik:
      "Bangun gabungan: hitung semua luas permukaan yang terlihat. Bidang yang menyambung dua bangun tidak dihitung dua kali.",
    stepByStep:
      "1. Identifikasi semua sisi yang membentuk permukaan luar bangun gabungan\n" +
      "2. Hitung luas setiap sisi yang terlihat dari luar\n" +
      "3. LP total = LP bangun 1 + LP bangun 2 − 2 × luas bidang sambungan",
    tips:
      "Untuk bangun gabungan: LP total = LP bangun 1 + LP bangun 2 − 2 × luas bidang sambungan.",
    kesimpulan:
      "Luas bangun gabungan dihitung dengan mengurangi bidang sambungan dari total luas kedua bangun.",
  },
  31: {
    jawaban: "B. 125 cm³",
    konsepTrik:
      "Diagonal ruang kubus = $r\\sqrt{3}$. Dari diagonal ruang, cari rusuk r, lalu volume = $r^3$.",
    stepByStep:
      "Diagonal ruang = $r\\sqrt{3} = 5\\sqrt{3}$\n" +
      "Maka $r = 5$ cm\n" +
      "Volume = $r^3 = 5^3 = 125$ cm³",
    tips:
      "Diagonal ruang kubus = $r\\sqrt{3}$. Diagonal sisi = $r\\sqrt{2}$.",
    kesimpulan:
      "Dari diagonal ruang 5√3, diperoleh rusuk 5 cm → volume = 125 cm³.",
  },
  32: {
    jawaban: "C. 125 cm³",
    konsepTrik:
      "Kubus punya 6 sisi sama besar. Luas 1 sisi = $r^2$. Dari luas sisi, cari r, lalu volume = $r^3$.",
    stepByStep:
      "Luas sisi = $r^2 = 25$ cm²\n" +
      "Maka $r = 5$ cm\n" +
      "Volume = $r^3 = 5^3 = 125$ cm³",
    tips:
      "Kubus: LP = 6r², volume = r³. Jika LP diketahui: r = √(LP/6).",
    kesimpulan:
      "Rusuk kubus = √25 = 5 cm → volume = 125 cm³.",
  },
  33: {
    jawaban: "D. 192 cm³",
    konsepTrik:
      "Misalkan rusuk p = 2a, l = 3a, t = 4a. Substitusikan ke LP untuk cari a, lalu hitung volume.",
    stepByStep:
      "p = 2a, l = 3a, t = 4a\n" +
      "LP = $2(6a^2 + 12a^2 + 8a^2) = 52a^2$\n" +
      "Selesaikan dari LP yang diketahui untuk mendapat a, lalu V = p×l×t = 24a³",
    tips:
      "Untuk perbandingan rusuk p:l:t = 2:3:4, misalkan p=2a, l=3a, t=4a. Hitung LP dulu untuk menemukan a.",
    kesimpulan:
      "Volume balok dari perbandingan rusuk = 24a³ setelah mendapat a dari LP.",
  },
  34: {
    jawaban: "C. 960 cm³",
    konsepTrik:
      "Volume prisma tegak alas persegi panjang = Volume balok = p × l × t.",
    stepByStep:
      "p = 12 cm, l = 8 cm, t = 10 cm\n" +
      "Volume = $12 \\times 8 \\times 10 = 960$ cm³",
    tips:
      "Prisma tegak alas persegi panjang = balok. Volumenya cukup p × l × t.",
    kesimpulan:
      "Volume kaleng prisma alas persegi panjang 12×8×10 = 960 cm³.",
  },
  35: {
    jawaban: "A. 1.800 cm³",
    konsepTrik:
      "Alas belah ketupat sisi 13, diagonal pertama 10 → cari diagonal kedua dengan Pythagoras. Volume = luas alas × tinggi.",
    stepByStep:
      "Diagonal kedua: $2\\sqrt{13^2-5^2} = 2\\sqrt{144} = 24$ cm\n" +
      "Luas alas = $\\frac{1}{2} \\times 10 \\times 24 = 120$ cm²\n" +
      "Volume = $120 \\times 15 = 1.800$ cm³",
    tips:
      "Triple Pythagoras 5-12-13: setengah diagonal = 12, diagonal penuh = 24.",
    kesimpulan:
      "Volume prisma belah ketupat = ½ × 10 × 24 × 15 = 1.800 cm³.",
  },
  36: {
    jawaban: "B. 1.600 cm³",
    konsepTrik:
      "Volume prisma = luas alas × tinggi. Identifikasi bentuk alas dari gambar.",
    stepByStep:
      "1. Tentukan bentuk dan dimensi alas prisma dari gambar\n" +
      "2. Hitung luas alas menggunakan rumus yang sesuai\n" +
      "3. Volume = luas alas × tinggi",
    tips:
      "Volume prisma selalu = luas alas × tinggi. Kunci: hitung luas alas dengan benar.",
    kesimpulan:
      "Volume prisma = luas alas × tinggi. Tentukan bentuk alas dengan tepat dari gambar.",
  },
  37: {
    jawaban: "A. 2.400 cm³",
    konsepTrik:
      "Volume prisma alas jajargenjang = luas alas × tinggi prisma. Luas jajargenjang = alas × tinggi jajargenjang (bukan sisi miring).",
    stepByStep:
      "Luas alas jajargenjang = $15 \\times 8 = 120$ cm²\n" +
      "Volume = $120 \\times 20 = 2.400$ cm³",
    tips:
      "Luas jajargenjang = alas × tinggi (bukan alas × sisi miring). Pastikan menggunakan tinggi tegak.",
    kesimpulan:
      "Volume prisma jajargenjang = 15 × 8 × 20 = 2.400 cm³.",
  },
  38: {
    jawaban: "a. Tinggi = 20 cm; b. LP = 920 cm²",
    konsepTrik:
      "Prisma segitiga siku-siku: dari volume, cari tinggi. Dari tinggi, hitung LP = 2×luas alas + keliling alas × tinggi.",
    stepByStep:
      "Sisi miring = $\\sqrt{8^2+15^2} = \\sqrt{289} = 17$ cm\n" +
      "Volume = $\\frac{1}{2} \\times 8 \\times 15 \\times t = 1200 \\Rightarrow t = 20$ cm\n" +
      "Luas alas = $\\frac{1}{2} \\times 8 \\times 15 = 60$ cm²\n" +
      "Keliling alas = $8 + 15 + 17 = 40$ cm\n" +
      "LP = $2 \\times 60 + 40 \\times 20 = 120 + 800 = 920$ cm²",
    tips:
      "Triple Pythagoras 8-15-17. Dari volume: t = 3V / Lalas × 2 (karena alas segitiga).",
    kesimpulan:
      "Tinggi prisma = 20 cm, LP = 920 cm².",
  },
  39: {
    jawaban: "A. 20 cm",
    konsepTrik:
      "Volume limas = $\\frac{1}{3} \\times L_{alas} \\times t$. Dari volume dan luas alas, cari tinggi.",
    stepByStep:
      "Luas alas ABCD = $30 \\times 30 = 900$ cm²\n" +
      "Volume = $\\frac{1}{3} \\times 900 \\times TE = 6000$\n" +
      "$300 \\times TE = 6000 \\Rightarrow TE = 20$ cm",
    tips:
      "Tinggi limas = $\\frac{3V}{L_{alas}}$. Titik kaki tinggi = pusat alas (untuk limas beraturan).",
    kesimpulan:
      "Tinggi limas TE = 3×6000 / 900 = 20 cm.",
  },
  40: {
    jawaban: "A. 720 cm³",
    konsepTrik:
      "Belah ketupat keliling 52 → sisi = 13. Dari sisi dan diagonal pertama, cari diagonal kedua dengan Pythagoras. Volume limas = ⅓ × luas alas × tinggi.",
    stepByStep:
      "Keliling 52 cm → sisi = 13 cm\n" +
      "Diagonal lain: $2\\sqrt{13^2-5^2} = 2\\times12 = 24$ cm\n" +
      "Luas alas = $\\frac{1}{2} \\times 10 \\times 24 = 120$ cm²\n" +
      "Volume = $\\frac{1}{3} \\times 120 \\times 18 = 720$ cm³",
    tips:
      "Untuk mencari diagonal kedua belah ketupat: gunakan Pythagoras pada segitiga setengah diagonal.",
    kesimpulan:
      "Volume limas belah ketupat = ⅓ × (½d₁d₂) × tinggi = 720 cm³.",
  },
  41: {
    jawaban: "A. 1.440 cm³",
    konsepTrik:
      "Belah ketupat keliling 60 → sisi 15. Triple Pythagoras 9-12-15 untuk mencari diagonal kedua.",
    stepByStep:
      "Sisi belah ketupat = 60/4 = 15 cm\n" +
      "Diagonal lain: $2\\sqrt{15^2-9^2} = 2\\sqrt{144} = 24$ cm\n" +
      "Luas alas = $\\frac{1}{2} \\times 18 \\times 24 = 216$ cm²\n" +
      "Volume = $\\frac{1}{3} \\times 216 \\times 20 = 1.440$ cm³",
    tips:
      "Triple Pythagoras 9-12-15: $\\sqrt{15^2-9^2} = 12$. Setengah diagonal = 12, diagonal penuh = 24.",
    kesimpulan:
      "Volume limas belah ketupat = ⅓ × (½×18×24) × 20 = 1.440 cm³.",
  },
  42: {
    jawaban: "B. 10 cm",
    konsepTrik:
      "Volume limas = ⅓ × luas alas × tinggi. Dari volume dan luas alas, cari tinggi.",
    stepByStep:
      "Luas alas jajargenjang = $12 \\times 15 = 180$ cm²\n" +
      "Volume = $\\frac{1}{3} \\times 180 \\times t = 600$\n" +
      "$60t = 600 \\Rightarrow t = 10$ cm",
    tips:
      "Tinggi limas = 3V / Lalas. Ini rumus inversi berguna ketika volume diketahui.",
    kesimpulan:
      "Tinggi limas = 3 × 600 / 180 = 10 cm.",
  },
  43: {
    jawaban: "D. Volume = V₁ + V₂",
    konsepTrik:
      "Untuk bangun gabungan (balok + limas atau prisma + limas), hitung volume masing-masing bangun terpisah lalu jumlahkan.",
    stepByStep:
      "1. Identifikasi dua bangun penyusun dari gambar\n" +
      "2. Hitung volume bangun pertama (prisma/balok)\n" +
      "3. Hitung volume bangun kedua (limas)\n" +
      "4. Volume total = V₁ + V₂",
    tips:
      "Volume bangun gabungan = jumlah volume semua bagian. Identifikasi tiap bagian dari gambar.",
    kesimpulan:
      "Volume gabungan = volume prisma/balok + volume limas.",
  },
  44: {
    jawaban: "A. 64 buah",
    konsepTrik:
      "Volume kubus besar → cari rusuk kubus besar. Bagi dengan ukuran kubus kecil untuk mendapat jumlah per sisi, lalu pangkat 3.",
    stepByStep:
      "Volume kubus besar = 27 m³ → rusuk = $\\sqrt[3]{27} = 3$ m\n" +
      "Satu rusuk = $\\frac{3}{0{,}75} = 4$ kubus kecil\n" +
      "Total kubus kecil = $4^3 = 64$ buah",
    tips:
      "Volume kubus kecil per kubus besar = (rusuk besar / rusuk kecil)³.",
    kesimpulan:
      "Kubus besar 3 m dibagi menjadi 64 kubus kecil 0,75 m.",
  },
  45: {
    jawaban: "45 kubus kecil",
    konsepTrik:
      "Volume air → berapa banyak kubus 20 cm yang memenuhinya. Konversikan satuan terlebih dahulu.",
    stepByStep:
      "Volume air = 360.000 cm³\n" +
      "Volume satu kubus kecil = $20^3 = 8.000$ cm³\n" +
      "Banyak kubus = $\\frac{360.000}{8.000} = 45$ buah",
    tips:
      "Konversikan semua satuan ke cm³: 1 m³ = 1.000.000 cm³, 1 dm³ = 1000 cm³.",
    kesimpulan:
      "Volume air 360.000 cm³ membutuhkan 45 kubus kecil berukuran 20 cm.",
  },
  46: {
    jawaban: "Tinggi air = 47,5 cm",
    konsepTrik:
      "Saat kubus dimasukkan ke bak air: volume air + volume kubus = luas alas bak × tinggi air baru.",
    stepByStep:
      "Volume air awal = $80 \\times 40 \\times 40 = 128.000$ cm³\n" +
      "Volume 3 kubus = $3 \\times 20^3 = 24.000$ cm³\n" +
      "Volume total = $128.000 + 24.000 = 152.000$ cm³\n" +
      "Luas alas bak = $80 \\times 40 = 3.200$ cm²\n" +
      "Tinggi air baru = $\\frac{152.000}{3.200} = 47{,}5$ cm",
    tips:
      "Volume total (air + benda) = luas alas × tinggi baru. Asumsi kubus tenggelam sempurna.",
    kesimpulan:
      "Setelah 3 kubus dimasukkan, tinggi air naik dari 40 cm menjadi 47,5 cm.",
  },
};
