import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type OptionKey = "A" | "B" | "C" | "D";
type Cat = "tab-ker" | "tab-hemi" | "ker-hemi" | "campuran";

const CAT_LABELS: Record<Cat, { icon: string; label: string; color: string }> = {
  "tab-ker":  { icon: "🔺", label: "Tabung + Kerucut",   color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  "tab-hemi": { icon: "🧪", label: "Tabung + ½ Bola",    color: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
  "ker-hemi": { icon: "🍦", label: "Kerucut + ½ Bola",   color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  "campuran": { icon: "🧩", label: "Gabungan Campuran",   color: "text-green-400 border-green-500/30 bg-green-500/10" },
};

type QMC = {
  n: number; title: string; cat: Cat;
  content: string;
  diagram?: React.ReactNode;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
};

/* ═══════════════════════════════════════════════════
   SVG DIAGRAM COMPONENTS  (fully responsive, normalised)
   viewBox = 0 0 360 280  –  shapes always fill the frame
═══════════════════════════════════════════════════ */

const VB_W = 360, VB_H = 280;
const CX = 160;  // centre-x (leaves ~200px right for labels)
const SW = 2;    // stroke-width for shapes
const LSW = 1.2; // stroke-width for dimension lines

function dimLabel(color: string, x: number, y: number, txt: string) {
  return <text x={x} y={y} fill={color} fontSize="14" fontFamily="monospace" fontWeight="bold">{txt}</text>;
}
function dimLine(color: string, x1: number, y1: number, x2: number, y2: number) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={LSW} strokeOpacity="0.7" />;
}
function tick(color: string, x: number, y: number, horiz = true) {
  return horiz
    ? <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke={color} strokeWidth={LSW} />
    : <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={color} strokeWidth={LSW} />;
}

function TabungKerucutSVG({ r, tTab, tKer, color = "#f59e0b" }: {
  r: number; tTab: number; tKer: number; color?: string;
}) {
  const W  = 68;
  const tot = 170;
  const ratio = Math.min(Math.max(tTab / (tTab + tKer), 0.3), 0.75);
  const HC = Math.round(tot * ratio);
  const HK = tot - HC;
  const ell = Math.round(W * 0.22);
  const baseY   = 250;
  const topCylY = baseY - HC;
  const apexY   = topCylY - HK;
  const lx = CX + W + 12;
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" style={{ maxWidth: "100%", display: "block" }}>
      {/* cylinder body */}
      <ellipse cx={CX} cy={baseY}   rx={W} ry={ell} fill={color} fillOpacity="0.20" stroke={color} strokeWidth={SW} />
      <ellipse cx={CX} cy={topCylY} rx={W} ry={ell} fill={color} fillOpacity="0.14" stroke={color} strokeWidth={SW * 0.7} strokeDasharray="6,4" />
      <rect x={CX - W} y={topCylY} width={W * 2} height={HC} fill={color} fillOpacity="0.09" />
      <line x1={CX - W} y1={topCylY} x2={CX - W} y2={baseY} stroke={color} strokeWidth={SW} />
      <line x1={CX + W} y1={topCylY} x2={CX + W} y2={baseY} stroke={color} strokeWidth={SW} />
      {/* cone */}
      <polygon points={`${CX - W},${topCylY} ${CX + W},${topCylY} ${CX},${apexY}`} fill={color} fillOpacity="0.16" stroke={color} strokeWidth={SW} />
      {/* dim lines right */}
      {dimLine(color, lx, topCylY, lx, baseY)}
      {tick(color, lx, topCylY)} {tick(color, lx, baseY)}
      {dimLabel(color, lx + 10, (topCylY + baseY) / 2 + 5, `t=${tTab}`)}
      {dimLine(color, lx, apexY, lx, topCylY)}
      {tick(color, lx, apexY)} {tick(color, lx, topCylY)}
      {dimLabel(color, lx + 10, (apexY + topCylY) / 2 + 5, `t=${tKer}`)}
      {/* radius */}
      <line x1={CX} y1={baseY} x2={CX + W} y2={baseY} stroke={color} strokeWidth={LSW} strokeDasharray="4,3" strokeOpacity="0.8" />
      {dimLabel(color, CX + W / 2 - 14, baseY + 20, `r=${r}`)}
    </svg>
  );
}

function TabungHemiSVG({ r, tTab, color = "#38bdf8" }: {
  r: number; tTab: number; color?: string;
}) {
  const W  = 68;
  const HC = 130;
  const ell = Math.round(W * 0.22);
  const baseY   = 240;
  const topCylY = baseY - HC;
  const lx = CX + W + 12;
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" style={{ maxWidth: "100%", display: "block" }}>
      {/* cylinder */}
      <ellipse cx={CX} cy={baseY}   rx={W} ry={ell} fill={color} fillOpacity="0.20" stroke={color} strokeWidth={SW} />
      <ellipse cx={CX} cy={topCylY} rx={W} ry={ell} fill={color} fillOpacity="0.12" stroke={color} strokeWidth={SW * 0.7} strokeDasharray="6,4" />
      <rect x={CX - W} y={topCylY} width={W * 2} height={HC} fill={color} fillOpacity="0.09" />
      <line x1={CX - W} y1={topCylY} x2={CX - W} y2={baseY} stroke={color} strokeWidth={SW} />
      <line x1={CX + W} y1={topCylY} x2={CX + W} y2={baseY} stroke={color} strokeWidth={SW} />
      {/* hemisphere dome */}
      <path d={`M ${CX - W} ${topCylY} A ${W} ${W} 0 0 1 ${CX + W} ${topCylY}`} fill={color} fillOpacity="0.22" stroke={color} strokeWidth={SW} />
      {/* dim lines */}
      {dimLine(color, lx, topCylY, lx, baseY)}
      {tick(color, lx, topCylY)} {tick(color, lx, baseY)}
      {dimLabel(color, lx + 10, (topCylY + baseY) / 2 + 5, `t=${tTab}`)}
      <line x1={CX} y1={baseY} x2={CX + W} y2={baseY} stroke={color} strokeWidth={LSW} strokeDasharray="4,3" strokeOpacity="0.8" />
      {dimLabel(color, CX + W / 2 - 14, baseY + 20, `r=${r}`)}
      {dimLabel(color, CX - 28, topCylY - W - 10, `½ Bola`)}
    </svg>
  );
}

