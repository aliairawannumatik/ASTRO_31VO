import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const accent = "cyan";
const accentHex = "#22d3ee";

type Choice = { label: string; text: string; math?: string };
type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  choices?: Choice[];
  answer?: string;
  diagram?: React.ReactNode;
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const groupHeaders: Record<number, string> = {
  1:  "📌 Bagian A — Pilihan Ganda · Konsep Dasar",
  11: "📐 Pilihan Ganda · Rumus & Luas Permukaan",
  19: "🔢 Pilihan Ganda · Volume",
  21: "✏️ Bagian B — Soal Uraian",
  30: "💧 Uraian · Soal Kontekstual",
  39: "🏆 Uraian · Soal Tantangan",
};

function CylinderSVG({ r, h, color = "#22d3ee", showSlant = false, extraLabel = "" }: {
  r?: string; h?: string; color?: string; showSlant?: boolean; extraLabel?: string;
}) {
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <defs>
        <linearGradient id={`cyl-fill-${r}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="50%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="50" y="45" width="120" height="110" fill={`url(#cyl-fill-${r})`} />
      <ellipse cx="110" cy="155" rx="60" ry="18" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
      <ellipse cx="110" cy="45" rx="60" ry="18" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.8" />
      <line x1="50" y1="45" x2="50" y2="155" stroke={color} strokeWidth="1.8" />
      <line x1="170" y1="45" x2="170" y2="155" stroke={color} strokeWidth="1.8" />
      {r && (
        <>
          <line x1="110" y1="45" x2="170" y2="45" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
          <text x="140" y="38" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r = {r}</text>
        </>
      )}
      {h && (
        <>
          <line x1="185" y1="45" x2="185" y2="155" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
          <line x1="181" y1="45" x2="189" y2="45" stroke={color} strokeWidth="1.2" />
          <line x1="181" y1="155" x2="189" y2="155" stroke={color} strokeWidth="1.2" />
          <text x="200" y="105" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">t = {h}</text>
        </>
      )}
      {extraLabel && (
        <text x="110" y="190" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">{extraLabel}</text>
      )}
    </svg>
  );
}

function CylinderNetSVG({ r, h, color = "#22d3ee" }: { r?: string; h?: string; color?: string }) {
  return (
    <svg viewBox="0 0 320 180" width="300" height="170" className="mx-auto">
      <ellipse cx="60" cy="90" rx="40" ry="40" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" strokeDasharray="5,3" />
      <text x="60" y="95" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Tutup</text>
      <rect x="110" y="30" width="120" height="120" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" />
      <text x="170" y="90" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Selimut</text>
      {h && <text x="170" y="170" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">2πr = lebar</text>}
      <ellipse cx="270" cy="90" rx="40" ry="40" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" strokeDasharray="5,3" />
      <text x="270" y="95" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Alas</text>
    </svg>
  );
}

function CylinderSymbolicSVG({ color = "#22d3ee" }: { color?: string }) {
  return (
    <svg viewBox="0 0 220 210" width="220" height="210" className="mx-auto">
      <defs>
        <linearGradient id="cyl-sym-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="50%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="50" y="40" width="120" height="120" fill="url(#cyl-sym-fill)" />
      <ellipse cx="110" cy="160" rx="60" ry="18" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
      <ellipse cx="110" cy="40" rx="60" ry="18" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.8" />
      <line x1="50" y1="40" x2="50" y2="160" stroke={color} strokeWidth="1.8" />
      <line x1="170" y1="40" x2="170" y2="160" stroke={color} strokeWidth="1.8" />
      <line x1="110" y1="40" x2="170" y2="40" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="140" y="33" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r</text>
      <line x1="185" y1="40" x2="185" y2="160" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="181" y1="40" x2="189" y2="40" stroke={color} strokeWidth="1.2" />
      <line x1="181" y1="160" x2="189" y2="160" stroke={color} strokeWidth="1.2" />
      <text x="204" y="105" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">2r</text>
      <text x="110" y="198" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">t = 2r, r = r</text>
    </svg>
  );
}

function SelimutRectSVG({ color = "#22d3ee" }: { color?: string }) {
  return (
    <svg viewBox="0 0 260 130" width="260" height="130" className="mx-auto">
      <rect x="20" y="20" width="180" height="80" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="2" />
      <line x1="20" y1="105" x2="200" y2="105" stroke={color} strokeWidth="1.2" />
      <text x="110" y="118" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">Panjang = 22 cm (= 2πr)</text>
      <line x1="205" y1="20" x2="205" y2="100" stroke={color} strokeWidth="1.2" />
      <text x="230" y="65" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">10 cm</text>
      <text x="110" y="67" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Selimut Tabung</text>
    </svg>
  );
}

const questions: Q[] = [
  Qn(1, "Konsep Dasar Tabung", {
    content: "Banyak sisi pada tabung adalah ...",
    choices: [
      { label: "A", text: "4 buah" },
      { label: "B", text: "3 buah" },
      { label: "C", text: "2 buah" },
      { label: "D", text: "1 buah" },
    ],
    answer: "B",
  }),
  Qn(2, "Konsep Dasar Tabung", {
    content: "Banyak rusuk pada tabung adalah ...",
    choices: [
      { label: "A", text: "tidak ada" },
      { label: "B", text: "1 buah" },
      { label: "C", text: "2 buah" },
      { label: "D", text: "4 buah" },
    ],
    answer: "C",
  }),
  Qn(3, "Konsep Dasar Tabung", {
    content: "Banyak titik sudut pada tabung adalah ...",
    choices: [
      { label: "A", text: "tidak ada" },
      { label: "B", text: "2 buah" },
      { label: "C", text: "4 buah" },
      { label: "D", text: "8 buah" },
    ],
    answer: "A",
  }),
  Qn(4, "Konsep Dasar Tabung", {
    content: "Bidang alas tabung berbentuk ...",
    choices: [
      { label: "A", text: "persegi" },
      { label: "B", text: "segitiga" },
      { label: "C", text: "lingkaran" },
      { label: "D", text: "trapesium" },
    ],
    answer: "C",
  }),
  Qn(5, "Konsep Dasar Tabung", {
    content: "Yang dimaksud dengan tinggi tabung adalah ...",
    choices: [
      { label: "A", text: "setengah dari panjang diameter" },
      { label: "B", text: "jarak antara kedua bidang alas" },
      { label: "C", text: "keliling lingkaran alas" },
      { label: "D", text: "panjang selimut tabung" },
    ],
    answer: "B",
  }),
  Qn(6, "Konsep Dasar Tabung", {
    content: "Sebuah tabung memiliki diameter 21 cm. Jari-jari tabung tersebut adalah ...",
    choices: [
      { label: "A", text: "10,5 cm" },
      { label: "B", text: "21 cm" },
      { label: "C", text: "42 cm" },
      { label: "D", text: "7 cm" },
    ],
    answer: "A",
  }),
  Qn(7, "Konsep Dasar Tabung", {
    content: "Jika jari-jari alas tabung adalah r, maka keliling alas tabung adalah ...",
    choices: [
      { label: "A", math: "\\pi r^2" },
      { label: "B", math: "\\pi r" },
      { label: "C", math: "2\\pi r" },
      { label: "D", math: "4\\pi r" },
    ],
    answer: "C",
  }),
  Qn(8, "Konsep Dasar Tabung", {
    content: "Apabila selimut tabung dibuka dan dibentangkan menjadi jaring-jaring, maka bentuknya adalah ...",
    choices: [
      { label: "A", text: "lingkaran" },
      { label: "B", text: "persegi panjang" },
      { label: "C", text: "segitiga" },
      { label: "D", text: "belah ketupat" },
    ],
    answer: "B",
  }),
  Qn(9, "Konsep Dasar Tabung", {
    content: "Satuan yang tepat untuk menyatakan volume tabung adalah ...",
    choices: [
      { label: "A", text: "cm" },
      { label: "B", text: "cm²" },
      { label: "C", text: "cm³" },
      { label: "D", text: "m²" },
    ],
    answer: "C",
  }),
  Qn(10, "Konsep Dasar Tabung", {
    content: "Jika jari-jari alas sebuah tabung diperbesar menjadi 2 kali semula, maka luas alasnya menjadi ...",
    choices: [
      { label: "A", text: "2 kali semula" },
      { label: "B", text: "4 kali semula" },
      { label: "C", text: "6 kali semula" },
      { label: "D", text: "8 kali semula" },
    ],
    answer: "B",
  }),
  Qn(11, "Rumus Luas Permukaan", {
    content: "Rumus luas permukaan (sisi) tabung yang benar adalah ...",
    choices: [
      { label: "A", math: "L = \\pi r^2 + \\pi r t" },
      { label: "B", math: "L = \\pi r(r + t)" },
      { label: "C", math: "L = 2\\pi r(r + t)" },
      { label: "D", math: "L = 2\\pi r^2 t" },
    ],
    answer: "C",
  }),
  Qn(12, "Rumus Luas Selimut", {
    content: "Rumus luas selimut tabung adalah ...",
    choices: [
      { label: "A", math: "\\pi r^2" },
      { label: "B", math: "2\\pi r" },
      { label: "C", math: "\\pi r^2 t" },
      { label: "D", math: "2\\pi r t" },
    ],
    answer: "D",
  }),
  Qn(13, "Luas Permukaan – Bentuk Aljabar", {
    content: "Sebuah tabung memiliki jari-jari r cm dan tinggi 2r cm. Luas permukaan tabung tersebut adalah ...",
    diagram: <CylinderSymbolicSVG />,
    choices: [
      { label: "A", math: "4\\pi r^2" },
      { label: "B", math: "5\\pi r^2" },
      { label: "C", math: "6\\pi r^2" },
      { label: "D", math: "8\\pi r^2" },
    ],
    answer: "C",
  }),
  Qn(14, "Luas Selimut – Jari-Jari dari Jaring", {
    content: "Selimut sebuah tabung dibentangkan membentuk persegi panjang dengan panjang 22 cm dan lebar 10 cm. Jari-jari alas tabung tersebut adalah ... (π = 22/7)",
    diagram: <SelimutRectSVG />,
    choices: [
      { label: "A", text: "3,5 cm" },
      { label: "B", text: "7 cm" },
      { label: "C", text: "10 cm" },
      { label: "D", text: "14 cm" },
    ],
    answer: "A",
  }),
  Qn(15, "Luas Selimut – Perhitungan", {
    content: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 20 cm. Luas selimut tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="20 cm" />,
    choices: [
      { label: "A", text: "440 cm²" },
      { label: "B", text: "660 cm²" },
      { label: "C", text: "880 cm²" },
      { label: "D", text: "1.100 cm²" },
    ],
    answer: "C",
  }),
  Qn(16, "Mencari Tinggi dari Luas Selimut", {
    content: "Luas selimut sebuah tabung adalah 270π cm². Jika jari-jari alasnya 9 cm, maka tinggi tabung tersebut adalah ...",
    diagram: <CylinderSVG r="9 cm" h="?" />,
    choices: [
      { label: "A", text: "10 cm" },
      { label: "B", text: "12 cm" },
      { label: "C", text: "15 cm" },
      { label: "D", text: "20 cm" },
    ],
    answer: "C",
  }),
  Qn(17, "Mencari Jari-Jari dari Luas Selimut", {
    content: "Diketahui luas selimut sebuah tabung 462 cm² dan tingginya 7 cm. Jari-jari alas tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="?" h="7 cm" />,
    choices: [
      { label: "A", text: "7 cm" },
      { label: "B", text: "10,5 cm" },
      { label: "C", text: "14 cm" },
      { label: "D", text: "21 cm" },
    ],
    answer: "B",
  }),
  Qn(18, "Luas Permukaan dari Luas Alas & Selimut", {
    content: "Luas alas sebuah tabung adalah 154 cm² dan luas selimutnya 440 cm². Luas permukaan tabung tersebut adalah ...",
    choices: [
      { label: "A", text: "594 cm²" },
      { label: "B", text: "748 cm²" },
      { label: "C", text: "880 cm²" },
      { label: "D", text: "1.034 cm²" },
    ],
    answer: "B",
  }),
  Qn(19, "Volume Tabung – Perhitungan", {
    content: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 15 cm. Volume tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="15 cm" />,
    choices: [
      { label: "A", text: "1.650 cm³" },
      { label: "B", text: "2.310 cm³" },
      { label: "C", text: "3.234 cm³" },
      { label: "D", text: "4.620 cm³" },
    ],
    answer: "B",
  }),
  Qn(20, "Mencari Tinggi dari Volume", {
    content: "Volume sebuah tabung adalah 1.540 cm³. Jika jari-jari alasnya 7 cm, maka tinggi tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="?" />,
    choices: [
      { label: "A", text: "5 cm" },
      { label: "B", text: "8 cm" },
      { label: "C", text: "10 cm" },
      { label: "D", text: "12 cm" },
    ],
    answer: "C",
  }),

  Qn(21, "Luas Selimut Tabung", {
    content: "Sebuah tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm. Hitunglah luas selimut tabung tersebut! (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="10 cm" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r t = 2 \\times \\frac{22}{7} \\times 7 \\times 10 = \\ldots" },
      { label: "b.", text: "Satuan apa yang digunakan untuk luas?" },
    ],
  }),
  Qn(22, "Luas Permukaan Total Tabung", {
    content: "Tabung dengan jari-jari 5 cm dan tinggi 12 cm. Hitunglah luas permukaan total tabung! (π = 3,14)",
    diagram: <CylinderSVG r="5 cm" h="12 cm" />,
    parts: [
      { label: "a.", math: "L_{\\text{alas}} = \\pi r^2 = 3{,}14 \\times 5^2 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut}} = 2\\pi r t = 2 \\times 3{,}14 \\times 5 \\times 12 = \\ldots" },
      { label: "c.", math: "L_{\\text{total}} = L_{\\text{selimut}} + 2 \\times L_{\\text{alas}} = \\ldots" },
    ],
  }),
  Qn(23, "Volume Tabung", {
    content: "Sebuah tabung memiliki jari-jari 6 cm dan tinggi 8 cm. Hitunglah volume tabung tersebut! (π = 3,14)",
    diagram: <CylinderSVG r="6 cm" h="8 cm" />,
    parts: [
      { label: "a.", math: "V = \\pi r^2 t = 3{,}14 \\times 6^2 \\times 8 = \\ldots" },
    ],
  }),
  Qn(24, "Volume Tabung – Diameter Diketahui", {
    content: "Sebuah tabung memiliki diameter 14 cm dan tinggi 20 cm. Hitunglah volume tabung! (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="20 cm" />,
    parts: [
      { label: "a.", math: "r = \\frac{d}{2} = \\frac{14}{2} = \\ldots \\text{ cm}" },
      { label: "b.", math: "V = \\pi r^2 t = \\frac{22}{7} \\times 7^2 \\times 20 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(25, "Luas Permukaan – Diameter Diketahui", {
    content: "Sebuah tabung mempunyai diameter alas 14 cm dan tinggi 15 cm. Hitunglah luas permukaan tabung tersebut! (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="15 cm" />,
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm}" },
      { label: "b.", math: "L = 2\\pi r(r + t) = 2 \\times \\frac{22}{7} \\times 7 \\times (7 + 15) = \\ldots" },
    ],
  }),
  Qn(26, "Mencari Tinggi dari Luas Selimut", {
    content: "Luas selimut sebuah tabung adalah 440 cm². Jika jari-jarinya 5 cm, tentukan tinggi tabung tersebut! (π = 22/7)",
    diagram: <CylinderSVG r="5 cm" h="?" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r t \\Rightarrow 440 = 2 \\times \\frac{22}{7} \\times 5 \\times t" },
      { label: "b.", math: "t = \\frac{440}{2 \\times \\frac{22}{7} \\times 5} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(27, "Mencari Tinggi dari Volume", {
    content: "Volume sebuah tabung adalah 1.386 cm³. Jika jari-jarinya 7 cm, tentukan tinggi tabung tersebut! (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="?" />,
    parts: [
      { label: "a.", math: "V = \\pi r^2 t \\Rightarrow 1386 = \\frac{22}{7} \\times 7^2 \\times t" },
      { label: "b.", math: "t = \\frac{1386}{\\frac{22}{7} \\times 49} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(28, "Mencari Jari-Jari dari Volume", {
    content: "Volume sebuah tabung adalah 2.512 cm³ dan tingginya 8 cm. Tentukan jari-jari tabung! (π = 3,14)",
    diagram: <CylinderSVG r="?" h="8 cm" />,
    parts: [
      { label: "a.", math: "V = \\pi r^2 t \\Rightarrow 2512 = 3{,}14 \\times r^2 \\times 8" },
      { label: "b.", math: "r^2 = \\frac{2512}{3{,}14 \\times 8} = \\ldots \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(29, "Jaring-Jaring Tabung", {
    content: "Perhatikan jaring-jaring tabung berikut! Sebuah tabung memiliki jari-jari 5 cm dan tinggi 12 cm.",
    diagram: <CylinderNetSVG r="5" h="12" />,
    parts: [
      { label: "a.", text: "Sebutkan tiga bagian jaring-jaring tabung!" },
      { label: "b.", math: "\\text{Lebar selimut (jaring) } = 2\\pi r = 2 \\times \\frac{22}{7} \\times 5 = \\ldots \\text{ cm}" },
      { label: "c.", math: "L_{\\text{selimut}} = \\text{lebar} \\times t = \\ldots \\times 12 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(30, "Soal Cerita – Tangki Air", {
    content: "Sebuah tangki air berbentuk tabung dengan jari-jari 21 cm dan tinggi 50 cm. Berapa liter air maksimum yang dapat ditampung? (π = 22/7, 1 liter = 1.000 cm³)",
    diagram: <CylinderSVG r="21 cm" h="50 cm" color="#38bdf8" extraLabel="Tangki Air" />,
    parts: [
      { label: "a.", math: "V = \\frac{22}{7} \\times 21^2 \\times 50 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V \\text{ dalam liter} = \\frac{V}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(31, "Soal Cerita – Kaleng Minuman", {
    content: "Sebuah kaleng minuman berbentuk tabung memiliki diameter 7 cm dan tinggi 10 cm. Berapa cm² luas logam yang dibutuhkan untuk membuat satu kaleng (luas permukaan total)? (π = 22/7)",
    diagram: <CylinderSVG r="3,5 cm" h="10 cm" color="#38bdf8" extraLabel="Kaleng" />,
    parts: [
      { label: "a.", math: "r = \\frac{7}{2} = 3{,}5 \\text{ cm}" },
      { label: "b.", math: "L = 2\\pi r(r + t) = 2 \\times \\frac{22}{7} \\times 3{,}5 \\times (3{,}5 + 10) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(32, "Luas Permukaan – Cari Tinggi", {
    content: "Luas permukaan total sebuah tabung adalah 96π cm². Jika jari-jarinya 4 cm, berapakah tinggi tabung tersebut?",
    diagram: <CylinderSVG r="4 cm" h="?" />,
    parts: [
      { label: "a.", math: "L = 2\\pi r(r + t) \\Rightarrow 96\\pi = 2\\pi \\times 4 \\times (4 + t)" },
      { label: "b.", math: "96 = 8(4 + t) \\Rightarrow 4 + t = 12 \\Rightarrow t = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(33, "Soal Cerita – Drum Minyak", {
    content: "Sebuah drum minyak berbentuk tabung dengan diameter 1,4 m dan tinggi 2 m. Berapa liter minyak dapat ditampung jika 1 m³ = 1.000 liter? (π = 22/7)",
    diagram: <CylinderSVG r="0,7 m" h="2 m" color="#fbbf24" extraLabel="Drum Minyak" />,
    parts: [
      { label: "a.", math: "r = 0{,}7 \\text{ m}" },
      { label: "b.", math: "V = \\frac{22}{7} \\times (0{,}7)^2 \\times 2 = \\ldots \\text{ m}^3" },
      { label: "c.", math: "V \\text{ (liter)} = \\ldots \\times 1000 = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(34, "Perbandingan Volume Dua Tabung", {
    content: "Tabung A memiliki r = 3 cm dan t = 8 cm. Tabung B memiliki r = 6 cm dan t = 4 cm. Bandingkan volume kedua tabung!",
    parts: [
      { label: "a.", math: "V_A = \\pi \\times 3^2 \\times 8 = 72\\pi \\text{ cm}^3" },
      { label: "b.", math: "V_B = \\pi \\times 6^2 \\times 4 = 144\\pi \\text{ cm}^3" },
      { label: "c.", math: "\\frac{V_A}{V_B} = \\frac{72\\pi}{144\\pi} = \\ldots" },
    ],
  }),
  Qn(35, "Soal UN – Luas Permukaan Tabung Terbuka", {
    content: "Sebuah tabung tanpa tutup memiliki jari-jari 10 cm dan tinggi 15 cm. Hitunglah luas permukaannya! (π = 3,14)",
    diagram: <CylinderSVG r="10 cm" h="15 cm" />,
    parts: [
      { label: "a.", math: "L = \\pi r^2 + 2\\pi r t = \\pi r(r + 2t)" },
      { label: "b.", math: "L = 3{,}14 \\times 10 \\times (10 + 2 \\times 15) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(36, "Volume Tabung – Satuan Berbeda", {
    content: "Sebuah pipa silinder berdiameter 21 cm dan panjang 1 m. Hitunglah volume pipa tersebut! (π = 22/7)",
    diagram: <CylinderSVG r="10,5 cm" h="100 cm" />,
    parts: [
      { label: "a.", math: "t = 1 \\text{ m} = 100 \\text{ cm},\\quad r = 10{,}5 \\text{ cm}" },
      { label: "b.", math: "V = \\frac{22}{7} \\times 10{,}5^2 \\times 100 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(37, "Soal UN – Biaya Cat", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 20 cm akan dicat selimutnya. Jika biaya cat Rp500,00 per cm², berapa total biaya yang diperlukan? (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="20 cm" color="#a78bfa" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r t = 2 \\times \\frac{22}{7} \\times 7 \\times 20 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "\\text{Biaya} = \\ldots \\times 500 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(38, "Soal Cerita – Pipa Air", {
    content: "Air mengalir melalui pipa silinder berjari-jari 1,4 cm dengan kecepatan 5 cm/detik. Berapa volume air yang mengalir dalam 1 menit? (π = 22/7)",
    diagram: <CylinderSVG r="1,4 cm" h="300 cm" color="#38bdf8" extraLabel="L = 5 × 60 = 300 cm" />,
    parts: [
      { label: "a.", math: "\\text{Panjang air per menit} = 5 \\times 60 = 300 \\text{ cm}" },
      { label: "b.", math: "V = \\pi r^2 \\times L = \\frac{22}{7} \\times (1{,}4)^2 \\times 300 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(39, "ANBK – Tabung dalam Kotak", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 14 cm dimasukkan ke dalam kotak kubus. Berapa sisa volume di dalam kotak yang tidak ditempati tabung? (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="14 cm" />,
    parts: [
      { label: "a.", math: "V_{\\text{kubus}} = s^3 = 14^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 7^2 \\times 14 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = V_{\\text{kubus}} - V_{\\text{tabung}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(40, "Luas Selimut – Soal Terbalik", {
    content: "Luas selimut sebuah tabung adalah 264 cm². Jika tingginya 3 kali jari-jarinya, tentukan jari-jari dan tinggi tabung! (π = 22/7)",
    parts: [
      { label: "a.", math: "\\text{Misalkan } r = r,\\ t = 3r" },
      { label: "b.", math: "2\\pi r \\cdot 3r = 264 \\Rightarrow 6\\pi r^2 = 264 \\Rightarrow r^2 = \\frac{264}{6 \\times \\frac{22}{7}} = \\ldots" },
      { label: "c.", math: "r = \\ldots \\text{ cm},\\ t = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(41, "Volume – Soal UN Pilihan", {
    content: "Sebuah tabung mempunyai luas alas 154 cm² dan tinggi 10 cm. Hitunglah volume tabung tersebut! (π = 22/7)",
    parts: [
      { label: "a.", math: "L_{\\text{alas}} = \\pi r^2 = 154 \\Rightarrow r^2 = \\frac{154}{\\frac{22}{7}} = \\ldots \\Rightarrow r = \\ldots" },
      { label: "b.", math: "V = L_{\\text{alas}} \\times t = 154 \\times 10 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(42, "Soal Cerita – Kolam Renang Silindris", {
    content: "Sebuah kolam renang berbentuk tabung berdiameter 14 m dan kedalaman 2 m. Berapa m³ air yang dibutuhkan untuk mengisi kolam hingga penuh? (π = 22/7)",
    diagram: <CylinderSVG r="7 m" h="2 m" color="#38bdf8" extraLabel="Kolam Renang" />,
    parts: [
      { label: "a.", math: "V = \\frac{22}{7} \\times 7^2 \\times 2 = \\ldots \\text{ m}^3" },
    ],
  }),
  Qn(43, "Persamaan Volume Dua Tabung", {
    content: "Tabung P: r = 4 cm, t = 9 cm. Tabung Q: r = ?, t = 4 cm. Jika volume keduanya sama, tentukan jari-jari Tabung Q! (π sama)",
    parts: [
      { label: "a.", math: "V_P = \\pi \\times 4^2 \\times 9 = 144\\pi \\text{ cm}^3" },
      { label: "b.", math: "V_Q = \\pi r^2 \\times 4 = 144\\pi \\Rightarrow r^2 = 36 \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(44, "UN Style – Luas Permukaan", {
    content: "Luas permukaan sebuah tabung tertutup adalah 462 cm². Jika jari-jarinya 7 cm, berapakah tinggi tabung? (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="?" />,
    parts: [
      { label: "a.", math: "L = 2\\pi r(r + t) \\Rightarrow 462 = 2 \\times \\frac{22}{7} \\times 7 \\times (7 + t)" },
      { label: "b.", math: "462 = 44(7 + t) \\Rightarrow 7 + t = \\frac{462}{44} = \\ldots \\Rightarrow t = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(45, "Soal Cerita – Kaleng Roti", {
    content: "Sebuah pabrik membuat kaleng roti berbentuk tabung tanpa tutup dengan r = 14 cm dan t = 20 cm. Berapa luas seng yang diperlukan untuk satu kaleng? (π = 22/7)",
    diagram: <CylinderSVG r="14 cm" h="20 cm" color="#fbbf24" extraLabel="Tanpa Tutup" />,
    parts: [
      { label: "a.", math: "L = \\pi r^2 + 2\\pi r t = \\pi r(r + 2t)" },
      { label: "b.", math: "L = \\frac{22}{7} \\times 14 \\times (14 + 40) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(46, "Volume dalam Satuan Liter", {
    content: "Sebuah ember berbentuk tabung memiliki r = 14 cm dan t = 25 cm. Berapa desimeter kubik air yang dapat ditampung? (π = 22/7, 1 dm³ = 1 liter)",
    diagram: <CylinderSVG r="14 cm" h="25 cm" color="#38bdf8" extraLabel="Ember" />,
    parts: [
      { label: "a.", math: "V = \\frac{22}{7} \\times 14^2 \\times 25 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V \\text{ (dm}^3) = \\frac{V}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(47, "TKA Style – Optimasi Bahan", {
    content: "Sebuah perusahaan akan membuat tabung dengan volume tetap 1.540 cm³. Jika r = 7 cm, berapa tinggi tabung tersebut? (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="?" />,
    parts: [
      { label: "a.", math: "V = \\pi r^2 t \\Rightarrow 1540 = \\frac{22}{7} \\times 49 \\times t" },
      { label: "b.", math: "t = \\frac{1540}{22 \\times 7} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(48, "Soal Cerita – Pengecatan Silo", {
    content: "Sebuah silo penyimpanan beras berbentuk tabung dengan diameter 4,2 m dan tinggi 6 m. Sisi luar (selimut + tutup atas saja) akan dicat. Berapa m² yang akan dicat? (π = 22/7)",
    diagram: <CylinderSVG r="2,1 m" h="6 m" color="#a78bfa" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r t = 2 \\times \\frac{22}{7} \\times 2{,}1 \\times 6 = \\ldots \\text{ m}^2" },
      { label: "b.", math: "L_{\\text{tutup atas}} = \\pi r^2 = \\frac{22}{7} \\times 2{,}1^2 = \\ldots \\text{ m}^2" },
      { label: "c.", math: "L_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ m}^2" },
    ],
  }),
  Qn(49, "ANBK – Tabung dan Kapasitas", {
    content: "Sebuah tabung berisi minyak goreng 4.400 cm³. Jika tinggi minyak dalam tabung 20 cm, berapa jari-jari tabung tersebut? (π = 22/7)",
    diagram: <CylinderSVG r="?" h="20 cm" color="#fbbf24" />,
    parts: [
      { label: "a.", math: "V = \\pi r^2 t \\Rightarrow 4400 = \\frac{22}{7} \\times r^2 \\times 20" },
      { label: "b.", math: "r^2 = \\frac{4400 \\times 7}{22 \\times 20} = \\ldots \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(50, "Keliling Alas dari Volume", {
    content: "Volume sebuah tabung adalah 9.240 cm³ dan tingginya 30 cm. Tentukan keliling alas tabung tersebut! (π = 22/7)",
    parts: [
      { label: "a.", math: "V = \\pi r^2 t \\Rightarrow 9240 = \\frac{22}{7} \\times r^2 \\times 30 \\Rightarrow r = \\ldots" },
      { label: "b.", math: "K = 2\\pi r = 2 \\times \\frac{22}{7} \\times r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(51, "Soal UN – Volume Tabung Setengah Penuh", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 20 cm diisi air hingga setengah penuh. Berapa volume air yang ada dalam tabung? (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="10 cm" color="#38bdf8" extraLabel="½ Penuh" />,
    parts: [
      { label: "a.", math: "V_{\\text{penuh}} = \\frac{22}{7} \\times 7^2 \\times 20 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{setengah}} = \\frac{1}{2} \\times V_{\\text{penuh}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(52, "Luas Selimut – Perbandingan", {
    content: "Dua tabung memiliki tinggi yang sama. Jika perbandingan jari-jarinya 2 : 3, berapakah perbandingan luas selimut kedua tabung?",
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r t" },
      { label: "b.", math: "\\frac{L_1}{L_2} = \\frac{2\\pi r_1 t}{2\\pi r_2 t} = \\frac{r_1}{r_2} = \\frac{2}{3}" },
      { label: "c.", text: "Jadi perbandingan luas selimutnya adalah ..." },
    ],
  }),
  Qn(53, "Volume – Perbandingan Jari-Jari", {
    content: "Dua tabung memiliki tinggi yang sama. Perbandingan jari-jarinya 1 : 2. Berapakah perbandingan volume keduanya?",
    parts: [
      { label: "a.", math: "\\frac{V_1}{V_2} = \\frac{\\pi r_1^2 t}{\\pi r_2^2 t} = \\left(\\frac{r_1}{r_2}\\right)^2 = \\left(\\frac{1}{2}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(54, "Soal Cerita – Pengisian Tangki", {
    content: "Sebuah tangki berbentuk tabung dengan r = 3,5 m dan tinggi 5 m akan diisi air menggunakan pompa yang mengalirkan 385 liter/menit. Berapa menit untuk mengisi penuh tangki? (π = 22/7, 1 m³ = 1.000 liter)",
    diagram: <CylinderSVG r="3,5 m" h="5 m" color="#38bdf8" extraLabel="Tangki" />,
    parts: [
      { label: "a.", math: "V = \\frac{22}{7} \\times (3{,}5)^2 \\times 5 = \\ldots \\text{ m}^3 = \\ldots \\text{ liter}" },
      { label: "b.", math: "t = \\frac{V}{385} = \\ldots \\text{ menit}" },
    ],
  }),
  Qn(55, "TKA – Kaleng Terbuka", {
    content: "Sebuah kaleng terbuka (tanpa tutup atas) berbentuk tabung dengan r = 10,5 cm dan t = 15 cm. Hitunglah luas permukaan kaleng tersebut! (π = 22/7)",
    diagram: <CylinderSVG r="10,5 cm" h="15 cm" color="#fbbf24" extraLabel="Tanpa Tutup Atas" />,
    parts: [
      { label: "a.", math: "L = \\pi r^2 + 2\\pi r t = \\pi r(r + 2t)" },
      { label: "b.", math: "L = \\frac{22}{7} \\times 10{,}5 \\times (10{,}5 + 30) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(56, "Soal Cerita – Lilin Silindris", {
    content: "Sebuah lilin berbentuk tabung memiliki diameter 3,5 cm dan tinggi 20 cm. Setelah dinyalakan, lilin menyusut tingginya 0,5 cm per jam. Berapa volume lilin setelah 4 jam menyala? (π = 22/7)",
    parts: [
      { label: "a.", math: "r = 1{,}75 \\text{ cm},\\quad t_{\\text{baru}} = 20 - 4 \\times 0{,}5 = \\ldots \\text{ cm}" },
      { label: "b.", math: "V = \\frac{22}{7} \\times (1{,}75)^2 \\times t_{\\text{baru}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(57, "ANBK – Volume Tabung dari Luas Alas", {
    content: "Luas alas sebuah tabung adalah 616 cm² dan tingginya 25 cm. Berapakah volume tabung tersebut?",
    parts: [
      { label: "a.", text: "Volume tabung = Luas alas × tinggi" },
      { label: "b.", math: "V = 616 \\times 25 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(58, "UN – Mencari Diameter dari Luas Selimut", {
    content: "Luas selimut sebuah tabung adalah 1.760 cm². Jika tinggi tabung 20 cm, tentukan diameter alas tabung! (π = 22/7)",
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r t \\Rightarrow 1760 = 2 \\times \\frac{22}{7} \\times r \\times 20" },
      { label: "b.", math: "r = \\frac{1760 \\times 7}{2 \\times 22 \\times 20} = \\ldots \\text{ cm}" },
      { label: "c.", math: "d = 2r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(59, "Soal Terapan – Penampung Sampah", {
    content: "Tong sampah berbentuk tabung tanpa tutup akan dibuat dari seng. Diameternya 42 cm dan tingginya 60 cm. Jika harga seng Rp25.000,00 per dm², berapa biaya yang dibutuhkan? (π = 22/7, 1 dm² = 100 cm²)",
    diagram: <CylinderSVG r="21 cm" h="60 cm" color="#6b7280" extraLabel="Tong Sampah" />,
    parts: [
      { label: "a.", math: "L = \\pi r^2 + 2\\pi r t = \\frac{22}{7} \\times 21^2 + 2 \\times \\frac{22}{7} \\times 21 \\times 60 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L \\text{ (dm}^2) = \\frac{L}{100} = \\ldots \\text{ dm}^2" },
      { label: "c.", math: "\\text{Biaya} = \\ldots \\times 25000 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(60, "UN Terpadu – Volume dan Luas Permukaan", {
    content: "Sebuah tabung memiliki luas permukaan total 754 cm² dan tinggi 12 cm. Jika π = 3,14, tentukan: (a) jari-jari, (b) volume tabung.",
    diagram: <CylinderSVG r="?" h="12 cm" />,
    parts: [
      { label: "a.", math: "2\\pi r^2 + 2\\pi r t = 754 \\Rightarrow 2\\pi r(r + 12) = 754" },
      { label: "b.", math: "r(r + 12) = \\frac{754}{2 \\times 3{,}14} \\approx \\ldots \\Rightarrow r = \\ldots \\text{ cm}" },
      { label: "c.", math: "V = \\pi r^2 t = \\ldots \\text{ cm}^3" },
    ],
  }),
];

const CHOICE_LABELS = ["A", "B", "C", "D"];

const TabungPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🧴</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(34,211,238,0.7)' }}>
            TABUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 60 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Rumus Penting — Tabung</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Luas Selimut", formula: "L_s = 2\\pi r t" },
              { label: "Luas Permukaan Total", formula: "L = 2\\pi r(r + t)" },
              { label: "Volume", formula: "V = \\pi r^2 t" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-cyan-400 font-bold shrink-0 w-32">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n}>
              {groupHeaders[q.n] && (
                <div className="mt-4 mb-2 px-2">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-cyan-500/20" />
                    <span className="text-cyan-400 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                      {groupHeaders[q.n]}
                    </span>
                    <div className="h-px flex-1 bg-cyan-500/20" />
                  </div>
                </div>
              )}
              <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">
                        {q.title}
                      </span>
                      {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                      {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                      {q.math && <div className="mb-3 text-white/90 text-sm"><BlockMath math={q.math} /></div>}

                      {q.choices && (
                        <div className="flex flex-col gap-1.5 mt-2">
                          {q.choices.map((ch) => {
                            const isAnswer = ch.label === q.answer;
                            return (
                              <div
                                key={ch.label}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all
                                  ${isAnswer
                                    ? "bg-cyan-500/15 border-cyan-400/50"
                                    : "bg-white/5 border-white/10"
                                  }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border
                                  ${isAnswer
                                    ? "bg-cyan-400/30 border-cyan-400 text-cyan-200"
                                    : "bg-white/10 border-white/20 text-white/50"
                                  }`}>
                                  {ch.label}
                                </span>
                                <span className={`font-body text-sm ${isAnswer ? "text-cyan-100 font-semibold" : "text-white/70"}`}>
                                  {ch.text && ch.text}
                                  {ch.math && <InlineMath math={ch.math} />}
                                </span>
                                {isAnswer && (
                                  <span className="ml-auto text-cyan-400 text-xs font-bold">✓</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.parts && (
                        <div className="flex flex-col gap-2">
                          {q.parts.map((p, pi) => (
                            <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                              {p.label && <span className="text-cyan-400 text-xs font-bold shrink-0 mt-0.5 w-5">{p.label}</span>}
                              <div className="flex-1 min-w-0">
                                {p.text && <span className="font-body text-sm text-white/80">{p.text}</span>}
                                {p.math && <span className="text-white/90 text-sm"><InlineMath math={p.math} /></span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bangun Ruang Sisi Lengkung
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabungPage;
