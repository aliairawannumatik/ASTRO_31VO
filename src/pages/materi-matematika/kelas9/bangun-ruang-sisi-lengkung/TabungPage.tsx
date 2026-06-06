import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import imgSelimutSoal from "@assets/image_1780761230749.png";
import imgSarden from "@assets/image_1780450794282.png";
import imgBiskuit from "@assets/image_1780450814436.png";
import imgIndomilk from "@assets/image_1780450845492.png";
import imgDrum from "@assets/image_1780450861720.png";
import imgBedug from "@assets/image_1780450884364.png";
import imgTong from "@assets/image_1780450893223.png";
import imgGelas from "@assets/image_1780450901986.png";
import imgGedung from "@assets/image_1780450906978.png";

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
    const t = e.touches[0];
    setRotY(dragRef.current.bry + (t.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.brx + (t.clientY - dragRef.current.sy) * 0.55);
  }, [isDragging]);
  const onTE = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onTM, { passive: true });
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
const CylinderNetAnimation = () => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(28);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ sx: 0, sy: 0, brx: -22, bry: 28 });
  const hasDragged = useRef(false);

  type OS = boolean | "closing";
  const [topOpen, setTopOpen] = useState<OS>(false);
  const [botOpen, setBotOpen] = useState<OS>(false);
  const [selOpen, setSelOpen] = useState<OS>(false);
  const anyOpen = topOpen !== false || botOpen !== false || selOpen !== false;

  const onMD = (e: React.MouseEvent) => {
    hasDragged.current = false;
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, brx: rotX, bry: rotY };
  };
  const onMM = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.sx, dy = e.clientY - dragRef.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) hasDragged.current = true;
    setRotY(dragRef.current.bry + dx * 0.55);
    setRotX(dragRef.current.brx + dy * 0.55);
  }, [isDragging]);
  const onMU = useCallback(() => setIsDragging(false), []);
  const onTS = (e: React.TouchEvent) => {
    hasDragged.current = false;
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { sx: t.clientX, sy: t.clientY, brx: rotX, bry: rotY };
  };
  const onTM = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.sx, dy = t.clientY - dragRef.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) hasDragged.current = true;
    setRotY(dragRef.current.bry + dx * 0.55);
    setRotX(dragRef.current.brx + dy * 0.55);
  }, [isDragging]);
  const onTE = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onTM, { passive: true });
    window.addEventListener("touchend", onTE);
    return () => {
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("touchend", onTE);
    };
  }, [onMM, onMU, onTM, onTE]);

  useEffect(() => {
    if (isDragging || anyOpen) return;
    let frameId: number; let lastTs = 0;
    const animate = (ts: number) => {
      if (lastTs) setRotY(prev => prev + (ts - lastTs) * 0.028);
      lastTs = ts; frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging, anyOpen]);

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

  type XPanel = { avgZ: number; visible: boolean; fill: string; stroke: string; points: string };
  const panels: XPanel[] = Array.from({ length: CYL_SEGS }, (_, i) => {
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
      avgZ, visible,
      fill: visible ? `hsla(${hue},80%,${selOpen ? 32 : 55}%,${selOpen ? 0.45 : 0.88})` : "rgba(100,150,200,0.06)",
      stroke: visible ? (selOpen ? "#ffffff22" : "#ffffff55") : "#ffffff15",
      points: `${p_t0.x},${p_t0.y} ${p_t1.x},${p_t1.y} ${p_b1.x},${p_b1.y} ${p_b0.x},${p_b0.y}`,
    };
  });
  const sortedPanels = [...panels].sort((a, b) => b.avgZ - a.avgZ);

  const topCapAvgZ = topVerts3D.reduce((s, v) => s + v.z, 0) / CYL_SEGS;
  const botCapAvgZ = botVerts3D.reduce((s, v) => s + v.z, 0) / CYL_SEGS;
  const topPolyPts = topVerts2D.map(p => `${p.x},${p.y}`).join(" ");
  const botPolyPts = botVerts2D.map(p => `${p.x},${p.y}`).join(" ");
  const topC = cylProj(cylRotPt(0, -CYL_H / 2, 0, rotX, rotY));
  const botC = cylProj(cylRotPt(0,  CYL_H / 2, 0, rotX, rotY));
  const topVisible = rotX < 10;
  const botVisible = rotX > -60;

  const tryToggle = (state: OS, setter: React.Dispatch<React.SetStateAction<OS>>) => {
    if (hasDragged.current || state === "closing") return;
    playPopSound();
    setter(state === false ? true : "closing");
  };

  const resetAll = () => {
    playPopSound();
    if (topOpen === true) setTopOpen("closing");
    if (botOpen === true) setBotOpen("closing");
    if (selOpen === true) setSelOpen("closing");
  };

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
      <p className="text-white/60 text-xs text-center font-body">
        {anyOpen
          ? "Klik bagian yang terbuka untuk menutup · Klik bagian lain untuk membuka"
          : "Drag untuk memutar · Klik tutup atas, selimut, atau alas untuk membukanya"}
      </p>

      <svg
        viewBox={`0 -42 ${CYL_W} ${CYL_H_SVG + 84}`}
        width="100%"
        style={{ maxWidth: CYL_W, display: "block", margin: "0 auto", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMD}
        onTouchStart={onTS}
      >
        <defs>
          <marker id="nArrL" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto-start-reverse">
            <path d="M4,0 L4,4 L0,2 z" fill="#a855f7"/>
          </marker>
          <marker id="nArrR" markerWidth="4" markerHeight="4" refX="0" refY="2" orient="auto">
            <path d="M0,0 L0,4 L4,2 z" fill="#a855f7"/>
          </marker>
          <style>{`
            @keyframes netUnroll {
              0%   { clip-path: inset(5% 47% 5% 47% round 50%); opacity:0.3; }
              10%  { opacity:1; }
              30%  { clip-path: inset(2% 37% 2% 37% round 42%); }
              55%  { clip-path: inset(0% 22% 0% 22% round 24%); }
              75%  { clip-path: inset(0%  8% 0%  8% round 10%); }
              90%  { clip-path: inset(0%  1% 0%  1% round  3px); }
              100% { clip-path: inset(0%  0% 0%  0% round  3px); opacity:1; }
            }
            @keyframes hingeCapTop {
              0%   { transform: perspective(320px) rotateX(-90deg); opacity:0.15; }
              60%  { transform: perspective(320px) rotateX(-12deg); opacity:1; }
              80%  { transform: perspective(320px) rotateX(4deg); }
              100% { transform: perspective(320px) rotateX(0deg); }
            }
            @keyframes hingeCapBot {
              0%   { transform: perspective(320px) rotateX(90deg);  opacity:0.15; }
              60%  { transform: perspective(320px) rotateX(12deg);  opacity:1; }
              80%  { transform: perspective(320px) rotateX(-4deg); }
              100% { transform: perspective(320px) rotateX(0deg); }
            }
            @keyframes netFadeIn { from{opacity:0} to{opacity:1} }
            @keyframes netUnrollClose {
              0%   { clip-path: inset(0%  0% 0%  0% round  3px); opacity:1; }
              15%  { clip-path: inset(0%  9% 0%  9% round 10%); }
              40%  { clip-path: inset(0% 23% 0% 23% round 24%); }
              65%  { clip-path: inset(2% 37% 2% 37% round 42%); }
              85%  { clip-path: inset(5% 46% 5% 46% round 48%); opacity:0.4; }
              100% { clip-path: inset(5% 47% 5% 47% round 50%); opacity:0; }
            }
            @keyframes hingeCapTopClose {
              0%   { transform: perspective(320px) rotateX(0deg);   opacity:1; }
              20%  { transform: perspective(320px) rotateX(-6deg); }
              100% { transform: perspective(320px) rotateX(90deg);  opacity:0.1; }
            }
            @keyframes hingeCapBotClose {
              0%   { transform: perspective(320px) rotateX(0deg);   opacity:1; }
              20%  { transform: perspective(320px) rotateX(6deg); }
              100% { transform: perspective(320px) rotateX(-90deg); opacity:0.1; }
            }
            .net-unroll {
              animation: netUnroll 2.8s cubic-bezier(0.16,1,0.3,1) both;
            }
            .net-unroll-close {
              animation: netUnrollClose 1.4s cubic-bezier(0.7,0,0.84,0) both;
            }
            .hinge-top {
              animation: hingeCapTop 1.5s cubic-bezier(0.22,0,0.1,1) both;
              transform-box:fill-box;
              transform-origin:center bottom;
            }
            .hinge-top-close {
              animation: hingeCapTopClose 1.1s cubic-bezier(0.4,0,0.8,1) both;
              transform-box:fill-box;
              transform-origin:center bottom;
            }
            .hinge-bot {
              animation: hingeCapBot 1.5s cubic-bezier(0.22,0,0.1,1) both;
              transform-box:fill-box;
              transform-origin:center top;
            }
            .hinge-bot-close {
              animation: hingeCapBotClose 1.1s cubic-bezier(0.4,0,0.8,1) both;
              transform-box:fill-box;
              transform-origin:center top;
            }
            .net-fadein { animation: netFadeIn 0.5s 2.3s ease both; }
          `}</style>
        </defs>

        {/* ── Ghost hidden body panels — rendered FIRST (behind everything) ── */}
        <g style={{ pointerEvents: "none" }}>
          {sortedPanels.map((p, i) =>
            !p.visible && <polygon key={`g${i}`} points={p.points} fill="rgba(100,150,200,0.06)" stroke="#ffffff15" strokeWidth="0.5" />
          )}
        </g>

        {/* ── SELIMUT (body panels) — click to unroll into rectangle ── */}
        <g onClick={() => tryToggle(selOpen, setSelOpen)} style={{ cursor: "pointer" }}>
          {/* 3D visible panels — fade out when selOpen is true or closing */}
          <g style={{ opacity: selOpen !== false ? 0.06 : 1, transition: "opacity 0.45s ease" }}>
            {sortedPanels.map((p, i) =>
              p.visible && <polygon key={i} points={p.points} fill={p.fill} stroke={p.stroke} strokeWidth="0.8" />
            )}
          </g>

          {/* Unrolled rectangle — shown when open or closing */}
          {selOpen !== false && (() => {
            const rx = CYL_CX - 118, ry = CYL_CY - CYL_H / 2, rw = 236, rh = CYL_H;
            const isClosing = selOpen === "closing";
            return (
              <>
                <rect x={rx} y={ry} width={rw} height={rh} rx={3}
                  fill="rgba(168,85,247,0.28)" stroke="#a855f7" strokeWidth="1.8"
                  className={isClosing ? "net-unroll-close" : "net-unroll"}
                  onAnimationEnd={isClosing ? () => setSelOpen(false) : undefined}
                />
                <g className={isClosing ? "" : "net-fadein"}
                  style={{ opacity: isClosing ? 0 : undefined, transition: isClosing ? "opacity 0.2s" : undefined }}>
                  <text x={CYL_CX} y={CYL_CY - 2} fill="#e9d5ff" fontSize="10" fontFamily="monospace" fontWeight="700" textAnchor="middle">SELIMUT TABUNG</text>
                  <text x={CYL_CX} y={CYL_CY + 13} fill="#c4b5fd" fontSize="9" fontFamily="monospace" textAnchor="middle">p = 2πr &nbsp; · &nbsp; l = t</text>
                  <line x1={rx} y1={ry - 13} x2={rx + rw} y2={ry - 13} stroke="#a855f7" strokeWidth="1" markerStart="url(#nArrL)" markerEnd="url(#nArrR)" />
                  <text x={CYL_CX} y={ry - 16} fill="#a855f7" fontSize="8" fontFamily="monospace" textAnchor="middle">2πr (keliling alas)</text>
                  <line x1={rx + rw + 10} y1={ry}      x2={rx + rw + 10} y2={ry + rh} stroke="#a855f7" strokeWidth="1" />
                  <line x1={rx + rw + 5}  y1={ry}      x2={rx + rw + 15} y2={ry}      stroke="#a855f7" strokeWidth="1" />
                  <line x1={rx + rw + 5}  y1={ry + rh} x2={rx + rw + 15} y2={ry + rh} stroke="#a855f7" strokeWidth="1" />
                  <text x={rx + rw + 20} y={CYL_CY + 4} fill="#a855f7" fontSize="9" fontFamily="monospace">t</text>
                </g>
              </>
            );
          })()}
        </g>

        {/* ── CAPS — z-sorted 3D polygons, flat circles attached to selimut rect edges ── */}
        {/*
          Selimut rect: x=CYL_CX-118  y=CYL_CY-CYL_H/2  w=236  h=CYL_H
          topNetCy = (CYL_CY - CYL_H/2) - 52   → circle sits flush on top edge
          botNetCy = (CYL_CY + CYL_H/2) + 52   → circle sits flush on bottom edge
        */}
        {(() => {
          const NET_R   = 52;
          const selTop  = CYL_CY - CYL_H / 2;
          const selBot  = CYL_CY + CYL_H / 2;
          const topNetCy = selTop - NET_R;
          const botNetCy = selBot + NET_R;

          const caps = topCapAvgZ > botCapAvgZ
            ? [
                { key:"bot", open:botOpen, set:setBotOpen, pts:botPolyPts, c:botC, vis:botVisible, netCy:botNetCy, col:"#86efac", fillO:"rgba(134,239,172,0.30)", stroke:"#86efac", lbl:"Alas (Tutup Bawah)" },
                { key:"top", open:topOpen, set:setTopOpen, pts:topPolyPts, c:topC, vis:topVisible, netCy:topNetCy, col:"#67e8f9", fillO:"rgba(103,232,249,0.30)", stroke:"#67e8f9", lbl:"Tutup Atas" },
              ]
            : [
                { key:"top", open:topOpen, set:setTopOpen, pts:topPolyPts, c:topC, vis:topVisible, netCy:topNetCy, col:"#67e8f9", fillO:"rgba(103,232,249,0.30)", stroke:"#67e8f9", lbl:"Tutup Atas" },
                { key:"bot", open:botOpen, set:setBotOpen, pts:botPolyPts, c:botC, vis:botVisible, netCy:botNetCy, col:"#86efac", fillO:"rgba(134,239,172,0.30)", stroke:"#86efac", lbl:"Alas (Tutup Bawah)" },
              ];

          return caps.map(({ key, open, set, pts, c, vis, netCy, col, fillO, stroke, lbl }) => {
            const isTop = key === "top";
            const isClosing = open === "closing";
            const isOpen    = open === true;
            const showFlat  = isOpen || isClosing;
            const hingeOpenClass  = isTop ? "hinge-top"       : "hinge-bot";
            const hingeCloseClass = isTop ? "hinge-top-close" : "hinge-bot-close";
            return (
              <g key={key} onClick={(e) => { e.stopPropagation(); tryToggle(open, set); }} style={{ cursor: "pointer" }}>
                {/* Invisible hitbox */}
                <ellipse cx={c.x} cy={c.y} rx={54} ry={18} fill="transparent" stroke="none" style={{ pointerEvents: "all" }} />
                {/* 3D ellipse polygon — hidden while open or closing, fades back in after close */}
                <polygon points={pts} fill="rgb(99,102,241)" stroke="#a5b4fc" strokeWidth="1.2"
                  style={{ opacity: showFlat ? 0 : vis ? 1 : 0, transition: "opacity 0.35s" }} />
                {!showFlat && vis && !anyOpen && (
                  <polygon points={pts} fill="none" stroke="rgba(165,180,252,0.4)" strokeWidth="2"
                    style={{ pointerEvents: "none" }} />
                )}

                {/* Clickable overlay on net circle so pressing it closes the cap */}
                {isOpen && (
                  <circle
                    cx={CYL_CX} cy={netCy} r={NET_R + 6}
                    fill="transparent" stroke="none"
                    style={{ cursor: "pointer", pointerEvents: "all" }}
                    onClick={(e) => { e.stopPropagation(); tryToggle(open, set); }}
                  />
                )}

                {/* Flat circle — shown while open or animating closed */}
                {showFlat && (
                  <g
                    className={isClosing ? hingeCloseClass : hingeOpenClass}
                    onAnimationEnd={isClosing ? () => set(false) : undefined}
                    style={{ pointerEvents: "none" }}
                  >
                    {/* Dashed connecting line: circle edge → selimut rect edge */}
                    <line
                      x1={CYL_CX} y1={isTop ? selTop : selBot}
                      x2={CYL_CX} y2={isTop ? netCy + NET_R : netCy - NET_R}
                      stroke={stroke} strokeWidth="1" strokeDasharray="3,2" opacity="0.5"
                    />
                    <circle cx={CYL_CX} cy={netCy} r={NET_R}
                      fill={fillO} stroke={stroke} strokeWidth="1.5" />
                    <circle cx={CYL_CX} cy={netCy} r="2.5" fill="#fbbf24" />
                    <line x1={CYL_CX} y1={netCy} x2={CYL_CX + NET_R} y2={netCy}
                      stroke="#fbbf24" strokeWidth="1.2" />
                    <text x={CYL_CX + NET_R + 7} y={netCy + 4}
                      fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="700">r</text>
                    <text x={CYL_CX} y={netCy - 10}
                      fill={col} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="700">{lbl}</text>
                    <text x={CYL_CX} y={netCy + 20}
                      fill={col} fontSize="8" fontFamily="monospace" textAnchor="middle">L = πr²</text>
                  </g>
                )}
              </g>
            );
          });
        })()}

      </svg>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 justify-center text-[10px] font-body">
        {([
          { label: "⭕ Tutup Atas", state: topOpen, set: setTopOpen, on: "bg-cyan-900/60 border-cyan-500 text-cyan-300", off: "bg-slate-800/60 border-slate-600 text-slate-400" },
          { label: "🌀 Selimut",    state: selOpen, set: setSelOpen, on: "bg-purple-900/60 border-purple-500 text-purple-300", off: "bg-slate-800/60 border-slate-600 text-slate-400" },
          { label: "⭕ Alas",       state: botOpen, set: setBotOpen, on: "bg-green-900/60 border-green-500 text-green-300", off: "bg-slate-800/60 border-slate-600 text-slate-400" },
        ] as const).map(({ label, state, set, on, off }) => (
          <span
            key={label}
            className={`px-2 py-1 rounded-full border cursor-pointer transition-colors ${state === true ? on : state === "closing" ? on + " opacity-50" : off}`}
            onClick={() => tryToggle(state, set as React.Dispatch<React.SetStateAction<OS>>)}
          >
            {label}{state === true ? " ✓" : state === "closing" ? " ↩" : ""}
          </span>
        ))}
      </div>

      {anyOpen && (
        <button onClick={resetAll} className="w-full px-3 py-1.5 text-xs font-bold bg-slate-800/60 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer font-body">
          ⊟ Satukan Kembali
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS DATA
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

const sections: Sec[] = [
  {
    title: "Pengertian Tabung",
    icon: "🔵",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          Bayangkan kaleng minuman, drum musik, atau pipa air — semuanya punya bentuk yang sama: dua lingkaran
          di atas dan bawah, dihubungkan oleh satu permukaan melengkung. Itulah yang disebut <strong className="text-cyan-300">tabung</strong>
          (atau silinder)!
        </p>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-4 text-sm text-cyan-100 space-y-2">
          <p className="font-semibold text-cyan-300">📌 Definisi Tabung:</p>
          <p>
            Tabung adalah bangun ruang tiga dimensi yang dibentuk oleh <strong>dua lingkaran sejajar dan kongruen</strong> (sama
            besar) sebagai alas dan tutup, yang dihubungkan oleh sebuah permukaan melengkung yang disebut <strong className="text-purple-300">selimut tabung</strong>.
          </p>
        </div>
        <InteractiveCylinder3D />

        {/* ── Foto Benda Berbentuk Tabung — hanya slide 1 ── */}
        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-xl p-4 space-y-3">
          <p className="text-cyan-300 font-bold text-sm text-center">Benda Berbentuk Tabung di Kehidupan Sehari-hari</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { src: imgSarden,   label: "Kaleng Sarden" },
              { src: imgBiskuit,  label: "Kaleng Biskuit" },
              { src: imgIndomilk, label: "Kaleng Susu" },
              { src: imgDrum,     label: "Kendang" },
              { src: imgBedug,    label: "Bedug" },
              { src: imgTong,     label: "Tong / Drum" },
              { src: imgGelas,    label: "Gelas Silindris" },
              { src: imgGedung,   label: "Gedung Silindris" },
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
    title: "Unsur-Unsur Tabung",
    icon: "🏷️",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          Sebelum menghitung luas dan volume, kita perlu mengenal bagian-bagian tabung terlebih dahulu.
          Setiap unsur punya nama dan peran penting dalam rumus!
        </p>

        {/* ── Labeled diagram — diperbaiki ── */}
        <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
          <p className="text-cyan-300 font-bold text-xs text-center mb-3">📌 Diagram Unsur-Unsur Tabung</p>
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

            {/* TUTUP — berkedip indigo */}
            <ellipse cx="165" cy="70"  rx="73" ry="18" fill="rgba(99,102,241,0.30)" stroke="#818cf8" strokeWidth="1.8" className="u-blink"/>
            {/* ALAS — berkedip hijau */}
            <ellipse cx="165" cy="188" rx="73" ry="18" fill="rgba(52,211,153,0.20)" stroke="#34d399" strokeWidth="1.8" className="u-blink"/>
            {/* Selimut tint */}
            <rect x="92" y="70" width="146" height="118" fill="rgba(168,85,247,0.09)" stroke="none"/>

            {/* === r — garis putus dari pusat ke tepi tutup === */}
            <line x1="165" y1="70" x2="238" y2="70" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5,3"/>
            <circle cx="165" cy="70" r="3.5" fill="#f59e0b"/>
            <circle cx="238" cy="70" r="3.5" fill="#f59e0b"/>
            {/* Leader vertikal naik ke atas tabung → label di luar */}
            <line x1="202" y1="70" x2="202" y2="46" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="202" y="41" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="700" textAnchor="middle">r</text>
            <text x="242" y="74" fill="#fde68a" fontSize="7"  fontFamily="monospace" textAnchor="start">(jari-jari)</text>

            {/* === d — indikator di bawah elips bawah, mirip gaya panah t === */}
            {/* Konektor dari elips bawah ke garis d */}
            <line x1="92"  y1="196" x2="92"  y2="212" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" opacity="0.55"/>
            <line x1="238" y1="196" x2="238" y2="212" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" opacity="0.55"/>
            {/* Garis d dengan tick di ujung */}
            <line x1="92"  y1="212" x2="238" y2="212" stroke="#fde68a" strokeWidth="1.8"/>
            <line x1="92"  y1="207" x2="92"  y2="217" stroke="#fde68a" strokeWidth="1.8"/>
            <line x1="238" y1="207" x2="238" y2="217" stroke="#fde68a" strokeWidth="1.8"/>
            <text x="165" y="230" fill="#fde68a" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="middle">d = 2r</text>

            {/* === t — panah vertikal di kanan === */}
            <line x1="256" y1="70"  x2="256" y2="188" stroke="#22c55e" strokeWidth="2.2"/>
            <line x1="250" y1="70"  x2="262" y2="70"  stroke="#22c55e" strokeWidth="2"/>
            <line x1="250" y1="188" x2="262" y2="188" stroke="#22c55e" strokeWidth="2"/>
            <text x="270" y="133" fill="#22c55e" fontSize="12" fontFamily="monospace" fontWeight="700" textAnchor="middle">t</text>
            <text x="270" y="147" fill="#86efac" fontSize="8"  fontFamily="monospace" textAnchor="middle">(tinggi)</text>

            {/* === TUTUP label kanan atas === */}
            <line x1="238" y1="63" x2="318" y2="38" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="320" y="34" fill="#818cf8" fontSize="9" fontFamily="monospace" fontWeight="700">TUTUP</text>
            <text x="320" y="44" fill="#818cf8" fontSize="7" fontFamily="monospace">(atas)</text>

            {/* === ALAS label kanan bawah === */}
            <line x1="238" y1="194" x2="318" y2="218" stroke="#34d399" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="320" y="214" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="700">ALAS</text>
            <text x="320" y="224" fill="#34d399" fontSize="7" fontFamily="monospace">(bawah)</text>

            {/* === SELIMUT label kiri === */}
            <line x1="92" y1="129" x2="52" y2="129" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x="50" y="123" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="end">SELIMUT</text>
            <text x="50" y="134" fill="#c084fc" fontSize="7" fontFamily="monospace" textAnchor="end">(lengkung)</text>
          </svg>
        </div>

        {/* ── Kartu-kartu unsur ── */}
        <div className="grid grid-cols-1 gap-3">

          {/* ── SISI ── */}
          <div className="bg-purple-950/40 border border-purple-600/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-900/40">
              <span className="text-lg">🔲</span>
              <div>
                <p className="text-purple-300 font-bold text-sm">Sisi Tabung — <span className="text-yellow-300">3 sisi</span></p>
                <p className="text-purple-200/70 text-xs">Permukaan yang membungkus tabung</p>
              </div>
            </div>
            <SisiAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>① <strong className="text-purple-300">Selimut</strong> — permukaan lengkung (kulit tabung)</p>
              <p>② <strong className="text-green-300">Alas</strong> — lingkaran di bagian bawah</p>
              <p>③ <strong className="text-indigo-300">Tutup</strong> — lingkaran di bagian atas</p>
              <div className="mt-2 bg-purple-900/40 rounded p-2 text-center font-mono text-purple-200">
                Total sisi = <strong className="text-yellow-300">3</strong>
              </div>
            </div>
          </div>

          {/* ── RUSUK ── */}
          <div className="bg-amber-950/40 border border-amber-600/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-amber-900/40">
              <span className="text-lg">〇</span>
              <div>
                <p className="text-amber-300 font-bold text-sm">Rusuk Tabung — <span className="text-yellow-300">2 rusuk</span></p>
                <p className="text-amber-200/70 text-xs">Tepi / batas pertemuan antar sisi</p>
              </div>
            </div>
            <RusukAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>① <strong className="text-amber-300">Rusuk atas</strong> — lingkaran tepi tutup</p>
              <p>② <strong className="text-sky-300">Rusuk bawah</strong> — lingkaran tepi alas</p>
              <p className="text-white/50 text-[11px]">💡 Tabung <strong>tidak punya rusuk lurus</strong> — berbeda dengan kubus/balok!</p>
              <div className="mt-2 bg-amber-900/40 rounded p-2 text-center font-mono text-amber-200">
                Total rusuk = <strong className="text-yellow-300">2</strong> &nbsp;|&nbsp; Titik sudut = <strong className="text-yellow-300">0</strong>
              </div>
            </div>
          </div>

          {/* ── JARI-JARI ── */}
          <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-amber-900/30">
              <span className="text-lg">📏</span>
              <div>
                <p className="text-amber-300 font-bold text-sm">Jari-jari (r)</p>
                <p className="text-amber-200/70 text-xs">Setengah diameter lingkaran alas/tutup</p>
              </div>
            </div>
            <JariJariAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>• Diukur dari <strong className="text-amber-300">titik pusat</strong> hingga tepi lingkaran.</p>
              <p>• Bersama tinggi, menentukan <strong>semua rumus tabung</strong>.</p>
              <div className="flex items-center gap-2 mt-1">
                <span>• Hubungan:</span>
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
                <p className="text-green-300 font-bold text-sm">Tinggi (t)</p>
                <p className="text-green-200/70 text-xs">Jarak tegak lurus antara alas dan tutup</p>
              </div>
            </div>
            <TinggiAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>• Selalu <strong className="text-green-300">tegak lurus</strong> terhadap alas dan tutup.</p>
              <p>• Digunakan di rumus luas selimut dan volume.</p>
            </div>
          </div>

          {/* ── SELIMUT ── */}
          <div className="bg-purple-950/40 border border-purple-700/50 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-900/30">
              <span className="text-lg">🌀</span>
              <div>
                <p className="text-purple-300 font-bold text-sm">Selimut Tabung</p>
                <p className="text-purple-200/70 text-xs">Permukaan lengkung yang membungkus sisi tabung</p>
              </div>
            </div>
            <SelimutAnimSVG />
            <p className="text-center text-purple-300 font-bold text-xs mt-1 px-4">↓ Jika dibuka dan diratakan:</p>
            <SelimutRectAnimSVG />
            <div className="px-4 pb-3 space-y-1 text-xs text-white/75">
              <p>• Dibuka → berbentuk <strong className="text-purple-300">persegi panjang</strong> dengan:</p>
              <p className="pl-3">— panjang = keliling lingkaran = <strong className="text-yellow-300">2πr</strong></p>
              <p className="pl-3">— lebar = tinggi tabung = <strong className="text-green-300">t</strong></p>
              <p>• Luas selimut = <strong className="text-yellow-300">2πr × t</strong></p>
            </div>
          </div>

          {/* ── ALAS & TUTUP ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-950/40 border border-indigo-700/50 rounded-xl p-4 space-y-2">
              <p className="text-xl text-center">⭕</p>
              <p className="text-indigo-300 font-bold text-sm text-center">Alas</p>
              <p className="text-white/65 text-xs text-center">Lingkaran di bagian <strong>bawah</strong></p>
              <div className="bg-indigo-900/40 rounded p-2 text-center text-xs text-indigo-200">
                <InlineMath math="L_{alas} = \pi r^2" />
              </div>
            </div>
            <div className="bg-cyan-950/40 border border-cyan-700/50 rounded-xl p-4 space-y-2">
              <p className="text-xl text-center">⭕</p>
              <p className="text-cyan-300 font-bold text-sm text-center">Tutup</p>
              <p className="text-white/65 text-xs text-center">Lingkaran di bagian <strong>atas</strong></p>
              <div className="bg-cyan-900/40 rounded p-2 text-center text-xs text-cyan-200">
                <InlineMath math="L_{tutup} = \pi r^2" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabel ringkasan ── */}
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Unsur</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Nilai / Simbol</th>
                <th className="px-3 py-2 text-cyan-300 text-left">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sisi",      "3",        "Selimut + Alas + Tutup"],
                ["Rusuk",     "2",        "Lingkaran atas & bawah"],
                ["Titik sudut","0",       "Tidak ada titik sudut"],
                ["Jari-jari", "r",        "Pusat → tepi lingkaran"],
                ["Diameter",  "d = 2r",   "Garis tengah lingkaran"],
                ["Tinggi",    "t",        "Jarak tegak lurus alas ke tutup"],
                ["Alas/Tutup","L alas = πr²",      "Luas tiap lingkaran"],
                ["Selimut",   "L selimut = 2πrt",  "Permukaan lengkung (kulit)"],
              ].map(([u, s, k], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{u}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{s}</td>
                  <td className="px-3 py-2 text-white/60 text-left">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <blockquote className="border-l-4 border-cyan-500 pl-3 text-sm text-cyan-200">
          <strong>💡 Kunci:</strong> Semua rumus tabung hanya butuh <strong className="text-amber-300">r</strong> dan <strong className="text-green-300">t</strong>.
          Ingat: <strong>3 sisi, 2 rusuk, 0 titik sudut</strong>!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Jaring-jaring Tabung",
    icon: "📐",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          Kalau kita "bongkar" dan bentangkan semua permukaan tabung menjadi datar, itulah yang disebut <strong className="text-purple-300">jaring-jaring tabung</strong>.
        </p>

        <CylinderNetAnimation />
        <div className="bg-purple-950/40 border border-purple-700/40 rounded-xl p-4">
          <p className="text-purple-200 text-sm font-bold mb-3">🗺️ Komponen Jaring-jaring Tabung:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-cyan-950/60 border border-cyan-700/40 rounded-lg p-3">
              <p className="text-2xl mb-1">⭕</p>
              <p className="text-cyan-300 text-xs font-bold">Tutup ATAS</p>
              <p className="text-white/60 text-xs">Lingkaran jari-jari r</p>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/40 rounded-lg p-3">
              <p className="text-2xl mb-1">▭</p>
              <p className="text-purple-300 text-xs font-bold">SELIMUT</p>
              <p className="text-white/60 text-xs">Persegi panjang<br/>p = 2πr, l = t</p>
            </div>
            <div className="bg-green-950/60 border border-green-700/40 rounded-lg p-3">
              <p className="text-2xl mb-1">⭕</p>
              <p className="text-green-300 text-xs font-bold">Tutup BAWAH</p>
              <p className="text-white/60 text-xs">Lingkaran jari-jari r</p>
            </div>
          </div>
        </div>
        <blockquote className="border-l-4 border-yellow-500 pl-3 text-sm text-yellow-200">
          <strong>💡 Tips Penting:</strong> Perhatikan bahwa panjang sisi persegi panjang (selimut)
          harus sama persis dengan keliling lingkaran alas/tutup (<InlineMath math="2\pi r" />).
          Inilah kunci kenapa jaring-jaring bisa "menyambung" sempurna!
        </blockquote>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2 text-sm text-white/80">
          <p className="font-bold text-white">📏 Ukuran Masing-masing Bagian:</p>
          <div className="bg-slate-900/60 rounded p-3 space-y-1 text-xs font-mono">
            <p>• Luas tutup atas = Luas tutup bawah = <InlineMath math="\pi r^2" /></p>
            <p>• Panjang selimut (dibuka) = <InlineMath math="2\pi r" /></p>
            <p>• Tinggi selimut (dibuka) = <InlineMath math="t" /></p>
            <p>• Luas selimut = <InlineMath math="2\pi r \times t" /></p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Luas Permukaan Tabung",
    icon: "🎨",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm">
          Luas permukaan tabung adalah <strong>total seluruh luas</strong> semua bagian yang membungkus tabung —
          termasuk dua tutup lingkaran dan selimutnya.
        </p>

        {/* ── Diagram: hasil pembongkaran tabung (vertikal) ── */}
        <div className="rounded-xl overflow-hidden border border-purple-700/40">
          <svg viewBox="0 0 400 250" style={{ width:"100%", display:"block" }} xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="250" fill="rgba(8,12,30,0.92)"/>

            {/* TITLE */}
            <text x="200" y="15" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              Tabung Dibongkar → Komponen Luas Permukaan
            </text>

            {/* ══════════════════════════════════════
                TOP CIRCLE — tutup atas
                cx=200 cy=48 r=28
            ══════════════════════════════════════ */}
            <circle cx="200" cy="48" r="28" fill="rgba(99,102,241,0.42)" stroke="#818cf8" strokeWidth="1.8"/>
            {/* r-line inside */}
            <line x1="200" y1="48" x2="228" y2="48" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="3,2"/>
            <circle cx="200" cy="48" r="2" fill="#f59e0b"/>
            <circle cx="228" cy="48" r="2" fill="#f59e0b"/>
            <text x="214" y="42" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
            {/* label — moved below r-line to avoid collision */}
            <text x="200" y="60" fill="#c7d2fe" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">tutup atas</text>
            {/* area annotation — right of circle */}
            <text x="242" y="51" fill="#818cf8" fontSize="9.5" fontFamily="monospace" textAnchor="start">= πr²</text>

            {/* "+" sign — left, between top circle and rect */}
            <text x="28" y="86" fill="#64748b" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">+</text>
            {/* dashed vertical connector */}
            <line x1="200" y1="76" x2="200" y2="87" stroke="rgba(168,85,247,0.35)" strokeWidth="1" strokeDasharray="2,2"/>

            {/* 2πr dimension — moved down to avoid overlap with circle */}
            <line x1="106" y1="87" x2="294" y2="87" stroke="#a855f7" strokeWidth="1"/>
            <line x1="106" y1="83" x2="106" y2="91" stroke="#a855f7" strokeWidth="1"/>
            <line x1="294" y1="83" x2="294" y2="91" stroke="#a855f7" strokeWidth="1"/>
            <text x="200" y="83" fill="#d8b4fe" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">← 2πr →</text>

            {/* ══════════════════════════════════════
                RECTANGLE — selimut
                x=106 y=90 w=188 h=62
            ══════════════════════════════════════ */}
            <rect x="106" y="90" width="188" height="62" rx="4" fill="rgba(168,85,247,0.32)" stroke="#a855f7" strokeWidth="1.8"/>
            {/* t dimension — right of rect */}
            <line x1="302" y1="90"  x2="302" y2="152" stroke="#22c55e" strokeWidth="1.4"/>
            <line x1="298" y1="90"  x2="306" y2="90"  stroke="#22c55e" strokeWidth="1.2"/>
            <line x1="298" y1="152" x2="306" y2="152" stroke="#22c55e" strokeWidth="1.2"/>
            <text x="314" y="125" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
            {/* labels inside rect */}
            <text x="200" y="117" fill="#e9d5ff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SELIMUT</text>
            <text x="200" y="129" fill="#c4b5fd" fontSize="7.5" fontFamily="monospace" textAnchor="middle">(Persegi Panjang)</text>
            {/* area annotation — right of rect */}
            <text x="322" y="147" fill="#a855f7" fontSize="9.5" fontFamily="monospace" textAnchor="start">= 2πr·t</text>

            {/* "+" sign — left, between rect and bottom circle */}
            <text x="28" y="170" fill="#64748b" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">+</text>
            {/* dashed vertical connector */}
            <line x1="200" y1="152" x2="200" y2="160" stroke="rgba(168,85,247,0.35)" strokeWidth="1" strokeDasharray="2,2"/>

            {/* ══════════════════════════════════════
                BOTTOM CIRCLE — tutup bawah
                cx=200 cy=188 r=28
            ══════════════════════════════════════ */}
            <circle cx="200" cy="188" r="28" fill="rgba(99,102,241,0.42)" stroke="#818cf8" strokeWidth="1.8"/>
            {/* r-line inside */}
            <line x1="200" y1="188" x2="228" y2="188" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="3,2"/>
            <circle cx="200" cy="188" r="2" fill="#f59e0b"/>
            <circle cx="228" cy="188" r="2" fill="#f59e0b"/>
            <text x="214" y="183" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
            {/* label — moved below circle to avoid collision with r */}
            <text x="200" y="222" fill="#c7d2fe" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">tutup bawah</text>
            {/* area annotation — right of circle */}
            <text x="242" y="195" fill="#818cf8" fontSize="9.5" fontFamily="monospace" textAnchor="start">= πr²</text>

            {/* ══════════════════════════════════════
                TOTAL FORMULA BAR
            ══════════════════════════════════════ */}
            <rect x="20" y="226" width="360" height="18" rx="5"
              fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.36)" strokeWidth="1"/>
            <text x="200" y="239" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              L = πr² + 2πrt + πr²  =  2πr² + 2πrt  =  2πr(r+t)
            </text>
          </svg>
        </div>

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-3">
          <p className="text-orange-300 font-bold text-sm">🧮 Penurunan Rumus:</p>
          <div className="space-y-2 text-sm text-white/80">
            <div className="bg-slate-900/60 rounded p-2 text-xs">
              <p className="text-white/60 mb-1">Tutup Atas + Tutup Bawah + Selimut</p>
              <BlockMath math="L = \pi r^2 + \pi r^2 + 2\pi r \cdot t" />
            </div>
            <div className="bg-orange-950/50 border border-orange-700/40 rounded p-3">
              <p className="text-orange-300 font-bold text-center text-xs mb-2">✨ Rumus Luas Permukaan Tabung:</p>
              <BlockMath math="L = 2\pi r^2 + 2\pi r \cdot t" />
            </div>
            <div className="bg-slate-900/60 rounded p-2 text-xs text-white/60">
              <p>Atau bisa juga ditulis:</p>
              <BlockMath math="L = 2\pi r \left( r + t \right)" />
            </div>
          </div>
        </div>

        <blockquote className="border-l-4 border-orange-500 pl-3 text-sm text-orange-200">
          <strong>🚀 Catatan:</strong> Kalau tabung tidak punya tutup (seperti pipa atau ember tanpa dasar),
          kamu hanya menghitung selimut ditambah satu lingkaran. Sesuaikan rumus dengan kebutuhan soal!
        </blockquote>

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Jenis Tabung</th>
              <th className="px-3 py-2 text-cyan-300">Rumus Luas</th>
            </tr></thead>
            <tbody>
              {[
                ["Tabung tertutup (ada alas & tutup)","L = 2\\pi r^2 + 2\\pi r t"],
                ["Tabung terbuka (tanpa tutup atas)","L = \\pi r^2 + 2\\pi r t"],
                ["Selimut saja","L_{selimut} = 2\\pi r t"],
              ].map(([b,r],i)=>(
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
    title: "Volume Tabung",
    icon: "📦",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          Volume tabung adalah <strong>seberapa banyak isi</strong> yang bisa ditampung di dalamnya —
          bayangkan berapa liter air yang masuk ke dalam kaleng!
        </p>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-1">
          <p className="text-cyan-300 text-xs font-semibold font-body text-center">
            🌊 Tabung diisi air — dari kosong hingga penuh
          </p>
          <WaterTabungAnimation />
          <p className="text-white/45 text-[10px] font-body text-center">
            Persentase menunjukkan proporsi volume terisi terhadap volume total
          </p>
        </div>

        <div className="bg-blue-950/50 border border-blue-700/40 rounded-lg p-4 space-y-3">
          <p className="text-blue-300 font-bold text-sm">💡 Ide Dasar:</p>
          <p className="text-white/75 text-sm">Volume = Luas alas × Tinggi. Karena alas tabung adalah lingkaran:</p>
          <div className="bg-slate-900/60 rounded p-3 space-y-2">
            <BlockMath math="V = \text{Luas Alas} \times t = \pi r^2 \times t" />
          </div>
          <div className="bg-blue-950/70 border border-blue-600/40 rounded p-3 text-center">
            <p className="text-blue-200 font-bold text-xs mb-1">✨ Rumus Volume Tabung:</p>
            <BlockMath math="V = \pi r^2 \cdot t" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 <strong className="text-white">Satuan volume:</strong></p>
          <p>• Jika <InlineMath math="r" /> dan <InlineMath math="t" /> dalam cm → Volume dalam <InlineMath math="\text{cm}^3" /></p>
          <p>• Jika <InlineMath math="r" /> dan <InlineMath math="t" /> dalam m → Volume dalam <InlineMath math="\text{m}^3" /></p>
          <p>• <InlineMath math="1 \text{ m}^3 = 1.000.000 \text{ cm}^3" /></p>
          <p>• <InlineMath math="1 \text{ liter} = 1.000 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    title: "Kesimpulan — Rumus Lengkap Tabung",
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Besaran</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Rumus</th>
              <th className="px-3 py-2 text-cyan-300">Catatan</th>
            </tr></thead>
            <tbody>
              {[
                ["Keliling alas / tutup","K = 2πr","Lingkaran"],
                ["Luas alas / tutup","L₀ = πr²","Lingkaran"],
                ["Luas selimut","Ls = 2πrt","Persegi panjang yang digulung"],
                ["Luas permukaan (tertutup)","L = 2πr² + 2πrt","Semua sisi"],
                ["Luas permukaan (terbuka)","L = πr² + 2πrt","Tanpa tutup atas"],
                ["Volume","V = πr²t","Luas alas × tinggi"],
              ].map(([b,r,c],i)=>(
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
          <p>🚀 <strong>Kunci utama tabung:</strong> Semua rumus bergantung pada <strong className="text-yellow-300">r (jari-jari)</strong> dan <strong className="text-green-300">t (tinggi)</strong>.</p>
          <p>Ingat: <InlineMath math="\pi \approx 3{,}14" /> atau <InlineMath math="\frac{22}{7}" /> (gunakan sesuai petunjuk soal!)</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE PROBLEMS
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const luasExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Sebuah tabung memiliki jari-jari alas <InlineMath math="7 \text{ cm}" /> dan tinggi <InlineMath math="10 \text{ cm}" />.</p>
        <p>Hitunglah <strong className="text-purple-300">luas selimut</strong> tabung tersebut!</p>
        <p className="text-xs text-white/50">(gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600/60 rounded p-3 text-xs space-y-1">
          <p className="text-green-300 font-semibold mb-2">Diketahui:</p>
          <p className="text-white/70">• Jari-jari: <InlineMath math="r = 7 \text{ cm}" /></p>
          <p className="text-white/70">• Tinggi: <InlineMath math="t = 10 \text{ cm}" /></p>
          <p className="text-white/70">• <InlineMath math="\pi = \frac{22}{7}" /></p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <p className="text-white/60 mb-1">Gunakan rumus luas selimut tabung:</p>
          <BlockMath math="L_{\text{selimut}} = 2\pi r t" />
          <BlockMath math="L_{\text{selimut}} = 2 \times \frac{22}{7} \times 7 \times 10" />
          <BlockMath math="L_{\text{selimut}} = 2 \times 22 \times 10" />
          <BlockMath math="L_{\text{selimut}} = 440 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Luas selimut tabung = <InlineMath math="440 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tong air berbentuk tabung terbuka (tanpa tutup atas) dengan diameter <InlineMath math="60 \text{ cm}" /> dan tinggi <InlineMath math="80 \text{ cm}" />.</p>
        <p>Tong ini akan dicat di seluruh permukaan luarnya (alas + selimut). Jika 1 kaleng cat cukup untuk <InlineMath math="5.000 \text{ cm}^2" />, berapa kaleng cat yang diperlukan?</p>
        <p className="text-xs text-white/50">(π = 3,14)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">Langkah 1 — Cari jari-jari:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{60}{2} = 30 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">Langkah 2 — Luas permukaan terbuka (alas + selimut):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="L = \pi r^2 + 2\pi r \cdot t" />
          <BlockMath math="L = 3{,}14 \times 30^2 + 2 \times 3{,}14 \times 30 \times 80" />
          <BlockMath math="L = 3{,}14 \times 900 + 2 \times 3{,}14 \times 2.400" />
          <BlockMath math="L = 2.826 + 15.072 = 17.898 \text{ cm}^2" />
        </div>
        <p className="text-yellow-400 font-semibold">Langkah 3 — Hitung kebutuhan cat:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-2 text-xs">
          <BlockMath math="\text{Kaleng cat} = \frac{17.898}{5.000} = 3{,}58 \approx 4 \text{ kaleng}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs">
          <p className="text-yellow-300 font-semibold">✅ Jawaban: Dibutuhkan <strong>4 kaleng cat</strong> (dibulatkan ke atas)</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah pabrik membuat label kertas yang menempel persis di selimut tabung kaleng.</p>
        <p>Kaleng tersebut memiliki luas permukaan total <InlineMath math="1.507{,}2 \text{ cm}^2" /> dan tinggi <InlineMath math="15 \text{ cm}" />.</p>
        <p>Tentukan: (a) jari-jari kaleng, (b) luas label kertas yang dibutuhkan untuk satu kaleng.</p>
        <p className="text-xs text-white/50">(π = 3,14)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Bentuk persamaan dari luas permukaan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="L = 2\pi r^2 + 2\pi r t" />
          <BlockMath math="1.507{,}2 = 2 \times 3{,}14 \times r^2 + 2 \times 3{,}14 \times r \times 15" />
          <BlockMath math="1.507{,}2 = 6{,}28 r^2 + 94{,}2 r" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Coba nilai r yang masuk akal (r = 10):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="6{,}28 \times 100 + 94{,}2 \times 10 = 628 + 942 = 1.570 \neq 1.507{,}2" />
          <p className="text-white/60">Coba r = 9:</p>
          <BlockMath math="6{,}28 \times 81 + 94{,}2 \times 9 = 508{,}68 + 847{,}8 = 1.356{,}48 \neq 1.507{,}2" />
          <p className="text-white/60">Coba r = 10 dan sederhanakan dengan faktorisasi:</p>
          <BlockMath math="1.507{,}2 \div 6{,}28 = 240 \Rightarrow r^2 + 15r = 240" />
          <BlockMath math="r^2 + 15r - 240 = 0 \Rightarrow (r-10)(r+24)=0 \Rightarrow r = 10 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Hitung luas label (selimut saja):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L_{\text{selimut}} = 2\pi r \cdot t = 2 \times 3{,}14 \times 10 \times 15 = 942 \text{ cm}^2" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Jari-jari kaleng = <strong className="text-yellow-300">10 cm</strong></p>
          <p className="text-white/80">• Luas label kertas = <strong className="text-yellow-300">942 cm²</strong></p>
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
        <p>Sebuah gelas silindris memiliki jari-jari <InlineMath math="5 \text{ cm}" /> dan tinggi <InlineMath math="12 \text{ cm}" />.</p>
        <p>Berapa volume gelas tersebut? (π = 3,14)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="V = \pi r^2 \cdot t = 3{,}14 \times 5^2 \times 12" />
          <BlockMath math="V = 3{,}14 \times 25 \times 12 = 3{,}14 \times 300 = 942 \text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume gelas = <InlineMath math="942 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tangki air berbentuk tabung memiliki diameter <InlineMath math="1{,}4 \text{ m}" /> dan tinggi <InlineMath math="2 \text{ m}" />.</p>
        <p>Jika tangki terisi penuh, berapa liter air yang tersimpan?</p>
        <p className="text-xs text-white/50">(π = 22/7, dan 1 m³ = 1.000 liter)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <p className="text-white/70">Cari jari-jari: <InlineMath math="r = \frac{1{,}4}{2} = 0{,}7 \text{ m}" /></p>
          <BlockMath math="V = \pi r^2 \cdot t = \frac{22}{7} \times (0{,}7)^2 \times 2" />
          <BlockMath math="V = \frac{22}{7} \times 0{,}49 \times 2 = \frac{22}{7} \times 0{,}98" />
          <BlockMath math="V = \frac{22 \times 0{,}98}{7} = \frac{21{,}56}{7} = 3{,}08 \text{ m}^3" />
          <BlockMath math="V = 3{,}08 \times 1.000 = 3.080 \text{ liter}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Tangki menampung <strong>3.080 liter</strong> air</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah pabrik minuman memproduksi kaleng silindris berisi <InlineMath math="330 \text{ mL}" /> (<InlineMath math="330 \text{ cm}^3" />) minuman.</p>
        <p>Tinggi kaleng adalah <InlineMath math="11 \text{ cm}" />. Pabrik ingin membuat versi baru dengan <strong>diameter diperbesar 40%</strong> namun <strong>volume tetap 330 cm³</strong>.</p>
        <p>Berapa tinggi kaleng baru yang harus dibuat? (π = 3,14, jawaban dalam 2 desimal)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Cari jari-jari kaleng lama:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="V = \pi r^2 t \Rightarrow 330 = 3{,}14 \times r^2 \times 11" />
          <BlockMath math="r^2 = \frac{330}{3{,}14 \times 11} = \frac{330}{34{,}54} \approx 9{,}554" />
          <BlockMath math="r_{\text{lama}} \approx \sqrt{9{,}554} \approx 3{,}09 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Hitung jari-jari baru (diameter naik 40%):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="d_{\text{baru}} = d_{\text{lama}} \times 1{,}4 \Rightarrow r_{\text{baru}} = r_{\text{lama}} \times 1{,}4" />
          <BlockMath math="r_{\text{baru}} = 3{,}09 \times 1{,}4 \approx 4{,}326 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Hitung tinggi baru dengan volume sama:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="V = \pi r_{\text{baru}}^2 \times t_{\text{baru}}" />
          <BlockMath math="330 = 3{,}14 \times (4{,}326)^2 \times t_{\text{baru}}" />
          <BlockMath math="330 = 3{,}14 \times 18{,}714 \times t_{\text{baru}}" />
          <BlockMath math="330 = 58{,}76 \times t_{\text{baru}}" />
          <BlockMath math="t_{\text{baru}} = \frac{330}{58{,}76} \approx 5{,}62 \text{ cm}" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Jari-jari baru ≈ <strong className="text-yellow-300">4,33 cm</strong></p>
          <p className="text-white/80">• Tinggi kaleng baru ≈ <strong className="text-yellow-300">5,62 cm</strong></p>
          <p className="text-cyan-300 mt-1">💡 Logis! Kaleng lebih lebar tapi lebih pendek, volume tetap sama.</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */
const unsurExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>Ada berapa <strong className="text-green-300">sisi</strong>, <strong className="text-amber-300">rusuk</strong>, dan <strong className="text-sky-300">titik sudut</strong> pada sebuah tabung?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
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
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3 text-xs">
          <p className="text-green-300 font-semibold">✅ Jawaban: Sisi = <strong>3</strong>, Rusuk = <strong>2</strong>, Titik Sudut = <strong>0</strong></p>
          <p className="text-white/60 mt-1">💡 Tabung tidak punya rusuk lurus maupun titik sudut — berbeda dengan kubus/balok!</p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>Bentuk bangun dari <strong className="text-purple-300">selimut tabung</strong> adalah ….</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { opt: "A", label: "Segi empat" },
            { opt: "B", label: "Persegi panjang" },
            { opt: "C", label: "Belah ketupat" },
            { opt: "D", label: "Bidang lengkung" },
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
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { opt: "A", label: "Segi empat", correct: false },
            { opt: "B", label: "Persegi panjang", correct: true },
            { opt: "C", label: "Belah ketupat", correct: false },
            { opt: "D", label: "Bidang lengkung", correct: false },
          ].map(({ opt, label, correct }) => (
            <div key={opt} className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${correct ? "bg-green-950/60 border-green-600/60" : "bg-slate-800/40 border-slate-700/40 opacity-50"}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs shrink-0 ${correct ? "bg-green-600 text-white" : "bg-slate-700 text-white/50"}`}>{opt}</span>
              <span className={`text-xs font-semibold ${correct ? "text-green-300" : "text-white/50"}`}>{label} {correct && "✓"}</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs space-y-1">
          <p className="text-yellow-300 font-semibold">✅ Jawaban: B. Persegi Panjang</p>
          <p className="text-white/70">Ketika selimut tabung "dibuka" dan diratakan, bentuknya adalah <strong className="text-purple-300">persegi panjang</strong> dengan panjang = 2πr (keliling lingkaran) dan lebar = t (tinggi tabung).</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>Perhatikan gambar selimut tabung berikut.</p>

        {/* SVG selimut tabung — persegi panjang dengan keterangan ukuran */}
        <svg viewBox="0 0 400 180" className="w-full max-w-xs mx-auto block" aria-label="Selimut tabung: lebar 22 cm, tinggi t = 10 cm">
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
          <text x="290" y="93" fill="#86efac" fontSize="9"  fontFamily="monospace" textAnchor="start">(tinggi)</text>
        </svg>

        <p>Jari-jari tabung yang terjadi adalah ….</p>
        <p className="text-white/50 text-xs">(gunakan π = <sup>22</sup>⁄<sub>7</sub>)</p>
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
        <p className="text-red-400 font-semibold">Pembahasan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <p className="text-white/70">Lebar selimut = keliling lingkaran alas = 22 cm</p>
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
          <p className="text-red-300 font-semibold">✅ Jawaban: A. 3,5 cm</p>
          <p className="text-white/60 mt-1">Lebar persegi panjang selimut = keliling lingkaran = 2πr, sehingga r = 3,5 cm</p>
        </div>
      </div>
    ),
  },
];

const ExampleCard = ({ ex, idx, prefix }: { ex: Ex; idx: number; prefix: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {ex.level}
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
const TabungPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    {
      title: "Contoh Soal — Unsur-unsur Tabung",
      icon: "🏷️",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Uji pemahamanmu tentang unsur-unsur tabung</p>
          {unsurExamples.map((ex, i) => <ExampleCard key={`u${i}`} ex={ex} idx={i} prefix="SOAL"/>)}
        </div>
      ),
    },
    {
      title: "Contoh Soal — Luas Permukaan",
      icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix="LUAS"/>)}
        </div>
      ),
    },
    {
      title: "Contoh Soal — Volume",
      icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix="VOLUME"/>)}
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
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Bangun Ruang Sisi Lengkung</p>

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

export default TabungPage;