function KerucutHemiSVG({ r, tKer, color = "#a78bfa" }: {
  r: number; tKer: number; color?: string;
}) {
  const W  = 68;
  const HK = 120;
  const ell = Math.round(W * 0.22);
  const baseY = 185;
  const apexY = baseY - HK;
  const lx = CX + W + 12;
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" style={{ maxWidth: "100%", display: "block" }}>
      {/* cone */}
      <polygon points={`${CX - W},${baseY} ${CX + W},${baseY} ${CX},${apexY}`} fill={color} fillOpacity="0.14" stroke={color} strokeWidth={SW} />
      <ellipse cx={CX} cy={baseY} rx={W} ry={ell} fill={color} fillOpacity="0.14" stroke={color} strokeWidth={SW * 0.7} strokeDasharray="6,4" />
      {/* hemisphere below */}
      <path d={`M ${CX - W} ${baseY} A ${W} ${W} 0 0 0 ${CX + W} ${baseY}`} fill={color} fillOpacity="0.24" stroke={color} strokeWidth={SW} />
      {/* dim lines */}
      {dimLine(color, lx, apexY, lx, baseY)}
      {tick(color, lx, apexY)} {tick(color, lx, baseY)}
      {dimLabel(color, lx + 10, (apexY + baseY) / 2 + 5, `t=${tKer}`)}
      <line x1={CX} y1={baseY} x2={CX + W} y2={baseY} stroke={color} strokeWidth={LSW} strokeDasharray="4,3" strokeOpacity="0.8" />
      {dimLabel(color, CX + W / 2 - 14, baseY - 8, `r=${r}`)}
      {dimLabel(color, CX - 28, baseY + W + 20, `½ Bola`)}
    </svg>
  );
}

function HemiTabKerSVG({ r, tTab, tKer, color = "#fb7185" }: {
  r: number; tTab: number; tKer: number; color?: string;
}) {
  const W  = 62;
  const HC = 90;
  const HK = 55;
  const HR = 42;  // hemisphere drawn radius
  const ell = Math.round(W * 0.22);
  const baseY   = 250;
  const topCylY = baseY - HC;
  const apexY   = topCylY - HK;
  const lx = CX + W + 12;
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" style={{ maxWidth: "100%", display: "block" }}>
      {/* hemisphere at bottom */}
      <path d={`M ${CX - W} ${baseY} A ${W} ${W} 0 0 0 ${CX + W} ${baseY}`} fill={color} fillOpacity="0.24" stroke={color} strokeWidth={SW} />
      {/* cylinder */}
      <rect x={CX - W} y={topCylY} width={W * 2} height={HC} fill={color} fillOpacity="0.09" />
      <line x1={CX - W} y1={topCylY} x2={CX - W} y2={baseY} stroke={color} strokeWidth={SW} />
      <line x1={CX + W} y1={topCylY} x2={CX + W} y2={baseY} stroke={color} strokeWidth={SW} />
      <ellipse cx={CX} cy={baseY}   rx={W} ry={ell} fill={color} fillOpacity="0.12" stroke={color} strokeWidth={SW * 0.7} strokeDasharray="6,4" />
      <ellipse cx={CX} cy={topCylY} rx={W} ry={ell} fill={color} fillOpacity="0.12" stroke={color} strokeWidth={SW * 0.7} strokeDasharray="6,4" />
      {/* cone at top */}
      <polygon points={`${CX - W},${topCylY} ${CX + W},${topCylY} ${CX},${apexY}`} fill={color} fillOpacity="0.16" stroke={color} strokeWidth={SW} />
      {/* dim lines */}
      {dimLine(color, lx, topCylY, lx, baseY)}
      {tick(color, lx, topCylY)} {tick(color, lx, baseY)}
      {dimLabel(color, lx + 10, (topCylY + baseY) / 2 + 5, `t=${tTab}`)}
      {dimLine(color, lx, apexY, lx, topCylY)}
      {tick(color, lx, apexY)} {tick(color, lx, topCylY)}
      {dimLabel(color, lx + 10, (apexY + topCylY) / 2 + 5, `t=${tKer}`)}
      <line x1={CX} y1={baseY} x2={CX + W} y2={baseY} stroke={color} strokeWidth={LSW} strokeDasharray="4,3" strokeOpacity="0.8" />
      {dimLabel(color, CX + W / 2 - 14, baseY + 20, `r=${r}`)}
      {dimLabel(color, CX - 20, baseY + W + 18, `½ Bola`)}
    </svg>
  );
}

