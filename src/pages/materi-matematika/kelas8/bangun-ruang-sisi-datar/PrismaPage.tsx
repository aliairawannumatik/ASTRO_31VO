import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Triangle } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import RusukTigaPrismaAnimation from "@/components/RusukTigaPrismaAnimation";
import SisiTigaPrismaAnimation from "@/components/SisiTigaPrismaAnimation";
import TitikSudutTigaPrismaAnimation from "@/components/TitikSudutTigaPrismaAnimation";
import JaringPrismaInteraktif from "@/components/JaringPrismaInteraktif";

/* ─────────────────────────────────────────────────────────────
   SVG-BASED 3D INTERACTIVE PRISMA — rotate & net view
───────────────────────────────────────────────────────────── */
type V3 = [number, number, number];
type V2 = [number, number];

const rotXv = (v: V3, a: number): V3 => [
  v[0],
  v[1] * Math.cos(a) - v[2] * Math.sin(a),
  v[1] * Math.sin(a) + v[2] * Math.cos(a),
];
const rotYv = (v: V3, a: number): V3 => [
  v[0] * Math.cos(a) + v[2] * Math.sin(a),
  v[1],
  -v[0] * Math.sin(a) + v[2] * Math.cos(a),
];
const project = (v: V3, fov = 480, scale = 1.6): V2 => {
  const tz = v[2] + fov;
  return [(v[0] * fov * scale) / tz, (v[1] * fov * scale) / tz];
};
const cross2d = (ax: number, ay: number, bx: number, by: number) => ax * by - ay * bx;

const FACE_COLORS = ["#ef4444", "#eab308", "#3b82f6", "#22c55e", "#f97316"];
const FACE_LABELS = ["ALAS", "TUTUP", "SISI 1", "SISI 2", "SISI 3"];

