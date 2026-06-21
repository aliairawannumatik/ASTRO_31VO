import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type OptionKey = "A" | "B" | "C" | "D";
type Cat = "unsur" | "lp" | "vol" | "app";
type QMC = {
  n: number; title: string; cat: Cat;
  content: string;
  diagram?: React.ReactNode;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
};

const CAT_LABELS: Record<Cat, { icon: string; label: string; color: string }> = {
  unsur: { icon: "🔵", label: "Unsur Bola",           color: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  lp:    { icon: "📐", label: "Luas Permukaan",        color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  vol:   { icon: "📦", label: "Volume",                color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  app:   { icon: "🌍", label: "Aplikasi di Kehidupan", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
};

function SphereSVG({ r, color = "#818cf8", extraLabel = "" }: {
  r?: string; color?: string; extraLabel?: string;
}) {
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <defs>
        <radialGradient id={`sg-${r}-${extraLabel}`} cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="60%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="100" r="72" fill={`url(#sg-${r}-${extraLabel})`} stroke={color} strokeWidth="2" />
      <ellipse cx="110" cy="100" rx="72" ry="22" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="6,4" />
      <ellipse cx="110" cy="100" rx="22" ry="72" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
      {r && (
        <>
          <line x1="110" y1="100" x2="170" y2="72" stroke={color} strokeWidth="1.5" />
          <circle cx="110" cy="100" r="3" fill={color} />
          <text x="155" y="65" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r = {r}</text>
        </>
      )}
      {extraLabel && (
        <text x="110" y="190" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">{extraLabel}</text>
      )}
    </svg>
  );
}

function HalfSphereSVG({ r, color = "#818cf8" }: { r?: string; color?: string }) {
  return (
    <svg viewBox="0 0 220 170" width="220" height="170" className="mx-auto">
      <defs>
        <radialGradient id={`hg-${r}`} cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <path d="M 35 100 A 75 75 0 0 1 185 100 Z" fill={`url(#hg-${r})`} stroke={color} strokeWidth="2" />
      <ellipse cx="110" cy="100" rx="75" ry="22" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <line x1="110" y1="100" x2="155" y2="72" stroke={color} strokeWidth="1.5" />
      <circle cx="110" cy="100" r="3" fill={color} />
      {r && <text x="148" y="68" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r = {r}</text>}
      <text x="110" y="152" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Setengah Bola</text>
    </svg>
  );
}

/* ── Kolam Setengah Bola ──
   Pool: opening at TOP, dome curves DOWNWARD.
   Shape built with cubic bezier (no arc ambiguity):
     M 30 72 C 30 142, 84 190, 140 190 C 196 190, 250 142, 250 72 Z
   viewBox 0 0 280 230  |  Opening ellipse cy=72 rx=110 ry=24  (top=48, clear margin)
   Water surface WY=118  |  Dome bottom y=190  |  Label y=218
──────────────────────────────────────────── */
function KolamSetengahBolaSVG({ r, color = "#818cf8" }: { r?: string; color?: string }) {
  /* Bowl bezier path — unambiguous downward bowl shape.
     Two symmetric cubics approximate a true semicircle (r≈118px):
       Left:  M 30 72 C 30 142, 84 190, 140 190
       Right: C 196 190, 250 142, 250 72
     Verified: at x=140 the curve passes through y=190 (bottom) ✓
               at x=30 and x=250 the curve starts at y=72 (rim) ✓            */
  const BOWL = "M 30 72 C 30 142, 84 190, 140 190 C 196 190, 250 142, 250 72 Z";
  return (
    <svg viewBox="0 0 280 230" width="280" height="230" className="mx-auto">
      <defs>
        <radialGradient id="ksh" cx="50%" cy="5%" r="85%">
          <stop offset="0%"   stopColor={color}   stopOpacity="0.30" />
          <stop offset="100%" stopColor={color}   stopOpacity="0.04" />
        </radialGradient>
        <linearGradient id="kwt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.68" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="kwsh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e0f2fe" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.15" />
        </linearGradient>
        <clipPath id="kcp"><path d={BOWL} /></clipPath>
      </defs>

      {/* Bowl shell */}
      <path d={BOWL} fill="url(#ksh)" stroke={color} strokeWidth="2.5" />

      {/* Water body — fills full pool (from rim y≈68 to dome bottom y=190) */}
      <rect x="0" y="68" width="280" height="130" fill="url(#kwt)" clipPath="url(#kcp)">
        <animate attributeName="y"      values="68;65;68;71;68"   dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="height" values="130;133;130;127;130" dur="2.6s" repeatCount="indefinite" />
      </rect>

      {/* Bright shimmer band at water surface (flush with rim) */}
      <rect x="0" y="62" width="280" height="18" fill="url(#kwsh)" clipPath="url(#kcp)">
        <animate attributeName="y" values="62;59;62;65;62" dur="2.6s" repeatCount="indefinite" />
      </rect>

      {/* Surface meniscus ellipse — at rim level cy=72 */}
      <ellipse cx="140" cy="72" rx="100" ry="14" fill="#bae6fd" fillOpacity="0.72" clipPath="url(#kcp)">
        <animate attributeName="cy" values="72;69;72;75;72" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="ry" values="14;18;14;11;14" dur="2.0s" repeatCount="indefinite" />
        <animate attributeName="rx" values="100;103;100;97;100" dur="3.0s" repeatCount="indefinite" />
      </ellipse>

      {/* Ripple 1 — from rim level */}
      <ellipse cx="140" cy="72" rx="8" ry="4" fill="none"
               stroke="#e0f2fe" strokeWidth="2" clipPath="url(#kcp)">
        <animate attributeName="rx"      values="8;94;100"       dur="2.4s"        repeatCount="indefinite" />
        <animate attributeName="ry"      values="4;11;14"        dur="2.4s"        repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;0"        dur="2.4s"        repeatCount="indefinite" />
        <animate attributeName="cy"      values="72;69;72;75;72" dur="2.6s"        repeatCount="indefinite" />
      </ellipse>

      {/* Ripple 2 offset */}
      <ellipse cx="140" cy="72" rx="8" ry="4" fill="none"
               stroke="#93c5fd" strokeWidth="1.5" clipPath="url(#kcp)">
        <animate attributeName="rx"      values="8;94;100"       dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="ry"      values="4;11;14"        dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.3;0"      dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="cy"      values="72;69;72;75;72" dur="2.6s"              repeatCount="indefinite" />
      </ellipse>

      {/* Ripple 3 small fast */}
      <ellipse cx="140" cy="72" rx="5" ry="3" fill="none"
               stroke="#bae6fd" strokeWidth="1.1" clipPath="url(#kcp)">
        <animate attributeName="rx"      values="5;52;58"        dur="1.7s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="ry"      values="3;7;9"          dur="1.7s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.3;0"      dur="1.7s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="cy"      values="72;69;72;75;72" dur="2.6s"              repeatCount="indefinite" />
      </ellipse>

      {/* Opening rim */}
      <ellipse cx="140" cy="72" rx="110" ry="24"
               fill={color} fillOpacity="0.10" stroke={color} strokeWidth="2.2" />

      {/* Radius line centre → right rim */}
      <line x1="140" y1="72" x2="250" y2="72"
            stroke={color} strokeWidth="1.8" strokeDasharray="6 3" />
      <circle cx="140" cy="72" r="4" fill={color} />
      {r && (
        <text x="193" y="60" fill={color} fontSize="13" textAnchor="middle"
              fontFamily="monospace" fontWeight="700">r = {r}</text>
      )}

      {/* Label */}
      <text x="140" y="218" fill={color} fontSize="11" textAnchor="middle"
            fontFamily="monospace" fillOpacity="0.70">Kolam Setengah Bola</text>
    </svg>
  );
}

function PerbandinganBangunSVG({ color = "#818cf8" }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 210" width="340" height="210" className="mx-auto">
      <defs>
        <radialGradient id="pbg-s" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
        <linearGradient id="pbg-c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="8" y="38" width="82" height="120" fill={color} fillOpacity="0.05" stroke={color} strokeWidth="1.4" />
      <ellipse cx="49" cy="38" rx="41" ry="12" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4" />
      <ellipse cx="49" cy="158" rx="41" ry="12" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4" />
      <text x="49" y="180" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace">Tabung</text>
      <text x="49" y="191" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = 3</text>
      <circle cx="170" cy="98" r="60" fill="url(#pbg-s)" stroke={color} strokeWidth="2" />
      <ellipse cx="170" cy="98" rx="60" ry="17" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4,3" />
      <text x="170" y="180" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace">Bola</text>
      <text x="170" y="191" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = 2</text>
      <ellipse cx="290" cy="158" rx="41" ry="12" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4" />
      <line x1="249" y1="158" x2="290" y2="38" stroke={color} strokeWidth="1.5" />
      <line x1="331" y1="158" x2="290" y2="38" stroke={color} strokeWidth="1.5" />
      <polygon points="249,158 331,158 290,38" fill="url(#pbg-c)" />
      <text x="290" y="180" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace">Kerucut</text>
      <text x="290" y="191" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = 1</text>
    </svg>
  );
}

function BolaDalamTabungSVG({ color = "#818cf8" }: { color?: string }) {
  return (
    <svg viewBox="0 0 260 230" width="260" height="230" className="mx-auto">
      <defs>
        <radialGradient id="bdt-s" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.10" />
        </radialGradient>
      </defs>
      <rect x="60" y="25" width="140" height="160" fill={color} fillOpacity="0.04" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="25" rx="70" ry="18" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="185" rx="70" ry="18" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.5" />
      <circle cx="130" cy="105" r="70" fill="url(#bdt-s)" stroke={color} strokeWidth="2" />
      <ellipse cx="130" cy="105" rx="70" ry="20" fill="none" stroke={color} strokeWidth="1" strokeDasharray="5,3" />
      <line x1="130" y1="105" x2="200" y2="105" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <circle cx="130" cy="105" r="3" fill={color} />
      <text x="168" y="98" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">r</text>
      <text x="130" y="215" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Bola menyinggung semua sisi tabung</text>
    </svg>
  );
}

function TabungSetengahBolaSVG({ color = "#818cf8" }: { color?: string }) {
  return (
    <svg viewBox="0 0 260 250" width="260" height="250" className="mx-auto">
      <defs>
        <radialGradient id="tsb-s" cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <rect x="60" y="130" width="140" height="90" fill={color} fillOpacity="0.05" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="220" rx="70" ry="18" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="130" rx="70" ry="18" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.2" strokeDasharray="5,3" />
      <path d="M 60 130 A 70 70 0 0 1 200 130 Z" fill="url(#tsb-s)" stroke={color} strokeWidth="2" />
      <line x1="130" y1="130" x2="200" y2="130" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <circle cx="130" cy="130" r="3" fill={color} />
      <text x="212" y="134" fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">r = 7</text>
      <line x1="205" y1="135" x2="205" y2="218" stroke={color} strokeWidth="1" strokeDasharray="3,2" />
      <text x="212" y="182" fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">t = 10</text>
      <text x="130" y="243" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Tabung + Setengah Bola</text>
    </svg>
  );
}

function BolaInKubusSVG({ s, color = "#818cf8" }: { s?: string; color?: string }) {
  const fc = color;
  return (
    <svg viewBox="0 0 260 240" width="260" height="240" className="mx-auto">
      <defs>
        <radialGradient id="bik-s" cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor={fc} stopOpacity="0.50" />
          <stop offset="60%" stopColor={fc} stopOpacity="0.20" />
          <stop offset="100%" stopColor={fc} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <polygon points="80,30 200,30 200,150 80,150" fill={fc} fillOpacity="0.03" stroke={fc} strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5" />
      <line x1="80" y1="30"  x2="40" y2="70"  stroke={fc} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.4" />
      <line x1="80" y1="150" x2="40" y2="190" stroke={fc} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.4" />
      <line x1="200" y1="150" x2="160" y2="190" stroke={fc} strokeWidth="1.2" strokeOpacity="0.6" />
      <circle cx="120" cy="120" r="60" fill="url(#bik-s)" stroke={fc} strokeWidth="2" />
      <ellipse cx="120" cy="120" rx="60" ry="18" fill="none" stroke={fc} strokeWidth="1" strokeDasharray="5,3" />
      <ellipse cx="120" cy="120" rx="18" ry="60" fill="none" stroke={fc} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
      <line x1="120" y1="120" x2="167" y2="96" stroke={fc} strokeWidth="1.4" strokeDasharray="3,2" />
      <circle cx="120" cy="120" r="3" fill={fc} />
      <polygon points="40,70 80,30 200,30 160,70" fill={fc} fillOpacity="0.07" stroke={fc} strokeWidth="1.5" />
      <polygon points="160,70 200,30 200,150 160,190" fill={fc} fillOpacity="0.06" stroke={fc} strokeWidth="1.5" />
      <rect x="40" y="70" width="120" height="120" fill="none" stroke={fc} strokeWidth="1.8" />
      {s && <>
        <text x="98" y="205" fill={fc} fontSize="11" textAnchor="middle" fontFamily="monospace">s = {s}</text>
        <text x="40" y="220" fill={fc} fontSize="9" textAnchor="start" fontFamily="monospace" fillOpacity="0.6">Bola tepat menyentuh semua sisi kubus</text>
      </>}
    </svg>
  );
}

function PlanetModelSVG({ r }: { r?: string }) {
  return (
    <svg viewBox="0 0 280 240" width="280" height="240" className="mx-auto">
      <defs>
        <radialGradient id="planet-body" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#c4b5fd" />
          <stop offset="40%"  stopColor="#7c3aed" />
          <stop offset="75%"  stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
        <radialGradient id="planet-glow" cx="50%" cy="50%" r="55%">
          <stop offset="70%"  stopColor="#a78bfa" stopOpacity="0" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ddd6fe" stopOpacity="0.10" />
          <stop offset="25%"  stopColor="#c4b5fd" stopOpacity="0.65" />
          <stop offset="50%"  stopColor="#ede9fe" stopOpacity="0.80" />
          <stop offset="75%"  stopColor="#c4b5fd" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.10" />
        </linearGradient>
        <clipPath id="ring-front"><rect x="0" y="118" width="280" height="122" /></clipPath>
        <clipPath id="ring-back"><rect x="0" y="0" width="280" height="118" /></clipPath>
      </defs>

      {/* Stars */}
      {[[20,20],[258,35],[14,80],[265,160],[30,190],[250,200],[60,220],[220,10]] .map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" fillOpacity="0.5" />
      ))}

      {/* Back ring */}
      <ellipse cx="140" cy="118" rx="110" ry="22"
               fill="none" stroke="url(#ring-grad)" strokeWidth="14"
               clipPath="url(#ring-back)" opacity="0.55" />

      {/* Planet body */}
      <circle cx="140" cy="118" r="72" fill="url(#planet-body)" />
      <circle cx="140" cy="118" r="72" fill="url(#planet-glow)" />

      {/* Surface bands */}
      <ellipse cx="140" cy="100" rx="70" ry="8" fill="none" stroke="#c4b5fd" strokeWidth="4" strokeOpacity="0.20" />
      <ellipse cx="140" cy="118" rx="72" ry="9" fill="none" stroke="#7c3aed" strokeWidth="5" strokeOpacity="0.30" />
      <ellipse cx="140" cy="136" rx="70" ry="8" fill="none" stroke="#6d28d9" strokeWidth="4" strokeOpacity="0.25" />

      {/* Storm spot */}
      <ellipse cx="118" cy="110" rx="14" ry="8" fill="#7c3aed" fillOpacity="0.5" />
      <ellipse cx="118" cy="110" rx="9"  ry="5" fill="#a78bfa" fillOpacity="0.4" />
      <ellipse cx="118" cy="110" rx="4"  ry="2.5" fill="#c4b5fd" fillOpacity="0.6" />

      {/* Polar cap */}
      <ellipse cx="140" cy="50" rx="28" ry="10" fill="#ede9fe" fillOpacity="0.25" />

      {/* Equator dashed */}
      <ellipse cx="140" cy="118" rx="72" ry="20" fill="none" stroke="#ddd6fe"
               strokeWidth="1" strokeDasharray="5,4" strokeOpacity="0.30" />

      {/* Front ring */}
      <ellipse cx="140" cy="118" rx="110" ry="22"
               fill="none" stroke="url(#ring-grad)" strokeWidth="14"
               clipPath="url(#ring-front)" />

      {/* Radius line */}
      {r && (
        <>
          <line x1="140" y1="118" x2="212" y2="118"
                stroke="#ddd6fe" strokeWidth="1.6" strokeDasharray="4,3" />
          <circle cx="140" cy="118" r="3.5" fill="#ddd6fe" />
          <text x="178" y="110" fill="#ddd6fe" fontSize="12"
                textAnchor="middle" fontFamily="monospace" fontWeight="700">r = {r}</text>
        </>
      )}

      {/* Label */}
      <text x="140" y="228" fill="#c4b5fd" fontSize="11"
            textAnchor="middle" fontFamily="monospace" fillOpacity="0.80">
        Model Planet (d = 1,4 m)
      </text>
    </svg>
  );
}

