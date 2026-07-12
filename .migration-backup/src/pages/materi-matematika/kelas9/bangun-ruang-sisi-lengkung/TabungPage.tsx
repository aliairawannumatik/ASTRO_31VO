import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   3D CYLINDER SVG RENDERER — style mirrors InteractiveCone3D
───────────────────────────────────────────────────────────── */
const CYL_SEGS = 28;
const CYL_R = 58;
const CYL_H = 115;
const CYL_PD = 480;
const CYL_W = 320;
const CYL_H_SVG = 290;
const CYL_CX = CYL_W / 2;
const CYL_CY = CYL_H_SVG / 2 + 10;

function cylRotPt(x: number, y: number, z: number, rx: number, ry: number) {
  const rxa = (rx * Math.PI) / 180;
  const rya = (ry * Math.PI) / 180;
  const x1 = x * Math.cos(rya) + z * Math.sin(rya);
  const z1 = -x * Math.sin(rya) + z * Math.cos(rya);
  const y2 = y * Math.cos(rxa) - z1 * Math.sin(rxa);
  const z2 = y * Math.sin(rxa) + z1 * Math.cos(rxa);
  return { x: x1, y: y2, z: z2 };
}

function cylProj(p: { x: number; y: number; z: number }) {
  const s = CYL_PD / (CYL_PD + p.z + 80);
  return { x: CYL_CX + p.x * s, y: CYL_CY + p.y * s };
}

const InteractiveCylinder3D = () => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(28);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ sx: 0, sy: 0, brx: -22, bry: 28 });

  const onMD = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, brx: rotX, bry: rotY };
  };
  const onMM = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.bry + (e.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.brx + (e.clientY - dragRef.current.sy) * 0.55);
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
    setRotX(dragRef.current.brx + (t.clientY - dragRef.current.sy) * 0.55);
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
    if (isDragging) return;
    let frameId: number;
    let lastTs = 0;
    const animate = (ts: number) => {
      if (lastTs) setRotY(prev => prev + (ts - lastTs) * 0.028);
      lastTs = ts;
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging]);

  const topVerts3D = Array.from({ length: CYL_SEGS }, (_, i) => {
    const a = (2 * Math.PI * i) / CYL_SEGS;
    return cylRotPt(Math.cos(a) * CYL_R, -CYL_H / 2, Math.sin(a) * CYL_R, rotX, rotY);
  });
  const botVerts3D = Array.from({ length: CYL_SEGS }, (_, i) => {
    const a = (2 * Math.PI * i) / CYL_SEGS;
    return cylRotPt(Math.cos(a) * CYL_R, CYL_H / 2, Math.sin(a) * CYL_R, rotX, rotY);
  });
  const topVerts2D = topVerts3D.map(cylProj);
  const botVerts2D = botVerts3D.map(cylProj);

  type Panel = { avgZ: number; visible: boolean; fill: string; stroke: string; points: string };
  const panels: Panel[] = Array.from({ length: CYL_SEGS }, (_, i) => {
    const ni = (i + 1) % CYL_SEGS;
    const t0 = topVerts3D[i], t1 = topVerts3D[ni];
    const b0 = botVerts3D[i], b1 = botVerts3D[ni];
    const p_t0 = topVerts2D[i], p_t1 = topVerts2D[ni];
    const p_b0 = botVerts2D[i], p_b1 = botVerts2D[ni];
    const avgZ = (t0.z + t1.z + b0.z + b1.z) / 4;
    const ex = p_t1.x - p_t0.x, ey = p_t1.y - p_t0.y;
    const fx = p_b0.x - p_t0.x, fy = p_b0.y - p_t0.y;
    const visible = (ex * fy - ey * fx) > 0;
    const hue = Math.floor((i / CYL_SEGS) * 60) + 180;
    return {
      avgZ,
      visible,
      fill: visible ? `hsla(${hue},80%,55%,0.88)` : `rgba(100,150,200,0.06)`,
      stroke: visible ? "#ffffff55" : "#ffffff15",
      points: `${p_t0.x},${p_t0.y} ${p_t1.x},${p_t1.y} ${p_b1.x},${p_b1.y} ${p_b0.x},${p_b0.y}`,
    };
  });

  const sortedPanels = [...panels].sort((a, b) => b.avgZ - a.avgZ);

  const topCapAvgZ = topVerts3D.reduce((s, v) => s + v.z, 0) / CYL_SEGS;
  const botCapAvgZ = botVerts3D.reduce((s, v) => s + v.z, 0) / CYL_SEGS;
  const topPolyPoints = topVerts2D.map(p => `${p.x},${p.y}`).join(" ");
  const botPolyPoints = botVerts2D.map(p => `${p.x},${p.y}`).join(" ");
  const topVisible = rotX < 10;
  const botVisible = rotX > -60;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        Drag untuk memutar · Klik dan geser untuk eksplorasi
      </p>

      <svg
        viewBox={`0 0 ${CYL_W} ${CYL_H_SVG}`}
        width="100%"
        style={{ maxWidth: CYL_W, display: "block", margin: "0 auto", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMD}
        onTouchStart={onTS}
      >
        {sortedPanels.map((p, i) =>
          p.visible && (
            <polygon key={i} points={p.points} fill={p.fill} stroke={p.stroke} strokeWidth="0.8" />
          )
        )}
        {topCapAvgZ > botCapAvgZ ? (
          <>
            {botVisible && <polygon points={botPolyPoints} fill="rgb(99,102,241)" stroke="#a5b4fc" strokeWidth="1.2" />}
            {topVisible && <polygon points={topPolyPoints} fill="rgb(99,102,241)" stroke="#a5b4fc" strokeWidth="1.2" />}
          </>
        ) : (
          <>
            {topVisible && <polygon points={topPolyPoints} fill="rgb(99,102,241)" stroke="#a5b4fc" strokeWidth="1.2" />}
            {botVisible && <polygon points={botPolyPoints} fill="rgb(99,102,241)" stroke="#a5b4fc" strokeWidth="1.2" />}
          </>
        )}
        {sortedPanels.map((p, i) =>
          !p.visible && (
            <polygon key={`g${i}`} points={p.points} fill="rgba(100,150,200,0.06)" stroke="#ffffff15" strokeWidth="0.5" />
          )
        )}
      </svg>

      <div className="flex flex-wrap gap-2 justify-center text-[10px] font-body">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: "hsl(180,80%,55%)" }}/><span className="text-white/50">Selimut</span></span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-indigo-400"/><span className="text-white/50">Tutup Atas &amp; Bawah</span></span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — UNSUR TABUNG
