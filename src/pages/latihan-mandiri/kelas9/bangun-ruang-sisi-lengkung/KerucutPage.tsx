
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type OptionKey = "A" | "B" | "C" | "D";
type Option = { key: OptionKey; text: string };
type Q = {
  n: number;
  title: string;
  content: string;
  diagram?: React.ReactNode;
  options: Option[];
  answer: OptionKey;
};

function ConeSVG({ r, h, s, color = "#fb923c", extraLabel = "", showHeight = true }: {
  r?: string; h?: string; s?: string; color?: string; extraLabel?: string; showHeight?: boolean;
}) {
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <defs>
        <linearGradient id={`cone-fill-${r}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="160" rx="65" ry="20" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
      <line x1="45" y1="160" x2="110" y2="28" stroke={color} strokeWidth="1.8" />
      <line x1="175" y1="160" x2="110" y2="28" stroke={color} strokeWidth="1.8" />
      <polygon points="45,160 175,160 110,28" fill={`url(#cone-fill-${r})`} />
      {showHeight && (
        <>
          <line x1="110" y1="28" x2="110" y2="160" stroke={color} strokeWidth="1" strokeDasharray="5,3" />
          <line x1="107" y1="28" x2="113" y2="28" stroke={color} strokeWidth="1.2" />
        </>
      )}
      {r && (
        <>
          <line x1="110" y1="160" x2="175" y2="160" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
          <text x="142" y="152" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">r = {r}</text>
        </>
      )}
      {h && showHeight && (
        <text x="125" y="100" fill={color} fontSize="12" textAnchor="start" fontFamily="monospace">t = {h}</text>
      )}
      {s && (
        <text x="158" y="95" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">s = {s}</text>
      )}
      {extraLabel && (
        <text x="110" y="192" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">{extraLabel}</text>
      )}
    </svg>
  );
}

function ConeNetSVG({ color = "#fb923c" }: { color?: string }) {
  return (
    <svg viewBox="0 -25 280 245" width="280" height="245" className="mx-auto">
      <path d="M 140 20 L 30 160 A 120 120 0 0 0 250 160 Z" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" />
      <text x="140" y="110" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Selimut (sektor/juring)</text>
      <text x="140" y="128" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">jari-jari = s (garis pelukis)</text>
      <ellipse cx="140" cy="185" rx="45" ry="14" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <text x="140" y="189" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">Alas (r)</text>
    </svg>
  );
}

/* ── No 6 · TOPI KERUCUT ───────────────────────────────────────── */
function TopiKerucutSVG() {
  return (
    <svg viewBox="0 0 220 230" width="220" height="230" className="mx-auto">
      <defs>
        <linearGradient id="tp-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="tp-stripe1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="tp-brim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
        <clipPath id="tp-cone-clip">
          <polygon points="110,18 38,175 182,175" />
        </clipPath>
      </defs>

      {/* Cone body */}
      <polygon points="110,18 38,175 182,175" fill="url(#tp-body)" stroke="#db2777" strokeWidth="1.5" />

      {/* Diagonal stripes clipped to cone */}
      {[-80,-50,-20,10,40,70,100].map((offset, i) => (
        <line key={i}
          x1={offset} y1="0" x2={offset + 160} y2="200"
          stroke="url(#tp-stripe1)" strokeWidth="8" strokeOpacity="0.35"
          clipPath="url(#tp-cone-clip)" />
      ))}

      {/* Sheen */}
      <polygon points="110,18 60,130 85,175 38,175"
        fill="white" fillOpacity="0.15" clipPath="url(#tp-cone-clip)" />

      {/* Brim ellipse */}
      <ellipse cx="110" cy="175" rx="72" ry="14" fill="url(#tp-brim)" stroke="#db2777" strokeWidth="1.8" />
      <ellipse cx="110" cy="175" rx="72" ry="14" fill="white" fillOpacity="0.15" />

      {/* Pompom at tip */}
      <circle cx="110" cy="18" r="9" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="110" cy="18" r="5" fill="white" fillOpacity="0.5" />

      {/* Elastic band strings */}
      <path d="M 42 177 Q 55 200 80 205 Q 110 210 140 205 Q 165 200 178 177"
        fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0.7" />

      {/* Labels */}
      <line x1="110" y1="18" x2="110" y2="175" stroke="#db2777" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
      <line x1="110" y1="175" x2="182" y2="175" stroke="#db2777" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="146" y="167" fill="#db2777" fontSize="11" textAnchor="middle" fontFamily="monospace">r = 14 cm</text>
      <text x="128" y="105" fill="#db2777" fontSize="11" textAnchor="start" fontFamily="monospace">s = 25 cm</text>
      <text x="110" y="218" fill="#f9a8d4" fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.8">Topi Kerucut</text>
    </svg>
  );
}

/* ── No 7 · CORONG KERUCUT ─────────────────────────────────────── */
function CorongSVG() {
  return (
    <svg viewBox="0 0 220 230" width="220" height="230" className="mx-auto">
      <defs>
        <linearGradient id="cr-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cr-pipe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="cr-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id="cr-clip">
          <polygon points="110,30 32,165 188,165" />
        </clipPath>
      </defs>

      {/* Top rim ellipse */}
      <ellipse cx="110" cy="30" rx="78" ry="16" fill="#bae6fd" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />

      {/* Cone body (inverted funnel) */}
      <polygon points="110,165 32,30 188,30" fill="url(#cr-body)" stroke="#0ea5e9" strokeWidth="1.8" />

      {/* Sheen left */}
      <polygon points="32,30 65,30 110,165" fill="white" fillOpacity="0.18" clipPath="url(#cr-clip)" />

      {/* Liquid inside cone */}
      <polygon points="110,165 65,85 155,85" fill="url(#cr-liquid)" fillOpacity="0.55" />
      <ellipse cx="110" cy="85" rx="45" ry="9" fill="#fde68a" fillOpacity="0.6" />

      {/* Pipe/tube at bottom */}
      <rect x="100" y="163" width="20" height="45" fill="url(#cr-pipe)" stroke="#0ea5e9" strokeWidth="1.5" rx="3" />
      <ellipse cx="110" cy="163" rx="10" ry="3.5" fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="1.2" />
      <ellipse cx="110" cy="208" rx="10" ry="3.5" fill="#38bdf8" fillOpacity="0.7" stroke="#0ea5e9" strokeWidth="1.2" />

      {/* Liquid drop from pipe */}
      <ellipse cx="110" cy="215" rx="4" ry="6" fill="#fbbf24" fillOpacity="0.7" />

      {/* Labels */}
      <line x1="110" y1="30" x2="188" y2="30" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="149" y="22" fill="#38bdf8" fontSize="11" textAnchor="middle" fontFamily="monospace">r = 10 cm</text>
      <line x1="192" y1="30" x2="192" y2="165" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4,2" />
      <line x1="187" y1="30" x2="197" y2="30" stroke="#38bdf8" strokeWidth="1.2" />
      <line x1="187" y1="165" x2="197" y2="165" stroke="#38bdf8" strokeWidth="1.2" />
      <text x="207" y="102" fill="#38bdf8" fontSize="11" textAnchor="middle" fontFamily="monospace">s=26</text>
      <text x="110" y="225" fill="#7dd3fc" fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.8">Corong</text>
    </svg>
  );
}

/* ── No 9 · KERUCUT DICAT ──────────────────────────────────────── */
function KerucutCatSVG() {
  return (
    <svg viewBox="0 0 260 220" width="260" height="220" className="mx-auto">
      <defs>
        <linearGradient id="kc-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="kc-painted" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <clipPath id="kc-clip">
          <polygon points="110,20 38,175 182,175" />
        </clipPath>
      </defs>

      {/* Cone body */}
      <polygon points="110,20 38,175 182,175" fill="url(#kc-body)" stroke="#7c3aed" strokeWidth="1.8" />
      {/* Already-painted region (left half, slightly lighter) */}
      <polygon points="110,20 38,175 110,175" fill="url(#kc-painted)" fillOpacity="0.6" clipPath="url(#kc-clip)" />
      {/* Paint drips along left edge */}
      <path d="M 68 130 Q 65 140 66 152" fill="none" stroke="#c4b5fd" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 55 155 Q 52 162 54 170" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      <path d="M 82 160 Q 80 168 81 175" fill="none" stroke="#ddd6fe" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sheen */}
      <polygon points="110,20 75,100 60,175 38,175" fill="white" fillOpacity="0.12" clipPath="url(#kc-clip)" />

      {/* Base ellipse */}
      <ellipse cx="110" cy="175" rx="72" ry="14" fill="#7c3aed" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="1.8" />

      {/* Paint bucket */}
      <rect x="195" y="140" width="34" height="30" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="3" />
      <ellipse cx="212" cy="140" rx="17" ry="5" fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.2" />
      <ellipse cx="212" cy="140" rx="17" ry="5" fill="#a78bfa" fillOpacity="0.4" />
      <path d="M 200 138 Q 212 130 224 138" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <text x="212" y="160" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">CAT</text>

      {/* Paint roller / brush handle */}
      <line x1="182" y1="160" x2="197" y2="150" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
      {/* Roller head */}
      <rect x="174" y="152" width="12" height="20" fill="#a78bfa" rx="4" stroke="#7c3aed" strokeWidth="1.2" />
      <rect x="174" y="152" width="5" height="20" fill="#ddd6fe" rx="2" fillOpacity="0.5" />

      {/* Paint line on cone surface from roller */}
      <path d="M 180 165 Q 150 155 125 148" fill="none" stroke="#ddd6fe" strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round" />

      {/* Labels */}
      <line x1="110" y1="175" x2="182" y2="175" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="146" y="167" fill="#a78bfa" fontSize="11" textAnchor="middle" fontFamily="monospace">r = 7 cm</text>
      <text x="155" y="95" fill="#a78bfa" fontSize="11" textAnchor="middle" fontFamily="monospace">s = 20 cm</text>
      <text x="110" y="205" fill="#c4b5fd" fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.8">Kerucut Dicat</text>
    </svg>
  );
}

/* ── No 11 · KERUCUT SENG ──────────────────────────────────────── */
function KerucutSengSVG() {
  return (
    <svg viewBox="0 0 220 230" width="220" height="230" className="mx-auto">
      <defs>
        <linearGradient id="ks-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="ks-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="40%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="ks-seam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <clipPath id="ks-clip">
          <polygon points="110,20 38,175 182,175" />
        </clipPath>
      </defs>

      {/* Cone body — metallic */}
      <polygon points="110,20 38,175 182,175" fill="url(#ks-body)" stroke="#475569" strokeWidth="2" />

      {/* Metallic sheen */}
      <polygon points="110,20 38,175 182,175" fill="url(#ks-sheen)" clipPath="url(#ks-clip)" />

      {/* Horizontal metallic band lines (rivets/seams) */}
      {[60, 95, 128, 158].map((y, i) => {
        const pct = (y - 20) / (175 - 20);
        const rx = 72 * pct;
        const cx = 110;
        return (
          <ellipse key={i} cx={cx} cy={y} rx={rx} ry={rx * 0.18}
            fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.5" />
        );
      })}

      {/* Rivet dots along seam */}
      {[0.25, 0.5, 0.75].map((pct, i) => {
        const y = 20 + pct * 155;
        const rx = 72 * pct;
        return (
          <g key={i}>
            <circle cx={110 - rx * 0.9} cy={y} r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <circle cx={110 + rx * 0.9} cy={y} r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
          </g>
        );
      })}

      {/* Seam line down center-right */}
      <line x1="110" y1="20" x2="182" y2="175" stroke="#e2e8f0" strokeWidth="1" strokeOpacity="0.4" />

      {/* Base ellipse */}
      <ellipse cx="110" cy="175" rx="72" ry="14" fill="#64748b" fillOpacity="0.3" stroke="#475569" strokeWidth="2" />
      <ellipse cx="110" cy="175" rx="72" ry="14" fill="url(#ks-sheen)" />

      {/* Tip cap */}
      <circle cx="110" cy="20" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />

      {/* Labels */}
      <line x1="110" y1="175" x2="182" y2="175" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,2" />
      <text x="146" y="167" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">r = 5 cm</text>
      <text x="158" y="98" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">s = 13 cm</text>
      <text x="110" y="210" fill="#cbd5e1" fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.8">Dilapisi Seng</text>

      {/* "×5" badge */}
      <rect x="155" y="18" width="40" height="22" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
      <text x="175" y="33" fill="#e2e8f0" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">×5</text>
    </svg>
  );
}

/* ── No 14 · 10 TOPI ULANG TAHUN ──────────────────────────────── */
function TopiUltahBanyakSVG() {
  const hats = [
    { cx: 36,  baseY: 160, r: 20, color: "#f472b6", stripe: "#fde68a", pompom: "#fbbf24" },
    { cx: 82,  baseY: 155, r: 20, color: "#34d399", stripe: "#a78bfa", pompom: "#f472b6" },
    { cx: 128, baseY: 158, r: 20, color: "#60a5fa", stripe: "#fb923c", pompom: "#34d399" },
    { cx: 174, baseY: 155, r: 20, color: "#fb923c", stripe: "#34d399", pompom: "#60a5fa" },
    { cx: 220, baseY: 160, r: 20, color: "#a78bfa", stripe: "#f472b6", pompom: "#fb923c" },
    { cx: 58,  baseY: 105, r: 18, color: "#fbbf24", stripe: "#60a5fa", pompom: "#f472b6" },
    { cx: 104, baseY: 100, r: 18, color: "#f472b6", stripe: "#34d399", pompom: "#a78bfa" },
    { cx: 150, baseY: 103, r: 18, color: "#34d399", stripe: "#fbbf24", pompom: "#60a5fa" },
    { cx: 196, baseY: 100, r: 18, color: "#60a5fa", stripe: "#fb923c", pompom: "#fbbf24" },
    { cx: 128, baseY:  50, r: 16, color: "#fb923c", stripe: "#a78bfa", pompom: "#f472b6" },
  ];

  return (
    <svg viewBox="0 0 256 200" width="256" height="200" className="mx-auto">
      <defs>
        {hats.map((h, i) => (
          <clipPath key={i} id={`th-clip-${i}`}>
            <polygon points={`${h.cx},${h.baseY - h.r * 4} ${h.cx - h.r},${h.baseY} ${h.cx + h.r},${h.baseY}`} />
          </clipPath>
        ))}
      </defs>

      {hats.map((h, i) => {
        const tipY = h.baseY - h.r * 4;
        return (
          <g key={i}>
            {/* Cone */}
            <polygon
              points={`${h.cx},${tipY} ${h.cx - h.r},${h.baseY} ${h.cx + h.r},${h.baseY}`}
              fill={h.color} fillOpacity="0.85" stroke={h.color} strokeWidth="1" />
            {/* Stripe */}
            <line x1={h.cx - h.r * 0.5} y1={h.baseY - h.r} x2={h.cx + h.r * 0.5} y2={h.baseY - h.r}
              stroke={h.stripe} strokeWidth="4" strokeOpacity="0.7"
              clipPath={`url(#th-clip-${i})`} />
            {/* Sheen */}
            <polygon
              points={`${h.cx},${tipY} ${h.cx - h.r * 0.6},${h.baseY} ${h.cx},${h.baseY}`}
              fill="white" fillOpacity="0.15" clipPath={`url(#th-clip-${i})`} />
            {/* Brim */}
            <ellipse cx={h.cx} cy={h.baseY} rx={h.r} ry={h.r * 0.25}
              fill={h.color} fillOpacity="0.5" stroke={h.color} strokeWidth="1" />
            {/* Pompom */}
            <circle cx={h.cx} cy={tipY} r={h.r * 0.22} fill={h.pompom} />
          </g>
        );
      })}

      {/* Label */}
      <rect x="78" y="178" width="100" height="18" rx="5" fill="#1e1b4b" fillOpacity="0.7" />
      <text x="128" y="191" fill="#fde68a" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">10 Topi Ulang Tahun</text>
    </svg>
  );
}

const questions: Q[] = [
  {
    n: 1, title: "Garis Pelukis Kerucut",
    content: "Sebuah kerucut memiliki jari-jari alas 6 cm dan tinggi 8 cm. Panjang garis pelukis (s) kerucut tersebut adalah ...",
    diagram: <ConeSVG r="6 cm" h="8 cm" />,
    options: [
      { key: "A", text: "8 cm" },
      { key: "B", text: "9 cm" },
      { key: "C", text: "10 cm" },
      { key: "D", text: "14 cm" },
    ],
    answer: "C",
  },
  {
    n: 2, title: "Luas Selimut Kerucut",
    content: "Sebuah kerucut memiliki jari-jari 7 cm dan garis pelukis 25 cm. Luas selimut kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="25 cm" />,
    options: [
      { key: "A", text: "440 cm²" },
      { key: "B", text: "550 cm²" },
      { key: "C", text: "616 cm²" },
      { key: "D", text: "770 cm²" },
    ],
    answer: "B",
  },
  {
    n: 3, title: "Luas Permukaan Total Kerucut",
    content: "Sebuah kerucut memiliki jari-jari 5 cm dan tinggi 12 cm. Luas permukaan total kerucut tersebut adalah ... (π = 3,14)",
    diagram: <ConeSVG r="5 cm" h="12 cm" />,
    options: [
      { key: "A", text: "251,2 cm²" },
      { key: "B", text: "282,6 cm²" },
      { key: "C", text: "314 cm²" },
      { key: "D", text: "376,8 cm²" },
    ],
    answer: "B",
  },
  {
    n: 4, title: "Volume Kerucut",
    content: "Sebuah kerucut memiliki jari-jari 7 cm dan tinggi 15 cm. Volume kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="15 cm" />,
    options: [
      { key: "A", text: "462 cm³" },
      { key: "B", text: "616 cm³" },
      { key: "C", text: "770 cm³" },
      { key: "D", text: "1.155 cm³" },
    ],
    answer: "C",
  },
  {
    n: 5, title: "Mencari Jari-Jari dari Volume",
    content: "Volume sebuah kerucut adalah 2.512 cm³ dan tingginya 24 cm. Jari-jari alas kerucut tersebut adalah ... (π = 3,14)",
    diagram: <ConeSVG r="?" h="24 cm" />,
    options: [
      { key: "A", text: "7 cm" },
      { key: "B", text: "10 cm" },
      { key: "C", text: "12 cm" },
      { key: "D", text: "14 cm" },
    ],
    answer: "B",
  },
  {
    n: 6, title: "Soal Cerita – Topi Kerucut",
    content: "Sebuah topi berbentuk kerucut dengan r = 14 cm dan garis pelukis 25 cm. Luas kain yang dibutuhkan untuk membuat satu topi adalah ... (π = 22/7)",
    diagram: <TopiKerucutSVG />,
    options: [
      { key: "A", text: "880 cm²" },
      { key: "B", text: "990 cm²" },
      { key: "C", text: "1.100 cm²" },
      { key: "D", text: "1.210 cm²" },
    ],
    answer: "C",
  },
  {
    n: 7, title: "Soal Cerita – Corong Kerucut",
    content: "Sebuah corong berbentuk kerucut tanpa alas memiliki r = 10 cm dan s = 26 cm. Luas selimut corong tersebut adalah ... (π = 3,14)",
    diagram: <CorongSVG />,
    options: [
      { key: "A", text: "753,6 cm²" },
      { key: "B", text: "816,4 cm²" },
      { key: "C", text: "879,2 cm²" },
      { key: "D", text: "942 cm²" },
    ],
    answer: "B",
  },
  {
    n: 8, title: "Perbandingan Volume Dua Kerucut",
    content: "Kerucut A memiliki r = 6 cm dan t = 4 cm. Kerucut B memiliki r = 3 cm dan t = 8 cm. Perbandingan volume A : B adalah ...",
    options: [
      { key: "A", text: "1 : 1" },
      { key: "B", text: "3 : 2" },
      { key: "C", text: "2 : 1" },
      { key: "D", text: "4 : 1" },
    ],
    answer: "C",
  },
  {
    n: 9, title: "Biaya Pengecatan Selimut Kerucut",
    content: "Sebuah kerucut dengan r = 7 cm dan s = 20 cm akan dicat. Jika biaya pengecatan Rp2.000 per cm², total biaya pengecatan adalah ... (π = 22/7)",
    diagram: <KerucutCatSVG />,
    options: [
      { key: "A", text: "Rp 660.000" },
      { key: "B", text: "Rp 770.000" },
      { key: "C", text: "Rp 880.000" },
      { key: "D", text: "Rp 1.100.000" },
    ],
    answer: "C",
  },
  {
    n: 10, title: "TKA – Perbandingan Luas Selimut",
    content: "Dua kerucut mempunyai garis pelukis yang sama. Perbandingan jari-jari kerucut pertama dan kedua adalah 3 : 5. Perbandingan luas selimut kedua kerucut adalah ...",
    options: [
      { key: "A", text: "9 : 25" },
      { key: "B", text: "3 : 5" },
      { key: "C", text: "1 : 2" },
      { key: "D", text: "3 : 10" },
    ],
    answer: "B",
  },
  {
    n: 11, title: "ANBK – Biaya Membuat Kerucut",
    content: "Sebuah kerucut dengan r = 5 cm dan s = 13 cm akan dibuat dari lembaran seng. Jika harga seng Rp1.500 per cm², biaya membuat 5 kerucut tanpa alas adalah ... (π = 3,14)",
    diagram: <KerucutSengSVG />,
    options: [
      { key: "A", text: "Rp 1.020.500" },
      { key: "B", text: "Rp 1.530.750" },
      { key: "C", text: "Rp 2.041.000" },
      { key: "D", text: "Rp 3.061.500" },
    ],
    answer: "B",
  },
  {
    n: 12, title: "TKA – Volume dari Luas Alas",
    content: "Luas alas sebuah kerucut adalah 154 cm² dan tingginya 18 cm. Volume kerucut tersebut adalah ...",
    options: [
      { key: "A", text: "616 cm³" },
      { key: "B", text: "924 cm³" },
      { key: "C", text: "1.386 cm³" },
      { key: "D", text: "2.772 cm³" },
    ],
    answer: "B",
  },
  {
    n: 13, title: "Perbandingan Volume Kerucut dan Tabung",
    content: "Sebuah kerucut dan tabung memiliki jari-jari dan tinggi yang sama. Perbandingan volume kerucut terhadap volume tabung adalah ...",
    options: [
      { key: "A", text: "1 : 2" },
      { key: "B", text: "1 : 3" },
      { key: "C", text: "2 : 3" },
      { key: "D", text: "3 : 1" },
    ],
    answer: "B",
  },
  {
    n: 14, title: "Soal Terapan – Karton Topi Ulang Tahun",
    content: "Seorang anak membuat 10 topi ulang tahun berbentuk kerucut dari karton, setiap topi r = 7 cm dan s = 25 cm. Total karton yang dibutuhkan dalam m² adalah ... (π = 22/7)",
    diagram: <TopiUltahBanyakSVG />,
    options: [
      { key: "A", text: "0,35 m²" },
      { key: "B", text: "0,55 m²" },
      { key: "C", text: "0,75 m²" },
      { key: "D", text: "1,10 m²" },
    ],
    answer: "B",
  },
  {
    n: 15, title: "HOTS – r : s = 7 : 25, Volume",
    content: "Sebuah kerucut memiliki perbandingan r : s = 7 : 25. Jika luas selimutnya 550 cm², volume kerucut tersebut adalah ... (π = 22/7)",
    options: [
      { key: "A", text: "616 cm³" },
      { key: "B", text: "924 cm³" },
      { key: "C", text: "1.232 cm³" },
      { key: "D", text: "1.848 cm³" },
    ],
    answer: "C",
  },
];

const KerucutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔺</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(251,146,60,0.7)' }}>
            KERUCUT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
              <span className="text-orange-400 text-xs font-bold">📋 15 Soal Pilihan Ganda</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
            </div>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Penting — Kerucut</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Garis Pelukis", formula: "s = \\sqrt{r^2 + t^2}" },
              { label: "Luas Selimut", formula: "L_s = \\pi r s" },
              { label: "Luas Permukaan Total", formula: "L = \\pi r(r + s)" },
              { label: "Volume", formula: "V = \\tfrac{1}{3}\\pi r^2 t" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-orange-400 font-bold shrink-0 w-36">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
              <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.015}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
                <div className="absolute inset-0 rounded-2xl border border-orange-500/20" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full border bg-orange-500/20 border-orange-400/50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-orange-300">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
                        {q.title}
                      </span>
                      <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>
                      {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}

                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map(opt => (
                          <div key={opt.key}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm font-body bg-white/5 border-white/10">
                            <span className="w-6 h-6 rounded-full border border-white/20 text-white/50 flex items-center justify-center text-xs font-bold shrink-0">
                              {opt.key}
                            </span>
                            <span className="text-white/80">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate(-1); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default KerucutPage;
