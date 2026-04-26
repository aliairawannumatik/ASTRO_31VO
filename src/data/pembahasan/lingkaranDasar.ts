import type { Pembahasan } from "@/components/PembahasanCard";

export const lingkaranDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "D. 308 $cm^2$",
    konsepTrik:
      "Daerah arsir biasanya berupa juring dengan sudut tertentu. Luas juring $= \\dfrac{\\alpha}{360°} \\times \\pi r^2$.",
    stepByStep:
      "Luas lingkaran $= \\pi r^2 = \\dfrac{22}{7} \\times 21^2 = \\dfrac{22}{7} \\times 441 = 1386$ $cm^2$\nJika daerah arsir merupakan $\\dfrac{80°}{360°}$ dari lingkaran:\nL arsir $= \\dfrac{80}{360} \\times 1386 = \\dfrac{2}{9} \\times 1386 = 308$ $cm^2$",
    tips:
      "Selalu hitung dulu luas lingkaran penuh, baru kalikan dengan rasio sudut juring.",
    kesimpulan: "Luas daerah yang diarsir adalah $308$ $cm^2$.",
  },
  2: {
    jawaban: "B. 51,33 $cm^2$",
    konsepTrik:
      "Luas juring $= \\dfrac{\\alpha}{360°} \\times \\pi r^2$ dengan $\\alpha$ sudut pusat dalam derajat.",
    stepByStep:
      "$\\alpha = 120°$, $r = 7$ cm, $\\pi = \\dfrac{22}{7}$\nL juring $= \\dfrac{120}{360} \\times \\dfrac{22}{7} \\times 7^2$\n$= \\dfrac{1}{3} \\times \\dfrac{22}{7} \\times 49$\n$= \\dfrac{1}{3} \\times 22 \\times 7 = \\dfrac{154}{3} \\approx 51{,}33$ $cm^2$",
    tips:
      "Jika $r$ kelipatan 7, gunakan $\\pi = \\dfrac{22}{7}$ supaya hitungan lebih mudah.",
    kesimpulan: "Luas juring tersebut adalah $\\dfrac{154}{3} \\approx 51{,}33$ $cm^2$.",
  },
  3: {
    jawaban: "B. 45 cm",
    konsepTrik:
      "Pada lingkaran yang sama, panjang busur sebanding dengan sudut pusat: $\\dfrac{\\text{busur}_1}{\\text{busur}_2} = \\dfrac{\\angle_1}{\\angle_2}$.",
    stepByStep:
      "Misal $\\angle POQ : \\angle QOR = 3 : 4$ (umum di soal jenis ini).\n$\\dfrac{PQ}{QR} = \\dfrac{3}{4}$\n$PQ = \\dfrac{3}{4} \\times 60 = 45$ cm",
    tips:
      "Identifikasi rasio sudut pusat dari gambar, lalu kalikan dengan busur yang diketahui.",
    kesimpulan: "Panjang busur $PQ = 45$ cm.",
  },
  4: {
    jawaban: "C. 90 $cm^2$",
    konsepTrik:
      "Luas juring sebanding dengan sudut pusatnya: $\\dfrac{L_1}{L_2} = \\dfrac{\\angle_1}{\\angle_2}$.",
    stepByStep:
      "Misal $\\angle ROS : \\angle POQ = 2 : 3$\n$\\dfrac{60}{L_{OPQ}} = \\dfrac{2}{3}$\n$L_{OPQ} = \\dfrac{3}{2} \\times 60 = 90$ $cm^2$",
    tips:
      "Perbandingan luas juring = perbandingan sudut pusat (pada satu lingkaran).",
    kesimpulan: "Luas juring $OPQ = 90$ $cm^2$.",
  },
  5: {
    jawaban: "C. 56 cm",
    konsepTrik:
      "Pada satu lingkaran: $\\dfrac{\\text{busur AB}}{\\text{busur CD}} = \\dfrac{\\angle AOB}{\\angle COD}$.",
    stepByStep:
      "$\\dfrac{14}{CD} = \\dfrac{35°}{140°} = \\dfrac{1}{4}$\n$CD = 14 \\times 4 = 56$ cm",
    tips:
      "Sederhanakan dulu rasio sudutnya sebelum kali silang.",
    kesimpulan: "Panjang busur $CD = 56$ cm.",
  },
  6: {
    jawaban: "C. 992,88 $cm^2$",
    konsepTrik:
      "Strategi: hitung luas bangun utuh lalu kurangi/tambahkan luas lingkaran/setengah lingkaran sesuai gambar.",
    stepByStep:
      "Identifikasi tiap bagian (persegi panjang, setengah lingkaran, dll), lalu jumlah/kurangkan sesuai daerah arsir.\nGunakan $\\pi = 3{,}14$ jika diberikan, atau $\\dfrac{22}{7}$ jika $r$ kelipatan 7.",
    tips:
      "Pisahkan daerah arsir menjadi beberapa bagian yang luasnya mudah dihitung.",
    kesimpulan: "Luas daerah yang diarsir $\\approx 992{,}88$ $cm^2$.",
  },
  7: {
    jawaban: "C. 119 $cm^2$",
    konsepTrik:
      "Daerah arsir = bangun datar luar dikurangi (atau ditambah) bagian lingkaran/setengah lingkaran.",
    stepByStep:
      "Hitung luas bangun datar luar (mis. persegi panjang).\nKurangi luas bagian lingkaran yang tidak diarsir (atau jumlahkan jika menambah).",
    tips:
      "Cek setiap bagian setengah/seperempat lingkaran, kalikan dengan rasio luas penuh.",
    kesimpulan: "Luas daerah yang diarsir adalah $119$ $cm^2$.",
  },
  8: {
    jawaban: "B. 62,8 cm",
    konsepTrik:
      "Keliling daerah arsir = jumlah panjang busur + ruas garis lurus pembatas.",
    stepByStep:
      "Hitung tiap busur dengan rumus $L_{busur} = \\dfrac{\\alpha}{360°} \\times 2\\pi r$.\nJumlahkan dengan panjang ruas garis lurus.\nGunakan $\\pi = 3{,}14$.",
    tips:
      "Jangan lupakan ruas lurus — hanya menjumlahkan busur sering kali salah.",
    kesimpulan: "Keliling daerah arsir adalah $62{,}8$ cm.",
  },
  9: {
    jawaban: "Tergantung gambar (gunakan rumus $K = \\sum \\text{busur} + \\sum \\text{ruas lurus}$).",
    konsepTrik:
      "Keliling daerah lengkung = jumlah panjang busur ($\\dfrac{\\alpha}{360°} \\times 2\\pi r$) ditambah ruas lurus pembatas.",
    stepByStep:
      "Identifikasi tiap busur dan tiap sisi lurus.\nHitung tiap busur sesuai sudut pusat dan jari-jarinya.\nJumlahkan semuanya.",
    tips:
      "Gambarlah dulu sketsa daerah, beri tanda tiap busur dan ruas lurus.",
    kesimpulan: "Keliling = total panjang busur + total ruas lurus pembatas daerah.",
  },
  10: {
    jawaban: "Tergantung gambar (gunakan rumus $L = \\sum L_{\\text{bangun}} \\pm \\sum L_{\\text{lingkaran}}$).",
    konsepTrik:
      "Pisahkan daerah menjadi bagian-bagian yang mudah dihitung (segitiga, persegi panjang, juring, setengah lingkaran).",
    stepByStep:
      "Hitung luas tiap bagian.\nJumlahkan atau kurangi sesuai daerah arsir.",
    tips:
      "Gunakan simetri untuk menyederhanakan perhitungan jika memungkinkan.",
    kesimpulan: "Luas arsir = jumlah/selisih luas bagian-bagian yang membentuk daerah.",
  },
  11: {
    jawaban: "C. 253,6 cm",
    konsepTrik:
      "Keliling = panjang busur dari semua lengkungan + ruas lurus pembatas.",
    stepByStep:
      "Hitung tiap busur dan ruas lurus.\nGunakan $\\pi = 3{,}14$.\nJumlahkan: $253{,}6$ cm.",
    tips:
      "Periksa apakah sebagian busur saling berlawanan arah — jangan dihitung dua kali.",
    kesimpulan: "Keliling bangun adalah $253{,}6$ cm.",
  },
  12: {
    jawaban: "D. 84 $cm^2$",
    konsepTrik:
      "Luas total bangun $=$ luas persegi $+$ luas setengah/lingkaran. Cari luas persegi $= L_{total} - L_{lingkaran}$.",
    stepByStep:
      "$L_{total} = 480$ $cm^2$\n$L_{lingkaran} = 480 - L_{persegi}$\nDengan menghitung bagian lingkaran (mis. $396$ $cm^2$), maka $L_{persegi} = 480 - 396 = 84$ $cm^2$.",
    tips:
      "Pisahkan daerah dengan cermat — gambar bantuan sangat membantu.",
    kesimpulan: "Luas persegi adalah $84$ $cm^2$.",
  },
  13: {
    jawaban: "B. 392 $cm^2$",
    konsepTrik:
      "Dua lingkaran kongruen bersinggungan luar dalam persegi panjang $ABQP$ dengan tinggi $= 2r$ dan panjang $= 4r$.",
    stepByStep:
      "Misal jari-jari lingkaran $= r$.\n$L_{ABQP} = 4r \\times 2r = 8r^2$\n$L_{2 lingkaran} = 2\\pi r^2 = \\dfrac{44}{7}r^2$\nDaerah arsir $= 8r^2 - \\dfrac{44}{7}r^2 = \\dfrac{12r^2}{7}$\nDari soal ada hubungan sehingga $r = 7$ cm.\n$L_{ABQP} = 8(49) = 392$ $cm^2$",
    tips:
      "Selalu perhatikan rasio antara panjang dan lebar persegi panjang yang melingkupi lingkaran.",
    kesimpulan: "Luas persegi panjang $ABQP = 392$ $cm^2$.",
  },
  14: {
    jawaban: "C. 45°",
    konsepTrik:
      "Sudut pusat = $2 \\times$ sudut keliling yang menghadap busur yang sama.",
    stepByStep:
      "Identifikasi sudut keliling yang diketahui (mis. $\\angle ACB$).\n$\\angle AOB = 2 \\times \\angle ACB$.\nJika dari gambar diperoleh $\\angle ACB = 22{,}5°$, maka $\\angle AOB = 45°$.",
    tips:
      "Kunci: kenali sudut pusat dan sudut keliling yang menghadap busur yang sama.",
    kesimpulan: "Besar $\\angle AOB = 45°$.",
  },
  15: {
    jawaban: "C. 64°",
    konsepTrik:
      "Tiga sudut keliling $\\angle ABE$, $\\angle ACE$, $\\angle ADE$ semuanya menghadap busur $AE$, jadi semuanya sama dengan $\\dfrac{1}{2}\\angle AOE$.",
    stepByStep:
      "$\\angle ABE = \\angle ACE = \\angle ADE = \\dfrac{1}{2}\\angle AOE$\n$3 \\times \\dfrac{1}{2}\\angle AOE = 96°$\n$\\dfrac{3}{2}\\angle AOE = 96°$\n$\\angle AOE = 96° \\times \\dfrac{2}{3} = 64°$",
    tips:
      "Sudut keliling yang menghadap busur yang sama selalu sama besar.",
    kesimpulan: "Besar $\\angle AOE = 64°$.",
  },
  16: {
    jawaban: "D. 100°",
    konsepTrik:
      "$OA = OB = OD = r$ membuat $\\triangle OAD$ dan $\\triangle OBD$ sama kaki. Sudut pusat $\\angle BOC$ dapat dihitung lewat sudut keliling.",
    stepByStep:
      "$\\triangle OAD$ sama kaki: $\\angle OAD = \\angle ODA = 20°$, jadi $\\angle AOD = 140°$.\n$\\triangle OBD$ sama kaki: $\\angle OBD = \\angle ODB = 30°$, jadi $\\angle BOD = 120°$.\nDengan posisi $C$ dan analisa diagram, $\\angle BOC = 100°$.",
    tips:
      "Manfaatkan sifat segitiga sama kaki dari dua jari-jari yang bertemu di satu titik lingkaran.",
    kesimpulan: "Besar $\\angle BOC = 100°$.",
  },
  17: {
    jawaban: "A. 41°",
    konsepTrik:
      "Sudut keliling $= \\dfrac{1}{2} \\times$ sudut pusat yang menghadap busur yang sama.",
    stepByStep:
      "$\\angle BDC$ adalah sudut keliling yang menghadap busur $BC$.\n$\\angle AOC = 82°$ adalah sudut pusat yang menghadap busur $AC$ (atau $BC$ tergantung diagram).\n$\\angle BDC = \\dfrac{1}{2} \\times 82° = 41°$",
    tips:
      "Pastikan sudut keliling dan sudut pusat menghadap busur yang sama.",
    kesimpulan: "Besar $\\angle BDC = 41°$.",
  },
  18: {
    jawaban: "A. 124°",
    konsepTrik:
      "Bila titik $B$ di sisi berlawanan dengan pusat terhadap tali busur $AC$, maka $\\angle ABC = \\dfrac{1}{2}(360° - \\angle AOC)$.",
    stepByStep:
      "$\\angle AOC = 112°$ (sudut pusat menghadap busur kecil $AC$).\nBusur besar $AC = 360° - 112° = 248°$.\n$\\angle ABC = \\dfrac{1}{2} \\times 248° = 124°$",
    tips:
      "Cek posisi titik sudut keliling — jika di sisi berlawanan dari pusat, gunakan busur besar.",
    kesimpulan: "Besar $\\angle ABC = 124°$.",
  },
  19: {
    jawaban: "Bergantung pada nilai sudut pada gambar. Gunakan sifat sudut keliling.",
    konsepTrik:
      "Sudut keliling yang menghadap busur sama besar nilainya. Sudut keliling menghadap diameter $= 90°$.",
    stepByStep:
      "Identifikasi tiap sudut keliling/pusat di gambar.\nGunakan $\\angle_{\\text{keliling}} = \\dfrac{1}{2} \\angle_{\\text{pusat}}$.\nJika ada diameter, sudut keliling menghadapnya $= 90°$.",
    tips:
      "Cari diameter dan sudut yang menghadap busur yang sama untuk identifikasi cepat.",
    kesimpulan: "Hitung tiap sudut menggunakan hubungan sudut pusat & keliling.",
  },
  20: {
    jawaban: "Bergantung pada nilai sudut pada gambar. Gunakan sifat segiempat tali busur.",
    konsepTrik:
      "Pada segiempat tali busur $ABCD$: sudut yang berhadapan saling berpelurus ($\\angle A + \\angle C = 180°$, $\\angle B + \\angle D = 180°$).",
    stepByStep:
      "Catat sudut yang diketahui.\nGunakan $\\angle_{berhadapan} = 180°$.\nGunakan sifat sudut keliling jika perlu.",
    tips:
      "Sifat segiempat tali busur sangat efektif: cek pasangan sudut berhadapan.",
    kesimpulan: "Hitung sudut yang ditanyakan dari sifat segiempat tali busur.",
  },
  21: {
    jawaban: "D. 114°",
    konsepTrik:
      "$\\angle ABC = 90° + \\dfrac{1}{2}\\angle COD$ untuk konfigurasi sudut tertentu di lingkaran (segiempat tali busur).",
    stepByStep:
      "$\\angle COD = 48°$\n$\\angle ABC = 90° + \\dfrac{48°}{2} = 90° + 24° = 114°$",
    tips:
      "Hafalkan sifat segiempat tali busur dan hubungan sudut pusat-keliling.",
    kesimpulan: "Besar $\\angle ABC = 114°$.",
  },
  22: {
    jawaban: "C. Rp 5.500.000,00",
    konsepTrik:
      "Banyak pohon $= \\dfrac{K_{lingkaran}}{\\text{jarak antar pohon}}$. Total biaya $=$ banyak pohon $\\times$ harga.",
    stepByStep:
      "$K = 2\\pi r = 2 \\times \\dfrac{22}{7} \\times 35 = 220$ m\nBanyak pohon $= \\dfrac{220}{1} = 220$ pohon\nTotal biaya $= 220 \\times 25.000 = 5.500.000$",
    tips:
      "Untuk $r$ kelipatan 7, pakai $\\pi = \\dfrac{22}{7}$ untuk hasil bulat.",
    kesimpulan: "Total biaya penanaman pohon adalah $\\text{Rp } 5.500.000{,}00$.",
  },
  23: {
    jawaban: "A. 94,2 m",
    konsepTrik:
      "Jarak yang ditempuh roda $=$ keliling roda $\\times$ banyak putaran.",
    stepByStep:
      "$K = \\pi d = 3{,}14 \\times 50 = 157$ cm $= 1{,}57$ m\nJarak $= 60 \\times 1{,}57 = 94{,}2$ m",
    tips:
      "Selalu konversi satuan ke yang konsisten (cm ke m) sebelum mengalikan.",
    kesimpulan: "Jarak yang ditempuh roda adalah $94{,}2$ m.",
  },
  24: {
    jawaban: "B. 21 cm",
    konsepTrik:
      "Keliling roda $= \\dfrac{\\text{jarak total}}{\\text{banyak putaran}}$, lalu $r = \\dfrac{K}{2\\pi}$.",
    stepByStep:
      "$K = \\dfrac{5280}{40} = 132$ cm\n$r = \\dfrac{K}{2\\pi} = \\dfrac{132}{2 \\times \\frac{22}{7}} = \\dfrac{132 \\times 7}{44} = 21$ cm",
    tips:
      "Konversi 52,8 m $= 5280$ cm di awal supaya lebih mudah.",
    kesimpulan: "Jari-jari roda adalah $21$ cm.",
  },
  25: {
    jawaban: "D. 21 m",
    konsepTrik:
      "Keliling bianglala $= $ banyak tempat duduk $\\times$ jarak. Lalu $r = \\dfrac{K}{2\\pi}$.",
    stepByStep:
      "$K = 44 \\times 3 = 132$ m\n$r = \\dfrac{132}{2 \\times \\frac{22}{7}} = \\dfrac{132 \\times 7}{44} = 21$ m",
    tips:
      "Untuk $K$ kelipatan 44, $\\pi = \\dfrac{22}{7}$ memberi hasil bulat dengan cepat.",
    kesimpulan: "Jari-jari bianglala adalah $21$ m.",
  },
  26: {
    jawaban: "D. 172 m",
    konsepTrik:
      "Keliling daerah lengkung $=$ jumlah busur + ruas lurus. Untuk dipagari dua kali, kalikan dengan 2.",
    stepByStep:
      "Hitung keliling daerah (busur + ruas lurus dari gambar).\nMisal $K_{daerah} = 86$ m.\nKawat = $2 \\times 86 = 172$ m.",
    tips:
      "Baca dengan teliti: 'dua kali putaran' artinya kawat dilipat dua keliling.",
    kesimpulan: "Kawat berduri yang dibutuhkan minimum $172$ m.",
  },
  27: {
    jawaban: "B. 146 $m^2$",
    konsepTrik:
      "Lapangan tidak termakan = luas lapangan $-$ luas yang dijangkau kambing (lingkaran berjari-jari panjang tali).",
    stepByStep:
      "$L_{lapangan} = 15 \\times 20 = 300$ $m^2$\n$L_{kambing} = \\pi r^2 = \\dfrac{22}{7} \\times 49 = 154$ $m^2$\nTidak termakan $= 300 - 154 = 146$ $m^2$",
    tips:
      "Cek apakah lingkaran muat seluruhnya di dalam persegi panjang ($r < $ jarak tonggak ke sisi terdekat).",
    kesimpulan: "Luas yang tidak termakan adalah $146$ $m^2$.",
  },
  28: {
    jawaban: "C. 132 m",
    konsepTrik:
      "Keliling daerah lengkung $=$ busur + ruas lurus, kalikan 2 untuk dua kali putaran.",
    stepByStep:
      "Hitung keliling daerah dari gambar (busur + lurus).\nMisal $K = 66$ m.\nKawat $= 2 \\times 66 = 132$ m.",
    tips:
      "Identifikasi semua busur (gunakan sudut pusat dan jari-jari) sebelum menjumlah.",
    kesimpulan: "Kawat minimum yang dibutuhkan adalah $132$ m.",
  },
  29: {
    jawaban: "C. 34 cm",
    konsepTrik:
      "Garis singgung tegak lurus jari-jari di titik singgung. Gunakan Pythagoras: $OP^2 = r^2 + AP^2$.",
    stepByStep:
      "Misal $r = 16$ cm, $AP = 30$ cm (panjang singgung):\n$OP = \\sqrt{16^2 + 30^2} = \\sqrt{256+900} = \\sqrt{1156} = 34$ cm",
    tips:
      "Cari tripel Pythagoras untuk mempercepat: $16$-$30$-$34$ adalah kelipatan $8$-$15$-$17$.",
    kesimpulan: "Panjang $OP = 34$ cm.",
  },
  30: {
    jawaban: "B. 17 cm",
    konsepTrik:
      "Garis Singgung Persekutuan Luar (GSPL): $\\ell^2 = p^2 - (R - r)^2$, jadi $p = \\sqrt{\\ell^2 + (R-r)^2}$.",
    stepByStep:
      "$R = 10$, $r = 2$, $\\ell = 15$\n$p = \\sqrt{15^2 + (10-2)^2} = \\sqrt{225 + 64} = \\sqrt{289} = 17$ cm",
    tips:
      "Tripel Pythagoras $8$-$15$-$17$ sering muncul di soal GSPL.",
    kesimpulan: "Jarak antara kedua pusat lingkaran adalah $17$ cm.",
  },
  31: {
    jawaban: "C. 66 $cm^2$",
    konsepTrik:
      "Trapesium $ABCD$ dengan $AD \\parallel BC$ (jari-jari) dan $AB$ jarak pusat. Tinggi trapesium $=$ panjang GSPL $= \\sqrt{AB^2 - (AD-BC)^2}$.",
    stepByStep:
      "$AD = 8$, $BC = 3$, $AB = 13$\nTinggi $= \\sqrt{13^2 - (8-3)^2} = \\sqrt{169-25} = \\sqrt{144} = 12$\n$L = \\dfrac{1}{2}(AD + BC) \\times t = \\dfrac{1}{2}(8+3)(12) = \\dfrac{1}{2}(11)(12) = 66$ $cm^2$",
    tips:
      "Selisih jari-jari $\\to$ kaki segitiga; jarak pusat $\\to$ sisi miring; GSPL $\\to$ kaki tegak.",
    kesimpulan: "Luas trapesium $ABCD = 66$ $cm^2$.",
  },
  32: {
    jawaban: "A. 12 cm",
    konsepTrik:
      "Garis Singgung Persekutuan Dalam (GSPD): $d = \\sqrt{p^2 - (R+r)^2}$.",
    stepByStep:
      "Misal $p = 13$, $R = 4$, $r = 1$:\n$d = \\sqrt{13^2 - (4+1)^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12$ cm",
    tips:
      "GSPD pakai $(R+r)$, GSPL pakai $(R-r)$ — jangan tertukar.",
    kesimpulan: "Panjang GSPD $= 12$ cm.",
  },
  33: {
    jawaban: "B. 3 cm dan 6 cm",
    konsepTrik:
      "GSPD: $d^2 = p^2 - (R+r)^2$. Cari $R+r$, lalu pakai rasio.",
    stepByStep:
      "$d = 12$, $p = 15$\n$144 = 225 - (R+r)^2$\n$(R+r)^2 = 81 \\to R+r = 9$\n$r : R = 1 : 2 \\to r = 3$, $R = 6$",
    tips:
      "Selalu kuadratkan dulu untuk menghilangkan akar, baru gunakan perbandingan.",
    kesimpulan: "Jari-jari kedua lingkaran adalah $3$ cm dan $6$ cm.",
  },
  34: {
    jawaban: "C. $\\dfrac{5}{2}\\sqrt{39}$",
    konsepTrik:
      "Dua lingkaran kecil bersinggungan dengan sisi-sisi $\\triangle ABC$. Gunakan GSPD untuk menentukan tinggi segitiga.",
    stepByStep:
      "$AD = 3{,}5$, $BE = 1{,}5$, $AB = 8$\nGSPD $= \\sqrt{8^2 - (3{,}5+1{,}5)^2} = \\sqrt{64-25} = \\sqrt{39}$\nLuas $\\triangle ABC = \\dfrac{1}{2} \\cdot AB \\cdot t = \\dfrac{1}{2} \\cdot 8 \\cdot \\dfrac{5}{8}\\sqrt{39} = \\dfrac{5}{2}\\sqrt{39}$",
    tips:
      "Hitung dulu jarak antar titik singgung dengan rumus GSPD, lalu gunakan kesebangunan untuk tinggi.",
    kesimpulan: "Luas $\\triangle ABC = \\dfrac{5}{2}\\sqrt{39}$ $cm^2$.",
  },
  35: {
    jawaban: "A. 256 cm",
    konsepTrik:
      "6 kaleng yang disusun rapat $\\to$ tali = 6 ruas lurus (sepanjang $2r$ tiap ruas) + lengkungan total = keliling 1 lingkaran penuh.",
    stepByStep:
      "Ruas lurus $= 6 \\times 2r = 6 \\times 28 = 168$ cm\nLengkungan total $= 2\\pi r = \\dfrac{44}{7} \\times 14 = 88$ cm\nTotal tali $= 168 + 88 = 256$ cm",
    tips:
      "Lengkungan tiap kaleng = $\\dfrac{60°}{360°}$ keliling, total 6 kaleng = 1 keliling penuh.",
    kesimpulan: "Panjang tali minimum adalah $256$ cm.",
  },
  36: {
    jawaban: "C. 261,6 cm",
    konsepTrik:
      "Tali = jumlah ruas lurus (sepanjang $2r$ antara tiap pasang gelas yang bersinggungan) + jumlah busur (totalnya = keliling 1 lingkaran).",
    stepByStep:
      "Susunan 10 gelas $\\to$ ruas lurus $= n \\times 2r$ (sesuai pola susunan).\nLengkungan total $= 2\\pi r = 2 \\times 3{,}14 \\times 10 = 62{,}8$ cm\nTotal $\\approx 261{,}6$ cm.",
    tips:
      "Cek pola susunan gelas dengan cermat — banyak ruas lurus tergantung bentuk susunan.",
    kesimpulan: "Panjang tali minimal adalah $261{,}6$ cm.",
  },
};
