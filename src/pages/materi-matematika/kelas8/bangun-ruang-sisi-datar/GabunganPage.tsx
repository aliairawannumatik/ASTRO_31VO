import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

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
function makeBalokLimasData(p: number, l: number, tb: number, tl: number, lbl = { balok:"BALOK", limas:"LIMAS" }) {
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
    { idx:[0,1,2,3], color:"#6366f1", label:lbl.balok },
    { idx:[5,4,7,6], color:"#4f46e5", label:"" },
    { idx:[4,0,3,7], color:"#818cf8", label:"" },
    { idx:[1,5,6,2], color:"#6366f1", label:"" },
    { idx:[3,2,6,7], color:"#312e81", label:"" },
    { idx:[0,1,8],   color:"#f43f5e", label:lbl.limas },
    { idx:[1,5,8],   color:"#fb7185", label:"" },
    { idx:[5,4,8],   color:"#e11d48", label:"" },
    { idx:[4,0,8],   color:"#fda4af", label:"" },
  ];
  return { verts, faces };
}

// KUBUS + LIMAS
function makeKubusLimasData(s: number, tl: number, lbl = { kubus:"KUBUS", limas:"LIMAS" }) {
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
    { idx:[0,1,2,3], color:"#0ea5e9", label:lbl.kubus },
    { idx:[5,4,7,6], color:"#0284c7", label:"" },
    { idx:[4,0,3,7], color:"#38bdf8", label:"" },
    { idx:[1,5,6,2], color:"#0ea5e9", label:"" },
    { idx:[3,2,6,7], color:"#075985", label:"" },
    { idx:[0,1,8],   color:"#f59e0b", label:lbl.limas },
    { idx:[1,5,8],   color:"#fbbf24", label:"" },
    { idx:[5,4,8],   color:"#d97706", label:"" },
    { idx:[4,0,8],   color:"#fcd34d", label:"" },
  ];
  return { verts, faces };
}

