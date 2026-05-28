import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiagramSegitigaSebangun = () => (
  <svg viewBox="0 0 340 175" className="w-full max-w-sm mx-auto">
    {/* Triangle 1 */}
    <polygon points="20,150 120,150 70,60" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2" />
    <text x="70" y="167" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="bold">△ABC</text>
    <text x="9"  y="151" fontSize="8" fill="#93c5fd">A</text>
    <text x="122" y="151" fontSize="8" fill="#93c5fd">B</text>
    <text x="66"  y="56"  fontSize="8" fill="#93c5fd">C</text>
    {/* Arcs triangle 1 — proper SVG arcs */}
    <path d="M 30 150 A 10 10 0 0 1 24.9 141.3" fill="none" stroke="#f97316" strokeWidth="1.5"/>
    <path d="M 110 150 A 10 10 0 0 0 115.2 141.3" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M 65.2 68.7 A 10 10 0 0 1 74.9 68.7" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
    {/* Triangle 2 */}
    <polygon points="165,155 305,155 235,35" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="2" />
    <text x="235" y="170" textAnchor="middle" fontSize="9" fill="#86efac" fontWeight="bold">△PQR</text>
    <text x="155" y="156" fontSize="8" fill="#86efac">P</text>
    <text x="307" y="156" fontSize="8" fill="#86efac">Q</text>
    <text x="231" y="30"  fontSize="8" fill="#86efac">R</text>
    {/* Arcs triangle 2 — proper SVG arcs */}
    <path d="M 179 155 A 14 14 0 0 1 172.0 142.9" fill="none" stroke="#f97316" strokeWidth="1.5"/>
    <path d="M 291 155 A 14 14 0 0 0 298.0 142.9" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M 228.0 47.1 A 14 14 0 0 1 242.0 47.1" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
    {/* Tilde */}
    <text x="135" y="105" fontSize="16" fill="#facc15">~</text>
    {/* Labels */}
    <text x="170" y="15" fontSize="9" fill="#fde68a" fontWeight="bold">Sudut bersesuaian sama besar</text>
    <text x="30"  y="141" fontSize="7" fill="#f97316">Sd A</text>
    <text x="98"  y="141" fontSize="7" fill="#22c55e">Sd B</text>
    <text x="58"  y="81"  fontSize="7" fill="#a855f7">Sd C</text>
    <text x="176" y="145" fontSize="7" fill="#f97316">Sd P</text>
    <text x="280" y="145" fontSize="7" fill="#22c55e">Sd Q</text>
    <text x="228" y="64"  fontSize="7" fill="#a855f7">Sd R</text>
  </svg>
);

const DiagramGarisSejajar = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-lg mx-auto">
    {/* Main triangle */}
    <polygon points="150,22 28,192 272,192" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
    <text x="150" y="14" textAnchor="middle" fontSize="14" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="14"  y="207" fontSize="14" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="275" y="207" fontSize="14" fill="#93c5fd" fontWeight="bold">C</text>
    {/* Parallel line XY */}
    <line x1="82" y1="122" x2="216" y2="122" stroke="#facc15" strokeWidth="2.5" />
    <text x="64"  y="127" fontSize="13" fill="#fde68a" fontWeight="bold">X</text>
    <text x="220" y="127" fontSize="13" fill="#fde68a" fontWeight="bold">Y</text>
    {/* Parallel markers — XY (1 tick) */}
    <line x1="145" y1="116" x2="145" y2="128" stroke="#facc15" strokeWidth="2" />
    {/* Parallel markers — BC (2 ticks) */}
    <line x1="143" y1="185" x2="143" y2="199" stroke="#facc15" strokeWidth="2" />
    <line x1="152" y1="185" x2="152" y2="199" stroke="#facc15" strokeWidth="2" />
    {/* Labels on sides */}
    <text x="94"  y="76"  fontSize="12" fill="#c084fc" fontWeight="bold">AX</text>
    <text x="188" y="76"  fontSize="12" fill="#4ade80" fontWeight="bold">AY</text>
    <text x="40"  y="160" fontSize="12" fill="#c084fc" fontWeight="bold">XB</text>
    <text x="240" y="160" fontSize="12" fill="#4ade80" fontWeight="bold">YC</text>
    {/* Proportional label box */}
    <rect x="48" y="4" width="204" height="18" rx="4" fill="#1e293b" />
    <text x="150" y="17" textAnchor="middle" fontSize="10.5" fill="#fde68a" fontWeight="bold">XY // BC  →  AX/XB = AY/YC</text>
    {/* Dotted triangle △AXY */}
    <polygon points="150,22 82,122 216,122" fill="#facc15" fillOpacity="0.10" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3" />
  </svg>
);

const DiagramContoh1 = () => (
  /* Right triangle: A=(305,15) top-right, B=(15,205) bottom-left, C=(305,205) bottom-right (right angle).
     AC vertical (right side) divided 6:4:2.  AB hypotenuse (left side) divided a:8:b.
     t1=5/12 → F1=(184,94), E1=(305,94)
     t2=10/12 → F2=(63,173), E2=(305,173)
     Base: B→foot(63,205)=c, foot→C=20  */
  <svg viewBox="0 0 340 240" className="w-full max-w-lg mx-auto">
    {/* Main right triangle */}
    <polygon points="305,15 15,205 305,205" fill="#3b82f6" fillOpacity="0.12" stroke="#60a5fa" strokeWidth="2.5"/>
    {/* Right-angle mark at C */}
    <polyline points="295,205 295,195 305,195" fill="none" stroke="#60a5fa" strokeWidth="1.8"/>

    {/* First parallel line F1(184,94)→E1(305,94) */}
    <line x1="184" y1="94" x2="305" y2="94" stroke="#4ade80" strokeWidth="2.2"/>
    {/* Second parallel line F2(63,173)→E2(305,173) */}
    <line x1="63" y1="173" x2="305" y2="173" stroke="#4ade80" strokeWidth="2.2"/>

    {/* Parallel chevron arrows — first line */}
    <path d="M 237,91 L 242,94 L 237,97" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M 244,91 L 249,94 L 244,97" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round"/>
    {/* Parallel chevron arrows — second line */}
    <path d="M 177,170 L 182,173 L 177,176" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M 184,170 L 189,173 L 184,176" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round"/>

    {/* Dashed drop-line from F2 to base (shows c/20 division) */}
    <line x1="63" y1="173" x2="63" y2="205" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,3"/>

    {/* Left-side (hypotenuse AB) segment labels */}
    <text x="252" y="46"  fontSize="13" fill="#f97316" fontWeight="bold" textAnchor="middle">a</text>
    <text x="110" y="132" fontSize="13" fill="#f97316" fontWeight="bold" textAnchor="middle">8</text>
    <text x="26"  y="194" fontSize="13" fill="#f97316" fontWeight="bold">b</text>

    {/* Right-side (AC vertical) segment labels */}
    <text x="313" y="58"  fontSize="13" fill="#60a5fa" fontWeight="bold">6</text>
    <text x="313" y="137" fontSize="13" fill="#60a5fa" fontWeight="bold">4</text>
    <text x="313" y="192" fontSize="13" fill="#60a5fa" fontWeight="bold">2</text>

    {/* Chevron arrow on vertical side AC — at E1(305,94) pointing downward */}
    <path d="M 302,90 L 305,96 L 308,90" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round"/>

    {/* Chevron arrow on dashed vertical line near C — at (63,189) pointing downward */}
    <path d="M 60,186 L 63,192 L 66,186" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round"/>

    {/* Base dimension lines */}
    <line x1="15"  y1="212" x2="15"  y2="222" stroke="#64748b" strokeWidth="1.2"/>
    <line x1="63"  y1="212" x2="63"  y2="222" stroke="#64748b" strokeWidth="1.2"/>
    <line x1="305" y1="212" x2="305" y2="222" stroke="#64748b" strokeWidth="1.2"/>
    <line x1="15"  y1="217" x2="63"  y2="217" stroke="#64748b" strokeWidth="1.2"/>
    <line x1="63"  y1="217" x2="305" y2="217" stroke="#64748b" strokeWidth="1.2"/>
    {/* Base labels */}
    <text x="39"  y="232" textAnchor="middle" fontSize="13" fill="#c084fc" fontWeight="bold">c</text>
    <text x="184" y="232" textAnchor="middle" fontSize="13" fill="#fde68a" fontWeight="bold">20</text>
  </svg>
);

const DiagramContoh2 = () => {
  const A = { x: 150, y: 18 }, B = { x: 25, y: 165 }, C = { x: 275, y: 165 };
  const P = { x: 100, y: 76 };
  const Q = { x: 200, y: 76 };
  return (
    <svg viewBox="0 0 310 190" className="w-full max-w-sm mx-auto">
      {/* △APQ shaded */}
      <polygon points={`${A.x},${A.y} ${P.x},${P.y} ${Q.x},${Q.y}`} fill="#facc15" fillOpacity="0.14" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
      {/* △ABC */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#3b82f6" fillOpacity="0.18" stroke="#60a5fa" strokeWidth="2.5"/>
      {/* PQ parallel line */}
      <line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} stroke="#facc15" strokeWidth="2.5"/>
      {/* Parallel tick marks on PQ (1 tick) */}
      <line x1="147" y1="70" x2="151" y2="82" stroke="#facc15" strokeWidth="2"/>
      {/* Parallel tick marks on BC (2 ticks) */}
      <line x1="143" y1="158" x2="147" y2="172" stroke="#facc15" strokeWidth="2"/>
      <line x1="153" y1="158" x2="157" y2="172" stroke="#facc15" strokeWidth="2"/>
      {/* Vertex labels */}
      <text x="146" y="10"  fontSize="13" fill="#93c5fd" fontWeight="bold" textAnchor="middle">A</text>
      <text x="10"  y="178" fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x="279" y="178" fontSize="13" fill="#93c5fd" fontWeight="bold">C</text>
      <text x="83"  y="76"  fontSize="12" fill="#fde68a" fontWeight="bold">P</text>
      <text x="205" y="76"  fontSize="12" fill="#fde68a" fontWeight="bold">Q</text>
      {/* Side labels */}
      <text x="103" y="43"  fontSize="11" fill="#f97316" fontWeight="bold">AP=4</text>
      <text x="47"  y="127" fontSize="11" fill="#fb923c" fontWeight="bold">PB=6</text>
      <text x="175" y="43"  fontSize="11" fill="#4ade80"  fontWeight="bold">AQ</text>
      <text x="232" y="127" fontSize="11" fill="#86efac"  fontWeight="bold">QC</text>
      <text x="150" y="70"  fontSize="11" fill="#fde68a"  fontWeight="bold" textAnchor="middle">PQ=6</text>
      <text x="150" y="183" fontSize="11" fill="#93c5fd"  textAnchor="middle">BC = 15</text>
      {/* Similar label top-right */}
      <text x="268" y="42"  fontSize="11" fill="#fde68a" fontWeight="bold" textAnchor="middle">△APQ</text>
      <text x="268" y="56"  fontSize="11" fill="#fde68a" fontWeight="bold" textAnchor="middle">~△ABC</text>
    </svg>
  );
};

