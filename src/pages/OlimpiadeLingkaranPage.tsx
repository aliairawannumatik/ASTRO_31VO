import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import PembahasanCard from "@/components/PembahasanCard";
import { lingkaranDasarPembahasan } from "@/data/pembahasan/lingkaranDasar";
import { lingkaranOlimpiadePembahasan } from "@/data/pembahasan/lingkaranOlimpiade";
import dasar3 from "@assets/3_1778279067121.png";
import dasar4 from "@assets/4_1778279067122.png";
import dasar5 from "@assets/5_1778279067123.png";
import dasar6 from "@assets/6_1778279067124.jpg";
import dasar8 from "@assets/8_1778279067129.png";
import dasar9 from "@assets/9_1778279067129.png";
import dasar11 from "@assets/11_1778279067124.jpg";
import dasar14 from "@assets/14_1778279067128.png";
import dasar15 from "@assets/15_1778279067129.png";
import dasar16 from "@assets/16_1778278243308.png";
import dasar17 from "@assets/17_1778279067127.png";
import dasar18 from "@assets/18_1778279067128.png";
import dasar19 from "@assets/19_1778279067126.png";
import dasar20 from "@assets/20_1778279067125.jpeg";
import dasar21 from "@assets/21_1778279067127.png";
import dasar22 from "@assets/22_1778279067126.png";
import dasar23 from "@assets/23_1778279067124.jpeg";
import dasar24 from "@assets/24_1778279067126.png";
import dasar25 from "@assets/25_1778278243303.png";
import dasar26 from "@assets/26_1778279067122.png";
import dasar27 from "@assets/27_1778279067123.png";
import dasar28 from "@assets/28_1778278243305.png";
import dasar29 from "@assets/29_1778279067125.png";
import dasar31 from "@assets/31_1778278243303.png";
import dasar32 from "@assets/32_1778278243304.png";
import dasar34 from "@assets/34_1778278243304.png";
import dasar35 from "@assets/35_1778278243305.jpg";
import dasar36 from "@assets/36_1778278243302.png";
import olim3 from "@assets/3_1778279167066.png";
import olim4 from "@assets/4_1778279167067.png";
import olim5 from "@assets/5_1778279167068.png";
import olim6 from "@assets/6_1778279167069.jpg";
import olim8 from "@assets/8_1778279167074.png";
import olim9 from "@assets/9_1778279167074.png";
import olim11 from "@assets/11_1778279167069.jpg";
import olim14 from "@assets/14_1778279167073.png";
import olim15 from "@assets/15_1778279167073.png";
import olim17 from "@assets/17_1778279167072.png";
import olim18 from "@assets/18_1778279167073.png";
import olim19 from "@assets/19_1778279167072.png";
import olim20 from "@assets/20_1778279167070.jpeg";
import olim21 from "@assets/21_1778279167072.png";
import olim22 from "@assets/22_1778279167071.png";
import olim23 from "@assets/23_1778279167070.jpeg";
import olim24 from "@assets/24_1778279167071.png";
import olim26 from "@assets/26_1778279167067.png";
import olim27 from "@assets/27_1778279167068.png";
import olim29 from "@assets/29_1778279167071.png";

const M = ({ math }: { math: string }) => <InlineMath math={math} />;

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

/* ─────────────────────────────────────────────────────────
   SVG DIAGRAM COMPONENTS
───────────────────────────────────────────────────────── */

const UnsurLingkaranSVG = () => (
  <svg viewBox="0 0 340 310" className="w-full max-w-xs mx-auto">
    <defs>
      <radialGradient id="circFill" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#0f172a" />
      </radialGradient>
      <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" />
      </marker>
    </defs>

    {/* Main circle */}
    <circle cx="170" cy="155" r="110" fill="url(#circFill)" stroke="#6366f1" strokeWidth="2.5" />

    {/* Juring (sector) – shaded slice 0°–70° */}
    <path d="M170,155 L170,45 A110,110 0,0,1 273,113 Z"
      fill="#7c3aed" fillOpacity="0.35" stroke="#a78bfa" strokeWidth="1.5" />

    {/* Tembereng (segment) between chord C–D */}
    <path d="M95,95 A110,110 0,0,1 95,215 Z"
      fill="#0ea5e9" fillOpacity="0.20" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" />

    {/* Diameter */}
    <line x1="60" y1="155" x2="280" y2="155" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />

    {/* Radius to top */}
    <line x1="170" y1="155" x2="170" y2="45" stroke="#818cf8" strokeWidth="2" />

    {/* Tali busur (chord) */}
    <line x1="95" y1="95" x2="95" y2="215" stroke="#34d399" strokeWidth="2" />

    {/* Center point */}
    <circle cx="170" cy="155" r="4" fill="#f8fafc" />

    {/* Arc arrow for busur */}
    <path d="M 270,113 A 110,110 0 0,1 238,235" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />

    {/* Labels */}
    <text x="178" y="150" fill="#e2e8f0" fontSize="13" fontWeight="bold">O</text>
    <text x="175" y="92" fill="#818cf8" fontSize="11">r</text>
    <text x="158" y="28" fill="#818cf8" fontSize="11" fontWeight="bold">A</text>
    <text x="285" y="158" fill="#f59e0b" fontSize="11" fontWeight="bold">B</text>
    <text x="45" y="158" fill="#f59e0b" fontSize="11" fontWeight="bold">C</text>
    <text x="77" y="90" fill="#34d399" fontSize="11" fontWeight="bold">D</text>
    <text x="77" y="223" fill="#34d399" fontSize="11" fontWeight="bold">E</text>
    <text x="245" y="100" fill="#f472b6" fontSize="11" fontWeight="bold">F</text>
    <text x="225" y="245" fill="#f472b6" fontSize="11" fontWeight="bold">G</text>

    {/* Legend */}
    <rect x="10" y="270" width="10" height="10" fill="#818cf8" rx="2" />
    <text x="25" y="280" fill="#c4b5fd" fontSize="10">Jari-jari (OA)</text>
    <rect x="110" y="270" width="10" height="10" fill="#f59e0b" rx="2" />
    <text x="125" y="280" fill="#fcd34d" fontSize="10">Diameter (CB)</text>
    <rect x="10" y="288" width="10" height="10" fill="#34d399" rx="2" />
    <text x="25" y="298" fill="#6ee7b7" fontSize="10">Tali busur (DE)</text>
    <rect x="110" y="288" width="10" height="10" fill="#f472b6" rx="2" />
    <text x="125" y="298" fill="#f9a8d4" fontSize="10">Busur FG</text>
    <rect x="218" y="270" width="10" height="10" fill="#7c3aed" rx="2" />
    <text x="232" y="280" fill="#c4b5fd" fontSize="10">Juring</text>
    <rect x="218" y="288" width="10" height="10" fill="#0ea5e9" rx="2" />
    <text x="232" y="298" fill="#7dd3fc" fontSize="10">Tembereng</text>
  </svg>
);

const BusurJuringSVG = () => (
  <svg viewBox="0 0 240 230" className="w-full max-w-[240px] mx-auto">
    {/* full circle faint */}
    <circle cx="120" cy="115" r="85" fill="#0f172a" stroke="#334155" strokeWidth="1.2" strokeDasharray="4,3" />
    {/* juring sector ~110 degrees: from A (top) clockwise to B */}
    <path d="M120,115 L120,30 A85,85 0,0,1 199.9,144.1 Z"
      fill="#7c3aed" fillOpacity="0.4" stroke="#a78bfa" strokeWidth="2" />
    {/* arc highlight: busur AB */}
    <path d="M120,30 A85,85 0,0,1 199.9,144.1"
      fill="none" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round" />
    {/* angle arc α at center O between OA and OB */}
    <path d="M120,80 A35,35 0,0,1 153.0,127.0" fill="none" stroke="#fbbf24" strokeWidth="2" />
    {/* center O */}
    <circle cx="120" cy="115" r="3.5" fill="#f8fafc" />

    {/* Labels */}
    <text x="105" y="119" fill="#e2e8f0" fontSize="12" fontWeight="bold">O</text>
    <text x="113" y="22" fill="#e2e8f0" fontSize="12" fontWeight="bold">A</text>
    <text x="205" y="148" fill="#e2e8f0" fontSize="12" fontWeight="bold">B</text>
    {/* r label on OA */}
    <text x="124" y="75" fill="#818cf8" fontSize="12" fontStyle="italic">r</text>
    {/* r label on OB */}
    <text x="158" y="122" fill="#818cf8" fontSize="12" fontStyle="italic">r</text>
    {/* α label inside the wedge */}
    <text x="139" y="105" fill="#fbbf24" fontSize="14" fontWeight="bold">α</text>
    {/* Busur AB label near arc */}
    <text x="200" y="80" fill="#f472b6" fontSize="10" fontStyle="italic">busur</text>
    <text x="158" y="65" fill="#a78bfa" fontSize="10" fontStyle="italic">juring</text>
  </svg>
);

const PerbandinganSVG = () => (
  <svg viewBox="0 0 320 290" className="w-full max-w-[320px] mx-auto">
    {/* main circle */}
    <circle cx="160" cy="145" r="115" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

    {/* Sector AOB (purple) — central angle α ≈ 40° (top) */}
    <path d="M160,145 L140,31.7 A115,115 0,0,1 217.5,45.4 Z"
      fill="#7c3aed" fillOpacity="0.45" stroke="#a78bfa" strokeWidth="2" />

    {/* Sector COD (cyan) — central angle β ≈ 100° (lower-left) */}
    <path d="M160,145 L199.3,253.1 A115,115 0,0,1 46.8,165 Z"
      fill="#0ea5e9" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" />

    {/* center O */}
    <circle cx="160" cy="145" r="4" fill="#f8fafc" />

    {/* Angle arc α at O (between OA and OB) */}
    <path d="M155.1,117.4 A28,28 0,0,1 174,120.7" fill="none" stroke="#fbbf24" strokeWidth="2.2" />
    {/* Angle arc β at O (between OC and OD) */}
    <path d="M169.6,171.3 A28,28 0,0,1 132.4,149.9" fill="none" stroke="#fbbf24" strokeWidth="2.2" />

    {/* Point dots */}
    <circle cx="140" cy="31.7" r="3" fill="#f8fafc" />
    <circle cx="217.5" cy="45.4" r="3" fill="#f8fafc" />
    <circle cx="199.3" cy="253.1" r="3" fill="#f8fafc" />
    <circle cx="46.8" cy="165" r="3" fill="#f8fafc" />

    {/* Vertex labels */}
    <text x="135" y="155" fill="#e2e8f0" fontSize="13" fontWeight="bold">O</text>
    <text x="125" y="24" fill="#e2e8f0" fontSize="13" fontWeight="bold">A</text>
    <text x="222" y="40" fill="#e2e8f0" fontSize="13" fontWeight="bold">B</text>
    <text x="204" y="270" fill="#e2e8f0" fontSize="13" fontWeight="bold">C</text>
    <text x="30" y="170" fill="#e2e8f0" fontSize="13" fontWeight="bold">D</text>

    {/* Angle labels */}
    <text x="160" y="125" fill="#fbbf24" fontSize="14" fontWeight="bold">α</text>
    <text x="142" y="167" fill="#fbbf24" fontSize="14" fontWeight="bold">β</text>

    {/* Sector name labels */}
    <text x="170" y="75" fill="#c4b5fd" fontSize="11" fontStyle="italic" fontWeight="bold">Juring AOB</text>
    <text x="60" y="218" fill="#7dd3fc" fontSize="11" fontStyle="italic" fontWeight="bold">Juring COD</text>
  </svg>
);

