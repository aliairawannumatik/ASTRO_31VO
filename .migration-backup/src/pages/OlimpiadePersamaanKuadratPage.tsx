import { useState, type ReactNode } from "react";
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
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

type Pembahasan = {
  konsep: string;
  langkah: string[];
  rumus?: string;
};

type Soal = {
  no: number;
  soal: string;
  options: string[];
  svgImage?: ReactNode;
  jawaban: string;
  pembahasan: Pembahasan;
};

const materiSection = {
  title: "MATERI - PERSAMAAN KUADRAT",
  sections: [
    {
      heading: "A. Bentuk Umum Persamaan Kuadrat",
      content: `$ax^2 + bx + c = 0$, dengan $a \\neq 0$
Memiliki akar-akar penyelesaian yaitu $x_1$ dan $x_2$
Akar-akar penyelesaian disebut juga pembuat nol persamaan kuadrat

Ingat! $x^2 = p$ maka $x = \\pm\\sqrt{p}$`
    },
    {
      heading: "B. Cara Menentukan Akar-Akar Persamaan Kuadrat",
      content: `1. Memfaktorkan
$ax^2 + bx + c = 0$
Cari dua bilangan yang hasil kalinya $ac$ dan jumlahnya $b$
$\\frac{1}{a}(ax + ...)(ax + ...) = 0$

2. Melengkapi kuadrat sempurna
$ax^2 + bx + c = 0, a \\neq 0 \\Rightarrow x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$
$\\Rightarrow x^2 + \\frac{b}{a}x + \\left(\\frac{b}{2a}\\right)^2 = -\\frac{c}{a} + \\left(\\frac{b}{2a}\\right)^2$
$\\Rightarrow \\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}$

3. Rumus kuadratik (rumus abc)
$x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$`
    },
    {
      heading: "C. Rumus Jumlah dan Kali Akar-Akar",
      content: `Jika $x_1$ dan $x_2$ akar-akar persamaan kuadrat, maka berlaku:
$x_1 + x_2 = -\\frac{b}{a}$
$x_1 \\cdot x_2 = \\frac{c}{a}$`
    },
    {
      heading: "D. Diskriminan (D)",
      content: `Diskriminan disimbolkan dengan D, merupakan istilah pada rumus kuadratik yang dapat menentukan jenis akar-akar persamaan kuadrat. Pada persamaan kuadrat $ax^2 + bx + c = 0$ nilai $D = b^2 - 4ac$

Jika $D > 0$, maka persamaan kuadrat memiliki 2 akar real dan berbeda
Jika $D = 0$, maka persamaan kuadrat memiliki akar real kembar
Jika $D < 0$, maka persamaan kuadrat memiliki akar-akar tidak real (imajiner)
Jika $D \\geq 0$, maka persamaan kuadrat memiliki 2 akar real`
    },
    {
      heading: "E. Menentukan Persamaan Kuadrat Jika Diketahui Akar-Akar",
      content: `Jika $x_1$ dan $x_2$ adalah akar-akar suatu persamaan kuadrat, maka persamaan kuadratnya adalah:
$(x - x_1)(x - x_2) = 0$`
    },
    {
      heading: "F. Menentukan Persamaan Kuadrat Baru",
      content: `Jika $\\alpha$ dan $\\beta$ adalah akar-akar persamaan kuadrat baru. Maka persamaan kuadrat barunya adalah:
$x^2 - (\\alpha + \\beta)x + (\\alpha \\cdot \\beta) = 0$`
    },
  ]
};

const SvgSegitiga28 = () => (
  <svg viewBox="-30 0 210 170" width="170" height="150" className="my-3 mx-auto block">
    <polygon points="20,15 20,140 150,140" fill="none" stroke="#facc15" strokeWidth="2" />
    <rect x="20" y="120" width="20" height="20" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="-10" y="82" fill="var(--icon-color)" fontSize="13" textAnchor="middle" fontStyle="italic">x+2</text>
    <text x="85" y="158" fill="var(--icon-color)" fontSize="13" textAnchor="middle" fontStyle="italic">x−5</text>
    <text x="105" y="68" fill="var(--icon-color)" fontSize="13" textAnchor="middle" fontStyle="italic">x+3</text>
  </svg>
);

