import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Zap } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─────────────────────────────────────────────
   ANIMASI 1 — Panjang Busur Interaktif
───────────────────────────────────────────── */
const AnimasiBusur = () => {
  const [angle, setAngle] = useState(90);
  const [radius, setRadius] = useState(7);

  const cx = 150, cy = 145;
  const rPx = radius * 9;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const startX = cx + rPx;
  const startY = cy;
  const endX = cx + rPx * Math.cos(toRad(angle));
  const endY = cy - rPx * Math.sin(toRad(angle));
  const largeArc = angle > 180 ? 1 : 0;
  const remainLargeArc = largeArc === 1 ? 0 : 1;

  // Arc label — outside the circle at midpoint of arc
  const midRad = toRad(angle / 2);
  const arcLabelDist = rPx + (angle < 40 ? 32 : 22);
  const arcLabelX = cx + arcLabelDist * Math.cos(midRad);
  const arcLabelY = cy - arcLabelDist * Math.sin(midRad);

  // Angle indicator arc (small, near center)
  const indR = 28;
  const indEndX = cx + indR * Math.cos(toRad(angle));
  const indEndY = cy - indR * Math.sin(toRad(angle));

  // Alpha label inside angle indicator
  const alphaR = 44;
  const alphaLabelX = cx + alphaR * Math.cos(midRad);
  const alphaLabelY = cy - alphaR * Math.sin(midRad);

  // r label midpoint along horizontal radius
  const rMidX = cx + rPx / 2;

  // Point B label — push away from circle
  const bLabelX = endX + 12 * Math.cos(toRad(angle));
  const bLabelY = endY - 12 * Math.sin(toRad(angle));

  const arcLength = ((angle / 360) * 2 * Math.PI * radius).toFixed(2);

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 285" className="w-full max-w-xs mx-auto">
        <defs>
          <style>{`
            @keyframes bPulse{0%,100%{stroke-width:6;filter:drop-shadow(0 0 7px #f59e0b);}50%{stroke-width:8;filter:drop-shadow(0 0 16px #f59e0b);}}
            .b-glow{animation:bPulse 1.4s ease-in-out infinite;}
          `}</style>
        </defs>

        {/* Full circle outline (dim) */}
        <circle cx={cx} cy={cy} r={rPx}
          fill="rgba(6,182,212,0.06)" stroke="#164e63" strokeWidth="1.5"/>

        {/* Remaining arc (dim, CW from A to B) */}
        <path
          d={`M ${startX} ${startY} A ${rPx} ${rPx} 0 ${remainLargeArc} 1 ${endX} ${endY}`}
          fill="none" stroke="#0c2b40" strokeWidth="3" opacity="0.55"/>

        {/* Glowing busur */}
        <path
          d={`M ${startX} ${startY} A ${rPx} ${rPx} 0 ${largeArc} 0 ${endX} ${endY}`}
          fill="none" stroke="#f59e0b" strokeLinecap="round"
          className="b-glow"/>

        {/* Two radii (dashed green) */}
        <line x1={cx} y1={cy} x2={startX} y2={startY}
          stroke="#4ade80" strokeWidth="1.8" strokeDasharray="5 3"/>
        <line x1={cx} y1={cy} x2={endX} y2={endY}
          stroke="#4ade80" strokeWidth="1.8" strokeDasharray="5 3"/>

        {/* r label on horizontal radius */}
        <text x={rMidX} y={cy - 7} fill="#4ade80" fontSize="10"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={radius}cm</text>

        {/* Angle indicator arc (small) */}
        <path
          d={`M ${cx + indR} ${cy} A ${indR} ${indR} 0 ${largeArc} 0 ${indEndX} ${indEndY}`}
          fill="none" stroke="#fbbf24" strokeWidth="1.8"/>

        {/* α label */}
        <text x={alphaLabelX} y={alphaLabelY + 4} fill="#fde68a" fontSize="11"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">{angle}°</text>

        {/* Arc label box outside circle */}
        <text x={arcLabelX} y={arcLabelY - 7} fill="#fef08a" fontSize="10"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">Busur AB</text>
        <text x={arcLabelX} y={arcLabelY + 7} fill="#f59e0b" fontSize="10"
          fontFamily="monospace" textAnchor="middle">≈ {arcLength} cm</text>

        {/* Center O */}
        <circle cx={cx} cy={cy} r="4" fill="#06b6d4"/>
        <text x={cx + 7} y={cy - 5} fill="#67e8f9" fontSize="11"
          fontFamily="monospace" fontWeight="bold">O</text>

        {/* Point A */}
        <circle cx={startX} cy={startY} r="4.5" fill="#f59e0b"/>
        <text x={startX + 9} y={startY + 5} fill="#fef08a" fontSize="12"
          fontFamily="monospace" fontWeight="bold">A</text>

        {/* Point B */}
        <circle cx={endX} cy={endY} r="4.5" fill="#f59e0b"/>
        <text x={bLabelX} y={bLabelY + 4} fill="#fef08a" fontSize="12"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
      </svg>

      {/* Sliders */}
      <div className="space-y-3 px-1">
        <div>
          <div className="flex justify-between text-xs font-body text-white/70 mb-1">
            <span>🔄 Sudut α</span>
            <span className="text-amber-300 font-bold">{angle}°</span>
          </div>
          <input type="range" min="15" max="345" step="5" value={angle}
            onChange={e => { setAngle(Number(e.target.value)); playPopSound(); }}
            className="w-full accent-amber-400 cursor-pointer h-2"/>
        </div>
        <div>
          <div className="flex justify-between text-xs font-body text-white/70 mb-1">
            <span>📏 Jari-jari r</span>
            <span className="text-green-300 font-bold">{radius} cm</span>
          </div>
          <input type="range" min="3" max="9" step="1" value={radius}
            onChange={e => { setRadius(Number(e.target.value)); playPopSound(); }}
            className="w-full accent-green-400 cursor-pointer h-2"/>
        </div>
      </div>

      {/* Formula result */}
      <div className="rounded-xl p-3 border"
        style={{ background: "rgba(251,191,36,.1)", borderColor: "rgba(251,191,36,.35)" }}>
        <p className="text-xs text-white/55 font-body text-center mb-1">Panjang Busur AB</p>
        <p className="text-amber-300 text-xs font-mono text-center">
          = ({angle}/360) × 2π × {radius} cm
        </p>
        <p className="text-white font-bold text-xl text-center mt-1">≈ {arcLength} cm</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ANIMASI 2 — Luas Juring Interaktif
───────────────────────────────────────────── */
const AnimasiJuring = () => {
  const [angle, setAngle] = useState(90);
  const [radius, setRadius] = useState(7);

  const cx = 150, cy = 145;
  const rPx = radius * 9;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const startX = cx + rPx;
  const startY = cy;
  const endX = cx + rPx * Math.cos(toRad(angle));
  const endY = cy - rPx * Math.sin(toRad(angle));
  const largeArc = angle > 180 ? 1 : 0;
  const remainLargeArc = largeArc === 1 ? 0 : 1;

  // Label inside sector
  const midRad = toRad(angle / 2);
  const labelInR = rPx * 0.52;
  const secLabelX = cx + labelInR * Math.cos(midRad);
  const secLabelY = cy - labelInR * Math.sin(midRad);

  // Angle indicator arc (small)
  const indR = 28;
  const indEndX = cx + indR * Math.cos(toRad(angle));
  const indEndY = cy - indR * Math.sin(toRad(angle));

  // α label
  const alphaR = 46;
  const alphaLabelX = cx + alphaR * Math.cos(midRad);
  const alphaLabelY = cy - alphaR * Math.sin(midRad);

  // r label
  const rMidX = cx + rPx / 2;

  // B label
  const bLabelX = endX + 12 * Math.cos(toRad(angle));
  const bLabelY = endY - 12 * Math.sin(toRad(angle));

  const sectorArea = ((angle / 360) * Math.PI * radius * radius).toFixed(2);

  // For very small angle, put label outside
  const labelInside = angle >= 25;
  const outsideLabelR = rPx + 24;
  const outsideLabelX = cx + outsideLabelR * Math.cos(midRad);
  const outsideLabelY = cy - outsideLabelR * Math.sin(midRad);
  const lx = labelInside ? secLabelX : outsideLabelX;
  const ly = labelInside ? secLabelY : outsideLabelY;

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 285" className="w-full max-w-xs mx-auto">
        <defs>
          <style>{`
            @keyframes jFill{0%,100%{opacity:.55;filter:drop-shadow(0 0 8px #a855f7);}50%{opacity:.82;filter:drop-shadow(0 0 20px #a855f7);}}
            @keyframes jStroke{0%,100%{stroke:#a855f7;}50%{stroke:#d8b4fe;filter:drop-shadow(0 0 6px #c084fc);}}
            .j-fill{animation:jFill 1.4s ease-in-out infinite;}
            .j-stroke{animation:jStroke 1.4s ease-in-out infinite;}
          `}</style>
        </defs>

        {/* Full circle outline (dim) */}
        <circle cx={cx} cy={cy} r={rPx}
          fill="rgba(6,182,212,0.04)" stroke="#164e63" strokeWidth="1.5" opacity="0.5"/>

        {/* Remaining arc (dim) */}
        <path
          d={`M ${startX} ${startY} A ${rPx} ${rPx} 0 ${remainLargeArc} 1 ${endX} ${endY}`}
          fill="none" stroke="#1e293b" strokeWidth="1.5" opacity="0.5"/>

        {/* Sector fill — glowing */}
        <path
          d={`M ${cx} ${cy} L ${startX} ${startY} A ${rPx} ${rPx} 0 ${largeArc} 0 ${endX} ${endY} Z`}
          fill="rgba(168,85,247,0.55)" stroke="none"
          className="j-fill"/>

        {/* Sector outline — glowing */}
        <path
          d={`M ${cx} ${cy} L ${startX} ${startY} A ${rPx} ${rPx} 0 ${largeArc} 0 ${endX} ${endY} Z`}
          fill="none" strokeWidth="2.5"
          className="j-stroke"/>

        {/* Angle indicator arc */}
        <path
          d={`M ${cx + indR} ${cy} A ${indR} ${indR} 0 ${largeArc} 0 ${indEndX} ${indEndY}`}
          fill="none" stroke="#fbbf24" strokeWidth="1.8"/>

        {/* α label */}
        <text x={alphaLabelX} y={alphaLabelY + 4} fill="#fde68a" fontSize="11"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">{angle}°</text>

        {/* r label */}
        <text x={rMidX} y={cy - 7} fill="#c4b5fd" fontSize="10"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">r={radius}cm</text>

        {/* Sector area label */}
        <text x={lx} y={ly - 7} fill="#e9d5ff" fontSize="10"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">Juring</text>
        <text x={lx} y={ly + 7} fill="#d8b4fe" fontSize="10"
          fontFamily="monospace" textAnchor="middle">{sectorArea} cm²</text>

        {/* Center O */}
        <circle cx={cx} cy={cy} r="4" fill="#06b6d4"/>
        <text x={cx + 7} y={cy - 5} fill="#67e8f9" fontSize="11"
          fontFamily="monospace" fontWeight="bold">O</text>

        {/* Point A */}
        <circle cx={startX} cy={startY} r="4.5" fill="#c084fc"/>
        <text x={startX + 9} y={startY + 5} fill="#e9d5ff" fontSize="12"
          fontFamily="monospace" fontWeight="bold">A</text>

        {/* Point B */}
        <circle cx={endX} cy={endY} r="4.5" fill="#c084fc"/>
        <text x={bLabelX} y={bLabelY + 4} fill="#e9d5ff" fontSize="12"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
      </svg>

      {/* Sliders */}
      <div className="space-y-3 px-1">
        <div>
          <div className="flex justify-between text-xs font-body text-white/70 mb-1">
            <span>🔄 Sudut α</span>
            <span className="text-purple-300 font-bold">{angle}°</span>
          </div>
          <input type="range" min="15" max="345" step="5" value={angle}
            onChange={e => { setAngle(Number(e.target.value)); playPopSound(); }}
            className="w-full accent-purple-400 cursor-pointer h-2"/>
        </div>
        <div>
          <div className="flex justify-between text-xs font-body text-white/70 mb-1">
            <span>📏 Jari-jari r</span>
            <span className="text-violet-300 font-bold">{radius} cm</span>
          </div>
          <input type="range" min="3" max="9" step="1" value={radius}
            onChange={e => { setRadius(Number(e.target.value)); playPopSound(); }}
            className="w-full accent-violet-400 cursor-pointer h-2"/>
        </div>
      </div>

      {/* Formula result */}
      <div className="rounded-xl p-3 border"
        style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
        <p className="text-xs text-white/55 font-body text-center mb-1">Luas Juring OAB</p>
        <p className="text-purple-300 text-xs font-mono text-center">
          = ({angle}/360) × π × {radius}² cm²
        </p>
        <p className="text-white font-bold text-xl text-center mt-1">≈ {sectorArea} cm²</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Static SVGs (kept from original)
───────────────────────────────────────────── */
const BusurJuringSVG = () => (
  <svg viewBox="0 0 300 240" className="w-full max-w-sm mx-auto my-2" aria-label="Busur dan juring lingkaran">
    <defs>
      <style>{`
        @keyframes juringFill{0%{opacity:0;}100%{opacity:1;}}
        @keyframes arcGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #f59e0b);}50%{stroke-opacity:0.4;filter:none;}}
        .jf{animation:juringFill 1.2s ease-in forwards;}
        .ag{animation:arcGlow 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="120" r="90" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <path d="M150,120 L240,120 A90,90 0 0,0 150,30 Z" fill="rgba(251,191,36,0.3)" stroke="#f59e0b" strokeWidth="2" className="jf"/>
    <path d="M240,120 A90,90 0 0,0 150,30" fill="none" stroke="#f59e0b" strokeWidth="4" className="ag"/>
    <line x1="150" y1="120" x2="240" y2="120" stroke="#22c55e" strokeWidth="2" strokeDasharray="5 3"/>
    <line x1="150" y1="120" x2="150" y2="30" stroke="#22c55e" strokeWidth="2" strokeDasharray="5 3"/>
    <text x="195" y="116" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="145" y="75" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    <circle cx="150" cy="120" r="4" fill="#06b6d4"/>
    <text x="155" y="116" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <path d="M150,120 m25,0 a25,25 0 0,0 -25,-25" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="178" y="104" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">α</text>
    <text x="195" y="65" fill="#fef08a" fontSize="11" fontFamily="monospace" fontWeight="bold">Busur</text>
    <text x="190" y="95" fill="#fef08a" fontSize="10" fontFamily="monospace">(panjang = ?)</text>
    <text x="168" y="108" fill="#fde68a" fontSize="9" fontFamily="monospace">Juring</text>
    <text x="10" y="200" fill="#94a3b8" fontSize="9" fontFamily="monospace">Panjang Busur = (α/360°) × 2πr</text>
    <text x="10" y="215" fill="#94a3b8" fontSize="9" fontFamily="monospace">Luas Juring    = (α/360°) × πr²</text>
  </svg>
);

const TemberengLengkapSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Tembereng lingkaran">
    <defs>
      <style>{`@keyframes tFill{0%{opacity:0;}100%{opacity:1;}}.tf{animation:tFill 1.5s ease-in forwards;}`}</style>
    </defs>
    <circle cx="140" cy="100" r="80" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <path d="M 76 140 A 80 80 0 0 1 204 140 Z" fill="rgba(168,85,247,0.4)" stroke="#a855f7" strokeWidth="2" className="tf"/>
    <path d="M 76 140 A 80 80 0 0 1 204 140" fill="none" stroke="#a855f7" strokeWidth="3"/>
    <line x1="76" y1="140" x2="204" y2="140" stroke="#f97316" strokeWidth="2.5"/>
    <line x1="140" y1="100" x2="76" y2="140" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2"/>
    <line x1="140" y1="100" x2="204" y2="140" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2"/>
    <circle cx="140" cy="100" r="4" fill="#06b6d4"/>
    <text x="120" y="165" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">Tembereng</text>
    <text x="100" y="185" fill="#94a3b8" fontSize="8" fontFamily="monospace">L.Tembereng = L.Juring − L.Segitiga</text>
  </svg>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const BusurJuringPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "animasi1", "animasi2", "rumus", "contoh1", "contoh2", "contoh3", "rangkuman"]);
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
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">PANJANG BUSUR DAN LUAS JURING</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🍕 Analogi Pizza yang Sempurna" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan sebuah pizza! Jika pizza utuh = lingkaran penuh (360°), maka <strong className="text-yellow-300">juring</strong> adalah satu potong pizza. Semakin besar sudutnya, semakin besar potongannya. Nah, <strong className="text-orange-300">busur</strong> adalah tepi luar potongan pizza itu — bagian lekungnya yang berkerak!
                </p>
                <BusurJuringSVG />
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>Ide Kunci:</strong> Perbandingan sudut juring dengan sudut penuh (360°) menentukan berapa bagian busur dan juring dari keseluruhan lingkaran.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── ANIMASI 1 — PANJANG BUSUR ── */}
          <div className="rounded-xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.8)", borderColor: "rgba(251,191,36,.3)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="animasi1" icon={<Zap className="w-5 h-5" />} iconColor="text-amber-400"
              title="⚡ Animasi 1 — Eksplorasi Panjang Busur" />
            {open.includes("animasi1") && (
              <div className="px-5 pb-5 pt-2 space-y-4">
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(251,191,36,.08)", borderColor: "rgba(251,191,36,.25)" }}>
                  <p className="text-amber-200 text-xs font-body leading-relaxed">
                    🎯 Geser slider <strong>sudut α</strong> dan lihat busur yang menyala (🟠) membesar/mengecil sesuai kelipatan sudutnya. Geser <strong>jari-jari r</strong> untuk ubah ukuran lingkaran. Panjang busur dihitung otomatis!
                  </p>
                </div>
                <AnimasiBusur />
              </div>
            )}
          </div>

          {/* ── ANIMASI 2 — LUAS JURING ── */}
          <div className="rounded-xl overflow-hidden border"
            style={{ background: "rgba(15,23,42,.8)", borderColor: "rgba(168,85,247,.3)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="animasi2" icon={<Zap className="w-5 h-5" />} iconColor="text-purple-400"
              title="⚡ Animasi 2 — Eksplorasi Luas Juring" />
            {open.includes("animasi2") && (
              <div className="px-5 pb-5 pt-2 space-y-4">
                <div className="rounded-xl p-3 border"
                  style={{ background: "rgba(168,85,247,.08)", borderColor: "rgba(168,85,247,.25)" }}>
                  <p className="text-purple-200 text-xs font-body leading-relaxed">
                    🎯 Geser slider <strong>sudut α</strong> dan lihat juring yang bercahaya (🟣) membesar/mengecil. Perbesar juga <strong>jari-jari r</strong> — juringnya ikut membesar! Luas juring dihitung secara real-time.
                  </p>
                </div>
                <AnimasiJuring />
              </div>
            )}
          </div>

          {/* ── RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Rumus Panjang Busur, Luas Juring & Tembereng" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Kunci utama: gunakan <strong className="text-yellow-300">perbandingan sudut pusat</strong> terhadap 360° untuk mencari bagian dari keliling maupun luas lingkaran.</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-yellow-300 mb-2">📏 Panjang Busur AB</p>
                    <BlockMath math="\text{Panjang Busur} = \frac{\alpha}{360°} \times 2\pi r" />
                    <p className="font-body text-xs text-white/60">α = sudut pusat yang menghadap busur AB</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-orange-300 mb-2">🍕 Luas Juring OAB</p>
                    <BlockMath math="\text{Luas Juring} = \frac{\alpha}{360°} \times \pi r^2" />
                  </div>
                  <div className="bg-purple-900/30 border border-purple-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-purple-300 mb-2">🌙 Luas Tembereng</p>
                    <BlockMath math="\text{Luas Tembereng} = \text{Luas Juring} - \text{Luas Segitiga OAB}" />
                    <TemberengLengkapSVG />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 1 ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Panjang Busur (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Lingkaran berjari-jari 21 cm memiliki sudut pusat 120°. Hitunglah panjang busur yang sesuai! (π = 22/7)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="r = 21"/> cm, <InlineMath math="\alpha = 120°"/></p>
                  <BlockMath math="\text{Panjang Busur} = \frac{120}{360} \times 2 \times \frac{22}{7} \times 21" />
                  <BlockMath math="= \frac{1}{3} \times 2 \times \frac{22}{7} \times 21" />
                  <BlockMath math="= \frac{1}{3} \times 132 = 44 \text{ cm}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Panjang busur = <strong>44 cm</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 2 ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Luas Juring (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah juring lingkaran memiliki panjang busur 33 cm dan jari-jari 63 cm. Tentukan luas juring tersebut! (π = 22/7)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Cari sudut pusat dari panjang busur</p>
                  <BlockMath math="\text{Panjang Busur} = \frac{\alpha}{360°} \times 2\pi r" />
                  <BlockMath math="33 = \frac{\alpha}{360} \times 2 \times \frac{22}{7} \times 63 = \frac{\alpha}{360} \times 396" />
                  <BlockMath math="\alpha = \frac{33 \times 360}{396} = 30°" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung luas juring</p>
                  <BlockMath math="\text{Luas Juring} = \frac{30}{360} \times \frac{22}{7} \times 63^2 = \frac{1}{12} \times \frac{22}{7} \times 3969" />
                  <BlockMath math="= \frac{1}{12} \times 12474 = 1039{,}5 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Cara pintas:</strong> Luas Juring = ½ × r × panjang busur</p>
                  <BlockMath math="= \frac{1}{2} \times 63 \times 33 = 1039{,}5 \text{ cm}^2 \checkmark" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">✅ Luas juring = <strong>1.039,5 cm²</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 3 ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Luas Tembereng (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Lingkaran berpusat O memiliki jari-jari 10 cm. Juring OAB memiliki sudut pusat 60°. Hitunglah luas tembereng yang dibatasi tali busur AB dan busur AB! (π = 3,14, <InlineMath math="\sqrt{3} \approx 1{,}732"/>)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Luas juring OAB</p>
                  <BlockMath math="\text{Luas Juring} = \frac{60}{360} \times 3{,}14 \times 10^2 = \frac{1}{6} \times 314 \approx 52{,}33 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Luas segitiga OAB</p>
                  <p className="font-body text-sm text-white/80">Karena α = 60° dan OA = OB = r = 10 cm, segitiga OAB adalah segitiga sama kaki dengan sudut puncak 60°, jadi segitiga OAB adalah segitiga sama sisi!</p>
                  <BlockMath math="\text{Luas} \triangle OAB = \frac{\sqrt{3}}{4} \times s^2 = \frac{1{,}732}{4} \times 100 = 43{,}3 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Luas tembereng</p>
                  <BlockMath math="\text{Luas Tembereng} = 52{,}33 - 43{,}3 = 9{,}03 \text{ cm}^2" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Luas tembereng ≈ <strong>9,03 cm²</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">Panjang Busur</strong> = <InlineMath math="\frac{\alpha}{360°} \times 2\pi r"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">Luas Juring</strong> = <InlineMath math="\frac{\alpha}{360°} \times \pi r^2"/> atau <InlineMath math="\frac{1}{2} \times r \times \text{busur}"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-purple-300">Luas Tembereng</strong> = Luas Juring − Luas Segitiga</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Antena parabola dan reflektor teleskop menggunakan perhitungan busur untuk menentukan sudut fokus sinyal. Semakin tepat sudutnya, semakin jernih sinyalnya!
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

export default BusurJuringPage;