const SudutPusatKelilingSVG = () => (
  <svg viewBox="0 0 280 220" className="w-full max-w-[240px] mx-auto">
    <circle cx="140" cy="120" r="90" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
    {/* arc AB highlighted */}
    <path d="M86,48 A90,90 0,0,1 194,48" fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
    {/* central angle AOB */}
    <line x1="140" y1="120" x2="86" y2="48" stroke="#818cf8" strokeWidth="1.8" />
    <line x1="140" y1="120" x2="194" y2="48" stroke="#818cf8" strokeWidth="1.8" />
    {/* inscribed angle ACB from bottom */}
    <line x1="140" y1="210" x2="86" y2="48" stroke="#34d399" strokeWidth="1.8" strokeDasharray="5,3" />
    <line x1="140" y1="210" x2="194" y2="48" stroke="#34d399" strokeWidth="1.8" strokeDasharray="5,3" />
    {/* angle arc at O */}
    <path d="M125,109 A18,18 0,0,1 155,109" fill="none" stroke="#fbbf24" strokeWidth="2" />
    {/* angle arc at C */}
    <path d="M132,194 A18,18 0,0,1 148,194" fill="none" stroke="#fbbf24" strokeWidth="2" />
    {/* Points */}
    <circle cx="140" cy="120" r="3.5" fill="#f8fafc" />
    <circle cx="86" cy="48" r="3" fill="#f8fafc" />
    <circle cx="194" cy="48" r="3" fill="#f8fafc" />
    <circle cx="140" cy="210" r="3" fill="#f8fafc" />
    {/* Labels */}
    <text x="148" y="116" fill="#e2e8f0" fontSize="12" fontWeight="bold">O</text>
    <text x="72" y="42" fill="#e2e8f0" fontSize="12" fontWeight="bold">A</text>
    <text x="198" y="42" fill="#e2e8f0" fontSize="12" fontWeight="bold">B</text>
    <text x="133" y="222" fill="#e2e8f0" fontSize="12" fontWeight="bold">C</text>
    <text x="133" y="104" fill="#fbbf24" fontSize="10">2α</text>
    <text x="133" y="190" fill="#fbbf24" fontSize="10">α</text>

    {/* Rule box */}
    <rect x="0" y="0" width="128" height="36" rx="7" fill="#1e1b4b" stroke="#a16207" strokeWidth="1" />
    <text x="64" y="13" fill="#fcd34d" fontSize="9" textAnchor="middle" fontWeight="bold">Sudut Pusat & Keliling</text>
    <text x="64" y="27" fill="#fbbf24" fontSize="9" textAnchor="middle">∠AOB = 2 × ∠ACB</text>
  </svg>
);

const SudutDiameterSVG = () => (
  <svg viewBox="0 0 200 160" className="w-full max-w-[180px] mx-auto">
    <circle cx="100" cy="85" r="70" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
    {/* diameter AB */}
    <line x1="30" y1="85" x2="170" y2="85" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
    {/* lines from C */}
    <line x1="100" y1="15" x2="30" y2="85" stroke="#818cf8" strokeWidth="1.8" />
    <line x1="100" y1="15" x2="170" y2="85" stroke="#818cf8" strokeWidth="1.8" />
    {/* right angle mark at C — aligned with CA and CB legs */}
    <path d="M92.93,22.07 L100,29.14 L107.07,22.07" fill="none" stroke="#34d399" strokeWidth="1.6" />
    {/* Points */}
    <circle cx="100" cy="15" r="3" fill="#f8fafc" />
    <circle cx="30" cy="85" r="3" fill="#f8fafc" />
    <circle cx="170" cy="85" r="3" fill="#f8fafc" />
    <circle cx="100" cy="85" r="3" fill="#f8fafc" />
    <text x="96" y="9" fill="#e2e8f0" fontSize="12" fontWeight="bold">C</text>
    <text x="16" y="88" fill="#f59e0b" fontSize="12" fontWeight="bold">A</text>
    <text x="174" y="88" fill="#f59e0b" fontSize="12" fontWeight="bold">B</text>
    <text x="104" y="82" fill="#e2e8f0" fontSize="11" fontWeight="bold">O</text>
    <text x="30" y="140" fill="#34d399" fontSize="10">∠BAC = 90° (menghadap diameter)</text>
  </svg>
);

const SudutBusurSamaSVG = () => (
  <svg viewBox="0 0 280 250" className="w-full max-w-[280px] mx-auto">
    {/* main circle */}
    <circle cx="140" cy="130" r="100" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

    {/* Highlighted minor arc AB (the common subtended arc, going through the bottom) */}
    <path d="M46,164.2 A100,100 0,0,0 234,164.2" fill="none" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />

    {/* Chord AB (dashed) for reference */}
    <line x1="46" y1="164.2" x2="234" y2="164.2" stroke="#f472b6" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.55" />

    {/* Inscribed angle from C (green) */}
    <line x1="190" y1="43.4" x2="46" y2="164.2" stroke="#34d399" strokeWidth="1.7" />
    <line x1="190" y1="43.4" x2="234" y2="164.2" stroke="#34d399" strokeWidth="1.7" />
    {/* Inscribed angle from D (orange) */}
    <line x1="140" y1="30" x2="46" y2="164.2" stroke="#fb923c" strokeWidth="1.7" />
    <line x1="140" y1="30" x2="234" y2="164.2" stroke="#fb923c" strokeWidth="1.7" />
    {/* Inscribed angle from E (cyan) */}
    <line x1="90" y1="43.4" x2="46" y2="164.2" stroke="#38bdf8" strokeWidth="1.7" />
    <line x1="90" y1="43.4" x2="234" y2="164.2" stroke="#38bdf8" strokeWidth="1.7" />

    {/* Angle arcs at each vertex – sweep 0 to draw the inner side */}
    <path d="M176.2,55.0 A18,18 0,0,0 196.2,60.3" fill="none" stroke="#fbbf24" strokeWidth="2" />
    <path d="M129.7,44.7 A18,18 0,0,0 150.3,44.7" fill="none" stroke="#fbbf24" strokeWidth="2" />
    <path d="M83.8,60.3 A18,18 0,0,0 103.8,55.0" fill="none" stroke="#fbbf24" strokeWidth="2" />

    {/* Vertex points */}
    <circle cx="46" cy="164.2" r="3.5" fill="#f8fafc" />
    <circle cx="234" cy="164.2" r="3.5" fill="#f8fafc" />
    <circle cx="190" cy="43.4" r="3.5" fill="#f8fafc" />
    <circle cx="140" cy="30" r="3.5" fill="#f8fafc" />
    <circle cx="90" cy="43.4" r="3.5" fill="#f8fafc" />

    {/* Vertex labels */}
    <text x="28" y="160" fill="#f472b6" fontSize="14" fontWeight="bold">A</text>
    <text x="240" y="160" fill="#f472b6" fontSize="14" fontWeight="bold">B</text>
    <text x="196" y="38" fill="#34d399" fontSize="14" fontWeight="bold">C</text>
    <text x="135" y="22" fill="#fb923c" fontSize="14" fontWeight="bold">D</text>
    <text x="76" y="38" fill="#38bdf8" fontSize="14" fontWeight="bold">E</text>

    {/* Angle value labels (α at each vertex) */}
    <text x="183" y="74" fill="#fbbf24" fontSize="12" fontWeight="bold">α</text>
    <text x="135" y="62" fill="#fbbf24" fontSize="12" fontWeight="bold">α</text>
    <text x="86" y="74" fill="#fbbf24" fontSize="12" fontWeight="bold">α</text>

    {/* Arc AB caption – placed inside the segment below the chord */}
    <text x="113" y="222" fill="#f472b6" fontSize="11" fontStyle="italic" fontWeight="bold">busur AB</text>
  </svg>
);

const SegiempatTaliBusurSVG = () => (
  <svg viewBox="0 0 320 290" className="w-full max-w-[300px] mx-auto">
    <circle cx="160" cy="145" r="115" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
    {/* Cyclic quadrilateral ABCD inscribed in the circle (radius 115, center 160,145) */}
    {/* A at 100°: (140, 31) */}
    {/* B at  20°: (268, 105) */}
    {/* C at 290°: (199, 253) */}
    {/* D at 200°: ( 52, 106) */}
    <polygon points="140,31 268,105 199,253 52,106"
      fill="#7c3aed" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="2" />

    {/* Vertex points */}
    <circle cx="140" cy="31" r="3.5" fill="#f8fafc" />
    <circle cx="268" cy="105" r="3.5" fill="#f8fafc" />
    <circle cx="199" cy="253" r="3.5" fill="#f8fafc" />
    <circle cx="52" cy="106" r="3.5" fill="#f8fafc" />

    {/* Vertex labels */}
    <text x="128" y="24" fill="#e2e8f0" fontSize="14" fontWeight="bold">A</text>
    <text x="274" y="102" fill="#e2e8f0" fontSize="14" fontWeight="bold">B</text>
    <text x="195" y="270" fill="#e2e8f0" fontSize="14" fontWeight="bold">C</text>
    <text x="34" y="110" fill="#e2e8f0" fontSize="14" fontWeight="bold">D</text>

    {/* Opposite-angle relationship labels */}
    <text x="155" y="142" fill="#f472b6" fontSize="11" fontWeight="bold" textAnchor="middle">∠A + ∠C = 180°</text>
    <text x="155" y="160" fill="#f472b6" fontSize="11" fontWeight="bold" textAnchor="middle">∠B + ∠D = 180°</text>
  </svg>
);

