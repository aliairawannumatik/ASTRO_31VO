import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { pembahasanDasar, pembahasanOlimpiade } from "@/data/bangunRuangSisiDatarPembahasan";

// Helper function to render text with LaTeX
const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - BANGUN RUANG SISI DATAR",
  sections: [
    {
      heading: "A. Kubus",
      content: `Kubus adalah bangun ruang yang semua sisinya berbentuk persegi dan semua rusuknya sama panjang.

1. Unsur-Unsur Kubus
a. Sisi/Bidang: Kubus memiliki 6 buah sisi yang semuanya berbentuk persegi
b. Rusuk: Kubus memiliki 12 buah rusuk
c. Titik Sudut: Kubus memiliki 8 buah titik sudut
d. Diagonal Bidang: Kubus memiliki 12 diagonal bidang, panjang = $r\\sqrt{2}$
e. Diagonal Ruang: Kubus memiliki 4 diagonal ruang, panjang = $r\\sqrt{3}$
f. Bidang Diagonal: Kubus memiliki 6 buah bidang diagonal, luas = $r^2\\sqrt{2}$

2. Luas permukaan dan Volume Kubus
Luas permukaan Kubus: $6r^2$
Volume Kubus: $r^3$`
    },
    {
      heading: "B. Balok",
      content: `Balok adalah bangun ruang yang memiliki tiga pasang sisi berhadapan yang sama bentuk dan ukurannya, di mana setiap sisinya berbentuk persegi panjang.

1. Diagonal bidang Balok
- Pada bidang ABCD dan EFGH: $\\sqrt{p^2 + l^2}$
- Pada bidang BCGF dan ADHE: $\\sqrt{l^2 + t^2}$
- Pada bidang ABFE dan DCGH: $\\sqrt{p^2 + t^2}$

2. Diagonal Ruang Balok: $\\sqrt{p^2 + l^2 + t^2}$

3. Luas permukaan dan volume balok
Luas permukaan Balok: $2[(p \\times l) + (l \\times t) + (p \\times t)]$
Volume Balok: $p \\times l \\times t$

4. Balok yang Dibentuk dari Kubus-Kubus Satuan
- Banyaknya kubus yang terkena cat pada 3 sisi adalah 8 buah kubus
- Banyaknya kubus yang terkena cat pada 2 sisi adalah $4[(p-2) + (l-2) + (t-2)]$
- Banyaknya kubus yang terkena cat pada 1 sisi adalah $2[(p-2)(l-2) + (p-2)(t-2) + (l-2)(t-2)]$
- Banyaknya kubus yang tidak terkena cat adalah $(p-2)(l-2)(t-2)$`
    },
    {
      heading: "C. Prisma",
      content: `Prisma adalah bangun ruang yang memiliki bentuk alas dan atap yang sama bentuk dan ukurannya. Semua sisi bagian samping berbentuk persegipanjang.

Unsur-unsur Prisma segi-n:
- Banyak sisi: n + 2
- Banyak rusuk: 3n
- Banyak titik sudut: 2n
- Banyak diagonal bidang: n(n-1)
- Banyak diagonal ruang: n(n-3)
- Banyak bidang diagonal: $\\frac{n}{2}(n-1)$

Luas permukaan prisma: $2L_a + K_a \\times t$
Volume prisma: $L_a \\times t$

Keterangan:
$L_a$ = luas alas prisma
$K_a$ = keliling alas prisma
t = tinggi prisma`
    },
    {
      heading: "D. Limas",
      content: `Limas adalah bangun ruang yang memiliki satu bidang alas dan sisi-sisi tegak berbentuk segitiga yang bertemu di satu titik puncak.

Unsur-unsur Limas segi-n:
- Banyak sisi: n + 1
- Banyak rusuk: 2n
- Banyak titik sudut: n + 1

Luas Permukaan = Luas Alas + Jumlah Luas sisi-sisi tegak

Volume Limas = $\\frac{1}{3} \\times$ Luas alas $\\times$ tinggi`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Pada rangkaian persegi berikut yang merupakan jaring-jaring kubus adalah ...", options: ["A. Gambar A", "B. Gambar B", "C. Gambar C", "D. Gambar D"] },
  { no: 2, soal: "Perhatikan gambar!\nAgar dapat membentuk balok, persegipanjang yang harus dihilangkan bernomor ....", options: ["A. 5 dan 6", "B. 5 dan 7", "C. 1 dan 7", "D. 1 dan 8"] },
  { no: 3, soal: "Daerah yang diarsir pada gambar disebut ....", options: ["A. Diagonal bidang", "B. Bidang diagonal", "C. Diagonal ruang", "D. Diagonal sisi"] },
  { no: 4, soal: "Banyaknya diagonal ruang dan bidang diagonal balok adalah ...", options: ["A. 4 dan 6", "B. 4 dan 12", "C. 6 dan 4", "D. 12 dan 4"] },
  { no: 5, soal: "Nama bangun yang mempunyai rusuk sebanyak 54 dan sisi sebanyak 28 adalah ....", options: ["A. Prisma segi-18", "B. Prisma segi-24", "C. Limas segi-18", "D. Limas segi-27"] },
  { no: 6, soal: "Banyak rusuk, titik sudut dan sisi pada prisma segi-9 berturut-turut adalah p, q, r. Maka nilai p + q + r adalah...", options: ["A. 38", "B. 46", "C. 56", "D. 62"] },
  { no: 7, soal: "Banyak sisi dan rusuk pada prisma segi-10 adalah...", options: ["A. 10 dan 20", "B. 10 dan 30", "C. 12 dan 20", "D. 12 dan 30"] },
  { no: 8, soal: "Diketahui a, b, c adalah rusuk, sisi dan titik sudut pada limas segi-12. Maka nilai a + b - c adalah...", options: ["A. 24", "B. 36", "C. 40", "D. 46"] },
  { no: 9, soal: "Perhatikan gambar berikut\nSebuah balok dibentuk dari kubus-kubus kecil seperti tampak pada gambar di atas. Jika seluruh permukaan balok di cat, maka banyaknya kubus yang tidak terkena cat adalah ...", options: ["A. 8 buah", "B. 24 buah", "C. 32 buah", "D. 44 buah"] },
  { no: 10, soal: "Perhatikan gambar berikut!\nSebuah balok yang disusun dari kubus satuan. Jika bagian luar seluruh permukaan balok di cat, maka banyak kubus satuan yang terkena cat pada satu permukaan adalah ....", options: ["A. 26 buah", "B. 42 buah", "C. 52 buah", "D. 102 buah"] },
  { no: 11, soal: "Gambar berikut adalah mainan anak-anak yang berbentuk balok, tersusun dari kubus-kubus satuan yang kongruen. Jika seluruh permukaan balok tersebut dicat, banyaknya kubus satuan yang terkena cat pada dua sisinya saja adalah ....", options: ["A. 16", "B. 18", "C. 24", "D. 28"] },
  { no: 12, soal: "Via akan membuat kerangka balok dari kawat. Jika kerangka balok yang akan dibuat berukuran 10 cm x 6 cm x 4 cm dan panjang kawat yang tersedia 7,2 m, maka banyak kerangka balok yang dapat dibuat oleh Via adalah ....", options: ["A. 6 buah", "B. 8 buah", "C. 9 buah", "D. 12 buah"] },
  { no: 13, soal: "Pak Dani membuat kerangka berbentuk balok yang terbuat dari alumunium dengan ukuran 60 cm x 50 cm x 80 cm. jika harga alumunium Rp40.000,00 tiap meter maka biaya yang diperlukan untuk membeli alumunium adalah...", options: ["A. Rp72.000,00", "B. Rp96.000,00", "C. Rp288.000,00", "D. Rp960.000,00"] },
  { no: 14, soal: "Sebuah kerangka aquarium berbentuk prisma segitiga dengan tinggi 60 cm dibuat dari alumunium. Panjang sisi-sisi segitiga itu 30 cm, 40 cm, dan 50 cm. Jika harga 1m alumunium adalah Rp30.000,00, harga alumunium untuk membuat kerangka tersebut adalah ....", options: ["A. Rp120.000,00", "B. Rp126.000,00", "C. Rp140.000,00", "D. Rp160.000,00"] },
  { no: 15, soal: "Rosa akan membuat model kerangka limas dan prisma masing-masing satu buah. Model kerangka limas alasnya berbentuk persegi panjang dengan ukuran 8 cm x 6 cm dengan tinggi limas 12 cm. Sedangkan kerangka prisma alasnya berbentuk segi enam beraturan dengan panjang sisi 12 cm dan tinggi prisma 20 cm. Jika Rosa memiliki persediaan kawat 4 m, maka sisa kawat yang tidak terpakai adalah...", options: ["A. 50 cm", "B. 54 cm", "C. 58 cm", "D. 60 cm"] },
  { no: 16, soal: "Ardian akan membuat sebuah model kerangka limas yang alasnya berbentuk persegi, dengan panjang sisi 8 cm, jika panjang rusuk tegak limas 10 cm, maka panjang kawat yang diperlukan adalah ....", options: ["A. 36 cm", "B. 40 cm", "C. 72 cm", "D. 80 cm"] },
  { no: 17, soal: "Apri mendapat tugas untuk membuat kerangka lampu hias yang berbentuk kerangka limas seperti pada gambar. Jika kerangka limas tersebut dibuat dari rotan dan harga 1 m rotan adalah Rp20.000,00, maka biaya yang dibutuhkan seluruhnya adalah ...", options: ["A. Rp64.000,00", "B. Rp52.000,00", "C. Rp44.000,00", "D. Rp22.000,00"] },
  { no: 18, soal: "Panjang diagonal sisi sebuah kubus adalah $2\\sqrt{2}$ cm, maka luas permukaan kubus tersebut adalah ...", options: ["A. 96 $cm^2$", "B. 64 $cm^2$", "C. 24 $cm^2$", "D. 8 $cm^2$"] },
  { no: 19, soal: "Luas permukaan sebuah kotak peralatan yang berbentuk balok dengan ukuran 2 dm x 3 dm x 5 dm adalah ...", options: ["A. 180 $dm^2$", "B. 62 $dm^2$", "C. 45 $dm^2$", "D. 30 $dm^2$"] },
  { no: 20, soal: "Luas permukaan sebuah balok 148 $cm^2$, jika panjang 6 cm, dan lebar 5 cm, maka tingginya adalah ....", options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"] },
  { no: 21, soal: "Sebuah prisma tegak alasnya berbentuk segitiga siku-siku, panjang sisi siku-sikunya 5 cm dan 12 cm. Jika tinggi prisma 20 cm, maka luas prisma tersebut adalah ...", options: ["A. 660 $cm^2$", "B. 630 $cm^2$", "C. 600 $cm^2$", "D. 400 $cm^2$"] },
  { no: 22, soal: "Alas sebuah prisma berbentuk belah ketupat dengan panjang diagonalnya 10 cm dan 24 cm. Jika tinggi prisma 15 cm, luas permukaannya adalah....", options: ["A. 435 $cm^2$", "B. 780 $cm^2$", "C. 900 $cm^2$", "D. 1.020 $cm^2$"] },
  { no: 23, soal: "Alas limas berbentuk persegi dengan panjang sisi 14 cm, jika tinggi limas tersebut 24 cm, maka luas permukaannya adalah ....", options: ["A. 1568 $cm^2$", "B. 896 $cm^2$", "C. 869 $cm^2$", "D. 700 $cm^2$"] },
  { no: 24, soal: "Alas limas berbentuk persegi dengan panjang sisi 10 cm. Jika tinggi limas 12 cm, maka luas permukaan limas adalah ...", options: ["A. 340 $cm^2$", "B. 360 $cm^2$", "C. 620 $cm^2$", "D. 680 $cm^2$"] },
  { no: 25, soal: "Perhatikan gambar kubus ABCD. EFGH berikut.\nJika panjang AB = 24 cm, BC = 10 cm dan 20 cm. Maka luas bidang diagonal ACEG adalah ....", options: ["A. 240 $cm^2$", "B. 480 $cm^2$", "C. 500 $cm^2$", "D. 520 $cm^2$"] },
  { no: 26, soal: "Perhatikan gambar balok ABCD.EFGH berikut!\nJika panjang AB = 15 cm, BC = 8 cm, dan CG = 12 cm, maka luas bidang diagonal ACGE adalah ....", options: ["A. 180 $cm^2$", "B. 136 $cm^2$", "C. 126 $cm^2$", "D. 120 $cm^2$"] },
  { no: 27, soal: "Nada akan membuat aquarium besar berbentuk balok tanpa tutup berukuran 2 m x 1 m x 0,5 m yang terbuat dari kaca. Jika harga kaca Rp80.000,00 / $m^2$, maka biaya pembelian kaca adalah...", options: ["A. Rp 400.000,00", "B. Rp 460.000,00", "C. Rp 500.000,00", "D. Rp 600.000,00"] },
  { no: 28, soal: "Sebuah prisma tegak alasnya berbentuk belah ketupat dengan panjang diagonal 24 cm dan 10 cm. Jika tinggi prisma 20 cm, maka luas seluruh permukaan prisma adalah ....", options: ["A. 1280 $cm^2$", "B. 1160 $cm^2$", "C. 1040 $cm^2$", "D. 480 $cm^2$"] },
  { no: 29, soal: "Atap sebuah gedung berbentuk limas yang alasnya persegi. Panjang sisi alas limas 16 m dan tinggi limas 6 m. Jika atap akan dicat dengan biaya Rp10.000,00 per meter persegi, maka biaya keseluruhan yang diperlukan adalah ....", options: ["A. Rp3.200.000,00", "B. Rp2.400.000,00", "C. Rp1.600.000,00", "D. Rp1.200.000,00"] },
  { no: 30, soal: "Perhatikan gambar berikut.\nLuas seluruh bangun tersebut adalah ....", options: ["A. 760 $cm^2$", "B. 720 $cm^2$", "C. 660 $cm^2$", "D. 640 $cm^2$"] },
  { no: 31, soal: "Sebuah kubus mempunyai panjang diagonal ruang adalah $5\\sqrt{3}$ cm. maka volumenya adalah", options: ["A. 150 $cm^3$", "B. 125 $cm^3$", "C. 75 $cm^3$", "D. 45 $cm^3$"] },
  { no: 32, soal: "Luas salah satu sisi pada kubus adalah 25 $cm^2$. Maka volume kubus tersebut adalah ...", options: ["A. 625 $cm^3$", "B. 150 $cm^3$", "C. 125 $cm^3$", "D. 50 $cm^3$"] },
  { no: 33, soal: "Perbandingan panjang rusuk-rusuk sebuah balok 2 : 3 : 4, jika luas permukaan balok tersebut 248 $cm^2$, maka volumenya adalah ....", options: ["A. 24 $cm^3$", "B. 32 $cm^3$", "C. 180 $cm^3$", "D. 192 $cm^3$"] },
  { no: 34, soal: "Sebuah kaleng roti berbentuk prisma tegak yang alasnya persegipanjang dengan panjang 12 cm, dan lebar 8 cm, jika tinggi prisma 10 cm. maka volume kaleng roti tersebut adalah ....", options: ["A. 320 $cm^3$", "B. 480 $cm^3$", "C. 960 $cm^3$", "D. 1440 $cm^3$"] },
  { no: 35, soal: "Pada sebuah prisma yang alasnya belahketupat, diketahui panjang sisinya 13 cm, panjang salah satu diagonalnya 10 cm, dan tinggi prisma 15 cm, volume prisma adalah ...", options: ["A. 1.800 $cm^3$", "B. 1.200 $cm^3$", "C. 650 $cm^3$", "D. 600 $cm^3$"] },
  { no: 36, soal: "Perhatikan gambar prisma berikut!\nVolumenya adalah ....", options: ["A. 800 $cm^3$", "B. 1.600 $cm^3$", "C. 2.400 $cm^3$", "D. 3.200 $cm^3$"] },
  { no: 37, soal: "Sebuah prisma alasnya berbentuk jajar genjang dengan panjang alas 15 cm dan tinggi 8 cm. Jika tinggi prisma 20 cm, volume prisma tersebut adalah ....", options: ["A. 2.400 $cm^3$", "B. 2.100 $cm^3$", "C. 1.800 $cm^3$", "D. 800 $cm^3$"] },
  { no: 38, soal: "Sebuah prisma alasnya berbentuk segitiga siku-siku, panjang sisi siku-sikunya 8 cm dan 15 cm, jika volume prisma itu 1200 $cm^3$.\nHitunglah:\na. Tinggi prisma\nb. Luas seluruh permukaan prisma", options: [] },
  { no: 39, soal: "Perhatikan gambar limas T.ABCD di samping!\nPanjang AB = BC = CD = AD = 30 cm. Jika volume limas 6000 $cm^3$, maka panjang garis TE adalah ....", options: ["A. 20 cm", "B. 25 cm", "C. 35 cm", "D. 40 cm"] },
  { no: 40, soal: "Alas sebuah limas berbentuk belah ketupat dengan keliling 52 cm dan panjang salah satu diagonalnya 10 cm serta tinggi limas 12 cm. Volume limas tersebut adalah....", options: ["A. 720 $cm^3$", "B. 1.296 $cm^3$", "C. 1.728 $cm^3$", "D. 2.880 $cm^3$"] },
  { no: 41, soal: "Alas sebuah limas berbentuk belah ketupat dengan keliling 60 cm dan panjang salah satu diagonalnya 18 cm, jika tinggi limas 20 cm, maka volume limas tersebut adalah....", options: ["A. 1440 $cm^3$", "B. 1800 $cm^3$", "C. 2160 $cm^3$", "D. 2880 $cm^3$"] },
  { no: 42, soal: "Sebuah limas mempunyai alas berbentuk jajargenjang yang panjang salah satu sisinya 12 cm dan jarak antara sisi itu dengan sisi sejajarnya adalah 15 cm. Jika volumnya 600 $cm^3$, maka tinggi limas tersebut adalah ....", options: ["A. 30 cm", "B. 10 cm", "C. 6,6 cm", "D. 3,3 cm"] },
  { no: 43, soal: "Perhatikan gambar berikut!\nVolume bangun di atas adalah....", options: ["A. 144 $cm^3$", "B. 576 $cm^3$", "C. 644 $cm^3$", "D. 720 $cm^3$"] },
  { no: 44, soal: "Sebuah kubus besar yang volumenya 27 $m^3$ dapat disusun dari kubus-kubus kecil dengan panjang rusuk 0,75 m sebanyak ....", options: ["A. 64 buah", "B. 48 buah", "C. 42 buah", "D. 32 buah"] },
  { no: 45, soal: "Sebuah bak air berbentuk balok dengan panjang 1,2 m, lebar 0,8 m dan tinggi 0,5 m berisi air $\\frac{3}{4}$ bagian. Air tersebut akan dituangkan ke dalam wadah berbentuk kubus dengan panjang rusuk 20 cm. Maka banyak kubus yang diperlukan untuk menampung air adalah.....", options: ["A. 20 buah", "B. 25 buah", "C. 40 buah", "D. 45 buah"] },
  { no: 46, soal: "Sebuah bak mandi berukuran panjang = 80 cm, lebar = 40 cm, tinggi 60 cm, berisi air setinggi 40 cm, jika 3 buah kubus yang panjang rusuknya 20 cm, dimasukkan ke dalam bak tersebut sehingga tenggelam, tentukan tinggi air sekarang!", options: [] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nDiketahui sebuah bak berbentuk balok yang terisi penuh dengan air. Bak tersebut akan dikosongkan dengan menggunakan pompa yang mampu menyedot air 0,7 liter per detik. Dalam waktu 30 menit bak dapat dikosongkan tanpa sisa. Jika luas alas bak adalah 10500 $cm^3$, maka tinggi bak tersebut adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2005 Tingkat Kota\nSebuah balok memiliki sisi-sisi yang luasnya 24 $cm^2$, 32 $cm^2$ dan 48 $cm^2$. Berapakah jumlah panjang semua rusuk balok tersebut.", options: [] },
  { no: 3, soal: "OSN Matematika 2005 Tingkat Kota\nPompa air merk Tangguh sanggup memompa sebanyak 25 liter setiap menit. Pompa merek perkasa sanggup memompa air 400 cc setiap detik, sedangkan merek Tahan Banting sanggup memompa 1,6 $m^3$ setiap jam. Pompa manakah yang paling cepat mengisi sebuah tangka air berkapasitas 500 liter.", options: [] },
  { no: 4, soal: "OSN Matematika 2008 Tingkat Kota\nAnto memiliki sejumlah kubus kecil berwarna putih yang disusun menjadi sebuah kubus lebih besar. Sedikitnya satu sisi kubus besar dicat dengan warna hijau, tetapi masih ada setidaknya satu sisi berwarna putih. Kubus besar tersebut kemudian dibongkar kembali dan ditemukan bahwa ada 1.000 buah kubus kecil yang tetap berwarna putih di semua sisinya. Banyaknya sisi kubus besar yang telah diwarnai hijau adalah", options: [] },
  { no: 5, soal: "OSN Matematika 2010 Tingkat Kota\nSebuah prisma segi empat berukuran 15 cm x 15 cm x 10 cm, terbuat dari baja. Prisma tersebut setiap rusuknya diberi kerangka terbuat dari kawat dan setiap sisi di cat. Harga baja setiap 1 $cm^2$ adalah Rp800,00; setiap 4cm kawat harganya Rp1300,00 dan setiap 10 $cm^2$ membutuhkan cat dengan harga Rp1600,00. hitunglah biaya untuk membuat prisma segiempat tersebut adalah ...", options: ["A. Rp2.020.000,00", "B. Rp1.160.000,00", "C. Rp1.060.000,00", "D. Rp1.050.000,00", "E. Rp1.030.000,00"] },
  { no: 6, soal: "OSN Matematika 2010 Tingkat Kota\nEmpat kubus identik dengan panjang rusuk 5 cm disusun menjadi suatu bangun ruang dengan cara menempelkan sisi-sisinya. Banyak bangun ruang berbeda yang terbentuk adalah ...", options: ["A. 10", "B. 8", "C. 6", "D. 5", "E. 3"] },
  { no: 7, soal: "OSN Matematika 2011 Tingkat Kota\nDiketahui limas T.ABCD panjang rusuk AB 2 cm dan TA 4 cm, jarak titik M dan rusuk TD adalah ...", options: ["A. $\\sqrt{5}$", "B. $\\sqrt{6}$", "C. $\\sqrt{7}$", "D. $\\sqrt{25}$", "E. $\\sqrt{26}$"] },
  { no: 8, soal: "OSN Matematika 2012 Tingkat Kota\nSuatu balok dengan volume 240 satuan mempunyai panjang a, lebar b dan tinggi c (a, b dan c adalah bilangan asli). Jika a + b + c = 19 dan a > b > c > 3, maka luas permukaan balok yang sisinya mempunyai rusuk b dan c adalah ...", options: ["A. 64", "B. 60", "C. 48", "D. 40", "E. 30"] },
  { no: 9, soal: "OSN Matematika 2012 Tingkat Kota\nKubus ABCD.EFGH mempunyai panjang rusuk 2 cm. jika titik T adalah titik potong diagonal bidang BCGF, titik P adalah titik Tengah rusuk AB, dan titik Q adalah titik Tengah rusuk DC, maka jarak antara titik T dengan bidang PQHE adalah ... cm", options: [] },
  { no: 10, soal: "OSN Matematika 2013 Tingkat Kota\nJika diketahui panjang rusuk kubus ABCD.EFGH adalah 1 satuan, maka jarak titik E ke bidang datar AFH adalah ... satuan", options: ["A. $\\frac{1}{2}$", "B. $\\frac{\\sqrt{2}}{2}$", "C. $\\frac{1}{\\sqrt{3}}$", "D. $\\frac{\\sqrt{3}}{3}$", "E. $\\frac{3}{4}$"] },
  { no: 11, soal: "OSN Matematika 2014 Tingkat Kota\nKubus ABCD.EFGH mempunyai panjang rusuk 2 satuan. Titik O adalah titik potong dua diagonal pada bidang BCFG. Jarak titik O ke bidang BCEH adalah ... satuan", options: ["A. $\\frac{\\sqrt{2}}{5}$", "B. $\\frac{\\sqrt{2}}{4}$", "C. $\\frac{\\sqrt{2}}{3}$", "D. $\\frac{\\sqrt{2}}{2}$"] },
  { no: 12, soal: "OSN Matematika 2015 Tingkat Kota\nSuatu kardus polos dari kertas berbentuk kubus. Volume kardus adalah 64.000 $cm^3$. Fitri memotong tepat pada rusuk kubus dan mengambil dua sisi bagian samping kardus tersebut. Fitri membuat garis pada satu potong sisi kardus dan diperoleh satu segitiga siku-siku yang perbandingan dua sisi siku-siku adalah 1 : 2. Pada satu potongan sisi kardus yang lain dilukis satu segitiga sama kaki. Jika ternyata dua segitiga ini sama luasnya, maka panjang sisi yang sama pada segitiga sama kaki adalah ... cm", options: ["A. 10", "B. $10\\sqrt{2}$", "C. 20", "D. $20\\sqrt{2}$"] },
  { no: 13, soal: "OSN Matematika 2015 Tingkat Kota\nDua botol yang berukuran sama berisi penuh dengan larutan gula. Rasio kandungan gula dan air pada botol pertama adalah 2 : 11 dan pada botol kedua 3 : 5. Jika isi botol tersebut dicampurkan, maka rasio kandungan gula dan air hasil campurannya adalah ...", options: [] },
  { no: 14, soal: "OSN Matematika 2015 Tingkat Kota\nDiketahui sebuah prisma yang dibentuk oleh bidang-bidang sisi berupa dua trapesium yang kongruen ABFE dan DCGH. Jika AB sejajar EF, panjang AE = panjang BF, panjang AB = 2 kali panjang EF, panjang AP = panjang PB = panjang DQ = panjang QC, AD tegak lurus AB dan EH tegak lurus EF, maka perbandingan volume prisma APE.DQH dan prisma PBFE.QCGH adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2016 Tingkat Kota\nKetika suatu segitiga siku-siku diputar pada salah satu sisi siku-sikunya, maka diperoleh kerucut dengan volume $392\\pi$ $cm^3$. Bila diputar pada sisi siku-siku lainnya akan diperoleh kerucut dengan volume $1344\\pi$ $cm^3$. Panjang sisi miring segitiga siku-siku tersebut adalah ... cm", options: [] },
  { no: 16, soal: "OSN Matematika 2016 Tingkat Kota\nSuatu balok tersusun atas kubus satuan seperti pada gambar di samping. Balok tersebut dipancung sepanjang permukaan bangun datar yang dicetak tebal. Luas permukaan balok terpancung adalah ... satuan luas.", options: [] },
  { no: 17, soal: "OSN Matematika 2018 Tingkat Kota\nKubus ABCD.PQRS memiliki sisi-sisi yang panjangnya 4 cm. jika titik E titik Tengah PQ dan F adalah titik Tengah QR, maka luas ACFE adalah ... $cm^2$", options: ["A. 16", "B. 18", "C. 32", "D. 64"] },
  { no: 18, soal: "OSN Matematika 2019 Tingkat Kota\nDua akuarium A dan B diisi air sehingga volumnya sama yaitu 64.000 $cm^3$. Anto memiliki 30 kelereng kecil dan 20 kelereng besar yang akan dimasukkan ke dalam akuarium tersebut. Ke dalam akuarium A dimasukkan 7 kelereng kecil dan 7 kelereng besar sehingga volum akuarium yang terisi menjadi $64821\\frac{1}{3}$ $cm^3$. Sedangkan, kedalam akuarium B dimasukkan 21 kelereng kecil dan 7 kelereng besar sehingga volum akuarium yang terisi menjadi 64880 $cm^3$. Volum seluruh kelereng Anto yang tidak dimasukkan ke akuarium adalah ... $cm^3$", options: ["A. $113\\frac{3}{21}$", "B. $226\\frac{6}{21}$", "C. $251\\frac{9}{21}$", "D. $687\\frac{5}{21}$"] },
  { no: 19, soal: "OSN Matematika 2019 Tingkat Kota\nABCD adalah jajargenjang. E adalah titik Tengah AB. Ruas garis DE memotong AC di titik P. perbandingan luas jajargenjang ABCD dengan luas segitiga AEP adalah ...", options: ["A. 12 : 1", "B. 8 : 1", "C. 6 : 1", "D. 4 : 1"] },
  { no: 20, soal: "OSN Matematika 2023 Tingkat Provinsi\nSuatu penampung air berbentuk gabungan balok dan limas terpancung dengan ukuran dalam (m) seperti pada gambar berikut.\nPenampung tersebut yang semula kosong diisi air dengan debit 1000 $m^3$/jam. Waktu yang dibutuhkan agar air dalam penampungan setinggi $20 - 5\\sqrt{2}$ m adalah ... jam", options: [] },
  { no: 21, soal: "OSN Matematika 2025 Tingkat Kota\nSuatu bidang empat T.ABC memiliki bidang sisi segitiga TBC, TBA dan ABC yang masing-masing saling tegak lurus seperti pada gambar berikut.\nLuas TBC : Luas TBA : Luas ABC = 1 : 2 : 3 dan panjang AC = 10 cm, maka volume bidang empat T.ABC sama dengan ... $cm^2$", options: ["A. $\\frac{10\\sqrt{5}}{9}$", "B. $\\frac{80\\sqrt{5}}{3}$", "C. $80\\sqrt{5}$", "D. $320\\sqrt{5}$"] },
  { no: 22, soal: "OSN Matematika 2025 Tingkat Kota\nOktahendron adalah bilangan bangun ruang tiga dimensi dengan delapan bidang sisi datar. Berikut ini adalah jaring-jaring suatu octahedron beraturan yang memiliki delapan bidang sisi segitiga sama sisi yang kongruen.\nJika jaring-jaring tersebut dibentuk menjadi octahedron, maka angka pada setiap bidang sisi sama dengan penjumlahan semua bidang sisi yang berbagi rusuk dengan bidang sisi tersebut. (contoh : b = a + c + d). jika a = -4, c = 0 dan g = -10, maka nilai b adalah ...", options: ["A. -10", "B. -8", "C. 8", "D. 10"] },
];

const OlimpiadeBangunRuangSisiDatarPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [expandedDasarPembahasan, setExpandedDasarPembahasan] = useState<number[]>([]);
  const [expandedOlimpiadePembahasan, setExpandedOlimpiadePembahasan] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleDasarPembahasan = (no: number) => {
    playPopSound();
    setExpandedDasarPembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const toggleOlimpiadePembahasan = (no: number) => {
    playPopSound();
    setExpandedOlimpiadePembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - BANGUN RUANG SISI DATAR
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materi Tab */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <span className="font-display text-sm text-accent font-bold">{section.heading}</span>
                  {expandedSections.includes(idx) ? (
                    <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                  )}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-5 pb-4">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => (
                        <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {pembahasanDasar[soal.no] && (
                  <div>
                    <button
                      onClick={() => toggleDasarPembahasan(soal.no)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        expandedDasarPembahasan.includes(soal.no)
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                          : "bg-muted/30 border-border text-white/60 hover:border-emerald-500/40 hover:text-emerald-400"
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      {expandedDasarPembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                      {expandedDasarPembahasan.includes(soal.no)
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                      }
                    </button>
                    {expandedDasarPembahasan.includes(soal.no) && (
                      <div className="mt-3 bg-muted/20 border border-border/60 rounded-xl px-4 py-3 space-y-1">
                        {pembahasanDasar[soal.no]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {pembahasanOlimpiade[soal.no] && (
                  <div>
                    <button
                      onClick={() => toggleOlimpiadePembahasan(soal.no)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        expandedOlimpiadePembahasan.includes(soal.no)
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                          : "bg-muted/30 border-border text-white/60 hover:border-emerald-500/40 hover:text-emerald-400"
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      {expandedOlimpiadePembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                      {expandedOlimpiadePembahasan.includes(soal.no)
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                      }
                    </button>
                    {expandedOlimpiadePembahasan.includes(soal.no) && (
                      <div className="mt-3 bg-muted/20 border border-border/60 rounded-xl px-4 py-3 space-y-1">
                        {pembahasanOlimpiade[soal.no]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeBangunRuangSisiDatarPage;
