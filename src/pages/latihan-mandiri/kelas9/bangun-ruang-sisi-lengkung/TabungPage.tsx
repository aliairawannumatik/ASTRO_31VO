import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const accent = "cyan";
const accentHex = "#22d3ee";

type Choice = { label: string; text: string; math?: string };
type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  choices?: Choice[];
  answer?: string;
  diagram?: React.ReactNode;
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const groupHeaders: Record<number, string> = {
  1:  "📌 Bagian A — Unsur-Unsur Tabung",
  2:  "📐 Bagian B — Luas Permukaan Tabung",
  8:  "🔢 Bagian C — Volume Tabung",
  11: "🌍 Bagian D — Aplikasi di Kehidupan Nyata",
};

function CylinderSVG({ r, h, color = "#22d3ee", showSlant = false, extraLabel = "" }: {
  r?: string; h?: string; color?: string; showSlant?: boolean; extraLabel?: string;
}) {
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <defs>
        <linearGradient id={`cyl-fill-${r}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="50%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="50" y="45" width="120" height="110" fill={`url(#cyl-fill-${r})`} />
      <ellipse cx="110" cy="155" rx="60" ry="18" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
      <ellipse cx="110" cy="45" rx="60" ry="18" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.8" />
      <line x1="50" y1="45" x2="50" y2="155" stroke={color} strokeWidth="1.8" />
      <line x1="170" y1="45" x2="170" y2="155" stroke={color} strokeWidth="1.8" />
      {r && (
        <>
          <line x1="110" y1="45" x2="170" y2="45" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
          <text x="140" y="38" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r = {r}</text>
        </>
      )}
      {h && (
        <>
          <line x1="185" y1="45" x2="185" y2="155" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
          <line x1="181" y1="45" x2="189" y2="45" stroke={color} strokeWidth="1.2" />
          <line x1="181" y1="155" x2="189" y2="155" stroke={color} strokeWidth="1.2" />
          <text x="200" y="105" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">t = {h}</text>
        </>
      )}
      {extraLabel && (
        <text x="110" y="190" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">{extraLabel}</text>
      )}
    </svg>
  );
}

function CylinderNetSVG({ r, h, color = "#22d3ee" }: { r?: string; h?: string; color?: string }) {
  return (
    <svg viewBox="0 0 315 180" width="310" height="170" className="mx-auto">
      {/* Tutup — right edge at 108, rect starts at 110 → menempel */}
      <ellipse cx="70" cy="90" rx="38" ry="38" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" strokeDasharray="5,3" />
      <text x="70" y="95" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Tutup</text>
      {/* Selimut — x=110 s/d x=230 */}
      <rect x="110" y="30" width="120" height="120" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" />
      <text x="170" y="90" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Selimut</text>
      {h && <text x="170" y="170" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">2πr = lebar</text>}
      {/* Alas — left edge at 232, rect right edge at 230 → menempel */}
      <ellipse cx="270" cy="90" rx="38" ry="38" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" strokeDasharray="5,3" />
      <text x="270" y="95" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Alas</text>
    </svg>
  );
}

function CylinderSymbolicSVG({ color = "#22d3ee" }: { color?: string }) {
  return (
    <svg viewBox="0 0 220 210" width="220" height="210" className="mx-auto">
      <defs>
        <linearGradient id="cyl-sym-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
          <stop offset="50%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="50" y="40" width="120" height="120" fill="url(#cyl-sym-fill)" />
      <ellipse cx="110" cy="160" rx="60" ry="18" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
      <ellipse cx="110" cy="40" rx="60" ry="18" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.8" />
      <line x1="50" y1="40" x2="50" y2="160" stroke={color} strokeWidth="1.8" />
      <line x1="170" y1="40" x2="170" y2="160" stroke={color} strokeWidth="1.8" />
      <line x1="110" y1="40" x2="170" y2="40" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="140" y="33" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r</text>
      <line x1="185" y1="40" x2="185" y2="160" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="181" y1="40" x2="189" y2="40" stroke={color} strokeWidth="1.2" />
      <line x1="181" y1="160" x2="189" y2="160" stroke={color} strokeWidth="1.2" />
      <text x="204" y="105" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">2r</text>
      <text x="110" y="198" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">t = 2r, r = r</text>
    </svg>
  );
}

function SelimutRectSVG({ color = "#22d3ee" }: { color?: string }) {
  return (
    <svg viewBox="0 0 260 130" width="260" height="130" className="mx-auto">
      <rect x="20" y="20" width="180" height="80" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="2" />
      <line x1="20" y1="105" x2="200" y2="105" stroke={color} strokeWidth="1.2" />
      <text x="110" y="118" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">Panjang = 22 cm (= 2πr)</text>
      <line x1="205" y1="20" x2="205" y2="100" stroke={color} strokeWidth="1.2" />
      <text x="230" y="65" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">10 cm</text>
      <text x="110" y="67" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Selimut Tabung</text>
    </svg>
  );
}

/* ── No 11 · KOLAM RENANG ─────────────────────────────────────── */
function KolamRenangSVG() {
  return (
    <svg viewBox="0 0 280 220" width="280" height="220" className="mx-auto">
      <defs>
        <linearGradient id="kr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="kr-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="kr-wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="kr-shine" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id="kr-clip">
          <ellipse cx="140" cy="90" rx="100" ry="32" />
        </clipPath>
      </defs>

      {/* Pool wall cylinder */}
      <rect x="40" y="90" width="200" height="90" fill="url(#kr-wall)" />
      <line x1="40" y1="90" x2="40" y2="180" stroke="#38bdf8" strokeWidth="2" />
      <line x1="240" y1="90" x2="240" y2="180" stroke="#38bdf8" strokeWidth="2" />

      {/* Bottom ellipse */}
      <ellipse cx="140" cy="180" rx="100" ry="30" fill="#0369a1" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.8" />

      {/* Water fill */}
      <rect x="40" y="110" width="200" height="70" fill="url(#kr-water)" />

      {/* Water surface ellipse */}
      <ellipse cx="140" cy="110" rx="100" ry="28" fill="#7dd3fc" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="2" />
      {/* Shine on water */}
      <ellipse cx="140" cy="110" rx="100" ry="28" fill="url(#kr-shine)" />

      {/* Water ripple lines */}
      <ellipse cx="140" cy="110" rx="60" ry="16" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <ellipse cx="140" cy="110" rx="30" ry="8" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" />
      <path d="M 80 108 Q 100 103 120 108 Q 140 113 160 108 Q 180 103 200 108"
        fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M 90 115 Q 115 109 140 115 Q 165 121 190 115"
        fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.35" />

      {/* Top ellipse rim */}
      <ellipse cx="140" cy="90" rx="100" ry="30" fill="#bae6fd" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,4" />

      {/* Labels */}
      <line x1="140" y1="90" x2="240" y2="90" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="190" y="82" fill="#38bdf8" fontSize="12" textAnchor="middle" fontFamily="monospace">r = 7 m</text>
      <line x1="252" y1="90" x2="252" y2="180" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="247" y1="90" x2="257" y2="90" stroke="#38bdf8" strokeWidth="1.2" />
      <line x1="247" y1="180" x2="257" y2="180" stroke="#38bdf8" strokeWidth="1.2" />
      <text x="270" y="140" fill="#38bdf8" fontSize="12" textAnchor="middle" fontFamily="monospace">2 m</text>

      {/* Title label */}
      <text x="140" y="212" fill="#7dd3fc" fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.8">Kolam Renang</text>
    </svg>
  );
}

/* ── No 12 · TANGKI AIR ────────────────────────────────────────── */
function TangkiAirSVG() {
  return (
    <svg viewBox="0 0 260 230" width="260" height="230" className="mx-auto">
      <defs>
        <linearGradient id="tk-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#e2e8f0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="tk-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="tk-leg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Support legs */}
      <rect x="85" y="185" width="10" height="35" fill="url(#tk-leg)" rx="2" />
      <rect x="165" y="185" width="10" height="35" fill="url(#tk-leg)" rx="2" />
      <line x1="80" y1="210" x2="185" y2="210" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cross brace */}
      <line x1="85" y1="195" x2="175" y2="218" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="85" y1="218" x2="175" y2="195" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.6" />

      {/* Cylinder body */}
      <rect x="70" y="52" width="120" height="135" fill="url(#tk-body)" />
      {/* Left sheen */}
      <rect x="70" y="52" width="12" height="135" fill="white" fillOpacity="0.2" />
      {/* Right shadow */}
      <rect x="178" y="52" width="12" height="135" fill="#0f172a" fillOpacity="0.2" />

      {/* Bolt rings */}
      {[100, 140, 170].map((y, i) => (
        <g key={i}>
          <ellipse cx="130" cy={y} rx="60" ry="7" fill="none" stroke="#64748b" strokeWidth="2" />
          {[-40, -20, 0, 20, 40].map((dx, j) => (
            <circle key={j} cx={130 + dx} cy={y} r="2" fill="#94a3b8" />
          ))}
        </g>
      ))}

      {/* Bottom ellipse */}
      <ellipse cx="130" cy="187" rx="60" ry="16" fill="#334155" fillOpacity="0.7" stroke="#64748b" strokeWidth="1.8" />

      {/* Top ellipse */}
      <ellipse cx="130" cy="52" rx="60" ry="16" fill="url(#tk-top)" stroke="#94a3b8" strokeWidth="1.8" />

      {/* Top pipe */}
      <rect x="124" y="22" width="12" height="32" fill="#475569" stroke="#334155" strokeWidth="1" />
      <ellipse cx="130" cy="22" rx="10" ry="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
      <rect x="118" y="18" width="24" height="7" fill="#64748b" rx="2" />

      {/* Labels */}
      <line x1="130" y1="52" x2="190" y2="52" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="162" y="44" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">r = 3,5 m</text>
      <line x1="200" y1="52" x2="200" y2="187" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="195" y1="52" x2="205" y2="52" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="195" y1="187" x2="205" y2="187" stroke="#94a3b8" strokeWidth="1.2" />
      <text x="222" y="124" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">5 m</text>

      <text x="130" y="222" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Tangki Air</text>
    </svg>
  );
}

/* ── No 13 · TABUNG DICAT ──────────────────────────────────────── */
function TabungCatSVG() {
  return (
    <svg viewBox="0 0 270 230" width="270" height="230" className="mx-auto">
      <defs>
        <linearGradient id="cat-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="cat-paint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="brush-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="60%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>

      {/* Cylinder body (uncoated, lower half) */}
      <rect x="70" y="50" width="120" height="140" fill="url(#cat-body)" />

      {/* Painted portion (upper 2/3 - selimut cat) */}
      <rect x="70" y="50" width="120" height="95" fill="url(#cat-paint)" />
      {/* Paint drip effects */}
      <path d="M 90 145 Q 88 152 90 158 Q 92 163 90 168" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M 130 145 Q 128 150 131 156 Q 133 160 130 165" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M 170 145 Q 168 153 170 159" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />

      {/* Boundary line (paint edge) */}
      <ellipse cx="130" cy="145" rx="60" ry="10" fill="none" stroke="#c4b5fd" strokeWidth="1.8" strokeDasharray="6,3" />

      {/* Bottom ellipse */}
      <ellipse cx="130" cy="190" rx="60" ry="15" fill="#4c1d95" fillOpacity="0.3" stroke="#a78bfa" strokeWidth="1.8" />
      {/* Top ellipse */}
      <ellipse cx="130" cy="50" rx="60" ry="15" fill="#c4b5fd" fillOpacity="0.35" stroke="#a78bfa" strokeWidth="1.8" />

      {/* Paint roller / brush */}
      <rect x="180" y="42" width="7" height="48" fill="#92400e" rx="2" />
      <rect x="176" y="46" width="16" height="38" fill="url(#brush-grad)" rx="3" />
      {/* Roller bristles */}
      {[50, 56, 62, 68, 74].map((y, i) => (
        <line key={i} x1="176" y1={y} x2="192" y2={y} stroke="#c4b5fd" strokeWidth="1.5" strokeOpacity="0.6" />
      ))}
      {/* Handle extension */}
      <line x1="183" y1="42" x2="200" y2="20" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />

      {/* Labels */}
      <line x1="130" y1="50" x2="190" y2="50" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="157" y="42" fill="#a78bfa" fontSize="12" textAnchor="middle" fontFamily="monospace">r = 7 cm</text>
      <line x1="44" y1="50" x2="44" y2="190" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="39" y1="50" x2="49" y2="50" stroke="#a78bfa" strokeWidth="1.2" />
      <line x1="39" y1="190" x2="49" y2="190" stroke="#a78bfa" strokeWidth="1.2" />
      <text x="22" y="124" fill="#a78bfa" fontSize="12" textAnchor="middle" fontFamily="monospace">20 cm</text>

      <text x="130" y="218" fill="#a78bfa" fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Tabung Dicat</text>
    </svg>
  );
}

/* ── No 14 · TONG SAMPAH ──────────────────────────────────────── */
function TongSampahSVG() {
  return (
    <svg viewBox="0 0 240 230" width="240" height="230" className="mx-auto">
      <defs>
        <linearGradient id="ts-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#d1d5db" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#374151" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ts-bot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>

      {/* Tong body */}
      <rect x="55" y="45" width="130" height="155" fill="url(#ts-body)" />
      {/* Left sheen */}
      <rect x="55" y="45" width="13" height="155" fill="white" fillOpacity="0.18" />
      {/* Right shadow */}
      <rect x="172" y="45" width="13" height="155" fill="#111827" fillOpacity="0.22" />

      {/* Horizontal rib bands */}
      {[90, 130, 165].map((y, i) => (
        <g key={i}>
          <ellipse cx="120" cy={y} rx="65" ry="8" fill="none" stroke="#6b7280" strokeWidth="2.5" />
        </g>
      ))}

      {/* Bottom ellipse (closed) */}
      <ellipse cx="120" cy="200" rx="65" ry="17" fill="url(#ts-bot)" stroke="#4b5563" strokeWidth="2" />

      {/* TOP — open (no lid, just rim) */}
      <ellipse cx="120" cy="45" rx="65" ry="17" fill="#1f2937" fillOpacity="0.4" stroke="#9ca3af" strokeWidth="2.2" />
      {/* Open top hint - dark inside */}
      <ellipse cx="120" cy="45" rx="55" ry="12" fill="#111827" fillOpacity="0.6" />

      {/* Trash icon inside */}
      <text x="120" y="135" fill="#6b7280" fontSize="28" textAnchor="middle" fillOpacity="0.45">🗑</text>

      {/* Handle (ring on side) */}
      <path d="M 55 80 Q 40 100 55 120" fill="none" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
      <path d="M 185 80 Q 200 100 185 120" fill="none" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />

      {/* Labels */}
      <line x1="120" y1="45" x2="185" y2="45" stroke="#9ca3af" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="155" y="37" fill="#9ca3af" fontSize="11" textAnchor="middle" fontFamily="monospace">r = 21 cm</text>
      <line x1="210" y1="45" x2="210" y2="200" stroke="#9ca3af" strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="205" y1="45" x2="215" y2="45" stroke="#9ca3af" strokeWidth="1.2" />
      <line x1="205" y1="200" x2="215" y2="200" stroke="#9ca3af" strokeWidth="1.2" />
      <text x="230" y="127" fill="#9ca3af" fontSize="11" textAnchor="middle" fontFamily="monospace">60 cm</text>

      <text x="120" y="222" fill="#9ca3af" fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Tong Sampah (tanpa tutup)</text>
    </svg>
  );
}

/* ── No 15 · LILIN MENYALA ─────────────────────────────────────── */
function LilinSVG() {
  return (
    <svg viewBox="0 0 200 260" width="200" height="260" className="mx-auto">
      <defs>
        <linearGradient id="li-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="li-flame-core" cx="50%" cy="85%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fef9c3" />
          <stop offset="70%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="li-flame-outer" cx="50%" cy="80%" r="65%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="li-glow" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="li-melt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <filter id="li-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Glow halo behind flame */}
      <ellipse cx="100" cy="90" rx="38" ry="50" fill="url(#li-glow)" filter="url(#li-blur)" />

      {/* FLAME — outer glow */}
      <path d="M 100 118 C 78 105 72 82 80 62 C 86 48 92 38 100 28 C 108 38 114 48 120 62 C 128 82 122 105 100 118 Z"
        fill="url(#li-flame-outer)" filter="url(#li-blur)" />
      {/* FLAME — main */}
      <path d="M 100 118 C 82 108 76 88 83 68 C 88 54 94 42 100 32 C 106 42 112 54 117 68 C 124 88 118 108 100 118 Z"
        fill="url(#li-flame-core)" />
      {/* FLAME — inner bright core */}
      <path d="M 100 115 C 90 107 88 94 92 80 C 95 70 98 62 100 55 C 102 62 105 70 108 80 C 112 94 110 107 100 115 Z"
        fill="white" fillOpacity="0.55" />
      {/* Wick */}
      <line x1="100" y1="118" x2="100" y2="128" stroke="#292524" strokeWidth="1.5" strokeLinecap="round" />

      {/* Candle top (melted wax pool) */}
      <ellipse cx="100" cy="128" rx="28" ry="7" fill="url(#li-melt)" />
      {/* Wax drip left */}
      <path d="M 74 130 Q 71 140 73 148 Q 75 155 73 162" fill="none" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.8" />
      {/* Wax drip right */}
      <path d="M 126 132 Q 129 142 127 150" fill="none" stroke="#fef9c3" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />

      {/* Candle cylinder body */}
      <rect x="72" y="128" width="56" height="110" fill="url(#li-body)" />
      {/* Left sheen */}
      <rect x="72" y="128" width="7" height="110" fill="white" fillOpacity="0.25" />
      {/* Right shadow */}
      <rect x="121" y="128" width="7" height="110" fill="#713f12" fillOpacity="0.3" />

      {/* Bottom ellipse */}
      <ellipse cx="100" cy="238" rx="28" ry="7" fill="#ca8a04" fillOpacity="0.5" stroke="#a16207" strokeWidth="1.5" />
      {/* Top ellipse / wax surface */}
      <ellipse cx="100" cy="128" rx="28" ry="7" fill="none" stroke="#fde047" strokeWidth="1.2" strokeOpacity="0.6" />

      {/* Candleholder base plate */}
      <rect x="60" y="236" width="80" height="8" fill="#78716c" rx="3" />
      <ellipse cx="100" cy="236" rx="40" ry="5" fill="#57534e" fillOpacity="0.7" />

      {/* Light rays */}
      {[[-30, -38], [30, -38], [-42, -8], [42, -8]].map(([dx, dy], i) => (
        <line key={i}
          x1={100 + dx * 0.4} y1={75 + dy * 0.4}
          x2={100 + dx} y2={75 + dy}
          stroke="#fbbf24" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      ))}

      {/* Labels */}
      <line x1="100" y1="128" x2="128" y2="128" stroke="#fde047" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="146" y="132" fill="#fde047" fontSize="11" textAnchor="middle" fontFamily="monospace">r=1,75</text>
      <line x1="148" y1="128" x2="148" y2="238" stroke="#fde047" strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="143" y1="128" x2="153" y2="128" stroke="#fde047" strokeWidth="1.2" />
      <line x1="143" y1="238" x2="153" y2="238" stroke="#fde047" strokeWidth="1.2" />
      <text x="168" y="187" fill="#fde047" fontSize="11" textAnchor="middle" fontFamily="monospace">20 cm</text>

      <text x="100" y="255" fill="#fde047" fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.8">Lilin Menyala 🕯️</text>
    </svg>
  );
}

const questions: Q[] = [
  // ── BAGIAN A · UNSUR-UNSUR ───────────────────────────────────────────────
  Qn(1, "Konsep Dasar Tabung", {
    content: "Banyak sisi dan banyak rusuk pada tabung berturut-turut adalah ...",
    choices: [
      { label: "A", text: "3 sisi dan 2 rusuk" },
      { label: "B", text: "2 sisi dan 3 rusuk" },
      { label: "C", text: "4 sisi dan 4 rusuk" },
      { label: "D", text: "3 sisi dan 1 rusuk" },
    ],
    answer: "A",
  }),

  // ── BAGIAN B · LUAS PERMUKAAN ─────────────────────────────────────────────
  Qn(2, "Luas Selimut – Jari-Jari dari Jaring", {
    content: "Selimut sebuah tabung dibentangkan membentuk persegi panjang dengan panjang 22 cm dan lebar 10 cm. Jari-jari alas tabung tersebut adalah ... (π = 22/7)",
    diagram: <SelimutRectSVG />,
    choices: [
      { label: "A", text: "3,5 cm" },
      { label: "B", text: "7 cm" },
      { label: "C", text: "10 cm" },
      { label: "D", text: "14 cm" },
    ],
    answer: "A",
  }),
  Qn(3, "Luas Selimut – Perhitungan", {
    content: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 20 cm. Luas selimut tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="20 cm" />,
    choices: [
      { label: "A", text: "440 cm²" },
      { label: "B", text: "660 cm²" },
      { label: "C", text: "880 cm²" },
      { label: "D", text: "1.100 cm²" },
    ],
    answer: "C",
  }),
  Qn(4, "Luas Permukaan dari Luas Alas & Selimut", {
    content: "Luas alas sebuah tabung adalah 154 cm² dan luas selimutnya 440 cm². Luas permukaan tabung tersebut adalah ...",
    choices: [
      { label: "A", text: "594 cm²" },
      { label: "B", text: "748 cm²" },
      { label: "C", text: "880 cm²" },
      { label: "D", text: "1.034 cm²" },
    ],
    answer: "B",
  }),
  Qn(5, "Luas Permukaan Tabung Terbuka", {
    content: "Sebuah tabung tanpa tutup memiliki jari-jari 10 cm dan tinggi 15 cm. Luas permukaannya adalah ... (π = 3,14)",
    diagram: <CylinderSVG r="10 cm" h="15 cm" />,
    choices: [
      { label: "A", text: "942 cm²" },
      { label: "B", text: "1.099 cm²" },
      { label: "C", text: "1.256 cm²" },
      { label: "D", text: "1.570 cm²" },
    ],
    answer: "C",
  }),
  Qn(6, "Luas Selimut – Perbandingan", {
    content: "Dua tabung memiliki tinggi yang sama. Jika perbandingan jari-jarinya 2 : 3, perbandingan luas selimut kedua tabung adalah ...",
    choices: [
      { label: "A", text: "4 : 9" },
      { label: "B", text: "2 : 3" },
      { label: "C", text: "1 : 2" },
      { label: "D", text: "3 : 4" },
    ],
    answer: "B",
  }),
  Qn(7, "Luas Permukaan – Terpadu", {
    content: "Sebuah tabung memiliki luas permukaan total 836 cm² dan tinggi 12 cm. Volume tabung tersebut adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="?" h="12 cm" />,
    choices: [
      { label: "A", text: "924 cm³" },
      { label: "B", text: "1.848 cm³" },
      { label: "C", text: "2.156 cm³" },
      { label: "D", text: "3.080 cm³" },
    ],
    answer: "B",
  }),

  // ── BAGIAN C · VOLUME ─────────────────────────────────────────────────────
  Qn(8, "Volume Tabung – Diameter Diketahui", {
    content: "Sebuah tabung memiliki diameter 14 cm dan tinggi 20 cm. Volume tabung adalah ... (π = 22/7)",
    diagram: <CylinderSVG r="7 cm" h="20 cm" />,
    choices: [
      { label: "A", text: "1.540 cm³" },
      { label: "B", text: "2.310 cm³" },
      { label: "C", text: "3.080 cm³" },
      { label: "D", text: "6.160 cm³" },
    ],
    answer: "C",
  }),
  Qn(9, "Volume – dari Luas Alas 154", {
    content: "Sebuah tabung mempunyai luas alas 154 cm² dan tinggi 10 cm. Volume tabung tersebut adalah ... (π = 22/7)",
    choices: [
      { label: "A", text: "770 cm³" },
      { label: "B", text: "1.100 cm³" },
      { label: "C", text: "1.540 cm³" },
      { label: "D", text: "2.310 cm³" },
    ],
    answer: "C",
  }),
  Qn(10, "Perbandingan Volume Dua Tabung", {
    content: "Tabung A memiliki r = 3 cm dan t = 8 cm. Tabung B memiliki r = 6 cm dan t = 4 cm. Perbandingan volume Tabung A terhadap Tabung B adalah ...",
    choices: [
      { label: "A", text: "VA = VB" },
      { label: "B", text: "VA : VB = 2 : 1" },
      { label: "C", text: "VA : VB = 1 : 2" },
      { label: "D", text: "VA : VB = 1 : 4" },
    ],
    answer: "C",
  }),

  // ── BAGIAN D · APLIKASI DI KEHIDUPAN NYATA ───────────────────────────────
  Qn(11, "Aplikasi – Kolam Renang", {
    content: "Sebuah kolam renang berbentuk tabung berdiameter 14 m dan kedalaman 2 m. Volume air yang dibutuhkan untuk mengisi kolam hingga penuh adalah ... (π = 22/7)",
    diagram: <KolamRenangSVG />,
    choices: [
      { label: "A", text: "77 m³" },
      { label: "B", text: "154 m³" },
      { label: "C", text: "308 m³" },
      { label: "D", text: "616 m³" },
    ],
    answer: "C",
  }),
  Qn(12, "Aplikasi – Pengisian Tangki dengan Pompa", {
    content: "Sebuah tangki berbentuk tabung dengan r = 3,5 m dan tinggi 5 m akan diisi menggunakan pompa yang mengalirkan 385 liter/menit. Waktu yang dibutuhkan untuk mengisi penuh tangki adalah ... (π = 22/7, 1 m³ = 1.000 liter)",
    diagram: <TangkiAirSVG />,
    choices: [
      { label: "A", text: "100 menit" },
      { label: "B", text: "250 menit" },
      { label: "C", text: "500 menit" },
      { label: "D", text: "1.000 menit" },
    ],
    answer: "C",
  }),
  Qn(13, "Aplikasi – Biaya Cat Selimut", {
    content: "Sebuah tabung dengan r = 7 cm dan t = 20 cm akan dicat selimutnya. Jika biaya cat Rp500,00 per cm², total biaya yang diperlukan adalah ... (π = 22/7)",
    diagram: <TabungCatSVG />,
    choices: [
      { label: "A", text: "Rp220.000" },
      { label: "B", text: "Rp330.000" },
      { label: "C", text: "Rp440.000" },
      { label: "D", text: "Rp880.000" },
    ],
    answer: "C",
  }),
  Qn(14, "Aplikasi – Tong Sampah", {
    content: "Tong sampah berbentuk tabung tanpa tutup dengan diameter 42 cm dan tinggi 60 cm. Jika harga seng Rp25.000,00 per dm², biaya yang dibutuhkan adalah ... (π = 22/7, 1 dm² = 100 cm²)",
    diagram: <TongSampahSVG />,
    choices: [
      { label: "A", text: "Rp1.163.250" },
      { label: "B", text: "Rp1.980.000" },
      { label: "C", text: "Rp2.326.500" },
      { label: "D", text: "Rp3.465.000" },
    ],
    answer: "C",
  }),
  Qn(15, "Aplikasi – Lilin Silindris Menyusut", {
    content: "Sebuah lilin berbentuk tabung memiliki diameter 3,5 cm dan tinggi 20 cm. Setelah dinyalakan, lilin menyusut 0,5 cm per jam. Volume lilin setelah 4 jam menyala adalah ... (π = 22/7)",
    diagram: <LilinSVG />,
    choices: [
      { label: "A", text: "86,625 cm³" },
      { label: "B", text: "130,0 cm³" },
      { label: "C", text: "173,25 cm³" },
      { label: "D", text: "192,5 cm³" },
    ],
    answer: "C",
  }),
];

const CHOICE_LABELS = ["A", "B", "C", "D"];

const TabungPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🧴</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(34,211,238,0.7)' }}>
            TABUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 15 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Rumus Penting — Tabung</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Luas Selimut", formula: "L_s = 2\\pi r t" },
              { label: "Luas Permukaan Total", formula: "L = 2\\pi r(r + t)" },
              { label: "Volume", formula: "V = \\pi r^2 t" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-cyan-400 font-bold shrink-0 w-32">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n}>
              {groupHeaders[q.n] && (
                <div className="mt-4 mb-2 px-2">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-cyan-500/20" />
                    <span className="text-cyan-400 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                      {groupHeaders[q.n]}
                    </span>
                    <div className="h-px flex-1 bg-cyan-500/20" />
                  </div>
                </div>
              )}
              <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">
                        {q.title}
                      </span>
                      {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                      {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                      {q.math && <div className="mb-3 text-white/90 text-sm"><BlockMath math={q.math} /></div>}

                      {q.choices && (
                        <div className="flex flex-col gap-1.5 mt-2">
                          {q.choices.map((ch) => (
                              <div
                                key={ch.label}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl border transition-all bg-white/5 border-white/10"
                              >
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border bg-white/10 border-white/20 text-white/50">
                                  {ch.label}
                                </span>
                                <span className="font-body text-sm text-white/70">
                                  {ch.text && ch.text}
                                  {ch.math && <InlineMath math={ch.math} />}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}

                      {q.parts && (
                        <div className="flex flex-col gap-2">
                          {q.parts.map((p, pi) => (
                            <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                              {p.label && <span className="text-cyan-400 text-xs font-bold shrink-0 mt-0.5 w-5">{p.label}</span>}
                              <div className="flex-1 min-w-0">
                                {p.text && <span className="font-body text-sm text-white/80">{p.text}</span>}
                                {p.math && <span className="text-white/90 text-sm"><InlineMath math={p.math} /></span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

export default TabungPage;
