import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const GrafikTitikPotong = () => {
  // Origin at SVG coord (100, 120)
  // b on y-axis: (100, 60) — 60px above origin
  // a on x-axis: (190, 120) — 90px right of origin
  // Line direction unit vector: (90,60)/108.2 ≈ (0.832, 0.555)
  // Line extended: (46, 24) → (232, 148)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 220"
      width="280"
      height="220"
      className="my-3"
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* X axis */}
      <line x1="20" y1="120" x2="258" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
      <polygon points="260,120 252,116 252,124" fill="#94A3B8" />
      {/* Y axis */}
      <line x1="100" y1="208" x2="100" y2="12" stroke="#94A3B8" strokeWidth="1.5" />
      <polygon points="100,10 96,18 104,18" fill="#94A3B8" />

      {/* Line through b=(100,60) and a=(190,120), extended to (46,24)→(232,148) */}
      <line x1="46" y1="24" x2="232" y2="148" stroke="#22D3EE" strokeWidth="1.5" />
      {/* Upper-left arrowhead at (46,24) pointing toward upper-left */}
      <polygon points="46,24 51,33 56,26" fill="#22D3EE" />
      {/* Lower-right arrowhead at (232,148) pointing toward lower-right */}
      <polygon points="232,148 222,146 227,139" fill="#22D3EE" />

      {/* Dot exactly on y-axis at b: (100, 60) */}
      <circle cx="100" cy="60" r="2.5" fill="#22D3EE" />
      {/* Dot exactly on x-axis at a: (190, 120) */}
      <circle cx="190" cy="120" r="2.5" fill="#22D3EE" />

      {/* Label b — right of y-axis, at the b intersection */}
      <text x="108" y="65" fill="#22D3EE" fontSize="14" fontFamily="serif" fontStyle="italic">b</text>
      {/* Label a — below x-axis, at the a intersection */}
      <text x="186" y="138" fill="#22D3EE" fontSize="14" fontFamily="serif" fontStyle="italic">a</text>
    </svg>
  );
};

// Graph 2: passes through (-a,0) on x-axis [left of origin] and (0,b) on y-axis [above origin]
// Origin SVG: (100,120). -a at (40,120). b at (100,60).
// Line: (12,148) → (142,18). Slope check: (18-148)/(142-12)=-130/130=-1 ✓
const GrafikTitikPotong2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220" width="280" height="220" className="my-3" style={{ display: "block", margin: "0 auto" }}>
    <line x1="20" y1="120" x2="258" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
    <polygon points="260,120 252,116 252,124" fill="#94A3B8" />
    <line x1="100" y1="208" x2="100" y2="12" stroke="#94A3B8" strokeWidth="1.5" />
    <polygon points="100,10 96,18 104,18" fill="#94A3B8" />
    {/* Line through -a=(40,120) and b=(100,60), extended */}
    <line x1="12" y1="148" x2="142" y2="18" stroke="#4ADE80" strokeWidth="1.5" />
    {/* Arrow upper-right at (142,18) */}
    <polygon points="142,18 133,22 138,27" fill="#4ADE80" />
    {/* Arrow lower-left at (12,148) */}
    <polygon points="12,148 21,144 16,139" fill="#4ADE80" />
    {/* Dots */}
    <circle cx="40" cy="120" r="2.5" fill="#4ADE80" />
    <circle cx="100" cy="60" r="2.5" fill="#4ADE80" />
    {/* Labels */}
    <text x="108" y="65" fill="#4ADE80" fontSize="14" fontFamily="serif" fontStyle="italic">b</text>
    <text x="28" y="138" fill="#4ADE80" fontSize="14" fontFamily="serif" fontStyle="italic">-a</text>
  </svg>
);

// Graph 3: passes through (-a,0) on x-axis [left] and (0,-b) on y-axis [below origin]
// Origin SVG: (100,120). -a at (40,120). -b at (100,180).
// Line: (12,92) → (121,201). Slope check: (180-120)/(100-40)=60/60=1 ✓
const GrafikTitikPotong3 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220" width="280" height="220" className="my-3" style={{ display: "block", margin: "0 auto" }}>
    <line x1="20" y1="120" x2="258" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
    <polygon points="260,120 252,116 252,124" fill="#94A3B8" />
    <line x1="100" y1="208" x2="100" y2="12" stroke="#94A3B8" strokeWidth="1.5" />
    <polygon points="100,10 96,18 104,18" fill="#94A3B8" />
    {/* Line through -a=(40,120) and -b=(100,180), extended */}
    <line x1="12" y1="92" x2="121" y2="201" stroke="#F472B6" strokeWidth="1.5" />
    {/* Arrow upper-left at (12,92) */}
    <polygon points="12,92 21,96 16,101" fill="#F472B6" />
    {/* Arrow lower-right at (121,201) */}
    <polygon points="121,201 112,197 117,192" fill="#F472B6" />
    {/* Dots */}
    <circle cx="40" cy="120" r="2.5" fill="#F472B6" />
    <circle cx="100" cy="180" r="2.5" fill="#F472B6" />
    {/* Labels */}
    <text x="28" y="115" fill="#F472B6" fontSize="14" fontFamily="serif" fontStyle="italic">-a</text>
    <text x="108" y="185" fill="#F472B6" fontSize="14" fontFamily="serif" fontStyle="italic">-b</text>
  </svg>
);

// Graph 4: passes through (a,0) on x-axis [right] and (0,-b) on y-axis [below origin]
// Origin SVG: (100,120). a at (190,120). -b at (100,180).
// Line: (63,205) → (232,92). Slope check: (120-180)/(190-100)=-60/90=-0.667 ✓
const GrafikTitikPotong4 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220" width="280" height="220" className="my-3" style={{ display: "block", margin: "0 auto" }}>
    <line x1="20" y1="120" x2="258" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
    <polygon points="260,120 252,116 252,124" fill="#94A3B8" />
    <line x1="100" y1="208" x2="100" y2="12" stroke="#94A3B8" strokeWidth="1.5" />
    <polygon points="100,10 96,18 104,18" fill="#94A3B8" />
    {/* Line through -b=(100,180) and a=(190,120), extended */}
    <line x1="63" y1="205" x2="232" y2="92" stroke="#A78BFA" strokeWidth="1.5" />
    {/* Arrow lower-left at (63,205) */}
    <polygon points="63,205 72,203 68,197" fill="#A78BFA" />
    {/* Arrow upper-right at (232,92) */}
    <polygon points="232,92 222,94 227,100" fill="#A78BFA" />
    {/* Dots */}
    <circle cx="190" cy="120" r="2.5" fill="#A78BFA" />
    <circle cx="100" cy="180" r="2.5" fill="#A78BFA" />
    {/* Labels */}
    <text x="186" y="138" fill="#A78BFA" fontSize="14" fontFamily="serif" fontStyle="italic">a</text>
    <text x="108" y="185" fill="#A78BFA" fontSize="14" fontFamily="serif" fontStyle="italic">-b</text>
  </svg>
);

