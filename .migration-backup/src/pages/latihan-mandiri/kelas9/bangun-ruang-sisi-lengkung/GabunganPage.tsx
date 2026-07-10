import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type OptionKey = "A" | "B" | "C" | "D";
type Cat = "tab-ker" | "tab-hemi" | "ker-hemi" | "campuran";

const CAT_LABELS: Record<Cat, { icon: string; label: string; color: string }> = {
  "tab-ker":  { icon: "🔺", label: "Tabung + Kerucut",   color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  "tab-hemi": { icon: "🧪", label: "Tabung + ½ Bola",    color: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
  "ker-hemi": { icon: "🍦", label: "Kerucut + ½ Bola",   color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  "campuran": { icon: "🧩", label: "Gabungan Campuran",   color: "text-green-400 border-green-500/30 bg-green-500/10" },
};

type QMC = {
  n: number; title: string; cat: Cat;
  content: string;
  diagram?: React.ReactNode;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
};

/* ═══════════════════════════════════════════════
   SVG: No 1 — TENDA KEMPING (Tabung + Kerucut)
═══════════════════════════════════════════════ */
function TendaKempingSVG({ r, tTab, tKer }: { r: number; tTab: number; tKer: number }) {
  return (
    <svg viewBox="0 0 320 260" width="100%" style={{ maxWidth: 300, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="tentGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="tentRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <radialGradient id="tentFloorRg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#166534" stopOpacity="0.5" />
        </radialGradient>
      </defs>

      {/* Ground */}
      <ellipse cx="155" cy="228" rx="115" ry="16" fill="url(#groundGrad)" fillOpacity="0.35" />

      {/* Tent body (cylinder front view) */}
      {/* Back wall */}
      <rect x="65" y="148" width="180" height="78" fill="url(#tentGrad)" fillOpacity="0.20" rx="2" />
      {/* Left wall */}
      <rect x="65" y="148" width="180" height="78" fill="none" stroke="#047857" strokeWidth="1.8" rx="2" />
      {/* Top ellipse of cylinder */}
      <ellipse cx="155" cy="148" rx="90" ry="18" fill="#d1fae5" fillOpacity="0.18" stroke="#047857" strokeWidth="1.5" strokeDasharray="6,4" />
      {/* Bottom ellipse */}
      <ellipse cx="155" cy="226" rx="90" ry="18" fill="#047857" fillOpacity="0.28" stroke="#047857" strokeWidth="1.8" />

      {/* Door opening */}
      <path d="M 130 226 Q 130 185 155 185 Q 180 185 180 226 Z"
        fill="#0f172a" fillOpacity="0.7" stroke="#65a30d" strokeWidth="1.2" />
      <path d="M 143 226 Q 143 195 155 195 Q 157 195 157 226 Z"
        fill="#1e3a5f" fillOpacity="0.5" />

      {/* Cone roof */}
      <polygon points="155,48 65,148 245,148"
        fill="url(#tentRoof)" fillOpacity="0.82" stroke="#047857" strokeWidth="1.8" />
      {/* Roof ridge line */}
      <line x1="155" y1="48" x2="155" y2="148" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="5,4" strokeOpacity="0.6" />
      {/* Roof ellipse at junction */}
      <ellipse cx="155" cy="148" rx="90" ry="18" fill="none" stroke="#047857" strokeWidth="1.5" />

      {/* Guy ropes */}
      <line x1="155" y1="55" x2="70" y2="230" stroke="#a3e635" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4,3" />
      <line x1="155" y1="55" x2="240" y2="230" stroke="#a3e635" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4,3" />
      <circle cx="70" cy="232" r="3" fill="#a3e635" fillOpacity="0.7" />
      <circle cx="240" cy="232" r="3" fill="#a3e635" fillOpacity="0.7" />

      {/* Dimension: t kerucut */}
      <line x1="258" y1="48" x2="258" y2="148" stroke="#a3e635" strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="252" y1="48" x2="264" y2="48" stroke="#a3e635" strokeWidth="1.2" />
      <line x1="252" y1="148" x2="264" y2="148" stroke="#a3e635" strokeWidth="1.2" />
      <text x="268" y="102" fill="#a3e635" fontSize="12" fontFamily="monospace" fontWeight="bold">t={tKer}m</text>

      {/* Dimension: t tabung */}
      <line x1="258" y1="148" x2="258" y2="226" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="252" y1="148" x2="264" y2="148" stroke="#34d399" strokeWidth="1.2" />
      <line x1="252" y1="226" x2="264" y2="226" stroke="#34d399" strokeWidth="1.2" />
      <text x="268" y="192" fill="#34d399" fontSize="12" fontFamily="monospace" fontWeight="bold">t={tTab}m</text>

      {/* Radius label */}
      <line x1="155" y1="226" x2="245" y2="226" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7" />
      <text x="192" y="244" fill="#6ee7b7" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}m</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 2 — MODEL ROKET (Tabung + Kerucut)
═══════════════════════════════════════════════ */
function ModelRoketSVG({ r, tTab, tKer }: { r: number; tTab: number; tKer: number }) {
  return (
    <svg viewBox="0 0 300 280" width="100%" style={{ maxWidth: 260, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="rocketNose" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="rocketFin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="nozzle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <radialGradient id="flame" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Fins */}
      <polygon points="100,198 84,238 100,222" fill="url(#rocketFin)" stroke="#92400e" strokeWidth="1" />
      <polygon points="160,198 176,238 160,222" fill="url(#rocketFin)" stroke="#92400e" strokeWidth="1" />

      {/* Nozzle */}
      <path d="M 108 222 Q 130 232 152 222 L 148 210 Q 130 216 112 210 Z"
        fill="url(#nozzle)" stroke="#374151" strokeWidth="1" />

      {/* Rocket body (cylinder) */}
      <rect x="100" y="88" width="60" height="134" fill="url(#rocketBody)" />
      {/* Body left/right highlight */}
      <rect x="100" y="88" width="8" height="134" fill="white" fillOpacity="0.15" />
      {/* Body stripes */}
      <rect x="100" y="140" width="60" height="12" fill="white" fillOpacity="0.12" />
      {/* Window */}
      <circle cx="130" cy="168" r="10" fill="#bfdbfe" fillOpacity="0.85" stroke="#1d4ed8" strokeWidth="1.5" />
      <circle cx="130" cy="168" r="6" fill="#93c5fd" fillOpacity="0.6" />
      <ellipse cx="127" cy="165" rx="3" ry="2" fill="white" fillOpacity="0.5" />

      {/* Top ellipse */}
      <ellipse cx="130" cy="88" rx="30" ry="7" fill="#ef4444" fillOpacity="0.7" stroke="#991b1b" strokeWidth="1.2" />

      {/* Nose cone */}
      <path d="M 100 88 Q 115 40 130 20 Q 145 40 160 88 Z" fill="url(#rocketNose)" stroke="#6b7280" strokeWidth="1" />
      <ellipse cx="130" cy="88" rx="30" ry="7" fill="#d1d5db" fillOpacity="0.4" stroke="#9ca3af" strokeWidth="1" />

      {/* Flame exhaust */}
      <ellipse cx="130" cy="236" rx="16" ry="28" fill="url(#flame)" fillOpacity="0.85" />
      <ellipse cx="122" cy="240" rx="7" ry="18" fill="#fef9c3" fillOpacity="0.5" />

      {/* Stars decoration */}
      {[[94,110],[168,120],[92,175],[170,160]].map(([sx,sy],i)=>(
        <text key={i} x={sx} y={sy} fill="#fbbf24" fontSize="9" opacity="0.6">★</text>
      ))}

      {/* Dimension: t kerucut (nose) */}
      <line x1="174" y1="20" x2="174" y2="88" stroke="#9ca3af" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="168" y1="20" x2="180" y2="20" stroke="#9ca3af" strokeWidth="1.2" />
      <line x1="168" y1="88" x2="180" y2="88" stroke="#9ca3af" strokeWidth="1.2" />
      <text x="182" y="58" fill="#9ca3af" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tKer}</text>

      {/* Dimension: t tabung */}
      <line x1="174" y1="88" x2="174" y2="222" stroke="#fca5a5" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="168" y1="88" x2="180" y2="88" stroke="#fca5a5" strokeWidth="1.2" />
      <line x1="168" y1="222" x2="180" y2="222" stroke="#fca5a5" strokeWidth="1.2" />
      <text x="182" y="160" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tTab}</text>

      {/* Radius label */}
      <line x1="130" y1="88" x2="160" y2="88" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.8" />
      <text x="134" y="104" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">r={r}</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 3 — TENDA PRAMUKA (Tabung + Kerucut, luas kain)
═══════════════════════════════════════════════ */
function TendaPramukaSVG({ r, tTab, sKer }: { r: number; tTab: number; sKer: number }) {
  return (
    <svg viewBox="0 0 320 260" width="100%" style={{ maxWidth: 300, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="pramRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="pramBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="pramGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
      </defs>

      {/* Ground */}
      <ellipse cx="155" cy="232" rx="120" ry="14" fill="url(#pramGround)" fillOpacity="0.28" />

      {/* Body — cylinder front */}
      <rect x="75" y="165" width="160" height="65" fill="url(#pramBody)" fillOpacity="0.25" />
      <line x1="75" y1="165" x2="75" y2="230" stroke="#b45309" strokeWidth="1.8" />
      <line x1="235" y1="165" x2="235" y2="230" stroke="#b45309" strokeWidth="1.8" />
      <ellipse cx="155" cy="230" rx="80" ry="14" fill="#92400e" fillOpacity="0.28" stroke="#b45309" strokeWidth="1.5" />
      <ellipse cx="155" cy="165" rx="80" ry="14" fill="#fde68a" fillOpacity="0.18" stroke="#b45309" strokeWidth="1.3" strokeDasharray="5,4" />

      {/* Door */}
      <path d="M 137 230 Q 137 195 155 192 Q 173 195 173 230 Z"
        fill="#0f172a" fillOpacity="0.65" stroke="#b45309" strokeWidth="1" />

      {/* Roof — cone */}
      <polygon points="155,55 75,165 235,165"
        fill="url(#pramRoof)" fillOpacity="0.88" stroke="#b45309" strokeWidth="1.8" />
      <ellipse cx="155" cy="165" rx="80" ry="14" fill="none" stroke="#b45309" strokeWidth="1.5" />

      {/* Ridge */}
      <line x1="155" y1="58" x2="155" y2="165" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,4" strokeOpacity="0.5" />

      {/* Flag at top */}
      <line x1="155" y1="55" x2="155" y2="28" stroke="#78716c" strokeWidth="1.5" />
      <polygon points="155,28 172,36 155,44" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />

      {/* Guy ropes */}
      <line x1="155" y1="58" x2="58" y2="234" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.55" />
      <line x1="155" y1="58" x2="252" y2="234" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.55" />

      {/* Selimut label — show slant height s */}
      <line x1="240" y1="55" x2="240" y2="165" stroke="#fbbf24" strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="234" y1="55" x2="246" y2="55" stroke="#fbbf24" strokeWidth="1.2" />
      <line x1="234" y1="165" x2="246" y2="165" stroke="#fbbf24" strokeWidth="1.2" />
      <text x="250" y="115" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">s={sKer}m</text>

      {/* t tabung */}
      <line x1="240" y1="165" x2="240" y2="230" stroke="#d97706" strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="234" y1="165" x2="246" y2="165" stroke="#d97706" strokeWidth="1.2" />
      <line x1="234" y1="230" x2="246" y2="230" stroke="#d97706" strokeWidth="1.2" />
      <text x="250" y="203" fill="#d97706" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tTab}m</text>

      {/* radius */}
      <line x1="155" y1="230" x2="235" y2="230" stroke="#fde68a" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.8" />
      <text x="188" y="248" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}m</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 4 — TANGKI INDUSTRI (Tabung + ½ Bola)
═══════════════════════════════════════════════ */
function TangkiSVG({ r, tTab }: { r: number; tTab: number }) {
  return (
    <svg viewBox="0 0 320 280" width="100%" style={{ maxWidth: 300, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="tankBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="tankDome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="tankBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Support legs */}
      <rect x="100" y="228" width="12" height="30" fill="url(#tankBase)" rx="2" />
      <rect x="168" y="228" width="12" height="30" fill="url(#tankBase)" rx="2" />
      <line x1="95" y1="250" x2="185" y2="250" stroke="#475569" strokeWidth="2" />

      {/* Cylinder body */}
      <rect x="90" y="108" width="100" height="122" fill="url(#tankBody)" />
      {/* Cylinder highlights */}
      <rect x="90" y="108" width="10" height="122" fill="white" fillOpacity="0.18" />
      <rect x="180" y="108" width="10" height="122" fill="#0f172a" fillOpacity="0.25" />

      {/* Bolt rings */}
      {[138, 178, 208].map((y, i) => (
        <g key={i}>
          <ellipse cx="140" cy={y} rx="50" ry="6" fill="none" stroke="#64748b" strokeWidth="2.5" />
          {[-40,-20,0,20,40].map((dx, j) => (
            <circle key={j} cx={140+dx} cy={y} r="2" fill="#94a3b8" />
          ))}
        </g>
      ))}

      {/* Bottom ellipse */}
      <ellipse cx="140" cy="230" rx="50" ry="10" fill="url(#tankBase)" stroke="#1e293b" strokeWidth="1.5" />

      {/* Dome top (hemisphere) */}
      <path d="M 90 108 A 50 50 0 0 1 190 108" fill="url(#tankDome)" stroke="#64748b" strokeWidth="1.5" />
      {/* Dome highlight */}
      <path d="M 95 108 A 44 44 0 0 1 160 85" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Pipe connection */}
      <rect x="136" y="60" width="8" height="20" fill="#475569" stroke="#334155" strokeWidth="1" />
      <ellipse cx="140" cy="60" rx="8" ry="3" fill="#64748b" stroke="#334155" strokeWidth="1" />
      <rect x="130" y="56" width="20" height="6" fill="#64748b" rx="2" />

      {/* Top ellipse (hidden, dome base) */}
      <ellipse cx="140" cy="108" rx="50" ry="10" fill="none" stroke="#64748b" strokeWidth="1.3" strokeDasharray="5,4" />

      {/* Dimension: t tabung */}
      <line x1="202" y1="108" x2="202" y2="230" stroke="#94a3b8" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="196" y1="108" x2="208" y2="108" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="196" y1="230" x2="208" y2="230" stroke="#94a3b8" strokeWidth="1.2" />
      <text x="212" y="174" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tTab}</text>

      {/* Dimension: r */}
      <line x1="140" y1="230" x2="190" y2="230" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7" />
      <text x="157" y="248" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}</text>

      {/* Label dome */}
      <text x="60" y="85" fill="#cbd5e1" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">½ Bola</text>
      <line x1="76" y1="87" x2="105" y2="96" stroke="#cbd5e1" strokeWidth="0.8" strokeOpacity="0.6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 5 — MENARA AIR (Tabung + ½ Bola on legs)
═══════════════════════════════════════════════ */
function MenaraAirSVG({ r, tTab }: { r: number; tTab: number }) {
  return (
    <svg viewBox="0 0 320 300" width="100%" style={{ maxWidth: 300, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="maTank" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="45%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="maDome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="55%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="maLeg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Support legs (4 legs, shown as 2 in perspective) */}
      <line x1="108" y1="192" x2="82" y2="285" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
      <line x1="172" y1="192" x2="198" y2="285" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
      <line x1="118" y1="192" x2="100" y2="285" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <line x1="162" y1="192" x2="180" y2="285" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

      {/* Cross braces */}
      <line x1="88" y1="256" x2="194" y2="228" stroke="#64748b" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="88" y1="228" x2="194" y2="256" stroke="#64748b" strokeWidth="2" strokeOpacity="0.7" />

      {/* Ground base */}
      <ellipse cx="140" cy="284" rx="72" ry="10" fill="#1e293b" fillOpacity="0.4" />
      <line x1="70" y1="284" x2="210" y2="284" stroke="#475569" strokeWidth="3" />

      {/* Access ladder */}
      <line x1="176" y1="130" x2="180" y2="285" stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="184" y1="130" x2="188" y2="285" stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.7" />
      {[140,158,176,194,212,230,248,266,284].map((y,i)=>(
        <line key={i} x1="176" y1={y} x2="188" y2={y} stroke="#94a3b8" strokeWidth="1.2" strokeOpacity="0.6" />
      ))}

      {/* Tank cylinder */}
      <rect x="104" y="130" width="72" height="63" fill="url(#maTank)" fillOpacity="0.88" />
      <rect x="104" y="130" width="10" height="63" fill="white" fillOpacity="0.18" />
      <rect x="166" y="130" width="10" height="63" fill="#1e3a8a" fillOpacity="0.3" />

      {/* Tank bottom ellipse */}
      <ellipse cx="140" cy="193" rx="36" ry="8" fill="#1e40af" fillOpacity="0.55" stroke="#1e3a8a" strokeWidth="1.5" />

      {/* Dome (hemisphere) */}
      <path d="M 104 130 A 36 36 0 0 1 176 130" fill="url(#maDome)" stroke="#1e40af" strokeWidth="1.5" />
      <path d="M 109 130 A 30 30 0 0 1 162 108" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />

      {/* Top pipe/vent */}
      <rect x="136" y="90" width="8" height="14" fill="#1e40af" />
      <ellipse cx="140" cy="90" rx="8" ry="3" fill="#3b82f6" />

      {/* Water ripple on dome */}
      <path d="M 118 118 Q 130 112 142 118 Q 154 124 166 118" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.3" />

      {/* Junction ellipse */}
      <ellipse cx="140" cy="130" rx="36" ry="8" fill="none" stroke="#3b82f6" strokeWidth="1.3" strokeDasharray="4,3" />

      {/* Dimension: t (height of cylinder) */}
      <line x1="190" y1="130" x2="190" y2="193" stroke="#60a5fa" strokeWidth="1.2" strokeOpacity="0.9" />
      <line x1="184" y1="130" x2="196" y2="130" stroke="#60a5fa" strokeWidth="1.2" />
      <line x1="184" y1="193" x2="196" y2="193" stroke="#60a5fa" strokeWidth="1.2" />
      <text x="198" y="166" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tTab}</text>

      {/* Radius */}
      <line x1="140" y1="193" x2="176" y2="193" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.8" />
      <text x="155" y="210" fill="#bfdbfe" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}</text>

      {/* Label */}
      <text x="55" y="104" fill="#bfdbfe" fontSize="10" fontFamily="monospace" fontWeight="bold">½ Bola</text>
      <line x1="80" y1="107" x2="108" y2="115" stroke="#bfdbfe" strokeWidth="0.8" strokeOpacity="0.6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 6 — ICE CREAM CONE (Kerucut + ½ Bola)
═══════════════════════════════════════════════ */
function IceCreamSVG({ r, tKer }: { r: number; tKer: number }) {
  return (
    <svg viewBox="0 0 280 280" width="100%" style={{ maxWidth: 240, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="iceCream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="40%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="iceCone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="iceScoopLight" cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#db2777" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Waffle cone grid */}
      <polygon points="140,270 94,140 186,140" fill="url(#iceCone)" stroke="#b45309" strokeWidth="1.5" />
      {/* Waffle pattern lines */}
      {[0.2,0.4,0.6,0.8].map((frac,i) => {
        const y = 140 + frac * 130;
        const wHalf = 46 * (1 - frac) * 0.7;
        return <line key={i} x1={140 - wHalf * 1.45} y1={y} x2={140 + wHalf * 1.45} y2={y} stroke="#b45309" strokeWidth="0.8" strokeOpacity="0.5" />;
      })}
      {[-3,-1,1,3].map((col,i) => (
        <line key={i} x1={140 + col * 10} y1={140} x2={140} y2={270} stroke="#b45309" strokeWidth="0.8" strokeOpacity="0.4" />
      ))}
      {/* Cone rim ellipse */}
      <ellipse cx="140" cy="140" rx="46" ry="10" fill="#fef3c7" fillOpacity="0.5" stroke="#b45309" strokeWidth="1.3" />

      {/* Ice cream scoop (hemisphere on top) */}
      <path d="M 94 140 A 46 46 0 0 1 186 140" fill="url(#iceCream)" stroke="#db2777" strokeWidth="1.5" />
      <circle cx="140" cy="140" r="46" fill="url(#iceCream)" fillOpacity="0.7" stroke="#db2777" strokeWidth="1.5" />
      <ellipse cx="140" cy="140" rx="46" ry="10" fill="#f9a8d4" fillOpacity="0.4" stroke="#db2777" strokeWidth="1" />
      {/* Scoop highlight */}
      <ellipse cx="122" cy="112" rx="16" ry="10" fill="url(#iceScoopLight)" />

      {/* Sprinkles */}
      {[[118,100,20],[155,95,80],[133,88,45],[165,112,130],[112,118,160]].map(([x,y,rot],i) => (
        <rect key={i} x={x-4} y={y-1.5} width="8" height="3" rx="1.5"
          fill={["#3b82f6","#a3e635","#fbbf24","#f472b6","#34d399"][i]}
          transform={`rotate(${rot},${x},${y})`} />
      ))}

      {/* Dimension labels */}
      <line x1="198" y1="140" x2="198" y2="270" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="192" y1="140" x2="204" y2="140" stroke="#f59e0b" strokeWidth="1.2" />
      <line x1="192" y1="270" x2="204" y2="270" stroke="#f59e0b" strokeWidth="1.2" />
      <text x="208" y="210" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tKer}</text>

      <line x1="140" y1="140" x2="186" y2="140" stroke="#fce7f3" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.8" />
      <text x="160" y="158" fill="#fce7f3" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}</text>

      <text x="52" y="118" fill="#f9a8d4" fontSize="10" fontFamily="monospace" fontWeight="bold">½ Bola</text>
      <line x1="80" y1="118" x2="98" y2="130" stroke="#f9a8d4" strokeWidth="0.8" strokeOpacity="0.7" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 7 — PION CATUR (Kerucut di atas ½ Bola)
   Bentuk: ½ bola (dome bawah) + kerucut (runcing atas)
═══════════════════════════════════════════════ */
function PionCaturSVG({ r, sKer }: { r: number; sKer: number }) {
  const cx = 140;
  const W = 52;          // visual half-width = radius scale
  const ell = 12;        // ellipse y-radius for 3D perspective
  const apexY = 48;      // top of cone
  const juncY = 175;     // junction: flat face of ½ bola = base of cone
  const domeBot = juncY + W; // bottom of hemisphere dome ≈ 227

  return (
    <svg viewBox="0 0 300 290" width="100%" style={{ maxWidth: 260, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="p7cone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="42%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="p7dome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="48%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="p7shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={cx} cy={domeBot + 18} rx={W + 8} ry={10} fill="url(#p7shadow)" />

      {/* ── ½ BOLA (dome bulging downward) ── */}
      {/* Body of dome */}
      <path d={`M ${cx - W} ${juncY} A ${W} ${W} 0 0 0 ${cx + W} ${juncY}`}
        fill="url(#p7dome)" stroke="#1e293b" strokeWidth="1.8" />
      {/* Highlight on dome */}
      <path d={`M ${cx - W + 8} ${juncY} A ${W - 8} ${W - 8} 0 0 0 ${cx - W * 0.3} ${juncY + W * 0.35}`}
        fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.22" strokeLinecap="round" />

      {/* Flat junction face (ellipse at top of dome = base of cone) */}
      <ellipse cx={cx} cy={juncY} rx={W} ry={ell}
        fill="#334155" fillOpacity="0.65" stroke="#64748b" strokeWidth="1.5" />

      {/* ── KERUCUT (cone, apex pointing up) ── */}
      {/* Left face */}
      <polygon points={`${cx - W},${juncY} ${cx},${apexY} ${cx},${juncY}`}
        fill="#475569" fillOpacity="0.88" />
      {/* Right face */}
      <polygon points={`${cx},${juncY} ${cx},${apexY} ${cx + W},${juncY}`}
        fill="url(#p7cone)" fillOpacity="0.88" />
      {/* Cone outline */}
      <line x1={cx - W} y1={juncY} x2={cx} y2={apexY} stroke="#1e293b" strokeWidth="1.8" />
      <line x1={cx + W} y1={juncY} x2={cx} y2={apexY} stroke="#1e293b" strokeWidth="1.8" />
      {/* Highlight edge on cone */}
      <line x1={cx - W + 6} y1={juncY} x2={cx} y2={apexY + 6}
        stroke="white" strokeWidth="1.2" strokeOpacity="0.18" />

      {/* Base ellipse of cone (= flat face of hemisphere, drawn again on top) */}
      <ellipse cx={cx} cy={juncY} rx={W} ry={ell}
        fill="none" stroke="#475569" strokeWidth="1.3" strokeDasharray="5,3" />

      {/* Apex tip cap */}
      <ellipse cx={cx} cy={apexY} rx={4} ry={2} fill="#64748b" />

      {/* ── DIMENSION LABELS ── */}
      {/* Slant height s of cone */}
      {/* slant = from apex to bottom-left of cone base */}
      <line x1="208" y1={apexY} x2="208" y2={juncY}
        stroke="#94a3b8" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="202" y1={apexY} x2="214" y2={apexY} stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="202" y1={juncY} x2="214" y2={juncY} stroke="#94a3b8" strokeWidth="1.2" />
      <text x="218" y={(apexY + juncY) / 2 + 4} fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">s={sKer}</text>

      {/* Radius at base */}
      <line x1={cx} y1={juncY} x2={cx + W} y2={juncY}
        stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.8" />
      <text x={cx + W / 2 - 2} y={juncY + 22} fill="#cbd5e1" fontSize="11"
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}</text>

      {/* Labels */}
      <text x="34" y={apexY + (juncY - apexY) / 2 + 4} fill="#94a3b8" fontSize="10"
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">Kerucut</text>
      <line x1="62" y1={apexY + (juncY - apexY) / 2} x2={cx - W} y2={apexY + (juncY - apexY) / 2}
        stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.55" />

      <text x="34" y={juncY + W / 2 + 4} fill="#cbd5e1" fontSize="10"
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">½ Bola</text>
      <line x1="62" y1={juncY + W / 2} x2={cx - W + 6} y2={juncY + W / 2}
        stroke="#cbd5e1" strokeWidth="0.8" strokeOpacity="0.55" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 8 — MENARA (½ Bola + Tabung + Kerucut)
═══════════════════════════════════════════════ */
function MenaraSVG({ r, tTab, tKer }: { r: number; tTab: number; tKer: number }) {
  return (
    <svg viewBox="0 0 320 310" width="100%" style={{ maxWidth: 300, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="towerWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="towerRoof" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="towerBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
      </defs>

      {/* Ground */}
      <ellipse cx="155" cy="285" rx="60" ry="10" fill="#064e3b" fillOpacity="0.4" />

      {/* Hemisphere base — same width as cylinder (rx=41) */}
      <path d="M 114 230 A 41 41 0 0 0 196 230" fill="url(#towerBase)" stroke="#065f46" strokeWidth="1.8" />
      <ellipse cx="155" cy="230" rx="41" ry="9" fill="#064e3b" fillOpacity="0.35" stroke="#065f46" strokeWidth="1.5" />

      {/* Cylinder tower body */}
      <rect x="114" y="100" width="82" height="130" fill="url(#towerWall)" fillOpacity="0.88" />
      <rect x="114" y="100" width="10" height="130" fill="white" fillOpacity="0.18" />
      <rect x="186" y="100" width="10" height="130" fill="#92400e" fillOpacity="0.28" />

      {/* Battlements at top */}
      {[114,130,146,162,178].map((x,i)=>(
        i%2===0 ? <rect key={i} x={x} y="92" width="12" height="12" fill="url(#towerWall)" stroke="#b45309" strokeWidth="1" /> : null
      ))}

      {/* Windows */}
      <rect x="137" y="150" width="16" height="24" rx="8" fill="#1e3a5f" fillOpacity="0.85" stroke="#78350f" strokeWidth="1" />
      <rect x="137" y="185" width="16" height="24" rx="8" fill="#1e3a5f" fillOpacity="0.85" stroke="#78350f" strokeWidth="1" />

      {/* Arrow slits */}
      <rect x="150" y="120" width="6" height="18" rx="3" fill="#1e3a5f" fillOpacity="0.7" stroke="#78350f" strokeWidth="0.8" />

      {/* Top ellipse */}
      <ellipse cx="155" cy="100" rx="41" ry="8" fill="#fbbf24" fillOpacity="0.5" stroke="#92400e" strokeWidth="1.3" strokeDasharray="5,3" />

      {/* Cone roof */}
      <polygon points="155,22 114,100 196,100" fill="url(#towerRoof)" stroke="#7f1d1d" strokeWidth="1.5" />
      <ellipse cx="155" cy="100" rx="41" ry="8" fill="none" stroke="#ef4444" strokeWidth="1.3" />
      {/* Roof lines */}
      {[-2,-1,0,1,2].map((d,i)=>(
        <line key={i} x1={155+d*12} y1={100} x2={155} y2={22} stroke="#7f1d1d" strokeWidth="0.8" strokeOpacity="0.3" />
      ))}

      {/* Flag */}
      <line x1="155" y1="22" x2="155" y2="4" stroke="#78350f" strokeWidth="1.5" />
      <polygon points="155,4 170,10 155,16" fill="#facc15" />

      {/* Dimension: t kerucut */}
      <line x1="210" y1="22" x2="210" y2="100" stroke="#fca5a5" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="204" y1="22" x2="216" y2="22" stroke="#fca5a5" strokeWidth="1.2" />
      <line x1="204" y1="100" x2="216" y2="100" stroke="#fca5a5" strokeWidth="1.2" />
      <text x="218" y="64" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tKer}</text>

      {/* Dimension: t tabung */}
      <line x1="210" y1="100" x2="210" y2="230" stroke="#fef9c3" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="204" y1="100" x2="216" y2="100" stroke="#fef9c3" strokeWidth="1.2" />
      <line x1="204" y1="230" x2="216" y2="230" stroke="#fef9c3" strokeWidth="1.2" />
      <text x="218" y="170" fill="#fef9c3" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tTab}</text>

      {/* Radius */}
      <line x1="155" y1="230" x2="196" y2="230" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.8" />
      <text x="172" y="248" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}</text>

      {/* Labels */}
      <text x="44" y="250" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontWeight="bold">½ Bola</text>
      <line x1="78" y1="247" x2="118" y2="238" stroke="#6ee7b7" strokeWidth="0.8" strokeOpacity="0.65" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 9 — EMBER SETENGAH BOLA
═══════════════════════════════════════════════ */
function EmberSetengahBolaSVG({ r }: { r: number }) {
  return (
    <svg viewBox="0 0 300 240" width="100%" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="bucketMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="bucketInside" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="waterSurface" cx="45%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#e0f7ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Shadow below */}
      <ellipse cx="150" cy="210" rx="72" ry="10" fill="#0c4a6e" fillOpacity="0.25" />

      {/* Bucket hemisphere body */}
      <path d="M 76 140 A 74 74 0 0 0 224 140" fill="url(#bucketMetal)" stroke="#0284c7" strokeWidth="2" />
      {/* Inner shadow */}
      <path d="M 82 140 A 68 68 0 0 0 218 140" fill="url(#bucketInside)" fillOpacity="0.6" />

      {/* Metal ring bands */}
      <path d="M 88 120 A 62 62 0 0 0 212 120" fill="none" stroke="#0369a1" strokeWidth="2.5" strokeOpacity="0.6" />
      <path d="M 78 140 A 72 72 0 0 0 222 140" fill="none" stroke="#0369a1" strokeWidth="2.5" />

      {/* Rim ellipse */}
      <ellipse cx="150" cy="140" rx="74" ry="15" fill="url(#waterSurface)" stroke="#0284c7" strokeWidth="2" />
      {/* Water ripple */}
      <ellipse cx="150" cy="140" rx="60" ry="10" fill="none" stroke="#7dd3fc" strokeWidth="1.2" strokeOpacity="0.5" />
      <ellipse cx="150" cy="140" rx="40" ry="6" fill="none" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />

      {/* Highlight on bowl */}
      <path d="M 86 115 Q 100 108 118 110" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />

      {/* Handle */}
      <path d="M 76 132 Q 76 78 150 74 Q 224 78 224 132"
        fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <path d="M 76 132 Q 76 80 150 76 Q 224 80 224 132"
        fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      {/* Handle attachment circles */}
      <circle cx="76" cy="132" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      <circle cx="224" cy="132" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

      {/* Dimension: r (radius of hemisphere) */}
      <line x1="150" y1="140" x2="224" y2="140" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="4,3" strokeOpacity="0.9" />
      <text x="183" y="158" fill="#7dd3fc" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r = {r} cm</text>

      {/* Height from bottom to rim */}
      <line x1="236" y1="67" x2="236" y2="140" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="230" y1="67" x2="242" y2="67" stroke="#38bdf8" strokeWidth="1.2" />
      <line x1="230" y1="140" x2="242" y2="140" stroke="#38bdf8" strokeWidth="1.2" />
      <text x="246" y="108" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">r={r}</text>
      <text x="246" y="120" fill="#38bdf8" fontSize="9" fontFamily="monospace">(tinggi)</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 10 — BENDA YANG DICAT (Tabung + ½ Bola)
═══════════════════════════════════════════════ */
function BendaCatSVG({ r, tTab }: { r: number; tTab: number }) {
  return (
    <svg viewBox="0 0 300 280" width="100%" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="catBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
        <linearGradient id="catDome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <radialGradient id="paintDrip" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* Paint drips from dome */}
      <path d="M 120 130 Q 115 155 117 170 Q 119 175 121 170" fill="url(#paintDrip)" fillOpacity="0.7" />
      <path d="M 148 125 Q 145 148 146 162 Q 148 167 150 162" fill="url(#paintDrip)" fillOpacity="0.65" />
      <path d="M 175 130 Q 178 152 176 168 Q 174 173 172 168" fill="url(#paintDrip)" fillOpacity="0.7" />
      <path d="M 133 215 Q 128 232 130 244 Q 132 249 134 244" fill="#ea580c" fillOpacity="0.5" />
      <path d="M 162 218 Q 166 235 164 248 Q 162 252 160 248" fill="#ea580c" fillOpacity="0.5" />

      {/* Cylinder body */}
      <rect x="100" y="128" width="100" height="120" fill="url(#catBody)" fillOpacity="0.9" />
      <rect x="100" y="128" width="12" height="120" fill="white" fillOpacity="0.2" />
      <rect x="188" y="128" width="12" height="120" fill="#713f12" fillOpacity="0.25" />
      {/* Cylinder left/right edges */}
      <line x1="100" y1="128" x2="100" y2="248" stroke="#b45309" strokeWidth="1.8" />
      <line x1="200" y1="128" x2="200" y2="248" stroke="#b45309" strokeWidth="1.8" />
      {/* Painted surface indicator */}
      <rect x="100" y="128" width="100" height="120" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="8,4" strokeOpacity="0.65" />

      {/* Bottom ellipse (base - NOT painted, shown as muted) */}
      <ellipse cx="150" cy="248" rx="50" ry="11" fill="#713f12" fillOpacity="0.55" stroke="#92400e" strokeWidth="1.8" />
      <text x="150" y="264" fill="#78350f" fontSize="9" fontFamily="monospace" textAnchor="middle" fontStyle="italic">alas (tidak dicat)</text>

      {/* Top ellipse */}
      <ellipse cx="150" cy="128" rx="50" ry="11" fill="#fef08a" fillOpacity="0.35" stroke="#b45309" strokeWidth="1.3" strokeDasharray="5,3" />

      {/* Dome (hemisphere on top) */}
      <path d="M 100 128 A 50 50 0 0 1 200 128" fill="url(#catDome)" stroke="#b45309" strokeWidth="1.8" />
      {/* Dome orange paint overlay */}
      <path d="M 100 128 A 50 50 0 0 1 200 128" fill="#f97316" fillOpacity="0.18" />
      <path d="M 104 128 A 44 44 0 0 1 165 104" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Paint brush */}
      <g transform="translate(215, 90) rotate(35)">
        <rect x="-4" y="-40" width="8" height="40" rx="2" fill="#92400e" />
        <rect x="-5" y="0" width="10" height="22" rx="1" fill="#d4a017" />
        <path d="M -5 22 Q 0 34 5 22" fill="#f97316" />
      </g>

      {/* Dimension labels */}
      <line x1="215" y1="128" x2="215" y2="248" stroke="#facc15" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="209" y1="128" x2="221" y2="128" stroke="#facc15" strokeWidth="1.2" />
      <line x1="209" y1="248" x2="221" y2="248" stroke="#facc15" strokeWidth="1.2" />
      <text x="224" y="192" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tTab}</text>

      <line x1="150" y1="248" x2="200" y2="248" stroke="#fef9c3" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.8" />
      <text x="172" y="276" fill="#fef9c3" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r} cm</text>

      <text x="46" y="105" fill="#fef9c3" fontSize="10" fontFamily="monospace" fontWeight="bold">½ Bola</text>
      <line x1="80" y1="105" x2="104" y2="114" stroke="#fef9c3" strokeWidth="0.8" strokeOpacity="0.65" />

      {/* Paint can icon top-left */}
      <rect x="24" y="170" width="28" height="32" rx="3" fill="#ea580c" fillOpacity="0.8" stroke="#c2410c" strokeWidth="1.2" />
      <ellipse cx="38" cy="170" rx="14" ry="4" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
      <text x="38" y="188" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CAT</text>
      <rect x="32" y="165" width="12" height="5" rx="2" fill="#c2410c" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 11 — ROKET ANTARIKSA (½ Bola + Tabung + Kerucut)
═══════════════════════════════════════════════ */
function RoketAntariksaSVG({ r, tTab, tKer }: { r: number; tTab: number; tKer: number }) {
  return (
    <svg viewBox="0 0 300 310" width="100%" style={{ maxWidth: 270, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="rocketBody2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="rocketNose2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="45%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="rocketTail2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>

      {/* Stars in background */}
      {[[52,58],[240,80],[55,180],[245,150],[48,260],[252,240]].map(([sx,sy],i)=>(
        <circle key={i} cx={sx} cy={sy} r="1.5" fill="#e2e8f0" fillOpacity="0.5" />
      ))}

      {/* Booster fins */}
      <polygon points="108,220 88,270 108,250" fill="url(#rocketTail2)" stroke="#7f1d1d" strokeWidth="1.2" />
      <polygon points="162,220 182,270 162,250" fill="url(#rocketTail2)" stroke="#7f1d1d" strokeWidth="1.2" />

      {/* Tail nozzle (cone pointing down) */}
      <polygon points="108,260 162,260 135,295" fill="url(#rocketTail2)" stroke="#7f1d1d" strokeWidth="1.2" />
      <ellipse cx="135" cy="260" rx="27" ry="7" fill="#ef4444" fillOpacity="0.5" stroke="#7f1d1d" strokeWidth="1.3" />

      {/* Body cylinder */}
      <rect x="108" y="120" width="54" height="140" fill="url(#rocketBody2)" />
      <rect x="108" y="120" width="8" height="140" fill="white" fillOpacity="0.25" />
      <rect x="154" y="120" width="8" height="140" fill="#94a3b8" fillOpacity="0.3" />
      {/* Body stripes */}
      <rect x="108" y="168" width="54" height="10" fill="#ef4444" fillOpacity="0.55" />
      <rect x="108" y="200" width="54" height="10" fill="#3b82f6" fillOpacity="0.45" />

      {/* Porthole window */}
      <circle cx="135" cy="148" r="10" fill="#bfdbfe" fillOpacity="0.85" stroke="#1d4ed8" strokeWidth="1.5" />
      <circle cx="135" cy="148" r="6" fill="#93c5fd" fillOpacity="0.6" />
      <ellipse cx="132" cy="145" rx="3" ry="2" fill="white" fillOpacity="0.5" />

      {/* Top / bottom ellipses of cylinder */}
      <ellipse cx="135" cy="120" rx="27" ry="6" fill="#f8fafc" fillOpacity="0.5" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
      <ellipse cx="135" cy="260" rx="27" ry="6" fill="#f8fafc" fillOpacity="0.3" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />

      {/* Nose hemisphere (top - half sphere) */}
      <path d="M 108 120 A 27 27 0 0 1 162 120" fill="url(#rocketNose2)" stroke="#1e40af" strokeWidth="1.8" />
      <path d="M 112 120 A 22 22 0 0 1 148 103" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
      <ellipse cx="135" cy="120" rx="27" ry="6" fill="#3b82f6" fillOpacity="0.25" stroke="#1e40af" strokeWidth="1.2" />

      {/* Dimension: t tabung */}
      <line x1="176" y1="120" x2="176" y2="260" stroke="#e2e8f0" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="170" y1="120" x2="182" y2="120" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="170" y1="260" x2="182" y2="260" stroke="#e2e8f0" strokeWidth="1.2" />
      <text x="185" y="196" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tTab}</text>

      {/* Dimension: nose hemisphere = r */}
      <line x1="80" y1="93" x2="80" y2="120" stroke="#bfdbfe" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="74" y1="93" x2="86" y2="93" stroke="#bfdbfe" strokeWidth="1.2" />
      <line x1="74" y1="120" x2="86" y2="120" stroke="#bfdbfe" strokeWidth="1.2" />
      <text x="40" y="110" fill="#bfdbfe" fontSize="10" fontFamily="monospace" fontWeight="bold">r={r}</text>
      <text x="40" y="120" fill="#bfdbfe" fontSize="9" fontFamily="monospace">(½bola)</text>

      {/* Tail cone dim */}
      <line x1="176" y1="260" x2="176" y2="295" stroke="#fca5a5" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="170" y1="260" x2="182" y2="260" stroke="#fca5a5" strokeWidth="1.2" />
      <line x1="170" y1="295" x2="182" y2="295" stroke="#fca5a5" strokeWidth="1.2" />
      <text x="185" y="282" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">t={tKer}</text>

      {/* r label */}
      <line x1="135" y1="260" x2="162" y2="260" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.7" />
      <text x="146" y="276" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={r}</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 12 — KAPSUL OBAT (Tabung + 2 Setengah Bola)
═══════════════════════════════════════════════ */
function KapsulSVG({ d, totalLen }: { d: number; totalLen: number }) {
  const VW = 360, VH = 220;
  const leftX = 80, rightX = 280;
  const cy = 90, ry = 44;
  const midX = (leftX + rightX) / 2;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ maxWidth: 340, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="capLeftBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="capRightBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
        <linearGradient id="capLeftHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="capRightHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="capLeft">
          <rect x="0" y="0" width={midX} height={VH} />
        </clipPath>
        <clipPath id="capRight">
          <rect x={midX} y="0" width={VW - midX} height={VH} />
        </clipPath>
        <filter id="capShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Full capsule shape */}
      {/* Left half (red) */}
      <g clipPath="url(#capLeft)">
        <path d={`M ${leftX} ${cy - ry} L ${midX} ${cy - ry} L ${midX} ${cy + ry} L ${leftX} ${cy + ry} A ${ry} ${ry} 0 0 1 ${leftX} ${cy - ry} Z`}
          fill="url(#capLeftBody)" filter="url(#capShadow)" />
        {/* Left highlight */}
        <path d={`M ${leftX} ${cy - ry + 4} A ${ry - 4} ${ry - 4} 0 0 1 ${leftX + 20} ${cy - ry} L ${midX} ${cy - ry} L ${midX} ${cy - ry + 20} L ${leftX + 20} ${cy - ry + 20} Z`}
          fill="url(#capLeftHi)" />
      </g>

      {/* Right half (yellow) */}
      <g clipPath="url(#capRight)">
        <path d={`M ${midX} ${cy - ry} L ${rightX} ${cy - ry} A ${ry} ${ry} 0 0 1 ${rightX} ${cy + ry} L ${midX} ${cy + ry} L ${midX} ${cy - ry} Z`}
          fill="url(#capRightBody)" filter="url(#capShadow)" />
      </g>

      {/* Dividing line */}
      <line x1={midX} y1={cy - ry} x2={midX} y2={cy + ry} stroke="#1e293b" strokeWidth="2.5" strokeOpacity="0.5" />

      {/* Capsule outline */}
      <path d={`M ${leftX} ${cy - ry} L ${rightX} ${cy - ry} A ${ry} ${ry} 0 0 1 ${rightX} ${cy + ry} L ${leftX} ${cy + ry} A ${ry} ${ry} 0 0 1 ${leftX} ${cy - ry} Z`}
        fill="none" stroke="#1e293b" strokeWidth="2" strokeOpacity="0.4" />


      {/* Diameter dimension */}
      <line x1={rightX + ry + 6} y1={cy - ry} x2={rightX + ry + 6} y2={cy + ry}
        stroke="#e2e8f0" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1={rightX + ry} y1={cy - ry} x2={rightX + ry + 12} y2={cy - ry} stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1={rightX + ry} y1={cy + ry} x2={rightX + ry + 12} y2={cy + ry} stroke="#e2e8f0" strokeWidth="1.2" />
      <text x={rightX + ry + 16} y={cy + 5} fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">d={d}</text>

      {/* Total length dimension */}
      <line x1={leftX - ry} y1={cy + ry + 22} x2={rightX + ry} y2={cy + ry + 22}
        stroke="#e2e8f0" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1={leftX - ry} y1={cy + ry + 16} x2={leftX - ry} y2={cy + ry + 28} stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1={rightX + ry} y1={cy + ry + 16} x2={rightX + ry} y2={cy + ry + 28} stroke="#e2e8f0" strokeWidth="1.2" />
      <text x={midX} y={cy + ry + 42} fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        Panjang = {totalLen} cm
      </text>

    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 13 — ANIMASI BOLA DIMASUKKAN KE TABUNG
   3 kolom × 2 baris, auto-run tanpa tombol
═══════════════════════════════════════════════ */
function AnimasiBolaTabungSVG() {
  const TOTAL_BALLS = 6;
  const INIT_H_CM = 30;
  const RISE_PER_BALL = 7 / 3; // ≈ 2.333 cm per ball

  // SVG layout — wider cylinder to fit 3 columns
  const CX = 148;
  const CYL_RX = 64;
  const CYL_EY = 13;
  const CYL_TOP_Y = 32;
  const CYL_BOT_Y = 252;
  const CYL_H_PX = CYL_BOT_Y - CYL_TOP_Y; // 220px
  const MAX_CM = 58;
  const pxPerCm = CYL_H_PX / MAX_CM;

  const BALL_R = 18;
  // 3 columns: left / center / right, each 36px apart (= 2×BALL_R spacing)
  const COL_OFFSETS = [-36, 0, 36];
  // 2 rows: bottom first (row=0), then top (row=1)
  const ballPos = (idx: number) => {
    const row = Math.floor(idx / 3); // 0 = bottom, 1 = top
    const col = idx % 3;
    return {
      x: CX + COL_OFFSETS[col],
      y: CYL_BOT_Y - BALL_R - 2 - row * (BALL_R * 2 + 2),
    };
  };

  const waterY = (cm: number) => CYL_BOT_Y - cm * pxPerCm;

  const [ballsIn, setBallsIn] = useState(0);
  const [dropProgress, setDropProgress] = useState(0);
  const [dropping, setDropping] = useState(false);
  const [done, setDone] = useState(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const ballsInRef = useRef(0);
  const droppingRef = useRef(false);
  const doneRef = useRef(false);

  const currentWaterH = INIT_H_CM + ballsIn * RISE_PER_BALL;
  const finalWaterH = INIT_H_CM + TOTAL_BALLS * RISE_PER_BALL; // 44 cm

  const startDrop = () => {
    droppingRef.current = true;
    setDropping(true);
    setDropProgress(0);
    startTimeRef.current = performance.now();
    const DURATION = 1400;
    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setDropProgress(eased);
      if (p < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        droppingRef.current = false;
        setDropping(false);
        setBallsIn(prev => {
          const next = prev + 1;
          ballsInRef.current = next;
          if (next >= TOTAL_BALLS) {
            doneRef.current = true;
            setDone(true);
          }
          return next;
        });
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  // Auto-start on mount; chain after each ball lands
  useEffect(() => {
    if (doneRef.current || droppingRef.current) return;
    if (ballsInRef.current >= TOTAL_BALLS) return;
    const delay = ballsIn === 0 ? 700 : 450;
    const timer = setTimeout(() => {
      if (!doneRef.current && !droppingRef.current && ballsInRef.current < TOTAL_BALLS) {
        startDrop();
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [ballsIn, dropping, done]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const handleReset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    doneRef.current = false;
    droppingRef.current = false;
    ballsInRef.current = 0;
    setBallsIn(0);
    setDropProgress(0);
    setDropping(false);
    setDone(false);
  };

  // Auto-loop: restart animation 2.5s after completing
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => {
      handleReset();
    }, 2500);
    return () => clearTimeout(timer);
  }, [done]);

  const dropTarget = ballPos(Math.min(ballsIn, TOTAL_BALLS - 1));
  const dropCurrentY = (CYL_TOP_Y - 28) + dropProgress * (dropTarget.y - (CYL_TOP_Y - 28));

  const uid = "abt13";
  const wY = waterY(currentWaterH);
  const wP0 = `M ${CX - CYL_RX} ${wY} Q ${CX} ${wY - 5} ${CX + CYL_RX} ${wY} L ${CX + CYL_RX} ${CYL_BOT_Y} L ${CX - CYL_RX} ${CYL_BOT_Y} Z`;
  const wP1 = `M ${CX - CYL_RX} ${wY} Q ${CX} ${wY + 5} ${CX + CYL_RX} ${wY} L ${CX + CYL_RX} ${CYL_BOT_Y} L ${CX - CYL_RX} ${CYL_BOT_Y} Z`;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 330 300" width="100%" style={{ maxWidth: 310, display: "block" }}>
        <defs>
          <linearGradient id={`${uid}-wg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id={`${uid}-bg`} cx="30%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
          <clipPath id={`${uid}-cl`}>
            <rect x={CX - CYL_RX} y={CYL_TOP_Y} width={CYL_RX * 2} height={CYL_BOT_Y - CYL_TOP_Y + 2} />
          </clipPath>
        </defs>

        {/* Static 30cm guide line (always visible) */}
        <line x1={CX - CYL_RX - 4} y1={waterY(INIT_H_CM)} x2={CX + CYL_RX + 4} y2={waterY(INIT_H_CM)}
          stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="5,3" strokeOpacity="0.7" />
        <text x={CX - CYL_RX - 8} y={waterY(INIT_H_CM) + 4} fill="#fbbf24" fontSize="10"
          fontFamily="monospace" fontWeight="bold" textAnchor="end">30 cm</text>

        {/* Water body */}
        <g clipPath={`url(#${uid}-cl)`}>
          <path fill={`url(#${uid}-wg)`} d={wP0}>
            {!done && (
              <animate attributeName="d" dur="2s" repeatCount="indefinite"
                values={`${wP0};${wP1};${wP0}`} calcMode="spline"
                keySplines="0.5 0 0.5 1;0.5 0 0.5 1" keyTimes="0;0.5;1" />
            )}
          </path>
        </g>

        {/* Balls already in cylinder (3-column layout) */}
        {Array.from({ length: ballsIn }, (_, i) => {
          const pos = ballPos(i);
          return (
            <g key={i} clipPath={`url(#${uid}-cl)`}>
              <circle cx={pos.x} cy={pos.y} r={BALL_R}
                fill={`url(#${uid}-bg)`} stroke="#475569" strokeWidth="1.2" />
              <ellipse cx={pos.x - BALL_R * 0.28} cy={pos.y - BALL_R * 0.28}
                rx={BALL_R * 0.22} ry={BALL_R * 0.13} fill="white" fillOpacity="0.32" />
            </g>
          );
        })}

        {/* Currently dropping ball */}
        {dropping && ballsIn < TOTAL_BALLS && (
          <g>
            <circle cx={dropTarget.x} cy={dropCurrentY} r={BALL_R}
              fill={`url(#${uid}-bg)`} stroke="#475569" strokeWidth="1.2" />
            <ellipse cx={dropTarget.x - BALL_R * 0.28} cy={dropCurrentY - BALL_R * 0.28}
              rx={BALL_R * 0.22} ry={BALL_R * 0.13} fill="white" fillOpacity="0.32" />
          </g>
        )}


        {/* Ball counter chip */}
        <text x={CX + CYL_RX + 6} y={CYL_TOP_Y + 16} fill="#e2e8f0" fontSize="11"
          fontFamily="monospace" fontWeight="bold">
          {ballsIn}/{TOTAL_BALLS}🔵
        </text>

        {/* CYLINDER walls (drawn last to clip overflow) */}
        <line x1={CX - CYL_RX} y1={CYL_TOP_Y} x2={CX - CYL_RX} y2={CYL_BOT_Y} stroke="#38bdf8" strokeWidth="2.2" />
        <line x1={CX + CYL_RX} y1={CYL_TOP_Y} x2={CX + CYL_RX} y2={CYL_BOT_Y} stroke="#38bdf8" strokeWidth="2.2" />
        <ellipse cx={CX} cy={CYL_BOT_Y} rx={CYL_RX} ry={CYL_EY}
          fill="#0369a1" fillOpacity="0.22" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx={CX} cy={CYL_TOP_Y} rx={CYL_RX} ry={CYL_EY}
          fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5,4" strokeOpacity="0.7" />

        {/* Diameter label */}
        <line x1={CX - CYL_RX} y1={CYL_BOT_Y + 16} x2={CX + CYL_RX} y2={CYL_BOT_Y + 16}
          stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1={CX - CYL_RX} y1={CYL_BOT_Y + 10} x2={CX - CYL_RX} y2={CYL_BOT_Y + 22}
          stroke="#38bdf8" strokeWidth="1.2" />
        <line x1={CX + CYL_RX} y1={CYL_BOT_Y + 10} x2={CX + CYL_RX} y2={CYL_BOT_Y + 22}
          stroke="#38bdf8" strokeWidth="1.2" />
        <text x={CX} y={CYL_BOT_Y + 32} fill="#38bdf8" fontSize="11"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">d = 28 cm</text>

      </svg>

      <div className="text-xs text-white/50 font-body text-center">
        {done
          ? "✅ Selesai! Tinggi air = 44 cm"
          : dropping
            ? `⬇ Memasukkan bola ${ballsIn + 1}...`
            : ballsIn === 0 ? "⏳ Memulai..." : "⏳ Siap bola berikutnya..."}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 14 — BOLA SEPAK DI DALAM TABUNG
═══════════════════════════════════════════════ */
function BolaDalamTabungSVG({ color = "#34d399" }: { color?: string }) {
  const VW = 240, VH = 210;
  const cx = 120;
  const sr = 64;   // sphere radius
  const ell = 16;
  const scy = 106;
  const topY = scy - sr;
  const botY = scy + sr;
  const cylW = sr;

  // Soccer ball patch helper (pentagon-like irregular shapes, clipped to sphere)
  // Coordinates relative to sphere center (cx, scy)
  const pt = (dx: number, dy: number) => `${cx + dx},${scy + dy}`;
  const patches = [
    // Top center pentagon
    `${pt(0, -sr + 2)} ${pt(-18, -sr + 20)} ${pt(-10, -sr + 38)} ${pt(10, -sr + 38)} ${pt(18, -sr + 20)}`,
    // Upper-left patch
    `${pt(-sr + 4, -16)} ${pt(-sr + 20, -sr + 22)} ${pt(-sr + 38, -sr + 16)} ${pt(-sr + 40, 0)} ${pt(-sr + 22, 8)}`,
    // Upper-right patch
    `${pt(sr - 4, -16)} ${pt(sr - 20, -sr + 22)} ${pt(sr - 38, -sr + 16)} ${pt(sr - 40, 0)} ${pt(sr - 22, 8)}`,
    // Lower-left patch
    `${pt(-sr + 8, 26)} ${pt(-sr + 24, 14)} ${pt(-sr + 36, 30)} ${pt(-sr + 26, 46)} ${pt(-sr + 8, 44)}`,
    // Lower-right patch
    `${pt(sr - 8, 26)} ${pt(sr - 24, 14)} ${pt(sr - 36, 30)} ${pt(sr - 26, 46)} ${pt(sr - 8, 44)}`,
    // Bottom patch
    `${pt(-16, sr - 4)} ${pt(-22, sr - 22)} ${pt(0, sr - 32)} ${pt(22, sr - 22)} ${pt(16, sr - 4)}`,
  ];

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ maxWidth: 220, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="b14soccerGrad" cx="35%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
        <clipPath id="b14soccerClip">
          <circle cx={cx} cy={scy} r={sr} />
        </clipPath>
      </defs>

      {/* Cylinder */}
      <rect x={cx - cylW} y={topY} width={cylW * 2} height={botY - topY} fill={color} fillOpacity="0.05" />
      <line x1={cx - cylW} y1={topY} x2={cx - cylW} y2={botY} stroke={color} strokeWidth={2} />
      <line x1={cx + cylW} y1={topY} x2={cx + cylW} y2={botY} stroke={color} strokeWidth={2} />
      <ellipse cx={cx} cy={botY} rx={cylW} ry={ell} fill={color} fillOpacity="0.18" stroke={color} strokeWidth={2} />
      <ellipse cx={cx} cy={topY} rx={cylW} ry={ell} fill={color} fillOpacity="0.12" stroke={color} strokeWidth={1.5} strokeDasharray="6,4" />

      {/* Soccer ball — white base */}
      <circle cx={cx} cy={scy} r={sr} fill="url(#b14soccerGrad)" stroke="#334155" strokeWidth={2} />

      {/* Black patches (clipped to sphere) */}
      <g clipPath="url(#b14soccerClip)" fill="#1e293b" fillOpacity="0.88">
        {patches.map((pts, i) => (
          <polygon key={i} points={pts} />
        ))}
      </g>

      {/* Stitching lines between patches (subtle) */}
      <g clipPath="url(#b14soccerClip)" fill="none" stroke="#64748b" strokeWidth="0.9" strokeOpacity="0.55">
        <line x1={cx} y1={scy - sr + 38} x2={cx - 18} y2={scy - sr + 55} />
        <line x1={cx} y1={scy - sr + 38} x2={cx + 18} y2={scy - sr + 55} />
        <line x1={cx - sr + 38} y1={scy - sr + 16} x2={cx - sr + 22} y2={scy + 8} />
        <line x1={cx + sr - 38} y1={scy - sr + 16} x2={cx + sr - 22} y2={scy + 8} />
        <line x1={cx - sr + 22} y1={scy + 8} x2={cx - sr + 24} y2={scy + 14} />
        <line x1={cx + sr - 22} y1={scy + 8} x2={cx + sr - 24} y2={scy + 14} />
        <line x1={cx - sr + 36} y1={scy + 30} x2={cx - 22} y2={scy + sr - 22} />
        <line x1={cx + sr - 36} y1={scy + 30} x2={cx + 22} y2={scy + sr - 22} />
      </g>

      {/* Sphere outline */}
      <circle cx={cx} cy={scy} r={sr} fill="none" stroke="#334155" strokeWidth={2} />

      {/* Highlight */}
      <ellipse cx={cx - sr * 0.3} cy={scy - sr * 0.32} rx={sr * 0.16} ry={sr * 0.1}
        fill="white" fillOpacity="0.5" />

      {/* Equator dashed line */}
      <ellipse cx={cx} cy={scy} rx={sr} ry={ell} fill="none" stroke="#475569"
        strokeWidth={1} strokeDasharray="5,3" strokeOpacity="0.55" />

      {/* Radius label */}
      <line x1={cx} y1={scy} x2={cx + sr} y2={scy} stroke={color} strokeWidth={1}
        strokeDasharray="4,3" strokeOpacity="0.85" />
      <text x={cx + sr / 2} y={scy - 6} fill={color} fontSize="13"
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SVG: No 15 — BOLA DALAM TABUNG BERISI AIR PENUH
═══════════════════════════════════════════════ */
function BolaDalamTabungAirPenuhSVG({ d }: { d: number }) {
  const cx = 130, sr = 58, ell = 14;
  const scy = 110;
  const topY = scy - sr;
  const botY = scy + sr;
  const cylW = sr;
  const uid = "b15";
  return (
    <svg viewBox="0 0 280 250" width="100%" style={{ maxWidth: 260, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id={`${uid}-wg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.78" />
        </linearGradient>
        <radialGradient id={`${uid}-bg`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </radialGradient>
        <clipPath id={`${uid}-cl`}>
          <rect x={cx - cylW} y={topY - 2} width={cylW * 2} height={botY - topY + 4} />
        </clipPath>
      </defs>

      {/* Water fill (full — to the top of cylinder) */}
      <rect x={cx - cylW} y={topY} width={cylW * 2} height={botY - topY}
        fill={`url(#${uid}-wg)`} clipPath={`url(#${uid}-cl)`} />
      {/* Water ripple at top */}
      <path d={`M ${cx - cylW} ${topY} Q ${cx} ${topY - 5} ${cx + cylW} ${topY}`}
        fill="#bae6fd" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1" />

      {/* Cylinder walls */}
      <rect x={cx - cylW} y={topY} width={cylW * 2} height={botY - topY} fill="#38bdf8" fillOpacity="0.04" />
      <line x1={cx - cylW} y1={topY} x2={cx - cylW} y2={botY} stroke="#38bdf8" strokeWidth="2" />
      <line x1={cx + cylW} y1={topY} x2={cx + cylW} y2={botY} stroke="#38bdf8" strokeWidth="2" />

      {/* Bottom ellipse */}
      <ellipse cx={cx} cy={botY} rx={cylW} ry={ell}
        fill="#0369a1" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />

      {/* Top ellipse (open top, water overflows at brim) */}
      <ellipse cx={cx} cy={topY} rx={cylW} ry={ell}
        fill="#bae6fd" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.8" />
      {/* "PENUH" overflow drip */}
      <path d={`M ${cx + cylW - 4} ${topY} Q ${cx + cylW + 4} ${topY + 10} ${cx + cylW + 2} ${topY + 22}`}
        fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />

      {/* Ball (iron sphere) inside */}
      <circle cx={cx} cy={scy} r={sr}
        fill={`url(#${uid}-bg)`} stroke="#475569" strokeWidth="1.8" clipPath={`url(#${uid}-cl)`} />
      <ellipse cx={cx - sr * 0.28} cy={scy - sr * 0.28}
        rx={sr * 0.2} ry={sr * 0.12} fill="white" fillOpacity="0.3" />
      <ellipse cx={cx} cy={scy} rx={sr} ry={ell}
        fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3" strokeOpacity="0.5" clipPath={`url(#${uid}-cl)`} />

      {/* Shimmer on water */}
      {[[cx - 18, topY + 22], [cx + 10, topY + 30]].map(([lx, ly], i) => (
        <line key={i} x1={lx} y1={ly} x2={lx + 14} y2={ly}
          stroke="white" strokeWidth="1.3" strokeOpacity="0.25" />
      ))}

      {/* Dimension: diameter (d) */}
      <line x1={cx} y1={botY + 14} x2={cx + cylW} y2={botY + 14}
        stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1={cx} y1={botY + 8} x2={cx} y2={botY + 20} stroke="#38bdf8" strokeWidth="1.2" />
      <line x1={cx + cylW} y1={botY + 8} x2={cx + cylW} y2={botY + 20} stroke="#38bdf8" strokeWidth="1.2" />
      <text x={cx + cylW / 2} y={botY + 32} fill="#38bdf8" fontSize="11"
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">d={d} cm</text>

      {/* Dimension: height = d */}
      <line x1={cx + cylW + 14} y1={topY} x2={cx + cylW + 14} y2={botY}
        stroke="#7dd3fc" strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1={cx + cylW + 8} y1={topY} x2={cx + cylW + 20} y2={topY} stroke="#7dd3fc" strokeWidth="1.2" />
      <line x1={cx + cylW + 8} y1={botY} x2={cx + cylW + 20} y2={botY} stroke="#7dd3fc" strokeWidth="1.2" />
      <text x={cx + cylW + 24} y={scy + 4} fill="#7dd3fc" fontSize="11"
        fontFamily="monospace" fontWeight="bold">t={d}</text>
      <text x={cx + cylW + 24} y={scy + 16} fill="#7dd3fc" fontSize="9"
        fontFamily="monospace">cm</text>

      {/* Label bola */}
      <text x={cx - 16} y={scy + 5} fill="white" fontSize="10"
        fontFamily="monospace" fontWeight="bold" fillOpacity="0.65" textAnchor="middle">Bola besi</text>

      {/* Label air */}
      <text x={cx - cylW - 8} y={topY + 28} fill="#bae6fd" fontSize="9"
        fontFamily="monospace" fillOpacity="0.75" textAnchor="end">Air</text>
      <text x={cx - cylW - 8} y={topY + 40} fill="#bae6fd" fontSize="9"
        fontFamily="monospace" fillOpacity="0.75" textAnchor="end">penuh</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   SOAL PILIHAN GANDA
═══════════════════════════════════════════════ */
const mcQuestions: QMC[] = [
  {
    n: 1, title: "Volume Tenda (Tabung + Kerucut)", cat: "tab-ker",
    content: "Sebuah tenda berbentuk tabung r = 7 m, t = 3 m, dilengkapi atap kerucut r = 7 m, t = 3 m. Total volume tenda adalah …",
    diagram: <TendaKempingSVG r={7} tTab={3} tKer={3} />,
    options: [
      { key: "A", text: "462 m³" },
      { key: "B", text: "539 m³" },
      { key: "C", text: "616 m³" },
      { key: "D", text: "770 m³" },
    ],
    answer: "C",
  },
  {
    n: 2, title: "Volume Roket (Tabung + Kerucut)", cat: "tab-ker",
    content: "Model roket: tabung r = 7 cm, t = 30 cm, hidung kerucut r = 7 cm, t = 15 cm. Total volume badan roket adalah …",
    diagram: <ModelRoketSVG r={7} tTab={30} tKer={15} />,
    options: [
      { key: "A", text: "4.235 cm³" },
      { key: "B", text: "4.620 cm³" },
      { key: "C", text: "5.082 cm³" },
      { key: "D", text: "5.390 cm³" },
    ],
    answer: "D",
  },
  {
    n: 3, title: "Luas Kain Tenda (Selimut + Atap)", cat: "tab-ker",
    content: "Tenda: tabung r = 3 m, t = 2 m, atap kerucut r = 3 m, s = 5 m. Luas kain yang diperlukan adalah …",
    diagram: <TendaPramukaSVG r={3} tTab={2} sKer={5} />,
    options: [
      { key: "A", text: "47,1 m²" },
      { key: "B", text: "62,8 m²" },
      { key: "C", text: "75,36 m²" },
      { key: "D", text: "84,78 m²" },
    ],
    answer: "D",
  },
  {
    n: 4, title: "Luas Permukaan Tangki (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Tangki: tabung r = 21 cm, t = 50 cm, tutup atas setengah bola r = 21 cm. Luas permukaan luar (alas + selimut + ½ bola) adalah …",
    diagram: <TangkiSVG r={21} tTab={50} />,
    options: [
      { key: "A", text: "7.986 cm²" },
      { key: "B", text: "9.372 cm²" },
      { key: "C", text: "10.758 cm²" },
      { key: "D", text: "11.704 cm²" },
    ],
    answer: "C",
  },
  {
    n: 5, title: "Volume Menara Air (Tabung + ½ Bola)", cat: "tab-hemi",
    content: "Menara air: tabung r = 21 cm, t = 20 cm, kubah setengah bola r = 21 cm di atas. Total volume adalah …",
    diagram: <MenaraAirSVG r={21} tTab={20} />,
    options: [
      { key: "A", text: "27.720 cm³" },
      { key: "B", text: "36.960 cm³" },
      { key: "C", text: "47.124 cm³" },
      { key: "D", text: "57.288 cm³" },
    ],
    answer: "C",
  },
  {
    n: 6, title: "Volume Ice Cream (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Ice cream cone: setengah bola es krim r = 6 cm di atas kerucut r = 6 cm, t = 8 cm. Total volumenya adalah …",
    diagram: <IceCreamSVG r={6} tKer={8} />,
    options: [
      { key: "A", text: "301,44 cm³" },
      { key: "B", text: "452,16 cm³" },
      { key: "C", text: "603,2 cm³" },
      { key: "D", text: "753,6 cm³" },
    ],
    answer: "D",
  },
  {
    n: 7, title: "Luas Permukaan Pion Catur (Kerucut + ½ Bola)", cat: "ker-hemi",
    content: "Pion catur: kerucut r = 5 cm, s = 13 cm, di atas setengah bola r = 5 cm. Luas permukaan total (selimut kerucut + ½ bola) adalah …",
    diagram: <PionCaturSVG r={5} sKer={13} />,
    options: [
      { key: "A", text: "157 cm²" },
      { key: "B", text: "204,1 cm²" },
      { key: "C", text: "361,1 cm²" },
      { key: "D", text: "518,1 cm²" },
    ],
    answer: "C",
  },
  {
    n: 8, title: "Volume Menara Besar (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Menara: ½ bola r = 21 cm (dasar) + tabung r = 21 cm, t = 40 cm + kerucut r = 21 cm, t = 30 cm (puncak). Total volume adalah …",
    diagram: <MenaraSVG r={21} tTab={40} tKer={30} />,
    options: [
      { key: "A", text: "55.440 cm³" },
      { key: "B", text: "69.300 cm³" },
      { key: "C", text: "74.844 cm³" },
      { key: "D", text: "88.704 cm³" },
    ],
    answer: "D",
  },
  {
    n: 9, title: "Tinggi Air – ½ Bola ke Tabung", cat: "campuran",
    content: "Ember setengah bola r = 21 cm penuh air. Air dituangkan ke tabung r = 7 cm. Tinggi air dalam tabung adalah …",
    diagram: <EmberSetengahBolaSVG r={21} />,
    options: [
      { key: "A", text: "63 cm" },
      { key: "B", text: "84 cm" },
      { key: "C", text: "105 cm" },
      { key: "D", text: "126 cm" },
    ],
    answer: "D",
  },
  {
    n: 10, title: "Biaya Cat – Tabung + ½ Bola", cat: "campuran",
    content: "Benda: tabung r = 7 cm, t = 10 cm, dan setengah bola di atas r = 7 cm (tanpa alas). Biaya cat Rp2.000/cm². Total biaya adalah …",
    diagram: <BendaCatSVG r={7} tTab={10} />,
    options: [
      { key: "A", text: "Rp880.000" },
      { key: "B", text: "Rp1.232.000" },
      { key: "C", text: "Rp1.496.000" },
      { key: "D", text: "Rp1.848.000" },
    ],
    answer: "C",
  },
  {
    n: 11, title: "Luas Permukaan Roket (½ Bola + Tabung + Kerucut)", cat: "campuran",
    content: "Roket: ½ bola r = 5 cm (hidung) + tabung r = 5 cm, t = 10 cm + kerucut r = 5 cm, s = 13 cm, t = 12 cm (ekor). Luas permukaan luar (½ bola + selimut tabung + selimut kerucut + alas) adalah …",
    diagram: <RoketAntariksaSVG r={5} tTab={10} tKer={12} />,
    options: [
      { key: "A", text: "471 cm²" },
      { key: "B", text: "596,8 cm²" },
      { key: "C", text: "675,1 cm²" },
      { key: "D", text: "753,6 cm²" },
    ],
    answer: "D",
  },
  {
    n: 12, title: "Luas Permukaan Kapsul (Tabung + 2 Setengah Bola)", cat: "tab-hemi",
    content: "Perhatikan gambar! Sebuah bangun berbentuk kapsul (tabung dengan kedua ujung setengah bola) dengan diameter 20 cm dan panjang total 60 cm. Luas permukaan bangun tersebut adalah …",
    diagram: <KapsulSVG d={20} totalLen={60} />,
    options: [
      { key: "A", text: "400π cm²" },
      { key: "B", text: "800π cm²" },
      { key: "C", text: "1.200π cm²" },
      { key: "D", text: "1.600π cm²" },
    ],
    answer: "C",
  },
  {
    n: 13, title: "Tinggi Air Setelah Bola Dimasukkan Tabung", cat: "campuran",
    content: "Ke dalam tabung berisi air setinggi 30 cm dimasukkan 6 bola besi yang masing-masing berjari-jari 7 cm. Jika diameter tabung 28 cm, tinggi air dalam tabung setelah dimasukkan enam bola besi adalah …",
    diagram: <AnimasiBolaTabungSVG />,
    options: [
      { key: "A", text: "37 cm" },
      { key: "B", text: "42 cm" },
      { key: "C", text: "44 cm" },
      { key: "D", text: "52 cm" },
    ],
    answer: "C",
  },
  {
    n: 14, title: "Luas Permukaan Tabung (Bola di Dalam Tabung)", cat: "campuran",
    content: "Gambar di bawah adalah sebuah bola dimasukkan ke sebuah tabung. Jika luas permukaan bola 240 cm², maka luas permukaan tabung adalah …",
    diagram: <BolaDalamTabungSVG />,
    options: [
      { key: "A", text: "360 cm²" },
      { key: "B", text: "300 cm²" },
      { key: "C", text: "160 cm²" },
      { key: "D", text: "150 cm²" },
    ],
    answer: "A",
  },
  {
    n: 15, title: "Volume Air dalam Tabung dengan Bola Besi", cat: "campuran",
    content: "Sebuah bola besi berada di dalam tabung plastik terbuka di bagian atasnya. Tabung tersebut kemudian diisi dengan air sampai penuh. Jika diameter serta tinggi tabung sama dengan diameter bola yaitu 60 cm, tentukanlah volume air yang sudah tertampung oleh tabung!",
    diagram: <BolaDalamTabungAirPenuhSVG d={60} />,
    options: [
      { key: "A", text: "18.000π cm³" },
      { key: "B", text: "36.000π cm³" },
      { key: "C", text: "54.000π cm³" },
      { key: "D", text: "72.000π cm³" },
    ],
    answer: "A",
  },
];

/* ═══════════════════════════════════════════════
   HELPER COMPONENTS
═══════════════════════════════════════════════ */
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
      ? "bg-emerald-500/30 border-emerald-400 text-white"
      : "bg-white/5 border-white/10 text-white/80 hover:border-emerald-400/50 hover:bg-emerald-500/10";
  }
  if (key === answer) return "bg-emerald-500/25 border-emerald-400 text-emerald-200";
  if (selected === key && key !== answer) return "bg-rose-500/25 border-rose-400 text-rose-200 line-through";
  return "bg-white/3 border-white/8 text-white/40";
};

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
const GabunganPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🧩</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(16,185,129,0.7)' }}>
            BANGUN RUANG SISI LENGKUNG GABUNGAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
              <span className="text-emerald-400 text-xs font-bold">📋 15 {t('practice.suffixSoal')}</span>
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

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Strategi Soal Gabungan</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Volume Gabungan", formula: "V_{\\text{total}} = V_1 + V_2 + V_3 + \\ldots" },
              { label: "Luas Permukaan", formula: null },
              { label: "Tabung + Kerucut (r,t sama)", formula: "V_{\\text{ker}} = \\tfrac{1}{3}\\,V_{\\text{tab}}" },
              { label: "½ Bola (r)", formula: "V_{\\frac{1}{2}\\text{bola}} = \\tfrac{2}{3}\\pi r^3" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-emerald-400 font-bold text-[11px] sm:shrink-0 sm:w-44">{f.label}</span>
                <span className="text-white/80 text-xs">
                  {f.formula ? <InlineMath math={f.formula} /> : "Hitung bagian luar saja (bidang bersekutu diabaikan)"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-emerald-500/20" />
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2">Soal {t('practice.multipleChoice')}</span>
          <div className="h-px flex-1 bg-emerald-500/20" />
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {mcQuestions.map((q, i) => {
            const isRevealed = !!revealed[q.n];
            const sel        = selected[q.n];
            const isCorrect  = isRevealed && sel === q.answer;
            const isWrong    = isRevealed && !!sel && sel !== q.answer;
            const prevCat    = i > 0 ? mcQuestions[i - 1].cat : null;
            const showDivider = q.cat !== prevCat;
            return (
              <div key={q.n}>
                {showDivider && <CatDivider cat={q.cat} />}
                <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${i * 0.015}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
                  <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isCorrect ? "border border-emerald-500/40" : isWrong ? "border border-rose-500/40" : "border border-emerald-500/20"}`} />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
                  <div className="relative px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCorrect ? "bg-emerald-500/20 border-emerald-400/50" : isWrong ? "bg-rose-500/20 border-rose-400/50" : "bg-emerald-500/20 border-emerald-400/50"}`}>
                        <span className={`text-xs font-bold ${isCorrect ? "text-emerald-300" : isWrong ? "text-rose-300" : "text-emerald-300"}`}>{q.n}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                          {q.title}
                        </span>
                        <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>
                        {q.diagram && <div className="mb-3 w-full">{q.diagram}</div>}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          {q.options.map(opt => (
                            <button key={opt.key}
                              onClick={() => handleSelect(q.n, opt.key)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm font-body transition-all cursor-pointer ${optionStyle(opt.key, sel, q.answer, isRevealed)}`}>
                              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                                isRevealed && opt.key === q.answer                          ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
                                : isRevealed && sel === opt.key && opt.key !== q.answer     ? "border-rose-400 text-rose-300 bg-rose-500/20"
                                : sel === opt.key                                           ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
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
            {t('practice.backTo')} Bangun Ruang Sisi Lengkung
          </button>
        </div>
      </div>
    </div>
  );
};

export default GabunganPage;