function BalonUdaraSVG({ r }: { r?: string }) {
  return (
    <svg viewBox="0 0 260 270" width="260" height="270" className="mx-auto">
      <defs>
        {/* Sky */}
        <linearGradient id="bu-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        {/* Balloon panels — alternating warm colours */}
        <radialGradient id="bu-bal" cx="40%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#fde68a" />
          <stop offset="40%"  stopColor="#f59e0b" />
          <stop offset="80%"  stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="bu-bal2" cx="40%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#fca5a5" />
          <stop offset="40%"  stopColor="#ef4444" />
          <stop offset="80%"  stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="bu-bal3" cx="40%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#bbf7d0" />
          <stop offset="40%"  stopColor="#22c55e" />
          <stop offset="80%"  stopColor="#14532d" />
          <stop offset="100%" stopColor="#052e16" stopOpacity="0.9" />
        </radialGradient>
        {/* Highlight on balloon */}
        <radialGradient id="bu-shine" cx="35%" cy="28%" r="45%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="bu-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="bu-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.35" />
        </filter>
        {/* Clip to balloon circle */}
        <clipPath id="bu-clip">
          <circle cx="130" cy="105" r="80" />
        </clipPath>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="260" height="270" fill="url(#bu-sky)" rx="10" />

      {/* Clouds */}
      {[[30,38],[190,28],[220,65],[20,72]].map(([cx,cy],i) => (
        <g key={i} fillOpacity="0.18" fill="white">
          <ellipse cx={cx} cy={cy} rx="22" ry="10" />
          <ellipse cx={cx+14} cy={cy-4} rx="14" ry="9" />
          <ellipse cx={cx-12} cy={cy-3} rx="12" ry="8" />
        </g>
      ))}

      {/* Stars */}
      {[[18,14],[55,8],[105,6],[165,12],[220,8],[248,22],[12,45],[245,48]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="white" fillOpacity="0.5" />
      ))}

      {/* ── Balloon body ── */}
      {/* Panel 1 (yellow) */}
      <path d="M 130 25 A 80 80 0 0 1 210 105 L 130 105 Z"
            fill="url(#bu-bal)" clipPath="url(#bu-clip)" />
      {/* Panel 2 (red) */}
      <path d="M 210 105 A 80 80 0 0 1 130 185 L 130 105 Z"
            fill="url(#bu-bal2)" clipPath="url(#bu-clip)" />
      {/* Panel 3 (green) */}
      <path d="M 130 185 A 80 80 0 0 1 50 105 L 130 105 Z"
            fill="url(#bu-bal3)" clipPath="url(#bu-clip)" />
      {/* Panel 4 (yellow) */}
      <path d="M 50 105 A 80 80 0 0 1 130 25 L 130 105 Z"
            fill="url(#bu-bal)" clipPath="url(#bu-clip)" />

      {/* Balloon outline */}
      <circle cx="130" cy="105" r="80" fill="none" stroke="#fbbf24" strokeWidth="2"
              filter="url(#bu-shadow)" />

      {/* Panel divider lines */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180;
        return (
          <line key={i}
                x1="130" y1="105"
                x2={130 + 80 * Math.cos(rad)}
                y2={105 + 80 * Math.sin(rad)}
                stroke="#78350f" strokeWidth="1.2" strokeOpacity="0.55" />
        );
      })}

      {/* Latitude rings */}
      <ellipse cx="130" cy="80"  rx="68" ry="15" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.30" strokeDasharray="5,3" />
      <ellipse cx="130" cy="105" rx="80" ry="20" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.30" strokeDasharray="5,3" />
      <ellipse cx="130" cy="130" rx="68" ry="15" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.30" strokeDasharray="5,3" />

      {/* Balloon shine */}
      <circle cx="130" cy="105" r="80" fill="url(#bu-shine)" />

      {/* ── Ropes from bottom of balloon to basket ── */}
      {[-28, -10, 10, 28].map((dx, i) => (
        <line key={i}
              x1={130 + dx} y1="183"
              x2={130 + (dx > 0 ? 18 : -18)} y2="215"
              stroke="#d97706" strokeWidth="1.4" strokeOpacity="0.85" />
      ))}

      {/* ── Basket ── */}
      <rect x="112" y="214" width="36" height="24" rx="3"
            fill="#92400e" stroke="#b45309" strokeWidth="1.8" />
      {/* Basket weave lines */}
      <line x1="120" y1="214" x2="120" y2="238" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="130" y1="214" x2="130" y2="238" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="140" y1="214" x2="140" y2="238" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="112" y1="222" x2="148" y2="222" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="112" y1="230" x2="148" y2="230" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />

      {/* Flame glow at basket top */}
      <ellipse cx="130" cy="213" rx="8" ry="5" fill="#fbbf24" fillOpacity="0.65"
               filter="url(#bu-glow)" />
      <ellipse cx="130" cy="211" rx="4" ry="7" fill="#fb923c" fillOpacity="0.80" />
      <ellipse cx="130" cy="209" rx="2" ry="4" fill="#fde68a" fillOpacity="0.90" />

      {/* ── Radius line ── */}
      {r && (
        <>
          <line x1="130" y1="105" x2="210" y2="105"
                stroke="#fde68a" strokeWidth="1.6" strokeDasharray="5,3" />
          <circle cx="130" cy="105" r="3.5" fill="#fde68a" />
          <text x="172" y="97" fill="#fde68a" fontSize="12"
                textAnchor="middle" fontFamily="monospace" fontWeight="700">r = {r}</text>
        </>
      )}

      {/* Label */}
      <text x="130" y="260" fill="#fde68a" fontSize="11"
            textAnchor="middle" fontFamily="monospace" fillOpacity="0.85">
        Balon Udara (d = 10 m)
      </text>
    </svg>
  );
}

