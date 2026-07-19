import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

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
   HELPERS
───────────────────────────────────────────────────────────── */
type FName = "front" | "back" | "left" | "right" | "top" | "bottom";

const getFaceLabels = (lang: string): Record<FName, string> => {
  if (lang === "en") return { front:"FRONT", back:"BACK", left:"LEFT", right:"RIGHT", top:"TOP", bottom:"BOTTOM" };
  if (lang === "ja") return { front:"前面", back:"背面", left:"左面", right:"右面", top:"上面", bottom:"下面" };
  return { front:"DEPAN", back:"BELAKANG", left:"KIRI", right:"KANAN", top:"ATAS", bottom:"BAWAH" };
};

const getObjectExamples = (lang: string) => {
  const labels: Record<string,string[]> = {
    id: ["Batu Bata","Buku Tulis","Kulkas","Kasur","Kardus","Smartphone","Lemari","Akuarium"],
    en: ["Brick","Notebook","Refrigerator","Mattress","Cardboard Box","Smartphone","Wardrobe","Aquarium"],
    ja: ["レンガ","ノート","冷蔵庫","マットレス","段ボール","スマートフォン","タンス","水槽"],
  };
  const srcs = [
    "/images/image_1776495090791.png","/images/image_1776495176110.png",
    "/images/image_1776495260274.png","/images/image_1776495365955.png",
    "/images/image_1776495417623.png","/images/image_1776495514155.png",
    "/images/image_1776495591763.png","/images/image_1776495641319.png",
  ];
  const l = labels[lang] ?? labels.id;
  return srcs.map((src, i) => ({ src, label: l[i] }));
};

