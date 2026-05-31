import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ──────────────────────────────────────────────
   SVG DIAGRAMS
────────────────────────────────────────────── */

const DiagramPengertian = () => (
  <svg viewBox="0 0 340 220" className="w-full max-w-sm mx-auto" aria-label="Diagram pengertian dilatasi">
    <defs>
      <marker id="arrow-d" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#facc15" />
      </marker>
    </defs>
    {/* Background grid */}
    {[40,80,120,160,200,240,280,320].map(x => (
      <line key={`vg${x}`} x1={x} y1="10" x2={x} y2="210" stroke="#334155" strokeWidth="0.5" />
    ))}
    {[20,60,100,140,180].map(y => (
      <line key={`hg${y}`} x1="10" y1={y} x2="330" y2={y} stroke="#334155" strokeWidth="0.5" />
    ))}
    {/* Center of dilation O */}
    <circle cx="60" cy="140" r="6" fill="#f97316" />
    <text x="48" y="158" fontSize="11" fill="#f97316" fontWeight="bold">O</text>
    {/* Original triangle (small) */}
    <polygon points="120,120 150,80 175,120" fill="#3b82f6" fillOpacity="0.35" stroke="#60a5fa" strokeWidth="2" />
    <text x="136" y="115" fontSize="10" fill="#93c5fd" fontWeight="bold">△ABC</text>
    {/* Dilated triangle (large) */}
    <polygon points="210,140 270,60 320,140" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2" strokeDasharray="5,3" />
    <text x="252" y="135" fontSize="10" fill="#86efac" fontWeight="bold">△A'B'C'</text>
    {/* Ray lines from O */}
    <line x1="60" y1="140" x2="320" y2="140" stroke="#facc15" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arrow-d)" />
    <line x1="60" y1="140" x2="270" y2="60" stroke="#facc15" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arrow-d)" />
    <line x1="60" y1="140" x2="320" y2="140" stroke="#facc15" strokeWidth="0.5" />
    {/* Labels */}
    <text x="85" y="155" fontSize="9" fill="#fde68a">k × OA</text>
    <text x="140" y="98" fontSize="9" fill="#fde68a">k × OB</text>
    {/* Factor k label */}
    <rect x="10" y="185" width="200" height="22" rx="4" fill="#1e293b" />
    <text x="20" y="200" fontSize="10" fill="#f8fafc">Faktor Skala</text>
    <text x="90" y="200" fontSize="10" fill="#4ade80" fontWeight="bold"> k = 2  →  diperbesar</text>
  </svg>
);

const DiagramDilatasiOrigin = () => (
  <svg viewBox="0 0 340 260" className="w-full max-w-sm mx-auto" aria-label="Diagram dilatasi pusat O(0,0)">
    <defs>
      <marker id="ax1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#94a3b8" />
      </marker>
    </defs>
    {/* Axes */}
    <line x1="20" y1="150" x2="320" y2="150" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#ax1)" />
    <line x1="170" y1="240" x2="170" y2="10" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#ax1)" />
    <text x="305" y="165" fontSize="11" fill="#94a3b8">x</text>
    <text x="175" y="18" fontSize="11" fill="#94a3b8">y</text>
    {/* Grid */}
    {[-3,-2,-1,1,2,3].map(i => (
      <g key={i}>
        <line x1={170+i*40} y1="145" x2={170+i*40} y2="155" stroke="#94a3b8" strokeWidth="1" />
        <text x={170+i*40-5} y="168" fontSize="9" fill="#64748b">{i}</text>
        <line x1="165" y1={150-i*40} x2="175" y2={150-i*40} stroke="#94a3b8" strokeWidth="1" />
        <text x="148" y={154-i*40} fontSize="9" fill="#64748b">{i}</text>
      </g>
    ))}
    {/* Origin */}
    <circle cx="170" cy="150" r="5" fill="#f97316" />
    <text x="174" y="168" fontSize="10" fill="#f97316" fontWeight="bold">O(0,0)</text>
    {/* Original triangle A(1,1) B(2,1) C(1,3) */}
    {/* coords: x=170+n*40, y=150-n*40 */}
    {/* A(1,1)=210,110  B(2,1)=250,110  C(1,3)=210,30 */}
    <polygon points="210,110 250,110 210,30" fill="#3b82f6" fillOpacity="0.4" stroke="#60a5fa" strokeWidth="2" />
    <text x="215" y="107" fontSize="10" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="252" y="107" fontSize="10" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="213" y="27" fontSize="10" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="218" y="90" fontSize="9" fill="#93c5fd">△ABC</text>
    {/* Dilated triangle k=2: A'(2,2)=250,70  B'(4,2)=(330,70)  C'(2,6)=(250,-90 off screen) */}
    {/* Let's use k=1.5: A'(1.5,1.5)=230,90  B'(3,1.5)=290,90  C'(1.5,4.5)=230,-30 off */}
    {/* Let's use k=1.5: A'=230,90  B'=290,90  C'=230,150-4.5*40=150-180=-30... off too */}
    {/* Use simpler coords. Original: A(1,1), B(3,1), C(1,2). k=2 */}
    {/* A(1,1)=210,110  B(3,1)=290,110  C(1,2)=210,70 */}
    {/* A'(2,2)=250,70  B'(6,2) off  C'(2,4)=250,-10 */}
    {/* Use k=1.5: A'(1.5,1.5)=230,90  B'(4.5,1.5)=350,90 off... */}
    {/* Keep original: A(1,1)B(2,1)C(1,2), k=2 => A'(2,2)B'(4,2)C'(2,4) */}
    {/* A'=250,70  B'=330,70  C'=250,-10 -- still off */}
    {/* Use A(0.5,0.5)B(1.5,0.5)C(0.5,1.5), k=2: A'(1,1)B'(3,1)C'(1,3) */}
    {/* Original: A=190,130 B=230,130 C=190,90 */}
    {/* Dilated: A'=210,110 B'=290,110 C'=210,30 */}
    <polygon points="190,130 230,130 190,90" fill="#3b82f6" fillOpacity="0.5" stroke="#60a5fa" strokeWidth="2" />
    <text x="195" y="127" fontSize="9" fill="#bfdbfe">A</text>
    <text x="233" y="127" fontSize="9" fill="#bfdbfe">B</text>
    <text x="193" y="87" fontSize="9" fill="#bfdbfe">C</text>
    {/* Dilated k=2 */}
    <polygon points="210,110 290,110 210,30" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2" strokeDasharray="6,3" />
    <text x="213" y="107" fontSize="9" fill="#86efac">A'</text>
    <text x="293" y="107" fontSize="9" fill="#86efac">B'</text>
    <text x="213" y="27" fontSize="9" fill="#86efac">C'</text>
    {/* Arrow lines from O */}
    <line x1="170" y1="150" x2="190" y2="130" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="170" y1="150" x2="210" y2="110" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="170" y1="150" x2="230" y2="130" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="170" y1="150" x2="290" y2="110" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="170" y1="150" x2="190" y2="90" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="170" y1="150" x2="210" y2="30" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    {/* Legend */}
    <rect x="10" y="215" width="145" height="38" rx="5" fill="#1e293b" stroke="#334155" />
    <polygon points="20,228 35,228 20,238" fill="#3b82f6" fillOpacity="0.5" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="40" y="236" fontSize="9" fill="#93c5fd">△ABC (asli)</text>
    <polygon points="20,244 35,244 20,254" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" />
    <text x="40" y="252" fontSize="9" fill="#86efac">△A'B'C' (k=2)</text>
    <rect x="170" y="215" width="160" height="38" rx="5" fill="#1e293b" stroke="#334155" />
    <text x="178" y="229" fontSize="9" fill="#fde68a" fontWeight="bold">Rumus:</text>
    <text x="178" y="242" fontSize="9" fill="#fde68a">A(x,y) → A'(kx, ky)</text>
    <text x="178" y="254" fontSize="9" fill="#f97316">Pusat O(0,0), faktor k</text>
  </svg>
);