function GedungAtapSetengahBolaSVG({ r }: { r?: string }) {
  return (
    <svg viewBox="0 0 280 230" width="280" height="230" className="mx-auto">
      <defs>
        {/* Dome gradient — green rooftop */}
        <radialGradient id="dome-fill" cx="38%" cy="25%" r="65%">
          <stop offset="0%"   stopColor="#6ee7b7" />
          <stop offset="45%"  stopColor="#10b981" />
          <stop offset="85%"  stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
        </radialGradient>
        {/* Dome atmosphere shimmer */}
        <radialGradient id="dome-glow" cx="50%" cy="50%" r="55%">
          <stop offset="65%"  stopColor="#34d399" stopOpacity="0" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.25" />
        </radialGradient>
        {/* Wall gradient */}
        <linearGradient id="wall-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#cbd5e1" />
          <stop offset="50%"  stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        {/* Sky gradient */}
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        {/* Ground */}
        <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#166534" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <filter id="dome-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Sky background */}
      <rect x="0" y="0" width="280" height="200" fill="url(#sky-grad)" rx="8" />

      {/* Stars */}
      {[[20,18],[60,10],[110,8],[170,15],[230,10],[255,28],[15,55],[260,60],[35,90]] .map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="white" fillOpacity="0.55" />
      ))}

      {/* Ground */}
      <rect x="0" y="186" width="280" height="44" fill="url(#ground-grad)" />

      {/* Building body (walls) */}
      <rect x="65" y="130" width="150" height="60" fill="url(#wall-grad)" />

      {/* Wall shading — left column shadow */}
      <rect x="65" y="130" width="12" height="60" fill="#94a3b8" fillOpacity="0.4" />

      {/* Windows row */}
      {[95, 135, 175].map((wx) => (
        <g key={wx}>
          <rect x={wx} y="148" width="20" height="24" rx="2" fill="#bfdbfe" fillOpacity="0.85" stroke="#60a5fa" strokeWidth="1" />
          <line x1={wx + 10} y1="148" x2={wx + 10} y2="172" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1={wx} y1="160" x2={wx + 20} y2="160" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.6" />
        </g>
      ))}

      {/* Door */}
      <rect x="127" y="158" width="26" height="32" rx="2" fill="#78350f" fillOpacity="0.7" stroke="#92400e" strokeWidth="1" />
      <rect x="130" y="161" width="10" height="14" rx="1" fill="#fbbf24" fillOpacity="0.3" />
      <rect x="140" y="161" width="10" height="14" rx="1" fill="#fbbf24" fillOpacity="0.3" />

      {/* Dome base ellipse (rim of half-sphere sitting on wall top) */}
      <ellipse cx="140" cy="132" rx="75" ry="16"
               fill="#065f46" fillOpacity="0.5" stroke="#34d399" strokeWidth="1.8" />

      {/* Dome body (half-sphere) */}
      <path d="M 65 132 A 75 75 0 0 1 215 132 Z"
            fill="url(#dome-fill)" filter="url(#dome-shadow)" />

      {/* Dome atmosphere glow */}
      <path d="M 65 132 A 75 75 0 0 1 215 132 Z" fill="url(#dome-glow)" />

      {/* Dome latitude lines */}
      <ellipse cx="140" cy="132" rx="70" ry="10" fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.35" />
      <ellipse cx="140" cy="108" rx="55" ry="8"  fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.30" />
      <ellipse cx="140" cy="84"  rx="32" ry="5"  fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.25" />

      {/* Dome meridian lines */}
      <path d="M 140 57 Q 215 95 215 132" fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.25" />
      <path d="M 140 57 Q  65 95  65 132" fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.25" />

      {/* Dome top highlight */}
      <ellipse cx="130" cy="72" rx="18" ry="9"
               fill="white" fillOpacity="0.18"
               transform="rotate(-20,130,72)" />

      {/* Spire / flagpole at top */}
      <line x1="140" y1="57" x2="140" y2="42" stroke="#fbbf24" strokeWidth="2" />
      <polygon points="134,44 140,28 146,44" fill="#ef4444" />

      {/* Radius line */}
      {r && (
        <>
          <line x1="140" y1="132" x2="215" y2="132"
                stroke="#34d399" strokeWidth="1.6" strokeDasharray="5,3" />
          <circle cx="140" cy="132" r="3" fill="#34d399" />
          <text x="178" y="122" fill="#34d399" fontSize="12"
                textAnchor="middle" fontFamily="monospace" fontWeight="700">r = {r}</text>
        </>
      )}

      {/* Label */}
      <text x="140" y="218" fill="#6ee7b7" fontSize="11"
            textAnchor="middle" fontFamily="monospace" fillOpacity="0.85">
        Atap Gedung — Setengah Bola
      </text>
    </svg>
  );
}

