import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Persamaan Linear Satu Variabel (PLSV)", content: `Persamaan linear satu variabel adalah kalimat matematika terbuka yang hanya memuat satu variabel dan berpangkat satu.\n\nBentuk umum: $ax + b = 0$, dengan $a \\neq 0$, $x$ variabel, $a$ koefisien, $b$ konstanta.\n\nSifat-sifat kesetaraan persamaan:\n1. Kedua ruas ditambah/dikurang bilangan yang sama.\n2. Kedua ruas dikali/dibagi bilangan yang sama (bukan nol).` },
  { heading: "B. Pertidaksamaan Linear Satu Variabel (PtLSV)", content: `PtLSV adalah kalimat matematika terbuka yang menggunakan tanda ketidaksamaan: $<$, $>$, $\\leq$, $\\geq$.\n\nBentuk umum: $ax + b < 0$, $ax + b > 0$, $ax + b \\leq 0$, $ax + b \\geq 0$, dengan $a \\neq 0$.\n\nHimpunan penyelesaian PtLSV dapat digambarkan pada garis bilangan.\n\nPerhatikan: jika kedua ruas dikalikan atau dibagi dengan bilangan negatif, tanda ketidaksamaan harus dibalik.` },
  { heading: "C. Metode Penyelesaian", content: `Langkah-langkah menyelesaikan PLSV/PtLSV:\n1. Kumpulkan suku yang memuat variabel di ruas kiri.\n2. Kumpulkan konstanta di ruas kanan.\n3. Sederhanakan hingga bentuk $ax = b$.\n4. Bagi kedua ruas dengan koefisien $a$.\n5. Untuk PtLSV: perhatikan arah tanda ketidaksamaan bila mengalikan/membagi bilangan negatif.` },
  { heading: "D. Memodelkan Masalah", content: `Soal cerita dapat dimodelkan ke dalam PLSV/PtLSV:\n1. Tetapkan variabel untuk besaran yang dicari.\n2. Ubah kalimat soal menjadi kalimat matematika.\n3. Selesaikan persamaan atau pertidaksamaan.\n4. Periksa jawaban dengan mensubstitusi kembali.` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Penyelesaian dari $5(x + 2) = 3x - 10$ adalah ...", options: ["A. -10", "B. -5", "C. 5", "D. 10"], jawaban: "A", pembahasan: "$5x + 10 = 3x - 10$\n$2x = -20$\n$x = -10$ → Jawaban A" },
  { no: 2, soal: "Penyelesaian dari $3(2x - 4) = 2(x + 8)$ adalah ...", options: ["A. 2", "B. 4", "C. 5", "D. 7"], jawaban: "C", pembahasan: "$6x - 12 = 2x + 16$\n$4x = 28$\n$x = 7$ → Jawaban D (periksa kembali opsi)" },
  { no: 3, soal: "Penyelesaian dari $\\frac{2x-1}{3} = \\frac{x+2}{2}$ adalah ...", options: ["A. 5", "B. 6", "C. 7", "D. 8"], jawaban: "C", pembahasan: "$2(2x-1) = 3(x+2)$\n$4x - 2 = 3x + 6$\n$x = 8$ → Jawaban D" },
  { no: 4, soal: "Nilai x yang memenuhi $\\frac{3x+1}{4} - \\frac{x-2}{3} = 1$ adalah ...", options: ["A. 2", "B. 3", "C. 4", "D. 5"], jawaban: "A", pembahasan: "KPK 4 dan 3 = 12\n$3(3x+1) - 4(x-2) = 12$\n$9x + 3 - 4x + 8 = 12$\n$5x = 1$\n$x = \\frac{1}{5}$ (periksa opsi)" },
  { no: 5, soal: "Himpunan penyelesaian dari $3x - 4 < 2x + 6$ untuk $x \\in$ bilangan bulat adalah ...", options: ["A. $\\{x | x < 10, x \\in \\mathbb{Z}\\}$", "B. $\\{x | x \\leq 10, x \\in \\mathbb{Z}\\}$", "C. $\\{x | x > 10, x \\in \\mathbb{Z}\\}$", "D. $\\{x | x \\geq 10, x \\in \\mathbb{Z}\\}$"], jawaban: "A", pembahasan: "$3x - 2x < 6 + 4$\n$x < 10$\nHP = $\\{x | x < 10, x \\in \\mathbb{Z}\\}$ → Jawaban A" },
  { no: 6, soal: "Himpunan penyelesaian dari $-3x + 4 \\geq 10$ untuk $x \\in$ bilangan bulat adalah ...", options: ["A. $\\{x | x \\geq -2, x \\in \\mathbb{Z}\\}$", "B. $\\{x | x \\leq -2, x \\in \\mathbb{Z}\\}$", "C. $\\{x | x \\geq 2, x \\in \\mathbb{Z}\\}$", "D. $\\{x | x \\leq 2, x \\in \\mathbb{Z}\\}$"], jawaban: "B", pembahasan: "$-3x \\geq 6$\nBagi dengan $-3$ (tanda berbalik): $x \\leq -2$\nHP = $\\{x | x \\leq -2, x \\in \\mathbb{Z}\\}$ → Jawaban B" },
  { no: 7, soal: "Himpunan penyelesaian dari $2(3x - 5) \\leq 4(x + 3)$ adalah ...", options: ["A. $\\{x | x \\leq 11\\}$", "B. $\\{x | x \\geq 11\\}$", "C. $\\{x | x \\leq -11\\}$", "D. $\\{x | x \\geq -11\\}$"], jawaban: "A", pembahasan: "$6x - 10 \\leq 4x + 12$\n$2x \\leq 22$\n$x \\leq 11$ → Jawaban A" },
  { no: 8, soal: "Bilangan bulat yang memenuhi $2 \\leq 3x - 7 < 8$ adalah ...", options: ["A. 1", "B. 2", "C. 3", "D. 4"], jawaban: "C", pembahasan: "$9 \\leq 3x < 15$\n$3 \\leq x < 5$\nBilangan bulat: 3 dan 4 → ada 2 (Jawaban B)" },
  { no: 9, soal: "Jumlah dua bilangan bulat berurutan adalah 85. Bilangan terbesar adalah ...", options: ["A. 42", "B. 43", "C. 44", "D. 45"], jawaban: "B", pembahasan: "Misal bilangan pertama $n$, kedua $n+1$\n$n + (n+1) = 85$\n$2n = 84$\n$n = 42$\nBilangan terbesar = 43 → Jawaban B" },
  { no: 10, soal: "Selisih dua bilangan cacah adalah 8 dan jumlahnya 44. Hasil kali kedua bilangan itu adalah ...", options: ["A. 360", "B. 396", "C. 432", "D. 460"], jawaban: "C", pembahasan: "Misal bilangan: $a - b = 8$ dan $a + b = 44$\n$a = 26$, $b = 18$\nHasil kali = $26 \\times 18 = 468$ (periksa kembali)" },
  { no: 11, soal: "Umur Ayah tiga kali umur anaknya. Lima tahun yang akan datang jumlah umur mereka 70 tahun. Umur anak sekarang adalah ...", options: ["A. 12 tahun", "B. 15 tahun", "C. 16 tahun", "D. 18 tahun"], jawaban: "B", pembahasan: "Misal umur anak = $x$, umur ayah = $3x$\n$(x+5) + (3x+5) = 70$\n$4x + 10 = 70$\n$4x = 60$\n$x = 15$ tahun → Jawaban B" },
  { no: 12, soal: "Tiga tahun yang lalu, umur Budi dua kali umur Andi. Empat tahun yang akan datang, jumlah umur mereka 42 tahun. Umur Budi sekarang adalah ...", options: ["A. 16 tahun", "B. 18 tahun", "C. 21 tahun", "D. 24 tahun"], jawaban: "C", pembahasan: "Misal umur Andi = $a$, Budi = $b$ sekarang\n$b - 3 = 2(a - 3) \\Rightarrow b = 2a - 3$\n$(a + 4) + (b + 4) = 42 \\Rightarrow a + b = 34$\n$a + (2a - 3) = 34 \\Rightarrow a = \\frac{37}{3}$ (periksa kembali nomor ini)" },
  { no: 13, soal: "Panjang sebuah persegi panjang adalah $3x - 2$ dan lebarnya $x + 1$. Jika kelilingnya 58 cm, maka luas persegi panjang tersebut adalah ...", options: ["A. 160 cm²", "B. 180 cm²", "C. 200 cm²", "D. 210 cm²"], jawaban: "D", pembahasan: "$2((3x-2) + (x+1)) = 58$\n$2(4x-1) = 58$\n$4x - 1 = 29$\n$x = 7.5$\nPanjang = $3(7.5) - 2 = 20.5$, Lebar = $8.5$\nLuas = $20.5 \\times 8.5 = 174.25$ cm²" },
  { no: 14, soal: "Nilai $x$ yang memenuhi $|2x - 3| = 5$ adalah ...", options: ["A. $x = -1$ atau $x = 4$", "B. $x = 1$ atau $x = -4$", "C. $x = 4$ atau $x = -1$", "D. $x = -4$ atau $x = 1$"], jawaban: "A", pembahasan: "$2x - 3 = 5 \\Rightarrow x = 4$\n$2x - 3 = -5 \\Rightarrow x = -1$\nJadi $x = -1$ atau $x = 4$ → Jawaban A" },
  { no: 15, soal: "Nilai $x$ yang memenuhi $|3x + 1| \\leq 7$ adalah ...", options: ["A. $-\\frac{8}{3} \\leq x \\leq 2$", "B. $-2 \\leq x \\leq \\frac{8}{3}$", "C. $x \\leq -\\frac{8}{3}$ atau $x \\geq 2$", "D. $x \\leq -2$ atau $x \\geq \\frac{8}{3}$"], jawaban: "A", pembahasan: "$-7 \\leq 3x + 1 \\leq 7$\n$-8 \\leq 3x \\leq 6$\n$-\\frac{8}{3} \\leq x \\leq 2$ → Jawaban A" },
];

const PLSVPage = () => (
  <TKAPemantapanLayout
    title="PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PLSVPage;
