import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Triangle } from "lucide-react";
import { SimilarTriangles, ParallelLinesTriangle, TriangleAltitude } from "./GeoFigure";

const SoalQ1 = () => (
  <svg viewBox="0 0 300 205" className="w-full max-w-xs mx-auto">
    <polygon points="95,35 205,35 238,175 62,175" fill="#3b82f6" fillOpacity="0.10" stroke="#60a5fa" strokeWidth="2"/>
    <line x1="95" y1="35" x2="238" y2="175" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,3"/>
    <line x1="205" y1="35" x2="62" y2="175" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,3"/>
    {/* E at exact intersection of diagonals AC and BD */}
    <circle cx="150" cy="87" r="3.5" fill="#fbbf24"/>
    <text x="155" y="85"  fontSize="12" fill="#fde68a" fontWeight="bold">E</text>
    <text x="83"  y="29"  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="207" y="29"  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="241" y="190" fontSize="13" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="49"  y="190" fontSize="13" fill="#93c5fd" fontWeight="bold">D</text>
    {/* Right-pointing arrow on AB (parallel indicator) */}
    <polygon points="147,32 156,35 147,38" fill="#fde68a"/>
    {/* Right-pointing arrow on DC (parallel indicator) */}
    <polygon points="147,172 156,175 147,178" fill="#fde68a"/>
    <text x="150" y="22"  textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">AB = 8 cm</text>
    <text x="150" y="200" textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">DC = 12 cm</text>
    <text x="98"  y="68"  fontSize="11" fill="#f97316" fontWeight="bold">AE = 4 cm</text>
    <text x="178" y="138" fontSize="11" fill="#a855f7" fontWeight="bold">CE = ?</text>
  </svg>
);

const SoalQ2 = () => {
  const A={x:160,y:22}, B={x:30,y:195}, C={x:290,y:195};
  const D={x:76,y:138}, E={x:244,y:138};
  return (
    <svg viewBox="0 0 320 215" className="w-full max-w-xs mx-auto">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#3b82f6" fillOpacity="0.10" stroke="#60a5fa" strokeWidth="2"/>
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#4ade80" strokeWidth="2.2"/>
      {/* Right-pointing arrow on DE (parallel indicator) */}
      <polygon points="157,135 165,138 157,141" fill="#4ade80"/>
      {/* Right-pointing arrow on BC (parallel indicator) */}
      <polygon points="157,192 165,195 157,198" fill="#60a5fa"/>
      <text x={A.x-5} y={A.y-5}  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x-15} y={B.y+12} fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C.x+4}  y={C.y+12} fontSize="13" fill="#93c5fd" fontWeight="bold">C</text>
      <text x={D.x-14} y={D.y+5}  fontSize="12" fill="#4ade80" fontWeight="bold">D</text>
      <text x={E.x+4}  y={E.y+5}  fontSize="12" fill="#4ade80" fontWeight="bold">E</text>
      <text x="82"  y="82"  fontSize="12" fill="#f97316" fontWeight="bold">c</text>
      {/* "4 cm" label repositioned to avoid arrow collision */}
      <text x="8"   y="168" fontSize="11" fill="#fbbf24" fontWeight="bold">4 cm</text>
      <text x="244" y="82"  fontSize="12" fill="#a855f7" fontWeight="bold">d</text>
      {/* "3 cm" label repositioned */}
      <text x="271" y="168" fontSize="11" fill="#fbbf24" fontWeight="bold">3 cm</text>
      <text x={(D.x+E.x)/2} y={D.y-8} textAnchor="middle" fontSize="11" fill="#4ade80" fontWeight="bold">DE = 8 cm</text>
      <text x={(B.x+C.x)/2} y={B.y+15} textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">BC = 12 cm</text>
    </svg>
  );
};

const SoalQ3 = () => {
  const A={x:108,y:38}, B={x:192,y:38}, C={x:272,y:182}, D={x:28,y:182};
  const E={x:A.x+(2/5)*(D.x-A.x), y:A.y+(2/5)*(D.y-A.y)};
  const F={x:B.x+(2/5)*(C.x-B.x), y:B.y+(2/5)*(C.y-B.y)};
  const abMid={x:(A.x+B.x)/2, y:A.y};
  const efMid={x:(E.x+F.x)/2, y:E.y};
  const dcMid={x:(D.x+C.x)/2, y:D.y};
  return (
    <svg viewBox="0 0 310 210" className="w-full max-w-xs mx-auto">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="#3b82f6" fillOpacity="0.10" stroke="#60a5fa" strokeWidth="2"/>
      <line x1={E.x} y1={E.y} x2={F.x} y2={F.y} stroke="#4ade80" strokeWidth="2.5"/>
      <circle cx={E.x} cy={E.y} r="3.5" fill="#4ade80"/>
      <circle cx={F.x} cy={F.y} r="3.5" fill="#4ade80"/>
      <text x={A.x-14} y={A.y+4}  fontSize="12" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+3}  y={B.y+4}  fontSize="12" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C.x+4}  y={C.y+12} fontSize="12" fill="#93c5fd" fontWeight="bold">C</text>
      <text x={D.x-15} y={D.y+12} fontSize="12" fill="#93c5fd" fontWeight="bold">D</text>
      <text x={E.x-15} y={E.y+5}  fontSize="12" fill="#4ade80" fontWeight="bold">E</text>
      <text x={F.x+4}  y={F.y+5}  fontSize="12" fill="#4ade80" fontWeight="bold">F</text>
      <text x={150} y={26} textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">AB = 5 cm</text>
      <text x={150} y={200} textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">DC = 20 cm</text>
      <text x={efMid.x} y={efMid.y-8} textAnchor="middle" fontSize="11" fill="#4ade80" fontWeight="bold">EF = ?</text>
      {/* Right-pointing arrows on AB, EF, DC (parallel indicators) */}
      <polygon points={`${abMid.x-3},${abMid.y-3} ${abMid.x+7},${abMid.y} ${abMid.x-3},${abMid.y+3}`} fill="#fde68a"/>
      <polygon points={`${efMid.x-3},${efMid.y-3} ${efMid.x+7},${efMid.y} ${efMid.x-3},${efMid.y+3}`} fill="#4ade80"/>
      <polygon points={`${dcMid.x-3},${dcMid.y-3} ${dcMid.x+7},${dcMid.y} ${dcMid.x-3},${dcMid.y+3}`} fill="#fde68a"/>
    </svg>
  );
};