function PingPongBallSVG({ r, count }: { r?: string; count?: number }) {
  const balls = Array.from({ length: count ?? 1 });
  const cols = count === 6 ? 3 : 1;
  const rows = count === 6 ? 2 : 1;
  const bx = (i: number) => 55 + (i % cols) * 60;
  const by = (i: number) => 50 + Math.floor(i / cols) * 60;
  const br = 24;

  return (
    <svg viewBox="0 0 230 160" width="230" height="160" className="mx-auto">
      <defs>
        {balls.map((_, i) => (
          <radialGradient key={i} id={`pp-${i}`} cx="38%" cy="32%" r="58%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="45%"  stopColor="#fde68a" />
            <stop offset="80%"  stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
          </radialGradient>
        ))}
        <filter id="pp-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#78350f" floodOpacity="0.35" />
        </filter>
      </defs>

      {balls.map((_, i) => {
        const cx = bx(i);
        const cy = by(i);
        return (
          <g key={i} filter="url(#pp-shadow)">
            {/* Ball body */}
            <circle cx={cx} cy={cy} r={br} fill={`url(#pp-${i})`} />

            {/* Characteristic curved seam line */}
            <path
              d={`M ${cx - br} ${cy} Q ${cx - br * 0.5} ${cy - br * 0.7}, ${cx} ${cy - br * 0.05} Q ${cx + br * 0.5} ${cy + br * 0.7}, ${cx + br} ${cy}`}
              fill="none" stroke="white" strokeWidth="1.8" strokeOpacity="0.85"
            />
            <path
              d={`M ${cx - br} ${cy} Q ${cx - br * 0.5} ${cy + br * 0.7}, ${cx} ${cy + br * 0.05} Q ${cx + br * 0.5} ${cy - br * 0.7}, ${cx + br} ${cy}`}
              fill="none" stroke="white" strokeWidth="1.8" strokeOpacity="0.85"
            />

            {/* Specular highlight */}
            <ellipse cx={cx - br * 0.28} cy={cy - br * 0.3} rx={br * 0.22} ry={br * 0.14}
                     fill="white" fillOpacity="0.55" transform={`rotate(-30,${cx - br * 0.28},${cy - br * 0.3})`} />
          </g>
        );
      })}

      {/* Radius label on first ball */}
      {r && (
        <>
          <line x1={bx(0)} y1={by(0)} x2={bx(0) + br} y2={by(0)}
                stroke="#b45309" strokeWidth="1.4" strokeDasharray="3,2" />
          <circle cx={bx(0)} cy={by(0)} r="2.5" fill="#b45309" />
          <text x={bx(0) + br + 4} y={by(0) - 4} fill="#fbbf24" fontSize="11"
                fontFamily="monospace" fontWeight="700">r = {r}</text>
        </>
      )}

      {/* Count label */}
      {count && count > 1 && (
        <text x="115" y="148" fill="#fbbf24" fontSize="11"
              textAnchor="middle" fontFamily="monospace" fillOpacity="0.85">
          {count} bola pingpong
        </text>
      )}
    </svg>
  );
}

