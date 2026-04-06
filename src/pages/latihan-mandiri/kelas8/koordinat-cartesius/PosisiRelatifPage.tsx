import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Navigation } from "lucide-react";
import CoordPlane from "./CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Posisi Titik terhadap Sumbu-x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 3, y: 4, label: "A(3,4)", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: -3, label: "B(−2,−3)", color: "#60a5fa", labelPos: "bl" },
        { x: 5, y: 0, label: "C(5,0)", color: "#facc15", labelPos: "top" },
        { x: -4, y: 2, label: "D(−4,2)", color: "#34d399", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada DI ATAS sumbu-x?" },
      { label: "b.", text: "Titik mana yang berada DI BAWAH sumbu-x?" },
      { label: "c.", text: "Titik mana yang berada PADA sumbu-x?" },
      { label: "d.", text: "Apa syarat koordinat untuk titik di atas sumbu-x?" },
    ],
  }),

  Qn(2, "Posisi Titik terhadap Sumbu-y", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 2, label: "P(4,2)", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: 5, label: "Q(−3,5)", color: "#fb923c", labelPos: "tl" },
        { x: 0, y: -4, label: "R(0,−4)", color: "#facc15", labelPos: "tr" },
        { x: -2, y: -2, label: "S(−2,−2)", color: "#a78bfa", labelPos: "bl" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di sebelah KANAN sumbu-y?" },
      { label: "b.", text: "Titik mana yang berada di sebelah KIRI sumbu-y?" },
      { label: "c.", text: "Titik mana yang berada PADA sumbu-y?" },
      { label: "d.", text: "Apa syarat koordinat untuk titik di sebelah kiri sumbu-y?" },
    ],
  }),

  Qn(3, "Posisi terhadap Garis y = 3", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -6.5, y1: 3, x2: 6.5, y2: 3, color: "#facc15", label: "y = 3" }],
      pts: [
        { x: 4, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: 1, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: 2, y: 3, label: "C", color: "#34d399", labelPos: "top" },
        { x: -5, y: 6, label: "D", color: "#fb923c", labelPos: "tl" },
        { x: 1, y: -2, label: "E", color: "#a78bfa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di ATAS garis y = 3?" },
      { label: "b.", text: "Titik mana yang berada di BAWAH garis y = 3?" },
      { label: "c.", text: "Titik mana yang berada PADA garis y = 3?" },
      { label: "d.", text: "Apa syarat ordinat untuk titik di atas garis y = 3?" },
    ],
  }),

  Qn(4, "Posisi terhadap Garis x = −2", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -2, y1: -6.5, x2: -2, y2: 6.5, color: "#a78bfa", label: "x=−2" }],
      pts: [
        { x: 3, y: 4, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -5, y: 2, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: -2, y: -3, label: "C", color: "#34d399", labelPos: "tr" },
        { x: 1, y: -4, label: "D", color: "#facc15", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di KANAN garis x = −2?" },
      { label: "b.", text: "Titik mana yang berada di KIRI garis x = −2?" },
      { label: "c.", text: "Titik mana yang berada PADA garis x = −2?" },
      { label: "d.", text: "Apa syarat absis untuk titik di kanan garis x = −2?" },
    ],
  }),

  Qn(5, "Menentukan Posisi Relatif Kelompok Titik", {
    type: "mixed",
    content: "Tentukan posisi setiap titik terhadap garis y = 4 (di atas, di bawah, atau pada):",
    parts: [
      { label: "a.", math: "A(2,\\ 7)" },
      { label: "b.", math: "B(-3,\\ 4)" },
      { label: "c.", math: "C(5,\\ 1)" },
      { label: "d.", math: "D(-1,\\ -2)" },
      { label: "e.", math: "E(0,\\ 4)" },
      { label: "f.", math: "F(8,\\ 10)" },
    ],
  }),

  Qn(6, "Menentukan Posisi terhadap Garis x = 5", {
    type: "mixed",
    content: "Tentukan posisi setiap titik terhadap garis x = 5 (di kanan, di kiri, atau pada):",
    parts: [
      { label: "a.", math: "A(8,\\ 3)" },
      { label: "b.", math: "B(5,\\ -2)" },
      { label: "c.", math: "C(2,\\ 7)" },
      { label: "d.", math: "D(-4,\\ 1)" },
      { label: "e.", math: "E(5,\\ 0)" },
      { label: "f.", math: "F(11,\\ -5)" },
    ],
  }),

  Qn(7, "Posisi Relatif terhadap Dua Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: 2, x2: 6.5, y2: 2, color: "#facc15", label: "y=2" },
        { x1: -1, y1: -6.5, x2: -1, y2: 6.5, color: "#a78bfa", label: "x=−1" },
      ],
      pts: [
        { x: 3, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -4, y: 4, label: "B", color: "#fb923c", labelPos: "tl" },
        { x: -3, y: -2, label: "C", color: "#34d399", labelPos: "bl" },
        { x: 4, y: -3, label: "D", color: "#60a5fa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan posisi setiap titik terhadap garis y = 2 (atas/bawah/pada)." },
      { label: "b.", text: "Tentukan posisi setiap titik terhadap garis x = −1 (kanan/kiri/pada)." },
      { label: "c.", text: "Titik mana yang berada di atas y = 2 DAN di kanan x = −1?" },
    ],
  }),

  Qn(8, "Titik pada Garis — Persamaan Garis Lurus", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -3, y1: -4, x2: 4, y2: 10, color: "#facc15" }],
      pts: [
        { x: 0, y: 2, label: "A(0,2)", color: "#f472b6", labelPos: "tl" },
        { x: 1, y: 4, label: "B(1,4)", color: "#60a5fa", labelPos: "tr" },
        { x: 2, y: 5, label: "C(2,5)", color: "#34d399", labelPos: "tr" },
      ],
      extraTexts: [{ x: 3.5, y: 9, text: "y=2x+2", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "Garis:", math: "y = 2x + 2" },
      { label: "a.", text: "Periksa apakah titik A(0, 2) terletak pada garis y = 2x + 2." },
      { label: "b.", text: "Periksa apakah titik B(1, 4) terletak pada garis y = 2x + 2." },
      { label: "c.", text: "Periksa apakah titik C(2, 5) terletak pada garis y = 2x + 2." },
    ],
  }),

  Qn(9, "Apakah Titik Memenuhi Persamaan Garis?", {
    type: "mixed",
    content: "Periksa apakah setiap titik berikut terletak pada garis y = 3x − 1:",
    parts: [
      { label: "a.", math: "P(1,\\ 2)" },
      { label: "b.", math: "Q(2,\\ 5)" },
      { label: "c.", math: "R(-1,\\ -4)" },
      { label: "d.", math: "S(0,\\ -1)" },
      { label: "e.", math: "T(3,\\ 7)" },
    ],
  }),

  Qn(10, "Posisi Relatif terhadap Garis y = x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5.5, y1: -5.5, x2: 5.5, y2: 5.5, color: "#facc15", label: "y=x" }],
      pts: [
        { x: 3, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: 4, y: 1, label: "B", color: "#60a5fa", labelPos: "br" },
        { x: -2, y: -2, label: "C", color: "#34d399", labelPos: "bl" },
        { x: -1, y: 3, label: "D", color: "#fb923c", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik yang PADA garis y = x memiliki syarat apa?" },
      { label: "b.", text: "Titik yang DI ATAS garis y = x memiliki syarat apa (y > x atau y < x)?" },
      { label: "c.", text: "Tentukan posisi masing-masing titik A, B, C, D terhadap garis y = x." },
    ],
  }),

  Qn(11, "Posisi terhadap Garis y = −x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5.5, y1: 5.5, x2: 5.5, y2: -5.5, color: "#a78bfa", label: "y=−x" }],
      pts: [
        { x: 2, y: 3, label: "P", color: "#f472b6", labelPos: "tr" },
        { x: 4, y: -3, label: "Q", color: "#60a5fa", labelPos: "br" },
        { x: -3, y: 3, label: "R", color: "#34d399", labelPos: "tl" },
        { x: 2, y: -2, label: "S", color: "#facc15", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik yang PADA garis y = −x memiliki syarat apa?" },
      { label: "b.", text: "Tentukan posisi titik P, Q, R, S terhadap garis y = −x." },
    ],
  }),

  Qn(12, "Mencari Titik pada Garis dari Syarat", {
    type: "mixed",
    content: "Tentukan koordinat titik yang memenuhi syarat:",
    parts: [
      { label: "a.", math: "\\text{Terletak pada garis } y = 2x + 1 \\text{ dan memiliki absis } x = 3." },
      { label: "b.", math: "\\text{Terletak pada garis } y = -x + 4 \\text{ dan memiliki ordinat } y = 6." },
      { label: "c.", math: "\\text{Terletak pada garis } x + y = 7 \\text{ dan memiliki absis } x = -2." },
    ],
  }),

  Qn(13, "Posisi Titik terhadap Dua Garis Sejajar", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: 4, x2: 6.5, y2: 4, color: "#facc15", label: "y=4" },
        { x1: -6.5, y1: -2, x2: 6.5, y2: -2, color: "#f472b6", label: "y=−2" },
      ],
      pts: [
        { x: 3, y: 6, label: "A", color: "#60a5fa", labelPos: "tr" },
        { x: -4, y: 1, label: "B", color: "#34d399", labelPos: "tl" },
        { x: 2, y: -4, label: "C", color: "#fb923c", labelPos: "br" },
        { x: -1, y: 4, label: "D", color: "#a78bfa", labelPos: "top" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan posisi A, B, C, D terhadap garis y = 4." },
      { label: "b.", text: "Tentukan posisi A, B, C, D terhadap garis y = −2." },
      { label: "c.", text: "Titik mana yang berada DI ANTARA kedua garis y = −2 dan y = 4?" },
    ],
  }),

  Qn(14, "Posisi di Antara Dua Garis Vertikal", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -3, y1: -6.5, x2: -3, y2: 6.5, color: "#facc15", label: "x=−3" },
        { x1: 4, y1: -6.5, x2: 4, y2: 6.5, color: "#60a5fa", label: "x=4" },
      ],
      pts: [
        { x: 0, y: 3, label: "P", color: "#f472b6", labelPos: "tr" },
        { x: -5, y: 2, label: "Q", color: "#34d399", labelPos: "tl" },
        { x: 6, y: -2, label: "R", color: "#fb923c", labelPos: "br" },
        { x: -3, y: -4, label: "S", color: "#a78bfa", labelPos: "bl" },
        { x: 4, y: 1, label: "T", color: "#facc15", labelPos: "tr" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di antara garis x = −3 dan x = 4?" },
      { label: "b.", text: "Titik mana yang berada di sebelah kiri garis x = −3?" },
      { label: "c.", text: "Titik mana yang berada tepat pada salah satu garis?" },
    ],
  }),

  Qn(15, "Daerah yang Didefinisikan Syarat Koordinat", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      shades: [{ type: "rect", x1: 0, y1: 0, x2: 6, y2: 6, color: "rgba(250,204,21,0.08)" }],
      pts: [
        { x: 3, y: 4, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: 3, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: 4, y: -2, label: "C", color: "#34d399", labelPos: "br" },
        { x: -3, y: -4, label: "D", color: "#fb923c", labelPos: "bl" },
      ],
    },
    content: "Daerah yang diarsir adalah daerah dengan x ≥ 0 dan y ≥ 0.",
    parts: [
      { label: "a.", text: "Titik mana yang terletak di daerah yang diarsir?" },
      { label: "b.", text: "Daerah ini merupakan kuadran berapa?" },
      { label: "c.", text: "Tentukan apakah titik (0, 5) dan (5, 0) termasuk dalam daerah ini." },
    ],
  }),

  Qn(16, "Posisi Relatif dan Jarak", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -6.5, y1: -1, x2: 6.5, y2: -1, color: "#facc15", label: "y=−1" }],
      pts: [
        { x: 2, y: 4, label: "P(2,4)", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: -4, label: "Q(−3,−4)", color: "#60a5fa", labelPos: "bl" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan posisi P dan Q terhadap garis y = −1." },
      { label: "b.", text: "Hitung jarak P ke garis y = −1." },
      { label: "c.", text: "Hitung jarak Q ke garis y = −1." },
    ],
  }),

  Qn(17, "Posisi Titik dalam Konteks Peta", {
    type: "mixed",
    content: "Di sebuah lapangan, garis tengah terletak pada y = 0 (sumbu-x).\nPosisi pemain: Budi(3,4), Ani(−2,−3), Cici(5,0), Dian(−4,2), Eko(1,−5)",
    parts: [
      { label: "a.", text: "Pemain mana yang berada di sisi ATAS lapangan (y > 0)?" },
      { label: "b.", text: "Pemain mana yang berada di sisi BAWAH lapangan (y < 0)?" },
      { label: "c.", text: "Pemain mana yang tepat berada di garis tengah (y = 0)?" },
    ],
  }),

  Qn(18, "Posisi terhadap Garis Miring y = x + 2", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -5, y1: -3, x2: 4, y2: 6, color: "#facc15" }],
      pts: [
        { x: 0, y: 5, label: "A", color: "#f472b6", labelPos: "tl" },
        { x: 3, y: 2, label: "B", color: "#60a5fa", labelPos: "br" },
        { x: -2, y: 0, label: "C", color: "#34d399", labelPos: "bl" },
        { x: 1, y: 3, label: "D", color: "#facc15", labelPos: "tr" },
      ],
      extraTexts: [{ x: 3.5, y: 5.8, text: "y=x+2", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "Garis:", math: "y = x + 2" },
      { label: "a.", text: "Titik yang DI ATAS garis y = x + 2 memiliki syarat y > x + 2 atau y < x + 2?" },
      { label: "b.", text: "Tentukan posisi titik A, B, C, D terhadap garis y = x + 2." },
    ],
  }),

  Qn(19, "Posisi Titik Terhadap y = 2x − 1", {
    type: "mixed",
    content: "Tentukan apakah setiap titik berada di atas, di bawah, atau pada garis y = 2x − 1:",
    parts: [
      { label: "a.", math: "A(1,\\ 3)" },
      { label: "b.", math: "B(2,\\ 3)" },
      { label: "c.", math: "C(3,\\ 5)" },
      { label: "d.", math: "D(-1,\\ -4)" },
      { label: "e.", math: "E(0,\\ -1)" },
    ],
  }),

  Qn(20, "Syarat Titik Berada di Atas Garis", {
    type: "mixed",
    content: "Tentukan nilai k agar titik P(k, 5) berada di ATAS garis y = 2x + 1.",
    parts: [
      { label: "a.", text: "Tuliskan syarat koordinat agar suatu titik berada di atas garis y = 2x + 1." },
      { label: "b.", math: "\\text{Substitusikan koordinat } P(k,\\ 5): \\text{ syarat } 5 > 2k + 1." },
      { label: "c.", text: "Tentukan rentang nilai k yang memenuhi syarat." },
    ],
  }),

  Qn(21, "Daerah Irisan Dua Kondisi", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      shades: [{ type: "rect", x1: -7, y1: 1, x2: 3, y2: 7, color: "rgba(96,165,250,0.1)" }],
      segs: [
        { x1: -6.5, y1: 1, x2: 6.5, y2: 1, color: "#facc15", label: "y=1" },
        { x1: 3, y1: -6.5, x2: 3, y2: 6.5, color: "#f472b6", label: "x=3" },
      ],
      pts: [
        { x: -2, y: 4, label: "A", color: "#34d399", labelPos: "tr" },
        { x: 5, y: 3, label: "B", color: "#fb923c", labelPos: "tr" },
        { x: -4, y: -2, label: "C", color: "#a78bfa", labelPos: "bl" },
        { x: 1, y: 1, label: "D", color: "#facc15", labelPos: "top" },
      ],
    },
    content: "Daerah yang diarsir = y > 1 DAN x < 3.",
    parts: [
      { label: "a.", text: "Periksa apakah titik A(−2, 4) termasuk dalam daerah yang diarsir." },
      { label: "b.", text: "Periksa apakah titik B(5, 3) termasuk dalam daerah yang diarsir." },
      { label: "c.", text: "Periksa apakah titik C(−4, −2) termasuk dalam daerah yang diarsir." },
      { label: "d.", text: "Apakah titik D(1, 1) termasuk? Jelaskan (syarat KETAT: y > 1)." },
    ],
  }),

  Qn(22, "Titik-titik pada Garis dan Posisinya", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -5.5, y1: 2.5, x2: 5.5, y2: -3.5, color: "#facc15" }],
      pts: [
        { x: -3, y: 2, label: "A", color: "#f472b6", labelPos: "tl" },
        { x: 0, y: 0, label: "B", color: "#60a5fa", labelPos: "tr" },
        { x: 3, y: -2, label: "C", color: "#34d399", labelPos: "br" },
        { x: -1, y: -1, label: "D", color: "#fb923c", labelPos: "bl" },
      ],
      extraTexts: [{ x: 4.5, y: -3, text: "y=−x", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "a.", text: "Garis y = −x melewati kuadran mana saja?" },
      { label: "b.", text: "Tentukan posisi titik A, B, C, D terhadap garis y = −x." },
    ],
  }),

  Qn(23, "Syarat Titik Masuk Kuadran", {
    type: "mixed",
    content: "Tentukan syarat nilai a dan b agar titik P(2a − 3, b + 1) berada di:",
    parts: [
      { label: "a.", text: "Kuadran I (x > 0 dan y > 0)." },
      { label: "b.", text: "Kuadran III (x < 0 dan y < 0)." },
      { label: "c.", text: "Sumbu-x (y = 0)." },
    ],
  }),

  Qn(24, "Posisi Relatif Titik terhadap Segitiga", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -4, y: -3, label: "A(−4,−3)", color: "#f472b6", labelPos: "bl" },
        { x: 4, y: -3, label: "B(4,−3)", color: "#fb923c", labelPos: "br" },
        { x: 0, y: 5, label: "C(0,5)", color: "#34d399", labelPos: "top" },
        { x: 0, y: -3, label: "M", color: "#facc15", labelPos: "bot" },
        { x: 1, y: 0, label: "P", color: "#60a5fa", labelPos: "tr" },
      ],
      segs: [
        { x1: -4, y1: -3, x2: 4, y2: -3, color: "#60a5fa" },
        { x1: 4, y1: -3, x2: 0, y2: 5, color: "#60a5fa" },
        { x1: 0, y1: 5, x2: -4, y2: -3, color: "#60a5fa" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan posisi titik P(1, 0) terhadap garis y = −3 (alas segitiga)." },
      { label: "b.", text: "Hitung jarak P ke garis y = −3." },
      { label: "c.", text: "Hitung jarak P ke titik M(0, −3) (tengah alas)." },
    ],
  }),

  Qn(25, "Posisi Relatif 6 Titik — Tabel", {
    type: "mixed",
    content: "Lengkapi tabel posisi untuk setiap titik:",
    parts: [
      { label: "", text: "Titik: A(3,5), B(−2,7), C(4,−1), D(−6,−4), E(0,3), F(−3,0)" },
      { label: "Q1:", text: "Posisi terhadap y = 3 (atas/bawah/pada)" },
      { label: "Q2:", text: "Posisi terhadap x = −1 (kanan/kiri/pada)" },
      { label: "Q3:", text: "Di antara y = −2 dan y = 6? (ya/tidak)" },
    ],
  }),

  Qn(26, "Posisi dan Nilai Persamaan Garis", {
    type: "mixed",
    content: "Untuk garis y = x − 3:",
    parts: [
      { label: "a.", math: "\\text{Hitung } y \\text{ saat } x = 5." },
      { label: "b.", math: "\\text{Apakah titik } A(5,\\ 3) \\text{ pada, di atas, atau di bawah garis?}" },
      { label: "c.", math: "\\text{Apakah titik } B(3,\\ -1) \\text{ pada, di atas, atau di bawah garis?}" },
      { label: "d.", math: "\\text{Apakah titik } C(2,\\ -2) \\text{ pada, di atas, atau di bawah garis?}" },
    ],
  }),

  Qn(27, "Daerah Himpunan Titik", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      shades: [{ type: "rect", x1: -6, y1: -6, x2: 0, y2: 0, color: "rgba(167,139,250,0.12)" }],
      segs: [
        { x1: -6, y1: 0, x2: 6, y2: 0, color: "rgba(255,255,255,0.3)" },
        { x1: 0, y1: -6, x2: 0, y2: 6, color: "rgba(255,255,255,0.3)" },
      ],
    },
    content: "Daerah yang diarsir adalah Kuadran III: x < 0 dan y < 0.",
    parts: [
      { label: "a.", text: "Sebutkan 3 titik yang berada di dalam daerah yang diarsir." },
      { label: "b.", math: "\\text{Apakah titik } (-3,\\ -5) \\text{ ada di daerah yang diarsir?}" },
      { label: "c.", math: "\\text{Apakah titik } (0,\\ -4) \\text{ ada di daerah yang diarsir? Jelaskan!}" },
    ],
  }),

  Qn(28, "Posisi Relatif — Soal TKA", {
    type: "mixed",
    content: "Diketahui garis g: y = −2x + 4. Tentukan apakah setiap titik berada di atas, di bawah, atau pada garis g:",
    parts: [
      { label: "a.", math: "P(1,\\ 2)" },
      { label: "b.", math: "Q(0,\\ 4)" },
      { label: "c.", math: "R(2,\\ 1)" },
      { label: "d.", math: "S(-1,\\ 7)" },
    ],
  }),

  Qn(29, "Mencari Titik Potong dengan Sumbu", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -2, y1: -5, x2: 3, y2: 5, color: "#facc15" }],
      pts: [
        { x: 0, y: 1, label: "?", color: "#f472b6", labelPos: "tl" },
        { x: -0.5, y: 0, label: "?", color: "#60a5fa", labelPos: "bot" },
      ],
      extraTexts: [{ x: 2.5, y: 4.5, text: "y=2x+1", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "Garis:", math: "y = 2x + 1" },
      { label: "a.", math: "\\text{Cari titik potong dengan sumbu-y (saat } x=0)." },
      { label: "b.", math: "\\text{Cari titik potong dengan sumbu-x (saat } y=0)." },
      { label: "c.", text: "Di kuadran mana garis y = 2x + 1 naik dari kiri ke kanan?" },
    ],
  }),

  Qn(30, "Posisi Relatif dan Daerah Irisan 4 Kondisi", {
    type: "mixed",
    content: "Tentukan apakah titik P(2, 3) memenuhi semua kondisi berikut (Ya/Tidak):",
    parts: [
      { label: "1.", math: "x > 0" },
      { label: "2.", math: "y > 0" },
      { label: "3.", math: "y < 2x + 1" },
      { label: "4.", math: "x < 5" },
      { label: "", text: "Jika semua kondisi terpenuhi, titik P berada di daerah tertentu. Deskripsikan daerah tersebut!" },
    ],
  }),

  Qn(31, "Posisi Titik Terhadap Garis Diagonal y = x + 3", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -6, y1: -3, x2: 4, y2: 7, color: "#facc15" }],
      pts: [
        { x: -3, y: 1, label: "A", color: "#f472b6", labelPos: "tl" },
        { x: 2, y: 4, label: "B", color: "#60a5fa", labelPos: "tr" },
        { x: 0, y: 3, label: "C", color: "#34d399", labelPos: "tr" },
        { x: 3, y: 2, label: "D", color: "#fb923c", labelPos: "br" },
      ],
      extraTexts: [{ x: 3.5, y: 6.8, text: "y=x+3", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "a.", text: "Titik yang di atas garis y = x + 3 memiliki y > x + 3 atau y < x + 3?" },
      { label: "b.", text: "Tentukan posisi setiap titik A, B, C, D terhadap garis y = x + 3." },
    ],
  }),

  Qn(32, "Soal ANBK — Himpunan Titik yang Memenuhi Syarat", {
    type: "mixed",
    content: "Dari titik-titik berikut, kelompokkan sesuai dengan syarat yang diberikan:\nTitik: A(4, 2), B(−1, 5), C(3, −4), D(−3, −2), E(0, 6), F(5, 0)",
    parts: [
      { label: "1.", text: "Titik dengan x > 0 dan y > 0 (Kuadran I)" },
      { label: "2.", text: "Titik dengan x < 0 dan y > 0 (Kuadran II)" },
      { label: "3.", text: "Titik dengan y < 0 (Kuadran III atau IV)" },
      { label: "4.", text: "Titik pada sumbu koordinat" },
    ],
  }),

  Qn(33, "Posisi Relatif terhadap Garis y = −2x + 4", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -1.5, y1: 7, x2: 5, y2: -6, color: "#facc15" }],
      pts: [
        { x: 1, y: 5, label: "A", color: "#f472b6", labelPos: "tl" },
        { x: 3, y: -1, label: "B", color: "#60a5fa", labelPos: "br" },
        { x: 0, y: 4, label: "C", color: "#34d399", labelPos: "tl" },
        { x: 2, y: 0, label: "D", color: "#facc15", labelPos: "br" },
      ],
      extraTexts: [{ x: 0, y: 5.5, text: "y=−2x+4", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "a.", text: "Titik yang di atas garis y = −2x + 4 memiliki syarat y > −2x + 4." },
      { label: "b.", text: "Tentukan posisi titik A, B, C, D terhadap garis y = −2x + 4." },
    ],
  }),

  Qn(34, "Posisi Relatif — Konteks Olahraga", {
    type: "mixed",
    content: "Di lapangan futsal, garis tengah terletak di x = 0. Garis area penalti terletak di x = 4 dan x = −4.\nPosisi pemain: Ali(3, 2), Beni(−5, 4), Candra(0, 3), Diana(6, −1), Evi(−4, 5)",
    parts: [
      { label: "a.", text: "Pemain mana yang berada di setengah lapangan positif (x > 0)?" },
      { label: "b.", text: "Pemain mana yang berada di area penalti kiri (−4 < x < 0)?" },
      { label: "c.", text: "Pemain mana yang tepat berada di garis (x = 0, x = 4, atau x = −4)?" },
    ],
  }),

  Qn(35, "Daerah Perpotongan Empat Syarat", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      shades: [{ type: "rect", x1: -3, y1: 2, x2: 4, y2: 7, color: "rgba(56,189,248,0.1)" }],
      segs: [
        { x1: -6.5, y1: 2, x2: 6.5, y2: 2, color: "#facc15", label: "y=2" },
        { x1: -3, y1: -6.5, x2: -3, y2: 6.5, color: "#f472b6", label: "x=−3" },
        { x1: 4, y1: -6.5, x2: 4, y2: 6.5, color: "#60a5fa", label: "x=4" },
      ],
      pts: [
        { x: 1, y: 5, label: "P", color: "#34d399", labelPos: "tr" },
        { x: -4, y: 4, label: "Q", color: "#fb923c", labelPos: "tl" },
        { x: 2, y: 1, label: "R", color: "#a78bfa", labelPos: "br" },
      ],
    },
    content: "Daerah yang diarsir: y > 2 DAN −3 < x < 4.",
    parts: [
      { label: "a.", text: "Apakah titik P(1, 5) berada di daerah yang diarsir?" },
      { label: "b.", text: "Apakah titik Q(−4, 4) berada di daerah yang diarsir?" },
      { label: "c.", text: "Apakah titik R(2, 1) berada di daerah yang diarsir?" },
    ],
  }),

  Qn(36, "Soal UN — Posisi Relatif Komprehensif", {
    type: "mixed",
    content: "Diketahui garis k: y = x − 2 dan titik-titik A(3, 2), B(1, −2), C(4, 4).",
    parts: [
      { label: "a.", text: "Tentukan posisi setiap titik terhadap garis k (di atas, di bawah, pada)." },
      { label: "b.", text: "Hitung jarak setiap titik ke garis y = x − 2." },
      { label: "c.", text: "Titik mana yang paling dekat dengan garis k?" },
    ],
  }),

  Qn(37, "Posisi Titik terhadap Lingkaran", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -5, y1: 0, x2: 5, y2: 0, color: "rgba(255,255,255,0)", dashed: false },
      ],
      pts: [
        { x: 0, y: 0, label: "O", color: "#facc15", labelPos: "bl" },
        { x: 3, y: 4, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: 1, y: 2, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: 4, y: 3, label: "C", color: "#34d399", labelPos: "tr" },
        { x: 5, y: 0, label: "D", color: "#fb923c", labelPos: "tr" },
      ],
    },
    content: "Lingkaran berpusat O(0,0) dengan jari-jari 5. Titik dikatakan:\n- Di dalam: jarak ke O < 5\n- Pada: jarak ke O = 5\n- Di luar: jarak ke O > 5",
    parts: [
      { label: "a.", text: "Tentukan posisi titik A(3, 4) terhadap lingkaran." },
      { label: "b.", text: "Tentukan posisi titik B(1, 2) terhadap lingkaran." },
      { label: "c.", text: "Tentukan posisi titik C(4, 3) terhadap lingkaran." },
      { label: "d.", text: "Tentukan posisi titik D(5, 0) terhadap lingkaran." },
    ],
  }),

  Qn(38, "ANBK — Evaluasi Pernyataan Posisi Relatif", {
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S) untuk garis y = 3x − 2:",
    parts: [
      { label: "(1)", math: "\\text{Titik } A(1,\\ 1) \\text{ berada di bawah garis karena } 1 < 3(1)-2 = 1." },
      { label: "(2)", math: "\\text{Titik } B(0,\\ -2) \\text{ tepat berada pada garis.}" },
      { label: "(3)", math: "\\text{Titik } C(2,\\ 5) \\text{ berada di atas garis karena } 5 > 3(2)-2 = 4." },
      { label: "(4)", math: "\\text{Semua titik dengan } y > 3x-2 \\text{ berada di atas garis.}" },
    ],
  }),

  Qn(39, "Syarat Ganda untuk Posisi Titik", {
    type: "mixed",
    content: "Tentukan nilai p agar titik P(p, 2p + 1):",
    parts: [
      { label: "a.", text: "Berada di atas garis y = p + 3." },
      { label: "b.", text: "Berada di bawah garis y = 3p − 1." },
      { label: "c.", text: "Tepat pada garis y = 2x − 5." },
    ],
  }),

  Qn(40, "Soal ANBK — Gabungan Posisi Relatif", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: 3, x2: 6.5, y2: 3, color: "#facc15", label: "y=3" },
        { x1: 2, y1: -6.5, x2: 2, y2: 6.5, color: "#f472b6", label: "x=2" },
        { x1: -5.5, y1: -5.5, x2: 5.5, y2: 5.5, color: "#60a5fa", dashed: true },
      ],
      pts: [
        { x: -2, y: 5, label: "A", color: "#34d399", labelPos: "tl" },
        { x: 4, y: 5, label: "B", color: "#fb923c", labelPos: "tr" },
        { x: -3, y: -2, label: "C", color: "#a78bfa", labelPos: "bl" },
        { x: 5, y: -1, label: "D", color: "#f87171", labelPos: "br" },
      ],
      extraTexts: [{ x: 5, y: 5.5, text: "y=x", color: "#60a5fa", size: 10 }],
    },
    content: "Tiga garis: y = 3, x = 2, y = x (putus-putus).",
    parts: [
      { label: "a.", text: "Tentukan posisi setiap titik A, B, C, D terhadap garis y = 3." },
      { label: "b.", text: "Tentukan posisi setiap titik terhadap garis x = 2." },
      { label: "c.", text: "Tentukan posisi setiap titik terhadap garis y = x." },
      { label: "d.", text: "Titik mana yang berada di atas y = 3 DAN di kiri x = 2 DAN di atas y = x?" },
    ],
  }),
];

const PosisiRelatifPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Navigation className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            POSISI RELATIF TITIK TERHADAP GARIS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Koordinat Cartesius · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-3">📌 Aturan Posisi Relatif</p>
          <div className="flex flex-col gap-2 text-xs font-body">
            {[
              { rule: "Di atas garis y = k", cond: "y₀ > k" },
              { rule: "Di bawah garis y = k", cond: "y₀ < k" },
              { rule: "Di kanan garis x = k", cond: "x₀ > k" },
              { rule: "Di kiri garis x = k", cond: "x₀ < k" },
              { rule: "Di atas garis y = mx + c", cond: "y₀ > mx₀ + c" },
              { rule: "Di bawah garis y = mx + c", cond: "y₀ < mx₀ + c" },
            ].map(r => (
              <div key={r.rule} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3">
                <span className="text-rose-300 font-bold w-40 shrink-0">{r.rule}:</span>
                <span className="text-white/60">{r.cond}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CoordPlane {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Koordinat Cartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifPage;
