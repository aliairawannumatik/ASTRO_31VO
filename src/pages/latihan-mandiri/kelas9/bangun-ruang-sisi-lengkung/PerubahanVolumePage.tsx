import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

function CompareCylinderSVG({ r1, h1, r2, h2, color = "#a855f7" }: {
  r1: number; h1: number; r2: number; h2: number; color?: string;
}) {
  const maxH = Math.max(h1, h2);
  const scale = 80 / maxH;
  const H1 = h1 * scale;
  const H2 = h2 * scale;
  const R1 = Math.max(r1 * 10, 14);
  const R2 = Math.max(r2 * 10, 14);
  const ell1 = Math.max(R1 * 0.28, 5);
  const ell2 = Math.max(R2 * 0.28, 5);
  return (
    <svg viewBox="0 0 280 160" width="280" height="160" className="mx-auto">
      <text x="60" y="14" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Awal</text>
      <ellipse cx="60" cy="130 - H1 + ell1" rx={R1} ry={ell1} fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" />
      <ellipse cx="60" cy="130" rx={R1} ry={ell1} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
      <rect x={60 - R1} y={130 - H1} width={R1 * 2} height={H1} fill={color} fillOpacity="0.07" />
      <line x1={60 - R1} y1={130 - H1} x2={60 - R1} y2="130" stroke={color} strokeWidth="1.5" />
      <line x1={60 + R1} y1={130 - H1} x2={60 + R1} y2="130" stroke={color} strokeWidth="1.5" />
      <text x="60" y={130 - H1 / 2} fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" dominantBaseline="middle">r={r1}, t={h1}</text>

      <text x="60" y="148" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = {r1}²×{h1}π</text>

      <text x="150" y="75" fill={color} fontSize="18" textAnchor="middle" fontFamily="monospace">→</text>

      <text x="220" y="14" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Baru</text>
      <ellipse cx="220" cy={130 - H2 + ell2} rx={R2} ry={ell2} fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" />
      <ellipse cx="220" cy="130" rx={R2} ry={ell2} fill={color} fillOpacity="0.20" stroke={color} strokeWidth="1.5" />
      <rect x={220 - R2} y={130 - H2} width={R2 * 2} height={H2} fill={color} fillOpacity="0.12" />
      <line x1={220 - R2} y1={130 - H2} x2={220 - R2} y2="130" stroke={color} strokeWidth="1.5" />
      <line x1={220 + R2} y1={130 - H2} x2={220 + R2} y2="130" stroke={color} strokeWidth="1.5" />
      <text x="220" y={130 - H2 / 2} fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" dominantBaseline="middle">r={r2}, t={h2}</text>
      <text x="220" y="148" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = {r2}²×{h2}π</text>
    </svg>
  );
}

function RatioArrow({ label, color = "#a855f7" }: { label: string; color?: string }) {
  return (
    <svg viewBox="0 0 240 60" width="240" height="60" className="mx-auto">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,1 L8,4 L0,7 Z" fill={color} />
        </marker>
      </defs>
      <rect x="10" y="18" width="80" height="24" rx="6" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.2" />
      <text x="50" y="33" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Dimensi Awal</text>
      <line x1="95" y1="30" x2="150" y2="30" stroke={color} strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="122" y="24" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">{label}</text>
      <rect x="155" y="18" width="75" height="24" rx="6" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.2" />
      <text x="192" y="33" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Dimensi Baru</text>
    </svg>
  );
}