function BolaDalamTabungUkuranSVG({ rBola, rTabung, tTabung, color = "#818cf8" }: {
  rBola: string; rTabung: string; tTabung: string; color?: string;
}) {
  return (
    <svg viewBox="0 0 280 240" width="280" height="240" className="mx-auto">
      <defs>
        <radialGradient id="bdtu-s" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.10" />
        </radialGradient>
      </defs>
      <rect x="55" y="20" width="150" height="180" fill={color} fillOpacity="0.04" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="20" rx="75" ry="20" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="200" rx="75" ry="20" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" />
      <circle cx="130" cy="110" r="75" fill="url(#bdtu-s)" stroke={color} strokeWidth="2" />
      <ellipse cx="130" cy="110" rx="75" ry="22" fill="none" stroke={color} strokeWidth="1.1" strokeDasharray="5,3" />
      <line x1="130" y1="110" x2="205" y2="110" stroke={color} strokeWidth="1.3" strokeDasharray="4,2" />
      <circle cx="130" cy="110" r="3.5" fill={color} />
      <text x="170" y="103" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">r = {rBola}</text>
      <line x1="220" y1="20"  x2="220" y2="200" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <line x1="215" y1="20"  x2="225" y2="20"  stroke={color} strokeWidth="1" />
      <line x1="215" y1="200" x2="225" y2="200" stroke={color} strokeWidth="1" />
      <text x="240" y="115" fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">t={tTabung}</text>
      <line x1="55" y1="200" x2="130" y2="200" stroke={color} strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.6" />
      <text x="88" y="220" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">r={rTabung}</text>
    </svg>
  );
}

