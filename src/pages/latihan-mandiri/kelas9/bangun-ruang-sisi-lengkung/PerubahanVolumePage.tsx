import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type OptionKey = "A" | "B" | "C" | "D";
type Cat = "tabung" | "kerucut" | "bola" | "gabungan";
type QMC = {
  n: number; title: string; cat: Cat;
  content: string;
  diagram?: React.ReactNode;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
};

const CAT_LABELS: Record<Cat, { icon: string; label: string; color: string }> = {
  tabung:   { icon: "🧪", label: "Tabung",   color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  kerucut:  { icon: "🔺", label: "Kerucut",  color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  bola:     { icon: "🔮", label: "Bola",     color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  gabungan: { icon: "🔄", label: "Gabungan", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
};

/* ─── SVG PRIMITIVES ─── */

function drawCyl(
  cx: number, baseY: number, r: number, t: number,
  color: string, scale = 1, opacity = 1
) {
  const W  = Math.min(r * 8 * scale, 52);
  const H  = Math.min(t * 6 * scale, 95);
  const ry = Math.max(W * 0.22, 4);
  const top = baseY - H;
  return (
    <g opacity={opacity}>
      <rect x={cx - W} y={top} width={W * 2} height={H} fill={color} fillOpacity="0.09" />
      <line x1={cx - W} y1={top}   x2={cx - W} y2={baseY} stroke={color} strokeWidth="1.5" />
      <line x1={cx + W} y1={top}   x2={cx + W} y2={baseY} stroke={color} strokeWidth="1.5" />
      <ellipse cx={cx} cy={baseY} rx={W} ry={ry} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5" />
      <ellipse cx={cx} cy={top}   rx={W} ry={ry} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" />
    </g>
  );
}

function drawCylLabels(
  cx: number, baseY: number, r: number, t: number, color: string, scale = 1
) {
  const W  = Math.min(r * 8 * scale, 52);
  const H  = Math.min(t * 6 * scale, 95);
  const ry = Math.max(W * 0.22, 4);
  const top = baseY - H;
  return (
    <g>
      <line x1={cx} y1={top} x2={cx + W} y2={top} stroke={color} strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.7" />
      <circle cx={cx} cy={top} r="2.5" fill={color} />
      <text x={cx + W / 2} y={top - 6} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
      <line x1={cx + W + 6} y1={top + ry} x2={cx + W + 6} y2={baseY - ry} stroke={color} strokeWidth="1" strokeOpacity="0.7" />
      <line x1={cx + W + 2} y1={top + ry}   x2={cx + W + 10} y2={top + ry}   stroke={color} strokeWidth="1" />
      <line x1={cx + W + 2} y1={baseY - ry} x2={cx + W + 10} y2={baseY - ry} stroke={color} strokeWidth="1" />
      <text x={cx + W + 18} y={(top + ry + baseY - ry) / 2} fill={color} fontSize="10" textAnchor="middle"
        fontFamily="monospace" dominantBaseline="middle">t={t}</text>
    </g>
  );
}

function drawCone(
  cx: number, baseY: number, r: number, t: number,
  color: string, scale = 1, opacity = 1
) {
  const W  = Math.min(r * 8 * scale, 52);
  const H  = Math.min(t * 6 * scale, 95);
  const ry = Math.max(W * 0.22, 4);
  const tip = baseY - H;
  return (
    <g opacity={opacity}>
      <polygon points={`${cx - W},${baseY} ${cx + W},${baseY} ${cx},${tip}`}
        fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.5" />
      <ellipse cx={cx} cy={baseY} rx={W} ry={ry} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5" />
    </g>
  );
}

function drawConeLabels(
  cx: number, baseY: number, r: number, t: number, color: string, scale = 1
) {
  const W  = Math.min(r * 8 * scale, 52);
  const H  = Math.min(t * 6 * scale, 95);
  const ry = Math.max(W * 0.22, 4);
  const tip = baseY - H;
  return (
    <g>
      <line x1={cx} y1={baseY} x2={cx + W} y2={baseY} stroke={color} strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.7" />
      <text x={cx + W / 2} y={baseY + 13} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
      <line x1={cx + W + 6} y1={tip} x2={cx + W + 6} y2={baseY - ry} stroke={color} strokeWidth="1" strokeOpacity="0.7" />
      <line x1={cx + W + 2} y1={tip}       x2={cx + W + 10} y2={tip}       stroke={color} strokeWidth="1" />
      <line x1={cx + W + 2} y1={baseY - ry} x2={cx + W + 10} y2={baseY - ry} stroke={color} strokeWidth="1" />
      <text x={cx + W + 18} y={(tip + baseY - ry) / 2} fill={color} fontSize="10" textAnchor="middle"
        fontFamily="monospace" dominantBaseline="middle">t={t}</text>
    </g>
  );
}

function drawSphere(
  cx: number, cy: number, r: number, color: string, gradId: string, opacity = 1
) {
  const R = Math.min(r * 7, 55);
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={gradId} cx="38%" cy="35%" r="55%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.5" />
          <stop offset="60%"  stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill={`url(#${gradId})`} stroke={color} strokeWidth="1.8" />
      <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.22} fill="none" stroke={color} strokeWidth="1" strokeDasharray="5,3" />
    </g>
  );
}

/* ─── COMPARISON DIAGRAMS ─── */

function CompareCylSVG({ r1, t1, r2, t2, label1 = "Awal", label2 = "Baru", color = "#a855f7" }: {
  r1: number; t1: number; r2: number; t2: number;
  label1?: string; label2?: string; color?: string;
}) {
  const BASE = 145;
  return (
    <svg viewBox="0 0 320 175" width="320" height="175" className="mx-auto">
      <text x="75"  y="14" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label1}</text>
      <text x="245" y="14" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label2}</text>
      {drawCyl(75, BASE, r1, t1, color)}
      {drawCylLabels(75, BASE, r1, t1, color)}
      <text x="160" y="82" fill={color} fontSize="22" textAnchor="middle" fontFamily="monospace">→</text>
      {drawCyl(245, BASE, r2, t2, color, 1, 1)}
      {drawCylLabels(245, BASE, r2, t2, color)}
      <text x="75"  y="165" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">
        V={r1}²×{t1}π
      </text>
      <text x="245" y="165" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">
        V={r2}²×{t2}π
      </text>
    </svg>
  );
}

