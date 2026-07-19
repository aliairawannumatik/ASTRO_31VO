import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

/* ─────────────────────────────────────────────────────────────
   FACE LABEL HELPERS
───────────────────────────────────────────────────────────── */
type FName = "front" | "back" | "left" | "right" | "top" | "bottom";
const ALL_FACES: FName[] = ["front", "back", "left", "right", "top", "bottom"];

const getFaceLabels = (lang: string): Record<FName, string> => {
  if (lang === "en") return { front:"FRONT", back:"BACK", left:"LEFT", right:"RIGHT", top:"TOP", bottom:"BOTTOM" };
  if (lang === "ja") return { front:"前", back:"後", left:"左", right:"右", top:"上", bottom:"下" };
  return { front:"DEPAN", back:"BELAKANG", left:"KIRI", right:"KANAN", top:"ATAS", bottom:"BAWAH" };
};

const getSvgFaceLabels = (lang: string) => {
  if (lang === "en") return { top:"TOP",left:"LEFT",front:"FRONT",right:"RIGHT",back:"BACK",bottom:"BOT" };
  if (lang === "ja") return { top:"上",left:"左",front:"前",right:"右",back:"後",bottom:"下" };
  return { top:"ATAS",left:"KIRI",front:"DEPAN",right:"KANAN",back:"BELAK.",bottom:"BAWAH" };
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE KERANGKA KUBUS — drag to rotate, click to unfold
───────────────────────────────────────────────────────────── */
type KubusEdgeAxis = "x" | "y" | "z";
type KubusEdgeSpec = { axis: KubusEdgeAxis; a: 0 | 1; b: 0 | 1; idx: number };

const KK_S = 110;
const KK_THICK = 5;
const KK_COLOR = "#22d3ee";

const KK_EDGES: KubusEdgeSpec[] = [
  { axis: "x", a: 0, b: 0, idx: 0 }, { axis: "x", a: 1, b: 0, idx: 1 },
  { axis: "x", a: 0, b: 1, idx: 2 }, { axis: "x", a: 1, b: 1, idx: 3 },
  { axis: "z", a: 0, b: 0, idx: 0 }, { axis: "z", a: 1, b: 0, idx: 1 },
  { axis: "z", a: 0, b: 1, idx: 2 }, { axis: "z", a: 1, b: 1, idx: 3 },
  { axis: "y", a: 0, b: 0, idx: 0 }, { axis: "y", a: 1, b: 0, idx: 1 },
  { axis: "y", a: 0, b: 1, idx: 2 }, { axis: "y", a: 1, b: 1, idx: 3 },
];

const InteractiveKerangkaKubus = ({ lang }: { lang: string }) => {
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
    if (!bongkar) { setRotX(0); setRotY(0); setBongkar(true); }
    else { setBongkar(false); setRotX(-18); setRotY(28); }
  };

  const ks = Math.min(KK_S, Math.max(52, Math.floor((containerW - 3 * 8 - 8) / 4)));
  const kScale = ks / KK_S;
  const kRowGap = Math.max(14, Math.round(22 * kScale));

  const flatIndex = (axis: KubusEdgeAxis, idx: number) => {
    const row = axis === "x" ? 0 : axis === "z" ? 1 : 2;
    return { row, col: idx };
  };

  const getEdgeTransform = (e: KubusEdgeSpec) => {
    if (!bongkar) {
      const A = e.a * ks; const B = e.b * ks;
      let cx = 0, cy = 0, cz = 0, rot = "";
      if (e.axis === "x") { cx = ks / 2; cy = A; cz = B; }
      else if (e.axis === "z") { cx = A; cy = B; cz = ks / 2; rot = " rotateY(-90deg)"; }
      else { cx = A; cy = ks / 2; cz = B; rot = " rotateZ(90deg)"; }
      return `translate3d(${cx - ks / 2}px, ${cy - KK_THICK / 2}px, ${cz}px)${rot}`;
    }
    const gap = 8;
    const baseRowY = ks + 36;
    const { row, col } = flatIndex(e.axis, e.idx);
    const totalW = 4 * ks + 3 * gap;
    const startX = (ks - totalW) / 2;
    const ex = startX + col * (ks + gap);
    const ey = baseRowY + row * kRowGap;
    return `translate3d(${ex}px, ${ey - KK_THICK / 2}px, 0px)`;
  };

  const hint = lang === "en" ? "Drag to rotate · Click to disassemble 12 equal edges"
    : lang === "ja" ? "ドラッグで回転 · クリックで12辺を分解"
    : "Drag untuk memutar · Klik tombol untuk membongkar 12 rusuk yang sama panjang";
  const btnAssemble = lang === "en" ? "⊟ Reassemble" : lang === "ja" ? "⊟ 元に戻す" : "⊟ Susun Kembali Kerangka";
  const btnDisassemble = lang === "en" ? "⊞ Disassemble" : lang === "ja" ? "⊞ 分解する" : "⊞ Bongkar Kerangka";
  const edgeLabel = lang === "en" ? "12 edges · all equal length (s)" : lang === "ja" ? "12辺 · すべて同じ長さ (s)" : "12 rusuk · semua sama panjang (s)";

  return (
    <div ref={containerRef} className={isDark ? "bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4" : "bg-white/90 border border-gray-200 rounded-xl p-4 space-y-4"}>
      <p className={isDark ? "text-white/60 text-xs text-center font-body" : "text-slate-600 text-xs text-center font-body"}>{hint}</p>
      <div className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{ width:"100%", height: bongkar ? Math.round(360*kScale) : Math.round(280*kScale),
          cursor: isDragging ? "grabbing" : "grab", touchAction:"none", transition:"height 0.6s ease" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <div style={{ width:ks, height:ks, position:"relative", transformStyle:"preserve-3d",
          transformOrigin:`50% 50% ${ks/2}px`,
          transform:`perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : "transform 1s ease" }}>
          {KK_EDGES.map((e, i) => (
            <div key={i} style={{ position:"absolute", top:0, left:0, width:ks, height:KK_THICK,
              background:KK_COLOR, borderRadius:3, transformStyle:"preserve-3d",
              transformOrigin:"0% 50% 50%", transform:getEdgeTransform(e),
              transition:"transform 1.4s cubic-bezier(0.4,0,0.2,1)",
              boxShadow:`0 0 6px ${KK_COLOR}cc, inset 0 0 2px rgba(255,255,255,0.4)` }} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={handleToggle}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          {bongkar ? btnAssemble : btnDisassemble}
        </button>
      </div>
      <div className={`${isDark ? "bg-slate-800/60" : "bg-gray-100"} border border-cyan-700/40 rounded p-2 text-center text-[11px] font-body`}>
        <div className="inline-flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background:KK_COLOR, boxShadow:`0 0 4px ${KK_COLOR}` }} />
          <span className="text-cyan-300 font-semibold">{edgeLabel}</span>
        </div>
      </div>
      <div className={isDark ? "bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-center" : "bg-white/90 border border-gray-200 rounded-lg p-3 text-center"}>
        {bongkar ? (
          <BlockMath math={lang==="en" ? "K = \\underbrace{s + s + \\cdots + s}_{12 \\text{ edges}} = 12 \\times s"
            : lang==="ja" ? "K = \\underbrace{s + s + \\cdots + s}_{12 \\text{ 辺}} = 12 \\times s"
            : "K = \\underbrace{s + s + \\cdots + s}_{12} = 12 \\times s"} />
        ) : (
          <BlockMath math="K_k = 12 \times s" />
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SIMPLE ROTATABLE CUBE
───────────────────────────────────────────────────────────── */
const CUBE_S = 90;
const CUBE_H = CUBE_S / 2;
const FACE_COLORS_CONST: Record<FName, string> = {
  front:"#3b82f6", back:"#8b5cf6", left:"#22c55e",
  right:"#f97316", top:"#eab308", bottom:"#ef4444",
};
const FACE_TRANSFORMS: Record<FName, string> = {
  front: `translateZ(${CUBE_H}px)`,
  back:  `rotateY(180deg) translateZ(${CUBE_H}px)`,
  left:  `rotateY(-90deg) translateZ(${CUBE_H}px)`,
  right: `rotateY(90deg) translateZ(${CUBE_H}px)`,
  top:   `rotateX(90deg) translateZ(${CUBE_H}px)`,
  bottom:`rotateX(-90deg) translateZ(${CUBE_H}px)`,
};

const SimpleRotatableCube = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(35);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ sx:0, sy:0, bx:-22, by:35 });
  const isDragRef = useRef(false);
  const rafRef = useRef<number|null>(null);
  const tickRef = useRef(0);
  const rotYRef = useRef(35);

  useEffect(() => {
    const animate = () => {
      if (!isDragRef.current) {
        tickRef.current += 1;
        rotYRef.current += 0.22;
        const rx = -18 + Math.sin(tickRef.current * 0.012) * 22;
        setRotY(rotYRef.current); setRotX(rx);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragRef.current = true; setIsDragging(true);
    dragRef.current = { sx:e.clientX, sy:e.clientY, bx:rotX, by:rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragRef.current) return;
    rotYRef.current = dragRef.current.by + (e.clientX - dragRef.current.sx) * 0.55;
    setRotY(rotYRef.current);
    setRotX(dragRef.current.bx - (e.clientY - dragRef.current.sy) * 0.55);
  }, []);
  const onMouseUp = useCallback(() => { isDragRef.current = false; setIsDragging(false); }, []);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; isDragRef.current = true; setIsDragging(true);
    dragRef.current = { sx:t.clientX, sy:t.clientY, bx:rotX, by:rotY };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragRef.current) return; e.preventDefault();
    const t = e.touches[0];
    rotYRef.current = dragRef.current.by + (t.clientX - dragRef.current.sx) * 0.55;
    setRotY(rotYRef.current);
    setRotX(dragRef.current.bx - (t.clientY - dragRef.current.sy) * 0.55);
  }, []);
  const onTouchEnd = useCallback(() => { isDragRef.current = false; setIsDragging(false); }, []);

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

  const FACE_LABELS = getFaceLabels(lang);
  const autoHint = lang === "en" ? "Auto-rotating · Drag to rotate manually"
    : lang === "ja" ? "自動回転中 · ドラッグで手動回転"
    : "Berputar otomatis · Drag untuk memutar sendiri";

  return (
    <div className={isDark ? "bg-slate-900/70 border border-slate-700/50 rounded-xl select-none" : "bg-gray-100 border border-gray-200 rounded-xl select-none"}
      style={{ padding:"12px 0 8px", cursor: isDragging ? "grabbing" : "grab", touchAction:"none" }}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      <p className={`text-center font-body mb-1 ${isDark ? "text-white/40" : "text-slate-500"}`} style={{ fontSize:9 }}>{autoHint}</p>
      <div className="mx-auto flex items-center justify-center overflow-visible"
        style={{ width:CUBE_S, height:CUBE_S, margin:"0 auto", marginTop:28, marginBottom:28 }}>
        <div style={{ width:CUBE_S, height:CUBE_S, position:"relative", transformStyle:"preserve-3d",
          transform:`perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
          {(Object.keys(FACE_TRANSFORMS) as FName[]).map(face => (
            <div key={face} style={{ position:"absolute", width:CUBE_S, height:CUBE_S,
              transform:FACE_TRANSFORMS[face], background:FACE_COLORS_CONST[face],
              opacity:0.92, border:"2px solid rgba(255,255,255,0.35)", borderRadius:6,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"inset 0 0 18px rgba(0,0,0,0.25)" }}>
              <span style={{ color:"var(--icon-color)", fontSize:8, fontWeight:700,
                letterSpacing:1, fontFamily:"monospace", textShadow:"0 1px 3px rgba(0,0,0,0.5)" }}>
                {FACE_LABELS[face]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D CUBE — pivot/hinge-based folding
───────────────────────────────────────────────────────────── */
const OPEN_ORDER: FName[] = ["top", "left", "right", "bottom", "front"];
const S = 80;
const H = S / 2;
const FACE_COLORS: Record<FName, string> = {
  front:"#3b82f6", back:"#8b5cf6", left:"#22c55e",
  right:"#f97316", top:"#eab308", bottom:"#ef4444",
};
const TRANS = "transform 1.6s cubic-bezier(0.4, 0, 0.2, 1)";

const FacePanel = ({
  face, isNext, isOpen, onClickFace, onClickNext, style, faceLabels, clickLabel,
}: {
  face: FName; isNext: boolean; isOpen: boolean;
  onClickFace: () => void; onClickNext: () => void;
  style?: React.CSSProperties; faceLabels: Record<FName, string>; clickLabel: string;
}) => {
  const color = FACE_COLORS[face];
  return (
    <div onClick={onClickFace}
      style={{ position:"absolute", width:S, height:S, cursor:"pointer", transformStyle:"preserve-3d", ...style }}>
      <div style={{ position:"absolute", inset:0, background:color,
        opacity: isNext ? 1 : 0.9,
        border: isNext ? "3px solid #ffffff" : `2px solid ${color}cc`,
        borderRadius:6, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", userSelect:"none",
        boxShadow: isNext ? `0 0 20px ${color}` : `0 0 8px ${color}66` }}>
        <span style={{ color:"var(--icon-color)", fontSize:9, fontWeight:700, letterSpacing:1, fontFamily:"monospace" }}>
          {faceLabels[face]}
        </span>
        {isNext ? (
          <button onClick={e => { e.stopPropagation(); onClickNext(); }}
            style={{ marginTop:5, background:"rgba(255,255,255,0.25)",
              border:"1.5px solid var(--icon-stroke)", borderRadius:10, color:"var(--icon-color)",
              fontSize:7, fontWeight:700, padding:"2px 7px", cursor:"pointer", letterSpacing:0.5 }}>
            {clickLabel}
          </button>
        ) : (
          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:6, marginTop:3, fontFamily:"monospace" }}>
            {isOpen ? "▣" : "□"}
          </span>
        )}
      </div>
      <div style={{ position:"absolute", inset:0, background:color, opacity:0.4,
        border:`2px solid ${color}66`, borderRadius:6,
        transform:"rotateY(180deg)", backfaceVisibility:"hidden" }} />
    </div>
  );
};

const InteractiveCube3D = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const [openFaces, setOpenFaces] = useState<Set<FName>>(new Set());
  const [seqStep, setSeqStep] = useState(-1);
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(32);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragRef = useRef({ startX:0, startY:0, baseRotX:-22, baseRotY:32 });

  const allOpen = OPEN_ORDER.every(f => openFaces.has(f));
  const allClosed = openFaces.size === 0;
  const isOpen = (f: FName) => openFaces.has(f);

  const toggleFace = useCallback((face: FName) => {
    if (face === "back" || isDragging || isTransitioning) return;
    playPopSound();
    setOpenFaces(prev => { const next = new Set(prev); if (next.has(face)) next.delete(face); else next.add(face); return next; });
  }, [isDragging, isTransitioning]);

  const openAll = () => {
    if (isTransitioning) return; playPopSound();
    setIsTransitioning(true); setRotX(-52); setRotY(0);
    setTimeout(() => { setOpenFaces(new Set(OPEN_ORDER)); setSeqStep(-1); }, 300);
    setTimeout(() => setIsTransitioning(false), 2200);
  };
  const closeAll = () => {
    if (isTransitioning) return; playPopSound();
    setIsTransitioning(true); setOpenFaces(new Set()); setSeqStep(-1);
    setTimeout(() => { setRotX(-22); setRotY(32); }, 400);
    setTimeout(() => setIsTransitioning(false), 2200);
  };
  const startSequential = () => {
    if (isTransitioning) return; playPopSound();
    setOpenFaces(new Set()); setRotX(-22); setRotY(32); setSeqStep(0);
  };
  const openNextSeq = () => {
    if (seqStep < 0 || seqStep >= OPEN_ORDER.length || isTransitioning) return;
    playPopSound(); setIsTransitioning(true);
    const face = OPEN_ORDER[seqStep];
    setOpenFaces(prev => { const n = new Set(prev); n.add(face); return n; });
    const isLast = seqStep === OPEN_ORDER.length - 1;
    if (isLast) { setSeqStep(-1); setTimeout(() => { setRotX(-52); setRotY(0); }, 400); }
    else { setSeqStep(seqStep + 1); }
    setTimeout(() => setIsTransitioning(false), 1800);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { startX:e.clientX, startY:e.clientY, baseRotX:rotX, baseRotY:rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.baseRotY + (e.clientX - dragRef.current.startX) * 0.5);
    setRotX(dragRef.current.baseRotX - (e.clientY - dragRef.current.startY) * 0.5);
  }, [isDragging]);
  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; setIsDragging(true);
    dragRef.current = { startX:t.clientX, startY:t.clientY, baseRotX:rotX, baseRotY:rotY };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return; e.preventDefault();
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

  const FACE_LABELS = getFaceLabels(lang);
  const nextFace = seqStep >= 0 ? OPEN_ORDER[seqStep] : null;

  const hint = lang === "en"
    ? `Drag to rotate · Click face to unfold/fold · ${FACE_LABELS.back} (purple) = fixed net base`
    : lang === "ja"
    ? `ドラッグで回転 · 面をクリックで展開/折りたたみ · ${FACE_LABELS.back}（紫）= 展開図の固定基点`
    : `Drag untuk memutar · Klik sisi untuk membongkar/melipat · Sisi ${FACE_LABELS.back} (ungu) = tumpuan tetap jaring-jaring`;
  const baseLabel = lang === "en" ? "★ base" : lang === "ja" ? "★ 基点" : "★ tumpuan";
  const btnSeq = lang === "en" ? "▶ Unfold Step by Step" : lang === "ja" ? "▶ 順番に展開" : "▶ Bongkar Bertahap";
  const btnAll = lang === "en" ? "⊞ Unfold All" : lang === "ja" ? "⊞ 全展開" : "⊞ Bongkar Semua";
  const btnClose = lang === "en" ? "⊟ Fold Back" : lang === "ja" ? "⊟ 元に戻す" : "⊟ Satukan Kembali";
  const baseNote = lang === "en" ? "★ = net base (fixed)" : lang === "ja" ? "★ = 展開図の基点（固定）" : "★ = tumpuan jaring-jaring";
  const clickLabel = lang === "en" ? "CLICK" : lang === "ja" ? "クリック" : "KLIK";

  const commonFaceProps = (face: FName) => ({
    face, isNext: nextFace === face, isOpen: isOpen(face),
    onClickFace: () => { if (!isDragging) toggleFace(face); },
    onClickNext: openNextSeq, faceLabels: FACE_LABELS, clickLabel,
  });

  return (
    <div className={isDark ? "bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4" : "bg-white/90 border border-gray-200 rounded-xl p-4 space-y-4"}>
      <p className={isDark ? "text-white/60 text-xs text-center font-body" : "text-slate-600 text-xs text-center font-body"}>{hint}</p>
      <div className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{ width:"100%", height:360, cursor: isDragging ? "grabbing" : "grab", touchAction:"none" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <div style={{ width:S, height:S, position:"relative", transformStyle:"preserve-3d",
          transform:`perspective(860px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : "transform 0.6s ease" }}>
          {/* BACK FACE — fixed */}
          <div style={{ position:"absolute", top:0, left:0, width:S, height:S,
            transformStyle:"preserve-3d", transform:`translateZ(-${H}px)`, transition:TRANS }}>
            <div style={{ position:"absolute", width:S, height:S, transformStyle:"preserve-3d", top:0, left:0 }}>
              <div style={{ position:"absolute", inset:0, background:FACE_COLORS["back"], opacity:0.9,
                border:`2px solid ${FACE_COLORS["back"]}cc`, borderRadius:6,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                userSelect:"none", boxShadow:`0 0 8px ${FACE_COLORS["back"]}66`,
                cursor:"default", pointerEvents:"none" }}>
                <span style={{ color:"var(--icon-color)", fontSize:9, fontWeight:700, letterSpacing:1, fontFamily:"monospace" }}>
                  {FACE_LABELS["back"]}
                </span>
                <span style={{ color:"rgba(255,255,255,0.7)", fontSize:7, marginTop:3, fontFamily:"monospace" }}>
                  {baseLabel}
                </span>
              </div>
            </div>
          </div>
          {/* TOP HINGE */}
          <div style={{ position:"absolute", top:0, left:0, width:S, height:0, transformStyle:"preserve-3d",
            transformOrigin:"50% 0% 0",
            transform: isOpen("top") ? `translateZ(-${H}px) rotateX(0deg)` : `translateZ(-${H}px) rotateX(-90deg)`,
            transition:TRANS }}>
            <FacePanel {...commonFaceProps("top")} style={{ top:-S, left:0 }} />
          </div>
          {/* BOTTOM HINGE */}
          <div style={{ position:"absolute", top:S, left:0, width:S, height:0, transformStyle:"preserve-3d",
            transformOrigin:"50% 0% 0",
            transform: isOpen("bottom") ? `translateZ(-${H}px) rotateX(0deg)` : `translateZ(-${H}px) rotateX(90deg)`,
            transition:TRANS }}>
            <FacePanel {...commonFaceProps("bottom")} style={{ top:0, left:0 }} />
            {/* FRONT HINGE — nested */}
            <div style={{ position:"absolute", top:S, left:0, width:S, height:0, transformStyle:"preserve-3d",
              transformOrigin:"50% 0% 0",
              transform: isOpen("front") ? "rotateX(0deg)" : "rotateX(90deg)", transition:TRANS }}>
              <FacePanel {...commonFaceProps("front")} style={{ top:0, left:0 }} />
            </div>
          </div>
          {/* LEFT HINGE */}
          <div style={{ position:"absolute", top:0, left:0, width:0, height:S, transformStyle:"preserve-3d",
            transformOrigin:"0% 50% 0",
            transform: isOpen("left") ? `translateZ(-${H}px) rotateY(0deg)` : `translateZ(-${H}px) rotateY(90deg)`,
            transition:TRANS }}>
            <FacePanel {...commonFaceProps("left")} style={{ top:0, left:-S }} />
          </div>
          {/* RIGHT HINGE */}
          <div style={{ position:"absolute", top:0, left:S, width:0, height:S, transformStyle:"preserve-3d",
            transformOrigin:"0% 50% 0",
            transform: isOpen("right") ? `translateZ(-${H}px) rotateY(0deg)` : `translateZ(-${H}px) rotateY(-90deg)`,
            transition:TRANS }}>
            <FacePanel {...commonFaceProps("right")} style={{ top:0, left:0 }} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={startSequential}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          {btnSeq}
        </button>
        <button onClick={openAll} disabled={allOpen}
          className="px-3 py-1.5 text-xs font-bold bg-orange-900/60 border border-orange-600 text-orange-300 rounded-lg hover:bg-orange-800/60 transition-colors cursor-pointer font-body disabled:opacity-40">
          {btnAll}
        </button>
        <button onClick={closeAll} disabled={allClosed}
          className="px-3 py-1.5 text-xs font-bold bg-violet-900/60 border border-violet-600 text-violet-300 rounded-lg hover:bg-violet-800/60 transition-colors cursor-pointer font-body disabled:opacity-40">
          {btnClose}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {ALL_FACES.map(f => (
          <div key={f} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: FACE_COLORS[f] }} />
            <span className={isDark ? "text-white/50 text-[10px] font-body" : "text-slate-500 text-[10px] font-body"}>{FACE_LABELS[f]}{f==="back"?" ★":""}</span>
          </div>
        ))}
      </div>
      <p className={isDark ? "text-white/30 text-[9px] text-center font-body" : "text-slate-400 text-[9px] text-center font-body"}>{baseNote}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   11 CUBE NET SVG DIAGRAMS
───────────────────────────────────────────────────────────── */
const NET_PATTERNS: [number, number][][] = [
  [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]],
  [[0,0],[1,0],[2,0],[3,0],[1,1],[2,-1]],
  [[0,0],[1,0],[2,0],[3,0],[0,1],[1,-1]],
  [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3]],
  [[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]],
  [[0,0],[1,0],[1,1],[1,2],[2,2],[1,3]],
  [[0,0],[1,0],[2,0],[2,1],[2,2],[1,2]],
  [[0,0],[1,0],[2,0],[0,1],[0,2],[0,3]],
  [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]],
  [[0,0],[1,0],[1,1],[1,2],[2,2],[3,2]],
  [[0,2],[1,2],[1,1],[1,0],[2,0],[3,0]],
];
const NET_COLORS = ["#3b82f6","#8b5cf6","#22c55e","#f97316","#eab308","#ef4444"];

const NetSVG = ({ cells }: { cells: [number, number][] }) => {
  const cols = cells.map(([c]) => c);
  const rows = cells.map(([, r]) => r);
  const minC = Math.min(...cols), minR = Math.min(...rows);
  const maxC = Math.max(...cols), maxR = Math.max(...rows);
  const cW = maxC - minC + 1, cH = maxR - minR + 1;
  const cs = 28;
  const W = cW * cs, H = cH * cs;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {cells.map(([c, r], i) => (
        <rect key={i}
          x={(c - minC) * cs + 1.5} y={(r - minR) * cs + 1.5}
          width={cs - 3} height={cs - 3}
          fill={NET_COLORS[i]} rx={3} fillOpacity={0.9}
          stroke="var(--icon-stroke)" strokeWidth={1.5} />
      ))}
    </svg>
  );
};

const NetGallery = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const netLabel = lang === "en" ? "Net" : lang === "ja" ? "展開図" : "Jaring";
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {NET_PATTERNS.map((cells, i) => (
        <div key={i} className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col items-center gap-2" : "bg-gray-100 border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2"}>
          <span className={isDark ? "text-white/50 text-[10px] font-body font-bold" : "text-slate-500 text-[10px] font-body font-bold"}>{netLabel} #{i+1}</span>
          <div className="flex items-center justify-center" style={{ minHeight:80 }}>
            <NetSVG cells={cells}/>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   UNSUR KUBUS — ANIMATED SVGs
───────────────────────────────────────────────────────────── */
const RusukAnimSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const fA = isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.85)";
  const fB = isDark ? "rgba(30,41,59,0.8)" : "rgba(226,232,240,0.9)";
  const ws = isDark ? "#334155" : "#94a3b8";
  const vFill = isDark ? "#e0f2fe" : "#0ea5e9";
  const lbl = isDark ? "#f8fafc" : "#1e293b";
  return (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2"
    aria-label={lang==="en" ? "Animated cube edges" : lang==="ja" ? "立方体の辺アニメーション" : "Rusuk kubus beranimasi"}>
    <defs>
      <style>{`@keyframes rusukGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22d3ee);}50%{stroke-opacity:0.25;filter:drop-shadow(0 0 0 #22d3ee);}}.rusuk-a{animation:rusukGlow 1.4s ease-in-out infinite;}`}</style>
    </defs>
    <polygon points="80,30 200,30 200,130 80,130" fill={fA} stroke={ws} strokeWidth="1.5"/>
    <polygon points="40,60 160,60 160,160 40,160" fill={fB} stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="160" y2="60" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="160" y1="60" x2="160" y2="160" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="40" y1="160" x2="160" y2="160" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="40" y1="60" x2="40" y2="160" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="80" y1="30" x2="200" y2="30" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="200" y1="30" x2="200" y2="130" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="80" y1="130" x2="200" y2="130" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="80" y1="30" x2="80" y2="130" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke="#22d3ee" strokeWidth="3.5" className="rusuk-a"/>
    {[
      [40,60,"E",-14,-4],[160,60,"F",7,-4],[160,160,"B",7,13],[40,160,"A",-14,13],
      [80,30,"H",-4,-8],[200,30,"G",7,-4],[200,130,"C",7,7],[80,130,"D",-16,7],
    ].map(([x,y,l,dx,dy]) => (
      <g key={l}>
        <circle cx={x as number} cy={y as number} r="4" fill={vFill} stroke="#22d3ee" strokeWidth="1.5"/>
        <text x={(x as number)+(dx as number)} y={(y as number)+(dy as number)} fill={lbl} fontSize="11" fontFamily="monospace" fontWeight="bold">{l}</text>
      </g>
    ))}
    <text x="88" y="184" fill={lbl} fontSize="11" fontFamily="monospace" fontWeight="bold">Cube ABCD.EFGH</text>
    <text x="98" y="46" fill="#22d3ee" fontSize="10" fontFamily="monospace">s</text>
    <text x="210" y="175" fill={lbl} fontSize="10" fontFamily="monospace">
      {lang==="en" ? "12 edges" : lang==="ja" ? "12 辺" : "12 rusuk"}
    </text>
    <text x="210" y="188" fill="#22d3ee" fontSize="10" fontFamily="monospace">= s</text>
  </svg>
  );
};

const SisiAnimSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const ws = isDark ? "#ffffff" : "#475569";
  const lbl = isDark ? "#ffffff" : "#0f172a";
  return (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-2"
    aria-label={lang==="en" ? "Animated cube faces" : lang==="ja" ? "立方体の面アニメーション" : "Sisi kubus beranimasi"}>
    <defs>
      <style>{`@keyframes sisiGlow{0%,100%{fill-opacity:0.7;}50%{fill-opacity:0.1;}}.sisi-a{animation:sisiGlow 1.6s ease-in-out infinite;}.sisi-b{animation:sisiGlow 1.6s ease-in-out infinite 0.3s;}.sisi-c{animation:sisiGlow 1.6s ease-in-out infinite 0.6s;}`}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill="#3b82f6" className="sisi-a"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="#8b5cf6" className="sisi-b"/>
    <polygon points="40,60 80,30 200,30 160,60" fill="#eab308" className="sisi-c"/>
    <polygon points="40,60 80,30 80,130 40,160" fill="#22c55e" className="sisi-b" fillOpacity="0.5"/>
    <polygon points="40,160 80,130 200,130 160,160" fill="#ef4444" className="sisi-a"/>
    <polygon points="160,60 200,30 200,130 160,160" fill="#f97316" className="sisi-c" fillOpacity="0.5"/>
    <polygon points="40,60 160,60 160,160 40,160" fill="none" stroke={ws} strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="none" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke={ws} strokeWidth="1.5"/>
    {([[40,160],[160,160],[200,130],[80,130],[40,60],[160,60],[200,30],[80,30]] as [number,number][]).map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={3} fill="#facc15" opacity={0.9}/>
    ))}
    <text x="25"  y="177" fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="163" y="177" fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="204" y="134" fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="62"  y="127" fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="25"  y="56"  fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">E</text>
    <text x="163" y="56"  fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">F</text>
    <text x="204" y="28"  fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">G</text>
    <text x="65"  y="25"  fill={lbl} fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>
  </svg>
  );
};

const TitikSudutAnimSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const ws = isDark ? "#334155" : "#94a3b8";
  return (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2"
    aria-label={lang==="en" ? "Animated cube vertices" : lang==="ja" ? "立方体の頂点アニメーション" : "Titik sudut kubus beranimasi"}>
    <defs>
      <style>{`@keyframes dotPulse{0%,100%{r:6;opacity:1;filter:drop-shadow(0 0 6px #facc15);}50%{r:3;opacity:0.3;filter:drop-shadow(0 0 0 #facc15);}}.dot-a{animation:dotPulse 1.2s ease-in-out infinite;}`}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill="none" stroke={ws} strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="none" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke={ws} strokeWidth="1.5"/>
    {[[40,60],[160,60],[40,160],[160,160],[80,30],[200,30],[80,130],[200,130]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} fill="#facc15" className="dot-a" style={{animationDelay:`${i*0.15}s`}} r={6}/>
    ))}
    <text x="22" y="58"  fill="#facc15" fontSize="10" fontFamily="monospace">E</text>
    <text x="164" y="58" fill="#facc15" fontSize="10" fontFamily="monospace">F</text>
    <text x="164" y="172" fill="#facc15" fontSize="10" fontFamily="monospace">B</text>
    <text x="22" y="172" fill="#facc15" fontSize="10" fontFamily="monospace">A</text>
    <text x="64" y="26"  fill="#facc15" fontSize="10" fontFamily="monospace">H</text>
    <text x="202" y="26" fill="#facc15" fontSize="10" fontFamily="monospace">G</text>
    <text x="202" y="142" fill="#facc15" fontSize="10" fontFamily="monospace">C</text>
    <text x="64" y="142" fill="#facc15" fontSize="10" fontFamily="monospace">D</text>
    <text x="192" y="175" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">
      {lang==="en" ? "8 vertices" : lang==="ja" ? "8 頂点" : "8 titik sudut"}
    </text>
  </svg>
  );
};

const DiagonalBidangSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const fA = isDark ? "rgba(30,41,59,0.7)" : "rgba(241,245,249,0.85)";
  const fB = isDark ? "rgba(30,41,59,0.5)" : "rgba(226,232,240,0.7)";
  const ws = isDark ? "#475569" : "#94a3b8";
  return (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2"
    aria-label={lang==="en" ? "Cube face diagonal" : lang==="ja" ? "立方体の面対角線" : "Diagonal bidang kubus"}>
    <defs>
      <style>{`@keyframes diagBidang{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #4ade80);}50%{stroke-opacity:0.2;filter:drop-shadow(0 0 0 #4ade80);}}.db-a{animation:diagBidang 1.5s ease-in-out infinite;}`}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill={fA} stroke={ws} strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill={fB} stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="160" y2="160" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="6,3" className="db-a"/>
    <line x1="80" y1="30" x2="200" y2="130" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="6,3" className="db-a" style={{animationDelay:"0.6s"}}/>
    <circle cx="40" cy="60" r="4" fill="#4ade80"/>
    <circle cx="160" cy="160" r="4" fill="#4ade80"/>
    <text x="62" y="120" fill="#4ade80" fontSize="10" fontFamily="monospace">d_b</text>
    <text x="175" y="175" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">
      {lang==="en" ? "12 diagonals" : lang==="ja" ? "12 対角線" : "12 diagonal"}
    </text>
    <text x="182" y="188" fill="#4ade80" fontSize="10" fontFamily="monospace">s√2</text>
  </svg>
  );
};

const AllDiagonalBidangSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const faceOf = (name: string) => {
    if (lang === "en") {
      const m: Record<string,string> = { Depan:"Front",Belakang:"Back",Kiri:"Left",Kanan:"Right",Atas:"Top",Alas:"Base" };
      return m[name] || name;
    }
    if (lang === "ja") {
      const m: Record<string,string> = { Depan:"前面",Belakang:"後面",Kiri:"左面",Kanan:"右面",Atas:"上面",Alas:"底面" };
      return m[name] || name;
    }
    return name;
  };
  const diags = [
    { x1:40,y1:160,x2:160,y2:60, color:"#ef4444", key:"AF", face:faceOf("Depan") },
    { x1:160,y1:160,x2:40,y2:60, color:"#f97316", key:"BE", face:faceOf("Depan") },
    { x1:80,y1:130,x2:200,y2:30, color:"#eab308", key:"DG", face:faceOf("Belakang") },
    { x1:200,y1:130,x2:80,y2:30, color:"#84cc16", key:"CH", face:faceOf("Belakang") },
    { x1:40,y1:160,x2:80,y2:30,  color:"#22c55e", key:"AH", face:faceOf("Kiri") },
    { x1:40,y1:60,x2:80,y2:130,  color:"#14b8a6", key:"DE", face:faceOf("Kiri") },
    { x1:160,y1:160,x2:200,y2:30, color:"#06b6d4", key:"BG", face:faceOf("Kanan") },
    { x1:160,y1:60,x2:200,y2:130, color:"#3b82f6", key:"CF", face:faceOf("Kanan") },
    { x1:40,y1:60,x2:200,y2:30,  color:"#6366f1", key:"EG", face:faceOf("Atas") },
    { x1:160,y1:60,x2:80,y2:30,  color:"#8b5cf6", key:"FH", face:faceOf("Atas") },
    { x1:40,y1:160,x2:200,y2:130, color:"#d946ef", key:"AC", face:faceOf("Alas") },
    { x1:160,y1:160,x2:80,y2:130, color:"#f43f5e", key:"BD", face:faceOf("Alas") },
  ];
  const verts: [number,number,string,number,number][] = [
    [40,60,"E",-10,-5],[160,60,"F",5,-5],[160,160,"B",5,10],[40,160,"A",-10,10],
    [80,30,"H",-2,-7],[200,30,"G",5,-5],[200,130,"C",6,4],[80,130,"D",-13,4],
  ];
  const descText = lang === "en"
    ? "Each cube below shows one face diagonal. With 6 faces × 2 diagonals per face = 12 face diagonals total."
    : lang === "ja"
    ? "以下の各立方体は面対角線を1本表示。6面 × 2本 = 合計12本の面対角線。"
    : "Setiap kubus di bawah hanya menampilkan satu diagonal bidang. Karena ada 6 sisi dan setiap sisi punya 2 diagonal, totalnya ada 12 diagonal bidang.";
  const faceLabel = lang === "en" ? "Face" : lang === "ja" ? "面" : "Sisi";

  return (
    <div className="space-y-3 my-3">
      <p className={isDark ? "text-xs text-green-100/80 bg-green-950/50 border border-green-700/40 rounded-lg p-3" : "text-xs text-green-800 bg-green-50 border border-green-300 rounded-lg p-3"}>{descText}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {diags.map((d, i) => (
          <div key={d.key} className={isDark ? "bg-slate-900/55 border border-slate-700/70 rounded-lg p-3 space-y-2" : "bg-white border border-gray-200 rounded-lg p-3 space-y-2"}>
            <svg viewBox="0 0 240 190" className="w-full mx-auto" aria-label={`${lang==="en"?"Face diagonal":"面対角線"} ${d.key}`}>
              <defs><style>{`@keyframes diagBidangGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style></defs>
              <polygon points="40,55 150,55 150,145 40,145" fill={isDark?"rgba(20,30,50,0.76)":"rgba(241,245,249,0.85)"} stroke={isDark?"#475569":"#94a3b8"} strokeWidth="1.4"/>
              <polygon points="75,28 185,28 185,118 75,118" fill={isDark?"rgba(20,30,50,0.44)":"rgba(226,232,240,0.65)"} stroke={isDark?"#475569":"#94a3b8"} strokeWidth="1.4"/>
              <line x1="40" y1="55" x2="75" y2="28" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="1.4"/>
              <line x1="150" y1="55" x2="185" y2="28" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="1.4"/>
              <line x1="40" y1="145" x2="75" y2="118" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="1.4"/>
              <line x1="150" y1="145" x2="185" y2="118" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="1.4"/>
              <line
                x1={d.x1===160?150:d.x1===200?185:d.x1===80?75:d.x1}
                y1={d.y1===160?145:d.y1===60?55:d.y1===130?118:d.y1}
                x2={d.x2===160?150:d.x2===200?185:d.x2===80?75:d.x2}
                y2={d.y2===160?145:d.y2===60?55:d.y2===130?118:d.y2}
                stroke={d.color} strokeWidth="4" strokeLinecap="round" strokeDasharray="8,4"
                style={{ filter:`drop-shadow(0 0 8px ${d.color})`,
                  animation:`diagBidangGlow 1.5s ease-in-out infinite ${(i*0.13).toFixed(2)}s` }} />
              {verts.map(([x,y,lbl,dx,dy]) => {
                const sx = x===160?150:x===200?185:x===80?75:x;
                const sy = y===160?145:y===60?55:y===130?118:y;
                return (
                  <g key={lbl}>
                    <circle cx={sx} cy={sy} r="3.2" fill={isDark?"#e2e8f0":"#64748b"}/>
                    <text x={sx+dx} y={sy+dy} fill={isDark?"#f8fafc":"#1e293b"} fontSize="9" fontFamily="monospace" fontWeight="bold">{lbl}</text>
                  </g>
                );
              })}
              <text x="112" y="175" fill={d.color} fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{d.key}</text>
            </svg>
            <div>
              <p className="text-xs font-semibold" style={{ color:d.color }}>{`${i+1}. ${lang==="en"?"Diagonal":"対角線"} ${d.key}`}</p>
              <p className={isDark ? "text-[11px] text-white/55" : "text-[11px] text-slate-500"}>{`${faceLabel} ${d.face}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DiagonalRuangSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const fA = isDark ? "rgba(30,41,59,0.7)" : "rgba(241,245,249,0.85)";
  const fB = isDark ? "rgba(30,41,59,0.5)" : "rgba(226,232,240,0.7)";
  const ws = isDark ? "#475569" : "#94a3b8";
  return (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2"
    aria-label={lang==="en" ? "Cube space diagonal" : lang==="ja" ? "立方体の空間対角線" : "Diagonal ruang kubus"}>
    <defs>
      <style>{`@keyframes diagRuang{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 8px #f87171);}50%{stroke-opacity:0.15;filter:drop-shadow(0 0 0 #f87171);}}.dr-a{animation:diagRuang 1.4s ease-in-out infinite;}`}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill={fA} stroke={ws} strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill={fB} stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="200" y2="130" stroke="#f87171" strokeWidth="3" className="dr-a"/>
    <line x1="160" y1="60" x2="80" y2="130" stroke="#f87171" strokeWidth="3" className="dr-a" style={{animationDelay:"0.7s"}}/>
    <circle cx="40" cy="60" r="5" fill="#f87171"/>
    <circle cx="200" cy="130" r="5" fill="#f87171"/>
    <text x="95" y="100" fill="#f87171" fontSize="10" fontFamily="monospace">d_r</text>
    <text x="175" y="175" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">
      {lang==="en" ? "4 diagonals" : lang==="ja" ? "4 対角線" : "4 diagonal"}
    </text>
    <text x="182" y="188" fill="#f87171" fontSize="10" fontFamily="monospace">s√3</text>
  </svg>
  );
};

const AllDiagonalRuangSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const diags = [
    { x1:20,y1:195,x2:250,y2:10, color:"#f44336", key:"AG", desc:"A → G" },
    { x1:195,y1:195,x2:75,y2:10, color:"#4caf50", key:"BH", desc:"B → H" },
    { x1:195,y1:52,x2:75,y2:153, color:"#38bdf8", key:"DF", desc:"D → F" },
    { x1:20,y1:52,x2:250,y2:153, color:"#facc15", key:"CE", desc:"C → E" },
  ];
  const verts: [number,number,string,number,number][] = [
    [20,52,"E",-14,-4],[195,52,"F",6,-4],[195,195,"B",6,12],[20,195,"A",-14,12],
    [75,10,"H",-5,-6],[250,10,"G",5,-6],[250,153,"C",6,5],[75,153,"D",-16,5],
  ];
  const legendTitle = lang==="en" ? "Key (4 space diagonals):" : lang==="ja" ? "凡例（4本の空間対角線）:" : "Keterangan (4 diagonal ruang):";
  const fA = isDark ? "rgba(20,30,50,0.75)" : "rgba(241,245,249,0.85)";
  const fB = isDark ? "rgba(20,30,50,0.4)"  : "rgba(226,232,240,0.65)";
  const ws  = isDark ? "#334155" : "#94a3b8";
  const vCircle = isDark ? "#94a3b8" : "#64748b";
  const vLabel  = isDark ? "#f1f5f9" : "#1e293b";
  const lgText  = isDark ? "#94a3b8" : "#475569";

  return (
    <svg viewBox="0 0 278 255" className="w-full max-w-sm mx-auto my-2"
      aria-label={lang==="en" ? "4 cube space diagonals" : lang==="ja" ? "立方体の4本の空間対角線" : "4 diagonal ruang kubus"}>
      <defs><style>{`@keyframes drGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style></defs>
      <polygon points="20,52 195,52 195,195 20,195" fill={fA} stroke={ws} strokeWidth="1.8"/>
      <polygon points="75,10 250,10 250,153 75,153" fill={fB} stroke={ws} strokeWidth="1.8"/>
      <line x1="20" y1="52" x2="75" y2="10" stroke={ws} strokeWidth="1.8"/>
      <line x1="195" y1="52" x2="250" y2="10" stroke={ws} strokeWidth="1.8"/>
      <line x1="20" y1="195" x2="75" y2="153" stroke={ws} strokeWidth="1.8"/>
      <line x1="195" y1="195" x2="250" y2="153" stroke={ws} strokeWidth="1.8"/>
      {diags.map((d,i)=>(
        <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
          stroke={d.color} strokeWidth="3.5" strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 8px ${d.color})`,
            animation:`drGlow 1.5s ease-in-out infinite ${(i*0.37).toFixed(2)}s` }}/>
      ))}
      {verts.map(([x,y,lbl,dx,dy],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={vCircle}/>
          <text x={x+dx} y={y+dy} fill={vLabel} fontSize="11" fontFamily="monospace" fontWeight="bold">{lbl}</text>
        </g>
      ))}
      <text x="10" y="215" fill={lgText} fontSize="9" fontFamily="monospace">{legendTitle}</text>
      {diags.map((d,i)=>{
        const col = i % 2; const row = Math.floor(i/2);
        const x = 14 + col*140; const y = 228 + row*20;
        return (
          <g key={i}>
            <line x1={x} y1={y+3} x2={x+20} y2={y+3} stroke={d.color} strokeWidth="2.5"/>
            <circle cx={x} cy={y+3} r="3.5" fill={d.color}/>
            <circle cx={x+20} cy={y+3} r="3.5" fill={d.color}/>
            <text x={x+26} y={y+7} fill={d.color} fontSize="9" fontFamily="monospace" fontWeight="bold">{`${d.key}  (${d.desc})`}</text>
          </g>
        );
      })}
    </svg>
  );
};

const BidangDiagonalSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const fA = isDark ? "rgba(30,41,59,0.7)" : "rgba(241,245,249,0.85)";
  const fB = isDark ? "rgba(30,41,59,0.5)" : "rgba(226,232,240,0.7)";
  const ws = isDark ? "#475569" : "#94a3b8";
  return (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2"
    aria-label={lang==="en" ? "Cube diagonal plane" : lang==="ja" ? "立方体の対角面" : "Bidang diagonal kubus"}>
    <defs>
      <style>{`@keyframes bdGlow{0%,100%{fill-opacity:0.55;filter:drop-shadow(0 0 5px #a78bfa);}50%{fill-opacity:0.1;filter:drop-shadow(0 0 0 #a78bfa);}}.bd-a{animation:bdGlow 1.6s ease-in-out infinite;}`}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill={fA} stroke={ws} strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill={fB} stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke={ws} strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke={ws} strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke={ws} strokeWidth="1.5"/>
    <polygon points="40,60 200,30 200,130 40,160" fill="#a78bfa" className="bd-a"/>
    <polygon points="40,60 200,30 200,130 40,160" fill="none" stroke="#a78bfa" strokeWidth="2"/>
    <text x="95" y="105" fill="#a78bfa" fontSize="11" fontFamily="monospace" fontWeight="bold">EACG</text>
    <text x="170" y="175" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">
      {lang==="en" ? "6 planes" : lang==="ja" ? "6 対角面" : "6 bidang"}
    </text>
    <text x="170" y="188" fill="#a78bfa" fontSize="10" fontFamily="monospace">
      {lang==="en" ? "diagonal" : lang==="ja" ? "" : "diagonal"}
    </text>
  </svg>
  );
};

