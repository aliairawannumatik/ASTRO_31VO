import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Triangle } from "lucide-react";
import { SimilarTriangles, ParallelLinesTriangle, TriangleAltitude } from "./GeoFigure";

const SoalQ1 = () => (
  <svg viewBox="0 0 300 195" className="w-full max-w-xs mx-auto">
    <polygon points="95,35 205,35 238,170 62,170" fill="#3b82f6" fillOpacity="0.10" stroke="#60a5fa" strokeWidth="2"/>
    <line x1="95" y1="35" x2="238" y2="170" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,3"/>
    <line x1="205" y1="35" x2="62" y2="170" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,3"/>
    <circle cx="152" cy="95" r="3.5" fill="#fbbf24"/>
    <text x="83"  y="29"  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="207" y="29"  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="241" y="183" fontSize="13" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="49"  y="183" fontSize="13" fill="#93c5fd" fontWeight="bold">D</text>
    <text x="157" y="93"  fontSize="12" fill="#fde68a" fontWeight="bold">E</text>
    <text x="150" y="22"  textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">AB = 8 cm</text>
    <text x="150" y="191" textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">DC = 12 cm</text>
    <text x="100" y="70"  fontSize="11" fill="#f97316" fontWeight="bold">AE = 4 cm</text>
    <text x="180" y="140" fontSize="11" fill="#a855f7" fontWeight="bold">CE = ?</text>
    <line x1="140" y1="28" x2="160" y2="28" stroke="#fde68a" strokeWidth="1.5"/>
    <line x1="143" y1="163" x2="163" y2="163" stroke="#fde68a" strokeWidth="1.5"/>
    <line x1="147" y1="163" x2="167" y2="163" stroke="#fde68a" strokeWidth="1.5"/>
  </svg>
);

const SoalQ2 = () => {
  const A={x:160,y:22}, B={x:30,y:195}, C={x:290,y:195};
  const D={x:76,y:138}, E={x:244,y:138};
  return (
    <svg viewBox="0 0 320 215" className="w-full max-w-xs mx-auto">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#3b82f6" fillOpacity="0.10" stroke="#60a5fa" strokeWidth="2"/>
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#4ade80" strokeWidth="2.2"/>
      <line x1="155" y1="130" x2="165" y2="130" stroke="#4ade80" strokeWidth="2"/>
      <line x1="153" y1="188" x2="163" y2="188" stroke="#60a5fa" strokeWidth="2"/>
      <line x1="157" y1="188" x2="167" y2="188" stroke="#60a5fa" strokeWidth="2"/>
      <text x={A.x-5} y={A.y-5}  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x-15} y={B.y+12} fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={C.x+4}  y={C.y+12} fontSize="13" fill="#93c5fd" fontWeight="bold">C</text>
      <text x={D.x-14} y={D.y+5}  fontSize="12" fill="#4ade80" fontWeight="bold">D</text>
      <text x={E.x+4}  y={E.y+5}  fontSize="12" fill="#4ade80" fontWeight="bold">E</text>
      <text x="82"  y="82"  fontSize="12" fill="#f97316" fontWeight="bold">c</text>
      <text x="44"  y="173" fontSize="11" fill="#fbbf24" fontWeight="bold">4</text>
      <text x="244" y="82"  fontSize="12" fill="#a855f7" fontWeight="bold">d</text>
      <text x="270" y="173" fontSize="11" fill="#fbbf24" fontWeight="bold">3</text>
      <text x={(D.x+E.x)/2} y={D.y-8} textAnchor="middle" fontSize="11" fill="#4ade80" fontWeight="bold">DE = 8 cm</text>
      <text x={(B.x+C.x)/2} y={B.y+15} textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">BC = 12 cm</text>
    </svg>
  );
};