const GarisSinggungSVG = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-[300px] mx-auto">
    {/* Circle: O(110,110), r=70 */}
    <circle cx="110" cy="110" r="70" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />

    {/* Reference line OB (dashed) */}
    <line x1="110" y1="110" x2="260" y2="110" stroke="#475569" strokeWidth="1.2" strokeDasharray="4,3" />

    {/* Radii to tangent points A and C (perpendicular to BA and BC respectively) */}
    <line x1="110" y1="110" x2="142.67" y2="48.1" stroke="#818cf8" strokeWidth="2" />
    <line x1="110" y1="110" x2="142.67" y2="171.9" stroke="#818cf8" strokeWidth="2" />

    {/* Tangent lines from external point B to A and C */}
    <line x1="142.67" y1="48.1" x2="260" y2="110" stroke="#34d399" strokeWidth="2.5" />
    <line x1="142.67" y1="171.9" x2="260" y2="110" stroke="#34d399" strokeWidth="2.5" />

    {/* Right-angle marks at A and C — aligned with the radius and tangent */}
    <path d="M138,56.94 L146.84,61.61 L151.51,52.77" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    <path d="M138,163.06 L146.84,158.39 L151.51,167.23" fill="none" stroke="#fbbf24" strokeWidth="1.6" />

    {/* Points */}
    <circle cx="110" cy="110" r="4" fill="#f8fafc" />
    <circle cx="142.67" cy="48.1" r="3.5" fill="#f8fafc" />
    <circle cx="142.67" cy="171.9" r="3.5" fill="#f8fafc" />
    <circle cx="260" cy="110" r="3.5" fill="#f8fafc" />

    {/* Vertex labels */}
    <text x="93" y="115" fill="#e2e8f0" fontSize="14" fontWeight="bold">O</text>
    <text x="135" y="40" fill="#e2e8f0" fontSize="14" fontWeight="bold">A</text>
    <text x="135" y="192" fill="#e2e8f0" fontSize="14" fontWeight="bold">C</text>
    <text x="267" y="115" fill="#e2e8f0" fontSize="14" fontWeight="bold">B</text>

    {/* r label on radius OA */}
    <text x="115" y="82" fill="#818cf8" fontSize="13" fontStyle="italic" fontWeight="bold">r</text>

    {/* Tangent length label */}
    <text x="180" y="64" fill="#6ee7b7" fontSize="11" fontStyle="italic">garis singgung</text>
  </svg>
);

const GSPLuarSVG = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-[320px] mx-auto">
    {/* Big circle: O₁(80, 110), R = 50 */}
    <circle cx="80" cy="110" r="50" fill="#0f172a" stroke="#7c3aed" strokeWidth="2" />
    {/* Small circle: O₂(250, 110), r = 30 */}
    <circle cx="250" cy="110" r="30" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />

    {/* Center line O₁O₂ (dashed) */}
    <line x1="80" y1="110" x2="250" y2="110" stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="5,4" />

    {/* Radii to tangent points (both on the upper side) */}
    <line x1="80" y1="110" x2="85.88" y2="60.34" stroke="#a78bfa" strokeWidth="1.8" />
    <line x1="250" y1="110" x2="253.53" y2="80.21" stroke="#7dd3fc" strokeWidth="1.8" />

    {/* External common tangent line (touches both circles on the same side) */}
    <line x1="85.88" y1="60.34" x2="253.53" y2="80.21" stroke="#34d399" strokeWidth="2.6" />

    {/* Right-angle marks at tangent points */}
    <path d="M84.94,68.29 L92.88,69.23 L93.83,61.28" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    <path d="M252.59,88.15 L244.65,87.21 L245.59,79.27" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

    {/* Center & tangent points */}
    <circle cx="80" cy="110" r="3.5" fill="#f8fafc" />
    <circle cx="250" cy="110" r="3.5" fill="#f8fafc" />
    <circle cx="85.88" cy="60.34" r="3" fill="#f8fafc" />
    <circle cx="253.53" cy="80.21" r="3" fill="#f8fafc" />

    {/* Labels */}
    <text x="64" y="125" fill="#c4b5fd" fontSize="13" fontWeight="bold">O₁</text>
    <text x="242" y="125" fill="#7dd3fc" fontSize="13" fontWeight="bold">O₂</text>
    <text x="100" y="92" fill="#a78bfa" fontSize="12" fontStyle="italic" fontWeight="bold">R</text>
    <text x="258" y="100" fill="#7dd3fc" fontSize="12" fontStyle="italic" fontWeight="bold">r</text>
    <text x="160" y="125" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">p</text>
    <text x="160" y="55" fill="#6ee7b7" fontSize="12" fontStyle="italic" fontWeight="bold">l</text>
    <text x="138" y="195" fill="#6ee7b7" fontSize="11" textAnchor="middle" fontStyle="italic">GSPL — Garis Singgung Persekutuan Luar</text>
  </svg>
);

