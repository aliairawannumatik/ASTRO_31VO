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
  1:  "📌 Bagian A — Unsur-Unsur Tabung",
  9:  "📐 Bagian B — Luas Permukaan Tabung",
  26: "🔢 Bagian C — Volume Tabung",
  33: "🌍 Bagian D — Aplikasi di Kehidupan Nyata",
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
    <svg viewBox="0 0 315 180" width="310" height="170" className="mx-auto">
      {/* Tutup — right edge at 108, rect starts at 110 → menempel */}
      <ellipse cx="70" cy="90" rx="38" ry="38" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" strokeDasharray="5,3" />
      <text x="70" y="95" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Tutup</text>
      {/* Selimut — x=110 s/d x=230 */}
      <rect x="110" y="30" width="120" height="120" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" />
      <text x="170" y="90" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Selimut</text>
      {h && <text x="170" y="170" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">2πr = lebar</text>}
      {/* Alas — left edge at 232, rect right edge at 230 → menempel */}
      <ellipse cx="270" cy="90" rx="38" ry="38" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" strokeDasharray="5,3" />
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
  // ── BAGIAN A · UNSUR-UNSUR ───────────────────────────────────────────────
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

  // ── BAGIAN B · LUAS PERMUKAAN ─────────────────────────────────────────────
  Qn(9, "Rumus Luas Permukaan", {
    content: "Rumus luas permukaan (sisi) tabung yang benar adalah ...",
    choices: [
      { label: "A", math: "L = \\pi r^2 + \\pi r t" },
      { label: "B", math: "L = \\pi r(r + t)" },
      { label: "C", math: "L = 2\\pi r(r + t)" },
      { label: "D", math: "L = 2\\pi r^2 t" },
    ],
    answer: "C",
  }),
  Qn(10, "Rumus Luas Selimut", {
    content: "Rumus luas selimut tabung adalah ...",
    choices: [
      { label: "A", math: "\\pi r^2" },
      { label: "B", math: "2\\pi r" },
      { label: "C", math: "\\pi r^2 t" },
      { label: "D", math: "2\\pi r t" },
    ],
    answer: "D",
  }),
  Qn(11, "Luas Permukaan – Bentuk Aljabar", {
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
  Qn(12, "Luas Selimut – Jari-Jari dari Jaring", {
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
  Qn(13, "Luas Selimut – Perhitungan", {
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
  Qn(14, "Luas Selimut – Jaring-Jaring", {
    content: "Sebuah tabung memiliki jari-jari 5 cm dan tinggi 12 cm. Luas selimut tabung tersebut adalah ... (π = 3,14)",
    diagram: <CylinderNetSVG r="5" h="12" />,
    choices: [
      { label: "A", text: "251,2 cm²" },
      { label: "B", text: "314,0 cm²" },
      { label: "C", text: "376,8 cm²" },
      { label: "D", text: "471,0 cm²" },
    ],
    answer: "C",
  }),
  Qn(15, "Luas Permukaan Total – r = 5, t = 12", {
    content: "Tabung dengan jari-jari 5 cm dan tinggi 12 cm. Luas permukaan total tabung adalah ... (π = 3,14)",
    diagram: <CylinderSVG r="5 cm" h="12 cm" />,
    choices: [
      { label: "A", text: "376,8 cm²" },
      { label: "B", text: "471,0 cm²" },
      { label: "C", text: "533,8 cm²" },
      { label: "D", text: "628,0 cm²" },
    ],
    answer: "C",
  }),
  Qn(16, "Luas Permukaan – Diameter Diketahui", {
    content: "Sebuah tabung mempunyai diameter alas 14 cm dan tinggi 15 cm. Luas permukaan tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="15 cm" />,
    choices: [
      { label: "A", text: "616 cm²" },
      { label: "B", text: "792 cm²" },
      { label: "C", text: "968 cm²" },
      { label: "D", text: "1.144 cm²" },
    ],
    answer: "C",
  }),
  Qn(17, "Luas Permukaan dari Luas Alas & Selimut", {
    content: "Luas alas sebuah tabung adalah 154 cm² dan luas selimutnya 440 cm². Luas permukaan tabung tersebut adalah ...",
    choices: [
      { label: "A", text: "594 cm²" },
      { label: "B", text: "748 cm²" },
      { label: "C", text: "880 cm²" },
      { label: "D", text: "1.034 cm²" },
    ],
    answer: "B",
  }),
  Qn(18, "Mencari Tinggi dari Luas Selimut – 270π", {
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
  Qn(19, "Mencari Jari-Jari dari Luas Selimut", {
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
  Qn(20, "Mencari Diameter dari Luas Selimut", {
    content: "Luas selimut sebuah tabung adalah 1.760 cm². Jika tinggi tabung 20 cm, diameter alas tabung tersebut adalah ... (π = 22/7)",
    choices: [
      { label: "A", text: "7 cm" },
      { label: "B", text: "14 cm" },
      { label: "C", text: "21 cm" },
      { label: "D", text: "28 cm" },
    ],
    answer: "D",
  }),
  Qn(21, "Luas Permukaan Tabung Terbuka", {
    content: "Sebuah tabung tanpa tutup memiliki jari-jari 10 cm dan tinggi 15 cm. Luas permukaannya adalah ... (π = 3,14)",
    diagram: <CylinderSVG r="10 cm" h="15 cm" />,
    choices: [
      { label: "A", text: "942 cm²" },
      { label: "B", text: "1.099 cm²" },
      { label: "C", text: "1.256 cm²" },
      { label: "D", text: "1.570 cm²" },
    ],
    answer: "C",
  }),
  Qn(22, "Luas Selimut – Soal Terbalik", {
    content: "Luas selimut sebuah tabung adalah 924 cm². Jika tingginya 3 kali jari-jarinya, jari-jari dan tinggi tabung tersebut adalah ... (π = 22/7)",
    choices: [
      { label: "A", text: "r = 3 cm, t = 9 cm" },
      { label: "B", text: "r = 5 cm, t = 15 cm" },
      { label: "C", text: "r = 7 cm, t = 21 cm" },
      { label: "D", text: "r = 9 cm, t = 27 cm" },
    ],
    answer: "C",
  }),
  Qn(23, "Luas Permukaan – Kaleng Terbuka", {
    content: "Sebuah kaleng terbuka (tanpa tutup atas) berbentuk tabung dengan r = 10,5 cm dan t = 15 cm. Luas permukaan kaleng tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="10,5 cm" h="15 cm" color="#fbbf24" extraLabel="Tanpa Tutup Atas" />,
    choices: [
      { label: "A", text: "891 cm²" },
      { label: "B", text: "1.039,5 cm²" },
      { label: "C", text: "1.336,5 cm²" },
      { label: "D", text: "1.732 cm²" },
    ],
    answer: "C",
  }),
  Qn(24, "Luas Selimut – Perbandingan", {
    content: "Dua tabung memiliki tinggi yang sama. Jika perbandingan jari-jarinya 2 : 3, perbandingan luas selimut kedua tabung adalah ...",
    choices: [
      { label: "A", text: "4 : 9" },
      { label: "B", text: "2 : 3" },
      { label: "C", text: "1 : 2" },
      { label: "D", text: "3 : 4" },
    ],
    answer: "B",
  }),
  Qn(25, "Luas Permukaan – Terpadu", {
    content: "Sebuah tabung memiliki luas permukaan total 836 cm² dan tinggi 12 cm. Volume tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="?" h="12 cm" />,
    choices: [
      { label: "A", text: "924 cm³" },
      { label: "B", text: "1.848 cm³" },
      { label: "C", text: "2.156 cm³" },
      { label: "D", text: "3.080 cm³" },
    ],
    answer: "B",
  }),

  // ── BAGIAN C · VOLUME ─────────────────────────────────────────────────────
  Qn(26, "Volume Tabung – r = 6, t = 8", {
    content: "Sebuah tabung memiliki jari-jari 6 cm dan tinggi 8 cm. Volume tabung tersebut adalah ... (π = 3,14)",
    diagram: <CylinderSVG r="6 cm" h="8 cm" />,
    choices: [
      { label: "A", text: "301,44 cm³" },
      { label: "B", text: "602,88 cm³" },
      { label: "C", text: "904,32 cm³" },
      { label: "D", text: "1.206,76 cm³" },
    ],
    answer: "C",
  }),
  Qn(27, "Volume Tabung – Diameter Diketahui", {
    content: "Sebuah tabung memiliki diameter 14 cm dan tinggi 20 cm. Volume tabung adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="20 cm" />,
    choices: [
      { label: "A", text: "1.540 cm³" },
      { label: "B", text: "2.310 cm³" },
      { label: "C", text: "3.080 cm³" },
      { label: "D", text: "6.160 cm³" },
    ],
    answer: "C",
  }),
  Qn(28, "Volume – dari Luas Alas 154", {
    content: "Sebuah tabung mempunyai luas alas 154 cm² dan tinggi 10 cm. Volume tabung tersebut adalah ... (π = 22/7)",
    choices: [
      { label: "A", text: "770 cm³" },
      { label: "B", text: "1.100 cm³" },
      { label: "C", text: "1.540 cm³" },
      { label: "D", text: "2.310 cm³" },
    ],
    answer: "C",
  }),
  Qn(29, "Mencari Tinggi dari Volume – 1.540", {
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
  Qn(30, "Keliling Alas dari Volume", {
    content: "Volume sebuah tabung adalah 4.620 cm³ dan tingginya 30 cm. Keliling alas tabung tersebut adalah ... (π = 22/7)",
    choices: [
      { label: "A", text: "22 cm" },
      { label: "B", text: "33 cm" },
      { label: "C", text: "44 cm" },
      { label: "D", text: "66 cm" },
    ],
    answer: "C",
  }),
  Qn(31, "Perbandingan Volume Dua Tabung", {
    content: "Tabung A memiliki r = 3 cm dan t = 8 cm. Tabung B memiliki r = 6 cm dan t = 4 cm. Perbandingan volume Tabung A terhadap Tabung B adalah ...",
    choices: [
      { label: "A", text: "VA = VB" },
      { label: "B", text: "VA : VB = 2 : 1" },
      { label: "C", text: "VA : VB = 1 : 2" },
      { label: "D", text: "VA : VB = 1 : 4" },
    ],
    answer: "C",
  }),
  Qn(32, "Volume – Mencari r dari Minyak Goreng", {
    content: "Sebuah tabung berisi minyak goreng 3.080 cm³. Jika tinggi minyak dalam tabung 20 cm, jari-jari tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="?" h="20 cm" color="#fbbf24" />,
    choices: [
      { label: "A", text: "3,5 cm" },
      { label: "B", text: "5 cm" },
      { label: "C", text: "7 cm" },
      { label: "D", text: "14 cm" },
    ],
    answer: "C",
  }),

  // ── BAGIAN D · APLIKASI DI KEHIDUPAN NYATA ───────────────────────────────
  Qn(33, "Aplikasi – Kolam Renang", {
    content: "Sebuah kolam renang berbentuk tabung berdiameter 14 m dan kedalaman 2 m. Volume air yang dibutuhkan untuk mengisi kolam hingga penuh adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 m" h="2 m" color="#38bdf8" extraLabel="Kolam Renang" />,
    choices: [
      { label: "A", text: "77 m³" },
      { label: "B", text: "154 m³" },
      { label: "C", text: "308 m³" },
      { label: "D", text: "616 m³" },
    ],
    answer: "C",
  }),
  Qn(34, "Aplikasi – Pengisian Tangki dengan Pompa", {
    content: "Sebuah tangki berbentuk tabung dengan r = 3,5 m dan tinggi 5 m akan diisi menggunakan pompa yang mengalirkan 385 liter/menit. Waktu yang dibutuhkan untuk mengisi penuh tangki adalah ... (π = 22/7, 1 m³ = 1.000 liter)",
    diagram: <CylinderSVG r="3,5 m" h="5 m" color="#38bdf8" extraLabel="Tangki" />,
    choices: [
      { label: "A", text: "100 menit" },
      { label: "B", text: "250 menit" },
      { label: "C", text: "500 menit" },
      { label: "D", text: "1.000 menit" },
    ],
    answer: "C",
  }),
  Qn(35, "Aplikasi – Pipa Air Mengalir", {
    content: "Air mengalir melalui pipa silinder berjari-jari 1,4 cm dengan kecepatan 5 cm/detik. Volume air yang mengalir dalam 1 menit adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="1,4 cm" h="300 cm" color="#38bdf8" extraLabel="L = 5 × 60 = 300 cm" />,
    choices: [
      { label: "A", text: "616 cm³" },
      { label: "B", text: "924 cm³" },
      { label: "C", text: "1.848 cm³" },
      { label: "D", text: "2.772 cm³" },
    ],
    answer: "C",
  }),
  Qn(36, "Aplikasi – Kaleng Roti Tanpa Tutup", {
    content: "Sebuah pabrik membuat kaleng roti berbentuk tabung tanpa tutup dengan r = 14 cm dan t = 20 cm. Luas seng yang diperlukan untuk satu kaleng adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="14 cm" h="20 cm" color="#fbbf24" extraLabel="Tanpa Tutup" />,
    choices: [
      { label: "A", text: "1.188 cm²" },
      { label: "B", text: "1.760 cm²" },
      { label: "C", text: "2.376 cm²" },
      { label: "D", text: "2.992 cm²" },
    ],
    answer: "C",
  }),
  Qn(39, "Aplikasi – Biaya Cat Selimut", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 20 cm akan dicat selimutnya. Jika biaya cat Rp500,00 per cm², total biaya yang diperlukan adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="20 cm" color="#a78bfa" />,
    choices: [
      { label: "A", text: "Rp220.000" },
      { label: "B", text: "Rp330.000" },
      { label: "C", text: "Rp440.000" },
      { label: "D", text: "Rp880.000" },
    ],
    answer: "C",
  }),
  Qn(41, "Aplikasi – Tong Sampah", {
    content: "Tong sampah berbentuk tabung tanpa tutup dengan diameter 42 cm dan tinggi 60 cm. Jika harga seng Rp25.000,00 per dm², biaya yang dibutuhkan adalah ... (π = 22/7, 1 dm² = 100 cm²)",
    diagram: <CylinderSVG r="21 cm" h="60 cm" color="#6b7280" extraLabel="Tong Sampah" />,
    choices: [
      { label: "A", text: "Rp1.163.250" },
      { label: "B", text: "Rp1.980.000" },
      { label: "C", text: "Rp2.326.500" },
      { label: "D", text: "Rp3.465.000" },
    ],
    answer: "C",
  }),
  Qn(42, "Aplikasi – Tabung dalam Kotak", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 14 cm dimasukkan pas ke dalam kotak kubus. Sisa volume di dalam kotak yang tidak ditempati tabung adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="14 cm" />,
    choices: [
      { label: "A", text: "294 cm³" },
      { label: "B", text: "441 cm³" },
      { label: "C", text: "588 cm³" },
      { label: "D", text: "882 cm³" },
    ],
    answer: "C",
  }),
  Qn(43, "Aplikasi – Lilin Silindris Menyusut", {
    content: "Sebuah lilin berbentuk tabung memiliki diameter 3,5 cm dan tinggi 20 cm. Setelah dinyalakan, lilin menyusut 0,5 cm per jam. Volume lilin setelah 4 jam menyala adalah ... (π = 22/7)",
    choices: [
      { label: "A", text: "86,625 cm³" },
      { label: "B", text: "130,0 cm³" },
      { label: "C", text: "173,25 cm³" },
      { label: "D", text: "192,5 cm³" },
    ],
    answer: "C",
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
            <span className="text-cyan-400 text-xs font-bold">📋 43 Soal</span>
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