const mcQuestions: QMC[] = [
  /* ── UNSUR ── */
  {
    n: 1, title: "Banyak Sisi pada Bola", cat: "unsur",
    content: "Banyak sisi yang dimiliki oleh bangun bola adalah ...",
    diagram: <SphereSVG />,
    options: [
      { key: "A", text: "0 sisi" },
      { key: "B", text: "1 sisi" },
      { key: "C", text: "2 sisi" },
      { key: "D", text: "3 sisi" },
    ],
    answer: "B",
  },
  /* ── LUAS PERMUKAAN ── */
  {
    n: 2, title: "Luas Permukaan Bola – r = 14 cm", cat: "lp",
    content: "Sebuah bola memiliki jari-jari 14 cm. Luas permukaan bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="14 cm" />,
    options: [
      { key: "A", text: "1.848 cm²" },
      { key: "B", text: "2.156 cm²" },
      { key: "C", text: "2.464 cm²" },
      { key: "D", text: "3.080 cm²" },
    ],
    answer: "C",
  },
  {
    n: 3, title: "Luas Permukaan – Diameter 14 cm", cat: "lp",
    content: "Sebuah bola berdiameter 14 cm. Luas permukaan bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="7 cm" color="#60a5fa" />,
    options: [
      { key: "A", text: "154 cm²" },
      { key: "B", text: "308 cm²" },
      { key: "C", text: "616 cm²" },
      { key: "D", text: "1.232 cm²" },
    ],
    answer: "C",
  },
  {
    n: 4, title: "Jari-Jari dari Luas Permukaan 616 cm²", cat: "lp",
    content: "Luas permukaan sebuah bola adalah 616 cm². Panjang jari-jari bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "5 cm" },
      { key: "B", text: "6 cm" },
      { key: "C", text: "7 cm" },
      { key: "D", text: "14 cm" },
    ],
    answer: "C",
  },
  {
    n: 5, title: "Mencari Jari-Jari dari Luas Permukaan", cat: "lp",
    content: "Luas permukaan sebuah bola adalah 154 cm². Panjang jari-jari bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "3 cm" },
      { key: "B", text: "3,5 cm" },
      { key: "C", text: "5 cm" },
      { key: "D", text: "7 cm" },
    ],
    answer: "B",
  },
  {
    n: 6, title: "Perbandingan Luas Permukaan – Diameter Berbeda", cat: "lp",
    content: "Dua buah bola memiliki diameter masing-masing 6 cm dan 8 cm. Perbandingan luas permukaan kedua bola adalah ...",
    options: [
      { key: "A", text: "3 : 4" },
      { key: "B", text: "4 : 9" },
      { key: "C", text: "9 : 16" },
      { key: "D", text: "16 : 27" },
    ],
    answer: "C",
  },
  /* ── VOLUME ── */
  {
    n: 7, title: "Volume Bola – Diameter 21 cm", cat: "vol",
    content: "Sebuah bola memiliki diameter 21 cm. Volume bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="10,5 cm" />,
    options: [
      { key: "A", text: "1.386 cm³" },
      { key: "B", text: "2.910 cm³" },
      { key: "C", text: "4.851 cm³" },
      { key: "D", text: "9.702 cm³" },
    ],
    answer: "C",
  },
  {
    n: 8, title: "Perbandingan Volume Dua Bola", cat: "vol",
    content: "Dua buah bola memiliki jari-jari masing-masing 3 cm dan 6 cm. Perbandingan volume bola pertama terhadap bola kedua adalah ...",
    options: [
      { key: "A", text: "1 : 4" },
      { key: "B", text: "1 : 6" },
      { key: "C", text: "1 : 8" },
      { key: "D", text: "2 : 3" },
    ],
    answer: "C",
  },
  {
    n: 9, title: "Perbandingan Volume Tabung, Bola, Kerucut", cat: "vol",
    content: "Sebuah tabung, bola, dan kerucut memiliki jari-jari dan tinggi yang sama (tinggi = 2r). Perbandingan volume tabung : bola : kerucut adalah ...",
    diagram: <PerbandinganBangunSVG />,
    options: [
      { key: "A", text: "1 : 2 : 3" },
      { key: "B", text: "2 : 1 : 3" },
      { key: "C", text: "3 : 2 : 1" },
      { key: "D", text: "3 : 1 : 2" },
    ],
    answer: "C",
  },
  {
    n: 10, title: "Luas Permukaan dari Volume Bola", cat: "lp",
    content: "Volume sebuah bola adalah 36π cm³. Luas permukaan bola tersebut adalah ...",
    options: [
      { key: "A", text: "18π cm²" },
      { key: "B", text: "27π cm²" },
      { key: "C", text: "36π cm²" },
      { key: "D", text: "54π cm²" },
    ],
    answer: "C",
  },
  /* ── APLIKASI ── */
  {
    n: 11, title: "Kebutuhan Cat Model Planet – d = 1,4 m", cat: "app",
    content: "Sebuah model planet berbentuk bola dengan diameter 1,4 m dicat seluruhnya. Jika 1 kg cat dapat menutup 50 m², cat yang dibutuhkan adalah ... (π = 22/7)",
    diagram: <PlanetModelSVG r="0,7 m" />,
    options: [
      { key: "A", text: "0,062 kg" },
      { key: "B", text: "0,093 kg" },
      { key: "C", text: "0,123 kg" },
      { key: "D", text: "0,185 kg" },
    ],
    answer: "C",
  },
  {
    n: 12, title: "Biaya Bungkus 6 Bola Pingpong – d = 4 cm", cat: "app",
    content: "Sebuah bola pingpong berdiameter 4 cm akan dibungkus kertas tipis seharga Rp100 per cm². Biaya untuk membungkus 6 bola adalah ... (π = 3,14)",
    diagram: <PingPongBallSVG r="2 cm" count={6} />,
    options: [
      { key: "A", text: "Rp20.096" },
      { key: "B", text: "Rp25.120" },
      { key: "C", text: "Rp30.144" },
      { key: "D", text: "Rp40.192" },
    ],
    answer: "C",
  },
  {
    n: 13, title: "Biaya Cat Atap Setengah Bola – d = 14 m", cat: "app",
    content: "Atap sebuah gedung berbentuk setengah bola dengan panjang diameter 14 m. Atap gedung tersebut akan dicat dengan biaya Rp50.000,00 setiap m². Biaya yang diperlukan untuk mengecat atap gedung itu adalah … (π = 22/7)",
    diagram: <GedungAtapSetengahBolaSVG r="7 m" />,
    options: [
      { key: "A", text: "Rp13.700.000,00" },
      { key: "B", text: "Rp15.400.000,00" },
      { key: "C", text: "Rp15.850.000,00" },
      { key: "D", text: "Rp16.400.000,00" },
    ],
    answer: "B",
  },
  {
    n: 14, title: "Volume Kolam Setengah Bola – r = 70 cm", cat: "app",
    content: "Sebuah kolam mandi anak berbentuk setengah bola berjari-jari 70 cm. Volume air untuk mengisi penuh kolam tersebut adalah ... (π = 22/7, 1 liter = 1.000 cm³)",
    diagram: <KolamSetengahBolaSVG r="70 cm" />,
    options: [
      { key: "A", text: "359,33 liter" },
      { key: "B", text: "539 liter" },
      { key: "C", text: "718,67 liter" },
      { key: "D", text: "1.078 liter" },
    ],
    answer: "C",
  },
  {
    n: 15, title: "Volume Balon Udara – d = 10 m", cat: "app",
    content: "Sebuah balon udara berbentuk bola berdiameter 10 m. Volume gas yang diisi ke dalam balon adalah ... (π = 3,14)",
    diagram: <BalonUdaraSVG r="5 m" />,
    options: [
      { key: "A", text: "261,67 m³" },
      { key: "B", text: "392,5 m³" },
      { key: "C", text: "523,33 m³" },
      { key: "D", text: "785 m³" },
    ],
    answer: "C",
  },
];

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
      ? "bg-indigo-500/30 border-indigo-400 text-white"
      : "bg-white/5 border-white/10 text-white/80 hover:border-indigo-400/50 hover:bg-indigo-500/10";
  }
  if (key === answer) return "bg-emerald-500/25 border-emerald-400 text-emerald-200";
  if (selected === key && key !== answer) return "bg-rose-500/25 border-rose-400 text-rose-200 line-through";
  return "bg-white/3 border-white/8 text-white/40";
};