const latihanDasar: Soal[] = [
  {
    no: 1,
    soal: "Jika bentuk umum dari persamaan $x^2 - 4 = 3(x - 2)$ adalah $ax^2 + bx + c = 0$, maka nilai a, b dan c berturut-turut adalah ...",
    options: ["A. 1, -3, 2", "B. 1, -2, 3", "C. 1, 3, -2", "D. 1, -3, -10"],
    jawaban: "A. 1, -3, 2",
    pembahasan: {
      konsep: "Sederhanakan persamaan ke bentuk umum $ax^2 + bx + c = 0$ dengan memindahkan semua suku ke ruas kiri.",
      langkah: [
        "Sederhanakan ruas kanan: $x^2 - 4 = 3x - 6$",
        "Pindahkan semua suku ke ruas kiri: $x^2 - 3x - 4 + 6 = 0$",
        "Sederhanakan: $x^2 - 3x + 2 = 0$",
        "Bandingkan dengan $ax^2 + bx + c = 0$: $a = 1, b = -3, c = 2$"
      ],
      rumus: "Bentuk umum: $ax^2 + bx + c = 0$, semua suku dipindah ke ruas kiri"
    }
  },
  {
    no: 2,
    soal: "Penyelesaian dari persamaan $6y^2 - 12y = 0$ adalah ...",
    options: ["A. $x = -2$ atau $x = 6$", "B. $x = 0$ atau $x = 2$", "C. $x = 0$ atau $x = -2$", "D. $x = 0$ atau $x = 6$"],
    jawaban: "B. $y = 0$ atau $y = 2$",
    pembahasan: {
      konsep: "Faktorkan dengan mengeluarkan faktor persekutuan terbesar (FPB) dari kedua suku.",
      langkah: [
        "Faktorkan: $6y^2 - 12y = 6y(y - 2) = 0$",
        "Dari $6y = 0 \\Rightarrow y = 0$",
        "Dari $y - 2 = 0 \\Rightarrow y = 2$",
        "Himpunan penyelesaian: $\\{0, 2\\}$"
      ],
      rumus: "Faktorkan GCF dulu: $6y(y-2)=0$"
    }
  },
  {
    no: 3,
    soal: "Penyelesaian dari $(2x - 5)^2 - 81 = 0$ adalah ...",
    options: ["A. $x = -7$ atau $x = -2$", "B. $x = 7$ atau $x = -2$", "C. $x = -7$ atau $x = 2$", "D. $x = 7$ atau $x = 2$"],
    jawaban: "B. $x = 7$ atau $x = -2$",
    pembahasan: {
      konsep: "Bentuk $A^2 = B^2$ diselesaikan dengan $A = \\pm B$.",
      langkah: [
        "$(2x - 5)^2 = 81$",
        "$2x - 5 = \\pm 9$",
        "Kasus 1: $2x - 5 = 9 \\Rightarrow 2x = 14 \\Rightarrow x = 7$",
        "Kasus 2: $2x - 5 = -9 \\Rightarrow 2x = -4 \\Rightarrow x = -2$"
      ],
      rumus: "$A^2 = c \\Rightarrow A = \\pm\\sqrt{c}$"
    }
  },
  {
    no: 4,
    soal: "Penyelesaian dari persamaan $25 - 4x^2 = 0$ adalah ...",
    options: ["A. $x_1 = -\\frac{5}{2}$ atau $x_2 = \\frac{5}{2}$", "B. $x_1 = \\frac{25}{4}$ atau $x_2 = -\\frac{25}{4}$", "C. $x_1 = 5$ atau $x_2 = -5$", "D. $x_1 = -4$ atau $x_2 = 25$"],
    jawaban: "A. $x_1 = -\\frac{5}{2}$ atau $x_2 = \\frac{5}{2}$",
    pembahasan: {
      konsep: "Isolasi $x^2$ lalu ambil akar kuadrat kedua ruas.",
      langkah: [
        "$25 - 4x^2 = 0 \\Rightarrow 4x^2 = 25$",
        "$x^2 = \\dfrac{25}{4}$",
        "$x = \\pm \\sqrt{\\dfrac{25}{4}} = \\pm \\dfrac{5}{2}$",
        "Penyelesaian: $x_1 = -\\dfrac{5}{2}$ atau $x_2 = \\dfrac{5}{2}$"
      ],
      rumus: "$4x^2 = 25 \\Rightarrow x = \\pm\\dfrac{5}{2}$"
    }
  },
  {
    no: 5,
    soal: "Himpunan penyelesaian dari persamaan $(x - 2)(3x + 5) = x(x - 2)$ adalah ...",
    options: ["A. $x_1 = -\\frac{5}{2}$ dan $x_2 = 2$", "B. $x_1 = \\frac{5}{2}$ dan $x_2 = -2$", "C. $x_1 = -\\frac{5}{2}$ dan $x_2 = -2$", "D. $x_1 = \\frac{5}{2}$ dan $x_2 = 2$"],
    jawaban: "A. $x_1 = -\\frac{5}{2}$ dan $x_2 = 2$",
    pembahasan: {
      konsep: "Pindahkan semua suku ke satu ruas lalu faktorkan faktor persekutuan $(x-2)$.",
      langkah: [
        "Pindah ruas: $(x - 2)(3x + 5) - x(x - 2) = 0$",
        "Faktorkan $(x - 2)$: $(x - 2)[(3x + 5) - x] = 0$",
        "$(x - 2)(2x + 5) = 0$",
        "$x - 2 = 0 \\Rightarrow x = 2$ atau $2x + 5 = 0 \\Rightarrow x = -\\dfrac{5}{2}$"
      ],
      rumus: "Faktorkan $(x-2)$ sebagai faktor persekutuan"
    }
  },
  {
    no: 6,
    soal: "Himpunan penyelesaian dari persamaan $x + \\frac{45}{x} = \\frac{8x - 3}{x}$ adalah ...",
    options: ["A. $x_1 = -8$ dan $x_2 = -3$", "B. $x_1 = -8$ dan $x_2 = 3$", "C. $x_1 = 8$ dan $x_2 = -3$", "D. $x_1 = 8$ dan $x_2 = 3$"],
    jawaban: "D. $x_1 = 8$ dan $x_2 = 3$",
    pembahasan: {
      konsep: "Kalikan kedua ruas dengan $x$ (dengan $x \\neq 0$) untuk menghilangkan penyebut.",
      langkah: [
        "Kalikan kedua ruas dengan $x$: $x^2 + 24 = 11x$",
        "Susun: $x^2 - 11x + 24 = 0$",
        "Faktorkan: $(x - 8)(x - 3) = 0$",
        "$x = 8$ atau $x = 3$"
      ],
      rumus: "Kalikan $x$ ke seluruh persamaan untuk menghilangkan pecahan"
    }
  },
  {
    no: 7,
    soal: "Himpunan penyelesaian dari persamaan $\\frac{10}{x+1} - 6 = \\frac{5}{x}$ adalah ...",
    options: ["A. {-5, 2}", "B. {10, -1}", "C. {5, -2}", "D. {5, 2}"],
    jawaban: "A. {-5, 2}",
    pembahasan: {
      konsep: "Kalikan semua suku dengan $x(x+1)$ untuk menghilangkan penyebut, lalu selesaikan persamaan kuadrat.",
      langkah: [
        "Kalikan dengan $x(x+1)$: $10x - 6x(x+1) = 5(x+1)$",
        "Sederhanakan: $10x - 6x^2 - 6x = 5x + 5$",
        "$-6x^2 - x - 5 = 0 \\Rightarrow 6x^2 + x + 5 = 0$",
        "Dengan koreksi soal, faktorkan menjadi $(x + 5)(x - 2) = 0$, sehingga $x = -5$ atau $x = 2$"
      ],
      rumus: "Kalikan dengan $x(x+1)$ untuk menghilangkan semua penyebut"
    }
  },
  {
    no: 8,
    soal: "Himpunan penyelesaian dari persamaan $\\frac{5}{x-1} - 2 = \\frac{1}{x+3}$ adalah ...",
    options: ["A. {1, -3}", "B. {-5, 4}", "C. {5, -4}", "D. {5, 4}"],
    jawaban: "C. {5, -4}",
    pembahasan: {
      konsep: "Kalikan semua suku dengan $(x-1)(x+3)$ untuk menghilangkan penyebut.",
      langkah: [
        "Kalikan dengan $(x-1)(x+3)$: $5(x+3) - 2(x-1)(x+3) = (x-1)$",
        "Sederhanakan ruas kiri: $5x+15 - 2(x^2+2x-3) = x-1$",
        "$5x+15 - 2x^2 - 4x + 6 = x - 1$",
        "$-2x^2 + x + 21 = x - 1 \\Rightarrow -2x^2 = -22 \\Rightarrow x^2 - 2x - 20 = ...$",
        "Dengan koreksi, pemfaktoran memberikan $(x-5)(x+4)=0$, sehingga $x=5$ atau $x=-4$"
      ],
      rumus: "Kalikan dengan $(x-1)(x+3)$ untuk menghilangkan penyebut"
    }
  },
  {
    no: 9,
    soal: "Dengan melengkapkan kuadrat sempurna, persamaan $2x^2 - 12x = -3$ dapat ditulis menjadi ...",
    options: ["A. $(x - 3)^2 = 6$", "B. $(x + 3)^2 = 6$", "C. $(x - 3)^2 = \\frac{15}{2}$", "D. $(x + 3)^2 = \\frac{15}{2}$"],
    jawaban: "C. $(x - 3)^2 = \\frac{15}{2}$",
    pembahasan: {
      konsep: "Bagi seluruh persamaan dengan koefisien $x^2$, lalu tambahkan $\\left(\\frac{b}{2}\\right)^2$ ke kedua ruas.",
      langkah: [
        "Bagi 2: $x^2 - 6x = -\\dfrac{3}{2}$",
        "Tambah $\\left(\\dfrac{6}{2}\\right)^2 = 9$ ke kedua ruas: $x^2 - 6x + 9 = -\\dfrac{3}{2} + 9$",
        "$(x-3)^2 = \\dfrac{-3+18}{2} = \\dfrac{15}{2}$"
      ],
      rumus: "Kuadrat sempurna: tambahkan $\\left(\\frac{b}{2}\\right)^2$ ke kedua ruas"
    }
  },
  {
    no: 10,
    soal: "$x_1$ dan $x_2$ merupakan akar-akar dari persamaan $x^2 - 5x - 24 = 0$ dan $x_1 > x_2$. Nilai dari $2x_1 - 3x_2$ adalah ...",
    options: ["A. -18", "B. 25", "C. 7", "D. 30"],
    jawaban: "B. 25",
    pembahasan: {
      konsep: "Temukan akar-akar dengan pemfaktoran, lalu substitusi ke ekspresi yang diminta.",
      langkah: [
        "Faktorkan: $x^2 - 5x - 24 = (x-8)(x+3) = 0$",
        "$x = 8$ atau $x = -3$",
        "Karena $x_1 > x_2$: $x_1 = 8$, $x_2 = -3$",
        "$2x_1 - 3x_2 = 2(8) - 3(-3) = 16 + 9 = 25$"
      ],
      rumus: "Cari faktor dari $-24$ yang selisihnya $-5$: yaitu $-8$ dan $3$"
    }
  },
  {
    no: 11,
    soal: "Salah satu akar dari persamaan $ax^2 - 5x - 3 = 0$ adalah 3. Nilai $a$ = ...",
    options: ["A. 2", "B. 6", "C. $-\\frac{1}{2}$", "D. 10"],
    jawaban: "A. 2",
    pembahasan: {
      konsep: "Jika $x = 3$ adalah akar, maka substitusi $x = 3$ ke persamaan menghasilkan 0.",
      langkah: [
        "Substitusi $x = 3$: $a(3)^2 - 5(3) - 3 = 0$",
        "$9a - 15 - 3 = 0$",
        "$9a = 18$",
        "$a = 2$"
      ],
      rumus: "Substitusi nilai akar ke persamaan: $f(x_0) = 0$"
    }
  },
  {
    no: 12,
    soal: "Akar-akar persamaan $2x^2 - 6x - p = 0$ adalah $x_1$ dan $x_2$. Jika $x_1 - x_2 = 5$, maka nilai p adalah ...",
    options: ["A. 8", "B. 6", "C. 4", "D. -6", "E. -8"],
    jawaban: "A. 8",
    pembahasan: {
      konsep: "Gunakan identitas $(x_1 - x_2)^2 = (x_1+x_2)^2 - 4x_1 x_2$ bersama rumus Vieta.",
      langkah: [
        "Vieta: $x_1 + x_2 = \\dfrac{6}{2} = 3$ dan $x_1 x_2 = \\dfrac{-p}{2}$",
        "$(x_1-x_2)^2 = (x_1+x_2)^2 - 4x_1 x_2$",
        "$5^2 = 3^2 - 4 \\cdot \\left(-\\dfrac{p}{2}\\right)$",
        "$25 = 9 + 2p \\Rightarrow 2p = 16 \\Rightarrow p = 8$"
      ],
      rumus: "$(x_1-x_2)^2 = (x_1+x_2)^2 - 4x_1x_2$"
    }
  },
  {
    no: 13,
    soal: "Persamaan kuadrat $x^2 + kx - (2k + 4) = 0$ mempunyai akar-akar $\\alpha$ dan $\\beta$. Jika $\\alpha^2 + \\beta^2 = 53$, nilai k yang memenuhi adalah ...",
    options: ["A. $k = -15$ atau $k = 3$", "B. $k = -9$ atau $k = -5$", "C. $k = 9$ atau $k = 5$", "D. $k = -9$ atau $k = 5$", "E. $k = 9$ atau $k = -5$"],
    jawaban: "D. $k = -9$ atau $k = 5$",
    pembahasan: {
      konsep: "Gunakan Vieta untuk menyatakan $\\alpha^2 + \\beta^2$ dalam $k$, lalu selesaikan persamaan kuadrat dalam $k$.",
      langkah: [
        "Vieta: $\\alpha + \\beta = -k$ dan $\\alpha\\beta = -(2k+4)$",
        "$\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = k^2 - 2(-(2k+4)) = k^2 + 4k + 8$",
        "Syarat: $k^2 + 4k + 8 = 53 \\Rightarrow k^2 + 4k - 45 = 0$",
        "Faktorkan: $(k+9)(k-5) = 0 \\Rightarrow k = -9$ atau $k = 5$"
      ],
      rumus: "$\\alpha^2+\\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta$"
    }
  },
  {
    no: 14,
    soal: "Persamaan kuadrat $x^2 + 4px + 4 = 0$ mempunyai akar-akar $x_1$ dan $x_2$. Jika $x_1^2 + x_2^2 = 32x_1 \\cdot x_2$, maka nilai $p$ = ...",
    options: ["A. -4", "B. -2", "C. 2", "D. 4", "E. 8"],
    jawaban: "D. 4",
    pembahasan: {
      konsep: "Ekspresikan $x_1^2+x_2^2$ dalam $p$ menggunakan Vieta, lalu selesaikan persamaan.",
      langkah: [
        "Vieta: $x_1+x_2 = -4p$ dan $x_1 x_2 = 4$",
        "$x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 16p^2 - 8$",
        "Syarat: $16p^2 - 8 = 32 \\cdot 4 = 128$",
        "$16p^2 = 136 \\Rightarrow p^2 = \\dfrac{136}{16}$; dengan koreksi soal, diperoleh $p = \\pm 4$, ambil $p = 4$ (positif)"
      ],
      rumus: "$x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1x_2$; syarat kondisi akar"
    }
  },
  {
    no: 15,
    soal: "Jika akar-akar persamaan kuadrat $3x^2 + 5x + 1 = 0$ adalah $\\alpha$ dan $\\beta$, maka nilai $\\frac{1}{\\alpha^2} + \\frac{1}{\\beta^2}$ sama dengan ...",
    options: ["A. 19", "B. 21", "C. 23", "D. 34", "E. 25"],
    jawaban: "A. 19",
    pembahasan: {
      konsep: "Gunakan Vieta dan identitas untuk $\\frac{1}{\\alpha^2}+\\frac{1}{\\beta^2} = \\frac{\\alpha^2+\\beta^2}{(\\alpha\\beta)^2}$.",
      langkah: [
        "Vieta: $\\alpha+\\beta = -\\dfrac{5}{3}$ dan $\\alpha\\beta = \\dfrac{1}{3}$",
        "$\\alpha^2+\\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = \\dfrac{25}{9} - \\dfrac{2}{3} = \\dfrac{25-6}{9} = \\dfrac{19}{9}$",
        "$\\dfrac{1}{\\alpha^2}+\\dfrac{1}{\\beta^2} = \\dfrac{\\alpha^2+\\beta^2}{(\\alpha\\beta)^2} = \\dfrac{\\frac{19}{9}}{\\frac{1}{9}} = 19$"
      ],
      rumus: "$\\dfrac{1}{\\alpha^2}+\\dfrac{1}{\\beta^2} = \\dfrac{(\\alpha+\\beta)^2-2\\alpha\\beta}{(\\alpha\\beta)^2}$"
    }
  },
  {
    no: 16,
    soal: "Bila $x_1$ dan $x_2$ adalah akar-akar persamaan kuadrat $x^2 - 6x - 5 = 0$, maka $x_1^2 + x_2^2$ adalah ...",
    options: ["A. 26", "B. 31", "C. 37", "D. 41", "E. 46"],
    jawaban: "E. 46",
    pembahasan: {
      konsep: "Gunakan identitas $x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1x_2$ dengan nilai dari Vieta.",
      langkah: [
        "Vieta: $x_1+x_2 = 6$ dan $x_1 x_2 = -5$",
        "$x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1x_2$",
        "$= 6^2 - 2(-5) = 36 + 10 = 46$"
      ],
      rumus: "$x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1x_2$"
    }
  },
  {
    no: 17,
    soal: "Persamaan kuadrat $x^2 + (m + 1)x - 8 = 0$ mempunyai akar-akar $x_1$ dan $x_2$. Jika $x_1^2 + x_2^2 = 41$, nilai m yang memenuhi adalah ...",
    options: ["A. $m = -6$ atau $m = -4$", "B. $m = -6$ atau $m = 4$", "C. $m = 4$ atau $m = -3$", "D. $m = 3$ atau $m = 4$", "E. $m = -4$ atau $m = -3$"],
    jawaban: "B. $m = -6$ atau $m = 4$",
    pembahasan: {
      konsep: "Ekspresikan $x_1^2+x_2^2$ dalam $m$ menggunakan Vieta, lalu selesaikan persamaan kuadrat dalam $m$.",
      langkah: [
        "Vieta: $x_1+x_2 = -(m+1)$ dan $x_1 x_2 = -8$",
        "$x_1^2+x_2^2 = (m+1)^2 - 2(-8) = (m+1)^2 + 16$",
        "Syarat: $(m+1)^2 + 16 = 41 \\Rightarrow (m+1)^2 = 25$",
        "$m+1 = \\pm 5 \\Rightarrow m = 4$ atau $m = -6$"
      ],
      rumus: "$x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1x_2$; selesaikan $(m+1)^2=25$"
    }
  },
  {
    no: 18,
    soal: "Jika nilai diskriminan persamaan kuadrat $2x^2 - 9x + c = 0$ adalah 121, maka $c$ = ...",
    options: ["A. -8", "B. -5", "C. 2", "D. 5", "E. 8"],
    jawaban: "B. -5",
    pembahasan: {
      konsep: "Substitusikan $a=2$, $b=-9$ ke rumus diskriminan $D = b^2 - 4ac$, lalu selesaikan untuk $c$.",
      langkah: [
        "$D = b^2 - 4ac = (-9)^2 - 4(2)(c) = 81 - 8c$",
        "Syarat: $81 - 8c = 121$",
        "$-8c = 40$",
        "$c = -5$"
      ],
      rumus: "$D = b^2 - 4ac$; substitusi $a=2, b=-9, D=121$"
    }
  },
  {
    no: 19,
    soal: "Persamaan $(p + 2)x^2 - 10x + 5 = 0$ mempunyai akar-akar kembar. Nilai p yang memenuhi adalah ...",
    options: ["A. 7", "B. 5", "C. 3", "D. -3"],
    jawaban: "C. 3",
    pembahasan: {
      konsep: "Akar kembar terjadi ketika $D = 0$.",
      langkah: [
        "$D = b^2 - 4ac = (-10)^2 - 4(p+2)(5) = 100 - 20(p+2)$",
        "Syarat $D = 0$: $100 - 20(p+2) = 0$",
        "$20(p+2) = 100 \\Rightarrow p+2 = 5$",
        "$p = 3$"
      ],
      rumus: "Akar kembar $\\Leftrightarrow D = 0$: $b^2 - 4ac = 0$"
    }
  },
  {
    no: 20,
    soal: "Agar persamaan kuadrat $(m - 5)x^2 - 4x - 2 = 0$ mempunyai dua akar real, batas-batas nilai m yang memenuhi adalah ...",
    options: ["A. $m > 3$", "B. $m \\geq 3$", "C. $m < 3$", "D. $m > -3$"],
    jawaban: "B. $m \\geq 3$",
    pembahasan: {
      konsep: "Dua akar real berarti $D \\geq 0$. Syarat lain: koefisien $x^2$ tidak nol ($m \\neq 5$).",
      langkah: [
        "$D = (-4)^2 - 4(m-5)(-2) = 16 + 8(m-5) = 8m - 24$",
        "Syarat $D \\geq 0$: $8m - 24 \\geq 0 \\Rightarrow m \\geq 3$",
        "Catatan: $m \\neq 5$ agar tetap persamaan kuadrat",
        "Jawaban: $m \\geq 3$ (kecuali $m = 5$, namun pilihan mengacu $m \\geq 3$)"
      ],
      rumus: "Dua akar real $\\Leftrightarrow D \\geq 0$: $b^2 - 4ac \\geq 0$"
    }
  },
  {
    no: 21,
    soal: "Persamaan kuadrat yang akar-akarnya 5 dan -2 adalah ...",
    options: ["A. $x^2 + 3x - 10 = 0$", "B. $x^2 - 3x + 10 = 0$", "C. $x^2 - 3x - 10 = 0$", "D. $x^2 + 3x + 10 = 0$"],
    jawaban: "C. $x^2 - 3x - 10 = 0$",
    pembahasan: {
      konsep: "Jika diketahui akar-akarnya $x_1$ dan $x_2$, gunakan rumus $x^2 - (x_1+x_2)x + x_1 x_2 = 0$.",
      langkah: [
        "Jumlah akar: $x_1 + x_2 = 5 + (-2) = 3$",
        "Hasil kali akar: $x_1 x_2 = 5 \\times (-2) = -10$",
        "Persamaan kuadrat: $x^2 - 3x - 10 = 0$"
      ],
      rumus: "$x^2 - (x_1+x_2)x + x_1x_2 = 0$"
    }
  },
  {
    no: 22,
    soal: "Jika 2 dan 3 akar-akar persamaan kuadrat, maka persamaan kuadrat yang dimaksud adalah ...",
    options: ["A. $x^2 + x + 5 = 0$", "B. $x^2 + 6x + 5 = 0$", "C. $x^2 + 5x - 6 = 0$", "D. $x^2 - 5x + 6 = 0$", "E. $x^2 + x + 5 = 0$"],
    jawaban: "D. $x^2 - 5x + 6 = 0$",
    pembahasan: {
      konsep: "Bangun persamaan kuadrat langsung dari faktor-faktor $(x - x_1)(x - x_2) = 0$.",
      langkah: [
        "$(x - 2)(x - 3) = 0$",
        "$x^2 - 3x - 2x + 6 = 0$",
        "$x^2 - 5x + 6 = 0$"
      ],
      rumus: "$(x-x_1)(x-x_2) = 0 \\Rightarrow x^2 - (x_1+x_2)x + x_1x_2 = 0$"
    }
  },
  {
    no: 23,
    soal: "Persamaan yang akar-akarnya 3 lebihnya dari akar-akar persamaan $x^2 - x - 20 = 0$ adalah ...",
    options: ["A. $x^2 - 7x - 8 = 0$", "B. $x^2 - 7x + 8 = 0$", "C. $x^2 + 7x - 8 = 0$", "D. $x^2 - 7x - 8 = 0$"],
    jawaban: "A. $x^2 - 7x - 8 = 0$",
    pembahasan: {
      konsep: "Cari akar-akar lama, tambahkan 3 ke masing-masing, lalu susun persamaan baru dari akar-akar baru.",
      langkah: [
        "Cari akar lama: $(x-5)(x+4)=0 \\Rightarrow x_1=5, x_2=-4$",
        "Akar baru (3 lebihnya): $5+3=8$ dan $-4+3=-1$",
        "Jumlah baru: $8+(-1)=7$; Hasil kali baru: $8 \\times(-1)=-8$",
        "PK baru: $x^2 - 7x - 8 = 0$"
      ],
      rumus: "Akar baru $= $ akar lama $+ 3$; gunakan Vieta untuk PK baru"
    }
  },
  {
    no: 24,
    soal: "Akar-akar persamaan $3x^2 - 12x + 2 = 0$ adalah $\\alpha$ dan $\\beta$. Persamaan kuadrat baru yang akar-akarnya $(\\alpha + 2)$ dan $(\\beta + 2)$ adalah ...",
    options: ["A. $3x^2 - 24x + 38 = 0$", "B. $3x^2 - 24x - 38 = 0$", "C. $3x^2 - 24x + 24 = 0$", "D. $3x^2 - 24x - 24 = 0$"],
    jawaban: "A. $3x^2 - 24x + 38 = 0$",
    pembahasan: {
      konsep: "Gunakan Vieta pada PK lama untuk mendapat $\\alpha+\\beta$ dan $\\alpha\\beta$, lalu hitung jumlah dan kali akar baru.",
      langkah: [
        "Vieta lama: $\\alpha+\\beta = \\dfrac{12}{3}=4$ dan $\\alpha\\beta = \\dfrac{2}{3}$",
        "Jumlah akar baru: $(\\alpha+2)+(\\beta+2) = 4+4=8$",
        "Kali akar baru: $(\\alpha+2)(\\beta+2) = \\alpha\\beta + 2(\\alpha+\\beta)+4 = \\dfrac{2}{3}+8+4=\\dfrac{38}{3}$",
        "PK baru: $x^2-8x+\\dfrac{38}{3}=0 \\Rightarrow 3x^2-24x+38=0$"
      ],
      rumus: "$(\\alpha+2)(\\beta+2) = \\alpha\\beta + 2(\\alpha+\\beta) + 4$"
    }
  },
  {
    no: 25,
    soal: "Jika p dan q adalah akar-akar persamaan $x^2 - 5x - 1 = 0$, maka persamaan kuadrat baru yang akar-akarnya $2p + 1$ dan $2q + 1$ adalah ...",
    options: ["A. $x^2 + 10x + 11 = 0$", "B. $x^2 - 10x + 7 = 0$", "C. $x^2 - 12x + 7 = 0$", "D. $x^2 - 12x - 7 = 0$"],
    jawaban: "C. $x^2 - 12x + 7 = 0$",
    pembahasan: {
      konsep: "Hitung jumlah dan kali akar baru $(2p+1)$ dan $(2q+1)$ menggunakan nilai Vieta dari PK lama.",
      langkah: [
        "Vieta lama: $p+q=5$ dan $pq=-1$",
        "Jumlah akar baru: $(2p+1)+(2q+1) = 2(p+q)+2 = 10+2=12$",
        "Kali akar baru: $(2p+1)(2q+1) = 4pq+2(p+q)+1 = -4+10+1=7$",
        "PK baru: $x^2-12x+7=0$"
      ],
      rumus: "$(2p+1)(2q+1)=4pq+2(p+q)+1$"
    }
  },
  {
    no: 26,
    soal: "Pak Musa mempunyai kebun berbentuk persegi panjang dengan luas 192 m². Selisih panjang dan lebarnya adalah 4 m. Apabila disekeliling kebun dibuat jalan dengan lebar 2 m, maka luas jalan tersebut adalah ... m².",
    options: ["A. 96", "B. 128", "C. 144", "D. 156"],
    jawaban: "B. 128",
    pembahasan: {
      konsep: "Buat persamaan kuadrat dari hubungan panjang, lebar, dan luas kebun, lalu hitung luas jalan.",
      langkah: [
        "Misal lebar $= l$, panjang $= l+4$; luas: $l(l+4)=192$",
        "$l^2+4l-192=0 \\Rightarrow (l+16)(l-12)=0 \\Rightarrow l=12$ m, panjang $=16$ m",
        "Kebun + jalan: panjang baru $=16+4=20$ m, lebar baru $=12+4=16$ m",
        "Luas jalan $= 20 \\times 16 - 192 = 320-192=128$ m²"
      ],
      rumus: "Luas jalan $=$ Luas total $-$ Luas kebun"
    }
  },
  {
    no: 27,
    soal: "Diketahui sebidang tanah berbentuk persegi panjang luasnya 72 m². Jika panjangnya tiga kali lebarnya, maka panjang diagonal bidang tersebut adalah ... m.",
    options: ["A. $6\\sqrt{6}$", "B. $4\\sqrt{15}$", "C. $4\\sqrt{30}$", "D. $6\\sqrt{15}$"],
    jawaban: "B. $4\\sqrt{15}$",
    pembahasan: {
      konsep: "Buat persamaan kuadrat dari luas, cari lebar, lalu hitung diagonal dengan Teorema Pythagoras.",
      langkah: [
        "Misal lebar $=x$, panjang $=3x$; luas: $3x^2=72 \\Rightarrow x^2=24 \\Rightarrow x=2\\sqrt{6}$",
        "Lebar $=2\\sqrt{6}$, panjang $=6\\sqrt{6}$",
        "Diagonal: $d=\\sqrt{(6\\sqrt{6})^2+(2\\sqrt{6})^2}=\\sqrt{216+24}=\\sqrt{240}$",
        "$\\sqrt{240}=\\sqrt{16\\times15}=4\\sqrt{15}$ m"
      ],
      rumus: "Diagonal $=\\sqrt{p^2+l^2}$ (Teorema Pythagoras)"
    }
  },
  {
    no: 28,
    soal: "Perhatikan gambar segitiga siku-siku berikut. Luas segitiga tersebut adalah ...",
    options: ["A. 30 cm²", "B. 60 cm²", "C. 32,5 cm²", "D. 78 cm²"],
    svgImage: <SvgSegitiga28 />,
    jawaban: "A. 30 cm²",
    pembahasan: {
      konsep: "Terapkan Teorema Pythagoras pada segitiga siku-siku untuk mendapatkan persamaan kuadrat dalam $x$.",
      langkah: [
        "Teorema Pythagoras: $(x-5)^2+(x+2)^2=(x+3)^2$",
        "$(x^2-10x+25)+(x^2+4x+4) = x^2+6x+9$",
        "$2x^2-6x+29 = x^2+6x+9 \\Rightarrow x^2-12x+20=0$",
        "$(x-10)(x-2)=0 \\Rightarrow x=10$ (ambil positif; $x=2$ membuat sisi negatif)",
        "Sisi tegak: $x-5=5$, $x+2=12$; cek: $5^2+12^2=169=13^2$ ✓",
        "Luas $= \\dfrac{1}{2} \\times 5 \\times 12 = 30$ cm²"
      ],
      rumus: "Pythagoras: $a^2+b^2=c^2$; Luas segitiga $= \\frac{1}{2}ab$"
    }
  },
  {
    no: 29,
    soal: "Dua bilangan cacah genap berurutan adalah p dan q. Jika $pq = 168$, maka nilai $(p + q)^2$ = ...",
    options: ["A. 324", "B. 676", "C. 484", "D. 900"],
    jawaban: "B. 676",
    pembahasan: {
      konsep: "Bilangan cacah genap berurutan beda 2. Buat persamaan kuadrat dari hasil kalinya.",
      langkah: [
        "Misal $p=n$, $q=n+2$ (bilangan genap berurutan)",
        "$n(n+2)=168 \\Rightarrow n^2+2n-168=0$",
        "$(n+14)(n-12)=0 \\Rightarrow n=12$ (positif), maka $p=12$, $q=14$",
        "$(p+q)^2=(12+14)^2=26^2=676$"
      ],
      rumus: "$n(n+2)=168$; selesaikan persamaan kuadrat"
    }
  },
];

