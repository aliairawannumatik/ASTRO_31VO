import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Triangle, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import JaringLimasInteraktif from "@/components/JaringLimasInteraktif";

/* ─────────────────────────────────────────────────────────────
   SVG 3D MATH UTILITIES
───────────────────────────────────────────────────────────── */
type LV3 = [number, number, number];
type LV2 = [number, number];
const lRotX = (v: LV3, a: number): LV3 => [v[0], v[1]*Math.cos(a)-v[2]*Math.sin(a), v[1]*Math.sin(a)+v[2]*Math.cos(a)];
const lRotY = (v: LV3, a: number): LV3 => [v[0]*Math.cos(a)+v[2]*Math.sin(a), v[1], -v[0]*Math.sin(a)+v[2]*Math.cos(a)];
const lProj = (v: LV3, fov=380, s=1.3): LV2 => { const tz=v[2]+fov; return [(v[0]*fov*s)/tz,(v[1]*fov*s)/tz]; };
const lCross = (ax:number,ay:number,bx:number,by:number) => ax*by-ay*bx;

const makeLimasVerts = (n: number, r: number, h: number): LV3[] => {
  const verts: LV3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    verts.push([r * Math.cos(a), h * 0.55, r * Math.sin(a)]);
  }
  verts.push([0, -h * 0.45, 0]);
  return verts;
};
const makeLimasFaces = (n: number) => {
  const palette = ["#3b82f6","#ef4444","#eab308","#22c55e","#f97316","#ec4899","#06b6d4","#a78bfa"];
  const apexIdx = n;
  const faces: { idx: number[]; color: string; label: string }[] = [];
  faces.push({ idx: Array.from({length:n},(_,i)=>i), color:palette[0], label:"ALAS" });
  for (let i = 0; i < n; i++) {
    const j = (i+1)%n;
    faces.push({ idx:[i,j,apexIdx], color:palette[(i+1)%palette.length], label:`Δ${i+1}` });
  }
  return faces;
};