function InfoBubbleSVG({ lines, color = "#22d3ee" }: { lines: string[]; color?: string }) {
  const lineH = 32;
  const pad   = 20;
  const h = pad * 2 + lines.length * lineH;
  return (
    <svg viewBox={`0 0 360 ${h}`} width="100%" style={{ maxWidth: "100%", display: "block" }}>
      <rect x="10" y="8" width="340" height={h - 16} rx="14"
        fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" strokeOpacity="0.55" />
      {lines.map((line, i) => (
        <text key={i} x="180" y={pad + 4 + i * lineH + lineH * 0.6} fill={color} fontSize="14"
          textAnchor="middle" fontFamily="monospace" fontWeight="600">{line}</text>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   SOAL PILIHAN GANDA
═══════════════════════════════════════════════════ */

const mcQuestions: QMC[] = [
  /* ── TABUNG + KERUCUT ── */
  {
    n: 1, title: "Volume Tenda (Tabung + Kerucut)", cat: "tab-ker",
    content: "Sebuah tenda berbentuk tabung r = 7 m, t = 3 m, dilengkapi atap kerucut r = 7 m, t = 3 m. Total volume tenda adalah … (π = 22/7)",
    diagram: <TabungKerucutSVG r={7} tTab={3} tKer={3} />,
    options: [
      { key: "A", text: "462 m³" },
      { key: "B", text: "539 m³" },
      { key: "C", text: "616 m³" },
      { key: "D", text: "770 m³" },
    ],
    answer: "C",
  },
  {
    n: 2, title: "Luas Permukaan Peluru (Tabung + Kerucut)", cat: "tab-ker",
    content: "Model peluru: tabung r = 5 cm, t = 12 cm, ujung kerucut r = 5 cm, s = 13 cm. Luas permukaan luar adalah … (π = 3,14)",
    diagram: <TabungKerucutSVG r={5} tTab={12} tKer={5} />,
    options: [
      { key: "A", text: "580,9 cm²" },
      { key: "B", text: "659,4 cm²" },
      { key: "C", text: "737,9 cm²" },
      { key: "D", text: "816,4 cm²" },
    ],
    answer: "B",
  },
  {
    n: 3, title: "Volume Silo (Tabung + Kerucut)", cat: "tab-ker",
    content: "Silo berbentuk tabung r = 7 m, t = 10 m, dan tutup kerucut r = 7 m, t = 6 m. Total volume silo adalah … (π = 22/7)",
    diagram: <TabungKerucutSVG r={7} tTab={10} tKer={6} />,
    options: [
      { key: "A", text: "1.232 m³" },
      { key: "B", text: "1.540 m³" },
      { key: "C", text: "1.848 m³" },
      { key: "D", text: "2.156 m³" },
    ],
    answer: "C",
  },
  {
    n: 4, title: "Volume Roket (Tabung + Kerucut)", cat: "tab-ker",
    content: "Model roket: tabung r = 7 cm, t = 30 cm, hidung kerucut r = 7 cm, t = 15 cm. Total volume badan roket adalah … (π = 22/7)",
    diagram: <TabungKerucutSVG r={7} tTab={30} tKer={15} />,
    options: [
      { key: "A", text: "4.235 cm³" },
      { key: "B", text: "4.620 cm³" },
      { key: "C", text: "5.082 cm³" },
      { key: "D", text: "5.390 cm³" },
    ],
    answer: "D",
  },
  {
    n: 5, title: "Volume Peluru Kecil (Tabung + Kerucut)", cat: "tab-ker",
    content: "Sebuah peluru: tabung r = 5 cm, t = 9 cm, dan ujung kerucut r = 5 cm, t = 3 cm. Total volumenya adalah … (π = 3,14)",
    diagram: <TabungKerucutSVG r={5} tTab={9} tKer={3} />,
    options: [
      { key: "A", text: "628 cm³" },
      { key: "B", text: "706,5 cm³" },
      { key: "C", text: "785 cm³" },
      { key: "D", text: "942 cm³" },
    ],
    answer: "C",
  },
  {
    n: 6, title: "Luas Selimut Pensil Runcing", cat: "tab-ker",
    content: "Model pensil: tabung r = 0,5 cm, t = 15 cm, ujung kerucut r = 0,5 cm, s = 2 cm. Luas selimut gabungan (tanpa alas) adalah … (π = 3,14)",
    diagram: <TabungKerucutSVG r={0.5} tTab={15} tKer={2} />,
    options: [
      { key: "A", text: "47,1 cm²" },
      { key: "B", text: "50,24 cm²" },
      { key: "C", text: "56,52 cm²" },
      { key: "D", text: "62,8 cm²" },
    ],
    answer: "B",
  },
  {
    n: 7, title: "Luas Kain Tenda (Selimut + Atap)", cat: "tab-ker",
    content: "Tenda: tabung r = 3 m, t = 2 m, atap kerucut r = 3 m, s = 5 m. Luas kain yang diperlukan (selimut tabung + selimut kerucut) adalah … (π = 3,14)",
    diagram: <TabungKerucutSVG r={3} tTab={2} tKer={4} />,
    options: [
      { key: "A", text: "47,1 m²" },
      { key: "B", text: "62,8 m²" },
      { key: "C", text: "75,36 m²" },
      { key: "D", text: "84,78 m²" },
    ],
    answer: "D",
  },
  {
    n: 8, title: "Luas Selimut Corong + Tabung", cat: "tab-ker",
    content: "Corong: kerucut r = 10 cm, s = 15 cm, disambung tabung r = 10 cm, t = 20 cm. Luas selimut gabungan adalah … (π = 3,14)",
    diagram: <TabungKerucutSVG r={10} tTab={20} tKer={12} />,
    options: [
      { key: "A", text: "1.099 cm²" },
      { key: "B", text: "1.413 cm²" },
      { key: "C", text: "1.727 cm²" },
      { key: "D", text: "2.041 cm²" },
    ],
    answer: "C",
  },
  {
    n: 9, title: "Volume Gabungan Tabung + Kerucut", cat: "tab-ker",
    content: "Sebuah bangun terdiri dari tabung r = 3 cm, t = 8 cm, dan kerucut r = 3 cm, t = 6 cm. Volume totalnya adalah … (π = 3,14)",
    diagram: <TabungKerucutSVG r={3} tTab={8} tKer={6} />,
    options: [
      { key: "A", text: "169,56 cm³" },
      { key: "B", text: "226,08 cm³" },
      { key: "C", text: "282,6 cm³" },
      { key: "D", text: "339,12 cm³" },
    ],
    answer: "C",
  },
  {
    n: 10, title: "Volume Gentong + Tutup Kerucut", cat: "tab-ker",
    content: "Gentong: tabung r = 21 cm, t = 40 cm, tutup kerucut r = 21 cm, t = 14 cm. Total volume adalah … (π = 22/7)",
    diagram: <TabungKerucutSVG r={21} tTab={40} tKer={14} />,
    options: [
      { key: "A", text: "49.140 cm³" },
      { key: "B", text: "55.440 cm³" },
      { key: "C", text: "61.908 cm³" },
      { key: "D", text: "68.376 cm³" },
    ],
    answer: "C",
  },

  /* ── TABUNG + SETENGAH BOLA ── */
  {
    n: 11, title: "Volume Kapsul (Tabung + 2 ½ Bola)", cat: "tab-hemi",
    content: "Kapsul obat: tabung r = 3 cm, t = 10 cm, dengan kedua ujung setengah bola r = 3 cm (total = tabung + 1 bola penuh). Volume kapsul adalah … (π = 3,14)",
    diagram: <TabungHemiSVG r={3} tTab={10} />,
    options: [
      { key: "A", text: "282,6 cm³" },
      { key: "B", text: "339,12 cm³" },
      { key: "C", text: "395,64 cm³" },
      { key: "D", text: "452,16 cm³" },
    ],
    answer: "C",
  },
  {
    n: 12, title: "Luas Permukaan Tangki (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Tangki: tabung r = 21 cm, t = 50 cm, tutup atas setengah bola r = 21 cm. Luas permukaan luar (alas + selimut + ½ bola) adalah … (π = 22/7)",
    diagram: <TabungHemiSVG r={21} tTab={50} />,
    options: [
      { key: "A", text: "7.986 cm²" },
      { key: "B", text: "9.372 cm²" },
      { key: "C", text: "10.758 cm²" },
      { key: "D", text: "11.704 cm²" },
    ],
    answer: "C",
  },
  {
    n: 13, title: "Luas Permukaan Kaleng Spray", cat: "tab-hemi",
    content: "Kaleng spray: tabung r = 3 cm, t = 18 cm, tutup atas setengah bola r = 3 cm. Luas permukaan (alas + selimut + ½ bola) adalah … (π = 3,14)",
    diagram: <TabungHemiSVG r={3} tTab={18} />,
    options: [
      { key: "A", text: "367,38 cm²" },
      { key: "B", text: "395,64 cm²" },
      { key: "C", text: "423,9 cm²" },
      { key: "D", text: "452,16 cm²" },
    ],
    answer: "C",
  },
  {
    n: 14, title: "Volume Granat Model (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Model granat: tabung r = 6 cm, t = 10 cm, bagian atas setengah bola r = 6 cm. Total volumenya adalah … (π = 3,14)",
    diagram: <TabungHemiSVG r={6} tTab={10} />,
    options: [
      { key: "A", text: "1.130,4 cm³" },
      { key: "B", text: "1.356,48 cm³" },
      { key: "C", text: "1.582,56 cm³" },
      { key: "D", text: "1.808,64 cm³" },
    ],
    answer: "C",
  },
  {
    n: 15, title: "Volume Balon Gas (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Balon gas: tabung r = 21 cm, t = 40 cm, bagian bawah setengah bola r = 21 cm. Total volume adalah … (π = 22/7)",
    diagram: <TabungHemiSVG r={21} tTab={40} />,
    options: [
      { key: "A", text: "55.440 cm³" },
      { key: "B", text: "64.900 cm³" },
      { key: "C", text: "74.844 cm³" },
      { key: "D", text: "94.248 cm³" },
    ],
    answer: "C",
  },
  {
    n: 16, title: "Volume Menara Air (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Menara air: tabung r = 21 cm, t = 20 cm, kubah setengah bola r = 21 cm di atas. Total volume adalah … (π = 22/7)",
    diagram: <TabungHemiSVG r={21} tTab={20} />,
    options: [
      { key: "A", text: "27.720 cm³" },
      { key: "B", text: "36.960 cm³" },
      { key: "C", text: "47.124 cm³" },
      { key: "D", text: "57.288 cm³" },
    ],
    answer: "C",
  },
  {
    n: 17, title: "Luas Cat Tiang Bendera (Selimut + Bola)", cat: "tab-hemi",
    content: "Tiang bendera: selimut tabung r = 2 cm, t = 200 cm, dan ujung atas bola penuh r = 3 cm. Luas permukaan yang dicat adalah … (π = 3,14)",
    diagram: <InfoBubbleSVG lines={["Tabung (r=2, t=200)  +  Bola (r=3)", "L_sel = 2×3,14×2×200", "L_bola = 4×3,14×9"]} />,
    options: [
      { key: "A", text: "2.199,8 cm²" },
      { key: "B", text: "2.512 cm²" },
      { key: "C", text: "2.625,04 cm²" },
      { key: "D", text: "2.764,5 cm²" },
    ],
    answer: "C",
  },
  {
    n: 18, title: "Luas Permukaan Mainan (Bola + Tabung)", cat: "tab-hemi",
    content: "Mainan: bola r = 5 cm di atas tabung r = 5 cm, t = 10 cm. Luas permukaan luar (luas bola + selimut tabung + alas) adalah … (π = 3,14)",
    diagram: <TabungHemiSVG r={5} tTab={10} />,
    options: [
      { key: "A", text: "471 cm²" },
      { key: "B", text: "549,5 cm²" },
      { key: "C", text: "628 cm²" },
      { key: "D", text: "706,5 cm²" },
    ],
    answer: "D",
  },
  {
    n: 19, title: "Luas Permukaan Gabungan Tabung + ½ Bola", cat: "tab-hemi",
    content: "Benda: tabung r = 7 cm, t = 10 cm, dan setengah bola di atas r = 7 cm. Luas permukaan luar (alas + selimut + ½ bola) adalah … (π = 22/7)",
    diagram: <TabungHemiSVG r={7} tTab={10} />,
    options: [
      { key: "A", text: "594 cm²" },
      { key: "B", text: "748 cm²" },
      { key: "C", text: "902 cm²" },
      { key: "D", text: "1.056 cm²" },
    ],
    answer: "C",
  },
  {
    n: 20, title: "Volume Es Krim Bar (Tabung + Bola Penuh)", cat: "tab-hemi",
    content: "Es krim bar: tabung r = 3 cm, t = 8 cm, dengan dua ujung masing-masing setengah bola r = 3 cm (= tabung + 1 bola penuh). Volumenya adalah … (π = 3,14)",
    diagram: <TabungHemiSVG r={3} tTab={8} />,
    options: [
      { key: "A", text: "226,08 cm³" },
      { key: "B", text: "282,6 cm³" },
      { key: "C", text: "339,12 cm³" },
      { key: "D", text: "395,64 cm³" },
    ],
    answer: "C",
  },

  /* ── KERUCUT + SETENGAH BOLA ── */
  {
    n: 21, title: "Volume Ice Cream (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Ice cream cone: setengah bola es krim r = 6 cm di atas kerucut r = 6 cm, t = 8 cm. Total volumenya adalah … (π = 3,14)",
    diagram: <KerucutHemiSVG r={6} tKer={8} />,
    options: [
      { key: "A", text: "301,44 cm³" },
      { key: "B", text: "452,16 cm³" },
      { key: "C", text: "603,2 cm³" },
      { key: "D", text: "753,6 cm³" },
    ],
    answer: "D",
  },
  {
    n: 22, title: "Luas Permukaan Pion Catur (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Pion catur: kerucut r = 5 cm, s = 13 cm, di atas setengah bola r = 5 cm. Luas permukaan total (selimut kerucut + ½ bola) adalah … (π = 3,14)",
    diagram: <KerucutHemiSVG r={5} tKer={12} />,
    options: [
      { key: "A", text: "157 cm²" },
      { key: "B", text: "204,1 cm²" },
      { key: "C", text: "361,1 cm²" },
      { key: "D", text: "518,1 cm²" },
    ],
    answer: "C",
  },
  {
    n: 23, title: "Volume Gelato (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Gelato: setengah bola r = 4 cm di atas kerucut r = 4 cm, t = 9 cm. Total volumenya adalah … (π = 3,14)",
    diagram: <KerucutHemiSVG r={4} tKer={9} />,
    options: [
      { key: "A", text: "150,72 cm³" },
      { key: "B", text: "200,96 cm³" },
      { key: "C", text: "251,2 cm³" },
      { key: "D", text: "284,69 cm³" },
    ],
    answer: "D",
  },
  {
    n: 24, title: "Volume Ornamen (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Ornamen: kerucut r = 5 cm, t = 12 cm, berdiri di atas setengah bola r = 5 cm. Total volumenya adalah … (π = 3,14)",
    diagram: <KerucutHemiSVG r={5} tKer={12} />,
    options: [
      { key: "A", text: "314 cm³" },
      { key: "B", text: "471 cm³" },
      { key: "C", text: "575,67 cm³" },
      { key: "D", text: "680,67 cm³" },
    ],
    answer: "C",
  },
  {
    n: 25, title: "Luas Permukaan (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Sebuah ornamen: kerucut r = 6 cm, s = 10 cm, berdiri di atas setengah bola r = 6 cm. Luas permukaan total (selimut kerucut + lengkung ½ bola) adalah … (π = 3,14)",
    diagram: <KerucutHemiSVG r={6} tKer={8} />,
    options: [
      { key: "A", text: "188,4 cm²" },
      { key: "B", text: "226,08 cm²" },
      { key: "C", text: "376,8 cm²" },
      { key: "D", text: "414,48 cm²" },
    ],
    answer: "D",
  },

  /* ── GABUNGAN CAMPURAN ── */
  {
    n: 26, title: "Volume Tiga Bangun (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Mainan: ½ bola r = 6 cm (bawah) + tabung r = 6 cm, t = 10 cm (tengah) + kerucut r = 6 cm, t = 8 cm (atas). Total volume adalah … (π = 3,14)",
    diagram: <HemiTabKerSVG r={6} tTab={10} tKer={8} />,
    options: [
      { key: "A", text: "1.130,4 cm³" },
      { key: "B", text: "1.432,44 cm³" },
      { key: "C", text: "1.733,84 cm³" },
      { key: "D", text: "1.884 cm³" },
    ],
    answer: "D",
  },
  {
    n: 27, title: "Volume Roket (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Model roket: ½ bola r = 5 cm (hidung) + tabung r = 5 cm, t = 15 cm (badan) + kerucut r = 5 cm, t = 6 cm (ekor). Total volumenya adalah … (π = 3,14)",
    diagram: <HemiTabKerSVG r={5} tTab={15} tKer={6} />,
    options: [
      { key: "A", text: "1.177,5 cm³" },
      { key: "B", text: "1.334,5 cm³" },
      { key: "C", text: "1.491,5 cm³" },
      { key: "D", text: "1.596,17 cm³" },
    ],
    answer: "D",
  },
  {
    n: 28, title: "Volume Menara Besar (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Menara: ½ bola r = 21 cm (dasar) + tabung r = 21 cm, t = 40 cm + kerucut r = 21 cm, t = 30 cm (puncak). Total volume adalah … (π = 22/7)",
    diagram: <HemiTabKerSVG r={21} tTab={40} tKer={30} />,
    options: [
      { key: "A", text: "55.440 cm³" },
      { key: "B", text: "69.300 cm³" },
      { key: "C", text: "74.844 cm³" },
      { key: "D", text: "88.704 cm³" },
    ],
    answer: "D",
  },
  {
    n: 29, title: "Volume Sisa – Tabung Dilubangi Kerucut", cat: "campuran",
    content: "Tabung r = 10 cm, t = 20 cm dilubangi kerucut r = 10 cm, t = 20 cm dari atas. Volume benda yang tersisa adalah … (π = 3,14)",
    diagram: <InfoBubbleSVG lines={["V_sisa = V_tabung − V_kerucut", "= πr²t − ⅓πr²t", "= ⅔ × πr²t"]} />,
    options: [
      { key: "A", text: "2.093,33 cm³" },
      { key: "B", text: "3.140 cm³" },
      { key: "C", text: "4.186,67 cm³" },
      { key: "D", text: "6.280 cm³" },
    ],
    answer: "C",
  },
  {
    n: 30, title: "Volume Sisa – Kubus Dilubangi Bola", cat: "campuran",
    content: "Kubus bersisi 6 cm dilubangi di tengah berbentuk bola r = 3 cm. Volume kubus yang tersisa adalah … (π = 3,14)",
    diagram: <InfoBubbleSVG lines={["V_kubus = 6³ = 216 cm³", "V_bola = 4/3 × 3,14 × 27", "V_sisa = 216 − V_bola"]} />,
    options: [
      { key: "A", text: "56,52 cm³" },
      { key: "B", text: "102,96 cm³" },
      { key: "C", text: "144 cm³" },
      { key: "D", text: "169,56 cm³" },
    ],
    answer: "B",
  },
  {
    n: 31, title: "Tinggi Air – ½ Bola ke Tabung", cat: "campuran",
    content: "Ember setengah bola r = 21 cm penuh air. Air dituangkan ke tabung r = 7 cm. Tinggi air dalam tabung adalah … (π = 22/7)",
    diagram: <InfoBubbleSVG lines={["V_½bola = ²⁄₃ × 22/7 × 21³ = 19.404 cm³", "22/7 × 49 × t = 19.404", "154 × t = 19.404 → t = ?"]} />,
    options: [
      { key: "A", text: "63 cm" },
      { key: "B", text: "84 cm" },
      { key: "C", text: "105 cm" },
      { key: "D", text: "126 cm" },
    ],
    answer: "D",
  },
  {
    n: 32, title: "Volume Sisa – Tabung Dilubangi ½ Bola", cat: "campuran",
    content: "Tabung r = 10 cm, t = 15 cm dilubangi setengah bola r = 10 cm dari atas. Volume benda yang tersisa adalah … (π = 3,14)",
    diagram: <TabungHemiSVG r={10} tTab={15} color="#f87171" />,
    options: [
      { key: "A", text: "2.093,33 cm³" },
      { key: "B", text: "2.616,67 cm³" },
      { key: "C", text: "3.140 cm³" },
      { key: "D", text: "4.710 cm³" },
    ],
    answer: "B",
  },
  {
    n: 33, title: "Kapasitas Wajan (½ Bola + Bibir Tabung)", cat: "campuran",
    content: "Wajan: bagian bola setengah r = 21 cm, dengan bibir tabung r = 21 cm, t = 5 cm. Total kapasitas wajan adalah … (π = 22/7)",
    diagram: <TabungHemiSVG r={21} tTab={5} />,
    options: [
      { key: "A", text: "6.930 cm³" },
      { key: "B", text: "19.404 cm³" },
      { key: "C", text: "22.704 cm³" },
      { key: "D", text: "26.334 cm³" },
    ],
    answer: "D",
  },
  {
    n: 34, title: "Volume Sisa – Tiga Kerucut dalam Tabung", cat: "campuran",
    content: "Tabung r = 6 cm, t = 9 cm berisi 3 kerucut r = 2 cm, t = 9 cm. Volume ruang kosong dalam tabung adalah … (π = 3,14)",
    diagram: <InfoBubbleSVG lines={["V_tabung = 3,14 × 36 × 9", "V_3kerucut = 3 × ⅓ × 3,14 × 4 × 9", "V_sisa = V_tabung − V_3kerucut"]} />,
    options: [
      { key: "A", text: "339,12 cm³" },
      { key: "B", text: "565,2 cm³" },
      { key: "C", text: "791,28 cm³" },
      { key: "D", text: "904,32 cm³" },
    ],
    answer: "D",
  },
  {
    n: 35, title: "Biaya Cat – Tabung + ½ Bola", cat: "campuran",
    content: "Benda: tabung r = 7 cm, t = 10 cm, dan setengah bola di atas r = 7 cm (tanpa alas). Biaya cat Rp2.000/cm². Total biaya adalah … (π = 22/7)",
    diagram: <TabungHemiSVG r={7} tTab={10} />,
    options: [
      { key: "A", text: "Rp880.000" },
      { key: "B", text: "Rp1.232.000" },
      { key: "C", text: "Rp1.496.000" },
      { key: "D", text: "Rp1.848.000" },
    ],
    answer: "C",
  },
  {
    n: 36, title: "Volume Total – Bola + Pipa Tabung", cat: "campuran",
    content: "Sistem tangki: bola r = 21 cm + pipa tabung r = 3,5 cm, panjang 100 cm. Total volume sistem adalah … (π = 22/7)",
    diagram: <InfoBubbleSVG lines={["V_bola = ⁴⁄₃ × 22/7 × 21³ = 38.808 cm³", "V_pipa = 22/7 × 12,25 × 100 = 3.850 cm³", "V_total = 38.808 + 3.850"]} />,
    options: [
      { key: "A", text: "38.808 cm³" },
      { key: "B", text: "40.012 cm³" },
      { key: "C", text: "42.658 cm³" },
      { key: "D", text: "46.508 cm³" },
    ],
    answer: "C",
  },
  {
    n: 37, title: "Kapasitas Bak Cuci (½ Bola) dalam Liter", cat: "campuran",
    content: "Bak cuci berbentuk setengah bola r = 20 cm. Berapa liter air yang dapat ditampung? (π = 3,14; 1 liter = 1.000 cm³)",
    diagram: <InfoBubbleSVG lines={["V = ²⁄₃ × 3,14 × 20³", "= ²⁄₃ × 3,14 × 8.000", "V (liter) = V / 1.000"]} />,
    options: [
      { key: "A", text: "8,37 liter" },
      { key: "B", text: "12,56 liter" },
      { key: "C", text: "16,75 liter" },
      { key: "D", text: "25,12 liter" },
    ],
    answer: "C",
  },
  {
    n: 38, title: "Selisih Volume – Kerucut vs Tabung", cat: "campuran",
    content: "Kerucut r = 10 cm, t = 30 cm, dan tabung r = 10 cm, t = 10 cm. Selisih volume keduanya adalah … (π = 3,14)",
    diagram: <InfoBubbleSVG lines={["V_kerucut = ⅓ × 3,14 × 100 × 30", "V_tabung  = 3,14 × 100 × 10", "Selisih = |V_kerucut − V_tabung|"]} />,
    options: [
      { key: "A", text: "0 cm³" },
      { key: "B", text: "1.046,67 cm³" },
      { key: "C", text: "2.093,33 cm³" },
      { key: "D", text: "3.140 cm³" },
    ],
    answer: "A",
  },
  {
    n: 39, title: "Kapasitas Drum (Tabung + ½ Bola) dalam Liter", cat: "campuran",
    content: "Drum kimia: tabung r = 21 cm, t = 40 cm, tutup bawah setengah bola r = 21 cm. Kapasitas dalam liter adalah … (π = 22/7)",
    diagram: <TabungHemiSVG r={21} tTab={40} />,
    options: [
      { key: "A", text: "55,44 liter" },
      { key: "B", text: "64,9 liter" },
      { key: "C", text: "74,84 liter" },
      { key: "D", text: "84,26 liter" },
    ],
    answer: "C",
  },
  {
    n: 40, title: "Luas Permukaan Roket (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Roket: ½ bola r = 5 cm (hidung) + tabung r = 5 cm, t = 10 cm + kerucut r = 5 cm, s = 13 cm, t = 12 cm (ekor). Luas permukaan luar (½ bola + selimut tabung + selimut kerucut + alas) adalah … (π = 3,14)",
    diagram: <HemiTabKerSVG r={5} tTab={10} tKer={12} />,
    options: [
      { key: "A", text: "471 cm²" },
      { key: "B", text: "596,8 cm²" },
      { key: "C", text: "675,1 cm²" },
      { key: "D", text: "753,6 cm²" },
    ],
    answer: "D",
  },
];

/* ═══════════════════════════════════════════════════
   HELPER COMPONENTS
═══════════════════════════════════════════════════ */

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
      ? "bg-emerald-500/30 border-emerald-400 text-white"
      : "bg-white/5 border-white/10 text-white/80 hover:border-emerald-400/50 hover:bg-emerald-500/10";
  }
  if (key === answer) return "bg-emerald-500/25 border-emerald-400 text-emerald-200";
  if (selected === key && key !== answer) return "bg-rose-500/25 border-rose-400 text-rose-200 line-through";
  return "bg-white/3 border-white/8 text-white/40";
};

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */

const GabunganPage = () => {
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
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🧩</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(16,185,129,0.7)' }}>
            BANGUN RUANG SISI LENGKUNG GABUNGAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
              <span className="text-emerald-400 text-xs font-bold">📋 40 Soal</span>
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

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Strategi Soal Gabungan</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Volume Gabungan", formula: "V_{\\text{total}} = V_1 + V_2 + V_3 + \\ldots" },
              { label: "Luas Permukaan", formula: "\\text{Hitung bagian luar saja (bidang bersekutu diabaikan)}" },
              { label: "Tabung + Kerucut (r,t sama)", formula: "V_{\\text{ker}} = \\tfrac{1}{3}\\,V_{\\text{tab}}" },
              { label: "½ Bola (r)", formula: "V_{\\frac{1}{2}\\text{bola}} = \\tfrac{2}{3}\\pi r^3" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-emerald-400 font-bold shrink-0 w-44 text-[11px]">{f.label}</span>
                <span className="text-white/80 text-xs"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-emerald-500/20" />
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2">Soal 1–40 · Pilihan Ganda</span>
          <div className="h-px flex-1 bg-emerald-500/20" />
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {mcQuestions.map((q, i) => {
            const isRevealed = !!revealed[q.n];
            const sel        = selected[q.n];
            const isCorrect  = isRevealed && sel === q.answer;
            const isWrong    = isRevealed && !!sel && sel !== q.answer;
            const prevCat    = i > 0 ? mcQuestions[i - 1].cat : null;
            const showDivider = q.cat !== prevCat;
            return (
              <div key={q.n}>
                {showDivider && <CatDivider cat={q.cat} />}
                <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${i * 0.015}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
                  <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isCorrect ? "border border-emerald-500/40" : isWrong ? "border border-rose-500/40" : "border border-emerald-500/20"}`} />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
                  <div className="relative px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCorrect ? "bg-emerald-500/20 border-emerald-400/50" : isWrong ? "bg-rose-500/20 border-rose-400/50" : "bg-emerald-500/20 border-emerald-400/50"}`}>
                        <span className={`text-xs font-bold ${isCorrect ? "text-emerald-300" : isWrong ? "text-rose-300" : "text-emerald-300"}`}>{q.n}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                          {q.title}
                        </span>
                        <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>
                        {q.diagram && <div className="mb-3 w-full">{q.diagram}</div>}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          {q.options.map(opt => (
                            <button key={opt.key}
                              onClick={() => handleSelect(q.n, opt.key)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm font-body transition-all cursor-pointer ${optionStyle(opt.key, sel, q.answer, isRevealed)}`}>
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                                isRevealed && opt.key === q.answer                          ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
                                : isRevealed && sel === opt.key && opt.key !== q.answer     ? "border-rose-400 text-rose-300 bg-rose-500/20"
                                : sel === opt.key                                           ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
                                : "border-white/20 text-white/50"
                              }`}>{opt.key}</span>
                              <span>{opt.text}</span>
                              {isRevealed && opt.key === q.answer && <span className="ml-auto text-emerald-400 text-xs font-bold">✓</span>}
                              {isRevealed && sel === opt.key && opt.key !== q.answer && <span className="ml-auto text-rose-400 text-xs font-bold">✗</span>}
                            </button>
                          ))}
                        </div>
                        {!isRevealed ? (
                          <button onClick={() => handleReveal(q.n)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer font-body">
                            Lihat Jawaban
                          </button>
                        ) : (
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

export default GabunganPage;
