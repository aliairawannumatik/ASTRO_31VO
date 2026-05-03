import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  type: "essay" | "mixed";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Teorema Sudut Pusat = 2 × Sudut Keliling", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 160, label: "A", color: "#f472b6" },
        { angle: 20, label: "B", color: "#f472b6" },
        { angle: 270, label: "C", color: "#facc15" },
      ],
      radii: [{ angle: 160, color: "rgba(244,114,182,0.4)" }, { angle: 20, color: "rgba(244,114,182,0.4)" }],
      chords: [
        { angle1: 270, angle2: 160, color: "rgba(250,204,21,0.6)" },
        { angle1: 270, angle2: 20, color: "rgba(250,204,21,0.6)" },
      ],
      angleArcs: [
        { vertex: [120, 120], from: 20, to: 160, color: "#f472b6", label: "∠AOB", arcR: 30 },
        { vertex: [120, 192], from: 55, to: 125, color: "#facc15", label: "∠ACB", arcR: 22 },
      ],
      extraTexts: [{ x: 120, y: 18, text: "∠AOB = 2 × ∠ACB", color: "rgba(255,255,255,0.5)", size: 10, bold: true }],
    },
    parts: [
      { label: "Teorema:", math: "\\angle AOB = 2 \\times \\angle ACB" },
      { label: "a.", math: "\\text{Jika } \\angle AOB = 80°, \\text{ tentukan } \\angle ACB." },
      { label: "b.", math: "\\text{Jika } \\angle ACB = 35°, \\text{ tentukan } \\angle AOB." },
      { label: "c.", math: "\\text{Jika } \\angle ACB = 55°, \\text{ tentukan busur AB (dalam derajat).}" },
    ],
  }),

  Q(2, "Sudut Keliling Menghadap Diameter = 90°", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 180, label: "A", color: "#60a5fa" },
        { angle: 0, label: "B", color: "#60a5fa" },
        { angle: 100, label: "C", color: "#facc15" },
        { angle: 250, label: "D", color: "#34d399" },
      ],
      radii: [{ angle: 180, color: "rgba(96,165,250,0.4)", toEdge: true }],
      chords: [
        { angle1: 180, angle2: 100, color: "rgba(250,204,21,0.6)" },
        { angle1: 0, angle2: 100, color: "rgba(250,204,21,0.6)" },
        { angle1: 180, angle2: 250, color: "rgba(52,211,153,0.5)" },
        { angle1: 0, angle2: 250, color: "rgba(52,211,153,0.5)" },
      ],
      extraTexts: [{ x: 120, y: 18, text: "AB = diameter → ∠ACB = ∠ADB = 90°", color: "rgba(255,255,255,0.5)", size: 9, bold: true }],
    },
    parts: [
      { label: "b.", math: "\\text{Jika AB adalah diameter dan } \\angle CAB = 40°, \\text{ tentukan } \\angle ABC." },
      { label: "c.", math: "\\text{Jika AB adalah diameter dan } \\angle DAB = 30°, \\text{ tentukan } \\angle ABD." },
    ],
  }),

  Q(3, "Soal UN — Menentukan Sudut yang Belum Diketahui", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 145, label: "A", color: "#f472b6" },
        { angle: 35, label: "B", color: "#f472b6" },
        { angle: 270, label: "C", color: "#facc15" },
      ],
      radii: [{ angle: 145, color: "rgba(244,114,182,0.4)" }, { angle: 35, color: "rgba(244,114,182,0.4)" }],
      chords: [
        { angle1: 270, angle2: 145, color: "rgba(250,204,21,0.6)" },
        { angle1: 270, angle2: 35, color: "rgba(250,204,21,0.6)" },
      ],
      angleArcs: [{ vertex: [120, 192], from: 63, to: 118, color: "#facc15", label: "∠ACB = 55°", arcR: 22 }],
    },
    parts: [
      { label: "a.", math: "\\text{Tentukan } \\angle AOB." },
      { label: "b.", math: "\\text{Tentukan besar busur AB (derajat).}" },
      { label: "c.", math: "\\text{Tentukan besar busur mayor AB (derajat).}" },
    ],
  }),

  Q(4, "Sudut dalam Segitiga Berdasarkan Lingkaran", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 90, label: "A", color: "#60a5fa" },
        { angle: 210, label: "B", color: "#60a5fa" },
        { angle: 330, label: "C", color: "#60a5fa" },
      ],
      chords: [
        { angle1: 90, angle2: 210, color: "rgba(96,165,250,0.5)" },
        { angle1: 210, angle2: 330, color: "rgba(96,165,250,0.5)" },
        { angle1: 330, angle2: 90, color: "rgba(96,165,250,0.5)" },
      ],
      radii: [
        { angle: 90, color: "rgba(96,165,250,0.3)" },
        { angle: 210, color: "rgba(96,165,250,0.3)" },
        { angle: 330, color: "rgba(96,165,250,0.3)" },
      ],
    },
    content: "Segitiga ABC tertulis dalam lingkaran. Pusat lingkaran O.",
    parts: [
      { label: "a.", math: "\\text{Jika busur AB = busur BC = busur CA, berapakah } \\angle AOB?" },
      { label: "b.", math: "\\text{Berapakah } \\angle ACB \\text{ (sudut keliling menghadap busur AB)?}" },
      { label: "c.", text: "Segitiga ABC adalah segitiga apa? Jelaskan!" },
    ],
  }),

  Q(5, "Soal ANBK — Mencari Sudut x", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 160, label: "P", color: "#f472b6" },
        { angle: 20, label: "Q", color: "#f472b6" },
        { angle: 270, label: "R", color: "#facc15" },
      ],
      radii: [{ angle: 160, color: "rgba(244,114,182,0.4)" }, { angle: 20, color: "rgba(244,114,182,0.4)" }],
      chords: [
        { angle1: 270, angle2: 160, color: "rgba(250,204,21,0.6)" },
        { angle1: 270, angle2: 20, color: "rgba(250,204,21,0.6)" },
      ],
      angleArcs: [
        { vertex: [120, 120], from: 20, to: 160, color: "#f472b6", label: "4x", arcR: 28 },
        { vertex: [120, 192], from: 55, to: 125, color: "#facc15", label: "x+20°", arcR: 22 },
      ],
    },
    content: "Sudut pusat ∠POQ = 4x. Sudut keliling ∠PRQ = (x + 20°).",
    parts: [
      { label: "a.", math: "\\text{Gunakan teorema: } \\angle POQ = 2 \\times \\angle PRQ. \\text{ Buat persamaan.}" },
      { label: "b.", math: "\\text{Selesaikan persamaan untuk mendapatkan nilai } x." },
      { label: "c.", text: "Tentukan besar ∠POQ dan ∠PRQ." },
    ],
  }),

  Q(6, "Segi Empat Tali Busur (Cyclic Quadrilateral)", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 175, label: "B", color: "#fb923c" },
        { angle: 250, label: "C", color: "#34d399" },
        { angle: 10, label: "D", color: "#60a5fa" },
      ],
      chords: [
        { angle1: 90, angle2: 175, color: "rgba(255,255,255,0.3)" },
        { angle1: 175, angle2: 250, color: "rgba(255,255,255,0.3)" },
        { angle1: 250, angle2: 10, color: "rgba(255,255,255,0.3)" },
        { angle1: 10, angle2: 90, color: "rgba(255,255,255,0.3)" },
      ],
    },
    content: "ABCD adalah segi empat tali busur (semua titik pada lingkaran). Sifat: sudut yang berhadapan saling berpelurus.",
    parts: [
      { label: "a.", math: "\\angle A + \\angle C = 180°. \\text{ Jika } \\angle A = 110°, \\text{ tentukan } \\angle C." },
      { label: "b.", math: "\\angle B + \\angle D = 180°. \\text{ Jika } \\angle B = 75°, \\text{ tentukan } \\angle D." },
      { label: "c.", text: "Apakah persegi panjang selalu merupakan segi empat tali busur? Mengapa?" },
    ],
  }),

  Q(7, "Soal UN — Sudut Keliling Dua Titik", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 140, label: "A", color: "#f472b6" },
        { angle: 40, label: "B", color: "#f472b6" },
        { angle: 280, label: "C", color: "#facc15" },
        { angle: 320, label: "D", color: "#34d399" },
      ],
      chords: [
        { angle1: 280, angle2: 140, color: "rgba(250,204,21,0.5)" },
        { angle1: 280, angle2: 40, color: "rgba(250,204,21,0.5)" },
        { angle1: 320, angle2: 140, color: "rgba(52,211,153,0.5)" },
        { angle1: 320, angle2: 40, color: "rgba(52,211,153,0.5)" },
      ],
    },
    content: "∠ACB = 48°. Titik D pada busur yang sama (busur mayor AB).",
    parts: [
      { label: "a.", math: "\\text{Tentukan } \\angle ADB." },
      { label: "b.", text: "Jika titik E juga berada pada busur mayor AB, berapa besar ∠AEB?" },
      { label: "c.", text: "Apakah sudut keliling bergantung pada posisi titik (selama di busur yang sama)?" },
    ],
  }),

  Q(8, "Sudut Keliling Menghadap Diameter", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 180, label: "P", color: "#60a5fa" },
        { angle: 0, label: "Q", color: "#60a5fa" },
        { angle: 60, label: "R", color: "#facc15" },
        { angle: 130, label: "S", color: "#f472b6" },
      ],
      radii: [{ angle: 180, color: "rgba(96,165,250,0.4)", toEdge: true }],
      chords: [
        { angle1: 60, angle2: 180, color: "rgba(250,204,21,0.6)" },
        { angle1: 60, angle2: 0, color: "rgba(250,204,21,0.6)" },
        { angle1: 130, angle2: 180, color: "rgba(244,114,182,0.5)" },
        { angle1: 130, angle2: 0, color: "rgba(244,114,182,0.5)" },
      ],
      extraTexts: [{ x: 120, y: 18, text: "PQ = diameter", color: "rgba(96,165,250,0.6)", size: 9, bold: true }],
    },
    parts: [
      { label: "a.", math: "\\text{Tentukan } \\angle PRQ \\text{ dan } \\angle PSQ." },
      { label: "b.", math: "\\text{Jika } \\angle QPR = 35°, \\text{ tentukan } \\angle PQR \\text{ dalam segitiga PRQ.}" },
      { label: "c.", math: "\\text{Jika } \\angle QPS = 50°, \\text{ tentukan } \\angle QSP \\text{ dalam segitiga PQS.}" },
    ],
  }),

  Q(9, "Soal UN — Sudut Tembereng", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 150, label: "A", color: "#f472b6" },
        { angle: 30, label: "B", color: "#f472b6" },
        { angle: 270, label: "C", color: "#facc15" },
      ],
      chords: [
        { angle1: 150, angle2: 30, color: "#a78bfa", label: "AB" },
        { angle1: 270, angle2: 150, color: "rgba(250,204,21,0.5)" },
        { angle1: 270, angle2: 30, color: "rgba(250,204,21,0.5)" },
      ],
      angleArcs: [{ vertex: [120, 192], from: 60, to: 120, color: "#facc15", label: "∠ACB = 40°", arcR: 22 }],
    },
    content: "∠ACB = 40°.",
    parts: [
      { label: "a.", math: "\\text{Tentukan } \\angle AOB \\text{ (sudut pusat).}" },
      { label: "b.", math: "\\text{Tentukan busur AB (derajat).}" },
      { label: "c.", text: "Tentukan sudut ∠ADB jika D berada pada busur yang sama dengan C (busur mayor AB)." },
    ],
  }),

  Q(10, "Soal ANBK — Mencari Semua Sudut", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 210, label: "B", color: "#fb923c" },
        { angle: 330, label: "C", color: "#34d399" },
        { angle: 270, label: "D", color: "#60a5fa" },
      ],
      chords: [
        { angle1: 90, angle2: 210, color: "rgba(255,255,255,0.3)" },
        { angle1: 210, angle2: 330, color: "rgba(255,255,255,0.3)" },
        { angle1: 330, angle2: 90, color: "rgba(255,255,255,0.3)" },
        { angle1: 270, angle2: 90, color: "rgba(96,165,250,0.4)" },
        { angle1: 270, angle2: 330, color: "rgba(96,165,250,0.4)" },
      ],
      radii: [
        { angle: 90, color: "rgba(244,114,182,0.3)" },
        { angle: 210, color: "rgba(251,146,60,0.3)" },
        { angle: 330, color: "rgba(52,211,153,0.3)" },
      ],
    },
    content: "A, B, C, D pada lingkaran. ∠AOB = ∠BOC = ∠COA = 120° (segitiga sama sisi). D di busur mayor AB.",
    parts: [
      { label: "a.", math: "\\text{Tentukan } \\angle ACB \\text{ (sudut keliling menghadap busur AB = 120°).}" },
      { label: "b.", math: "\\text{Tentukan } \\angle ADB \\text{ jika D di busur yang berbeda.}" },
      { label: "c.", text: "Tentukan besar sudut-sudut dalam segitiga ABC." },
    ],
  }),

  Q(11, "Soal UN — Segi Empat Tali Busur", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 80, label: "W", color: "#f472b6" },
        { angle: 170, label: "X", color: "#fb923c" },
        { angle: 255, label: "Y", color: "#34d399" },
        { angle: 350, label: "Z", color: "#60a5fa" },
      ],
      chords: [
        { angle1: 80, angle2: 170, color: "rgba(255,255,255,0.3)" },
        { angle1: 170, angle2: 255, color: "rgba(255,255,255,0.3)" },
        { angle1: 255, angle2: 350, color: "rgba(255,255,255,0.3)" },
        { angle1: 350, angle2: 80, color: "rgba(255,255,255,0.3)" },
      ],
      extraTexts: [{ x: 120, y: 18, text: "∠W + ∠Y = 180°, ∠X + ∠Z = 180°", color: "rgba(255,255,255,0.4)", size: 9 }],
    },
    content: "WXYZ adalah segi empat tali busur. ∠W = 75° dan ∠X = 110°.",
    parts: [
      { label: "a.", math: "\\text{Tentukan } \\angle Y." },
      { label: "b.", math: "\\text{Tentukan } \\angle Z." },
      { label: "c.", text: "Apakah ∠W + ∠X + ∠Y + ∠Z = 360°? Verifikasi!" },
    ],
  }),

  Q(12, "Soal ANBK — Benar atau Salah", {
    type: "essay",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S)!",
    parts: [
      { label: "(1)", text: "Sudut pusat = 2 × sudut keliling yang menghadap busur yang sama. (B/S)" },
      { label: "(2)", text: "Semua sudut keliling yang menghadap busur yang sama memiliki besar yang sama. (B/S)" },
      { label: "(3)", text: "Sudut keliling yang menghadap diameter selalu 90°. (B/S)" },
      { label: "(4)", text: "Dalam segi empat tali busur, semua sudut besarnya 90°. (B/S)" },
    ],
  }),

  Q(13, "Mencari Sudut dengan Sifat Segitiga Sama Kaki", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 210, label: "B", color: "#f472b6" },
        { angle: 300, label: "C", color: "#facc15" },
      ],
      radii: [{ angle: 90, color: "rgba(244,114,182,0.4)" }, { angle: 210, color: "rgba(244,114,182,0.4)" }],
      chords: [
        { angle1: 90, angle2: 300, color: "rgba(250,204,21,0.5)" },
        { angle1: 210, angle2: 300, color: "rgba(250,204,21,0.5)" },
        { angle1: 90, angle2: 210, color: "rgba(244,114,182,0.3)" },
      ],
    },
    content: "OA = OB = OC = r (jari-jari). Maka OAC, OBC adalah segitiga sama kaki.",
    parts: [
      { label: "a.", math: "\\text{Jika } \\angle AOB = 120°, \\text{ tentukan } \\angle ACB." },
      { label: "b.", math: "\\text{Jika } \\angle OCA = 20°, \\text{ tentukan } \\angle OAC \\text{ (segitiga OAC sama kaki).}" },
      { label: "c.", math: "\\text{Tentukan } \\angle AOC." },
    ],
  }),

  Q(14, "Soal UN — Sudut Keliling Tiga Titik", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 120, label: "P", color: "#f472b6" },
        { angle: 0, label: "Q", color: "#f472b6" },
        { angle: 240, label: "R", color: "#facc15" },
        { angle: 300, label: "S", color: "#34d399" },
      ],
      radii: [{ angle: 120, color: "rgba(244,114,182,0.3)" }, { angle: 0, color: "rgba(244,114,182,0.3)" }],
      chords: [
        { angle1: 240, angle2: 120, color: "rgba(250,204,21,0.5)" },
        { angle1: 240, angle2: 0, color: "rgba(250,204,21,0.5)" },
        { angle1: 300, angle2: 120, color: "rgba(52,211,153,0.4)" },
        { angle1: 300, angle2: 0, color: "rgba(52,211,153,0.4)" },
      ],
    },
    content: "∠PRQ = 65°, S juga pada busur yang sama dengan R (busur mayor PQ).",
    parts: [
      { label: "a.", math: "\\text{Tentukan } \\angle PSQ." },
      { label: "b.", math: "\\text{Tentukan sudut pusat } \\angle POQ." },
      { label: "c.", text: "Berapa sudut keliling yang berbeda posisi, tetapi besarnya tetap sama menghadap busur PQ?" },
    ],
  }),

  Q(15, "Soal ANBK Gabungan — Sudut Pusat dan Keliling", {
    type: "mixed",
    diagram: {
      size: 240, r: 0.6,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 210, label: "B", color: "#fb923c" },
        { angle: 330, label: "C", color: "#34d399" },
        { angle: 270, label: "D", color: "#60a5fa" },
        { angle: 0, label: "E", color: "#a78bfa" },
      ],
      radii: [
        { angle: 90, color: "rgba(244,114,182,0.3)" },
        { angle: 210, color: "rgba(251,146,60,0.3)" },
        { angle: 330, color: "rgba(52,211,153,0.3)" },
      ],
      chords: [
        { angle1: 90, angle2: 210, color: "rgba(255,255,255,0.25)" },
        { angle1: 210, angle2: 330, color: "rgba(255,255,255,0.25)" },
        { angle1: 330, angle2: 90, color: "rgba(255,255,255,0.25)" },
        { angle1: 270, angle2: 90, color: "rgba(96,165,250,0.4)" },
        { angle1: 270, angle2: 210, color: "rgba(96,165,250,0.4)" },
      ],
    },
    content: "∠AOB = ∠BOC = ∠COA = 120°. D ada di busur mayor AB.",
    parts: [
      { label: "a.", math: "\\text{Tentukan sudut keliling } \\angle ACB." },
      { label: "b.", math: "\\text{Tentukan sudut keliling } \\angle ADB \\text{ (D di busur mayor AB).}" },
      { label: "c.", text: "Berapa besar ∠ACB + ∠ADB? Apa yang bisa disimpulkan?" },
      { label: "d.", math: "\\text{Jika E di busur yang sama dengan C, apakah } \\angle AEB = \\angle ACB?" },
    ],
  }),
];

const SudutPusatKelilingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            SUDUT PUSAT DAN SUDUT KELILING
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 15 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-3">📐 Teorema Sudut Pusat & Keliling</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <BlockMath math="\angle \text{Pusat} = 2 \times \angle \text{Keliling} \text{ (busur sama)}" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-body">
              {[
                { n: "∠ keliling di busur sama", d: "Besar sudutnya sama", c: "text-cyan-400" },
                { n: "∠ keliling pada diameter", d: "Selalu = 90°", c: "text-yellow-400" },
                { n: "Segi-4 tali busur", d: "∠ berhadapan = 180°", c: "text-pink-400" },
                { n: "Sudut busur minor", d: "180° − sudut keliling normal", c: "text-green-400" },
              ].map(r => (
                <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                  <span className={`font-bold ${r.c}`}>{r.n}: </span>
                  <span className="text-white/60">{r.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[36px]">{p.label}</span>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default SudutPusatKelilingPage;
