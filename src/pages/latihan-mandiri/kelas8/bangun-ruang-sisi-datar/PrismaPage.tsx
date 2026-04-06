import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const PrismaSegitigaSVG = ({ a = "a", b = "b", c = "c", t = "t" }: { a?: string; b?: string; c?: string; t?: string }) => (
  <svg width="190" height="140" viewBox="0 0 190 140" className="mx-auto">
    <defs>
      <linearGradient id="pFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="pSide" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="pTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Bottom triangle face (front) */}
    <polygon points="20,120 100,120 60,80" fill="url(#pFront)" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Front rectangular face */}
    <polygon points="20,120 100,120 140,95 60,95" fill="url(#pFront)" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Right rectangular face */}
    <polygon points="100,120 140,95 120,55 80,80" fill="url(#pSide)" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Top triangle face */}
    <polygon points="60,80 80,80 120,55" fill="url(#pTop)" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Left rectangular face - dashed */}
    <line x1="20" y1="120" x2="60" y2="95" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
    <line x1="60" y1="95" x2="60" y2="80" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
    <line x1="60" y1="95" x2="140" y2="95" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
    {/* Vertices */}
    {[[20,120],[100,120],[60,80],[60,95],[140,95],[120,55],[80,80]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#fbbf24" />
    ))}
    {/* Labels */}
    <text x="8" y="126" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="102" y="126" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="54" y="78" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="50" y="96" fill="white" fontSize="10" fontFamily="monospace">D</text>
    <text x="142" y="96" fill="white" fontSize="10" fontFamily="monospace">E</text>
    <text x="122" y="54" fill="white" fontSize="10" fontFamily="monospace">F</text>
    {/* Dimension labels */}
    <text x="60" y="136" fill="#fbbf24" fontSize="10" textAnchor="middle">{a}</text>
    <text x="155" y="80" fill="#fbbf24" fontSize="10" textAnchor="middle">{t}</text>
  </svg>
);

const PrismaSikuSVG = () => (
  <svg width="190" height="145" viewBox="0 0 190 145" className="mx-auto">
    {/* Bottom right-triangle */}
    <polygon points="15,125 95,125 15,65" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Front rect (alas) */}
    <polygon points="15,125 95,125 135,100 55,100" fill="#f59e0b" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Right rect (sisi miring) */}
    <polygon points="95,125 135,100 95,40 55,65" fill="#f59e0b" fillOpacity="0.15" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Top right-triangle */}
    <polygon points="55,100 55,65 95,40" fill="#f59e0b" fillOpacity="0.45" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Hidden edges */}
    <line x1="15" y1="125" x2="55" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="100" x2="55" y2="65" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="15" y1="65" x2="55" y2="40" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Right angle marker */}
    <polyline points="15,110 25,110 25,125" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    {/* Vertices */}
    {[[15,125],[95,125],[15,65],[55,100],[135,100],[95,40],[55,65],[55,40]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#fbbf24" />
    ))}
    <text x="3" y="130" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="97" y="130" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="3" y="62" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="45" y="103" fill="white" fontSize="10" fontFamily="monospace">D</text>
    <text x="137" y="103" fill="white" fontSize="10" fontFamily="monospace">E</text>
    <text x="97" y="38" fill="white" fontSize="10" fontFamily="monospace">F</text>
    <text x="57" y="62" fill="white" fontSize="10" fontFamily="monospace">G</text>
    {/* Labels */}
    <text x="55" y="140" fill="#fbbf24" fontSize="9" textAnchor="middle">alas</text>
    <text x="7" y="95" fill="#fbbf24" fontSize="9" textAnchor="middle">t</text>
    <text x="155" y="72" fill="#fbbf24" fontSize="9" textAnchor="middle">tinggi</text>
    <text x="145" y="85" fill="#fbbf24" fontSize="8" textAnchor="middle">prisma</text>
  </svg>
);