function CompareConeSVG({ r1, t1, r2, t2, color = "#fb923c" }: {
  r1: number; t1: number; r2: number; t2: number; color?: string;
}) {
  const BASE = 148;
  return (
    <svg viewBox="0 0 320 175" width="320" height="175" className="mx-auto">
      <text x="75"  y="14" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Awal</text>
      <text x="245" y="14" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Baru</text>
      {drawCone(75, BASE, r1, t1, color)}
      {drawConeLabels(75, BASE, r1, t1, color)}
      <text x="160" y="82" fill={color} fontSize="22" textAnchor="middle" fontFamily="monospace">→</text>
      {drawCone(245, BASE, r2, t2, color)}
      {drawConeLabels(245, BASE, r2, t2, color)}
    </svg>
  );
}

function CompareSphereSVG({ r1, r2, color = "#818cf8" }: {
  r1: number; r2: number; color?: string;
}) {
  const R1 = Math.min(r1 * 7, 50);
  const R2 = Math.min(r2 * 7, 60);
  const cy1 = 100;
  const cy2 = 100 + (R2 - R1) / 2;
  return (
    <svg viewBox="0 0 300 175" width="300" height="175" className="mx-auto">
      <defs>
        <radialGradient id="csp1" cx="38%" cy="35%" r="55%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="csp2" cx="38%" cy="35%" r="55%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <text x="75"  y="16" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Awal</text>
      <text x="225" y="16" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Baru</text>
      <circle cx={75} cy={cy1} r={R1} fill="url(#csp1)" stroke={color} strokeWidth="1.8" />
      <ellipse cx={75} cy={cy1} rx={R1} ry={R1 * 0.22} fill="none" stroke={color} strokeWidth="1" strokeDasharray="4,3" />
      <line x1={75} y1={cy1} x2={75 + R1} y2={cy1} stroke={color} strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.7" />
      <text x={75 + R1 / 2} y={cy1 - 6} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">r={r1}</text>
      <text x="150" y="100" fill={color} fontSize="22" textAnchor="middle" fontFamily="monospace">→</text>
      <circle cx={225} cy={cy2} r={R2} fill="url(#csp2)" stroke={color} strokeWidth="1.8" />
      <ellipse cx={225} cy={cy2} rx={R2} ry={R2 * 0.22} fill="none" stroke={color} strokeWidth="1" strokeDasharray="4,3" />
      <line x1={225} y1={cy2} x2={225 + R2} y2={cy2} stroke={color} strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.7" />
      <text x={225 + R2 / 2} y={cy2 - 8} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">r={r2}</text>
    </svg>
  );
}