const TabelTitikGrafik = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 160"
    width="200"
    height="160"
    className="my-3"
    style={{ display: "block", margin: "0 auto" }}
  >
    <rect x="1" y="1" width="198" height="158" rx="4" ry="4"
      fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <line x1="100" y1="1" x2="100" y2="159" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <line x1="1" y1="54" x2="199" y2="54" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <line x1="1" y1="107" x2="199" y2="107" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <text x="50" y="33" textAnchor="middle" fill="rgba(255,255,255,0.9)"
      fontSize="18" fontFamily="serif" fontWeight="bold">x</text>
    <text x="150" y="33" textAnchor="middle" fill="rgba(255,255,255,0.9)"
      fontSize="18" fontFamily="serif" fontWeight="bold">y</text>
    <text x="50" y="88" textAnchor="middle" fill="rgba(255,255,255,0.7)"
      fontSize="22" fontFamily="serif">?</text>
    <text x="150" y="88" textAnchor="middle" fill="rgba(255,255,255,0.9)"
      fontSize="18" fontFamily="serif" fontWeight="bold">0</text>
    <text x="50" y="141" textAnchor="middle" fill="rgba(255,255,255,0.9)"
      fontSize="18" fontFamily="serif" fontWeight="bold">0</text>
    <text x="150" y="141" textAnchor="middle" fill="rgba(255,255,255,0.7)"
      fontSize="22" fontFamily="serif">?</text>
  </svg>
);

// Dua Garis Sejajar: g dan h
const GarisSejajar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190" width="180" height="160"
    className="my-2" style={{ display: "block", margin: "0 auto" }}>
    {/* Border frame */}
    <rect x="1" y="1" width="218" height="188" rx="10" ry="10" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
    {/* Line g: from (50,168) to (100,22) */}
    <line x1="50" y1="168" x2="100" y2="22" stroke="#FACC15" strokeWidth="2" />
    {/* Upper arrowhead g at (100,22) */}
    <polygon points="100,22 100.5,35 92.5,32" fill="#FACC15" />
    {/* Lower arrowhead g at (50,168) */}
    <polygon points="50,168 57.5,157 49.5,154" fill="#FACC15" />
    {/* Line h: from (122,168) to (172,22) */}
    <line x1="122" y1="168" x2="172" y2="22" stroke="#FACC15" strokeWidth="2" />
    {/* Upper arrowhead h at (172,22) */}
    <polygon points="172,22 172.5,35 164.5,32" fill="#FACC15" />
    {/* Lower arrowhead h at (122,168) */}
    <polygon points="122,168 129.5,157 121.5,154" fill="#FACC15" />
    {/* Label g */}
    <text x="62" y="105" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">g</text>
    {/* Label h */}
    <text x="140" y="128" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

// Dua Garis Tegak Lurus: g ⊥ h
const GarisTegakLurus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 195" width="190" height="160"
    className="my-2" style={{ display: "block", margin: "0 auto" }}>
    {/* Border frame */}
    <rect x="1" y="1" width="228" height="193" rx="10" ry="10" fill="none" stroke="rgba(244,114,182,0.5)" strokeWidth="1.5" />
    {/* Line g: upper-left (40,20) to lower-right (185,165) */}
    <line x1="40" y1="20" x2="185" y2="165" stroke="#FACC15" strokeWidth="2" />
    {/* Upper-left arrowhead g */}
    <polygon points="40,20 45,32 52,25" fill="#FACC15" />
    {/* Lower-right arrowhead g */}
    <polygon points="185,165 173,160 180,153" fill="#FACC15" />
    {/* Line h: upper-right (185,20) to lower-left (40,165) */}
    <line x1="185" y1="20" x2="40" y2="165" stroke="#FACC15" strokeWidth="2" />
    {/* Upper-right arrowhead h */}
    <polygon points="185,20 180,32 173,25" fill="#FACC15" />
    {/* Lower-left arrowhead h */}
    <polygon points="40,165 52,160 45,153" fill="#FACC15" />
    {/* Right-angle square at intersection (113,93) */}
    <polyline points="120,100 113,107 106,100" fill="none" stroke="white" strokeWidth="1.5" />
    {/* Label g */}
    <text x="22" y="19" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">g</text>
    {/* Label h */}
    <text x="189" y="19" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

// Dua Garis Berpotongan: g dan h (tidak tegak lurus)
const GarisBerpotongan = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 195" width="190" height="160"
    className="my-2" style={{ display: "block", margin: "0 auto" }}>
    {/* Border frame */}
    <rect x="1" y="1" width="228" height="193" rx="10" ry="10" fill="none" stroke="rgba(74,222,128,0.5)" strokeWidth="1.5" />
    {/* Line h: upper-left (35,22) to lower-right (195,168) */}
    <line x1="35" y1="22" x2="195" y2="168" stroke="#FACC15" strokeWidth="2" />
    {/* Upper-left arrowhead h */}
    <polygon points="35,22 40,32 46,26" fill="#FACC15" />
    {/* Lower-right arrowhead h */}
    <polygon points="195,168 190,164 184,158" fill="#FACC15" />
    {/* Line g: lower-left (35,168) to upper-right (195,55) */}
    <line x1="35" y1="168" x2="195" y2="55" stroke="#FACC15" strokeWidth="2" />
    {/* Lower-left arrowhead g */}
    <polygon points="35,168 46,165 42,159" fill="#FACC15" />
    {/* Upper-right arrowhead g */}
    <polygon points="195,55 188,65 184,58" fill="#FACC15" />
    {/* Label h upper-left */}
    <text x="18" y="22" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">h</text>
    {/* Label g lower-left */}
    <text x="18" y="182" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">g</text>
  </svg>
);

// Dua Garis Berimpit: g dan h (coincident — satu garis, dua label)
const GarisBerimpit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 195" width="190" height="160"
    className="my-2" style={{ display: "block", margin: "0 auto" }}>
    {/* Border frame */}
    <rect x="1" y="1" width="228" height="193" rx="10" ry="10" fill="none" stroke="rgba(192,132,252,0.5)" strokeWidth="1.5" />
    {/* Single coincident line: lower-left (40,168) to upper-right (190,27) */}
    <line x1="40" y1="168" x2="190" y2="27" stroke="#FACC15" strokeWidth="2.5" />
    {/* Lower-left arrowhead */}
    <polygon points="40,168 52,163 46,157" fill="#FACC15" />
    {/* Upper-right arrowhead */}
    <polygon points="190,27 185,39 179,33" fill="#FACC15" />
    {/* Label g — lower portion of line */}
    <text x="58" y="148" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">g</text>
    {/* Label h — upper portion of line */}
    <text x="138" y="72" fill="#67E8F9" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

