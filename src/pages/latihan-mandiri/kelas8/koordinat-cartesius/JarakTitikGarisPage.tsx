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

  Qn(12, "Luas Segitiga dari Koordinat", {
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

  Qn(13, "Jarak dalam Konteks Nyata", {
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

  Qn(14, "Jarak Titik ke Garis — Lanjutan", {
    type: "mixed",
    content: "Hitung jarak dari titik ke garis yang diberikan:",
    parts: [
      { label: "a.", math: "A(3,\\ 7) \\text{ ke garis } y = 3" },
      { label: "b.", math: "B(-2,\\ -5) \\text{ ke garis } y = 1" },
      { label: "c.", math: "C(4,\\ 2) \\text{ ke garis } x = -2" },
      { label: "d.", math: "D(-6,\\ 3) \\text{ ke garis } x = 1" },
    ],
  }),

  Qn(15, "Titik Equidistant dari Dua Garis", {
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

  Qn(16, "Persegi Panjang — Diagonal", {
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

  Qn(17, "Luas Segitiga — Koordinat Beragam", {
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

  Qn(18, "Keliling Segi Empat dari Koordinat", {
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

  Qn(19, "Jarak dalam Segitiga Siku-siku", {
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
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Koordinat Kartesius · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-lg px-4 py-2">
            <span className="text-teal-400 text-xs font-bold">📋 19 Soal</span>
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
            ← Kembali ke Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default JarakTitikGarisPage;