const SoalQ3 = () => {
  const A={x:108,y:38}, B={x:192,y:38}, C={x:272,y:182}, D={x:28,y:182};
  const E={x:A.x+(2/5)*(D.x-A.x), y:A.y+(2/5)*(D.y-A.y)};
  const F={x:B.x+(2/5)*(C.x-B.x), y:B.y+(2/5)*(C.y-B.y)};
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
      <text x={(E.x+F.x)/2} y={E.y-8} textAnchor="middle" fontSize="11" fill="#4ade80" fontWeight="bold">EF = ?</text>
      <text x={A.x-38} y={(A.y+E.y)/2+4} fontSize="10" fill="#f97316" fontWeight="bold">AE</text>
      <text x={D.x-14} y={(D.y+E.y)/2+4} fontSize="10" fill="#f97316" fontWeight="bold">ED</text>
      <text x={A.x-28} y={(A.y+E.y)/2+16} fontSize="9" fill="#f97316">2 : 3</text>
    </svg>
  );
};

const SoalQ4 = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-xs mx-auto">
    <rect x="0" y="68" width="300" height="46" fill="#1e3a5f" fillOpacity="0.55" rx="3"/>
    <text x="150" y="96" textAnchor="middle" fontSize="9" fill="#93c5fd" fontStyle="italic">~ ~ ~ SUNGAI ~ ~ ~</text>
    <line x1="0" y1="68"  x2="300" y2="68"  stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="6,3"/>
    <line x1="0" y1="114" x2="300" y2="114" stroke="#4ade80" strokeWidth="1.5"/>
    <circle cx="68" cy="52" r="4" fill="#f97316"/>
    <text x="54" y="47" fontSize="13" fill="#f97316" fontWeight="bold">A</text>
    <circle cx="68" cy="124" r="4" fill="#fbbf24"/>
    <text x="53" y="140" fontSize="13" fill="#fbbf24" fontWeight="bold">B</text>
    <line x1="68" y1="68" x2="68" y2="114" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>
    <text x="72" y="95" fontSize="11" fill="#ef4444" fontWeight="bold">AB = ?</text>
    <circle cx="152" cy="124" r="4" fill="#fbbf24"/>
    <text x="147" y="141" fontSize="13" fill="#fbbf24" fontWeight="bold">C</text>
    <circle cx="196" cy="124" r="4" fill="#4ade80"/>
    <text x="191" y="141" fontSize="13" fill="#4ade80" fontWeight="bold">E</text>
    <circle cx="152" cy="178" r="4" fill="#c084fc"/>
    <text x="158" y="181" fontSize="13" fill="#c084fc" fontWeight="bold">D</text>
    <line x1="152" y1="178" x2="68" y2="52" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="152" y1="124" x2="152" y2="178" stroke="#c084fc" strokeWidth="2"/>
    <text x="157" y="155" fontSize="10" fill="#c084fc" fontWeight="bold">DE=3m</text>
    <line x1="70" y1="108" x2="150" y2="108" stroke="#fbbf24" strokeWidth="1.2"/>
    <text x="108" y="104" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">BC=12m</text>
    <line x1="154" y1="108" x2="194" y2="108" stroke="#4ade80" strokeWidth="1.2"/>
    <text x="175" y="104" textAnchor="middle" fontSize="10" fill="#4ade80" fontWeight="bold">CE=4m</text>
    <text x="150" y="210" textAnchor="middle" fontSize="9" fill="#94a3b8" fontStyle="italic">D, C, A segaris (satu garis lurus)</text>
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

const SoalQ6 = () => (
  <svg viewBox="0 0 320 175" className="w-full max-w-sm mx-auto">
    <polygon points="28,155 88,155 58,38"  fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="2"/>
    <text x="14"  y="167" fontSize="12" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="88"  y="167" fontSize="12" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="53"  y="30"  fontSize="12" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="54"  y="103" fontSize="11" fill="#fde68a">CA=10</text>
    <text x="27"  y="170" fontSize="10" fill="#f97316">AB=6</text>
    <text x="65"  y="110" fontSize="11" fill="#4ade80">BC=8</text>
    <text x="148" y="12"  textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">△ABC ~ △PQR</text>
    <text x="148" y="155" textAnchor="middle" fontSize="18" fill="#facc15">~</text>
    <polygon points="175,155 295,155 235,38" fill="#22c55e" fillOpacity="0.15" stroke="#4ade80" strokeWidth="2"/>
    <text x="163" y="167" fontSize="12" fill="#86efac" fontWeight="bold">P</text>
    <text x="297" y="167" fontSize="12" fill="#86efac" fontWeight="bold">Q</text>
    <text x="230" y="30"  fontSize="12" fill="#86efac" fontWeight="bold">R</text>
    <text x="174" y="170" fontSize="10" fill="#f97316">PQ=9</text>
    <text x="196" y="99"  fontSize="11" fill="#ef4444" fontWeight="bold">PR = ?</text>
  </svg>
);

