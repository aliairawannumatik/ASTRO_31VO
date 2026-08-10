import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { getTkaContohSoal } from "@/data/tkaContohSoal";
import { brslDasarImages } from "@/pages/OlimpiadeBangunRuangSisiLengkungPage";

const materiSections: MateriSection[] = [
  { heading: "A. Tabung (Silinder)", content: `Tabung: bangun ruang dengan dua sisi alas dan tutup berbentuk lingkaran, sisi selimut berbentuk persegi panjang.\n\nJika jari-jari = r dan tinggi = t:\n- Luas selimut = $2\\pi rt$\n- Luas permukaan = $2\\pi r(r + t)$\n- Volume = $\\pi r^2 t$` },
  { heading: "B. Kerucut", content: `Kerucut: bangun ruang dengan satu sisi alas berbentuk lingkaran dan satu sisi selimut berbentuk juring lingkaran.\n\nJika jari-jari = r, tinggi = t, garis pelukis = s:\n- $s = \\sqrt{r^2 + t^2}$\n- Luas selimut = $\\pi rs$\n- Luas permukaan = $\\pi r(r + s)$\n- Volume = $\\frac{1}{3} \\pi r^2 t$` },
  { heading: "C. Bola", content: `Bola: bangun ruang dengan semua titik pada permukaannya berjarak sama dari pusat.\n\nJika jari-jari = r:\n- Luas permukaan = $4\\pi r^2$\n- Volume = $\\frac{4}{3} \\pi r^3$` },
  { heading: "D. Perbandingan Volume", content: `Tabung : Kerucut : Bola\nDengan r dan t yang sama:\n$V_{tabung} : V_{kerucut} : V_{bola} = 3 : 1 : 2$\n\n(Catatan: r dan t/d harus sesuai)` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Banyak rusuk pada tabung adalah ...", options: ["A. Tidak ada", "B. 1 buah", "C. 2 buah", "D. 4 buah"] },
  { no: 2, soal: "Banyak sisi pada bola adalah ...", options: ["A. 4 buah", "B. 3 buah", "C. 2 buah", "D. 1 buah"] },
  { no: 3, soal: "Nomor yang menunjukkan rusuk pada kerucut berikut adalah ...", options: ["A. 1", "B. 2", "C. 3", "D. 4"] },
  { no: 4, soal: "Bentuk bangun dari selimut kerucut adalah ...", options: ["A. Tembereng", "B. Segitiga", "C. Lingkaran", "D. Juring lingkaran"] },
  { no: 5, soal: "Bentuk bangun dari selimut tabung adalah", options: ["A. Segi empat", "B. Persegi panjang", "C. Belah ketupat", "D. Bidang lengkung"] },
  { no: 6, soal: "Perhatikan gambar selimut tabung berikut.\nJari-jari tabung yang terjadi adalah ...", options: ["A. 3,5 cm", "B. 5 cm", "C. 7 cm", "D. 10 cm"] },
  { no: 7, soal: "Suatu tabung tanpa tutup dengan jari-jari alas 6 cm dan tingginya 10 cm. Jika $\\pi = 3,14$ maka luas tabung tanpa tutup adalah ...", options: ["A. 602,88 $cm^2$", "B. 489,84 $cm^2$", "C. 376,84 $cm^2$", "D. 301,44 $cm^2$"] },
  { no: 8, soal: "Suatu kerucut jari-jarinya 7 cm dan tingginya 24 cm. Jika $\\pi = \\frac{22}{7}$, maka luas seluruh permukaan kerucut tersebut adalah ...", options: ["A. 682 $cm^2$", "B. 704 $cm^2$", "C. 726 $cm^2$", "D. 752 $cm^2$"] },
  { no: 9, soal: "Sebuah kerucut luas alasnya 154 $cm^2$. Jika tinggi kerucut 24 cm, maka luas seluruh permukaan kerucut adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 604 $cm^2$", "B. 614 $cm^2$", "C. 704 $cm^2$", "D. 714 $cm^2$"] },
  { no: 10, soal: "Bila luas kulit bola 616 $cm^2$ dan $\\pi = \\frac{22}{7}$, maka jari-jari bola itu adalah ...", options: ["A. 28 cm", "B. 21 cm", "C. 14 cm", "D. 7 cm"] },
  { no: 11, soal: "Luas permukaan $\\frac{3}{4}$ bola padat yang panjang jari-jarinya 7 cm adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 616 $cm^2$", "B. 606 $cm^2$", "C. 462 $cm^2$", "D. 452 $cm^2$"] },
  { no: 12, soal: "Tanti akan membuat dua buah topi ulang tahun dari karton berukuran 30 cm x 50 cm. Jika diameter topi 21 cm dan garis pelukis 20 cm, maka sisa karton yang tidak terpakai adalah ....", options: ["A. 75 $cm^2$", "B. 100 $cm^2$", "C. 150 $cm^2$", "D. 180 $cm^2$"] },
  { no: 13, soal: "Perhatikan gambar topi berbentuk kerucut terbuat dari karton berikut ini!\nJika diameter lingkaran alas 28 cm dan tinggi topi 48 cm, luas karton minimal yang diperlukan untuk membuat 3 buah topi tersebut adalah ....", options: ["A. 2.112 $cm^2$", "B. 2.200 $cm^2$", "C. 6.336 $cm^2$", "D. 6.600 $cm^2$"] },
  { no: 14, soal: "Volume kerucut yang panjang diameternya 21 cm dan tinggi 12 cm adalah ...", options: ["A. 231 $cm^3$", "B. 986 $cm^3$", "C. 1.386 $cm^3$", "D. 2.958 $cm^3$"] },
  { no: 15, soal: "Sebuah kerucut setinggi 30 cm memiliki alas dengan keliling 66 cm ($\\pi = \\frac{22}{7}$). Volume kerucut itu adalah...", options: ["A. 16.860 $cm^3$", "B. 10.395 $cm^3$", "C. 6.930 $cm^3$", "D. 3.465 $cm^3$"] },
  { no: 16, soal: "Diketahui luas selimut kerucut 550 $cm^2$. Jika panjang garis pelukisnya 25 cm, maka volume kerucut adalah...", options: ["A. 1.232 $cm^3$", "B. 1.283 $cm^3$", "C. 3.696 $cm^3$", "D. 3.850 $cm^3$"] },
  { no: 17, soal: "Selisih luas permukaan bola berjari-jari 9 cm dan 5 cm dengan $\\pi = \\frac{22}{7}$ adalah ...", options: ["A. 440 $cm^2$", "B. 528 $cm^2$", "C. 628 $cm^2$", "D. 704 $cm^2$"] },
  { no: 18, soal: "Jika luas seluruh permukaan bola 144$\\pi$ $cm^2$, maka volume bola adalah ....", options: ["A. 278$\\pi$ $cm^3$", "B. 288$\\pi$ $cm^3$", "C. 432$\\pi$ $cm^3$", "D. 442$\\pi$ $cm^3$"] },
  { no: 19, soal: "Nasyara akan membuat nasi tumpeng berbentuk kerucut yang permukaannya akan ditutup penuh dengan hiasan dari makanan. Jika diameter tumpeng 28 cm dan tinggi 48 cm, luas tumpeng yang akan di hias makanan adalah...", options: ["A. 2.112 $cm^2$", "B. 2.200 $cm^2$", "C. 2.288 $cm^2$", "D. 2.376 $cm^2$"] },
  { no: 20, soal: "Panjang jari-jari alas kerucut 6 cm. Jika tinggi kerucut 8 cm, maka luas seluruh permukaan kerucut adalah... ($\\pi = 3,14$).", options: ["A. 3024,4 $cm^2$", "B. 3014,4 $cm^2$", "C. 302,44 $cm^2$", "D. 301,44 $cm^2$"] },
  { no: 21, soal: "Atap sebuah gedung berbentuk setengah bola dengan panjang diameter 14 m. Atap gedung tersebut akan dicat dengan biaya Rp50.000,00 setiap $m^2$. Biaya yang diperlukan untuk mengecat atap gedung itu adalah ....", options: ["A. Rp13.700.000,00", "B. Rp15.400.000,00", "C. Rp15.850.000,00", "D. Rp16.400.000,00"] },
  { no: 22, soal: "Kubah masjid berbentuk setengah bola yang akan dilapisi alumunium disisi luarnya. Panjang jari-jari kubah 3,5 m, luas alumunium yang dibutuhkan adalah ....", options: ["A. 77 $m^2$", "B. 154 $m^2$", "C. 770 $m^2$", "D. 1540 $m^2$"] },
  { no: 23, soal: "Volume sebuah kerucut adalah 314 $cm^3$, Jika jari-jari alasnya 5 cm dan $\\pi = 3,14$, maka panjang garis pelukisnya adalah ...", options: ["A. 4 cm", "B. 12 cm", "C. 13 cm", "D. 20 cm"] },
  { no: 24, soal: "Sebuah drum berbentuk tabung dengan panjang jari-jari 70 cm dan tinggi 100 cm penuh berisi minyak tanah. Minyak tanah tersebut akan dituang ke dalam tabung-tabung kecil dengan panjang jari-jari 35 cm dan tinggi 50 cm. Banyak tabung kecil yang akan diperlukan adalah....", options: ["A. 2 buah", "B. 4 buah", "C. 6 buah", "D. 8 buah"] },
  { no: 25, soal: "Sebuah drum berbentuk tabung dengan diameter alas 10 cm dan tinggi 100 cm. Bila $\\frac{3}{4}$ bagian dari drum berisi minyak, banyak minyak di dalam drum tersebut adalah ...", options: ["A. 8587,5 $cm^3$", "B. 8578,5 $cm^3$", "C. 5887,5 $cm^3$", "D. 5878,5 $cm^3$"] },
  { no: 26, soal: "Panjang jari-jari dua buah bola masing-masing adalah 12 cm dan 20 cm. tentukan perbandingan volume kedua bola itu...", options: ["A. 27 : 125", "B. 9 : 25", "C. 3 : 20", "D. 3 : 5"] },
  { no: 27, soal: "Sebuah kerucut mempunyai volume 40 $cm^3$, jika diameter kerucut diperbesar 2 kali dan tinggi diperbesar 3 kali, maka volume kerucut yang baru adalah ....", options: ["A. 240 $cm^3$", "B. 480 $cm^3$", "C. 720 $cm^3$", "D. 1440 $cm^3$"] },
  { no: 28, soal: "Diketahui volume suatu kerucut 120 $cm^3$, jika diameter kerucut diperbesar dua kali dan tinggi diperpanjang 3 kali, maka volume kerucut sekarang adalah....", options: ["A. 240 $cm^3$", "B. 480 $cm^3$", "C. 1.440 $cm^3$", "D. 1.540 $cm^3$"] },
  { no: 29, soal: "Sebuah kertas karton berbentuk juring lingkaran dengan sudut pusat $216^0$ dan panjang jari-jarinya 15 cm. Jika kertas karton tersebut dibuat kerucut, maka volume kerucut maksimum adalah ....", options: ["A. $324\\pi$ $cm^3$", "B. $405\\pi$ $cm^3$", "C. $620\\pi$ $cm^3$", "D. $675\\pi$ $cm^3$"] },
  { no: 30, soal: "Perhatikan gambar!\nLuas permukaan bangun ruang tersebut adalah ....", options: ["A. 550 $cm^2$", "B. 1320 $cm^2$", "C. 1474 $cm^2$", "D. 1584 $cm^2$"] },
  { no: 31, soal: "Perhatikan gambar!\nLuas permukaan gambar disamping adalah ...", options: ["A. 400$\\pi$ $cm^2$", "B. 800$\\pi$ $cm^2$", "C. 1200$\\pi$ $cm^2$", "D. 1600$\\pi$ $cm^2$"] },
  { no: 32, soal: "Perhatikan gambar!\nGambar diatas merupakan sebuah bandul terbuat dari logam. Jika berat setiap 1 $cm^3$ adalah 15 gram, maka berat bandul seluruhnya adalah ....", options: ["A. 7122 gram", "B. 7212 gram", "C. 7222 gram", "D. 7232 gram"] },
  { no: 33, soal: "Sebuah bandul terdiri dari kerucut dan belahan bola.\nJika diameter bola 14 cm dan garis pelukis kerucutnya 25 cm, maka volume bandul tersebut adalah ....", options: ["A. 132,6 $cm^3$", "B. 1232,0 $cm^3$", "C. 1950,7 $cm^3$", "D. 2002,0 $cm^3$"] },
  { no: 34, soal: "Perhatikan gambar benda padat berbentuk tabung dan setengah bola berikut!\nLuas permukaan benda tersebut adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 702 cm²", "B. 802 cm²", "C. 902 cm²", "D. 1.002 cm²"] },
  { no: 35, soal: "Perhatikan gambar berikut!\nSebuah peluru terbentuk dari tabung dan kerucut. Volume peluru tersebut adalah...", options: ["A. 4.312,0 $cm^3$", "B. 4.230,0 $cm^3$", "C. 4.358,2 $cm^3$", "D. 5.312,4 $cm^3$"] },
  { no: 36, soal: "Bangun pada gambar berikut terdiri dari tabung dan belahan bola.\nLuas permukaan bangun tersebut adalah....", options: ["A. 880 $cm^2$", "B. 1.496 $cm^2$", "C. 1.596 $cm^2$", "D. 2.010 $cm^2$"] },
  { no: 37, soal: "Gambar di bawah adalah sebuah bola dimasukkan ke sebuah tabung, jika luas permukaan bola 616 $cm^2$. Maka luas permukaan tabung adalah ....", options: ["A. 360 $cm^2$", "B. 300 $cm^2$", "C. 160 $cm^2$", "D. 150 $cm^2$"] },
  { no: 38, soal: "Sebuah bak air berbentuk tabung dengan diameter 140 cm dan memiliki tinggi 1 m yang terisi penuh. Dari tabung tersebut dialirkan air melalui kran dengan debit 20 liter/menit selama 1 jam. Maka volume air yang masih tersisa adalah ...", options: ["A. 40 liter", "B. 140 liter", "C. 240 liter", "D. 340 liter"] },
  { no: 39, soal: "Ke dalam tabung berisi air setinggi 30 cm dimasukkan 6 bola besi yang masing-masing berjari-jari 7 cm. Jika diameter tabung 28 cm, tinggi air dalam tabung setelah dimasukkan enam bola besi adalah ...", options: ["A. 37 cm", "B. 42 cm", "C. 44 cm", "D. 52 cm"] },
  { no: 40, soal: "Sebuah tabung berdiameter 24 cm dan tinggi 50 cm diisi air $\\frac{3}{5}$ dari tingginya. Tiga buah bola besi berjari-jari 6 cm dimasukan kedalam tabung. Tinggi air dalam tabung sekarang adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 32 cm", "B. 34 cm", "C. 36 cm", "D. 42 cm"] },
  { no: 41, soal: "Sebuah tabung berjari-jari 10 cm dan tinggi 50 cm berisi air $\\frac{3}{5}$ tinggi tabung. Jika 4 bola besi berjari-jari 5 cm dimasukkan ke dalam tabung, maka permukaan air pada tabung akan naik setinggi ...", options: [] },
  { no: 42, soal: "Sebuah torn pengisi air berbentuk tabung dengan diameter 2 m dan tinggi 10 m. Torn tersebut diisi air dengan debit air 20 liter/menit. Maka torn tersebut akan terisi air hingga penuh selama ...", options: ["A. 2 jam 15 menit", "B. 2 jam 27 menit", "C. 2 jam 37 menit", "D. 2 jam 38 menit"] },
  { no: 43, soal: "Sebuah bola logam dimasukkan ke dalam tabung yang berisi air sehingga permukaan air di dalam tabung menjadi naik. Hitunglah tinggi air yang naik jika diameternya 3 cm dan diameter tabung 5 cm.", options: ["A. 0,72", "B. 52", "C. 18", "D. 7,2"] },
  { no: 44, soal: "Fitra menyalakan lilin berbentuk tabung dengan diameter 2,8 cm dan tinggi 15 cm. Jika setiap menit lilin terbakar 1,68 $cm^3$, maka lilin akan habis terbakar dalam waktu ... ($\\pi = \\frac{22}{7}$)", options: ["A. 48 menit", "B. 50 menit", "C. 55 menit", "D. 56 menit"] },
  { no: 45, soal: "Wadah pembuatan es cream berbentuk tabung dengan diameter 0,2 m dan tinggi 0,75 m. Jika es cream tersebut dimasukkan kedalam corong-corong es cream berbentuk kerucut dengan jari-jari 2,5 cm dan tinggi 10 cm. Maka banyak corong es cream yang dibutuhkan adalah...", options: ["A. 60", "B. 120", "C. 240", "D. 360"] },
];

const BangunRuangSisiLengkungPage = () => (
  <TKAPemantapanLayout
    title="BANGUN RUANG SISI LENGKUNG"
  materiSections={materiSections}
  contohSoal={getTkaContohSoal("bangun-ruang-sisi-lengkung")}
  latihanDasar={latihanDasar}
    gambarMap={brslDasarImages}
  />
);

export default BangunRuangSisiLengkungPage;
