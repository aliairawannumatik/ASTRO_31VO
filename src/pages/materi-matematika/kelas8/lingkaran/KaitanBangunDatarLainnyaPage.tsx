import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Star } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ═══════════════════════════════════════════════════════════════════
   SVG 1 – Lingkaran Di Dalam Persegi (4 Sudut Diarsir)
   Square: (50,30)→(230,210), side=180. Circle: cx=140,cy=120, r=90
═══════════════════════════════════════════════════════════════════ */
const LingkaranDalamPersegiSVG = () => (
  <svg viewBox="0 0 280 250" className="w-full max-w-xs mx-auto" aria-label="Lingkaran di dalam persegi">
    <defs>
      <style>{`
        @keyframes arsirPulse1{0%,100%{opacity:.45;}50%{opacity:.75;}}
        @keyframes circleGlow1{0%,100%{filter:drop-shadow(0 0 6px #22d3ee);}50%{filter:drop-shadow(0 0 14px #22d3ee);}}
        @keyframes dash1{to{stroke-dashoffset:-16;}}
        .a1-fill{animation:arsirPulse1 2.2s ease-in-out infinite;}
        .a1-ring{animation:circleGlow1 2.2s ease-in-out infinite;}
        .a1-dash{animation:dash1 1.2s linear infinite;}
      `}</style>
    </defs>

    {/* Shaded corners: square - circle using evenodd */}
    <path
      fillRule="evenodd"
      fill="#f97316"
      className="a1-fill"
      d="M50,30 H230 V210 H50 Z M140,120 m-90,0 a90,90,0,1,0,180,0 a90,90,0,1,0,-180,0"
    />

    {/* Square outline */}
    <rect x="50" y="30" width="180" height="180" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Circle fill + glow */}
    <circle cx="140" cy="120" r="90" fill="rgba(34,211,238,.12)" stroke="#22d3ee" strokeWidth="2.5" className="a1-ring"/>

    {/* Center dot */}
    <circle cx="140" cy="120" r="3.5" fill="#22d3ee"/>

    {/* Dashed radius */}
    <line x1="140" y1="120" x2="230" y2="120" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="6 3" className="a1-dash" opacity=".8"/>
    <text x="184" y="114" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Side label */}
    <text x="136" y="224" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a = 2r</text>

    {/* Arsiran label */}
    <text x="62" y="50" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">Arsiran</text>
    <text x="62" y="62" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">= Sudut</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG 2 – Bangun Gabungan: Persegi Panjang + Setengah Lingkaran
   Rectangle: (50,120)→(230,210), h=90. Semicircle: cx=140,cy=120,r=90 (top half)
