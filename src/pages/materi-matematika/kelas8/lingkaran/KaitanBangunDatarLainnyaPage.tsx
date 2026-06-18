import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical, Star } from "lucide-react";
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
  <svg viewBox="0 0 320 200" className="w-full max-w-sm mx-auto" aria-label="Dumbbell arsiran">
    <defs>
      <style>{`
        @keyframes db1{0%,100%{opacity:.42;}50%{opacity:.75;}}
        @keyframes dbg{0%,100%{filter:drop-shadow(0 0 7px #f97316);}50%{filter:drop-shadow(0 0 18px #f97316);}}
        .db-fill{animation:db1 2.4s ease-in-out infinite;}
        .db-out{animation:dbg 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Arsiran fill: rectangle minus two INWARD semicircles (evenodd rule) */}
    <path
      fillRule="evenodd"
      fill="#f97316"
      className="db-fill"
      d="M40,35 L280,35 L280,155 L40,155 Z M40,35 A60,60,0,0,1,40,155 Z M280,35 A60,60,0,0,0,280,155 Z"
    />
    {/* Rectangle outline */}
    <rect x="40" y="35" width="240" height="120" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round" className="db-out"/>
    {/* Left inward-semicircle arc outline */}
    <path d="M40,35 A60,60,0,0,1,40,155" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2"/>
    {/* Right inward-semicircle arc outline */}
    <path d="M280,35 A60,60,0,0,0,280,155" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2"/>
    {/* Center dot of left semicircle */}
    <circle cx="40" cy="95" r="3.5" fill="#22d3ee"/>
    {/* Radius line: center (40,95) → rightmost point of inward cut (100,95) */}
    <line x1="40" y1="95" x2="100" y2="95" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="4 2" opacity=".95"/>
    {/* r = 7 cm label — centered above the radius line */}
    <text x="70" y="82" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r = 7 cm</text>
    {/* Dimension 28 cm */}
    <text x="160" y="22" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm</text>
    {/* Dimension 14 cm */}
    <line x1="296" y1="35" x2="296" y2="155" stroke="#4ade80" strokeWidth="1.2" opacity=".7"/>
    <text x="312" y="95" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(90,312,95)">14 cm</text>
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
    {/* Big semicircle outline — same color as small */}
    <path d="M30,140 A110,110,0,0,1,250,140" fill="none" stroke="#ec4899" strokeWidth="2.5" className="sn5-out"/>
    {/* Small semicircle outline — same color as big */}
    <path d="M85,140 A55,55,0,0,1,195,140" fill="none" stroke="#ec4899" strokeWidth="2"/>
    {/* Diameter base line */}
    <line x1="30" y1="140" x2="250" y2="140" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="5 3" opacity=".6"/>
    {/* Center dot */}
    <circle cx="140" cy="140" r="3.5" fill="#ec4899"/>
    {/* R=10 clear radius line from center to right end */}
    <line x1="140" y1="140" x2="250" y2="140" stroke="#fbbf24" strokeWidth="2" opacity=".9"/>
    <text x="183" y="132" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">R = 10</text>
    <circle cx="140" cy="140" r="3" fill="#fbbf24"/>
    <circle cx="250" cy="140" r="3" fill="#fbbf24"/>
    {/* r=5 inner label */}
    <line x1="140" y1="140" x2="85" y2="140" stroke="#f9a8d4" strokeWidth="1.2" strokeDasharray="3 2" opacity=".7"/>
    <text x="103" y="130" fill="#f9a8d4" fontSize="9" fontFamily="monospace">r=5</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C6 – Persegi 14 cm, 4 busur seperempat lingkaran r=14cm dari
   setiap sudut. Arsiran = bintang 4 titik di DALAM (irisan 4 busur).
   Square TL(20,20)→BR(240,240), side=220px. r=220px (full side).
   4 arc tips: top(130,49.5) right(210.5,130) bottom(130,210.5) left(49.5,130)
   All star arcs: sweep=1 (CW on screen), r=220.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG6 = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="4-pointed star from corner arcs">
    <defs>
      <style>{`
        @keyframes st6{0%,100%{opacity:.45;}50%{opacity:.82;}}
        @keyframes st6g{0%,100%{filter:drop-shadow(0 0 8px #f59e0b);}50%{filter:drop-shadow(0 0 22px #f59e0b);}}
        .st6-fill{animation:st6 2.1s ease-in-out infinite;}
        .st6-out{animation:st6g 2.1s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Square outline */}
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="st6-out"/>
    {/* 4 corner arcs as faint guides (r = full side = 220px) */}
    {/* Arc from TL(20,20): TR→BL, sweep=1, bows toward BR */}
    <path d="M240,20 A220,220,0,0,1,20,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    {/* Arc from TR(240,20): TL→BR, sweep=0, bows toward BL */}
    <path d="M20,20 A220,220,0,0,0,240,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    {/* Arc from BL(20,240): TL→BR, sweep=1, bows toward TR */}
    <path d="M20,20 A220,220,0,0,1,240,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    {/* Arc from BR(240,240): TR→BL, sweep=0, bows toward TL */}
    <path d="M240,20 A220,220,0,0,0,20,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    {/* Inner star: irisan keempat busur sudut (all sweep=1, r=220)
        Tips: top(130,49.5) right(210.5,130) bottom(130,210.5) left(49.5,130) */}
    <path
      d="M130,49.5 A220,220,0,0,1,210.5,130 A220,220,0,0,1,130,210.5 A220,220,0,0,1,49.5,130 A220,220,0,0,1,130,49.5 Z"
      fill="#f59e0b" className="st6-fill"/>
    {/* Corner dots */}
    <circle cx="20"  cy="20"  r="3" fill="#fde68a" opacity=".7"/>
    <circle cx="240" cy="20"  r="3" fill="#fde68a" opacity=".7"/>
    <circle cx="20"  cy="240" r="3" fill="#fde68a" opacity=".7"/>
    <circle cx="240" cy="240" r="3" fill="#fde68a" opacity=".7"/>
    {/* Star tip dots */}
    <circle cx="130"   cy="49.5"  r="2.5" fill="#fff" opacity=".75"/>
    <circle cx="210.5" cy="130"   r="2.5" fill="#fff" opacity=".75"/>
    <circle cx="130"   cy="210.5" r="2.5" fill="#fff" opacity=".75"/>
    <circle cx="49.5"  cy="130"   r="2.5" fill="#fff" opacity=".75"/>
    {/* Dimension labels */}
    <text x="130" y="257" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="6" y="130" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-90,6,130)">14 cm</text>
    {/* r label along top side */}
    <line x1="20" y1="13" x2="240" y2="13" stroke="#fde68a" strokeWidth="1" opacity=".5"/>
    <text x="130" y="11" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">r = 14 cm</text>
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
    {/* Shaded region: big arch - 2 small arches (evenodd) — small arches sweep=1 (upward) */}
    <path fillRule="evenodd" fill="#0ea5e9" className="ar7-fill"
      d="M20,160 A120,120,0,0,1,260,160 Z M20,160 A60,60,0,0,1,140,160 Z M140,160 A60,60,0,0,1,260,160 Z"/>
    {/* Big arch outline */}
    <path d="M20,160 A120,120,0,0,1,260,160" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="ar7-out"/>
    {/* Two small arch outlines — same color as big arch, sweep=1 (upward) */}
    <path d="M20,160 A60,60,0,0,1,140,160" fill="none" stroke="#38bdf8" strokeWidth="2"/>
    <path d="M140,160 A60,60,0,0,1,260,160" fill="none" stroke="#38bdf8" strokeWidth="2"/>
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
   SVG C8 – Persegi 14 cm, 4 seperempat lingkaran r=7 cm di setiap
   sudut, saling bersinggungan di tengah sisi. Arsiran = daerah tengah
   (area persegi TIDAK tertutup oleh keempat busur).
   Square TL(20,20)→BR(240,240), side=220px. r=110px (=7cm).
   Midpoints: top(130,20) right(240,130) bottom(130,240) left(20,130)
   Center region bounded by 4 clockwise arcs from each corner.
═══════════════════════════════════════════════════════════════════ */
const ContohDelapanSVG = () => (
  <svg viewBox="0 0 270 270" className="w-full max-w-xs mx-auto" aria-label="Persegi dengan 4 seperempat lingkaran di sudut, arsiran tengah">
    <defs>
      <style>{`
        @keyframes lf8{0%,100%{opacity:.48;}50%{opacity:.82;}}
        @keyframes lf8g{0%,100%{filter:drop-shadow(0 0 8px #f59e0b);}50%{filter:drop-shadow(0 0 22px #f59e0b);}}
        .lf8-fill{animation:lf8 2.4s ease-in-out infinite;}
        .lf8-out{animation:lf8g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* ── 4 quarter-circle sectors (faint fill, dashed arc outline) ── */}
    {/* TL: center(20,20), arc from (130,20) to (20,130), CW sweep=1 */}
    <path d="M20,20 L130,20 A110,110,0,0,1,20,130 Z"
      fill="rgba(148,163,184,.13)" stroke="none"/>
    <path d="M130,20 A110,110,0,0,1,20,130"
      fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="5 3" opacity=".7"/>

    {/* TR: center(240,20), arc from (130,20) to (240,130), CCW sweep=0 */}
    <path d="M240,20 L130,20 A110,110,0,0,0,240,130 Z"
      fill="rgba(148,163,184,.13)" stroke="none"/>
    <path d="M130,20 A110,110,0,0,0,240,130"
      fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="5 3" opacity=".7"/>

    {/* BL: center(20,240), arc from (20,130) to (130,240), CW sweep=1 */}
    <path d="M20,240 L20,130 A110,110,0,0,1,130,240 Z"
      fill="rgba(148,163,184,.13)" stroke="none"/>
    <path d="M20,130 A110,110,0,0,1,130,240"
      fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="5 3" opacity=".7"/>

    {/* BR: center(240,240), arc from (130,240) to (240,130), CCW sweep=0 */}
    <path d="M240,240 L130,240 A110,110,0,0,0,240,130 Z"
      fill="rgba(148,163,184,.13)" stroke="none"/>
    <path d="M130,240 A110,110,0,0,0,240,130"
      fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="5 3" opacity=".7"/>

    {/* ── Center shaded region ── */}
    {/* Bounded by 4 inward-curving arcs, one from each corner */}
    {/* M top-mid → TL arc CW → left-mid → BL arc CW → bottom-mid → BR arc CCW → right-mid → TR arc CCW → top-mid */}
    <path
      d="M130,20 A110,110,0,0,1,20,130 A110,110,0,0,1,130,240 A110,110,0,0,1,240,130 A110,110,0,0,1,130,20 Z"
      fill="#f59e0b" className="lf8-fill"
    />
    <path
      d="M130,20 A110,110,0,0,1,20,130 A110,110,0,0,1,130,240 A110,110,0,0,1,240,130 A110,110,0,0,1,130,20 Z"
      fill="none" stroke="#fbbf24" strokeWidth="2.5" className="lf8-out"
    />

    {/* ── Square outline ── */}
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#64748b" strokeWidth="2.5"/>

    {/* ── Tangent-point dots at side midpoints ── */}
    <circle cx="130" cy="20"  r="3.5" fill="#22d3ee"/>
    <circle cx="20"  cy="130" r="3.5" fill="#22d3ee"/>
    <circle cx="130" cy="240" r="3.5" fill="#22d3ee"/>
    <circle cx="240" cy="130" r="3.5" fill="#22d3ee"/>

    {/* ── Radius label (TL corner to top midpoint) ── */}
    <line x1="20" y1="20" x2="130" y2="20" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 2" opacity=".8"/>
    <text x="75" y="15" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r = 7 cm</text>

    {/* ── Corner dot TL ── */}
    <circle cx="20"  cy="20"  r="3" fill="#64748b"/>
    <circle cx="240" cy="20"  r="3" fill="#64748b"/>
    <circle cx="20"  cy="240" r="3" fill="#64748b"/>
    <circle cx="240" cy="240" r="3" fill="#64748b"/>

    {/* ── Arsiran label ── */}
    <text x="130" y="134" fill="#fde68a" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Arsiran</text>

    {/* ── Dimension labels ── */}
    <text x="130" y="260" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="7"   y="134" fill="#94a3b8" fontSize="10" fontFamily="monospace" transform="rotate(-90,7,134)">14 cm</text>
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
        @keyframes lf8b{0%,100%{opacity:.45;}50%{opacity:.78;}}
        @keyframes lf8bg{0%,100%{filter:drop-shadow(0 0 7px #14b8a6);}50%{filter:drop-shadow(0 0 18px #14b8a6);}}
        .lf8b-fill{animation:lf8b 2.4s ease-in-out infinite;}
        .lf8b-out{animation:lf8bg 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <rect x="30" y="20" width="190" height="190" fill="none" stroke="#94a3b8" strokeWidth="2" opacity=".6"/>
    <path d="M30,20 A190,190,0,0,1,220,210 A190,190,0,0,1,30,20 Z"
      fill="#14b8a6" className="lf8b-fill"/>
    <path d="M30,20 A190,190,0,0,1,220,210 A190,190,0,0,1,30,20 Z"
      fill="none" stroke="#2dd4bf" strokeWidth="2.5" className="lf8b-out"/>
    <path d="M30,20 A190,190,0,0,1,220,210" fill="none" stroke="#2dd4bf" strokeWidth="2.5"/>
    <path d="M220,210 A190,190,0,0,1,30,20" fill="none" stroke="#2dd4bf" strokeWidth="2.5"/>
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
    {/* Right triangle inside sector (O, A, B) — lighter fill underneath */}
    <polygon points="110,120 215,120 110,225" fill="rgba(196,181,253,.22)"/>
    {/* Shaded quarter sector (right lower quarter) */}
    <path d="M110,120 L215,120 A105,105,0,0,1,110,225 Z"
      fill="#8b5cf6" className="sc10-fill"/>
    <path d="M110,120 L215,120 A105,105,0,0,1,110,225 Z"
      fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round" className="sc10-out"/>
    {/* Hypotenuse AB (the triangle inside the sector) */}
    <line x1="215" y1="120" x2="110" y2="225" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3" opacity=".9"/>
    {/* Right-angle mark at O */}
    <polyline points="128,120 128,138 110,138" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity=".8"/>
    {/* Center */}
    <circle cx="110" cy="120" r="4" fill="#8b5cf6"/>
    <text x="93" y="117" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    {/* Vertex labels A and B */}
    <text x="219" y="117" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="96" y="238" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    {/* Radius label */}
    <line x1="110" y1="120" x2="215" y2="120" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".8"/>
    <text x="152" y="112" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">10 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C11 – 4 daun (seperti contoh 10) disusun menjadi bunga
   Setiap daun = lensa dari 2 busur ¼ lingkaran, seperti pada SVG C8.
   2×2 grid tiap kotak 110×110 (=7cm), center (130,130), grid 220×220.
   Daun TL: dari sudut (20,20) → (130,130)
   Daun TR: dari sudut (240,20) → (130,130)
   Daun BL: dari sudut (20,240) → (130,130)
   Daun BR: dari sudut (240,240) → (130,130)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG11 = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="4 daun bunga dalam persegi">
    <defs>
      <style>{`
        @keyframes fl11{0%,100%{opacity:.45;}50%{opacity:.78;}}
        @keyframes fl11g{0%,100%{filter:drop-shadow(0 0 8px #14b8a6);}50%{filter:drop-shadow(0 0 20px #14b8a6);}}
        .fl11-fill{animation:fl11 2.2s ease-in-out infinite;}
        .fl11-out{animation:fl11g 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Outer bounding square 14cm × 14cm */}
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" opacity=".5"/>
    {/* Grid dividers (show 4 sub-squares, each = 7cm) */}
    <line x1="130" y1="20" x2="130" y2="240" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity=".4"/>
    <line x1="20" y1="130" x2="240" y2="130" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity=".4"/>

    {/* ── 4 daun fills ── */}
    {/* Daun TL: (20,20)↔(130,130) — arc centres at (130,20) and (20,130) */}
    <path d="M20,20 A110,110,0,0,1,130,130 A110,110,0,0,1,20,20 Z"
      fill="#14b8a6" className="fl11-fill"/>
    {/* Daun TR: (240,20)↔(130,130) — arc centres at (130,20) and (240,130) */}
    <path d="M240,20 A110,110,0,0,0,130,130 A110,110,0,0,0,240,20 Z"
      fill="#14b8a6" className="fl11-fill"/>
    {/* Daun BL: (20,240)↔(130,130) — arc centres at (20,130) and (130,240) */}
    <path d="M20,240 A110,110,0,0,0,130,130 A110,110,0,0,0,20,240 Z"
      fill="#14b8a6" className="fl11-fill"/>
    {/* Daun BR: (240,240)↔(130,130) — arc centres at (240,130) and (130,240) */}
    <path d="M240,240 A110,110,0,0,1,130,130 A110,110,0,0,1,240,240 Z"
      fill="#14b8a6" className="fl11-fill"/>

    {/* ── 4 daun outlines ── */}
    <path d="M20,20 A110,110,0,0,1,130,130 A110,110,0,0,1,20,20 Z"
      fill="none" stroke="#2dd4bf" strokeWidth="2" className="fl11-out"/>
    <path d="M240,20 A110,110,0,0,0,130,130 A110,110,0,0,0,240,20 Z"
      fill="none" stroke="#2dd4bf" strokeWidth="2"/>
    <path d="M20,240 A110,110,0,0,0,130,130 A110,110,0,0,0,20,240 Z"
      fill="none" stroke="#2dd4bf" strokeWidth="2"/>
    <path d="M240,240 A110,110,0,0,1,130,130 A110,110,0,0,1,240,240 Z"
      fill="none" stroke="#2dd4bf" strokeWidth="2"/>

    {/* Corner dots */}
    <circle cx="20"  cy="20"  r="3.5" fill="#fde68a"/>
    <circle cx="240" cy="20"  r="3.5" fill="#fde68a"/>
    <circle cx="20"  cy="240" r="3.5" fill="#fde68a"/>
    <circle cx="240" cy="240" r="3.5" fill="#fde68a"/>
    {/* Center dot */}
    <circle cx="130" cy="130" r="4" fill="#2dd4bf"/>

    {/* Dimension labels */}
    <text x="128" y="257" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="6" y="134" fill="#2dd4bf" fontSize="10" fontFamily="monospace" transform="rotate(-90,6,134)">14 cm</text>
    {/* 7cm half-side labels */}
    <text x="75"  y="14" fill="#fde68a" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <text x="185" y="14" fill="#fde68a" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
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
   SVG C13 – Es Krim: setengah lingkaran (r=10 cm) + segitiga
   (alas=20 cm, tinggi=24 cm, sisi miring=26 cm).
   ViewBox 0 0 280 360. Semicircle center (140,100) r=90.
   Triangle: (50,100)–(230,100)–(140,316).
   Scale: 10 cm → 90 px, 24 cm → 216 px, 26 cm → 234 px.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG13 = () => (
  <svg viewBox="0 0 280 360" className="w-full max-w-xs mx-auto" aria-label="Es krim: setengah lingkaran di atas segitiga">
    <defs>
      <style>{`
        @keyframes ek13{0%,100%{opacity:.42;}50%{opacity:.72;}}
        @keyframes ek13g{0%,100%{filter:drop-shadow(0 0 8px #f97316);}50%{filter:drop-shadow(0 0 22px #f97316);}}
        @keyframes ek13d{to{stroke-dashoffset:-16;}}
        .ek13-fill{animation:ek13 2.4s ease-in-out infinite;}
        .ek13-out{animation:ek13g 2.4s ease-in-out infinite;}
        .ek13-dash{animation:ek13d 1.2s linear infinite;}
      `}</style>
    </defs>

    {/* ── Combined shape fill ── */}
    {/* Semicircle on top + triangle below, joined at diameter line */}
    <path
      d="M50,100 A90,90,0,0,1,230,100 L140,316 Z"
      fill="rgba(249,115,22,.18)" className="ek13-fill"
    />
    <path
      d="M50,100 A90,90,0,0,1,230,100 L140,316 Z"
      fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round" className="ek13-out"
    />

    {/* ── Diameter line (hidden boundary between semicircle & triangle) ── */}
    <line x1="50" y1="100" x2="230" y2="100"
      stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" opacity=".55"/>

    {/* ── Height of triangle (dashed) ── */}
    <line x1="140" y1="100" x2="140" y2="316"
      stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 3" className="ek13-dash" opacity=".8"/>
    {/* Right-angle mark at top of height */}
    <polyline points="140,100 152,100 152,112" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity=".7"/>

    {/* ── Labels ── */}
    {/* Diameter: 20 cm above semicircle */}
    <text x="140" y="22" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">20 cm</text>
    <line x1="50" y1="28" x2="230" y2="28" stroke="#fbbf24" strokeWidth="1.2" opacity=".5"/>
    <line x1="50" y1="24" x2="50" y2="32" stroke="#fbbf24" strokeWidth="1.2" opacity=".5"/>
    <line x1="230" y1="24" x2="230" y2="32" stroke="#fbbf24" strokeWidth="1.2" opacity=".5"/>

    {/* Radius label inside semicircle */}
    <line x1="140" y1="100" x2="230" y2="100" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="4 2" opacity=".6"/>
    <text x="188" y="95" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">r=10</text>
    <circle cx="140" cy="100" r="3.5" fill="#22d3ee"/>

    {/* Height: 24 cm (right side of dashed line) */}
    <text x="148" y="214" fill="#22d3ee" fontSize="11" fontFamily="monospace" fontWeight="bold"
      transform="rotate(90,148,214)">24 cm</text>

    {/* Left slant: 26 cm */}
    <text x="68" y="222" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold"
      transform="rotate(67,68,222)">26 cm</text>

    {/* Tip dot */}
    <circle cx="140" cy="316" r="3" fill="#fb923c" opacity=".8"/>

    {/* Dimension bracket: 20 cm top */}
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C14 – Trapesium simetris (a₁=28, a₂=42, h=14) + setengah
   lingkaran (r=14) di atas. Scale: 5px/cm.
   Bottom: (35,210)-(245,210) = 210px = 42cm
   Top (diameter): (70,140)-(210,140) = 140px = 28cm
   Trapezoid height: 70px = 14cm. Semicircle center (140,140) r=70.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG14 = () => (
  <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto" aria-label="Trapesium plus setengah lingkaran di atas">
    <defs>
      <style>{`
        @keyframes sv14f{0%,100%{opacity:.38;}50%{opacity:.68;}}
        @keyframes sv14g{0%,100%{filter:drop-shadow(0 0 7px #0ea5e9);}50%{filter:drop-shadow(0 0 18px #0ea5e9);}}
        .sv14-fill{animation:sv14f 2.4s ease-in-out infinite;}
        .sv14-out{animation:sv14g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Combined fill: semicircle on top + trapezoid below */}
    <path d="M70,140 A70,70,0,0,0,210,140 L245,210 L35,210 Z"
      fill="rgba(14,165,233,.2)" className="sv14-fill"/>
    <path d="M70,140 A70,70,0,0,0,210,140 L245,210 L35,210 Z"
      fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinejoin="round" className="sv14-out"/>
    {/* Dashed diameter line (boundary between trapezoid & semicircle) */}
    <line x1="70" y1="140" x2="210" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" opacity=".55"/>
    {/* Label: 28 cm — diameter of semicircle */}
    <text x="140" y="83" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm</text>
    <line x1="70" y1="88" x2="210" y2="88" stroke="#fbbf24" strokeWidth="1" opacity=".45"/>
    <line x1="70" y1="84" x2="70" y2="92" stroke="#fbbf24" strokeWidth="1" opacity=".45"/>
    <line x1="210" y1="84" x2="210" y2="92" stroke="#fbbf24" strokeWidth="1" opacity=".45"/>
    {/* Label: 14 cm — height of trapezoid */}
    <line x1="22" y1="140" x2="22" y2="210" stroke="#4ade80" strokeWidth="1.3" opacity=".7"/>
    <line x1="18" y1="140" x2="26" y2="140" stroke="#4ade80" strokeWidth="1" opacity=".6"/>
    <line x1="18" y1="210" x2="26" y2="210" stroke="#4ade80" strokeWidth="1" opacity=".6"/>
    <text x="10" y="178" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold"
      textAnchor="middle" transform="rotate(-90,10,178)">14 cm</text>
    {/* Label: 42 cm — bottom of trapezoid */}
    <text x="140" y="228" fill="#0ea5e9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">42 cm</text>
    {/* Center dot of semicircle */}
    <circle cx="140" cy="140" r="3" fill="#0ea5e9" opacity=".7"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C15 – Seperempat lingkaran r=14 cm (sektor sudut siku-siku).
   Corner at (25,170), r=130px (=14cm → ~9.3px/cm).
   Arc from (155,170) to (25,40). Sweep=0 (CCW = upward-left).
═══════════════════════════════════════════════════════════════════ */
const SoalSVG15 = () => (
  <svg viewBox="0 0 195 205" className="w-full max-w-xs mx-auto" aria-label="Seperempat lingkaran">
    <defs>
      <style>{`
        @keyframes sv15f{0%,100%{opacity:.42;}50%{opacity:.76;}}
        @keyframes sv15g{0%,100%{filter:drop-shadow(0 0 7px #a855f7);}50%{filter:drop-shadow(0 0 20px #a855f7);}}
        .sv15-fill{animation:sv15f 2.3s ease-in-out infinite;}
        .sv15-out{animation:sv15g 2.3s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Quarter-circle sector fill */}
    <path d="M25,170 L155,170 A130,130,0,0,0,25,40 Z"
      fill="#a855f7" className="sv15-fill"/>
    <path d="M25,170 L155,170 A130,130,0,0,0,25,40 Z"
      fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinejoin="round" className="sv15-out"/>
    {/* Right-angle mark at corner (25,170) */}
    <polyline points="43,170 43,152 25,152" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity=".8"/>
    {/* Center dot */}
    <circle cx="25" cy="170" r="3.5" fill="#a855f7"/>
    {/* Radius labels */}
    <text x="88" y="190" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="8" y="108" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold"
      textAnchor="middle" transform="rotate(-90,8,108)">14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C16 – Setengah cincin (half-annulus): outer R=14→120px,
   inner r=7→60px. Center (140,155). ViewBox 0 0 280 175.
   Even-odd fill: outer half-disk minus inner half-disk.
═══════════════════════════════════════════════════════════════════ */
const SoalSVG16 = () => (
  <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto" aria-label="Setengah cincin half-annulus">
    <defs>
      <style>{`
        @keyframes sv16f{0%,100%{opacity:.42;}50%{opacity:.74;}}
        @keyframes sv16g{0%,100%{filter:drop-shadow(0 0 8px #f97316);}50%{filter:drop-shadow(0 0 20px #f97316);}}
        .sv16-fill{animation:sv16f 2.5s ease-in-out infinite;}
        .sv16-out{animation:sv16g 2.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Half-annulus fill via evenodd: outer half-disk minus inner half-disk */}
    <path fillRule="evenodd" fill="#f97316" className="sv16-fill"
      d="M20,158 A120,120,0,0,0,260,158 Z M80,158 A60,60,0,0,0,200,158 Z"/>
    {/* Outer arc outline */}
    <path d="M20,158 A120,120,0,0,0,260,158" fill="none" stroke="#fb923c" strokeWidth="2.5" className="sv16-out"/>
    {/* Inner arc outline */}
    <path d="M80,158 A60,60,0,0,0,200,158" fill="none" stroke="#fb923c" strokeWidth="2"/>
    {/* Base lines */}
    <line x1="20" y1="158" x2="80" y2="158" stroke="#fb923c" strokeWidth="2.5"/>
    <line x1="200" y1="158" x2="260" y2="158" stroke="#fb923c" strokeWidth="2.5"/>
    {/* Center dot */}
    <circle cx="140" cy="158" r="3.5" fill="#fb923c"/>
    {/* R = 14 cm label */}
    <line x1="140" y1="158" x2="260" y2="158" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" opacity=".85"/>
    <text x="195" y="150" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">R = 14</text>
    {/* r = 7 cm label */}
    <line x1="140" y1="158" x2="80" y2="158" stroke="#67e8f9" strokeWidth="1.3" strokeDasharray="3 2" opacity=".8"/>
    <text x="98" y="170" fill="#67e8f9" fontSize="10" fontFamily="monospace">r = 7</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C17 – Setengah cincin (half-annulus): outer R=10→100px,
   inner r=5→50px. Center (130,128). ViewBox 0 0 260 145.
   "10 cm" label shows the outer radius (dashed horizontal line).
═══════════════════════════════════════════════════════════════════ */
const SoalSVG17 = () => (
  <svg viewBox="0 0 260 148" className="w-full max-w-xs mx-auto" aria-label="Setengah cincin half-annulus 10cm">
    <defs>
      <style>{`
        @keyframes sv17f{0%,100%{opacity:.42;}50%{opacity:.74;}}
        @keyframes sv17g{0%,100%{filter:drop-shadow(0 0 8px #ec4899);}50%{filter:drop-shadow(0 0 20px #ec4899);}}
        .sv17-fill{animation:sv17f 2.5s ease-in-out infinite;}
        .sv17-out{animation:sv17g 2.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Half-annulus fill via evenodd */}
    <path fillRule="evenodd" fill="#ec4899" className="sv17-fill"
      d="M30,130 A100,100,0,0,0,230,130 Z M80,130 A50,50,0,0,0,180,130 Z"/>
    {/* Outer arc */}
    <path d="M30,130 A100,100,0,0,0,230,130" fill="none" stroke="#f472b6" strokeWidth="2.5" className="sv17-out"/>
    {/* Inner arc */}
    <path d="M80,130 A50,50,0,0,0,180,130" fill="none" stroke="#f472b6" strokeWidth="2"/>
    {/* Base lines */}
    <line x1="30" y1="130" x2="80" y2="130" stroke="#f472b6" strokeWidth="2.5"/>
    <line x1="180" y1="130" x2="230" y2="130" stroke="#f472b6" strokeWidth="2.5"/>
    {/* Center dot */}
    <circle cx="130" cy="130" r="3.5" fill="#f472b6"/>
    {/* "10 cm" label = outer radius, dashed */}
    <line x1="130" y1="130" x2="230" y2="130" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" opacity=".9"/>
    <text x="176" y="122" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">10 cm</text>
    {/* r=5 inner label */}
    <text x="95" y="122" fill="#a5f3fc" fontSize="9" fontFamily="monospace">r=5</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C18 – Persegi 14 cm (side=180px) dikurangi dua seperempat
   lingkaran (r=7cm → 90px): satu di sudut TR, satu di sudut BL.
   Square (20,20)→(200,200). Mask cuts out the two corner sectors.
   Shaded area = 196 − 2×¼π(7²) = 119 cm² (π=22/7).
═══════════════════════════════════════════════════════════════════ */
const SoalSVG18 = () => (
  <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto" aria-label="Persegi minus dua seperempat lingkaran">
    <defs>
      <style>{`
        @keyframes sv18f{0%,100%{opacity:.42;}50%{opacity:.74;}}
        @keyframes sv18g{0%,100%{filter:drop-shadow(0 0 7px #14b8a6);}50%{filter:drop-shadow(0 0 18px #14b8a6);}}
        .sv18-fill{animation:sv18f 2.3s ease-in-out infinite;}
        .sv18-out{animation:sv18g 2.3s ease-in-out infinite;}
      `}</style>
      <mask id="sq18mask">
        <rect x="20" y="20" width="180" height="180" fill="white"/>
        {/* TR quarter: center(200,20), arc from (110,20) to (200,110), sweep=0 CCW */}
        <path d="M200,20 L110,20 A90,90,0,0,0,200,110 Z" fill="black"/>
        {/* BL quarter: center(20,200), arc from (20,110) to (110,200), sweep=1 CW */}
        <path d="M20,200 L20,110 A90,90,0,0,1,110,200 Z" fill="black"/>
      </mask>
    </defs>
    {/* Shaded region = square minus two quarter circles */}
    <rect x="20" y="20" width="180" height="180" fill="#14b8a6" mask="url(#sq18mask)" className="sv18-fill"/>
    {/* Square outline */}
    <rect x="20" y="20" width="180" height="180" fill="none" stroke="#2dd4bf" strokeWidth="2.5" className="sv18-out"/>
    {/* TR arc outline */}
    <path d="M110,20 A90,90,0,0,0,200,110" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" opacity=".7"/>
    {/* BL arc outline */}
    <path d="M20,110 A90,90,0,0,1,110,200" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" opacity=".7"/>
    {/* Label: 14 cm on right side */}
    <text x="208" y="114" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="bold"
      textAnchor="middle" transform="rotate(90,208,114)">14 cm</text>
    {/* Corner dots */}
    <circle cx="20"  cy="20"  r="2.5" fill="#64748b" opacity=".7"/>
    <circle cx="200" cy="20"  r="2.5" fill="#64748b" opacity=".7"/>
    <circle cx="20"  cy="200" r="2.5" fill="#64748b" opacity=".7"/>
    <circle cx="200" cy="200" r="2.5" fill="#64748b" opacity=".7"/>
    {/* Tick marks on sides */}
    <line x1="107" y1="16" x2="113" y2="24" stroke="#94a3b8" strokeWidth="1.2" opacity=".6"/>
    <line x1="107" y1="196" x2="113" y2="204" stroke="#94a3b8" strokeWidth="1.2" opacity=".6"/>
    <line x1="16" y1="107" x2="24" y2="113" stroke="#94a3b8" strokeWidth="1.2" opacity=".6"/>
    <line x1="196" y1="107" x2="204" y2="113" stroke="#94a3b8" strokeWidth="1.2" opacity=".6"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
const KaitanBangunDatarLainnyaPage = () => {
  const navigate = useNavigate();

  const SectionHeader = ({
    icon, iconColor, title, accent,
  }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string; accent?: string }) => (
    <div
      className="w-full flex items-center px-5 py-4"
      style={{
        background: `linear-gradient(to right, ${accent ?? "rgba(6,182,212,.12)"}, transparent)`,
        borderBottom: `1px solid ${accent ? accent.replace(", .12)", ", .3)") : "rgba(6,182,212,.3)"}`,
      }}
    >
      <span className={iconColor}>{icon}</span>
      <span className="font-body font-semibold text-white text-sm leading-snug ml-3">{title}</span>
    </div>
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
          </div>

          {/* ── CONTOH 6 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(6,182,212,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh6" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-cyan-400"
              title="✏️ Contoh 6 — Bangun Gabungan: Persegi Panjang + Setengah Lingkaran (π = 22/7)"
              accent="rgba(6,182,212,.12)" />
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
          </div>

          {/* ── CONTOH 3 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 3 — Persegi Panjang 28×14 Dikurangi Dua Setengah Lingkaran (π = 22/7)"
              accent="rgba(249,115,22,.12)" />
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
          </div>

          {/* ── CONTOH 7 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(236,72,153,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh7" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-pink-400"
              title="✏️ Contoh 7 — Setengah Lingkaran Besar Dikurangi Setengah Lingkaran Kecil (π = 3,14)"
              accent="rgba(236,72,153,.12)" />
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
          </div>

          {/* ── CONTOH 4 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(34,197,94,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh4" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400"
              title="✏️ Contoh 4 — Seperempat Lingkaran r = 10 cm (π = 3,14)"
              accent="rgba(34,197,94,.12)" />
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
          </div>

          {/* ── CONTOH 8 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(245,158,11,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh8" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-amber-400"
              title="✏️ Contoh 8 — Bintang 4 Titik dari Busur dalam Persegi 14 cm (π = 22/7)"
              accent="rgba(245,158,11,.12)" />
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(245,158,11,.1)", borderColor: "rgba(245,158,11,.35)" }}>
                  <p className="text-amber-300 font-bold text-xs uppercase tracking-wide mb-2">⭐ Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Di dalam persegi bersisi 14 cm, dari keempat sudutnya dibuat busur seperempat lingkaran (jari-jari = 14 cm). Keempat busur tersebut membentuk bintang 4 titik di tengah persegi. Hitunglah luas daerah bintang yang diarsir! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <ContohDelapanSVG />
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
          </div>

          {/* ── CONTOH 9 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(14,165,233,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh9" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-sky-400"
              title="✏️ Contoh 9 — Tiga Busur Lengkung: Busur Besar Dikurangi 2 Busur Kecil (π = 22/7)"
              accent="rgba(14,165,233,.12)" />
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
          </div>

          {/* ── CONTOH 10 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(20,184,166,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh10" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-teal-400"
              title="✏️ Contoh 10 — Daun Diagonal dalam Persegi 7 cm (π = 22/7)"
              accent="rgba(20,184,166,.12)" />
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
          </div>

          {/* ── CONTOH 11 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh11" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 11 — Bunga 4 Kelopak dalam Persegi 14 cm (π = 22/7)"
              accent="rgba(249,115,22,.12)" />
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                  <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🌸 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Di dalam persegi bersisi 14 cm, dari keempat sudutnya dibuat busur seperempat lingkaran (r = 14 cm). Pasangan busur yang saling berpotongan membentuk 4 buah kelopak bunga. Hitunglah luas total keempat kelopak yang diarsir! <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                  </p>
                </div>
                <SoalSVG11 />
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
          </div>

          {/* ── CONTOH 12 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(139,92,246,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh12" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400"
              title="✏️ Contoh 12 — Sektor Siku-Siku (¼ Lingkaran) r = 10 cm (π = 3,14)"
              accent="rgba(139,92,246,.12)" />
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
          </div>

          {/* ── CONTOH 13 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh13" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 13 — Bangun Es Krim: Setengah Lingkaran + Segitiga (π = 3,14)"
              accent="rgba(249,115,22,.12)" />
              <div className="px-5 pb-5 pt-3 space-y-4">
                <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                  <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🍦 Soal</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah bangun berbentuk "es krim" terdiri dari setengah lingkaran di bagian atas dan segitiga sama kaki di bagian bawah. Diameter bagian atas = 20 cm, tinggi segitiga = 24 cm, dan panjang sisi miring segitiga = 26 cm. Hitunglah <strong>(a)</strong> luas bangun dan <strong>(b)</strong> keliling bangun tersebut! <InlineMath math="(\pi = 3{,}14)"/>
                  </p>
                </div>
                <SoalSVG13 />
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">
                    <strong>Diketahui:</strong> diameter = 20 cm → <InlineMath math="r = 10"/> cm, tinggi segitiga <InlineMath math="t = 24"/> cm, sisi miring <InlineMath math="s = 26"/> cm, alas segitiga = diameter = 20 cm.
                  </p>
                  <p className="font-body text-sm text-white/80"><strong>(a) Luas bangun:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Luas = Luas setengah lingkaran + Luas segitiga</p>
                  <BlockMath math="L = \tfrac{1}{2}\pi r^2 + \tfrac{1}{2} \times \text{alas} \times t" />
                  <BlockMath math="= \tfrac{1}{2} \times 3{,}14 \times 10^2 + \tfrac{1}{2} \times 20 \times 24" />
                  <BlockMath math="= \tfrac{1}{2} \times 3{,}14 \times 100 + 240" />
                  <BlockMath math="= 157 + 240 = \boxed{397 \text{ cm}^2}" />
                  <p className="font-body text-sm text-white/80"><strong>(b) Keliling bangun:</strong></p>
                  <p className="font-body text-xs text-white/60 mb-1">Keliling = busur setengah lingkaran + 2 × sisi miring segitiga</p>
                  <p className="font-body text-xs text-white/60 mb-1">(Alas segitiga/diameter tidak dihitung karena berimpit dengan diameter setengah lingkaran)</p>
                  <BlockMath math="K = \pi r + 2s = 3{,}14 \times 10 + 2 \times 26" />
                  <BlockMath math="= 31{,}4 + 52 = \boxed{83{,}4 \text{ cm}}" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                      <p className="text-orange-300 text-xs font-bold">✅ Luas Bangun</p>
                      <p className="text-white text-sm font-bold mt-1">397 cm²</p>
                    </div>
                    <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                      <p className="text-cyan-300 text-xs font-bold">✅ Keliling Bangun</p>
                      <p className="text-white text-sm font-bold mt-1">83,4 cm</p>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* ── CONTOH 14 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(14,165,233,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh14" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-sky-400"
              title="✏️ Contoh 14 — Trapesium + Setengah Lingkaran (π = 22/7)"
              accent="rgba(14,165,233,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                <p className="text-sky-300 font-bold text-xs uppercase tracking-wide mb-2">🔷 Soal</p>
                <p className="font-body text-sm text-white/90">
                  Sebuah bangun gabungan terdiri dari trapesium simetris di bagian bawah (sisi sejajar 28 cm dan 42 cm, tinggi 14 cm) dan setengah lingkaran di bagian atas dengan diameter 28 cm. Hitunglah <strong>luas bangun</strong> tersebut! <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG14 />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80">
                  <strong>Diketahui:</strong> Trapesium: a₁ = 28 cm, a₂ = 42 cm, t = 14 cm. Setengah lingkaran: d = 28 cm → <InlineMath math="r = 14"/> cm.
                </p>
                <p className="font-body text-sm text-white/80"><strong>Luas trapesium:</strong></p>
                <BlockMath math="L_{\text{trap}} = \tfrac{1}{2}(a_1 + a_2) \times t = \tfrac{1}{2}(28 + 42) \times 14 = \tfrac{1}{2} \times 70 \times 14 = 490 \text{ cm}^2" />
                <p className="font-body text-sm text-white/80"><strong>Luas setengah lingkaran:</strong></p>
                <BlockMath math="L_{\text{semi}} = \tfrac{1}{2}\pi r^2 = \tfrac{1}{2} \times \tfrac{22}{7} \times 14^2 = \tfrac{1}{2} \times \tfrac{22}{7} \times 196 = \tfrac{1}{2} \times 616 = 308 \text{ cm}^2" />
                <p className="font-body text-sm text-white/80"><strong>Total luas:</strong></p>
                <BlockMath math="L = L_{\text{trap}} + L_{\text{semi}} = 490 + 308 = \boxed{798 \text{ cm}^2}" />
                <div className="rounded-lg p-3 border text-center mt-2" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                  <p className="text-sky-300 text-xs font-bold">✅ Luas Bangun</p>
                  <p className="text-white text-sm font-bold mt-1">798 cm²</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTOH 15 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh15" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-purple-400"
              title="✏️ Contoh 15 — Seperempat Lingkaran (π = 22/7)"
              accent="rgba(168,85,247,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                <p className="text-purple-300 font-bold text-xs uppercase tracking-wide mb-2">🔵 Soal</p>
                <p className="font-body text-sm text-white/90">
                  Sebuah bangun berbentuk seperempat lingkaran dengan jari-jari 14 cm. Hitunglah <strong>(a)</strong> luas dan <strong>(b)</strong> keliling daerah tersebut! <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG15 />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80"><strong>Diketahui:</strong> <InlineMath math="r = 14"/> cm.</p>
                <p className="font-body text-sm text-white/80"><strong>(a) Luas:</strong></p>
                <BlockMath math="L = \tfrac{1}{4}\pi r^2 = \tfrac{1}{4} \times \tfrac{22}{7} \times 14^2 = \tfrac{1}{4} \times \tfrac{22}{7} \times 196 = \tfrac{1}{4} \times 616 = \boxed{154 \text{ cm}^2}" />
                <p className="font-body text-sm text-white/80"><strong>(b) Keliling</strong> = 2 jari-jari + busur:</p>
                <BlockMath math="K = 2r + \tfrac{1}{4}(2\pi r) = 2(14) + \tfrac{1}{2} \times \tfrac{22}{7} \times 14 = 28 + 22 = \boxed{50 \text{ cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                    <p className="text-purple-300 text-xs font-bold">✅ Luas</p>
                    <p className="text-white text-sm font-bold mt-1">154 cm²</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">✅ Keliling</p>
                    <p className="text-white text-sm font-bold mt-1">50 cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTOH 16 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh16" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title="✏️ Contoh 16 — Setengah Cincin: R = 14 cm, r = 7 cm (π = 22/7)"
              accent="rgba(249,115,22,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">🌀 Soal</p>
                <p className="font-body text-sm text-white/90">
                  Sebuah bangun berbentuk setengah cincin (half-annulus) dengan jari-jari luar R = 14 cm dan jari-jari dalam r = 7 cm. Hitunglah <strong>(a)</strong> luas dan <strong>(b)</strong> keliling daerah arsiran! <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG16 />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80"><strong>Diketahui:</strong> R = 14 cm, r = 7 cm.</p>
                <p className="font-body text-sm text-white/80"><strong>(a) Luas setengah cincin:</strong></p>
                <BlockMath math="L = \tfrac{1}{2}\pi(R^2 - r^2) = \tfrac{1}{2} \times \tfrac{22}{7} \times (14^2 - 7^2)" />
                <BlockMath math="= \tfrac{1}{2} \times \tfrac{22}{7} \times (196 - 49) = \tfrac{1}{2} \times \tfrac{22}{7} \times 147 = \tfrac{1}{2} \times 462 = \boxed{231 \text{ cm}^2}" />
                <p className="font-body text-sm text-white/80"><strong>(b) Keliling</strong> = busur luar + busur dalam + 2 × (R − r):</p>
                <BlockMath math="K = \pi R + \pi r + 2(R - r) = \tfrac{22}{7}(14 + 7) + 2(14 - 7)" />
                <BlockMath math="= \tfrac{22}{7} \times 21 + 2 \times 7 = 66 + 14 = \boxed{80 \text{ cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                    <p className="text-orange-300 text-xs font-bold">✅ Luas</p>
                    <p className="text-white text-sm font-bold mt-1">231 cm²</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">✅ Keliling</p>
                    <p className="text-white text-sm font-bold mt-1">80 cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTOH 17 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(236,72,153,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh17" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-pink-400"
              title="✏️ Contoh 17 — Setengah Cincin: R = 10 cm, r = 5 cm (π = 3,14)"
              accent="rgba(236,72,153,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(236,72,153,.1)", borderColor: "rgba(236,72,153,.35)" }}>
                <p className="text-pink-300 font-bold text-xs uppercase tracking-wide mb-2">🌀 Soal</p>
                <p className="font-body text-sm text-white/90">
                  Sebuah bangun berbentuk setengah cincin dengan jari-jari luar R = 10 cm dan jari-jari dalam r = 5 cm. Hitunglah <strong>(a)</strong> luas dan <strong>(b)</strong> keliling daerah arsiran! <InlineMath math="(\pi = 3{,}14)"/>
                </p>
              </div>
              <SoalSVG17 />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80"><strong>Diketahui:</strong> R = 10 cm, r = 5 cm.</p>
                <p className="font-body text-sm text-white/80"><strong>(a) Luas setengah cincin:</strong></p>
                <BlockMath math="L = \tfrac{1}{2}\pi(R^2 - r^2) = \tfrac{1}{2} \times 3{,}14 \times (10^2 - 5^2)" />
                <BlockMath math="= \tfrac{1}{2} \times 3{,}14 \times (100 - 25) = \tfrac{1}{2} \times 3{,}14 \times 75 = \boxed{117{,}75 \text{ cm}^2}" />
                <p className="font-body text-sm text-white/80"><strong>(b) Keliling</strong> = busur luar + busur dalam + 2 × (R − r):</p>
                <BlockMath math="K = \pi R + \pi r + 2(R - r) = 3{,}14(10 + 5) + 2(10 - 5)" />
                <BlockMath math="= 3{,}14 \times 15 + 2 \times 5 = 47{,}1 + 10 = \boxed{57{,}1 \text{ cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(236,72,153,.1)", borderColor: "rgba(236,72,153,.35)" }}>
                    <p className="text-pink-300 text-xs font-bold">✅ Luas</p>
                    <p className="text-white text-sm font-bold mt-1">117,75 cm²</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">✅ Keliling</p>
                    <p className="text-white text-sm font-bold mt-1">57,1 cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTOH 18 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(20,184,166,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="contoh18" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-teal-400"
              title="✏️ Contoh 18 — Persegi dikurangi Dua Seperempat Lingkaran (π = 22/7)"
              accent="rgba(20,184,166,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                <p className="text-teal-300 font-bold text-xs uppercase tracking-wide mb-2">⬛ Soal</p>
                <p className="font-body text-sm text-white/90">
                  Pada sebuah persegi dengan sisi 14 cm, dibuat dua buah seperempat lingkaran berhadapan (masing-masing di sudut kanan atas dan sudut kiri bawah) dengan jari-jari 7 cm. Daerah yang <strong>diarsir</strong> (persegi dikurangi kedua seperempat lingkaran) adalah luas yang dicari. Hitunglah luas daerah arsiran! <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG18 />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: "rgba(15,23,42,.6)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>
                <p className="font-body text-sm text-white/80">
                  <strong>Diketahui:</strong> sisi persegi = 14 cm, jari-jari tiap seperempat lingkaran <InlineMath math="r = 7"/> cm.
                </p>
                <p className="font-body text-sm text-white/80"><strong>Luas persegi:</strong></p>
                <BlockMath math="L_{\text{persegi}} = 14^2 = 196 \text{ cm}^2" />
                <p className="font-body text-sm text-white/80"><strong>Luas 2 seperempat lingkaran</strong> = luas ½ lingkaran:</p>
                <BlockMath math="L_{2 \times \frac{1}{4}\text{lingk}} = 2 \times \tfrac{1}{4}\pi r^2 = \tfrac{1}{2} \times \tfrac{22}{7} \times 7^2 = \tfrac{1}{2} \times \tfrac{22}{7} \times 49 = \tfrac{1}{2} \times 154 = 77 \text{ cm}^2" />
                <p className="font-body text-sm text-white/80"><strong>Luas arsiran:</strong></p>
                <BlockMath math="L = L_{\text{persegi}} - L_{2 \times \frac{1}{4}\text{lingk}} = 196 - 77 = \boxed{119 \text{ cm}^2}" />
                <div className="rounded-lg p-3 border text-center mt-2" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                  <p className="text-teal-300 text-xs font-bold">✅ Luas Arsiran</p>
                  <p className="text-white text-sm font-bold mt-1">119 cm²</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.75)", borderColor: "rgba(251,191,36,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400"
              title="📌 Rangkuman — Peta Rumus Daerah Arsiran"
              accent="rgba(251,191,36,.12)" />
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