// BALOK BESAR + BALOK KECIL
function makeDuaBalokData(pb: number, l: number, tb: number, ps: number, ts: number, lbl = { besar:"BALOK\nBESAR", kecil:"BALOK\nKECIL" }) {
  const hy = (tb + ts) / 2;
  const yj  = -hy + ts;
  const ybot = hy;
  const ytop = -hy;
  const hb = pb/2, hs = ps/2, hl = l/2;
  const verts: GV3[] = [
    [-hb, yj,   +hl], [+hb, yj,   +hl], [+hb, ybot, +hl], [-hb, ybot, +hl],
    [-hb, yj,   -hl], [+hb, yj,   -hl], [+hb, ybot, -hl], [-hb, ybot, -hl],
    [-hs, ytop, +hl], [+hs, ytop, +hl], [+hs, yj,   +hl], [-hs, yj,   +hl],
    [-hs, ytop, -hl], [+hs, ytop, -hl], [+hs, yj,   -hl], [-hs, yj,   -hl],
  ];
  const faces: GFace[] = [
    { idx:[0,1,2,3], color:"#6366f1", label:lbl.besar },
    { idx:[5,4,7,6], color:"#4f46e5", label:"" },
    { idx:[4,0,3,7], color:"#818cf8", label:"" },
    { idx:[1,5,6,2], color:"#6366f1", label:"" },
    { idx:[3,2,6,7], color:"#312e81", label:"" },
    { idx:[4,0,11,15], color:"#818cf8", label:"" },
    { idx:[1,5,14,10], color:"#818cf8", label:"" },
    { idx:[8,9,10,11],  color:"#10b981", label:lbl.kecil },
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
                <text x={cx+mx} y={cy+my+3} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace"
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

const ThreeGabungan3D = () => {
  const { language: lang } = useLanguage();
  const autoHint = lang === "en" ? "Auto-rotating · Drag to rotate"
    : lang === "ja" ? "自動回転 · ドラッグで回転"
    : "Berputar otomatis · Drag untuk memutar sendiri";
  const lbl = lang === "en"
    ? { balok:"BOX", limas:"PYRAMID", kubus:"CUBE", besar:"LARGE\nBOX", kecil:"SMALL\nBOX" }
    : lang === "ja"
    ? { balok:"直方体", limas:"角錐", kubus:"立方体", besar:"大直方体", kecil:"小直方体" }
    : { balok:"BALOK", limas:"LIMAS", kubus:"KUBUS", besar:"BALOK\nBESAR", kecil:"BALOK\nKECIL" };
  const names = lang === "en"
    ? ["Box + Pyramid", "Cube + Pyramid", "Large Box + Small Box"]
    : lang === "ja"
    ? ["直方体 + 角錐", "立方体 + 角錐", "大直方体 + 小直方体"]
    : ["Balok + Limas", "Kubus + Limas", "Balok Besar + Balok Kecil"];
  const legend = lang === "en"
    ? [["#6366f1","Box"],["#f43f5e","Pyramid"],["#0ea5e9","Cube"],["#f59e0b","Pyramid (on cube)"],["#10b981","Small Box"]]
    : lang === "ja"
    ? [["#6366f1","直方体"],["#f43f5e","角錐"],["#0ea5e9","立方体"],["#f59e0b","角錐（立方体上）"],["#10b981","小直方体"]]
    : [["#6366f1","Balok"],["#f43f5e","Limas"],["#0ea5e9","Kubus"],["#f59e0b","Limas (kubus)"],["#10b981","Balok Kecil"]];
  const { verts: blVerts, faces: blFaces } = makeBalokLimasData(68, 48, 44, 38, { balok: lbl.balok, limas: lbl.limas });
  const { verts: klVerts, faces: klFaces } = makeKubusLimasData(54, 40, { kubus: lbl.kubus, limas: lbl.limas });
  const { verts: dbVerts, faces: dbFaces } = makeDuaBalokData(70, 48, 40, 46, 30, { besar: lbl.besar, kecil: lbl.kecil });
  return (
    <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 space-y-2">
      <p className="text-center text-yellow-300 font-body font-semibold" style={{ fontSize:13 }}>{autoHint}</p>
      <div className="flex gap-2">
        <RotatingGabungan3D verts={blVerts} faces={blFaces} label={names[0]} initRy={35}/>
        <RotatingGabungan3D verts={klVerts} faces={klFaces} label={names[1]} initRy={55}/>
        <RotatingGabungan3D verts={dbVerts} faces={dbFaces} label={names[2]} initRy={42}/>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
        {legend.map(([c,l])=>(
          <div key={l} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background:c }}/>
            <span className="text-white/45 font-body" style={{ fontSize:9 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
   INTERACTIVE 3D — BALOK + LIMAS
───────────────────────────────────────────────────────────── */
const InteractiveBalokLimas = ({ lang }: { lang: string }) => {
  const { rotX, rotY, isDragging, onMouseDown, onTouchStart } = useDrag3D(-28, 38);
  const BW = 100, BD = 55, BH = 52, LH = 50;
  const TRANS = "transform 0.4s ease";
  const balokColor = { front: "#6366f1", side: "#4f46e5", top: "#818cf8", bottom: "#3730a3" };
  const limasColor = "#f43f5e";
  const dragHint = lang === "en" ? "Drag to rotate 🔄" : lang === "ja" ? "ドラッグで回転 🔄" : "Drag untuk memutar 🔄";
  const legendItems = lang === "en"
    ? [{ label:"Box", color:"#6366f1" }, { label:"Pyramid", color:"#f43f5e" }]
    : lang === "ja"
    ? [{ label:"直方体", color:"#6366f1" }, { label:"角錐", color:"#f43f5e" }]
    : [{ label:"Balok", color:"#6366f1" }, { label:"Limas", color:"#f43f5e" }];

  const face = (
    w: number, h: number, bg: string, opacity: number,
    transform: string, extra?: React.CSSProperties
  ) => (
    <div style={{
      position:"absolute", width:w, height:h, background:bg, opacity,
      border:`1.5px solid ${bg}`, borderRadius:2,
      transformStyle:"preserve-3d", transform, backfaceVisibility:"hidden", ...extra,
    }}/>
  );

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 space-y-3">
      <p className="text-white/50 text-[10px] text-center font-body">{dragHint}</p>
      <div className="relative mx-auto select-none overflow-visible flex items-center justify-center"
        style={{ height:200, cursor:isDragging?"grabbing":"grab" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <div style={{
          width:BW, height:BH+LH, position:"relative",
          transformStyle:"preserve-3d",
          transform:`perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition:isDragging?"none":TRANS,
        }}>
          {face(BW, BH, balokColor.front, 0.7, `translateZ(${BD/2}px) translateY(${LH}px)`)}
          {face(BW, BH, balokColor.side, 0.45, `rotateY(180deg) translateZ(${BD/2}px) translateY(${LH}px)`)}
          <div style={{ position:"absolute", width:BD, height:BH, left:BW, top:LH, background:balokColor.side, opacity:0.55, border:`1.5px solid ${balokColor.side}`, transformStyle:"preserve-3d", transformOrigin:"0 50%", transform:"rotateY(90deg)" }}/>
          <div style={{ position:"absolute", width:BD, height:BH, left:0, top:LH, background:balokColor.side, opacity:0.4, border:`1.5px solid ${balokColor.side}`, transformStyle:"preserve-3d", transformOrigin:"0 50%", transform:"rotateY(-90deg)" }}/>
          <div style={{ position:"absolute", width:BW, height:BD, left:0, top:BH+LH, background:balokColor.bottom, opacity:0.35, border:`1.5px solid ${balokColor.bottom}`, transformStyle:"preserve-3d", transformOrigin:"50% 0", transform:"rotateX(90deg)" }}/>
          <div style={{ position:"absolute", width:BW, height:BD, left:0, top:LH, background:balokColor.top, opacity:0.3, border:`1.5px solid ${balokColor.top}`, transformStyle:"preserve-3d", transformOrigin:"50% 0", transform:"rotateX(-90deg)" }}/>
          {[
            { bL:`${BW/2}px solid transparent`, bR:`${BW/2}px solid transparent`, bB:`${LH}px solid ${limasColor}`, op:0.75, tr:`rotateX(-90deg) translateZ(${BD/2}px)` },
            { bL:`${BW/2}px solid transparent`, bR:`${BW/2}px solid transparent`, bB:`${LH}px solid ${limasColor}`, op:0.45, tr:`rotateY(180deg) rotateX(-90deg) translateZ(${BD/2}px)` },
            { bL:`${BD/2}px solid transparent`, bR:`${BD/2}px solid transparent`, bB:`${LH}px solid #fb7185`, op:0.6, tr:`rotateY(90deg) rotateX(-90deg) translateZ(${BW/2}px)` },
            { bL:`${BD/2}px solid transparent`, bR:`${BD/2}px solid transparent`, bB:`${LH}px solid #fb7185`, op:0.5, tr:`rotateY(-90deg) rotateX(-90deg) translateZ(${BW/2}px)` },
          ].map((t,i)=>(
            <div key={i} style={{
              position:"absolute", width:0, height:0, left:BW/2, top:0,
              borderLeft:t.bL, borderRight:t.bR, borderBottom:t.bB, opacity:t.op,
              transform:t.tr, transformOrigin:"50% 100%", transformStyle:"preserve-3d",
            }}/>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {legendItems.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background:color }}/>
            <span className="text-white/50 text-[9px] font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D — KUBUS + PRISMA (RUMAH)
───────────────────────────────────────────────────────────── */
const InteractiveRumah = ({ lang }: { lang: string }) => {
  const { rotX, rotY, isDragging, onMouseDown, onTouchStart } = useDrag3D(-25, 42);
  const S = 72, PH = 44;
  const TRANS = "transform 0.4s ease";
  const kubus = { front:"#6366f1", side:"#4f46e5", top:"#818cf8" };
  const atap  = { front:"#f59e0b", side:"#d97706" };
  const dragHint = lang === "en" ? "Drag to rotate 🔄" : lang === "ja" ? "ドラッグで回転 🔄" : "Drag untuk memutar 🔄";
  const legendItems = lang === "en"
    ? [{ label:"Cube", color:"#6366f1" }, { label:"Prism Roof", color:"#f59e0b" }]
    : lang === "ja"
    ? [{ label:"立方体", color:"#6366f1" }, { label:"三角柱の屋根", color:"#f59e0b" }]
    : [{ label:"Kubus", color:"#6366f1" }, { label:"Atap Prisma", color:"#f59e0b" }];
  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 space-y-3">
      <p className="text-white/50 text-[10px] text-center font-body">{dragHint}</p>
      <div className="relative mx-auto select-none overflow-visible flex items-center justify-center"
        style={{ height:200, cursor:isDragging?"grabbing":"grab" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <div style={{
          width:S, height:S+PH, position:"relative",
          transformStyle:"preserve-3d",
          transform:`perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition:isDragging?"none":TRANS,
        }}>
          <div style={{ position:"absolute", width:S, height:S, left:0, top:PH, background:kubus.front, opacity:0.7, border:`1.5px solid ${kubus.front}`, transformStyle:"preserve-3d", transform:`translateZ(${S/2}px)` }}/>
          <div style={{ position:"absolute", width:S, height:S, left:0, top:PH, background:kubus.side, opacity:0.4, border:`1.5px solid ${kubus.side}`, transformStyle:"preserve-3d", transform:`rotateY(180deg) translateZ(${S/2}px)` }}/>
          <div style={{ position:"absolute", width:S, height:S, left:S, top:PH, background:kubus.side, opacity:0.55, border:`1.5px solid ${kubus.side}`, transformStyle:"preserve-3d", transformOrigin:"0 50%", transform:"rotateY(90deg)" }}/>
          <div style={{ position:"absolute", width:S, height:S, left:0, top:PH, background:kubus.side, opacity:0.4, border:`1.5px solid ${kubus.side}`, transformStyle:"preserve-3d", transformOrigin:"0 50%", transform:"rotateY(-90deg)" }}/>
          <div style={{ position:"absolute", width:S, height:S, left:0, top:S+PH, background:kubus.side, opacity:0.3, border:`1.5px solid ${kubus.side}`, transformStyle:"preserve-3d", transformOrigin:"50% 0", transform:"rotateX(90deg)" }}/>
          <div style={{ position:"absolute", width:0, height:0, left:S/2, top:0, borderLeft:`${S/2}px solid transparent`, borderRight:`${S/2}px solid transparent`, borderBottom:`${PH}px solid ${atap.front}`, opacity:0.85, transform:`translateZ(${S/2}px)`, transformOrigin:"50% 100%", transformStyle:"preserve-3d" }}/>
          <div style={{ position:"absolute", width:0, height:0, left:S/2, top:0, borderLeft:`${S/2}px solid transparent`, borderRight:`${S/2}px solid transparent`, borderBottom:`${PH}px solid ${atap.front}`, opacity:0.45, transform:`rotateY(180deg) translateZ(${S/2}px)`, transformOrigin:"50% 100%", transformStyle:"preserve-3d" }}/>
          <div style={{ position:"absolute", width:S, height:Math.sqrt((S/2)*(S/2)+PH*PH), left:0, top:0, background:atap.side, opacity:0.7, border:`1.5px solid ${atap.side}`, transformStyle:"preserve-3d", transformOrigin:"100% 100%", transform:`rotateY(90deg) translateZ(${S/2}px) rotateX(${-Math.atan2(PH,S/2)*180/Math.PI}deg)` }}/>
          <div style={{ position:"absolute", width:S, height:Math.sqrt((S/2)*(S/2)+PH*PH), left:0, top:0, background:atap.side, opacity:0.55, border:`1.5px solid ${atap.side}`, transformStyle:"preserve-3d", transformOrigin:"0% 100%", transform:`rotateY(-90deg) rotateX(${-Math.atan2(PH,S/2)*180/Math.PI}deg)` }}/>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {legendItems.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background:color }}/>
            <span className="text-white/50 text-[9px] font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D — DUA BALOK
───────────────────────────────────────────────────────────── */
const InteractiveDuaBalok = ({ lang }: { lang: string }) => {
  const { rotX, rotY, isDragging, onMouseDown, onTouchStart } = useDrag3D(-22, 35);
  const TRANS = "transform 0.4s ease";
  const BW = 88, BD = 46, BH = 50, SW = 50, SH = 40;
  const c1 = { f:"#6366f1", s:"#4f46e5", t:"#818cf8", b:"#3730a3" };
  const c2 = { f:"#f43f5e", s:"#e11d48", t:"#fb7185", b:"#9f1239" };
  const dragHint = lang === "en" ? "Drag to rotate 🔄" : lang === "ja" ? "ドラッグで回転 🔄" : "Drag untuk memutar 🔄";
  const legendItems = lang === "en"
    ? [{ label:"Large Box", color:"#6366f1" }, { label:"Small Box", color:"#f43f5e" }]
    : lang === "ja"
    ? [{ label:"大直方体", color:"#6366f1" }, { label:"小直方体", color:"#f43f5e" }]
    : [{ label:"Balok Besar", color:"#6366f1" }, { label:"Balok Kecil", color:"#f43f5e" }];

  const box = (
    w: number, h: number, d: number, offsetX: number, offsetY: number,
    color: typeof c1
  ) => (
    <>
      <div style={{ position:"absolute", width:w, height:h, left:offsetX, top:offsetY, background:color.f, opacity:0.7, border:`1.5px solid ${color.f}`, transformStyle:"preserve-3d", transform:`translateZ(${d/2}px)` }}/>
      <div style={{ position:"absolute", width:w, height:h, left:offsetX, top:offsetY, background:color.s, opacity:0.4, border:`1.5px solid ${color.s}`, transformStyle:"preserve-3d", transform:`rotateY(180deg) translateZ(${d/2}px)` }}/>
      <div style={{ position:"absolute", width:d, height:h, left:offsetX+w, top:offsetY, background:color.s, opacity:0.55, border:`1.5px solid ${color.s}`, transformStyle:"preserve-3d", transformOrigin:"0 50%", transform:"rotateY(90deg)" }}/>
      <div style={{ position:"absolute", width:d, height:h, left:offsetX, top:offsetY, background:color.s, opacity:0.4, border:`1.5px solid ${color.s}`, transformStyle:"preserve-3d", transformOrigin:"0 50%", transform:"rotateY(-90deg)" }}/>
      <div style={{ position:"absolute", width:w, height:d, left:offsetX, top:offsetY, background:color.t, opacity:0.55, border:`1.5px solid ${color.t}`, transformStyle:"preserve-3d", transformOrigin:"50% 0", transform:"rotateX(-90deg)" }}/>
      <div style={{ position:"absolute", width:w, height:d, left:offsetX, top:offsetY+h, background:color.b, opacity:0.3, border:`1.5px solid ${color.b}`, transformStyle:"preserve-3d", transformOrigin:"50% 0", transform:"rotateX(90deg)" }}/>
    </>
  );

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 space-y-3">
      <p className="text-white/50 text-[10px] text-center font-body">{dragHint}</p>
      <div className="relative mx-auto select-none overflow-visible flex items-center justify-center"
        style={{ height:200, cursor:isDragging?"grabbing":"grab" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <div style={{
          width:BW, height:BH+SH, position:"relative",
          transformStyle:"preserve-3d",
          transform:`perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition:isDragging?"none":TRANS,
        }}>
          {box(BW, BH, BD, 0, SH, c1)}
          {box(SW, SH, BD, 0, 0, c2)}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {legendItems.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background:color }}/>
            <span className="text-white/50 text-[9px] font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SVGs — BANGUN RUANG GABUNGAN
───────────────────────────────────────────────────────────── */
const BalokLimasSVG = ({ lang }: { lang: string }) => {
  const caption = lang === "en" ? "Box + Square Pyramid" : lang === "ja" ? "直方体 + 四角錐" : "Balok + Limas Segiempat";
  return (
    <svg width="210" height="185" viewBox="0 0 210 185" className="mx-auto">
      <defs>
        <linearGradient id="gbBalok" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15"/>
        </linearGradient>
        <linearGradient id="gbLimas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <polygon points="30,150 130,150 130,95 30,95" fill="url(#gbBalok)" stroke="#818cf8" strokeWidth="1.5"/>
      <polygon points="130,150 155,125 155,70 130,95" fill="#6366f1" fillOpacity="0.2" stroke="#818cf8" strokeWidth="1.5"/>
      <polygon points="30,95 130,95 155,70 55,70" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.5"/>
      <line x1="30" y1="150" x2="55" y2="125" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="55" y1="125" x2="155" y2="125" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="55" y1="125" x2="55" y2="70" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <text x="75" y="165" fill="#818cf8" fontSize="9" textAnchor="middle">p</text>
      <text x="155" y="112" fill="#818cf8" fontSize="9" textAnchor="middle">l</text>
      <text x="12" y="125" fill="#818cf8" fontSize="9" textAnchor="middle">t₁</text>
      <line x1="92" y1="22" x2="30" y2="95" stroke="#f43f5e" strokeWidth="1.8"/>
      <line x1="92" y1="22" x2="130" y2="95" stroke="#f43f5e" strokeWidth="1.8"/>
      <line x1="92" y1="22" x2="155" y2="70" stroke="#f43f5e" strokeWidth="1.8"/>
      <line x1="92" y1="22" x2="55" y2="70" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
      <polygon points="30,95 130,95 92,22" fill="url(#gbLimas)" stroke="#f43f5e" strokeWidth="1.5"/>
      <polygon points="130,95 155,70 92,22" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1.5"/>
      <circle cx="92" cy="22" r="3" fill="#fb7185"/>
      <text x="88" y="16" fill="#fb7185" fontSize="9" fontFamily="monospace">T</text>
      <text x="168" y="45" fill="#fb7185" fontSize="9">t₂</text>
      <text x="105" y="180" fill="#818cf8" fontSize="8" textAnchor="middle">{caption}</text>
    </svg>
  );
};

const KubusPrismaSVG = ({ lang }: { lang: string }) => {
  const caption = lang === "en" ? "Cube + Triangular Prism (House)" : lang === "ja" ? "立方体 + 三角柱（家）" : "Kubus + Prisma Segitiga (Rumah)";
  return (
    <svg width="210" height="185" viewBox="0 0 210 185" className="mx-auto">
      <polygon points="30,155 110,155 110,95 30,95" fill="#6366f1" fillOpacity="0.35" stroke="#818cf8" strokeWidth="1.5"/>
      <polygon points="110,155 135,130 135,70 110,95" fill="#6366f1" fillOpacity="0.2" stroke="#818cf8" strokeWidth="1.5"/>
      <polygon points="30,95 110,95 135,70 55,70" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.5"/>
      <line x1="30" y1="155" x2="55" y2="130" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="55" y1="130" x2="135" y2="130" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="55" y1="130" x2="55" y2="70" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="70" y1="45" x2="158" y2="45" stroke="#f59e0b" strokeWidth="1.8"/>
      <polygon points="30,95 110,95 158,45 70,45" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.5"/>
      <polygon points="110,95 135,70 158,45" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5"/>
      <polygon points="30,95 55,70 70,45" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
      <polygon points="30,95 110,95 70,45" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5"/>
      {[[70,45],[158,45]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="2" fill="#fcd34d"/>))}
      <text x="62" y="42" fill="#fcd34d" fontSize="9" fontFamily="monospace">P</text>
      <text x="160" y="42" fill="#fcd34d" fontSize="9" fontFamily="monospace">Q</text>
      <text x="105" y="177" fill="#818cf8" fontSize="8" textAnchor="middle">{caption}</text>
    </svg>
  );
};

const DuaBalokSVG = ({ lang }: { lang: string }) => {
  const caption = lang === "en" ? "Two Boxes Combined (Step shape)" : lang === "ja" ? "2つの直方体（段差形）" : "Gabungan 2 Balok (Undakan)";
  return (
    <svg width="215" height="175" viewBox="0 0 215 175" className="mx-auto">
      <polygon points="10,155 90,155 90,100 10,100" fill="#6366f1" fillOpacity="0.35" stroke="#818cf8" strokeWidth="1.5"/>
      <polygon points="90,155 110,138 110,83 90,100" fill="#6366f1" fillOpacity="0.2" stroke="#818cf8" strokeWidth="1.5"/>
      <polygon points="10,100 90,100 110,83 30,83" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.5"/>
      <line x1="10" y1="155" x2="30" y2="138" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="30" y1="138" x2="110" y2="138" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="30" y1="138" x2="30" y2="83" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <polygon points="90,100 165,100 165,55 90,55" fill="#f43f5e" fillOpacity="0.35" stroke="#fb7185" strokeWidth="1.5"/>
      <polygon points="165,100 185,83 185,38 165,55" fill="#f43f5e" fillOpacity="0.2" stroke="#fb7185" strokeWidth="1.5"/>
      <polygon points="90,55 165,55 185,38 110,38" fill="#f43f5e" fillOpacity="0.3" stroke="#fb7185" strokeWidth="1.5"/>
      <line x1="90" y1="100" x2="110" y2="83" stroke="#fb7185" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="110" y1="83" x2="185" y2="83" stroke="#fb7185" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <line x1="110" y1="83" x2="110" y2="38" stroke="#fb7185" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <text x="105" y="168" fill="#818cf8" fontSize="8" textAnchor="middle">{caption}</text>
    </svg>
  );
};

const LuasGabunganSVG = ({ lang }: { lang: string }) => {
  const visible   = lang === "en" ? "✓ visible"   : lang === "ja" ? "✓ 見える"     : "✓ terlihat";
  const hidden    = lang === "en" ? "✗ hidden"    : lang === "ja" ? "✗ 隠れている" : "✗ tersembunyi";
  const caption   = lang === "en" ? "Base of pyramid = Top of box (not counted twice)"
    : lang === "ja" ? "角錐の底面 = 直方体の上面（2回数えない）"
    : "Alas limas = Atap balok (tidak dihitung 2x)";
  const faceLabel = lang === "en" ? "Face" : lang === "ja" ? "面" : "Bidang";
  return (
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
      <text x="200" y="55" fill="#94a3b8" fontSize="9" fontFamily="monospace">{faceLabel}</text>
      <text x="200" y="68" fill="#22c55e" fontSize="9" fontFamily="monospace" className="lg-x">{visible}</text>
      <text x="200" y="85" fill="#f43f5e" fontSize="9" fontFamily="monospace" className="lg-x">{hidden}</text>
      <line x1="30" y1="135" x2="120" y2="135" stroke="#22c55e" strokeWidth="2.5"/>
      <line x1="30" y1="135" x2="30" y2="85" stroke="#22c55e" strokeWidth="2.5"/>
      <line x1="120" y1="135" x2="140" y2="118" stroke="#22c55e" strokeWidth="2.5"/>
      <line x1="30" y1="85" x2="120" y2="85" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,3"/>
      <text x="120" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle">{caption}</text>
    </svg>
  );
};

const RusukGabunganSVG = ({ lang }: { lang: string }) => {
  const lb1 = lang === "en" ? "Box edges (12)"     : lang === "ja" ? "直方体の辺 (12)" : "Rusuk Balok (12)";
  const lb2 = lang === "en" ? "Shared edges (4)"   : lang === "ja" ? "共有辺 (4)"      : "Rusuk Bersama (4)";
  const lb3 = lang === "en" ? "Pyramid edges (4+4=8)": lang === "ja" ? "角錐の辺 (4+4=8)": "Rusuk Limas (4+4=8)";
  const total = lang === "en" ? "Total combined edges = 12 + 8 − 4 = 16"
    : lang === "ja" ? "組み合わせの辺の合計 = 12 + 8 − 4 = 16"
    : "Total rusuk gabungan = 12 + 8 − 4 = 16";
  return (
    <svg viewBox="0 0 320 210" className="w-full max-w-xs mx-auto">
      <defs>
        <style>{`
          @keyframes rgPulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
          .rg-shared{animation:rgPulse 1.8s ease-in-out infinite;}
          .rg-limas{animation:rgPulse 1.8s ease-in-out infinite 0.6s;}
        `}</style>
      </defs>
      <polygon points="50,165 150,165 150,105 50,105" fill="#6366f1" fillOpacity="0.25" stroke="none"/>
      <polygon points="150,165 175,142 175,82 150,105" fill="#4f46e5" fillOpacity="0.18" stroke="none"/>
      <polygon points="50,105 150,105 175,82 75,82" fill="#818cf8" fillOpacity="0.22" stroke="none"/>
      <line x1="50" y1="165" x2="150" y2="165" stroke="#818cf8" strokeWidth="2"/>
      <line x1="150" y1="165" x2="175" y2="142" stroke="#818cf8" strokeWidth="2"/>
      <line x1="50" y1="165" x2="75" y2="142" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.5"/>
      <line x1="75" y1="142" x2="175" y2="142" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.5"/>
      <line x1="50" y1="165" x2="50" y2="105" stroke="#818cf8" strokeWidth="2"/>
      <line x1="150" y1="165" x2="150" y2="105" stroke="#818cf8" strokeWidth="2"/>
      <line x1="175" y1="142" x2="175" y2="82" stroke="#818cf8" strokeWidth="2"/>
      <line x1="75" y1="142" x2="75" y2="82" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.5"/>
      <line x1="50" y1="105" x2="150" y2="105" stroke="#facc15" strokeWidth="2.5" className="rg-shared"/>
      <line x1="150" y1="105" x2="175" y2="82" stroke="#facc15" strokeWidth="2.5" className="rg-shared"/>
      <line x1="50" y1="105" x2="75" y2="82" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3" className="rg-shared"/>
      <line x1="75" y1="82" x2="175" y2="82" stroke="#facc15" strokeWidth="2.5" className="rg-shared"/>
      <line x1="112" y1="35" x2="50" y2="105" stroke="#f43f5e" strokeWidth="2" className="rg-limas"/>
      <line x1="112" y1="35" x2="150" y2="105" stroke="#f43f5e" strokeWidth="2" className="rg-limas"/>
      <line x1="112" y1="35" x2="175" y2="82" stroke="#f43f5e" strokeWidth="2" className="rg-limas"/>
      <line x1="112" y1="35" x2="75" y2="82" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.7" className="rg-limas"/>
      <circle cx="112" cy="35" r="4" fill="#fb7185"/>
      {[[50,165],[150,165],[50,105],[150,105],[175,82],[175,142]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3.5" fill="#818cf8"/>
      ))}
      <circle cx="75" cy="82" r="3.5" fill="#818cf8" opacity="0.5"/>
      <circle cx="75" cy="142" r="3.5" fill="#818cf8" opacity="0.5"/>
      <line x1="195" y1="80" x2="215" y2="80" stroke="#818cf8" strokeWidth="2"/>
      <text x="220" y="84" fill="#818cf8" fontSize="9" fontFamily="monospace">{lb1}</text>
      <line x1="195" y1="98" x2="215" y2="98" stroke="#facc15" strokeWidth="2.5"/>
      <text x="220" y="102" fill="#facc15" fontSize="9" fontFamily="monospace">{lb2}</text>
      <line x1="195" y1="116" x2="215" y2="116" stroke="#f43f5e" strokeWidth="2"/>
      <text x="220" y="120" fill="#f43f5e" fontSize="9" fontFamily="monospace">{lb3}</text>
      <text x="160" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle">{total}</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   JARING-JARING GABUNGAN INTERAKTIF
───────────────────────────────────────────────────────────── */
const JaringGabunganInteraktif = ({ lang }: { lang: string }) => {
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

  const RX = -22 * Math.PI / 180;
  const RY =  35 * Math.PI / 180;
  const net3dLbl = lang === "en"
    ? { balok: "BOX", limas: "PYRAMID" }
    : lang === "ja"
    ? { balok: "直方体", limas: "角錐" }
    : { balok: "BALOK", limas: "LIMAS" };
  const { verts: blVerts, faces: blFaces } = makeBalokLimasData(68, 48, 44, 38, net3dLbl);
  const tfV = blVerts.map(v => gRotX(gRotY(v, RY), RX));
  const pV  = tfV.map(v => gProj(v, 380, 1.35));
  const cx3 = 200, cy3 = 148;
  const sorted3 = blFaces.map(f => {
    const avgZ  = f.idx.reduce((s, i) => s + tfV[i][2], 0) / f.idx.length;
    const pts2d = f.idx.map(i => pV[i]);
    return { ...f, avgZ, pts2d };
  }).sort((a, b) => b.avgZ - a.avgZ);

  type NetFace = { pts: [number,number][]; color: string; label: string; isShared?: boolean };
  // Net face labels
  const sharedLabel = lang === "en" ? "✗ Shared Face" : lang === "ja" ? "✗ 共有面" : "✗ Bidang Beririsan";
  const delta = (n: number) => `Δ ${lang === "en" ? "Pyr" : lang === "ja" ? "角錐" : "Limas"} ${n}`;
  const back   = lang === "en" ? "Back"   : lang === "ja" ? "背面" : "Belakang";
  const front  = lang === "en" ? "Front"  : lang === "ja" ? "前面" : "Depan";
  const base   = lang === "en" ? "Base"   : lang === "ja" ? "底面" : "Alas";
  const right  = lang === "en" ? "Right"  : lang === "ja" ? "右面" : "Kanan";
  const left   = lang === "en" ? "Left"   : lang === "ja" ? "左面" : "Kiri";

  const netFaces: NetFace[] = [
    { pts:[[165,73],[235,73],[235,121],[165,121]], color:"#ef4444", label:sharedLabel, isShared:true },
    { pts:[[165,73],[235,73],[200,37]],            color:"#f59e0b", label:delta(1) },
    { pts:[[235,73],[235,121],[271,97]],           color:"#fbbf24", label:delta(2) },
    { pts:[[165,73],[165,121],[129,97]],           color:"#d97706", label:delta(3) },
    { pts:[[165,121],[235,121],[200,157]],         color:"#f97316", label:delta(4) },
    { pts:[[165,174],[235,174],[235,216],[165,216]], color:"#4f46e5", label:back },
    { pts:[[165,216],[235,216],[235,258],[165,258]], color:"#6366f1", label:front },
    { pts:[[165,258],[235,258],[235,306],[165,306]], color:"#312e81", label:base },
    { pts:[[235,216],[283,216],[283,258],[235,258]], color:"#818cf8", label:right },
    { pts:[[117,216],[165,216],[165,258],[117,258]], color:"#818cf8", label:left },
  ];

  const btnLabel = isNet
    ? (lang === "en" ? "🔄 Assemble" : lang === "ja" ? "🔄 組み立てる" : "🔄 Rakit Kembali")
    : (lang === "en" ? "📤 Unfold Net" : lang === "ja" ? "📤 展開図を広げる" : "📤 Bongkar Jaring-jaring");
  const model3dNote = lang === "en" ? "3D Model Box + Pyramid · press Unfold for net"
    : lang === "ja" ? "3Dモデル 直方体+角錐 · 展開を押して展開図を見る"
    : "Model 3D Balok + Limas · tekan Bongkar untuk jaring-jaring";
  const netNote = lang === "en" ? "9 visible faces: 4 pyramid triangles + 5 box sides (shared face ✗)"
    : lang === "ja" ? "9つの面: 角錐の三角形4 + 直方体の面5（共有面✗）"
    : "9 bidang terlihat: 4 segitiga limas + 5 sisi balok (alas beririsan ✗)";
  const limasSect = lang === "en" ? "▲ PYRAMID" : lang === "ja" ? "▲ 角錐" : "▲ LIMAS";
  const balokSect = lang === "en" ? "▬ BOX"     : lang === "ja" ? "▬ 直方体" : "▬ BALOK";
  const legendItems = lang === "en"
    ? [{ c:"#f59e0b", l:"4 Pyramid Triangles" }, { c:"#6366f1", l:"5 Box Faces (no top)" }, { c:"#ef4444", l:"Shared Face ✗" }]
    : lang === "ja"
    ? [{ c:"#f59e0b", l:"角錐の三角形 4枚" }, { c:"#6366f1", l:"直方体の面5（上面なし）" }, { c:"#ef4444", l:"共有面 ✗" }]
    : [{ c:"#f59e0b", l:"4 Segitiga Limas" }, { c:"#6366f1", l:"5 Sisi Balok (tanpa tutup)" }, { c:"#ef4444", l:"Bidang Beririsan ✗" }];

  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 space-y-2">
      <div className="relative" style={{ height:305 }}>
        <svg viewBox="0 0 400 305" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", opacity:1-progress, pointerEvents:progress>0.4?"none":"auto" }}>
          {sorted3.map((f,i)=>{
            const pts = f.pts2d.map(([x,y])=>`${cx3+x},${cy3+y}`).join(" ");
            const mx  = f.pts2d.reduce((s,p)=>s+p[0],0)/f.pts2d.length;
            const my  = f.pts2d.reduce((s,p)=>s+p[1],0)/f.pts2d.length;
            return (
              <g key={i}>
                <polygon points={pts} fill={f.color} fillOpacity={0.88} stroke="rgba(255,255,255,0.5)" strokeWidth={1.3} strokeLinejoin="round"/>
                {f.label && (
                  <text x={cx3+mx} y={cy3+my+3} fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents:"none" }}>{f.label}</text>
                )}
              </g>
            );
          })}
          <text x="200" y="298" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="monospace">{model3dNote}</text>
        </svg>
        <svg viewBox="0 0 400 320" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", opacity:progress, pointerEvents:progress<0.6?"none":"auto" }}>
          <text x="80" y="97" fontSize="9" fill="#a78bfa" fontFamily="monospace" fontWeight="bold">{limasSect}</text>
          <line x1="80" y1="165" x2="320" y2="165" stroke="#334155" strokeWidth="1.2" strokeDasharray="6,4"/>
          <text x="80" y="188" fontSize="9" fill="#6366f1" fontFamily="monospace" fontWeight="bold">{balokSect}</text>
          {netFaces.map((f,i)=>{
            const pts = f.pts.map(([x,y])=>`${x},${y}`).join(" ");
            const mx  = f.pts.reduce((s,p)=>s+p[0],0)/f.pts.length;
            const my  = f.pts.reduce((s,p)=>s+p[1],0)/f.pts.length;
            return (
              <g key={i}>
                <polygon points={pts}
                  fill={f.color} fillOpacity={f.isShared?0.22:0.82}
                  stroke={f.isShared?"#ef4444":"rgba(255,255,255,0.55)"}
                  strokeWidth={f.isShared?2:1.2}
                  strokeDasharray={f.isShared?"5,3":undefined}/>
                {f.isShared && (
                  <>
                    <line x1={f.pts[0][0]} y1={f.pts[0][1]} x2={f.pts[2][0]} y2={f.pts[2][1]} stroke="#ef4444" strokeWidth={2} opacity={0.65}/>
                    <line x1={f.pts[1][0]} y1={f.pts[1][1]} x2={f.pts[3][0]} y2={f.pts[3][1]} stroke="#ef4444" strokeWidth={2} opacity={0.65}/>
                  </>
                )}
                <text x={mx} y={my+4} fill={f.isShared?"#fca5a5":"white"}
                  fontSize={f.isShared?6:7.5} fontFamily="monospace" fontWeight="bold"
                  textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents:"none" }}>
                  {f.label}
                </text>
              </g>
            );
          })}
          <text x="200" y="316" textAnchor="middle" fontSize="8" fill="#facc15" fontFamily="monospace">{netNote}</text>
        </svg>
      </div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => animateTo(isNet ? 0 : 1)}
          className="text-xs font-bold py-2 px-5 rounded-lg border font-body transition-all duration-200"
          style={{ borderColor:isNet?"#22c55e":"#f97316", color:isNet?"#22c55e":"#f97316", backgroundColor:"transparent" }}>
          {btnLabel}
        </button>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {legendItems.map(({c,l})=>(
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
   EXAMPLE CARD
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const ExampleCard = ({ ex, idx, prefix, showLbl, hideLbl }: {
  ex: Ex; idx: number; prefix: string; showLbl: string; hideLbl: string;
}) => {
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
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? hideLbl : showLbl}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────── */
export default function GabunganPage() {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const translations = {
    id: {
      title: "BANGUN RUANG GABUNGAN",
      subtitle: "Kelas 8 · Bangun Ruang Sisi Datar",
      slideLabel: "Slide",
      prev: "← Sebelumnya", next: "Selanjutnya →",
      back: "← Kembali ke Bangun Ruang Sisi Datar",
      easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
      prefix: "Soal",
      show: "Lihat Pembahasan", hide: "Sembunyikan",
    },
    en: {
      title: "COMPOSITE SOLID FIGURES",
      subtitle: "Grade 8 · Solid Figures with Flat Faces",
      slideLabel: "Slide",
      prev: "← Previous", next: "Next →",
      back: "← Back to Solid Figures",
      easy: "EASY", medium: "MEDIUM", hard: "HARD",
      prefix: "Ex",
      show: "Show Solution", hide: "Hide",
    },
    ja: {
      title: "複合立体図形",
      subtitle: "中学2年 · 平面で囲まれた立体",
      slideLabel: "スライド",
      prev: "← 前へ", next: "次へ →",
      back: "← 立体図形に戻る",
      easy: "基本", medium: "標準", hard: "発展",
      prefix: "例題",
      show: "解説を見る", hide: "隠す",
    },
  };
  const t = translations[lang as keyof typeof translations] ?? translations.id;

  // ── Examples
  const examples: Ex[] = [
    {
      level: t.easy,
      color:"text-green-400", bg:"bg-green-950/30", border:"border-green-700/50", badgeBg:"bg-green-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          <p>
            {lang === "en"
              ? <>A monument shaped as a box <InlineMath math="5 \times 5 \times 8"/> m with a square pyramid on top (same base, pyramid height 3 m). Find the <strong>total volume</strong>.</>
              : lang === "ja"
              ? <>底面<InlineMath math="5 \times 5"/>m、高さ8mの直方体の上に正四角錐（底面同じ、高さ3m）が乗っている記念碑。<strong>合計体積</strong>を求めよ。</>
              : <>Sebuah tugu berbentuk balok berukuran <InlineMath math="5 \times 5 \times 8"/> m dengan limas segiempat beraturan di atasnya (alas sama, tinggi limas 3 m). Hitunglah <strong>volume total</strong> tugu tersebut!</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
            <BlockMath math="V_b = 5 \times 5 \times 8 = 200\text{ m}^3"/>
            <BlockMath math="V_l = \tfrac{1}{3} \times 25 \times 3 = 25\text{ m}^3"/>
            <BlockMath math="V_t = 200 + 25 = 225\text{ m}^3"/>
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
            <p className="text-green-300 font-semibold text-xs">✅ {lang === "en" ? "Total volume" : lang === "ja" ? "合計体積" : "Volume total"} = <InlineMath math="225\text{ m}^3"/></p>
          </div>
        </div>
      ),
    },
    {
      level: t.medium,
      color:"text-yellow-400", bg:"bg-yellow-950/30", border:"border-yellow-700/50", badgeBg:"bg-yellow-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          <p>
            {lang === "en"
              ? <>A house model consists of a cube (s = 6 cm) as body and a triangular prism as roof (base 6 cm, triangle height 4 cm, roof length 6 cm). Find the <strong>total volume</strong>.</>
              : lang === "ja"
              ? <>立方体（s = 6 cm）の上に三角柱の屋根（底辺6cm、三角形の高さ4cm、長さ6cm）を乗せた家の模型。<strong>合計体積</strong>を求めよ。</>
              : <>Sebuah miniatur rumah berbentuk kubus (s = 6 cm) sebagai badan dan prisma segitiga sama kaki sebagai atap (alas 6 cm, tinggi segitiga 4 cm, panjang atap 6 cm). Tentukan <strong>volume total</strong>!</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
            <BlockMath math="V_k = 6^3 = 216\text{ cm}^3"/>
            <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 6 \times 4 = 12\text{ cm}^2"/>
            <BlockMath math="V_{\text{prisma}} = 12 \times 6 = 72\text{ cm}^3"/>
            <BlockMath math="V_t = 216 + 72 = 288\text{ cm}^3"/>
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
            <p className="text-yellow-300 font-semibold text-xs">✅ {lang === "en" ? "Total volume" : lang === "ja" ? "合計体積" : "Volume total"} = <InlineMath math="288\text{ cm}^3"/></p>
          </div>
        </div>
      ),
    },
    {
      level: t.hard,
      color:"text-red-400", bg:"bg-red-950/30", border:"border-red-700/50", badgeBg:"bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          <p>
            {lang === "en"
              ? <>A house model: box (<InlineMath math="10 \times 8 \times 6"/> cm) + triangular prism roof (base 10 cm, triangle height 4 cm, length 8 cm). Find the <strong>visible surface area</strong> (box base, 4 box sides, 2 gable triangles, 2 sloped sides).</>
              : lang === "ja"
              ? <>家の模型：直方体（<InlineMath math="10 \times 8 \times 6"/>cm）＋三角柱の屋根（底辺10cm、三角形の高さ4cm、長さ8cm）。<strong>見える表面積</strong>（底面、4つの側面、2つの妻三角形、2つの斜面）を求めよ。</>
              : <>Rumah miniatur terdiri dari balok (<InlineMath math="10 \times 8 \times 6"/> cm) dan atap prisma segitiga sama kaki (alas 10 cm, tinggi segitiga 4 cm, panjang 8 cm). Hitung <strong>luas permukaan yang terlihat dari luar</strong>.</>}
          </p>
          <p className="text-xs text-white/60">
            {lang === "en" ? "Note: box top is covered by roof — not counted."
            : lang === "ja" ? "注: 直方体の上面は屋根で隠れているので数えない。"
            : "Sisi atas balok tertutup atap, tidak dihitung."}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 1 — Visible box faces (no top):"
            : lang === "ja" ? "ステップ1 — 見える直方体の面（上面なし）:"
            : "Langkah 1 — Sisi balok yang terlihat (tanpa tutup atas):"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
            <BlockMath math="L_a = 10 \times 8 = 80\text{ cm}^2"/>
            <BlockMath math="L_{\text{4 sisi}} = 2(10\times6) + 2(8\times6) = 120 + 96 = 216\text{ cm}^2"/>
          </div>
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 2 — Prism roof:" : lang === "ja" ? "ステップ2 — 三角柱の屋根:" : "Langkah 2 — Atap prisma:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
            <BlockMath math="L_{\triangle} = 2 \times \tfrac{1}{2} \times 10 \times 4 = 40\text{ cm}^2"/>
            <p className="text-white/60">{lang === "en" ? "Slope apothem = √(4²+5²) = √41 ≈ 6.4 cm" : lang === "ja" ? "斜面の斜高 = √(4²+5²) = √41 ≈ 6.4 cm" : "Apotema sisi miring atap = √(4²+5²) = √41 ≈ 6,4 cm"}</p>
            <BlockMath math="L_m = 2 \times (6{,}4 \times 8) = 102{,}4\text{ cm}^2"/>
          </div>
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 3 — Total:" : lang === "ja" ? "ステップ3 — 合計:" : "Langkah 3 — Total:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math="L_p = 80 + 216 + 40 + 102{,}4 = 438{,}4\text{ cm}^2"/>
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-2 text-xs">
            <p className="text-red-300 font-semibold">✅ {lang === "en" ? "Surface area" : lang === "ja" ? "表面積" : "Luas permukaan"} ≈ <InlineMath math="438{,}4\text{ cm}^2"/></p>
          </div>
        </div>
      ),
    },
  ];

  // ── Slides
  type Slide = { icon: string; title: string; content: React.ReactNode };
  const slides: Slide[] = [
    {
      icon: "🏗️",
      title: lang === "en" ? "Introduction" : lang === "ja" ? "はじめに" : "Pengantar",
      content: (
        <div className="space-y-3 text-sm font-body text-white/75 leading-relaxed">
          <p>
            {lang === "en"
              ? <><strong className="text-cyan-300">Composite solid figures</strong> are formed by combining two or more basic solid shapes. Real examples: houses (cube + prism roof), monuments (box + pyramid), multi-story buildings (stacked boxes), and more.</>
              : lang === "ja"
              ? <><strong className="text-cyan-300">複合立体図形</strong>は2つ以上の基本的な立体を組み合わせて作られます。例: 家（立方体＋三角柱の屋根）、記念碑（直方体＋角錐）、多階建て（直方体の積み重ね）など。</>
              : <><strong className="text-cyan-300">Bangun ruang gabungan</strong> adalah bangun ruang yang terbentuk dari dua atau lebih bangun ruang dasar yang digabungkan. Contoh nyata: rumah (kubus + prisma atap), tugu (balok + limas), gedung bertingkat (beberapa balok), dan lain-lain.</>}
          </p>
          <ThreeGabungan3D/>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/60 space-y-1">
            <p className="text-cyan-300 font-semibold mb-1">📋 {lang === "en" ? "Topics:" : lang === "ja" ? "トピック:" : "Materi dalam bab ini:"}</p>
            <p>• {lang === "en" ? "Edges & vertices of composite solids" : lang === "ja" ? "複合立体の辺と頂点" : "Rusuk & titik sudut gabungan"}</p>
            <p>• {lang === "en" ? "Surface area + interactive net" : lang === "ja" ? "表面積 + インタラクティブ展開図" : "Luas permukaan gabungan + jaring-jaring interaktif"}</p>
            <p>• {lang === "en" ? "Volume of composite solids" : lang === "ja" ? "複合立体の体積" : "Volume gabungan"}</p>
            <p>• {lang === "en" ? "Example: Box + Pyramid" : lang === "ja" ? "例: 直方体 + 角錐" : "Contoh: Balok + Limas"}</p>
            <p>• {lang === "en" ? "Example: Cube + Prism (House)" : lang === "ja" ? "例: 立方体 + 三角柱（家）" : "Example: Kubus/Balok + Prisma (Rumah)"}</p>
            <p>• {lang === "en" ? "Example: Two boxes combined" : lang === "ja" ? "例: 2つの直方体" : "Contoh: Gabungan dua balok"}</p>
            <p>• {lang === "en" ? "Graded examples" : lang === "ja" ? "段階的な例題" : "Contoh soal bertingkat"}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "📐",
      title: lang === "en" ? "Edges & Vertices of Composite Solids" : lang === "ja" ? "複合立体の辺と頂点" : "Rusuk & Titik Sudut Gabungan",
      content: (
        <div className="space-y-3 text-sm font-body text-white/85">
          <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-xs space-y-1">
            <p className="text-violet-300 font-semibold">
              💡 {lang === "en" ? "Key Concept:" : lang === "ja" ? "重要概念:" : "Konsep Dasar:"}
            </p>
            <p className="text-white/75">
              {lang === "en"
                ? <>When two solids are joined, <strong className="text-yellow-300">shared edges & vertices are counted only once</strong>. Internal edges (inside the joint) are not external edges.</>
                : lang === "ja"
                ? <>2つの立体を結合すると、<strong className="text-yellow-300">共有辺・頂点は1回だけ数える</strong>。内部に隠れた辺は外部の辺に含まれません。</>
                : <>Ketika dua bangun digabung, <strong className="text-yellow-300">rusuk & titik sudut yang berhimpit dihitung sekali</strong>. Rusuk yang menempel di dalam (beririsan) tidak termasuk rusuk luar.</>}
            </p>
          </div>
          <RusukGabunganSVG lang={lang}/>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "Example: Box + Square Pyramid" : lang === "ja" ? "例: 直方体 + 四角錐" : "Contoh: Balok + Limas Segiempat"}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-[10px] border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-600 px-2 py-1 text-white/60">{lang === "en" ? "Shape" : lang === "ja" ? "立体" : "Bangun"}</th>
                    <th className="border border-slate-600 px-2 py-1 text-indigo-300">{lang === "en" ? "Edges" : lang === "ja" ? "辺" : "Rusuk"}</th>
                    <th className="border border-slate-600 px-2 py-1 text-emerald-300">{lang === "en" ? "Vertices" : lang === "ja" ? "頂点" : "Titik Sudut"}</th>
                    <th className="border border-slate-600 px-2 py-1 text-orange-300">{lang === "en" ? "Outer Faces" : lang === "ja" ? "外面" : "Sisi Luar"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-600 px-2 py-1">{lang === "en" ? "Box" : lang === "ja" ? "直方体" : "Balok"}</td>
                    <td className="border border-slate-600 px-2 py-1 text-indigo-300">12</td>
                    <td className="border border-slate-600 px-2 py-1 text-emerald-300">8</td>
                    <td className="border border-slate-600 px-2 py-1 text-orange-300">6</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-600 px-2 py-1">{lang === "en" ? "Square Pyramid" : lang === "ja" ? "四角錐" : "Limas Segiempat"}</td>
                    <td className="border border-slate-600 px-2 py-1 text-indigo-300">8</td>
                    <td className="border border-slate-600 px-2 py-1 text-emerald-300">5</td>
                    <td className="border border-slate-600 px-2 py-1 text-orange-300">5</td>
                  </tr>
                  <tr className="bg-slate-700/40">
                    <td className="border border-slate-600 px-2 py-1 text-yellow-300 font-bold">{lang === "en" ? "Shared" : lang === "ja" ? "共有" : "Rusuk bersama"}</td>
                    <td className="border border-slate-600 px-2 py-1 text-yellow-300">−4</td>
                    <td className="border border-slate-600 px-2 py-1 text-yellow-300">−4</td>
                    <td className="border border-slate-600 px-2 py-1 text-yellow-300">−2</td>
                  </tr>
                  <tr className="bg-cyan-950/40">
                    <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">{lang === "en" ? "Combined" : lang === "ja" ? "合計" : "Gabungan"}</td>
                    <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">16</td>
                    <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">9</td>
                    <td className="border border-slate-600 px-2 py-1 text-cyan-300 font-bold">9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-yellow-950/40 border border-yellow-700/30 rounded-lg p-3 text-xs text-yellow-200 space-y-1">
            <p className="font-semibold">📏 {lang === "en" ? "General Formula:" : lang === "ja" ? "一般公式:" : "Rumus Umum:"}</p>
            <p><strong className="text-cyan-300">{lang === "en" ? "Combined edges" : lang === "ja" ? "辺の合計" : "Rusuk gabungan"}</strong> = {lang === "en" ? "Edges A + Edges B − Shared edges" : lang === "ja" ? "辺A + 辺B − 共有辺" : "Rusuk A + Rusuk B − Rusuk bersama"}</p>
            <p><strong className="text-cyan-300">{lang === "en" ? "Combined vertices" : lang === "ja" ? "頂点の合計" : "Titik sudut gabungan"}</strong> = {lang === "en" ? "Vertices A + Vertices B − Shared vertices" : lang === "ja" ? "頂点A + 頂点B − 共有頂点" : "Titik A + Titik B − Titik bersama"}</p>
            <p><strong className="text-cyan-300">{lang === "en" ? "Outer faces" : lang === "ja" ? "外面" : "Sisi luar"}</strong> = {lang === "en" ? "Faces A + Faces B − 2 × shared faces" : lang === "ja" ? "面A + 面B − 2×共有面" : "Sisi A + Sisi B − 2 × bidang beririsan"}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "🔲",
      title: lang === "en" ? "Surface Area & Net" : lang === "ja" ? "表面積と展開図" : "Luas Permukaan & Jaring-jaring",
      content: (
        <div className="space-y-3 text-sm font-body text-white/85">
          <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-xs">
            <p className="text-violet-300 font-semibold mb-1">
              ⚠️ {lang === "en" ? "Main Rule:" : lang === "ja" ? "主なルール:" : "Aturan Utama:"}
            </p>
            <p className="text-white/75">
              {lang === "en"
                ? <>Faces that <strong className="text-red-400">touch (shared faces)</strong> between two solids are <strong className="text-red-400">NOT counted</strong> in the combined surface area.</>
                : lang === "ja"
                ? <>2つの立体の<strong className="text-red-400">接触している面（共有面）</strong>は複合表面積に<strong className="text-red-400">含めない</strong>。</>
                : <>Bidang yang <strong className="text-red-400">beririsan (saling menempel)</strong> antara dua bangun <strong className="text-red-400">TIDAK dihitung</strong> dalam luas permukaan gabungan.</>}
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "Combined Surface Area Formula:" : lang === "ja" ? "複合表面積の公式:" : "Rumus Luas Permukaan Gabungan:"}
            </p>
            <BlockMath math="L_{\text{gab}} = (L_A - L_{\text{beririsan}}) + (L_B - L_{\text{beririsan}})"/>
            <p className="text-white/55">
              {lang === "en" ? "Subtract shared faces from each solid before summing."
              : lang === "ja" ? "合計前に各立体から共有面を引く。"
              : "Setiap bangun dikurangi bidang yang menempel sebelum dijumlahkan."}
            </p>
          </div>
          <p className="text-white/55 text-xs text-center">
            {lang === "en" ? "Press the button to unfold the Box + Pyramid net!"
            : lang === "ja" ? "ボタンを押して直方体＋角錐の展開図を開いてください！"
            : "Tekan tombol untuk membongkar jaring-jaring Balok + Limas!"}
          </p>
          <JaringGabunganInteraktif lang={lang}/>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1">
            <p className="text-orange-300 font-semibold">
              {lang === "en" ? "Example — Box (p×l×t₁) + Square Pyramid (height t₂):"
              : lang === "ja" ? "例 — 直方体（p×l×t₁）+ 四角錐（高さt₂）:"
              : "Contoh Balok (p×l×t₁) + Limas segiempat (tinggi t₂):"}
            </p>
            <BlockMath math="L = \underbrace{(p \cdot l + 2pl' + 2ll')}_{\text{box without top}} + \underbrace{4 \cdot L_{\triangle}}_{\text{pyramid faces}}"/>
            <p className="text-white/50">
              {lang === "en" ? "Pyramid base = box top → shared, not counted twice!"
              : lang === "ja" ? "角錐の底面 = 直方体の上面 → 共有、2回数えない！"
              : "Alas limas = tutup balok → bidang beririsan, tidak dihitung dua kali!"}
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: "📦",
      title: lang === "en" ? "Volume of Composite Solids" : lang === "ja" ? "複合立体の体積" : "Volume Gabungan",
      content: (
        <div className="space-y-3 text-sm font-body text-white/85">
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">
              💡 {lang === "en" ? "Method 1 — Addition:" : lang === "ja" ? "方法1 — 足し算:" : "Cara 1 — Penjumlahan (Penggabungan):"}
            </p>
            <p className="text-white/75">
              {lang === "en"
                ? <>The solid is formed by <strong className="text-yellow-300">joining several parts</strong>. Total volume = sum of all parts.</>
                : lang === "ja"
                ? <><strong className="text-yellow-300">複数の部分を合わせて</strong>立体を作る場合。合計体積 = 各部分の合計。</>
                : <>Bangun terbentuk dari <strong className="text-yellow-300">beberapa bagian yang disatukan</strong>. Volume total = jumlah semua bagian.</>}
            </p>
            <BlockMath math="V_{\text{gabungan}} = V_1 + V_2 + V_3 + \ldots"/>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "Popular combinations:" : lang === "ja" ? "よく使う組み合わせ:" : "Contoh kombinasi populer:"}
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-indigo-950/40 rounded p-2">
                <span className="text-indigo-300 font-bold text-[11px] min-w-fit">
                  {lang === "en" ? "Box + Pyramid:" : lang === "ja" ? "直方体 + 角錐:" : "Balok + Limas:"}
                </span>
                <BlockMath math="V = p \cdot l \cdot t_1 + \tfrac{1}{3} \cdot p \cdot l \cdot t_2"/>
              </div>
              <div className="flex items-start gap-2 bg-amber-950/40 rounded p-2">
                <span className="text-amber-300 font-bold text-[11px] min-w-fit">
                  {lang === "en" ? "Cube + Prism △:" : lang === "ja" ? "立方体 + 三角柱:" : "Kubus + Prisma △:"}
                </span>
                <BlockMath math="V = s^3 + L_{\triangle} \cdot t_{\text{prisma}}"/>
              </div>
              <div className="flex items-start gap-2 bg-emerald-950/40 rounded p-2">
                <span className="text-emerald-300 font-bold text-[11px] min-w-fit">
                  {lang === "en" ? "2 Boxes:" : lang === "ja" ? "2つの直方体:" : "2 Balok:"}
                </span>
                <BlockMath math="V = p_1 l_1 t_1 + p_2 l_2 t_2"/>
              </div>
            </div>
          </div>
          <div className="bg-rose-950/50 border border-rose-700/40 rounded-lg p-3 text-xs space-y-2">
            <p className="text-rose-300 font-semibold">
              ✂️ {lang === "en" ? "Method 2 — Subtraction:" : lang === "ja" ? "方法2 — 引き算:" : "Cara 2 — Pengurangan (Pemotongan):"}
            </p>
            <p className="text-white/75">
              {lang === "en"
                ? <>Sometimes it is easier to imagine the solid as a <strong className="text-yellow-300">whole body with a piece removed</strong>.</>
                : lang === "ja"
                ? <><strong className="text-yellow-300">一部を取り除いた完全な立体</strong>として考えると簡単な場合があります。</>
                : <>Kadang lebih mudah membayangkan bangun sebagai <strong className="text-yellow-300">benda utuh yang sudah diambil sebagian</strong>.</>}
            </p>
            <BlockMath math="V_{\text{gabungan}} = V_{\text{utuh}} - V_{\text{yang diambil}}"/>
          </div>
          <div className="bg-yellow-950/40 border border-yellow-700/30 rounded-lg p-3 text-xs text-yellow-200 space-y-1">
            <p className="font-semibold">⚠️ {lang === "en" ? "Important:" : lang === "ja" ? "注意:" : "Perhatian:"}</p>
            <p>
              {lang === "en" ? "Ensure all dimensions share the same unit before calculating!"
              : lang === "ja" ? "計算前にすべての寸法の単位を統一してください！"
              : "Pastikan satuan semua dimensi sama (cm semua, atau m semua) sebelum menghitung!"}
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: "🏢",
      title: lang === "en" ? "Example: Box + Pyramid" : lang === "ja" ? "例: 直方体 + 角錐" : "Contoh: Balok + Limas",
      content: (
        <div className="space-y-3 text-sm font-body text-white/85">
          <BalokLimasSVG lang={lang}/>
          <InteractiveBalokLimas lang={lang}/>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "Given: Box (p × l × t₁) + Square Pyramid (same base, height t₂)"
              : lang === "ja" ? "直方体（p × l × t₁）+ 四角錐（底面同じ、高さt₂）"
              : "Diketahui: Balok (p × l × t₁) + Limas segiempat (alas sama, tinggi t₂)"}
            </p>
            <div className="space-y-2">
              <p className="text-blue-300 font-semibold">{lang === "en" ? "Volume:" : lang === "ja" ? "体積:" : "Volume:"}</p>
              <BlockMath math="V = p \cdot l \cdot t_1 + \frac{1}{3} \cdot p \cdot l \cdot t_2"/>
              <p className="text-orange-300 font-semibold">{lang === "en" ? "Surface Area:" : lang === "ja" ? "表面積:" : "Luas Permukaan:"}</p>
              <BlockMath math="L = L_{\text{alas balok}} + 4 \cdot L_{\text{sisi balok}} + 4 \cdot L_{\triangle}"/>
              <p className="text-white/50">
                {lang === "en" ? "Box top (= pyramid base) not counted!"
                : lang === "ja" ? "直方体の上面（= 角錐の底面）は数えない！"
                : "Tutup balok (= alas limas) tidak dihitung!"}
              </p>
            </div>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200">
            <p>🌍 <strong>{lang === "en" ? "Real examples:" : lang === "ja" ? "実際の例:" : "Contoh nyata:"}</strong> {lang === "en" ? "City monuments, pyramids on building bases, minarets" : lang === "ja" ? "記念碑、ビルの上の角錐、ミナレット" : "Tugu kota, monumen, piramida dengan alas berbentuk gedung"}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "🏠",
      title: lang === "en" ? "Example: Cube/Box + Prism (House)" : lang === "ja" ? "例: 立方体/直方体 + 三角柱（家）" : "Contoh: Kubus/Balok + Prisma (Rumah)",
      content: (
        <div className="space-y-3 text-sm font-body text-white/85">
          <KubusPrismaSVG lang={lang}/>
          <InteractiveRumah lang={lang}/>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "Given: Cube (s) + Triangular Prism Roof"
              : lang === "ja" ? "立方体（s）+ 三角柱の屋根"
              : "Diketahui: Kubus (s) + Atap Prisma Segitiga"}
            </p>
            <div className="space-y-2">
              <p className="text-blue-300 font-semibold">{lang === "en" ? "Volume:" : lang === "ja" ? "体積:" : "Volume:"}</p>
              <BlockMath math="V = s^3 + L_{\triangle} \times t_{\text{prisma}}"/>
              <p className="text-orange-300 font-semibold">{lang === "en" ? "Surface Area:" : lang === "ja" ? "表面積:" : "Luas Permukaan:"}</p>
              <BlockMath math="L = L_{\text{alas}} + 4 \cdot L_{\text{sisi kubus}} + 2 \cdot L_{\triangle} + 2 \cdot L_{\text{sisi miring}}"/>
              <p className="text-white/50">
                {lang === "en" ? "Cube top (= prism base) not counted!"
                : lang === "ja" ? "立方体の上面（= 三角柱の底面）は数えない！"
                : "Tutup kubus (= alas prisma) tidak dihitung!"}
              </p>
            </div>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200">
            <p>🏠 <strong>{lang === "en" ? "Real examples:" : lang === "ja" ? "実際の例:" : "Contoh nyata:"}</strong> {lang === "en" ? "Houses, gazebos, tents, building models" : lang === "ja" ? "家、ガゼボ、テント、建物の模型" : "Rumah, gazebo, tenda, miniatur bangunan"}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "🏗️",
      title: lang === "en" ? "Example: Two Boxes Combined" : lang === "ja" ? "例: 2つの直方体" : "Contoh: Dua Balok Gabungan",
      content: (
        <div className="space-y-3 text-sm font-body text-white/85">
          <DuaBalokSVG lang={lang}/>
          <InteractiveDuaBalok lang={lang}/>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "Two boxes joined (step shape / L-shape):"
              : lang === "ja" ? "2つの直方体（段差形 / L字形）:"
              : "Dua balok yang disambung (undakan / L-shape):"}
            </p>
            <p className="text-blue-300 font-semibold">{lang === "en" ? "Volume:" : lang === "ja" ? "体積:" : "Volume:"}</p>
            <BlockMath math="V = V_{\text{balok 1}} + V_{\text{balok 2}}"/>
            <p className="text-orange-300 font-semibold">{lang === "en" ? "Surface Area:" : lang === "ja" ? "表面積:" : "Luas Permukaan:"}</p>
            <p className="text-white/70">
              {lang === "en" ? "Sum all visible faces from outside. The junction faces are not counted."
              : lang === "ja" ? "外から見えるすべての面を合計する。接合部の面は数えない。"
              : "Jumlahkan luas semua bidang yang terlihat dari luar. Bidang sambungan antar balok tidak dihitung."}
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1">
            <p className="text-yellow-300 font-semibold">
              💡 {lang === "en" ? "Tip for L-shape:" : lang === "ja" ? "L字形のヒント:" : "Tips untuk bangun L-shape:"}
            </p>
            <p className="text-white/70">
              {lang === "en" ? "Can also be calculated as one large box minus one small box (subtraction method)."
              : lang === "ja" ? "大きな直方体から小さな直方体を引く方法でも計算できます。"
              : "Bisa juga dihitung sebagai satu balok besar dikurangi satu balok kecil (selisih volume)."}
            </p>
            <BlockMath math="V = V_{\text{besar}} - V_{\text{yang dipotong}}"/>
          </div>
        </div>
      ),
    },
    {
      icon: "🎨",
      title: lang === "en" ? "Surface Area Concept" : lang === "ja" ? "表面積の概念" : "Konsep Luas Permukaan Gabungan",
      content: (
        <div className="space-y-3 text-sm font-body text-white/85">
          <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3">
            <p className="text-violet-300 font-semibold mb-1">
              ⚠️ {lang === "en" ? "Important Key:" : lang === "ja" ? "重要なポイント:" : "Kunci Penting:"}
            </p>
            <p className="text-sm text-white/75">
              {lang === "en"
                ? <>Combined surface area is <strong className="text-red-300">NOT</strong> the sum of all individual surface areas. Shared (touching) faces <strong className="text-yellow-300">are not counted</strong>!</>
                : lang === "ja"
                ? <>複合表面積は各立体の表面積を単純に足した値では<strong className="text-red-300">ありません</strong>。接触している面は<strong className="text-yellow-300">数えない</strong>！</>
                : <>Luas permukaan gabungan <strong className="text-red-300">BUKAN</strong> jumlah semua luas permukaan bagiannya. Bidang yang <strong className="text-yellow-300">saling menempel tidak dihitung</strong>!</>}
            </p>
          </div>
          <LuasGabunganSVG lang={lang}/>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2 text-xs">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "Steps:" : lang === "ja" ? "手順:" : "Langkah-langkah:"}
            </p>
            <p>1. {lang === "en" ? "Identify faces visible from outside" : lang === "ja" ? "外から見える面を特定する" : "Identifikasi bidang yang terlihat dari luar"}</p>
            <p>2. {lang === "en" ? "Identify hidden faces (shared between solids)" : lang === "ja" ? "隠れた面（共有面）を特定する" : "Identifikasi bidang yang tersembunyi (saling menempel antar bangun)"}</p>
            <p>3. {lang === "en" ? "Calculate area of all visible faces only" : lang === "ja" ? "見える面だけの面積を計算する" : "Hitung luas semua bidang yang terlihat saja"}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1">
            <p className="text-orange-300 font-semibold">
              {lang === "en" ? "Example Box + Pyramid:" : lang === "ja" ? "例 直方体 + 角錐:" : "Contoh Balok + Limas:"}
            </p>
            <BlockMath math="L = L_{\text{balok tanpa tutup}} + L_{\text{selimut limas}}"/>
            <p className="text-white/50">
              {lang === "en" ? "Pyramid base = box top → not counted!"
              : lang === "ja" ? "角錐底面 = 直方体上面 → 数えない！"
              : "Alas limas = tutup balok → bidang ini tidak dihitung!"}
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: "📊",
      title: lang === "en" ? "Summary & Strategy" : lang === "ja" ? "まとめと戦略" : "Kesimpulan & Strategi",
      content: (
        <div className="space-y-3 font-body text-sm">
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 space-y-2 text-xs">
            <p className="text-cyan-300 font-semibold text-sm">
              🎯 {lang === "en" ? "Strategy for Composite Solid Problems" : lang === "ja" ? "複合立体の問題を解く戦略" : "Strategi Menyelesaikan Soal Bangun Gabungan"}
            </p>
            <p className="text-white/75">1. <strong className="text-yellow-300">{lang === "en" ? "Identify" : lang === "ja" ? "特定する" : "Identifikasi"}</strong> {lang === "en" ? "each component solid" : lang === "ja" ? "各構成立体" : "setiap bangun penyusun"}</p>
            <p className="text-white/75">2. <strong className="text-yellow-300">{lang === "en" ? "Note dimensions" : lang === "ja" ? "寸法を記録" : "Catat dimensi"}</strong> {lang === "en" ? "of each solid" : lang === "ja" ? "各立体の" : "masing-masing bangun"}</p>
            <p className="text-white/75">3. <strong className="text-yellow-300">{lang === "en" ? "Find shared faces" : lang === "ja" ? "共有面を探す" : "Tentukan bidang yang bersentuhan"}</strong> {lang === "en" ? "(for surface area)" : lang === "ja" ? "（表面積用）" : "(untuk luas permukaan)"}</p>
            <p className="text-white/75">4. <strong className="text-yellow-300">{lang === "en" ? "Calculate" : lang === "ja" ? "計算する" : "Hitung"}</strong> {lang === "en" ? "volume/area of each" : lang === "ja" ? "各立体の体積/面積" : "volume/luas masing-masing"}</p>
            <p className="text-white/75">5. <strong className="text-yellow-300">{lang === "en" ? "Sum" : lang === "ja" ? "合計する" : "Jumlahkan"}</strong> {lang === "en" ? "(volume) or identify visible faces (surface area)" : lang === "ja" ? "（体積）または見える面を特定する（表面積）" : "(volume) atau identifikasi bidang terlihat (luas permukaan)"}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-2">
            <p className="text-violet-300 font-semibold">📌 {lang === "en" ? "Summary Formulas:" : lang === "ja" ? "公式まとめ:" : "Rumus Ringkas:"}</p>
            <BlockMath math="V_{\text{gab}} = \sum V_i"/>
            <BlockMath math="L_{\text{gab}} = \sum L_{\text{terlihat}}"/>
          </div>
          <div className="bg-green-950/40 border border-green-700/30 rounded-lg p-3 text-xs text-green-200">
            <p className="font-semibold mb-1">✅ {lang === "en" ? "Always remember:" : lang === "ja" ? "常に覚えよう:" : "Ingat selalu:"}</p>
            <p>{lang === "en" ? "For volume: add all volumes" : lang === "ja" ? "体積: すべての体積を足す" : "Untuk volume: tambahkan semua volume"}</p>
            <p>{lang === "en" ? "For surface area: don't count shared faces!" : lang === "ja" ? "表面積: 共有面を数えない！" : "Untuk luas permukaan: jangan hitung bidang sambungan!"}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "📝",
      title: lang === "en" ? "Graded Examples" : lang === "ja" ? "段階的な例題" : "Contoh Soal Bertingkat",
      content: (
        <div className="space-y-4 font-body">
          {examples.map((ex,i) => (
            <ExampleCard key={i} ex={ex} idx={i} prefix={t.prefix} showLbl={t.show} hideLbl={t.hide}/>
          ))}
        </div>
      ),
    },
  ];

  const total = slides.length;
  const goNext = () => { playPopSound(); setCurrentSlide(s => Math.min(s + 1, total - 1)); };
  const goPrev = () => { playPopSound(); setCurrentSlide(s => Math.max(s - 1, 0)); };
  const slide = slides[currentSlide];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield/>
      <PageNavigation/>
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <Layers className="w-10 h-10 text-violet-400 mx-auto mb-3"/>
        <h1 className="font-display text-lg md:text-2xl font-bold text-violet-300 text-glow-cyan mb-1 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {slides.map((_,i)=>(
            <button key={i}
              onClick={()=>{ playPopSound(); setCurrentSlide(i); }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${i===currentSlide?"w-6 h-2.5 bg-violet-400":"w-2.5 h-2.5 bg-white/20 hover:bg-white/40"}`}/>
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-slate-800/40">
            <span className="text-2xl">{slide.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                {t.slideLabel} {currentSlide + 1} / {total}
              </p>
              <h2 className="font-display text-sm font-bold text-white">{slide.title}</h2>
            </div>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={goPrev} disabled={currentSlide === 0}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold font-display text-white/70 hover:text-white hover:border-violet-400/60 hover:bg-violet-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
            {t.prev}
          </button>
          <button onClick={goNext} disabled={currentSlide === total - 1}
            className="flex-1 py-2.5 rounded-lg border border-violet-400/60 bg-violet-400/15 text-sm font-semibold font-display text-violet-300 hover:bg-violet-400/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
            {t.next}
          </button>
        </div>

        <div className="mt-2 text-center">
          <button onClick={()=>{ playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-violet-300 transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
}