const PrismaNetSVG = () => (
  <svg width="220" height="170" viewBox="0 0 220 170" className="mx-auto">
    {/* Two triangles */}
    <polygon points="10,85 70,85 40,40" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.5" />
    <polygon points="10,85 70,85 40,130" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.5" />
    {/* Three rectangles */}
    <rect x="70" y="40" width="50" height="45" fill="#f59e0b" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="1.5" rx="1" />
    <rect x="120" y="40" width="50" height="45" fill="#f59e0b" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.5" rx="1" />
    <rect x="170" y="40" width="45" height="45" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.5" rx="1" />
    {/* Labels */}
    <text x="40" y="88" fill="#fcd34d" fontSize="9" textAnchor="middle">segitiga</text>
    <text x="95" y="66" fill="#fcd34d" fontSize="9" textAnchor="middle">sisi 1</text>
    <text x="145" y="66" fill="#fcd34d" fontSize="9" textAnchor="middle">sisi 2</text>
    <text x="192" y="66" fill="#fcd34d" fontSize="9" textAnchor="middle">sisi 3</text>
    <text x="10" y="160" fill="#fcd34d" fontSize="9">Jaring-jaring prisma segitiga</text>
  </svg>
);

const PrismaSegiempatSVG = () => (
  <svg width="180" height="140" viewBox="0 0 180 140" className="mx-auto">
    <polygon points="15,115 85,115 85,55 15,55" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.8" />
    <polygon points="15,55 85,55 120,30 50,30" fill="#f59e0b" fillOpacity="0.45" stroke="#fbbf24" strokeWidth="1.8" />
    <polygon points="85,55 120,30 120,90 85,115" fill="#f59e0b" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="1.8" />
    <line x1="15" y1="115" x2="50" y2="90" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="90" x2="120" y2="90" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="90" x2="50" y2="30" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {[[15,115],[85,115],[85,55],[15,55],[50,30],[120,30],[120,90],[50,90]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#fbbf24" />
    ))}
    <text x="3" y="120" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="87" y="120" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="87" y="53" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="3" y="53" fill="white" fontSize="10" fontFamily="monospace">D</text>
    <text x="42" y="28" fill="white" fontSize="10" fontFamily="monospace">E</text>
    <text x="122" y="28" fill="white" fontSize="10" fontFamily="monospace">F</text>
    <text x="122" y="92" fill="white" fontSize="10" fontFamily="monospace">G</text>
    <text x="42" y="92" fill="white" fontSize="10" fontFamily="monospace">H</text>
    <text x="50" y="132" fill="#fbbf24" fontSize="10" textAnchor="middle">Prisma Segiempat (Balok)</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian dan Unsur-Unsur Prisma", {
    type: "mixed",
    content: "Perhatikan prisma segitiga ABC.DEF berikut:",
    diagram: <PrismaSegitigaSVG />,
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan prisma? Sebutkan ciri-cirinya." },
      { label: "b.", text: "Sebutkan rusuk, titik sudut, dan sisi (bidang) pada prisma segitiga." },
      { label: "c.", text: "Apa perbedaan antara sisi alas, sisi tegak (selimut), dan sisi tutup pada prisma?" },
    ],
  }),
  Qn(2, "Menghitung Unsur Prisma Segitiga", {
    type: "mixed",
    diagram: <PrismaSegitigaSVG />,
    parts: [
      { label: "a.", text: "Berapa jumlah titik sudut prisma segitiga? Sebutkan semuanya." },
      { label: "b.", text: "Berapa jumlah rusuk prisma segitiga? Kelompokkan rusuk alas, tutup, dan tegak." },
      { label: "c.", text: "Berapa jumlah sisi (bidang) pada prisma segitiga? Sebutkan nama masing-masing sisi." },
    ],
  }),
  Qn(3, "Luas Permukaan Prisma Segitiga – Rumus", {
    type: "mixed",
    content: "Luas permukaan prisma = 2 × luas alas + luas selimut (seluruh sisi tegak).",
    mathContent: "L = 2 \\times L_{alas} + (K_{alas} \\times t_{prisma})",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan selimut prisma?" },
      { label: "b.", math: "\\text{Jika alas segitiga sama sisi dengan sisi 6 cm dan tinggi prisma 10 cm, hitung } L" },
      { label: "c.", math: "\\text{Gunakan } L_{\\triangle} = \\frac{\\sqrt{3}}{4} \\times 6^2 \\text{ untuk luas alas}" },
    ],
  }),
  Qn(4, "Luas Permukaan Prisma Segitiga Siku-Siku", {
    type: "mixed",
    content: "Prisma segitiga siku-siku dengan alas segitiga siku-siku: sisi siku 3 cm dan 4 cm. Tinggi prisma 10 cm.",
    diagram: <PrismaSikuSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung sisi miring alas segitiga: } c = \\sqrt{3^2 + 4^2}" },
      { label: "b.", math: "\\text{Hitung luas alas segitiga: } L_{\\triangle} = \\frac{1}{2} \\times 3 \\times 4" },
      { label: "c.", math: "\\text{Hitung luas permukaan prisma: } L = 2L_{\\triangle} + (3+4+5) \\times 10" },
    ],
  }),
  Qn(5, "Volume Prisma – Rumus", {
    type: "mixed",
    content: "Volume prisma dihitung dengan rumus:",
    mathContent: "V = L_{alas} \\times t_{prisma}",
    parts: [
      { label: "a.", math: "\\text{Hitung V jika alas segitiga siku-siku } (3, 4, 5) \\text{ cm dan } t = 12 \\text{ cm}" },
      { label: "b.", math: "\\text{Hitung V jika alas persegi dengan sisi 8 cm dan } t = 15 \\text{ cm}" },
      { label: "c.", math: "\\text{Hitung V jika alas segitiga sama sisi sisi 6 cm dan } t = 10 \\text{ cm}" },
    ],
  }),
  Qn(6, "Volume Prisma Segitiga Siku-Siku – UN Style", {
    type: "mixed",
    content: "Prisma segitiga siku-siku dengan alas: sisi siku-siku 6 cm dan 8 cm. Tinggi prisma 15 cm.",
    diagram: <PrismaSikuSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas segitiga: } L = \\frac{1}{2} \\times 6 \\times 8" },
      { label: "b.", math: "\\text{Hitung volume prisma: } V = L_{\\triangle} \\times 15" },
      { label: "c.", math: "\\text{Hitung sisi miring segitiga alas}" },
    ],
  }),
  Qn(7, "Jaring-Jaring Prisma Segitiga", {
    type: "mixed",
    content: "Perhatikan jaring-jaring prisma segitiga berikut:",
    diagram: <PrismaNetSVG />,
    parts: [
      { label: "a.", text: "Ada berapa bangun datar yang menyusun jaring-jaring prisma segitiga?" },
      { label: "b.", text: "Sebutkan jenis dan jumlah bangun datar penyusunnya." },
      { label: "c.", text: "Untuk prisma dengan alas segitiga siku-siku (3,4,5) cm dan tinggi 8 cm, hitung luas jaring-jaringnya." },
    ],
  }),
  Qn(8, "Unsur-Unsur Prisma Segiempat", {
    type: "mixed",
    content: "Perhatikan prisma segiempat (balok) ABCD.EFGH berikut:",
    diagram: <PrismaSegiempatSVG />,
    parts: [
      { label: "a.", text: "Berapa jumlah sisi pada prisma segiempat? Sebutkan nama masing-masing sisi." },
      { label: "b.", text: "Berapa jumlah rusuk dan titik sudut prisma segiempat?" },
      { label: "c.", text: "Apakah kubus termasuk prisma segiempat? Jelaskan." },
    ],
  }),
  Qn(9, "Luas Permukaan Prisma Segiempat – UN Style", {
    type: "mixed",
    content: "Sebuah prisma dengan alas persegi panjang 8 cm × 6 cm dan tinggi prisma 12 cm.",
    diagram: <PrismaSegiempatSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas persegi panjang}" },
      { label: "b.", math: "\\text{Hitung keliling alas: } K = 2(8 + 6)" },
      { label: "c.", math: "\\text{Hitung luas permukaan: } L = 2(8 \\times 6) + (28 \\times 12)" },
    ],
  }),
  Qn(10, "Volume Prisma Segiempat – UN Style", {
    type: "mixed",
    content: "Sebuah prisma dengan alas persegi panjang 10 cm × 7 cm dan tinggi 9 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas persegi panjang}" },
      { label: "b.", math: "\\text{Hitung volume prisma: } V = L_{alas} \\times t" },
      { label: "c.", text: "Hitung luas permukaan prisma tersebut." },
    ],
  }),
  Qn(11, "Luas Permukaan Prisma – Soal ANBK", {
    type: "mixed",
    content: "Sebuah tenda berbentuk prisma segitiga. Alas berbentuk segitiga sama kaki dengan sisi alas 4 m dan tinggi segitiga 3 m. Panjang tenda 6 m.",
    diagram: <PrismaSegitigaSVG t="6 m" />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas segitiga: } L = \\frac{1}{2} \\times 4 \\times 3" },
      { label: "b.", text: "Hitung luas semua sisi tegak (selimut) tenda." },
      { label: "c.", text: "Hitung total luas kain yang dibutuhkan untuk membuat tenda (tanpa alas)." },
    ],
  }),
  Qn(12, "Soal Cerita – Atap Rumah", {
    type: "mixed",
    content: "Atap sebuah rumah berbentuk prisma segitiga. Alas segitiga memiliki lebar 8 m dan tinggi 3 m. Panjang rumah 12 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas segitiga alas atap}" },
      { label: "b.", text: "Hitung volume ruang di dalam atap." },
      { label: "c.", text: "Jika seluruh bidang miring atap akan dipasang genteng, hitung luasnya. (Gunakan Pythagoras untuk sisi miring.)" },
    ],
  }),
  Qn(13, "Mencari Tinggi Prisma dari Volume – UN", {
    type: "mixed",
    content: "Sebuah prisma segitiga memiliki volume 360 cm³. Alasnya berbentuk segitiga siku-siku dengan sisi siku 6 cm dan 8 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas: } L_{\\triangle} = \\frac{1}{2} \\times 6 \\times 8 = \\ldots" },
      { label: "b.", math: "\\text{Dari } V = L_{\\triangle} \\times t, \\text{ tentukan } t" },
      { label: "c.", text: "Hitung luas permukaan prisma tersebut." },
    ],
  }),
  Qn(14, "Soal UN – Prisma Segitiga Sama Sisi", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan alas segitiga sama sisi bersisi 6 cm dan tinggi prisma 10 cm.",
    diagram: <PrismaSegitigaSVG a="6" b="6" c="6" t="10" />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas: } L_{\\triangle} = \\frac{\\sqrt{3}}{4} \\times 6^2 = 9\\sqrt{3} \\approx 15{,}6 \\text{ cm}^2" },
      { label: "b.", math: "\\text{Hitung volume: } V = 9\\sqrt{3} \\times 10 \\approx \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Hitung luas permukaan: } L = 2 \\times 9\\sqrt{3} + 3 \\times (6 \\times 10)" },
    ],
  }),
  Qn(15, "Soal Cerita – Tangki Penampung Prisma", {
    type: "mixed",
    content: "Sebuah tangki air berbentuk prisma segitiga siku-siku. Sisi siku alasnya 1 m dan 1,5 m. Panjang tangki 4 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume tangki dalam m}^3" },
      { label: "b.", math: "\\text{Konversikan ke liter } (1 \\text{ m}^3 = 1000 \\text{ liter})" },
      { label: "c.", text: "Jika tangki diisi 3/4 penuh, berapa liter air di dalamnya?" },
    ],
  }),
  Qn(16, "Soal ANBK – Jenis Prisma Berdasarkan Alas", {
    type: "mixed",
    content: "Prisma dapat dinamai berdasarkan bentuk alasnya.",
    parts: [
      { label: "a.", text: "Sebutkan jenis-jenis prisma berdasarkan bentuk alasnya (minimal 4 jenis)." },
      { label: "b.", text: "Prisma segitiga memiliki berapa sisi? Prisma segilima memiliki berapa sisi?" },
      { label: "c.", math: "\\text{Jika prisma memiliki } n \\text{ sisi pada alasnya, rumuskan jumlah total sisi prisma tersebut.}" },
    ],
  }),
  Qn(17, "Soal TKA – Selimut Prisma", {
    type: "mixed",
    content: "Luas selimut sebuah prisma segitiga adalah 180 cm². Tinggi prisma 12 cm. Alas prisma berbentuk segitiga sama kaki dengan sisi kaki 5 cm dan alas 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling alas segitiga: } K = 5 + 5 + 6 = \\ldots" },
      { label: "b.", math: "\\text{Hitung luas selimut: } L_{selimut} = K \\times t_{prisma}" },
      { label: "c.", math: "\\text{Jika tinggi segitiga alas} = 4 \\text{ cm, hitung luas permukaan total prisma}" },
    ],
  }),
  Qn(18, "Soal UN – Membandingkan Volume Prisma", {
    type: "mixed",
    content: "Prisma A memiliki alas segitiga siku-siku (3,4,5) cm dan tinggi 10 cm. Prisma B memiliki alas persegi dengan sisi 5 cm dan tinggi 8 cm.",
    parts: [
      { label: "a.", text: "Hitung volume Prisma A." },
      { label: "b.", text: "Hitung volume Prisma B." },
      { label: "c.", math: "\\text{Manakah yang memiliki volume lebih besar? Berapa selisihnya?}" },
    ],
  }),
  Qn(19, "Soal ANBK – Tinggi Alas Segitiga", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan volume 540 cm³. Tinggi prisma 15 cm. Alas berbentuk segitiga dengan panjang alas 12 cm.",
    parts: [
      { label: "a.", math: "\\text{Dari } V = L_{\\triangle} \\times t_{prisma}, \\text{ hitung } L_{\\triangle}" },
      { label: "b.", math: "\\text{Dari } L_{\\triangle} = \\frac{1}{2} \\times 12 \\times h, \\text{ hitung tinggi segitiga } h" },
      { label: "c.", text: "Hitung luas permukaan prisma jika ketiga sisi segitiga sama panjang 12 cm." },
    ],
  }),
  Qn(20, "Soal UN – Diagonal Bidang Prisma", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan alas persegi panjang 8 cm × 6 cm dan tinggi 10 cm.",
    diagram: <PrismaSegiempatSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung diagonal sisi pada bidang alas (persegi panjang 8×6)}" },
      { label: "b.", math: "\\text{Hitung diagonal sisi pada bidang tegak (8×10)}" },
      { label: "c.", math: "\\text{Hitung panjang diagonal ruang prisma: } d = \\sqrt{8^2 + 6^2 + 10^2}" },
    ],
  }),
  Qn(21, "Soal Kontekstual – Coklat Berbentuk Prisma", {
    type: "mixed",
    content: "Sebuah coklat berbentuk prisma segitiga sama sisi dengan sisi alas 4 cm dan tinggi 15 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume coklat} \\left(L_{\\triangle} = \\frac{\\sqrt{3}}{4} \\times 4^2\\right)" },
      { label: "b.", text: "Hitung luas kertas pembungkus (luas permukaan coklat)." },
      { label: "c.", text: "Jika coklat dipotong menjadi 3 bagian sama panjang, berapakah volume setiap potongan?" },
    ],
  }),
  Qn(22, "Soal UN – Luas Permukaan dari Volume", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan alas segitiga siku-siku. Volume prisma 240 cm³ dan tinggi prisma 10 cm. Sisi siku alas 4 cm dan 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas segitiga}" },
      { label: "b.", math: "\\text{Verifikasi volume: } 240 = L_{\\triangle} \\times 10" },
      { label: "c.", math: "\\text{Hitung luas permukaan prisma} \\left(\\text{sisi miring alas} = \\sqrt{4^2 + 6^2}\\right)" },
    ],
  }),
  Qn(23, "Soal TKA – Prisma Tegak vs. Miring", {
    type: "mixed",
    content: "Sebuah prisma tegak memiliki alas segitiga siku-siku (5, 12, 13) cm dan tinggi 20 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas: } L = \\frac{1}{2} \\times 5 \\times 12" },
      { label: "b.", math: "\\text{Hitung volume prisma}" },
      { label: "c.", math: "\\text{Hitung luas permukaan prisma}" },
    ],
  }),
  Qn(24, "Soal ANBK – Pembagian Volume", {
    type: "mixed",
    content: "Sebuah kotak berbentuk balok (prisma segiempat) berukuran 24 cm × 18 cm × 10 cm dipotong diagonal pada bidang persegi panjangnya, menghasilkan dua prisma segitiga.",
    parts: [
      { label: "a.", text: "Hitung volume kotak asal." },
      { label: "b.", text: "Hitung volume setiap prisma segitiga hasil potongan." },
      { label: "c.", math: "\\text{Verifikasi: } V_{balok} = 2 \\times V_{prisma}" },
    ],
  }),
  Qn(25, "Soal UN Terapan – Kolam Ikan Prisma", {
    type: "mixed",
    content: "Sebuah kolam ikan berbentuk prisma segitiga siku-siku. Alas segitiga memiliki sisi siku 1,2 m dan 0,9 m. Panjang kolam 3 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume kolam dalam m}^3" },
      { label: "b.", math: "\\text{Konversikan ke liter}" },
      { label: "c.", text: "Jika kolam diisi 5/6 penuh, berapa liter air yang dibutuhkan?" },
    ],
  }),
  Qn(26, "Menentukan Luas Alas dari Luas Permukaan – UN", {
    type: "mixed",
    content: "Sebuah prisma segitiga sama sisi memiliki luas permukaan 216 cm². Tinggi prisma 8 cm dan sisi alas segitiga 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas 3 sisi tegak: } 3 \\times (6 \\times 8) = \\ldots" },
      { label: "b.", math: "\\text{Dari } L_{total} = 2L_{\\triangle} + L_{tegak}, \\text{ hitung } L_{\\triangle}" },
      { label: "c.", math: "\\text{Verifikasi dengan } L_{\\triangle} = \\frac{\\sqrt{3}}{4} \\times 6^2" },
    ],
  }),
  Qn(27, "Soal Gabungan – Prisma di Atas Balok", {
    type: "mixed",
    content: "Sebuah bangunan terdiri dari sebuah balok berukuran 6 m × 4 m × 3 m dan sebuah prisma segitiga di atasnya. Alas prisma sama dengan alas balok (6×4 m) dan tinggi prisma 2 m.",
    parts: [
      { label: "a.", text: "Hitung volume balok." },
      { label: "b.", text: "Hitung volume prisma." },
      { label: "c.", text: "Hitung total volume bangunan tersebut." },
    ],
  }),
  Qn(28, "Soal ANBK – Perbandingan Prisma dan Balok", {
    type: "mixed",
    content: "Sebuah prisma segitiga siku-siku (3, 4, 5) cm dengan tinggi 10 cm, dan sebuah balok dengan alas 3 × 4 cm dan tinggi 5 cm.",
    parts: [
      { label: "a.", text: "Hitung volume prisma segitiga." },
      { label: "b.", text: "Hitung volume balok." },
      { label: "c.", math: "\\text{Berapa perbandingan } V_{prisma} : V_{balok}?" },
    ],
  }),
  Qn(29, "Soal UN – Jumlah Rusuk, Titik Sudut, Sisi Prisma n-gon", {
    type: "mixed",
    content: "Sebuah prisma dengan alas segi-n (n sisi pada alasnya).",
    parts: [
      { label: "a.", math: "\\text{Nyatakan dalam rumus: jumlah rusuk} = \\ldots \\times n" },
      { label: "b.", math: "\\text{Nyatakan dalam rumus: jumlah titik sudut} = \\ldots \\times n" },
      { label: "c.", math: "\\text{Nyatakan dalam rumus: jumlah sisi} = n + \\ldots" },
    ],
  }),
  Qn(30, "Soal TKA – Volume Prisma dari Jaring-Jaring", {
    type: "mixed",
    content: "Sebuah jaring-jaring prisma segitiga terdiri dari 2 segitiga siku-siku (3, 4, 5) cm dan 3 persegi panjang.",
    diagram: <PrismaNetSVG />,
    parts: [
      { label: "a.", text: "Tentukan tinggi prisma jika luas salah satu sisi tegak (sisi terpanjang) adalah 50 cm²." },
      { label: "b.", text: "Hitung volume prisma tersebut." },
      { label: "c.", text: "Hitung luas permukaan total prisma." },
    ],
  }),
  Qn(31, "Soal Cerita UN – Kotak Kado Prisma", {
    type: "mixed",
    content: "Sebuah kotak kado berbentuk prisma segitiga. Alas berbentuk segitiga sama sisi dengan sisi 8 cm. Tinggi prisma 20 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas: } L = \\frac{\\sqrt{3}}{4} \\times 8^2 = 16\\sqrt{3} \\approx 27{,}7 \\text{ cm}^2" },
      { label: "b.", text: "Hitung volume kotak kado." },
      { label: "c.", text: "Hitung luas kertas pembungkus minimum (luas permukaan)." },
    ],
  }),
  Qn(32, "Soal Olimpiade – Prisma Segilima", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan alas segilima beraturan bersisi 4 cm. Tinggi segitiga dalam segilima = 2,75 cm. Tinggi prisma 10 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas segilima: } L = 5 \\times \\frac{1}{2} \\times 4 \\times 2{,}75" },
      { label: "b.", math: "\\text{Hitung volume prisma}" },
      { label: "c.", math: "\\text{Hitung luas permukaan: } L = 2L_{alas} + 5 \\times (4 \\times 10)" },
    ],
  }),
  Qn(33, "Soal ANBK – Mengisi Prisma dengan Cairan", {
    type: "mixed",
    content: "Sebuah wadah berbentuk prisma segitiga dengan alas segitiga siku-siku (6, 8, 10) cm dan tinggi 30 cm.",
    parts: [
      { label: "a.", text: "Hitung volume total wadah." },
      { label: "b.", text: "Wadah diisi minyak goreng hingga 2/3 penuh. Berapa cm³ minyak dalam wadah?" },
      { label: "c.", text: "Berapa tinggi minyak dalam wadah tersebut?" },
    ],
  }),
  Qn(34, "Soal UN – Panjang Rusuk Tegak dari Luas Selimut", {
    type: "mixed",
    content: "Sebuah prisma segitiga sama kaki. Alas segitiga: kaki 5 cm, alas 6 cm. Luas selimut prisma = 192 cm².",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling alas segitiga: } K = 5 + 5 + 6 = \\ldots" },
      { label: "b.", math: "\\text{Dari } L_{selimut} = K \\times t, \\text{ tentukan } t_{prisma}" },
      { label: "c.", math: "\\text{Tinggi segitiga} = 4 \\text{ cm. Hitung volume prisma.}" },
    ],
  }),
  Qn(35, "Soal TKA – Prisma Dalam Konteks Arsitektur", {
    type: "mixed",
    content: "Sebuah jembatan memiliki penopang berbentuk prisma segitiga. Alas segitiga isosceles dengan sisi kaki 5 m dan sisi alas 6 m (tinggi segitiga 4 m). Panjang penopang 50 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas penampang (alas segitiga)}" },
      { label: "b.", math: "\\text{Hitung volume beton yang dibutuhkan (volume prisma) dalam m}^3" },
      { label: "c.", math: "\\text{Hitung luas seluruh permukaan penopang (tanpa tutup di ujung)} \\text{ dalam m}^2" },
    ],
  }),
  Qn(36, "Soal UN Variasi – Mencari Sisi Alas dari Volume", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan alas segitiga sama sisi. Volume prisma 216√3 cm³ dan tinggi prisma 12 cm.",
    parts: [
      { label: "a.", math: "\\text{Dari } V = L_{\\triangle} \\times t, \\text{ hitung } L_{\\triangle}" },
      { label: "b.", math: "\\text{Dari } L_{\\triangle} = \\frac{\\sqrt{3}}{4} s^2, \\text{ tentukan sisi } s" },
      { label: "c.", text: "Hitung luas permukaan prisma tersebut." },
    ],
  }),
  Qn(37, "Soal ANBK – Membandingkan Prisma Berbeda Alas", {
    type: "mixed",
    content: "Prisma I: alas segitiga siku-siku (6,8,10) cm, tinggi 12 cm. Prisma II: alas persegi sisi 7 cm, tinggi 6 cm.",
    parts: [
      { label: "a.", text: "Hitung volume Prisma I dan Prisma II." },
      { label: "b.", text: "Hitung luas permukaan Prisma I dan Prisma II." },
      { label: "c.", text: "Prisma mana yang lebih efisien untuk digunakan sebagai wadah? (volume terbesar dengan bahan terkecil)" },
    ],
  }),
  Qn(38, "Soal UN – Prisma dan Pythagoras", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan alas segitiga siku-siku. Diketahui hypotenuse alas = 13 cm dan salah satu sisi siku = 5 cm. Tinggi prisma 18 cm.",
    diagram: <PrismaSikuSVG />,
    parts: [
      { label: "a.", math: "\\text{Gunakan Pythagoras untuk mencari sisi siku lainnya}" },
      { label: "b.", math: "\\text{Hitung luas alas segitiga}" },
      { label: "c.", math: "\\text{Hitung volume dan luas permukaan prisma}" },
    ],
  }),
  Qn(39, "Soal Gabungan – Volume Benda Komposit", {
    type: "mixed",
    content: "Sebuah benda terdiri dari dua prisma segitiga siku-siku yang identik dengan alas (4, 3, 5) cm dan tinggi 10 cm, digabungkan pada sisi miring alasnya membentuk prisma segiempat.",
    parts: [
      { label: "a.", text: "Hitung volume satu prisma segitiga." },
      { label: "b.", text: "Hitung volume total benda komposit (dua prisma)." },
      { label: "c.", text: "Benda komposit ini berbentuk apa? Hitung dimensi dan verifikasi volumenya." },
    ],
  }),
  Qn(40, "Soal UN/ANBK – Gabungan Konsep Prisma", {
    type: "mixed",
    content: "Sebuah prisma tegak dengan alas segitiga siku-siku bersisi 6 cm, 8 cm, dan 10 cm. Tinggi prisma 14 cm.",
    diagram: <PrismaSikuSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas segitiga}" },
      { label: "b.", math: "\\text{Hitung volume prisma}" },
      { label: "c.", math: "\\text{Hitung luas permukaan prisma}" },
      { label: "d.", math: "\\text{Hitung luas selimut (tanpa alas dan tutup)}" },
    ],
  }),
];

const PrismaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔷</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-amber-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,191,36,0.7)' }}>
            PRISMA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Bangun Ruang Sisi Datar · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
            <span className="text-amber-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-xs font-bold mb-3">📐 Rumus-Rumus Penting Prisma</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Luas Permukaan", math: "L = 2L_{alas} + K_{alas} \\times t" },
              { name: "Volume", math: "V = L_{alas} \\times t" },
              { name: "Luas Selimut", math: "L_s = K_{alas} \\times t" },
              { name: "L Segitiga Siku", math: "L = \\tfrac{1}{2} \\times a \\times b" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-amber-300 overflow-x-auto text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
          <div className="mt-2 bg-white/5 rounded-lg px-3 py-2">
            <div className="text-white/40 text-[9px] uppercase mb-1">Prisma Segitiga</div>
            <p className="text-white/70 text-xs">6 titik sudut · 9 rusuk · 5 sisi (2 segitiga + 3 persegi panjang)</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/80 to-orange-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                    <span className="text-amber-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-amber-900/20 border border-amber-500/20 rounded-lg px-4 py-3 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-amber-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrismaPage;
