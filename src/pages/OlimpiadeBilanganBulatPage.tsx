import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

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
  title: "MATERI - BILANGAN BULAT",
  sections: [
    {
      heading: "A. Macam-macam Bilangan",
      content: `1. Bilangan Bulat : $\\{ ..., -3,-2,-1,0,1,2,3,...\\}$
2. Bilangan Bulat Negatif : $\\{ ..., -3,-2,-1\\}$
3. Bilangan Cacah : $\\{0,1,2,3,4,5,...\\}$
4. Bilangan Asli : $\\{1,2,3,4,5,6,...\\}$
5. Bilangan Ganjil : $\\{1,3,5,7,9,...\\}$
6. Bilangan Genap : $\\{2,4,6,8,10,...\\}$
7. Bilangan Prima : $\\{2,3,5,7,11,13,...\\}$
8. Bilangan kuadrat: $\\{1,4,9,16,25, ...\\}$
9. Bilangan kubik: $\\{1,8,27,64,125, ...\\}$
10. Bilangan Komposit: $\\{4,6,8,9,10, ...\\}$`
    },
    {
      heading: "B. Urutan Operasi Hitung Bilangan",
      content: `1. Operasi hitung dalam tanda kurung
2. Operasi pangkat atau akar
3. Operasi kali atau bagi
4. Operasi tambah atau kurang`
    },
    {
      heading: "C. Sifat Operasi Hitung Bilangan",
      content: `1. $a + b = b + a$
2. $a \\times b = b \\times a$
3. $(a + b) + c = a + (b + c)$
4. $(a \\times b) \\times c = a \\times (b \\times c)$
5. $a \\times (b + c) = (a \\times b) + (a \\times c)$
6. $a \\times (b - c) = (a \\times b) - (a \\times c)$`
    },
    {
      heading: "D. Digit dan Jumlah Digit pada Suatu Bilangan",
      content: `1. Banyak Digit Suatu Bilangan
Banyak digit dari sebuah bilangan bulat positif adalah jumlah angka (digit) yang digunakan untuk menuliskannya.
Contoh:
• Bilangan 7 memiliki 1 digit.
• Bilangan 42 memiliki 2 digit (yaitu angka 4 dan 2).
• Bilangan 159 memiliki 3 digit (yaitu angka 1, 5, dan 9).
• Bilangan 1.234.567 memiliki 7 digit.

2. Jumlah Digit Suatu Bilangan
Jumlah digit (sering juga disebut "sum of digits") dari sebuah bilangan bulat positif adalah hasil penjumlahan semua angka (digit) penyusun bilangan tersebut.
Contoh:
• Untuk bilangan 7, jumlah digitnya adalah 7 (karena hanya ada satu digit, yaitu 7).
• Untuk bilangan 42, jumlah digitnya adalah $4 + 2 = 6$.
• Untuk bilangan 159, jumlah digitnya adalah $1 + 5 + 9 = 15$.
• Untuk bilangan 1.234.567, jumlah digitnya adalah $1 + 2 + 3 + 4 + 5 + 6 + 7 = 28$.`
    },
    {
      heading: "E. Kaitan Bilangan Ganjil dan Bilangan Genap pada Operasi",
      content: `1. Operasi Penjumlahan
• Ganjil + Ganjil = Genap
• Ganjil + Genap = Ganjil
• Genap + Genap = Genap

2. Operasi Pengurangan
• Ganjil - Ganjil = Genap
• Ganjil - Genap = Ganjil
• Genap - Genap = Genap

3. Operasi Perkalian
• Ganjil $\\times$ Ganjil = Ganjil
• Ganjil $\\times$ Genap = Genap
• Genap $\\times$ Genap = Genap`
    },
    {
      heading: "F. Memecah Bentuk Bilangan abcd",
      content: `$\\overline{abcd} = 1000a + 100b + 10c + d$`
    },
    {
      heading: "G. Cara Menentukan Suatu Bilangan Besar Prima atau Bukan",
      content: `Untuk menentukan apakah sebuah bilangan besar adalah prima, kita bisa menggunakan metode pembagian atau uji pembagi. Metode pembagian melibatkan membagi bilangan tersebut dengan semua bilangan bulat dari 2 hingga akar kuadratnya. Jika tidak ada bilangan yang membagi habis, maka bilangan tersebut adalah prima. Metode uji pembagi lebih efisien karena hanya membandingkan dengan bilangan prima sampai akar kuadratnya.

1. Metode Pembagian (Trial Division):
a. Cari akar kuadrat bilangan:
Hitung akar kuadrat dari bilangan yang akan diuji.
b. Bagi dengan bilangan bulat dari 2 hingga akar kuadrat:
Bagi bilangan tersebut dengan setiap bilangan bulat dari 2 hingga akar kuadrat yang telah dihitung.
c. Cek sisa pembagian:
Jika ada bilangan yang membagi habis bilangan tersebut (sisa pembagian 0), maka bilangan tersebut bukan prima.
d. Kesimpulan:
Jika tidak ada bilangan yang membagi habis, maka bilangan tersebut adalah prima.

2. Metode Uji Pembagi (Prime Division Test)
a. Cari akar kuadrat bilangan:
Sama seperti metode pembagian.
b. Bagi dengan bilangan prima sampai akar kuadrat:
Bagi bilangan tersebut dengan bilangan prima yang lebih kecil atau sama dengan akar kuadratnya.
c. Cek sisa pembagian:
Jika ada bilangan prima yang membagi habis, maka bilangan tersebut bukan prima.
d. Kesimpulan:
Jika tidak ada bilangan prima yang membagi habis, maka bilangan tersebut adalah prima.

Contoh:
Misalkan kita ingin menentukan apakah 137 prima.
• Akar kuadrat 137: sekitar 11.7 (kita akan membagi hingga 11)
• Pembagian: $\\frac{137}{2} = 68.5$, $\\frac{137}{3} = 45.666...$, $\\frac{137}{5} = 27.4$, $\\frac{137}{7} = 19.571...$, $\\frac{137}{11} = 12.454...$
• Kesimpulan: Tidak ada bilangan yang membagi 137 habis. Jadi, 137 adalah bilangan prima.`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Hasil dari $25 - (-90 : 18) + (-3) \\times 14$ adalah ...", options: ["A. -12", "B. -9", "C. 24", "D. 97"] },
  { no: 2, soal: "Hasil dari $-20 : 5 \\times 2 - [7 + (-9)] + [2 - (-7)]$ adalah ...", options: ["A. 3", "B. 9", "C. 10", "D. -23"] },
  { no: 3, soal: "Dalam kompetensi Bahasa Inggris yang terdiri dari 50 soal, peserta akan mendapatkan skor 4 untuk setiap jawaban benar, skor -2 untuk setiap jawaban salah, dan skor -1 untuk soal yang tidak dijawab. Jika Budi menjawab 44 soal dan yang benar 36 soal, maka skor yang diperoleh Budi adalah ...", options: ["A. 134", "B. 126", "C. 122", "D. 120"] },
  { no: 4, soal: "Dalam kompetensi matematika, setiap jawaban benar diberi skor 2, salah skor -1 dan tidak menjawab poin nol. Dari 40 soal yang diberikan, Andi dapat menjawab 36 soal. Jika skor yang diperoleh Andi adalah 51, maka banyak soal yang dijawab benar adalah ...", options: ["A. 31", "B. 30", "C. 29", "D. 28"] },
  { no: 5, soal: "Dalam suatu ujian perguruan tinggi, setiap soal bernilai benar mendapat nilai 4, salah bernilai -1 dan tidak dijawab bernilai 0. Dari 60 soal yang diberikan, Nafisha mengerjakan 31 soal dan mendapatkan skor 94. Maka banyak jawaban benar yang diperoleh Nafisha adalah ...", options: ["A. 25", "B. 24", "C. 23", "D. 22"] },
  { no: 6, soal: "Suhu di kota Moskow $11^\\circ C$. Pada saat turun salju, suhunya turun $4^\\circ C$ setiap 15 menit. Suhu di kota tersebut setelah turun salju 1 jam adalah ...", options: ["A. $-9^\\circ C$", "B. $-5^\\circ C$", "C. $5^\\circ C$", "D. $9^\\circ C$"] },
  { no: 7, soal: "Suhu di dalam kulkas sebelum dihidupkan $29^\\circ C$. Setelah dihidupkan, suhunya turun $3^\\circ C$ setiap 5 menit. Setelah 10 menit suhu dalam kulkas adalah ...", options: ["A. $23^\\circ C$", "B. $26^\\circ C$", "C. $32^\\circ C$", "D. $35^\\circ C$"] },
  { no: 8, soal: "Operasi \"#\" artinya kalikan bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan dua kali bilangan kedua. Hasil dari $5 \\# (-4)$ adalah ...", options: ["A. -28", "B. -24", "C. -16", "D. -12"] },
  { no: 9, soal: "Operasi \"*\" artinya kalikan dua kali bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan tiga kali bilangan kedua. Hasil dari $-3 * (-2)$ adalah ...", options: ["A. 18", "B. -18", "C. -6", "D. 6"] },
  { no: 10, soal: "Pada suhu ruangan ber-AC mencapai $16^\\circ C$, sedangkan di tempat penyimpanan daging suhunya $25^\\circ C$ lebih rendah dari suhu di ruangan ber-AC. Suhu di tempat penyimpanan daging adalah ...", options: ["A. $16^\\circ C$", "B. $11^\\circ C$", "C. $-9^\\circ C$", "D. $-39^\\circ C$"] },
  { no: 11, soal: "Suhu di suatu ruangan $-12^\\circ C$, sedangkan suhu dalam ruangan $20^\\circ C$. Perbedaan suhu di kedua tempat tersebut adalah ...", options: ["A. $-32^\\circ C$", "B. $-8^\\circ C$", "C. $8^\\circ C$", "D. $32^\\circ C$"] },
  { no: 12, soal: "Perhatikan suhu udara di beberapa negara berikut!\nWina $-7^\\circ C$, Soul $-1^\\circ C$, Baghdad $39^\\circ C$, Surabaya $33^\\circ C$\nSelisih suhu udara yang benar di bawah ini adalah ...", options: ["A. Selisih suhu udara Wina dan Soul $-6^\\circ C$", "B. Selisih suhu udara Baghdad dan Wina $30^\\circ C$", "C. Selisih suhu udara Surabaya dan Soul adalah $34^\\circ C$", "D. Selisih udara Surabaya dan Wina adalah $39^\\circ C$"] },
  { no: 13, soal: "Diberikan $x = 1 - 2 + 3 - 4 + 5 - ... + 99 - 100$. Berapakah nilai dari $x$?", options: ["A. -100", "B. -50", "C. 0", "D. 50"] },
  { no: 14, soal: "Berapakah digit terakhir dari $3^{2023}$?", options: ["A. 3", "B. 9", "C. 1", "D. 7"] },
  { no: 15, soal: "Berapakah digit terakhir dari $2^{2025}$?", options: ["A. 2", "B. 4", "C. 6", "D. 8"] },
  { no: 16, soal: "Jika $a$, $b$, dan $c$ adalah tiga bilangan bulat berbeda sedemikian rupa sehingga $a \\times b \\times c = 16$, berapakah nilai terbesar yang mungkin untuk $a + b + c$?", options: ["A. 11", "B. 8", "C. 10", "D. 13"] },
  { no: 17, soal: "Jika $m$ dan $n$ adalah bilangan bulat positif sehingga $m^2 - n^2 = 13$, berapakah nilai dari $m$?", options: ["A. 7", "B. 13", "C. 6", "D. 12"] },
  { no: 18, soal: "Jika $a$ dan $b$ adalah bilangan bulat positif sehingga $a^2 - b^2 = 2023$, maka nilai terkecil yang mungkin untuk $a + b$ adalah ...", options: ["A. 44", "B. 119", "C. 289", "D. 2023"] },
  { no: 19, soal: "Diberikan $a$ dan $b$ adalah bilangan bulat positif sedemikian sehingga $a^2 - b^2 = 2019$. Nilai terkecil yang mungkin untuk $a - b$ adalah ...", options: ["A. 1", "B. 3", "C. 673", "D. 2019"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nJoko tidur malam dari pukul 9.20 dan bangun pagi pukul 4.35, ia tidur selama ...", options: ["A. 4 jam 45 menit", "B. 5 jam 15 menit", "C. 5 jam 45 menit", "D. 7 jam 15 menit", "E. 19 jam 15 menit"] },
  { no: 2, soal: "OSN Matematika 2003 Tingkat Kota\nJika $a$ dan $b$ adalah bilangan bulat genap, dengan $a > b$, maka banyaknya bilangan bulat ganjil diantara $a$ dan $b$ adalah ...", options: ["A. $\\frac{a-b}{2}$", "B. $a - b$", "C. $\\frac{a-b}{2} - 2$", "D. $a - b + 1$", "E. Tidak dapat ditentukan"] },
  { no: 3, soal: "OSN Matematika 2003 Tingkat Kota\nKendaraan A berjalan dengan laju 60 km/jam. Dua jam berikutnya kendaraan B berjalan dengan laju 80 km/jam berangkat dari tempat dan menuju arah yang sama. Setelah berapa jam kendaraan B menyusul A?", options: ["A. 2 jam", "B. 3 jam", "C. 4 jam", "D. 5 jam", "E. 6 jam"] },
  { no: 4, soal: "OSN Matematika 2003 Tingkat Kota\nDengan menggunakan angka-angka 1, 1, 2, 2, 3, 3, 4, 4 bilangan 8 angka terbesar yang dapat dibentuk dengan syarat kedua angka 1 dipisahkan oleh satu angka yang lain, kedua angka 2 dipisahkan oleh dua angka, kedua angka 3 dipisahkan oleh tiga angka dan kedua angka 4 dipisahkan oleh empat angka adalah ...", options: [] },
  { no: 5, soal: "OSN Matematika 2003 Tingkat Kota\nHasil kali suatu bilangan genap dan suatu bilangan ganjil adalah 840. Bilangan ganjil yang terbesar yang memenuhi syarat tersebut adalah ...", options: [] },
  { no: 6, soal: "OSN Matematika 2003 Tingkat Kota\nJumlah dua bilangan sama dengan 12. Hasil kali dua bilangan tersebut nilainya akan paling besar jika salah satu bilangannnya adalah ...", options: [] },
  { no: 7, soal: "OSN Matematika 2005 Tingkat Kota\nUang sebesar Rp2.000,00 dapat dinyatakan dengan beberapa koin 50 rupiah, 100 rupiah, 200 rupiah dan/atau 500 rupiahan. Diketahui ternyata bahwa uang tersebut terdiri tepat dua koin 500 rupiahan dan dua jenis koin lainnya. Dengan mengikuti aturan tersebut, banyak cara yang mungkin untuk menyatakan uang sebesar Rp2.000,00 dengan koin-koin tersebut adalah ...", options: ["A. 17", "B. 20", "C. 18", "D. 6", "E. 15"] },
  { no: 8, soal: "OSN Matematika 2005 Tingkat Kota\nSetiap kotak piramid disamping akan diisi dengan bilangan. Mula-mula yang harus diisikan adalah kotak-kotak pada alas piramid. Kotak di atasnya diperoleh dari menjumlahkan bilangan-bilangan yang ada di dalam dua kotak di bawahnya. Andaikan dasar piramid hendak diisi bilangan-bilangan 7, 12, 5, 4 dan 9, berapakah nilai terbesar yang mungkin dari bilangan pada kotak teratas.", options: [] },
  { no: 9, soal: "OSN Matematika 2006 Tingkat Kota\nJumlah dua bilangan bulat yang berbeda adalah 14. Jika hasil bagi kedua bilangan tersebut adalah juga bilangan bulat, maka salah satu bilangan yang mungkin adalah ...", options: ["A. 2", "B. 4", "C. 6", "D. 7", "E. 9"] },
  { no: 10, soal: "OSN Matematika 2006 Tingkat Kota\nPanjang jalan tol Bogor-Jakarta 60 km. Pada pukul 12.00 mobil A berangkat dari pintu tol Bogor menuju Jakarta dengan kecepatan rata-rata 80 km/jam. Pada saat yang sama mobil B berangkat dari pintu tol Jakarta menuju Bogor dengan kecepatan rata-rata 70 km/jam. Kedua mobil tersebut akan berpapasan pada pukul ...", options: [] },
  { no: 11, soal: "OSN Matematika 2007 Tingkat Kota\nBilangan cacah lima digit dengan digit pertama tidak nol dan jumlah semua digitnya sama dengan 2 ada sebanyak ...", options: ["A. 1", "B. 2", "C. 3", "D. 4", "E. 5"] },
  { no: 12, soal: "OSN Matematika 2007 Tingkat Kota\nPada pukul 10.15 penerjun payung melompat dari pesawat udara sambil membuka parasutnya. Setelah 8 detik, ketinggiannya 2000 meter dari permukaan tanah. Lima detik kemudian ketinggiannya 1900 meter. Misalkan mula-mula detik ke-8 sampai satu menit kecepatanya tetap. Ketinggiannya pada pukul 10.16 adalah ... meter", options: ["A. 860", "B. 890", "C. 940", "D. 960", "E. 980"] },
  { no: 13, soal: "OSN Matematika 2007 Tingkat Kota\nDesi merayakan hari ulang tahun pada tanggal 27 Desember 2006. Jika pada hari tersebut usia Desi sama dengan jumlah digit dari angka tahun kelahirannya, maka Desi lahir pada tahun ...", options: ["A. 1994", "B. 1992", "C. 1984", "D. 1979"] },
  { no: 14, soal: "OSN Matematika 2007 Tingkat Kota\nJika bilangan 123.456.789 dikalikan dengan bilangan 999.999.999, maka banyak angka 9 dari hasil perkalian kedua bilangan tersebut adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2007 Tingkat Kota\nHimpunan semua bilangan prima yang kurang dari seratus dan kuadrat bilangan tersebut ditambah dua juga merupakan bilangan prima adalah ...", options: [] },
  { no: 16, soal: "OSN Matematika 2008 Tingkat Kota\nMisalkan $n$ adalah bilangan asli yang tidak lebih dari 24, maka jumlah dari semua nilai $n$ yang memenuhi agar $n$ dan 24 relatif prima adalah ...", options: ["A. 120", "B. 96", "C. 95", "D. 82", "E. 81"] },
  { no: 17, soal: "OSN Matematika 2008 Tingkat Kota\nSuatu bilangan terdiri dari 5 angka. Jika jumlah dari angka-angka tersebut adalah A dan jumlah dari angka-angka pada bilangan A adalah B, maka nilai terbesar dari B yang mungkin adalah ...", options: ["A. 9", "B. 10", "C. 11", "D. 12", "E. 13"] },
  { no: 18, soal: "OSN Matematika 2008 Tingkat Kota\nIntan berjalan kaki dengan kecepatan tetap 4,5 km/jam pada suatu jalur ke arah utara. Di kejauhan pada jarak 2,7 km dari arah utara pada jalur yang sama, Mufti mengendarai sepeda dengan kecepatan lima kali lipat kecepatan Intan. Lama waktu yang diperlukan sehingga mereka akan kembali berjarak 2,7 km satu sama lain adalah ...", options: [] },
  { no: 19, soal: "OSN Matematika 2008 Tingkat Kota\nDiketahui z adalah bilangan asli yang memenuhi semua syarat berikut.\na. Z terdiri dari 5 angka\nb. Angka penyusun tidak ada yang berulang\nc. Penjumlahan semua angka penyusun z adalah 10\nd. Jika z ditambah dengan bilangan cerminnya, maka akan diperoleh sebuah bilangan lima angka yang semua angkanya sama.\nBilangan z terbesar yang mungkin adalah ...\nKeterangan: bilangan cermin adalah bilangan dengan angka penyusun yang sama tetapi memiliki urutan angka terbalik. Di samping itu, bilangan cermin dapat memiliki angka 0 pada posisi pertama, sedangkan bilangan semula tidak.", options: [] },
  { no: 20, soal: "OSN Matematika 2009 Tingkat Kota\nMisalkan $a$ dan $b$ bilangan bulat sehingga $a(a + b) = 34$. Nilai terkecil $a - b$ adalah ...", options: ["A. -17", "B. -32", "C. -34", "D. -67"] },
  { no: 21, soal: "OSN Matematika 2009 Tingkat Kota\nAndi membuka sebuah buku setebal 650 halaman, hasil kali nomor halaman yang nampak adalah 702. Jumlah nomor-nomor halaman buku yang terbuka adalah ...", options: ["A. Lebih dari 53", "B. Kurang dari 50", "C. Lebih dari 52", "D. Kurang dari 54"] },
  { no: 22, soal: "OSN Matematika 2009 Tingkat Kota\nUntuk sembarang $p$ bilangan prima, misalkan $h = 14p - 4$. Pernyataan berikut yang benar adalah ...", options: ["A. $h$ tidak dapat dinyatakan dalam bentuk kuadrat dari bilangan asli", "B. $h$ dapat dinyatakan dalam bentuk kuadrat dari bilangan asli", "C. ada bilangan asli $n$ sehingga berlaku $14p - 4 = n^3$", "D. terdapat $n$ bilangan ganjil sehingga $14p - 4 = n^2$"] },
  { no: 23, soal: "OSN Matematika 2009 Tingkat Kota\nPada pemilihan calon ketua kelas yang diikuti oleh 5 kontestan, diketahui bahwa pemenangnya mendapat 10 suara. Jika diketahui bahwa tidak ada dua kontestan yang memperoleh jumlah suara yang sama, maka perolehan terbesar yang mungkin untuk kontestan dengan suara paling sedikit adalah ...", options: ["A. 3", "B. 4", "C. 5", "D. 6"] },
  { no: 24, soal: "OSN Matematika 2009 Tingkat Kota\nBanyaknya bilangan genap yang kurang dari 1000 dan hasil kali angka-angka penyusunnya 180 adalah ...", options: [] },
  { no: 25, soal: "OSN Matematika 2009 Tingkat Kota\nFaisal memperoleh nomor antrea ke-2009 untuk menaiki bus kota dalam provinsi dari kota Malang ke Surabaya. Bus berangkat setiap 5 menit dan setiap pemberangkatan, bus memuat 55 orang. Jika pemberangkatan pertama berangkat pukul 5.01 pagi, maka Faisal berangkat pada pukul ...", options: [] },
  { no: 26, soal: "OSN Matematika 2009 Tingkat Kota\nJika $P$, $Q$, $R$ adalah angka-angka dari suatu bilangan dan $(100P + 10Q + R)(P + Q + R) = 2008$, maka nilai $Q$ adalah ...", options: ["A. 3", "B. 4", "C. 5", "D. 6", "E. 7"] },
  { no: 27, soal: "OSN Matematika 2010 Tingkat Kota\n$n$ adalah bilangan bulat positif terkecil sehingga $7 + 30n$ bukan bilangan prima. Nilai dari $64 - 16n + n^2$ adalah ...", options: ["A. 1", "B. 4", "C. 9", "D. 16", "E. 25"] },
  { no: 28, soal: "OSN Matematika 2010 Tingkat Kota\nKereta penumpang berpapasan dengan kereta barang. Laju kereta penumpang 40 km/jam, sedangkan kereta barang 20 km/jam. Seorang penumpang di kereta penumpang mencatat bahwa kereta berpapasan selama 15 detik. Panjang rangkaian KA barang adalah ... m", options: [] },
  { no: 29, soal: "OSN Matematika 2011 Tingkat Kota\nMenggunakan angka-angka 1, 2, 5, 6 dan 9 akan dibentuk bilangan genap yang terdiri dari lima angka. Jika tidak ada angka yang berulang, maka selisih bilangan terbesar dan terkecil adalah ...", options: ["A. 70820", "B. 79524", "C. 80952", "D. 81236", "E. 83916"] },
  { no: 30, soal: "OSN Matematika 2011 Tingkat Kota\nHasil penjumlahan $1! + 2! + 3! + ... + 2011!$ adalah suatu bilangan yang angka satuannya adalah ...", options: ["A. 3", "B. 4", "C. 5", "D. 6", "E. 7"] },
  { no: 31, soal: "OSN Matematika 2011 Tingkat Kota\nJumlah angka-angka dari hasil kali bilangan 999999999 dengan 12345679", options: [] },
  { no: 32, soal: "OSN Matematika 2011 Tingkat Kota\nSemua pasangan bilangan bulat $(a, b)$ yang memenuhi $\\frac{a}{b} = 2 - \\frac{1}{b}$ adalah ...", options: [] },
  { no: 33, soal: "OSN Matematika 2012 Tingkat Kota\nPerhatikan pola bilangan berikut. Bilangan 2012 akan terletak di bawah huruf\n$\\begin{array}{ccccccc} P & Q & R & S & T & U & V \\\\ & 1 & 2 & 3 & & & \\\\ 7 & 6 & 5 & 4 & & & \\\\ & 8 & 9 & 10 & & & \\\\ ... & ... & ... & 11 & & & \\end{array}$", options: ["A. Q", "B. R", "C. S", "D. T", "E. U"] },
  { no: 34, soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui $\\overline{abc}$ dan $\\overline{def}$ adalah bilangan yang terdiri dari 3 angka (digit) sehingga $\\overline{abc} + \\overline{def} = 1000$. Jika $a$, $b$, $c$, $d$, $e$ atau $f$ tidak satupun yang sama dengan 0, maka nilai $a + b + c + d$ adalah ...", options: ["A. 25", "B. 26", "C. 27", "D. 28", "E. 29"] },
  { no: 35, soal: "OSN Matematika 2013 Tingkat Kota\nTiga orang A, B, dan C pinjam meminjam kelereng. Pada awalnya ketiga orang tersebut memiliki sejumlah kelereng tertentu dan selama pinjam meminjam mereka tidak melakukan penambahan kelereng selain melalui pinjam meminjam diantara ketiga orang tersebut. Pada suatu hari A meminjami sejumlah kelereng kepada B dan C sehingga jumlah kelereng B masing-masing menjadi dua kali lipat jumlah kelereng sebelumnya. Hari berikutnya B meminjami sejumlah kelereng kepada A dan C sehingga jumlah kelereng A dan C masing-masing menjadi dua kali lipat jumlah kelereng sebelumnya. Hari terakhir C meminjami sejumlah kelereng kepada A dan B sehingga jumlah kelereng A dan B masing-masing menjadi dua kali lipat jumlah kelereng sebelumnya. Setelah dihitung akhirnya masing-masing memiliki 16 kelereng. Banyak A mula-mula adalah ...", options: ["A. 8", "B. 14", "C. 26", "D. 28", "E. 32"] },
  { no: 36, soal: "OSN Matematika 2013 Tingkat Kota\nDiberikan angka disusun sebagai berikut: 987654321. Berapa banyak tanda operasi penjumlahan harus disisipkan diantara angka-angka tersebut agar menghasilkan jumlah 99?", options: ["A. 3", "B. 4", "C. 5", "D. 7", "E. 8"] },
  { no: 37, soal: "OSN Matematika 2013 Tingkat Kota\nTino sedang memanjat tangga dan sekarang dia berada tepat di tengah tangga. Jika ia naik 3 anak tangga ke atas, kemudian turun 5 anak tangga, serta naik kembali 10 anak tangga, maka Tino akan sampai di puncak tangga. Banyak anak tangga yang dimiliki tangga tersebut adalah ...", options: [] },
  { no: 38, soal: "OSN Matematika 2014 Tingkat Kota\nJika $M = 2 + 22 + 222 + ... + 222...222$ (sampai 2023 digit), maka tiga angka terakhir M adalah ...", options: [] },
  { no: 39, soal: "OSN Matematika 2014 Tingkat Kota\nSepuluh titik pada suatu lingkaran diberi nomor 1, 2, ..., 10. Seekor katak melompat searah jarum jam satu satuan jika katak berada pada nomor yang merupakan bilangan prima, dan tiga satuan jika bukan bilangan prima. Jika mula-mula katak berada pada posisi nomor 1, dimanakah posisi katak setelah melompat 2014 kali?", options: ["A. 1", "B. 4", "C. 7", "D. 8"] },
  { no: 40, soal: "OSN Matematika 2015 Tingkat Kota\nOperasi * untuk himpunan bilangan $S = \\{0, 1, 2, 3, 4, 5, 6\\}$ didefinisikan sesuai tabel. Jika untuk setiap bilangan bulat $n$ yang lebih besar daripada 1 didefinisikan $x^n = x^{n-1} * x$, maka nilai dari $5^{2015} = ...$", options: ["A. 0", "B. 1", "C. 2", "D. 3"] },
  { no: 41, soal: "OSN Matematika 2017 Tingkat Kota\nMisalkan $n$ adalah suatu bilangan positif. Jumlah tiga bilangan prima $3n - 4$, $4n - 5$ dan $5n - 3$ adalah ...", options: ["A. 12", "B. 14", "C. 15", "D. 17"] },
  { no: 42, soal: "OSN Matematika 2018 Tingkat Kota\nBilangan prima $p$ dan $q$ masing-masing dua digit. Hasil penjumlahan $p$ dan $q$ merupakan bilangan dua digit yang digitnya sama. Jika bilangan tiga digit $r$ merupakan perkalian $p$ dan $q$, maka dua nilai $r$ yang mungkin adalah ...", options: ["A. 121 dan 143", "B. 169 dan 689", "C. 403 dan 989", "D. 481 dan 121"] },
  { no: 43, soal: "OSN Matematika 2018 Tingkat Kota\nJika $x$ dan $y$ adalah bilangan genap dengan $x < y$, maka bilangan genap yang lebih besar daripada $x$ dan lebih kecil dari $y$ ada sebanyak ...", options: ["A. $\\frac{y-x}{2} - 2$", "B. $\\frac{y-x}{2}$", "C. $\\frac{y-x}{2}$", "D. $\\frac{y-x}{2} - 1$"] },
  { no: 44, soal: "OSN Matematika 2019 Tingkat Kota\nDidefinisikan $\\lfloor a \\rfloor$ = bilangan bulat terbesar yang lebih kecil atau sama dengan $a$. Sebagai contoh $\\lfloor 2 \\rfloor = 2$; $\\lfloor \\frac{3}{4} \\rfloor = 0$; $\\lfloor \\frac{5}{4} \\rfloor = 1$. Jika $x = 7$ maka nilai $\\lfloor \\frac{x+31}{4} \\rfloor - x$ adalah ...", options: ["A. 8", "B. 7", "C. -7", "D. -8"] },
  { no: 45, soal: "OSN Matematika 2019 Tingkat Kota\nDisediakan empat bilangan 2, 3, 4, -2 yang akan ditempatkan pada empat persegi paling bawah, sehingga tidak ada bilangan yang tersisa. Untuk enam persegi yang lain dibuat aturan sebagai berikut. Nilai persegi yang bertuliskan huruf K adalah hasil perkalian dari nilai dua persegi yang tepat berada di bawahnya dan nilai persegi yang bertuliskan huruf J adalah hasil penjumlahan dari nilai dua persegi yang tepat berada di bawahnya. Nilai paling besar yang mungkin diperoleh pada persegi paling atas adalah ...", options: ["A. 400", "B. 74", "C. 61", "D. 57"] },
  { no: 46, soal: "OSN Matematika 2019 Tingkat Kota\nDiantara bilangan bulat berikut, yang bernilai ganjil untuk setiap bilangan bulat $n$ adalah ...", options: ["A. $2019 - 3n$", "B. $2019 + n$", "C. $2019 + 2n$", "D. $2019 + n^2$"] },
  { no: 47, soal: "OSN Matematika 2020 Tingkat Kota\nManakah diantara bilangan berikut yang merupakan bilangan prima?", options: ["A. 2017", "B. 2019", "C. 2021", "D. 2023"] },
  { no: 48, soal: "OSN Matematika 2021 Tingkat Kota\nSuatu sistem pencatat kuantitas stok otomatis mengalami gagal desain yang cukup fatal, yaitu tidak terdefinisinya angka 4 dan 6 di sistem tersebut. Jadi, setelah menampilkan 3, sistem akan menampilkan 5 dan setelahnya 7. Hal ini terjadi untuk seluruh nilai tempat. Sehingga, setelah menampilkan 399, sistem akan menampilkan 500 sebagai nilai selanjutnya. Jika sistem tersebut menyampaikan bahwa tersedia stok tepung sebanyak 1578 bungkus, maka banyak stok tepung yang sesungguhnya tersedia adalah ... bungkus.", options: ["A. 814", "B. 896", "C. 1456", "D. 1467"] },
  { no: 49, soal: "OSN Matematika 2022 Tingkat Kota\nBilangan \"primus\" dihasilkan dari bilangan 4 digit $\\overline{abcd}$ dengan $b = 0$ yang melalui 3 langkah berikut:\n(i) Kurangi $\\overline{abcd}$ dengan jumlah semua digitnya\n(ii) Bagilah hasil dari Langkah (i) dengan 9\n(iii) Kurangilah bilangan hasil dari Langkah (ii) dengan 99 kali digit pertama bilangan hasil dari langkah (ii)\nDiantara bilangan berikut, yang bukan merupakan bilangan \"primus\" adalah ...", options: ["A. 38", "B. 59", "C. 104", "D. 117"] },
  { no: 50, soal: "OSN Matematika 2023 Tingkat Kota\nMisalkan $a$, $b$, $c$ dan $d$ adalah bilangan-bilangan positif yang berbeda sehingga $a + b$, $a + c$ dan $a + d$ bilangan ganjil sekaligus bilangan kuadrat. Nilai $a + b + c + d$ terkecil yang mungkin adalah ...", options: ["A. 33", "B. 67", "C. 81", "D. 83"] },
  { no: 51, soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui $a$, $b$, $c$, $d$, $e$ merupakan bilangan bulat positif dengan $a \\leq b \\leq c \\leq d \\leq e$ dan $a + b + c + d + e = abcde$. Nilai terbesar yang mungkin dari $e$ adalah ...", options: ["A. 2", "B. 3", "C. 5", "D. 7"] },
  { no: 52, soal: "OSN Matematika 2023 Tingkat Kota\nSuatu bilangan prima disebut \"prima kanan\" jika dapat diperoleh bilangan prima dengan menghilangkan satu angka di sebelah kiri. Sebagai contoh: 223 adalah \"prima kanan\" sebab setelah menghilangkan angka 2 paling kiri, bilangan yang tersisa adalah 23 yang merupakan bilangan prima. Contoh lainnya 127. Dengan menghilangkan 2 angka paling kiri maka angka yang tersisa adalah 7 merupakan bilangan prima. Banyaknya bilangan prima antara 10 dan 200 yang merupakan \"prima kanan\" adalah ...", options: ["A. 24", "B. 26", "C. 28", "D. 30"] },
  { no: 53, soal: "OSN Matematika 2024 Tingkat Kota\nMisalkan $N(a, b, c)$ menyatakan banyaknya kelipatan $a$ yang lebih besar dari $b$ dan kurang dari $c$. Sebagai contoh, $N(3, 5, 10) = 2$ karena terdapat dua bilangan antara 5 dan 10 yang merupakan kelipatan 3. Nilai dari $N(6^4, 6^4, 6^6)$ adalah ...", options: ["A. 216", "B. 215", "C. 209", "D. 208"] },
  { no: 54, soal: "OSN Matematika 2024 Tingkat Kota\nGina bermain angka dengan mengisikan bilangan bulat 1, 2, ..., 9 pada tabel $3 \\times 3$. Sehingga, hasil kali ketiga bilangan pada setiap baris adalah bilangan yang terdapat di kanan tabel dan hasil kali ketiga bilangan pada setiap kolom adalah bilangan yang terdapat di bawah tabel. Nilai $N$ adalah ...", options: ["A. 1", "B. 3", "C. 4", "D. 6"] },
  { no: 55, soal: "OSN Matematika 2024 Tingkat Kota\nJumlah semua bilangan ratusan yang ketiga digitnya berbeda dan tidak memuat 0 adalah ...", options: ["A. 359.640", "B. 279.720", "C. 277.200", "D. 252.000"] },
  { no: 56, soal: "OSN Matematika 2024 Tingkat Kota\nBilangan-bilangan 4, 5, 6, 9, 11, 12, 18, 20 dan 24 akan diletakkan pada lingkaran dan 5 persegi yang disusun dalam satu baris. Setiap bilangan harus digunakan tepat satu kali dan diletakkan di tempat yang berbeda. Selain itu bilangan pada setiap lingkaran harus merupakan hasil penjumlahan dari dua bilangan pada persegi yang berada tepat di sebelah kiri dan kanannya. Jika $x$ adalah bilangan pada persegi paling kiri dan $y$ adalah bilangan pada persegi paling kanan, maka nilai terbesar yang mungkin dari $x + y$ adalah ...", options: ["A. 32", "B. 38", "C. 42", "D. 44"] },
  { no: 57, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui $a$, $b$ dan $c$ adalah bilangan ratusan yang satuannya sama dengan ratusannya. Jika $b = 2a + 1$ dan $c = 2b + 1$, maka banyaknya kemungkinan tripel $(a, b, c)$ yang berbeda adalah ...", options: ["A. 1", "B. 2", "C. 3", "D. 4"] },
];

const OlimpiadeBilanganBulatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

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
          OLIMPIADE - BILANGAN BULAT
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
                  <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal)}
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
                  <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal)}
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
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeBilanganBulatPage;