const DiagramDilatasiAB = () => (
  <svg viewBox="0 0 340 270" className="w-full max-w-sm mx-auto" aria-label="Diagram dilatasi pusat P(a,b)">
    <defs>
      <marker id="ax2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 z" fill="#94a3b8" />
      </marker>
    </defs>
    {/* Axes */}
    <line x1="20" y1="170" x2="320" y2="170" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#ax2)" />
    <line x1="60" y1="255" x2="60" y2="15" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#ax2)" />
    <text x="307" y="185" fontSize="11" fill="#94a3b8">x</text>
    <text x="65" y="22" fontSize="11" fill="#94a3b8">y</text>
    {/* Grid ticks */}
    {[1,2,3,4,5,6].map(i => (
      <g key={i}>
        <line x1={60+i*40} y1="165" x2={60+i*40} y2="175" stroke="#94a3b8" strokeWidth="1" />
        <text x={60+i*40-4} y="187" fontSize="9" fill="#64748b">{i}</text>
      </g>
    ))}
    {[1,2,3,4,5].map(i => (
      <g key={i}>
        <line x1="55" y1={170-i*40} x2="65" y2={170-i*40} stroke="#94a3b8" strokeWidth="1" />
        <text x="38" y={174-i*40} fontSize="9" fill="#64748b">{i}</text>
      </g>
    ))}
    <text x="38" y="174" fontSize="9" fill="#64748b">0</text>
    {/* Center P(2,1) = 60+2*40=140, 170-1*40=130 */}
    <circle cx="140" cy="130" r="6" fill="#f97316" />
    <text x="144" y="125" fontSize="10" fill="#f97316" fontWeight="bold">P(2,1)</text>
    {/* Original triangle: A(3,2)=180,90  B(4,2)=220,90  C(3,4)=180,10 off */}
    {/* Use A(3,2)=180,90  B(4,2)=220,90  C(4,3)=220,50 */}
    <polygon points="180,90 220,90 220,50" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="2" />
    <text x="183" y="87" fontSize="9" fill="#e9d5ff">A(3,2)</text>
    <text x="224" y="87" fontSize="9" fill="#e9d5ff">B(4,2)</text>
    <text x="224" y="47" fontSize="9" fill="#e9d5ff">C(4,3)</text>
    {/* k=2 from P(2,1): x'=2+(x-2)*2=2x-2, y'=1+(y-1)*2=2y-1 */}
    {/* A(3,2)->A'(4,3)=220,50  B(4,2)->B'(6,3)=300,50  C(4,3)->C'(6,5)=300,-30 off */}
    {/* Let's use k=2: P(1,1), A(2,2), B(3,2), C(2,3) */}
    {/* P(1,1)=100,130  A(2,2)=140,90  B(3,2)=180,90  C(2,3)=140,50 */}
    {/* A'(3,3)=180,50  B'(5,3)=260,50  C'(3,5)=180,-30 off */}
    {/* Use k=1.5: A'(2.5,2.5)=160,70  B'(3.5,2.5)=200,70  C'(2.5,3.5)=160,30 */}
    {/* P(1,1)=100,130 */}
    <circle cx="100" cy="130" r="6" fill="#f97316" />
    <text x="104" y="125" fontSize="10" fill="#f97316" fontWeight="bold">P(1,1)</text>
    {/* Original: A(2,2)=140,90  B(3,2)=180,90  C(2,3)=140,50 */}
    <polygon points="140,90 180,90 140,50" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="2" />
    <text x="144" y="87" fontSize="9" fill="#e9d5ff">A</text>
    <text x="183" y="87" fontSize="9" fill="#e9d5ff">B</text>
    <text x="144" y="47" fontSize="9" fill="#e9d5ff">C</text>
    {/* k=2: A'=P+2*(A-P)=(1+2*(2-1), 1+2*(2-1))=(3,3)=180,50  */}
    {/* B'=(1+2*(3-1),1+2*(2-1))=(5,3)=260,50  C'=(1+2*(2-1),1+2*(3-1))=(3,5)=180,-30 off */}
    {/* Use k=1.5: A'=(1+1.5*1, 1+1.5*1)=(2.5,2.5)=160,70 */}
    {/* B'=(1+1.5*2,1+1.5*1)=(4,2.5)=220,70  C'=(1+1.5*1,1+1.5*2)=(2.5,4)=160,10 */}
    <polygon points="160,70 220,70 160,10" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2" strokeDasharray="6,3" />
    <text x="164" y="67" fontSize="9" fill="#86efac">A'</text>
    <text x="224" y="67" fontSize="9" fill="#86efac">B'</text>
    <text x="164" y="8" fontSize="9" fill="#86efac">C'</text>
    {/* Arrow lines from P */}
    <line x1="100" y1="130" x2="140" y2="90" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="100" y1="130" x2="160" y2="70" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3,2" />
    <line x1="100" y1="130" x2="180" y2="90" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="100" y1="130" x2="220" y2="70" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3,2" />
    <line x1="100" y1="130" x2="140" y2="50" stroke="#facc15" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="100" y1="130" x2="160" y2="10" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3,2" />
    {/* Legend */}
    <rect x="10" y="225" width="145" height="38" rx="5" fill="#1e293b" stroke="#334155" />
    <polygon points="20,238 35,238 20,248" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="1.5" />
    <text x="40" y="246" fontSize="9" fill="#e9d5ff">△ABC (asli)</text>
    <polygon points="20,253 35,253 20,263" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" />
    <text x="40" y="261" fontSize="9" fill="#86efac">△A'B'C' (k=1.5)</text>
    <rect x="165" y="225" width="165" height="38" rx="5" fill="#1e293b" stroke="#334155" />
    <text x="173" y="238" fontSize="9" fill="#fde68a" fontWeight="bold">Rumus:</text>
    <text x="173" y="250" fontSize="9" fill="#fde68a">x'= a + k(x−a)</text>
    <text x="173" y="261" fontSize="9" fill="#fde68a">y'= b + k(y−b)</text>
  </svg>
);

/* ──────────────────────────────────────────────
   SVG GRID HELPERS (sama gaya dengan RotasiPage)
────────────────────────────────────────────── */
const DS = 360, Dsc = DS / 14, Dox = DS / 2, Doy = DS / 2;
const Dpx = (x: number) => Dox + x * Dsc;
const Dpy = (y: number) => Doy - y * Dsc;
const Dticks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

function DGrid({ children, accent = "#22d3ee" }: { children?: React.ReactNode; accent?: string }) {
  return (
    <svg viewBox={`0 0 ${DS} ${DS}`} className="w-full rounded-xl border bg-slate-900/70" style={{ maxWidth: DS, aspectRatio: "1/1", borderColor: `${accent}33` }}>
      {Dticks.map(t => (
        <g key={t}>
          <line x1={Dpx(t)} y1={0} x2={Dpx(t)} y2={DS} stroke="#334155" strokeWidth="0.6" />
          <line x1={0} y1={Dpy(t)} x2={DS} y2={Dpy(t)} stroke="#334155" strokeWidth="0.6" />
        </g>
      ))}
      <line x1={0} y1={Doy} x2={DS} y2={Doy} stroke="#64748b" strokeWidth="1.4" />
      <line x1={Dox} y1={0} x2={Dox} y2={DS} stroke="#64748b" strokeWidth="1.4" />
      <polygon points={`${DS},${Doy} ${DS-7},${Doy-4} ${DS-7},${Doy+4}`} fill="#64748b" />
      <polygon points={`${Dox},0 ${Dox-4},8 ${Dox+4},8`} fill="#64748b" />
      {Dticks.map(t => (
        <g key={t}>
          <text x={Dpx(t)} y={Doy + 13} textAnchor="middle" fill="#64748b" fontSize="9">{t}</text>
          <text x={Dox - 10} y={Dpy(t) + 4} textAnchor="middle" fill="#64748b" fontSize="9">{t}</text>
        </g>
      ))}
      <text x={DS - 6} y={Doy - 5} fill="#94a3b8" fontSize="10">x</text>
      <text x={Dox + 5} y={10} fill="#94a3b8" fontSize="10">y</text>
      {children}
    </svg>
  );
}

function DPoly({ pts, color, fill, label }: { pts: [number, number][]; color: string; fill: string; label?: string }) {
  const d = pts.map(([x, y]) => `${Dpx(x)},${Dpy(y)}`).join(" ");
  const cx = pts.reduce((s, [x]) => s + x, 0) / pts.length;
  const cy = pts.reduce((s, [, y]) => s + y, 0) / pts.length;
  return (
    <g>
      <polygon points={d} fill={fill} stroke={color} strokeWidth="2" />
      {label && <text x={Dpx(cx)} y={Dpy(cy) + 4} textAnchor="middle" fill={color} fontSize="11" fontWeight="bold">{label}</text>}
    </g>
  );
}

