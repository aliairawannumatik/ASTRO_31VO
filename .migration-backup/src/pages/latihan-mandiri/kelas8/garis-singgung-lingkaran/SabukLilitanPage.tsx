import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { RefreshCw } from "lucide-react";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  difficulty?: "Mudah" | "Sedang" | "Sulit";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const BG = "rgba(2,8,23,0.97)";
const VC = "#a78bfa";

/* ─── helpers ─────────────────────────────────────────── */

function externalTangentPoints(
  x1: number, y1: number,
  x2: number, y2: number,
  r: number,
  side: 1 | -1
): [number, number, number, number] {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len * side, ny = dx / len * side;
  return [x1 + nx * r, y1 + ny * r, x2 + nx * r, y2 + ny * r];
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number, clockwise = true) {
  const s = clockwise ? 1 : 0;
  const sa = startAngle * Math.PI / 180;
  const ea = endAngle * Math.PI / 180;
  const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
  const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
  let dAngle = clockwise ? (endAngle - startAngle + 360) % 360 : (startAngle - endAngle + 360) % 360;
  const large = dAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${s} ${x2} ${y2}`;
}

/* ─── SVG Components ───────────────────────────────────── */

const DuaKaleng = ({ r = 40, size = 220 }: { r?: number; size?: number }) => {
  const gap = r * 2;
  const cx1 = size / 2 - gap / 2;
  const cx2 = size / 2 + gap / 2;
  const cy = size / 2;
  const beltColor = "#facc15";
  const circleColor = VC;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={BG} rx="12" />
      <line x1={cx1} y1={cy - r} x2={cx2} y2={cy - r} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx1} y1={cy + r} x2={cx2} y2={cy + r} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M ${cx1} ${cy - r} A ${r} ${r} 0 1 0 ${cx1} ${cy + r}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      <path d={`M ${cx2} ${cy - r} A ${r} ${r} 0 1 1 ${cx2} ${cy + r}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      <circle cx={cx1} cy={cy} r={r} fill={`${circleColor}18`} stroke={circleColor} strokeWidth="2" />
      <circle cx={cx2} cy={cy} r={r} fill={`${circleColor}18`} stroke={circleColor} strokeWidth="2" />
      <circle cx={cx1} cy={cy} r={3.5} fill={circleColor} stroke="var(--icon-stroke)" strokeWidth="1" />
      <circle cx={cx2} cy={cy} r={3.5} fill={circleColor} stroke="var(--icon-stroke)" strokeWidth="1" />
      <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
      <text x={cx1 - 6} y={cy + 16} fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">O₁</text>
      <text x={cx2 - 6} y={cy + 16} fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">O₂</text>
      <text x={(cx1 + cx2) / 2 - 6} y={cy + 12} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">d</text>
      <text x={cx1 - 14} y={cy - r / 2} fill={circleColor} fontSize="9" fontFamily="sans-serif">r</text>
    </svg>
  );
};