const DiagramContoh3 = () => {
  const A = { x: 150, y: 18 }, B = { x: 25, y: 172 }, C = { x: 275, y: 172 };
  const D = { x: 118, y: 55 }; // AD:AB = 3:12 = 1/4
  const E = { x: 182, y: 55 }; // AE:AC = 4:16 = 1/4
  return (
    <svg viewBox="0 0 310 195" className="w-full max-w-sm mx-auto">
      {/* △ADE shaded */}
      <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="#facc15" fillOpacity="0.14" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
      {/* △ABC */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#3b82f6" fillOpacity="0.18" stroke="#60a5fa" strokeWidth="2.5"/>
      {/* DE parallel line */}
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#facc15" strokeWidth="2.5"/>
      {/* Parallel tick on DE (1 tick) */}
      <line x1="147" y1="49" x2="151" y2="61" stroke="#facc15" strokeWidth="2"/>
      {/* Parallel ticks on BC (2 ticks) */}
      <line x1="143" y1="165" x2="147" y2="179" stroke="#facc15" strokeWidth="2"/>
      <line x1="153" y1="165" x2="157" y2="179" stroke="#facc15" strokeWidth="2"/>
      {/* Vertex labels */}
      <text x="146" y="10"  fontSize="13" fill="#93c5fd" fontWeight="bold" textAnchor="middle">A</text>
      <text x="10"  y="186" fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x="279" y="186" fontSize="13" fill="#93c5fd" fontWeight="bold">C</text>
      <text x="100" y="57"  fontSize="12" fill="#fde68a" fontWeight="bold">D</text>
      <text x="187" y="57"  fontSize="12" fill="#fde68a" fontWeight="bold">E</text>
      {/* Side labels */}
      <text x="110" y="33"  fontSize="11" fill="#f97316" fontWeight="bold">AD=3</text>
      <text x="44"  y="122" fontSize="11" fill="#fb923c" fontWeight="bold">DB=9</text>
      <text x="165" y="33"  fontSize="11" fill="#4ade80"  fontWeight="bold">AE=4</text>
      <text x="220" y="122" fontSize="11" fill="#86efac"  fontWeight="bold">EC=12</text>
      <text x="150" y="49"  fontSize="11" fill="#fde68a"  fontWeight="bold" textAnchor="middle">DE=3</text>
      <text x="150" y="189" fontSize="11" fill="#93c5fd"  textAnchor="middle">BC = 12</text>
      {/* Similar label top-right */}
      <text x="268" y="42"  fontSize="11" fill="#fde68a" fontWeight="bold" textAnchor="middle">△ADE</text>
      <text x="268" y="56"  fontSize="11" fill="#fde68a" fontWeight="bold" textAnchor="middle">~△ABC</text>
    </svg>
  );
};

/* ── shared geometry helpers ─────────────────────────────── */
const ap = (cx:number,cy:number,p1x:number,p1y:number,p2x:number,p2y:number,r:number) => {
  const d1x=p1x-cx,d1y=p1y-cy,l1=Math.sqrt(d1x*d1x+d1y*d1y);
  const d2x=p2x-cx,d2y=p2y-cy,l2=Math.sqrt(d2x*d2x+d2y*d2y);
  const u1x=d1x/l1,u1y=d1y/l1,u2x=d2x/l2,u2y=d2y/l2;
  const sw=(u1x*u2y-u1y*u2x)>0?1:0;
  return `M ${(cx+r*u1x).toFixed(1)} ${(cy+r*u1y).toFixed(1)} A ${r} ${r} 0 0 ${sw} ${(cx+r*u2x).toFixed(1)} ${(cy+r*u2y).toFixed(1)}`;
};
const ra = (cx:number,cy:number,p1x:number,p1y:number,p2x:number,p2y:number,s=7) => {
  const d1x=p1x-cx,d1y=p1y-cy,l1=Math.sqrt(d1x*d1x+d1y*d1y);
  const d2x=p2x-cx,d2y=p2y-cy,l2=Math.sqrt(d2x*d2x+d2y*d2y);
  const u1x=d1x/l1*s,u1y=d1y/l1*s,u2x=d2x/l2*s,u2y=d2y/l2*s;
  return `M ${(cx+u1x).toFixed(1)} ${(cy+u1y).toFixed(1)} L ${(cx+u1x+u2x).toFixed(1)} ${(cy+u1y+u2y).toFixed(1)} L ${(cx+u2x).toFixed(1)} ${(cy+u2y).toFixed(1)}`;
};

/* ── Diagram 1 – Terpisah ───────────────────────────────── */
const DiagTerpisah = () => {
  // T1: A=(37,59) B=(12,127) C=(76,127)
  const [A1,B1,C1] = [{x:37,y:59},{x:12,y:127},{x:76,y:127}];
  // T2: P=(153,32) Q=(118,127) R=(208,127) — alas QR sejajar dengan BC
  const [A2,B2,C2] = [{x:153,y:32},{x:118,y:127},{x:208,y:127}];
  return (
    <svg viewBox="0 0 225 165" className="w-full rounded-lg bg-slate-950/50">
      {/* T1 */}
      <polygon points={`${B1.x},${B1.y} ${C1.x},${C1.y} ${A1.x},${A1.y}`} fill="#7dd3fc" fillOpacity=".40" stroke="#60a5fa" strokeWidth="1.8"/>
      <path d={ap(A1.x,A1.y,B1.x,B1.y,C1.x,C1.y,9)}  fill="none" stroke="#a855f7" strokeWidth="1.5"/>
      <path d={ap(B1.x,B1.y,C1.x,C1.y,A1.x,A1.y,12)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      <path d={ap(C1.x,C1.y,B1.x,B1.y,A1.x,A1.y,10)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* tanda sudut T1: 1 garis=∠A, 2 garis=∠B, 3 garis=∠C */}
      {/* ∠A — 1 tanda (ungu), tengah busur ≈ (38, 68), tegak lurus (-0.995, 0.102) */}
      <line x1="39.5" y1="67.9" x2="36.5" y2="68.2" stroke="#a855f7" strokeWidth="1.4" strokeLinecap="round"/>
      {/* ∠B — 2 tanda (oranye), tengah busur ≈ (21.5, 119.7), tegak lurus (0.605, 0.792) */}
      <line x1="19.8" y1="119.1" x2="21.6" y2="121.5" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="21.4" y1="117.9" x2="23.2" y2="120.3" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
      {/* ∠C — 3 tanda (hijau), tengah busur ≈ (67.6, 121.5), tegak lurus (0.551, -0.835) */}
      <line x1="68.1" y1="123.6" x2="69.7" y2="121.1" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="66.8" y1="122.8" x2="68.4" y2="120.3" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="65.5" y1="122.0" x2="67.1" y2="119.5" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>

      <text x={A1.x-4} y={A1.y-5}  fontSize="8" fill="#c4b5fd" fontWeight="bold">A</text>
      <text x={B1.x-9} y={B1.y+9}  fontSize="8" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C1.x+2} y={C1.y+9}  fontSize="8" fill="#93c5fd" fontWeight="bold">C</text>
      <text x={(B1.x+C1.x)/2-7} y={B1.y+20} fontSize="7.5" fill="#93c5fd">△ABC</text>

      {/* T2 */}
      <polygon points={`${B2.x},${B2.y} ${C2.x},${C2.y} ${A2.x},${A2.y}`} fill="#86efac" fillOpacity=".38" stroke="#4ade80" strokeWidth="1.8"/>
      <path d={ap(A2.x,A2.y,B2.x,B2.y,C2.x,C2.y,10)} fill="none" stroke="#a855f7" strokeWidth="1.5"/>
      <path d={ap(B2.x,B2.y,C2.x,C2.y,A2.x,A2.y,13)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      <path d={ap(C2.x,C2.y,B2.x,B2.y,A2.x,A2.y,11)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* tanda sudut T2: 1 garis=∠P, 2 garis=∠Q, 3 garis=∠R */}
      {/* ∠P — 1 tanda (ungu), tengah busur ≈ (154, 42), tegak lurus (-0.995, 0.105) */}
      <line x1="155.5" y1="41.8" x2="152.5" y2="42.2" stroke="#a855f7" strokeWidth="1.4" strokeLinecap="round"/>
      {/* ∠Q — 2 tanda (oranye), tengah busur ≈ (128.4, 119.1), tegak lurus (0.606, 0.797) */}
      <line x1="126.7" y1="118.5" x2="128.5" y2="120.9" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="128.3" y1="117.3" x2="130.1" y2="119.7" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
      {/* ∠R — 3 tanda (hijau), tengah busur ≈ (198.8, 120.9), tegak lurus (0.549, -0.838) */}
      <line x1="199.3" y1="123.0" x2="200.9" y2="120.4" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="198.0" y1="122.2" x2="199.6" y2="119.6" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="196.7" y1="121.4" x2="198.3" y2="118.8" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>

      <text x={A2.x-4} y={A2.y-5}  fontSize="8" fill="#c4b5fd" fontWeight="bold">P</text>
      <text x={B2.x-9} y={B2.y+9}  fontSize="8" fill="#86efac" fontWeight="bold">Q</text>
      <text x={C2.x+2} y={C2.y+9}  fontSize="8" fill="#86efac" fontWeight="bold">R</text>
      <text x={(B2.x+C2.x)/2-7} y={B2.y+20} fontSize="7.5" fill="#86efac">△PQR</text>

      {/* legend */}
      <text x="5" y="12" fontSize="7" fill="#c4b5fd">∠A = ∠P</text>
      <text x="5" y="23" fontSize="7" fill="#fcd9b5">∠B = ∠Q</text>
      <text x="5" y="34" fontSize="7" fill="#bbf7d0">∠C = ∠R</text>
    </svg>
  );
};

/* ── Diagram 2 – Bertolak Belakang (Kupu-kupu) ──────────── */
const DiagBertolakBelakang = () => {
  // Lines A→C and B→D cross at E
  const [A,B,D,C,E] = [{x:50,y:22},{x:190,y:22},{x:90,y:140},{x:170,y:140},{x:126,y:97}];
  return (
    <svg viewBox="0 0 248 158" className="w-full rounded-lg bg-slate-950/50">
      {/* guide lines */}
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#334155" strokeWidth="1" strokeDasharray="3,3"/>
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#334155" strokeWidth="1" strokeDasharray="3,3"/>
      {/* T1 △ABE */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${E.x},${E.y}`} fill="#7dd3fc" fillOpacity=".40" stroke="#60a5fa" strokeWidth="1.8"/>
      {/* T2 △DCE */}
      <polygon points={`${D.x},${D.y} ${C.x},${C.y} ${E.x},${E.y}`} fill="#86efac" fillOpacity=".38" stroke="#4ade80" strokeWidth="1.8"/>
      {/* angle marks – A↔C orange (1 tanda = sama besar) */}
      <path d={ap(A.x,A.y,B.x,B.y,E.x,E.y,13)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      <path d={ap(C.x,C.y,D.x,D.y,E.x,E.y,13)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      {/* tanda sudut ∠A = ∠C — 1 tick (oranye) */}
      {/* ∠A: tengah busur ≈ (62.0, 26.9), tegak lurus (-0.379, 0.925) */}
      <line x1="61.4" y1="28.3" x2="62.6" y2="25.5" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
      {/* ∠C: tengah busur ≈ (158.0, 135.1), tegak lurus (0.378, -0.926) */}
      <line x1="158.6" y1="133.7" x2="157.4" y2="136.5" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
      {/* B↔D green (2 tanda = sama besar) */}
      <path d={ap(B.x,B.y,A.x,A.y,E.x,E.y,13)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <path d={ap(D.x,D.y,C.x,C.y,E.x,E.y,13)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* tanda sudut ∠B = ∠D — 2 ticks (hijau) */}
      {/* ∠B: tengah busur ≈ (178.2, 27.4), tegak lurus (-0.419, -0.908) */}
      <line x1="176.5" y1="26.5" x2="177.7" y2="29.3" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="178.7" y1="25.5" x2="179.9" y2="28.3" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      {/* ∠D: tengah busur ≈ (101.8, 134.5), tegak lurus (0.423, 0.906) */}
      <line x1="103.5" y1="135.4" x2="102.3" y2="132.6" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="101.3" y1="136.4" x2="100.1" y2="133.6" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      {/* E vertical angles purple – two radii */}
      <path d={ap(E.x,E.y,A.x,A.y,B.x,B.y,12)} fill="none" stroke="#a855f7" strokeWidth="1.5"/>
      <path d={ap(E.x,E.y,D.x,D.y,C.x,C.y,10)} fill="none" stroke="#a855f7" strokeWidth="1.5"/>
      {/* labels */}
      <text x={A.x-9} y={A.y+1}  fontSize="8.5" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+3} y={B.y+1}  fontSize="8.5" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={E.x+4} y={E.y+4}  fontSize="8.5" fill="#fde68a" fontWeight="bold">E</text>
      <text x={D.x-9} y={D.y+11} fontSize="8.5" fill="#86efac" fontWeight="bold">D</text>
      <text x={C.x+3} y={C.y+11} fontSize="8.5" fill="#86efac" fontWeight="bold">C</text>
      {/* tanda panah sejajar — AB (y=22) dan DC (y=140), keduanya mengarah ke kanan */}
      <path d="M 115,18 L 121,22 L 115,26" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M 125,136 L 131,140 L 125,144" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
      <text x="90" y="10" fontSize="7" fill="#fbbf24">AB // DC</text>
      <text x={(A.x+E.x+B.x)/3-10} y="76" fontSize="7.5" fill="#93c5fd">△ABE</text>
      <text x={(D.x+E.x+C.x)/3-10} y="130" fontSize="7.5" fill="#86efac">△DCE</text>
    </svg>
  );
};

/* ── Diagram 3 – Di Dalam / Garis Sejajar ───────────────── */
const DiagDiDalam = () => {
  const [A,B,C,D,E] = [{x:128,y:12},{x:15,y:155},{x:241,y:155},{x:62,y:95},{x:194,y:95}];
  return (
    <svg viewBox="0 0 265 170" className="w-full rounded-lg bg-slate-950/50">
      {/* big △ABC */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#7dd3fc" fillOpacity=".35" stroke="#60a5fa" strokeWidth="1.8"/>
      {/* small △ADE shaded */}
      <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="#22c55e" fillOpacity=".40" stroke="#4ade80" strokeWidth="1.8"/>
      {/* DE parallel arrows – chevron pointing right at midpoint of DE (128,95) */}
      <path d="M 122,92 L 127,95 L 122,98" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M 128,92 L 133,95 L 128,98" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* BC parallel arrows – chevron pointing right at midpoint of BC (128,155) */}
      <path d="M 122,152 L 127,155 L 122,158" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M 128,152 L 133,155 L 128,158" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* labels */}
      <text x={A.x-4} y={A.y-5}  fontSize="8.5" fill="#fde68a" fontWeight="bold">A</text>
      <text x={B.x-11} y={B.y+10} fontSize="8.5" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C.x+3}  y={C.y+10} fontSize="8.5" fill="#93c5fd" fontWeight="bold">C</text>
      <text x={D.x-11} y={D.y-3}  fontSize="8.5" fill="#4ade80" fontWeight="bold">D</text>
      <text x={E.x+3}  y={E.y-3}  fontSize="8.5" fill="#4ade80" fontWeight="bold">E</text>
      <text x="208" y="78" fontSize="7.5" fill="#4ade80" fontWeight="bold">△ADE</text>
      <text x="208" y="89" fontSize="7.5" fill="#4ade80" fontWeight="bold">~ △ABC</text>
    </svg>
  );
};

/* ── Diagram 3b – Di Dalam PTS / PRQ (sesuai gambar) ────── */
const DiagDiDalamPTS = () => {
  // P=bottom-left, R=top-right, Q=bottom-right
  const P = {x:18, y:185}, R = {x:250, y:35}, Q = {x:300, y:185};
  // T on PR ~42%, S on PQ ~42%
  const T = {x:115, y:122}, S = {x:136, y:185};
  return (
    <svg viewBox="0 0 325 208" className="w-full rounded-lg bg-slate-950/50">
      {/* judul */}
      <text x="162" y="13" textAnchor="middle" fontSize="8.5" fill="#fde68a" fontWeight="bold">△PTS di dalam △PRQ</text>
      {/* segitiga besar PRQ — cyan */}
      <polygon points={`${P.x},${P.y} ${R.x},${R.y} ${Q.x},${Q.y}`} fill="#06b6d4" fillOpacity=".12" stroke="#06b6d4" strokeWidth="2"/>
      {/* segitiga kecil PTS — magenta */}
      <polygon points={`${P.x},${P.y} ${T.x},${T.y} ${S.x},${S.y}`} fill="#d946ef" fillOpacity=".30" stroke="#d946ef" strokeWidth="2"/>

      {/* sudut P bersama — oranye, dua busur */}
      <path d={ap(P.x,P.y,R.x,R.y,Q.x,Q.y,22)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      <path d={ap(P.x,P.y,T.x,T.y,S.x,S.y,13)} fill="none" stroke="#f97316" strokeWidth="1.5"/>

      {/* ∠R = ∠T — hijau */}
      <path d={ap(R.x,R.y,P.x,P.y,Q.x,Q.y,18)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <path d={ap(T.x,T.y,P.x,P.y,S.x,S.y,13)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* tanda 1 garis pada ∠R dan ∠T */}
      <line x1="242.3" y1="51.4" x2="245.7" y2="52.6" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="109.3" y1="133.8" x2="112.1" y2="134.8" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round"/>

      {/* ∠Q = ∠S — cyan */}
      <path d={ap(Q.x,Q.y,R.x,R.y,P.x,P.y,18)} fill="none" stroke="#06b6d4" strokeWidth="1.5"/>
      <path d={ap(S.x,S.y,T.x,T.y,P.x,P.y,13)} fill="none" stroke="#06b6d4" strokeWidth="1.5"/>

      {/* tanda panah sejajar TS // RQ — oranye diagonal */}
      {/* pada TS: midpoint ≈ (125.5, 153.5), arah (0.316, 0.949) */}
      <path d="M 120.8,151.9 L 126.8,157.3 L 128.3,149.4" fill="none" stroke="#f97316" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
      {/* pada RQ: midpoint ≈ (275, 110), arah (0.316, 0.949) */}
      <path d="M 270.3,108.4 L 276.3,113.8 L 277.8,105.9" fill="none" stroke="#f97316" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>

      {/* label titik */}
      <text x={P.x-14} y={P.y+4}  fontSize="10" fill="#fde68a" fontWeight="bold">P</text>
      <text x={R.x+5}  y={R.y+4}  fontSize="10" fill="#93c5fd" fontWeight="bold">R</text>
      <text x={Q.x+4}  y={Q.y+5}  fontSize="10" fill="#93c5fd" fontWeight="bold">Q</text>
      <text x={T.x-4}  y={T.y-7}  fontSize="9"  fill="#f0abfc" fontWeight="bold">T</text>
      <text x={S.x-4}  y={S.y+13} fontSize="9"  fill="#f0abfc" fontWeight="bold">S</text>
      {/* keterangan */}
      <text x="10" y="27" fontSize="7.5" fill="#d946ef" fontWeight="bold">TS // RQ →</text>
      <text x="10" y="38" fontSize="7.5" fill="#d946ef" fontWeight="bold">△PTS ~ △PRQ</text>
    </svg>
  );
};

/* ── Diagram 4 – Siku-siku & Altitude ───────────────────── */
const DiagSikuTinggi = () => {
  const [A,B,C,D] = [{x:15,y:140},{x:230,y:140},{x:70,y:46},{x:70,y:140}];
  return (
    <svg viewBox="0 0 252 158" className="w-full rounded-lg bg-slate-950/50">
      {/* △ACB full */}
      <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${B.x},${B.y}`} fill="#7dd3fc" fillOpacity=".30" stroke="#60a5fa" strokeWidth="1.8"/>
      {/* altitude line */}
      <line x1={D.x} y1={D.y} x2={C.x} y2={C.y} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
      {/* △ADC shaded */}
      <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${C.x},${C.y}`} fill="#f0abfc" fillOpacity=".42" stroke="#d946ef" strokeWidth="1.2"/>
      {/* △CDB shaded */}
      <polygon points={`${C.x},${C.y} ${D.x},${D.y} ${B.x},${B.y}`} fill="#86efac" fillOpacity=".40" stroke="#4ade80" strokeWidth="1.2"/>
      {/* right angle marks */}
      <path d={ra(D.x,D.y,A.x,A.y,C.x,C.y,7)} fill="none" stroke="#fff" strokeWidth="1.2"/>
      <path d={ra(D.x,D.y,B.x,B.y,C.x,C.y,7)} fill="none" stroke="#fff" strokeWidth="1.2"/>
      <path d={ra(C.x,C.y,A.x,A.y,B.x,B.y,7)} fill="none" stroke="#fff" strokeWidth="1.2"/>
      {/* ∠A orange – shared in △ADC & △ACB */}
      <path d={ap(A.x,A.y,D.x,D.y,C.x,C.y,12)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      <path d={ap(A.x,A.y,D.x,D.y,C.x,C.y,16)} fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="2,2"/>
      {/* ∠B green – shared in △CDB & △ACB */}
      <path d={ap(B.x,B.y,D.x,D.y,C.x,C.y,12)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <path d={ap(B.x,B.y,D.x,D.y,C.x,C.y,16)} fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="2,2"/>
      {/* ∠ACD = ∠B green (at C in △ADC) */}
      <path d={ap(C.x,C.y,A.x,A.y,D.x,D.y,11)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* ∠DCB = ∠A orange (at C in △CDB) */}
      <path d={ap(C.x,C.y,D.x,D.y,B.x,B.y,11)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      {/* labels */}
      <text x={A.x-10} y={A.y+11} fontSize="8.5" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+3}  y={B.y+11} fontSize="8.5" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C.x-10} y={C.y-4}  fontSize="8.5" fill="#fde68a" fontWeight="bold">C</text>
      <text x={D.x+3}  y={D.y+11} fontSize="8.5" fill="#e2e8f0" fontWeight="bold">D</text>
      <text x="22"  y="120" fontSize="7.5" fill="#d946ef">△ADC</text>
      <text x="128" y="120" fontSize="7.5" fill="#4ade80">△CDB</text>
      <text x="90"  y="18"  fontSize="7.5" fill="#93c5fd">△ACB</text>
      <text x="55"  y="136" fontSize="7" fill="#fbbf24">D</text>
    </svg>
  );
};

/* ── Diagram 5 – Sudut Berimpit ─────────────────────────── */
const DiagSudutBerimpit = () => {
  // Layout matches reference: P bottom-left, Q bottom-right, R top-right
  // S on base PQ: PS=9cm, SQ=11cm   T on side PR: PT=12cm
  // Scale ≈ 9.6 px/cm, PQ = 192px
  const P = {x:18, y:148}, Q = {x:210, y:148}, R = {x:195, y:18};
  const S = {x:104, y:148};   // PS = 86px ≈ 9cm
  const T = {x:111, y:80};    // T on PR at ~52.5%, PT ≈ 12cm
  return (
    <svg viewBox="0 0 238 170" className="w-full rounded-lg bg-slate-950/50">
      {/* big △PRQ */}
      <polygon points={`${P.x},${P.y} ${R.x},${R.y} ${Q.x},${Q.y}`} fill="#7dd3fc" fillOpacity=".35" stroke="#60a5fa" strokeWidth="1.8"/>
      {/* small △PTS */}
      <polygon points={`${P.x},${P.y} ${T.x},${T.y} ${S.x},${S.y}`} fill="#22c55e" fillOpacity=".40" stroke="#4ade80" strokeWidth="1.8"/>
      {/* shared ∠P – outer arc (△PRQ) orange, inner arc (△PTS) green */}
      <path d={ap(P.x,P.y,R.x,R.y,Q.x,Q.y,22)} fill="none" stroke="#f97316" strokeWidth="1.5"/>
      <path d={ap(P.x,P.y,T.x,T.y,S.x,S.y,15)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* ∠T = ∠Q – green arcs (radius pushed out so circle sits inside without overlap) */}
      <path d={ap(T.x,T.y,P.x,P.y,S.x,S.y,19)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <path d={ap(Q.x,Q.y,R.x,R.y,P.x,P.y,17)} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* tanda sama ○ — circles at ~r=12 from vertex, inside the arcs above */}
      <circle cx="105" cy="91" r="3" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <circle cx="201" cy="140" r="3" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* ∠S = ∠R (cyan) */}
      <path d={ap(S.x,S.y,T.x,T.y,P.x,P.y,12)} fill="none" stroke="#06b6d4" strokeWidth="1.5"/>
      <path d={ap(R.x,R.y,P.x,P.y,Q.x,Q.y,18)} fill="none" stroke="#06b6d4" strokeWidth="1.5"/>
      {/* S and T point dots */}
      <circle cx={S.x} cy={S.y} r="2.5" fill="#4ade80"/>
      <circle cx={T.x} cy={T.y} r="2.5" fill="#4ade80"/>
      {/* vertex labels */}
      <text x="3"        y={P.y+4}  fontSize="9" fill="#fde68a" fontWeight="bold">P</text>
      <text x={R.x+3}   y={R.y-3}  fontSize="9" fill="#93c5fd" fontWeight="bold">R</text>
      <text x={Q.x+3}   y={Q.y+4}  fontSize="9" fill="#93c5fd" fontWeight="bold">Q</text>
      <text x={T.x+4}   y={T.y-3}  fontSize="9" fill="#4ade80" fontWeight="bold">T</text>
      <text x={S.x-4}   y={S.y+13} fontSize="9" fill="#4ade80" fontWeight="bold">S</text>
    </svg>
  );
};

/* ── Posisi Sebangun Section ────────────────────────────── */
const PosisiSebangunSection = () => {
  const [tab, setTab] = useState(0);
  const configs = [
    {
      title: 'Terpisah',
      sub: 'Dua segitiga bebas',
      color: '#60a5fa',
      bg: 'bg-blue-500/20 border-blue-500/50',
      active: 'bg-blue-500/30 border-blue-400',
      diagram: <DiagTerpisah />,
      info: 'Dua segitiga yang berdiri sendiri tanpa saling menyentuh. Tanda busur berwarna sama menunjukkan sudut-sudut yang bersesuaian dan sama besar. Ini konfigurasi paling umum yang ditemui di soal.',
      syarat: 'Sd,Sd,Sd — ketiga pasang sudut sama besar',
    },
    {
      title: 'Bertolak Belakang',
      sub: 'Sudut bertolak belakang',
      color: '#f97316',
      bg: 'bg-orange-500/20 border-orange-500/50',
      active: 'bg-orange-500/30 border-orange-400',
      diagram: <DiagBertolakBelakang />,
      info: 'Dua segitiga bertemu di satu titik (E). Sudut ∠AEB = ∠DEC karena bertolak belakang (vertikal). Jika AB // DC, sudut-sudut bersesuaian di A↔D dan B↔C juga sama besar (sudut sehadap/berseberangan).',
      syarat: '∠AEB = ∠DEC (bertolak belakang) + AB // DC',
    },
    {
      title: 'Di Dalam',
      sub: 'Garis sejajar memotong',
      color: '#a855f7',
      bg: 'bg-purple-500/20 border-purple-500/50',
      active: 'bg-purple-500/30 border-purple-400',
      diagram: (
        <div className="flex flex-col landscape:flex-row gap-3">
          <div className="min-w-0 landscape:flex-1">
            <p className="text-center text-xs text-purple-300/70 mb-1 font-body">△ADE di dalam △ABC (DE // BC)</p>
            <DiagDiDalam />
          </div>
          <div className="min-w-0 landscape:flex-1">
            <DiagDiDalamPTS />
          </div>
        </div>
      ),
      info: 'Segitiga kecil △PTS berada di dalam segitiga besar △PRQ dan berbagi sudut puncak ∠P. Karena TS // RQ, sudut-sudut bersesuaian sama besar (∠PTR = ∠PRQ dan ∠PST = ∠PQR), sehingga △PTS ~ △PRQ.',
      syarat: '∠P bersama + TS // RQ → sudut sehadap sama → AA terpenuhi',
    },
    {
      title: 'Siku-siku & Tinggi',
      sub: 'Tiga segitiga sebangun',
      color: '#fbbf24',
      bg: 'bg-yellow-500/20 border-yellow-500/50',
      active: 'bg-yellow-500/30 border-yellow-400',
      diagram: <DiagSikuTinggi />,
      info: 'Pada △ACB siku-siku di C, garis tinggi CD membagi menjadi △ADC (ungu) dan △CDB (hijau). Ketiga segitiga saling sebangun: △ADC ~ △CDB ~ △ACB, karena masing-masing berbagi sudut dengan segitiga induk.',
      syarat: '△ADC ~ △CDB ~ △ACB (Siku-Siku-Sudut)',
    },
    {
      title: 'Sudut Berimpit',
      sub: 'Sudut sekutu di satu titik',
      color: '#e879f9',
      bg: 'bg-fuchsia-500/20 border-fuchsia-500/50',
      active: 'bg-fuchsia-500/30 border-fuchsia-400',
      diagram: <DiagSudutBerimpit />,
      info: 'Dua segitiga berbagi sudut yang sama (berimpit) di titik P. ∠T = ∠Q ditunjukkan dengan busur hijau dan tanda sama (✓) pada kedua sudut. Karena TS tidak sejajar dengan RQ, kesebangunan △PTS ~ △PQR terjadi bukan dari garis sejajar, melainkan langsung dari dua pasang sudut yang sama besar.',
      syarat: '∠P bersekutu + ∠PTS = ∠PQR → Sd, Sd terpenuhi → △PTS ~ △PQR',
    },
  ];
  const c = configs[tab];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {configs.map((cfg, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`rounded-lg border p-2 text-left transition-all font-body ${
              configs.length % 2 !== 0 && i === configs.length - 1 ? 'col-span-2' : ''
            } ${tab === i ? cfg.active : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'}`}>
            <p className="text-xs font-semibold" style={{ color: tab === i ? cfg.color : '#94a3b8' }}>{cfg.title}</p>
            <p className="text-xs text-white/40">{cfg.sub}</p>
          </button>
        ))}
      </div>
      {c.diagram}
      <div className="rounded-lg p-3 space-y-1" style={{ background: `color-mix(in srgb, ${c.color} 8%, transparent)`, border: `1px solid color-mix(in srgb, ${c.color} 30%, transparent)` }}>
        <p className="font-body text-xs font-semibold" style={{ color: c.color }}>📐 {c.title}</p>
        <p className="font-body text-xs text-white/70 leading-relaxed">{c.info}</p>
        <p className="font-body text-xs text-white/40 pt-1">✅ Syarat terpenuhi: <span className="text-white/60">{c.syarat}</span></p>
      </div>
    </div>
  );
};