───────────────────────────────────────────────────────────── */
const JariJariAnimSVG = () => (
  <svg viewBox="0 0 280 160" className="w-full max-w-xs mx-auto my-2" aria-label="Jari-jari tabung">
    <defs>
      <style>{`
        @keyframes jjGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #f59e0b);}50%{stroke-opacity:0.2;filter:drop-shadow(0 0 0 #f59e0b);}}
        .jj-a{animation:jjGlow 1.5s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .pls{animation:pulse 1.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Cylinder body */}
    <ellipse cx="140" cy="50" rx="80" ry="20" fill="rgba(14,116,144,0.3)" stroke="#0891b2" strokeWidth="1.5"/>
    <rect x="60" y="50" width="160" height="80" fill="rgba(8,145,178,0.15)" stroke="none"/>
    <line x1="60" y1="50" x2="60" y2="130" stroke="#0891b2" strokeWidth="1.5"/>
    <line x1="220" y1="50" x2="220" y2="130" stroke="#0891b2" strokeWidth="1.5"/>
    <ellipse cx="140" cy="130" rx="80" ry="20" fill="rgba(14,116,144,0.3)" stroke="#0891b2" strokeWidth="1.5"/>
    {/* Animated radius */}
    <line x1="140" y1="130" x2="220" y2="130" stroke="#f59e0b" strokeWidth="3" className="jj-a"/>
    <circle cx="140" cy="130" r="4" fill="#f59e0b" className="pls"/>
    <circle cx="220" cy="130" r="4" fill="#f59e0b" className="pls"/>
    <text x="174" y="150" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="700" textAnchor="middle">r (jari-jari)</text>
    {/* Diameter arrow hint */}
    <line x1="60" y1="130" x2="220" y2="130" stroke="#fde68a" strokeWidth="1" strokeDasharray="4,3" className="pls"/>
    <text x="140" y="145" fill="#fde68a" fontSize="9" fontFamily="monospace" textAnchor="middle">d = 2r</text>
  </svg>
);

const TinggiAnimSVG = () => (
  <svg viewBox="0 0 280 196" className="w-full max-w-xs mx-auto my-2" aria-label="Tinggi tabung">
    <defs>
      <style>{`
        @keyframes tGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #22c55e);}50%{stroke-opacity:0.2;}}
        .t-a{animation:tGlow 1.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <ellipse cx="140" cy="40" rx="80" ry="20" fill="rgba(34,197,94,0.15)" stroke="#4ade80" strokeWidth="1.5"/>
    <rect x="60" y="40" width="160" height="100" fill="rgba(8,145,178,0.1)" stroke="none"/>
    <line x1="60" y1="40" x2="60" y2="140" stroke="#0891b2" strokeWidth="1.5"/>
    <line x1="220" y1="40" x2="220" y2="140" stroke="#0891b2" strokeWidth="1.5"/>
    <ellipse cx="140" cy="140" rx="80" ry="20" fill="rgba(34,197,94,0.15)" stroke="#4ade80" strokeWidth="1.5"/>
    {/* Animated height */}
    <line x1="35" y1="40" x2="35" y2="140" stroke="#22c55e" strokeWidth="3" className="t-a"/>
    <line x1="28" y1="40" x2="42" y2="40" stroke="#22c55e" strokeWidth="2"/>
    <line x1="28" y1="140" x2="42" y2="140" stroke="#22c55e" strokeWidth="2"/>
    <text x="22" y="92" fill="#22c55e" fontSize="13" fontFamily="monospace" fontWeight="700" textAnchor="middle">t</text>
    {/* Label below ellipse — tidak bertabrakan */}
    <text x="140" y="185" fill="#86efac" fontSize="10" fontFamily="monospace" textAnchor="middle">t = tinggi tabung</text>
  </svg>
);

const SelimutAnimSVG = () => (
  <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto my-2" aria-label="Selimut tabung">
    <defs>
      <style>{`
        @keyframes selGlow{0%,100%{fill-opacity:0.55;stroke-opacity:1;}50%{fill-opacity:0.12;stroke-opacity:0.3;}}
        .sel-a{animation:selGlow 1.6s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* SELIMUT — path mengikuti kurva elips atas & bawah, tanpa drop-shadow */}
    <path
      d="M 60,40 A 80,20 0 0,1 220,40 L 220,140 A 80,20 0 0,0 60,140 Z"
      fill="#a855f7"
      stroke="#a855f7"
      strokeWidth="1.5"
      className="sel-a"
    />
    {/* Rim tutup atas — hanya busur atas (tidak overlap dengan selimut) */}
    <path d="M 60,40 A 80,20 0 0,0 220,40" fill="none" stroke="#a855f740" strokeWidth="1.2"/>
    {/* Rim tutup bawah — hanya busur bawah */}
    <path d="M 60,140 A 80,20 0 0,1 220,140" fill="none" stroke="#a855f740" strokeWidth="1.2"/>
    <text x="140" y="92" fill="#e9d5ff" fontSize="11" fontFamily="monospace" fontWeight="700" textAnchor="middle">SELIMUT</text>
    <text x="140" y="108" fill="#c4b5fd" fontSize="10" fontFamily="monospace" textAnchor="middle">L = 2πr × t</text>
    <text x="140" y="165" fill="#a78bfa" fontSize="10" fontFamily="monospace" textAnchor="middle">Selimut = "kulit" tabung tanpa tutup</text>
  </svg>
);

/* Selimut dibuka → persegi panjang */
const SelimutRectAnimSVG = () => (
  <svg viewBox="0 0 290 158" className="w-full max-w-sm mx-auto my-2" aria-label="Selimut tabung dibuka menjadi persegi panjang">
    <defs>
      <style>{`
        @keyframes cylFadeOut{0%,35%{opacity:1;}55%,100%{opacity:0.28;}}
        @keyframes rectFadeIn{0%,35%{opacity:0.15;}58%,100%{opacity:1;}}
        @keyframes arrPulse{0%,100%{opacity:0.4;}47%,53%{opacity:1;}}
        .cf{animation:cylFadeOut 4.2s ease-in-out infinite;}
        .rf{animation:rectFadeIn  4.2s ease-in-out infinite;}
        .ap{animation:arrPulse   4.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* LEFT: tabung dengan selimut */}
    <g className="cf">
      <ellipse cx="46" cy="34" rx="31" ry="9"  fill="rgba(168,85,247,0.32)" stroke="#a855f7" strokeWidth="1.5"/>
      <line x1="15" y1="34" x2="15" y2="98" stroke="#7c3aed" strokeWidth="1.5"/>
      <line x1="77" y1="34" x2="77" y2="98" stroke="#7c3aed" strokeWidth="1.5"/>
      <rect x="15" y="34" width="62" height="64" fill="rgba(168,85,247,0.18)"/>
      <ellipse cx="46" cy="98" rx="31" ry="9"  fill="rgba(168,85,247,0.42)" stroke="#a855f7" strokeWidth="1.5"/>
      <text x="46" y="70" fill="#e9d5ff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="700">SELIMUT</text>
      <text x="46" y="118" fill="#a78bfa" fontSize="7" fontFamily="monospace" textAnchor="middle">tabung</text>
    </g>
    {/* Arrow */}
    <g className="ap">
      <line x1="90" y1="66" x2="112" y2="66" stroke="#64748b" strokeWidth="1.8"/>
      <polygon points="110,62 118,66 110,70" fill="#64748b"/>
      <text x="104" y="79" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">dibuka</text>
    </g>
    {/* RIGHT: persegi panjang selimut */}
    <g className="rf">
      <rect x="126" y="28" width="122" height="76" fill="rgba(168,85,247,0.26)" stroke="#a855f7" strokeWidth="2" rx="2"/>
      {/* Dimensi atas: 2πr */}
      <line x1="126" y1="18" x2="248" y2="18" stroke="#f59e0b" strokeWidth="1.6"/>
      <line x1="126" y1="13" x2="126" y2="23" stroke="#f59e0b" strokeWidth="1.6"/>
      <line x1="248" y1="13" x2="248" y2="23" stroke="#f59e0b" strokeWidth="1.6"/>
      <text x="187" y="14" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="700" textAnchor="middle">2πr</text>
      {/* Dimensi kanan: t */}
      <line x1="256" y1="28" x2="256" y2="104" stroke="#22c55e" strokeWidth="1.6"/>
      <line x1="251" y1="28"  x2="261" y2="28"  stroke="#22c55e" strokeWidth="1.6"/>
      <line x1="251" y1="104" x2="261" y2="104" stroke="#22c55e" strokeWidth="1.6"/>
      <text x="269" y="70" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="700" textAnchor="start">t</text>
      {/* Label dalam kotak */}
      <text x="187" y="65" fill="#e9d5ff" fontSize="8"  fontFamily="monospace" textAnchor="middle" fontWeight="700">SELIMUT</text>
      <text x="187" y="77" fill="#c4b5fd" fontSize="7.5" fontFamily="monospace" textAnchor="middle">= persegi panjang</text>
      {/* Rumus */}
      <text x="187" y="148" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">L = 2πr × t</text>
    </g>
  </svg>
);

/* Sisi tabung — tiga sisi menyala bergantian */
const SisiAnimSVG = () => (
  <svg viewBox="0 0 280 188" className="w-full max-w-xs mx-auto my-2" aria-label="Tiga sisi tabung">
    <defs>
      <style>{`
        @keyframes gs1{0%,5%{opacity:1;filter:drop-shadow(0 0 9px #a855f7);}34%,100%{opacity:0.15;filter:none;}}
        @keyframes gs2{0%,34%{opacity:0.15;filter:none;}39%,63%{opacity:1;filter:drop-shadow(0 0 9px #34d399);}68%,100%{opacity:0.15;filter:none;}}
        @keyframes gs3{0%,68%{opacity:0.15;filter:none;}73%,95%{opacity:1;filter:drop-shadow(0 0 9px #818cf8);}100%{opacity:0.15;filter:none;}}
        @keyframes gl1{0%,5%{opacity:1;}34%,100%{opacity:0.15;}}
        @keyframes gl2{0%,34%{opacity:0.15;}39%,63%{opacity:1;}68%,100%{opacity:0.15;}}
        @keyframes gl3{0%,68%{opacity:0.15;}73%,95%{opacity:1;}100%{opacity:0.15;}}
        .s1g{animation:gs1 4.5s ease-in-out infinite;}
        .s2g{animation:gs2 4.5s ease-in-out infinite;}
        .s3g{animation:gs3 4.5s ease-in-out infinite;}
        .l1g{animation:gl1 4.5s ease-in-out infinite;}
        .l2g{animation:gl2 4.5s ease-in-out infinite;}
        .l3g{animation:gl3 4.5s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Outline diam tabung */}
    <line x1="80" y1="62" x2="80"  y2="155" stroke="#1e293b" strokeWidth="1.4"/>
    <line x1="200" y1="62" x2="200" y2="155" stroke="#1e293b" strokeWidth="1.4"/>
    {/* SISI 1 — Selimut (ungu) */}
    <rect x="80" y="62" width="120" height="93" fill="rgba(168,85,247,0.42)" stroke="#a855f7" strokeWidth="2.8" className="s1g"/>
    {/* SISI 2 — Alas (hijau) */}
    <ellipse cx="140" cy="155" rx="60" ry="16" fill="rgba(52,211,153,0.42)" stroke="#34d399" strokeWidth="2.8" className="s2g"/>
    {/* SISI 3 — Tutup (indigo) */}
    <ellipse cx="140" cy="62"  rx="60" ry="16" fill="rgba(99,102,241,0.52)" stroke="#818cf8" strokeWidth="2.8" className="s3g"/>
    {/* Label menyala */}
    <text x="140" y="112" fill="#e9d5ff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="l1g">① Selimut (lengkung)</text>
    <text x="140" y="175" fill="#86efac" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="l2g">② Alas (lingkaran bawah)</text>
    <text x="140" y="48"  fill="#a5b4fc" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="l3g">③ Tutup (lingkaran atas)</text>
  </svg>
);

/* Rusuk tabung — dua rusuk menyala bergantian */
const RusukAnimSVG = () => (
  <svg viewBox="0 0 280 188" className="w-full max-w-xs mx-auto my-2" aria-label="Dua rusuk tabung">
    <defs>
      <style>{`
        @keyframes rr1{0%,42%{stroke-opacity:1;filter:drop-shadow(0 0 9px #f59e0b);}52%,92%{stroke-opacity:0.15;filter:none;}100%{stroke-opacity:1;}}
        @keyframes rr2{0%,42%{stroke-opacity:0.15;filter:none;}52%,92%{stroke-opacity:1;filter:drop-shadow(0 0 9px #38bdf8);}100%{stroke-opacity:0.15;}}
        @keyframes rl1{0%,42%{opacity:1;}52%,100%{opacity:0.15;}}
        @keyframes rl2{0%,48%{opacity:0.15;}52%,92%{opacity:1;}97%,100%{opacity:0.15;}}
        .rr1g{animation:rr1 3.2s ease-in-out infinite;}
        .rr2g{animation:rr2 3.2s ease-in-out infinite;}
        .rl1g{animation:rl1 3.2s ease-in-out infinite;}
        .rl2g{animation:rl2 3.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Badan tabung (redup) */}
    <line x1="80" y1="62" x2="80"  y2="155" stroke="#1e293b" strokeWidth="1.4"/>
    <line x1="200" y1="62" x2="200" y2="155" stroke="#1e293b" strokeWidth="1.4"/>
    <rect x="80" y="62" width="120" height="93" fill="rgba(8,145,178,0.07)" stroke="none"/>
    <ellipse cx="140" cy="62"  rx="60" ry="16" fill="rgba(15,23,42,0.55)" stroke="#1e293b" strokeWidth="1"/>
    <ellipse cx="140" cy="155" rx="60" ry="16" fill="rgba(15,23,42,0.55)" stroke="#1e293b" strokeWidth="1"/>
    {/* RUSUK 1 — lingkaran atas (amber) */}
    <ellipse cx="140" cy="62"  rx="60" ry="16" fill="none" stroke="#f59e0b" strokeWidth="4" className="rr1g"/>
    {/* RUSUK 2 — lingkaran bawah (biru) */}
    <ellipse cx="140" cy="155" rx="60" ry="16" fill="none" stroke="#38bdf8" strokeWidth="4" className="rr2g"/>
    {/* Label */}
    <text x="140" y="47"  fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="rl1g">① Rusuk atas (tepi tutup)</text>
    <text x="140" y="178" fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700" className="rl2g">② Rusuk bawah (tepi alas)</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   VOLUME TABUNG — animated water-fill visualization
───────────────────────────────────────────────────────────── */
const WaterTabungAnimation = () => {
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

  const CX = 112, RX = 64, RY = 17;
  const CY_TOP = 50, CY_BOT = 175;
  const CYL_H_PX = CY_BOT - CY_TOP;

  const waterY      = CY_BOT - fill * CYL_H_PX;
  const pct         = Math.round(fill * 100);
  const isEmpty     = fill < 0.005;
  const isFull      = fill > 0.995;
  const showSurface = !isEmpty && !isFull;
  const waveOffset  = showSurface ? wave : 0;

  const barX = 200, barY = CY_TOP, barW = 13, barH = CYL_H_PX;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 0 280 215" className="w-full max-w-sm mx-auto my-2"
      aria-label="Animasi tabung diisi air">
      <defs>
        <filter id="wBloomT">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="cylBodyClip">
          <rect x={CX - RX} y={CY_TOP} width={RX * 2} height={CYL_H_PX} />
        </clipPath>
      </defs>

      {/* ── Bottom cap (floor) ── */}
      <ellipse
        cx={CX} cy={CY_BOT} rx={RX} ry={RY}
        fill={isEmpty ? "#0f172a" : "#1e3a8a"}
        stroke="#0891b2" strokeWidth="2"
      />

      {/* ── Water body ── */}
      {!isEmpty && (
        <rect
          x={CX - RX} y={waterY}
          width={RX * 2} height={CY_BOT - waterY}
          fill="#1d4ed8" fillOpacity={0.85}
          clipPath="url(#cylBodyClip)"
        />
      )}

      {/* ── Water surface ellipse with subtle wave ── */}
      {showSurface && (
        <>
          <ellipse
            cx={CX} cy={waterY + waveOffset} rx={RX} ry={RY}
            fill="#7dd3fc" fillOpacity={0.45}
          />
          <ellipse
            cx={CX} cy={waterY + waveOffset} rx={RX} ry={RY}
            fill="none" stroke="#bae6fd" strokeWidth="2"
            strokeDasharray="6,3" opacity={0.85}
          />
        </>
      )}

      {/* ── Cylinder side lines ── */}
      <line x1={CX - RX} y1={CY_TOP} x2={CX - RX} y2={CY_BOT} stroke="#0891b2" strokeWidth="2" />
      <line x1={CX + RX} y1={CY_TOP} x2={CX + RX} y2={CY_BOT} stroke="#0891b2" strokeWidth="2" />

      {/* ── Top cap ── */}
      <ellipse
        cx={CX} cy={CY_TOP} rx={RX} ry={RY}
        fill={isFull ? "#1d4ed8" : "#0f172a"}
        fillOpacity={isFull ? 0.85 : 0.35}
        stroke="#67e8f9" strokeWidth="2"
      />

      {/* ── r dimension on top cap ── */}
      <line x1={CX} y1={CY_TOP} x2={CX + RX} y2={CY_TOP}
        stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.85"/>
      <circle cx={CX} cy={CY_TOP} r="3" fill="#f59e0b" />
      <circle cx={CX + RX} cy={CY_TOP} r="3" fill="#f59e0b" />
      <text x={CX + RX / 2} y={CY_TOP - 6}
        fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>

      {/* ── t dimension on left side ── */}
      <line x1={CX - RX - 13} y1={CY_TOP} x2={CX - RX - 13} y2={CY_BOT}
        stroke="#22c55e" strokeWidth="1.5" />
      <line x1={CX - RX - 8} y1={CY_TOP} x2={CX - RX - 18} y2={CY_TOP}
        stroke="#22c55e" strokeWidth="1.5" />
      <line x1={CX - RX - 8} y1={CY_BOT} x2={CX - RX - 18} y2={CY_BOT}
        stroke="#22c55e" strokeWidth="1.5" />
      <text x={CX - RX - 28} y={(CY_TOP + CY_BOT) / 2 + 4}
        fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>

      {/* ── TUTUP label above top cap ── */}
      <text x={CX} y={CY_TOP - RY - 5}
        fill="#a5f3fc" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TUTUP (πr²)</text>

      {/* ── Progress bar ── */}
      <rect x={barX} y={barY} width={barW} height={barH}
        fill="#0f172a" stroke="#334155" strokeWidth="1.2" rx="3"/>
      {!isEmpty && (
        <rect x={barX} y={barY + barH - filledH} width={barW} height={filledH}
          fill="#2563eb" fillOpacity={0.88} rx="3"/>
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
        filter="url(#wBloomT)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x={CX} y={212}
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloomT)">
        V = πr²t
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   CYLINDER NET ANIMATION — tabung dibongkar menjadi jaring-jaring
   Layout (viewBox 0 0 400 385):
     Top circle  : cx=200 cy=60  r=52  (net)  → assembled at cy=120, ellipse rx=70 ry=18
     Body rect   : x=74 y=120 w=252 h=120     → assembled scaleX(0.556) → w=140 x=130..270
     Bottom circle: cx=200 cy=300 r=52 (net)  → assembled at cy=240, ellipse rx=70 ry=18
   CSS transform-box:fill-box + transform-origin:center center allows clean scale/translate.
───────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────
   CYLINDER NET ANIMATION — canvas peeling, mirrors ConeNetAnimation
   N=60 quad strips peel left→right: cylinder selimut → rectangle
───────────────────────────────────────────────────────────── */
const CylinderNetAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [animState, setAnimState] = useState<'idle' | 'playing' | 'done'>('idle');

  const DURATION = 4800;
  const r = 42, h = 100, N = 60;
  const CX = 200, TOP_Y = 100, BOT_Y = 200, RY = 13;
  const CAP_R = 38;
  const RECT_W = 2 * Math.PI * r;
  const RECT_L = CX - RECT_W / 2;
  const TOP_CAP_CY = TOP_Y - CAP_R - 8;
  const BOT_CAP_CY = BOT_Y + CAP_R + 8;

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
    const ylw = (a: number) => `rgba(250,204,21,${a})`;

    const grd = ctx.createRadialGradient(CX, TOP_Y + h / 2, 10, CX, TOP_Y + h / 2, 200);
    grd.addColorStop(0, 'rgba(168,85,247,0.07)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    type QD = {
      tl: [number,number]; tr: [number,number];
      br: [number,number]; bl: [number,number];
      alpha: number; hue: number; lum: number;
      isFront: boolean; easeT: number;
    };
    const quads: QD[] = [];

    for (let i = 0; i < N; i++) {
      const a0 = (2 * Math.PI * i) / N;
      const a1 = (2 * Math.PI * (i + 1)) / N;
      const aMid = (a0 + a1) / 2;

      const tlX3 = CX + r * Math.cos(a0), tlY3 = TOP_Y + RY * Math.sin(a0);
      const trX3 = CX + r * Math.cos(a1), trY3 = TOP_Y + RY * Math.sin(a1);
      const brX3 = CX + r * Math.cos(a1), brY3 = BOT_Y + RY * Math.sin(a1);
      const blX3 = CX + r * Math.cos(a0), blY3 = BOT_Y + RY * Math.sin(a0);

      const x0 = RECT_L + (RECT_W * i) / N;
      const x1 = RECT_L + (RECT_W * (i + 1)) / N;

      const tStart = (i / N) * 0.5;
      const rawT = clamp((t - tStart) / 0.5);
      const easeT = easeIO(rawT);

      const tl: [number,number] = [lerp(tlX3, x0, easeT), lerp(tlY3, TOP_Y, easeT)];
      const tr: [number,number] = [lerp(trX3, x1, easeT), lerp(trY3, TOP_Y, easeT)];
      const br: [number,number] = [lerp(brX3, x1, easeT), lerp(brY3, BOT_Y, easeT)];
      const bl: [number,number] = [lerp(blX3, x0, easeT), lerp(blY3, BOT_Y, easeT)];

      const brightness = 0.25 + 0.75 * ((1 + Math.cos(aMid - Math.PI / 6)) / 2);
      const isFront = Math.sin(aMid) <= 0;
      const hue = 252 + (i / N) * 38;
      const baseLum = 20 + brightness * 32;
      const flatLum = 34;
      let alpha: number;
      if (easeT > 0.05) alpha = 0.9;
      else if (isFront) alpha = 0.88;
      else alpha = 0.07;

      quads.push({ tl, tr, br, bl, alpha, hue, lum: lerp(baseLum, flatLum, easeT), isFront, easeT });
    }

    const drawQ = (qd: QD) => {
      ctx.beginPath();
      ctx.moveTo(qd.tl[0], qd.tl[1]);
      ctx.lineTo(qd.tr[0], qd.tr[1]);
      ctx.lineTo(qd.br[0], qd.br[1]);
      ctx.lineTo(qd.bl[0], qd.bl[1]);
      ctx.closePath();
      ctx.fillStyle = `hsla(${qd.hue},72%,${qd.lum}%,${qd.alpha})`;
      ctx.strokeStyle = `hsla(${qd.hue},72%,${Math.min(70, qd.lum + 20)}%,${qd.alpha * 0.35})`;
      ctx.lineWidth = 0.5;
      ctx.fill();
      ctx.stroke();
    };

    quads.filter(q => !q.isFront && q.easeT < 0.05).forEach(drawQ);
    quads.filter(q => q.isFront || q.easeT >= 0.05).forEach(drawQ);

    // Cut-line flash at seam (right side of cylinder)
    if (t < 0.20) {
      const ca = 1 - t / 0.20;
      ctx.strokeStyle = ylw(ca * 0.92);
      ctx.lineWidth = 2.2;
      ctx.setLineDash([5, 3]);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#facc15';
      ctx.beginPath();
      ctx.moveTo(CX + r, TOP_Y);
      ctx.lineTo(CX + r, BOT_Y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
      ctx.fillStyle = ylw(ca * 0.85);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('← garis potong', CX + r + 4, TOP_Y + h / 2);
    }

    // Assembled rims — fade out as peeling starts
    if (t < 0.60) {
      const ea = t < 0.25 ? 1 : 1 - clamp((t - 0.25) / 0.35);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(CX, TOP_Y, r, RY, 0, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(103,232,249,${0.22 * ea})`;
      ctx.strokeStyle = `rgba(103,232,249,${ea * 0.82})`;
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(CX, BOT_Y, r, RY, 0, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(134,239,172,${0.22 * ea})`;
      ctx.strokeStyle = `rgba(134,239,172,${ea * 0.75})`;
      ctx.fill(); ctx.stroke();
    }

    // Tutup atas — from ellipse at TOP_Y → circle at TOP_CAP_CY
    if (t > 0.55) {
      const capT = easeIO(clamp((t - 0.55) / 0.45));
      const capY = lerp(TOP_Y, TOP_CAP_CY, capT);
      const capRY2 = lerp(RY, CAP_R, capT);
      ctx.beginPath();
      ctx.ellipse(CX, capY, CAP_R, capRY2, 0, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(103,232,249,0.28)';
      ctx.strokeStyle = `rgba(103,232,249,${0.5 + capT * 0.5})`;
      ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
      if (capT > 0.5) {
        const la = clamp((capT - 0.5) / 0.5);
        ctx.fillStyle = ylw(la);
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('TUTUP ATAS', CX + CAP_R + 8, capY - 2);
        ctx.fillStyle = ylw(la * 0.75);
        ctx.font = '8px monospace';
        ctx.fillText('lingkaran, r', CX + CAP_R + 8, capY + 10);
        if (la > 0.3) {
          const la2 = clamp((la - 0.3) / 0.7);
          ctx.strokeStyle = ylw(la2 * 0.9);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(CX, capY); ctx.lineTo(CX + CAP_R, capY);
          ctx.stroke();
          ctx.fillStyle = ylw(la2);
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('r', CX + CAP_R / 2, capY - 4);
        }
      }
    }

    // Tutup bawah — from ellipse at BOT_Y → circle at BOT_CAP_CY
    if (t > 0.62) {
      const capT = easeIO(clamp((t - 0.62) / 0.38));
      const capY = lerp(BOT_Y, BOT_CAP_CY, capT);
      const capRY2 = lerp(RY, CAP_R, capT);
      ctx.beginPath();
      ctx.ellipse(CX, capY, CAP_R, capRY2, 0, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(134,239,172,0.28)';
      ctx.strokeStyle = `rgba(134,239,172,${0.5 + capT * 0.5})`;
      ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
      if (capT > 0.5) {
        const la = clamp((capT - 0.5) / 0.5);
        ctx.fillStyle = ylw(la);
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('TUTUP BAWAH', CX + CAP_R + 8, capY - 2);
        ctx.fillStyle = ylw(la * 0.75);
        ctx.font = '8px monospace';
        ctx.fillText('lingkaran, r', CX + CAP_R + 8, capY + 10);
        if (la > 0.3) {
          const la2 = clamp((la - 0.3) / 0.7);
          ctx.strokeStyle = ylw(la2 * 0.9);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(CX, capY); ctx.lineTo(CX + CAP_R, capY);
          ctx.stroke();
          ctx.fillStyle = ylw(la2);
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('r', CX + CAP_R / 2, capY - 4);
        }
      }
    }

    // End labels — all yellow
    if (t > 0.80) {
      const la = clamp((t - 0.80) / 0.20);

      // Width arrow ← 2πr →
      const arrY = TOP_Y - 20;
      ctx.strokeStyle = ylw(la * 0.8);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(RECT_L, arrY); ctx.lineTo(RECT_L + RECT_W, arrY);
      ctx.moveTo(RECT_L, arrY - 4); ctx.lineTo(RECT_L, arrY + 4);
      ctx.moveTo(RECT_L + RECT_W, arrY - 4); ctx.lineTo(RECT_L + RECT_W, arrY + 4);
      ctx.stroke();
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('← 2πr (keliling alas) →', CX, arrY - 4);

      // Height t
      const tX = RECT_L + RECT_W + 14;
      ctx.strokeStyle = ylw(la * 0.8);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tX, TOP_Y); ctx.lineTo(tX, BOT_Y);
      ctx.moveTo(tX - 4, TOP_Y); ctx.lineTo(tX + 4, TOP_Y);
      ctx.moveTo(tX - 4, BOT_Y); ctx.lineTo(tX + 4, BOT_Y);
      ctx.stroke();
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('t', tX + 7, TOP_Y + h / 2 + 4);

      // SELIMUT label inside rectangle
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SELIMUT', CX, TOP_Y + h / 2 - 8);
      ctx.fillStyle = ylw(la * 0.75);
      ctx.font = '8px monospace';
      ctx.fillText('Persegi Panjang', CX, TOP_Y + h / 2 + 6);
      ctx.fillText('p = 2πr  ·  l = t', CX, TOP_Y + h / 2 + 18);

      // Success
      ctx.fillStyle = ylw(la);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✓ Jaring-jaring = SELIMUT + TUTUP ATAS + TUTUP BAWAH', CX, canvas.height - 8);
    }

    // Progress bar
    if (t > 0 && t < 1) {
      const barY = canvas.height - 5;
      ctx.fillStyle = 'rgba(71,85,105,0.45)';
      ctx.fillRect(10, barY, canvas.width - 20, 3);
      ctx.fillStyle = 'rgba(168,85,247,0.88)';
      ctx.fillRect(10, barY, (canvas.width - 20) * t, 3);
    }
  }, [CX, TOP_Y, BOT_Y, RY, CAP_R, TOP_CAP_CY, BOT_CAP_CY, N, r, h, RECT_W, RECT_L]);

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
        Animasi <span className="text-purple-300 font-bold">slow motion</span> — selimut tabung dikupas lembaran demi lembaran menjadi persegi panjang
      </p>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={310}
          style={{ width: '100%', display: 'block', borderRadius: 10 }}
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={startAnimation}
          disabled={animState === 'playing'}
          className="px-4 py-2 text-sm font-bold bg-purple-700/60 border border-purple-500 text-purple-200 rounded-lg hover:bg-purple-600/60 transition-colors cursor-pointer font-body disabled:opacity-40"
        >
          {animState === 'idle' ? '▶ Mulai Animasi' : animState === 'playing' ? '⏳ Mengupas...' : '▶ Putar Ulang'}
        </button>
        <button
          onClick={resetAnimation}
          disabled={animState === 'idle'}
          className="px-4 py-2 text-sm font-bold bg-slate-700/60 border border-slate-500 text-slate-200 rounded-lg hover:bg-slate-600/60 transition-colors cursor-pointer font-body disabled:opacity-40"
        >
          ↺ Reset
        </button>
      </div>
      <div className="flex flex-wrap gap-3 justify-center text-[10px] font-body">
        {[
          { color: '#c084fc', label: 'Selimut (persegi panjang)' },
          { color: '#67e8f9', label: 'Tutup Atas (lingkaran)' },
          { color: '#86efac', label: 'Tutup Bawah (lingkaran)' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
            <span className="text-white/50">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Slide 1 translations ─────────────────────────────────── */
const slide1Trans = {
  id: {
    title: "Pengertian Tabung",
    intro1: "Bayangkan kaleng minuman, drum musik, atau pipa air — semuanya punya bentuk yang sama: dua lingkaran di atas dan bawah, dihubungkan oleh satu permukaan melengkung. Itulah yang disebut",
    introBold: "tabung",
    intro2: "(atau silinder)!",
    defLabel: "📌 Definisi Tabung:",
    defText1: "Tabung adalah bangun ruang tiga dimensi yang dibentuk oleh",
    defBold1: "dua lingkaran sejajar dan kongruen",
    defText2: "(sama besar) sebagai alas dan tutup, yang dihubungkan oleh sebuah permukaan melengkung yang disebut",
    defBold2: "selimut tabung",
    defText3: ".",
    realWorldTitle: "Benda Berbentuk Tabung di Kehidupan Sehari-hari",
    imgLabels: ["Kaleng Sarden", "Kaleng Biskuit", "Kaleng Susu", "Kendang", "Bedug", "Tong / Drum", "Gelas Silindris", "Gedung Silindris"],
  },
  en: {
    title: "Definition of Cylinder",
    intro1: "Imagine a beverage can, a musical drum, or a water pipe — they all share the same shape: two circles on top and bottom, connected by a curved surface. That's what we call a",
    introBold: "cylinder",
    intro2: "!",
    defLabel: "📌 Definition of Cylinder:",
    defText1: "A cylinder is a three-dimensional solid formed by",
    defBold1: "two parallel and congruent circles",
    defText2: "(equal in size) as its base and top, connected by a curved surface called the",
    defBold2: "lateral surface",
    defText3: ".",
    realWorldTitle: "Cylinder-Shaped Objects in Daily Life",
    imgLabels: ["Sardine Can", "Biscuit Tin", "Milk Can", "Kendang Drum", "Bedug Drum", "Barrel / Drum", "Cylindrical Glass", "Cylindrical Building"],
  },
  ja: {
    title: "円柱の定義",
    intro1: "飲み物の缶、太鼓、水道管を想像してください。すべて同じ形です：上下に二つの円があり、曲面でつながっています。これが",
    introBold: "円柱",
    intro2: "（シリンダー）です！",
    defLabel: "📌 円柱の定義：",
    defText1: "円柱は、底面と頂面として",
    defBold1: "二つの平行で合同な円",
    defText2: "（同じ大きさ）を持ち、",
    defBold2: "側面",
    defText3: "と呼ばれる曲面でつなぐ三次元の立体です。",
    realWorldTitle: "身近にある円柱形のもの",
    imgLabels: ["いわし缶", "ビスケット缶", "ミルク缶", "クンダン太鼓", "ブドゥック太鼓", "たる・ドラム缶", "円筒形グラス", "円筒形ビル"],
  },
};

/* ── Slide 2 translations ─────────────────────────────────── */
const slide2Trans = {
  id: {
    title: "Unsur-Unsur Tabung",
    intro: "Sebelum menghitung luas dan volume, kita perlu mengenal bagian-bagian tabung terlebih dahulu. Setiap unsur punya nama dan peran penting dalam rumus!",
    diagramTitle: "📌 Diagram Unsur-Unsur Tabung",
    svgRadiusSub: "(jari-jari)",
    svgHeightSub: "(tinggi)",
    svgTopLabel: "TUTUP",
    svgTopSub: "(atas)",
    svgBaseLabel: "ALAS",
    svgBaseSub: "(bawah)",
    svgMantleLabel: "SELIMUT",
    svgMantleSub: "(lengkung)",
    sisiTitle: "Sisi Tabung —",
    sisiCount: "3 sisi",
    sisiSub: "Permukaan yang membungkus tabung",
    sisiItem1: "Selimut",
    sisiItem1desc: "permukaan lengkung (kulit tabung)",
    sisiItem2: "Alas",
    sisiItem2desc: "lingkaran di bagian bawah",
    sisiItem3: "Tutup",
    sisiItem3desc: "lingkaran di bagian atas",
    sisiTotalLabel: "Total sisi =",
    rusukTitle: "Rusuk Tabung —",
    rusukCount: "2 rusuk",
    rusukSub: "Tepi / batas pertemuan antar sisi",
    rusukItem1: "Rusuk atas",
    rusukItem1desc: "lingkaran tepi tutup",
    rusukItem2: "Rusuk bawah",
    rusukItem2desc: "lingkaran tepi alas",
    rusukNote1: "💡 Tabung",
    rusukNoteBold: "tidak punya rusuk lurus",
    rusukNote2: "— berbeda dengan kubus/balok!",
    rusukTotalLabel: "Total rusuk =",
    rusukVerticesLabel: "Titik sudut =",
    rTitle: "Jari-jari (r)",
    rSub: "Setengah diameter lingkaran alas/tutup",
    rDesc1a: "• Diukur dari",
    rDesc1b: "titik pusat",
    rDesc1c: "hingga tepi lingkaran.",
    rDesc2a: "• Bersama tinggi, menentukan",
    rDesc2b: "semua rumus tabung",
    rDesc2c: ".",
    rRelLabel: "• Hubungan:",
    tTitle: "Tinggi (t)",
    tSub: "Jarak tegak lurus antara alas dan tutup",
    tDesc1a: "• Selalu",
    tDesc1b: "tegak lurus",
    tDesc1c: "terhadap alas dan tutup.",
    tDesc2: "• Digunakan di rumus luas selimut dan volume.",
    selTitle: "Selimut Tabung",
    selSub: "Permukaan lengkung yang membungkus sisi tabung",
    selUnfold: "↓ Jika dibuka dan diratakan:",
    selDesc1a: "• Dibuka → berbentuk",
    selDesc1b: "persegi panjang",
    selDesc1c: "dengan:",
    selDesc2: "— panjang = keliling lingkaran =",
    selDesc3: "— lebar = tinggi tabung =",
    selDesc4: "• Luas selimut =",
    alasTitle: "Alas",
    alasDesc1: "Lingkaran di bagian",
    alasDesc2: "bawah",
    tutupTitle: "Tutup",
    tutupDesc1: "Lingkaran di bagian",
    tutupDesc2: "atas",
    thUnsur: "Unsur",
    thNilai: "Nilai / Simbol",
    thKet: "Keterangan",
    rows: [
      ["Sisi",        "3",         "Selimut + Alas + Tutup"],
      ["Rusuk",       "2",         "Lingkaran atas & bawah"],
      ["Titik sudut", "0",         "Tidak ada titik sudut"],
      ["Jari-jari",   "r",         "Pusat → tepi lingkaran"],
      ["Diameter",    "d = 2r",    "Garis tengah lingkaran"],
      ["Tinggi",      "t",         "Jarak tegak lurus alas ke tutup"],
      ["Alas/Tutup",  "L₀ = πr²", "Luas tiap lingkaran"],
      ["Selimut",     "Ls = 2πrt", "Permukaan lengkung (kulit)"],
    ] as [string, string, string][],
    tipBold: "💡 Kunci:",
    tipText1: "Semua rumus tabung hanya butuh",
    tipAnd: "dan",
    tipText2: "Ingat:",
    tipCount: "3 sisi, 2 rusuk, 0 titik sudut",
  },
  en: {
    title: "Elements of a Cylinder",
    intro: "Before calculating surface area and volume, we need to know the parts of a cylinder. Each element has a name and plays an important role in the formulas!",
    diagramTitle: "📌 Diagram of Cylinder Elements",
    svgRadiusSub: "(radius)",
    svgHeightSub: "(height)",
    svgTopLabel: "TOP",
    svgTopSub: "(cap)",
    svgBaseLabel: "BASE",
    svgBaseSub: "(bottom)",
    svgMantleLabel: "LATERAL",
    svgMantleSub: "(curved)",
    sisiTitle: "Cylinder Faces —",
    sisiCount: "3 faces",
    sisiSub: "Surfaces enclosing the cylinder",
    sisiItem1: "Lateral surface",
    sisiItem1desc: "curved surface (skin)",
    sisiItem2: "Base",
    sisiItem2desc: "circle at the bottom",
    sisiItem3: "Top",
    sisiItem3desc: "circle at the top",
    sisiTotalLabel: "Total faces =",
    rusukTitle: "Cylinder Edges —",
    rusukCount: "2 edges",
    rusukSub: "Edge / boundary between faces",
    rusukItem1: "Top edge",
    rusukItem1desc: "circle at top rim",
    rusukItem2: "Bottom edge",
    rusukItem2desc: "circle at base rim",
    rusukNote1: "💡 A cylinder",
    rusukNoteBold: "has no straight edges",
    rusukNote2: "— unlike a cube or cuboid!",
    rusukTotalLabel: "Total edges =",
    rusukVerticesLabel: "Vertices =",
    rTitle: "Radius (r)",
    rSub: "Half the diameter of the base/top circle",
    rDesc1a: "• Measured from the",
    rDesc1b: "center",
    rDesc1c: "to the edge of the circle.",
    rDesc2a: "• Together with height, it determines",
    rDesc2b: "all cylinder formulas",
    rDesc2c: ".",
    rRelLabel: "• Relationship:",
    tTitle: "Height (t)",
    tSub: "Perpendicular distance between base and top",
    tDesc1a: "• Always",
    tDesc1b: "perpendicular",
    tDesc1c: "to the base and top.",
    tDesc2: "• Used in the lateral surface area and volume formulas.",
    selTitle: "Lateral Surface",
    selSub: "Curved surface wrapping the cylinder",
    selUnfold: "↓ If unrolled and flattened:",
    selDesc1a: "• Unrolled → forms a",
    selDesc1b: "rectangle",
    selDesc1c: "with:",
    selDesc2: "— length = circumference =",
    selDesc3: "— width = cylinder height =",
    selDesc4: "• Lateral area =",
    alasTitle: "Base",
    alasDesc1: "Circle at the",
    alasDesc2: "bottom",
    tutupTitle: "Top",
    tutupDesc1: "Circle at the",
    tutupDesc2: "top",
    thUnsur: "Element",
    thNilai: "Value / Symbol",
    thKet: "Description",
    rows: [
      ["Faces",       "3",         "Lateral + Base + Top"],
      ["Edges",       "2",         "Top & bottom circles"],
      ["Vertices",    "0",         "No vertices"],
      ["Radius",      "r",         "Center → edge of circle"],
      ["Diameter",    "d = 2r",    "Diameter of circle"],
      ["Height",      "t",         "Perpendicular dist. base to top"],
      ["Base/Top",    "L₀ = πr²", "Area of each circle"],
      ["Lateral",     "Ls = 2πrt", "Curved surface (skin)"],
    ] as [string, string, string][],
    tipBold: "💡 Key:",
    tipText1: "All cylinder formulas only need",
    tipAnd: "and",
    tipText2: "Remember:",
    tipCount: "3 faces, 2 edges, 0 vertices",
  },
  ja: {
    title: "円柱の要素",
    intro: "面積と体積を計算する前に、円柱の各部位を知る必要があります。それぞれの要素には名前があり、公式で重要な役割を持っています！",
    diagramTitle: "📌 円柱の要素図",
    svgRadiusSub: "（半径）",
    svgHeightSub: "（高さ）",
    svgTopLabel: "頂面",
    svgTopSub: "（上）",
    svgBaseLabel: "底面",
    svgBaseSub: "（下）",
    svgMantleLabel: "側面",
    svgMantleSub: "（曲面）",
    sisiTitle: "円柱の面 —",
    sisiCount: "3面",
    sisiSub: "円柱を包む面",
    sisiItem1: "側面",
    sisiItem1desc: "曲面（外皮）",
    sisiItem2: "底面",
    sisiItem2desc: "下の円",
    sisiItem3: "頂面",
    sisiItem3desc: "上の円",
    sisiTotalLabel: "面の合計 =",
    rusukTitle: "円柱の辺 —",
    rusukCount: "2辺",
    rusukSub: "面と面の境界",
    rusukItem1: "上の辺",
    rusukItem1desc: "頂面縁の円",
    rusukItem2: "下の辺",
    rusukItem2desc: "底面縁の円",
    rusukNote1: "💡 円柱には",
    rusukNoteBold: "直線の辺がない",
    rusukNote2: "— 立方体や直方体とは異なります！",
    rusukTotalLabel: "辺の合計 =",
    rusukVerticesLabel: "頂点の合計 =",
    rTitle: "半径 (r)",
    rSub: "底面・頂面の円の直径の半分",
    rDesc1a: "•",
    rDesc1b: "中心点",
    rDesc1c: "から円の端まで測ります。",
    rDesc2a: "• 高さとともに、",
    rDesc2b: "すべての円柱の公式",
    rDesc2c: "を決定します。",
    rRelLabel: "• 関係：",
    tTitle: "高さ (t)",
    tSub: "底面と頂面の間の垂直距離",
    tDesc1a: "• 常に底面と頂面に対して",
    tDesc1b: "垂直",
    tDesc1c: "です。",
    tDesc2: "• 側面積と体積の公式で使われます。",
    selTitle: "側面（円柱）",
    selSub: "円柱を包む曲面",
    selUnfold: "↓ 展開すると：",
    selDesc1a: "• 展開すると →",
    selDesc1b: "長方形",
    selDesc1c: "になります：",
    selDesc2: "— 縦 = 円周 =",
    selDesc3: "— 横 = 円柱の高さ =",
    selDesc4: "• 側面積 =",
    alasTitle: "底面",
    alasDesc1: "下の",
    alasDesc2: "円",
    tutupTitle: "頂面",
    tutupDesc1: "上の",
    tutupDesc2: "円",
    thUnsur: "要素",
    thNilai: "値 / 記号",
    thKet: "説明",
    rows: [
      ["面の数",    "3",         "側面 + 底面 + 頂面"],
      ["辺の数",    "2",         "上下の円"],
      ["頂点の数",  "0",         "頂点なし"],
      ["半径",      "r",         "中心 → 円の端"],
      ["直径",      "d = 2r",    "円の直径"],
      ["高さ",      "t",         "底面から頂面の垂直距離"],
      ["底面/頂面", "L₀ = πr²", "各円の面積"],
      ["側面",      "Ls = 2πrt", "曲面（外皮）"],
    ] as [string, string, string][],
    tipBold: "💡 ポイント：",
    tipText1: "円柱のすべての公式は",
    tipAnd: "と",
    tipText2: "覚えておこう：",
    tipCount: "3面、2辺、0頂点",
  },
};

/* ── Slide 3 translations ─────────────────────────────────── */
const slide3Trans = {
  id: {
    title: "Jaring-jaring Tabung",
    intro1: 'Kalau kita "bongkar" dan bentangkan semua permukaan tabung menjadi datar, itulah yang disebut',
    introBold: "jaring-jaring tabung",
    kompLabel: "🗺️ Komponen Jaring-jaring Tabung:",
    card1Title: "Tutup ATAS",
    card1Desc: "Lingkaran jari-jari r",
    card2Title: "SELIMUT",
    card2Desc: "Persegi panjang",
    card2Sub: "p = 2πr, l = t",
    card3Title: "Tutup BAWAH",
    card3Desc: "Lingkaran jari-jari r",
    tipBold: "💡 Tips Penting:",
    tipText1: "Perhatikan bahwa panjang sisi persegi panjang (selimut) harus sama persis dengan keliling lingkaran alas/tutup (",
    tipText2: '). Inilah kunci kenapa jaring-jaring bisa "menyambung" sempurna!',
    sizeTitle: "📏 Ukuran Masing-masing Bagian:",
    size1: "• Luas tutup atas = Luas tutup bawah =",
    size2: "• Panjang selimut (dibuka) =",
    size3: "• Tinggi selimut (dibuka) =",
    size4: "• Luas selimut =",
  },
  en: {
    title: "Cylinder Net",
    intro1: 'If we "unfold" and flatten all surfaces of a cylinder, that is called a',
    introBold: "cylinder net",
    kompLabel: "🗺️ Components of a Cylinder Net:",
    card1Title: "TOP Cap",
    card1Desc: "Circle of radius r",
    card2Title: "LATERAL",
    card2Desc: "Rectangle",
    card2Sub: "l = 2πr, w = t",
    card3Title: "BOTTOM Cap",
    card3Desc: "Circle of radius r",
    tipBold: "💡 Important Tip:",
    tipText1: "The length of the rectangle (lateral surface) must exactly equal the circumference of the base/top circle (",
    tipText2: "). This is why the net fits together perfectly!",
    sizeTitle: "📏 Dimensions of Each Part:",
    size1: "• Top area = Bottom area =",
    size2: "• Lateral length (unrolled) =",
    size3: "• Lateral height (unrolled) =",
    size4: "• Lateral area =",
  },
  ja: {
    title: "円柱の展開図",
    intro1: "円柱のすべての面を「分解」して平らに広げると、これが",
    introBold: "円柱の展開図",
    kompLabel: "🗺️ 円柱の展開図の構成要素：",
    card1Title: "上蓋",
    card1Desc: "半径 r の円",
    card2Title: "側面",
    card2Desc: "長方形",
    card2Sub: "縦 = 2πr、横 = t",
    card3Title: "下蓋",
    card3Desc: "半径 r の円",
    tipBold: "💡 重要なヒント：",
    tipText1: "長方形（側面）の辺の長さが、底面・頂面の円周（",
    tipText2: "）と等しくなければなりません。これが展開図がぴったり合う理由です！",
    sizeTitle: "📏 各部分の寸法：",
    size1: "• 上蓋の面積 = 下蓋の面積 =",
    size2: "• 側面の長さ（展開後）=",
    size3: "• 側面の高さ（展開後）=",
    size4: "• 側面積 =",
  },
};

/* ── Slide 4 translations ─────────────────────────────────── */
const slide4Trans = {
  id: {
    title: "Luas Permukaan Tabung",
    intro1: "Luas permukaan tabung adalah",
    introBold: "total seluruh luas",
    intro2: "semua bagian yang membungkus tabung — termasuk dua tutup lingkaran dan selimutnya.",
    svgTitle: "Tabung Dibongkar → Komponen Luas Permukaan",
    svgTopLabel: "tutup atas",
    svgMantleLabel: "SELIMUT",
    svgMantleSub: "(Persegi Panjang)",
    svgBotLabel: "tutup bawah",
    derLabel: "🧮 Penurunan Rumus:",
    derStep: "Tutup Atas + Tutup Bawah + Selimut",
    derFormLabel: "✨ Rumus Luas Permukaan Tabung:",
    derAlt: "Atau bisa juga ditulis:",
    noteLabel: "🚀 Catatan:",
    noteText: "Kalau tabung tidak punya tutup (seperti pipa atau ember tanpa dasar), kamu hanya menghitung selimut ditambah satu lingkaran. Sesuaikan rumus dengan kebutuhan soal!",
    thType: "Jenis Tabung",
    thFormula: "Rumus Luas",
    rows: [
      ["Tabung tertutup (ada alas & tutup)", "L = 2\\pi r^2 + 2\\pi r t"],
      ["Tabung terbuka (tanpa tutup atas)",  "L = \\pi r^2 + 2\\pi r t"],
      ["Selimut saja",                       "L_s = 2\\pi r t"],
    ] as [string, string][],
  },
  en: {
    title: "Surface Area of a Cylinder",
    intro1: "The surface area of a cylinder is the",
    introBold: "total area",
    intro2: "of all parts enclosing the cylinder — including two circular caps and the lateral surface.",
    svgTitle: "Cylinder Exploded → Surface Area Components",
    svgTopLabel: "top cap",
    svgMantleLabel: "LATERAL",
    svgMantleSub: "(Rectangle)",
    svgBotLabel: "bottom cap",
    derLabel: "🧮 Formula Derivation:",
    derStep: "Top Cap + Bottom Cap + Lateral Surface",
    derFormLabel: "✨ Cylinder Surface Area Formula:",
    derAlt: "Can also be written as:",
    noteLabel: "🚀 Note:",
    noteText: "If the cylinder has no top cap (like a pipe or a bucket without a base), you only calculate the lateral surface plus one circle. Adjust the formula to suit the problem!",
    thType: "Cylinder Type",
    thFormula: "Surface Area Formula",
    rows: [
      ["Closed cylinder (base & cap)",  "L = 2\\pi r^2 + 2\\pi r t"],
      ["Open cylinder (no top cap)",    "L = \\pi r^2 + 2\\pi r t"],
      ["Lateral surface only",          "L_s = 2\\pi r t"],
    ] as [string, string][],
  },
  ja: {
    title: "円柱の表面積",
    intro1: "円柱の表面積は、円柱を包む",
    introBold: "すべての部分の面積の合計",
    intro2: "です — 2枚の円形の蓋と側面を含みます。",
    svgTitle: "円柱を展開 → 表面積の構成要素",
    svgTopLabel: "上蓋",
    svgMantleLabel: "側面",
    svgMantleSub: "（長方形）",
    svgBotLabel: "下蓋",
    derLabel: "🧮 公式の導出：",
    derStep: "上蓋 + 下蓋 + 側面",
    derFormLabel: "✨ 円柱の表面積の公式：",
    derAlt: "次のようにも書けます：",
    noteLabel: "🚀 備考：",
    noteText: "円柱に蓋がない場合（パイプや底のないバケツなど）、側面と一つの円だけを計算します。問題に合わせて公式を調整しましょう！",
    thType: "円柱の種類",
    thFormula: "表面積の公式",
    rows: [
      ["閉じた円柱（蓋あり）",   "L = 2\\pi r^2 + 2\\pi r t"],
      ["開いた円柱（上蓋なし）", "L = \\pi r^2 + 2\\pi r t"],
      ["側面のみ",               "L_s = 2\\pi r t"],
    ] as [string, string][],
  },
};

/* ── Slide 5 translations ─────────────────────────────────── */
const slide5Trans = {
  id: {
    title: "Volume Tabung",
    intro1: "Volume tabung adalah",
    introBold: "seberapa banyak isi",
    intro2: "yang bisa ditampung di dalamnya — bayangkan berapa liter air yang masuk ke dalam kaleng!",
    animLabel: "🌊 Tabung diisi air — dari kosong hingga penuh",
    animSub: "Persentase menunjukkan proporsi volume terisi terhadap volume total",
    ideLabel: "💡 Ide Dasar:",
    ideText: "Volume = Luas alas × Tinggi. Karena alas tabung adalah lingkaran:",
    formulaDer: "V = \\text{Luas Alas} \\times t = \\pi r^2 \\times t",
    formulaLabel: "✨ Rumus Volume Tabung:",
    satuanBold: "Satuan volume:",
    sat1a: "• Jika",
    sat1b: "dan",
    sat1c: "dalam cm → Volume dalam",
    sat2c: "dalam m → Volume dalam",
  },
  en: {
    title: "Volume of a Cylinder",
    intro1: "The volume of a cylinder is",
    introBold: "how much it can hold",
    intro2: "inside — imagine how many liters of water fit into a can!",
    animLabel: "🌊 Cylinder filling with water — from empty to full",
    animSub: "Percentage shows the proportion of filled volume to total volume",
    ideLabel: "💡 Core Idea:",
    ideText: "Volume = Base Area × Height. Since the base of a cylinder is a circle:",
    formulaDer: "V = \\text{Base Area} \\times t = \\pi r^2 \\times t",
    formulaLabel: "✨ Cylinder Volume Formula:",
    satuanBold: "Volume units:",
    sat1a: "• If",
    sat1b: "and",
    sat1c: "are in cm → Volume in",
    sat2c: "are in m → Volume in",
  },
  ja: {
    title: "円柱の体積",
    intro1: "円柱の体積は、中に",
    introBold: "どれだけ入るか",
    intro2: "を表します — 缶に何リットルの水が入るか想像してみてください！",
    animLabel: "🌊 円柱に水が満たされる — 空から満杯まで",
    animSub: "パーセンテージは総体積に対する充填体積の割合を示します",
    ideLabel: "💡 基本概念：",
    ideText: "体積 = 底面積 × 高さ。円柱の底面は円なので：",
    formulaDer: "V = \\text{底面積} \\times t = \\pi r^2 \\times t",
    formulaLabel: "✨ 円柱の体積の公式：",
    satuanBold: "体積の単位：",
    sat1a: "•",
    sat1b: "と",
    sat1c: "がcm → 体積：",
    sat2c: "がm → 体積：",
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS DATA
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

function getSections(language: Language): Sec[] {
  const s1 = slide1Trans[language];
  const s2 = slide2Trans[language];
  const s3 = slide3Trans[language];
  const s4 = slide4Trans[language];
  const s5 = slide5Trans[language];
  return [
  {
    title: s1.title,
    icon: "🔵",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          {s1.intro1} <strong className="text-cyan-300">{s1.introBold}</strong>{s1.intro2}
        </p>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-4 text-sm text-cyan-100 space-y-2">
          <p className="font-semibold text-cyan-300">{s1.defLabel}</p>
          <p>
            {s1.defText1} <strong>{s1.defBold1}</strong> {s1.defText2} <strong className="text-purple-300">{s1.defBold2}</strong>{s1.defText3}
          </p>
        </div>
        <InteractiveCylinder3D />

        {/* ── Real-world examples ── */}
        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-xl p-4 space-y-3">
          <p className="text-cyan-300 font-bold text-sm text-center">{s1.realWorldTitle}</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { src: "/images/image_1780450794282.png", label: s1.imgLabels[0] },
              { src: "/images/image_1780450814436.png", label: s1.imgLabels[1] },
              { src: "/images/image_1780450845492.png", label: s1.imgLabels[2] },
              { src: "/images/image_1780450861720.png", label: s1.imgLabels[3] },
              { src: "/images/image_1780450884364.png", label: s1.imgLabels[4] },
              { src: "/images/image_1780450893223.png", label: s1.imgLabels[5] },
              { src: "/images/image_1780450901986.png", label: s1.imgLabels[6] },
              { src: "/images/image_1780450906978.png", label: s1.imgLabels[7] },
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
    icon: "🏷️",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          {s2.intro}
        </p>

        {/* ── Labeled diagram ── */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
          <p className="text-cyan-300 font-bold text-xs text-center mb-3">{s2.diagramTitle}</p>
          <svg viewBox="0 0 380 260" className="w-full max-w-sm mx-auto block">
            <defs>
              <style>{`
                @keyframes blinkU{0%,100%{opacity:1;}50%{opacity:0.22;}}
                .u-blink{animation:blinkU 2.2s ease-in-out infinite;}
              `}</style>
            </defs>

            {/* === Badan tabung === */}
            <rect x="92" y="70" width="146" height="118" fill="rgba(8,145,178,0.07)" stroke="none"/>
            <rect x="92" y="70" width="146" height="118" fill="rgba(168,85,247,0.07)" stroke="none"/>
            <line x1="92"  y1="70" x2="92"  y2="188" stroke="#0891b2" strokeWidth="1.8"/>
            <line x1="238" y1="70" x2="238" y2="188" stroke="#0891b2" strokeWidth="1.8"/>

            {/* TUTUP */}
            <ellipse cx="165" cy="70"  rx="73" ry="18" fill="rgba(99,102,241,0.30)" stroke="#818cf8" strokeWidth="1.8" className="u-blink"/>
            {/* ALAS */}
            <ellipse cx="165" cy="188" rx="73" ry="18" fill="rgba(52,211,153,0.20)" stroke="#34d399" strokeWidth="1.8" className="u-blink"/>
            {/* Selimut tint */}
            <rect x="92" y="70" width="146" height="118" fill="rgba(168,85,247,0.09)" stroke="none"/>

            {/* === r === */}
            <line x1="165" y1="70" x2="238" y2="70" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5,3"/>
            <circle cx="165" cy="70" r="3.5" fill="#f59e0b"/>
            <circle cx="238" cy="70" r="3.5" fill="#f59e0b"/>
            <line x1="202" y1="70" x2="202" y2="46" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="202" y="41" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="700" textAnchor="middle">r</text>
            <text x="242" y="74" fill="#fde68a" fontSize="7"  fontFamily="monospace" textAnchor="start">{s2.svgRadiusSub}</text>

            {/* === d === */}
            <line x1="92"  y1="196" x2="92"  y2="212" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" opacity="0.55"/>
            <line x1="238" y1="196" x2="238" y2="212" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" opacity="0.55"/>
            <line x1="92"  y1="212" x2="238" y2="212" stroke="#fde68a" strokeWidth="1.8"/>
            <line x1="92"  y1="207" x2="92"  y2="217" stroke="#fde68a" strokeWidth="1.8"/>
            <line x1="238" y1="207" x2="238" y2="217" stroke="#fde68a" strokeWidth="1.8"/>
            <text x="165" y="230" fill="#fde68a" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="middle">d = 2r</text>

            {/* === t === */}
            <line x1="256" y1="70"  x2="256" y2="188" stroke="#22c55e" strokeWidth="2.2"/>
            <line x1="250" y1="70"  x2="262" y2="70"  stroke="#22c55e" strokeWidth="2"/>
            <line x1="250" y1="188" x2="262" y2="188" stroke="#22c55e" strokeWidth="2"/>
            <text x="270" y="133" fill="#22c55e" fontSize="12" fontFamily="monospace" fontWeight="700" textAnchor="middle">t</text>
            <text x="270" y="147" fill="#86efac" fontSize="8"  fontFamily="monospace" textAnchor="middle">{s2.svgHeightSub}</text>

            {/* === TUTUP label === */}
            <line x1="238" y1="63" x2="318" y2="38" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="320" y="34" fill="#818cf8" fontSize="9" fontFamily="monospace" fontWeight="700">{s2.svgTopLabel}</text>
            <text x="320" y="44" fill="#818cf8" fontSize="7" fontFamily="monospace">{s2.svgTopSub}</text>

            {/* === ALAS label === */}
            <line x1="238" y1="194" x2="318" y2="218" stroke="#34d399" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="320" y="214" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="700">{s2.svgBaseLabel}</text>
            <text x="320" y="224" fill="#34d399" fontSize="7" fontFamily="monospace">{s2.svgBaseSub}</text>

            {/* === SELIMUT label === */}
            <line x1="92" y1="129" x2="52" y2="129" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="50" y="123" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="end">{s2.svgMantleLabel}</text>
            <text x="50" y="134" fill="#c084fc" fontSize="7" fontFamily="monospace" textAnchor="end">{s2.svgMantleSub}</text>
          </svg>
        </div>

        {/* ── Component cards ── */}
        <div className="grid grid-cols-1 gap-3">

          {/* ── SISI ── */}
          <div className="bg-purple-950/40 border border-purple-600/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-900/40">
              <span className="text-lg">🔲</span>
              <div>
                <p className="text-purple-300 font-bold text-sm">{s2.sisiTitle} <span className="text-yellow-300">{s2.sisiCount}</span></p>
                <p className="text-purple-200/70 text-xs">{s2.sisiSub}</p>
              </div>
            </div>
            <SisiAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>① <strong className="text-purple-300">{s2.sisiItem1}</strong> — {s2.sisiItem1desc}</p>
              <p>② <strong className="text-green-300">{s2.sisiItem2}</strong> — {s2.sisiItem2desc}</p>
              <p>③ <strong className="text-indigo-300">{s2.sisiItem3}</strong> — {s2.sisiItem3desc}</p>
              <div className="mt-2 bg-purple-900/40 rounded p-2 text-center font-mono text-purple-200">
                {s2.sisiTotalLabel} <strong className="text-yellow-300">3</strong>
              </div>
            </div>
          </div>

          {/* ── RUSUK ── */}
          <div className="bg-amber-950/40 border border-amber-600/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-amber-900/40">
              <span className="text-lg">〇</span>
              <div>
                <p className="text-amber-300 font-bold text-sm">{s2.rusukTitle} <span className="text-yellow-300">{s2.rusukCount}</span></p>
                <p className="text-amber-200/70 text-xs">{s2.rusukSub}</p>
              </div>
            </div>
            <RusukAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>① <strong className="text-amber-300">{s2.rusukItem1}</strong> — {s2.rusukItem1desc}</p>
              <p>② <strong className="text-sky-300">{s2.rusukItem2}</strong> — {s2.rusukItem2desc}</p>
              <p className="text-white/50 text-[11px]">{s2.rusukNote1} <strong>{s2.rusukNoteBold}</strong> {s2.rusukNote2}</p>
              <div className="mt-2 bg-amber-900/40 rounded p-2 text-center font-mono text-amber-200">
                {s2.rusukTotalLabel} <strong className="text-yellow-300">2</strong> &nbsp;|&nbsp; {s2.rusukVerticesLabel} <strong className="text-yellow-300">0</strong>
              </div>
            </div>
          </div>

          {/* ── JARI-JARI ── */}
          <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-amber-900/30">
              <span className="text-lg">📏</span>
              <div>
                <p className="text-amber-300 font-bold text-sm">{s2.rTitle}</p>
                <p className="text-amber-200/70 text-xs">{s2.rSub}</p>
              </div>
            </div>
            <JariJariAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>{s2.rDesc1a} <strong className="text-amber-300">{s2.rDesc1b}</strong> {s2.rDesc1c}</p>
              <p>{s2.rDesc2a} <strong>{s2.rDesc2b}</strong>{s2.rDesc2c}</p>
              <div className="flex items-center gap-2 mt-1">
                <span>{s2.rRelLabel}</span>
                <span className="text-yellow-300 font-mono">d = 2r</span>
                <span className="text-white/40">→</span>
                <InlineMath math="r = \dfrac{d}{2}" />
              </div>
            </div>
          </div>

          {/* ── TINGGI ── */}
          <div className="bg-green-950/40 border border-green-700/50 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-green-900/30">
              <span className="text-lg">📐</span>
              <div>
                <p className="text-green-300 font-bold text-sm">{s2.tTitle}</p>
                <p className="text-green-200/70 text-xs">{s2.tSub}</p>
              </div>
            </div>
            <TinggiAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>{s2.tDesc1a} <strong className="text-green-300">{s2.tDesc1b}</strong> {s2.tDesc1c}</p>
              <p>{s2.tDesc2}</p>
            </div>
          </div>

          {/* ── SELIMUT ── */}
          <div className="bg-purple-950/40 border border-purple-700/50 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-900/30">
              <span className="text-lg">🌀</span>
              <div>
                <p className="text-purple-300 font-bold text-sm">{s2.selTitle}</p>
                <p className="text-purple-200/70 text-xs">{s2.selSub}</p>
              </div>
            </div>
            <SelimutAnimSVG />
            <p className="text-center text-purple-300 font-bold text-xs mt-1 px-4">{s2.selUnfold}</p>
            <SelimutRectAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>{s2.selDesc1a} <strong className="text-purple-300">{s2.selDesc1b}</strong> {s2.selDesc1c}</p>
              <p className="pl-3">{s2.selDesc2} <strong className="text-yellow-300">2πr</strong></p>
              <p className="pl-3">{s2.selDesc3} <strong className="text-green-300">t</strong></p>
              <p>{s2.selDesc4} <strong className="text-yellow-300">2πr × t</strong></p>
            </div>
          </div>

          {/* ── ALAS & TUTUP ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-950/40 border border-indigo-700/50 rounded-xl p-4 space-y-2">
              <p className="text-xl text-center">⭕</p>
              <p className="text-indigo-300 font-bold text-sm text-center">{s2.alasTitle}</p>
              <p className="text-white/65 text-xs text-center">{s2.alasDesc1} <strong>{s2.alasDesc2}</strong></p>
              <div className="bg-indigo-900/40 rounded p-2 text-center text-xs text-indigo-200">
                <InlineMath math="L_{alas} = \pi r^2" />
              </div>
            </div>
            <div className="bg-cyan-950/40 border border-cyan-700/50 rounded-xl p-4 space-y-2">
              <p className="text-xl text-center">⭕</p>
              <p className="text-cyan-300 font-bold text-sm text-center">{s2.tutupTitle}</p>
              <p className="text-white/65 text-xs text-center">{s2.tutupDesc1} <strong>{s2.tutupDesc2}</strong></p>
              <div className="bg-cyan-900/40 rounded p-2 text-center text-xs text-cyan-200">
                <InlineMath math="L_{tutup} = \pi r^2" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Summary table ── */}
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s2.thUnsur}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{s2.thNilai}</th>
                <th className="px-3 py-2 text-cyan-300 text-left">{s2.thKet}</th>
              </tr>
            </thead>
            <tbody>
              {s2.rows.map(([u, sym, k], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{u}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{sym}</td>
                  <td className="px-3 py-2 text-white/60 text-left">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <blockquote className="border-l-4 border-cyan-500 pl-3 text-sm text-cyan-200">
          <strong>{s2.tipBold}</strong> {s2.tipText1} <strong className="text-amber-300">r</strong> {s2.tipAnd} <strong className="text-green-300">t</strong>.
          {" "}{s2.tipText2} <strong>{s2.tipCount}</strong>!
        </blockquote>
      </div>
    ),
  },
  {
    title: s3.title,
    icon: "📐",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          {s3.intro1} <strong className="text-purple-300">{s3.introBold}</strong>.
        </p>

        <CylinderNetAnimation />
        <div className="bg-purple-950/40 border border-purple-700/40 rounded-xl p-4">
          <p className="text-purple-200 text-sm font-bold mb-3">{s3.kompLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-cyan-950/60 border border-cyan-700/40 rounded-lg p-3">
              <p className="text-2xl mb-1">⭕</p>
              <p className="text-cyan-300 text-xs font-bold">{s3.card1Title}</p>
              <p className="text-white/60 text-xs">{s3.card1Desc}</p>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/40 rounded-lg p-3">
              <p className="text-2xl mb-1">▭</p>
              <p className="text-purple-300 text-xs font-bold">{s3.card2Title}</p>
              <p className="text-white/60 text-xs">{s3.card2Desc}<br/>{s3.card2Sub}</p>
            </div>
            <div className="bg-green-950/60 border border-green-700/40 rounded-lg p-3">
              <p className="text-2xl mb-1">⭕</p>
              <p className="text-green-300 text-xs font-bold">{s3.card3Title}</p>
              <p className="text-white/60 text-xs">{s3.card3Desc}</p>
            </div>
          </div>
        </div>
        <blockquote className="border-l-4 border-yellow-500 pl-3 text-sm text-yellow-200">
          <strong>{s3.tipBold}</strong> {s3.tipText1}<InlineMath math="2\pi r" />{s3.tipText2}
        </blockquote>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2 text-sm text-white/80">
          <p className="font-bold text-white">{s3.sizeTitle}</p>
          <div className="bg-slate-900/60 rounded p-3 space-y-1 text-xs font-mono">
            <p>{s3.size1} <InlineMath math="\pi r^2" /></p>
            <p>{s3.size2} <InlineMath math="2\pi r" /></p>
            <p>{s3.size3} <InlineMath math="t" /></p>
            <p>{s3.size4} <InlineMath math="2\pi r \times t" /></p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: s4.title,
    icon: "🎨",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm">
          {s4.intro1} <strong>{s4.introBold}</strong> {s4.intro2}
        </p>

        {/* ── Diagram: exploded cylinder ── */}
        <div className="rounded-xl overflow-hidden border border-purple-700/40">
          <svg viewBox="0 0 400 250" style={{ width:"100%", display:"block" }} xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="250" fill="rgba(8,12,30,0.92)"/>

            {/* TITLE */}
            <text x="200" y="15" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {s4.svgTitle}
            </text>

            {/* TOP CIRCLE */}
            <circle cx="200" cy="48" r="28" fill="rgba(99,102,241,0.42)" stroke="#818cf8" strokeWidth="1.8"/>
            <line x1="200" y1="48" x2="228" y2="48" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="3,2"/>
            <circle cx="200" cy="48" r="2" fill="#f59e0b"/>
            <circle cx="228" cy="48" r="2" fill="#f59e0b"/>
            <text x="214" y="42" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
            <text x="200" y="60" fill="#c7d2fe" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{s4.svgTopLabel}</text>
            <text x="242" y="51" fill="#818cf8" fontSize="9.5" fontFamily="monospace" textAnchor="start">= πr²</text>

            <text x="28" y="86" fill="#64748b" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">+</text>
            <line x1="200" y1="76" x2="200" y2="87" stroke="rgba(168,85,247,0.35)" strokeWidth="1" strokeDasharray="2,2"/>

            <line x1="106" y1="87" x2="294" y2="87" stroke="#a855f7" strokeWidth="1"/>
            <line x1="106" y1="83" x2="106" y2="91" stroke="#a855f7" strokeWidth="1"/>
            <line x1="294" y1="83" x2="294" y2="91" stroke="#a855f7" strokeWidth="1"/>
            <text x="200" y="83" fill="#d8b4fe" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">← 2πr →</text>

            {/* RECTANGLE */}
            <rect x="106" y="90" width="188" height="62" rx="4" fill="rgba(168,85,247,0.32)" stroke="#a855f7" strokeWidth="1.8"/>
            <line x1="302" y1="90"  x2="302" y2="152" stroke="#22c55e" strokeWidth="1.4"/>
            <line x1="298" y1="90"  x2="306" y2="90"  stroke="#22c55e" strokeWidth="1.2"/>
            <line x1="298" y1="152" x2="306" y2="152" stroke="#22c55e" strokeWidth="1.2"/>
            <text x="314" y="125" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
            <text x="200" y="117" fill="#e9d5ff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{s4.svgMantleLabel}</text>
            <text x="200" y="129" fill="#c4b5fd" fontSize="7.5" fontFamily="monospace" textAnchor="middle">{s4.svgMantleSub}</text>
            <text x="322" y="147" fill="#a855f7" fontSize="9.5" fontFamily="monospace" textAnchor="start">= 2πr·t</text>

            <text x="28" y="170" fill="#64748b" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">+</text>
            <line x1="200" y1="152" x2="200" y2="160" stroke="rgba(168,85,247,0.35)" strokeWidth="1" strokeDasharray="2,2"/>

            {/* BOTTOM CIRCLE */}
            <circle cx="200" cy="188" r="28" fill="rgba(99,102,241,0.42)" stroke="#818cf8" strokeWidth="1.8"/>
            <line x1="200" y1="188" x2="228" y2="188" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="3,2"/>
            <circle cx="200" cy="188" r="2" fill="#f59e0b"/>
            <circle cx="228" cy="188" r="2" fill="#f59e0b"/>
            <text x="214" y="183" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
            <text x="200" y="222" fill="#c7d2fe" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{s4.svgBotLabel}</text>
            <text x="242" y="195" fill="#818cf8" fontSize="9.5" fontFamily="monospace" textAnchor="start">= πr²</text>

            {/* TOTAL FORMULA BAR */}
            <rect x="20" y="226" width="360" height="18" rx="5"
              fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.36)" strokeWidth="1"/>
            <text x="200" y="239" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              L = πr² + 2πrt + πr²  =  2πr² + 2πrt  =  2πr(r+t)
            </text>
          </svg>
        </div>

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-3">
          <p className="text-orange-300 font-bold text-sm">{s4.derLabel}</p>
          <div className="space-y-2 text-sm text-white/80">
            <div className="bg-slate-900/60 rounded p-2 text-xs">
              <p className="text-white/60 mb-1">{s4.derStep}</p>
              <BlockMath math="L = \pi r^2 + \pi r^2 + 2\pi r \cdot t" />
            </div>
            <div className="bg-orange-950/50 border border-orange-700/40 rounded p-3">
              <p className="text-orange-300 font-bold text-center text-xs mb-2">{s4.derFormLabel}</p>
              <BlockMath math="L = 2\pi r^2 + 2\pi r \cdot t" />
            </div>
            <div className="bg-slate-900/60 rounded p-2 text-xs text-white/60">
              <p>{s4.derAlt}</p>
              <BlockMath math="L = 2\pi r \left( r + t \right)" />
            </div>
          </div>
        </div>

        <blockquote className="border-l-4 border-orange-500 pl-3 text-sm text-orange-200">
          <strong>{s4.noteLabel}</strong> {s4.noteText}
        </blockquote>

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s4.thType}</th>
              <th className="px-3 py-2 text-cyan-300">{s4.thFormula}</th>
            </tr></thead>
            <tbody>
              {s4.rows.map(([b, r], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i%2===0?"bg-slate-900/40":"bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono"><InlineMath math={r}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    title: s5.title,
    icon: "📦",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          {s5.intro1} <strong>{s5.introBold}</strong> {s5.intro2}
        </p>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-1">
          <p className="text-cyan-300 text-xs font-semibold font-body text-center">
            {s5.animLabel}
          </p>
          <WaterTabungAnimation />
          <p className="text-white/45 text-[10px] font-body text-center">
            {s5.animSub}
          </p>
        </div>

        <div className="bg-blue-950/50 border border-blue-700/40 rounded-lg p-4 space-y-3">
          <p className="text-blue-300 font-bold text-sm">{s5.ideLabel}</p>
          <p className="text-white/75 text-sm">{s5.ideText}</p>
          <div className="bg-slate-900/60 rounded p-3 space-y-2">
            <BlockMath math={s5.formulaDer} />
          </div>
          <div className="bg-blue-950/70 border border-blue-600/40 rounded p-3 text-center">
            <p className="text-blue-200 font-bold text-xs mb-1">{s5.formulaLabel}</p>
            <BlockMath math="V = \pi r^2 \cdot t" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 <strong className="text-white">{s5.satuanBold}</strong></p>
          <p>{s5.sat1a} <InlineMath math="r" /> {s5.sat1b} <InlineMath math="t" /> {s5.sat1c} <InlineMath math="\text{cm}^3" /></p>
          <p>{s5.sat1a} <InlineMath math="r" /> {s5.sat1b} <InlineMath math="t" /> {s5.sat2c} <InlineMath math="\text{m}^3" /></p>
          <p>• <InlineMath math="1 \text{ m}^3 = 1.000.000 \text{ cm}^3" /></p>
          <p>• <InlineMath math="1 \text{ liter} = 1.000 \text{ cm}^3" /></p>
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

function getLuasExamples(language: Language): Ex[] {
  return [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        {language === "id" ? (
          <>
            <p>Sebuah tabung memiliki jari-jari alas <InlineMath math="7 \text{ cm}" /> dan tinggi <InlineMath math="10 \text{ cm}" />.</p>
            <p>Hitunglah <strong className="text-purple-300">luas selimut</strong> tabung tersebut!</p>
            <p className="text-xs text-white/50">(gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A cylinder has a base radius of <InlineMath math="7 \text{ cm}" /> and a height of <InlineMath math="10 \text{ cm}" />.</p>
            <p>Calculate the <strong className="text-purple-300">lateral surface area</strong> of the cylinder!</p>
            <p className="text-xs text-white/50">(use <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : (
          <>
            <p>底面の半径が<InlineMath math="7 \text{ cm}" />、高さが<InlineMath math="10 \text{ cm}" />の円柱があります。</p>
            <p>この円柱の<strong className="text-purple-300">側面積</strong>を求めなさい！</p>
            <p className="text-xs text-white/50">（<InlineMath math="\pi = \frac{22}{7}" /> を使用）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600/60 rounded p-3 text-xs space-y-1">
          {language === "id" ? (
            <>
              <p className="text-green-300 font-semibold mb-2">Diketahui:</p>
              <p className="text-white/70">• Jari-jari: <InlineMath math="r = 7 \text{ cm}" /></p>
              <p className="text-white/70">• Tinggi: <InlineMath math="t = 10 \text{ cm}" /></p>
              <p className="text-white/70">• <InlineMath math="\pi = \frac{22}{7}" /></p>
            </>
          ) : language === "en" ? (
            <>
              <p className="text-green-300 font-semibold mb-2">Given:</p>
              <p className="text-white/70">• Radius: <InlineMath math="r = 7 \text{ cm}" /></p>
              <p className="text-white/70">• Height: <InlineMath math="t = 10 \text{ cm}" /></p>
              <p className="text-white/70">• <InlineMath math="\pi = \frac{22}{7}" /></p>
            </>
          ) : (
            <>
              <p className="text-green-300 font-semibold mb-2">分かっていること：</p>
              <p className="text-white/70">• 半径：<InlineMath math="r = 7 \text{ cm}" /></p>
              <p className="text-white/70">• 高さ：<InlineMath math="t = 10 \text{ cm}" /></p>
              <p className="text-white/70">• <InlineMath math="\pi = \frac{22}{7}" /></p>
            </>
          )}
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <p className="text-white/60 mb-1">
            {language === "id" ? "Gunakan rumus luas selimut tabung:" : language === "en" ? "Use the cylinder's lateral surface area formula:" : "円柱の側面積の公式を使う："}
          </p>
          <BlockMath math="L_{\text{selimut}} = 2\pi r t" />
          <BlockMath math="L_{\text{selimut}} = 2 \times \frac{22}{7} \times 7 \times 10" />
          <BlockMath math="L_{\text{selimut}} = 2 \times 22 \times 10" />
          <BlockMath math="L_{\text{selimut}} = 440 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">
            {language === "id" ? "✅ Luas selimut tabung = " : language === "en" ? "✅ Lateral surface area of the cylinder = " : "✅ 円柱の側面積 = "}
            <InlineMath math="440 \text{ cm}^2" />
          </p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah tong air berbentuk tabung terbuka (tanpa tutup atas) dengan diameter <InlineMath math="60 \text{ cm}" /> dan tinggi <InlineMath math="80 \text{ cm}" />.</p>
            <p>Tong ini akan dicat di seluruh permukaan luarnya (alas + selimut). Jika 1 kaleng cat cukup untuk <InlineMath math="5.000 \text{ cm}^2" />, berapa kaleng cat yang diperlukan?</p>
            <p className="text-xs text-white/50">(π = 3,14)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>An open cylindrical water tank (without a top lid) has a diameter of <InlineMath math="60 \text{ cm}" /> and a height of <InlineMath math="80 \text{ cm}" />.</p>
            <p>The tank will be painted on its entire outer surface (base + lateral surface). If one can of paint covers <InlineMath math="5.000 \text{ cm}^2" />, how many cans of paint are needed?</p>
            <p className="text-xs text-white/50">(π = 3.14)</p>
          </>
        ) : (
          <>
            <p>上蓋のない円柱形の水槽があり、直径<InlineMath math="60 \text{ cm}" />、高さ<InlineMath math="80 \text{ cm}" />です。</p>
            <p>この水槽の外側全体（底面＋側面）にペンキを塗ります。1缶で<InlineMath math="5.000 \text{ cm}^2" />塗れるとき、必要なペンキの缶数は何缶ですか？</p>
            <p className="text-xs text-white/50">（π = 3.14）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? "Langkah 1 — Cari jari-jari:" : language === "en" ? "Step 1 — Find the radius:" : "ステップ1 — 半径を求める："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{60}{2} = 30 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? "Langkah 2 — Luas permukaan terbuka (alas + selimut):" : language === "en" ? "Step 2 — Open surface area (base + lateral surface):" : "ステップ2 — 開いた表面積（底面＋側面）："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="L = \pi r^2 + 2\pi r \cdot t" />
          <BlockMath math="L = 3{,}14 \times 30^2 + 2 \times 3{,}14 \times 30 \times 80" />
          <BlockMath math="L = 3{,}14 \times 900 + 2 \times 3{,}14 \times 2.400" />
          <BlockMath math="L = 2.826 + 15.072 = 17.898 \text{ cm}^2" />
        </div>
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? "Langkah 3 — Hitung kebutuhan cat:" : language === "en" ? "Step 3 — Calculate paint needed:" : "ステップ3 — 必要な缶数を計算："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="\text{Kaleng cat} = \frac{17.898}{5.000} = 3{,}58 \approx 4 \text{ kaleng}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs">
          <p className="text-yellow-300 font-semibold">
            {language === "id" ? <>✅ Jawaban: Dibutuhkan <strong>4 kaleng cat</strong> (dibulatkan ke atas)</> : language === "en" ? <>✅ Answer: <strong>4 cans of paint</strong> are needed (rounded up)</> : <>✅ 答え：ペンキは<strong>4缶</strong>必要（切り上げ）</>}
          </p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah pabrik membuat label kertas yang menempel persis di selimut tabung kaleng.</p>
            <p>Kaleng tersebut memiliki luas permukaan total <InlineMath math="1.507{,}2 \text{ cm}^2" /> dan tinggi <InlineMath math="15 \text{ cm}" />.</p>
            <p>Tentukan: (a) jari-jari kaleng, (b) luas label kertas yang dibutuhkan untuk satu kaleng.</p>
            <p className="text-xs text-white/50">(π = 3,14)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A factory makes paper labels that fit exactly around the lateral surface of a can-shaped cylinder.</p>
            <p>The can has a total surface area of <InlineMath math="1.507{,}2 \text{ cm}^2" /> and a height of <InlineMath math="15 \text{ cm}" />.</p>
            <p>Determine: (a) the radius of the can, (b) the paper label area needed for one can.</p>
            <p className="text-xs text-white/50">(π = 3.14)</p>
          </>
        ) : (
          <>
            <p>ある工場が、缶型の円柱の側面にぴったり貼る紙のラベルを作っています。</p>
            <p>この缶の表面積の合計は<InlineMath math="1.507{,}2 \text{ cm}^2" />、高さは<InlineMath math="15 \text{ cm}" />です。</p>
            <p>次を求めなさい：（a）缶の半径、（b）1缶分に必要な紙ラベルの面積。</p>
            <p className="text-xs text-white/50">（π = 3.14）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 1 — Bentuk persamaan dari luas permukaan:" : language === "en" ? "Step 1 — Form an equation from the surface area:" : "ステップ1 — 表面積から方程式をつくる："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="L = 2\pi r^2 + 2\pi r t" />
          <BlockMath math="1.507{,}2 = 2 \times 3{,}14 \times r^2 + 2 \times 3{,}14 \times r \times 15" />
          <BlockMath math="1.507{,}2 = 6{,}28 r^2 + 94{,}2 r" />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 2 — Coba nilai r yang masuk akal (r = 10):" : language === "en" ? "Step 2 — Try a reasonable value of r (r = 10):" : "ステップ2 — 妥当な r の値を試す（r = 10）："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="6{,}28 \times 100 + 94{,}2 \times 10 = 628 + 942 = 1.570 \neq 1.507{,}2" />
          <p className="text-white/60">{language === "id" ? "Coba r = 9:" : language === "en" ? "Try r = 9:" : "r = 9 を試す："}</p>
          <BlockMath math="6{,}28 \times 81 + 94{,}2 \times 9 = 508{,}68 + 847{,}8 = 1.356{,}48 \neq 1.507{,}2" />
          <p className="text-white/60">{language === "id" ? "Coba r = 10 dan sederhanakan dengan faktorisasi:" : language === "en" ? "Try r = 10 and simplify using factorization:" : "r = 10 を試し、因数分解で整理する："}</p>
          <BlockMath math="1.507{,}2 \div 6{,}28 = 240 \Rightarrow r^2 + 15r = 240" />
          <BlockMath math="r^2 + 15r - 240 = 0 \Rightarrow (r-10)(r+24)=0 \Rightarrow r = 10 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 3 — Hitung luas label (selimut saja):" : language === "en" ? "Step 3 — Calculate the label area (lateral surface only):" : "ステップ3 — ラベルの面積（側面のみ）を計算："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L_{\text{selimut}} = 2\pi r \cdot t = 2 \times 3{,}14 \times 10 \times 15 = 942 \text{ cm}^2" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
          <p className="text-red-300 font-semibold">{language === "id" ? "✅ Jawaban:" : language === "en" ? "✅ Answer:" : "✅ 答え："}</p>
          <p className="text-white/80">{language === "id" ? "• Jari-jari kaleng = " : language === "en" ? "• Radius of the can = " : "• 缶の半径 = "}<strong className="text-yellow-300">10 cm</strong></p>
          <p className="text-white/80">{language === "id" ? "• Luas label kertas = " : language === "en" ? "• Paper label area = " : "• 紙ラベルの面積 = "}<strong className="text-yellow-300">942 cm²</strong></p>
        </div>
      </div>
    ),
  },
  ];
}

function getVolExamples(language: Language): Ex[] {
  return [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah gelas silindris memiliki jari-jari <InlineMath math="5 \text{ cm}" /> dan tinggi <InlineMath math="12 \text{ cm}" />.</p>
            <p>Berapa volume gelas tersebut? (π = 3,14)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A cylindrical glass has a radius of <InlineMath math="5 \text{ cm}" /> and a height of <InlineMath math="12 \text{ cm}" />.</p>
            <p>What is the volume of the glass? (π = 3.14)</p>
          </>
        ) : (
          <>
            <p>円柱形のグラスがあり、半径は<InlineMath math="5 \text{ cm}" />、高さは<InlineMath math="12 \text{ cm}" />です。</p>
            <p>このグラスの体積はいくらですか？（π = 3.14）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="V = \pi r^2 \cdot t = 3{,}14 \times 5^2 \times 12" />
          <BlockMath math="V = 3{,}14 \times 25 \times 12 = 3{,}14 \times 300 = 942 \text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">
            {language === "id" ? "✅ Volume gelas = " : language === "en" ? "✅ Volume of the glass = " : "✅ グラスの体積 = "}
            <InlineMath math="942 \text{ cm}^3" />
          </p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        {language === "id" ? (
          <p>Sebuah drum minyak berbentuk tabung berjari-jari <InlineMath math="35 \text{ cm}" /> dan tinggi <InlineMath math="1{,}2 \text{ m}" />. Jika harga minyak <strong className="text-yellow-300">Rp3.200,00</strong> per liter, maka harga 1 drum minyak adalah ….</p>
        ) : language === "en" ? (
          <p>A cylindrical oil drum has a radius of <InlineMath math="35 \text{ cm}" /> and a height of <InlineMath math="1{,}2 \text{ m}" />. If the price of oil is <strong className="text-yellow-300">Rp3.200,00</strong> per liter, then the price of 1 drum of oil is ….</p>
        ) : (
          <p>半径<InlineMath math="35 \text{ cm}" />、高さ<InlineMath math="1{,}2 \text{ m}" />の円柱形の石油ドラムがあります。石油の価格が1リットルあたり<strong className="text-yellow-300">Rp3.200,00</strong>のとき、1ドラム分の石油の価格は……。</p>
        )}
        <p className="text-xs text-white/50">
          {language === "id" ? <>(gunakan π = <sup>22</sup>⁄<sub>7</sub> dan 1 liter = 1.000 cm³)</> : language === "en" ? <>(use π = <sup>22</sup>⁄<sub>7</sub> and 1 liter = 1,000 cm³)</> : <>（π = <sup>22</sup>⁄<sub>7</sub>、1リットル = 1,000 cm³ を使用）</>}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { opt: "A", label: "Rp1.478.400,00" },
            { opt: "B", label: "Rp1.479.200,00" },
            { opt: "C", label: "Rp1.558.400,00" },
            { opt: "D", label: "Rp1.594.400,00" },
          ].map(({ opt, label }) => (
            <div key={opt} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-white/70 font-bold text-xs shrink-0">{opt}</span>
              <span className="text-white/80 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? "Langkah 1 — Samakan satuan tinggi ke cm:" : language === "en" ? "Step 1 — Convert the height to cm:" : "ステップ1 — 高さの単位をcmにそろえる："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="t = 1{,}2 \text{ m} = 120 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? "Langkah 2 — Hitung volume drum:" : language === "en" ? "Step 2 — Calculate the drum's volume:" : "ステップ2 — ドラムの体積を計算："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="V = \pi r^2 t = \frac{22}{7} \times 35^2 \times 120" />
          <BlockMath math="V = \frac{22}{7} \times 1.225 \times 120" />
          <BlockMath math="V = 22 \times 175 \times 120" />
          <BlockMath math="V = 462.000 \text{ cm}^3" />
        </div>
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? "Langkah 3 — Konversi ke liter:" : language === "en" ? "Step 3 — Convert to liters:" : "ステップ3 — リットルに変換："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="V = \frac{462.000}{1.000} = 462 \text{ liter}" />
        </div>
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? "Langkah 4 — Hitung harga minyak:" : language === "en" ? "Step 4 — Calculate the price of the oil:" : "ステップ4 — 石油の価格を計算："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="\text{Harga} = 462 \times \text{Rp3.200,00} = \text{Rp1.478.400,00}" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { opt: "A", label: "Rp1.478.400,00", correct: true },
            { opt: "B", label: "Rp1.479.200,00", correct: false },
            { opt: "C", label: "Rp1.558.400,00", correct: false },
            { opt: "D", label: "Rp1.594.400,00", correct: false },
          ].map(({ opt, label, correct }) => (
            <div key={opt} className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${correct ? "bg-green-950/60 border-green-600/60" : "bg-slate-800/40 border-slate-700/40 opacity-50"}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs shrink-0 ${correct ? "bg-green-600 text-white" : "bg-slate-700 text-white/50"}`}>{opt}</span>
              <span className={`text-xs font-semibold ${correct ? "text-green-300" : "text-white/50"}`}>{label} {correct && "✓"}</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs">
          <p className="text-yellow-300 font-semibold">
            {language === "id" ? "✅ Jawaban: A. Rp1.478.400,00" : language === "en" ? "✅ Answer: A. Rp1.478.400,00" : "✅ 答え：A. Rp1.478.400,00"}
          </p>
          <p className="text-white/60 mt-1">
            {language === "id" ? "Volume 462 liter × Rp3.200,00/liter = Rp1.478.400,00" : language === "en" ? "Volume 462 liters × Rp3.200,00/liter = Rp1.478.400,00" : "体積462リットル × Rp3.200,00/リットル = Rp1.478.400,00"}
          </p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <div className="flex justify-center">
          <img src={"/images/image_1780761862129.png"} alt="Bak mandi tabung" className="max-h-32 object-contain rounded" />
        </div>
        {language === "id" ? (
          <>
            <p>Sebuah bak mandi terbuat dari drum plastik yang dipotong. Drum tersebut memiliki diameter <InlineMath math="60 \text{ cm}" />, tinggi <InlineMath math="42 \text{ cm}" />, dan berisi air dengan tinggi <strong className="text-red-300">seperempat</strong> dari tinggi tabung.</p>
            <p>Jika bak tersebut akan diisi dari air keran dengan debit <strong className="text-yellow-300">1,08 liter/menit</strong>, maka waktu yang diperlukan mengisi bak hingga penuh adalah ….</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A bathtub is made from a cut plastic drum. The drum has a diameter of <InlineMath math="60 \text{ cm}" />, a height of <InlineMath math="42 \text{ cm}" />, and holds water at a height of <strong className="text-red-300">one quarter</strong> of the cylinder's height.</p>
            <p>If the tub is filled from a tap with a flow rate of <strong className="text-yellow-300">1.08 liters/minute</strong>, then the time needed to fill the tub completely is ….</p>
          </>
        ) : (
          <>
            <p>あるお風呂の浴槽は、切断されたプラスチックドラムで作られています。このドラムは直径<InlineMath math="60 \text{ cm}" />、高さ<InlineMath math="42 \text{ cm}" />で、水の高さは円柱の高さの<strong className="text-red-300">4分の1</strong>です。</p>
            <p>この浴槽に流量<strong className="text-yellow-300">1.08リットル/分</strong>の水道水を満杯になるまで注ぐとき、必要な時間は……。</p>
          </>
        )}
        <p className="text-xs text-white/50">
          {language === "id" ? <>(gunakan π = <sup>22</sup>⁄<sub>7</sub> dan 1 liter = 1.000 cm³)</> : language === "en" ? <>(use π = <sup>22</sup>⁄<sub>7</sub> and 1 liter = 1,000 cm³)</> : <>（π = <sup>22</sup>⁄<sub>7</sub>、1リットル = 1,000 cm³ を使用）</>}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(language === "id"
            ? [
                { opt: "A", label: "1 jam 2 menit 30 detik" },
                { opt: "B", label: "1 jam 20 menit 30 detik" },
                { opt: "C", label: "1 jam 22 menit 30 detik" },
                { opt: "D", label: "1 jam 50 menit" },
              ]
            : language === "en"
            ? [
                { opt: "A", label: "1 hour 2 minutes 30 seconds" },
                { opt: "B", label: "1 hour 20 minutes 30 seconds" },
                { opt: "C", label: "1 hour 22 minutes 30 seconds" },
                { opt: "D", label: "1 hour 50 minutes" },
              ]
            : [
                { opt: "A", label: "1時間2分30秒" },
                { opt: "B", label: "1時間20分30秒" },
                { opt: "C", label: "1時間22分30秒" },
                { opt: "D", label: "1時間50分" },
              ]
          ).map(({ opt, label }) => (
            <div key={opt} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-white/70 font-bold text-xs shrink-0">{opt}</span>
              <span className="text-white/80 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 1 — Identifikasi data:" : language === "en" ? "Step 1 — Identify the data:" : "ステップ1 — データを確認："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          {language === "id" ? (
            <>
              <p className="text-white/70">Diameter = 60 cm → <InlineMath math="r = 30 \text{ cm}" /></p>
              <p className="text-white/70">Tinggi tabung = 42 cm</p>
              <p className="text-white/70">Tinggi air awal = <InlineMath math="\frac{1}{4} \times 42 = 10{,}5 \text{ cm}" /></p>
              <p className="text-white/70">Tinggi yang perlu diisi = <InlineMath math="42 - 10{,}5 = 31{,}5 \text{ cm}" /></p>
            </>
          ) : language === "en" ? (
            <>
              <p className="text-white/70">Diameter = 60 cm → <InlineMath math="r = 30 \text{ cm}" /></p>
              <p className="text-white/70">Height of cylinder = 42 cm</p>
              <p className="text-white/70">Initial water height = <InlineMath math="\frac{1}{4} \times 42 = 10{,}5 \text{ cm}" /></p>
              <p className="text-white/70">Height still needed = <InlineMath math="42 - 10{,}5 = 31{,}5 \text{ cm}" /></p>
            </>
          ) : (
            <>
              <p className="text-white/70">直径 = 60 cm → <InlineMath math="r = 30 \text{ cm}" /></p>
              <p className="text-white/70">円柱の高さ = 42 cm</p>
              <p className="text-white/70">最初の水の高さ = <InlineMath math="\frac{1}{4} \times 42 = 10{,}5 \text{ cm}" /></p>
              <p className="text-white/70">まだ入れる必要のある高さ = <InlineMath math="42 - 10{,}5 = 31{,}5 \text{ cm}" /></p>
            </>
          )}
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 2 — Hitung volume air yang perlu ditambah:" : language === "en" ? "Step 2 — Calculate the volume of water still needed:" : "ステップ2 — 追加が必要な水の体積を計算："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="V = \pi r^2 t = \frac{22}{7} \times 30^2 \times 31{,}5" />
          <BlockMath math="V = \frac{22}{7} \times 900 \times 31{,}5 = 22 \times 900 \times \frac{31{,}5}{7}" />
          <BlockMath math="V = 22 \times 900 \times 4{,}5 = 22 \times 4.050" />
          <BlockMath math="V = 89.100 \text{ cm}^3 = 89{,}1 \text{ liter}" />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 3 — Hitung waktu pengisian:" : language === "en" ? "Step 3 — Calculate the filling time:" : "ステップ3 — 給水時間を計算："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="\text{Waktu} = \frac{89{,}1 \text{ liter}}{1{,}08 \text{ liter/menit}} = 82{,}5 \text{ menit}" />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 4 — Konversi menit ke jam, menit, detik:" : language === "en" ? "Step 4 — Convert minutes to hours, minutes, seconds:" : "ステップ4 — 分を時・分・秒に変換："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          {language === "id" ? (
            <>
              <p className="text-white/70">82,5 menit = <strong>60 menit + 22,5 menit</strong></p>
              <p className="text-white/70">0,5 menit = 30 detik</p>
              <p className="text-white/70">∴ Waktu = <strong className="text-green-300">1 jam 22 menit 30 detik</strong></p>
            </>
          ) : language === "en" ? (
            <>
              <p className="text-white/70">82.5 minutes = <strong>60 minutes + 22.5 minutes</strong></p>
              <p className="text-white/70">0.5 minutes = 30 seconds</p>
              <p className="text-white/70">∴ Time = <strong className="text-green-300">1 hour 22 minutes 30 seconds</strong></p>
            </>
          ) : (
            <>
              <p className="text-white/70">82.5分 = <strong>60分 + 22.5分</strong></p>
              <p className="text-white/70">0.5分 = 30秒</p>
              <p className="text-white/70">∴ 時間 = <strong className="text-green-300">1時間22分30秒</strong></p>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(language === "id"
            ? [
                { opt: "A", label: "1 jam 2 menit 30 detik", correct: false },
                { opt: "B", label: "1 jam 20 menit 30 detik", correct: false },
                { opt: "C", label: "1 jam 22 menit 30 detik", correct: true },
                { opt: "D", label: "1 jam 50 menit", correct: false },
              ]
            : language === "en"
            ? [
                { opt: "A", label: "1 hour 2 minutes 30 seconds", correct: false },
                { opt: "B", label: "1 hour 20 minutes 30 seconds", correct: false },
                { opt: "C", label: "1 hour 22 minutes 30 seconds", correct: true },
                { opt: "D", label: "1 hour 50 minutes", correct: false },
              ]
            : [
                { opt: "A", label: "1時間2分30秒", correct: false },
                { opt: "B", label: "1時間20分30秒", correct: false },
                { opt: "C", label: "1時間22分30秒", correct: true },
                { opt: "D", label: "1時間50分", correct: false },
              ]
          ).map(({ opt, label, correct }) => (
            <div key={opt} className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${correct ? "bg-green-950/60 border-green-600/60" : "bg-slate-800/40 border-slate-700/40 opacity-50"}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs shrink-0 ${correct ? "bg-green-600 text-white" : "bg-slate-700 text-white/50"}`}>{opt}</span>
              <span className={`text-xs font-semibold ${correct ? "text-green-300" : "text-white/50"}`}>{label} {correct && "✓"}</span>
            </div>
          ))}
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs">
          <p className="text-red-300 font-semibold">
            {language === "id" ? "✅ Jawaban: C. 1 jam 22 menit 30 detik" : language === "en" ? "✅ Answer: C. 1 hour 22 minutes 30 seconds" : "✅ 答え：C. 1時間22分30秒"}
          </p>
          <p className="text-white/60 mt-1">
            {language === "id"
              ? "V = 89.100 cm³ = 89,1 liter → 89,1 ÷ 1,08 = 82,5 menit = 1 jam 22 menit 30 detik"
              : language === "en"
              ? "V = 89,100 cm³ = 89.1 liters → 89.1 ÷ 1.08 = 82.5 minutes = 1 hour 22 minutes 30 seconds"
              : "V = 89,100 cm³ = 89.1リットル → 89.1 ÷ 1.08 = 82.5分 = 1時間22分30秒"}
          </p>
        </div>
      </div>
    ),
  },
  ];
}

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */
function getUnsurExamples(language: Language): Ex[] {
  return [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        {language === "id" ? (
          <p>Ada berapa <strong className="text-green-300">sisi</strong>, <strong className="text-amber-300">rusuk</strong>, dan <strong className="text-sky-300">titik sudut</strong> pada sebuah tabung?</p>
        ) : language === "en" ? (
          <p>How many <strong className="text-green-300">faces</strong>, <strong className="text-amber-300">edges</strong>, and <strong className="text-sky-300">vertices</strong> does a cylinder have?</p>
        ) : (
          <p>円柱には<strong className="text-green-300">面</strong>、<strong className="text-amber-300">辺</strong>、<strong className="text-sky-300">頂点</strong>がそれぞれいくつありますか？</p>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {language === "id" ? (
            <>
              <div className="bg-green-950/60 border border-green-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-green-300 mb-1">3</p>
                <p className="text-green-200 font-bold">Sisi</p>
                <p className="text-white/50 text-[10px] mt-1">Selimut + Alas + Tutup</p>
              </div>
              <div className="bg-amber-950/60 border border-amber-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-amber-300 mb-1">2</p>
                <p className="text-amber-200 font-bold">Rusuk</p>
                <p className="text-white/50 text-[10px] mt-1">Lingkaran atas &amp; bawah</p>
              </div>
              <div className="bg-sky-950/60 border border-sky-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-sky-300 mb-1">0</p>
                <p className="text-sky-200 font-bold">Titik Sudut</p>
                <p className="text-white/50 text-[10px] mt-1">Tidak ada sama sekali</p>
              </div>
            </>
          ) : language === "en" ? (
            <>
              <div className="bg-green-950/60 border border-green-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-green-300 mb-1">3</p>
                <p className="text-green-200 font-bold">Faces</p>
                <p className="text-white/50 text-[10px] mt-1">Lateral surface + base + top</p>
              </div>
              <div className="bg-amber-950/60 border border-amber-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-amber-300 mb-1">2</p>
                <p className="text-amber-200 font-bold">Edges</p>
                <p className="text-white/50 text-[10px] mt-1">Top &amp; bottom circles</p>
              </div>
              <div className="bg-sky-950/60 border border-sky-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-sky-300 mb-1">0</p>
                <p className="text-sky-200 font-bold">Vertices</p>
                <p className="text-white/50 text-[10px] mt-1">None at all</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-950/60 border border-green-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-green-300 mb-1">3</p>
                <p className="text-green-200 font-bold">面</p>
                <p className="text-white/50 text-[10px] mt-1">側面＋底面＋上面</p>
              </div>
              <div className="bg-amber-950/60 border border-amber-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-amber-300 mb-1">2</p>
                <p className="text-amber-200 font-bold">辺</p>
                <p className="text-white/50 text-[10px] mt-1">上下の円</p>
              </div>
              <div className="bg-sky-950/60 border border-sky-700/40 rounded-lg p-3">
                <p className="text-3xl font-bold text-sky-300 mb-1">0</p>
                <p className="text-sky-200 font-bold">頂点</p>
                <p className="text-white/50 text-[10px] mt-1">まったくない</p>
              </div>
            </>
          )}
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3 text-xs">
          {language === "id" ? (
            <>
              <p className="text-green-300 font-semibold">✅ Jawaban: Sisi = <strong>3</strong>, Rusuk = <strong>2</strong>, Titik Sudut = <strong>0</strong></p>
              <p className="text-white/60 mt-1">💡 Tabung tidak punya rusuk lurus maupun titik sudut — berbeda dengan kubus/balok!</p>
            </>
          ) : language === "en" ? (
            <>
              <p className="text-green-300 font-semibold">✅ Answer: Faces = <strong>3</strong>, Edges = <strong>2</strong>, Vertices = <strong>0</strong></p>
              <p className="text-white/60 mt-1">💡 A cylinder has no straight edges or vertices — unlike a cube or cuboid!</p>
            </>
          ) : (
            <>
              <p className="text-green-300 font-semibold">✅ 答え：面 = <strong>3</strong>、辺 = <strong>2</strong>、頂点 = <strong>0</strong></p>
              <p className="text-white/60 mt-1">💡 円柱には直線の辺も頂点もありません — 立方体や直方体とは違います！</p>
            </>
          )}
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        {language === "id" ? (
          <p>Bentuk bangun dari <strong className="text-purple-300">selimut tabung</strong> adalah ….</p>
        ) : language === "en" ? (
          <p>The shape formed by unrolling the <strong className="text-purple-300">lateral surface of a cylinder</strong> is ….</p>
        ) : (
          <p><strong className="text-purple-300">円柱の側面</strong>を展開した形は……。</p>
        )}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(language === "id"
            ? [
                { opt: "A", label: "Segi empat" },
                { opt: "B", label: "Persegi panjang" },
                { opt: "C", label: "Belah ketupat" },
                { opt: "D", label: "Bidang lengkung" },
              ]
            : language === "en"
            ? [
                { opt: "A", label: "Quadrilateral" },
                { opt: "B", label: "Rectangle" },
                { opt: "C", label: "Rhombus" },
                { opt: "D", label: "Curved surface" },
              ]
            : [
                { opt: "A", label: "四角形" },
                { opt: "B", label: "長方形" },
                { opt: "C", label: "ひし形" },
                { opt: "D", label: "曲面" },
              ]
          ).map(({ opt, label }) => (
            <div key={opt} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-white/70 font-bold text-xs shrink-0">{opt}</span>
              <span className="text-white/80 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(language === "id"
            ? [
                { opt: "A", label: "Segi empat", correct: false },
                { opt: "B", label: "Persegi panjang", correct: true },
                { opt: "C", label: "Belah ketupat", correct: false },
                { opt: "D", label: "Bidang lengkung", correct: false },
              ]
            : language === "en"
            ? [
                { opt: "A", label: "Quadrilateral", correct: false },
                { opt: "B", label: "Rectangle", correct: true },
                { opt: "C", label: "Rhombus", correct: false },
                { opt: "D", label: "Curved surface", correct: false },
              ]
            : [
                { opt: "A", label: "四角形", correct: false },
                { opt: "B", label: "長方形", correct: true },
                { opt: "C", label: "ひし形", correct: false },
                { opt: "D", label: "曲面", correct: false },
              ]
          ).map(({ opt, label, correct }) => (
            <div key={opt} className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${correct ? "bg-green-950/60 border-green-600/60" : "bg-slate-800/40 border-slate-700/40 opacity-50"}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs shrink-0 ${correct ? "bg-green-600 text-white" : "bg-slate-700 text-white/50"}`}>{opt}</span>
              <span className={`text-xs font-semibold ${correct ? "text-green-300" : "text-white/50"}`}>{label} {correct && "✓"}</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs space-y-1">
          {language === "id" ? (
            <>
              <p className="text-yellow-300 font-semibold">✅ Jawaban: B. Persegi Panjang</p>
              <p className="text-white/70">Ketika selimut tabung "dibuka" dan diratakan, bentuknya adalah <strong className="text-purple-300">persegi panjang</strong> dengan panjang = 2πr (keliling lingkaran) dan lebar = t (tinggi tabung).</p>
            </>
          ) : language === "en" ? (
            <>
              <p className="text-yellow-300 font-semibold">✅ Answer: B. Rectangle</p>
              <p className="text-white/70">When the cylinder's lateral surface is "unrolled" and flattened, its shape is a <strong className="text-purple-300">rectangle</strong> with length = 2πr (the circle's circumference) and width = t (the cylinder's height).</p>
            </>
          ) : (
            <>
              <p className="text-yellow-300 font-semibold">✅ 答え：B. 長方形</p>
              <p className="text-white/70">円柱の側面を「開いて」平らにすると、その形は縦 = 2πr（円周）、横 = t（円柱の高さ）の<strong className="text-purple-300">長方形</strong>になります。</p>
            </>
          )}
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>{language === "id" ? "Perhatikan gambar selimut tabung berikut." : language === "en" ? "Look at the following picture of a cylinder's lateral surface." : "次の円柱の側面の図を見てください。"}</p>

        {/* SVG selimut tabung — persegi panjang dengan keterangan ukuran */}
        <svg viewBox="0 0 400 180" className="w-full max-w-xs mx-auto block" aria-label={language === "id" ? "Selimut tabung: lebar 22 cm, tinggi t = 10 cm" : language === "en" ? "Cylinder lateral surface: width 22 cm, height t = 10 cm" : "円柱の側面：幅22 cm、高さ t = 10 cm"}>
          {/* Persegi panjang selimut */}
          <rect x="30" y="20" width="230" height="120" fill="none" stroke="#e2e8f0" strokeWidth="2"/>

          {/* Dimensi bawah: 22 cm */}
          <line x1="30"  y1="158" x2="260" y2="158" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="30"  y1="152" x2="30"  y2="164" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="260" y1="152" x2="260" y2="164" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="145" y="175" fill="#f59e0b" fontSize="13" fontFamily="monospace" fontWeight="700" textAnchor="middle">22 cm</text>

          {/* Dimensi kanan: t = 10 cm */}
          <line x1="278" y1="20"  x2="278" y2="140" stroke="#22c55e" strokeWidth="1.5"/>
          <line x1="272" y1="20"  x2="284" y2="20"  stroke="#22c55e" strokeWidth="1.5"/>
          <line x1="272" y1="140" x2="284" y2="140" stroke="#22c55e" strokeWidth="1.5"/>
          <text x="290" y="77" fill="#22c55e" fontSize="12" fontFamily="monospace" fontWeight="700" textAnchor="start">t = 10 cm</text>
          <text x="290" y="93" fill="#86efac" fontSize="9"  fontFamily="monospace" textAnchor="start">{language === "id" ? "(tinggi)" : language === "en" ? "(height)" : "（高さ）"}</text>
        </svg>

        <p>{language === "id" ? "Jari-jari tabung yang terjadi adalah …." : language === "en" ? "The resulting radius of the cylinder is …." : "このとき円柱の半径は……。"}</p>
        <p className="text-white/50 text-xs">{language === "id" ? <>(gunakan π = <sup>22</sup>⁄<sub>7</sub>)</> : language === "en" ? <>(use π = <sup>22</sup>⁄<sub>7</sub>)</> : <>（π = <sup>22</sup>⁄<sub>7</sub> を使用）</>}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { opt: "A", label: "3,5 cm" },
            { opt: "B", label: "5 cm" },
            { opt: "C", label: "7 cm" },
            { opt: "D", label: "10 cm" },
          ].map(({ opt, label }) => (
            <div key={opt} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-white/70 font-bold text-xs shrink-0">{opt}</span>
              <span className="text-white/80 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">{language === "id" ? "Pembahasan:" : language === "en" ? "Solution:" : "解説："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <p className="text-white/70">
            {language === "id" ? "Lebar selimut = keliling lingkaran alas = 22 cm" : language === "en" ? "Width of the lateral surface = circumference of the base circle = 22 cm" : "側面の幅 = 底面の円周 = 22 cm"}
          </p>
          <BlockMath math="2\pi r = 22" />
          <BlockMath math="2 \times \frac{22}{7} \times r = 22" />
          <BlockMath math="\frac{44}{7} \times r = 22" />
          <BlockMath math="r = 22 \times \frac{7}{44} = \frac{154}{44} = 3{,}5 \text{ cm}" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { opt: "A", label: "3,5 cm", correct: true },
            { opt: "B", label: "5 cm", correct: false },
            { opt: "C", label: "7 cm", correct: false },
            { opt: "D", label: "10 cm", correct: false },
          ].map(({ opt, label, correct }) => (
            <div key={opt} className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${correct ? "bg-green-950/60 border-green-600/60" : "bg-slate-800/40 border-slate-700/40 opacity-50"}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs shrink-0 ${correct ? "bg-green-600 text-white" : "bg-slate-700 text-white/50"}`}>{opt}</span>
              <span className={`text-xs font-semibold ${correct ? "text-green-300" : "text-white/50"}`}>{label} {correct && "✓"}</span>
            </div>
          ))}
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs">
          <p className="text-red-300 font-semibold">{language === "id" ? "✅ Jawaban: A. 3,5 cm" : language === "en" ? "✅ Answer: A. 3.5 cm" : "✅ 答え：A. 3.5 cm"}</p>
          <p className="text-white/60 mt-1">
            {language === "id" ? "Lebar persegi panjang selimut = keliling lingkaran = 2πr, sehingga r = 3,5 cm" : language === "en" ? "Width of the lateral surface rectangle = circle's circumference = 2πr, so r = 3.5 cm" : "側面の長方形の幅 = 円周 = 2πr なので、r = 3.5 cm"}
          </p>
        </div>
      </div>
    ),
  },
  ];
}

const ExampleCard = ({ ex, idx, prefix, language, showLabel, hideLabel }: { ex: Ex; idx: number; prefix: string; language: Language; showLabel: string; hideLabel: string }) => {
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
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? hideLabel : showLabel}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE — SLIDE LAYOUT
───────────────────────────────────────────────────────────── */
const TabungPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();
  const sections = getSections(language);

  /* ── Kesimpulan / Rangkuman / Tips — trilingual ── */
  const kesimpulanTrans = {
    id: {
      slideTitle: "Kesimpulan — Rumus Lengkap Tabung",
      hBesaran: "Besaran", hRumus: "Rumus", hCatatan: "Catatan",
      rows: [
        ["Keliling alas / tutup",     "K = 2πr",           "Lingkaran"],
        ["Luas alas / tutup",         "L₀ = πr²",          "Lingkaran"],
        ["Luas selimut",              "Ls = 2πrt",          "Persegi panjang yang digulung"],
        ["Luas permukaan (tertutup)", "L = 2πr² + 2πrt",   "Semua sisi"],
        ["Luas permukaan (terbuka)",  "L = πr² + 2πrt",    "Tanpa tutup atas"],
        ["Volume",                    "V = πr²t",           "Luas alas × tinggi"],
      ] as [string, string, string][],
      tipKey:  "Kunci utama tabung:",
      tipBody: "Semua rumus bergantung pada",
      tipR:    "r (jari-jari)",
      tipAnd:  "dan",
      tipT:    "t (tinggi)",
      tipPi:   "Ingat:",
      tipPiOr: "atau",
      tipNote: "(gunakan sesuai petunjuk soal!)",
    },
    en: {
      slideTitle: "Summary — Complete Cylinder Formulas",
      hBesaran: "Quantity", hRumus: "Formula", hCatatan: "Notes",
      rows: [
        ["Base / top circumference",    "K = 2πr",         "Circle"],
        ["Base / top area",             "L₀ = πr²",        "Circle"],
        ["Lateral surface area",        "Ls = 2πrt",        "Rectangle rolled up"],
        ["Total surface area (closed)", "L = 2πr² + 2πrt", "All sides"],
        ["Total surface area (open)",   "L = πr² + 2πrt",  "Without top cap"],
        ["Volume",                      "V = πr²t",         "Base area × height"],
      ] as [string, string, string][],
      tipKey:  "Key to the cylinder:",
      tipBody: "All formulas depend on",
      tipR:    "r (radius)",
      tipAnd:  "and",
      tipT:    "t (height)",
      tipPi:   "Remember:",
      tipPiOr: "or",
      tipNote: "(use as directed in the problem!)",
    },
    ja: {
      slideTitle: "まとめ — 円柱の完全な公式",
      hBesaran: "量", hRumus: "公式", hCatatan: "備考",
      rows: [
        ["底面・頂面の周長",   "K = 2πr",           "円"],
        ["底面・頂面の面積",   "L₀ = πr²",          "円"],
        ["側面積",             "Ls = 2πrt",          "丸めた長方形"],
        ["全表面積（蓋あり）", "L = 2πr² + 2πrt",   "全面"],
        ["全表面積（蓋なし）", "L = πr² + 2πrt",    "上蓋なし"],
        ["体積",               "V = πr²t",           "底面積×高さ"],
      ] as [string, string, string][],
      tipKey:  "円柱のポイント：",
      tipBody: "すべての公式は",
      tipR:    "r（半径）",
      tipAnd:  "と",
      tipT:    "t（高さ）に依存します",
      tipPi:   "覚えておこう：",
      tipPiOr: "または",
      tipNote: "（問題の指示に従って使いましょう！）",
    },
  };

  const ck = kesimpulanTrans[language];
  const unsurExamples = getUnsurExamples(language);
  const luasExamples = getLuasExamples(language);
  const volExamples = getVolExamples(language);

  const contohSoalTrans = {
    id: {
      unsurTitle: "Contoh Soal — Unsur-unsur Tabung",
      unsurSubtitle: "Uji pemahamanmu tentang unsur-unsur tabung",
      luasTitle: "Contoh Soal — Luas Permukaan",
      luasSubtitle: "Latihan bertingkat dari mudah hingga sulit",
      volTitle: "Contoh Soal — Volume",
      volSubtitle: "Latihan bertingkat dari mudah hingga sulit",
      pageSubtitle: "Kelas 9 · Bangun Ruang Sisi Lengkung",
      slideLabel: "Slide",
      prev: "← Sebelumnya",
      next: "Selanjutnya →",
      back: "← Kembali ke Bangun Ruang Sisi Lengkung",
      unsurPrefix: "SOAL",
      luasPrefix: "LUAS",
      volPrefix: "VOLUME",
      showSolution: "Lihat Pembahasan",
      hideSolution: "Sembunyikan",
    },
    en: {
      unsurTitle: "Examples — Elements of a Cylinder",
      unsurSubtitle: "Test your understanding of the elements of a cylinder",
      luasTitle: "Examples — Surface Area",
      luasSubtitle: "Graded practice from easy to hard",
      volTitle: "Examples — Volume",
      volSubtitle: "Graded practice from easy to hard",
      pageSubtitle: "Grade 9 · Curved-Surface Solids",
      slideLabel: "Slide",
      prev: "← Previous",
      next: "Next →",
      back: "← Back to Curved-Surface Solids",
      unsurPrefix: "PROBLEM",
      luasPrefix: "SURFACE AREA",
      volPrefix: "VOLUME",
      showSolution: "Show Solution",
      hideSolution: "Hide",
    },
    ja: {
      unsurTitle: "例題 — 円柱の構成要素",
      unsurSubtitle: "円柱の構成要素についての理解を確認しよう",
      luasTitle: "例題 — 表面積",
      luasSubtitle: "易しい問題から難しい問題までの段階的練習",
      volTitle: "例題 — 体積",
      volSubtitle: "易しい問題から難しい問題までの段階的練習",
      pageSubtitle: "9年生・曲面図形",
      slideLabel: "スライド",
      prev: "← 前へ",
      next: "次へ →",
      back: "← 曲面図形に戻る",
      unsurPrefix: "問題",
      luasPrefix: "表面積問題",
      volPrefix: "体積問題",
      showSolution: "解説を見る",
      hideSolution: "隠す",
    },
  };
  const cs = contohSoalTrans[language];

  const kesimpulanSlide = {
    title: ck.slideTitle,
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{ck.hBesaran}</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ck.hRumus}</th>
              <th className="px-3 py-2 text-cyan-300">{ck.hCatatan}</th>
            </tr></thead>
            <tbody>
              {ck.rows.map(([b, fml, cat], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{fml}</td>
                  <td className="px-3 py-2 text-white/55 text-left">{cat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p>🚀 <strong>{ck.tipKey}</strong> {ck.tipBody} <strong className="text-yellow-300">{ck.tipR}</strong> {ck.tipAnd} <strong className="text-green-300">{ck.tipT}</strong>.</p>
          <p>{ck.tipPi} <InlineMath math="\pi \approx 3{,}14" /> {ck.tipPiOr} <InlineMath math="\frac{22}{7}" /> {ck.tipNote}</p>
        </div>
      </div>
    ),
  };

  const slides = [
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    kesimpulanSlide,
    {
      title: cs.unsurTitle,
      icon: "🏷️",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{cs.unsurSubtitle}</p>
          {unsurExamples.map((ex, i) => <ExampleCard key={`u${i}`} ex={ex} idx={i} prefix={cs.unsurPrefix} language={language} showLabel={cs.showSolution} hideLabel={cs.hideSolution}/>)}
        </div>
      ),
    },
    {
      title: cs.luasTitle,
      icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{cs.luasSubtitle}</p>
          {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix={cs.luasPrefix} language={language} showLabel={cs.showSolution} hideLabel={cs.hideSolution}/>)}
        </div>
      ),
    },
    {
      title: cs.volTitle,
      icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{cs.volSubtitle}</p>
          {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix={cs.volPrefix} language={language} showLabel={cs.showSolution} hideLabel={cs.hideSolution}/>)}
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

        <Database className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          TABUNG
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{cs.pageSubtitle}</p>

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
                {cs.slideLabel} {currentSlide + 1} / {totalSlides}
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
            {cs.prev}
          </button>
          <span className="text-white/30 text-xs font-body">{currentSlide + 1} / {totalSlides}</span>
          <button
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold font-body bg-primary/20 border border-primary/50 text-primary rounded-xl hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {cs.next}
          </button>
        </div>

        <div className="text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {cs.back}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TabungPage;