const RotatingLimas3D = ({ n, label, r = 40, h = 65 }: { n: number; label: string; r?: number; h?: number }) => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(n * 40);
  const [isDragging, setIsDragging] = useState(false);
  const isDragRef = useRef(false);
  const dragRef   = useRef({ sx:0, sy:0, bx:-22, by: n*40 });
  const tickRef   = useRef(n * 30);
  const rotYRef   = useRef(n * 40);
  const rafRef    = useRef<number|null>(null);

  useEffect(() => {
    const animate = () => {
      if (!isDragRef.current) {
        tickRef.current += 1;
        rotYRef.current += 0.20;
        const rx = -18 + Math.sin(tickRef.current * 0.013) * 18;
        setRotY(rotYRef.current);
        setRotX(rx);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragRef.current = true; setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragRef.current) return;
    const ny = dragRef.current.by + (e.clientX - dragRef.current.sx) * 0.55;
    const nx = dragRef.current.bx - (e.clientY - dragRef.current.sy) * 0.55;
    rotYRef.current = ny; setRotY(ny); setRotX(nx);
  }, []);
  const onMouseUp = useCallback(() => { isDragRef.current = false; setIsDragging(false); }, []);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; isDragRef.current = true; setIsDragging(true);
    dragRef.current = { sx: t.clientX, sy: t.clientY, bx: rotX, by: rotY };
  };
  const onTouchMove = useCallback((ev: TouchEvent) => {
    if (!isDragRef.current) return;
    const t = ev.touches[0];
    const ny = dragRef.current.by + (t.clientX - dragRef.current.sx) * 0.55;
    const nx = dragRef.current.bx - (t.clientY - dragRef.current.sy) * 0.55;
    rotYRef.current = ny; setRotY(ny); setRotX(nx);
  }, []);
  const onTouchEnd = useCallback(() => { isDragRef.current = false; setIsDragging(false); }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const rx = (rotX * Math.PI) / 180;
  const ry = (rotY * Math.PI) / 180;
  const rawVerts = makeLimasVerts(n, r, h);
  const faceDefs = makeLimasFaces(n);
  const tfVerts = rawVerts.map(v => lRotX(lRotY(v, ry), rx));
  const pverts: LV2[] = tfVerts.map(v => lProj(v));
  const facesWithDepth = faceDefs.map(f => {
    const avgZ = f.idx.reduce((s,i)=>s+tfVerts[i][2],0)/f.idx.length;
    const pts2d = f.idx.map(i => pverts[i]);
    const area = lCross(pts2d[1][0]-pts2d[0][0],pts2d[1][1]-pts2d[0][1],pts2d[pts2d.length-1][0]-pts2d[0][0],pts2d[pts2d.length-1][1]-pts2d[0][1]);
    return { ...f, avgZ, pts2d, visible: area < 0 };
  }).sort((a,b) => b.avgZ - a.avgZ);
  const cx = 85, cy = 88;

  return (
    <div
      className="flex flex-col items-center bg-slate-900/60 border border-slate-700/50 rounded-xl py-2 px-1 select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab", flex:1, minWidth:0 }}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}
    >
      <span className="text-white/70 font-body font-semibold mb-1" style={{ fontSize:10 }}>{label}</span>
      <svg viewBox="0 0 170 176" style={{ width:"100%", maxWidth:160, overflow:"visible" }}>
        {facesWithDepth.map((f, i) => {
          const pts = f.pts2d.map(([x,y]) => `${cx+x},${cy+y}`).join(" ");
          const mx  = f.pts2d.reduce((s,p)=>s+p[0],0)/f.pts2d.length;
          const my  = f.pts2d.reduce((s,p)=>s+p[1],0)/f.pts2d.length;
          return (
            <g key={i}>
              <polygon points={pts} fill={f.color} fillOpacity={1}
                stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} strokeLinejoin="round"/>
              <text x={cx+mx} y={cy+my+3} fill="white" fontSize={7} fontFamily="monospace"
                fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                style={{ pointerEvents:"none" }}>{f.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const ThreeLimas = () => (
  <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 space-y-2">
    <p className="text-center text-white/40 font-body" style={{ fontSize:9 }}>
      Berputar otomatis · Drag untuk memutar sendiri
    </p>
    <div className="flex gap-2">
      <RotatingLimas3D n={3} label="Limas Segitiga" r={38} h={65}/>
      <RotatingLimas3D n={4} label="Limas Segiempat" r={36} h={65}/>
      <RotatingLimas3D n={5} label="Limas Segilima" r={34} h={65}/>
    </div>
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
      {[["#3b82f6","ALAS"],["#ef4444","SISI Δ"]].map(([c,l])=>(
        <div key={l} className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background:c }}/>
          <span className="text-white/45 font-body" style={{ fontSize:9 }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE LIMAS 3D — drag to rotate, click net button
───────────────────────────────────────────────────────────── */
const InteractiveLimas = () => {
  const [rotX, setRotX] = useState(-28);
  const [rotY, setRotY] = useState(38);
  const [isDragging, setIsDragging] = useState(false);
  const [showNet, setShowNet] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, baseRotX: -28, baseRotY: 38 });

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseRotX: rotX, baseRotY: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.baseRotY + (e.clientX - dragRef.current.startX) * 0.6);
    setRotX(dragRef.current.baseRotX - (e.clientY - dragRef.current.startY) * 0.6);
  }, [isDragging]);
  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { startX: t.clientX, startY: t.clientY, baseRotX: rotX, baseRotY: rotY };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setRotY(dragRef.current.baseRotY + (t.clientX - dragRef.current.startX) * 0.6);
    setRotX(dragRef.current.baseRotX - (t.clientY - dragRef.current.startY) * 0.6);
  }, [isDragging]);
  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        Drag untuk memutar · Tombol di bawah untuk melihat jaring-jaring limas
      </p>

      <div
        className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{ width: "100%", height: 300, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {showNet ? (
          /* Jaring-jaring Limas Segiempat */
          <svg viewBox="0 0 260 260" width="220" height="220" style={{ display: "block", margin: "auto" }}>
            {/* Alas (bawah) */}
            <rect x="80" y="130" width="80" height="80" fill="#3b82f6" fillOpacity="0.85" stroke="white" strokeWidth="2" rx="2"/>
            <text x="120" y="175" fill="white" fontSize="9" fontFamily="monospace" textAnchor="middle">ALAS</text>
            {/* Segitiga atas */}
            <polygon points="80,130 160,130 120,60" fill="#8b5cf6" fillOpacity="0.85" stroke="white" strokeWidth="2"/>
            <text x="120" y="108" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">Δ atas</text>
            {/* Segitiga bawah */}
            <polygon points="80,210 160,210 120,275" fill="#22c55e" fillOpacity="0.85" stroke="white" strokeWidth="2"/>
            <text x="120" y="246" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">Δ bawah</text>
            {/* Segitiga kiri */}
            <polygon points="80,130 80,210 15,170" fill="#f97316" fillOpacity="0.85" stroke="white" strokeWidth="2"/>
            <text x="44" y="173" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">Δ kiri</text>
            {/* Segitiga kanan */}
            <polygon points="160,130 160,210 225,170" fill="#eab308" fillOpacity="0.85" stroke="white" strokeWidth="2"/>
            <text x="196" y="173" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">Δ kanan</text>
          </svg>
        ) : (
          /* 3D Limas */
          <div
            style={{
              width: 90, height: 90,
              position: "relative",
              transformStyle: "preserve-3d",
              transform: `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: isDragging ? "none" : "transform 0.5s ease",
            }}
          >
            {/* Base (bottom face) */}
            <div style={{
              position: "absolute",
              width: 90, height: 90,
              background: "#3b82f6",
              opacity: 0.7,
              border: "2px solid #3b82f6cc",
              borderRadius: 4,
              transformStyle: "preserve-3d",
              transform: "rotateX(90deg) translateZ(-45px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 8, fontWeight: 700, fontFamily: "monospace" }}>ALAS</span>
            </div>
            {/* Front face (triangle) */}
            <div style={{
              position: "absolute",
              width: 0, height: 0,
              borderLeft: "45px solid transparent",
              borderRight: "45px solid transparent",
              borderBottom: "90px solid rgba(139,92,246,0.75)",
              top: -90, left: 0,
              transform: "rotateX(-90deg) translateZ(45px)",
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
            }}/>
            {/* Back face (triangle) */}
            <div style={{
              position: "absolute",
              width: 0, height: 0,
              borderLeft: "45px solid transparent",
              borderRight: "45px solid transparent",
              borderBottom: "90px solid rgba(34,197,94,0.65)",
              top: -90, left: 0,
              transform: "rotateX(-90deg) rotateY(180deg) translateZ(45px)",
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
            }}/>
            {/* Left face (triangle) */}
            <div style={{
              position: "absolute",
              width: 0, height: 0,
              borderLeft: "45px solid transparent",
              borderRight: "45px solid transparent",
              borderBottom: "90px solid rgba(249,115,22,0.7)",
              top: -90, left: 0,
              transform: "rotateX(-90deg) rotateY(-90deg) translateZ(45px)",
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
            }}/>
            {/* Right face (triangle) */}
            <div style={{
              position: "absolute",
              width: 0, height: 0,
              borderLeft: "45px solid transparent",
              borderRight: "45px solid transparent",
              borderBottom: "90px solid rgba(234,179,8,0.7)",
              top: -90, left: 0,
              transform: "rotateX(-90deg) rotateY(90deg) translateZ(45px)",
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
            }}/>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => { playPopSound(); setShowNet(false); setRotX(-28); setRotY(38); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer font-body ${!showNet ? "bg-violet-700/80 border-violet-500 text-violet-100" : "bg-violet-900/40 border-violet-700 text-violet-300 hover:bg-violet-800/50"}`}
        >
          ▶ Limas 3D
        </button>
        <button
          onClick={() => { playPopSound(); setShowNet(true); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer font-body ${showNet ? "bg-orange-700/80 border-orange-500 text-orange-100" : "bg-orange-900/40 border-orange-700 text-orange-300 hover:bg-orange-800/50"}`}
        >
          ⊞ Jaring-Jaring
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { label: "ALAS", color: "#3b82f6" },
          { label: "Δ depan", color: "#8b5cf6" },
          { label: "Δ belakang", color: "#22c55e" },
          { label: "Δ kiri", color: "#f97316" },
          { label: "Δ kanan", color: "#eab308" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-white/50 text-[10px] font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — UNSUR LIMAS
───────────────────────────────────────────────────────────── */
const TitikSudutLimasSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Titik sudut limas">
    <defs>
      <style>{`
        @keyframes tsGlow{0%,100%{r:6;opacity:1;}50%{r:10;opacity:0.4;}}
        .ts-a{animation:tsGlow 1.2s ease-in-out infinite;}
        .ts-b{animation:tsGlow 1.2s ease-in-out infinite 0.3s;}
        .ts-c{animation:tsGlow 1.2s ease-in-out infinite 0.6s;}
        .ts-d{animation:tsGlow 1.2s ease-in-out infinite 0.9s;}
        .ts-e{animation:tsGlow 1.2s ease-in-out infinite 1.1s;}
      `}</style>
    </defs>
    {/* Base square */}
    <polygon points="60,150 180,150 220,120 100,120" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5"/>
    {/* Lateral edges */}
    <line x1="60" y1="150" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="180" y1="150" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="100" y1="120" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="220" y1="120" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
    {/* Vertices — 5 titik sudut */}
    <circle cx="60" cy="150" r="6" fill="#f97316" className="ts-a"/>
    <circle cx="180" cy="150" r="6" fill="#f97316" className="ts-b"/>
    <circle cx="100" cy="120" r="6" fill="#f97316" className="ts-c"/>
    <circle cx="220" cy="120" r="6" fill="#f97316" className="ts-d"/>
    <circle cx="140" cy="50" r="7" fill="#eab308" className="ts-e"/>
    <text x="45" y="168" fill="#f97316" fontSize="9" fontFamily="monospace">A</text>
    <text x="183" y="168" fill="#f97316" fontSize="9" fontFamily="monospace">B</text>
    <text x="86" y="116" fill="#f97316" fontSize="9" fontFamily="monospace">D</text>
    <text x="224" y="116" fill="#f97316" fontSize="9" fontFamily="monospace">C</text>
    <text x="145" y="46" fill="#eab308" fontSize="9" fontFamily="monospace" fontWeight="bold">T</text>
    <text x="200" y="185" fill="#ffffff" fontSize="9" fontFamily="monospace">5 titik sudut</text>
    <text x="200" y="197" fill="#eab308" fontSize="9" fontFamily="monospace">T = puncak</text>
  </svg>
);

const RusukLimasSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Rusuk limas">
    <defs>
      <style>{`
        @keyframes raGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 4px #22d3ee);}50%{stroke-opacity:0.2;filter:none;}}
        @keyframes rtGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 4px #f97316);}50%{stroke-opacity:0.2;filter:none;}}
        .ra{animation:raGlow 1.4s ease-in-out infinite;}
        .rt{animation:rtGlow 1.4s ease-in-out infinite 0.5s;}
      `}</style>
    </defs>
    {/* Base edges — rusuk alas */}
    <line x1="60" y1="150" x2="180" y2="150" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
    <line x1="180" y1="150" x2="220" y2="120" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
    <line x1="220" y1="120" x2="100" y2="120" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
    <line x1="100" y1="120" x2="60" y2="150" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
    {/* Lateral edges — rusuk tegak */}
    <line x1="60" y1="150" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
    <line x1="180" y1="150" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
    <line x1="100" y1="120" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
    <line x1="220" y1="120" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
    {/* Base fill */}
    <polygon points="60,150 180,150 220,120 100,120" fill="rgba(30,41,59,0.6)" stroke="none"/>
    {/* Apex */}
    <circle cx="140" cy="50" r="5" fill="#eab308"/>
    <text x="5" y="185" fill="#22d3ee" fontSize="9" fontFamily="monospace">— Rusuk alas (4)</text>
    <text x="5" y="197" fill="#f97316" fontSize="9" fontFamily="monospace">— Rusuk tegak (4)</text>
    <text x="200" y="185" fill="#ffffff" fontSize="9" fontFamily="monospace">Total:</text>
    <text x="200" y="197" fill="#22d3ee" fontSize="9" fontFamily="monospace">8 rusuk</text>
  </svg>
);

const SisiLimasSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Sisi limas">
    <defs>
      <style>{`
        @keyframes sAnim{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.15;}}
        .sa{animation:sAnim 1.6s ease-in-out infinite;}
        .sb{animation:sAnim 1.6s ease-in-out infinite 0.4s;}
        .sc{animation:sAnim 1.6s ease-in-out infinite 0.8s;}
        .sd{animation:sAnim 1.6s ease-in-out infinite 1.2s;}
        .se{animation:sAnim 1.6s ease-in-out infinite 0.2s;}
      `}</style>
    </defs>
    {/* Alas */}
    <polygon points="60,150 180,150 220,120 100,120" fill="#3b82f6" className="sa"/>
    {/* Sisi tegak depan */}
    <polygon points="60,150 180,150 140,50" fill="#8b5cf6" className="sb"/>
    {/* Sisi tegak kanan */}
    <polygon points="180,150 220,120 140,50" fill="#f97316" className="sc" fillOpacity="0.6"/>
    {/* Sisi tegak belakang */}
    <polygon points="220,120 100,120 140,50" fill="#22c55e" className="sd" fillOpacity="0.5"/>
    {/* Sisi tegak kiri */}
    <polygon points="100,120 60,150 140,50" fill="#eab308" className="se" fillOpacity="0.55"/>
    <text x="5" y="185" fill="#3b82f6" fontSize="9" fontFamily="monospace">■ Alas segi-4</text>
    <text x="5" y="197" fill="#8b5cf6" fontSize="9" fontFamily="monospace">▲ 4 bidang tegak</text>
    <text x="190" y="185" fill="#ffffff" fontSize="9" fontFamily="monospace">Total:</text>
    <text x="190" y="197" fill="#22d3ee" fontSize="9" fontFamily="monospace">5 sisi</text>
  </svg>
);

const ApotemaLimasSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Apotema limas">
    <defs>
      <style>{`
        @keyframes apGlow{0%,100%{stroke-dashoffset:0;opacity:1;}100%{stroke-dashoffset:-20;opacity:0.5;}}
        .ap{animation:apGlow 1.5s linear infinite;}
      `}</style>
    </defs>
    <polygon points="60,155 200,155 200,115 60,115" fill="rgba(59,130,246,0.2)" stroke="#3b82f699" strokeWidth="1.5"/>
    {/* Apex */}
    <line x1="60" y1="155" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
    <line x1="200" y1="155" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
    <line x1="200" y1="115" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
    <line x1="60" y1="115" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
    {/* Tinggi limas */}
    <line x1="130" y1="135" x2="130" y2="55" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="6,3" className="ap"/>
    <text x="135" y="100" fill="#22d3ee" fontSize="9" fontFamily="monospace">t (tinggi)</text>
    {/* Apotema sisi tegak */}
    <line x1="130" y1="135" x2="130" y2="55" stroke="none"/>
    <line x1="130" y1="155" x2="130" y2="55" stroke="#f97316" strokeWidth="2.5" strokeDasharray="none"/>
    <circle cx="130" cy="135" r="4" fill="#f97316"/>
    <text x="80" y="148" fill="#f97316" fontSize="9" fontFamily="monospace">l (apotema)</text>
    {/* Titik tengah alas */}
    <circle cx="130" cy="135" r="3" fill="#eab308"/>
    <text x="133" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">O (pusat)</text>
    {/* Right angle marker */}
    <polyline points="130,155 139,155 139,145" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="5" y="185" fill="#22d3ee" fontSize="9" fontFamily="monospace">t = tinggi limas (⊥ alas)</text>
    <text x="5" y="197" fill="#f97316" fontSize="9" fontFamily="monospace">l = apotema = √(t²+(s/2)²)</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   JARING-JARING LIMAS — beberapa variasi
───────────────────────────────────────────────────────────── */
const NetLimasGallery = () => {
  const nets = [
    {
      label: "Limas Segiempat (standar)",
      desc: "Alas + 4 segitiga, puncak ke atas",
      svg: (
        <svg viewBox="0 0 120 120" width="90" height="90">
          <rect x="35" y="55" width="50" height="50" fill="#3b82f6" fillOpacity="0.85" stroke="white" strokeWidth="1.5" rx="1"/>
          <polygon points="35,55 85,55 60,15" fill="#8b5cf6" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="35,105 85,105 60,118" fill="#22c55e" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="35,55 35,105 5,80" fill="#f97316" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="85,55 85,105 115,80" fill="#eab308" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      label: "Limas Segitiga",
      desc: "Alas segitiga + 3 segitiga",
      svg: (
        <svg viewBox="0 0 120 120" width="90" height="90">
          <polygon points="60,45 95,95 25,95" fill="#3b82f6" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="60,45 25,95 5,50" fill="#8b5cf6" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="60,45 95,95 115,50" fill="#f97316" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="60,45 5,50 60,15" fill="#22c55e" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      label: "Limas Segiempat (kipas)",
      desc: "Segitiga mengelilingi alas",
      svg: (
        <svg viewBox="0 0 130 130" width="90" height="90">
          <rect x="40" y="40" width="50" height="50" fill="#3b82f6" fillOpacity="0.85" stroke="white" strokeWidth="1.5" rx="1"/>
          <polygon points="40,40 90,40 65,10" fill="#8b5cf6" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="40,90 90,90 65,118" fill="#22c55e" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="40,40 40,90 10,65" fill="#f97316" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
          <polygon points="90,40 90,90 120,65" fill="#eab308" fillOpacity="0.85" stroke="white" strokeWidth="1.5"/>
        </svg>
      )
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {nets.map((n, i) => (
        <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col items-center gap-2">
          <span className="text-white/50 text-[9px] font-body font-bold text-center">{n.label}</span>
          <div className="flex items-center justify-center" style={{ minHeight: 80 }}>
            {n.svg}
          </div>
          <span className="text-white/30 text-[8px] font-body text-center">{n.desc}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   WATER LIMAS ANIMATION
───────────────────────────────────────────────────────────── */
type V2L = [number, number];
type LimasWaterType = "segitiga" | "segiempat" | "segilima";

const WaterLimasAnimation = () => {
  const [fill, setFill] = useState(0);
  const [limasType, setLimasType] = useState<LimasWaterType>("segiempat");

  useEffect(() => {
    const FILL_MS = 3200, HOLD_FULL = 900, EMPTY_MS = 2000, HOLD_EMPTY = 500;
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
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lerp2 = (a: V2L, b: V2L, t: number): V2L => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const pt  = (v: V2L) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pts = (...vs: V2L[]) => vs.map(pt).join(" ");

  const pct     = Math.round(fill * 100);
  const isEmpty = fill < 0.005;
  const isFull  = fill > 0.995;
  const statusColor = isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc";
  const statusText  = isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`;

  const BarWidget = ({ barX, barY, barH }: { barX: number; barY: number; barH: number }) => {
    const barW = 12;
    const filledH = barH * fill;
    return (
      <>
        <rect x={barX} y={barY} width={barW} height={barH} fill="#0f172a" stroke="#334155" strokeWidth="1.2" rx="3"/>
        {!isEmpty && (
          <rect x={barX} y={barY + barH - filledH} width={barW} height={filledH} fill="#2563eb" fillOpacity={0.88} rx="3"/>
        )}
        <text x={barX + barW / 2} y={barY - 5}  fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">V%</text>
        <text x={barX + barW / 2} y={barY + barH + 12} fill={statusColor} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{pct}%</text>
      </>
    );
  };

  /* ── LIMAS SEGIEMPAT ── */
  const renderSegiempat = () => {
    const FL:  V2L = [50, 184];
    const FR:  V2L = [164, 184];
    const dx = 28, dy = -18;
    const BkL: V2L = [FL[0] + dx, FL[1] + dy];
    const BkR: V2L = [FR[0] + dx, FR[1] + dy];
    const apex: V2L = [121, 70];

    const WFL  = lerp2(FL,  apex, fill);
    const WFR  = lerp2(FR,  apex, fill);
    const WBkR = lerp2(BkR, apex, fill);
    const WBkL = lerp2(BkL, apex, fill);

    return (
      <>
        {/* hidden back edges */}
        <line x1={BkL[0]} y1={BkL[1]} x2={apex[0]} y2={apex[1]} stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={FL[0]}  y1={FL[1]}  x2={BkL[0]}  y2={BkL[1]}  stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
        {/* ghost shell */}
        <polygon points={pts(FR, BkR, apex)}    fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>
        <polygon points={pts(FL, FR, apex)}     fill="#0f172a" fillOpacity={0.10} stroke="#334155" strokeWidth="0.8"/>
        {/* water */}
        {!isEmpty && (
          <>
            <polygon points={pts(FL, FR, BkR, BkL)}   fill="#1e3a8a" fillOpacity={0.90}/>
            <polygon points={pts(FR, BkR, WBkR, WFR)} fill="#1d4ed8" fillOpacity={0.80}/>
            <polygon points={pts(FL, FR, WFR, WFL)}   fill="#2563eb" fillOpacity={0.90}/>
            {!isFull && (
              <polygon points={pts(WFL, WFR, WBkR, WBkL)} fill="#7dd3fc" fillOpacity={0.50}
                style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}/>
            )}
            {!isFull && (
              <line x1={WFL[0]} y1={WFL[1]} x2={WFR[0]} y2={WFR[1]}
                stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
            )}
          </>
        )}
        {/* wireframe */}
        <line x1={FL[0]}  y1={FL[1]}  x2={FR[0]}   y2={FR[1]}   stroke="#93c5fd" strokeWidth="2"/>
        <line x1={FR[0]}  y1={FR[1]}  x2={BkR[0]}  y2={BkR[1]}  stroke="#a5b4fc" strokeWidth="1.8"/>
        <line x1={FL[0]}  y1={FL[1]}  x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={FR[0]}  y1={FR[1]}  x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={BkR[0]} y1={BkR[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.6"/>
        {/* labels */}
        <text x={(FL[0]+FR[0])/2}   y={FL[1]+13}  fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
        <text x={(FL[0]+FR[0])/2}   y={FL[1]+24}  fill="#4ade80" fontSize="8"  fontFamily="monospace" fontWeight="bold" textAnchor="middle">ALAS (s²)</text>
        <text x={apex[0]} y={apex[1]-8} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>
        <BarWidget barX={205} barY={70} barH={114}/>
        <text x="120" y="200" fill={statusColor} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">{statusText}</text>
        <text x="120" y="214" fill="#e0e7ff"  fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">V = ⅓ × s² × t</text>
      </>
    );
  };

  /* ── LIMAS SEGITIGA ── */
  const renderSegitiga = () => {
    const FV:  V2L = [112, 184];
    const BkL: V2L = [58,  156];
    const BkR: V2L = [170, 156];
    const apex: V2L = [112, 70];

    const WFV  = lerp2(FV,  apex, fill);
    const WBkL = lerp2(BkL, apex, fill);
    const WBkR = lerp2(BkR, apex, fill);

    return (
      <>
        {/* hidden back edge */}
        <line x1={BkL[0]} y1={BkL[1]} x2={FV[0]}   y2={FV[1]}   stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={BkL[0]} y1={BkL[1]} x2={apex[0]} y2={apex[1]} stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
        {/* ghost shell */}
        <polygon points={pts(FV, BkR, apex)}  fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>
        {/* water */}
        {!isEmpty && (
          <>
            <polygon points={pts(FV, BkL, BkR)}         fill="#1e3a8a" fillOpacity={0.90}/>
            <polygon points={pts(FV, BkR, WBkR, WFV)}   fill="#1d4ed8" fillOpacity={0.80}/>
            <polygon points={pts(FV, BkL, WBkL, WFV)}   fill="#2563eb" fillOpacity={0.70}/>
            {!isFull && (
              <polygon points={pts(WFV, WBkL, WBkR)} fill="#7dd3fc" fillOpacity={0.50}
                style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}/>
            )}
            {!isFull && (
              <>
                <line x1={WFV[0]} y1={WFV[1]} x2={WBkR[0]} y2={WBkR[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
                <line x1={WFV[0]} y1={WFV[1]} x2={WBkL[0]} y2={WBkL[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
              </>
            )}
          </>
        )}
        {/* wireframe */}
        <line x1={FV[0]}  y1={FV[1]}  x2={BkR[0]}  y2={BkR[1]}  stroke="#93c5fd" strokeWidth="2"/>
        <line x1={BkR[0]} y1={BkR[1]} x2={BkL[0]}  y2={BkL[1]}  stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={FV[0]}  y1={FV[1]}  x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={BkR[0]} y1={BkR[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={BkL[0]} y1={BkL[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.4" strokeDasharray="4,3"/>
        {/* labels */}
        <text x={(BkL[0]+BkR[0])/2} y={BkL[1]+18}  fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a</text>
        <text x={(BkL[0]+BkR[0])/2} y={BkL[1]+29}  fill="#4ade80" fontSize="8"  fontFamily="monospace" fontWeight="bold" textAnchor="middle">ALAS (½at₀)</text>
        <text x={apex[0]} y={apex[1]-8} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>
        <BarWidget barX={205} barY={70} barH={114}/>
        <text x="112" y="200" fill={statusColor} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">{statusText}</text>
        <text x="112" y="214" fill="#e0e7ff"  fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">V = ⅙ × a × t₀ × t</text>
      </>
    );
  };

  /* ── LIMAS SEGILIMA ── */
  const renderSegilima = () => {
    const P1: V2L = [112, 186];
    const P2: V2L = [163, 171];
    const P3: V2L = [148, 150];
    const P4: V2L = [76,  150];
    const P5: V2L = [61,  171];
    const apex: V2L = [112, 68];

    const WP1 = lerp2(P1, apex, fill);
    const WP2 = lerp2(P2, apex, fill);
    const WP3 = lerp2(P3, apex, fill);
    const WP4 = lerp2(P4, apex, fill);
    const WP5 = lerp2(P5, apex, fill);

    return (
      <>
        {/* hidden back edges */}
        <line x1={P4[0]} y1={P4[1]} x2={P3[0]}   y2={P3[1]}   stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={P4[0]} y1={P4[1]} x2={P5[0]}   y2={P5[1]}   stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={P4[0]} y1={P4[1]} x2={apex[0]} y2={apex[1]} stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
        {/* ghost shell */}
        <polygon points={pts(P1, P2, apex)} fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>
        <polygon points={pts(P2, P3, apex)} fill="#0f172a" fillOpacity={0.12} stroke="#334155" strokeWidth="0.8"/>
        {/* water */}
        {!isEmpty && (
          <>
            <polygon points={pts(P1, P2, P3, P4, P5)}    fill="#1e3a8a" fillOpacity={0.90}/>
            <polygon points={pts(P2, P3, WP3, WP2)}      fill="#1d4ed8" fillOpacity={0.75}/>
            <polygon points={pts(P1, P2, WP2, WP1)}      fill="#2563eb" fillOpacity={0.82}/>
            <polygon points={pts(P5, P1, WP1, WP5)}      fill="#2563eb" fillOpacity={0.75}/>
            {!isFull && (
              <polygon points={pts(WP1, WP2, WP3, WP4, WP5)} fill="#7dd3fc" fillOpacity={0.50}
                style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}/>
            )}
            {!isFull && (
              <>
                <line x1={WP5[0]} y1={WP5[1]} x2={WP1[0]} y2={WP1[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
                <line x1={WP1[0]} y1={WP1[1]} x2={WP2[0]} y2={WP2[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
              </>
            )}
          </>
        )}
        {/* wireframe */}
        <line x1={P1[0]} y1={P1[1]} x2={P2[0]}   y2={P2[1]}   stroke="#93c5fd" strokeWidth="2"/>
        <line x1={P2[0]} y1={P2[1]} x2={P3[0]}   y2={P3[1]}   stroke="#a5b4fc" strokeWidth="1.8"/>
        <line x1={P5[0]} y1={P5[1]} x2={P1[0]}   y2={P1[1]}   stroke="#93c5fd" strokeWidth="2"/>
        <line x1={P1[0]} y1={P1[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={P2[0]} y1={P2[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.6"/>
        <line x1={P3[0]} y1={P3[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.4"/>
        <line x1={P5[0]} y1={P5[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        {/* labels */}
        <text x={(P1[0]+P2[0])/2+5} y={(P1[1]+P2[1])/2+6} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a</text>
        <text x="112" y={186+20}   fill="#4ade80" fontSize="8"  fontFamily="monospace" fontWeight="bold" textAnchor="middle">ALAS (segi-5)</text>
        <text x={apex[0]} y={apex[1]-8} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>
        <BarWidget barX={205} barY={68} barH={118}/>
        <text x="112" y="202" fill={statusColor} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">{statusText}</text>
        <text x="112" y="216" fill="#e0e7ff"  fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">V = ⅓ × L_alas × t</text>
      </>
    );
  };

  const tabs: { key: LimasWaterType; label: string }[] = [
    { key: "segitiga",  label: "△ Segitiga"  },
    { key: "segiempat", label: "□ Segiempat" },
    { key: "segilima",  label: "⬠ Segilima"  },
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setLimasType(key)}
            className={`flex-1 text-xs py-1.5 px-1 rounded-md font-semibold transition-all font-body ${
              limasType === key
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 280 225" className="w-full max-w-sm mx-auto my-1"
        aria-label="Animasi limas diisi air">
        <defs>
          <filter id="wBloomLimas">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {limasType === "segitiga"  && renderSegitiga()}
        {limasType === "segiempat" && renderSegiempat()}
        {limasType === "segilima"  && renderSegilima()}
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ACCORDION SECTIONS
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

const sections: Sec[] = [
  {
    title: "Pengertian & Jenis Limas",
    icon: "🏔️",
    content: (
      <div className="space-y-4 font-body">
        <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-sm text-white/85 leading-relaxed">
          <p>
            <strong className="text-violet-300">Limas</strong> adalah bangun ruang sisi datar yang memiliki sebuah sisi alas berbentuk segi-n
            dan sisi-sisi tegak berbentuk segitiga yang bertemu di satu titik yang disebut{" "}
            <strong className="text-yellow-300">titik puncak (T)</strong>.
          </p>
        </div>

        <p className="text-white/60 text-xs">Limas diberi nama berdasarkan bentuk alasnya:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { nama: "Limas Segitiga", alas: "Segitiga", titik: 4, rusuk: 6, sisi: 4, icon: "△" },
            { nama: "Limas Segiempat", alas: "Segiempat", titik: 5, rusuk: 8, sisi: 5, icon: "□" },
            { nama: "Limas Segilima", alas: "Segilima", titik: 6, rusuk: 10, sisi: 6, icon: "⬠" },
            { nama: "Limas Segienam", alas: "Segienam", titik: 7, rusuk: 12, sisi: 7, icon: "⬡" },
          ].map((j, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1">
              <p className="text-white font-semibold">{j.icon} {j.nama}</p>
              <p className="text-slate-400">Alas: {j.alas}</p>
              <p className="text-cyan-300">Titik sudut: {j.titik}</p>
              <p className="text-orange-300">Rusuk: {j.rusuk}</p>
              <p className="text-green-300">Sisi: {j.sisi}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3 text-xs text-white/80 space-y-1">
          <p className="text-cyan-300 font-semibold">📐 Pola umum untuk limas segi-n:</p>
          <p>• Titik sudut = <InlineMath math="n + 1" /></p>
          <p>• Rusuk = <InlineMath math="2n" /></p>
          <p>• Sisi = <InlineMath math="n + 1" /></p>
        </div>
      </div>
    ),
  },
  {
    title: "Unsur-Unsur Limas Segiempat",
    icon: "🔍",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/65 text-xs">Kita akan fokus pada <strong className="text-white">Limas Segiempat T.ABCD</strong> sebagai model utama.</p>

        <div className="space-y-3">
          <div className="bg-slate-800/60 border border-orange-700/30 rounded-lg p-3">
            <p className="text-orange-300 font-semibold text-xs mb-2">1. Titik Sudut (5 buah)</p>
            <TitikSudutLimasSVG />
            <p className="text-white/65 text-xs">Empat titik sudut alas (A, B, C, D) dan satu <strong className="text-yellow-300">titik puncak T</strong>.</p>
          </div>

          <div className="bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3">
            <p className="text-cyan-300 font-semibold text-xs mb-2">2. Rusuk (8 buah)</p>
            <RusukLimasSVG />
            <div className="mt-2 space-y-1 text-xs text-white/70">
              <p>• <strong className="text-cyan-300">Rusuk alas (4):</strong> AB, BC, CD, DA — membentuk persegi/persegi panjang</p>
              <p>• <strong className="text-orange-300">Rusuk tegak (4):</strong> TA, TB, TC, TD — menghubungkan alas ke puncak</p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-green-700/30 rounded-lg p-3">
            <p className="text-green-300 font-semibold text-xs mb-2">3. Sisi / Bidang (5 buah)</p>
            <SisiLimasSVG />
            <div className="mt-2 space-y-1 text-xs text-white/70">
              <p>• <strong className="text-blue-300">Sisi alas (1):</strong> ABCD — berbentuk persegi/persegi panjang</p>
              <p>• <strong className="text-purple-300">Sisi tegak (4):</strong> TAB, TBC, TCD, TDA — semuanya berbentuk segitiga</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Tinggi Limas & Apotema",
    icon: "📏",
    content: (
      <div className="space-y-4 font-body">
        <ApotemaLimasSVG />

        <div className="space-y-3">
          <div className="bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">Tinggi Limas (t)</p>
            <p className="text-white/75">Jarak tegak lurus dari titik puncak T ke bidang alas. Garis ini selalu <strong className="text-cyan-200">tegak lurus (⊥) dengan alas</strong> dan titik kakinya disebut titik O (pusat alas).</p>
          </div>

          <div className="bg-slate-800/60 border border-orange-700/30 rounded-lg p-3 text-xs space-y-2">
            <p className="text-orange-300 font-semibold">Apotema Sisi Tegak (l)</p>
            <p className="text-white/75">Tinggi segitiga pada bidang tegak, diukur dari puncak T ke titik tengah rusuk alas. Hubungannya dengan tinggi limas:</p>
            <div className="bg-slate-900/60 rounded p-2">
              <BlockMath math="l = \sqrt{t^2 + \left(\frac{s}{2}\right)^2}" />
            </div>
            <p className="text-white/50">di mana <InlineMath math="s" /> = panjang sisi alas</p>
          </div>

          <div className="bg-yellow-950/40 border border-yellow-700/30 rounded-lg p-3 text-xs space-y-1">
            <p className="text-yellow-300 font-semibold">💡 Ingat perbedaannya!</p>
            <p className="text-white/70">• <strong className="text-cyan-300">t</strong> = tinggi limas → dipakai untuk menghitung <strong>Volume</strong></p>
            <p className="text-white/70">• <strong className="text-orange-300">l (apotema)</strong> = tinggi segitiga → dipakai untuk menghitung <strong>Luas Permukaan</strong></p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Jaring-Jaring Limas",
    icon: "📐",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/65 text-xs">Jaring-jaring adalah rangkaian bidang datar yang jika dilipat membentuk sebuah limas. Pilih jenis limas lalu tekan <strong className="text-orange-300">Bongkar</strong> untuk melihat animasinya!</p>
        <JaringLimasInteraktif />
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-white/70 space-y-1.5">
          <p className="text-white/85 font-semibold">Susunan bidang pada jaring-jaring limas:</p>
          <p>✓ <strong className="text-blue-300">Limas Segitiga</strong> — 1 alas segitiga + 3 sisi segitiga = <span className="text-yellow-300">4 bidang</span></p>
          <p>✓ <strong className="text-purple-300">Limas Segiempat</strong> — 1 alas persegi + 4 sisi segitiga = <span className="text-yellow-300">5 bidang</span></p>
          <p>✓ <strong className="text-green-300">Limas Segilima</strong> — 1 alas segilima + 5 sisi segitiga = <span className="text-yellow-300">6 bidang</span></p>
          <p className="text-white/50 pt-0.5">Semua segitiga sisi terhubung ke satu rusuk alas dan bertemu di titik puncak saat dilipat.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Luas Permukaan Limas",
    icon: "🎨",
    content: (
      <div className="space-y-4 font-body">
        <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-sm text-white/85">
          <p>Luas permukaan limas = jumlah seluruh luas bidang yang membungkusnya.</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
            <p className="text-cyan-300 font-semibold text-xs">Rumus Umum:</p>
            <BlockMath math="L = L_{\text{alas}} + \Sigma L_{\text{segitiga}}" />
            <p className="text-white/50 text-xs">= Luas alas + jumlah seluruh luas bidang tegak</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
            <p className="text-orange-300 font-semibold text-xs">Untuk Limas Segiempat Beraturan (alas persegi, s × s):</p>
            <BlockMath math="L_{\text{alas}} = s^2" />
            <BlockMath math="L_{\text{satu segitiga}} = \frac{1}{2} \times s \times l" />
            <BlockMath math="L = s^2 + 4 \times \frac{1}{2} \times s \times l = s^2 + 2sl" />
            <div className="bg-orange-950/50 border border-orange-700/40 rounded p-2">
              <BlockMath math="\boxed{L = s^2 + 2sl}" />
            </div>
            <p className="text-white/50 text-xs">dengan <InlineMath math="l" /> = apotema sisi tegak = <InlineMath math="\sqrt{t^2 + \left(\frac{s}{2}\right)^2}" /></p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
            <p className="text-green-300 font-semibold text-xs">Untuk Limas Segitiga Sama Sisi (alas segitiga sama sisi, sisi a):</p>
            <BlockMath math="L_{\text{alas}} = \frac{1}{4}a^2\sqrt{3}" />
            <BlockMath math="L_{\text{satu segitiga}} = \frac{1}{2} \times a \times l" />
            <BlockMath math="L = \frac{1}{4}a^2\sqrt{3} + \frac{3}{2}al" />
          </div>

          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p>🎯 <strong className="text-white">Satuan luas:</strong></p>
            <p>• Jika <InlineMath math="s" /> dalam cm → Luas dalam <InlineMath math="\text{cm}^2" /></p>
            <p>• Jika <InlineMath math="s" /> dalam m → Luas dalam <InlineMath math="\text{m}^2" /></p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Volume Limas",
    icon: "📦",
    content: (
      <div className="space-y-4 font-body">
        <WaterLimasAnimation />
        <div className="bg-blue-950/50 border border-blue-700/40 rounded-lg p-3 text-sm text-white/85 leading-relaxed">
          <p>Volume limas = <strong className="text-cyan-300">sepertiga</strong> dari volume prisma dengan alas dan tinggi yang sama.</p>
          <p className="text-xs text-white/50 mt-1">Dapat dibuktikan dengan mengisi limas ke dalam prisma: dibutuhkan 3 limas untuk mengisi 1 prisma.</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
            <p className="text-cyan-300 font-semibold text-xs">Rumus Umum:</p>
            <BlockMath math="\boxed{V = \frac{1}{3} \times L_{\text{alas}} \times t}" />
            <p className="text-white/50 text-xs">dengan <InlineMath math="t" /> = tinggi limas (jarak puncak ke alas)</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
            <p className="text-yellow-300 font-semibold text-xs">Untuk berbagai jenis alas:</p>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex justify-between border-b border-slate-700 pb-1">
                <span>Alas persegi (s × s):</span>
                <InlineMath math="V = \frac{1}{3}s^2 t" />
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-1">
                <span>Alas persegi panjang (p × l):</span>
                <InlineMath math="V = \frac{1}{3}plt" />
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-1">
                <span>Alas segitiga (½ × a × t₀):</span>
                <InlineMath math="V = \frac{1}{6}a \cdot t_0 \cdot t" />
              </div>
              <div className="flex justify-between">
                <span>Alas segitiga sama sisi (a):</span>
                <InlineMath math="V = \frac{a^2\sqrt{3}}{12}t" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p>🎯 <strong className="text-white">Satuan volume:</strong></p>
            <p>• Jika <InlineMath math="s" /> dan <InlineMath math="t" /> dalam cm → Volume dalam <InlineMath math="\text{cm}^3" /></p>
            <p>• <InlineMath math="1 \text{ m}^3 = 1.000.000 \text{ cm}^3 = 10^6 \text{ cm}^3" /></p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Kesimpulan — Rumus Lengkap Limas",
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-violet-300 border-r border-slate-700 text-left">Besaran</th>
              <th className="px-3 py-2 text-violet-300 border-r border-slate-700">Rumus (Limas Segiempat Beraturan)</th>
              <th className="px-3 py-2 text-violet-300">Keterangan</th>
            </tr></thead>
            <tbody>
              {[
                ["Titik sudut", "n + 1", "n = banyak sisi alas"],
                ["Rusuk", "2n", "n alas + n tegak"],
                ["Sisi", "n + 1", "1 alas + n segitiga"],
                ["Apotema tegak", "l = √(t² + (s/2)²)", "Pythagoras 3D"],
                ["Luas alas", "L_a = s²", "persegi"],
                ["Luas satu Δ tegak", "L_Δ = ½ × s × l", "segitiga"],
                ["Luas permukaan", "L = s² + 2sl", "alas + 4 segitiga"],
                ["Volume", "V = ⅓ × s² × t", "sepertiga prisma"],
              ].map(([b, r, c], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{r}</td>
                  <td className="px-3 py-2 text-white/55 text-left">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-xs text-violet-200 space-y-1">
          <p>🚀 <strong>Kunci utama limas:</strong> Ada <strong className="text-yellow-300">dua variabel penting: s (sisi alas) dan t (tinggi)</strong>.</p>
          <p>Untuk luas permukaan, cari dulu <InlineMath math="l" /> (apotema) menggunakan Teorema Pythagoras.</p>
          <p>Untuk volume, cukup gunakan <InlineMath math="t" /> dan <InlineMath math="L_{\text{alas}}" />.</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   CONTOH SOAL — LUAS PERMUKAAN
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const luasExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah limas segiempat beraturan memiliki alas berbentuk persegi dengan sisi <InlineMath math="10 \text{ cm}" /> dan apotema sisi tegak <InlineMath math="13 \text{ cm}" />.</p>
        <p>Hitunglah luas permukaan limas tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="L_{\text{alas}} = s^2 = 10^2 = 100 \text{ cm}^2" />
          <BlockMath math="L_{\text{tegak}} = 4 \times \frac{1}{2} \times s \times l = 4 \times \frac{1}{2} \times 10 \times 13 = 260 \text{ cm}^2" />
          <BlockMath math="L = 100 + 260 = 360 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Luas permukaan = <InlineMath math="360 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Limas segiempat beraturan T.ABCD memiliki alas persegi dengan sisi <InlineMath math="12 \text{ cm}" /> dan tinggi limas <InlineMath math="8 \text{ cm}" />.</p>
        <p>Tentukan: (a) apotema sisi tegak, (b) luas permukaan limas.</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Apotema sisi tegak:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="l = \sqrt{t^2 + \left(\frac{s}{2}\right)^2} = \sqrt{8^2 + 6^2} = \sqrt{64 + 36} = \sqrt{100} = 10 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Luas permukaan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="L_{\text{alas}} = 12^2 = 144 \text{ cm}^2" />
          <BlockMath math="L_{\text{tegak}} = 4 \times \frac{1}{2} \times 12 \times 10 = 240 \text{ cm}^2" />
          <BlockMath math="L = 144 + 240 = 384 \text{ cm}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold text-sm">✅ <InlineMath math="l = 10 \text{ cm}" />, <InlineMath math="L = 384 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tenda pramuka berbentuk limas segiempat beraturan. Alas tenda berupa persegi dengan sisi <InlineMath math="3 \text{ m}" /> dan tinggi tenda <InlineMath math="2 \text{ m}" />.</p>
        <p>Sisi tegak tenda terbuat dari kain seharga <InlineMath math="Rp\,85.000/\text{m}^2" />. Alas tidak menggunakan kain.</p>
        <p>Berapa total biaya kain untuk membuat tenda tersebut?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Cari apotema sisi tegak:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="l = \sqrt{2^2 + \left(\frac{3}{2}\right)^2} = \sqrt{4 + 2{,}25} = \sqrt{6{,}25} = 2{,}5 \text{ m}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Hitung luas kain (hanya 4 sisi tegak):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L_{\text{kain}} = 4 \times \frac{1}{2} \times 3 \times 2{,}5 = 4 \times 3{,}75 = 15 \text{ m}^2" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Hitung biaya:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Biaya} = 15 \times 85.000 = Rp\,1.275.000" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Apotema = 2,5 m</p>
          <p className="text-white/80">• Luas kain = 15 m²</p>
          <p className="text-white/80">• Total biaya = <strong className="text-yellow-300">Rp 1.275.000</strong></p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   CONTOH SOAL — VOLUME
───────────────────────────────────────────────────────────── */
const volExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah limas segiempat beraturan memiliki alas persegi dengan sisi <InlineMath math="6 \text{ cm}" /> dan tinggi <InlineMath math="8 \text{ cm}" />.</p>
        <p>Hitunglah volume limas tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="V = \frac{1}{3} \times s^2 \times t = \frac{1}{3} \times 6^2 \times 8 = \frac{1}{3} \times 36 \times 8 = 96 \text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume = <InlineMath math="96 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Volume sebuah limas segiempat beraturan adalah <InlineMath math="192 \text{ cm}^3" /> dan tingginya <InlineMath math="12 \text{ cm}" />.</p>
        <p>Tentukan: (a) panjang sisi alasnya, (b) luas permukaannya jika apotema <InlineMath math="10 \text{ cm}" />.</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Panjang sisi alas:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1">
          <BlockMath math="V = \frac{1}{3} s^2 t \Rightarrow 192 = \frac{1}{3} \times s^2 \times 12" />
          <BlockMath math="192 = 4s^2 \Rightarrow s^2 = 48 \Rightarrow s = 4\sqrt{3} \approx 6{,}93 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Luas permukaan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="L_{\text{alas}} = s^2 = 48 \text{ cm}^2" />
          <BlockMath math="L_{\text{tegak}} = 4 \times \frac{1}{2} \times 4\sqrt{3} \times 10 = 80\sqrt{3} \approx 138{,}6 \text{ cm}^2" />
          <BlockMath math="L = 48 + 80\sqrt{3} \approx 186{,}6 \text{ cm}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ <InlineMath math="s = 4\sqrt{3} \text{ cm}" />, <InlineMath math="L \approx 186{,}6 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah piramida mainan terbuat dari tanah liat berbentuk limas segiempat beraturan dengan sisi alas <InlineMath math="9 \text{ cm}" /> dan rusuk tegak <InlineMath math="12 \text{ cm}" />.</p>
        <p>(a) Tentukan tinggi limas.</p>
        <p>(b) Tentukan volume limas.</p>
        <p>(c) Jika berat tanah liat <InlineMath math="2{,}5 \text{ gram/cm}^3" />, berapa berat piramida tersebut?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">(a) Tinggi limas:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p className="text-white/60">Rusuk tegak (TA = 12 cm) menghubungkan puncak T ke sudut alas A.</p>
          <p className="text-white/60">Jarak O ke A (diagonal alas / 2) = <InlineMath math="\frac{s\sqrt{2}}{2} = \frac{9\sqrt{2}}{2}" /></p>
          <BlockMath math="t = \sqrt{TA^2 - OA^2} = \sqrt{12^2 - \left(\frac{9\sqrt{2}}{2}\right)^2}" />
          <BlockMath math="= \sqrt{144 - \frac{81 \times 2}{4}} = \sqrt{144 - 40{,}5} = \sqrt{103{,}5} \approx 10{,}17 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">(b) Volume:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="V = \frac{1}{3} \times 9^2 \times \sqrt{103{,}5} \approx \frac{1}{3} \times 81 \times 10{,}17 \approx 274{,}6 \text{ cm}^3" />
        </div>
        <p className="text-red-400 font-semibold">(c) Berat:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="m = 274{,}6 \times 2{,}5 \approx 686{,}5 \text{ gram}" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Tinggi ≈ 10,17 cm</p>
          <p className="text-white/80">• Volume ≈ 274,6 cm³</p>
          <p className="text-white/80">• Berat ≈ <strong className="text-yellow-300">686,5 gram</strong></p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD
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
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SLIDES DATA
───────────────────────────────────────────────────────────── */
type Slide = { icon: string; title: string; content: React.ReactNode };

const slides: Slide[] = [
  {
    icon: "🏔️",
    title: "Pengantar",
    content: (
      <div className="space-y-4 text-sm font-body text-white/75 leading-relaxed">
        <ThreeLimas />
        <p>
          Dari piramida Mesir kuno hingga atap rumah yang runcing, bentuk{" "}
          <strong className="text-violet-300">limas</strong> ada di mana-mana! Pelajari semua tentang
          limas — mulai dari unsur-unsurnya, jaring-jaring interaktif, hingga cara menghitung{" "}
          <strong className="text-yellow-300">luas permukaan</strong> dan{" "}
          <strong className="text-green-300">volume</strong>-nya.
        </p>
      </div>
    ),
  },
  {
    icon: "🏔️",
    title: "Pengertian & Jenis Limas",
    content: sections[0].content,
  },
  {
    icon: "●",
    title: "Unsur — Titik Sudut",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <p className="text-white/65 text-xs">Fokus pada <strong className="text-white">Limas Segiempat T.ABCD</strong> sebagai model utama.</p>
        <div className="bg-slate-800/60 border border-orange-700/30 rounded-lg p-3">
          <p className="text-orange-300 font-semibold text-xs mb-2">1. Titik Sudut (5 buah)</p>
          <TitikSudutLimasSVG />
          <p className="text-white/65 text-xs">Empat titik sudut alas (A, B, C, D) dan satu <strong className="text-yellow-300">titik puncak T</strong>.</p>
        </div>
        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3 text-xs text-white/70 space-y-1">
          <p className="text-cyan-300 font-semibold">📐 Pola umum limas segi-n:</p>
          <p>• Titik sudut = <InlineMath math="n + 1" /></p>
          <p>• Rusuk = <InlineMath math="2n" /></p>
          <p>• Sisi = <InlineMath math="n + 1" /></p>
        </div>
      </div>
    ),
  },
  {
    icon: "⬛",
    title: "Unsur — Rusuk",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3">
          <p className="text-cyan-300 font-semibold text-xs mb-2">2. Rusuk (8 buah)</p>
          <RusukLimasSVG />
          <div className="mt-2 space-y-1 text-xs text-white/70">
            <p>• <strong className="text-cyan-300">Rusuk alas (4):</strong> AB, BC, CD, DA — membentuk persegi/persegi panjang</p>
            <p>• <strong className="text-orange-300">Rusuk tegak (4):</strong> TA, TB, TC, TD — menghubungkan alas ke puncak</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "⬜",
    title: "Unsur — Sisi",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-green-700/30 rounded-lg p-3">
          <p className="text-green-300 font-semibold text-xs mb-2">3. Sisi / Bidang (5 buah)</p>
          <SisiLimasSVG />
          <div className="mt-2 space-y-1 text-xs text-white/70">
            <p>• <strong className="text-blue-300">Sisi alas (1):</strong> ABCD — berbentuk persegi/persegi panjang</p>
            <p>• <strong className="text-purple-300">Sisi tegak (4):</strong> TAB, TBC, TCD, TDA — semuanya berbentuk segitiga</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "📏",
    title: "Tinggi Limas & Apotema",
    content: sections[2].content,
  },
  {
    icon: "📐",
    title: "Jaring-Jaring Limas",
    content: sections[3].content,
  },
  {
    icon: "🎨",
    title: "Luas Permukaan Limas",
    content: sections[4].content,
  },
  {
    icon: "📦",
    title: "Volume Limas",
    content: sections[5].content,
  },
  {
    icon: "📊",
    title: "Kesimpulan — Rumus Lengkap",
    content: sections[6].content,
  },
  {
    icon: "📝",
    title: "Contoh Soal — Luas Permukaan",
    content: (
      <div className="flex flex-col gap-3">
        {luasExamples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} prefix="LUAS" />)}
      </div>
    ),
  },
  {
    icon: "📝",
    title: "Contoh Soal — Volume",
    content: (
      <div className="flex flex-col gap-3">
        {volExamples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} prefix="VOLUME" />)}
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const LimasPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const total = slides.length;

  const goNext = () => { playPopSound(); setCurrentSlide(s => Math.min(s + 1, total - 1)); };
  const goPrev = () => { playPopSound(); setCurrentSlide(s => Math.max(s - 1, 0)); };

  const slide = slides[currentSlide];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <Triangle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          LIMAS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Bangun Ruang Sisi Datar</p>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { playPopSound(); setCurrentSlide(i); }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === currentSlide
                  ? "w-6 h-2.5 bg-primary"
                  : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Slide card */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden mb-4">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-white/5">
            <span className="flex items-center gap-2">
              <span className="text-lg">{slide.icon}</span>
              <span className="font-display text-sm font-semibold text-white">{slide.title}</span>
            </span>
            <span className="text-xs text-muted-foreground font-body">{currentSlide + 1} / {total}</span>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold font-display
              text-white/70 hover:text-white hover:border-primary/60 hover:bg-primary/10
              disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            ← Sebelumnya
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex-1 py-2.5 rounded-lg border border-primary/60 bg-primary/15 text-sm font-semibold font-display
              text-primary hover:bg-primary/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Selanjutnya →
          </button>
        </div>

        <div className="mt-2 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimasPage;