const questions: Q[] = [
  Qn(1, "Tabung – Jari-Jari Diperbesar 2 Kali", {
    content: "Sebuah tabung memiliki r = 5 cm dan t = 10 cm. Jika jari-jarinya diperbesar 2 kali (tinggi tetap), berapa kali volume tabung bertambah?",
    diagram: <CompareCylinderSVG r1={5} h1={10} r2={10} h2={10} />,
    parts: [
      { label: "a.", math: "V_1 = \\pi \\times 25 \\times 10 = 250\\pi" },
      { label: "b.", math: "V_2 = \\pi \\times (2 \\times 5)^2 \\times 10 = \\pi \\times 100 \\times 10 = 1000\\pi" },
      { label: "c.", math: "\\frac{V_2}{V_1} = \\frac{1000\\pi}{250\\pi} = \\ldots \\text{ kali}" },
    ],
  }),
  Qn(2, "Tabung – Tinggi Diperbesar 3 Kali", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 5 cm. Jika tingginya diperbesar 3 kali (jari-jari tetap), berapa kali volume tabung?",
    diagram: <CompareCylinderSVG r1={7} h1={5} r2={7} h2={15} />,
    parts: [
      { label: "a.", math: "V_1 = \\pi r^2 t = 49\\pi \\times 5 = 245\\pi" },
      { label: "b.", math: "V_2 = \\pi r^2 (3t) = 49\\pi \\times 15 = 735\\pi" },
      { label: "c.", math: "\\frac{V_2}{V_1} = \\frac{735\\pi}{245\\pi} = \\ldots \\text{ kali}" },
    ],
  }),
  Qn(3, "Tabung – r Diperkecil ½ Kali", {
    content: "Sebuah tabung dengan r = 6 cm dan t = 10 cm. Jika jari-jari diperkecil menjadi setengahnya (tinggi tetap), berapa volume tabung yang baru?",
    diagram: <CompareCylinderSVG r1={6} h1={10} r2={3} h2={10} />,
    parts: [
      { label: "a.", math: "V_1 = \\pi \\times 36 \\times 10 = 360\\pi \\text{ cm}^3" },
      { label: "b.", math: "V_2 = \\pi \\times (\\frac{6}{2})^2 \\times 10 = \\pi \\times 9 \\times 10 = 90\\pi \\text{ cm}^3" },
      { label: "c.", math: "\\frac{V_2}{V_1} = \\ldots \\quad V_2 = \\ldots \\approx \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(4, "Tabung – r dan t Keduanya Diperbesar 2 Kali", {
    content: "Sebuah tabung diperbesar sehingga r dan t masing-masing menjadi 2 kali semula. Berapa kali volume tabung baru dibanding semula?",
    diagram: <RatioArrow label="r×2, t×2" />,
    parts: [
      { label: "a.", math: "V_1 = \\pi r^2 t" },
      { label: "b.", math: "V_2 = \\pi (2r)^2 (2t) = \\pi \\times 4r^2 \\times 2t = 8\\pi r^2 t" },
      { label: "c.", math: "\\frac{V_2}{V_1} = 8 \\text{ kali}" },
    ],
  }),
  Qn(5, "Tabung – Perbandingan Volume", {
    content: "Tabung A: r = 3, t = 8. Tabung B: r = 6, t = 2. Manakah yang volumenya lebih besar? Berapa perbandingannya?",
    parts: [
      { label: "a.", math: "V_A = \\pi \\times 9 \\times 8 = 72\\pi" },
      { label: "b.", math: "V_B = \\pi \\times 36 \\times 2 = 72\\pi" },
      { label: "c.", text: "Volume keduanya ... karena V_A = V_B" },
    ],
  }),
  Qn(6, "Kerucut – Jari-Jari Diperbesar 2 Kali", {
    content: "Sebuah kerucut r = 5 cm, t = 12 cm. Jika r diperbesar 2 kali dan t tetap, berapa kali volume kerucut baru?",
    diagram: <RatioArrow label="r×2" />,
    parts: [
      { label: "a.", math: "V_1 = \\frac{1}{3}\\pi \\times 25 \\times 12 = 100\\pi" },
      { label: "b.", math: "V_2 = \\frac{1}{3}\\pi \\times 100 \\times 12 = 400\\pi" },
      { label: "c.", math: "\\frac{V_2}{V_1} = 4 \\text{ kali}" },
    ],
  }),
  Qn(7, "Kerucut – Tinggi Diperbesar 3 Kali", {
    content: "Sebuah kerucut r = 7 cm, t = 6 cm. Jika tinggi diperbesar 3 kali dan r tetap, berapa kali volume kerucut bertambah?",
    diagram: <RatioArrow label="t×3" />,
    parts: [
      { label: "a.", math: "V_1 = \\frac{1}{3}\\pi \\times 49 \\times 6 = 98\\pi" },
      { label: "b.", math: "V_2 = \\frac{1}{3}\\pi \\times 49 \\times 18 = 294\\pi" },
      { label: "c.", math: "\\frac{V_2}{V_1} = \\ldots \\text{ kali}" },
    ],
  }),
  Qn(8, "Bola – Jari-Jari Diperbesar 2 Kali", {
    content: "Sebuah bola berjari-jari r. Jika jari-jari diperbesar 2 kali, berapa kali volume bola bertambah?",
    diagram: <RatioArrow label="r×2" color="#818cf8" />,
    parts: [
      { label: "a.", math: "V_1 = \\frac{4}{3}\\pi r^3" },
      { label: "b.", math: "V_2 = \\frac{4}{3}\\pi (2r)^3 = \\frac{4}{3}\\pi \\times 8r^3 = 8V_1" },
      { label: "c.", text: "Volume bola menjadi 8 kali semula" },
    ],
  }),
  Qn(9, "Bola – Jari-Jari Diperbesar 3 Kali", {
    content: "Sebuah bola berjari-jari 5 cm. Jika r diperbesar menjadi 15 cm, berapa kali volume bola yang baru?",
    diagram: <RatioArrow label="r: 5→15 (×3)" color="#818cf8" />,
    parts: [
      { label: "a.", math: "\\frac{V_2}{V_1} = \\left(\\frac{r_2}{r_1}\\right)^3 = \\left(\\frac{15}{5}\\right)^3 = 3^3 = \\ldots \\text{ kali}" },
    ],
  }),
  Qn(10, "Bola – Jari-Jari Diperkecil", {
    content: "Jika jari-jari bola diperkecil menjadi sepertiga semula, berapa kali volume bola yang baru dibanding semula?",
    diagram: <RatioArrow label="r ÷ 3" color="#818cf8" />,
    parts: [
      { label: "a.", math: "\\frac{V_2}{V_1} = \\left(\\frac{1}{3}\\right)^3 = \\frac{1}{27}" },
      { label: "b.", text: "Volume bola menjadi 1/27 kali atau berkurang ... kali" },
    ],
  }),
  Qn(11, "Tabung – Pengaruh r terhadap Luas Selimut", {
    content: "Jika jari-jari sebuah tabung diperbesar n kali (tinggi tetap), berapa kali luas selimut tabung bertambah?",
    parts: [
      { label: "a.", math: "L_s = 2\\pi r t" },
      { label: "b.", math: "L_{s2} = 2\\pi (nr) t = n \\times 2\\pi r t = n \\times L_{s1}" },
      { label: "c.", text: "Luas selimut bertambah n kali (sebanding langsung dengan r)" },
    ],
  }),
  Qn(12, "Tabung – Pengaruh r terhadap Volume", {
    content: "Jika jari-jari tabung diperbesar n kali (tinggi tetap), berapa kali volume bertambah?",
    parts: [
      { label: "a.", math: "V = \\pi r^2 t" },
      { label: "b.", math: "V_2 = \\pi (nr)^2 t = n^2 \\pi r^2 t = n^2 V_1" },
      { label: "c.", text: "Volume bertambah n² kali (kuadrat perubahan jari-jari)" },
    ],
  }),
  Qn(13, "Tabung – r Bertambah 4 cm", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 10 cm. Jika jari-jari bertambah 4 cm (menjadi 11 cm), berapakah selisih volume keduanya? (π = 22/7)",
    diagram: <CompareCylinderSVG r1={7} h1={10} r2={11} h2={10} />,
    parts: [
      { label: "a.", math: "V_1 = \\frac{22}{7} \\times 49 \\times 10 = \\ldots" },
      { label: "b.", math: "V_2 = \\frac{22}{7} \\times 121 \\times 10 = \\ldots" },
      { label: "c.", math: "\\Delta V = V_2 - V_1 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(14, "Kerucut – r dan t Masing-Masing Dikali 2", {
    content: "Sebuah kerucut dengan r = 3 cm dan t = 4 cm. Jika r dan t masing-masing diperbesar 2 kali, berapa kali volume kerucut baru?",
    diagram: <RatioArrow label="r×2, t×2" color="#fb923c" />,
    parts: [
      { label: "a.", math: "V_1 = \\frac{1}{3}\\pi \\times 9 \\times 4 = 12\\pi" },
      { label: "b.", math: "V_2 = \\frac{1}{3}\\pi \\times 36 \\times 8 = 96\\pi" },
      { label: "c.", math: "\\frac{V_2}{V_1} = \\frac{96}{12} = \\ldots \\text{ kali}" },
    ],
  }),
  Qn(15, "UN Style – Bola Diperbesar", {
    content: "Volume bola mula-mula adalah 500π/3 cm³. Jika jari-jari diperbesar 2 kali, berapakah volume bola yang baru?",
    parts: [
      { label: "a.", math: "V_1 = \\frac{500\\pi}{3} \\Rightarrow r_1^3 = \\frac{500}{4} = 125 \\Rightarrow r_1 = 5 \\text{ cm}" },
      { label: "b.", math: "V_2 = \\frac{4}{3}\\pi (10)^3 = \\frac{4000\\pi}{3} \\text{ cm}^3" },
    ],
  }),
  Qn(16, "Tabung – Tinggi Dikurangi", {
    content: "Volume sebuah tabung berkurang menjadi 1/4 semula. Jika jari-jari tidak berubah, berapa kali tinggi menjadi lebih kecil?",
    parts: [
      { label: "a.", math: "\\frac{V_2}{V_1} = \\frac{\\pi r^2 t_2}{\\pi r^2 t_1} = \\frac{t_2}{t_1} = \\frac{1}{4}" },
      { label: "b.", text: "Tinggi berkurang menjadi 1/4 kali semula." },
    ],
  }),
  Qn(17, "ANBK – Volume Bola Baru dari Perbandingan", {
    content: "Volume sebuah bola adalah 36π cm³. Jika jari-jari diperbesar menjadi 3/2 kali semula, berapakah volume bola yang baru?",
    parts: [
      { label: "a.", math: "\\frac{V_2}{V_1} = \\left(\\frac{3}{2}\\right)^3 = \\frac{27}{8}" },
      { label: "b.", math: "V_2 = \\frac{27}{8} \\times 36\\pi = \\frac{972\\pi}{8} = \\frac{243\\pi}{2} \\approx 121{,}5\\pi \\text{ cm}^3" },
    ],
  }),
  Qn(18, "Tabung – Selisih Volume Akibat Perubahan r", {
    content: "Sebuah tabung memiliki r = 10 cm dan t = 14 cm. Jika r diperbesar menjadi 14 cm (t tetap), berapa selisih volumenya? (π = 22/7)",
    diagram: <CompareCylinderSVG r1={10} h1={14} r2={14} h2={14} />,
    parts: [
      { label: "a.", math: "V_1 = \\frac{22}{7} \\times 100 \\times 14 = \\ldots" },
      { label: "b.", math: "V_2 = \\frac{22}{7} \\times 196 \\times 14 = \\ldots" },
      { label: "c.", math: "\\Delta V = V_2 - V_1 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(19, "Kerucut – Perubahan Volume Akibat Perubahan t", {
    content: "Kerucut A: r = 6, t = 5. Kerucut B (t diperbesar): r = 6, t = 20. Berapa perbandingan V_B : V_A?",
    parts: [
      { label: "a.", math: "\\frac{V_B}{V_A} = \\frac{\\frac{1}{3}\\pi \\times 36 \\times 20}{\\frac{1}{3}\\pi \\times 36 \\times 5} = \\frac{20}{5} = \\ldots" },
    ],
  }),
  Qn(20, "Bola – Luas Permukaan Diperbesar", {
    content: "Jika jari-jari sebuah bola diperbesar 4 kali, berapa kali luas permukaan bola menjadi lebih besar?",
    diagram: <RatioArrow label="r×4" color="#818cf8" />,
    parts: [
      { label: "a.", math: "L = 4\\pi r^2" },
      { label: "b.", math: "L_2 = 4\\pi (4r)^2 = 4\\pi \\times 16r^2 = 16 \\times 4\\pi r^2 = 16 L_1" },
      { label: "c.", text: "Luas permukaan menjadi 16 kali semula" },
    ],
  }),
  Qn(21, "UN Style – Perubahan r dan t Bersamaan", {
    content: "Sebuah tabung diperbesar: r menjadi 3 kali dan t menjadi 2 kali. Berapa kali volume bertambah?",
    diagram: <RatioArrow label="r×3, t×2" />,
    parts: [
      { label: "a.", math: "\\frac{V_2}{V_1} = \\frac{\\pi(3r)^2(2t)}{\\pi r^2 t} = 9 \\times 2 = 18 \\text{ kali}" },
    ],
  }),
  Qn(22, "Soal Cerita – Tangki Air Diperbesar", {
    content: "Sebuah tangki tabung dengan r = 1 m dan t = 2 m diubah menjadi tangki baru dengan r = 2 m dan t = 2 m. Berapa liter tambahan kapasitas? (π = 3,14, 1 m³ = 1.000 liter)",
    diagram: <CompareCylinderSVG r1={1} h1={2} r2={2} h2={2} />,
    parts: [
      { label: "a.", math: "V_1 = 3{,}14 \\times 1 \\times 2 = 6{,}28 \\text{ m}^3" },
      { label: "b.", math: "V_2 = 3{,}14 \\times 4 \\times 2 = 25{,}12 \\text{ m}^3" },
      { label: "c.", math: "\\Delta V = 25{,}12 - 6{,}28 = 18{,}84 \\text{ m}^3 = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(23, "ANBK – Mencari Perubahan r agar Volume 4 Kali", {
    content: "Sebuah tabung dengan r = 5 cm dan t konstan. Berapa kali r harus diperbesar agar volume menjadi 4 kali semula?",
    parts: [
      { label: "a.", math: "\\frac{V_2}{V_1} = \\left(\\frac{r_2}{r_1}\\right)^2 = 4" },
      { label: "b.", math: "\\frac{r_2}{r_1} = \\sqrt{4} = 2 \\Rightarrow r_2 = 2 \\times 5 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(24, "Kerucut – Mencari t Baru agar Volume Sama", {
    content: "Kerucut A: r = 6, t = 8. Kerucut B: r = 4, t = ?. Agar volume B = volume A, berapa tinggi B?",
    parts: [
      { label: "a.", math: "V_A = \\frac{1}{3}\\pi \\times 36 \\times 8 = 96\\pi" },
      { label: "b.", math: "\\frac{1}{3}\\pi \\times 16 \\times t_B = 96\\pi \\Rightarrow t_B = \\frac{96 \\times 3}{16} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(25, "Bola – Volume Berkurang", {
    content: "Volume awal bola adalah 2.304π cm³. Jika jari-jari berkurang menjadi setengahnya, berapa volume bola yang baru?",
    parts: [
      { label: "a.", math: "V_1 = \\frac{4}{3}\\pi r^3 = 2304\\pi \\Rightarrow r^3 = 1728 \\Rightarrow r = 12 \\text{ cm}" },
      { label: "b.", math: "V_2 = \\frac{4}{3}\\pi (6)^3 = \\frac{4}{3}\\pi \\times 216 = 288\\pi \\text{ cm}^3" },
    ],
  }),
  Qn(26, "UN Style – Tabung dan Kerucut Perbandingan", {
    content: "Sebuah tabung dan kerucut memiliki r dan t yang sama. Jika volume tabung 300 cm³, berapa volume kerucut?",
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3} V_{\\text{tabung}} = \\frac{1}{3} \\times 300 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(27, "Soal Cerita – Tabung Diperpanjang", {
    content: "Sebuah pipa air berbentuk tabung dengan r = 3,5 cm dan panjang 2 m diperpanjang menjadi 5 m. Berapa cm³ tambahan volume pipa? (π = 22/7)",
    parts: [
      { label: "a.", math: "V_1 = \\frac{22}{7} \\times 12{,}25 \\times 200 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_2 = \\frac{22}{7} \\times 12{,}25 \\times 500 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\Delta V = V_2 - V_1 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(28, "TKA – Bola Dilebur Jadi Tabung", {
    content: "Dua bola logam masing-masing berjari-jari 3 cm dilebur menjadi sebuah tabung berjari-jari 3 cm. Berapa tinggi tabung yang terbentuk? (π sama)",
    parts: [
      { label: "a.", math: "V_{2\\text{ bola}} = 2 \\times \\frac{4}{3}\\pi \\times 27 = 72\\pi \\text{ cm}^3" },
      { label: "b.", math: "\\pi \\times 9 \\times t = 72\\pi \\Rightarrow t = \\frac{72}{9} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(29, "ANBK – Kerucut Dilebur Jadi Bola", {
    content: "Sebuah kerucut dengan r = 6 cm dan t = 8 cm dilebur menjadi sebuah bola. Tentukan jari-jari bola yang terbentuk!",
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3}\\pi \\times 36 \\times 8 = 96\\pi \\text{ cm}^3" },
      { label: "b.", math: "\\frac{4}{3}\\pi R^3 = 96\\pi \\Rightarrow R^3 = 72 \\Rightarrow R = \\sqrt[3]{72} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(30, "Soal Cerita – Air dalam Dua Wadah", {
    content: "Air dari tabung dengan r = 10 cm dan t = 27 cm dipindahkan ke bola. Jika semua air cukup mengisi bola, tentukan jari-jari bola! (π sama)",
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\pi \\times 100 \\times 27 = 2700\\pi \\text{ cm}^3" },
      { label: "b.", math: "\\frac{4}{3}\\pi r^3 = 2700\\pi \\Rightarrow r^3 = 2025 \\Rightarrow r \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(31, "UN – Perubahan Luas Permukaan Tabung", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 10 cm diperbesar: r menjadi 14 cm dan t tetap 10 cm. Berapa kali luas selimut bertambah?",
    parts: [
      { label: "a.", math: "L_{s1} = 2\\pi \\times 7 \\times 10 = 140\\pi" },
      { label: "b.", math: "L_{s2} = 2\\pi \\times 14 \\times 10 = 280\\pi" },
      { label: "c.", math: "\\frac{L_{s2}}{L_{s1}} = \\frac{280}{140} = \\ldots \\text{ kali}" },
    ],
  }),
  Qn(32, "Soal Perbandingan – Tiga Tabung", {
    content: "Tabung I: r=2,t=9. Tabung II: r=3,t=4. Tabung III: r=6,t=1. Urutkan dari yang terkecil ke terbesar volumenya!",
    parts: [
      { label: "a.", math: "V_I = \\pi \\times 4 \\times 9 = 36\\pi" },
      { label: "b.", math: "V_{II} = \\pi \\times 9 \\times 4 = 36\\pi" },
      { label: "c.", math: "V_{III} = \\pi \\times 36 \\times 1 = 36\\pi \\quad \\Rightarrow \\text{Volume ketiganya...}" },
    ],
  }),
  Qn(33, "TKA – Perubahan r pada Kerucut", {
    content: "Jika jari-jari kerucut diperbesar n kali (t tetap), buktikan bahwa volume berubah n² kali!",
    parts: [
      { label: "a.", math: "V_1 = \\frac{1}{3}\\pi r^2 t" },
      { label: "b.", math: "V_2 = \\frac{1}{3}\\pi (nr)^2 t = n^2 \\times \\frac{1}{3}\\pi r^2 t = n^2 V_1" },
    ],
  }),
  Qn(34, "ANBK – Bola Baru dari Gabungan", {
    content: "Empat bola berjari-jari 3 cm dilebur menjadi satu bola besar. Tentukan jari-jari bola besar!",
    parts: [
      { label: "a.", math: "V_1 = \\frac{4}{3}\\pi \\times 27 = 36\\pi \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{total}} = 4 \\times 36\\pi = 144\\pi" },
      { label: "c.", math: "\\frac{4}{3}\\pi R^3 = 144\\pi \\Rightarrow R^3 = 108 \\Rightarrow R = \\sqrt[3]{108} \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(35, "UN – Volume Tabung Berubah karena r", {
    content: "Sebuah tabung mengalami pengurangan jari-jari dari 10 cm menjadi 8 cm, tinggi tetap 15 cm. Berapa persen volume berkurang? (π = 3,14)",
    parts: [
      { label: "a.", math: "V_1 = 3{,}14 \\times 100 \\times 15 = 4710 \\text{ cm}^3" },
      { label: "b.", math: "V_2 = 3{,}14 \\times 64 \\times 15 = 3014{,}4 \\text{ cm}^3" },
      { label: "c.", math: "\\% \\text{ berkurang} = \\frac{V_1 - V_2}{V_1} \\times 100\\% = \\ldots\\%" },
    ],
  }),
  Qn(36, "Soal Cerita – Pengisian Ulang Tabung", {
    content: "Air dari tabung A (r=7, t=10) seluruhnya dipindah ke tabung B (r=14, t=?). Jika tinggi air di B sama dengan 1/4 tinggi A, berapakah tinggi tabung B minimal? (π = 22/7)",
    parts: [
      { label: "a.", math: "V_A = \\frac{22}{7} \\times 49 \\times 10 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\frac{22}{7} \\times 196 \\times t_B = V_A \\Rightarrow t_B = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(37, "TKA – Volume Setengah Bola vs Kerucut", {
    content: "Sebuah setengah bola berjari-jari 6 cm dan sebuah kerucut berjari-jari 6 cm. Jika volume keduanya sama, berapa tinggi kerucut?",
    parts: [
      { label: "a.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3}\\pi \\times 216 = 144\\pi \\text{ cm}^3" },
      { label: "b.", math: "\\frac{1}{3}\\pi \\times 36 \\times t = 144\\pi \\Rightarrow t = \\frac{144 \\times 3}{36} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(38, "ANBK – Soal Kontekstual Perubahan Ukuran", {
    content: "Sebuah perusahaan mengecilkan ukuran kaleng minuman: r dari 3,5 cm menjadi 3 cm dan t dari 10 cm menjadi 8 cm. Berapa persen volume berkurang? (π = 22/7)",
    parts: [
      { label: "a.", math: "V_1 = \\frac{22}{7} \\times 12{,}25 \\times 10 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_2 = \\frac{22}{7} \\times 9 \\times 8 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\% = \\frac{V_1 - V_2}{V_1} \\times 100\\% = \\ldots\\%" },
    ],
  }),
  Qn(39, "UN Style – Mencari r agar Volume Sama", {
    content: "Sebuah bola berjari-jari 12 cm diubah menjadi kerucut dengan t = 96 cm. Berapa jari-jari kerucut agar volumenya sama?",
    parts: [
      { label: "a.", math: "V_{\\text{bola}} = \\frac{4}{3}\\pi \\times 1728 = 2304\\pi \\text{ cm}^3" },
      { label: "b.", math: "\\frac{1}{3}\\pi r^2 \\times 96 = 2304\\pi \\Rightarrow 32\\pi r^2 = 2304\\pi \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(40, "UN Terpadu – Perubahan Dimensi Bola", {
    content: "Bola A berjari-jari 6 cm. Bola B berjari-jari 12 cm. Hitunglah: (a) perbandingan luas permukaan A:B, (b) perbandingan volume A:B, (c) selisih volume! (π = 3,14)",
    parts: [
      { label: "a.", math: "\\frac{L_A}{L_B} = \\left(\\frac{6}{12}\\right)^2 = \\frac{1}{4}" },
      { label: "b.", math: "\\frac{V_A}{V_B} = \\left(\\frac{6}{12}\\right)^3 = \\frac{1}{8}" },
      { label: "c.", math: "\\Delta V = \\frac{4}{3} \\times 3{,}14 \\times (12^3 - 6^3) = \\ldots \\text{ cm}^3" },
    ],
  }),
];

const PerubahanVolumePage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔄</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-purple-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(168,85,247,0.7)' }}>
            PERUBAHAN VOLUME BANGUN RUANG SISI LENGKUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2">
            <span className="text-purple-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
          <p className="text-purple-300 text-xs font-bold mb-2">📌 Kunci Perubahan Volume</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Tabung (r dikali n, t tetap)", formula: "V_2 = n^2 V_1" },
              { label: "Tabung (t dikali m, r tetap)", formula: "V_2 = m \\cdot V_1" },
              { label: "Kerucut (r dikali n, t tetap)", formula: "V_2 = n^2 V_1" },
              { label: "Bola (r dikali n)", formula: "V_2 = n^3 V_1" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-purple-400 font-bold shrink-0 w-40 text-[11px]">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-purple-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-violet-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center shrink-0">
                    <span className="text-purple-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.math && <div className="mb-3 text-white/90 text-sm"><BlockMath math={q.math} /></div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-purple-400 text-xs font-bold shrink-0 mt-0.5 w-5">{p.label}</span>}
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

export default PerubahanVolumePage;