type BidangDiagonalVariant = { title: string; points: string; color: string; label: string; note: string; };

const getBidangDiagonalVariants = (lang: string): BidangDiagonalVariant[] => {
  const notesFn = (id: string, en: string, ja: string) => lang==="en" ? en : lang==="ja" ? ja : id;
  return [
    { title:"EACG", points:"40,160 40,60 200,30 200,130", color:"#a78bfa", label:"EACG",
      note: notesFn("sejajar dengan bidang FBDH","parallel to plane FBDH","平面FBDHに平行") },
    { title:"FBDH", points:"160,60 160,160 80,130 80,30", color:"#22d3ee", label:"FBDH",
      note: notesFn("sejajar dengan bidang EACG","parallel to plane EACG","平面EACGに平行") },
    { title:"DCEF", points:"160,60 40,60 80,130 200,130", color:"#34d399", label:"DCEF",
      note: notesFn("melalui rusuk DC dan EF","through edges DC and EF","辺DCとEFを通る") },
    { title:"ABGH", points:"40,160 160,160 200,30 80,30", color:"#facc15", label:"ABGH",
      note: notesFn("melalui rusuk AB dan GH","through edges AB and GH","辺ABとGHを通る") },
    { title:"EHCB", points:"40,60 80,30 200,130 160,160", color:"#fb7185", label:"EHCB",
      note: notesFn("melalui rusuk EH dan BC","through edges EH and BC","辺EHとBCを通る") },
    { title:"FGDA", points:"160,60 200,30 80,130 40,160", color:"#a78bfa", label:"FGDA",
      note: notesFn("melalui rusuk FG dan AD","through edges FG and AD","辺FGとADを通る") },
  ];
};

const BidangDiagonalVariantCube = ({ variant, idx=0 }: { variant: BidangDiagonalVariant; idx?: number }) => {
  const { isDark } = useTheme();
  return (
  <div className={isDark ? "rounded-lg border border-slate-700/70 bg-slate-900/55 p-3 space-y-2" : "rounded-lg border border-gray-200 bg-white p-3 space-y-2"}>
    <svg viewBox="0 0 240 190" className="w-full mx-auto" aria-label={`Diagonal plane ${variant.label}`}>
      <defs><style>{`@keyframes bdPulse{0%,100%{fill-opacity:0.52;stroke-opacity:1;}50%{fill-opacity:0.08;stroke-opacity:0.25;}}.bd-pulse{animation:bdPulse 2s ease-in-out infinite;}`}</style></defs>
      <polygon points="40,55 150,55 150,145 40,145" fill={isDark?"rgba(30,41,59,0.72)":"rgba(241,245,249,0.85)"} stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1.4"/>
      <polygon points="75,28 185,28 185,118 75,118" fill={isDark?"rgba(30,41,59,0.45)":"rgba(226,232,240,0.65)"} stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1.4"/>
      <line x1="40" y1="55" x2="75" y2="28" stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1.4"/>
      <line x1="150" y1="55" x2="185" y2="28" stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1.4"/>
      <line x1="40" y1="145" x2="75" y2="118" stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1.4"/>
      <line x1="150" y1="145" x2="185" y2="118" stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1.4"/>
      <polygon
        points={variant.points.replaceAll("160","150").replaceAll("200","185").replaceAll("80","75").replaceAll("60","55").replaceAll("130","118")}
        fill={variant.color} stroke={variant.color} strokeWidth="2.4" strokeLinejoin="round"
        className="bd-pulse" style={{ filter:`drop-shadow(0 0 9px ${variant.color})`, animationDelay:`${idx*0.33}s` }} />
      {[[40,55,"E",-12,-5],[150,55,"F",5,-5],[150,145,"B",5,12],[40,145,"A",-12,12],
        [75,28,"H",-3,-8],[185,28,"G",5,-5],[185,118,"C",6,4],[75,118,"D",-14,5]
      ].map(([x,y,lbl,dx,dy]) => (
        <g key={lbl}>
          <circle cx={x as number} cy={y as number} r="3" fill={isDark?"#e2e8f0":"#64748b"}/>
          <text x={(x as number)+(dx as number)} y={(y as number)+(dy as number)} fill={isDark?"#f8fafc":"#1e293b"} fontSize="9" fontFamily="monospace" fontWeight="bold">{lbl}</text>
        </g>
      ))}
      <text x="112" y="90" fill={variant.color} fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{variant.label}</text>
      <text x="95" y="178" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.75">ABCD</text>
      <text x="130" y="16" fill={isDark?"#94a3b8":"#475569"} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.75">EFGH</text>
    </svg>
    <div>
      <p className="text-xs font-semibold" style={{ color:variant.color }}>{variant.title}</p>
      <p className={isDark ? "text-[11px] text-white/55" : "text-[11px] text-slate-500"}>{variant.note}</p>
    </div>
  </div>
  );
};