const SoalQ7 = () => {
  const l1y=35, l2y=95, l3y=155, l4y=195;
  const Ax=68, Fx=240;
  const Bx=Ax, Cx=Ax+(Fx-Ax)*1/3, Ex=Fx;
  return (
    <svg viewBox="0 0 310 215" className="w-full max-w-xs mx-auto">
      {[l1y,l2y,l3y,l4y].map((y,i) => (
        <line key={i} x1="10" y1={y} x2="295" y2={y} stroke="#334155" strokeWidth="1.2" strokeDasharray="6,3"/>
      ))}
      <line x1={Ax} y1={l1y} x2={Ax-18} y2={l4y} stroke="#60a5fa" strokeWidth="2"/>
      <line x1={Ex} y1={l1y} x2={Ex+14} y2={l4y} stroke="#4ade80" strokeWidth="2"/>
      <line x1={Ax} y1={l1y} x2={Ex+14} y2={l4y} stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5,3"/>
      <circle cx={Ax}   cy={l1y} r="3.5" fill="#60a5fa"/>
      <circle cx={Ax-6} cy={l2y} r="3.5" fill="#fde68a"/>
      <circle cx={Ax-12} cy={l3y} r="3.5" fill="#fde68a"/>
      <circle cx={Ax-18} cy={l4y} r="3.5" fill="#fde68a"/>
      <circle cx={Ex}    cy={l1y} r="3.5" fill="#4ade80"/>
      <circle cx={Ex+5}  cy={l2y} r="3.5" fill="#f97316"/>
      <text x={Ax-10} y={l1y-8}  fontSize="13" fill="#60a5fa" fontWeight="bold">A</text>
      <text x={Ax-22} y={l2y+5}  fontSize="13" fill="#fde68a" fontWeight="bold">B</text>
      <text x={Ax-30} y={l3y+5}  fontSize="13" fill="#fde68a" fontWeight="bold">C</text>
      <text x={Ax-34} y={l4y+5}  fontSize="13" fill="#fde68a" fontWeight="bold">D</text>
      <text x={Ex+7}  y={l1y-8}  fontSize="13" fill="#4ade80" fontWeight="bold">E</text>
      <text x={Ex+10} y={l2y+5}  fontSize="13" fill="#f97316" fontWeight="bold">F</text>
      <text x={Ax-62} y={(l1y+l2y)/2+4} fontSize="10" fill="#a855f7" fontWeight="bold">AB=11</text>
      <text x={Ax-62} y={(l2y+l3y)/2+4} fontSize="10" fill="#fde68a" fontWeight="bold">BC=15</text>
      <text x={Ax-62} y={(l3y+l4y)/2+4} fontSize="10" fill="#fde68a" fontWeight="bold">CD=15</text>
      <text x={(Ax+Ex)/2-18} y={l1y+28} fontSize="10" fill="#fbbf24" fontWeight="bold">DE=15</text>
      <text x={Ex+18} y={(l1y+l2y)/2+4} fontSize="10" fill="#ef4444" fontWeight="bold">EF=?</text>
      <text x="130" y="210" textAnchor="middle" fontSize="9" fill="#64748b">Garis mendatar sejajar satu sama lain</text>
    </svg>
  );
};

