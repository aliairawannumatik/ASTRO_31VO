import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Circle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D SPHERE — CSS gradient + SVG latitude/longitude
───────────────────────────────────────────────────────────── */
const SPHERE_R = 90;
const SVG_W = 300;
const SVG_H = 300;

const sphere3DTrans = {
  id: {
    instructions: "Drag untuk memutar bola · Klik tombol untuk menampilkan/menyembunyikan label",
    showLabels: "🔵 Sembunyikan Label",
    hideLabels: "🔵 Tampilkan Label",
    reset: "↺ Reset Posisi",
    equator: "Khatulistiwa",
    latLon: "Lintang/Bujur",
    radius: "Jari-jari (r)",
  },
  en: {
    instructions: "Drag to rotate the sphere · Click the button to show/hide labels",
    showLabels: "🔵 Hide Labels",
    hideLabels: "🔵 Show Labels",
    reset: "↺ Reset Position",
    equator: "Equator",
    latLon: "Latitude/Longitude",
    radius: "Radius (r)",
  },
  ja: {
    instructions: "ドラッグして球を回転 · ボタンをクリックしてラベルの表示/非表示を切り替え",
    showLabels: "🔵 ラベルを隠す",
    hideLabels: "🔵 ラベルを表示",
    reset: "↺ 位置をリセット",
    equator: "赤道",
    latLon: "緯度/経度",
    radius: "半径（r）",
  },
} as const;

const InteractiveSphere3D = ({ language }: { language: Language }) => {
  const t = sphere3DTrans[language];
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
    e.preventDefault();
    setSpinY(dragRef.current.base + (e.touches[0].clientX - dragRef.current.sx) * 0.8);
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
        {t.instructions}
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
          {showLabels ? t.showLabels : t.hideLabels}
        </button>
        <button
          onClick={() => { playPopSound(); setSpinY(0); }}
          className="px-3 py-1.5 text-xs font-bold bg-slate-800/60 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer font-body"
        >
          {t.reset}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center text-[10px] font-body">
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-yellow-400"/><span className="text-white/50">{t.equator}</span></span>
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-white opacity-40"/><span className="text-white/50">{t.latLon}</span></span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block bg-orange-400"/><span className="text-white/50">{t.radius}</span></span>
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

const halfSphere3DTrans = {
  id: {
    instructions: "Drag untuk memutar setengah bola",
    title: "Setengah Bola (Hemisphere)",
    curved: "Sisi lengkung = 2πr²",
    base: "Alas lingkaran = πr²",
  },
  en: {
    instructions: "Drag to rotate the hemisphere",
    title: "Hemisphere (Half of a Sphere)",
    curved: "Curved surface = 2πr²",
    base: "Circular base = πr²",
  },
  ja: {
    instructions: "ドラッグして半球を回転",
    title: "半球（球の半分）",
    curved: "曲面 = 2πr²",
    base: "円形の底面 = πr²",
  },
} as const;

const InteractiveHalfSphere3D = ({ language }: { language: Language }) => {
  const t = halfSphere3DTrans[language];
  const [spinY, setSpinY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ sx: 0, base: 0 });

  const onMD = (e: React.MouseEvent) => { setIsDragging(true); dragRef.current = { sx: e.clientX, base: spinY }; };
  const onMM = useCallback((e: MouseEvent) => { if (!isDragging) return; setSpinY(dragRef.current.base + (e.clientX - dragRef.current.sx) * 0.8); }, [isDragging]);
  const onMU = useCallback(() => setIsDragging(false), []);
  const onTS = (e: React.TouchEvent) => { const t = e.touches[0]; setIsDragging(true); dragRef.current = { sx: t.clientX, base: spinY }; };
  const onTM = useCallback((e: TouchEvent) => { if (!isDragging) return; e.preventDefault(); setSpinY(dragRef.current.base + (e.touches[0].clientX - dragRef.current.sx) * 0.8); }, [isDragging]);
  const onTE = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMM); window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onTM, { passive: false }); window.addEventListener("touchend", onTE);
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
      <p className="text-white/60 text-xs text-center font-body">{t.instructions}</p>
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
        <text x="10" y="20" fill="#7dd3fc" fontSize="9" fontFamily="monospace">{t.title}</text>
        <text x="10" y="34" fill="#c4b5fd" fontSize="9" fontFamily="monospace">{t.curved}</text>
        <text x="10" y="48" fill="#4ade80" fontSize="9" fontFamily="monospace">{t.base}</text>
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