const InteraktifSebangunDemo = () => {
  const [scale, setScale] = useState(1.5);
  const [focus, setFocus] = useState<'sudut' | 'rusuk'>('sudut');

  // BASE=70 → display labels round to 7 (BC), 8 (AB), 9 (CA) — nice integers
  const BASE = 70;
  const xRel = 0.3867 * BASE;
  const yRel = 1.0622 * BASE;

  const B1 = { x: 10, y: 175 };
  const C1 = { x: 10 + BASE, y: 175 };
  const A1 = { x: B1.x + xRel, y: B1.y - yRel };

  const B2 = { x: 145, y: 175 };
  const C2 = { x: B2.x + BASE * scale, y: 175 };
  const A2 = { x: B2.x + xRel * scale, y: B2.y - yRel * scale };

  // Fixed integer display labels for T1 (matches rounded geometry ÷10)
  const T1 = { ab: 8, bc: 7, ca: 9 };

  const arc = (cx: number, cy: number, p1x: number, p1y: number, p2x: number, p2y: number, r: number) => {
    const d1x = p1x - cx, d1y = p1y - cy, l1 = Math.sqrt(d1x * d1x + d1y * d1y);
    const d2x = p2x - cx, d2y = p2y - cy, l2 = Math.sqrt(d2x * d2x + d2y * d2y);
    const u1x = d1x / l1, u1y = d1y / l1;
    const u2x = d2x / l2, u2y = d2y / l2;
    const sx = cx + r * u1x, sy = cy + r * u1y;
    const ex = cx + r * u2x, ey = cy + r * u2y;
    const cross = u1x * u2y - u1y * u2x;
    const sweep = cross > 0 ? 1 : 0;
    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };

  const ao = focus === 'sudut' ? 1 : 0.2;
  const ro = focus === 'rusuk' ? 1 : 0.2;

  const TriangleGroup = ({
    B, C, A, labels, strokeColor, textColor,
  }: {
    B: { x: number; y: number };
    C: { x: number; y: number };
    A: { x: number; y: number };
    labels: { v1: string; v2: string; v3: string; ab: string; bc: string; ca: string };
    strokeColor: string;
    textColor: string;
  }) => {
    const abMid = { x: (B.x + A.x) / 2, y: (B.y + A.y) / 2 };
    const bcMid = { x: (B.x + C.x) / 2, y: B.y };
    const caMid = { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 };
    return (
      <g>
        <polygon
          points={`${B.x},${B.y} ${C.x},${C.y} ${A.x},${A.y}`}
          fill={strokeColor} fillOpacity="0.12" stroke={strokeColor} strokeWidth="1.8"
        />
        <path d={arc(B.x, B.y, C.x, C.y, A.x, A.y, 14)} fill="none" stroke="#f97316" strokeWidth="1.6" opacity={ao} />
        <path d={arc(C.x, C.y, B.x, B.y, A.x, A.y, 11)} fill="none" stroke="#22c55e" strokeWidth="1.6" opacity={ao} />
        <path d={arc(A.x, A.y, B.x, B.y, C.x, C.y, 9)}  fill="none" stroke="#a855f7" strokeWidth="1.6" opacity={ao} />
        <text x={B.x + 15} y={B.y - 9}  fontSize="7.5" fill="#f97316" fontWeight="bold" opacity={ao}>70°</text>
        <text x={C.x - 23} y={C.y - 9}  fontSize="7.5" fill="#22c55e" fontWeight="bold" opacity={ao}>60°</text>
        <text x={A.x - 2}  y={A.y + 15} fontSize="7.5" fill="#a855f7" fontWeight="bold" opacity={ao}>50°</text>
        <text x={abMid.x - 14} y={abMid.y + 2} fontSize="7" fill="#fbbf24" opacity={ro}>{labels.ab}</text>
        <text x={bcMid.x - 6}  y={bcMid.y + 13} fontSize="7" fill="#fbbf24" opacity={ro}>{labels.bc}</text>
        <text x={caMid.x + 3}  y={caMid.y + 2}  fontSize="7" fill="#fbbf24" opacity={ro}>{labels.ca}</text>
        <text x={B.x - 8} y={B.y + 11} fontSize="8.5" fill={textColor} fontWeight="bold">{labels.v1}</text>
        <text x={C.x + 3} y={C.y + 11} fontSize="8.5" fill={textColor} fontWeight="bold">{labels.v2}</text>
        <text x={A.x - 3} y={A.y - 6}  fontSize="8.5" fill={textColor} fontWeight="bold">{labels.v3}</text>
      </g>
    );
  };

  const k = scale % 1 === 0 ? scale.toString() : scale.toFixed(2);

  return (
    <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 space-y-3">
      <p className="font-body text-sm font-semibold text-purple-200 text-center">🎮 Coba Sendiri — Mengapa Cukup Satu Syarat?</p>

      <div className="flex gap-2">
        <button
          onClick={() => setFocus('sudut')}
          className={`flex-1 text-xs py-2 rounded-lg font-body font-semibold transition-all ${
            focus === 'sudut'
              ? 'bg-orange-500/30 text-orange-300 border border-orange-400/60 shadow shadow-orange-500/20'
              : 'bg-slate-800/60 text-white/40 border border-slate-700'
          }`}
        >
          🔺 Fokus Sudut
        </button>
        <button
          onClick={() => setFocus('rusuk')}
          className={`flex-1 text-xs py-2 rounded-lg font-body font-semibold transition-all ${
            focus === 'rusuk'
              ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/60 shadow shadow-yellow-500/20'
              : 'bg-slate-800/60 text-white/40 border border-slate-700'
          }`}
        >
          📏 Fokus Rusuk
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs font-body text-white/40">
          <span>△PQR lebih kecil</span>
          <span>k = <strong className="text-purple-300">{k}</strong></span>
          <span>△PQR lebih besar</span>
        </div>
        <input
          type="range" min="0.25" max="2" step="0.05" value={scale}
          onChange={e => setScale(Number(e.target.value))}
          className="w-full accent-purple-400 cursor-pointer"
        />
      </div>

      <svg viewBox="0 0 310 200" className="w-full rounded-lg bg-slate-950/60 border border-slate-800/80">
        <TriangleGroup
          B={B1} C={C1} A={A1}
          strokeColor="#60a5fa" textColor="#93c5fd"
          labels={{ v1: 'B', v2: 'C', v3: 'A', ab: T1.ab.toString(), bc: T1.bc.toString(), ca: T1.ca.toString() }}
        />
        <text x={(B1.x + C1.x) / 2 - 12} y={B1.y + 22} fontSize="8" fill="#93c5fd">△ABC</text>

        <TriangleGroup
          B={B2} C={C2} A={A2}
          strokeColor="#4ade80" textColor="#86efac"
          labels={{ v1: 'P', v2: 'Q', v3: 'R', ab: (T1.ab * scale).toFixed(1), bc: (T1.bc * scale).toFixed(1), ca: (T1.ca * scale).toFixed(1) }}
        />
        <text x={(B2.x + C2.x) / 2 - 12} y={B2.y + 22} fontSize="8" fill="#86efac">△PQR</text>

        <text x="112" y="148" fontSize="18" fill="#facc15" fontWeight="bold">~</text>
      </svg>

      {focus === 'sudut' ? (
        <div className="bg-orange-500/10 border border-orange-500/25 rounded-lg p-3 space-y-2">
          <p className="font-body text-xs font-semibold text-orange-300 text-center">
            ✅ Sudut-sudut bersesuaian <em>selalu</em> sama besar — meski ukuran berubah!
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['∠B = ∠P', '70°', '#f97316'], ['∠C = ∠Q', '60°', '#22c55e'], ['∠A = ∠R', '50°', '#a855f7']].map(
              ([lbl, val, col]) => (
                <div key={lbl} className="bg-slate-800/60 rounded-lg p-2">
                  <p className="text-xs text-white/40">{lbl}</p>
                  <p className="text-sm font-bold" style={{ color: col }}>{val}</p>
                </div>
              )
            )}
          </div>
          <p className="font-body text-xs text-white/50 text-center leading-relaxed">
            Karena sudut-sudut sama → rusuk otomatis sebanding dengan rasio k = <span className="text-yellow-300 font-bold">{k}</span>
          </p>
        </div>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-lg p-3 space-y-2">
          <p className="font-body text-xs font-semibold text-yellow-300 text-center">
            ✅ Rasio semua pasang rusuk <em>selalu</em> sama = k — geser slidernya!
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['PQ / AB', k],
              ['QR / BC', k],
              ['RP / CA', k],
            ].map(([lbl, val]) => (
              <div key={lbl} className="bg-slate-800/60 rounded-lg p-2">
                <p className="text-xs text-white/40">{lbl}</p>
                <p className="text-sm font-bold text-yellow-300">{val}</p>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-white/50 text-center leading-relaxed">
            Karena rusuk sebanding → sudut otomatis sama besar!
          </p>
        </div>
      )}

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
        <p className="font-body text-xs text-purple-200 text-center leading-relaxed">
          💡 <strong>Kesimpulan:</strong> Cukup buktikan <em>salah satu</em> — sudut atau rusuk — karena yang satu secara otomatis membawa yang lain!
        </p>
      </div>
    </div>
  );
};