const InteractivePrisma3D = () => {
  const [rotX, setRotX] = useState(-28);
  const [rotY, setRotY] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [showNet, setShowNet] = useState(false);
  const dragRef = useRef({ sx: 0, sy: 0, bx: -28, by: 30 });

  // Equilateral triangle prism: side a, height h_prism
  const a = 90, hp = 85;
  const rc = a / Math.sqrt(3); // circumradius of equilateral triangle
  const ri = a / (2 * Math.sqrt(3)); // inradius

  // Vertices: V0-V2 = bottom, V3-V5 = top
  const rawVerts: V3[] = [
    [0, hp / 2, -rc],       // V0 bottom-front
    [-a / 2, hp / 2, ri],   // V1 bottom-left
    [a / 2, hp / 2, ri],    // V2 bottom-right
    [0, -hp / 2, -rc],      // V3 top-front
    [-a / 2, -hp / 2, ri],  // V4 top-left
    [a / 2, -hp / 2, ri],   // V5 top-right
  ];

  // Faces: indices into vertices + color + label
  const faceDefs = [
    { idx: [0, 2, 1],       color: FACE_COLORS[0], label: FACE_LABELS[0] }, // bottom △
    { idx: [3, 4, 5],       color: FACE_COLORS[1], label: FACE_LABELS[1] }, // top △
    { idx: [0, 1, 4, 3],   color: FACE_COLORS[2], label: FACE_LABELS[2] }, // left rect
    { idx: [1, 2, 5, 4],   color: FACE_COLORS[3], label: FACE_LABELS[3] }, // back rect
    { idx: [2, 0, 3, 5],   color: FACE_COLORS[4], label: FACE_LABELS[4] }, // right rect
  ];

  const rx = (rotX * Math.PI) / 180;
  const ry = (rotY * Math.PI) / 180;

  const tfVerts = rawVerts.map(v => rotXv(rotYv(v, ry), rx));
  const pverts: V2[] = tfVerts.map(v => project(v));

  // Render faces sorted back-to-front (painter's algorithm)
  const facesWithDepth = faceDefs.map(f => {
    const avgZ = f.idx.reduce((s, i) => s + tfVerts[i][2], 0) / f.idx.length;
    const pts2d = f.idx.map(i => pverts[i]);
    // Back-face culling via signed area
    const area = cross2d(
      pts2d[1][0] - pts2d[0][0], pts2d[1][1] - pts2d[0][1],
      pts2d[pts2d.length - 1][0] - pts2d[0][0], pts2d[pts2d.length - 1][1] - pts2d[0][1]
    );
    return { ...f, avgZ, pts2d, visible: area < 0 };
  }).sort((a, b) => b.avgZ - a.avgZ);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.by + (e.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.bx - (e.clientY - dragRef.current.sy) * 0.55);
  }, [isDragging]);
  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { sx: t.clientX, sy: t.clientY, bx: rotX, by: rotY };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setRotY(dragRef.current.by + (t.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.bx - (t.clientY - dragRef.current.sy) * 0.55);
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

  const cx = 150, cy = 128;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        {showNet
          ? "Jaring-jaring prisma segitiga — 2 segitiga alas + 3 sisi persegi panjang"
          : "Drag untuk memutar · Klik tombol di bawah untuk melihat jaring-jaring"}
      </p>

      <div className="relative mx-auto select-none overflow-visible"
        style={{ width: "100%", height: 300, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={!showNet ? onMouseDown : undefined}
        onTouchStart={!showNet ? onTouchStart : undefined}
      >
        {!showNet ? (
          /* ── 3D Rotatable Prism ── */
          <svg viewBox="0 0 300 260" className="w-full h-full" style={{ overflow: "visible" }}>
            {facesWithDepth.map((f, i) => {
              if (!f.visible) return null;
              const pts = f.pts2d.map(([x, y]) => `${cx + x},${cy + y}`).join(" ");
              const mx = f.pts2d.reduce((s, p) => s + p[0], 0) / f.pts2d.length;
              const my = f.pts2d.reduce((s, p) => s + p[1], 0) / f.pts2d.length;
              return (
                <g key={i}>
                  <polygon points={pts} fill={f.color} fillOpacity={0.85}
                    stroke="var(--icon-stroke)" strokeWidth={1.5} strokeLinejoin="round" />
                  <text x={cx + mx} y={cy + my + 3}
                    fill="var(--icon-color)" fontSize={9} fontFamily="monospace" fontWeight="bold"
                    textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: "none" }}>
                    {f.label}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          /* ── Flat Net View ── */
          <svg viewBox="0 0 300 260" className="w-full h-full">
            <JaringPrismaSVGInner cx={150} cy={130} animated={false} />
          </svg>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={() => { playPopSound(); setShowNet(v => !v); setRotX(-28); setRotY(30); }}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          {showNet ? "◆ Lihat 3D" : "⊞ Lihat Jaring-jaring"}
        </button>
        {!showNet && (
          <button onClick={() => { setRotX(-28); setRotY(30); }}
            className="px-3 py-1.5 text-xs font-bold bg-slate-700/60 border border-slate-500 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer font-body">
            ↺ Reset Tampilan
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {FACE_COLORS.map((c, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: c }} />
            <span className="text-white/50 text-[10px] font-body">{FACE_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   AUTO-ROTATING PRISMA 3D — slide 1 hero (3 types)
───────────────────────────────────────────────────────────── */
const makePrismaVerts = (n: number, r: number, h: number): V3[] => {
  const verts: V3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    verts.push([r * Math.cos(a), h / 2, r * Math.sin(a)]);
  }
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    verts.push([r * Math.cos(a), -h / 2, r * Math.sin(a)]);
  }
  return verts;
};
const makePrismaFaces = (n: number) => {
  const palette = ["#ef4444","#eab308","#3b82f6","#22c55e","#f97316","#ec4899","#06b6d4","#a78bfa"];
  const faces: { idx: number[]; color: string; label: string }[] = [];
  faces.push({ idx: Array.from({length:n},(_,i)=>i), color:palette[0], label:"ALAS" });
  faces.push({ idx: Array.from({length:n},(_,i)=>n+(n-1-i)), color:palette[1], label:"TUTUP" });
  for (let i = 0; i < n; i++) {
    const j = (i+1)%n;
    faces.push({ idx:[i,j,n+j,n+i], color:palette[(i+2)%palette.length], label:`S${i+1}` });
  }
  return faces;
};

const RotatingPrisma3D = ({ n, label, r = 38, h = 60 }: { n: number; label: string; r?: number; h?: number }) => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(n * 30);
  const [isDragging, setIsDragging] = useState(false);
  const isDragRef = useRef(false);
  const dragRef   = useRef({ sx:0, sy:0, bx:-22, by: n*30 });
  const tickRef   = useRef(n * 20);
  const rotYRef   = useRef(n * 30);
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
    const ny = dragRef.current.by - (e.clientX - dragRef.current.sx) * 0.55;
    const nx = dragRef.current.bx + (e.clientY - dragRef.current.sy) * 0.55;
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
    const nx = dragRef.current.bx + (t.clientY - dragRef.current.sy) * 0.55;
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
  const rawVerts = makePrismaVerts(n, r, h);
  const faceDefs = makePrismaFaces(n);
  const tfVerts = rawVerts.map(v => rotXv(rotYv(v, ry), rx));
  const pverts: V2[] = tfVerts.map(v => project(v, 380, 1.3));
  const facesWithDepth = faceDefs.map(f => {
    const avgZ = f.idx.reduce((s,i)=>s+tfVerts[i][2],0)/f.idx.length;
    const pts2d = f.idx.map(i => pverts[i]);
    const area = cross2d(pts2d[1][0]-pts2d[0][0],pts2d[1][1]-pts2d[0][1],pts2d[pts2d.length-1][0]-pts2d[0][0],pts2d[pts2d.length-1][1]-pts2d[0][1]);
    return { ...f, avgZ, pts2d, visible: area < 0 };
  }).sort((a,b) => b.avgZ - a.avgZ);
  const cx = 85, cy = 90;

  return (
    <div
      className="flex flex-col items-center bg-slate-900/60 border border-slate-700/50 rounded-xl py-2 px-1 select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab", flex:1, minWidth:0 }}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}
    >
      <span className="text-white/70 font-body font-semibold mb-1" style={{ fontSize:10 }}>{label}</span>
      <svg viewBox="0 0 170 180" style={{ width:"100%", maxWidth:160, overflow:"visible" }}>
        {facesWithDepth.map((f, i) => {
          const pts = f.pts2d.map(([x,y]) => `${cx+x},${cy+y}`).join(" ");
          const mx  = f.pts2d.reduce((s,p)=>s+p[0],0)/f.pts2d.length;
          const my  = f.pts2d.reduce((s,p)=>s+p[1],0)/f.pts2d.length;
          return (
            <g key={i}>
              <polygon points={pts} fill={f.color} fillOpacity={1}
                stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} strokeLinejoin="round"/>
              <text x={cx+mx} y={cy+my+3} fill="var(--icon-color)" fontSize={7} fontFamily="monospace"
                fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                style={{ pointerEvents:"none" }}>{f.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const ThreePrismas = () => (
  <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 space-y-2">
    <p className="text-center text-white/40 font-body" style={{ fontSize:9 }}>
      Berputar otomatis · Drag untuk memutar sendiri
    </p>
    <div className="flex gap-2">
      <RotatingPrisma3D n={3} label="Prisma Segitiga" r={38} h={60}/>
      <RotatingPrisma3D n={4} label="Prisma Segiempat" r={34} h={58}/>
      <RotatingPrisma3D n={5} label="Prisma Segilima" r={34} h={56}/>
    </div>
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
      {[["#ef4444","ALAS"],["#eab308","TUTUP"],["#3b82f6","SISI"]].map(([c,l])=>(
        <div key={l} className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background:c }}/>
          <span className="text-white/45 font-body" style={{ fontSize:9 }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   JARING-JARING PRISMA SVG
───────────────────────────────────────────────────────────── */
// Shared inner component for both interactive and static use
const JaringPrismaSVGInner = ({
  cx, cy, animated,
}: { cx: number; cy: number; animated: boolean }) => {
  const sp = 70, hp = 50, th = 35; // rect width, rect height, triangle height
  // Net: 3 rectangles side by side, triangles top and bottom of middle rect
  const ox = cx - (3 * sp) / 2;
  const oy = cy - (th + hp + th) / 2;

  const r1 = { x: ox,         y: oy + th, w: sp, h: hp, fill: "#3b82f6", label: "SISI 1\na×t" };
  const r2 = { x: ox + sp,    y: oy + th, w: sp, h: hp, fill: "#8b5cf6", label: "SISI 2\na×t" };
  const r3 = { x: ox + 2*sp,  y: oy + th, w: sp, h: hp, fill: "#22c55e", label: "SISI 3\na×t" };
  // Alas triangle (below rect 2)
  const alasPts = `${ox+sp},${oy+th+hp} ${ox+2*sp},${oy+th+hp} ${ox+1.5*sp},${oy+th+hp+th}`;
  // Tutup triangle (above rect 2)
  const tutupPts = `${ox+sp},${oy+th} ${ox+2*sp},${oy+th} ${ox+1.5*sp},${oy}`;

  const animA = animated ? "jnp-a" : "";
  const animB = animated ? "jnp-b" : "";
  const animC = animated ? "jnp-c" : "";

  return (
    <g>
      {animated && (
        <defs>
          <style>{`
            @keyframes jnpA{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 9px #818cf8);}50%{fill-opacity:0.35;filter:none;}}
            @keyframes jnpB{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 9px #4ade80);}50%{fill-opacity:0.35;filter:none;}}
            @keyframes jnpC{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 9px #facc15);}50%{fill-opacity:0.35;filter:none;}}
            .jnp-a{animation:jnpA 2.2s ease-in-out infinite;}
            .jnp-b{animation:jnpB 2.2s ease-in-out infinite 0.55s;}
            .jnp-c{animation:jnpC 2.2s ease-in-out infinite 1.1s;}
          `}</style>
        </defs>
      )}
      {/* 3 rectangular side faces */}
      {[r1, r2, r3].map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h}
            fill={r.fill} fillOpacity={0.88} rx={3}
            stroke="var(--icon-stroke)" strokeWidth={1.5}
            className={i === 0 ? animA : i === 1 ? animA : animA} />
          {r.label.split("\n").map((line, li) => (
            <text key={li} x={r.x + r.w / 2} y={r.y + r.h / 2 + (li - 0.4) * 10}
              fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold"
              textAnchor="middle" dominantBaseline="middle">{line}</text>
          ))}
        </g>
      ))}
      {/* Alas triangle */}
      <polygon points={alasPts} fill="#ef4444" fillOpacity={0.88} rx={3}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className={animB} />
      <text x={ox + 1.5*sp} y={oy + th + hp + th*0.55}
        fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle">ALAS</text>
      <text x={ox + 1.5*sp} y={oy + th + hp + th*0.55 + 10}
        fill="var(--icon-color)" fontSize={7} fontFamily="monospace"
        textAnchor="middle">½×a×t△</text>
      {/* Tutup triangle */}
      <polygon points={tutupPts} fill="#eab308" fillOpacity={0.88}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className={animC} />
      <text x={ox + 1.5*sp} y={oy + th*0.45}
        fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle">TUTUP</text>
      <text x={ox + 1.5*sp} y={oy + th*0.45 + 10}
        fill="var(--icon-color)" fontSize={7} fontFamily="monospace"
        textAnchor="middle">½×a×t△</text>
      {/* Dimension labels */}
      <text x={ox + sp/2} y={oy + th - 5}
        fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">a</text>
      <text x={ox - 8} y={oy + th + hp/2 + 4}
        fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">t</text>
    </g>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — Unsur-unsur Prisma
───────────────────────────────────────────────────────────── */
const RusukPrismaSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <style>{`
        @keyframes rusukP1{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22d3ee);}50%{stroke-opacity:0.2;}}
        @keyframes rusukP2{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #facc15);}50%{stroke-opacity:0.2;}}
        @keyframes rusukP3{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #f97316);}50%{stroke-opacity:0.2;}}
        .rp1{animation:rusukP1 1.6s ease-in-out infinite;stroke:#22d3ee;}
        .rp2{animation:rusukP2 1.6s ease-in-out infinite 0.5s;stroke:#facc15;}
        .rp3{animation:rusukP3 1.6s ease-in-out infinite 1s;stroke:#f97316;}
      `}</style>
    </defs>
    {/* Base: triangle at bottom front */}
    <polygon points="60,170 180,170 120,110" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.2"/>
    {/* Top: triangle at top back */}
    <polygon points="90,130 210,130 150,70" fill="rgba(30,41,59,0.5)" stroke="#334155" strokeWidth="1.2"/>
    {/* Connecting verticals */}
    <line x1="60" y1="170" x2="90" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="180" y1="170" x2="210" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="120" y1="110" x2="150" y2="70" stroke="#334155" strokeWidth="1.2"/>
    {/* 3 rusuk alas (bottom triangle) */}
    <line x1="60" y1="170" x2="180" y2="170" strokeWidth="3.5" className="rp1"/>
    <line x1="180" y1="170" x2="120" y2="110" strokeWidth="3.5" className="rp1"/>
    <line x1="120" y1="110" x2="60" y2="170" strokeWidth="3.5" className="rp1"/>
    {/* 3 rusuk atas (top triangle) */}
    <line x1="90" y1="130" x2="210" y2="130" strokeWidth="3.5" className="rp2"/>
    <line x1="210" y1="130" x2="150" y2="70" strokeWidth="3.5" className="rp2"/>
    <line x1="150" y1="70" x2="90" y2="130" strokeWidth="3.5" className="rp2"/>
    {/* 3 rusuk tegak */}
    <line x1="60" y1="170" x2="90" y2="130" strokeWidth="3.5" className="rp3"/>
    <line x1="180" y1="170" x2="210" y2="130" strokeWidth="3.5" className="rp3"/>
    <line x1="120" y1="110" x2="150" y2="70" strokeWidth="3.5" className="rp3"/>
    {/* Legend */}
    <rect x="218" y="125" width="8" height="4" fill="#22d3ee"/>
    <text x="230" y="130" fill="#22d3ee" fontSize="8" fontFamily="monospace">3 rusuk alas</text>
    <rect x="218" y="137" width="8" height="4" fill="#facc15"/>
    <text x="230" y="142" fill="#facc15" fontSize="8" fontFamily="monospace">3 rusuk atas</text>
    <rect x="218" y="149" width="8" height="4" fill="#f97316"/>
    <text x="230" y="154" fill="#f97316" fontSize="8" fontFamily="monospace">3 rusuk tegak</text>
    <text x="218" y="170" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">= 9 rusuk</text>
    <text x="218" y="180" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">(3n, n=3)</text>
  </svg>
);

const SisiPrismaSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <style>{`
        @keyframes sisiP{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.1;}}
        .sp-a{animation:sisiP 2s ease-in-out infinite;}
        .sp-b{animation:sisiP 2s ease-in-out infinite 0.5s;}
        .sp-c{animation:sisiP 2s ease-in-out infinite 1s;}
      `}</style>
    </defs>
    {/* Front face (rect) */}
    <polygon points="60,170 180,170 210,130 90,130" fill="#3b82f6" className="sp-a"/>
    {/* Left face (rect) */}
    <polygon points="60,170 90,130 150,70 120,110" fill="#22c55e" className="sp-b"/>
    {/* Top (triangle) */}
    <polygon points="90,130 210,130 150,70" fill="#eab308" className="sp-c"/>
    {/* Bottom (triangle) */}
    <polygon points="60,170 180,170 120,110" fill="#ef4444" className="sp-a" fillOpacity="0.6"/>
    {/* Right face (rect) */}
    <polygon points="180,170 210,130 150,70 120,110" fill="#f97316" className="sp-b" fillOpacity="0.6"/>
    {/* Outlines */}
    <polygon points="60,170 180,170 120,110" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
    <polygon points="90,130 210,130 150,70" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
    <line x1="60" y1="170" x2="90" y2="130" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
    <line x1="180" y1="170" x2="210" y2="130" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
    <line x1="120" y1="110" x2="150" y2="70" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
    <text x="220" y="170" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">5 sisi</text>
    <text x="220" y="181" fill="#facc15" fontSize="8" fontFamily="monospace">n+2=5</text>
    <text x="220" y="192" fill="var(--icon-color)" fontSize="7" fontFamily="monospace">(2 △ + 3 □)</text>
  </svg>
);

const TitikSudutPrismaSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <style>{`
        @keyframes dotP{0%,100%{r:6;filter:drop-shadow(0 0 6px #facc15);}50%{r:3;filter:none;}}
        .dp-a{animation:dotP 1.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon points="60,170 180,170 120,110" fill="none" stroke="#334155" strokeWidth="1.2"/>
    <polygon points="90,130 210,130 150,70" fill="none" stroke="#334155" strokeWidth="1.2"/>
    <line x1="60" y1="170" x2="90" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="180" y1="170" x2="210" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="120" y1="110" x2="150" y2="70" stroke="#334155" strokeWidth="1.2"/>
    {/* 6 vertices */}
    {[
      [60,170],[180,170],[120,110],
      [90,130],[210,130],[150,70]
    ].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={6} fill="#facc15" className="dp-a"
        style={{ animationDelay: `${i*0.2}s` }}/>
    ))}
    <text x="220" y="170" fill="#facc15" fontSize="9" fontFamily="monospace">6 titik</text>
    <text x="220" y="182" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">sudut</text>
    <text x="220" y="194" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">(2n = 6)</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   LUAS PERMUKAAN — animated jaring-jaring net
───────────────────────────────────────────────────────────── */
const LuasPrismaSVG = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-sm mx-auto my-2"
    aria-label="Jaring-jaring prisma — luas permukaan">
    <defs>
      <style>{`
        @keyframes jnpA2{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #818cf8);}50%{fill-opacity:0.3;filter:none;}}
        @keyframes jnpB2{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #4ade80);}50%{fill-opacity:0.3;filter:none;}}
        @keyframes jnpC2{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #facc15);}50%{fill-opacity:0.3;filter:none;}}
        .jnp2-a{animation:jnpA2 2.2s ease-in-out infinite;}
        .jnp2-b{animation:jnpB2 2.2s ease-in-out infinite 0.6s;}
        .jnp2-c{animation:jnpC2 2.2s ease-in-out infinite 1.2s;}
      `}</style>
      <filter id="lpBloom">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <JaringPrismaSVGInner cx={150} cy={105} animated />
    {/* Formula */}
    <text x="150" y="205" fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
      textAnchor="middle" filter="url(#lpBloom)">L = 2×L△ + (a+b+c)×t</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   JARING-JARING PRISMA SEGIEMPAT (persegi panjang)
───────────────────────────────────────────────────────────── */
const JaringSegiempatSVG = () => (
  <svg viewBox="0 0 340 240" className="w-full max-w-sm mx-auto my-2"
    aria-label="Jaring-jaring prisma segiempat — luas permukaan">
    <defs>
      <style>{`
        @keyframes jsq-a{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #818cf8);}50%{fill-opacity:0.3;filter:none;}}
        @keyframes jsq-b{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #4ade80);}50%{fill-opacity:0.3;filter:none;}}
        @keyframes jsq-c{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #facc15);}50%{fill-opacity:0.3;filter:none;}}
        .jsq-a{animation:jsq-a 2.2s ease-in-out infinite;}
        .jsq-b{animation:jsq-b 2.2s ease-in-out infinite 0.6s;}
        .jsq-c{animation:jsq-c 2.2s ease-in-out infinite 1.2s;}
      `}</style>
      <filter id="jsqBloom">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* 4 rectangular side faces in a row */}
    {/* r1: KIRI (l×t) */}
    <rect x={50} y={95} width={45} height={50} fill="#3b82f6" fillOpacity={0.88} rx={3}
      stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
    <text x={72.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">KIRI</text>
    <text x={72.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">l×t</text>
    {/* r2: DEPAN (p×t) */}
    <rect x={95} y={95} width={65} height={50} fill="#8b5cf6" fillOpacity={0.88} rx={3}
      stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
    <text x={127.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">DEPAN</text>
    <text x={127.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×t</text>
    {/* r3: KANAN (l×t) */}
    <rect x={160} y={95} width={45} height={50} fill="#22c55e" fillOpacity={0.88} rx={3}
      stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
    <text x={182.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">KANAN</text>
    <text x={182.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">l×t</text>
    {/* r4: BELAKANG (p×t) */}
    <rect x={205} y={95} width={65} height={50} fill="#f97316" fillOpacity={0.88} rx={3}
      stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
    <text x={237.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">BELAKANG</text>
    <text x={237.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×t</text>
    {/* ALAS (p×l) below r2 */}
    <rect x={95} y={145} width={65} height={45} fill="#ef4444" fillOpacity={0.88} rx={3}
      stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-b"/>
    <text x={127.5} y={164} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">ALAS</text>
    <text x={127.5} y={174} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×l</text>
    {/* TUTUP (p×l) above r2 */}
    <rect x={95} y={50} width={65} height={45} fill="#eab308" fillOpacity={0.88} rx={3}
      stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-c"/>
    <text x={127.5} y={69} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">TUTUP</text>
    <text x={127.5} y={79} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×l</text>
    {/* Dimension labels */}
    <text x={127.5} y={87} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">p</text>
    <text x={43} y={121} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">t</text>
    {/* Formula */}
    <text x="170" y="218" fill="#e0e7ff" fontSize={11} fontFamily="monospace" fontWeight="bold"
      textAnchor="middle" filter="url(#jsqBloom)">L = 2(pl) + 2(p+l)×t</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   JARING-JARING PRISMA SEGILIMA (pentagon)
───────────────────────────────────────────────────────────── */
const JaringSegilimaSVG = () => {
  // penta: regular pentagon centered at (cx,cy), circumradius r, starting angle startDeg
  const penta = (cx: number, cy: number, r: number, startDeg: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const angle = ((startDeg + i * 72) * Math.PI) / 180;
      return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
    }).join(" ");

  const sw = 50, rh = 50;
  const startX = 55;
  const oy = 100;           // rect top y
  const rectBottomY = oy + rh; // = 150  (rect bottom y)
  const pr = 26;            // pentagon circumradius

  // sin(54°) ≈ 0.809 — used to position the flat edge of the pentagon flush with the rect edge
  const sin54 = 0.8090;

  const rects = [
    { x: startX,           fill: "#3b82f6", label: "SISI 1" },
    { x: startX + sw,      fill: "#8b5cf6", label: "SISI 2" },
    { x: startX + 2 * sw,  fill: "#22c55e", label: "SISI 3" },
    { x: startX + 3 * sw,  fill: "#f97316", label: "SISI 4" },
    { x: startX + 4 * sw,  fill: "#ec4899", label: "SISI 5" },
  ];

  const midX = startX + 2 * sw + sw / 2; // center of rect 3 = 180

  // ALAS (below rect 3): flat edge at TOP connecting to rect bottom (y=150)
  // Flat-top config → start at -54°. Top two vertices are at -54° and 234°,
  // both at y = cy - pr*sin54. Set that = rectBottomY → cy = rectBottomY + pr*sin54
  const alasCY = rectBottomY + pr * sin54;           // ≈ 171.0
  const alasStart = -54;                             // flat-top (flat edge faces upward)

  // TUTUP (above rect 3): flat edge at BOTTOM connecting to rect top (y=100)
  // Point-top config → start at -90°. Bottom two vertices are at 54° and 126°,
  // both at y = cy + pr*sin54. Set that = oy → cy = oy - pr*sin54
  const tutupCY = oy - pr * sin54;                   // ≈ 79.0
  const tutupStart = -90;                            // point-top (flat edge faces downward)

  return (
    <svg viewBox="0 0 370 255" className="w-full max-w-sm mx-auto my-2"
      aria-label="Jaring-jaring prisma segilima — luas permukaan">
      <defs>
        <style>{`
          @keyframes jsg-a{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #818cf8);}50%{fill-opacity:0.3;filter:none;}}
          @keyframes jsg-b{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #4ade80);}50%{fill-opacity:0.3;filter:none;}}
          @keyframes jsg-c{0%,100%{fill-opacity:0.9;filter:drop-shadow(0 0 10px #facc15);}50%{fill-opacity:0.3;filter:none;}}
          .jsg-a{animation:jsg-a 2.2s ease-in-out infinite;}
          .jsg-b{animation:jsg-b 2.2s ease-in-out infinite 0.6s;}
          .jsg-c{animation:jsg-c 2.2s ease-in-out infinite 1.2s;}
        `}</style>
        <filter id="jsgBloom">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* 5 rectangular side faces — connected strip */}
      {rects.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={oy} width={sw} height={rh} fill={r.fill} fillOpacity={0.88}
            stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsg-a"/>
          <text x={r.x + sw / 2} y={oy + rh / 2 - 4} fill="var(--icon-color)" fontSize={6.5}
            fontFamily="monospace" fontWeight="bold" textAnchor="middle">{r.label}</text>
          <text x={r.x + sw / 2} y={oy + rh / 2 + 7} fill="var(--icon-color)" fontSize={6}
            fontFamily="monospace" textAnchor="middle">a×t</text>
        </g>
      ))}
      {/* ALAS pentagon — flat top flush with rect 3 bottom edge */}
      <polygon points={penta(midX, alasCY, pr, alasStart)} fill="#ef4444" fillOpacity={0.88}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsg-b"/>
      <text x={midX} y={alasCY + 6} fill="var(--icon-color)" fontSize={7}
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">ALAS</text>
      {/* TUTUP pentagon — flat bottom flush with rect 3 top edge */}
      <polygon points={penta(midX, tutupCY, pr, tutupStart)} fill="#eab308" fillOpacity={0.88}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsg-c"/>
      <text x={midX} y={tutupCY + 4} fill="var(--icon-color)" fontSize={7}
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">TUTUP</text>
      {/* Dimension labels */}
      <text x={startX + sw / 2} y={oy - 5} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">a</text>
      <text x={startX - 10} y={oy + rh / 2 + 4} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">t</text>
      {/* Formula */}
      <text x="185" y="243" fill="#e0e7ff" fontSize={10} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#jsgBloom)">L = 2×L△₅ + 5a×t</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   LUAS PERMUKAAN — tab selector (3 jenis prisma)
───────────────────────────────────────────────────────────── */
const JaringTabSelector = () => {
  const [tab, setTab] = useState<"segitiga" | "segiempat" | "segilima">("segitiga");
  const tabs = [
    { id: "segitiga", label: "Segitiga" },
    { id: "segiempat", label: "Segiempat" },
    { id: "segilima", label: "Segilima" },
  ] as const;
  return (
    <div className="space-y-3">
      <div className="flex rounded-lg overflow-hidden border border-slate-600 w-full">
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => { playPopSound(); setTab(t.id); }}
            className={`flex-1 py-1.5 text-xs font-bold font-body transition-colors cursor-pointer
              ${tab === t.id
                ? "bg-cyan-800/80 text-cyan-200 border-b-2 border-cyan-400"
                : "bg-slate-800/60 text-white/50 hover:text-white/80 hover:bg-slate-700/60"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "segitiga" && (
        <div>
          <LuasPrismaSVG />
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/40 rounded-lg p-3 my-2 text-center">
            <p className="text-[11px] text-cyan-300 font-semibold mb-1">Rumus Umum Luas Permukaan Prisma</p>
            <p className="font-mono text-sm md:text-base font-bold text-yellow-200">L permukaan = 2·L<sub>a</sub> + K<sub>a</sub> × t</p>
            <p className="text-[10px] text-white/60 mt-1 italic">L<sub>a</sub> = Luas alas · K<sub>a</sub> = Keliling alas · t = tinggi prisma</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">📐 Rumus — Prisma Segitiga:</p>
            <p>• Luas alas/tutup: <span className="text-yellow-300">L△ = ½ × a × t△</span></p>
            <p>• Keliling alas: <span className="text-yellow-300">K = a + b + c</span></p>
            <p className="text-white/90 font-semibold font-mono">L = 2×L△ + (a+b+c)×t</p>
          </div>
        </div>
      )}
      {tab === "segiempat" && (
        <div>
          <JaringSegiempatSVG />
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/40 rounded-lg p-3 my-2 text-center">
            <p className="text-[11px] text-cyan-300 font-semibold mb-1">Rumus Umum Luas Permukaan Prisma</p>
            <p className="font-mono text-sm md:text-base font-bold text-yellow-200">L permukaan = 2·L<sub>a</sub> + K<sub>a</sub> × t</p>
            <p className="text-[10px] text-white/60 mt-1 italic">L<sub>a</sub> = Luas alas · K<sub>a</sub> = Keliling alas · t = tinggi prisma</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">📐 Rumus — Prisma Segiempat (Balok):</p>
            <p>• Luas alas/tutup: <span className="text-yellow-300">L□ = p × l</span></p>
            <p>• Keliling alas: <span className="text-yellow-300">K = 2(p + l)</span></p>
            <p className="text-white/90 font-semibold font-mono">L = 2(pl) + 2(p+l)×t</p>
          </div>
        </div>
      )}
      {tab === "segilima" && (
        <div>
          <JaringSegilimaSVG />
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/40 rounded-lg p-3 my-2 text-center">
            <p className="text-[11px] text-cyan-300 font-semibold mb-1">Rumus Umum Luas Permukaan Prisma</p>
            <p className="font-mono text-sm md:text-base font-bold text-yellow-200">L permukaan = 2·L<sub>a</sub> + K<sub>a</sub> × t</p>
            <p className="text-[10px] text-white/60 mt-1 italic">L<sub>a</sub> = Luas alas · K<sub>a</sub> = Keliling alas · t = tinggi prisma</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">📐 Rumus — Prisma Segilima (alas sama sisi a):</p>
            <p>• Luas segi-5: <span className="text-yellow-300">L△₅ = ½ × keliling × apotema</span></p>
            <p>• Keliling alas: <span className="text-yellow-300">K = 5 × a</span></p>
            <p className="text-white/90 font-semibold font-mono">L = 2×L△₅ + 5a×t</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   VOLUME PRISMA — animated water-fill visualization
───────────────────────────────────────────────────────────── */
const WaterPrismaAnimation = () => {
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

  /* ── Upright prism geometry (standing on triangular base) ──
     Bottom triangle = ALAS at the bottom
     Top triangle    = TUTUP at the top
     Rectangular faces go vertically
     Oblique depth: back vertex recedes to the upper-right
  */
  const BL: V2 = [68,  182];  // bottom-left  (front-left of ALAS)
  const BR: V2 = [178, 182];  // bottom-right (front-right of ALAS)
  const BB: V2 = [123, 152];  // bottom-back  (back vertex of ALAS, oblique depth)
  const H = 108;              // prism height in screen pixels
  const TL: V2 = [BL[0], BL[1] - H];   // top-left  = [68,  74]
  const TR: V2 = [BR[0], BR[1] - H];   // top-right = [178, 74]
  const TB: V2 = [BB[0], BB[1] - H];   // top-back  = [123, 44]

  const lerp = (a: V2, b: V2, t: number): V2 => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
  const p  = (v: V2) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pp = (...vs: V2[]) => vs.map(p).join(" ");

  // Water surface vertices rising from bottom to top
  const WL = lerp(BL, TL, fill);
  const WR = lerp(BR, TR, fill);
  const WB = lerp(BB, TB, fill);

  const pct     = Math.round(fill * 100);
  const isEmpty = fill < 0.005;
  const isFull  = fill > 0.995;

  // Progress bar — sits right beside the prism
  const barX = 194, barY = TL[1], barW = 13, barH = H;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto my-2"
      aria-label="Animasi prisma segitiga berdiri diisi air">
      <defs>
        <filter id="wBloom">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Hidden back vertical edge (dashed) ── */}
      <line x1={BB[0]} y1={BB[1]} x2={TB[0]} y2={TB[1]}
        stroke="#334155" strokeWidth="1.2" strokeDasharray="4,3"/>
      {/* Hidden bottom back edges (dashed) */}
      <line x1={BL[0]} y1={BL[1]} x2={BB[0]} y2={BB[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={BR[0]} y1={BR[1]} x2={BB[0]} y2={BB[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>

      {/* ── Ghost shell: prism faces above water (always drawn, semi-transparent) ── */}
      {/* Right face */}
      <polygon points={pp(BR, BB, TB, TR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      {/* Front face */}
      <polygon points={pp(BL, BR, TR, TL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>

      {/* ── WATER (painter: back → front) ── */}
      {!isEmpty && (
        <>
          {/* ALAS floor — always fully blue */}
          <polygon points={pp(BL, BR, BB)}
            fill="#1e3a8a" fillOpacity={0.90}/>

          {/* Right face water band */}
          <polygon points={pp(BR, BB, WB, WR)}
            fill="#1d4ed8" fillOpacity={0.80}/>

          {/* Front face water band */}
          <polygon points={pp(BL, BR, WR, WL)}
            fill="#2563eb" fillOpacity={0.90}/>

          {/* Water surface (triangular ripple) */}
          {!isFull && (
            <polygon points={pp(WL, WR, WB)}
              fill="#7dd3fc" fillOpacity={0.50}
              style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}/>
          )}

          {/* Ripple line at water surface on front face */}
          {!isFull && (
            <line x1={WL[0]} y1={WL[1]} x2={WR[0]} y2={WR[1]}
              stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
          )}
        </>
      )}

      {/* ── Prism wireframe (solid edges, drawn over water) ── */}
      {/* Front face outline */}
      <polygon points={pp(BL, BR, TR, TL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      {/* Right face outline */}
      <polygon points={pp(BR, BB, TB, TR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* TUTUP top triangle */}
      <polygon points={pp(TL, TR, TB)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      {/* Top back edges */}
      <line x1={TL[0]} y1={TL[1]} x2={TB[0]} y2={TB[1]} stroke="#c4b5fd" strokeWidth="1.8"/>
      <line x1={TR[0]} y1={TR[1]} x2={TB[0]} y2={TB[1]} stroke="#c4b5fd" strokeWidth="1.8"/>

      {/* ── Labels ── */}
      {/* ALAS label */}
      <text x={(BL[0]+BR[0])/2} y={BL[1]+13}
        fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        ALAS (L△)
      </text>
      {/* TUTUP label */}
      <text x={(TL[0]+TR[0])/2} y={TL[1]-7}
        fill="#c4b5fd" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        TUTUP
      </text>
      {/* Height label (t) — left side */}
      <text x={BL[0]-14} y={(BL[1]+TL[1])/2+4}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
      <line x1={BL[0]-8} y1={BL[1]} x2={BL[0]-8} y2={TL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>

      {/* ── Progress bar ── */}
      <rect x={barX} y={barY} width={barW} height={barH}
        fill="#0f172a" stroke="#334155" strokeWidth="1.2" rx="3"/>
      {!isEmpty && (
        <rect x={barX} y={barY + barH - filledH} width={barW} height={filledH}
          fill="#2563eb" fillOpacity={0.88} rx="3"/>
      )}
      <text x={barX + barW/2} y={barY - 6}
        fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">V%</text>
      <text x={barX + barW/2} y={barY + barH + 12}
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {pct}%
      </text>

      {/* ── Status + Formula ── */}
      <text x="122" y="203"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloom)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x="122" y="217"
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloom)">
        V = L△ × t
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   VOLUME PRISMA SEGIEMPAT — animated water-fill visualization
───────────────────────────────────────────────────────────── */
const WaterSegiempatAnimation = () => {
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

  // Rectangular prism in oblique projection
  const FL: V2  = [58, 183];
  const FR: V2  = [168, 183];
  const H       = 105;
  const dx = 28, dy = -18;

  const BkL: V2  = [FL[0] + dx, FL[1] + dy];
  const BkR: V2  = [FR[0] + dx, FR[1] + dy];
  const FTL: V2  = [FL[0], FL[1] - H];
  const FTR: V2  = [FR[0], FR[1] - H];
  const BkTL: V2 = [BkL[0], BkL[1] - H];
  const BkTR: V2 = [BkR[0], BkR[1] - H];

  const lerp = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const p  = (v: V2) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pp = (...vs: V2[]) => vs.map(p).join(" ");

  const WFL  = lerp(FL,  FTL,  fill);
  const WFR  = lerp(FR,  FTR,  fill);
  const WBkL = lerp(BkL, BkTL, fill);
  const WBkR = lerp(BkR, BkTR, fill);

  const pct     = Math.round(fill * 100);
  const isEmpty = fill < 0.005;
  const isFull  = fill > 0.995;

  const barX = 207, barY = FTL[1], barW = 13, barH = H;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto my-2"
      aria-label="Animasi prisma segiempat berdiri diisi air">
      <defs>
        <filter id="wBloom2">
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

      {/* Ghost shell */}
      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>

      {/* WATER */}
      {!isEmpty && (
        <>
          <polygon points={pp(FL, FR, BkR, BkL)}
            fill="#1e3a8a" fillOpacity={0.90}/>
          <polygon points={pp(FR, BkR, WBkR, WFR)}
            fill="#1d4ed8" fillOpacity={0.80}/>
          <polygon points={pp(FL, FR, WFR, WFL)}
            fill="#2563eb" fillOpacity={0.90}/>
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

      {/* Prism wireframe */}
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      <polygon points={pp(FTL, FTR, BkTR, BkTL)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>

      {/* Labels */}
      <text x={(FL[0] + FR[0]) / 2} y={FL[1] + 13}
        fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        ALAS (p×l)
      </text>
      <text x={(FTL[0] + FTR[0]) / 2} y={FTL[1] - 7}
        fill="#c4b5fd" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        TUTUP
      </text>
      <text x={FL[0] - 14} y={(FL[1] + FTL[1]) / 2 + 4}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
      <line x1={FL[0] - 8} y1={FL[1]} x2={FL[0] - 8} y2={FTL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>

      {/* Progress bar */}
      <rect x={barX} y={barY} width={barW} height={barH}
        fill="#0f172a" stroke="#334155" strokeWidth="1.2" rx="3"/>
      {!isEmpty && (
        <rect x={barX} y={barY + barH - filledH} width={barW} height={filledH}
          fill="#2563eb" fillOpacity={0.88} rx="3"/>
      )}
      <text x={barX + barW / 2} y={barY - 6}
        fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">V%</text>
      <text x={barX + barW / 2} y={barY + barH + 12}
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {pct}%
      </text>

      {/* Status + Formula */}
      <text x="125" y="203"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloom2)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x="125" y="217"
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloom2)">
        V = L□ × t
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   VOLUME PRISMA SEGILIMA — animated water-fill visualization
───────────────────────────────────────────────────────────── */
const WaterSegilimAnimation = () => {
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

  // Pentagonal prism in oblique projection (flat-bottom pentagon)
  // Bottom pentagon vertices
  const BL:  V2 = [58,  180];  // front-left
  const BR:  V2 = [155, 180];  // front-right
  const RB:  V2 = [182, 157];  // right
  const BC:  V2 = [107, 138];  // back-center
  const LB:  V2 = [31,  157];  // left

  const H = 100;

  const TL:  V2 = [BL[0], BL[1] - H];
  const TR:  V2 = [BR[0], BR[1] - H];
  const TR2: V2 = [RB[0], RB[1] - H];
  const TC:  V2 = [BC[0], BC[1] - H];
  const TL2: V2 = [LB[0], LB[1] - H];

  const lerp = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const p  = (v: V2) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pp = (...vs: V2[]) => vs.map(p).join(" ");

  const WBL  = lerp(BL,  TL,  fill);
  const WBR  = lerp(BR,  TR,  fill);
  const WRB  = lerp(RB,  TR2, fill);
  const WBC  = lerp(BC,  TC,  fill);
  const WLB  = lerp(LB,  TL2, fill);

  const pct     = Math.round(fill * 100);
  const isEmpty = fill < 0.005;
  const isFull  = fill > 0.995;

  const barX = 196, barY = TL[1], barW = 13, barH = H;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto my-2"
      aria-label="Animasi prisma segilima berdiri diisi air">
      <defs>
        <filter id="wBloom3">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Hidden back edges (dashed) */}
      <line x1={BC[0]} y1={BC[1]} x2={TC[0]} y2={TC[1]}
        stroke="#334155" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={LB[0]} y1={LB[1]} x2={TL2[0]} y2={TL2[1]}
        stroke="#334155" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={BL[0]} y1={BL[1]} x2={LB[0]} y2={LB[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={LB[0]} y1={LB[1]} x2={BC[0]} y2={BC[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={TL[0]} y1={TL[1]} x2={TL2[0]} y2={TL2[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={TL2[0]} y1={TL2[1]} x2={TC[0]} y2={TC[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>

      {/* Ghost shell (right face and front face above water) */}
      <polygon points={pp(BR, RB, TR2, TR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      <polygon points={pp(BL, BR, TR, TL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>

      {/* WATER (painter: back → front) */}
      {!isEmpty && (
        <>
          {/* Pentagon floor */}
          <polygon points={pp(BL, BR, RB, BC, LB)}
            fill="#1e3a8a" fillOpacity={0.90}/>
          {/* Right face water band */}
          <polygon points={pp(BR, RB, WRB, WBR)}
            fill="#1d4ed8" fillOpacity={0.80}/>
          {/* Front face water band */}
          <polygon points={pp(BL, BR, WBR, WBL)}
            fill="#2563eb" fillOpacity={0.90}/>
          {/* Water surface (pentagon) */}
          {!isFull && (
            <polygon points={pp(WBL, WBR, WRB, WBC, WLB)}
              fill="#7dd3fc" fillOpacity={0.50}
              style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}/>
          )}
          {!isFull && (
            <line x1={WBL[0]} y1={WBL[1]} x2={WBR[0]} y2={WBR[1]}
              stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
          )}
        </>
      )}

      {/* Prism wireframe */}
      <polygon points={pp(BL, BR, TR, TL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(BR, RB, TR2, TR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Top pentagon */}
      <polygon points={pp(TL, TR, TR2, TC, TL2)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      {/* Visible top back edges */}
      <line x1={TR[0]} y1={TR[1]} x2={TR2[0]} y2={TR2[1]} stroke="#c4b5fd" strokeWidth="1.8"/>
      <line x1={TR2[0]} y1={TR2[1]} x2={TC[0]} y2={TC[1]} stroke="#c4b5fd" strokeWidth="1.8"/>

      {/* Labels */}
      <text x={(BL[0] + BR[0]) / 2} y={BL[1] + 13}
        fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        ALAS (L△₅)
      </text>
      <text x={(TL[0] + TR[0]) / 2} y={TL[1] - 7}
        fill="#c4b5fd" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        TUTUP
      </text>
      <text x={BL[0] - 14} y={(BL[1] + TL[1]) / 2 + 4}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
      <line x1={BL[0] - 8} y1={BL[1]} x2={BL[0] - 8} y2={TL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>

      {/* Progress bar */}
      <rect x={barX} y={barY} width={barW} height={barH}
        fill="#0f172a" stroke="#334155" strokeWidth="1.2" rx="3"/>
      {!isEmpty && (
        <rect x={barX} y={barY + barH - filledH} width={barW} height={filledH}
          fill="#2563eb" fillOpacity={0.88} rx="3"/>
      )}
      <text x={barX + barW / 2} y={barY - 6}
        fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">V%</text>
      <text x={barX + barW / 2} y={barY + barH + 12}
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {pct}%
      </text>

      {/* Status + Formula */}
      <text x="113" y="203"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloom3)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x="113" y="217"
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloom3)">
        V = L⬟ × t
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   VOLUME TAB SELECTOR (3 jenis prisma)
───────────────────────────────────────────────────────────── */
const VolumeTabSelector = () => {
  const [tab, setTab] = useState<"segitiga" | "segiempat" | "segilima">("segitiga");
  const tabs = [
    { id: "segitiga",  label: "Segitiga"  },
    { id: "segiempat", label: "Segiempat" },
    { id: "segilima",  label: "Segilima"  },
  ] as const;
  return (
    <div className="space-y-3">
      <div className="flex rounded-lg overflow-hidden border border-slate-600 w-full">
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => { playPopSound(); setTab(t.id); }}
            className={`flex-1 py-1.5 text-xs font-bold font-body transition-colors cursor-pointer
              ${tab === t.id
                ? "bg-cyan-800/80 text-cyan-200 border-b-2 border-cyan-400"
                : "bg-slate-800/60 text-white/50 hover:text-white/80 hover:bg-slate-700/60"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "segitiga" && (
        <div>
          <WaterPrismaAnimation />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-1 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">📐 Rumus — Prisma Segitiga:</p>
            <p>• Luas alas: <span className="text-yellow-300">L△ = ½ × a × t△</span></p>
            <p className="text-white/90 font-semibold font-mono">V = L△ × t</p>
          </div>
        </div>
      )}
      {tab === "segiempat" && (
        <div>
          <WaterSegiempatAnimation />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-1 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">📐 Rumus — Prisma Segiempat (Balok):</p>
            <p>• Luas alas: <span className="text-yellow-300">L□ = p × l</span></p>
            <p className="text-white/90 font-semibold font-mono">V = L□ × t</p>
          </div>
        </div>
      )}
      {tab === "segilima" && (
        <div>
          <WaterSegilimAnimation />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-1 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">📐 Rumus — Prisma Segilima:</p>
            <p>• Luas alas segi-5: <span className="text-yellow-300">L⬟ = ½ × keliling × apotema</span></p>
            <p className="text-white/90 font-semibold font-mono">V = L⬟ × t</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

const sections: Sec[] = [
  {
    title: "Definisi Prisma",
    icon: "🔷",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Prisma adalah <strong className="text-cyan-300">bangun ruang sisi datar</strong> yang memiliki
          dua alas berbentuk segi-<InlineMath math="n" /> yang kongruen dan sejajar, dihubungkan oleh
          <strong className="text-yellow-300"> sisi tegak berbentuk persegi panjang</strong>.
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">📌 Sifat-sifat Prisma:</p>
          <ul className="space-y-1 text-xs text-white/75">
            <li>• Dua alas berbentuk segi-<InlineMath math="n" /> yang <strong className="text-yellow-300">kongruen dan sejajar</strong></li>
            <li>• Sisi tegak berbentuk <strong className="text-yellow-300">persegi panjang</strong></li>
            <li>• Tinggi (t) = jarak antara dua bidang alas</li>
            <li>• Nama prisma ditentukan oleh <strong className="text-yellow-300">bentuk alasnya</strong></li>
          </ul>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
          <p className="text-cyan-300 font-semibold mb-1">Jenis-jenis Prisma:</p>
          {[
            ["Prisma Segitiga", "alas segitiga", "5 sisi, 9 rusuk, 6 titik sudut"],
            ["Prisma Segiempat", "alas segiempat (= balok)", "6 sisi, 12 rusuk, 8 titik sudut"],
            ["Prisma Segilima", "alas segilima", "7 sisi, 15 rusuk, 10 titik sudut"],
            ["Prisma Segienam", "alas segienam", "8 sisi, 18 rusuk, 12 titik sudut"],
          ].map(([nama, alas, detail], i) => (
            <p key={i}>• <strong className="text-white">{nama}</strong> ({alas}): {detail}</p>
          ))}
        </div>
        <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
          💡 <strong>Pola umum:</strong> Untuk prisma segi-n: sisi = n+2, rusuk = 3n, titik sudut = 2n
        </blockquote>
      </div>
    ),
  },
  {
    title: "Unsur-unsur Prisma Segitiga (Interaktif)",
    icon: "🔍",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        <p className="text-xs text-white/60">Contoh: prisma segitiga (n = 3)</p>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-cyan-300 font-semibold mb-2">⬛ Rusuk Prisma Segitiga (9 rusuk)</p>
          <RusukPrismaSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• <strong className="text-cyan-300">3 rusuk alas:</strong> membentuk segitiga alas bawah</p>
            <p>• <strong className="text-yellow-300">3 rusuk atas:</strong> membentuk segitiga alas atas</p>
            <p>• <strong className="text-orange-300">3 rusuk tegak:</strong> menghubungkan alas atas dan bawah</p>
            <div className="bg-slate-700/60 rounded p-2 mt-2">
              <BlockMath math="\text{Jumlah rusuk} = 3n = 3 \times 3 = 9" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-green-300 font-semibold mb-2">⬜ Sisi Prisma Segitiga (5 sisi)</p>
          <SisiPrismaSVG />
          <div className="text-xs text-white/70 space-y-1 mt-2">
            <p>• 2 sisi <strong className="text-yellow-300">ALAS & TUTUP</strong>: berbentuk segitiga</p>
            <p>• 3 sisi <strong className="text-blue-300">TEGAK</strong>: berbentuk persegi panjang (a × t)</p>
            <div className="bg-slate-700/60 rounded p-2 mt-2">
              <BlockMath math="\text{Jumlah sisi} = n + 2 = 3 + 2 = 5" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold mb-2">● Titik Sudut (6 titik)</p>
          <TitikSudutPrismaSVG />
          <div className="bg-slate-700/60 rounded p-2 mt-2 text-xs text-white/70">
            <BlockMath math="\text{Titik sudut} = 2n = 2 \times 3 = 6" />
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p className="text-cyan-300 font-semibold">📋 Tabel Unsur Prisma Segi-n:</p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs text-center">
              <thead><tr className="border-b border-cyan-800">
                <th className="px-2 py-1 text-left">Jenis</th>
                <th className="px-2 py-1">Sisi</th>
                <th className="px-2 py-1">Rusuk</th>
                <th className="px-2 py-1">T. Sudut</th>
              </tr></thead>
              <tbody>
                {[["Segitiga (n=3)", 5, 9, 6], ["Segiempat (n=4)", 6, 12, 8],
                  ["Segilima (n=5)", 7, 15, 10], ["Segienam (n=6)", 8, 18, 12]].map(([n, s, r, ts], i) => (
                  <tr key={i} className={`border-t border-cyan-900 ${i%2===0?"bg-cyan-950/30":""}`}>
                    <td className="px-2 py-1 text-left">{n}</td>
                    <td className="px-2 py-1 text-yellow-300">{s}</td>
                    <td className="px-2 py-1 text-yellow-300">{r}</td>
                    <td className="px-2 py-1 text-yellow-300">{ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Jaring-jaring Prisma Segitiga Interaktif 3D",
    icon: "🔲",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body">
        <p>
          Jaring-jaring prisma segitiga adalah <strong className="text-cyan-300">bentuk 2D yang jika dilipat akan membentuk prisma</strong>.
          Terdiri dari <strong className="text-yellow-300">2 segitiga</strong> (alas dan tutup) serta
          <strong className="text-blue-300"> 3 persegi panjang</strong> (sisi tegak).
        </p>
        <InteractivePrisma3D />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
          <p className="text-cyan-300 font-semibold mb-2">📐 Susunan Jaring-jaring Prisma Segitiga:</p>
          <p>• 3 persegi panjang berjajar (sisi tegak, masing-masing = a × t)</p>
          <p>• 2 segitiga (alas dan tutup) menempel pada sisi tegak</p>
          <p>• Ada 3 pola jaring-jaring yang umum digunakan</p>
        </div>
      </div>
    ),
  },
  {
    title: "Luas Permukaan Prisma",
    icon: "🎨",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <p>
          <strong className="text-blue-300">Luas permukaan prisma</strong> adalah jumlah luas seluruh sisi yang membungkus prisma
          — dua sisi alas/tutup ditambah seluruh sisi tegak (selimut).
        </p>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
          <div className="bg-slate-900/60 rounded p-3 space-y-2">
            <BlockMath math="L = 2 \times L_{\text{alas}} + L_{\text{selimut}}" />
            <BlockMath math="L_{\text{selimut}} = \text{Keliling alas} \times t" />
          </div>
        </div>
        <p className="text-xs text-white/60 text-center">Pilih jenis prisma untuk melihat jaring-jaringnya:</p>
        <JaringTabSelector />
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p>🚀 <strong>Kunci:</strong> Luas selimut = Keliling alas × tinggi prisma (t)</p>
          <p>• Prisma segitiga: <span className="text-yellow-300">L = 2×L△ + (a+b+c)×t</span></p>
          <p>• Prisma segiempat: <span className="text-yellow-300">L = 2(pl) + 2(p+l)×t</span></p>
          <p>• Prisma segilima: <span className="text-yellow-300">L = 2×L△₅ + 5a×t</span></p>
        </div>
      </div>
    ),
  },
  {
    title: "Volume Prisma",
    icon: "📐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <p>
          <strong className="text-green-300">Volume prisma</strong> menyatakan seberapa besar "isi" ruang yang ditempati prisma.
          Rumusnya sangat sederhana: luas alas dikalikan tinggi.
        </p>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
          <p className="text-cyan-300 text-xs font-semibold font-body text-center">
            🌊 Prisma diisi air — pilih jenis prisma:
          </p>
          <VolumeTabSelector />
          <p className="text-white/45 text-[10px] font-body text-center">
            Persentase menunjukkan proporsi volume terisi terhadap volume total
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
          <div className="bg-slate-900/60 rounded p-3">
            <BlockMath math="V = L_{\text{alas}} \times t" />
          </div>
          <p className="text-xs text-white/70">Untuk berbagai jenis alas:</p>
          <div className="space-y-1 text-xs text-white/70">
            <p>• Alas segitiga: <InlineMath math="V = \frac{1}{2} \times a \times t_{\triangle} \times t" /></p>
            <p>• Alas persegi panjang: <span className="text-yellow-300 font-mono">V = L□ × t</span>, dengan <InlineMath math="L_{\square} = p \times l" /> (= Volume Balok)</p>
            <p>• Alas trapesium: <InlineMath math="V = \frac{1}{2}(a+b) \times t_{\text{trap}} \times t" /></p>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 <strong className="text-white">Satuan volume:</strong></p>
          <p>• Jika dimensi dalam cm → Volume dalam <InlineMath math="\text{cm}^3" /></p>
          <p>• Jika dimensi dalam m → Volume dalam <InlineMath math="\text{m}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    title: "Kesimpulan — Rumus Lengkap Prisma",
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Besaran</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Rumus</th>
                <th className="px-3 py-2 text-cyan-300">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Jumlah sisi", "n + 2", "n = sisi alas"],
                ["Jumlah rusuk", "3n", "3 kelompok"],
                ["Titik sudut", "2n", "2 bidang alas"],
                ["Luas alas (△ sama sisi)", "L△ = ½ × a × t△", "t△ = tinggi segitiga"],
                ["Luas selimut", "K × t", "K = keliling alas"],
                ["Luas permukaan", "L = 2L△ + K × t", "total semua sisi"],
                ["Volume", "V = L△ × t", "luas alas × tinggi"],
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
          <p>🚀 <strong>Kunci prisma:</strong> Identifikasi dulu <strong className="text-yellow-300">bentuk dan luas alas</strong>, lalu kalikan dengan <strong className="text-yellow-300">tinggi prisma (t)</strong> untuk volume!</p>
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
        <p>Sebuah prisma segitiga siku-siku memiliki alas segitiga dengan sisi siku-siku <InlineMath math="6\text{ cm}" /> dan <InlineMath math="8\text{ cm}" />, serta tinggi prisma <InlineMath math="10\text{ cm}" />.</p>
        <p>Hitunglah luas permukaan prisma tersebut!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-green-400 font-semibold text-xs">Langkah 1 — Identifikasi alas segitiga:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p className="text-white/70">Sisi: a = 6, b = 8, c = √(6²+8²) = √100 = 10 cm</p>
          <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 6 \times 8 = 24\text{ cm}^2" />
          <BlockMath math="K = 6 + 8 + 10 = 24\text{ cm}" />
        </div>
        <p className="text-green-400 font-semibold text-xs">Langkah 2 — Luas permukaan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L = 2 \times 24 + 24 \times 10 = 48 + 240 = 288\text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Luas permukaan = <InlineMath math="288\text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tenda berkemah berbentuk prisma segitiga sama sisi dengan panjang sisi alas <InlineMath math="4\text{ m}" /> dan tinggi segitiga <InlineMath math="3{,}46\text{ m}" />, serta panjang tenda <InlineMath math="6\text{ m}" />.</p>
        <p>Berapa luas kain yang diperlukan untuk menutupi seluruh tenda (termasuk kedua ujungnya)?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 4 \times 3{,}46 = 6{,}92\text{ m}^2" />
          <BlockMath math="K = 3 \times 4 = 12\text{ m}" />
          <BlockMath math="L = 2 \times 6{,}92 + 12 \times 6 = 13{,}84 + 72 = 85{,}84\text{ m}^2" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">✅ Luas kain = <InlineMath math="85{,}84\text{ m}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah atap rumah berbentuk prisma segitiga dengan alas berupa segitiga sama kaki: sisi alas <InlineMath math="8\text{ m}" />, sisi miring <InlineMath math="5\text{ m}" />, tinggi prisma (panjang rumah) <InlineMath math="12\text{ m}" />.</p>
        <p>Jika 1 m² genteng seharga <InlineMath math="Rp\,180.000" />, berapa biaya genteng untuk <strong>kedua sisi miring atap saja</strong>?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold text-xs">Langkah 1 — Tinggi segitiga alas:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="t_{\triangle} = \sqrt{5^2 - 4^2} = \sqrt{25-16} = 3\text{ m}" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 2 — Luas 2 sisi miring atap:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L_{\text{miring}} = 2 \times (5 \times 12) = 2 \times 60 = 120\text{ m}^2" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 3 — Biaya genteng:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="\text{Biaya} = 120 \times 180.000 = Rp\,21.600.000" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Luas kedua sisi miring = 120 m²</p>
          <p className="text-white/80">• Biaya genteng = <strong className="text-yellow-300">Rp 21.600.000</strong></p>
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
        <p>Sebuah cokelat batang berbentuk prisma segitiga sama sisi dengan sisi alas <InlineMath math="3\text{ cm}" />, tinggi segitiga <InlineMath math="2{,}6\text{ cm}" />, dan panjang <InlineMath math="15\text{ cm}" />.</p>
        <p>Berapa volume cokelat tersebut?</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 3 \times 2{,}6 = 3{,}9\text{ cm}^2" />
          <BlockMath math="V = L_{\triangle} \times t = 3{,}9 \times 15 = 58{,}5\text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume = <InlineMath math="58{,}5\text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah saluran air berbentuk prisma dengan alas trapesium: sisi sejajar <InlineMath math="40\text{ cm}" /> dan <InlineMath math="20\text{ cm}" />, tinggi trapesium <InlineMath math="15\text{ cm}" />, panjang saluran <InlineMath math="200\text{ cm}" />.</p>
        <p>Berapa liter air yang dapat ditampung saluran tersebut jika penuh?</p>
        <p className="text-xs text-white/60">(1 liter = 1.000 cm³)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <BlockMath math="L_{\text{trap}} = \tfrac{1}{2}(40+20) \times 15 = \tfrac{1}{2} \times 60 \times 15 = 450\text{ cm}^2" />
          <BlockMath math="V = 450 \times 200 = 90.000\text{ cm}^3 = 90\text{ liter}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Volume air = 90 liter</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kolam ikan berbentuk prisma segitiga siku-siku dengan alas segitiga bersisi siku-siku <InlineMath math="1{,}5\text{ m}" /> dan <InlineMath math="2\text{ m}" />, serta panjang kolam <InlineMath math="4\text{ m}" />.</p>
        <p>Kolam diisi air hingga <InlineMath math="\frac{3}{4}" /> penuh. Jika massa jenis air <InlineMath math="1.000\text{ kg/m}^3" />, berapa ton berat air di dalam kolam?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold text-xs">Langkah 1 — Volume total:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 1{,}5 \times 2 = 1{,}5\text{ m}^2" />
          <BlockMath math="V_{\text{total}} = 1{,}5 \times 4 = 6\text{ m}^3" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 2 — Volume air (¾ penuh):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="V_{\text{air}} = \tfrac{3}{4} \times 6 = 4{,}5\text{ m}^3" />
        </div>
        <p className="text-red-400 font-semibold text-xs">Langkah 3 — Berat air:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
          <BlockMath math="m = \rho \times V = 1.000 \times 4{,}5 = 4.500\text{ kg} = 4{,}5\text{ ton}" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Volume air = 4,5 m³</p>
          <p className="text-white/80">• Berat air = <strong className="text-yellow-300">4,5 ton</strong></p>
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
    icon: "🔷",
    title: "Pengantar",
    content: (
      <div className="text-sm font-body text-white/75 leading-relaxed space-y-3">
        <ThreePrismas />
        <p>
          Dari kemasan cokelat batang hingga atap rumah berbentuk segitiga — prisma ada di mana-mana!
          Pelajari semua tentang <strong className="text-cyan-300">prisma</strong> — mulai dari unsur-unsurnya,
          jaring-jaring interaktif 3D, hingga cara menghitung{" "}
          <strong className="text-yellow-300">luas permukaan</strong> dan{" "}
          <strong className="text-green-300">volume</strong>-nya.
        </p>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/60 space-y-1">
          <p className="text-cyan-300 font-semibold mb-1">📋 Materi dalam bab ini:</p>
          <p>• Definisi &amp; sifat-sifat prisma</p>
          <p>• Unsur-unsur: rusuk, sisi, titik sudut</p>
          <p>• Jaring-jaring interaktif 3D</p>
          <p>• Luas permukaan dan volume</p>
          <p>• Contoh soal bertingkat</p>
        </div>

        {/* Contoh-contoh benda berbentuk prisma */}
        <div className="bg-slate-800/60 border border-cyan-700/40 rounded-xl p-3">
          <p className="text-cyan-300 font-semibold text-xs mb-3 text-center">
            📷 Contoh Benda Berbentuk Prisma di Sekitar Kita
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { src: "/images/image_1776843419238.png", caption: "Box Stool (Prisma Trapesium)" },
              { src: "/images/image_1776843450997.png", caption: "Tenda (Prisma Segitiga)" },
              { src: "/images/image_1776843468055.png", caption: "Lemari (Prisma Segiempat)" },
              { src: "/images/image_1776843489367.png", caption: "Kotak Tisu (Prisma Segiempat)" },
              { src: "/images/image_1776843581521.png", caption: "Toblerone (Prisma Segitiga)" },
              { src: "/images/image_1776843677763.png", caption: "Hello Panda (Prisma Segienam)" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-2 flex flex-col items-center">
                <div className="w-full h-24 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-700 text-center mt-1 font-semibold leading-tight">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "🔷",
    title: "Definisi Prisma",
    content: sections[0].content,
  },
  {
    icon: "⬛",
    title: "Unsur — Rusuk Prisma",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body">
        {/* 3-prism interactive animation */}
        <div className="bg-slate-800/60 border border-cyan-700/40 rounded-xl p-4">
          <p className="text-cyan-300 font-semibold mb-1">🎬 Perbandingan Rusuk — 3 Jenis Prisma Berdiri</p>
          <p className="text-xs text-white/55 mb-3 font-body">
            Perhatikan: ketiga prisma <strong className="text-yellow-300">berdiri tegak</strong> — alas di bawah, tutup di atas.
            Alas dan tutup <em>selalu berbentuk sama</em>. Tekan tombol untuk melihat kelompok rusuknya!
          </p>
          <RusukTigaPrismaAnimation />
        </div>

      </div>
    ),
  },
  {
    icon: "⬜",
    title: "Unsur — Sisi Prisma",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-green-700/40 rounded-xl p-4">
          <p className="text-green-300 font-semibold mb-1">🎬 Perbandingan Sisi — 3 Jenis Prisma Berdiri</p>
          <p className="text-xs text-white/55 mb-3 font-body">
            Perhatikan kelompok sisi pada tiap prisma.
            Tekan tombol untuk melihat <strong className="text-red-300">Sisi Alas &amp; Tutup</strong> atau <strong className="text-blue-300">Sisi Tegak</strong>!
          </p>
          <SisiTigaPrismaAnimation />
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-xs text-white/70 space-y-1">
          <p>• <strong className="text-red-300">2 sisi Alas &amp; Tutup</strong>: berbentuk segitiga (sama persis)</p>
          <p>• <strong className="text-blue-300">3 sisi Tegak</strong>: berbentuk persegi panjang (a × t)</p>
          <div className="bg-slate-700/60 rounded p-2 mt-2">
            <BlockMath math="\text{Jumlah sisi} = n + 2 = 3 + 2 = 5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "●",
    title: "Unsur — Titik Sudut & Tabel",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-yellow-700/40 rounded-xl p-4">
          <p className="text-yellow-300 font-semibold mb-1">🎬 Perbandingan Titik Sudut — 3 Jenis Prisma Berdiri</p>
          <p className="text-xs text-white/55 mb-3 font-body">
            Perhatikan titik sudut pada tiap prisma.
            Tekan tombol untuk melihat <strong className="text-cyan-300">Titik Sudut Alas</strong> atau <strong className="text-yellow-300">Titik Sudut Atas</strong>!
          </p>
          <TitikSudutTigaPrismaAnimation />
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
          <p>• <strong className="text-cyan-300">n titik sudut alas</strong> di bawah</p>
          <p>• <strong className="text-yellow-300">n titik sudut atas</strong> di atas — sama banyak</p>
          <div className="bg-slate-700/60 rounded p-2 mt-2">
            <BlockMath math="\text{Titik sudut} = 2n = 2 \times 3 = 6" />
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p className="text-cyan-300 font-semibold">📋 Tabel Unsur Prisma Segi-n:</p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs text-center">
              <thead><tr className="border-b border-cyan-800">
                <th className="px-2 py-1 text-left">Jenis</th>
                <th className="px-2 py-1">Sisi</th>
                <th className="px-2 py-1">Rusuk</th>
                <th className="px-2 py-1">T. Sudut</th>
              </tr></thead>
              <tbody>
                {[["Segitiga (n=3)", 5, 9, 6], ["Segiempat (n=4)", 6, 12, 8],
                  ["Segilima (n=5)", 7, 15, 10], ["Segienam (n=6)", 8, 18, 12]].map(([n, s, r, ts], i) => (
                  <tr key={i} className={`border-t border-cyan-900 ${i%2===0?"bg-cyan-950/30":""}`}>
                    <td className="px-2 py-1 text-left">{n}</td>
                    <td className="px-2 py-1 text-yellow-300">{s}</td>
                    <td className="px-2 py-1 text-yellow-300">{r}</td>
                    <td className="px-2 py-1 text-yellow-300">{ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "🔲",
    title: "Jaring-jaring Prisma 3D",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body">
        <div className="bg-slate-800/60 border border-violet-700/40 rounded-xl p-4">
          <p className="text-violet-300 font-semibold mb-1">🎬 Jaring-jaring Interaktif — 3 Jenis Prisma</p>
          <p className="text-xs text-white/55 mb-3 font-body">
            <strong className="text-orange-300">Drag</strong> untuk memutar prisma 3D.
            Tekan <strong className="text-orange-300">Bongkar</strong> untuk membuka jaring-jaring,
            lalu <strong className="text-cyan-300">Satukan</strong> untuk merakitnya kembali!
          </p>
          <JaringPrismaInteraktif />
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
          <p>• Jaring-jaring adalah <strong className="text-white">bangun datar</strong> yang jika dilipat membentuk prisma</p>
          <p>• Setiap prisma segi-n memiliki <strong className="text-violet-300">n sisi tegak</strong> (persegi panjang) + <strong className="text-yellow-300">2 sisi alas/tutup</strong> (segi-n)</p>
          <p>• Total bidang = n + 2</p>
        </div>
      </div>
    ),
  },
  {
    icon: "🎨",
    title: "Luas Permukaan Prisma",
    content: sections[3].content,
  },
  {
    icon: "📐",
    title: "Volume Prisma",
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
const PrismaPage = () => {
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
        <Triangle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          PRISMA
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

export default PrismaPage;
