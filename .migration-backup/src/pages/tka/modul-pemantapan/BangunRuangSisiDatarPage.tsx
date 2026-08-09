import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Kubus", content: `Kubus: bangun ruang berisi 6 sisi berbentuk persegi, 12 rusuk sama panjang, 8 titik sudut.\n\nJika rusuk = s:\n- Luas permukaan = $6s^2$\n- Volume = $s^3$\n- Diagonal ruang = $s\\sqrt{3}$\n- Diagonal sisi = $s\\sqrt{2}$` },
  { heading: "B. Balok", content: `Balok: bangun ruang dengan 6 sisi berbentuk persegi panjang (tiga pasang), 12 rusuk, 8 titik sudut.\n\nJika panjang = p, lebar = l, tinggi = t:\n- Luas permukaan = $2(pl + pt + lt)$\n- Volume = $p \\times l \\times t$\n- Diagonal ruang = $\\sqrt{p^2 + l^2 + t^2}$` },
  { heading: "C. Prisma", content: `Prisma: bangun ruang dengan dua sisi alas yang sama dan sejajar, sisi tegak berbentuk persegi panjang.\n\n- Luas permukaan = $2 \\times L_{alas} + K_{alas} \\times t$\n- Volume = $L_{alas} \\times t$\n\n(L = luas, K = keliling, t = tinggi prisma)` },
  { heading: "D. Limas", content: `Limas: bangun ruang dengan satu sisi alas dan sisi tegak berbentuk segitiga bertemu di satu titik (puncak).\n\n- Luas permukaan = $L_{alas} + \\sum L_{sisi\\ tegak}$\n- Volume = $\\frac{1}{3} \\times L_{alas} \\times t$\n\nUntuk limas segi empat beraturan:\n- Tinggi sisi tegak: apotema\n- Luas sisi tegak = $\\frac{1}{2} \\times alas \\times apotema$` },
];

// ─── Contoh Soal — TES KEMAMPUAN AKADEMIK · MODUL PEMANTAPAN 2026–2027 ───
const contohSoal: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Volume kubus dengan panjang rusuk $6$ cm adalah ...",
    options: ["A. $196$ $cm^3$", "B. $206$ $cm^3$", "C. $216$ $cm^3$", "D. $226$ $cm^3$"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nVolume kubus $=s^3$.\n\nStep by Step Penyelesaian:\n$$V=6^3=216\\text{ }cm^3$$\n\nJawaban: C",
  },
  {
    no: 2, type: "pgk",
    soal: "Sebuah balok berukuran panjang $8$ cm, lebar $5$ cm, dan tinggi $4$ cm. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Volume balok tersebut adalah $160$ $cm^3$.",
      "Luas permukaan balok tersebut adalah $184$ $cm^2$.",
      "Panjang diagonal ruang balok tersebut adalah $\\sqrt{105}$ cm.",
      "Panjang diagonal ruang balok tersebut adalah $15$ cm.",
    ],
    jawabanPGK: [0, 1, 2],
    pembahasan: "Trik dan Tips:\n$V=p\\cdot l\\cdot t$; $L=2(pl+pt+lt)$; diagonal ruang $=\\sqrt{p^2+l^2+t^2}$.\n\nStep by Step Penyelesaian:\n(1) BENAR: $8\\times5\\times4=160$.\n\n(2) BENAR: $2(40+32+20)=2\\times92=184$.\n\n(3) BENAR: $\\sqrt{64+25+16}=\\sqrt{105}$.\n\n(4) SALAH: $\\sqrt{105}\\approx10{,}25$, bukan $15$.\n\nJawaban: (1), (2), dan (3) BENAR",
  },
  {
    no: 3, type: "pgkbs",
    soal: "Sebuah limas segiempat beraturan memiliki panjang sisi alas $10$ cm dan tinggi limas $12$ cm. Tentukan kebenaran pernyataan berikut!",
    pernyataan: [
      "Volume limas tersebut adalah $400$ $cm^3$.",
      "Tinggi sisi tegak (apotema) limas tersebut adalah $13$ cm.",
      "Luas permukaan limas tersebut adalah $500$ $cm^2$.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Trik dan Tips:\n$V=\\frac{1}{3}\\times L_{alas}\\times t$. Tinggi sisi tegak dicari dengan Pythagoras: $\\sqrt{t^2+(\\frac{1}{2}s)^2}$. Luas permukaan $=L_{alas}+4\\times L_{sisi\\ tegak}$.\n\nStep by Step Penyelesaian:\n$V=\\frac{1}{3}\\times100\\times12=400$ (BENAR).\n\nApotema $=\\sqrt{12^2+5^2}=\\sqrt{169}=13$ (BENAR).\n\n$L_{permukaan}=100+4\\times(\\frac{1}{2}\\times10\\times13)=100+260=360$, bukan $500$ (SALAH).",
  },
  {
    no: 4, type: "pg",
    soal: "Luas permukaan kubus dengan panjang rusuk $5$ cm adalah ...",
    options: ["A. $100$ $cm^2$", "B. $125$ $cm^2$", "C. $150$ $cm^2$", "D. $175$ $cm^2$"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nLuas permukaan kubus $=6s^2$.\n\nStep by Step Penyelesaian:\n$$L=6\\times5^2=6\\times25=150\\text{ }cm^2$$\n\nJawaban: C",
  },
  {
    no: 5, type: "pg",
    soal: "Sebuah prisma segitiga siku-siku memiliki alas segitiga dengan panjang kaki $6$ cm dan $8$ cm, serta tinggi prisma $10$ cm. Volume prisma tersebut adalah ...",
    options: ["A. $220$ $cm^3$", "B. $230$ $cm^3$", "C. $240$ $cm^3$", "D. $250$ $cm^3$"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nVolume prisma $=$ luas alas $\\times$ tinggi prisma. Luas alas segitiga siku-siku $=\\frac{1}{2}\\times$ kaki$_1\\times$kaki$_2$.\n\nStep by Step Penyelesaian:\nLuas alas $=\\frac{1}{2}\\times6\\times8=24$ $cm^2$.\n\n$$V=24\\times10=240\\text{ }cm^3$$\n\nJawaban: C",
  },
  {
    no: 6, type: "pgk",
    soal: "Sebuah kubus memiliki volume $512$ $cm^3$. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Panjang rusuk kubus tersebut adalah $8$ cm.",
      "Luas permukaan kubus tersebut adalah $384$ $cm^2$.",
      "Panjang diagonal sisi kubus tersebut adalah $8\\sqrt{2}$ cm.",
      "Panjang diagonal ruang kubus tersebut adalah $8\\sqrt{3}$ cm.",
    ],
    jawabanPGK: [0, 1, 2, 3],
    pembahasan: "Trik dan Tips:\n$s=\\sqrt[3]{V}$; diagonal sisi $=s\\sqrt{2}$; diagonal ruang $=s\\sqrt{3}$.\n\nStep by Step Penyelesaian:\n(1) BENAR: $8^3=512$.\n\n(2) BENAR: $6\\times8^2=6\\times64=384$.\n\n(3) BENAR: $8\\sqrt{2}$ sesuai rumus diagonal sisi.\n\n(4) BENAR: $8\\sqrt{3}$ sesuai rumus diagonal ruang.\n\nJawaban: Semua pernyataan BENAR",
  },
];

const latihanDasar: LatihanSoal[] = [
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

const BangunRuangSisiDatarPage = () => (
  <TKAPemantapanLayout
    title="BANGUN RUANG SISI DATAR"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
    contohSoal={contohSoal}
  />
);

export default BangunRuangSisiDatarPage;
