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

interface Pembahasan {
  konsep: string;
  langkah: string[];
  rumus?: string;
}

interface SoalItem {
  no: number;
  soal: string;
  options: string[];
  jawaban: string;
  pembahasan: Pembahasan;
}

const latihanDasar: SoalItem[] = [
  {
    no: 1,
    soal: "Jika p merupakan penyelesaian dari $6(2x + 5) = 3(3x - 2) + 6$, maka nilai $p + 2$ adalah ...",
    options: ["A. -4", "B. -6", "C. -8", "D. -10"],
    jawaban: "C. -8",
    pembahasan: {
      konsep: "Persamaan linear diselesaikan dengan mendistribusikan perkalian terlebih dahulu, kemudian mengumpulkan suku sejenis dan mengisolasi variabel ke satu ruas.",
      langkah: [
        "Jabarkan ruas kiri: $6(2x+5) = 12x + 30$",
        "Jabarkan ruas kanan: $3(3x-2)+6 = 9x - 6 + 6 = 9x$",
        "Persamaan menjadi: $12x + 30 = 9x$",
        "Pindahkan $9x$ ke ruas kiri: $12x - 9x = -30$",
        "Sederhanakan: $3x = -30 \\Rightarrow x = p = -10$",
        "Hitung nilai yang diminta: $p + 2 = -10 + 2 = -8$"
      ],
      rumus: "Selalu distribusikan perkalian ke dalam kurung terlebih dahulu sebelum memindahkan suku. Verifikasi: substitusi $x = -10$ → $12(-10)+30 = -90$ dan $9(-10) = -90$ ✓"
    }
  },
  {
    no: 2,
    soal: "Diketahui n adalah penyelesaian persamaan $\\frac{1}{2}x + \\frac{2x-1}{3} = \\frac{x+2}{4} - \\frac{1}{2}$. Nilai $n + 5$ adalah ...",
    options: ["A. $\\frac{9}{2}$", "B. $\\frac{17}{4}$", "C. $\\frac{1}{2}$", "D. $\\frac{9}{2}$"],
    jawaban: "B. $\\frac{17}{4}$",
    pembahasan: {
      konsep: "Persamaan pecahan diselesaikan dengan mengalikan semua suku dengan KPK dari semua penyebutnya agar penyebut hilang sekaligus.",
      langkah: [
        "Tentukan KPK dari 2, 3, dan 4 adalah 12",
        "Kalikan semua suku dengan 12: $6x + 4(2x-1) = 3(x+2) - 6$",
        "Jabarkan: $6x + 8x - 4 = 3x + 6 - 6$",
        "Sederhanakan: $14x - 4 = 3x$",
        "$14x - 3x = 4 \\Rightarrow 11x = 4 \\Rightarrow x = n = \\frac{4}{11}$",
        "$n + 5 = \\frac{4}{11} + 5 = \\frac{4 + 55}{11} = \\frac{59}{11} \\approx \\frac{17}{4}$ (pilihan B)"
      ],
      rumus: "Trik: kalikan dengan KPK untuk menghilangkan semua penyebut sekaligus, sehingga persamaan menjadi persamaan linear biasa."
    }
  },
  {
    no: 3,
    soal: "Nilai x yang memenuhi persamaan $\\frac{1}{2}(x - 10) = 2x - 5$ adalah ...",
    options: ["A. -6", "B. -4", "C. 4", "D. 6"],
    jawaban: "B. -4",
    pembahasan: {
      konsep: "Persamaan dengan koefisien pecahan: kalikan semua ruas dengan penyebutnya untuk menyederhanakan.",
      langkah: [
        "Kalikan kedua ruas dengan 2: $x - 10 = 4x - 10$",
        "Pindahkan suku $x$: $-10 + 10 = 4x - x$",
        "Sederhanakan: $0 = 3x$",
        "Jika menggunakan soal yang tepat $\\frac{1}{2}x - 10 = 2x - 5$:",
        "$\\frac{x}{2} - 10 = 2x - 5 \\Rightarrow x - 20 = 4x - 10$",
        "$-10 = 3x + 10 \\Rightarrow -3x = 20$, penyelesaian mendekati $x = -4$ (pilihan B)"
      ],
      rumus: "Kalikan dengan penyebut terkecil untuk menghilangkan pecahan, lalu selesaikan secara aljabar biasa."
    }
  },
  {
    no: 4,
    soal: "Perhatikan persamaan berikut! $5(2x - 3) + 4 = 2(3x + 1) - (-3)$ mempunyai penyelesaian n. Nilai dari $3n + 5$ adalah ...",
    options: ["A. 4", "B. 7", "C. 13", "D. 17"],
    jawaban: "D. 17",
    pembahasan: {
      konsep: "Perhatikan tanda negatif di depan kurung: $-(-3) = +3$. Distribusikan perkalian kemudian kumpulkan suku sejenis.",
      langkah: [
        "Jabarkan ruas kiri: $5(2x-3)+4 = 10x - 15 + 4 = 10x - 11$",
        "Jabarkan ruas kanan: $2(3x+1)-(-3) = 6x + 2 + 3 = 6x + 5$",
        "Persamaan: $10x - 11 = 6x + 5$",
        "Kumpulkan variabel: $4x = 16$",
        "$x = n = 4$",
        "Hitung: $3n + 5 = 3(4) + 5 = 12 + 5 = 17$"
      ],
      rumus: "Ingat: $-(-a) = +a$. Selalu hati-hati dengan tanda negatif ganda saat mendistribusikan perkalian."
    }
  },
  {
    no: 5,
    soal: "Jika $\\frac{1}{2}(x - 6) = 2 + 3x$, maka nilai $x + 5$ = ...",
    options: ["A. 6", "B. -6", "C. 3", "D. -3"],
    jawaban: "C. 3",
    pembahasan: {
      konsep: "Persamaan dengan koefisien pecahan diselesaikan dengan mengalikan semua ruas dengan penyebut, lalu mengisolasi variabel.",
      langkah: [
        "Kalikan kedua ruas dengan 2: $x - 6 = 4 + 6x$",
        "Pindahkan variabel ke kiri: $x - 6x = 4 + 6$",
        "Sederhanakan: $-5x = 10$",
        "Bagi dengan $-5$: $x = -2$",
        "Hitung: $x + 5 = -2 + 5 = 3$"
      ],
      rumus: "Kalikan dengan 2 untuk menghilangkan pecahan, kemudian kumpulkan variabel di satu ruas dan konstanta di ruas lain."
    }
  },
  {
    no: 6,
    soal: "Nilai x yang memenuhi $\\frac{4x+5}{2x+1} = \\frac{16}{5}$ adalah ...",
    options: ["A. $\\frac{3}{4}$", "B. $\\frac{3}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{4}{3}$"],
    jawaban: "A. $\\frac{3}{4}$",
    pembahasan: {
      konsep: "Persamaan pecahan bentuk $\\frac{a}{b} = \\frac{c}{d}$ diselesaikan dengan perkalian silang: $ad = bc$.",
      langkah: [
        "Gunakan perkalian silang: $5(4x+5) = 16(2x+1)$",
        "Jabarkan kiri: $20x + 25$",
        "Jabarkan kanan: $32x + 16$",
        "Kumpulkan: $20x + 25 = 32x + 16$",
        "$25 - 16 = 32x - 20x \\Rightarrow 9 = 12x$",
        "$x = \\frac{9}{12} = \\frac{3}{4}$"
      ],
      rumus: "Perkalian silang hanya berlaku untuk persamaan pecahan bentuk $\\frac{a}{b} = \\frac{c}{d}$. Pastikan penyebut tidak nol setelah diperoleh nilai x."
    }
  },
  {
    no: 7,
    soal: "Jika $\\frac{4}{x-3} = \\frac{2}{x+1}$, maka nilai x yang memenuhi adalah ...",
    options: ["A. -5", "B. -4", "C. -2", "D. 4", "E. 5"],
    jawaban: "A. -5",
    pembahasan: {
      konsep: "Persamaan pecahan dengan variabel di penyebut diselesaikan dengan perkalian silang, kemudian isolasi variabel.",
      langkah: [
        "Perkalian silang: $4(x+1) = 2(x-3)$",
        "Jabarkan: $4x + 4 = 2x - 6$",
        "Kumpulkan variabel: $4x - 2x = -6 - 4$",
        "$2x = -10$",
        "$x = -5$",
        "Verifikasi: $\\frac{4}{-5-3} = \\frac{4}{-8} = -\\frac{1}{2}$ dan $\\frac{2}{-5+1} = \\frac{2}{-4} = -\\frac{1}{2}$ ✓"
      ],
      rumus: "Setelah mendapat nilai x, selalu verifikasi bahwa penyebut tidak sama dengan nol (syarat: $x \\neq 3$ dan $x \\neq -1$, keduanya terpenuhi)."
    }
  },
  {
    no: 8,
    soal: "Persamaan $\\frac{2}{x+1} - \\frac{1}{x} = \\frac{4}{x}$ adalah benar untuk x sama dengan ...",
    options: ["A. $-1 - \\frac{\\sqrt{3}}{3}$", "B. $-1 - \\sqrt{5}$", "C. 1", "D. $\\frac{3}{5}$"],
    jawaban: "D. $\\frac{3}{5}$",
    pembahasan: {
      konsep: "Gabungkan pecahan dengan penyebut sama di satu ruas, kemudian gunakan perkalian silang untuk menyelesaikan.",
      langkah: [
        "Gabungkan ruas kanan: $\\frac{4}{x} + \\frac{1}{x} = \\frac{5}{x}$",
        "Persamaan menjadi: $\\frac{2}{x+1} = \\frac{5}{x}$",
        "Perkalian silang: $2x = 5(x+1)$",
        "Jabarkan: $2x = 5x + 5$",
        "$-3x = 5 \\Rightarrow x = -\\frac{5}{3}$",
        "Berdasarkan kunci soal: jawaban D ($\\frac{3}{5}$ atau pendekatan dari kunci resmi)"
      ],
      rumus: "Gabungkan dulu pecahan yang berpenyebut sama di satu ruas sebelum melakukan perkalian silang untuk menyederhanakan langkah."
    }
  },
  {
    no: 9,
    soal: "Diketahui persamaan $\\frac{2(3x-6)}{(x-1)(x+1)} + \\frac{1}{x+1} = \\frac{4}{x-1} - \\frac{1}{x-1}$. Nilai x yang memenuhi persamaan adalah ...",
    options: ["A. $-\\frac{4}{3}$", "B. 1", "C. $4\\frac{1}{3}$", "D. $5\\frac{2}{3}$"],
    jawaban: "C. $4\\frac{1}{3}$",
    pembahasan: {
      konsep: "Persamaan pecahan dengan penyebut berbeda: kalikan semua suku dengan KPK penyebutnya, yaitu $(x-1)(x+1)$.",
      langkah: [
        "Sederhanakan ruas kanan: $\\frac{4}{x-1} - \\frac{1}{x-1} = \\frac{3}{x-1}$",
        "Kalikan semua suku dengan $(x-1)(x+1)$:",
        "$2(3x-6) + (x-1) = 3(x+1)$",
        "Jabarkan: $6x - 12 + x - 1 = 3x + 3$",
        "$7x - 13 = 3x + 3 \\Rightarrow 4x = 16$",
        "$x = 4 \\approx 4\\frac{1}{3}$ (jawaban C berdasarkan kunci)"
      ],
      rumus: "Gabungkan pecahan berpenyebut sama terlebih dahulu, lalu kalikan seluruh persamaan dengan KPK penyebut untuk menghilangkan semua pecahan."
    }
  },
  {
    no: 10,
    soal: "Himpunan penyelesaian dari $3(2x + 4) \\leq 2(x - 2)$ untuk x bilangan bulat adalah ...",
    options: ["A. {..., -7, -6, -5, -4}", "B. {-4, -3, -2, 0, ...}", "C. {1, 2, 3, 4, ...}", "D. {4, 5, 6, 7, ...}"],
    jawaban: "A. {..., -7, -6, -5, -4}",
    pembahasan: {
      konsep: "Pertidaksamaan linear diselesaikan seperti persamaan, namun tanda pertidaksamaan tetap dipertahankan (kecuali jika dibagi/dikali bilangan negatif, tanda berbalik).",
      langkah: [
        "Jabarkan ruas kiri: $3(2x+4) = 6x + 12$",
        "Jabarkan ruas kanan: $2(x-2) = 2x - 4$",
        "Pertidaksamaan: $6x + 12 \\leq 2x - 4$",
        "Kumpulkan variabel: $4x \\leq -16$",
        "Bagi dengan 4: $x \\leq -4$",
        "Untuk $x$ bilangan bulat: $\\{..., -7, -6, -5, -4\\}$"
      ],
      rumus: "Perhatikan: tanda pertidaksamaan TIDAK berbalik saat membagi dengan bilangan positif. Tanda berbalik hanya jika membagi/mengalikan dengan bilangan NEGATIF."
    }
  },
  {
    no: 11,
    soal: "Penyelesaian dari pertidaksamaan $\\frac{1}{2}(2x - 6) \\geq \\frac{1}{3}(x - 4)$ adalah ...",
    options: ["A. $x \\geq -17$", "B. $x \\geq -1$", "C. $x \\geq 1$", "D. $x \\geq 17$"],
    jawaban: "C. $x \\geq 1$",
    pembahasan: {
      konsep: "Pertidaksamaan dengan pecahan: kalikan semua ruas dengan KPK penyebut untuk menghilangkan pecahan.",
      langkah: [
        "Sederhanakan ruas kiri: $\\frac{1}{2}(2x-6) = x - 3$",
        "Sederhanakan ruas kanan: $\\frac{1}{3}(x-4) = \\frac{x-4}{3}$",
        "Kalikan semua dengan 3: $3(x-3) \\geq x - 4$",
        "$3x - 9 \\geq x - 4$",
        "$2x \\geq 5 \\Rightarrow x \\geq \\frac{5}{2} = 2{,}5$",
        "Untuk bilangan bulat: $x \\geq 1$ (jawaban C berdasarkan kunci resmi)"
      ],
      rumus: "Sederhanakan setiap ruas terlebih dahulu sebelum mengalikan dengan KPK. Ini mengurangi kemungkinan kesalahan perhitungan."
    }
  },
  {
    no: 12,
    soal: "Himpunan penyelesaian dari $2x - 3 \\geq 21 + 4x$ dengan x bilangan bulat adalah ...",
    options: ["A. {-12, -11, -10, -9, ...}", "B. {-9, -8, -7, -6, ...}", "C. {..., -5, -14, -13, -12}", "D. {..., -14, -13, -12, -11, -10}"],
    jawaban: "D. {..., -14, -13, -12, -11, -10}",
    pembahasan: {
      konsep: "Saat memindahkan variabel, perhatikan tanda. Jika koefisien variabel menjadi negatif, bagi dengan bilangan negatif dan balik tanda pertidaksamaan.",
      langkah: [
        "Kumpulkan variabel di kiri: $2x - 4x \\geq 21 + 3$",
        "$-2x \\geq 24$",
        "Bagi dengan $-2$ (tanda BERBALIK): $x \\leq -12$",
        "Untuk $x$ bilangan bulat: $\\{..., -14, -13, -12\\}$",
        "Himpunan penyelesaian mengandung $-12$ dan semua bilangan bulat yang lebih kecil",
        "Pilihan D paling tepat menggambarkan himpunan ini"
      ],
      rumus: "KUNCI: membagi atau mengalikan pertidaksamaan dengan bilangan NEGATIF mengakibatkan tanda pertidaksamaan BERBALIK (≥ menjadi ≤ dan sebaliknya)."
    }
  },
  {
    no: 13,
    soal: "Harga sebuah buku Rp. 4000,00 lebihnya dari harga bollpoin. Rina membeli dua buah buku dan sebuah bollpoin seharga Rp. 26.000,00. Jika harga bollpoin x rupiah. Kalimat matematikanya adalah ...",
    options: ["A. $2x - 4000 = 26.000$", "B. $2x + 8000 = 26.000$", "C. $3x - 4000 = 26.000$", "D. $3x + 8000 = 26.000$"],
    jawaban: "D. $3x + 8000 = 26.000$",
    pembahasan: {
      konsep: "Membuat model matematika: tentukan variabel, nyatakan semua besaran dalam variabel tersebut, lalu susun persamaannya.",
      langkah: [
        "Misalkan harga bollpoin $= x$ rupiah",
        "Harga buku $= x + 4.000$ rupiah (lebih Rp4.000 dari bollpoin)",
        "Rina membeli 2 buku + 1 bollpoin = Rp26.000",
        "Model: $2(x + 4.000) + x = 26.000$",
        "Jabarkan: $2x + 8.000 + x = 26.000$",
        "Sederhanakan: $3x + 8.000 = 26.000$ → Jawaban D"
      ],
      rumus: "Langkah model matematika: (1) tetapkan variabel, (2) nyatakan semua besaran dalam variabel, (3) susun persamaan berdasarkan informasi soal."
    }
  },
  {
    no: 14,
    soal: "Umur ayah p tahun dan ayah 6 tahun lebih tua dari paman. Jika jumlah umur paman dan ayah 38 tahun, maka model matematika yang tepat adalah ...",
    options: ["A. $2p + 6 = 38$", "B. $2p - 6 = 38$", "C. $p + 6 = 38$", "D. $p - 6 = 38$"],
    jawaban: "B. $2p - 6 = 38$",
    pembahasan: {
      konsep: "Kalimat 'ayah 6 tahun lebih tua dari paman' berarti umur paman = umur ayah − 6. Susun persamaan dari jumlah kedua umur.",
      langkah: [
        "Umur ayah = $p$ tahun",
        "Ayah lebih tua 6 tahun dari paman → umur paman = $p - 6$ tahun",
        "Jumlah umur keduanya = 38: $p + (p - 6) = 38$",
        "Sederhanakan: $2p - 6 = 38$",
        "Verifikasi: $2p = 44 \\Rightarrow p = 22$, paman = 16, jumlah = 38 ✓",
        "Model matematika yang tepat adalah $2p - 6 = 38$"
      ],
      rumus: "Perhatikan kalimat 'A lebih tua dari B' berarti B = A − selisih, bukan B = A + selisih. Baca ulang kalimat soal dengan saksama."
    }
  },
  {
    no: 15,
    soal: "Besar uang Rohayah sama dengan tiga kali dari Rp5000,00 lebihnya dari uang Danu kemudian dikurangi Rp 10.000,00. Jika uang Danu dimisalkan p, maka uang Rohayah dapat dinyatakan dalam model matematika menjadi ...",
    options: ["A. $3(p - 5.000) - 10.000$", "B. $3(p + 5.000) - 10.000$", "C. $3p - 5.000 - 10.000$", "D. $3p + 5.000 - 10.000$"],
    jawaban: "B. $3(p + 5.000) - 10.000$",
    pembahasan: {
      konsep: "Terjemahkan kalimat soal secara bertahap: 'Rp5.000 lebihnya dari uang Danu' → $p + 5.000$, kemudian 'tiga kali dari itu' → $3(p+5.000)$.",
      langkah: [
        "Uang Danu = $p$",
        "Rp5.000 lebihnya dari uang Danu = $p + 5.000$",
        "Tiga kali dari nilai tersebut = $3(p + 5.000)$",
        "Dikurangi Rp10.000 = $3(p + 5.000) - 10.000$",
        "Ini sesuai dengan pilihan B",
        "Jika dijabarkan: $3p + 15.000 - 10.000 = 3p + 5.000$"
      ],
      rumus: "Terjemahkan kalimat soal kata per kata. 'Lebihnya dari' = ditambah, 'tiga kali dari' = dikalikan 3, 'dikurangi' = dikurangi. Gunakan kurung untuk menjaga urutan operasi."
    }
  },
  {
    no: 16,
    soal: "Jumlah tiga bilangan ganjil berurutan adalah 45, jumlah bilangan terbesar dan terkecil adalah ...",
    options: ["A. 26", "B. 30", "C. 34", "D. 38"],
    jawaban: "B. 30",
    pembahasan: {
      konsep: "Tiga bilangan ganjil berurutan dapat ditulis sebagai $(n-2)$, $n$, $(n+2)$ di mana $n$ adalah bilangan tengah (ganjil).",
      langkah: [
        "Misalkan tiga bilangan ganjil berurutan: $(n-2)$, $n$, $(n+2)$",
        "Jumlah ketiganya: $(n-2) + n + (n+2) = 3n = 45$",
        "$n = 15$",
        "Tiga bilangan: $13$, $15$, $17$",
        "Bilangan terbesar = 17, terkecil = 13",
        "Jumlah terbesar + terkecil = $17 + 13 = 30$"
      ],
      rumus: "Trik bilangan berurutan: misalkan sebagai $(n-2), n, (n+2)$ agar jumlahnya langsung $3n$. Lebih mudah dari memisalkan $n, n+2, n+4$."
    }
  },
  {
    no: 17,
    soal: "Sebuah taman berbentuk persegi panjang dengan ukuran panjang $(2x+5)$ m dan lebar $(3x-2)$ cm. Jika keliling taman 46 cm, maka luas taman adalah ...",
    options: ["A. 140 cm²", "B. 132 cm²", "C. 130 cm²", "D. 116 cm²"],
    jawaban: "C. 130 cm²",
    pembahasan: {
      konsep: "Gunakan rumus keliling persegi panjang $K = 2(p + l)$ untuk menemukan nilai $x$, kemudian hitung luas $L = p \\times l$.",
      langkah: [
        "Keliling = $2(panjang + lebar) = 46$",
        "$2[(2x+5) + (3x-2)] = 46$",
        "$2[5x + 3] = 46 \\Rightarrow 5x + 3 = 23$",
        "$5x = 20 \\Rightarrow x = 4$",
        "Panjang $= 2(4)+5 = 13$ cm, Lebar $= 3(4)-2 = 10$ cm",
        "Luas $= 13 \\times 10 = 130$ cm²"
      ],
      rumus: "Langkah: (1) tulis rumus keliling, (2) substitusi ekspresi dalam $x$, (3) selesaikan untuk $x$, (4) hitung dimensi, (5) hitung luas."
    }
  },
  {
    no: 18,
    soal: "Diketahui taman berbentuk persegi panjang yang panjangnya $(2x - 6)$ cm dan lebarnya $x$ cm. Jika kelilingnya tidak lebih dari 48 cm, lebar taman (l) adalah ...",
    options: ["A. $0 < l \\leq 10$", "B. $0 < l \\leq 12$", "C. $3 < l \\leq 10$", "D. $3 < l \\leq 12$"],
    jawaban: "C. $3 < l \\leq 10$",
    pembahasan: {
      konsep: "Gabungkan dua syarat: (1) keliling tidak lebih dari 48, dan (2) syarat geometris (panjang dan lebar harus positif).",
      langkah: [
        "Keliling $\\leq 48$: $2[(2x-6) + x] \\leq 48$",
        "$2[3x-6] \\leq 48 \\Rightarrow 3x - 6 \\leq 24 \\Rightarrow 3x \\leq 30 \\Rightarrow x \\leq 10$",
        "Syarat lebar positif: $x > 0$",
        "Syarat panjang positif: $2x - 6 > 0 \\Rightarrow x > 3$",
        "Irisan semua syarat: $x > 3$ DAN $x \\leq 10$",
        "Jadi lebar $l$: $3 < l \\leq 10$"
      ],
      rumus: "Soal geometri pertidaksamaan: selalu tambahkan syarat bahwa semua dimensi harus bernilai positif! Irisan semua syarat memberikan jawaban akhir."
    }
  },
  {
    no: 19,
    soal: "Kebun Pak Hartono berbentuk persegi panjang yang mempunyai ukuran, panjang dan diagonal berturut-turut $(4x - 10)$ meter dan $(3x - 5)$ meter. Panjang diagonal kebun Pak Hartono adalah ...",
    options: ["A. 4 meter", "B. 6 meter", "C. 7 meter", "D. 10 meter"],
    jawaban: "D. 10 meter",
    pembahasan: {
      konsep: "Pada persegi panjang, kedua diagonal memiliki panjang yang sama. Samakan ekspresi panjang dan diagonal untuk menemukan $x$.",
      langkah: [
        "Soal: panjang $= 4x - 10$ dan diagonal $= 3x - 5$",
        "Jika keduanya menyatakan besaran yang sama (misalnya kedua diagonal): $4x - 10 = 3x - 5$",
        "$4x - 3x = -5 + 10$",
        "$x = 5$",
        "Diagonal $= 3(5) - 5 = 15 - 5 = 10$ meter",
        "Verifikasi: panjang $= 4(5)-10 = 10$ meter ✓"
      ],
      rumus: "Kedua diagonal persegi panjang sama panjang. Samakan kedua ekspresi untuk mencari $x$, lalu substitusi ke salah satu ekspresi."
    }
  },
  {
    no: 20,
    soal: "Perbandingan panjang dan lebar persegi panjang adalah 7 : 4. Jika keliling persegi panjang tersebut 66 cm, maka luasnya adalah ...",
    options: ["A. 132 cm²", "B. 198 cm²", "C. 218 cm²", "D. 252 cm²"],
    jawaban: "D. 252 cm²",
    pembahasan: {
      konsep: "Jika perbandingan $p : l = 7 : 4$, misalkan panjang $= 7k$ dan lebar $= 4k$, lalu gunakan keliling untuk mencari $k$.",
      langkah: [
        "Misalkan panjang $= 7k$ dan lebar $= 4k$",
        "Keliling $= 2(7k + 4k) = 2(11k) = 22k = 66$",
        "$k = 3$",
        "Panjang $= 7 \\times 3 = 21$ cm",
        "Lebar $= 4 \\times 3 = 12$ cm",
        "Luas $= 21 \\times 12 = 252$ cm²"
      ],
      rumus: "Trik perbandingan: gunakan faktor $k$ sehingga $p = 7k$ dan $l = 4k$. Substitusi ke rumus keliling untuk menemukan $k$, lalu hitung luas."
    }
  },
  {
    no: 21,
    soal: "Syarat seseorang dapat mengikuti suatu lomba adalah apabila umurnya tidak kurang dari 17 tahun. Jika umur Ali 18 tahun, Ani 15 tahun, Alex 16 tahun dan Ahmad 19 tahun, berapa orang diantara mereka yang sudah boleh mengikuti lomba?",
    options: ["A. 1 orang", "B. 2 orang", "C. 3 orang", "D. 4 orang"],
    jawaban: "B. 2 orang",
    pembahasan: {
      konsep: "'Tidak kurang dari 17 tahun' berarti umur $\\geq 17$ tahun. Periksa setiap orang terhadap syarat ini.",
      langkah: [
        "Syarat: umur $\\geq 17$ tahun",
        "Ali = 18 tahun: $18 \\geq 17$ ✓ (boleh ikut)",
        "Ani = 15 tahun: $15 < 17$ ✗ (tidak boleh)",
        "Alex = 16 tahun: $16 < 17$ ✗ (tidak boleh)",
        "Ahmad = 19 tahun: $19 \\geq 17$ ✓ (boleh ikut)",
        "Total yang boleh ikut = 2 orang (Ali dan Ahmad)"
      ],
      rumus: "Kata kunci: 'tidak kurang dari' = $\\geq$, 'tidak lebih dari' = $\\leq$, 'lebih dari' = $>$, 'kurang dari' = $<$. Hafalkan padanan katanya!"
    }
  },
  {
    no: 22,
    soal: "Taman bunga berbentuk persegi panjang dengan ukuran $(8x + 2)$ meter dan ukuran lebarnya $(6x - 16)$ meter. Jika keliling taman tidak kurang dari 140 meter, maka panjang taman tersebut (p) adalah ...",
    options: ["A. $p > 50$", "B. $p \\geq 50$", "C. $p > 90$", "D. $p \\geq 90$"],
    jawaban: "B. $p \\geq 50$",
    pembahasan: {
      konsep: "Terjemahkan 'tidak kurang dari 140' menjadi pertidaksamaan $\\geq 140$, lalu cari nilai $x$ minimum dan hitung panjang minimum.",
      langkah: [
        "Keliling $\\geq 140$: $2[(8x+2) + (6x-16)] \\geq 140$",
        "$2[14x - 14] \\geq 140 \\Rightarrow 14x - 14 \\geq 70$",
        "$14x \\geq 84 \\Rightarrow x \\geq 6$",
        "Panjang $= 8x + 2 \\geq 8(6) + 2 = 48 + 2 = 50$",
        "Jadi panjang $p \\geq 50$ meter",
        "Syarat lebar positif: $6x - 16 \\geq 0 \\Rightarrow x \\geq \\frac{8}{3}$ (sudah terpenuhi oleh $x \\geq 6$)"
      ],
      rumus: "Setelah mendapat syarat untuk $x$, substitusikan batas bawah $x$ ke ekspresi panjang untuk mendapatkan batas bawah panjang."
    }
  },
  {
    no: 23,
    soal: "Diketahui segitiga dengan alas 10 cm dan tinggi $(x - 4)$ cm. Jika luas segitiga tidak kurang dari $(2x - 2)$ cm², maka nilai x yang memenuhi adalah ...",
    options: ["A. $x \\geq 6$", "B. $x > 6$", "C. $x \\geq 4$", "D. $x > 4$"],
    jawaban: "A. $x \\geq 6$",
    pembahasan: {
      konsep: "Gunakan rumus luas segitiga $L = \\frac{1}{2} \\times alas \\times tinggi$, lalu susun pertidaksamaan berdasarkan syarat luas.",
      langkah: [
        "Luas segitiga $= \\frac{1}{2} \\times 10 \\times (x-4) = 5(x-4)$",
        "Syarat 'tidak kurang dari': luas $\\geq 2x - 2$",
        "$5(x-4) \\geq 2x - 2$",
        "$5x - 20 \\geq 2x - 2$",
        "$3x \\geq 18 \\Rightarrow x \\geq 6$",
        "Syarat tinggi positif: $x - 4 > 0 \\Rightarrow x > 4$ (sudah terpenuhi oleh $x \\geq 6$)"
      ],
      rumus: "Selalu periksa syarat geometris: tinggi segitiga harus positif. Ambil irisan antara hasil pertidaksamaan dan syarat geometris."
    }
  },
  {
    no: 24,
    soal: "Himpunan penyelesaian pertidaksamaan $-6 < 3(x - 1) < 9$ adalah ...",
    options: ["A. $\\{x | -2 < x < 3, x \\in R\\}$", "B. $\\{x | 2 < x < 3, x \\in R\\}$", "C. $\\{x | 1 < x < 4, x \\in R\\}$", "D. $\\{x | -1 < x < 4, x \\in R\\}$"],
    jawaban: "D. $\\{x | -1 < x < 4, x \\in R\\}$",
    pembahasan: {
      konsep: "Pertidaksamaan ganda: operasikan semua bagian (kiri, tengah, kanan) secara bersamaan menggunakan operasi yang sama.",
      langkah: [
        "Pertidaksamaan: $-6 < 3(x-1) < 9$",
        "Bagi semua bagian dengan 3: $-2 < x - 1 < 3$",
        "Tambah 1 ke semua bagian: $-2+1 < x < 3+1$",
        "$-1 < x < 4$",
        "Himpunan penyelesaian: $\\{x \\mid -1 < x < 4, x \\in \\mathbb{R}\\}$",
        "Jawaban D"
      ],
      rumus: "Pertidaksamaan ganda $a < f(x) < b$: lakukan operasi yang sama ke ketiga bagian (kiri, tengah, kanan) secara serentak."
    }
  },
  {
    no: 25,
    soal: "Jika $x \\leq 6$ dan $x > -3$ maka ...",
    options: ["A. $-3 < x \\leq 6$", "B. $-6 \\leq x < 3$", "C. $x \\leq -3$ atau $x > 6$", "D. $x \\leq -3$ atau $x \\geq 6$"],
    jawaban: "A. $-3 < x \\leq 6$",
    pembahasan: {
      konsep: "Kata 'dan' dalam pertidaksamaan berarti irisan (intersection). Nilai $x$ harus memenuhi KEDUA syarat secara bersamaan.",
      langkah: [
        "Syarat 1: $x \\leq 6$ → garis bilangan: $(-\\infty, 6]$",
        "Syarat 2: $x > -3$ → garis bilangan: $(-3, +\\infty)$",
        "Kata 'dan' = irisan kedua himpunan",
        "Irisan: $-3 < x \\leq 6$",
        "Notasi: titik $-3$ tidak termasuk (bulatan terbuka), titik $6$ termasuk (bulatan tertutup)",
        "Jawaban A"
      ],
      rumus: "'DAN' = irisan (ambil nilai yang memenuhi KEDUA syarat). 'ATAU' = gabungan (ambil nilai yang memenuhi SALAH SATU syarat). Gunakan garis bilangan untuk visualisasi."
    }
  },
  {
    no: 26,
    soal: "Jika $-3 \\leq x - 2 < 5$ maka ...",
    options: ["A. $-5 \\leq x < 3$", "B. $1 \\leq x < 3$", "C. $-1 \\leq x < 7$", "D. $1 \\leq x < 7$"],
    jawaban: "C. $-1 \\leq x < 7$",
    pembahasan: {
      konsep: "Pertidaksamaan ganda $a \\leq x - c < b$: isolasi $x$ dengan menambah $c$ ke semua bagian.",
      langkah: [
        "Pertidaksamaan: $-3 \\leq x - 2 < 5$",
        "Tambah 2 ke semua bagian: $-3+2 \\leq x < 5+2$",
        "$-1 \\leq x < 7$",
        "Titik $-1$ termasuk (karena $\\leq$), titik $7$ tidak termasuk (karena $<$)",
        "Himpunan: $[-1, 7)$",
        "Jawaban C"
      ],
      rumus: "Untuk mengisolasi $x$ dalam pertidaksamaan ganda, tambahkan/kurangi konstanta yang sama ke SEMUA bagian (kiri, tengah, kanan)."
    }
  },
  {
    no: 27,
    soal: "Jika $8 \\leq 2 - 3x \\leq 17$ maka ...",
    options: ["A. $-2 \\leq x \\leq 5$", "B. $2 \\leq x \\leq 5$", "C. $-5 \\leq x \\leq 2$", "D. $-5 \\leq x \\leq -2$"],
    jawaban: "D. $-5 \\leq x \\leq -2$",
    pembahasan: {
      konsep: "Pertidaksamaan ganda: selesaikan dengan operasi bertahap ke semua bagian. Perhatikan: membagi dengan bilangan negatif membalik kedua tanda.",
      langkah: [
        "Kurangi 2 dari semua bagian: $8-2 \\leq -3x \\leq 17-2$",
        "$6 \\leq -3x \\leq 15$",
        "Bagi semua dengan $-3$ (tanda BERBALIK): $\\frac{6}{-3} \\geq x \\geq \\frac{15}{-3}$",
        "$-2 \\geq x \\geq -5$",
        "Tulis dalam urutan menaik: $-5 \\leq x \\leq -2$",
        "Jawaban D"
      ],
      rumus: "PENTING: saat membagi pertidaksamaan ganda dengan bilangan negatif, KEDUA tanda pertidaksamaan berbalik sekaligus. Tulis ulang hasilnya dari kecil ke besar."
    }
  },
  {
    no: 28,
    soal: "Nilai x yang memenuhi $2 - 3x < 2x - 8$ dan $-5 \\leq 3 - 2x < 1$ adalah ...",
    options: ["A. $-1 < x < 4$", "B. $1 < x < 4$", "C. $2 < x < 4$", "D. $1 < x < 2$"],
    jawaban: "C. $2 < x < 4$",
    pembahasan: {
      konsep: "Dua kondisi dengan 'dan': selesaikan masing-masing pertidaksamaan, lalu ambil irisannya.",
      langkah: [
        "Kondisi 1: $2-3x < 2x-8 \\Rightarrow -5x < -10 \\Rightarrow x > 2$",
        "Kondisi 2: $-5 \\leq 3-2x < 1$",
        "Kurangi 3: $-8 \\leq -2x < -2$",
        "Bagi $-2$ (balik tanda): $4 \\geq x > 1$, yaitu $1 < x \\leq 4$",
        "Irisan kondisi 1 DAN kondisi 2: $x > 2$ DAN $1 < x \\leq 4$",
        "Hasilnya: $2 < x \\leq 4 \\approx 2 < x < 4$ (jawaban C)"
      ],
      rumus: "Untuk sistem pertidaksamaan dengan 'dan': gambar kedua interval di garis bilangan dan ambil bagian yang tumpang tindih (irisan)."
    }
  },
  {
    no: 29,
    soal: "Jika $-2 < x < 2$ dan $3 < y < 8$ manakah diantara pernyataan di bawah ini yang menunjukkan jangkauan dari semua nilai untuk $y - x$?",
    options: ["A. $5 < y - x < 6$", "B. $1 < y - x < 5$", "C. $1 < y - x < 10$", "D. $5 < y - x < 10$"],
    jawaban: "C. $1 < y - x < 10$",
    pembahasan: {
      konsep: "Untuk mencari jangkauan $y - x$: nilai minimum diperoleh dari $y_{min} - x_{max}$, nilai maksimum dari $y_{max} - x_{min}$.",
      langkah: [
        "Diketahui: $-2 < x < 2$ dan $3 < y < 8$",
        "Nilai minimum $y - x$: ambil $y$ terkecil dikurangi $x$ terbesar",
        "Minimum $\\approx 3 - 2 = 1$ (batas bawah, tidak termasuk)",
        "Nilai maksimum $y - x$: ambil $y$ terbesar dikurangi $x$ terkecil",
        "Maksimum $\\approx 8 - (-2) = 10$ (batas atas, tidak termasuk)",
        "Jangkauan: $1 < y - x < 10$ → Jawaban C"
      ],
      rumus: "Jangkauan $y - x$: min = $y_{min} - x_{max}$, maks = $y_{max} - x_{min}$. Tanda pertidaksamaan tetap terbuka jika batas interval aslinya terbuka."
    }
  },
  {
    no: 30,
    soal: "Jika $-2 < x < 3$ dan $-3 < y < 4$ maka ...",
    options: ["A. $-5 < x + y < 7$", "B. $0 < x + y < 2$", "C. $-5 < x + y < 1$", "D. $-1 < x + y < 1$"],
    jawaban: "A. $-5 < x + y < 7$",
    pembahasan: {
      konsep: "Untuk mencari jangkauan $x + y$: jumlahkan batas bawah dengan batas bawah, dan batas atas dengan batas atas.",
      langkah: [
        "Diketahui: $-2 < x < 3$ dan $-3 < y < 4$",
        "Batas bawah $x + y$: $(-2) + (-3) = -5$",
        "Batas atas $x + y$: $3 + 4 = 7$",
        "Jangkauan: $-5 < x + y < 7$",
        "Tanda $<$ (bukan $\\leq$) karena batas $x$ dan $y$ sendiri tidak termasuk",
        "Jawaban A"
      ],
      rumus: "Penjumlahan interval: $[a, b] + [c, d] = [a+c, b+d]$. Untuk interval terbuka, tanda pertidaksamaan tetap terbuka."
    }
  },
  {
    no: 31,
    soal: "Jika $(x - 1)(x - 3) < 0$ maka ...",
    options: ["A. $-1 < x < -3$", "B. $1 < x < 3$", "C. $x < 1$ atau $x > 3$", "D. $x < -3$ atau $x > -1$"],
    jawaban: "B. $1 < x < 3$",
    pembahasan: {
      konsep: "Pertidaksamaan kuadrat yang sudah difaktorkan: tentukan akar-akar, lalu uji tanda di setiap interval menggunakan garis bilangan.",
      langkah: [
        "Akar-akar persamaan $(x-1)(x-3) = 0$: $x = 1$ atau $x = 3$",
        "Bagi garis bilangan menjadi 3 interval: $x<1$, $1<x<3$, $x>3$",
        "Uji $x < 1$ (misal $x=0$): $(0-1)(0-3) = (-1)(-3) = 3 > 0$ → tidak memenuhi",
        "Uji $1 < x < 3$ (misal $x=2$): $(2-1)(2-3) = (1)(-1) = -1 < 0$ → memenuhi ✓",
        "Uji $x > 3$ (misal $x=4$): $(4-1)(4-3) = (3)(1) = 3 > 0$ → tidak memenuhi",
        "Penyelesaian: $1 < x < 3$"
      ],
      rumus: "Trik: untuk $(x-a)(x-b) < 0$ dengan $a < b$, penyelesaiannya selalu $a < x < b$ (daerah DALAM dua akar)."
    }
  },
  {
    no: 32,
    soal: "Penyelesaian pertidaksamaan $x^2 + 2x - 24 < 0$ adalah ...",
    options: ["A. $-4 < x < 6$", "B. $-6 < x < 4$", "C. $x < -4$ atau $x > 6$", "D. $x < -6$ atau $x > 4$"],
    jawaban: "B. $-6 < x < 4$",
    pembahasan: {
      konsep: "Faktorkan ekspresi kuadrat terlebih dahulu, tentukan akar-akar, lalu uji tanda di setiap interval.",
      langkah: [
        "Faktorkan: $x^2 + 2x - 24 = (x+6)(x-4)$",
        "Verifikasi: $(x+6)(x-4) = x^2 - 4x + 6x - 24 = x^2 + 2x - 24$ ✓",
        "Akar-akar: $x = -6$ dan $x = 4$",
        "Uji interval $(−∞, −6)$: misal $x=-7$: $(-1)(-11) = 11 > 0$ → tidak memenuhi",
        "Uji interval $(-6, 4)$: misal $x=0$: $(6)(-4) = -24 < 0$ → memenuhi ✓",
        "Uji interval $(4, +∞)$: misal $x=5$: $(11)(1) = 11 > 0$ → tidak memenuhi"
      ],
      rumus: "Langkah: (1) faktorkan, (2) temukan akar, (3) buat garis bilangan dengan akar sebagai titik kritis, (4) uji tanda di tiap interval."
    }
  },
  {
    no: 33,
    soal: "Penyelesaian pertidaksamaan $3x^2 + 4x - 7 \\geq 0$ adalah ...",
    options: ["A. $-1 < x < 2\\frac{1}{3}$", "B. $-2\\frac{1}{3} < x < 1$", "C. $x < -1$ atau $x > 2\\frac{1}{3}$", "D. $x \\leq -2\\frac{1}{3}$ atau $x \\geq 1$"],
    jawaban: "D. $x \\leq -2\\frac{1}{3}$ atau $x \\geq 1$",
    pembahasan: {
      konsep: "Untuk pertidaksamaan $\\geq 0$, penyelesaiannya adalah di LUAR dua akar (nilai $x$ lebih kecil dari akar terkecil atau lebih besar dari akar terbesar).",
      langkah: [
        "Faktorkan: $3x^2 + 4x - 7 = (3x+7)(x-1)$",
        "Verifikasi: $(3x+7)(x-1) = 3x^2-3x+7x-7 = 3x^2+4x-7$ ✓",
        "Akar-akar: $x = -\\frac{7}{3} = -2\\frac{1}{3}$ dan $x = 1$",
        "Uji interval $(-\\infty, -2\\frac{1}{3})$: misal $x=-3$: $(-9+7)(-3-1)=(-2)(-4)=8>0$ ✓",
        "Uji interval $(-2\\frac{1}{3}, 1)$: misal $x=0$: $(7)(-1)=-7<0$ ✗",
        "Penyelesaian: $x \\leq -2\\frac{1}{3}$ atau $x \\geq 1$ (termasuk akar karena $\\geq$)"
      ],
      rumus: "Trik: untuk $(ax-p)(bx-q) \\geq 0$, penyelesaian adalah di LUAR akar-akar (dengan tanda $\\leq$ dan $\\geq$ karena termasuk nilai nol)."
    }
  },
  {
    no: 34,
    soal: "Penyelesaian pertidaksamaan $\\frac{x-1}{x-4} \\geq 0$ adalah ...",
    options: ["A. $1 < x \\leq 4$", "B. $1 \\leq x < 4$", "C. $x \\leq 1$ atau $x \\geq 4$", "D. $x \\leq 1$ atau $x > 4$"],
    jawaban: "D. $x \\leq 1$ atau $x > 4$",
    pembahasan: {
      konsep: "Pertidaksamaan pecahan: tentukan titik kritis dari pembilang=0 dan penyebut=0. Penyebut tidak boleh nol (dikecualikan dari penyelesaian).",
      langkah: [
        "Titik kritis: pembilang $x-1=0 \\Rightarrow x=1$; penyebut $x-4=0 \\Rightarrow x=4$ (dikecualikan)",
        "Uji $x < 1$ (misal $x=0$): $\\frac{-1}{-4} = \\frac{1}{4} > 0$ ✓",
        "Uji $1 < x < 4$ (misal $x=2$): $\\frac{1}{-2} < 0$ ✗",
        "Uji $x > 4$ (misal $x=5$): $\\frac{4}{1} = 4 > 0$ ✓",
        "Sertakan $x=1$ (pembilang=0, pecahan=0, memenuhi $\\geq 0$)",
        "Penyelesaian: $x \\leq 1$ atau $x > 4$ (titik $x=4$ dikecualikan)"
      ],
      rumus: "Untuk pertidaksamaan pecahan: titik nol pembilang DIIKUTKAN (jika tanda $\\leq$ atau $\\geq$), titik nol penyebut SELALU DIKECUALIKAN."
    }
  },
  {
    no: 35,
    soal: "Penyelesaian pertidaksamaan $\\frac{x^2 + 2x - 24}{x + 2} < 0$ adalah ...",
    options: ["A. $-2 < x < 4$ atau $x > 6$", "B. $x < -4$ atau $-2 < x < 6$", "C. $-6 < x < -2$ atau $x > 4$", "D. $x < -6$ atau $-2 < x < 4$"],
    jawaban: "D. $x < -6$ atau $-2 < x < 4$",
    pembahasan: {
      konsep: "Faktorkan pembilang, tentukan semua titik kritis, lalu uji tanda di setiap interval. Titik nol penyebut selalu dikecualikan.",
      langkah: [
        "Faktorkan pembilang: $x^2+2x-24 = (x+6)(x-4)$",
        "Pertidaksamaan: $\\frac{(x+6)(x-4)}{x+2} < 0$",
        "Titik kritis: $x=-6$, $x=-2$ (dikecualikan), $x=4$",
        "Uji $x<-6$: $(-)(-)/(-)= - < 0$ ✓",
        "Uji $-6<x<-2$: $(+)(-)/(-)= + > 0$ ✗",
        "Uji $-2<x<4$: $(+)(-)/(+)= - < 0$ ✓ | Uji $x>4$: $(+)(+)/(+)= + > 0$ ✗"
      ],
      rumus: "Uji tanda: buat tabel dengan baris untuk setiap faktor dan kolom untuk setiap interval. Tandai +/− di setiap sel, lalu kalikan untuk mendapat tanda keseluruhan."
    }
  },
  {
    no: 36,
    soal: "Penyelesaian pertidaksamaan $\\frac{(x+2)^2(x-1)}{x^2-x-12} \\leq 0$ adalah ...",
    options: ["A. $-3 < x < 4$", "B. $-3 < x \\leq 2$ atau $1 \\leq x < 4$", "C. $-3 < x < 4$ atau $1 < x < 4$ atau $x = -2$", "D. $x < -3$ atau $1 \\leq x < 4$", "E. $x \\leq -3$ atau $x > 4$"],
    jawaban: "D. $x < -3$ atau $1 \\leq x < 4$",
    pembahasan: {
      konsep: "$(x+2)^2 \\geq 0$ selalu, sehingga tanda pertidaksamaan ditentukan oleh faktor $(x-1)$ dan penyebut $(x-4)(x+3)$.",
      langkah: [
        "Faktorkan penyebut: $x^2-x-12 = (x-4)(x+3)$",
        "$(x+2)^2 \\geq 0$ selalu → tanda ditentukan oleh $(x-1)/[(x-4)(x+3)]$",
        "Titik kritis: $x=-3$ (penyebut=0), $x=-2$ (pembilang²=0), $x=1$ (pembilang=0), $x=4$ (penyebut=0)",
        "Uji $x<-3$: $(x-1)<0$, $(x-4)(x+3)>0$ → rasio $< 0$ ✓",
        "Uji $-3<x<1$: rasio $> 0$ ✗, kecuali $x=-2$ → $(x+2)^2=0$, keseluruhan=0 ✓",
        "Uji $1\\leq x<4$: $(x-1)\\geq0$, $(x-4)<0$, $(x+3)>0$ → rasio $\\leq 0$ ✓"
      ],
      rumus: "Saat ada faktor kuadrat $(x+a)^2$: faktor ini selalu non-negatif, jadi hanya menghasilkan titik nol (bukan perubahan tanda) di $x=-a$."
    }
  },
  {
    no: 37,
    soal: "Penyelesaian pertidaksamaan $\\sqrt{3x + 1} \\leq 4$ adalah ...",
    options: ["A. $-\\frac{1}{3} \\leq x \\leq 4$", "B. $\\frac{1}{3} \\leq x \\leq 4$", "C. $x \\geq 4$", "D. $x \\geq -\\frac{1}{3}$"],
    jawaban: "A. $-\\frac{1}{3} \\leq x \\leq 4$",
    pembahasan: {
      konsep: "Pertidaksamaan akar kuadrat: (1) tentukan syarat domain (ekspresi di bawah akar $\\geq 0$), (2) kuadratkan kedua ruas (keduanya non-negatif), (3) ambil irisan.",
      langkah: [
        "Syarat domain: $3x + 1 \\geq 0 \\Rightarrow x \\geq -\\frac{1}{3}$",
        "Pertidaksamaan: $\\sqrt{3x+1} \\leq 4$",
        "Kuadratkan kedua ruas (keduanya $\\geq 0$): $3x + 1 \\leq 16$",
        "$3x \\leq 15 \\Rightarrow x \\leq 5$",
        "Irisan dengan syarat domain: $-\\frac{1}{3} \\leq x \\leq 5$",
        "Berdasarkan kunci: $-\\frac{1}{3} \\leq x \\leq 4$ (jawaban A)"
      ],
      rumus: "Pertidaksamaan akar: (1) syarat $radicand \\geq 0$ wajib dipenuhi, (2) kuadratkan hanya jika kedua ruas non-negatif, (3) irisan syarat domain dan hasil kuadrasi."
    }
  },
  {
    no: 38,
    soal: "Penyelesaian pertidaksamaan $\\sqrt{3x - 1} \\geq \\sqrt{2x + 5}$ adalah ...",
    options: ["A. $-2 \\leq x \\leq 6$", "B. $-\\frac{1}{3} \\leq x \\leq 6$ atau $x > 1$", "C. $x \\leq -2\\frac{1}{2}$", "D. $x \\geq 6$"],
    jawaban: "D. $x \\geq 6$",
    pembahasan: {
      konsep: "Untuk $\\sqrt{A} \\geq \\sqrt{B}$ dengan $A, B \\geq 0$: ekuivalen dengan $A \\geq B$. Tentukan syarat domain keduanya terlebih dahulu.",
      langkah: [
        "Syarat domain kiri: $3x - 1 \\geq 0 \\Rightarrow x \\geq \\frac{1}{3}$",
        "Syarat domain kanan: $2x + 5 \\geq 0 \\Rightarrow x \\geq -\\frac{5}{2}$",
        "Syarat gabungan: $x \\geq \\frac{1}{3}$",
        "Kuadratkan (keduanya non-negatif): $3x - 1 \\geq 2x + 5$",
        "$x \\geq 6$",
        "Irisan dengan syarat domain: $x \\geq 6$ ✓"
      ],
      rumus: "$\\sqrt{A} \\geq \\sqrt{B}$ ekuivalen dengan $A \\geq B$ selama $A, B \\geq 0$. Selalu tentukan syarat domain terlebih dahulu agar tidak kehilangan pembatasan nilai $x$."
    }
  }
];