// Gradien Positif (m = +): line rises left-to-right
// Main line: (20,182)→(248,32). Triangle: P1=(65,152), P2=(210,57), corner=(210,152)
const GarisGradienPositif = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -14 308 306" width="308" height="306"
    className="my-2" style={{ display: "block", margin: "0 auto" }}>
    {/* Green frame */}
    <rect x="-13" y="-13" width="306" height="304" rx="10" ry="10" fill="none" stroke="#22C55E" strokeWidth="2" />
    {/* Main line */}
    <line x1="20" y1="182" x2="248" y2="32" stroke="white" strokeWidth="2" />
    {/* Arrow lower-left */}
    <polygon points="20,182 30,181 25,174" fill="white" />
    {/* Arrow upper-right */}
    <polygon points="248,32 242,40 238,34" fill="white" />
    {/* Vertical dashed (sisi tegak) */}
    <line x1="210" y1="57" x2="210" y2="152" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5,4" />
    {/* Horizontal dashed (sisi datar) */}
    <line x1="65" y1="152" x2="210" y2="152" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5,4" />
    {/* Right-angle square at corner (210,152) */}
    <polyline points="202,152 202,144 210,144" fill="none" stroke="#4ADE80" strokeWidth="1.5" />
    {/* Label m = + */}
    <text x="218" y="29" fill="#34D399" fontSize="13" fontFamily="sans-serif" fontWeight="bold">m = +</text>
    {/* Label Panjang sisi tegak */}
    <text x="216" y="112" fill="#93C5FD" fontSize="11" fontFamily="sans-serif">Panjang sisi</text>
    <text x="216" y="126" fill="#93C5FD" fontSize="11" fontFamily="sans-serif">tegak</text>
    {/* Label Panjang sisi datar */}
    <text x="108" y="168" fill="#93C5FD" fontSize="11" fontFamily="sans-serif">Panjang sisi datar</text>
    {/* Separator */}
    <line x1="10" y1="203" x2="270" y2="203" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
    {/* Formula: m = + fraction */}
    <text x="97" y="234" fill="white" fontSize="12" fontFamily="sans-serif" textAnchor="end" fontWeight="bold">m = +</text>
    <text x="160" y="225" fill="white" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Panjang sisi tegak</text>
    <line x1="100" y1="230" x2="220" y2="230" stroke="white" strokeWidth="1.2" />
    <text x="160" y="246" fill="white" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Panjang sisi datar</text>
    {/* (naik ke kanan) */}
    <text x="140" y="268" fill="#34D399" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontStyle="italic">(naik ke kanan)</text>
  </svg>
);

// Gradien Negatif (m = -): line falls left-to-right
// Main line: (20,18)→(252,178). Triangle: P_upper=(70,53), P_lower=(210,153), corner=(70,153)
const GarisGradienNegatif = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -14 308 306" width="308" height="306"
    className="my-2" style={{ display: "block", margin: "0 auto" }}>
    {/* Green frame */}
    <rect x="-13" y="-13" width="306" height="304" rx="10" ry="10" fill="none" stroke="#22C55E" strokeWidth="2" />
    {/* Main line */}
    <line x1="20" y1="18" x2="252" y2="178" stroke="white" strokeWidth="2" />
    {/* Arrow upper-left */}
    <polygon points="20,18 30,19 25,26" fill="white" />
    {/* Arrow lower-right */}
    <polygon points="252,178 241,176 247,169" fill="white" />
    {/* Vertical dashed (sisi tegak) */}
    <line x1="70" y1="53" x2="70" y2="153" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5,4" />
    {/* Horizontal dashed (sisi datar) */}
    <line x1="70" y1="153" x2="210" y2="153" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5,4" />
    {/* Right-angle square at corner (70,153) */}
    <polyline points="78,153 78,145 70,145" fill="none" stroke="#4ADE80" strokeWidth="1.5" />
    {/* Label m = - */}
    <text x="55" y="13" fill="#F472B6" fontSize="13" fontFamily="sans-serif" fontWeight="bold">m = -</text>
    {/* Label Panjang sisi tegak */}
    <text x="2" y="100" fill="#93C5FD" fontSize="11" fontFamily="sans-serif">Panjang sisi</text>
    <text x="2" y="114" fill="#93C5FD" fontSize="11" fontFamily="sans-serif">tegak</text>
    {/* Label Panjang sisi datar */}
    <text x="108" y="169" fill="#93C5FD" fontSize="11" fontFamily="sans-serif">Panjang sisi datar</text>
    {/* Separator */}
    <line x1="10" y1="203" x2="270" y2="203" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
    {/* Formula: m = - fraction */}
    <text x="97" y="234" fill="white" fontSize="12" fontFamily="sans-serif" textAnchor="end" fontWeight="bold">m = −</text>
    <text x="160" y="225" fill="white" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Panjang sisi tegak</text>
    <line x1="100" y1="230" x2="220" y2="230" stroke="white" strokeWidth="1.2" />
    <text x="160" y="246" fill="white" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Panjang sisi datar</text>
    {/* (turun ke kanan) */}
    <text x="140" y="268" fill="#F472B6" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontStyle="italic">(turun ke kanan)</text>
  </svg>
);

type SectionItem =
  | { t: 'heading'; text: string; color: string }
  | { t: 'text'; text: string; color?: string }
  | { t: 'formula'; headline: string; headlineSuffix?: string; lines: FormulaLine[]; color: string }
  | { t: 'svg'; name: string };

const colorMap: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  cyan:   { text: 'text-cyan-300',   border: 'border-cyan-500/60',   bg: 'bg-cyan-950/40',   dot: 'bg-cyan-400' },
  green:  { text: 'text-green-300',  border: 'border-green-500/60',  bg: 'bg-green-950/40',  dot: 'bg-green-400' },
  purple: { text: 'text-purple-300', border: 'border-purple-500/60', bg: 'bg-purple-950/40', dot: 'bg-purple-400' },
  pink:   { text: 'text-pink-300',   border: 'border-pink-500/60',   bg: 'bg-pink-950/40',   dot: 'bg-pink-400' },
  blue:   { text: 'text-blue-300',   border: 'border-blue-500/60',   bg: 'bg-blue-950/40',   dot: 'bg-blue-400' },
  orange: { text: 'text-orange-300', border: 'border-orange-500/60', bg: 'bg-orange-950/40', dot: 'bg-orange-400' },
  teal:   { text: 'text-teal-300',   border: 'border-teal-500/60',   bg: 'bg-teal-950/40',   dot: 'bg-teal-400' },
};

