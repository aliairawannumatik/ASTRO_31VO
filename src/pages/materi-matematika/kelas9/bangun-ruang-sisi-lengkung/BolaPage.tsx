import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Circle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import imgBolaSepak  from "@assets/image_1780702385381.png";
import imgGlobe      from "@assets/image_1780702495642.png";
import imgSemangka   from "@assets/image_1780702529187.png";
import imgJeruk      from "@assets/image_1780702647131.png";
import imgKelereng   from "@assets/image_1780702682181.png";
import imgBowling    from "@assets/image_1780702856357.png";

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D SPHERE — CSS gradient + SVG latitude/longitude
───────────────────────────────────────────────────────────── */
const SPHERE_R = 90;
const SVG_W = 300;
const SVG_H = 300;

const InteractiveSphere3D = () => {
  const [spinY, setSpinY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const dragRef = useRef({ sx: 0, base: 0 });

  const onMD = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, base: spinY };
  };
  const onMM = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setSpinY(dragRef.current.base + (e.clientX - dragRef.current.sx) * 0.8);
  }, [isDragging]);
  const onMU = useCallback(() => setIsDragging(false), []);
  const onTS = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { sx: t.clientX, base: spinY };
  };
  const onTM = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    setSpinY(dragRef.current.base + (e.touches[0].clientX - dragRef.current.sx) * 0.8);
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
      if (lastTs) setSpinY(prev => prev + (ts - lastTs) * 0.03);
      lastTs = ts;
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging]);

  const cx = SVG_W / 2;
  const cy = SVG_H / 2;
  const latLines = [-60, -30, 0, 30, 60];
  const lonCount = 6;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        Drag untuk memutar bola · Klik tombol untuk menampilkan/menyembunyikan label
      </p>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ maxWidth: SVG_W, display: "block", margin: "0 auto", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMD}
        onTouchStart={onTS}
      >
        <defs>
          <radialGradient id="sphereGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="1"/>
            <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.95"/>
          </radialGradient>
          <radialGradient id="sphereShine" cx="30%" cy="28%" r="35%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="sphereClip">
            <circle cx={cx} cy={cy} r={SPHERE_R}/>
          </clipPath>
          <filter id="sphereShadow">
            <feDropShadow dx="4" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5"/>
          </filter>
          <style>{`
            @keyframes spherePulse{0%,100%{opacity:0.7;}50%{opacity:1;}}
            .sp{animation:spherePulse 3s ease-in-out infinite;}
          `}</style>
        </defs>

        {/* Shadow */}
        <ellipse cx={cx} cy={cy + SPHERE_R + 12} rx={SPHERE_R * 0.75} ry={12} fill="rgba(0,0,0,0.35)"/>
        {/* Main sphere body */}
        <circle cx={cx} cy={cy} r={SPHERE_R} fill="url(#sphereGrad)" filter="url(#sphereShadow)"/>

        {/* Latitude & longitude lines */}
        <g clipPath="url(#sphereClip)">
          {latLines.map(latDeg => {
            const latRad = (latDeg * Math.PI) / 180;
            const ry = SPHERE_R * Math.cos(latRad);
            const yOff = SPHERE_R * Math.sin(latRad);
            return (
              <ellipse
                key={latDeg}
                cx={cx} cy={cy - yOff}
                rx={ry} ry={ry * 0.25}
                fill="none"
                stroke={latDeg === 0 ? "#facc15" : "#ffffff"}
                strokeWidth={latDeg === 0 ? 1.8 : 0.9}
                opacity={latDeg === 0 ? 0.8 : 0.35}
                strokeDasharray={latDeg === 0 ? "none" : "4,3"}
              />
            );
          })}
          {Array.from({ length: lonCount }, (_, i) => {
            const angle = ((i * 180) / lonCount + spinY) % 180;
            const rad = (angle * Math.PI) / 180;
            const rx = SPHERE_R * Math.abs(Math.sin(rad));
            return (
              <ellipse
                key={i}
                cx={cx} cy={cy}
                rx={rx < 2 ? 0 : rx} ry={SPHERE_R}
                fill="none" stroke="#ffffff"
                strokeWidth={0.9} opacity={0.3} strokeDasharray="5,4"
              />
            );
          })}
        </g>

        {/* Shine overlay */}
        <circle cx={cx} cy={cy} r={SPHERE_R} fill="url(#sphereShine)"/>
        {/* Sphere outline */}
        <circle cx={cx} cy={cy} r={SPHERE_R} fill="none" stroke="#93c5fd" strokeWidth="1.5"/>

        {showLabels && (
          <g>
            <line x1={cx - SPHERE_R} y1={cy} x2={cx + SPHERE_R} y2={cy}
              stroke="#facc15" strokeWidth="2" strokeDasharray="6,4" opacity="0.9" className="sp"/>
            <text x={cx} y={cy - 8} fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">d = 2r</text>
            <line x1={cx} y1={cy} x2={cx + SPHERE_R} y2={cy} stroke="#f97316" strokeWidth="2.5"/>
            <circle cx={cx} cy={cy} r="4" fill="#f97316"/>
            <circle cx={cx + SPHERE_R} cy={cy} r="4" fill="#f97316"/>
            <text x={cx + SPHERE_R / 2} y={cy + 16} fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
            <text x={cx - 10} y={cy + 4} fill="#e0e7ff" fontSize="9" fontFamily="monospace">O</text>
          </g>
        )}
      </svg>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => { playPopSound(); setShowLabels(v => !v); }}
          className="px-3 py-1.5 text-xs font-bold bg-blue-900/60 border border-blue-600 text-blue-300 rounded-lg hover:bg-blue-800/60 transition-colors cursor-pointer font-body"
        >
          {showLabels ? "🔵 Sembunyikan Label" : "🔵 Tampilkan Label"}
        </button>
        <button
          onClick={() => { playPopSound(); setSpinY(0); }}
          className="px-3 py-1.5 text-xs font-bold bg-slate-800/60 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer font-body"
        >
          ↺ Reset Posisi
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center text-[10px] font-body">
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-yellow-400"/><span className="text-white/50">Khatulistiwa</span></span>
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-white opacity-40"/><span className="text-white/50">Lintang/Bujur</span></span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block bg-orange-400"/><span className="text-white/50">Jari-jari (r)</span></span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — UNSUR-UNSUR BOLA
───────────────────────────────────────────────────────────── */
const UnsurBolaSVG = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-sm mx-auto my-2" aria-label="Unsur-unsur bola">
    <defs>
      <radialGradient id="bolaUnsurGrad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.85"/>
        <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.7"/>
      </radialGradient>
      <style>{`
        @keyframes boluAnim{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .bu{animation:boluAnim 1.6s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="130" r="95" fill="url(#bolaUnsurGrad)" stroke="#c4b5fd" strokeWidth="2"/>
    {/* Diameter */}
    <line x1="55" y1="130" x2="245" y2="130" stroke="#facc15" strokeWidth="2.5" strokeDasharray="7,4" className="bu"/>
    <text x="150" y="122" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">d = 2r</text>
    {/* Radius */}
    <line x1="150" y1="130" x2="245" y2="130" stroke="#f97316" strokeWidth="3"/>
    <circle cx="150" cy="130" r="5" fill="#f97316"/>
    <circle cx="245" cy="130" r="5" fill="#f97316"/>
    <text x="197" y="148" fill="#f97316" fontSize="12" fontFamily="monospace" fontWeight="bold">r</text>
    {/* Labels */}
    <text x="8" y="40" fill="#f97316" fontSize="10" fontFamily="monospace">r = jari-jari</text>
    <text x="8" y="56" fill="#facc15" fontSize="10" fontFamily="monospace">d = diameter = 2r</text>
    <text x="8" y="72" fill="#c4b5fd" fontSize="10" fontFamily="monospace">O = pusat bola</text>
    <text x="8" y="88" fill="#4ade80" fontSize="10" fontFamily="monospace">Permukaan = sisi lengkung</text>
    <text x="141" y="145" fill="#c4b5fd" fontSize="9" fontFamily="monospace">O</text>
    {/* Equator ellipse */}
    <ellipse cx="150" cy="130" rx="95" ry="23" fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7"/>
    <text x="150" y="243" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Setiap titik pada permukaan berjarak r dari pusat O</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE HALF-SPHERE (HEMISPHERE) — draggable
───────────────────────────────────────────────────────────── */
const HS_R = 85;
const HS_W = 300;
const HS_CX = 150;
const HS_CY = 130;

const InteractiveHalfSphere3D = () => {
  const [spinY, setSpinY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ sx: 0, base: 0 });

  const onMD = (e: React.MouseEvent) => { setIsDragging(true); dragRef.current = { sx: e.clientX, base: spinY }; };
  const onMM = useCallback((e: MouseEvent) => { if (!isDragging) return; setSpinY(dragRef.current.base + (e.clientX - dragRef.current.sx) * 0.8); }, [isDragging]);
  const onMU = useCallback(() => setIsDragging(false), []);
  const onTS = (e: React.TouchEvent) => { const t = e.touches[0]; setIsDragging(true); dragRef.current = { sx: t.clientX, base: spinY }; };
  const onTM = useCallback((e: TouchEvent) => { if (!isDragging) return; setSpinY(dragRef.current.base + (e.touches[0].clientX - dragRef.current.sx) * 0.8); }, [isDragging]);
  const onTE = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMM); window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onTM, { passive: true }); window.addEventListener("touchend", onTE);
    return () => { window.removeEventListener("mousemove", onMM); window.removeEventListener("mouseup", onMU); window.removeEventListener("touchmove", onTM); window.removeEventListener("touchend", onTE); };
  }, [onMM, onMU, onTM, onTE]);

  useEffect(() => {
    if (isDragging) return;
    let frameId: number; let lastTs = 0;
    const animate = (ts: number) => { if (lastTs) setSpinY(prev => prev + (ts - lastTs) * 0.03); lastTs = ts; frameId = requestAnimationFrame(animate); };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging]);

  const lonCount = 5;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
      <p className="text-white/60 text-xs text-center font-body">Drag untuk memutar setengah bola</p>
      <svg
        viewBox={`0 0 ${HS_W} 200`}
        width="100%"
        style={{ maxWidth: HS_W, display: "block", margin: "0 auto", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMD}
        onTouchStart={onTS}
      >
        <defs>
          <radialGradient id="hsGrad" cx="35%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="1"/>
            <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.95"/>
          </radialGradient>
          <radialGradient id="hsShine" cx="30%" cy="22%" r="32%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="hsHalfClip">
            <rect x="0" y="0" width={HS_W} height={HS_CY}/>
          </clipPath>
          <filter id="hsShadow">
            <feDropShadow dx="3" dy="5" stdDeviation="8" floodColor="#000" floodOpacity="0.45"/>
          </filter>
        </defs>

        {/* Shadow below base */}
        <ellipse cx={HS_CX} cy={HS_CY + 13} rx={HS_R * 0.80} ry={10} fill="rgba(0,0,0,0.30)"/>

        {/* Dome — clipped to upper half */}
        <g clipPath="url(#hsHalfClip)">
          <circle cx={HS_CX} cy={HS_CY} r={HS_R} fill="url(#hsGrad)" filter="url(#hsShadow)"/>
          {Array.from({ length: lonCount }, (_, i) => {
            const angle = ((i * 180) / lonCount + spinY) % 180;
            const rad = (angle * Math.PI) / 180;
            const rx = HS_R * Math.abs(Math.sin(rad));
            return (
              <ellipse key={i} cx={HS_CX} cy={HS_CY} rx={rx < 2 ? 0 : rx} ry={HS_R}
                fill="none" stroke="#ffffff" strokeWidth={0.8} opacity={0.22} strokeDasharray="5,4"/>
            );
          })}
          <circle cx={HS_CX} cy={HS_CY} r={HS_R} fill="url(#hsShine)"/>
          <circle cx={HS_CX} cy={HS_CY} r={HS_R} fill="none" stroke="#93c5fd" strokeWidth="1.5"/>
        </g>

        {/* Flat base ellipse */}
        <ellipse cx={HS_CX} cy={HS_CY} rx={HS_R} ry={HS_R * 0.27}
          fill="rgba(99,102,241,0.38)" stroke="#a5b4fc" strokeWidth="2"/>

        {/* r line on base */}
        <line x1={HS_CX} y1={HS_CY} x2={HS_CX + HS_R} y2={HS_CY} stroke="#f97316" strokeWidth="2"/>
        <circle cx={HS_CX} cy={HS_CY} r="3.5" fill="#f97316"/>
        <circle cx={HS_CX + HS_R} cy={HS_CY} r="3.5" fill="#f97316"/>
        <text x={HS_CX + HS_R/2} y={HS_CY + 17} fill="#f97316" fontSize="10"
          fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>

        {/* Info labels */}
        <text x="10" y="20" fill="#7dd3fc" fontSize="9" fontFamily="monospace">Setengah Bola (Hemisphere)</text>
        <text x="10" y="34" fill="#c4b5fd" fontSize="9" fontFamily="monospace">Sisi lengkung = 2πr²</text>
        <text x="10" y="48" fill="#4ade80" fontSize="9" fontFamily="monospace">Alas lingkaran = πr²</text>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   HALF-SPHERE → 3 CIRCLES ANIMATION  (L = 3πr²)
   Setengah bola dipecah: 2 lingkaran selimut + 1 lingkaran alas
───────────────────────────────────────────────────────────── */
const _hsLerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const _hsEase  = (t: number) => 1 - Math.pow(1 - t, 3);
const _hsClamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const HS3_DUR = 5000;
const HS3_R   = 44;

const HS3_CIRCLES = [
  { label: "πr²", color: "rgba(34,211,238,0.85)",  stroke: "#22d3ee", tx: 68,  ty: 105, desc: "Selimut atas" },
  { label: "πr²", color: "rgba(168,85,247,0.85)",  stroke: "#a78bfa", tx: 160, ty: 105, desc: "Selimut bawah" },
  { label: "πr²", color: "rgba(74,222,128,0.85)",  stroke: "#4ade80", tx: 252, ty: 105, desc: "Alas lingkaran" },
] as const;

const HalfSphereTo3CirclesAnimation = () => {
  const [phase, setPhase]       = useState<"idle"|"running"|"done">("idle");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number|null>(null);
  const t0Ref  = useRef<number|null>(null);

  const doStart = () => {
    if (phase !== "idle") return;
    setPhase("running"); t0Ref.current = null;
    const tick = (now: number) => {
      if (!t0Ref.current) t0Ref.current = now;
      const raw = Math.min((now - t0Ref.current) / HS3_DUR, 1);
      setProgress(raw);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
      else { setProgress(1); setPhase("done"); }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const doReset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null; t0Ref.current = null;
    setPhase("idle"); setProgress(0);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const p = progress;
  const isDone = phase === "done";

  const domeOp    = _hsClamp(1 - _hsClamp((p - 0.28) / 0.26, 0, 1), 0, 1);
  const tSep      = _hsEase(_hsClamp((p - 0.24) / 0.38, 0, 1));
  const tMorph    = _hsEase(_hsClamp((p - 0.50) / 0.35, 0, 1));
  const tLabel    = _hsClamp((p - 0.82) / 0.18, 0, 1);
  const circleOp  = _hsClamp((p - 0.22) / 0.12, 0, 1);

  return (
    <div style={{ background:"rgba(4,8,22,0.94)", border:"1px solid rgba(74,222,128,0.35)", borderRadius:14, padding:"12px 10px 10px", userSelect:"none" }}>
      <style>{`
        @keyframes hs3-in { from{opacity:0;transform:scale(.75);} to{opacity:1;transform:scale(1);} }
        .hs3-in { animation: hs3-in .4s ease-out both; }
      `}</style>
      <p style={{ textAlign:"center", fontFamily:"monospace", fontSize:10, fontWeight:"bold", color:"#4ade80", letterSpacing:".06em", textTransform:"uppercase", marginBottom:8 }}>
        ½ Bola → 3 Lingkaran → L = 3πr²
      </p>
      <svg viewBox="0 0 320 220" style={{ width:"100%", display:"block" }}>
        <defs>
          <radialGradient id="hs3-dome" cx="35%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#7dd3fc"/>
            <stop offset="40%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#1e3a5f"/>
          </radialGradient>
          <clipPath id="hs3-clip">
            <rect x="105" y="22" width="110" height="62"/>
          </clipPath>
        </defs>

        {/* Hemisphere (fades out) */}
        {domeOp > 0.01 && (
          <g style={{ opacity: domeOp }}>
            <g clipPath="url(#hs3-clip)">
              <circle cx="160" cy="84" r="62" fill="url(#hs3-dome)" stroke="#93c5fd" strokeWidth="1.2"/>
            </g>
            <ellipse cx="160" cy="84" rx="62" ry="17" fill="rgba(99,102,241,0.40)" stroke="#a5b4fc" strokeWidth="1.5"/>
            {phase === "idle" && (
              <text x="160" y="115" fill="#c4b5fd" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                ½ Bola — tekan tombol untuk memecah
              </text>
            )}
          </g>
        )}

        {/* 3 circles */}
        {phase !== "idle" && HS3_CIRCLES.map((c, i) => {
          const cxCur = _hsLerp(160, c.tx, tSep);
          const cyCur = _hsLerp(84,  c.ty, tSep);
          const rCur  = _hsLerp(16,  HS3_R, tMorph);
          return (
            <g key={i} style={{ opacity: circleOp }}>
              <circle cx={cxCur} cy={cyCur} r={rCur} fill={c.color} stroke={c.stroke} strokeWidth="1.5"/>
              {tLabel > 0.01 && (
                <text x={cxCur} y={cyCur + 4} fill="white" fontSize="10" fontFamily="monospace"
                  fontWeight="bold" textAnchor="middle" style={{ opacity: tLabel }}>πr²</text>
              )}
              {isDone && (
                <text x={cxCur} y={cyCur + HS3_R + 16} fill={c.stroke} fontSize="7.5"
                  fontFamily="monospace" textAnchor="middle"
                  className="hs3-in" style={{ animationDelay:`${i * 0.1}s` }}>{c.desc}</text>
              )}
            </g>
          );
        })}

        {/* + signs and formula when done */}
        {isDone && (
          <>
            <text x="114" y="109" fill="#475569" fontSize="16" fontFamily="monospace" textAnchor="middle" className="hs3-in">+</text>
            <text x="206" y="109" fill="#475569" fontSize="16" fontFamily="monospace" textAnchor="middle" className="hs3-in" style={{ animationDelay:"0.1s" }}>+</text>
            <rect x="28" y="163" width="264" height="18" rx="6" fill="rgba(74,222,128,.12)" stroke="rgba(74,222,128,.45)" strokeWidth="1.2" className="hs3-in" style={{ animationDelay:"0.2s" }}/>
            <text x="160" y="176" fill="#4ade80" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" className="hs3-in" style={{ animationDelay:"0.22s" }}>
              L = πr² + πr² + πr² = 3πr²
            </text>
            <text x="160" y="198" fill="#94a3b8" fontSize="8.5" fontFamily="monospace" textAnchor="middle" className="hs3-in" style={{ animationDelay:"0.3s" }}>
              (Selimut lengkung: 2πr² + Alas: πr²)
            </text>
          </>
        )}
      </svg>

      <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:10 }}>
        <button onClick={doStart} disabled={phase !== "idle"}
          style={{ padding:"6px 18px", borderRadius:8, border:"1px solid #16a34a",
            background: phase === "idle" ? "rgba(22,163,74,.20)" : "transparent",
            color:"#4ade80", fontSize:12, fontWeight:"bold",
            cursor: phase !== "idle" ? "not-allowed" : "pointer",
            opacity: phase !== "idle" ? .35 : 1, fontFamily:"inherit" }}>
          🔵 Pecah ½ Bola → 3 Lingkaran
        </button>
        <button onClick={doReset}
          style={{ padding:"6px 18px", borderRadius:8, border:"1px solid #475569",
            background:"transparent", color:"#94a3b8", fontSize:12, fontWeight:"bold",
            cursor:"pointer", fontFamily:"inherit" }}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SPHERE FRUIT-CUT ANIMATION
   Bola "dipotong seperti buah" menjadi 4 bagian → tiap bagian
   bertransformasi menjadi lingkaran sempurna (πr²).

   Phases:
     0.00–0.20  Garis potong muncul (vertikal lalu horizontal)
     0.20–0.52  4 potongan bergerak ke 4 sudut
     0.52–0.87  Tiap potongan "mengembang" dari sektor 90° → lingkaran penuh
     0.87–1.00  Label πr² & rumus muncul
───────────────────────────────────────────────────────────── */
const _scEaseOut    = (t: number) => 1 - Math.pow(1 - t, 3);
const _scEaseInOut  = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const _scClamp      = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const _scLerp       = (a: number, b: number, t: number) => a + (b - a) * t;

const SC_SCX = 160; const SC_SCY = 102; const SC_SR = 52;
const SC_CR  = 50;  const SC_DUR = 7500;

/* baseAngle: starting angle of the 90° sector for each quadrant (SVG CW, 0°=right) */
const SC_PIECES = [
  { id:"TL", color:"rgba(34,211,238,0.88)",  stroke:"#22d3ee", baseAngle:180, dx:-90, dy:-36 },
  { id:"TR", color:"rgba(249,115,22,0.88)",  stroke:"#fb923c", baseAngle:270, dx: 90, dy:-36 },
  { id:"BL", color:"rgba(139,92,246,0.88)",  stroke:"#a78bfa", baseAngle: 90, dx:-90, dy: 98 },
  { id:"BR", color:"rgba(34,197,94,0.88)",   stroke:"#4ade80", baseAngle:  0, dx: 90, dy: 98 },
] as const;

/* Build SVG path for a sector of given sweep (90→360).
   When sweep≥360 draws a full circle via two semicircle arcs. */
const _scSectorPath = (cx: number, cy: number, r: number, baseDeg: number, sweepDeg: number): string => {
  if (sweepDeg >= 359.9) {
    return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;
  }
  const sRad = (baseDeg * Math.PI) / 180;
  const eRad = ((baseDeg + sweepDeg) * Math.PI) / 180;
  const x1 = (cx + r * Math.cos(sRad)).toFixed(2);
  const y1 = (cy + r * Math.sin(sRad)).toFixed(2);
  const x2 = (cx + r * Math.cos(eRad)).toFixed(2);
  const y2 = (cy + r * Math.sin(eRad)).toFixed(2);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
};

/* Per-piece 3D gradient data (focal point at outer corner = facing-light side) */
const SC_3D = {
  TL: { grad:"sc-g3d-TL", fx:-SC_SR*0.22, fy:-SC_SR*0.28, c0:"#cffafe", c1:"#22d3ee", c2:"#083344" },
  TR: { grad:"sc-g3d-TR", fx: SC_SR*0.22, fy:-SC_SR*0.28, c0:"#fff7ed", c1:"#fb923c", c2:"#431407" },
  BL: { grad:"sc-g3d-BL", fx:-SC_SR*0.22, fy: SC_SR*0.28, c0:"#f5f3ff", c1:"#a78bfa", c2:"#2e1065" },
  BR: { grad:"sc-g3d-BR", fx: SC_SR*0.22, fy: SC_SR*0.28, c0:"#f0fdf4", c1:"#4ade80", c2:"#052e16" },
} as const;

const SphereFruitCutAnimation = () => {
  const [phase,    setPhase]    = useState<"idle"|"running"|"done">("idle");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number|null>(null);
  const t0Ref  = useRef<number|null>(null);

  const doStart = () => {
    if (phase !== "idle") return;
    setPhase("running"); t0Ref.current = null;
    const tick = (now: number) => {
      if (!t0Ref.current) t0Ref.current = now;
      const raw = Math.min((now - t0Ref.current) / SC_DUR, 1);
      setProgress(raw);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
      else         { setProgress(1); setPhase("done"); }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const doReset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null; t0Ref.current = null;
    setPhase("idle"); setProgress(0);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const p = progress;
  const isDone = phase === "done";

  /* ── Sphere body fades out as pieces spread ── */
  const sphereOp = _scClamp(1 - _scClamp((p - 0.36) / 0.20, 0, 1), 0, 1);

  /* ── Cut lines ── */
  const cutV   = _scEaseOut(_scClamp(p / 0.12, 0, 1));
  const cutH   = _scEaseOut(_scClamp((p - 0.08) / 0.14, 0, 1));
  const cutLen = SC_SR * 2 + 8;

  /* ── Per-piece values ── */
  const pieces = SC_PIECES.map(pc => {
    const g3d = SC_3D[pc.id as keyof typeof SC_3D];

    const tSep   = _scClamp((p - 0.20) / 0.32, 0, 1);
    const tMorph = _scClamp((p - 0.52) / 0.36, 0, 1);
    const tLabel = _scClamp((p - 0.88) / 0.12, 0, 1);

    /* cut faces appear after pieces separate, fade before morph ends */
    const tFace  = _scClamp((p - 0.29) / 0.14, 0, 1)
                 * _scClamp(1 - (p - 0.50) / 0.16, 0, 1);

    const cx    = SC_SCX + _scLerp(0, pc.dx, _scEaseOut(tSep));
    const cy    = SC_SCY + _scLerp(0, pc.dy, _scEaseOut(tSep));
    const sweep = _scLerp(90, 360, _scEaseInOut(tMorph));

    const pieceOp = phase === "idle" ? 0 : _scClamp((p - 0.16) / 0.08, 0, 1);

    /* specular ellipse — outer-corner position, fades as circle completes */
    const specX   = g3d.fx * 0.36;
    const specY   = g3d.fy * 0.36;
    const specOp  = _scClamp(1 - (sweep - 280) / 70, 0, 1);
    const specRY  = SC_CR * 0.18 * Math.max(sweep / 360, 0.22);

    return { ...pc, g3d, cx, cy, sweep, pieceOp, tFace, labelOp: tLabel, specX, specY, specOp, specRY };
  });

  return (
    <div style={{ background:"rgba(4,8,22,0.94)", border:"1px solid rgba(34,197,94,0.38)",
      borderRadius:14, padding:"12px 10px 10px", userSelect:"none" }}>
      <style>{`
        @keyframes sc-glow  { 0%,100%{filter:drop-shadow(0 0 10px rgba(139,92,246,.55));}
                              50%    {filter:drop-shadow(0 0 26px rgba(139,92,246,.95));} }
        @keyframes sc-knife { 0%,100%{opacity:.7;} 50%{opacity:1;} }
        @keyframes sc-in    { from{opacity:0;transform:scale(.75);} to{opacity:1;transform:scale(1);} }
        .sc-glow  { animation:sc-glow  2.6s ease-in-out infinite; }
        .sc-knife { animation:sc-knife 0.8s ease-in-out 3; }
        .sc-in    { animation:sc-in   .40s ease-out both; }
      `}</style>

      <p style={{ textAlign:"center", fontFamily:"monospace", fontSize:10, fontWeight:"bold",
        color:"#4ade80", letterSpacing:".06em", textTransform:"uppercase", marginBottom:8 }}>
        🍊 Bola 3D Dipotong → 4 Potongan 3D → Dilebarkan → 4 Lingkaran
      </p>

      <svg viewBox="0 0 320 268" style={{ width:"100%", display:"block" }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Original sphere gradient */}
          <radialGradient id="sc-sg" cx="33%" cy="27%" r="65%">
            <stop offset="0%"   stopColor="#e0d9ff" stopOpacity=".95"/>
            <stop offset="35%"  stopColor="#8b5cf6" stopOpacity=".88"/>
            <stop offset="100%" stopColor="#2e1065" stopOpacity=".97"/>
          </radialGradient>
          {/* Shared specular overlay */}
          <radialGradient id="sc-hi" cx="29%" cy="22%" r="40%">
            <stop offset="0%"   stopColor="#fff" stopOpacity=".40"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>

          {/* 3D gradients for each piece — userSpaceOnUse so they stay pinned
              when we use translate(cx,cy); coordinates are LOCAL to piece (0,0 = center) */}
          {(Object.entries(SC_3D) as [string, typeof SC_3D.TL][]).map(([id, g]) => (
            <radialGradient key={id} id={g.grad}
              gradientUnits="userSpaceOnUse"
              cx={g.fx} cy={g.fy} r={SC_SR * 1.15}>
              <stop offset="0%"   stopColor={g.c0} stopOpacity=".96"/>
              <stop offset="42%"  stopColor={g.c1} stopOpacity=".92"/>
              <stop offset="100%" stopColor={g.c2} stopOpacity=".98"/>
            </radialGradient>
          ))}

          {/* Clip for original sphere (for cut lines) */}
          <clipPath id="sc-clip">
            <circle cx={SC_SCX} cy={SC_SCY} r={SC_SR + 2}/>
          </clipPath>
        </defs>

        {/* ══════════════ BOLA UTUH (fades out) ══════════════ */}
        {sphereOp > 0.01 && (
          <g style={{ opacity: sphereOp }}>
            <ellipse cx={SC_SCX} cy={SC_SCY + SC_SR + 10} rx={SC_SR * 0.72} ry={9}
              fill="rgba(0,0,0,0.35)"/>
            <circle cx={SC_SCX} cy={SC_SCY} r={SC_SR}
              fill="url(#sc-sg)" stroke="#a78bfa" strokeWidth="1.8"
              className={phase === "idle" ? "sc-glow" : ""}/>
            <circle cx={SC_SCX} cy={SC_SCY} r={SC_SR} fill="url(#sc-hi)"/>
            {/* Equator & meridian dashes */}
            <ellipse cx={SC_SCX} cy={SC_SCY} rx={SC_SR} ry={SC_SR * 0.23}
              fill="none" stroke="rgba(196,181,253,.30)" strokeWidth="1" strokeDasharray="5,4"/>
            <path d={`M${SC_SCX} ${SC_SCY-SC_SR} A${Math.round(SC_SR*0.26)} ${SC_SR} 0 0 1 ${SC_SCX} ${SC_SCY+SC_SR}`}
              fill="none" stroke="rgba(196,181,253,.25)" strokeWidth="1"/>
            {/* r label */}
            <line x1={SC_SCX} y1={SC_SCY} x2={SC_SCX + SC_SR} y2={SC_SCY}
              stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="3,2"/>
            <circle cx={SC_SCX} cy={SC_SCY} r="2.5" fill="#f59e0b"/>
            <text x={SC_SCX + SC_SR*0.5} y={SC_SCY - 7}
              fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>

            {/* Garis pisau (animasi dashed line) */}
            {p > 0.01 && (
              <g clipPath="url(#sc-clip)">
                <line x1={SC_SCX} y1={SC_SCY - SC_SR - 3} x2={SC_SCX} y2={SC_SCY + SC_SR + 3}
                  stroke="#facc15" strokeWidth="3.5" strokeLinecap="round"
                  strokeDasharray={`${cutLen}`} strokeDashoffset={cutLen * (1 - cutV)}
                  opacity={cutV > 0.02 ? 0.95 : 0}
                  className={cutV > 0.05 && cutV < 0.98 ? "sc-knife" : ""}/>
                <line x1={SC_SCX - SC_SR - 3} y1={SC_SCY} x2={SC_SCX + SC_SR + 3} y2={SC_SCY}
                  stroke="#facc15" strokeWidth="3.5" strokeLinecap="round"
                  strokeDasharray={`${cutLen}`} strokeDashoffset={cutLen * (1 - cutH)}
                  opacity={cutH > 0.02 ? 0.95 : 0}
                  className={cutH > 0.05 && cutH < 0.98 ? "sc-knife" : ""}/>
                {p > 0.12 && p < 0.42 && (
                  <circle cx={SC_SCX} cy={SC_SCY} r="6"
                    fill="#facc15" opacity={0.55 * _scClamp((p - 0.12)/0.06, 0, 1)}/>
                )}
              </g>
            )}

            {phase === "idle" && (
              <text x={SC_SCX} y={SC_SCY + SC_SR + 20}
                fill="#c4b5fd" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                Bola 3D — tekan tombol untuk memotong
              </text>
            )}
          </g>
        )}

        {/* ══════════════ 4 POTONGAN BOLA 3D → LINGKARAN ══════════════ */}
        {pieces.map((pc, i) => pc.pieceOp > 0.005 && (
          <g key={pc.id} style={{ opacity: pc.pieceOp }}>
            {/*  Semua koordinat dalam sistem lokal piece (0,0 = pusat piece)
                 via translate — gradient userSpaceOnUse ikut terpusat di sini  */}
            <g transform={`translate(${pc.cx},${pc.cy})`}>

              {/* ── BIDANG POTONG HORIZONTAL (penampang silinder) ── */}
              {pc.tFace > 0.005 && (
                <ellipse cx={0} cy={0}
                  rx={SC_SR * 0.86} ry={SC_SR * 0.20}
                  fill={pc.color} fillOpacity={0.30}
                  stroke="rgba(255,255,255,0.42)" strokeWidth="1"
                  opacity={pc.tFace}/>
              )}
              {/* ── BIDANG POTONG VERTIKAL (edge-on, sangat tipis) ── */}
              {pc.tFace > 0.005 && (
                <ellipse cx={0} cy={0}
                  rx={SC_SR * 0.13} ry={SC_SR * 0.86}
                  fill={pc.color} fillOpacity={0.22}
                  stroke="rgba(255,255,255,0.30)" strokeWidth="0.8"
                  opacity={pc.tFace * 0.75}/>
              )}

              {/* ── BADAN 3D PIECE: sektor melebar 90° → 360° ── */}
              <path
                d={_scSectorPath(0, 0, SC_CR, pc.baseAngle, pc.sweep)}
                fill={`url(#${pc.g3d.grad})`}
                stroke={pc.stroke}
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* ── SPECULAR SHEEN (titik cahaya di permukaan lengkung) ── */}
              {pc.specOp > 0.02 && (
                <ellipse
                  cx={pc.specX} cy={pc.specY}
                  rx={SC_CR * 0.26} ry={pc.specRY}
                  fill="rgba(255,255,255,.38)"
                  opacity={pc.specOp}/>
              )}

              {/* ── OUTLINE RING saat sudah jadi lingkaran penuh ── */}
              {pc.sweep > 340 && (
                <circle cx={0} cy={0} r={SC_CR + 3}
                  fill="none" stroke={pc.stroke} strokeWidth="1.2"
                  opacity={_scClamp((pc.sweep - 340) / 20, 0, 1) * 0.60}/>
              )}

              {/* ── LABEL πr² ── */}
              {pc.labelOp > 0.01 && (
                <text x={0} y={5}
                  fill="var(--icon-color)" fontSize="11" fontFamily="monospace"
                  fontWeight="bold" textAnchor="middle"
                  style={{ opacity: pc.labelOp }}>πr²</text>
              )}

              {/* ── NOMOR lingkaran saat selesai ── */}
              {isDone && (
                <text x={-SC_CR + 14} y={-SC_CR + 16}
                  fill="rgba(255,255,255,.65)" fontSize="9" fontFamily="monospace"
                  fontWeight="bold" textAnchor="middle"
                  className="sc-in" style={{ animationDelay:`${i * 0.08}s` }}>
                  {i + 1}
                </text>
              )}
            </g>
          </g>
        ))}

        {/* ══════════════ DONE: + connectors + formula ══════════════ */}
        {isDone && (
          <>
            <text x="160" y="75"  fill="#475569" fontSize="18" fontFamily="monospace"
              textAnchor="middle" className="sc-in">+</text>
            <text x="72"  y="145" fill="#475569" fontSize="18" fontFamily="monospace"
              textAnchor="middle" className="sc-in" style={{ animationDelay:"0.08s" }}>+</text>
            <text x="160" y="210" fill="#475569" fontSize="18" fontFamily="monospace"
              textAnchor="middle" className="sc-in" style={{ animationDelay:"0.16s" }}>+</text>
            <rect x="28" y="235" width="264" height="18" rx="6"
              fill="rgba(251,191,36,.10)" stroke="rgba(251,191,36,.45)" strokeWidth="1.2"
              className="sc-in" style={{ animationDelay:"0.22s" }}/>
            <text x="160" y="248" fill="#fbbf24" fontSize="10.5" fontFamily="monospace"
              fontWeight="bold" textAnchor="middle"
              className="sc-in" style={{ animationDelay:"0.24s" }}>
              L = 4 × πr²  =  4πr²
            </text>
          </>
        )}
      </svg>

      {/* ── Buttons ── */}
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:10 }}>
        <button onClick={doStart} disabled={phase !== "idle"}
          style={{ padding:"6px 18px", borderRadius:8,
            border:"1px solid #16a34a",
            background: phase === "idle" ? "rgba(22,163,74,.20)" : "transparent",
            color:"#4ade80", fontSize:12, fontWeight:"bold",
            cursor: phase !== "idle" ? "not-allowed" : "pointer",
            opacity: phase !== "idle" ? .35 : 1, fontFamily:"inherit", transition:"opacity .2s" }}>
          🍊 Potong Bola 3D → 4 Lingkaran
        </button>
        <button onClick={doReset}
          style={{ padding:"6px 18px", borderRadius:8, border:"1px solid #475569",
            background:"transparent", color:"#94a3b8", fontSize:12, fontWeight:"bold",
            cursor:"pointer", fontFamily:"inherit" }}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

