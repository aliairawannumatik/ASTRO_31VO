import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Triangle, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   3D CONE SVG RENDERER — manual projection, painter's algorithm
───────────────────────────────────────────────────────────── */
const SEGS = 28;
const CR = 58;
const CH = 115;
const PD = 480;
const SVG_W = 320;
const SVG_H = 290;
const CX = SVG_W / 2;
const CY = SVG_H / 2 + 10;

function rotPt(x: number, y: number, z: number, rx: number, ry: number) {
  const rxa = (rx * Math.PI) / 180;
  const rya = (ry * Math.PI) / 180;
  const x1 = x * Math.cos(rya) + z * Math.sin(rya);
  const z1 = -x * Math.sin(rya) + z * Math.cos(rya);
  const y2 = y * Math.cos(rxa) - z1 * Math.sin(rxa);
  const z2 = y * Math.sin(rxa) + z1 * Math.cos(rxa);
  return { x: x1, y: y2, z: z2 };
}

function proj(p: { x: number; y: number; z: number }) {
  const s = PD / (PD + p.z + 80);
  return { x: CX + p.x * s, y: CY + p.y * s };
}

const cone3DLabels: Record<Language, {
  drag: string; apex: string; selimutLabel: string; selimutSub: string;
  alasLabel: string; alasSub: string; netFooter: string; btnCone: string;
}> = {
  id: {
    drag: "Drag untuk memutar · Klik dan geser untuk eksplorasi",
    apex: "T (puncak)",
    selimutLabel: "SELIMUT", selimutSub: "(juring lingkaran, r=s)",
    alasLabel: "ALAS", alasSub: "(lingkaran, r=r)",
    netFooter: "Jaring-jaring Kerucut: Alas (lingkaran) + Selimut (juring)",
    btnCone: "🔺 Kerucut 3D",
  },
  en: {
    drag: "Drag to rotate · Click and drag to explore",
    apex: "T (apex)",
    selimutLabel: "LATERAL", selimutSub: "(circular sector, r=s)",
    alasLabel: "BASE", alasSub: "(circle, r=r)",
    netFooter: "Net of a Cone: Base (circle) + Lateral surface (sector)",
    btnCone: "🔺 3D Cone",
  },
  ja: {
    drag: "ドラッグして回転 · クリック&ドラッグで操作",
    apex: "T（頂点）",
    selimutLabel: "側面", selimutSub: "（扇形、r=s）",
    alasLabel: "底面", alasSub: "（円、r=r）",
    netFooter: "円錐の展開図：底面（円）＋側面（扇形）",
    btnCone: "🔺 円錐3D",
  },
};
const InteractiveCone3D = ({ language }: { language: Language }) => {
  const L = cone3DLabels[language];
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(28);
  const [isDragging, setIsDragging] = useState(false);
  const [showNet, setShowNet] = useState(false);
  const dragRef = useRef({ sx: 0, sy: 0, brx: -22, bry: 28 });

  const onMD = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, brx: rotX, bry: rotY };
  };
  const onMM = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.bry + (e.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.brx - (e.clientY - dragRef.current.sy) * 0.55);
  }, [isDragging]);
  const onMU = useCallback(() => setIsDragging(false), []);
  const onTS = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { sx: t.clientX, sy: t.clientY, brx: rotX, bry: rotY };
  };
  const onTM = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    setRotY(dragRef.current.bry + (t.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.brx - (t.clientY - dragRef.current.sy) * 0.55);
  }, [isDragging]);
  const onTE = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onTM, { passive: false });
    window.addEventListener("touchend", onTE);
    return () => {
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("touchend", onTE);
    };
  }, [onMM, onMU, onTM, onTE]);

  useEffect(() => {
    if (isDragging || showNet) return;
    let frameId: number;
    let lastTs = 0;
    const animate = (ts: number) => {
      if (lastTs) setRotY(prev => prev + (ts - lastTs) * 0.028);
      lastTs = ts;
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging, showNet]);

  const apex3D = rotPt(0, -CH / 2, 0, rotX, rotY);
  const apex2D = proj(apex3D);

  const baseVerts = Array.from({ length: SEGS }, (_, i) => {
    const a = (2 * Math.PI * i) / SEGS;
    return rotPt(Math.cos(a) * CR, CH / 2, Math.sin(a) * CR, rotX, rotY);
  });
  const baseVerts2D = baseVerts.map(proj);

  type Panel = {
    avgZ: number;
    visible: boolean;
    fill: string;
    stroke: string;
    points: string;
  };

  const panels: Panel[] = Array.from({ length: SEGS }, (_, i) => {
    const ni = (i + 1) % SEGS;
    const v0 = baseVerts[i];
    const v1 = baseVerts[ni];
    const p0 = baseVerts2D[i];
    const p1 = baseVerts2D[ni];
    const dx0 = v1.x - v0.x;
    const dy0 = v1.y - v0.y;
    const dz0 = v1.z - v0.z;
    const dx1 = apex3D.x - v0.x;
    const dy1 = apex3D.y - v0.y;
    const dz1 = apex3D.z - v0.z;
    const nz = dx0 * dy1 - dy0 * dx1;
    const visible = nz < 0;
    const avgZ = (v0.z + v1.z + apex3D.z) / 3;
    const t = (i / SEGS);
    const hue = Math.floor(t * 60) + 180;
    return {
      avgZ,
      visible,
      fill: `hsla(${hue},80%,55%,${visible ? 0.88 : 0})`,
      stroke: visible ? "#ffffff55" : "none",
      points: `${p0.x},${p0.y} ${p1.x},${p1.y} ${apex2D.x},${apex2D.y}`,
    };
  });

  const sortedPanels = [...panels].sort((a, b) => b.avgZ - a.avgZ);

  const basePolyPoints = baseVerts2D.map(p => `${p.x},${p.y}`).join(" ");
  const baseAvgZ = baseVerts.reduce((s, v) => s + v.z, 0) / SEGS;

  const slantR = Math.sqrt(CR * CR + (CH / 2) * (CH / 2));
  const baseVisible = rotX < 10;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        {L.drag}
      </p>

      {!showNet ? (
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ maxWidth: SVG_W, display: "block", margin: "0 auto", cursor: isDragging ? "grabbing" : "grab" }}
          onMouseDown={onMD}
          onTouchStart={onTS}
        >
          {sortedPanels.map((p, i) =>
            p.visible && (
              <polygon key={i} points={p.points} fill={p.fill} stroke={p.stroke} strokeWidth="0.8" />
            )
          )}
          {baseAvgZ > apex3D.z || baseVisible ? (
            <polygon points={basePolyPoints} fill="rgba(99,102,241,0.75)" stroke="#a5b4fc" strokeWidth="1.2" />
          ) : null}
          {sortedPanels.map((p, i) =>
            !p.visible && (
              <polygon key={`b${i}`} points={p.points} fill="rgba(100,150,200,0.06)" stroke="#ffffff15" strokeWidth="0.5" />
            )
          )}
          <circle cx={apex2D.x} cy={apex2D.y} r="5" fill="#facc15" opacity="0.9" />
          <text x={apex2D.x + 8} y={apex2D.y + 4} fill="#facc15" fontSize="10" fontFamily="monospace" fontWeight="bold">{L.apex}</text>
          <text x="10" y={SVG_H - 12} fill="#94a3b8" fontSize="9" fontFamily="monospace">r={CR}px  t={CH}px</text>
          <text x={SVG_W - 80} y={SVG_H - 12} fill="#22d3ee" fontSize="9" fontFamily="monospace">s=√(r²+t²)</text>
        </svg>
      ) : (
        <svg viewBox="0 0 340 300" width="100%" style={{ maxWidth: 340, display: "block", margin: "0 auto" }}>
          <defs>
            <style>{`
              @keyframes netGlow{0%,100%{opacity:1;}50%{opacity:0.65;}}
              .ng{animation:netGlow 2s ease-in-out infinite;}
            `}</style>
          </defs>
          <g transform="translate(180,150)">
            {/* Sector (selimut kerucut) */}
            {(() => {
              const sR = 115;
              const theta = (CR / sR) * 2 * Math.PI;
              const tDeg = (CR / sR) * 360;
              const x1 = sR * Math.sin(-theta / 2);
              const y1 = -sR * Math.cos(-theta / 2);
              const x2 = sR * Math.sin(theta / 2);
              const y2 = -sR * Math.cos(theta / 2);
              const lg = theta > Math.PI ? 1 : 0;
              return (
                <g>
                  <path
                    d={`M 0,0 L ${x1},${y1} A ${sR},${sR} 0 ${lg},1 ${x2},${y2} Z`}
                    fill="rgba(6,182,212,0.35)" stroke="#22d3ee" strokeWidth="2" className="ng"
                  />
                  <text x="0" y="-60" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{L.selimutLabel}</text>
                  <text x="0" y="-46" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">{L.selimutSub}</text>
                  <line x1="0" y1="0" x2={x1} y2={y1} stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,3"/>
                  <text x={x1 / 2 - 18} y={y1 / 2} fill="#facc15" fontSize="9" fontFamily="monospace">s</text>
                </g>
              );
            })()}
          </g>
          {/* Base circle */}
          <circle cx="64" cy="245" r="42" fill="rgba(99,102,241,0.35)" stroke="#a5b4fc" strokeWidth="2" className="ng"/>
          <text x="64" y="248" fill="#a5b4fc" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{L.alasLabel}</text>
          <text x="64" y="260" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">{L.alasSub}</text>
          <text x="64" y="272" fill="#facc15" fontSize="9" fontFamily="monospace" textAnchor="middle">r</text>
          <text x="170" y="295" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">{L.netFooter}</text>
        </svg>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => { playPopSound(); setShowNet(false); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer font-body ${!showNet ? "bg-cyan-700/60 border-cyan-500 text-cyan-200" : "bg-slate-800/60 border-slate-600 text-slate-300 hover:bg-slate-700/60"}`}
        >
          {L.btnCone}
        </button>
      </div>

    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — UNSUR-UNSUR KERUCUT
───────────────────────────────────────────────────────────── */
const unsurSvgLabels: Record<Language, string[]> = {
  id: ["T = puncak", "t = tinggi", "r = jari-jari", "s = garis pelukis", "O = pusat alas"],
  en: ["T = apex", "t = height", "r = radius", "s = slant height", "O = base center"],
  ja: ["T = 頂点", "t = 高さ", "r = 半径", "s = 母線", "O = 底面の中心"],
};
const UnsurSVG = ({ language }: { language: Language }) => {
  const L = unsurSvgLabels[language];
  return (
  <svg viewBox="0 0 300 240" className="w-full max-w-sm mx-auto my-2" aria-label="Unsur-unsur kerucut">
    <defs>
      <style>{`
        @keyframes kerGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px currentColor);}50%{stroke-opacity:0.3;}}
        @keyframes kerPulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .kr{animation:kerGlow 1.5s ease-in-out infinite;}
        .kp{animation:kerPulse 1.6s ease-in-out infinite;}
      `}</style>
      <radialGradient id="coneGrad" cx="40%" cy="30%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#0e7490" stopOpacity="0.2"/>
      </radialGradient>
    </defs>
    {/* Cone body */}
    <polygon points="150,20 60,200 240,200" fill="url(#coneGrad)" stroke="#22d3ee" strokeWidth="2"/>
    {/* Base ellipse */}
    <ellipse cx="150" cy="200" rx="90" ry="20" fill="rgba(99,102,241,0.35)" stroke="#a5b4fc" strokeWidth="1.8"/>
    {/* Apex dot */}
    <circle cx="150" cy="20" r="5" fill="#facc15" className="kp"/>
    {/* Height (tinggi) */}
    <line x1="150" y1="20" x2="150" y2="200" stroke="#f97316" strokeWidth="2.5" strokeDasharray="7,4" className="kr" style={{color:"#f97316"}}/>
    <text x="156" y="115" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold">t</text>
    {/* Radius (jari-jari) */}
    <line x1="150" y1="200" x2="240" y2="200" stroke="#4ade80" strokeWidth="2.5" className="kr" style={{color:"#4ade80"}}/>
    <text x="190" y="195" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Slant height (garis pelukis) */}
    <line x1="150" y1="20" x2="240" y2="200" stroke="#f87171" strokeWidth="2.5" strokeDasharray="6,3" className="kr" style={{color:"#f87171"}}/>
    <text x="204" y="105" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">s</text>
    {/* Labels */}
    <text x="8" y="30" fill="#facc15" fontSize="10" fontFamily="monospace">{L[0]}</text>
    <text x="8" y="48" fill="#f97316" fontSize="10" fontFamily="monospace">{L[1]}</text>
    <text x="8" y="64" fill="#4ade80" fontSize="10" fontFamily="monospace">{L[2]}</text>
    <text x="8" y="80" fill="#f87171" fontSize="10" fontFamily="monospace">{L[3]}</text>
    <text x="8" y="96" fill="#a5b4fc" fontSize="10" fontFamily="monospace">{L[4]}</text>
    <circle cx="150" cy="200" r="4" fill="#a5b4fc" className="kp"/>
    <text x="155" y="215" fill="#a5b4fc" fontSize="9" fontFamily="monospace">O</text>
    <text x="148" y="15" fill="#facc15" fontSize="9" fontFamily="monospace">T</text>
  </svg>
  );
};

const GarisPelukisSVG = () => (
  <svg viewBox="0 0 300 240" className="w-full max-w-sm mx-auto my-2" aria-label="Garis pelukis kerucut">
    <defs>
      <style>{`
        @keyframes gpAnim{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 7px #f87171);}50%{stroke-opacity:0.2;}}
        .gp{animation:gpAnim 1.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Cone outline */}
    <polygon points="150,25 65,200 235,200" fill="rgba(6,182,212,0.1)" stroke="#334155" strokeWidth="1.5"/>
    <ellipse cx="150" cy="200" rx="85" ry="18" fill="rgba(99,102,241,0.18)" stroke="#475569" strokeWidth="1.2"/>
    {/* Right triangle formed by t, r, s */}
    <line x1="150" y1="25" x2="150" y2="200" stroke="#f97316" strokeWidth="2" strokeDasharray="6,3"/>
    <line x1="150" y1="200" x2="235" y2="200" stroke="#4ade80" strokeWidth="2"/>
    <line x1="150" y1="25" x2="235" y2="200" stroke="#f87171" strokeWidth="3" className="gp"/>
    {/* Right angle mark */}
    <polyline points="150,185 165,185 165,200" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
    {/* Labels */}
    <text x="156" y="115" fill="#f97316" fontSize="12" fontFamily="monospace" fontWeight="bold">t</text>
    <text x="188" y="196" fill="#4ade80" fontSize="12" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="202" y="105" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">s</text>
    <text x="60" y="155" fill="#facc15" fontSize="11" fontFamily="monospace">s² = r² + t²</text>
    <text x="60" y="170" fill="#facc15" fontSize="11" fontFamily="monospace">s = √(r² + t²)</text>
  </svg>
);

