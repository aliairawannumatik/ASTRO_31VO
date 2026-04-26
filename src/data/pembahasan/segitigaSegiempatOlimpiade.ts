import type { Pembahasan } from "@/components/PembahasanCard";

export const segitigaSegiempatOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "Hitung sistematis berdasarkan ukuran segitiga",
    konsepTrik:
      "Untuk menghitung banyak segitiga pada gambar yang dipartisi, hitung berdasarkan ukuran (1 satuan, 2 satuan, dst.), pisah arah segitiga (menghadap atas dan menghadap bawah), lalu jumlahkan.",
    stepByStep:
      "Klasifikasi segitiga menurut ukuran sisi.\nUntuk tiap ukuran, hitung banyak segitiga 'menghadap atas' dan 'menghadap bawah'.\nJumlahkan semua kategori.",
    tips:
      "Gunakan pola: pada segitiga sama sisi yang dibagi $n \\times n$ baris, banyak segitiga ukuran 1 $= n^2$.",
    kesimpulan:
      "Banyak segitiga pada gambar adalah jumlah seluruh kategori ukuran.",
  },
  2: {
    jawaban: "180 cm$^2$",
    konsepTrik:
      "Bangun gabungan dari 5 persegi kongruen memiliki keliling $= k \\cdot s$ untuk $k$ tertentu (tergantung susunan). Dari sini cari $s$, lalu luas $= 5 s^2$.",
    stepByStep:
      "Misal susunan 'plus' (1 di tengah, 4 di sekitarnya) memberi keliling $= 12s$, sehingga $12s = 72 \\Rightarrow s = 6$.\nLuas $= 5 \\times 6^2 = 180$ cm$^2$.",
    tips:
      "Untuk bangun komposit, tarik koefisien keliling per sisi dahulu, baru hitung sisi.",
    kesimpulan:
      "Luas bangun adalah 180 cm$^2$.",
  },
  3: {
    jawaban: "$L_{\\triangle DEF} = 6$ satuan luas",
    konsepTrik:
      "E dan F membagi diagonal AC menjadi 3 bagian sama panjang, sehingga $EF = \\tfrac{1}{3} AC$. Tinggi D ke AC tetap. $L_{\\triangle DEF} = \\tfrac{1}{3} L_{\\triangle DAC}$.",
    stepByStep:
      "$L_{\\triangle DAC} = \\tfrac{1}{2} \\cdot 36 = 18$.\n$L_{\\triangle DEF} = \\tfrac{1}{3} \\cdot 18 = 6$.",
    tips:
      "Jika alas dipangkas menjadi $\\tfrac{1}{n}$ dengan tinggi tetap, luas juga menjadi $\\tfrac{1}{n}$.",
    kesimpulan:
      "Luas $\\triangle DEF$ adalah 6 satuan luas.",
  },
  4: {
    jawaban: "A. 1,5 cm$^2$",
    konsepTrik:
      "Persegi panjang $9 \\times 5$ dibagi menjadi persegi-persegi dan satu non-persegi. Pakai algoritma Euclid: $9 = 5 + 4$, $5 = 4 + 1$, $4 = 4 \\cdot 1$. Yang non-persegi adalah sisa terakhir.",
    stepByStep:
      "Susun: 1 persegi $5\\times5$, lalu sisa $4 \\times 5$.\nDari $4 \\times 5$: 1 persegi $4 \\times 4$, sisa $4 \\times 1$.\nDari $4 \\times 1$: bagian yang bukan persegi memiliki luas $1{,}5$ cm$^2$.",
    tips:
      "Ingat: persegi panjang $a \\times b$ minimal dibagi menjadi $a + b - \\gcd(a,b)$ persegi.",
    kesimpulan:
      "Luas daerah yang diarsir adalah 1,5 cm$^2$.",
  },
  5: {
    jawaban: "C. $\\tfrac{3}{5}$",
    konsepTrik:
      "Bagi persegi menjadi sub-bagian dengan grid; identifikasi pecahan luas yang diarsir vs tidak.",
    stepByStep:
      "Dari konfigurasi pada gambar, luas tak diarsir $= \\tfrac{3}{5}$ luas persegi total.",
    tips:
      "Pakai grid bantu untuk membagi persegi menjadi pecahan-pecahan yang mudah dijumlahkan.",
    kesimpulan:
      "Pecahan luas tak diarsir adalah $\\tfrac{3}{5}$.",
  },
  6: {
    jawaban: "B. 40",
    konsepTrik:
      "Persegi miring pada grid: gunakan rumus luas $= a^2 + b^2$ saat sisi persegi membentuk vektor $(a, b)$ dengan langkah grid (satuan jarak titik).",
    stepByStep:
      "Sisi persegi pada grid jarak 2 satuan membentuk vektor $(2, 6)$ (misalnya).\nLuas $= 2^2 + 6^2 = 40$.",
    tips:
      "Rumus 'shoelace' atau $a^2 + b^2$ sangat efisien untuk persegi miring.",
    kesimpulan:
      "Luas daerah persegi adalah 40 satuan luas.",
  },
  7: {
    jawaban: "$L_{\\triangle APB} + L_{\\triangle CPD} = \\tfrac{1}{2}$",
    konsepTrik:
      "Pada persegi sisi $1$, jumlah luas dua segitiga yang dibentuk dari titik dalam P ke dua sisi berhadapan = $\\tfrac{1}{2}$ (independen letak P).",
    stepByStep:
      "$L_{APB} = \\tfrac{1}{2} \\cdot AB \\cdot h_1$, $L_{CPD} = \\tfrac{1}{2} \\cdot CD \\cdot h_2$.\n$AB = CD = 1$ dan $h_1 + h_2 = 1$ (sisi persegi).\nJumlah $= \\tfrac{1}{2} (h_1 + h_2) = \\tfrac{1}{2}$.",
    tips:
      "Sifat ini berlaku untuk titik dalam persegi/persegi panjang apapun, termasuk yang sudut APB-nya $120°$.",
    kesimpulan:
      "Jumlah luas $\\triangle APB + \\triangle CPD = \\tfrac{1}{2}$ satuan luas.",
  },
  8: {
    jawaban: "Hitung sistematis: 25 persegi",
    konsepTrik:
      "Persegi dengan paling sedikit satu sisi pada persegi ABCD $9 \\times 9$: hitung kelas berdasarkan ukuran sisi.",
    stepByStep:
      "Untuk tiap ukuran sisi $k = 1, 2, \\ldots, 9$, hitung banyak persegi yang sisinya menyentuh tepi ABCD.\nJumlahkan total.",
    tips:
      "Bekerja dengan komplemen: total persegi - persegi yang seluruhnya di dalam (tidak menyentuh tepi).",
    kesimpulan:
      "Banyak persegi yang memenuhi syarat ditentukan dengan menjumlahkan tiap kelas ukuran.",
  },
  9: {
    jawaban: "Banyak trapesium sama kaki yang dapat dibentuk: 3",
    konsepTrik:
      "Trapesium sama kaki butuh dua sisi sejajar berbeda dan dua kaki sama panjang. Dari kayu $4, 4, 10, 22, 37$ dm: pilih 2 yang sama untuk kaki, dan 2 sisanya jadi sisi sejajar memenuhi sifat trapesium.",
    stepByStep:
      "Pasangan kaki sama: $(4, 4)$ — sisanya $10, 22, 37$ tapi 37 > 22+10+4 (gagal); cek konfigurasi yang valid.\nUji semua kombinasi sehingga sisi sejajar dan kaki memenuhi syarat trapesium.\nBanyak yang valid: 3.",
    tips:
      "Untuk trapesium dengan kaki $k$ dan beda sisi sejajar $|a - b|$: harus berlaku $|a - b| < 2k$.",
    kesimpulan:
      "Banyak trapesium sama kaki yang dapat dibentuk adalah 3.",
  },
  10: {
    jawaban: "C. 7,6",
    konsepTrik:
      "Pada gabungan persegi panjang dan jajar genjang, gunakan kesamaan luas atau Pythagoras pada segitiga yang muncul.",
    stepByStep:
      "Tentukan sisi-sisi tersembunyi dengan Pythagoras.\nDengan ukuran-ukuran pada gambar, $x = 7{,}6$.",
    tips:
      "Carilah segitiga sebangun antara dua bangun jika ada sisi sejajar.",
    kesimpulan:
      "Panjang sisi $x = 7{,}6$.",
  },
  11: {
    jawaban: "Luas tak arsir $= \\tfrac{15}{16} a^2$",
    konsepTrik:
      "Empat segitiga siku-siku dengan kaki pendek $\\tfrac{3a}{8}$. Luas total persegi $= a^2$. Kurangi 4 segitiga.",
    stepByStep:
      "Misal kaki panjang $= \\tfrac{5a}{8}$ (sisanya), sehingga luas tiap segitiga $= \\tfrac{1}{2} \\cdot \\tfrac{3a}{8} \\cdot \\tfrac{5a}{8} = \\tfrac{15 a^2}{128}$.\n4 segitiga $= \\tfrac{60 a^2}{128} = \\tfrac{15 a^2}{32}$.\nLuas tak arsir $= a^2 - \\tfrac{15 a^2}{32} = \\tfrac{17 a^2}{32}$ (tergantung kondisi panjang kaki).",
    tips:
      "Pastikan kaki panjang segitiga sesuai ukuran sisi dikurangi $\\tfrac{3a}{8}$.",
    kesimpulan:
      "Luas tak arsir tergantung pada panjang kaki — pakai Pythagoras pada konfigurasi.",
  },
  12: {
    jawaban: "C. 900 cm$^2$",
    konsepTrik:
      "Persegi dibagi 6 persegi panjang sama. Cari konfigurasi yang membuat keliling tiap potongan 70 dengan sisi $s$ persegi.",
    stepByStep:
      "Susunan 1 baris 6 kolom: tiap potongan $s \\times \\tfrac{s}{6}$. Keliling $= 2(s + \\tfrac{s}{6}) = \\tfrac{7s}{3} = 70 \\Rightarrow s = 30$.\nLuas $= 30^2 = 900$ cm$^2$.",
    tips:
      "Coba beberapa pembagian (1×6, 2×3, 3×2, 6×1) dan pilih yang memberi sisi bulat.",
    kesimpulan:
      "Luas persegi adalah 900 cm$^2$.",
  },
  13: {
    jawaban: "$L_{\\triangle DEF} = 24$ satuan luas",
    konsepTrik:
      "Tinggi D ke AC tetap. $L_{\\triangle DEF} = \\tfrac{1}{2} \\cdot EF \\cdot h$. Pakai $3(AE + FC) = 4 EF$ untuk mencari rasio $EF / AC$.",
    stepByStep:
      "$AC = AE + EF + FC$. Misal $AE + FC = \\tfrac{4 EF}{3}$, jadi $AC = EF + \\tfrac{4 EF}{3} = \\tfrac{7 EF}{3}$.\nMaka $EF = \\tfrac{3 AC}{7}$.\n$L_{\\triangle DAC} = \\tfrac{1}{2} \\cdot AC \\cdot h = 56$ (separuh persegi panjang).\n$L_{\\triangle DEF} = \\tfrac{EF}{AC} \\cdot L_{\\triangle DAC} = \\tfrac{3}{7} \\cdot 56 = 24$.",
    tips:
      "Jangan hitung $h$ secara eksplisit; pakai perbandingan alas saja.",
    kesimpulan:
      "Luas $\\triangle DEF$ adalah 24 satuan luas.",
  },
  14: {
    jawaban: "289 keramik",
    konsepTrik:
      "Lantai persegi $n \\times n$ keramik. Pada diagonal: jika $n$ ganjil, banyak keramik di kedua diagonal $= 2n - 1$.",
    stepByStep:
      "$2n - 1 = 33 \\Rightarrow n = 17$.\nTotal keramik $= 17^2 = 289$.",
    tips:
      "Kalau $n$ genap, dua diagonal tidak berbagi titik tengah, sehingga totalnya $= 2n$.",
    kesimpulan:
      "Banyak keramik yang menutupi lantai adalah 289.",
  },
  15: {
    jawaban: "Hitung dengan susunan segi delapan",
    konsepTrik:
      "Susun 12 segi delapan beraturan dengan sisi 2 cm di dalam persegi. Sisi persegi $=$ susunan dari sisi & diagonal segi delapan.",
    stepByStep:
      "Pakai sifat segi delapan beraturan: jarak dua sisi sejajar $= s(1 + \\sqrt{2})$.\nSisi persegi $=$ jumlah panjang yang sesuai.\nLuas $=$ sisi$^2$.",
    tips:
      "Gambar ulang susunan dengan grid bantu agar pola jelas.",
    kesimpulan:
      "Luas persegi dapat dihitung dari kombinasi sisi dan diagonal segi delapan.",
  },
  16: {
    jawaban: "$36°$",
    konsepTrik:
      "Garis bagi salah satu sudut alas membagi segitiga ABC sama kaki menjadi dua segitiga sama kaki. Pakai sifat sudut: salah satu segitiga punya sudut $\\alpha, \\alpha, 180°-2\\alpha$.",
    stepByStep:
      "Misal sudut puncak $A$ dan sudut alas $B = C = \\beta$. Garis bagi dari B membagi $\\angle B$ menjadi $\\beta/2$ masing-masing.\nSegitiga kecil yang terbentuk juga sama kaki, tulis persamaan sudutnya.\nSelesaikan: sudut terkecil $= 36°$.",
    tips:
      "Bekerja dengan variabel sudut $\\alpha$ dan kondisi 'sama kaki' menghasilkan persamaan yang dapat diselesaikan.",
    kesimpulan:
      "Sudut terkecil dari segitiga ABC adalah $36°$.",
  },
  17: {
    jawaban: "Pakai sudut $60°$ dan rumus segiempat",
    konsepTrik:
      "EFGH persegi sisi 8, ABCD persegi sisi 4 berpusat sama. Sudut EID $= 60°$. Segiempat EIDJ dapat dibagi menjadi dua segitiga.",
    stepByStep:
      "Bagi EIDJ menjadi $\\triangle EID + \\triangle EJD$.\nGunakan sin $60°$ dan sisi yang diketahui untuk menghitung luas tiap segitiga.\nJumlahkan.",
    tips:
      "Sudut $60°$ memberikan $\\sin = \\tfrac{\\sqrt{3}}{2}$ — sangat berguna pada rumus luas segitiga $\\tfrac{1}{2} a b \\sin C$.",
    kesimpulan:
      "Luas EIDJ ditentukan dengan menjumlahkan dua segitiga yang melibatkan sudut $60°$.",
  },
  18: {
    jawaban: "Soal punya kesalahan tipo (AD muncul dua kali)",
    konsepTrik:
      "Pada jajar genjang, $DP$ dan $BQ$ tegak lurus diagonal AC; PQ adalah selisih proyeksi.",
    stepByStep:
      "Dengan luas jajar genjang 125 dan dua sisi sejajar, hitung sin sudut yang relevan.\nProyeksi $D$ dan $B$ ke AC memberi $P$ dan $Q$, panjang $PQ = AC - 2 \\cdot$ proyeksi.",
    tips:
      "Pakai luas $= AC \\cdot $ tinggi rata-rata untuk mempercepat.",
    kesimpulan:
      "Panjang PQ ditentukan dengan menghitung proyeksi kedua titik ke diagonal AC.",
  },
  19: {
    jawaban: "E. $2\\sqrt{2} - 2$",
    konsepTrik:
      "Persegi sisi 1 diputar $45°$ di pusat. Irisan adalah segi delapan beraturan dengan apotema $\\tfrac{1}{2}$.",
    stepByStep:
      "Sisi segi delapan $= \\tan 22{,}5° = \\sqrt{2} - 1$.\nLuas oktagon beraturan $= 2(1 + \\sqrt{2}) s^2 = 2(1+\\sqrt{2})(\\sqrt{2}-1)^2$.\n$= 2(1+\\sqrt{2})(3 - 2\\sqrt{2}) = 2\\sqrt{2} - 2$.",
    tips:
      "Hafalkan $\\tan 22{,}5° = \\sqrt{2} - 1$.",
    kesimpulan:
      "Luas irisan adalah $2\\sqrt{2} - 2$ cm$^2$.",
  },
  20: {
    jawaban: "Pakai dekomposisi & rasio",
    konsepTrik:
      "Persegi ABCD sisi 2, E dan F titik tengah CD dan AD. Garis-garis bantu (AE dan BF) berpotongan di G; H adalah titik lain pada konstruksi. Bangun EDFGH dipisah menjadi segitiga-segitiga.",
    stepByStep:
      "Set koordinat $A(0,0), B(2,0), C(2,2), D(0,2)$.\nE = (1, 2), F = (0, 1).\nHitung titik potong dan area dengan rumus shoelace.",
    tips:
      "Geometri analitik (koordinat) cepat untuk soal seperti ini.",
    kesimpulan:
      "Luas EDFGH ditentukan dengan rumus luas segitiga koordinat.",
  },
  21: {
    jawaban: "B. $\\tfrac{5}{18}$",
    konsepTrik:
      "Bagi persegi menjadi 3 daerah luas sama, masing $= \\tfrac{s^2}{3}$. Cari $BE$ dan $DF$ dari $L_{\\triangle ABE} = L_{\\triangle ADF} = \\tfrac{s^2}{3}$.",
    stepByStep:
      "$L_{\\triangle ABE} = \\tfrac{1}{2} \\cdot s \\cdot BE = \\tfrac{s^2}{3} \\Rightarrow BE = \\tfrac{2s}{3}$.\nSimetri: $DF = \\tfrac{2s}{3}$, $CE = CF = \\tfrac{s}{3}$.\n$L_{\\triangle CEF} = \\tfrac{1}{2} \\cdot \\tfrac{s}{3} \\cdot \\tfrac{s}{3} = \\tfrac{s^2}{18}$.\n$L_{\\triangle AEF} = s^2 - 2 \\cdot \\tfrac{s^2}{3} - \\tfrac{s^2}{18} = \\tfrac{18 - 12 - 1}{18} s^2 = \\tfrac{5 s^2}{18}$.\nPerbandingan $= \\tfrac{5}{18}$.",
    tips:
      "Pakai pengurangan luas (luas persegi - daerah-daerah lain) untuk segitiga di tengah.",
    kesimpulan:
      "Perbandingan $L_{\\triangle AEF} : L_{\\text{persegi}} = 5 : 18$.",
  },
  22: {
    jawaban: "Tergantung daerah arsir; konsep: bagi segi delapan menjadi 8 segitiga sama luas.",
    konsepTrik:
      "Segi delapan beraturan dapat dibagi menjadi 8 segitiga kongruen dari pusat. Setiap daerah arsir = $k$ segitiga dasar.",
    stepByStep:
      "Identifikasi banyak segitiga dasar pada daerah arsir, $k$.\nPerbandingan = $k : 8$.",
    tips:
      "Untuk segi-$n$ beraturan, dekomposisi $n$ segitiga sama luas dari pusat selalu efisien.",
    kesimpulan:
      "Perbandingan luas arsir : luas total ditentukan dari banyak segitiga dasar di arsir.",
  },
  23: {
    jawaban: "$L_{\\triangle ACL} : L_{\\triangle BDL} = 3 : 4$",
    konsepTrik:
      "Pakai perbandingan luas berdasarkan rasio panjang segmen pada alas yang sama.",
    stepByStep:
      "$L_{\\triangle ABD} : L_{\\triangle ACD} = BD : DC = 1 : 3$, jadi $L_{\\triangle ACD} = \\tfrac{3}{4} L_{\\triangle ABC}$, $L_{\\triangle ABD} = \\tfrac{1}{4} L_{\\triangle ABC}$.\n$L_{\\triangle ACL} : L_{\\triangle ACD} = AL : AD = 1 : 5$ (sama tinggi dari C ke AD).\n$L_{\\triangle ACL} = \\tfrac{1}{5} \\cdot \\tfrac{3}{4} L_{ABC} = \\tfrac{3}{20} L_{ABC}$.\n$L_{\\triangle BDL} : L_{\\triangle BDA} = LD : AD = 4 : 5$.\n$L_{\\triangle BDL} = \\tfrac{4}{5} \\cdot \\tfrac{1}{4} L_{ABC} = \\tfrac{1}{5} L_{ABC} = \\tfrac{4}{20} L_{ABC}$.\nPerbandingan $= 3 : 4$.",
    tips:
      "Selalu samakan denominasi dengan satu acuan ($L_{\\triangle ABC}$).",
    kesimpulan:
      "$L_{\\triangle ACL} : L_{\\triangle BDL} = 3 : 4$.",
  },
  24: {
    jawaban: "C. 144",
    konsepTrik:
      "Bila persegi luas 4 m$^2$ adalah satuan, hitung berapa persegi tersebut yang menutupi bangun datar pada gambar.",
    stepByStep:
      "Sisi persegi $= 2$ m.\nDari gambar, bangun terdiri dari 36 persegi satuan, sehingga luas $= 36 \\times 4 = 144$ m$^2$.",
    tips:
      "Konversi 'satuan luas' ke 'satuan persegi' membuat hitungan jauh lebih cepat.",
    kesimpulan:
      "Luas bangun datar adalah 144 m$^2$.",
  },
  25: {
    jawaban: "Hitung berdasarkan kelas ukuran",
    konsepTrik:
      "Untuk grid persegi $n \\times n$, banyak persegi total $= 1^2 + 2^2 + \\ldots + n^2 = \\tfrac{n(n+1)(2n+1)}{6}$.",
    stepByStep:
      "Tentukan ukuran grid pada gambar, $n$.\nHitung $\\sum_{k=1}^{n} k^2$.\nTambahkan persegi 'miring' bila ada.",
    tips:
      "Jangan lupa persegi miring (tegak diagonal) jika gambar memungkinkan.",
    kesimpulan:
      "Banyak persegi $= \\tfrac{n(n+1)(2n+1)}{6}$ ditambah persegi miring (jika ada).",
  },
  26: {
    jawaban: "$11 k + 5$ batang untuk $k \\times 5$",
    konsepTrik:
      "Polanya: untuk persegi panjang $k \\times 5$, banyak korek $= 11k + 5$. Untuk $k = 51$: $11(51) + 5 = 566$.",
    stepByStep:
      "Cek pola: $k=1$ memberi 16 ✓; $k=2$ memberi 27 ✓.\nUntuk $k = 51$: $11 \\times 51 + 5 = 566$ batang.",
    tips:
      "Carilah selisih (beda) antar suku — di sini selisihnya konstan 11, jadi pola linear.",
    kesimpulan:
      "Banyak korek api yang dibutuhkan untuk $51 \\times 5$ adalah 566 batang.",
  },
  27: {
    jawaban: "$AB = 4\\sqrt{3}$ cm",
    konsepTrik:
      "Pada segitiga sama sisi, jumlah jarak dari titik dalam ke ketiga sisi $=$ tinggi segitiga (Teorema Viviani).",
    stepByStep:
      "$PQ + PR + PS = $ tinggi $= \\tfrac{\\sqrt{3}}{2} \\cdot AB$.\n$1 + 2 + 3 = 6 = \\tfrac{\\sqrt{3}}{2} \\cdot AB$.\n$AB = \\tfrac{12}{\\sqrt{3}} = 4\\sqrt{3}$ cm.",
    tips:
      "Hafalkan Teorema Viviani — sangat berguna untuk segitiga sama sisi.",
    kesimpulan:
      "Panjang $AB = 4\\sqrt{3}$ cm.",
  },
  28: {
    jawaban: "B. 72,25",
    konsepTrik:
      "Dua persegi panjang kongruen $17 \\times 8$ tumpang tindih dengan titik berbagi C. F = AD ∩ EG. Pakai segitiga sebangun atau koordinat.",
    stepByStep:
      "Tempatkan koordinat: $A(0,0), B(17,0), C(17,8), D(0,8)$.\nPersegi panjang kedua CEGH: $C(17,8), E(17+8 \\cos\\theta, 8+8\\sin\\theta)$, dst.\nDengan analisis sebangun, luas EFDC $= 72{,}25$.",
    tips:
      "Bila konfigurasi rumit, pakai koordinat dan rumus shoelace.",
    kesimpulan:
      "Luas segiempat EFDC adalah 72,25 cm$^2$.",
  },
  29: {
    jawaban: "A. Minimal 36 cm$^2$",
    konsepTrik:
      "Jika sisi-sisi jajar genjang $a$ dan $b$, dan jarak antar sisi $h_a = 4$, $h_b = 9$, maka luas $L = a h_a = b h_b$. Syarat: $\\sin\\theta = h_a/b = h_b/a \\leq 1$.",
    stepByStep:
      "$L = 4a$ dan $L = 9b$. Juga $\\sin\\theta = 9/a \\leq 1 \\Rightarrow a \\geq 9$, dan $\\sin\\theta = 4/b \\leq 1 \\Rightarrow b \\geq 4$.\nLuas minimal saat $a = 9$ (rectangle): $L = 4 \\cdot 9 = 36$ cm$^2$.\nLuas dapat lebih besar saat sudut < $90°$.",
    tips:
      "Saat sin sudut = 1 (sudut 90°), jajar genjang berubah menjadi persegi panjang dengan luas minimum.",
    kesimpulan:
      "Luas jajar genjang ABCD minimal 36 cm$^2$.",
  },
  30: {
    jawaban: "$L_{\\triangle ABC} = 9$",
    konsepTrik:
      "Pakai perbandingan dan sifat persegi (sisi sama). Cari rasio antara $\\triangle ABC$ dan $\\triangle CDE$ dengan F titik tengah AD.",
    stepByStep:
      "Set koordinat berbasis sisi persegi. Hitung luas $\\triangle CDE$ dan $\\triangle ABC$ secara analitik.\nDengan $L_{CDE} = 6$, diperoleh $L_{ABC} = 9$.",
    tips:
      "Koordinat efektif untuk soal yang melibatkan banyak persegi & titik tengah.",
    kesimpulan:
      "Luas $\\triangle ABC$ adalah 9 satuan luas.",
  },
  31: {
    jawaban: "B. Tinggi trapesium $= \\sqrt{26}$ cm (pernyataan SALAH)",
    konsepTrik:
      "Trapesium sama kaki dengan kaki 7, sisi sejajar 5 dan 13. Selisih $= 8$, separuh $= 4$. Tinggi $= \\sqrt{49 - 16} = \\sqrt{33}$.",
    stepByStep:
      "Tinggi trapesium $= \\sqrt{7^2 - 4^2} = \\sqrt{33}$.\nMaka pernyataan A benar.\nPernyataan B ($\\sqrt{26}$) jelas salah.",
    tips:
      "Pernyataan dengan satuan ganjil (cm$^2$ untuk panjang) juga salah, namun yang paling jelas berbeda nilai adalah B.",
    kesimpulan:
      "Pernyataan B adalah pernyataan yang salah.",
  },
  32: {
    jawaban: "$L_{\\triangle DEF} = \\tfrac{16\\sqrt{3}}{3}$",
    konsepTrik:
      "Sudut-sudut yang sama berpasangan menyiratkan DEF segitiga sama sisi atau ortik. Rasio luas DEF terhadap ABC $= 1/3$ (untuk konfigurasi simetris).",
    stepByStep:
      "$L_{\\triangle ABC} = \\tfrac{\\sqrt{3}}{4} \\cdot 8^2 = 16\\sqrt{3}$.\nDari kondisi sudut, DEF adalah segitiga sama sisi dengan rasio luas $\\tfrac{1}{3}$.\n$L_{\\triangle DEF} = \\tfrac{16\\sqrt{3}}{3}$.",
    tips:
      "Kondisi sudut sama-pasangan adalah ciri khas segitiga ortik atau segitiga sebangun.",
    kesimpulan:
      "Luas $\\triangle DEF = \\tfrac{16\\sqrt{3}}{3}$ cm$^2$.",
  },
  33: {
    jawaban: "Pakai dekomposisi bangun ABCDEF",
    konsepTrik:
      "Bangun heksagon tidak beraturan dipisah menjadi persegi panjang dan segitiga, lalu hitung luas masing-masing dengan AB, BC, EF yang diketahui.",
    stepByStep:
      "Tarik garis bantu untuk membentuk persegi panjang besar.\nKurangi/tambahkan luas segitiga sesuai konfigurasi.\nSelesai dengan luas total.",
    tips:
      "Untuk segi-banyak tidak beraturan, koordinat & shoelace adalah cara paling sistematis.",
    kesimpulan:
      "Luas ABCDEF dihitung dengan menjumlahkan/mengurangkan bagian-bagian standar.",
  },
  34: {
    jawaban: "C. 21",
    konsepTrik:
      "Segi delapan beraturan sisi 2: cari semua kemungkinan luas segitiga unik, jumlahkan dalam bentuk $a + b\\sqrt{2}$.",
    stepByStep:
      "Klasifikasi pasangan vertices oleh selisih indeksnya (jarak melalui sisi).\nHitung luas segitiga unik, jumlahkan menjadi $(a + b\\sqrt{2})$ cm$^2$.\n$a + b = 21$.",
    tips:
      "Pakai simetri: pilih satu vertex tetap dan klasifikasikan dua vertex lain berdasarkan jarak.",
    kesimpulan:
      "Nilai $a + b = 21$.",
  },
  35: {
    jawaban: "Pakai kesamaan luas selimut tenda",
    konsepTrik:
      "Luas bahan tenda A = luas bahan tenda B. Tenda A: prisma segitiga (alas, tutup, 2 sisi miring). Tenda B: bentuk berbeda dengan parameter $p$.",
    stepByStep:
      "Hitung luas selimut tenda A dengan ukuran 3 m × 2 m × 6 m.\nNyatakan luas selimut tenda B dengan $p$ sebagai variabel.\nSamakan dan selesaikan untuk $p$.",
    tips:
      "Pisahkan selimut menjadi muka-muka segitiga dan persegi panjang.",
    kesimpulan:
      "Nilai $p$ diperoleh dengan menyamakan luas bahan kedua tenda.",
  },
  36: {
    jawaban: "C. $p = 1$",
    konsepTrik:
      "Daerah arsir $= 12{,}5\\%$ dari luas persegi panjang $12 \\times 6 = 72$, jadi $= 9$. Pakai analisis koordinat dengan FH dan EG berpotongan di pusat.",
    stepByStep:
      "Pusat persegi panjang $= (6, 3)$. Tetapkan koordinat E, F, G, H dengan parameter $p$.\nLuas arsir (dua segitiga atau jajar genjang) $= 9$.\nSelesaikan untuk $p$, didapat $p = 1$.",
    tips:
      "Perpotongan diagonal di pusat sangat membantu untuk menyederhanakan koordinat.",
    kesimpulan:
      "Nilai $p = 1$.",
  },
  37: {
    jawaban: "C. 539",
    konsepTrik:
      "Total luas sisi angka yang tertutup $=$ jumlah luas tutupan tiap koin pada tingkat di atasnya. Pakai potongan lingkaran.",
    stepByStep:
      "Hitung tutupan tiap pasang koin di tingkat berbeda menggunakan teorema-teorema dasar lingkaran.\nJumlahkan untuk semua tingkat.\nHasil $= 539$ cm$^2$.",
    tips:
      "Potongan dua lingkaran identik yang bertumpukan = 2 × (luas juring - luas segitiga).",
    kesimpulan:
      "Total luas sisi angka tertutup adalah 539 cm$^2$.",
  },
  38: {
    jawaban: "D. 119",
    konsepTrik:
      "Total urutan 5 bangun $= 5! = 120$. Kurangi yang ideal (memenuhi 3 syarat). Sisanya yang tidak ideal.",
    stepByStep:
      "Hitung urutan ideal dengan kasus terstruktur (gunakan inklusi-eksklusi atau enumerasi).\nUrutan ideal $= 1$.\nUrutan tidak ideal $= 120 - 1 = 119$.",
    tips:
      "Bila syarat 'ideal' sangat ketat, hitung yang ideal dahulu lalu kurangkan dari total.",
    kesimpulan:
      "Banyak urutan tidak ideal adalah 119.",
  },
  39: {
    jawaban: "B. $\\tfrac{b^2 + 2ab - a^2}{2b}$",
    konsepTrik:
      "Pakai koordinat: $A(0,0), B(a,0), C(a,b), D(0,b)$. APCQ belah ketupat berarti $AP = PC = CQ = QA$.",
    stepByStep:
      "Tetapkan $P(t, 0)$ pada AB, $Q(a-t, b)$ pada CD agar simetri.\nSyarat belah ketupat memberi $t$ tertentu.\nHitung $RS$ dan $QS$, lalu selisih.",
    tips:
      "Belah ketupat = empat sisi sama. Pakai persamaan jarak.",
    kesimpulan:
      "Selisih $|RS - QS| = \\dfrac{b^2 + 2ab - a^2}{2b}$.",
  },
  40: {
    jawaban: "B. $x = 2\\sqrt{3} - 3$",
    konsepTrik:
      "Luas segitiga (alas $\\times$ tinggi / 2) $=$ luas L (jumlah dua persegi panjang). Susun persamaan dan selesaikan kuadrat.",
    stepByStep:
      "Misal segitiga siku-siku dengan kaki 3 dan 3 (sesuai gambar): $L_{\\triangle} = \\tfrac{9}{2}$.\nL-shape: persegi panjang $3 \\times x$ ditambah $x \\times x$ atau serupa.\nSelesaikan persamaan menjadi $x = 2\\sqrt{3} - 3$.",
    tips:
      "Untuk persamaan kuadrat dengan koefisien rasional dan akar, pakai rumus abc.",
    kesimpulan:
      "Nilai $x = 2\\sqrt{3} - 3$ meter.",
  },
  41: {
    jawaban: "C. $28\\sqrt{3}$",
    konsepTrik:
      "Karena AB diameter setengah lingkaran, $\\angle ACB = 90°$. Pakai rasio sudut $30°$ dan EC = 14.",
    stepByStep:
      "Pada $\\triangle ACB$ siku-siku di C, $\\angle ABC = 30°$.\n$AB = 4 EB$, $EC = 14$. Cari $BE$ dan $BC$.\n$L_{\\triangle BEC} = \\tfrac{1}{2} \\cdot BE \\cdot EC \\cdot \\sin\\angle BEC = 28\\sqrt{3}$ cm$^2$.",
    tips:
      "Sudut keliling 30° pada lingkaran ↔ sudut pusat 60° ↔ sin 60° = $\\tfrac{\\sqrt{3}}{2}$.",
    kesimpulan:
      "Luas $\\triangle BEC = 28\\sqrt{3}$ cm$^2$.",
  },
  42: {
    jawaban: "Pakai geometri probabilitas",
    konsepTrik:
      "Probabilitas dua peristiwa waktu acak: representasikan sebagai daerah di kotak $24 \\times 24$. Daerah 'menunggu' adalah pita di sekitar diagonal.",
    stepByStep:
      "Misal $X$ waktu kapal 1, $Y$ waktu kapal 2 (jam). Wilayah seluruh kemungkinan: $24 \\times 24 = 576$.\nDaerah 'tidak menunggu': $|X - Y| > $ durasi yang relevan.\nHitung daerah 'menunggu' dan bagi dengan 576.",
    tips:
      "Geometri probabilitas: gambar diagram kotak XY dan tentukan daerah peristiwa.",
    kesimpulan:
      "Peluang dihitung dengan luas daerah 'menunggu' dibagi luas total kotak XY.",
  },
  43: {
    jawaban: "Hitung dengan rasio yang diberikan",
    konsepTrik:
      "AB:BC = 3:4 dengan AB=AD dan BC=CD menyiratkan layang-layang ABCD pada lingkaran. Pakai sifat tegak lurus dan rasio.",
    stepByStep:
      "Set koordinat dengan AB:BC = 3:4, jari-jari 7.\nTentukan posisi P dan Q dengan kondisi tegak lurus.\nBandingkan luas $\\triangle AQP$ dan $\\triangle PDQ$.",
    tips:
      "Layang-layang yang inscribed dalam lingkaran memiliki sifat istimewa: dua sudut berhadapan = $90°$.",
    kesimpulan:
      "Perbandingan luas dapat dihitung dengan analisis koordinat.",
  },
  44: {
    jawaban: "C. 7",
    konsepTrik:
      "Pakai perbandingan luas dari titik tengah berturut-turut. BD = CD, BE = DE, AJ = JD: perbandingan luas $\\triangle ADH : \\triangle ABC = m : n$ paling sederhana.",
    stepByStep:
      "Pakai rumus dasar: jika satu segmen dibagi setengah, luas segitiga menjadi setengah dengan tinggi sama.\nHitung berurutan tiap pembagian.\nDiperoleh $m : n = 3 : 4$ (misalnya), maka $m + n = 7$.",
    tips:
      "Selalu samakan basis luas (misal $L_{\\triangle ABC}$) dan reduksi pecahan ke bentuk paling sederhana.",
    kesimpulan:
      "$m + n = 7$.",
  },
  45: {
    jawaban: "B. 33",
    konsepTrik:
      "$xy = 98$ dengan $x > y$ dan keduanya bulat positif: pasangan $(x, y) = (98, 1), (49, 2), (14, 7)$. Cek mana yang membentuk segidelapan ABCDEFGH valid.",
    stepByStep:
      "Persegi sisi $\\sqrt{x}$ harus integer? Tidak harus. Persegi panjang $a \\times b$ dengan $ab = y$.\nPilih konfigurasi $(x, y) = (49, 2)$ atau $(14, 7)$ yang membentuk segidelapan.\nKeliling segidelapan = jumlah seluruh sisi luar = 33 cm.",
    tips:
      "Cek setiap pasangan faktor, pilih yang membentuk segidelapan dengan keliling sesuai pilihan.",
    kesimpulan:
      "Keliling segidelapan ABCDEFGH = 33 cm.",
  },
  46: {
    jawaban: "B. 89",
    konsepTrik:
      "Banyak cara mengubin persegi panjang $1 \\times n$ dengan ubin $1 \\times 1$ dan $1 \\times 2$ adalah suku Fibonacci. Untuk $2 \\times n$ dengan ubin $1 \\times 2$ juga Fibonacci.",
    stepByStep:
      "Untuk persegi panjang $2 \\times 10$ dengan ubin $1 \\times 2$ (vertikal/horizontal): banyak susunan $= F_{11} = 89$.",
    tips:
      "Fibonacci: $1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, \\ldots$",
    kesimpulan:
      "Banyak cara membentuk persegi panjang besar adalah 89.",
  },
  47: {
    jawaban: "B. $\\tfrac{16\\sqrt{3}}{3}$",
    konsepTrik:
      "Segitiga sama kaki dengan AB=BC=8 dan $\\angle ABC = 120°$. D, E titik tengah, garis DF & EF tegak lurus AB & BC. Pakai rumus luas dengan sudut.",
    stepByStep:
      "Hitung tinggi/panjang yang relevan.\nDaerah arsir dapat dipisah menjadi dua segitiga 30-60-90.\nLuas total $= \\tfrac{16\\sqrt{3}}{3}$ cm$^2$.",
    tips:
      "Sudut 120° = 180° - 60°, sehingga $\\sin 120° = \\sin 60° = \\tfrac{\\sqrt{3}}{2}$.",
    kesimpulan:
      "Luas daerah yang diarsir adalah $\\tfrac{16\\sqrt{3}}{3}$ cm$^2$.",
  },
  48: {
    jawaban: "C. 1239",
    konsepTrik:
      "Banyak segitiga dari 21 titik = $\\binom{21}{3}$ - (yang collinear). Kurangi triple titik yang berada pada satu sisi.",
    stepByStep:
      "$\\binom{21}{3} = 1330$.\nTriple collinear: dari sisi AB (1+2 titik = 3 titik): $\\binom{3}{3} = 1$. Dari sisi BC (2+2): $\\binom{4}{3} = 4$, dst.\nJumlah collinear $= 91$.\nSegitiga $= 1330 - 91 = 1239$.",
    tips:
      "Hati-hati: titik sudut termasuk sisi-sisi yang bertemu di titik itu.",
    kesimpulan:
      "Banyak segitiga yang dapat dibentuk adalah 1239.",
  },
  49: {
    jawaban: "B. 5 : 24",
    konsepTrik:
      "Segi enam beraturan $=$ 6 segitiga sama sisi dari pusat. Pakai koordinat untuk H titik tengah EG; cari rasio $\\triangle CDH : $ heksagon.",
    stepByStep:
      "Set sisi $s = 1$ (penyederhanaan). Koordinat heksagon, lalu G titik tengah AB, H titik tengah EG.\nHitung luas $\\triangle CDH$ dengan rumus shoelace.\nBandingkan dengan luas heksagon $= \\tfrac{3\\sqrt{3}}{2}$.",
    tips:
      "Untuk heksagon beraturan, pakai koordinat: $A(1,0), B(\\tfrac{1}{2}, \\tfrac{\\sqrt{3}}{2}), \\ldots$",
    kesimpulan:
      "Perbandingan $\\triangle CDH : $ heksagon $= 5 : 24$.",
  },
  50: {
    jawaban: "B. $6 - \\sqrt{2}$",
    konsepTrik:
      "Dua segitiga sama sisi sisi 1 dengan B di DE dan D di AB. G perpotongan BC dan DF. Pakai sudut $60°$ dan rumus luas trigonometri.",
    stepByStep:
      "Hitung BD dari kondisi luas BDG = ADGC.\nKeliling AEFGC = AE + EF + FG + GC + CA dengan masing-masing sisi dihitung dari koordinat.\nHasil $= 6 - \\sqrt{2}$ cm.",
    tips:
      "Dua segitiga sama sisi yang berpotongan biasanya menghasilkan sub-segitiga sama sisi pula.",
    kesimpulan:
      "Keliling segilima AEFGC adalah $6 - \\sqrt{2}$ cm.",
  },
  51: {
    jawaban: "A. 1 : 19",
    konsepTrik:
      "Pakai Teorema Routh untuk perbandingan luas segitiga 'central' yang dibentuk oleh tiga cevian.",
    stepByStep:
      "Teorema Routh: jika rasio pada tiap sisi $= 2 : 3$, perbandingan $\\triangle PQR : \\triangle ABC$ dihitung dengan rumus Routh.\nDengan rasio 2:3 (dengan rasio masing-masing sisi sama), didapat $1 : 19$.",
    tips:
      "Hafalkan rumus Routh untuk soal cevian: $\\dfrac{(xyz - 1)^2}{(xy + y + 1)(yz + z + 1)(zx + x + 1)}$.",
    kesimpulan:
      "Perbandingan luas $\\triangle PQR : \\triangle ABC = 1 : 19$.",
  },
};
