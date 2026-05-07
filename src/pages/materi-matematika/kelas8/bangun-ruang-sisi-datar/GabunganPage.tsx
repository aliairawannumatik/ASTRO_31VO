import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─────────────────────────────────────────────────────────────
   SVG 3D MATH UTILITIES
───────────────────────────────────────────────────────────── */
type GV3 = [number, number, number];
type GV2 = [number, number];
const gRotX = (v: GV3, a: number): GV3 => [v[0], v[1]*Math.cos(a)-v[2]*Math.sin(a), v[1]*Math.sin(a)+v[2]*Math.cos(a)];
const gRotY = (v: GV3, a: number): GV3 => [v[0]*Math.cos(a)+v[2]*Math.sin(a), v[1], -v[0]*Math.sin(a)+v[2]*Math.cos(a)];
const gProj = (v: GV3, fov=420, s=1.1): GV2 => { const tz=v[2]+fov; return [(v[0]*fov*s)/tz,(v[1]*fov*s)/tz]; };

/* ── shape data factories ── */
interface GFace { idx: number[]; color: string; label: string; }

// BALOK + LIMAS: box (blue-indigo) with pyramid on top (rose)
function makeBalokLimasData(p: number, l: number, tb: number, tl: number) {
  const hy = (tb + tl) / 2;
  const ytop = -hy + tl;   // y at top of balok / base of limas
  const ybot = hy;          // y at bottom of balok
  const hp = p/2, hl = l/2;
  const verts: GV3[] = [
    [-hp, ytop, +hl], [+hp, ytop, +hl], [+hp, ybot, +hl], [-hp, ybot, +hl], // front face 0-3
    [-hp, ytop, -hl], [+hp, ytop, -hl], [+hp, ybot, -hl], [-hp, ybot, -hl], // back  face 4-7
    [  0,  -hy,   0],                                                          // apex  V8
  ];
  const faces: GFace[] = [
    { idx:[0,1,2,3], color:"#6366f1", label:"BALOK" },
    { idx:[5,4,7,6], color:"#4f46e5", label:"" },
    { idx:[4,0,3,7], color:"#818cf8", label:"" },
    { idx:[1,5,6,2], color:"#6366f1", label:"" },
    { idx:[3,2,6,7], color:"#312e81", label:"" },
    { idx:[0,1,8],   color:"#f43f5e", label:"LIMAS" },
    { idx:[1,5,8],   color:"#fb7185", label:"" },
    { idx:[5,4,8],   color:"#e11d48", label:"" },
    { idx:[4,0,8],   color:"#fda4af", label:"" },
  ];
  return { verts, faces };
}

// KUBUS + LIMAS: cube (sky-blue) with pyramid on top (amber)
function makeKubusLimasData(s: number, tl: number) {
  const p = s, l = s, tb = s;
  const hy = (tb + tl) / 2;
  const ytop = -hy + tl;
  const ybot = hy;
  const hp = p/2, hl = l/2;
  const verts: GV3[] = [
    [-hp, ytop, +hl], [+hp, ytop, +hl], [+hp, ybot, +hl], [-hp, ybot, +hl],
    [-hp, ytop, -hl], [+hp, ytop, -hl], [+hp, ybot, -hl], [-hp, ybot, -hl],
    [  0,  -hy,   0],
  ];
  const faces: GFace[] = [
    { idx:[0,1,2,3], color:"#0ea5e9", label:"KUBUS" },
    { idx:[5,4,7,6], color:"#0284c7", label:"" },
    { idx:[4,0,3,7], color:"#38bdf8", label:"" },
    { idx:[1,5,6,2], color:"#0ea5e9", label:"" },
    { idx:[3,2,6,7], color:"#075985", label:"" },
    { idx:[0,1,8],   color:"#f59e0b", label:"LIMAS" },
    { idx:[1,5,8],   color:"#fbbf24", label:"" },
    { idx:[5,4,8],   color:"#d97706", label:"" },
    { idx:[4,0,8],   color:"#fcd34d", label:"" },
  ];
  return { verts, faces };
}

// BALOK BESAR + BALOK KECIL: large box (indigo) with small box (emerald) on top, centered
function makeDuaBalokData(pb: number, l: number, tb: number, ps: number, ts: number) {
  const hy = (tb + ts) / 2;
  const yj  = -hy + ts;   // junction: top of large / bottom of small
  const ybot = hy;
  const ytop = -hy;
  const hb = pb/2, hs = ps/2, hl = l/2;
  const verts: GV3[] = [
    // Large balok V0-V7
    [-hb, yj,   +hl], [+hb, yj,   +hl], [+hb, ybot, +hl], [-hb, ybot, +hl],
    [-hb, yj,   -hl], [+hb, yj,   -hl], [+hb, ybot, -hl], [-hb, ybot, -hl],
    // Small balok V8-V15
    [-hs, ytop, +hl], [+hs, ytop, +hl], [+hs, yj,   +hl], [-hs, yj,   +hl],
    [-hs, ytop, -hl], [+hs, ytop, -hl], [+hs, yj,   -hl], [-hs, yj,   -hl],
  ];
  const faces: GFace[] = [
    // Large balok (indigo) — no top face (hidden under small balok)
    { idx:[0,1,2,3], color:"#6366f1", label:"BALOK\nBESAR" },
    { idx:[5,4,7,6], color:"#4f46e5", label:"" },
    { idx:[4,0,3,7], color:"#818cf8", label:"" },
    { idx:[1,5,6,2], color:"#6366f1", label:"" },
    { idx:[3,2,6,7], color:"#312e81", label:"" },
    // Ledge: exposed top of large balok on left & right of small balok
    { idx:[4,0,11,15], color:"#818cf8", label:"" },  // left ledge
    { idx:[1,5,14,10], color:"#818cf8", label:"" },  // right ledge
    // Small balok (emerald) — no bottom face
    { idx:[8,9,10,11],  color:"#10b981", label:"BALOK\nKECIL" },
    { idx:[13,12,15,14],color:"#059669", label:"" },
    { idx:[12,8,11,15], color:"#34d399", label:"" },
    { idx:[9,13,14,10], color:"#10b981", label:"" },
    { idx:[8,9,13,12],  color:"#6ee7b7", label:"" },
  ];
  return { verts, faces };
}