const SoalQ4 = () => (
  <svg viewBox="0 0 370 275" className="w-full max-w-sm mx-auto" style={{background:"rgba(15,23,42,0.5)", borderRadius:8}}>
    <defs>
      <linearGradient id="q4WaterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.75"/>
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.90"/>
      </linearGradient>
      <clipPath id="q4RiverClip">
        <rect x="0" y="82" width="370" height="95"/>
      </clipPath>
    </defs>
    {/* Upper land */}
    <rect x="0" y="0" width="370" height="82" fill="#15803d" fillOpacity="0.18"/>
    {/* River water */}
    <rect x="0" y="82" width="370" height="95" fill="url(#q4WaterGrad)"/>
    {/* Animated wave lines clipped to river */}
    <g clipPath="url(#q4RiverClip)">
      <path d="M -80,98 Q -60,91 -40,98 Q -20,105 0,98 Q 20,91 40,98 Q 60,105 80,98 Q 100,91 120,98 Q 140,105 160,98 Q 180,91 200,98 Q 220,105 240,98 Q 260,91 280,98 Q 300,105 320,98 Q 340,91 360,98 Q 380,105 400,98 Q 420,91 450,98"
        fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="1.8">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="80,0" dur="3s" repeatCount="indefinite"/>
      </path>
      <path d="M -40,122 Q -20,115 0,122 Q 20,129 40,122 Q 60,115 80,122 Q 100,129 120,122 Q 140,115 160,122 Q 180,129 200,122 Q 220,115 240,122 Q 260,129 280,122 Q 300,115 320,122 Q 340,129 360,122 Q 380,115 400,122 Q 420,129 450,122"
        fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5">
        <animateTransform attributeName="transform" type="translate" from="-80,0" to="0,0" dur="2.2s" repeatCount="indefinite"/>
      </path>
      <path d="M -80,148 Q -60,142 -40,148 Q -20,154 0,148 Q 20,142 40,148 Q 60,154 80,148 Q 100,142 120,148 Q 140,154 160,148 Q 180,142 200,148 Q 220,154 240,148 Q 260,142 280,148 Q 300,154 320,148 Q 340,142 360,148 Q 380,154 400,148 Q 420,142 450,148"
        fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.3">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="80,0" dur="4s" repeatCount="indefinite"/>
      </path>
      <text x="185" y="133" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.55)" fontStyle="italic">~ ~ SUNGAI ~ ~</text>
    </g>
    {/* Lower land */}
    <rect x="0" y="177" width="370" height="98" fill="#15803d" fillOpacity="0.12"/>
    {/* River bank lines */}
    <line x1="0" y1="82"  x2="370" y2="82"  stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="7,4"/>
    <line x1="0" y1="177" x2="370" y2="177" stroke="#4ade80" strokeWidth="1.8"/>
    {/* Points: A(117,72) B(117,177) C(180,177) D(222,242) E(222,177) */}
    {/* D,C,A collinear: direction (-42,-67) scaled */}
    <circle cx="117" cy="72"  r="4.5" fill="#f97316"/>
    <text x="100" y="67" fontSize="13" fill="#f97316" fontWeight="bold">A</text>
    <circle cx="117" cy="177" r="4.5" fill="#fbbf24"/>
    <text x="100" y="195" fontSize="13" fill="#fbbf24" fontWeight="bold">B</text>
    <circle cx="180" cy="177" r="4.5" fill="#fbbf24"/>
    <text x="175" y="195" fontSize="13" fill="#fbbf24" fontWeight="bold">C</text>
    <circle cx="222" cy="177" r="4.5" fill="#4ade80"/>
    <text x="217" y="195" fontSize="13" fill="#4ade80" fontWeight="bold">E</text>
    <circle cx="222" cy="242" r="4.5" fill="#c084fc"/>
    <text x="228" y="246" fontSize="13" fill="#c084fc" fontWeight="bold">D</text>
    {/* AB vertical dashed (river width = unknown) */}
    <line x1="117" y1="82" x2="117" y2="177" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>
    <text x="122" y="132" fontSize="11" fill="#ef4444" fontWeight="bold">AB = ?</text>
    {/* Line D-C-A (collinear) */}
    <line x1="222" y1="242" x2="117" y2="72" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,3"/>
    {/* DE vertical segment */}
    <line x1="222" y1="177" x2="222" y2="242" stroke="#c084fc" strokeWidth="2"/>
    <text x="228" y="213" fontSize="10" fill="#c084fc" fontWeight="bold">DE=3m</text>
    {/* BC horizontal label */}
    <text x="148" y="171" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">BC=12m</text>
    {/* CE horizontal label */}
    <text x="201" y="171" textAnchor="middle" fontSize="10" fill="#4ade80" fontWeight="bold">CE=4m</text>
    <text x="185" y="268" textAnchor="middle" fontSize="9" fill="#94a3b8" fontStyle="italic">D, C, A segaris (satu garis lurus)</text>
  </svg>
);

