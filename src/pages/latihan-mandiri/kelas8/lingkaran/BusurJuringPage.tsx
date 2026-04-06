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
  Q(1, "Rumus Panjang Busur", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.6,
      pts: [{ angle: 130, label: "A", color: "#facc15" }, { angle: 50, label: "B", color: "#facc15" }],
      radii: [{ angle: 130, color: "rgba(250,204,21,0.5)" }, { angle: 50, color: "rgba(250,204,21,0.5)" }],
      arcs: [{ startAngle: 130, endAngle: 50, color: "#facc15", width: 4 }],
      angleArcs: [{ vertex: [115, 115], from: 50, to: 130, color: "#facc15", label: "α", arcR: 28 }],
    },
    content: "Panjang busur AB dengan sudut pusat α dan jari-jari r:",
    parts: [
      { label: "Rumus:", math: "\\text{Busur AB} = \\frac{\\alpha}{360°} \\times 2\\pi r" },
      { label: "a.", math: "\\text{Hitung panjang busur AB jika } \\alpha = 90°, r = 14 \\text{ cm}." },
      { label: "b.", math: "\\text{Hitung panjang busur jika } \\alpha = 60°, r = 21 \\text{ cm}." },
      { label: "c.", math: "\\text{Hitung panjang busur jika } \\alpha = 120°, r = 7 \\text{ cm}." },
    ],
  }),

  Q(2, "Rumus Luas Juring", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.6,
      sectors: [{ startAngle: 50, endAngle: 130, fillColor: "rgba(167,139,250,0.25)", strokeColor: "#a78bfa", label: "Juring OAB" }],
      radii: [{ angle: 50, color: "#a78bfa" }, { angle: 130, color: "#a78bfa" }],
      pts: [{ angle: 50, label: "B", color: "#a78bfa" }, { angle: 130, label: "A", color: "#a78bfa" }],
    },
    content: "Luas juring OAB dengan sudut pusat α dan jari-jari r:",
    parts: [
      { label: "Rumus:", math: "\\text{Luas Juring} = \\frac{\\alpha}{360°} \\times \\pi r^2" },
      { label: "a.", math: "\\text{Hitung luas juring jika } \\alpha = 90°, r = 14 \\text{ cm}." },
      { label: "b.", math: "\\text{Hitung luas juring jika } \\alpha = 60°, r = 21 \\text{ cm}." },
      { label: "c.", math: "\\text{Hitung luas juring jika } \\alpha = 120°, r = 7 \\text{ cm}." },
    ],
  }),

  Q(3, "Mencari Sudut dari Panjang Busur", {
    type: "essay",
    content: "Tentukan besar sudut pusat jika diketahui panjang busur dan jari-jarinya!",
    parts: [
      { label: "a.", math: "\\text{Busur} = 22 \\text{ cm}, r = 21 \\text{ cm}" },
      { label: "b.", math: "\\text{Busur} = 44 \\text{ cm}, r = 42 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur} = 11 \\text{ cm}, r = 21 \\text{ cm}" },
    ],
  }),

  Q(4, "Mencari Jari-Jari dari Panjang Busur", {
    type: "essay",
    content: "Tentukan jari-jari lingkaran jika diketahui panjang busur dan sudut pusatnya!",
    parts: [
      { label: "a.", math: "\\text{Busur} = 22 \\text{ cm}, \\alpha = 60°" },
      { label: "b.", math: "\\text{Busur} = 44 \\text{ cm}, \\alpha = 120°" },
      { label: "c.", math: "\\text{Busur} = 33 \\text{ cm}, \\alpha = 90°" },
    ],
  }),

  Q(5, "Mencari Sudut dari Luas Juring", {
    type: "essay",
    content: "Tentukan besar sudut pusat jika diketahui luas juring dan jari-jarinya!",
    parts: [
      { label: "a.", math: "L_{juring} = 154 \\text{ cm}^2, r = 14 \\text{ cm}" },
      { label: "b.", math: "L_{juring} = 77 \\text{ cm}^2, r = 21 \\text{ cm}" },
      { label: "c.", math: "L_{juring} = 231 \\text{ cm}^2, r = 21 \\text{ cm}" },
    ],
  }),

  Q(6, "Soal UN — Panjang Busur Langsung", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.6,
      pts: [{ angle: 150, label: "P", color: "#f472b6" }, { angle: 30, label: "Q", color: "#f472b6" }],
      radii: [{ angle: 150, color: "rgba(244,114,182,0.4)" }, { angle: 30, color: "rgba(244,114,182,0.4)" }],
      arcs: [{ startAngle: 150, endAngle: 30, color: "#f472b6", width: 4 }],
      angleArcs: [{ vertex: [115, 115], from: 30, to: 150, color: "#f472b6", label: "120°", arcR: 28 }],
    },
    content: "Lingkaran berjari-jari 21 cm. Sudut pusat ∠POQ = 120°.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang busur PQ. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", math: "\\text{Hitung luas juring OPQ.}" },
      { label: "c.", text: "Hitung panjang busur mayor PQ (sisa keliling)." },
    ],
  }),

  Q(7, "Soal ANBK — Juring Berbeda Sudut", {
    type: "essay",
    content: "Lingkaran r = 14 cm dengan tiga juring OAB, OBC, OCA dengan sudut masing-masing 60°, 80°, 220°.",
    parts: [
      { label: "a.", text: "Verifikasi: 60° + 80° + 220° = 360°." },
      { label: "b.", math: "\\text{Hitung luas juring OAB (sudut 60°).}" },
      { label: "c.", math: "\\text{Hitung luas juring OCA (sudut 220°).}" },
    ],
  }),

  Q(8, "Perbandingan Panjang Busur", {
    type: "essay",
    content: "Lingkaran dengan sudut pusat ∠AOB = 2∠COD. Jari-jari sama besar.",
    parts: [
      { label: "a.", text: "Berapakah perbandingan panjang busur AB : busur CD?" },
      { label: "b.", text: "Berapakah perbandingan luas juring AOB : juring COD?" },
      { label: "c.", math: "\\text{Jika busur CD} = 11 \\text{ cm, berapakah busur AB?}" },
    ],
  }),

  Q(9, "Soal TKA — Jam dan Busur", {
    type: "essay",
    content: "Jarum menit jam panjangnya 21 cm. Dari pukul 12.00 ke pukul 03.00.",
    parts: [
      { label: "a.", text: "Tentukan sudut yang ditempuh jarum menit." },
      { label: "b.", math: "\\text{Hitung panjang busur yang dilalui ujung jarum menit.}" },
      { label: "c.", math: "\\text{Hitung luas juring yang disapu jarum menit.}" },
    ],
  }),

  Q(10, "Luas Juring dari Konteks", {
    type: "essay",
    content: "Sebuah kipas angin berputar membentuk juring dengan sudut 210° dan jari-jari baling-baling 35 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang busur yang dibentuk.}" },
      { label: "b.", math: "\\text{Hitung luas juring yang disapu.}" },
      { label: "c.", text: "Sisanya (sisa lingkaran) membentuk juring sudut berapa derajat?" },
    ],
  }),

  Q(11, "Busur Minor dan Mayor", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.6,
      pts: [{ angle: 100, label: "A", color: "#34d399" }, { angle: 350, label: "B", color: "#34d399" }],
      radii: [{ angle: 100, color: "rgba(52,211,153,0.4)" }, { angle: 350, color: "rgba(52,211,153,0.4)" }],
      arcs: [
        { startAngle: 100, endAngle: 350, color: "#34d399", width: 4 },
        { startAngle: 350, endAngle: 100, color: "rgba(52,211,153,0.3)", width: 2 },
      ],
      angleArcs: [{ vertex: [115, 115], from: 350, to: 100, color: "#34d399", label: "110°", arcR: 28 }],
    },
    content: "Sudut pusat ∠AOB = 110°, r = 14 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang busur minor AB (sudut 110°).}" },
      { label: "b.", math: "\\text{Hitung panjang busur mayor AB (sudut 250°).}" },
      { label: "c.", text: "Berapakah jumlah busur minor dan mayor?" },
    ],
  }),

  Q(12, "Soal UN — Menentukan Sudut", {
    type: "essay",
    content: "Panjang busur AB = 66 cm. Jari-jari lingkaran = 63 cm.",
    parts: [
      { label: "a.", math: "\\text{Tentukan sudut pusat } \\angle AOB. \\text{ (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", math: "\\text{Hitung luas juring AOB.}" },
      { label: "c.", text: "Jika sudut pusat diperbesar menjadi 2 kali, berapakah panjang busur yang baru?" },
    ],
  }),

  Q(13, "Luas Juring Terbagi", {
    type: "essay",
    content: "Lingkaran r = 21 cm dibagi menjadi 3 juring dengan perbandingan sudut 1 : 2 : 3.",
    parts: [
      { label: "a.", text: "Tentukan besar masing-masing sudut pusat." },
      { label: "b.", math: "\\text{Hitung luas juring terkecil.}" },
      { label: "c.", math: "\\text{Hitung luas juring terbesar.}" },
    ],
  }),

  Q(14, "Soal ANBK — Busur pada Koordinat", {
    type: "essay",
    content: "Lingkaran dengan pusat O(0,0) dan jari-jari 14 cm. Titik A berada di (14, 0) dan titik B di (0, 14).",
    parts: [
      { label: "a.", text: "Tentukan besar sudut ∠AOB." },
      { label: "b.", math: "\\text{Hitung panjang busur AB (seperempat lingkaran).}" },
      { label: "c.", math: "\\text{Hitung luas juring AOB.}" },
    ],
  }),

  Q(15, "Perbandingan Luas Juring", {
    type: "essay",
    content: "Dua juring dari lingkaran yang sama (r = 21 cm). Juring pertama sudut 90°, juring kedua sudut 180°.",
    parts: [
      { label: "a.", text: "Berapakah perbandingan sudut pusat kedua juring?" },
      { label: "b.", text: "Berapakah perbandingan luas kedua juring?" },
      { label: "c.", math: "\\text{Hitung selisih luas dua juring tersebut.}" },
    ],
  }),

  Q(16, "Soal TKA — Potongan Kue", {
    type: "essay",
    content: "Kue berbentuk lingkaran berjari-jari 21 cm dipotong menjadi 8 bagian sama besar.",
    parts: [
      { label: "a.", text: "Berapakah sudut pusat setiap potongan kue?" },
      { label: "b.", math: "\\text{Hitung panjang busur (sisi melengkung) setiap potongan.}" },
      { label: "c.", math: "\\text{Hitung luas setiap potongan kue.}" },
    ],
  }),

  Q(17, "Mencari Jari-Jari dari Luas Juring", {
    type: "essay",
    content: "Tentukan jari-jari lingkaran jika diketahui luas juring dan sudut pusatnya!",
    parts: [
      { label: "a.", math: "L_{juring} = 154 \\text{ cm}^2, \\alpha = 90°" },
      { label: "b.", math: "L_{juring} = 231 \\text{ cm}^2, \\alpha = 60°" },
      { label: "c.", math: "L_{juring} = 616 \\text{ cm}^2, \\alpha = 120°" },
    ],
  }),

  Q(18, "Soal UN — Busur dan Keliling", {
    type: "essay",
    content: "Sebuah lingkaran memiliki keliling 132 cm. Busur AB = 44 cm.",
    parts: [
      { label: "a.", math: "\\text{Tentukan jari-jari lingkaran. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", math: "\\text{Tentukan sudut pusat } \\angle AOB \\text{ dari busur AB.}" },
      { label: "c.", math: "\\text{Hitung luas juring AOB.}" },
    ],
  }),

  Q(19, "Soal ANBK — Bangun dari Juring", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.65,
      sectors: [
        { startAngle: 0, endAngle: 72, fillColor: "rgba(248,113,163,0.25)", strokeColor: "#f472b6" },
        { startAngle: 72, endAngle: 144, fillColor: "rgba(250,204,21,0.2)", strokeColor: "#facc15" },
        { startAngle: 144, endAngle: 216, fillColor: "rgba(52,211,153,0.2)", strokeColor: "#34d399" },
        { startAngle: 216, endAngle: 288, fillColor: "rgba(96,165,250,0.2)", strokeColor: "#60a5fa" },
        { startAngle: 288, endAngle: 360, fillColor: "rgba(167,139,250,0.2)", strokeColor: "#a78bfa" },
      ],
    },
    content: "Lingkaran r = 7 cm dibagi menjadi 5 juring sama besar.",
    parts: [
      { label: "a.", text: "Berapakah sudut pusat setiap juring?" },
      { label: "b.", math: "\\text{Hitung luas setiap juring.}" },
      { label: "c.", math: "\\text{Hitung panjang busur setiap juring.}" },
    ],
  }),

  Q(20, "Panjang Busur Gabungan", {
    type: "essay",
    content: "Lingkaran r = 14 cm. Tiga busur dengan sudut 60°, 90°, dan 120° diketahui.",
    parts: [
      { label: "a.", text: "Berapa total sudut ketiga busur?" },
      { label: "b.", math: "\\text{Hitung total panjang ketiga busur.}" },
      { label: "c.", math: "\\text{Sisa busur (busur ke-4) memiliki sudut berapa derajat?}" },
    ],
  }),

  Q(21, "Soal UN — Luas Juring dan Busur", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.6,
      sectors: [{ startAngle: 30, endAngle: 150, fillColor: "rgba(250,204,21,0.22)", strokeColor: "#facc15", label: "Juring" }],
      radii: [{ angle: 30, color: "#facc15" }, { angle: 150, color: "#facc15" }],
      pts: [{ angle: 30, label: "B", color: "#facc15" }, { angle: 150, label: "A", color: "#facc15" }],
      angleArcs: [{ vertex: [115, 115], from: 30, to: 150, color: "#facc15", label: "120°", arcR: 28 }],
    },
    content: "r = 21 cm, sudut pusat = 120°.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang busur AB.}" },
      { label: "b.", math: "\\text{Hitung luas juring OAB.}" },
      { label: "c.", math: "\\text{Hitung keliling juring OAB (busur + 2 jari-jari).}" },
    ],
  }),

  Q(22, "Soal ANBK — Nilai yang Tidak Diketahui", {
    type: "essay",
    content: "Tentukan nilai yang belum diketahui pada setiap juring berikut! (π = 22/7)",
    parts: [
      { label: "a.", math: "\\text{Busur} = 33 \\text{ cm}, r = 63 \\text{ cm}. \\text{ Cari } \\alpha." },
      { label: "b.", math: "L_{juring} = 462 \\text{ cm}^2, r = 21 \\text{ cm}. \\text{ Cari } \\alpha." },
      { label: "c.", math: "\\text{Busur} = 44 \\text{ cm}, \\alpha = 120°. \\text{ Cari } r." },
    ],
  }),

  Q(23, "Perbandingan Busur dalam Satu Lingkaran", {
    type: "essay",
    content: "Dalam satu lingkaran, busur AB : busur BC : busur CA = 2 : 3 : 7.",
    parts: [
      { label: "a.", text: "Tentukan besar sudut pusat ∠AOB, ∠BOC, dan ∠COA." },
      { label: "b.", math: "\\text{Jika } r = 21 \\text{ cm, hitung panjang busur AB.}" },
      { label: "c.", math: "\\text{Hitung luas juring OCA (sudut terbesar).}" },
    ],
  }),

  Q(24, "Juring dan Luas Total", {
    type: "essay",
    content: "Lingkaran r = 14 cm. Terdapat juring OAB dengan sudut 72°.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas juring OAB.}" },
      { label: "b.", text: "Sisa lingkaran (di luar juring) disebut apa? Berapa sudutnya?" },
      { label: "c.", math: "\\text{Hitung luas sisa lingkaran.}" },
    ],
  }),

  Q(25, "Soal TKA — Radar/Sonar", {
    type: "essay",
    content: "Radar kapal berputar dengan kecepatan sudut 30° per detik. Jangkauan radar 12 km.",
    parts: [
      { label: "a.", math: "\\text{Dalam 1 detik, berapa km² area yang disapu radar?}" },
      { label: "b.", math: "\\text{Dalam 6 detik (180°), berapa km² area total?}" },
      { label: "c.", text: "Berapa detik untuk radar melakukan 1 putaran penuh (360°)?" },
    ],
  }),

  Q(26, "Soal UN — Busur dan Juring Bersamaan", {
    type: "essay",
    content: "Lingkaran berjari-jari r = 7 cm dengan juring sudut 144°.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang busur juring (sudut 144°). (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", math: "\\text{Hitung luas juring.}" },
      { label: "c.", math: "\\text{Hitung keliling juring (busur + 2r).}" },
    ],
  }),

  Q(27, "Soal ANBK — Membandingkan Juring", {
    type: "essay",
    content: "Dua lingkaran dengan r₁ = 7 cm (α = 60°) dan r₂ = 14 cm (α = 30°).",
    parts: [
      { label: "a.", math: "\\text{Hitung luas juring pertama.}" },
      { label: "b.", math: "\\text{Hitung luas juring kedua.}" },
      { label: "c.", text: "Apakah luas juring pertama sama dengan luas juring kedua? Mengapa?" },
    ],
  }),

  Q(28, "Keliling Juring", {
    type: "essay",
    content: "Hitung keliling setiap juring berikut (busur + 2 jari-jari)!",
    parts: [
      { label: "a.", math: "r = 21 \\text{ cm}, \\alpha = 60°" },
      { label: "b.", math: "r = 14 \\text{ cm}, \\alpha = 90°" },
      { label: "c.", math: "r = 7 \\text{ cm}, \\alpha = 180°" },
    ],
  }),

  Q(29, "Soal TKA — Windshield Wiper", {
    type: "essay",
    content: "Wiper kaca mobil berbentuk juring dengan jari-jari dalam (r₁ = 20 cm) dan jari-jari luar (r₂ = 55 cm). Sudut sapuan = 110°.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas juring besar } (r_2 = 55 \\text{ cm, } \\alpha = 110°)." },
      { label: "b.", math: "\\text{Hitung luas juring kecil } (r_1 = 20 \\text{ cm, } \\alpha = 110°)." },
      { label: "c.", text: "Hitung luas area kaca yang disapu wiper (selisih dua juring)." },
    ],
  }),

  Q(30, "Luas Tembereng — Langkah demi Langkah", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.6,
      pts: [{ angle: 120, label: "A", color: "#60a5fa" }, { angle: 60, label: "B", color: "#60a5fa" }],
      chords: [{ angle1: 120, angle2: 60, color: "#60a5fa" }],
      sectors: [{ startAngle: 60, endAngle: 120, fillColor: "rgba(96,165,250,0.2)", strokeColor: "none" }],
      radii: [{ angle: 120, color: "rgba(96,165,250,0.4)" }, { angle: 60, color: "rgba(96,165,250,0.4)" }],
      arcs: [{ startAngle: 120, endAngle: 60, color: "#60a5fa", width: 3 }],
      angleArcs: [{ vertex: [115, 115], from: 60, to: 120, color: "#60a5fa", label: "60°", arcR: 28 }],
    },
    content: "r = 14 cm, ∠AOB = 60°. (Karena ∠AOB = 60° dan OA = OB = r, segitiga OAB sama sisi.)",
    parts: [
      { label: "a.", math: "\\text{Hitung luas juring OAB.}" },
      { label: "b.", math: "\\text{Luas segitiga OAB} = \\frac{\\sqrt{3}}{4} \\times r^2. \\text{ Hitung.}" },
      { label: "c.", text: "Hitung luas tembereng AB = luas juring − luas segitiga." },
    ],
  }),

  Q(31, "Soal UN — Hubungan Busur dan Luas Juring", {
    type: "essay",
    content: "Sebuah juring memiliki panjang busur = 22 cm dan jari-jari = 21 cm.",
    parts: [
      { label: "a.", math: "\\text{Cari sudut pusat dari panjang busur. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", math: "\\text{Hitung luas juring.}" },
      { label: "c.", math: "\\text{Alternatif: Luas Juring} = \\frac{1}{2} \\times r \\times \\text{busur}. \\text{ Verifikasi hasilnya.}" },
    ],
  }),

  Q(32, "Busur dengan Satuan Berbeda", {
    type: "essay",
    content: "Lingkaran dengan diameter 2,8 m. Sudut pusat 72°.",
    parts: [
      { label: "a.", math: "\\text{Ubah diameter ke cm. Hitung jari-jari.}" },
      { label: "b.", math: "\\text{Hitung panjang busur dalam cm.}" },
      { label: "c.", text: "Ubah panjang busur ke meter." },
    ],
  }),

  Q(33, "Soal ANBK — Benar atau Salah", {
    type: "essay",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S)!",
    parts: [
      { label: "(1)", math: "\\text{Busur} = \\frac{\\alpha}{360°} \\times 2\\pi r \\Rightarrow \\text{ jika } \\alpha = 180°, \\text{ busur} = \\pi r. \\quad (B/S)" },
      { label: "(2)", text: "Jika sudut pusat diperbesar 2 kali, luas juring menjadi 4 kali semula. (B/S)" },
      { label: "(3)", text: "Busur minor + busur mayor = keliling lingkaran. (B/S)" },
      { label: "(4)", text: "Juring dengan sudut 90° = ¼ luas lingkaran. (B/S)" },
    ],
  }),

  Q(34, "Soal TKA — Diagram Pie", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.65,
      sectors: [
        { startAngle: 0, endAngle: 126, fillColor: "rgba(96,165,250,0.25)", strokeColor: "#60a5fa", label: "35%" },
        { startAngle: 126, endAngle: 234, fillColor: "rgba(248,113,163,0.25)", strokeColor: "#f472b6", label: "30%" },
        { startAngle: 234, endAngle: 306, fillColor: "rgba(52,211,153,0.25)", strokeColor: "#34d399", label: "20%" },
        { startAngle: 306, endAngle: 360, fillColor: "rgba(250,204,21,0.25)", strokeColor: "#facc15", label: "15%" },
      ],
    },
    content: "Diagram pie anggaran kota: Pendidikan 35%, Kesehatan 30%, Infrastruktur 20%, Lainnya 15%. Total anggaran r-lingkaran = 14 cm.",
    parts: [
      { label: "a.", text: "Berapa sudut pusat juring Pendidikan?" },
      { label: "b.", math: "\\text{Hitung luas juring Pendidikan.}" },
      { label: "c.", text: "Juring mana yang memiliki busur terpanjang?" },
    ],
  }),

  Q(35, "Soal UN — Menentukan Keliling Juring", {
    type: "essay",
    content: "Juring dengan sudut 120° dan keliling juring = 88 cm.",
    parts: [
      { label: "a.", math: "\\text{Misalkan busur} = b \\text{ dan } r \\text{ adalah jari-jari. Tuliskan persamaan keliling juring: } b + 2r = 88." },
      { label: "b.", math: "\\text{Karena } b = \\frac{120°}{360°} \\times 2\\pi r = \\frac{2\\pi r}{3}, \\text{ subtitusikan ke persamaan untuk mencari } r." },
      { label: "c.", math: "\\text{Setelah mendapat } r, \\text{ hitung luas juring.}" },
    ],
  }),

  Q(36, "Soal ANBK — Luas Daerah Kompleks", {
    type: "essay",
    content: "Dua juring OAB dan OCD dari dua lingkaran yang berbeda dengan r₁ = 14 cm (α₁ = 90°) dan r₂ = 7 cm (α₂ = 180°).",
    parts: [
      { label: "a.", math: "\\text{Hitung luas juring OAB.}" },
      { label: "b.", math: "\\text{Hitung luas juring OCD.}" },
      { label: "c.", text: "Manakah yang lebih luas? Berapa selisihnya?" },
    ],
  }),

  Q(37, "Soal TKA — Baling-Baling Kapal", {
    type: "essay",
    content: "Baling-baling kapal berbentuk 4 juring sama besar dengan r = 35 cm.",
    parts: [
      { label: "a.", text: "Berapakah sudut setiap juring?" },
      { label: "b.", math: "\\text{Hitung panjang busur setiap baling-baling.}" },
      { label: "c.", math: "\\text{Hitung luas setiap baling-baling (juring).}" },
    ],
  }),

  Q(38, "Luas Juring dengan Rumus Alternatif", {
    type: "essay",
    content: "Rumus alternatif luas juring: L = ½ × r × busur.",
    parts: [
      { label: "a.", math: "\\text{Verifikasi: apakah } \\frac{\\alpha}{360°} \\times \\pi r^2 = \\frac{1}{2} \\times r \\times \\frac{\\alpha}{360°} \\times 2\\pi r?" },
      { label: "b.", math: "\\text{Gunakan rumus alternatif: jika busur} = 22 \\text{ cm dan } r = 21 \\text{ cm, hitung luas juring.}" },
      { label: "c.", text: "Kapan rumus alternatif lebih mudah digunakan?" },
    ],
  }),

  Q(39, "Soal UN — Menentukan Panjang Busur dari Luas", {
    type: "essay",
    content: "Juring OAB memiliki luas 462 cm² dan jari-jari 21 cm.",
    parts: [
      { label: "a.", math: "\\text{Tentukan sudut pusat } \\angle AOB. \\text{ (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", math: "\\text{Hitung panjang busur AB.}" },
      { label: "c.", math: "\\text{Hitung keliling juring OAB.}" },
    ],
  }),

  Q(40, "Soal ANBK Gabungan — Busur dan Juring", {
    type: "mixed",
    diagram: {
      size: 230, r: 0.6,
      sectors: [
        { startAngle: 0, endAngle: 90, fillColor: "rgba(248,113,163,0.2)", strokeColor: "#f472b6", label: "90°" },
        { startAngle: 90, endAngle: 210, fillColor: "rgba(250,204,21,0.2)", strokeColor: "#facc15", label: "120°" },
        { startAngle: 210, endAngle: 360, fillColor: "rgba(52,211,153,0.2)", strokeColor: "#34d399", label: "150°" },
      ],
      radii: [
        { angle: 0, color: "rgba(255,255,255,0.3)" },
        { angle: 90, color: "rgba(255,255,255,0.3)" },
        { angle: 210, color: "rgba(255,255,255,0.3)" },
      ],
    },
    content: "r = 14 cm. Lingkaran dibagi menjadi 3 juring: 90°, 120°, 150°.",
    parts: [
      { label: "a.", text: "Verifikasi: 90° + 120° + 150° = 360°." },
      { label: "b.", math: "\\text{Hitung panjang busur setiap juring.}" },
      { label: "c.", math: "\\text{Hitung luas setiap juring.}" },
      { label: "d.", text: "Juring mana yang memiliki luas terbesar? Berapa persentasenya dari luas total?" },
    ],
  }),
];

const BusurJuringPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-yellow-500/20 border-2 border-yellow-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-yellow-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-yellow-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(250,204,21,0.7)' }}>
            PANJANG BUSUR DAN LUAS JURING
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
            <span className="text-yellow-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-3">📐 Rumus Busur dan Juring</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-yellow-400 text-xs font-bold mb-2">PANJANG BUSUR</p>
              <BlockMath math="\text{Busur} = \frac{\alpha}{360°} \times 2\pi r" />
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-pink-400 text-xs font-bold mb-2">LUAS JURING</p>
              <BlockMath math="\text{Luas Juring} = \frac{\alpha}{360°} \times \pi r^2 = \frac{1}{2} \times r \times \text{busur}" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-yellow-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center shrink-0">
                    <span className="text-yellow-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 px-2 py-0.5 rounded inline-block mb-2">
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
                            <span className="text-yellow-300 text-xs font-bold shrink-0 mt-0.5 min-w-[36px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-yellow-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusurJuringPage;
