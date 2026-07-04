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
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   FACE LABEL HELPERS
───────────────────────────────────────────────────────────── */
const getFaceLabels = (lang: string) => {
  if (lang === "en") return ["BASE", "TOP", "FACE 1", "FACE 2", "FACE 3"];
  if (lang === "ja") return ["底面", "上面", "側面1", "側面2", "側面3"];
  return ["ALAS", "TUTUP", "SISI 1", "SISI 2", "SISI 3"];
};

const getDirectionLabels = (lang: string) => {
  if (lang === "en") return { left: "LEFT", front: "FRONT", right: "RIGHT", back: "BACK", base: "BASE", top: "TOP" };
  if (lang === "ja") return { left: "左", front: "前", right: "右", back: "後", base: "底面", top: "上面" };
  return { left: "KIRI", front: "DEPAN", right: "KANAN", back: "BELAKANG", base: "ALAS", top: "TUTUP" };
};

const getEdgeLabels = (lang: string) => {
  if (lang === "en") return { baseEdge: "3 base edges", topEdge: "3 top edges", vertEdge: "3 vert. edges", total: "= 9 edges", formula: "(3n, n=3)" };
  if (lang === "ja") return { baseEdge: "底辺×3", topEdge: "上辺×3", vertEdge: "側辺×3", total: "= 9辺", formula: "(3n, n=3)" };
  return { baseEdge: "3 rusuk alas", topEdge: "3 rusuk atas", vertEdge: "3 rusuk tegak", total: "= 9 rusuk", formula: "(3n, n=3)" };
};

const getPrismaTypeLabels = (lang: string) => {
  if (lang === "en") return ["Triangular", "Rectangular", "Pentagonal"];
  if (lang === "ja") return ["三角柱", "四角柱", "五角柱"];
  return ["Segitiga", "Segiempat", "Segilima"];
};

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

