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
  const ell = Math.round(W * 0.22);
  const baseY   = 190;
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

function HorizontalCapsuleSVG({ d, totalLen, color = "#34d399" }: {
  d: number; totalLen: number; color?: string;
}) {
  const VW = 360, VH = 260;
  const cx = VW / 2, cy = VH / 2;
  const rx = 130;
  const ry = 46;
  const capRx = ry;
  const capRy = ry;
  const leftCap  = cx - rx;
  const rightCap = cx + rx;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ maxWidth: "100%", display: "block" }}>
      {/* cylinder body fill */}
      <rect x={leftCap} y={cy - ry} width={rx * 2} height={ry * 2}
        fill={color} fillOpacity="0.10" />
      {/* left hemisphere */}
      <ellipse cx={leftCap} cy={cy} rx={capRx * 0.58} ry={capRy}
        fill={color} fillOpacity="0.18" stroke={color} strokeWidth={SW} />
      {/* right hemisphere */}
      <ellipse cx={rightCap} cy={cy} rx={capRx * 0.58} ry={capRy}
        fill={color} fillOpacity="0.18" stroke={color} strokeWidth={SW} />
      {/* top & bottom straight lines */}
      <line x1={leftCap} y1={cy - ry} x2={rightCap} y2={cy - ry} stroke={color} strokeWidth={SW} />
      <line x1={leftCap} y1={cy + ry} x2={rightCap} y2={cy + ry} stroke={color} strokeWidth={SW} />
      {/* middle cross-section ellipses (dashed) */}
      <ellipse cx={cx} cy={cy} rx={capRx * 0.58} ry={ry}
        fill="none" stroke={color} strokeWidth={LSW} strokeDasharray="5,4" strokeOpacity="0.6" />
      {/* left-quarter dashed ellipse */}
      <ellipse cx={cx - rx * 0.5} cy={cy} rx={capRx * 0.58} ry={ry}
        fill="none" stroke={color} strokeWidth={LSW} strokeDasharray="5,4" strokeOpacity="0.45" />
      {/* HEIGHT dimension line (left side, vertical) */}
      <line x1={leftCap - 28} y1={cy - ry} x2={leftCap - 28} y2={cy + ry}
        stroke={color} strokeWidth={LSW} strokeOpacity="0.8" />
      <line x1={leftCap - 34} y1={cy - ry} x2={leftCap - 22} y2={cy - ry} stroke={color} strokeWidth={LSW} />
      <line x1={leftCap - 34} y1={cy + ry} x2={leftCap - 22} y2={cy + ry} stroke={color} strokeWidth={LSW} />
      {/* arrow heads for height */}
      <polygon points={`${leftCap - 28},${cy - ry - 5} ${leftCap - 32},${cy - ry + 6} ${leftCap - 24},${cy - ry + 6}`}
        fill={color} fillOpacity="0.85" />
      <polygon points={`${leftCap - 28},${cy + ry + 5} ${leftCap - 32},${cy + ry - 6} ${leftCap - 24},${cy + ry - 6}`}
        fill={color} fillOpacity="0.85" />
      <text x={leftCap - 52} y={cy + 5} fill={color} fontSize="13" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle">{d} cm</text>
      {/* LENGTH dimension line (bottom, horizontal) */}
      <line x1={leftCap - capRx * 0.58} y1={cy + ry + 30} x2={rightCap + capRx * 0.58} y2={cy + ry + 30}
        stroke={color} strokeWidth={LSW} strokeOpacity="0.8" />
      <line x1={leftCap - capRx * 0.58} y1={cy + ry + 24} x2={leftCap - capRx * 0.58} y2={cy + ry + 36}
        stroke={color} strokeWidth={LSW} />
      <line x1={rightCap + capRx * 0.58} y1={cy + ry + 24} x2={rightCap + capRx * 0.58} y2={cy + ry + 36}
        stroke={color} strokeWidth={LSW} />
      {/* arrow heads for length */}
      <polygon points={`${leftCap - capRx * 0.58 - 5},${cy + ry + 30} ${leftCap - capRx * 0.58 + 7},${cy + ry + 25} ${leftCap - capRx * 0.58 + 7},${cy + ry + 35}`}
        fill={color} fillOpacity="0.85" />
      <polygon points={`${rightCap + capRx * 0.58 + 5},${cy + ry + 30} ${rightCap + capRx * 0.58 - 7},${cy + ry + 25} ${rightCap + capRx * 0.58 - 7},${cy + ry + 35}`}
        fill={color} fillOpacity="0.85" />
      <text x={cx} y={cy + ry + 50} fill={color} fontSize="13" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle">{totalLen} cm</text>
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
    content: "Sebuah tenda berbentuk tabung r = 7 m, t = 3 m, dilengkapi atap kerucut r = 7 m, t = 3 m. Total volume tenda adalah …",
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
    n: 2, title: "Volume Roket (Tabung + Kerucut)", cat: "tab-ker",
    content: "Model roket: tabung r = 7 cm, t = 30 cm, hidung kerucut r = 7 cm, t = 15 cm. Total volume badan roket adalah …",
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
    n: 3, title: "Luas Kain Tenda (Selimut + Atap)", cat: "tab-ker",
    content: "Tenda: tabung r = 3 m, t = 2 m, atap kerucut r = 3 m, s = 5 m. Luas kain yang diperlukan adalah …",
    diagram: <TabungKerucutSVG r={3} tTab={2} tKer={4} />,
    options: [
      { key: "A", text: "47,1 m²" },
      { key: "B", text: "62,8 m²" },
      { key: "C", text: "75,36 m²" },
      { key: "D", text: "84,78 m²" },
    ],
    answer: "D",
  },

  /* ── TABUNG + SETENGAH BOLA ── */
  {
    n: 4, title: "Luas Permukaan Tangki (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Tangki: tabung r = 21 cm, t = 50 cm, tutup atas setengah bola r = 21 cm. Luas permukaan luar (alas + selimut + ½ bola) adalah …",
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
    n: 5, title: "Volume Menara Air (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Menara air: tabung r = 21 cm, t = 20 cm, kubah setengah bola r = 21 cm di atas. Total volume adalah …",
    diagram: <TabungHemiSVG r={21} tTab={20} />,
    options: [
      { key: "A", text: "27.720 cm³" },
      { key: "B", text: "36.960 cm³" },
      { key: "C", text: "47.124 cm³" },
      { key: "D", text: "57.288 cm³" },
    ],
    answer: "C",
  },

  /* ── KERUCUT + SETENGAH BOLA ── */
  {
    n: 6, title: "Volume Ice Cream (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Ice cream cone: setengah bola es krim r = 6 cm di atas kerucut r = 6 cm, t = 8 cm. Total volumenya adalah …",
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
    n: 7, title: "Luas Permukaan Pion Catur (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Pion catur: kerucut r = 5 cm, s = 13 cm, di atas setengah bola r = 5 cm. Luas permukaan total (selimut kerucut + ½ bola) adalah …",
    diagram: <KerucutHemiSVG r={5} tKer={12} />,
    options: [
      { key: "A", text: "157 cm²" },
      { key: "B", text: "204,1 cm²" },
      { key: "C", text: "361,1 cm²" },
      { key: "D", text: "518,1 cm²" },
    ],
    answer: "C",
  },

  /* ── GABUNGAN CAMPURAN ── */
  {
    n: 8, title: "Volume Menara Besar (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Menara: ½ bola r = 21 cm (dasar) + tabung r = 21 cm, t = 40 cm + kerucut r = 21 cm, t = 30 cm (puncak). Total volume adalah …",
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
    n: 9, title: "Tinggi Air – ½ Bola ke Tabung", cat: "campuran",
    content: "Ember setengah bola r = 21 cm penuh air. Air dituangkan ke tabung r = 7 cm. Tinggi air dalam tabung adalah …",
    options: [
      { key: "A", text: "63 cm" },
      { key: "B", text: "84 cm" },
      { key: "C", text: "105 cm" },
      { key: "D", text: "126 cm" },
    ],
    answer: "D",
  },
  {
    n: 10, title: "Biaya Cat – Tabung + ½ Bola", cat: "campuran",
    content: "Benda: tabung r = 7 cm, t = 10 cm, dan setengah bola di atas r = 7 cm (tanpa alas). Biaya cat Rp2.000/cm². Total biaya adalah …",
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
    n: 11, title: "Luas Permukaan Roket (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Roket: ½ bola r = 5 cm (hidung) + tabung r = 5 cm, t = 10 cm + kerucut r = 5 cm, s = 13 cm, t = 12 cm (ekor). Luas permukaan luar (½ bola + selimut tabung + selimut kerucut + alas) adalah …",
    diagram: <HemiTabKerSVG r={5} tTab={10} tKer={12} />,
    options: [
      { key: "A", text: "471 cm²" },
      { key: "B", text: "596,8 cm²" },
      { key: "C", text: "675,1 cm²" },
      { key: "D", text: "753,6 cm²" },
    ],
    answer: "D",
  },
  {
    n: 12, title: "Luas Permukaan Kapsul (Tabung + 2 Setengah Bola)", cat: "tab-hemi",
    content: "Perhatikan gambar! Sebuah bangun berbentuk kapsul (tabung dengan kedua ujung setengah bola) dengan diameter 20 cm dan panjang total 60 cm. Luas permukaan bangun tersebut adalah …",
    diagram: <HorizontalCapsuleSVG d={20} totalLen={60} />,
    options: [
      { key: "A", text: "400π cm²" },
      { key: "B", text: "800π cm²" },
      { key: "C", text: "1.200π cm²" },
      { key: "D", text: "1.600π cm²" },
    ],
    answer: "C",
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
              <span className="text-emerald-400 text-xs font-bold">📋 12 Soal</span>
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
              { label: "Luas Permukaan", formula: null },
              { label: "Tabung + Kerucut (r,t sama)", formula: "V_{\\text{ker}} = \\tfrac{1}{3}\\,V_{\\text{tab}}" },
              { label: "½ Bola (r)", formula: "V_{\\frac{1}{2}\\text{bola}} = \\tfrac{2}{3}\\pi r^3" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-emerald-400 font-bold text-[11px] sm:shrink-0 sm:w-44">{f.label}</span>
                <span className="text-white/80 text-xs">
                  {f.formula ? <InlineMath math={f.formula} /> : "Hitung bagian luar saja (bidang bersekutu diabaikan)"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-emerald-500/20" />
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2">Soal Pilihan Ganda</span>
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
