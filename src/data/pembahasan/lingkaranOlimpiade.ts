import type { Pembahasan } from "@/components/PembahasanCard";

export const lingkaranOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "B. 32 $cm^2$",
    konsepTrik:
      "Persegi yang titik sudutnya pada lingkaran $\\to$ diagonal persegi $=$ diameter lingkaran. Luas persegi $= \\dfrac{1}{2}d^2$.",
    stepByStep:
      "Diagonal $d = 2r = 8$ cm\nLuas persegi $= \\dfrac{1}{2}d^2 = \\dfrac{1}{2}(64) = 32$ $cm^2$",
    tips:
      "Untuk persegi inscribed, gunakan langsung $L = \\dfrac{1}{2}d^2$ tanpa mencari sisi.",
    kesimpulan: "Luas persegi $ABCD = 32$ $cm^2$.",
  },
  2: {
    jawaban: "$b = 10$ $cm^2$",
    konsepTrik:
      "Berdasar simetri konfigurasi 5 lingkaran kongruen di dalam lingkaran besar, daerah-daerah simetris memiliki luas yang sama atau berhubungan linear.",
    stepByStep:
      "Identifikasi daerah $a$ (di dalam lingkaran besar tetapi luar 4 lingkaran sudut) dan $b$ (di luar lingkaran tengah).\nGunakan simetri: tiap kuadran memiliki bagian $a$ dan $b$ yang luasnya sama-besar berdasar konfigurasi geometri.\n$a = b = 10$ $cm^2$.",
    tips:
      "Saat melihat 5 lingkaran simetris (4 sudut + 1 tengah), cari hubungan luas yang invarian terhadap rotasi $90°$.",
    kesimpulan: "Luas $b = 10$ $cm^2$.",
  },
  3: {
    jawaban: "B. $\\dfrac{1}{3}\\sqrt{3}$",
    konsepTrik:
      "Luas arsir $= \\dfrac{1}{2}$ luas tidak diarsir $\\to$ luas arsir $= \\dfrac{1}{3}$ luas total. Hubungkan luas tiap bagian dengan kuadrat panjang ruas.",
    stepByStep:
      "Luas arsir $= \\dfrac{1}{3}$ total\nUntuk konfigurasi sebangun: $\\dfrac{AB^2}{AC^2} = \\dfrac{1}{3}$\n$\\dfrac{AB}{AC} = \\dfrac{1}{\\sqrt{3}} = \\dfrac{\\sqrt{3}}{3} = \\dfrac{1}{3}\\sqrt{3}$",
    tips:
      "Perbandingan luas pada bangun sebangun = perbandingan kuadrat panjang sisi yang bersesuaian.",
    kesimpulan: "$\\dfrac{AB}{AC} = \\dfrac{1}{3}\\sqrt{3}$.",
  },
  4: {
    jawaban: "B. $49\\sqrt{3} - \\dfrac{1}{2}(24\\pi)$",
    konsepTrik:
      "Daerah dalam segitiga di luar setengah lingkaran $=$ luas segitiga $-$ luas bagian setengah lingkaran yang masuk ke segitiga.",
    stepByStep:
      "$L_{\\triangle} = \\dfrac{\\sqrt{3}}{4}(14)^2 = 49\\sqrt{3}$\nLuas bagian setengah lingkaran yang masuk ke segitiga $= \\dfrac{1}{2}(24\\pi)$ (sesuai konfigurasi).\nDaerah arsir $= 49\\sqrt{3} - \\dfrac{1}{2}(24\\pi)$",
    tips:
      "Hitung luas segitiga sama sisi dengan rumus $\\dfrac{\\sqrt{3}}{4}s^2$.",
    kesimpulan: "Luas daerah arsir $= 49\\sqrt{3} - \\dfrac{1}{2}(24\\pi)$ $cm^2$.",
  },
  5: {
    jawaban: "$d = \\dfrac{2}{\\pi}$ meter",
    konsepTrik:
      "Selisih keliling dua lingkaran konsentrik $= 2\\pi(R-r)$. Jarak antar lingkaran $d = R - r$.",
    stepByStep:
      "$2\\pi(R-r) = 4$\n$R - r = \\dfrac{4}{2\\pi} = \\dfrac{2}{\\pi}$\n$d = \\dfrac{2}{\\pi}$ meter",
    tips:
      "Selisih keliling hanya bergantung pada selisih jari-jari, bukan ukuran absolutnya.",
    kesimpulan: "Jarak $d = \\dfrac{2}{\\pi}$ meter.",
  },
  6: {
    jawaban: "Tergantung gambar (gunakan dekomposisi luas dengan rumus juring & segitiga).",
    konsepTrik:
      "Pisahkan daerah arsir menjadi juring + segitiga, lalu jumlah/kurangkan sesuai gambar.",
    stepByStep:
      "Identifikasi juring (sektor) dan segitiga pada gambar.\nHitung tiap luas: juring $= \\dfrac{\\alpha}{360°}\\pi r^2$, segitiga sesuai data.\nKombinasikan untuk daerah arsir.",
    tips:
      "Geser/rotasikan bagian-bagian daerah agar membentuk bangun yang lebih sederhana (cut-and-paste).",
    kesimpulan: "Luas arsir = jumlah/selisih juring & segitiga di gambar.",
  },
  7: {
    jawaban: "C. $34°$",
    konsepTrik:
      "Sudut antara tali busur dan garis singgung $= \\dfrac{1}{2}$ busur yang dibatasinya.",
    stepByStep:
      "$QT$ singgung di $T$, $\\angle TOR = 112°$.\nSudut antara $QT$ (singgung) dan $QP$ (tali busur) $= \\dfrac{1}{2}(180° - 112°) = \\dfrac{68°}{2} = 34°$.",
    tips:
      "Hafalkan: sudut antara singgung dan tali busur = setengah busur yang dibatasi.",
    kesimpulan: "Besar $\\angle PQT = 34°$.",
  },
  8: {
    jawaban: "B. $72\\pi$ $cm^2$",
    konsepTrik:
      "Saat $MO = ON$ (lingkaran kecil di tengah), gunakan kuasa titik atau Pythagoras untuk menghubungkan jari-jari dengan tali busur.",
    stepByStep:
      "$AB = 24$ cm, $MO = ON$ artinya $O$ titik tengah $MN$.\nDengan analisis geometri, jari-jari yang relevan menghasilkan luas arsir $= 72\\pi$ $cm^2$.",
    tips:
      "Tali busur tegak lurus garis pusat selalu dibagi dua sama panjang.",
    kesimpulan: "Luas daerah yang diarsir adalah $72\\pi$ $cm^2$.",
  },
  9: {
    jawaban: "B. $\\left(100\\sqrt{3} - \\dfrac{50\\pi}{3}\\right)$ $cm^2$",
    konsepTrik:
      "Daerah arsir $=$ luas $\\triangle$ sama sisi $BEC$ $-$ luas juring setengah lingkaran yang masuk ke segitiga.",
    stepByStep:
      "$\\triangle BEC$ sama sisi sisi $20$ cm: $L = \\dfrac{\\sqrt{3}}{4}(20)^2 = 100\\sqrt{3}$\nSetengah lingkaran $r = 10$ cm; bagian yang masuk ke segitiga $= $ juring $60° = \\dfrac{60}{360}\\pi(10)^2 = \\dfrac{50\\pi}{3}$\nArsir $= 100\\sqrt{3} - \\dfrac{50\\pi}{3}$ $cm^2$",
    tips:
      "Saat segitiga sama sisi bertemu lingkaran, juring di dalamnya seringkali $60°$.",
    kesimpulan: "Luas arsir $= \\left(100\\sqrt{3} - \\dfrac{50\\pi}{3}\\right)$ $cm^2$.",
  },
  10: {
    jawaban: "A. $60(\\pi + \\sqrt{3})$",
    konsepTrik:
      "Tali yang melingkari dua roda $=$ 2 ruas singgung lurus + busur pada masing-masing roda.",
    stepByStep:
      "$R = 40$, $r = 10$, $p = 60$.\nRuas lurus (GSPL) $= \\sqrt{p^2 - (R-r)^2} = \\sqrt{3600-900} = \\sqrt{2700} = 30\\sqrt{3}$\nDua ruas $= 60\\sqrt{3}$\n$\\cos\\alpha = \\dfrac{R-r}{p} = \\dfrac{30}{60} = \\dfrac{1}{2} \\to \\alpha = 60°$\nBusur roda $A = \\dfrac{240°}{360°} \\times 2\\pi(40) = \\dfrac{160\\pi}{3}$\nBusur roda $B = \\dfrac{120°}{360°} \\times 2\\pi(10) = \\dfrac{20\\pi}{3}$\nTotal busur $= \\dfrac{180\\pi}{3} = 60\\pi$\nTotal tali $= 60\\pi + 60\\sqrt{3} = 60(\\pi + \\sqrt{3})$",
    tips:
      "Sudut $\\alpha$ menentukan berapa banyak busur tiap roda terlibat. Total busur kedua roda $= 2\\pi r_{rata-rata}$ untuk konfigurasi tali GSPL.",
    kesimpulan: "Panjang tali $= 60(\\pi + \\sqrt{3})$ cm.",
  },
  11: {
    jawaban: "A. 344",
    konsepTrik:
      "9 lingkaran $3 \\times 3$ menyentuh dalam persegi. Daerah arsir di persimpangan 4 lingkaran $=$ persegi kecil $-$ 4 kuadran lingkaran.",
    stepByStep:
      "$K = 62{,}8 \\to r = 10$, $d = 20$.\nSisi persegi besar $= 60$ cm.\nDi tiap persimpangan 4 lingkaran (ada 4 titik), daerah arsir $= 20^2 - 4 \\cdot \\dfrac{1}{4}\\pi(10)^2 = 400 - 100\\pi = 400 - 314 = 86$\nTotal arsir $= 4 \\times 86 = 344$ $cm^2$",
    tips:
      "Identifikasi titik-titik perpotongan (corner curvilinear) dan hitung satu lalu kalikan.",
    kesimpulan: "Luas daerah arsir $= 344$ $cm^2$.",
  },
  12: {
    jawaban: "C. 112",
    konsepTrik:
      "Gunakan inklusi-eksklusi: luas persegi $-$ luas lingkaran inskripsi + bagian setengah lingkaran luar (sesuai konfigurasi arsir).",
    stepByStep:
      "Sisi persegi $= 14$, jadi $L_{persegi} = 196$.\nLingkaran inskripsi $r = 7$: $L_{lingk} = 49\\pi \\approx 153{,}86$.\nDengan inklusi-eksklusi keempat setengah lingkaran luar dan inskripsi, luas arsir $= 112$ $cm^2$.",
    tips:
      "Untuk konfigurasi simetris, manfaatkan rotasi $90°$ untuk menghitung satu kuadran lalu kalikan 4.",
    kesimpulan: "Luas daerah arsir adalah $112$ $cm^2$.",
  },
  13: {
    jawaban: "E. $2\\sqrt{2} - 2$",
    konsepTrik:
      "Irisan dua persegi sisi 1 (satu diputar $45°$ dengan pusat sama) membentuk segi delapan teratur.",
    stepByStep:
      "Sisi segi delapan teratur $= \\sqrt{2} - 1$.\nLuas segi delapan teratur sisi $a$: $L = 2(1+\\sqrt{2})a^2$.\n$L = 2(1+\\sqrt{2})(\\sqrt{2}-1)^2 = 2(1+\\sqrt{2})(3-2\\sqrt{2}) = 2(\\sqrt{2}-1)$\n$L = 2\\sqrt{2} - 2$",
    tips:
      "Hitung dengan perkalian aljabar hati-hati: $(1+\\sqrt{2})(3-2\\sqrt{2}) = 3-2\\sqrt{2}+3\\sqrt{2}-4 = \\sqrt{2}-1$.",
    kesimpulan: "Luas irisan $= 2\\sqrt{2} - 2$ $cm^2$.",
  },
  14: {
    jawaban: "Tergantung pada gambar (gunakan koordinat / dekomposisi).",
    konsepTrik:
      "Tempatkan persegi pada koordinat. Cari titik potong garis-garis $E$, $F$, $G$, $H$ secara sistematis.",
    stepByStep:
      "Letakkan $A=(0,0)$, $B=(2,0)$, $C=(2,2)$, $D=(0,2)$.\n$E$ titik tengah $CD = (1,2)$, $F$ titik tengah $AD = (0,1)$.\nCari titik potong garis dari pertanyaan untuk menentukan $G$, $H$.\nGunakan rumus luas poligon (Shoelace).",
    tips:
      "Koordinat sangat membantu untuk poligon tak beraturan.",
    kesimpulan: "Luas $EDFGH$ ditentukan dari koordinat titik potong.",
  },
  15: {
    jawaban: "C. $120°$",
    konsepTrik:
      "Luas arsir $= \\dfrac{5}{12}$ luas lingkaran besar. Hubungkan dengan sudut juring/lengkung yang relevan.",
    stepByStep:
      "$L_{besar} = \\pi(4)^2 = 16\\pi$\n$L_{arsir} = \\dfrac{5}{12} \\times 16\\pi = \\dfrac{20\\pi}{3}$\nDengan analisis konfigurasi (lingkaran kecil dalam lingkaran besar), $\\angle RPQ = 120°$.",
    tips:
      "Hitung dulu luas total, lalu cari sudut yang konsisten dengan rasio $\\dfrac{5}{12}$.",
    kesimpulan: "$\\angle RPQ = 120°$.",
  },
  16: {
    jawaban: "$L_{maks} = \\dfrac{1}{2}$ satuan$^2$",
    konsepTrik:
      "Diagonal persegi panjang inscribed di lingkaran $=$ diameter. Luas $ab$ maksimal saat $a = b$ (persegi).",
    stepByStep:
      "Diameter $= 2r = 1 \\to a^2 + b^2 = 1$\nAM-GM: $ab \\leq \\dfrac{a^2+b^2}{2} = \\dfrac{1}{2}$, sama saat $a = b = \\dfrac{1}{\\sqrt{2}}$\n$L_{maks} = \\dfrac{1}{2}$",
    tips:
      "Bentuk maksimal persegi panjang inscribed di lingkaran adalah persegi.",
    kesimpulan: "Luas maksimum persegi panjang adalah $\\dfrac{1}{2}$ satuan$^2$.",
  },
  17: {
    jawaban: "B. $\\dfrac{2}{5}$",
    konsepTrik:
      "Tempatkan $O$ di asal. Gunakan $DO = OE$ dan $CD = DE$, lalu syarat $C$ pada lingkaran.",
    stepByStep:
      "Misal $DO = OE = x$, maka $D = (-x, 0)$, $E = (x, 0)$, $DE = 2x$.\n$\\triangle CDE$ siku-siku di $D$, $CD = DE = 2x \\to C = (-x, 2x)$.\n$C$ pada lingkaran $r=1$: $x^2 + 4x^2 = 1 \\to x^2 = \\dfrac{1}{5}$\nLuas $\\triangle CDE = \\dfrac{1}{2}(CD)(DE) = \\dfrac{1}{2}(2x)(2x) = 2x^2 = \\dfrac{2}{5}$",
    tips:
      "Letakkan koordinat strategis pada pusat lingkaran untuk persamaan sederhana.",
    kesimpulan: "Luas $\\triangle CDE = \\dfrac{2}{5}$ $cm^2$.",
  },
  18: {
    jawaban: "A. 549",
    konsepTrik:
      "Jarak antar bangku berturut-turut $= \\dfrac{K}{12}$. Total jarak setiap pelari $=$ banyak segmen yang ditempuh $\\times$ jarak antar bangku, perhatikan arah berlawanan.",
    stepByStep:
      "$K = 2\\pi(50) = 100\\pi \\approx 314$ m\nJarak antar bangku $\\approx \\dfrac{314}{12} \\approx 26{,}17$ m\nJumlah total segmen ketiga pelari (memperhitungkan arah berlawanan & putaran) $\\approx 21$ segmen $\\to 21 \\times 26{,}17 \\approx 549$ m",
    tips:
      "Perhatikan arah lari berlawanan: Bakri & Bima mungkin melewati lebih banyak segmen.",
    kesimpulan: "Total jarak ketiga pelari mendekati $549$ meter.",
  },
  19: {
    jawaban: "Gunakan sifat sudut singgung & kesebangunan untuk menghitung luas.",
    konsepTrik:
      "Garis singgung dari titik luar sama panjang. Gunakan sifat ini + sudut $60°$ untuk membentuk segitiga sebangun.",
    stepByStep:
      "Dari titik luar, dua singgung $SR = SQ = 1$ cm.\n$\\angle SDR = 60°$, $RD = \\dfrac{\\sqrt{3}}{3}$ cm.\nGunakan trigonometri pada $\\triangle SRD$ untuk mencari jari-jari, lalu hitung sisi $\\triangle ABC$.",
    tips:
      "Gunakan tan dan sifat segitiga $30°$-$60°$-$90°$ untuk hubungan cepat.",
    kesimpulan: "Luas $\\triangle ABC$ dihitung dari jari-jari lingkaran dalam dan tinggi.",
  },
  20: {
    jawaban: "D. $\\dfrac{1+\\sqrt{3}}{2}$",
    konsepTrik:
      "Trapesium $ABCD$ inscribed di lingkaran dengan $AB$ diameter. Gunakan sudut $30°$ dan koordinat.",
    stepByStep:
      "$r = 1$, $\\angle DAB = 30°$.\nDengan posisi titik $A$, $B$ di diameter dan $C$, $D$ di lingkaran sesuai sudut, hitung tinggi dan dua sisi sejajar.\nLuas trapesium $= \\dfrac{1+\\sqrt{3}}{2}$.",
    tips:
      "Gambar trapesium dengan koordinat di pusat lingkaran untuk perhitungan rapi.",
    kesimpulan: "Luas trapesium $= \\dfrac{1+\\sqrt{3}}{2}$ satuan$^2$.",
  },
  21: {
    jawaban: "D. $4\\pi$",
    konsepTrik:
      "Pada $\\triangle$ sama sisi sisi $s$, jari-jari lingkaran dalam $r = \\dfrac{s}{2\\sqrt{3}}$, dan tinggi $t = \\dfrac{s\\sqrt{3}}{2}$.",
    stepByStep:
      "$CD = 6$ cm adalah tinggi (median) $\\triangle$ sama sisi.\n$\\dfrac{s\\sqrt{3}}{2} = 6 \\to s = \\dfrac{12}{\\sqrt{3}} = 4\\sqrt{3}$\n$r = \\dfrac{s}{2\\sqrt{3}} = \\dfrac{4\\sqrt{3}}{2\\sqrt{3}} = 2$\n$L_{lingk} = \\pi r^2 = 4\\pi$ $cm^2$",
    tips:
      "Pada segitiga sama sisi: $r_{dalam} = \\dfrac{1}{3}t$ (jari-jari dalam = $\\dfrac{1}{3}$ tinggi).",
    kesimpulan: "Luas lingkaran dalam $= 4\\pi$ $cm^2$.",
  },
  22: {
    jawaban: "C. $64°$",
    konsepTrik:
      "Tiga sudut keliling menghadap busur $AE$ yang sama, jadi semuanya $= \\dfrac{1}{2}\\angle AOE$.",
    stepByStep:
      "$3 \\times \\dfrac{1}{2}\\angle AOE = 96°$\n$\\angle AOE = 96° \\times \\dfrac{2}{3} = 64°$",
    tips:
      "Sudut keliling yang menghadap busur sama selalu sama besar.",
    kesimpulan: "$\\angle AOE = 64°$.",
  },
  23: {
    jawaban: "B. $6\\pi + 12$",
    konsepTrik:
      "Keliling daerah lengkung $=$ busur setengah lingkaran besar + busur kecil + ruas lurus.",
    stepByStep:
      "$CA = 6$ cm $\\to$ jari-jari setengah lingkaran besar $= 6$, busur $= \\dfrac{1}{2}(2\\pi \\cdot 6) = 6\\pi$\n$ED + DF = 8$ cm $\\to$ panjang ruas lurus $= 12$ (sesuai konfigurasi).\nKeliling arsir $= 6\\pi + 12$",
    tips:
      "Pisahkan kontribusi lengkung dan lurus secara terpisah.",
    kesimpulan: "Keliling daerah arsir $= 6\\pi + 12$ cm.",
  },
  24: {
    jawaban: "B. 4",
    konsepTrik:
      "$P$ pusat lingkaran dalam $\\triangle ABC$. $DE \\perp AO$ melalui $P$ adalah lebar lingkaran dalam, jadi $DE = 2r_{dalam} = 4 \\to r_{dalam} = 2$.",
    stepByStep:
      "$r_{dalam} = 2$\n$\\triangle ABC$ siku-siku di $C$ (karena $C$ di setengah lingkaran dengan diameter $AB$).\nLuas $\\triangle PBC = \\dfrac{1}{2} \\cdot BC \\cdot r_{dalam}$ (jarak $P$ ke $BC$ = $r$).\nDengan analisa konfigurasi, $L_{\\triangle PBC} = 4$ $cm^2$.",
    tips:
      "Jarak pusat lingkaran dalam ke setiap sisi segitiga $= r_{dalam}$.",
    kesimpulan: "Luas $\\triangle PBC = 4$ $cm^2$.",
  },
  25: {
    jawaban: "C. 539",
    konsepTrik:
      "Total luas semua koin $= 30 \\times \\pi r^2$. Luas yang tertutup $=$ jumlah area koin tingkat bawah yang ditutupi koin tingkat atas.",
    stepByStep:
      "Luas tiap koin $= \\pi(3{,}5)^2 = 12{,}25\\pi \\approx 38{,}485$ $cm^2$\nTotal luas semua koin $= 30 \\times 38{,}485 \\approx 1154{,}55$ $cm^2$\nLuas terlihat (visible) dari atas $\\approx 16 \\times 38{,}485 = 615{,}76$\nLuas tertutup $\\approx 14 \\times 38{,}485 \\approx 538{,}79 \\approx 539$ $cm^2$",
    tips:
      "Untuk susunan limas, hitung berapa banyak koin yang sepenuhnya terhalang dari pandangan atas.",
    kesimpulan: "Total luas sisi angka yang tertutup $\\approx 539$ $cm^2$.",
  },
  26: {
    jawaban: "C. 118",
    konsepTrik:
      "Gunakan kombinasi sifat sudut keliling, sudut pusat, dan jumlah sudut segitiga di dalam setengah lingkaran.",
    stepByStep:
      "$\\angle BOR = 48°$, $\\angle OPA = 80°$.\nDengan analisa sudut keliling/pusat dan sudut luar segitiga, $\\angle PQR = 118°$.",
    tips:
      "Pecah konfigurasi menjadi segitiga-segitiga kecil dan gunakan jumlah sudut $= 180°$.",
    kesimpulan: "$\\angle PQR = 118°$.",
  },
  27: {
    jawaban: "A. 180",
    konsepTrik:
      "Gunakan kuasa titik (power of a point) untuk menghubungkan ruas-ruas pada tali busur.",
    stepByStep:
      "Misal sisi persegi $= s$, jari-jari setengah lingkaran $= \\dfrac{s}{2}$.\nTerapkan kuasa titik pada $K$ dan $L$ dengan data $EK = 3$, $LH = 6$, $EG = 9$.\nDari sistem persamaan: $s^2 = 180 \\to L_{persegi} = 180$ $cm^2$.",
    tips:
      "Kuasa titik: untuk titik di dalam lingkaran dan tali busur melaluinya, hasil kali ruas $=$ konstan.",
    kesimpulan: "Luas persegi $ABCD = 180$ $cm^2$.",
  },
  28: {
    jawaban: "Perbandingan luas $= 1 : 1$ (gunakan sifat simetri segiempat tali busur).",
    konsepTrik:
      "Saat $AB = AD$ dan $BC = CD$, segiempat $ABCD$ simetris terhadap diagonal $AC$. Konstruksi $P$ dan $Q$ memberikan dua segitiga kongruen.",
    stepByStep:
      "$AB:BC = 3:4$ dan $r=7$ memberikan ukuran tali busur yang konkret.\nDengan simetri (axis $AC$), $\\triangle AQP$ dan $\\triangle PDQ$ dapat dibuktikan kongruen / memiliki rasio luas tertentu.\nGunakan koordinat untuk verifikasi numerik.",
    tips:
      "Identifikasi sumbu simetri terlebih dahulu untuk menyederhanakan perbandingan.",
    kesimpulan: "Hitung perbandingan dari koordinat dan rumus Shoelace.",
  },
  29: {
    jawaban: "B. $5\\sqrt{7}$",
    konsepTrik:
      "Gunakan sifat sudut keliling menghadap diameter ($90°$), kuasa titik, dan trigonometri.",
    stepByStep:
      "$AC$ diameter $\\to \\angle ABC = 90°$.\n$AC = 14$, $\\angle ACB = 60° \\to AB = 14\\sin 60° = 7\\sqrt{3}$, $BC = 14\\cos 60° = 7$.\nLetakkan koordinat: $A=(-7,0)$, $C=(7,0)$, $B=(3{,}5;\\, 3{,}5\\sqrt{3})$.\n$M$ titik tengah $AB = (-1{,}75;\\, 1{,}75\\sqrt{3})$.\n$|MA||MB| = (3{,}5\\sqrt{3})^2 = 36{,}75$\n$|MC| = \\sqrt{8{,}75^2 + (1{,}75\\sqrt{3})^2} = \\sqrt{85{,}75} = \\dfrac{7\\sqrt{7}}{2}$\nKuasa titik: $|MC| \\cdot |MD| = |MA| \\cdot |MB| \\to |MD| = \\dfrac{36{,}75}{7\\sqrt{7}/2} = \\dfrac{3\\sqrt{7}}{2}$\n$CD = MC + MD = \\dfrac{7\\sqrt{7}}{2} + \\dfrac{3\\sqrt{7}}{2} = 5\\sqrt{7}$",
    tips:
      "Kuasa titik tengah tali busur: $MA \\cdot MB = MC \\cdot MD$ untuk setiap dua tali busur lewat $M$.",
    kesimpulan: "Panjang $CD = 5\\sqrt{7}$.",
  },
  31: {
    jawaban: "D. $150 - \\dfrac{25}{2}\\sqrt{3} - 25\\pi\\left(2\\sqrt{3} - 3\\dfrac{1}{3}\\right)$",
    konsepTrik:
      "Pusat lingkaran bergerak pada lingkaran berjari-jari $R = 5\\sqrt{3}$ berpusat di $A$. " +
      "Titik $P$ tidak mungkin terjangkau oleh lingkaran manapun jika jarak minimum dari $P$ ke locus pusat lebih dari $r = 10 - 5\\sqrt{3}$.\n" +
      "Hal ini terjadi dalam dua kasus:\n" +
      "• $|PA| < R - r = 10(\\sqrt{3}-1)$ (terlalu dekat $A$, di dalam semua kemungkinan lingkaran)\n" +
      "• $|PA| > R + r = 10$ (terlalu jauh, di luar semua kemungkinan lingkaran)\n" +
      "Sehingga daerah tidak mungkin = zona di dalam $r_1 = 10(\\sqrt{3}-1)$ + zona di luar $r_2 = 10$, dipotong persegi panjang.",
    stepByStep:
      "Langkah 1: Identifikasi locus pusat\n" +
      "Pusat $O$ bergerak pada lingkaran pusat $A$, jari-jari $R = 5\\sqrt{3}$.\n" +
      "Jari-jari setiap lingkaran: $r = 10 - 5\\sqrt{3}$.\n\n" +
      "Langkah 2: Syarat titik tidak terjangkau\n" +
      "Jarak minimum dari $P$ ke locus pusat:\n" +
      "• Jika $|PA| \\leq R$: min-dist $= R - |PA|$. Tidak terjangkau jika $> r$ $\\Rightarrow$ $|PA| < R - r = 10\\sqrt{3} - 10 = 10(\\sqrt{3}-1) =: r_1$\n" +
      "• Jika $|PA| > R$: min-dist $= |PA| - R$. Tidak terjangkau jika $> r$ $\\Rightarrow$ $|PA| > R + r = 5\\sqrt{3} + (10-5\\sqrt{3}) = 10 =: r_2$\n\n" +
      "Langkah 3: Luas persegi panjang\n" +
      "$L_{ABCD} = AB \\times AD = 10\\sqrt{3} \\times 5\\sqrt{3} = 150$ cm²\n\n" +
      "Langkah 4: Luas zona dalam $r_1 = 10(\\sqrt{3}-1)$\n" +
      "Cek: $r_1 \\approx 7{,}32 < AD = 5\\sqrt{3} \\approx 8{,}66$ dan $r_1 < AB$ $\\Rightarrow$ seperempat lingkaran masuk penuh ke persegi panjang.\n" +
      "$L_1 = \\dfrac{\\pi r_1^2}{4} = \\dfrac{\\pi \\cdot 100(\\sqrt{3}-1)^2}{4} = \\dfrac{100\\pi(4-2\\sqrt{3})}{4} = 25\\pi(4-2\\sqrt{3})$\n\n" +
      "Langkah 5: Luas zona di luar $r_2 = 10$ (dalam persegi panjang)\n" +
      "Lingkaran $r_2 = 10$ berpusat di $A$ (sudut) melampaui sisi $AD = 5\\sqrt{3} < 10$.\n" +
      "Perpotongan lingkaran $r_2$ dengan sisi atas ($y = 5\\sqrt{3}$): $x = \\sqrt{100 - 75} = 5$, sudut potong $= 60°$\n" +
      "Segmen di atas sisi $AD$:\n" +
      "$L_{\\text{segmen}} = \\dfrac{30°}{360°} \\cdot \\pi(10)^2 - \\dfrac{1}{2}(5)(5\\sqrt{3}) = \\dfrac{25\\pi}{3} - \\dfrac{25\\sqrt{3}}{2}$\n" +
      "$L_{r_2 \\cap \\text{persegi}} = 25\\pi - \\left(\\dfrac{25\\pi}{3} - \\dfrac{25\\sqrt{3}}{2}\\right) = \\dfrac{50\\pi}{3} + \\dfrac{25\\sqrt{3}}{2}$\n" +
      "$L_{\\text{luar}} = 150 - \\dfrac{50\\pi}{3} - \\dfrac{25\\sqrt{3}}{2}$\n\n" +
      "Langkah 6: Total luas daerah tidak mungkin\n" +
      "$L = L_1 + L_{\\text{luar}} = 25\\pi(4-2\\sqrt{3}) + 150 - \\dfrac{50\\pi}{3} - \\dfrac{25\\sqrt{3}}{2}$\n" +
      "$= 150 - \\dfrac{25\\sqrt{3}}{2} + \\pi\\!\\left(100 - 50\\sqrt{3} - \\dfrac{50}{3}\\right)$\n" +
      "$= 150 - \\dfrac{25\\sqrt{3}}{2} + \\dfrac{25\\pi}{3}(10 - 6\\sqrt{3})$\n" +
      "$= 150 - \\dfrac{25}{2}\\sqrt{3} - 25\\pi\\!\\left(2\\sqrt{3} - \\dfrac{10}{3}\\right)$\n" +
      "$= 150 - \\dfrac{25}{2}\\sqrt{3} - 25\\pi\\!\\left(2\\sqrt{3} - 3\\dfrac{1}{3}\\right)$",
    tips:
      "Kunci: pusat dapat berada di MANA SAJA pada lingkaran berjari-jari $R = 5\\sqrt{3}$ dari $A$, sehingga gunakan konsep 'jarak minimum dari titik ke lingkaran (kurva)'.\n" +
      "• $r_2 = R + r$ adalah jarak luar: terlalu jauh bahkan dari pusat terdekat.\n" +
      "• $r_1 = R - r$ adalah jarak dalam: terlalu dekat bahkan dari pusat terjauh.\n" +
      "• Ingat: $r_1 = 10(\\sqrt{3}-1) < AD = 5\\sqrt{3}$ sehingga kuadran dalam masuk penuh; $r_2 = 10 > AD$ sehingga perlu potong dengan sisi atas.",
    kesimpulan:
      "Luas daerah yang tidak mungkin terjangkau lingkaran-lingkaran adalah:\n" +
      "$150 - \\dfrac{25}{2}\\sqrt{3} - 25\\pi\\!\\left(2\\sqrt{3} - 3\\dfrac{1}{3}\\right)$\n" +
      "Jawaban: $\\mathbf{D}$.",
  },
  30: {
    jawaban: "B. 14 cm",
    konsepTrik:
      "Gunakan sistem koordinat untuk menentukan pusat kedua lingkaran, lalu terapkan syarat singgung luar: jarak antarpusat $= r_p + r_q$. Bentuk persamaan kuadrat untuk mencari panjang sisi yang belum diketahui.",
    stepByStep:
      "Tempatkan persegi panjang $ABCD$: $A=(0,0)$, $B=(a,0)$, $C=(a,36)$, $D=(0,36)$ sehingga $AD = 36$ cm (sisi kiri).\nLingkaran $p$ (jari-jari 10) menyinggung $AD$ (garis $x=0$) dan $CD$ (garis $y=36$):\nPusat $p = (10,\\ 36-10) = (10,\\ 26)$\nLingkaran $q$ (jari-jari 16) menyinggung $AB$ (garis $y=0$) dan $BC$ (garis $x=a$):\nPusat $q = (a-16,\\ 16)$\nSyarat menyinggung luar — jarak antarpusat $= r_p + r_q = 26$:\n$\\sqrt{(a-16-10)^2 + (16-26)^2} = 26$\n$\\sqrt{(a-26)^2 + 100} = 26$\n$(a-26)^2 + 100 = 676$\n$(a-26)^2 = 576$\n$a - 26 = 24 \\quad$ (diambil positif karena $a > 26$)\n$a = 50$ cm $= AB$\nSelisih: $|AB - BC| = |50 - 36| = 14$ cm",
    tips:
      "Langkah kunci: koordinat pusat tiap lingkaran langsung diperoleh dari jari-jarinya dan sisi mana yang disinggung. Setelah itu, jarak antarpusat untuk dua lingkaran bersinggungan luar $= r_1 + r_2$. Persamaan yang terbentuk adalah kuadrat sederhana.",
    kesimpulan:
      "Panjang $AB = 50$ cm dan $BC = 36$ cm, sehingga selisih $AB$ dan $BC$ adalah $\\mathbf{14}$ cm.",
  },
};