type FormulaLine = string | { svg: string };
interface FormulaCardProps { headline: string; headlineSuffix?: string; lines: FormulaLine[]; color: string; }
const formulaSvgMap: Record<string, JSX.Element> = {
  GRADIEN_POSITIF: <GarisGradienPositif />,
  GRADIEN_NEGATIF: <GarisGradienNegatif />,
  GARIS_SEJAJAR: <GarisSejajar />,
  GARIS_TEGAK_LURUS: <GarisTegakLurus />,
  GARIS_BERPOTONGAN: <GarisBerpotongan />,
  GARIS_BERIMPIT: <GarisBerimpit />,
};
const FormulaCard = ({ headline, headlineSuffix, lines, color }: FormulaCardProps) => {
  const c = colorMap[color] || colorMap.cyan;
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden my-3`}>
      <div className={`px-4 py-2 flex items-center gap-2 border-b ${c.border}`}>
        <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
        <span className={`font-display text-xs font-bold ${c.text} uppercase tracking-wide`}>
          {headline}{headlineSuffix && <span className="normal-case">{headlineSuffix}</span>}
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        {lines.map((line, i) =>
          typeof line === 'string' ? (
            <div key={i} className="font-body text-sm text-white/90 text-center">
              {renderWithLatex(line)}
            </div>
          ) : (
            <div key={i} className="flex justify-center">
              {formulaSvgMap[line.svg]}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const materiSections: { heading: string; items: SectionItem[] }[] = [
  {
    heading: "A. Bentuk Umum Persamaan Garis Lurus",
    items: [
      { t: 'formula', headline: 'Bentuk Persamaan Garis Lurus', color: 'cyan', lines: [
        'Eksplisit : $y = mx + c$',
        'Implisit : $ax + by + c = 0$',
      ]},
      { t: 'heading', text: '1. Menggambar Grafik', color: 'cyan' },
      { t: 'text', text: 'Gunakan minimal 2 titik koordinat, yaitu ketika $x = 0$ atau ketika $y = 0$.' },
      { t: 'svg', name: 'TABLE_TITIK' },
      { t: 'text', text: 'Misalkan titik potong sumbu x adalah (a, 0) dan titik potong sumbu y adalah (0, b):', color: 'text-white/70' },
      { t: 'svg', name: 'GRAFIK_TITIK' },
      { t: 'text', text: 'Misalkan titik potong sumbu x adalah (-a, 0) dan titik potong sumbu y adalah (0, b):', color: 'text-white/70' },
      { t: 'svg', name: 'GRAFIK2' },
      { t: 'text', text: 'Misalkan titik potong sumbu x adalah (-a, 0) dan titik potong sumbu y adalah (0, -b):', color: 'text-white/70' },
      { t: 'svg', name: 'GRAFIK3' },
      { t: 'text', text: 'Misalkan titik potong sumbu x adalah (a, 0) dan titik potong sumbu y adalah (0, -b):', color: 'text-white/70' },
      { t: 'svg', name: 'GRAFIK4' },
      { t: 'heading', text: '2. Menentukan Gradien / Kemiringan Garis Lurus', color: 'green' },
      { t: 'formula', headline: 'a. Diketahui Panjang Sisi Tegak dan Sisi Datar', color: 'green', lines: [
        { svg: 'GRADIEN_POSITIF' },
        { svg: 'GRADIEN_NEGATIF' },
      ]},
      { t: 'formula', headline: 'b. Diketahui 2 Titik yang Dilalui', color: 'blue', lines: [
        'Garis melalui titik $A(x_1, y_1)$ dan $B(x_2, y_2)$',
        '$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$',
      ]},
      { t: 'formula', headline: 'c. Diketahui Persamaan Garis', color: 'pink', lines: [
        '$ax + by = c \\Rightarrow m = -\\dfrac{a}{b}$',
        '$y = mx + c \\Rightarrow$ gradien adalah $m$ (koefisien $x$)',
      ]},
    ],
  },
  {
    heading: "B. Menyusun Persamaan Garis Lurus",
    items: [
      { t: 'formula', headline: 'a. Melalui Titik (x₁, y₁) dan Bergradien m', color: 'teal', lines: [
        '$y - y_1 = m(x - x_1)$',
      ]},
      { t: 'formula', headline: 'b. Melalui 2 Titik: A(x₁, y₁) dan B(x₂, y₂)', color: 'orange', lines: [
        '$\\dfrac{y - y_1}{y_2 - y_1} = \\dfrac{x - x_1}{x_2 - x_1}$',
      ]},
    ],
  },
  {
    heading: "C. Hubungan Dua Garis Lurus",
    items: [
      { t: 'formula', headline: 'a. Garis Sejajar ', headlineSuffix: '(g // h)', color: 'cyan', lines: [
        { svg: 'GARIS_SEJAJAR' },
        'Jika $g // h$ maka gradiennya sama: $m_g = m_h$',
        'Jika $g : ax + by + c = 0$ dan $g // h$ melalui $A(x_1, y_1)$:',
        '$h : ax + by = ax_1 + by_1$',
      ]},
      { t: 'formula', headline: 'b. Garis Tegak Lurus ', headlineSuffix: '(g ⊥ h)', color: 'pink', lines: [
        { svg: 'GARIS_TEGAK_LURUS' },
        '$g \\perp h \\Rightarrow m_g \\cdot m_h = -1$',
        'Jika $g : ax + by + c = 0$ dan tegak lurus $h$ melalui $A(x_1, y_1)$:',
        '$h : bx - ay = bx_1 - ay_1$',
      ]},
      { t: 'formula', headline: 'c. Garis Berpotongan', color: 'green', lines: [
        { svg: 'GARIS_BERPOTONGAN' },
        'Titik potong garis $g$ dan $h$ adalah $A(x_1, y_1)$',
        '(diperoleh dengan substitusi - eliminasi)',
      ]},
      { t: 'formula', headline: 'd. Garis Berimpit', color: 'purple', lines: [
        { svg: 'GARIS_BERIMPIT' },
        '$m_g = m_h$',
        '$g = A \\cdot h$ dengan $A$ adalah koefisien',
      ]},
    ],
  },
];

const _axisBlue = "#3B82F6";
const _lineYellow = "#FACC15";

const GrafikSoal1A = () => (
  // y = 2x - 3: passes through (0,-3) and (2,1), slope +2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="white" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="120" y1="107" x2="120" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="116" y="124" fill="white" fontSize="9" fontFamily="sans-serif">2</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="54" y="174" fill="white" fontSize="9" fontFamily="sans-serif">-3</text>
    <line x1="80" y1="90" x2="120" y2="90" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="120" y1="90" x2="120" y2="110" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="70" y1="190" x2="142" y2="46" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="142,46 140,58 133,55" fill={_lineYellow} />
    <polygon points="70,190 79,181 72,178" fill={_lineYellow} />
    <text x="124" y="89" fill="white" fontSize="9" fontFamily="sans-serif">(2,1)</text>
    <text x="82" y="168" fill="white" fontSize="9" fontFamily="sans-serif">(0,-3)</text>
  </svg>
);

const GrafikSoal1B = () => (
  // y = -2x + 3: passes through (0,3) and (2,-1), slope -2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="white" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="120" y1="107" x2="120" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="116" y="124" fill="white" fontSize="9" fontFamily="sans-serif">2</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="white" fontSize="9" fontFamily="sans-serif">3</text>
    <line x1="80" y1="130" x2="120" y2="130" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="120" y1="110" x2="120" y2="130" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="70" y1="30" x2="142" y2="174" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="70,30 72,42 79,39" fill={_lineYellow} />
    <polygon points="142,174 133,165 140,162" fill={_lineYellow} />
    <text x="82" y="48" fill="white" fontSize="9" fontFamily="sans-serif">(0,3)</text>
    <text x="124" y="132" fill="white" fontSize="9" fontFamily="sans-serif">(2,-1)</text>
  </svg>
);

const GrafikSoal1C = () => (
  // y = x + 3: passes through (0,3) and (-2,1), slope +1
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="white" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="28" y="124" fill="white" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="white" fontSize="9" fontFamily="sans-serif">3</text>
    <line x1="40" y1="90" x2="80" y2="90" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="40" y1="90" x2="40" y2="110" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="8" y1="122" x2="118" y2="12" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="8,122 19,116 14,111" fill={_lineYellow} />
    <polygon points="118,12 112,23 107,18" fill={_lineYellow} />
    <text x="82" y="48" fill="white" fontSize="9" fontFamily="sans-serif">(0,3)</text>
    <text x="2" y="88" fill="white" fontSize="9" fontFamily="sans-serif">(-2,1)</text>
  </svg>
);

const GrafikSoal1D = () => (
  // y = -2x - 3: passes through (0,-3) and (-2,1), slope -2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="white" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="28" y="124" fill="white" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="54" y="174" fill="white" fontSize="9" fontFamily="sans-serif">-3</text>
    <line x1="40" y1="90" x2="80" y2="90" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="40" y1="90" x2="40" y2="110" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="8" y1="26" x2="90" y2="190" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="8,26 10,38 17,35" fill={_lineYellow} />
    <polygon points="90,190 81,181 88,178" fill={_lineYellow} />
    <text x="2" y="88" fill="white" fontSize="9" fontFamily="sans-serif">(-2,1)</text>
    <text x="82" y="168" fill="white" fontSize="9" fontFamily="sans-serif">(0,-3)</text>
  </svg>
);

const GrafikSoal2C = () => (
  // y = 2x + 3: passes through (0,3) and (-2,-1), slope +2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="white" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="28" y="124" fill="white" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="white" fontSize="9" fontFamily="sans-serif">3</text>
    <line x1="40" y1="130" x2="80" y2="130" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="40" y1="110" x2="40" y2="130" stroke="white" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="18" y1="174" x2="100" y2="10" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="18,174 27,165 20,162" fill={_lineYellow} />
    <polygon points="100,10 94,21 89,16" fill={_lineYellow} />
    <text x="82" y="48" fill="white" fontSize="9" fontFamily="sans-serif">(0,3)</text>
    <text x="2" y="128" fill="white" fontSize="9" fontFamily="sans-serif">(-2,-1)</text>
  </svg>
);

const GrafikSoal3 = () => (
  // Line h through (-2, 0) and (0, 3), gradient = 3/2
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display: "block", margin: "0 auto" }}>
    {/* X axis */}
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    {/* Y axis */}
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    {/* Axis labels */}
    <text x="188" y="115" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="63" y="123" fill="white" fontSize="13" fontFamily="sans-serif">0</text>
    {/* Tick x = -2 */}
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="24" y="126" fill="white" fontSize="13" fontFamily="sans-serif">-2</text>
    {/* Tick y = 3 */}
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="55" fill="white" fontSize="13" fontFamily="sans-serif">3</text>
    {/* Line h: through (-2,0)→(40,110) and (0,3)→(80,50), extended */}
    <line x1="10" y1="155" x2="107" y2="9" stroke={_lineYellow} strokeWidth="2" />
    {/* Arrow lower-left */}
    <polygon points="10,155 19,146 13,143" fill={_lineYellow} />
    {/* Arrow upper-right */}
    <polygon points="107,9 101,20 96,15" fill={_lineYellow} />
    {/* Dots at intercepts */}
    <circle cx="40" cy="110" r="2.5" fill={_lineYellow} />
    <circle cx="80" cy="50" r="2.5" fill={_lineYellow} />
    {/* Label h near upper-right */}
    <text x="110" y="18" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

const GrafikSoal4 = () => {
  // Grid: 8x8 cells, 16px each, starting at (8,8)
  // Line g from (col=1,row=6) to (col=7,row=2): math slope = -2/3
  const offset = 8;
  const cell = 16;
  const cols = 8;
  const rows = 8;
  const w = offset + cols * cell + offset; // 144
  const h = offset + rows * cell + offset; // 144

  const gx = (col: number) => offset + col * cell;
  const gy = (row: number) => offset + (rows - row) * cell;

  const x1 = gx(1), y1 = gy(6);
  const x2 = gx(7), y2 = gy(2);

  const gridLines: JSX.Element[] = [];
  for (let c = 0; c <= cols; c++) {
    gridLines.push(
      <line key={`v${c}`} x1={gx(c)} y1={offset} x2={gx(c)} y2={h - offset}
        stroke="#FACC15" strokeWidth="0.7" strokeOpacity="0.6" />
    );
  }
  for (let r = 0; r <= rows; r++) {
    gridLines.push(
      <line key={`h${r}`} x1={offset} y1={gy(r)} x2={w - offset} y2={gy(r)}
        stroke="#FACC15" strokeWidth="0.7" strokeOpacity="0.6" />
    );
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="160" height="160"
      style={{ display: "block", margin: "0 auto" }}>
      <rect x="0" y="0" width={w} height={h} rx="6" fill="rgba(0,0,0,0.35)" />
      {gridLines}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={x1} cy={y1} r="3.5" fill="#38BDF8" />
      <circle cx={x2} cy={y2} r="3.5" fill="#38BDF8" />
      <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 + 4}
        fill="white" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">g</text>
    </svg>
  );
};

// No. 16 — line m through (0,−3) and (4,0), slope 3/4
// Origin (80,110), scale 20px
const GrafikSoal16 = () => (
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display:"block", margin:"0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">X</text>
    <text x="83" y="11" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">Y</text>
    <text x="63" y="124" fill="white" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="160" y1="107" x2="160" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="155" y="126" fill="white" fontSize="13" fontFamily="sans-serif">4</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="49" y="175" fill="white" fontSize="13" fontFamily="sans-serif">-3</text>
    {/* line m: (80,170)=(0,-3) and (160,110)=(4,0), SVG slope -3/4 */}
    <line x1="42" y1="198" x2="183" y2="91" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="42,198 51,196 46,190" fill={_lineYellow} />
    <polygon points="183,91 179,99 173,96" fill={_lineYellow} />
    <text x="172" y="88" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">m</text>
  </svg>
);

// No. 17 — line k through (0,1) and dot at (2,3), slope 1
// Origin (80,110), scale 20px
const GrafikSoal17 = () => (
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display:"block", margin:"0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="11" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="63" y="124" fill="white" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="77" y1="90" x2="83" y2="90" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="95" fill="white" fontSize="13" fontFamily="sans-serif">1</text>
    {/* line k: (80,90)=(0,1) → (120,50)=(2,3), SVG slope -1 */}
    <line x1="10" y1="160" x2="152" y2="18" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,160 21,157 18,150" fill={_lineYellow} />
    <polygon points="152,18 146,29 140,25" fill={_lineYellow} />
    <circle cx="120" cy="50" r="3.5" fill={_lineYellow} />
    <text x="124" y="46" fill="white" fontSize="12" fontFamily="sans-serif">(2,3)</text>
    <text x="153" y="15" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">k</text>
  </svg>
);

// No. 20 — two parallel lines, slope 2
// Line 1: through (-2,0) and (0,4); Line h: through (0,-6)
// Origin (80,110), scale 10px
const GrafikSoal20 = () => (
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display:"block", margin:"0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="195" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="11" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="63" y="124" fill="white" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="60" y1="107" x2="60" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="44" y="126" fill="white" fontSize="13" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="70" x2="83" y2="70" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="75" fill="white" fontSize="13" fontFamily="sans-serif">4</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="53" y="175" fill="white" fontSize="13" fontFamily="sans-serif">-6</text>
    {/* Line 1: (60,110)=(-2,0), (80,70)=(0,4), SVG slope -2. Extended (20,190)→(110,10) */}
    <line x1="20" y1="190" x2="110" y2="10" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="20,190 28,183 23,178" fill={_lineYellow} />
    <polygon points="110,10 105,20 99,17" fill={_lineYellow} />
    {/* Line h: (80,170)=(0,-6), same slope. Extended (70,190)→(140,50) */}
    <line x1="70" y1="190" x2="140" y2="50" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="70,190 78,183 73,178" fill={_lineYellow} />
    <polygon points="140,50 136,61 130,57" fill={_lineYellow} />
    <text x="143" y="44" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

// No. 21 — two perpendicular lines at (4,0): line 1 through (0,3)→(4,0); line b perpendicular
// Origin (80,110), scale 15px
const GrafikSoal21 = () => (
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display:"block", margin:"0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">X</text>
    <text x="83" y="11" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic">Y</text>
    <text x="63" y="124" fill="white" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="77" y1="65" x2="83" y2="65" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="70" fill="white" fontSize="13" fontFamily="sans-serif">3</text>
    <line x1="140" y1="107" x2="140" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="134" y="127" fill="white" fontSize="13" fontFamily="sans-serif">4</text>
    {/* Line 1: (80,65)=(0,3) → (140,110)=(4,0), SVG slope 3/4. Extended (10,13)→(185,144) */}
    <line x1="10" y1="13" x2="185" y2="144" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,13 20,15 17,22" fill={_lineYellow} />
    <polygon points="185,144 176,141 179,134" fill={_lineYellow} />
    {/* Line b: through (140,110), SVG slope -4/3. Extended (100,163)→(177,61) */}
    <line x1="100" y1="163" x2="177" y2="61" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="100,163 109,158 106,151" fill={_lineYellow} />
    <polygon points="177,61 169,68 164,63" fill={_lineYellow} />
    {/* Right angle at (140,110) — along line1 dir (0.8,0.6) and lineB dir (0.6,-0.8) */}
    <polyline points="146,115 151,109 145,104" fill="none" stroke="white" strokeWidth="1.2" />
    <text x="179" y="55" fill="white" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">b</text>
  </svg>
);

// No. 22 — lines a and b perpendicular at (2,3)
// a: through (0,4) and (6,0); b: through (2,3), perpendicular to a
// Origin (80,110), scale 15px
const GrafikSoal22 = () => (
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display:"block", margin:"0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="white" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="60" y="54" fill="white" fontSize="9" fontFamily="sans-serif">4</text>
    <line x1="170" y1="107" x2="170" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="165" y="124" fill="white" fontSize="9" fontFamily="sans-serif">6</text>
    {/* Line a: (80,50)=(0,4) → (170,110)=(6,0), SVG slope 2/3. Extended (10,3)→(192,125) */}
    <line x1="10" y1="3" x2="192" y2="125" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,3 21,4 18,11" fill={_lineYellow} />
    <polygon points="192,125 183,121 186,114" fill={_lineYellow} />
    {/* Line b: (110,65)=(2,3), SVG slope -3/2. Extended (54,149)→(148,8) */}
    <line x1="54" y1="149" x2="148" y2="8" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="54,149 63,143 59,137" fill={_lineYellow} />
    <polygon points="148,8 141,17 136,12" fill={_lineYellow} />
    {/* Right angle at (110,65) — along a dir (3,2)/√13 and b dir (2,-3)/√13 */}
    <polyline points="117,69 121,63 114,58" fill="none" stroke="white" strokeWidth="1.2" />
    <text x="5" y="7" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">a</text>
    <text x="149" y="6" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">b</text>
    <text x="114" y="62" fill="white" fontSize="8" fontFamily="sans-serif">(2,3)</text>
  </svg>
);

// No. 23 — lines g and h perpendicular
// g: through (-2,0) and (0,3), slope 3/2; h: through (1,0), slope -2/3
// Origin (80,110), scale 20px
const GrafikSoal23 = () => (
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display:"block", margin:"0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="27" y="123" fill="white" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="100" y1="107" x2="100" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="96" y="123" fill="white" fontSize="9" fontFamily="sans-serif">1</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="white" fontSize="9" fontFamily="sans-serif">3</text>
    {/* g: (40,110)=(-2,0) → (80,50)=(0,3), SVG slope -3/2. Extended (18,143)→(112,2) */}
    <line x1="18" y1="143" x2="112" y2="2" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="18,143 27,136 22,131" fill={_lineYellow} />
    <polygon points="112,2 106,13 100,9" fill={_lineYellow} />
    {/* h: (100,110)=(1,0), SVG slope +2/3. Extended (10,50)→(180,163) */}
    <line x1="10" y1="50" x2="180" y2="163" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,50 20,53 17,59" fill={_lineYellow} />
    <polygon points="180,163 172,155 176,149" fill={_lineYellow} />
    {/* Right angle at intersection (~59,82) */}
    <polyline points="63,76 69,80 65,86" fill="none" stroke="white" strokeWidth="1.2" />
    <text x="113" y="4" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">g</text>
    <text x="5" y="47" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

// No. 24 — three lines q, l, p
// q: through (-6,0) and (0,9), slope 3/2; l: through (0,9), slope -2/3; p: through (0,-4), slope -1/2
// Origin (90,110), scale 10px
const GrafikSoal24 = () => (
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display:"block", margin:"0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="90" y1="195" x2="90" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="90,8 86,16 94,16" fill={_axisBlue} />
    <text x="183" y="107" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">X</text>
    <text x="93" y="10" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Y</text>
    <text x="76" y="122" fill="white" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="30" y1="107" x2="30" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="16" y="123" fill="white" fontSize="9" fontFamily="sans-serif">-6</text>
    <line x1="87" y1="150" x2="93" y2="150" stroke={_axisBlue} strokeWidth="1" />
    <text x="66" y="154" fill="white" fontSize="9" fontFamily="sans-serif">-4</text>
    {/* q: (30,110)=(-6,0) → (90,20)=(0,9), SVG slope -3/2. Extended (20,125)→(100,5) */}
    <line x1="20" y1="125" x2="100" y2="5" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="20,125 29,119 24,114" fill={_lineYellow} />
    <polygon points="100,5 95,16 89,12" fill={_lineYellow} />
    {/* l: (90,20)=(0,9), SVG slope +2/3. From (60,0) → (190,87) */}
    <line x1="60" y1="0" x2="190" y2="87" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="60,0 68,6 63,12" fill={_lineYellow} />
    <polygon points="190,87 182,80 186,73" fill={_lineYellow} />
    {/* p: (90,150)=(0,-4), SVG slope +1/2. Extended (10,110)→(180,150)... */}
    {/* Through (90,150): at x=10 → y=150+(10-90)/2=110; at x=180 → y=150+45=195 */}
    <line x1="10" y1="110" x2="180" y2="195" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,110 20,112 17,119" fill={_lineYellow} />
    <polygon points="180,195 173,188 177,181" fill={_lineYellow} />
    <text x="15" y="118" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">q</text>
    <text x="148" y="54" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">l</text>
    <text x="176" y="192" fill="white" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">p</text>
  </svg>
);

const soalSvgMap: Record<string, JSX.Element> = {
  SOAL3: <GrafikSoal3 />,
  SOAL4: <GrafikSoal4 />,
  SOAL16: <GrafikSoal16 />,
  SOAL17: <GrafikSoal17 />,
  SOAL20: <GrafikSoal20 />,
  SOAL21: <GrafikSoal21 />,
  SOAL22: <GrafikSoal22 />,
  SOAL23: <GrafikSoal23 />,
  SOAL24: <GrafikSoal24 />,
};

const latihanDasar = [
  { no: 1, soal: "Grafik garis dengan persamaan $2x - y = 3$, x dan y $\\in$ R adalah ...", options: ["SVG:SOAL1A", "SVG:SOAL1B", "SVG:SOAL1C", "SVG:SOAL1D"] },
  { no: 2, soal: "Grafik garis dengan persamaan $2x - y = 3$, x dan y $\\in$ R adalah ...", options: ["SVG:SOAL2A", "SVG:SOAL2B", "SVG:SOAL2C", "SVG:SOAL2D"] },
  { no: 3, soal: "Gradien garis h pada gambar di bawah adalah ...", soalSvg: "SOAL3", options: ["A. $-\\frac{3}{2}$", "B. $-\\frac{2}{3}$", "C. $\\frac{2}{3}$", "D. $\\frac{3}{2}$"] },
  { no: 4, soal: "Perhatikan gambar! Gradien garis g adalah ...", soalSvg: "SOAL4", options: ["A. $\\frac{3}{2}$", "B. $\\frac{2}{3}$", "C. $-\\frac{2}{3}$", "D. $-\\frac{3}{2}$"] },
  { no: 5, soal: "Gradien garis yang melalui titik $(2, 1)$ dan $(4, 7)$ adalah ...", options: ["A. 0,2", "B. 0,5", "C. 2", "D. 3"] },
  { no: 6, soal: "Gradien garis dengan persamaan $3x + 8y = 9$ adalah ...", options: ["A. $\\frac{8}{3}$", "B. $\\frac{3}{8}$", "C. $-\\frac{3}{8}$", "D. $-\\frac{8}{3}$"] },
  { no: 7, soal: "Gradien garis yang mempunyai persamaan $3y = 4x + 5$ adalah ...", options: ["A. $-\\frac{4}{5}$", "B. $\\frac{4}{3}$", "C. $\\frac{3}{4}$", "D. $\\frac{3}{5}$"] },
  { no: 8, soal: "Garis lurus p dan q saling tegak lurus. Jika persamaan garis $p: 6x - 3y - 28 = 0$, maka gradien garis q adalah ...", options: ["A. -2", "B. $-\\frac{1}{2}$", "C. $\\frac{1}{2}$", "D. 2"] },
  { no: 9, soal: "Sebuah titik $P(3, d)$ terletak pada garis yang melalui titik $Q(-2, 10)$ dan $R(1, 1)$, jika nilai d adalah ...", options: ["A. 13", "B. 7", "C. -5", "D. -13"] },
  { no: 10, soal: "Jika garis yang menghubungkan titik $(2a, 3)$ dan $(4, 9)$ mempunyai gradien 3, maka nilai a adalah ...", options: ["A. 1", "B. -1", "C. 2", "D. -2"] },
  { no: 11, soal: "Diantara persamaan garis berikut:\n(I). $2y = 8x + 20$\n(II). $6y = 12x + 18$\n(III). $3y = 12x + 15$\n(IV). $3y = -6x + 15$\nyang grafiknya saling sejajar adalah ...", options: ["A. (I) dan (II)", "B. (I) dan (III)", "C. (III) dan (IV)", "D. (II) dan (IV)"] },
  { no: 12, soal: "Di antara persamaan garis berikut:\n(I) $x + 2y = 8$\n(II) $x - 2y = 10$\n(III) $-2x + y - 9 = 0$\n(IV) $2x - y - 6 = 0$\nYang grafiknya saling tegak lurus adalah ...", options: ["A. (I) dan (II)", "B. (I) dan (III)", "C. (III) dan (IV)", "D. (II) dan (IV)"] },
  { no: 13, soal: "Persamaan garis yang melalui titik $(0, 3)$ dan gradien $\\frac{1}{2}$ adalah ...", options: ["A. $2x - 4y - 6 = 0$", "B. $2y - x = 6$", "C. $y - 4x - 6 = 0$", "D. $2y - 3x - 3 = 0$"] },
  { no: 14, soal: "Sebuah garis melalui titik $(8, 9)$ dan memiliki gradien $-\\frac{3}{4}$. Persamaan garis tersebut adalah ...", options: ["A. $4y - 3x - 60 = 0$", "B. $4y + 3x - 60 = 0$", "C. $4y - 3x + 60 = 0$", "D. $4y + 3x + 60 = 0$"] },
  { no: 15, soal: "Persamaan garis yang melalui titik $(2, -5)$ dan $(-3, 6)$ adalah ...", options: ["A. $11x - 5y = -3$", "B. $11x + 5y = -3$", "C. $11x + 5y = 3$", "D. $11x - 5y = 3$"] },
  { no: 16, soal: "Perhatikan gambar! Persamaan garis m adalah ...", soalSvg: "SOAL16", options: ["A. $4y - 3x - 12 = 0$", "B. $4x - 3y - 12 = 0$", "C. $4y - 3x + 12 = 0$", "D. $4x - 3y + 12 = 0$"] },
  { no: 17, soal: "Perhatikan gambar berikut! Persamaan garis k adalah ...", soalSvg: "SOAL17", options: ["A. $2x + 2y = 2$", "B. $2x - 2y = 2$", "C. $2x + 2y = -2$", "D. $2x - 2y = -2$"] },
  { no: 18, soal: "Garis g mempunyai persamaan $8x + 4y - 16 = 0$. Garis h sejajar dengan garis g dan melalui titik $(5, -3)$. Persamaan garis h adalah ...", options: ["A. $2x - y - 13 = 0$", "B. $2x + y - 7 = 0$", "C. $x - 2y - 7 = 0$", "D. $-x + 2y + 11 = 0$"] },
  { no: 19, soal: "Persamaan garis melalui $(-1, 2)$ dan tegak lurus terhadap garis $4y = -3x + 5$ adalah ...", options: ["A. $4x - 3y + 10 = 0$", "B. $4x - 3y - 10 = 0$", "C. $3x + 4y - 5 = 0$", "D. $3x + 4y + 5 = 0$"] },
  { no: 20, soal: "Perhatikan gambar berikut! Persamaan garis h adalah ...", soalSvg: "SOAL20", options: ["A. $3x + y = 4$", "B. $3x - y = 4$", "C. $x + 3y = 4$", "D. $x - 3y = 4$"] },
  { no: 21, soal: "Perhatikan gambar berikut! Persamaan garis b adalah ...", soalSvg: "SOAL21", options: ["A. $y = \\frac{3}{4}x - \\frac{16}{3}$", "B. $y = \\frac{4}{3}x - \\frac{16}{3}$", "C. $y = \\frac{3}{4}x + \\frac{16}{3}$", "D. $y = \\frac{4}{3}x + \\frac{16}{3}$"] },
  { no: 22, soal: "Perhatikan gambar berikut! Persamaan garis lurus b adalah ...", soalSvg: "SOAL22", options: ["A. $2y - 3x = -5$", "B. $2y - 3x = 0$", "C. $3y - 2x = 5$", "D. $3y - 2x = 0$"] },
  { no: 23, soal: "Perhatikan gambar! Persamaan garis h adalah ...", soalSvg: "SOAL23", options: ["A. $3y + 2x = 3$", "B. $3y - 2x = 3$", "C. $2x + 3y = 1$", "D. $3x - 2y = 3$"] },
  { no: 24, soal: "Perhatikan gambar di bawah ini! Persamaan garis adalah ...", soalSvg: "SOAL24", options: ["A. $2x + 3y - 27 = 0$", "B. $2x + 3y + 27 = 0$", "C. $2x - 3y - 27 = 0$", "D. $3x + 2y - 27 = 0$"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2008 Tingkat Kota\nGaris g melalui titik $(-2, 3)$, memotong sumbu-x di titik A dan memotong sumbu-y di titik B. Jika jarak titik O dengan titik A sama dengan jarak titik O dengan titik B, maka persamaan garis g adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2010 Tingkat Kota\nGaris l melalui titik $(-4, -3)$ dan $(3, 4)$. Jika garis l juga melalui titik $(a, b)$, maka nilai $\\frac{a^3 - b^3}{a^2 - b^2} + \\frac{2}{a^3 - b^3} = ...$", options: ["A. 23", "B. 1", "C. -1", "D. -28", "E. -31"] },
  { no: 3, soal: "OSN Matematika 2016 Tingkat Kota\nDiketahui dua titik $A(1, 1)$ dan $B(12, -1)$. Garis l dengan gradien $-\\frac{3}{4}$ melalui titik B. Jarak antara titik A dan garis l adalah ... satuan panjang", options: ["A. 4", "B. 5", "C. 6", "D. 7"] },
];

const OlimpiadePersamaanGarisPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSections.length }, (_, i) => i));

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - PERSAMAAN GARIS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSections.map((section, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <span className="font-display text-sm text-accent font-bold">{section.heading}</span>
                  {expandedSections.includes(idx) ? (
                    <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                  )}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-5 pt-1 space-y-1">
                    {section.items.map((item, i) => {
                      if (item.t === 'formula') {
                        return <FormulaCard key={i} headline={item.headline} headlineSuffix={item.headlineSuffix} lines={item.lines} color={item.color} />;
                      }
                      if (item.t === 'heading') {
                        const c = colorMap[item.color] || colorMap.cyan;
                        return (
                          <div key={i} className={`font-display text-sm font-bold ${c.text} pt-3 pb-1`}>
                            {item.text}
                          </div>
                        );
                      }
                      if (item.t === 'text') {
                        return (
                          <div key={i} className={`font-body text-sm ${item.color || 'text-white/80'} leading-relaxed py-0.5`}>
                            {renderWithLatex(item.text)}
                          </div>
                        );
                      }
                      if (item.t === 'svg') {
                        const svgMap: Record<string, JSX.Element> = {
                          TABLE_TITIK: <TabelTitikGrafik />,
                          GRAFIK_TITIK: <GrafikTitikPotong />,
                          GRAFIK2: <GrafikTitikPotong2 />,
                          GRAFIK3: <GrafikTitikPotong3 />,
                          GRAFIK4: <GrafikTitikPotong4 />,
                          GRADIEN_POSITIF: <GarisGradienPositif />,
                          GRADIEN_NEGATIF: <GarisGradienNegatif />,
                        };
                        return <div key={i}>{svgMap[item.name]}</div>;
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => {
              const optLabels = ["A", "B", "C", "D"];
              const svgOptionMap: Record<string, JSX.Element> = {
                "SVG:SOAL1A": <GrafikSoal1A />,
                "SVG:SOAL1B": <GrafikSoal1B />,
                "SVG:SOAL1C": <GrafikSoal1C />,
                "SVG:SOAL1D": <GrafikSoal1D />,
                "SVG:SOAL2A": <GrafikSoal1A />,
                "SVG:SOAL2B": <GrafikSoal1B />,
                "SVG:SOAL2C": <GrafikSoal2C />,
                "SVG:SOAL2D": <GrafikSoal1D />,
              };
              const hasSvgOptions = soal.options.some(opt => opt.startsWith("SVG:"));
              return (
                <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal)}
                  </div>
                  {'soalSvg' in soal && soal.soalSvg && (
                    <div className="mb-3">
                      {soalSvgMap[soal.soalSvg]}
                    </div>
                  )}
                  {soal.options.length > 0 && (
                    <div className={`grid gap-2 ${hasSvgOptions ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                      {soal.options.map((opt, j) => {
                        const svgEl = svgOptionMap[opt];
                        return (
                          <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                            {svgEl ? (
                              <div>
                                <span className="text-white font-bold block mb-1">{optLabels[j]}.</span>
                                {svgEl}
                              </div>
                            ) : (
                              renderWithLatex(opt)
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadePersamaanGarisPage;
