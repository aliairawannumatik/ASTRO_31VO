import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import PembahasanCard from "@/components/PembahasanCard";
import { polaBilanganDasarPembahasan } from "@/data/pembahasan/polaBilanganDasar";
import { polaBilanganOlimpiadePembahasan } from "@/data/pembahasan/polaBilanganOlimpiade";
import imgSukuKenImg from "@assets/image_1777194887222.png";
import imgPolaBuilatan from "@assets/image_1777194992479.png";
import imgPolaSegilima from "@assets/image_1777195046863.png";

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
  title: "MATERI - POLA BILANGAN",
  sections: [
    {
      heading: "A. Barisan",
      content: `Barisan adalah daftar urutan bilangan dari kiri ke kanan yang mempunyai pola tertentu. Setiap bilangan dalam barisan merupakan suku dalam barisan.`
    },
    {
      heading: "B. Barisan Aritmatika",
      content: `Barisan aritmatika adalah barisan dengan selisih antara dua suku yang berurutan selalu tetap. Selisih tersebut dinamakan beda dan dilambangkan dengan "b"

Rumus:
$b = U_n - U_{n-1}$
$U_n = a + (n-1)b$
$U_n = S_n - S_{n-1}$

Deret adalah penjumlahan suku-suku dari suatu barisan. Jika suatu barisan: $U_1, U_2, U_3, ..., U_n$ maka $S_n = U_1 + U_2 + U_3 + ... + U_n$ adalah deret.

Rumus:
$S_n = \\frac{n}{2}(2a + (n-1)b)$
$S_n = \\frac{n}{2}(a + U_n)$

Keterangan:
a = $U_1$ = Suku pertama
b = beda
n = banyak suku
$U_n$ = Suku ke-n
$S_n$ = Jumlah n suku pertama`
    },
    {
      heading: "C. Barisan Geometri",
      content: `Barisan geometri adalah barisan dengan rasio antara dua suku yang berurutan selalu tetap. Rasio tersebut dilambangkan dengan "r".

Rumus:
$r = \\frac{U_n}{U_{n-1}}$
$U_n = ar^{n-1}$

Deret geometri:
$S_n = \\frac{a(r^n - 1)}{r - 1}$ untuk $r > 1$
$S_n = \\frac{a(1 - r^n)}{1 - r}$ untuk $r < 1$

Keterangan:
a = $U_1$ = Suku pertama
r = rasio
n = banyak suku
$U_n$ = Suku ke-n
$S_n$ = Jumlah n suku pertama`
    },
    {
      heading: "D. Barisan Bertingkat",
      content: `1. Pola Bilangan Persegi
$U_n = n^2$

2. Pola Bilangan Persegi Panjang
$U_n = n(n+1)$

3. Pola Bilangan Segitiga
$U_n = \\frac{n(n+1)}{2}$`
    },
    {
      heading: "E. Menentukan Rumus Suku Ke-n dengan Prosedur Matematika",
      content: `Prosedur matematika dapat dilakukan dengan cara mengamati pola selisih suku-suku yang berurutan pada barisan bilangan yang bersangkutan.

Secara umum, jika selisih tetapnya ditemukan pada:
- Satu Tingkat penyelidikan, maka $U_n$ berupa polinom berderajat 1: $U_n = an + b$
- Dua Tingkat penyelidikan, maka $U_n$ berupa polinom berderajat 2: $U_n = an^2 + bn + c$
- Tiga Tingkat penyelidikan, maka $U_n$ berupa polinom berderajat 3: $U_n = an^3 + bn^2 + cn + d$

Contoh:
Tentukan rumus ke-n dari barisan 0, 1, 3, 6, 10, 15
Jawab: $U_n = \\frac{1}{2}n(n-1)$`
    },
    {
      heading: "F. Deret Geometri Tak Hingga",
      content: `Deret geometri tak hingga adalah suatu deret geometri dengan banyak unsur atau suku-sukunya tak hingga.

Bentuk umum:
$S_\\infty = a + ar + ar^2 + ... + ar^{n-1} + ar^n + ...$

Kesimpulan:
- Untuk $|r| < 1$ dan $a \\neq 0$ (deret konvergen): $S_\\infty = \\frac{a}{1-r}$
- Untuk $|r| \\geq 1$ dan $a \\neq 0$ (deret divergen): tidak terdefinisi

Contoh:
a. 16, 8, 4, 2, ...
$S_\\infty = \\frac{16}{1 - \\frac{1}{2}} = \\frac{16}{\\frac{1}{2}} = 32$

b. 27, -9, 3, -1, ...
$S_\\infty = \\frac{27}{1 - (-\\frac{1}{3})} = \\frac{27}{\\frac{4}{3}} = 20\\frac{1}{4}$`
    },
    {
      heading: "G. Deret Teleskopik",
      content: `Deret teleskopik adalah jenis deret (penjumlahan suku-suku) yang sebagian besar sukunya saling meniadakan ketika dijumlahkan, sehingga hanya menyisakan sedikit suku untuk dihitung.

Prinsip Teleskopik:

a. Bentuk penjumlahan:
$\\sum_{i=1}^{n}(P_i - P_{i+1}) = P_1 - P_{n+1}$

b. Bentuk perkalian:
$\\prod_{i=1}^{n}\\frac{P_i}{P_{i+1}} = \\frac{P_1}{P_{n+1}}$

Konsep dasar:
$\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$
$\\frac{1}{k(k+m)} = \\frac{1}{m}\\left(\\frac{1}{k} - \\frac{1}{k+m}\\right)$`
    },
    {
      heading: "H. Barisan Satu dan Dua Tingkat",
      content: `1. Terdiri atas satu larik
Deret yang terdiri atas satu larik, antar suku saling berhubungan langsung dengan beda barisan b.

2. Terdiri atas dua larik
Barisan yang terdiri atas dua larik, suku-suku larik satu mempunyai pola dengan beda b1 dan suku-suku larik dua mempunyai pola dengan beda b2.

3. Terdiri atas tiga larik
Barisan yang terdiri atas tiga larik, suku-suku larik satu mempunyai pola dengan beda b1, suku-suku larik dua mempunyai pola dengan beda b2 dan suku-suku larik tiga mempunyai pola dengan beda b3.

Contoh:
5, 10, 20, 30, 80, 90, 320, 270, ..., ...
Jawab: 1280, 810`
    }
  ]
};