function DDot({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={Dpx(x)} cy={Dpy(y)} r={5} fill={color} />
      <text x={Dpx(x) + 8} y={Dpy(y) - 5} fill={color} fontSize="10" fontWeight="bold">{label}</text>
    </g>
  );
}

function DCenterMark({ x, y, color }: { x: number; y: number; color: string }) {
  const cx = Dpx(x), cy = Dpy(y);
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3,2" opacity="0.5" />
      <circle cx={cx} cy={cy} r={6} fill={color} opacity="0.9" />
      <line x1={cx-18} y1={cy} x2={cx+18} y2={cy} stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1={cx} y1={cy-18} x2={cx} y2={cy+18} stroke={color} strokeWidth="1.5" opacity="0.7" />
    </g>
  );
}

/* ── Animasi Interaktif Dilatasi ── */
const D_ORIG: [number, number][] = [[1, 1], [3, 1], [1, 3]];
const D_LABELS = ["A(1,1)", "B(3,1)", "C(1,3)"];
const D_ANIM_MS = 1800;

const K_PRESETS = [
  { label: "½", value: 0.5 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "−1", value: -1 },
  { label: "−2", value: -2 },
];

function dilatePt(x: number, y: number, a: number, b: number, k: number): [number, number] {
  return [a + k * (x - a), b + k * (y - b)];
}

function kLabel(k: number) {
  if (k > 1)        return { text: `k = ${k} — Diperbesar`, color: "#4ade80" };
  if (k === 1)      return { text: `k = 1 — Tidak berubah`, color: "#94a3b8" };
  if (k > 0)        return { text: `k = ${k} — Diperkecil`, color: "#facc15" };
  if (k === -1)     return { text: `k = −1 — Dibalik (sama besar)`, color: "#fb923c" };
  if (k > -1)       return { text: `k = ${k} — Diperkecil & Dibalik`, color: "#fb923c" };
  return            { text: `k = ${k} — Diperbesar & Dibalik`, color: "#f87171" };
}