function RumusBubbleSVG({ lines, color = "#a855f7" }: { lines: string[]; color?: string }) {
  const h = 30 + lines.length * 26;
  return (
    <svg viewBox={`0 0 300 ${h}`} width="300" height={h} className="mx-auto">
      <rect x="10" y="8" width="280" height={h - 16} rx="12"
        fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      {lines.map((line, i) => (
        <text key={i} x="150" y={28 + i * 26} fill={color} fontSize="12"
          textAnchor="middle" fontFamily="monospace">{line}</text>
      ))}
    </svg>
  );
}

function TransformSVG({
  left, right, eq = "=", color = "#a855f7"
}: {
  left: React.ReactNode; right: React.ReactNode;
  eq?: string; color?: string;
}) {
  return (
    <svg viewBox="0 0 300 160" width="300" height="160" className="mx-auto">
      <foreignObject x="10" y="20" width="110" height="120">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          {left}
        </div>
      </foreignObject>
      <text x="150" y="90" fill={color} fontSize="20" textAnchor="middle" fontFamily="monospace">{eq}</text>
      <foreignObject x="180" y="20" width="110" height="120">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          {right}
        </div>
      </foreignObject>
    </svg>
  );
}

function ThreeCylSVG({ items, color = "#a855f7" }: {
  items: { r: number; t: number; label: string }[]; color?: string;
}) {
  const BASE = 138;
  const positions = [50, 155, 260];
  return (
    <svg viewBox="0 0 310 165" width="310" height="165" className="mx-auto">
      {items.map((item, i) => (
        <g key={i}>
          {drawCyl(positions[i], BASE, item.r, item.t, color)}
          <text x={positions[i]} y={BASE + 15} fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace">{item.label}</text>
        </g>
      ))}
    </svg>
  );
}

function EqualVolumeSVG({ shape1, shape2, color1 = "#a855f7", color2 = "#fb923c" }: {
  shape1: React.ReactNode; shape2: React.ReactNode;
  color1?: string; color2?: string;
}) {
  return (
    <svg viewBox="0 0 300 160" width="300" height="160" className="mx-auto">
      <foreignObject x="5" y="10" width="125" height="140">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
          {shape1}
        </div>
      </foreignObject>
      <text x="150" y="88" fill="#ffffff" fontSize="20" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">=</text>
      <foreignObject x="170" y="10" width="125" height="140">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
          {shape2}
        </div>
      </foreignObject>
    </svg>
  );
}