const SoalQ5 = () => {
  const E={x:152,y:100};
  const A={x:55,y:38},  B={x:249,y:38};
  const C={x:249,y:162}, D={x:55,y:162};
  return (
    <svg viewBox="0 0 310 200" className="w-full max-w-xs mx-auto">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${E.x},${E.y}`} fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="2"/>
      <polygon points={`${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="#22c55e" fillOpacity="0.15" stroke="#4ade80" strokeWidth="2"/>
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3"/>
      <circle cx={E.x} cy={E.y} r="3.5" fill="#fbbf24"/>
      <text x={A.x-14} y={A.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+3}  y={B.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C.x+3}  y={C.y+14} fontSize="13" fill="#4ade80" fontWeight="bold">C</text>
      <text x={D.x-14} y={D.y+14} fontSize="13" fill="#4ade80" fontWeight="bold">D</text>
      <text x={E.x+5}  y={E.y+5}  fontSize="12" fill="#fde68a" fontWeight="bold">E</text>
      <text x={(A.x+E.x)/2-28} y={(A.y+E.y)/2+4} fontSize="11" fill="#f97316" fontWeight="bold">AE=3</text>
      <text x={(C.x+E.x)/2+5}  y={(C.y+E.y)/2+4} fontSize="11" fill="#4ade80" fontWeight="bold">CE=5</text>
      <text x={(C.x+D.x)/2} y={C.y+16} textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">CD = 15 cm</text>
      <text x={(A.x+B.x)/2} y={A.y-8} textAnchor="middle" fontSize="11" fill="#a855f7" fontWeight="bold">AB = ?</text>
    </svg>
  );
};

const SoalQ6 = () => {
  // △ABC right-angled at B: AB=6, BC=8, CA=10 (6-8-10 Pythagorean triple)
  // Scale: 7 px/cm
  // Shift base up to y=108 so R (tallest point) sits near y=24 — no wasted top space
  const base = 108;
  const Av={x:18,  y:base};
  const Bv={x:60,  y:base};
  const Cv={x:60,  y:base-56}; // BC=8 → 56px
  const Pv={x:165, y:base};
  const Qv={x:228, y:base};
  const Rv={x:228, y:base-84}; // QR=12 → 84px
  const sq = 7;
  return (
    <svg viewBox="0 0 300 128" className="w-full max-w-sm mx-auto">
      {/* ── Triangle ABC ── */}
      <polygon points={`${Av.x},${Av.y} ${Bv.x},${Bv.y} ${Cv.x},${Cv.y}`}
        fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="2"/>
      {/* Right-angle mark at B */}
      <path d={`M ${Bv.x},${Bv.y-sq} L ${Bv.x-sq},${Bv.y-sq} L ${Bv.x-sq},${Bv.y}`}
        fill="none" stroke="#ffffff" strokeWidth="1.4"/>
      {/* Vertex labels */}
      <text x={Av.x-14} y={Av.y+5}  fontSize="12" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={Bv.x+3}  y={Bv.y+13} fontSize="12" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={Cv.x+4}  y={Cv.y+5}  fontSize="12" fill="#93c5fd" fontWeight="bold">C</text>
      {/* Side labels */}
      <text x={(Av.x+Bv.x)/2} y={Av.y+14} textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="bold">AB=6</text>
      <text x={Cv.x+4}        y={(Bv.y+Cv.y)/2+4} fontSize="10" fill="#4ade80" fontWeight="bold">BC=8</text>
      <text x={(Av.x+Cv.x)/2-22} y={(Av.y+Cv.y)/2} fontSize="10" fill="#fde68a" fontWeight="bold">CA=10</text>

      {/* ~ symbol between triangles */}
      <text x="136" y={base-10} textAnchor="middle" fontSize="16" fill="#facc15">~</text>

      {/* ── Triangle PQR ── */}
      <polygon points={`${Pv.x},${Pv.y} ${Qv.x},${Qv.y} ${Rv.x},${Rv.y}`}
        fill="#22c55e" fillOpacity="0.15" stroke="#4ade80" strokeWidth="2"/>
      {/* Right-angle mark at Q */}
      <path d={`M ${Qv.x},${Qv.y-sq} L ${Qv.x-sq},${Qv.y-sq} L ${Qv.x-sq},${Qv.y}`}
        fill="none" stroke="#ffffff" strokeWidth="1.4"/>
      {/* Vertex labels */}
      <text x={Pv.x-14} y={Pv.y+5}  fontSize="12" fill="#86efac" fontWeight="bold">P</text>
      <text x={Qv.x+3}  y={Qv.y+13} fontSize="12" fill="#86efac" fontWeight="bold">Q</text>
      <text x={Rv.x+4}  y={Rv.y+5}  fontSize="12" fill="#86efac" fontWeight="bold">R</text>
      {/* Side labels */}
      <text x={(Pv.x+Qv.x)/2} y={Pv.y+14} textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="bold">PQ=9</text>
      <text x={(Pv.x+Rv.x)/2-24} y={(Pv.y+Rv.y)/2} fontSize="10" fill="#ef4444" fontWeight="bold">PR = ?</text>
    </svg>
  );
};

const SoalQ7 = () => {
  // A moved right; F recalculated on line E-A at y=122; B adjusted so BC ∥ ED.
  // E(58,22), A(100,222) → F at y=122: x=58+(100/200)*(100-58)=79 → F=(79,122)
  // BC slope = ED slope = 100/194 → B.x = C.x + 194 = 18+194 = 212 → B=(212,222)
  // Parallel arrow direction (upper-left): unit ≈ (-0.888, -0.459)
  const E={x:58,y:22};
  const C={x:18,y:122}, F={x:79,y:122}, D={x:252,y:122};
  const A={x:100,y:222}, B={x:212,y:222};

  // Arrowhead helper: tip pointing in direction (ux,uy) at point (mx,my)
  const arrowPts = (mx:number, my:number, ux:number, uy:number) => {
    const px=-uy, py=ux; // perpendicular
    const s=7, t=5;
    const tip  = [mx+s*ux,       my+s*uy      ];
    const left = [mx-t*ux+t*px,  my-t*uy+t*py ];
    const rigt = [mx-t*ux-t*px,  my-t*uy-t*py ];
    return tip.map(Math.round).join(',')+" "+left.map(Math.round).join(',')+" "+rigt.map(Math.round).join(',');
  };
  // Upper-left unit vector (same for BC and ED since parallel): (-0.888,-0.459)
  const ux=-0.888, uy=-0.459;
  const midBC={x:Math.round((B.x+C.x)/2), y:Math.round((B.y+C.y)/2)}; // (115,172)
  const midED={x:Math.round((E.x+D.x)/2), y:Math.round((E.y+D.y)/2)}; // (155,72)

  return (
    <svg viewBox="0 0 318 248" className="w-full max-w-xs mx-auto">
      {/* Line E → F → A (E, F, A collinear — replaces old E-F-B) */}
      <line x1={E.x} y1={E.y} x2={A.x} y2={A.y} stroke="#60a5fa" strokeWidth="2"/>
      {/* Line E → D */}
      <line x1={E.x} y1={E.y} x2={D.x} y2={D.y} stroke="#a78bfa" strokeWidth="2"/>
      {/* Horizontal C — F — D */}
      <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke="#4ade80" strokeWidth="2"/>
      {/* Right-arrow on C-F-D (parallel indicator) */}
      <polygon points="130,119 141,122 130,125" fill="#4ade80"/>
      {/* Bottom horizontal A — B */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#4ade80" strokeWidth="2"/>
      {/* Right-arrow on A-B (parallel indicator) */}
      <polygon points="150,219 161,222 150,225" fill="#4ade80"/>
      {/* Line C → B (orange diagonal, BC ∥ ED) */}
      <line x1={C.x} y1={C.y} x2={B.x} y2={B.y} stroke="#f97316" strokeWidth="2"/>
      {/* Parallel arrows on BC and ED pointing upper-left */}
      <polygon points={arrowPts(midBC.x, midBC.y, ux, uy)} fill="#fde68a"/>
      <polygon points={arrowPts(midED.x, midED.y, ux, uy)} fill="#fde68a"/>
      {/* Dots */}
      <circle cx={E.x} cy={E.y} r="3.5" fill="#93c5fd"/>
      <circle cx={F.x} cy={F.y} r="3.5" fill="#fbbf24"/>
      <circle cx={D.x} cy={D.y} r="3.5" fill="#a78bfa"/>
      <circle cx={C.x} cy={C.y} r="3.5" fill="#4ade80"/>
      <circle cx={A.x} cy={A.y} r="3.5" fill="#93c5fd"/>
      <circle cx={B.x} cy={B.y} r="3.5" fill="#93c5fd"/>
      {/* Labels */}
      <text x={E.x-16} y={E.y+5}  fontSize="13" fill="#93c5fd" fontWeight="bold">E</text>
      <text x={F.x+5}  y={F.y-5}  fontSize="12" fill="#fde68a" fontWeight="bold">F</text>
      <text x={D.x+5}  y={D.y+5}  fontSize="13" fill="#a78bfa" fontWeight="bold">D</text>
      <text x={C.x-16} y={C.y+5}  fontSize="13" fill="#4ade80" fontWeight="bold">C</text>
      <text x={A.x-16} y={A.y+5}  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+4}  y={B.y+5}  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      {/* CF = ? above segment C–F */}
      <text x={Math.round((C.x+F.x)/2)} y={C.y-6} textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">CF = ?</text>
      {/* BC = 15 on C→B diagonal (shifted far right & down from arrow to avoid collision) */}
      <text x={midBC.x+22} y={midBC.y+18} fontSize="9" fill="#f97316" fontWeight="bold">BC=15</text>
      {/* AB = 11 on bottom */}
      <text x={Math.round((A.x+B.x)/2)} y={A.y+16} textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="bold">AB = 11 cm</text>
      {/* Note */}
      <text x="159" y="10" textAnchor="middle" fontSize="8" fill="#94a3b8">Garis mendatar sejajar</text>
    </svg>
  );
};

const SoalQ8 = () => {
  // A moved left, D moved right vs previous version; GD line removed; measurement labels removed
  const A={x:20, y:210};
  const B={x:250,y:210};
  const D={x:95, y:115};
  const F={x:250,y:115};
  // G: GF // BD; BD dir (B→D): (-155,-95); G = F + (-155,-95)*(6/16) ≈ (192, 79)
  const G={x:192,y:79};
  // E: line AG meets DF (y=115) ≈ x=145
  const E={x:145,y:115};
  // C: intersection of line AG and line BD ≈ (123, 132)
  const C={x:123,y:132};

  const arrowRight = (x:number, y:number) =>
    `${x-6},${y-3} ${x+7},${y} ${x-6},${y+3}`;

  const arrowDiag = (mx:number,my:number,ux:number,uy:number) => {
    const px=-uy, py=ux;
    const s=7, t=5;
    const tip  = [mx+s*ux, my+s*uy];
    const left = [mx-t*ux+t*px, my-t*uy+t*py];
    const rigt = [mx-t*ux-t*px, my-t*uy-t*py];
    return [...tip,...left,...rigt].map(v=>Math.round(v))
      .reduce((a,v,i)=>i%2===0?a+v+',':a+v+' ','').trim();
  };
  // BD unit (B→D): (-155,-95), mag≈181.8 → (-0.853,-0.523)
  const ux=-0.853, uy=-0.523;
  const bdAx=Math.round(B.x+0.45*(D.x-B.x)), bdAy=Math.round(B.y+0.45*(D.y-B.y));
  const gfAx=Math.round((G.x+F.x)/2), gfAy=Math.round((G.y+F.y)/2);

  return (
    <svg viewBox="0 0 300 235" className="w-full max-w-xs mx-auto">
      {/* All lines same color #60a5fa */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#60a5fa" strokeWidth="2"/>
      <line x1={D.x} y1={D.y} x2={F.x} y2={F.y} stroke="#60a5fa" strokeWidth="2"/>
      <line x1={G.x} y1={G.y} x2={F.x} y2={F.y} stroke="#60a5fa" strokeWidth="2"/>
      <line x1={A.x} y1={A.y} x2={G.x} y2={G.y} stroke="#60a5fa" strokeWidth="2"/>
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#60a5fa" strokeWidth="2"/>

      {/* Parallel indicator on AB — single arrow */}
      <polygon points={arrowRight(138,210)} fill="#fde68a"/>
      {/* Parallel indicator on DF — single arrow */}
      <polygon points={arrowRight(178,115)} fill="#fde68a"/>
      {/* Parallel arrows on BD and GF — same color */}
      <polygon points={arrowDiag(bdAx,bdAy,ux,uy)} fill="#fde68a"/>
      <polygon points={arrowDiag(gfAx,gfAy,ux,uy)} fill="#fde68a"/>

      {/* Dots — all same color */}
      <circle cx={A.x} cy={A.y} r="3.5" fill="#e2e8f0"/>
      <circle cx={B.x} cy={B.y} r="3.5" fill="#e2e8f0"/>
      <circle cx={D.x} cy={D.y} r="3.5" fill="#e2e8f0"/>
      <circle cx={F.x} cy={F.y} r="3.5" fill="#e2e8f0"/>
      <circle cx={G.x} cy={G.y} r="3.5" fill="#e2e8f0"/>
      <circle cx={E.x} cy={E.y} r="3"   fill="#e2e8f0"/>
      <circle cx={C.x} cy={C.y} r="3.5" fill="#e2e8f0"/>

      {/* Point labels — all same color */}
      <text x={A.x-16} y={A.y+5}  fontSize="13" fill="#e2e8f0" fontWeight="bold">A</text>
      <text x={B.x+4}  y={B.y+5}  fontSize="13" fill="#e2e8f0" fontWeight="bold">B</text>
      <text x={D.x-5}  y={D.y-8}  fontSize="13" fill="#e2e8f0" fontWeight="bold">D</text>
      <text x={F.x+4}  y={F.y+5}  fontSize="13" fill="#e2e8f0" fontWeight="bold">F</text>
      <text x={G.x+4}  y={G.y-4}  fontSize="13" fill="#e2e8f0" fontWeight="bold">G</text>
      <text x={E.x+4}  y={E.y-6}  fontSize="11" fill="#e2e8f0" fontWeight="bold">E</text>
      <text x={C.x-18} y={C.y+5}  fontSize="13" fill="#e2e8f0" fontWeight="bold">C</text>
    </svg>
  );
};

const SoalQ9 = () => {
  // DC = 15 cm, AB = 9 cm → ratio 9:15 = 3:5
  // Keep DC full-width centered at x=150; scale AB proportionally
  const D={x:58, y:162}, C={x:242,y:162}; // DC width = 184 px (= 15 cm)
  // AB width = 184 * (9/15) = 110.4 px, centered at x=150
  const A={x:95, y:38},  B={x:205,y:38};
  // E = intersection of diagonals AC and BD
  // Line AC param: x=95+147t, y=38+124t; Line BD: x=205-147t, y=38+124t → t=110/294≈0.374
  const E={x:150, y:84};
  return (
    <svg viewBox="0 0 310 200" className="w-full max-w-xs mx-auto">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${E.x},${E.y}`} fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="2"/>
      <polygon points={`${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="#22c55e" fillOpacity="0.15" stroke="#4ade80" strokeWidth="2"/>
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <circle cx={E.x} cy={E.y} r="3.5" fill="#fbbf24"/>
      <text x={A.x-14} y={A.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+3}  y={B.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C.x+3}  y={C.y+14} fontSize="13" fill="#4ade80" fontWeight="bold">C</text>
      <text x={D.x-14} y={D.y+14} fontSize="13" fill="#4ade80" fontWeight="bold">D</text>
      <text x={E.x+5}  y={E.y+5}  fontSize="12" fill="#fde68a" fontWeight="bold">E</text>
      <text x={(A.x+B.x)/2} y={A.y-8} textAnchor="middle" fontSize="11" fill="#f97316" fontWeight="bold">AB = 9 cm</text>
      <text x={(C.x+D.x)/2} y={C.y+18} textAnchor="middle" fontSize="11" fill="#4ade80" fontWeight="bold">DC = 15 cm</text>
    </svg>
  );
};

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const Q1TriSTSVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,115 300,115" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="104" y1="55" x2="216" y2="55" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="6" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="302" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="88" y="53" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="219" y="53" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">T</text>
    <text x="78" y="32" fill="#c084fc" fontSize="10" fontWeight="bold">RS = 4 cm</text>
    <text x="10" y="82" fill="#c084fc" fontSize="10" fontWeight="bold">SP = 6 cm</text>
    <text x="143" y="131" fill="#fbbf24" fontSize="10" fontWeight="bold">PQ = 20 cm</text>
    <text x="136" y="49" fill="#fb923c" fontSize="11" fontWeight="bold">ST = ?</text>
  </svg>
);

const Q2TriDESVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,120 300,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="113" y1="50" x2="207" y2="50" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="6" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="302" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="96" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="210" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="102" y="28" fill="#c084fc" fontSize="10" fontWeight="bold">AD = 5 cm</text>
    <text x="10" y="80" fill="#c084fc" fontSize="10" fontWeight="bold">DB = 10 cm</text>
    <text x="136" y="44" fill="#fbbf24" fontSize="10" fontWeight="bold">DE = 7 cm</text>
    <text x="143" y="134" fill="#fb923c" fontSize="11" fontWeight="bold">BC = ?</text>
  </svg>
);

const Q3CrossLinesSVG = () => (
  <svg viewBox="0 0 270 160" width="265" height="155" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="136,21 215,10 170,55" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="1.2"/>
    <polygon points="221,106 170,55 102,123" fill="rgba(124,58,237,0.12)" stroke="#7c3aed" strokeWidth="1.2"/>
    <line x1="136" y1="21" x2="221" y2="106" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="215" y1="10" x2="102" y2="123" stroke="#7c3aed" strokeWidth="1.5"/>
    <line x1="136" y1="21" x2="215" y2="10" stroke="#c084fc" strokeWidth="1.3"/>
    <line x1="221" y1="106" x2="102" y2="123" stroke="#c084fc" strokeWidth="1.3"/>
    <text x="122" y="18" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="218" y="8" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="173" y="68" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">O</text>
    <text x="225" y="112" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="88" y="128" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="98" y="38" fill="#c084fc" fontSize="10" fontWeight="bold">OA = 6 cm</text>
    <text x="198" y="28" fill="#fbbf24" fontSize="10" fontWeight="bold">OB = x</text>
    <text x="215" y="86" fill="#c084fc" fontSize="10" fontWeight="bold">OC = 9 cm</text>
    <text x="58" y="98" fill="#c084fc" fontSize="10" fontWeight="bold">OD = 12 cm</text>
  </svg>
);

const Q4TriRTSVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,120 300,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="113" y1="50" x2="207" y2="50" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="6" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="302" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="96" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="210" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">T</text>
    <text x="103" y="28" fill="#c084fc" fontSize="10" fontWeight="bold">PR = 5 cm</text>
    <text x="10" y="80" fill="#c084fc" fontSize="10" fontWeight="bold">RQ = 10 cm</text>
    <text x="136" y="44" fill="#fb923c" fontSize="10" fontWeight="bold">RT = ?</text>
    <text x="140" y="134" fill="#fbbf24" fontSize="10" fontWeight="bold">QS = 21 cm</text>
  </svg>
);

