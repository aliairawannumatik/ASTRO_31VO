import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Star } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── 5 Tipe Triple Pythagoras ── */
const LIMA_TIPE = [
  { tipe:1, a:3,  b:4,  c:5,  emoji:'🥇', label:'Triple Paling Dasar',
    text:'text-cyan-300',   bd:'border-cyan-500/60',   hdr:'bg-cyan-900/50',   chip:'bg-cyan-900/40'   },
  { tipe:2, a:5,  b:12, c:13, emoji:'🥈', label:'Triple Pelaut & Navigator',
    text:'text-green-300',  bd:'border-green-500/60',  hdr:'bg-green-900/50',  chip:'bg-green-900/40'  },
  { tipe:3, a:7,  b:24, c:25, emoji:'🥉', label:'Triple Tersembunyi',
    text:'text-violet-300', bd:'border-violet-500/60', hdr:'bg-violet-900/50', chip:'bg-violet-900/40' },
  { tipe:4, a:8,  b:15, c:17, emoji:'⭐', label:'Triple Para Arsitek',
    text:'text-yellow-300', bd:'border-yellow-500/60', hdr:'bg-yellow-900/50', chip:'bg-yellow-900/40' },
  { tipe:5, a:9,  b:40, c:41, emoji:'💎', label:'Triple Luar Biasa',
    text:'text-pink-300',   bd:'border-pink-500/60',   hdr:'bg-pink-900/50',   chip:'bg-pink-900/40'   },
];

/* ── SVG: Triple verification bar chart ── */
const TripleVerifSVG = ({ a, b, c }: { a: number; b: number; c: number }) => {
  const max = c * c;
  const scaleW = 220 / max;
  return (
    <svg viewBox="0 0 300 90" className="w-full max-w-xs mx-auto" aria-label={`Verifikasi ${a}-${b}-${c}`}>
      <rect x="20" y="12" width={a*a*scaleW} height="16" rx="3" fill="#3b82f6" fillOpacity="0.85"/>
      <text x={a*a*scaleW+24} y="24" fill="#60a5fa" fontSize="9" fontFamily="monospace">{a}²={a*a}</text>
      <rect x="20" y="34" width={b*b*scaleW} height="16" rx="3" fill="#22c55e" fillOpacity="0.85"/>
      <text x={b*b*scaleW+24} y="46" fill="#4ade80" fontSize="9" fontFamily="monospace">{b}²={b*b}</text>
      <rect x="20" y="58" width={c*c*scaleW} height="16" rx="3" fill="#f97316" fillOpacity="0.85"/>
      <text x={c*c*scaleW+24} y="70" fill="#fb923c" fontSize="9" fontFamily="monospace">{c}²={c*c}</text>
      <text x="20" y="86" fill="#94a3b8" fontSize="8" fontFamily="monospace">{a}²+{b}²={a*a+b*b} = {c}²={c*c} ✓</text>
    </svg>
  );
};