const LuasBolaSVG = () => (
  <svg viewBox="0 0 340 220" className="w-full max-w-sm mx-auto my-2" aria-label="Luas permukaan bola">
    <defs>
      <radialGradient id="lb1" cx="35%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#0e7490" stopOpacity="0.5"/>
      </radialGradient>
      <style>{`
        @keyframes lbAnim{0%,100%{opacity:0.85;}50%{opacity:0.3;}}
        .lb{animation:lbAnim 2s ease-in-out infinite;}
        .lb2{animation:lbAnim 2s ease-in-out infinite 0.5s;}
        .lb3{animation:lbAnim 2s ease-in-out infinite 1s;}
        .lb4{animation:lbAnim 2s ease-in-out infinite 1.5s;}
      `}</style>
    </defs>
    {/* 4 circles representing 4πr² */}
    <circle cx="68" cy="80" r="55" fill="url(#lb1)" className="lb" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="68" y="84" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">πr²</text>
    <circle cx="185" cy="80" r="55" fill="#8b5cf6" opacity="0.7" className="lb2" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="185" y="84" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">πr²</text>
    <circle cx="68" cy="170" r="55" fill="#f97316" opacity="0.65" className="lb3" stroke="#fb923c" strokeWidth="1.5"/>
    <text x="68" y="174" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">πr²</text>
    <circle cx="185" cy="170" r="55" fill="#22c55e" opacity="0.65" className="lb4" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="185" y="174" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">πr²</text>
    {/* Formula */}
    <text x="280" y="125" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L =</text>
    <text x="300" y="140" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">4πr²</text>
    <text x="280" y="160" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">(4 lingkaran)</text>
  </svg>
);

