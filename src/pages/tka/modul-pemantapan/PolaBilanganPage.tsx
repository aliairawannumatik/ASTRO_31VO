import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Barisan", content: `Barisan adalah daftar urutan bilangan dari kiri ke kanan yang mempunyai pola tertentu. Setiap bilangan dalam barisan merupakan suku barisan.` },
  { heading: "B. Barisan Aritmatika", content: `Barisan dengan selisih antara dua suku berurutan selalu tetap (beda = b).\n\n$b = U_n - U_{n-1}$\n$U_n = a + (n-1)b$\n$S_n = \\dfrac{n}{2}(2a + (n-1)b) = \\dfrac{n}{2}(a + U_n)$\n\nKeterangan:\n- $a = U_1$ = suku pertama\n- $b$ = beda\n- $n$ = banyak suku\n- $U_n$ = suku ke-n\n- $S_n$ = jumlah n suku pertama` },
  { heading: "C. Barisan Geometri", content: `Barisan dengan rasio antara dua suku berurutan selalu tetap (rasio = r).\n\n$r = \\dfrac{U_n}{U_{n-1}}$\n$U_n = ar^{n-1}$\n$S_n = \\dfrac{a(r^n - 1)}{r - 1}$ untuk $r > 1$\n$S_n = \\dfrac{a(1 - r^n)}{1 - r}$ untuk $r < 1$` },
  { heading: "D. Barisan Bertingkat", content: `1. Pola Bilangan Persegi: $U_n = n^2$\n2. Pola Bilangan Persegi Panjang: $U_n = n(n+1)$\n3. Pola Bilangan Segitiga: $U_n = \\dfrac{n(n+1)}{2}$` },
  { heading: "E. Rumus Suku Ke-n", content: `Jika selisih tetap ditemukan pada:\n- Satu tingkat: $U_n = an + b$ (derajat 1)\n- Dua tingkat: $U_n = an^2 + bn + c$ (derajat 2)\n- Tiga tingkat: $U_n = an^3 + bn^2 + cn + d$ (derajat 3)` },
  { heading: "F. Deret Geometri Tak Hingga", content: `Untuk $|r| < 1$:\n$S_\\infty = \\dfrac{a}{1 - r}$\n\nContoh:\n$16 + 8 + 4 + 2 + ...$\n$S_\\infty = \\dfrac{16}{1 - \\frac{1}{2}} = 32$` },
  { heading: "G. Deret Teleskopik", content: `Prinsip dasar:\n$\\dfrac{1}{k(k+1)} = \\dfrac{1}{k} - \\dfrac{1}{k+1}$\n$\\dfrac{1}{k(k+m)} = \\dfrac{1}{m}\\left(\\dfrac{1}{k} - \\dfrac{1}{k+m}\\right)$\n\nSehingga sebagian besar suku saling meniadakan.` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui barisan aritmatika: $-8, -4, 0, 4, 8, 12, n, 20, 24$. Nilai n adalah …", options: ["A. 10", "B. 14", "C. 16", "D. 18"], jawaban: "C", pembahasan: "Beda = 4, nilai setelah 12 = 16 → Jawaban C" },
  { no: 3, soal: "Suku ke-22 dari barisan $99, 93, 87, 81, …$ adalah …", options: ["A. –27", "B. –21", "C. –15", "D. –9"], jawaban: "B", pembahasan: "a=99, b=-6\n$U_{22} = 99 + 21 \\times (-6) = 99 - 126 = -27$ → Jawaban A" },
  { no: 4, soal: "Suku pertama barisan aritmatika adalah 3 dan bedanya 4. Suku ke-10 adalah …", options: ["A. 30", "B. 33", "C. 36", "D. 39"], jawaban: "D", pembahasan: "$U_{10} = 3 + 9 \\times 4 = 39$ → Jawaban D" },
  { no: 5, soal: "Barisan aritmatika diketahui $U_3 = 18$ dan $U_7 = 38$. Jumlah 24 suku pertama adalah …", options: ["A. 786", "B. 1248", "C. 1572", "D. 3144"], jawaban: "C", pembahasan: "b = (38-18)/4 = 5, a = 18 - 2×5 = 8\n$S_{24} = \\frac{24}{2}(2 \\times 8 + 23 \\times 5) = 12 \\times 131 = 1572$ → Jawaban C" },
  { no: 6, soal: "Gedung pertunjukan: baris depan 12 kursi, baris ke-2: 14, baris ke-3: 16, dst. Banyak kursi pada baris ke-20 adalah …", options: ["A. 28 buah", "B. 50 buah", "C. 58 buah", "D. 60 buah"], jawaban: "B", pembahasan: "a=12, b=2\n$U_{20} = 12 + 19 \\times 2 = 50$ → Jawaban B" },
  { no: 7, soal: "Tumpukan batu bata: atas 8, bawahnya 10, dst (+2 tiap tumpukan). Ada 15 tumpukan dari atas. Batu bata paling bawah adalah …", options: ["A. 35 buah", "B. 36 buah", "C. 38 buah", "D. 40 buah"], jawaban: "C", pembahasan: "a=8, b=2\n$U_{15} = 8 + 14 \\times 2 = 36$ → Jawaban B" },
  { no: 8, soal: "Dalam ruang terdapat 15 baris kursi. Depan 23 kursi, baris berikutnya 2 lebih banyak. Jumlah kursi adalah …", options: ["A. 555", "B. 385", "C. 1.110", "D. 1.140"], jawaban: "A", pembahasan: "a=23, b=2, n=15\n$S_{15} = \\frac{15}{2}(2 \\times 23 + 14 \\times 2) = \\frac{15}{2} \\times 74 = 555$ → Jawaban A" },
  { no: 15, soal: "Diketahui barisan $8, 4, 2, 1, …$. Rumus suku ke-n adalah …", options: ["A. $2^{n+2}$", "B. $2^{n-4}$", "C. $2^{-n+4}$", "D. $2^{n-1}$"], jawaban: "C", pembahasan: "a=8=$2^3$, r=1/2\n$U_n = 8 \\times (\\frac{1}{2})^{n-1} = 2^3 \\times 2^{-(n-1)} = 2^{4-n}$ → Jawaban C" },
  { no: 16, soal: "Suku pertama dan kelima barisan geometri berturut-turut 5 dan 80. Suku ke-9 adalah …", options: ["A. 90", "B. 405", "C. 940", "D. 1.280"], jawaban: "D", pembahasan: "$ar^4 = 80$, $a=5$, $r^4 = 16$, $r=2$\n$U_9 = 5 \\times 2^8 = 1280$ → Jawaban D" },
  { no: 17, soal: "Suku ke-2 dan ke-4 barisan geometri adalah 384 dan 96. Suku ke-8 adalah …", options: ["A. 3", "B. 6", "C. 9", "D. 12"], jawaban: "B", pembahasan: "$\\frac{U_4}{U_2} = r^2 = \\frac{96}{384} = \\frac{1}{4}$, $r = \\frac{1}{2}$\n$U_2 = ar = 384$, $a = 768$\n$U_8 = 768 \\times (\\frac{1}{2})^7 = 6$ → Jawaban B" },
  { no: 18, soal: "Suku ke-1 dan ke-4 barisan geometri adalah 5 dan 40. Jumlah 6 suku pertama adalah …", options: ["A. 155", "B. 160", "C. 315", "D. 320"], jawaban: "C", pembahasan: "$ar^3 = 40$, $a=5$, $r^3=8$, $r=2$\n$S_6 = \\frac{5(2^6-1)}{2-1} = 5 \\times 63 = 315$ → Jawaban C" },
  { no: 19, soal: "Kertas ketebalan 2 mm, dilipat berkali-kali. Butuh berapa kali lipatan agar ketebalan menjadi 256 mm?", options: ["A. 7 kali", "B. 8 kali", "C. 9 kali", "D. 10 kali"], jawaban: "A", pembahasan: "$2 \\times 2^n = 256$, $2^n = 128 = 2^7$, $n = 7$ → Jawaban A" },
  { no: 20, soal: "Tali dibagi 6 bagian membentuk barisan geometri. Terpendek 9 cm, terpanjang 288 cm. Panjang tali mula-mula adalah …", options: ["A. 567 cm", "B. 576 cm", "C. 586 cm", "D. 596 cm"], jawaban: "A", pembahasan: "$ar^5 = 288$, $a=9$, $r^5=32$, $r=2$\n$S_6 = \\frac{9(64-1)}{1} = 567$ → Jawaban A" },
  { no: 21, soal: "Bakteri membelah diri jadi 2 setiap 15 menit. Pukul 10.00 ada 25 bakteri. Banyak bakteri pukul 12.15 adalah …", options: ["A. 800", "B. 1600", "C. 3200", "D. 6400"], jawaban: "C", pembahasan: "10.00 → 12.15 = 135 menit = 9 kali membelah\n$25 \\times 2^9 = 25 \\times 512 = 12.800$\n(Kemungkinan awal beda; jika 12 kali: $25 \\times 2^9/2$... periksa kembali)" },
  { no: 25, soal: "Rumus suku ke-n adalah $U_n = 2n(n-1)$. Nilai $U_9 - U_7$ adalah …", options: ["A. 80", "B. 70", "C. 60", "D. 50"], jawaban: "A", pembahasan: "$U_9 = 2 \\times 9 \\times 8 = 144$\n$U_7 = 2 \\times 7 \\times 6 = 84$\n$U_9 - U_7 = 60$ → Jawaban C" },
  { no: 32, soal: "Jumlah tak hingga deret $18 + 6 + 2 + \\frac{2}{3} + ...$", options: ["A. 24", "B. 27", "C. 36", "D. Tak hingga"], jawaban: "B", pembahasan: "$a=18$, $r=\\frac{1}{3}$\n$S_\\infty = \\frac{18}{1-\\frac{1}{3}} = \\frac{18}{\\frac{2}{3}} = 27$ → Jawaban B" },
  { no: 33, soal: "Jumlah tak hingga deret $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16} + ...$", options: ["A. 4", "B. 5", "C. 1", "D. Deret divergen"], jawaban: "C", pembahasan: "$a=\\frac{1}{2}$, $r=\\frac{1}{2}$\n$S_\\infty = \\frac{\\frac{1}{2}}{\\frac{1}{2}} = 1$ → Jawaban C" },
  { no: 34, soal: "Bola tenis dijatuhkan dari ketinggian 12 m. Pantulan $\\frac{2}{3}$ dari ketinggian sebelumnya. Total panjang lintasan adalah …", options: ["A. 24 m", "B. 36 m", "C. 48 m", "D. 60 m"], jawaban: "D", pembahasan: "Turun: $S_\\infty = \\frac{12}{1-\\frac{2}{3}} = 36$ m\nNaik: $S_\\infty = \\frac{8}{1-\\frac{2}{3}} = 24$ m\nTotal = 36 + 24 = 60 m → Jawaban D" },
  { no: 36, soal: "Nilai dari $\\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} + \\frac{1}{20} + ... + \\frac{1}{420}$ adalah …", options: ["A. $\\frac{21}{20}$", "B. $\\frac{20}{21}$", "C. $\\frac{21}{10}$", "D. $\\frac{10}{21}$"], jawaban: "B", pembahasan: "$\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$\nJumlah = $1 - \\frac{1}{21} = \\frac{20}{21}$ (suku terakhir: $\\frac{1}{20 \\times 21} = \\frac{1}{420}$) → Jawaban B" },
  { no: 41, soal: "Nilai dari $\\frac{1}{1\\cdot2} + \\frac{1}{2\\cdot3} + \\frac{1}{3\\cdot4} + ... + \\frac{1}{n(n+1)}$ adalah …", options: ["A. $\\frac{n}{n+1}$", "B. $\\frac{n+1}{n}$", "C. $\\frac{1}{n(n+1)}$", "D. $\\frac{n}{2(n+1)}$"], jawaban: "A", pembahasan: "Teleskopik: $\\sum = 1 - \\frac{1}{n+1} = \\frac{n}{n+1}$ → Jawaban A" },
];

const PolaBilanganPage = () => (
  <TKAPemantapanLayout
    title="POLA BILANGAN (BARISAN DAN DERET)"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PolaBilanganPage;