const BidangDiagonalVariasiGallery = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const variants = getBidangDiagonalVariants(lang);
  const desc = lang==="en"
    ? "All 6 diagonal planes in cube ABCD.EFGH. Each color shows a different diagonal plane."
    : lang==="ja"
    ? "立方体ABCD.EFGHの6つの対角面。各色は異なる対角面を示す。"
    : "Keenam (6) bidang diagonal pada kubus ABCD.EFGH. Setiap warna menunjukkan satu bidang diagonal yang berbeda.";
  return (
    <div className="space-y-3">
      <div className={isDark ? "rounded-lg bg-slate-900/60 border border-violet-700/30 p-3" : "rounded-lg bg-violet-50 border border-violet-300/60 p-3"}>
        <p className={isDark ? "text-xs text-violet-200" : "text-xs text-violet-700"}>{desc}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {variants.map((variant, i) => (
          <BidangDiagonalVariantCube key={variant.label} variant={variant} idx={i} />
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LUAS PERMUKAAN SVG
───────────────────────────────────────────────────────────── */
const LuasPermukaanSVG = ({ lang }: { lang: string }) => {
  const fl = getSvgFaceLabels(lang);
  return (
    <svg viewBox="0 0 340 220" className="w-full max-w-sm mx-auto my-2"
      aria-label={lang==="en" ? "Cube surface area animation" : lang==="ja" ? "立方体の表面積アニメーション" : "Animasi luas permukaan kubus"}>
      <defs>
        <style>{`@keyframes lp1{0%,100%{fill-opacity:0.8;}50%{fill-opacity:0.15;}}.lp1{animation:lp1 2s ease-in-out infinite;}.lp2{animation:lp1 2s ease-in-out infinite 0.33s;}.lp3{animation:lp1 2s ease-in-out infinite 0.66s;}.lp4{animation:lp1 2s ease-in-out infinite 1s;}.lp5{animation:lp1 2s ease-in-out infinite 1.33s;}.lp6{animation:lp1 2s ease-in-out infinite 1.66s;}`}</style>
      </defs>
      <rect x="122" y="10" width="70" height="70" fill="#eab308" className="lp1" rx="3" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <text x="157" y="44" fill="#000" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{fl.top}</text>
      <text x="157" y="59" fill="#000" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
      <rect x="50" y="82" width="70" height="70" fill="#22c55e" className="lp2" rx="3" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <text x="85" y="115" fill="#000" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{fl.left}</text>
      <text x="85" y="130" fill="#000" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
      <rect x="122" y="82" width="70" height="70" fill="#3b82f6" className="lp3" rx="3" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <text x="157" y="115" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{fl.front}</text>
      <text x="157" y="130" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
      <rect x="194" y="82" width="70" height="70" fill="#f97316" className="lp4" rx="3" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <text x="229" y="115" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{fl.right}</text>
      <text x="229" y="130" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
      <rect x="266" y="82" width="70" height="70" fill="#8b5cf6" className="lp5" rx="3" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <text x="301" y="115" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{fl.back}</text>
      <text x="301" y="130" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
      <rect x="122" y="154" width="70" height="70" fill="#ef4444" className="lp6" rx="3" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <text x="157" y="187" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{fl.bottom}</text>
      <text x="157" y="202" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   VOLUME SVG
───────────────────────────────────────────────────────────── */
const VolumeSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  return (
  <svg viewBox="0 0 300 230" className="w-full max-w-sm mx-auto my-2"
    aria-label={lang==="en" ? "Cube volume animation — glowing solid cube" : lang==="ja" ? "立方体の体積アニメーション" : "Animasi volume kubus — kubus utuh bersinar"}>
    <defs>
      <style>{`
        @keyframes faceGlowTop{0%,100%{fill-opacity:0.92;filter:drop-shadow(0 0 14px #a78bfa);}50%{fill-opacity:0.65;filter:drop-shadow(0 0 4px #7c3aed);}}
        @keyframes faceGlowLeft{0%,100%{fill-opacity:0.88;filter:drop-shadow(0 0 12px #60a5fa);}50%{fill-opacity:0.55;filter:drop-shadow(0 0 3px #1d4ed8);}}
        @keyframes faceGlowRight{0%,100%{fill-opacity:0.85;filter:drop-shadow(0 0 12px #818cf8);}50%{fill-opacity:0.50;filter:drop-shadow(0 0 3px #4338ca);}}
        @keyframes volBloomAnim{0%,100%{filter:drop-shadow(0 0 8px #a78bfa);}50%{filter:drop-shadow(0 0 18px #c4b5fd);}}
        .vol-top{animation:faceGlowTop 2s ease-in-out infinite;}
        .vol-left{animation:faceGlowLeft 2s ease-in-out infinite 0.5s;}
        .vol-right{animation:faceGlowRight 2s ease-in-out infinite 1s;}
        .vol-lbl{animation:volBloomAnim 2s ease-in-out infinite;}
      `}</style>
      <filter id="volBloom"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Back face */}
    <polygon points="80,40 220,40 220,160 80,160" fill="#4c1d95" stroke="#6d28d9" strokeWidth="1.5"/>
    {/* Left face */}
    <polygon points="20,95 80,40 80,160 20,215" fill="#3730a3" stroke="#4338ca" strokeWidth="1.5" className="vol-left"/>
    {/* Right face */}
    <polygon points="220,40 280,95 280,215 220,160" fill="#4338ca" stroke="#6366f1" strokeWidth="1.5" className="vol-right"/>
    {/* Top face */}
    <polygon points="20,95 80,40 220,40 280,95" fill="#7c3aed" stroke="#8b5cf6" strokeWidth="1.5" className="vol-top"/>
    {/* Bottom face */}
    <polygon points="20,215 80,160 220,160 280,215" fill="#312e81" stroke="#4338ca" strokeWidth="1"/>
    {/* Front face */}
    <polygon points="20,95 280,95 280,215 20,215" fill="#4f46e5" stroke="#6366f1" strokeWidth="1.5"/>
    {/* Dimension labels */}
    <text x="148" y="220" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
    <text x="8" y="160" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
    <text x="258" y="66" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
    <text x="150" y="224" fill={isDark?"#e0e7ff":"#1e1b4b"} fontSize="14" fontFamily="monospace" fontWeight="bold"
      textAnchor="middle" filter="url(#volBloom)" className="vol-lbl">V = s³</text>
  </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   WATER FILL ANIMATION
───────────────────────────────────────────────────────────── */
type V2k = [number, number];

const WaterKubusAnimation = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const FILL_MS=3200, HOLD_FULL=900, EMPTY_MS=2000, HOLD_EMPTY=500;
    const TOTAL = FILL_MS+HOLD_FULL+EMPTY_MS+HOLD_EMPTY;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = (now-start) % TOTAL;
      let f: number;
      if (t<FILL_MS) f=t/FILL_MS;
      else if (t<FILL_MS+HOLD_FULL) f=1;
      else if (t<FILL_MS+HOLD_FULL+EMPTY_MS) f=1-(t-FILL_MS-HOLD_FULL)/EMPTY_MS;
      else f=0;
      setFill(f); raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const FL:V2k=[62,178],FR:V2k=[162,178],Hpx=100,dx=30,dy=-22;
  const BkL:V2k=[FL[0]+dx,FL[1]+dy],BkR:V2k=[FR[0]+dx,FR[1]+dy];
  const FTL:V2k=[FL[0],FL[1]-Hpx],FTR:V2k=[FR[0],FR[1]-Hpx];
  const BkTL:V2k=[BkL[0],BkL[1]-Hpx],BkTR:V2k=[BkR[0],BkR[1]-Hpx];
  const lerp=(a:V2k,b:V2k,t:number):V2k=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const p=(v:V2k)=>`${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pp=(...vs:V2k[])=>vs.map(p).join(" ");
  const WFL=lerp(FL,FTL,fill),WFR=lerp(FR,FTR,fill);
  const WBkL=lerp(BkL,BkTL,fill),WBkR=lerp(BkR,BkTR,fill);
  const pct=Math.round(fill*100),isEmpty=fill<0.005,isFull=fill>0.995;
  const barX=202,barY=FTL[1],barW=13,barH=Hpx,filledH=barH*fill;

  const topLabel = lang==="en" ? "TOP" : lang==="ja" ? "上" : "TUTUP";
  const statusText = isFull
    ? (lang==="en" ? "🌊 Full!" : lang==="ja" ? "🌊 満水！" : "🌊 Penuh!")
    : isEmpty
    ? (lang==="en" ? "⬛ Empty" : lang==="ja" ? "⬛ 空" : "⬛ Kosong")
    : (lang==="en" ? `🔵 Filling... ${pct}%` : lang==="ja" ? `🔵 注入中... ${pct}%` : `🔵 Mengisi... ${pct}%`);

  return (
    <svg viewBox="0 0 280 215" className="w-full max-w-sm mx-auto my-2"
      aria-label={lang==="en" ? "Cube filling with water animation" : lang==="ja" ? "立方体に水を注ぐアニメーション" : "Animasi kubus diisi air"}>
      <defs><filter id="wBloomK"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <line x1={BkL[0]} y1={BkL[1]} x2={BkTL[0]} y2={BkTL[1]} stroke={isDark?"#334155":"#94a3b8"} strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1={FL[0]} y1={FL[1]} x2={BkL[0]} y2={BkL[1]} stroke={isDark?"#334155":"#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={FTL[0]} y1={FTL[1]} x2={BkTL[0]} y2={BkTL[1]} stroke={isDark?"#334155":"#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
      <line x1={BkTL[0]} y1={BkTL[1]} x2={BkTR[0]} y2={BkTR[1]} stroke={isDark?"#334155":"#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
      <polygon points={pp(FR,BkR,BkTR,FTR)} fill={isDark?"#0f172a":"rgba(226,232,240,0.4)"} fillOpacity={0.22} stroke={isDark?"#334155":"#94a3b8"} strokeWidth="0.8"/>
      <polygon points={pp(FL,FR,FTR,FTL)} fill={isDark?"#0f172a":"rgba(226,232,240,0.3)"} fillOpacity={0.15} stroke={isDark?"#334155":"#94a3b8"} strokeWidth="0.8"/>
      {!isEmpty && (<>
        <polygon points={pp(FL,FR,BkR,BkL)} fill="#1e3a8a" fillOpacity={0.90}/>
        <polygon points={pp(FR,BkR,WBkR,WFR)} fill="#1d4ed8" fillOpacity={0.80}/>
        <polygon points={pp(FL,FR,WFR,WFL)} fill="#2563eb" fillOpacity={0.90}/>
        {!isFull && (<>
          <polygon points={pp(WFL,WFR,WBkR,WBkL)} fill="#7dd3fc" fillOpacity={0.50} style={{filter:"drop-shadow(0 0 5px #38bdf8)"}}/>
          <line x1={WFL[0]} y1={WFL[1]} x2={WFR[0]} y2={WFR[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
        </>)}
      </>)}
      <polygon points={pp(FL,FR,FTR,FTL)} fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(FR,BkR,BkTR,FTR)} fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      <polygon points={pp(FTL,FTR,BkTR,BkTL)} fill={isDark?"#0f172a":"rgba(226,232,240,0.5)"} fillOpacity={isFull?0.7:0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>
      <text x={(FL[0]+FR[0])/2} y={FL[1]+12} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
      <text x={FL[0]-13} y={(FL[1]+FTL[1])/2+4} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
      <line x1={FL[0]-7} y1={FL[1]} x2={FL[0]-7} y2={FTL[1]} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>
      <text x={(FTR[0]+BkTR[0])/2+4} y={(FTR[1]+BkTR[1])/2-6} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
      <text x={(FTL[0]+FTR[0])/2} y={FTL[1]-6} fill="#c4b5fd" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{topLabel}</text>
      <rect x={barX} y={barY} width={barW} height={barH} fill={isDark?"#0f172a":"#e2e8f0"} stroke={isDark?"#334155":"#94a3b8"} strokeWidth="1.2" rx="3"/>
      {!isEmpty && (<rect x={barX} y={barY+barH-filledH} width={barW} height={filledH} fill="#2563eb" fillOpacity={0.88} rx="3"/>)}
      <text x={barX+barW/2} y={barY-5} fill={isDark?"#94a3b8":"#475569"} fontSize="7" fontFamily="monospace" textAnchor="middle">V%</text>
      <text x={barX+barW/2} y={barY+barH+12} fill={isFull?"#4ade80":isEmpty?"#64748b":"#7dd3fc"} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{pct}%</text>
      <text x="118" y="198" fill={isFull?"#4ade80":isEmpty?"#64748b":"#7dd3fc"} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomK)">{statusText}</text>
      <text x="118" y="212" fill={isDark?"#e0e7ff":"#1e1b4b"} fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomK)">V = s³</text>
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
  const showLabel = lang==="en" ? "Show Solution" : lang==="ja" ? "解説を見る" : "Lihat Pembahasan";
  const hideLabel = lang==="en" ? "Hide" : lang==="ja" ? "隠す" : "Sembunyikan";
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx+1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button onClick={() => { playPopSound(); setShow(v => !v); }}
        className={`w-full flex items-center justify-between px-5 py-3 transition-colors cursor-pointer border-t ${isDark ? "bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/50" : "bg-gray-100 hover:bg-gray-200 border-gray-200"}`}>
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? hideLabel : showLabel}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className={`px-5 py-4 border-t ${isDark ? "bg-slate-900/60 border-slate-700/30" : "bg-white border-gray-200"}`}>{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const KubusPage = () => {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const { isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const translations = {
    id: {
      subtitle: "Kelas 8 · Bangun Ruang Sisi Datar",
      slideLabel: "Slide",
      prev: "← Sebelumnya", next: "Selanjutnya →",
      back: "← Kembali ke Bangun Ruang Sisi Datar",
      easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
      prefixLuas: "LUAS", prefixVol: "VOLUME", prefixKerangka: "KERANGKA",
      step: "Langkah",
      answer: "Jawaban",
      exampleSubtitle: "Latihan bertingkat dari mudah hingga sulit",
      // Section titles
      s0: "Definisi Kubus", s1: "Unsur-unsur Kubus (Interaktif)",
      s2: "Rumus Diagonal Bidang, Diagonal Ruang & Bidang Diagonal",
      s3: "Jaring-jaring Kubus (11 Pola Interaktif 3D)", s4: "Luas Permukaan Kubus",
      s5: "Volume Kubus", s6: "Kesimpulan — Rumus Lengkap Kubus",
      slideIntro: "Pengantar",
      slideRusuk: "Unsur Kubus — Rusuk",
      slideSisi: "Unsur Kubus — Sisi / Bidang",
      slideTitik: "Unsur Kubus — Titik Sudut",
      slideDiagBidang: "Unsur Kubus — Diagonal Bidang",
      slideDiagRuang: "Unsur Kubus — Diagonal Ruang",
      slideBidangDiag: "Unsur Kubus — Bidang Diagonal",
      slideJaring3D: "Jaring-jaring Kubus — 3D Interaktif",
      slideJaring11: "11 Pola Jaring-jaring Kubus",
      slideKerangka: "Kerangka Kubus",
      slideContohKerangka: "Contoh Soal — Kerangka",
      slideContohLuas: "Contoh Soal — Luas Permukaan",
      slideContohVol: "Contoh Soal — Volume",
    },
    en: {
      subtitle: "Grade 8 · Solid Figures with Flat Faces",
      slideLabel: "Slide",
      prev: "← Previous", next: "Next →",
      back: "← Back to Solid Figures",
      easy: "EASY", medium: "MEDIUM", hard: "HARD",
      prefixLuas: "SURFACE", prefixVol: "VOLUME", prefixKerangka: "FRAME",
      step: "Step",
      answer: "Answer",
      exampleSubtitle: "Graded exercises from easy to hard",
      s0: "Definition of a Cube", s1: "Cube Elements (Interactive)",
      s2: "Face Diagonal, Space Diagonal & Diagonal Plane Formulas",
      s3: "Cube Nets (11 Interactive 3D Patterns)", s4: "Surface Area of a Cube",
      s5: "Volume of a Cube", s6: "Summary — Complete Cube Formulas",
      slideIntro: "Introduction",
      slideRusuk: "Cube Elements — Edges",
      slideSisi: "Cube Elements — Faces",
      slideTitik: "Cube Elements — Vertices",
      slideDiagBidang: "Cube Elements — Face Diagonals",
      slideDiagRuang: "Cube Elements — Space Diagonals",
      slideBidangDiag: "Cube Elements — Diagonal Planes",
      slideJaring3D: "Cube Nets — 3D Interactive",
      slideJaring11: "11 Cube Net Patterns",
      slideKerangka: "Cube Frame (Wire Model)",
      slideContohKerangka: "Examples — Frame",
      slideContohLuas: "Examples — Surface Area",
      slideContohVol: "Examples — Volume",
    },
    ja: {
      subtitle: "中学2年 · 平面で囲まれた立体",
      slideLabel: "スライド",
      prev: "← 前へ", next: "次へ →",
      back: "← 立方体に戻る",
      easy: "基本", medium: "標準", hard: "発展",
      prefixLuas: "表面積", prefixVol: "体積", prefixKerangka: "辺の枠",
      step: "ステップ",
      answer: "答え",
      exampleSubtitle: "基本から発展まで段階的な練習",
      s0: "立方体の定義", s1: "立方体の要素（インタラクティブ）",
      s2: "面対角線・空間対角線・対角面の公式",
      s3: "展開図（11パターン・3Dインタラクティブ）", s4: "立方体の表面積",
      s5: "立方体の体積", s6: "まとめ — 立方体の公式一覧",
      slideIntro: "はじめに",
      slideRusuk: "立方体の要素 — 辺",
      slideSisi: "立方体の要素 — 面",
      slideTitik: "立方体の要素 — 頂点",
      slideDiagBidang: "立方体の要素 — 面対角線",
      slideDiagRuang: "立方体の要素 — 空間対角線",
      slideBidangDiag: "立方体の要素 — 対角面",
      slideJaring3D: "展開図 — 3Dインタラクティブ",
      slideJaring11: "立方体の展開図 11パターン",
      slideKerangka: "立方体の辺の枠",
      slideContohKerangka: "例題 — 辺の枠",
      slideContohLuas: "例題 — 表面積",
      slideContohVol: "例題 — 体積",
    },
  };
  const t = translations[lang as keyof typeof translations] || translations.id;

  // ── Face label maps for tables
  const unsurTableRows = lang === "en"
    ? [["Edge","12","s"],["Face","6","s²"],["Vertex","8","—"],["Face Diagonal","12","s√2"],["Space Diagonal","4","s√3"],["Diagonal Plane","6","s²√2"]]
    : lang === "ja"
    ? [["辺","12","s"],["面","6","s²"],["頂点","8","—"],["面対角線","12","s√2"],["空間対角線","4","s√3"],["対角面","6","s²√2"]]
    : [["Rusuk","12","s"],["Sisi / Bidang","6","s²"],["Titik Sudut","8","—"],["Diagonal Bidang","12","s√2"],["Diagonal Ruang","4","s√3"],["Bidang Diagonal","6","s²√2"]];

  const summaryTableRows = lang === "en"
    ? [["Total edge length","K = 12s","12 edges × s"],["1 face area","L₁ = s²","square"],["Surface area","L = 6s²","6 faces"],["Face diagonal","db = s√2","Pythagoras 2D"],["Space diagonal","dr = s√3","Pythagoras 3D"],["Diagonal plane area","L_d = s²√2","rectangle"],["Volume","V = s³","cubed"]]
    : lang === "ja"
    ? [["全辺の合計長","K = 12s","12辺 × s"],["1面の面積","L₁ = s²","正方形"],["表面積","L = 6s²","6面"],["面対角線","d_b = s√2","2次元三平方"],["空間対角線","d_r = s√3","3次元三平方"],["対角面の面積","L_d = s²√2","長方形"],["体積","V = s³","3乗"]]
    : [["Keliling semua rusuk","K = 12s","12 rusuk × s"],["Luas 1 sisi","L₁ = s²","persegi"],["Luas permukaan","L = 6s²","6 sisi"],["Diagonal bidang","db = s√2","Pythagoras 2D"],["Diagonal ruang","dr = s√3","Pythagoras 3D"],["Luas bidang diagonal","Lbd = s²√2","persegi panjang"],["Volume","V = s³","pangkat tiga"]];

  // ── Sections content
  const sections = [
    {
      title: t.s0, icon: "⬛",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {lang==="en"
              ? <span>A cube is the most symmetric <strong className="text-cyan-300">solid figure with flat faces</strong> — all faces are identical squares. Think of a die: that's a cube!</span>
              : lang==="ja"
              ? <span>立方体は最も対称性の高い<strong className="text-cyan-300">平面で囲まれた立体</strong>です — すべての面が同じ大きさの正方形。サイコロをイメージしてください！</span>
              : <span>Kubus adalah <strong className="text-cyan-300">bangun ruang sisi datar</strong> yang paling simetris — semua sisinya berbentuk persegi dengan ukuran yang persis sama. Bayangkan dadu angka: itu adalah kubus!</span>}
          </p>
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang==="en" ? "📌 Properties of a Cube:" : lang==="ja" ? "📌 立方体の性質：" : "📌 Sifat-sifat Kubus:"}
            </p>
            <ul className="space-y-1 text-xs text-white/75">
              {(lang==="en" ? [
                <li key="1">• Has <strong className="text-yellow-300">6 faces</strong> — all identical squares</li>,
                <li key="2">• Has <strong className="text-yellow-300">12 edges</strong> — all equal length</li>,
                <li key="3">• Has <strong className="text-yellow-300">8 vertices</strong></li>,
                <li key="4">• Has <strong className="text-yellow-300">12 face diagonals</strong></li>,
                <li key="5">• Has <strong className="text-yellow-300">4 space diagonals</strong></li>,
                <li key="6">• Has <strong className="text-yellow-300">6 diagonal planes</strong></li>,
                <li key="7">• Every corner angle is exactly <strong className="text-yellow-300">90°</strong></li>,
                <li key="8">• Length = width = height <strong className="text-yellow-300">always equal</strong> (= <InlineMath math="s" />)</li>,
              ] : lang==="ja" ? [
                <li key="1">• <strong className="text-yellow-300">6つの面</strong>（すべて同じ正方形）</li>,
                <li key="2">• <strong className="text-yellow-300">12本の辺</strong>（すべて同じ長さ）</li>,
                <li key="3">• <strong className="text-yellow-300">8つの頂点</strong></li>,
                <li key="4">• <strong className="text-yellow-300">12本の面対角線</strong></li>,
                <li key="5">• <strong className="text-yellow-300">4本の空間対角線</strong></li>,
                <li key="6">• <strong className="text-yellow-300">6つの対角面</strong></li>,
                <li key="7">• すべての角は<strong className="text-yellow-300">90°</strong></li>,
                <li key="8">• 縦・横・高さが<strong className="text-yellow-300">すべて等しい</strong>（= <InlineMath math="s" />）</li>,
              ] : [
                <li key="1">• Memiliki <strong className="text-yellow-300">6 sisi</strong> berbentuk persegi yang sama besar</li>,
                <li key="2">• Memiliki <strong className="text-yellow-300">12 rusuk</strong> yang sama panjang</li>,
                <li key="3">• Memiliki <strong className="text-yellow-300">8 titik sudut</strong></li>,
                <li key="4">• Memiliki <strong className="text-yellow-300">12 diagonal bidang</strong></li>,
                <li key="5">• Memiliki <strong className="text-yellow-300">4 diagonal ruang</strong></li>,
                <li key="6">• Memiliki <strong className="text-yellow-300">6 bidang diagonal</strong></li>,
                <li key="7">• Setiap sudut pertemuannya selalu <strong className="text-yellow-300">90°</strong></li>,
                <li key="8">• Panjang, lebar, dan tingginya <strong className="text-yellow-300">selalu sama</strong> (= <InlineMath math="s" />)</li>,
              ])}
            </ul>
          </div>
          <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
            {lang==="en"
              ? <span>💡 <strong>Cube vs Cuboid:</strong> If all rectangular faces of a cuboid have the same size, it becomes a cube! A cube is a special case of a cuboid.</span>
              : lang==="ja"
              ? <span>💡 <strong>立方体と直方体：</strong>直方体のすべての面が同じ大きさの正方形になると立方体になります！立方体は直方体の特別な場合です。</span>
              : <span>💡 <strong>Kubus vs Balok:</strong> Jika semua sisi persegi panjang sebuah balok berukuran sama, ia menjadi kubus! Kubus adalah kasus khusus dari balok.</span>}
          </blockquote>
        </div>
      ),
    },
    {
      title: t.s1, icon: "🔍",
      content: (
        <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">
              {lang==="en" ? "① Edges (12 total)" : lang==="ja" ? "① 辺（12本）" : "① Rusuk (12 buah)"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>An edge is a <strong>line segment where two faces meet</strong>. All 12 edges of a cube are equal in length (<InlineMath math="= s" />).</span>
                : lang==="ja"
                ? <span>辺とは<strong>2つの面が交わる線分</strong>です。立方体の12本の辺はすべて同じ長さ（<InlineMath math="= s" />）です。</span>
                : <span>Rusuk adalah <strong>ruas garis yang merupakan pertemuan dua sisi</strong> kubus. Semua rusuk kubus sama panjang (<InlineMath math="= s" />).</span>}
            </p>
            <RusukAnimSVG lang={lang} />
          </div>
          <div className="bg-blue-950/40 border border-blue-700/40 rounded-lg p-4 space-y-2">
            <p className="text-blue-300 font-semibold">
              {lang==="en" ? "② Faces (6 total)" : lang==="ja" ? "② 面（6つ）" : "② Sisi / Bidang (6 buah)"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A face is a <strong>flat surface that bounds</strong> the cube. Each face is a square with area <InlineMath math="s^2" />. There are 6 faces: front, back, left, right, top, bottom.</span>
                : lang==="ja"
                ? <span>面とは立方体を<strong>囲む平らな面</strong>です。各面は面積<InlineMath math="s^2" />の正方形。前・後・左・右・上・下の6面があります。</span>
                : <span>Sisi adalah <strong>bidang yang membatasi</strong> kubus. Setiap sisi berbentuk persegi dengan luas <InlineMath math="s^2" />. Ada 6 sisi: depan, belakang, kiri, kanan, atas, bawah.</span>}
            </p>
            <SisiAnimSVG lang={lang} />
          </div>
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-4 space-y-2">
            <p className="text-yellow-300 font-semibold">
              {lang==="en" ? "③ Vertices (8 total)" : lang==="ja" ? "③ 頂点（8つ）" : "③ Titik Sudut (8 buah)"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A vertex is a <strong>point where three edges meet</strong>. Labeled A, B, C, D, E, F, G, H.</span>
                : lang==="ja"
                ? <span>頂点とは<strong>3つの辺が交わる点</strong>です。A, B, C, D, E, F, G, Hとラベル付けされます。</span>
                : <span>Titik sudut adalah <strong>titik pertemuan tiga rusuk</strong>. Diberi nama dengan huruf kapital (A, B, C, D, E, F, G, H).</span>}
            </p>
            <TitikSudutAnimSVG lang={lang} />
          </div>
          <div className="bg-green-950/40 border border-green-700/40 rounded-lg p-4 space-y-2">
            <p className="text-green-300 font-semibold">
              {lang==="en" ? "④ Face Diagonals (12 total)" : lang==="ja" ? "④ 面対角線（12本）" : "④ Diagonal Bidang (12 buah)"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A face diagonal <strong>connects two opposite vertices of one face</strong>. Each face has 2 → total 12.</span>
                : lang==="ja"
                ? <span>面対角線は<strong>1つの面の向かい合う2頂点を結ぶ</strong>線分。各面に2本 → 合計12本。</span>
                : <span>Diagonal bidang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dalam satu sisi</strong>. Setiap sisi memiliki 2 diagonal bidang → total 12.</span>}
            </p>
            <AllDiagonalBidangSVG lang={lang} />
            <div className="bg-green-950/60 rounded p-2 text-center"><BlockMath math="d_b = s\sqrt{2}" /></div>
          </div>
          <div className="bg-red-950/40 border border-red-700/40 rounded-lg p-4 space-y-2">
            <p className="text-red-300 font-semibold">
              {lang==="en" ? "⑤ Space Diagonals (4 total)" : lang==="ja" ? "⑤ 空間対角線（4本）" : "⑤ Diagonal Ruang (4 buah)"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A space diagonal <strong>connects two opposite vertices passing through the interior</strong> of the cube.</span>
                : lang==="ja"
                ? <span>空間対角線は<strong>立方体の内部を通り向かい合う2頂点を結ぶ</strong>線分です。</span>
                : <span>Diagonal ruang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dan melewati bagian dalam kubus</strong>.</span>}
            </p>
            <DiagonalRuangSVG lang={lang} />
            <div className="bg-red-950/60 rounded p-2 text-center"><BlockMath math="d_r = s\sqrt{3}" /></div>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-4 space-y-2">
            <p className="text-violet-300 font-semibold">
              {lang==="en" ? "⑥ Diagonal Planes (6 total)" : lang==="ja" ? "⑥ 対角面（6つ）" : "⑥ Bidang Diagonal (6 buah)"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A diagonal plane <strong>cuts through four vertices and two space diagonals</strong>. It is a rectangle (face diagonal × edge).</span>
                : lang==="ja"
                ? <span>対角面は<strong>4頂点と2本の空間対角線を通る平面</strong>です。長方形（面対角線×辺）の形をしています。</span>
                : <span>Bidang diagonal adalah <strong>bidang yang memotong melalui empat titik sudut dan dua diagonal ruang</strong>. Berbentuk persegi panjang (diagonal bidang × sisi).</span>}
            </p>
            <BidangDiagonalSVG lang={lang} />
            <BidangDiagonalVariasiGallery lang={lang} />
            <div className="bg-violet-950/60 rounded p-2 text-center">
              <BlockMath math="L_d = s \times s\sqrt{2} = s^2\sqrt{2}" />
            </div>
          </div>
          <div className={isDark ? "overflow-x-auto rounded-lg border border-slate-700" : "overflow-x-auto rounded-lg border border-gray-200"}>
            <table className="w-full text-xs text-center">
              <thead><tr className={isDark ? "bg-slate-800" : "bg-gray-100"}>
                <th className={`px-3 py-2 text-cyan-300 text-left ${isDark ? "border-r border-slate-700" : "border-r border-gray-200"}`}>
                  {lang==="en" ? "Element" : lang==="ja" ? "要素" : "Unsur"}
                </th>
                <th className={`px-3 py-2 text-cyan-300 ${isDark ? "border-r border-slate-700" : "border-r border-gray-200"}`}>
                  {lang==="en" ? "Count" : lang==="ja" ? "数" : "Jumlah"}
                </th>
                <th className="px-3 py-2 text-cyan-300">
                  {lang==="en" ? "Size" : lang==="ja" ? "大きさ" : "Ukuran"}
                </th>
              </tr></thead>
              <tbody>
                {unsurTableRows.map(([u,j,uk],i)=>(
                  <tr key={i} className={`${isDark ? "border-t border-slate-700" : "border-t border-gray-200"} ${i%2===0 ? (isDark?"bg-slate-900/40":"bg-blue-50/50") : (isDark?"bg-slate-800/30":"bg-gray-50")}`}>
                    <td className={`px-3 py-2 font-semibold text-left ${isDark ? "text-white/90 border-r border-slate-700" : "text-slate-700 border-r border-gray-200"}`}>{u}</td>
                    <td className={`px-3 py-2 text-yellow-300 ${isDark ? "border-r border-slate-700" : "border-r border-gray-200"}`}>{j}</td>
                    <td className="px-3 py-2 text-cyan-300">{uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      title: t.s2, icon: "📐",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <div className="bg-green-950/50 border border-green-700/40 rounded-lg p-4 space-y-3">
            <p className="text-green-300 font-semibold">
              {lang==="en" ? "📌 Derivation: Face Diagonal" : lang==="ja" ? "📌 導出：面対角線" : "📌 Penurunan: Diagonal Bidang"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>Take one square face with side <InlineMath math="s" />. The face diagonal is the diagonal of that square:</span>
                : lang==="ja"
                ? <span>一辺<InlineMath math="s" />の正方形の面を取ります。面対角線はその正方形の対角線です：</span>
                : <span>Ambil satu sisi kubus berbentuk persegi sisi <InlineMath math="s" />. Diagonal bidang adalah diagonal persegi tersebut:</span>}
            </p>
            <div className={isDark ? "bg-slate-800/60 rounded p-3" : "bg-gray-100 rounded p-3"}>
              <BlockMath math="d_b^2 = s^2 + s^2 = 2s^2" />
              <BlockMath math="\boxed{d_b = s\sqrt{2}}" />
            </div>
          </div>
          <div className="bg-red-950/50 border border-red-700/40 rounded-lg p-4 space-y-3">
            <p className="text-red-300 font-semibold">
              {lang==="en" ? "📌 Derivation: Space Diagonal" : lang==="ja" ? "📌 導出：空間対角線" : "📌 Penurunan: Diagonal Ruang"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>The space diagonal is the hypotenuse of a right triangle formed by one base edge (<InlineMath math="s" />), the base face diagonal (<InlineMath math="s\sqrt{2}" />), and the space diagonal itself:</span>
                : lang==="ja"
                ? <span>空間対角線は、底辺（<InlineMath math="s" />）、底面の面対角線（<InlineMath math="s\sqrt{2}" />）、空間対角線を辺とする直角三角形の斜辺です：</span>
                : <span>Diagonal ruang adalah sisi miring dari segitiga siku-siku yang dibentuk oleh satu sisi alas (<InlineMath math="s" />), diagonal bidang alas (<InlineMath math="s\sqrt{2}" />), dan diagonal ruang sendiri:</span>}
            </p>
            <div className={isDark ? "bg-slate-800/60 rounded p-3" : "bg-gray-100 rounded p-3"}>
              <BlockMath math="d_r^2 = s^2 + (s\sqrt{2})^2 = s^2 + 2s^2 = 3s^2" />
              <BlockMath math="\boxed{d_r = s\sqrt{3}}" />
            </div>
            <blockquote className="border-l-4 border-red-500 pl-3 text-red-200 text-xs italic">
              {lang==="en"
                ? <span>🔑 <strong>Memory tip:</strong> Face diagonal = <InlineMath math="s\sqrt{2}" /> (root 2), Space diagonal = <InlineMath math="s\sqrt{3}" /> (root 3)</span>
                : lang==="ja"
                ? <span>🔑 <strong>覚え方：</strong>面対角線 = <InlineMath math="s\sqrt{2}" />（√2倍）、空間対角線 = <InlineMath math="s\sqrt{3}" />（√3倍）</span>
                : <span>🔑 <strong>Cara mudah ingat:</strong> Diagonal bidang = <InlineMath math="s\sqrt{2}" /> (akar 2), Diagonal ruang = <InlineMath math="s\sqrt{3}" /> (akar 3)</span>}
            </blockquote>
          </div>
          <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-4 space-y-3">
            <p className="text-violet-300 font-semibold">
              {lang==="en" ? "📌 Diagonal Plane Area" : lang==="ja" ? "📌 対角面の面積" : "📌 Luas Bidang Diagonal"}
            </p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>The diagonal plane is a rectangle: length = face diagonal (<InlineMath math="s\sqrt{2}" />), width = cube edge (<InlineMath math="s" />):</span>
                : lang==="ja"
                ? <span>対角面は長方形：縦＝面対角線（<InlineMath math="s\sqrt{2}" />）、横＝辺（<InlineMath math="s" />）：</span>
                : <span>Bidang diagonal berbentuk persegi panjang dengan ukuran: panjang = diagonal bidang (<InlineMath math="s\sqrt{2}" />), lebar = sisi kubus (<InlineMath math="s" />):</span>}
            </p>
            <div className={isDark ? "bg-slate-800/60 rounded p-3" : "bg-gray-100 rounded p-3"}>
              <BlockMath math="\boxed{L_d = s \times s\sqrt{2} = s^2\sqrt{2}}" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t.s3, icon: "🧊",
      content: (
        <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {lang==="en"
              ? <span><strong className="text-cyan-300">A cube net</strong> is a 2D pattern that when folded forms a cube. There are exactly <strong className="text-yellow-300">11 different net patterns</strong>. Use the 3D cube below to see the unfolding process!</span>
              : lang==="ja"
              ? <span><strong className="text-cyan-300">展開図</strong>は折り畳むと立方体になる2Dパターンです。ちょうど<strong className="text-yellow-300">11種類の異なる展開図</strong>があります。下の3Dキューブで展開の様子を確認してください！</span>
              : <span><strong className="text-cyan-300">Jaring-jaring kubus</strong> adalah pola 2D yang jika dilipat akan membentuk kubus. Ada tepat <strong className="text-yellow-300">11 pola jaring-jaring</strong> yang berbeda untuk sebuah kubus. Gunakan kubus 3D di bawah untuk melihat proses "pembongkaran" kubus menjadi jaring-jaringnya!</span>}
          </p>
          <InteractiveCube3D lang={lang} />
          <div className="space-y-2">
            <p className="text-white/70 text-xs text-center">
              {lang==="en"
                ? <span>The cube above uses <strong className="text-cyan-300">Net #1 (Cross)</strong> when fully unfolded. Below are all <strong className="text-yellow-300">11 valid net patterns:</strong></span>
                : lang==="ja"
                ? <span>上の立方体は完全に展開すると<strong className="text-cyan-300">展開図 #1（十字型）</strong>になります。以下が有効な<strong className="text-yellow-300">11パターン：</strong></span>
                : <span>Kubus di atas menggunakan <strong className="text-cyan-300">Jaring #1 (Cross/Salib)</strong> saat dibongkar sepenuhnya. Di bawah ini adalah semua <strong className="text-yellow-300">11 pola jaring-jaring</strong> yang valid:</span>}
            </p>
            <NetGallery lang={lang} />
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600 space-y-1"}>
            <p>🔑 <strong className={isDark ? "text-white" : "text-slate-700"}>
              {lang==="en" ? "How to verify a net:" : lang==="ja" ? "展開図の確認方法：" : "Cara memverifikasi jaring-jaring:"}
            </strong></p>
            <p>
              {lang==="en"
                ? "Imagine folding each square. If 6 squares can cover all cube faces without overlap or gaps, it is a valid net!"
                : lang==="ja"
                ? "各正方形を折り畳むことを想像してください。6枚の正方形が重なりも隙間もなく全面を覆えれば有効な展開図です！"
                : "Bayangkan melipat setiap kotak. Jika 6 kotak bisa menutup semua sisi kubus tanpa tumpang tindih dan tanpa celah, maka itu adalah jaring-jaring yang valid!"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t.s4, icon: "🎨",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {lang==="en"
              ? <span><strong className="text-orange-300">Surface area</strong> is the total area of all faces. Imagine wrapping a cube-shaped box with gift paper — how much paper do you need?</span>
              : lang==="ja"
              ? <span><strong className="text-orange-300">表面積</strong>はすべての面の合計面積です。立方体の箱をプレゼント用紙で包む場合、どれだけの紙が必要でしょうか？</span>
              : <span><strong className="text-orange-300">Luas permukaan kubus</strong> adalah total luas semua sisi yang membungkus kubus. Bayangkan kamu ingin membungkus sebuah kotak berbentuk kubus dengan kertas kado — berapa kertas yang dibutuhkan?</span>}
          </p>
          <LuasPermukaanSVG lang={lang} />
          <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
            <p className="text-orange-300 font-semibold">
              {lang==="en" ? "📌 Formula Derivation:" : lang==="ja" ? "📌 公式の導出：" : "📌 Penurunan Rumus:"}
            </p>
            <div className="text-xs text-white/70 space-y-1">
              <p>
                {lang==="en"
                  ? <span>A cube has <strong>6 faces</strong>, each a <strong>square with area <InlineMath math="s^2" /></strong>.</span>
                  : lang==="ja"
                  ? <span>立方体には<strong>6つの面</strong>があり、各面は<strong>面積<InlineMath math="s^2" />の正方形</strong>です。</span>
                  : <span>Kubus punya <strong>6 sisi</strong>, masing-masing berbentuk <strong>persegi dengan luas <InlineMath math="s^2" /></strong>.</span>}
              </p>
            </div>
            <div className={isDark ? "bg-slate-800/60 rounded p-3" : "bg-gray-100 rounded p-3"}>
              <BlockMath math="L_p = 6 \times s^2" />
              <BlockMath math="\boxed{L = 6s^2}" />
            </div>
          </div>
          <blockquote className="border-l-4 border-orange-500 pl-3 text-orange-200 text-xs italic">
            {lang==="en"
              ? <span>💡 <strong>Memory tip:</strong> A cube has 6 identical square faces → multiply the area of 1 face by 6.</span>
              : lang==="ja"
              ? <span>💡 <strong>覚え方：</strong>立方体には6つの同じ正方形の面がある → 1面の面積を6倍するだけ。</span>
              : <span>💡 <strong>Trik mengingat:</strong> Kubus punya 6 sisi persegi yang identik → kalikan luas 1 sisi dengan 6.</span>}
          </blockquote>
        </div>
      ),
    },
    {
      title: t.s5, icon: "📦",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {lang==="en"
              ? <span><strong className="text-blue-300">Volume</strong> measures how much space a cube occupies. Imagine the cube made of many tiny unit cubes packed tightly:</span>
              : lang==="ja"
              ? <span><strong className="text-blue-300">体積</strong>は立方体が占める空間の大きさを表します。小さな単位立方体をぎっしり詰め込んだものをイメージしてください：</span>
              : <span><strong className="text-blue-300">Volume kubus</strong> menyatakan seberapa besar "isi" atau "ruang" yang ditempati kubus. Bayangkan kubus terdiri dari lapisan-lapisan kecil berbentuk kubus satuan yang disusun rapat:</span>}
          </p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-1" : "bg-white/90 border border-gray-200 rounded-xl p-3 space-y-1"}>
            <p className="text-cyan-300 text-xs font-semibold font-body text-center">
              {lang==="en" ? "🌊 Cube filling with water — from empty to full"
                : lang==="ja" ? "🌊 立方体に水を注ぐ — 空から満水まで"
                : "🌊 Kubus diisi air — dari kosong hingga penuh"}
            </p>
            <WaterKubusAnimation lang={lang} />
            <p className={isDark ? "text-white/45 text-[10px] font-body text-center mt-4" : "text-slate-500 text-[10px] font-body text-center mt-4"}>
              {lang==="en" ? "Percentage shows the ratio of filled volume to total volume"
                : lang==="ja" ? "パーセントは全体積に対する充填体積の割合を示す"
                : "Persentase menunjukkan proporsi volume terisi terhadap volume total"}
            </p>
          </div>
          <div className="bg-blue-950/60 border border-blue-700/50 rounded-lg p-4 space-y-2">
            <p className="text-blue-300 font-semibold">
              {lang==="en" ? "📌 Formula Derivation:" : lang==="ja" ? "📌 公式の導出：" : "📌 Penurunan Rumus:"}
            </p>
            <div className="text-xs text-white/70 space-y-1">
              <p>
                {lang==="en"
                  ? <span>• Base area (square) = <InlineMath math="s \times s = s^2" /></span>
                  : lang==="ja"
                  ? <span>• 底面積（正方形）= <InlineMath math="s \times s = s^2" /></span>
                  : <span>• Luas alas persegi = <InlineMath math="s \times s = s^2" /></span>}
              </p>
              <p>
                {lang==="en"
                  ? <span>• Volume = Base area × height = <InlineMath math="s^2 \times s = s^3" /></span>
                  : lang==="ja"
                  ? <span>• 体積 = 底面積 × 高さ = <InlineMath math="s^2 \times s = s^3" /></span>
                  : <span>• Volume = Luas alas × tinggi = <InlineMath math="s^2 \times s = s^3" /></span>}
              </p>
            </div>
            <div className={isDark ? "bg-slate-800/60 rounded p-3" : "bg-gray-100 rounded p-3"}><BlockMath math="\boxed{V = s^3}" /></div>
            <p className={isDark ? "text-white/60 text-xs" : "text-slate-600 text-xs"}>
              {lang==="en"
                ? <span>Where <InlineMath math="s" /> is the edge length of the cube.</span>
                : lang==="ja"
                ? <span><InlineMath math="s" />は立方体の一辺の長さです。</span>
                : <span>Di mana <InlineMath math="s" /> adalah panjang satu rusuk kubus.</span>}
            </p>
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600 space-y-1"}>
            <p>🎯 <strong className={isDark ? "text-white" : "text-slate-700"}>
              {lang==="en" ? "Volume units:" : lang==="ja" ? "体積の単位：" : "Satuan volume:"}
            </strong></p>
            <p>
              {lang==="en"
                ? <span>• If <InlineMath math="s" /> is in cm → Volume in <InlineMath math="\text{cm}^3" /></span>
                : lang==="ja"
                ? <span>• <InlineMath math="s" />がcmなら → 体積は<InlineMath math="\text{cm}^3" /></span>
                : <span>• Jika <InlineMath math="s" /> dalam cm → Volume dalam <InlineMath math="\text{cm}^3" /></span>}
            </p>
            <p>
              {lang==="en"
                ? <span>• If <InlineMath math="s" /> is in m → Volume in <InlineMath math="\text{m}^3" /></span>
                : lang==="ja"
                ? <span>• <InlineMath math="s" />がmなら → 体積は<InlineMath math="\text{m}^3" /></span>
                : <span>• Jika <InlineMath math="s" /> dalam m → Volume dalam <InlineMath math="\text{m}^3" /></span>}
            </p>
            <p><InlineMath math="1 \text{ m}^3 = 1{,}000{,}000 \text{ cm}^3 = 10^6 \text{ cm}^3" /></p>
          </div>
        </div>
      ),
    },
    {
      title: t.s6, icon: "📊",
      content: (
        <div className="space-y-3 font-body">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(lang==="en" ? [
              { icon:"🔷", label:"8 Vertices", color:"text-yellow-300" },
              { icon:"📏", label:"12 Edges", color:"text-cyan-300" },
              { icon:"🟦", label:"6 Faces", color:"text-blue-300" },
              { icon:"📐", label:"12 Face Diagonals", color:"text-green-300" },
              { icon:"🔀", label:"4 Space Diagonals", color:"text-red-300" },
              { icon:"🔲", label:"6 Diagonal Planes", color:"text-violet-300" },
            ] : lang==="ja" ? [
              { icon:"🔷", label:"8 頂点", color:"text-yellow-300" },
              { icon:"📏", label:"12 辺", color:"text-cyan-300" },
              { icon:"🟦", label:"6 面", color:"text-blue-300" },
              { icon:"📐", label:"12 面対角線", color:"text-green-300" },
              { icon:"🔀", label:"4 空間対角線", color:"text-red-300" },
              { icon:"🔲", label:"6 対角面", color:"text-violet-300" },
            ] : [
              { icon:"🔷", label:"8 Titik Sudut", color:"text-yellow-300" },
              { icon:"📏", label:"12 Rusuk", color:"text-cyan-300" },
              { icon:"🟦", label:"6 Sisi", color:"text-blue-300" },
              { icon:"📐", label:"12 Diagonal Bidang", color:"text-green-300" },
              { icon:"🔀", label:"4 Diagonal Ruang", color:"text-red-300" },
              { icon:"🔲", label:"6 Bidang Diagonal", color:"text-violet-300" },
            ]).map(({ icon, label, color }) => (
              <div key={label} className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col items-center gap-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-1"}>
                <span className="text-2xl">{icon}</span>
                <span className={`text-xs font-semibold font-body text-center ${color}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className={isDark ? "overflow-x-auto rounded-lg border border-slate-700" : "overflow-x-auto rounded-lg border border-gray-200"}>
            <table className="w-full text-xs text-center">
              <thead><tr className={isDark ? "bg-slate-800" : "bg-gray-100"}>
                <th className={`px-3 py-2 text-cyan-300 text-left ${isDark ? "border-r border-slate-700" : "border-r border-gray-200"}`}>
                  {lang==="en" ? "Quantity" : lang==="ja" ? "量" : "Besaran"}
                </th>
                <th className={`px-3 py-2 text-cyan-300 ${isDark ? "border-r border-slate-700" : "border-r border-gray-200"}`}>
                  {lang==="en" ? "Formula" : lang==="ja" ? "公式" : "Rumus"}
                </th>
                <th className="px-3 py-2 text-cyan-300">
                  {lang==="en" ? "Note" : lang==="ja" ? "備考" : "Catatan"}
                </th>
              </tr></thead>
              <tbody>
                {summaryTableRows.map(([b,r,c],i)=>(
                  <tr key={i} className={`${isDark ? "border-t border-slate-700" : "border-t border-gray-200"} ${i%2===0 ? (isDark?"bg-slate-900/40":"bg-blue-50/50") : (isDark?"bg-slate-800/30":"bg-gray-50")}`}>
                    <td className={`px-3 py-2 font-semibold text-left ${isDark ? "text-white/90 border-r border-slate-700" : "text-slate-700 border-r border-gray-200"}`}>{b}</td>
                    <td className={`px-3 py-2 text-yellow-300 font-mono ${isDark ? "border-r border-slate-700" : "border-r border-gray-200"}`}>{r}</td>
                    <td className={`px-3 py-2 text-left ${isDark ? "text-white/55" : "text-slate-500"}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p>🚀 <strong>
              {lang==="en" ? "Key insight: " : lang==="ja" ? "重要なポイント：" : "Kunci utama kubus: "}
            </strong>
              {lang==="en"
                ? <span>All formulas depend on <strong className="text-yellow-300">just one variable: s (edge length)</strong>! Know <InlineMath math="s" />, and you can calculate everything.</span>
                : lang==="ja"
                ? <span>すべての公式は<strong className="text-yellow-300">たった1つの変数 s（辺の長さ）</strong>に依存します！<InlineMath math="s" />がわかれば、すべてを計算できます。</span>
                : <span>Semua rumus bergantung pada <strong className="text-yellow-300">satu variabel saja: s (panjang rusuk)</strong>! Kalau kamu tahu <InlineMath math="s" />, kamu bisa menghitung segalanya.</span>}
            </p>
          </div>
        </div>
      ),
    },
  ];

  // ── Example problems
  const easyLabel = t.easy, medLabel = t.medium, hardLabel = t.hard;

  const luasExamples: Ex[] = [
    {
      level: easyLabel, color:"text-green-400", bg: isDark ? "bg-green-950/30" : "bg-green-50", border: isDark ? "border-green-700/50" : "border-green-300", badgeBg: isDark ? "bg-green-900/60" : "bg-green-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>A cube-shaped gift box has an edge length of <InlineMath math="8 \text{ cm}" />.</p>
            <p>What is the minimum area of wrapping paper needed to cover the entire box?</p>
          </> : lang==="ja" ? <>
            <p>一辺<InlineMath math="8 \text{ cm}" />の立方体形のプレゼント箱があります。</p>
            <p>箱全体を包むのに必要な包装紙の最小面積を求めなさい。</p>
          </> : <>
            <p>Sebuah kotak kado berbentuk kubus dengan panjang rusuk <InlineMath math="8 \text{ cm}" />.</p>
            <p>Berapa luas kertas minimum yang dibutuhkan untuk membungkus seluruh kotak tersebut?</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="L = 6s^2 = 6 \times 8^2 = 6 \times 64 = 384 \text{ cm}^2" />
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-3" : "bg-green-50 border border-green-300 rounded p-3"}>
            <p className={isDark ? "text-green-300 font-semibold" : "text-green-700 font-semibold"}>✅ {lang==="en"?"Answer":"答え"}: <InlineMath math="384 \text{ cm}^2" /></p>
          </div>
        </div>
      ),
    },
    {
      level: medLabel, color:"text-yellow-400", bg: isDark ? "bg-yellow-950/30" : "bg-yellow-50", border: isDark ? "border-yellow-700/50" : "border-yellow-300", badgeBg: isDark ? "bg-yellow-900/60" : "bg-yellow-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>The surface area of a cube is <InlineMath math="600 \text{ cm}^2" />.</p>
            <p>Find: (a) edge length, (b) face diagonal length, (c) space diagonal length.</p>
          </> : lang==="ja" ? <>
            <p>ある立方体の表面積は<InlineMath math="600 \text{ cm}^2" />です。</p>
            <p>（a）辺の長さ、（b）面対角線の長さ、（c）空間対角線の長さを求めなさい。</p>
          </> : <>
            <p>Luas permukaan sebuah kubus adalah <InlineMath math="600 \text{ cm}^2" />.</p>
            <p>Tentukan: (a) panjang rusuknya, (b) panjang diagonal bidang, (c) panjang diagonal ruang.</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-yellow-400 font-semibold">(a) {lang==="en"?"Edge length:":lang==="ja"?"辺の長さ：":"Panjang rusuk:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="6s^2 = 600 \Rightarrow s^2 = 100 \Rightarrow s = 10 \text{ cm}" />
          </div>
          <p className="text-yellow-400 font-semibold">(b) {lang==="en"?"Face diagonal:":lang==="ja"?"面対角線：":"Diagonal bidang:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="d_b = s\sqrt{2} = 10\sqrt{2} \approx 14{,}14 \text{ cm}" />
          </div>
          <p className="text-yellow-400 font-semibold">(c) {lang==="en"?"Space diagonal:":lang==="ja"?"空間対角線：":"Diagonal ruang:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="d_r = s\sqrt{3} = 10\sqrt{3} \approx 17{,}32 \text{ cm}" />
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs text-white/80 space-y-0.5" : "bg-yellow-50 border border-yellow-300 rounded p-3 text-xs text-slate-700 space-y-0.5"}>
            <p>✅ <InlineMath math="s = 10 \text{ cm}" />, <InlineMath math="d_b = 10\sqrt{2} \text{ cm}" />, <InlineMath math="d_r = 10\sqrt{3} \text{ cm}" /></p>
          </div>
        </div>
      ),
    },
    {
      level: hardLabel, color:"text-red-400", bg: isDark ? "bg-red-950/30" : "bg-red-50", border: isDark ? "border-red-700/50" : "border-red-300", badgeBg: isDark ? "bg-red-900/60" : "bg-red-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>A cube-shaped aquarium has a capacity of <InlineMath math="125 \text{ liters}" />.</p>
            <p>If all sides (except the top) are made of glass at <InlineMath math="\$120{,}000/\text{m}^2" />,</p>
            <p>what is the total cost of glass for the aquarium?</p>
          </> : lang==="ja" ? <>
            <p>立方体形の水槽の容量は<InlineMath math="125 \text{ L}" />です。</p>
            <p>上面を除くすべての面が<InlineMath math="\$120{,}000/\text{m}^2" />のガラスでできているとき、</p>
            <p>ガラスの総費用を求めなさい。</p>
          </> : <>
            <p>Sebuah akuarium berbentuk kubus dengan kapasitas <InlineMath math="125 \text{ liter}" />.</p>
            <p>Jika semua sisi (kecuali bagian atas) terbuat dari kaca seharga <InlineMath math="Rp\,120.000/\text{m}^2" />,</p>
            <p>berapa total biaya kaca untuk akuarium tersebut?</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold">{t.step} 1 — {lang==="en"?"Find edge from volume:":lang==="ja"?"体積から辺を求める：":"Cari panjang rusuk dari volume:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1" : "bg-gray-100 border border-gray-200 rounded p-3 text-xs text-slate-600 space-y-1"}>
            <p><InlineMath math="125 \text{ L} = 125{,}000 \text{ cm}^3" /></p>
            <BlockMath math="s^3 = 125{,}000 \Rightarrow s = \sqrt[3]{125{,}000} = 50 \text{ cm} = 0{,}5 \text{ m}" />
          </div>
          <p className="text-red-400 font-semibold">{t.step} 2 — {lang==="en"?"Calculate glass area (5 sides, no top):":lang==="ja"?"ガラス面積を計算（5面、上面なし）：":"Hitung luas kaca (5 sisi, tanpa tutup atas):"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="L = 5 \times s^2 = 5 \times (0{,}5)^2 = 5 \times 0{,}25 = 1{,}25 \text{ m}^2" />
          </div>
          <p className="text-red-400 font-semibold">{t.step} 3 — {lang==="en"?"Calculate cost:":lang==="ja"?"費用を計算：":"Hitung biaya:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            {lang==="id"
              ? <BlockMath math="\text{Biaya} = 1{,}25 \times 120.000 = Rp\,150.000" />
              : <BlockMath math="1{,}25 \times 120{,}000 = \$150{,}000" />}
          </div>
          <div className={isDark ? "bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5" : "bg-red-50 border border-red-300 rounded p-3 text-xs space-y-0.5"}>
            <p className={isDark ? "text-red-300 font-semibold" : "text-red-700 font-semibold"}>✅ {lang==="en"?"Answer:":lang==="ja"?"答え：":"Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang==="en"?"Edge = 50 cm = 0.5 m":lang==="ja"?"辺 = 50 cm = 0.5 m":"Rusuk akuarium = 50 cm = 0,5 m"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang==="en"?"Glass area = 1.25 m²":lang==="ja"?"ガラス面積 = 1.25 m²":"Luas kaca = 1,25 m²"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang==="en"?"Total cost = ":lang==="ja"?"合計費用 = ":"Total biaya = "}<strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>{lang==="id"?"Rp 150.000":"$150,000"}</strong></p>
          </div>
        </div>
      ),
    },
  ];

  const volExamples: Ex[] = [
    {
      level: easyLabel, color:"text-green-400", bg: isDark ? "bg-green-950/30" : "bg-green-50", border: isDark ? "border-green-700/50" : "border-green-300", badgeBg: isDark ? "bg-green-900/60" : "bg-green-100",
      question: (
        <div className={`text-sm font-body ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en"
            ? <p>A cube-shaped die has an edge length of <InlineMath math="2 \text{ cm}" />. What is the volume?</p>
            : lang==="ja"
            ? <p>一辺<InlineMath math="2 \text{ cm}" />の立方体のサイコロがあります。体積を求めなさい。</p>
            : <p>Sebuah dadu berbentuk kubus memiliki panjang rusuk <InlineMath math="2 \text{ cm}" />. Berapa volume dadu tersebut?</p>}
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="V = s^3 = 2^3 = 8 \text{ cm}^3" />
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-2" : "bg-green-50 border border-green-300 rounded p-2"}>
            <p className={isDark ? "text-green-300 font-semibold text-xs" : "text-green-700 font-semibold text-xs"}>✅ {lang==="en"?"Volume":"体積" } = <InlineMath math="8 \text{ cm}^3" /></p>
          </div>
        </div>
      ),
    },
    {
      level: medLabel, color:"text-yellow-400", bg: isDark ? "bg-yellow-950/30" : "bg-yellow-50", border: isDark ? "border-yellow-700/50" : "border-yellow-300", badgeBg: isDark ? "bg-yellow-900/60" : "bg-yellow-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>A cube-shaped bathtub can hold <InlineMath math="1 \text{ m}^3" /> of water.</p>
            <p>If filled to <InlineMath math="75\%" /> capacity, how many liters of water are inside?</p>
            <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>(<InlineMath math="1 \text{ m}^3 = 1{,}000 \text{ liters}" />)</p>
          </> : lang==="ja" ? <>
            <p>立方体形の浴槽が<InlineMath math="1 \text{ m}^3" />の水を入れられます。</p>
            <p><InlineMath math="75\%" />まで水を入れると、何リットルになりますか？</p>
            <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>（<InlineMath math="1 \text{ m}^3 = 1{,}000 \text{ L}" />）</p>
          </> : <>
            <p>Sebuah bak mandi berbentuk kubus dapat menampung <InlineMath math="1 \text{ m}^3" /> air.</p>
            <p>Jika bak diisi air hingga <InlineMath math="75\%" /> kapasitasnya, berapa liter air di dalamnya?</p>
            <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>(<InlineMath math="1 \text{ m}^3 = 1.000 \text{ liter}" />)</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2" : "bg-gray-100 border border-gray-200 rounded p-3 space-y-2"}>
            <BlockMath math="V_t = 1 \text{ m}^3 = 1{,}000 \text{ L}" />
            <BlockMath math="V_{75\%} = 75\% \times 1{,}000 = 750 \text{ L}" />
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-2" : "bg-yellow-50 border border-yellow-300 rounded p-2"}>
            <p className={isDark ? "text-yellow-300 font-semibold text-xs" : "text-yellow-700 font-semibold text-xs"}>✅ {lang==="en"?"Volume of water = 750 L":lang==="ja"?"水の体積 = 750 L":"Volume air = 750 liter"}</p>
          </div>
        </div>
      ),
    },
    {
      level: hardLabel, color:"text-red-400", bg: isDark ? "bg-red-950/30" : "bg-red-50", border: isDark ? "border-red-700/50" : "border-red-300", badgeBg: isDark ? "bg-red-900/60" : "bg-red-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>A large cube with edge <InlineMath math="12 \text{ cm}" /> is filled with small cubes of edge <InlineMath math="2 \text{ cm}" />.</p>
            <p>How many small cubes fit? If each small cube weighs <InlineMath math="4 \text{ g}" />, what is the total weight?</p>
          </> : lang==="ja" ? <>
            <p>一辺<InlineMath math="12 \text{ cm}" />の大きな立方体に一辺<InlineMath math="2 \text{ cm}" />の小さな立方体を詰めます。</p>
            <p>何個入りますか？各小立方体の重さが<InlineMath math="4 \text{ g}" />のとき、合計重量は？</p>
          </> : <>
            <p>Sebuah kubus besar dengan rusuk <InlineMath math="12 \text{ cm}" /> diisi dengan kubus-kubus kecil berrusuk <InlineMath math="2 \text{ cm}" />.</p>
            <p>Berapa banyak kubus kecil yang dapat mengisi kubus besar? Jika setiap kubus kecil beratnya <InlineMath math="4 \text{ g}" />, berapa total beratnya?</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs" : "bg-gray-100 border border-gray-200 rounded p-3 space-y-2 text-xs"}>
            <BlockMath math="V_b = 12^3 = 1{,}728 \text{ cm}^3" />
            <BlockMath math="V_k = 2^3 = 8 \text{ cm}^3" />
            <BlockMath math="n = \frac{1{,}728}{8} = 216" />
            <BlockMath math="W = 216 \times 4 = 864 \text{ g}" />
          </div>
          <div className={isDark ? "bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5" : "bg-red-50 border border-red-300 rounded p-3 text-xs space-y-0.5"}>
            <p className={isDark ? "text-red-300 font-semibold" : "text-red-700 font-semibold"}>✅ {lang==="en"?"Answer:":lang==="ja"?"答え：":"Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang==="en"?"Small cubes =":lang==="ja"?"小立方体の数 =":"Banyak kubus kecil ="} <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>216</strong></p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang==="en"?"Total weight =":lang==="ja"?"合計重量 =":"Total berat ="} <strong className={isDark ? "text-yellow-300" : "text-yellow-700"}>864 g</strong></p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            💡 <strong>{lang==="en"?"Check:":lang==="ja"?"確認：":"Cek:"}</strong> <InlineMath math="\frac{12}{2} = 6" /> {lang==="en"?"per dimension → ":lang==="ja"?"（各辺）→ ":""} <InlineMath math="6^3 = 216" /> ✓
          </div>
        </div>
      ),
    },
  ];

  const kerangkaExamples: Ex[] = [
    {
      level: easyLabel, color:"text-green-400", bg: isDark ? "bg-green-950/30" : "bg-green-50", border: isDark ? "border-green-700/50" : "border-green-300", badgeBg: isDark ? "bg-green-900/60" : "bg-green-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>A cube wire frame has an edge length of <InlineMath math="9 \text{ cm}" />.</p>
            <p>What is the minimum length of wire needed?</p>
          </> : lang==="ja" ? <>
            <p>一辺<InlineMath math="9 \text{ cm}" />の立方体の針金模型があります。</p>
            <p>必要な針金の最短の長さを求めなさい。</p>
          </> : <>
            <p>Sebuah kerangka kubus dibuat dari kawat. Panjang rusuk kubus tersebut adalah <InlineMath math="9 \text{ cm}" />.</p>
            <p>Berapa panjang kawat minimal yang dibutuhkan untuk membuat kerangka kubus itu?</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1 text-xs text-white/70" : "bg-gray-100 border border-gray-200 rounded p-3 space-y-1 text-xs text-slate-600"}>
            <p>{lang==="en"?"A cube has ":lang==="ja"?"立方体には":"Kubus memiliki "}<strong className={isDark ? "text-white" : "text-slate-700"}>{lang==="en"?"12 edges":lang==="ja"?"12本の辺":"12 rusuk"}</strong>, {lang==="en"?"all equal.":lang==="ja"?"すべて同じ長さ。":"semuanya sama panjang."}</p>
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="K = 12 \times s = 12 \times 9 = 108 \text{ cm}" />
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-3" : "bg-green-50 border border-green-300 rounded p-3"}>
            <p className={isDark ? "text-green-300 font-semibold" : "text-green-700 font-semibold"}>✅ {lang==="en"?"Wire length = ":lang==="ja"?"針金の長さ = ":"Panjang kawat = "}<InlineMath math="108 \text{ cm}" /></p>
          </div>
        </div>
      ),
    },
    {
      level: medLabel, color:"text-yellow-400", bg: isDark ? "bg-yellow-950/30" : "bg-yellow-50", border: isDark ? "border-yellow-700/50" : "border-yellow-300", badgeBg: isDark ? "bg-yellow-900/60" : "bg-yellow-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>A cube wire frame uses <InlineMath math="144 \text{ cm}" /> of wire.</p>
            <p>Find: (a) edge length, (b) surface area, (c) volume.</p>
          </> : lang==="ja" ? <>
            <p>立方体の針金模型に<InlineMath math="144 \text{ cm}" />の針金を使います。</p>
            <p>（a）辺の長さ、（b）表面積、（c）体積を求めなさい。</p>
          </> : <>
            <p>Kerangka kubus dibuat menggunakan kawat sepanjang <InlineMath math="144 \text{ cm}" />.</p>
            <p>Tentukan: (a) panjang rusuk kubus, (b) luas permukaan kubus, (c) volume kubus.</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-yellow-400 font-semibold">(a) {lang==="en"?"Edge:":lang==="ja"?"辺：":"Panjang rusuk:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="K = 12s \Rightarrow 144 = 12s \Rightarrow s = \frac{144}{12} = 12 \text{ cm}" />
          </div>
          <p className="text-yellow-400 font-semibold">(b) {lang==="en"?"Surface area:":lang==="ja"?"表面積：":"Luas permukaan:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="L = 6s^2 = 6 \times 12^2 = 6 \times 144 = 864 \text{ cm}^2" />
          </div>
          <p className="text-yellow-400 font-semibold">(c) {lang==="en"?"Volume:":lang==="ja"?"体積：":"Volume:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="V = s^3 = 12^3 = 1{,}728 \text{ cm}^3" />
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs text-white/80 space-y-0.5" : "bg-yellow-50 border border-yellow-300 rounded p-3 text-xs text-slate-700 space-y-0.5"}>
            <p>• s = <InlineMath math="12 \text{ cm}" /></p>
            <p>• L = <InlineMath math="864 \text{ cm}^2" /></p>
            <p>• V = <InlineMath math="1{,}728 \text{ cm}^3" /></p>
          </div>
        </div>
      ),
    },
    {
      level: hardLabel, color:"text-red-400", bg: isDark ? "bg-red-950/30" : "bg-red-50", border: isDark ? "border-red-700/50" : "border-red-300", badgeBg: isDark ? "bg-red-900/60" : "bg-red-100",
      question: (
        <div className={`text-sm font-body space-y-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {lang==="en" ? <>
            <p>Three cube frames are made. Their edges are three consecutive integers (in cm).</p>
            <p>Total wire used = <InlineMath math="432 \text{ cm}" />. Find:</p>
            <p>(a) Edge length of each cube, (b) Volume of the largest, (c) Surface area of the smallest</p>
          </> : lang==="ja" ? <>
            <p>3つの立方体の針金模型を作ります。辺の長さは連続する3つの整数（cm単位）です。</p>
            <p>使用した針金の合計は<InlineMath math="432 \text{ cm}" />。次を求めなさい：</p>
            <p>（a）各立方体の辺の長さ、（b）最大の体積、（c）最小の表面積</p>
          </> : <>
            <p>Tiga kerangka kubus dibuat dari kawat. Panjang rusuk ketiga kubus merupakan tiga bilangan bulat berurutan (dalam cm).</p>
            <p>Jika total panjang kawat untuk ketiga kerangka tersebut adalah <InlineMath math="432 \text{ cm}" />, tentukan:</p>
            <p>(a) Panjang rusuk masing-masing, (b) Volume kubus terbesar, (c) Luas permukaan kubus terkecil</p>
          </>}
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold">{t.step} 1</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1 text-xs text-white/70" : "bg-gray-100 border border-gray-200 rounded p-3 space-y-1 text-xs text-slate-600"}>
            <p>{lang==="en"?"Let edges be n, n+1, n+2 (cm)":lang==="ja"?"辺をn, n+1, n+2（cm）とおく":"Misalkan rusuk: n, n+1, n+2 (cm)"}</p>
          </div>
          <p className="text-red-400 font-semibold">{t.step} 2</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="12n + 12(n+1) + 12(n+2) = 432" />
            <BlockMath math="12(3n + 3) = 432" />
            <BlockMath math="3n + 3 = 36 \Rightarrow n = 11" />
          </div>
          <p className="text-red-400 font-semibold">(a)</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/80 space-y-0.5" : "bg-gray-100 border border-gray-200 rounded p-3 text-xs text-slate-700 space-y-0.5"}>
            <p>s₁ = <InlineMath math="11 \text{ cm}" />, s₂ = <InlineMath math="12 \text{ cm}" />, s₃ = <InlineMath math="13 \text{ cm}" /></p>
          </div>
          <p className="text-red-400 font-semibold">(b) s = 13 cm</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="V = 13^3 = 2{,}197 \text{ cm}^3" />
          </div>
          <p className="text-red-400 font-semibold">(c) s = 11 cm</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-200 rounded p-3"}>
            <BlockMath math="L = 6 \times 11^2 = 6 \times 121 = 726 \text{ cm}^2" />
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            💡 <InlineMath math="12(11+12+13) = 12 \times 36 = 432 \text{ cm}" /> ✓
          </div>
        </div>
      ),
    },
  ];

  // ── Slides
  const slides = [
    {
      title: t.slideIntro, icon: "🎯",
      content: (
        <div className="space-y-4 font-body">
          <SimpleRotatableCube lang={lang} />
          <div className="bg-card/60 border border-border rounded-xl p-4 text-sm text-white/75 leading-relaxed">
            <p>
              {lang==="en"
                ? <span>From gift boxes to dice, cubes are everywhere! Learn everything about <strong className="text-cyan-300">cubes</strong> — their elements, interactive 3D nets, and how to calculate <strong className="text-yellow-300">surface area</strong> and <strong className="text-green-300">volume</strong>.</span>
                : lang==="ja"
                ? <span>プレゼント箱からサイコロまで、立方体はどこにでもあります！<strong className="text-cyan-300">立方体</strong>のすべてを学びましょう — 要素、インタラクティブな3D展開図、<strong className="text-yellow-300">表面積</strong>と<strong className="text-green-300">体積</strong>の計算まで。</span>
                : <span>Dari kotak pembungkus kado hingga dadu permainan, kubus ada di mana-mana! Pelajari semua tentang <strong className="text-cyan-300">kubus</strong> — mulai dari unsur-unsurnya, jaring-jaring interaktif 3D, hingga cara menghitung <strong className="text-yellow-300">luas permukaan</strong> dan <strong className="text-green-300">volume</strong>-nya.</span>}
            </p>
          </div>
          <div className={isDark ? "bg-slate-800/50 border border-slate-600/40 rounded-xl p-3" : "bg-gray-100 border border-gray-200 rounded-xl p-3"}>
            <p className="text-xs text-cyan-300 font-semibold mb-2 text-center">
              {lang==="en" ? "📦 Examples of Cube-shaped Objects in Daily Life"
                : lang==="ja" ? "📦 日常生活の立方体形の物の例"
                : "📦 Contoh Benda Berbentuk Kubus dalam Kehidupan Sehari-hari"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { src:"/images/image_1776472007597.png", label:lang==="en"?"Rubik's Cube":lang==="ja"?"ルービックキューブ":"Rubik's Cube" },
                { src:"/images/image_1776472028361.png", label:lang==="en"?"Die":lang==="ja"?"サイコロ":"Dadu" },
                { src:"/images/image_1776472052129.png", label:lang==="en"?"Cube Aquarium":lang==="ja"?"立方体水槽":"Akuarium Kubus" },
                { src:"/images/image_1776472077288.png", label:lang==="en"?"Safe":lang==="ja"?"金庫":"Brankas" },
                { src:"/images/image_1776472112355.png", label:lang==="en"?"Gift Box":lang==="ja"?"プレゼント箱":"Kotak Hadiah" },
                { src:"/images/image_1776472132317.png", label:lang==="en"?"Ice Cube":lang==="ja"?"氷の塊":"Es Batu" },
                { src:"/images/image_1776472148527.png", label:lang==="en"?"Digital Clock":lang==="ja"?"デジタル時計":"Jam Digital" },
                { src:"/images/image_1776472171497.png", label:lang==="en"?"Bluetooth Speaker":lang==="ja"?"Bluetoothスピーカー":"Speaker Bluetooth" },
                { src:"/images/image_1776472196508.png", label:lang==="en"?"Bathtub":lang==="ja"?"浴槽":"Bak Mandi" },
              ].map(({ src, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className={`w-full aspect-square rounded-lg overflow-hidden ${isDark ? "border border-slate-600/50 bg-slate-900/40" : "border border-gray-200 bg-gray-100"}`}>
                    <img src={src} alt={label} className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[10px] text-center leading-tight ${isDark ? "text-white/65" : "text-slate-600"}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    { title: sections[0].title, icon: sections[0].icon, content: sections[0].content },
    {
      title: t.slideRusuk, icon: "📏",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">{lang==="en"?"① Edges (12 total)":lang==="ja"?"① 辺（12本）":"① Rusuk (12 buah)"}</p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>An edge is a <strong>line segment where two faces meet</strong>. On cube <strong className="text-cyan-300">ABCD.EFGH</strong>, all 12 edges are equal (<InlineMath math="= s" />).</span>
                : lang==="ja"
                ? <span>辺とは<strong>2つの面が交わる線分</strong>です。立方体<strong className="text-cyan-300">ABCD.EFGH</strong>において、12本の辺はすべて等しい（<InlineMath math="= s" />）。</span>
                : <span>Rusuk adalah <strong>ruas garis yang merupakan pertemuan dua sisi</strong> kubus. Pada kubus <strong className="text-cyan-300">ABCD.EFGH</strong>, semua rusuk sama panjang (<InlineMath math="= s" />).</span>}
            </p>
            <RusukAnimSVG lang={lang} />
          </div>
          <div className="bg-cyan-950/30 border border-cyan-700/40 rounded-lg p-3 space-y-3">
            <p className="text-xs text-cyan-200 font-semibold">
              {lang==="en"?"12 edges on cube ABCD.EFGH:":lang==="ja"?"立方体ABCD.EFGHの12本の辺：":"Penamaan 12 rusuk pada kubus ABCD.EFGH:"}
            </p>
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              {[
                { label: lang==="en"?"Base edges ABCD":lang==="ja"?"底面辺ABCD":"Rusuk alas ABCD", val:"AB, BC, CD, DA" },
                { label: lang==="en"?"Top edges EFGH":lang==="ja"?"上面辺EFGH":"Rusuk atas EFGH", val:"EF, FG, GH, HE" },
                { label: lang==="en"?"Lateral edges":lang==="ja"?"側面辺":"Rusuk tegak", val:"AE, BF, CG, DH" },
              ].map(({label,val}) => (
                <div key={label} className={isDark ? "rounded-lg bg-slate-900/60 border border-slate-700/60 p-3" : "rounded-lg bg-gray-100 border border-gray-200 p-3"}>
                  <p className="text-cyan-300 font-semibold mb-1">{label}</p>
                  <p className={isDark ? "text-white/75" : "text-gray-700"}>{val}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600"}>
            <p>🔑 <strong className="text-cyan-300">
              {lang==="en"?"12 edges, all length s":lang==="ja"?"12辺、すべて長さs":"Jumlah rusuk kubus = 12, semuanya memiliki panjang sama s"}
            </strong></p>
          </div>
        </div>
      ),
    },
    {
      title: t.slideSisi, icon: "🟦",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-blue-950/40 border border-blue-700/40 rounded-lg p-4 space-y-2">
            <p className="text-blue-300 font-semibold">{lang==="en"?"② Faces (6 total)":lang==="ja"?"② 面（6つ）":"② Sisi / Bidang (6 buah)"}</p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A face <strong>bounds the cube</strong>. Each face is a square with area <InlineMath math="s^2" />. On <strong className="text-blue-300">ABCD.EFGH</strong>, there are 6 faces:</span>
                : lang==="ja"
                ? <span>面は立方体を<strong>囲む平面</strong>です。各面は面積<InlineMath math="s^2" />の正方形。<strong className="text-blue-300">ABCD.EFGH</strong>には6つの面があります：</span>
                : <span>Sisi adalah <strong>bidang yang membatasi</strong> kubus. Setiap sisi berbentuk persegi dengan luas <InlineMath math="s^2" />. Pada kubus <strong className="text-blue-300">ABCD.EFGH</strong>:</span>}
            </p>
            <SisiAnimSVG lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(lang==="en"
              ? [["Base Face","ABCD"],["Top Face","EFGH"],["Front Face","ABFE"],["Back Face","DCGH"],["Left Face","ADHE"],["Right Face","BCGF"]]
              : lang==="ja"
              ? [["底面","ABCD"],["上面","EFGH"],["前面","ABFE"],["後面","DCGH"],["左面","ADHE"],["右面","BCGF"]]
              : [["Sisi Alas","ABCD"],["Sisi Atas","EFGH"],["Sisi Depan","ABFE"],["Sisi Belakang","DCGH"],["Sisi Kiri","ADHE"],["Sisi Kanan","BCGF"]]
            ).map(([label, val]) => (
              <div key={label} className={isDark ? "rounded-lg bg-slate-900/60 border border-slate-700/60 p-3" : "rounded-lg bg-gray-100 border border-gray-200 p-3"}>
                <p className="text-blue-300 font-semibold mb-1">{label}</p>
                <p className={isDark ? "text-white/75" : "text-gray-700"}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t.slideTitik, icon: "🔷",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-4 space-y-2">
            <p className="text-yellow-300 font-semibold">{lang==="en"?"③ Vertices (8 total)":lang==="ja"?"③ 頂点（8つ）":"③ Titik Sudut (8 buah)"}</p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A vertex is a <strong>point where three edges meet</strong>. On <strong className="text-yellow-300">ABCD.EFGH</strong>, there are 8 vertices: A, B, C, D (base) and E, F, G, H (top).</span>
                : lang==="ja"
                ? <span>頂点とは<strong>3辺が交わる点</strong>です。<strong className="text-yellow-300">ABCD.EFGH</strong>にはA, B, C, D（底面）とE, F, G, H（上面）の8頂点があります。</span>
                : <span>Titik sudut adalah <strong>titik pertemuan tiga rusuk</strong>. Pada kubus <strong className="text-yellow-300">ABCD.EFGH</strong>, terdapat 8 titik sudut.</span>}
            </p>
            <TitikSudutAnimSVG lang={lang} />
          </div>
        </div>
      ),
    },
    {
      title: t.slideDiagBidang, icon: "📐",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-green-950/40 border border-green-700/40 rounded-lg p-4 space-y-2">
            <p className="text-green-300 font-semibold">{lang==="en"?"④ Face Diagonals (12 total)":lang==="ja"?"④ 面対角線（12本）":"④ Diagonal Bidang (12 buah)"}</p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A face diagonal <strong>connects opposite vertices on one face</strong>. 6 faces × 2 = 12 total.</span>
                : lang==="ja"
                ? <span>面対角線は<strong>1面の向かい合う頂点を結ぶ</strong>線分。6面 × 2 = 合計12本。</span>
                : <span>Diagonal bidang adalah ruas garis yang menghubungkan <strong>dua titik sudut yang berhadapan dalam satu sisi</strong>. 6 sisi × 2 = 12 total.</span>}
            </p>
            <AllDiagonalBidangSVG lang={lang} />
            <div className="bg-green-950/60 rounded p-2 text-center"><BlockMath math="d_b = s\sqrt{2}" /></div>
          </div>
        </div>
      ),
    },
    {
      title: t.slideDiagRuang, icon: "🔀",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-red-950/40 border border-red-700/40 rounded-lg p-4 space-y-2">
            <p className="text-red-300 font-semibold">{lang==="en"?"⑤ Space Diagonals (4 total)":lang==="ja"?"⑤ 空間対角線（4本）":"⑤ Diagonal Ruang (4 buah)"}</p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A space diagonal <strong>connects opposite vertices through the interior</strong>. Cube ABCD.EFGH has exactly <strong className="text-red-300">4 space diagonals</strong>: AG, BH, CE, DF.</span>
                : lang==="ja"
                ? <span>空間対角線は<strong>立方体の内部を通り向かい合う頂点を結ぶ</strong>線分。ABCD.EFGHには<strong className="text-red-300">4本の空間対角線</strong>：AG, BH, CE, DF。</span>
                : <span>Diagonal ruang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dan melewati bagian dalam kubus</strong>. Kubus ABCD.EFGH memiliki tepat <strong className="text-red-300">4 diagonal ruang</strong>.</span>}
            </p>
            <div className="bg-red-950/60 rounded p-2 text-center"><BlockMath math="d_r = s\sqrt{3}" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key:"AG", color:"#ef4444", anim:"drGlow1" }, { key:"BH", color:"#f59e0b", anim:"drGlow2" },
              { key:"CE", color:"#22c55e", anim:"drGlow3" }, { key:"DF", color:"#a855f7", anim:"drGlow4" },
            ].map(({ key, color, anim }) => (
              <div key={key} className={isDark ? "bg-slate-900/70 rounded-xl p-3 flex flex-col items-center gap-1" : "bg-gray-100 rounded-xl p-3 flex flex-col items-center gap-1"} style={{ border:`1px solid ${color}80` }}>
                <p className="font-bold text-xs font-body" style={{ color }}>
                  {lang==="en"?"Diagonal ":lang==="ja"?"対角線 ":"Diagonal "}{key}
                </p>
                <svg className="w-full" viewBox="0 0 100 108">
                  <defs><style>{`@keyframes ${anim}{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style></defs>
                  <polygon points="8,95 62,95 84,77 30,77" fill={isDark?"#14532d22":"rgba(241,245,249,0.6)"} stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.8"/>
                  <polygon points="8,95 62,95 62,44 8,44" fill={isDark?"#0f172a":"rgba(241,245,249,0.85)"} stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.8"/>
                  <polygon points="62,95 84,77 84,26 62,44" fill={isDark?"#0f172a":"rgba(241,245,249,0.85)"} stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.8"/>
                  <polygon points="8,44 62,44 84,26 30,26" fill={isDark?"#1e293b":"rgba(226,232,240,0.7)"} stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.8"/>
                  <line x1="30" y1="77" x2="30" y2="26" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.6" strokeDasharray="3,2"/>
                  <line x1="30" y1="77" x2="84" y2="77" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.6" strokeDasharray="3,2"/>
                  <line x1="8" y1="44" x2="30" y2="26" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.6" strokeDasharray="3,2"/>
                  <line x1="8" y1="95" x2="30" y2="77" stroke={isDark?"#475569":"#94a3b8"} strokeWidth="0.6" strokeDasharray="3,2"/>
                  {key==="AG" && <line x1="8" y1="95" x2="84" y2="26" stroke={color} strokeWidth="2.2" style={{filter:`drop-shadow(0 0 6px ${color})`,animation:`${anim} 1.5s ease-in-out infinite`}}/>}
                  {key==="BH" && <line x1="62" y1="95" x2="30" y2="26" stroke={color} strokeWidth="2.2" style={{filter:`drop-shadow(0 0 6px ${color})`,animation:`${anim} 1.5s ease-in-out infinite 0.37s`}}/>}
                  {key==="CE" && <line x1="84" y1="77" x2="8" y2="44" stroke={color} strokeWidth="2.2" style={{filter:`drop-shadow(0 0 6px ${color})`,animation:`${anim} 1.5s ease-in-out infinite 0.74s`}}/>}
                  {key==="DF" && <line x1="30" y1="77" x2="62" y2="44" stroke={color} strokeWidth="2.2" style={{filter:`drop-shadow(0 0 6px ${color})`,animation:`${anim} 1.5s ease-in-out infinite 1.11s`}}/>}
                  {[["A",8,95],["B",62,95],["C",84,77],["D",30,77],["E",8,44],["F",62,44],["G",84,26],["H",30,26]].map(([l,x,y])=>(
                    <text key={l as string} x={(x as number)+2} y={(y as number)-3} fill={[key[0],key[1]].includes(l as string)?(isDark?"#fbbf24":"#b45309"):(isDark?"#94a3b8":"#475569")} fontSize="7" fontFamily="monospace" fontWeight="bold">{l}</text>
                  ))}
                </svg>
              </div>
            ))}
          </div>
          <div className={isDark ? "bg-slate-900/70 border border-amber-600/40 rounded-lg p-4 space-y-3" : "bg-white/90 border border-amber-600/40 rounded-lg p-4 space-y-3"}>
            <p className="text-amber-300 font-semibold text-xs">
              {lang==="en" ? "📐 Why space diagonal = s√3? — 2-step Pythagoras (sample: BH)"
                : lang==="ja" ? "📐 なぜ空間対角線 = s√3？ — 2段階の三平方の定理（例：BH）"
                : "📐 Mengapa diagonal ruang = s√3? — Pembuktian 2 langkah (sampel: BH)"}
            </p>
            <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs" : "bg-gray-100 border border-gray-200 rounded-lg p-3 space-y-2 text-xs"}>
              <p className={isDark ? "text-white/80 font-semibold" : "text-slate-700 font-semibold"}>
                {lang==="en"?"2-step proof:":lang==="ja"?"2段階の証明：":"Langkah pembuktian (2 tahap):"}
              </p>
              <div className={`space-y-1 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                <p><strong className="text-orange-400">{t.step} 1</strong> — {lang==="en"?"Find face diagonal BD (base ABCD):":lang==="ja"?"面対角線BD（底面ABCD）を求める：":"Cari diagonal bidang BD (pada sisi alas ABCD):"}</p>
              </div>
              <div className={isDark ? "bg-slate-900/60 rounded p-2 text-center space-y-1" : "bg-white/90 rounded p-2 text-center space-y-1"}>
                <BlockMath math="BD^2 = AB^2 + AD^2 = s^2 + s^2 = 2s^2"/>
                <BlockMath math="BD = s\sqrt{2}"/>
              </div>
              <div className={`space-y-1 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                <p><strong className="text-purple-400">{t.step} 2</strong> — {lang==="en"?"Find space diagonal BH (right triangle BDH, right angle at D):":lang==="ja"?"空間対角線BH（BDHの直角三角形、Dで直角）を求める：":"Cari diagonal ruang BH dengan segitiga BDH siku-siku di D:"}</p>
              </div>
              <div className={isDark ? "bg-slate-900/60 rounded p-2 text-center space-y-1" : "bg-white/90 rounded p-2 text-center space-y-1"}>
                <BlockMath math="BH^2 = BD^2 + DH^2"/>
                <BlockMath math="BH^2 = (s\sqrt{2})^2 + s^2 = 2s^2 + s^2 = 3s^2"/>
                <BlockMath math="\boxed{BH = s\sqrt{3}}"/>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t.slideBidangDiag, icon: "🔲",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-4 space-y-2">
            <p className="text-violet-300 font-semibold">{lang==="en"?"⑥ Diagonal Planes (6 total)":lang==="ja"?"⑥ 対角面（6つ）":"⑥ Bidang Diagonal (6 buah)"}</p>
            <p className="text-xs text-white/70">
              {lang==="en"
                ? <span>A diagonal plane <strong>cuts through 4 vertices and 2 space diagonals</strong>, forming a rectangle (face diagonal × edge).</span>
                : lang==="ja"
                ? <span>対角面は<strong>4頂点と2本の空間対角線を通る</strong>平面で、長方形（面対角線×辺）を形成します。</span>
                : <span>Bidang diagonal adalah <strong>bidang yang memotong melalui empat titik sudut dan dua diagonal ruang</strong>. Berbentuk persegi panjang (diagonal bidang × sisi).</span>}
            </p>
            <BidangDiagonalVariasiGallery lang={lang} />
            <div className="bg-violet-950/60 rounded p-2 text-center">
              <BlockMath math="L_d = s \times s\sqrt{2} = s^2\sqrt{2}" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t.slideJaring3D, icon: "🧊",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {lang==="en"
              ? <span><strong className="text-cyan-300">A cube net</strong> is a 2D pattern that folds into a cube. Use the 3D cube below to see the unfolding!</span>
              : lang==="ja"
              ? <span><strong className="text-cyan-300">展開図</strong>は折り畳むと立方体になる2Dパターンです。下の3Dキューブで展開を確認してください！</span>
              : <span><strong className="text-cyan-300">Jaring-jaring kubus</strong> adalah pola 2D yang jika dilipat akan membentuk kubus. Gunakan kubus 3D di bawah!</span>}
          </p>
          <InteractiveCube3D lang={lang} />
        </div>
      ),
    },
    {
      title: t.slideJaring11, icon: "🗂️",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <p className="text-white/70 text-xs text-center">
            {lang==="en"
              ? <span>There are exactly <strong className="text-yellow-300">11 different valid net patterns</strong> for a cube:</span>
              : lang==="ja"
              ? <span>立方体の展開図はちょうど<strong className="text-yellow-300">11種類</strong>あります：</span>
              : <span>Ada tepat <strong className="text-yellow-300">11 pola jaring-jaring</strong> yang berbeda dan valid untuk sebuah kubus:</span>}
          </p>
          <NetGallery lang={lang} />
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600 space-y-1"}>
            <p>🔑 <strong className={isDark ? "text-white" : "text-slate-700"}>{lang==="en"?"How to verify:":lang==="ja"?"確認方法：":"Cara memverifikasi:"}</strong></p>
            <p>
              {lang==="en"?"Fold each square mentally. If 6 squares cover all faces without overlap or gaps, it's a valid net!"
                :lang==="ja"?"各正方形を頭の中で折り畳む。重なりや隙間なく6面を覆えれば有効な展開図！"
                :"Bayangkan melipat setiap kotak. Jika 6 kotak bisa menutup semua sisi kubus tanpa tumpang tindih dan tanpa celah, maka itu adalah jaring-jaring yang valid!"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t.slideKerangka, icon: "🪡",
      content: (
        <div className="space-y-4">
          <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2" : "bg-white/90 border border-gray-200 rounded-xl p-4 space-y-2"}>
            <p className="text-cyan-300 font-semibold text-sm font-display">🪡 {t.slideKerangka}</p>
            <p className={isDark ? "text-white/70 text-xs font-body leading-relaxed" : "text-slate-600 text-xs font-body leading-relaxed"}>
              {lang==="en"
                ? <span>A cube frame is the skeleton of all 12 edges. Since all edges are <strong className="text-cyan-300">equal length (s)</strong>, total wire = <strong className="text-yellow-300">12 × s</strong>:</span>
                : lang==="ja"
                ? <span>立方体の枠は12本の辺の骨格。すべての辺が<strong className="text-cyan-300">同じ長さ(s)</strong>なので、合計針金 = <strong className="text-yellow-300">12 × s</strong>：</span>
                : <span>Kerangka kubus adalah rangka yang terbentuk dari semua rusuknya. Kubus memiliki <strong className={isDark ? "text-white" : "text-slate-700"}>12 rusuk</strong> yang <strong className="text-cyan-300">semuanya sama panjang</strong>. Total panjang rusuk = <strong className="text-yellow-300">12 × s</strong>:</span>}
            </p>
          </div>
          <InteractiveKerangkaKubus lang={lang} />
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p>🚀 <strong>
              {lang==="en"?"Key point: ":lang==="ja"?"ポイント：":"Kunci utama kubus: "}
            </strong>
              {lang==="en"
                ? <span>Because all edges are <strong className="text-yellow-300">equal (s)</strong>, the frame formula is simply <InlineMath math="K = 12s" />.</span>
                : lang==="ja"
                ? <span>すべての辺が<strong className="text-yellow-300">等しい(s)</strong>ので、公式は単純に<InlineMath math="K = 12s" />です。</span>
                : <span>Karena semua rusuk <strong className="text-yellow-300">sama panjang (s)</strong>, rumus kerangka cukup <InlineMath math="K = 12s" />.</span>}
            </p>
          </div>
        </div>
      ),
    },
    { title: sections[4].title, icon: sections[4].icon, content: sections[4].content },
    { title: sections[5].title, icon: sections[5].icon, content: sections[5].content },
    { title: sections[6].title, icon: sections[6].icon, content: sections[6].content },
    {
      title: t.slideContohKerangka, icon: "🪡",
      content: (
        <div className="space-y-4">
          <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2" : "bg-white/90 border border-gray-200 rounded-xl p-4 space-y-2"}>
            <p className="text-cyan-300 font-semibold text-sm font-display">🪡 {t.slideKerangka}</p>
            <div className={isDark ? "bg-slate-900/60 rounded-lg p-3 text-center" : "bg-gray-100 rounded-lg p-3 text-center"}>
              <BlockMath math="K_k = 12 \times s" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
              {(lang==="en"
                ? [["4 base edges","below"],["4 lateral edges","sides"],["4 top edges","above"]]
                : lang==="ja"
                ? [["底面辺 4本","下"],["側面辺 4本","側面"],["上面辺 4本","上"]]
                : [["4 rusuk alas","bawah"],["4 rusuk tegak","samping"],["4 rusuk atas","atas"]]
              ).map(([label, sub], i) => (
                <div key={i} className={`${["bg-blue-950/50 border-blue-700/40","bg-purple-950/50 border-purple-700/40","bg-teal-950/50 border-teal-700/40"][i]} border rounded p-2`}>
                  <p className={`${["text-blue-300","text-purple-300","text-teal-300"][i]} font-semibold`}>{label}</p>
                  <p className={isDark ? "text-white/60" : "text-slate-600"}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
          {kerangkaExamples.map((ex, i) => <ExampleCard key={`k${i}`} ex={ex} idx={i} prefix={t.prefixKerangka} lang={lang}/>)}
        </div>
      ),
    },
    {
      title: t.slideContohLuas, icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{t.exampleSubtitle}</p>
          {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix={t.prefixLuas} lang={lang}/>)}
        </div>
      ),
    },
    {
      title: t.slideContohVol, icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{t.exampleSubtitle}</p>
          {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix={t.prefixVol} lang={lang}/>)}
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
        <Layers className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {lang==="en" ? "CUBE" : lang==="ja" ? "立方体" : "KUBUS"}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>
        <div className="flex items-center justify-center gap-1.5 mb-5 flex-wrap">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { playPopSound(); setCurrentSlide(i); }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? "w-6 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400"
              }`} />
          ))}
        </div>
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden mb-5">
          <div className={`flex items-center gap-3 px-5 py-4 border-b border-border/50 ${isDark ? "bg-slate-800/40" : "bg-gray-100/80"}`}>
            <span className="text-2xl">{slide.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-body uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-500"}`}>
                {t.slideLabel} {currentSlide + 1} / {totalSlides}
              </p>
              <h2 className={`font-display text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{slide.title}</h2>
            </div>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>
        <div className="flex items-center justify-between gap-3 mb-8">
          <button onClick={goPrev} disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold font-body rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? "bg-slate-800/60 border border-slate-600 text-white/70 hover:bg-slate-700/60" : "bg-gray-100 border border-gray-300 text-slate-600 hover:bg-gray-200"}`}>
            {t.prev}
          </button>
          <span className={`text-xs font-body ${isDark ? "text-white/30" : "text-slate-400"}`}>{currentSlide + 1} / {totalSlides}</span>
          <button onClick={goNext} disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold font-body bg-primary/20 border border-primary/50 text-primary rounded-xl hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
            {t.next}
          </button>
        </div>
        <div className="text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KubusPage;