/* ── Animasi Interaktif Dilatasi TITIK ── */
function AnimasiDilatasiTitik() {
  const [kPreset, setKPreset] = useState<number | "custom">(2);
  const [inputK, setInputK] = useState("2");
  const [centerType, setCenterType] = useState<"origin" | "custom">("origin");
  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");
  const [inputPx, setInputPx] = useState("3");
  const [inputPy, setInputPy] = useState("2");
  const [show, setShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animT, setAnimT] = useState(0);
  const rafRef = useRef<number | null>(null);

  const k  = kPreset === "custom" ? (parseFloat(inputK) || 1) : kPreset;
  const ca = centerType === "origin" ? 0 : (parseFloat(inputA) || 0);
  const cb = centerType === "origin" ? 0 : (parseFloat(inputB) || 0);
  const ptX = parseFloat(inputPx) || 3;
  const ptY = parseFloat(inputPy) || 2;

  const t = isAnimating ? animT : (show ? 1 : 0);
  const kAnim = 1 + t * (k - 1);
  const [curX, curY]: [number, number] = [ca + kAnim * (ptX - ca), cb + kAnim * (ptY - cb)];
  const [resX, resY]: [number, number] = [ca + k * (ptX - ca), cb + k * (ptY - cb)];
  const showResult = show || isAnimating;

  const { text: kText, color: kColor } = kLabel(k);
  const resultColor = k >= 1 ? "#4ade80" : k > 0 ? "#facc15" : k > -1 ? "#fb923c" : "#f87171";
  const boxFill    = k > 1  ? "#16a34a" : k > 0 ? "#ca8a04" : k > -1 ? "#ea580c" : "#dc2626";

  const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

  const reset = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(false); setAnimT(0);
  };

  const handlePutar = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(true); setAnimT(0);
    const t0 = performance.now();
    const tick = (now: number) => {
      const raw = Math.min((now - t0) / 1800, 1);
      setAnimT(easeOut(raw));
      if (raw < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { setAnimT(1); setIsAnimating(false); setShow(true); }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const changeReset = (fn: () => void) => {
    fn();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(false); setAnimT(0);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const rx_ = Math.round(resX * 100) / 100;
  const ry_ = Math.round(resY * 100) / 100;

  /* sinar dari pusat melewati P hingga P' (atau sebaliknya jika k < 0) */
  const rayExtend = 6.5; // satuan koordinat
  const dx = ptX - ca, dy = ptY - cb;
  const len = Math.sqrt(dx * dx + dy * dy);
  const rayEnd: [number, number] = len > 0
    ? [ca + (dx / len) * rayExtend, cb + (dy / len) * rayExtend]
    : [ca, cb];
  const rayEndNeg: [number, number] = [ca - (dx / len) * rayExtend, cb - (dy / len) * rayExtend];

  return (
    <div className="space-y-4 pt-2">
      <p className="text-yellow-300 font-bold text-sm font-body">📍 Animasi Interaktif — Dilatasi Titik</p>

      {/* Input titik P */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Titik yang Didilatasi</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold font-body text-yellow-300">P =</span>
          <span className="text-sm text-white/60 font-body">(</span>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-white/50 font-body">x =</label>
            <input type="number" value={inputPx}
              onChange={e => changeReset(() => setInputPx(e.target.value))}
              className="w-16 bg-slate-700 border border-yellow-500/50 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-yellow-400"
            />
          </div>
          <span className="text-white/40">,</span>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-white/50 font-body">y =</label>
            <input type="number" value={inputPy}
              onChange={e => changeReset(() => setInputPy(e.target.value))}
              className="w-16 bg-slate-700 border border-yellow-500/50 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-yellow-400"
            />
          </div>
          <span className="text-sm text-white/60 font-body">)</span>
        </div>
      </div>

      {/* Pilih k */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Faktor Skala k</p>
        <div className="flex gap-2 flex-wrap">
          {K_PRESETS.map(({ label, value }) => (
            <button key={label}
              onClick={() => changeReset(() => { setKPreset(value); setInputK(String(value)); })}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
                kPreset === value
                  ? "bg-yellow-500 border-yellow-400 text-white shadow-lg shadow-yellow-500/30"
                  : "bg-slate-700/60 border-slate-600 text-white/60 hover:border-yellow-500/50 hover:text-white/90"
              }`}
            >k = {label}</button>
          ))}
          <button onClick={() => changeReset(() => setKPreset("custom"))}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
              kPreset === "custom"
                ? "bg-violet-500 border-violet-400 text-white shadow-lg"
                : "bg-slate-700/60 border-slate-600 text-white/60 hover:text-white/90"
            }`}
          >Lainnya…</button>
        </div>
        {kPreset === "custom" && (
          <div className="flex items-center gap-3 pt-1">
            <label className="text-xs text-white/60 font-body">k =</label>
            <input type="number" step="0.1" value={inputK}
              onChange={e => changeReset(() => setInputK(e.target.value))}
              className="w-20 bg-slate-700 border border-violet-500/50 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-violet-400"
            />
          </div>
        )}
        <p className="text-xs font-body font-semibold mt-1" style={{ color: kColor }}>{kText}</p>
      </div>

      {/* Pilih pusat */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Pusat Dilatasi</p>
        <div className="flex gap-2">
          {(["origin", "custom"] as const).map(c => (
            <button key={c}
              onClick={() => changeReset(() => setCenterType(c))}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
                centerType === c
                  ? "bg-yellow-500/80 border-yellow-400 text-white shadow-md"
                  : "bg-slate-700/60 border-slate-600 text-white/60 hover:text-white/90"
              }`}
            >{c === "origin" ? "O(0, 0)" : "Titik (a, b)"}</button>
          ))}
        </div>
        {centerType === "custom" && (
          <div className="flex items-center gap-3 pt-1">
            <label className="text-xs text-white/60 font-body">a =</label>
            <input type="number" value={inputA} onChange={e => changeReset(() => setInputA(e.target.value))}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono" />
            <label className="text-xs text-white/60 font-body">b =</label>
            <input type="number" value={inputB} onChange={e => changeReset(() => setInputB(e.target.value))}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono" />
          </div>
        )}
      </div>

      {/* Grid + Panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full overflow-hidden">

        <div className="w-full max-w-[360px] mx-auto lg:mx-0 flex-shrink-0">
          <DGrid accent={resultColor}>

            {/* Sinar dari pusat (garis panjang menunjukkan arah dilatasi) */}
            {len > 0 && (
              <>
                <line
                  x1={Dpx(rayEnd[0])} y1={Dpy(rayEnd[1])}
                  x2={Dpx(rayEndNeg[0])} y2={Dpy(rayEndNeg[1])}
                  stroke="#facc15" strokeWidth="1" strokeDasharray="6,4" opacity="0.25"
                />
                {/* Sinar dari pusat ke P' saat ini (lebih terang, mengikuti animasi) */}
                {showResult && (
                  <line
                    x1={Dpx(ca)} y1={Dpy(cb)}
                    x2={Dpx(curX)} y2={Dpy(curY)}
                    stroke="#facc15" strokeWidth="1.8" strokeDasharray="5,3" opacity="0.7"
                  />
                )}
              </>
            )}

            {/* Label k — textbox cerah atas tengah */}
            {showResult && (() => {
              const bx = DS / 2, by = 18, bw = 80, bh = 28;
              return (
                <g>
                  <rect x={bx-bw/2} y={by-bh/2} width={bw} height={bh} rx={7} ry={7}
                    fill={boxFill} stroke="#fff" strokeWidth="1.5" opacity="0.93" />
                  <text x={bx} y={by+5} fontSize="14" fill="#fff" textAnchor="middle" fontWeight="bold">
                    k = {k}
                  </text>
                </g>
              );
            })()}

            {/* Titik P asli */}
            <DDot x={ptX} y={ptY} color="#22d3ee" label={`P(${ptX},${ptY})`} />

            {/* Titik P' (bergerak perlahan selama animasi) */}
            {showResult && (
              <g>
                <circle cx={Dpx(curX)} cy={Dpy(curY)} r={8} fill={resultColor} opacity="0.9" />
                <circle cx={Dpx(curX)} cy={Dpy(curY)} r={13} fill="none" stroke={resultColor} strokeWidth="1.5" opacity="0.45" />
                {show && !isAnimating && (
                  <text x={Dpx(curX) + 11} y={Dpy(curY) - 8} fill={resultColor} fontSize="10" fontWeight="bold">
                    P'({rx_},{ry_})
                  </text>
                )}
              </g>
            )}

            {/* Pusat dilatasi */}
            <DCenterMark x={ca} y={cb} color="#facc15" />
            <text x={Dpx(ca)+16} y={Dpy(cb)-14} fill="#facc15" fontSize="11" fontWeight="bold">
              {centerType === "origin" ? "O(0,0)" : `P(${ca},${cb})`}
            </text>

          </DGrid>

          {/* Legenda */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center text-xs font-body">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-cyan-400 inline-block" />
              <span className="text-cyan-300">Titik P asli</span>
            </div>
            {showResult && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded inline-block" style={{ background: resultColor }} />
                <span style={{ color: resultColor }}>Titik P' bayangan</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-yellow-400 inline-block" />
              <span className="text-yellow-300">Pusat & sinar</span>
            </div>
          </div>
        </div>

        {/* Panel kanan */}
        <div className="flex-1 min-w-0 space-y-2 w-full">

          <div className="flex gap-2">
            <button onClick={handlePutar} disabled={isAnimating}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all ${
                isAnimating
                  ? "opacity-50 cursor-not-allowed bg-slate-600"
                  : "bg-yellow-500 hover:bg-yellow-400 text-white shadow-lg shadow-yellow-500/30"
              }`}
            >{isAnimating ? "⏳ Mendilatasi…" : "🔭 Dilatasikan!"}</button>
            <button onClick={reset}
              className="px-4 py-2.5 rounded-xl font-bold text-sm font-body bg-slate-700 hover:bg-slate-600 text-white/70 transition-all"
            >Reset</button>
          </div>

          <div className="bg-slate-700/40 rounded-xl p-3 space-y-1 text-xs font-body">
            <p className="font-bold text-sm" style={{ color: kColor }}>{kText}</p>
            <p className="text-white/50">Titik: P({ptX}, {ptY})</p>
            <p className="text-white/50">Pusat: {centerType === "origin" ? "O(0, 0)" : `(${ca}, ${cb})`}</p>
            {isAnimating && <p className="text-yellow-400 font-semibold animate-pulse">⏳ Slow-motion dilatasi titik…</p>}
          </div>

          {show && !isAnimating && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-yellow-300 font-body uppercase">Hasil Dilatasi Titik:</p>
              <div className="flex items-center gap-2 text-sm font-body flex-wrap">
                <span className="text-cyan-300 font-semibold">P({ptX}, {ptY})</span>
                <span className="text-white/30 text-lg">→</span>
                <span className="font-bold text-base" style={{ color: resultColor }}>P'({rx_}, {ry_})</span>
              </div>
              <p className="text-xs text-white/40 font-body">
                Rumus: <span className="text-white/70">x' = {ca} + {k}×({ptX}−{ca}) = {rx_}</span>
              </p>
              <p className="text-xs text-white/40 font-body">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-white/70">y' = {cb} + {k}×({ptY}−{cb}) = {ry_}</span>
              </p>
            </div>
          )}

          <div className="bg-slate-800/50 rounded-xl p-3 text-xs font-body text-white/50 space-y-1.5 w-full overflow-hidden">
            <p className="text-yellow-300 font-semibold">💡 Keterangan visual:</p>
            <p>— <span className="text-cyan-400">Titik biru</span> = P asli (tidak bergerak)</p>
            <p>— <span style={{ color: resultColor }}>Titik berwarna</span> = P' bergerak perlahan ke posisi bayangan</p>
            <p>— <span className="text-yellow-400">Garis kuning</span> = sinar dari pusat dilatasi</p>
            <p>— Jarak ke pusat: <strong className="text-white/70">k × OP</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimasiDilatasi() {
  const [kPreset, setKPreset] = useState<number | "custom">(2);
  const [inputK, setInputK] = useState("2");
  const [centerType, setCenterType] = useState<"origin" | "custom">("origin");
  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");
  const [show, setShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animT, setAnimT] = useState(0);   // 0..1
  const rafRef = useRef<number | null>(null);

  const k = kPreset === "custom" ? (parseFloat(inputK) || 1) : kPreset;
  const ca = centerType === "origin" ? 0 : (parseFloat(inputA) || 0);
  const cb = centerType === "origin" ? 0 : (parseFloat(inputB) || 0);

  /* kAnim interpolates: 1 → k (shape grows/shrinks smoothly) */
  const t = isAnimating ? animT : (show ? 1 : 0);
  const kAnim = 1 + t * (k - 1);

  const currentPts = D_ORIG.map(([x, y]) => dilatePt(x, y, ca, cb, kAnim) as [number, number]);
  const targetPts  = D_ORIG.map(([x, y]) => dilatePt(x, y, ca, cb, k)    as [number, number]);
  const showResult = show || isAnimating;

  const { text: kText, color: kColor } = kLabel(k);

  const resultColor = k >= 1 ? "#4ade80" : k > 0 ? "#facc15" : k > -1 ? "#fb923c" : "#f87171";
  const accentColor = resultColor;

  const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

  const reset = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(false); setAnimT(0);
  };

  const handlePutar = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(true); setAnimT(0);
    const t0 = performance.now();
    const tick = (now: number) => {
      const raw = Math.min((now - t0) / D_ANIM_MS, 1);
      setAnimT(easeOut(raw));
      if (raw < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { setAnimT(1); setIsAnimating(false); setShow(true); }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const changeReset = (fn: () => void) => {
    fn();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(false); setAnimT(0);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  /* label textbox di atas SVG */
  const boxFill = k > 1 ? "#16a34a" : k > 0 ? "#ca8a04" : k > -1 ? "#ea580c" : "#dc2626";

  return (
    <div className="space-y-4 pt-2">
      <p className="text-emerald-300 font-bold text-sm font-body">🔭 Animasi Interaktif — Dilatasi Bangun Datar</p>

      {/* Pilih faktor k */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Faktor Skala k</p>
        <div className="flex gap-2 flex-wrap">
          {K_PRESETS.map(({ label, value }) => (
            <button key={label}
              onClick={() => changeReset(() => { setKPreset(value); setInputK(String(value)); })}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
                kPreset === value
                  ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-slate-700/60 border-slate-600 text-white/60 hover:border-emerald-500/50 hover:text-white/90"
              }`}
            >k = {label}</button>
          ))}
          <button
            onClick={() => changeReset(() => setKPreset("custom"))}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
              kPreset === "custom"
                ? "bg-violet-500 border-violet-400 text-white shadow-lg"
                : "bg-slate-700/60 border-slate-600 text-white/60 hover:text-white/90"
            }`}
          >Lainnya…</button>
        </div>
        {kPreset === "custom" && (
          <div className="flex items-center gap-3 pt-1">
            <label className="text-xs text-white/60 font-body">k =</label>
            <input
              type="number" step="0.1" value={inputK}
              onChange={e => changeReset(() => setInputK(e.target.value))}
              className="w-20 bg-slate-700 border border-violet-500/50 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-violet-400"
            />
          </div>
        )}
        <p className="text-xs font-body font-semibold mt-1" style={{ color: kColor }}>{kText}</p>
      </div>

      {/* Pilih pusat */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Pusat Dilatasi</p>
        <div className="flex gap-2">
          {(["origin", "custom"] as const).map(c => (
            <button key={c}
              onClick={() => changeReset(() => setCenterType(c))}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
                centerType === c
                  ? "bg-yellow-500/80 border-yellow-400 text-white shadow-md"
                  : "bg-slate-700/60 border-slate-600 text-white/60 hover:text-white/90"
              }`}
            >{c === "origin" ? "O(0, 0)" : "Titik (a, b)"}</button>
          ))}
        </div>
        {centerType === "custom" && (
          <div className="flex items-center gap-3 pt-1">
            <label className="text-xs text-white/60 font-body">a =</label>
            <input type="number" value={inputA} onChange={e => changeReset(() => setInputA(e.target.value))} className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono" />
            <label className="text-xs text-white/60 font-body">b =</label>
            <input type="number" value={inputB} onChange={e => changeReset(() => setInputB(e.target.value))} className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono" />
          </div>
        )}
      </div>

      {/* Grid + Panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full overflow-hidden">

        {/* SVG Grid */}
        <div className="w-full max-w-[360px] mx-auto lg:mx-0 flex-shrink-0">
          <DGrid accent={accentColor}>

            {/* Sinar dari pusat ke titik saat ini */}
            {showResult && currentPts.map(([x, y], i) => (
              <line key={i}
                x1={Dpx(ca)} y1={Dpy(cb)}
                x2={Dpx(x)}  y2={Dpy(y)}
                stroke="#facc15" strokeWidth="1.2" strokeDasharray="5,4" opacity="0.55"
              />
            ))}

            {/* Segitiga asli — memudar saat animasi berlangsung */}
            <DPoly
              pts={D_ORIG}
              color="#22d3ee"
              fill={showResult ? "rgba(34,211,238,0.06)" : "rgba(34,211,238,0.18)"}
              label={showResult ? undefined : "△ABC"}
            />
            {!showResult && D_ORIG.map(([x, y], i) => (
              <DDot key={i} x={x} y={y} color="#22d3ee" label={["A","B","C"][i]} />
            ))}

            {/* Segitiga animasi (membesar/mengecil saat bergerak) */}
            {showResult && (
              <g>
                <DPoly
                  pts={currentPts}
                  color={resultColor}
                  fill={isAnimating ? `${resultColor}44` : `${resultColor}28`}
                  label={show && !isAnimating ? "△A'B'C'" : undefined}
                />
                {currentPts.map(([x, y], i) => (
                  <DDot key={i} x={x} y={y} color={resultColor}
                    label={show && !isAnimating ? ["A'","B'","C'"][i] : ""} />
                ))}
                {/* Titik asli tetap tampak kecil */}
                {D_ORIG.map(([x, y], i) => (
                  <circle key={i} cx={Dpx(x)} cy={Dpy(y)} r={3} fill="#22d3ee" opacity="0.4" />
                ))}
              </g>
            )}

            {/* Label k — textbox cerah atas tengah */}
            {showResult && (() => {
              const bx = DS / 2, by = 18, bw = 84, bh = 28;
              return (
                <g>
                  <rect x={bx-bw/2} y={by-bh/2} width={bw} height={bh} rx={7} ry={7}
                    fill={boxFill} stroke="#fff" strokeWidth="1.5" opacity="0.93" />
                  <text x={bx} y={by+5} fontSize="14" fill="#fff" textAnchor="middle" fontWeight="bold">
                    k = {k}
                  </text>
                </g>
              );
            })()}

            {/* Pusat dilatasi */}
            <DCenterMark x={ca} y={cb} color="#facc15" />
            <text x={Dpx(ca)+16} y={Dpy(cb)-14} fill="#facc15" fontSize="11" fontWeight="bold">
              {centerType === "origin" ? "O(0,0)" : `P(${ca},${cb})`}
            </text>

          </DGrid>

          {/* Legenda */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center text-xs font-body">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-cyan-400 inline-block" />
              <span className="text-cyan-300">Asli (△ABC)</span>
            </div>
            {showResult && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded inline-block" style={{ background: resultColor }} />
                <span style={{ color: resultColor }}>Bayangan (△A'B'C')</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-yellow-400 inline-block" />
              <span className="text-yellow-300">Pusat & sinar</span>
            </div>
          </div>
        </div>

        {/* Panel kanan */}
        <div className="flex-1 min-w-0 space-y-2 w-full">

          {/* Tombol */}
          <div className="flex gap-2">
            <button onClick={handlePutar} disabled={isAnimating}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all ${
                isAnimating
                  ? "opacity-50 cursor-not-allowed bg-slate-600"
                  : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30"
              }`}
            >{isAnimating ? "⏳ Mendilatasi…" : "🔭 Dilatasikan!"}</button>
            <button onClick={reset}
              className="px-4 py-2.5 rounded-xl font-bold text-sm font-body bg-slate-700 hover:bg-slate-600 text-white/70 transition-all"
            >Reset</button>
          </div>

          {/* Bingkai info */}
          <div className="bg-slate-700/40 rounded-xl p-3 space-y-1 text-xs font-body">
            <p className="font-bold text-sm" style={{ color: kColor }}>{kText}</p>
            <p className="text-white/50">Pusat: {centerType === "origin" ? "O(0, 0)" : `(${ca}, ${cb})`}</p>
            {isAnimating && <p className="text-emerald-400 font-semibold animate-pulse">⏳ Slow-motion dilatasi…</p>}
          </div>

          {/* Hasil */}
          {show && !isAnimating && (
            <div className="bg-slate-700/40 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-white/60 font-body uppercase">Hasil Dilatasi:</p>
              {D_ORIG.map(([x, y], i) => {
                const [rx, ry] = targetPts[i];
                const rx_ = Math.round(rx * 100) / 100;
                const ry_ = Math.round(ry * 100) / 100;
                return (
                  <div key={i} className="flex items-center gap-2 text-sm font-body flex-wrap">
                    <span className="text-cyan-300 min-w-[68px]">{D_LABELS[i]}</span>
                    <span className="text-white/30">→</span>
                    <span className="font-bold" style={{ color: resultColor }}>({rx_}, {ry_})</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Petunjuk */}
          <div className="bg-slate-800/50 rounded-xl p-3 text-xs font-body text-white/50 space-y-1.5 w-full overflow-hidden">
            <p className="text-emerald-300 font-semibold">💡 Keterangan visual:</p>
            <p>— <span className="text-cyan-400">Segitiga biru</span> = △ABC asli</p>
            <p>— <span style={{ color: resultColor }}>Segitiga berwarna</span> = △A'B'C' bayangan</p>
            <p>— <span className="text-yellow-400">Garis kuning</span> = sinar dari pusat ke titik</p>
            <p>— Animasi <strong className="text-white">slow-motion</strong>: bangun membesar/mengecil perlahan</p>
            <p>— Rumus: <strong className="text-white/70">A'(a+k·(x−a), b+k·(y−b))</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN PAGE COMPONENT
────────────────────────────────────────────── */

const DilatasisPage = () => {
  const navigate = useNavigate();
  const expandedSections = [
    "intro", "animasi-titik", "animasi", "konsep1", "contoh1", "konsep2", "contoh2", "konsep3", "contoh3",
  ];

  const SectionHeader = ({
    id, icon, label, iconColor,
  }: { id: string; icon: React.ReactNode; label: string; iconColor: string }) => (
    <div className="w-full flex items-center px-5 py-4 text-left">
      <div className="flex items-center gap-3">
        <span style={{ color: iconColor }}>{icon}</span>
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          DILATASI
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Transformasi Geometri · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="intro"
              icon={<Lightbulb className="w-5 h-5" />}
              iconColor="#facc15"
              label="🚀 Apa Itu Dilatasi? Kenalan Dulu, Yuk!"
            />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernah melihat foto yang diperbesar atau diperkecil di HP kamu? Atau mungkin kamu pernah memakai
                  aplikasi maps yang bisa di-zoom in dan zoom out? Nah, konsep di balik itu semua adalah <strong className="text-cyan-300">Dilatasi</strong>!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Dalam matematika, dilatasi adalah jenis transformasi yang mengubah ukuran bangun (memperbesar
                    atau memperkecil), tetapi <strong>tidak mengubah bentuknya</strong>. Bangun asal dan hasil
                    dilatasi selalu <strong>sebangun (similar)</strong> — sudut-sudutnya tetap sama, hanya sisinya
                    yang berubah panjangnya. 🔭
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Kata Kunci:</strong> Dilatasi ditentukan oleh dua hal utama:{" "}
                    <strong className="text-yellow-300">Pusat Dilatasi</strong> (titik acuan) dan{" "}
                    <strong className="text-yellow-300">Faktor Skala k</strong> (besar/kecilnya perubahan ukuran).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════
              SUB-BAB 1: PENGERTIAN DILATASI
          ═══════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="konsep1"
              icon={<Target className="w-5 h-5" />}
              iconColor="#4ade80"
              label="📘 Sub-Bab 1: Pengertian Dilatasi"
            />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Dilatasi</strong> adalah transformasi geometri yang
                    memetakan setiap titik pada bidang ke titik baru berdasarkan <strong>pusat dilatasi</strong>{" "}
                    dan <strong>faktor skala</strong> tertentu.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">Sifat-sifat Dilatasi:</p>
                    <ul className="font-body text-sm text-white/80 space-y-1 list-disc list-inside">
                      <li>Bentuk bangun <strong>tidak berubah</strong> (tetap sebangun)</li>
                      <li>Ukuran berubah sesuai faktor skala <InlineMath math="k" /></li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="\text{OA}' = k \times \text{OA}" />
                    <p className="font-body text-xs text-white/60 text-center mt-1">
                      Jarak titik hasil ke pusat = k × jarak titik asal ke pusat
                    </p>
                  </div>
                </div>

                {/* Tabel faktor skala */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 overflow-x-auto">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">📊 TABEL FAKTOR SKALA:</p>
                  <table className="w-full font-body text-xs text-white/80">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 text-cyan-300">Nilai k</th>
                        <th className="text-left py-2 text-cyan-300">Efek</th>
                        <th className="text-left py-2 text-cyan-300">Contoh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      <tr><td className="py-2"><InlineMath math="k > 1" /></td><td className="text-green-300">Diperbesar, searah</td><td><InlineMath math="k = 3" /></td></tr>
                      <tr><td className="py-2"><InlineMath math="k = 1" /></td><td className="text-white/60">Tidak berubah</td><td><InlineMath math="k = 1" /></td></tr>
                      <tr><td className="py-2"><InlineMath math="0 < k < 1" /></td><td className="text-yellow-300">Diperkecil, searah</td><td><InlineMath math="k = \frac{1}{2}" /></td></tr>
                      <tr><td className="py-2"><InlineMath math="-1 < k < 0" /></td><td className="text-orange-300">Diperkecil, dibalik</td><td><InlineMath math="k = -\frac{1}{2}" /></td></tr>
                      <tr><td className="py-2"><InlineMath math="k < -1" /></td><td className="text-red-300">Diperbesar, dibalik</td><td><InlineMath math="k = -2" /></td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Nilai <InlineMath math="k" /> positif → posisi bayangan searah dengan titik asalnya (dilihat dari pusat dilatasi). Nilai <InlineMath math="k" /> negatif → bayangan ada di sisi berlawanan dari pusat dilatasi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── GAMBAR KAMERA — DI ATAS ANIMASI DILATASI TITIK ── */}
          <div className="rounded-xl overflow-hidden">
            <img
              src="/kamera-dilatasi.jpg"
              alt="Fotografer menggunakan lensa zoom — ilustrasi konsep dilatasi dalam kehidupan nyata"
              className="w-full rounded-xl object-cover"
            />
            <a
              href="https://iframerental.com/blog-cara-memotret"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-cyan-400/50 hover:text-cyan-300 text-right mt-1 font-body block transition-colors"
            >
              iframerental.com/blog-cara-memotret
            </a>
          </div>

          {/* ── ANIMASI INTERAKTIF — DILATASI TITIK ── */}
          <div className="bg-card/80 backdrop-blur border border-yellow-500/20 rounded-xl overflow-hidden">
            <SectionHeader
              id="animasi-titik"
              icon={<span>📍</span>}
              iconColor="#facc15"
              label="Animasi Interaktif — Dilatasi Titik"
            />
            {expandedSections.includes("animasi-titik") && (
              <div className="px-5 pb-5">
                <AnimasiDilatasiTitik />
              </div>
            )}
          </div>

          {/* ── ANIMASI INTERAKTIF — DILATASI BANGUN DATAR ── */}
          <div className="bg-card/80 backdrop-blur border border-emerald-500/20 rounded-xl overflow-hidden">
            <SectionHeader
              id="animasi"
              icon={<span>🔭</span>}
              iconColor="#34d399"
              label="Animasi Interaktif — Dilatasi Bangun Datar"
            />
            {expandedSections.includes("animasi") && (
              <div className="px-5 pb-5">
                <AnimasiDilatasi />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════
              SUB-BAB 2: DILATASI PUSAT (0,0)
          ═══════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="konsep2"
              icon={<Target className="w-5 h-5" />}
              iconColor="#60a5fa"
              label="📘 Sub-Bab 2: Dilatasi Pusat O(0,0) dengan Faktor Skala k"
            />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika pusat dilatasi ada di titik asal <InlineMath math="O(0, 0)" />, rumusnya jadi super
                    simpel! Cukup kalikan koordinat titik asal dengan faktor skala <InlineMath math="k" />.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-blue-300">📐 RUMUS DILATASI PUSAT O(0,0):</p>
                    <BlockMath math="[O, k]: A(x, y) \longrightarrow A'(kx,\ ky)" />
                    <div className="grid grid-cols-2 gap-3 text-xs font-body text-white/80">
                      <div className="bg-slate-800/60 rounded p-3">
                        <p className="text-blue-300 font-semibold mb-1">Titik Asal</p>
                        <p><InlineMath math="A(x,\ y)" /></p>
                      </div>
                      <div className="bg-slate-800/60 rounded p-3">
                        <p className="text-green-300 font-semibold mb-1">Titik Bayangan</p>
                        <p><InlineMath math="A'(kx,\ ky)" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Untuk dilatasi pusat O(0,0), cukup <em>kalikan semua koordinat dengan k</em>.
                    Titik-titik yang ada di koordinat negatif juga ikut berubah! Contoh:{" "}
                    <InlineMath math="A(-3, 2) \xrightarrow{k=2} A'(-6, 4)" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── ILUSTRASI DILATASI ── */}
          <div className="rounded-xl overflow-hidden">
            <p className="font-body text-sm font-bold text-center text-white tracking-widest uppercase mb-2">
              Ilustrasi Dilatasi Pusat O(0,0) dengan Faktor Skala k
            </p>
            <img
              src="/dilatasi-ilustrasi.jpg"
              alt="Transformasi Geometri: Dilatasi — Skala Faktor k = 1.5, Pusat di Asal (0,0). Persegi PQRS (biru) didilatasi menjadi P'Q'R'S' (ungu) dengan garis sinar kuning dari pusat O."
              className="w-full max-w-md mx-auto block rounded-xl object-cover"
            />
            <p className="font-body text-xs text-white/60 text-center mt-2 px-2">
              Ilustrasi dilatasi persegi PQRS dengan faktor skala <strong className="text-yellow-300">k = 1,5</strong> dan pusat di titik asal <strong className="text-yellow-300">O(0, 0)</strong>. Bayangan P'Q'R'S' (ungu) lebih besar dari bangun asli PQRS (biru). Garis kuning putus-putus menunjukkan sinar dari pusat dilatasi melewati setiap titik sudut.
            </p>
            <a
              href="https://www.quipper.com/id/blog/mapel/matematika/dilatasi-matematika/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-cyan-400/50 hover:text-cyan-300 text-right mt-1 font-body block transition-colors"
            >
              Sumber: quipper.com/id/blog/mapel/matematika/dilatasi-matematika
            </a>
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="contoh1"
              icon={<Calculator className="w-5 h-5" />}
              iconColor="#60a5fa"
              label="📝 Contoh Soal — Pengertian Dilatasi"
            />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Perhatikan diagram berikut.</p>
                    <div className="flex items-center gap-2 font-body text-sm text-white flex-wrap">
                      <InlineMath math="A(3,\ 5)" />
                      <span className="inline-flex flex-col items-center mx-1">
                        <span className="text-[10px] text-white/70 leading-none mb-0.5">[(0, 0), 2]</span>
                        <span className="flex items-center text-white leading-none">
                          <span className="inline-block h-px w-10 bg-white align-middle"></span>
                          <span className="text-base leading-none -ml-0.5">▶</span>
                        </span>
                      </span>
                      <InlineMath math="A'(x',\ y')" />
                    </div>
                    <p className="font-body text-sm text-white">
                      Diagram di atas menunjukkan dilatasi titik <InlineMath math="A" /> dengan pusat di titik{" "}
                      <InlineMath math="(0,\ 0)" /> sebesar 2 kali. Koordinat titik <InlineMath math="A'" /> adalah . . . .
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-body text-sm text-white/90">
                      <p>A. &nbsp;(6, 5)</p>
                      <p>C. &nbsp;(3, 10)</p>
                      <p>B. &nbsp;(6, 10)</p>
                      <p>D. &nbsp;(9, 10)</p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Diketahui:</strong> <InlineMath math="A(3,\ 5)" />, pusat <InlineMath math="O(0,\ 0)" />, <InlineMath math="k = 2" /></p>
                      <p><strong>Gunakan rumus dilatasi pusat O(0,0):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="A'(kx,\ ky) = A'(2 \times 3,\ 2 \times 5) = A'(6,\ 10)" />
                      </div>
                      <p><strong className="text-green-300">Jawaban: B. (6, 10)</strong></p>
                      <p className="text-white/60 text-xs">Karena k = 2, semua koordinat dikalikan 2.</p>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 font-body text-sm text-white flex-wrap">
                      <InlineMath math="Q(4,\ -6)" />
                      <span className="inline-flex flex-col items-center mx-1">
                        <span className="text-[10px] text-white/70 leading-none mb-0.5">[(0, 0), k]</span>
                        <span className="flex items-center text-white leading-none">
                          <span className="inline-block h-px w-10 bg-white align-middle"></span>
                          <span className="text-base leading-none -ml-0.5">▶</span>
                        </span>
                      </span>
                      <InlineMath math="Q'(-2,\ 3)" />
                    </div>
                    <p className="font-body text-sm text-white">
                      Faktor dilatasi <InlineMath math="k" /> = . . . .
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-body text-sm text-white/90">
                      <p>A. &nbsp;2</p>
                      <p>C. &nbsp;<InlineMath math="-\dfrac{1}{2}" /></p>
                      <p>B. &nbsp;<InlineMath math="\dfrac{1}{2}" /></p>
                      <p>D. &nbsp;−2</p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Gunakan rumus:</strong> <InlineMath math="Q'(kx,\ ky)" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="kx = -2 \Rightarrow k \times 4 = -2 \Rightarrow k = -\frac{1}{2}" />
                        <p className="text-xs text-white/60">Verifikasi: <InlineMath math="k \times (-6) = -\frac{1}{2} \times (-6) = 3\ \checkmark" /></p>
                      </div>
                      <p><strong className="text-yellow-300">Jawaban: C. <InlineMath math="-\dfrac{1}{2}" /></strong></p>
                      <p className="text-white/60 text-xs">Nilai k negatif berarti bayangan berada di sisi berlawanan dari pusat dilatasi.</p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    {/* SVG diagram: △PQR → △P'Q'R', pusat O, k = 1/3 */}
                    {/* Grid unit = 30px. O at pixel (20,285). Coords: P(0,9) Q(3,4) R(9,4) */}
                    {/* k=1/3 → P'(0,3) Q'(1,4/3) R'(3,4/3)                                */}
                    <svg viewBox="0 0 340 305" className="w-full max-w-xs mx-auto rounded-lg" style={{ background: "transparent" }}>
                      {/* Grid */}
                      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
                        <line key={`v${i}`} x1={20+i*30} y1={15} x2={20+i*30} y2={285} stroke="#334155" strokeWidth="0.7" />
                      ))}
                      {[0,1,2,3,4,5,6,7,8,9].map(i => (
                        <line key={`h${i}`} x1={20} y1={15+i*30} x2={320} y2={15+i*30} stroke="#334155" strokeWidth="0.7" />
                      ))}
                      {/* Border */}
                      <rect x="20" y="15" width="300" height="270" fill="none" stroke="#475569" strokeWidth="1" />
                      {/* Dashed projection lines from O through each vertex pair */}
                      <line x1={20} y1={285} x2={20} y2={15}   stroke="#facc15" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
                      <line x1={20} y1={285} x2={110} y2={165} stroke="#facc15" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
                      <line x1={20} y1={285} x2={290} y2={165} stroke="#facc15" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
                      {/* Large triangle PQR */}
                      <polygon points="20,15 110,165 290,165" fill="rgba(59,130,246,0.25)" stroke="#60a5fa" strokeWidth="1.8" />
                      {/* Small triangle P'Q'R' */}
                      <polygon points="20,195 50,245 110,245" fill="rgba(34,197,94,0.25)" stroke="#4ade80" strokeWidth="1.8" />
                      {/* Vertex dots */}
                      {([[20,15],[110,165],[290,165]] as [number,number][]).map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r={4} fill="#60a5fa" />
                      ))}
                      {([[20,195],[50,245],[110,245]] as [number,number][]).map(([x,y],i) => (
                        <circle key={`p${i}`} cx={x} cy={y} r={4} fill="#4ade80" />
                      ))}
                      <circle cx={20} cy={285} r={5} fill="#f97316" />
                      {/* Labels */}
                      <text x={8}   y={13}  fontSize="12" fontFamily="serif" fontWeight="bold" fill="#93c5fd">P</text>
                      <text x={114} y={163} fontSize="12" fontFamily="serif" fontWeight="bold" fill="#93c5fd">Q</text>
                      <text x={293} y={163} fontSize="12" fontFamily="serif" fontWeight="bold" fill="#93c5fd">R</text>
                      <text x={3}   y={197} fontSize="12" fontFamily="serif" fontWeight="bold" fill="#86efac">P′</text>
                      <text x={33}  y={261} fontSize="12" fontFamily="serif" fontWeight="bold" fill="#86efac">Q′</text>
                      <text x={113} y={261} fontSize="12" fontFamily="serif" fontWeight="bold" fill="#86efac">R′</text>
                      <text x={5}   y={300} fontSize="12" fontFamily="serif" fontWeight="bold" fill="#f97316">O</text>
                    </svg>
                    <p className="font-body text-sm text-white">
                      Faktor skala pada dilatasi <InlineMath math="\triangle PQR" /> ke{" "}
                      <InlineMath math="\triangle P'Q'R'" /> adalah . . . .
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-body text-sm text-white/90">
                      <p>A. &nbsp;<InlineMath math="\dfrac{1}{3}" /></p>
                      <p>C. &nbsp;2</p>
                      <p>B. &nbsp;<InlineMath math="\dfrac{1}{2}" /></p>
                      <p>D. &nbsp;3</p>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Perhatikan diagram. Pusat dilatasi adalah titik <InlineMath math="O" />. Bandingkan jarak titik-titik sudut dari pusat <InlineMath math="O" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="k = \frac{OP'}{OP} = \frac{OQ'}{OQ} = \frac{OR'}{OR} = \frac{1}{3}" />
                      </div>
                      <p><InlineMath math="\triangle P'Q'R'" /> lebih kecil dari <InlineMath math="\triangle PQR" />, sehingga <InlineMath math="0 &lt; k &lt; 1" /> (diperkecil).</p>
                      <p><strong className="text-red-300">Jawaban: A. <InlineMath math="\dfrac{1}{3}" /></strong></p>
                      <p className="text-white/60 text-xs">Karena 0 &lt; k &lt; 1, bangun hasil dilatasi lebih kecil dari bangun asalnya.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="contoh2"
              icon={<Calculator className="w-5 h-5" />}
              iconColor="#60a5fa"
              label="📝 Contoh Soal — Dilatasi Pusat O(0,0)"
            />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5" />
            )}
          </div>

          {/* ═══════════════════════════════════════
              SUB-BAB 3: DILATASI PUSAT (a,b)
          ═══════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="konsep3"
              icon={<Target className="w-5 h-5" />}
              iconColor="#c084fc"
              label="📘 Sub-Bab 3: Dilatasi Pusat P(a,b) dengan Faktor Skala k"
            />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bagaimana jika pusat dilatasinya bukan di titik <InlineMath math="(0,0)" />, melainkan di
                    sembarang titik <InlineMath math="P(a, b)" />? Rumusnya sedikit lebih panjang, tapi logikanya
                    tetap sama: ukur jarak dari pusat, lalu kalikan dengan <InlineMath math="k" />.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-purple-300">📐 RUMUS DILATASI PUSAT P(a,b):</p>
                    <BlockMath math="[P(a,b),\ k]: \begin{cases} x' = a + k(x - a) \\ y' = b + k(y - b) \end{cases}" />
                    <div className="bg-slate-800/60 rounded p-3 font-body text-xs text-white/70 space-y-1">
                      <p><InlineMath math="(x, y)" /> = koordinat titik asal</p>
                      <p><InlineMath math="(x', y')" /> = koordinat titik bayangan</p>
                      <p><InlineMath math="(a, b)" /> = koordinat pusat dilatasi</p>
                      <p><InlineMath math="k" /> = faktor skala</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-purple-300 mb-2">💡 Cara Mudah Memahaminya:</p>
                    <p className="font-body text-xs text-white/80">
                      Bayangkan kamu "geser" dulu pusat dilatasi ke titik asal, lakukan dilatasi, lalu geser kembali.
                      Itulah arti dari <InlineMath math="(x - a)" /> dan <InlineMath math="(y - b)" /> pada rumus di atas.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Jika pusat dilatasi adalah <InlineMath math="(0,0)" />, maka{" "}
                    <InlineMath math="a = 0" /> dan <InlineMath math="b = 0" />, sehingga rumus menjadi{" "}
                    <InlineMath math="x' = kx" /> dan <InlineMath math="y' = ky" /> — sama persis dengan Sub-Bab 2!
                    Jadi rumus Sub-Bab 3 adalah rumus yang lebih umum.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="contoh3"
              icon={<Calculator className="w-5 h-5" />}
              iconColor="#c084fc"
              label="📝 Contoh Soal — Dilatasi Pusat P(a,b)"
            />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Titik <InlineMath math="A(5, 4)" /> didilatasi dengan pusat <InlineMath math="P(1, 2)" />{" "}
                      dan faktor skala <InlineMath math="k = 2" />. Tentukan koordinat <InlineMath math="A'" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Diketahui: <InlineMath math="a=1,\ b=2,\ x=5,\ y=4,\ k=2" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="x' = a + k(x - a) = 1 + 2(5 - 1) = 1 + 8 = 9" />
                        <BlockMath math="y' = b + k(y - b) = 2 + 2(4 - 2) = 2 + 4 = 6" />
                      </div>
                      <p><strong className="text-green-300">Bayangan A' = (9, 6).</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Segitiga KLM dengan <InlineMath math="K(0, 0)" />, <InlineMath math="L(4, 0)" />,{" "}
                      <InlineMath math="M(0, 6)" /> didilatasi dengan pusat <InlineMath math="P(2, 3)" /> dan{" "}
                      <InlineMath math="k = \dfrac{1}{2}" />. Tentukan koordinat K', L', M'!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Gunakan rumus dengan <InlineMath math="a=2,\ b=3,\ k=\frac{1}{2}" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-3">
                        <div>
                          <p className="text-xs text-purple-300 font-semibold">Titik K(0,0):</p>
                          <BlockMath math="K' = \left(2 + \tfrac{1}{2}(0-2),\ 3 + \tfrac{1}{2}(0-3)\right) = \left(1,\ \tfrac{3}{2}\right)" />
                        </div>
                        <div>
                          <p className="text-xs text-purple-300 font-semibold">Titik L(4,0):</p>
                          <BlockMath math="L' = \left(2 + \tfrac{1}{2}(4-2),\ 3 + \tfrac{1}{2}(0-3)\right) = \left(3,\ \tfrac{3}{2}\right)" />
                        </div>
                        <div>
                          <p className="text-xs text-purple-300 font-semibold">Titik M(0,6):</p>
                          <BlockMath math="M' = \left(2 + \tfrac{1}{2}(0-2),\ 3 + \tfrac{1}{2}(6-3)\right) = \left(1,\ \tfrac{9}{2}\right)" />
                        </div>
                      </div>
                      <p><strong className="text-yellow-300">K'(1, 1,5), L'(3, 1,5), M'(1, 4,5).</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Bayangan titik <InlineMath math="Q" /> setelah didilatasi dengan pusat{" "}
                      <InlineMath math="P(3, -1)" /> dan <InlineMath math="k = 3" /> adalah{" "}
                      <InlineMath math="Q'(9, 8)" />. Tentukan koordinat titik <InlineMath math="Q" /> asal!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tuliskan persamaan dari rumus dilatasi:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="x' = 3 + 3(x - 3) \Rightarrow 9 = 3 + 3(x-3)" />
                        <BlockMath math="9 - 3 = 3(x-3) \Rightarrow 6 = 3(x-3) \Rightarrow x - 3 = 2 \Rightarrow x = 5" />
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="y' = -1 + 3(y - (-1)) \Rightarrow 8 = -1 + 3(y+1)" />
                        <BlockMath math="9 = 3(y+1) \Rightarrow y + 1 = 3 \Rightarrow y = 2" />
                      </div>
                      <p><strong className="text-primary">Koordinat Q asal = (5, 2).</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs">
                        <p className="text-white/60">Verifikasi: <InlineMath math="Q(5,2) \xrightarrow{P(3,-1),\ k=3} (3+3(5-3),\ -1+3(2+1)) = (9, 8) = Q'" /> ✓</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-cyan-300">🌟 Rangkuman Dilatasi</p>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-xs text-white/80">
                <thead>
                  <tr className="border-b border-cyan-500/30">
                    <th className="text-left py-2 text-cyan-300">Jenis</th>
                    <th className="text-left py-2 text-cyan-300">Rumus x'</th>
                    <th className="text-left py-2 text-cyan-300">Rumus y'</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr>
                    <td className="py-2 text-green-300">Pusat O(0,0)</td>
                    <td className="py-2"><InlineMath math="x' = kx" /></td>
                    <td className="py-2"><InlineMath math="y' = ky" /></td>
                  </tr>
                  <tr>
                    <td className="py-2 text-purple-300">Pusat P(a,b)</td>
                    <td className="py-2"><InlineMath math="x' = a + k(x-a)" /></td>
                    <td className="py-2"><InlineMath math="y' = b + k(y-b)" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-body text-xs text-white/60">
              Ingat: rumus pusat <InlineMath math="P(a,b)" /> adalah rumus umum — substitusikan <InlineMath math="a=0, b=0" /> untuk mendapatkan rumus pusat <InlineMath math="O(0,0)" />.
            </p>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/transformasi-geometri"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Transformasi Geometri
          </button>
        </div>
      </div>
    </div>
  );
};

export default DilatasisPage;