/* ─── Inline mini SVGs for diagrams ─── */
const miniCylSVG = (r: number, t: number, color: string) => {
  const BASE = 100; const W = Math.min(r * 8, 40); const H = Math.min(t * 6, 75); const ry = Math.max(W * 0.22, 4);
  return (
    <svg viewBox={`0 0 ${W * 2 + 40} 120`} width={W * 2 + 40} height={120}>
      {drawCyl(W + 20, BASE, r, t, color)}
      {drawCylLabels(W + 20, BASE, r, t, color)}
    </svg>
  );
};
const miniConeSVG = (r: number, t: number, color: string) => {
  const BASE = 110; const W = Math.min(r * 8, 40); const H = Math.min(t * 6, 80);
  return (
    <svg viewBox={`0 0 ${W * 2 + 40} 130`} width={W * 2 + 40} height={130}>
      {drawCone(W + 20, BASE, r, t, color)}
      {drawConeLabels(W + 20, BASE, r, t, color)}
    </svg>
  );
};
const miniSphereSVG = (r: number, color: string) => {
  const R = Math.min(r * 7, 46);
  return (
    <svg viewBox={`0 0 ${R * 2 + 50} ${R * 2 + 30}`} width={R * 2 + 50} height={R * 2 + 30}>
      {drawSphere(R + 25, R + 15, r, color, `ms-${r}`)}
      <line x1={R + 25} y1={R + 15} x2={R + 25 + R} y2={R + 15} stroke={color} strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.7" />
      <text x={R + 25 + R / 2} y={R + 8} fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">r={r}</text>
    </svg>
  );
};