/* ─────────────────────────────────────────────────────────────
   SIMPLE AUTO-ROTATING BALOK
───────────────────────────────────────────────────────────── */
const SimpleRotatingBalok = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
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
    const ny = dragRef.current.by - (e.clientX - dragRef.current.sx) * 0.55;
    const nx = dragRef.current.bx + (e.clientY - dragRef.current.sy) * 0.55;
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

  const pw = 55, th = 36, ld = 40;
  const hw = pw/2, hh = th/2, hd = ld/2;
  const rawVerts: V3[] = [
    [-hw,-hh,+hd],[+hw,-hh,+hd],[+hw,+hh,+hd],[-hw,+hh,+hd],
    [-hw,-hh,-hd],[+hw,-hh,-hd],[+hw,+hh,-hd],[-hw,+hh,-hd],
  ];
  const fl = getFaceLabels(lang);
  const faceDefs = [
    { idx:[0,1,2,3], color:"#3b82f6", label: fl.front },
    { idx:[5,4,7,6], color:"#8b5cf6", label: fl.back },
    { idx:[4,0,3,7], color:"#22c55e", label: fl.left },
    { idx:[1,5,6,2], color:"#f97316", label: fl.right },
    { idx:[4,5,1,0], color:"#eab308", label: fl.top },
    { idx:[3,2,6,7], color:"#ef4444", label: fl.bottom },
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

  const autoHint = lang === "en" ? "Auto-rotating · Drag to rotate manually"
    : lang === "ja" ? "自動回転中 · ドラッグで手動回転"
    : "Berputar otomatis · Drag untuk memutar sendiri";

  return (
    <div
      className={`${isDark ? "bg-slate-900/70 border-slate-700/50" : "bg-white border-gray-200"} border rounded-xl select-none`}
      style={{ padding: "10px 0 8px", cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <p className={`text-center ${isDark ? "text-white/40" : "text-gray-400"} font-body mb-1`} style={{ fontSize: 9 }}>
        {autoHint}
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
              <text x={cx+mx} y={cy+my+3} fill="var(--icon-color)" fontSize={8} fontFamily="monospace"
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
            <span className={`${isDark ? "text-white/45" : "text-gray-500"} font-body`} style={{ fontSize:9 }}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D BALOK — hinge-based folding, back = tumpuan
───────────────────────────────────────────────────────────── */
const OPEN_ORDER: FName[] = ["top", "left", "right", "bottom", "front"];

const P = 110;
const L = 72;
const T = 65;

const FACE_COLORS: Record<FName, string> = {
  front:  "#3b82f6",
  back:   "#8b5cf6",
  left:   "#22c55e",
  right:  "#f97316",
  top:    "#eab308",
  bottom: "#ef4444",
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
  face, isNext, isOpen, onClickFace, onClickNext, style, lang,
}: {
  face: FName; isNext: boolean; isOpen: boolean;
  onClickFace: () => void; onClickNext: () => void;
  style?: React.CSSProperties; lang: string;
}) => {
  const color = FACE_COLORS[face];
  const [w, h] = FACE_DIMS[face];
  const fl = getFaceLabels(lang);
  const clickLabel = lang === "en" ? "CLICK" : lang === "ja" ? "クリック" : "KLIK";
  const openMark = "▣";
  const closedHint = lang === "en" ? "□ click" : lang === "ja" ? "□ タップ" : "□ klik";
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
        <span style={{ color: "var(--icon-color)", fontSize: 8, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>
          {fl[face]}
        </span>
        {isNext ? (
          <button onClick={e => { e.stopPropagation(); onClickNext(); }} style={{
            marginTop: 4, background: "rgba(255,255,255,0.25)", border: "1.5px solid white",
            borderRadius: 8, color: "#fff", fontSize: 7, fontWeight: 700,
            padding: "2px 6px", cursor: "pointer",
          }}>{clickLabel}</button>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 6, marginTop: 2, fontFamily: "monospace" }}>
            {isOpen ? openMark : closedHint}
          </span>
        )}
      </div>
    </div>
  );
};

const TRANS = "transform 1.6s cubic-bezier(0.4, 0, 0.2, 1)";

const InteractiveBalok3D = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
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
    if (e.cancelable) e.preventDefault();
    const t = e.touches[0];
    setRotY(dragRef.current.baseRotY + (t.clientX - dragRef.current.startX) * 0.5);
    setRotX(dragRef.current.baseRotX - (t.clientY - dragRef.current.startY) * 0.5);
  }, [isDragging]);
  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  useEffect(() => {
    if (!isDragging) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [isDragging]);

  const nextFace = seqStep >= 0 ? OPEN_ORDER[seqStep] : null;
  const commonFaceProps = (face: FName) => ({
    face, isNext: nextFace === face, isOpen: isOpen(face), lang,
    onClickFace: () => { if (!isDragging) toggleFace(face); },
    onClickNext: openNextSeq,
  });

  const fl = getFaceLabels(lang);
  const dragHint = lang === "en"
    ? "Drag to rotate · Click face to unfold/fold · BACK (purple) = fixed anchor"
    : lang === "ja"
    ? "ドラッグで回転 · 面をクリックして展開/折り畳み · 背面（紫）= 固定面"
    : "Drag untuk memutar · Klik sisi untuk membongkar/melipat · Sisi BELAKANG (ungu) = tumpuan tetap jaring-jaring";
  const anchorLabel = lang === "en" ? "★ anchor · p×w" : lang === "ja" ? "★ 固定面 · p×w" : "★ tumpuan · p×t";
  const anchorNote = lang === "en" ? "★ = net anchor" : lang === "ja" ? "★ = 展開図の固定面" : "★ = tumpuan jaring-jaring";
  const seqBtn = lang === "en" ? "▶ Step-by-Step Unfold" : lang === "ja" ? "▶ 順番に展開" : "▶ Bongkar Bertahap";
  const openAllBtn = lang === "en" ? "⊞ Unfold All" : lang === "ja" ? "⊞ すべて展開" : "⊞ Bongkar Semua";
  const closeAllBtn = lang === "en" ? "⊟ Fold Back" : lang === "ja" ? "⊟ 折り畳む" : "⊟ Satukan Kembali";

  const faceKeys: FName[] = ["front","back","left","right","top","bottom"];
  const faceDimLabel = (f: FName) => f === "front" || f === "back" ? "p×t"
    : f === "left" || f === "right" ? "l×t" : "p×l";

  return (
    <div className={`${isDark ? "bg-slate-900/80 border-slate-700" : "bg-white border-gray-200"} border rounded-xl p-4 space-y-4`}>
      <p className={`${isDark ? "text-white/60" : "text-gray-600"} text-xs text-center font-body`}>{dragHint}</p>

      <div className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{ width: "100%", height: 380, cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}
      >
        <div style={{
          width: P, height: T,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : "transform 0.6s ease",
        }}>
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
                <span style={{ color: "var(--icon-color)", fontSize: 8, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>
                  {fl.back}
                </span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 6, marginTop: 3, fontFamily: "monospace" }}>
                  {anchorLabel}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            position: "absolute", top: 0, left: 0, width: P, height: 0,
            transformStyle: "preserve-3d", transformOrigin: "50% 0% 0",
            transform: isOpen("top") ? "rotateX(0deg)" : "rotateX(-90deg)",
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("top")} style={{ top: -L, left: 0 }} />
          </div>

          <div style={{
            position: "absolute", top: T, left: 0, width: P, height: 0,
            transformStyle: "preserve-3d", transformOrigin: "50% 0% 0",
            transform: isOpen("bottom") ? "rotateX(0deg)" : "rotateX(90deg)",
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("bottom")} style={{ top: 0, left: 0 }} />

            <div style={{
              position: "absolute", top: L, left: 0, width: P, height: 0,
              transformStyle: "preserve-3d", transformOrigin: "50% 0% 0",
              transform: isOpen("front") ? "rotateX(0deg)" : "rotateX(90deg)",
              transition: TRANS,
            }}>
              <FaceRect {...commonFaceProps("front")} style={{ top: 0, left: 0 }} />
            </div>
          </div>

          <div style={{
            position: "absolute", top: 0, left: 0, width: 0, height: T,
            transformStyle: "preserve-3d", transformOrigin: "0% 50% 0",
            transform: isOpen("left") ? "rotateY(0deg)" : "rotateY(90deg)",
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("left")} style={{ top: 0, left: -L }} />
          </div>

          <div style={{
            position: "absolute", top: 0, left: P, width: 0, height: T,
            transformStyle: "preserve-3d", transformOrigin: "0% 50% 0",
            transform: isOpen("right") ? "rotateY(0deg)" : "rotateY(-90deg)",
            transition: TRANS,
          }}>
            <FaceRect {...commonFaceProps("right")} style={{ top: 0, left: 0 }} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={startSequential}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          {seqBtn}
        </button>
        <button onClick={openAll} disabled={allOpen}
          className="px-3 py-1.5 text-xs font-bold bg-orange-900/60 border border-orange-600 text-orange-300 rounded-lg hover:bg-orange-800/60 transition-colors cursor-pointer font-body disabled:opacity-40">
          {openAllBtn}
        </button>
        <button onClick={closeAll} disabled={allClosed}
          className="px-3 py-1.5 text-xs font-bold bg-violet-900/60 border border-violet-600 text-violet-300 rounded-lg hover:bg-violet-800/60 transition-colors cursor-pointer font-body disabled:opacity-40">
          {closeAllBtn}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {faceKeys.map(f => (
          <div key={f} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: FACE_COLORS[f] }} />
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-[10px] font-body`}>
              {fl[f]}{f === "back" ? " ★" : ""}{" "}
              <span className={isDark ? "text-white/30" : "text-gray-400"}>({faceDimLabel(f)})</span>
            </span>
          </div>
        ))}
      </div>
      <p className={`${isDark ? "text-white/30" : "text-gray-400"} text-[9px] text-center font-body`}>{anchorNote}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE KERANGKA BALOK — 12 rusuk
───────────────────────────────────────────────────────────── */
type EdgeAxis = "p" | "l" | "t";
type EdgeSpec = { axis: EdgeAxis; start: [number, number, number]; idx: number };

const KERANGKA_EDGES: EdgeSpec[] = [
  { axis: "p", start: [0, 0, 0], idx: 0 },
  { axis: "p", start: [0, T, 0], idx: 1 },
  { axis: "p", start: [0, 0, L], idx: 2 },
  { axis: "p", start: [0, T, L], idx: 3 },
  { axis: "l", start: [0, 0, 0], idx: 0 },
  { axis: "l", start: [P, 0, 0], idx: 1 },
  { axis: "l", start: [0, T, 0], idx: 2 },
  { axis: "l", start: [P, T, 0], idx: 3 },
  { axis: "t", start: [0, 0, 0], idx: 0 },
  { axis: "t", start: [P, 0, 0], idx: 1 },
  { axis: "t", start: [0, 0, L], idx: 2 },
  { axis: "t", start: [P, 0, L], idx: 3 },
];

const KERANGKA_COLORS: Record<EdgeAxis, string> = {
  p: "#22d3ee",
  l: "#ef4444",
  t: "#facc15",
};

const InteractiveKerangkaBalok = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const [bongkar, setBongkar] = useState(false);
  const [rotX, setRotX] = useState(-18);
  const [rotY, setRotY] = useState(28);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, baseRotX: -18, baseRotY: 28 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

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
    if (e.cancelable) e.preventDefault();
    const t = e.touches[0];
    setRotY(dragRef.current.baseRotY + (t.clientX - dragRef.current.startX) * 0.5);
    setRotX(dragRef.current.baseRotX - (t.clientY - dragRef.current.startY) * 0.5);
  }, [isDragging]);
  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  useEffect(() => {
    if (!isDragging) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [isDragging]);

  const handleToggle = () => {
    playPopSound();
    if (!bongkar) {
      setRotX(0); setRotY(0);
      setBongkar(true);
    } else {
      setBongkar(false);
      setRotX(-18); setRotY(28);
    }
  };

  const ps = Math.min(P, Math.max(50, Math.floor((containerW - 3 * 6 - 8) / 4)));
  const bScale = ps / P;
  const ls = Math.round(L * bScale);
  const ts = Math.round(T * bScale);
  const bRowGap = Math.max(12, Math.round(18 * bScale));

  const dLEN: Record<EdgeAxis, number> = { p: ps, l: ls, t: ts };
  const THICK = 5;

  const getEdgeTransform = (e: EdgeSpec) => {
    const len = dLEN[e.axis];
    if (!bongkar) {
      const [sx, sy, sz] = e.start;
      const sx_s = sx > 0 ? ps : 0;
      const sy_s = sy > 0 ? ts : 0;
      const sz_s = sz > 0 ? ls : 0;
      let cx = 0, cy = 0, cz = 0, rot = "";
      if (e.axis === "p") {
        cx = ps / 2; cy = sy_s; cz = sz_s;
      } else if (e.axis === "l") {
        cx = sx_s; cy = sy_s; cz = ls / 2; rot = " rotateY(-90deg)";
      } else {
        cx = sx_s; cy = ts / 2; cz = sz_s; rot = " rotateZ(90deg)";
      }
      return `translate3d(${cx - len / 2}px, ${cy - THICK / 2}px, ${cz}px)${rot}`;
    }
    const gap = 6;
    const baseRowY = ts + 36;
    const rowY =
      e.axis === "p" ? baseRowY :
      e.axis === "l" ? baseRowY + bRowGap :
      baseRowY + bRowGap * 2;
    const totalW = 4 * len + 3 * gap;
    const startX = (ps - totalW) / 2;
    const ex = startX + e.idx * (len + gap);
    return `translate3d(${ex}px, ${rowY - THICK / 2}px, 0px)`;
  };

  const dragHint = lang === "en"
    ? "Drag to rotate · Click button to explode 12 edges into 4p + 4l + 4t"
    : lang === "ja"
    ? "ドラッグで回転 · ボタンで12辺を4p+4l+4tに分解"
    : "Drag untuk memutar · Klik tombol untuk membongkar 12 rusuk menjadi 4p + 4l + 4t";
  const bongkarBtn = bongkar
    ? (lang === "en" ? "⊟ Reassemble Frame" : lang === "ja" ? "⊟ 元に戻す" : "⊟ Susun Kembali Kerangka")
    : (lang === "en" ? "⊞ Explode Frame" : lang === "ja" ? "⊞ 分解する" : "⊞ Bongkar Kerangka");

  const pLabel = lang === "en" ? "4 × p (length)" : lang === "ja" ? "4 × p（縦）" : "4 × p (panjang)";
  const lLabel = lang === "en" ? "4 × l (width)" : lang === "ja" ? "4 × l（横）" : "4 × l (lebar)";
  const tLabel = lang === "en" ? "4 × t (height)" : lang === "ja" ? "4 × t（高さ）" : "4 × t (tinggi)";

  return (
    <div ref={containerRef} className={`${isDark ? "bg-slate-900/80 border-slate-700" : "bg-white border-gray-200"} border rounded-xl p-4 space-y-4`}>
      <p className={`${isDark ? "text-white/60" : "text-gray-600"} text-xs text-center font-body`}>{dragHint}</p>

      <div
        className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{
          width: "100%",
          height: bongkar ? Math.round(360 * bScale) : Math.round(280 * bScale),
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          transition: "height 0.6s ease",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div style={{
          width: ps, height: ts,
          position: "relative",
          transformStyle: "preserve-3d",
          transformOrigin: `50% 50% ${ls / 2}px`,
          transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : "transform 1s ease",
        }}>
          {KERANGKA_EDGES.map((e, i) => {
            const len = dLEN[e.axis];
            const color = KERANGKA_COLORS[e.axis];
            return (
              <div key={i} style={{
                position: "absolute", top: 0, left: 0,
                width: len, height: THICK,
                background: color,
                borderRadius: 3,
                transformStyle: "preserve-3d",
                transform: getEdgeTransform(e),
                transition: "transform 1.4s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: `0 0 6px ${color}cc, inset 0 0 2px rgba(255,255,255,0.4)`,
              }} />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={handleToggle}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          {bongkarBtn}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-body">
        <div className={`${isDark ? "bg-slate-800/60" : "bg-gray-100"} border border-cyan-700/40 rounded p-2 flex items-center justify-center gap-1.5`}>
          <div className="w-3 h-3 rounded-sm" style={{ background: KERANGKA_COLORS.p, boxShadow: `0 0 4px ${KERANGKA_COLORS.p}` }} />
          <span className="text-cyan-300 font-semibold">{pLabel}</span>
        </div>
        <div className={`${isDark ? "bg-slate-800/60" : "bg-gray-100"} border border-orange-700/40 rounded p-2 flex items-center justify-center gap-1.5`}>
          <div className="w-3 h-3 rounded-sm" style={{ background: KERANGKA_COLORS.l, boxShadow: `0 0 4px ${KERANGKA_COLORS.l}` }} />
          <span className="text-orange-300 font-semibold">{lLabel}</span>
        </div>
        <div className={`${isDark ? "bg-slate-800/60" : "bg-gray-100"} border border-yellow-700/40 rounded p-2 flex items-center justify-center gap-1.5`}>
          <div className="w-3 h-3 rounded-sm" style={{ background: KERANGKA_COLORS.t, boxShadow: `0 0 4px ${KERANGKA_COLORS.t}` }} />
          <span className="text-yellow-300 font-semibold">{tLabel}</span>
        </div>
      </div>

      <div className={`${isDark ? "bg-slate-900/60 border-slate-700" : "bg-white/90 border-gray-200"} border rounded-lg p-3 text-center`}>
        {bongkar ? (
          <BlockMath math="K = \underbrace{4p}_{\text{p}} + \underbrace{4l}_{\text{l}} + \underbrace{4t}_{\text{t}} = 4(p + l + t)" />
        ) : (
          <BlockMath math="K = 4(p + l + t)" />
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   JARING-JARING BALOK SVG PATTERNS
───────────────────────────────────────────────────────────── */
const CP = 38;
const CL = 25;
const CT = 28;

type BalokCell = { x: number; y: number; w: number; h: number; color: string; label: string };

const balokNets: BalokCell[][] = [
  [
    { x: CP,    y: 0,          w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: 0,     y: CL,         w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CL,    y: CL,         w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CL+CP, y: CL,         w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: CP,    y: CL+CT,      w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: CP,    y: CL+CT+CL,   w: CP, h: CT, color: "#3b82f6", label: "p×t" },
  ],
  [
    { x: 0,     y: 0,          w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: 0,     y: CL,         w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: 0,     y: CL+CT,      w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: 0,     y: CL+CT+CL,   w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: CP,    y: CL,         w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: -CL,   y: CL,         w: CL, h: CT, color: "#22c55e", label: "l×t" },
  ],
  [
    { x: 0,     y: 0,          w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CL,    y: 0,          w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CL+CP, y: 0,          w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: CL,    y: CT,         w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CL,    y: CT+CL,      w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: CL,    y: CT+CL+CT,   w: CP, h: CL, color: "#ef4444", label: "p×l" },
  ],
  [
    { x: CP,    y: 0,          w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: 0,     y: CT,         w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CP,    y: CT,         w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CP+CP, y: CT,         w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: CP,    y: CT+CT,      w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: CP,    y: CT+CT+CL,   w: CP, h: CT, color: "#3b82f6", label: "p×t" },
  ],
  [
    { x: CL,    y: 0,          w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CL,    y: CT,         w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: 0,     y: CT,         w: CL, h: CL, color: "#22c55e", label: "l×t"  },
    { x: CL+CP, y: CT,         w: CL, h: CL, color: "#f97316", label: "l×t"  },
    { x: CL,    y: CT+CL,      w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: CL,    y: CT+CL+CT,   w: CP, h: CL, color: "#ef4444", label: "p×l" },
  ],
  [
    { x: 0,     y: 0,          w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CP,    y: 0,          w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: 0,     y: CT,         w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: 0,     y: CT+CL,      w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: -CL,   y: CT,         w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: 0,     y: CT+CL+CT,   w: CP, h: CL, color: "#ef4444", label: "p×l" },
  ],
  [
    { x: CL,    y: 0,          w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CL,    y: CL,         w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: 0,     y: CL,         w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CL+CP, y: CL,         w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: CL,    y: CL+CT,      w: CP, h: CT, color: "#3b82f6", label: "p×t" },
    { x: CL,    y: CL+CT+CT,   w: CP, h: CL, color: "#ef4444", label: "p×l" },
  ],
  [
    { x: 0,     y: 0,          w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CL,    y: 0,          w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CL,    y: CL,         w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CL+CP, y: CL,         w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: CL,    y: CL+CT,      w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: CL,    y: CL+CT+CL,   w: CP, h: CT, color: "#3b82f6", label: "p×t" },
  ],
  [
    { x: 0,     y: 0,          w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CP,    y: 0,          w: CL, h: CL, color: "#f97316", label: "l×t" },
    { x: 0,     y: CL,         w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: -CL,   y: CL,         w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: 0,     y: CL+CT,      w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: 0,     y: CL+CT+CL,   w: CP, h: CT, color: "#3b82f6", label: "p×t" },
  ],
  [
    { x: 0,     y: 0,          w: CL, h: CT, color: "#22c55e", label: "l×t" },
    { x: CL,    y: 0,          w: CP, h: CT, color: "#8b5cf6", label: "p×t" },
    { x: CL+CP, y: 0,          w: CL, h: CT, color: "#f97316", label: "l×t" },
    { x: CL,    y: CT,         w: CP, h: CL, color: "#eab308", label: "p×l" },
    { x: CL,    y: CT+CL,      w: CP, h: CL, color: "#ef4444", label: "p×l" },
    { x: CL,    y: CT+CL+CL,   w: CP, h: CT, color: "#3b82f6", label: "p×t" },
  ],
];

const NetSVG = ({ cells }: { cells: BalokCell[] }) => {
  const allX = cells.map(c => c.x);
  const allY = cells.map(c => c.y);
  const allXR = cells.map(c => c.x + c.w);
  const allYB = cells.map(c => c.y + c.h);
  const minX = Math.min(...allX); const minY = Math.min(...allY);
  const maxX = Math.max(...allXR); const maxY = Math.max(...allYB);
  const pad = 4;
  const vw = maxX - minX + pad * 2;
  const vh = maxY - minY + pad * 2;
  return (
    <svg viewBox={`${minX - pad} ${minY - pad} ${vw} ${vh}`}
      className="w-full h-full" style={{ display: "block" }}>
      {cells.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h}
            fill={c.color} fillOpacity={0.82}
            stroke="#0f172a" strokeWidth={0.8} rx={1}/>
          <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 3}
            fill="rgba(255,255,255,0.9)" fontSize={6}
            fontFamily="monospace" fontWeight="bold"
            textAnchor="middle" dominantBaseline="middle">
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

const NetGallery = () => (
  <div className="grid grid-cols-5 gap-1.5">
    {balokNets.map((cells, i) => (
      <div key={i}
        className={`${isDark ? "bg-slate-950/60 border-slate-700/50" : "bg-white border-gray-200"} border rounded p-1`}
        style={{ aspectRatio: "1/1.1" }}>
        <NetSVG cells={cells} />
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   RUSUK BALOK SVG
───────────────────────────────────────────────────────────── */
type DBVKey = "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H";
const DB_VERTS: Record<DBVKey, [number,number,number?,number?]> = {
  A:[14,126, -4, 8], B:[134,126, 3, 8], C:[166,96, 3, 5], D:[46,96, -10, 5],
  E:[14,56, -4,-5],  F:[134,56, 3,-5],  G:[166,22, 3,-5], H:[46,22, -10,-5],
};
const DB_ALL_KEYS: DBVKey[] = ["A","B","C","D","E","F","G","H"];

const RusukBalokSVG = () => (
  <svg viewBox="0 0 200 154" className="w-full max-w-xs mx-auto my-2" aria-label="Rusuk balok ABCD.EFGH">
    <defs>
      <style>{`
        @keyframes rPulse{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px currentColor);}50%{stroke-opacity:0.18;filter:none;}}
        .rp{animation:rPulse 1.8s ease-in-out infinite;}
        .rl{animation:rPulse 1.8s ease-in-out infinite 0.3s;}
        .rt{animation:rPulse 1.8s ease-in-out infinite 0.6s;}
      `}</style>
    </defs>
    {/* 4 panjang (cyan) — AB, EF, DC, HG */}
    {([["A","B"],["E","F"],["D","C"],["H","G"]] as [DBVKey,DBVKey][]).map(([a,b],i)=>{
      const [x1,y1]=DB_VERTS[a]; const [x2,y2]=DB_VERTS[b];
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" className="rp"/>;
    })}
    {/* 4 lebar (orange) — BC, AD, FG, EH */}
    {([["B","C"],["A","D"],["F","G"],["E","H"]] as [DBVKey,DBVKey][]).map(([a,b],i)=>{
      const [x1,y1]=DB_VERTS[a]; const [x2,y2]=DB_VERTS[b];
      const dashed = (a==="A"&&b==="D")||(a==="E"&&b==="H");
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f97316" strokeWidth="3" strokeLinecap="round" className="rl" strokeDasharray={dashed?"4,3":undefined}/>;
    })}
    {/* 4 tinggi (yellow) — AE, BF, CG, DH */}
    {([["A","E"],["B","F"],["C","G"],["D","H"]] as [DBVKey,DBVKey][]).map(([a,b],i)=>{
      const [x1,y1]=DB_VERTS[a]; const [x2,y2]=DB_VERTS[b];
      const dashed = (a==="D"&&b==="H");
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="3" strokeLinecap="round" className="rt" strokeDasharray={dashed?"4,3":undefined}/>;
    })}
    {DB_ALL_KEYS.map(k=>{
      const [cx,cy,lx=0,ly=0]=DB_VERTS[k];
      return <circle key={k} cx={cx} cy={cy} r={3} fill="#e2e8f0"/>;
    })}
    {DB_ALL_KEYS.map(k=>{
      const [cx,cy,lx=0,ly=0]=DB_VERTS[k];
      return <text key={k} x={cx+(lx as number)} y={cy+(ly as number)} fill="white" fontSize="10" fontFamily="monospace" fontWeight="bold">{k}</text>;
    })}
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   SISI BALOK SVG — rotating face highlights
───────────────────────────────────────────────────────────── */
const SISI_FACES: {verts:[DBVKey,DBVKey,DBVKey,DBVKey]; color:string; anim:string}[] = [
  {verts:["A","B","F","E"],color:"#3b82f6",anim:"siFront"},
  {verts:["D","C","G","H"],color:"#8b5cf6",anim:"siBack"},
  {verts:["A","D","H","E"],color:"#22c55e",anim:"siLeft"},
  {verts:["B","C","G","F"],color:"#f97316",anim:"siRight"},
  {verts:["E","F","G","H"],color:"#eab308",anim:"siTop"},
  {verts:["A","B","C","D"],color:"#ef4444",anim:"siBot"},
];

const SisiBalokSVG = () => (
  <svg viewBox="0 0 200 154" className="w-full max-w-xs mx-auto my-2" aria-label="Sisi balok ABCD.EFGH">
    <defs>
      <style>{SISI_FACES.map((f,i)=>`@keyframes ${f.anim}{0%,100%{fill-opacity:0.55;filter:drop-shadow(0 0 8px ${f.color});}50%{fill-opacity:0.08;filter:none;}}.${f.anim}{animation:${f.anim} 2.2s ease-in-out infinite ${(i*0.36).toFixed(2)}s;}`).join("")}</style>
    </defs>
    <polygon points="14,126 134,126 134,56 14,56" fill="rgba(15,23,42,0.7)" stroke="#475569" strokeWidth="1"/>
    <polygon points="46,96 166,96 166,22 46,22" fill="rgba(15,23,42,0.45)" stroke="#475569" strokeWidth="1"/>
    <line x1="14" y1="126" x2="46" y2="96" stroke="#475569" strokeWidth="1"/>
    <line x1="134" y1="126" x2="166" y2="96" stroke="#475569" strokeWidth="1"/>
    <line x1="14" y1="56" x2="46" y2="22" stroke="#475569" strokeWidth="1"/>
    <line x1="134" y1="56" x2="166" y2="22" stroke="#475569" strokeWidth="1"/>
    <line x1="46" y1="96" x2="46" y2="22" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
    <line x1="46" y1="96" x2="166" y2="96" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
    <line x1="46" y1="22" x2="14" y2="56" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
    {SISI_FACES.map((f,i)=>{
      const pts = f.verts.map(k => { const [x,y]=DB_VERTS[k]; return `${x},${y}`; }).join(" ");
      return <polygon key={i} points={pts} fill={f.color} stroke={f.color} strokeWidth="2" strokeLinejoin="round" className={f.anim}/>;
    })}
    {DB_ALL_KEYS.map(k=>{
      const [cx,cy,lx=0,ly=0]=DB_VERTS[k];
      return <g key={k}><circle cx={cx} cy={cy} r={2.5} fill="#e2e8f0"/><text x={cx+(lx as number)} y={cy+(ly as number)} fill="white" fontSize="9.5" fontFamily="monospace" fontWeight="bold">{k}</text></g>;
    })}
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   DIAGONAL BIDANG BALOK — 12 total, shown one per card
───────────────────────────────────────────────────────────── */
const ALL_DB_DIAGS_RAW: {key:string;v1:DBVKey;v2:DBVKey;color:string;labelId:string;labelEn:string;labelJa:string}[] = [
  {key:"AG",v1:"A",v2:"G",color:"#22d3ee",
    labelId:"A → G (depan-bawah ke belakang-atas)",
    labelEn:"A → G (front-bottom to back-top)",
    labelJa:"A → G (前下から後上へ)"},
  {key:"BH",v1:"B",v2:"H",color:"#f97316",
    labelId:"B → H (depan-bawah ke belakang-atas)",
    labelEn:"B → H (front-bottom to back-top)",
    labelJa:"B → H (前下から後上へ)"},
  {key:"CE",v1:"C",v2:"E",color:"#f472b6",
    labelId:"C → E (belakang-bawah ke depan-atas)",
    labelEn:"C → E (back-bottom to front-top)",
    labelJa:"C → E (後下から前上へ)"},
  {key:"DF",v1:"D",v2:"F",color:"#4ade80",
    labelId:"D → F (belakang-bawah ke depan-atas)",
    labelEn:"D → F (back-bottom to front-top)",
    labelJa:"D → F (後下から前上へ)"},
  {key:"AH",v1:"A",v2:"H",color:"#a78bfa",
    labelId:"A → H (depan-bawah ke depan-atas sisi kiri)",
    labelEn:"A → H (left face diagonal)",
    labelJa:"A → H (左面の対角線)"},
  {key:"BG",v1:"B",v2:"G",color:"#f9a8d4",
    labelId:"B → G (depan-bawah ke depan-atas sisi kanan)",
    labelEn:"B → G (right face diagonal)",
    labelJa:"B → G (右面の対角線)"},
  {key:"CF",v1:"C",v2:"F",color:"#fbbf24",
    labelId:"C → F",labelEn:"C → F",labelJa:"C → F"},
  {key:"DE",v1:"D",v2:"E",color:"#34d399",
    labelId:"D → E",labelEn:"D → E",labelJa:"D → E"},
  {key:"AC",v1:"A",v2:"C",color:"#60a5fa",
    labelId:"A → C (alas, sisi bawah)",
    labelEn:"A → C (base face)",
    labelJa:"A → C (底面)"},
  {key:"BD",v1:"B",v2:"D",color:"#e879f9",
    labelId:"B → D (alas, sisi bawah)",
    labelEn:"B → D (base face)",
    labelJa:"B → D (底面)"},
  {key:"EG",v1:"E",v2:"G",color:"#fb923c",
    labelId:"E → G (atas, sisi atas)",
    labelEn:"E → G (top face)",
    labelJa:"E → G (上面)"},
  {key:"FH",v1:"F",v2:"H",color:"#4ade80",
    labelId:"F → H (atas, sisi atas)",
    labelEn:"F → H (top face)",
    labelJa:"F → H (上面)"},
];

const BalokDiagCard = ({d,idx,lang}:{d:typeof ALL_DB_DIAGS_RAW[0];idx:number;lang:string}) => {
  const { isDark } = useTheme();
  const aId = `dbg${idx}`;
  const aCls = `dbc${idx}`;
  const [x1,y1] = DB_VERTS[d.v1];
  const [x2,y2] = DB_VERTS[d.v2];
  const label = lang === "en" ? d.labelEn : lang === "ja" ? d.labelJa : d.labelId;
  return (
    <div className={`${isDark ? "bg-slate-900/60 border-slate-700/50" : "bg-white/90 border-gray-200"} border rounded-lg p-2 flex flex-col items-center gap-1`}>
      <svg viewBox="0 0 200 154" className="w-full" aria-label={`Diagonal ${d.key}`}>
        <defs>
          <style>{`
            @keyframes ${aId}{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 8px ${d.color});}50%{stroke-opacity:0.08;filter:none;}}
            .${aCls}{animation:${aId} 1.8s ease-in-out infinite ${(idx*0.18).toFixed(1)}s;}
          `}</style>
        </defs>
        <polygon points="14,126 134,126 134,56 14,56" fill="rgba(15,23,42,0.85)" stroke="#475569" strokeWidth="1"/>
        <polygon points="46,96 166,96 166,22 46,22" fill="rgba(15,23,42,0.5)" stroke="#475569" strokeWidth="1"/>
        <line x1="14" y1="126" x2="46" y2="96" stroke="#475569" strokeWidth="1"/>
        <line x1="134" y1="126" x2="166" y2="96" stroke="#475569" strokeWidth="1"/>
        <line x1="14" y1="56" x2="46" y2="22" stroke="#475569" strokeWidth="1"/>
        <line x1="134" y1="56" x2="166" y2="22" stroke="#475569" strokeWidth="1"/>
        <line x1="46" y1="96" x2="46" y2="22" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
        <line x1="46" y1="96" x2="166" y2="96" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
        <line x1="46" y1="22" x2="14" y2="56" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={d.color} strokeWidth="3" strokeLinecap="round" className={aCls}/>
        {DB_ALL_KEYS.map(k=>{
          const [cx,cy]=DB_VERTS[k];
          const isEnd=k===d.v1||k===d.v2;
          return <circle key={k} cx={cx} cy={cy} r={isEnd?4:2} fill={isEnd?d.color:"#64748b"} opacity={isEnd?1:0.4}/>;
        })}
        {DB_ALL_KEYS.map(k=>{
          const [cx,cy,lx=0,ly=0]=DB_VERTS[k];
          const isEnd=k===d.v1||k===d.v2;
          return <text key={k} x={cx+(lx as number)} y={cy+(ly as number)} fill={isEnd?d.color:"rgba(255,255,255,0.3)"} fontSize={isEnd?"10":"8.5"} fontFamily="monospace" fontWeight={isEnd?"bold":"normal"}>{k}</text>;
        })}
        <text x="90" y="148" fill={d.color} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{d.key}</text>
      </svg>
      <p className={`text-[9px] ${isDark ? "text-white/45" : "text-gray-500"} text-center leading-tight font-body`}>{label}</p>
    </div>
  );
};

const AllDiagonalBidangBalok = ({ lang }: { lang: string }) => (
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
    {ALL_DB_DIAGS_RAW.map((d,i) => <BalokDiagCard key={d.key} d={d} idx={i} lang={lang}/>)}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   ALL 4 DIAGONAL RUANG BALOK
───────────────────────────────────────────────────────────── */
const ALL_DR_DIAGS_RAW: {key:string;v1:DBVKey;v2:DBVKey;color:string;labelId:string;labelEn:string;labelJa:string}[] = [
  {key:"AG",v1:"A",v2:"G",color:"#facc15",
    labelId:"A → G (depan-bawah ke belakang-atas)",
    labelEn:"A → G (front-bottom to back-top)",
    labelJa:"A → G (前下から後上へ)"},
  {key:"BH",v1:"B",v2:"H",color:"#f97316",
    labelId:"B → H (depan-bawah ke belakang-atas)",
    labelEn:"B → H (front-bottom to back-top)",
    labelJa:"B → H (前下から後上へ)"},
  {key:"CE",v1:"C",v2:"E",color:"#f472b6",
    labelId:"C → E (belakang-bawah ke depan-atas)",
    labelEn:"C → E (back-bottom to front-top)",
    labelJa:"C → E (後下から前上へ)"},
  {key:"DF",v1:"D",v2:"F",color:"#22d3ee",
    labelId:"D → F (belakang-bawah ke depan-atas)",
    labelEn:"D → F (back-bottom to front-top)",
    labelJa:"D → F (後下から前上へ)"},
];

const BalokRuangCard = ({d,idx,lang}:{d:typeof ALL_DR_DIAGS_RAW[0];idx:number;lang:string}) => {
  const { isDark } = useTheme();
  const aId = `drg${idx}`;
  const aCls = `drc${idx}`;
  const [x1,y1] = DB_VERTS[d.v1];
  const [x2,y2] = DB_VERTS[d.v2];
  const label = lang === "en" ? d.labelEn : lang === "ja" ? d.labelJa : d.labelId;
  return (
    <div className={`${isDark ? "bg-slate-900/60 border-slate-700/50" : "bg-white/90 border-gray-200"} border rounded-lg p-3 flex flex-col items-center gap-1`}>
      <svg viewBox="0 0 200 154" className="w-full" aria-label={`Space diagonal ${d.key}`}>
        <defs>
          <style>{`
            @keyframes ${aId}{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 9px ${d.color});}50%{stroke-opacity:0.08;filter:none;}}
            .${aCls}{animation:${aId} 1.8s ease-in-out infinite ${(idx*0.4).toFixed(1)}s;}
          `}</style>
        </defs>
        <polygon points="14,126 134,126 134,56 14,56"  fill="rgba(15,23,42,0.85)" stroke="#475569" strokeWidth="1"/>
        <polygon points="46,96 166,96 166,22 46,22"   fill="rgba(15,23,42,0.5)"  stroke="#475569" strokeWidth="1"/>
        <line x1="14"  y1="126" x2="46"  y2="96"  stroke="#475569" strokeWidth="1"/>
        <line x1="134" y1="126" x2="166" y2="96"  stroke="#475569" strokeWidth="1"/>
        <line x1="14"  y1="56"  x2="46"  y2="22"  stroke="#475569" strokeWidth="1"/>
        <line x1="134" y1="56"  x2="166" y2="22"  stroke="#475569" strokeWidth="1"/>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={d.color} strokeWidth="3.2" strokeLinecap="round"
          className={aCls}/>
        {DB_ALL_KEYS.map(k => {
          const [cx,cy] = DB_VERTS[k];
          const isEnd = k===d.v1||k===d.v2;
          return <circle key={k} cx={cx} cy={cy} r={isEnd?4:2}
            fill={isEnd?d.color:"#64748b"} opacity={isEnd?1:0.4}/>;
        })}
        {DB_ALL_KEYS.map(k => {
          const [cx,cy,lx=0,ly=0] = DB_VERTS[k];
          const isEnd = k===d.v1||k===d.v2;
          return (
            <text key={k} x={cx+(lx as number)} y={cy+(ly as number)}
              fill={isEnd ? d.color : "rgba(255,255,255,0.3)"}
              fontSize={isEnd ? "10" : "8.5"} fontFamily="monospace"
              fontWeight={isEnd ? "bold" : "normal"}>{k}</text>
          );
        })}
        <text x="90" y="148" fill={d.color} fontSize="10.5" fontFamily="monospace"
          fontWeight="bold" textAnchor="middle">{d.key}</text>
      </svg>
      <p className={`text-[9px] ${isDark ? "text-white/45" : "text-gray-500"} text-center leading-tight font-body`}>{label}</p>
    </div>
  );
};

const AllDiagonalRuangBalok = ({ lang }: { lang: string }) => (
  <div className="grid grid-cols-2 gap-3">
    {ALL_DR_DIAGS_RAW.map((d,i) => <BalokRuangCard key={d.key} d={d} idx={i} lang={lang}/>)}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TITIK SUDUT BALOK SVG
───────────────────────────────────────────────────────────── */
const TS_BALOK_VERTS: [number,number][] = [
  [30,170],[170,170],[210,130],[70,130],[30,70],[170,70],[210,30],[70,30]
];
const TitikSudutBalokSVG = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2" aria-label="Vertices of cuboid ABCD.EFGH">
    <defs>
      <style>{`@keyframes tsB{0%,100%{r:4;opacity:0.9;}50%{r:6;opacity:0.5;}} .tsb{animation:tsB 1.8s ease-in-out infinite;}`}</style>
    </defs>
    <polygon points="30,70 170,70 170,170 30,170" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.2"/>
    <polygon points="70,30 210,30 210,130 70,130" fill="rgba(30,41,59,0.5)" stroke="#334155" strokeWidth="1.2"/>
    <line x1="30" y1="70" x2="70" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="70" x2="210" y2="30" stroke="#334155" strokeWidth="1.2"/>
    <line x1="30" y1="170" x2="70" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="170" y1="170" x2="210" y2="130" stroke="#334155" strokeWidth="1.2"/>
    <line x1="70" y1="130" x2="70" y2="30"  stroke="#475569" strokeWidth="0.8" strokeDasharray="3,2"/>
    <line x1="70" y1="130" x2="210" y2="130" stroke="#475569" strokeWidth="0.8" strokeDasharray="3,2"/>
    <line x1="70" y1="30"  x2="30" y2="70"  stroke="#475569" strokeWidth="0.8" strokeDasharray="3,2"/>
    {TS_BALOK_VERTS.map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={4} fill="#facc15" className="tsb" style={{animationDelay:`${i*0.22}s`}}/>
    ))}
    <text x="16"  y="182" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="173" y="182" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="213" y="135" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="55"  y="135" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="16"  y="65"  fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">E</text>
    <text x="173" y="65"  fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">F</text>
    <text x="213" y="28"  fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">G</text>
    <text x="55"  y="28"  fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">H</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   LUAS PERMUKAAN SVG
───────────────────────────────────────────────────────────── */
const LuasSVG = ({ lang }: { lang: string }) => {
  const pp = 84, lp = 52, tp = 46;
  const ox = 55, oy = 8;
  const fl = getFaceLabels(lang);
  const faces = [
    [ox + lp, oy,               pp, lp, "#eab308", `${fl.top}\np×l`,    "jn-c"],
    [ox,      oy + lp,           lp, tp, "#22c55e", `${fl.left}\nl×t`,   "jn-b"],
    [ox + lp, oy + lp,           pp, tp, "#8b5cf6", `${fl.back}\np×t`,   "jn-a"],
    [ox+lp+pp,oy + lp,           lp, tp, "#f97316", `${fl.right}\nl×t`,  "jn-b"],
    [ox + lp, oy + lp + tp,      pp, lp, "#ef4444", `${fl.bottom}\np×l`, "jn-c"],
    [ox + lp, oy + lp + tp + lp, pp, tp, "#3b82f6", `${fl.front}\np×t`,  "jn-a"],
  ] as const;
  return (
    <svg viewBox="0 0 250 230" className="w-full max-w-sm mx-auto my-2" aria-label="Net of cuboid — surface area">
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

      {faces.map(([x, y, w, h, fill, label, cls], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h}
            fill={fill} className={cls}
            rx={3} stroke="var(--icon-stroke)" strokeWidth={1.5}/>
          {String(label).split("\n").map((line, li) => (
            <text key={li}
              x={x + w / 2} y={y + h / 2 + (li - 0.4) * 9}
              fill="var(--icon-color)" fontSize={8} fontFamily="monospace" fontWeight="bold"
              textAnchor="middle" dominantBaseline="middle">
              {line}
            </text>
          ))}
        </g>
      ))}

      <line x1={ox + lp} y1={oy} x2={ox + lp} y2={oy + lp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>
      <line x1={ox + lp + pp} y1={oy} x2={ox + lp + pp} y2={oy + lp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>
      <line x1={ox} y1={oy + lp + tp} x2={ox + lp} y2={oy + lp + tp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>
      <line x1={ox + lp + pp} y1={oy + lp + tp} x2={ox + lp + pp + lp} y2={oy + lp + tp}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3"/>

      <line x1={ox + lp} y1={oy - 5} x2={ox + lp + pp} y2={oy - 5} stroke="#a5b4fc" strokeWidth={1}/>
      <text x={ox + lp + pp / 2} y={oy - 8} fill="#a5b4fc" fontSize={8} fontFamily="monospace" textAnchor="middle">p</text>
      <line x1={ox - 5} y1={oy + lp} x2={ox - 5} y2={oy + lp + tp} stroke="#4ade80" strokeWidth={1}/>
      <text x={ox - 10} y={oy + lp + tp / 2 + 3} fill="#4ade80" fontSize={8} fontFamily="monospace" textAnchor="middle">t</text>
      <line x1={ox + lp - 5} y1={oy} x2={ox + lp - 5} y2={oy + lp} stroke="#facc15" strokeWidth={1}/>
      <text x={ox + lp - 10} y={oy + lp / 2 + 3} fill="#facc15" fontSize={8} fontFamily="monospace" textAnchor="middle">l</text>

      <text x={125} y={218} fill="#e0e7ff" fontSize={13} fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#jnBloom)">
        L = 2(pl + pt + lt)
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   VOLUME BALOK SVG
───────────────────────────────────────────────────────────── */
const VolumeBalokSVG = () => {
  const dx = 44, dy = -26;
  const fBL = [28, 162], fBR = [178, 162], fTR = [178, 90], fTL = [28, 90];
  const bBL = [fBL[0]+dx, fBL[1]+dy], bBR = [fBR[0]+dx, fBR[1]+dy];
  const bTR = [fTR[0]+dx, fTR[1]+dy], bTL = [fTL[0]+dx, fTL[1]+dy];
  const pt = (a: number[]) => `${a[0]},${a[1]}`;
  return (
    <svg viewBox="0 0 270 200" className="w-full max-w-sm mx-auto my-2" aria-label="Cuboid volume — glowing solid">
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

      <polygon points={`${pt(fBL)} ${pt(fBR)} ${pt(fTR)} ${pt(fTL)}`}
        fill="#1d4ed8" className="vb2-front" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={`${pt(fTL)} ${pt(fTR)} ${pt(bTR)} ${pt(bTL)}`}
        fill="#7c3aed" className="vb2-top" stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={`${pt(fTR)} ${pt(fBR)} ${pt(bBR)} ${pt(bTR)}`}
        fill="#4338ca" className="vb2-side" stroke="#a5b4fc" strokeWidth="2" strokeLinejoin="round"/>

      <polyline points={`${pt(fBL)} ${pt(fBR)} ${pt(fTR)} ${pt(fTL)} ${pt(fBL)}`}
        fill="none" stroke="#93c5fd" strokeWidth="2" className="vb2-edge" strokeLinejoin="round"/>
      <line x1={bTL[0]} y1={bTL[1]} x2={bTR[0]} y2={bTR[1]} stroke="#c4b5fd" strokeWidth="2" className="vb2-edge"/>
      <line x1={bTR[0]} y1={bTR[1]} x2={bBR[0]} y2={bBR[1]} stroke="#a5b4fc" strokeWidth="2" className="vb2-edge"/>
      <line x1={fTL[0]} y1={fTL[1]} x2={bTL[0]} y2={bTL[1]} stroke="#c4b5fd" strokeWidth="2" className="vb2-edge"/>
      <line x1={fTR[0]} y1={fTR[1]} x2={bTR[0]} y2={bTR[1]} stroke="#c4b5fd" strokeWidth="2" className="vb2-edge"/>
      <line x1={fBR[0]} y1={fBR[1]} x2={bBR[0]} y2={bBR[1]} stroke="#a5b4fc" strokeWidth="2" className="vb2-edge"/>
      <line x1={fBL[0]} y1={fBL[1]} x2={bBL[0]} y2={bBL[1]} stroke="#475569" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={bBL[0]} y1={bBL[1]} x2={bBR[0]} y2={bBR[1]} stroke="#475569" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={bBL[0]} y1={bBL[1]} x2={bTL[0]} y2={bTL[1]} stroke="#475569" strokeWidth="1.2" strokeDasharray="4,3"/>

      <line x1={fBL[0]} y1={fBL[1]+8} x2={fBR[0]} y2={fBR[1]+8} stroke="#93c5fd" strokeWidth="1"/>
      <text x={(fBL[0]+fBR[0])/2} y={fBL[1]+18} fill="#93c5fd" fontSize="11"
        fontFamily="monospace" fontWeight="bold" textAnchor="middle" className="vb2-lbl">p</text>
      <line x1={fBL[0]-8} y1={fBL[1]} x2={fTL[0]-8} y2={fTL[1]} stroke="#facc15" strokeWidth="1"/>
      <text x={fBL[0]-16} y={(fBL[1]+fTL[1])/2+4} fill="#facc15" fontSize="11"
        fontFamily="monospace" fontWeight="bold" className="vb2-lbl">t</text>
      <text x={fTR[0]+dx/2+6} y={fTR[1]+dy/2-4} fill="#c4b5fd" fontSize="11"
        fontFamily="monospace" fontWeight="bold" className="vb2-lbl">l</text>

      <text x="135" y="192" fill="#e0e7ff" fontSize="14" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#vb2Bloom)" className="vb2-lbl">V = p × l × t</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   BIDANG DIAGONAL BALOK — 6 planes, 3 types
───────────────────────────────────────────────────────────── */
const BidangDiagonalBalokSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const typeLabel = lang === "en" ? "Type" : lang === "ja" ? "タイプ" : "Tipe";
  const planeLabel = lang === "en" ? "Plane" : lang === "ja" ? "対角面" : "Bidang";
  const areaLabel = lang === "en" ? "Plane area:" : lang === "ja" ? "面積:" : "Luas bidang:";
  const passLabel = (verts: string[]) =>
    lang === "en" ? `Diagonal plane through vertices ${verts.join(", ")}.`
    : lang === "ja" ? `対角面は頂点 ${verts.join(", ")} を通る。`
    : `Bidang diagonal melewati titik ${verts.join(", ")}.`;

  const planes: { key: string; verts: DBVKey[]; color: string; dims: string; type: string }[] = [
    { key: "ABGH", verts: ["A","B","G","H"], color: "#22d3ee", dims: "p × √(l²+t²)", type: `${typeLabel} 1` },
    { key: "DCEF", verts: ["D","C","F","E"], color: "#a78bfa", dims: "p × √(l²+t²)", type: `${typeLabel} 1` },
    { key: "ADGF", verts: ["A","D","G","F"], color: "#4ade80", dims: "l × √(p²+t²)", type: `${typeLabel} 2` },
    { key: "BCEH", verts: ["B","C","H","E"], color: "#f472b6", dims: "l × √(p²+t²)", type: `${typeLabel} 2` },
    { key: "ACGE", verts: ["A","C","G","E"], color: "#f97316", dims: "t × √(p²+l²)", type: `${typeLabel} 3` },
    { key: "BDHF", verts: ["B","D","H","F"], color: "#facc15", dims: "t × √(p²+l²)", type: `${typeLabel} 3` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {planes.map((plane, idx) => {
        const aId = `bdp${idx}`;
        const aCls = `bdpc${idx}`;
        const points = plane.verts.map(v => {
          const [x, y] = DB_VERTS[v];
          return `${x},${y}`;
        }).join(" ");

        return (
          <div key={plane.key} className={`${isDark ? "bg-slate-900/60 border-slate-700/50" : "bg-white/90 border-gray-200"} border rounded-lg p-3`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: plane.color }}>{planeLabel} {plane.key}</span>
              <span className={`text-[10px] ${isDark ? "text-white/50" : "text-gray-500"} font-body`}>{plane.type}</span>
            </div>
            <svg viewBox="0 0 200 154" className="w-full" aria-label={`Diagonal plane ${plane.key}`}>
              <defs>
                <style>{`
                  @keyframes ${aId}{0%,100%{fill-opacity:0.48;stroke-opacity:1;filter:drop-shadow(0 0 9px ${plane.color});}50%{fill-opacity:0.10;stroke-opacity:0.35;filter:none;}}
                  .${aCls}{animation:${aId} 2s ease-in-out infinite ${(idx * 0.22).toFixed(2)}s;}
                `}</style>
              </defs>
              <polygon points="14,126 134,126 134,56 14,56" fill="rgba(15,23,42,0.82)" stroke="#475569" strokeWidth="1"/>
              <polygon points="46,96 166,96 166,22 46,22" fill="rgba(15,23,42,0.42)" stroke="#475569" strokeWidth="1"/>
              <line x1="14" y1="126" x2="46" y2="96" stroke="#475569" strokeWidth="1"/>
              <line x1="134" y1="126" x2="166" y2="96" stroke="#475569" strokeWidth="1"/>
              <line x1="14" y1="56" x2="46" y2="22" stroke="#475569" strokeWidth="1"/>
              <line x1="134" y1="56" x2="166" y2="22" stroke="#475569" strokeWidth="1"/>
              <line x1="46" y1="96" x2="46" y2="22" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
              <line x1="46" y1="96" x2="166" y2="96" stroke="#64748b" strokeWidth="0.8" strokeDasharray="4,3"/>
              <polygon points={points} fill={plane.color} stroke={plane.color} strokeWidth="2" strokeLinejoin="round" className={aCls}/>
              {DB_ALL_KEYS.map(k => {
                const [cx, cy] = DB_VERTS[k];
                const active = plane.verts.includes(k);
                return <circle key={k} cx={cx} cy={cy} r={active ? 3.5 : 2} fill={active ? plane.color : "#64748b"} opacity={active ? 1 : 0.55}/>;
              })}
              {DB_ALL_KEYS.map(k => {
                const [cx, cy, lx=0, ly=0] = DB_VERTS[k];
                const active = plane.verts.includes(k);
                return (
                  <text key={k} x={cx + (lx as number)} y={cy + (ly as number)}
                    fill={active ? plane.color : "rgba(255,255,255,0.6)"}
                    fontSize={active ? "10" : "8.5"} fontFamily="monospace" fontWeight="bold">
                    {k}
                  </text>
                );
              })}
              <text x="100" y="148" fill={plane.color} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                ABCD.EFGH
              </text>
            </svg>
            <div className={`mt-2 rounded-lg ${isDark ? "bg-slate-950/50 border-slate-700/50" : "bg-gray-50 border-gray-200"} border px-3 py-2 text-xs`}>
              <p className="font-semibold" style={{ color: plane.color }}>{areaLabel} <span className="font-mono">{plane.dims}</span></p>
              <p className={`${isDark ? "text-white/45" : "text-gray-500"} text-[10px]`}>{passLabel(plane.verts)}</p>
            </div>
          </div>
        );
      })}
    </div>
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

  const FL:   V2b = [28,  176];
  const FR:   V2b = [178, 176];
  const Hpx   = 76;
  const dx = 40, dy = -22;

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
      aria-label="Animation of cuboid filling with water">
      <defs>
        <filter id="wBloomB">
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
      <line x1={BkTL[0]} y1={BkTL[1]} x2={BkTR[0]} y2={BkTR[1]}
        stroke="#334155" strokeWidth="1.1" strokeDasharray="4,3"/>

      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="#0f172a" fillOpacity={0.22} stroke="#334155" strokeWidth="0.8"/>
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="#0f172a" fillOpacity={0.15} stroke="#334155" strokeWidth="0.8"/>

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
              fill="#38bdf8" fillOpacity={0.70}/>
          )}
        </>
      )}

      <polyline points={pp(FL, FR, FTR, FTL, FL)}
        fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1={FR[0]} y1={FR[1]} x2={BkR[0]} y2={BkR[1]} stroke="#60a5fa" strokeWidth="1.8"/>
      <line x1={FTR[0]} y1={FTR[1]} x2={BkTR[0]} y2={BkTR[1]} stroke="#60a5fa" strokeWidth="1.8"/>
      <line x1={BkR[0]} y1={BkR[1]} x2={BkTR[0]} y2={BkTR[1]} stroke="#60a5fa" strokeWidth="1.8"/>
      <line x1={BkTL[0]} y1={BkTL[1]} x2={BkTR[0]} y2={BkTR[1]} stroke="#60a5fa" strokeWidth="1.8"/>

      <rect x={barX} y={barY} width={barW} height={barH}
        fill="none" stroke="#475569" strokeWidth="1" rx={2}/>
      <rect x={barX} y={barY + barH - filledH} width={barW} height={filledH}
        fill="#2563eb" fillOpacity={0.8} rx={2}/>
      <text x={barX + barW/2} y={barY - 4} fill="#94a3b8" fontSize="8"
        fontFamily="monospace" textAnchor="middle">V</text>

      <text x="103" y={isFull ? "80" : "78"} fill={isFull?"#38bdf8":isEmpty?"#475569":"#93c5fd"}
        fontSize="15" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloomB)">
        {pct}%
      </text>
      <text x="103" y="238" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloomB)">
        V = p × l × t
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const ExampleCard = ({ ex, idx, prefix, lang }: { ex: Ex; idx: number; prefix: string; lang: string }) => {
  const { isDark } = useTheme();
  const [show, setShow] = useState(false);
  const showLabel = lang === "en" ? "Show Solution" : lang === "ja" ? "解説を見る" : "Lihat Pembahasan";
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
        className={`w-full flex items-center justify-between px-5 py-3 transition-colors cursor-pointer border-t ${isDark ? "bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/50" : "bg-gray-100 hover:bg-gray-200 border-gray-200"}`}>
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? hideLabel : showLabel}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {show && <div className={`px-5 py-4 border-t ${isDark ? "bg-slate-900/60 border-slate-700/30" : "bg-white border-gray-200"}`}>{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const BalokPage = () => {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const { isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const translations = {
    id: {
      subtitle: "Kelas 8 · Bangun Ruang Sisi Datar",
      title: "BALOK",
      back: "← Kembali ke Bangun Ruang Sisi Datar",
      slideOf: "Slide",
      prev: "← Sebelumnya",
      next: "Selanjutnya →",
      easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
      prefixLuas: "LUAS", prefixVol: "VOLUME", prefixKerangka: "KERANGKA",
      imgSrcNote: "Sumber gambar:",
      srcUrl: "https://salamadian.com/benda-berbentuk-balok/",
      netLegend: { front: "Depan/Belakang", side: "Kiri/Kanan", top: "Atas/Bawah" },
    },
    en: {
      subtitle: "Grade 8 · 3D Flat-Faced Solids",
      title: "CUBOID",
      back: "← Back to 3D Flat-Faced Solids",
      slideOf: "Slide",
      prev: "← Previous",
      next: "Next →",
      easy: "EASY", medium: "MEDIUM", hard: "HARD",
      prefixLuas: "SURFACE AREA", prefixVol: "VOLUME", prefixKerangka: "FRAME",
      imgSrcNote: "Image source:",
      srcUrl: "https://salamadian.com/benda-berbentuk-balok/",
      netLegend: { front: "Front/Back", side: "Left/Right", top: "Top/Bottom" },
    },
    ja: {
      subtitle: "中学2年 · 直方体と立方体",
      title: "直方体",
      back: "← 直方体・立方体に戻る",
      slideOf: "スライド",
      prev: "← 前へ",
      next: "次へ →",
      easy: "基本", medium: "標準", hard: "発展",
      prefixLuas: "表面積", prefixVol: "体積", prefixKerangka: "辺の合計",
      imgSrcNote: "画像出典：",
      srcUrl: "https://salamadian.com/benda-berbentuk-balok/",
      netLegend: { front: "前面・背面", side: "左面・右面", top: "上面・下面" },
    },
  };
  const t = translations[lang as keyof typeof translations] ?? translations.id;
  const fl = getFaceLabels(lang);

  /* ── sections ───────────────────────────────────────────── */
  type Sec = { title: string; icon: string; content: React.ReactNode };

  const sideFrontBack  = lang === "en" ? "Front/Back faces" : lang === "ja" ? "前面・背面" : "Sisi depan/belakang";
  const sideTB         = lang === "en" ? "Top/Bottom faces" : lang === "ja" ? "上面・下面" : "Sisi atas/bawah";
  const sideLR         = lang === "en" ? "Left/Right faces" : lang === "ja" ? "左面・右面" : "Sisi kiri/kanan";

  const sections: Sec[] = [
    {
      title: lang === "en" ? "Definition of a Cuboid" : lang === "ja" ? "直方体の定義" : "Definisi Balok",
      icon: "📦",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body leading-relaxed`}>
          <p>
            {lang === "en" ? (
              <>A <strong className="text-cyan-300">cuboid</strong> (rectangular prism) is a 3D solid with 6 rectangular faces. Unlike a cube, a cuboid has <strong className="text-yellow-300">three different dimensions</strong>: length (p), width (l), and height (t).</>
            ) : lang === "ja" ? (
              <>直方体は<strong className="text-cyan-300">6つの長方形の面</strong>を持つ立体図形です。立方体と違い、<strong className="text-yellow-300">縦 (p)・横 (l)・高さ (t) の3辺の長さが異なります</strong>。</>
            ) : (
              <>Balok adalah <strong className="text-cyan-300">bangun ruang sisi datar</strong> yang memiliki 6 sisi berbentuk persegi panjang. Berbeda dari kubus, balok memiliki <strong className="text-yellow-300">tiga ukuran berbeda</strong>: panjang (p), lebar (l), dan tinggi (t).</>
            )}
          </p>
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "📌 Properties of a Cuboid:" : lang === "ja" ? "📌 直方体の性質：" : "📌 Sifat-sifat Balok:"}
            </p>
            <ul className={`space-y-1 text-xs ${isDark ? "text-white/75" : "text-gray-700"}`}>
              {lang === "en" ? (
                <>
                  <li>• Has <strong className="text-yellow-300">6 faces</strong> (all rectangles — 3 pairs of congruent faces)</li>
                  <li>• Has <strong className="text-yellow-300">12 edges</strong> in 3 groups: 4 length (p), 4 width (l), 4 height (t)</li>
                  <li>• Has <strong className="text-yellow-300">8 vertices</strong></li>
                  <li>• Every corner angle is <strong className="text-yellow-300">90°</strong></li>
                  <li>• Length, width, and height <strong className="text-yellow-300">need not be equal</strong></li>
                </>
              ) : lang === "ja" ? (
                <>
                  <li>• <strong className="text-yellow-300">6つの面</strong>（すべて長方形 — 3組の合同な面）</li>
                  <li>• <strong className="text-yellow-300">12本の辺</strong>（3グループ：4本×p、4本×l、4本×t）</li>
                  <li>• <strong className="text-yellow-300">8つの頂点</strong></li>
                  <li>• すべての頂点の角度は<strong className="text-yellow-300">90°</strong></li>
                  <li>• 縦・横・高さは<strong className="text-yellow-300">必ずしも等しくない</strong></li>
                </>
              ) : (
                <>
                  <li>• Memiliki <strong className="text-yellow-300">6 sisi</strong> berbentuk persegi panjang (3 pasang sisi yang sama)</li>
                  <li>• Memiliki <strong className="text-yellow-300">12 rusuk</strong> terdiri dari 3 kelompok: 4 rusuk p, 4 rusuk l, 4 rusuk t</li>
                  <li>• Memiliki <strong className="text-yellow-300">8 titik sudut</strong></li>
                  <li>• Setiap sudut pertemuannya selalu <strong className="text-yellow-300">90°</strong></li>
                  <li>• Panjang, lebar, dan tinggi <strong className="text-yellow-300">tidak harus sama</strong></li>
                </>
              )}
            </ul>
          </div>
          <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
            {lang === "en" ? (
              <>💡 <strong>Cuboid vs Cube:</strong> If p = l = t, the cuboid becomes a cube! A cube is a special case of a cuboid.</>
            ) : lang === "ja" ? (
              <>💡 <strong>直方体 vs 立方体：</strong> p = l = t のとき、直方体は立方体になります！立方体は直方体の特別な場合です。</>
            ) : (
              <>💡 <strong>Balok vs Kubus:</strong> Jika p = l = t, maka balok menjadi kubus! Kubus adalah kasus khusus dari balok.</>
            )}
          </blockquote>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Cuboid Elements (Interactive)" : lang === "ja" ? "直方体の要素（インタラクティブ）" : "Unsur-unsur Balok (Interaktif)",
      icon: "🔍",
      content: (
        <div className={`space-y-5 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body leading-relaxed`}>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-4`}>
            <p className="text-cyan-300 font-semibold mb-2">
              {lang === "en" ? "⬛ Edges (12 edges)" : lang === "ja" ? "⬛ 辺（12本）" : "⬛ Rusuk Balok (12 rusuk)"}
            </p>
            <RusukBalokSVG />
            <div className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"} space-y-1 mt-2`}>
              {lang === "en" ? (
                <>
                  <p>• <strong className="text-cyan-300">4 length edges (p):</strong> parallel along length direction</p>
                  <p>• <strong className="text-orange-300">4 width edges (l):</strong> parallel along width direction</p>
                  <p>• <strong className="text-yellow-300">4 height edges (t):</strong> parallel along height direction</p>
                </>
              ) : lang === "ja" ? (
                <>
                  <p>• <strong className="text-cyan-300">縦 (p) の辺 4本：</strong>縦方向に平行</p>
                  <p>• <strong className="text-orange-300">横 (l) の辺 4本：</strong>横方向に平行</p>
                  <p>• <strong className="text-yellow-300">高さ (t) の辺 4本：</strong>高さ方向に平行</p>
                </>
              ) : (
                <>
                  <p>• <strong className="text-cyan-300">4 rusuk panjang (p):</strong> rusuk sejajar arah panjang</p>
                  <p>• <strong className="text-orange-300">4 rusuk lebar (l):</strong> rusuk sejajar arah lebar</p>
                  <p>• <strong className="text-yellow-300">4 rusuk tinggi (t):</strong> rusuk sejajar arah tinggi</p>
                </>
              )}
              <div className={`${isDark ? "bg-slate-700/60" : "bg-gray-200"} rounded p-2 mt-2`}>
                <BlockMath math="K = 4(p + l + t)" />
              </div>
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-4`}>
            <p className="text-green-300 font-semibold mb-2">
              {lang === "en" ? "⬜ Faces (6 faces, 3 pairs)" : lang === "ja" ? "⬜ 面（6面、3組）" : "⬜ Sisi Balok (6 sisi, 3 pasang)"}
            </p>
            <SisiBalokSVG />
            <div className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"} space-y-1 mt-2`}>
              {lang === "en" ? (
                <>
                  <p>• 2 faces <strong className="text-blue-300">FRONT &amp; BACK</strong>: size p × t</p>
                  <p>• 2 faces <strong className="text-green-300">LEFT &amp; RIGHT</strong>: size l × t</p>
                  <p>• 2 faces <strong className="text-yellow-300">TOP &amp; BOTTOM</strong>: size p × l</p>
                </>
              ) : lang === "ja" ? (
                <>
                  <p>• 前面・背面 各2面：サイズ p × t</p>
                  <p>• 左面・右面 各2面：サイズ l × t</p>
                  <p>• 上面・下面 各2面：サイズ p × l</p>
                </>
              ) : (
                <>
                  <p>• 2 sisi <strong className="text-blue-300">DEPAN &amp; BELAKANG</strong>: berukuran p × t</p>
                  <p>• 2 sisi <strong className="text-green-300">KIRI &amp; KANAN</strong>: berukuran l × t</p>
                  <p>• 2 sisi <strong className="text-yellow-300">ATAS &amp; BAWAH</strong>: berukuran p × l</p>
                </>
              )}
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-4`}>
            <p className="text-yellow-300 font-semibold mb-2">
              {lang === "en" ? "● Vertices (8 vertices)" : lang === "ja" ? "● 頂点（8個）" : "● Titik Sudut (8 titik)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {lang === "en" ? "Each vertex is the meeting point of 3 mutually perpendicular edges. Total: 8 vertices — same as a cube."
               : lang === "ja" ? "各頂点は互いに垂直な3辺の交点です。合計8頂点 — 立方体と同じ数です。"
               : "Setiap sudut balok adalah pertemuan 3 rusuk yang saling tegak lurus. Total 8 titik sudut — sama seperti kubus."}
            </p>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-4`}>
            <p className="text-orange-300 font-semibold mb-2">
              {lang === "en" ? "↗ Face Diagonals (12 diagonals)" : lang === "ja" ? "↗ 面対角線（12本）" : "↗ Diagonal Bidang (12 diagonal)"}
            </p>
            <AllDiagonalBidangBalok lang={lang} />
            <div className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"} space-y-1 mt-2`}>
              <p>• {sideFrontBack}: <InlineMath math="d = \sqrt{p^2 + t^2}" /> (× 4)</p>
              <p>• {sideTB}: <InlineMath math="d = \sqrt{p^2 + l^2}" /> (× 4)</p>
              <p>• {sideLR}: <InlineMath math="d = \sqrt{l^2 + t^2}" /> (× 4)</p>
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-4`}>
            <p className="text-yellow-300 font-semibold mb-2">
              {lang === "en" ? "⟋ Space Diagonals (4 diagonals)" : lang === "ja" ? "⟋ 空間対角線（4本）" : "⟋ Diagonal Ruang (4 diagonal)"}
            </p>
            <AllDiagonalRuangBalok lang={lang} />
            <div className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"} mt-2`}>
              <div className={`${isDark ? "bg-slate-700/60" : "bg-gray-200"} rounded p-2`}>
                <BlockMath math="d_r = \sqrt{p^2 + l^2 + t^2}" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Cuboid Net — Interactive 3D" : lang === "ja" ? "直方体の展開図 — 3Dインタラクティブ" : "Jaring-jaring Balok Interaktif 3D",
      icon: "🔲",
      content: (
        <div className={`space-y-5 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <p>
            {lang === "en" ? (
              <>A <strong className="text-cyan-300">cuboid net</strong> is a 2D shape that folds into a cuboid. Each net consists of 6 rectangles — 3 pairs of different sizes. The <strong className="text-violet-300">BACK (purple)</strong> face is the fixed anchor.</>
            ) : lang === "ja" ? (
              <>直方体の<strong className="text-cyan-300">展開図</strong>は折りたたむと直方体になる2D図形です。6つの長方形（3組のサイズ）で構成されます。<strong className="text-violet-300">背面（紫）</strong>は固定面です。</>
            ) : (
              <>Jaring-jaring balok adalah <strong className="text-cyan-300">bentuk 2D yang jika dilipat akan membentuk balok</strong>. Setiap jaring-jaring balok terdiri dari 6 persegi panjang — 3 pasang ukuran berbeda. Sisi <strong className="text-violet-300">BELAKANG (ungu)</strong> adalah tumpuan tetap.</>
            )}
          </p>
          <InteractiveBalok3D lang={lang} />
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-4`}>
            <p className="text-cyan-300 font-semibold mb-3 text-xs">
              {lang === "en" ? "📐 Example Cuboid Net Patterns:" : lang === "ja" ? "📐 展開図の例：" : "📐 Contoh Pola Jaring-jaring Balok:"}
            </p>
            <NetGallery />
            <div className="mt-3 flex flex-wrap gap-2">
              {(["p×t","l×t","p×l"] as const).map((label, i) => (
                <div key={i} className={`flex items-center gap-1 text-[10px] ${isDark ? "text-white/60" : "text-gray-600"} font-body`}>
                  <div className="w-3 h-3 rounded-sm" style={{ background: ["#8b5cf6","#22c55e","#eab308"][i] }}/>
                  <span>
                    {label === "p×t" ? t.netLegend.front : label === "l×t" ? t.netLegend.side : t.netLegend.top} ({label})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Surface Area of a Cuboid" : lang === "ja" ? "直方体の表面積" : "Luas Permukaan Balok",
      icon: "🎨",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <p>
            {lang === "en" ? (
              <><strong className="text-blue-300">Surface area</strong> is the total area of all 6 faces enclosing the cuboid.</>
            ) : lang === "ja" ? (
              <><strong className="text-blue-300">表面積</strong>は直方体を囲む6面すべての面積の合計です。</>
            ) : (
              <><strong className="text-blue-300">Luas permukaan balok</strong> adalah jumlah luas seluruh 6 sisi yang membungkus balok.</>
            )}
          </p>
          <LuasSVG lang={lang} />
          <div className={`mt-5 ${isDark ? "bg-slate-800/60 border-slate-600/40" : "bg-gray-100 border-gray-200"} border rounded-lg p-4 space-y-2`}>
            <p className={`${isDark ? "text-white/70" : "text-gray-700"} text-xs`}>
              {lang === "en" ? "Sum of 3 pairs of faces:" : lang === "ja" ? "3組の面の面積の合計：" : "Penjumlahan luas 3 pasang sisi:"}
            </p>
            <div className={`${isDark ? "bg-slate-900/60" : "bg-white/90"} rounded p-2 text-xs space-y-1`}>
              <BlockMath math="L = 2(p \times l) + 2(p \times t) + 2(l \times t)" />
              <BlockMath math="L = 2(pl + pt + lt)" />
            </div>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            {lang === "en" ? (
              <>
                <p>🚀 <strong>Remember:</strong> There are 3 pairs of faces. Compute the area of each pair then multiply by 2!</p>
                <p>• p×l faces (top &amp; bottom), p×t faces (front &amp; back), l×t faces (left &amp; right)</p>
              </>
            ) : lang === "ja" ? (
              <>
                <p>🚀 <strong>ポイント：</strong> 3組の面があります。各組の面積を求めて2倍しましょう！</p>
                <p>• p×l（上面・下面）、p×t（前面・背面）、l×t（左面・右面）</p>
              </>
            ) : (
              <>
                <p>🚀 <strong>Ingat:</strong> Ada 3 jenis pasang sisi. Hitung luas masing-masing lalu kalikan 2!</p>
                <p>• Sisi p×l (atas &amp; bawah), sisi p×t (depan &amp; belakang), sisi l×t (kiri &amp; kanan)</p>
              </>
            )}
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs space-y-1`}>
            <p>🎯 <strong className={isDark ? "text-white" : "text-gray-900"}>
              {lang === "en" ? "Units of surface area:" : lang === "ja" ? "表面積の単位：" : "Satuan luas permukaan:"}
            </strong></p>
            <p>• {lang === "en" ? "If p, l, t in cm → area in" : lang === "ja" ? "p, l, t が cm → 面積は" : "Jika p, l, t dalam cm → Luas dalam"} <InlineMath math="\text{cm}^2" /></p>
            <p>• {lang === "en" ? "If p, l, t in m → area in" : lang === "ja" ? "p, l, t が m → 面積は" : "Jika p, l, t dalam m → Luas dalam"} <InlineMath math="\text{m}^2" /></p>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Volume of a Cuboid" : lang === "ja" ? "直方体の体積" : "Volume Balok",
      icon: "📦",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <p>
            {lang === "en" ? (
              <><strong className="text-green-300">Volume</strong> measures how much space the cuboid occupies. Volume = base area × height.</>
            ) : lang === "ja" ? (
              <><strong className="text-green-300">体積</strong>は直方体が占める空間の大きさです。体積 = 底面積 × 高さ。</>
            ) : (
              <><strong className="text-green-300">Volume balok</strong> menyatakan seberapa besar "isi" atau "ruang" yang ditempati balok. Volume = Luas alas × tinggi.</>
            )}
          </p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-xl px-3 pt-2 pb-3`}>
            <p className="text-cyan-300 text-xs font-semibold font-body text-center mb-1">
              {lang === "en" ? "🌊 Cuboid filling with water — empty to full"
               : lang === "ja" ? "🌊 直方体に水を注ぐアニメーション"
               : "🌊 Balok diisi air — dari kosong hingga penuh"}
            </p>
            <WaterBalokAnimation />
            <p className={`${isDark ? "text-white/45" : "text-gray-500"} text-[10px] font-body text-center mt-1`}>
              {lang === "en" ? "Percentage shows the proportion of volume filled relative to total volume"
               : lang === "ja" ? "パーセントは全体積に対する充填割合を示します"
               : "Persentase menunjukkan proporsi volume terisi terhadap volume total"}
            </p>
          </div>
          <div className={`mt-5 ${isDark ? "bg-slate-800/60 border-slate-600/40" : "bg-gray-100 border-gray-200"} border rounded-lg p-4 space-y-2`}>
            <div className={`${isDark ? "bg-slate-900/60" : "bg-white/90"} rounded p-2`}>
              <BlockMath math="V = p \times l \times t" />
            </div>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              • {lang === "en" ? "Volume = base area (p × l) × height (t)" : lang === "ja" ? "体積 = 底面積 (p × l) × 高さ (t)" : "Volume = Luas alas (p × l) × tinggi (t)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              • {lang === "en" ? "Or: Volume = length × width × height" : lang === "ja" ? "または：体積 = 縦 × 横 × 高さ" : "Atau: Volume = panjang × lebar × tinggi"}
            </p>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs space-y-1`}>
            <p>🎯 <strong className={isDark ? "text-white" : "text-gray-900"}>{lang === "en" ? "Volume units:" : lang === "ja" ? "体積の単位：" : "Satuan volume:"}</strong></p>
            <p>• {lang === "en" ? "If p, l, t in cm → volume in" : lang === "ja" ? "p, l, t が cm → 体積は" : "Jika p, l, t dalam cm → Volume dalam"} <InlineMath math="\text{cm}^3" /></p>
            <p>• {lang === "en" ? "If p, l, t in m → volume in" : lang === "ja" ? "p, l, t が m → 体積は" : "Jika p, l, t dalam m → Volume dalam"} <InlineMath math="\text{m}^3" /></p>
            <p>• <InlineMath math="1 \text{ m}^3 = 1{,}000{,}000 \text{ cm}^3" /></p>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Summary — Full Cuboid Formulas" : lang === "ja" ? "まとめ — 直方体の公式一覧" : "Kesimpulan — Rumus Lengkap Balok",
      icon: "📊",
      content: (
        <div className="space-y-3 font-body">
          <div className={`overflow-x-auto rounded-lg border ${isDark ? "border-slate-700" : "border-gray-200"}`}>
            <table className="w-full text-xs text-center">
              <thead>
                <tr className={isDark ? "bg-slate-800" : "bg-gray-100"}>
                  <th className={`px-3 py-2 text-cyan-300 border-r ${isDark ? "border-slate-700" : "border-gray-200"} text-left`}>
                    {lang === "en" ? "Quantity" : lang === "ja" ? "量" : "Besaran"}
                  </th>
                  <th className={`px-3 py-2 text-cyan-300 border-r ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                    {lang === "en" ? "Formula" : lang === "ja" ? "公式" : "Rumus"}
                  </th>
                  <th className="px-3 py-2 text-cyan-300">
                    {lang === "en" ? "Note" : lang === "ja" ? "備考" : "Catatan"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(lang === "en" ? [
                  ["Total edge length","K = 4(p+l+t)","3 groups of edges"],
                  ["Front/back face area","L₁ = p×t","2 faces"],
                  ["Top/bottom face area","L₂ = p×l","2 faces"],
                  ["Left/right face area","L₃ = l×t","2 faces"],
                  ["Surface area","L = 2(pl+pt+lt)","6 faces total"],
                  ["Face diagonal","√(p²+l²), √(p²+t²), √(l²+t²)","3 types"],
                  ["Space diagonal","d = √(p²+l²+t²)","4 diagonals"],
                  ["Volume","V = p×l×t","capacity"],
                ] : lang === "ja" ? [
                  ["辺の合計長","K = 4(p+l+t)","3グループの辺"],
                  ["前面・背面の面積","L₁ = p×t","各2面"],
                  ["上面・下面の面積","L₂ = p×l","各2面"],
                  ["左面・右面の面積","L₃ = l×t","各2面"],
                  ["表面積","L = 2(pl+pt+lt)","合計6面"],
                  ["面対角線","√(p²+l²), √(p²+t²), √(l²+t²)","3種類"],
                  ["空間対角線","d = √(p²+l²+t²)","4本"],
                  ["体積","V = p×l×t","内部空間"],
                ] : [
                  ["Keliling semua rusuk","K = 4(p+l+t)","3 kelompok rusuk"],
                  ["Luas sisi depan/belakang","L₁ = p×t","2 buah"],
                  ["Luas sisi atas/bawah","L₂ = p×l","2 buah"],
                  ["Luas sisi kiri/kanan","L₃ = l×t","2 buah"],
                  ["Luas permukaan","L = 2(pl+pt+lt)","6 sisi total"],
                  ["Diagonal bidang","√(p²+l²), √(p²+t²), √(l²+t²)","3 jenis"],
                  ["Diagonal ruang","d = √(p²+l²+t²)","4 buah"],
                  ["Volume","V = p×l×t","isi balok"],
                ]).map(([b, r, c], i) => (
                  <tr key={i} className={`border-t ${isDark ? "border-slate-700" : "border-gray-200"} ${i % 2 === 0 ? (isDark ? "bg-slate-900/40" : "bg-blue-50/50") : (isDark ? "bg-slate-800/30" : "bg-gray-50")}`}>
                    <td className={`px-3 py-2 ${isDark ? "text-white/90" : "text-gray-800"} font-semibold border-r ${isDark ? "border-slate-700" : "border-gray-200"} text-left`}>{b}</td>
                    <td className={`px-3 py-2 text-yellow-300 font-mono border-r ${isDark ? "border-slate-700" : "border-gray-200"}`}>{r}</td>
                    <td className={`px-3 py-2 ${isDark ? "text-white/55" : "text-gray-500"} text-left`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p>🚀 <strong>
              {lang === "en" ? "Key tip: Always identify" : lang === "ja" ? "重要：まず" : "Kunci utama balok: Selalu identifikasi nilai"}
            </strong> <strong className="text-yellow-300">p, l, {lang === "ja" ? "t" : "dan t"}</strong>{" "}
            {lang === "en" ? "first before calculating!"
             : lang === "ja" ? "を確認してから計算しましょう！"
             : "terlebih dahulu sebelum menghitung!"}</p>
            <p>
              {lang === "en" ? "Knowing p, l, t — you can calculate everything."
               : lang === "ja" ? "p, l, t が分かれば、すべてを計算できます。"
               : "Dengan mengetahui p, l, t — kamu dapat menghitung segalanya."}
            </p>
          </div>
        </div>
      ),
    },
  ];

  /* ── example problems ─────────────────────────────────── */
  const E = t.easy, M = t.medium, H = t.hard;
  const easy_props = { level: E, color: isDark ? "text-green-400" : "text-green-700", bg: isDark ? "bg-green-950/30" : "bg-green-50", border: isDark ? "border-green-700/50" : "border-green-300", badgeBg: isDark ? "bg-green-900/60" : "bg-green-100" };
  const med_props  = { level: M, color: isDark ? "text-yellow-400" : "text-yellow-700", bg: isDark ? "bg-yellow-950/30" : "bg-yellow-50", border: isDark ? "border-yellow-700/50" : "border-yellow-300", badgeBg: isDark ? "bg-yellow-900/60" : "bg-yellow-100" };
  const hard_props = { level: H, color: isDark ? "text-red-400" : "text-red-700", bg: isDark ? "bg-red-950/30" : "bg-red-50", border: isDark ? "border-red-700/50" : "border-red-300", badgeBg: isDark ? "bg-red-900/60" : "bg-red-100" };

  const step1 = lang === "en" ? "Step 1" : lang === "ja" ? "ステップ1" : "Langkah 1";
  const step2 = lang === "en" ? "Step 2" : lang === "ja" ? "ステップ2" : "Langkah 2";
  const step3 = lang === "en" ? "Step 3" : lang === "ja" ? "ステップ3" : "Langkah 3";

  const luasExamples: Ex[] = [
    {
      ...easy_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A gift box (cuboid) has length <InlineMath math="20\text{ cm}" />, width <InlineMath math="15\text{ cm}" />, and height <InlineMath math="10\text{ cm}" />.</p>
              <p>What is the minimum area of wrapping paper needed to cover the entire box?</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>縦 <InlineMath math="20\text{ cm}" />、横 <InlineMath math="15\text{ cm}" />、高さ <InlineMath math="10\text{ cm}" /> の直方体の箱があります。</p>
              <p>箱全体を包むのに必要な最小の紙の面積を求めなさい。</p>
            </>
          ) : (
            <>
              <p>Sebuah kotak kado berbentuk balok dengan panjang <InlineMath math="20\text{ cm}" />, lebar <InlineMath math="15\text{ cm}" />, dan tinggi <InlineMath math="10\text{ cm}" />.</p>
              <p>Berapa luas kertas minimum yang diperlukan untuk membungkus seluruh kotak?</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-2 text-xs`}>
            <p className={isDark ? "text-white/70" : "text-gray-700"}>
              {lang === "en" ? "Given: p = 20 cm, l = 15 cm, t = 10 cm"
               : lang === "ja" ? "p = 20 cm, l = 15 cm, t = 10 cm"
               : "Diketahui: p = 20 cm, l = 15 cm, t = 10 cm"}
            </p>
            <BlockMath math="L = 2(pl + pt + lt)" />
            <BlockMath math="L = 2(20\times15 + 20\times10 + 15\times10)" />
            <BlockMath math="L = 2(300 + 200 + 150) = 2 \times 650 = 1{,}300\text{ cm}^2" />
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-3" : "bg-green-50 border border-green-300 rounded p-3"}>
            <p className={`${isDark ? "text-green-300" : "text-green-700"} font-semibold`}>✅ {lang === "en" ? "Surface area" : lang === "ja" ? "表面積" : "Luas permukaan"} = <InlineMath math="1{,}300\text{ cm}^2" /></p>
          </div>
        </div>
      ),
    },
    {
      ...med_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A cuboid has surface area <InlineMath math="376\text{ cm}^2" />.</p>
              <p>If length = 10 cm and width = 8 cm, find the height and the space diagonal!</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>表面積が <InlineMath math="376\text{ cm}^2" /> の直方体があります。</p>
              <p>縦 = 10 cm、横 = 8 cm のとき、高さと空間対角線を求めなさい。</p>
            </>
          ) : (
            <>
              <p>Sebuah balok memiliki luas permukaan <InlineMath math="376\text{ cm}^2" />.</p>
              <p>Jika panjang = 10 cm dan lebar = 8 cm, tentukan tinggi balok dan panjang diagonal ruangnya!</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-yellow-400 font-semibold text-xs">{step1} — {lang === "en" ? "Find height:" : lang === "ja" ? "高さを求める：" : "Cari tinggi:"}</p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-1 text-xs`}>
            <BlockMath math="376 = 2(10\times8 + 10\times t + 8\times t)" />
            <BlockMath math="188 = 80 + 10t + 8t = 80 + 18t" />
            <BlockMath math="18t = 108 \Rightarrow t = 6\text{ cm}" />
          </div>
          <p className="text-yellow-400 font-semibold text-xs">{step2} — {lang === "en" ? "Space diagonal:" : lang === "ja" ? "空間対角線：" : "Diagonal ruang:"}</p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs`}>
            <BlockMath math="d = \sqrt{10^2 + 8^2 + 6^2} = \sqrt{100+64+36} = \sqrt{200} = 10\sqrt{2} \approx 14{,}14\text{ cm}" />
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs space-y-0.5" : "bg-yellow-50 border border-yellow-300 rounded p-3 text-xs space-y-0.5"}>
            <p className={isDark ? "text-yellow-300" : "text-yellow-700"}>✅ t = 6 cm, d_r = <InlineMath math="10\sqrt{2} \approx 14{,}14\text{ cm}" /></p>
          </div>
        </div>
      ),
    },
    {
      ...hard_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A room (cuboid) measures length 6 m, width 4 m, height 3 m.</p>
              <p>All walls and ceiling are to be painted (floor excluded).</p>
              <p>If 1 can of paint covers <InlineMath math="12\text{ m}^2" /> and costs $8.50 per can, what is the total painting cost?</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>縦6 m、横4 m、高さ3 m の直方体の部屋があります。</p>
              <p>すべての壁と天井をペンキで塗ります（床は除く）。</p>
              <p>1缶のペンキが <InlineMath math="12\text{ m}^2" /> をカバーし、1缶 ¥850 のとき、塗装費の合計を求めなさい。</p>
            </>
          ) : (
            <>
              <p>Sebuah ruangan berbentuk balok berukuran panjang 6 m, lebar 4 m, tinggi 3 m.</p>
              <p>Seluruh dinding dan langit-langit akan dicat (lantai tidak dicat).</p>
              <p>Jika 1 kaleng cat dapat menutup <InlineMath math="12\text{ m}^2" /> dan harga per kaleng <InlineMath math="Rp\,85.000" />, berapa total biaya pengecatan?</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold text-xs">
            {step1} — {lang === "en" ? "Area to paint (excluding floor):" : lang === "ja" ? "塗装面積（床除く）：" : "Luas yang dicat (tanpa lantai):"}
          </p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-1 text-xs`}>
            <p className={isDark ? "text-white/70" : "text-gray-700"}>
              {lang === "en" ? "Full surface area = 2(pl + pt + lt)" : lang === "ja" ? "全表面積 = 2(pl + pt + lt)" : "Luas permukaan penuh = 2(pl + pt + lt)"}
            </p>
            <BlockMath math="L_{\text{full}} = 2(6\times4 + 6\times3 + 4\times3) = 2(24+18+12) = 108\text{ m}^2" />
            <p className={isDark ? "text-white/70" : "text-gray-700"}>
              {lang === "en" ? "Subtract 1 floor (p×l):" : lang === "ja" ? "床1面（p×l）を引く：" : "Kurangi 1 lantai (p×l):"}
            </p>
            <BlockMath math="L_{\text{paint}} = 108 - 6\times4 = 108 - 24 = 84\text{ m}^2" />
          </div>
          <p className="text-red-400 font-semibold text-xs">
            {step2} — {lang === "en" ? "Number of cans & cost:" : lang === "ja" ? "缶数と費用：" : "Jumlah kaleng & biaya:"}
          </p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-1 text-xs`}>
            {lang === "en" ? (
              <>
                <BlockMath math="\text{Cans} = \lceil 84 \div 12 \rceil = 7\text{ cans}" />
                <BlockMath math="\text{Cost} = 7 \times \$8.50 = \$59.50" />
              </>
            ) : lang === "ja" ? (
              <>
                <BlockMath math="\text{缶数} = \lceil 84 \div 12 \rceil = 7\text{ 缶}" />
                <BlockMath math="\text{費用} = 7 \times 850 = ¥5{,}950" />
              </>
            ) : (
              <>
                <BlockMath math="\text{Kaleng} = \lceil 84 \div 12 \rceil = 7\text{ kaleng}" />
                <BlockMath math="\text{Biaya} = 7 \times 85.000 = Rp\,595.000" />
              </>
            )}
          </div>
          <div className={isDark ? "bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5" : "bg-red-50 border border-red-300 rounded p-3 text-xs space-y-0.5"}>
            <p className={`${isDark ? "text-red-300" : "text-red-700"} font-semibold`}>✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え：" : "Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Paint area = 84 m²" : lang === "ja" ? "塗装面積 = 84 m²" : "Luas yang dicat = 84 m²"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Cans needed = 7" : lang === "ja" ? "必要な缶数 = 7缶" : "Kaleng cat = 7 buah"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Total cost = " : lang === "ja" ? "合計費用 = " : "Total biaya = "}<strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>{lang === "en" ? "$59.50" : lang === "ja" ? "¥5,950" : "Rp 595.000"}</strong></p>
          </div>
        </div>
      ),
    },
  ];

  const volExamples: Ex[] = [
    {
      ...easy_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A wardrobe (cuboid) has length <InlineMath math="1.2\text{ m}" />, width <InlineMath math="0.6\text{ m}" />, and height <InlineMath math="2\text{ m}" />.</p>
              <p>Find its volume in <InlineMath math="\text{m}^3" /> and <InlineMath math="\text{cm}^3" />.</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>縦 <InlineMath math="1.2\text{ m}" />、横 <InlineMath math="0.6\text{ m}" />、高さ <InlineMath math="2\text{ m}" /> のタンスがあります。</p>
              <p>体積を <InlineMath math="\text{m}^3" /> と <InlineMath math="\text{cm}^3" /> で求めなさい。</p>
            </>
          ) : (
            <>
              <p>Sebuah lemari berbentuk balok dengan panjang <InlineMath math="1{,}2\text{ m}" />, lebar <InlineMath math="0{,}6\text{ m}" />, dan tinggi <InlineMath math="2\text{ m}" />.</p>
              <p>Berapa volume lemari tersebut dalam <InlineMath math="\text{m}^3" /> dan dalam <InlineMath math="\text{cm}^3" />?</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-2 text-xs`}>
            <BlockMath math="V = p \times l \times t = 1.2 \times 0.6 \times 2 = 1.44\text{ m}^3" />
            <BlockMath math="1.44\text{ m}^3 = 1.44 \times 1{,}000{,}000 = 1{,}440{,}000\text{ cm}^3" />
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-2" : "bg-green-50 border border-green-300 rounded p-2"}>
            <p className={`${isDark ? "text-green-300" : "text-green-700"} font-semibold text-xs`}>✅ V = 1.44 m³ = 1,440,000 cm³</p>
          </div>
        </div>
      ),
    },
    {
      ...med_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A swimming pool (cuboid) measures length 25 m, width 10 m, depth 2 m.</p>
              <p>If the pool is filled to <InlineMath math="80\%" /> capacity, how many liters of water does it hold?</p>
              <p className={`text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>(Note: <InlineMath math="1\text{ m}^3 = 1{,}000\text{ liters}" />)</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>縦25 m、横10 m、深さ2 m のプールがあります。</p>
              <p>容量の <InlineMath math="80\%" /> まで水を満たすと、水の量は何リットルですか？</p>
              <p className={`text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>（<InlineMath math="1\text{ m}^3 = 1{,}000\text{ リットル}" />）</p>
            </>
          ) : (
            <>
              <p>Sebuah kolam renang berbentuk balok berukuran panjang 25 m, lebar 10 m, dan kedalaman 2 m.</p>
              <p>Jika kolam diisi air hingga <InlineMath math="80\%" /> kapasitasnya, berapa liter air di dalamnya?</p>
              <p className={`text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>(Ingat: <InlineMath math="1\text{ m}^3 = 1.000\text{ liter}" />)</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-2 text-xs`}>
            <BlockMath math="V_t = 25 \times 10 \times 2 = 500\text{ m}^3 = 500{,}000\text{ liters}" />
            <BlockMath math="V_{80\%} = 80\% \times 500{,}000 = 400{,}000\text{ liters}" />
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-2" : "bg-yellow-50 border border-yellow-300 rounded p-2"}>
            <p className={`${isDark ? "text-yellow-300" : "text-yellow-700"} font-semibold text-xs`}>✅ {lang === "en" ? "Water volume" : lang === "ja" ? "水の体積" : "Volume air"} = 400,000 {lang === "en" || lang === "ja" ? "liters" : "liter"} = 400 m³</p>
          </div>
        </div>
      ),
    },
    {
      ...hard_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A truck bed (cuboid) measures length 5 m, width 2 m, height 1.5 m.</p>
              <p>The truck carries sand with density <InlineMath math="1{,}600\text{ kg/m}^3" />, filled to the brim.</p>
              <p>If the maximum load is 20 tonnes, is the truck overloaded? By how much?</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>縦5 m、横2 m、高さ1.5 m のトラックの荷台があります。</p>
              <p>密度 <InlineMath math="1{,}600\text{ kg/m}^3" /> の砂を満載しています。</p>
              <p>最大積載量が20トンのとき、過積載かどうか判定し、その差を求めなさい。</p>
            </>
          ) : (
            <>
              <p>Sebuah bak truk berbentuk balok berukuran panjang 5 m, lebar 2 m, dan tinggi 1,5 m.</p>
              <p>Truk mengangkut pasir dengan massa jenis <InlineMath math="1.600\text{ kg/m}^3" /> dan diisi hingga penuh.</p>
              <p>Jika berat maksimum yang boleh dibawa truk adalah 20 ton, apakah truk kelebihan muatan? Berapa kelebihan atau kekurangannya?</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold text-xs">{step1} — {lang === "en" ? "Volume of truck bed:" : lang === "ja" ? "荷台の体積：" : "Volume bak:"}</p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs`}>
            <BlockMath math="V = 5 \times 2 \times 1.5 = 15\text{ m}^3" />
          </div>
          <p className="text-red-400 font-semibold text-xs">{step2} — {lang === "en" ? "Mass of sand:" : lang === "ja" ? "砂の質量：" : "Massa pasir:"}</p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs`}>
            <BlockMath math="m = \rho \times V = 1{,}600 \times 15 = 24{,}000\text{ kg} = 24\text{ t}" />
          </div>
          <p className="text-red-400 font-semibold text-xs">{step3} — {lang === "en" ? "Compare:" : lang === "ja" ? "比較：" : "Bandingkan:"}</p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs`}>
            <BlockMath math="24\text{ t} - 20\text{ t} = 4\text{ t (excess)}" />
          </div>
          <div className={isDark ? "bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5" : "bg-red-50 border border-red-300 rounded p-3 text-xs space-y-0.5"}>
            <p className={`${isDark ? "text-red-300" : "text-red-700"} font-semibold`}>✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え：" : "Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Sand volume = 15 m³" : lang === "ja" ? "砂の体積 = 15 m³" : "Volume pasir = 15 m³"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Sand mass = 24 tonnes" : lang === "ja" ? "砂の質量 = 24トン" : "Massa pasir = 24 ton"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Truck is" : lang === "ja" ? "トラックは" : "Truk"} <strong className={isDark ? "text-red-400" : "text-red-700"}>{lang === "en" ? "overloaded" : lang === "ja" ? "過積載" : "kelebihan muatan"}</strong> {lang === "en" ? "by" : lang === "ja" ? "で" : "sebesar"} <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>4 {lang === "en" ? "tonnes" : lang === "ja" ? "トン" : "ton"}</strong></p>
          </div>
        </div>
      ),
    },
  ];

  const kerangkaExamples: Ex[] = [
    {
      ...easy_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A wire cuboid frame has length <InlineMath math="12\text{ cm}" />, width <InlineMath math="8\text{ cm}" />, and height <InlineMath math="5\text{ cm}" />.</p>
              <p>What is the total length of wire needed?</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>縦 <InlineMath math="12\text{ cm}" />、横 <InlineMath math="8\text{ cm}" />、高さ <InlineMath math="5\text{ cm}" /> の針金で作った直方体の骨組みがあります。</p>
              <p>必要な針金の合計の長さを求めなさい。</p>
            </>
          ) : (
            <>
              <p>Sebuah kerangka balok dibuat dari kawat dengan ukuran panjang <InlineMath math="12\text{ cm}" />, lebar <InlineMath math="8\text{ cm}" />, dan tinggi <InlineMath math="5\text{ cm}" />.</p>
              <p>Berapa total panjang kawat yang diperlukan?</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-1 text-xs`}>
            <BlockMath math="K = 4(p + l + t)" />
            <BlockMath math="K = 4(12 + 8 + 5) = 4 \times 25 = 100\text{ cm}" />
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-2" : "bg-green-50 border border-green-300 rounded p-2"}>
            <p className={`${isDark ? "text-green-300" : "text-green-700"} font-semibold text-xs`}>✅ {lang === "en" ? "Wire length" : lang === "ja" ? "針金の長さ" : "Panjang kawat"} = <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>100 cm</strong></p>
          </div>
        </div>
      ),
    },
    {
      ...med_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A wire cuboid frame uses <InlineMath math="120\text{ cm}" /> of wire.</p>
              <p>Given length <InlineMath math="= 15\text{ cm}" /> and width <InlineMath math="= 8\text{ cm}" />.</p>
              <p>Find the height and the surface area!</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>針金 <InlineMath math="120\text{ cm}" /> で直方体の骨組みを作ります。</p>
              <p>縦 <InlineMath math="= 15\text{ cm}" />、横 <InlineMath math="= 8\text{ cm}" /> のとき、高さと表面積を求めなさい。</p>
            </>
          ) : (
            <>
              <p>Sebuah kerangka balok dibuat dari kawat sepanjang <InlineMath math="120\text{ cm}" />.</p>
              <p>Diketahui panjang <InlineMath math="= 15\text{ cm}" /> dan lebar <InlineMath math="= 8\text{ cm}" />.</p>
              <p>Tentukan tinggi balok dan luas permukaannya!</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-yellow-400 font-semibold text-xs">
            {step1} — {lang === "en" ? "Find height from wire length:" : lang === "ja" ? "針金の長さから高さを求める：" : "Cari tinggi dari panjang kawat:"}
          </p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 space-y-1 text-xs`}>
            <BlockMath math="4(15 + 8 + t) = 120" />
            <BlockMath math="23 + t = 30 \Rightarrow t = 7\text{ cm}" />
          </div>
          <p className="text-yellow-400 font-semibold text-xs">
            {step2} — {lang === "en" ? "Calculate surface area:" : lang === "ja" ? "表面積を計算する：" : "Hitung luas permukaan:"}
          </p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs`}>
            <BlockMath math="L = 2(pl + pt + lt) = 2(15\times8 + 15\times7 + 8\times7)" />
            <BlockMath math="= 2(120 + 105 + 56) = 2 \times 281 = 562\text{ cm}^2" />
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-2 text-xs space-y-0.5" : "bg-yellow-50 border border-yellow-300 rounded p-2 text-xs space-y-0.5"}>
            <p className={`${isDark ? "text-yellow-300" : "text-yellow-700"} font-semibold`}>✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え：" : "Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• t = <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>7 cm</strong></p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• L = <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>562 cm²</strong></p>
          </div>
        </div>
      ),
    },
    {
      ...hard_props,
      question: (
        <div className={`text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body space-y-1`}>
          {lang === "en" ? (
            <>
              <p>A cuboid's length, width, and height are in the ratio <InlineMath math="3 : 2 : 1" />.</p>
              <p>If the total wire length for the frame is <InlineMath math="144\text{ cm}" />, find:</p>
              <p>(a) Length, width, and height</p>
              <p>(b) Surface area and volume</p>
            </>
          ) : lang === "ja" ? (
            <>
              <p>直方体の縦・横・高さの比が <InlineMath math="3 : 2 : 1" /> です。</p>
              <p>骨組みに使う針金の合計が <InlineMath math="144\text{ cm}" /> のとき、次を求めなさい：</p>
              <p>(a) 縦・横・高さ</p>
              <p>(b) 表面積と体積</p>
            </>
          ) : (
            <>
              <p>Ukuran panjang, lebar, dan tinggi sebuah balok berbanding <InlineMath math="3 : 2 : 1" />.</p>
              <p>Jika total panjang kawat untuk kerangkanya adalah <InlineMath math="144\text{ cm}" />, tentukan:</p>
              <p>(a) Panjang, lebar, dan tinggi balok</p>
              <p>(b) Luas permukaan dan volume balok</p>
            </>
          )}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold text-xs">
            {step1} — {lang === "en" ? "Let p=3x, l=2x, t=x:" : lang === "ja" ? "p=3x, l=2x, t=x とおく：" : "Misalkan p=3x, l=2x, t=x:"}
          </p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs`}>
            <BlockMath math="4(3x + 2x + x) = 144" />
            <BlockMath math="4 \times 6x = 144 \Rightarrow 24x = 144 \Rightarrow x = 6" />
          </div>
          <p className="text-red-400 font-semibold text-xs">(a) {lang === "en" ? "Dimensions:" : lang === "ja" ? "寸法：" : "Dimensi balok:"}</p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs space-y-0.5`}>
            <p className={isDark ? "text-white/80" : "text-gray-700"}>• p = 3 × 6 = <strong className="text-yellow-300">18 cm</strong></p>
            <p className={isDark ? "text-white/80" : "text-gray-700"}>• l = 2 × 6 = <strong className="text-yellow-300">12 cm</strong></p>
            <p className={isDark ? "text-white/80" : "text-gray-700"}>• t = 1 × 6 = <strong className="text-yellow-300">6 cm</strong></p>
          </div>
          <p className="text-red-400 font-semibold text-xs">(b) {lang === "en" ? "Surface area and volume:" : lang === "ja" ? "表面積と体積：" : "Luas permukaan dan volume:"}</p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded p-3 text-xs`}>
            <BlockMath math="L = 2(18\times12 + 18\times6 + 12\times6) = 2(216+108+72) = 792\text{ cm}^2" />
            <BlockMath math="V = 18 \times 12 \times 6 = 1{,}296\text{ cm}^3" />
          </div>
          <div className={isDark ? "bg-red-950/60 border border-red-700/40 rounded p-2 text-xs space-y-0.5" : "bg-red-50 border border-red-300 rounded p-2 text-xs space-y-0.5"}>
            <p className={`${isDark ? "text-red-300" : "text-red-700"} font-semibold`}>✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え：" : "Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Dimensions" : lang === "ja" ? "寸法" : "Dimensi"}: <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>18 cm × 12 cm × 6 cm</strong></p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Surface area" : lang === "ja" ? "表面積" : "Luas permukaan"}: <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>792 cm²</strong></p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Volume" : lang === "ja" ? "体積" : "Volume"}: <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>1,296 cm³</strong></p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            💡 <strong>{lang === "en" ? "Check:" : lang === "ja" ? "確認：" : "Cek:"}</strong> <InlineMath math="4(18+12+6) = 4 \times 36 = 144\text{ cm}" /> ✓
          </div>
        </div>
      ),
    },
  ];

  /* ── slides ───────────────────────────────────────────── */
  type Slide = { icon: string; title: string; content: React.ReactNode };

  const objExamples = getObjectExamples(lang);
  const imgSrcLabel = lang === "en" ? "Image source:" : lang === "ja" ? "画像出典：" : "Sumber gambar:";

  const introDesc = lang === "en"
    ? <>From wardrobes to fridges, books, and bricks — cuboids are everywhere! Learn all about <strong className="text-cyan-300">cuboids</strong> — from their elements, interactive 3D nets, to calculating <strong className="text-yellow-300">surface area</strong> and <strong className="text-green-300">volume</strong>.</>
    : lang === "ja"
    ? <>タンスから冷蔵庫、本、レンガまで — 直方体は身の回りにあふれています！<strong className="text-cyan-300">直方体</strong>の要素、インタラクティブ3D展開図、<strong className="text-yellow-300">表面積</strong>・<strong className="text-green-300">体積</strong>の計算法を学びましょう。</>
    : <>Dari lemari hingga kulkas, buku, dan bata — balok ada di mana-mana! Pelajari semua tentang <strong className="text-cyan-300">balok</strong> — mulai dari unsur-unsurnya, jaring-jaring interaktif 3D, hingga cara menghitung <strong className="text-yellow-300">luas permukaan</strong> dan <strong className="text-green-300">volume</strong>-nya.</>;

  const examplesInDailyLife = lang === "en"
    ? "📦 Examples of Cuboid-Shaped Objects in Daily Life"
    : lang === "ja"
    ? "📦 日常生活にある直方体の例"
    : "📦 Contoh Benda Berbentuk Balok dalam Kehidupan Sehari-hari";

  const slides: Slide[] = [
    {
      icon: "🎯",
      title: lang === "en" ? "Introduction" : lang === "ja" ? "はじめに" : "Pengantar",
      content: (
        <div className="space-y-4 font-body">
          <SimpleRotatingBalok lang={lang} />
          <div className={`bg-card/60 border border-border rounded-xl p-4 text-sm ${isDark ? "text-white/75" : "text-gray-700"} leading-relaxed`}>
            <p>{introDesc}</p>
          </div>
          <div className={`${isDark ? "bg-slate-800/50 border-slate-600/40" : "bg-white/80 border-gray-200"} border rounded-xl p-3`}>
            <p className="text-xs text-cyan-300 font-semibold mb-2 text-center">{examplesInDailyLife}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {objExamples.map(({ src, label }) => (
                <div key={label} className={`flex flex-col items-center gap-1 ${isDark ? "bg-slate-900/40 border-slate-600/30" : "bg-gray-50 border-gray-200"} rounded-lg border p-2`}>
                  <div className="w-full h-20 rounded-md overflow-hidden bg-white flex items-center justify-center">
                    <img src={src} alt={`${label}`} className="w-full h-full object-contain" />
                  </div>
                  <span className={`text-[10px] ${isDark ? "text-white/65" : "text-gray-600"} text-center leading-tight`}>{label}</span>
                </div>
              ))}
            </div>
            <p className={`mt-2 text-[10px] ${isDark ? "text-white/45" : "text-gray-500"} text-center`}>
              {imgSrcLabel}{" "}
              <a href="https://salamadian.com/benda-berbentuk-balok/" target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">
                https://salamadian.com/benda-berbentuk-balok/
              </a>
            </p>
          </div>
        </div>
      ),
    },
    { icon: "📦", title: sections[0].title, content: sections[0].content },
    {
      icon: "📏",
      title: lang === "en" ? "Cuboid Elements — Edges" : lang === "ja" ? "直方体の要素 — 辺" : "Unsur Balok — Rusuk",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">
              ① {lang === "en" ? "Edges (12 total)" : lang === "ja" ? "辺（12本）" : "Rusuk (12 buah)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {lang === "en" ? <>An edge is a <strong>line segment where two faces meet</strong>. Cuboid <strong className="text-cyan-300">ABCD.EFGH</strong> has 3 groups of edges with different lengths: <InlineMath math="p,\ l,\ t" />.</>
               : lang === "ja" ? <>辺は<strong>2面が交わる線分</strong>です。<strong className="text-cyan-300">ABCD.EFGH</strong>には長さが異なる3グループの辺があります：<InlineMath math="p,\ l,\ t" />。</>
               : <>Rusuk adalah <strong>ruas garis pertemuan dua sisi</strong>. Balok <strong className="text-cyan-300">ABCD.EFGH</strong> memiliki 3 kelompok rusuk berbeda panjang: <InlineMath math="p,\ l,\ t" />.</>}
            </p>
            <RusukBalokSVG />
          </div>
          <div className="bg-cyan-950/30 border border-cyan-700/40 rounded-lg p-3 space-y-3">
            <p className="text-xs text-cyan-200 font-semibold">
              {lang === "en" ? "12 edges of cuboid ABCD.EFGH:"
               : lang === "ja" ? "直方体 ABCD.EFGH の12辺："
               : "Penamaan 12 rusuk pada balok ABCD.EFGH:"}
            </p>
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <div className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-3`}>
                <p className="text-cyan-300 font-semibold mb-1">{lang === "en" ? "4 Length Edges (p)" : lang === "ja" ? "縦の辺4本 (p)" : "4 Rusuk Panjang (p)"}</p>
                <p className={isDark ? "text-white/75" : "text-gray-700"}>AB, CD, EF, GH</p>
              </div>
              <div className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-3`}>
                <p className="text-orange-300 font-semibold mb-1">{lang === "en" ? "4 Width Edges (l)" : lang === "ja" ? "横の辺4本 (l)" : "4 Rusuk Lebar (l)"}</p>
                <p className={isDark ? "text-white/75" : "text-gray-700"}>BC, AD, FG, EH</p>
              </div>
              <div className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-3`}>
                <p className="text-yellow-300 font-semibold mb-1">{lang === "en" ? "4 Height Edges (t)" : lang === "ja" ? "高さの辺4本 (t)" : "4 Rusuk Tinggi (t)"}</p>
                <p className={isDark ? "text-white/75" : "text-gray-700"}>AE, BF, CG, DH</p>
              </div>
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs`}>
            <p>🔑 <strong className="text-cyan-300">{lang === "en" ? "Total edges = 12" : lang === "ja" ? "辺の合計 = 12" : "Jumlah rusuk = 12"}</strong>. {lang === "en" ? "Wire frame:" : lang === "ja" ? "骨組み：" : "Kerangka balok:"} <InlineMath math="K = 4(p + l + t)" /></p>
          </div>
        </div>
      ),
    },
    {
      icon: "🟦",
      title: lang === "en" ? "Cuboid Elements — Faces" : lang === "ja" ? "直方体の要素 — 面" : "Unsur Balok — Sisi / Bidang",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <div className="bg-blue-950/40 border border-blue-700/40 rounded-lg p-4 space-y-2">
            <p className="text-blue-300 font-semibold">
              ② {lang === "en" ? "Faces (6 faces — 3 pairs)" : lang === "ja" ? "面（6面 — 3組）" : "Sisi / Bidang (6 buah — 3 pasang)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {lang === "en" ? <>A face is a <strong>flat surface bounding</strong> the cuboid. Each pair of opposite faces is congruent and parallel.</>
               : lang === "ja" ? <>面は直方体を<strong>囲む平面</strong>です。向き合う面の各ペアは合同で平行です。</>
               : <>Sisi adalah <strong>bidang yang membatasi</strong> balok. Setiap pasang sisi berhadapan memiliki ukuran dan bentuk yang sama.</>}
            </p>
            <SisiBalokSVG />
          </div>
          <div className="bg-blue-950/30 border border-blue-700/40 rounded-lg p-3 space-y-2">
            <p className="text-xs text-blue-200 font-semibold">
              {lang === "en" ? "6 faces of cuboid ABCD.EFGH:" : lang === "ja" ? "直方体 ABCD.EFGH の6面：" : "6 Sisi pada balok ABCD.EFGH:"}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                [fl.front, "ABFE", "p × t"],
                [fl.back, "DCGH", "p × t"],
                [fl.left, "ADHE", "l × t"],
                [fl.right, "BCGF", "l × t"],
                [fl.top, "EFGH", "p × l"],
                [lang === "en" ? "Bottom (Base)" : lang === "ja" ? "下面（底面）" : "Bawah (Alas)", "ABCD", "p × l"],
              ].map(([name, verts, dim]) => (
                <div key={verts} className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-3`}>
                  <p className="text-blue-300 font-semibold mb-1">{name}</p>
                  <p className={isDark ? "text-white/75" : "text-gray-700"}>{verts} &nbsp;({dim})</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs`}>
            <p>🔑 <strong className="text-blue-300">{lang === "en" ? "3 pairs of faces" : lang === "ja" ? "3組の面" : "3 pasang sisi"}</strong> → {lang === "en" ? "each pair congruent & parallel. Total area" : lang === "ja" ? "各ペアは合同で平行。合計面積" : "tiap pasang kongruen dan sejajar. Luas total"} = <InlineMath math="2(pl+pt+lt)" /></p>
          </div>
        </div>
      ),
    },
    {
      icon: "🔷",
      title: lang === "en" ? "Cuboid Elements — Vertices" : lang === "ja" ? "直方体の要素 — 頂点" : "Unsur Balok — Titik Sudut",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-4 space-y-2">
            <p className="text-yellow-300 font-semibold">
              ③ {lang === "en" ? "Vertices (8 vertices)" : lang === "ja" ? "頂点（8個）" : "Titik Sudut (8 buah)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {lang === "en" ? <>A vertex is the <strong>meeting point of three mutually perpendicular edges</strong>.</>
               : lang === "ja" ? <>頂点は<strong>互いに垂直な3辺が交わる点</strong>です。</>
               : <>Titik sudut adalah <strong>titik pertemuan tiga rusuk</strong> yang saling tegak lurus.</>}
            </p>
            <TitikSudutBalokSVG />
          </div>
          <div className="bg-yellow-950/30 border border-yellow-700/40 rounded-lg p-3 space-y-2">
            <p className="text-xs text-yellow-200 font-semibold">
              {lang === "en" ? "8 vertices of cuboid ABCD.EFGH:" : lang === "ja" ? "直方体 ABCD.EFGH の8頂点：" : "8 Titik Sudut pada balok ABCD.EFGH:"}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(lang === "en" ? [
                ["A","Bottom — front-left"],["B","Bottom — front-right"],
                ["C","Bottom — back-right"],["D","Bottom — back-left"],
                ["E","Top — front-left"],["F","Top — front-right"],
                ["G","Top — back-right"],["H","Top — back-left"],
              ] : lang === "ja" ? [
                ["A","下 — 前左"],["B","下 — 前右"],
                ["C","下 — 後右"],["D","下 — 後左"],
                ["E","上 — 前左"],["F","上 — 前右"],
                ["G","上 — 後右"],["H","上 — 後左"],
              ] : [
                ["A","Alas — depan kiri"],["B","Alas — depan kanan"],
                ["C","Alas — belakang kanan"],["D","Alas — belakang kiri"],
                ["E","Atas — depan kiri"],["F","Atas — depan kanan"],
                ["G","Atas — belakang kanan"],["H","Atas — belakang kiri"],
              ]).map(([v,desc])=>(
                <div key={v} className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-2`}>
                  <p className="text-yellow-300 font-semibold mb-0.5">{lang === "en" ? "Vertex" : lang === "ja" ? "頂点" : "Titik"} {v}</p>
                  <p className={isDark ? "text-white/65" : "text-gray-600"}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs`}>
            <p>🔑 <strong className="text-yellow-300">
              {lang === "en" ? "Total vertices = 8" : lang === "ja" ? "頂点の合計 = 8" : "Jumlah titik sudut = 8"}
            </strong>{lang === "en" ? ", each vertex is the meeting of 3 mutually perpendicular edges."
              : lang === "ja" ? "、各頂点は互いに垂直な3辺の交点です。"
              : ", setiap titik merupakan pertemuan tiga rusuk saling tegak lurus."}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "📐",
      title: lang === "en" ? "Cuboid Elements — Face Diagonals" : lang === "ja" ? "直方体の要素 — 面対角線" : "Unsur Balok — Diagonal Bidang",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <div className="bg-orange-950/40 border border-orange-700/40 rounded-lg p-4 space-y-2">
            <p className="text-orange-300 font-semibold">
              ④ {lang === "en" ? "Face Diagonals (12 total — 3 types)" : lang === "ja" ? "面対角線（12本 — 3種類）" : "Diagonal Bidang (12 buah — 3 jenis)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {lang === "en" ? <>A face diagonal connects two opposite vertices within <strong>one face</strong>. There are 3 types of faces, hence 3 formula types. Each cuboid below shows <strong>one face diagonal</strong>:</>
               : lang === "ja" ? <>面対角線は<strong>1つの面の中</strong>で2つの対角頂点を結びます。3種類の面があるため、3種類の公式があります：</>
               : <>Diagonal bidang menghubungkan dua titik sudut berhadapan dalam <strong>satu sisi</strong>. Karena ada 3 jenis sisi, ada 3 jenis rumus. Setiap balok di bawah menampilkan <strong>satu diagonal bidang</strong>:</>}
            </p>
            <AllDiagonalBidangBalok lang={lang} />
          </div>
          <div className="bg-orange-950/30 border border-orange-700/40 rounded-lg p-3 space-y-2">
            <p className="text-xs text-orange-200 font-semibold">
              {lang === "en" ? "Face diagonal formulas (Pythagoras):" : lang === "ja" ? "面対角線の公式（ピタゴラス）：" : "Rumus diagonal bidang (Pythagoras):"}
            </p>
            <div className="grid gap-2 text-xs">
              <div className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-3`}>
                <p className="text-blue-300 font-semibold mb-1">{sideFrontBack} (p × t) — 4</p>
                <BlockMath math="d_1 = \sqrt{p^2 + t^2}" />
              </div>
              <div className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-3`}>
                <p className="text-yellow-300 font-semibold mb-1">{sideTB} (p × l) — 4</p>
                <BlockMath math="d_2 = \sqrt{p^2 + l^2}" />
              </div>
              <div className={`rounded-lg ${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border p-3`}>
                <p className="text-green-300 font-semibold mb-1">{sideLR} (l × t) — 4</p>
                <BlockMath math="d_3 = \sqrt{l^2 + t^2}" />
              </div>
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs`}>
            <p>🔑 <strong className="text-orange-300">{lang === "en" ? "Total face diagonals = 12" : lang === "ja" ? "面対角線の合計 = 12" : "Total diagonal bidang = 12"}</strong> ({lang === "en" ? "2 diagonals per face × 6 faces" : lang === "ja" ? "各面2本 × 6面" : "setiap sisi memiliki 2 diagonal × 6 sisi"}).</p>
          </div>
        </div>
      ),
    },
    {
      icon: "🔀",
      title: lang === "en" ? "Cuboid Elements — Space Diagonals" : lang === "ja" ? "直方体の要素 — 空間対角線" : "Unsur Balok — Diagonal Ruang",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-4 space-y-2">
            <p className="text-yellow-300 font-semibold">
              ⑤ {lang === "en" ? "Space Diagonals (4 total)" : lang === "ja" ? "空間対角線（4本）" : "Diagonal Ruang (4 buah)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {lang === "en" ? <>A space diagonal connects two opposite vertices and <strong>passes through the interior</strong>. All 4 space diagonals of a cuboid have equal length.</>
               : lang === "ja" ? <>空間対角線は2つの対角頂点を結び、<strong>立体の内部を通ります</strong>。直方体の4本の空間対角線はすべて等しい長さです。</>
               : <>Diagonal ruang menghubungkan dua titik sudut berhadapan dan <strong>melewati bagian dalam balok</strong>. Semua 4 diagonal ruang pada balok memiliki panjang yang sama.</>}
            </p>
            <AllDiagonalRuangBalok lang={lang} />
            <div className="bg-yellow-950/60 rounded p-2 text-center">
              <BlockMath math="d_r = \sqrt{p^2 + l^2 + t^2}" />
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-900/70 border-amber-600/40" : "bg-white/90 border-amber-300/40"} border rounded-lg p-4 space-y-3`}>
            <p className="text-amber-300 font-semibold text-xs">
              📐 {lang === "en" ? "Proof using 2-step Pythagoras:" : lang === "ja" ? "2段階ピタゴラスによる証明：" : "Pembuktian dengan 2 langkah Pythagoras:"}
            </p>
            <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40" : "bg-gray-100 border-gray-200"} border rounded-lg p-3 space-y-2 text-xs`}>
              <p className={`${isDark ? "text-white/80" : "text-gray-700"} font-semibold`}>
                {lang === "en" ? "Example: find AG in cuboid ABCD.EFGH"
                 : lang === "ja" ? "例：直方体 ABCD.EFGH の AG を求める"
                 : "Contoh: cari AG pada balok ABCD.EFGH"}
              </p>
              <div className={`space-y-1 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                <p><strong className="text-orange-400">{lang === "en" ? "Phase 1" : lang === "ja" ? "段階1" : "Tahap 1"}</strong> — {lang === "en" ? "Base face diagonal AC:" : lang === "ja" ? "底面の対角線 AC：" : "Diagonal bidang alas AC:"}</p>
              </div>
              <div className={`${isDark ? "bg-slate-900/60" : "bg-white/90"} rounded p-2 text-center`}>
                <BlockMath math="AC = \sqrt{p^2 + l^2}"/>
              </div>
              <div className={`space-y-1 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                <p><strong className="text-purple-400">{lang === "en" ? "Phase 2" : lang === "ja" ? "段階2" : "Tahap 2"}</strong> — {lang === "en" ? "Space diagonal AG (right angle at C):" : lang === "ja" ? "空間対角線 AG（Cで直角）：" : "Diagonal ruang AG (siku-siku di C):"}</p>
              </div>
              <div className={`${isDark ? "bg-slate-900/60" : "bg-white/90"} rounded p-2 text-center`}>
                <BlockMath math="AG^2 = AC^2 + CG^2 = (p^2+l^2) + t^2"/>
                <BlockMath math="\boxed{AG = \sqrt{p^2 + l^2 + t^2}}"/>
              </div>
              <p className="text-amber-300 text-xs">
                ∴ {lang === "en" ? "Applies to all 4 space diagonals." : lang === "ja" ? "4本すべての空間対角線に適用されます。" : "Berlaku untuk semua 4 diagonal ruang balok."}
              </p>
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs`}>
            <p>💡 <strong className="text-orange-300">{lang === "en" ? "Face Diagonal" : lang === "ja" ? "面対角線" : "Diagonal Bidang"}</strong> = 2D ({lang === "en" ? "within one face" : lang === "ja" ? "1面の中" : "dalam satu sisi"}) · <strong className="text-yellow-300">{lang === "en" ? "Space Diagonal" : lang === "ja" ? "空間対角線" : "Diagonal Ruang"}</strong> = 3D ({lang === "en" ? "through the solid" : lang === "ja" ? "立体を貫通" : "menembus balok"})</p>
          </div>
        </div>
      ),
    },
    {
      icon: "🔲",
      title: lang === "en" ? "Cuboid Elements — Diagonal Planes" : lang === "ja" ? "直方体の要素 — 対角面" : "Unsur Balok — Bidang Diagonal",
      content: (
        <div className={`space-y-3 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-4 space-y-2">
            <p className="text-violet-300 font-semibold">
              ⑥ {lang === "en" ? "Diagonal Planes (6 total — 3 types)" : lang === "ja" ? "対角面（6面 — 3種類）" : "Bidang Diagonal (6 buah — 3 jenis)"}
            </p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {lang === "en" ? <>A diagonal plane passes through <strong>4 vertices and 2 space diagonals</strong>. Each diagonal plane is a <strong>rectangle</strong>. There are 3 types:</>
               : lang === "ja" ? <>対角面は<strong>4頂点と2本の空間対角線</strong>を通ります。各対角面は<strong>長方形</strong>です。3種類あります：</>
               : <>Bidang diagonal melewati <strong>4 titik sudut dan 2 diagonal ruang</strong> balok. Setiap bidang diagonal berbentuk <strong>persegi panjang</strong>. Karena ada 3 arah irisan, ada 3 jenis rumus luas:</>}
            </p>
          </div>
          <BidangDiagonalBalokSVG lang={lang} />
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs space-y-1`}>
            <p>🔑 <strong className="text-violet-300">{lang === "en" ? "Total diagonal planes = 6" : lang === "ja" ? "対角面の合計 = 6" : "Total bidang diagonal = 6"}</strong> (3 {lang === "en" ? "types × 2 planes each" : lang === "ja" ? "種類 × 2面" : "jenis × 2 bidang per jenis"}).</p>
            <p>
              {lang === "en" ? "Unlike a cube (all diagonal planes congruent), a cuboid has 3 different diagonal plane sizes."
               : lang === "ja" ? "立方体（対角面すべて合同）と異なり、直方体の対角面は3種類の大きさがあります。"
               : "Berbeda dengan kubus yang semua bidang diagonalnya kongruen, bidang diagonal balok memiliki 3 ukuran berbeda."}
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: "🧊",
      title: lang === "en" ? "Cuboid Net — 3D Interactive" : lang === "ja" ? "直方体の展開図 — 3Dインタラクティブ" : "Jaring-jaring Balok — 3D Interaktif",
      content: (
        <div className={`space-y-4 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body leading-relaxed`}>
          <p>
            {lang === "en" ? (
              <><strong className="text-cyan-300">A cuboid net</strong> is a 2D pattern that folds into a cuboid. Each net consists of <strong>6 rectangles in 3 pairs of sizes</strong>. The <strong className="text-violet-300">BACK (purple)</strong> face is the fixed anchor.</>
            ) : lang === "ja" ? (
              <>直方体の<strong className="text-cyan-300">展開図</strong>は折りたたむと直方体になる2D図形です。<strong>3組のサイズの6つの長方形</strong>で構成されます。<strong className="text-violet-300">背面（紫）</strong>は固定面です。</>
            ) : (
              <><strong className="text-cyan-300">Jaring-jaring balok</strong> adalah pola 2D yang jika dilipat akan membentuk balok. Setiap jaring terdiri dari <strong>6 persegi panjang dalam 3 pasang ukuran</strong>. Sisi <strong className="text-violet-300">BELAKANG (ungu)</strong> adalah tumpuan tetap.</>
            )}
          </p>
          <InteractiveBalok3D lang={lang} />
        </div>
      ),
    },
    {
      icon: "🗂️",
      title: lang === "en" ? "Net Pattern Examples" : lang === "ja" ? "展開図パターンの例" : "Contoh Pola Jaring-jaring Balok",
      content: (
        <div className={`space-y-4 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <p className={`${isDark ? "text-white/70" : "text-gray-700"} text-xs text-center`}>
            {lang === "en" ? <>There are <strong className="text-yellow-300">54 valid net patterns</strong> for a cuboid:</>
             : lang === "ja" ? <>直方体には<strong className="text-yellow-300">54種類の有効な展開図</strong>があります：</>
             : <>Ada <strong className="text-yellow-300">54 pola jaring-jaring</strong> berbeda yang valid untuk sebuah balok:</>}
          </p>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-4`}>
            <p className="text-cyan-300 font-semibold mb-3 text-xs">
              📐 {lang === "en" ? "Example 10 Net Patterns:" : lang === "ja" ? "10種類の展開図の例：" : "Contoh 10 Pola Jaring-jaring Balok:"}
            </p>
            <NetGallery />
            <div className="mt-3 flex flex-wrap gap-2">
              {(["p×t","l×t","p×l"] as const).map((label, i) => (
                <div key={i} className={`flex items-center gap-1 text-[10px] ${isDark ? "text-white/60" : "text-gray-600"} font-body`}>
                  <div className="w-3 h-3 rounded-sm" style={{ background: ["#8b5cf6","#22c55e","#eab308"][i] }}/>
                  <span>{label === "p×t" ? t.netLegend.front : label === "l×t" ? t.netLegend.side : t.netLegend.top} ({label})</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`${isDark ? "bg-slate-800/60 border-slate-600/40 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-600"} border rounded-lg p-3 text-xs`}>
            <p>🔑 <strong className={isDark ? "text-white" : "text-gray-900"}>{lang === "en" ? "How to verify:" : lang === "ja" ? "確認方法：" : "Cara verifikasi:"}</strong> {lang === "en" ? "Mentally fold. If 6 faces cover all cuboid surfaces without overlap → valid net." : lang === "ja" ? "頭の中で折る。6面が重なりなく直方体の全面を覆えば→有効な展開図。" : "Bayangkan melipat. Jika 6 sisi menutup semua permukaan balok tanpa tumpang tindih → jaring-jaring valid."}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "🪡",
      title: lang === "en" ? "Cuboid Frame — Explode 12 Edges" : lang === "ja" ? "直方体の骨組み — 12辺を分解" : "Kerangka Balok — Bongkar 12 Rusuk",
      content: (
        <div className="space-y-4">
          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-2`}>
            <p className="text-cyan-300 font-semibold text-sm font-display">
              🪡 {lang === "en" ? "Cuboid Frame" : lang === "ja" ? "直方体の骨組み" : "Kerangka Balok"}
            </p>
            <p className={`${isDark ? "text-white/70" : "text-gray-700"} text-xs font-body leading-relaxed`}>
              {lang === "en" ? (
                <>Explode the frame to see all <strong className={isDark ? "text-white" : "text-gray-900"}>12 edges</strong> in 3 groups: <strong className="text-cyan-300">4 length (p)</strong>, <strong className="text-orange-300">4 width (l)</strong>, and <strong className="text-yellow-300">4 height (t)</strong>. Total frame length = <strong className="text-yellow-300">4(p + l + t)</strong>.</>
              ) : lang === "ja" ? (
                <>骨組みを分解して<strong className={isDark ? "text-white" : "text-gray-900"}>12本の辺</strong>を3グループで見てみましょう：<strong className="text-cyan-300">縦4本 (p)</strong>、<strong className="text-orange-300">横4本 (l)</strong>、<strong className="text-yellow-300">高さ4本 (t)</strong>。骨組みの合計長 = <strong className="text-yellow-300">4(p + l + t)</strong>。</>
              ) : (
                <>Mari bongkar kerangka balok untuk melihat <strong className={isDark ? "text-white" : "text-gray-900"}>12 rusuk</strong>{" "}yang terbagi dalam 3 kelompok:{" "}<strong className="text-cyan-300">4 panjang (p)</strong>,{" "}<strong className="text-orange-300">4 lebar (l)</strong>, dan{" "}<strong className="text-yellow-300">4 tinggi (t)</strong>. Sehingga total panjang kerangka = <strong className="text-yellow-300">4(p + l + t)</strong>.</>
              )}
            </p>
          </div>
          <InteractiveKerangkaBalok lang={lang} />
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p>🚀 <strong>{lang === "en" ? "Remember:" : lang === "ja" ? "覚えよう：" : "Ingat:"}</strong> {lang === "en"
              ? <>Unlike a cube (all edges equal, <InlineMath math="K = 12s" />), a cuboid has 3 different edge lengths, so <InlineMath math="K = 4(p + l + t)" />.</>
              : lang === "ja"
              ? <>立方体（辺がすべて等しく <InlineMath math="K = 12s" />）と違い、直方体は3種類の辺の長さがあるため、 <InlineMath math="K = 4(p + l + t)" />。</>
              : <>Berbeda dengan kubus yang semua rusuknya sama panjang (<InlineMath math="K = 12s" />), balok memiliki 3 ukuran rusuk berbeda sehingga <InlineMath math="K = 4(p + l + t)" />.</>}</p>
            <p>{lang === "en" ? <>Example: if <InlineMath math="p = 8, l = 5, t = 4" /> cm, then <InlineMath math="K = 4(8+5+4) = 68\text{ cm}" />.</>
              : lang === "ja" ? <><InlineMath math="p = 8, l = 5, t = 4" /> cm のとき、<InlineMath math="K = 4(8+5+4) = 68\text{ cm}" />。</>
              : <>Contoh: jika <InlineMath math="p = 8, l = 5, t = 4" /> cm, maka <InlineMath math="K = 4(8+5+4) = 68\text{ cm}" />.</>}</p>
          </div>
        </div>
      ),
    },
    { icon: "🎨", title: sections[3].title, content: sections[3].content },
    { icon: "📦", title: sections[4].title, content: sections[4].content },
    {
      icon: "📋",
      title: lang === "en" ? "Full Formula Summary" : lang === "ja" ? "公式まとめ" : "Rangkuman Lengkap Rumus Balok",
      content: (
        <div className={`space-y-4 text-sm ${isDark ? "text-white/85" : "text-gray-800"} font-body`}>
          <div className="bg-gradient-to-r from-cyan-950/60 to-violet-950/60 border border-cyan-700/40 rounded-xl p-4">
            <p className="text-cyan-300 font-display font-bold text-sm mb-1">
              📋 {lang === "en" ? "All Cuboid Formulas" : lang === "ja" ? "直方体の全公式" : "Ringkasan Semua Rumus Balok"}
            </p>
            <p className={`${isDark ? "text-white/70" : "text-gray-700"} text-xs leading-relaxed`}>
              {lang === "en" ? "Where" : lang === "ja" ? "ここで"  : "Dengan"} <InlineMath math="p" /> = {lang === "en" ? "length" : lang === "ja" ? "縦" : "panjang"}, <InlineMath math="l" /> = {lang === "en" ? "width" : lang === "ja" ? "横" : "lebar"}, {lang === "en" ? "and" : lang === "ja" ? "," : "dan"} <InlineMath math="t" /> = {lang === "en" ? "height" : lang === "ja" ? "高さ" : "tinggi"}.
            </p>
          </div>

          <div className={`${isDark ? "bg-slate-800/60 border-slate-700" : "bg-gray-100 border-gray-200"} border rounded-lg p-3`}>
            <p className="text-yellow-300 font-display font-bold text-xs mb-2">
              🔢 {lang === "en" ? "Cuboid Elements" : lang === "ja" ? "直方体の要素数" : "Unsur-Unsur Balok"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              {(lang === "en" ? [
                ["Faces","6"],["Edges","12"],["Vertices","8"],
                ["Face diagonals","12"],["Space diagonals","4"],["Diagonal planes","6"],
              ] : lang === "ja" ? [
                ["面","6"],["辺","12"],["頂点","8"],
                ["面対角線","12"],["空間対角線","4"],["対角面","6"],
              ] : [
                ["Sisi","6"],["Rusuk","12"],["Titik sudut","8"],
                ["Diagonal bidang","12"],["Diagonal ruang","4"],["Bidang diagonal","6"],
              ]).map(([n, v], i) => (
                <div key={i} className={`${isDark ? "bg-slate-900/60 border-slate-700/60" : "bg-white/90 border-gray-200"} border rounded p-2 flex items-center justify-between`}>
                  <span className={isDark ? "text-white/70" : "text-gray-700"}>{n}</span>
                  <span className="text-cyan-300 font-bold font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`overflow-x-auto rounded-lg border ${isDark ? "border-slate-700" : "border-gray-200"}`}>
            <table className="w-full text-[11px]">
              <thead>
                <tr className={isDark ? "bg-slate-800" : "bg-gray-100"}>
                  <th className={`px-2 py-2 text-cyan-300 border-r ${isDark ? "border-slate-700" : "border-gray-200"} text-left`}>
                    {lang === "en" ? "Quantity" : lang === "ja" ? "量" : "Besaran"}
                  </th>
                  <th className={`px-2 py-2 text-cyan-300 border-r ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                    {lang === "en" ? "Formula" : lang === "ja" ? "公式" : "Rumus"}
                  </th>
                  <th className="px-2 py-2 text-cyan-300 text-left">
                    {lang === "en" ? "Note" : lang === "ja" ? "備考" : "Keterangan"}
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  ["V = p \\times l \\times t", lang === "en" ? "volume" : lang === "ja" ? "体積" : "isi balok", lang === "en" ? "Volume" : lang === "ja" ? "体積" : "Volume"],
                  ["L = 2(pl + pt + lt)", lang === "en" ? "6 faces, 3 pairs" : lang === "ja" ? "6面、3組" : "6 sisi, 3 pasang", lang === "en" ? "Surface area" : lang === "ja" ? "表面積" : "Luas permukaan"],
                  ["K = 4(p + l + t)", lang === "en" ? "12 edges" : lang === "ja" ? "12辺" : "12 rusuk", lang === "en" ? "Frame" : lang === "ja" ? "骨組み" : "Kerangka"],
                  ["d_1 = \\sqrt{p^2 + t^2}", lang === "en" ? "4 face diags" : lang === "ja" ? "4本" : "4 buah", lang === "en" ? "Face diag. front/back" : lang === "ja" ? "前・背面の面対角線" : "Diagonal bidang depan/belakang"],
                  ["d_2 = \\sqrt{l^2 + t^2}", lang === "en" ? "4 face diags" : lang === "ja" ? "4本" : "4 buah", lang === "en" ? "Face diag. left/right" : lang === "ja" ? "左・右面の面対角線" : "Diagonal bidang kiri/kanan"],
                  ["d_3 = \\sqrt{p^2 + l^2}", lang === "en" ? "4 face diags" : lang === "ja" ? "4本" : "4 buah", lang === "en" ? "Face diag. top/bottom" : lang === "ja" ? "上・下面の面対角線" : "Diagonal bidang atas/bawah"],
                  ["d = \\sqrt{p^2 + l^2 + t^2}", lang === "en" ? "4, equal length" : lang === "ja" ? "4本、等長" : "4 buah, sama panjang", lang === "en" ? "Space diagonal" : lang === "ja" ? "空間対角線" : "Diagonal ruang"],
                  ["L_{bd1} = p \\cdot \\sqrt{l^2 + t^2}", lang === "en" ? "2 planes" : lang === "ja" ? "2面" : "2 buah", lang === "en" ? "Diagonal plane area 1" : lang === "ja" ? "対角面の面積1" : "Luas bidang diagonal 1"],
                  ["L_{bd2} = l \\cdot \\sqrt{p^2 + t^2}", lang === "en" ? "2 planes" : lang === "ja" ? "2面" : "2 buah", lang === "en" ? "Diagonal plane area 2" : lang === "ja" ? "対角面の面積2" : "Luas bidang diagonal 2"],
                  ["L_{bd3} = t \\cdot \\sqrt{p^2 + l^2}", lang === "en" ? "2 planes" : lang === "ja" ? "2面" : "2 buah", lang === "en" ? "Diagonal plane area 3" : lang === "ja" ? "対角面の面積3" : "Luas bidang diagonal 3"],
                ].map(([rumus, ket, besaran], i) => (
                  <tr key={i} className={`border-t ${isDark ? "border-slate-700" : "border-gray-200"} ${i % 2 === 0 ? (isDark ? "bg-slate-900/40" : "bg-blue-50/50") : (isDark ? "bg-slate-800/30" : "bg-gray-50")}`}>
                    <td className={`px-2 py-2 ${isDark ? "text-white/85" : "text-gray-800"} font-sans border-r ${isDark ? "border-slate-700" : "border-gray-200"} text-left align-top`}>{besaran}</td>
                    <td className={`px-2 py-2 text-yellow-300 border-r ${isDark ? "border-slate-700" : "border-gray-200"} text-center align-middle`}>
                      <InlineMath math={rumus as string} />
                    </td>
                    <td className={`px-2 py-2 ${isDark ? "text-white/55" : "text-gray-500"} font-sans text-left align-top`}>{ket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-lg p-3 text-xs text-emerald-200 space-y-1">
            <p>💡 <strong className="text-emerald-300">{lang === "en" ? "Memory tips:" : lang === "ja" ? "覚え方のコツ：" : "Tips menghafal:"}</strong></p>
            {lang === "en" ? (
              <>
                <p>• <strong>Volume</strong> = product of 3 dimensions (p × l × t)</p>
                <p>• <strong>Surface area</strong> = 2 × (sum of 3 pairwise products)</p>
                <p>• <strong>Frame</strong> = 4 × (sum of 3 dimensions)</p>
                <p>• <strong>Space diagonal</strong> = square root of sum of squares of 3 dims (3D Pythagoras)</p>
              </>
            ) : lang === "ja" ? (
              <>
                <p>• <strong>体積</strong> = 3辺の積 (p × l × t)</p>
                <p>• <strong>表面積</strong> = 2 × (3組の積の和)</p>
                <p>• <strong>骨組み</strong> = 4 × (3辺の和)</p>
                <p>• <strong>空間対角線</strong> = 3辺の二乗和の平方根（3D ピタゴラス）</p>
              </>
            ) : (
              <>
                <p>• <strong>Volume</strong> = perkalian 3 ukuran (p × l × t)</p>
                <p>• <strong>Luas permukaan</strong> = 2 × (jumlah 3 perkalian dua-dua)</p>
                <p>• <strong>Kerangka</strong> = 4 × (jumlah 3 ukuran)</p>
                <p>• <strong>Diagonal ruang</strong> = akar dari jumlah kuadrat 3 ukuran (Pythagoras 3D)</p>
              </>
            )}
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200">
            <p>🎯 <strong>{lang === "en" ? "Strategy:" : lang === "ja" ? "解法の戦略：" : "Strategi mengerjakan soal:"}</strong> {lang === "en"
              ? <>Identify <strong className="text-yellow-300">p, l, t</strong> from the problem — then choose the correct formula.</>
              : lang === "ja"
              ? <>問題から <strong className="text-yellow-300">p, l, t</strong> を確認してから — 適切な公式を選びましょう。</>
              : <>Identifikasi <strong className="text-yellow-300">p, l, t</strong> dari soal — lalu pilih rumus yang sesuai dengan yang ditanyakan.</>}</p>
          </div>
        </div>
      ),
    },
    {
      icon: "📝",
      title: lang === "en" ? "Practice — Frame" : lang === "ja" ? "練習問題 — 骨組み" : "Contoh Soal — Kerangka",
      content: (
        <div className="space-y-4">
          <p className={`${isDark ? "text-white/40" : "text-gray-400"} text-xs text-center font-body`}>
            {lang === "en" ? "Graded practice from easy to hard" : lang === "ja" ? "基本から発展まで段階的な練習" : "Latihan bertingkat dari mudah hingga sulit"}
          </p>
          {kerangkaExamples.map((ex, i) => <ExampleCard key={`k${i}`} ex={ex} idx={i} prefix={t.prefixKerangka} lang={lang}/>)}
        </div>
      ),
    },
    {
      icon: "🎨",
      title: lang === "en" ? "Practice — Surface Area" : lang === "ja" ? "練習問題 — 表面積" : "Contoh Soal — Luas Permukaan",
      content: (
        <div className="space-y-4">
          <p className={`${isDark ? "text-white/40" : "text-gray-400"} text-xs text-center font-body`}>
            {lang === "en" ? "Graded practice from easy to hard" : lang === "ja" ? "基本から発展まで段階的な練習" : "Latihan bertingkat dari mudah hingga sulit"}
          </p>
          {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix={t.prefixLuas} lang={lang}/>)}
        </div>
      ),
    },
    {
      icon: "📦",
      title: lang === "en" ? "Practice — Volume" : lang === "ja" ? "練習問題 — 体積" : "Contoh Soal — Volume",
      content: (
        <div className="space-y-4">
          <p className={`${isDark ? "text-white/40" : "text-gray-400"} text-xs text-center font-body`}>
            {lang === "en" ? "Graded practice from easy to hard" : lang === "ja" ? "基本から発展まで段階的な練習" : "Latihan bertingkat dari mudah hingga sulit"}
          </p>
          {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix={t.prefixVol} lang={lang}/>)}
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

        <Box className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {t.title}
        </h1>
        <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center mb-6 font-body`}>{t.subtitle}</p>

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
          <div className={`flex items-center gap-3 px-5 py-4 border-b border-border/50 ${isDark ? "bg-slate-800/40" : "bg-gray-100/80"}`}>
            <span className="text-2xl">{slide.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`${isDark ? "text-white/40" : "text-gray-400"} text-[10px] font-body uppercase tracking-widest`}>
                {t.slideOf} {currentSlide + 1} / {total}
              </p>
              <h2 className={`font-display text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{slide.title}</h2>
            </div>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className={`flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold font-display
              ${isDark ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"} hover:border-primary/60 hover:bg-primary/10
              disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer`}
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

export default BalokPage;