const SoalQ8 = () => {
  const A={x:30,y:52},  B={x:175,y:52};
  const D={x:175,y:160}, F={x:30,y:160};
  const G={x:30,y:106};
  const C={x:175,y:106};
  return (
    <svg viewBox="0 0 280 195" className="w-full max-w-xs mx-auto">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${D.x},${D.y} ${F.x},${F.y}`} fill="#3b82f6" fillOpacity="0.10" stroke="#60a5fa" strokeWidth="2"/>
      <line x1={G.x} y1={G.y} x2={D.x} y2={D.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="5,3"/>
      <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3"/>
      <circle cx={C.x} cy={C.y} r="3.5" fill="#ef4444"/>
      <circle cx={G.x} cy={G.y} r="3.5" fill="#4ade80"/>
      <text x={A.x-14} y={A.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+4}  y={B.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={B.x+4}  y={D.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">D</text>
      <text x={A.x-14} y={F.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">F</text>
      <text x={A.x-14} y={G.y+4}  fontSize="13" fill="#4ade80" fontWeight="bold">G</text>
      <text x={B.x+4}  y={C.y+4}  fontSize="13" fill="#ef4444" fontWeight="bold">C</text>
      <text x={(A.x+B.x)/2} y={A.y-8} textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">AB = 16 cm</text>
      <text x={(F.x+D.x)/2} y={F.y+16} textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">DF = 16 cm</text>
      <text x={B.x+12} y={(B.y+C.y)/2+4} fontSize="10" fill="#fbbf24" fontWeight="bold">BC = ?</text>
      <text x={A.x-38} y={(F.y+G.y)/2+4} fontSize="10" fill="#4ade80" fontWeight="bold">FG=6</text>
      <text x={(A.x+B.x)/2+8} y={(A.y+D.y)/2} fontSize="10" fill="#f97316">BD=16</text>
      <text x="215" y="52"  fontSize="9" fill="#60a5fa">AB // DF</text>
      <text x="215" y="68"  fontSize="9" fill="#4ade80">BD // GF</text>
    </svg>
  );
};

const SoalQ9 = () => {
  const E={x:150,y:100};
  const A={x:58,y:38},  B={x:242,y:38};
  const D={x:58,y:162}, C={x:242,y:162};
  return (
    <svg viewBox="0 0 310 200" className="w-full max-w-xs mx-auto">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${E.x},${E.y}`} fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="2"/>
      <polygon points={`${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="#22c55e" fillOpacity="0.15" stroke="#4ade80" strokeWidth="2"/>
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <circle cx={E.x} cy={E.y} r="3.5" fill="#fbbf24"/>
      <text x={A.x-14} y={A.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
      <text x={B.x+3}  y={B.y+4}  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
      <text x={B.x+3}  y={C.y+14} fontSize="13" fill="#4ade80" fontWeight="bold">C</text>
      <text x={A.x-14} y={D.y+14} fontSize="13" fill="#4ade80" fontWeight="bold">D</text>
      <text x={E.x+5}  y={E.y+5}  fontSize="12" fill="#fde68a" fontWeight="bold">E</text>
      <text x={(A.x+B.x)/2} y={A.y-8} textAnchor="middle" fontSize="11" fill="#f97316" fontWeight="bold">AB = 9 cm</text>
      <text x={(C.x+D.x)/2} y={C.y+18} textAnchor="middle" fontSize="11" fill="#4ade80" fontWeight="bold">DC = 15 cm</text>
      <text x={(A.x+C.x)/2-30} y={(A.y+C.y)/2} fontSize="10" fill="#fbbf24" fontWeight="bold">AC=20</text>
      <text x={(A.x+E.x)/2-22} y={(A.y+E.y)/2+4} fontSize="11" fill="#a855f7" fontWeight="bold">AE=?</text>
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
    content: "Perhatikan gambar segitiga besar ABC dengan garis DE sejajar BC (DE ∥ BC). Diketahui DB = 4 cm, EC = 3 cm, DE = 8 cm, dan BC = 12 cm. Tentukan nilai c = AD dan d = AE! (Petunjuk: gunakan sifat kesebangunan AD/DB = AE/EC = DE/BC)",
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
  Qn(7, "Garis-Garis Sejajar – Cari EF", {
    type: "mixed",
    content: "Perhatikan gambar berikut. Garis-garis mendatar adalah sejajar satu sama lain. Diketahui BC = CD = DE = 15 cm (diukur pada transversal kiri) dan AB = 11 cm. Panjang EF adalah…",
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
    content: "Perhatikan gambar berikut. Diketahui AB ∥ DF, BD ∥ GF, dan AB = BD = DF = 16 cm. Jika FG = 6 cm, maka panjang BC adalah…",
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
