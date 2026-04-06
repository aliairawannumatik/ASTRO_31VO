import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Persamaan dari Gradien dan Intercept-y", {
    type: "mixed",
    content: "Tentukan persamaan garis jika diketahui gradien (m) dan intercept-y (c):",
    parts: [
      { label: "a.", math: "m = 3,\\ c = -5" },
      { label: "b.", math: "m = -2,\\ c = 7" },
      { label: "c.", math: "m = \\tfrac{1}{2},\\ c = 0" },
      { label: "d.", math: "m = -\\tfrac{3}{4},\\ c = 6" },
    ],
  }),

  Q(2, "Persamaan dari Dua Titik", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui pasangan titik berikut:",
    parts: [
      { label: "a.", math: "A(1,\\ 4) \\text{ dan } B(3,\\ 8)" },
      { label: "b.", math: "C(-2,\\ 3) \\text{ dan } D(4,\\ 0)" },
      { label: "c.", math: "E(0,\\ -5) \\text{ dan } F(5,\\ 5)" },
    ],
  }),

  Q(3, "Persamaan dari Gradien dan Satu Titik", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui titik P dan memiliki gradien m:",
    parts: [
      { label: "a.", math: "P(2,\\ 5),\\ m = 3" },
      { label: "b.", math: "P(-1,\\ 4),\\ m = -2" },
      { label: "c.", math: "P(0,\\ -3),\\ m = \\tfrac{1}{2}" },
      { label: "d.", math: "P(4,\\ -1),\\ m = -\\tfrac{3}{4}" },
    ],
  }),

  Q(4, "Mengubah Bentuk Persamaan Garis", {
    type: "mixed",
    content: "Ubah setiap persamaan ke bentuk y = mx + c:",
    parts: [
      { label: "a.", math: "3x + y = 9" },
      { label: "b.", math: "4x - 2y = 8" },
      { label: "c.", math: "5x + 3y - 15 = 0" },
      { label: "d.", math: "-2x - y + 6 = 0" },
    ],
  }),

  Q(5, "Persamaan Garis dari Grafik", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -4, y1: 0, x2: 2, y2: 6, color: "#34d399", label: "g" }],
      pts: [
        { x: 0, y: 2, label: "(0,2)", color: "#34d399", labelPos: "tr" },
        { x: -2, y: 0, label: "(−2,0)", color: "#34d399", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Baca titik potong garis g dengan sumbu-x dan sumbu-y." },
      { label: "b.", math: "\\text{Hitung gradien } m." },
      { label: "c.", math: "\\text{Tuliskan persamaan garis } g." },
    ],
  }),

  Q(6, "Persamaan Garis Sejajar", {
    type: "mixed",
    content: "Tentukan persamaan garis yang sejajar dengan garis yang diberikan dan melalui titik yang ditentukan:",
    parts: [
      { label: "a.", math: "y = 2x + 3 \\text{ melalui } (1,\\ 7)" },
      { label: "b.", math: "y = -3x + 1 \\text{ melalui } (-2,\\ 8)" },
      { label: "c.", math: "3x - y = 5 \\text{ melalui } (0,\\ -4)" },
    ],
  }),

  Q(7, "Persamaan Garis Tegak Lurus", {
    type: "mixed",
    content: "Tentukan persamaan garis yang tegak lurus dengan garis yang diberikan dan melalui titik yang ditentukan:",
    parts: [
      { label: "a.", math: "y = 4x - 2 \\text{ melalui } (4,\\ 3)" },
      { label: "b.", math: "y = -\\tfrac{1}{2}x + 5 \\text{ melalui } (-1,\\ 6)" },
      { label: "c.", math: "x + 3y = 9 \\text{ melalui } (3,\\ -2)" },
    ],
  }),

  Q(8, "UN 2019 — Persamaan dari Titik Potong Sumbu", {
    type: "mixed",
    content: "Garis ℓ memotong sumbu-x di (−4, 0) dan sumbu-y di (0, 6).",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -4, y: 0, label: "(−4,0)", color: "#f472b6", labelPos: "top" },
        { x: 0, y: 6, label: "(0,6)", color: "#f472b6", labelPos: "tr" },
      ],
      segs: [{ x1: -5, y1: -1.5, x2: 2, y2: 9, color: "#f472b6", label: "ℓ" }],
    },
    parts: [
      { label: "a.", math: "\\text{Hitung gradien garis } \\ell." },
      { label: "b.", math: "\\text{Tuliskan persamaan garis } \\ell \\text{ dalam bentuk } y = mx + c." },
      { label: "c.", math: "\\text{Ubah ke bentuk } ax + by = c." },
    ],
  }),

  Q(9, "Persamaan Garis Melalui Titik Asal", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui titik asal O(0, 0) dan titik berikut:",
    parts: [
      { label: "a.", math: "A(3,\\ 6)" },
      { label: "b.", math: "B(-2,\\ 4)" },
      { label: "c.", math: "C(5,\\ -10)" },
      { label: "d.", math: "D(-4,\\ -6)" },
    ],
  }),

  Q(10, "Bentuk Persamaan Umum ax + by + c = 0", {
    type: "mixed",
    content: "Ubah setiap persamaan ke bentuk ax + by + c = 0:",
    parts: [
      { label: "a.", math: "y = 2x - 7" },
      { label: "b.", math: "y = -\\tfrac{3}{5}x + 4" },
      { label: "c.", math: "y - 3 = 4(x - 1)" },
      { label: "d.", math: "y + 2 = -2(x + 5)" },
    ],
  }),

  Q(11, "Persamaan dari Gradien Nol atau Tak Terdefinisi", {
    type: "mixed",
    content: "Tentukan persamaan garis yang:",
    parts: [
      { label: "a.", text: "Sejajar sumbu-x dan melalui titik (3, −5)." },
      { label: "b.", text: "Sejajar sumbu-y dan melalui titik (7, 2)." },
      { label: "c.", text: "Sejajar sumbu-x dan melalui titik (−4, 0)." },
      { label: "d.", text: "Sejajar sumbu-y dan melalui titik (0, 6)." },
    ],
  }),

  Q(12, "Persamaan dari Dua Titik Negatif", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui:",
    parts: [
      { label: "a.", math: "P(-3,\\ -1) \\text{ dan } Q(-1,\\ 5)" },
      { label: "b.", math: "R(-5,\\ 4) \\text{ dan } S(-1,\\ -4)" },
      { label: "c.", math: "A(-2,\\ -3) \\text{ dan } B(-6,\\ -11)" },
    ],
  }),

  Q(13, "UN 2018 — Menentukan Persamaan", {
    type: "mixed",
    content: "Sebuah garis memiliki gradien ¾ dan melalui titik (4, 5).",
    parts: [
      { label: "a.", math: "\\text{Tentukan persamaan garis dalam bentuk } y = mx + c." },
      { label: "b.", math: "\\text{Ubah ke bentuk } 3x - 4y + c = 0." },
      { label: "c.", math: "\\text{Tentukan titik potong garis dengan sumbu-x." },
    ],
  }),

  Q(14, "Persamaan Garis dari Dua Persamaan Lain", {
    type: "mixed",
    content: "Garis g sejajar dengan garis y = 2x − 5 dan melalui titik perpotongan garis y = 3 dan x = 1.",
    parts: [
      { label: "a.", text: "Tentukan titik perpotongan y = 3 dan x = 1." },
      { label: "b.", text: "Tentukan gradien garis g." },
      { label: "c.", text: "Tentukan persamaan garis g." },
    ],
  }),

  Q(15, "Persamaan Garis Melewati Dua Titik dengan Koordinat Pecahan", {
    type: "mixed",
    content: "Tentukan persamaan garis melalui:",
    parts: [
      { label: "a.", math: "A\\!\\left(\\tfrac{1}{2},\\ 2\\right) \\text{ dan } B(2,\\ 5)" },
      { label: "b.", math: "C(0,\\ \\tfrac{3}{4}) \\text{ dan } D(4,\\ \\tfrac{11}{4})" },
    ],
  }),

  Q(16, "TKA — Pilih Persamaan yang Tepat", {
    type: "mixed",
    content: "Garis ℓ melalui titik (2, 3) dan (−1, −3). Manakah persamaan yang benar?",
    parts: [
      { label: "(A)", math: "y = 2x - 1" },
      { label: "(B)", math: "y = 2x + 1" },
      { label: "(C)", math: "y = 3x - 3" },
      { label: "(D)", math: "y = 3x + 1" },
      { label: "Buktikan:", text: "Verifikasi dengan substitusi kedua titik ke persamaan yang dipilih." },
    ],
  }),

  Q(17, "Grafik dan Persamaan Garis Sejajar", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -5, y1: -3, x2: 3, y2: 5, color: "#f472b6", label: "ℓ₁" },
        { x1: -5, y1: -6, x2: 3, y2: 2, color: "#60a5fa", label: "ℓ₂" },
      ],
      pts: [
        { x: 0, y: 2, label: "(0,2)", color: "#f472b6", labelPos: "tr" },
        { x: 0, y: -1, label: "(0,−1)", color: "#60a5fa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Baca intercept-y untuk garis ℓ₁ dan ℓ₂." },
      { label: "b.", text: "Hitung gradien garis (cukup hitung satu karena sejajar)." },
      { label: "c.", text: "Tuliskan persamaan garis ℓ₁ dan ℓ₂." },
    ],
  }),

  Q(18, "Persamaan Garis melalui Titik dan Sejajar Sumbu", {
    type: "mixed",
    content: "Tuliskan persamaan garis yang:",
    parts: [
      { label: "a.", math: "\\text{Melalui } (5,\\ -3) \\text{ dan sejajar sumbu-x.}" },
      { label: "b.", math: "\\text{Melalui } (-2,\\ 7) \\text{ dan sejajar sumbu-y.}" },
      { label: "c.", math: "\\text{Melalui } (0,\\ 0) \\text{ dan memiliki gradien } -5." },
    ],
  }),

  Q(19, "Persamaan Bisector (Sumbu Kuadran)", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      segs: [
        { x1: -4, y1: -4, x2: 4, y2: 4, color: "#f472b6", label: "y=x" },
        { x1: -4, y1: 4, x2: 4, y2: -4, color: "#60a5fa", label: "y=−x" },
      ],
      pts: [{ x: 0, y: 0, label: "O", color: "white", labelPos: "tr" }],
    },
    parts: [
      { label: "a.", math: "\\text{Persamaan garis merah muda adalah } \\ldots" },
      { label: "b.", math: "\\text{Persamaan garis biru adalah } \\ldots" },
      { label: "c.", text: "Di kuadran berapa saja garis y = x berada (bagian positif)?" },
    ],
  }),

  Q(20, "ANBK — Mencocokkan Garis dan Persamaan", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      segs: [
        { x1: -4, y1: 2, x2: 4, y2: -2, color: "#f472b6", label: "P" },
        { x1: -2, y1: -4, x2: 2, y2: 4, color: "#60a5fa", label: "Q" },
      ],
      pts: [
        { x: 0, y: 0, label: "(0,0)", color: "#facc15", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan persamaan garis P." },
      { label: "b.", text: "Tentukan persamaan garis Q." },
      { label: "c.", text: "Apa hubungan garis P dan Q?" },
    ],
  }),

  Q(21, "Persamaan dari Kondisi Soal UN 2020", {
    type: "mixed",
    content: "Garis g melalui titik A(3, 7) dan tegak lurus dengan garis y = −½x + 4.",
    parts: [
      { label: "a.", text: "Tentukan gradien garis g." },
      { label: "b.", text: "Tentukan persamaan garis g." },
      { label: "c.", text: "Tentukan titik potong garis g dengan sumbu-x." },
    ],
  }),

  Q(22, "Persamaan Garis dalam Bentuk Intercept", {
    type: "mixed",
    content: "Persamaan garis dapat ditulis dalam bentuk:",
    math: "\\frac{x}{a} + \\frac{y}{b} = 1",
    parts: [
      { label: "a.", math: "\\text{Garis memotong sumbu-x di } (4,\\ 0) \\text{ dan sumbu-y di } (0,\\ 3)." },
      { label: "b.", math: "\\text{Garis memotong sumbu-x di } (-6,\\ 0) \\text{ dan sumbu-y di } (0,\\ 4)." },
      { label: "c.", text: "Ubah hasil (a) ke bentuk y = mx + c." },
    ],
  }),

  Q(23, "Persamaan dari Titik dan Gradien Pecahan", {
    type: "mixed",
    content: "Tentukan persamaan garis yang melalui titik P dan memiliki gradien m:",
    parts: [
      { label: "a.", math: "P(6,\\ -2),\\ m = \\tfrac{2}{3}" },
      { label: "b.", math: "P(-4,\\ 5),\\ m = -\\tfrac{5}{4}" },
      { label: "c.", math: "P(10,\\ 0),\\ m = \\tfrac{1}{5}" },
    ],
  }),

  Q(24, "Persamaan Garis Sejajar Melalui Titik Sumbu", {
    type: "mixed",
    content: "Garis ℓ sejajar dengan y = 3x − 2. Tentukan persamaan ℓ jika:",
    parts: [
      { label: "a.", text: "ℓ melalui titik (0, 5)." },
      { label: "b.", text: "ℓ memotong sumbu-y di (0, −4)." },
      { label: "c.", math: "\\ell \\text{ melalui titik } (-1,\\ 2)." },
    ],
  }),

  Q(25, "Menentukan Persamaan dari Kondisi Titik", {
    type: "mixed",
    content: "Garis h melalui titik (−2, 3) dan titik potong dari garis y = 2x + 5 dan y = −x + 2.",
    parts: [
      { label: "a.", text: "Tentukan titik potong garis y = 2x + 5 dan y = −x + 2 secara aljabar." },
      { label: "b.", text: "Gunakan titik potong dan titik (−2, 3) untuk menentukan gradien h." },
      { label: "c.", text: "Tentukan persamaan garis h." },
    ],
  }),

  Q(26, "Persamaan Garis Tegak Lurus dan Titik Perpotongan", {
    type: "mixed",
    content: "Dua garis tegak lurus. Garis pertama: y = 2x + 1. Garis kedua melalui (0, 5).",
    parts: [
      { label: "a.", text: "Tentukan gradien garis kedua." },
      { label: "b.", text: "Tentukan persamaan garis kedua." },
      { label: "c.", text: "Tentukan titik perpotongan kedua garis." },
    ],
  }),

  Q(27, "UN 2022 — Garis Sejajar dan Tegak Lurus", {
    type: "mixed",
    content: "Diketahui garis k: 4x − 2y + 6 = 0.",
    parts: [
      { label: "a.", math: "\\text{Ubah garis } k \\text{ ke bentuk } y = mx + c." },
      { label: "b.", math: "\\text{Tuliskan persamaan garis yang sejajar } k \\text{ dan melalui } (-1,\\ 4)." },
      { label: "c.", math: "\\text{Tuliskan persamaan garis yang tegak lurus } k \\text{ dan melalui } (2,\\ -3)." },
    ],
  }),

  Q(28, "Persamaan Garis Sumbu Simetri", {
    type: "mixed",
    diagram: {
      size: 260, range: 5,
      pts: [
        { x: 1, y: 4, label: "A(1,4)", color: "#f472b6", labelPos: "tl" },
        { x: 5, y: 4, label: "B(5,4)", color: "#60a5fa", labelPos: "tr" },
      ],
      segs: [
        { x1: 3, y1: -4, x2: 3, y2: 4.5, color: "#facc15", dashed: true, label: "sumbu" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan sumbu simetri antara titik A dan B." },
      { label: "b.", text: "Tuliskan persamaan sumbu simetri tersebut." },
      { label: "c.", text: "Periksa: apakah garis ini membagi jarak A–B menjadi dua sama?" },
    ],
  }),

  Q(29, "Persamaan Garis dari Gradien Negatif", {
    type: "mixed",
    content: "Tentukan persamaan garis dengan gradien negatif yang memenuhi syarat:",
    parts: [
      { label: "a.", math: "m = -3,\\ \\text{melalui titik } (2,\\ 1)" },
      { label: "b.", math: "m = -\\tfrac{2}{5},\\ \\text{intercept-y} = 4" },
      { label: "c.", math: "\\text{Melalui } (3,\\ 5) \\text{ dan } (6,\\ 2)." },
    ],
  }),

  Q(30, "Soal ANBK — Persamaan Garis Benar atau Salah", {
    type: "mixed",
    content: "Garis melalui titik (1, 3) dan (4, 9). Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", math: "\\text{Gradiennya adalah } 2." },
      { label: "(2)", math: "\\text{Persamaannya adalah } y = 2x + 1." },
      { label: "(3)", math: "\\text{Garis memotong sumbu-x di } (-\\tfrac{1}{2},\\ 0)." },
      { label: "(4)", math: "\\text{Titik } (0,\\ 1) \\text{ terletak pada garis.}" },
    ],
  }),

  Q(31, "Persamaan dari Kondisi Jarak", {
    type: "mixed",
    content: "Garis ℓ memiliki gradien 3 dan memotong sumbu-x di titik yang berjarak 2 satuan dari titik asal.",
    parts: [
      { label: "a.", text: "Tentukan dua kemungkinan titik potong dengan sumbu-x." },
      { label: "b.", text: "Tentukan dua kemungkinan persamaan garis ℓ." },
    ],
  }),

  Q(32, "Persamaan Garis Hubungan Dua Variabel", {
    type: "mixed",
    content: "Hubungan antara variabel x dan y bersifat linier. Diketahui: saat x = 2, y = 7; saat x = 5, y = 13.",
    parts: [
      { label: "a.", text: "Hitung gradien hubungan tersebut." },
      { label: "b.", math: "\\text{Tentukan persamaan } y \\text{ dalam } x." },
      { label: "c.", math: "\\text{Cari nilai } y \\text{ saat } x = 10." },
    ],
  }),

  Q(33, "Persamaan Garis Gabungan", {
    type: "mixed",
    content: "Tentukan persamaan setiap garis:",
    parts: [
      { label: "a.", text: "Melalui titik (0, 0) dan tegak lurus dengan 2x + y = 5." },
      { label: "b.", text: "Sejajar dengan x − 3y = 6 dan melalui titik (−3, 2)." },
      { label: "c.", text: "Tegak lurus dengan x = 4 dan melalui titik (1, 5)." },
    ],
  }),

  Q(34, "Persamaan Garis Berurutan", {
    type: "mixed",
    content: "Garis k memiliki persamaan y = 2x + 3.",
    parts: [
      { label: "a.", text: "Tentukan persamaan garis sejajar k yang berjarak 5 satuan di atas k (intercept-y lebih besar 5)." },
      { label: "b.", text: "Tentukan persamaan garis sejajar k yang melalui titik (1, 0)." },
    ],
  }),

  Q(35, "TKA — Menentukan Garis dari Kondisi", {
    type: "mixed",
    content: "Tentukan persamaan garis yang memenuhi setiap kondisi berikut:",
    parts: [
      { label: "a.", text: "Gradien 5, melalui titik (−2, −3)." },
      { label: "b.", text: "Melalui titik (4, 6) dan (4, −1)." },
      { label: "c.", text: "Melalui titik (3, 2) dan tegak lurus dengan y = 3." },
    ],
  }),

  Q(36, "Verifikasi Persamaan Garis", {
    type: "mixed",
    content: "Garis ℓ dikatakan memiliki persamaan y = 4x − 7. Verifikasi dengan:",
    parts: [
      { label: "a.", math: "\\text{Titik } A(2,\\ 1) \\in \\ell?" },
      { label: "b.", math: "\\text{Titik } B(3,\\ 5) \\in \\ell?" },
      { label: "c.", math: "\\text{Titik } C(0,\\ -7) \\in \\ell?" },
    ],
  }),

  Q(37, "UN 2023 — Persamaan Garis Bergradien Negatif", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -2, y1: 6, x2: 4, y2: -6, color: "#f472b6", label: "g" }],
      pts: [
        { x: 0, y: 2, label: "(0,2)", color: "#f472b6", labelPos: "tr" },
        { x: 1, y: 0, label: "(1,0)", color: "#f472b6", labelPos: "top" },
      ],
    },
    parts: [
      { label: "a.", text: "Baca titik potong garis g dengan sumbu-x dan sumbu-y." },
      { label: "b.", text: "Hitung gradien garis g." },
      { label: "c.", text: "Tentukan persamaan garis g." },
    ],
  }),

  Q(38, "Persamaan Garis Melalui Tiga Titik", {
    type: "mixed",
    content: "Tiga buah titik diketahui: P(0, 4), Q(2, k), R(4, 12).",
    parts: [
      { label: "a.", text: "Jika ketiga titik segaris, tentukan nilai k." },
      { label: "b.", text: "Tentukan persamaan garis yang melalui ketiganya." },
      { label: "c.", math: "\\text{Tentukan nilai } y \\text{ saat } x = 6." },
    ],
  }),

  Q(39, "ANBK — Melengkapi Persamaan Garis", {
    type: "mixed",
    content: "Lengkapi persamaan garis dengan nilai yang tepat:",
    parts: [
      { label: "a.", math: "y = \\boxed{\\phantom{xx}} x + 5 \\text{ melalui } (3,\\ 11)" },
      { label: "b.", math: "y = -2x + \\boxed{\\phantom{xx}} \\text{ melalui } (4,\\ -3)" },
      { label: "c.", math: "y = \\boxed{\\phantom{xx}} x + \\boxed{\\phantom{xx}} \\text{ melalui } (1,\\ 5) \\text{ dan } (3,\\ 9)" },
    ],
  }),

  Q(40, "Tantangan — Segitiga dari Tiga Persamaan Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: -4, y1: -3, x2: 4, y2: 5, color: "#f472b6", label: "ℓ₁" },
        { x1: -4, y1: 5, x2: 4, y2: -3, color: "#60a5fa", label: "ℓ₂" },
        { x1: -4.5, y1: 1, x2: 4.5, y2: 1, color: "#facc15", label: "ℓ₃" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan persamaan garis ℓ₁, ℓ₂, dan ℓ₃ dari grafik." },
      { label: "b.", text: "Tentukan koordinat tiga titik perpotongan (vertex segitiga)." },
      { label: "c.", text: "Apakah ℓ₁ dan ℓ₂ saling tegak lurus? Periksa!" },
    ],
  }),
];

const MenentukanPGLPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-green-400 text-xs font-body">40 Soal Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            MENENTUKAN PERSAMAAN GARIS LURUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-900/20 via-slate-900/40 to-teal-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-green-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-green-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {p.math ? <InlineMath math={p.math} /> : <span>{p.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenentukanPGLPage;