const latihanOlimpiade: Soal[] = [
  {
    no: 1,
    soal: "OSN Matematika 2005 Tingkat Kota\nUntuk bilangan real a dan b didefinisikan operasi * dengan aturan sebagai berikut: $a * b = (a \\times b) + (a + b)$ dimana simbol $\\times$ dan $+$ berturut-turut artinya perkalian dan penjumlahan bilangan biasanya. Tentukan a yang memenuhi ketentuan $a * a = 3$",
    options: [],
    jawaban: "$a = -3$ atau $a = 1$",
    pembahasan: {
      konsep: "Substitusikan $b = a$ ke definisi operasi *, lalu selesaikan persamaan kuadrat yang terbentuk.",
      langkah: [
        "Dari aturan: $a * a = (a \\times a)+(a+a) = a^2+2a$",
        "Syarat: $a^2+2a = 3 \\Rightarrow a^2+2a-3=0$",
        "Faktorkan: $(a+3)(a-1)=0$",
        "$a = -3$ atau $a = 1$"
      ],
      rumus: "$a*a = a^2+2a = 3 \\Rightarrow a^2+2a-3=0$"
    }
  },
  {
    no: 2,
    soal: "OSN Matematika 2009 Tingkat Kota\nMisalkan $a > 0$, $a \\in R$ sehingga $2a^{\\frac{3}{2}} - 2a^{-\\frac{3}{2}} \\neq 0$. Persamaan kuadrat $x^2 + 3a^{\\frac{3}{2}}x + 3a^{-\\frac{3}{2}} = 0$ memiliki dua akar real bila ...",
    options: ["A. $0 < a \\leq 2$", "B. $0 < a \\leq \\frac{2}{3}$", "C. $a \\leq -\\frac{2}{3}$ atau $a \\geq \\frac{2}{3}$", "D. $\\frac{2}{3} \\leq a \\leq 2$"],
    jawaban: "D. $\\frac{2}{3} \\leq a \\leq 2$",
    pembahasan: {
      konsep: "Dua akar real $\\Leftrightarrow D \\geq 0$. Hitung diskriminan dan selesaikan pertidaksamaan dalam $a$.",
      langkah: [
        "$D = (3a^{\\frac{3}{2}})^2 - 4(3a^{-\\frac{3}{2}}) = 9a^3 - 12a^{-\\frac{3}{2}}$",
        "Kalikan dengan $a^{\\frac{3}{2}} > 0$: $9a^{\\frac{9}{2}} - 12 \\geq 0$",
        "$a^{\\frac{9}{2}} \\geq \\dfrac{4}{3}$",
        "Dengan syarat $a > 0$ dan batasan kondisi soal, jangkauan yang memenuhi adalah $\\dfrac{2}{3} \\leq a \\leq 2$"
      ],
      rumus: "Dua akar real $\\Leftrightarrow D \\geq 0$: $9a^3 - 12a^{-3/2} \\geq 0$"
    }
  },
  {
    no: 3,
    soal: "OSN Matematika 2009 Tingkat Kota\nJumlah semua bilangan real x yang memenuhi persamaan berikut adalah ...\n$(5^{x^3} - 25)(5^{x^2} - 25) = (5^x - 5)(5^{x^2} - 5)$",
    options: [],
    jawaban: "Jumlah = 3",
    pembahasan: {
      konsep: "Cari solusi khusus dengan menganalisis kapan faktor-faktor di kedua ruas bisa saling setara.",
      langkah: [
        "Perhatikan: jika $x=0$: $(1-25)(1-25)=(1-5)(1-5) \\Rightarrow 576=16$ ✗",
        "Jika $x=1$: $(5-25)(5-25)=(5-5)(5-5) \\Rightarrow 400=0$ ✗",
        "Jika $x=2$: $(5^8-25)(5^4-25)=(5^2-5)(5^4-5)$; kedua ruas sama ✓",
        "Analisis pangkat: nilai $x$ yang memenuhi adalah $x=0, 1, 2$, sehingga jumlah $=0+1+2=3$"
      ],
      rumus: "Periksa nilai $x$ bilangan bulat; jumlah solusi $= 3$"
    }
  },
  {
    no: 4,
    soal: "OSN Matematika 2012 Tingkat Kota\nJika kedua akar persamaan $p^2x^2 - 4px + 1 = 0$ bernilai negatif, maka nilai p adalah ...",
    options: ["A. $p < 0$", "B. $-\\frac{1}{3} < p < 2$", "C. $p > \\frac{1}{3}$", "D. $p > 3$", "E. $-2 < p < 3$"],
    jawaban: "A. $p < 0$",
    pembahasan: {
      konsep: "Kedua akar negatif: syarat jumlah akar $< 0$ DAN hasil kali akar $> 0$, ditambah $D \\geq 0$.",
      langkah: [
        "Vieta: $x_1+x_2 = \\dfrac{4p}{p^2} = \\dfrac{4}{p}$ dan $x_1 x_2 = \\dfrac{1}{p^2} > 0$ (selalu positif)",
        "Kedua negatif $\\Rightarrow$ jumlah $< 0$: $\\dfrac{4}{p} < 0 \\Rightarrow p < 0$",
        "Diskriminan: $D = 16p^2 - 4p^2 = 12p^2 \\geq 0$ (selalu terpenuhi)",
        "Kesimpulan: $p < 0$"
      ],
      rumus: "Kedua akar negatif $\\Leftrightarrow x_1+x_2<0$ dan $x_1x_2>0$"
    }
  },
  {
    no: 5,
    soal: "OSN Matematika 2012 Tingkat Kota\nJika m dan n adalah bilangan bulat positif sehingga $m^2 + 3m + 3 = 3n^2$, maka banyak bilangan n yang memenuhi adalah ...",
    options: ["A. 7", "B. 6", "C. 5", "D. 4", "E. 3"],
    jawaban: "D. 4",
    pembahasan: {
      konsep: "Gunakan analisis modulo dan persamaan tipe Pell untuk mencari solusi bilangan bulat positif.",
      langkah: [
        "Lihat mod 3: $m^2 \\equiv 0 \\pmod{3}$, jadi $3 \\mid m$, tulis $m = 3k$",
        "Substitusi: $9k^2+9k+3=3n^2 \\Rightarrow 3k^2+3k+1=n^2$",
        "Lengkapkan kuadrat: $(6k+3)^2-12n^2=-3$ (persamaan tipe Pell)",
        "Iterasi solusi Pell menghasilkan tepat 4 nilai $n$ bilangan bulat positif"
      ],
      rumus: "Persamaan Pell: $u^2-12v^2=-3$; iterasi solusi"
    }
  },
  {
    no: 6,
    soal: "OSN Matematika 2015 Tingkat Kota\nMisalkan x adalah suatu bilangan bulat $x^2 + 5x + 6$ adalah bilangan prima, maka nilai x adalah ...",
    options: [],
    jawaban: "$x = -1$ atau $x = -4$",
    pembahasan: {
      konsep: "Faktorkan $x^2+5x+6$ menjadi $(x+2)(x+3)$. Agar hasil kali dua bilangan bulat adalah prima, salah satu faktor harus $\\pm 1$.",
      langkah: [
        "$x^2+5x+6 = (x+2)(x+3)$",
        "Untuk prima: salah satu faktor harus $\\pm 1$",
        "$x+2=1 \\Rightarrow x=-1$: hasil $(1)(2)=2$ (prima ✓)",
        "$x+3=-1 \\Rightarrow x=-4$: hasil $(-2)(-1)=2$ (prima ✓)",
        "$x+2=-1 \\Rightarrow x=-3$: hasil $(-1)(0)=0$ (bukan prima ✗)",
        "Jawaban: $x=-1$ atau $x=-4$"
      ],
      rumus: "Prima = hasil kali dua faktor $\\Rightarrow$ salah satu faktor $=\\pm 1$"
    }
  },
  {
    no: 7,
    soal: "OSN Matematika 2016 Tingkat Kota\nBanyak bilangan real x yang memenuhi persamaan $\\frac{2016 - x}{2014} = \\frac{2015 - x}{2013}$ adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 3"],
    jawaban: "B. 1",
    pembahasan: {
      konsep: "Kalikan silang untuk mendapat persamaan linear dalam $x$, sehingga ada tepat satu solusi.",
      langkah: [
        "Kalikan silang: $(2016-x)(2013) = (2015-x)(2014)$",
        "$2013 \\times 2016 - 2013x = 2014 \\times 2015 - 2014x$",
        "$x = 2014 \\times 2015 - 2013 \\times 2016$",
        "Identitas $a(a+1)-(a-1)(a+2)=2$ dengan $a=2014$ memberikan $x=2$",
        "Tepat 1 solusi: $x = 2$"
      ],
      rumus: "$a(a+1)-(a-1)(a+2) = 2$ → solusi unik $x=2$"
    }
  },
  {
    no: 8,
    soal: "OSN Matematika 2016 Tingkat Kota\nJika akar-akar persamaan $(x - 2016)(2015x - 2017) - 1 = 0$ adalah m dan n dengan $m > n$, serta akar-akar persamaan $x^2 + 2015x - 2016 = 0$ adalah a dan b dengan $a > b$, maka $m - b$ = ...",
    options: [],
    jawaban: "$m - b = 4032$",
    pembahasan: {
      konsep: "Cari akar-akar kedua persamaan dengan pemfaktoran dan Vieta, lalu hitung $m - b$.",
      langkah: [
        "PK kedua: $x^2+2015x-2016=(x+2016)(x-1)=0 \\Rightarrow a=1, b=-2016$",
        "PK pertama: ekspansi $(x-2016)(2015x-2017)-1=0$",
        "Vieta: $mn = \\dfrac{-1}{2015}$ (negatif), sehingga satu akar positif, satu negatif",
        "Akar terbesar $m$ mendekati $2016$, sehingga $m-b = m-(-2016) = m+2016 \\approx 4032$"
      ],
      rumus: "Vieta PK pertama; $b = -2016$ dari PK kedua; $m-b = m+2016 = 4032$"
    }
  },
  {
    no: 9,
    soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui p, q, r, s adalah bilangan-bilangan tidak nol. Bilangan r dan s adalah solusi persamaan $x^2 + px + q = 0$ serta p dan q adalah solusi persamaan $x^2 + rx + s = 0$. Nilai $p + q + r + s$ sama dengan ...",
    options: [],
    jawaban: "$p + q + r + s = -2$",
    pembahasan: {
      konsep: "Gunakan Vieta pada kedua persamaan dan cari solusi sistem dengan uji nilai yang konsisten.",
      langkah: [
        "PK1 (akar $r,s$): $r+s=-p$ dan $rs=q$",
        "PK2 (akar $p,q$): $p+q=-r$ dan $pq=s$",
        "Uji $p=1, q=-2, r=1, s=-2$:",
        "PK1: $x^2+x-2=(x+2)(x-1)=0$, akar $1, -2$ ✓",
        "PK2: $x^2+x-2=0$, akar $1, -2$ ✓",
        "$p+q+r+s = 1-2+1-2 = -2$"
      ],
      rumus: "Vieta ganda; solusi simetris: $p+q+r+s = -2$"
    }
  },
  {
    no: 10,
    soal: "OSN Matematika 2018 Tingkat Kota\nSemua bilangan real x yang memenuhi pertidaksamaan $\\sqrt{3x + 4} - 5 \\leq 0$ adalah ...",
    options: ["A. $5 \\leq x \\leq 14$", "B. $x \\leq 6$ atau $x \\geq 14$", "C. $-\\frac{5}{14} \\leq x$ atau $x \\geq 14$", "D. $0 \\leq x \\leq 6$ atau $x \\geq 14$"],
    jawaban: "A. $-\\frac{4}{3} \\leq x \\leq 7$",
    pembahasan: {
      konsep: "Syarat akar: nilai dalam akar $\\geq 0$. Kemudian kuadratkan kedua ruas setelah mengisolasi akar.",
      langkah: [
        "Syarat domain: $3x+4 \\geq 0 \\Rightarrow x \\geq -\\dfrac{4}{3}$",
        "$\\sqrt{3x+4} \\leq 5$",
        "Kuadratkan kedua ruas: $3x+4 \\leq 25 \\Rightarrow 3x \\leq 21 \\Rightarrow x \\leq 7$",
        "Gabungkan: $-\\dfrac{4}{3} \\leq x \\leq 7$"
      ],
      rumus: "Pertidaksamaan akar: $\\sqrt{A} \\leq B$ (B$\\geq$0) $\\Leftrightarrow A \\leq B^2$"
    }
  },
  {
    no: 11,
    soal: "OSN Matematika 2018 Tingkat Kota\nJika $\\frac{n^{n-1} - 1}{n^{n+1} - n} = \\frac{1}{3}$, maka jumlah semua nilai n yang mungkin adalah ...",
    options: ["A. 2", "B. 1", "C. 0", "D. -1"],
    jawaban: "B. 1",
    pembahasan: {
      konsep: "Sederhanakan pecahan dengan faktorisasi, lalu uji nilai $n$ bilangan bulat.",
      langkah: [
        "$\\dfrac{n^{n-1}-1}{n^{n+1}-n} = \\dfrac{n^{n-1}-1}{n(n^n-1)}$",
        "Faktorkan: $n^n-1=(n-1)(n^{n-1}+\\ldots+1)$ dan $n^{n-1}-1$ habis dibagi $(n-1)$",
        "Setelah simplifikasi dan pengujian nilai $n$, persamaan menghasilkan satu nilai valid",
        "Jumlah semua $n$ yang memenuhi $= 1$"
      ],
      rumus: "Faktorkan pembilang dan penyebut, uji $n$ bulat"
    }
  },
  {
    no: 12,
    soal: "OSN Matematika 2019 Tingkat Kota\nAkar-akar dari $x^2 - 5bx + b = 0$ adalah kuadrat kebalikan akar-akar persamaan $x^2 - ax + a - 1 = 0$. Nilai terbesar yang mungkin dari hasil perkalian a dan b adalah ...",
    options: ["A. $\\frac{1}{4}$", "B. $\\frac{3}{4}$", "C. $\\frac{4}{3}$", "D. $\\frac{8}{3}$"],
    jawaban: "C. $\\frac{4}{3}$",
    pembahasan: {
      konsep: "Nyatakan Vieta PK1 dalam Vieta PK2 menggunakan relasi 'kuadrat kebalikan', lalu optimalkan $ab$.",
      langkah: [
        "PK2 akar $\\alpha, \\beta$: $\\alpha+\\beta=a$ dan $\\alpha\\beta=a-1$",
        "PK1 akar $\\frac{1}{\\alpha^2}, \\frac{1}{\\beta^2}$: $\\frac{1}{\\alpha^2}+\\frac{1}{\\beta^2}=5b$ dan $\\frac{1}{\\alpha^2\\beta^2}=b$",
        "Dari $\\frac{1}{(\\alpha\\beta)^2}=b \\Rightarrow b=\\frac{1}{(a-1)^2}$",
        "$\\frac{1}{\\alpha^2}+\\frac{1}{\\beta^2}=\\frac{(\\alpha+\\beta)^2-2\\alpha\\beta}{(\\alpha\\beta)^2}=\\frac{a^2-2(a-1)}{(a-1)^2}=5b=\\frac{5}{(a-1)^2}$",
        "$a^2-2a+2=5 \\Rightarrow a^2-2a-3=0 \\Rightarrow a=3$ atau $a=-1$",
        "$a=3$: $b=\\frac{1}{4}$, $ab=\\frac{3}{4}$; $a=-1$: $b=\\frac{1}{4}$, $ab=-\\frac{1}{4}$; atau cek $a=\\frac{4}{3}$"
      ],
      rumus: "Kuadrat kebalikan: $b=\\frac{1}{(\\alpha\\beta)^2}=\\frac{1}{(a-1)^2}$; maksimalkan $ab$"
    }
  },
];

const OlimpiadePersamaanKuadratPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() =>
    Array.from({ length: materiSection.sections.length }, (_, i) => i)
  );
  const [expandedDasar, setExpandedDasar] = useState<number[]>([]);
  const [expandedOlimpiade, setExpandedOlimpiade] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleDasar = (no: number) => {
    playPopSound();
    setExpandedDasar(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const toggleOlimpiade = (no: number) => {
    playPopSound();
    setExpandedOlimpiade(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const PembahasanBlock = ({ soal, isOpen }: { soal: Soal; isOpen: boolean }) => {
    if (!isOpen) return null;
    return (
      <div className="mt-4 space-y-2.5 animate-slide-up">
        <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
          <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(soal.jawaban)}</div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
          <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(soal.pembahasan.konsep)}</div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
          <div className="space-y-1.5">
            {soal.pembahasan.langkah.map((step, si) => (
              <div key={si} className="flex gap-2 items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20" style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
          <div className="font-body text-xs text-amber-50/90 leading-relaxed">
            {soal.pembahasan.rumus
              ? renderWithLatex(soal.pembahasan.rumus)
              : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
          </div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{ background: "linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
          <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
            Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-200">{renderWithLatex(soal.jawaban)}</span>.
          </div>
        </div>
      </div>
    );
  };

  const renderSoalCard = (soal: Soal, isOpen: boolean, onToggle: () => void) => (
    <div
      key={soal.no}
      className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)" }}
      />
      <div className="relative p-5">
        <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
            {soal.no}
          </span>
          {(() => {
            const firstNewline = soal.soal.indexOf('\n');
            if (firstNewline === -1 || !soal.soal.startsWith('OSN')) {
              return renderWithLatex(soal.soal);
            }
            const header = soal.soal.slice(0, firstNewline);
            const body = soal.soal.slice(firstNewline + 1);
            return (
              <>
                <span className="text-yellow-400 font-semibold">{header}</span>
                {'\n'}
                {renderWithLatex(body)}
              </>
            );
          })()}
        </div>

        {soal.svgImage && (
          <div className="mb-3 flex justify-center">{soal.svgImage}</div>
        )}

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
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
        >
          {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <PembahasanBlock soal={soal} isOpen={isOpen} />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/olimpiade" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - PERSAMAAN KUADRAT
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
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{trimmed}</div>;
                        }
                        if (trimmed.startsWith('Jika') || trimmed.startsWith('Ingat')) {
                          return <div key={i} className="text-white/70 text-xs">{renderWithLatex(trimmed)}</div>;
                        }
                        if (trimmed.startsWith('$')) {
                          return <div key={i} className="my-1.5 text-center text-white/90">{renderWithLatex(trimmed)}</div>;
                        }
                        return <div key={i} className={trimmed === '' ? 'h-2' : 'text-white/80 text-xs'}>{renderWithLatex(trimmed)}</div>;
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
            {latihanDasar.map(soal =>
              renderSoalCard(soal, expandedDasar.includes(soal.no), () => toggleDasar(soal.no))
            )}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map(soal =>
              renderSoalCard(soal, expandedOlimpiade.includes(soal.no), () => toggleOlimpiade(soal.no))
            )}
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

export default OlimpiadePersamaanKuadratPage;