const GSPDalamSVG = () => (
  <svg viewBox="0 0 340 220" className="w-full max-w-[320px] mx-auto">
    {/* Big circle: O₁(80, 110), R = 50 */}
    <circle cx="80" cy="110" r="50" fill="#0f172a" stroke="#7c3aed" strokeWidth="2" />
    {/* Small circle: O₂(250, 110), r = 30 */}
    <circle cx="250" cy="110" r="30" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />

    {/* Center line O₁O₂ (dashed) */}
    <line x1="80" y1="110" x2="250" y2="110" stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="5,4" />

    {/* Radii to tangent points (opposite sides) */}
    <line x1="80" y1="110" x2="103.53" y2="65.88" stroke="#a78bfa" strokeWidth="1.8" />
    <line x1="250" y1="110" x2="235.88" y2="136.47" stroke="#7dd3fc" strokeWidth="1.8" />

    {/* Internal common tangent line (crosses between the two circles) */}
    <line x1="103.53" y1="65.88" x2="235.88" y2="136.47" stroke="#f472b6" strokeWidth="2.6" />

    {/* Right-angle marks at tangent points */}
    <path d="M99.77,72.94 L106.83,76.70 L110.59,69.64" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    <path d="M239.64,129.41 L232.58,125.65 L228.82,132.71" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

    {/* Center & tangent points */}
    <circle cx="80" cy="110" r="3.5" fill="#f8fafc" />
    <circle cx="250" cy="110" r="3.5" fill="#f8fafc" />
    <circle cx="103.53" cy="65.88" r="3" fill="#f8fafc" />
    <circle cx="235.88" cy="136.47" r="3" fill="#f8fafc" />

    {/* Labels */}
    <text x="62" y="125" fill="#c4b5fd" fontSize="13" fontWeight="bold">O₁</text>
    <text x="252" y="125" fill="#7dd3fc" fontSize="13" fontWeight="bold">O₂</text>
    <text x="115" y="95" fill="#a78bfa" fontSize="12" fontStyle="italic" fontWeight="bold">R</text>
    <text x="222" y="130" fill="#7dd3fc" fontSize="12" fontStyle="italic" fontWeight="bold">r</text>
    <text x="160" y="125" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">p</text>
    <text x="175" y="108" fill="#f9a8d4" fontSize="12" fontStyle="italic" fontWeight="bold">d</text>
    <text x="138" y="205" fill="#f9a8d4" fontSize="11" textAnchor="middle" fontStyle="italic">GSPD — Garis Singgung Persekutuan Dalam</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────
   MATERI SECTIONS (rich content)
───────────────────────────────────────────────────────── */

type MateriSection = {
  heading: string;
  color: string;
  borderColor: string;
  content: React.ReactNode;
};

const materiSections: MateriSection[] = [
  {
    heading: "A. Unsur-Unsur Lingkaran",
    color: "from-indigo-900/40 to-violet-900/30",
    borderColor: "border-indigo-500/30",
    content: (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-2 shadow-md max-w-md w-full flex justify-center">
            <img
              src="/lingkaran-unsur.png"
              alt="Unsur-unsur Lingkaran"
              className="max-w-full h-auto object-contain rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { name: "Titik Pusat", desc: "Titik O di tengah lingkaran, berjarak sama ke semua titik pada lingkaran.", color: "border-indigo-400/40 bg-indigo-500/5", dot: "bg-indigo-400" },
            { name: "Jari-jari (r)", desc: "Ruas garis dari titik pusat ke titik pada lingkaran.", color: "border-violet-400/40 bg-violet-500/5", dot: "bg-violet-400" },
            { name: "Diameter (d)", desc: "Tali busur yang melewati pusat lingkaran. d = 2r.", color: "border-amber-400/40 bg-amber-500/5", dot: "bg-amber-400" },
            { name: "Busur", desc: "Bagian dari lengkung lingkaran, dibatasi dua titik.", color: "border-pink-400/40 bg-pink-500/5", dot: "bg-pink-400" },
            { name: "Tali Busur", desc: "Ruas garis yang menghubungkan dua titik pada lingkaran (tidak melalui pusat).", color: "border-emerald-400/40 bg-emerald-500/5", dot: "bg-emerald-400" },
            { name: "Juring", desc: "Daerah yang dibatasi dua jari-jari dan busur di antara keduanya.", color: "border-purple-400/40 bg-purple-500/5", dot: "bg-purple-400" },
            { name: "Tembereng", desc: "Daerah yang dibatasi tali busur dan busur di antara keduanya.", color: "border-sky-400/40 bg-sky-500/5", dot: "bg-sky-400" },
            { name: "Apotema", desc: "Jarak terpendek dari pusat lingkaran ke sebuah tali busur.", color: "border-rose-400/40 bg-rose-500/5", dot: "bg-rose-400" },
          ].map(({ name, desc, color, dot }) => (
            <div key={name} className={`border rounded-xl px-3 py-2.5 ${color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                <span className="font-body text-xs font-bold text-white/90">{name}</span>
              </div>
              <p className="font-body text-xs text-white/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    heading: "B. Luas dan Keliling Lingkaran",
    color: "from-violet-900/40 to-purple-900/30",
    borderColor: "border-violet-500/30",
    content: (
      <div className="space-y-4">
        <div className="flex justify-center">
          <svg viewBox="0 0 200 200" className="w-40 h-40">
            <circle cx="100" cy="100" r="75" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
            <line x1="100" y1="100" x2="175" y2="100" stroke="#f472b6" strokeWidth="2.5" />
            <line x1="25" y1="100" x2="175" y2="100" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5,3" opacity="0.5" />
            <circle cx="100" cy="100" r="4" fill="#f8fafc" />
            <text x="133" y="96" fill="#f472b6" fontSize="14" fontWeight="bold">r</text>
            <text x="106" y="96" fill="#e2e8f0" fontSize="13" fontWeight="bold">O</text>
          </svg>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl px-4 py-4 text-center">
            <p className="font-body text-xs text-pink-300/70 uppercase tracking-wider mb-2">Luas Lingkaran</p>
            <div className="text-2xl font-bold text-pink-300">
              <M math="L = \pi r^2" />
            </div>
            <p className="font-body text-xs text-white/40 mt-2">atau <M math="L = \frac{1}{4}\pi d^2" /></p>
          </div>
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl px-4 py-4 text-center">
            <p className="font-body text-xs text-violet-300/70 uppercase tracking-wider mb-2">Keliling Lingkaran</p>
            <div className="text-2xl font-bold text-violet-300">
              <M math="K = 2\pi r" />
            </div>
            <p className="font-body text-xs text-white/40 mt-2">atau <M math="K = \pi d" /></p>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3">
          <p className="font-body text-xs text-amber-300 font-bold mb-1">📌 Nilai π</p>
          <p className="font-body text-xs text-white/70 leading-relaxed">
            Gunakan <M math="\pi = 3{,}14" /> atau <M math="\pi = \dfrac{22}{7}" /> (jika jari-jari kelipatan 7).
          </p>
        </div>
      </div>
    ),
  },
  {
    heading: "C. Panjang Busur dan Luas Juring",
    color: "from-fuchsia-900/40 to-pink-900/30",
    borderColor: "border-fuchsia-500/30",
    content: (
      <div className="space-y-4">
        <BusurJuringSVG />
        <div className="space-y-3">
          <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl px-4 py-3">
            <p className="font-body text-xs text-purple-300 font-bold mb-2">Panjang Busur AB</p>
            <div className="text-center">
              <M math="\text{Busur } AB = \dfrac{\alpha}{360°} \times 2\pi r" />
            </div>
          </div>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/25 rounded-2xl px-4 py-3">
            <p className="font-body text-xs text-fuchsia-300 font-bold mb-2">Luas Juring OAB</p>
            <div className="text-center">
              <M math="\text{Juring OAB} = \dfrac{\alpha}{360°} \times \pi r^2" />
            </div>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/25 rounded-2xl px-4 py-3">
            <p className="font-body text-xs text-pink-300 font-bold mb-2">Luas Tembereng</p>
            <div className="text-center">
              <M math="\text{Tembereng} = \text{Juring OAB} - \Delta OAB" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <p className="font-body text-xs text-white/60 leading-relaxed">
            <span className="text-fuchsia-300 font-semibold">Keterangan:</span> α = sudut pusat (°), r = jari-jari.
            Pastikan sudut dalam derajat, bukan radian.
          </p>
        </div>
      </div>
    ),
  },
  {
    heading: "D. Perbandingan Busur dan Juring",
    color: "from-sky-900/40 to-cyan-900/30",
    borderColor: "border-sky-500/30",
    content: (
      <div className="space-y-4">
        <PerbandinganSVG />
        <div className="bg-sky-500/10 border border-sky-500/25 rounded-2xl px-4 py-4">
          <p className="font-body text-xs text-sky-300 font-bold mb-3 text-center">
            Dalam satu lingkaran yang sama berlaku:
          </p>
          <div className="text-center mb-3">
            <M math="\dfrac{\angle AOB}{\angle COD} = \dfrac{\widehat{AB}}{\widehat{CD}} = \dfrac{L_{\text{juring AOB}}}{L_{\text{juring COD}}}" />
          </div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/25 rounded-xl px-3 py-3">
          <p className="font-body text-xs text-cyan-300 font-bold mb-1">💡 Cara Menggunakan</p>
          <p className="font-body text-xs text-white/65 leading-relaxed">
            Jika diketahui dua sudut pusat dan salah satu busur/juring, gunakan perbandingan untuk mencari yang lain.
            Contoh: jika <M math="\angle AOB = 40°" />, <M math="\angle COD = 80°" />, dan busur AB = 14 cm,
            maka busur CD = 28 cm.
          </p>
        </div>
      </div>
    ),
  },
  {
    heading: "E. Sudut-Sudut pada Lingkaran",
    color: "from-emerald-900/40 to-teal-900/30",
    borderColor: "border-emerald-500/30",
    content: (
      <div className="space-y-5">
        {/* Rule 1 */}
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl px-4 py-3 space-y-3">
          <p className="font-body text-xs text-emerald-300 font-bold">1. Sudut Pusat & Sudut Keliling (busur sama)</p>
          <SudutPusatKelilingSVG />
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center text-xs">
              <M math="\angle AOB = 2 \angle ACB" />
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center text-xs">
              <M math="\angle ACB = \tfrac{1}{2} \angle AOB" />
            </div>
          </div>
        </div>
        {/* Rule 2 */}
        <div className="bg-teal-500/10 border border-teal-500/25 rounded-2xl px-4 py-3 space-y-3">
          <p className="font-body text-xs text-teal-300 font-bold">2. Sudut Keliling yang Menghadap Diameter</p>
          <SudutDiameterSVG />
          <div className="bg-white/5 rounded-lg px-3 py-2 text-center text-xs">
            <M math="\angle BAC = 90°" /> (sudut siku-siku)
          </div>
        </div>
        {/* Rule 3 */}
        <div className="bg-green-500/10 border border-green-500/25 rounded-2xl px-4 py-3">
          <p className="font-body text-xs text-green-300 font-bold mb-2">3. Sudut Keliling di Busur yang Sama</p>
          <p className="font-body text-xs text-white/70 leading-relaxed mb-3">
            Semua sudut keliling yang menghadap busur yang sama adalah sama besar.
          </p>
          <SudutBusurSamaSVG />
          <div className="bg-white/5 rounded-lg px-3 py-2 text-center text-xs mt-3">
            <M math="\angle ACB = \angle ADB = \angle AEB" />
          </div>
        </div>
        {/* Rule 4 */}
        <div className="bg-lime-500/10 border border-lime-500/25 rounded-2xl px-4 py-3 space-y-3">
          <p className="font-body text-xs text-lime-300 font-bold">4. Sudut pada Segiempat Tali Busur</p>
          <SegiempatTaliBusurSVG />
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center text-xs">
              <M math="\angle A + \angle C = 180°" />
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center text-xs">
              <M math="\angle B + \angle D = 180°" />
            </div>
          </div>
          <p className="font-body text-xs text-white/50 text-center">
            Sudut-sudut yang berhadapan bersuplemen (jumlah 180°)
          </p>
        </div>
      </div>
    ),
  },
  {
    heading: "F. Garis Singgung Lingkaran",
    color: "from-rose-900/40 to-red-900/30",
    borderColor: "border-rose-500/30",
    content: (
      <div className="space-y-4">
        {/* Definition */}
        <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl px-4 py-3">
          <p className="font-body text-xs text-rose-300 font-bold mb-2">Definisi</p>
          <p className="font-body text-xs text-white/70 leading-relaxed">
            Garis singgung lingkaran adalah garis yang menyentuh lingkaran tepat di satu titik
            (titik singgung). Garis singgung <span className="text-rose-300 font-semibold">selalu tegak lurus</span> terhadap
            jari-jari yang melalui titik singgung tersebut.
          </p>
        </div>
        <GarisSinggungSVG />
        <div className="bg-pink-500/10 border border-pink-500/25 rounded-2xl px-4 py-3">
          <p className="font-body text-xs text-pink-300 font-bold mb-2">Panjang Garis Singgung dari Titik Luar</p>
          <div className="text-center mb-2">
            <M math="AB^2 = OB^2 - r^2" />
          </div>
          <p className="font-body text-xs text-white/50 text-center">
            Dari titik B di luar lingkaran: AB = AC (panjang garis singgung sama)
          </p>
        </div>

        {/* GSPD & GSPL */}
        <p className="font-body text-xs text-white/70 font-semibold pt-1">Garis Singgung Persekutuan Dua Lingkaran</p>

        {/* GSPL — Luar */}
        <div className="bg-cyan-500/10 border border-cyan-500/25 rounded-2xl px-4 py-3 space-y-3">
          <p className="font-body text-xs text-cyan-300 font-bold">GSPL — Garis Singgung Persekutuan Luar</p>
          <GSPLuarSVG />
          <div className="text-center">
            <M math="l^2 = p^2 - (R - r)^2" />
          </div>
          <p className="font-body text-xs text-white/55 leading-relaxed">
            Garis singgung yang menyentuh kedua lingkaran pada sisi yang sama (tidak memotong ruas <em>O₁O₂</em>).
            <span className="text-white/70"> p = jarak pusat, R & r = jari-jari.</span>
          </p>
        </div>

        {/* GSPD — Dalam */}
        <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl px-4 py-3 space-y-3">
          <p className="font-body text-xs text-purple-300 font-bold">GSPD — Garis Singgung Persekutuan Dalam</p>
          <GSPDalamSVG />
          <div className="text-center">
            <M math="d^2 = p^2 - (R + r)^2" />
          </div>
          <p className="font-body text-xs text-white/55 leading-relaxed">
            Garis singgung yang melintas di antara dua lingkaran (memotong ruas <em>O₁O₂</em>).
            <span className="text-white/70"> p = jarak pusat, R & r = jari-jari.</span>
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <p className="font-body text-xs text-white/55 leading-relaxed">
            <span className="text-amber-300 font-semibold">Ingat:</span> GSPD memotong ruas garis antara dua pusat,
            sedangkan GSPL tidak memotongnya.
          </p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────
   LATIHAN DATA (unchanged)
───────────────────────────────────────────────────────── */

const LingkaranDasar1SVG = () => (
  <svg viewBox="0 0 260 250" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Full circle */}
    <circle cx="120" cy="125" r="95" fill="none" stroke="#60a5fa" strokeWidth="2" />
    {/* Shaded sector: 40° from -20° to +20° (pointing East) */}
    {/* cos20°≈0.940, sin20°≈0.342 */}
    {/* Start (-20°): (120+95*0.940, 125+95*(-0.342)) = (209.3, 92.5) */}
    {/* End  (+20°): (209.3, 157.5) */}
    <path d="M 120,125 L 209.3,92.5 A 95,95 0,0,1 209.3,157.5 Z"
      fill="#3b82f6" fillOpacity="0.45" stroke="#60a5fa" strokeWidth="1.5" />
    {/* Upper radius line */}
    <line x1="120" y1="125" x2="209.3" y2="92.5" stroke="#93c5fd" strokeWidth="1.8" />
    {/* Lower radius line */}
    <line x1="120" y1="125" x2="209.3" y2="157.5" stroke="#93c5fd" strokeWidth="1.8" />
    {/* Small arc for angle indicator, radius 32 */}
    {/* (-20°): (120+32*0.940, 125+32*(-0.342)) = (150.1, 114.1) */}
    {/* (+20°): (150.1, 135.9) */}
    <path d="M 150.1,114.1 A 32,32 0,0,1 150.1,135.9"
      fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    {/* Center dot */}
    <circle cx="120" cy="125" r="3.5" fill="#f8fafc" />
    {/* O label */}
    <text x="104" y="130" fill="#e2e8f0" fontSize="14" fontFamily="serif" fontStyle="italic" fontWeight="bold">O</text>
    {/* r = 21 cm label — along upper radius */}
    <text x="148" y="100" fill="#fbbf24" fontSize="11" fontFamily="sans-serif" fontWeight="bold">r = 21 cm</text>
    {/* 40° label inside sector */}
    <text x="170" y="130" fill="#fbbf24" fontSize="13" fontFamily="serif" fontWeight="bold" textAnchor="middle">40°</text>
    {/* Shaded label */}
    <text x="120" y="238" fill="#93c5fd" fontSize="10" fontFamily="sans-serif" textAnchor="middle" opacity="0.7">Daerah diarsir</text>
  </svg>
);

const LingkaranDasar2SVG = () => (
  <svg viewBox="0 0 260 250" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Full circle */}
    <circle cx="120" cy="122" r="90" fill="none" stroke="#60a5fa" strokeWidth="2" />
    {/* Shaded sector: 60° from -30° to +30° (pointing East) */}
    {/* cos30°≈0.866, sin30°=0.5 */}
    {/* Start (-30°): (120+90*0.866, 122-90*0.5) = (197.9, 77) */}
    {/* End  (+30°): (197.9, 167) */}
    <path d="M 120,122 L 197.9,77 A 90,90 0,0,1 197.9,167 Z"
      fill="#3b82f6" fillOpacity="0.45" stroke="#60a5fa" strokeWidth="1.5" />
    {/* Upper radius (OP) */}
    <line x1="120" y1="122" x2="197.9" y2="77" stroke="#93c5fd" strokeWidth="1.8" />
    {/* Lower radius (OQ) */}
    <line x1="120" y1="122" x2="197.9" y2="167" stroke="#93c5fd" strokeWidth="1.8" />
    {/* Angle arc at radius 32 */}
    {/* (-30°): (120+32*0.866, 122-32*0.5) = (147.7, 106) */}
    {/* (+30°): (147.7, 138) */}
    <path d="M 147.7,106 A 32,32 0,0,1 147.7,138"
      fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    {/* Center dot */}
    <circle cx="120" cy="122" r="3.5" fill="#f8fafc" />
    {/* Labels */}
    <text x="104" y="127" fill="#e2e8f0" fontSize="14" fontFamily="serif" fontStyle="italic" fontWeight="bold">O</text>
    <text x="201" y="74" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">P</text>
    <text x="201" y="175" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">Q</text>
    {/* r = 21 cm label along upper radius */}
    <text x="140" y="91" fill="#fbbf24" fontSize="11" fontFamily="sans-serif" fontWeight="bold">r = 21 cm</text>
    {/* 60° label inside sector */}
    <text x="172" y="127" fill="#fbbf24" fontSize="13" fontFamily="serif" fontWeight="bold" textAnchor="middle">60°</text>
    {/* Shaded label */}
    <text x="120" y="238" fill="#93c5fd" fontSize="10" fontFamily="sans-serif" textAnchor="middle" opacity="0.7">Daerah diarsir (juring)</text>
  </svg>
);

const LingkaranDasar3SVG = () => (
  <svg viewBox="0 0 240 220" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Full circle — O at visual center (120, 112) */}
    <circle cx="120" cy="112" r="88" fill="none" stroke="#60a5fa" strokeWidth="2" />
    {/* O at center */}
    <circle cx="120" cy="112" r="3" fill="#f8fafc" />
    {/* P at 0° (right): (208, 112) */}
    {/* Q at 50°: (120+88*cos50°, 112-88*sin50°) = (120+56.6, 112-67.4) = (176.6, 44.6) */}
    {/* R at 125°: (120+88*cos125°, 112-88*sin125°) = (120-50.5, 112-72.1) = (69.5, 39.9) */}
    <line x1="120" y1="112" x2="208" y2="112" stroke="#93c5fd" strokeWidth="1.8" />
    <line x1="120" y1="112" x2="176.6" y2="44.6" stroke="#93c5fd" strokeWidth="1.8" />
    <line x1="120" y1="112" x2="69.5" y2="39.9" stroke="#93c5fd" strokeWidth="1.8" />
    {/* Arc for 75° between R(125°) and Q(50°), radius 30 */}
    {/* Start Q dir: (120+30*cos50°, 112-30*sin50°)=(139.3,89.1) */}
    {/* End R dir:   (120+30*cos125°,112-30*sin125°)=(102.8,87.4) */}
    <path d="M 139.3,89.1 A 30,30 0 0 0 102.8,87.4" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
    {/* Arc for 50° between P(0°) and Q(50°), radius 22 */}
    {/* Start P dir: (142, 112) */}
    {/* End Q dir:   (120+22*cos50°,112-22*sin50°)=(134.1,95.1) */}
    <path d="M 142,112 A 22,22 0 0 0 134.1,95.1" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
    {/* Labels — O just below center dot, angles outside their arcs */}
    <text x="123" y="130" fill="#e2e8f0" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">O</text>
    <text x="211" y="116" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">P</text>
    <text x="178" y="40" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">Q</text>
    <text x="53" y="38" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">R</text>
    {/* 75° — outside arc, toward midpoint angle ~87.5° from center */}
    <text x="106" y="74" fill="#fbbf24" fontSize="11" fontFamily="sans-serif" fontWeight="bold">75°</text>
    {/* 50° — outside arc, toward midpoint angle ~25° from center */}
    <text x="145" y="97" fill="#fbbf24" fontSize="11" fontFamily="sans-serif" fontWeight="bold">50°</text>
  </svg>
);

const LingkaranDasar4SVG = () => {
  /*
   * O at (120,120), r=85
   * Four radii (math angles, SVG y-inverted):
   *   P  at  90° → (120, 35)            top
   *   Q  at -45° → (180.1, 180.1)       lower-right
   *   R  at 270° → (120, 205)           bottom
   *   S  at 180° → (35, 120)            left
   *
   * Four sectors (clockwise / sweep=1):
   *   P→Q  135° maroon  (through right)
   *   Q→R   45° white   (lower-right sliver)
   *   R→S   90° gold    (lower-left, right-angle marker)
   *   S→P   90° white   (upper-left)
   *
   * Right-angle □ at O (size 10) in gold sector (OR↓, OS←):
   *   A=(120,130), B=(110,120), C=(110,130)
   *   Path: M 120,130 L 110,130 L 110,120
   *
   * 135° label at bisector 22.5°, r=46:
   *   (120+46·cos22.5°, 120−46·sin22.5°) ≈ (162.5, 102.5)
   */
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* Full circle */}
      <circle cx="120" cy="120" r="85" fill="none" stroke="#60a5fa" strokeWidth="2.2" />

      {/* Sector P→Q 135° maroon (clockwise through right, sweep=1, large-arc=0) */}
      <path d="M 120,120 L 120,35 A 85,85 0 0 1 180.1,180.1 Z"
        fill="#be123c" fillOpacity="0.55" stroke="#60a5fa" strokeWidth="1" />

      {/* Sector Q→R 45° white (clockwise, sweep=1, large-arc=0) */}
      <path d="M 120,120 L 180.1,180.1 A 85,85 0 0 1 120,205 Z"
        fill="#e2e8f0" fillOpacity="0.08" stroke="#60a5fa" strokeWidth="1" />

      {/* Sector R→S 90° gold (clockwise, sweep=1, large-arc=0) */}
      <path d="M 120,120 L 120,205 A 85,85 0 0 1 35,120 Z"
        fill="#d97706" fillOpacity="0.55" stroke="#60a5fa" strokeWidth="1" />

      {/* Sector S→P 90° white (clockwise, sweep=1, large-arc=0) */}
      <path d="M 120,120 L 35,120 A 85,85 0 0 1 120,35 Z"
        fill="#e2e8f0" fillOpacity="0.08" stroke="#60a5fa" strokeWidth="1" />

      {/* Four radii */}
      <line x1="120" y1="120" x2="120"   y2="35"   stroke="#93c5fd" strokeWidth="1.8" />
      <line x1="120" y1="120" x2="180.1" y2="180.1" stroke="#93c5fd" strokeWidth="1.8" />
      <line x1="120" y1="120" x2="120"   y2="205"  stroke="#93c5fd" strokeWidth="1.8" />
      <line x1="120" y1="120" x2="35"    y2="120"  stroke="#93c5fd" strokeWidth="1.8" />

      {/* Right-angle □ at O in gold sector (between OR↓ and OS←) */}
      <path d="M 120,130 L 110,130 L 110,120"
        fill="none" stroke="#fbbf24" strokeWidth="1.6" />

      {/* 135° label — bisector of P→Q sector at ~22.5°, r=46 */}
      <text x="162" y="106" fill="#fbbf24" fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">135°</text>

      {/* O at center */}
      <circle cx="120" cy="120" r="3" fill="#f8fafc" />
      <text x="124" y="116" fill="#e2e8f0" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">O</text>

      {/* Point labels */}
      <text x="120" y="24"  fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic" textAnchor="middle">P</text>
      <text x="186" y="190" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic">Q</text>
      <text x="120" y="222" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic" textAnchor="middle">R</text>
      <text x="20"  y="124" fill="#34d399" fontSize="13" fontFamily="serif" fontStyle="italic">S</text>
    </svg>
  );
};

const LingkaranDasar5SVG = () => (
  <img src="/lingkaran-dasar-5.png" alt="Gambar soal 5" className="max-w-full max-h-64 object-contain mx-auto block" />
);

const LingkaranDasar6SVG = () => (
  <svg viewBox="0 0 260 185" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Shape: rectangle 21x21 + semicircle on right */}
    {/* Scale: 21cm → 120px, so semicircle r = 60px */}
    {/* Rectangle: x=45,y=22 to x=165,y=162 (120x140 → let's use 120x120) */}
    {/* Rectangle from (45,22) to (165,162), semicircle center (165,92), r=70 */}
    <path d="M 45,22 L 165,22 A 70,70 0 0 1 165,162 L 45,162 Z"
      fill="#d4b896" fillOpacity="0.5" stroke="#94a3b8" strokeWidth="2" />
    {/* Hatch lines for texture */}
    {[30,40,50,60,70,80,90,100,110,120,130,140].map(y => (
      <line key={y} x1="45" y1={y+2} x2="165" y2={y+2} stroke="#94a3b8" strokeWidth="0.6" strokeOpacity="0.4" />
    ))}
    {/* Left side label: 21 cm (vertical) */}
    <text x="38" y="95" fill="#e2e8f0" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" transform="rotate(-90,38,92)">21 cm</text>
    {/* Dimension lines */}
    <line x1="42" y1="22" x2="42" y2="162" stroke="#94a3b8" strokeWidth="1" markerStart="url(#arr)" markerEnd="url(#arr)" />
    {/* Bottom label: 21 cm */}
    <text x="105" y="178" fill="#e2e8f0" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">21 cm</text>
    <line x1="45" y1="167" x2="165" y2="167" stroke="#94a3b8" strokeWidth="1" />
    {/* Tick marks */}
    <line x1="45" y1="164" x2="45" y2="170" stroke="#94a3b8" strokeWidth="1" />
    <line x1="165" y1="164" x2="165" y2="170" stroke="#94a3b8" strokeWidth="1" />
  </svg>
);

const latihanDasar = [
  { no: 1, soal: "Perhatikan gambar!\nJika O adalah pusat lingkaran, jika r = 21 cm dan $\\pi = \\frac{22}{7}$, maka luas daerah yang diarsir adalah ...", options: ["A. 77 $cm^2$", "B. 154 $cm^2$", "C. 231 $cm^2$", "D. 308 $cm^2$"] },
  { no: 2, soal: "Perhatikan gambar lingkaran di samping! Jika O pusat lingkaran, dan panjang OP = 21 cm, maka panjang busur kecil PQ adalah.... ($\\pi = \\frac{22}{7}$)\nLuas juring dengan sudut pusat $120^0$ dan panjang jari-jari 7 cm adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 77 $cm^2$", "B. 51,33 $cm^2$", "C. 38,50 $cm^2$", "D. 14,67 $cm^2$"] },
  { no: 3, soal: "Perhatikanlah gambar berikut.\nDiketahui O adalah titik pusat lingkaran. Jika panjang busur QR = 60 cm, panjang busur PQ adalah...", options: ["A. 40 cm", "B. 45 cm", "C. 50 cm", "D. 55 cm"] },
  { no: 4, soal: "Perhatikan gambar!\nJika luas juring ORS = 60 $cm^2$, luas juring OPQ adalah...", options: ["A. 40 $cm^2$", "B. 75 $cm^2$", "C. 90 $cm^2$", "D. 105 $cm^2$"] },
  { no: 5, soal: "Pada suatu lingkaran dengan pusat O diketahui titik A, B, C, dan D pada keliling lingkaran, sehingga $\\angle AOB = 35°$ dan $\\angle COD = 140°$. Jika panjang busur AB = 14 cm, hitunglah panjang busur CD.", options: ["A. 28 cm", "B. 42 cm", "C. 56 cm", "D. 70 cm"] },
  { no: 6, soal: "Luas daerah yang diarsir pada gambar berikut adalah ...", options: ["A. 496,44 $cm^2$", "B. 718,2 $cm^2$", "C. 992,88 $cm^2$", "D. 1827 $cm^2$"] },
  { no: 7, soal: "Luas daerah yang diarsir pada gambar berikut adalah ...", options: ["A. 59,5 $cm^2$", "B. 112 $cm^2$", "C. 119 $cm^2$", "D. 224 $cm^2$"] },
  { no: 8, soal: "Keliling daerah yang diarsir pada gambar berikut adalah ...", options: ["A. 47,1 cm", "B. 62,8 cm", "C. 78,5 cm", "D. 94,2 cm"] },
  { no: 9, soal: "Keliling daerah yang diarsir pada gambar berikut adalah ...", options: [] },
  { no: 10, soal: "Luas daerah yang diarsir pada gambar berikut adalah ...", options: [] },
  { no: 11, soal: "Perhatikan gambar berikut!\nKeliling bangun tersebut adalah ...", options: ["A. 213,6 cm", "B. 221,2 cm", "C. 253,6 cm.", "D. 267,6 cm"] },
  { no: 12, soal: "Perhatikan gambar berikut\nJika total luas bangun di atas 480 $cm^2$, maka luas daerah persegi adalah ...", options: ["A. 24 $cm^2$", "B. 56 $cm^2$", "C. 72 $cm^2$", "D. 84 $cm^2$"] },
  { no: 13, soal: "Perhatikan gambar persegipanjang dan lingkaran berikut!\nDiketahui A dan B adalah pusat dua lingkaran yang kongruen dan saling bersinggungan luar. ABQP adalah persegi panjang. Luas daerah yang diarsir seluruhnya adalah 1.316 $cm^2$. Luas persegi panjang ABQP adalah....($\\pi = \\frac{22}{7}$)", options: ["A. 196 $cm^2$", "B. 392 $cm^2$", "C. 492 $cm^2$", "D. 512 $cm^2$"] },
  { no: 14, soal: "Perhatikan gambar di samping ini!\nDiketahui O adalah titik pusat lingkaran. Besar sudut AOB adalah ....", options: ["A. 15°", "B. 30°", "C. 45°", "D. 60°"] },
  { no: 15, soal: "Perhatikan gambar!\nTitik O adalah pusat lingkaran. Diketahui $\\angle ABE + \\angle ACE + \\angle ADE = 96°$ Besar $\\angle AOE$ adalah....", options: ["A. 32°", "B. 48°", "C. 64°", "D. 84°"] },
  { no: 16, soal: "Perhatikan gambar di bawah ini!,\nBesar $\\angle OAD = 20^0$, besar $\\angle OBD = 30^0$, maka besar sudut BOC adalah ....", options: ["A. $50^0$", "B. $70^0$", "C. $80^0$", "D. $100^0$"] },
  { no: 17, soal: "Pada gambar di bawah ini diketahui besar $\\angle AOC = 82^0$.\nBesar sudut $\\angle BDC$ adalah ...", options: ["A. $41^0$", "B. $49^0$", "C. $82^0$", "D. $98^0$"] },
  { no: 18, soal: "Perhatikan gambar berikut!\nJika besar sudut AOC = $112^0$, maka besar sudut ABC adalah ....", options: ["A. $124^0$", "B. $114^0$", "C. $68^0$", "D. $56^0$"] },
  { no: 19, soal: "Perhatikanlah gambar di bawah.\nHitunglah besar sudut $\\angle BAC$, $\\angle ADC$, $\\angle DAC$.", options: [] },
  { no: 20, soal: "Perhatikanlah gambar di bawah,\nHitunglah besar $\\angle DCB$, $\\angle BAD$, $\\angle ADC$", options: [] },
  { no: 21, soal: "Perhatikan gambar berikut!\nJika besar sudut COD = $48^0$, maka besar sudut ABC adalah ....", options: ["A. $132^0$", "B. $124^0$", "C. $122^0$", "D. $114^0$"] },
  { no: 22, soal: "Ayah akan membuat taman berbentuk lingkaran dengan jari-jari 35 m. Di sekeliling taman akan ditanami pohon cemara dengan jarak 1 m. Jika satu pohon memerlukan biaya Rp 25.000,00, seluruh biaya penanaman pohon cemara adalah....", options: ["A. Rp 5.900.000,00", "B. Rp 5.700.000,00", "C. Rp 5.500.000,00", "D. Rp 5.200.000,00"] },
  { no: 23, soal: "Sebuah roda yang berdiameter 50 cm berputar 60 kali. Jika $\\pi = 3,14$, maka jarak yang ditempuh adalah ....", options: ["A. 94,2 m", "B. 942 m", "C. 47,1 m", "D. 471 m"] },
  { no: 24, soal: "Sebuah roda berputar 40 kali menempuh jarak 52,8 m. Jika $\\pi = 22/7$, maka jari-jari roda tersebut adalah ....", options: ["A. 14 cm", "B. 21 cm", "C. 28 cm", "D. 42 cm"] },
  { no: 25, soal: "Seorang pengusaha akan membuat bianglala seperti yang ada di Dufan.\nJika tempat duduk pada bianglala sebanyak 44 buah dan masing-masing tempat duduk berjarak 3 m, berapakah panjang jari-jari bianglala?", options: ["A. 7 m", "B. 10,5 m", "C. 14 m", "D. 21 m"] },
  { no: 26, soal: "Perhatikan gambar berikut!\nKolam ikan Pak Arvin tampak seperti gambar di atas. Jika di sekeliling akan dipagari dengan kawat berduri dua kali putaran, maka dibutuhkan kawat berduri minimum sepanjang......", options: ["A. 72 m", "B. 86 m", "C. 144 m", "D. 172 m"] },
  { no: 27, soal: "Sebuah tonggak ditengah lapangan rumput berbentuk persegipanjang berukuran 15 m x 20 m. Seekor kambing diikat di tonggak dengan tali yang panjangnya 7 m. Berapa luas lapangan yang rumputnya tidak termakan kambing?", options: ["A. 100 $m^2$", "B. 146 $m^2$", "C. 154 $m^2$", "D. 300 $m^2$"] },
  { no: 28, soal: "Perhatikan gambar berikut!\nKolam pak Tedi bentuk dan ukuran Nampak seperti gambar.\nJika keliling kolam diberi pagar kawat dua kali putaran, maka dibutuhkan kawat minimum sepanjang ....", options: ["A. 66 m", "B. 88 m", "C. 132 m", "D. 180 m"] },
  { no: 29, soal: "Perhatikan gambar berikut.\nPanjang OP adalah ....", options: ["A. 16 cm", "B. 26 cm", "C. 34 cm", "D. 36 cm"] },
  { no: 30, soal: "Panjang jari-jari dua lingkaran masing-masing adalah 2 cm dan 10 cm. Panjang garis singgung persekutuan luarnya adalah 15 cm. Jarak kedua titik pusat lingkaran adalah ....", options: ["A. 13 cm", "B. 17 cm", "C. 23 cm", "D. 17 cm"] },
  { no: 31, soal: "Perhatikan gambar berikut.\nPada gambar tersebut, panjang jari-jari AD = 8 cm, panjang jari-jari BC = 3 cm, dan jarak AB = 13 cm. Luas trapesium ABCD adalah ....", options: ["A. 46 $cm^2$", "B. 56 $cm^2$", "C. 66 $cm^2$", "D. 76 $cm^2$"] },
  { no: 32, soal: "Perhatikan gambar berikut.\nPanjang garis singgung persekutuan dalam adalah ...", options: ["A. 12 cm", "B. 14 cm", "C. 16 cm", "D. 18 cm"] },
  { no: 33, soal: "Perbandingan jari-jari dua lingkaran adalah 1 : 2. Panjang garis singgung persekutuan dalam kedua lingkaran tersebut adalah 12 cm dan jarak antara kedua pusatnya 15 cm. Panjang jari-jari masing masing lingkaran adalah ....", options: ["A. 2 cm dan 4 cm", "B. 3 cm dan 6 cm", "C. 4 cm dan 8 cm", "D. 5 cm dan 10 cm"] },
  { no: 34, soal: "Perhatikan gambar di bawah ini.\nPanjang AD = 3,5 cm, panjang BE = 1,5 cm, dan jarak AB = 8 cm. Luas $\\triangle ABC$ adalah ....", options: ["A. $5\\sqrt{39}$", "B. $\\frac{1}{2}\\sqrt{39}$", "C. $\\frac{5}{2}\\sqrt{39}$", "D. $\\frac{3}{2}\\sqrt{39}$"] },
  { no: 35, soal: "Gambar berikut ini adalah penampang 6 buah kaleng cat yang berbentuk tabung dan berjari-jari 14 cm. Panjang tali terpendek yang dibutuhkan untuk mengikat keenam kaleng cat tersebut adalah ....", options: ["A. 256 cm", "B. 258 cm", "C. 260 cm", "D. 262 cm"] },
  { no: 36, soal: "Gambar di bawah ini adalah penampang 10 buah gelas berbentuk tabung dengan jari-jari 10 cm. Panjang tali minimal yang diperlukan untuk mengikat gelas-gelas tersebut dengan susunan seperti dalam gambar adalah ....", options: ["A. 261,8 cm", "B. 262,8 cm", "C. 261,6 cm", "D. 262,6 cm"] },
];

const dasarImages: Record<number, string> = {
  1: "/lingkaran-dasar-1.png",
  2: "/lingkaran-dasar-2.png",
  3: dasar3,
  4: dasar4,
  5: dasar5,
  6: dasar6,
  7: "/lingkaran-dasar-7.png",
  8: dasar8,
  9: dasar9,
  10: "/lingkaran-dasar-10.jpg",
  11: dasar11,
  12: "/lingkaran-dasar-12.png",
  13: "/lingkaran-dasar-13.png",
  14: dasar14,
  15: dasar15,
  16: dasar16,
  17: dasar17,
  18: dasar18,
  19: dasar19,
  20: dasar20,
  21: dasar21,
  22: dasar22,
  23: dasar23,
  24: dasar24,
  25: dasar25,
  26: dasar26,
  27: dasar27,
  28: dasar28,
  29: dasar29,
  31: dasar31,
  32: dasar32,
  34: dasar34,
  35: dasar35,
  36: dasar36,
};

const olimpiadeImages: Record<number, string> = {
  2: "/lingkaran-olimpiade-2.png",
  3: olim3,
  4: olim4,
  5: olim5,
  6: olim6,
  7: "/lingkaran-olimpiade-7.png",
  8: olim8,
  9: olim9,
  11: olim11,
  12: "/lingkaran-olimpiade-12.png",
  14: olim14,
  15: olim15,
  17: olim17,
  18: olim18,
  19: olim19,
  20: olim20,
  21: olim21,
  22: olim22,
  23: olim23,
  24: olim24,
  26: olim26,
  27: olim27,
  29: olim29,
};

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nDi dalam suatu lingkaran yang berjari-jari 4 cm dibuat persegi ABCD, sehingga titik sudut persegi tersebut berada pada lingkaran. Luas persgi ABCD adalah ...", options: ["A. 64 $cm^2$", "B. 32 $cm^2$", "C. 16 $cm^2$", "D. 8 $cm^2$", "E. 4 $cm^2$"] },
  { no: 2, soal: "OSN Matematika 2005 Tingkat Kota\nMisalkan a dan b menyatakan luas daerah yang diarsir pada gambar di bawah. Kelima lingkaran kecil berjari-jari r. titik-titik pusat empat lingkaran kecil yang menyinggung lingkaran besar merupakan titik-titik sudut persegi. Jika a sama dengan 10 $cm^2$, maka b = ...", options: [] },
  { no: 3, soal: "OSN Matematika 2006 Tingkat Kota\nLuas daerah yang diarsir setengah dari luas daerah yang tidak diarsir. Panjang AB dibagi panjang AC adalah ...", options: ["A. $\\frac{1}{2}\\sqrt{2}$", "B. $\\frac{1}{3}\\sqrt{3}$", "C. $\\frac{1}{5}\\sqrt{5}$", "D. $\\frac{1}{7}\\sqrt{7}$", "E. $\\frac{1}{5}\\sqrt{7}$"] },
  { no: 4, soal: "OSN Matematika 2007 Tingkat Kota\nDiketahui suatu segitiga sama sisi dan setengah lingkaran seperti pada gambar berikut.\nJika panjang sisi segitiga tersebut 14 cm, maka luas daerah di dalam segitiga dan di luar setengah lingkaran adalah ... $cm^2$", options: ["A. $49\\sqrt{3} - 14\\pi$", "B. $49\\sqrt{3} - \\frac{1}{2}(24\\pi)$", "C. $49\\sqrt{3} - \\frac{3}{8}(18\\pi)$", "D. $98\\sqrt{3} - \\frac{3}{4}(36\\pi)$", "E. $98\\sqrt{3} - \\frac{1}{2}(24\\pi)$"] },
  { no: 5, soal: "OSN Matematika 2007 Tingkat Kota\nPerhatikan dua lingkaran konsentrik (memiliki titik pusat sama) seperti gambar berikut.\nJika keliling lingkaran besar lebih panjang 4 meter dari keliling lingkaran kecil, maka jarak d adalah ... meter", options: [] },
  { no: 6, soal: "OSN Matematika 2007 Tingkat Kota\nPerhatikan gambar berikut. Luas daerah yang diarsir adalah ... $cm^2$", options: [] },
  { no: 7, soal: "OSN Matematika 2008 Tingkat Kota\nPerhatikan gambar berikut.\nJika QT garis singgung lingkaran yang berpusat di O dan $\\angle TOR = 112^0$, maka besar $\\angle PQT = ...$", options: ["A. $56^0$", "B. $44^0$", "C. $34^0$", "D. $26^0$", "E. $24^0$"] },
  { no: 8, soal: "OSN Matematika 2008 Tingkat Kota\nPerhatikan dua lingkaran pada gambar berikut.\nDiketahui panjang talibusur AB = 24 cm dan MO = ON. Maka luas daerah yang diarsir adalah ...", options: ["A. $24\\pi$ $cm^2$", "B. $72\\pi$ $cm^2$", "C. $104\\pi$ $cm^2$", "D. $144\\pi$ $cm^2$", "E. $152\\pi$ $cm^2$"] },
  { no: 9, soal: "OSN Matematika 2008 Tingkat Kota\nPerhatikan gambar berikut.\nPada segiempat ABCD dibuat setengah lingkaran pada sisi AD dengan pusat E dan segitiga sama sisi BEC. Jika BC = 20 cm, maka luas daerah yang diarsir adalah ...", options: ["A. $(100\\sqrt{3} - 50\\pi)$ $cm^2$", "B. $(100\\sqrt{3} - \\frac{50\\pi}{3})$ $cm^2$", "C. $(100\\sqrt{3} - \\frac{50\\pi}{6})$ $cm^2$", "D. $(100\\sqrt{3} - \\frac{100\\pi}{3})$ $cm^2$", "E. $(100\\sqrt{3} - \\frac{100}{3}\\pi)$ $cm^2$"] },
  { no: 10, soal: "OSN Matematika 2010 Tingkat Kota\nRoda A dengan jari-jari 40 cm dan roda B dengan jari-jari 10 cm dihubungkan dengan sebuah tali yang melingkar keduanya. Jika jarak pusat kedua roda adalah 60 cm, maka panjang tali yang dibutuhkan adalah ... cm", options: ["A. $60(\\pi + \\sqrt{3})$", "B. $56(\\pi + \\sqrt{3})$", "C. $50(\\pi + \\sqrt{3})$", "D. $40(\\pi + \\sqrt{3})$", "E. $38(\\pi + \\sqrt{3})$"] },
  { no: 11, soal: "OSN Matematika 2011 Tingkat Kota\nSembilan lingkaran kongruen terletak di dalam persegi seperti terlihat pada gambar. Jika keliling sebuah lingkaran 62,8 cm dengan $\\pi = 3,14$, maka luas daerah yang diarsir adalah ... $cm^2$", options: ["A. 344", "B. 364", "C. 484", "D. 688", "E. 728"] },
  { no: 12, soal: "OSN Matematika 2011 Tingkat Kota\nPerhatikan gambar di atas, persegi ABCD dengan panjang sisi 14 cm menyinggung Lingkaran. Masing-masing sisi persegi dibuat setengah lingkaran dengan diameter sisi persegi tersebut. Jika $\\pi = 3,14$, maka luas daerah yang diarsir adalah ... $cm^2$", options: ["A. 49", "B. 56", "C. 112", "D. 178", "E. 196"] },
  { no: 13, soal: "OSN Matematika 2011 Tingkat Kota\nSebuah bingkai foto yang berbentuk persegi diputar $45^0$ dengan sumbu putar titik perpotongan diagonal-diagonalnya. Jika panjang sisi persegi adalah 1 cm. luas irisan antara bingkai foto sebelum dan sesudah diputar adalah ... $cm^2$", options: ["A. $1 + 2\\sqrt{2}$", "B. $2 + 2\\sqrt{2}$", "C. 2", "D. $2 - 2\\sqrt{2}$", "E. $2\\sqrt{2} - 2$"] },
  { no: 14, soal: "OSN Matematika 2011 Tingkat Kota\nPerhatikan gambar berikut. ABCD persegi dengan panjang sisi-sisinya adalah 2 cm. E adalah titik Tengah CD dan F adalah titik Tengah AD. Luas daerah EDFGH adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2012 Tingkat Kota\nPerhatikan gambar di bawah ini. Jika lingkaran besar berjari-jari 4 dan lingkaran kecil berjari-jari 2, serta luas daerah yang diarsir adalah 5/12 luas lingkaran besar, maka besar $\\angle RPQ$ adalah ...", options: ["A. $60^0$", "B. $90^0$", "C. $120^0$", "D. $135^0$", "E. $150^0$"] },
  { no: 16, soal: "OSN Matematika 2012 Tingkat Kota\nEmpat titik ditempatkan pada lingkaran berjari-jari $\\frac{1}{2}$ satuan. Jika keempat titik tersebut dihubungkan sehingga membentuk persegi panjang, maka luas terbesar (maksimum) yang mungkin bagi persegi panjang tersebut adalah ...", options: [] },
  { no: 17, soal: "OSN Matematika 2015 Tingkat Kota\nDiketahui lingkaran dengan pusat O dan mempunyai diameter AB. Segitiga CDE siku-siku di D, DE pada diameter AB sehingga DO = OE dan CD = DE untuk suatu titik C pada lingkaran. Jika jari-jari lingkaran adalah 1 cm, maka luas segitiga CDE = ... $cm^2$", options: ["A. 3/5", "B. 2/5", "C. 2/3", "D. 1/2"] },
  { no: 18, soal: "OSN Matematika 2015 Tingkat Kota\nSuatu taman kota dibatasi oleh lintasan lari berbentuk lingkaran dan tepat di titik pusat taman dibuat tugu (T) yang dihiasi lampu. Di sepanjang tepai bagian dalam taman diletakkan 12 bangku permanen (B) secara berurutan, sebut $B_1$, $B_2$, ..., $B_{12}$. Jarak antara dua bangku yang berurutan dibuat sama. Jarak tugu ke lintasan lari adalah 50 meter. Bakri, Bima dan Budi berlari pada lintasan lari mulai di depan bangku $B_1$. Berlari mengambil arah yang berlawanan. Jika setelah 20 menit posisi Bakri di depan bangku $B_7$, Bima di depan bangku $B_6$, Budi di depan bangku $B_4$, maka jarak total yang telah ditempuh tiga orang ini mendekati ... meter ($\\pi = 3,14$).", options: ["A. 549", "B. 523", "C. 471", "D. 392"] },
  { no: 19, soal: "OSN Matematika 2015 Tingkat Kota\nPerhatikan gambar berikut.\nTitik P, Q dan R masing-masing adalah titik singgung lingkaran pada sisi-sisi $\\triangle ACD$. Diketahui $\\angle SDR = 60^0$, panjang SR = panjang SQ = 1 cm dan panjang RD = $\\frac{\\sqrt{3}}{3}$ cm. Jika $\\triangle ABC$ sama kaki, maka luas $\\triangle ABC$ adalah ... $cm^2$", options: [] },
  { no: 20, soal: "OSN Matematika 2017 Tingkat Kota\nLingkaran pada gambar berikut mempunyai radius 1 satuan panjang dan $\\angle DAB = 30^0$. Luas daerah trapesium ABCD yang diarsir adalah ...", options: ["A. $\\frac{1}{2}$", "B. 1", "C. $\\frac{\\sqrt{3}}{2}$", "D. $\\frac{1 + \\sqrt{3}}{2}$"] },
  { no: 21, soal: "OSN Matematika 2018 Tingkat Kota\nPerhatikan $\\triangle ABC$ dan lingkaran dalam pada gambar di bawah.\nJika $\\triangle ABC$ sama sisi dengan CD = 6 cm, maka luas daerah lingkaran dalam adalah ... $cm^2$", options: ["A. $16\\pi$", "B. $12\\pi$", "C. $9\\pi$", "D. $4\\pi$"] },
  { no: 22, soal: "OSN Matematika 2019 Tingkat Kota\nPerhatikan gambar. Jika $\\angle ABE + \\angle ACE + \\angle ADE = 96^0$, maka besar $\\angle AOE$ adalah ...", options: ["A. $32^0$", "B. $48^0$", "C. $64^0$", "D. $84^0$"] },
  { no: 23, soal: "OSN Matematika 2020 Tingkat Kota\nPerhatikan bangun setengah lingkaran berikut. Jika CA = 6 cm dan ED + DF = 8 cm, maka keliling bangun yang diarsir adalah ...", options: ["A. $\\pi + 36$", "B. $6\\pi + 12$", "C. $3\\pi + 36$", "D. $3\\pi + 12$"] },
  { no: 24, soal: "OSN Matematika 2022 Tingkat Kota\nPerhatikan setengah lingkaran pusat O dan diameter AB berikut.\nTitik C terletak pada busur AB dan P adalah pusat lingkaran dalam ABC. Titik P dilalui DE yang tegak lurus AO, jika DE = 4 cm, maka luas daerah $\\triangle PBC$ adalah ... $cm^2$", options: ["A. 2", "B. 4", "C. 8", "D. 16"] },
  { no: 25, soal: "OSN Matematika 2022 Tingkat Kota\nTiga puluh koin dengan jari-jari 3,5 cm ditumpuk menjadi 4 tingkat sehingga menyerupai limas tegak segi empat beraturan dengan sisi angka menghadap ke atas. Tingkat pertama (paling bawah) terdiri dari 16 koin, tingkat kedua terdiri dari 9 koin, tingkat ketiga terdiri dari 4 koin dan tingkat keempat terdiri dari 1 koin. Pada setiap tingkat, koin akan disusun menyerupai persegi dengan setiap koin yang berdekatan saling bersinggungan. Jika dilihat dari atas, total luas sisi angka yang tertutup oleh koin lainnya adalah... $cm^2$.", options: ["A. 381,5", "B. 444,5", "C. 539", "D. 1155"] },
  { no: 26, soal: "OSN Matematika 2022 Tingkat Kota\nPerhatikan gambar setengah lingkaran dengan pusat O.\nJika $\\angle BOR = 48^0$ dan $\\angle OPA = 80^0$, maka besar $\\angle PQR = ...^o$", options: ["A. 92", "B. 104", "C. 118", "D. 125"] },
  { no: 27, soal: "OSN Matematika 2023 Tingkat Kota\nPerhatikan gambar berikut!\nDi dalam persegi ABCD terdapat dua setengah lingkaran dengan diameter AD dan BC. Ruas garis EF dan GH sejajar AB. Jika EK = 3 cm, LH = 6 cm dan EG = 9 cm, maka luas daerah persegi ABCD adalah ... $cm^2$", options: ["A. 180", "B. 360", "C. 90", "D. 150"] },
  { no: 28, soal: "OSN Matematika 2023 Tingkat Kota\nEmpat titik berbeda A, B, C dan D terletak pada lingkaran berjari-jari 7 cm. Diketahui AB : BC = 3 : 4, AB = AD dan BC = CD. Titik E adalah perpotongan AC dan BD, melalui titik E dibuat garis k dan l. Garis k tegak lurus BC dan memotong AD di P. Sementara, garis l tegak lurus AD dan memotong BC di Q. Perbandingan luas daerah segitiga AQP dan PDQ adalah 1 : ...", options: [] },
  { no: 29, soal: "OSN Matematika 2025 Tingkat Kota\nDalam suatu lingkaran berpusat di O berjari-jari 7, dibuat segitiga ABC dengan titik A, B dan C terletak pada lingkaran, AC merupakan diameter lingkaran dengan $\\angle ACB = 60^0$.\nMelalui C dan titik Tengah AB, dibuat garis memotong lingkaran di titik D. Panjang CD sama dengan ...", options: ["A. $3\\sqrt{7}$", "B. $5\\sqrt{7}$", "C. $6\\sqrt{7}$", "D. $7\\sqrt{7}$"] },
];

/* ─────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────── */

const OlimpiadeLingkaranPage = () => {
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

        {/* Header */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 border border-cyan-400/30 flex items-center justify-center mb-4 shadow-lg">
            <Trophy className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1"
            style={{ textShadow: '0 0 32px rgba(34,211,238,0.45)' }}>
            OLIMPIADE — LINGKARAN
          </h1>
          <p className="text-white/40 text-xs text-center font-body">Irawan Sutiawan, M.Pd</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-body">6 Topik Materi</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">65 Soal</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "📘 Materi" },
            { key: "dasar" as const, label: "✏️ Latihan Dasar" },
            { key: "olimpiade" as const, label: "🏆 Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-xl border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "bg-card/80 text-white/60 border-border hover:border-cyan-400/30 hover:text-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MATERI TAB */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSections.map((section, idx) => (
              <div key={idx}
                className={`relative rounded-2xl overflow-hidden border ${section.borderColor}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} backdrop-blur`} />
                <button
                  onClick={() => toggleSection(idx)}
                  className="relative w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <span className="font-display text-sm text-white font-bold">{section.heading}</span>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-white/60 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="relative px-5 pb-5">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* LATIHAN DASAR TAB */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no}
                className="relative rounded-2xl overflow-hidden border border-indigo-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/60 backdrop-blur" />
                <div className="relative px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 leading-relaxed">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold mr-2 shrink-0">{soal.no}</span>
                    {(() => {
                      const lines = soal.soal.split('\n');
                      const imgIndex = lines.findIndex(l => /perhatikan(lah)?\s+gambar/i.test(l));
                      const svgComponents: Record<number, React.ReactElement> = {
                        1: <LingkaranDasar1SVG />,
                        2: <LingkaranDasar2SVG />,
                        3: <LingkaranDasar3SVG />,
                        4: <LingkaranDasar4SVG />,
                        5: <LingkaranDasar5SVG />,
                        6: <LingkaranDasar6SVG />,
                      };
                      const hasSVG = soal.no in svgComponents;
                      const hasImage = hasSVG || !!dasarImages[soal.no];
                      const imageEl = hasSVG ? (
                        <div className="flex justify-center my-3">
                          {svgComponents[soal.no]}
                        </div>
                      ) : dasarImages[soal.no] ? (
                        <div className="flex justify-center my-3">
                          <div className="bg-white rounded-lg p-3 shadow-md max-w-sm w-full flex justify-center">
                            <img src={dasarImages[soal.no]} alt={`Gambar soal ${soal.no}`} className="max-w-full max-h-56 object-contain" />
                          </div>
                        </div>
                      ) : null;

                      if (hasImage && imgIndex !== -1) {
                        return (
                          <>
                            {lines.slice(0, imgIndex + 1).map((line, i) => (
                              <span key={i}>{i > 0 && <br />}{renderWithLatex(line)}</span>
                            ))}
                            {imageEl}
                            {lines.slice(imgIndex + 1).map((line, i) => (
                              <span key={i + imgIndex + 1}><br />{renderWithLatex(line)}</span>
                            ))}
                          </>
                        );
                      }
                      return (
                        <>
                          {lines.map((line, i) => (
                            <span key={i}>{i > 0 && <br />}{renderWithLatex(line)}</span>
                          ))}
                          {hasImage && <div className="mt-2">{imageEl}</div>}
                        </>
                      );
                    })()}
                  </div>
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {lingkaranDasarPembahasan[soal.no] && (
                    <PembahasanCard pembahasanKey={`ling-dasar-${soal.no}`} pembahasan={lingkaranDasarPembahasan[soal.no]} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LATIHAN OLIMPIADE TAB */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no}
                className="relative rounded-2xl overflow-hidden border border-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-slate-900/60 backdrop-blur" />
                <div className="relative px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold mr-2 shrink-0">{soal.no}</span>
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN')
                          ? <span className="text-yellow-400 font-semibold">{line}</span>
                          : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {olimpiadeImages[soal.no] && (
                    <div className="flex justify-center mb-3">
                      <div className="bg-white rounded-lg p-3 shadow-md max-w-sm w-full flex justify-center">
                        <img src={olimpiadeImages[soal.no]} alt={`Gambar soal ${soal.no}`} className="max-w-full max-h-56 object-contain" />
                      </div>
                    </div>
                  )}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {lingkaranOlimpiadePembahasan[soal.no] && (
                    <PembahasanCard pembahasanKey={`ling-olim-${soal.no}`} pembahasan={lingkaranOlimpiadePembahasan[soal.no]} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-white/30 hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeLingkaranPage;
