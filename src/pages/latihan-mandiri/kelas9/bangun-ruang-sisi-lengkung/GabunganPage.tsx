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

function CylinderConeSVG({ r, hCyl, hCone, color = "#10b981" }: {
  r: number; hCyl: number; hCone: number; color?: string;
}) {
  const scale = 0.9;
  const R = r * scale * 5;
  const HC = hCyl * scale * 4;
  const HK = hCone * scale * 4;
  const ell = R * 0.28;
  const cx = 110;
  const baseY = 155;
  const topCylY = baseY - HC;
  const apexY = topCylY - HK;
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <ellipse cx={cx} cy={baseY} rx={R} ry={ell} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <ellipse cx={cx} cy={topCylY} rx={R} ry={ell} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <rect x={cx - R} y={topCylY} width={R * 2} height={HC} fill={color} fillOpacity="0.08" />
      <line x1={cx - R} y1={topCylY} x2={cx - R} y2={baseY} stroke={color} strokeWidth="1.8" />
      <line x1={cx + R} y1={topCylY} x2={cx + R} y2={baseY} stroke={color} strokeWidth="1.8" />
      <line x1={cx - R} y1={topCylY} x2={cx} y2={apexY} stroke={color} strokeWidth="1.8" />
      <line x1={cx + R} y1={topCylY} x2={cx} y2={apexY} stroke={color} strokeWidth="1.8" />
      <polygon points={`${cx - R},${topCylY} ${cx + R},${topCylY} ${cx},${apexY}`} fill={color} fillOpacity="0.12" />
      <text x={cx + R + 12} y={(topCylY + baseY) / 2} fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">t={hCyl}</text>
      <text x={cx + R + 12} y={(apexY + topCylY) / 2} fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">t={hCone}</text>
      <text x={cx} y={baseY + 18} fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">r={r}</text>
    </svg>
  );
}

function CylinderHemiSVG({ r, hCyl, color = "#10b981" }: {
  r: number; hCyl: number; color?: string;
}) {
  const R = Math.min(r * 6, 68);
  const HC = Math.min(hCyl * 7, 85);
  const ell = R * 0.28;
  const cx = 110;
  const baseY = 155;
  const topCylY = baseY - HC;
  return (
    <svg viewBox="0 0 220 210" width="220" height="210" className="mx-auto">
      <ellipse cx={cx} cy={baseY} rx={R} ry={ell} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <ellipse cx={cx} cy={topCylY} rx={R} ry={ell} fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.2" strokeDasharray="4,3" />
      <rect x={cx - R} y={topCylY} width={R * 2} height={HC} fill={color} fillOpacity="0.07" />
      <line x1={cx - R} y1={topCylY} x2={cx - R} y2={baseY} stroke={color} strokeWidth="1.8" />
      <line x1={cx + R} y1={topCylY} x2={cx + R} y2={baseY} stroke={color} strokeWidth="1.8" />
      <path d={`M ${cx - R} ${topCylY} A ${R} ${R} 0 0 1 ${cx + R} ${topCylY}`} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.8" />
      <text x={cx + R + 12} y={(topCylY + baseY) / 2} fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">t={hCyl}</text>
      <text x={cx} y={baseY + 18} fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">r={r}</text>
      <text x={cx} y={topCylY - 18} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">½ Bola (r={r})</text>
    </svg>
  );
}

function ConeHemiSVG({ r, hCone, color = "#10b981" }: {
  r: number; hCone: number; color?: string;
}) {
  const R = Math.min(r * 7, 68);
  const HC = Math.min(hCone * 7, 75);
  const ell = R * 0.28;
  const cx = 110;
  const baseY = 150;
  const apexY = baseY - HC;
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <ellipse cx={cx} cy={baseY} rx={R} ry={ell} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1={cx - R} y1={baseY} x2={cx} y2={apexY} stroke={color} strokeWidth="1.8" />
      <line x1={cx + R} y1={baseY} x2={cx} y2={apexY} stroke={color} strokeWidth="1.8" />
      <polygon points={`${cx - R},${baseY} ${cx + R},${baseY} ${cx},${apexY}`} fill={color} fillOpacity="0.10" />
      <path d={`M ${cx - R} ${baseY} A ${R} ${R} 0 0 0 ${cx + R} ${baseY}`} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.8" />
      <text x={cx} y={baseY + 20} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">½ Bola (r={r})</text>
      <text x={cx + R + 12} y={(apexY + baseY) / 2} fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">t={hCone}</text>
      <text x={cx} y={apexY - 8} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
    </svg>
  );
}

