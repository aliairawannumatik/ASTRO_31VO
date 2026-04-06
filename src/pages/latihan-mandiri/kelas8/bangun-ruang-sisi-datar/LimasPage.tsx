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

/* ── SVG: Limas Segiempat (Square Pyramid) ── */
const LimasSegiempatSVG = ({
  s = "s", t = "t", showHeight = false, showSlant = false,
}: { s?: string; t?: string; showHeight?: boolean; showSlant?: boolean }) => (
  <svg width="190" height="155" viewBox="0 0 190 155" className="mx-auto">
    <defs>
      <linearGradient id="lfFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="lfRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.07" />
      </linearGradient>
      <linearGradient id="lfLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Alas (bottom square, in perspective) */}
    <polygon points="30,130 130,130 155,105 55,105" fill="#a855f7" fillOpacity="0.12" stroke="#c084fc" strokeWidth="1.5" />
    {/* Hidden back edges of base */}
    <line x1="30" y1="130" x2="55" y2="105" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="105" x2="155" y2="105" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Apex T at top */}
    {/* Front-left face */}
    <polygon points="30,130 130,130 92,22" fill="url(#lfFront)" stroke="#c084fc" strokeWidth="1.8" />
    {/* Front-right face */}
    <polygon points="130,130 155,105 92,22" fill="url(#lfRight)" stroke="#c084fc" strokeWidth="1.8" />
    {/* Back-left face (dashed outline) */}
    <line x1="30" y1="130" x2="92" y2="22" stroke="#c084fc" strokeWidth="1.5" strokeOpacity="0.9" />
    <line x1="55" y1="105" x2="92" y2="22" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Height */}
    {showHeight && (
      <>
        <line x1="92" y1="22" x2="92" y2="117" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3" />
        <circle cx="92" cy="117" r="2.5" fill="#f59e0b" />
        <text x="96" y="75" fill="#f59e0b" fontSize="10" fontFamily="monospace">{t}</text>
        <polyline points="88,117 88,113 92,113" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
      </>
    )}
    {/* Slant height */}
    {showSlant && (
      <line x1="92" y1="22" x2="80" y2="130" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5,3" />
    )}
    {/* Vertices */}
    {[[30,130],[130,130],[155,105],[55,105],[92,22]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#c084fc" />
    ))}
    {/* Labels */}
    <text x="18" y="138" fill="white" fontSize="11" fontFamily="monospace">A</text>
    <text x="132" y="138" fill="white" fontSize="11" fontFamily="monospace">B</text>
    <text x="158" y="108" fill="white" fontSize="11" fontFamily="monospace">C</text>
    <text x="44" y="105" fill="white" fontSize="11" fontFamily="monospace">D</text>
    <text x="87" y="17" fill="white" fontSize="11" fontFamily="monospace">T</text>
    {/* Dimension label */}
    <text x="80" y="148" fill="#c084fc" fontSize="10" textAnchor="middle">{s}</text>
    {!showHeight && <text x="155" y="75" fill="#c084fc" fontSize="10" textAnchor="middle">{t}</text>}
  </svg>
);

/* ── SVG: Limas Segitiga (Triangular Pyramid / Tetrahedron) ── */
const LimasSegitigaSVG = () => (
  <svg width="175" height="145" viewBox="0 0 175 145" className="mx-auto">
    {/* Base triangle */}
    <polygon points="20,125 130,125 75,90" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" strokeWidth="1.5" />
    {/* Hidden base edge */}
    <line x1="20" y1="125" x2="75" y2="90" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Lateral faces */}
    <polygon points="20,125 130,125 85,20" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="1.8" />
    <polygon points="130,125 75,90 85,20" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" strokeWidth="1.8" />
    <line x1="20" y1="125" x2="85" y2="20" stroke="#c084fc" strokeWidth="1.5" />
    <line x1="75" y1="90" x2="85" y2="20" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Vertices */}
    {[[20,125],[130,125],[75,90],[85,20]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#c084fc" />
    ))}
    <text x="8" y="132" fill="white" fontSize="11" fontFamily="monospace">A</text>
    <text x="133" y="132" fill="white" fontSize="11" fontFamily="monospace">B</text>
    <text x="68" y="89" fill="white" fontSize="11" fontFamily="monospace">C</text>
    <text x="82" y="15" fill="white" fontSize="11" fontFamily="monospace">T</text>
    <text x="88" y="140" fill="#c084fc" fontSize="9" textAnchor="middle">Limas Segitiga</text>
  </svg>
);