/* ── generic auto-rotating combined shape component ── */
const RotatingGabungan3D = ({
  verts, faces, label, initRy = 35, speed = 0.20,
}: {
  verts: GV3[]; faces: GFace[]; label: string; initRy?: number; speed?: number;
}) => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(initRy);
  const [isDragging, setIsDragging] = useState(false);
  const isDragRef = useRef(false);
  const dragRef   = useRef({ sx:0, sy:0, bx:-22, by: initRy });
  const tickRef   = useRef(initRy * 4);
  const rotYRef   = useRef(initRy);
  const rafRef    = useRef<number|null>(null);

  useEffect(() => {
    const animate = () => {
      if (!isDragRef.current) {
        tickRef.current += 1;
        rotYRef.current += speed;
        const rx = -18 + Math.sin(tickRef.current * 0.011) * 16;
        setRotY(rotYRef.current);
        setRotX(rx);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [speed]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragRef.current = true; setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragRef.current) return;
    const ny = dragRef.current.by - (e.clientX - dragRef.current.sx) * 0.55;
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
    const ny = dragRef.current.by - (t.clientX - dragRef.current.sx) * 0.55;
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
  const tfVerts = verts.map(v => gRotX(gRotY(v, ry), rx));
  const pverts: GV2[] = tfVerts.map(v => gProj(v));

  const sorted = faces.map(f => {
    const avgZ = f.idx.reduce((s,i)=>s+tfVerts[i][2],0)/f.idx.length;
    const pts2d = f.idx.map(i => pverts[i]);
    return { ...f, avgZ, pts2d };
  }).sort((a,b) => b.avgZ - a.avgZ);

  const cx = 85, cy = 100;

  return (
    <div
      className="flex flex-col items-center bg-slate-900/60 border border-slate-700/50 rounded-xl py-2 px-1 select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab", flex:1, minWidth:0 }}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}
    >
      <span className="text-white/85 font-body font-bold text-center leading-tight mb-1" style={{ fontSize:13 }}>{label}</span>
      <svg viewBox="0 0 170 200" style={{ width:"100%", maxWidth:220, overflow:"visible" }}>
        {sorted.map((f, i) => {
          const pts = f.pts2d.map(([x,y]) => `${cx+x},${cy+y}`).join(" ");
          const mx  = f.pts2d.reduce((s,p)=>s+p[0],0)/f.pts2d.length;
          const my  = f.pts2d.reduce((s,p)=>s+p[1],0)/f.pts2d.length;
          return (
            <g key={i}>
              <polygon points={pts} fill={f.color} fillOpacity={1}
                stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} strokeLinejoin="round"/>
              {f.label && (
                <text x={cx+mx} y={cy+my+3} fill="white" fontSize={6.5} fontFamily="monospace"
                  fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                  style={{ pointerEvents:"none" }}>{f.label}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const { verts: blVerts, faces: blFaces } = makeBalokLimasData(68, 48, 44, 38);
const { verts: klVerts, faces: klFaces } = makeKubusLimasData(54, 40);
const { verts: dbVerts, faces: dbFaces } = makeDuaBalokData(70, 48, 40, 46, 30);

const ThreeGabungan3D = () => (
  <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 space-y-2">
    <p className="text-center text-yellow-300 font-body font-semibold" style={{ fontSize:13 }}>
      Berputar otomatis · Drag untuk memutar sendiri
    </p>
    <div className="flex gap-2">
      <RotatingGabungan3D verts={blVerts} faces={blFaces} label="Balok + Limas" initRy={35}/>
      <RotatingGabungan3D verts={klVerts} faces={klFaces} label="Kubus + Limas" initRy={55}/>
      <RotatingGabungan3D verts={dbVerts} faces={dbFaces} label="Balok Besar + Balok Kecil" initRy={42}/>
    </div>
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
      {[["#6366f1","Balok"],["#f43f5e","Limas"],["#0ea5e9","Kubus"],["#f59e0b","Limas (kubus)"],["#10b981","Balok Kecil"]].map(([c,l])=>(
        <div key={l} className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background:c }}/>
          <span className="text-white/45 font-body" style={{ fontSize:9 }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   SHARED DRAG HOOK
───────────────────────────────────────────────────────────── */
function useDrag3D(initRx: number, initRy: number) {
  const [rotX, setRotX] = useState(initRx);
  const [rotY, setRotY] = useState(initRy);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef({ sx: 0, sy: 0, bx: initRx, by: initRy });

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    ref.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    ref.current = { sx: t.clientX, sy: t.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(ref.current.by + (e.clientX - ref.current.sx) * 0.6);
    setRotX(ref.current.bx - (e.clientY - ref.current.sy) * 0.6);
  }, [isDragging]);
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setRotY(ref.current.by + (t.clientX - ref.current.sx) * 0.6);
    setRotX(ref.current.bx - (t.clientY - ref.current.sy) * 0.6);
  }, [isDragging]);
  const onMouseUp = useCallback(() => setIsDragging(false), []);
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

  return { rotX, rotY, isDragging, onMouseDown, onTouchStart };
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D — GABUNGAN BALOK + LIMAS
   A rectangular box (balok) with a pyramid (limas) on top.
───────────────────────────────────────────────────────────── */
const InteractiveBalokLimas = () => {
  const { rotX, rotY, isDragging, onMouseDown, onTouchStart } = useDrag3D(-28, 38);

  const BW = 100, BD = 55, BH = 52;
  const LH = 50;
  const TRANS = "transform 0.4s ease";

  const balokColor = { front: "#6366f1", side: "#4f46e5", top: "#818cf8", bottom: "#3730a3" };
  const limasColor = "#f43f5e";

  const face = (
    w: number, h: number, bg: string, opacity: number,
    transform: string, extra?: React.CSSProperties
  ) => (
    <div style={{
      position: "absolute", width: w, height: h,
      background: bg, opacity,
      border: `1.5px solid ${bg}`,
      borderRadius: 2,
      transformStyle: "preserve-3d",
      transform,
      backfaceVisibility: "hidden",
      ...extra,
    }} />
  );

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 space-y-3">
      <p className="text-white/50 text-[10px] text-center font-body">Drag untuk memutar 🔄</p>
      <div
        className="relative mx-auto select-none overflow-visible flex items-center justify-center"
        style={{ height: 200, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div style={{
          width: BW, height: BH + LH,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : TRANS,
        }}>
          {/* ── BALOK FACES ── */}
          {/* Front */}
          {face(BW, BH, balokColor.front, 0.7, `translateZ(${BD / 2}px) translateY(${LH}px)`)}
          {/* Back */}
          {face(BW, BH, balokColor.side, 0.45, `rotateY(180deg) translateZ(${BD / 2}px) translateY(${LH}px)`)}
          {/* Right */}
          <div style={{
            position: "absolute", width: BD, height: BH,
            left: BW, top: LH,
            background: balokColor.side,
            opacity: 0.55,
            border: `1.5px solid ${balokColor.side}`,
            transformStyle: "preserve-3d",
            transformOrigin: "0 50%",
            transform: "rotateY(90deg)",
          }} />
          {/* Left */}
          <div style={{
            position: "absolute", width: BD, height: BH,
            left: 0, top: LH,
            background: balokColor.side,
            opacity: 0.4,
            border: `1.5px solid ${balokColor.side}`,
            transformStyle: "preserve-3d",
            transformOrigin: "0 50%",
            transform: "rotateY(-90deg)",
          }} />
          {/* Bottom */}
          <div style={{
            position: "absolute", width: BW, height: BD,
            left: 0, top: BH + LH,
            background: balokColor.bottom,
            opacity: 0.35,
            border: `1.5px solid ${balokColor.bottom}`,
            transformStyle: "preserve-3d",
            transformOrigin: "50% 0",
            transform: "rotateX(90deg)",
          }} />
          {/* Top of balok (= base of limas, hidden inside) */}
          <div style={{
            position: "absolute", width: BW, height: BD,
            left: 0, top: LH,
            background: balokColor.top,
            opacity: 0.3,
            border: `1.5px solid ${balokColor.top}`,
            transformStyle: "preserve-3d",
            transformOrigin: "50% 0",
            transform: "rotateX(-90deg)",
          }} />

          {/* ── LIMAS FACES (apex at center-top, base = BW × BD) ── */}
          {/* Front triangle */}
          <div style={{
            position: "absolute",
            width: 0, height: 0,
            left: BW / 2, top: 0,
            borderLeft: `${BW / 2}px solid transparent`,
            borderRight: `${BW / 2}px solid transparent`,
            borderBottom: `${LH}px solid ${limasColor}`,
            opacity: 0.75,
            transform: `rotateX(-90deg) translateZ(${BD / 2}px)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
          }} />
          {/* Back triangle */}
          <div style={{
            position: "absolute",
            width: 0, height: 0,
            left: BW / 2, top: 0,
            borderLeft: `${BW / 2}px solid transparent`,
            borderRight: `${BW / 2}px solid transparent`,
            borderBottom: `${LH}px solid ${limasColor}`,
            opacity: 0.45,
            transform: `rotateY(180deg) rotateX(-90deg) translateZ(${BD / 2}px)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
          }} />
          {/* Right triangle */}
          <div style={{
            position: "absolute",
            width: 0, height: 0,
            left: BW / 2, top: 0,
            borderLeft: `${BD / 2}px solid transparent`,
            borderRight: `${BD / 2}px solid transparent`,
            borderBottom: `${LH}px solid #fb7185`,
            opacity: 0.6,
            transform: `rotateY(90deg) rotateX(-90deg) translateZ(${BW / 2}px)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
          }} />
          {/* Left triangle */}
          <div style={{
            position: "absolute",
            width: 0, height: 0,
            left: BW / 2, top: 0,
            borderLeft: `${BD / 2}px solid transparent`,
            borderRight: `${BD / 2}px solid transparent`,
            borderBottom: `${LH}px solid #fb7185`,
            opacity: 0.5,
            transform: `rotateY(-90deg) rotateX(-90deg) translateZ(${BW / 2}px)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
          }} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {[
          { label: "Balok", color: "#6366f1" },
          { label: "Limas", color: "#f43f5e" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-white/50 text-[9px] font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D — GABUNGAN KUBUS + PRISMA (RUMAH)
   A cube (kubus) base with a triangular prism roof (prisma).
───────────────────────────────────────────────────────────── */
const InteractiveRumah = () => {
  const { rotX, rotY, isDragging, onMouseDown, onTouchStart } = useDrag3D(-25, 42);

  const S = 72;
  const PH = 44;
  const TRANS = "transform 0.4s ease";
  const kubus = { front: "#6366f1", side: "#4f46e5", top: "#818cf8" };
  const atap = { front: "#f59e0b", side: "#d97706" };

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 space-y-3">
      <p className="text-white/50 text-[10px] text-center font-body">Drag untuk memutar 🔄</p>
      <div
        className="relative mx-auto select-none overflow-visible flex items-center justify-center"
        style={{ height: 200, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div style={{
          width: S, height: S + PH,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : TRANS,
        }}>
          {/* ── KUBUS FACES ── */}
          {/* Front */}
          <div style={{
            position: "absolute", width: S, height: S, left: 0, top: PH,
            background: kubus.front, opacity: 0.7, border: `1.5px solid ${kubus.front}`,
            transformStyle: "preserve-3d",
            transform: `translateZ(${S / 2}px)`,
          }} />
          {/* Back */}
          <div style={{
            position: "absolute", width: S, height: S, left: 0, top: PH,
            background: kubus.side, opacity: 0.4, border: `1.5px solid ${kubus.side}`,
            transformStyle: "preserve-3d",
            transform: `rotateY(180deg) translateZ(${S / 2}px)`,
          }} />
          {/* Right */}
          <div style={{
            position: "absolute", width: S, height: S, left: S, top: PH,
            background: kubus.side, opacity: 0.55, border: `1.5px solid ${kubus.side}`,
            transformStyle: "preserve-3d",
            transformOrigin: "0 50%",
            transform: "rotateY(90deg)",
          }} />
          {/* Left */}
          <div style={{
            position: "absolute", width: S, height: S, left: 0, top: PH,
            background: kubus.side, opacity: 0.4, border: `1.5px solid ${kubus.side}`,
            transformStyle: "preserve-3d",
            transformOrigin: "0 50%",
            transform: "rotateY(-90deg)",
          }} />
          {/* Bottom */}
          <div style={{
            position: "absolute", width: S, height: S, left: 0, top: S + PH,
            background: kubus.side, opacity: 0.3, border: `1.5px solid ${kubus.side}`,
            transformStyle: "preserve-3d",
            transformOrigin: "50% 0",
            transform: "rotateX(90deg)",
          }} />

          {/* ── ATAP PRISMA SEGITIGA ── */}
          {/* Front triangle (gable) */}
          <div style={{
            position: "absolute",
            width: 0, height: 0,
            left: S / 2, top: 0,
            borderLeft: `${S / 2}px solid transparent`,
            borderRight: `${S / 2}px solid transparent`,
            borderBottom: `${PH}px solid ${atap.front}`,
            opacity: 0.85,
            transform: `translateZ(${S / 2}px)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
          }} />
          {/* Back triangle (gable) */}
          <div style={{
            position: "absolute",
            width: 0, height: 0,
            left: S / 2, top: 0,
            borderLeft: `${S / 2}px solid transparent`,
            borderRight: `${S / 2}px solid transparent`,
            borderBottom: `${PH}px solid ${atap.front}`,
            opacity: 0.45,
            transform: `rotateY(180deg) translateZ(${S / 2}px)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
          }} />
          {/* Right roof slope */}
          <div style={{
            position: "absolute",
            width: S, height: Math.sqrt((S / 2) * (S / 2) + PH * PH),
            left: 0, top: 0,
            background: atap.side, opacity: 0.7,
            border: `1.5px solid ${atap.side}`,
            transformStyle: "preserve-3d",
            transformOrigin: "100% 100%",
            transform: `rotateY(90deg) translateZ(${S / 2}px) rotateX(${-Math.atan2(PH, S / 2) * 180 / Math.PI}deg)`,
          }} />
          {/* Left roof slope */}
          <div style={{
            position: "absolute",
            width: S, height: Math.sqrt((S / 2) * (S / 2) + PH * PH),
            left: 0, top: 0,
            background: atap.side, opacity: 0.55,
            border: `1.5px solid ${atap.side}`,
            transformStyle: "preserve-3d",
            transformOrigin: "0% 100%",
            transform: `rotateY(-90deg) rotateX(${-Math.atan2(PH, S / 2) * 180 / Math.PI}deg)`,
          }} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {[
          { label: "Kubus", color: "#6366f1" },
          { label: "Atap Prisma", color: "#f59e0b" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-white/50 text-[9px] font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D — GABUNGAN 2 BALOK (UNDAKAN / L-SHAPE)
   A large box (balok besar) with a smaller box (balok kecil)
   placed on top of one side.
───────────────────────────────────────────────────────────── */
const InteractiveDuaBalok = () => {
  const { rotX, rotY, isDragging, onMouseDown, onTouchStart } = useDrag3D(-22, 35);
  const TRANS = "transform 0.4s ease";

  const BW = 88, BD = 46, BH = 50;
  const SW = 50, SH = 40;

  const c1 = { f: "#6366f1", s: "#4f46e5", t: "#818cf8", b: "#3730a3" };
  const c2 = { f: "#f43f5e", s: "#e11d48", t: "#fb7185", b: "#9f1239" };

  const box = (
    w: number, h: number, d: number,
    offsetX: number, offsetY: number,
    color: typeof c1
  ) => (
    <>
      {/* Front */}
      <div style={{
        position: "absolute", width: w, height: h, left: offsetX, top: offsetY,
        background: color.f, opacity: 0.7, border: `1.5px solid ${color.f}`,
        transformStyle: "preserve-3d", transform: `translateZ(${d / 2}px)`,
      }} />
      {/* Back */}
      <div style={{
        position: "absolute", width: w, height: h, left: offsetX, top: offsetY,
        background: color.s, opacity: 0.4, border: `1.5px solid ${color.s}`,
        transformStyle: "preserve-3d", transform: `rotateY(180deg) translateZ(${d / 2}px)`,
      }} />
      {/* Right */}
      <div style={{
        position: "absolute", width: d, height: h, left: offsetX + w, top: offsetY,
        background: color.s, opacity: 0.55, border: `1.5px solid ${color.s}`,
        transformStyle: "preserve-3d", transformOrigin: "0 50%",
        transform: "rotateY(90deg)",
      }} />
      {/* Left */}
      <div style={{
        position: "absolute", width: d, height: h, left: offsetX, top: offsetY,
        background: color.s, opacity: 0.4, border: `1.5px solid ${color.s}`,
        transformStyle: "preserve-3d", transformOrigin: "0 50%",
        transform: "rotateY(-90deg)",
      }} />
      {/* Top */}
      <div style={{
        position: "absolute", width: w, height: d, left: offsetX, top: offsetY,
        background: color.t, opacity: 0.55, border: `1.5px solid ${color.t}`,
        transformStyle: "preserve-3d", transformOrigin: "50% 0",
        transform: "rotateX(-90deg)",
      }} />
      {/* Bottom */}
      <div style={{
        position: "absolute", width: w, height: d, left: offsetX, top: offsetY + h,
        background: color.b, opacity: 0.3, border: `1.5px solid ${color.b}`,
        transformStyle: "preserve-3d", transformOrigin: "50% 0",
        transform: "rotateX(90deg)",
      }} />
    </>
  );

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 space-y-3">
      <p className="text-white/50 text-[10px] text-center font-body">Drag untuk memutar 🔄</p>
      <div
        className="relative mx-auto select-none overflow-visible flex items-center justify-center"
        style={{ height: 200, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div style={{
          width: BW, height: BH + SH,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : TRANS,
        }}>
          {box(BW, BH, BD, 0, SH, c1)}
          {box(SW, SH, BD, 0, 0, c2)}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {[
          { label: "Balok Besar", color: "#6366f1" },
          { label: "Balok Kecil", color: "#f43f5e" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-white/50 text-[9px] font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SVGs — BANGUN RUANG GABUNGAN (used in later slides)
───────────────────────────────────────────────────────────── */
const BalokLimasSVG = () => (
  <svg width="210" height="185" viewBox="0 0 210 185" className="mx-auto">
    <defs>
      <linearGradient id="gbBalok" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="gbLimas" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <polygon points="30,150 130,150 130,95 30,95" fill="url(#gbBalok)" stroke="#818cf8" strokeWidth="1.5" />
    <polygon points="130,150 155,125 155,70 130,95" fill="#6366f1" fillOpacity="0.2" stroke="#818cf8" strokeWidth="1.5" />
    <polygon points="30,95 130,95 155,70 55,70" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.5" />
    <line x1="30" y1="150" x2="55" y2="125" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="125" x2="155" y2="125" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="125" x2="55" y2="70" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <text x="75" y="165" fill="#818cf8" fontSize="9" textAnchor="middle">p</text>
    <text x="155" y="112" fill="#818cf8" fontSize="9" textAnchor="middle">l</text>
    <text x="12" y="125" fill="#818cf8" fontSize="9" textAnchor="middle">t₁</text>
    <line x1="92" y1="22" x2="30" y2="95" stroke="#f43f5e" strokeWidth="1.8" />
    <line x1="92" y1="22" x2="130" y2="95" stroke="#f43f5e" strokeWidth="1.8" />
    <line x1="92" y1="22" x2="155" y2="70" stroke="#f43f5e" strokeWidth="1.8" />
    <line x1="92" y1="22" x2="55" y2="70" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7" />
    <polygon points="30,95 130,95 92,22" fill="url(#gbLimas)" stroke="#f43f5e" strokeWidth="1.5" />
    <polygon points="130,95 155,70 92,22" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1.5" />
    <circle cx="92" cy="22" r="3" fill="#fb7185" />
    <text x="88" y="16" fill="#fb7185" fontSize="9" fontFamily="monospace">T</text>
    <text x="168" y="45" fill="#fb7185" fontSize="9">t₂</text>
    <text x="105" y="180" fill="#818cf8" fontSize="8" textAnchor="middle">Balok + Limas Segiempat</text>
  </svg>
);

const KubusPrismaSVG = () => (
  <svg width="210" height="185" viewBox="0 0 210 185" className="mx-auto">
    <polygon points="30,155 110,155 110,95 30,95" fill="#6366f1" fillOpacity="0.35" stroke="#818cf8" strokeWidth="1.5" />
    <polygon points="110,155 135,130 135,70 110,95" fill="#6366f1" fillOpacity="0.2" stroke="#818cf8" strokeWidth="1.5" />
    <polygon points="30,95 110,95 135,70 55,70" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.5" />
    <line x1="30" y1="155" x2="55" y2="130" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="130" x2="135" y2="130" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="130" x2="55" y2="70" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="70" y1="45" x2="158" y2="45" stroke="#f59e0b" strokeWidth="1.8" />
    <polygon points="30,95 110,95 158,45 70,45" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.5" />
    <polygon points="110,95 135,70 158,45" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
    <polygon points="30,95 55,70 70,45" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7" />
    <polygon points="30,95 110,95 70,45" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
    {[[70,45],[158,45]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2" fill="#fcd34d" />
    ))}
    <text x="62" y="42" fill="#fcd34d" fontSize="9" fontFamily="monospace">P</text>
    <text x="160" y="42" fill="#fcd34d" fontSize="9" fontFamily="monospace">Q</text>
    <text x="105" y="177" fill="#818cf8" fontSize="8" textAnchor="middle">Kubus + Prisma Segitiga (Rumah)</text>
  </svg>
);

const DuaBalokSVG = () => (
  <svg width="215" height="175" viewBox="0 0 215 175" className="mx-auto">
    <polygon points="10,155 90,155 90,100 10,100" fill="#6366f1" fillOpacity="0.35" stroke="#818cf8" strokeWidth="1.5" />
    <polygon points="90,155 110,138 110,83 90,100" fill="#6366f1" fillOpacity="0.2" stroke="#818cf8" strokeWidth="1.5" />
    <polygon points="10,100 90,100 110,83 30,83" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.5" />
    <line x1="10" y1="155" x2="30" y2="138" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="30" y1="138" x2="110" y2="138" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="30" y1="138" x2="30" y2="83" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <polygon points="90,100 165,100 165,55 90,55" fill="#f43f5e" fillOpacity="0.35" stroke="#fb7185" strokeWidth="1.5" />
    <polygon points="165,100 185,83 185,38 165,55" fill="#f43f5e" fillOpacity="0.2" stroke="#fb7185" strokeWidth="1.5" />
    <polygon points="90,55 165,55 185,38 110,38" fill="#f43f5e" fillOpacity="0.3" stroke="#fb7185" strokeWidth="1.5" />
    <line x1="90" y1="100" x2="110" y2="83" stroke="#fb7185" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="110" y1="83" x2="185" y2="83" stroke="#fb7185" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="110" y1="83" x2="110" y2="38" stroke="#fb7185" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <text x="105" y="168" fill="#818cf8" fontSize="8" textAnchor="middle">Gabungan 2 Balok (Undakan)</text>
  </svg>
);

const LuasGabunganSVG = () => (
  <svg width="240" height="170" viewBox="0 0 240 170" className="mx-auto my-2">
    <defs>
      <style>{`
        @keyframes lgPulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .lg-b{animation:lgPulse 2s ease-in-out infinite;}
        .lg-l{animation:lgPulse 2s ease-in-out infinite 0.5s;}
        .lg-x{animation:lgPulse 2s ease-in-out infinite 1s;}
      `}</style>
    </defs>
    <polygon points="30,135 120,135 120,85 30,85" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.5" className="lg-b"/>
    <polygon points="120,135 140,118 140,68 120,85" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5" className="lg-b"/>
    <polygon points="30,85 120,85 140,68 50,68" fill="#6366f1" fillOpacity="0.25" stroke="#818cf8" strokeWidth="1.5" className="lg-b"/>
    <line x1="30" y1="135" x2="50" y2="118" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.4"/>
    <line x1="50" y1="118" x2="140" y2="118" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.4"/>
    <line x1="50" y1="118" x2="50" y2="68" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.4"/>
    <line x1="85" y1="38" x2="30" y2="85" stroke="#f43f5e" strokeWidth="1.8" className="lg-l"/>
    <line x1="85" y1="38" x2="120" y2="85" stroke="#f43f5e" strokeWidth="1.8" className="lg-l"/>
    <line x1="85" y1="38" x2="140" y2="68" stroke="#f43f5e" strokeWidth="1.8" className="lg-l"/>
    <line x1="85" y1="38" x2="50" y2="68" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" className="lg-l"/>
    <circle cx="85" cy="38" r="3" fill="#fb7185"/>
    <text x="200" y="55" fill="#94a3b8" fontSize="9" fontFamily="monospace">Bidang</text>
    <text x="200" y="68" fill="#22c55e" fontSize="9" fontFamily="monospace" className="lg-x">✓ terlihat</text>
    <text x="200" y="85" fill="#f43f5e" fontSize="9" fontFamily="monospace" className="lg-x">✗ tersembunyi</text>
    <line x1="30" y1="135" x2="120" y2="135" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="30" y1="135" x2="30" y2="85" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="120" y1="135" x2="140" y2="118" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="30" y1="85" x2="120" y2="85" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,3"/>
    <text x="120" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle">Alas limas = Atap balok (tidak dihitung 2x)</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const ExampleCard = ({ ex, idx }: { ex: Ex; idx: number }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            Soal {idx + 1} — {ex.level}
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

const examples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tugu berbentuk balok berukuran <InlineMath math="5 \times 5 \times 8" /> m dengan limas segiempat beraturan di atasnya (alas sama, tinggi limas 3 m).</p>
        <p>Hitunglah <strong>volume total</strong> tugu tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <BlockMath math="V_{\text{balok}} = 5 \times 5 \times 8 = 200\text{ m}^3" />
          <BlockMath math="V_{\text{limas}} = \tfrac{1}{3} \times 25 \times 3 = 25\text{ m}^3" />
          <BlockMath math="V_{\text{total}} = 200 + 25 = 225\text{ m}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume total = <InlineMath math="225\text{ m}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah miniatur rumah berbentuk kubus (s = 6 cm) sebagai badan dan prisma segitiga sama kaki sebagai atap (alas 6 cm, tinggi segitiga 4 cm, panjang atap 6 cm).</p>
        <p>Tentukan <strong>volume total</strong> miniatur rumah tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <BlockMath math="V_{\text{kubus}} = 6^3 = 216\text{ cm}^3" />
          <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 6 \times 4 = 12\text{ cm}^2" />
          <BlockMath math="V_{\text{prisma}} = 12 \times 6 = 72\text{ cm}^3" />
          <BlockMath math="V_{\text{total}} = 216 + 72 = 288\text{ cm}^3" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Volume total = <InlineMath math="288\text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Rumah miniatur terdiri dari balok (<InlineMath math="10 \times 8 \times 6" /> cm) dan atap prisma segitiga sama kaki (alas 10 cm, tinggi segitiga 4 cm, panjang 8 cm).</p>
        <p>Hitung <strong>luas permukaan yang terlihat dari luar</strong> (alas balok, 4 sisi balok, 2 segitiga atap, 2 sisi miring atap).</p>
        <p className="text-xs text-white/60">Sisi atas balok tertutup atap, tidak dihitung.</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold text-xs">Langkah 1 — Sisi balok yang terlihat (tanpa tutup atas):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="L_{\text{alas}} = 10 \times 8 = 80\text{ cm}^2" />
          <BlockMath math="L_{\text{4 sisi}} = 2(10\times6) + 2(8\times6) = 120 + 96 = 216\text{ cm}^2" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 2 — Atap prisma:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="L_{\triangle} = 2 \times \tfrac{1}{2} \times 10 \times 4 = 40\text{ cm}^2" />
          <p className="text-white/60">Apotema sisi miring atap = √(4²+5²) = √41 ≈ 6,4 cm</p>
          <BlockMath math="L_{\text{miring}} = 2 \times (6{,}4 \times 8) = 102{,}4\text{ cm}^2" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 3 — Total:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L_{\text{total}} = 80 + 216 + 40 + 102{,}4 = 438{,}4\text{ cm}^2" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-2 text-xs">
          <p className="text-red-300 font-semibold">✅ Luas permukaan ≈ <InlineMath math="438{,}4\text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   RUSUK GABUNGAN SVG
───────────────────────────────────────────────────────────── */
const RusukGabunganSVG = () => (
  <svg viewBox="0 0 320 210" className="w-full max-w-xs mx-auto">
    <defs>
      <style>{`
        @keyframes rgPulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .rg-shared{animation:rgPulse 1.8s ease-in-out infinite;}
        .rg-limas{animation:rgPulse 1.8s ease-in-out infinite 0.6s;}
      `}</style>
    </defs>
    {/* Balok body */}
    <polygon points="50,165 150,165 150,105 50,105" fill="#6366f1" fillOpacity="0.25" stroke="none"/>
    <polygon points="150,165 175,142 175,82 150,105" fill="#4f46e5" fillOpacity="0.18" stroke="none"/>
    <polygon points="50,105 150,105 175,82 75,82" fill="#818cf8" fillOpacity="0.22" stroke="none"/>
    {/* Balok edges - bottom 4 */}
    <line x1="50" y1="165" x2="150" y2="165" stroke="#818cf8" strokeWidth="2"/>
    <line x1="150" y1="165" x2="175" y2="142" stroke="#818cf8" strokeWidth="2"/>
    <line x1="50" y1="165" x2="75" y2="142" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="75" y1="142" x2="175" y2="142" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.5"/>
    {/* Balok vertical edges - 4 */}
    <line x1="50" y1="165" x2="50" y2="105" stroke="#818cf8" strokeWidth="2"/>
    <line x1="150" y1="165" x2="150" y2="105" stroke="#818cf8" strokeWidth="2"/>
    <line x1="175" y1="142" x2="175" y2="82" stroke="#818cf8" strokeWidth="2"/>
    <line x1="75" y1="142" x2="75" y2="82" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.5"/>
    {/* Shared edges (top of balok = base of limas) - highlighted */}
    <line x1="50" y1="105" x2="150" y2="105" stroke="#facc15" strokeWidth="2.5" className="rg-shared"/>
    <line x1="150" y1="105" x2="175" y2="82" stroke="#facc15" strokeWidth="2.5" className="rg-shared"/>
    <line x1="50" y1="105" x2="75" y2="82" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3" className="rg-shared"/>
    <line x1="75" y1="82" x2="175" y2="82" stroke="#facc15" strokeWidth="2.5" className="rg-shared"/>
    {/* Limas lateral edges - 4 */}
    <line x1="112" y1="35" x2="50" y2="105" stroke="#f43f5e" strokeWidth="2" className="rg-limas"/>
    <line x1="112" y1="35" x2="150" y2="105" stroke="#f43f5e" strokeWidth="2" className="rg-limas"/>
    <line x1="112" y1="35" x2="175" y2="82" stroke="#f43f5e" strokeWidth="2" className="rg-limas"/>
    <line x1="112" y1="35" x2="75" y2="82" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.7" className="rg-limas"/>
    {/* Apex dot */}
    <circle cx="112" cy="35" r="4" fill="#fb7185"/>
    {/* Vertices dots */}
    {[[50,165],[150,165],[50,105],[150,105],[175,82],[175,142]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="3.5" fill="#818cf8"/>
    ))}
    <circle cx="75" cy="82" r="3.5" fill="#818cf8" opacity="0.5"/>
    <circle cx="75" cy="142" r="3.5" fill="#818cf8" opacity="0.5"/>
    {/* Legend */}
    <line x1="195" y1="80" x2="215" y2="80" stroke="#818cf8" strokeWidth="2"/>
    <text x="220" y="84" fill="#818cf8" fontSize="9" fontFamily="monospace">Rusuk Balok (12)</text>
    <line x1="195" y1="98" x2="215" y2="98" stroke="#facc15" strokeWidth="2.5"/>
    <text x="220" y="102" fill="#facc15" fontSize="9" fontFamily="monospace">Rusuk Bersama (4)</text>
    <line x1="195" y1="116" x2="215" y2="116" stroke="#f43f5e" strokeWidth="2"/>
    <text x="220" y="120" fill="#f43f5e" fontSize="9" fontFamily="monospace">Rusuk Limas (4+4=8)</text>
    <text x="160" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle">Total rusuk gabungan = 12 + 8 − 4 = 16</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   JARING-JARING GABUNGAN INTERAKTIF (Balok + Limas)
───────────────────────────────────────────────────────────── */
const JaringGabunganInteraktif = () => {
  const [progress, setProgress] = useState(0);
  const [isNet, setIsNet]       = useState(false);
  const animRef    = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  const animateTo = (target: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startP = progressRef.current;
    const startT = performance.now();
    const dur = 700;
    const tick = (now: number) => {
      const raw  = Math.min((now - startT) / dur, 1);
      const ease = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
      const p    = startP + (target - startP) * ease;
      setProgress(p);
      progressRef.current = p;
      if (raw < 1) { animRef.current = requestAnimationFrame(tick); }
      else { setProgress(target); progressRef.current = target; setIsNet(target > 0.5); }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  /* 3D assembled view — fixed angle */
  const RX = -22 * Math.PI / 180;
  const RY =  35 * Math.PI / 180;
  const tfV = blVerts.map(v => gRotX(gRotY(v, RY), RX));
  const pV  = tfV.map(v => gProj(v, 380, 1.35));
  const cx3 = 200, cy3 = 148;
  const sorted3 = blFaces.map(f => {
    const avgZ  = f.idx.reduce((s, i) => s + tfV[i][2], 0) / f.idx.length;
    const pts2d = f.idx.map(i => pV[i]);
    return { ...f, avgZ, pts2d };
  }).sort((a, b) => b.avgZ - a.avgZ);

  /* 2D net face definitions — Balok+Limas segiempat */
  type NetFace = { pts: [number,number][]; color: string; label: string; isShared?: boolean };
  const netFaces: NetFace[] = [
    /* ── SharedFace (alas limas = tutup balok) ── */
    { pts:[[165,73],[235,73],[235,121],[165,121]], color:"#ef4444", label:"✗ Bidang Beririsan", isShared:true },
    /* ── 4 Limas triangles ── */
    { pts:[[165,73],[235,73],[200,37]],            color:"#f59e0b", label:"Δ Limas 1" },
    { pts:[[235,73],[235,121],[271,97]],           color:"#fbbf24", label:"Δ Limas 2" },
    { pts:[[165,73],[165,121],[129,97]],           color:"#d97706", label:"Δ Limas 3" },
    { pts:[[165,121],[235,121],[200,157]],         color:"#f97316", label:"Δ Limas 4" },
    /* ── 5 Balok faces (no top) ── */
    { pts:[[165,174],[235,174],[235,216],[165,216]], color:"#4f46e5", label:"Belakang" },
    { pts:[[165,216],[235,216],[235,258],[165,258]], color:"#6366f1", label:"Depan" },
    { pts:[[165,258],[235,258],[235,306],[165,306]], color:"#312e81", label:"Alas" },
    { pts:[[235,216],[283,216],[283,258],[235,258]], color:"#818cf8", label:"Kanan" },
    { pts:[[117,216],[165,216],[165,258],[117,258]], color:"#818cf8", label:"Kiri" },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 space-y-2">
      <div className="relative" style={{ height: 305 }}>
        {/* 3D assembled view */}
        <svg viewBox="0 0 400 305" style={{
          position:"absolute", top:0, left:0, width:"100%", height:"100%",
          opacity: 1 - progress,
          pointerEvents: progress > 0.4 ? "none" : "auto",
        }}>
          {sorted3.map((f, i) => {
            const pts = f.pts2d.map(([x, y]) => `${cx3+x},${cy3+y}`).join(" ");
            const mx  = f.pts2d.reduce((s, p) => s + p[0], 0) / f.pts2d.length;
            const my  = f.pts2d.reduce((s, p) => s + p[1], 0) / f.pts2d.length;
            return (
              <g key={i}>
                <polygon points={pts} fill={f.color} fillOpacity={0.88}
                  stroke="rgba(255,255,255,0.5)" strokeWidth={1.3} strokeLinejoin="round"/>
                {f.label && (
                  <text x={cx3+mx} y={cy3+my+3} fill="white" fontSize={8}
                    fontFamily="monospace" fontWeight="bold" textAnchor="middle"
                    dominantBaseline="middle" style={{ pointerEvents:"none" }}>{f.label}</text>
                )}
              </g>
            );
          })}
          <text x="200" y="298" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="monospace">
            Model 3D Balok + Limas · tekan Bongkar untuk jaring-jaring
          </text>
        </svg>

        {/* 2D net view */}
        <svg viewBox="0 0 400 320" style={{
          position:"absolute", top:0, left:0, width:"100%", height:"100%",
          opacity: progress,
          pointerEvents: progress < 0.6 ? "none" : "auto",
        }}>
          {/* Section labels */}
          <text x="80" y="97" fontSize="9" fill="#a78bfa" fontFamily="monospace" fontWeight="bold">▲ LIMAS</text>
          <line x1="80" y1="165" x2="320" y2="165" stroke="#334155" strokeWidth="1.2" strokeDasharray="6,4"/>
          <text x="80" y="188" fontSize="9" fill="#6366f1" fontFamily="monospace" fontWeight="bold">▬ BALOK</text>
          {netFaces.map((f, i) => {
            const pts = f.pts.map(([x, y]) => `${x},${y}`).join(" ");
            const mx  = f.pts.reduce((s, p) => s + p[0], 0) / f.pts.length;
            const my  = f.pts.reduce((s, p) => s + p[1], 0) / f.pts.length;
            return (
              <g key={i}>
                <polygon points={pts}
                  fill={f.color} fillOpacity={f.isShared ? 0.22 : 0.82}
                  stroke={f.isShared ? "#ef4444" : "rgba(255,255,255,0.55)"}
                  strokeWidth={f.isShared ? 2 : 1.2}
                  strokeDasharray={f.isShared ? "5,3" : undefined}/>
                {f.isShared && (
                  <>
                    <line x1={f.pts[0][0]} y1={f.pts[0][1]} x2={f.pts[2][0]} y2={f.pts[2][1]}
                      stroke="#ef4444" strokeWidth={2} opacity={0.65}/>
                    <line x1={f.pts[1][0]} y1={f.pts[1][1]} x2={f.pts[3][0]} y2={f.pts[3][1]}
                      stroke="#ef4444" strokeWidth={2} opacity={0.65}/>
                  </>
                )}
                <text x={mx} y={my + 4} fill={f.isShared ? "#fca5a5" : "white"}
                  fontSize={f.isShared ? 6 : 7.5} fontFamily="monospace" fontWeight="bold"
                  textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents:"none" }}>
                  {f.label}
                </text>
              </g>
            );
          })}
          <text x="200" y="316" textAnchor="middle" fontSize="8" fill="#facc15" fontFamily="monospace">
            9 bidang terlihat: 4 segitiga limas + 5 sisi balok (alas beririsan ✗)
          </text>
        </svg>
      </div>

      {/* Button */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => animateTo(isNet ? 0 : 1)}
          className="text-xs font-bold py-2 px-5 rounded-lg border font-body transition-all duration-200"
          style={{
            borderColor: isNet ? "#22c55e" : "#f97316",
            color: isNet ? "#22c55e" : "#f97316",
            backgroundColor: "transparent",
          }}>
          {isNet ? "🔄 Rakit Kembali" : "📤 Bongkar Jaring-jaring"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {[
          { c:"#f59e0b", l:"4 Segitiga Limas" },
          { c:"#6366f1", l:"5 Sisi Balok (tanpa tutup)" },
          { c:"#ef4444", l:"Bidang Beririsan ✗" },
        ].map(({c,l}) => (
          <div key={l} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background:c }}/>
            <span className="text-white/55 font-body" style={{ fontSize:9 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SLIDES DATA
───────────────────────────────────────────────────────────── */
type Slide = { icon: string; title: string; content: React.ReactNode };

const slides: Slide[] = [
  {
    icon: "🏗️",
    title: "Pengantar",
    content: (
      <div className="space-y-3 text-sm font-body text-white/75 leading-relaxed">
        <p>
          <strong className="text-cyan-300">Bangun ruang gabungan</strong> adalah bangun ruang yang terbentuk dari
          dua atau lebih bangun ruang dasar yang digabungkan. Contoh nyata: rumah (kubus + prisma atap),
          tugu (balok + limas), gedung bertingkat (beberapa balok), dan lain-lain.
        </p>
        <ThreeGabungan3D />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/60 space-y-1">
          <p className="text-cyan-300 font-semibold mb-1">📋 Materi dalam bab ini:</p>
          <p>• Rusuk &amp; titik sudut gabungan</p>
          <p>• Luas permukaan gabungan + jaring-jaring interaktif</p>
          <p>• Volume gabungan</p>
          <p>• Contoh: Balok + Limas</p>
          <p>• Contoh: Kubus/Balok + Prisma (Rumah)</p>
          <p>• Contoh: Gabungan dua balok</p>
          <p>• Contoh soal bertingkat</p>
        </div>
      </div>
    ),
  },
  /* ── NEW: Rusuk Gabungan ── */
  {
    icon: "📐",
    title: "Rusuk & Titik Sudut Gabungan",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-xs space-y-1">
          <p className="text-violet-300 font-semibold">💡 Konsep Dasar:</p>
          <p className="text-white/75">Ketika dua bangun digabung, <strong className="text-yellow-300">rusuk &amp; titik sudut yang berhimpit dihitung sekali</strong>. Rusuk yang menempel di dalam (beririsan) tidak termasuk rusuk luar.</p>
        </div>
        <RusukGabunganSVG />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-cyan-300 font-semibold">Contoh: Balok + Limas Segiempat</p>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-[10px] border-collapse">
              <thead>
                <tr>
                  <th className="border border-slate-600 px-2 py-1 text-white/60">Bangun</th>
                  <th className="border border-slate-600 px-2 py-1 text-indigo-300">Rusuk</th>
                  <th className="border border-slate-600 px-2 py-1 text-emerald-300">Titik Sudut</th>
                  <th className="border border-slate-600 px-2 py-1 text-orange-300">Sisi Luar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-600 px-2 py-1">Balok</td>
                  <td className="border border-slate-600 px-2 py-1 text-indigo-300">12</td>
                  <td className="border border-slate-600 px-2 py-1 text-emerald-300">8</td>
                  <td className="border border-slate-600 px-2 py-1 text-orange-300">6</td>
                </tr>
                <tr>
                  <td className="border border-slate-600 px-2 py-1">Limas Segiempat</td>
                  <td className="border border-slate-600 px-2 py-1 text-indigo-300">8</td>
                  <td className="border border-slate-600 px-2 py-1 text-emerald-300">5</td>
                  <td className="border border-slate-600 px-2 py-1 text-orange-300">5</td>
                </tr>
                <tr className="bg-slate-700/40">
                  <td className="border border-slate-600 px-2 py-1 text-yellow-300 font-bold">Rusuk bersama</td>
                  <td className="border border-slate-600 px-2 py-1 text-yellow-300">−4</td>
                  <td className="border border-slate-600 px-2 py-1 text-yellow-300">−4</td>
                  <td className="border border-slate-600 px-2 py-1 text-yellow-300">−2</td>
                </tr>
                <tr className="bg-cyan-950/40">
                  <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">Gabungan</td>
                  <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">16</td>
                  <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">9</td>
                  <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-yellow-950/40 border border-yellow-700/30 rounded-lg p-3 text-xs text-yellow-200 space-y-1">
          <p className="font-semibold">📏 Rumus Umum:</p>
          <p><strong className="text-cyan-300">Rusuk gabungan</strong> = Rusuk A + Rusuk B − Rusuk bersama</p>
          <p><strong className="text-cyan-300">Titik sudut gabungan</strong> = Titik A + Titik B − Titik bersama</p>
          <p><strong className="text-cyan-300">Sisi luar</strong> = Sisi A + Sisi B − 2 × bidang beririsan</p>
        </div>
      </div>
    ),
  },
  /* ── NEW: Luas Permukaan + Jaring-jaring ── */
  {
    icon: "🔲",
    title: "Luas Permukaan & Jaring-jaring",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-xs">
          <p className="text-violet-300 font-semibold mb-1">⚠️ Aturan Utama:</p>
          <p className="text-white/75">Bidang yang <strong className="text-red-400">beririsan (saling menempel)</strong> antara dua bangun <strong className="text-red-400">TIDAK dihitung</strong> dalam luas permukaan gabungan.</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-cyan-300 font-semibold">Rumus Luas Permukaan Gabungan:</p>
          <BlockMath math="L_{\text{gab}} = (L_A - L_{\text{beririsan}}) + (L_B - L_{\text{beririsan}})" />
          <p className="text-white/55">Setiap bangun dikurangi bidang yang menempel sebelum dijumlahkan.</p>
        </div>
        <p className="text-white/55 text-xs text-center">Tekan tombol untuk membongkar jaring-jaring Balok + Limas!</p>
        <JaringGabunganInteraktif />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1">
          <p className="text-orange-300 font-semibold">Contoh Balok (p×l×t₁) + Limas segiempat (tinggi t₂):</p>
          <BlockMath math="L = \underbrace{(p \cdot l + 2pl' + 2ll')}_{\text{balok tanpa tutup}} + \underbrace{4 \cdot L_{\triangle}}_{\text{selimut limas}}" />
          <p className="text-white/50">Alas limas = tutup balok → bidang beririsan, tidak dihitung dua kali!</p>
        </div>
      </div>
    ),
  },
  /* ── NEW: Volume Gabungan (enhanced) ── */
  {
    icon: "📦",
    title: "Volume Gabungan",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        {/* Cara 1: Penjumlahan */}
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs space-y-2">
          <p className="text-cyan-300 font-semibold">💡 Cara 1 — Penjumlahan (Penggabungan):</p>
          <p className="text-white/75">Bangun terbentuk dari <strong className="text-yellow-300">beberapa bagian yang disatukan</strong>. Volume total = jumlah semua bagian.</p>
          <BlockMath math="V_{\text{gabungan}} = V_1 + V_2 + V_3 + \ldots" />
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-cyan-300 font-semibold">Contoh kombinasi populer:</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2 bg-indigo-950/40 rounded p-2">
              <span className="text-indigo-300 font-bold text-[11px] min-w-fit">Balok + Limas:</span>
              <BlockMath math="V = p \cdot l \cdot t_1 + \tfrac{1}{3} \cdot p \cdot l \cdot t_2" />
            </div>
            <div className="flex items-start gap-2 bg-amber-950/40 rounded p-2">
              <span className="text-amber-300 font-bold text-[11px] min-w-fit">Kubus + Prisma △:</span>
              <BlockMath math="V = s^3 + L_{\triangle} \cdot t_{\text{prisma}}" />
            </div>
            <div className="flex items-start gap-2 bg-emerald-950/40 rounded p-2">
              <span className="text-emerald-300 font-bold text-[11px] min-w-fit">2 Balok:</span>
              <BlockMath math="V = p_1 l_1 t_1 + p_2 l_2 t_2" />
            </div>
          </div>
        </div>

        {/* Cara 2: Pengurangan */}
        <div className="bg-rose-950/50 border border-rose-700/40 rounded-lg p-3 text-xs space-y-2">
          <p className="text-rose-300 font-semibold">✂️ Cara 2 — Pengurangan (Pemotongan):</p>
          <p className="text-white/75">
            Kadang lebih mudah membayangkan bangun sebagai <strong className="text-yellow-300">benda utuh yang sudah diambil sebagian</strong>.
            Volume gabungan = Volume benda utuh <strong className="text-rose-300">dikurangi</strong> bagian yang diambil.
          </p>
          <BlockMath math="V_{\text{gabungan}} = V_{\text{utuh}} - V_{\text{yang diambil}}" />
        </div>

        {/* SVG Ilustrasi Pengurangan */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-rose-300 font-semibold text-center">Ilustrasi: Balok utuh − Balok kecil yang diambil</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Balok utuh */}
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 110 90" className="w-24 h-20">
                <polygon points="10,70 80,70 80,20 10,20" fill="#6366f1" fillOpacity="0.7" stroke="#818cf8" strokeWidth="1.5"/>
                <polygon points="80,20 110,5 110,55 80,70" fill="#4f46e5" fillOpacity="0.85" stroke="#818cf8" strokeWidth="1.5"/>
                <polygon points="10,20 80,20 110,5 40,5" fill="#818cf8" fillOpacity="0.9" stroke="#a5b4fc" strokeWidth="1.5"/>
                <text x="45" y="50" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">V utuh</text>
                <text x="45" y="82" fill="#818cf8" fontSize="7" textAnchor="middle">p × l × t</text>
              </svg>
              <span className="text-indigo-300 font-bold text-[10px]">Balok Utuh</span>
            </div>
            <span className="text-white/60 text-lg font-bold">−</span>
            {/* Potongan kecil */}
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 80 70" className="w-16 h-14">
                <polygon points="10,55 50,55 50,20 10,20" fill="#f43f5e" fillOpacity="0.7" stroke="#fb7185" strokeWidth="1.5"/>
                <polygon points="50,20 70,10 70,45 50,55" fill="#e11d48" fillOpacity="0.85" stroke="#fb7185" strokeWidth="1.5"/>
                <polygon points="10,20 50,20 70,10 30,10" fill="#fb7185" fillOpacity="0.9" stroke="#fda4af" strokeWidth="1.5"/>
                <text x="35" y="40" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">V ambil</text>
              </svg>
              <span className="text-rose-300 font-bold text-[10px]">Bagian Diambil</span>
            </div>
            <span className="text-white/60 text-lg font-bold">=</span>
            {/* Hasil */}
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 110 90" className="w-24 h-20">
                {/* Balok besar */}
                <polygon points="10,70 80,70 80,20 10,20" fill="#6366f1" fillOpacity="0.7" stroke="#818cf8" strokeWidth="1.5"/>
                <polygon points="80,20 110,5 110,55 80,70" fill="#4f46e5" fillOpacity="0.85" stroke="#818cf8" strokeWidth="1.5"/>
                <polygon points="10,20 80,20 110,5 40,5" fill="#818cf8" fillOpacity="0.9" stroke="#a5b4fc" strokeWidth="1.5"/>
                {/* Lubang/potongan */}
                <polygon points="10,70 35,70 35,45 10,45" fill="#0f172a" fillOpacity="0.95" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,2"/>
                <text x="55" y="50" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">V hasil</text>
              </svg>
              <span className="text-green-300 font-bold text-[10px]">Hasil Gabungan</span>
            </div>
          </div>
          <div className="mt-2 bg-rose-950/30 border border-rose-700/30 rounded p-2 space-y-1">
            <p className="text-white/80"><strong className="text-rose-300">Contoh nyata:</strong> Balok besar (20×15×10 cm) dengan lubang balok kecil (5×5×10 cm)</p>
            <BlockMath math="V = (20 \times 15 \times 10) - (5 \times 5 \times 10) = 3000 - 250 = 2750 \text{ cm}^3" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-yellow-300 font-semibold">🔢 Kapan Menggunakan Cara Mana?</p>
          <div className="space-y-1">
            <p className="text-white/75">✅ <strong className="text-cyan-300">Penjumlahan</strong> → bangun terbentuk dari beberapa bagian yang <em>ditumpuk/disatukan</em></p>
            <p className="text-white/75">✅ <strong className="text-rose-300">Pengurangan</strong> → benda utuh yang sudah <em>dilubangi/dipotong</em> bagiannya</p>
          </div>
        </div>
        <div className="bg-yellow-950/40 border border-yellow-700/30 rounded-lg p-3 text-xs text-yellow-200 space-y-1">
          <p className="font-semibold">⚠️ Perhatian:</p>
          <p>Pastikan satuan semua dimensi sama (cm semua, atau m semua) sebelum menghitung!</p>
          <p>Identifikasi <strong className="text-yellow-300">batas antara dua bangun</strong> dengan tepat agar dimensi tidak salah.</p>
        </div>
      </div>
    ),
  },
  {
    icon: "📦",
    title: "Konsep Volume Gabungan",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3">
          <p className="text-cyan-300 font-semibold mb-1">💡 Prinsip Utama:</p>
          <p className="text-sm text-white/75">Volume bangun gabungan = <strong className="text-yellow-300">jumlah volume semua bagian</strong>.</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
          <p className="text-cyan-300 font-semibold text-xs">Rumus Umum:</p>
          <BlockMath math="V_{\text{gabungan}} = V_1 + V_2 + V_3 + \ldots" />
        </div>
        <div className="space-y-2 text-xs text-white/70">
          <p className="text-white/85 font-semibold">Contoh kombinasi populer:</p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-1">
            <p>• <strong className="text-blue-300">Balok + Limas:</strong> <InlineMath math="V = p \cdot l \cdot t_1 + \tfrac{1}{3} \cdot p \cdot l \cdot t_2" /></p>
            <p>• <strong className="text-yellow-300">Kubus + Prisma △:</strong> <InlineMath math="V = s^3 + L_{\triangle} \cdot t" /></p>
            <p>• <strong className="text-orange-300">Dua Balok:</strong> <InlineMath math="V = V_{balok1} + V_{balok2}" /></p>
          </div>
        </div>
        <div className="bg-yellow-950/40 border border-yellow-700/30 rounded-lg p-3 text-xs text-yellow-200 space-y-1">
          <p className="font-semibold">⚠️ Perhatian!</p>
          <p>Pastikan kamu mengidentifikasi <strong className="text-yellow-300">batas antara dua bangun</strong> dengan benar agar tidak salah menentukan dimensinya.</p>
        </div>
      </div>
    ),
  },
  {
    icon: "🎨",
    title: "Konsep Luas Permukaan Gabungan",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3">
          <p className="text-violet-300 font-semibold mb-1">⚠️ Kunci Penting:</p>
          <p className="text-sm text-white/75">Luas permukaan gabungan <strong className="text-red-300">BUKAN</strong> jumlah semua luas permukaan bagiannya. Bidang yang <strong className="text-yellow-300">saling menempel tidak dihitung</strong>!</p>
        </div>
        <LuasGabunganSVG />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2 text-xs">
          <p className="text-cyan-300 font-semibold">Langkah-langkah:</p>
          <p>1. Identifikasi <strong className="text-green-300">bidang yang terlihat dari luar</strong></p>
          <p>2. Identifikasi <strong className="text-red-300">bidang yang tersembunyi</strong> (saling menempel antar bangun)</p>
          <p>3. Hitung luas semua bidang yang terlihat saja</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1">
          <p className="text-orange-300 font-semibold">Contoh Balok + Limas:</p>
          <BlockMath math="L = L_{\text{balok tanpa tutup}} + L_{\text{selimut limas}}" />
          <p className="text-white/50">Alas limas = tutup balok → bidang ini tidak dihitung!</p>
        </div>
      </div>
    ),
  },
  {
    icon: "🏢",
    title: "Contoh: Balok + Limas",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        <BalokLimasSVG />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-cyan-300 font-semibold">Diketahui: Balok (p × l × t₁) + Limas segiempat (alas sama, tinggi t₂)</p>
          <div className="space-y-2">
            <p className="text-blue-300 font-semibold">Volume:</p>
            <BlockMath math="V = p \cdot l \cdot t_1 + \frac{1}{3} \cdot p \cdot l \cdot t_2" />
            <p className="text-orange-300 font-semibold">Luas Permukaan:</p>
            <BlockMath math="L = L_{\text{alas balok}} + 4 \cdot L_{\text{sisi balok}} + 4 \cdot L_{\triangle}" />
            <p className="text-white/50">Tutup balok (= alas limas) tidak dihitung!</p>
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200">
          <p>🌍 <strong>Contoh nyata:</strong> Tugu kota, monumen, piramida dengan alas berbentuk gedung</p>
        </div>
      </div>
    ),
  },
  {
    icon: "🏠",
    title: "Contoh: Kubus/Balok + Prisma (Rumah)",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        <KubusPrismaSVG />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-cyan-300 font-semibold">Diketahui: Kubus (s) + Atap Prisma Segitiga</p>
          <div className="space-y-2">
            <p className="text-blue-300 font-semibold">Volume:</p>
            <BlockMath math="V = s^3 + L_{\triangle} \times t_{\text{prisma}}" />
            <p className="text-orange-300 font-semibold">Luas Permukaan:</p>
            <BlockMath math="L = L_{\text{alas}} + 4 \cdot L_{\text{sisi kubus}} + 2 \cdot L_{\triangle} + 2 \cdot L_{\text{sisi miring}}" />
            <p className="text-white/50">Tutup kubus (= alas prisma) tidak dihitung!</p>
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200">
          <p>🏠 <strong>Contoh nyata:</strong> Rumah, gazebo, tenda, miniatur bangunan</p>
        </div>
      </div>
    ),
  },
  {
    icon: "🏗️",
    title: "Contoh: Dua Balok Gabungan",
    content: (
      <div className="space-y-3 text-sm font-body text-white/85">
        <DuaBalokSVG />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-cyan-300 font-semibold">Dua balok yang disambung (undakan / L-shape):</p>
          <p className="text-blue-300 font-semibold">Volume:</p>
          <BlockMath math="V = V_{\text{balok 1}} + V_{\text{balok 2}}" />
          <p className="text-orange-300 font-semibold">Luas Permukaan:</p>
          <p className="text-white/70">Jumlahkan luas semua bidang yang terlihat dari luar. Bidang sambungan antar balok tidak dihitung.</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1">
          <p className="text-yellow-300 font-semibold">💡 Tips untuk bangun L-shape:</p>
          <p className="text-white/70">Bisa juga dihitung sebagai <strong className="text-cyan-300">satu balok besar dikurangi satu balok kecil</strong> (selisih volume).</p>
          <BlockMath math="V = V_{\text{besar}} - V_{\text{yang dipotong}}" />
        </div>
      </div>
    ),
  },
  {
    icon: "📊",
    title: "Kesimpulan & Strategi",
    content: (
      <div className="space-y-3 font-body text-sm">
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 space-y-2 text-xs">
          <p className="text-cyan-300 font-semibold text-sm">🎯 Strategi Menyelesaikan Soal Bangun Gabungan</p>
          <p className="text-white/75">1. <strong className="text-yellow-300">Identifikasi</strong> setiap bangun penyusun</p>
          <p className="text-white/75">2. <strong className="text-yellow-300">Catat dimensi</strong> masing-masing bangun</p>
          <p className="text-white/75">3. <strong className="text-yellow-300">Tentukan</strong> bidang yang bersentuhan (untuk luas permukaan)</p>
          <p className="text-white/75">4. <strong className="text-yellow-300">Hitung</strong> volume/luas masing-masing</p>
          <p className="text-white/75">5. <strong className="text-yellow-300">Jumlahkan</strong> (volume) atau <strong className="text-yellow-300">identifikasi bidang terlihat</strong> (luas permukaan)</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
          <p className="text-violet-300 font-semibold">📌 Rumus Ringkas:</p>
          <BlockMath math="V_{\text{gab}} = \sum V_i" />
          <BlockMath math="L_{\text{gab}} = \sum L_{\text{terlihat}}" />
        </div>
        <div className="bg-green-950/40 border border-green-700/30 rounded-lg p-3 text-xs text-green-200">
          <p className="font-semibold mb-1">✅ Ingat selalu:</p>
          <p>Untuk <strong>volume</strong>: tambahkan semua volume</p>
          <p>Untuk <strong>luas permukaan</strong>: jangan hitung bidang sambungan!</p>
        </div>
      </div>
    ),
  },
  {
    icon: "📝",
    title: "Contoh Soal Bertingkat",
    content: (
      <div className="space-y-4 font-body">
        {examples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} />)}
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────── */
export default function GabunganPage() {
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

        {/* Title */}
        <Layers className="w-10 h-10 text-violet-400 mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-violet-300 text-glow-cyan mb-1 text-center">
          BANGUN RUANG GABUNGAN
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
                  ? "w-6 h-2.5 bg-violet-400"
                  : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Slide card */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden mb-4">
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

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold font-display
              text-white/70 hover:text-white hover:border-violet-400/60 hover:bg-violet-400/10
              disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            ← Sebelumnya
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex-1 py-2.5 rounded-lg border border-violet-400/60 bg-violet-400/15 text-sm font-semibold font-display
              text-violet-300 hover:bg-violet-400/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Selanjutnya →
          </button>
        </div>

        <div className="mt-2 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-violet-300 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
}