const SphereFruitCutAnimation = ({ language }: { language: Language }) => {
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
                {language === "id" ? "Bola 3D — tekan tombol untuk memotong" : language === "en" ? "3D Sphere — press the button to cut" : "3D球体 — ボタンを押して切断"}
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
          {language === "id" ? "🍊 Potong Bola 3D → 4 Lingkaran" : language === "en" ? "🍊 Cut 3D Sphere → 4 Circles" : "🍊 3D球を切る → 4つの円"}
        </button>
        <button onClick={doReset}
          style={{ padding:"6px 18px", borderRadius:8, border:"1px solid #475569",
            background:"transparent", color:"#94a3b8", fontSize:12, fontWeight:"bold",
            cursor:"pointer", fontFamily:"inherit" }}>
          {language === "id" ? "↺ Reset" : language === "en" ? "↺ Reset" : "↺ リセット"}
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
const WaterBolaAnimation = ({ language }: { language: Language }) => {
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
      aria-label={language === "id" ? "Animasi bola diisi air" : language === "en" ? "Animation of a sphere filling with water" : "球体に水が満たされるアニメーション"}>
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
        {isFull
          ? (language === "id" ? "🌊 Penuh!" : language === "en" ? "🌊 Full!" : "🌊 満水！")
          : isEmpty
          ? (language === "id" ? "⬛ Kosong" : language === "en" ? "⬛ Empty" : "⬛ 空")
          : (language === "id" ? `🔵 Mengisi... ${pct}%` : language === "en" ? `🔵 Filling... ${pct}%` : `🔵 注入中... ${pct}%`)}
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

/* ── Page-level translations (title / subtitle) ────────── */
const pageTrans = {
  id: { title: "BOLA", subtitle: "Kelas 9 · Bangun Ruang Sisi Lengkung" },
  en: { title: "SPHERE", subtitle: "Grade 9 · Curved-Surface Solids" },
  ja: { title: "球", subtitle: "中学3年・曲面図形" },
} as const;

/* ── Slide 1 translations (Definisi Bola / Definition of a Sphere) ── */
const slide1Trans = {
  id: {
    title: "Definisi Bola",
    intro: (
      <>
        <strong className="text-cyan-300">Bola</strong> adalah bangun ruang sisi lengkung yang terbentuk dari{" "}
        <strong className="text-yellow-300">sekumpulan titik yang semuanya berjarak sama</strong> terhadap satu titik pusat.
        Jarak itu disebut <strong className="text-yellow-300">jari-jari (r)</strong>.
        Bola adalah bentuk paling sempurna di alam — dari buah jeruk, gelembung sabun, hingga planet-planet di antariksa!
      </>
    ),
    sifatTitle: "📌 Sifat-sifat Bola:",
    sifat1: (<>Memiliki <strong className="text-yellow-300">1 sisi lengkung</strong> (permukaan) dan <strong className="text-yellow-300">tidak memiliki rusuk maupun titik sudut</strong></>),
    sifat2: (<>Setiap titik pada permukaan berjarak <strong className="text-yellow-300">sama</strong> terhadap pusat (<InlineMath math="= r" />)</>),
    sifat3: (<>Bola adalah <strong className="text-yellow-300">bangun simetri sempurna</strong> — tampak sama dari semua arah</>),
    sifat4: (<>Diameter bola <InlineMath math="d = 2r" /></>),
    galleryTitle: "Benda Berbentuk Bola di Kehidupan Sehari-hari",
    gallery: [
      { src: "/images/image_1780702385381.png", label: "Bola Sepak" },
      { src: "/images/image_1780702495642.png", label: "Bola Dunia" },
      { src: "/images/image_1780702529187.png", label: "Semangka" },
      { src: "/images/image_1780702647131.png", label: "Buah Jeruk" },
      { src: "/images/image_1780702682181.png", label: "Kelereng" },
      { src: "/images/image_1780702856357.png", label: "Bola Bowling" },
    ],
  },
  en: {
    title: "Definition of a Sphere",
    intro: (
      <>
        A <strong className="text-cyan-300">Sphere</strong> is a curved-surface solid formed by a{" "}
        <strong className="text-yellow-300">set of points that are all equidistant</strong> from a single center point.
        That distance is called the <strong className="text-yellow-300">radius (r)</strong>.
        A sphere is the most perfect shape in nature — from an orange, a soap bubble, to planets in space!
      </>
    ),
    sifatTitle: "📌 Properties of a Sphere:",
    sifat1: (<>Has <strong className="text-yellow-300">1 curved side</strong> (surface) and <strong className="text-yellow-300">no edges or vertices at all</strong></>),
    sifat2: (<>Every point on the surface is <strong className="text-yellow-300">equidistant</strong> from the center (<InlineMath math="= r" />)</>),
    sifat3: (<>A sphere is a <strong className="text-yellow-300">perfectly symmetrical shape</strong> — it looks the same from every direction</>),
    sifat4: (<>Diameter of a sphere <InlineMath math="d = 2r" /></>),
    galleryTitle: "Everyday Objects Shaped Like a Sphere",
    gallery: [
      { src: "/images/image_1780702385381.png", label: "Soccer Ball" },
      { src: "/images/image_1780702495642.png", label: "Globe" },
      { src: "/images/image_1780702529187.png", label: "Watermelon" },
      { src: "/images/image_1780702647131.png", label: "Orange" },
      { src: "/images/image_1780702682181.png", label: "Marble" },
      { src: "/images/image_1780702856357.png", label: "Bowling Ball" },
    ],
  },
  ja: {
    title: "球の定義",
    intro: (
      <>
        <strong className="text-cyan-300">球</strong>は、1つの中心点から
        <strong className="text-yellow-300">すべて等しい距離にある点の集合</strong>によって形成される曲面立体です。
        その距離を<strong className="text-yellow-300">半径（r）</strong>と呼びます。
        球は自然界で最も完璧な形です——オレンジ、シャボン玉から、宇宙の惑星まで！
      </>
    ),
    sifatTitle: "📌 球の性質：",
    sifat1: (<><strong className="text-yellow-300">1つの曲面</strong>（表面）を持ち、<strong className="text-yellow-300">辺も頂点もまったくない</strong></>),
    sifat2: (<>表面上のすべての点は中心から<strong className="text-yellow-300">等距離</strong>（<InlineMath math="= r" />）</>),
    sifat3: (<>球は<strong className="text-yellow-300">完全に対称な図形</strong>——どの方向から見ても同じに見える</>),
    sifat4: (<>球の直径 <InlineMath math="d = 2r" /></>),
    galleryTitle: "日常生活にある球形の物体",
    gallery: [
      { src: "/images/image_1780702385381.png", label: "サッカーボール" },
      { src: "/images/image_1780702495642.png", label: "地球儀" },
      { src: "/images/image_1780702529187.png", label: "スイカ" },
      { src: "/images/image_1780702647131.png", label: "オレンジ" },
      { src: "/images/image_1780702682181.png", label: "ビー玉" },
      { src: "/images/image_1780702856357.png", label: "ボウリングの球" },
    ],
  },
} as const;

/* ── Slide 2 translations (Unsur-unsur Bola / Elements of a Sphere) ── */
const slide2Trans = {
  id: {
    title: "Unsur-unsur Bola (Interaktif)",
    el1Title: "① Titik Pusat (O)",
    el1Desc: (<>Titik di tengah bola. Setiap titik pada permukaan bola berjarak <strong>r</strong> dari pusat ini.</>),
    el2Title: (<>② Jari-jari (<InlineMath math="r" />)</>),
    el2Desc: "Jarak dari pusat bola ke titik mana saja di permukaan bola. Semua jari-jari panjangnya sama.",
    el3Title: (<>③ Diameter (<InlineMath math="d" />)</>),
    el3Desc: (<>Tali busur terpanjang yang melewati pusat bola. Sama dengan dua kali jari-jari: <InlineMath math="d = 2r" />.</>),
    el4Title: "④ Permukaan Bola",
    el4Desc: "Satu-satunya sisi bola, seluruhnya berupa bidang lengkung. Tidak ada sisi datar, rusuk, maupun sudut.",
    el5Title: "⑤ Setengah Bola (Belahan Bola)",
    el5Desc: "Jika bola dipotong melalui pusat, terbentuk dua belahan bola (hemisphere), masing-masing memiliki:",
    el5Bullet1: "Sisi datar berupa lingkaran (jari-jari = r)",
    el5Bullet2: (<>Sisi lengkung = ½ permukaan bola = <InlineMath math="2\pi r^2" /></>),
    summaryTitle: "📋 Kesimpulan Unsur-unsur Bola",
    sisiLabel: "Sisi", sisiNote: "(sisi lengkung)",
    rusukLabel: "Rusuk", rusukNote: "(tidak ada)",
    vertexLabel: "Titik Sudut", vertexNote: "(tidak ada)",
    summaryClosing: (<>Bola adalah satu-satunya bangun ruang yang hanya memiliki <strong className="text-cyan-300">1 sisi</strong> tanpa rusuk maupun titik sudut sama sekali.</>),
    tableHeaders: ["Unsur", "Simbol", "Keterangan"] as [string, string, string],
    tableRows: [
      ["Titik pusat", "O", "pusat bola"],
      ["Jari-jari", "r", "pusat → permukaan"],
      ["Diameter", "d = 2r", "melewati pusat"],
      ["Permukaan", "—", "sisi lengkung tunggal"],
      ["Rusuk", "0", "tidak ada!"],
      ["Titik sudut", "0", "tidak ada!"],
    ] as [string, string, string][],
  },
  en: {
    title: "Elements of a Sphere (Interactive)",
    el1Title: "① Center Point (O)",
    el1Desc: (<>The point at the center of the sphere. Every point on the sphere's surface is <strong>r</strong> away from this center.</>),
    el2Title: (<>② Radius (<InlineMath math="r" />)</>),
    el2Desc: "The distance from the center of the sphere to any point on its surface. All radii have the same length.",
    el3Title: (<>③ Diameter (<InlineMath math="d" />)</>),
    el3Desc: (<>The longest chord passing through the center of the sphere. Equal to twice the radius: <InlineMath math="d = 2r" />.</>),
    el4Title: "④ Surface of the Sphere",
    el4Desc: "The sphere's only side, entirely a curved surface. There are no flat faces, edges, or vertices.",
    el5Title: "⑤ Hemisphere (Half of a Sphere)",
    el5Desc: "If a sphere is cut through its center, two hemispheres are formed, each having:",
    el5Bullet1: "A flat circular face (radius = r)",
    el5Bullet2: (<>Curved surface = ½ the sphere's surface = <InlineMath math="2\pi r^2" /></>),
    summaryTitle: "📋 Summary of the Elements of a Sphere",
    sisiLabel: "Face", sisiNote: "(curved surface)",
    rusukLabel: "Edges", rusukNote: "(none)",
    vertexLabel: "Vertices", vertexNote: "(none)",
    summaryClosing: (<>A sphere is the only 3D shape that has only <strong className="text-cyan-300">1 face</strong> with no edges or vertices at all.</>),
    tableHeaders: ["Element", "Symbol", "Description"] as [string, string, string],
    tableRows: [
      ["Center point", "O", "center of the sphere"],
      ["Radius", "r", "center → surface"],
      ["Diameter", "d = 2r", "through the center"],
      ["Surface", "—", "single curved side"],
      ["Edges", "0", "none!"],
      ["Vertices", "0", "none!"],
    ] as [string, string, string][],
  },
  ja: {
    title: "球の構成要素（インタラクティブ）",
    el1Title: "① 中心点（O）",
    el1Desc: (<>球の中心にある点。球の表面上のすべての点はこの中心から<strong>r</strong>の距離にあります。</>),
    el2Title: (<>② 半径（<InlineMath math="r" />）</>),
    el2Desc: "球の中心から表面上の任意の点までの距離。すべての半径の長さは等しい。",
    el3Title: (<>③ 直径（<InlineMath math="d" />）</>),
    el3Desc: (<>球の中心を通る最も長い弦。半径の2倍に等しい：<InlineMath math="d = 2r" />。</>),
    el4Title: "④ 球の表面",
    el4Desc: "球の唯一の面で、すべてが曲面です。平らな面、辺、頂点はありません。",
    el5Title: "⑤ 半球（球の半分）",
    el5Desc: "球を中心を通るように切ると、2つの半球ができ、それぞれ次のものを持ちます：",
    el5Bullet1: "平らな円形の面（半径 = r）",
    el5Bullet2: (<>曲面 = 球の表面積の½ = <InlineMath math="2\pi r^2" /></>),
    summaryTitle: "📋 球の構成要素のまとめ",
    sisiLabel: "面", sisiNote: "（曲面）",
    rusukLabel: "辺", rusukNote: "（なし）",
    vertexLabel: "頂点", vertexNote: "（なし）",
    summaryClosing: (<>球は辺も頂点もまったく持たず、<strong className="text-cyan-300">1つの面</strong>だけを持つ唯一の立体図形です。</>),
    tableHeaders: ["構成要素", "記号", "説明"] as [string, string, string],
    tableRows: [
      ["中心点", "O", "球の中心"],
      ["半径", "r", "中心→表面"],
      ["直径", "d = 2r", "中心を通る"],
      ["表面", "—", "単一の曲面"],
      ["辺", "0", "なし！"],
      ["頂点", "0", "なし！"],
    ] as [string, string, string][],
  },
} as const;

/* ── Slide 3 translations (Luas Permukaan Bola / Surface Area of a Sphere) ── */
const slide3Trans = {
  id: {
    title: "Luas Permukaan Bola",
    intro: (
      <>
        <strong className="text-orange-300">Luas permukaan bola</strong> adalah total luas bidang lengkung yang membungkus bola.
        Fakta mengagumkan: luas permukaan bola tepat sama dengan luas{" "}
        <strong className="text-yellow-300">4 lingkaran</strong> dengan jari-jari yang sama!
      </>
    ),
    derivationTitle: "📌 Penurunan Rumus:",
    derivation1: (<>Luas permukaan bola = 4 × luas lingkaran = <InlineMath math="4 \times \pi r^2" /></>),
    note: (<>Di mana <InlineMath math="r" /> adalah jari-jari bola.</>),
    hemisphereBoxTitle: (<><strong className="text-white">Belahan bola:</strong></>),
    hemisphereBullet1: (<>Luas lengkung setengah bola = <InlineMath math="2\pi r^2" /> (setengah dari <InlineMath math="4\pi r^2" />)</>),
    hemisphereBullet2: (<>Luas total setengah bola (termasuk alas) = <InlineMath math="2\pi r^2 + \pi r^2 = 3\pi r^2" /></>),
    trick: (<><strong>Trik mengingat:</strong> Luas bola = 4 × luas "lingkaran penampangnya". Mudah!</>),
  },
  en: {
    title: "Surface Area of a Sphere",
    intro: (
      <>
        The <strong className="text-orange-300">surface area of a sphere</strong> is the total area of the curved surface wrapping around it.
        Amazing fact: a sphere's surface area is exactly equal to the area of{" "}
        <strong className="text-yellow-300">4 circles</strong> with the same radius!
      </>
    ),
    derivationTitle: "📌 Deriving the Formula:",
    derivation1: (<>Surface area of a sphere = 4 × area of a circle = <InlineMath math="4 \times \pi r^2" /></>),
    note: (<>Where <InlineMath math="r" /> is the radius of the sphere.</>),
    hemisphereBoxTitle: (<><strong className="text-white">Hemisphere:</strong></>),
    hemisphereBullet1: (<>Curved surface area of a hemisphere = <InlineMath math="2\pi r^2" /> (half of <InlineMath math="4\pi r^2" />)</>),
    hemisphereBullet2: (<>Total surface area of a hemisphere (including the base) = <InlineMath math="2\pi r^2 + \pi r^2 = 3\pi r^2" /></>),
    trick: (<><strong>Memory trick:</strong> Sphere surface area = 4 × area of its "cross-section circle". Easy!</>),
  },
  ja: {
    title: "球の表面積",
    intro: (
      <>
        <strong className="text-orange-300">球の表面積</strong>は、球を包む曲面の総面積です。
        驚くべき事実：球の表面積は、同じ半径を持つ<strong className="text-yellow-300">円4つ</strong>の面積とちょうど等しい！
      </>
    ),
    derivationTitle: "📌 公式の導出：",
    derivation1: (<>球の表面積 = 4 × 円の面積 = <InlineMath math="4 \times \pi r^2" /></>),
    note: (<><InlineMath math="r" /> は球の半径です。</>),
    hemisphereBoxTitle: (<><strong className="text-white">半球：</strong></>),
    hemisphereBullet1: (<>半球の曲面の面積 = <InlineMath math="2\pi r^2" />（<InlineMath math="4\pi r^2" />の半分）</>),
    hemisphereBullet2: (<>半球の全表面積（底面を含む） = <InlineMath math="2\pi r^2 + \pi r^2 = 3\pi r^2" /></>),
    trick: (<><strong>覚え方のコツ：</strong>球の表面積 = 4 ×「切断面の円」の面積。簡単！</>),
  },
} as const;

/* ── Slide 4 translations (Volume Bola / Volume of a Sphere) ── */
const slide4Trans = {
  id: {
    title: "Volume Bola",
    intro: (
      <>
        <strong className="text-blue-300">Volume bola</strong> menyatakan besarnya ruang yang ditempati oleh bola.
        Rumus volume bola pertama kali ditemukan oleh <strong className="text-yellow-300">Archimedes</strong> dari Yunani kuno!
      </>
    ),
    waterAnimTitle: "💧 Animasi Pengisian Air — Bola",
    waterAnimCaption: (<>Bayangkan bola transparan diisi air dari bawah — volumenya adalah <strong className="text-violet-300">⁴⁄₃πr³</strong></>),
    derivationTitle: "📌 Penurunan Rumus:",
    derivationP1: "Bayangkan bola dipecah menjadi banyak kerucut kecil dengan puncak di pusat bola dan alas di permukaan bola:",
    derivationBullet1: (<>Setiap kerucut kecil: <InlineMath math="V = \frac{1}{3} \times \Delta L \times r" /></>),
    derivationBullet2: (<>Jumlah semua kerucut = <InlineMath math="\frac{1}{3} \times L_b \times r = \frac{1}{3} \times 4\pi r^2 \times r" /></>),
    archimedesTitle: "🚀 Hubungan dengan Tabung:",
    archimedesP1: "Bola yang masuk pas dalam tabung (r & t = 2r sama):",
    archimedesP2: "(Rumus Archimedes yang terkenal!)",
  },
  en: {
    title: "Volume of a Sphere",
    intro: (
      <>
        The <strong className="text-blue-300">volume of a sphere</strong> represents the amount of space it occupies.
        The formula for the volume of a sphere was first discovered by <strong className="text-yellow-300">Archimedes</strong> of ancient Greece!
      </>
    ),
    waterAnimTitle: "💧 Water-Filling Animation — Sphere",
    waterAnimCaption: (<>Imagine a transparent sphere being filled with water from below — its volume is <strong className="text-violet-300">⁴⁄₃πr³</strong></>),
    derivationTitle: "📌 Deriving the Formula:",
    derivationP1: "Imagine the sphere is broken into many tiny cones, each with its apex at the sphere's center and its base on the sphere's surface:",
    derivationBullet1: (<>Each tiny cone: <InlineMath math="V = \frac{1}{3} \times \Delta L \times r" /></>),
    derivationBullet2: (<>Sum of all the cones = <InlineMath math="\frac{1}{3} \times L_b \times r = \frac{1}{3} \times 4\pi r^2 \times r" /></>),
    archimedesTitle: "🚀 Relationship with a Cylinder:",
    archimedesP1: "A sphere that fits exactly inside a cylinder (with r and t = 2r equal):",
    archimedesP2: "(Archimedes' famous formula!)",
  },
  ja: {
    title: "球の体積",
    intro: (
      <>
        <strong className="text-blue-300">球の体積</strong>は、球が占める空間の大きさを表します。
        球の体積の公式は、古代ギリシャの<strong className="text-yellow-300">アルキメデス</strong>によって最初に発見されました！
      </>
    ),
    waterAnimTitle: "💧 水入れアニメーション — 球",
    waterAnimCaption: (<>透明な球に下から水を入れると想像してみよう——その体積は <strong className="text-violet-300">⁴⁄₃πr³</strong></>),
    derivationTitle: "📌 公式の導出：",
    derivationP1: "球が、頂点を球の中心に、底面を球の表面に持つ小さな円錐にたくさん分割されると想像してみよう：",
    derivationBullet1: (<>それぞれの小さな円錐：<InlineMath math="V = \frac{1}{3} \times \Delta L \times r" /></>),
    derivationBullet2: (<>すべての円錐の合計 = <InlineMath math="\frac{1}{3} \times L_b \times r = \frac{1}{3} \times 4\pi r^2 \times r" /></>),
    archimedesTitle: "🚀 円柱との関係：",
    archimedesP1: "円柱にぴったり収まる球（r と t = 2r が等しい場合）：",
    archimedesP2: "（有名なアルキメデスの公式！）",
  },
} as const;

const slide5Trans = {
  id: {
    title: "Kesimpulan — Rumus Lengkap Bola",
    tableHead: { besaran: "Besaran", rumus: "Rumus", catatan: "Catatan" },
    rows: [
      ["Diameter", "d = 2r", "dua kali jari-jari"],
      ["Luas permukaan", "L = 4πr²", "4 lingkaran"],
      ["Luas ½ bola (lengkung)", "L = 2πr²", "setengah permukaan"],
      ["Luas ½ bola (total)", "L = 3πr²", "+ alas lingkaran"],
      ["Volume", "V = ⁴⁄₃πr³", "Archimedes"],
    ] as [string, string, string][],
    keyPointLabel: "Kunci utama bola:",
    keyPoint: (<>Semua rumus bergantung pada <strong className="text-yellow-300">satu variabel saja: r (jari-jari)</strong>!</>),
    remember: "Ingat dua rumus utama:",
    and: "dan",
  },
  en: {
    title: "Summary — Complete Sphere Formulas",
    tableHead: { besaran: "Quantity", rumus: "Formula", catatan: "Note" },
    rows: [
      ["Diameter", "d = 2r", "twice the radius"],
      ["Surface area", "L = 4πr²", "4 circles"],
      ["½ sphere surface area (curved)", "L = 2πr²", "half the surface"],
      ["½ sphere surface area (total)", "L = 3πr²", "+ circular base"],
      ["Volume", "V = ⁴⁄₃πr³", "Archimedes"],
    ] as [string, string, string][],
    keyPointLabel: "Key point about the sphere:",
    keyPoint: (<>All formulas depend on <strong className="text-yellow-300">just one variable: r (radius)</strong>!</>),
    remember: "Remember the two main formulas:",
    and: "and",
  },
  ja: {
    title: "まとめ — 球の公式全体",
    tableHead: { besaran: "量", rumus: "公式", catatan: "メモ" },
    rows: [
      ["直径", "d = 2r", "半径の2倍"],
      ["表面積", "L = 4πr²", "4つの円"],
      ["半球の表面積（曲面）", "L = 2πr²", "表面の半分"],
      ["半球の表面積（全体）", "L = 3πr²", "+円形の底面"],
      ["体積", "V = ⁴⁄₃πr³", "アルキメデス"],
    ] as [string, string, string][],
    keyPointLabel: "球の重要ポイント：",
    keyPoint: (<>すべての公式は<strong className="text-yellow-300">たった一つの変数 r（半径）</strong>だけで決まります！</>),
    remember: "重要な2つの公式を覚えましょう：",
    and: "、",
  },
} as const;

function getSections(language: Language): Sec[] {
  const s1 = slide1Trans[language];
  const s2 = slide2Trans[language];
  const s3 = slide3Trans[language];
  const s4 = slide4Trans[language];
  const s5 = slide5Trans[language];
  return [
  {
    title: s1.title,
    icon: "⚽",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{s1.intro}</p>
        <InteractiveSphere3D language={language} />
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">{s1.sifatTitle}</p>
          <ul className="space-y-1 text-xs text-white/75">
            <li>• {s1.sifat1}</li>
            <li>• {s1.sifat2}</li>
            <li>• {s1.sifat3}</li>
            <li>• {s1.sifat4}</li>
          </ul>
        </div>
        {/* ── Foto Benda Berbentuk Bola ── */}
        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-xl p-4 space-y-3">
          <p className="text-cyan-300 font-bold text-sm text-center">{s1.galleryTitle}</p>
          <div className="grid grid-cols-3 gap-2">
            {s1.gallery.map(({ src, label }) => (
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
        <InteractiveSphere3D language={language} />
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-orange-950/40 border border-orange-700/40 rounded-lg p-3 space-y-1">
            <p className="text-orange-300 font-semibold">{s2.el1Title}</p>
            <p className="text-xs text-white/70">{s2.el1Desc}</p>
          </div>
          <div className="bg-green-950/40 border border-green-700/40 rounded-lg p-3 space-y-1">
            <p className="text-green-300 font-semibold">{s2.el2Title}</p>
            <p className="text-xs text-white/70">{s2.el2Desc}</p>
          </div>
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-3 space-y-1">
            <p className="text-yellow-300 font-semibold">{s2.el3Title}</p>
            <p className="text-xs text-white/70">{s2.el3Desc}</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-3 space-y-1">
            <p className="text-cyan-300 font-semibold">{s2.el4Title}</p>
            <p className="text-xs text-white/70">{s2.el4Desc}</p>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-3 space-y-1">
            <p className="text-violet-300 font-semibold">{s2.el5Title}</p>
            <p className="text-xs text-white/70">{s2.el5Desc}</p>
            <ul className="text-xs text-white/60 mt-1 space-y-0.5">
              <li>• {s2.el5Bullet1}</li>
              <li>• {s2.el5Bullet2}</li>
            </ul>
          </div>
        </div>
        <InteractiveHalfSphere3D language={language} />
        <div className="bg-slate-800/60 border border-cyan-700/40 rounded-xl p-4 space-y-3">
          <p className="text-cyan-300 font-semibold text-sm">{s2.summaryTitle}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 space-y-1">
              <p className="text-3xl font-bold text-cyan-300">1</p>
              <p className="text-xs text-white/70 font-body">{s2.sisiLabel}</p>
              <p className="text-[10px] text-cyan-400/70 font-body">{s2.sisiNote}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-600/40 rounded-lg p-3 space-y-1">
              <p className="text-3xl font-bold text-white/40">0</p>
              <p className="text-xs text-white/70 font-body">{s2.rusukLabel}</p>
              <p className="text-[10px] text-white/30 font-body">{s2.rusukNote}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-600/40 rounded-lg p-3 space-y-1">
              <p className="text-3xl font-bold text-white/40">0</p>
              <p className="text-xs text-white/70 font-body">{s2.vertexLabel}</p>
              <p className="text-[10px] text-white/30 font-body">{s2.vertexNote}</p>
            </div>
          </div>
          <p className="text-xs text-white/55 font-body text-center">
            {s2.summaryClosing}
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s2.tableHeaders[0]}</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{s2.tableHeaders[1]}</th>
              <th className="px-3 py-2 text-cyan-300">{s2.tableHeaders[2]}</th>
            </tr></thead>
            <tbody>
              {s2.tableRows.map(([u,s,k],i)=>(
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
    icon: "🎨",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{s3.intro}</p>
        <SphereFruitCutAnimation language={language} />
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-3">
          <p className="text-orange-300 font-semibold">{s3.derivationTitle}</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>{s3.derivation1}</p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="\boxed{L = 4\pi r^2}" />
          </div>
          <p className="text-white/60 text-xs">{s3.note}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 {s3.hemisphereBoxTitle}</p>
          <p>• {s3.hemisphereBullet1}</p>
          <p>• {s3.hemisphereBullet2}</p>
        </div>
        <blockquote className="border-l-4 border-orange-500 pl-3 text-orange-200 text-xs italic">
          💡 {s3.trick}
        </blockquote>
      </div>
    ),
  },
  {
    title: s4.title,
    icon: "📦",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{s4.intro}</p>
        <div className="bg-slate-900/70 border border-violet-700/40 rounded-xl p-3">
          <p className="text-violet-300 font-semibold text-xs text-center mb-2 font-body">{s4.waterAnimTitle}</p>
          <WaterBolaAnimation language={language} />
          <p className="text-white/45 text-[10px] text-center font-body mt-1">{s4.waterAnimCaption}</p>
        </div>
        <div className="bg-blue-950/60 border border-blue-700/50 rounded-lg p-4 space-y-3">
          <p className="text-blue-300 font-semibold">{s4.derivationTitle}</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>{s4.derivationP1}</p>
            <p>• {s4.derivationBullet1}</p>
            <p>• {s4.derivationBullet2}</p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="V = \frac{1}{3} \times 4\pi r^2 \times r" />
            <BlockMath math="\boxed{V = \frac{4}{3}\pi r^3}" />
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs space-y-1">
          <p className="text-cyan-300 font-semibold">{s4.archimedesTitle}</p>
          <p className="text-white/70">{s4.archimedesP1}</p>
          <p className="text-white/70"><InlineMath math="V_b = \frac{2}{3} \times V_{tb}" /></p>
          <p className="text-white/70">{s4.archimedesP2}</p>
        </div>
      </div>
    ),
  },
  {
    title: s5.title,
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s5.tableHead.besaran}</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{s5.tableHead.rumus}</th>
              <th className="px-3 py-2 text-cyan-300">{s5.tableHead.catatan}</th>
            </tr></thead>
            <tbody>
              {s5.rows.map(([b,r,c],i)=>(
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
          <p>🚀 <strong>{s5.keyPointLabel}</strong> {s5.keyPoint}</p>
          <p>{s5.remember} <InlineMath math="L = 4\pi r^2" /> {s5.and} <InlineMath math="V = \frac{4}{3}\pi r^3" /></p>
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

function getUnsurExamples(language: Language): Ex[] {
  return [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        {language === "id" ? (
          <p>Perhatikan gambar bola berikut. Jari-jari bola adalah <strong className="text-yellow-300">10 cm</strong>.</p>
        ) : language === "en" ? (
          <p>Look at the sphere below. The sphere's radius is <strong className="text-yellow-300">10 cm</strong>.</p>
        ) : (
          <p>下の球を見てください。球の半径は<strong className="text-yellow-300">10 cm</strong>です。</p>
        )}
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
        <p>{language === "id" ? "Tentukan:" : language === "en" ? "Determine:" : "次を求めなさい："}</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          {language === "id" ? (
            <>
              <li>a) Panjang diameter bola</li>
              <li>b) Berapa jumlah sisi bola?</li>
              <li>c) Berapa jumlah rusuk bola?</li>
              <li>d) Berapa jumlah titik sudut bola?</li>
            </>
          ) : language === "en" ? (
            <>
              <li>a) The length of the sphere's diameter</li>
              <li>b) How many faces does the sphere have?</li>
              <li>c) How many edges does the sphere have?</li>
              <li>d) How many vertices does the sphere have?</li>
            </>
          ) : (
            <>
              <li>a) 球の直径の長さ</li>
              <li>b) 球の面はいくつありますか？</li>
              <li>c) 球の辺はいくつありますか？</li>
              <li>d) 球の頂点はいくつありますか？</li>
            </>
          )}
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-green-400 font-semibold">{language === "id" ? "(a) Diameter:" : language === "en" ? "(a) Diameter:" : "(a) 直径："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="d = 2r = 2 \times 10 = 20 \text{ cm}" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-green-950/50 border border-green-700/40 rounded p-2 space-y-1">
            <p className="text-green-300 font-bold text-base">1</p>
            <p className="text-white/70">{language === "id" ? "(b) Sisi" : language === "en" ? "(b) Faces" : "(b) 面"}</p>
            <p className="text-white/40 text-[10px]">{language === "id" ? "sisi lengkung" : language === "en" ? "curved face" : "曲面"}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-600/40 rounded p-2 space-y-1">
            <p className="text-white/40 font-bold text-base">0</p>
            <p className="text-white/70">{language === "id" ? "(c) Rusuk" : language === "en" ? "(c) Edges" : "(c) 辺"}</p>
            <p className="text-white/40 text-[10px]">{language === "id" ? "tidak ada" : language === "en" ? "none" : "なし"}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-600/40 rounded p-2 space-y-1">
            <p className="text-white/40 font-bold text-base">0</p>
            <p className="text-white/70">{language === "id" ? "(d) Titik Sudut" : language === "en" ? "(d) Vertices" : "(d) 頂点"}</p>
            <p className="text-white/40 text-[10px]">{language === "id" ? "tidak ada" : language === "en" ? "none" : "なし"}</p>
          </div>
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2 text-xs">
          <p className="text-green-300 font-semibold">
            {language === "id" ? "✅ d = 20 cm · Sisi = 1 · Rusuk = 0 · Titik Sudut = 0" : language === "en" ? "✅ d = 20 cm · Faces = 1 · Edges = 0 · Vertices = 0" : "✅ d = 20 cm · 面 = 1 · 辺 = 0 · 頂点 = 0"}
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
          <p>Sebuah bola berdiameter <strong className="text-yellow-300">42 cm</strong> dipotong tepat melalui titik pusatnya sehingga terbentuk dua belahan bola (hemisphere).</p>
        ) : language === "en" ? (
          <p>A sphere with a diameter of <strong className="text-yellow-300">42 cm</strong> is cut exactly through its center, forming two hemispheres.</p>
        ) : (
          <p>直径<strong className="text-yellow-300">42 cm</strong>の球を、中心を通るようにちょうど半分に切り、2つの半球を作ります。</p>
        )}
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
        <p>{language === "id" ? "Tentukan:" : language === "en" ? "Determine:" : "次を求めなさい："}</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          {language === "id" ? (
            <>
              <li>a) Jari-jari belahan bola</li>
              <li>b) Panjang garis tengah alas lingkaran belahan bola</li>
              <li>c) Berapa jumlah sisi datar yang dimiliki belahan bola?</li>
            </>
          ) : language === "en" ? (
            <>
              <li>a) The radius of the hemisphere</li>
              <li>b) The diameter of the hemisphere's circular base</li>
              <li>c) How many flat faces does the hemisphere have?</li>
            </>
          ) : (
            <>
              <li>a) 半球の半径</li>
              <li>b) 半球の底面である円の直径</li>
              <li>c) 半球には平らな面がいくつありますか？</li>
            </>
          )}
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(a) Jari-jari belahan bola:" : language === "en" ? "(a) Radius of the hemisphere:" : "(a) 半球の半径："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{42}{2} = 21 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(b) Garis tengah alas lingkaran:" : language === "en" ? "(b) Diameter of the circular base:" : "(b) 底面の円の直径："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/70">
            {language === "id" ? "Alas belahan bola berupa lingkaran dengan jari-jari = r bola." : language === "en" ? "The base of the hemisphere is a circle whose radius equals the sphere's radius." : "半球の底面は、球の半径と同じ半径を持つ円です。"}
          </p>
          <BlockMath math="d_a = 2r = 2 \times 21 = 42 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(c) Jumlah sisi datar:" : language === "en" ? "(c) Number of flat faces:" : "(c) 平らな面の数："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/70">
            {language === "id" ? (
              <>Belahan bola memiliki <strong className="text-cyan-300">1 sisi datar</strong> (berupa lingkaran di alasnya) dan <strong className="text-cyan-300">1 sisi lengkung</strong> di bagian atas.</>
            ) : language === "en" ? (
              <>The hemisphere has <strong className="text-cyan-300">1 flat face</strong> (the circle at its base) and <strong className="text-cyan-300">1 curved face</strong> on top.</>
            ) : (
              <>半球には、底面に<strong className="text-cyan-300">1つの平らな面</strong>（円）と、上部に<strong className="text-cyan-300">1つの曲面</strong>があります。</>
            )}
          </p>
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2 text-xs">
          <p className="text-yellow-300 font-semibold">
            {language === "id" ? "✅ r = 21 cm · d alas = 42 cm · Sisi datar = 1 lingkaran" : language === "en" ? "✅ r = 21 cm · Base diameter = 42 cm · Flat faces = 1 circle" : "✅ r = 21 cm · 底面の直径 = 42 cm · 平らな面 = 円1つ"}
          </p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-3">
        <p>{language === "id" ? "Perhatikan gambar bola berikut." : language === "en" ? "Look at the sphere below." : "下の球を見てください。"}</p>
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
        {language === "id" ? (
          <p>Garis <strong className="text-orange-300">AB</strong> melewati pusat O dengan panjang <strong className="text-yellow-300">50 cm</strong>. Garis <strong className="text-purple-300">OC</strong> dan garis <strong className="text-blue-300">OD</strong> memiliki arah yang berbeda, masing-masing dari pusat ke permukaan bola.</p>
        ) : language === "en" ? (
          <p>Line <strong className="text-orange-300">AB</strong> passes through center O with a length of <strong className="text-yellow-300">50 cm</strong>. Lines <strong className="text-purple-300">OC</strong> and <strong className="text-blue-300">OD</strong> point in different directions, each running from the center to the sphere's surface.</p>
        ) : (
          <p>線分<strong className="text-orange-300">AB</strong>は中心Oを通り、長さは<strong className="text-yellow-300">50 cm</strong>です。線分<strong className="text-purple-300">OC</strong>と<strong className="text-blue-300">OD</strong>はそれぞれ異なる方向を向いており、中心から球の表面までを結んでいます。</p>
        )}
        <p>{language === "id" ? "Tentukan:" : language === "en" ? "Determine:" : "次を求めなさい："}</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          {language === "id" ? (
            <>
              <li>a) Nama unsur bola yang diwakili garis AB</li>
              <li>b) Nama unsur bola yang diwakili garis OC dan OD</li>
              <li>c) Panjang OC dan OD</li>
              <li>d) Apakah OC = OD? Jelaskan!</li>
            </>
          ) : language === "en" ? (
            <>
              <li>a) The name of the sphere element represented by line AB</li>
              <li>b) The name of the sphere element represented by lines OC and OD</li>
              <li>c) The length of OC and OD</li>
              <li>d) Is OC = OD? Explain!</li>
            </>
          ) : (
            <>
              <li>a) 線分ABが表す球の要素の名前</li>
              <li>b) 線分OCとODが表す球の要素の名前</li>
              <li>c) OCとODの長さ</li>
              <li>d) OC = ODですか？説明しなさい！</li>
            </>
          )}
        </ul>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">{language === "id" ? "(a) Garis AB:" : language === "en" ? "(a) Line AB:" : "(a) 線分AB："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/80">
            {language === "id" ? (
              <>Garis AB menghubungkan dua titik di permukaan bola dan <strong className="text-yellow-300">melewati pusat O</strong>.</>
            ) : language === "en" ? (
              <>Line AB connects two points on the sphere's surface and <strong className="text-yellow-300">passes through center O</strong>.</>
            ) : (
              <>線分ABは球の表面上の2点を結び、<strong className="text-yellow-300">中心Oを通ります</strong>。</>
            )}
          </p>
          <p className="text-cyan-300 mt-1">
            {language === "id" ? <>→ Garis AB adalah <strong>Diameter (d)</strong> bola.</> : language === "en" ? <>→ Line AB is the sphere's <strong>Diameter (d)</strong>.</> : <>→ 線分ABは球の<strong>直径（d）</strong>です。</>}
          </p>
        </div>
        <p className="text-red-400 font-semibold">{language === "id" ? "(b) Garis OC dan OD:" : language === "en" ? "(b) Lines OC and OD:" : "(b) 線分OCとOD："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/80">
            {language === "id" ? (
              <>Garis OC dan OD menghubungkan <strong className="text-yellow-300">pusat O ke titik di permukaan bola</strong>.</>
            ) : language === "en" ? (
              <>Lines OC and OD connect <strong className="text-yellow-300">center O to a point on the sphere's surface</strong>.</>
            ) : (
              <>線分OCとODは、<strong className="text-yellow-300">中心Oから球の表面上の点</strong>を結びます。</>
            )}
          </p>
          <p className="text-cyan-300 mt-1">
            {language === "id" ? <>→ Garis OC dan OD adalah <strong>Jari-jari (r)</strong> bola.</> : language === "en" ? <>→ Lines OC and OD are the sphere's <strong>Radius (r)</strong>.</> : <>→ 線分OCとODは球の<strong>半径（r）</strong>です。</>}
          </p>
        </div>
        <p className="text-red-400 font-semibold">{language === "id" ? "(c) Panjang OC dan OD:" : language === "en" ? "(c) Length of OC and OD:" : "(c) OCとODの長さ："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{50}{2} = 25 \text{ cm}" />
          <p className="text-cyan-300">OC = OD = <strong>25 cm</strong></p>
        </div>
        <p className="text-red-400 font-semibold">{language === "id" ? "(d) Apakah OC = OD?" : language === "en" ? "(d) Is OC = OD?" : "(d) OC = ODですか？"}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <p className="text-white/80">
            {language === "id" ? <><strong className="text-green-300">Ya, OC = OD</strong> meskipun arahnya berbeda.</> : language === "en" ? <><strong className="text-green-300">Yes, OC = OD</strong> even though their directions differ.</> : <>はい、方向は異なりますが<strong className="text-green-300">OC = OD</strong>です。</>}
          </p>
          <p className="text-white/70 mt-1">
            {language === "id" ? (
              <>Karena <strong className="text-yellow-300">semua jari-jari bola panjangnya sama</strong> — itulah sifat utama bola: setiap titik di permukaannya berjarak sama (= r) dari pusat O.</>
            ) : language === "en" ? (
              <>Because <strong className="text-yellow-300">all radii of a sphere have the same length</strong> — this is the sphere's key property: every point on its surface is the same distance (= r) from center O.</>
            ) : (
              <>なぜなら、<strong className="text-yellow-300">球のすべての半径は同じ長さ</strong>だからです — これが球の重要な性質で、表面上のすべての点は中心Oから同じ距離（= r）にあります。</>
            )}
          </p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">{language === "id" ? "✅ Jawaban:" : language === "en" ? "✅ Answer:" : "✅ 答え："}</p>
          <p className="text-white/80">
            {language === "id" ? <>• AB = Diameter = <strong className="text-yellow-300">50 cm</strong></> : language === "en" ? <>• AB = Diameter = <strong className="text-yellow-300">50 cm</strong></> : <>• AB = 直径 = <strong className="text-yellow-300">50 cm</strong></>}
          </p>
          <p className="text-white/80">
            {language === "id" ? <>• OC, OD = Jari-jari = <strong className="text-yellow-300">25 cm</strong></> : language === "en" ? <>• OC, OD = Radius = <strong className="text-yellow-300">25 cm</strong></> : <>• OC, OD = 半径 = <strong className="text-yellow-300">25 cm</strong></>}
          </p>
          <p className="text-white/80">
            {language === "id" ? (
              <>• OC = OD karena semua jari-jari bola <strong className="text-cyan-300">selalu sama panjang</strong></>
            ) : language === "en" ? (
              <>• OC = OD because all radii of a sphere are <strong className="text-cyan-300">always the same length</strong></>
            ) : (
              <>• 球のすべての半径は<strong className="text-cyan-300">常に同じ長さ</strong>なので OC = OD</>
            )}
          </p>
        </div>
      </div>
    ),
  },
  ];
}