const BarisanLingkaran = ({ n, r = 28, size = 280 }: { n: number; r?: number; size?: number }) => {
  const margin = r + 12;
  const totalW = 2 * r * n;
  const vw = 2 * margin + totalW;
  const vh = 2 * r + 48;
  const cy = vh / 2;
  const centers = Array.from({ length: n }, (_, i) => margin + r + i * 2 * r);
  const cx0 = centers[0], cxN = centers[n - 1];
  const beltColor = "#facc15";
  const circleColor = VC;
  return (
    <svg width={size} height={size * vh / vw} viewBox={`0 0 ${vw} ${vh}`}>
      <rect width={vw} height={vh} fill={BG} rx="12" />
      <line x1={cx0} y1={cy - r} x2={cxN} y2={cy - r} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx0} y1={cy + r} x2={cxN} y2={cy + r} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M ${cx0} ${cy - r} A ${r} ${r} 0 1 0 ${cx0} ${cy + r}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      <path d={`M ${cxN} ${cy - r} A ${r} ${r} 0 1 1 ${cxN} ${cy + r}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      {centers.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={`${circleColor}18`} stroke={circleColor} strokeWidth="1.8" />
          <circle cx={cx} cy={cy} r={3} fill={circleColor} stroke="var(--icon-stroke)" strokeWidth="0.8" />
          {i < n - 1 && <line x1={cx} y1={cy} x2={cx + 2 * r} y2={cy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />}
        </g>
      ))}
      <text x={cx0 - 8} y={cy + r + 14} fill="#94a3b8" fontSize="10" fontFamily="serif">O₁</text>
      <text x={cxN - 8} y={cy + r + 14} fill="#94a3b8" fontSize="10" fontFamily="serif">O{n}</text>
    </svg>
  );
};

const SegitigaLingkaran = ({ r = 40, size = 240 }: { r?: number; size?: number }) => {
  const h = r * Math.sqrt(3);
  const cx = size / 2;
  const cy = size / 2 + r * 0.2;
  const c1 = { x: cx - r, y: cy + h / 3 };
  const c2 = { x: cx + r, y: cy + h / 3 };
  const c3 = { x: cx, y: cy - 2 * h / 3 };
  const circles = [c1, c2, c3];
  const beltColor = "#facc15";
  const circleColor = VC;
  const segments: [number, number, number, number, string][] = [];
  const arcs: { cx: number; cy: number; start: number; end: number }[] = [];
  const pairs = [[0, 1], [1, 2], [2, 0]] as const;
  pairs.forEach(([i, j]) => {
    const a = circles[i], b = circles[j];
    const dx = b.x - a.x, dy = b.y - a.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const nx = -dy / (2 * r), ny = dx / (2 * r);
    const tx1 = a.x + nx * r, ty1 = a.y + ny * r;
    const tx2 = b.x + nx * r, ty2 = b.y + ny * r;
    segments.push([tx1, ty1, tx2, ty2, `${angle}`]);
  });
  const arcAngles = [
    { cx: c1.x, cy: c1.y, start: 210, end: 330 },
    { cx: c2.x, cy: c2.y, start: 330, end: 90 },
    { cx: c3.x, cy: c3.y, start: 90, end: 210 },
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={BG} rx="12" />
      {segments.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {arcAngles.map((a, i) => (
        <path key={i} d={arcPath(a.cx, a.cy, r, a.start, a.end, true)}
          fill="none" stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {circles.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={r} fill={`${circleColor}18`} stroke={circleColor} strokeWidth="1.8" />
          <circle cx={c.x} cy={c.y} r={3} fill={circleColor} stroke="var(--icon-stroke)" strokeWidth="0.8" />
        </g>
      ))}
      <text x={c1.x - 12} y={c1.y + 16} fill="#94a3b8" fontSize="10" fontFamily="serif">O₁</text>
      <text x={c2.x + 4} y={c2.y + 16} fill="#94a3b8" fontSize="10" fontFamily="serif">O₂</text>
      <text x={c3.x - 6} y={c3.y - 8} fill="#94a3b8" fontSize="10" fontFamily="serif">O₃</text>
    </svg>
  );
};

const GridLingkaran = ({ cols, rows, r = 26, size = 280 }: { cols: number; rows: number; r?: number; size?: number }) => {
  const margin = r + 10;
  const vw = 2 * margin + cols * 2 * r;
  const vh = 2 * margin + rows * 2 * r;
  const beltColor = "#facc15";
  const circleColor = VC;
  const centers: { x: number; y: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      centers.push({ x: margin + r + col * 2 * r, y: margin + r + row * 2 * r });
    }
  }
  const left = margin, right = margin + cols * 2 * r, top = margin, bottom = margin + rows * 2 * r;
  const cx0 = margin + r, cxN = margin + r + (cols - 1) * 2 * r;
  const cy0 = margin + r, cyN = margin + r + (rows - 1) * 2 * r;
  const scaleX = size / vw, scaleY = size * (vh / vw) / vh;
  return (
    <svg width={size} height={size * vh / vw} viewBox={`0 0 ${vw} ${vh}`}>
      <rect width={vw} height={vh} fill={BG} rx="12" />
      <line x1={cx0} y1={top - r} x2={cxN} y2={top - r} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx0} y1={bottom + r} x2={cxN} y2={bottom + r} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={left - r} y1={cy0} x2={left - r} y2={cyN} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={right + r} y1={cy0} x2={right + r} y2={cyN} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M ${left - r} ${cy0} A ${r} ${r} 0 0 1 ${cx0} ${top - r}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      <path d={`M ${cxN} ${top - r} A ${r} ${r} 0 0 1 ${right + r} ${cy0}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      <path d={`M ${right + r} ${cyN} A ${r} ${r} 0 0 1 ${cxN} ${bottom + r}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      <path d={`M ${cx0} ${bottom + r} A ${r} ${r} 0 0 1 ${left - r} ${cyN}`} fill="none" stroke={beltColor} strokeWidth="2.5" />
      {centers.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={r} fill={`${circleColor}18`} stroke={circleColor} strokeWidth="1.5" />
          <circle cx={c.x} cy={c.y} r={2.5} fill={circleColor} />
        </g>
      ))}
    </svg>
  );
};

const BowlingLingkaran = ({ r = 26, size = 260 }: { r?: number; size?: number }) => {
  const rows = [4, 3, 2, 1];
  const spacing = r * 2;
  const totalW = 3 * spacing + 2 * r;
  const totalH = 3 * spacing * (Math.sqrt(3) / 2) + 2 * r;
  const vw = totalW + 20, vh = totalH + 20;
  const offsetX = 10 + r;
  const offsetY = 10 + r;
  const centers: { x: number; y: number }[] = [];
  const rowH = spacing * Math.sqrt(3) / 2;
  rows.forEach((count, rowIdx) => {
    const y = offsetY + rowIdx * rowH;
    const startX = offsetX + rowIdx * r;
    for (let col = 0; col < count; col++) {
      centers.push({ x: startX + col * spacing, y });
    }
  });
  const beltColor = "#facc15";
  const circleColor = VC;
  const corner1 = centers[0];
  const corner2 = centers[3];
  const corner3 = centers[9];
  return (
    <svg width={size} height={size * vh / vw} viewBox={`0 0 ${vw} ${vh}`}>
      <rect width={vw} height={vh} fill={BG} rx="12" />
      {[
        { from: corner1, to: corner2, side: -1 as const },
        { from: corner2, to: corner3, side: -1 as const },
        { from: corner3, to: corner1, side: -1 as const },
      ].map(({ from, to, side }, i) => {
        const [x1, y1, x2, y2] = externalTangentPoints(from.x, from.y, to.x, to.y, r, side);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />;
      })}
      {(() => {
        const corners = [corner1, corner2, corner3];
        const arcDefs = [
          { cx: corner1.x, cy: corner1.y, start: 150, end: 270 },
          { cx: corner2.x, cy: corner2.y, start: 270, end: 30 },
          { cx: corner3.x, cy: corner3.y, start: 30, end: 150 },
        ];
        return arcDefs.map((a, i) => (
          <path key={i} d={arcPath(a.cx, a.cy, r, a.start, a.end, true)}
            fill="none" stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
        ));
      })()}
      {centers.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={r} fill={`${circleColor}18`} stroke={circleColor} strokeWidth="1.5" />
          <circle cx={c.x} cy={c.y} r={2.5} fill={circleColor} />
        </g>
      ))}
      <text x={corner1.x - 12} y={corner1.y + r + 13} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">n=10</text>
    </svg>
  );
};

const DuaPuliSabuk = ({ R = 46, r = 22, size = 280 }: { R?: number; r?: number; size?: number }) => {
  const cx1 = R + 16, cx2 = size - r - 16;
  const cy = size / 2;
  const p = cx2 - cx1;
  const rDiff = R - r;
  const sinA = rDiff / p;
  const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
  const ax = cx1 + R * sinA, ay = cy - R * cosA;
  const bx = cx2 + r * sinA, by = cy - r * cosA;
  const ax2 = cx1 + R * sinA, ay2 = cy + R * cosA;
  const bx2 = cx2 + r * sinA, by2 = cy + r * cosA;
  const startAngle1 = Math.atan2(ay - cy, ax - cx1) * 180 / Math.PI;
  const endAngle1 = Math.atan2(ay2 - cy, ax2 - cx1) * 180 / Math.PI;
  const startAngle2 = Math.atan2(by - cy, bx - cx2) * 180 / Math.PI;
  const endAngle2 = Math.atan2(by2 - cy, bx2 - cx2) * 180 / Math.PI;
  const beltColor = "#facc15";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={BG} rx="12" />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={ax2} y1={ay2} x2={bx2} y2={by2} stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d={arcPath(cx1, cy, R, startAngle1, endAngle1, false)}
        fill="none" stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d={arcPath(cx2, cy, r, startAngle2, endAngle2, true)}
        fill="none" stroke={beltColor} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx1} cy={cy} r={R} fill={`${VC}15`} stroke={VC} strokeWidth="2" />
      <circle cx={cx1} cy={cy} r={R * 0.38} fill={`${VC}25`} stroke={VC} strokeWidth="1.5" />
      <circle cx={cx2} cy={cy} r={r} fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="2" />
      <circle cx={cx2} cy={cy} r={r * 0.38} fill="rgba(251,146,60,0.25)" stroke="#fb923c" strokeWidth="1.5" />
      <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
      <circle cx={cx1} cy={cy} r={3.5} fill={VC} stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx1 - 8} y={cy + 18} fill={VC} fontSize="11" fontWeight="bold" fontFamily="serif">O₁</text>
      <circle cx={cx2} cy={cy} r={3.5} fill="#fb923c" stroke="var(--icon-stroke)" strokeWidth="1" />
      <text x={cx2 - 8} y={cy + 18} fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="serif">O₂</text>
      <text x={cx1 - 22} y={cy - R / 2} fill={VC} fontSize="10" fontWeight="bold" fontFamily="sans-serif">R</text>
      <text x={cx2 + 8} y={cy - r / 2} fill="#fb923c" fontSize="10" fontWeight="bold" fontFamily="sans-serif">r</text>
      <text x={(cx1 + cx2) / 2 - 4} y={cy + 14} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">d</text>
    </svg>
  );
};

/* ─── Questions ────────────────────────────────────────── */

const questions: Q[] = [
  Qn(1, "Dua Kaleng Berbentuk Lingkaran", {
    difficulty: "Mudah",
    diagram: <DuaKaleng r={44} size={230} />,
    content: "Gambar di atas menunjukkan penampang 2 buah tutup kaleng yang berbentuk lingkaran dengan diameter masing-masing 14 cm. Tentukan panjang tali minimal yang diperlukan untuk mengikat kedua tutup kaleng tersebut! (gunakan π = 22/7)",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm},\\quad d = 2r = 14 \\text{ cm (jarak pusat ke pusat)}" },
      { label: "b.", math: "\\text{Panjang lurus} = 2 \\times d = 2 \\times 14 = 28 \\text{ cm}" },
      { label: "c.", math: "L_{\\min} = 2d + 2\\pi r = 28 + 2 \\times \\tfrac{22}{7} \\times 7 = 28 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(2, "Empat Laher (Bearing) Berjejer", {
    difficulty: "Mudah",
    diagram: <BarisanLingkaran n={4} r={30} size={280} />,
    content: "Gambar di atas menunjukkan penampang 4 buah laher (bearing) yang berbentuk lingkaran dengan diameter masing-masing 14 cm, disusun berjejer seperti tampak pada gambar. Berapakah panjang tali minimal yang dibutuhkan untuk mengikat keempat laher tersebut? (π = 22/7)",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm},\\quad \\text{panjang lurus (atas+bawah)} = 2 \\times (n-1) \\times 2r = 2 \\times 3 \\times 14 = 84 \\text{ cm}" },
      { label: "b.", math: "\\text{Busur (dua setengah lingkaran ujung)} = 2\\pi r = 2 \\times \\tfrac{22}{7} \\times 7 = 44 \\text{ cm}" },
      { label: "c.", math: "L_{\\min} = 84 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(3, "Tiga Pipa Susunan Segitiga", {
    difficulty: "Sedang",
    diagram: <SegitigaLingkaran r={44} size={230} />,
    content: "Tiga buah pipa yang berpenampang lingkaran dengan diameter masing-masing 14 cm disusun membentuk segitiga sama sisi seperti tampak pada gambar. Tentukan panjang tali minimal yang dibutuhkan untuk mengikat ketiga pipa tersebut! (π = 22/7)",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm},\\quad \\text{jarak pusat ke pusat} = 2r = 14 \\text{ cm}" },
      { label: "b.", math: "\\text{Panjang lurus} = 3 \\times 14 = 42 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur total} = 2\\pi r = 44 \\text{ cm} \\Rightarrow L_{\\min} = 42 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(4, "Delapan Pipa Paralon Susunan Persegi Panjang", {
    difficulty: "Sedang",
    diagram: <GridLingkaran cols={4} rows={2} r={26} size={280} />,
    content: "Gambar di atas menampilkan penampang 8 buah pipa paralon yang masing-masing berdiameter 14 cm, disusun dalam 2 baris dan 4 kolom. Tentukan panjang tali minimal yang diperlukan untuk mengikat seluruh pipa paralon dengan susunan tersebut! (π = 22/7)",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm},\\quad \\text{lurus atas+bawah} = 2 \\times 3 \\times 14 = 84 \\text{ cm}" },
      { label: "b.", math: "\\text{lurus kiri+kanan} = 2 \\times 1 \\times 14 = 28 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur sudut (1 lingkaran penuh)} = 2\\pi r = 44 \\text{ cm} \\Rightarrow L_{\\min} = 84 + 28 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(5, "Sepuluh Laher Susunan Segitiga (Piramida)", {
    difficulty: "Sedang",
    diagram: <BowlingLingkaran r={26} size={260} />,
    content: "Sepuluh buah laher (bearing) yang berpenampang lingkaran dengan jari-jari masing-masing 7 cm disusun membentuk susunan segitiga seperti formasi bola bowling (1-2-3-4) seperti gambar. Hitunglah panjang tali minimal yang diperlukan untuk mengikat kesepuluh laher tersebut! (π = 22/7)",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm},\\quad \\text{tiap sisi segitiga (4 laher): } (4-1) \\times 2r = 3 \\times 14 = 42 \\text{ cm}" },
      { label: "b.", math: "\\text{Panjang lurus total} = 3 \\times 42 = 126 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur total} = 2\\pi r = 44 \\text{ cm} \\Rightarrow L_{\\min} = 126 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(6, "Membandingkan Dua Formasi Susunan", {
    difficulty: "Sedang",
    content: "Enam buah paralon yang masing-masing berdiameter 14 cm akan disusun dalam dua formasi yang berbeda:\n(A) 1 baris, 6 paralon berjejer lurus.\n(B) 2 baris, 3 paralon per baris (susunan 2 × 3).\nHitunglah panjang tali minimal untuk masing-masing formasi, kemudian tentukan formasi mana yang menggunakan tali paling sedikit!",
    parts: [
      { label: "A.", math: "L_A = 2 \\times (5 \\times 14) + 2\\pi(7) = 140 + 44 = 184 \\text{ cm}" },
      { label: "B.", math: "L_B = [2 \\times 2 \\times 14 + 2 \\times 1 \\times 14] + 44 = [56+28]+44 = 128 \\text{ cm}" },
      { label: "∴", text: "Formasi B (2 × 3) menggunakan tali lebih pendek 56 cm dibanding Formasi A." },
    ],
  }),
  Qn(7, "Dua Belas Kaleng Susu Susunan 3 × 4", {
    difficulty: "Sedang",
    diagram: <GridLingkaran cols={4} rows={3} r={22} size={280} />,
    content: "Dua belas buah kaleng susu yang berpenampang lingkaran dengan diameter masing-masing 14 cm disusun dalam 3 baris dan 4 kolom seperti gambar di atas. Hitunglah panjang tali minimal yang digunakan untuk mengikat seluruh kaleng susu tersebut! (π = 22/7)",
    parts: [
      { label: "a.", math: "\\text{Lurus atas+bawah} = 2 \\times (4-1) \\times 14 = 2 \\times 42 = 84 \\text{ cm}" },
      { label: "b.", math: "\\text{Lurus kiri+kanan} = 2 \\times (3-1) \\times 14 = 2 \\times 28 = 56 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur} = 2\\pi r = 44 \\text{ cm} \\Rightarrow L_{\\min} = 84 + 56 + 44 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(8, "Panjang Rantai Penghubung Dua Gir", {
    difficulty: "Sulit",
    diagram: <DuaPuliSabuk R={52} r={26} size={280} />,
    content: "Gir belakang dan gir depan sebuah sepeda motor dihubungkan dengan rantai yang melilit pada kedua gir. Jari-jari gir besar (O₁) adalah R = 21 cm dan jari-jari gir kecil (O₂) adalah r = 7 cm. Jarak kedua pusat gir adalah 50 cm, dan sudut ∠LO₁N = 160° (sudut busur pada gir besar yang tidak terkena rantai). Hitunglah perkiraan panjang rantai yang menghubungkan kedua gir tersebut! (π = 22/7)",
    parts: [
      { label: "a.", math: "d_{\\text{lurus}} = \\sqrt{50^2 - (21-7)^2} = \\sqrt{2500-196} = \\sqrt{2304} = 48 \\text{ cm}" },
      { label: "b.", math: "\\text{Busur gir besar} (360°{-}160°{=}200°) = \\tfrac{200}{360} \\times 2\\pi \\times 21 = \\tfrac{5}{9} \\times 44 \\times 3 = \\tfrac{660}{9} \\approx 73{,}3 \\text{ cm}" },
      { label: "c.", math: "\\text{Busur gir kecil} (160°) = \\tfrac{160}{360} \\times 2\\pi \\times 7 = \\tfrac{4}{9} \\times 44 = \\tfrac{176}{9} \\approx 19{,}6 \\text{ cm} \\Rightarrow L = 2(48) + 73{,}3 + 19{,}6 \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(9, "Panjang Sabuk Karet Kompresor", {
    difficulty: "Sulit",
    diagram: <DuaPuliSabuk R={46} r={23} size={280} />,
    content: "Roda penggerak dan kipas sebuah kompresor berbentuk lingkaran yang dihubungkan oleh sabuk karet (sun belt). Jari-jari roda besar adalah R = 28 cm dan jari-jari roda kecil adalah r = 7 cm, sedangkan jarak kedua pusatnya adalah 35 cm. Hitunglah panjang sabuk karet yang menghubungkan kedua komponen kompresor tersebut! (gunakan pendekatan L ≈ 2×GSPL + π(R + r), π = 22/7)",
    parts: [
      { label: "a.", math: "\\text{GSPL} = \\sqrt{35^2 - (28-7)^2} = \\sqrt{1225 - 441} = \\sqrt{784} = 28 \\text{ cm}" },
      { label: "b.", math: "\\pi(R+r) = \\tfrac{22}{7} \\times (28+7) = \\tfrac{22}{7} \\times 35 = 110 \\text{ cm}" },
      { label: "c.", math: "L \\approx 2 \\times 28 + 110 = 56 + 110 = \\ldots \\text{ cm}" },
    ],
  }),
];

/* ─── Page ─────────────────────────────────────────────── */

const diffColor: Record<string, string> = {
  Mudah: "bg-violet-500/20 text-violet-300 border-violet-400/40",
  Sedang: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  Sulit: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
};

const SabukLilitanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <RefreshCw className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            SABUK LILITAN MINIMAL (PENERAPAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 9 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Terapan Nyata</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Rumus Panjang Sabuk Lilitan Minimal</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-violet-300 text-[10px] font-bold mb-1">n lingkaran sama besar (berjejer):</p>
              <div className="flex justify-center">
                <BlockMath math="L = 2(n-1)(2r) + 2\pi r" />
              </div>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-violet-300 text-[10px] font-bold mb-1">Susunan grid m × n:</p>
              <div className="flex justify-center">
                <BlockMath math="L = 2(n{-}1)(2r) + 2(m{-}1)(2r) + 2\pi r" />
              </div>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-violet-300 text-[10px] font-bold mb-1">Susunan segitiga sama sisi:</p>
              <div className="flex justify-center">
                <BlockMath math="L = 3(2r) + 2\pi r" />
              </div>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-violet-300 text-[10px] font-bold mb-1">Dua lingkaran berbeda (pendekatan):</p>
              <div className="flex justify-center">
                <BlockMath math="L \approx 2\,d_{\text{GSPL}} + \pi(R+r)" />
              </div>
            </div>
          </div>
          <div className="mt-2 bg-white/5 rounded-lg px-3 py-2 text-xs text-white/60 font-body">
            <span className="text-violet-300 font-bold">Kunci: </span>
            Panjang tali = Bagian lurus + Bagian busur. Busur total untuk semua susunan simetris selalu = 2πr (satu keliling penuh).
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default SabukLilitanPage;