const luasKerucutSvgLabels: Record<Language, { selimut: string; alas: string }> = {
  id: { selimut: "SELIMUT", alas: "ALAS" },
  en: { selimut: "LATERAL", alas: "BASE" },
  ja: { selimut: "側面", alas: "底面" },
};
const LuasKerucutSVG = ({ language }: { language: Language }) => {
  const L = luasKerucutSvgLabels[language];
  /* Sector geometry: apex at (140,55), R=90, sector angle=150°
     half-angle=75°, opening downward
     x1=140+90·cos15°≈227, y1=55+90·sin15°≈78
     x2=140+90·cos165°≈53, y2=78
     arc bottom at (140, 145)                               */
  const cx = 140, cy = 55, R = 90;
  const x1 = cx + R * Math.cos(15 * Math.PI / 180);
  const y1 = cy + R * Math.sin(15 * Math.PI / 180);
  const x2 = cx + R * Math.cos(165 * Math.PI / 180);
  const y2 = cy + R * Math.sin(165 * Math.PI / 180);
  const midSx = (cx + x2) / 2 - 8; // midpoint of left arm for 's' label
  const midSy = (cy + y2) / 2 - 2;

  return (
    <svg viewBox="0 0 280 270" className="w-full max-w-sm mx-auto my-2" aria-label="Luas permukaan kerucut">
      <defs>
        <style>{`
          @keyframes lkAnim{0%,100%{fill-opacity:0.80;}50%{fill-opacity:0.25;}}
          .lk1{animation:lkAnim 2s ease-in-out infinite;}
          .lk2{animation:lkAnim 2s ease-in-out infinite 0.7s;}
        `}</style>
      </defs>

      {/* ── Formula bar ── */}
      <text x="140" y="18" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = πrs + πr²</text>
      <text x="140" y="33" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">= πr(r + s)</text>

      {/* ── SELIMUT — proper juring (sector) lingkaran ── */}
      <path
        d={`M ${cx},${cy} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${R},${R} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`}
        fill="#06b6d4" className="lk1" stroke="#22d3ee" strokeWidth="1.8"
      />
      {/* apex dot */}
      <circle cx={cx} cy={cy} r="3.5" fill="#facc15" opacity="0.9"/>
      {/* s label on left arm */}
      <text x={midSx} y={midSy} fill="#facc15" fontSize="10" fontFamily="monospace" fontWeight="bold">s</text>
      {/* SELIMUT labels — centroid at ≈y=100 */}
      <text x={cx} y="100" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{L.selimut}</text>
      <text x={cx} y="114" fill="#e0f2fe" fontSize="9" fontFamily="monospace" textAnchor="middle">πrs</text>

      {/* ── + sign between sector and alas ── */}
      <text x={cx} y="164" fill="#64748b" fontSize="16" fontFamily="monospace" textAnchor="middle" fontWeight="bold">+</text>

      {/* ── ALAS — circle below sector ── */}
      <circle cx={cx} cy="215" r="42" fill="#6366f1" className="lk2" stroke="#a5b4fc" strokeWidth="1.8"/>
      {/* r line */}
      <line x1={cx} y1="215" x2={cx + 42} y2="215" stroke="#facc15" strokeWidth="1.2" strokeDasharray="3,2"/>
      <text x={cx + 21} y="210" fill="#facc15" fontSize="9" fontFamily="monospace" textAnchor="middle">r</text>
      <text x={cx} y="218" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{L.alas}</text>
      <text x={cx} y="231" fill="#e0e7ff" fontSize="9" fontFamily="monospace" textAnchor="middle">πr²</text>
    </svg>
  );
};

