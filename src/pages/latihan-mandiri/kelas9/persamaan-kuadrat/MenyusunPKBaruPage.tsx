import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const VietaSVG = () => (
  <svg width="300" height="110" viewBox="0 0 300 110" className="mx-auto">
    <rect x="5" y="5" width="290" height="100" rx="12" fill="#4a044e" fillOpacity="0.25" stroke="#d946ef" strokeWidth="1.5"/>
    <text x="150" y="32" fill="#f0abfc" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Teorema Vieta untuk ax²+bx+c=0</text>
    <text x="100" y="58" fill="#e879f9" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x₁+x₂ = −b/a</text>
    <text x="220" y="58" fill="#e879f9" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">x₁·x₂ = c/a</text>
    <text x="150" y="85" fill="#c026d3" fontSize="11" fontFamily="monospace" textAnchor="middle">PK baru: x² − (x₁+x₂)x + x₁x₂ = 0</text>
    <text x="150" y="100" fill="#a21caf" fontSize="10" fontFamily="monospace" textAnchor="middle">(jika a = 1)</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Menyusun PK dari Akar Diketahui – UN", {
    type: "mixed", diagram: <VietaSVG />,
    content: "Susun persamaan kuadrat yang akar-akarnya:",
    parts: [
      { label: "a.", math: "x_1 = 3, \\; x_2 = -5" },
      { label: "b.", math: "x_1 = 2, \\; x_2 = 7" },
      { label: "c.", math: "x_1 = -4, \\; x_2 = -6" },
    ],
  }),
  Qn(2, "PK dari Jumlah dan Hasil Kali Akar – UN", {
    type: "mixed",
    content: "Susun PK jika diketahui jumlah dan hasil kali akar-akarnya:",
    parts: [
      { label: "a.", math: "x_1+x_2 = 5, \\; x_1 x_2 = 6 \\Rightarrow x^2 - 5x + 6 = 0" },
      { label: "b.", math: "x_1+x_2 = -3, \\; x_1 x_2 = -10" },
      { label: "c.", math: "x_1+x_2 = \\frac{1}{2}, \\; x_1 x_2 = -\\frac{3}{2}" },
    ],
  }),
  Qn(3, "Teorema Vieta – Menghitung Jumlah & Kali – UN", {
    type: "mixed",
    content: "Dari PK berikut, tentukan x₁+x₂ dan x₁·x₂ tanpa mencari akar-akarnya:",
    parts: [
      { label: "a.", math: "x^2 - 7x + 12 = 0" },
      { label: "b.", math: "3x^2 + 5x - 2 = 0" },
      { label: "c.", math: "2x^2 - 6x + 4 = 0" },
    ],
  }),
  Qn(4, "Susun PK – Akar Irasional – TKA", {
    type: "mixed",
    content: "Susun PK yang akar-akarnya:",
    parts: [
      { label: "a.", math: "x_1 = 3+\\sqrt{2},\\; x_2 = 3-\\sqrt{2}" },
      { label: "b.", math: "x_1 = -1+\\sqrt{5},\\; x_2 = -1-\\sqrt{5}" },
      { label: "c.", math: "x_1 = 2+\\sqrt{3},\\; x_2 = 2-\\sqrt{3}" },
    ],
  }),
  Qn(5, "Hubungan Akar – Penerapan Vieta – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − 4x + k = 0 adalah x₁ dan x₂. Jika x₁² + x₂² = 10, tentukan k.",
    parts: [
      { label: "a.", math: "x_1 + x_2 = 4, \\; x_1 x_2 = k" },
      { label: "b.", math: "x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1 x_2 = 16 - 2k = 10" },
      { label: "c.", math: "k = \\ldots" },
    ],
  }),
  Qn(6, "Susun PK – Akar Pecahan – TKA", {
    type: "mixed",
    content: "Susun PK dengan koefisien bulat yang akar-akarnya:",
    parts: [
      { label: "a.", math: "x_1 = \\frac{1}{2}, \\; x_2 = 3" },
      { label: "b.", math: "x_1 = \\frac{2}{3}, \\; x_2 = -\\frac{1}{2}" },
      { label: "c.", math: "x_1 = \\frac{3}{4}, \\; x_2 = \\frac{3}{4}" },
    ],
  }),
  Qn(7, "Susun PK dari Transformasi Akar – UN", {
    type: "mixed",
    content: "Akar-akar x² − 5x + 6 = 0 adalah x₁ dan x₂. Susun PK baru yang akar-akarnya:",
    parts: [
      { label: "a.", math: "2x_1 \\text{ dan } 2x_2" },
      { label: "b.", math: "x_1 + 1 \\text{ dan } x_2 + 1" },
      { label: "c.", math: "x_1^2 \\text{ dan } x_2^2" },
    ],
  }),
  Qn(8, "Nilai Ekspresi Akar – Vieta – ANBK", {
    type: "mixed",
    content: "Akar-akar 2x² − 7x + 3 = 0 adalah α dan β. Hitung:",
    parts: [
      { label: "a.", math: "\\alpha + \\beta = \\frac{7}{2}" },
      { label: "b.", math: "\\alpha \\beta = \\frac{3}{2}" },
      { label: "c.", math: "\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = \\ldots" },
    ],
  }),
  Qn(9, "Menyusun PK dari Akar Kembar – UN", {
    type: "mixed",
    content: "Susun PK yang memiliki akar kembar:",
    parts: [
      { label: "a.", math: "x_1 = x_2 = 4" },
      { label: "b.", math: "x_1 = x_2 = -3" },
      { label: "c.", math: "x_1 = x_2 = \\frac{1}{2}" },
    ],
  }),
  Qn(10, "Ekspresi dari Akar – TKA", {
    type: "mixed",
    content: "Akar-akar x² + 3x − 10 = 0 adalah x₁ dan x₂. Tentukan nilai:",
    parts: [
      { label: "a.", math: "\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1+x_2}{x_1 x_2}" },
      { label: "b.", math: "x_1^2 + x_2^2" },
      { label: "c.", math: "(x_1 - x_2)^2" },
    ],
  }),
  Qn(11, "Susun PK – Akar Kebalikan – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − 6x + 8 = 0 adalah x₁ dan x₂. Susun PK yang akar-akarnya 1/x₁ dan 1/x₂.",
    parts: [
      { label: "a.", math: "\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1+x_2}{x_1 x_2} = \\frac{6}{8} = \\frac{3}{4}" },
      { label: "b.", math: "\\frac{1}{x_1} \\cdot \\frac{1}{x_2} = \\frac{1}{x_1 x_2} = \\frac{1}{8}" },
      { label: "c.", math: "\\text{PK baru: } x^2 - \\frac{3}{4}x + \\frac{1}{8} = 0 \\rightarrow 8x^2 - 6x + 1 = 0" },
    ],
  }),
  Qn(12, "Susun PK – Akar Diperkecil – UN", {
    type: "mixed",
    content: "Akar-akar x² − 8x + 12 = 0 adalah x₁ dan x₂. Susun PK yang akar-akarnya (x₁ − 2) dan (x₂ − 2).",
    parts: [
      { label: "a.", math: "(x_1-2)+(x_2-2) = x_1+x_2 - 4 = 8 - 4 = 4" },
      { label: "b.", math: "(x_1-2)(x_2-2) = x_1 x_2 - 2(x_1+x_2) + 4 = 12-16+4 = 0" },
      { label: "c.", math: "\\text{PK baru: } x^2 - 4x + 0 = 0 \\rightarrow x(x-4) = 0" },
    ],
  }),
  Qn(13, "Susun PK dari Kondisi Soal – TKA", {
    type: "mixed",
    content: "Susun PK yang memiliki sifat berikut:",
    parts: [
      { label: "a.", text: "Jumlah akar = 0, hasil kali = −9" },
      { label: "b.", text: "Jumlah akar = 7, hasil kali = 0" },
      { label: "c.", text: "Jumlah akar = −2, hasil kali = 1" },
    ],
  }),
  Qn(14, "Susun PK – Akar Diperbesar k Kali – UN", {
    type: "mixed",
    content: "Akar-akar 3x² − 9x + 6 = 0 adalah p dan q. Susun PK yang akar-akarnya 3p dan 3q.",
    parts: [
      { label: "a.", math: "p + q = 3, \\; pq = 2" },
      { label: "b.", math: "3p + 3q = 9, \\; (3p)(3q) = 18" },
      { label: "c.", math: "\\text{PK baru: } x^2 - 9x + 18 = 0" },
    ],
  }),
  Qn(15, "Ekspresi Simetris dari Akar – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − px + q = 0 adalah x₁ dan x₂.",
    parts: [
      { label: "a.", math: "x_1 + x_2 = p, \\; x_1 x_2 = q" },
      { label: "b.", math: "x_1^3 + x_2^3 = (x_1+x_2)^3 - 3x_1 x_2(x_1+x_2) = p^3 - 3pq" },
      { label: "c.", math: "\\text{Jika } p = 4, q = 3: x_1^3 + x_2^3 = \\ldots" },
    ],
  }),
  Qn(16, "Susun PK – Akar Berlawanan Tanda – TKA", {
    type: "mixed",
    content: "Akar-akar 5x² − 15x + 10 = 0 adalah a dan b. Susun PK yang akar-akarnya −a dan −b.",
    parts: [
      { label: "a.", math: "a + b = 3, \\; ab = 2" },
      { label: "b.", math: "(-a)+(-b) = -(a+b) = -3, \\; (-a)(-b) = ab = 2" },
      { label: "c.", math: "\\text{PK baru: } x^2 + 3x + 2 = 0" },
    ],
  }),
  Qn(17, "Susun PK dari Deskripsi – UN", {
    type: "mixed",
    content: "Susun persamaan kuadrat x² + bx + c = 0 untuk setiap kondisi:",
    parts: [
      { label: "a.", text: "Satu akar = 3 dan akar lain = −7" },
      { label: "b.", text: "Jumlah akar = −1 dan hasil kali = −20" },
      { label: "c.", text: "Akar-akarnya adalah bilangan kembar = −5" },
    ],
  }),
  Qn(18, "Nilai Ekspresi Akar – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − 6x + 4 = 0 adalah α dan β. Hitung:",
    parts: [
      { label: "a.", math: "\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = 36-8 = \\ldots" },
      { label: "b.", math: "(\\alpha - \\beta)^2 = (\\alpha+\\beta)^2 - 4\\alpha\\beta = 36-16 = \\ldots" },
      { label: "c.", math: "\\frac{\\alpha}{\\beta} + \\frac{\\beta}{\\alpha} = \\frac{\\alpha^2+\\beta^2}{\\alpha\\beta} = \\ldots" },
    ],
  }),
  Qn(19, "Susun PK – Akar Kuadrat Dari Akar Lain – TKA", {
    type: "mixed",
    content: "Akar-akar x² − 5x + 4 = 0 adalah m dan n. Susun PK yang akar-akarnya m² dan n².",
    parts: [
      { label: "a.", math: "m + n = 5, \\; mn = 4" },
      { label: "b.", math: "m^2 + n^2 = (m+n)^2 - 2mn = 25 - 8 = 17" },
      { label: "c.", math: "m^2 n^2 = (mn)^2 = 16 \\Rightarrow x^2 - 17x + 16 = 0" },
    ],
  }),
  Qn(20, "PK dari Rasio Akar – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − 7x + 10 = 0 adalah p dan q (p > q). Susun PK yang akar-akarnya p/q dan q/p.",
    parts: [
      { label: "a.", math: "p + q = 7, \\; pq = 10" },
      { label: "b.", math: "\\frac{p}{q}+\\frac{q}{p} = \\frac{p^2+q^2}{pq} = \\frac{(p+q)^2-2pq}{pq} = \\frac{49-20}{10} = \\frac{29}{10}" },
      { label: "c.", math: "\\frac{p}{q} \\cdot \\frac{q}{p} = 1 \\Rightarrow \\text{PK: } 10x^2 - 29x + 10 = 0" },
    ],
  }),
  Qn(21, "Menyusun PK – Berdasar Vieta – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\alpha = 5, \\beta = -2 \\Rightarrow \\text{PK: } \\ldots" },
      { label: "b.", math: "\\alpha + \\beta = -4, \\alpha\\beta = -12 \\Rightarrow \\text{PK: } \\ldots" },
      { label: "c.", math: "\\alpha = \\sqrt{3}, \\beta = -\\sqrt{3} \\Rightarrow \\text{PK: } \\ldots" },
    ],
  }),
  Qn(22, "Hubungan Akar – Menentukan Koef. – TKA", {
    type: "mixed",
    content: "Diketahui PK: x² + px + q = 0. Jika x₁ = 2x₂ dan x₁ + x₂ = 9, tentukan p dan q.",
    parts: [
      { label: "a.", math: "x_1 = 2x_2, \\; x_1 + x_2 = 9 \\Rightarrow 3x_2 = 9 \\Rightarrow x_2 = 3, x_1 = 6" },
      { label: "b.", math: "p = -(x_1+x_2) = -9" },
      { label: "c.", math: "q = x_1 x_2 = 18" },
    ],
  }),
  Qn(23, "Susun PK – Akar Dijumlah Konstanta – ANBK", {
    type: "mixed",
    content: "Akar-akar 2x² − 8x + 6 = 0 adalah x₁ dan x₂. Susun PK baru yang akar-akarnya (x₁ + 3) dan (x₂ + 3).",
    parts: [
      { label: "a.", math: "x_1 + x_2 = 4, \\; x_1 x_2 = 3" },
      { label: "b.", math: "(x_1+3)+(x_2+3) = x_1+x_2+6 = 10" },
      { label: "c.", math: "(x_1+3)(x_2+3) = x_1 x_2 + 3(x_1+x_2)+9 = 3+12+9 = 24 \\Rightarrow x^2-10x+24=0" },
    ],
  }),
  Qn(24, "Nilai Ekspresi Akar – UN", {
    type: "mixed",
    content: "Akar-akar 4x² − 12x + 5 = 0 adalah p dan q. Hitung:",
    parts: [
      { label: "a.", math: "p + q = \\frac{12}{4} = 3" },
      { label: "b.", math: "pq = \\frac{5}{4}" },
      { label: "c.", math: "p^2 + q^2 = (p+q)^2 - 2pq = 9 - \\frac{5}{2} = \\ldots" },
    ],
  }),
  Qn(25, "Menyusun PK Khusus – TKA", {
    type: "mixed",
    content: "Susun PK yang memenuhi kondisi berikut:",
    parts: [
      { label: "a.", text: "Jumlah akar 2× hasil kali akar, dan hasil kali = 6." },
      { label: "b.", text: "Selisih akar = 4 dan hasil kali akar = 5." },
      { label: "c.", text: "Kedua akar positif, jumlah = 8, dan hasil kali = 15." },
    ],
  }),
  Qn(26, "Susun PK – Akar Kubik Dari Akar Lain – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − 3x + 2 = 0 adalah r dan s. Susun PK yang akar-akarnya r³ dan s³.",
    parts: [
      { label: "a.", math: "r + s = 3, \\; rs = 2" },
      { label: "b.", math: "r^3 + s^3 = (r+s)^3 - 3rs(r+s) = 27 - 18 = 9" },
      { label: "c.", math: "r^3 s^3 = (rs)^3 = 8 \\Rightarrow x^2 - 9x + 8 = 0" },
    ],
  }),
  Qn(27, "Menyusun PK dari Akar Satu Diketahui – UN", {
    type: "mixed",
    content: "PK: x² + px + 12 = 0. Jika salah satu akarnya x₁ = 4, tentukan akar lain dan nilai p.",
    parts: [
      { label: "a.", math: "x_1 x_2 = 12 \\Rightarrow 4 x_2 = 12 \\Rightarrow x_2 = 3" },
      { label: "b.", math: "x_1 + x_2 = -p \\Rightarrow 7 = -p \\Rightarrow p = -7" },
      { label: "c.", math: "\\text{PK: } x^2 - 7x + 12 = 0" },
    ],
  }),
  Qn(28, "Susun PK – Akar Berurutan – TKA", {
    type: "mixed",
    content: "Susun PK jika akar-akarnya dua bilangan bulat berurutan dengan hasil kali 42.",
    parts: [
      { label: "a.", text: "Misalkan akar pertama = n, akar kedua = n + 1." },
      { label: "b.", math: "n(n+1) = 42 \\Rightarrow n^2 + n - 42 = 0" },
      { label: "c.", math: "\\text{Susun PK dari akar: } n = 6 \\text{ dan } n+1 = 7" },
    ],
  }),
  Qn(29, "Vieta – Soal Kebalikan – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − 5x + 2 = 0 adalah m dan n. Susun PK baru yang akar-akarnya 1/(m+1) dan 1/(n+1).",
    parts: [
      { label: "a.", math: "\\frac{1}{m+1}+\\frac{1}{n+1} = \\frac{m+n+2}{(m+1)(n+1)}" },
      { label: "b.", math: "(m+1)(n+1) = mn+m+n+1 = 2+5+1 = 8" },
      { label: "c.", math: "\\frac{1}{m+1}+\\frac{1}{n+1} = \\frac{7}{8} \\Rightarrow \\frac{1}{m+1}\\cdot\\frac{1}{n+1} = \\frac{1}{8}" },
    ],
  }),
  Qn(30, "Nilai k dari Kondisi Akar – UN", {
    type: "mixed",
    content: "PK: x² − kx + (k + 3) = 0. Jika x₁ · x₂ = 2(x₁ + x₂) − 1, cari k.",
    parts: [
      { label: "a.", math: "x_1+x_2 = k, \\; x_1 x_2 = k+3" },
      { label: "b.", math: "k+3 = 2k-1 \\Rightarrow k = \\ldots" },
      { label: "c.", math: "\\text{Verifikasi dengan PK yang telah didapat}" },
    ],
  }),
  Qn(31, "Susun PK – Variasi Akar – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x_1 = 1+\\sqrt{7}, x_2 = 1-\\sqrt{7}" },
      { label: "b.", math: "x_1 = \\frac{-3+\\sqrt{5}}{2}, x_2 = \\frac{-3-\\sqrt{5}}{2}" },
      { label: "c.", math: "x_1 = \\frac{1}{3}, x_2 = -5" },
    ],
  }),
  Qn(32, "Ekspresi Simetris Lanjut – ANBK", {
    type: "mixed",
    content: "Akar-akar x² − px + q = 0 adalah α dan β. Tentukan:",
    parts: [
      { label: "a.", math: "\\alpha^2\\beta + \\alpha\\beta^2 = \\alpha\\beta(\\alpha+\\beta) = qp" },
      { label: "b.", math: "(\\alpha+1)(\\beta+1) = \\alpha\\beta+\\alpha+\\beta+1 = q+p+1" },
      { label: "c.", math: "\\alpha^2 + \\alpha\\beta + \\beta^2 = (\\alpha+\\beta)^2 - \\alpha\\beta = p^2-q" },
    ],
  }),
  Qn(33, "Menyusun PK – Akar Kebalikan + 1 – UN", {
    type: "mixed",
    content: "Akar-akar 2x² − 5x + 2 = 0 adalah a dan b. Susun PK yang akar-akarnya (a + 1/b) dan (b + 1/a).",
    parts: [
      { label: "a.", math: "a + b = \\frac{5}{2}, \\; ab = 1" },
      { label: "b.", math: "\\left(a+\\frac{1}{b}\\right)+\\left(b+\\frac{1}{a}\\right) = (a+b)+\\frac{a+b}{ab} = \\frac{5}{2}+\\frac{5}{2} = 5" },
      { label: "c.", math: "\\left(a+\\frac{1}{b}\\right)\\left(b+\\frac{1}{a}\\right) = ab+1+1+\\frac{1}{ab} = 4 \\Rightarrow x^2-5x+4=0" },
    ],
  }),
  Qn(34, "Susun PK dari Akar yang Memenuhi Syarat – TKA", {
    type: "mixed",
    content: "Susun PK yang salah satu akarnya merupakan kebalikan dari akar lainnya dan jumlah akar = 5/2.",
    parts: [
      { label: "a.", math: "x_1 = \\frac{1}{x_2} \\Rightarrow x_1 x_2 = 1" },
      { label: "b.", math: "x_1 + x_2 = \\frac{5}{2}" },
      { label: "c.", math: "\\text{PK: } x^2 - \\frac{5}{2}x + 1 = 0 \\Rightarrow 2x^2 - 5x + 2 = 0" },
    ],
  }),
  Qn(35, "Susun PK dari Dua Kondisi – ANBK", {
    type: "mixed",
    content: "Susun PK yang memiliki sifat:",
    parts: [
      { label: "a.", text: "Jumlah akar = 3 × hasil kali akar, dan hasil kali = 2." },
      { label: "b.", text: "Salah satu akar = 5 dan hasil kali akar = −30." },
      { label: "c.", text: "Kedua akar merupakan akar positif dengan jumlah 10 dan perbedaan 4." },
    ],
  }),
  Qn(36, "Susun PK – Satu Akar Diketahui – TKA", {
    type: "mixed",
    content: "Jika salah satu akar PK berikut diketahui, tentukan akar lain dan susun kembali PKnya:",
    parts: [
      { label: "a.", math: "x^2 + px - 15 = 0, \\; x_1 = 3 \\Rightarrow x_2 = ?, p = ?" },
      { label: "b.", math: "2x^2 + qx + 6 = 0, \\; x_1 = 2 \\Rightarrow x_2 = ?, q = ?" },
      { label: "c.", math: "x^2 - 5x + r = 0, \\; x_1 = 1 \\Rightarrow x_2 = ?, r = ?" },
    ],
  }),
  Qn(37, "Menyusun PK – Soal UN/ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "x_1 = \\frac{2}{3}, x_2 = -\\frac{3}{2} \\Rightarrow \\text{PK: } \\ldots" },
      { label: "b.", math: "x_1 + x_2 = \\sqrt{6}, x_1 x_2 = 2 \\Rightarrow \\text{PK: } \\ldots" },
      { label: "c.", math: "x_1 = \\sqrt{2}+\\sqrt{3}, x_2 = \\sqrt{2}-\\sqrt{3} \\Rightarrow \\text{PK: } \\ldots" },
    ],
  }),
  Qn(38, "Ekspresi Simetris – Kalkulus – TKA", {
    type: "mixed",
    content: "Akar-akar x² − 3x + 1 = 0 adalah α dan β. Hitung:",
    parts: [
      { label: "a.", math: "\\alpha^4 + \\beta^4 = (\\alpha^2+\\beta^2)^2 - 2(\\alpha\\beta)^2" },
      { label: "b.", math: "\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = 9-2 = 7" },
      { label: "c.", math: "\\alpha^4 + \\beta^4 = 49 - 2 = \\ldots" },
    ],
  }),
  Qn(39, "Susun PK – HOTS – UN", {
    type: "mixed",
    content: "Akar-akar x² − 6x + k = 0 adalah x₁ dan x₂ dimana x₁ = 2x₂. Tentukan k dan susun PK baru yang akar-akarnya (2x₁) dan (2x₂).",
    parts: [
      { label: "a.", math: "x_1 = 2x_2, \\; x_1+x_2 = 6 \\Rightarrow x_2 = 2, x_1 = 4 \\Rightarrow k = \\ldots" },
      { label: "b.", math: "2x_1 = 8, \\; 2x_2 = 4 \\Rightarrow \\text{jumlah} = 12, \\text{ kali} = 32" },
      { label: "c.", math: "\\text{PK baru: } x^2 - 12x + 32 = 0" },
    ],
  }),
  Qn(40, "HOTS – Menyusun dan Menggunakan Vieta – UN/TKA", {
    type: "mixed",
    content: "Akar-akar x² + 5x − 6 = 0 adalah α dan β. Susun PK yang akar-akarnya α/(α+β) dan β/(α+β).",
    parts: [
      { label: "a.", math: "\\alpha + \\beta = -5, \\; \\alpha\\beta = -6" },
      { label: "b.", math: "\\frac{\\alpha}{\\alpha+\\beta}+\\frac{\\beta}{\\alpha+\\beta} = \\frac{\\alpha+\\beta}{\\alpha+\\beta} = 1" },
      { label: "c.", math: "\\frac{\\alpha}{\\alpha+\\beta} \\cdot \\frac{\\beta}{\\alpha+\\beta} = \\frac{\\alpha\\beta}{(\\alpha+\\beta)^2} = \\frac{-6}{25} \\Rightarrow 25x^2-25x-6=0" },
    ],
  }),
];

const MenyusunPKBaruPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-fuchsia-500/20 border-2 border-fuchsia-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔄</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-fuchsia-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(232,121,249,0.7)' }}>
            MENYUSUN PERSAMAAN KUADRAT BARU
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Persamaan Kuadrat · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg px-4 py-2">
            <span className="text-fuchsia-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-fuchsia-900/20 border border-fuchsia-500/20 rounded-xl p-4">
          <p className="text-fuchsia-300 text-xs font-bold mb-3">📐 Teorema Vieta & Menyusun PK</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Jumlah Akar", math: "x_1+x_2 = -\\frac{b}{a}" },
              { name: "Hasil Kali Akar", math: "x_1 \\cdot x_2 = \\frac{c}{a}" },
              { name: "PK Baru (a=1)", math: "x^2-(x_1+x_2)x+x_1 x_2=0" },
              { name: "Selisih Akar", math: "|x_1-x_2| = \\frac{\\sqrt{D}}{a}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-fuchsia-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-fuchsia-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-400 to-violet-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/50 flex items-center justify-center shrink-0">
                    <span className="text-fuchsia-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-fuchsia-400 text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-fuchsia-900/20 border border-fuchsia-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-fuchsia-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/persamaan-kuadrat"); }}
            className="text-sm text-muted-foreground hover:text-fuchsia-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Persamaan Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default MenyusunPKBaruPage;