/* ── Interactive Triple Checker ── */
/* ── Dynamic triangle SVG for checker ── */
const CheckerTriangleSVG = ({
  s1, s2, s3, isTriple,
}: { s1: number; s2: number; s3: number; isTriple: boolean }) => {
  const p3x = (s1 * s1 + s2 * s2 - s3 * s3) / (2 * s1);
  const p3ySq = s2 * s2 - p3x * p3x;
  if (p3ySq < 0) return null;
  const p3y = Math.sqrt(p3ySq);

  const minX = Math.min(0, p3x);
  const maxX = Math.max(s1, p3x);
  const rawW = maxX - minX || 1;
  const rawH = p3y || 1;

  const drawW = 300, drawH = 140;
  const scale = Math.min(drawW / rawW, drawH / rawH) * 0.75;
  const offsetX = (drawW - rawW * scale) / 2 + 30;
  const offsetY = 20;

  const tx = (x: number) => (x - minX) * scale + offsetX;
  const ty = (y: number) => drawH + offsetY - y * scale;

  const P1 = { x: tx(0),   y: ty(0)   };
  const P2 = { x: tx(s1),  y: ty(0)   };
  const P3 = { x: tx(p3x), y: ty(p3y) };

  const mid12 = { x: (P1.x + P2.x) / 2, y: (P1.y + P2.y) / 2 };
  const mid13 = { x: (P1.x + P3.x) / 2, y: (P1.y + P3.y) / 2 };
  const mid23 = { x: (P2.x + P3.x) / 2, y: (P2.y + P3.y) / 2 };

  const rightAngleSize = Math.min(10, scale * Math.min(s1, s2, s3) * 0.12);

  const RightAngleAt = ({ vx, vy, ax, ay, bx, by }: {
    vx: number; vy: number; ax: number; ay: number; bx: number; by: number;
  }) => {
    const lenA = Math.hypot(ax - vx, ay - vy);
    const lenB = Math.hypot(bx - vx, by - vy);
    const uAx = (ax - vx) / lenA * rightAngleSize;
    const uAy = (ay - vy) / lenA * rightAngleSize;
    const uBx = (bx - vx) / lenB * rightAngleSize;
    const uBy = (by - vy) / lenB * rightAngleSize;
    const mx = vx + uAx + uBx;
    const my = vy + uAy + uBy;
    return (
      <polyline
        points={`${vx+uAx},${vy+uAy} ${mx},${my} ${vx+uBx},${vy+uBy}`}
        fill="none" stroke="#4ade80" strokeWidth="1.8"
      />
    );
  };

  const sides = [s1, s2, s3].sort((x, y) => x - y);
  const hyp = sides[2];
  let rightVertex: { vx: number; vy: number; ax: number; ay: number; bx: number; by: number } | null = null;
  if (isTriple) {
    if (hyp === s3) rightVertex = { vx: P2.x, vy: P2.y, ax: P1.x, ay: P1.y, bx: P3.x, by: P3.y };
    else if (hyp === s2) rightVertex = { vx: P3.x, vy: P3.y, ax: P1.x, ay: P1.y, bx: P2.x, by: P2.y };
    else rightVertex = { vx: P1.x, vy: P1.y, ax: P2.x, ay: P2.y, bx: P3.x, by: P3.y };
  }

  const vb = `0 0 ${drawW + 60} ${drawH + offsetY + 30}`;

  return (
    <svg viewBox={vb} className="w-full max-w-xs mx-auto block" aria-label="Segitiga dari input">
      <defs>
        <filter id="cglow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <polygon
        points={`${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`}
        fill={isTriple ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)"}
        stroke="none"
      />

      <line x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" filter="url(#cglow)"/>
      <line x1={P1.x} y1={P1.y} x2={P3.x} y2={P3.y} stroke="#4ade80" strokeWidth="3" strokeLinecap="round" filter="url(#cglow)"/>
      <line x1={P2.x} y1={P2.y} x2={P3.x} y2={P3.y} stroke="#fb923c" strokeWidth="3" strokeLinecap="round" filter="url(#cglow)"/>

      {rightVertex && <RightAngleAt {...rightVertex}/>}

      <circle cx={P1.x} cy={P1.y} r="4" fill="#60a5fa"/>
      <circle cx={P2.x} cy={P2.y} r="4" fill="#fb923c"/>
      <circle cx={P3.x} cy={P3.y} r="4" fill="#4ade80"/>

      <text x={mid12.x} y={mid12.y + 14} fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Sisi 1 = {s1}</text>
      <text x={mid13.x - 14} y={mid13.y} fill="#86efac" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Sisi 2 = {s2}</text>
      <text x={mid23.x + 14} y={mid23.y} fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Sisi 3 = {s3}</text>
    </svg>
  );
};

const TripleChecker = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [checked, setChecked] = useState<{ na: number; nb: number; nc: number } | null>(null);

  const check = () => {
    const na = parseInt(a), nb = parseInt(b), nc = parseInt(c);
    if (isNaN(na) || isNaN(nb) || isNaN(nc) || na <= 0 || nb <= 0 || nc <= 0) {
      setResult(null); setChecked(null); return;
    }
    const sides = [na, nb, nc].sort((x, y) => x - y);
    setResult(sides[0]**2 + sides[1]**2 === sides[2]**2);
    setChecked({ na, nb, nc });
  };

  return (
    <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-4 space-y-3">

      {/* Decorative right-triangle illustration */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-600/50 px-3 pt-3 pb-1">
        <svg viewBox="0 0 320 150" className="w-full max-w-xs mx-auto block" aria-label="Ilustrasi segitiga siku-siku">
          <defs>
            <filter id="ck-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Triangle fill */}
          <polygon points="40,125 240,125 40,25" fill="rgba(99,102,241,0.10)" stroke="none"/>

          {/* Leg a — vertical — Sisi 2 — green */}
          <line x1="40" y1="125" x2="40" y2="25" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" filter="url(#ck-glow)"/>
          {/* Leg b — horizontal — Sisi 1 — blue */}
          <line x1="40" y1="125" x2="240" y2="125" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" filter="url(#ck-glow)"/>
          {/* Hypotenuse c — Sisi 3 — yellow */}
          <line x1="240" y1="125" x2="40" y2="25" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" filter="url(#ck-glow)"/>

          {/* Right angle square at bottom-left (40,125) */}
          <polyline points="40,107 58,107 58,125" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinejoin="miter"/>

          {/* Vertex dots */}
          <circle cx="40"  cy="125" r="4" fill="#4ade80"/>
          <circle cx="240" cy="125" r="4" fill="#60a5fa"/>
          <circle cx="40"  cy="25"  r="4" fill="#facc15"/>

          {/* Side labels */}
          {/* Sisi 2 — left, vertical */}
          <text x="6" y="78" fill="#86efac" fontSize="11" fontFamily="monospace" fontWeight="bold">Sisi 2</text>
          {/* Sisi 1 — bottom, horizontal */}
          <text x="118" y="142" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Sisi 1</text>
          {/* Sisi 3 — hypotenuse */}
          <text x="158" y="66" fill="#fde047" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-27,158,66)">Sisi 3</text>

          {/* 90° label */}
          <text x="62" y="122" fill="#86efac" fontSize="9" fontFamily="monospace" fontWeight="bold">90°</text>

          {/* Formula badge */}
          <rect x="248" y="38" width="66" height="34" rx="8" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" opacity="0.95"/>
          <text x="281" y="54" fill="#a5b4fc" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Sisi1²+Sisi2²</text>
          <text x="281" y="66" fill="#facc15" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">= Sisi3² ?</text>
        </svg>
        <p className="text-center text-[10px] text-white/30 font-body pb-1">Masukkan tiga sisi → klik Cek! → segitiga langsung digambar</p>
      </div>

      <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">🔬 Cek Triple Pythagoras Sendiri!</p>
      <div className="flex gap-2 items-center flex-wrap">
        {[
          { val: a, set: setA, label: "Sisi 1", col: "border-blue-500" },
          { val: b, set: setB, label: "Sisi 2", col: "border-green-500" },
          { val: c, set: setC, label: "Sisi 3", col: "border-orange-500" },
        ].map(({ val, set, label, col }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="font-body text-xs text-white/50">{label}</label>
            <input
              type="number" min="1" value={val}
              onChange={e => { set(e.target.value); setResult(null); setChecked(null); }}
              className={`w-20 bg-slate-900/60 border ${col} rounded-lg px-3 py-2 text-white text-sm font-body focus:outline-none`}
              placeholder="..."
            />
          </div>
        ))}
        <button
          onClick={check}
          className="mt-5 px-4 py-2 bg-cyan-700/60 border border-cyan-500 text-cyan-300 rounded-lg text-xs font-bold font-body hover:bg-cyan-600/60 transition-colors cursor-pointer"
        >
          Cek!
        </button>
      </div>

      {result !== null && checked && (
        <>
          <div className={`rounded-lg p-3 border ${result ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"}`}>
            <p className={`font-body text-sm font-bold ${result ? "text-green-300" : "text-red-300"}`}>
              {result
                ? `✅ ${checked.na}-${checked.nb}-${checked.nc} adalah Triple Pythagoras!`
                : `❌ ${checked.na}-${checked.nb}-${checked.nc} bukan Triple Pythagoras.`}
            </p>
          </div>

          <div className={`rounded-xl border p-3 ${result ? "border-green-500/30 bg-green-950/20" : "border-red-500/30 bg-red-950/20"}`}>
            <p className="text-center text-xs font-body text-white/50 mb-2">
              {result ? "✨ Segitiga siku-siku terbentuk!" : "📐 Segitiga terbentuk (bukan siku-siku)"}
            </p>
            <CheckerTriangleSVG s1={checked.na} s2={checked.nb} s3={checked.nc} isTriple={result}/>
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-mono text-blue-300">
                <span className="inline-block w-4 h-0.5 rounded" style={{background:'#60a5fa', boxShadow:'0 0 4px #60a5fa'}}/>
                Sisi 1
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-green-300">
                <span className="inline-block w-4 h-0.5 rounded" style={{background:'#4ade80', boxShadow:'0 0 4px #4ade80'}}/>
                Sisi 2
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-orange-300">
                <span className="inline-block w-4 h-0.5 rounded" style={{background:'#fb923c', boxShadow:'0 0 4px #fb923c'}}/>
                Sisi 3
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TriplePythagorasPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro","daftar","pola","contoh1","contoh2","contoh3","rangkuman"]);

  const toggle = (id: string) => {
    playPopSound();
    setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary"/> : <ChevronDown className="w-5 h-5 text-primary"/>}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield/>
      <PageNavigation/>
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3"/>
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          TRIPLE PYTHAGORAS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Teorema Pythagoras · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Apa Itu Triple Pythagoras?"/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Triple Pythagoras</strong> adalah kumpulan tiga bilangan bulat positif yang memenuhi persamaan <InlineMath math="a^2 + b^2 = c^2"/>. Jika kamu hafal triple-triple ini, kamu bisa langsung mengenali segitiga siku-siku tanpa perlu menghitung akar — ini trik cepat favorit para matematikawan!
                  </p>
                </div>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu sedang di ujian dan muncul segitiga dengan kaki 5 cm dan 12 cm. Tanpa kalkulator, kamu bisa langsung bilang "hipotenusanya 13 cm!" karena kamu hafal triple <strong className="text-yellow-300">5-12-13</strong>. Keren, kan? 🚀
                </p>

                {/* ── Attractive 5-12-13 Triangle ── */}
                <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/60 to-slate-900/90 p-4">
                  <p className="text-center text-xs font-bold text-yellow-300 uppercase tracking-widest mb-3 font-body">
                    ✨ Segitiga 5 – 12 – 13
                  </p>
                  <svg
                    viewBox="0 0 380 230"
                    className="w-full max-w-sm mx-auto block"
                    aria-label="Segitiga siku-siku 5-12-13"
                  >
                    <defs>
                      <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25"/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                      <filter id="glowStrong">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                      <marker id="arrowC" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8 Z" fill="#facc15"/>
                      </marker>
                    </defs>

                    {/* Triangle fill */}
                    <polygon points="50,190 290,190 50,50" fill="url(#triGrad)" stroke="none"/>

                    {/* Sides — bottom (kaki 12), left (kaki 5), hypotenuse */}
                    {/* Bottom side — 12 cm — cyan */}
                    <line x1="50" y1="190" x2="290" y2="190" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)"/>
                    {/* Left side — 5 cm — green */}
                    <line x1="50" y1="190" x2="50" y2="50" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)"/>
                    {/* Hypotenuse — 13 cm — yellow */}
                    <line x1="290" y1="190" x2="50" y2="50" stroke="#facc15" strokeWidth="4" strokeLinecap="round" filter="url(#glowStrong)"/>

                    {/* Right angle marker at C=(50,190) — square in the corner */}
                    {/* C is where the vertical leg (CA) meets the horizontal leg (CB) */}
                    <polyline points="50,172 68,172 68,190" fill="none" stroke="#4ade80" strokeWidth="2.2" strokeLinejoin="miter"/>

                    {/* Vertex dots */}
                    <circle cx="50"  cy="190" r="5" fill="#4ade80"  filter="url(#glow)"/>
                    <circle cx="290" cy="190" r="5" fill="#22d3ee"  filter="url(#glow)"/>
                    <circle cx="50"  cy="50"  r="5" fill="#facc15"  filter="url(#glowStrong)"/>

                    {/* Vertex labels */}
                    <text x="30"  y="210" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
                    <text x="295" y="210" fill="#22d3ee" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
                    <text x="34"  y="44"  fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>

                    {/* Side labels */}
                    {/* BC = 12 cm — below */}
                    <text x="160" y="215" fill="#22d3ee" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">12 cm</text>
                    {/* AC = 5 cm — left */}
                    <text x="26"  y="125" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5 cm</text>
                    {/* AB = 13 cm — hypotenuse */}
                    <text x="186" y="108" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-33,186,108)">13 cm</text>

                    {/* 90° label near right angle */}
                    <text x="74" y="188" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">90°</text>

                    {/* Badge: ✓ */}
                    <rect x="285" y="30" width="80" height="28" rx="8" fill="#1e1b4b" stroke="#facc15" strokeWidth="1.5" opacity="0.9"/>
                    <text x="325" y="49" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5²+12²=13²✓</text>
                  </svg>

                  {/* Legend row */}
                  <div className="flex justify-center gap-5 mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#4ade80', boxShadow:'0 0 6px #4ade80'}}/>
                      <span className="text-green-300">Kaki = 5 cm</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#22d3ee', boxShadow:'0 0 6px #22d3ee'}}/>
                      <span className="text-cyan-300">Kaki = 12 cm</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#facc15', boxShadow:'0 0 8px #facc15'}}/>
                      <span className="text-yellow-300">Hipotenusa = 13 cm</span>
                    </span>
                  </div>
                </div>

                <TripleVerifSVG a={3} b={4} c={5}/>
              </div>
            )}
          </div>

          {/* DAFTAR TRIPLE — 5 TIPE BERWARNA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="daftar" icon={<Star className="w-5 h-5"/>} iconColor="text-yellow-400" title="🏆 5 Tipe Triple Pythagoras Wajib Hafal"/>
            {open.includes("daftar") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Headline banner */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 p-4 text-center"
                  style={{background:'linear-gradient(135deg,rgba(8,145,178,0.35) 0%,rgba(124,58,237,0.35) 50%,rgba(219,39,119,0.35) 100%)'}}>
                  <p className="font-display text-base md:text-lg font-black text-white tracking-wide">
                    ⚡ 5 TIPE DASAR — INDUK SEMUA TRIPLE
                  </p>
                  <p className="font-body text-xs text-white/60 mt-1">
                    Setiap triple Pythagoras (umumnya) adalah kelipatan dari salah satu ke-5 tipe ini!
                  </p>
                </div>

                {/* 5 Tipe cards */}
                {LIMA_TIPE.map(({ tipe, a, b, c, emoji, label, text, bd, hdr, chip }) => (
                  <div key={tipe} className={`border ${bd} rounded-xl overflow-hidden`}>
                    {/* Card header */}
                    <div className={`${hdr} px-4 py-3 flex items-center justify-between gap-2`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{emoji}</span>
                        <div className="min-w-0">
                          <p className={`font-display text-xs font-black ${text} uppercase tracking-[0.15em]`}>TIPE {tipe}</p>
                          <p className="text-white/50 text-xs truncate">{label}</p>
                        </div>
                      </div>
                      <div className={`font-mono font-black text-xl md:text-2xl ${text} flex-shrink-0`}>
                        {a} – {b} – {c}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-4 py-3 bg-slate-900/30 space-y-3">
                      {/* Verification row */}
                      <div className="bg-slate-800/70 rounded-lg px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
                        <span className="text-blue-300">{a}²</span>
                        <span className="text-white/30">+</span>
                        <span className="text-green-300">{b}²</span>
                        <span className="text-white/30">=</span>
                        <span className="text-blue-300">{a*a}</span>
                        <span className="text-white/30">+</span>
                        <span className="text-green-300">{b*b}</span>
                        <span className="text-white/30">=</span>
                        <span className="text-white font-bold">{a*a+b*b}</span>
                        <span className="text-white/30">=</span>
                        <span className="text-orange-300">{c}²</span>
                        <span className="text-white/30">=</span>
                        <span className="text-orange-300">{c*c}</span>
                        <span className={`font-bold ${text} ml-1`}>✓</span>
                      </div>

                      {/* Kelipatan grid */}
                      <div>
                        <p className="text-xs text-white/40 mb-1.5 font-body">🔢 Kelipatan (juga Triple Pythagoras):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {[2, 3, 4, 5].map(k => (
                            <div key={k} className={`${chip} rounded-lg px-2 py-2 text-center border border-white/5`}>
                              <p className="text-[10px] text-white/40 font-body">×{k}</p>
                              <p className={`text-xs font-bold font-mono ${text}`}>{a*k}–{b*k}–{c*k}</p>
                              <p className="text-[9px] text-white/30 font-mono">{a*a*k*k+b*b*k*k}={c*c*k*k}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rumus kelipatan */}
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="text-cyan-300 font-semibold text-sm">📌 Mengapa Kelipatan Juga Berlaku?</p>
                  <p className="font-body text-xs text-white/70">
                    Jika <InlineMath math="(a, b, c)"/> triple Pythagoras, maka untuk sembarang <InlineMath math="k > 0"/>:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="(ka)^2 + (kb)^2 = k^2(a^2+b^2) = k^2c^2 = (kc)^2 \checkmark"/>
                  </div>
                </div>

                {/* Triple di luar 5 tipe */}
                <div className="bg-amber-900/20 border-2 border-amber-500/50 rounded-xl overflow-hidden">
                  <div className="bg-amber-900/40 px-4 py-2 border-b border-amber-500/30">
                    <p className="font-display text-sm font-black text-amber-300 tracking-wide">
                      🌟 TRIPLE DI LUAR 5 TIPE — ADA LHO!
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <p className="font-body text-xs text-white/70">
                      Meskipun 5 tipe di atas sangat populer, <strong className="text-amber-300">ada triple Pythagoras yang bukan kelipatan dari kelimanya</strong>. Contoh paling terkenal:
                    </p>
                    <div className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
                      <span className="text-4xl flex-shrink-0">💡</span>
                      <div className="min-w-0">
                        <p className="text-amber-300 font-mono font-black text-2xl tracking-wide">20 – 21 – 29</p>
                        <div className="mt-1 text-xs font-mono text-white/60 flex flex-wrap gap-x-2">
                          <span>20²+21² = 400+441 =</span>
                          <span className="text-green-300 font-bold">841</span>
                          <span>= 29² ✓</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1 font-body italic">Bukan kelipatan dari Tipe 1–5 manapun!</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                      <p className="text-xs font-body text-white/60">
                        Triple seperti <strong className="text-amber-300">20-21-29</strong> disebut <strong className="text-amber-300">triple primitif</strong> — ketiga anggotanya tidak punya faktor persekutuan selain 1
                        (FPB = 1). Ini membuktikan bahwa dunia triple Pythagoras sangat luas!
                      </p>
                    </div>
                  </div>
                </div>

                <TripleChecker/>
              </div>
            )}
          </div>

          {/* POLA KELIPATAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pola" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Tabel Ringkas 5 Tipe + Kelipatannya"/>
            {open.includes("pola") && (
              <div className="px-3 sm:px-5 pb-5 space-y-4">
                <p className="font-body text-xs text-white/60">
                  ⭐ Baris pertama = triple dasar (wajib hafal!), baris berikutnya = kelipatannya.
                </p>

                {/* ── Attractive compact table — no horizontal scroll ── */}
                <div className="rounded-2xl overflow-hidden border border-slate-600/60"
                  style={{background:'linear-gradient(180deg,rgba(15,23,42,0.95) 0%,rgba(2,6,23,0.98) 100%)'}}>

                  {/* Column header */}
                  <div className="grid font-mono" style={{gridTemplateColumns:'auto repeat(5,1fr)'}}>
                    {/* k header */}
                    <div className="px-1.5 sm:px-3 py-2 flex items-center justify-center bg-slate-800/80 border-b border-r border-slate-700/50">
                      <span className="text-[9px] sm:text-[11px] text-white/40 font-bold tracking-widest">k</span>
                    </div>
                    {LIMA_TIPE.map(t => (
                      <div
                        key={t.tipe}
                        className="py-2 px-0.5 flex flex-col items-center justify-center gap-0.5 border-b border-r border-slate-700/50 last:border-r-0"
                        style={{background: `linear-gradient(160deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)`}}
                      >
                        <span className="text-sm sm:text-base leading-none">{t.emoji}</span>
                        <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-tight ${t.text}`}>Tipe {t.tipe}</span>
                        <span className={`text-[7px] sm:text-[9px] font-bold font-mono ${t.text} opacity-80`}>{t.a}–{t.b}–{t.c}</span>
                      </div>
                    ))}
                  </div>

                  {/* Data rows */}
                  {[1,2,3,4,5].map(k => {
                    const isBase = k === 1;
                    return (
                      <div
                        key={k}
                        className="grid border-b border-slate-700/30 last:border-b-0"
                        style={{
                          gridTemplateColumns: 'auto repeat(5,1fr)',
                          background: isBase
                            ? 'linear-gradient(90deg,rgba(6,182,212,0.18) 0%,rgba(139,92,246,0.12) 50%,rgba(236,72,153,0.10) 100%)'
                            : k % 2 === 0 ? 'rgba(15,23,42,0.6)' : 'rgba(30,41,59,0.3)',
                        }}
                      >
                        {/* k cell */}
                        <div className={`px-1.5 sm:px-3 flex items-center justify-center border-r border-slate-700/40 ${isBase ? 'py-3' : 'py-2'}`}>
                          {isBase ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[8px] sm:text-[10px] leading-none">⭐</span>
                              <span className="text-[9px] sm:text-[11px] font-black text-cyan-300 font-mono">×1</span>
                              <span className="text-[6px] sm:text-[8px] text-cyan-400/70 font-body leading-none hidden sm:block">DASAR</span>
                            </div>
                          ) : (
                            <span className="text-[9px] sm:text-[11px] font-bold text-white/40 font-mono">×{k}</span>
                          )}
                        </div>

                        {/* Type cells */}
                        {LIMA_TIPE.map(t => (
                          <div
                            key={t.tipe}
                            className={`flex items-center justify-center border-r border-slate-700/30 last:border-r-0 text-center ${isBase ? 'py-3' : 'py-2'}`}
                          >
                            {isBase ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <span className={`text-[10px] sm:text-[13px] font-black font-mono leading-tight ${t.text}`} style={{textShadow:`0 0 8px currentColor`}}>
                                  {t.a*k}–{t.b*k}–{t.c*k}
                                </span>
                                <span className="text-[7px] sm:text-[9px] text-white/30 font-mono hidden sm:block">
                                  {t.a*t.a}+{t.b*t.b}={t.c*t.c}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[8px] sm:text-[11px] font-mono text-white/55">
                                {t.a*k}–{t.b*k}–{t.c*k}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-start gap-2 flex-wrap text-[10px] font-body text-white/50">
                  <span className="flex items-center gap-1"><span className="text-sm">⭐</span> Baris ×1 = <strong className="text-cyan-300">Triple Dasar (wajib hafal!)</strong></span>
                  <span className="flex items-center gap-1 ml-auto sm:ml-0">Baris ×2–×5 = kelipatan valid</span>
                </div>

                <div className="bg-slate-800/40 border border-slate-600 rounded-lg px-4 py-2">
                  <p className="font-body text-xs text-white/50">
                    💡 <strong className="text-white/70">Cara cepat:</strong> Lihat apakah dua kaki segitiga bisa dibagi bilangan yang sama. Jika hasil baginya cocok dengan tipe 1–5, langsung tahu sisi miringnya!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 — BERBAGAI POSISI SEGITIGA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title="✏️ Contoh 1 — Triple di Berbagai Posisi Segitiga"/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Tentukan sisi yang belum diketahui pada masing-masing segitiga berikut <strong className="text-yellow-300">tanpa kalkulator</strong> menggunakan hafalan Triple Pythagoras!
                  </p>
                </div>

                {/* Sub-soal grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {/* (a) Triple 3-4-5, siku di B bawah-kiri */}
                  <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-2">
                    <p className="text-cyan-300 font-bold text-xs font-body text-center">(a) Siku-siku di B</p>
                    <svg viewBox="0 0 130 130" className="w-full max-w-[130px] mx-auto" aria-label="Segitiga a">
                      <defs><filter id="g1"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <polygon points="25,105 25,25 85,105" fill="rgba(6,182,212,0.08)" stroke="none"/>
                      {/* leg AB vertical — 4 */}
                      <line x1="25" y1="105" x2="25" y2="25" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" filter="url(#g1)"/>
                      {/* leg BC horizontal — 3 */}
                      <line x1="25" y1="105" x2="85" y2="105" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" filter="url(#g1)"/>
                      {/* hypotenuse AC — 5 */}
                      <line x1="25" y1="25" x2="85" y2="105" stroke="#facc15" strokeWidth="3" strokeLinecap="round" filter="url(#g1)"/>
                      {/* right angle at B */}
                      <polyline points="25,90 40,90 40,105" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                      {/* labels */}
                      <text x="10" y="70" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">4 cm</text>
                      <text x="45" y="118" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">3 cm</text>
                      <text x="58" y="58" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">?</text>
                      <text x="20" y="18" fill="#94a3b8" fontSize="9" fontFamily="monospace">A</text>
                      <text x="10" y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">B</text>
                      <text x="88" y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">C</text>
                    </svg>
                    <div className="bg-slate-900/60 rounded-lg px-2 py-1.5 space-y-1">
                      <p className="text-[10px] text-white/50 font-body">Kenali pola: <span className="text-yellow-300 font-bold">3–4–5</span></p>
                      <p className="text-[11px] text-green-300 font-mono font-bold text-center">AC = 5 cm ✓</p>
                    </div>
                  </div>

                  {/* (b) Triple 7-24-25, siku di R bawah-kanan */}
                  <div className="bg-slate-800/60 border border-violet-500/30 rounded-xl p-3 flex flex-col gap-2">
                    <p className="text-violet-300 font-bold text-xs font-body text-center">(b) Siku-siku di R (kanan)</p>
                    <svg viewBox="0 0 130 130" className="w-full max-w-[130px] mx-auto" aria-label="Segitiga b">
                      <defs><filter id="g2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <polygon points="105,105 105,10 20,105" fill="rgba(139,92,246,0.08)" stroke="none"/>
                      {/* leg PR vertical — 24 */}
                      <line x1="105" y1="105" x2="105" y2="10" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" filter="url(#g2)"/>
                      {/* leg QR horizontal — 7 */}
                      <line x1="105" y1="105" x2="20" y2="105" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" filter="url(#g2)"/>
                      {/* hypotenuse PQ — 25 */}
                      <line x1="105" y1="10" x2="20" y2="105" stroke="#facc15" strokeWidth="3" strokeLinecap="round" filter="url(#g2)"/>
                      {/* right angle at R */}
                      <polyline points="105,90 90,90 90,105" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                      {/* labels */}
                      <text x="108" y="62" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">24</text>
                      <text x="52" y="118" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">7 cm</text>
                      <text x="46" y="52" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">?</text>
                      <text x="100" y="8" fill="#94a3b8" fontSize="9" fontFamily="monospace">P</text>
                      <text x="8"   y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">Q</text>
                      <text x="108" y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">R</text>
                    </svg>
                    <div className="bg-slate-900/60 rounded-lg px-2 py-1.5 space-y-1">
                      <p className="text-[10px] text-white/50 font-body">Kenali pola: <span className="text-violet-300 font-bold">7–24–25</span></p>
                      <p className="text-[11px] text-green-300 font-mono font-bold text-center">PQ = 25 cm ✓</p>
                    </div>
                  </div>

                  {/* (c) Triple 8-15-17, siku di E kiri atas */}
                  <div className="bg-slate-800/60 border border-pink-500/30 rounded-xl p-3 flex flex-col gap-2">
                    <p className="text-pink-300 font-bold text-xs font-body text-center">(c) Siku-siku di E (atas)</p>
                    <svg viewBox="0 0 130 130" className="w-full max-w-[130px] mx-auto" aria-label="Segitiga c">
                      <defs><filter id="g3"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <polygon points="20,20 20,95 52,20" fill="rgba(236,72,153,0.08)" stroke="none"/>
                      {/* leg DE vertical — 15 */}
                      <line x1="20" y1="20" x2="20" y2="95" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" filter="url(#g3)"/>
                      {/* leg EF horizontal — 8 */}
                      <line x1="20" y1="20" x2="52" y2="20" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" filter="url(#g3)"/>
                      {/* hypotenuse DF — 17 */}
                      <line x1="20" y1="95" x2="52" y2="20" stroke="#facc15" strokeWidth="3" strokeLinecap="round" filter="url(#g3)"/>
                      {/* right angle at E */}
                      <polyline points="20,35 35,35 35,20" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                      {/* labels */}
                      <text x="2" y="62" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">15</text>
                      <text x="22" y="14" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">8 cm</text>
                      <text x="50" y="65" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">?</text>
                      <text x="14" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">E</text>
                      <text x="8"  y="108" fill="#94a3b8" fontSize="9" fontFamily="monospace">D</text>
                      <text x="54" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">F</text>
                    </svg>
                    <div className="bg-slate-900/60 rounded-lg px-2 py-1.5 space-y-1">
                      <p className="text-[10px] text-white/50 font-body">Kenali pola: <span className="text-pink-300 font-bold">8–15–17</span></p>
                      <p className="text-[11px] text-green-300 font-mono font-bold text-center">DF = 17 cm ✓</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-green-300 text-center">
                    ✅ Triple Pythagoras berlaku di <strong>posisi manapun</strong> — miring, terbalik, atau berputar!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 — KELIPATAN TRIPLE */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title="✏️ Contoh 2 — Cari Sisi Miring dengan Kelipatan Triple"/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Segitiga PQR siku-siku di Q. Diketahui panjang <strong className="text-cyan-300">PQ = 15 cm</strong> dan <strong className="text-green-300">QR = 36 cm</strong>. Tentukan panjang sisi miring <strong className="text-yellow-300">PR</strong> menggunakan kelipatan Triple Pythagoras!
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>

                  <p className="font-body text-sm text-white/80 font-semibold">🔍 Langkah 1: Cari FPB dari 15 dan 36</p>
                  <BlockMath math="15 = 3 \times 5, \quad 36 = 3 \times 12"/>
                  <p className="font-body text-sm text-white/80">FPB = <strong className="text-cyan-300">3</strong>, sehingga:</p>
                  <BlockMath math="\frac{15}{3} = 5 \qquad \frac{36}{3} = 12"/>

                  <p className="font-body text-sm text-white/80 font-semibold">🔍 Langkah 2: Kenali triple dasar</p>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg px-3 py-2 text-center">
                    <p className="font-mono text-yellow-300 font-bold text-sm">5 – 12 – 13</p>
                    <p className="text-xs text-white/50 font-body">5² + 12² = 25 + 144 = 169 = 13² ✓</p>
                  </div>

                  <p className="font-body text-sm text-white/80 font-semibold">🔍 Langkah 3: Hitung sisi miring dengan kelipatan k = 3</p>
                  <BlockMath math="PR = k \times 13 = 3 \times 13 = 39 \text{ cm}"/>

                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">
                      ✅ <strong>PR = 39 cm</strong> — ini kelipatan triple <span className="text-yellow-300 font-bold">5–12–13</span> dengan k = 3. Tidak perlu kalkulator!
                    </p>
                  </div>
                  <TripleVerifSVG a={15} b={36} c={39}/>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 — SOAL CERITA ANGKA BESAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title="✏️ Contoh 3 — Soal Cerita Angka Besar (Sulit)"/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 space-y-3">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide">🔴 Tingkat: Sulit</p>

                  {/* Context illustration */}
                  <div className="flex gap-3 items-center bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
                    <span className="text-4xl flex-shrink-0">🏗️</span>
                    <p className="font-body text-sm text-white/90 leading-relaxed">
                      Seorang insinyur merancang tangga darurat sebuah gedung bertingkat. Jarak horizontal dari ujung bawah tangga ke dinding gedung adalah <strong className="text-cyan-300">560 cm</strong>, dan tinggi dinding tempat tangga bersandar adalah <strong className="text-green-300">1.050 cm</strong>. Berapakah panjang tangga (sisi miring) yang dibutuhkan?
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">📋 Pembahasan</p>

                  <p className="font-body text-sm text-white/80 font-semibold">🔍 Langkah 1: Cari FPB dari 560 dan 1.050</p>
                  <BlockMath math="560 = 70 \times 8 \qquad 1050 = 70 \times 15"/>
                  <p className="font-body text-sm text-white/80">FPB = <strong className="text-red-300">70</strong>, maka:</p>
                  <BlockMath math="\frac{560}{70} = 8 \qquad \frac{1050}{70} = 15"/>

                  <p className="font-body text-sm text-white/80 font-semibold">🔍 Langkah 2: Kenali triple dasar</p>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-2 text-center">
                    <p className="font-mono text-red-300 font-bold text-sm">8 – 15 – 17</p>
                    <p className="text-xs text-white/50 font-body">8² + 15² = 64 + 225 = 289 = 17² ✓</p>
                  </div>

                  <p className="font-body text-sm text-white/80 font-semibold">🔍 Langkah 3: Hitung panjang tangga dengan kelipatan k = 70</p>
                  <BlockMath math="\text{Panjang tangga} = k \times 17 = 70 \times 17 = 1.190 \text{ cm}"/>

                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">
                      ✅ Panjang tangga = <strong>1.190 cm</strong> — kelipatan triple <span className="text-red-300 font-bold">8–15–17</span> dengan k = 70. Angka besar pun selesai dalam hitungan detik! 🚀
                    </p>
                  </div>

                  {/* Key insight box */}
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-2">
                    <p className="font-body text-xs text-amber-300 font-semibold mb-1">💡 Trik Rahasia:</p>
                    <p className="font-body text-xs text-white/70">
                      Angka sebesar apapun bisa diselesaikan dengan triple jika kamu bisa menemukan FPB-nya. Bagi kedua kaki dengan FPB → kenali triple dasar → kalikan hipotenusa dengan FPB yang sama!
                    </p>
                  </div>

                  <TripleVerifSVG a={560} b={1050} c={1190}/>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab"/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <strong className="text-cyan-300">Triple Pythagoras:</strong> tiga bilangan bulat positif <InlineMath math="a, b, c"/> dengan <InlineMath math="a^2+b^2=c^2"/>.</p>
                  <p className="font-body text-sm text-white/80">• Triple wajib hafal: <strong className="text-yellow-300">3-4-5, 5-12-13, 8-15-17, 7-24-25</strong>.</p>
                  <p className="font-body text-sm text-white/80">• Kelipatan triple juga valid: <InlineMath math="(ka, kb, kc)"/> untuk sembarang <InlineMath math="k > 0"/>.</p>
                  <p className="font-body text-sm text-white/80">• Mengenali triple = menyelesaikan soal lebih cepat tanpa kalkulator.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriplePythagorasPage;