// Note: VolumeKerucutSVG's only text is the symbolic "V = ⅓πr²t" formula and
// single-letter r/t labels, which are language-neutral math notation. The
// `language` prop is still accepted (and threaded through by callers) for API
// consistency with the other diagram components and to support future labels.
const VolumeKerucutSVG = ({ language: _language }: { language: Language }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-sm mx-auto my-2" aria-label="Volume kerucut">
    <defs>
      <style>{`
        @keyframes vkGlow{0%,100%{fill-opacity:0.85;filter:drop-shadow(0 0 12px #7c3aed);}50%{fill-opacity:0.5;filter:drop-shadow(0 0 3px #4c1d95);}}
        @keyframes vkPulse{0%,100%{opacity:1;}50%{opacity:0.55;}}
        .vk{animation:vkGlow 2.2s ease-in-out infinite;}
        .vkp{animation:vkPulse 2.2s ease-in-out infinite;}
      `}</style>
      <radialGradient id="volConeGrad" cx="35%" cy="25%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.7"/>
      </radialGradient>
    </defs>
    {/* Cone */}
    <polygon points="150,30 55,210 245,210" fill="url(#volConeGrad)" className="vk" stroke="#c4b5fd" strokeWidth="2"/>
    <ellipse cx="150" cy="210" rx="95" ry="21" fill="rgba(99,102,241,0.6)" stroke="#a5b4fc" strokeWidth="1.8" className="vk"/>
    {/* Height arrow */}
    <line x1="150" y1="30" x2="150" y2="210" stroke="#f97316" strokeWidth="2" strokeDasharray="7,4" opacity="0.8"/>
    <text x="158" y="128" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold" className="vkp">t</text>
    {/* r arrow */}
    <line x1="150" y1="210" x2="245" y2="210" stroke="#4ade80" strokeWidth="2" opacity="0.8"/>
    <text x="193" y="205" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold" className="vkp">r</text>
    {/* Formula */}
    <text x="150" y="250" fill="#e0e7ff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle" className="vkp">
      V = ⅓πr²t
    </text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   VOLUME KERUCUT — animated water-fill visualization
───────────────────────────────────────────────────────────── */
const WaterKerucutAnimation = () => {
  const [fill, setFill] = useState(0);
  const [wave, setWave] = useState(0);

  useEffect(() => {
    const FILL_MS    = 3200;
    const HOLD_FULL  = 900;
    const EMPTY_MS   = 2000;
    const HOLD_EMPTY = 500;
    const TOTAL = FILL_MS + HOLD_FULL + EMPTY_MS + HOLD_EMPTY;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = (now - start) % TOTAL;
      let f: number;
      if (t < FILL_MS)                              f = t / FILL_MS;
      else if (t < FILL_MS + HOLD_FULL)             f = 1;
      else if (t < FILL_MS + HOLD_FULL + EMPTY_MS)  f = 1 - (t - FILL_MS - HOLD_FULL) / EMPTY_MS;
      else                                           f = 0;
      setFill(f);
      setWave(Math.sin(now * 0.005) * 2.5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const CX = 112, RX = 68, RY = 16;
  const CY_APEX = 38, CY_BOT = 175;
  const CYL_H_PX = CY_BOT - CY_APEX;

  const waterY      = CY_BOT - fill * CYL_H_PX;
  const waterRx     = RX * (waterY - CY_APEX) / CYL_H_PX;
  const waterRy     = RY * (waterY - CY_APEX) / CYL_H_PX;
  const pct         = Math.round(fill * 100);
  const isEmpty     = fill < 0.005;
  const isFull      = fill > 0.995;
  const showSurface = !isEmpty && !isFull;
  const waveOffset  = showSurface ? wave : 0;

  const barX = 200, barY = CY_APEX, barW = 13, barH = CYL_H_PX;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 0 280 215" className="w-full max-w-sm mx-auto my-2"
      aria-label="Animasi kerucut diisi air">
      <defs>
        <filter id="wBloomC">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Ghost cone shell (dark background) ── */}
      <polygon
        points={`${CX},${CY_APEX} ${CX - RX},${CY_BOT} ${CX + RX},${CY_BOT}`}
        fill="#0f172a" fillOpacity={0.20}
        stroke="none"
      />

      {/* ── Bottom cap (floor) ── */}
      <ellipse
        cx={CX} cy={CY_BOT} rx={RX} ry={RY}
        fill={isEmpty ? "#0f172a" : "#1e3a8a"}
        stroke="none"
      />

      {/* ── Water body (trapezoid from base up to water surface) ── */}
      {!isEmpty && (
        <polygon
          points={`${CX - RX},${CY_BOT} ${CX + RX},${CY_BOT} ${CX + waterRx},${waterY} ${CX - waterRx},${waterY}`}
          fill="#1d4ed8" fillOpacity={0.85}
        />
      )}

      {/* ── Water surface ellipse with subtle wave ── */}
      {showSurface && (
        <>
          <ellipse
            cx={CX} cy={waterY + waveOffset} rx={waterRx} ry={waterRy}
            fill="#7dd3fc" fillOpacity={0.45}
          />
          <ellipse
            cx={CX} cy={waterY + waveOffset} rx={waterRx} ry={waterRy}
            fill="none" stroke="#bae6fd" strokeWidth="1.8"
            strokeDasharray="5,3" opacity={0.85}
          />
        </>
      )}

      {/* ── Cone outline rendered on top of water ── */}
      <line x1={CX} y1={CY_APEX} x2={CX - RX} y2={CY_BOT}
        stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={CX} y1={CY_APEX} x2={CX + RX} y2={CY_BOT}
        stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse
        cx={CX} cy={CY_BOT} rx={RX} ry={RY}
        fill="none" stroke="#a855f7" strokeWidth="2"
      />
      <circle cx={CX} cy={CY_APEX} r="3.5" fill="#c4b5fd" />

      {/* ── r dimension label ── */}
      <line x1={CX} y1={CY_BOT} x2={CX + RX} y2={CY_BOT}
        stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.85" />
      <circle cx={CX} cy={CY_BOT} r="2.5" fill="#4ade80" />
      <circle cx={CX + RX} cy={CY_BOT} r="2.5" fill="#4ade80" />
      <text x={CX + RX / 2} y={CY_BOT + 12}
        fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>

      {/* ── t dimension label ── */}
      <line x1={CX - RX - 13} y1={CY_APEX} x2={CX - RX - 13} y2={CY_BOT}
        stroke="#f97316" strokeWidth="1.5" />
      <line x1={CX - RX - 8} y1={CY_APEX} x2={CX - RX - 18} y2={CY_APEX}
        stroke="#f97316" strokeWidth="1.5" />
      <line x1={CX - RX - 8} y1={CY_BOT} x2={CX - RX - 18} y2={CY_BOT}
        stroke="#f97316" strokeWidth="1.5" />
      <text x={CX - RX - 28} y={(CY_APEX + CY_BOT) / 2 + 4}
        fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>

      {/* ── Progress bar ── */}
      <rect x={barX} y={barY} width={barW} height={barH}
        fill="#0f172a" stroke="#334155" strokeWidth="1.2" rx="3" />
      {!isEmpty && (
        <rect x={barX} y={barY + barH - filledH} width={barW} height={filledH}
          fill="#2563eb" fillOpacity={0.88} rx="3" />
      )}
      <text x={barX + barW / 2} y={barY - 5}
        fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">V%</text>
      <text x={barX + barW / 2} y={barY + barH + 12}
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {pct}%
      </text>

      {/* ── Status + Formula ── */}
      <text x={CX} y={198}
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloomC)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x={CX} y={212}
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloomC)">
        V = ⅓πr²t
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   CONE NET ANIMATION — slow-motion canvas peeling animation
   Geometry: r=55, h=120, s≈132, sector angle≈150°
   N=60 triangular strips peel in a wave from left→right
───────────────────────────────────────────────────────────── */
const coneNetAnimTrans: Record<Language, {
  cutLine: string; alasLabel: string; alasSub: string; apexLabel: string;
  selimutLabel: string; selimutSub: string; rJuring: string; busur: string; success: string;
  caption: string; btnStart: string; btnPlaying: string; btnReplay: string; btnReset: string;
  legendSelimut: string; legendAlas: string; legendApex: string; footer: string;
}> = {
  id: {
    cutLine: "← garis potong", alasLabel: "ALAS", alasSub: "lingkaran (r)", apexLabel: "T (puncak)",
    selimutLabel: "SELIMUT", selimutSub: "juring lingkaran", rJuring: "r_juring = s", busur: "busur = 2πr",
    success: "✓ Jaring-jaring = SELIMUT + ALAS",
    caption: "Animasi slow motion — kerucut dikupas lembaran demi lembaran menjadi jaring-jaringnya",
    btnStart: "▶ Mulai Animasi", btnPlaying: "⏳ Mengupas...", btnReplay: "▶ Putar Ulang", btnReset: "↺ Reset",
    legendSelimut: "Selimut (juring)", legendAlas: "Alas (lingkaran)", legendApex: "Puncak T",
    footer: "Jaring-jaring kerucut: 1 selimut (juring, r_juring = s) + 1 alas (lingkaran, r_lingkaran = r)",
  },
  en: {
    cutLine: "← cut line", alasLabel: "BASE", alasSub: "circle (r)", apexLabel: "T (apex)",
    selimutLabel: "LATERAL", selimutSub: "circular sector", rJuring: "r_sector = s", busur: "arc = 2πr",
    success: "✓ Net = LATERAL SURFACE + BASE",
    caption: "Slow-motion animation — the cone is peeled sheet by sheet into its net",
    btnStart: "▶ Start Animation", btnPlaying: "⏳ Peeling...", btnReplay: "▶ Replay", btnReset: "↺ Reset",
    legendSelimut: "Lateral surface (sector)", legendAlas: "Base (circle)", legendApex: "Apex T",
    footer: "Net of a cone: 1 lateral surface (sector, r_sector = s) + 1 base (circle, r_circle = r)",
  },
  ja: {
    cutLine: "← 切り込み線", alasLabel: "底面", alasSub: "円（r）", apexLabel: "T（頂点）",
    selimutLabel: "側面", selimutSub: "扇形", rJuring: "扇形の半径 = s", busur: "弧 = 2πr",
    success: "✓ 展開図 = 側面 + 底面",
    caption: "スローモーションアニメーション — 円錐が一枚ずつ剥がされて展開図になります",
    btnStart: "▶ アニメーション開始", btnPlaying: "⏳ 展開中...", btnReplay: "▶ もう一度再生", btnReset: "↺ リセット",
    legendSelimut: "側面（扇形）", legendAlas: "底面（円）", legendApex: "頂点T",
    footer: "円錐の展開図：側面1つ（扇形、扇形の半径 = s）＋底面1つ（円、円の半径 = r）",
  },
};
const ConeNetAnimation = ({ language }: { language: Language }) => {
  const L = coneNetAnimTrans[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [animState, setAnimState] = useState<'idle' | 'playing' | 'done'>('idle');

  const DURATION = 4500;

  const r = 55, hh = 120;
  const s = Math.sqrt(r * r + hh * hh);
  const THETA = (2 * Math.PI * r) / s;
  const N = 60;
  const CX = 200, APEX_Y = 42;
  const BASE_Y = APEX_Y + hh;
  const RY = 22;
  const SECTOR_START_ANGLE = Math.PI / 2 - THETA / 2;
  // Alas tangent to arc bottom (no gap — menyatu dengan selimut)
  const ALAS_CY = APEX_Y + s + r;

  const drawFrame = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
    const easeIO = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const clamp = (x: number) => Math.max(0, Math.min(1, x));

    // Label x anchor (right-side labels)
    const LX = 258;
    // Yellow label color helper
    const ylw = (a: number) => `rgba(250,204,21,${a})`;

    const grd = ctx.createRadialGradient(CX, APEX_Y, 4, CX, APEX_Y + hh / 2, 200);
    grd.addColorStop(0, 'rgba(6,182,212,0.07)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    type SD = { ax: number; ay: number; lx: number; ly: number; rx: number; ry: number; alpha: number; hue: number; lum: number; isFront: boolean; easeT: number; };
    const strips: SD[] = [];

    for (let i = 0; i < N; i++) {
      const a0 = (2 * Math.PI * i) / N;
      const a1 = (2 * Math.PI * (i + 1)) / N;
      const aMid = (a0 + a1) / 2;

      const lx3 = CX + r * Math.cos(a0);
      const ly3 = BASE_Y + RY * Math.sin(a0);
      const rx3 = CX + r * Math.cos(a1);
      const ry3 = BASE_Y + RY * Math.sin(a1);

      const f0 = SECTOR_START_ANGLE + (THETA * i) / N;
      const f1 = SECTOR_START_ANGLE + (THETA * (i + 1)) / N;
      const lxF = CX + s * Math.cos(f0);
      const lyF = APEX_Y + s * Math.sin(f0);
      const rxF = CX + s * Math.cos(f1);
      const ryF = APEX_Y + s * Math.sin(f1);

      const tStart = (i / N) * 0.5;
      const rawT = clamp((t - tStart) / 0.5);
      const easeT = easeIO(rawT);

      const lxI = lerp(lx3, lxF, easeT);
      const lyI = lerp(ly3, lyF, easeT);
      const rxI = lerp(rx3, rxF, easeT);
      const ryI = lerp(ry3, ryF, easeT);

      const brightness = 0.25 + 0.75 * ((1 + Math.cos(aMid - Math.PI / 6)) / 2);
      const isFront = Math.sin(aMid) <= 0;
      const hue = 188 + (i / N) * 22;
      const baseLum = 22 + brightness * 30;
      const flatLum = 36;

      let alpha: number;
      if (easeT > 0.05) alpha = 0.9;
      else if (isFront) alpha = 0.88;
      else alpha = 0.07;

      strips.push({ ax: CX, ay: APEX_Y, lx: lxI, ly: lyI, rx: rxI, ry: ryI, alpha, hue, lum: lerp(baseLum, flatLum, easeT), isFront, easeT });
    }

    const drawS = (sd: SD) => {
      ctx.beginPath();
      ctx.moveTo(sd.ax, sd.ay);
      ctx.lineTo(sd.lx, sd.ly);
      ctx.lineTo(sd.rx, sd.ry);
      ctx.closePath();
      ctx.fillStyle = `hsla(${sd.hue},78%,${sd.lum}%,${sd.alpha})`;
      ctx.strokeStyle = `hsla(${sd.hue},78%,${Math.min(70, sd.lum + 20)}%,${sd.alpha * 0.35})`;
      ctx.lineWidth = 0.5;
      ctx.fill();
      ctx.stroke();
    };

    strips.filter(sd => !sd.isFront && sd.easeT < 0.05).forEach(drawS);
    strips.filter(sd => sd.isFront || sd.easeT >= 0.05).forEach(drawS);

    // Cut line flash at start
    if (t < 0.18) {
      const ca = 1 - t / 0.18;
      ctx.strokeStyle = ylw(ca * 0.92);
      ctx.lineWidth = 2.2;
      ctx.setLineDash([5, 3]);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#facc15';
      ctx.beginPath();
      ctx.moveTo(CX, APEX_Y);
      ctx.lineTo(CX + r, BASE_Y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
      ctx.fillStyle = ylw(ca * 0.85);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(L.cutLine, CX + r + 4, BASE_Y - 10);
    }

    // Assembled base ellipse (fades out as peeling starts)
    if (t < 0.65) {
      const ea = t < 0.3 ? 1 : 1 - clamp((t - 0.3) / 0.35);
      ctx.beginPath();
      ctx.ellipse(CX, BASE_Y, r, RY, 0, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(99,102,241,${0.32 * ea})`;
      ctx.strokeStyle = `rgba(165,180,252,${ea * 0.82})`;
      ctx.lineWidth = 1.8;
      ctx.fill();
      ctx.stroke();
    }

    // Alas — transitions from ellipse at BASE_Y to circle at ALAS_CY (tangent, menyatu)
    if (t > 0.58) {
      const alasRaw = clamp((t - 0.58) / 0.42);
      const alasT = easeIO(alasRaw);
      const alasY = lerp(BASE_Y, ALAS_CY, alasT);
      const alasRY2 = lerp(RY, r, alasT);

      ctx.beginPath();
      ctx.ellipse(CX, alasY, r, alasRY2, 0, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(99,102,241,0.30)';
      ctx.strokeStyle = `rgba(165,180,252,${0.45 + alasT * 0.55})`;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Alas label — right side, yellow
      if (alasT > 0.5) {
        const la = clamp((alasT - 0.5) / 0.5);
        // "ALAS" to the right of the circle
        ctx.fillStyle = ylw(la);
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(L.alasLabel, CX + r + 12, alasY - 5);
        ctx.fillStyle = ylw(la * 0.8);
        ctx.font = '8px monospace';
        ctx.fillText(L.alasSub, CX + r + 12, alasY + 8);
        // r radius line
        if (la > 0.3) {
          const la2 = clamp((la - 0.3) / 0.7);
          ctx.strokeStyle = ylw(la2 * 0.9);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(CX, alasY);
          ctx.lineTo(CX + r, alasY);
          ctx.stroke();
          ctx.fillStyle = ylw(la2);
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('r', CX + r / 2, alasY - 4);
        }
      }
    }

    // Apex dot
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#facc15';
    ctx.beginPath();
    ctx.arc(CX, APEX_Y, 5.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Labels — all right-side, all yellow
    if (t > 0.80) {
      const la = clamp((t - 0.80) / 0.20);

      // Apex label (right of dot)
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(L.apexLabel, CX + 9, APEX_Y + 4);

      // "s" slant-edge label (on left edge of sector, already upper-right)
      const midS = s * 0.47;
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('s', CX + midS * Math.cos(SECTOR_START_ANGLE) - 10, APEX_Y + midS * Math.sin(SECTOR_START_ANGLE));

      // Right-side block: SELIMUT info
      ctx.textAlign = 'left';
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 12px monospace';
      ctx.fillText(L.selimutLabel, LX, APEX_Y + s / 2 - 8);
      ctx.fillStyle = ylw(la * 0.85);
      ctx.font = '8px monospace';
      ctx.fillText(L.selimutSub, LX, APEX_Y + s / 2 + 6);
      ctx.fillText(L.rJuring, LX, APEX_Y + s / 2 + 18);
      ctx.fillText(L.busur, LX, APEX_Y + s / 2 + 30);
      // Final success text — above the alas, not colliding
      ctx.textAlign = 'center';
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 10px monospace';
      ctx.fillText(L.success, CX, APEX_Y + s - 14);
    }

    // Progress bar
    if (t > 0 && t < 1) {
      const barY = canvas.height - 5;
      ctx.fillStyle = 'rgba(71,85,105,0.45)';
      ctx.fillRect(10, barY, canvas.width - 20, 3);
      ctx.fillStyle = 'rgba(34,211,238,0.88)';
      ctx.fillRect(10, barY, (canvas.width - 20) * t, 3);
    }
  }, [CX, APEX_Y, BASE_Y, RY, ALAS_CY, N, r, hh, s, THETA, SECTOR_START_ANGLE, L]);

  useEffect(() => {
    drawFrame(0);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [drawFrame]);

  const startAnimation = useCallback(() => {
    if (animState === 'playing') return;
    cancelAnimationFrame(animFrameRef.current);
    setAnimState('playing');
    startTimeRef.current = performance.now();
    const loop = (now: number) => {
      const t = Math.min(1, (now - startTimeRef.current) / DURATION);
      drawFrame(t);
      if (t < 1) animFrameRef.current = requestAnimationFrame(loop);
      else setAnimState('done');
    };
    animFrameRef.current = requestAnimationFrame(loop);
  }, [animState, drawFrame, DURATION]);

  const resetAnimation = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    setAnimState('idle');
    drawFrame(0);
  }, [drawFrame]);

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        {L.caption}
      </p>

      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          style={{ width: '100%', display: 'block', borderRadius: 10 }}
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={startAnimation}
          disabled={animState === 'playing'}
          className="px-4 py-2 text-sm font-bold bg-cyan-700/60 border border-cyan-500 text-cyan-200 rounded-lg hover:bg-cyan-600/60 transition-colors cursor-pointer font-body disabled:opacity-40"
        >
          {animState === 'idle' ? L.btnStart : animState === 'playing' ? L.btnPlaying : L.btnReplay}
        </button>
        <button
          onClick={resetAnimation}
          disabled={animState === 'idle'}
          className="px-4 py-2 text-sm font-bold bg-slate-700/60 border border-slate-500 text-slate-200 rounded-lg hover:bg-slate-600/60 transition-colors cursor-pointer font-body disabled:opacity-40"
        >
          {L.btnReset}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 justify-center text-[10px] font-body">
        {[
          { color: '#22d3ee', label: L.legendSelimut },
          { color: '#a5b4fc', label: L.legendAlas },
          { color: '#facc15', label: L.legendApex },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
            <span className="text-white/50">{label}</span>
          </span>
        ))}
      </div>

      <p className="text-white/25 text-[9px] text-center font-body">
        {L.footer}
      </p>
    </div>
  );
};

/* Unsur kerucut — sisi / rusuk / titik sudut menyala bergantian */
const kerucutCountSvgLabels: Record<Language, string[]> = {
  id: ["SISI ① — Selimut (lengkung)", "SISI ② — Alas (datar)", "RUSUK ① — Keliling alas", "TITIK SUDUT ① — Puncak", "2 Sisi · 1 Rusuk · 1 Titik Sudut"],
  en: ["FACE ① — Lateral surface (curved)", "FACE ② — Base (flat)", "EDGE ① — Base circumference", "VERTEX ① — Apex", "2 Faces · 1 Edge · 1 Vertex"],
  ja: ["面① — 側面（曲面）", "面② — 底面（平面）", "辺① — 底面の円周", "頂点① — 頂点", "2つの面・1つの辺・1つの頂点"],
};
const KerucutUnsurCountSVG = ({ language }: { language: Language }) => {
  const L = kerucutCountSvgLabels[language];
  return (
  <svg viewBox="0 0 280 215" className="w-full max-w-xs mx-auto my-2" aria-label="Sisi rusuk titik sudut kerucut">
    <defs>
      <style>{`
        @keyframes ks1g{0%,5%{opacity:1;filter:drop-shadow(0 0 8px #a855f7);}24%,100%{opacity:0.12;filter:none;}}
        @keyframes ks2g{0%,26%{opacity:0.12;filter:none;}31%,49%{opacity:1;filter:drop-shadow(0 0 8px #818cf8);}54%,100%{opacity:0.12;filter:none;}}
        @keyframes kr1g{0%,55%{opacity:0.12;filter:none;}60%,76%{opacity:1;filter:drop-shadow(0 0 10px #f59e0b);}81%,100%{opacity:0.12;filter:none;}}
        @keyframes kt1g{0%,81%{opacity:0.12;filter:none;}86%,97%{opacity:1;filter:drop-shadow(0 0 10px #facc15);}100%{opacity:0.12;filter:none;}}
        @keyframes kla{0%,5%{opacity:1;}24%,100%{opacity:0;}}
        @keyframes klb{0%,26%{opacity:0;}31%,49%{opacity:1;}54%,100%{opacity:0;}}
        @keyframes klc{0%,55%{opacity:0;}60%,76%{opacity:1;}81%,100%{opacity:0;}}
        @keyframes kld{0%,81%{opacity:0;}86%,97%{opacity:1;}100%{opacity:0;}}
        .ks1a{animation:ks1g 5.5s ease-in-out infinite;}
        .ks2a{animation:ks2g 5.5s ease-in-out infinite;}
        .kr1a{animation:kr1g 5.5s ease-in-out infinite;}
        .kt1a{animation:kt1g 5.5s ease-in-out infinite;}
        .kla{animation:kla  5.5s ease-in-out infinite;}
        .klb{animation:klb  5.5s ease-in-out infinite;}
        .klc{animation:klc  5.5s ease-in-out infinite;}
        .kld{animation:kld  5.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* SISI ① Selimut — ungu */}
    <path d="M 140 28 L 75 158 A 65 16 0 0 1 205 158 Z" fill="rgba(168,85,247,0.40)" stroke="#a855f7" strokeWidth="2.5" className="ks1a"/>
    {/* SISI ② Alas — indigo */}
    <ellipse cx="140" cy="158" rx="65" ry="16" fill="rgba(99,102,241,0.42)" stroke="#818cf8" strokeWidth="2.5" className="ks2a"/>
    {/* RUSUK ① keliling alas — amber */}
    <ellipse cx="140" cy="158" rx="65" ry="16" fill="none" stroke="#f59e0b" strokeWidth="4" className="kr1a"/>
    {/* TITIK SUDUT ① puncak — kuning */}
    <circle cx="140" cy="28" r="8" fill="#facc15" className="kt1a"/>
    {/* Outline statis */}
    <path d="M 140 28 L 75 158" stroke="#334155" strokeWidth="1.2" fill="none"/>
    <path d="M 140 28 L 205 158" stroke="#334155" strokeWidth="1.2" fill="none"/>
    <ellipse cx="140" cy="158" rx="65" ry="16" fill="none" stroke="#1e293b" strokeWidth="0.8"/>
    <circle cx="140" cy="28" r="3" fill="#475569"/>
    {/* Label bergantian — satu posisi, muncul bergantian */}
    <text x="140" y="193" fill="#e9d5ff" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="kla">{L[0]}</text>
    <text x="140" y="193" fill="#a5b4fc" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="klb">{L[1]}</text>
    <text x="140" y="193" fill="#fcd34d" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="klc">{L[2]}</text>
    <text x="140" y="193" fill="#fef08a" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="kld">{L[3]}</text>
    {/* Ringkasan statis */}
    <text x="140" y="209" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">{L[4]}</text>
  </svg>
  );
};

/* Selimut kerucut dibuka → juring lingkaran */
const selimutJuringSvgLabels: Record<Language, { kerucut: string; dibuka: string; busur: string; theta: string; selimut: string; juring: string }> = {
  id: { kerucut: "kerucut", dibuka: "dibuka", busur: "busur = keliling alas", theta: "θ = (r ÷ s) × 360°", selimut: "SELIMUT", juring: "= juring lingkaran" },
  en: { kerucut: "cone", dibuka: "unfold", busur: "arc = base circumference", theta: "θ = (r ÷ s) × 360°", selimut: "LATERAL", juring: "= circular sector" },
  ja: { kerucut: "円錐", dibuka: "展開", busur: "弧 = 底面の円周", theta: "θ = (r ÷ s) × 360°", selimut: "側面", juring: "= 扇形" },
};
const SelimutJuringAnimSVG = ({ language }: { language: Language }) => {
  const L = selimutJuringSvgLabels[language];
  return (
  <svg viewBox="0 0 315 195" className="w-full max-w-sm mx-auto my-2" aria-label="Selimut kerucut dibuka menjadi juring">
    <defs>
      <style>{`
        @keyframes kjco{0%,35%{opacity:1;}55%,100%{opacity:0.28;}}
        @keyframes kjin{0%,35%{opacity:0.12;}58%,100%{opacity:1;}}
        @keyframes kjap{0%,100%{opacity:0.35;}47%,53%{opacity:1;}}
        .kjco{animation:kjco 4.5s ease-in-out infinite;}
        .kjin{animation:kjin 4.5s ease-in-out infinite;}
        .kjap{animation:kjap 4.5s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* LEFT: mini kerucut — selimut disorot ungu */}
    <g className="kjco">
      <path d="M 58 18 L 18 128 A 40 11 0 0 1 98 128 Z" fill="rgba(168,85,247,0.40)" stroke="#a855f7" strokeWidth="1.8"/>
      <ellipse cx="58" cy="128" rx="40" ry="11" fill="rgba(99,102,241,0.22)" stroke="#818cf8" strokeWidth="1.2"/>
      <circle cx="58" cy="18" r="3" fill="#facc15"/>
      {/* Garis pelukis s */}
      <line x1="58" y1="18" x2="18" y2="128" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2"/>
      <text x="25" y="75" fill="#fcd34d" fontSize="8" fontFamily="monospace" fontWeight="700">s</text>
      <text x="58" y="150" fill="#a78bfa" fontSize="7.5" fontFamily="monospace" textAnchor="middle">{L.kerucut}</text>
    </g>

    {/* Panah tengah */}
    <g className="kjap">
      <line x1="108" y1="73" x2="133" y2="73" stroke="#475569" strokeWidth="1.8"/>
      <polygon points="131,69 139,73 131,77" fill="#475569"/>
      <text x="124" y="86" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">{L.dibuka}</text>
    </g>

    {/* RIGHT: juring lingkaran */}
    {/* Center (228,158), radius 72, arc dari -150° ke -30° (120° = sudut representatif) */}
    {/* top of arc: (228, 158-72) = (228, 86) */}
    {/* left arm:  (228-62.35, 158-36) = (165.65, 122) */}
    {/* right arm: (228+62.35, 158-36) = (290.35, 122) */}
    <g className="kjin">
      <path d="M 228 158 L 165.6 122 A 72 72 0 0 1 290.4 122 Z" fill="rgba(168,85,247,0.28)" stroke="#a855f7" strokeWidth="2"/>
      {/* Label radius: s */}
      <text x="191" y="146" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700">s</text>
      <text x="265" y="146" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700">s</text>
      {/* Arc label: busur = keliling alas — placed above the arc (arc top y=86) */}
      <text x="228" y="46" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="700">{L.busur}</text>
      {/* Arrow from label down toward arc */}
      <line x1="228" y1="49" x2="228" y2="82" stroke="#fde68a" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arrowY)"/>
      <defs>
        <marker id="arrowY" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
          <polygon points="0 0, 5 2.5, 0 5" fill="#fde68a"/>
        </marker>
      </defs>
      {/* 2πr label above arrow */}
      <text x="228" y="60" fill="#f59e0b" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="700">2πr</text>
      {/* Sudut θ — arc indicator near vertex, lower than arms */}
      <path d="M 252 148 Q 228 130 204 148" fill="none" stroke="#22c55e" strokeWidth="1.4"/>
      <text x="228" y="144" fill="#86efac" fontSize="7.5" fontFamily="monospace" textAnchor="middle">θ</text>
      <text x="228" y="178" fill="#86efac" fontSize="7.5" fontFamily="monospace" textAnchor="middle">{L.theta}</text>
      {/* Label juring */}
      <text x="228" y="110" fill="#e9d5ff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="700">{L.selimut}</text>
      <text x="228" y="120" fill="#c4b5fd" fontSize="7" fontFamily="monospace" textAnchor="middle">{L.juring}</text>
    </g>
  </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

/* ─────────────────────────────────────────────────────────────
   SLIDE 7 — SOAL UNSUR-UNSUR KERUCUT (INTERAKTIF)
───────────────────────────────────────────────────────────── */
/* ── SVG ilustrasi soal 2 — kerucut dengan label ①②③④ ── */
const SoalRusukSVG = () => (
  <svg viewBox="0 0 270 210" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-xs mx-auto my-1" aria-label="Kerucut bernomor">
    <defs>
      <radialGradient id="coneBodyGrad" cx="45%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45"/>
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.18"/>
      </radialGradient>
    </defs>
    {/* cone fill */}
    <polygon points="118,22 42,170 194,170" fill="url(#coneBodyGrad)"/>
    {/* base ellipse fill */}
    <ellipse cx="118" cy="170" rx="76" ry="17" fill="rgba(99,102,241,0.28)"/>
    {/* slant lines */}
    <line x1="118" y1="22" x2="42" y2="170" stroke="#22d3ee" strokeWidth="1.8"/>
    <line x1="118" y1="22" x2="194" y2="170" stroke="#22d3ee" strokeWidth="1.8"/>
    {/* base ellipse front */}
    <path d="M42,170 A76,17 0 0,0 194,170" stroke="#a5b4fc" strokeWidth="1.6" fill="none"/>
    {/* base ellipse back (dashed) */}
    <path d="M42,170 A76,17 0 0,1 194,170" stroke="#a5b4fc" strokeWidth="1.2" strokeDasharray="5,3" fill="none" opacity="0.45"/>
    {/* height dashed */}
    <line x1="118" y1="22" x2="118" y2="170" stroke="#f97316" strokeWidth="1.2" strokeDasharray="5,3" opacity="0.5"/>
    {/* apex dot */}
    <circle cx="118" cy="22" r="3.5" fill="#facc15" opacity="0.9"/>

    {/* Arrow ① → puncak */}
    <line x1="128" y1="24" x2="185" y2="14" stroke="#facc15" strokeWidth="1.2"/>
    <circle cx="197" cy="12" r="9" stroke="#facc15" strokeWidth="1.2" fill="rgba(250,204,21,0.15)"/>
    <text x="197" y="16.5" textAnchor="middle" fill="#facc15" fontSize="10" fontFamily="serif">①</text>

    {/* Arrow ② → garis pelukis (middle of right slant) */}
    <line x1="163" y1="98" x2="210" y2="78" stroke="#22d3ee" strokeWidth="1.2"/>
    <circle cx="221" cy="73" r="9" stroke="#22d3ee" strokeWidth="1.2" fill="rgba(34,211,238,0.15)"/>
    <text x="221" y="77.5" textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="serif">②</text>

    {/* Arrow ③ → rusuk (rim at base edge, right side) */}
    <line x1="188" y1="167" x2="218" y2="152" stroke="#4ade80" strokeWidth="1.2"/>
    <circle cx="229" cy="146" r="9" stroke="#4ade80" strokeWidth="1.2" fill="rgba(74,222,128,0.15)"/>
    <text x="229" y="150.5" textAnchor="middle" fill="#4ade80" fontSize="10" fontFamily="serif">③</text>

    {/* Arrow ④ → alas (below base ellipse center) */}
    <line x1="118" y1="183" x2="160" y2="192" stroke="#f87171" strokeWidth="1.2"/>
    <circle cx="171" cy="195" r="9" stroke="#f87171" strokeWidth="1.2" fill="rgba(248,113,113,0.15)"/>
    <text x="171" y="199.5" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="serif">④</text>
  </svg>
);

/* ── SVG ilustrasi soal 3 — kerucut dengan label t, s, r ── */
const SoalHubunganSVG = () => (
  <svg viewBox="0 0 260 215" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-xs mx-auto my-1" aria-label="Kerucut dengan t s r">
    <defs>
      <radialGradient id="coneHubGrad" cx="45%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.40"/>
        <stop offset="100%" stopColor="#0e7490" stopOpacity="0.15"/>
      </radialGradient>
    </defs>
    {/* cone fill */}
    <polygon points="115,24 42,175 188,175" fill="url(#coneHubGrad)"/>
    {/* base ellipse fill */}
    <ellipse cx="115" cy="175" rx="73" ry="16" fill="rgba(99,102,241,0.25)"/>
    {/* Cone slant lines */}
    <line x1="115" y1="24" x2="42" y2="175" stroke="#22d3ee" strokeWidth="1.8"/>
    <line x1="115" y1="24" x2="188" y2="175" stroke="#f87171" strokeWidth="2.2"/>
    {/* Base ellipse front */}
    <path d="M42,175 A73,16 0 0,0 188,175" stroke="#a5b4fc" strokeWidth="1.5" fill="none"/>
    {/* Base ellipse back (dashed) */}
    <path d="M42,175 A73,16 0 0,1 188,175" stroke="#a5b4fc" strokeWidth="1.1" strokeDasharray="5,3" fill="none" opacity="0.4"/>
    {/* apex dot */}
    <circle cx="115" cy="24" r="3.5" fill="#facc15" opacity="0.9"/>

    {/* Height t — dashed vertical */}
    <line x1="115" y1="24" x2="115" y2="175" stroke="#f97316" strokeWidth="1.8" strokeDasharray="6,4"/>
    {/* t label */}
    <text x="121" y="105" fill="#f97316" fontSize="14" fontFamily="serif" fontStyle="italic" fontWeight="bold">t</text>

    {/* Radius r — horizontal at base */}
    <line x1="115" y1="175" x2="188" y2="175" stroke="#4ade80" strokeWidth="2"/>
    {/* r label */}
    <text x="147" y="170" fill="#4ade80" fontSize="14" fontFamily="serif" fontStyle="italic" fontWeight="bold">r</text>

    {/* Slant s — from apex to base edge right (highlighted) */}
    <line x1="115" y1="24" x2="188" y2="175" stroke="#f87171" strokeWidth="2.2"/>
    {/* s label */}
    <text x="160" y="97" fill="#f87171" fontSize="14" fontFamily="serif" fontStyle="italic" fontWeight="bold">s</text>

    {/* Right angle mark at base center */}
    <polyline points="115,160 130,160 130,175" stroke="#94a3b8" strokeWidth="1.3" fill="none"/>
  </svg>
);

type SoalUnsurItem = {
  no: number;
  soal: string;
  pilihan: { key: string; text: string }[];
  pembahasan: string;
};

const soalUnsurTrans: Record<Language, SoalUnsurItem[]> = {
  id: [
    {
      no: 1,
      soal: "Nomor yang menunjukkan rusuk pada kerucut berikut adalah ….",
      pilihan: [
        { key: "A", text: "1" },
        { key: "B", text: "2" },
        { key: "C", text: "3" },
        { key: "D", text: "4" },
      ],
      pembahasan: "Rusuk kerucut adalah tepi/keliling alas (lingkaran alas), yaitu nomor 3. Nomor 1 = puncak, nomor 2 = garis pelukis/selimut, nomor 4 = alas.",
    },
    {
      no: 2,
      soal: "Bentuk bangun dari selimut kerucut adalah ….",
      pilihan: [
        { key: "A", text: "tembereng" },
        { key: "B", text: "segitiga" },
        { key: "C", text: "lingkaran" },
        { key: "D", text: "juring lingkaran" },
      ],
      pembahasan: "Selimut kerucut, jika dibuka (diratakan), berbentuk juring lingkaran (sektor lingkaran) dengan jari-jari = garis pelukis (s) dan panjang busur = keliling alas (2πr).",
    },
    {
      no: 3,
      soal: "Diketahui sebuah kerucut dengan ukuran tinggi t, jari-jari r, dan garis pelukis s.\nHubungan r, s, dan t pada kerucut tersebut adalah ….",
      pilihan: [
        { key: "A", text: "r² = s² + t²" },
        { key: "B", text: "t² – s² = r²" },
        { key: "C", text: "r² = t² – s²" },
        { key: "D", text: "s² = r² + t²" },
      ],
      pembahasan: "Berdasarkan Teorema Pythagoras pada segitiga siku-siku yang dibentuk oleh t, r, dan s: s² = r² + t² (s adalah hipotenusa/garis pelukis).",
    },
  ],
  en: [
    {
      no: 1,
      soal: "The number that indicates the edge of the following cone is ….",
      pilihan: [
        { key: "A", text: "1" },
        { key: "B", text: "2" },
        { key: "C", text: "3" },
        { key: "D", text: "4" },
      ],
      pembahasan: "The edge of a cone is the rim/circumference of the base (the base circle), which is number 3. Number 1 = apex, number 2 = slant height/lateral surface, number 4 = base.",
    },
    {
      no: 2,
      soal: "The shape formed by unfolding the lateral surface of a cone is ….",
      pilihan: [
        { key: "A", text: "circular segment" },
        { key: "B", text: "triangle" },
        { key: "C", text: "circle" },
        { key: "D", text: "circular sector" },
      ],
      pembahasan: "When unfolded (flattened), the lateral surface of a cone forms a circular sector with radius = slant height (s) and arc length = base circumference (2πr).",
    },
    {
      no: 3,
      soal: "A cone has height t, radius r, and slant height s.\nThe relationship between r, s, and t for this cone is ….",
      pilihan: [
        { key: "A", text: "r² = s² + t²" },
        { key: "B", text: "t² – s² = r²" },
        { key: "C", text: "r² = t² – s²" },
        { key: "D", text: "s² = r² + t²" },
      ],
      pembahasan: "Based on the Pythagorean theorem applied to the right triangle formed by t, r, and s: s² = r² + t² (s is the hypotenuse/slant height).",
    },
  ],
  ja: [
    {
      no: 1,
      soal: "次の円錐で、辺（りんかく）を示す番号は……。",
      pilihan: [
        { key: "A", text: "1" },
        { key: "B", text: "2" },
        { key: "C", text: "3" },
        { key: "D", text: "4" },
      ],
      pembahasan: "円錐の辺は底面（円）の縁・周であり、番号3です。番号1＝頂点、番号2＝母線／側面、番号4＝底面です。",
    },
    {
      no: 2,
      soal: "円錐の側面を広げた形は……。",
      pilihan: [
        { key: "A", text: "弓形" },
        { key: "B", text: "三角形" },
        { key: "C", text: "円" },
        { key: "D", text: "扇形" },
      ],
      pembahasan: "円錐の側面を開く（平らにする）と、半径＝母線（s）、弧の長さ＝底面の周（2πr）の扇形になります。",
    },
    {
      no: 3,
      soal: "高さ t、半径 r、母線 s を持つ円錐があります。\nこの円錐における r、s、t の関係は……。",
      pilihan: [
        { key: "A", text: "r² = s² + t²" },
        { key: "B", text: "t² – s² = r²" },
        { key: "C", text: "r² = t² – s²" },
        { key: "D", text: "s² = r² + t²" },
      ],
      pembahasan: "t、r、s によって作られる直角三角形にピタゴラスの定理を適用すると：s² = r² + t²（s は斜辺／母線）。",
    },
  ],
};

const soalUnsurMeta: { no: number; gambar: React.ReactNode; jawaban: string }[] = [
  { no: 1, gambar: <SoalRusukSVG />, jawaban: "C" },
  { no: 2, gambar: null, jawaban: "D" },
  { no: 3, gambar: <SoalHubunganSVG />, jawaban: "D" },
];

const unsurQuizUiTrans: Record<Language, {
  slideTitle: string; headerTitle: string; headerSub: string;
  showPembahasan: string; hidePembahasan: string;
  benarLabel: string; salahPrefix: string; pembahasanLabel: string;
  periksaBtn: string; ulangiBtn: string; skorLabel: string;
  perfectMsg: string; goodMsg: string; tryAgainMsg: string;
}> = {
  id: {
    slideTitle: "Soal — Unsur-unsur Kerucut",
    headerTitle: "Uji Pemahaman — Unsur-unsur Kerucut",
    headerSub: "Pilih jawaban yang paling tepat, lalu klik Periksa Jawaban",
    showPembahasan: "Lihat Pembahasan",
    hidePembahasan: "Sembunyikan Pembahasan",
    benarLabel: "✅ Benar!",
    salahPrefix: "❌ Jawaban yang benar:",
    pembahasanLabel: "📖 Pembahasan:",
    periksaBtn: "Periksa Jawaban ✓",
    ulangiBtn: "🔄 Ulangi Soal",
    skorLabel: "Skor kamu",
    perfectMsg: "🎉 Sempurna!",
    goodMsg: "👍 Bagus, terus semangat!",
    tryAgainMsg: "📚 Pelajari lagi unsur-unsur kerucut ya!",
  },
  en: {
    slideTitle: "Practice — Elements of a Cone",
    headerTitle: "Comprehension Check — Elements of a Cone",
    headerSub: "Choose the best answer, then click Check Answers",
    showPembahasan: "View Explanation",
    hidePembahasan: "Hide Explanation",
    benarLabel: "✅ Correct!",
    salahPrefix: "❌ Correct answer:",
    pembahasanLabel: "📖 Explanation:",
    periksaBtn: "Check Answers ✓",
    ulangiBtn: "🔄 Try Again",
    skorLabel: "Your score",
    perfectMsg: "🎉 Perfect!",
    goodMsg: "👍 Good job, keep it up!",
    tryAgainMsg: "📚 Review the elements of a cone again!",
  },
  ja: {
    slideTitle: "問題 — 円錐の要素",
    headerTitle: "理解度チェック — 円錐の要素",
    headerSub: "最も適切な答えを選び、「解答を確認」をクリックしてください",
    showPembahasan: "解説を見る",
    hidePembahasan: "解説を隠す",
    benarLabel: "✅ 正解！",
    salahPrefix: "❌ 正解は：",
    pembahasanLabel: "📖 解説：",
    periksaBtn: "解答を確認 ✓",
    ulangiBtn: "🔄 もう一度",
    skorLabel: "あなたのスコア",
    perfectMsg: "🎉 満点！",
    goodMsg: "👍 よくできました、その調子！",
    tryAgainMsg: "📚 円錐の要素をもう一度復習しましょう！",
  },
};

const UnsurSoalQuiz = ({ language }: { language: Language }) => {
  const ui = unsurQuizUiTrans[language];
  const soalUnsur = soalUnsurMeta.map((m, i) => ({ ...m, ...soalUnsurTrans[language][i] }));
  const [pilihan, setPilihan] = useState<Record<number, string>>({});
  const [selesai, setSelesai] = useState(false);
  const [showPembahasan, setShowPembahasan] = useState<Record<number, boolean>>({});

  const skor = selesai
    ? soalUnsur.filter(s => pilihan[s.no] === s.jawaban).length
    : 0;

  const handlePilih = (no: number, key: string) => {
    if (selesai) return;
    playPopSound();
    setPilihan(prev => ({ ...prev, [no]: key }));
  };

  const handleSelesai = () => {
    playPopSound();
    setSelesai(true);
    const allOpen: Record<number, boolean> = {};
    soalUnsur.forEach(s => { allOpen[s.no] = true; });
    setShowPembahasan(allOpen);
  };

  const handleUlang = () => {
    playPopSound();
    setPilihan({});
    setSelesai(false);
    setShowPembahasan({});
  };

  const togglePembahasan = (no: number) => {
    playPopSound();
    setShowPembahasan(prev => ({ ...prev, [no]: !prev[no] }));
  };

  const semuaDijawab = soalUnsur.every(s => pilihan[s.no]);

  return (
    <div className="space-y-6 font-body">
      {soalUnsur.map((s) => {
        const dipilih = pilihan[s.no];
        const benar = selesai && dipilih === s.jawaban;
        const pembahasanOpen = !!showPembahasan[s.no];

        return (
          <div
            key={s.no}
            className={`rounded-xl border p-4 space-y-3 transition-colors ${
              selesai
                ? benar
                  ? "bg-green-950/40 border-green-600/50"
                  : "bg-red-950/40 border-red-600/50"
                : "bg-slate-800/60 border-slate-600/40"
            }`}
          >
            {/* Nomor & soal */}
            <p className="text-white/90 text-sm font-semibold leading-snug">
              {s.no}. {s.soal.split("\n").map((line, i) => (
                <span key={i}>{line}{i < s.soal.split("\n").length - 1 && <br />}</span>
              ))}
            </p>

            {/* Gambar SVG (jika ada) */}
            {s.gambar && (
              <div className="flex justify-center">
                {s.gambar}
              </div>
            )}

            {/* Pilihan ganda — layout 2 kolom */}
            <div className="grid grid-cols-2 gap-2">
              {s.pilihan.map((p) => {
                const isSelected = dipilih === p.key;
                const isJawaban = p.key === s.jawaban;

                let cls =
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs cursor-pointer transition-all select-none ";

                if (!selesai) {
                  cls += isSelected
                    ? "bg-cyan-700/50 border-cyan-400 text-cyan-100"
                    : "bg-slate-700/40 border-slate-600 text-white/75 hover:bg-slate-600/50 hover:border-slate-400";
                } else {
                  if (isJawaban) {
                    cls += "bg-green-800/60 border-green-500 text-green-200 font-bold";
                  } else if (isSelected && !isJawaban) {
                    cls += "bg-red-800/60 border-red-500 text-red-200 line-through opacity-70";
                  } else {
                    cls += "bg-slate-700/30 border-slate-600/40 text-white/40";
                  }
                }

                return (
                  <button key={p.key} className={cls} onClick={() => handlePilih(s.no, p.key)}>
                    <span className={`w-5 h-5 flex-shrink-0 rounded-full border text-[10px] font-bold flex items-center justify-center
                      ${selesai && isJawaban ? "border-green-400 text-green-300" :
                        selesai && isSelected && !isJawaban ? "border-red-400 text-red-300" :
                        isSelected ? "border-cyan-400 text-cyan-300" : "border-slate-500 text-slate-400"}`}>
                      {p.key}
                    </span>
                    {p.text}
                  </button>
                );
              })}
            </div>

            {/* Toggle pembahasan — selalu tersedia */}
            <div className="pt-1">
              <button
                onClick={() => togglePembahasan(s.no)}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400/80 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>{pembahasanOpen ? "▲" : "▼"}</span>
                <span>{pembahasanOpen ? ui.hidePembahasan : ui.showPembahasan}</span>
              </button>

              {pembahasanOpen && (
                <div className={`mt-2 rounded-lg p-3 text-xs space-y-1.5 border ${
                  selesai
                    ? benar
                      ? "bg-green-900/40 border-green-700/40"
                      : "bg-amber-900/30 border-amber-600/30"
                    : "bg-slate-700/40 border-slate-600/30"
                }`}>
                  {selesai && (
                    <p className={`font-bold ${benar ? "text-green-300" : "text-red-300"}`}>
                      {benar ? ui.benarLabel : `${ui.salahPrefix} ${s.jawaban}`}
                    </p>
                  )}
                  <p className="font-semibold text-amber-300">{ui.pembahasanLabel}</p>
                  <p className="text-white/75 leading-relaxed">{s.pembahasan}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Tombol aksi */}
      <div className="flex justify-center gap-3 pt-2">
        {!selesai ? (
          <button
            onClick={handleSelesai}
            disabled={!semuaDijawab}
            className="px-6 py-2.5 text-sm font-bold bg-primary/20 border border-primary/50 text-primary rounded-xl hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {ui.periksaBtn}
          </button>
        ) : (
          <div className="w-full space-y-3">
            <div className="text-center bg-slate-800/70 border border-slate-600/40 rounded-xl p-4">
              <p className="text-white/50 text-xs mb-1">{ui.skorLabel}</p>
              <p className={`text-4xl font-bold font-display ${skor === soalUnsur.length ? "text-green-400" : skor >= 2 ? "text-yellow-400" : "text-red-400"}`}>
                {skor} / {soalUnsur.length}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {skor === soalUnsur.length ? ui.perfectMsg : skor >= 2 ? ui.goodMsg : ui.tryAgainMsg}
              </p>
            </div>
            <button
              onClick={handleUlang}
              className="w-full py-2.5 text-sm font-bold bg-slate-700/60 border border-slate-500 text-white/80 rounded-xl hover:bg-slate-600/60 transition-colors cursor-pointer"
            >
              {ui.ulangiBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Page-level translations (title / subtitle / nav) ────────── */
const pageTrans = {
  id: { title: "KERUCUT", subtitle: "Kelas 9 · Bangun Ruang Sisi Lengkung" },
  en: { title: "CONE", subtitle: "Grade 9 · Curved-Surface Solids" },
  ja: { title: "円錐", subtitle: "中学3年・曲面図形" },
};

/* ── Slide 1 translations (Definisi Kerucut / Definition of Cone) ── */
const slide1Trans = {
  id: {
    title: "Definisi Kerucut",
    intro: (
      <>
        <strong className="text-cyan-300">Kerucut</strong> adalah bangun ruang sisi lengkung yang terbentuk dari
        sebuah <strong className="text-yellow-300">alas berbentuk lingkaran</strong> dan sebuah{" "}
        <strong className="text-yellow-300">selimut melengkung</strong> yang semakin mengecil hingga bertemu di satu titik
        yang disebut <strong className="text-yellow-300">puncak (titik apex)</strong>. Bayangkan topi ulang tahun, wafer es krim,
        atau tanda lalu lintas berbentuk kerucut!
      </>
    ),
    propsLabel: "📌 Sifat-sifat Kerucut:",
    prop1: <>Memiliki <strong className="text-yellow-300">1 sisi lengkung</strong> (selimut) dan <strong className="text-yellow-300">1 sisi datar</strong> (alas lingkaran)</>,
    prop2: <>Memiliki <strong className="text-yellow-300">1 titik puncak (apex)</strong> dan <strong className="text-yellow-300">1 rusuk lengkung</strong> (keliling alas)</>,
    prop3: <>Jari-jari alas dilambangkan <InlineMath math="r" /></>,
    prop4: <>Tinggi kerucut (jarak puncak ke pusat alas) dilambangkan <InlineMath math="t" /></>,
    prop5: <>Garis pelukis (jarak puncak ke titik tepi alas) dilambangkan <InlineMath math="s" /></>,
    quoteLabel: "Kerucut vs Tabung:",
    quoteText: "Keduanya punya alas lingkaran, tapi tabung punya dua alas dan tinggi seragam, sedangkan kerucut hanya punya satu alas dan meruncing ke atas!",
    realWorldTitle: "Benda Berbentuk Kerucut di Kehidupan Sehari-hari",
    imgLabels: ["Caping", "Rambu Lalu Lintas", "Wafer Es Krim", "Nasi Tumpeng", "Topi Ulang Tahun", "Corong"],
  },
  en: {
    title: "Definition of a Cone",
    intro: (
      <>
        A <strong className="text-cyan-300">cone</strong> is a curved-surface solid formed by
        a <strong className="text-yellow-300">circular base</strong> and a{" "}
        <strong className="text-yellow-300">curved lateral surface</strong> that tapers until it meets at a single point
        called the <strong className="text-yellow-300">apex</strong>. Think of a birthday hat, an ice cream wafer cone,
        or a cone-shaped traffic sign!
      </>
    ),
    propsLabel: "📌 Properties of a Cone:",
    prop1: <>Has <strong className="text-yellow-300">1 curved side</strong> (lateral surface) and <strong className="text-yellow-300">1 flat side</strong> (circular base)</>,
    prop2: <>Has <strong className="text-yellow-300">1 apex</strong> and <strong className="text-yellow-300">1 curved edge</strong> (the base's circumference)</>,
    prop3: <>The base radius is denoted <InlineMath math="r" /></>,
    prop4: <>The cone's height (apex to base center) is denoted <InlineMath math="t" /></>,
    prop5: <>The slant height (apex to a point on the base rim) is denoted <InlineMath math="s" /></>,
    quoteLabel: "Cone vs. Cylinder:",
    quoteText: "Both have a circular base, but a cylinder has two bases and a uniform height, while a cone has only one base and tapers to a point!",
    realWorldTitle: "Cone-Shaped Objects in Daily Life",
    imgLabels: ["Conical Hat", "Traffic Sign", "Ice Cream Wafer Cone", "Cone-Shaped Rice (Tumpeng)", "Birthday Hat", "Funnel"],
  },
  ja: {
    title: "円錐の定義",
    intro: (
      <>
        <strong className="text-cyan-300">円錐</strong>とは、<strong className="text-yellow-300">円形の底面</strong>と、
        次第に細くなって<strong className="text-yellow-300">頂点</strong>と呼ばれる一点に集まる
        <strong className="text-yellow-300">曲面の側面</strong>からなる曲面図形です。誕生日の帽子、アイスクリームのコーン、
        円錐形の交通標識を想像してみてください！
      </>
    ),
    propsLabel: "📌 円錐の性質：",
    prop1: <><strong className="text-yellow-300">1つの曲面</strong>（側面）と<strong className="text-yellow-300">1つの平面</strong>（円形の底面）を持つ</>,
    prop2: <><strong className="text-yellow-300">1つの頂点</strong>と<strong className="text-yellow-300">1つの曲線の辺</strong>（底面の円周）を持つ</>,
    prop3: <>底面の半径は <InlineMath math="r" /> で表す</>,
    prop4: <>円錐の高さ（頂点から底面の中心まで）は <InlineMath math="t" /> で表す</>,
    prop5: <>母線（頂点から底面の縁までの線）は <InlineMath math="s" /> で表す</>,
    quoteLabel: "円錐と円柱の違い：",
    quoteText: "どちらも円形の底面を持ちますが、円柱は底面が2つあり高さが一定なのに対し、円錐は底面が1つで先端に向かって細くなります！",
    realWorldTitle: "身近にある円錐形のもの",
    imgLabels: ["編み笠", "交通標識", "アイスクリームコーン", "円錐形のご飯（トゥンペン）", "誕生日帽子", "じょうご"],
  },
};

/* ── Slide 2 translations (Unsur-unsur Kerucut / Elements of a Cone) ── */
const slide2Trans = {
  id: {
    title: "Unsur-unsur Kerucut (Interaktif)",
    card1Title: "① Puncak / Apex (T)",
    card1Body: <>Titik ujung runcing kerucut tempat semua garis pelukis bertemu. Hanya ada <strong>1 puncak</strong>.</>,
    card2Title: <>② Tinggi (<InlineMath math="t" />)</>,
    card2Body: <>Jarak tegak lurus dari puncak ke pusat alas lingkaran. Merupakan <strong>sumbu kerucut</strong>.</>,
    card3Title: <>③ Jari-jari Alas (<InlineMath math="r" />)</>,
    card3Body: "Jari-jari lingkaran alas kerucut. Juga merupakan kaki segitiga siku-siku bersama tinggi dan garis pelukis.",
    card4Title: <>④ Garis Pelukis / Apotema (<InlineMath math="s" />)</>,
    card4Body: "Garis dari puncak ke titik mana saja di tepi lingkaran alas. Semua garis pelukis sama panjang.",
    card5Title: "⑤ Alas (Lingkaran)",
    card5Body: <>Satu-satunya sisi datar kerucut berbentuk lingkaran dengan jari-jari <InlineMath math="r" />. Luas alas = <InlineMath math="\pi r^2" />.</>,
    card6Title: "⑥ Selimut (Sisi Lengkung)",
    card6Body: <>Bidang lengkung yang menghubungkan tepi alas ke puncak. Jika dibuka, berbentuk <strong>juring (sektor) lingkaran</strong> dengan jari-jari = <InlineMath math="s" />.</>,
    animTitle: "Sisi, Rusuk & Titik Sudut Kerucut",
    animSub: "Setiap bagian menyala satu per satu",
    sideLabel: "Sisi", sideDesc: "selimut + alas",
    edgeLabel: "Rusuk", edgeDesc: "keliling alas",
    vertexLabel: "Titik Sudut", vertexDesc: "puncak", vertexDesc2: "puncak (T)",
    netTitle: "Selimut Kerucut → Juring Lingkaran",
    netSub: "Jika selimut dibuka dan diratakan",
    netLine1: <>• Selimut kerucut jika dibuka → berbentuk <strong className="text-purple-300">juring lingkaran</strong> dengan:</>,
    netLine2: <>— jari-jari juring = <strong className="text-yellow-300">s</strong> (garis pelukis)</>,
    netLine3: <>— panjang busur = <strong className="text-yellow-300">2πr</strong> (keliling alas)</>,
    netLine4: <>— sudut juring <strong className="text-green-300">θ = (r ÷ s) × 360°</strong></>,
    netLine5: <>• Luas selimut = luas juring = <strong className="text-yellow-300">πrs</strong></>,
    summaryTitle: "📋 Kesimpulan — Sisi, Rusuk & Titik Sudut Kerucut",
    thUnsur: "Unsur", thSimbol: "Simbol", thKeterangan: "Keterangan",
    rows: [
      ["Puncak", "T", "1 buah titik"],
      ["Tinggi", "t", "puncak → pusat alas"],
      ["Jari-jari alas", "r", "lingkaran alas"],
      ["Garis pelukis", "s", "puncak → tepi alas"],
      ["Alas", "—", "lingkaran, luas = πr²"],
      ["Selimut", "—", "juring lingkaran, r = s"],
    ] as [string, string, string][],
  },
  en: {
    title: "Elements of a Cone (Interactive)",
    card1Title: "① Apex (T)",
    card1Body: <>The pointed tip of the cone where all slant heights meet. There is only <strong>1 apex</strong>.</>,
    card2Title: <>② Height (<InlineMath math="t" />)</>,
    card2Body: <>The perpendicular distance from the apex to the center of the base. It forms the <strong>cone's axis</strong>.</>,
    card3Title: <>③ Base Radius (<InlineMath math="r" />)</>,
    card3Body: "The radius of the cone's circular base. Also one leg of the right triangle formed with the height and the slant height.",
    card4Title: <>④ Slant Height (<InlineMath math="s" />)</>,
    card4Body: "The line from the apex to any point on the rim of the base. All slant heights are equal in length.",
    card5Title: "⑤ Base (Circle)",
    card5Body: <>The cone's only flat side — a circle with radius <InlineMath math="r" />. Base area = <InlineMath math="\pi r^2" />.</>,
    card6Title: "⑥ Lateral Surface (Curved Side)",
    card6Body: <>The curved surface connecting the base rim to the apex. When unfolded, it forms a <strong>circular sector</strong> with radius = <InlineMath math="s" />.</>,
    animTitle: "Faces, Edges & Vertices of a Cone",
    animSub: "Each part lights up one at a time",
    sideLabel: "Face", sideDesc: "lateral + base",
    edgeLabel: "Edge", edgeDesc: "base circumference",
    vertexLabel: "Vertex", vertexDesc: "apex", vertexDesc2: "apex (T)",
    netTitle: "Lateral Surface → Circular Sector",
    netSub: "When the lateral surface is unfolded and flattened",
    netLine1: <>• When unfolded, a cone's lateral surface forms a <strong className="text-purple-300">circular sector</strong> with:</>,
    netLine2: <>— sector radius = <strong className="text-yellow-300">s</strong> (slant height)</>,
    netLine3: <>— arc length = <strong className="text-yellow-300">2πr</strong> (base circumference)</>,
    netLine4: <>— sector angle <strong className="text-green-300">θ = (r ÷ s) × 360°</strong></>,
    netLine5: <>• Lateral surface area = sector area = <strong className="text-yellow-300">πrs</strong></>,
    summaryTitle: "📋 Summary — Faces, Edges & Vertices of a Cone",
    thUnsur: "Element", thSimbol: "Symbol", thKeterangan: "Description",
    rows: [
      ["Apex", "T", "1 point"],
      ["Height", "t", "apex → base center"],
      ["Base radius", "r", "radius of the base circle"],
      ["Slant height", "s", "apex → base rim"],
      ["Base", "—", "circle, area = πr²"],
      ["Lateral surface", "—", "circular sector, r = s"],
    ] as [string, string, string][],
  },
  ja: {
    title: "円錐の構成要素（インタラクティブ）",
    card1Title: "①頂点（T）",
    card1Body: <>すべての母線が集まる円錐の先端の点。頂点は<strong>1つだけ</strong>。</>,
    card2Title: <>②高さ（<InlineMath math="t" />）</>,
    card2Body: <>頂点から底面の中心までの垂直距離。<strong>円錐の軸</strong>となる。</>,
    card3Title: <>③底面の半径（<InlineMath math="r" />）</>,
    card3Body: "円錐の底面（円）の半径。高さ・母線とともに直角三角形の一辺を成す。",
    card4Title: <>④母線（<InlineMath math="s" />）</>,
    card4Body: "頂点から底面の縁上の任意の点までの線。すべての母線の長さは等しい。",
    card5Title: "⑤底面（円）",
    card5Body: <>円錐の唯一の平面で、半径 <InlineMath math="r" /> の円。底面積 = <InlineMath math="\pi r^2" />。</>,
    card6Title: "⑥側面（曲面）",
    card6Body: <>底面の縁と頂点をつなぐ曲面。広げると、半径 = <InlineMath math="s" /> の<strong>扇形</strong>になる。</>,
    animTitle: "円錐の面・辺・頂点",
    animSub: "各部分が順番に光ります",
    sideLabel: "面", sideDesc: "側面＋底面",
    edgeLabel: "辺", edgeDesc: "底面の円周",
    vertexLabel: "頂点", vertexDesc: "頂点", vertexDesc2: "頂点（T）",
    netTitle: "側面 → 扇形",
    netSub: "側面を広げて平らにすると",
    netLine1: <>• 円錐の側面を広げると、<strong className="text-purple-300">扇形</strong>になり：</>,
    netLine2: <>— 扇形の半径 = <strong className="text-yellow-300">s</strong>（母線）</>,
    netLine3: <>— 弧の長さ = <strong className="text-yellow-300">2πr</strong>（底面の円周）</>,
    netLine4: <>— 扇形の中心角 <strong className="text-green-300">θ = (r ÷ s) × 360°</strong></>,
    netLine5: <>• 側面積 = 扇形の面積 = <strong className="text-yellow-300">πrs</strong></>,
    summaryTitle: "📋 まとめ — 円錐の面・辺・頂点",
    thUnsur: "要素", thSimbol: "記号", thKeterangan: "説明",
    rows: [
      ["頂点", "T", "1個の点"],
      ["高さ", "t", "頂点→底面の中心"],
      ["底面の半径", "r", "底面の円の半径"],
      ["母線", "s", "頂点→底面の縁"],
      ["底面", "—", "円、面積 = πr²"],
      ["側面", "—", "扇形、r = s"],
    ] as [string, string, string][],
  },
};

/* ── Slide 3 translations (Jaring-jaring Kerucut / Net of a Cone) ── */
const slide3Trans = {
  id: {
    title: "Jaring-jaring Kerucut",
    intro: (
      <>
        Kalau kerucut "dikupas" dan dibentangkan di permukaan datar, akan terbentuk{" "}
        <strong className="text-cyan-300">jaring-jaring kerucut</strong> yang terdiri dari <strong>2 bagian</strong>:
      </>
    ),
    card1Title: "① Selimut",
    card1Body1: <>Juring lingkaran dengan jari-jari = <InlineMath math="s" /></>,
    card1Body2: <>Sudut juring = <InlineMath math="\frac{r}{s} \times 360°" /></>,
    card2Title: "② Alas",
    card2Body1: <>Lingkaran dengan jari-jari = <InlineMath math="r" /></>,
    card2Body2: <>Keliling = <InlineMath math="2\pi r" /></>,
    relLabel: <>🔑 <strong className="text-white">Hubungan penting:</strong> Arc selimut = Keliling alas</>,
    relLine: <>Arc juring = <InlineMath math="2\pi r" /> → Sudut juring = <InlineMath math="\dfrac{r}{s} \times 360°" /></>,
    checkQuote: "💡 Cek: Keliling alas lingkaran harus sama dengan panjang busur juring selimut!",
  },
  en: {
    title: "Net of a Cone",
    intro: (
      <>
        When a cone is "peeled" and unfolded onto a flat surface, it forms the{" "}
        <strong className="text-cyan-300">net of a cone</strong>, made up of <strong>2 parts</strong>:
      </>
    ),
    card1Title: "① Lateral Surface",
    card1Body1: <>Circular sector with radius = <InlineMath math="s" /></>,
    card1Body2: <>Sector angle = <InlineMath math="\frac{r}{s} \times 360°" /></>,
    card2Title: "② Base",
    card2Body1: <>Circle with radius = <InlineMath math="r" /></>,
    card2Body2: <>Circumference = <InlineMath math="2\pi r" /></>,
    relLabel: <>🔑 <strong className="text-white">Key relationship:</strong> Lateral arc = Base circumference</>,
    relLine: <>Sector arc = <InlineMath math="2\pi r" /> → Sector angle = <InlineMath math="\dfrac{r}{s} \times 360°" /></>,
    checkQuote: "💡 Check: The base circle's circumference must equal the arc length of the lateral sector!",
  },
  ja: {
    title: "円錐の展開図",
    intro: (
      <>
        円錐を「剥がして」平面に広げると、<strong className="text-cyan-300">2つの部分</strong>からなる
        <strong className="text-cyan-300">円錐の展開図</strong>ができます：
      </>
    ),
    card1Title: "①側面",
    card1Body1: <>半径 = <InlineMath math="s" /> の扇形</>,
    card1Body2: <>扇形の中心角 = <InlineMath math="\frac{r}{s} \times 360°" /></>,
    card2Title: "②底面",
    card2Body1: <>半径 = <InlineMath math="r" /> の円</>,
    card2Body2: <>円周 = <InlineMath math="2\pi r" /></>,
    relLabel: <>🔑 <strong className="text-white">重要な関係：</strong>側面の弧 = 底面の円周</>,
    relLine: <>扇形の弧 = <InlineMath math="2\pi r" /> → 扇形の中心角 = <InlineMath math="\dfrac{r}{s} \times 360°" /></>,
    checkQuote: "💡 確認：底面の円の円周は、側面（扇形）の弧の長さと等しくなければなりません！",
  },
};

/* ── Slide 4 translations (Rumus Garis Pelukis / Slant Height Formula) ── */
const slide4Trans = {
  id: {
    title: "Rumus Garis Pelukis (Apotema)",
    intro: (
      <>
        Garis pelukis, tinggi, dan jari-jari alas membentuk <strong className="text-cyan-300">segitiga siku-siku</strong> di pusat alas.
        Dengan Teorema Pythagoras, kita dapat mencari salah satu unsur jika dua lainnya diketahui.
      </>
    ),
    derivLabel: "📌 Penurunan Rumus Garis Pelukis:",
    derivBody: "Karena OT (tinggi) tegak lurus OA (jari-jari), maka segitiga TOA siku-siku di O:",
    findLabel: <>🎯 <strong className="text-white">Dari rumus ini kita bisa cari:</strong></>,
    findLine1: <>• Jika tahu <InlineMath math="r" /> dan <InlineMath math="t" /> → cari <InlineMath math="s = \sqrt{r^2+t^2}" /></>,
    findLine2: <>• Jika tahu <InlineMath math="s" /> dan <InlineMath math="t" /> → cari <InlineMath math="r = \sqrt{s^2-t^2}" /></>,
    findLine3: <>• Jika tahu <InlineMath math="s" /> dan <InlineMath math="r" /> → cari <InlineMath math="t = \sqrt{s^2-r^2}" /></>,
  },
  en: {
    title: "Slant Height Formula",
    intro: (
      <>
        The slant height, height, and base radius form a <strong className="text-cyan-300">right triangle</strong> at the center of the base.
        Using the Pythagorean Theorem, we can find one element if the other two are known.
      </>
    ),
    derivLabel: "📌 Deriving the Slant Height Formula:",
    derivBody: "Since OT (height) is perpendicular to OA (radius), triangle TOA is a right triangle at O:",
    findLabel: <>🎯 <strong className="text-white">From this formula we can find:</strong></>,
    findLine1: <>• If <InlineMath math="r" /> and <InlineMath math="t" /> are known → find <InlineMath math="s = \sqrt{r^2+t^2}" /></>,
    findLine2: <>• If <InlineMath math="s" /> and <InlineMath math="t" /> are known → find <InlineMath math="r = \sqrt{s^2-t^2}" /></>,
    findLine3: <>• If <InlineMath math="s" /> and <InlineMath math="r" /> are known → find <InlineMath math="t = \sqrt{s^2-r^2}" /></>,
  },
  ja: {
    title: "母線の公式",
    intro: (
      <>
        母線・高さ・底面の半径は、底面の中心で<strong className="text-cyan-300">直角三角形</strong>を作ります。
        ピタゴラスの定理を使えば、2つの値がわかれば残り1つを求められます。
      </>
    ),
    derivLabel: "📌 母線の公式の導出：",
    derivBody: "OT（高さ）はOA（半径）に垂直なので、三角形TOAはOで直角三角形になります：",
    findLabel: <>🎯 <strong className="text-white">この公式から求められること：</strong></>,
    findLine1: <>• <InlineMath math="r" /> と <InlineMath math="t" /> がわかれば → <InlineMath math="s = \sqrt{r^2+t^2}" /> を求める</>,
    findLine2: <>• <InlineMath math="s" /> と <InlineMath math="t" /> がわかれば → <InlineMath math="r = \sqrt{s^2-t^2}" /> を求める</>,
    findLine3: <>• <InlineMath math="s" /> と <InlineMath math="r" /> がわかれば → <InlineMath math="t = \sqrt{s^2-r^2}" /> を求める</>,
  },
};

/* ── Slide 5 translations (Luas Permukaan Kerucut / Surface Area of a Cone) ── */
const slide5Trans = {
  id: {
    title: "Luas Permukaan Kerucut",
    intro: (
      <>
        <strong className="text-orange-300">Luas permukaan kerucut</strong> adalah jumlah total luas selimut dan luas alas.
        Bayangkan kamu ingin melapis seluruh permukaan topi ulang tahun — berapa luas kertas yang dibutuhkan?
      </>
    ),
    derivLabel: "📌 Penurunan Rumus:",
    line1: <>• <strong>Luas selimut</strong> = luas juring dengan jari-jari <InlineMath math="s" /> dan busur <InlineMath math="2\pi r" /></>,
    line2: <>• <strong>Luas juring</strong> = <InlineMath math="\frac{b}{K} \times \pi s^2 = \frac{2\pi r}{2\pi s} \times \pi s^2 = \pi r s" /></>,
    line3: <>• <strong>Luas alas</strong> = <InlineMath math="\pi r^2" /></>,
    note: <>Di mana <InlineMath math="s = \sqrt{r^2 + t^2}" /> adalah garis pelukis.</>,
    reminder: <>💡 <strong>Ingat:</strong> Jika soal hanya menanyakan luas selimut saja (tanpa alas), gunakan <InlineMath math="L_s = \pi r s" />.</>,
  },
  en: {
    title: "Surface Area of a Cone",
    intro: (
      <>
        The <strong className="text-orange-300">surface area of a cone</strong> is the total area of its lateral surface and base.
        Imagine covering an entire birthday hat with paper — how much paper would you need?
      </>
    ),
    derivLabel: "📌 Deriving the Formula:",
    line1: <>• <strong>Lateral surface area</strong> = area of a sector with radius <InlineMath math="s" /> and arc <InlineMath math="2\pi r" /></>,
    line2: <>• <strong>Sector area</strong> = <InlineMath math="\frac{b}{K} \times \pi s^2 = \frac{2\pi r}{2\pi s} \times \pi s^2 = \pi r s" /></>,
    line3: <>• <strong>Base area</strong> = <InlineMath math="\pi r^2" /></>,
    note: <>Where <InlineMath math="s = \sqrt{r^2 + t^2}" /> is the slant height.</>,
    reminder: <>💡 <strong>Remember:</strong> If the question only asks for the lateral surface area (without the base), use <InlineMath math="L_s = \pi r s" />.</>,
  },
  ja: {
    title: "円錐の表面積",
    intro: (
      <>
        <strong className="text-orange-300">円錐の表面積</strong>は、側面積と底面積の合計です。
        誕生日用の帽子全体を紙で覆うには、どれくらいの紙が必要か想像してみましょう。
      </>
    ),
    derivLabel: "📌 公式の導出：",
    line1: <>• <strong>側面積</strong> = 半径 <InlineMath math="s" />、弧 <InlineMath math="2\pi r" /> の扇形の面積</>,
    line2: <>• <strong>扇形の面積</strong> = <InlineMath math="\frac{b}{K} \times \pi s^2 = \frac{2\pi r}{2\pi s} \times \pi s^2 = \pi r s" /></>,
    line3: <>• <strong>底面積</strong> = <InlineMath math="\pi r^2" /></>,
    note: <>ここで <InlineMath math="s = \sqrt{r^2 + t^2}" /> は母線です。</>,
    reminder: <>💡 <strong>覚えておこう：</strong>側面積のみ（底面を除く）を求める場合は <InlineMath math="L_s = \pi r s" /> を使います。</>,
  },
};

/* ── Slide 6 translations (Volume Kerucut / Volume of a Cone) ── */
const slide6Trans = {
  id: {
    title: "Volume Kerucut",
    intro: (
      <>
        <strong className="text-blue-300">Volume kerucut</strong> adalah besar ruang yang ditempati kerucut.
        Fakta menarik: volume kerucut tepat <strong className="text-yellow-300">⅓ dari volume tabung</strong> yang memiliki alas dan tinggi yang sama!
      </>
    ),
    waterCaption: "🌊 Kerucut diisi air — dari kosong hingga penuh",
    waterNote: "Persentase menunjukkan proporsi volume terisi terhadap volume total",
    derivLabel: "📌 Penurunan Rumus:",
    line1: <>• Volume tabung (alas &amp; tinggi sama) = <InlineMath math="\pi r^2 t" /></>,
    line2: <>• Secara eksperimen &amp; integral, kerucut = <InlineMath math="\frac{1}{3}" /> × volume tabung</>,
    note: <><InlineMath math="r" /> = jari-jari alas, <InlineMath math="t" /> = tinggi kerucut</>,
    relLabel: "🚀 Hubungan Volume:",
    relFormula: <InlineMath math="V_k = \frac{1}{3} \times V_{tb}" />,
    relText: "Artinya, 3 kerucut = 1 tabung (dengan r dan t yang sama)!",
  },
  en: {
    title: "Volume of a Cone",
    intro: (
      <>
        The <strong className="text-blue-300">volume of a cone</strong> is the amount of space it occupies.
        Interesting fact: the volume of a cone is exactly <strong className="text-yellow-300">⅓ the volume of a cylinder</strong> with the same base and height!
      </>
    ),
    waterCaption: "🌊 Filling the cone with water — from empty to full",
    waterNote: "The percentage shows the proportion of filled volume relative to the total volume",
    derivLabel: "📌 Deriving the Formula:",
    line1: <>• Volume of a cylinder (same base &amp; height) = <InlineMath math="\pi r^2 t" /></>,
    line2: <>• Experimentally &amp; via integration, a cone = <InlineMath math="\frac{1}{3}" /> × the volume of a cylinder</>,
    note: <><InlineMath math="r" /> = base radius, <InlineMath math="t" /> = height of the cone</>,
    relLabel: "🚀 Volume Relationship:",
    relFormula: <InlineMath math="V_k = \frac{1}{3} \times V_{tb}" />,
    relText: "In other words, 3 cones = 1 cylinder (with the same r and t)!",
  },
  ja: {
    title: "円錐の体積",
    intro: (
      <>
        <strong className="text-blue-300">円錐の体積</strong>は、円錐が占める空間の大きさです。
        面白い事実：円錐の体積は、同じ底面と高さを持つ<strong className="text-yellow-300">円柱の体積のちょうど⅓</strong>です！
      </>
    ),
    waterCaption: "🌊 円錐に水を注ぐ — 空から満杯まで",
    waterNote: "パーセントは、全体の体積に対する満たされた体積の割合を示します",
    derivLabel: "📌 公式の導出：",
    line1: <>• 円柱の体積（底面と高さが同じ） = <InlineMath math="\pi r^2 t" /></>,
    line2: <>• 実験と積分により、円錐 = 円柱の体積 × <InlineMath math="\frac{1}{3}" /></>,
    note: <><InlineMath math="r" /> = 底面の半径、<InlineMath math="t" /> = 円錐の高さ</>,
    relLabel: "🚀 体積の関係：",
    relFormula: <InlineMath math="V_k = \frac{1}{3} \times V_{tb}" />,
    relText: "つまり、円錐3個 = 円柱1個（rとtが同じ場合）！",
  },
};

/* ── Slide 7 translations (Kesimpulan — Rumus Lengkap Kerucut) ── */
const slide7Trans = {
  id: {
    title: "Kesimpulan — Rumus Lengkap Kerucut",
    thBesaran: "Besaran", thRumus: "Rumus", thCatatan: "Catatan",
    rows: [
      ["Garis pelukis", "s = √(r² + t²)", "Pythagoras"],
      ["Keliling alas", "K = 2πr", "lingkaran"],
      ["Luas alas", "L_alas = πr²", "lingkaran"],
      ["Luas selimut", "L_selimut = πrs", "juring"],
      ["Luas permukaan", "L = πr(r + s)", "alas + selimut"],
      ["Volume", "V = ⅓πr²t", "1/3 tabung"],
    ] as [string, string, string][],
    keyLabel: "Kunci utama:",
    keyText: <>Tiga variabel yang saling berkaitan: <strong className="text-yellow-300">r, t, dan s</strong>.</>,
    tipText: <>Selalu cari dulu <InlineMath math="s = \sqrt{r^2+t^2}" /> sebelum menghitung luas permukaan!</>,
  },
  en: {
    title: "Summary — Complete Cone Formulas",
    thBesaran: "Quantity", thRumus: "Formula", thCatatan: "Note",
    rows: [
      ["Slant height", "s = √(r² + t²)", "Pythagoras"],
      ["Base circumference", "K = 2πr", "circle"],
      ["Base area", "L_base = πr²", "circle"],
      ["Lateral surface area", "L_lateral = πrs", "sector"],
      ["Surface area", "L = πr(r + s)", "base + lateral"],
      ["Volume", "V = ⅓πr²t", "1/3 of cylinder"],
    ] as [string, string, string][],
    keyLabel: "Key insight:",
    keyText: <>Three variables are all connected: <strong className="text-yellow-300">r, t, and s</strong>.</>,
    tipText: <>Always find <InlineMath math="s = \sqrt{r^2+t^2}" /> first before calculating the surface area!</>,
  },
  ja: {
    title: "まとめ — 円錐の公式一覧",
    thBesaran: "量", thRumus: "公式", thCatatan: "備考",
    rows: [
      ["母線", "s = √(r² + t²)", "ピタゴラスの定理"],
      ["底面の周", "K = 2πr", "円"],
      ["底面積", "L_底面 = πr²", "円"],
      ["側面積", "L_側面 = πrs", "扇形"],
      ["表面積", "L = πr(r + s)", "底面 + 側面"],
      ["体積", "V = ⅓πr²t", "円柱の1/3"],
    ] as [string, string, string][],
    keyLabel: "重要ポイント：",
    keyText: <>r、t、s の3つの変数はすべて関連しています。</>,
    tipText: <>表面積を計算する前に、必ず <InlineMath math="s = \sqrt{r^2+t^2}" /> を先に求めましょう！</>,
  },
};

function getSections(language: Language): Sec[] {
  const s1 = slide1Trans[language];
  const s2 = slide2Trans[language];
  const s3 = slide3Trans[language];
  const s4 = slide4Trans[language];
  const s5 = slide5Trans[language];
  const s6 = slide6Trans[language];
  const s7 = slide7Trans[language];
  return [
  {
    title: s1.title,
    icon: "🔺",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{s1.intro}</p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">{s1.propsLabel}</p>
          <ul className="space-y-1 text-xs text-white/75">
            <li>• {s1.prop1}</li>
            <li>• {s1.prop2}</li>
            <li>• {s1.prop3}</li>
            <li>• {s1.prop4}</li>
            <li>• {s1.prop5}</li>
          </ul>
        </div>
        <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
          💡 <strong>{s1.quoteLabel}</strong> {s1.quoteText}
        </blockquote>
        <InteractiveCone3D language={language} />

        {/* ── Foto Benda Berbentuk Kerucut — slide 2 ── */}
        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-xl p-4 space-y-3">
          <p className="text-cyan-300 font-bold text-sm text-center">{s1.realWorldTitle}</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { src: "/images/image_1780701179640.png",    label: s1.imgLabels[0] },
              { src: "/images/image_1780701419978.png",      label: s1.imgLabels[1] },
              { src: "/images/image_1780701492837.png",     label: s1.imgLabels[2] },
              { src: "/images/image_1780701574690.png",   label: s1.imgLabels[3] },
              { src: "/images/image_1780701763127.png", label: s1.imgLabels[4] },
              { src: "/images/image_1780701892436.png",    label: s1.imgLabels[5] },
            ].map(({ src, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-600/60 bg-slate-900/60">
                  <img src={src} alt={label} className="w-full h-full object-cover" />
                </div>
                <p className="text-[9px] text-white/60 text-center leading-tight font-body">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: s2.title,
    icon: "🔍",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        <UnsurSVG language={language} />
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-3 space-y-1">
            <p className="text-yellow-300 font-semibold">{s2.card1Title}</p>
            <p className="text-xs text-white/70">{s2.card1Body}</p>
          </div>
          <div className="bg-orange-950/40 border border-orange-700/40 rounded-lg p-3 space-y-1">
            <p className="text-orange-300 font-semibold">{s2.card2Title}</p>
            <p className="text-xs text-white/70">{s2.card2Body}</p>
          </div>
          <div className="bg-green-950/40 border border-green-700/40 rounded-lg p-3 space-y-1">
            <p className="text-green-300 font-semibold">{s2.card3Title}</p>
            <p className="text-xs text-white/70">{s2.card3Body}</p>
          </div>
          <div className="bg-red-950/40 border border-red-700/40 rounded-lg p-3 space-y-1">
            <p className="text-red-300 font-semibold">{s2.card4Title}</p>
            <p className="text-xs text-white/70">{s2.card4Body}</p>
            <div className="bg-slate-800/60 rounded p-2 text-center">
              <BlockMath math="s = \sqrt{r^2 + t^2}" />
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-700/40 rounded-lg p-3 space-y-1">
            <p className="text-indigo-300 font-semibold">{s2.card5Title}</p>
            <p className="text-xs text-white/70">{s2.card5Body}</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-3 space-y-1">
            <p className="text-cyan-300 font-semibold">{s2.card6Title}</p>
            <p className="text-xs text-white/70">{s2.card6Body}</p>
          </div>
        </div>

        {/* ── Sisi / Rusuk / Titik Sudut — animasi bergantian ── */}
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/60">
            <span className="text-lg">✨</span>
            <div>
              <p className="text-white font-bold text-sm">{s2.animTitle}</p>
              <p className="text-white/50 text-xs">{s2.animSub}</p>
            </div>
          </div>
          <KerucutUnsurCountSVG language={language} />
          <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-purple-950/50 border border-purple-700/40 rounded-lg p-2">
              <p className="text-purple-300 font-bold text-base">2</p>
              <p className="text-white/60 text-[10px]">{s2.sideLabel}</p>
              <p className="text-white/40 text-[9px]">{s2.sideDesc}</p>
            </div>
            <div className="bg-amber-950/50 border border-amber-700/40 rounded-lg p-2">
              <p className="text-amber-300 font-bold text-base">1</p>
              <p className="text-white/60 text-[10px]">{s2.edgeLabel}</p>
              <p className="text-white/40 text-[9px]">{s2.edgeDesc}</p>
            </div>
            <div className="bg-yellow-950/50 border border-yellow-700/40 rounded-lg p-2">
              <p className="text-yellow-300 font-bold text-base">1</p>
              <p className="text-white/60 text-[10px]">{s2.vertexLabel}</p>
              <p className="text-white/40 text-[9px]">{s2.vertexDesc}</p>
            </div>
          </div>
        </div>

        {/* ── Selimut kerucut dibuka → juring ── */}
        <div className="bg-purple-950/40 border border-purple-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2 bg-purple-900/40">
            <span className="text-lg">🌀</span>
            <div>
              <p className="text-purple-300 font-bold text-sm">{s2.netTitle}</p>
              <p className="text-purple-200/60 text-xs">{s2.netSub}</p>
            </div>
          </div>
          <SelimutJuringAnimSVG language={language} />
          <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
            <p>{s2.netLine1}</p>
            <p className="pl-3">{s2.netLine2}</p>
            <p className="pl-3">{s2.netLine3}</p>
            <p className="pl-3">{s2.netLine4}</p>
            <p>{s2.netLine5}</p>
          </div>
        </div>

        {/* ── Kesimpulan: Sisi, Rusuk & Titik Sudut ── */}
        <div className="bg-slate-800/70 border border-slate-600/50 rounded-xl p-4 space-y-3">
          <p className="text-white font-bold text-sm text-center">{s2.summaryTitle}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-purple-950/60 border border-purple-700/50 rounded-xl p-3">
              <p className="text-purple-300 font-bold text-3xl leading-tight">2</p>
              <p className="text-white/80 text-xs font-semibold mt-1">{s2.sideLabel}</p>
              <p className="text-white/45 text-[9px] mt-0.5">{s2.sideDesc}</p>
            </div>
            <div className="bg-amber-950/60 border border-amber-700/50 rounded-xl p-3">
              <p className="text-amber-300 font-bold text-3xl leading-tight">1</p>
              <p className="text-white/80 text-xs font-semibold mt-1">{s2.edgeLabel}</p>
              <p className="text-white/45 text-[9px] mt-0.5">{s2.edgeDesc}</p>
            </div>
            <div className="bg-yellow-950/60 border border-yellow-700/50 rounded-xl p-3">
              <p className="text-yellow-300 font-bold text-3xl leading-tight">1</p>
              <p className="text-white/80 text-xs font-semibold mt-1">{s2.vertexLabel}</p>
              <p className="text-white/45 text-[9px] mt-0.5">{s2.vertexDesc2}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s2.thUnsur}</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{s2.thSimbol}</th>
              <th className="px-3 py-2 text-cyan-300">{s2.thKeterangan}</th>
            </tr></thead>
            <tbody>
              {s2.rows.map(([u,s,k],i)=>(
                <tr key={i} className={`border-t border-slate-700 ${i%2===0?"bg-slate-900/40":"bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{u}</td>
                  <td className="px-3 py-2 text-yellow-300 border-r border-slate-700 font-mono">{s}</td>
                  <td className="px-3 py-2 text-white/60 text-left">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    title: s3.title,
    icon: "📋",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
        <p>{s3.intro}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-center space-y-1">
            <p className="text-cyan-300 font-semibold text-xs">{s3.card1Title}</p>
            <p className="text-white/60 text-xs">{s3.card1Body1}</p>
            <p className="text-cyan-200 text-xs">{s3.card1Body2}</p>
          </div>
          <div className="bg-indigo-950/50 border border-indigo-700/40 rounded-lg p-3 text-center space-y-1">
            <p className="text-indigo-300 font-semibold text-xs">{s3.card2Title}</p>
            <p className="text-white/60 text-xs">{s3.card2Body1}</p>
            <p className="text-indigo-200 text-xs">{s3.card2Body2}</p>
          </div>
        </div>
        <ConeNetAnimation language={language} />
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>{s3.relLabel}</p>
          <p>{s3.relLine}</p>
        </div>
        <blockquote className="border-l-4 border-yellow-500 pl-3 text-yellow-200 text-xs italic">
          {s3.checkQuote}
        </blockquote>
      </div>
    ),
  },
  {
    title: s4.title,
    icon: "📐",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
        <p>{s4.intro}</p>
        <GarisPelukisSVG />
        <div className="bg-red-950/50 border border-red-700/40 rounded-lg p-4 space-y-3">
          <p className="text-red-300 font-semibold">{s4.derivLabel}</p>
          <p className="text-xs text-white/70">{s4.derivBody}</p>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="s^2 = r^2 + t^2" />
            <BlockMath math="\boxed{s = \sqrt{r^2 + t^2}}" />
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>{s4.findLabel}</p>
          <p>{s4.findLine1}</p>
          <p>{s4.findLine2}</p>
          <p>{s4.findLine3}</p>
        </div>
      </div>
    ),
  },
  {
    title: s5.title,
    icon: "🎨",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{s5.intro}</p>
        <LuasKerucutSVG language={language} />
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-3">
          <p className="text-orange-300 font-semibold">{s5.derivLabel}</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>{s5.line1}</p>
            <p>{s5.line2}</p>
            <p>{s5.line3}</p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="L = \pi r s + \pi r^2" />
            <BlockMath math="\boxed{L = \pi r(r + s)}" />
          </div>
          <p className="text-white/60 text-xs">{s5.note}</p>
        </div>
        <blockquote className="border-l-4 border-orange-500 pl-3 text-orange-200 text-xs italic">
          {s5.reminder}
        </blockquote>
      </div>
    ),
  },
  {
    title: s6.title,
    icon: "📦",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{s6.intro}</p>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-1">
          <p className="text-cyan-300 text-xs font-semibold font-body text-center">
            {s6.waterCaption}
          </p>
          <WaterKerucutAnimation />
          <p className="text-white/45 text-[10px] font-body text-center">
            {s6.waterNote}
          </p>
        </div>

        <div className="bg-blue-950/60 border border-blue-700/50 rounded-lg p-4 space-y-3">
          <p className="text-blue-300 font-semibold">{s6.derivLabel}</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>{s6.line1}</p>
            <p>{s6.line2}</p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="\boxed{V = \frac{1}{3} \pi r^2 t}" />
          </div>
          <p className="text-white/60 text-xs">{s6.note}</p>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs space-y-1">
          <p className="text-cyan-300 font-semibold">{s6.relLabel}</p>
          <p className="text-white/70">{s6.relFormula}</p>
          <p className="text-white/70">{s6.relText}</p>
        </div>
      </div>
    ),
  },
  {
    title: s7.title,
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s7.thBesaran}</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{s7.thRumus}</th>
              <th className="px-3 py-2 text-cyan-300">{s7.thCatatan}</th>
            </tr></thead>
            <tbody>
              {s7.rows.map(([b,r,c],i)=>(
                <tr key={i} className={`border-t border-slate-700 ${i%2===0?"bg-slate-900/40":"bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{r}</td>
                  <td className="px-3 py-2 text-white/55 text-left">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p>🚀 <strong>{s7.keyLabel}</strong> {s7.keyText}</p>
          <p>{s7.tipText}</p>
        </div>
      </div>
    ),
  },
  ];
}

/* ─────────────────────────────────────────────────────────────
   EXAMPLE PROBLEMS
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const levelLabels: Record<string, Record<Language, string>> = {
  MUDAH:  { id: "MUDAH",  en: "EASY",   ja: "基本" },
  SEDANG: { id: "SEDANG", en: "MEDIUM", ja: "標準" },
  SULIT:  { id: "SULIT",  en: "HARD",   ja: "発展" },
};
function levelLabel(level: string, language: Language): string {
  return levelLabels[level]?.[language] ?? level;
}

const gpExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kerucut memiliki jari-jari alas <InlineMath math="6 \text{ cm}" /> dan tinggi <InlineMath math="8 \text{ cm}" />.</p>
        <p>Tentukan panjang garis pelukisnya!</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="s = \sqrt{r^2 + t^2} = \sqrt{6^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10 \text{ cm}" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Garis pelukis = <InlineMath math="10 \text{ cm}" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kerucut memiliki garis pelukis <InlineMath math="13 \text{ cm}" /> dan jari-jari alas <InlineMath math="5 \text{ cm}" />.</p>
        <p>Tentukan: (a) tinggi kerucut, (b) luas selimut. (Gunakan <InlineMath math="\pi = 3{,}14" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Tinggi kerucut:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="t = \sqrt{s^2 - r^2} = \sqrt{13^2 - 5^2} = \sqrt{169 - 25} = \sqrt{144} = 12 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Luas selimut:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L_{\text{selimut}} = \pi r s = 3{,}14 \times 5 \times 13 = 204{,}1 \text{ cm}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2 text-xs">
          <p className="text-yellow-300 font-semibold">✅ Tinggi = 12 cm, Luas selimut = 204,1 cm²</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah topi ulang tahun berbentuk kerucut memiliki keliling alas <InlineMath math="44 \text{ cm}" /> dan garis pelukis <InlineMath math="25 \text{ cm}" />.</p>
        <p>Tentukan: (a) jari-jari alas, (b) tinggi topi, (c) volume topi. (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Cari jari-jari dari keliling:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="K = 2\pi r \Rightarrow 44 = 2 \times \frac{22}{7} \times r" />
          <BlockMath math="r = \frac{44 \times 7}{2 \times 22} = \frac{308}{44} = 7 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Cari tinggi:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="t = \sqrt{s^2 - r^2} = \sqrt{25^2 - 7^2} = \sqrt{625 - 49} = \sqrt{576} = 24 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Volume topi:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="V = \frac{1}{3}\pi r^2 t = \frac{1}{3} \times \frac{22}{7} \times 7^2 \times 24" />
          <BlockMath math="= \frac{1}{3} \times \frac{22}{7} \times 49 \times 24 = \frac{1}{3} \times 22 \times 7 \times 24 = \frac{3.696}{3} = 1.232 \text{ cm}^3" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Jari-jari = <strong className="text-yellow-300">7 cm</strong></p>
          <p className="text-white/80">• Tinggi topi = <strong className="text-yellow-300">24 cm</strong></p>
          <p className="text-white/80">• Volume = <strong className="text-yellow-300">1.232 cm³</strong></p>
        </div>
      </div>
    ),
  },
];

const luasExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kerucut memiliki jari-jari <InlineMath math="7 \text{ cm}" /> dan garis pelukis <InlineMath math="25 \text{ cm}" />.</p>
        <p>Hitung luas permukaan kerucut tersebut! (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="L = \pi r (r + s) = \frac{22}{7} \times 7 \times (7 + 25)" />
          <BlockMath math="= 22 \times 32 = 704 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Luas permukaan = <InlineMath math="704 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah corong berbentuk kerucut (tanpa alas) memiliki diameter <InlineMath math="20 \text{ cm}" /> dan tinggi <InlineMath math="24 \text{ cm}" />.</p>
        <p>Berapa luas selimut corong tersebut? (Gunakan <InlineMath math="\pi = 3{,}14" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">Langkah 1 — Tentukan r dan cari s:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p className="text-white/70"><InlineMath math="r = \frac{d}{2} = \frac{20}{2} = 10 \text{ cm}" /></p>
          <BlockMath math="s = \sqrt{r^2+t^2} = \sqrt{10^2+24^2} = \sqrt{100+576} = \sqrt{676} = 26 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">Langkah 2 — Hitung luas selimut:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L_{\text{selimut}} = \pi r s = 3{,}14 \times 10 \times 26 = 816{,}4 \text{ cm}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Luas selimut corong = <strong>816,4 cm²</strong></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah pabrik membuat wadah es krim berbentuk kerucut dari kertas karton. Luas selimut kerucut adalah <InlineMath math="550 \text{ cm}^2" /> dan jari-jari alas <InlineMath math="7 \text{ cm}" />.</p>
        <p>Tentukan: (a) garis pelukis, (b) tinggi kerucut, (c) luas permukaan total. (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">(a) Cari garis pelukis dari luas selimut:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="\pi r s = 550 \Rightarrow \frac{22}{7} \times 7 \times s = 550" />
          <BlockMath math="22s = 550 \Rightarrow s = 25 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">(b) Cari tinggi kerucut:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="t = \sqrt{s^2 - r^2} = \sqrt{25^2 - 7^2} = \sqrt{625-49} = \sqrt{576} = 24 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">(c) Luas permukaan total:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L = \pi r s + \pi r^2 = 550 + \frac{22}{7} \times 49 = 550 + 154 = 704 \text{ cm}^2" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Garis pelukis = <strong className="text-yellow-300">25 cm</strong></p>
          <p className="text-white/80">• Tinggi = <strong className="text-yellow-300">24 cm</strong></p>
          <p className="text-white/80">• Luas permukaan = <strong className="text-yellow-300">704 cm²</strong></p>
        </div>
      </div>
    ),
  },
];

const volExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kerucut memiliki jari-jari <InlineMath math="9 \text{ cm}" /> dan tinggi <InlineMath math="14 \text{ cm}" />.</p>
        <p>Hitung volume kerucut tersebut! (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="V = \frac{1}{3}\pi r^2 t = \frac{1}{3} \times \frac{22}{7} \times 9^2 \times 14" />
          <BlockMath math="= \frac{1}{3} \times \frac{22}{7} \times 81 \times 14 = \frac{1}{3} \times 22 \times 81 \times 2 = \frac{3.564}{3} = 1.188 \text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume = <InlineMath math="1.188 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Volume sebuah kerucut adalah <InlineMath math="1.540 \text{ cm}^3" />. Jika tingginya <InlineMath math="30 \text{ cm}" />,</p>
        <p>tentukan jari-jari dan keliling alasnya! (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">Langkah 1 — Cari jari-jari:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="V = \frac{1}{3}\pi r^2 t \Rightarrow 1.540 = \frac{1}{3} \times \frac{22}{7} \times r^2 \times 30" />
          <BlockMath math="1.540 = \frac{22 \times 30}{21} \times r^2 = \frac{660}{21} \times r^2" />
          <BlockMath math="r^2 = \frac{1.540 \times 21}{660} = \frac{32.340}{660} = 49 \Rightarrow r = 7 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">Langkah 2 — Keliling alas:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="K = 2\pi r = 2 \times \frac{22}{7} \times 7 = 44 \text{ cm}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Jari-jari = 7 cm, Keliling alas = 44 cm</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah ember berbentuk kerucut terbalik memiliki diameter atas <InlineMath math="28 \text{ cm}" /> dan kedalaman (tinggi) <InlineMath math="30 \text{ cm}" />.</p>
        <p>Ember diisi pasir setinggi <InlineMath math="20 \text{ cm}" /> dari bawah (puncak kerucut). Berapa volume pasir di dalam ember?</p>
        <p className="text-xs text-white/50">(Ingat: jika kerucut terbalik dengan tinggi total T, air setinggi h dari puncak membentuk kerucut kecil yang sebangun. Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Jari-jari kerucut penuh:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r_{\text{penuh}} = \frac{28}{2} = 14 \text{ cm}, \quad t_{\text{penuh}} = 30 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Jari-jari kerucut pasir (sebangun):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p className="text-white/70">Pasir setinggi 20 cm dari puncak membentuk kerucut kecil sebangun:</p>
          <BlockMath math="\frac{r_{\text{pasir}}}{r_{\text{penuh}}} = \frac{t_{\text{pasir}}}{t_{\text{penuh}}} = \frac{20}{30} = \frac{2}{3}" />
          <BlockMath math="r_{\text{pasir}} = 14 \times \frac{2}{3} = \frac{28}{3} \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Volume pasir:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="V_{\text{pasir}} = \frac{1}{3}\pi r_{\text{pasir}}^2 \times t_{\text{pasir}} = \frac{1}{3} \times \frac{22}{7} \times \left(\frac{28}{3}\right)^2 \times 20" />
          <BlockMath math="= \frac{1}{3} \times \frac{22}{7} \times \frac{784}{9} \times 20 = \frac{22 \times 784 \times 20}{3 \times 7 \times 9}" />
          <BlockMath math="= \frac{344.960}{189} \approx 1.825{,}7 \text{ cm}^3" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Jari-jari pasir = <strong className="text-yellow-300">28/3 ≈ 9,33 cm</strong></p>
          <p className="text-white/80">• Volume pasir ≈ <strong className="text-yellow-300">1.825,7 cm³</strong></p>
          <p className="text-cyan-300 mt-1">💡 Kunci: gunakan sifat kesebangunan kerucut!</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */
const ExampleCard = ({ ex, idx, prefix, language }: { ex: Ex; idx: number; prefix: string; language: Language }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {levelLabel(ex.level, language)}
          </span>
        </div>
        {ex.question}
      </div>
      <button onClick={() => { playPopSound(); setShow(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50">
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? "Sembunyikan" : "Lihat Pembahasan"}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE — SLIDE LAYOUT
───────────────────────────────────────────────────────────── */
const KerucutPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const initialSlide = (() => {
    const raw = new URLSearchParams(window.location.search).get("slide");
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  })();
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const pt = pageTrans[language];
  const sections = getSections(language);

  const slides = [
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    {
      title: unsurQuizUiTrans[language].slideTitle,
      icon: "📝",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-indigo-950/50 border border-indigo-700/40 rounded-xl px-4 py-3">
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-indigo-300 font-bold text-sm">{unsurQuizUiTrans[language].headerTitle}</p>
              <p className="text-white/50 text-xs">{unsurQuizUiTrans[language].headerSub}</p>
            </div>
          </div>
          <UnsurSoalQuiz language={language} />
        </div>
      ),
    },
    {
      title: "Contoh Soal — Luas Permukaan",
      icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix="LUAS" language={language}/>)}
        </div>
      ),
    },
    {
      title: "Contoh Soal — Volume",
      icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix="VOLUME" language={language}/>)}
        </div>
      ),
    },
  ];

  const totalSlides = slides.length;
  const slide = slides[currentSlide];

  const goNext = () => { playPopSound(); setCurrentSlide(v => Math.min(v + 1, totalSlides - 1)); };
  const goPrev = () => { playPopSound(); setCurrentSlide(v => Math.max(v - 1, 0)); };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <Triangle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {pt.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{pt.subtitle}</p>

        <div className="flex items-center justify-center gap-1.5 mb-5 flex-wrap">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { playPopSound(); setCurrentSlide(i); }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide
                  ? "w-6 h-2.5 bg-primary"
                  : "w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden mb-5">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-slate-800/40">
            <span className="text-2xl">{slide.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                Slide {currentSlide + 1} / {totalSlides}
              </p>
              <h2 className="font-display text-sm font-bold text-white">{slide.title}</h2>
            </div>
          </div>
          <div className="px-5 py-5">
            {slide.content}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold font-body bg-slate-800/60 border border-slate-600 text-white/70 rounded-xl hover:bg-slate-700/60 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          <span className="text-white/30 text-xs font-body">{currentSlide + 1} / {totalSlides}</span>
          <button
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold font-body bg-primary/20 border border-primary/50 text-primary rounded-xl hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>

        <div className="text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Lengkung
          </button>
        </div>
      </div>
    </div>
  );
};

export default KerucutPage;