const BolaPage = () => {
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
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔮</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-indigo-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(129,140,248,0.7)' }}>
            BOLA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2">
              <span className="text-indigo-400 text-xs font-bold">📋 15 Soal</span>
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

        <div className="mb-5 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-indigo-300 text-xs font-bold mb-2">📌 Rumus Penting — Bola</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Luas Permukaan",             formula: "L = 4\\pi r^2" },
              { label: "Volume",                      formula: "V = \\tfrac{4}{3}\\pi r^3" },
              { label: "Luas ½ Bola (selimut+alas)",  formula: "L = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2" },
              { label: "Volume ½ Bola",               formula: "V = \\tfrac{2}{3}\\pi r^3" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-indigo-400 font-bold shrink-0 w-36">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-indigo-500/20" />
          <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2">Soal 1–15 · Pilihan Ganda</span>
          <div className="h-px flex-1 bg-indigo-500/20" />
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {mcQuestions.map((q, i) => {
            const isRevealed = !!revealed[q.n];
            const sel       = selected[q.n];
            const isCorrect = isRevealed && sel === q.answer;
            const isWrong   = isRevealed && !!sel && sel !== q.answer;
            const prevCat   = i > 0 ? mcQuestions[i - 1].cat : null;
            const showDivider = q.cat !== prevCat;
            return (
              <div key={q.n}>
                {showDivider && <CatDivider cat={q.cat} />}
                <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${i * 0.015}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
                  <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isCorrect ? "border border-emerald-500/40" : isWrong ? "border border-rose-500/40" : "border border-indigo-500/20"}`} />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-violet-500 rounded-l-2xl" />
                  <div className="relative px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCorrect ? "bg-emerald-500/20 border-emerald-400/50" : isWrong ? "bg-rose-500/20 border-rose-400/50" : "bg-indigo-500/20 border-indigo-400/50"}`}>
                        <span className={`text-xs font-bold ${isCorrect ? "text-emerald-300" : isWrong ? "text-rose-300" : "text-indigo-300"}`}>{q.n}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded inline-block mb-2">
                          {q.title}
                        </span>
                        <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>
                        {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          {q.options.map(opt => (
                            <button key={opt.key}
                              onClick={() => handleSelect(q.n, opt.key)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm font-body transition-all cursor-pointer ${optionStyle(opt.key, sel, q.answer, isRevealed)}`}>
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                                isRevealed && opt.key === q.answer                          ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
                                : isRevealed && sel === opt.key && opt.key !== q.answer     ? "border-rose-400 text-rose-300 bg-rose-500/20"
                                : sel === opt.key                                           ? "border-indigo-400 text-indigo-300 bg-indigo-500/20"
                                : "border-white/20 text-white/50"
                              }`}>{opt.key}</span>
                              <span>{opt.text}</span>
                              {isRevealed && opt.key === q.answer && <span className="ml-auto text-emerald-400 text-xs font-bold">✓</span>}
                              {isRevealed && sel === opt.key && opt.key !== q.answer && <span className="ml-auto text-rose-400 text-xs font-bold">✗</span>}
                            </button>
                          ))}
                        </div>
                        {isRevealed && (
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

export default BolaPage;
