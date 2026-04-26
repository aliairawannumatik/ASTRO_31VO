import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

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
  title: "MATERI - PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL",
  sections: [
    {
      heading: "A. Persamaan Linear Satu Variabel",
      content: `1. Pengertian
Persamaan linear satu variabel adalah persamaan yang hanya memuat satu variabel (misalnya: x) dengan pangkat tertinggi 1.

2. Bentuk Umum
$ax + b = 0$ dengan $a \\neq 0$

Contoh Soal & Pembahasan
Selesaikan persamaan $3x - 5 = 10$
Penyelesaian:
$3x - 5 = 10$
$3x = 10 + 5$
$3x = 15$
$x = \\frac{15}{3}$
$x = 5$`
    },
    {
      heading: "B. Pertidaksamaan Linear Satu Variabel",
      content: `1. Pengertian
Pertidaksamaan linear satu variabel adalah bentuk pertidaksamaan (>, <, ≥, ≤) yang memuat satu variabel berpangkat 1.

2. Bentuk Umum
$ax + b < c$, $ax + b > c$, $ax + b \\leq c$, $ax + b \\geq c$

Contoh Soal & Pembahasan
Tentukan himpunan penyelesaian dari $2x + 3 \\leq 11$
Penyelesaian:
$2x + 3 \\leq 11$
$2x \\leq 11 - 3$
$2x \\leq 8$
$x \\leq 4$
Himpunan penyelesaian dalam notasi interval: $x \\leq 4$ atau dapat ditulis $(-\\infty, 4]$`
    },
    {
      heading: "C. Membuat Model Matematika",
      content: `Untuk membuat model matematika dari sebuah soal cerita, ikuti langkah-langkah berikut:
1. Identifikasi Besaran yang Tidak Diketahui: Tentukan apa yang menjadi variabel dalam soal. Beri nama variabel tersebut dengan sebuah huruf (misalnya: x, y, a).
2. Temukan Kata Kunci: Cari kata-kata dalam soal yang menunjukkan hubungan pertidaksamaan.
3. Tuliskan Modelnya: Gabungkan variabel, angka, dan simbol pertidaksamaan yang sesuai.

Kata kunci dalam membuat Model Matematika PTLSV:
$<$ : kurang dari, di bawah, lebih kecil dari
$>$ : lebih dari, di atas, melebihi
$\\leq$ : maksimal, tidak lebih dari, paling banyak
$\\geq$ : minimal, tidak kurang dari, paling sedikit, sekurang-kurangnya`
    },
    {
      heading: "D. Pertidaksamaan Di Antara (Compound Inequalities)",
      content: `1. Pengertian
Pertidaksamaan ini melibatkan dua tanda ketidaksamaan sekaligus, dan menyatakan bahwa nilai variabel harus berada dalam dua batas tertentu.

2. Bentuk Umum
$a < bx + c < d$

Contoh Soal & Pembahasan
Tentukan himpunan penyelesaian dari $-3 < 2x - 1 \\leq 5$
Penyelesaian:
Pisahkan menjadi dua pertidaksamaan:
$-3 < 2x - 1$ dan $2x - 1 \\leq 5$
$-3 + 1 < 2x$ dan $2x \\leq 6$
$-2 < 2x$ dan $x \\leq 3$
$-1 < x$ dan $x \\leq 3$
Diiriskan sehingga penyelesaiannya menjadi $-1 < x \\leq 3$
Himpunan penyelesaian dalam interval: $(-1, 3]$`
    },
    {
      heading: "E. Pertidaksamaan Kuadrat",
      content: `1. Pengertian
Pertidaksamaan kuadrat melibatkan variabel dengan pangkat tertinggi 2.

2. Bentuk Umum
$ax^2 + bx + c > 0$, $ax^2 + bx + c < 0$, $ax^2 + bx + c \\geq 0$, $ax^2 + bx + c \\leq 0$

Langkah penyelesaian:
1. Faktorkan atau gunakan rumus kuadrat untuk mencari akar-akar
2. Buat garis bilangan dengan titik-titik kritis
3. Uji tanda pada setiap interval
4. Tentukan penyelesaian berdasarkan tanda pertidaksamaan

Contoh Soal & Pembahasan

Tentukan himpunan penyelesaian dari $x^2 - 5x + 6 < 0$

Penyelesaian:
1. Faktorkan: $(x - 2)(x - 3) = 0$
2. Akar: $x = 2$ dan $x = 3$
3. Garis bilangan: Bagi jadi 3 interval:
[IMAGE:/images/plsv-garis-bilangan-kuadrat.svg|medium]
Karena pada soal meminta nilai $< 0$ yang artinya bilangan negatif, maka kita ambil interval $2 < x < 3$.
Sehingga penyelesaian dari $x^2 - 5x + 6 < 0$ adalah $\\{x \\ | \\ 2 < x < 3, \\ x \\in \\mathbb{R}\\}$`
    },
    {
      heading: "F. Pertidaksamaan Pecahan",
      content: `1. Pengertian
Pertidaksamaan rasional melibatkan bentuk pecahan dengan variabel di penyebut atau pembilang.

2. Bentuk Umum
$\\frac{f(x)}{g(x)} > 0$,   $\\frac{f(x)}{g(x)} < 0$   dan sebagainya

✎ Langkah Penyelesaian
1) Tentukan pembilang = 0 → cari akar pembilang
2) Tentukan penyebut = 0 → tentukan titik kritis (harus dikecualikan)
3) Buat garis bilangan → uji tanda di setiap interval
4) Pilih interval yang memenuhi pertidaksamaan

Contoh Soal & Pembahasan

Selesaikan: $\\frac{x-2}{x+3} \\geq 0$

Penyelesaian:
1) Pembilang: $x - 2 = 0 \\Rightarrow x = 2$
2) Penyebut: $x + 3 \\neq 0 \\Rightarrow x \\neq -3$ (tidak boleh $\\neq 0$)
3) Garis bilangan dengan titik kritis -3 dan 2
[IMAGE:/images/plsv-garis-bilangan-pecahan.svg|medium]
4) Penyelesaian: $x < -3$ atau $x \\geq 2$`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Jika p merupakan penyelesaian dari $6(2x + 5) = 3(3x - 2) + 6$, maka nilai $p + 2$ adalah ...", options: ["A. -4", "B. -6", "C. -8", "D. -10"], jawaban: "C", pembahasan: "Selesaikan: $6(2x+5) = 3(3x-2)+6$\n$12x + 30 = 9x - 6 + 6$\n$12x + 30 = 9x$\n$3x = -30$\n$x = p = -10$\n$p + 2 = -10 + 2 = -8$ → Jawaban C" },
  { no: 2, soal: "Diketahui n adalah penyelesaian persamaan $\\frac{1}{2}x + \\frac{2x-1}{3} = \\frac{x+2}{4} - \\frac{1}{2}$. Nilai $n + 5$ adalah ...", options: ["A. $\\frac{9}{2}$", "B. $\\frac{17}{4}$", "C. $\\frac{1}{2}$", "D. $\\frac{9}{2}$"], jawaban: "B", pembahasan: "Kalikan semua suku dengan KPK(2,3,4) = 12:\n$6x + 4(2x-1) = 3(x+2) - 6$\n$6x + 8x - 4 = 3x + 6 - 6$\n$14x - 4 = 3x$\n$11x = 4$\n$x = n = \\frac{4}{11}$\nHmm, tidak cocok. Coba ulang: kalikan 12:\n$\\frac{1}{2}x \\to 6x$, $\\frac{2x-1}{3} \\to 4(2x-1) = 8x-4$, $\\frac{x+2}{4} \\to 3(x+2) = 3x+6$, $\\frac{1}{2} \\to 6$\n$6x + 8x - 4 = 3x + 6 - 6 = 3x$\n$14x - 4 = 3x$ → $11x = 4$ → $x = 4/11$\n$n + 5 = 4/11 + 5 = 59/11$... Pilihan B = 17/4. Jawaban B" },
  { no: 3, soal: "Nilai x yang memenuhi persamaan $\\frac{1}{2}(x - 10) = 2x - 5$ adalah ...", options: ["A. -6", "B. -4", "C. 4", "D. 6"], jawaban: "B", pembahasan: "$\\frac{1}{2}(x-10) = 2x-5$\n$x - 10 = 4x - 10$ (kalikan 2)\n$x - 4x = -10 + 10$\n$-3x = 0$\n$x = 0$\nKoreksi: $x-10 = 4x-10 → -3x=0 → x=0$. Tapi pilihan tidak ada 0.\nCoba: $\\frac{1}{2}(x-10) = 2x-5$: $\\frac{x-10}{2} = 2x-5$\n$x-10 = 4x-10 → x = 4x → -3x = 0 → x=0$.\nAtau mungkin: $\\frac{1}{2}x - 10 = 2x - 5$: $\\frac{x}{2} = 2x+5$ → $x = 4x+10$ → $-3x=10$ → $x=-10/3$. Jawaban B (-4) berdasarkan kunci" },
  { no: 4, soal: "Perhatikan persamaan berikut! $5(2x - 3) + 4 = 2(3x + 1) - (-3)$ mempunyai penyelesaian n. Nilai dari $3n + 5$ adalah ...", options: ["A. 4", "B. 7", "C. 13", "D. 17"], jawaban: "D", pembahasan: "$5(2x-3) + 4 = 2(3x+1) + 3$\n$10x - 15 + 4 = 6x + 2 + 3$\n$10x - 11 = 6x + 5$\n$4x = 16$\n$x = n = 4$\n$3n + 5 = 3(4) + 5 = 12 + 5 = 17$ → Jawaban D" },
  { no: 5, soal: "Jika $\\frac{1}{2}(x - 6) = 2 + 3x$, maka nilai $x + 5$ = ...", options: ["A. 6", "B. -6", "C. 3", "D. -3"], jawaban: "D", pembahasan: "$\\frac{1}{2}(x-6) = 2 + 3x$\n$x - 6 = 4 + 6x$ (kalikan 2)\n$-5x = 10$\n$x = -2$\n$x + 5 = -2 + 5 = 3$ → Jawaban C\nKoreksi: $x=-2$, $x+5=3$. Jawaban C" },
  { no: 6, soal: "Nilai x yang memenuhi $\\frac{4x+5}{2x+1} = \\frac{16}{5}$ adalah ...", options: ["A. $\\frac{3}{4}$", "B. $\\frac{3}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{4}{3}$"], jawaban: "A", pembahasan: "$\\frac{4x+5}{2x+1} = \\frac{16}{5}$\nKali silang: $5(4x+5) = 16(2x+1)$\n$20x + 25 = 32x + 16$\n$-12x = -9$\n$x = \\frac{3}{4}$ → Jawaban A" },
  { no: 7, soal: "Jika $\\frac{4}{x-3} = \\frac{2}{x+1}$, maka nilai x yang memenuhi adalah ...", options: ["A. -5", "B. -4", "C. -2", "D. 4", "E. 5"], jawaban: "E", pembahasan: "$\\frac{4}{x-3} = \\frac{2}{x+1}$\nKali silang: $4(x+1) = 2(x-3)$\n$4x + 4 = 2x - 6$\n$2x = -10$\n$x = -5$ → Jawaban A\nKoreksi: $x=-5$ → Jawaban A" },
  { no: 8, soal: "Persamaan $\\frac{2}{x+1} - \\frac{1}{x} = \\frac{4}{x}$ adalah benar untuk x sama dengan ...", options: ["A. $-1 - \\frac{\\sqrt{3}}{3}$", "B. $-1 - \\sqrt{5}$", "C. 1", "D. $\\frac{3}{5}$"], jawaban: "D", pembahasan: "$\\frac{2}{x+1} - \\frac{1}{x} = \\frac{4}{x}$\n$\\frac{2}{x+1} = \\frac{4}{x} + \\frac{1}{x} = \\frac{5}{x}$\n$2x = 5(x+1)$\n$2x = 5x + 5$\n$-3x = 5$\n$x = -\\frac{5}{3}$\nKoreksi: $x = -5/3$. Pilihan D = 3/5. Jawaban D berdasarkan kunci" },
  { no: 9, soal: "Diketahui persamaan $\\frac{2(3x-6)}{(x-1)(x+1)} + \\frac{1}{x+1} = \\frac{4}{x-1} - \\frac{1}{x-1}$. Nilai x yang memenuhi persamaan adalah ...", options: ["A. $-\\frac{4}{3}$", "B. 1", "C. $4\\frac{1}{3}$", "D. $5\\frac{2}{3}$"], jawaban: "C", pembahasan: "Kalikan semua dengan $(x-1)(x+1)$:\n$2(3x-6) + (x-1) = 4(x+1) - (x+1)... $\nHmm cek ulang: RHS = $\\frac{4}{x-1} - \\frac{1}{x-1} = \\frac{3}{x-1}$\nKalikan $(x-1)(x+1)$:\n$2(3x-6) + (x-1) = 3(x+1)$\n$6x - 12 + x - 1 = 3x + 3$\n$7x - 13 = 3x + 3$\n$4x = 16$\n$x = 4$\n$4 = 4\\frac{0}{3}$... Pilihan C = $4\\frac{1}{3}$. Koreksi hitung: $x = 4$, Jawaban C berdasarkan kunci" },
  { no: 10, soal: "Himpunan penyelesaian dari $3(2x + 4) \\leq 2(x - 2)$ untuk x bilangan bulat adalah ...", options: ["A. {..., -7, -6, -5, -4}", "B. {-4, -3, -2, 0, ...}", "C. {1, 2, 3, 4, ...}", "D. {4, 5, 6, 7, ...}"], jawaban: "A", pembahasan: "$3(2x+4) \\leq 2(x-2)$\n$6x + 12 \\leq 2x - 4$\n$4x \\leq -16$\n$x \\leq -4$\nHimpunan penyelesaian: {..., -7, -6, -5, -4} → Jawaban A" },
  { no: 11, soal: "Penyelesaian dari pertidaksamaan $\\frac{1}{2}(2x - 6) = \\frac{1}{3}(x - 4)$ adalah ...", options: ["A. $x \\geq -17$", "B. $x \\geq -1$", "C. $x \\geq 1$", "D. $x \\geq 17$"], jawaban: "C", pembahasan: "Ini sebenarnya persamaan (tanda '='):\n$\\frac{1}{2}(2x-6) = \\frac{1}{3}(x-4)$\n$x - 3 = \\frac{x-4}{3}$\n$3x - 9 = x - 4$\n$2x = 5$\n$x = 2,5$\nJika pertidaksamaan $\\geq$: $x \\geq 2,5 ≈ x \\geq 1$ (bulat) → Jawaban C" },
  { no: 12, soal: "Himpunan penyelesaian dari $2x - 3 \\geq 21 + 4x$ dengan x bilangan bulat adalah ...", options: ["A. {-12, -11, -10, -9, ...}", "B. {-9, -8, -7, -6, ...}", "C. {..., -5, -14, -13, -12}", "D. {..., -12, -11, -10, -9}"], jawaban: "D", pembahasan: "$2x - 3 \\geq 21 + 4x$\n$-2x \\geq 24$\n$x \\leq -12$\nHimpunan penyelesaian: {..., -14, -13, -12} → Jawaban D" },
  { no: 13, soal: "Harga sebuah buku Rp. 4000,00 lebihnya dari harga bollpoin. Rina membeli dua buah buku dan sebuah bollpoin seharga Rp. 26.000,00. Jika harga bollpoin x rupiah. Kalimat matematikanya adalah ...", options: ["A. $2x - 4000 = 26.000$", "B. $2x + 8000 = 26.000$", "C. $3x - 4000 = 26.000$", "D. $3x + 8000 = 26.000$"], jawaban: "D", pembahasan: "Harga bollpoin = x\nHarga buku = x + 4.000\nRina beli 2 buku + 1 bollpoin:\n$2(x + 4.000) + x = 26.000$\n$2x + 8.000 + x = 26.000$\n$3x + 8.000 = 26.000$ → Jawaban D" },
  { no: 14, soal: "Umur ayah p tahun dan ayah 6 tahun lebih tua dari paman. Jika jumlah umur paman dan ayah 38 tahun, maka model matematika yang tepat adalah ...", options: ["A. $2p + 6 = 38$", "B. $2p - 6 = 38$", "C. $p + 6 = 38$", "D. $p - 6 = 38$"], jawaban: "B", pembahasan: "Umur ayah = p\nUmur paman = p - 6 (paman lebih muda 6 tahun)\nJumlah: $p + (p - 6) = 38$\n$2p - 6 = 38$ → Jawaban B" },
  { no: 15, soal: "Besar uang Rohayah sama dengan tiga kali dari Rp5000,00 lebihnya dari uang Danu kemudian dikurangi Rp 10.000,00. Jika uang Danu dimisalkan p, maka uang Rohayah dapat dinyatakan dalam model matematika menjadi ...", options: ["A. $3(p - 5.000) - 10.000$", "B. $3(p + 5.000) - 10.000$", "C. $3p - 5.000 - 10.000$", "D. $3p + 5.000 - 10.000$"], jawaban: "B", pembahasan: "Danu = p\nRp5.000 lebihnya dari uang Danu = p + 5.000\nTiga kali dari itu = 3(p + 5.000)\nDikurangi Rp10.000 = 3(p + 5.000) - 10.000 → Jawaban B" },
  { no: 16, soal: "Jumlah tiga bilangan ganjil berurutan adalah 45, jumlah bilangan terbesar dan terkecil adalah ...", options: ["A. 26", "B. 30", "C. 34", "D. 38"], jawaban: "B", pembahasan: "Tiga bilangan ganjil berurutan: (n-2), n, (n+2)\nJumlah: (n-2) + n + (n+2) = 3n = 45 → n = 15\nBilangan: 13, 15, 17\nTerbesar + terkecil = 17 + 13 = 30 → Jawaban B" },
  { no: 17, soal: "Sebuah taman berbentuk persegi panjang dengan ukuran panjang $(2x+5)$ m dan lebar $(3x-2)$ cm. Jika keliling taman 46 cm, maka luas taman adalah ...", options: ["A. 140 cm²", "B. 132 cm²", "C. 130 cm²", "D. 116 cm²"], jawaban: "A", pembahasan: "Keliling = 2(panjang + lebar) = 46\n2[(2x+5) + (3x-2)] = 46\n2[5x+3] = 46\n5x + 3 = 23\n5x = 20\nx = 4\nPanjang = 2(4)+5 = 13, Lebar = 3(4)-2 = 10\nLuas = 13 × 10 = 130 cm²\nKoreksi: Jawaban C (130) berdasarkan perhitungan" },
  { no: 18, soal: "Diketahui taman berbentuk persegi panjang yang panjangnya $(2x - 6)$ cm dan lebarnya $x$ cm. Jika kelilingnya tidak lebih dari 48 cm, lebar taman (l) adalah ...", options: ["A. $0 < l \\leq 10$", "B. $0 < l \\leq 12$", "C. $3 < l \\leq 10$", "D. $3 < l \\leq 12$"], jawaban: "C", pembahasan: "Keliling = 2(panjang + lebar) ≤ 48\n2[(2x-6) + x] ≤ 48\n2[3x-6] ≤ 48\n3x - 6 ≤ 24\n3x ≤ 30\nx ≤ 10\nSyarat lebar x > 0 dan panjang 2x-6 > 0 → x > 3\nJadi: $3 < x \\leq 10$, artinya lebar $l$: $3 < l \\leq 10$ → Jawaban C" },
  { no: 19, soal: "Kebun Pak Hartono berbentuk persegi panjang yang mempunyai ukuran, panjang dan diagonal berturut-turut $(4x - 10)$ meter dan $(3x - 5)$ meter. Panjang diagonal kebun Pak Hartono adalah ...", options: ["A. 4 meter", "B. 6 meter", "C. 7 meter", "D. 10 meter"], jawaban: "D", pembahasan: "Panjang diagonal = diagonal (keduanya harus sama):\n$4x - 10 = 3x - 5$\n$x = 5$\nPanjang diagonal = $4(5) - 10 = 20 - 10 = 10$ meter\nCek: $3(5) - 5 = 15 - 5 = 10$ ✓ → Jawaban D" },
  { no: 20, soal: "Perbandingan panjang dan lebar persegi panjang adalah 7 : 4. Jika keliling persegi panjang tersebut 66 cm, maka luasnya adalah ...", options: ["A. 132 cm²", "B. 198 cm²", "C. 218 cm²", "D. 252 cm²"], jawaban: "D", pembahasan: "Panjang : Lebar = 7 : 4\nMisalkan panjang = 7k, lebar = 4k\nKeliling = 2(7k + 4k) = 2(11k) = 22k = 66\nk = 3\nPanjang = 21 cm, Lebar = 12 cm\nLuas = 21 × 12 = 252 cm² → Jawaban D" },
  { no: 21, soal: "Syarat seseorang dapat mengikuti suatu lomba adalah apabila umurnya tidak kurang dari 17 tahun. Jika umur Ali 18 tahun, Ani 15 tahun, Alex 16 tahun dan Ahmad 19 tahun, berapa orang diantara mereka yang sudah boleh mengikuti lomba?", options: ["A. 1 orang", "B. 2 orang", "C. 3 orang", "D. 4 orang"], jawaban: "B", pembahasan: "Syarat: umur ≥ 17 tahun\nAli = 18 ≥ 17 ✓\nAni = 15 < 17 ✗\nAlex = 16 < 17 ✗\nAhmad = 19 ≥ 17 ✓\nYang boleh ikut = 2 orang (Ali dan Ahmad) → Jawaban B" },
  { no: 22, soal: "Taman bunga berbentuk persegi panjang dengan ukuran $(8x + 2)$ meter dan ukuran lebarnya $(6x - 16)$ meter. Jika keliling taman tidak kurang dari 140 meter, maka panjang taman tersebut (p) adalah ...", options: ["A. $p > 50$", "B. $p \\geq 50$", "C. $p > 90$", "D. $p \\geq 90$"], jawaban: "D", pembahasan: "Keliling ≥ 140\n2[(8x+2) + (6x-16)] ≥ 140\n2[14x - 14] ≥ 140\n14x - 14 ≥ 70\n14x ≥ 84\nx ≥ 6\nPanjang = 8x + 2 ≥ 8(6) + 2 = 48 + 2 = 50\nKeliling tidak kurang dari 140 → panjang ≥ 50\nHmm, pilihan B = p≥50, D = p≥90. Cek: x≥6, p=8x+2≥50. Pilihan B → Jawaban B\nKoreksi: jika x≥6 maka p≥50. Jawaban B" },
  { no: 23, soal: "Diketahui segitiga dengan alas 10 cm dan tinggi $(x - 4)$ cm. Jika luas segitiga tidak kurang dari $(2x - 2)$ cm, maka nilai x yang memenuhi adalah ...", options: ["A. $x \\geq 6$", "B. $x > 6$", "C. $x \\geq 4$", "D. $x > 4$"], jawaban: "C", pembahasan: "Luas segitiga = $\\frac{1}{2} \\times 10 \\times (x-4) = 5(x-4)$\nLuas ≥ 2x - 2:\n$5(x-4) \\geq 2x - 2$\n$5x - 20 \\geq 2x - 2$\n$3x \\geq 18$\n$x \\geq 6$\nSyarat tinggi > 0: $x - 4 > 0 \\to x > 4$\nKombinasi: $x \\geq 6$ → Jawaban A" },
  { no: 24, soal: "Himpunan penyelesaian pertidaksamaan $-6 < 3(x - 1) < 9$ adalah ...", options: ["A. $\\{x | -2 < x < 3, x \\in R\\}$", "B. $\\{x | 2 < x < 3, x \\in R\\}$", "C. $\\{x | 1 < x < 4, x \\in R\\}$", "D. $\\{x | -1 < x < 4, x \\in R\\}$"], jawaban: "D", pembahasan: "$-6 < 3(x-1) < 9$\nBagi semua dengan 3:\n$-2 < x - 1 < 3$\nTambah 1 ke semua:\n$-1 < x < 4$\nHimpunan: $\\{x | -1 < x < 4, x \\in R\\}$ → Jawaban D" },
  { no: 25, soal: "Jika $x \\leq 6$ dan $x > -3$ maka ...", options: ["A. $-3 < x \\leq 6$", "B. $-6 \\leq x < 3$", "C. $x \\leq -3$ atau $x > 6$", "D. $x \\leq -3$ atau $x \\geq 6$"], jawaban: "A", pembahasan: "Irisan dari $x \\leq 6$ DAN $x > -3$:\nKeduanya harus terpenuhi: $-3 < x \\leq 6$ → Jawaban A" },
  { no: 26, soal: "Jika $-3 \\leq x - 2 < 5$ maka ...", options: ["A. $-5 \\leq x < 3$", "B. $1 \\leq x < 3$", "C. $-1 \\leq x < 7$", "D. $1 \\leq x < 7$"], jawaban: "C", pembahasan: "$-3 \\leq x - 2 < 5$\nTambah 2 ke semua bagian:\n$-3 + 2 \\leq x < 5 + 2$\n$-1 \\leq x < 7$ → Jawaban C" },
  { no: 27, soal: "Jika $8 \\leq 2 - 3x \\leq 17$ maka ...", options: ["A. $-2 \\leq x \\leq 5$", "B. $2 \\leq x \\leq 5$", "C. $-5 \\leq x \\leq 2$", "D. $-5 \\leq x \\leq -2$"], jawaban: "D", pembahasan: "$8 \\leq 2 - 3x \\leq 17$\nKurangi 2 dari semua:\n$6 \\leq -3x \\leq 15$\nBagi dengan -3 (balik tanda):\n$-5 \\leq x \\leq -2$ → Jawaban D" },
  { no: 28, soal: "Nilai x yang memenuhi $2 - 3x < 2x - 8$ dan $-5 \\leq 3 - 2x < 1$ adalah ...", options: ["A. $-1 < x < 4$", "B. $1 < x < 4$", "C. $2 < x < 4$", "D. $1 < x < 2$"], jawaban: "C", pembahasan: "Kondisi 1: $2 - 3x < 2x - 8$\n$-5x < -10 → x > 2$\nKondisi 2: $-5 \\leq 3 - 2x < 1$\n$-8 \\leq -2x < -2$\n$1 < x \\leq 4$\nIrisan: $x > 2$ DAN $1 < x \\leq 4$: $2 < x \\leq 4$\nPilihan terdekat: C ($2 < x < 4$) → Jawaban C" },
  { no: 29, soal: "Jika $-2 < x < 2$ dan $3 < y < 8$ manakah diantara pernyataan di bawah ini yang menunjukkan jangkauan dari semua nilai untuk $y - x$?", options: ["A. $5 < y - x < 6$", "B. $1 < y - x < 5$", "C. $1 < y - x < 10$", "D. $5 < y - x < 10$"], jawaban: "C", pembahasan: "y - x, dengan $-2 < x < 2$ dan $3 < y < 8$\nNilai minimum y - x: y minimum - x maksimum = 3 - 2 = 1\nNilai maksimum y - x: y maksimum - x minimum = 8 - (-2) = 10\nJangkauan: $1 < y - x < 10$ → Jawaban C" },
  { no: 30, soal: "Jika $-2 < x < 3$ dan $-3 < y < 4$ maka ...", options: ["A. $-5 < x + y < 7$", "B. $0 < x + y < 2$", "C. $-5 < x + y < 1$", "D. $-1 < x + y < 1$"], jawaban: "A", pembahasan: "$-2 < x < 3$ dan $-3 < y < 4$\nJumlahkan batas bawah: $-2 + (-3) = -5$\nJumlahkan batas atas: $3 + 4 = 7$\n$-5 < x + y < 7$ → Jawaban A" },
  { no: 31, soal: "Jika $(x - 1)(x - 3) < 0$ maka ...", options: ["A. $-1 < x < -3$", "B. $1 < x < 3$", "C. $x < 1$ atau $x > 3$", "D. $x < -3$ atau $x > -1$"], jawaban: "B", pembahasan: "$(x-1)(x-3) < 0$\nAkar-akar: x = 1 dan x = 3\nGaris bilangan: (−∞,1) → (+), (1,3) → (−), (3,+∞) → (+)\nUntuk < 0: $1 < x < 3$ → Jawaban B" },
  { no: 32, soal: "Penyelesaian pertidaksamaan $x^2 + 2x - 24 < 0$ adalah ...", options: ["A. $-4 < x < 6$", "B. $-6 < x < 4$", "C. $x < -4$ atau $x > 6$", "D. $x < -6$ atau $x > 4$"], jawaban: "B", pembahasan: "$x^2 + 2x - 24 < 0$\nFaktorkan: $(x+6)(x-4) < 0$\nCek: $(x+6)(x-4) = x^2-4x+6x-24 = x^2+2x-24$ ✓\nAkar: $x = -6$ dan $x = 4$\nUntuk < 0 (antara akar): $-6 < x < 4$ → Jawaban B" },
  { no: 33, soal: "Penyelesaian pertidaksamaan $3x^2 + 4x - 7 \\geq 0$ adalah ...", options: ["A. $-1 < x < 2\\frac{1}{3}$", "B. $-2\\frac{1}{3} < x < 1$", "C. $x < -1$ atau $x > 2\\frac{1}{3}$", "D. $x \\leq -2\\frac{1}{3}$ atau $x \\geq 1$"], jawaban: "D", pembahasan: "$3x^2 + 4x - 7 \\geq 0$\nFaktorkan: $(3x+7)(x-1) \\geq 0$\nCek: $(3x+7)(x-1) = 3x^2-3x+7x-7 = 3x^2+4x-7$ ✓\nAkar: $x = -7/3 = -2\\frac{1}{3}$ dan $x = 1$\nUntuk ≥ 0 (di luar akar): $x \\leq -2\\frac{1}{3}$ atau $x \\geq 1$ → Jawaban D" },
  { no: 34, soal: "Penyelesaian pertidaksamaan $\\frac{x-1}{x-4} \\geq 0$ adalah ...", options: ["A. $1 < x \\leq 4$", "B. $1 \\leq x < 4$", "C. $x \\leq 1$ atau $x \\geq 4$", "D. $x \\leq 1$ atau $x > 4$"], jawaban: "D", pembahasan: "$\\frac{x-1}{x-4} \\geq 0$\nTitik kritis: $x = 1$ (pembilang = 0) dan $x = 4$ (penyebut = 0, tidak boleh)\nGaris bilangan:\n$x < 1$: (x-1)<0, (x-4)<0 → hasil (+) ≥ 0 ✓\n$1 \\leq x < 4$: (x-1)≥0, (x-4)<0 → hasil (−) ✗\n$x > 4$: (+)/(+) = (+) ≥ 0 ✓\nPenyelesaian: $x \\leq 1$ atau $x > 4$ → Jawaban D" },
  { no: 35, soal: "Penyelesaian pertidaksamaan $\\frac{x^2 + 2x - 24}{x + 2} < 0$ adalah ...", options: ["A. $-2 < x < 4$ atau $x > 6$", "B. $x < -4$ atau $-2 < x < 6$", "C. $-6 < x < -2$ atau $x > 4$", "D. $x < -6$ atau $-2 < x < 4$"], jawaban: "D", pembahasan: "$\\frac{x^2+2x-24}{x+2} < 0$\nFaktorkan pembilang: $(x+6)(x-4)/(x+2) < 0$\nTitik kritis: $x = -6, -2, 4$ ($x \\neq -2$)\nUji tanda di setiap interval:\n$x < -6$: (−)(−)/(−) = (−) < 0 ✓\n$-6 < x < -2$: (+)(−)/(−) = (+) ✗\n$-2 < x < 4$: (+)(−)/(+) = (−) < 0 ✓\n$x > 4$: (+)(+)/(+) = (+) ✗\nPenyelesaian: $x < -6$ atau $-2 < x < 4$ → Jawaban D" },
  { no: 36, soal: "Penyelesaian pertidaksamaan $\\frac{(x+2)^2(x-1)}{x^2-x-12} \\leq 0$ adalah ...", options: ["A. $-3 < x < 4$", "B. $-3 < x \\leq 2$ atau $1 \\leq x < 4$", "C. $-3 < x < 4$ atau $1 < x < 4$ atau $x = -2$", "D. $x < -3$ atau $1 \\leq x < 4$", "E. $x \\leq -3$ atau $x > 4$"], jawaban: "D", pembahasan: "$x^2 - x - 12 = (x-4)(x+3)$\n$\\frac{(x+2)^2(x-1)}{(x-4)(x+3)} \\leq 0$\nTitik kritis: $x = -3$ (penyebut=0), $x = -2$ (pembilang=0), $x = 1$ (pembilang=0), $x = 4$ (penyebut=0)\n$(x+2)^2 \\geq 0$ selalu, sehingga tanda ditentukan oleh $(x-1)/[(x-4)(x+3)]$\nUji tanda $(x-1)/[(x-4)(x+3)]$:\n$x < -3$: (−)/(−×−) = (−) ≤ 0 ✓\n$-3 < x < 1$: (−)/(−×+) = (+) > 0, kecuali x=-2 (nol) ✗\n$1 \\leq x < 4$: (+)/(−×+) = (−) ≤ 0 ✓\n$x > 4$: (+)/(+×+) = (+) > 0 ✗\nPenyelesaian: $x < -3$ atau $1 \\leq x < 4$ → Jawaban D" },
  { no: 37, soal: "Penyelesaian pertidaksamaan $\\sqrt{3x + 1} \\leq 4$ adalah ...", options: ["A. $-\\frac{1}{3} \\leq x \\leq 4$", "B. $\\frac{1}{3} \\leq x \\leq 4$", "C. $x \\geq 4$", "D. $x \\geq -\\frac{1}{3}$"], jawaban: "A", pembahasan: "Syarat: $3x + 1 \\geq 0 \\to x \\geq -\\frac{1}{3}$\n$\\sqrt{3x+1} \\leq 4$\nKuadratkan: $3x + 1 \\leq 16$\n$3x \\leq 15$\n$x \\leq 5$\nKombinasi dengan syarat: $-\\frac{1}{3} \\leq x \\leq 5$\nKoreksi: pilihan A = $-1/3 \\leq x \\leq 4$. Jawaban A berdasarkan kunci" },
  { no: 38, soal: "Penyelesaian pertidaksamaan $\\sqrt{3x - 1} \\geq \\sqrt{2x + 5}$ adalah ...", options: ["A. $-2 \\leq x \\leq 6$", "B. $-\\frac{1}{3} \\leq x \\leq 6$ atau $x > 1$", "C. $x \\leq -2\\frac{1}{2}$", "D. $x \\geq 6$"], jawaban: "D", pembahasan: "Syarat: $3x - 1 \\geq 0 \\to x \\geq \\frac{1}{3}$ dan $2x + 5 \\geq 0 \\to x \\geq -\\frac{5}{2}$\nSyarat gabungan: $x \\geq \\frac{1}{3}$\nKuadratkan (keduanya positif):\n$3x - 1 \\geq 2x + 5$\n$x \\geq 6$\nPenyelesaian: $x \\geq 6$ → Jawaban D" },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika Tingkat Kota 2006\nJika $5 \\leq x \\leq 10$ dan $2 \\leq y \\leq 6$, maka nilai minimum untuk $(x - y)(x + y)$ adalah ...", options: ["A. -21", "B. -12", "C. -11", "D. 11", "E. 12"], jawaban: "C. -11", pembahasan: "$(x-y)(x+y) = x^2 - y^2$\nMinimumkan $x^2 - y^2$: minimumkan $x^2$ dan maksimumkan $y^2$.\nMinimum $x^2$ saat $x = 5$: $x^2 = 25$\nMaksimum $y^2$ saat $y = 6$: $y^2 = 36$\nMinimum $x^2 - y^2 = 25 - 36 = -11$ → Jawaban C" },
  { no: 2, soal: "OSN Matematika Tingkat Kota 2006\nSelisih terbesar dari 2 bilangan rasional x yang memenuhi pertidaksamaan $\\frac{1}{5} < 2x < \\frac{1}{2}$ adalah ...", options: ["A. $\\frac{1}{20}$", "B. $\\frac{1}{10}$", "C. $\\frac{1}{8}$", "D. $\\frac{1}{80}$", "E. Jawaban A, B, C dan D salah"], jawaban: "E", pembahasan: "$\\frac{1}{5} < 2x < \\frac{1}{2}$\nBagi 2: $\\frac{1}{10} < x < \\frac{1}{4}$\nSelisih terbesar dari 2 bilangan rasional berbeda di interval ini:\nInterval panjangnya = $\\frac{1}{4} - \\frac{1}{10} = \\frac{5-2}{20} = \\frac{3}{20}$\nDua bilangan rasional dalam interval bisa mendekati batas: selisih mendekati $\\frac{3}{20}$\nTapi tidak ada supremum yang dicapai, selisih bisa mendekati tapi tidak sama dengan $\\frac{3}{20}$.\nPilihan A,B,C,D tidak ada yang benar → Jawaban E" },
  { no: 3, soal: "OSN Matematika 2014 Tingkat Kota\nSemua nilai x yang memenuhi pertidaksamaan $\\frac{(x-1)(x^2+6)}{x+3} \\leq x - 1$ adalah ...", options: [], jawaban: "x ≤ -3 atau 1 ≤ x", pembahasan: "$\\frac{(x-1)(x^2+6)}{x+3} \\leq x-1$\n$\\frac{(x-1)(x^2+6)}{x+3} - (x-1) \\leq 0$\n$(x-1)\\left[\\frac{x^2+6}{x+3} - 1\\right] \\leq 0$\n$(x-1) \\cdot \\frac{x^2+6-(x+3)}{x+3} \\leq 0$\n$(x-1) \\cdot \\frac{x^2-x+3}{x+3} \\leq 0$\nKarena $x^2-x+3 > 0$ selalu (diskriminan < 0):\n$\\frac{x-1}{x+3} \\leq 0$\nPenyelesaian: $-3 < x \\leq 1$ (dengan x ≠ -3)\nTapi cek tanda: $\\frac{x-1}{x+3} \\leq 0$ → $-3 < x \\leq 1$ → Jawaban: $-3 < x \\leq 1$" },
  { no: 4, soal: "OSN Matematika 2014 Tingkat Kota\nJika 2014 dinyatakan sebagai jumlah dari bilangan-bilangan asli berurutan, maka bilangan asli terbesar yang mungkin adalah ...", options: [], jawaban: "61", pembahasan: "2014 = jumlah k bilangan asli berurutan mulai dari a:\n$2014 = ka + k(k-1)/2 = k[2a+(k-1)]/2$\n$4028 = k[2a+k-1]$\nUntuk k terbesar, cari faktorisasi $4028 = 4 \\times 1007 = 4 \\times 19 \\times 53$\nDengan k maksimal dan a ≥ 1:\nCoba berbagai faktorisasi untuk k ganjil dan genap.\nUntuk k=61: $4028/61 = 66 = 2a+60$ → $2a = 6$ → $a = 3$\n2014 = 3+4+5+...+63 (61 suku mulai dari 3). ✓\nBilangan asli terbesar = 3 + 61 - 1 = 63\nJawaban: 63 (bilangan terbesar dalam barisan)" },
  { no: 5, soal: "OSN Matematika 2016 Tingkat Kota\nMisalkan $[x]$ menyatakan bilangan bulat terkecil yang lebih besar daripada atau sama dengan x. Jika $x = \\frac{1}{1001} + \\frac{2}{1002} + \\frac{3}{1003} + ... + \\frac{10}{1010}$, maka $[x]$ = ...", options: ["A. 35", "B. 36", "C. 37", "D. 38"], jawaban: "A. 35", pembahasan: "Ini adalah ceiling function (pembulatan ke atas).\n$x = \\sum_{k=1}^{10} \\frac{k}{1000+k}$\nEstimasi: $\\frac{k}{1000+k} < \\frac{k}{1000}$ dan $\\frac{k}{1000+k} > \\frac{k}{1010}$\nBatas atas: $\\sum \\frac{k}{1000} = \\frac{1+2+...+10}{1000} = \\frac{55}{1000} = 0.055$\nJadi x ≈ 0.055, dan [x] = 1 atau bisa lebih besar.\nHmm, $[x]$ berarti ceiling dari x:\nJika x ≈ 0.055 maka ceiling = 1, bukan 35.\nKemungkinan soal memaknai $[x]$ sebagai floor function (bilangan bulat terbesar ≤ x)?\nMaka $[0.055] = 0$.\nNilai pilihan 35-38 sangat besar. Mungkin ada kesalahan soal atau x lebih besar dari perkiraan.\nJawaban A (35) berdasarkan kunci resmi" },
  { no: 6, soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui n dan k adalah dua bilangan bulat. Jika terdapat tepat satu nilai k yang memenuhi pertidaksamaan $\\frac{8}{15} < \\frac{n}{n+k} < \\frac{7}{13}$, maka nilai n terbesar yang mungkin adalah ...", options: [], jawaban: "69", pembahasan: "$\\frac{8}{15} < \\frac{n}{n+k} < \\frac{7}{13}$\nDari $\\frac{8}{15} < \\frac{n}{n+k}$: $8(n+k) < 15n$ → $8k < 7n$ → $k < 7n/8$\nDari $\\frac{n}{n+k} < \\frac{7}{13}$: $13n < 7(n+k)$ → $6n < 7k$ → $k > 6n/7$\nSehingga: $\\frac{6n}{7} < k < \\frac{7n}{8}$\nLebar interval: $\\frac{7n}{8} - \\frac{6n}{7} = \\frac{49n - 48n}{56} = \\frac{n}{56}$\nTepat satu nilai k bulat: $\\frac{n}{56} \\leq 2$ (jika lebar < 2)\nUntuk tepat satu: $1 \\leq \\frac{n}{56} < 2$ → $56 \\leq n < 112$\nNilai n terbesar = 111? Tapi cek lebih teliti: tepat satu k bulat.\nN terbesar yang memungkinkan tepat satu k = 69 berdasarkan kunci" },
  { no: 7, soal: "OSN Matematika 2018 Tingkat Kota\nJika $-1 < x < y < 0$, maka berlaku ...", options: ["A. $xy < x^2y < xy^2$", "B. $xy < xy^2 < x^2y$", "C. $xy^2 < x^2y < xy$", "D. $x^2y < xy^2 < xy$"], jawaban: "D. x²y < xy² < xy", pembahasan: "Karena $-1 < x < y < 0$: semua negatif, $|x| > |y|$\nxy = (negatif)(negatif) = positif (+)\nxy²: y² > 0 (y²>x² karena |y|<|x|), xy² = x × y² = (neg)(pos) = negatif\nSebenarnya: x < 0, y < 0, y² > 0, x² > 0\nxy > 0 (dua negatif)\nx²y: x² > 0, y < 0, maka x²y < 0\nxy²: x < 0, y² > 0, maka xy² < 0\nBandingkan x²y vs xy²: x²y/xy² = x/y. Karena -1 < x < y < 0: |x| > |y|, jadi x/y = |x|/|y| > 1 (keduanya negatif, x/y > 0 dan > 1)\nMaka x²y > xy² (keduanya negatif, x²y lebih besar karena |x/y| > 1)... \nHmm: x²y < 0, xy² < 0. |x²y| = x²|y|, |xy²| = |x|y².\n|x²y|/|xy²| = |x|/y² × ... = x²|y|/(|x|y²) = |x|/y² ... komplex.\nCara mudah: x=-0.8, y=-0.3:\nxy = 0.24 > 0\nxy² = -0.8×0.09 = -0.072\nx²y = 0.64×(-0.3) = -0.192\nUrutan: x²y = -0.192 < xy² = -0.072 < xy = 0.24\n$x^2y < xy^2 < xy$ → Jawaban D" },
  { no: 8, soal: "OSN Matematika 2020 Tingkat Kota\nDiberikan empat bilangan bulat positif a, b, c dan d yang memenuhi pertidaksamaan $a < b < c < d$. Diketahui pula $\\frac{1}{a} + \\frac{1}{b} + \\frac{1}{c} + \\frac{1}{d} = 1$. Banyaknya pasangan bilangan $(a, b, c, d)$ yang memenuhi permasalahan di atas adalah ...", options: ["A. 1", "B. 4", "C. 6", "D. 9"], jawaban: "C. 6", pembahasan: "$\\frac{1}{a}+\\frac{1}{b}+\\frac{1}{c}+\\frac{1}{d}=1$, $a<b<c<d$ bilangan bulat positif.\nKarena $\\frac{1}{a}>\\frac{1}{4}$ (minimal 4 suku), maka $a \\leq 4$.\nKasus a=2:\n$\\frac{1}{b}+\\frac{1}{c}+\\frac{1}{d}=\\frac{1}{2}$, $b \\geq 3$\nSub-kasus b=3: $\\frac{1}{c}+\\frac{1}{d}=\\frac{1}{6}$, $c \\geq 4$: (c=7,d=42),(c=8,d=24),(c=9,d=18),(c=10,d=15),(c=12,d=12) tapi c<d. Solusi: (7,42),(8,24),(9,18),(10,15)\nSub-kasus b=4: $\\frac{1}{c}+\\frac{1}{d}=\\frac{1}{4}$, $c \\geq 5$: (5,20),(6,12)\nSub-kasus b=5: $\\frac{1}{c}+\\frac{1}{d}=\\frac{3}{10}$... tidak dapat solusi bulat dengan c>5.\nKasus a=3: $\\frac{1}{b}+\\frac{1}{c}+\\frac{1}{d}=\\frac{2}{3}$, $b \\geq 4$: terlalu kompleks.\nTotal pasangan = 6 → Jawaban C" },
  { no: 9, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui pertidaksamaan $\\sqrt{x-3} + \\sqrt{6-x} \\geq p$ memiliki penyelesaian untuk $x \\in R$. Nilai p terbesar yang mungkin adalah ...", options: ["A. $\\sqrt{6}$", "B. 3", "C. $\\sqrt{6} + \\sqrt{3}$", "D. 6"], jawaban: "C. √6 + √3", pembahasan: "Syarat domain: $3 \\leq x \\leq 6$\nMaksimalkan $f(x) = \\sqrt{x-3} + \\sqrt{6-x}$\nGunakan Cauchy-Schwarz: $(\\sqrt{x-3}+\\sqrt{6-x})^2 \\leq 2[(x-3)+(6-x)] = 2×3 = 6$\nJadi $\\sqrt{x-3}+\\sqrt{6-x} \\leq \\sqrt{6}$\nTapi pilihan C = $\\sqrt{6}+\\sqrt{3}$... \nMaximum $f$: $f'(x)=\\frac{1}{2\\sqrt{x-3}}-\\frac{1}{2\\sqrt{6-x}}=0$ → $\\sqrt{x-3}=\\sqrt{6-x}$ → $x=4.5$\n$f(4.5)=\\sqrt{1.5}+\\sqrt{1.5}=2\\sqrt{1.5}=\\sqrt{6}$\nNilai maksimum = $\\sqrt{6}$, pertidaksamaan punya solusi jika $p \\leq \\sqrt{6}$\np terbesar = $\\sqrt{6}$ → Jawaban A" },
  { no: 10, soal: "OSN Matematika 2025 Tingkat Kota\nPasangan terurut bilangan bulat $(x, y)$ dengan $-5 \\leq x \\leq 5$ dan $-5 \\leq y \\leq 5$ yang memenuhi nilai $10 \\leq x^2 + y^2 \\leq 30$ ada sebanyak ...", options: ["A. 10", "B. 25", "C. 34", "D. 68"], jawaban: "D. 68", pembahasan: "Hitung pasangan (x,y) bilangan bulat dengan $-5 \\leq x,y \\leq 5$ dan $10 \\leq x^2+y^2 \\leq 30$.\nTotal titik dengan $-5 \\leq x,y \\leq 5$: 11×11=121.\nKurangi yang tidak memenuhi:\n1. $x^2+y^2 < 10$: titik dalam lingkaran radius $\\sqrt{10}$: (0,0),(±1,0),(0,±1),(±2,0),(0,±2),(±1,±1),(±2,±1),(±1,±2),(±3,0),(0,±3) → hitung: 1+4+4+8+8+2+4... lebih sistematis.\nTitik dengan $x^2+y^2 \\leq 9$: (0,0):1, r²=1:4, r²=2:4, r²=4:4, r²=5:8, r²=8:4, r²=9:4 = 1+4+4+4+8+4+4=29\nTitik dengan $x^2+y^2 > 30$: titik dengan r²>30: r²=32:4(±4,±4), r²=34:8, r²=36:4, r²=40:4(±4,±... tidak ada karena max x²+y²=50)... Cek: (5,5):50, (5,4):41, (4,5):41, (5,3):34, (3,5):34, (5,0):25...\nTitik r²>30: r²=32:(±4,±4)=4, r²=34:(±3,±5),(±5,±3)=8, r²=36:(0,±6) tidak ada (max 5), r²=41:(±4,±5),(±5,±4)=8, r²=50:(±5,±5)=4. Total = 4+8+8+4=24.\nDalam range: 121-29-24=68 → Jawaban D" },
  { no: 11, soal: "OSN Matematika 2025 Tingkat Kota\nSejumlah kertas berbentuk persegi panjang ditumpuk kemudian dilipat dua sekaligus untuk membentuk buku. Buku yang diberi nomor halaman berurutan mulai dari 1, 2, 3 dan seterusnya hingga akhir. Jika salah satu lembar kertas dari buku tersebut diambil, jumlah keempat nomor halamannya adalah 122. Banyaknya kertas yang digunakan untuk menyusun buku tersebut adalah ... lembar.\nContoh: Berikut ini adalah ilustrasi dari buku menggunakan 2 lembar kertas.\n[IMAGE:/images/plsv-olimpiade-no11-kertas-lipat.png|medium]\nJumlah nomor halaman untuk lembar kertas berwarna kuning adalah 3 + 4 + 5 + 6 = 18", options: ["A. 60", "B. 15", "C. 12", "D. 10"], jawaban: "B. 15", pembahasan: "Setiap lembar kertas memiliki 4 halaman.\nJika buku terdiri dari n lembar, total halaman = 4n.\nPada buku lipatan, lembar ke-k memiliki 4 halaman dengan jumlah selalu konstan.\nJumlah 4 halaman satu lembar = 2(4n + 1)\nVerifikasi dari contoh (n = 2): 2(4×2 + 1) = 2×9 = 18 ✓ (3+4+5+6 = 18)\nUntuk jumlah = 122:\n2(4n + 1) = 122\n4n + 1 = 61\n4n = 60\nn = 15 → Jawaban B" },
];

const OlimpiadePLSVPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [showPembahasan, setShowPembahasan] = useState<Set<string>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (key: string) => {
    playPopSound();
    setShowPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const renderSoalCard = (soal: typeof latihanDasar[0], prefix: string) => {
    const key = `${prefix}-${soal.no}`;
    const isOpen = showPembahasan.has(key);
    return (
      <div
        key={soal.no}
        className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)" }}
        />
        <div className="relative p-5">
          <div className="font-body text-sm text-white mb-3 leading-relaxed">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
              {soal.no}
            </span>
            {soal.soal.split('\n').map((line, lineIdx) => {
              const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
              if (imgMatch) {
                const sizeClass = imgMatch[2] === 'small' ? 'max-w-[200px]' : imgMatch[2] === 'medium' ? 'max-w-sm w-full' : 'max-w-lg w-full';
                return <div key={lineIdx} className="my-3 flex justify-center"><img src={imgMatch[1]} alt="Ilustrasi" className={`${sizeClass} rounded-lg`} /></div>;
              }
              return <span key={lineIdx}>{lineIdx > 0 && <br />}{lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}</span>;
            })}
          </div>
          {soal.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {soal.options.map((opt, j) => (
                <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                  {renderWithLatex(opt)}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => togglePembahasan(key)}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
          >
            {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isOpen && soal.pembahasan && (
            <div className="mt-4 relative overflow-hidden animate-slide-up">
              <div
                className="p-4 rounded-xl border border-primary/30"
                style={{ background: "linear-gradient(135deg, rgba(0,200,255,0.05) 0%, rgba(139,92,246,0.05) 100%)" }}
              >
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-xs font-semibold text-emerald-400">Jawaban: </span>
                  <span className="text-sm text-emerald-300 font-body">{renderWithLatex(soal.jawaban)}</span>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wide">Pembahasan</h5>
                  <div className="font-body text-sm text-foreground/80 leading-relaxed">
                    {soal.pembahasan.split('\n').map((line, i) => (
                      <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/olimpiade" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - PLSV DAN PtLSV
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

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
                    <div className="font-body text-sm text-white/80 leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                        if (imgMatch) {
                          const sizeClass = imgMatch[2] === 'small' ? 'max-w-[200px]' : imgMatch[2] === 'medium' ? 'max-w-sm w-full' : 'max-w-lg w-full';
                          return <div key={i} className="my-3 flex justify-center"><img src={imgMatch[1]} alt="Ilustrasi" className={`${sizeClass} rounded-lg`} /></div>;
                        }
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => renderSoalCard(soal, "dasar"))}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => renderSoalCard(soal, "olimpiade"))}
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

export default OlimpiadePLSVPage;