/* ── SVG: Limas dengan Garis Tinggi dan Apotema ── */
const LimasTinggiSVG = () => (
  <svg width="190" height="160" viewBox="0 0 190 160" className="mx-auto">
    <polygon points="25,135 130,135 155,110 50,110" fill="#a855f7" fillOpacity="0.12" stroke="#c084fc" strokeWidth="1.5" />
    <line x1="25" y1="135" x2="50" y2="110" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="110" x2="155" y2="110" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <polygon points="25,135 130,135 92,18" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="1.8" />
    <polygon points="130,135 155,110 92,18" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" strokeWidth="1.8" />
    <line x1="25" y1="135" x2="92" y2="18" stroke="#c084fc" strokeWidth="1.5" />
    <line x1="50" y1="110" x2="92" y2="18" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Tinggi limas (vertical dashed) */}
    <line x1="92" y1="18" x2="92" y2="122" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
    <circle cx="92" cy="122" r="2.5" fill="#f59e0b" />
    <polyline points="87,122 87,117 92,117" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
    <text x="97" y="75" fill="#f59e0b" fontSize="11" fontFamily="monospace">t</text>
    {/* Apotema (from apex to midpoint of base edge) */}
    <line x1="92" y1="18" x2="77" y2="135" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5,3" />
    <text x="60" y="90" fill="#34d399" fontSize="10" fontFamily="monospace">apotema (l)</text>
    {/* Vertices */}
    {[[25,135],[130,135],[155,110],[50,110],[92,18]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#c084fc" />
    ))}
    <text x="13" y="143" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="132" y="143" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="158" y="113" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="39" y="110" fill="white" fontSize="10" fontFamily="monospace">D</text>
    <text x="87" y="13" fill="white" fontSize="10" fontFamily="monospace">T</text>
  </svg>
);

/* ── SVG: Jaring-Jaring Limas Segiempat ── */
const LimasNetSVG = () => (
  <svg width="220" height="190" viewBox="0 0 220 190" className="mx-auto">
    {/* Alas (center square) */}
    <rect x="70" y="70" width="70" height="70" fill="#a855f7" fillOpacity="0.2" stroke="#c084fc" strokeWidth="1.5" rx="1" />
    <text x="105" y="108" fill="#e9d5ff" fontSize="9" textAnchor="middle">Alas</text>
    {/* Sisi depan (bottom) */}
    <polygon points="70,140 140,140 105,180" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="1.5" />
    <text x="105" y="163" fill="#e9d5ff" fontSize="8" textAnchor="middle">Depan</text>
    {/* Sisi kiri */}
    <polygon points="70,70 70,140 30,105" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1.5" />
    <text x="53" y="107" fill="#e9d5ff" fontSize="8" textAnchor="middle">Kiri</text>
    {/* Sisi kanan */}
    <polygon points="140,70 140,140 180,105" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1.5" />
    <text x="157" y="107" fill="#e9d5ff" fontSize="8" textAnchor="middle">Kanan</text>
    {/* Sisi belakang (top) */}
    <polygon points="70,70 140,70 105,30" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="1.5" />
    <text x="105" y="58" fill="#e9d5ff" fontSize="8" textAnchor="middle">Belakang</text>
    <text x="105" y="185" fill="#c084fc" fontSize="9" textAnchor="middle">Jaring-jaring limas segiempat</text>
  </svg>
);