const Q6TriDE2SVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,115 300,115" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="104" y1="57" x2="216" y2="57" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="6" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="302" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="87" y="55" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="219" y="55" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="85" y="33" fill="#c084fc" fontSize="10" fontWeight="bold">AD = 16 cm</text>
    <text x="10" y="85" fill="#c084fc" fontSize="10" fontWeight="bold">DB = 24 cm</text>
    <text x="133" y="51" fill="#fbbf24" fontSize="10" fontWeight="bold">DE = 18 cm</text>
    <text x="143" y="130" fill="#fb923c" fontSize="11" fontWeight="bold">BC = ?</text>
  </svg>
);

const Q7MedianESVG = () => (
  <svg viewBox="0 0 270 185" width="265" height="180" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="50,90 230,90 95,20" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="95" y1="20" x2="140" y2="90" stroke="#c084fc" strokeWidth="1.5"/>
    <line x1="140" y1="90" x2="185" y2="160" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="230" y1="90" x2="185" y2="160" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="112" y1="59" x2="118" y2="51" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="157" y1="129" x2="163" y2="121" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="36" y="94" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="232" y="94" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="86" y="15" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="132" y="106" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="182" y="173" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="22" y="56" fill="#c084fc" fontSize="10" fontWeight="bold">AC = 10 cm</text>
    <text x="88" y="107" fill="#fbbf24" fontSize="9" fontWeight="bold">AD=DB=8cm</text>
    <text x="192" y="128" fill="#fb923c" fontSize="10" fontWeight="bold">BE = ?</text>
    <text x="108" y="43" fill="#fbbf24" fontSize="9">CD=DE</text>
  </svg>
);