const latihanDasar = [
  { no: 1, soal: "Diketahui barisan bilangan aritmetika sebagai berikut.\n$-8, -4, 0, 4, 8, 12, n, 20, 24$\nNilai n yang memenuhi adalah ....", options: ["A. 10", "B. 14", "C. 16", "D. 18"] },
  { no: 2, soal: "Tiga suku berikutnya dari 1, 3, 5, 8, 9, 13, …, …., … adalah ....", options: ["A. 13, 18, 17", "B. 13, 17, 18", "C. 14, 17, 18", "D. 14, 18, 18"] },
  { no: 3, soal: "Suku ke-22 dari barisan 99, 93, 87, 81, … adalah ....", options: ["A. –27", "B. –21", "C. –15", "D. –9"] },
  { no: 4, soal: "Suku pertama dari barisan aritmatika adalah 3 dan bedanya 4, suku ke-10 dari barisan aritmatika tersebut adalah ....", options: ["A. 30", "B. 33", "C. 36", "D. 39"] },
  { no: 5, soal: "Dari barisan aritmetika diketahui $U_3 = 18$ dan $U_7 = 38$. Jumlah 24 suku pertama adalah ....", options: ["A. 786", "B. 1248", "C. 1572", "D. 3144"] },
  { no: 6, soal: "Dalam gedung pertunjukkan disusun kursi dengan baris paling depan terdiri dari 12 buah, baris kedua berisi 14 buah, baris ketiga 16 buah dan seterusnya selalu bertambah 2. Banyaknya kursi pada baris ke-20 adalah ....", options: ["A. 28 buah", "B. 50 buah", "C. 58 buah", "D. 60 buah"] },
  { no: 7, soal: "Pada tumpukan batu bata, banyak batu bata paling atas ada 8 buah, tepat di bawahnya ada 10 buah, dan seterusnya setiap tumpukan di bawahnya selalu lebih banyak 2 buah dari tumpukan di atasnya. Jika ada 15 tumpukan batu bata (dari atas sampai bawah), berapa banyak batu bata pada tumpukan paling bawah?", options: ["A. 35 buah", "B. 36 buah", "C. 38 buah", "D. 40 buah"] },
  { no: 8, soal: "Dalam suatu ruang terdapat 15 baris kursi, baris paling depan terdapat 23 kursi, baris berikutnya 2 kursi lebih banyak dari baris di depannya. Jumlah kursi dalam ruang tersebut adalah ....", options: ["A. 555", "B. 385", "C. 1.110", "D. 1.140"] },
  { no: 9, soal: "Permintaan suatu produk barang diperkirakan mengalami kenaikan 5.000 unit setiap bulan. Jika jumlah produk pertamanya 100.000, maka jumlah produk selama satu tahun pertama adalah ....", options: ["A. 1.205.000 unit", "B. 1.255.000 unit", "C. 1.260.000 unit", "D. 1.530.000 unit", "E. 1.560.000 unit"] },
  { no: 10, soal: "Diketahui barisan aritmatika, suku ke-7 dan suku ke-4 adalah 26 dan 14. Jika $U_n$ menyatakan suku ke-n dan $S_n$ menyatakan jumlah sampai n suku pertama, pernyataan yang benar adalah ....", options: ["A. $U_{30} = 108$", "B. $U_{35} = 158$", "C. $S_{15} = 450$", "D. $S_{20} = 1.600$"] },
  { no: 11, soal: "Tentukan jumlah semua bilangan asli antara 200 dan 400 yang habis dibagi 4 dan habis dibagi 6.", options: ["A. 3.000", "B. 3.200", "C. 3.600", "D. 3.800"] },
  { no: 12, soal: "Berapakah jumlah semua bilangan bulat dari 100 sampai 500 yang habis dibagi 8 dan habis dibagi 12?", options: ["A. 3.000", "B. 3.120", "C. 3.360", "D. 3.600"] },
  { no: 13, soal: "Tentukan jumlah semua bilangan asli antara 100 dan 300 yang habis dibagi 7 tetapi tidak habis dibagi 5.", options: ["A. 3.424", "B. 3.696", "C. 4.060", "D. 4.200"] },
  { no: 14, soal: "Diberikan deret bilangan bulat positif: 1, 2, 3, …, 200. Tentukan jumlah bilangan dalam deret tersebut yang habis dibagi 4 tetapi tidak habis dibagi 10.", options: ["A. 4.000", "B. 4.200", "C. 4.400", "D. 4.800"] },
  { no: 15, soal: "Diketahui barisan bilangan 8, 4, 2, 1, …. Rumus suku ke-n barisan tersebut adalah ....", options: ["A. $2^{n+2}$", "B. $2^{n-4}$", "C. $2^{-n+4}$", "D. $2^{n-1}$"] },
  { no: 16, soal: "Suku pertama dan kelima suatu barisan geometri berturut-turut 5 dan 80. Suku ke-9 barisan geometri tersebut adalah ....", options: ["A. 90", "B. 405", "C. 940", "D. 1.280"] },
  { no: 17, soal: "Suku ke-2 dan ke-4 barisan geometri adalah 384 dan 96. Suku ke-8 barisan tersebut adalah ....", options: ["A. 3", "B. 6", "C. 9", "D. 12"] },
  { no: 18, soal: "Suku ke-1 dan suku ke-4 barisan geometri adalah 5 dan 40. Jumlah 6 suku pertama dari barisan tersebut adalah ....", options: ["A. 155", "B. 160", "C. 315", "D. 320"] },
  { no: 19, soal: "Celin melipat-lipat kertas berkali-kali. Jika ketebalan kertas mula-mula 2 mm, maka butuh berapa kali lipatan sehingga ketebalan kertas menjadi 256 mm?", options: ["A. 7 kali", "B. 8 kali", "C. 9 kali", "D. 10 kali"] },
  { no: 20, soal: "Seutas tali dibagi menjadi enam bagian, sehingga bagian-bagiannya membentuk barisan geometri. Jika panjang tali terpendek 9 cm dan panjang tali terpanjang 288 cm, maka panjang tali mula-mula adalah ....", options: ["A. 567 cm", "B. 576 cm", "C. 586 cm", "D. 596 cm"] },
  { no: 21, soal: "Setiap bakteri akan membelah diri menjadi 2 setiap 15 menit. Jika banyak bakteri pada pukul 10.00 ada 25 buah, maka banyak bakteri pada pukul 12.15 adalah ....", options: ["A. 800", "B. 1600", "C. 3200", "D. 6400"] },
  { no: 22, soal: "Suku ke-14 barisan 15, 24, 35, 48, 63, … adalah ....", options: ["A. 185", "B. 194", "C. 288", "D. 312"] },
  { no: 23, soal: "Suku ke-40 dari 3, 5, 9, 15, 23, … adalah ....", options: ["A. 1560", "B. 1563", "C. 1600", "D. 1603"] },
  { no: 24, soal: "Tiga suku berikutnya dari 1, 3, 6, 7, 11, 11, … adalah ....", options: ["A. 13, 18, 17", "B. 13, 17, 18", "C. 16, 15, 21", "D. 16, 15, 20"] },
  { no: 25, soal: "Rumus suku ke-n barisan adalah $U_n = 2n(n-1)$. Hasil dari $U_9 - U_7$ adalah ....", options: ["A. 80", "B. 70", "C. 60", "D. 50"] },
  { no: 26, soal: "Rumus suku ke-n dari barisan bilangan 0, 4, 10, 18, … adalah ....", options: ["A. $\\frac{1}{2}n(n+1)$", "B. $2n(n+1)$", "C. $(n-1)(n+2)$", "D. $(n+1)(n+2)$"] },
  { no: 27, soal: "Perhatikan gambar berikut!\nBanyak persegi satuan pada pola ke-19 adalah ....", options: ["A. 36", "B. 38", "C. 40", "D. 42"] },
  { no: 28, soal: "Perhatikan gambar pola berikut.\nBanyak lingkaran pada pola ke-15 adalah ....", options: ["A. 105", "B. 120", "C. 210", "D. 240"] },
  { no: 29, soal: "Gambar berikut adalah pola segitiga.\nBanyak segitiga satu-satuan pada pola ke-7 adalah ....", options: ["A. 28", "B. 36", "C. 42", "D. 49"] },
  { no: 30, soal: "Perhatikan gambar pola berikut!\nBanyak lingkaran pada pola ke-10 adalah ....", options: ["A. 99 buah", "B. 104 buah", "C. 115 buah", "D. 120 buah"] },
  { no: 31, soal: "Perhatikanlah pola berikut.\nBanyak lingkaran pada pola ke-30 adalah ....", options: ["A. 39", "B. 41", "C. 57", "D. 59"] },
  { no: 32, soal: "Hitunglah jumlah tak hingga dari deret geometri berikut:\n$18 + 6 + 2 + \\frac{2}{3} + ...$", options: ["A. 24", "B. 27", "C. 36", "D. Tak hingga"] },
  { no: 33, soal: "Jumlah tak hingga dari deret:\n$\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16} + ...$", options: ["A. 4", "B. 5", "C. 1", "D. Deret divergen (tidak memiliki jumlah)"] },
  { no: 34, soal: "Sebuah bola tenis dijatuhkan dari ketinggian 12 meter. Setelah menyentuh lantai, bola memantul kembali dengan ketinggian $\\frac{2}{3}$ dari ketinggian sebelumnya. Pantulan ini terjadi terus-menerus hingga bola berhenti. Total panjang lintasan yang ditempuh bola tersebut adalah ....", options: ["A. 24 m", "B. 36 m", "C. 48 m", "D. 60 m"] },
  { no: 35, soal: "Bentuk sederhana dari $\\left(1-\\frac{1}{2^2}\\right)\\left(1-\\frac{1}{3^2}\\right)\\left(1-\\frac{1}{4^2}\\right)...\\left(1-\\frac{1}{2022^2}\\right)$ adalah ....", options: ["A. $\\frac{2023}{4044}$", "B. $\\frac{1011}{2022}$", "C. $\\frac{2023}{2022}$", "D. $\\frac{1}{4044}$"] },
  { no: 36, soal: "Nilai dari $\\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} + \\frac{1}{20} + ... + \\frac{1}{420}$ adalah ....", options: ["A. $\\frac{21}{20}$", "B. $\\frac{20}{21}$", "C. $\\frac{21}{10}$", "D. $\\frac{10}{21}$"] },
  { no: 37, soal: "Nilai dari $\\frac{1}{1 \\cdot 4} + \\frac{1}{4 \\cdot 7} + \\frac{1}{7 \\cdot 10} + ... + \\frac{1}{1999 \\cdot 2002}$ adalah ....", options: ["A. $\\frac{1}{3}$", "B. $\\frac{667}{2002}$", "C. $\\frac{2001}{6006}$", "D. $\\frac{1}{2002}$"] },
  { no: 38, soal: "Perhatikan persamaan berikut.\n$(2+1)(2^2+1)(2^4+1)(2^8+1)...(2^{2048}+1) = 2^a - b$\nNilai a dan b yang memenuhi persamaan tersebut adalah ....", options: ["A. $a = 4096,\\ b = 1$", "B. $a = 2048,\\ b = 1$", "C. $a = 4096,\\ b = 3$", "D. $a = 4095,\\ b = 1$"] },
  { no: 39, soal: "Hasil dari $\\sqrt{1+\\frac{1}{3}} \\cdot \\sqrt{1+\\frac{1}{4}} \\cdot \\sqrt{1+\\frac{1}{5}} \\cdot ... \\cdot \\sqrt{1+\\frac{1}{2018}}$ adalah ....", options: ["A. $\\sqrt{672}$", "B. $\\sqrt{673}$", "C. $\\sqrt{2018}$", "D. $\\sqrt{2019}$"] },
  { no: 40, soal: "Perhatikan bentuk berikut:\n$\\left(1-\\frac{1}{4}\\right)\\left(1-\\frac{1}{9}\\right)\\left(1-\\frac{1}{16}\\right)...\\left(1-\\frac{1}{n^2}\\right)$\nNilai dari bentuk di atas adalah ....", options: ["A. $\\frac{n+1}{2n}$", "B. $\\frac{n+1}{2}$", "C. $\\frac{n}{2(n+1)}$", "D. $\\frac{2n}{n+1}$"] },
  { no: 41, soal: "Nilai dari $\\frac{1}{1 \\cdot 2} + \\frac{1}{2 \\cdot 3} + \\frac{1}{3 \\cdot 4} + ... + \\frac{1}{n(n+1)}$ adalah ....", options: ["A. $\\frac{n}{n+1}$", "B. $\\frac{n+1}{n}$", "C. $\\frac{1}{n(n+1)}$", "D. $\\frac{n}{2(n+1)}$"] },
  { no: 42, soal: "Tentukan nilai dari\n$\\frac{1}{1} + \\frac{1}{1+2} + \\frac{1}{1+2+3} + \\frac{1}{1+2+3+4} + ... + \\frac{1}{1+2+3+...+2024}$", options: ["A. $\\frac{4048}{2025}$", "B. $\\frac{2024}{2025}$", "C. $\\frac{4048}{2024}$", "D. $\\frac{2023}{2025}$"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nPerhatikan gambar berikut (pola bulatan). Banyaknya bulatan hitam pada gambar kesepuluh nantinya adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2004 Tingkat Kota\nJumlah 101 bilangan bulat berurutan adalah 101. Berapakah bilangan bulat yang terbesar di dalam barisan tersebut.", options: ["A. 51", "B. 56", "C. 100", "D. 101", "E. 150"] },
  { no: 3, soal: "OSN Matematika 2005 Tingkat Kota\nPerhatikan 3 barisan enam bilangan berikut.\n(1) 8, 16, 32, 128 dan 256\n(2) 7, 11, 16, 22, 29 dan 37\n(3) 2, 9, 2, 16, 2 dan 25\nManakah dari 3 barisan tersebut yang mungkin menjadi 6 suku berikutnya dari suatu barisan bilangan yang tiga suku pertamanya adalah 1, 2 dan 4", options: ["A. (1)", "B. (2)", "C. (3)", "D. (1) dan (2)", "E. Semua"] },
  { no: 4, soal: "OSN Matematika 2005 Tingkat Kota\nBilangan segitiga adalah bilangan yang berbentuk $\\frac{n(n+1)}{2}$, dengan n adalah bilangan asli. Banyaknya bilangan segitiga yang kurang dari 100 adalah ...", options: ["A. 8", "B. 9", "C. 10", "D. 13", "E. 15"] },
  { no: 5, soal: "OSN Matematika 2006 Tingkat Kota\nBanyaknya bilangan bulat dari -1006 sampai 2006 yang merupakan kelipatan 3 tetapi bukan kelipatan 6 adalah ...", options: ["A. 500 bilangan", "B. 501 bilangan", "C. 502 bilangan", "D. 503 bilangan", "E. 504 bilangan"] },
  { no: 6, soal: "OSN Matematika 2006 Tingkat Kota\nBilangan asli n terbesar sehingga jumlah $1 + 3 + 5 + ... + (2n - 1)$ lebih kecil dari 2006 adalah ...", options: [] },
  { no: 7, soal: "OSN Matematika 2007 Tingkat Kota\nSuatu barisan hanya terdiri dari bilangan 1, 2, 3, 4 dan 5. Jika barisan tersebut adalah 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, ..., maka suku ke-100 dari bilangan barisan tersebut adalah...", options: ["A. 1", "B. 2", "C. 3", "D. 4", "E. 5"] },
  { no: 8, soal: "OSN Matematika 2008 Tingkat Kota\nFachmy menghitung mulai dari 1.000, kemudian bertambah 8 menjadi 1.008, 1.016, 1.024, 1.032 ... sedangkan, Zeldy menghitung mulai dari 2.008, berkurang 4 menjadi 2.004, 2.000, 1.996, 1.992, ... Bilangan tepat sama saat mereka menghitung bersama-sama adalah...", options: ["A. 1.672", "B. 1.664", "C. 1.656", "D. 1.648"] },
  { no: 9, soal: "OSN Matematika 2008 Tingkat Kota\nHuruf ke-2008 dari pola O, L, I, M, P, I, A, D, E, S, A, I, N, S, O, L, I, M, P, I, A, D, E, S, A, I, N, S, ... adalah ...", options: ["A. A", "B. D", "C. E", "D. I", "E. M"] },
  { no: 10, soal: "OSN Matematika 2008 Tingkat Kota\nSuatu deret aritmetika mempunyai suku pertama a dan beda 10. Jumlah n suku pertama adalah 10.000. Jika suku ke-n kurang dari 500, maka nilai n terbesar yang mungkin adalah ...", options: ["A. 73", "B. 72", "C. 71", "D. 70", "E. 69"] },
  { no: 11, soal: "OSN Matematika 2009 Tingkat Kota\nJika a, b, 15, c dan d membentuk barisan aritmetika, maka $a + b + c + d$ = ...", options: ["A. 45", "B. 60", "C. 75", "D. 90"] },
  { no: 12, soal: "OSN Matematika 2009 Tingkat Kota\nJumlah 2009 bilangan bulat berurutan sama dengan 6027, maka selisih bilangan terkecil dan terbesar sama dengan ...", options: [] },
  { no: 13, soal: "OSN Matematika 2010 Tingkat Kota\nJika diberikan $S_n = 1 - 2 + 3 - 4 + ... + (-1)^{n-1}n$ dengan n bilangan asli, maka nilai $S_{17} + S_{18} + S_{45}$ adalah ...", options: ["A. -5", "B. 0", "C. 17", "D. 28", "E. 30"] },
  { no: 14, soal: "OSN Matematika 2010 Tingkat Kota\nJika jumlah k bilangan bulat positif berurutan adalah 2010, dengan k > 1, maka k terkecil yang mungkin adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2010 Tingkat Kota\nJika bilangan ganjil dikelompokkan seperti: {1}, {3, 5}, {7, 9, 11}, {13, 15, 17, 19}, maka suku tengah dari kelompok ke-11 adalah ...", options: ["A. 21", "B. 31", "C. 61", "D. 111", "E. 121"] },
  { no: 16, soal: "OSN Matematika 2011 Tingkat Kota\nNilai jumlahan bilangan berikut adalah ...\n$1^2 - 2^2 + 3^2 - 4^2 + 5^2 - ... - 2010^2 + 2011^2$", options: [] },
  { no: 17, soal: "OSN Matematika 2011 Tingkat Kota\nJika barisan $x_1, x_2, x_3, ...$ memenuhi $x_1 + x_2 + x_3 + ... + x_n = n^3$ untuk semua n bilangan asli, maka $x_{100}$ = ...", options: [] },
  { no: 18, soal: "OSN Matematika 2012 Tingkat Kota\nJika 2, 3, 5, 6, 7, 10, 11, ... adalah barisan yang terdiri dari semua bilangan asli yang bukan bilangan kuadrat dan bukan bilangan pangkat tiga, maka bilangan 270 adalah suku ke ...", options: ["A. 247", "B. 248", "C. 249", "D. 250", "E. 251"] },
  { no: 19, soal: "OSN Matematika 2013 Tingkat Kota\nJika barisan berikut adalah barisan bilangan bulat positif berurutan yang dihilangkan semua kelipatan tiga: 1, 2, 4, 5, 7, 8, 10, 11, 13, 14, ... maka suku ke-67 barisan tersebut adalah ...", options: ["A. 59", "B. 62", "C. 86", "D. 92", "E. 100"] },
  { no: 20, soal: "OSN Matematika 2013 Tingkat Kota\nJika $S_1 = 1$, $S_2 = S_1 - 3$, $S_3 = S_2 + 5$, $S_4 = S_3 - 7$, $S_5 = S_4 + 9$, ... adalah suku-suku suatu barisan bilangan, maka $S_{2013}$ = ...", options: [] },
  { no: 21, soal: "OSN Matematika 2014 Tingkat Kota\nSegitiga ABC adalah segitiga sama sisi dengan panjang sisi-sisinya 2 satuan. Selanjutnya, dibentuk segitiga kedua dengan menghubungkan tiga titik tengah pada masing-masing sisi segitiga ABC. Dengan cara serupa dibentuk segitiga ketiga, keempat, kelima, keenam, dan seterusnya. Luas seluruh segitiga-segitiga tersebut adalah ...", options: ["A. $\\frac{\\sqrt{3}}{3}$", "B. $\\frac{2\\sqrt{3}}{3}$", "C. $\\frac{4\\sqrt{3}}{3}$", "D. $\\frac{5\\sqrt{3}}{3}$"] },
  { no: 22, soal: "OSN Matematika 2015 Tingkat Kota\nJika jumlah empat suku pertama suatu barisan aritmetika adalah 70 dan jumlah 12 suku berikutnya adalah 690, maka suku ke-2015 barisan tersebut adalah ...", options: [] },
  { no: 23, soal: "OSN Matematika 2016 Tingkat Kota\nDiketahui suatu barisan dengan suku ke-n adalah $a_n$, dengan\n$a_n = \\begin{cases} \\frac{3}{2} & \\text{untuk } n = 2k \\\\ \\frac{5-1}{2} & \\text{untuk } n = 2k-1 \\end{cases}$\nJumlah seratus suku pertama barisan tersebut adalah ...", options: [] },
  { no: 24, soal: "OSN Matematika 2017 Tingkat Kota\nNilai $1 + 2 \\cdot 2 + 3 \\cdot 2^2 + 4 \\cdot 2^3 + ... + 2018 \\cdot 2^{2017}$ sama dengan ...", options: [] },
  { no: 25, soal: "OSN Matematika 2018 Tingkat Kota\nMisalkan $U_n$ dan $S_n$ masing-masing menyatakan suku ke-n dan jumlah suku ke-n pertama suatu barisan. Jika $S_n = \\frac{n^2 - n}{2}$, maka $U_2 - U_4 + U_6 - ...$ = ...", options: ["A. $\\frac{6}{32}$", "B. $\\frac{11}{32}$", "C. $\\frac{1}{2}$", "D. $\\frac{21}{32}$"] },
  { no: 26, soal: "OSN Matematika 2019 Tingkat Kota\nBilangan tadutima adalah bilangan bulat positif yang bukan kelipatan 2, 3, atau 5. Banyak bilangan bulat positif kurang dari 1001 yang merupakan bilangan tadutima adalah ...", options: ["A. 333", "B. 266", "C. 233", "D. 167"] },
  { no: 27, soal: "OSN Matematika 2019 Tingkat Kota\nDiketahui 20 suku pertama suatu barisan aritmetika adalah 1390. Jika suku pertama dari barisan tersebut adalah 3, selisih dari dua suku berurutan di barisan tersebut adalah ...", options: ["A. 7", "B. 17", "C. 21", "D. 24"] },
  { no: 28, soal: "OSN Matematika 2020 Tingkat Kota\nJumlah n suku pertama suatu deret aritmetika adalah 450. Jika suku pertama adalah n dan suku ke-n adalah 3, maka selisih barisan tersebut adalah ...", options: ["A. $\\frac{13}{7}$", "B. $\\frac{15}{7}$", "C. $\\frac{13}{11}$", "D. $\\frac{15}{11}$"] },
  { no: 29, soal: "OSN Matematika 2020 Tingkat Kota\nPerhatikan barisan bilangan berikut.\n1, 2, 4, 8, 15, 26, ?, ?, ?, ...\nTiga bilangan selanjutnya berturut-turut adalah ...", options: ["A. 37, 49, 71", "B. 37, 61, 99", "C. 42, 58, 74", "D. 42, 64, 93"] },
  { no: 30, soal: "OSN Matematika 2021 Tingkat Kota\nMisalkan B menyatakan barisan bilangan bulat yang suku-sukunya $b_1, b_2, b_3, b_4, ...$ dan f(B) menyatakan barisan bilangan bulat yang suku-sukunya $b_1 - b_2, b_2 - b_3, b_3 - b_4, ...$ Jika semua suku dari barisan f(f(B)) adalah bilangan bulat c, dengan c = 3, dan diketahui $b_{21} \\times b_{42} = b_{21} + b_{42} = 0$, maka nilai dari $b_2$ adalah ...", options: ["A. 90", "B. 760", "C. 1140", "D. 1230"] },
  { no: 31, soal: "OSN Matematika 2022 Tingkat Kota\nDiketahui suatu barisan aritmetika $a_1, a_2, a_3, ...$ dengan semua sukunya bilangan bulat, $a_1$ habis dibagi 3, $a_2$ habis dibagi 5 dan $a_3$ habis dibagi 7. Jika $a_1 + a_2 + a_3 = 405$ dan $a_1 > 105$, maka nilai k terkecil sedemikian $a_k > 1000$ adalah ...", options: ["A. 74", "B. 75", "C. 76", "D. 77"] },
  { no: 32, soal: "OSN Matematika 2022 Tingkat Kota\nPerhatikan persamaan berikut.\n$x^{2023} - x^{2021} - x^{2019} - ... - x^3 = 2x$\nJumlah dari kuadrat akar-akar real persamaan tersebut adalah ...", options: ["A. 0", "B. 4", "C. 6", "D. 9"] },
  { no: 33, soal: "OSN Matematika 2024 Tingkat Kota\nSuatu bilangan bulat positif n disebut JUMPAT jika jumlah n bilangan bulat positif pertama dapat dinyatakan sebagai penjumlahan empat bilangan bulat positif berurutan. Banyaknya bilangan JUMPAT yang kurang dari 2024 adalah ...", options: ["A. 252", "B. 253", "C. 504", "D. 505"] },
  { no: 34, soal: "OSN Matematika 2025 Tingkat Kota\nDiketahui barisan geometri\n80, x, y, z, 3125\nNilai terkecil yang mungkin dari $x - y + z$ adalah ...", options: ["A. -3120", "B. -1950", "C. 480", "D. 950"] },
  { no: 35, soal: "OSN Matematika 2025 Tingkat Kota\nEnam bilangan prima kurang dari 160 membentuk barisan aritmetika dengan beda lebih dari 1. Jumlah ke enam bilangan tersebut adalah ...", options: ["A. 240", "B. 300", "C. 492", "D. 926"] },
  { no: 36, soal: "OSN Matematika 2025 Tingkat Kota\nPerhatikan barisan bilangan berikut:\n1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, ...\nSuku-suku barisan tersebut diperoleh dari semua bilangan bulat positif dengan menghilangkan semua kelipatan 5. Suku ke-2025 dari barisan tersebut adalah ...", options: ["A. 2430", "B. 2530", "C. 2531", "D. 2532"] },
  { no: 37, soal: "OSN Matematika 2025 Tingkat Kota\nBilangan segilima ke-n adalah banyaknya titik yang membentuk n segilima. Bilangan segilima ke-0 adalah 1, bilangan segilima ke-1 adalah 5, bilangan segilima ke-2 adalah 12, dan bilangan segilima ke-3 adalah 22. Bilangan segilima yang paling dekat dengan 2025 adalah bilangan segilima ke-...", options: ["A. 30", "B. 33", "C. 36", "D. 39"] },
];

const dotColor = "#5b9ec9";
const dotR = 5;
const sp = 14;

const PolaPersegiSVG = () => {
  const patterns = [
    { n: 1, label: "1" },
    { n: 2, label: "4" },
    { n: 3, label: "9" },
    { n: 4, label: "16" },
    { n: 5, label: "25" },
  ];
  const gap = 18;
  let curX = 10;
  const positions: number[] = [];
  for (const p of patterns) {
    positions.push(curX);
    curX += p.n * sp + gap;
  }
  const maxH = patterns[patterns.length - 1].n * sp;
  const totalW = curX - gap + 10;
  const svgH = maxH + 44;
  return (
    <svg width={totalW} height={svgH}>
      {patterns.map((p, i) => {
        const x = positions[i];
        const h = p.n * sp;
        const offsetY = 10 + maxH - h;
        const dots: ReactNode[] = [];
        for (let r = 0; r < p.n; r++) {
          for (let c = 0; c < p.n; c++) {
            dots.push(<circle key={`${r}-${c}`} cx={x + c * sp + dotR} cy={offsetY + r * sp + dotR} r={dotR} fill={dotColor} />);
          }
        }
        return (
          <g key={i}>
            {dots}
            <text x={x + (p.n * sp) / 2} y={10 + maxH + 22} textAnchor="middle" fill="#ffffffcc" fontSize="12" fontFamily="sans-serif">{p.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const PolaPersegiPanjangSVG = () => {
  const patterns = [
    { rows: 1, cols: 2, label: "2" },
    { rows: 2, cols: 3, label: "6" },
    { rows: 3, cols: 4, label: "12" },
    { rows: 4, cols: 5, label: "20" },
  ];
  const gap = 18;
  let curX = 10;
  const positions: number[] = [];
  for (const p of patterns) {
    positions.push(curX);
    curX += p.cols * sp + gap;
  }
  const maxH = patterns[patterns.length - 1].rows * sp;
  const totalW = curX - gap + 10;
  const svgH = maxH + 44;
  return (
    <svg width={totalW} height={svgH}>
      {patterns.map((p, i) => {
        const x = positions[i];
        const h = p.rows * sp;
        const offsetY = 10 + maxH - h;
        const dots: ReactNode[] = [];
        for (let r = 0; r < p.rows; r++) {
          for (let c = 0; c < p.cols; c++) {
            dots.push(<circle key={`${r}-${c}`} cx={x + c * sp + dotR} cy={offsetY + r * sp + dotR} r={dotR} fill={dotColor} />);
          }
        }
        return (
          <g key={i}>
            {dots}
            <text x={x + (p.cols * sp) / 2} y={10 + maxH + 22} textAnchor="middle" fill="#ffffffcc" fontSize="12" fontFamily="sans-serif">{p.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const PolaSegitigaSVG = () => {
  const patterns = [
    { rows: 1, label: "1" },
    { rows: 2, label: "3" },
    { rows: 3, label: "6" },
    { rows: 4, label: "10" },
    { rows: 5, label: "15" },
  ];
  const gap = 18;
  let curX = 10;
  const positions: number[] = [];
  for (const p of patterns) {
    positions.push(curX);
    curX += p.rows * sp + gap;
  }
  const maxH = patterns[patterns.length - 1].rows * sp;
  const totalW = curX - gap + 30;
  const svgH = maxH + 44;
  return (
    <svg width={totalW} height={svgH}>
      {patterns.map((p, i) => {
        const x = positions[i];
        const bboxW = p.rows * sp;
        const h = p.rows * sp;
        const offsetY = 10 + maxH - h;
        const dots: ReactNode[] = [];
        for (let r = 0; r < p.rows; r++) {
          const numDots = r + 1;
          const rowW = numDots * sp;
          const rowOffsetX = (bboxW - rowW) / 2;
          for (let c = 0; c < numDots; c++) {
            dots.push(<circle key={`${r}-${c}`} cx={x + rowOffsetX + c * sp + dotR} cy={offsetY + r * sp + dotR} r={dotR} fill={dotColor} />);
          }
        }
        return (
          <g key={i}>
            {dots}
            <text x={x + bboxW / 2} y={10 + maxH + 22} textAnchor="middle" fill="#ffffffcc" fontSize="12" fontFamily="sans-serif">{p.label}</text>
          </g>
        );
      })}
      <text x={curX - gap + 8} y={10 + maxH / 2 + dotR} fill="#ffffff99" fontSize="16" fontFamily="sans-serif">...</text>
    </svg>
  );
};

// Soal 27: Persegi satuan in 2-row rectangular grids (2×2, 2×3, 2×4)
const Soal27SVG = () => {
  const sq = 18;
  const gap = 22;
  const patterns = [{ cols: 2 }, { cols: 3 }, { cols: 4 }];
  let curX = 8;
  const positions: number[] = [];
  for (const p of patterns) { positions.push(curX); curX += p.cols * sq + gap; }
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={2 * sq + 12}>
      {patterns.map((p, i) => {
        const x = positions[i];
        const rects: ReactNode[] = [];
        for (let r = 0; r < 2; r++)
          for (let c = 0; c < p.cols; c++)
            rects.push(<rect key={`${r}-${c}`} x={x + c * sq} y={6 + r * sq} width={sq} height={sq} fill="#5b9ec9" stroke="white" strokeWidth="1.5" rx="1" />);
        return <g key={i}>{rects}</g>;
      })}
    </svg>
  );
};

// Soal 28: Circles in bowling-pin triangle (n=1,2,3,4) — triangular numbers
const Soal28SVG = () => {
  const r = 7;
  const sp = 17;
  const patterns = [1, 2, 3, 4];
  const gap = 22;
  let curX = 8;
  const positions: number[] = [];
  for (const n of patterns) { positions.push(curX); curX += n * sp + gap; }
  const maxH = 4 * sp;
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={maxH + 30}>
      {patterns.map((n, i) => {
        const x = positions[i];
        const patW = n * sp;
        const circles: ReactNode[] = [];
        for (let row = 0; row < n; row++) {
          const num = n - row;
          const rowOffsetX = (patW - num * sp) / 2;
          const cy = 8 + maxH - (row + 1) * sp + sp / 2;
          for (let c = 0; c < num; c++)
            circles.push(<circle key={`${row}-${c}`} cx={x + rowOffsetX + c * sp + sp / 2} cy={cy} r={r} fill="none" stroke="#5b9ec9" strokeWidth="1.5" />);
        }
        return (
          <g key={i}>
            {circles}
            <text x={x + patW / 2} y={8 + maxH + 20} textAnchor="middle" fill="#ffffffcc" fontSize="12" fontFamily="sans-serif">{n}</text>
          </g>
        );
      })}
    </svg>
  );
};

// Soal 29: Equilateral triangles subdivided into n² small triangles (n=1,2,3,4)
const Soal29SVG = () => {
  const unit = 20;
  const HR = Math.sqrt(3) / 2;
  const patterns = [1, 2, 3, 4];
  const gap = 22;
  let curX = 8;
  const positions: number[] = [];
  for (const n of patterns) { positions.push(curX); curX += n * unit + gap; }
  const maxH = Math.round(4 * unit * HR);
  const totalW = curX - gap + 8;

  const drawSubdivided = (n: number, ox: number, oy: number): ReactNode[] => {
    const W = n * unit;
    const H = Math.round(n * unit * HR);
    const apex = [ox + W / 2, oy];
    const bl = [ox, oy + H];
    const br = [ox + W, oy + H];
    const els: ReactNode[] = [];
    // Outer triangle
    els.push(<polygon key="o" points={`${apex[0]},${apex[1]} ${bl[0]},${bl[1]} ${br[0]},${br[1]}`} fill="none" stroke="#ffffffcc" strokeWidth="1.5" />);
    for (let k = 1; k < n; k++) {
      // Horizontal lines
      const lkx = W * (n - k) / (2 * n) + ox, lky = k * H / n + oy;
      const rkx = W * (n + k) / (2 * n) + ox;
      els.push(<line key={`h${k}`} x1={lkx} y1={lky} x2={rkx} y2={lky} stroke="#ffffffcc" strokeWidth="1" />);
      // Left-parallel lines: B_k → R_(n-k)
      els.push(<line key={`lp${k}`} x1={k * W / n + ox} y1={H + oy} x2={W * (2 * n - k) / (2 * n) + ox} y2={(n - k) * H / n + oy} stroke="#ffffffcc" strokeWidth="1" />);
      // Right-parallel lines: B_(n-k) → L_k
      els.push(<line key={`rp${k}`} x1={(n - k) * W / n + ox} y1={H + oy} x2={W * (n - k) / (2 * n) + ox} y2={k * H / n + oy} stroke="#ffffffcc" strokeWidth="1" />);
    }
    return els;
  };

  return (
    <svg width={totalW} height={maxH + 32}>
      {patterns.map((n, i) => {
        const W = n * unit;
        const H = Math.round(n * unit * HR);
        const oy = 5 + maxH - H;
        return (
          <g key={i}>
            {drawSubdivided(n, positions[i], oy)}
            <text x={positions[i] + W / 2} y={5 + maxH + 22} textAnchor="middle" fill="#ffffffcc" fontSize="12" fontFamily="sans-serif">({n})</text>
          </g>
        );
      })}
    </svg>
  );
};

// Soal 30: Dots in n×(n+2) rectangles (n=1..4), U_n = n(n+2), U_10 = 120
const Soal30SVG = () => {
  const dotR = 5;
  const sp = 13;
  const patterns = [
    { rows: 1, cols: 3 },
    { rows: 2, cols: 4 },
    { rows: 3, cols: 5 },
    { rows: 4, cols: 6 },
  ];
  const gap = 18;
  let curX = 8;
  const positions: number[] = [];
  for (const p of patterns) { positions.push(curX); curX += p.cols * sp + gap; }
  const maxH = 4 * sp;
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={maxH + 12}>
      {patterns.map((p, i) => {
        const x = positions[i];
        const h = p.rows * sp;
        const offsetY = 6 + maxH - h;
        const dots: ReactNode[] = [];
        for (let r = 0; r < p.rows; r++)
          for (let c = 0; c < p.cols; c++)
            dots.push(<circle key={`${r}-${c}`} cx={x + c * sp + dotR} cy={offsetY + r * sp + dotR} r={dotR} fill={dotColor} />);
        return <g key={i}>{dots}</g>;
      })}
    </svg>
  );
};

// Soal 31: L-shaped dot patterns (n=1..4), U_n = 2n−1, U_30 = 59
const Soal31SVG = () => {
  const dotR = 5;
  const sp = 14;
  const patterns = [1, 2, 3, 4];
  const gap = 22;
  let curX = 8;
  const positions: number[] = [];
  for (const n of patterns) { positions.push(curX); curX += n * sp + gap; }
  const maxH = 4 * sp;
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={maxH + 12}>
      {patterns.map((n, i) => {
        const x = positions[i];
        const patH = n * sp;
        const baseY = 6 + maxH;
        const dots: ReactNode[] = [];
        // Bottom row: n dots
        for (let c = 0; c < n; c++)
          dots.push(<circle key={`b${c}`} cx={x + c * sp + dotR} cy={baseY - dotR} r={dotR} fill={dotColor} />);
        // Right column: n-1 dots going up (excluding corner already in bottom row)
        for (let r = 1; r < n; r++)
          dots.push(<circle key={`rc${r}`} cx={x + (n - 1) * sp + dotR} cy={baseY - r * sp - dotR} r={dotR} fill={dotColor} />);
        return <g key={i}>{dots}</g>;
      })}
    </svg>
  );
};

const soalSVGMap: Record<number, ReactNode> = {
  27: <Soal27SVG />,
  28: <Soal28SVG />,
  29: <Soal29SVG />,
  30: <Soal30SVG />,
  31: <Soal31SVG />,
};

const OlimpiadePolaBilanganPage = () => {
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
          OLIMPIADE - POLA BILANGAN
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
                    {idx === 4 ? (
                      <div className="font-body text-sm text-white/80 leading-relaxed space-y-3">
                        <div className="whitespace-pre-wrap">
                          {section.content.split('\n').map((line, i) => {
                            const trimmed = line.trim();
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
                        <div className="mt-3 flex flex-col items-center gap-2">
                          <div className="text-xs text-yellow-400 font-semibold uppercase tracking-widest mb-1">Ilustrasi Barisan</div>
                          <div className="bg-white rounded-xl p-3 shadow-lg max-w-sm w-full flex justify-center">
                            <img
                              src={imgSukuKenImg}
                              alt="Ilustrasi barisan U1, U2, U3,... dengan pola selisih"
                              className="max-w-full h-auto object-contain"
                            />
                          </div>
                          <div className="text-xs text-white/50 italic text-center">Ilustrasi pola selisih berurutan untuk menentukan rumus suku ke-n</div>
                        </div>
                      </div>
                    ) : idx === 3 ? (
                      <div className="font-body text-sm text-white/80 leading-relaxed space-y-4">
                        <div>
                          <div className="mb-1 font-semibold text-yellow-400">1. Pola Bilangan Persegi</div>
                          <div className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                            <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                            {renderWithLatex("$U_n = n^2$")}
                          </div>
                          <div className="overflow-x-auto"><PolaPersegiSVG /></div>
                        </div>
                        <div>
                          <div className="mb-1 font-semibold text-yellow-400">2. Pola Bilangan Persegi Panjang</div>
                          <div className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                            <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                            {renderWithLatex("$U_n = n(n+1)$")}
                          </div>
                          <div className="overflow-x-auto"><PolaPersegiPanjangSVG /></div>
                        </div>
                        <div>
                          <div className="mb-1 font-semibold text-yellow-400">3. Pola Bilangan Segitiga</div>
                          <div className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                            <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                            {renderWithLatex("$U_n = \\frac{n(n+1)}{2}$")}
                          </div>
                          <div className="overflow-x-auto"><PolaSegitigaSVG /></div>
                        </div>
                      </div>
                    ) : (
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
                    )}
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
                {soalSVGMap[soal.no] && (
                  <div className="mb-3 overflow-x-auto">{soalSVGMap[soal.no]}</div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {polaBilanganDasarPembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`pb-dasar-${soal.no}`} pembahasan={polaBilanganDasarPembahasan[soal.no]} />
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
                {soal.no === 37 ? (() => {
                  const lines = soal.soal.split('\n');
                  const splitIdx = lines[1]?.indexOf('. Bilangan segilima ke-0');
                  const part1 = splitIdx !== -1 ? lines[1].slice(0, splitIdx + 1) : lines[1];
                  const part2 = splitIdx !== -1 ? lines[1].slice(splitIdx + 1) : '';
                  return (
                    <div className="font-body text-sm text-white mb-3">
                      <span className="text-accent font-bold">{soal.no}.</span>{' '}
                      <span className="text-yellow-400 font-semibold">{lines[0]}</span>
                      <div className="mt-1">{part1}</div>
                      <div className="my-3 flex flex-col items-center gap-1">
                        <div className="bg-white rounded-xl p-3 shadow-md max-w-sm w-full flex justify-center">
                          <img
                            src={imgPolaSegilima}
                            alt="Pola segilima ke-1, ke-2, ke-3, ke-4"
                            className="max-w-full h-auto object-contain"
                          />
                        </div>
                        <div className="text-xs text-white/40 italic text-center">Pola titik yang membentuk segilima ke-1, ke-2, ke-3, dan ke-4</div>
                      </div>
                      <div>{part2}</div>
                    </div>
                  );
                })() : (
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                )}
                {soal.no === 1 && (
                  <div className="my-3 flex flex-col items-center gap-1">
                    <div className="bg-white rounded-xl p-3 shadow-md max-w-xs w-full flex justify-center">
                      <img
                        src={imgPolaBuilatan}
                        alt="Pola bulatan hitam dan putih OSN 2003"
                        className="max-w-full h-auto object-contain"
                      />
                    </div>
                    <div className="text-xs text-white/40 italic text-center">Pola bulatan pada gambar ke-1, ke-2, ke-3, dan ke-4</div>
                  </div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {polaBilanganOlimpiadePembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`pb-olim-${soal.no}`} pembahasan={polaBilanganOlimpiadePembahasan[soal.no]} />
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

export default OlimpiadePolaBilanganPage;