const SegitigaSebangunPage = () => {
  const navigate = useNavigate();
  const Header = ({ icon, color, label }: { icon: React.ReactNode; color: string; label: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{label}</span></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">SEGITIGA – SEGITIGA YANG SEBANGUN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="🔺 Mengapa Segitiga Istimewa?" />
            <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pada bangun datar umum, kita butuh DUA syarat untuk membuktikan kesebangunan (sudut sama + rusuk sebanding). Tapi pada <strong className="text-cyan-300">segitiga</strong>, cukup salah satunya saja — karena keduanya saling memengaruhi secara otomatis!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-cyan-200 font-semibold">Dua segitiga sebangun jika memenuhi SALAH SATU dari berikut:</p>
                  <div className="font-body text-sm text-cyan-100 space-y-1">
                    <p>🔹 <strong>Syarat 1 (Sd, Sd, Sd) atau (Sd, Sd):</strong> Sudut-sudut yang bersesuaian sama besar</p>
                    <p>🔹 <strong>Syarat 2 (S, S, S):</strong> Rusuk-rusuk yang bersesuaian sebanding</p>
                    <p>🔹 <strong>Syarat 3 (S, Sd, S):</strong> Dua pasang rusuk sebanding dan sudut apit sama besar</p>
                  </div>
                </div>
                <InteraktifSebangunDemo />
              </div>
          </div>

          {/* SYARAT AA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Sub-Bab 1: Syarat Kesebangunan Segitiga" />
            <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Syarat Sd, Sd (Sudut-Sudut):</p>
                      <p>Jika dua pasang sudut yang bersesuaian dari dua segitiga sama besar, maka sudut ketiga otomatis sama (total sudut = 180°), sehingga kedua segitiga <strong>sebangun</strong>.</p>
                      <BlockMath math="\angle A = \angle P \text{ dan } \angle B = \angle Q \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                    <div className="bg-slate-900/60 rounded-lg px-3 pb-3 pt-5">
                      <p className="text-blue-300 font-semibold mb-1">Syarat S, S, S (Sisi-Sisi-Sisi):</p>
                      <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{CA}{RP} \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                    <div className="bg-slate-900/60 rounded-lg px-3 pb-3 pt-5">
                      <p className="text-purple-300 font-semibold mb-1">Syarat S, Sd, S (Sisi-Sudut-Sisi):</p>
                      <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} \text{ dan } \angle B = \angle Q \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* POSISI SEGITIGA SEBANGUN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header icon={<Target className="w-5 h-5" />} color="#a855f7" label="🔷 Sub-Bab 2: Posisi Dua Segitiga Sebangun" />
            <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dua segitiga yang sebangun bisa muncul dalam berbagai <strong className="text-purple-300">konfigurasi posisi</strong>. Meskipun tampilannya berbeda, syarat kesebangunan tetap terpenuhi — ditunjukkan oleh tanda busur berwarna yang sama pada sudut-sudut yang bersesuaian.
                </p>
                <PosisiSebangunSection />
              </div>
          </div>

          {/* DALIL GARIS SEJAJAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header icon={<Target className="w-5 h-5" />} color="#facc15" label="📘 Sub-Bab 3: Dalil Garis Sejajar dalam Segitiga" />
            <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI GARIS SEJAJAR DALAM SEGITIGA:</p>
                  <DiagDiDalam />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Jika sebuah garis ditarik sejajar salah satu sisi segitiga sehingga memotong dua sisi lainnya, maka:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <BlockMath math="\text{Jika } DE \parallel BC, \text{ maka } \frac{AD}{DB} = \frac{AE}{EC}" />
                    <p className="font-body text-xs text-white/60">Juga berlaku kebalikannya: Jika AD/DB = AE/EC, maka DE // BC</p>
                  </div>
                  <p className="font-body text-sm text-white/80">Selain itu: △ADE ~ △ABC dengan perbandingan rusuk <InlineMath math="\frac{AD}{AB} = \frac{AE}{AC} = \frac{DE}{BC}" /></p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Dalil ini super berguna untuk menghitung panjang garis yang sejajar dalam segitiga! Ingat: garis sejajar membagi dua sisi lain secara <em>proporsional</em>.
                  </p>
                </div>
              </div>
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Segitiga Sebangun" />
            <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pada gambar di samping, dua garis sejajar memotong sisi-sisi segitiga. Diketahui ukuran ruas garis seperti pada gambar. Hitunglah nilai <InlineMath math="a" />, <InlineMath math="b" />, dan <InlineMath math="c" />!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">📐 ILUSTRASI:</p>
                    <DiagramContoh1 />
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Karena dua garis sejajar BC memotong kedua sisi segitiga, berlaku <strong>Dalil Garis Sejajar</strong> — ruas-ruas yang bersesuaian berbanding sama.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p className="text-xs text-slate-400 font-semibold">Mencari a (kiri atas : kiri tengah = kanan atas : kanan tengah):</p>
                        <BlockMath math="\frac{a}{8} = \frac{6}{4} \Rightarrow a = \frac{6}{4} \times 8 = 12" />
                        <p className="text-xs text-slate-400 font-semibold">Mencari b (kiri bawah : kiri tengah = kanan bawah : kanan tengah):</p>
                        <BlockMath math="\frac{b}{8} = \frac{2}{4} \Rightarrow b = \frac{2}{4} \times 8 = 4" />
                        <p className="text-xs text-slate-400 font-semibold">Mencari c (perpanjangan alas terhadap garis sejajar kedua):</p>
                        <BlockMath math="\frac{c}{20} = \frac{2}{6+4} = \frac{2}{10} \Rightarrow c = \frac{2}{10} \times 20 = 4" />
                      </div>
                      <p><strong className="text-green-300">a = 12,  b = 4,  c = 4 ✓</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dalam △ABC, garis PQ sejajar BC dengan P pada AB dan Q pada AC. Jika <InlineMath math="AP = 4" /> cm, <InlineMath math="PB = 6" /> cm, dan <InlineMath math="BC = 15" /> cm, tentukan panjang PQ!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">📐 ILUSTRASI:</p>
                    <DiagramContoh2 />
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Karena PQ // BC, maka △APQ ~ △ABC. Perbandingan sisi:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AP}{AB} = \frac{PQ}{BC}" />
                        <BlockMath math="AB = AP + PB = 4 + 6 = 10 \text{ cm}" />
                        <BlockMath math="\frac{4}{10} = \frac{PQ}{15} \Rightarrow PQ = \frac{4 \times 15}{10} = 6 \text{ cm}" />
                      </div>
                      <p><strong className="text-yellow-300">PQ = 6 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pada △ABC, titik D pada AB dengan <InlineMath math="AD = 3" /> cm dan <InlineMath math="DB = 9" /> cm. Titik E pada AC. Diketahui DE // BC, <InlineMath math="BC = 12" /> cm. Tentukan panjang DE dan AE jika <InlineMath math="AC = 16" /> cm!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">📐 ILUSTRASI:</p>
                    <DiagramContoh3 />
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari AB:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AB = AD + DB = 3 + 9 = 12 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Gunakan △ADE ~ △ABC:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\frac{AD}{AB} = \frac{DE}{BC} \Rightarrow \frac{3}{12} = \frac{DE}{12} \Rightarrow DE = 3 \text{ cm}" />
                        <BlockMath math="\frac{AD}{AB} = \frac{AE}{AC} \Rightarrow \frac{3}{12} = \frac{AE}{16} \Rightarrow AE = 4 \text{ cm}" />
                      </div>
                      <p><strong className="text-primary">DE = 3 cm dan AE = 4 cm.</strong></p>
                    </div>
                  </div>
                </div>
              </div>
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/kesebangunan-kekongruenan"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan dan Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};
export default SegitigaSebangunPage;