const Q10TrapSVG = () => (
  <svg viewBox="0 0 265 140" width="258" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="60,20 200,20 240,120 20,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="36" y1="80" x2="224" y2="80" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="48" y="16" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="202" y="16" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="242" y="125" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="5" y="125" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="22" y="78" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="228" y="78" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">F</text>
    <text x="105" y="14" fill="#fbbf24" fontSize="10" fontWeight="bold">PQ = 8 cm</text>
    <text x="105" y="135" fill="#fbbf24" fontSize="10" fontWeight="bold">RS = 18 cm</text>
    <text x="108" y="74" fill="#fb923c" fontSize="11" fontWeight="bold">EF = ?</text>
    <text x="220" y="48" fill="#c084fc" fontSize="10" fontWeight="bold">QF=3cm</text>
    <text x="230" y="102" fill="#c084fc" fontSize="10" fontWeight="bold">FS=2cm</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Trapesium – Diagonal Berpotongan – Cari CE", {
    type: "mixed",
    content: "Perhatikan gambar trapesium ABCD berikut. Diagonal AC dan BD berpotongan di titik E. Jika AB = 8 cm, DC = 12 cm, dan AE = 4 cm, maka panjang CE adalah…",
    diagram: <SoalQ1 />,
    parts: [
      { label: "A.", text: "4 cm" },
      { label: "B.", text: "6 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "10 cm" },
    ],
  }),
  Qn(2, "Garis Sejajar dalam Segitiga – Cari AD dan AE", {
    type: "mixed",
    content: "Perhatikan gambar segitiga besar ABC dengan garis DE sejajar BC (DE ∥ BC). Diketahui DB = 4 cm, EC = 3 cm, DE = 8 cm, dan BC = 12 cm. Tentukan nilai c = AD dan d = AE!",
    diagram: <SoalQ2 />,
  }),
  Qn(3, "Trapesium – Garis Sejajar – Cari EF", {
    type: "mixed",
    content: "Perhatikan trapesium ABCD dengan AB ∥ EF ∥ DC. Titik E berada di sisi AD dan F berada di sisi BC sehingga AE : ED = 2 : 3. Jika AB = 5 cm dan DC = 20 cm, maka panjang EF adalah…",
    diagram: <SoalQ3 />,
    parts: [
      { label: "A.", text: "7,5 cm" },
      { label: "B.", text: "11 cm" },
      { label: "C.", text: "12,5 cm" },
      { label: "D.", text: "13 cm" },
    ],
  }),
  Qn(4, "Lebar Sungai – Aplikasi Segitiga Sebangun", {
    type: "mixed",
    content: "Untuk mengukur lebar sungai, seorang siswa menancapkan tongkat di titik B, C, D, dan E di tepi sungai. Titik A adalah benda di seberang sungai. Diketahui bahwa D, C, A segaris, BC = 12 m, CE = 4 m, dan DE = 3 m. Lebar sungai AB adalah…",
    diagram: <SoalQ4 />,
    parts: [
      { label: "A.", text: "16 m" },
      { label: "B.", text: "15 m" },
      { label: "C.", text: "9 m" },
      { label: "D.", text: "7 m" },
    ],
  }),
  Qn(5, "Dua Segitiga Bertolak Belakang – Cari AB", {
    type: "mixed",
    content: "Perhatikan gambar dua segitiga yang bertolak belakang di titik E. Diketahui AE = 3 cm, CE = 5 cm, dan CD = 15 cm. Panjang AB adalah…",
    diagram: <SoalQ5 />,
    parts: [
      { label: "A.", text: "8 cm" },
      { label: "B.", text: "9 cm" },
      { label: "C.", text: "12 cm" },
      { label: "D.", text: "15 cm" },
    ],
  }),
  Qn(6, "Dua Segitiga Sebangun – Cari PR", {
    type: "mixed",
    content: "Diketahui △ABC ~ △PQR. Jika AB = 6 cm, BC = 8 cm, CA = 10 cm, dan PQ = 9 cm, maka panjang PR adalah…",
    diagram: <SoalQ6 />,
    parts: [
      { label: "A.", text: "12 cm" },
      { label: "B.", text: "15 cm" },
      { label: "C.", text: "18 cm" },
      { label: "D.", text: "20 cm" },
    ],
  }),
  Qn(7, "Garis-Garis Sejajar – Cari CF", {
    type: "mixed",
    content: "Perhatikan gambar berikut. Jika panjang BC = CD = DE = 15 cm dan AB = 11 cm, panjang CF adalah…",
    diagram: <SoalQ7 />,
    parts: [
      { label: "A.", text: "2 cm" },
      { label: "B.", text: "8 cm" },
      { label: "C.", text: "12 cm" },
      { label: "D.", text: "13 cm" },
    ],
  }),
  Qn(8, "Garis Sejajar Bersilang – Cari BC", {
    type: "mixed",
    content: "Perhatikan gambar berikut. Diketahui AB // DF, BD // GF, dan AB = BD = DF = 16 cm. Jika FG = 6 cm, maka panjang BC adalah…",
    diagram: <SoalQ8 />,
    parts: [
      { label: "A.", text: "8 cm" },
      { label: "B.", text: "9 cm" },
      { label: "C.", text: "10 cm" },
      { label: "D.", text: "11 cm" },
    ],
  }),
  Qn(9, "Konfigurasi Kupu-Kupu – Cari AE", {
    type: "mixed",
    content: "Perhatikan gambar dua segitiga yang bertolak belakang di titik E (konfigurasi kupu-kupu). Diketahui AB = 9 cm, DC = 15 cm, dan AC = 20 cm. Panjang AE adalah…",
    diagram: <SoalQ9 />,
    parts: [
      { label: "A.", text: "5,0 cm" },
      { label: "B.", text: "7,5 cm" },
      { label: "C.", text: "8,0 cm" },
      { label: "D.", text: "10,0 cm" },
    ],
  }),
  Qn(10, "Segitiga Sebangun – Cari ST – UN", {
    type: "mixed",
    content: "Dengan memperhatikan gambar di bawah, panjang ST adalah ....",
    diagram: <Q1TriSTSVG />,
    parts: [
      { label: "A.", text: "6 cm" },
      { label: "B.", text: "7 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "10 cm" },
    ],
  }),
  Qn(11, "Dua Segitiga Berpotongan – Nilai x – UN", {
    type: "mixed",
    content: "Pada gambar di bawah ini, AB // CD. Nilai OB adalah ....",
    diagram: <Q3CrossLinesSVG />,
    parts: [
      { label: "A.", text: "6 cm" },
      { label: "B.", text: "7 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "10 cm" },
    ],
  }),
  Qn(12, "Median Diperpanjang – Cari BE – ANBK", {
    type: "mixed",
    content: "Garis tengah (median) CD dari △ABC, dengan D titik tengah AB, diperpanjang hingga DE = CD. Jika AC = 10 cm dan AD = DB = 8 cm, maka panjang BE adalah ....",
    diagram: <Q7MedianESVG />,
    parts: [
      { label: "A.", text: "8 cm" },
      { label: "B.", text: "9 cm" },
      { label: "C.", text: "10 cm" },
      { label: "D.", text: "12 cm" },
    ],
  }),
  Qn(13, "Segitiga Sama Kaki – Perbandingan Sisi – ANBK", {
    type: "mixed",
    content: "Diketahui △PQR adalah segitiga sama kaki dengan PQ = PR. Titik M pada PQ dan titik N pada PR sedemikian sehingga MN // QR. Jika PQ : PM = 4 : 3, maka PR : PN adalah ....",
    parts: [
      { label: "A.", math: "4 : 3" },
      { label: "B.", math: "3 : 4" },
      { label: "C.", math: "3 : 2" },
      { label: "D.", math: "2 : 3" },
    ],
  }),
  Qn(14, "Garis Sejajar – Perbandingan AQ : QC – TKA", {
    type: "mixed",
    content: "Diketahui △ABC. Titik P pada AB dan titik Q pada AC sedemikian sehingga PQ // BC. Jika panjang AP = 6 cm dan AB = 10 cm, maka AQ : QC adalah ....",
    parts: [
      { label: "A.", math: "2 : 3" },
      { label: "B.", math: "3 : 2" },
      { label: "C.", math: "3 : 5" },
      { label: "D.", math: "5 : 3" },
    ],
  }),
  Qn(15, "Trapesium – Cari EF – TKA", {
    type: "mixed",
    content: "Jika panjang PQ = 8 cm, RS = 18 cm, QF = 3 cm, dan FS = 2 cm, maka panjang EF adalah ....",
    diagram: <Q10TrapSVG />,
    parts: [
      { label: "A.", text: "10 cm" },
      { label: "B.", text: "11 cm" },
      { label: "C.", text: "12 cm" },
      { label: "D.", text: "14 cm" },
    ],
  }),
];

const SegitigaSebangunPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Triangle className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            SEGITIGA-SEGITIGA YANG SEBANGUN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 15 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Tiga Syarat Kesebangunan Segitiga</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { name: "AA", desc: "Dua pasang sudut sama besar" },
              { name: "SAS", desc: "Dua sisi sebanding & sudut apitnya sama" },
              { name: "SSS", desc: "Tiga pasang sisi sebanding" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <p className="text-violet-300 font-bold text-sm mb-1">{r.name}</p>
                <p className="text-white/50 text-[9px]">{r.desc}</p>
              </div>
            ))}
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
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-violet-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
                            <div className="flex-1">
                              {p.text && <p className="font-body text-sm text-white/80 leading-relaxed">{p.text}</p>}
                              {p.math && <div className="text-white/80 text-sm mt-0.5"><InlineMath math={p.math} /></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.math && !q.parts && <div className="mt-2 bg-white/5 rounded-lg px-3 py-2"><BlockMath math={q.math} /></div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/kesebangunan-kekongruenan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan & Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SegitigaSebangunPage;