/* ── SVG: Limas Segilima ── */
const LimasSegiligaSVG = () => (
  <svg width="185" height="150" viewBox="0 0 185 150" className="mx-auto">
    {/* Pentagon base (perspective) */}
    <polygon points="30,125 95,135 155,115 140,85 45,88" fill="#a855f7" fillOpacity="0.12" stroke="#c084fc" strokeWidth="1.3" />
    {/* Hidden base edges */}
    <line x1="30" y1="125" x2="45" y2="88" stroke="#c084fc" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.5" />
    <line x1="45" y1="88" x2="140" y2="85" stroke="#c084fc" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.5" />
    {/* Lateral edges from apex */}
    <line x1="92" y1="15" x2="30" y2="125" stroke="#c084fc" strokeWidth="1.8" />
    <line x1="92" y1="15" x2="95" y2="135" stroke="#c084fc" strokeWidth="1.8" />
    <line x1="92" y1="15" x2="155" y2="115" stroke="#c084fc" strokeWidth="1.8" />
    <line x1="92" y1="15" x2="140" y2="85" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
    <line x1="92" y1="15" x2="45" y2="88" stroke="#c084fc" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
    {/* Fill 3 visible faces */}
    <polygon points="30,125 95,135 92,15" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="1.5" />
    <polygon points="95,135 155,115 92,15" fill="#a855f7" fillOpacity="0.2" stroke="#c084fc" strokeWidth="1.5" />
    <polygon points="155,115 140,85 92,15" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" strokeWidth="1.5" />
    {/* Vertices */}
    {[[30,125],[95,135],[155,115],[140,85],[45,88],[92,15]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#c084fc" />
    ))}
    <text x="88" y="10" fill="white" fontSize="10" fontFamily="monospace">T</text>
    <text x="92" y="148" fill="#c084fc" fontSize="9" textAnchor="middle">Limas Segilima</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Unsur-Unsur Limas Segiempat", {
    type: "mixed",
    content: "Perhatikan limas segiempat T.ABCD berikut:",
    diagram: <LimasSegiempatSVG s="s" t="t" />,
    parts: [
      { label: "a.", text: "Sebutkan semua titik sudut limas T.ABCD. Ada berapa jumlahnya?" },
      { label: "b.", text: "Sebutkan semua rusuk limas T.ABCD. Ada berapa jumlahnya?" },
      { label: "c.", text: "Sebutkan semua bidang sisi limas T.ABCD. Ada berapa jumlahnya?" },
    ],
  }),
  Qn(2, "Unsur-Unsur Limas Segitiga", {
    type: "mixed",
    content: "Perhatikan limas segitiga T.ABC berikut:",
    diagram: <LimasSegitigaSVG />,
    parts: [
      { label: "a.", text: "Berapa jumlah titik sudut limas segitiga?" },
      { label: "b.", text: "Berapa jumlah rusuk limas segitiga? Kelompokkan rusuk alas dan rusuk tegak." },
      { label: "c.", text: "Berapa jumlah sisi limas segitiga? Sebutkan nama masing-masing sisi." },
    ],
  }),
  Qn(3, "Tinggi Limas dan Apotema", {
    type: "mixed",
    content: "Perhatikan limas segiempat T.ABCD berikut:",
    diagram: <LimasTinggiSVG />,
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan tinggi limas? Tunjukkan pada gambar." },
      { label: "b.", text: "Apa yang dimaksud dengan apotema limas? Apa hubungannya dengan tinggi limas?" },
      { label: "c.", math: "\\text{Jika alas limas berupa persegi bersisi 8 cm dan tinggi limas 3 cm, hitung apotema dengan Pythagoras.}" },
    ],
  }),
  Qn(4, "Rumus Unsur Limas n-gon", {
    type: "mixed",
    content: "Limas dapat dinamai berdasarkan bentuk alasnya. Rumus jumlah unsur limas dengan alas segi-n:",
    parts: [
      { label: "a.", math: "\\text{Jumlah titik sudut} = n + 1" },
      { label: "b.", math: "\\text{Jumlah rusuk} = 2n" },
      { label: "c.", math: "\\text{Jumlah sisi} = n + 1" },
    ],
  }),
  Qn(5, "Limas Segilima – Menghitung Unsur", {
    type: "mixed",
    content: "Perhatikan limas segilima T.ABCDE berikut:",
    diagram: <LimasSegiligaSVG />,
    parts: [
      { label: "a.", math: "\\text{Gunakan rumus: jumlah titik sudut limas segilima} = n + 1 = \\ldots" },
      { label: "b.", math: "\\text{Jumlah rusuk} = 2n = \\ldots" },
      { label: "c.", math: "\\text{Jumlah sisi} = n + 1 = \\ldots" },
    ],
  }),
  Qn(6, "Jaring-Jaring Limas Segiempat", {
    type: "mixed",
    content: "Perhatikan jaring-jaring limas segiempat berikut:",
    diagram: <LimasNetSVG />,
    parts: [
      { label: "a.", text: "Berapa banyak bangun datar yang menyusun jaring-jaring limas segiempat?" },
      { label: "b.", text: "Sebutkan jenis dan jumlah bangun datar pada jaring-jaring tersebut." },
      { label: "c.", text: "Bagaimana cara membedakan jaring-jaring limas dengan jaring-jaring prisma?" },
    ],
  }),
  Qn(7, "Luas Permukaan Limas Segiempat – Rumus", {
    type: "mixed",
    content: "Rumus luas permukaan limas segiempat beraturan dengan sisi alas s dan apotema l:",
    mathContent: "L = s^2 + 4 \\times \\left(\\frac{1}{2} \\times s \\times l\\right) = s^2 + 2sl",
    parts: [
      { label: "a.", math: "\\text{Hitung L jika } s = 10 \\text{ cm dan } l = 13 \\text{ cm}" },
      { label: "b.", math: "\\text{Hitung L jika } s = 8 \\text{ cm dan } l = 10 \\text{ cm}" },
      { label: "c.", math: "\\text{Hitung L jika } s = 6 \\text{ cm dan } l = 5 \\text{ cm}" },
    ],
  }),
  Qn(8, "Menghitung Apotema Sebelum Luas Permukaan – UN Style", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD dengan sisi alas 12 cm dan tinggi limas 8 cm.",
    diagram: <LimasTinggiSVG />,
    parts: [
      { label: "a.", math: "\\text{Setengah sisi alas} = \\frac{12}{2} = 6 \\text{ cm}" },
      { label: "b.", math: "\\text{Apotema: } l = \\sqrt{t^2 + \\left(\\frac{s}{2}\\right)^2} = \\sqrt{8^2 + 6^2} = \\ldots" },
      { label: "c.", math: "\\text{Luas permukaan: } L = s^2 + 2sl = 12^2 + 2 \\times 12 \\times l" },
    ],
  }),
  Qn(9, "Volume Limas – Rumus", {
    type: "mixed",
    content: "Rumus volume limas:",
    mathContent: "V = \\frac{1}{3} \\times L_{alas} \\times t",
    parts: [
      { label: "a.", math: "\\text{Hitung V limas segiempat: } s=6 \\text{ cm}, t=8 \\text{ cm}" },
      { label: "b.", math: "\\text{Hitung V limas segiempat: } s=10 \\text{ cm}, t=12 \\text{ cm}" },
      { label: "c.", math: "\\text{Hitung V limas segitiga siku-siku } (3{,}4{,}5) \\text{ cm, tinggi } t=9 \\text{ cm}" },
    ],
  }),
  Qn(10, "Volume Limas Segiempat – Soal UN", {
    type: "mixed",
    content: "Sebuah limas segiempat beraturan T.ABCD memiliki alas persegi bersisi 9 cm dan tinggi 12 cm.",
    diagram: <LimasSegiempatSVG s="9" t="12" showHeight={true} />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas: } L_{alas} = 9^2 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "\\text{Hitung volume: } V = \\frac{1}{3} \\times 81 \\times 12 = \\ldots \\text{ cm}^3" },
      { label: "c.", text: "Hitung apotema dan luas permukaan limas tersebut." },
    ],
  }),
  Qn(11, "Mencari Tinggi Limas dari Volume – UN", {
    type: "mixed",
    content: "Sebuah limas segiempat memiliki alas persegi bersisi 6 cm. Volumenya adalah 72 cm³.",
    parts: [
      { label: "a.", math: "\\text{Dari } V = \\frac{1}{3} \\times s^2 \\times t: \\quad 72 = \\frac{1}{3} \\times 36 \\times t" },
      { label: "b.", math: "\\text{Selesaikan untuk } t" },
      { label: "c.", text: "Hitung apotema dan luas permukaan limas tersebut." },
    ],
  }),
  Qn(12, "Mencari Sisi Alas dari Volume – UN Style", {
    type: "mixed",
    content: "Sebuah limas segiempat beraturan memiliki tinggi 15 cm dan volume 500 cm³.",
    parts: [
      { label: "a.", math: "\\text{Dari } V = \\frac{1}{3} \\times s^2 \\times t: \\quad 500 = \\frac{1}{3} \\times s^2 \\times 15" },
      { label: "b.", math: "\\text{Selesaikan: } s^2 = \\ldots \\Rightarrow s = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitung luas permukaan limas tersebut." },
    ],
  }),
  Qn(13, "Luas Permukaan Limas Segitiga – ANBK", {
    type: "mixed",
    content: "Limas segitiga sama sisi T.ABC dengan alas segitiga sama sisi bersisi 6 cm dan apotema sisi tegak 5 cm.",
    diagram: <LimasSegitigaSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas segitiga: } L_{\\triangle} = \\frac{\\sqrt{3}}{4} \\times 6^2 = 9\\sqrt{3}" },
      { label: "b.", math: "\\text{Hitung luas 3 sisi tegak: } 3 \\times \\frac{1}{2} \\times 6 \\times 5 = \\ldots" },
      { label: "c.", math: "\\text{Luas permukaan total} = L_{alas} + L_{tegak}" },
    ],
  }),
  Qn(14, "Luas Selimut Limas – Soal UN", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD dengan sisi alas 8 cm dan panjang rusuk tegak 10 cm.",
    diagram: <LimasSegiempatSVG s="8" t="?" />,
    parts: [
      { label: "a.", math: "\\text{Tinggi segitiga sisi tegak (apotema): } l = \\sqrt{10^2 - 4^2} = \\ldots" },
      { label: "b.", math: "\\text{Luas selimut} = 4 \\times \\frac{1}{2} \\times 8 \\times l = \\ldots" },
      { label: "c.", math: "\\text{Luas permukaan total} = 8^2 + \\text{luas selimut}" },
    ],
  }),
  Qn(15, "Soal Cerita – Piramida Mini", {
    type: "mixed",
    content: "Sebuah piramida mainan berbentuk limas segiempat beraturan dengan alas persegi bersisi 10 cm dan tinggi 12 cm.",
    diagram: <LimasSegiempatSVG s="10" t="12" showHeight={true} />,
    parts: [
      { label: "a.", text: "Hitung volume piramida." },
      { label: "b.", text: "Hitung apotema limas tersebut." },
      { label: "c.", text: "Hitung luas permukaan seluruh piramida." },
    ],
  }),
  Qn(16, "Soal ANBK – Perbandingan Volume Limas dan Kubus", {
    type: "mixed",
    content: "Sebuah kubus memiliki rusuk 6 cm. Sebuah limas segiempat memiliki alas yang sama dengan sisi kubus dan tinggi sama dengan rusuk kubus.",
    parts: [
      { label: "a.", text: "Hitung volume kubus." },
      { label: "b.", text: "Hitung volume limas." },
      { label: "c.", math: "\\text{Nyatakan perbandingan volume limas : volume kubus}" },
    ],
  }),
  Qn(17, "Soal TKA – Limas dan Balok", {
    type: "mixed",
    content: "Sebuah balok berukuran 12 cm × 12 cm × 8 cm. Sebuah limas segiempat beraturan memiliki alas yang sama (12 × 12 cm) dan tinggi 8 cm.",
    parts: [
      { label: "a.", text: "Hitung volume balok." },
      { label: "b.", text: "Hitung volume limas." },
      { label: "c.", math: "\\text{Berapa persen volume limas dari volume balok?}" },
    ],
  }),
  Qn(18, "Soal UN – Limas dan Pythagoras", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD memiliki sisi alas 10 cm dan rusuk tegak (TA = TB = TC = TD) = 13 cm.",
    diagram: <LimasTinggiSVG />,
    parts: [
      { label: "a.", math: "\\text{Diagonal alas: } d = s\\sqrt{2} = 10\\sqrt{2} \\text{ cm}" },
      { label: "b.", math: "\\text{Tinggi limas: } t = \\sqrt{TA^2 - \\left(\\frac{d}{2}\\right)^2} = \\sqrt{169 - 50} = \\ldots" },
      { label: "c.", text: "Hitung volume limas tersebut." },
    ],
  }),
  Qn(19, "Soal UN Variasi – Mencari Rusuk Tegak dari Tinggi", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD memiliki sisi alas 8 cm dan tinggi 15 cm.",
    parts: [
      { label: "a.", math: "\\text{Setengah diagonal alas} = \\frac{8\\sqrt{2}}{2} = 4\\sqrt{2} \\text{ cm}" },
      { label: "b.", math: "\\text{Rusuk tegak: } TA = \\sqrt{t^2 + \\left(\\frac{d}{2}\\right)^2} = \\sqrt{225 + 32} = \\ldots" },
      { label: "c.", text: "Hitung luas permukaan limas." },
    ],
  }),
  Qn(20, "Soal Cerita – Atap Berbentuk Limas", {
    type: "mixed",
    content: "Atap sebuah rumah berbentuk limas segiempat beraturan dengan alas persegi 8 m × 8 m dan tinggi 3 m.",
    diagram: <LimasSegiempatSVG s="8m" t="3m" showHeight={true} />,
    parts: [
      { label: "a.", math: "\\text{Hitung apotema atap: } l = \\sqrt{3^2 + 4^2} = \\ldots \\text{ m}" },
      { label: "b.", text: "Hitung luas seluruh bidang miring atap (tanpa alas)." },
      { label: "c.", text: "Hitung volume ruang di bawah atap." },
    ],
  }),
  Qn(21, "Soal ANBK – Biaya Material Atap Limas", {
    type: "mixed",
    content: "Atap berbentuk limas segiempat beraturan: alas 6 m × 6 m, tinggi 4 m. Genteng dijual Rp120.000 per m².",
    parts: [
      { label: "a.", math: "\\text{Hitung apotema: } l = \\sqrt{4^2 + 3^2} = \\ldots \\text{ m}" },
      { label: "b.", text: "Hitung luas seluruh bidang miring atap." },
      { label: "c.", text: "Hitung total biaya genteng untuk atap tersebut." },
    ],
  }),
  Qn(22, "Soal UN – Volume Limas Segitiga", {
    type: "mixed",
    content: "Sebuah limas segitiga T.ABC memiliki alas segitiga siku-siku dengan sisi siku 6 cm dan 8 cm. Tinggi limas 10 cm.",
    diagram: <LimasSegitigaSVG />,
    parts: [
      { label: "a.", math: "\\text{Luas alas segitiga: } L = \\frac{1}{2} \\times 6 \\times 8 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "\\text{Volume: } V = \\frac{1}{3} \\times L_{\\triangle} \\times t = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Sisi miring alas} = \\sqrt{6^2 + 8^2} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(23, "Soal Olimpiade – Limas dan Prisma", {
    type: "mixed",
    content: "Sebuah prisma segitiga dan sebuah limas segitiga memiliki alas dan tinggi yang sama.",
    parts: [
      { label: "a.", math: "\\text{Jika alas segitiga } = 24 \\text{ cm}^2 \\text{ dan tinggi } = 10 \\text{ cm, hitung volume prisma}" },
      { label: "b.", math: "\\text{Hitung volume limas dengan data yang sama}" },
      { label: "c.", math: "\\text{Nyatakan } \\frac{V_{limas}}{V_{prisma}} = \\ldots" },
    ],
  }),
  Qn(24, "Soal TKA – Mengisi Limas dengan Pasir", {
    type: "mixed",
    content: "Sebuah cetakan berbentuk limas segiempat beraturan dengan alas 15 cm × 15 cm dan tinggi 20 cm akan diisi pasir.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume cetakan}" },
      { label: "b.", math: "\\text{Konversikan ke liter } (1 \\text{ liter} = 1000 \\text{ cm}^3)" },
      { label: "c.", text: "Jika cetakan hanya diisi 2/3 penuh, berapa cm³ pasir yang dibutuhkan?" },
    ],
  }),
  Qn(25, "Soal UN – Luas Permukaan Limas Segitiga Sama Sisi", {
    type: "mixed",
    content: "Sebuah limas segitiga sama sisi T.ABC. Alas segitiga sama sisi bersisi 10 cm. Rusuk tegak (TA=TB=TC) = 13 cm.",
    diagram: <LimasSegitigaSVG />,
    parts: [
      { label: "a.", math: "\\text{Tinggi sisi tegak (apotema sisi): } l = \\sqrt{13^2 - 5^2} = \\ldots" },
      { label: "b.", math: "\\text{Luas 3 sisi tegak: } 3 \\times \\frac{1}{2} \\times 10 \\times l" },
      { label: "c.", math: "\\text{Luas alas: } \\frac{\\sqrt{3}}{4} \\times 10^2 = 25\\sqrt{3} \\approx 43{,}3 \\text{ cm}^2" },
    ],
  }),
  Qn(26, "Soal ANBK – Limas Segilima Beraturan", {
    type: "mixed",
    content: "Sebuah limas segilima beraturan T.ABCDE dengan alas segilima bersisi 6 cm (luas alas ≈ 61,9 cm²) dan tinggi limas 8 cm.",
    diagram: <LimasSegiligaSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung volume limas: } V = \\frac{1}{3} \\times 61{,}9 \\times 8" },
      { label: "b.", math: "\\text{Berapa jumlah rusuk dan sisi limas segilima?}" },
      { label: "c.", text: "Berapa jumlah titik sudutnya?" },
    ],
  }),
  Qn(27, "Soal UN – Mencari Tinggi dari Luas Permukaan", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD memiliki sisi alas 6 cm. Luas selimutnya 120 cm².",
    parts: [
      { label: "a.", math: "\\text{Dari luas selimut} = 4 \\times \\frac{1}{2} \\times 6 \\times l = 120, \\text{ tentukan apotema } l" },
      { label: "b.", math: "\\text{Dari apotema } l = \\sqrt{t^2 + 3^2}, \\text{ tentukan tinggi } t" },
      { label: "c.", math: "\\text{Hitung volume limas}" },
    ],
  }),
  Qn(28, "Soal Kontekstual – Topi Ulang Tahun", {
    type: "mixed",
    content: "Sebuah topi ulang tahun berbentuk limas segitiga sama sisi. Sisi alas 12 cm, tinggi 16 cm.",
    diagram: <LimasSegitigaSVG />,
    parts: [
      { label: "a.", math: "\\text{Apotema sisi tegak: } l = \\sqrt{16^2 + 6^2} = \\ldots" },
      { label: "b.", text: "Hitung luas bahan yang dibutuhkan untuk membuat topi (tanpa alas)." },
      { label: "c.", text: "Hitung volume topi." },
    ],
  }),
  Qn(29, "Soal UN – Diagonal Alas Limas dan Tinggi", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD dengan sisi alas 12 cm. Rusuk tegak TA = 10 cm.",
    diagram: <LimasTinggiSVG />,
    parts: [
      { label: "a.", math: "\\text{Diagonal alas: } d = 12\\sqrt{2} \\approx 16{,}97 \\text{ cm}" },
      { label: "b.", math: "\\text{Tinggi limas: } t = \\sqrt{TA^2 - \\left(\\frac{d}{2}\\right)^2} = \\sqrt{100 - 72} = \\ldots" },
      { label: "c.", math: "\\text{Hitung volume limas}" },
    ],
  }),
  Qn(30, "Soal Cerita ANBK – Monumen Berbentuk Limas", {
    type: "mixed",
    content: "Sebuah monumen berbentuk limas segiempat beraturan dengan sisi alas 6 m dan tinggi 8 m.",
    diagram: <LimasSegiempatSVG s="6m" t="8m" showHeight={true} />,
    parts: [
      { label: "a.", math: "\\text{Hitung volume monumen dalam m}^3" },
      { label: "b.", math: "\\text{Hitung apotema: } l = \\sqrt{8^2 + 3^2}" },
      { label: "c.", text: "Hitung luas permukaan monumen yang perlu dicat (tanpa alas)." },
    ],
  }),
  Qn(31, "Soal TKA – Piramida Agung Giza (Kontekstual)", {
    type: "mixed",
    content: "Piramida Agung Giza berbentuk limas segiempat dengan alas persegi sekitar 230 m × 230 m dan tinggi aslinya sekitar 146 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume Piramida Giza dalam m}^3" },
      { label: "b.", math: "\\text{Apotema: } l = \\sqrt{146^2 + 115^2} \\approx \\ldots \\text{ m}" },
      { label: "c.", math: "\\text{Hitung luas permukaan 4 sisi miring piramida}" },
    ],
  }),
  Qn(32, "Soal Gabungan – Limas di Atas Kubus", {
    type: "mixed",
    content: "Sebuah bangunan terdiri dari kubus berrusuk 6 cm dengan limas segiempat beraturan di atasnya. Alas limas = sisi kubus dan tinggi limas = 4 cm.",
    parts: [
      { label: "a.", text: "Hitung volume kubus." },
      { label: "b.", text: "Hitung volume limas." },
      { label: "c.", text: "Hitung total volume bangunan tersebut." },
    ],
  }),
  Qn(33, "Soal UN – Luas Permukaan dari Limas Segiempat Beraturan", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD dengan sisi alas s = 10 cm dan tinggi t = 12 cm.",
    diagram: <LimasSegiempatSVG s="10" t="12" showHeight={true} />,
    parts: [
      { label: "a.", math: "\\text{Hitung apotema: } l = \\sqrt{12^2 + 5^2} = \\ldots" },
      { label: "b.", math: "\\text{Hitung luas selimut: } 4 \\times \\frac{1}{2} \\times 10 \\times l" },
      { label: "c.", math: "\\text{Hitung luas permukaan total: } L = 10^2 + \\text{luas selimut}" },
    ],
  }),
  Qn(34, "Soal Penalaran – Membandingkan Dua Limas", {
    type: "mixed",
    content: "Limas A: alas persegi 8×8 cm, tinggi 6 cm. Limas B: alas persegi 6×6 cm, tinggi 8 cm.",
    parts: [
      { label: "a.", text: "Hitung volume Limas A dan Limas B." },
      { label: "b.", text: "Limas mana yang volumenya lebih besar?" },
      { label: "c.", math: "\\text{Nyatakan perbandingan } V_A : V_B" },
    ],
  }),
  Qn(35, "Soal UN – Jaring-Jaring Limas", {
    type: "mixed",
    content: "Perhatikan jaring-jaring limas segiempat beraturan berikut:",
    diagram: <LimasNetSVG />,
    parts: [
      { label: "a.", text: "Jika sisi alas persegi = 8 cm dan tinggi segitiga sisi tegak = 7 cm, hitung luas jaring-jaring." },
      { label: "b.", text: "Persegi panjang mana pada jaring-jaring yang akan menjadi sisi tegak limas?" },
      { label: "c.", math: "\\text{Luas total} = L_{alas} + 4 \\times L_{\\triangle tegak}" },
    ],
  }),
  Qn(36, "Soal ANBK – Mengubah Tinggi Limas", {
    type: "mixed",
    content: "Limas segiempat beraturan memiliki alas persegi 8 cm dan tinggi 6 cm.",
    parts: [
      { label: "a.", text: "Hitung volume limas tersebut." },
      { label: "b.", text: "Jika tingginya dilipatduakan menjadi 12 cm, berapa volume limas baru?" },
      { label: "c.", math: "\\text{Berapa kali lipat volume bertambah jika tinggi dikalikan 2?}" },
    ],
  }),
  Qn(37, "Soal UN – Limas Segitiga Siku-Siku", {
    type: "mixed",
    content: "Limas T.ABC dengan alas segitiga siku-siku: AB = 8 cm, BC = 6 cm, ∠B = 90°. Tinggi limas TA = 10 cm (T berada tepat di atas B).",
    diagram: <LimasSegitigaSVG />,
    parts: [
      { label: "a.", math: "\\text{Luas alas: } L_{\\triangle} = \\frac{1}{2} \\times 8 \\times 6 = \\ldots" },
      { label: "b.", math: "\\text{Volume: } V = \\frac{1}{3} \\times L_{\\triangle} \\times 10 = \\ldots" },
      { label: "c.", math: "\\text{AC (sisi miring alas)} = \\sqrt{8^2 + 6^2} = \\ldots" },
    ],
  }),
  Qn(38, "Soal TKA – Perbandingan Limas dan Prisma Satu Alas", {
    type: "mixed",
    content: "Limas dan prisma segiempat memiliki alas persegi bersisi 6 cm dan tinggi yang sama yaitu 9 cm.",
    parts: [
      { label: "a.", text: "Hitung volume limas." },
      { label: "b.", text: "Hitung volume prisma." },
      { label: "c.", math: "\\text{Tunjukkan bahwa } V_{limas} = \\frac{1}{3} V_{prisma}" },
    ],
  }),
  Qn(39, "Soal Olimpiade – Rusuk Tegak dari Luas Permukaan", {
    type: "mixed",
    content: "Limas segiempat beraturan T.ABCD memiliki sisi alas 10 cm. Luas permukaan total = 260 cm².",
    parts: [
      { label: "a.", math: "\\text{Luas alas} = 10^2 = 100 \\text{ cm}^2" },
      { label: "b.", math: "\\text{Luas selimut} = 260 - 100 = 160 \\text{ cm}^2" },
      { label: "c.", math: "\\text{Dari luas selimut, tentukan apotema } l, \\text{ lalu hitung tinggi limas } t" },
    ],
  }),
  Qn(40, "Soal UN/ANBK – Gabungan Konsep Limas", {
    type: "mixed",
    content: "Sebuah limas segiempat beraturan T.ABCD dengan sisi alas 8 cm dan tinggi 3 cm.",
    diagram: <LimasSegiempatSVG s="8" t="3" showHeight={true} />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas}" },
      { label: "b.", math: "\\text{Hitung volume limas}" },
      { label: "c.", math: "\\text{Hitung apotema limas: } l = \\sqrt{t^2 + \\left(\\frac{s}{2}\\right)^2}" },
      { label: "d.", math: "\\text{Hitung luas permukaan total limas}" },
    ],
  }),
];

const LimasPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔺</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            LIMAS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Bangun Ruang Sisi Datar · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-3">📐 Rumus-Rumus Penting Limas</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Luas Permukaan", math: "L = L_{alas} + \\textstyle\\sum L_{tegak}" },
              { name: "Volume", math: "V = \\tfrac{1}{3} \\times L_{alas} \\times t" },
              { name: "Apotema Limas", math: "l = \\sqrt{t^2 + \\left(\\tfrac{s}{2}\\right)^2}" },
              { name: "Rusuk Tegak", math: "TA = \\sqrt{t^2 + \\left(\\tfrac{d}{2}\\right)^2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-violet-300 overflow-x-auto text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <div className="text-white/40 text-[9px] uppercase mb-1">Limas Segiempat</div>
              <p className="text-white/70 text-xs">5 sudut · 8 rusuk · 5 sisi</p>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <div className="text-white/40 text-[9px] uppercase mb-1">Limas Segitiga</div>
              <p className="text-white/70 text-xs">4 sudut · 6 rusuk · 4 sisi</p>
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
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-3 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimasPage;
