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

/* ── Kolam Setengah Bola — opening UP (pool), dome curves DOWN, water fills inside ── */
function KolamSetengahBolaSVG({ r, color = "#818cf8" }: { r?: string; color?: string }) {
  /*
    Pool = half-sphere with opening at TOP, dome curving DOWNWARD.
    sweep-flag=1 (same as HalfSphereSVG) curves the arc downward.
    viewBox 0 0 260 210
    Opening ellipse: cx=130 cy=48 rx=100 ry=24  → top=24, bottom=72
    Arc: M 30 48 A 100 100 0 0 1 230 48 Z  → dome bottom at y=48+100=148
    Water surface at y=92 (44px below opening rim)
      half-chord at y=92: dist-from-centre=92-48=44 → sqrt(100²-44²)≈89.8
      water spans x≈40 to x≈220
    Label below dome: y=195
  */
  const WY = 92; /* water surface y */
  return (
    <svg viewBox="0 0 260 210" width="260" height="210" className="mx-auto">
      <defs>
        <radialGradient id="ksh" cx="50%" cy="10%" r="80%">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0.06" />
        </radialGradient>
        <linearGradient id="kwt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.70" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.90" />
        </linearGradient>
        {/* clip = dome interior (opening at top, dome curves down) */}
        <clipPath id="kcp">
          <path d="M 30 48 A 100 100 0 0 1 230 48 Z" />
        </clipPath>
      </defs>

      {/* Pool shell */}
      <path d="M 30 48 A 100 100 0 0 1 230 48 Z"
            fill="url(#ksh)" stroke={color} strokeWidth="2" />

      {/* Water body — fills from surface down to dome bottom, clipped to shell */}
      <rect x="0" y={WY} width="260" height="110" fill="url(#kwt)" clipPath="url(#kcp)">
        <animate attributeName="y" values={`${WY};${WY-3};${WY};${WY+3};${WY}`} dur="2.4s" repeatCount="indefinite" />
      </rect>

      {/* Water surface bright cap */}
      <ellipse cx="130" cy={WY} rx="88" ry="11" fill="#bae6fd" fillOpacity="0.55" clipPath="url(#kcp)">
        <animate attributeName="cy" values={`${WY};${WY-3};${WY};${WY+3};${WY}`} dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="ry" values="11;14;11;9;11" dur="2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="88;91;88;85;88" dur="2.8s" repeatCount="indefinite" />
      </ellipse>

      {/* Wave line 1 */}
      <path fill="none" stroke="#e0f2fe" strokeWidth="2.2" strokeOpacity="0.9" clipPath="url(#kcp)"
            d={`M 42 ${WY} Q 66 ${WY-7},90 ${WY} Q 114 ${WY+7},138 ${WY} Q 162 ${WY-7},186 ${WY} Q 200 ${WY+4},218 ${WY}`}>
        <animate attributeName="d"
          values={`M 42 ${WY} Q 66 ${WY-7},90 ${WY} Q 114 ${WY+7},138 ${WY} Q 162 ${WY-7},186 ${WY} Q 200 ${WY+4},218 ${WY};M 42 ${WY-4} Q 66 ${WY+5},90 ${WY-4} Q 114 ${WY-11},138 ${WY-4} Q 162 ${WY+5},186 ${WY-4} Q 200 ${WY-2},218 ${WY-4};M 42 ${WY} Q 66 ${WY-7},90 ${WY} Q 114 ${WY+7},138 ${WY} Q 162 ${WY-7},186 ${WY} Q 200 ${WY+4},218 ${WY}`}
          dur="2s" repeatCount="indefinite" />
      </path>

      {/* Wave line 2 — offset */}
      <path fill="none" stroke="#93c5fd" strokeWidth="1.3" strokeOpacity="0.60" clipPath="url(#kcp)"
            d={`M 42 ${WY+4} Q 66 ${WY-3},90 ${WY+4} Q 114 ${WY+11},138 ${WY+4} Q 162 ${WY-3},186 ${WY+4} Q 200 ${WY+7},218 ${WY+4}`}>
        <animate attributeName="d"
          values={`M 42 ${WY+4} Q 66 ${WY-3},90 ${WY+4} Q 114 ${WY+11},138 ${WY+4} Q 162 ${WY-3},186 ${WY+4} Q 200 ${WY+7},218 ${WY+4};M 42 ${WY} Q 66 ${WY+9},90 ${WY} Q 114 ${WY-7},138 ${WY} Q 162 ${WY+9},186 ${WY} Q 200 ${WY+3},218 ${WY};M 42 ${WY+4} Q 66 ${WY-3},90 ${WY+4} Q 114 ${WY+11},138 ${WY+4} Q 162 ${WY-3},186 ${WY+4} Q 200 ${WY+7},218 ${WY+4}`}
          dur="2.8s" begin="0.7s" repeatCount="indefinite" />
      </path>

      {/* Ripple 1 */}
      <ellipse cx="130" cy={WY} rx="12" ry="5" fill="none" stroke="#e0f2fe" strokeWidth="1.5" clipPath="url(#kcp)">
        <animate attributeName="rx" values="12;80;88" dur="2.3s" repeatCount="indefinite" />
        <animate attributeName="ry" values="5;10;12" dur="2.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.35;0" dur="2.3s" repeatCount="indefinite" />
      </ellipse>

      {/* Ripple 2 offset */}
      <ellipse cx="130" cy={WY} rx="12" ry="5" fill="none" stroke="#bae6fd" strokeWidth="1.1" clipPath="url(#kcp)">
        <animate attributeName="rx" values="12;80;88" dur="2.3s" begin="1.15s" repeatCount="indefinite" />
        <animate attributeName="ry" values="5;10;12" dur="2.3s" begin="1.15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.25;0" dur="2.3s" begin="1.15s" repeatCount="indefinite" />
      </ellipse>

      {/* Opening rim at top */}
      <ellipse cx="130" cy="48" rx="100" ry="24"
               fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" />

      {/* Radius arrow along opening rim */}
      <line x1="130" y1="48" x2="230" y2="48" stroke={color} strokeWidth="1.6" strokeDasharray="5 3" />
      <circle cx="130" cy="48" r="3.5" fill={color} />
      {r && (
        <text x="178" y="38" fill={color} fontSize="12" textAnchor="middle"
              fontFamily="monospace" fontWeight="600">r = {r}</text>
      )}

      {/* Label */}
      <text x="130" y="198" fill={color} fontSize="11" textAnchor="middle"
            fontFamily="monospace" fillOpacity="0.75">Kolam Setengah Bola</text>
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
    diagram: <SphereSVG r="0,7 m" color="#a78bfa" extraLabel="Model Planet" />,
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
    diagram: <SphereSVG r="2 cm" color="#fbbf24" extraLabel="× 6 bola" />,
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
    diagram: <HalfSphereSVG r="7 m" color="#34d399" />,
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
    diagram: <SphereSVG r="5 m" color="#fbbf24" extraLabel="Balon Udara" />,
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
                        {!isRevealed ? (
                          <button onClick={() => handleReveal(q.n)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-all cursor-pointer font-body">
                            Lihat Jawaban
                          </button>
                        ) : (
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
