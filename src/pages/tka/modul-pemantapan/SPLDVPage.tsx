import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Persamaan Linear Dua Variabel (PLDV)", content: `Bentuk umum PLDV: $ax + by = c$ dengan $a, b \\neq 0$, variabel x dan y.` },
  { heading: "B. Sistem Persamaan Linear Dua Variabel (SPLDV)", content: `$a_1x + b_1y = c_1$\n$a_2x + b_2y = c_2$` },
  { heading: "C. Penyelesaian SPLDV", content: `Penyelesaian SPLDV digunakan untuk menentukan nilai (x, y) yang memenuhi kedua persamaan melalui metode sebagai berikut:\na. Metode Grafik\nb. Metode Substitusi\nc. Metode Eliminasi\nd. Metode Campuran` },
  { heading: "D. Penyelesaian Soal Menggunakan Metode Campuran", content: `$x + 3y = 2$ (persamaan 1)\n$2x + y = 9$ (persamaan 2)\n\nLangkah berikutnya adalah menyamakan koefisien salah satu variabel untuk dihilangkan (dieliminasi), bisa koefisien x atau koefisien y. Pada kasus ini kita coba pilih untuk menyamakan koefisien x yaitu dengan cara $\\times 2$ pada persamaan 1 agar sama-sama 2x seperti pada uraian berikut:\n\n$x + 3y = 2 \\quad \\times 2 \\quad \\Rightarrow \\quad 2x + 6y = 4$\n$2x + y = 9 \\quad \\times 1 \\quad \\Rightarrow \\quad 2x + y = 9$\n$\\hspace{5.5cm} 5y = -5$\n$\\hspace{5.5cm} y = -1$\n\nUntuk mendapatkan nilai variabel x kita substitusikan nilai y yang sudah diketahui ke salah satu persamaan, baik persamaan 1 ataupun persamaan 2.\n\nKita coba substitusikan $y = -1$ ke persamaan 1 yaitu $x + 3y = 2$\n$x + 3(-1) = 2$\n$x - 3 = 2$\n$x = 2 + 3$\n$x = 5$\n\nJadi, penyelesaian SPLDV di atas adalah $x = 5$ dan $y = -1$ atau $(5, -1)$` },
  { heading: "E. SPLDV Memiliki Penyelesaian Tak Hingga", content: `Pada kasus SPLDV dimana memiliki penyelesaian tak hingga adalah ketika sistem persamaan yang ada membentuk PLDV.\n\nContoh:\nTentukan penyelesaian SPLDV berikut:\n$x + y = 5$\n$2x + 2y = 10$\n\nKedua persamaan tersebut sebenarnya adalah persamaan yang sama (persamaan kedua adalah 2 kali persamaan pertama), sehingga memiliki tak hingga penyelesaian.` },
  { heading: "F. SPLDV Tidak Memiliki Himpunan Penyelesaian", content: `Pada kasus SPLDV dimana kedua persamaan memiliki persamaan yang sama namun dengan hasil yang berbeda (tidak konsisten).\n\nContoh:\nTentukan penyelesaian SPLDV berikut:\n$x + y = 5$\n$x + y = -3$\n\nKedua persamaan tersebut tidak konsisten karena sisi kiri sama tetapi sisi kanan berbeda, sehingga tidak memiliki penyelesaian.` },
  { heading: "G. SPLDV Memiliki 1 Himpunan Penyelesaian", content: `Pada kasus SPLDV dimana kedua persamaan tidak membentuk PLDV dan tidak terdapat 2 persamaan yang sama dengan menghasilkan nilai yang berbeda.\n\nIni adalah kasus yang paling umum dijumpai dalam soal-soal SPLDV.` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui sistem persamaan $x - 3y - 5 = 0$ dan $2x - 5y = 9$. Nilai dari $3x + 2y$ adalah", options: ["A. -1", "B. 1", "C. 3", "D. 4"] },
  { no: 2, soal: "Penyelesaian sistem persamaan $3x - 2y = 12$ dan $5x + y = 7$ adalah $x = p$ dan $y = q$. Nilai dari $4p + 3q$ adalah ...", options: ["A. -2", "B. 7", "C. 14", "D. 16"] },
  { no: 3, soal: "Jika a dan b merupakan penyelesaian dari sistem persamaan $-3x + 2y = 8$ dan $2x - y = -10$, nilai dari $a - 2b$ adalah ...", options: ["A. 16", "B. 32", "C. 40", "D. 48"] },
  { no: 4, soal: "Penyelesaian dari $\\frac{2}{x} + \\frac{1}{y} = 6$ dan $\\frac{1}{x} + \\frac{1}{y} = 2$ adalah $x = a$ dan $y = b$. Nilai dari $a - 2b$ adalah ...", options: ["A. -2", "B. 7", "C. 14", "D. 16"] },
  { no: 5, soal: "Diketahui $\\frac{3}{x} + \\frac{1}{y} = 4$ dan $\\frac{1}{x} - \\frac{2}{y} = -2$. Nilai $2x - y$ adalah ...", options: ["A. 0", "B. 2", "C. 4", "D. 8"] },
  { no: 6, soal: "Diketahui sistem persamaan berikut:\n$\\frac{2}{x} + \\frac{3}{y} = 2$\n$\\frac{4}{x} - \\frac{3}{y} = 1$\nNilai x sama dengan ...", options: ["A. 2", "B. 3", "C. $\\frac{1}{2}$", "D. $\\frac{1}{3}$"] },
  { no: 7, soal: "Perhatikan sistem persamaan 'campuran' berikut:\n$\\sqrt{y} - \\sqrt{x} = 1$\n$\\frac{4}{\\sqrt{x}} + \\frac{3}{\\sqrt{y}} = 3$\nJika diketahui x dan y adalah bilangan bulat positif, maka nilai dari xy adalah ...", options: ["A. 6", "B. 3", "C. 2", "D. 5"] },
  { no: 8, soal: "Hanna membeli 3 buah buku dan 2 buah pensil. Hanna membayar dengan dua lembar uang Rp 10.000,00 dan mendapatkan kembalian Rp 3.000,00. Jika harga sebuah buku x rupiah dan pensil y rupiah, maka model matematikanya adalah..", options: ["A. $10.000 - 3x - 2y = 3.000$", "B. $10.000 - 3x + 2y = 3.000$", "C. $20.000 - (3x - 2y) = 3.000$", "D. $20.000 - (3x + 2y) = 3.000$"] },
  { no: 9, soal: "Indra membeli 2 buah buku dan 3 buah pensil. Indra membayar dengan dua lembar uang Rp 20.000,00 dan mendapatkan kembalian Rp 13.000,00. Jika harga sebuah buku x rupiah dan pensil y rupiah, maka model matematikanya adalah..", options: ["A. $20.000 - 2x - 3y = 13.000$", "B. $20.000 - 2x + 3y = 13.000$", "C. $40.000 - (2x - 3y) = 13.000$", "D. $40.000 - (2x + 3y) = 13.000$"] },
  { no: 10, soal: "Harga 4 buku tulis dan 3 pensil adalah Rp. 13.500,00. Harga 3 buku tulis dan 2 pensil adalah Rp. 9.750,00. Harga 2 buku tulis dan 3 pensil adalah ..", options: ["A. Rp 11.250,00", "B. Rp 10.000,00", "C. Rp 9.500,00", "D. Rp 9.000,00"] },
  { no: 11, soal: "Jika harga sebuah mesin cetak adalah 5 kali harga sebuah komputer sedangkan harga 2 buah mesin cetak dan 5 buah komputer adalah Rp 60.000.000,00, maka harga sebuah mesin cetak adalah ...", options: ["A. Rp 8.000.000,00", "B. Rp 12.000.000,00", "C. Rp 20.000.000,00", "D. Rp 24.000.000,00"] },
  { no: 12, soal: "Di kandang Pak Karto terdapat ayam dan kambing sebanyak 75 ekor. Jika banyaknya kaki ada 198 buah maka banyaknya kambing adalah ....", options: ["A. 24 ekor", "B. 23 ekor", "C. 22 ekor", "D. 21 ekor"] },
  { no: 13, soal: "Tempat parkir pada saat itu menampung 90 kendaraan sepeda motor dan mobil, sedangkan jumlah roda seluruhnya ada 290 buah. Jika tarif parkir sepeda motor Rp2.000,00/jam dan mobil Rp5.000,00/jam, maka pendapatan tukang parkir saat itu selama 2 jam adalah ....", options: ["A. Rp345.000,00", "B. Rp325.000,00", "C. Rp285.000,00", "D. Rp690.000,00"] },
  { no: 14, soal: "Hazky mengambil uang di bank sebesar Rp.1.850.000,00 yang terdiri dari uang seratus ribuan dan uang lima puluh ribuan. Jika banyaknya uang lima puluh ribuan 7 lembar lebih banyak dari uang seratus ribuan, maka banyaknya uang lima puluh ribuan adalah...", options: ["A. 10 lembar", "B. 12 lembar", "C. 15 lembar", "D. 17 lembar"] },
  { no: 15, soal: "Dalam sebuah tempat pertunjukan terdapat 200 orang yang terdiri dari penonton dewasa dan anak-anak. Dari penjualan tiket diperoleh uang sebesar Rp 780.000,00. Jika harga tiket orang dewasa Rp 4.000,00 dan harga tiket anak-anak Rp 3.500,00, banyak penonton anak-anak adalah....", options: ["A. 40 orang", "B. 35 orang", "C. 30 orang", "D. 160 orang"] },
  { no: 16, soal: "Lima tahun yang lalu, usia Ayah adalah empat kali usia Paman. Lima tahun yang akan datang, dua kali usia Ayah sama dengan tiga kali usia Paman ditambah 7 tahun. Berapakah usia Ayah sekarang?", options: ["A. 40 tahun", "B. 35 tahun", "C. 25 tahun", "D. 45 tahun"] },
  { no: 17, soal: "Jumlah dua buah kebalikan bilangan adalah 5, sedangkan selisihnya adalah 1. Tentukan hasil kali kedua bilangan tersebut.", options: ["A. 6", "B. $\\frac{1}{6}$", "C. 5", "D. $\\frac{1}{5}$"] },
];

const SPLDVPage = () => (
  <TKAPemantapanLayout
    title="SISTEM PERSAMAAN LINEAR DUA VARIABEL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default SPLDVPage;