const mcQuestions: QMC[] = [
  /* ── TABUNG ── */
  {
    n: 1, title: "Tabung – Jari-Jari Diperbesar 2 Kali", cat: "tabung",
    content: "Sebuah tabung memiliki r = 5 cm dan t = 10 cm. Jika jari-jarinya diperbesar 2 kali (tinggi tetap), volume tabung menjadi ... kali semula.",
    diagram: <CompareCylSVG r1={5} t1={10} r2={10} t2={10} />,
    options: [
      { key: "A", text: "2 kali" },
      { key: "B", text: "3 kali" },
      { key: "C", text: "4 kali" },
      { key: "D", text: "8 kali" },
    ],
    answer: "C",
  },
  {
    n: 2, title: "Tabung – r Diperkecil Setengah", cat: "tabung",
    content: "Sebuah tabung dengan r = 6 cm dan t = 10 cm. Jika jari-jari diperkecil menjadi setengahnya (tinggi tetap), volume tabung yang baru adalah ...",
    diagram: <CompareCylSVG r1={6} t1={10} r2={3} t2={10} label1="r = 6" label2="r = 3" />,
    options: [
      { key: "A", text: "45π cm³" },
      { key: "B", text: "90π cm³" },
      { key: "C", text: "180π cm³" },
      { key: "D", text: "360π cm³" },
    ],
    answer: "B",
  },
  {
    n: 3, title: "Tabung – r dan t Keduanya Diperbesar 2 Kali", cat: "tabung",
    content: "Sebuah tabung diperbesar sehingga r dan t masing-masing menjadi 2 kali semula. Volume tabung baru dibanding semula adalah ...",
    diagram: <RumusBubbleSVG lines={["r × 2,  t × 2", "V₂ = π(2r)²(2t) = 8πr²t", "V₂ / V₁ = 8 kali"]} />,
    options: [
      { key: "A", text: "4 kali" },
      { key: "B", text: "6 kali" },
      { key: "C", text: "8 kali" },
      { key: "D", text: "16 kali" },
    ],
    answer: "C",
  },
  {
    n: 4, title: "Tabung – Volume Berkurang ¼", cat: "tabung",
    content: "Volume sebuah tabung berkurang menjadi ¼ semula. Jika jari-jari tidak berubah, tinggi tabung baru menjadi ...",
    diagram: <RumusBubbleSVG lines={["V₂/V₁ = t₂/t₁ = 1/4", "→ tinggi menjadi 1/4 kali"]} />,
    options: [
      { key: "A", text: "1/2 kali semula" },
      { key: "B", text: "1/3 kali semula" },
      { key: "C", text: "1/4 kali semula" },
      { key: "D", text: "1/8 kali semula" },
    ],
    answer: "C",
  },
  {
    n: 5, title: "Tabung – r dan t Bersamaan Berubah", cat: "tabung",
    content: "Sebuah tabung diperbesar: r menjadi 3 kali dan t menjadi 2 kali semula. Volume tabung baru menjadi ... kali semula.",
    diagram: <RumusBubbleSVG lines={["V₂/V₁ = (3r)²(2t) / (r²t)", "= 9 × 2 = 18 kali"]} />,
    options: [
      { key: "A", text: "6 kali" },
      { key: "B", text: "9 kali" },
      { key: "C", text: "12 kali" },
      { key: "D", text: "18 kali" },
    ],
    answer: "D",
  },
  /* ── KERUCUT ── */
  {
    n: 6, title: "Kerucut – Jari-Jari Diperbesar 2 Kali", cat: "kerucut",
    content: "Sebuah kerucut r = 5 cm, t = 12 cm. Jika r diperbesar 2 kali dan t tetap, volume kerucut baru menjadi ... kali semula.",
    diagram: <CompareConeSVG r1={5} t1={12} r2={10} t2={12} />,
    options: [
      { key: "A", text: "2 kali" },
      { key: "B", text: "3 kali" },
      { key: "C", text: "4 kali" },
      { key: "D", text: "8 kali" },
    ],
    answer: "C",
  },
  {
    n: 7, title: "Kerucut – Tinggi Diperbesar 3 Kali", cat: "kerucut",
    content: "Sebuah kerucut r = 7 cm, t = 6 cm. Jika tinggi diperbesar 3 kali dan r tetap, volume kerucut baru menjadi ... kali semula.",
    diagram: <CompareConeSVG r1={7} t1={6} r2={7} t2={18} />,
    options: [
      { key: "A", text: "2 kali" },
      { key: "B", text: "3 kali" },
      { key: "C", text: "6 kali" },
      { key: "D", text: "9 kali" },
    ],
    answer: "B",
  },
  {
    n: 8, title: "Kerucut – r dan t Masing-Masing Dikali 2", cat: "kerucut",
    content: "Sebuah kerucut dengan r = 3 cm dan t = 4 cm. Jika r dan t masing-masing diperbesar 2 kali, volume kerucut baru menjadi ... kali semula.",
    diagram: <CompareConeSVG r1={3} t1={4} r2={6} t2={8} />,
    options: [
      { key: "A", text: "4 kali" },
      { key: "B", text: "6 kali" },
      { key: "C", text: "8 kali" },
      { key: "D", text: "16 kali" },
    ],
    answer: "C",
  },
  {
    n: 9, title: "Kerucut – Perubahan Volume karena Tinggi", cat: "kerucut",
    content: "Kerucut A: r = 6, t = 5. Kerucut B: r = 6, t = 20. Perbandingan volume V_B : V_A adalah ...",
    diagram: <CompareConeSVG r1={6} t1={5} r2={6} t2={20} color="#fb923c" />,
    options: [
      { key: "A", text: "2 : 1" },
      { key: "B", text: "3 : 1" },
      { key: "C", text: "4 : 1" },
      { key: "D", text: "5 : 1" },
    ],
    answer: "C",
  },
  /* ── BOLA ── */
  {
    n: 10, title: "Bola – Luas Permukaan saat r Diperbesar 3 Kali", cat: "bola",
    content: "Sebuah bola berjari-jari r. Jika jari-jari diperbesar 3 kali, perbandingan luas permukaan bola baru terhadap semula adalah ...",
    diagram: <RumusBubbleSVG lines={["L = 4πr²", "L₂ = 4π(3r)² = 9 × 4πr²", "L₂ : L₁ = 9 : 1"]} color="#818cf8" />,
    options: [
      { key: "A", text: "3 : 1" },
      { key: "B", text: "6 : 1" },
      { key: "C", text: "9 : 1" },
      { key: "D", text: "27 : 1" },
    ],
    answer: "C",
  },
  {
    n: 11, title: "Bola – Jari-Jari Diperbesar 2 Kali", cat: "bola",
    content: "Sebuah bola berjari-jari r. Jika jari-jari diperbesar 2 kali, volume bola menjadi ... kali semula.",
    diagram: <CompareSphereSVG r1={5} r2={8} />,
    options: [
      { key: "A", text: "2 kali" },
      { key: "B", text: "4 kali" },
      { key: "C", text: "6 kali" },
      { key: "D", text: "8 kali" },
    ],
    answer: "D",
  },
  {
    n: 12, title: "Bola – Jari-Jari Diperkecil Sepertiga", cat: "bola",
    content: "Jika jari-jari bola diperkecil menjadi sepertiga semula, volume bola baru menjadi ...",
    diagram: <CompareSphereSVG r1={7} r2={3} />,
    options: [
      { key: "A", text: "1/3 kali semula" },
      { key: "B", text: "1/9 kali semula" },
      { key: "C", text: "1/27 kali semula" },
      { key: "D", text: "1/81 kali semula" },
    ],
    answer: "C",
  },
  {
    n: 13, title: "Bola – Volume Baru dari Perbandingan r", cat: "bola",
    content: "Volume sebuah bola adalah 36π cm³. Jika jari-jari diperbesar menjadi 3/2 kali semula, volume bola baru adalah ...",
    diagram: <RumusBubbleSVG lines={["V₂/V₁ = (3/2)³ = 27/8", "V₂ = 27/8 × 36π = 121,5π cm³"]} color="#818cf8" />,
    options: [
      { key: "A", text: "54π cm³" },
      { key: "B", text: "81π cm³" },
      { key: "C", text: "121,5π cm³" },
      { key: "D", text: "243π cm³" },
    ],
    answer: "C",
  },
  {
    n: 14, title: "Bola – Volume Berkurang saat r Diperkecil", cat: "bola",
    content: "Volume awal bola adalah 2.304π cm³. Jika jari-jari berkurang menjadi setengahnya, volume bola yang baru adalah ...",
    diagram: <CompareSphereSVG r1={7} r2={4} />,
    options: [
      { key: "A", text: "144π cm³" },
      { key: "B", text: "216π cm³" },
      { key: "C", text: "288π cm³" },
      { key: "D", text: "432π cm³" },
    ],
    answer: "C",
  },
  /* ── GABUNGAN ── */
  {
    n: 15, title: "Volume Tabung Berkurang karena r Mengecil", cat: "gabungan",
    content: "Sebuah tabung mengalami pengurangan jari-jari dari 10 cm menjadi 8 cm, tinggi tetap 15 cm. Persentase volume yang berkurang adalah … (π = 3,14)",
    diagram: <CompareCylSVG r1={10} t1={15} r2={8} t2={15} label1="r=10" label2="r=8" color="#f87171" />,
    options: [
      { key: "A", text: "25%" },
      { key: "B", text: "30%" },
      { key: "C", text: "36%" },
      { key: "D", text: "40%" },
    ],
    answer: "C",
  },
];

