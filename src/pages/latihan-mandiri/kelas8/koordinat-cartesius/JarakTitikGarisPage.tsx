import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Ruler } from "lucide-react";
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
  Qn(1, "Jarak Dua Titik — Pengenalan Rumus", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 1, y: 2, label: "A(1,2)", color: "#f472b6", labelPos: "tl" },
        { x: 5, y: 5, label: "B(5,5)", color: "#60a5fa", labelPos: "tr" },
      ],
      segs: [{ x1: 1, y1: 2, x2: 5, y2: 5, color: "#facc15", label: "d" }],
    },
    parts: [
      { label: "Rumus:", math: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" },
      { label: "a.", text: "Hitung jarak A(1, 2) ke B(5, 5) menggunakan rumus jarak." },
      { label: "b.", text: "Apakah jarak dari A ke B sama dengan jarak dari B ke A? Jelaskan!" },
    ],
  }),

  Qn(2, "Jarak Dua Titik Berbeda Kuadran", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -3, y: 4, label: "P(−3,4)", color: "#f472b6", labelPos: "tl" },
        { x: 5, y: -2, label: "Q(5,−2)", color: "#34d399", labelPos: "br" },
      ],
      segs: [{ x1: -3, y1: 4, x2: 5, y2: -2, color: "#facc15" }],
    },
    parts: [
      { label: "a.", math: "\\text{Hitung } PQ \\text{ (jarak P ke Q)}" },
      { label: "b.", math: "\\text{Apakah } PQ = 10 \\text{ satuan? Verifikasi!}" },
    ],
  }),

  Qn(3, "Jarak Titik ke Sumbu-x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 3, y: 5, label: "A(3,5)", color: "#f472b6", labelPos: "tr" },
        { x: 3, y: 0, label: "", color: "#f472b6" },
        { x: -4, y: -3, label: "B(−4,−3)", color: "#60a5fa", labelPos: "bl" },
        { x: -4, y: 0, label: "", color: "#60a5fa" },
      ],
      segs: [
        { x1: 3, y1: 5, x2: 3, y2: 0, color: "#f472b6", dashed: true, label: "5" },
        { x1: -4, y1: -3, x2: -4, y2: 0, color: "#60a5fa", dashed: true, label: "3" },
      ],
    },
    parts: [
      { label: "a.", text: "Berapakah jarak titik A(3, 5) ke sumbu-x?" },
      { label: "b.", text: "Berapakah jarak titik B(−4, −3) ke sumbu-x?" },
      { label: "c.", math: "\\text{Rumus: jarak ke sumbu-x} = |y|" },
      { label: "d.", text: "Hitung jarak titik C(−7, −9) ke sumbu-x." },
    ],
  }),

  Qn(4, "Jarak Titik ke Sumbu-y", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 2, label: "P(4,2)", color: "#fb923c", labelPos: "tr" },
        { x: 0, y: 2, label: "", color: "#fb923c" },
        { x: -5, y: -3, label: "Q(−5,−3)", color: "#a78bfa", labelPos: "bl" },
        { x: 0, y: -3, label: "", color: "#a78bfa" },
      ],
      segs: [
        { x1: 4, y1: 2, x2: 0, y2: 2, color: "#fb923c", dashed: true, label: "4" },
        { x1: -5, y1: -3, x2: 0, y2: -3, color: "#a78bfa", dashed: true, label: "5" },
      ],
    },
    parts: [
      { label: "a.", text: "Berapakah jarak titik P(4, 2) ke sumbu-y?" },
      { label: "b.", text: "Berapakah jarak titik Q(−5, −3) ke sumbu-y?" },
      { label: "c.", math: "\\text{Rumus: jarak ke sumbu-y} = |x|" },
      { label: "d.", text: "Hitung jarak titik R(−8, 6) ke sumbu-y." },
    ],
  }),

  Qn(5, "Perbandingan Jarak ke Sumbu", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 2, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -4, y: 1, label: "B", color: "#fb923c", labelPos: "tl" },
        { x: 3, y: -3, label: "C", color: "#34d399", labelPos: "br" },
        { x: -1, y: -4, label: "D", color: "#facc15", labelPos: "bl" },
      ],
    },
    content: "Koordinat: A(2,5), B(−4,1), C(3,−3), D(−1,−4)",
    parts: [
      { label: "a.", text: "Tentukan jarak setiap titik ke sumbu-x." },
      { label: "b.", text: "Tentukan jarak setiap titik ke sumbu-y." },
      { label: "c.", text: "Titik mana yang paling dekat ke sumbu-x?" },
      { label: "d.", text: "Titik mana yang paling jauh ke sumbu-y?" },
    ],
  }),

  Qn(6, "Jarak Titik ke Garis Horizontal", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 3, y: 6, label: "A(3,6)", color: "#f472b6", labelPos: "tr" },
        { x: 3, y: 2, label: "", color: "#f472b6" },
        { x: -2, y: -1, label: "B(−2,−1)", color: "#60a5fa", labelPos: "bl" },
        { x: -2, y: 2, label: "", color: "#60a5fa" },
      ],
      segs: [
        { x1: -6.5, y1: 2, x2: 6.5, y2: 2, color: "#facc15", label: "y = 2" },
        { x1: 3, y1: 6, x2: 3, y2: 2, color: "#f472b6", dashed: true, label: "?" },
        { x1: -2, y1: -1, x2: -2, y2: 2, color: "#60a5fa", dashed: true, label: "?" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung jarak titik A(3, 6) ke garis y = 2." },
      { label: "b.", text: "Hitung jarak titik B(−2, −1) ke garis y = 2." },
      { label: "c.", math: "\\text{Rumus: jarak titik } (x_0,y_0) \\text{ ke garis } y = k \\text{ adalah } |y_0 - k|" },
    ],
  }),

  Qn(7, "Jarak Titik ke Garis Vertikal", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -2, y: 4, label: "P(−2,4)", color: "#f472b6", labelPos: "tl" },
        { x: -2, y: 4, label: "", color: "#f472b6" },
        { x: 6, y: -3, label: "Q(6,−3)", color: "#34d399", labelPos: "br" },
      ],
      segs: [
        { x1: 3, y1: -6.5, x2: 3, y2: 6.5, color: "#a78bfa", label: "x=3" },
        { x1: -2, y1: 4, x2: 3, y2: 4, color: "#f472b6", dashed: true, label: "?" },
        { x1: 6, y1: -3, x2: 3, y2: -3, color: "#34d399", dashed: true, label: "?" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung jarak titik P(−2, 4) ke garis x = 3." },
      { label: "b.", text: "Hitung jarak titik Q(6, −3) ke garis x = 3." },
      { label: "c.", math: "\\text{Rumus: jarak titik } (x_0,y_0) \\text{ ke garis } x = k \\text{ adalah } |x_0 - k|" },
    ],
  }),

  Qn(8, "Latihan Jarak ke Garis — Beragam", {
    type: "mixed",
    content: "Hitung jarak setiap titik ke garis yang diberikan:",
    parts: [
      { label: "a.", math: "P(4,\\ -3) \\text{ ke garis } y = 1" },
      { label: "b.", math: "Q(-5,\\ 2) \\text{ ke garis } x = -8" },
      { label: "c.", math: "R(0,\\ 7) \\text{ ke garis } y = -2" },
      { label: "d.", math: "S(-3,\\ -4) \\text{ ke garis } x = 5" },
      { label: "e.", math: "T(6,\\ -1) \\text{ ke garis } y = 6" },
    ],
  }),

  Qn(9, "Keliling Segitiga dari Koordinat", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 0, label: "A(0,0)", color: "#f472b6", labelPos: "bl" },
        { x: 4, y: 0, label: "B(4,0)", color: "#fb923c", labelPos: "br" },
        { x: 4, y: 3, label: "C(4,3)", color: "#34d399", labelPos: "tr" },
      ],
      segs: [
        { x1: 0, y1: 0, x2: 4, y2: 0, color: "#60a5fa", label: "AB" },
        { x1: 4, y1: 0, x2: 4, y2: 3, color: "#60a5fa", label: "BC" },
        { x1: 4, y1: 3, x2: 0, y2: 0, color: "#60a5fa", label: "AC" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung panjang AB, BC, dan AC." },
      { label: "b.", text: "Hitung keliling segitiga ABC." },
      { label: "c.", text: "Apakah segitiga ABC siku-siku? Jelaskan!" },
    ],
  }),

  Qn(10, "Keliling Segitiga — Koordinat Negatif", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -4, y: 3, label: "P", color: "#f472b6", labelPos: "tl" },
        { x: 2, y: 3, label: "Q", color: "#fb923c", labelPos: "tr" },
        { x: -1, y: -2, label: "R", color: "#34d399", labelPos: "bl" },
      ],
      segs: [
        { x1: -4, y1: 3, x2: 2, y2: 3, color: "#60a5fa" },
        { x1: 2, y1: 3, x2: -1, y2: -2, color: "#60a5fa" },
        { x1: -1, y1: -2, x2: -4, y2: 3, color: "#60a5fa" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung panjang PQ, QR, dan PR." },
      { label: "b.", text: "Hitung keliling segitiga PQR." },
    ],
  }),

  Qn(11, "Titik Tengah Segmen dari Diagram", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -3, y: 1, label: "A(−3,1)", color: "#f472b6", labelPos: "tl" },
        { x: 5, y: 5, label: "B(5,5)", color: "#fb923c", labelPos: "tr" },
        { x: 1, y: 3, label: "M(?,?)", color: "#facc15", labelPos: "top" },
      ],
      segs: [
        { x1: -3, y1: 1, x2: 5, y2: 5, color: "#60a5fa" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik tengah M dari segmen AB." },
      { label: "b.", math: "\\text{Rumus titik tengah: } M = \\left(\\frac{x_1+x_2}{2},\\ \\frac{y_1+y_2}{2}\\right)" },
    ],
  }),

  Qn(12, "Jarak dari Titik Tengah", {
    type: "mixed",
    content: "Diketahui titik A(2, 4) dan B(8, 10).",
    parts: [
      { label: "a.", text: "Tentukan koordinat titik tengah M dari AB." },
      { label: "b.", text: "Hitung jarak AM dan MB. Apa yang kamu simpulkan?" },
      { label: "c.", text: "Hitung jarak AB." },
    ],
  }),

  Qn(13, "Jarak Titik ke Titik Asal O", {
    type: "mixed",
    content: "Jarak titik P(x, y) ke titik asal O(0, 0) dapat dihitung sebagai:",
    parts: [
      { label: "Rumus:", math: "OP = \\sqrt{x^2 + y^2}" },
      { label: "a.", math: "\\text{Hitung } OA \\text{ jika } A(3,\\ 4)" },
      { label: "b.", math: "\\text{Hitung } OB \\text{ jika } B(-5,\\ 12)" },
      { label: "c.", math: "\\text{Hitung } OC \\text{ jika } C(-6,\\ -8)" },
    ],
  }),

  Qn(14, "Luas Segitiga dari Koordinat", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 0, label: "O", color: "#f472b6", labelPos: "bl" },
        { x: 5, y: 0, label: "A(5,0)", color: "#fb923c", labelPos: "br" },
        { x: 0, y: 4, label: "B(0,4)", color: "#34d399", labelPos: "tl" },
      ],
      segs: [
        { x1: 0, y1: 0, x2: 5, y2: 0, color: "#60a5fa" },
        { x1: 5, y1: 0, x2: 0, y2: 4, color: "#60a5fa" },
        { x1: 0, y1: 4, x2: 0, y2: 0, color: "#60a5fa" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung panjang sisi OA dan OB." },
      { label: "b.", text: "Apakah segitiga OAB siku-siku? Di mana sudut siku-sikunya?" },
      { label: "c.", text: "Hitung luas segitiga OAB." },
    ],
  }),

  Qn(15, "Soal TKA — Jarak dan Koordinat", {
    type: "mixed",
    content: "Diketahui titik A(3, 4) dan B(−1, 1).",
    parts: [
      { label: "a.", math: "\\text{Hitung jarak } AB." },
      { label: "b.", math: "\\text{Hitung jarak } A \\text{ ke sumbu-x dan ke sumbu-y.}" },
      { label: "c.", math: "\\text{Hitung jarak } B \\text{ ke sumbu-x dan ke sumbu-y.}" },
      { label: "d.", text: "Titik manakah yang lebih dekat ke titik asal O?" },
    ],
  }),

  Qn(16, "Jarak dalam Konteks Nyata", {
    type: "mixed",
    content: "Sebuah peta kota menggunakan koordinat kartesius (dalam km).\nRumah Andi: A(2, 3), Sekolah: B(8, 11)",
    diagram: {
      size: 260, range: 13,
      pts: [
        { x: 2, y: 3, label: "Rumah", color: "#f472b6", labelPos: "bl" },
        { x: 8, y: 11, label: "Sekolah", color: "#60a5fa", labelPos: "tr" },
      ],
      segs: [{ x1: 2, y1: 3, x2: 8, y2: 11, color: "#facc15", dashed: true }],
    },
    parts: [
      { label: "a.", text: "Hitung jarak lurus (garis lurus) dari Rumah ke Sekolah." },
      { label: "b.", text: "Jika Andi berjalan mengikuti jalan (horisontal lalu vertikal), berapa jauhnya?" },
    ],
  }),

  Qn(17, "Titik yang Berjarak Sama", {
    type: "mixed",
    content: "Tentukan sebuah titik pada sumbu-x yang berjarak sama dari titik A(3, 4) dan B(−1, 2).",
    parts: [
      { label: "a.", math: "\\text{Misalkan titik pada sumbu-x adalah } P(x,\\ 0)." },
      { label: "b.", math: "\\text{Gunakan kondisi: } PA = PB" },
      { label: "c.", text: "Hitung nilai x dan tentukan koordinat P." },
    ],
  }),

  Qn(18, "Jarak Ganda — Dua Titik", {
    type: "mixed",
    content: "Hitung jarak antara pasangan titik berikut:",
    parts: [
      { label: "a.", math: "A(0,\\ 0) \\text{ dan } B(3,\\ 4)" },
      { label: "b.", math: "C(-2,\\ 1) \\text{ dan } D(2,\\ 4)" },
      { label: "c.", math: "E(5,\\ -3) \\text{ dan } F(-1,\\ 5)" },
      { label: "d.", math: "G(-4,\\ -7) \\text{ dan } H(2,\\ 1)" },
    ],
  }),

  Qn(19, "Jarak Titik ke Garis — Lanjutan", {
    type: "mixed",
    content: "Hitung jarak dari titik ke garis yang diberikan:",
    parts: [
      { label: "a.", math: "A(3,\\ 7) \\text{ ke garis } y = 3" },
      { label: "b.", math: "B(-2,\\ -5) \\text{ ke garis } y = 1" },
      { label: "c.", math: "C(4,\\ 2) \\text{ ke garis } x = -2" },
      { label: "d.", math: "D(-6,\\ 3) \\text{ ke garis } x = 1" },
    ],
  }),

  Qn(20, "Titik Equidistant dari Dua Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: -3, x2: 6.5, y2: -3, color: "#facc15", label: "y=−3" },
        { x1: -6.5, y1: 5, x2: 6.5, y2: 5, color: "#a78bfa", label: "y=5" },
      ],
      pts: [
        { x: 2, y: 1, label: "P(2,1)", color: "#f472b6", labelPos: "tr" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung jarak titik P(2, 1) ke garis y = −3." },
      { label: "b.", text: "Hitung jarak titik P(2, 1) ke garis y = 5." },
      { label: "c.", text: "Apakah P berjarak sama dari kedua garis? Jika tidak, cari titik yang berjarak sama dari y=−3 dan y=5 pada x=2." },
    ],
  }),

  Qn(21, "Persegi Panjang — Diagonal", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -3, y: -2, label: "A", color: "#f472b6", labelPos: "bl" },
        { x: 4, y: -2, label: "B", color: "#fb923c", labelPos: "br" },
        { x: 4, y: 3, label: "C", color: "#34d399", labelPos: "tr" },
        { x: -3, y: 3, label: "D", color: "#facc15", labelPos: "tl" },
      ],
      segs: [
        { x1: -3, y1: -2, x2: 4, y2: -2, color: "rgba(255,255,255,0.3)" },
        { x1: 4, y1: -2, x2: 4, y2: 3, color: "rgba(255,255,255,0.3)" },
        { x1: 4, y1: 3, x2: -3, y2: 3, color: "rgba(255,255,255,0.3)" },
        { x1: -3, y1: 3, x2: -3, y2: -2, color: "rgba(255,255,255,0.3)" },
        { x1: -3, y1: -2, x2: 4, y2: 3, color: "#60a5fa", dashed: true, label: "d₁" },
        { x1: 4, y1: -2, x2: -3, y2: 3, color: "#f472b6", dashed: true, label: "d₂" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung panjang diagonal AC (d₁)." },
      { label: "b.", text: "Hitung panjang diagonal BD (d₂)." },
      { label: "c.", text: "Apakah kedua diagonal sama panjang? Apa kesimpulanmu?" },
    ],
  }),

  Qn(22, "Jarak Titik — Soal Pilihan Ganda Tipe UN", {
    type: "mixed",
    content: "Jarak antara titik P(1, 3) dan Q(4, 7) adalah ...",
    parts: [
      { label: "A.", math: "3\\sqrt{2}" },
      { label: "B.", math: "4\\sqrt{2}" },
      { label: "C.", math: "5" },
      { label: "D.", math: "\\sqrt{25} = 5" },
      { label: "", text: "Tentukan jawaban yang benar dan tunjukkan penghitungannya!" },
    ],
  }),

  Qn(23, "Jarak Titik — Soal Tipe ANBK", {
    type: "mixed",
    content: "Diketahui titik K(−2, 3) dan L(4, −5). Manakah pernyataan yang BENAR?",
    parts: [
      { label: "(1)", math: "KL = 10" },
      { label: "(2)", text: "Jarak K ke sumbu-x = 3" },
      { label: "(3)", text: "Jarak L ke sumbu-y = 4" },
      { label: "(4)", math: "KL = \\sqrt{100} = 10" },
      { label: "", text: "Periksa semua pernyataan dan tentukan yang benar!" },
    ],
  }),

  Qn(24, "Luas Segitiga — Koordinat Beragam", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -4, y: -3, label: "P", color: "#f472b6", labelPos: "bl" },
        { x: 3, y: -3, label: "Q", color: "#fb923c", labelPos: "br" },
        { x: -1, y: 5, label: "R", color: "#34d399", labelPos: "top" },
      ],
      segs: [
        { x1: -4, y1: -3, x2: 3, y2: -3, color: "#60a5fa" },
        { x1: 3, y1: -3, x2: -1, y2: 5, color: "#60a5fa" },
        { x1: -1, y1: 5, x2: -4, y2: -3, color: "#60a5fa" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung panjang alas PQ." },
      { label: "b.", text: "Hitung tinggi segitiga PQR (jarak R ke garis y = −3)." },
      { label: "c.", text: "Hitung luas segitiga PQR." },
    ],
  }),

  Qn(25, "Titik pada Lingkaran", {
    type: "mixed",
    content: "Sebuah lingkaran berpusat di O(0, 0) dengan jari-jari 5.",
    parts: [
      { label: "a.", math: "\\text{Apakah titik } A(3,\\ 4) \\text{ terletak pada lingkaran? Periksa!}" },
      { label: "b.", math: "\\text{Apakah titik } B(4,\\ 4) \\text{ terletak pada lingkaran? Periksa!}" },
      { label: "c.", math: "\\text{Apakah titik } C(5,\\ 0) \\text{ terletak pada lingkaran? Periksa!}" },
    ],
  }),

  Qn(26, "Jarak Titik ke Garis Miring (Pengantar)", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -5, y1: -5, x2: 5, y2: 5, color: "#facc15", label: "y=x" },
      ],
      pts: [
        { x: 4, y: 1, label: "P(4,1)", color: "#f472b6", labelPos: "br" },
        { x: -2, y: 3, label: "Q(−2,3)", color: "#60a5fa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Apakah titik P(4, 1) berada di atas atau di bawah garis y = x?" },
      { label: "b.", text: "Apakah titik Q(−2, 3) berada di atas atau di bawah garis y = x?" },
      { label: "c.", text: "Titik yang berada di atas garis y = x memiliki sifat y > x atau y < x?" },
    ],
  }),

  Qn(27, "Kode Posisi Titik Relatif", {
    type: "mixed",
    content: "Tentukan posisi setiap titik terhadap garis y = x (di atas, di bawah, atau pada garis):",
    parts: [
      { label: "a.", math: "A(3,\\ 3)" },
      { label: "b.", math: "B(2,\\ 5)" },
      { label: "c.", math: "C(-1,\\ -3)" },
      { label: "d.", math: "D(4,\\ -1)" },
      { label: "e.", math: "E(0,\\ 0)" },
    ],
  }),

  Qn(28, "Keliling Segi Empat dari Koordinat", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -3, y: 4, label: "A", color: "#f472b6", labelPos: "tl" },
        { x: 4, y: 2, label: "B", color: "#fb923c", labelPos: "tr" },
        { x: 2, y: -4, label: "C", color: "#34d399", labelPos: "br" },
        { x: -5, y: -2, label: "D", color: "#facc15", labelPos: "bl" },
      ],
      segs: [
        { x1: -3, y1: 4, x2: 4, y2: 2, color: "#60a5fa" },
        { x1: 4, y1: 2, x2: 2, y2: -4, color: "#60a5fa" },
        { x1: 2, y1: -4, x2: -5, y2: -2, color: "#60a5fa" },
        { x1: -5, y1: -2, x2: -3, y2: 4, color: "#60a5fa" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung panjang AB, BC, CD, dan DA." },
      { label: "b.", text: "Hitung keliling segi empat ABCD." },
    ],
  }),

  Qn(29, "Mencari Titik dari Jarak yang Diketahui", {
    type: "mixed",
    content: "Cari semua titik yang memenuhi syarat:",
    parts: [
      { label: "a.", math: "\\text{Berjarak 5 dari } O(0,0) \\text{ dan terletak pada sumbu-x.}" },
      { label: "b.", math: "\\text{Berjarak 3 dari } A(1,0) \\text{ dan terletak pada sumbu-y.}" },
      { label: "c.", math: "\\text{Berjarak 4 dari sumbu-x dan berjarak 3 dari sumbu-y di Kuadran II.}" },
    ],
  }),

  Qn(30, "Jarak dalam Segitiga Siku-siku", {
    type: "mixed",
    diagram: {
      size: 260, range: 8,
      pts: [
        { x: 0, y: 0, label: "O(0,0)", color: "#f472b6", labelPos: "bl" },
        { x: 6, y: 0, label: "A(6,0)", color: "#fb923c", labelPos: "br" },
        { x: 0, y: 8, label: "B(0,8)", color: "#34d399", labelPos: "tl" },
      ],
      segs: [
        { x1: 0, y1: 0, x2: 6, y2: 0, color: "#60a5fa", label: "6" },
        { x1: 0, y1: 0, x2: 0, y2: 8, color: "#60a5fa", label: "8" },
        { x1: 6, y1: 0, x2: 0, y2: 8, color: "#f472b6", label: "AB" },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung panjang OA dan OB." },
      { label: "b.", text: "Hitung panjang AB menggunakan rumus jarak." },
      { label: "c.", text: "Verifikasi menggunakan Teorema Pythagoras: AB² = OA² + OB²." },
    ],
  }),

  Qn(31, "Soal UN — Jarak Titik", {
    type: "mixed",
    content: "Koordinat titik A(−3, 4) dan B(5, −2).",
    parts: [
      { label: "a.", math: "\\text{Hitung } AB." },
      { label: "b.", math: "\\text{Hitung titik tengah } M \\text{ dari } AB." },
      { label: "c.", math: "\\text{Hitung jarak } A \\text{ ke sumbu-x dan sumbu-y.}" },
      { label: "d.", math: "\\text{Hitung jarak } B \\text{ ke garis } y = 3." },
    ],
  }),

  Qn(32, "Titik Tiga — Terbukti Segaris atau Tidak", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -2, y: -1, label: "A", color: "#f472b6", labelPos: "bl" },
        { x: 1, y: 1, label: "B", color: "#fb923c", labelPos: "tr" },
        { x: 4, y: 3, label: "C", color: "#34d399", labelPos: "tr" },
      ],
      segs: [
        { x1: -2, y1: -1, x2: 4, y2: 3, color: "#60a5fa", dashed: true },
      ],
    },
    parts: [
      { label: "a.", text: "Hitung AB, BC, dan AC." },
      { label: "b.", text: "Apakah AB + BC = AC? Apa kesimpulanmu tentang posisi ketiga titik?" },
    ],
  }),

  Qn(33, "Titik pada Garis y = 2x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -3, y1: -6, x2: 3, y2: 6, color: "#facc15", label: "y=2x" }],
      pts: [
        { x: 2, y: 4, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -1, y: -2, label: "B", color: "#60a5fa", labelPos: "bl" },
        { x: 3, y: 5, label: "C", color: "#34d399", labelPos: "tr" },
      ],
    },
    parts: [
      { label: "a.", text: "Periksa apakah titik A(2, 4) terletak pada garis y = 2x." },
      { label: "b.", text: "Periksa apakah titik B(−1, −2) terletak pada garis y = 2x." },
      { label: "c.", text: "Periksa apakah titik C(3, 5) terletak pada garis y = 2x." },
    ],
  }),

  Qn(34, "Jarak Titik dan Klasifikasinya", {
    type: "mixed",
    content: "Diketahui empat titik: A(0,5), B(3,0), C(0,−5), D(−3,0).",
    parts: [
      { label: "a.", text: "Hitung jarak setiap titik ke titik asal O." },
      { label: "b.", text: "Hitung jarak AB, BC, CD, dan DA." },
      { label: "c.", text: "Bangun apa yang dibentuk oleh A, B, C, D? Jelaskan!" },
    ],
  }),

  Qn(35, "Koordinat Titik — Dari Kondisi Jarak", {
    type: "mixed",
    content: "Tentukan koordinat titik P yang memenuhi syarat:",
    parts: [
      { label: "a.", text: "P terletak pada sumbu-y dan berjarak 5 dari titik A(4, 0)." },
      { label: "b.", text: "P terletak pada sumbu-x dan berjarak 5 dari titik B(0, 3)." },
    ],
  }),

  Qn(36, "Soal TKA — Keliling dan Luas", {
    type: "mixed",
    content: "Titik-titik sudut suatu segi empat: A(0, 0), B(6, 0), C(6, 4), D(0, 4).",
    parts: [
      { label: "a.", text: "Buat sketsa segi empat ABCD pada koordinat kartesius." },
      { label: "b.", text: "Hitung keliling ABCD." },
      { label: "c.", text: "Hitung luas ABCD." },
      { label: "d.", text: "Hitung panjang diagonal AC." },
    ],
  }),

  Qn(37, "Jarak Titik ke Garis Kombinasi", {
    type: "mixed",
    content: "Diketahui titik P(−3, 5). Hitung:",
    parts: [
      { label: "a.", text: "Jarak P ke sumbu-x." },
      { label: "b.", text: "Jarak P ke sumbu-y." },
      { label: "c.", math: "\\text{Jarak P ke garis } y = -2." },
      { label: "d.", math: "\\text{Jarak P ke garis } x = 4." },
      { label: "e.", text: "Jarak P ke titik asal O." },
    ],
  }),

  Qn(38, "Titik Tengah dan Jarak", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -4, y: 2, label: "A(−4,2)", color: "#f472b6", labelPos: "tl" },
        { x: 6, y: -4, label: "B(6,−4)", color: "#fb923c", labelPos: "br" },
        { x: 1, y: -1, label: "M(?,?)", color: "#facc15", labelPos: "top" },
      ],
      segs: [{ x1: -4, y1: 2, x2: 6, y2: -4, color: "#60a5fa" }],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik tengah M dari AB." },
      { label: "b.", text: "Hitung jarak AM." },
      { label: "c.", text: "Verifikasi: apakah AM = MB?" },
    ],
  }),

  Qn(39, "Soal ANBK — Evaluasi Jarak", {
    type: "mixed",
    content: "Pernyataan tentang titik A(3, 4) dan B(−3, −4). Tentukan B (Benar) atau S (Salah):",
    parts: [
      { label: "(1)", math: "AB = 10" },
      { label: "(2)", text: "Jarak A ke sumbu-x = 4" },
      { label: "(3)", text: "Jarak B ke sumbu-y = 3" },
      { label: "(4)", text: "Jarak A ke titik O sama dengan jarak B ke titik O" },
      { label: "(5)", math: "OA = OB = 5" },
    ],
  }),

  Qn(40, "Soal UN — Konteks Jarak Tempuh", {
    type: "mixed",
    content: "Di peta skala koordinat (1 satuan = 100 meter):\nGedung A: (2, 3)\nGedung B: (8, 11)\nGedung C: (14, 3)",
    parts: [
      { label: "a.", math: "\\text{Hitung jarak } AB." },
      { label: "b.", math: "\\text{Hitung jarak } BC." },
      { label: "c.", math: "\\text{Hitung jarak } AC." },
      { label: "d.", text: "Hitung total jarak perjalanan A→B→C→A dalam meter." },
      { label: "e.", text: "Apakah segitiga ABC sama sisi? Jelaskan!" },
    ],
  }),
];

const JarakTitikGarisPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-teal-500/20 border-2 border-teal-400/60 flex items-center justify-center mb-3">
            <Ruler className="w-7 h-7 text-teal-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-teal-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(45,212,191,0.7)' }}>
            JARAK TITIK DAN JARAK TITIK KE GARIS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Koordinat Cartesius · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-lg px-4 py-2">
            <span className="text-teal-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-teal-900/20 border border-teal-500/20 rounded-xl p-4">
          <p className="text-teal-300 text-xs font-bold mb-3">📌 Rumus Jarak</p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Jarak 2 titik", math: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}" },
              { label: "Titik ke sumbu-x", math: "d = |y_0|" },
              { label: "Titik ke sumbu-y", math: "d = |x_0|" },
              { label: "Titik (x₀,y₀) ke garis y=k", math: "d = |y_0 - k|" },
              { label: "Titik (x₀,y₀) ke garis x=k", math: "d = |x_0 - k|" },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <span className="text-white/40 text-[10px] shrink-0 w-32">{r.label}</span>
                <div className="text-teal-200 text-sm"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-teal-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center shrink-0">
                    <span className="text-teal-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-teal-400 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded inline-block mb-2">
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
                            <span className="text-teal-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Koordinat Cartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default JarakTitikGarisPage;