const InteractivePrisma3D = ({ lang }: { lang: string }) => {
  const [rotX, setRotX] = useState(-28);
  const [rotY, setRotY] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [showNet, setShowNet] = useState(false);
  const dragRef = useRef({ sx: 0, sy: 0, bx: -28, by: 30 });

  const fl = getFaceLabels(lang);

  const caption = showNet
    ? (lang === "en" ? "Triangular prism net — 2 triangular bases + 3 rectangular faces"
      : lang === "ja" ? "三角柱の展開図 — 三角形×2 + 長方形×3"
      : "Jaring-jaring prisma segitiga — 2 segitiga alas + 3 sisi persegi panjang")
    : (lang === "en" ? "Drag to rotate · Click button below to view net"
      : lang === "ja" ? "ドラッグで回転 · ボタンで展開図を表示"
      : "Drag untuk memutar · Klik tombol di bawah untuk melihat jaring-jaring");

  const a = 90, hp = 85;
  const rc = a / Math.sqrt(3);
  const ri = a / (2 * Math.sqrt(3));

  const rawVerts: V3[] = [
    [0, hp / 2, -rc],
    [-a / 2, hp / 2, ri],
    [a / 2, hp / 2, ri],
    [0, -hp / 2, -rc],
    [-a / 2, -hp / 2, ri],
    [a / 2, -hp / 2, ri],
  ];

  const faceDefs = [
    { idx: [0, 2, 1],       color: FACE_COLORS[0], label: fl[0] },
    { idx: [3, 4, 5],       color: FACE_COLORS[1], label: fl[1] },
    { idx: [0, 1, 4, 3],   color: FACE_COLORS[2], label: fl[2] },
    { idx: [1, 2, 5, 4],   color: FACE_COLORS[3], label: fl[3] },
    { idx: [2, 0, 3, 5],   color: FACE_COLORS[4], label: fl[4] },
  ];

  const rx = (rotX * Math.PI) / 180;
  const ry = (rotY * Math.PI) / 180;

  const tfVerts = rawVerts.map(v => rotXv(rotYv(v, ry), rx));
  const pverts: V2[] = tfVerts.map(v => project(v));

  const facesWithDepth = faceDefs.map(f => {
    const avgZ = f.idx.reduce((s, i) => s + tfVerts[i][2], 0) / f.idx.length;
    const pts2d = f.idx.map(i => pverts[i]);
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

  const btnNet = lang === "en" ? "⊞ View Net" : lang === "ja" ? "⊞ 展開図" : "⊞ Lihat Jaring-jaring";
  const btn3D  = lang === "en" ? "◆ View 3D"  : lang === "ja" ? "◆ 3D表示" : "◆ Lihat 3D";
  const btnRst = lang === "en" ? "↺ Reset View" : lang === "ja" ? "↺ リセット" : "↺ Reset Tampilan";

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">{caption}</p>

      <div className="relative mx-auto select-none overflow-visible"
        style={{ width: "100%", height: 300, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={!showNet ? onMouseDown : undefined}
        onTouchStart={!showNet ? onTouchStart : undefined}
      >
        {!showNet ? (
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
          <svg viewBox="0 0 300 260" className="w-full h-full">
            <JaringPrismaSVGInner cx={150} cy={130} animated={false} lang={lang} />
          </svg>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={() => { playPopSound(); setShowNet(v => !v); setRotX(-28); setRotY(30); }}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          {showNet ? btn3D : btnNet}
        </button>
        {!showNet && (
          <button onClick={() => { setRotX(-28); setRotY(30); }}
            className="px-3 py-1.5 text-xs font-bold bg-slate-700/60 border border-slate-500 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer font-body">
            {btnRst}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {FACE_COLORS.map((c, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: c }} />
            <span className="text-white/50 text-[10px] font-body">{fl[i]}</span>
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
const makePrismaFaces = (n: number, faceLabel: string) => {
  const palette = ["#ef4444","#eab308","#3b82f6","#22c55e","#f97316","#ec4899","#06b6d4","#a78bfa"];
  const faces: { idx: number[]; color: string; label: string }[] = [];
  faces.push({ idx: Array.from({length:n},(_,i)=>i), color:palette[0], label: faceLabel });
  faces.push({ idx: Array.from({length:n},(_,i)=>n+(n-1-i)), color:palette[1], label:"▲" });
  for (let i = 0; i < n; i++) {
    const j = (i+1)%n;
    faces.push({ idx:[i,j,n+j,n+i], color:palette[(i+2)%palette.length], label:`S${i+1}` });
  }
  return faces;
};

const RotatingPrisma3D = ({ n, label, r = 38, h = 60, faceLabel = "▲" }: { n: number; label: string; r?: number; h?: number; faceLabel?: string }) => {
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
  const faceDefs = makePrismaFaces(n, faceLabel);
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

const ThreePrismas = ({ lang }: { lang: string }) => {
  const types = getPrismaTypeLabels(lang);
  const fl = getFaceLabels(lang);
  const hint = lang === "en" ? "Auto-rotating · Drag to rotate manually"
    : lang === "ja" ? "自動回転中 · ドラッグで手動回転"
    : "Berputar otomatis · Drag untuk memutar sendiri";
  const legend = [
    ["#ef4444", fl[0]],
    ["#eab308", fl[1]],
    ["#3b82f6", lang === "en" ? "FACE" : lang === "ja" ? "側面" : "SISI"],
  ];
  return (
    <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 space-y-2">
      <p className="text-center text-white/40 font-body" style={{ fontSize:9 }}>{hint}</p>
      <div className="flex gap-2">
        <RotatingPrisma3D n={3} label={`Prisma ${types[0]}`} r={38} h={60} faceLabel={fl[0]}/>
        <RotatingPrisma3D n={4} label={`Prisma ${types[1]}`} r={34} h={58} faceLabel={fl[0]}/>
        <RotatingPrisma3D n={5} label={`Prisma ${types[2]}`} r={34} h={56} faceLabel={fl[0]}/>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
        {legend.map(([c,l])=>(
          <div key={l} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c as string }}/>
            <span className="text-white/45 font-body" style={{ fontSize:9 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   JARING-JARING PRISMA SVG
───────────────────────────────────────────────────────────── */
const JaringPrismaSVGInner = ({
  cx, cy, animated, lang = "id",
}: { cx: number; cy: number; animated: boolean; lang?: string }) => {
  const sp = 70, hp = 50, th = 35;
  const ox = cx - (3 * sp) / 2;
  const oy = cy - (th + hp + th) / 2;

  const fl = getDirectionLabels(lang);
  const faceLabel = lang === "en" ? "FACE" : lang === "ja" ? "側面" : "SISI";

  const r1 = { x: ox,        y: oy + th, w: sp, h: hp, fill: "#3b82f6", label: `${faceLabel} 1\na×t` };
  const r2 = { x: ox + sp,   y: oy + th, w: sp, h: hp, fill: "#8b5cf6", label: `${faceLabel} 2\na×t` };
  const r3 = { x: ox + 2*sp, y: oy + th, w: sp, h: hp, fill: "#22c55e", label: `${faceLabel} 3\na×t` };
  const alasPts = `${ox+sp},${oy+th+hp} ${ox+2*sp},${oy+th+hp} ${ox+1.5*sp},${oy+th+hp+th}`;
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
      {[r1, r2, r3].map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h}
            fill={r.fill} fillOpacity={0.88} rx={3}
            stroke="var(--icon-stroke)" strokeWidth={1.5}
            className={animA} />
          {r.label.split("\n").map((line, li) => (
            <text key={li} x={r.x + r.w / 2} y={r.y + r.h / 2 + (li - 0.4) * 10}
              fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold"
              textAnchor="middle" dominantBaseline="middle">{line}</text>
          ))}
        </g>
      ))}
      <polygon points={alasPts} fill="#ef4444" fillOpacity={0.88}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className={animB} />
      <text x={ox + 1.5*sp} y={oy + th + hp + th*0.55}
        fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle">{fl.base}</text>
      <text x={ox + 1.5*sp} y={oy + th + hp + th*0.55 + 10}
        fill="var(--icon-color)" fontSize={7} fontFamily="monospace"
        textAnchor="middle">½×a×t△</text>
      <polygon points={tutupPts} fill="#eab308" fillOpacity={0.88}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className={animC} />
      <text x={ox + 1.5*sp} y={oy + th*0.45}
        fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle">{fl.top}</text>
      <text x={ox + 1.5*sp} y={oy + th*0.45 + 10}
        fill="var(--icon-color)" fontSize={7} fontFamily="monospace"
        textAnchor="middle">½×a×t△</text>
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
const RusukPrismaSVG = ({ lang }: { lang: string }) => {
  const el = getEdgeLabels(lang);
  return (
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
      <polygon points="60,170 180,170 120,110" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.2"/>
      <polygon points="90,130 210,130 150,70" fill="rgba(30,41,59,0.5)" stroke="#334155" strokeWidth="1.2"/>
      <line x1="60" y1="170" x2="90" y2="130" stroke="#334155" strokeWidth="1.2"/>
      <line x1="180" y1="170" x2="210" y2="130" stroke="#334155" strokeWidth="1.2"/>
      <line x1="120" y1="110" x2="150" y2="70" stroke="#334155" strokeWidth="1.2"/>
      <line x1="60" y1="170" x2="180" y2="170" strokeWidth="3.5" className="rp1"/>
      <line x1="180" y1="170" x2="120" y2="110" strokeWidth="3.5" className="rp1"/>
      <line x1="120" y1="110" x2="60" y2="170" strokeWidth="3.5" className="rp1"/>
      <line x1="90" y1="130" x2="210" y2="130" strokeWidth="3.5" className="rp2"/>
      <line x1="210" y1="130" x2="150" y2="70" strokeWidth="3.5" className="rp2"/>
      <line x1="150" y1="70" x2="90" y2="130" strokeWidth="3.5" className="rp2"/>
      <line x1="60" y1="170" x2="90" y2="130" strokeWidth="3.5" className="rp3"/>
      <line x1="180" y1="170" x2="210" y2="130" strokeWidth="3.5" className="rp3"/>
      <line x1="120" y1="110" x2="150" y2="70" strokeWidth="3.5" className="rp3"/>
      <rect x="218" y="125" width="8" height="4" fill="#22d3ee"/>
      <text x="230" y="130" fill="#22d3ee" fontSize="8" fontFamily="monospace">{el.baseEdge}</text>
      <rect x="218" y="137" width="8" height="4" fill="#facc15"/>
      <text x="230" y="142" fill="#facc15" fontSize="8" fontFamily="monospace">{el.topEdge}</text>
      <rect x="218" y="149" width="8" height="4" fill="#f97316"/>
      <text x="230" y="154" fill="#f97316" fontSize="8" fontFamily="monospace">{el.vertEdge}</text>
      <text x="218" y="170" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">{el.total}</text>
      <text x="218" y="180" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">{el.formula}</text>
    </svg>
  );
};

const SisiPrismaSVG = ({ lang }: { lang: string }) => {
  const faceCount = lang === "en" ? "5 faces" : lang === "ja" ? "5面" : "5 sisi";
  const formula = "n+2=5";
  const detail = lang === "en" ? "(2 △ + 3 □)" : lang === "ja" ? "(2△ + 3□)" : "(2 △ + 3 □)";
  return (
    <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2">
      <defs>
        <style>{`
          @keyframes sisiP{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.1;}}
          .sp-a{animation:sisiP 2s ease-in-out infinite;}
          .sp-b{animation:sisiP 2s ease-in-out infinite 0.5s;}
          .sp-c{animation:sisiP 2s ease-in-out infinite 1s;}
        `}</style>
      </defs>
      <polygon points="60,170 180,170 210,130 90,130" fill="#3b82f6" className="sp-a"/>
      <polygon points="60,170 90,130 150,70 120,110" fill="#22c55e" className="sp-b"/>
      <polygon points="90,130 210,130 150,70" fill="#eab308" className="sp-c"/>
      <polygon points="60,170 180,170 120,110" fill="#ef4444" className="sp-a" fillOpacity="0.6"/>
      <polygon points="180,170 210,130 150,70 120,110" fill="#f97316" className="sp-b" fillOpacity="0.6"/>
      <polygon points="60,170 180,170 120,110" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
      <polygon points="90,130 210,130 150,70" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
      <line x1="60" y1="170" x2="90" y2="130" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
      <line x1="180" y1="170" x2="210" y2="130" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
      <line x1="120" y1="110" x2="150" y2="70" stroke="var(--icon-stroke)" strokeWidth="1.2"/>
      <text x="220" y="170" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">{faceCount}</text>
      <text x="220" y="181" fill="#facc15" fontSize="8" fontFamily="monospace">{formula}</text>
      <text x="220" y="192" fill="var(--icon-color)" fontSize="7" fontFamily="monospace">{detail}</text>
    </svg>
  );
};

const TitikSudutPrismaSVG = ({ lang }: { lang: string }) => {
  const label1 = lang === "en" ? "6 vertices" : lang === "ja" ? "6頂点" : "6 titik";
  const label2 = lang === "en" ? "" : lang === "ja" ? "" : "sudut";
  const label3 = "(2n = 6)";
  return (
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
      {[
        [60,170],[180,170],[120,110],
        [90,130],[210,130],[150,70]
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={6} fill="#facc15" className="dp-a"
          style={{ animationDelay: `${i*0.2}s` }}/>
      ))}
      <text x="220" y="170" fill="#facc15" fontSize="9" fontFamily="monospace">{label1}</text>
      {label2 && <text x="220" y="182" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">{label2}</text>}
      <text x="220" y="194" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">{label3}</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   LUAS PERMUKAAN — animated jaring-jaring net
───────────────────────────────────────────────────────────── */
const LuasPrismaSVG = ({ lang }: { lang: string }) => {
  const ariaLabel = lang === "en" ? "Triangular prism net — surface area"
    : lang === "ja" ? "三角柱の展開図 — 表面積"
    : "Jaring-jaring prisma — luas permukaan";
  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-sm mx-auto my-2"
      aria-label={ariaLabel}>
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
      <JaringPrismaSVGInner cx={150} cy={105} animated lang={lang} />
      <text x="150" y="205" fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#lpBloom)">L = 2×L△ + (a+b+c)×t</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   JARING-JARING PRISMA SEGIEMPAT (persegi panjang)
───────────────────────────────────────────────────────────── */
const JaringSegiempatSVG = ({ lang }: { lang: string }) => {
  const dl = getDirectionLabels(lang);
  const ariaLabel = lang === "en" ? "Rectangular prism net — surface area"
    : lang === "ja" ? "四角柱の展開図 — 表面積"
    : "Jaring-jaring prisma segiempat — luas permukaan";
  return (
    <svg viewBox="0 0 340 240" className="w-full max-w-sm mx-auto my-2"
      aria-label={ariaLabel}>
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
      <rect x={50} y={95} width={45} height={50} fill="#3b82f6" fillOpacity={0.88} rx={3}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
      <text x={72.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.left}</text>
      <text x={72.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">l×t</text>
      <rect x={95} y={95} width={65} height={50} fill="#8b5cf6" fillOpacity={0.88} rx={3}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
      <text x={127.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.front}</text>
      <text x={127.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×t</text>
      <rect x={160} y={95} width={45} height={50} fill="#22c55e" fillOpacity={0.88} rx={3}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
      <text x={182.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.right}</text>
      <text x={182.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">l×t</text>
      <rect x={205} y={95} width={65} height={50} fill="#f97316" fillOpacity={0.88} rx={3}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-a"/>
      <text x={237.5} y={117} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.back}</text>
      <text x={237.5} y={127} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×t</text>
      <rect x={95} y={145} width={65} height={45} fill="#ef4444" fillOpacity={0.88} rx={3}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-b"/>
      <text x={127.5} y={164} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.base}</text>
      <text x={127.5} y={174} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×l</text>
      <rect x={95} y={50} width={65} height={45} fill="#eab308" fillOpacity={0.88} rx={3}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsq-c"/>
      <text x={127.5} y={69} fill="var(--icon-color)" fontSize={7} fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.top}</text>
      <text x={127.5} y={79} fill="var(--icon-color)" fontSize={6.5} fontFamily="monospace" textAnchor="middle">p×l</text>
      <text x={127.5} y={87} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">p</text>
      <text x={43} y={121} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">t</text>
      <text x="170" y="218" fill="#e0e7ff" fontSize={11} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#jsqBloom)">L = 2(pl) + 2(p+l)×t</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   JARING-JARING PRISMA SEGILIMA (pentagon)
───────────────────────────────────────────────────────────── */
const JaringSegilimaSVG = ({ lang }: { lang: string }) => {
  const penta = (cx: number, cy: number, r: number, startDeg: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const angle = ((startDeg + i * 72) * Math.PI) / 180;
      return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
    }).join(" ");

  const sw = 50, rh = 50;
  const startX = 55;
  const oy = 100;
  const rectBottomY = oy + rh;
  const pr = 26;
  const sin54 = 0.8090;

  const faceLabel = lang === "en" ? "FACE" : lang === "ja" ? "側面" : "SISI";
  const dl = getDirectionLabels(lang);

  const rects = [
    { x: startX,           fill: "#3b82f6", label: `${faceLabel} 1` },
    { x: startX + sw,      fill: "#8b5cf6", label: `${faceLabel} 2` },
    { x: startX + 2 * sw,  fill: "#22c55e", label: `${faceLabel} 3` },
    { x: startX + 3 * sw,  fill: "#f97316", label: `${faceLabel} 4` },
    { x: startX + 4 * sw,  fill: "#ec4899", label: `${faceLabel} 5` },
  ];

  const midX = startX + 2 * sw + sw / 2;
  const alasCY = rectBottomY + pr * sin54;
  const alasStart = -54;
  const tutupCY = oy - pr * sin54;
  const tutupStart = -90;
  const ariaLabel = lang === "en" ? "Pentagonal prism net — surface area"
    : lang === "ja" ? "五角柱の展開図 — 表面積"
    : "Jaring-jaring prisma segilima — luas permukaan";

  return (
    <svg viewBox="0 0 370 255" className="w-full max-w-sm mx-auto my-2"
      aria-label={ariaLabel}>
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
      <polygon points={penta(midX, alasCY, pr, alasStart)} fill="#ef4444" fillOpacity={0.88}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsg-b"/>
      <text x={midX} y={alasCY + 6} fill="var(--icon-color)" fontSize={7}
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.base}</text>
      <polygon points={penta(midX, tutupCY, pr, tutupStart)} fill="#eab308" fillOpacity={0.88}
        stroke="var(--icon-stroke)" strokeWidth={1.5} className="jsg-c"/>
      <text x={midX} y={tutupCY + 4} fill="var(--icon-color)" fontSize={7}
        fontFamily="monospace" fontWeight="bold" textAnchor="middle">{dl.top}</text>
      <text x={startX + sw / 2} y={oy - 5} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">a</text>
      <text x={startX - 10} y={oy + rh / 2 + 4} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle">t</text>
      <text x="185" y="243" fill="#e0e7ff" fontSize={10} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#jsgBloom)">L = 2×L△₅ + 5a×t</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   LUAS PERMUKAAN — tab selector (3 jenis prisma)
───────────────────────────────────────────────────────────── */
const JaringTabSelector = ({ lang }: { lang: string }) => {
  const [tab, setTab] = useState<"segitiga" | "segiempat" | "segilima">("segitiga");
  const types = getPrismaTypeLabels(lang);
  const tabs = [
    { id: "segitiga"  as const, label: types[0] },
    { id: "segiempat" as const, label: types[1] },
    { id: "segilima"  as const, label: types[2] },
  ];
  const genTitle = lang === "en" ? "General Formula — Prism Surface Area"
    : lang === "ja" ? "角柱の表面積の一般公式"
    : "Rumus Umum Luas Permukaan Prisma";
  const genSubA = lang === "en" ? "Alas = Base area · Keliling = Base perimeter · t = prism height"
    : lang === "ja" ? "底面積 · 周囲長 · t = 高さ"
    : "L_a = Luas alas · K_a = Keliling alas · t = tinggi prisma";
  const keyTitle = lang === "en" ? "📐 Formula —" : lang === "ja" ? "📐 公式 —" : "📐 Rumus —";

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
          <LuasPrismaSVG lang={lang} />
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/40 rounded-lg p-3 my-2 text-center">
            <p className="text-[11px] text-cyan-300 font-semibold mb-1">{genTitle}</p>
            <p className="font-mono text-sm md:text-base font-bold text-yellow-200">
              {lang === "en" ? "SA = 2·A_base + P_base × h"
               : lang === "ja" ? "表面積 = 2·底面積 + 底面周 × h"
               : "L permukaan = 2·L_a + K_a × t"}
            </p>
            <p className="text-[10px] text-white/60 mt-1 italic">{genSubA}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">
              {keyTitle} {lang === "en" ? "Triangular Prism:" : lang === "ja" ? "三角柱:" : "Prisma Segitiga:"}
            </p>
            <p>• {lang === "en" ? "Base/top area:" : lang === "ja" ? "底面積:" : "Luas alas/tutup:"} <span className="text-yellow-300">L△ = ½ × a × t△</span></p>
            <p>• {lang === "en" ? "Base perimeter:" : lang === "ja" ? "底面周:" : "Keliling alas:"} <span className="text-yellow-300">K = a + b + c</span></p>
            <p className="text-white/90 font-semibold font-mono">L = 2×L△ + (a+b+c)×t</p>
          </div>
        </div>
      )}
      {tab === "segiempat" && (
        <div>
          <JaringSegiempatSVG lang={lang} />
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/40 rounded-lg p-3 my-2 text-center">
            <p className="text-[11px] text-cyan-300 font-semibold mb-1">{genTitle}</p>
            <p className="font-mono text-sm md:text-base font-bold text-yellow-200">
              {lang === "en" ? "SA = 2·A_base + P_base × h"
               : lang === "ja" ? "表面積 = 2·底面積 + 底面周 × h"
               : "L permukaan = 2·L_a + K_a × t"}
            </p>
            <p className="text-[10px] text-white/60 mt-1 italic">{genSubA}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">
              {keyTitle} {lang === "en" ? "Rectangular Prism:" : lang === "ja" ? "四角柱:" : "Prisma Segiempat (Balok):"}
            </p>
            <p>• {lang === "en" ? "Base area:" : lang === "ja" ? "底面積:" : "Luas alas/tutup:"} <span className="text-yellow-300">L□ = p × l</span></p>
            <p>• {lang === "en" ? "Base perimeter:" : lang === "ja" ? "底面周:" : "Keliling alas:"} <span className="text-yellow-300">K = 2(p + l)</span></p>
            <p className="text-white/90 font-semibold font-mono">L = 2(pl) + 2(p+l)×t</p>
          </div>
        </div>
      )}
      {tab === "segilima" && (
        <div>
          <JaringSegilimaSVG lang={lang} />
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/40 rounded-lg p-3 my-2 text-center">
            <p className="text-[11px] text-cyan-300 font-semibold mb-1">{genTitle}</p>
            <p className="font-mono text-sm md:text-base font-bold text-yellow-200">
              {lang === "en" ? "SA = 2·A_base + P_base × h"
               : lang === "ja" ? "表面積 = 2·底面積 + 底面周 × h"
               : "L permukaan = 2·L_a + K_a × t"}
            </p>
            <p className="text-[10px] text-white/60 mt-1 italic">{genSubA}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">
              {keyTitle} {lang === "en" ? "Pentagonal Prism (side a):" : lang === "ja" ? "五角柱(一辺a):" : "Prisma Segilima (alas sama sisi a):"}
            </p>
            <p>• {lang === "en" ? "Pentagon area:" : lang === "ja" ? "五角形面積:" : "Luas segi-5:"} <span className="text-yellow-300">L△₅ = ½ × {lang === "en" ? "perimeter" : lang === "ja" ? "周" : "keliling"} × apotema</span></p>
            <p>• {lang === "en" ? "Base perimeter:" : lang === "ja" ? "底面周:" : "Keliling alas:"} <span className="text-yellow-300">K = 5 × a</span></p>
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
const WaterPrismaAnimation = ({ lang }: { lang: string }) => {
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

  const dl = getDirectionLabels(lang);
  const BL: V2 = [68,  182];
  const BR: V2 = [178, 182];
  const BB: V2 = [123, 152];
  const H = 108;
  const TL: V2 = [BL[0], BL[1] - H];
  const TR: V2 = [BR[0], BR[1] - H];
  const TB: V2 = [BB[0], BB[1] - H];

  const lerp = (a: V2, b: V2, t: number): V2 => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
  const p  = (v: V2) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pp = (...vs: V2[]) => vs.map(p).join(" ");

  const WL = lerp(BL, TL, fill);
  const WR = lerp(BR, TR, fill);
  const WB = lerp(BB, TB, fill);

  const pct     = Math.round(fill * 100);
  const isEmpty = fill < 0.005;
  const isFull  = fill > 0.995;

  const barX = 194, barY = TL[1], barW = 13, barH = H;
  const filledH = barH * fill;

  const statusFull  = lang === "en" ? "🌊 Full!"    : lang === "ja" ? "🌊 満水!"  : "🌊 Penuh!";
  const statusEmpty = lang === "en" ? "⬛ Empty"    : lang === "ja" ? "⬛ 空"     : "⬛ Kosong";
  const statusFill  = lang === "en" ? `🔵 Filling... ${pct}%` : lang === "ja" ? `🔵 注水中... ${pct}%` : `🔵 Mengisi... ${pct}%`;
  const ariaLabel = lang === "en" ? "Triangular prism water-fill animation"
    : lang === "ja" ? "三角柱の注水アニメーション"
    : "Animasi prisma segitiga berdiri diisi air";

  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto my-2" aria-label={ariaLabel}>
      <defs>
        <filter id="wBloom">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <line x1={BB[0]} y1={BB[1]} x2={TB[0]} y2={TB[1]}
        stroke="#334155" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={BL[0]} y1={BL[1]} x2={BB[0]} y2={BB[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={BR[0]} y1={BR[1]} x2={BB[0]} y2={BB[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <polygon points={pp(BR, BB, TB, TR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      <polygon points={pp(BL, BR, TR, TL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>
      {!isEmpty && (
        <>
          <polygon points={pp(BL, BR, BB)} fill="#1e3a8a" fillOpacity={0.90}/>
          <polygon points={pp(BR, BB, WB, WR)} fill="#1d4ed8" fillOpacity={0.80}/>
          <polygon points={pp(BL, BR, WR, WL)} fill="#2563eb" fillOpacity={0.90}/>
          {!isFull && (
            <polygon points={pp(WL, WR, WB)}
              fill="#7dd3fc" fillOpacity={0.50}
              style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}/>
          )}
          {!isFull && (
            <line x1={WL[0]} y1={WL[1]} x2={WR[0]} y2={WR[1]}
              stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
          )}
        </>
      )}
      <polygon points={pp(BL, BR, TR, TL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(BR, BB, TB, TR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      <polygon points={pp(TL, TR, TB)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      <line x1={TL[0]} y1={TL[1]} x2={TB[0]} y2={TB[1]} stroke="#c4b5fd" strokeWidth="1.8"/>
      <line x1={TR[0]} y1={TR[1]} x2={TB[0]} y2={TB[1]} stroke="#c4b5fd" strokeWidth="1.8"/>
      <text x={(BL[0]+BR[0])/2} y={BL[1]+13}
        fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {dl.base} (L△)
      </text>
      <text x={(TL[0]+TR[0])/2} y={TL[1]-7}
        fill="#c4b5fd" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {dl.top}
      </text>
      <text x={BL[0]-14} y={(BL[1]+TL[1])/2+4}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
      <line x1={BL[0]-8} y1={BL[1]} x2={BL[0]-8} y2={TL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>
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
      <text x="122" y="203"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloom)">
        {isFull ? statusFull : isEmpty ? statusEmpty : statusFill}
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
const WaterSegiempatAnimation = ({ lang }: { lang: string }) => {
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

  const dl = getDirectionLabels(lang);
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

  const statusFull  = lang === "en" ? "🌊 Full!"    : lang === "ja" ? "🌊 満水!"  : "🌊 Penuh!";
  const statusEmpty = lang === "en" ? "⬛ Empty"    : lang === "ja" ? "⬛ 空"     : "⬛ Kosong";
  const statusFill  = lang === "en" ? `🔵 Filling... ${pct}%` : lang === "ja" ? `🔵 注水中... ${pct}%` : `🔵 Mengisi... ${pct}%`;
  const ariaLabel = lang === "en" ? "Rectangular prism water-fill animation"
    : lang === "ja" ? "四角柱の注水アニメーション"
    : "Animasi prisma segiempat berdiri diisi air";

  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto my-2" aria-label={ariaLabel}>
      <defs>
        <filter id="wBloom2">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <line x1={BkL[0]} y1={BkL[1]} x2={BkTL[0]} y2={BkTL[1]}
        stroke="#334155" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={FL[0]} y1={FL[1]} x2={BkL[0]} y2={BkL[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={FTL[0]} y1={FTL[1]} x2={BkTL[0]} y2={BkTL[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>
      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>
      {!isEmpty && (
        <>
          <polygon points={pp(FL, FR, BkR, BkL)} fill="#1e3a8a" fillOpacity={0.90}/>
          <polygon points={pp(FR, BkR, WBkR, WFR)} fill="#1d4ed8" fillOpacity={0.80}/>
          <polygon points={pp(FL, FR, WFR, WFL)} fill="#2563eb" fillOpacity={0.90}/>
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
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      <polygon points={pp(FTL, FTR, BkTR, BkTL)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      <text x={(FL[0] + FR[0]) / 2} y={FL[1] + 13}
        fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {dl.base} (p×l)
      </text>
      <text x={(FTL[0] + FTR[0]) / 2} y={FTL[1] - 7}
        fill="#c4b5fd" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {dl.top}
      </text>
      <text x={FL[0] - 14} y={(FL[1] + FTL[1]) / 2 + 4}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
      <line x1={FL[0] - 8} y1={FL[1]} x2={FL[0] - 8} y2={FTL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>
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
      <text x="125" y="203"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloom2)">
        {isFull ? statusFull : isEmpty ? statusEmpty : statusFill}
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
const WaterSegilimAnimation = ({ lang }: { lang: string }) => {
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

  const dl = getDirectionLabels(lang);
  const BL:  V2 = [58,  180];
  const BR:  V2 = [155, 180];
  const RB:  V2 = [182, 157];
  const BC:  V2 = [107, 138];
  const LB:  V2 = [31,  157];
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

  const statusFull  = lang === "en" ? "🌊 Full!"    : lang === "ja" ? "🌊 満水!"  : "🌊 Penuh!";
  const statusEmpty = lang === "en" ? "⬛ Empty"    : lang === "ja" ? "⬛ 空"     : "⬛ Kosong";
  const statusFill  = lang === "en" ? `🔵 Filling... ${pct}%` : lang === "ja" ? `🔵 注水中... ${pct}%` : `🔵 Mengisi... ${pct}%`;
  const ariaLabel = lang === "en" ? "Pentagonal prism water-fill animation"
    : lang === "ja" ? "五角柱の注水アニメーション"
    : "Animasi prisma segilima berdiri diisi air";

  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-sm mx-auto my-2" aria-label={ariaLabel}>
      <defs>
        <filter id="wBloom3">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
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
      <polygon points={pp(BR, RB, TR2, TR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      <polygon points={pp(BL, BR, TR, TL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>
      {!isEmpty && (
        <>
          <polygon points={pp(BL, BR, RB, BC, LB)} fill="#1e3a8a" fillOpacity={0.90}/>
          <polygon points={pp(BR, RB, WRB, WBR)} fill="#1d4ed8" fillOpacity={0.80}/>
          <polygon points={pp(BL, BR, WBR, WBL)} fill="#2563eb" fillOpacity={0.90}/>
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
      <polygon points={pp(BL, BR, TR, TL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(BR, RB, TR2, TR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      <polygon points={pp(TL, TR, TR2, TC, TL2)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      <line x1={TR[0]} y1={TR[1]} x2={TR2[0]} y2={TR2[1]} stroke="#c4b5fd" strokeWidth="1.8"/>
      <line x1={TR2[0]} y1={TR2[1]} x2={TC[0]} y2={TC[1]} stroke="#c4b5fd" strokeWidth="1.8"/>
      <text x={(BL[0] + BR[0]) / 2} y={BL[1] + 13}
        fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {dl.base} (L△₅)
      </text>
      <text x={(TL[0] + TR[0]) / 2} y={TL[1] - 7}
        fill="#c4b5fd" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {dl.top}
      </text>
      <text x={BL[0] - 14} y={(BL[1] + TL[1]) / 2 + 4}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">t</text>
      <line x1={BL[0] - 8} y1={BL[1]} x2={BL[0] - 8} y2={TL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>
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
      <text x="113" y="203"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloom3)">
        {isFull ? statusFull : isEmpty ? statusEmpty : statusFill}
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
const VolumeTabSelector = ({ lang }: { lang: string }) => {
  const [tab, setTab] = useState<"segitiga" | "segiempat" | "segilima">("segitiga");
  const types = getPrismaTypeLabels(lang);
  const tabs = [
    { id: "segitiga"  as const, label: types[0] },
    { id: "segiempat" as const, label: types[1] },
    { id: "segilima"  as const, label: types[2] },
  ];
  const formulaKey = lang === "en" ? "📐 Formula —" : lang === "ja" ? "📐 公式 —" : "📐 Rumus —";
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
          <WaterPrismaAnimation lang={lang} />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-1 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">
              {formulaKey} {lang === "en" ? "Triangular Prism:" : lang === "ja" ? "三角柱:" : "Prisma Segitiga:"}
            </p>
            <p>• {lang === "en" ? "Base area:" : lang === "ja" ? "底面積:" : "Luas alas:"} <span className="text-yellow-300">L△ = ½ × a × t△</span></p>
            <p className="text-white/90 font-semibold font-mono">V = L△ × t</p>
          </div>
        </div>
      )}
      {tab === "segiempat" && (
        <div>
          <WaterSegiempatAnimation lang={lang} />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-1 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">
              {formulaKey} {lang === "en" ? "Rectangular Prism:" : lang === "ja" ? "四角柱:" : "Prisma Segiempat (Balok):"}
            </p>
            <p>• {lang === "en" ? "Base area:" : lang === "ja" ? "底面積:" : "Luas alas:"} <span className="text-yellow-300">L□ = p × l</span></p>
            <p className="text-white/90 font-semibold font-mono">V = L□ × t</p>
          </div>
        </div>
      )}
      {tab === "segilima" && (
        <div>
          <WaterSegilimAnimation lang={lang} />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-1 text-xs text-white/70">
            <p className="text-cyan-300 font-semibold">
              {formulaKey} {lang === "en" ? "Pentagonal Prism:" : lang === "ja" ? "五角柱:" : "Prisma Segilima:"}
            </p>
            <p>• {lang === "en" ? "Pentagon area:" : lang === "ja" ? "五角形面積:" : "Luas alas segi-5:"} <span className="text-yellow-300">L⬟ = ½ × {lang === "en" ? "perimeter" : lang === "ja" ? "周" : "keliling"} × apotema</span></p>
            <p className="text-white/90 font-semibold font-mono">V = L⬟ × t</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const ExampleCard = ({ ex, idx, prefix, lang }: { ex: Ex; idx: number; prefix: string; lang: string }) => {
  const [show, setShow] = useState(false);
  const showLabel = lang === "en" ? "View Solution" : lang === "ja" ? "解答を見る" : "Lihat Pembahasan";
  const hideLabel = lang === "en" ? "Hide" : lang === "ja" ? "隠す" : "Sembunyikan";
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
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? hideLabel : showLabel}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const PrismaPage = () => {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ── Translations ── */
  const translations = {
    id: {
      subtitle: "Kelas 8 · Bangun Ruang Sisi Datar",
      slideLabel: "Slide",
      prev: "← Sebelumnya",
      next: "Selanjutnya →",
      back: "← Kembali ke Bangun Ruang Sisi Datar",
      easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
      prefixLP: "Soal LP", prefixVol: "Soal Vol",
      /* Section titles */
      def: "Definisi Prisma",
      elem: "Unsur-unsur Prisma Segitiga (Interaktif)",
      net3d: "Jaring-jaring Prisma Segitiga Interaktif 3D",
      luas: "Luas Permukaan Prisma",
      vol: "Volume Prisma",
      sum: "Kesimpulan — Rumus Lengkap Prisma",
      /* Slide titles */
      intro: "Pengantar",
      slideRusuk: "Unsur — Rusuk Prisma",
      slideSisi: "Unsur — Sisi Prisma",
      slideTitik: "Unsur — Titik Sudut & Tabel",
      slideNet: "Jaring-jaring Prisma 3D",
      slideLuas: "Luas Permukaan Prisma",
      slideVol: "Volume Prisma",
      slideSumTitle: "Kesimpulan — Rumus Lengkap",
      slideEx1: "Contoh Soal — Luas Permukaan",
      slideEx2: "Contoh Soal — Volume",
      /* Misc */
      waterFill: "🌊 Prisma diisi air — pilih jenis prisma:",
      waterPct: "Persentase menunjukkan proporsi volume terisi terhadap volume total",
      choosePrisma: "Pilih jenis prisma untuk melihat jaring-jaringnya:",
      keyHint: "🚀 Kunci:",
    },
    en: {
      subtitle: "Grade 8 · Solid Geometry",
      slideLabel: "Slide",
      prev: "← Previous",
      next: "Next →",
      back: "← Back to Solid Geometry",
      easy: "EASY", medium: "MEDIUM", hard: "HARD",
      prefixLP: "SA Q", prefixVol: "Vol Q",
      def: "Definition of a Prism",
      elem: "Elements of a Triangular Prism (Interactive)",
      net3d: "Interactive 3D Triangular Prism Net",
      luas: "Surface Area of a Prism",
      vol: "Volume of a Prism",
      sum: "Summary — Complete Prism Formulas",
      intro: "Introduction",
      slideRusuk: "Elements — Edges",
      slideSisi: "Elements — Faces",
      slideTitik: "Elements — Vertices & Table",
      slideNet: "3D Prism Net",
      slideLuas: "Surface Area",
      slideVol: "Volume",
      slideSumTitle: "Summary — Formulas",
      slideEx1: "Practice — Surface Area",
      slideEx2: "Practice — Volume",
      waterFill: "🌊 Prism filling with water — choose type:",
      waterPct: "Percentage shows the proportion of filled volume to total volume",
      choosePrisma: "Choose prism type to see its net:",
      keyHint: "🚀 Key:",
    },
    ja: {
      subtitle: "中2 · 空間図形",
      slideLabel: "スライド",
      prev: "← 前へ",
      next: "次へ →",
      back: "← 空間図形に戻る",
      easy: "基本", medium: "標準", hard: "発展",
      prefixLP: "表面積 Q", prefixVol: "体積 Q",
      def: "角柱の定義",
      elem: "三角柱の要素（インタラクティブ）",
      net3d: "インタラクティブ3D展開図",
      luas: "角柱の表面積",
      vol: "角柱の体積",
      sum: "まとめ — 角柱の公式",
      intro: "イントロダクション",
      slideRusuk: "要素 — 辺",
      slideSisi: "要素 — 面",
      slideTitik: "要素 — 頂点・表",
      slideNet: "3D展開図",
      slideLuas: "表面積",
      slideVol: "体積",
      slideSumTitle: "まとめ",
      slideEx1: "練習 — 表面積",
      slideEx2: "練習 — 体積",
      waterFill: "🌊 角柱に水を注入中 — 種類を選択:",
      waterPct: "パーセントは総体積に対する充填割合",
      choosePrisma: "展開図を見るには角柱の種類を選んでください:",
      keyHint: "🚀 ポイント:",
    },
  } as const;

  const t = translations[lang as keyof typeof translations] ?? translations.id;

  /* ── Table data ── */
  const tableTypes = lang === "en"
    ? [["Triangle (n=3)", 5, 9, 6], ["Rectangle (n=4)", 6, 12, 8], ["Pentagon (n=5)", 7, 15, 10], ["Hexagon (n=6)", 8, 18, 12]]
    : lang === "ja"
    ? [["三角柱 (n=3)", 5, 9, 6], ["四角柱 (n=4)", 6, 12, 8], ["五角柱 (n=5)", 7, 15, 10], ["六角柱 (n=6)", 8, 18, 12]]
    : [["Segitiga (n=3)", 5, 9, 6], ["Segiempat (n=4)", 6, 12, 8], ["Segilima (n=5)", 7, 15, 10], ["Segienam (n=6)", 8, 18, 12]];

  const tableHead = lang === "en" ? ["Type", "Faces", "Edges", "Vertices"]
    : lang === "ja" ? ["種類", "面", "辺", "頂点"]
    : ["Jenis", "Sisi", "Rusuk", "T. Sudut"];

  const elLabels = lang === "en"
    ? { rusukAlas: "3 base edges:", rusukAtas: "3 top edges:", rusukTegak: "3 vertical edges:", sisiAlasTutup: "2 Base & Top faces", sisiTegak: "3 Vertical faces", nTitikAlas: "n base vertices", nTitikAtas: "n top vertices" }
    : lang === "ja"
    ? { rusukAlas: "底辺×3:", rusukAtas: "上辺×3:", rusukTegak: "側辺×3:", sisiAlasTutup: "2 底面・上面", sisiTegak: "3 側面", nTitikAlas: "底面の頂点 n 個", nTitikAtas: "上面の頂点 n 個" }
    : { rusukAlas: "3 rusuk alas:", rusukAtas: "3 rusuk atas:", rusukTegak: "3 rusuk tegak:", sisiAlasTutup: "2 sisi Alas & Tutup", sisiTegak: "3 sisi Tegak", nTitikAlas: "n titik sudut alas", nTitikAtas: "n titik sudut atas" };

  /* ── Currency helper ── */
  const cur = (rp: string, en: string, ja: string) =>
    lang === "en" ? en : lang === "ja" ? ja : rp;

  /* ── Sections ── */
  const sections = [
    {
      title: t.def,
      icon: "🔷",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {lang === "en"
              ? (<>A prism is a <strong className="text-cyan-300">polyhedron</strong> with two congruent parallel polygonal bases connected by <strong className="text-yellow-300">rectangular lateral faces</strong>.</>)
              : lang === "ja"
              ? (<>角柱は <strong className="text-cyan-300">多面体</strong> であり、合同で平行な多角形の底面2枚と<strong className="text-yellow-300">長方形の側面</strong>で構成されます。</>)
              : (<>Prisma adalah <strong className="text-cyan-300">bangun ruang sisi datar</strong> yang memiliki dua alas berbentuk segi-<InlineMath math="n" /> yang kongruen dan sejajar, dihubungkan oleh <strong className="text-yellow-300"> sisi tegak berbentuk persegi panjang</strong>.</>)
            }
          </p>
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "📌 Properties of a Prism:" : lang === "ja" ? "📌 角柱の性質:" : "📌 Sifat-sifat Prisma:"}
            </p>
            <ul className="space-y-1 text-xs text-white/75">
              <li>• {lang === "en" ? (<>Two <strong className="text-yellow-300">congruent and parallel</strong> n-gon bases</>)
                    : lang === "ja" ? (<>合同で平行な<strong className="text-yellow-300">n角形</strong>の底面2枚</>)
                    : (<>Dua alas berbentuk segi-<InlineMath math="n" /> yang <strong className="text-yellow-300">kongruen dan sejajar</strong></>)}</li>
              <li>• {lang === "en" ? (<>Lateral faces are <strong className="text-yellow-300">rectangles</strong></>)
                    : lang === "ja" ? (<>側面は<strong className="text-yellow-300">長方形</strong></>)
                    : (<>Sisi tegak berbentuk <strong className="text-yellow-300">persegi panjang</strong></>)}</li>
              <li>• {lang === "en" ? "Height (h) = distance between the two bases"
                    : lang === "ja" ? "高さ (h) = 2底面間の距離"
                    : "Tinggi (t) = jarak antara dua bidang alas"}</li>
              <li>• {lang === "en" ? (<>Prism name is determined by the <strong className="text-yellow-300">shape of its base</strong></>)
                    : lang === "ja" ? (<>角柱の名前は<strong className="text-yellow-300">底面の形</strong>で決まる</>)
                    : (<>Nama prisma ditentukan oleh <strong className="text-yellow-300">bentuk alasnya</strong></>)}</li>
            </ul>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
            <p className="text-cyan-300 font-semibold mb-1">
              {lang === "en" ? "Types of Prisms:" : lang === "ja" ? "角柱の種類:" : "Jenis-jenis Prisma:"}
            </p>
            {(lang === "en"
              ? [["Triangular Prism","triangular base","5 faces, 9 edges, 6 vertices"],
                 ["Rectangular Prism","rectangular base (= cuboid)","6 faces, 12 edges, 8 vertices"],
                 ["Pentagonal Prism","pentagonal base","7 faces, 15 edges, 10 vertices"],
                 ["Hexagonal Prism","hexagonal base","8 faces, 18 edges, 12 vertices"]]
              : lang === "ja"
              ? [["三角柱","三角形の底面","5面・9辺・6頂点"],
                 ["四角柱","四角形の底面(直方体)","6面・12辺・8頂点"],
                 ["五角柱","五角形の底面","7面・15辺・10頂点"],
                 ["六角柱","六角形の底面","8面・18辺・12頂点"]]
              : [["Prisma Segitiga","alas segitiga","5 sisi, 9 rusuk, 6 titik sudut"],
                 ["Prisma Segiempat","alas segiempat (= balok)","6 sisi, 12 rusuk, 8 titik sudut"],
                 ["Prisma Segilima","alas segilima","7 sisi, 15 rusuk, 10 titik sudut"],
                 ["Prisma Segienam","alas segienam","8 sisi, 18 rusuk, 12 titik sudut"]]
            ).map(([nama, alas, detail], i) => (
              <p key={i}>• <strong className="text-white">{nama}</strong> ({alas}): {detail}</p>
            ))}
          </div>
          <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
            💡 <strong>
              {lang === "en" ? "General pattern:" : lang === "ja" ? "一般パターン:" : "Pola umum:"}
            </strong>{" "}
            {lang === "en" ? "For an n-gon prism: faces = n+2, edges = 3n, vertices = 2n"
              : lang === "ja" ? "n角柱: 面=n+2, 辺=3n, 頂点=2n"
              : "Untuk prisma segi-n: sisi = n+2, rusuk = 3n, titik sudut = 2n"}
          </blockquote>
        </div>
      ),
    },
    {
      title: t.elem,
      icon: "🔍",
      content: (
        <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
          <p className="text-xs text-white/60">
            {lang === "en" ? "Example: triangular prism (n = 3)"
              : lang === "ja" ? "例: 三角柱 (n = 3)"
              : "Contoh: prisma segitiga (n = 3)"}
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <p className="text-cyan-300 font-semibold mb-2">
              {lang === "en" ? "⬛ Edges of a Triangular Prism (9 edges)"
                : lang === "ja" ? "⬛ 三角柱の辺（9辺）"
                : "⬛ Rusuk Prisma Segitiga (9 rusuk)"}
            </p>
            <RusukPrismaSVG lang={lang} />
            <div className="text-xs text-white/70 space-y-1 mt-2">
              <p>• <strong className="text-cyan-300">{elLabels.rusukAlas}</strong>{" "}
                {lang === "en" ? "forming the bottom triangle"
                  : lang === "ja" ? "下の三角形を形成"
                  : "membentuk segitiga alas bawah"}</p>
              <p>• <strong className="text-yellow-300">{elLabels.rusukAtas}</strong>{" "}
                {lang === "en" ? "forming the top triangle"
                  : lang === "ja" ? "上の三角形を形成"
                  : "membentuk segitiga alas atas"}</p>
              <p>• <strong className="text-orange-300">{elLabels.rusukTegak}</strong>{" "}
                {lang === "en" ? "connecting top and bottom bases"
                  : lang === "ja" ? "上下の底面を繋ぐ"
                  : "menghubungkan alas atas dan bawah"}</p>
              <div className="bg-slate-700/60 rounded p-2 mt-2">
                <BlockMath math="\text{n edges} = 3n = 3 \times 3 = 9" />
              </div>
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <p className="text-green-300 font-semibold mb-2">
              {lang === "en" ? "⬜ Faces of a Triangular Prism (5 faces)"
                : lang === "ja" ? "⬜ 三角柱の面（5面）"
                : "⬜ Sisi Prisma Segitiga (5 sisi)"}
            </p>
            <SisiPrismaSVG lang={lang} />
            <div className="text-xs text-white/70 space-y-1 mt-2">
              <p>• 2 <strong className="text-yellow-300">{elLabels.sisiAlasTutup}</strong>:{" "}
                {lang === "en" ? "triangular" : lang === "ja" ? "三角形" : "berbentuk segitiga"}</p>
              <p>• {elLabels.sisiTegak} <strong className="text-blue-300">
                {lang === "en" ? "LATERAL" : lang === "ja" ? "側面" : "TEGAK"}
              </strong>:{" "}
                {lang === "en" ? "rectangular (a × h)" : lang === "ja" ? "長方形 (a × h)" : "berbentuk persegi panjang (a × t)"}</p>
              <div className="bg-slate-700/60 rounded p-2 mt-2">
                <BlockMath math="\text{n faces} = n + 2 = 3 + 2 = 5" />
              </div>
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <p className="text-yellow-300 font-semibold mb-2">
              {lang === "en" ? "● Vertices (6 vertices)"
                : lang === "ja" ? "● 頂点（6頂点）"
                : "● Titik Sudut (6 titik)"}
            </p>
            <TitikSudutPrismaSVG lang={lang} />
            <div className="bg-slate-700/60 rounded p-2 mt-2 text-xs text-white/70">
              <BlockMath math="\text{vertices} = 2n = 2 \times 3 = 6" />
            </div>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "📋 Prism Elements Table (n-gon):"
                : lang === "ja" ? "📋 n角柱の要素表:"
                : "📋 Tabel Unsur Prisma Segi-n:"}
            </p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-center">
                <thead><tr className="border-b border-cyan-800">
                  {tableHead.map((h, i) => <th key={i} className={`px-2 py-1 ${i===0?"text-left":""}`}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {tableTypes.map(([n, s, r, ts], i) => (
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
      title: t.net3d,
      icon: "🔲",
      content: (
        <div className="space-y-5 text-sm text-white/85 font-body">
          <p>
            {lang === "en"
              ? (<>The net of a triangular prism is a <strong className="text-cyan-300">2D shape that folds into the prism</strong>. It consists of <strong className="text-yellow-300">2 triangles</strong> (base and top) and <strong className="text-blue-300">3 rectangles</strong> (lateral faces).</>)
              : lang === "ja"
              ? (<>三角柱の展開図は<strong className="text-cyan-300">折り畳むと三角柱になる2D図形</strong>です。<strong className="text-yellow-300">三角形×2</strong>（底面・上面）と<strong className="text-blue-300">長方形×3</strong>（側面）で構成されます。</>)
              : (<>Jaring-jaring prisma segitiga adalah <strong className="text-cyan-300">bentuk 2D yang jika dilipat akan membentuk prisma</strong>. Terdiri dari <strong className="text-yellow-300">2 segitiga</strong> (alas dan tutup) serta <strong className="text-blue-300"> 3 persegi panjang</strong> (sisi tegak).</>)
            }
          </p>
          <InteractivePrisma3D lang={lang} />
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
            <p className="text-cyan-300 font-semibold mb-2">
              {lang === "en" ? "📐 Triangular Prism Net Layout:"
                : lang === "ja" ? "📐 三角柱の展開図の構成:"
                : "📐 Susunan Jaring-jaring Prisma Segitiga:"}
            </p>
            <p>• {lang === "en" ? "3 rectangles side by side (lateral faces, each = a × h)"
                  : lang === "ja" ? "長方形3枚が並ぶ（側面, 各 = a × h）"
                  : "3 persegi panjang berjajar (sisi tegak, masing-masing = a × t)"}</p>
            <p>• {lang === "en" ? "2 triangles (base and top) attached to lateral faces"
                  : lang === "ja" ? "三角形2枚が側面に付く（底面・上面）"
                  : "2 segitiga (alas dan tutup) menempel pada sisi tegak"}</p>
            <p>• {lang === "en" ? "There are 3 common net patterns"
                  : lang === "ja" ? "一般的な展開図のパターンは3種類"
                  : "Ada 3 pola jaring-jaring yang umum digunakan"}</p>
          </div>
        </div>
      ),
    },
    {
      title: t.luas,
      icon: "🎨",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <p>
            {lang === "en"
              ? (<><strong className="text-blue-300">Surface area of a prism</strong> is the total area of all faces enclosing the prism — two base/top faces plus all lateral faces (lateral surface).</>)
              : lang === "ja"
              ? (<><strong className="text-blue-300">角柱の表面積</strong>は、角柱を包む全面の面積の合計です — 底面2枚と側面（側面積）の合計。</>)
              : (<><strong className="text-blue-300">Luas permukaan prisma</strong> adalah jumlah luas seluruh sisi yang membungkus prisma — dua sisi alas/tutup ditambah seluruh sisi tegak (selimut).</>)
            }
          </p>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
            <div className="bg-slate-900/60 rounded p-3 space-y-2">
              <BlockMath math={lang === "en" ? "SA = 2 \\times A_{\\text{base}} + A_{\\text{lateral}}" : lang === "ja" ? "表面積 = 2 \\times S_{\\text{底面}} + S_{\\text{側面}}" : "L = 2 \\times L_{\\text{alas}} + L_{\\text{selimut}}"} />
              <BlockMath math={lang === "en" ? "A_{\\text{lateral}} = \\text{Base perimeter} \\times h" : lang === "ja" ? "S_{\\text{側面}} = \\text{底面周} \\times h" : "L_{\\text{selimut}} = \\text{Keliling alas} \\times t"} />
            </div>
          </div>
          <p className="text-xs text-white/60 text-center">{t.choosePrisma}</p>
          <JaringTabSelector lang={lang} />
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p>{t.keyHint} {lang === "en" ? "Lateral area = Base perimeter × prism height (h)"
              : lang === "ja" ? "側面積 = 底面周 × 高さ (h)"
              : "Luas selimut = Keliling alas × tinggi prisma (t)"}</p>
            <p>• {lang === "en" ? "Triangular:" : lang === "ja" ? "三角柱:" : "Prisma segitiga:"} <span className="text-yellow-300">L = 2×L△ + (a+b+c)×t</span></p>
            <p>• {lang === "en" ? "Rectangular:" : lang === "ja" ? "四角柱:" : "Prisma segiempat:"} <span className="text-yellow-300">L = 2(pl) + 2(p+l)×t</span></p>
            <p>• {lang === "en" ? "Pentagonal:" : lang === "ja" ? "五角柱:" : "Prisma segilima:"} <span className="text-yellow-300">L = 2×L△₅ + 5a×t</span></p>
          </div>
        </div>
      ),
    },
    {
      title: t.vol,
      icon: "📐",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <p>
            {lang === "en"
              ? (<><strong className="text-green-300">Volume of a prism</strong> represents how much space the prism occupies. The formula is simple: base area multiplied by height.</>)
              : lang === "ja"
              ? (<><strong className="text-green-300">角柱の体積</strong>は角柱が占める空間の大きさです。公式はシンプル: 底面積 × 高さ。</>)
              : (<><strong className="text-green-300">Volume prisma</strong> menyatakan seberapa besar "isi" ruang yang ditempati prisma. Rumusnya sangat sederhana: luas alas dikalikan tinggi.</>)
            }
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
            <p className="text-cyan-300 text-xs font-semibold font-body text-center">{t.waterFill}</p>
            <VolumeTabSelector lang={lang} />
            <p className="text-white/45 text-[10px] font-body text-center">{t.waterPct}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
            <div className="bg-slate-900/60 rounded p-3">
              <BlockMath math={lang === "en" ? "V = A_{\\text{base}} \\times h" : lang === "ja" ? "V = S_{\\text{底面}} \\times h" : "V = L_{\\text{alas}} \\times t"} />
            </div>
            <p className="text-xs text-white/70">
              {lang === "en" ? "For various base shapes:" : lang === "ja" ? "様々な底面の形:" : "Untuk berbagai jenis alas:"}
            </p>
            <div className="space-y-1 text-xs text-white/70">
              <p>• {lang === "en" ? "Triangle base:" : lang === "ja" ? "三角形の底面:" : "Alas segitiga:"} <InlineMath math="V = \frac{1}{2} \times a \times t_{\triangle} \times t" /></p>
              <p>• {lang === "en" ? "Rectangle base:" : lang === "ja" ? "長方形の底面:" : "Alas persegi panjang:"} <span className="text-yellow-300 font-mono">V = L□ × t</span>, {lang === "en" ? "where" : lang === "ja" ? "ただし" : "dengan"} <InlineMath math="L_{\square} = p \times l" /></p>
              <p>• {lang === "en" ? "Trapezoid base:" : lang === "ja" ? "台形の底面:" : "Alas trapesium:"} <InlineMath math="V = \frac{1}{2}(a+b) \times t_{\text{trap}} \times t" /></p>
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p>🎯 <strong className="text-white">{lang === "en" ? "Volume units:" : lang === "ja" ? "体積の単位:" : "Satuan volume:"}</strong></p>
            <p>• {lang === "en" ? "If dimensions in cm → Volume in" : lang === "ja" ? "寸法がcm → 体積は" : "Jika dimensi dalam cm → Volume dalam"} <InlineMath math="\text{cm}^3" /></p>
            <p>• {lang === "en" ? "If dimensions in m → Volume in" : lang === "ja" ? "寸法がm → 体積は" : "Jika dimensi dalam m → Volume dalam"} <InlineMath math="\text{m}^3" /></p>
          </div>
        </div>
      ),
    },
    {
      title: t.sum,
      icon: "📊",
      content: (
        <div className="space-y-3 font-body">
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="bg-slate-800">
                  {(lang === "en" ? ["Quantity", "Formula", "Notes"]
                    : lang === "ja" ? ["量", "公式", "備考"]
                    : ["Besaran", "Rumus", "Keterangan"]
                  ).map((h, i) => (
                    <th key={i} className={`px-3 py-2 text-cyan-300 ${i<2?"border-r border-slate-700":""} ${i===0?"text-left":""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(lang === "en"
                  ? [["Face count","n + 2","n = base sides"],["Edge count","3n","3 groups"],["Vertices","2n","2 bases"],
                     ["Base area (equil. △)","L△ = ½ × a × h△","h△ = triangle height"],["Lateral area","P × h","P = base perimeter"],
                     ["Surface area","L = 2L△ + P × h","total all faces"],["Volume","V = L△ × h","base area × height"]]
                  : lang === "ja"
                  ? [["面の数","n + 2","n = 底面の辺数"],["辺の数","3n","3グループ"],["頂点数","2n","2底面"],
                     ["底面積(正三角)","L△ = ½ × a × h△","h△ = 三角高さ"],["側面積","P × h","P = 底面周"],
                     ["表面積","L = 2L△ + P × h","全面合計"],["体積","V = L△ × h","底面積 × 高さ"]]
                  : [["Jumlah sisi","n + 2","n = sisi alas"],["Jumlah rusuk","3n","3 kelompok"],["Titik sudut","2n","2 bidang alas"],
                     ["Luas alas (△ sama sisi)","L△ = ½ × a × t△","t△ = tinggi segitiga"],["Luas selimut","K × t","K = keliling alas"],
                     ["Luas permukaan","L = 2L△ + K × t","total semua sisi"],["Volume","V = L△ × t","luas alas × tinggi"]]
                ).map(([b, r, c], i) => (
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
            <p>{t.keyHint}{" "}
              {lang === "en"
                ? (<>First identify the <strong className="text-yellow-300">base shape and area</strong>, then multiply by <strong className="text-yellow-300">prism height (h)</strong> for volume!</>)
                : lang === "ja"
                ? (<>まず<strong className="text-yellow-300">底面の形と面積</strong>を確認し、<strong className="text-yellow-300">高さ (h)</strong>を掛けて体積を求めよう！</>)
                : (<>Identifikasi dulu <strong className="text-yellow-300">bentuk dan luas alas</strong>, lalu kalikan dengan <strong className="text-yellow-300">tinggi prisma (t)</strong> untuk volume!</>)
              }
            </p>
          </div>
        </div>
      ),
    },
  ];

  /* ── Example problems ── */
  const luasExamples: Ex[] = [
    {
      level: t.easy, color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          {lang === "en" ? (
            <><p>A right triangular prism has legs of <InlineMath math="6\text{ cm}" /> and <InlineMath math="8\text{ cm}" />, and prism height <InlineMath math="10\text{ cm}" />.</p><p>Find the surface area!</p></>
          ) : lang === "ja" ? (
            <><p>直角三角柱で直角辺が <InlineMath math="6\text{ cm}" /> と <InlineMath math="8\text{ cm}" />、高さが <InlineMath math="10\text{ cm}" />。</p><p>表面積を求めよ。</p></>
          ) : (
            <><p>Sebuah prisma segitiga siku-siku memiliki alas segitiga dengan sisi siku-siku <InlineMath math="6\text{ cm}" /> dan <InlineMath math="8\text{ cm}" />, serta tinggi prisma <InlineMath math="10\text{ cm}" />.</p><p>Hitunglah luas permukaan prisma tersebut!</p></>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-green-400 font-semibold text-xs">
            {lang === "en" ? "Step 1 — Identify the base triangle:" : lang === "ja" ? "ステップ1 — 底面の三角形:" : "Langkah 1 — Identifikasi alas segitiga:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
            <p className="text-white/70">{lang === "en" ? "Sides: a=6, b=8, c=√(36+64)=10 cm" : lang === "ja" ? "辺: a=6, b=8, c=√(36+64)=10 cm" : "Sisi: a = 6, b = 8, c = √(6²+8²) = √100 = 10 cm"}</p>
            <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 6 \times 8 = 24\text{ cm}^2" />
            <BlockMath math="K = 6 + 8 + 10 = 24\text{ cm}" />
          </div>
          <p className="text-green-400 font-semibold text-xs">
            {lang === "en" ? "Step 2 — Surface area:" : lang === "ja" ? "ステップ2 — 表面積:" : "Langkah 2 — Luas permukaan:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math="L = 2 \times 24 + 24 \times 10 = 48 + 240 = 288\text{ cm}^2" />
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
            <p className="text-green-300 font-semibold">✅ {lang === "en" ? "Surface area" : lang === "ja" ? "表面積" : "Luas permukaan"} = <InlineMath math="288\text{ cm}^2" /></p>
          </div>
        </div>
      ),
    },
    {
      level: t.medium, color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          {lang === "en" ? (
            <><p>A camping tent is a triangular prism with equilateral triangular base of side <InlineMath math="4\text{ m}" />, triangle height <InlineMath math="3.46\text{ m}" />, and tent length <InlineMath math="6\text{ m}" />.</p><p>How much fabric is needed to cover the entire tent (including both ends)?</p></>
          ) : lang === "ja" ? (
            <><p>キャンプ用テントが三角柱で、正三角形の底面の辺の長さ <InlineMath math="4\text{ m}" />、三角形の高さ <InlineMath math="3.46\text{ m}" />、テントの長さ <InlineMath math="6\text{ m}" />。</p><p>全体を覆う布の面積は？</p></>
          ) : (
            <><p>Sebuah tenda berkemah berbentuk prisma segitiga sama sisi dengan panjang sisi alas <InlineMath math="4\text{ m}" /> dan tinggi segitiga <InlineMath math="3{,}46\text{ m}" />, serta panjang tenda <InlineMath math="6\text{ m}" />.</p><p>Berapa luas kain yang diperlukan untuk menutupi seluruh tenda (termasuk kedua ujungnya)?</p></>
          )}
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
            <p className="text-yellow-300 font-semibold">✅ {lang === "en" ? "Fabric area" : lang === "ja" ? "布の面積" : "Luas kain"} = <InlineMath math="85{,}84\text{ m}^2" /></p>
          </div>
        </div>
      ),
    },
    {
      level: t.hard, color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          {lang === "en" ? (
            <><p>A house roof is a triangular prism with an isosceles triangular cross-section: base <InlineMath math="8\text{ m}" />, slant side <InlineMath math="5\text{ m}" />, prism length <InlineMath math="12\text{ m}" />.</p><p>If 1 m² of tile costs <InlineMath math="\$20" />, find the cost for <strong>both sloped sides only</strong>.</p></>
          ) : lang === "ja" ? (
            <><p>屋根が三角柱で、二等辺三角形の底辺 <InlineMath math="8\text{ m}" />、斜辺 <InlineMath math="5\text{ m}" />、奥行き <InlineMath math="12\text{ m}" />。</p><p>1 m² あたり <InlineMath math="¥2{,}500" /> の瓦で<strong>斜面2面のみ</strong>の費用は？</p></>
          ) : (
            <><p>Sebuah atap rumah berbentuk prisma segitiga dengan alas berupa segitiga sama kaki: sisi alas <InlineMath math="8\text{ m}" />, sisi miring <InlineMath math="5\text{ m}" />, tinggi prisma (panjang rumah) <InlineMath math="12\text{ m}" />.</p><p>Jika 1 m² genteng seharga <InlineMath math="Rp\,180.000" />, berapa biaya genteng untuk <strong>kedua sisi miring atap saja</strong>?</p></>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 1 — Triangle height:" : lang === "ja" ? "ステップ1 — 三角形の高さ:" : "Langkah 1 — Tinggi segitiga alas:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math="t_{\triangle} = \sqrt{5^2 - 4^2} = \sqrt{25-16} = 3\text{ m}" />
          </div>
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 2 — Area of 2 sloped faces:" : lang === "ja" ? "ステップ2 — 斜面2面の面積:" : "Langkah 2 — Luas 2 sisi miring atap:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math="L_{\text{miring}} = 2 \times (5 \times 12) = 2 \times 60 = 120\text{ m}^2" />
          </div>
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 3 — Tile cost:" : lang === "ja" ? "ステップ3 — 費用:" : "Langkah 3 — Biaya genteng:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math={
              lang === "en" ? "\\text{Cost} = 120 \\times 20 = \\$2{,}400"
              : lang === "ja" ? "\\text{費用} = 120 \\times 2{,}500 = ¥300{,}000"
              : "\\text{Biaya} = 120 \\times 180.000 = Rp\\,21.600.000"
            } />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
            <p className="text-red-300 font-semibold">✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え:" : "Jawaban:"}</p>
            <p className="text-white/80">• {lang === "en" ? "Sloped area" : lang === "ja" ? "斜面積" : "Luas kedua sisi miring"} = 120 m²</p>
            <p className="text-white/80">• {lang === "en" ? "Tile cost" : lang === "ja" ? "瓦費用" : "Biaya genteng"} = <strong className="text-yellow-300">
              {cur("Rp 21.600.000", "$2,400", "¥300,000")}
            </strong></p>
          </div>
        </div>
      ),
    },
  ];

  const volExamples: Ex[] = [
    {
      level: t.easy, color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          {lang === "en" ? (
            <><p>A chocolate bar is a triangular prism with equilateral triangle base: side <InlineMath math="3\text{ cm}" />, triangle height <InlineMath math="2.6\text{ cm}" />, length <InlineMath math="15\text{ cm}" />.</p><p>Find the volume of the chocolate!</p></>
          ) : lang === "ja" ? (
            <><p>チョコレートが三角柱で、正三角形の辺 <InlineMath math="3\text{ cm}" />、三角形の高さ <InlineMath math="2.6\text{ cm}" />、長さ <InlineMath math="15\text{ cm}" />。</p><p>体積を求めよ。</p></>
          ) : (
            <><p>Sebuah cokelat batang berbentuk prisma segitiga sama sisi dengan sisi alas <InlineMath math="3\text{ cm}" />, tinggi segitiga <InlineMath math="2{,}6\text{ cm}" />, dan panjang <InlineMath math="15\text{ cm}" />.</p><p>Berapa volume cokelat tersebut?</p></>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
            <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 3 \times 2{,}6 = 3{,}9\text{ cm}^2" />
            <BlockMath math="V = L_{\triangle} \times t = 3{,}9 \times 15 = 58{,}5\text{ cm}^3" />
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
            <p className="text-green-300 font-semibold text-xs">✅ {lang === "en" ? "Volume" : lang === "ja" ? "体積" : "Volume"} = <InlineMath math="58{,}5\text{ cm}^3" /></p>
          </div>
        </div>
      ),
    },
    {
      level: t.medium, color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          {lang === "en" ? (
            <><p>A water channel is a prism with a trapezoidal base: parallel sides <InlineMath math="40\text{ cm}" /> and <InlineMath math="20\text{ cm}" />, trap height <InlineMath math="15\text{ cm}" />, channel length <InlineMath math="200\text{ cm}" />.</p><p>How many liters can it hold when full? (1 L = 1,000 cm³)</p></>
          ) : lang === "ja" ? (
            <><p>水路が台形柱で、平行辺 <InlineMath math="40\text{ cm}" /> と <InlineMath math="20\text{ cm}" />、台形高さ <InlineMath math="15\text{ cm}" />、長さ <InlineMath math="200\text{ cm}" />。</p><p>満杯で何リットル? (1 L = 1,000 cm³)</p></>
          ) : (
            <><p>Sebuah saluran air berbentuk prisma dengan alas trapesium: sisi sejajar <InlineMath math="40\text{ cm}" /> dan <InlineMath math="20\text{ cm}" />, tinggi trapesium <InlineMath math="15\text{ cm}" />, panjang saluran <InlineMath math="200\text{ cm}" />.</p><p>Berapa liter air yang dapat ditampung saluran tersebut jika penuh?</p><p className="text-xs text-white/60">(1 liter = 1.000 cm³)</p></>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
            <BlockMath math="L_{\text{trap}} = \tfrac{1}{2}(40+20) \times 15 = \tfrac{1}{2} \times 60 \times 15 = 450\text{ cm}^2" />
            <BlockMath math="V = 450 \times 200 = 90.000\text{ cm}^3 = 90\text{ L}" />
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
            <p className="text-yellow-300 font-semibold text-xs">✅ {lang === "en" ? "Water volume" : lang === "ja" ? "水の体積" : "Volume air"} = 90 {lang === "en" ? "liters" : lang === "ja" ? "リットル" : "liter"}</p>
          </div>
        </div>
      ),
    },
    {
      level: t.hard, color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-1">
          {lang === "en" ? (
            <><p>A fish pond is a right triangular prism with legs <InlineMath math="1.5\text{ m}" /> and <InlineMath math="2\text{ m}" />, and pond length <InlineMath math="4\text{ m}" />.</p><p>The pond is filled to <InlineMath math="\frac{3}{4}" /> full. If water density is <InlineMath math="1{,}000\text{ kg/m}^3" />, how many tons does the water weigh?</p></>
          ) : lang === "ja" ? (
            <><p>魚池が直角三角柱で直角辺 <InlineMath math="1.5\text{ m}" /> と <InlineMath math="2\text{ m}" />、奥行き <InlineMath math="4\text{ m}" />。</p><p><InlineMath math="\frac{3}{4}" /> まで水を入れたとき、水の重さは何トン? (密度 <InlineMath math="1{,}000\text{ kg/m}^3" />)</p></>
          ) : (
            <><p>Sebuah kolam ikan berbentuk prisma segitiga siku-siku dengan alas segitiga bersisi siku-siku <InlineMath math="1{,}5\text{ m}" /> dan <InlineMath math="2\text{ m}" />, serta panjang kolam <InlineMath math="4\text{ m}" />.</p><p>Kolam diisi air hingga <InlineMath math="\frac{3}{4}" /> penuh. Jika massa jenis air <InlineMath math="1.000\text{ kg/m}^3" />, berapa ton berat air di dalam kolam?</p></>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 1 — Total volume:" : lang === "ja" ? "ステップ1 — 全体積:" : "Langkah 1 — Volume total:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math="L_{\triangle} = \tfrac{1}{2} \times 1{,}5 \times 2 = 1{,}5\text{ m}^2" />
            <BlockMath math="V_{\text{total}} = 1{,}5 \times 4 = 6\text{ m}^3" />
          </div>
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 2 — Water volume (¾ full):" : lang === "ja" ? "ステップ2 — 水の体積(¾):" : "Langkah 2 — Volume air (¾ penuh):"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math="V_{\text{air}} = \tfrac{3}{4} \times 6 = 4{,}5\text{ m}^3" />
          </div>
          <p className="text-red-400 font-semibold text-xs">
            {lang === "en" ? "Step 3 — Weight of water:" : lang === "ja" ? "ステップ3 — 水の重さ:" : "Langkah 3 — Berat air:"}
          </p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs">
            <BlockMath math="m = \rho \times V = 1.000 \times 4{,}5 = 4.500\text{ kg} = 4{,}5\text{ ton}" />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
            <p className="text-red-300 font-semibold">✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え:" : "Jawaban:"}</p>
            <p className="text-white/80">• {lang === "en" ? "Water volume" : lang === "ja" ? "水の体積" : "Volume air"} = 4.5 m³</p>
            <p className="text-white/80">• {lang === "en" ? "Water weight" : lang === "ja" ? "水の重さ" : "Berat air"} = <strong className="text-yellow-300">4.5 {lang === "en" ? "tons" : lang === "ja" ? "トン" : "ton"}</strong></p>
          </div>
        </div>
      ),
    },
  ];

  /* ── Object examples ── */
  const objectCaptions = lang === "en"
    ? ["Box Stool (Trapezoidal Prism)", "Tent (Triangular Prism)", "Cabinet (Rectangular Prism)", "Tissue Box (Rectangular Prism)", "Toblerone (Triangular Prism)", "Hello Panda (Hexagonal Prism)"]
    : lang === "ja"
    ? ["スツール (台形柱)", "テント (三角柱)", "食器棚 (四角柱)", "ティッシュ箱 (四角柱)", "トブレローネ (三角柱)", "ハローパンダ (六角柱)"]
    : ["Box Stool (Prisma Trapesium)", "Tenda (Prisma Segitiga)", "Lemari (Prisma Segiempat)", "Kotak Tisu (Prisma Segiempat)", "Toblerone (Prisma Segitiga)", "Hello Panda (Prisma Segienam)"];

  const objectImages = [
    "/images/image_1776843419238.png",
    "/images/image_1776843450997.png",
    "/images/image_1776843468055.png",
    "/images/image_1776843489367.png",
    "/images/image_1776843581521.png",
    "/images/image_1776843677763.png",
  ];

  const galTitle = lang === "en" ? "📷 Examples of Prism-shaped Objects"
    : lang === "ja" ? "📷 身の回りにある角柱の例"
    : "📷 Contoh Benda Berbentuk Prisma di Sekitar Kita";

  /* ── Slides ── */
  type Slide = { icon: string; title: string; content: React.ReactNode };
  const slides: Slide[] = [
    {
      icon: "🔷",
      title: t.intro,
      content: (
        <div className="text-sm font-body text-white/75 leading-relaxed space-y-3">
          <ThreePrismas lang={lang} />
          <p>
            {lang === "en"
              ? (<>From chocolate bars to triangular rooftops — prisms are everywhere! Learn all about <strong className="text-cyan-300">prisms</strong> — from their elements, interactive 3D nets, to calculating <strong className="text-yellow-300">surface area</strong> and <strong className="text-green-300">volume</strong>.</>)
              : lang === "ja"
              ? (<>チョコレートバーから三角屋根まで — 角柱は身の回りにあふれています！<strong className="text-cyan-300">角柱</strong>のすべてを学ぼう — 要素、インタラクティブ3D展開図、<strong className="text-yellow-300">表面積</strong>と<strong className="text-green-300">体積</strong>の計算まで。</>)
              : (<>Dari kemasan cokelat batang hingga atap rumah berbentuk segitiga — prisma ada di mana-mana! Pelajari semua tentang <strong className="text-cyan-300">prisma</strong> — mulai dari unsur-unsurnya, jaring-jaring interaktif 3D, hingga cara menghitung{" "}<strong className="text-yellow-300">luas permukaan</strong> dan{" "}<strong className="text-green-300">volume</strong>-nya.</>)
            }
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/60 space-y-1">
            <p className="text-cyan-300 font-semibold mb-1">
              {lang === "en" ? "📋 Topics in this chapter:" : lang === "ja" ? "📋 本章の内容:" : "📋 Materi dalam bab ini:"}
            </p>
            <p>• {lang === "en" ? "Definition & properties" : lang === "ja" ? "定義と性質" : "Definisi & sifat-sifat prisma"}</p>
            <p>• {lang === "en" ? "Elements: edges, faces, vertices" : lang === "ja" ? "要素: 辺・面・頂点" : "Unsur-unsur: rusuk, sisi, titik sudut"}</p>
            <p>• {lang === "en" ? "Interactive 3D net" : lang === "ja" ? "インタラクティブ3D展開図" : "Jaring-jaring interaktif 3D"}</p>
            <p>• {lang === "en" ? "Surface area and volume" : lang === "ja" ? "表面積と体積" : "Luas permukaan dan volume"}</p>
            <p>• {lang === "en" ? "Multi-level practice problems" : lang === "ja" ? "レベル別練習問題" : "Contoh soal bertingkat"}</p>
          </div>
          <div className="bg-slate-800/60 border border-cyan-700/40 rounded-xl p-3">
            <p className="text-cyan-300 font-semibold text-xs mb-3 text-center">{galTitle}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {objectImages.map((src, i) => (
                <div key={i} className="bg-white rounded-lg p-2 flex flex-col items-center">
                  <div className="w-full h-24 flex items-center justify-center overflow-hidden">
                    <img src={src} alt={objectCaptions[i]} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="text-[10px] text-slate-700 text-center mt-1 font-semibold leading-tight">
                    {objectCaptions[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    { icon: "🔷", title: t.def, content: sections[0].content },
    {
      icon: "⬛",
      title: t.slideRusuk,
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body">
          <div className="bg-slate-800/60 border border-cyan-700/40 rounded-xl p-4">
            <p className="text-cyan-300 font-semibold mb-1">
              {lang === "en" ? "🎬 Edge Comparison — 3 Prism Types"
                : lang === "ja" ? "🎬 辺の比較 — 3種の角柱"
                : "🎬 Perbandingan Rusuk — 3 Jenis Prisma Berdiri"}
            </p>
            <p className="text-xs text-white/55 mb-3 font-body">
              {lang === "en"
                ? (<>Notice: all three prisms stand <strong className="text-yellow-300">upright</strong>. Base and top are always the same shape. Press button to see edge groups!</>)
                : lang === "ja"
                ? (<>3つの角柱がすべて<strong className="text-yellow-300">直立</strong>している。底面と上面は常に同じ形。ボタンで辺のグループを確認！</>)
                : (<>Perhatikan: ketiga prisma <strong className="text-yellow-300">berdiri tegak</strong> — alas di bawah, tutup di atas. Tekan tombol untuk melihat kelompok rusuknya!</>)}
            </p>
            <RusukTigaPrismaAnimation />
          </div>
        </div>
      ),
    },
    {
      icon: "⬜",
      title: t.slideSisi,
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body">
          <div className="bg-slate-800/60 border border-green-700/40 rounded-xl p-4">
            <p className="text-green-300 font-semibold mb-1">
              {lang === "en" ? "🎬 Face Comparison — 3 Prism Types"
                : lang === "ja" ? "🎬 面の比較 — 3種の角柱"
                : "🎬 Perbandingan Sisi — 3 Jenis Prisma Berdiri"}
            </p>
            <p className="text-xs text-white/55 mb-3 font-body">
              {lang === "en"
                ? (<>Observe the face groups on each prism. Press button to see <strong className="text-red-300">Base &amp; Top Faces</strong> or <strong className="text-blue-300">Lateral Faces</strong>!</>)
                : lang === "ja"
                ? (<>各角柱の面グループを観察。ボタンで<strong className="text-red-300">底面・上面</strong>または<strong className="text-blue-300">側面</strong>を表示！</>)
                : (<>Perhatikan kelompok sisi pada tiap prisma. Tekan tombol untuk melihat <strong className="text-red-300">Sisi Alas &amp; Tutup</strong> atau <strong className="text-blue-300">Sisi Tegak</strong>!</>)}
            </p>
            <SisiTigaPrismaAnimation />
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-xs text-white/70 space-y-1">
            <p>• <strong className="text-red-300">2 {lang === "en" ? "Base & Top faces" : lang === "ja" ? "底面・上面" : "sisi Alas & Tutup"}</strong>: {lang === "en" ? "triangular (identical)" : lang === "ja" ? "三角形（同一）" : "berbentuk segitiga (sama persis)"}</p>
            <p>• <strong className="text-blue-300">3 {lang === "en" ? "Lateral faces" : lang === "ja" ? "側面" : "sisi Tegak"}</strong>: {lang === "en" ? "rectangular (a × h)" : lang === "ja" ? "長方形 (a × h)" : "berbentuk persegi panjang (a × t)"}</p>
            <div className="bg-slate-700/60 rounded p-2 mt-2">
              <BlockMath math="\text{n faces} = n + 2 = 3 + 2 = 5" />
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: "●",
      title: t.slideTitik,
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-slate-800/60 border border-yellow-700/40 rounded-xl p-4">
            <p className="text-yellow-300 font-semibold mb-1">
              {lang === "en" ? "🎬 Vertex Comparison — 3 Prism Types"
                : lang === "ja" ? "🎬 頂点の比較 — 3種の角柱"
                : "🎬 Perbandingan Titik Sudut — 3 Jenis Prisma Berdiri"}
            </p>
            <p className="text-xs text-white/55 mb-3 font-body">
              {lang === "en"
                ? (<>Observe vertices on each prism. Press button to see <strong className="text-cyan-300">Bottom Vertices</strong> or <strong className="text-yellow-300">Top Vertices</strong>!</>)
                : lang === "ja"
                ? (<>各角柱の頂点を観察。ボタンで<strong className="text-cyan-300">底面頂点</strong>または<strong className="text-yellow-300">上面頂点</strong>を表示！</>)
                : (<>Perhatikan titik sudut pada tiap prisma. Tekan tombol untuk melihat <strong className="text-cyan-300">Titik Sudut Alas</strong> atau <strong className="text-yellow-300">Titik Sudut Atas</strong>!</>)}
            </p>
            <TitikSudutTigaPrismaAnimation />
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
            <p>• <strong className="text-cyan-300">{elLabels.nTitikAlas}</strong>{" "}
              {lang === "en" ? "at the bottom" : lang === "ja" ? "（下）" : "di bawah"}</p>
            <p>• <strong className="text-yellow-300">{elLabels.nTitikAtas}</strong>{" "}
              {lang === "en" ? "at the top — same number" : lang === "ja" ? "（上）同数" : "di atas — sama banyak"}</p>
            <div className="bg-slate-700/60 rounded p-2 mt-2">
              <BlockMath math="\text{vertices} = 2n = 2 \times 3 = 6" />
            </div>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "📋 Prism Elements Table (n-gon):"
                : lang === "ja" ? "📋 n角柱の要素表:"
                : "📋 Tabel Unsur Prisma Segi-n:"}
            </p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-center">
                <thead><tr className="border-b border-cyan-800">
                  {tableHead.map((h, i) => <th key={i} className={`px-2 py-1 ${i===0?"text-left":""}`}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {tableTypes.map(([n, s, r, ts], i) => (
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
      title: t.slideNet,
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-slate-800/60 border border-violet-700/40 rounded-xl p-4">
            <p className="text-violet-300 font-semibold mb-1">
              {lang === "en" ? "🎬 Interactive Net — 3 Prism Types"
                : lang === "ja" ? "🎬 インタラクティブ展開図 — 3種の角柱"
                : "🎬 Jaring-jaring Interaktif — 3 Jenis Prisma"}
            </p>
            <p className="text-xs text-white/55 mb-3 font-body">
              {lang === "en"
                ? (<><strong className="text-orange-300">Drag</strong> to rotate the 3D prism. Press <strong className="text-orange-300">Unfold</strong> to open the net, then <strong className="text-cyan-300">Fold</strong> to assemble it back!</>)
                : lang === "ja"
                ? (<><strong className="text-orange-300">ドラッグ</strong>で3D回転。<strong className="text-orange-300">展開</strong>ボタンで開き、<strong className="text-cyan-300">組立</strong>で元に戻す！</>)
                : (<><strong className="text-orange-300">Drag</strong> untuk memutar prisma 3D. Tekan <strong className="text-orange-300">Bongkar</strong> untuk membuka jaring-jaring, lalu <strong className="text-cyan-300">Satukan</strong> untuk merakitnya kembali!</>)}
            </p>
            <JaringPrismaInteraktif />
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1">
            <p>• {lang === "en" ? "A net is a" : lang === "ja" ? "展開図は" : "Jaring-jaring adalah"} <strong className="text-white">{lang === "en" ? "flat shape" : lang === "ja" ? "平面図形" : "bangun datar"}</strong> {lang === "en" ? "that folds into a prism" : lang === "ja" ? "を折り畳むと角柱になる" : "yang jika dilipat membentuk prisma"}</p>
            <p>• {lang === "en" ? "Every n-gon prism has" : lang === "ja" ? "n角柱は" : "Setiap prisma segi-n memiliki"} <strong className="text-violet-300">n {lang === "en" ? "lateral faces" : lang === "ja" ? "側面" : "sisi tegak"}</strong> ({lang === "en" ? "rectangles" : lang === "ja" ? "長方形" : "persegi panjang"}) + <strong className="text-yellow-300">2 {lang === "en" ? "base/top faces" : lang === "ja" ? "底面・上面" : "sisi alas/tutup"}</strong> (n-{lang === "en" ? "gon" : lang === "ja" ? "角形" : "gon"})</p>
            <p>• {lang === "en" ? "Total faces = n + 2" : lang === "ja" ? "全面数 = n + 2" : "Total bidang = n + 2"}</p>
          </div>
        </div>
      ),
    },
    { icon: "🎨", title: t.slideLuas, content: sections[3].content },
    { icon: "📐", title: t.slideVol, content: sections[4].content },
    { icon: "📊", title: t.slideSumTitle, content: sections[5].content },
    {
      icon: "📝",
      title: t.slideEx1,
      content: (
        <div className="flex flex-col gap-3">
          {luasExamples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} prefix={t.prefixLP} lang={lang} />)}
        </div>
      ),
    },
    {
      icon: "📝",
      title: t.slideEx2,
      content: (
        <div className="flex flex-col gap-3">
          {volExamples.map((ex, i) => <ExampleCard key={i} ex={ex} idx={i} prefix={t.prefixVol} lang={lang} />)}
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
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <Triangle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {lang === "en" ? "PRISM" : lang === "ja" ? "角柱" : "PRISMA"}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

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
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold font-display
              text-white/70 hover:text-white hover:border-primary/60 hover:bg-primary/10
              disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {t.prev}
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex-1 py-2.5 rounded-lg border border-primary/60 bg-primary/15 text-sm font-semibold font-display
              text-primary hover:bg-primary/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {t.next}
          </button>
        </div>

        <div className="mt-2 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrismaPage;