function CatDivider({ cat }: { cat: Cat }) {
  const { icon, label, color } = CAT_LABELS[cat];
  return (
    <div className="flex items-center gap-2 mt-2 mb-1">
      <div className="h-px flex-1 bg-white/8" />
      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${color}`}>
        {icon} {label}
      </span>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  );
}

const optionStyle = (key: OptionKey, selected: OptionKey | undefined, answer: OptionKey, revealed: boolean) => {
  if (!revealed) {
    return selected === key
      ? "bg-purple-500/30 border-purple-400 text-white"
      : "bg-white/5 border-white/10 text-white/80 hover:border-purple-400/50 hover:bg-purple-500/10";
  }
  if (key === answer) return "bg-emerald-500/25 border-emerald-400 text-emerald-200";
  if (selected === key && key !== answer) return "bg-rose-500/25 border-rose-400 text-rose-200 line-through";
  return "bg-white/3 border-white/8 text-white/40";
};

const PerubahanVolumePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<number, OptionKey>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (n: number, key: OptionKey) => {
    if (revealed[n]) return;
    playPopSound();
    setSelected(prev => ({ ...prev, [n]: key }));
  };

  const handleReveal = (n: number) => {
    playPopSound();
    setRevealed(prev => ({ ...prev, [n]: true }));
  };

  const mcScore = mcQuestions.filter(q => revealed[q.n] && selected[q.n] === q.answer).length;
  const mcDone  = mcQuestions.filter(q => revealed[q.n]).length;

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
            PERUBAHAN LUAS PERMUKAAN DAN VOLUME BANGUN RUANG SISI LENGKUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2">
              <span className="text-purple-400 text-xs font-bold">📋 15 Soal</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
            </div>
            {mcDone > 0 && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                <span className="text-emerald-400 text-xs font-bold">✅ {mcScore}/{mcDone} jawaban benar</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-5 bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
          <p className="text-purple-300 text-xs font-bold mb-2">📌 Kunci Perubahan Volume</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Tabung (r × n, t tetap)", formula: "V_2 = n^2 V_1" },
              { label: "Tabung (t × m, r tetap)", formula: "V_2 = m \\cdot V_1" },
              { label: "Kerucut (r × n, t tetap)", formula: "V_2 = n^2 V_1" },
              { label: "Bola (r × n)",             formula: "V_2 = n^3 V_1" },
              { label: "Luas Permukaan (r × n)",   formula: "L_2 = n^2 L_1" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-purple-400 font-bold shrink-0 w-40 text-[11px]">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-purple-500/20" />
          <span className="text-purple-400 text-[10px] font-bold uppercase tracking-widest px-2">Soal Pilihan Ganda</span>
          <div className="h-px flex-1 bg-purple-500/20" />
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {mcQuestions.map((q, i) => {
            const isRevealed = !!revealed[q.n];
            const sel       = selected[q.n];
            const isCorrect = isRevealed && sel === q.answer;
            const isWrong   = isRevealed && !!sel && sel !== q.answer;
            const prevCat   = i > 0 ? mcQuestions[i - 1].cat : null;
            const showDivider = q.cat !== prevCat;
            return (
              <div key={q.n}>
                {showDivider && <CatDivider cat={q.cat} />}
                <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${i * 0.015}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
                  <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isCorrect ? "border border-emerald-500/40" : isWrong ? "border border-rose-500/40" : "border border-purple-500/20"}`} />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-violet-500 rounded-l-2xl" />
                  <div className="relative px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCorrect ? "bg-emerald-500/20 border-emerald-400/50" : isWrong ? "bg-rose-500/20 border-rose-400/50" : "bg-purple-500/20 border-purple-400/50"}`}>
                        <span className={`text-xs font-bold ${isCorrect ? "text-emerald-300" : isWrong ? "text-rose-300" : "text-purple-300"}`}>{q.n}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded inline-block mb-2">
                          {q.title}
                        </span>
                        <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>
                        {q.diagram && <div className="mb-3 flex justify-center overflow-x-auto">{q.diagram}</div>}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          {q.options.map(opt => (
                            <button key={opt.key}
                              onClick={() => handleSelect(q.n, opt.key)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm font-body transition-all cursor-pointer ${optionStyle(opt.key, sel, q.answer, isRevealed)}`}>
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                                isRevealed && opt.key === q.answer                          ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
                                : isRevealed && sel === opt.key && opt.key !== q.answer     ? "border-rose-400 text-rose-300 bg-rose-500/20"
                                : sel === opt.key                                           ? "border-purple-400 text-purple-300 bg-purple-500/20"
                                : "border-white/20 text-white/50"
                              }`}>{opt.key}</span>
                              <span>{opt.text}</span>
                              {isRevealed && opt.key === q.answer && <span className="ml-auto text-emerald-400 text-xs font-bold">✓</span>}
                              {isRevealed && sel === opt.key && opt.key !== q.answer && <span className="ml-auto text-rose-400 text-xs font-bold">✗</span>}
                            </button>
                          ))}
                        </div>
                        {isRevealed && (
                          <div className={`text-xs px-3 py-1.5 rounded-lg font-body inline-block ${isCorrect ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" : "bg-rose-500/15 border border-rose-500/30 text-rose-300"}`}>
                            {isCorrect ? "✅ Jawaban kamu benar!" : `❌ Jawaban benar: ${q.answer}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