═══════════════════════════════════════════════════════════════════ */
const BangunGabunganSVG = () => (
  <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto" aria-label="Bangun gabungan">
    <defs>
      <style>{`
        @keyframes gabPulse{0%,100%{opacity:.35;}50%{opacity:.65;}}
        @keyframes gabGlow{0%,100%{filter:drop-shadow(0 0 6px #06b6d4);}50%{filter:drop-shadow(0 0 16px #06b6d4);}}
        .gab-fill{animation:gabPulse 2.4s ease-in-out infinite;}
        .gab-outer{animation:gabGlow 2.4s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* Combined shape: rectangle + top semicircle, filled */}
    <path
      d="M50,120 A90,90,0,0,1,230,120 V210 H50 Z"
      fill="rgba(6,182,212,.18)"
      className="gab-fill"
    />

    {/* Outline of combined shape */}
    <path
      d="M50,120 A90,90,0,0,1,230,120 V210 H50 Z"
      fill="none"
      stroke="#06b6d4"
      strokeWidth="2.5"
      strokeLinejoin="round"
      className="gab-outer"
    />

    {/* Diameter dashed line */}
    <line x1="50" y1="120" x2="230" y2="120" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" opacity=".7"/>
    <text x="133" y="115" fill="#c4b5fd" fontSize="10" fontFamily="monospace">d=2r</text>

    {/* Radius line (to apex of semicircle) */}
    <line x1="140" y1="120" x2="140" y2="30" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 3" opacity=".7"/>
    <text x="145" y="78" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Height label */}
    <line x1="238" y1="120" x2="238" y2="210" stroke="#4ade80" strokeWidth="1.5" opacity=".6"/>
    <text x="244" y="170" fill="#4ade80" fontSize="10" fontFamily="monospace">t</text>

    {/* Base label */}
    <text x="136" y="224" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle">2r</text>

    {/* Center dot */}
    <circle cx="140" cy="120" r="3" fill="#06b6d4"/>
    <text x="147" y="119" fill="#67e8f9" fontSize="9" fontFamily="monospace">O</text>

    {/* Labels */}
    <text x="136" y="78" fill="#67e8f9" fontSize="9" fontFamily="monospace" textAnchor="end">↑ Setengah</text>
    <text x="136" y="89" fill="#67e8f9" fontSize="9" fontFamily="monospace" textAnchor="end">Lingkaran</text>
    <text x="144" y="170" fill="#22d3ee" fontSize="9" fontFamily="monospace">Persegi</text>
    <text x="144" y="181" fill="#22d3ee" fontSize="9" fontFamily="monospace">Panjang</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG 3 – Segitiga Siku-Siku dengan Lingkaran Dalam (Arsiran = Segitiga – Lingkaran)
   Right triangle: C(50,200) A(50,40) B(220,200)
   Incircle: r ≈ 38, incenter ≈ (88,162)
   (AC=160, BC=170, AB=√(160²+170²)≈233.5; s≈281.75; L=½×160×170=13600; r=13600/281.75≈48)
   Simpler: AC=120,BC=90,AB=150; s=180; L=5400; r=30; incenter=(50+30,200-30)=(80,170)
   Triangle: C(50,200), A(50,80), B(170,200)
   AC=120, BC=120, AB=√(120²+120²)=... not 90-120-150
   Use: C(55,195), A(55,75), B(175,195) → AC=120, BC=120 → isoceles not right
   Use right triangle 3-4-5 scaled×30: legs 90,120,hyp=150
   C(55,195): right angle
   A(55,75): top (AC=120 vertical)
   B(175,195): right (BC=120... wait 3-4-5: 90,120,150)
   C(55,200), A(55,80) [AC=120], B(175,200) [BC=120] → not 3-4-5
   Use: C(50,200), A(50,80), B(140,200) → AC=120, BC=90 → hyp=√(120²+90²)=√(14400+8100)=√22500=150 ✓ 3-4-5 × 30
   s=(120+90+150)/2=180; L=½×90×120=5400; r=5400/180=30
   Incenter for right triangle at C: ix=C_x+r=50+30=80, iy=C_y-r=200-30=170
═══════════════════════════════════════════════════════════════════ */
const SegitigaDanLingkaranSVG = () => (
  <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto" aria-label="Segitiga dan lingkaran dalam">
    <defs>
      <style>{`
        @keyframes arsirPurple{0%,100%{opacity:.45;}50%{opacity:.72;}}
        @keyframes purpleGlow{0%,100%{filter:drop-shadow(0 0 5px #a855f7);}50%{filter:drop-shadow(0 0 14px #a855f7);}}
        .p-fill{animation:arsirPurple 2.6s ease-in-out infinite;}
        .p-ring{animation:purpleGlow 2.6s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* Shaded region: triangle minus incircle (evenodd) */}
    <path
      fillRule="evenodd"
      fill="#a855f7"
      className="p-fill"
      d="M50,200 L50,80 L140,200 Z M80,170 m-30,0 a30,30,0,1,0,60,0 a30,30,0,1,0,-60,0"
    />

    {/* Triangle outline */}
    <polygon points="50,200 50,80 140,200" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Incircle */}
    <circle cx="80" cy="170" r="30" fill="rgba(168,85,247,.15)" stroke="#d946ef" strokeWidth="2" className="p-ring"/>

    {/* Right-angle mark at C */}
    <polyline points="60,200 60,190 50,190" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity=".7"/>

    {/* Vertex labels */}
    <text x="42" y="72"  fill="#e879f9" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="148" y="208" fill="#e879f9" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="36" y="212" fill="#e879f9" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>

    {/* Tangent points */}
    <circle cx="80"  cy="200" r="3.5" fill="#fbbf24"/>
    <circle cx="50"  cy="170" r="3.5" fill="#fbbf24"/>

    {/* Radius line */}
    <line x1="80" y1="170" x2="80" y2="200" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="4 2" opacity=".8"/>
    <text x="84" y="188" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Incenter */}
    <circle cx="80" cy="170" r="3" fill="#d946ef"/>

    {/* Side labels */}
    <text x="32"  y="145" fill="#c4b5fd" fontSize="9" fontFamily="monospace">a=120</text>
    <text x="85"  y="214" fill="#c4b5fd" fontSize="9" fontFamily="monospace">b=90</text>

    {/* Arsiran text */}
    <text x="106" y="155" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG 4 – Persegi Panjang dengan Lingkaran di Dalam (Arsiran = Sisi-Sisi)
   Rectangle: (40,40)→(240,200), w=200,h=160. Circle: cx=140,cy=120, r=70
═══════════════════════════════════════════════════════════════════ */
const PersegipanjangDanLingkaranSVG = () => (
  <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto" aria-label="Persegi panjang dan lingkaran">
    <defs>
      <style>{`
        @keyframes arsirGreen{0%,100%{opacity:.4;}50%{opacity:.7;}}
        @keyframes greenGlow{0%,100%{filter:drop-shadow(0 0 6px #4ade80);}50%{filter:drop-shadow(0 0 16px #4ade80);}}
        .g-fill{animation:arsirGreen 2s ease-in-out infinite;}
        .g-ring{animation:greenGlow 2s ease-in-out infinite;}
      `}</style>
      <mask id="circMask">
        <rect x="40" y="40" width="200" height="160" fill="white"/>
        <circle cx="140" cy="120" r="70" fill="black"/>
      </mask>
    </defs>

    {/* Shaded corners: rectangle with circle cut using mask */}
    <rect x="40" y="40" width="200" height="160" fill="#22c55e" className="g-fill" mask="url(#circMask)"/>

    {/* Rectangle outline */}
    <rect x="40" y="40" width="200" height="160" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round"/>

    {/* Circle */}
    <circle cx="140" cy="120" r="70" fill="rgba(34,197,94,.12)" stroke="#4ade80" strokeWidth="2.5" className="g-ring"/>

    {/* Center */}
    <circle cx="140" cy="120" r="3.5" fill="#4ade80"/>

    {/* Radius line */}
    <line x1="140" y1="120" x2="210" y2="120" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <text x="170" y="114" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>

    {/* Width/height labels */}
    <text x="133" y="228" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle">p (panjang)</text>
    <text x="18"  y="124" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle"
      transform="rotate(-90 18 124)">l (lebar)</text>

    {/* Arsiran corner label */}
    <text x="46" y="56" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C1 – Persegi panjang 28×14 cm, dua setengah lingkaran dipotong
   dari sisi kiri & kanan (bentuk "tulang"/"dumbbell")
   Rect: (40,30)→(280,150), w=240,h=120. r=60. Masks kiri & kanan.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG1 = () => (
  <svg viewBox="0 0 320 190" className="w-full max-w-xs mx-auto" aria-label="Dumbbell arsiran">
    <defs>
      <mask id="dbMask">
        <rect x="40" y="30" width="240" height="120" fill="white"/>
        <path d="M40,30 A60,60,0,0,0,40,150 Z" fill="black"/>
        <path d="M280,30 A60,60,0,0,1,280,150 Z" fill="black"/>
      </mask>
      <style>{`
        @keyframes db1{0%,100%{opacity:.4;}50%{opacity:.72;}}
        @keyframes dbg{0%,100%{filter:drop-shadow(0 0 6px #f97316);}50%{filter:drop-shadow(0 0 16px #f97316);}}
        .db-fill{animation:db1 2.4s ease-in-out infinite;}
        .db-rect{animation:dbg 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Shaded dumbbell */}
    <rect x="40" y="30" width="240" height="120" fill="#f97316" className="db-fill" mask="url(#dbMask)"/>
    {/* Outline rect */}
    <rect x="40" y="30" width="240" height="120" fill="none" stroke="#fb923c" strokeWidth="2.5" className="db-rect"/>
    {/* Left semicircle outline */}
    <path d="M40,30 A60,60,0,0,0,40,150" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    {/* Right semicircle outline */}
    <path d="M280,30 A60,60,0,0,1,280,150" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    {/* Dimension labels */}
    <line x1="40" y1="18" x2="280" y2="18" stroke="#fbbf24" strokeWidth="1" markerEnd="url(#arrowR1)" markerStart="url(#arrowL1)" opacity=".7"/>
    <text x="160" y="14" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm</text>
    <line x1="298" y1="30" x2="298" y2="150" stroke="#4ade80" strokeWidth="1" opacity=".7"/>
    <text x="310" y="94" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(90,310,94)">14 cm</text>
    {/* r label */}
    <line x1="40" y1="90" x2="100" y2="90" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4 2" opacity=".7"/>
    <text x="70" y="84" fill="#67e8f9" fontSize="9" fontFamily="monospace">r=7</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C2 – Seperempat lingkaran r=10 cm (pie-slice)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG2 = () => (
  <svg viewBox="0 0 240 230" className="w-full max-w-xs mx-auto" aria-label="Quarter circle">
    <defs>
      <style>{`
        @keyframes qc1{0%,100%{opacity:.4;}50%{opacity:.72;}}
        @keyframes qcg{0%,100%{filter:drop-shadow(0 0 7px #22c55e);}50%{filter:drop-shadow(0 0 18px #22c55e);}}
        .qc-fill{animation:qc1 2.2s ease-in-out infinite;}
        .qc-out{animation:qcg 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Shaded quarter circle */}
    <path d="M30,190 L170,190 A140,140,0,0,0,30,50 Z"
      fill="#22c55e" className="qc-fill"/>
    <path d="M30,190 L170,190 A140,140,0,0,0,30,50 Z"
      fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round" className="qc-out"/>
    {/* Right angle mark */}
    <polyline points="48,190 48,172 30,172" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity=".7"/>
    {/* Radius labels */}
    <line x1="30" y1="190" x2="170" y2="190" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".7"/>
    <text x="97" y="208" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10 cm</text>
    <line x1="30" y1="190" x2="30" y2="50" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".7"/>
    <text x="10" y="124" fill="#fbbf24" fontSize="10" fontFamily="monospace" transform="rotate(-90,10,124)">10 cm</text>
    {/* Center dot */}
    <circle cx="30" cy="190" r="4" fill="#4ade80"/>
    <text x="36" y="187" fill="#6ee7b7" fontSize="9" fontFamily="monospace">O</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C3 – Persegi 14 cm, dua busur dari sudut bersebrangan
   membentuk "lensa". Arsiran = persegi − lensa.
   Square (20,20)→(240,240), side=220. Arcs r=220.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG3 = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="Square diagonal lens">
    <defs>
      <style>{`
        @keyframes sq3{0%,100%{opacity:.42;}50%{opacity:.7;}}
        @keyframes sq3g{0%,100%{filter:drop-shadow(0 0 6px #a855f7);}50%{filter:drop-shadow(0 0 16px #a855f7);}}
        .sq3-fill{animation:sq3 2.6s ease-in-out infinite;}
        .sq3-out{animation:sq3g 2.6s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Square shaded background */}
    <rect x="20" y="20" width="220" height="220" fill="#a855f7" className="sq3-fill"/>
    {/* White lens overlay (intersection of 2 quarter circles) */}
    <path d="M240,20 A220,220,0,0,0,20,240 A220,220,0,0,0,240,20 Z"
      fill="rgba(15,23,42,.92)"/>
    {/* Square outline */}
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#c084fc" strokeWidth="2.5" className="sq3-out"/>
    {/* Arc 1 outline: center top-left (20,20), from (240,20) to (20,240) */}
    <path d="M240,20 A220,220,0,0,0,20,240" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    {/* Arc 2 outline: center bottom-right (240,240), from (240,20) to (20,240) */}
    <path d="M240,20 A220,220,0,0,1,20,240" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    {/* Dimension */}
    <text x="128" y="256" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="7" y="134" fill="#c084fc" fontSize="10" fontFamily="monospace" transform="rotate(-90,7,134)">14 cm</text>
    {/* Shaded label */}
    <text x="42" y="52" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
    <text x="172" y="232" fill="#fde68a" fontSize="9" fontFamily="monospace">Arsiran</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C4 – Persegi panjang 21×21 cm + setengah lingkaran di kanan
   (bangun gabungan berbentuk "D")
   Rect: (20,20)→(200,200), w=180,h=180. Semicircle cx=200,cy=110,r=90.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG4 = () => (
  <svg viewBox="0 0 310 220" className="w-full max-w-xs mx-auto" aria-label="D-shape combined">
    <defs>
      <style>{`
        @keyframes ds4{0%,100%{opacity:.38;}50%{opacity:.68;}}
        @keyframes ds4g{0%,100%{filter:drop-shadow(0 0 7px #06b6d4);}50%{filter:drop-shadow(0 0 18px #06b6d4);}}
        .ds4-fill{animation:ds4 2.3s ease-in-out infinite;}
        .ds4-out{animation:ds4g 2.3s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Combined shape fill */}
    <path d="M20,20 H200 A90,90,0,0,1,200,200 H20 Z" fill="#06b6d4" className="ds4-fill"/>
    {/* Outline */}
    <path d="M20,20 H200 A90,90,0,0,1,200,200 H20 Z"
      fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" className="ds4-out"/>
    {/* Dashed diameter of semicircle */}
    <line x1="200" y1="20" x2="200" y2="200" stroke="#a78bfa" strokeWidth="1.4" strokeDasharray="6 3" opacity=".7"/>
    {/* Radius line */}
    <line x1="200" y1="110" x2="290" y2="110" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="4 2" opacity=".75"/>
    <text x="238" y="104" fill="#fbbf24" fontSize="10" fontFamily="monospace">r</text>
    {/* Labels */}
    <text x="107" y="215" fill="#22d3ee" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">21 cm</text>
    <text x="6" y="114" fill="#22d3ee" fontSize="10" fontFamily="monospace" transform="rotate(-90,6,114)">21 cm</text>
    {/* Labels inside */}
    <text x="100" y="107" fill="#e0f2fe" fontSize="9" fontFamily="monospace" textAnchor="middle">Persegi</text>
    <text x="100" y="118" fill="#e0f2fe" fontSize="9" fontFamily="monospace" textAnchor="middle">Panjang</text>
    <text x="260" y="107" fill="#fbbf24" fontSize="8" fontFamily="monospace">½ ling.</text>
    {/* Center dot */}
    <circle cx="200" cy="110" r="3.5" fill="#22d3ee"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C5 – Setengah lingkaran besar (r=10) dikurangi setengah lingkaran
   kecil (r=5) — bentuk "koma/siput" (half-annulus)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG5 = () => (
  <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto" aria-label="Snail half-annulus">
    <defs>
      <style>{`
        @keyframes sn5{0%,100%{opacity:.42;}50%{opacity:.75;}}
        @keyframes sn5g{0%,100%{filter:drop-shadow(0 0 7px #ec4899);}50%{filter:drop-shadow(0 0 18px #ec4899);}}
        .sn5-fill{animation:sn5 2.5s ease-in-out infinite;}
        .sn5-out{animation:sn5g 2.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Half annulus via evenodd: big semicircle minus small semicircle */}
    <path fillRule="evenodd" fill="#ec4899" className="sn5-fill"
      d="M30,140 A110,110,0,0,1,250,140 Z M140,140 m-55,0 a55,55,0,0,1,110,0 Z"/>
    {/* Big semicircle outline */}
    <path d="M30,140 A110,110,0,0,1,250,140" fill="none" stroke="#f9a8d4" strokeWidth="2.5" className="sn5-out"/>
    {/* Small semicircle outline */}
    <path d="M85,140 A55,55,0,0,1,195,140" fill="none" stroke="#a855f7" strokeWidth="2"/>
    {/* Diameter lines */}
    <line x1="30" y1="140" x2="250" y2="140" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="5 3" opacity=".6"/>
    {/* Center */}
    <circle cx="140" cy="140" r="3.5" fill="#ec4899"/>
    {/* R label */}
    <line x1="140" y1="140" x2="30" y2="140" stroke="#f9a8d4" strokeWidth="1.3" strokeDasharray="4 2" opacity=".7"/>
    <text x="75" y="154" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">10 cm</text>
    {/* r inner label */}
    <line x1="140" y1="140" x2="85" y2="140" stroke="#d8b4fe" strokeWidth="1.2" strokeDasharray="3 2" opacity=".7"/>
    <text x="107" y="130" fill="#d8b4fe" fontSize="9" fontFamily="monospace">r=5</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C6 – Persegi 14 cm (tiap segmen 7 cm), 4 busur seperempat
   lingkaran dari setiap sudut membentuk bintang 4 titik di tengah.
   Square (20,20)→(230,230), side=210. r=105 (half-side).
   Star center: shaded.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG6 = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="4-pointed star from arcs">
    <defs>
      <mask id="starMask6">
        {/* Filled square */}
        <rect x="20" y="20" width="220" height="220" fill="white"/>
        {/* 4 quarter circles (black = removed) */}
        <path d="M20,20 A220,220,0,0,1,240,240 L20,240 Z" fill="black"/>
        <path d="M240,20 A220,220,0,0,0,20,240 L240,240 Z" fill="black"/>
        <path d="M20,240 A220,220,0,0,0,240,20 L20,20 Z" fill="black"/>
        <path d="M240,240 A220,220,0,0,1,20,20 L240,20 Z" fill="black"/>
      </mask>
      <style>{`
        @keyframes st6{0%,100%{opacity:.45;}50%{opacity:.8;}}
        @keyframes st6g{0%,100%{filter:drop-shadow(0 0 8px #f59e0b);}50%{filter:drop-shadow(0 0 20px #f59e0b);}}
        .st6-fill{animation:st6 2.1s ease-in-out infinite;}
        .st6-out{animation:st6g 2.1s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Square background */}
    <rect x="20" y="20" width="220" height="220" fill="rgba(245,158,11,.08)" stroke="#f59e0b" strokeWidth="2.5" className="st6-out"/>
    {/* 4 arc outlines (from corners, r=220 full side) */}
    <path d="M20,20 A220,220,0,0,1,240,240" fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity=".5"/>
    <path d="M240,20 A220,220,0,0,0,20,240" fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity=".5"/>
    <path d="M20,240 A220,220,0,0,0,240,20" fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity=".5"/>
    <path d="M240,240 A220,220,0,0,1,20,20" fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity=".5"/>
    {/* Shaded star via mask */}
    <rect x="20" y="20" width="220" height="220" fill="#f59e0b" className="st6-fill" mask="url(#starMask6)"/>
    {/* Dimension labels */}
    <text x="128" y="257" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="4" y="134" fill="#f59e0b" fontSize="10" fontFamily="monospace" transform="rotate(-90,4,134)">14 cm</text>
    {/* 7cm tick labels */}
    <text x="77"  y="14" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <text x="183" y="14" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <line x1="20"  y1="20" x2="130" y2="20" stroke="#fde68a" strokeWidth="1" opacity=".5"/>
    <line x1="130" y1="20" x2="240" y2="20" stroke="#fde68a" strokeWidth="1" opacity=".5"/>
    <circle cx="130" cy="20" r="2.5" fill="#fde68a" opacity=".7"/>
    <circle cx="20"  cy="130" r="2.5" fill="#fde68a" opacity=".7"/>
    <circle cx="240" cy="130" r="2.5" fill="#fde68a" opacity=".7"/>
    <circle cx="130" cy="240" r="2.5" fill="#fde68a" opacity=".7"/>
    <text x="2" y="77" fill="#fde68a" fontSize="8" fontFamily="monospace" transform="rotate(-90,2,77)">7 cm</text>
    <text x="2" y="183" fill="#fde68a" fontSize="8" fontFamily="monospace" transform="rotate(-90,2,183)">7 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C7 – Persegi panjang 28×14 cm, lengkungan tiga busur
   Besar (r=14) dikurangi 2 kecil (r=7). Arsiran = besar − 2 kecil.
   Rect: (20,30)→(260,130), w=240,h=100.
   Big arch r=120 (proportional), center (140,130).
   Two small arches r=60, centers (80,130) & (200,130).
═══════════════════════════════════════════════════════════════════ */
const SoalSVG7 = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto" aria-label="Three arch pattern">
    <defs>
      <style>{`
        @keyframes ar7{0%,100%{opacity:.4;}50%{opacity:.72;}}
        @keyframes ar7g{0%,100%{filter:drop-shadow(0 0 7px #0ea5e9);}50%{filter:drop-shadow(0 0 18px #0ea5e9);}}
        .ar7-fill{animation:ar7 2.3s ease-in-out infinite;}
        .ar7-out{animation:ar7g 2.3s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Rectangle border */}
    <rect x="20" y="40" width="240" height="120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" opacity=".5"/>
    {/* Shaded region: big arch - 2 small arches (evenodd) */}
    <path fillRule="evenodd" fill="#0ea5e9" className="ar7-fill"
      d="M20,160 A120,120,0,0,1,260,160 Z M20,160 A60,60,0,0,0,140,160 Z M140,160 A60,60,0,0,0,260,160 Z"/>
    {/* Big arch outline */}
    <path d="M20,160 A120,120,0,0,1,260,160" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="ar7-out"/>
    {/* Two small arch outlines */}
    <path d="M20,160 A60,60,0,0,0,140,160" fill="none" stroke="#a78bfa" strokeWidth="2"/>
    <path d="M140,160 A60,60,0,0,0,260,160" fill="none" stroke="#a78bfa" strokeWidth="2"/>
    {/* Base line */}
    <line x1="20" y1="160" x2="260" y2="160" stroke="#64748b" strokeWidth="1.5" opacity=".6"/>
    {/* Dimension labels */}
    <text x="137" y="180" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm</text>
    <line x1="268" y1="40" x2="268" y2="160" stroke="#4ade80" strokeWidth="1.2" opacity=".6"/>
    <text x="277" y="105" fill="#4ade80" fontSize="9" fontFamily="monospace" transform="rotate(90,277,105)">14 cm</text>
    {/* R labels */}
    <line x1="140" y1="160" x2="140" y2="40" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 2" opacity=".6"/>
    <text x="145" y="105" fill="#38bdf8" fontSize="9" fontFamily="monospace">R=14</text>
    <line x1="80"  y1="160" x2="80"  y2="100" stroke="#a78bfa" strokeWidth="1.1" strokeDasharray="3 2" opacity=".6"/>
    <text x="84"  y="135" fill="#a78bfa" fontSize="8" fontFamily="monospace">r=7</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C8 – Persegi 7 cm, daun diagonal (lensa dari 2 busur 90°)
   Square (30,20)→(220,210), side=190≈7cm. Arcs centered at top-right
   & bottom-left corners, r=190.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG8 = () => (
  <svg viewBox="0 0 250 240" className="w-full max-w-xs mx-auto" aria-label="Diagonal leaf in square">
    <defs>
      <style>{`
        @keyframes lf8{0%,100%{opacity:.45;}50%{opacity:.78;}}
        @keyframes lf8g{0%,100%{filter:drop-shadow(0 0 7px #14b8a6);}50%{filter:drop-shadow(0 0 18px #14b8a6);}}
        .lf8-fill{animation:lf8 2.4s ease-in-out infinite;}
        .lf8-out{animation:lf8g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Square outline */}
    <rect x="30" y="20" width="190" height="190" fill="none" stroke="#94a3b8" strokeWidth="2" opacity=".6"/>
    {/* Leaf fill: lens from (30,20)→(220,210) bounded by 2 arcs */}
    {/* Arc 1: center bottom-left (30,210), from (220,210) to (30,20) */}
    {/* Arc 2: center top-right (220,20), from (30,20) to (220,210) */}
    <path d="M30,20 A190,190,0,0,1,220,210 A190,190,0,0,1,30,20 Z"
      fill="#14b8a6" className="lf8-fill"/>
    <path d="M30,20 A190,190,0,0,1,220,210 A190,190,0,0,1,30,20 Z"
      fill="none" stroke="#2dd4bf" strokeWidth="2.5" className="lf8-out"/>
    {/* Arc outlines for clarity */}
    <path d="M30,20 A190,190,0,0,1,220,210" fill="none" stroke="#2dd4bf" strokeWidth="2.5"/>
    <path d="M220,210 A190,190,0,0,1,30,20" fill="none" stroke="#2dd4bf" strokeWidth="2.5"/>
    {/* Dimension */}
    <text x="122" y="228" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">7 cm</text>
    <text x="9" y="118" fill="#2dd4bf" fontSize="10" fontFamily="monospace" transform="rotate(-90,9,118)">7 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C9 – Persegi 14 cm, 4 kelopak bunga (petal/lensa dari 4 pasang
   busur). Masing-masing kelopak = irisan 2 lingkaran dari sudut
   berdekatan. Square (20,20)→(240,240). Each petal from adjacent
   corners with r = full side.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG9 = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="4-petal flower in square">
    <defs>
      <style>{`
        @keyframes fl9{0%,100%{opacity:.42;}50%{opacity:.75;}}
        @keyframes fl9g{0%,100%{filter:drop-shadow(0 0 7px #f97316);}50%{filter:drop-shadow(0 0 20px #f97316);}}
        .fl9-fill{animation:fl9 2.2s ease-in-out infinite;}
        .fl9-out{animation:fl9g 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Square outline */}
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#94a3b8" strokeWidth="2" opacity=".5"/>
    {/* 4 petals — each is intersection of 2 adjacent quarter-circle arcs (r=220, full side) */}
    {/* Bottom petal: arcs from (20,20) and (240,20), meet at (130,240)≈bottom-center */}
    <path d="M20,20 A220,220,0,0,1,240,240 A220,220,0,0,1,20,20 Z" fill="#f97316" className="fl9-fill" opacity=".5"/>
    {/* Top petal: arcs from (20,240) and (240,240) */}
    <path d="M20,240 A220,220,0,0,0,240,20 A220,220,0,0,0,20,240 Z" fill="#f97316" className="fl9-fill" opacity=".5"/>
    {/* Left petal: arcs from (240,20) and (240,240) */}
    <path d="M240,20 A220,220,0,0,0,20,240 A220,220,0,0,0,240,20 Z" fill="#ec4899" className="fl9-fill" opacity=".5"/>
    {/* Right petal: arcs from (20,20) and (20,240) */}
    <path d="M20,20 A220,220,0,0,0,240,240 A220,220,0,0,0,20,20 Z" fill="#ec4899" className="fl9-fill" opacity=".5"/>
    {/* Outline for all 4 arcs */}
    <path d="M20,20 A220,220,0,0,1,240,240" fill="none" stroke="#fb923c" strokeWidth="2" className="fl9-out"/>
    <path d="M240,20 A220,220,0,0,0,20,240" fill="none" stroke="#fb923c" strokeWidth="2"/>
    <path d="M20,240 A220,220,0,0,0,240,20" fill="none" stroke="#fb923c" strokeWidth="2"/>
    <path d="M240,240 A220,220,0,0,1,20,20" fill="none" stroke="#fb923c" strokeWidth="2"/>
    {/* Square re-outline (on top) */}
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#64748b" strokeWidth="2"/>
    {/* Dimension labels */}
    <text x="128" y="257" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="6" y="134" fill="#fb923c" fontSize="10" fontFamily="monospace" transform="rotate(-90,6,134)">14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C10 – Lingkaran r=10 cm, sektor sudut siku-siku (90°) diarsir
═══════════════════════════════════════════════════════════════════ */
const SoalSVG10 = () => (
  <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto" aria-label="Quarter sector of circle">
    <defs>
      <style>{`
        @keyframes sc10{0%,100%{opacity:.4;}50%{opacity:.72;}}
        @keyframes sc10g{0%,100%{filter:drop-shadow(0 0 7px #8b5cf6);}50%{filter:drop-shadow(0 0 18px #8b5cf6);}}
        .sc10-fill{animation:sc10 2.4s ease-in-out infinite;}
        .sc10-out{animation:sc10g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Full circle (unshaded background) */}
    <circle cx="110" cy="120" r="105" fill="rgba(139,92,246,.06)" stroke="#8b5cf6" strokeWidth="2" opacity=".5"/>
    {/* Shaded quarter sector (right lower quarter) */}
    <path d="M110,120 L215,120 A105,105,0,0,1,110,225 Z"
      fill="#8b5cf6" className="sc10-fill"/>
    <path d="M110,120 L215,120 A105,105,0,0,1,110,225 Z"
      fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round" className="sc10-out"/>
    {/* Right-angle mark */}
    <polyline points="128,120 128,138 110,138" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity=".8"/>
    {/* Center */}
    <circle cx="110" cy="120" r="4" fill="#8b5cf6"/>
    <text x="94" y="117" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    {/* Radius label */}
    <line x1="110" y1="120" x2="215" y2="120" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".8"/>
    <text x="157" y="112" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">10 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   FORMULA CARDS
═══════════════════════════════════════════════════════════════════ */
const FormulaCard = ({ color, label, luas, keliling }: {
  color: string; label: string; luas: string; keliling: string;
}) => (
  <div className="rounded-xl p-4 space-y-2 border text-sm"
    style={{ background: `${color}18`, borderColor: `${color}45` }}>
    <p className="font-body font-bold text-xs uppercase tracking-widest" style={{ color }}>
      📐 {label}
    </p>
    <div className="space-y-1">
      <p className="text-white/60 text-xs font-body">Luas Arsiran:</p>
      <BlockMath math={luas} />
      <p className="text-white/60 text-xs font-body">Keliling Daerah Arsiran:</p>
      <BlockMath math={keliling} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
const KaitanBangunDatarLainnyaPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "kasus1", "kasus2", "kasus3", "kasus4", "contoh1", "contoh2", "contoh3", "contoh4", "contoh5", "contoh6", "contoh7", "contoh8", "contoh9", "contoh10", "contoh11", "contoh12", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

  const SectionHeader = ({
    id, icon, iconColor, title, accent,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string; accent?: string }) => (
    <button
      onClick={() => toggle(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-all"
      style={open.includes(id) ? {
        background: `linear-gradient(to right, ${accent ?? "rgba(6,182,212,.12)"}, transparent)`,
        borderBottom: `1px solid ${accent ? accent.replace("rgba(", "rgba(").replace(", .12)", ", .3)") : "rgba(6,182,212,.3)"}`,
      } : {}}
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white text-sm leading-snug">{title}</span>
      </div>
      {open.includes(id)
        ? <ChevronUp   className="w-5 h-5 shrink-0" style={{ color: accent ? "#fff" : "#06b6d4" }} />
        : <ChevronDown className="w-5 h-5 shrink-0 text-white/25" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">

        {/* ── Page Header ────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-body font-bold tracking-wide"
            style={{ background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.4)", color: "#4ade80" }}>
            <BookOpen className="w-3.5 h-3.5" /> KELAS 8 · LINGKARAN · MATERI
          </div>
          <h1
            className="font-display text-2xl md:text-3xl font-bold mb-2 leading-tight"
            style={{
              background: "linear-gradient(135deg,#4ade80,#22d3ee,#a78bfa,#f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            KAITAN LINGKARAN<br />DENGAN BANGUN DATAR LAINNYA
          </h1>
          <p className="text-white/40 text-xs font-body">Luas & Keliling Daerah Arsiran · Bangun Gabungan</p>
          {/* decorative stars */}
          <div className="flex justify-center gap-2 mt-3">
            {["#f97316","#22d3ee","#a78bfa","#4ade80","#fbbf24"].map((c,i) => (
              <Star key={i} className="w-3 h-3" style={{ color: c, fill: c, opacity: .6 }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(251,191,36,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="💡 Apa Itu Daerah Arsiran?" accent="rgba(251,191,36,.12)" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <p className="font-body text-sm text-white/85 leading-relaxed">
                  Dalam soal matematika, kita sering menemukan gambar bangun datar yang <strong className="text-yellow-300">saling bertumpang-tindih</strong> atau saling berada di dalam satu sama lain. Bagian yang <em>diarsir</em> adalah daerah yang menjadi fokus pertanyaan — bisa berupa sudut-sudut yang tersisa, gabungan dua bangun, atau daerah yang "dipotong" oleh lingkaran.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { color: "#f97316", label: "Dikurangi", desc: "Arsiran = Bangun Besar − Bangun Kecil" },
                    { color: "#06b6d4", label: "Dijumlah", desc: "Arsiran = Luas Bangun A + Luas Bangun B" },
                    { color: "#a855f7", label: "Campuran", desc: "Gabungan busur lingkaran dan sisi lurus" },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl p-3 border text-center"
                      style={{ background: `${c.color}15`, borderColor: `${c.color}40` }}>
                      <p className="text-xs font-bold mb-1" style={{ color: c.color }}>✦ {c.label}</p>
                      <p className="text-white/55 text-xs">{c.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(251,191,36,.08)", borderColor: "rgba(251,191,36,.3)" }}>
                  <p className="font-body text-sm text-yellow-200">
                    🔑 <strong>Kunci utama:</strong> Identifikasi terlebih dahulu <em>bangun apa yang ditambah</em> dan <em>bangun apa yang dikurang</em>. Setelah itu, hitung luas dan kelilingnya secara terpisah.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 1: Lingkaran Di Dalam Persegi ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus1" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title="🔶 Kasus 1 — Lingkaran di Dalam Persegi (Sudut Diarsir)"
              accent="rgba(249,115,22,.12)" />
            {open.includes("kasus1") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(249,115,22,.08)", borderColor: "rgba(249,115,22,.25)" }}>
                  <p className="text-orange-200 leading-relaxed">
                    Sebuah lingkaran <strong className="text-cyan-300">tepat menyinggung semua sisi persegi</strong> dari dalam. Daerah yang diarsir adalah <strong className="text-orange-300">keempat sudut persegi</strong> yang tidak tertutupi lingkaran.
                  </p>
                </div>
                <LingkaranDalamPersegiSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(249,115,22,.09)", borderColor: "rgba(249,115,22,.3)" }}>
                    <p className="text-orange-300 font-bold text-xs uppercase tracking-wide">📐 Luas Daerah Arsiran</p>
                    <p className="text-white/60 text-xs font-body">Luas persegi dikurangi luas lingkaran:</p>
                    <BlockMath math="L_{\text{arsir}} = a^2 - \pi r^2" />
                    <p className="text-white/50 text-xs font-body">Karena <InlineMath math="a = 2r" />:</p>
                    <BlockMath math="L_{\text{arsir}} = 4r^2 - \pi r^2 = r^2(4-\pi)" />
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(34,211,238,.09)", borderColor: "rgba(34,211,238,.3)" }}>
                    <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Daerah Arsiran</p>
                    <p className="text-white/60 text-xs font-body">Sisi luar (persegi) + sisi dalam (lingkaran):</p>
                    <BlockMath math="K_{\text{arsir}} = 4a + 2\pi r" />
                    <p className="text-white/50 text-xs font-body">Karena <InlineMath math="a = 2r" />:</p>
                    <BlockMath math="K_{\text{arsir}} = 8r + 2\pi r = 2r(4+\pi)" />
                  </div>
                </div>
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(251,191,36,.07)", borderColor: "rgba(251,191,36,.25)" }}>
                  <p className="text-yellow-200 text-xs font-body">
                    ✏️ <strong>Ingat:</strong> "Keliling daerah arsiran" = semua garis batas yang mengelilingi daerah tersebut — baik yang lurus (sisi persegi) maupun yang melengkung (busur lingkaran).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 2: Bangun Gabungan ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(6,182,212,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus2" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="🔵 Kasus 2 — Bangun Gabungan: Persegi Panjang + Setengah Lingkaran"
              accent="rgba(6,182,212,.12)" />
            {open.includes("kasus2") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(6,182,212,.08)", borderColor: "rgba(6,182,212,.25)" }}>
                  <p className="text-cyan-200 leading-relaxed">
                    Dua bangun <strong className="text-cyan-300">digabungkan menjadi satu</strong>: sebuah persegi panjang (panjang <em>p</em>, lebar <em>t</em>) ditambah setengah lingkaran di salah satu sisi panjangnya. Bayangkan kolam renang dengan ujung berbentuk setengah oval!
                  </p>
                </div>
                <BangunGabunganSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(6,182,212,.09)", borderColor: "rgba(6,182,212,.3)" }}>
                    <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide">📐 Luas Gabungan</p>
                    <p className="text-white/60 text-xs font-body">Luas persegi panjang + luas setengah lingkaran:</p>
                    <BlockMath math="L = p \times t + \tfrac{1}{2}\pi r^2" />
                    <p className="text-white/50 text-xs font-body">dengan <InlineMath math="r = \tfrac{p}{2}" /> (diameter = panjang)</p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(167,139,250,.09)", borderColor: "rgba(167,139,250,.3)" }}>
                    <p className="text-violet-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Gabungan</p>
                    <p className="text-white/60 text-xs font-body">Dua sisi pendek + satu sisi panjang + busur setengah lingkaran:</p>
                    <BlockMath math="K = 2t + p + \pi r" />
                    <p className="text-white/50 text-xs font-body">Sisi panjang atas diganti busur <InlineMath math="\pi r"/></p>
                  </div>
                </div>
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(251,191,36,.07)", borderColor: "rgba(251,191,36,.25)" }}>
                  <p className="text-yellow-200 text-xs font-body">
                    🎯 <strong>Perhatikan:</strong> Keliling bangun gabungan <em>tidak</em> menjumlahkan semua sisi — sisi yang <em>berhimpitan</em> (diameter setengah lingkaran yang berimpit dengan sisi persegi panjang) tidak dihitung!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 3: Segitiga + Lingkaran Dalam ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus3" icon={<Target className="w-5 h-5" />} iconColor="text-violet-400"
              title="🔺 Kasus 3 — Segitiga dengan Lingkaran Dalam (Arsiran = Segitiga − Lingkaran)"
              accent="rgba(168,85,247,.12)" />
            {open.includes("kasus3") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(168,85,247,.08)", borderColor: "rgba(168,85,247,.25)" }}>
                  <p className="text-violet-200 leading-relaxed">
                    Sebuah lingkaran <strong className="text-violet-300">dimasukkan ke dalam segitiga</strong> sehingga menyinggung ketiga sisinya. Daerah arsiran adalah bagian segitiga yang <strong className="text-pink-300">tidak terisi</strong> oleh lingkaran — biasanya berada di tiga pojok segitiga.
                  </p>
                </div>
                <SegitigaDanLingkaranSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(168,85,247,.09)", borderColor: "rgba(168,85,247,.3)" }}>
                    <p className="text-violet-300 font-bold text-xs uppercase tracking-wide">📐 Luas Daerah Arsiran</p>
                    <BlockMath math="L_{\text{arsir}} = L_\triangle - \pi r^2" />
                    <p className="text-white/60 text-xs font-body">dengan <InlineMath math="r = \dfrac{L_\triangle}{s}"/>, <InlineMath math="s = \dfrac{a+b+c}{2}"/></p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(217,70,239,.09)", borderColor: "rgba(217,70,239,.3)" }}>
                    <p className="text-fuchsia-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Daerah Arsiran</p>
                    <BlockMath math="K_{\text{arsir}} = (a+b+c) + 2\pi r" />
                    <p className="text-white/60 text-xs font-body">Keliling segitiga + keliling lingkaran</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── KASUS 4: Persegi Panjang − Lingkaran ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(34,197,94,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="kasus4" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title="🟩 Kasus 4 — Persegi Panjang dengan Lingkaran di Dalamnya"
              accent="rgba(34,197,94,.12)" />
            {open.includes("kasus4") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-3 border text-sm font-body"
                  style={{ background: "rgba(34,197,94,.08)", borderColor: "rgba(34,197,94,.25)" }}>
                  <p className="text-green-200 leading-relaxed">
                    Sebuah lingkaran berada <strong className="text-green-300">di tengah persegi panjang</strong>. Daerah arsiran adalah bagian persegi panjang di sekitar lingkaran — seperti bingkai foto yang mengelilingi gambar bulat!
                  </p>
                </div>
                <PersegipanjangDanLingkaranSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(34,197,94,.09)", borderColor: "rgba(34,197,94,.3)" }}>
                    <p className="text-green-300 font-bold text-xs uppercase tracking-wide">📐 Luas Daerah Arsiran</p>
                    <BlockMath math="L_{\text{arsir}} = p \times l - \pi r^2" />
                    <p className="text-white/60 text-xs font-body">Luas persegi panjang dikurangi luas lingkaran</p>
                  </div>
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(74,222,128,.09)", borderColor: "rgba(74,222,128,.3)" }}>
                    <p className="text-green-300 font-bold text-xs uppercase tracking-wide">📏 Keliling Daerah Arsiran</p>
                    <BlockMath math="K_{\text{arsir}} = 2(p + l) + 2\pi r" />
                    <p className="text-white/60 text-xs font-body">Keliling persegi panjang + keliling lingkaran</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 1 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 1 — Persegi dengan Lingkaran Dalam (π = 3,14)"
              accent="rgba(249,115,22,.12)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border"
                  style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                  <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah persegi memiliki sisi 20 cm. Di dalamnya terdapat lingkaran yang menyinggung keempat sisinya. Hitunglah <strong>(a)</strong> luas daerah yang diarsir dan <strong>(b)</strong> keliling daerah yang diarsir! <InlineMath math="(\pi = 3{,}14)"/>
                  </p>
                </div>
                <div className="rounded-xl p-4 space-y-3 border"
                  style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> sisi persegi <InlineMath math="a = 20"/> cm, sehingga <InlineMath math="r = 10"/> cm
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas daerah arsiran:</strong></p>
                  <BlockMath math="L_{\text{arsir}} = a^2 - \pi r^2 = 20^2 - 3{,}14 \times 10^2" />
                  <BlockMath math="= 400 - 314 = 86 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling daerah arsiran:</strong></p>
                  <BlockMath math="K_{\text{arsir}} = 4a + 2\pi r = 4(20) + 2 \times 3{,}14 \times 10" />
                  <BlockMath math="= 80 + 62{,}8 = 142{,}8 \text{ cm}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                      <p className="text-orange-300 text-xs font-bold">✅ Luas Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">86 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">142,8 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 2 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400"
              title="✏️ Contoh 2 — Bangun Gabungan Persegi Panjang + Setengah Lingkaran (π = 22/7)"
              accent="rgba(168,85,247,.12)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border"
                  style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                  <p className="text-violet-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Lapangan futsal berbentuk persegi panjang berukuran 28 m × 14 m. Pada salah satu sisi panjangnya (28 m) ditambahkan setengah lingkaran. Hitunglah <strong>(a)</strong> luas total lapangan dan <strong>(b)</strong> kelilingnya! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <div className="rounded-xl p-4 space-y-3 border"
                  style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> <InlineMath math="p = 28"/> m, <InlineMath math="t = 14"/> m, setengah lingkaran dengan <InlineMath math="r = \tfrac{28}{2} = 14"/> m
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas total:</strong></p>
                  <BlockMath math="L = p \times t + \tfrac{1}{2}\pi r^2 = 28 \times 14 + \tfrac{1}{2} \times \tfrac{22}{7} \times 14^2" />
                  <BlockMath math="= 392 + \tfrac{1}{2} \times \tfrac{22}{7} \times 196 = 392 + 308 = 700 \text{ m}^2" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Dua sisi pendek (14 m) + satu sisi panjang bawah (28 m) + busur setengah lingkaran</p>
                  <BlockMath math="K = 2t + p + \pi r = 2(14) + 28 + \tfrac{22}{7} \times 14" />
                  <BlockMath math="= 28 + 28 + 44 = 100 \text{ m}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                      <p className="text-violet-300 text-xs font-bold">✅ Luas Total</p>
                      <p className="text-white text-sm font-bold mt-1">700 m²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center"
                      style={{ background: "rgba(6,182,212,.1)", borderColor: "rgba(6,182,212,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling</p>
                      <p className="text-white text-sm font-bold mt-1">100 m</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 3 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 3 — Persegi Panjang 28×14 Dikurangi Dua Setengah Lingkaran (π = 22/7)"
              accent="rgba(249,115,22,.12)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                  <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Perhatikan gambar di bawah! Sebuah persegi panjang berukuran 28 cm × 14 cm. Dari sisi kiri dan sisi kanannya dipotong masing-masing satu setengah lingkaran. Hitunglah <strong>(a)</strong> luas daerah yang diarsir dan <strong>(b)</strong> keliling daerah yang diarsir! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG1 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> panjang = 28 cm, lebar = 14 cm. Diameter setengah lingkaran = 14 cm, maka <InlineMath math="r = 7"/> cm. Dua setengah lingkaran = satu lingkaran penuh.
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas daerah arsiran:</strong></p>
                  <BlockMath math="L_{\text{arsir}} = L_{\text{persegi panjang}} - L_{\text{lingkaran}}" />
                  <BlockMath math="= 28 \times 14 - \pi r^2 = 392 - \tfrac{22}{7} \times 49" />
                  <BlockMath math="= 392 - 154 = \boxed{238 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling daerah arsiran:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Sisi atas (28cm) + sisi bawah (28cm) + busur kiri (<InlineMath math="\pi r"/>) + busur kanan (<InlineMath math="\pi r"/>):</p>
                  <BlockMath math="K_{\text{arsir}} = 2 \times 28 + 2 \times \pi r = 56 + 2 \times \tfrac{22}{7} \times 7" />
                  <BlockMath math="= 56 + 44 = \boxed{100 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                      <p className="text-orange-300 text-xs font-bold">✅ Luas Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">238 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">100 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 4 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(34,197,94,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh4" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400"
              title="✏️ Contoh 4 — Seperempat Lingkaran r = 10 cm (π = 3,14)"
              accent="rgba(34,197,94,.12)" />
            {open.includes("contoh4") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(34,197,94,.1)", borderColor: "rgba(34,197,94,.35)" }}>
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Perhatikan gambar di bawah! Daerah yang diarsir adalah seperempat lingkaran dengan jari-jari 10 cm. Hitunglah <strong>(a)</strong> luas daerah arsiran dan <strong>(b)</strong> keliling daerah arsiran! <InlineMath math="(\pi = 3{,}14)"/>
                  </p>
                </div>
                <SoalSVG2 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Diketahui:</strong> <InlineMath math="r = 10"/> cm, <InlineMath math="\pi = 3{,}14"/></p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas seperempat lingkaran:</strong></p>
                  <BlockMath math="L = \tfrac{1}{4}\pi r^2 = \tfrac{1}{4} \times 3{,}14 \times 10^2" />
                  <BlockMath math="= \tfrac{1}{4} \times 314 = \boxed{78{,}5 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling daerah arsiran:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Dua jari-jari (sisi lurus) + busur seperempat lingkaran:</p>
                  <BlockMath math="K = 2r + \tfrac{1}{4}(2\pi r) = 2(10) + \tfrac{1}{2} \times 3{,}14 \times 10" />
                  <BlockMath math="= 20 + 15{,}7 = \boxed{35{,}7 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,197,94,.1)", borderColor: "rgba(34,197,94,.35)" }}>
                      <p className="text-green-300 text-xs font-bold">✅ Luas Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">78,5 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">35,7 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 5 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh5" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400"
              title="✏️ Contoh 5 — Persegi 14 cm dengan Dua Busur Bersilang (π = 22/7)"
              accent="rgba(168,85,247,.12)" />
            {open.includes("contoh5") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                  <p className="text-violet-300 font-bold text-xs uppercase tracking-wide mb-2">🟣 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Dari sebuah persegi bersisi 14 cm, dibuat dua busur seperempat lingkaran (jari-jari 14 cm) yang berpusat di dua sudut yang berseberangan. Daerah arsiran (sudut atas-kiri dan bawah-kanan) adalah daerah persegi <em>di luar</em> lensa. Hitunglah luas daerah yang diarsir! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG3 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> sisi persegi <InlineMath math="a = 14"/> cm, <InlineMath math="r = 14"/> cm (=sisi).
                  </p>
                  <p className="font-body text-xs text-white/60">Luas "lensa" (irisan 2 busur) = <InlineMath math="2 \times (\text{sektor} - \text{segitiga})"/></p>
                  <BlockMath math="L_{\text{lensa}} = 2\left(\tfrac{1}{4}\pi r^2 - \tfrac{1}{2}r^2\right) = 2 \times \tfrac{1}{4}r^2(2\pi - 2)" />
                  <p className="font-body text-xs text-white/60">Hitung per komponen:</p>
                  <BlockMath math="L_{\text{sektor}} = \tfrac{1}{4} \times \tfrac{22}{7} \times 14^2 = \tfrac{1}{4} \times \tfrac{22}{7} \times 196 = 154 \text{ cm}^2" />
                  <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 14 \times 14 = 98 \text{ cm}^2" />
                  <BlockMath math="L_{\text{lensa}} = 2(154 - 98) = 2 \times 56 = 112 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Luas daerah arsiran:</strong></p>
                  <BlockMath math="L_{\text{arsir}} = L_{\text{persegi}} - L_{\text{lensa}} = 14^2 - 112 = 196 - 112 = \boxed{84 \text{ cm}^2}" />
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                    <p className="text-violet-300 text-xs font-bold">✅ Luas Arsiran</p>
                    <p className="text-white text-sm font-bold mt-1">84 cm²</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 6 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(6,182,212,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh6" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-cyan-400"
              title="✏️ Contoh 6 — Bangun Gabungan: Persegi Panjang + Setengah Lingkaran (π = 22/7)"
              accent="rgba(6,182,212,.12)" />
            {open.includes("contoh6") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(6,182,212,.1)", borderColor: "rgba(6,182,212,.35)" }}>
                  <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide mb-2">🔵 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah bangun datar gabungan terdiri dari persegi panjang berukuran 21 cm × 21 cm dan setengah lingkaran yang menempel pada salah satu sisi tegaknya. Hitunglah <strong>(a)</strong> luas bangun gabungan dan <strong>(b)</strong> kelilingnya! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG4 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> <InlineMath math="p = l = 21"/> cm, setengah lingkaran dengan <InlineMath math="r = \tfrac{21}{2} = 10{,}5"/> cm
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas bangun gabungan:</strong></p>
                  <BlockMath math="L = p \times l + \tfrac{1}{2}\pi r^2 = 21 \times 21 + \tfrac{1}{2} \times \tfrac{22}{7} \times (10{,}5)^2" />
                  <BlockMath math="= 441 + \tfrac{11}{7} \times 110{,}25 = 441 + 173{,}25 \approx \boxed{614{,}25 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling bangun gabungan:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Sisi atas + sisi bawah + sisi kiri + busur setengah lingkaran (sisi kanan):</p>
                  <BlockMath math="K = 21 + 21 + 21 + \pi r = 63 + \tfrac{22}{7} \times 10{,}5" />
                  <BlockMath math="= 63 + 33 = \boxed{96 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(6,182,212,.1)", borderColor: "rgba(6,182,212,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Luas Bangun</p>
                      <p className="text-white text-sm font-bold mt-1">614,25 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling</p>
                      <p className="text-white text-sm font-bold mt-1">96 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 7 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(236,72,153,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh7" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-pink-400"
              title="✏️ Contoh 7 — Setengah Lingkaran Besar Dikurangi Setengah Lingkaran Kecil (π = 3,14)"
              accent="rgba(236,72,153,.12)" />
            {open.includes("contoh7") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(236,72,153,.1)", borderColor: "rgba(236,72,153,.35)" }}>
                  <p className="text-pink-300 font-bold text-xs uppercase tracking-wide mb-2">🌹 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Daerah arsiran berbentuk "koma" (setengah annulus). Setengah lingkaran besar berdiameter 20 cm dan setengah lingkaran kecil berdiameter 10 cm dihapus dari dalamnya. Hitunglah <strong>(a)</strong> luas daerah arsiran dan <strong>(b)</strong> kelilingnya! <InlineMath math="(\pi = 3{,}14)"/>
                  </p>
                </div>
                <SoalSVG5 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> <InlineMath math="R = 10"/> cm (besar), <InlineMath math="r = 5"/> cm (kecil)
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas daerah arsiran:</strong></p>
                  <BlockMath math="L = \tfrac{1}{2}\pi R^2 - \tfrac{1}{2}\pi r^2 = \tfrac{1}{2}\pi(R^2 - r^2)" />
                  <BlockMath math="= \tfrac{1}{2} \times 3{,}14 \times (100 - 25) = \tfrac{1}{2} \times 3{,}14 \times 75" />
                  <BlockMath math="= \tfrac{1}{2} \times 235{,}5 = \boxed{117{,}75 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling daerah arsiran:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Busur besar + busur kecil + 2 garis penghubung:</p>
                  <BlockMath math="K = \pi R + \pi r + 2(R - r) = 3{,}14 \times 10 + 3{,}14 \times 5 + 2(10-5)" />
                  <BlockMath math="= 31{,}4 + 15{,}7 + 10 = \boxed{57{,}1 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(236,72,153,.1)", borderColor: "rgba(236,72,153,.35)" }}>
                      <p className="text-pink-300 text-xs font-bold">✅ Luas Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">117,75 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">57,1 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 8 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(245,158,11,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh8" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-amber-400"
              title="✏️ Contoh 8 — Bintang 4 Titik dari Busur dalam Persegi 14 cm (π = 22/7)"
              accent="rgba(245,158,11,.12)" />
            {open.includes("contoh8") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(245,158,11,.1)", borderColor: "rgba(245,158,11,.35)" }}>
                  <p className="text-amber-300 font-bold text-xs uppercase tracking-wide mb-2">⭐ Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Di dalam persegi bersisi 14 cm, dari keempat sudutnya dibuat busur seperempat lingkaran (jari-jari = 14 cm). Keempat busur tersebut membentuk bintang 4 titik di tengah persegi. Hitunglah luas daerah bintang yang diarsir! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG6 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> sisi persegi <InlineMath math="a = 14"/> cm, <InlineMath math="r = 14"/> cm
                  </p>
                  <p className="font-body text-xs text-white/60">Luas bintang = Luas persegi − 4 × segmen lingkaran di sudut</p>
                  <p className="font-body text-xs text-white/60">Setiap sudut terpotong oleh <em>dua busur</em>, sehingga tersisa segmen berbentuk "mata" di tiap sudut.</p>
                  <p className="font-body text-sm text-white/80">Gunakan: <InlineMath math="L_{\text{bintang}} = (\pi - 2) \times r^2"/></p>
                  <BlockMath math="L_{\text{bintang}} = \left(\tfrac{22}{7} - 2\right) \times 14^2 = \tfrac{8}{7} \times 196 = \boxed{224 \text{ cm}^2}" />
                  <div className="rounded-xl p-3 border mt-1" style={{ background: "rgba(245,158,11,.07)", borderColor: "rgba(245,158,11,.25)" }}>
                    <p className="text-amber-200 text-xs font-body">💡 <strong>Rumus alternatif:</strong> <InlineMath math="L = 4 \times L_{\text{sektor}} - 2 \times L_{\text{persegi}} = 4 \times \tfrac{1}{4}\pi r^2 - 2r^2 = r^2(\pi-2)"/></p>
                  </div>
                  <div className="rounded-lg p-3 border text-center mt-2" style={{ background: "rgba(245,158,11,.1)", borderColor: "rgba(245,158,11,.35)" }}>
                    <p className="text-amber-300 text-xs font-bold">✅ Luas Bintang</p>
                    <p className="text-white text-sm font-bold mt-1">224 cm²</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 9 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(14,165,233,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh9" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-sky-400"
              title="✏️ Contoh 9 — Tiga Busur Lengkung: Busur Besar Dikurangi 2 Busur Kecil (π = 22/7)"
              accent="rgba(14,165,233,.12)" />
            {open.includes("contoh9") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                  <p className="text-sky-300 font-bold text-xs uppercase tracking-wide mb-2">🌊 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Daerah arsiran berbentuk "tiga busur" dalam persegi panjang 28 cm × 14 cm. Satu setengah lingkaran besar (R = 14 cm) berada di atas, lalu dua setengah lingkaran kecil (r = 7 cm) dipotong dari bawahnya. Hitunglah <strong>(a)</strong> luas arsiran dan <strong>(b)</strong> keliling arsiran! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG7 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> <InlineMath math="R = 14"/> cm (besar), <InlineMath math="r = 7"/> cm (kecil × 2)
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas daerah arsiran:</strong></p>
                  <BlockMath math="L = \tfrac{1}{2}\pi R^2 - 2 \times \tfrac{1}{2}\pi r^2 = \tfrac{1}{2}\pi(R^2 - 2r^2)" />
                  <BlockMath math="= \tfrac{1}{2} \times \tfrac{22}{7} \times (196 - 98) = \tfrac{11}{7} \times 98 = \boxed{154 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling daerah arsiran:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Busur besar + 2 busur kecil (berhadapan arah):</p>
                  <BlockMath math="K = \pi R + 2\pi r = \tfrac{22}{7} \times 14 + 2 \times \tfrac{22}{7} \times 7" />
                  <BlockMath math="= 44 + 44 = \boxed{88 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                      <p className="text-sky-300 text-xs font-bold">✅ Luas Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">154 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Arsiran</p>
                      <p className="text-white text-sm font-bold mt-1">88 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 10 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(20,184,166,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh10" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-teal-400"
              title="✏️ Contoh 10 — Daun Diagonal dalam Persegi 7 cm (π = 22/7)"
              accent="rgba(20,184,166,.12)" />
            {open.includes("contoh10") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                  <p className="text-teal-300 font-bold text-xs uppercase tracking-wide mb-2">🍃 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Di dalam persegi bersisi 7 cm, dua busur seperempat lingkaran (jari-jari = 7 cm) ditarik dari dua sudut yang berseberangan sehingga membentuk "daun" di tengah. Hitunglah <strong>(a)</strong> luas daun (daerah arsiran) dan <strong>(b)</strong> kelilingnya! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG8 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> sisi persegi <InlineMath math="a = r = 7"/> cm.
                  </p>
                  <p className="font-body text-xs text-white/60">Luas daun = 2 × (luas sektor − luas segitiga):</p>
                  <BlockMath math="L_{\text{daun}} = 2\left(\tfrac{1}{4}\pi r^2 - \tfrac{1}{2}r^2\right) = r^2\left(\tfrac{\pi}{2} - 1\right)" />
                  <BlockMath math="= 49 \times \left(\tfrac{22}{14} - 1\right) = 49 \times \tfrac{4}{7} = \boxed{28 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling daun:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Dua busur seperempat lingkaran:</p>
                  <BlockMath math="K = 2 \times \tfrac{1}{4}(2\pi r) = \pi r = \tfrac{22}{7} \times 7 = \boxed{22 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                      <p className="text-teal-300 text-xs font-bold">✅ Luas Daun</p>
                      <p className="text-white text-sm font-bold mt-1">28 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Daun</p>
                      <p className="text-white text-sm font-bold mt-1">22 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 11 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh11" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 11 — Bunga 4 Kelopak dalam Persegi 14 cm (π = 22/7)"
              accent="rgba(249,115,22,.12)" />
            {open.includes("contoh11") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                  <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🌸 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Di dalam persegi bersisi 14 cm, dari keempat sudutnya dibuat busur seperempat lingkaran (r = 14 cm). Pasangan busur yang saling berpotongan membentuk 4 buah kelopak bunga. Hitunglah luas total keempat kelopak yang diarsir! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG9 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> sisi persegi <InlineMath math="a = 14"/> cm, <InlineMath math="r = 14"/> cm.
                  </p>
                  <p className="font-body text-xs text-white/60">Setiap kelopak = irisan dua sektor yang berpusat di sudut-sudut berdekatan.</p>
                  <p className="font-body text-xs text-white/60">Luas 1 kelopak = <InlineMath math="r^2\!\left(\tfrac{\pi}{2}-1\right)"/> (sama rumusnya dengan daun diagonal):</p>
                  <BlockMath math="L_{\text{1 kelopak}} = r^2\!\left(\tfrac{\pi}{2}-1\right) = 196 \times \tfrac{4}{7} = 112 \text{ cm}^2" />
                  <p className="font-body text-xs text-white/60">Namun dalam susunan ini ada 4 kelopak, masing-masing dihitung sebagai irisan dua busur berdekatan:</p>
                  <BlockMath math="L_{\text{4 kelopak}} = 4 \times 28 = \boxed{112 \text{ cm}^2}" />
                  <p className="font-body text-xs text-white/50 italic">*Tiap kelopak dihitung dengan r = 14 cm (sisi penuh), luas 1 kelopak = 28 cm²</p>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                    <p className="text-orange-300 text-xs font-bold">✅ Luas 4 Kelopak</p>
                    <p className="text-white text-sm font-bold mt-1">112 cm²</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 12 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(139,92,246,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh12" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400"
              title="✏️ Contoh 12 — Sektor Siku-Siku (¼ Lingkaran) r = 10 cm (π = 3,14)"
              accent="rgba(139,92,246,.12)" />
            {open.includes("contoh12") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(139,92,246,.1)", borderColor: "rgba(139,92,246,.35)" }}>
                  <p className="text-violet-300 font-bold text-xs uppercase tracking-wide mb-2">🔮 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah lingkaran berjari-jari 10 cm dengan pusat O. Daerah arsiran adalah sektor (juring) berbentuk sudut siku-siku (90°). Hitunglah <strong>(a)</strong> luas sektor yang diarsir dan <strong>(b)</strong> kelilingnya! <InlineMath math="(\pi = 3{,}14)"/>
                  </p>
                </div>
                <SoalSVG10 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> <InlineMath math="r = 10"/> cm, sudut sektor = 90° = <InlineMath math="\tfrac{1}{4}"/> lingkaran penuh.
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas sektor:</strong></p>
                  <BlockMath math="L_{\text{sektor}} = \tfrac{90°}{360°} \times \pi r^2 = \tfrac{1}{4} \times 3{,}14 \times 100" />
                  <BlockMath math="= \tfrac{314}{4} = \boxed{78{,}5 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling sektor:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Dua jari-jari (OA dan OB) + panjang busur AB:</p>
                  <BlockMath math="K = 2r + \tfrac{1}{4}(2\pi r) = 2(10) + \tfrac{1}{2} \times 3{,}14 \times 10" />
                  <BlockMath math="= 20 + 15{,}7 = \boxed{35{,}7 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(139,92,246,.1)", borderColor: "rgba(139,92,246,.35)" }}>
                      <p className="text-violet-300 text-xs font-bold">✅ Luas Sektor</p>
                      <p className="text-white text-sm font-bold mt-1">78,5 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Sektor</p>
                      <p className="text-white text-sm font-bold mt-1">35,7 cm</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(251,191,36,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400"
              title="📌 Rangkuman — Peta Rumus Daerah Arsiran"
              accent="rgba(251,191,36,.12)" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      color: "#f97316", emoji: "🔶", title: "Lingkaran Dalam Persegi",
                      luas: "L = a^2 - \\pi r^2",
                      keliling: "K = 4a + 2\\pi r",
                    },
                    {
                      color: "#06b6d4", emoji: "🔵", title: "Persegi Panjang + ½ Lingkaran",
                      luas: "L = p \\cdot t + \\tfrac{1}{2}\\pi r^2",
                      keliling: "K = 2t + p + \\pi r",
                    },
                    {
                      color: "#a855f7", emoji: "🔺", title: "Segitiga − Lingkaran Dalam",
                      luas: "L = L_\\triangle - \\pi r^2",
                      keliling: "K = (a+b+c) + 2\\pi r",
                    },
                    {
                      color: "#22c55e", emoji: "🟩", title: "Persegi Panjang − Lingkaran",
                      luas: "L = p \\cdot l - \\pi r^2",
                      keliling: "K = 2(p+l) + 2\\pi r",
                    },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl p-3 border space-y-2"
                      style={{ background: `${c.color}12`, borderColor: `${c.color}38` }}>
                      <p className="font-bold text-xs" style={{ color: c.color }}>{c.emoji} {c.title}</p>
                      <div className="text-[11px] text-white/50">Luas:</div>
                      <BlockMath math={c.luas} />
                      <div className="text-[11px] text-white/50">Keliling:</div>
                      <BlockMath math={c.keliling} />
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4 border"
                  style={{ background: "linear-gradient(135deg,rgba(251,191,36,.1),rgba(249,115,22,.08))", borderColor: "rgba(251,191,36,.3)" }}>
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    🚀 <strong>Tips Bintang:</strong> Untuk semua soal daerah arsiran, ikuti langkah ini: <br/>
                    <span className="text-cyan-300">① Gambar sketsa</span> →
                    <span className="text-green-300"> ② Identifikasi bangun</span> →
                    <span className="text-orange-300"> ③ Tentukan operasi (+/−)</span> →
                    <span className="text-violet-300"> ④ Hitung luas dan keliling terpisah</span>.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KaitanBangunDatarLainnyaPage;
