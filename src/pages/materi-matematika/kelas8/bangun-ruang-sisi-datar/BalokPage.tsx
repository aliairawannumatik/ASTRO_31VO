import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Box } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─────────────────────────────────────────────────────────────
   SVG 3D MATH UTILITIES
───────────────────────────────────────────────────────────── */
type V3 = [number, number, number];
type V2 = [number, number];
const bRotX = (v: V3, a: number): V3 => [v[0], v[1]*Math.cos(a)-v[2]*Math.sin(a), v[1]*Math.sin(a)+v[2]*Math.cos(a)];
const bRotY = (v: V3, a: number): V3 => [v[0]*Math.cos(a)+v[2]*Math.sin(a), v[1], -v[0]*Math.sin(a)+v[2]*Math.cos(a)];
const bProj = (v: V3, fov=480, s=1.6): V2 => { const tz=v[2]+fov; return [(v[0]*fov*s)/tz,(v[1]*fov*s)/tz]; };
const bCross = (ax:number,ay:number,bx:number,by:number) => ax*by-ay*bx;

/* ─────────────────────────────────────────────────────────────
   SIMPLE AUTO-ROTATING BALOK — slide 1 hero shape
───────────────────────────────────────────────────────────── */
const SimpleRotatingBalok = () => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(35);
  const [isDragging, setIsDragging] = useState(false);
  const isDragRef = useRef(false);
  const dragRef   = useRef({ sx: 0, sy: 0, bx: -22, by: 35 });
  const tickRef   = useRef(0);
  const rotYRef   = useRef(35);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      if (!isDragRef.current) {
        tickRef.current += 1;
        rotYRef.current += 0.22;
        const rx = -18 + Math.sin(tickRef.current * 0.012) * 20;
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
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragRef.current) return;
    const t = e.touches[0];
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

  const pw = 55, th = 36, ld = 40;
  const hw = pw/2, hh = th/2, hd = ld/2;
  const rawVerts: V3[] = [
    [-hw,-hh,+hd],[+hw,-hh,+hd],[+hw,+hh,+hd],[-hw,+hh,+hd],
    [-hw,-hh,-hd],[+hw,-hh,-hd],[+hw,+hh,-hd],[-hw,+hh,-hd],
  ];
  const faceDefs = [
    { idx:[0,1,2,3], color:"#3b82f6", label:"DEPAN" },
    { idx:[5,4,7,6], color:"#8b5cf6", label:"BELAKANG" },
    { idx:[4,0,3,7], color:"#22c55e", label:"KIRI" },
    { idx:[1,5,6,2], color:"#f97316", label:"KANAN" },
    { idx:[4,5,1,0], color:"#eab308", label:"ATAS" },
    { idx:[3,2,6,7], color:"#ef4444", label:"BAWAH" },
  ];
  const rx = (rotX * Math.PI) / 180;
  const ry = (rotY * Math.PI) / 180;
  const tfVerts = rawVerts.map(v => bRotX(bRotY(v, ry), rx));
  const pverts: V2[] = tfVerts.map(v => bProj(v));
  const facesWithDepth = faceDefs.map(f => {
    const avgZ = f.idx.reduce((s,i) => s+tfVerts[i][2],0)/f.idx.length;
    const pts2d = f.idx.map(i => pverts[i]);
    const area = bCross(pts2d[1][0]-pts2d[0][0],pts2d[1][1]-pts2d[0][1],pts2d[pts2d.length-1][0]-pts2d[0][0],pts2d[pts2d.length-1][1]-pts2d[0][1]);
    return { ...f, avgZ, pts2d, visible: area < 0 };
  }).sort((a,b) => b.avgZ - a.avgZ);
  const cx = 140, cy = 110;

  return (
    <div
      className="bg-slate-900/70 border border-slate-700/50 rounded-xl select-none"
      style={{ padding: "10px 0 8px", cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <p className="text-center text-white/40 font-body mb-1" style={{ fontSize: 9 }}>
        Berputar otomatis · Drag untuk memutar sendiri
      </p>
      <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-1" style={{ display:"block", overflow:"visible" }}>
        {facesWithDepth.map((f, i) => {
          const pts = f.pts2d.map(([x,y]) => `${cx+x},${cy+y}`).join(" ");
          const mx  = f.pts2d.reduce((s,p) => s+p[0],0)/f.pts2d.length;
          const my  = f.pts2d.reduce((s,p) => s+p[1],0)/f.pts2d.length;
          return (
            <g key={i}>
              <polygon points={pts} fill={f.color} fillOpacity={1}
                stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeLinejoin="round"/>
              <text x={cx+mx} y={cy+my+3} fill="white" fontSize={8} fontFamily="monospace"
                fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                style={{ pointerEvents:"none" }}>
                {f.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-1.5 justify-center mt-1">
        {faceDefs.map(f => (
          <div key={f.label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: f.color }}/>
            <span className="text-white/45 font-body" style={{ fontSize:9 }}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D BALOK — hinge-based folding, back = tumpuan
───────────────────────────────────────────────────────────── */
type FName = "front" | "back" | "left" | "right" | "top" | "bottom";
const OPEN_ORDER: FName[] = ["top", "left", "right", "bottom", "front"];

const P = 110; // panjang (width of front/back/top/bottom)
const L = 72;  // lebar (depth = height of top/bottom, width of left/right)
const T = 65;  // tinggi (height of front/back/left/right)

const FACE_COLORS: Record<FName, string> = {
  front:  "#3b82f6",
  back:   "#8b5cf6",
  left:   "#22c55e",
  right:  "#f97316",
  top:    "#eab308",
  bottom: "#ef4444",
};
const FACE_LABELS: Record<FName, string> = {
  front: "DEPAN", back: "BELAKANG", left: "KIRI",
  right: "KANAN", top: "ATAS", bottom: "BAWAH",
};
const FACE_DIMS: Record<FName, [number, number]> = {
  front:  [P, T],
  back:   [P, T],
  left:   [L, T],
  right:  [L, T],
  top:    [P, L],
  bottom: [P, L],
};

const FaceRect = ({
  face, isNext, isOpen, onClickFace, onClickNext, style,
}: {
  face: FName; isNext: boolean; isOpen: boolean;
  onClickFace: () => void; onClickNext: () => void;
  style?: React.CSSProperties;
}) => {
  const color = FACE_COLORS[face];
  const [w, h] = FACE_DIMS[face];
  return (
    <div
      onClick={onClickFace}
      style={{ position: "absolute", width: w, height: h, cursor: "pointer", transformStyle: "preserve-3d", ...style }}
    >
      <div style={{
        position: "absolute", inset: 0, background: color,
        opacity: isNext ? 1 : 0.88,
        border: isNext ? "3px solid #ffffff" : `2px solid ${color}cc`,
        borderRadius: 5,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        userSelect: "none",
        boxShadow: isNext ? `0 0 18px ${color}` : `0 0 6px ${color}55`,
      }}>
        <span style={{ color: "#fff", fontSize: 8, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>
          {FACE_LABELS[face]}
        </span>
        {isNext ? (
          <button onClick={e => { e.stopPropagation(); onClickNext(); }} style={{
            marginTop: 4, background: "rgba(255,255,255,0.25)", border: "1.5px solid white",
            borderRadius: 8, color: "#fff", fontSize: 7, fontWeight: 700,
            padding: "2px 6px", cursor: "pointer",
          }}>KLIK</button>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 6, marginTop: 2, fontFamily: "monospace" }}>
            {isOpen ? "▣" : "□ klik"}
          </span>
        )}
      </div>
    </div>
  );
};

const TRANS = "transform 1.6s cubic-bezier(0.4, 0, 0.2, 1)";

const InteractiveBalok3D = () => {
  const [openFaces, setOpenFaces] = useState<Set<FName>>(new Set());
  const [seqStep, setSeqStep] = useState(-1);
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(32);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, baseRotX: -22, baseRotY: 32 });

  const allOpen = OPEN_ORDER.every(f => openFaces.has(f));
  const allClosed = openFaces.size === 0;
  const isOpen = (f: FName) => openFaces.has(f);

  const toggleFace = useCallback((face: FName) => {
    if (face === "back" || isDragging || isTransitioning) return;
    playPopSound();
    setOpenFaces(prev => {
      const next = new Set(prev);
      if (next.has(face)) next.delete(face); else next.add(face);
      return next;
    });
  }, [isDragging, isTransitioning]);

  const openAll = () => {
    if (isTransitioning) return;
    playPopSound();
    setIsTransitioning(true);
    setRotX(-52); setRotY(0);
    setTimeout(() => { setOpenFaces(new Set(OPEN_ORDER)); setSeqStep(-1); }, 300);
    setTimeout(() => setIsTransitioning(false), 2200);
  };

  const closeAll = () => {
    if (isTransitioning) return;
    playPopSound();
    setIsTransitioning(true);
    setOpenFaces(new Set());
    setSeqStep(-1);
    setTimeout(() => { setRotX(-22); setRotY(32); }, 400);
    setTimeout(() => setIsTransitioning(false), 2200);
  };

  const startSequential = () => {
    if (isTransitioning) return;
    playPopSound();
    setOpenFaces(new Set());
    setRotX(-22); setRotY(32);
    setSeqStep(0);
  };

  const openNextSeq = () => {
    if (seqStep < 0 || seqStep >= OPEN_ORDER.length || isTransitioning) return;
    playPopSound();
    setIsTransitioning(true);
    const face = OPEN_ORDER[seqStep];
    setOpenFaces(prev => { const n = new Set(prev); n.add(face); return n; });
    const isLast = seqStep === OPEN_ORDER.length - 1;
    if (isLast) { setSeqStep(-1); setTimeout(() => { setRotX(-52); setRotY(0); }, 400); }
    else { setSeqStep(seqStep + 1); }
    setTimeout(() => setIsTransitioning(false), 1800);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseRotX: rotX, baseRotY: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.baseRotY + (e.clientX - dragRef.current.startX) * 0.5);
    setRotX(dragRef.current.baseRotX - (e.clientY - dragRef.current.startY) * 0.5);
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
    setRotY(dragRef.current.baseRotY + (t.clientX - dragRef.current.startX) * 0.5);
    setRotX(dragRef.current.baseRotX - (t.clientY - dragRef.current.startY) * 0.5);
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

  const nextFace = seqStep >= 0 ? OPEN_ORDER[seqStep] : null;
  const commonFaceProps = (face: FName) => ({
    face, isNext: nextFace === face, isOpen: isOpen(face),
    onClickFace: () => { if (!isDragging) toggleFace(face); },
    onClickNext: openNextSeq,
  });

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        Drag untuk memutar · Klik sisi untuk membongkar/melipat · Sisi BELAKANG (ungu) = tumpuan tetap jaring-jaring
      </p>

      <div className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{ width: "100%", height: 380, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}
      >
        <div style={{
          width: P, height: T,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : "transform 0.6s ease",
        }}>
          {/* ── BACK FACE (tumpuan) — always flat, non-clickable ── */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: P, height: T,
            transformStyle: "preserve-3d", transform: "translate3d(0,0,0)", transition: TRANS,
          }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <div style={{
                position: "absolute", inset: 0,
                background: FACE_COLORS["back"], opacity: 0.9,
                border: `2px solid ${FACE_COLORS["back"]}cc`, borderRadius: 5,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                userSelect: "none", cursor: "default", pointerEvents: "none",
                boxShadow: `0 0 8px ${FACE_COLORS["back"]}66`,
              }}>
                <span style={{ color: "#fff", fontSize: 8, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>
                  {FACE_LABELS["back"]}
                </span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 6, marginTop: 3, fontFamily: "monospace" }}>
                  ★ tumpuan · p×t
                </span>
              </div>
            </div>
          </div>

          {/* ── TOP HINGE (top edge of back, pivot along P) ── */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: P, height: 0,
            transformStyle: "preserve-3d", transformOrigin: "50% 0% 0",
            transform: isOpen("top") ? "rotateX(0deg)" : `translateZ(-${L / 2}px) rotateX(-90deg)`,
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("top")} style={{ top: -L, left: 0 }} />
          </div>

          {/* ── BOTTOM HINGE (bottom edge of back) ── */}
          <div style={{
            position: "absolute", top: T, left: 0, width: P, height: 0,
            transformStyle: "preserve-3d", transformOrigin: "50% 0% 0",
            transform: isOpen("bottom") ? "rotateX(0deg)" : `translateZ(-${L / 2}px) rotateX(90deg)`,
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("bottom")} style={{ top: 0, left: 0 }} />

            {/* ── FRONT HINGE — nested inside bottom ── */}
            <div style={{
              position: "absolute", top: L, left: 0, width: P, height: 0,
              transformStyle: "preserve-3d", transformOrigin: "50% 0% 0",
              transform: isOpen("front") ? "rotateX(0deg)" : "rotateX(90deg)",
              transition: TRANS,
            }}>
              <FaceRect {...commonFaceProps("front")} style={{ top: 0, left: 0 }} />
            </div>
          </div>

          {/* ── LEFT HINGE (left edge of back) ── */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: 0, height: T,
            transformStyle: "preserve-3d", transformOrigin: "0% 50% 0",
            transform: isOpen("left") ? "rotateY(0deg)" : `translateZ(-${L / 2}px) rotateY(90deg)`,
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("left")} style={{ top: 0, left: -L }} />
          </div>

          {/* ── RIGHT HINGE (right edge of back) ── */}
          <div style={{
            position: "absolute", top: 0, left: P, width: 0, height: T,
            transformStyle: "preserve-3d", transformOrigin: "0% 50% 0",
            transform: isOpen("right") ? "rotateY(0deg)" : `translateZ(-${L / 2}px) rotateY(-90deg)`,
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("right")} style={{ top: 0, left: 0 }} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={startSequential}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          ▶ Bongkar Bertahap
        </button>
        <button onClick={openAll} disabled={allOpen}
          className="px-3 py-1.5 text-xs font-bold bg-orange-900/60 border border-orange-600 text-orange-300 rounded-lg hover:bg-orange-800/60 transition-colors cursor-pointer font-body disabled:opacity-40">
          ⊞ Bongkar Semua
        </button>
        <button onClick={closeAll} disabled={allClosed}
          className="px-3 py-1.5 text-xs font-bold bg-violet-900/60 border border-violet-600 text-violet-300 rounded-lg hover:bg-violet-800/60 transition-colors cursor-pointer font-body disabled:opacity-40">
          ⊟ Satukan Kembali
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {(["front","back","left","right","top","bottom"] as FName[]).map(f => (
          <div key={f} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: FACE_COLORS[f] }} />
            <span className="text-white/50 text-[10px] font-body">
              {FACE_LABELS[f]}{f === "back" ? " ★" : ""}{" "}
              <span className="text-white/30">({f === "front" || f === "back" ? "p×t" : f === "left" || f === "right" ? "l×t" : "p×l"})</span>
            </span>
          </div>
        ))}
      </div>
      <p className="text-white/30 text-[9px] text-center font-body">★ = tumpuan jaring-jaring</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   JARING-JARING BALOK SVG PATTERNS
───────────────────────────────────────────────────────────── */
const CP = 22; // cell size for panjang unit
const CL = 14; // cell size for lebar unit
const CT = 16; // cell size for tinggi unit

type BalokCell = { x: number; y: number; w: number; h: number; color: string; label: string };

const balokNets: BalokCell[][] = [
  // Net 1 — cross/salib (tumpuan = back p×t at center)
  [
    { x: CP,    y: 0,      w: CP, h: CL, color: "#eab308", label: "p×l" },   // top
    { x: 0,     y: CL,     w: CL, h: CT, color: "#22c55e", label: "l×t" },   // left
    { x: CL,    y: CL,     w: CP, h: CT, color: "#8b5cf6", label: "p×t" },   // back (tumpuan)
    { x: CL+CP, y: CL,     w: CL, h: CT, color: "#f97316", label: "l×t" },   // right
    { x: CP,    y: CL+CT,  w: CP, h: CL, color: "#ef4444", label: "p×l" },   // bottom
    { x: CP,    y: CL+CT+CL, w: CP, h: CT, color: "#3b82f6", label: "p×t" }, // front
  ],
  // Net 2 — T-shape top
  [
    { x: 0,     y: 0,      w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: 0,     y: CL,     w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: 0,     y: CL+CT,  w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: 0,     y: CL+CT+CL, w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: CP,    y: CL,     w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: -CL,   y: CL,     w: CL, h: CT, color: "#22c55e", label: "l×t" },
  ],
  // Net 3 — L-shape
  [
    { x: 0,     y: 0,      w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CL,    y: 0,      w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CL+CP, y: 0,      w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: CL+CP+CL, y: 0,   w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: CL,    y: -CL,    w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CL,    y: CT,     w: CP, h: CL, color: "#ef4444", label: "p×l" },
  ],
  // Net 4 — zigzag
  [
    { x: 0,     y: 0,      w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: 0,     y: CT,     w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: 0,     y: CT+CL,  w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: 0,     y: CT+CL+CT, w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: -CL,   y: CT,     w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CP,    y: CT+CL,  w: CL, h: CT, color: "#f97316", label: "l×t" },
  ],
  // Net 5 — long strip
  [
    { x: 0,     y: CT,     w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CP,    y: CT,     w: CL, h: CL, color: "#22c55e", label: "l×l?" },
    { x: CP,    y: 0,      w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CP,    y: CT,     w: CL, h: CL, color: "#22c55e", label: "l×l" },
    { x: 0,     y: 0,      w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: 0,     y: CT+CL,  w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: -CL,   y: 0,      w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: 0,     y: CT+CL+CT, w: CP, h: CL, color: "#ef4444", label: "p×l" },
  ],
];

// Use only first 4 (cleaner nets)
const cleanNets = balokNets.slice(0, 4);

const BalokNetSVG = ({ cells }: { cells: BalokCell[] }) => {
  const xs = cells.map(c => c.x);
  const ys = cells.map(c => c.y);
  const xe = cells.map(c => c.x + c.w);
  const ye = cells.map(c => c.y + c.h);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const maxX = Math.max(...xe), maxY = Math.max(...ye);
  const W = maxX - minX, H = maxY - minY;
  const pad = 2;
  return (
    <svg viewBox={`${minX - pad} ${minY - pad} ${W + pad * 2} ${H + pad * 2}`}
      width={W + pad * 2} height={H + pad * 2}
      style={{ maxWidth: "100%", maxHeight: 110 }}>
      {cells.map((c, i) => (
        <g key={i}>
          <rect x={c.x + 1} y={c.y + 1} width={c.w - 2} height={c.h - 2}
            fill={c.color} fillOpacity={0.85} rx={2} stroke="white" strokeWidth={1.2} />
          <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 3}
            fill="white" fontSize={5.5} fontFamily="monospace" fontWeight="bold"
            textAnchor="middle" dominantBaseline="middle">{c.label}</text>
        </g>
      ))}
    </svg>
  );
};

const NetGallery = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {cleanNets.map((cells, i) => (
      <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col items-center gap-2">
        <span className="text-white/50 text-[10px] font-body font-bold">Jaring #{i + 1}</span>
        <div className="flex items-center justify-center" style={{ minHeight: 80 }}>
          <BalokNetSVG cells={cells} />
        </div>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — Unsur-unsur Balok
───────────────────────────────────────────────────────────── */
const RusukBalokSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2" aria-label="Rusuk balok beranimasi">
    <defs>
      <style>{`
        @keyframes rusukB{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22d3ee);}50%{stroke-opacity:0.2;filter:drop-shadow(0 0 0 #22d3ee);}}
        .rb-p{animation:rusukB 1.6s ease-in-out infinite; stroke:#22d3ee;}
        .rb-l{animation:rusukB 1.6s ease-in-out infinite 0.4s; stroke:#f97316;}
        .rb-t{animation:rusukB 1.6s ease-in-out infinite 0.8s; stroke:#facc15;}
      `}</style>
    </defs>
    {/* Balok wireframe — front face */}
    <polygon points="30,70 170,70 170,170 30,170" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.2"/>
    {/* Back face */}
    <polygon points="70,30 210,30 210,130 70,130" fill="rgba(30,41,59,0.5)" stroke="#334155" strokeWidth="1.2"/>
    {/* Connecting */}
    <line x1="30" y1="70" x2="70" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="70" x2="210" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="30" y1="170" x2="70" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="170" x2="210" y2="130" stroke="#334155" strokeWidth="1.2"/>
    {/* Rusuk panjang (4×) */}
    <line x1="30" y1="70" x2="170" y2="70" strokeWidth="3" className="rb-p"/>
    <line x1="30" y1="170" x2="170" y2="170" strokeWidth="3" className="rb-p"/>
    <line x1="70" y1="30" x2="210" y2="30" strokeWidth="3" className="rb-p"/>
    <line x1="70" y1="130" x2="210" y2="130" strokeWidth="3" className="rb-p"/>
    {/* Rusuk lebar (4×) */}
    <line x1="30" y1="70" x2="70" y2="30" strokeWidth="3" className="rb-l"/>
    <line x1="170" y1="70" x2="210" y2="30" strokeWidth="3" className="rb-l"/>
    <line x1="30" y1="170" x2="70" y2="130" strokeWidth="3" className="rb-l"/>
    <line x1="170" y1="170" x2="210" y2="130" strokeWidth="3" className="rb-l"/>
    {/* Rusuk tinggi (4×) */}
    <line x1="30" y1="70" x2="30" y2="170" strokeWidth="3" className="rb-t"/>
    <line x1="170" y1="70" x2="170" y2="170" strokeWidth="3" className="rb-t"/>
    <line x1="70" y1="30" x2="70" y2="130" strokeWidth="3" className="rb-t"/>
    <line x1="210" y1="30" x2="210" y2="130" strokeWidth="3" className="rb-t"/>
    {/* Legend */}
    <rect x="220" y="150" width="8" height="4" fill="#22d3ee"/>
    <text x="232" y="155" fill="#22d3ee" fontSize="8" fontFamily="monospace">4 rusuk p</text>
    <rect x="220" y="162" width="8" height="4" fill="#f97316"/>
    <text x="232" y="167" fill="#f97316" fontSize="8" fontFamily="monospace">4 rusuk l</text>
    <rect x="220" y="174" width="8" height="4" fill="#facc15"/>
    <text x="232" y="179" fill="#facc15" fontSize="8" fontFamily="monospace">4 rusuk t</text>
    <text x="220" y="195" fill="#fff" fontSize="8" fontFamily="monospace">= 12 rusuk</text>
  </svg>
);

const SisiBalokSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2" aria-label="Sisi balok beranimasi">
    <defs>
      <style>{`
        @keyframes sisiB{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.1;}}
        .sb-a{animation:sisiB 2s ease-in-out infinite;}
        .sb-b{animation:sisiB 2s ease-in-out infinite 0.4s;}
        .sb-c{animation:sisiB 2s ease-in-out infinite 0.8s;}
      `}</style>
    </defs>
    <polygon points="30,70 170,70 170,170 30,170" fill="#3b82f6" className="sb-a"/>
    <polygon points="70,30 210,30 210,130 70,130" fill="#8b5cf6" className="sb-b"/>
    <polygon points="30,70 70,30 210,30 170,70" fill="#eab308" className="sb-c"/>
    <polygon points="30,70 70,30 70,130 30,170" fill="#22c55e" className="sb-b" fillOpacity="0.6"/>
    <polygon points="30,170 70,130 210,130 170,170" fill="#ef4444" className="sb-a"/>
    <polygon points="170,70 210,30 210,130 170,130" fill="#f97316" className="sb-c" fillOpacity="0.6"/>
    <polygon points="30,70 170,70 170,170 30,170" fill="none" stroke="#fff" strokeWidth="1.2"/>
    <polygon points="70,30 210,30 210,130 70,130" fill="none" stroke="#fff" strokeWidth="1.2"/>
    <line x1="30" y1="70" x2="70" y2="30" stroke="#fff" strokeWidth="1.2"/>
    <line x1="170" y1="70" x2="210" y2="30" stroke="#fff" strokeWidth="1.2"/>
    <line x1="30" y1="170" x2="70" y2="130" stroke="#fff" strokeWidth="1.2"/>
    <line x1="170" y1="170" x2="210" y2="130" stroke="#fff" strokeWidth="1.2"/>
    <text x="80" y="125" fill="#fff" fontSize="9" fontFamily="monospace" fontWeight="bold">DEPAN</text>
    <text x="220" y="185" fill="#fff" fontSize="9" fontFamily="monospace">6 sisi</text>
    <text x="220" y="198" fill="#facc15" fontSize="9" fontFamily="monospace">3 pasang</text>
  </svg>
);

const DiagBidangSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2" aria-label="Diagonal bidang balok">
    <defs>
      <style>{`
        @keyframes diagB{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #f97316);}50%{stroke-opacity:0.3;filter:drop-shadow(0 0 1px #f97316);}}
        .db-a{animation:diagB 1.8s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon points="30,70 170,70 170,170 30,170" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.2"/>
    <polygon points="70,30 210,30 210,130 70,130" fill="rgba(30,41,59,0.5)" stroke="#334155" strokeWidth="1.2"/>
    <line x1="30" y1="70" x2="70" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="70" x2="210" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="30" y1="170" x2="70" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="170" x2="210" y2="130" stroke="#334155" strokeWidth="1.2"/>
    {/* Diagonal sisi depan */}
    <line x1="30" y1="170" x2="170" y2="70" stroke="#f97316" strokeWidth="2.5" className="db-a" strokeDasharray="6,3"/>
    {/* Diagonal sisi atas */}
    <line x1="30" y1="70" x2="210" y2="30" stroke="#22d3ee" strokeWidth="2.5" className="db-a" strokeDasharray="6,3"/>
    {/* Diagonal sisi kanan */}
    <line x1="170" y1="70" x2="210" y2="130" stroke="#4ade80" strokeWidth="2.5" className="db-a" strokeDasharray="6,3"/>
    <text x="10" y="200" fill="#f97316" fontSize="8" fontFamily="monospace">d_b = √(p²+t²), √(p²+l²), √(l²+t²)</text>
  </svg>
);

const DiagRuangSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2" aria-label="Diagonal ruang balok">
    <defs>
      <style>{`
        @keyframes diagR{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 8px #facc15);}50%{stroke-opacity:0.2;filter:drop-shadow(0 0 0 #facc15);}}
        .dr-a{animation:diagR 1.6s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon points="30,70 170,70 170,170 30,170" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.2"/>
    <polygon points="70,30 210,30 210,130 70,130" fill="rgba(30,41,59,0.5)" stroke="#334155" strokeWidth="1.2"/>
    <line x1="30" y1="70" x2="70" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="70" x2="210" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="30" y1="170" x2="70" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="170" x2="210" y2="130" stroke="#334155" strokeWidth="1.2"/>
    {/* 4 diagonal ruang */}
    <line x1="30" y1="170" x2="210" y2="30" stroke="#facc15" strokeWidth="3" className="dr-a"/>
    <line x1="170" y1="170" x2="70" y2="30" stroke="#facc15" strokeWidth="1.5" className="dr-a" strokeDasharray="4,4" opacity="0.5"/>
    <circle cx="30" cy="170" r="4" fill="#facc15" opacity="0.9"/>
    <circle cx="210" cy="30" r="4" fill="#facc15" opacity="0.9"/>
    <text x="10" y="200" fill="#facc15" fontSize="9" fontFamily="monospace">d_r = √(p² + l² + t²)</text>
    <text x="10" y="210" fill="#fff" fontSize="8" fontFamily="monospace">4 diagonal ruang</text>
  </svg>
);

const LuasSVG = () => {
  /* Net (jaring-jaring) dimensions in px */
  const pp = 84, lp = 52, tp = 46;
  const ox = 55, oy = 8; /* offset so net is centred */
  /* Face rectangles [x, y, w, h, fill, label, cls] */
  const faces = [
    /* ATAS  p×l */ [ox + lp,      oy,               pp, lp, "#eab308", "ATAS\np×l",      "jn-c"],
    /* KIRI  l×t */ [ox,           oy + lp,           lp, tp, "#22c55e", "KIRI\nl×t",      "jn-b"],
    /* BELAKANG p×t (tumpuan) */ [ox + lp, oy + lp,  pp, tp, "#8b5cf6", "BELAKANG\np×t",  "jn-a"],
    /* KANAN l×t */ [ox + lp + pp, oy + lp,           lp, tp, "#f97316", "KANAN\nl×t",     "jn-b"],
    /* BAWAH p×l */ [ox + lp,      oy + lp + tp,      pp, lp, "#ef4444", "BAWAH\np×l",     "jn-c"],
    /* DEPAN p×t */ [ox + lp,      oy + lp + tp + lp, pp, tp, "#3b82f6", "DEPAN\np×t",     "jn-a"],
  ] as const;
  return (
    <svg viewBox="0 0 250 230" className="w-full max-w-sm mx-auto my-2" aria-label="Jaring-jaring balok — luas permukaan">
      <defs>
        <style>{`
          @keyframes jnGlowA{0%,100%{fill-opacity:0.88;filter:drop-shadow(0 0 10px #818cf8);}50%{fill-opacity:0.3;filter:none;}}
          @keyframes jnGlowB{0%,100%{fill-opacity:0.88;filter:drop-shadow(0 0 10px #4ade80);}50%{fill-opacity:0.3;filter:none;}}
          @keyframes jnGlowC{0%,100%{fill-opacity:0.88;filter:drop-shadow(0 0 10px #facc15);}50%{fill-opacity:0.3;filter:none;}}
          .jn-a{animation:jnGlowA 2.2s ease-in-out infinite;}
          .jn-b{animation:jnGlowB 2.2s ease-in-out infinite 0.55s;}
          .jn-c{animation:jnGlowC 2.2s ease-in-out infinite 1.1s;}
        `}</style>
        <filter id="jnBloom">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Faces */}
      {faces.map(([x, y, w, h, fill, label, cls], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h}
            fill={fill} className={cls}
            rx={3} stroke="white" strokeWidth={1.5}/>
          {label.split("\n").map((line, li) => (
            <text key={li}
              x={x + w / 2} y={y + h / 2 + (li - 0.4) * 9}
              fill="white" fontSize={8} fontFamily="monospace" fontWeight="bold"
              textAnchor="middle" dominantBaseline="middle">
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* Fold lines (dashed) */}
      <line x1={ox + lp} y1={oy} x2={ox + lp} y2={oy + lp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>
      <line x1={ox + lp + pp} y1={oy} x2={ox + lp + pp} y2={oy + lp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>
      <line x1={ox} y1={oy + lp + tp} x2={ox + lp} y2={oy + lp + tp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>
      <line x1={ox + lp + pp} y1={oy + lp + tp} x2={ox + lp + pp + lp} y2={oy + lp + tp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>

      {/* Dimension arrows & labels */}
      {/* p (horizontal arrow above ATAS) */}
      <line x1={ox + lp} y1={oy - 5} x2={ox + lp + pp} y2={oy - 5} stroke="#a5b4fc" strokeWidth={1}/>
      <text x={ox + lp + pp / 2} y={oy - 8} fill="#a5b4fc" fontSize={8} fontFamily="monospace" textAnchor="middle">p</text>
      {/* l (vertical arrow left of KIRI) */}
      <line x1={ox - 5} y1={oy + lp} x2={ox - 5} y2={oy + lp + tp} stroke="#4ade80" strokeWidth={1}/>
      <text x={ox - 10} y={oy + lp + tp / 2 + 3} fill="#4ade80" fontSize={8} fontFamily="monospace" textAnchor="middle">t</text>
      {/* l height (vertical left of ATAS) */}
      <line x1={ox + lp - 5} y1={oy} x2={ox + lp - 5} y2={oy + lp} stroke="#facc15" strokeWidth={1}/>
      <text x={ox + lp - 10} y={oy + lp / 2 + 3} fill="#facc15" fontSize={8} fontFamily="monospace" textAnchor="middle">l</text>

      {/* Formula */}
      <text x={125} y={218} fill="#e0e7ff" fontSize={13} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#jnBloom)">
        L = 2(pl + pt + lt)
      </text>
    </svg>
  );
};

const VolumeBalokSVG = () => {
  /*
   * Oblique projection of a clearly elongated BALOK:
   * panjang (p) = 150px wide  (front face width — obviously long)
   * tinggi  (t) =  72px tall  (front face height)
   * lebar   (l) =  52px deep  (side depth, drawn at ~30° angle)
   * Oblique depth offset: dx = 44, dy = -26
   */
  const dx = 44, dy = -26;
  /* Front face corners */
  const fBL = [28, 162], fBR = [178, 162], fTR = [178, 90], fTL = [28, 90];
  /* Back face corners = front + (dx, dy) */
  const bBL = [fBL[0]+dx, fBL[1]+dy], bBR = [fBR[0]+dx, fBR[1]+dy];
  const bTR = [fTR[0]+dx, fTR[1]+dy], bTL = [fTL[0]+dx, fTL[1]+dy];
  const pt = (a: number[]) => `${a[0]},${a[1]}`;
  return (
    <svg viewBox="0 0 270 200" className="w-full max-w-sm mx-auto my-2" aria-label="Volume balok — balok utuh bersinar">
      <defs>
        <style>{`
          @keyframes vbFront{0%,100%{fill-opacity:0.88;filter:drop-shadow(0 0 12px #60a5fa);}50%{fill-opacity:0.5;filter:drop-shadow(0 0 3px #1d4ed8);}}
          @keyframes vbTop{0%,100%{fill-opacity:0.92;filter:drop-shadow(0 0 14px #a78bfa);}50%{fill-opacity:0.55;filter:drop-shadow(0 0 4px #7c3aed);}}
          @keyframes vbSide{0%,100%{fill-opacity:0.82;filter:drop-shadow(0 0 10px #818cf8);}50%{fill-opacity:0.4;filter:none;}}
          @keyframes vbEdge{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #e0e7ff);}50%{stroke-opacity:0.3;filter:none;}}
          @keyframes vbLbl{0%,100%{opacity:1;}50%{opacity:0.5;}}
          .vb2-front{animation:vbFront 2.6s ease-in-out infinite;}
          .vb2-top{animation:vbTop 2.6s ease-in-out infinite 0.55s;}
          .vb2-side{animation:vbSide 2.6s ease-in-out infinite 1.1s;}
          .vb2-edge{animation:vbEdge 2.6s ease-in-out infinite;}
          .vb2-lbl{animation:vbLbl 2.6s ease-in-out infinite;}
        `}</style>
        <filter id="vb2Bloom">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Front face (p × t) — blue */}
      <polygon points={`${pt(fBL)} ${pt(fBR)} ${pt(fTR)} ${pt(fTL)}`}
        fill="#1d4ed8" className="vb2-front" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      {/* Top face (p × l) — violet */}
      <polygon points={`${pt(fTL)} ${pt(fTR)} ${pt(bTR)} ${pt(bTL)}`}
        fill="#7c3aed" className="vb2-top" stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      {/* Right side face (l × t) — indigo */}
      <polygon points={`${pt(fTR)} ${pt(fBR)} ${pt(bBR)} ${pt(bTR)}`}
        fill="#4338ca" className="vb2-side" stroke="#a5b4fc" strokeWidth="2" strokeLinejoin="round"/>

      {/* Glowing edges */}
      {/* Front face outline */}
      <polyline points={`${pt(fBL)} ${pt(fBR)} ${pt(fTR)} ${pt(fTL)} ${pt(fBL)}`}
        fill="none" stroke="#93c5fd" strokeWidth="2" className="vb2-edge" strokeLinejoin="round"/>
      {/* Back visible edges */}
      <line x1={bTL[0]} y1={bTL[1]} x2={bTR[0]} y2={bTR[1]} stroke="#c4b5fd" strokeWidth="2" className="vb2-edge"/>
      <line x1={bTR[0]} y1={bTR[1]} x2={bBR[0]} y2={bBR[1]} stroke="#a5b4fc" strokeWidth="2" className="vb2-edge"/>
      {/* Depth edges */}
      <line x1={fTL[0]} y1={fTL[1]} x2={bTL[0]} y2={bTL[1]} stroke="#c4b5fd" strokeWidth="2" className="vb2-edge"/>
      <line x1={fTR[0]} y1={fTR[1]} x2={bTR[0]} y2={bTR[1]} stroke="#c4b5fd" strokeWidth="2" className="vb2-edge"/>
      <line x1={fBR[0]} y1={fBR[1]} x2={bBR[0]} y2={bBR[1]} stroke="#a5b4fc" strokeWidth="2" className="vb2-edge"/>
      {/* Hidden back edges (dashed) */}
      <line x1={fBL[0]} y1={fBL[1]} x2={bBL[0]} y2={bBL[1]} stroke="#475569" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={bBL[0]} y1={bBL[1]} x2={bBR[0]} y2={bBR[1]} stroke="#475569" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={bBL[0]} y1={bBL[1]} x2={bTL[0]} y2={bTL[1]} stroke="#475569" strokeWidth="1.2" strokeDasharray="4,3"/>

      {/* Dimension labels */}
      {/* p — along bottom of front face */}
      <line x1={fBL[0]} y1={fBL[1]+8} x2={fBR[0]} y2={fBR[1]+8} stroke="#93c5fd" strokeWidth="1"/>
      <text x={(fBL[0]+fBR[0])/2} y={fBL[1]+18} fill="#93c5fd" fontSize="11"
        fontFamily="monospace" fontWeight="bold" textAnchor="middle" className="vb2-lbl">p</text>
      {/* t — along left side of front face */}
      <line x1={fBL[0]-8} y1={fBL[1]} x2={fTL[0]-8} y2={fTL[1]} stroke="#facc15" strokeWidth="1"/>
      <text x={fBL[0]-16} y={(fBL[1]+fTL[1])/2+4} fill="#facc15" fontSize="11"
        fontFamily="monospace" fontWeight="bold" className="vb2-lbl">t</text>
      {/* l — along top-right depth edge */}
      <text x={fTR[0]+dx/2+6} y={fTR[1]+dy/2-4} fill="#c4b5fd" fontSize="11"
        fontFamily="monospace" fontWeight="bold" className="vb2-lbl">l</text>

      {/* Formula */}
      <text x="135" y="192" fill="#e0e7ff" fontSize="14" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#vb2Bloom)" className="vb2-lbl">V = p × l × t</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   VOLUME BALOK — animated water-fill visualization
───────────────────────────────────────────────────────────── */
type V2b = [number, number];

const WaterBalokAnimation = () => {
  const [fill, setFill] = useState(0);

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
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Balok in oblique projection — p (panjang) wide, t (tinggi) tall, l (lebar) deep
  const FL:   V2b = [28,  176];
  const FR:   V2b = [178, 176];
  const Hpx   = 76;            // represents tinggi (t)
  const dx = 40, dy = -22;    // represents lebar (l)

  const BkL:  V2b = [FL[0] + dx,  FL[1] + dy];
  const BkR:  V2b = [FR[0] + dx,  FR[1] + dy];
  const FTL:  V2b = [FL[0],       FL[1] - Hpx];
  const FTR:  V2b = [FR[0],       FR[1] - Hpx];
  const BkTL: V2b = [BkL[0],     BkL[1] - Hpx];
  const BkTR: V2b = [BkR[0],     BkR[1] - Hpx];

  const lerp = (a: V2b, b: V2b, t: number): V2b => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const p  = (v: V2b) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pp = (...vs: V2b[]) => vs.map(p).join(" ");

  const WFL  = lerp(FL,  FTL,  fill);
  const WFR  = lerp(FR,  FTR,  fill);
  const WBkL = lerp(BkL, BkTL, fill);
  const WBkR = lerp(BkR, BkTR, fill);

  const pct     = Math.round(fill * 100);
  const isEmpty = fill < 0.005;
  const isFull  = fill > 0.995;

  const barX = 228, barY = FTL[1], barW = 13, barH = Hpx;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 62 258 178" className="w-full max-w-sm mx-auto"
      aria-label="Animasi balok diisi air">
      <defs>
        <filter id="wBloomB">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Hidden back edges (dashed) */}
      <line x1={BkL[0]} y1={BkL[1]} x2={BkTL[0]} y2={BkTL[1]}
        stroke="#334155" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={FL[0]} y1={FL[1]} x2={BkL[0]} y2={BkL[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={FTL[0]} y1={FTL[1]} x2={BkTL[0]} y2={BkTL[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={BkTL[0]} y1={BkTL[1]} x2={BkTR[0]} y2={BkTR[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>

      {/* Ghost shell (right + front faces above water) */}
      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>

      {/* WATER */}
      {!isEmpty && (
        <>
          {/* Floor (p × l base) */}
          <polygon points={pp(FL, FR, BkR, BkL)}
            fill="#1e3a8a" fillOpacity={0.90}/>
          {/* Right face water band (l × t) */}
          <polygon points={pp(FR, BkR, WBkR, WFR)}
            fill="#1d4ed8" fillOpacity={0.80}/>
          {/* Front face water band (p × t) */}
          <polygon points={pp(FL, FR, WFR, WFL)}
            fill="#2563eb" fillOpacity={0.90}/>
          {/* Water surface (p × l parallelogram) */}
          {!isFull && (
            <polygon points={pp(WFL, WFR, WBkR, WBkL)}
              fill="#7dd3fc" fillOpacity={0.50}
              style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}/>
          )}
          {!isFull && (
            <line x1={WFL[0]} y1={WFL[1]} x2={WFR[0]} y2={WFR[1]}
              stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
          )}
        </>
      )}

      {/* Balok wireframe */}
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Top face (p × l) */}
      <polygon points={pp(FTL, FTR, BkTR, BkTL)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>

      {/* Dimension labels */}
      {/* p — front bottom edge */}
      <text x={(FL[0] + FR[0]) / 2} y={FL[1] + 12}
        fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">p</text>
      {/* t — left vertical edge */}
      <text x={FL[0] - 14} y={(FL[1] + FTL[1]) / 2 + 4}
        fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
      <line x1={FL[0] - 8} y1={FL[1]} x2={FL[0] - 8} y2={FTL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>
      {/* l — right depth edge */}
      <text x={(FTR[0] + BkTR[0]) / 2 + 4} y={(FTR[1] + BkTR[1]) / 2 - 6}
        fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">l</text>

      {/* ALAS / TUTUP labels */}
      <text x={(FL[0] + FR[0]) / 2} y={FL[1] + 24}
        fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ALAS (p×l)</text>
      <text x={(FTL[0] + FTR[0]) / 2} y={FTL[1] - 6}
        fill="#c4b5fd" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TUTUP</text>

      {/* Progress bar */}
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

      {/* Status + Formula */}
      <text x="113" y="215"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloomB)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x="113" y="230"
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloomB)">
        V = p × l × t
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

const sections: Sec[] = [
  {
    title: "Definisi Balok",
    icon: "📦",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Balok adalah <strong className="text-cyan-300">bangun ruang sisi datar</strong> yang memiliki 6 sisi berbentuk persegi panjang.
          Berbeda dari kubus, balok memiliki <strong className="text-yellow-300">tiga ukuran berbeda</strong>: panjang (p), lebar (l), dan tinggi (t).
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">📌 Sifat-sifat Balok:</p>
          <ul className="space-y-1 text-xs text-white/75">
            <li>• Memiliki <strong className="text-yellow-300">6 sisi</strong> berbentuk persegi panjang (3 pasang sisi yang sama)</li>
            <li>• Memiliki <strong className="text-yellow-300">12 rusuk</strong> terdiri dari 3 kelompok: 4 rusuk p, 4 rusuk l, 4 rusuk t</li>
            <li>• Memiliki <strong className="text-yellow-300">8 titik sudut</strong></li>
            <li>• Setiap sudut pertemuannya selalu <strong className="text-yellow-300">90°</strong></li>
            <li>• Panjang, lebar, dan tinggi <strong className="text-yellow-300">tidak harus sama</strong></li>
          </ul>
        </div>
        <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
          💡 <strong>Balok vs Kubus:</strong> Jika p = l = t, maka balok menjadi kubus! Kubus adalah kasus khusus dari balok.
        </blockquote>
      </div>
    ),
  },
  {
    title: "Unsur-unsur Balok (Interaktif)",
    icon: "🔍",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        {/* Rusuk */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-cyan-300 font-semibold mb-2">⬛ Rusuk Balok (12 rusuk)</p>
          <RusukBalokSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• <strong className="text-cyan-300">4 rusuk panjang (p):</strong> rusuk sejajar arah panjang</p>
            <p>• <strong className="text-orange-300">4 rusuk lebar (l):</strong> rusuk sejajar arah lebar</p>
            <p>• <strong className="text-yellow-300">4 rusuk tinggi (t):</strong> rusuk sejajar arah tinggi</p>
            <div className="bg-slate-700/60 rounded p-2 mt-2">
              <BlockMath math="K = 4(p + l + t)" />
            </div>
          </div>
        </div>
        {/* Sisi */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-green-300 font-semibold mb-2">⬜ Sisi Balok (6 sisi, 3 pasang)</p>
          <SisiBalokSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• 2 sisi <strong className="text-blue-300">DEPAN & BELAKANG</strong>: berukuran p × t</p>
            <p>• 2 sisi <strong className="text-green-300">KIRI & KANAN</strong>: berukuran l × t</p>
            <p>• 2 sisi <strong className="text-yellow-300">ATAS & BAWAH</strong>: berukuran p × l</p>
          </div>
        </div>
        {/* Titik sudut */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold mb-2">● Titik Sudut (8 titik)</p>
          <p className="text-xs text-white/70">Setiap sudut balok adalah pertemuan 3 rusuk yang saling tegak lurus. Total 8 titik sudut — sama seperti kubus.</p>
        </div>
        {/* Diagonal bidang */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-orange-300 font-semibold mb-2">↗ Diagonal Bidang (12 diagonal)</p>
          <DiagBidangSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• Sisi depan/belakang: <InlineMath math="d = \sqrt{p^2 + t^2}" /> (× 4)</p>
            <p>• Sisi atas/bawah: <InlineMath math="d = \sqrt{p^2 + l^2}" /> (× 4)</p>
            <p>• Sisi kiri/kanan: <InlineMath math="d = \sqrt{l^2 + t^2}" /> (× 4)</p>
          </div>
        </div>
        {/* Diagonal ruang */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold mb-2">⟋ Diagonal Ruang (4 diagonal)</p>
          <DiagRuangSVG />
          <div className="text-xs text-white/70 mt-2">
            <div className="bg-slate-700/60 rounded p-2">
              <BlockMath math="d_r = \sqrt{p^2 + l^2 + t^2}" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Jaring-jaring Balok Interaktif 3D",
    icon: "🔲",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body">
        <p>
          Jaring-jaring balok adalah <strong className="text-cyan-300">bentuk 2D yang jika dilipat akan membentuk balok</strong>.
          Setiap jaring-jaring balok terdiri dari 6 persegi panjang — 3 pasang ukuran berbeda.
          Sisi <strong className="text-violet-300">BELAKANG (ungu)</strong> adalah tumpuan tetap.
        </p>
        <InteractiveBalok3D />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-cyan-300 font-semibold mb-3 text-xs">📐 Contoh Pola Jaring-jaring Balok:</p>
          <NetGallery />
          <div className="mt-3 flex flex-wrap gap-2">
            {(["p×t","l×t","p×l"] as const).map((label, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] text-white/60 font-body">
                <div className="w-3 h-3 rounded-sm" style={{ background: ["#8b5cf6","#22c55e","#eab308"][i] }}/>
                <span>{label === "p×t" ? "Depan/Belakang" : label === "l×t" ? "Kiri/Kanan" : "Atas/Bawah"} ({label})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Luas Permukaan Balok",
    icon: "🎨",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <p>
          <strong className="text-blue-300">Luas permukaan balok</strong> adalah jumlah luas seluruh 6 sisi yang membungkus balok.
        </p>
        <LuasSVG />
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
          <p className="text-white/70 text-xs">Penjumlahan luas 3 pasang sisi:</p>
          <div className="bg-slate-900/60 rounded p-2 text-xs space-y-1">
            <BlockMath math="L = 2(p \times l) + 2(p \times t) + 2(l \times t)" />
            <BlockMath math="L = 2(pl + pt + lt)" />
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p>🚀 <strong>Ingat:</strong> Ada 3 jenis pasang sisi. Hitung luas masing-masing lalu kalikan 2!</p>
          <p>• Sisi p×l (atas & bawah), sisi p×t (depan & belakang), sisi l×t (kiri & kanan)</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 <strong className="text-white">Satuan luas permukaan:</strong></p>
          <p>• Jika p, l, t dalam cm → Luas dalam <InlineMath math="\text{cm}^2" /></p>
          <p>• Jika p, l, t dalam m → Luas dalam <InlineMath math="\text{m}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    title: "Volume Balok",
    icon: "📦",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <p>
          <strong className="text-green-300">Volume balok</strong> menyatakan seberapa besar "isi" atau "ruang" yang ditempati balok.
          Volume = Luas alas × tinggi.
        </p>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 pt-2 pb-3">
          <p className="text-cyan-300 text-xs font-semibold font-body text-center mb-1">
            🌊 Balok diisi air — dari kosong hingga penuh
          </p>
          <WaterBalokAnimation />
          <p className="text-white/45 text-[10px] font-body text-center mt-1">
            Persentase menunjukkan proporsi volume terisi terhadap volume total
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
          <div className="bg-slate-900/60 rounded p-2">
            <BlockMath math="V = p \times l \times t" />
          </div>
          <p className="text-xs text-white/70">• Volume = Luas alas (p × l) × tinggi (t)</p>
          <p className="text-xs text-white/70">• Atau: Volume = panjang × lebar × tinggi</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 <strong className="text-white">Satuan volume:</strong></p>
          <p>• Jika p, l, t dalam cm → Volume dalam <InlineMath math="\text{cm}^3" /></p>
          <p>• Jika p, l, t dalam m → Volume dalam <InlineMath math="\text{m}^3" /></p>
          <p>• <InlineMath math="1 \text{ m}^3 = 1.000.000 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    title: "Kesimpulan — Rumus Lengkap Balok",
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Besaran</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Rumus</th>
                <th className="px-3 py-2 text-cyan-300">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Keliling semua rusuk", "K = 4(p+l+t)", "3 kelompok rusuk"],
                ["Luas sisi depan/belakang", "L₁ = p×t", "2 buah"],
                ["Luas sisi atas/bawah", "L₂ = p×l", "2 buah"],
                ["Luas sisi kiri/kanan", "L₃ = l×t", "2 buah"],
                ["Luas permukaan", "L = 2(pl+pt+lt)", "6 sisi total"],
                ["Diagonal bidang", "√(p²+l²), √(p²+t²), √(l²+t²)", "3 jenis"],
                ["Diagonal ruang", "d = √(p²+l²+t²)", "4 buah"],
                ["Volume", "V = p×l×t", "isi balok"],
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
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p>🚀 <strong>Kunci utama balok:</strong> Selalu identifikasi nilai <strong className="text-yellow-300">p, l, dan t</strong> terlebih dahulu sebelum menghitung!</p>
          <p>Dengan mengetahui p, l, t — kamu dapat menghitung segalanya.</p>
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
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kotak kado berbentuk balok dengan panjang <InlineMath math="20\text{ cm}" />, lebar <InlineMath math="15\text{ cm}" />, dan tinggi <InlineMath math="10\text{ cm}" />.</p>
        <p>Berapa luas kertas minimum yang diperlukan untuk membungkus seluruh kotak?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <p className="text-white/70">Diketahui: p = 20 cm, l = 15 cm, t = 10 cm</p>
          <BlockMath math="L = 2(pl + pt + lt)" />
          <BlockMath math="L = 2(20\times15 + 20\times10 + 15\times10)" />
          <BlockMath math="L = 2(300 + 200 + 150) = 2 \times 650 = 1.300\text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Luas permukaan = <InlineMath math="1.300\text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah balok memiliki luas permukaan <InlineMath math="376\text{ cm}^2" />.</p>
        <p>Jika panjang = 10 cm dan lebar = 8 cm, tentukan tinggi balok dan panjang diagonal ruangnya!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold text-xs">Langkah 1 — Cari tinggi:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1 text-xs">
          <BlockMath math="376 = 2(10\times8 + 10\times t + 8\times t)" />
          <BlockMath math="188 = 80 + 10t + 8t = 80 + 18t" />
          <BlockMath math="18t = 108 \Rightarrow t = 6\text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold text-xs">Langkah 2 — Diagonal ruang:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="d = \sqrt{10^2 + 8^2 + 6^2} = \sqrt{100+64+36} = \sqrt{200} = 10\sqrt{2} \approx 14{,}14\text{ cm}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-yellow-300">✅ t = 6 cm, d_r = <InlineMath math="10\sqrt{2} \approx 14{,}14\text{ cm}" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah ruangan berbentuk balok berukuran panjang 6 m, lebar 4 m, tinggi 3 m.</p>
        <p>Seluruh dinding dan langit-langit akan dicat (lantai tidak dicat).</p>
        <p>Jika 1 kaleng cat dapat menutup <InlineMath math="12\text{ m}^2" /> dan harga per kaleng <InlineMath math="Rp\,85.000" />, berapa total biaya pengecatan?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold text-xs">Langkah 1 — Luas yang dicat (tanpa lantai):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1 text-xs">
          <p className="text-white/70">Luas permukaan penuh = 2(pl + pt + lt)</p>
          <BlockMath math="L_{\text{penuh}} = 2(6\times4 + 6\times3 + 4\times3) = 2(24+18+12) = 108\text{ m}^2" />
          <p className="text-white/70">Kurangi 1 lantai (p×l):</p>
          <BlockMath math="L_{\text{cat}} = 108 - 6\times4 = 108 - 24 = 84\text{ m}^2" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 2 — Jumlah kaleng & biaya:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1 text-xs">
          <BlockMath math="\text{Kaleng} = \lceil 84 \div 12 \rceil = 7\text{ kaleng}" />
          <BlockMath math="\text{Biaya} = 7 \times 85.000 = Rp\,595.000" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas yang dicat = 84 m²</p>
          <p className="text-white/80">• Kaleng cat = 7 buah</p>
          <p className="text-white/80">• Total biaya = <strong className="text-yellow-300">Rp 595.000</strong></p>
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
        <p>Sebuah lemari berbentuk balok dengan panjang <InlineMath math="1{,}2\text{ m}" />, lebar <InlineMath math="0{,}6\text{ m}" />, dan tinggi <InlineMath math="2\text{ m}" />.</p>
        <p>Berapa volume lemari tersebut dalam <InlineMath math="\text{m}^3" /> dan dalam <InlineMath math="\text{cm}^3" />?</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <BlockMath math="V = p \times l \times t = 1{,}2 \times 0{,}6 \times 2 = 1{,}44\text{ m}^3" />
          <BlockMath math="1{,}44\text{ m}^3 = 1{,}44 \times 1.000.000 = 1.440.000\text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ V = 1,44 m³ = 1.440.000 cm³</p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kolam renang berbentuk balok berukuran panjang 25 m, lebar 10 m, dan kedalaman 2 m.</p>
        <p>Jika kolam diisi air hingga <InlineMath math="80\%" /> kapasitasnya, berapa liter air di dalamnya?</p>
        <p className="text-xs text-white/60">(Ingat: <InlineMath math="1\text{ m}^3 = 1.000\text{ liter}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <BlockMath math="V_{\text{total}} = 25 \times 10 \times 2 = 500\text{ m}^3 = 500.000\text{ liter}" />
          <BlockMath math="V_{80\%} = 80\% \times 500.000 = 400.000\text{ liter}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Volume air = 400.000 liter = 400 m³</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah bak truk berbentuk balok berukuran panjang 5 m, lebar 2 m, dan tinggi 1,5 m.</p>
        <p>Truk mengangkut pasir dengan massa jenis <InlineMath math="1.600\text{ kg/m}^3" /> dan diisi hingga penuh.</p>
        <p>Jika berat maksimum yang boleh dibawa truk adalah 20 ton, apakah truk kelebihan muatan? Berapa kelebihan atau kekurangannya?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold text-xs">Langkah 1 — Volume bak:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="V = 5 \times 2 \times 1{,}5 = 15\text{ m}^3" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 2 — Massa pasir:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="m = \rho \times V = 1.600 \times 15 = 24.000\text{ kg} = 24\text{ ton}" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 3 — Bandingkan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="24\text{ ton} - 20\text{ ton} = 4\text{ ton (kelebihan)}" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Volume pasir = 15 m³</p>
          <p className="text-white/80">• Massa pasir = 24 ton</p>
          <p className="text-white/80">• Truk <strong className="text-red-400">kelebihan muatan</strong> sebesar <strong className="text-yellow-300">4 ton</strong></p>
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
    icon: "📦",
    title: "Pengantar",
    content: (
      <div className="text-sm font-body text-white/75 leading-relaxed space-y-3">
        <SimpleRotatingBalok />
        <p>
          Dari kotak sepatu hingga lemari, kulkas, dan aquarium — balok ada di mana-mana dalam kehidupan kita!
          Pelajari semua tentang <strong className="text-cyan-300">balok</strong> — mulai dari unsur-unsurnya,
          jaring-jaring interaktif 3D, hingga cara menghitung{" "}
          <strong className="text-yellow-300">luas permukaan</strong> dan{" "}
          <strong className="text-green-300">volume</strong>-nya.
        </p>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/60 space-y-1">
          <p className="text-cyan-300 font-semibold mb-1">📋 Materi dalam bab ini:</p>
          <p>• Definisi &amp; sifat balok</p>
          <p>• Unsur-unsur: rusuk, sisi, titik sudut, diagonal</p>
          <p>• Jaring-jaring interaktif 3D</p>
          <p>• Luas permukaan dan volume</p>
          <p>• Contoh soal bertingkat</p>
        </div>
      </div>
    ),
  },
  {
    icon: "📦",
    title: "Definisi Balok",
    content: sections[0].content,
  },
  {
    icon: "⬛",
    title: "Unsur — Rusuk Balok",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-cyan-300 font-semibold mb-2">⬛ Rusuk Balok (12 rusuk)</p>
          <RusukBalokSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• <strong className="text-cyan-300">4 rusuk panjang (p):</strong> rusuk sejajar arah panjang</p>
            <p>• <strong className="text-orange-300">4 rusuk lebar (l):</strong> rusuk sejajar arah lebar</p>
            <p>• <strong className="text-yellow-300">4 rusuk tinggi (t):</strong> rusuk sejajar arah tinggi</p>
            <div className="bg-slate-700/60 rounded p-2 mt-2">
              <BlockMath math="K = 4(p + l + t)" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "⬜",
    title: "Unsur — Sisi Balok",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-green-300 font-semibold mb-2">⬜ Sisi Balok (6 sisi, 3 pasang)</p>
          <SisiBalokSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• 2 sisi <strong className="text-blue-300">DEPAN &amp; BELAKANG</strong>: berukuran p × t</p>
            <p>• 2 sisi <strong className="text-green-300">KIRI &amp; KANAN</strong>: berukuran l × t</p>
            <p>• 2 sisi <strong className="text-yellow-300">ATAS &amp; BAWAH</strong>: berukuran p × l</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "●",
    title: "Unsur — Titik Sudut",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold mb-2">● Titik Sudut (8 titik)</p>
          <p className="text-xs text-white/70">
            Setiap sudut balok adalah pertemuan 3 rusuk yang saling tegak lurus. Total 8 titik sudut — sama seperti kubus.
          </p>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p className="text-cyan-300 font-semibold">📋 Ringkasan Unsur Balok:</p>
          <p>• Rusuk: <strong className="text-yellow-300">12</strong> (3 kelompok × 4)</p>
          <p>• Sisi: <strong className="text-yellow-300">6</strong> (3 pasang)</p>
          <p>• Titik sudut: <strong className="text-yellow-300">8</strong></p>
        </div>
      </div>
    ),
  },
  {
    icon: "↗",
    title: "Unsur — Diagonal Bidang",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-orange-300 font-semibold mb-2">↗ Diagonal Bidang (12 diagonal)</p>
          <DiagBidangSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• Sisi depan/belakang: <InlineMath math="d = \sqrt{p^2 + t^2}" /> (× 4)</p>
            <p>• Sisi atas/bawah: <InlineMath math="d = \sqrt{p^2 + l^2}" /> (× 4)</p>
            <p>• Sisi kiri/kanan: <InlineMath math="d = \sqrt{l^2 + t^2}" /> (× 4)</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "⟋",
    title: "Unsur — Diagonal Ruang",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold mb-2">⟋ Diagonal Ruang (4 diagonal)</p>
          <DiagRuangSVG />
          <div className="text-xs text-white/70 mt-2">
            <div className="bg-slate-700/60 rounded p-2">
              <BlockMath math="d_r = \sqrt{p^2 + l^2 + t^2}" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
          <p className="text-orange-300 font-semibold">💡 Perbedaan Diagonal:</p>
          <p>• <strong className="text-orange-300">Diagonal Bidang</strong>: hanya melintasi 1 sisi (2D)</p>
          <p>• <strong className="text-yellow-300">Diagonal Ruang</strong>: menembus tengah balok (3D)</p>
        </div>
      </div>
    ),
  },
  {
    icon: "🔲",
    title: "Jaring-jaring Balok 3D",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body">
        <p>
          Jaring-jaring balok adalah <strong className="text-cyan-300">bentuk 2D yang jika dilipat akan membentuk balok</strong>.
          Setiap jaring-jaring balok terdiri dari 6 persegi panjang — 3 pasang ukuran berbeda.
          Sisi <strong className="text-violet-300">BELAKANG (ungu)</strong> adalah tumpuan tetap.
        </p>
        <InteractiveBalok3D />
      </div>
    ),
  },
  {
    icon: "🔲",
    title: "Contoh Pola Jaring-jaring",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-cyan-300 font-semibold mb-3 text-xs">📐 Contoh Pola Jaring-jaring Balok:</p>
          <NetGallery />
          <div className="mt-3 flex flex-wrap gap-2">
            {(["p×t","l×t","p×l"] as const).map((label, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] text-white/60 font-body">
                <div className="w-3 h-3 rounded-sm" style={{ background: ["#8b5cf6","#22c55e","#eab308"][i] }}/>
                <span>{label === "p×t" ? "Depan/Belakang" : label === "l×t" ? "Kiri/Kanan" : "Atas/Bawah"} ({label})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200">
          <p>💡 Ada <strong className="text-yellow-300">54 jenis</strong> jaring-jaring balok berbeda yang bisa dibuat!</p>
        </div>
      </div>
    ),
  },
  {
    icon: "🎨",
    title: "Luas Permukaan Balok",
    content: sections[3].content,
  },
  {
    icon: "📦",
    title: "Volume Balok",
    content: sections[4].content,
  },
  {
    icon: "📊",
    title: "Kesimpulan — Rumus Lengkap",
    content: sections[5].content,
  },
  {
    icon: "📝",
    title: "Contoh Soal — Luas Permukaan",
    content: (
      <div className="flex flex-col gap-3">
        {luasExamples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} prefix="Soal LP" />)}
      </div>
    ),
  },
  {
    icon: "📝",
    title: "Contoh Soal — Volume",
    content: (
      <div className="flex flex-col gap-3">
        {volExamples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} prefix="Soal Vol" />)}
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const BalokPage = () => {
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
        <Box className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BALOK
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
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalokPage;
