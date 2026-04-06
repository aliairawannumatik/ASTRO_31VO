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
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
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
    <text x="-10" y="82" fill="white" fontSize="13" textAnchor="middle" fontStyle="italic">x+2</text>
    <text x="85" y="158" fill="white" fontSize="13" textAnchor="middle" fontStyle="italic">x−5</text>
    <text x="105" y="68" fill="white" fontSize="13" textAnchor="middle" fontStyle="italic">x+3</text>
  </svg>
);


const latihanDasar: { no: number; soal: string; options: string[]; svgImage?: ReactNode }[] = [
  { no: 1, soal: "Jika bentuk umum dari persamaan $x^2 - 4 = 3(x - 2)$ adalah $ax^2 + bx + c = 0$, maka nilai a, b dan c berturut-turut adalah ...", options: ["A. 1, -3, 2", "B. 1, -2, 3", "C. 1, 3, -2", "D. 1, -3, -10"] },
  { no: 2, soal: "Penyelesaian dari persamaan $6y^2 - 12y = 0$ adalah ...", options: ["A. $x = -2$ atau $x = 6$", "B. $x = 0$ atau $x = 2$", "C. $x = 0$ atau $x = -2$", "D. $x = 0$ atau $x = 6$"] },
  { no: 3, soal: "Penyelesaian dari $(2x - 5)^2 - 81 = 0$ adalah ...", options: ["A. $x = -7$ atau $x = -2$", "B. $x = 7$ atau $x = -2$", "C. $x = -7$ atau $x = 2$", "D. $x = 7$ atau $x = 2$"] },
  { no: 4, soal: "Penyelesaian dari persamaan $25 - 4x^2 = 0$ adalah ...", options: ["A. $x_1 = -\\frac{5}{2}$ atau $x_2 = \\frac{5}{2}$", "B. $x_1 = \\frac{25}{4}$ atau $x_2 = -\\frac{25}{4}$", "C. $x_1 = 5$ atau $x_2 = -5$", "D. $x_1 = -4$ atau $x_2 = 25$"] },
  { no: 5, soal: "Himpunan penyelesaian dari persamaan $(x - 2)(3x + 5) = x(x - 2)$ adalah ...", options: ["A. $x_1 = -\\frac{5}{2}$ dan $x_2 = 2$", "B. $x_1 = \\frac{5}{2}$ dan $x_2 = -2$", "C. $x_1 = -\\frac{5}{2}$ dan $x_2 = -2$", "D. $x_1 = \\frac{5}{2}$ dan $x_2 = 2$"] },
  { no: 6, soal: "Himpunan penyelesaian dari persamaan $x + \\frac{45}{x} = \\frac{8x - 3}{x}$ adalah ...", options: ["A. $x_1 = -8$ dan $x_2 = -3$", "B. $x_1 = -8$ dan $x_2 = 3$", "C. $x_1 = 8$ dan $x_2 = -3$", "D. $x_1 = 8$ dan $x_2 = 3$"] },
  { no: 7, soal: "Himpunan penyelesaian dari persamaan $\\frac{10}{x+1} - 6 = \\frac{5}{x}$ adalah ...", options: ["A. {-5, 2}", "B. {10, -1}", "C. {5, -2}", "D. {5, 2}"] },
  { no: 8, soal: "Himpunan penyelesaian dari persamaan $\\frac{5}{x-1} - 2 = \\frac{1}{x+3}$ adalah ...", options: ["A. {1, -3}", "B. {-5, 4}", "C. {5, -4}", "D. {5, 4}"] },
  { no: 9, soal: "Dengan melengkapkan kuadrat sempurna, persamaan $2x^2 - 12x = -3$ dapat ditulis menjadi ...", options: ["A. $(x - 3)^2 = 6$", "B. $(x + 3)^2 = 6$", "C. $(x - 3)^2 = \\frac{15}{2}$", "D. $(x + 3)^2 = \\frac{15}{2}$"] },
  { no: 10, soal: "$x_1$ dan $x_2$ merupakan akar-akar dari persamaan $x^2 - 5x - 24 = 0$ dan $x_1 > x_2$. Nilai dari $2x_1 - 3x_2$ adalah ...", options: ["A. -18", "B. 25", "C. 7", "D. 30"] },
  { no: 11, soal: "Salah satu akar dari persamaan $ax^2 - 5x - 3 = 0$ adalah 3. Nilai $a$ = ...", options: ["A. 2", "B. 6", "C. $-\\frac{1}{2}$", "D. 10"] },
  { no: 12, soal: "Akar-akar persamaan $2x^2 - 6x - p = 0$ adalah $x_1$ dan $x_2$. Jika $x_1 - x_2 = 5$, maka nilai p adalah ...", options: ["A. 8", "B. 6", "C. 4", "D. -6", "E. -8"] },
  { no: 13, soal: "Persamaan kuadrat $x^2 + kx - (2k + 4) = 0$ mempunyai akar-akar $\\alpha$ dan $\\beta$. Jika $\\alpha^2 + \\beta^2 = 53$, nilai k yang memenuhi adalah ...", options: ["A. $k = -15$ atau $k = 3$", "B. $k = -9$ atau $k = -5$", "C. $k = 9$ atau $k = 5$", "D. $k = -9$ atau $k = 5$", "E. $k = 9$ atau $k = -5$"] },
  { no: 14, soal: "Persamaan kuadrat $x^2 + 4px + 4 = 0$ mempunyai akar-akar $x_1$ dan $x_2$. Jika $x_1^2 + x_2^2 = 32x_1 \\cdot x_2$, maka nilai $p$ = ...", options: ["A. -4", "B. -2", "C. 2", "D. 4", "E. 8"] },
  { no: 15, soal: "Jika akar-akar persamaan kuadrat $3x^2 + 5x + 1 = 0$ adalah $\\alpha$ dan $\\beta$, maka nilai $\\frac{1}{\\alpha} + \\frac{1}{\\beta}$ sama dengan ...", options: ["A. 19", "B. 21", "C. 23", "D. 34", "E. 25"] },
  { no: 16, soal: "Bila $x_1$ dan $x_2$ adalah akar-akar persamaan kuadrat $x^2 - 6x - 5 = 0$, maka $x_1^2 + x_2^2$ adalah ...", options: ["A. 26", "B. 31", "C. 37", "D. 41", "E. 46"] },
  { no: 17, soal: "Persamaan kuadrat $x^2 + (m + 1)x - 8 = 0$ mempunyai akar-akar $x_1$ dan $x_2$. Jika $x_1^2 + x_2^2 = 41$, nilai m yang memenuhi adalah ...", options: ["A. $m = -6$ atau $m = -4$", "B. $m = -6$ atau $m = 4$", "C. $m = 4$ atau $m = -3$", "D. $m = 3$ atau $m = 4$", "E. $m = -4$ atau $m = -3$"] },
  { no: 18, soal: "Jika nilai diskriminan persamaan kuadrat $2x^2 - 9x + c = 0$ adalah 121, maka $c$ = ...", options: ["A. -8", "B. -5", "C. 2", "D. 5", "E. 8"] },
  { no: 19, soal: "Persamaan $(p + 2)x^2 - 10x + 5 = 0$ mempunyai akar-akar kembar. Nilai p yang memenuhi adalah ...", options: ["A. 7", "B. 5", "C. 3", "D. -3"] },
  { no: 20, soal: "Agar persamaan kuadrat $(m - 5)x^2 - 4x - 2 = 0$ mempunyai dua akar real, batas-batas nilai m yang memenuhi adalah ...", options: ["A. $m > 3$", "B. $m \\geq 3$", "C. $m < 3$", "D. $m > -3$"] },
  { no: 21, soal: "Persamaan kuadrat yang akar-akarnya 5 dan -2 adalah ...", options: ["A. $x^2 + 3x - 10 = 0$", "B. $x^2 - 3x + 10 = 0$", "C. $x^2 - 3x - 10 = 0$", "D. $x^2 + 3x + 10 = 0$"] },
  { no: 22, soal: "Jika 2 dan 3 akar-akar persamaan kuadrat, maka persamaan kuadrat yang dimaksud adalah ...", options: ["A. $x^2 + x + 5 = 0$", "B. $x^2 + 6x + 5 = 0$", "C. $x^2 + 5x - 6 = 0$", "D. $x^2 - 5x + 6 = 0$", "E. $x^2 + x + 5 = 0$"] },
  { no: 23, soal: "Persamaan yang akar-akarnya 3 lebihnya dari akar-akar persamaan $x^2 - x - 20 = 0$ adalah ...", options: ["A. $x^2 - 7x - 8 = 0$", "B. $x^2 - 7x + 8 = 0$", "C. $x^2 + 7x - 8 = 0$", "D. $x^2 - 7x - 8 = 0$"] },
  { no: 24, soal: "Akar-akar persamaan $3x^2 - 12x + 2 = 0$ adalah $\\alpha$ dan $\\beta$. Persamaan kuadrat baru yang akar-akarnya $(\\alpha + 2)$ dan $(\\beta + 2)$ adalah ...", options: ["A. $3x^2 - 24x + 38 = 0$", "B. $3x^2 - 24x - 38 = 0$", "C. $3x^2 - 24x + 24 = 0$", "D. $3x^2 - 24x - 24 = 0$"] },
  { no: 25, soal: "Jika p dan q adalah akar-akar persamaan $x^2 - 5x - 1 = 0$, maka persamaan kuadrat baru yang akar-akarnya $2p + 1$ dan $2q + 1$ adalah ...", options: ["A. $x^2 + 10x + 11 = 0$", "B. $x^2 - 10x + 7 = 0$", "C. $x^2 - 12x + 7 = 0$", "D. $x^2 - 12x - 7 = 0$"] },
  { no: 26, soal: "Pak Musa mempunyai kebun berbentuk persegi panjang dengan luas 192 m². Selisih panjang dan lebarnya adalah 4 m. Apabila disekeliling kebun dibuat jalan dengan lebar 2 m, maka luas jalan tersebut adalah ... m².", options: ["A. 96", "B. 128", "C. 144", "D. 156"] },
  { no: 27, soal: "Diketahui sebidang tanah berbentuk persegi panjang luasnya 72 m². Jika panjangnya tiga kali lebarnya, maka panjang diagonal bidang tersebut adalah ... m.", options: ["A. $6\\sqrt{6}$", "B. $4\\sqrt{15}$", "C. $4\\sqrt{30}$", "D. $6\\sqrt{15}$"] },
  { no: 28, soal: "Perhatikan gambar segitiga siku-siku berikut. Luas segitiga tersebut adalah ...", options: ["A. 30 cm²", "B. 60 cm²", "C. 32,5 cm²", "D. 78 cm²"], svgImage: <SvgSegitiga28 /> },
  { no: 29, soal: "Dua bilangan cacah genap berurutan adalah p dan q. Jika $pq = 168$, maka nilai $(p + q)^2$ = ...", options: ["A. 324", "B. 676", "C. 484", "D. 900"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2005 Tingkat Kota\nUntuk bilangan real a dan b didefinisikan operasi * dengan aturan sebagai berikut: $a * b = (a \\times b) + (a + b)$ dimana simbol $\\times$ dan $+$ berturut-turut artinya perkalian dan penjumlahan bilangan biasanya. Tentukan a yang memenuhi ketentuan $a * a = 3$", options: [] },
  { no: 2, soal: "OSN Matematika 2009 Tingkat Kota\nMisalkan $a > 0$, $a \\in R$ sehingga $2a^{\\frac{3}{2}} - 2a^{-\\frac{3}{2}} \\neq 0$. Persamaan kuadrat $x^2 + 3a^{\\frac{3}{2}}x + 3a^{-\\frac{3}{2}} = 0$ memiliki dua akar real bila ...", options: ["A. $0 < a \\leq 2$", "B. $0 < a \\leq \\frac{2}{3}$", "C. $a \\leq -\\frac{2}{3}$ atau $a \\geq \\frac{2}{3}$", "D. $\\frac{2}{3} \\leq a \\leq 2$"] },
  { no: 3, soal: "OSN Matematika 2009 Tingkat Kota\nJumlah semua bilangan real x yang memenuhi persamaan berikut adalah ...\n$(5^{x^3} - 25)(5^{x^2} - 25) = (5^x - 5)(5^{x^2} - 5)$", options: [] },
  { no: 4, soal: "OSN Matematika 2012 Tingkat Kota\nJika kedua akar persamaan $p^2x^2 - 4px + 1 = 0$ bernilai negatif, maka nilai p adalah ...", options: ["A. $p < 0$", "B. $-\\frac{1}{3} < p < 2$", "C. $p > \\frac{1}{3}$", "D. $p > 3$", "E. $-2 < p < 3$"] },
  { no: 5, soal: "OSN Matematika 2012 Tingkat Kota\nJika m dan n adalah bilangan bulat positif sehingga $m^2 + 3m + 3 = 3n^2$, maka banyak bilangan n yang memenuhi adalah ...", options: ["A. 7", "B. 6", "C. 5", "D. 4", "E. 3"] },
  { no: 6, soal: "OSN Matematika 2015 Tingkat Kota\nMisalkan x adalah suatu bilangan bulat $x^2 + 5x + 6$ adalah bilangan prima, maka nilai x adalah ...", options: [] },
  { no: 7, soal: "OSN Matematika 2016 Tingkat Kota\nBanyak bilangan real x yang memenuhi persamaan $\\frac{2016 - x}{2014} = \\frac{2015 - x}{2013}$ adalah ...", options: ["A. 0", "B. 1", "C. 2", "D. 3"] },
  { no: 8, soal: "OSN Matematika 2016 Tingkat Kota\nJika akar-akar persamaan $(x - 2016)(2015x - 2017) - 1 = 0$ adalah m dan n dengan $m > n$, serta akar-akar persamaan $x^2 + 2015x - 2016 = 0$ adalah a dan b dengan $a > b$, maka $m - b$ = ...", options: [] },
  { no: 9, soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui p, q, r, s adalah bilangan-bilangan tidak nol. Bilangan r dan s adalah solusi persamaan $x^2 + px + q = 0$ serta p dan q adalah solusi persamaan $x^2 + rx + s = 0$. Nilai $p + q + r + s$ sama dengan ...", options: [] },
  { no: 10, soal: "OSN Matematika 2018 Tingkat Kota\nSemua bilangan real x yang memenuhi pertidaksamaan $\\sqrt{3x + 4} - 5 \\leq 0$ adalah ...", options: ["A. $5 \\leq x \\leq 14$", "B. $x \\leq 6$ atau $x \\geq 14$", "C. $-\\frac{5}{14} \\leq x$ atau $x \\geq 14$", "D. $0 \\leq x \\leq 6$ atau $x \\geq 14$"] },
  { no: 11, soal: "OSN Matematika 2018 Tingkat Kota\nJika $\\frac{n^{n-1} - 1}{n^{n+1} - n} = \\frac{1}{3}$, maka jumlah semua nilai n yang mungkin adalah ...", options: ["A. 2", "B. 1", "C. 0", "D. -1"] },
  { no: 12, soal: "OSN Matematika 2019 Tingkat Kota\nAkar-akar dari $x^2 - 5bx + b = 0$ adalah kuadrat kebalikan akar-akar persamaan $x^2 - ax + a - 1 = 0$. Nilai terbesar yang mungkin dari hasil perkalian a dan b adalah ...", options: ["A. $\\frac{1}{4}$", "B. $\\frac{3}{4}$", "C. $\\frac{4}{3}$", "D. $\\frac{8}{3}$"] },
  { no: 13, soal: "OSN Matematika 2020 Tingkat Kota\nJika $(a, b, c) = ab + bc + ac$, dan misalkan $x_1$ dan $x_2$ adalah bilangan yang memenuhi $\\frac{1}{3}(x + 1, 2, 5) \\cdot (x - 2)(x + 2) = x - 2$, maka nilai terbesar yang mungkin dari $2x_1 - 3x_2$ adalah ...", options: ["A. -16", "B. 13", "C. 8", "D. $\\frac{23}{2}$"] },
  { no: 14, soal: "OSN Matematika 2020 Tingkat Kota\nJika $f(x) = 5x - 3$, maka jumlah semua x yang memenuhi $f(x) \\cdot f(x - 6) = 9$ adalah ...", options: ["A. 0", "B. 3", "C. $\\frac{3}{5}$", "D. $\\frac{6}{5}$"] },
  { no: 15, soal: "OSN Matematika 2020 Tingkat Kota\nBilangan $\\frac{b}{a}$ terbesar dengan a, b positif sedemikian sehingga $a^5 + 20b$ merupakan bilangan kuadrat sempurna yang kurang dari 2020 adalah ...", options: ["A. 2800", "B. 5500", "C. 6400", "D. 7500"] },
  { no: 16, soal: "OSN Matematika 2020 Tingkat Kota\nJika a, b bilangan real positif dengan $a^{505} + b^{505} = 1$, maka nilai minimum dari $a^{2020} + b^{2020}$ adalah ...", options: ["A. 1", "B. $\\frac{1}{2}$", "C. $\\frac{1}{4}$", "D. $\\frac{1}{8}$"] },
  { no: 17, soal: "OSN Matematika 2021 Tingkat Kota\nDiketahui persamaan kuadrat $ax^2 + bx + c = 0$ tidak mempunyai akar bilangan real, tetapi Dina mendapatkan akar -3 dan -6 karena salah menulis nilai dari a. Sedangkan Toni mendapat akar -1 dan 2 karena salah menuliskan tanda dari a. Nilai dari $\\frac{3b + 4c}{a}$ adalah ...", options: ["A. -5", "B. 5", "C. 8", "D. 11"] },
  { no: 18, soal: "OSN Matematika 2021 Tingkat Kota\nHasil kali tiga bilangan bulat positif yang berurutan adalah enam belas kali hasil penjumlahan ketiga bilangan tersebut. Jumlah kuadrat bilangan tersebut adalah ...", options: ["A. 21", "B. 149", "C. 194", "D. 441"] },
  { no: 19, soal: "OSN Matematika 2021 Tingkat Kota\nDiketahui $xy = 15$ dan $(x - y)^4 = 21$. Misalkan z adalah jumlah dari kuadrat semua nilai y yang mungkin, maka $z$ = ...", options: ["A. 0", "B. 30,5", "C. 100", "D. 122"] },
  { no: 20, soal: "OSN Matematika 2021 Tingkat Kota\nJika $(x, y)$ adalah pasangan bilangan bulat positif yang memenuhi persamaan $2021x + 2y = 4y^3$. Maka banyak pasangan $(x, y)$ yang memenuhi persamaan tersebut adalah ...", options: ["A. 3", "B. 2", "C. 1", "D. 0"] },
  { no: 21, soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui\n$x^2 + xy + y^2 = 168$\n$x - xy + y = 10$\nJumlah semua nilai $x + xy + y = 10$ yang mungkin adalah ...", options: ["A. 14", "B. 27", "C. 44", "D. 62"] },
  { no: 22, soal: "OSN Matematika 2023 Tingkat Kota\nJika $(x, y)$ adalah pasangan bilangan bulat positif yang memenuhi\n$x^2 + x + 2023 = 2023y^2$\nDengan $x > y$. Banyaknya $(x, y)$ yang mungkin adalah ...", options: ["A. 0", "B. 2", "C. 4", "D. Tak hingga"] },
  { no: 23, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui persamaan $x^4 + ax^3 + 54x^2 - 108x + 81 = 0$ dengan a bilangan real, memiliki 4 akar real berbeda, yaitu $r_1, r_2, r_3, r_4$. Jika\n$r_1 + r_2 + r_3 + r_4 = 4$\n$r_1 \\cdot r_2 \\cdot r_3 \\cdot r_4 = 4$\nMaka nilai dari a adalah ...", options: ["A. -12", "B. -8", "C. 3", "D. 12"] },
  { no: 24, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui p dan q adalah bilangan bulat positif dengan\n$p^2 - 1 = (4k - 3)^2 - k^2$ dan $q^2 - 1 = (4k - 5)^2 - k^2$\nJika $pq$ adalah bilangan prima, maka nilai terbesar yang mungkin bagi $p^2 + q^2$ adalah ...", options: ["A. 10", "B. 26", "C. 122", "D. 1370"] },
];

const OlimpiadePersamaanKuadratPage = () => {
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

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal)}
                </div>
                {soal.svgImage && (
                  <div className="flex justify-center my-2">
                    {soal.svgImage}
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
              </div>
            ))}
          </div>
        )}

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

export default OlimpiadePersamaanKuadratPage;