const VolumeBolaSVG = () => (
  <svg viewBox="0 0 300 280" className="w-full max-w-sm mx-auto my-2" aria-label="Volume bola">
    <defs>
      <radialGradient id="vbGrad" cx="32%" cy="28%" r="62%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="1"/>
        <stop offset="100%" stopColor="#3b0764" stopOpacity="0.9"/>
      </radialGradient>
      <radialGradient id="vbShine" cx="28%" cy="25%" r="35%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </radialGradient>
      <style>{`
        @keyframes vbPulse{0%,100%{filter:drop-shadow(0 0 18px #7c3aed);opacity:1;}50%{filter:drop-shadow(0 0 5px #4c1d95);opacity:0.75;}}
        .vb{animation:vbPulse 2.5s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="130" r="100" fill="url(#vbGrad)" className="vb" stroke="#c4b5fd" strokeWidth="2"/>
    <circle cx="150" cy="130" r="100" fill="url(#vbShine)"/>
    {/* r arrow */}
    <line x1="150" y1="130" x2="250" y2="130" stroke="#facc15" strokeWidth="2.5"/>
    <circle cx="150" cy="130" r="4" fill="#facc15"/>
    <text x="197" y="148" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
    {/* Formula */}
    <text x="150" y="260" fill="#e0e7ff" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      V = ⁴⁄₃ π r³
    </text>
    <text x="150" y="275" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
      ≈ 4,189 r³
    </text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   VOLUME BOLA — animated water-fill visualization
───────────────────────────────────────────────────────────── */
const WaterBolaAnimation = () => {
  const [fill, setFill] = useState(0);
  const [wave, setWave] = useState(0);

  useEffect(() => {
    const FILL_MS    = 3600;
    const HOLD_FULL  = 900;
    const EMPTY_MS   = 2200;
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
      setWave(Math.sin(now * 0.004) * 2.8);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const CX = 110;
  const CY = 110;
  const R  = 80;

  const isEmpty     = fill < 0.005;
  const isFull      = fill > 0.995;
  const showSurface = !isEmpty && !isFull;

  // Water surface position (SVG y increases downward)
  const waterSurfaceY  = CY + R * (1 - 2 * fill);
  // Radius of circular cross-section at that height
  const wsr2 = 1 - (1 - 2 * fill) ** 2;
  const waterSurfaceRx = R * Math.sqrt(Math.max(0, wsr2));
  const waterSurfaceRy = waterSurfaceRx * 0.22;
  const waveOffset     = showSurface ? wave : 0;

  const pct = Math.round(fill * 100);

  const barX = 208, barY = CY - R, barW = 13, barH = 2 * R;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 0 280 235" className="w-full max-w-sm mx-auto my-2"
      aria-label="Animasi bola diisi air">
      <defs>
        <clipPath id="sphereClipWater">
          <circle cx={CX} cy={CY} r={R}/>
        </clipPath>
        <radialGradient id="waterBolaGrad" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.95"/>
        </radialGradient>
        <radialGradient id="sphereShellGrad" cx="32%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.08"/>
        </radialGradient>
        <radialGradient id="sphereShineW" cx="28%" cy="24%" r="32%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <filter id="wBloomB">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Sphere shell (dark bg) ── */}
      <circle cx={CX} cy={CY} r={R} fill="url(#sphereShellGrad)" stroke="none"/>

      {/* ── Water body clipped to sphere ── */}
      <g clipPath="url(#sphereClipWater)">
        {!isEmpty && (
          <rect
            x={CX - R - 2}
            y={waterSurfaceY + waveOffset}
            width={(R + 2) * 2}
            height={CY + R - waterSurfaceY + 4}
            fill="url(#waterBolaGrad)"
          />
        )}

        {/* ── Water surface ellipse (wave) ── */}
        {showSurface && (
          <>
            <ellipse
              cx={CX}
              cy={waterSurfaceY + waveOffset}
              rx={waterSurfaceRx}
              ry={waterSurfaceRy + 1}
              fill="#7dd3fc"
              fillOpacity={0.5}
            />
            <ellipse
              cx={CX}
              cy={waterSurfaceY + waveOffset}
              rx={waterSurfaceRx}
              ry={waterSurfaceRy + 1}
              fill="none"
              stroke="#bae6fd"
              strokeWidth="1.6"
              strokeDasharray="5,3"
              opacity={0.85}
            />
          </>
        )}
      </g>

      {/* ── Sphere outline on top ── */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#a78bfa" strokeWidth="2.5"/>

      {/* ── Equator dashed line (perspective) ── */}
      <ellipse cx={CX} cy={CY} rx={R} ry={R * 0.22}
        fill="none" stroke="#c4b5fd" strokeWidth="1.2"
        strokeDasharray="5,4" opacity="0.55"/>

      {/* ── Sphere shine ── */}
      <circle cx={CX} cy={CY} r={R} fill="url(#sphereShineW)"/>

      {/* ── r dimension label ── */}
      <line x1={CX} y1={CY} x2={CX + R} y2={CY}
        stroke="#facc15" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.9"/>
      <circle cx={CX}     cy={CY} r="3" fill="#facc15"/>
      <circle cx={CX + R} cy={CY} r="3" fill="#facc15"/>
      <text x={CX + R / 2} y={CY + 14}
        fill="#facc15" fontSize="11" fontFamily="monospace"
        fontWeight="bold" textAnchor="middle">r</text>

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
      <text x={CX} y={CY + R + 22}
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloomB)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x={CX} y={CY + R + 38}
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloomB)">
        V = ⁴⁄₃πr³
      </text>
    </svg>
  );
};

const SeparasiBolaSegitigaSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto my-2" aria-label="Separasi bola menjadi 4/3 kerucut">
    <defs>
      <style>{`
        @keyframes sep1{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .s1{animation:sep1 1.8s ease-in-out infinite;}
        .s2{animation:sep1 1.8s ease-in-out infinite 0.6s;}
        .s3{animation:sep1 1.8s ease-in-out infinite 1.2s;}
      `}</style>
    </defs>
    {/* Bola kiri */}
    <circle cx="70" cy="100" r="60" fill="rgba(99,102,241,0.35)" stroke="#a5b4fc" strokeWidth="2"/>
    <text x="70" y="100" fill="#e0e7ff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BOLA</text>
    <text x="70" y="112" fill="#a5b4fc" fontSize="8" fontFamily="monospace" textAnchor="middle">⁴⁄₃πr³</text>
    {/* Equals */}
    <text x="148" y="104" fill="#facc15" fontSize="18" fontFamily="monospace" fontWeight="bold">=</text>
    {/* 4 kerucut kecil */}
    <g transform="translate(175, 60)">
      {[0,1,2,3].map(i => (
        <g key={i} transform={`translate(${(i%2)*50}, ${Math.floor(i/2)*55})`}>
          <polygon points="25,0 0,45 50,45" fill="rgba(6,182,212,0.45)" stroke="#22d3ee" strokeWidth="1.5" className={`s${(i%3)+1}`}/>
          <text x="25" y="38" fill="#e0f2fe" fontSize="7" fontFamily="monospace" textAnchor="middle">⅓πr²t</text>
        </g>
      ))}
    </g>
    <text x="150" y="185" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Volume bola = 4 × ⅓πr³ (saat t = r)</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

const sections: Sec[] = [
  {
    title: "Definisi Bola",
    icon: "⚽",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          <strong className="text-cyan-300">Bola</strong> adalah bangun ruang sisi lengkung yang terbentuk dari{" "}
          <strong className="text-yellow-300">sekumpulan titik yang semuanya berjarak sama</strong> terhadap satu titik pusat.
          Jarak itu disebut <strong className="text-yellow-300">jari-jari (r)</strong>.
          Bola adalah bentuk paling sempurna di alam — dari buah jeruk, gelembung sabun, hingga planet-planet di antariksa!
        </p>
        <InteractiveSphere3D />
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">📌 Sifat-sifat Bola:</p>
          <ul className="space-y-1 text-xs text-white/75">
            <li>• Memiliki <strong className="text-yellow-300">1 sisi lengkung</strong> (permukaan) dan <strong className="text-yellow-300">tidak memiliki rusuk maupun titik sudut</strong></li>
            <li>• Setiap titik pada permukaan berjarak <strong className="text-yellow-300">sama</strong> terhadap pusat (<InlineMath math="= r" />)</li>
            <li>• Bola adalah <strong className="text-yellow-300">bangun simetri sempurna</strong> — tampak sama dari semua arah</li>
            <li>• Diameter bola <InlineMath math="d = 2r" /></li>
          </ul>
        </div>
        {/* ── Foto Benda Berbentuk Bola — slide 2 ── */}
        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-xl p-4 space-y-3">
          <p className="text-cyan-300 font-bold text-sm text-center">Benda Berbentuk Bola di Kehidupan Sehari-hari</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { src: imgBolaSepak, label: "Bola Sepak" },
              { src: imgGlobe,     label: "Bola Dunia" },
              { src: imgSemangka,  label: "Semangka" },
              { src: imgJeruk,     label: "Buah Jeruk" },
              { src: imgKelereng,  label: "Kelereng" },
              { src: imgBowling,   label: "Bola Bowling" },
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
    title: "Unsur-unsur Bola (Interaktif)",
    icon: "🔍",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        <InteractiveSphere3D />
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-orange-950/40 border border-orange-700/40 rounded-lg p-3 space-y-1">
            <p className="text-orange-300 font-semibold">① Titik Pusat (O)</p>
            <p className="text-xs text-white/70">Titik di tengah bola. Setiap titik pada permukaan bola berjarak <strong>r</strong> dari pusat ini.</p>
          </div>
          <div className="bg-green-950/40 border border-green-700/40 rounded-lg p-3 space-y-1">
            <p className="text-green-300 font-semibold">② Jari-jari (<InlineMath math="r" />)</p>
            <p className="text-xs text-white/70">Jarak dari pusat bola ke titik mana saja di permukaan bola. Semua jari-jari panjangnya sama.</p>
          </div>
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-3 space-y-1">
            <p className="text-yellow-300 font-semibold">③ Diameter (<InlineMath math="d" />)</p>
            <p className="text-xs text-white/70">Tali busur terpanjang yang melewati pusat bola. Sama dengan dua kali jari-jari: <InlineMath math="d = 2r" />.</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-3 space-y-1">
            <p className="text-cyan-300 font-semibold">④ Permukaan Bola</p>
            <p className="text-xs text-white/70">Satu-satunya sisi bola, seluruhnya berupa bidang lengkung. Tidak ada sisi datar, rusuk, maupun sudut.</p>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-3 space-y-1">
            <p className="text-violet-300 font-semibold">⑤ Setengah Bola (Belahan Bola)</p>
            <p className="text-xs text-white/70">Jika bola dipotong melalui pusat, terbentuk dua belahan bola (hemisphere), masing-masing memiliki:</p>
            <ul className="text-xs text-white/60 mt-1 space-y-0.5">
              <li>• Sisi datar berupa lingkaran (jari-jari = r)</li>
              <li>• Sisi lengkung = ½ permukaan bola = <InlineMath math="2\pi r^2" /></li>
            </ul>
          </div>
        </div>
        <InteractiveHalfSphere3D />
        <div className="bg-slate-800/60 border border-cyan-700/40 rounded-xl p-4 space-y-3">
          <p className="text-cyan-300 font-semibold text-sm">📋 Kesimpulan Unsur-unsur Bola</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 space-y-1">
              <p className="text-3xl font-bold text-cyan-300">1</p>
              <p className="text-xs text-white/70 font-body">Sisi</p>
              <p className="text-[10px] text-cyan-400/70 font-body">(sisi lengkung)</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-600/40 rounded-lg p-3 space-y-1">
              <p className="text-3xl font-bold text-white/40">0</p>
              <p className="text-xs text-white/70 font-body">Rusuk</p>
              <p className="text-[10px] text-white/30 font-body">(tidak ada)</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-600/40 rounded-lg p-3 space-y-1">
              <p className="text-3xl font-bold text-white/40">0</p>
              <p className="text-xs text-white/70 font-body">Titik Sudut</p>
              <p className="text-[10px] text-white/30 font-body">(tidak ada)</p>
            </div>
          </div>
          <p className="text-xs text-white/55 font-body text-center">
            Bola adalah satu-satunya bangun ruang yang hanya memiliki <strong className="text-cyan-300">1 sisi</strong> tanpa rusuk maupun titik sudut sama sekali.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Unsur</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Simbol</th>
              <th className="px-3 py-2 text-cyan-300">Keterangan</th>
            </tr></thead>
            <tbody>
              {[
                ["Titik pusat","O","pusat bola"],
                ["Jari-jari","r","pusat → permukaan"],
                ["Diameter","d = 2r","melewati pusat"],
                ["Permukaan","—","sisi lengkung tunggal"],
                ["Rusuk","0","tidak ada!"],
                ["Titik sudut","0","tidak ada!"],
              ].map(([u,s,k],i)=>(
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
    title: "Luas Permukaan Bola",
    icon: "🎨",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          <strong className="text-orange-300">Luas permukaan bola</strong> adalah total luas bidang lengkung yang membungkus bola.
          Fakta mengagumkan: luas permukaan bola tepat sama dengan luas{" "}
          <strong className="text-yellow-300">4 lingkaran</strong> dengan jari-jari yang sama!
        </p>
        <SphereFruitCutAnimation />
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-3">
          <p className="text-orange-300 font-semibold">📌 Penurunan Rumus:</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>Luas permukaan bola = 4 × luas lingkaran = <InlineMath math="4 \times \pi r^2" /></p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="\boxed{L = 4\pi r^2}" />
          </div>
          <p className="text-white/60 text-xs">Di mana <InlineMath math="r" /> adalah jari-jari bola.</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 <strong className="text-white">Belahan bola:</strong></p>
          <p>• Luas lengkung setengah bola = <InlineMath math="2\pi r^2" /> (setengah dari <InlineMath math="4\pi r^2" />)</p>
          <p>• Luas total setengah bola (termasuk alas) = <InlineMath math="2\pi r^2 + \pi r^2 = 3\pi r^2" /></p>
        </div>
        <blockquote className="border-l-4 border-orange-500 pl-3 text-orange-200 text-xs italic">
          💡 <strong>Trik mengingat:</strong> Luas bola = 4 × luas "lingkaran penampangnya". Mudah!
        </blockquote>
      </div>
    ),
  },
  {
    title: "Volume Bola",
    icon: "📦",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          <strong className="text-blue-300">Volume bola</strong> menyatakan besarnya ruang yang ditempati oleh bola.
          Rumus volume bola pertama kali ditemukan oleh <strong className="text-yellow-300">Archimedes</strong> dari Yunani kuno!
        </p>
        <div className="bg-slate-900/70 border border-violet-700/40 rounded-xl p-3">
          <p className="text-violet-300 font-semibold text-xs text-center mb-2 font-body">💧 Animasi Pengisian Air — Bola</p>
          <WaterBolaAnimation />
          <p className="text-white/45 text-[10px] text-center font-body mt-1">Bayangkan bola transparan diisi air dari bawah — volumenya adalah <strong className="text-violet-300">⁴⁄₃πr³</strong></p>
        </div>
        <div className="bg-blue-950/60 border border-blue-700/50 rounded-lg p-4 space-y-3">
          <p className="text-blue-300 font-semibold">📌 Penurunan Rumus:</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>Bayangkan bola dipecah menjadi banyak kerucut kecil dengan puncak di pusat bola dan alas di permukaan bola:</p>
            <p>• Setiap kerucut kecil: <InlineMath math="V = \frac{1}{3} \times \text{luas kecil} \times r" /></p>
            <p>• Jumlah semua kerucut = <InlineMath math="\frac{1}{3} \times L_{\text{bola}} \times r = \frac{1}{3} \times 4\pi r^2 \times r" /></p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="V = \frac{1}{3} \times 4\pi r^2 \times r" />
            <BlockMath math="\boxed{V = \frac{4}{3}\pi r^3}" />
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs space-y-1">
          <p className="text-cyan-300 font-semibold">🚀 Hubungan dengan Tabung:</p>
          <p className="text-white/70">Bola yang masuk pas dalam tabung (r & t = 2r sama):</p>
          <p className="text-white/70"><InlineMath math="V_{\text{bola}} = \frac{2}{3} \times V_{\text{tabung}}" /></p>
          <p className="text-white/70">(Rumus Archimedes yang terkenal!)</p>
        </div>
      </div>
    ),
  },
  {
    title: "Kesimpulan — Rumus Lengkap Bola",
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
                ["Diameter","d = 2r","dua kali jari-jari"],
                ["Luas permukaan","L = 4πr²","4 lingkaran"],
                ["Luas ½ bola (lengkung)","L = 2πr²","setengah permukaan"],
                ["Luas ½ bola (total)","L = 3πr²","+ alas lingkaran"],
                ["Volume","V = ⁴⁄₃πr³","Archimedes"],
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
          <p>🚀 <strong>Kunci utama bola:</strong> Semua rumus bergantung pada <strong className="text-yellow-300">satu variabel saja: r (jari-jari)</strong>!</p>
          <p>Ingat dua rumus utama: <InlineMath math="L = 4\pi r^2" /> dan <InlineMath math="V = \frac{4}{3}\pi r^3" /></p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE PROBLEMS
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const unsurExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>Perhatikan gambar bola berikut. Jari-jari bola adalah <strong className="text-yellow-300">10 cm</strong>.</p>
        <svg viewBox="0 0 200 200" className="w-44 h-44 mx-auto block">
          <defs>
            <radialGradient id="uq1grad" cx="38%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#93c5fd"/>
              <stop offset="100%" stopColor="#1e3a8a"/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="url(#uq1grad)" stroke="#60a5fa" strokeWidth="1.5"/>
          <ellipse cx="100" cy="100" rx="70" ry="18" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.7"/>
          <line x1="100" y1="100" x2="170" y2="100" stroke="#f97316" strokeWidth="2"/>
          <circle cx="100" cy="100" r="3" fill="#f97316"/>
          <text x="130" y="95" fill="#f97316" fontSize="12" fontWeight="bold">r = 10 cm</text>
          <text x="95" y="116" fill="#f97316" fontSize="10">O</text>
        </svg>
        <p>Tentukan:</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          <li>a) Panjang diameter bola</li>
          <li>b) Berapa jumlah sisi bola?</li>
          <li>c) Berapa jumlah rusuk bola?</li>
          <li>d) Berapa jumlah titik sudut bola?</li>
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-green-400 font-semibold">(a) Diameter:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="d = 2r = 2 \times 10 = 20 \text{ cm}" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-green-950/50 border border-green-700/40 rounded p-2 space-y-1">
            <p className="text-green-300 font-bold text-base">1</p>
            <p className="text-white/70">(b) Sisi</p>
            <p className="text-white/40 text-[10px]">sisi lengkung</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-600/40 rounded p-2 space-y-1">
            <p className="text-white/40 font-bold text-base">0</p>
            <p className="text-white/70">(c) Rusuk</p>
            <p className="text-white/40 text-[10px]">tidak ada</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-600/40 rounded p-2 space-y-1">
            <p className="text-white/40 font-bold text-base">0</p>
            <p className="text-white/70">(d) Titik Sudut</p>
            <p className="text-white/40 text-[10px]">tidak ada</p>
          </div>
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2 text-xs">
          <p className="text-green-300 font-semibold">✅ d = 20 cm · Sisi = 1 · Rusuk = 0 · Titik Sudut = 0</p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>Sebuah bola berdiameter <strong className="text-yellow-300">42 cm</strong> dipotong tepat melalui titik pusatnya sehingga terbentuk dua belahan bola (hemisphere).</p>
        <svg viewBox="0 0 220 160" className="w-52 h-40 mx-auto block">
          <defs>
            <radialGradient id="uq2grad" cx="38%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#3b0764"/>
            </radialGradient>
            <clipPath id="uq2clip">
              <rect x="0" y="0" width="220" height="100"/>
            </clipPath>
          </defs>
          <circle cx="110" cy="90" r="65" fill="url(#uq2grad)" stroke="#a78bfa" strokeWidth="1.5" clipPath="url(#uq2clip)"/>
          <ellipse cx="110" cy="90" rx="65" ry="16" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5"/>
          <line x1="45" y1="90" x2="175" y2="90" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3"/>
          <circle cx="110" cy="90" r="3" fill="#fbbf24"/>
          <text x="100" y="108" fill="#fbbf24" fontSize="10">O</text>
          <text x="65" y="85" fill="#fbbf24" fontSize="11" fontWeight="bold">d = 42 cm</text>
          <line x1="110" y1="90" x2="110" y2="25" stroke="#f97316" strokeWidth="1.5"/>
          <text x="113" y="60" fill="#f97316" fontSize="10">r = ?</text>
        </svg>
        <p>Tentukan:</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          <li>a) Jari-jari belahan bola</li>
          <li>b) Panjang garis tengah alas lingkaran belahan bola</li>
          <li>c) Berapa jumlah sisi datar yang dimiliki belahan bola?</li>
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Jari-jari belahan bola:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{42}{2} = 21 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Garis tengah alas lingkaran:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/70">Alas belahan bola berupa lingkaran dengan jari-jari = r bola.</p>
          <BlockMath math="d_{\text{alas}} = 2r = 2 \times 21 = 42 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(c) Jumlah sisi datar:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/70">Belahan bola memiliki <strong className="text-cyan-300">1 sisi datar</strong> (berupa lingkaran di alasnya) dan <strong className="text-cyan-300">1 sisi lengkung</strong> di bagian atas.</p>
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2 text-xs">
          <p className="text-yellow-300 font-semibold">✅ r = 21 cm · d alas = 42 cm · Sisi datar = 1 lingkaran</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>Perhatikan gambar bola berikut.</p>
        <svg viewBox="0 0 240 200" className="w-56 h-48 mx-auto block">
          <defs>
            <radialGradient id="uq3grad" cx="38%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#6ee7b7"/>
              <stop offset="100%" stopColor="#065f46"/>
            </radialGradient>
          </defs>
          <circle cx="120" cy="100" r="72" fill="url(#uq3grad)" stroke="#34d399" strokeWidth="1.5"/>
          <ellipse cx="120" cy="100" rx="72" ry="18" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.6"/>
          <line x1="48" y1="100" x2="192" y2="100" stroke="#f97316" strokeWidth="2"/>
          <line x1="120" y1="100" x2="120" y2="28" stroke="#c084fc" strokeWidth="2"/>
          <line x1="120" y1="100" x2="176" y2="143" stroke="#60a5fa" strokeWidth="2"/>
          <circle cx="120" cy="100" r="4" fill="white"/>
          <circle cx="48" cy="100" r="4" fill="#f97316"/>
          <circle cx="192" cy="100" r="4" fill="#f97316"/>
          <circle cx="120" cy="28" r="4" fill="#c084fc"/>
          <circle cx="176" cy="143" r="4" fill="#60a5fa"/>
          <text x="95" y="115" fill="white" fontSize="11" fontWeight="bold">O</text>
          <text x="20" y="97" fill="#f97316" fontSize="10">A</text>
          <text x="194" y="97" fill="#f97316" fontSize="10">B</text>
          <text x="123" y="26" fill="#c084fc" fontSize="10">C</text>
          <text x="179" y="156" fill="#60a5fa" fontSize="10">D</text>
          <text x="78" y="90" fill="#f97316" fontSize="10" fontStyle="italic">50 cm</text>
        </svg>
        <p>Garis <strong className="text-orange-300">AB</strong> melewati pusat O dengan panjang <strong className="text-yellow-300">50 cm</strong>. Garis <strong className="text-purple-300">OC</strong> dan garis <strong className="text-blue-300">OD</strong> memiliki arah yang berbeda, masing-masing dari pusat ke permukaan bola.</p>
        <p>Tentukan:</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          <li>a) Nama unsur bola yang diwakili garis AB</li>
          <li>b) Nama unsur bola yang diwakili garis OC dan OD</li>
          <li>c) Panjang OC dan OD</li>
          <li>d) Apakah OC = OD? Jelaskan!</li>
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">(a) Garis AB:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/80">Garis AB menghubungkan dua titik di permukaan bola dan <strong className="text-yellow-300">melewati pusat O</strong>.</p>
          <p className="text-cyan-300 mt-1">→ Garis AB adalah <strong>Diameter (d)</strong> bola.</p>
        </div>
        <p className="text-red-400 font-semibold">(b) Garis OC dan OD:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/80">Garis OC dan OD menghubungkan <strong className="text-yellow-300">pusat O ke titik di permukaan bola</strong>.</p>
          <p className="text-cyan-300 mt-1">→ Garis OC dan OD adalah <strong>Jari-jari (r)</strong> bola.</p>
        </div>
        <p className="text-red-400 font-semibold">(c) Panjang OC dan OD:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{50}{2} = 25 \text{ cm}" />
          <p className="text-cyan-300">OC = OD = <strong>25 cm</strong></p>
        </div>
        <p className="text-red-400 font-semibold">(d) Apakah OC = OD?</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/80"><strong className="text-green-300">Ya, OC = OD</strong> meskipun arahnya berbeda.</p>
          <p className="text-white/70 mt-1">Karena <strong className="text-yellow-300">semua jari-jari bola panjangnya sama</strong> — itulah sifat utama bola: setiap titik di permukaannya berjarak sama (= r) dari pusat O.</p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• AB = Diameter = <strong className="text-yellow-300">50 cm</strong></p>
          <p className="text-white/80">• OC, OD = Jari-jari = <strong className="text-yellow-300">25 cm</strong></p>
          <p className="text-white/80">• OC = OD karena semua jari-jari bola <strong className="text-cyan-300">selalu sama panjang</strong></p>
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
        <p>Sebuah bola basket memiliki jari-jari <InlineMath math="12 \text{ cm}" />.</p>
        <p>Hitung luas permukaan bola tersebut! (Gunakan <InlineMath math="\pi = 3{,}14" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = 4\pi r^2 = 4 \times 3{,}14 \times 12^2 = 4 \times 3{,}14 \times 144 = 1.808{,}64 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Luas permukaan = <InlineMath math="1.808{,}64 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Luas permukaan sebuah bola adalah <InlineMath math="1.386 \text{ cm}^2" />.</p>
        <p>Tentukan: (a) jari-jari bola, (b) diameter, (c) volume bola. (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Jari-jari:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="4\pi r^2 = 1.386 \Rightarrow 4 \times \frac{22}{7} \times r^2 = 1.386" />
          <BlockMath math="r^2 = \frac{1.386 \times 7}{4 \times 22} = \frac{9.702}{88} = 110{,}25 \Rightarrow r = 10{,}5 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Diameter:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="d = 2r = 2 \times 10{,}5 = 21 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(c) Volume:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="V = \frac{4}{3}\pi r^3 = \frac{4}{3} \times \frac{22}{7} \times (10{,}5)^3" />
          <BlockMath math="= \frac{4}{3} \times \frac{22}{7} \times 1.157{,}625 = \frac{4 \times 22 \times 1.157{,}625}{21} = \frac{101.871}{21} = 4.851 \text{ cm}^3" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2 text-xs">
          <p className="text-yellow-300 font-semibold">✅ r = 10,5 cm, d = 21 cm, V = 4.851 cm³</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>Sebuah kubah masjid berbentuk <strong className="text-yellow-300">setengah bola</strong> dengan diameter <strong className="text-yellow-300">14 m</strong>. Seluruh permukaan luar kubah (sisi lengkung saja) akan dicat.</p>
        <svg viewBox="0 0 240 180" className="w-56 h-44 mx-auto block">
          <defs>
            <radialGradient id="domeGrad" cx="40%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fde68a"/>
              <stop offset="100%" stopColor="#92400e"/>
            </radialGradient>
            <clipPath id="domeClip">
              <rect x="0" y="0" width="240" height="105"/>
            </clipPath>
          </defs>
          <rect x="20" y="105" width="200" height="55" rx="3" fill="#334155" stroke="#475569" strokeWidth="1"/>
          <rect x="55" y="75" width="130" height="32" rx="2" fill="#475569" stroke="#64748b" strokeWidth="1"/>
          <circle cx="120" cy="105" r="72" fill="url(#domeGrad)" stroke="#fbbf24" strokeWidth="1.5" clipPath="url(#domeClip)"/>
          <ellipse cx="120" cy="105" rx="72" ry="14" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2"/>
          <line x1="48" y1="105" x2="192" y2="105" stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 3"/>
          <text x="88" y="100" fill="#f97316" fontSize="11" fontWeight="bold">d = 14 m</text>
          <line x1="120" y1="105" x2="120" y2="33" stroke="#c084fc" strokeWidth="1.5"/>
          <text x="123" y="72" fill="#c084fc" fontSize="10">r = 7 m</text>
          <circle cx="120" cy="105" r="3" fill="#f97316"/>
          <rect x="30" y="115" width="30" height="43" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
          <rect x="180" y="115" width="30" height="43" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
          <rect x="100" y="120" width="40" height="38" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1"/>
        </svg>
        <div className="bg-slate-800/50 border border-slate-600/40 rounded-lg p-3 text-xs space-y-1 text-white/70">
          <p>📋 <strong className="text-white/90">Informasi:</strong></p>
          <p>• 1 kaleng cat dapat mengecat <strong className="text-cyan-300">4 m²</strong></p>
          <p>• Harga 1 kaleng cat = <strong className="text-yellow-300">Rp 250.000</strong></p>
        </div>
        <p>Tentukan:</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          <li>a) Luas permukaan luar kubah yang dicat</li>
          <li>b) Jumlah kaleng cat yang dibutuhkan</li>
          <li>c) Total biaya pengecatan</li>
        </ul>
        <p className="text-xs text-white/50">(Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Tentukan jari-jari:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{14}{2} = 7 \text{ m}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Luas sisi lengkung setengah bola (bagian yang dicat):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p className="text-white/70">Hanya sisi lengkung, bukan alas (kubah menempel ke bangunan):</p>
          <BlockMath math="L_{\text{lengkung}} = 2\pi r^2 = 2 \times \frac{22}{7} \times 7^2" />
          <BlockMath math="= 2 \times \frac{22}{7} \times 49 = 2 \times 22 \times 7 = 308 \text{ m}^2" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Jumlah kaleng cat:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="\text{Kaleng} = \frac{L}{4} = \frac{308}{4} = 77 \text{ kaleng}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 4 — Total biaya:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="\text{Biaya} = 77 \times 250.000 = Rp\,19.250.000" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas kubah yang dicat = <strong className="text-yellow-300">308 m²</strong></p>
          <p className="text-white/80">• Jumlah kaleng = <strong className="text-yellow-300">77 kaleng</strong></p>
          <p className="text-white/80">• Total biaya = <strong className="text-yellow-300">Rp 19.250.000</strong></p>
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
        <p>Sebuah bola plastik memiliki diameter <InlineMath math="21 \text{ cm}" />.</p>
        <p>Hitung volume bola tersebut! (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <p className="text-white/70 text-xs"><InlineMath math="r = \frac{21}{2} = 10{,}5 \text{ cm}" /></p>
          <BlockMath math="V = \frac{4}{3}\pi r^3 = \frac{4}{3} \times \frac{22}{7} \times (10{,}5)^3" />
          <BlockMath math="= \frac{4}{3} \times \frac{22}{7} \times 1.157{,}625 = 4.851 \text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume = <InlineMath math="4.851 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Volume sebuah bola adalah <InlineMath math="38.808 \text{ cm}^3" />.</p>
        <p>Tentukan: (a) jari-jari bola, (b) luas permukaan bola. (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Jari-jari dari volume:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="\frac{4}{3}\pi r^3 = 38.808" />
          <BlockMath math="\frac{4}{3} \times \frac{22}{7} \times r^3 = 38.808" />
          <BlockMath math="\frac{88}{21} \times r^3 = 38.808 \Rightarrow r^3 = \frac{38.808 \times 21}{88} = \frac{814.968}{88} = 9.261" />
          <BlockMath math="r = \sqrt[3]{9.261} = 21 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Luas permukaan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L = 4\pi r^2 = 4 \times \frac{22}{7} \times 21^2 = 4 \times \frac{22}{7} \times 441 = 4 \times 22 \times 63 = 5.544 \text{ cm}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ r = 21 cm, L = 5.544 cm²</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah akuarium berbentuk tabung berdiameter <InlineMath math="42 \text{ cm}" /> dan tinggi <InlineMath math="60 \text{ cm}" /> diisi penuh air.</p>
        <p>Kemudian dimasukkan sebuah bola padat berdiameter <InlineMath math="21 \text{ cm}" /> ke dalamnya.</p>
        <p>Berapa cm air yang tumpah dari akuarium? (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Volume bola:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r_{\text{bola}} = \frac{21}{2} = 10{,}5 \text{ cm}" />
          <BlockMath math="V_{\text{bola}} = \frac{4}{3} \times \frac{22}{7} \times (10{,}5)^3 = \frac{4}{3} \times \frac{22}{7} \times 1.157{,}625 = 4.851 \text{ cm}^3" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Volume tabung akuarium:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r_{\text{tab}} = 21 \text{ cm}, \quad V_{\text{tab}} = \pi r^2 t = \frac{22}{7} \times 441 \times 60 = 83.160 \text{ cm}^3" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Air yang tumpah = Volume bola (akuarium penuh):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="V_{\text{tumpah}} = V_{\text{bola}} = 4.851 \text{ cm}^3" />
          <p className="text-white/60 mt-1">Karena akuarium sudah penuh, air tumpah = seluruh volume bola yang masuk.</p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Volume bola = <strong className="text-yellow-300">4.851 cm³</strong></p>
          <p className="text-white/80">• Air yang tumpah = <strong className="text-yellow-300">4.851 cm³ = 4,851 liter</strong></p>
          <p className="text-cyan-300 mt-1">💡 Prinsip Archimedes: Volume benda yang dicelupkan = Volume air yang tumpah!</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */

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
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const BolaPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    {
      title: "Contoh Soal — Unsur-unsur Bola",
      icon: "🔎",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          <div className="flex flex-col gap-4">
            {unsurExamples.map((ex, i) => <ExampleCard key={`u${i}`} ex={ex} idx={i} prefix="UNSUR"/>)}
          </div>
        </div>
      ),
    },
    {
      title: "Contoh Soal — Luas Permukaan",
      icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          <div className="flex flex-col gap-4">
            {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix="LUAS"/>)}
          </div>
        </div>
      ),
    },
    {
      title: "Contoh Soal — Volume",
      icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          <div className="flex flex-col gap-4">
            {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix="VOLUME"/>)}
          </div>
        </div>
      ),
    },
  ];

  const total = slides.length;
  const slide = slides[currentSlide];

  const goPrev = () => { playPopSound(); setCurrentSlide(i => Math.max(0, i - 1)); };
  const goNext = () => { playPopSound(); setCurrentSlide(i => Math.min(total - 1, i + 1)); };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Circle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BOLA
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

        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-slate-800/40">
            <span className="text-2xl">{slide.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                Slide {currentSlide + 1} / {total}
              </p>
              <h2 className="font-display text-sm font-bold text-white">{slide.title}</h2>
            </div>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
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

export default BolaPage;
