import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import PembahasanCard from "@/components/PembahasanCard";
import { segitigaSegiempatDasarPembahasan } from "@/data/pembahasan/segitigaSegiempatDasar";
import { segitigaSegiempatOlimpiadePembahasan } from "@/data/pembahasan/segitigaSegiempatOlimpiade";

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
  title: "MATERI - SEGITIGA DAN SEGIEMPAT",
  sections: [
    {
      heading: "A. Luas dan Keliling Bangun Datar",
      content: `1. Persegi
   Rumus Luas: $S \\times S$
   Rumus Keliling: $4S$

2. Persegi Panjang
   Rumus Luas: $p \\times l$
   Rumus Keliling: $2(p + l)$

3. Jajar Genjang
   Rumus Luas: $a \\times t$
   Rumus Keliling: $2(a + b)$

4. Belah Ketupat
   Rumus Luas: $\\frac{d_1 \\times d_2}{2}$
   Rumus Keliling: $4s$

5. Layang-layang
   Rumus Luas: $\\frac{d_1 \\times d_2}{2}$
   Rumus Keliling: $2(a + b)$

6. Trapesium
   Rumus Luas: $\\frac{(a + b) \\times t}{2}$
   Rumus Keliling: $a + d + b + c$

7. Segitiga
   Rumus Luas: $\\frac{a \\times t}{2}$
   Rumus Keliling: $a + b + c$`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Perhatikan gambar berikut.\nKeliling bangun di atas adalah ...", options: ["A. 44 cm", "B. 48 cm", "C. 49 cm", "D. 52 cm"] },
  { no: 2, soal: "Perhatikan gambar berikut ini.\nKeliling bangun di atas adalah ...", options: ["A. 61 cm", "B. 84 cm", "C. 90 cm", "D. 94 cm"] },
  { no: 3, soal: "Perhatikan gambar.\nLuas gambar di samping adalah ...", options: ["A. 294 $cm^2$", "B. 290 $cm^2$", "C. 258 $cm^2$", "D. 250 $cm^2$"] },
  { no: 4, soal: "Perhatikan gambar berikut. Luas huruf capital di samping adalah ..", options: ["A. 425 $cm^2$", "B. 450 $cm^2$", "C. 500 $cm^2$", "D. 525 $cm^2$"] },
  { no: 5, soal: "Perhatikan gambar.\nDiketahui AB = 20 cm, AF = 13 cm dan BD = 10 cm. luas bangun di samping adalah ...", options: ["A. 280 $cm^2$", "B. 320 $cm^2$", "C. 360 $cm^2$", "D. 480 $cm^2$"] },
  { no: 6, soal: "Perhatikan gambar berikut.\nPanjang AD = BE = 17 cm dan DE = 15 cm. luas bangun AGBCHD adalah...", options: ["A. 375 $cm^2$", "B. 525 $cm^2$", "C. 600 $cm^2$", "D. 750 $cm^2$"] },
  { no: 7, soal: "Perhatikan gambar berikut.\nLuas daerah yang diarsir adalah ...", options: ["A. 60 $cm^2$", "B. 66 $cm^2$", "C. 72 $cm^2$", "D. 90 $cm^2$"] },
  { no: 8, soal: "Perhatikan gambar di bawah!\nLuas daerah yang diarsir adalah ....", options: ["A. 42 $cm^2$", "B. 56 $cm^2$", "C. 70 $cm^2$", "D. 84 $cm^2$"] },
  { no: 9, soal: "Perhatikan gambar persegi ABCD dan persegi panjang EFGH berikut!\nJika luas daerah yang tidak diarsir 68 $cm^2$ luas daerah yang diarsir adalah ....", options: ["A. 24 $cm^2$", "B. 28 $cm^2$", "C. 30 $cm^2$", "D. 56 $cm^2$"] },
  { no: 10, soal: "Sebuah taman bebentuk trapesium sama kaki dengan Panjang sisi yang sejajar adalah 40 m dan 16 m, tinggi trapesium 16 m. taman itu akan diterangi dengan lampu di pinggir taman dengan jarak tiang lampu adalah 4 m, maka banyaknya tiang yang dibutuhkan seluruhnya adalah ..", options: ["A. 18 tiang", "B. 20 tiang", "C. 24 tiang", "D. 28 tiang"] },
  { no: 11, soal: "Taman berbentuk lingkaran dengan Panjang diameter 14 m akan dipasangkan tiang lampu dengan jarak antar tiang 4 m. jika biaya 1 tiang lampu Rp 200.000,00, maka biaya seluruhnya untuk memasang tiang lampu tersebut adalah ..", options: ["A. Rp 2.200.000,00", "B. Rp 2.800.000,00", "C. Rp 3.300.000,00", "D. Rp 4.400.000,00"] },
  { no: 12, soal: "Lantai ruang tamu berukuran 4,2 m x 3,6 m. Jika akan ditutup dengan keramik persegi berukuran 30 cm. maka banyaknya keramik yang diperlukan adalah.....", options: ["A. 150", "B. 168", "C. 180", "D. 200"] },
  { no: 13, soal: "Sebuah kolam renang berbentuk persegi panjang, mempunyai ukuran panjang 20 meter dan lebar 10 meter. Di sekeliling kolam renang bagian luar akan dibuat jalan dengan lebar 1 meter. Jika jalan akan dipasang keramik dengan biaya Rp60.000,00 setiap meter persegi, maka biaya yang diperlukan untuk pemasangan keramik adalah", options: ["A. Rp1.860.000,00", "B. Rp3.600.000,00", "C. Rp3.840.000,00", "D. Rp12.000.000,00"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nBanyaknya segitiga pada gambar berikut adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2003 Tingkat Kota\nGambar bangun berikut disusun oleh 5 persegi yang kongruen. Kalua keliling bangun ini 72 cm, maka luas bangun tersebut adalah ...", options: [] },
  { no: 3, soal: "OSN Matematika 2003 Tingkat Kota\nGambar bangun berikut, ABCD adalah persegi dengan sisi 6 satuan. Titik E dan F membagi diagonal AC menjadi tiga bagian sama panjang. Luas segitiga DEF = ...", options: [] },
  { no: 4, soal: "OSN Matematika 2004 Tingkat Kota\nPersegi panjang besar berukuran 9 cm x 5 cm. daerah yang diarsir adalah satu-satunya bangun di dalam persegi panjang yang bukan persegi. Berapakah luas daerah yang diarsir.", options: ["A. 1,5 $cm^2$", "B. 2 $cm^2$", "C. 3 $cm^2$", "D. 3,5 $cm^2$", "E. 4 $cm^2$"] },
  { no: 5, soal: "OSN Matematika 2004 Tingkat Kota\nPersegi pada gambar disamping memiliki luas satu satuan luas. Pecahan yang menyatakan luas dari daerah yang tidak diarsir adalah ...", options: ["A. $\\frac{1}{3}$", "B. $\\frac{2}{5}$", "C. $\\frac{3}{5}$", "D. $\\frac{3}{7}$", "E. $\\frac{3}{8}$"] },
  { no: 6, soal: "OSN Matematika 2005 Tingkat Kota\nPerhatikan gambar berikut.\nJika jarak terdekat titik-titik tersebut secara vertical maupun harisontal adalah 2 satuan, maka luas daerah persegi pada gambar adalah ... satuan", options: ["A. 10", "B. 40", "C. 20", "D. 30", "E. 50"] },
  { no: 7, soal: "OSN Matematika 2005 Tingkat Kota\nPersegi ABCD dengan panjang sisi satu satuan panjang. Misalkan P suatu titik di dalam sehingga ukuran sutu APB $120^0$. Jumlah luas daerah segitiga APB dan segitiga CPD adalah ...", options: [] },
  { no: 8, soal: "OSN Matematika 2007 Tingkat Kota\nPerhatikan gambar berikut.\n(Salah satu daerah persegi yang dimaksud adalah daerah yang diarsir)\nBanyak persegi yang terletak pada daerah persegi ABCD berukuran 9 x 9 dan paling sedikit satu sisinya terletak pada persegi ABCD adalah ...", options: [] },
  { no: 9, soal: "OSN Matematika 2007 Tingkat Kota\nDi laboratorium Matematika terdapat 6 batang kayu sejenis yang panjangnya berturut-turut 4 dm, 4 dm, 10 dm, 22 dm dan 37 dm. jika keenam batang kayu tersebut harus digunakan untuk membuat trapesium samakaki, maka banyak trapesium sama kaki yang dapat dibentuk adalah ...", options: [] },
  { no: 10, soal: "OSN Matematika 2008 Tingkat Kota\nPerhatikan gambar berikut.\nABCD merupakan persegi panjang dan EFGH adalah jajaran genjang, maka panjang sisi x adalah ...", options: ["A. 6,8", "B. 7,2", "C. 7,6", "D. 8,0", "E. 8,1"] },
  { no: 11, soal: "OSN Matematika 2008 Tingkat Kota\nDiberikan sebuah persegi dengan sisi a satuan.\nEmpat buah segitiga siku-siku dipotong dari persegi tersebut seperti digambarkan sebagai daerah berarsir abu-abu. Diketahui semua siku-siku yang lebih pendek memiliki panjang $\\frac{3}{8}a$ satuan. Luas daerah tak berarsir pada persegi tersebut adalah ...", options: [] },
  { no: 12, soal: "OSN Matematika 2009 Tingkat Kota\nGambar di bawah ini menunjukkan suatu persegi yang dibagikan menjadi 6 bagian yang sama. Setiap bagian berupa persegipanjang yang mempunyai keliling 70 cm. luas persegi tersebut adalah ...", options: ["A. 625 $cm^2$", "B. 784 $cm^2$", "C. 900 $cm^2$", "D. 961 $cm^2$"] },
  { no: 13, soal: "OSN Matematika 2009 Tingkat Kota\nLuas persegipanjang ABCD adalah 112 satuan luas. Titik E dan F berada di diagonal AC seperti gambar di bawah ini sedemikian hingga 3 (AE + FC) = 4 EF. Luas segitiga DEF adalah ... satuan luas", options: [] },
  { no: 14, soal: "OSN Matematika 2009 Tingkat Kota\nLantai suatu ruangan berbentuk persegi. Lantai tersebut akan dipasang keramik berbentuk persegi juga. Bila keramik yang terletak pada diagonalnya sebanyak 33, maka banyaknya keramik yang menutupi lantai adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2009 Tingkat Kota\nDua belas segi delapan beraturan dengan panjang sisi 2 cm. disusun dalam sebuah persegi seperti gambar berikut.\nLuas persegi di atas sama dengan ...", options: [] },
  { no: 16, soal: "OSN Matematika 2010 Tingkat Kota\nSebuah segitiga ABC sama kaki dipotong menjadi dua buah segitiga sama kaki (tidak harus kongruen) dengan membagi dua sama besar salah satu sudut alasnya. Ukuran sudut yang terkecil dari segitiga ABC adalah ...", options: [] },
  { no: 17, soal: "OSN Matematika 2010 Tingkat Kota\nDiketahui ABCD adalah persegi. Titik E merupakan perpotongan AC dan BD pada persegi ABCD yang membentuk persegi baru EFGH. EF berpotongan dengan CD di I dan EH berpotongan dengan AD di J. panjang sisi ABCD adalah 4 cm dan panjang sisi EFGH adalah 8 cm. jika sudut EID = $60^0$, maka luas segiempat EIDJ adalah ... $cm^2$", options: [] },
  { no: 18, soal: "OSN Matematika 2011 Tingkat Kota\nDiketahui jajargenjang ABCD. Titik P dan Q terletak pada AC sehingga DP dan BQ tegak lurus AC. Jika panjang AD = 13 cm, AD = 25 cm dan luas jajargenjang tersebut adalah 125 $cm^2$, maka panjang PQ adalah ... cm", options: ["A. $\\frac{1}{2}$", "B. 1", "C. $\\sqrt{2}$", "D. $\\sqrt{3}$", "E. $\\frac{4}{3}$"] },
  { no: 19, soal: "OSN Matematika 2011 Tingkat Kota\nSebuah bingkai foto yang berbentuk persegi diputar $45^0$ dengan sumbu putar titik perpotongan diagonal-diagonalnya. Jika panjang sisi persegi adalah 1 cm. luas irisan antara bingkai foto sebelum dan sesudah diputar adalah ... $cm^2$", options: ["A. $1 + 2\\sqrt{2}$", "B. $2 + 2\\sqrt{2}$", "C. 2", "D. $2 - 2\\sqrt{2}$", "E. $2\\sqrt{2} - 2$"] },
  { no: 20, soal: "OSN Matematika 2011 Tingkat Kota\nPerhatikan gambar berikut. ABCD persegi dengan panjang sisi-sisinya adalah 2 cm. E adalah titik Tengah CD dan F adalah titik Tengah AD. Luas daerah EDFGH adalah ...", options: [] },
  { no: 21, soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui persegi ABCD. Jika titik E terletak pada BC dan titik F terletak pada CD sehingga AE dan AF membagi persegi ABCD menjadi 3 daerah yang luasnya sama, maka perbandingan luas segitiga AEF terhadap luas persegi ABCD adalah ...", options: ["A. 4/18", "B. 5/18", "C. 6/18", "D. 7/18", "E. 8/18"] },
  { no: 22, soal: "OSN Matematika 2013 Tingkat Kota\nJika gambar di bawah ini adalah segi delapan beraturan, maka perbandingan luas antara daerah yang diarsir dan luas segi delapan beraturan adalah ...", options: ["A. 1 : 3", "B. 1 : 4", "C. 2 : 5", "D. 3 : 8", "E. 3 : 7"] },
  { no: 23, soal: "OSN Matematika 2013 Tingkat Kota\nPada $\\triangle ABC$ terdapat titik D pada BC sehingga BD : DC = 1 : 3. Titik L pada AD sehingga AL : LD = 1 : 4. Perbadingan luas $\\triangle ACL$ dan $\\triangle BDL$ adalah ...", options: [] },
  { no: 24, soal: "OSN Matematika 2014 Tingkat Kota\nJika luas suatu persegi 4 $m^2$, maka luas bangun datar pada gambar di bawah adalah ...", options: ["A. 36", "B. 96", "C. 144", "D. 162"] },
  { no: 25, soal: "OSN Matematika 2014 Tingkat Kota\nBanyak persegi pada gambar berikut adalah ...", options: [] },
  { no: 26, soal: "OSN Matematika 2014 Tingkat Kota\nBerikut adalah gambar sebuah persegi panjang yang terdiri dari beberapa persegi yang dibuat dari korek api. Sebagai contoh, 1 x 5 memerlukan 16 batang korek api, bentuk 2 x 5 memerlukan 27 batang korek api.\nBanyak batang korek api yang diperlukan untuk membuat persegi panjang dengan bentuk 51 x 5 adalah ...", options: [] },
  { no: 27, soal: "OSN Matematika 2014 Tingkat Kota\nPerhatikan gambar di bawah ini. ABC adalah segitiga sama sisi. PQ tegak lurus AB, PS tegak lurus AC dan PR tegak lurus BC.\nJika PQ = 1 cm, PR = 2 cm dan PS = 3 cm, maka panjang AB adalah ...", options: [] },
  { no: 28, soal: "OSN Matematika 2016 Tingkat Kota\nDiketahui ABCD dan CEGH adalah dua persegipanjang kongruen dengan panjang 17 cm dan lebar 8 cm. titik F adalah titik potong sisi AD dan EG. Luas segiempat EFDC adalah ... $cm^2$", options: ["A. 74,00", "B. 72,25", "C. 68,00", "D. 63,75"] },
  { no: 29, soal: "OSN Matematika 2017 Tingkat Kota\nPada jajar genjang ABCD, jarak antara sepasang sisi sejajar pertama adalah 4 cm dan jarak antara sepasang sisi sejajar lainnya adalah 9 cm. luas jajar genjang ABCD adalah ...", options: ["A. Minimal 36 $cm^2$", "B. Tepat 36 $cm^2$", "C. Maksimal 36 $cm^2$", "D. Antara 36 $cm^2$ dan 81 $cm^2$"] },
  { no: 30, soal: "OSN Matematika 2017 Tingkat Kota\nMisalkan ADEN dan BMDF adalah persegi dengan F merupakan titik Tengah AD. Luas segitiga CDE adalah 6 satuan luas. Luas segitiga ABC adalah ...", options: [] },
  { no: 31, soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui sisi-sisi trapesium adalah 5 cm, 7 cm, 7 cm dan 13 cm. pernyataan di bawah ini yang salah adalah ...", options: ["A. Tinggi trapesium = $\\sqrt{33}$ cm", "B. Tinggi trapesium = $\\sqrt{26}$ cm", "C. Tinggi trapesium = $10\\sqrt{6}$ $cm^2$", "D. Tinggi trapesium = $9\\sqrt{33}$ $cm^2$"] },
  { no: 32, soal: "OSN Matematika 2019 Tingkat Kota\nDalam segitiga sama sisi ABC titik D, E dan F pada sisi BC, CA dan AB sehingga $\\angle AFE = \\angle BFD$; $\\angle BDF = \\angle CDE$; dan $\\angle CED = \\angle AEF$. Jika sisi segitiga ABC adalah 8 cm, maka luas segitiga DEF adalah ...", options: ["A. $2\\sqrt{3}$", "B. $4\\sqrt{3}$", "C. $6\\sqrt{3}$", "D. $6\\sqrt{3}$"] },
  { no: 33, soal: "OSN Matematika 2019 Tingkat Kota\nPerhatikan gambar berikut.\nJika panjang AB = 11 cm, BC = 15 cm dan EF = 20 cm, maka luas bangun ABCDEF adalah ... $cm^2$", options: [] },
  { no: 34, soal: "OSN Matematika 2020 Tingkat Kota\nDiketahui segi delapan ABCDEFGH dengan panjang sisina 2 cm. akan dipilih secara acak 3 titik seudutnya dan digunakan untuk membentuk suatu segitiga yang akan dihitung luas daerahnya. Jika A adalah himpunan semua luas daerah segitiga yang mungkin dan jumlah semua anggota A adalah $(a + b\\sqrt{2})$ $cm^2$, maka nilai dari a + b adalah ...", options: ["A. 9", "B. 12", "C. 21", "D. 33"] },
  { no: 35, soal: "OSN Matematika 2021 Tingkat Kota\nTenda A dan tenda B seperti dalam gambar memiliki lebar 3 m dan tinggi 2 m. luas bahan yang digunakan untuk membuat tenda A dan tenda B sama. Jika panjang tenda A adalah 6 m, maka p sama dengan ...", options: ["A. $3\\sqrt{2} + \\frac{2}{4}$", "B. 6", "C. $\\frac{3 + 18\\sqrt{2}}{25}$", "D. 8"] },
  { no: 36, soal: "OSN Matematika 2021 Tingkat Kota\nDiberikan persegi panjang ABCD dengan AB = 12 dan BC = 6. Titik E, F, G, H dipilih sehingga BE = BF + DG + DH + p. jika garis FH dan EG berpotongan di Tengah-tengah persegi panjang, dan luas daerah yang diarsir adalah 12,5% dari luas ABCD, maka nilai p adalah ...", options: ["A. 1/3", "B. 1/2", "C. 1", "D. 3/2"] },
  { no: 37, soal: "OSN Matematika 2022 Tingkat Kota\nTiga puluh koin dengan jari-jari 3,5 cm ditumpuk menjadi 4 tingkat sehingga meyerupai limas tegak segi empat beraturan dengan sisi angka menghadap ke atas. Tingkat pertama (paling bawah) terdiri dari 16 koin, tingkat kedua terdiri dari 9 koin, tingkat ketiga terdiri dari 4 koin dan tingkat keempat terdiri dari 1 koin. Pada setiap tingkat, koin akan disusun menyerupai persegi dengan setiap koin yang berdekatan saling bersinggungan. Jika dilihat dari atas, total luas sisi angka yang tertutup oleh koin lainnya adalah... $cm^2$.", options: ["A. 381,5", "B. 444,5", "C. 539", "D. 1155"] },
  { no: 38, soal: "OSN Matematika 2022 Tingkat Kota\nPerhatikan urutan lima bangun datar berikut.\nUrutan kelima bangun datar tersebut dikatakan ideal jika ketiga syarat berikut terpenuhi.\n(1) ada tepat satu bangun di antara segi lima dan segi enam,\n(2) ada lebih dari satu bangun di antara segitiga dan segi delapan,\n(3) segi empat tidak di sebelah segi enam ataupun segi delapan.\nBanyak urutan yang tidak ideal dari kelima bangun datar tersebut adalah ....", options: ["A. 1", "B. 2", "C. 118", "D. 119"] },
  { no: 39, soal: "OSN Matematika 2022 Tingkat Kota\nDiketahui suatu persegi panjang ABCD dengan titik P dan Q masing-masing berada pada sisi AB dan CD sedemikian sehingga APCQ merupakan belah ketupat. Titik R merupakan titik pusat persegi panjang ABCD. Titik S terletak di sisi CD dan PS tegak lurus dengan sisi CD. Jika panjang AB = a dan panjang BC = b selisih panjang RS dan QS adalah ...", options: ["A. $\\frac{a^2 + 2ab - b^2}{2a}$", "B. $\\frac{b^2 + 2ab - a^2}{2b}$", "C. $\\frac{b^2 + 2ab - a^2}{2a}$", "D. $\\frac{a^2 + 2ab - b^2}{2b}$"] },
  { no: 40, soal: "OSN Matematika 2023 Tingkat Kota\nDisamping kolam ikan berbentuk segitiga, dibangun jalan berbentuk L dengan panjang 3 meter dan lebar x meter.\nJika luas segitiga tersebut sama dengan luas daerah yang berbentuk L, maka nilai x adalah ... meter", options: ["A. $\\sqrt{6} - 3$", "B. $2\\sqrt{3} - 3$", "C. $\\sqrt{6} + 3$", "D. $2\\sqrt{3} + 3$"] },
  { no: 41, soal: "OSN Matematika 2023 Tingkat Kota\nSegitiga ABC terletak pada setengah lingkaran berdiameter AB dengan $\\angle ABC = 30^0$. Titik E terletak pada AB sehingga AB = 4 EB dan EC = 14 cm. luas segitiga BEC sama dengan ... $cm^2$", options: ["A. $14\\sqrt{3}$", "B. $16\\sqrt{7}$", "C. $28\\sqrt{3}$", "D. $32\\sqrt{3}$"] },
  { no: 42, soal: "OSN Matematika 2023 Tingkat Kota\nDua kapal memiliki tempat bersandar (berlabuh) yang sama di suatu pelabuhan. Diketahui bahwa waktu kedatangan kedua kapal saling bebas dan memiliki kemungkinan yang sama untuk bersandar pada suatu hari Minggu (jam 00.00-24.00). Jika waktu bersandar kapal pertama adalah 2 jam dan waktu bersandar kapal kedua adalah 4 jam, peluang bahwa satu kapal harus menunggu sampai tempat bersandar dapat digunakan adalah....", options: ["A. 67/44", "B. 1/4", "C. 67/288", "D. 23/144"] },
  { no: 43, soal: "OSN Matematika 2023 Tingkat Kota\nEmpat titik berbeda A, B, C dan D terletak pada lingkaran berjari-jari 7 cm. diketahui AB : BC = 3 : 4, AB = AD dan BC = CD. Titik E adalah perpotongan AC dan BD, melalui titik E dibuat garis k dan l. garis k tegak lurus BC dan memotong AD di P. sementara, garis l tegak lurus AD dan memotong BC di Q. perbandingan luas daerah segitiga AQP dan PDQ adalah 1 : ...", options: [] },
  { no: 44, soal: "OSN Matematika 2024 Tingkat Kota\nPerhatikan gambar berikut.\nDiketahui panjang BD = CD, BE = DE, AJ = JD dan DG sejajar CF. jika perbandingan luas daerah segitiga ADH dan segitiga ABC dinyakan dalam bentuk paling sederhana m : n, maka nilai dari m + n adalah ...", options: ["A. 5", "B. 6", "C. 7", "D. 8"] },
  { no: 45, soal: "OSN Matematika 2024 Tingkat Kota\nSuatu segidelapan ABCDEFGH dibentuk dari suatu persegi ABCD dan persegi panjang EFGH yang panjang sisi-sisinya merupakan bilangan bulat positif.\nJika luas persegi adalah x $cm^2$, luas persegi panjang adalah y $cm^2$, x > y dan xy = 98, maka keliling segi delapan ABCDEFGH yang mungkin adalah ... cm.", options: ["A. 30", "B. 33", "C. 34", "D. 51"] },
  { no: 46, soal: "OSN Matematika 2024 Tingkat Kota\nSepuluh persegi panjang kecil dengan ukuran 1 cm x 2 cm akan digunakan untuk membentuk persegi panjang dengan ukuran 10 cm x 2 cm. banyaknya cara membentuk persegi panjang besar tersebut adalah ...", options: ["A. 78", "B. 89", "C. 144", "D. 233"] },
  { no: 47, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui segitiga sama kaki ABC dengan AB = BC = 8 cm dan $\\angle ABC = 120^0$. Titik Tengah AB dan BC masing-masing adalah D dan E. garis DF tegak lurus AB dan EF tegak lurus BC. Luas daerah yang diarsir adalah ... $cm^2$.", options: ["A. $\\frac{8\\sqrt{3}}{3}$", "B. $\\frac{16\\sqrt{3}}{3}$", "C. $8\\sqrt{3}$", "D. $16\\sqrt{3}$"] },
  { no: 48, soal: "OSN Matematika 2024 Tingkat Kota\nDari segi lima ABCDE dipilih 21 titik yang berbeda. Satu titik sisi AB dua titik dari sisi BC, tiga titik dari sisi CD, empat titik dari sisi DE, lima titik sudut A, B, C, D, E dan enam titik dari sisi AE. Banyaknya segitiga yang dapat dibentuk dari seluruh titik yang dipilih adalah ...", options: ["A. 560", "B. 770", "C. 1239", "D. 1330"] },
  { no: 49, soal: "OSN Matematika 2024 Tingkat Kota\nSegi enam beraturan ABCDEF memiliki panjang sisi 2024 mm. titik G adalah titik Tengah AB dan titik H adalah titik Tengah EG. Perbandingan luas daerah segitiga CDH dan segi enam ABCDEF adalah ...", options: ["A. 4 : 24", "B. 5 : 24", "C. 6 : 24", "D. 7 : 24"] },
  { no: 50, soal: "OSN Matematika 2025 Tingkat Kota\nSegitiga sama sisi ABC dan DEF dengan panjang sisi sama, yaitu 1 cm. titik B terletak pada sisi DE, titik D terletak pada sisi AB dan titik G adalah perpotongan sisi BC dan sisi DF. Jika luas daerah segiempat ADGC sama dengan luas daerah segiempat BEFG dan juga sama dengan luas daerah BDG, maka keliling segilima AEFGC adalah ... cm", options: ["A. $6 - \\frac{\\sqrt{2}}{2}$", "B. $6 - \\sqrt{2}$", "C. $6 - \\frac{3\\sqrt{2}}{2}$", "D. $6 + \\sqrt{3} - 2$"] },
  { no: 51, soal: "OSN Matematika 2025 Tingkat Kota\nSuatu segitiga ABC sama kaki dengan AC = BC dan AB = 10 cm memiliki luas 25 $cm^2$. Titik D, E dan F terletak berturut-turut pada sisi BC, AC dan AB dengan BD : DC = CE : EA = AF : FB = 2 : 3. Titik P, Q dan R berturut-turut adalah titik potong garis AD dan CF, garis AD dan CF, garis AD dan BE serta garis BE dan CF. perbandingan luas segitiga PQR dan ABC adalah ...", options: ["A. 1 : 19", "B. 2 : 19", "C. 3 : 25", "D. 1 : 5"] },
];

const OlimpiadeSegitigaSegiempatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - SEGITIGA DAN SEGIEMPAT
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
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{trimmed}</div>;
                        }
                        if (/^Rumus/.test(trimmed)) {
                          return <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">{renderWithLatex(trimmed)}</div>;
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {segitigaSegiempatDasarPembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`segi-dasar-${soal.no}`} pembahasan={segitigaSegiempatDasarPembahasan[soal.no]} />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {segitigaSegiempatOlimpiadePembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`segi-olim-${soal.no}`} pembahasan={segitigaSegiempatOlimpiadePembahasan[soal.no]} />
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

export default OlimpiadeSegitigaSegiempatPage;