const questions: Q[] = [
  Qn(1, "Tabung + Kerucut – Volume", {
    content: "Sebuah tenda berbentuk tabung dengan r = 7 m, t = 3 m, dilengkapi atap berbentuk kerucut dengan r = 7 m dan t = 2 m. Hitunglah total volume tenda! (π = 22/7)",
    diagram: <CylinderConeSVG r={7} hCyl={3} hCone={2} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 49 \\times 3 = \\ldots \\text{ m}^3" },
      { label: "b.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times 2 = \\ldots \\text{ m}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ m}^3" },
    ],
  }),
  Qn(2, "Tabung + Kerucut – Luas Permukaan", {
    content: "Sebuah peluru kendali (model) berbentuk tabung dengan r = 5 cm, t = 12 cm, dan ujung berbentuk kerucut dengan r = 5 cm, s = 13 cm. Hitunglah luas permukaan luar! (π = 3,14)",
    diagram: <CylinderConeSVG r={5} hCyl={12} hCone={5} />,
    parts: [
      { label: "a.", math: "L_{\\text{alas tabung}} = \\pi r^2 = 3{,}14 \\times 25 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut tabung}} = 2\\pi r t = 2 \\times 3{,}14 \\times 5 \\times 12 = \\ldots" },
      { label: "c.", math: "L_{\\text{selimut kerucut}} = \\pi r s = 3{,}14 \\times 5 \\times 13 = \\ldots" },
      { label: "d.", math: "L_{\\text{total}} = L_{\\text{alas}} + L_{\\text{selimut tabung}} + L_{\\text{selimut kerucut}} = \\ldots" },
    ],
  }),
  Qn(3, "Tabung + Setengah Bola – Volume", {
    content: "Sebuah kapsul obat berbentuk tabung dengan r = 0,7 cm dan t = 2 cm, dengan kedua ujungnya berbentuk setengah bola r = 0,7 cm. Hitunglah volume kapsul! (π = 22/7)",
    diagram: <CylinderHemiSVG r={0.7} hCyl={2} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times (0{,}7)^2 \\times 2 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{1 bola penuh}} = \\frac{4}{3} \\times \\frac{22}{7} \\times (0{,}7)^3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = V_{\\text{tabung}} + V_{\\text{bola}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(4, "Tabung + Setengah Bola – Luas Permukaan", {
    content: "Sebuah tangki bahan bakar berbentuk tabung dengan r = 21 cm dan t = 50 cm. Bagian atas berbentuk setengah bola r = 21 cm. Hitunglah luas permukaan luar tangki! (π = 22/7)",
    diagram: <CylinderHemiSVG r={21} hCyl={50} />,
    parts: [
      { label: "a.", math: "L_{\\text{alas}} = \\pi r^2 = \\frac{22}{7} \\times 441 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut tabung}} = 2\\pi r t = 2 \\times \\frac{22}{7} \\times 21 \\times 50 = \\ldots" },
      { label: "c.", math: "L_{\\text{setengah bola}} = 2\\pi r^2 = 2 \\times \\frac{22}{7} \\times 441 = \\ldots" },
      { label: "d.", math: "L_{\\text{total}} = L_{\\text{alas}} + L_{\\text{selimut}} + L_{\\text{setengah bola}} = \\ldots" },
    ],
  }),
  Qn(5, "Kerucut + Setengah Bola – Volume", {
    content: "Sebuah ice cream cone: setengah bola es krim r = 3,5 cm di atas kerucut r = 3,5 cm, t = 12 cm. Hitunglah total volumenya! (π = 22/7)",
    diagram: <ConeHemiSVG r={3.5} hCone={12} />,
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times \\frac{22}{7} \\times (3{,}5)^2 \\times 12 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times \\frac{22}{7} \\times (3{,}5)^3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(6, "Soal Cerita – Menara Air", {
    content: "Sebuah menara air berbentuk tabung dengan r = 3,5 m dan t = 5 m, dengan bagian atas berbentuk setengah bola r = 3,5 m. Berapa m³ total volume menara? (π = 22/7)",
    diagram: <CylinderHemiSVG r={3.5} hCyl={5} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 12{,}25 \\times 5 = \\ldots \\text{ m}^3" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times \\frac{22}{7} \\times (3{,}5)^3 = \\ldots \\text{ m}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ m}^3" },
    ],
  }),
  Qn(7, "Soal Cerita – Gentong Air", {
    content: "Sebuah gentong air berbentuk tabung r = 21 cm, t = 40 cm, dengan tutup berbentuk kerucut r = 21 cm, t = 14 cm. Berapa liter air yang dapat ditampung (tanpa tutup)? (π = 22/7)",
    diagram: <CylinderConeSVG r={21} hCyl={40} hCone={14} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 441 \\times 40 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V \\text{ (liter)} = \\frac{V}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(8, "Luas Permukaan – Pensil Runcing", {
    content: "Sebuah pensil (model geometri) terdiri dari tabung dengan r = 0,5 cm, t = 15 cm dan ujung runcing berbentuk kerucut r = 0,5 cm, s = 2 cm. Berapa luas permukaan luar (tanpa alas tabung)? (π = 3,14)",
    diagram: <CylinderConeSVG r={0.5} hCyl={15} hCone={2} />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut tabung}} = 2\\pi r t = 2 \\times 3{,}14 \\times 0{,}5 \\times 15 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut kerucut}} = \\pi r s = 3{,}14 \\times 0{,}5 \\times 2 = \\ldots" },
      { label: "c.", math: "L_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(9, "UN Style – Silo Penyimpanan", {
    content: "Sebuah silo terdiri dari tabung r = 7 m, t = 10 m, dan bagian atas berbentuk kerucut r = 7 m, t = 4 m. Berapa m³ total volume? (π = 22/7)",
    diagram: <CylinderConeSVG r={7} hCyl={10} hCone={4} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 49 \\times 10 = \\ldots" },
      { label: "b.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times 4 = \\ldots" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ m}^3" },
    ],
  }),
  Qn(10, "Soal Cerita – Bola Salju", {
    content: "Sebuah tiang bendera terdiri dari batang silinder r = 2 cm, t = 200 cm, dan ujung atas berbentuk bola r = 3 cm. Berapa total luas permukaan yang dicat (selimut tabung + luas bola)? (π = 3,14)",
    parts: [
      { label: "a.", math: "L_{\\text{selimut tabung}} = 2\\pi \\times 2 \\times 200 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L_{\\text{bola}} = 4\\pi \\times 9 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "L_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(11, "Tabung + 2 Setengah Bola (Kapsul Penuh)", {
    content: "Sebuah kapsul berbentuk tabung r = 7 mm, t = 14 mm, dengan ujung kiri dan kanan masing-masing setengah bola r = 7 mm. Hitunglah total volume kapsul! (π = 22/7)",
    diagram: <CylinderHemiSVG r={7} hCyl={14} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 49 \\times 14 = \\ldots \\text{ mm}^3" },
      { label: "b.", math: "V_{\\text{bola penuh}} = \\frac{4}{3} \\times \\frac{22}{7} \\times 343 = \\ldots \\text{ mm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ mm}^3" },
    ],
  }),
  Qn(12, "UN Style – Soal Tenda Kemah", {
    content: "Sebuah tenda kemah berbentuk tabung r = 3 m, t = 2 m, dan atap kerucut r = 3 m, t = 2 m. Berapa m² kain yang dibutuhkan untuk selimut tabung + selimut kerucut (s = √13 m)? (π = 3,14)",
    diagram: <CylinderConeSVG r={3} hCyl={2} hCone={2} />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut tabung}} = 2\\pi \\times 3 \\times 2 = \\ldots \\text{ m}^2" },
      { label: "b.", math: "s = \\sqrt{3^2 + 2^2} = \\sqrt{13} \\approx 3{,}61 \\text{ m}" },
      { label: "c.", math: "L_{\\text{selimut kerucut}} = \\pi \\times 3 \\times \\sqrt{13} \\approx \\ldots \\text{ m}^2" },
      { label: "d.", math: "L_{\\text{kain}} = \\ldots + \\ldots \\approx \\ldots \\text{ m}^2" },
    ],
  }),
  Qn(13, "ANBK – Kaleng Spray", {
    content: "Sebuah kaleng spray terdiri dari tabung r = 3 cm, t = 18 cm, dan tutup atas setengah bola r = 3 cm. Hitunglah luas permukaan luar kaleng! (π = 3,14)",
    diagram: <CylinderHemiSVG r={3} hCyl={18} />,
    parts: [
      { label: "a.", math: "L_{\\text{alas}} = \\pi r^2 = 3{,}14 \\times 9 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut tabung}} = 2\\pi r t = 2 \\times 3{,}14 \\times 3 \\times 18 = \\ldots" },
      { label: "c.", math: "L_{\\frac{1}{2}\\text{bola}} = 2\\pi r^2 = 2 \\times 3{,}14 \\times 9 = \\ldots" },
      { label: "d.", math: "L_{\\text{total}} = \\ldots + \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(14, "Soal Cerita – Granat Model", {
    content: "Sebuah model granat terdiri dari silinder r = 4 cm, t = 6 cm, dan setengah bola r = 4 cm di bagian atas. Berapa total volumenya? (π = 3,14)",
    diagram: <CylinderHemiSVG r={4} hCyl={6} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = 3{,}14 \\times 16 \\times 6 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 64 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(15, "TKA – Kerucut di Atas Setengah Bola", {
    content: "Sebuah ornamen berbentuk kerucut r = 6 cm, t = 8 cm, berdiri di atas setengah bola r = 6 cm. Hitunglah total volumenya! (π = 3,14)",
    diagram: <ConeHemiSVG r={6} hCone={8} />,
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 36 \\times 8 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 216 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(16, "UN – Luas Permukaan Gabungan Kerucut+½Bola", {
    content: "Sebuah pion catur berbentuk kerucut dengan r = 5 cm, s = 13 cm, di atas setengah bola r = 5 cm. Hitunglah luas permukaan total pion (selimut kerucut + lengkung ½ bola)! (π = 3,14)",
    diagram: <ConeHemiSVG r={5} hCone={12} />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut kerucut}} = \\pi r s = 3{,}14 \\times 5 \\times 13 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L_{\\frac{1}{2}\\text{bola}} = 2\\pi r^2 = 2 \\times 3{,}14 \\times 25 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "L_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(17, "ANBK – Tabung + Setengah Bola Bawah", {
    content: "Sebuah balon gas berbentuk tabung r = 14 cm, t = 30 cm, dengan bagian bawah setengah bola r = 14 cm. Berapa total volume? (π = 22/7)",
    diagram: <CylinderHemiSVG r={14} hCyl={30} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 196 \\times 30 = \\ldots" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times \\frac{22}{7} \\times 2744 = \\ldots" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(18, "Soal Cerita – Es Krim Gelato", {
    content: "Sebuah gelato terdiri dari setengah bola es krim r = 4 cm di atas kerucut r = 4 cm, t = 9 cm. Berapa total volume es krim? (π = 3,14)",
    diagram: <ConeHemiSVG r={4} hCone={9} />,
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 16 \\times 9 = \\ldots" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 64 = \\ldots" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(19, "UN Style – Peluru Kerucut+Tabung", {
    content: "Peluru (model) berbentuk tabung r = 1 cm, t = 4 cm, dengan ujung kerucut r = 1 cm, t = 2 cm. Berapa total volume? (π = 3,14)",
    diagram: <CylinderConeSVG r={1} hCyl={4} hCone={2} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = 3{,}14 \\times 1 \\times 4 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 1 \\times 2 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(20, "Soal Cerita – Tempat Pensil", {
    content: "Sebuah tempat pensil berbentuk tabung r = 5 cm, t = 15 cm, tanpa tutup atas. Dekorasi atasnya berbentuk setengah bola r = 5 cm dilepas. Berapa luas permukaan tabung saja (tanpa alas dan tanpa tutup)? (π = 3,14)",
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r t = 2 \\times 3{,}14 \\times 5 \\times 15 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(21, "TKA – Tiga Kerucut dalam Tabung", {
    content: "Sebuah tabung r = 6 cm, t = 9 cm berisi tiga kerucut identik yang masing-masing r = 2 cm, t = 9 cm. Berapa volume ruang kosong dalam tabung? (π = 3,14)",
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = 3{,}14 \\times 36 \\times 9 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{1\\text{ kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 4 \\times 9 = \\ldots" },
      { label: "c.", math: "V_{\\text{sisa}} = V_{\\text{tabung}} - 3 \\times V_{\\text{kerucut}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(22, "Soal Cerita – Mangkuk Setengah Bola dalam Tabung", {
    content: "Sebuah mangkuk berbentuk setengah bola r = 10 cm dimasukkan ke dalam tabung r = 10 cm dan t = 10 cm. Berapa volume air yang dapat ditampung di tabung (di luar mangkuk)? (π = 3,14)",
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = 3{,}14 \\times 100 \\times 10 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 1000 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{air}} = V_{\\text{tabung}} - V_{\\frac{1}{2}\\text{bola}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(23, "UN – Roket Sederhana", {
    content: "Model roket terdiri dari tabung r = 7 cm, t = 30 cm, dan hidung kerucut r = 7 cm, t = 15 cm, serta 4 sirip berbentuk segitiga (abaikan). Hitunglah total volume badan roket! (π = 22/7)",
    diagram: <CylinderConeSVG r={7} hCyl={30} hCone={15} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 49 \\times 30 = \\ldots" },
      { label: "b.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times 15 = \\ldots" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(24, "ANBK – Drum Kimia Tertutup", {
    content: "Sebuah drum kimia: tabung r = 14 cm, t = 50 cm, tutup bawah berbentuk setengah bola r = 14 cm, dan tutup atas datar. Berapa liter kapasitasnya? (π = 22/7)",
    diagram: <CylinderHemiSVG r={14} hCyl={50} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 196 \\times 50 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times \\frac{22}{7} \\times 2744 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V \\text{ (liter)} = \\frac{V_{\\text{total}}}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(25, "TKA – Soal Cerita Tabung+Kerucut+Bola", {
    content: "Sebuah mainan terdiri dari bola r = 5 cm di atas tabung r = 5 cm, t = 10 cm. Berapa total luas permukaan luar mainan (luas bola + selimut tabung + alas tabung)? (π = 3,14)",
    parts: [
      { label: "a.", math: "L_{\\text{bola}} = 4\\pi r^2 = 4 \\times 3{,}14 \\times 25 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut tabung}} = 2\\pi r t = 2 \\times 3{,}14 \\times 5 \\times 10 = \\ldots" },
      { label: "c.", math: "L_{\\text{alas}} = \\pi r^2 = 3{,}14 \\times 25 = \\ldots" },
      { label: "d.", math: "L_{\\text{total}} = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(26, "UN Style – Volume Es Krim Bar", {
    content: "Es krim bar terdiri dari balok berbentuk tabung r = 3 cm, t = 8 cm, dengan dua ujung masing-masing setengah bola r = 3 cm. Berapa cm³ es krim? (π = 3,14)",
    diagram: <CylinderHemiSVG r={3} hCyl={8} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = 3{,}14 \\times 9 \\times 8 = \\ldots" },
      { label: "b.", math: "V_{\\text{bola penuh}} = \\frac{4}{3} \\times 3{,}14 \\times 27 = \\ldots" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(27, "ANBK – Menara Observasi", {
    content: "Menara observasi: tabung r = 5 m, t = 20 m, dan kubah setengah bola r = 5 m di atas. Berapa m³ total volume? (π = 3,14)",
    diagram: <CylinderHemiSVG r={5} hCyl={20} />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = 3{,}14 \\times 25 \\times 20 = \\ldots \\text{ m}^3" },
      { label: "b.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 125 = \\ldots \\text{ m}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ m}^3" },
    ],
  }),
  Qn(28, "Soal Cerita – Kubus dengan Bola Dibuang", {
    content: "Sebuah kubus bersisi 14 cm dilubangi di tengah berbentuk bola r = 7 cm. Berapa cm³ volume kubus yang tersisa? (π = 22/7)",
    parts: [
      { label: "a.", math: "V_{\\text{kubus}} = 14^3 = 2744 \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{bola}} = \\frac{4}{3} \\times \\frac{22}{7} \\times 7^3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = 2744 - \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(29, "UN – Tabung Dilubangi Kerucut", {
    content: "Sebuah tabung r = 10 cm, t = 20 cm, dilubangi kerucut r = 10 cm, t = 20 cm dari atas. Berapa volume benda yang tersisa? (π = 3,14)",
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = 3{,}14 \\times 100 \\times 20 = 6280 \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 100 \\times 20 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = 6280 - \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(30, "TKA – Wajan Setengah Bola+Tabung", {
    content: "Sebuah wajan berbentuk setengah bola r = 21 cm (bagian bawah) dengan bibir tabung r = 21 cm, t = 5 cm. Berapa total kapasitas wajan? (π = 22/7)",
    diagram: <CylinderHemiSVG r={21} hCyl={5} />,
    parts: [
      { label: "a.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times \\frac{22}{7} \\times 21^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 441 \\times 5 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(31, "UN – Luas Permukaan Gabungan Tiga Bangun", {
    content: "Sebuah benda terdiri dari tabung r = 7 cm, t = 10 cm, dan setengah bola di atas r = 7 cm. Hitunglah luas permukaan luar benda! (π = 22/7)",
    diagram: <CylinderHemiSVG r={7} hCyl={10} />,
    parts: [
      { label: "a.", math: "L_{\\text{alas tabung}} = \\pi r^2 = \\frac{22}{7} \\times 49 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut tabung}} = 2\\pi r t = 2 \\times \\frac{22}{7} \\times 7 \\times 10 = \\ldots" },
      { label: "c.", math: "L_{\\frac{1}{2}\\text{bola}} = 2\\pi r^2 = 2 \\times \\frac{22}{7} \\times 49 = \\ldots" },
      { label: "d.", math: "L_{\\text{total}} = \\ldots + \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(32, "ANBK – Soal Campuran Lengkap", {
    content: "Sebuah mainan: setengah bola r = 6 cm (bawah) + tabung r = 6 cm, t = 10 cm (tengah) + kerucut r = 6 cm, t = 8 cm (atas). Berapa total volume? (π = 3,14)",
    parts: [
      { label: "a.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 216 = \\ldots" },
      { label: "b.", math: "V_{\\text{tabung}} = 3{,}14 \\times 36 \\times 10 = \\ldots" },
      { label: "c.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 36 \\times 8 = \\ldots" },
      { label: "d.", math: "V_{\\text{total}} = \\ldots + \\ldots + \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(33, "Soal Cerita – Bohlam Lampu", {
    content: "Sebuah bohlam lampu berbentuk setengah bola r = 3 cm di atas tabung r = 1,5 cm, t = 5 cm. Berapa total volume bohlam? (π = 3,14)",
    diagram: <CylinderHemiSVG r={3} hCyl={5} />,
    parts: [
      { label: "a.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 27 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{tabung}} = 3{,}14 \\times 2{,}25 \\times 5 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(34, "UN Style – Biaya Cat Gabungan", {
    content: "Benda terdiri dari tabung r = 7 cm, t = 10 cm, dan setengah bola di atas r = 7 cm. Jika biaya cat Rp2.000/cm², berapa biaya mengcat seluruh permukaannya (tanpa alas)? (π = 22/7)",
    parts: [
      { label: "a.", math: "L_{\\text{selimut tabung}} = 2\\pi \\times 7 \\times 10 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L_{\\frac{1}{2}\\text{bola}} = 2\\pi \\times 49 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "\\text{Biaya} = (\\ldots + \\ldots) \\times 2000 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(35, "TKA – Tangki Bola + Pipa Tabung", {
    content: "Sebuah sistem tangki: bola r = 21 cm + pipa tabung r = 3,5 cm, t = 100 cm. Berapa total volume sistem? (π = 22/7)",
    parts: [
      { label: "a.", math: "V_{\\text{bola}} = \\frac{4}{3} \\times \\frac{22}{7} \\times 21^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{pipa}} = \\frac{22}{7} \\times 12{,}25 \\times 100 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(36, "ANBK – Luas Selimut Gabungan", {
    content: "Sebuah corong (kerucut tanpa alas r = 10 cm, s = 15 cm) disambung ke tabung r = 10 cm, t = 20 cm. Berapa cm² luas selimut gabungan? (π = 3,14)",
    diagram: <CylinderConeSVG r={10} hCyl={20} hCone={12} />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut kerucut}} = \\pi r s = 3{,}14 \\times 10 \\times 15 = \\ldots" },
      { label: "b.", math: "L_{\\text{selimut tabung}} = 2\\pi r t = 2 \\times 3{,}14 \\times 10 \\times 20 = \\ldots" },
      { label: "c.", math: "L_{\\text{gabungan}} = \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(37, "Soal Cerita – Bak Cuci Piring", {
    content: "Bak cuci piring berbentuk setengah bola r = 20 cm. Berapa liter air yang dapat ditampung? (π = 3,14, 1 liter = 1.000 cm³)",
    parts: [
      { label: "a.", math: "V = \\frac{2}{3} \\times 3{,}14 \\times 8000 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V \\text{ (liter)} = \\frac{V}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(38, "UN Terpadu – Soal Selisih Volume", {
    content: "Sebuah kerucut r = 10 cm, t = 30 cm, dan sebuah tabung r = 10 cm, t = 10 cm berdiri berdampingan. Berapa selisih volume keduanya? (π = 3,14)",
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 100 \\times 30 = \\ldots" },
      { label: "b.", math: "V_{\\text{tabung}} = 3{,}14 \\times 100 \\times 10 = \\ldots" },
      { label: "c.", math: "\\Delta V = |V_{\\text{kerucut}} - V_{\\text{tabung}}| = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(39, "ANBK – Soal Kontekstual Isi Air", {
    content: "Sebuah ember berbentuk setengah bola r = 21 cm penuh air. Air dituangkan ke dalam tabung r = 7 cm. Berapa tinggi air dalam tabung? (π = 22/7)",
    parts: [
      { label: "a.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times \\frac{22}{7} \\times 21^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\frac{22}{7} \\times 49 \\times t = V_{\\frac{1}{2}\\text{bola}} \\Rightarrow t = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(40, "UN Terpadu – Soal Lengkap Gabungan", {
    content: "Sebuah kendaraan model: tabung r = 5 cm, t = 15 cm (badan), ditambah setengah bola r = 5 cm (depan), dan kerucut r = 5 cm, t = 6 cm (belakang). Hitunglah: (a) total volume, (b) total luas permukaan luar! (π = 3,14)",
    parts: [
      { label: "a.", math: "V_{\\frac{1}{2}\\text{bola}} = \\frac{2}{3} \\times 3{,}14 \\times 125 = \\ldots" },
      { label: "b.", math: "V_{\\text{tabung}} = 3{,}14 \\times 25 \\times 15 = \\ldots" },
      { label: "c.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times 3{,}14 \\times 25 \\times 6 = \\ldots" },
      { label: "d.", math: "V_{\\text{total}} = \\ldots + \\ldots + \\ldots = \\ldots \\text{ cm}^3" },
      { label: "e.", math: "L_{\\text{total}} = 2\\pi r^2 + 2\\pi r t + \\pi r s_{\\text{kerucut}} = \\ldots \\text{ cm}^2" },
    ],
  }),
];

const GabunganPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🧩</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(16,185,129,0.7)' }}>
            BANGUN RUANG SISI LENGKUNG GABUNGAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Strategi Soal Gabungan</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              "Volume gabungan = jumlah volume setiap bangun penyusun",
              "Luas permukaan = bagian yang terlihat dari luar saja",
              "Bidang pertemuan dua bangun TIDAK dihitung sebagai permukaan luar",
              "Perhatikan apakah alas/tutup bangun termasuk atau tidak",
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span className="text-white/60">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.math && <div className="mb-3 text-white/90 text-sm"><BlockMath math={q.math} /></div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-400 text-xs font-bold shrink-0 mt-0.5 w-5">{p.label}</span>}
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

export default GabunganPage;
