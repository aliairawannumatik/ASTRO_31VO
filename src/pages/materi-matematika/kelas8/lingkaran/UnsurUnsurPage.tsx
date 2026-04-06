import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, FlaskConical, Lightbulb } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─────────────────────────────────────────────────────────
   ANIMATED SVG COMPONENTS — one per unsur lingkaran
───────────────────────────────────────────────────────── */

const PusatSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Titik Pusat Lingkaran">
    <defs>
      <style>{`
        @keyframes pusatPulse{0%,100%{opacity:1;filter:drop-shadow(0 0 10px #fbbf24);}50%{opacity:0.4;filter:drop-shadow(0 0 2px #fbbf24);}}
        @keyframes ringExp{0%{r:8;opacity:0.9;}100%{r:50;opacity:0;}}
        .p-dot{animation:pusatPulse 1.4s ease-in-out infinite;}
        .p-r1{animation:ringExp 2s ease-out infinite;}
        .p-r2{animation:ringExp 2s ease-out infinite 0.8s;}
        .p-r3{animation:ringExp 2s ease-out infinite 1.4s;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <circle cx="150" cy="125" r="8" fill="none" stroke="#fbbf24" strokeWidth="2" className="p-r1"/>
    <circle cx="150" cy="125" r="8" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="p-r2"/>
    <circle cx="150" cy="125" r="8" fill="none" stroke="#fbbf24" strokeWidth="1" className="p-r3"/>
    <circle cx="150" cy="125" r="7" fill="#fbbf24" className="p-dot"/>
    <text x="162" y="118" fill="#fde68a" fontSize="15" fontWeight="bold" fontFamily="monospace">O</text>
    <text x="75" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">Semua titik di lingkaran berjarak r dari O</text>
  </svg>
);

const JariJariSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Jari-jari Lingkaran">
    <defs>
      <style>{`
        @keyframes drawR{0%{stroke-dashoffset:90;}100%{stroke-dashoffset:0;}}
        @keyframes dotSlide{0%{transform:translate(150px,125px);}100%{transform:translate(240px,125px);}}
        @keyframes glowR{0%,100%{filter:drop-shadow(0 0 6px #22c55e);}50%{filter:drop-shadow(0 0 18px #22c55e);}}
        .r-line{stroke-dasharray:90;animation:drawR 1.8s ease-in-out infinite;}
        .r-dot{animation:dotSlide 1.8s ease-in-out infinite, glowR 1.8s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <line x1="150" y1="125" x2="240" y2="125" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" className="r-line"/>
    <circle cx="240" cy="125" r="5" fill="#22c55e"/>
    <text x="185" y="115" fill="#4ade80" fontSize="13" fontWeight="bold" fontFamily="monospace">r</text>
    <text x="143" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="245" y="120" fill="#86efac" fontSize="10" fontFamily="monospace">A</text>
    <text x="55" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">r = jarak dari pusat O ke titik di lingkaran</text>
  </svg>
);

const DiameterSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Diameter Lingkaran">
    <defs>
      <style>{`
        @keyframes drawD{0%{stroke-dashoffset:180;}100%{stroke-dashoffset:0;}}
        @keyframes glowD{0%,100%{filter:drop-shadow(0 0 6px #a855f7);}50%{filter:drop-shadow(0 0 18px #a855f7);}}
        .d-line{stroke-dasharray:180;animation:drawD 2s ease-in-out infinite;}
        .d-glow{animation:glowD 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <line x1="60" y1="125" x2="240" y2="125" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" className="d-line d-glow"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <circle cx="60" cy="125" r="5" fill="#a855f7"/>
    <circle cx="240" cy="125" r="5" fill="#a855f7"/>
    <text x="140" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="42" y="120" fill="#d8b4fe" fontSize="10" fontFamily="monospace">P</text>
    <text x="246" y="120" fill="#d8b4fe" fontSize="10" fontFamily="monospace">Q</text>
    <text x="148" y="108" fill="#d8b4fe" fontSize="13" fontWeight="bold" fontFamily="monospace">d</text>
    <text x="60" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">d = 2r  (melewati pusat O)</text>
  </svg>
);

const TaliBusurSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Tali Busur Lingkaran">
    <defs>
      <style>{`
        @keyframes drawTB{0%{stroke-dashoffset:170;}100%{stroke-dashoffset:0;}}
        @keyframes glowTB{0%,100%{filter:drop-shadow(0 0 6px #f97316);}50%{filter:drop-shadow(0 0 20px #f97316);}}
        .tb-line{stroke-dasharray:170;animation:drawTB 2s ease-in-out infinite;}
        .tb-glow{animation:glowTB 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <circle cx="150" cy="125" r="4" fill="rgba(251,191,36,0.5)"/>
    {/* Chord from ~130° to ~340° */}
    <line x1="92" y1="56" x2="235" y2="157" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" className="tb-line tb-glow"/>
    <circle cx="92" cy="56" r="5" fill="#f97316"/>
    <circle cx="235" cy="157" r="5" fill="#f97316"/>
    <text x="72" y="50" fill="#fdba74" fontSize="11" fontFamily="monospace">A</text>
    <text x="241" y="152" fill="#fdba74" fontSize="11" fontFamily="monospace">B</text>
    <text x="148" y="100" fill="#fdba74" fontSize="12" fontWeight="bold" fontFamily="monospace">AB</text>
    <text x="30" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">Tidak harus melewati pusat lingkaran</text>
  </svg>
);

const BusurSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Busur Lingkaran">
    <defs>
      <style>{`
        @keyframes drawArc{0%{stroke-dashoffset:142;}100%{stroke-dashoffset:0;}}
        @keyframes glowArc{0%,100%{filter:drop-shadow(0 0 8px #fbbf24);}50%{filter:drop-shadow(0 0 22px #fbbf24);}}
        .arc-line{stroke-dasharray:142;animation:drawArc 2.2s ease-in-out infinite;}
        .arc-glow{animation:glowArc 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    {/* Highlighted arc from top to right (90° sweep) */}
    <path d="M 150 35 A 90 90 0 0 1 240 125" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" className="arc-line arc-glow"/>
    <circle cx="150" cy="35" r="5" fill="#fbbf24"/>
    <circle cx="240" cy="125" r="5" fill="#fbbf24"/>
    <circle cx="150" cy="125" r="4" fill="rgba(251,191,36,0.5)"/>
    <text x="156" y="26" fill="#fde68a" fontSize="11" fontFamily="monospace">A</text>
    <text x="246" y="120" fill="#fde68a" fontSize="11" fontFamily="monospace">B</text>
    <text x="218" y="68" fill="#fde68a" fontSize="13" fontWeight="bold" fontFamily="monospace">⌢AB</text>
    <text x="30" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">Bagian dari keliling (garis lengkung) lingkaran</text>
  </svg>
);

const JuringSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Juring Lingkaran">
    <defs>
      <style>{`
        @keyframes fillJuring{0%{opacity:0;}30%{opacity:0;}100%{opacity:1;}}
        @keyframes glowJuring{0%,100%{filter:drop-shadow(0 0 8px #ec4899);}50%{filter:drop-shadow(0 0 22px #ec4899);}}
        .juring-fill{animation:fillJuring 2s ease-in-out infinite;}
        .juring-glow{animation:glowJuring 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    {/* Sector OAB */}
    <path d="M 150 125 L 150 35 A 90 90 0 0 1 240 125 Z" fill="rgba(236,72,153,0.3)" stroke="#ec4899" strokeWidth="2" className="juring-fill juring-glow"/>
    <line x1="150" y1="125" x2="150" y2="35" stroke="#ec4899" strokeWidth="2.5"/>
    <line x1="150" y1="125" x2="240" y2="125" stroke="#ec4899" strokeWidth="2.5"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <text x="156" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="156" y="27" fill="#f9a8d4" fontSize="11" fontFamily="monospace">A</text>
    <text x="246" y="120" fill="#f9a8d4" fontSize="11" fontFamily="monospace">B</text>
    <text x="200" y="90" fill="#f9a8d4" fontSize="13" fontWeight="bold" fontFamily="monospace">🍕</text>
    <text x="40" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">Daerah antara 2 jari-jari dan busur</text>
  </svg>
);

const TemberengSVG2 = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Tembereng Lingkaran">
    <defs>
      <style>{`
        @keyframes fillTemb{0%{opacity:0;}40%{opacity:0;}100%{opacity:1;}}
        @keyframes glowTemb{0%,100%{filter:drop-shadow(0 0 8px #ef4444);}50%{filter:drop-shadow(0 0 20px #ef4444);}}
        .temb-fill{animation:fillTemb 2s ease-in-out infinite;}
        .temb-glow{animation:glowTemb 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    {/* Tembereng: area between chord and arc */}
    <path d="M 92 56 A 90 90 0 0 1 235 157 Z" fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="2" className="temb-fill temb-glow"/>
    <line x1="92" y1="56" x2="235" y2="157" stroke="#ef4444" strokeWidth="2.5"/>
    <circle cx="92" cy="56" r="5" fill="#ef4444"/>
    <circle cx="235" cy="157" r="5" fill="#ef4444"/>
    <circle cx="150" cy="125" r="4" fill="rgba(251,191,36,0.4)"/>
    <text x="72" y="50" fill="#fca5a5" fontSize="11" fontFamily="monospace">A</text>
    <text x="241" y="152" fill="#fca5a5" fontSize="11" fontFamily="monospace">B</text>
    <text x="145" y="72" fill="#fca5a5" fontSize="11" fontWeight="bold" fontFamily="monospace">🌙</text>
    <text x="20" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">Daerah antara tali busur AB dan busurnya</text>
  </svg>
);

const ApotemaDetailSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label="Apotema Lingkaran">
    <defs>
      <style>{`
        @keyframes drawApo{0%{stroke-dashoffset:70;}100%{stroke-dashoffset:0;}}
        @keyframes glowApoYellow{0%,100%{filter:drop-shadow(0 0 4px rgba(253,224,71,0.45));}50%{filter:drop-shadow(0 0 10px rgba(253,224,71,0.7));}}
        .apo-line{stroke-dasharray:70;animation:drawApo 1.8s ease-in-out infinite;}
        .apo-glow{animation:glowApoYellow 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    {/* Radii — dashed lines O to A and O to B */}
    <line x1="150" y1="125" x2="77" y2="82" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round"/>
    <line x1="150" y1="125" x2="223" y2="82" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round"/>
    <text x="100" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">r</text>
    <text x="188" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">r</text>
    {/* Chord — horizontal above center */}
    <line x1="77" y1="82" x2="223" y2="82" stroke="rgba(249,115,22,0.7)" strokeWidth="2.5"/>
    <circle cx="77" cy="82" r="4" fill="#f97316"/>
    <circle cx="223" cy="82" r="4" fill="#f97316"/>
    <text x="58" y="78" fill="#fdba74" fontSize="11" fontFamily="monospace">A</text>
    <text x="228" y="78" fill="#fdba74" fontSize="11" fontFamily="monospace">B</text>
    {/* Apotema from O perpendicular to chord — dim yellow glow */}
    <line x1="150" y1="125" x2="150" y2="82" stroke="#fde047" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.75" className="apo-line apo-glow"/>
    {/* Right angle marker */}
    <polyline points="142,82 142,90 150,90" fill="none" stroke="#fde047" strokeWidth="1.5" strokeOpacity="0.7"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <circle cx="150" cy="82" r="4" fill="#fde047"/>
    <text x="140" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="154" y="78" fill="#fef08a" fontSize="11" fontFamily="monospace">D</text>
    <text x="156" y="108" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="monospace">OD ⊥ AB</text>
    <text x="25" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">Jarak terpendek dari pusat ke tali busur</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────
   SLIDE DATA
───────────────────────────────────────────────────────── */
const slides = [
  {
    id: "pusat",
    emoji: "⭐",
    title: "Titik Pusat",
    symbol: "O",
    color: "yellow",
    borderColor: "border-yellow-500/40",
    bgColor: "bg-yellow-900/20",
    textColor: "text-yellow-300",
    badgeColor: "bg-yellow-500/20 text-yellow-200",
    svg: <PusatSVG />,
    desc: "Titik Pusat adalah titik yang menjadi acuan lingkaran. Setiap titik di garis lingkaran memiliki jarak yang SAMA persis dari titik pusat ini. Jarak tersebut disebut jari-jari.",
    keyFact: "Titik pusat biasanya dilambangkan dengan huruf O dan merupakan 'jantung' dari lingkaran.",
    formula: null,
  },
  {
    id: "jari-jari",
    emoji: "📏",
    title: "Jari-jari",
    symbol: "r",
    color: "green",
    borderColor: "border-green-500/40",
    bgColor: "bg-green-900/20",
    textColor: "text-green-300",
    badgeColor: "bg-green-500/20 text-green-200",
    svg: <JariJariSVG />,
    desc: "Jari-jari adalah ruas garis yang menghubungkan titik pusat O dengan titik mana saja yang berada di garis lingkaran. Semua jari-jari dalam satu lingkaran panjangnya SELALU sama.",
    keyFact: "Dalam satu lingkaran, banyak jari-jari yang bisa digambar — dan semuanya panjangnya sama.",
    formula: "r = \\frac{d}{2}",
  },
  {
    id: "diameter",
    emoji: "↔️",
    title: "Diameter",
    symbol: "d",
    color: "purple",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-900/20",
    textColor: "text-purple-300",
    badgeColor: "bg-purple-500/20 text-purple-200",
    svg: <DiameterSVG />,
    desc: "Diameter adalah tali busur yang melewati titik pusat O. Diameter merupakan tali busur TERPANJANG dalam sebuah lingkaran. Panjangnya dua kali jari-jari.",
    keyFact: "Diameter membagi lingkaran menjadi dua bagian yang sama besar (dua setengah lingkaran).",
    formula: "d = 2r",
  },
  {
    id: "tali-busur",
    emoji: "📐",
    title: "Tali Busur",
    symbol: "AB",
    color: "orange",
    borderColor: "border-orange-500/40",
    bgColor: "bg-orange-900/20",
    textColor: "text-orange-300",
    badgeColor: "bg-orange-500/20 text-orange-200",
    svg: <TaliBusurSVG />,
    desc: "Tali Busur adalah ruas garis lurus yang menghubungkan dua titik yang berada di garis lingkaran. Tali busur TIDAK harus melewati titik pusat. Jika melewati pusat, maka ia adalah diameter.",
    keyFact: "Diameter adalah tali busur terpanjang! Semua tali busur lainnya panjangnya kurang dari diameter.",
    formula: null,
  },
  {
    id: "busur",
    emoji: "🌈",
    title: "Busur",
    symbol: "⌢AB",
    color: "cyan",
    borderColor: "border-cyan-500/40",
    bgColor: "bg-cyan-900/20",
    textColor: "text-cyan-300",
    badgeColor: "bg-cyan-500/20 text-cyan-200",
    svg: <BusurSVG />,
    desc: "Busur adalah bagian dari garis lengkung (keliling) lingkaran yang dibatasi oleh dua titik. Ada Busur Minor (busur kecil, kurang dari setengah lingkaran) dan Busur Mayor (busur besar, lebih dari setengah lingkaran).",
    keyFact: "Busur adalah GARIS LENGKUR — bukan daerah. Panjang busur sebanding dengan sudut pusatnya.",
    formula: "\\text{Panjang Busur} = \\frac{\\alpha}{360°} \\times 2\\pi r",
  },
  {
    id: "juring",
    emoji: "🍕",
    title: "Juring (Sektor)",
    symbol: "OAB",
    color: "pink",
    borderColor: "border-pink-500/40",
    bgColor: "bg-pink-900/20",
    textColor: "text-pink-300",
    badgeColor: "bg-pink-500/20 text-pink-200",
    svg: <JuringSVG />,
    desc: "Juring adalah daerah (luas) yang dibatasi oleh dua jari-jari dan busur yang mengapitnya. Bentuknya seperti potongan pizza atau irisan semangka. Juring sering disebut juga sebagai sektor.",
    keyFact: "Juring adalah DAERAH (punya luas), bukan garis. Semakin besar sudut pusatnya, semakin luas juringnya.",
    formula: "L_{juring} = \\frac{\\alpha}{360°} \\times \\pi r^2",
  },
  {
    id: "tembereng",
    emoji: "🌙",
    title: "Tembereng",
    symbol: "—",
    color: "red",
    borderColor: "border-red-500/40",
    bgColor: "bg-red-900/20",
    textColor: "text-red-300",
    badgeColor: "bg-red-500/20 text-red-200",
    svg: <TemberengSVG2 />,
    desc: "Tembereng adalah daerah yang dibatasi oleh tali busur dan busur yang bersesuaian. Bentuknya mirip bulan sabit. Tembereng = Juring − Segitiga yang dibentuk oleh dua jari-jari dan tali busurnya.",
    keyFact: "Tembereng adalah DAERAH (punya luas). Bentuknya seperti bulan sabit antara tali busur dan busur.",
    formula: "L_{tembereng} = L_{juring} - L_{\\triangle OAB}",
  },
  {
    id: "apotema",
    emoji: "📍",
    title: "Apotema",
    symbol: "OD ⊥ AB",
    color: "rose",
    borderColor: "border-rose-500/40",
    bgColor: "bg-rose-900/20",
    textColor: "text-rose-300",
    badgeColor: "bg-rose-500/20 text-rose-200",
    svg: <ApotemaDetailSVG />,
    desc: "Apotema adalah jarak terpendek dari titik pusat O ke tali busur AB. Garis apotema selalu tegak lurus (⊥) terhadap tali busur dan memotong tali busur tepat di titik tengahnya.",
    keyFact: "Apotema selalu tegak lurus terhadap tali busur dan membaginya menjadi dua bagian yang sama panjang.",
    formula: "a^2 + \\left(\\frac{AB}{2}\\right)^2 = r^2",
  },
];

/* ─────────────────────────────────────────────────────────
   SLIDE CAROUSEL COMPONENT
───────────────────────────────────────────────────────── */
const SlideCarousel = () => {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];

  const prev = () => { playPopSound(); setIdx(i => (i - 1 + slides.length) % slides.length); };
  const next = () => { playPopSound(); setIdx(i => (i + 1) % slides.length); };
  const goTo = (i: number) => { if (i !== idx) { playPopSound(); setIdx(i); } };

  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
      {/* Header bar */}
      <div className={`px-5 py-3 flex items-center justify-between border-b ${slide.borderColor} ${slide.bgColor}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{slide.emoji}</span>
          <span className={`font-display font-bold text-base ${slide.textColor}`}>{slide.title}</span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${slide.badgeColor}`}>{slide.symbol}</span>
        </div>
        <span className="text-xs text-white/40 font-mono">{idx + 1} / {slides.length}</span>
      </div>

      {/* SVG Animation */}
      <div className="px-4 pt-5 pb-2">
        {slide.svg}
      </div>

      {/* Description */}
      <div className="px-5 pb-4 space-y-3">
        <p className="font-body text-sm text-white/80 leading-relaxed">{slide.desc}</p>

        {/* Key fact */}
        <div className={`rounded-lg p-3 border ${slide.borderColor} ${slide.bgColor}`}>
          <p className={`font-body text-xs font-semibold ${slide.textColor} mb-1`}>💡 Fakta Kunci</p>
          <p className="font-body text-xs text-white/75">{slide.keyFact}</p>
        </div>

        {/* Formula */}
        {slide.formula && (
          <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 text-center">
            <p className="text-white/40 text-[10px] font-mono mb-1 uppercase tracking-wide">Rumus</p>
            <BlockMath math={slide.formula} />
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <button
          onClick={prev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-600 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-body cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === idx ? "bg-primary scale-125" : "bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-600 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-body cursor-pointer"
        >
          Berikutnya <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* All elements quick-jump */}
      <div className="px-5 pb-5">
        <p className="text-white/30 text-[10px] font-mono mb-2 uppercase tracking-wide">Loncat ke unsur:</p>
        <div className="flex flex-wrap gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`text-[10px] px-2.5 py-1 rounded-full font-body font-semibold border transition-all cursor-pointer ${
                i === idx
                  ? `${s.borderColor} ${s.bgColor} ${s.textColor}`
                  : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
              }`}
            >
              {s.emoji} {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
const UnsurUnsurPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["contoh1"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/materi-matematika/kelas-8/lingkaran" nextPath="/materi-matematika/kelas-8/lingkaran/keliling-luas" />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">UNSUR-UNSUR LINGKARAN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* Intro Banner */}
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl px-5 py-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-cyan-300 mb-1">Apa Itu Lingkaran?</p>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                Lingkaran adalah himpunan semua titik yang berjarak sama dari satu titik tetap yang disebut <strong className="text-yellow-300">pusat</strong>.
                Jarak tersebut disebut <strong className="text-green-300">jari-jari (r)</strong>. Klik setiap slide di bawah untuk mempelajari unsur-unsurnya!
              </p>
            </div>
          </div>

          {/* INTERACTIVE SLIDE CAROUSEL */}
          <SlideCarousel />

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Identifikasi Unsur (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Lingkaran berpusat di O dengan titik A, B, C, dan D pada lingkaran. Jika <InlineMath math="OA = 7"/> cm, sebutkan mana yang merupakan jari-jari, diameter, dan tali busur dari unsur: OA, OB, AB, dan CD yang melewati O!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">OA dan OB</strong> = jari-jari, karena menghubungkan pusat ke titik di lingkaran. <InlineMath math="r = 7"/> cm.</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-purple-300">CD yang melewati O</strong> = diameter, karena merupakan tali busur terpanjang yang melewati pusat.</p>
                  <BlockMath math="d = 2r = 2 \times 7 = 14 \text{ cm}" />
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">AB</strong> = tali busur, karena menghubungkan dua titik di lingkaran tapi tidak melewati pusat.</p>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-sm text-green-300 text-center">✅ Jari-jari = OA = OB = 7 cm | Diameter = CD = 14 cm | Tali Busur = AB</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Mencari Jari-jari & Diameter (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Lingkaran O memiliki diameter <InlineMath math="d = 4x - 2"/> cm dan jari-jari <InlineMath math="r = x + 5"/> cm. Tentukan panjang jari-jari dan diameter lingkaran tersebut!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Gunakan hubungan: <strong className="text-cyan-300">diameter = 2 × jari-jari</strong></p>
                  <BlockMath math="4x - 2 = 2(x + 5)" />
                  <BlockMath math="4x - 2 = 2x + 10" />
                  <BlockMath math="2x = 12 \Rightarrow x = 6" />
                  <BlockMath math="r = 6 + 5 = 11 \text{ cm}" />
                  <BlockMath math="d = 4(6) - 2 = 22 \text{ cm}" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">✅ Jari-jari = <strong>11 cm</strong>, Diameter = <strong>22 cm</strong> (cek: 2 × 11 = 22 ✓)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Apotema dan Tali Busur (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Lingkaran berpusat di O dengan jari-jari 13 cm. Tali busur AB tegak lurus terhadap jari-jari OC di titik D, dan <InlineMath math="OD = 5"/> cm. Tentukan panjang tali busur AB!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Karena OC ⊥ AB di titik D, maka OD adalah <strong className="text-cyan-300">apotema</strong> dan D adalah titik tengah AB.</p>
                  <p className="font-body text-sm text-white/80">Gunakan teorema Pythagoras pada segitiga ODA:</p>
                  <BlockMath math="OA^2 = OD^2 + DA^2" />
                  <BlockMath math="13^2 = 5^2 + DA^2" />
                  <BlockMath math="169 = 25 + DA^2 \Rightarrow DA^2 = 144 \Rightarrow DA = 12 \text{ cm}" />
                  <p className="font-body text-sm text-white/80">Karena D adalah titik tengah AB:</p>
                  <BlockMath math="AB = 2 \times DA = 2 \times 12 = 24 \text{ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Panjang tali busur <strong>AB = 24 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Unsur-Unsur Lingkaran" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {slides.map(s => (
                    <div key={s.id} className={`rounded-lg p-3 border ${s.borderColor} ${s.bgColor}`}>
                      <p className="font-body text-xs font-bold text-white">{s.emoji} {s.title} <span className={`font-mono ${s.textColor}`}>({s.symbol})</span></p>
                      <p className="font-body text-[11px] text-white/55 mt-0.5 leading-relaxed">{s.keyFact}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Apotema digunakan dalam desain antena parabola dan satelit — semakin banyak sisi poligon, apotema-nya mendekati jari-jari lingkaran. Begitulah antena parabola dirancang!
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

export default UnsurUnsurPage;