function getLuasExamples(language: Language): Ex[] {
  return [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah bola basket memiliki jari-jari <InlineMath math="12 \text{ cm}" />.</p>
            <p>Hitung luas permukaan bola tersebut! (Gunakan <InlineMath math="\pi = 3{,}14" />)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A basketball has a radius of <InlineMath math="12 \text{ cm}" />.</p>
            <p>Calculate the surface area of the ball! (Use <InlineMath math="\pi = 3{,}14" />)</p>
          </>
        ) : (
          <>
            <p>バスケットボールの半径は<InlineMath math="12 \text{ cm}" />です。</p>
            <p>このボールの表面積を求めなさい！（<InlineMath math="\pi = 3{,}14" />を使用）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = 4\pi r^2 = 4 \times 3{,}14 \times 12^2 = 4 \times 3{,}14 \times 144 = 1.808{,}64 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">
            {language === "id" ? "✅ Luas permukaan = " : language === "en" ? "✅ Surface area = " : "✅ 表面積 = "}
            <InlineMath math="1.808{,}64 \text{ cm}^2" />
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
            <p>Luas permukaan sebuah bola adalah <InlineMath math="1.386 \text{ cm}^2" />.</p>
            <p>Tentukan: (a) jari-jari bola, (b) diameter, (c) volume bola. (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>The surface area of a sphere is <InlineMath math="1.386 \text{ cm}^2" />.</p>
            <p>Determine: (a) the sphere's radius, (b) diameter, (c) volume. (Use <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : (
          <>
            <p>球の表面積は<InlineMath math="1.386 \text{ cm}^2" />です。</p>
            <p>次を求めなさい：（a）球の半径、（b）直径、（c）体積。（<InlineMath math="\pi = \frac{22}{7}" />を使用）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(a) Jari-jari:" : language === "en" ? "(a) Radius:" : "(a) 半径："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="4\pi r^2 = 1.386 \Rightarrow 4 \times \frac{22}{7} \times r^2 = 1.386" />
          <BlockMath math="r^2 = \frac{1.386 \times 7}{4 \times 22} = \frac{9.702}{88} = 110{,}25 \Rightarrow r = 10{,}5 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(b) Diameter:" : language === "en" ? "(b) Diameter:" : "(b) 直径："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="d = 2r = 2 \times 10{,}5 = 21 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(c) Volume:" : language === "en" ? "(c) Volume:" : "(c) 体積："}</p>
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
        {language === "id" ? (
          <p>Sebuah kubah masjid berbentuk <strong className="text-yellow-300">setengah bola</strong> dengan diameter <strong className="text-yellow-300">14 m</strong>. Seluruh permukaan luar kubah (sisi lengkung saja) akan dicat.</p>
        ) : language === "en" ? (
          <p>A mosque dome is shaped like a <strong className="text-yellow-300">hemisphere</strong> with a diameter of <strong className="text-yellow-300">14 m</strong>. The entire outer surface of the dome (the curved side only) will be painted.</p>
        ) : (
          <p>モスクのドームは<strong className="text-yellow-300">半球</strong>の形をしており、直径は<strong className="text-yellow-300">14 m</strong>です。ドームの外側全体（曲面のみ）にペンキを塗ります。</p>
        )}
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
          {language === "id" ? (
            <>
              <p>📋 <strong className="text-white/90">Informasi:</strong></p>
              <p>• 1 kaleng cat dapat mengecat <strong className="text-cyan-300">4 m²</strong></p>
              <p>• Harga 1 kaleng cat = <strong className="text-yellow-300">Rp 250.000</strong></p>
            </>
          ) : language === "en" ? (
            <>
              <p>📋 <strong className="text-white/90">Information:</strong></p>
              <p>• 1 can of paint covers <strong className="text-cyan-300">4 m²</strong></p>
              <p>• Price of 1 can of paint = <strong className="text-yellow-300">$250.000</strong></p>
            </>
          ) : (
            <>
              <p>📋 <strong className="text-white/90">情報：</strong></p>
              <p>• ペンキ1缶で<strong className="text-cyan-300">4 m²</strong>塗れる</p>
              <p>• ペンキ1缶の価格 = <strong className="text-yellow-300">$250.000</strong></p>
            </>
          )}
        </div>
        <p>{language === "id" ? "Tentukan:" : language === "en" ? "Determine:" : "次を求めなさい："}</p>
        <ul className="list-none space-y-1 text-sm text-white/80 pl-2">
          {language === "id" ? (
            <>
              <li>a) Luas permukaan luar kubah yang dicat</li>
              <li>b) Jumlah kaleng cat yang dibutuhkan</li>
              <li>c) Total biaya pengecatan</li>
            </>
          ) : language === "en" ? (
            <>
              <li>a) The painted outer surface area of the dome</li>
              <li>b) The number of paint cans needed</li>
              <li>c) The total painting cost</li>
            </>
          ) : (
            <>
              <li>a) 塗装するドーム外側の曲面の面積</li>
              <li>b) 必要なペンキの缶数</li>
              <li>c) 塗装費用の合計</li>
            </>
          )}
        </ul>
        <p className="text-xs text-white/50">
          {language === "id" ? <>(Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</> : language === "en" ? <>(Use <InlineMath math="\pi = \frac{22}{7}" />)</> : <>（<InlineMath math="\pi = \frac{22}{7}" />を使用）</>}
        </p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">{language === "id" ? "Langkah 1 — Tentukan jari-jari:" : language === "en" ? "Step 1 — Determine the radius:" : "ステップ1 — 半径を求める："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r = \frac{d}{2} = \frac{14}{2} = 7 \text{ m}" />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 2 — Luas sisi lengkung setengah bola (bagian yang dicat):" : language === "en" ? "Step 2 — Curved surface area of the hemisphere (the part being painted):" : "ステップ2 — 半球の曲面積（塗装される部分）："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p className="text-white/70">
            {language === "id" ? "Hanya sisi lengkung, bukan alas (kubah menempel ke bangunan):" : language === "en" ? "Only the curved side, not the base (the dome is attached to the building):" : "曲面のみで、底面は含まれません（ドームは建物に接しているため）："}
          </p>
          <BlockMath math="L_l = 2\pi r^2 = 2 \times \frac{22}{7} \times 7^2" />
          <BlockMath math="= 2 \times \frac{22}{7} \times 49 = 2 \times 22 \times 7 = 308 \text{ m}^2" />
        </div>
        <p className="text-red-400 font-semibold">{language === "id" ? "Langkah 3 — Jumlah kaleng cat:" : language === "en" ? "Step 3 — Number of paint cans:" : "ステップ3 — ペンキの缶数："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="n = \frac{L}{4} = \frac{308}{4} = 77" />
        </div>
        <p className="text-red-400 font-semibold">{language === "id" ? "Langkah 4 — Total biaya:" : language === "en" ? "Step 4 — Total cost:" : "ステップ4 — 合計費用："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          {language === "id" ? (
            <BlockMath math="H = 77 \times 250.000 = Rp\,19.250.000" />
          ) : (
            <BlockMath math="H = 77 \times 250.000 = \$\,19.250.000" />
          )}
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">{language === "id" ? "✅ Jawaban:" : language === "en" ? "✅ Answer:" : "✅ 答え："}</p>
          {language === "id" ? (
            <>
              <p className="text-white/80">• Luas kubah yang dicat = <strong className="text-yellow-300">308 m²</strong></p>
              <p className="text-white/80">• Jumlah kaleng = <strong className="text-yellow-300">77 kaleng</strong></p>
              <p className="text-white/80">• Total biaya = <strong className="text-yellow-300">Rp 19.250.000</strong></p>
            </>
          ) : language === "en" ? (
            <>
              <p className="text-white/80">• Painted dome area = <strong className="text-yellow-300">308 m²</strong></p>
              <p className="text-white/80">• Number of cans = <strong className="text-yellow-300">77 cans</strong></p>
              <p className="text-white/80">• Total cost = <strong className="text-yellow-300">$19.250.000</strong></p>
            </>
          ) : (
            <>
              <p className="text-white/80">• 塗装するドームの面積 = <strong className="text-yellow-300">308 m²</strong></p>
              <p className="text-white/80">• 缶の数 = <strong className="text-yellow-300">77缶</strong></p>
              <p className="text-white/80">• 合計費用 = <strong className="text-yellow-300">$19.250.000</strong></p>
            </>
          )}
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
            <p>Sebuah bola plastik memiliki diameter <InlineMath math="21 \text{ cm}" />.</p>
            <p>Hitung volume bola tersebut! (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A plastic ball has a diameter of <InlineMath math="21 \text{ cm}" />.</p>
            <p>Calculate the volume of the ball! (Use <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : (
          <>
            <p>プラスチックボールの直径は<InlineMath math="21 \text{ cm}" />です。</p>
            <p>このボールの体積を求めなさい！（<InlineMath math="\pi = \frac{22}{7}" />を使用）</p>
          </>
        )}
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
          <p className="text-green-300 font-semibold text-xs">
            {language === "id" ? "✅ Volume = " : language === "en" ? "✅ Volume = " : "✅ 体積 = "}
            <InlineMath math="4.851 \text{ cm}^3" />
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
            <p>Volume sebuah bola adalah <InlineMath math="38.808 \text{ cm}^3" />.</p>
            <p>Tentukan: (a) jari-jari bola, (b) luas permukaan bola. (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>The volume of a sphere is <InlineMath math="38.808 \text{ cm}^3" />.</p>
            <p>Determine: (a) the sphere's radius, (b) surface area. (Use <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : (
          <>
            <p>球の体積は<InlineMath math="38.808 \text{ cm}^3" />です。</p>
            <p>次を求めなさい：（a）球の半径、（b）表面積。（<InlineMath math="\pi = \frac{22}{7}" />を使用）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(a) Jari-jari dari volume:" : language === "en" ? "(a) Radius from the volume:" : "(a) 体積から半径を求める："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="\frac{4}{3}\pi r^3 = 38.808" />
          <BlockMath math="\frac{4}{3} \times \frac{22}{7} \times r^3 = 38.808" />
          <BlockMath math="\frac{88}{21} \times r^3 = 38.808 \Rightarrow r^3 = \frac{38.808 \times 21}{88} = \frac{814.968}{88} = 9.261" />
          <BlockMath math="r = \sqrt[3]{9.261} = 21 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">{language === "id" ? "(b) Luas permukaan:" : language === "en" ? "(b) Surface area:" : "(b) 表面積："}</p>
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
        {language === "id" ? (
          <>
            <p>Sebuah akuarium berbentuk tabung berdiameter <InlineMath math="42 \text{ cm}" /> dan tinggi <InlineMath math="60 \text{ cm}" /> diisi penuh air.</p>
            <p>Kemudian dimasukkan sebuah bola padat berdiameter <InlineMath math="21 \text{ cm}" /> ke dalamnya.</p>
            <p>Berapa cm³ air yang tumpah dari akuarium? (Gunakan <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A cylindrical aquarium with a diameter of <InlineMath math="42 \text{ cm}" /> and a height of <InlineMath math="60 \text{ cm}" /> is filled completely with water.</p>
            <p>A solid ball with a diameter of <InlineMath math="21 \text{ cm}" /> is then placed into it.</p>
            <p>How much water (in cm³) overflows from the aquarium? (Use <InlineMath math="\pi = \frac{22}{7}" />)</p>
          </>
        ) : (
          <>
            <p>直径<InlineMath math="42 \text{ cm}" />、高さ<InlineMath math="60 \text{ cm}" />の円柱形の水槽に、水がいっぱいに入っています。</p>
            <p>そこへ直径<InlineMath math="21 \text{ cm}" />の中身の詰まったボールを入れます。</p>
            <p>水槽からあふれる水の体積は何cm³ですか？（<InlineMath math="\pi = \frac{22}{7}" />を使用）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">{language === "id" ? "Langkah 1 — Volume bola:" : language === "en" ? "Step 1 — Volume of the ball:" : "ステップ1 — ボールの体積："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r_b = \frac{21}{2} = 10{,}5 \text{ cm}" />
          <BlockMath math="V_b = \frac{4}{3} \times \frac{22}{7} \times (10{,}5)^3 = \frac{4}{3} \times \frac{22}{7} \times 1.157{,}625 = 4.851 \text{ cm}^3" />
        </div>
        <p className="text-red-400 font-semibold">{language === "id" ? "Langkah 2 — Volume tabung akuarium:" : language === "en" ? "Step 2 — Volume of the cylindrical aquarium:" : "ステップ2 — 円柱形水槽の体積："}</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="r_{tb} = 21 \text{ cm}, \quad V_{tb} = \pi r^2 t = \frac{22}{7} \times 441 \times 60 = 83.160 \text{ cm}^3" />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 3 — Air yang tumpah = Volume bola (akuarium penuh):" : language === "en" ? "Step 3 — Overflowed water = Volume of the ball (aquarium already full):" : "ステップ3 — あふれた水 = ボールの体積（水槽はすでに満水）："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="V_o = V_b = 4.851 \text{ cm}^3" />
          <p className="text-white/60 mt-1">
            {language === "id" ? "Karena akuarium sudah penuh, air tumpah = seluruh volume bola yang masuk." : language === "en" ? "Because the aquarium is already full, the overflowed water equals the entire volume of the ball that goes in." : "水槽はすでに満水なので、あふれる水の量は入ったボールの体積全体と等しくなります。"}
          </p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">{language === "id" ? "✅ Jawaban:" : language === "en" ? "✅ Answer:" : "✅ 答え："}</p>
          {language === "id" ? (
            <>
              <p className="text-white/80">• Volume bola = <strong className="text-yellow-300">4.851 cm³</strong></p>
              <p className="text-white/80">• Air yang tumpah = <strong className="text-yellow-300">4.851 cm³ = 4,851 liter</strong></p>
              <p className="text-cyan-300 mt-1">💡 Prinsip Archimedes: Volume benda yang dicelupkan = Volume air yang tumpah!</p>
            </>
          ) : language === "en" ? (
            <>
              <p className="text-white/80">• Volume of the ball = <strong className="text-yellow-300">4.851 cm³</strong></p>
              <p className="text-white/80">• Overflowed water = <strong className="text-yellow-300">4.851 cm³ = 4.851 liters</strong></p>
              <p className="text-cyan-300 mt-1">💡 Archimedes' Principle: Volume of the submerged object = Volume of the water that overflows!</p>
            </>
          ) : (
            <>
              <p className="text-white/80">• ボールの体積 = <strong className="text-yellow-300">4.851 cm³</strong></p>
              <p className="text-white/80">• あふれた水 = <strong className="text-yellow-300">4.851 cm³ = 4.851リットル</strong></p>
              <p className="text-cyan-300 mt-1">💡 アルキメデスの原理：沈めた物体の体積 = あふれた水の体積！</p>
            </>
          )}
        </div>
      </div>
    ),
  },
  ];
}

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */

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
   MAIN PAGE
───────────────────────────────────────────────────────────── */
/* ── Example-problem slide chrome (titles, badges, nav) — trilingual ── */
const contohSoalTrans = {
  id: {
    unsurTitle: "Contoh Soal — Unsur-unsur Bola",
    luasTitle: "Contoh Soal — Luas Permukaan",
    volTitle: "Contoh Soal — Volume",
    subtitle: "Latihan bertingkat dari mudah hingga sulit",
    unsurPrefix: "UNSUR",
    luasPrefix: "LUAS",
    volPrefix: "VOLUME",
    showSolution: "Lihat Pembahasan",
    hideSolution: "Sembunyikan",
    prev: "Sebelumnya",
    next: "Selanjutnya",
    back: "← Kembali ke Bangun Ruang Sisi Lengkung",
  },
  en: {
    unsurTitle: "Examples — Elements of a Sphere",
    luasTitle: "Examples — Surface Area",
    volTitle: "Examples — Volume",
    subtitle: "Graded practice from easy to hard",
    unsurPrefix: "ELEMENTS",
    luasPrefix: "SURFACE AREA",
    volPrefix: "VOLUME",
    showSolution: "Show Solution",
    hideSolution: "Hide",
    prev: "Previous",
    next: "Next",
    back: "← Back to Curved-Surface Solids",
  },
  ja: {
    unsurTitle: "例題 — 球の構成要素",
    luasTitle: "例題 — 表面積",
    volTitle: "例題 — 体積",
    subtitle: "易しい問題から難しい問題までの段階的練習",
    unsurPrefix: "要素",
    luasPrefix: "表面積問題",
    volPrefix: "体積問題",
    showSolution: "解説を見る",
    hideSolution: "隠す",
    prev: "前へ",
    next: "次へ",
    back: "← 曲面図形に戻る",
  },
} as const;

const BolaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const pt = pageTrans[language];
  const sections = getSections(language);
  const cs = contohSoalTrans[language];
  const unsurExamples = getUnsurExamples(language);
  const luasExamples = getLuasExamples(language);
  const volExamples = getVolExamples(language);

  const slides = [
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    {
      title: cs.unsurTitle,
      icon: "🔎",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{cs.subtitle}</p>
          <div className="flex flex-col gap-4">
            {unsurExamples.map((ex, i) => <ExampleCard key={`u${i}`} ex={ex} idx={i} prefix={cs.unsurPrefix} language={language} showLabel={cs.showSolution} hideLabel={cs.hideSolution}/>)}
          </div>
        </div>
      ),
    },
    {
      title: cs.luasTitle,
      icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{cs.subtitle}</p>
          <div className="flex flex-col gap-4">
            {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix={cs.luasPrefix} language={language} showLabel={cs.showSolution} hideLabel={cs.hideSolution}/>)}
          </div>
        </div>
      ),
    },
    {
      title: cs.volTitle,
      icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{cs.subtitle}</p>
          <div className="flex flex-col gap-4">
            {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix={cs.volPrefix} language={language} showLabel={cs.showSolution} hideLabel={cs.hideSolution}/>)}
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
            <ChevronLeft className="w-4 h-4" /> {cs.prev}
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            {cs.next} <ChevronRight className="w-4 h-4" />
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

export default BolaPage;