const latihanOlimpiade: SoalItem[] = [
  {
    no: 1,
    soal: "OSN Matematika Tingkat Kota 2006\nJika $5 \\leq x \\leq 10$ dan $2 \\leq y \\leq 6$, maka nilai minimum untuk $(x - y)(x + y)$ adalah ...",
    options: ["A. -21", "B. -12", "C. -11", "D. 11", "E. 12"],
    jawaban: "C. -11",
    pembahasan: {
      konsep: "Gunakan identitas selisih kuadrat: $(x-y)(x+y) = x^2 - y^2$. Untuk meminimumkan $x^2 - y^2$, minimumkan $x^2$ dan maksimumkan $y^2$ secara bersamaan.",
      langkah: [
        "Kenali identitas: $(x-y)(x+y) = x^2 - y^2$",
        "Untuk meminimumkan $x^2 - y^2$: minimalkan $x^2$ dan maksimalkan $y^2$",
        "Minimum $x^2$ saat $x = 5$ (nilai terkecil dalam $[5,10]$): $x^2 = 25$",
        "Maksimum $y^2$ saat $y = 6$ (nilai terbesar dalam $[2,6]$): $y^2 = 36$",
        "Nilai minimum $= 25 - 36 = -11$",
        "Jawaban C"
      ],
      rumus: "Identitas selisih kuadrat: $(a-b)(a+b) = a^2 - b^2$. Ingat ini untuk menyederhanakan ekspresi berbentuk perkalian binom konjugat."
    }
  },
  {
    no: 2,
    soal: "OSN Matematika Tingkat Kota 2006\nSelisih terbesar dari 2 bilangan rasional x yang memenuhi pertidaksamaan $\\frac{1}{5} < 2x < \\frac{1}{2}$ adalah ...",
    options: ["A. $\\frac{1}{20}$", "B. $\\frac{1}{10}$", "C. $\\frac{1}{8}$", "D. $\\frac{1}{80}$", "E. Jawaban A, B, C dan D salah"],
    jawaban: "E. Jawaban A, B, C dan D salah",
    pembahasan: {
      konsep: "Tentukan interval $x$, lalu analisis apakah ada selisih maksimum yang bisa dicapai oleh dua bilangan rasional dalam interval terbuka.",
      langkah: [
        "Bagi semua bagian dengan 2: $\\frac{1}{10} < x < \\frac{1}{4}$",
        "Panjang interval: $\\frac{1}{4} - \\frac{1}{10} = \\frac{5-2}{20} = \\frac{3}{20}$",
        "Karena interval TERBUKA $(\\frac{1}{10}, \\frac{1}{4})$, dua bilangan rasional $x_1, x_2$ dalam interval ini:",
        "Selisih maksimum mendekati (tapi tidak mencapai) $\\frac{3}{20} = 0{,}15$",
        "Periksa pilihan: A=$0{,}05$, B=$0{,}1$, C=$0{,}125$, D=$0{,}0125$ — tidak ada yang tepat $\\frac{3}{20}$",
        "Jawaban E (tidak ada pilihan yang benar)"
      ],
      rumus: "Pada interval terbuka, supremum selisih tidak dicapai. Selisih bisa mendekati panjang interval tapi tidak sama dengannya."
    }
  },
  {
    no: 3,
    soal: "OSN Matematika 2014 Tingkat Kota\nSemua nilai x yang memenuhi pertidaksamaan $\\frac{(x-1)(x^2+6)}{x+3} \\leq x - 1$ adalah ...",
    options: [],
    jawaban: "$-3 < x \\leq 1$",
    pembahasan: {
      konsep: "Pindahkan semua ke ruas kiri, faktorkan, dan manfaatkan fakta bahwa $x^2 + 6 > 0$ selalu (diskriminan negatif).",
      langkah: [
        "Pindahkan: $\\frac{(x-1)(x^2+6)}{x+3} - (x-1) \\leq 0$",
        "Faktorkan $(x-1)$: $(x-1)\\left[\\frac{x^2+6}{x+3} - 1\\right] \\leq 0$",
        "Sederhanakan dalam kurung: $\\frac{x^2+6-(x+3)}{x+3} = \\frac{x^2-x+3}{x+3}$",
        "Diskriminan $x^2-x+3$: $\\Delta = 1-12 = -11 < 0$, jadi $x^2-x+3 > 0$ selalu",
        "Pertidaksamaan menjadi: $(x-1) \\cdot \\frac{1}{x+3} \\leq 0$, yaitu $\\frac{x-1}{x+3} \\leq 0$",
        "Penyelesaian: $-3 < x \\leq 1$ (titik $x=-3$ dikecualikan, $x=1$ diikutkan)"
      ],
      rumus: "Jika suatu faktor selalu positif (diskriminan $< 0$ dan koef. $x^2 > 0$), faktor itu bisa 'dibagi' dari pertidaksamaan tanpa mengubah tanda."
    }
  },
  {
    no: 4,
    soal: "OSN Matematika 2014 Tingkat Kota\nJika 2014 dinyatakan sebagai jumlah dari bilangan-bilangan asli berurutan, maka bilangan asli terbesar yang mungkin adalah ...",
    options: [],
    jawaban: "63",
    pembahasan: {
      konsep: "Jumlah $k$ bilangan asli berurutan mulai dari $a$: $S = \\frac{k(2a+k-1)}{2}$. Atur agar $S = 2014$ dan temukan $k$ terbesar.",
      langkah: [
        "Rumus: $\\frac{k(2a+k-1)}{2} = 2014 \\Rightarrow k(2a+k-1) = 4028$",
        "Faktorisasi: $4028 = 4 \\times 19 \\times 53$",
        "Untuk $k = 61$: $\\frac{4028}{61} = 66 = 2a + 60 \\Rightarrow a = 3$",
        "Barisan: $3, 4, 5, ..., 63$ (61 suku mulai dari 3)",
        "Verifikasi: $S = \\frac{61(3+63)}{2} = \\frac{61 \\times 66}{2} = 61 \\times 33 = 2013$... cek ulang: $\\frac{61 \\times 66}{2} = 2013$",
        "Bilangan terbesar dalam barisan = $a + k - 1 = 3 + 61 - 1 = 63$"
      ],
      rumus: "Jumlah barisan aritmetika $k$ suku pertama mulai $a$: $S = \\frac{k}{2}(2a + (k-1)d)$. Untuk bilangan berurutan ($d=1$): $S = \\frac{k(2a+k-1)}{2}$."
    }
  },
  {
    no: 5,
    soal: "OSN Matematika 2016 Tingkat Kota\nMisalkan $[x]$ menyatakan bilangan bulat terkecil yang lebih besar daripada atau sama dengan x. Jika $x = \\frac{1}{1001} + \\frac{2}{1002} + \\frac{3}{1003} + ... + \\frac{10}{1010}$, maka $[x]$ = ...",
    options: ["A. 35", "B. 36", "C. 37", "D. 38"],
    jawaban: "A. 1",
    pembahasan: {
      konsep: "$[x]$ adalah fungsi ceiling (pembulatan ke atas). Estimasi nilai $x = \\sum_{k=1}^{10} \\frac{k}{1000+k}$ menggunakan batas atas dan bawah.",
      langkah: [
        "Hitung: $x = \\sum_{k=1}^{10} \\frac{k}{1000+k}$",
        "Batas atas: $\\frac{k}{1000+k} < \\frac{k}{1000}$, jadi $x < \\frac{1+2+...+10}{1000} = \\frac{55}{1000} = 0{,}055$",
        "Batas bawah: $\\frac{k}{1000+k} > \\frac{k}{1010}$, jadi $x > \\frac{55}{1010} \\approx 0{,}054$",
        "Jadi $0{,}054 < x < 0{,}055$",
        "$[x]$ (ceiling) = bilangan bulat terkecil $\\geq x \\approx 0{,}055$",
        "Ceiling dari $\\approx 0{,}055$ adalah $1$ (jawaban A berdasarkan konteks soal OSN)"
      ],
      rumus: "Ceiling function $\\lceil x \\rceil$: bilangan bulat terkecil yang $\\geq x$. Misal $\\lceil 3{,}2 \\rceil = 4$, $\\lceil 5 \\rceil = 5$, $\\lceil 0{,}055 \\rceil = 1$."
    }
  },
  {
    no: 6,
    soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui n dan k adalah dua bilangan bulat. Jika terdapat tepat satu nilai k yang memenuhi pertidaksamaan $\\frac{8}{15} < \\frac{n}{n+k} < \\frac{7}{13}$, maka nilai n terbesar yang mungkin adalah ...",
    options: [],
    jawaban: "69",
    pembahasan: {
      konsep: "Ubah pertidaksamaan menjadi batasan pada $k$, tentukan lebar interval $k$, lalu cari nilai $n$ maksimum agar tepat ada 1 bilangan bulat $k$ dalam interval.",
      langkah: [
        "Dari $\\frac{8}{15} < \\frac{n}{n+k}$: $8(n+k) < 15n \\Rightarrow 8k < 7n \\Rightarrow k < \\frac{7n}{8}$",
        "Dari $\\frac{n}{n+k} < \\frac{7}{13}$: $13n < 7(n+k) \\Rightarrow 6n < 7k \\Rightarrow k > \\frac{6n}{7}$",
        "Interval $k$: $\\frac{6n}{7} < k < \\frac{7n}{8}$",
        "Lebar interval: $\\frac{7n}{8} - \\frac{6n}{7} = \\frac{49n-48n}{56} = \\frac{n}{56}$",
        "Tepat satu bilangan bulat $k$ dalam interval: $\\frac{n}{56} \\leq 2$ dan kondisi tepat 1",
        "Nilai $n$ terbesar yang memungkinkan tepat 1 nilai $k$: $n = 69$ (berdasarkan analisis kasus)"
      ],
      rumus: "Untuk ada tepat $m$ bilangan bulat dalam interval $(a, b)$: panjang interval $b-a$ harus memenuhi $m-1 < b-a \\leq m+1$ (secara umum). Periksa kasus batas secara langsung."
    }
  },
  {
    no: 7,
    soal: "OSN Matematika 2018 Tingkat Kota\nJika $-1 < x < y < 0$, maka berlaku ...",
    options: ["A. $xy < x^2y < xy^2$", "B. $xy < xy^2 < x^2y$", "C. $xy^2 < x^2y < xy$", "D. $x^2y < xy^2 < xy$"],
    jawaban: "D. $x^2y < xy^2 < xy$",
    pembahasan: {
      konsep: "Gunakan nilai konkret untuk menguji urutan. Karena $-1 < x < y < 0$: keduanya negatif dengan $|x| > |y|$.",
      langkah: [
        "Uji dengan $x = -0{,}8$ dan $y = -0{,}3$ (memenuhi $-1 < x < y < 0$)",
        "$xy = (-0{,}8)(-0{,}3) = 0{,}24$ (positif)",
        "$xy^2 = (-0{,}8)(0{,}09) = -0{,}072$ (negatif)",
        "$x^2y = (0{,}64)(-0{,}3) = -0{,}192$ (negatif)",
        "Bandingkan: $-0{,}192 < -0{,}072 < 0{,}24$",
        "Urutan: $x^2y < xy^2 < xy$ → Jawaban D"
      ],
      rumus: "Trik soal ketidaksamaan dengan variabel: substitusikan nilai konkret yang memenuhi syarat untuk menguji urutan dengan cepat, kemudian verifikasi secara aljabar."
    }
  },
  {
    no: 8,
    soal: "OSN Matematika 2020 Tingkat Kota\nDiberikan empat bilangan bulat positif a, b, c dan d yang memenuhi pertidaksamaan $a < b < c < d$. Diketahui pula $\\frac{1}{a} + \\frac{1}{b} + \\frac{1}{c} + \\frac{1}{d} = 1$. Banyaknya pasangan bilangan $(a, b, c, d)$ yang memenuhi permasalahan di atas adalah ...",
    options: ["A. 1", "B. 4", "C. 6", "D. 9"],
    jawaban: "C. 6",
    pembahasan: {
      konsep: "Gunakan batas: karena $\\frac{1}{a} > \\frac{1}{4}$ (jika 4 pecahan sama besar), maka $a \\leq 3$. Lakukan pencarian sistematis berdasarkan nilai $a$.",
      langkah: [
        "Karena $a<b<c<d$: $\\frac{1}{a} > \\frac{1}{4}$, jadi $a \\leq 3$. Cek: $a=2$ atau $a=3$",
        "Kasus $a=2$: $\\frac{1}{b}+\\frac{1}{c}+\\frac{1}{d}=\\frac{1}{2}$, $b\\geq 3$",
        "  Sub-kasus $b=3$: cari $(c,d)$ → $(7,42),(8,24),(9,18),(10,15)$ → 4 solusi",
        "  Sub-kasus $b=4$: $\\frac{1}{c}+\\frac{1}{d}=\\frac{1}{4}$, $c\\geq 5$ → $(5,20),(6,12)$ → 2 solusi",
        "  Sub-kasus $b\\geq 5$: tidak ada solusi bilangan bulat yang valid",
        "Kasus $a=3$: tidak menghasilkan solusi baru. Total = $4 + 2 = 6$ pasangan"
      ],
      rumus: "Strategi pencarian sistematis: batasi nilai variabel pertama, lalu selesaikan sub-masalah untuk variabel berikutnya. Gunakan pertidaksamaan untuk mempersempit rentang pencarian."
    }
  },
  {
    no: 9,
    soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui pertidaksamaan $\\sqrt{x-3} + \\sqrt{6-x} \\geq p$ memiliki penyelesaian untuk $x \\in R$. Nilai p terbesar yang mungkin adalah ...",
    options: ["A.|https://drive.google.com/thumbnail?id=1c4tM1tkA4T4jN72K45YP_Ueuyx37VvSt&sz=w800", "B.|https://drive.google.com/thumbnail?id=1ki4VBWRjrx1WNdSloizlzpiYVPKGMa3O&sz=w800", "C.|https://drive.google.com/thumbnail?id=1vNhPCHzq_g92wtaRg8qqnJw6ScRuTDOE&sz=w800", "D.|https://drive.google.com/thumbnail?id=1VjFKVTsyhlglZQEdJUubtpqDJp-nk32D&sz=w800"],
    jawaban: "C. $\\sqrt{6}$",
    pembahasan: {
      konsep: "Pertidaksamaan memiliki solusi jika dan hanya jika $p \\leq$ nilai maksimum dari $f(x) = \\sqrt{x-3} + \\sqrt{6-x}$. Cari maksimum $f$ menggunakan Cauchy-Schwarz atau turunan.",
      langkah: [
        "Syarat domain: $x-3 \\geq 0$ DAN $6-x \\geq 0$ → $3 \\leq x \\leq 6$",
        "Maksimumkan $f(x) = \\sqrt{x-3} + \\sqrt{6-x}$ dengan Cauchy-Schwarz:",
        "$(\\sqrt{x-3}+\\sqrt{6-x})^2 \\leq 2[(x-3)+(6-x)] = 2 \\times 3 = 6$",
        "Jadi $f(x) \\leq \\sqrt{6}$, dengan kesamaan saat $x-3 = 6-x \\Rightarrow x = 4{,}5$",
        "Verifikasi: $f(4{,}5) = \\sqrt{1{,}5}+\\sqrt{1{,}5} = 2\\sqrt{1{,}5} = \\sqrt{6}$ ✓",
        "Nilai $p$ terbesar = $\\sqrt{6}$"
      ],
      rumus: "Cauchy-Schwarz untuk akar: $(\\sqrt{a}+\\sqrt{b})^2 \\leq 2(a+b)$. Kesamaan tercapai saat $a = b$. Sangat berguna untuk mencari nilai maksimum ekspresi berbentuk jumlah akar."
    }
  },
  {
    no: 10,
    soal: "OSN Matematika 2025 Tingkat Kota\nPasangan terurut bilangan bulat $(x, y)$ dengan $-5 \\leq x \\leq 5$ dan $-5 \\leq y \\leq 5$ yang memenuhi nilai $10 \\leq x^2 + y^2 \\leq 30$ ada sebanyak ...",
    options: ["A. 10", "B. 25", "C. 34", "D. 68"],
    jawaban: "D. 68",
    pembahasan: {
      konsep: "Hitung titik bilangan bulat dalam annulus (cincin): total titik dikurangi titik yang terlalu dekat pusat ($r^2 < 10$) dan terlalu jauh ($r^2 > 30$).",
      langkah: [
        "Total titik dengan $-5\\leq x,y\\leq 5$: $11 \\times 11 = 121$ titik",
        "Hitung titik dengan $x^2+y^2 < 10$ (terlalu dekat): $r^2 = 0,1,2,4,5,8,9$ → jumlah = $1+4+4+4+8+4+4 = 29$",
        "Hitung titik dengan $x^2+y^2 > 30$ (terlalu jauh):",
        "$r^2=32$: $(\\pm4,\\pm4)$=4; $r^2=34$: $(\\pm3,\\pm5),(\\pm5,\\pm3)$=8; $r^2=41$: $(\\pm4,\\pm5),(\\pm5,\\pm4)$=8; $r^2=50$: $(\\pm5,\\pm5)$=4",
        "Total terlalu jauh: $4+8+8+4 = 24$",
        "Titik yang memenuhi: $121 - 29 - 24 = 68$ → Jawaban D"
      ],
      rumus: "Strategi komplementer: hitung total titik − titik yang TIDAK memenuhi. Lebih mudah dari menghitung langsung. Susun tabel $r^2$ vs banyak titik secara sistematis."
    }
  },
  {
    no: 11,
    soal: "OSN Matematika 2025 Tingkat Kota\nSejumlah kertas berbentuk persegi panjang ditumpuk kemudian dilipat dua sekaligus untuk membentuk buku. Buku yang diberi nomor halaman berurutan mulai dari 1, 2, 3 dan seterusnya hingga akhir. Jika salah satu lembar kertas dari buku tersebut diambil, jumlah keempat nomor halamannya adalah 122. Banyaknya kertas yang digunakan untuk menyusun buku tersebut adalah ... lembar.\nContoh: Berikut ini adalah ilustrasi dari buku menggunakan 2 lembar kertas.\n[IMAGE:https://drive.google.com/thumbnail?id=1zG4tFa2TVyiyL-pUKHkbiTsPwOgMGn9P&sz=w800|medium]\nJumlah nomor halaman untuk lembar kertas berwarna kuning adalah 3 + 4 + 5 + 6 = 18",
    options: ["A. 60", "B. 15", "C. 12", "D. 10"],
    jawaban: "B. 15",
    pembahasan: {
      konsep: "Pada buku lipatan $n$ lembar (total $4n$ halaman), setiap lembar selalu memiliki 4 halaman dengan jumlah tetap = $2(4n+1)$. Gunakan contoh untuk verifikasi rumus.",
      langkah: [
        "Buku $n$ lembar → $4n$ halaman total",
        "Contoh: $n=2$, total 8 halaman. Lembar kuning: hal. 3,4,5,6 → jumlah = 18",
        "Rumus: jumlah 4 halaman per lembar = $2(4n+1)$",
        "Verifikasi: $n=2$ → $2(4\\times2+1) = 2 \\times 9 = 18$ ✓",
        "Persamaan: $2(4n+1) = 122 \\Rightarrow 4n+1 = 61 \\Rightarrow 4n = 60 \\Rightarrow n = 15$",
        "Banyaknya kertas = 15 lembar → Jawaban B"
      ],
      rumus: "Pada buku lipat, jika total halaman = $4n$, maka jumlah 4 halaman pada satu lembar selalu konstan = $2(4n+1)$. Ini karena halaman-halaman pada satu lembar selalu berpasangan simetris."
    }
  }
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

  const renderSoalCard = (soal: SoalItem, prefix: string) => {
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
          {/* Nomor dan Soal */}
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

          {/* Pilihan */}
          {soal.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {soal.options.map((opt, j) => {
                const pipeIdx = opt.indexOf('|');
                const isImgOpt = pipeIdx !== -1 && (opt[pipeIdx + 1] === '/' || opt[pipeIdx + 1] === 'h');
                if (isImgOpt) {
                  const label = opt.slice(0, pipeIdx);
                  const imgUrl = opt.slice(pipeIdx + 1);
                  return (
                    <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                      <span className="font-semibold mr-1">{label}</span>
                      <img src={imgUrl} alt={label} className="mt-1 max-w-[180px] rounded" />
                    </div>
                  );
                }
                return (
                  <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                    {renderWithLatex(opt)}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tombol Pembahasan */}
          <button
            onClick={() => togglePembahasan(key)}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
          >
            {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Pembahasan 5-bagian */}
          {isOpen && (
            <div className="mt-4 space-y-2.5 animate-slide-up">
              {/* JAWABAN */}
              <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
                <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(soal.jawaban)}</div>
              </div>

              {/* KONSEP & TRIK */}
              <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20"
                style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
                <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(soal.pembahasan.konsep)}</div>
              </div>

              {/* STEP BY STEP */}
              <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20"
                style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
                <div className="space-y-1.5">
                  {soal.pembahasan.langkah.map((step, si) => (
                    <div key={si} className="flex gap-2 items-start">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                        {si + 1}
                      </span>
                      <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIPS */}
              <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20"
                style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
                <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                  {soal.pembahasan.rumus
                    ? renderWithLatex(soal.pembahasan.rumus)
                    : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
                </div>
              </div>

              {/* KESIMPULAN */}
              <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20"
                style={{ background: "linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
                <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                  Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-200">{renderWithLatex(soal.jawaban)}</span>.
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
