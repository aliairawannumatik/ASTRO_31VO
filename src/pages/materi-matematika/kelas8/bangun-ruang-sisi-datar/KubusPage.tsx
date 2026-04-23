import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, RotateCcw, Layers } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import imgRubik    from "@assets/image_1776472007597.png";
import imgDadu     from "@assets/image_1776472028361.png";
import imgAkuarium from "@assets/image_1776472052129.png";
import imgBrankas  from "@assets/image_1776472077288.png";
import imgHadiah   from "@assets/image_1776472112355.png";
import imgEsBatu   from "@assets/image_1776472132317.png";
import imgJam      from "@assets/image_1776472148527.png";
import imgSpeaker  from "@assets/image_1776472171497.png";
import imgBak      from "@assets/image_1776472196508.png";

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE KERANGKA KUBUS — drag to rotate, click to unfold
   into 12 equal edges
───────────────────────────────────────────────────────────── */
type KubusEdgeAxis = "x" | "y" | "z";
// Each edge is described by (axis, "other-axis-1 corner", "other-axis-2 corner")
// in cube-local coords where the cube spans 0..KK_S in each axis.
type KubusEdgeSpec = { axis: KubusEdgeAxis; a: 0 | 1; b: 0 | 1; idx: number };

const KK_S = 110;          // edge length
const KK_THICK = 5;        // visual thickness of each edge bar
const KK_COLOR = "#22d3ee"; // cyan — all edges equal

const KK_EDGES: KubusEdgeSpec[] = [
  // 4 edges along x (vary y, z)
  { axis: "x", a: 0, b: 0, idx: 0 },
  { axis: "x", a: 1, b: 0, idx: 1 },
  { axis: "x", a: 0, b: 1, idx: 2 },
  { axis: "x", a: 1, b: 1, idx: 3 },
  // 4 edges along z (vary x, y)
  { axis: "z", a: 0, b: 0, idx: 0 },
  { axis: "z", a: 1, b: 0, idx: 1 },
  { axis: "z", a: 0, b: 1, idx: 2 },
  { axis: "z", a: 1, b: 1, idx: 3 },
  // 4 edges along y (vary x, z)
  { axis: "y", a: 0, b: 0, idx: 0 },
  { axis: "y", a: 1, b: 0, idx: 1 },
  { axis: "y", a: 0, b: 1, idx: 2 },
  { axis: "y", a: 1, b: 1, idx: 3 },
];

const InteractiveKerangkaKubus = () => {
  const [bongkar, setBongkar] = useState(false);
  const [rotX, setRotX] = useState(-18);
  const [rotY, setRotY] = useState(28);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, baseRotX: -18, baseRotY: 28 });

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

  // 12 edges arranged in 3 rows × 4 columns when "bongkar" is on.
  const flatIndex = (axis: KubusEdgeAxis, idx: number) => {
    const row = axis === "x" ? 0 : axis === "z" ? 1 : 2;
    return { row, col: idx };
  };

  // Each bar's NATURAL local box is (KK_S) wide × (KK_THICK) tall, lying along +x.
  // We use default transform-origin (center of the bar). The transform list applies
  // right-to-left: rotation happens around the bar's center, then translation places
  // that center at the desired point in the cube's coordinate frame.
  const getEdgeTransform = (e: KubusEdgeSpec) => {
    if (!bongkar) {
      // Cube-local coords: each axis spans 0..KK_S. Edge endpoints are determined by
      // its axis and which corner (a,b) of the perpendicular plane it sits at.
      const A = e.a * KK_S;
      const B = e.b * KK_S;
      let cx = 0, cy = 0, cz = 0, rot = "";
      if (e.axis === "x") {
        // edge runs along x at corner (y=A, z=B); center at (S/2, A, B)
        cx = KK_S / 2; cy = A; cz = B;
      } else if (e.axis === "z") {
        // edge runs along z at corner (x=A, y=B); after rotateY(-90) bar points +z; center at (A, B, S/2)
        cx = A; cy = B; cz = KK_S / 2; rot = " rotateY(-90deg)";
      } else {
        // y axis: edge runs along y at corner (x=A, z=B); after rotateZ(90) bar points +y; center at (A, S/2, B)
        cx = A; cy = KK_S / 2; cz = B; rot = " rotateZ(90deg)";
      }
      // Bar's natural top-left is (0,0); its center is (KK_S/2, KK_THICK/2).
      // To place center at (cx, cy, cz), translate by (cx - KK_S/2, cy - KK_THICK/2, cz).
      return `translate3d(${cx - KK_S / 2}px, ${cy - KK_THICK / 2}px, ${cz}px)${rot}`;
    }
    // Unfolded layout: 3 rows × 4 columns of horizontal bars.
    const gap = 8;
    const rowGap = 22;
    const baseRowY = KK_S + 36;
    const { row, col } = flatIndex(e.axis, e.idx);
    const totalW = 4 * KK_S + 3 * gap;
    const startX = (KK_S - totalW) / 2;
    const ex = startX + col * (KK_S + gap);
    const ey = baseRowY + row * rowGap;
    // Same convention: place bar's center at (ex + KK_S/2, ey, 0).
    return `translate3d(${ex}px, ${ey - KK_THICK / 2}px, 0px)`;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        Drag untuk memutar · Klik tombol untuk membongkar 12 rusuk yang sama panjang
      </p>

      <div
        className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{
          width: "100%",
          height: bongkar ? 360 : 280,
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          transition: "height 0.6s ease",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div style={{
          width: KK_S, height: KK_S,
          position: "relative",
          transformStyle: "preserve-3d",
          transformOrigin: `50% 50% ${KK_S / 2}px`,
          transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : "transform 1s ease",
        }}>
          {KK_EDGES.map((e, i) => (
            <div key={i} style={{
              position: "absolute", top: 0, left: 0,
              width: KK_S, height: KK_THICK,
              background: KK_COLOR,
              borderRadius: 3,
              transformStyle: "preserve-3d",
              transformOrigin: "0% 50% 50%",
              transform: getEdgeTransform(e),
              transition: "transform 1.4s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: `0 0 6px ${KK_COLOR}cc, inset 0 0 2px rgba(255,255,255,0.4)`,
            }} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={handleToggle}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body">
          {bongkar ? "⊟ Susun Kembali Kerangka" : "⊞ Bongkar Kerangka"}
        </button>
      </div>

      <div className="bg-slate-800/60 border border-cyan-700/40 rounded p-2 text-center text-[11px] font-body">
        <div className="inline-flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: KK_COLOR, boxShadow: `0 0 4px ${KK_COLOR}` }} />
          <span className="text-cyan-300 font-semibold">12 rusuk · semua sama panjang (s)</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-center">
        {bongkar ? (
          <BlockMath math="K = \underbrace{s + s + \cdots + s}_{12 \text{ rusuk}} = 12 \times s" />
        ) : (
          <BlockMath math="K_{\text{kerangka}} = 12 \times s" />
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SIMPLE ROTATABLE CUBE — drag to rotate, no unfolding
───────────────────────────────────────────────────────────── */
const CUBE_S = 90;
const CUBE_H = CUBE_S / 2;

const SIMPLE_FACE_COLORS: Record<FName, string> = {
  front:  "#3b82f6",
  back:   "#8b5cf6",
  left:   "#22c55e",
  right:  "#f97316",
  top:    "#eab308",
  bottom: "#ef4444",
};
const SIMPLE_FACE_LABELS: Record<FName, string> = {
  front: "DEPAN", back: "BELAKANG", left: "KIRI",
  right: "KANAN", top: "ATAS", bottom: "BAWAH",
};
const SIMPLE_FACE_TRANSFORMS: Record<FName, string> = {
  front:  `translateZ(${CUBE_H}px)`,
  back:   `rotateY(180deg) translateZ(${CUBE_H}px)`,
  left:   `rotateY(-90deg) translateZ(${CUBE_H}px)`,
  right:  `rotateY(90deg) translateZ(${CUBE_H}px)`,
  top:    `rotateX(90deg) translateZ(${CUBE_H}px)`,
  bottom: `rotateX(-90deg) translateZ(${CUBE_H}px)`,
};

const SimpleRotatableCube = () => {
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(35);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef      = useRef({ sx: 0, sy: 0, bx: -22, by: 35 });
  const isDragRef    = useRef(false);
  const rafRef       = useRef<number | null>(null);
  const tickRef      = useRef(0);
  const rotYRef      = useRef(35);

  /* ── Auto-rotation: horizontal spin + vertical oscillation ── */
  useEffect(() => {
    const animate = () => {
      if (!isDragRef.current) {
        tickRef.current += 1;
        rotYRef.current  += 0.22;                                   // slow left→right spin
        const rx = -18 + Math.sin(tickRef.current * 0.012) * 22;   // top↔bottom oscillation
        setRotY(rotYRef.current);
        setRotX(rx);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ── Drag handlers ── */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragRef.current = true;
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragRef.current) return;
    const newY = dragRef.current.by + (e.clientX - dragRef.current.sx) * 0.55;
    const newX = dragRef.current.bx - (e.clientY - dragRef.current.sy) * 0.55;
    rotYRef.current = newY;
    setRotY(newY);
    setRotX(newX);
  }, []);
  const onMouseUp = useCallback(() => {
    isDragRef.current = false;
    setIsDragging(false);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    isDragRef.current = true;
    setIsDragging(true);
    dragRef.current = { sx: t.clientX, sy: t.clientY, bx: rotX, by: rotY };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const newY = dragRef.current.by + (t.clientX - dragRef.current.sx) * 0.55;
    const newX = dragRef.current.bx - (t.clientY - dragRef.current.sy) * 0.55;
    rotYRef.current = newY;
    setRotY(newY);
    setRotX(newX);
  }, []);
  const onTouchEnd = useCallback(() => {
    isDragRef.current = false;
    setIsDragging(false);
  }, []);

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

  return (
    <div
      className="bg-slate-900/70 border border-slate-700/50 rounded-xl select-none"
      style={{ padding: "12px 0 8px", cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <p className="text-center text-white/40 font-body mb-1" style={{ fontSize: 9 }}>
        Berputar otomatis · Drag untuk memutar sendiri
      </p>
      <div
        className="mx-auto flex items-center justify-center overflow-visible"
        style={{ width: CUBE_S, height: CUBE_S, margin: "0 auto", marginTop: 28, marginBottom: 28 }}
      >
        <div
          style={{
            width: CUBE_S,
            height: CUBE_S,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {(Object.keys(SIMPLE_FACE_TRANSFORMS) as FName[]).map(face => (
            <div
              key={face}
              style={{
                position: "absolute",
                width: CUBE_S,
                height: CUBE_S,
                transform: SIMPLE_FACE_TRANSFORMS[face],
                background: SIMPLE_FACE_COLORS[face],
                opacity: 0.92,
                border: "2px solid rgba(255,255,255,0.35)",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `inset 0 0 18px rgba(0,0,0,0.25)`,
              }}
            >
              <span style={{
                color: "#fff",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: 1,
                fontFamily: "monospace",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}>
                {SIMPLE_FACE_LABELS[face]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D CUBE — pivot/hinge-based folding, back = tumpuan
───────────────────────────────────────────────────────────── */
type FName = "front" | "back" | "left" | "right" | "top" | "bottom";
const ALL_FACES: FName[] = ["front", "back", "left", "right", "top", "bottom"];
// Sequential open order: back is always the tumpuan, unfold the rest outward
const OPEN_ORDER: FName[] = ["top", "left", "right", "bottom", "front"];
const S = 80;  // cube side length in px
const H = S / 2;

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

/* ── FacePanel: the coloured square rendered inside a hinge ── */
const FacePanel = ({
  face, isNext, isOpen, onClickFace, onClickNext, style,
}: {
  face: FName; isNext: boolean; isOpen: boolean;
  onClickFace: () => void; onClickNext: () => void;
  style?: React.CSSProperties;
}) => {
  const color = FACE_COLORS[face];
  return (
    <div
      onClick={onClickFace}
      style={{
        position: "absolute",
        width: S, height: S,
        cursor: "pointer",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Outer face (visible side) */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: color,
          opacity: isNext ? 1 : 0.9,
          border: isNext ? "3px solid #ffffff" : `2px solid ${color}cc`,
          borderRadius: 6,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          userSelect: "none",
          boxShadow: isNext ? `0 0 20px ${color}` : `0 0 8px ${color}66`,
        }}
      >
        <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>
          {FACE_LABELS[face]}
        </span>
        {isNext ? (
          <button
            onClick={e => { e.stopPropagation(); onClickNext(); }}
            style={{
              marginTop: 5, background: "rgba(255,255,255,0.25)",
              border: "1.5px solid white", borderRadius: 10, color: "#fff",
              fontSize: 7, fontWeight: 700, padding: "2px 7px",
              cursor: "pointer", letterSpacing: 0.5,
            }}
          >KLIK</button>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 6, marginTop: 3, fontFamily: "monospace" }}>
            {isOpen ? "▣" : "□ klik"}
          </span>
        )}
      </div>
      {/* Inner face (backface) */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: color, opacity: 0.4,
          border: `2px solid ${color}66`, borderRadius: 6,
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
};

const TRANS = "transform 1.6s cubic-bezier(0.4, 0, 0.2, 1)";

const InteractiveCube3D = () => {
  const [openFaces, setOpenFaces] = useState<Set<FName>>(new Set());
  const [seqStep, setSeqStep] = useState(-1);
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(32);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, baseRotX: -22, baseRotY: 32 });

  const allOpen  = OPEN_ORDER.every(f => openFaces.has(f));
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
    if (isLast) {
      setSeqStep(-1);
      setTimeout(() => { setRotX(-52); setRotY(0); }, 400);
    } else {
      setSeqStep(seqStep + 1);
    }
    setTimeout(() => setIsTransitioning(false), 1800);
  };

  // Drag handlers
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
    e.preventDefault();
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

  const nextFace = seqStep >= 0 ? OPEN_ORDER[seqStep] : null;

  const commonFaceProps = (face: FName) => ({
    face,
    isNext: nextFace === face,
    isOpen: isOpen(face),
    onClickFace: () => { if (!isDragging) toggleFace(face); },
    onClickNext: openNextSeq,
  });

  /*
   * NET LAYOUT (back = tumpuan at centre):
   *
   *          [top]           y: -S to 0
   *   [left] [back] [right]  y: 0 to S
   *          [bottom]        y: S to 2S
   *          [front]         y: 2S to 3S
   *
   * Each non-back face lives inside a zero-height/zero-width HINGE div.
   * The hinge is positioned at the shared edge with its parent face.
   * Rotating the hinge around its own X or Y axis creates the paper-fold arc.
   *
   * Hinge closed transforms (RTL):
   *   top    : translateZ(-H) rotateX(-90deg)
   *   bottom : translateZ(-H) rotateX( 90deg)
   *   left   : translateZ(-H) rotateY( 90deg)
   *   right  : translateZ(-H) rotateY(-90deg)
   *   front  : rotateX(90deg)   ← nested inside bottom hinge, additional 90° folds it vertical
   */

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4">
      <p className="text-white/60 text-xs text-center font-body">
        Drag untuk memutar · Klik sisi untuk membongkar/melipat · Sisi BELAKANG (ungu) = tumpuan tetap jaring-jaring
      </p>

      {/* Scene */}
      <div
        className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{ width: "100%", height: 360, cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* Cube container — S×S box, cube centred inside, all hinges are children */}
        <div
          style={{
            width: S, height: S,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `perspective(860px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: isDragging ? "none" : "transform 0.6s ease",
          }}
        >
          {/* ── BACK FACE (tumpuan) ── fixed at centre, never moves, never clickable */}
          <div
            style={{
              position: "absolute", top: 0, left: 0,
              width: S, height: S,
              transformStyle: "preserve-3d",
              transform: `translateZ(-${H}px)`,
              transition: TRANS,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: S, height: S,
                transformStyle: "preserve-3d",
                top: 0, left: 0,
              }}
            >
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: FACE_COLORS["back"],
                  opacity: 0.9,
                  border: `2px solid ${FACE_COLORS["back"]}cc`,
                  borderRadius: 6,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  userSelect: "none",
                  boxShadow: `0 0 8px ${FACE_COLORS["back"]}66`,
                  cursor: "default",
                  pointerEvents: "none",
                }}
              >
                <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace" }}>
                  {FACE_LABELS["back"]}
                </span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 7, marginTop: 3, fontFamily: "monospace" }}>
                  ★ tumpuan
                </span>
              </div>
            </div>
          </div>

          {/* ── TOP HINGE (pivot at top edge of back, y=0 in container) ── */}
          <div
            style={{
              position: "absolute", top: 0, left: 0,
              width: S, height: 0,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 0% 0",
              transform: isOpen("top")
                ? `translateZ(-${H}px) rotateX(0deg)`
                : `translateZ(-${H}px) rotateX(-90deg)`,
              transition: TRANS,
            }}
          >
            {/* Top face extends ABOVE hinge (top = -S) */}
            <FacePanel {...commonFaceProps("top")} style={{ top: -S, left: 0 }} />
          </div>

          {/* ── BOTTOM HINGE (pivot at bottom edge of back, y=S in container) ── */}
          <div
            style={{
              position: "absolute", top: S, left: 0,
              width: S, height: 0,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 0% 0",
              transform: isOpen("bottom")
                ? `translateZ(-${H}px) rotateX(0deg)`
                : `translateZ(-${H}px) rotateX(90deg)`,
              transition: TRANS,
            }}
          >
            {/* Bottom face extends BELOW hinge (top = 0) */}
            <FacePanel {...commonFaceProps("bottom")} style={{ top: 0, left: 0 }} />

            {/* ── FRONT HINGE — nested inside bottom hinge ──
                Positioned at trailing edge of bottom face (top = S within bottom hinge).
                closed: additional rotateX(90deg) in bottom's local space folds it vertical.
                open:   rotateX(0deg) — face hangs flat below bottom face. */}
            <div
              style={{
                position: "absolute", top: S, left: 0,
                width: S, height: 0,
                transformStyle: "preserve-3d",
                transformOrigin: "50% 0% 0",
                transform: isOpen("front")
                  ? "rotateX(0deg)"
                  : "rotateX(90deg)",
                transition: TRANS,
              }}
            >
              {/* Front face extends BELOW front hinge (top = 0) */}
              <FacePanel {...commonFaceProps("front")} style={{ top: 0, left: 0 }} />
            </div>
          </div>

          {/* ── LEFT HINGE (pivot at left edge of back, x=0 in container) ── */}
          <div
            style={{
              position: "absolute", top: 0, left: 0,
              width: 0, height: S,
              transformStyle: "preserve-3d",
              transformOrigin: "0% 50% 0",
              transform: isOpen("left")
                ? `translateZ(-${H}px) rotateY(0deg)`
                : `translateZ(-${H}px) rotateY(90deg)`,
              transition: TRANS,
            }}
          >
            {/* Left face extends to the LEFT of hinge (left = -S) */}
            <FacePanel {...commonFaceProps("left")} style={{ top: 0, left: -S }} />
          </div>

          {/* ── RIGHT HINGE (pivot at right edge of back, x=S in container) ── */}
          <div
            style={{
              position: "absolute", top: 0, left: S,
              width: 0, height: S,
              transformStyle: "preserve-3d",
              transformOrigin: "0% 50% 0",
              transform: isOpen("right")
                ? `translateZ(-${H}px) rotateY(0deg)`
                : `translateZ(-${H}px) rotateY(-90deg)`,
              transition: TRANS,
            }}
          >
            {/* Right face extends to the RIGHT of hinge (left = 0) */}
            <FacePanel {...commonFaceProps("right")} style={{ top: 0, left: 0 }} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={startSequential}
          className="px-3 py-1.5 text-xs font-bold bg-cyan-900/60 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition-colors cursor-pointer font-body"
        >
          ▶ Bongkar Bertahap
        </button>
        <button
          onClick={openAll}
          disabled={allOpen}
          className="px-3 py-1.5 text-xs font-bold bg-orange-900/60 border border-orange-600 text-orange-300 rounded-lg hover:bg-orange-800/60 transition-colors cursor-pointer font-body disabled:opacity-40"
        >
          ⊞ Bongkar Semua
        </button>
        <button
          onClick={closeAll}
          disabled={allClosed}
          className="px-3 py-1.5 text-xs font-bold bg-violet-900/60 border border-violet-600 text-violet-300 rounded-lg hover:bg-violet-800/60 transition-colors cursor-pointer font-body disabled:opacity-40"
        >
          ⊟ Satukan Kembali
        </button>
      </div>

      {/* Face colour legend */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {ALL_FACES.map(f => (
          <div key={f} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: FACE_COLORS[f] }} />
            <span className="text-white/50 text-[10px] font-body">
              {FACE_LABELS[f]}{f === "back" ? " ★" : ""}
            </span>
          </div>
        ))}
      </div>
      <p className="text-white/30 text-[9px] text-center font-body">★ = tumpuan jaring-jaring</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   11 CUBE NET SVG DIAGRAMS
───────────────────────────────────────────────────────────── */
const NET_PATTERNS: [number, number][][] = [
  [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]],       // 1: cross
  [[0,0],[1,0],[2,0],[3,0],[1,1],[2,-1]],       // 2: row 4 + up-right
  [[0,0],[1,0],[2,0],[3,0],[0,1],[1,-1]],       // 3: row 4 + offsets
  [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3]],        // 4: S-bend
  [[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]],        // 5: Z-long
  [[0,0],[1,0],[1,1],[1,2],[2,2],[1,3]],        // 6: T-down
  [[0,0],[1,0],[2,0],[2,1],[2,2],[1,2]],        // 7: U-shape
  [[0,0],[1,0],[2,0],[0,1],[0,2],[0,3]],        // 8: L-tall
  [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]],        // 9: L-reverse
  [[0,0],[1,0],[1,1],[1,2],[2,2],[3,2]],        // 10: J-shape
  [[0,2],[1,2],[1,1],[1,0],[2,0],[3,0]],        // 11: S-inverse
];

const NET_COLORS = ["#3b82f6","#8b5cf6","#22c55e","#f97316","#eab308","#ef4444"];

const NetSVG = ({ cells }: { cells: [number, number][] }) => {
  const cols = cells.map(([c]) => c);
  const rows = cells.map(([, r]) => r);
  const minC = Math.min(...cols), minR = Math.min(...rows);
  const maxC = Math.max(...cols), maxR = Math.max(...rows);
  const cW = maxC - minC + 1, cH = maxR - minR + 1;
  const cs = Math.min(28, 28);
  const W = cW * cs, H = cH * cs;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {cells.map(([c, r], i) => (
        <rect key={i}
          x={(c - minC) * cs + 1.5} y={(r - minR) * cs + 1.5}
          width={cs - 3} height={cs - 3}
          fill={NET_COLORS[i]} rx={3} fillOpacity={0.9}
          stroke="white" strokeWidth={1.5}
        />
      ))}
    </svg>
  );
};

const NetGallery = () => (
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
    {NET_PATTERNS.map((cells, i) => (
      <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col items-center gap-2">
        <span className="text-white/50 text-[10px] font-body font-bold">Jaring #{i+1}</span>
        <div className="flex items-center justify-center" style={{ minHeight: 80 }}>
          <NetSVG cells={cells}/>
        </div>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   UNSUR KUBUS — ANIMATED SVGs
───────────────────────────────────────────────────────────── */
const RusukAnimSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Rusuk kubus beranimasi">
    <defs>
      <style>{`
        @keyframes rusukGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22d3ee);}50%{stroke-opacity:0.25;filter:drop-shadow(0 0 0 #22d3ee);}}
        .rusuk-a{animation:rusukGlow 1.4s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Cube wireframe */}
    {/* Back face */}
    <polygon points="80,30 200,30 200,130 80,130" fill="rgba(30,41,59,0.6)" stroke="#334155" strokeWidth="1.5"/>
    {/* Front face */}
    <polygon points="40,60 160,60 160,160 40,160" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.5"/>
    {/* Connecting edges */}
    <line x1="40" y1="60" x2="80" y2="30" stroke="#334155" strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke="#334155" strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke="#334155" strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke="#334155" strokeWidth="1.5"/>
    {/* Animated rusuk (edges) */}
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
    {/* Labels */}
    {[
      [40,60,"E",-14,-4],[160,60,"F",7,-4],[160,160,"B",7,13],[40,160,"A",-14,13],
      [80,30,"H",-4,-8],[200,30,"G",7,-4],[200,130,"C",7,7],[80,130,"D",-16,7],
    ].map(([x,y,lbl,dx,dy]) => (
      <g key={lbl}>
        <circle cx={x as number} cy={y as number} r="4" fill="#e0f2fe" stroke="#22d3ee" strokeWidth="1.5"/>
        <text x={(x as number) + (dx as number)} y={(y as number) + (dy as number)} fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">{lbl}</text>
      </g>
    ))}
    <text x="88" y="184" fill="#e0f2fe" fontSize="11" fontFamily="monospace" fontWeight="bold">Kubus ABCD.EFGH</text>
    <text x="98" y="46" fill="#22d3ee" fontSize="10" fontFamily="monospace">s</text>
    <text x="234" y="175" fill="#ffffff" fontSize="10" fontFamily="monospace">12 rusuk</text>
    <text x="234" y="188" fill="#22d3ee" fontSize="10" fontFamily="monospace">semua = s</text>
  </svg>
);

const SisiAnimSVG = () => (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-2" aria-label="Sisi kubus beranimasi">
    <defs>
      <style>{`
        @keyframes sisiGlow{0%,100%{fill-opacity:0.7;}50%{fill-opacity:0.1;}}
        .sisi-a{animation:sisiGlow 1.6s ease-in-out infinite;}
        .sisi-b{animation:sisiGlow 1.6s ease-in-out infinite 0.3s;}
        .sisi-c{animation:sisiGlow 1.6s ease-in-out infinite 0.6s;}
      `}</style>
    </defs>
    {/* Colored faces */}
    <polygon points="40,60 160,60 160,160 40,160" fill="#3b82f6" className="sisi-a"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="#8b5cf6" className="sisi-b"/>
    <polygon points="40,60 80,30 200,30 160,60" fill="#eab308" className="sisi-c"/>
    <polygon points="40,60 80,30 80,130 40,160" fill="#22c55e" className="sisi-b" fillOpacity="0.5"/>
    <polygon points="40,160 80,130 200,130 160,160" fill="#ef4444" className="sisi-a"/>
    <polygon points="160,60 200,30 200,130 160,160" fill="#f97316" className="sisi-c" fillOpacity="0.5"/>
    {/* Outlines */}
    <polygon points="40,60 160,60 160,160 40,160" fill="none" stroke="#ffffff" strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="none" stroke="#ffffff" strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke="#ffffff" strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke="#ffffff" strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke="#ffffff" strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke="#ffffff" strokeWidth="1.5"/>
    {/* Vertex dots */}
    {([[40,160],[160,160],[200,130],[80,130],[40,60],[160,60],[200,30],[80,30]] as [number,number][]).map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={3} fill="#facc15" opacity={0.9}/>
    ))}
    {/* Vertex labels */}
    <text x="25"  y="177" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="163" y="177" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="204" y="134" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="62"  y="127" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="25"  y="56"  fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">E</text>
    <text x="163" y="56"  fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">F</text>
    <text x="204" y="28"  fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">G</text>
    <text x="65"  y="25"  fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>
  </svg>
);

const TitikSudutAnimSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Titik sudut kubus beranimasi">
    <defs>
      <style>{`
        @keyframes dotPulse{0%,100%{r:6;opacity:1;filter:drop-shadow(0 0 6px #facc15);}50%{r:3;opacity:0.3;filter:drop-shadow(0 0 0 #facc15);}}
        .dot-a{animation:dotPulse 1.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Wireframe */}
    <polygon points="40,60 160,60 160,160 40,160" fill="none" stroke="#334155" strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="none" stroke="#334155" strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke="#334155" strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke="#334155" strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke="#334155" strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke="#334155" strokeWidth="1.5"/>
    {/* Animated vertices */}
    {[[40,60],[160,60],[40,160],[160,160],[80,30],[200,30],[80,130],[200,130]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} fill="#facc15" className="dot-a"
        style={{animationDelay:`${i*0.15}s`}} r={6}/>
    ))}
    {/* Vertex labels */}
    <text x="22" y="58" fill="#facc15" fontSize="10" fontFamily="monospace">E</text>
    <text x="164" y="58" fill="#facc15" fontSize="10" fontFamily="monospace">F</text>
    <text x="164" y="172" fill="#facc15" fontSize="10" fontFamily="monospace">B</text>
    <text x="22" y="172" fill="#facc15" fontSize="10" fontFamily="monospace">A</text>
    <text x="64" y="26" fill="#facc15" fontSize="10" fontFamily="monospace">H</text>
    <text x="202" y="26" fill="#facc15" fontSize="10" fontFamily="monospace">G</text>
    <text x="202" y="142" fill="#facc15" fontSize="10" fontFamily="monospace">C</text>
    <text x="64" y="142" fill="#facc15" fontSize="10" fontFamily="monospace">D</text>
    <text x="210" y="175" fill="#fff" fontSize="10" fontFamily="monospace">8 titik sudut</text>
  </svg>
);

const DiagonalBidangSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Diagonal bidang kubus">
    <defs>
      <style>{`
        @keyframes diagBidang{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #4ade80);}50%{stroke-opacity:0.2;filter:drop-shadow(0 0 0 #4ade80);}}
        .db-a{animation:diagBidang 1.5s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill="rgba(30,41,59,0.7)" stroke="#475569" strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="rgba(30,41,59,0.5)" stroke="#475569" strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke="#475569" strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke="#475569" strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke="#475569" strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke="#475569" strokeWidth="1.5"/>
    {/* Diagonal bidang (2 examples) */}
    <line x1="40" y1="60" x2="160" y2="160" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="6,3" className="db-a"/>
    <line x1="80" y1="30" x2="200" y2="130" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="6,3" className="db-a"
      style={{animationDelay:"0.6s"}}/>
    <circle cx="40" cy="60" r="4" fill="#4ade80"/>
    <circle cx="160" cy="160" r="4" fill="#4ade80"/>
    <text x="62" y="120" fill="#4ade80" fontSize="10" fontFamily="monospace">d_b</text>
    <text x="182" y="175" fill="#fff" fontSize="10" fontFamily="monospace">12 diagonal</text>
    <text x="182" y="188" fill="#4ade80" fontSize="10" fontFamily="monospace">s√2</text>
  </svg>
);

const AllDiagonalBidangSVG = () => {
  const diags = [
    { x1:40,  y1:160, x2:160, y2:60,  color:"#ef4444", key:"AF", face:"Depan" },
    { x1:160, y1:160, x2:40,  y2:60,  color:"#f97316", key:"BE", face:"Depan" },
    { x1:80,  y1:130, x2:200, y2:30,  color:"#eab308", key:"DG", face:"Belakang" },
    { x1:200, y1:130, x2:80,  y2:30,  color:"#84cc16", key:"CH", face:"Belakang" },
    { x1:40,  y1:160, x2:80,  y2:30,  color:"#22c55e", key:"AH", face:"Kiri" },
    { x1:40,  y1:60,  x2:80,  y2:130, color:"#14b8a6", key:"DE", face:"Kiri" },
    { x1:160, y1:160, x2:200, y2:30,  color:"#06b6d4", key:"BG", face:"Kanan" },
    { x1:160, y1:60,  x2:200, y2:130, color:"#3b82f6", key:"CF", face:"Kanan" },
    { x1:40,  y1:60,  x2:200, y2:30,  color:"#6366f1", key:"EG", face:"Atas" },
    { x1:160, y1:60,  x2:80,  y2:30,  color:"#8b5cf6", key:"FH", face:"Atas" },
    { x1:40,  y1:160, x2:200, y2:130, color:"#d946ef", key:"AC", face:"Alas" },
    { x1:160, y1:160, x2:80,  y2:130, color:"#f43f5e", key:"BD", face:"Alas" },
  ];
  const verts: [number,number,string,number,number][] = [
    [40,60,"E",-10,-5],[160,60,"F",5,-5],[160,160,"B",5,10],[40,160,"A",-10,10],
    [80,30,"H",-2,-7],[200,30,"G",5,-5],[200,130,"C",6,4],[80,130,"D",-13,4],
  ];
  return (
    <div className="space-y-3 my-3">
      <p className="text-xs text-green-100/80 bg-green-950/50 border border-green-700/40 rounded-lg p-3">
        Setiap kubus di bawah hanya menampilkan satu diagonal bidang. Karena ada 6 sisi dan setiap sisi punya 2 diagonal, totalnya ada 12 diagonal bidang.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {diags.map((d, i) => (
          <div key={d.key} className="bg-slate-900/55 border border-slate-700/70 rounded-lg p-3 space-y-2">
            <svg viewBox="0 0 240 190" className="w-full mx-auto" aria-label={`Diagonal bidang ${d.key}`}>
              <defs>
                <style>{`@keyframes diagBidangGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style>
              </defs>
              <polygon points="40,55 150,55 150,145 40,145" fill="rgba(20,30,50,0.76)" stroke="#475569" strokeWidth="1.4"/>
              <polygon points="75,28 185,28 185,118 75,118" fill="rgba(20,30,50,0.44)" stroke="#475569" strokeWidth="1.4"/>
              <line x1="40" y1="55" x2="75" y2="28" stroke="#475569" strokeWidth="1.4"/>
              <line x1="150" y1="55" x2="185" y2="28" stroke="#475569" strokeWidth="1.4"/>
              <line x1="40" y1="145" x2="75" y2="118" stroke="#475569" strokeWidth="1.4"/>
              <line x1="150" y1="145" x2="185" y2="118" stroke="#475569" strokeWidth="1.4"/>
              <line
                x1={d.x1 === 160 ? 150 : d.x1 === 200 ? 185 : d.x1 === 80 ? 75 : d.x1}
                y1={d.y1 === 160 ? 145 : d.y1 === 60 ? 55 : d.y1 === 130 ? 118 : d.y1}
                x2={d.x2 === 160 ? 150 : d.x2 === 200 ? 185 : d.x2 === 80 ? 75 : d.x2}
                y2={d.y2 === 160 ? 145 : d.y2 === 60 ? 55 : d.y2 === 130 ? 118 : d.y2}
                stroke={d.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8,4"
                style={{
                  filter: `drop-shadow(0 0 8px ${d.color})`,
                  animation: `diagBidangGlow 1.5s ease-in-out infinite ${(i * 0.13).toFixed(2)}s`,
                }}
              />
              {verts.map(([x,y,lbl,dx,dy]) => {
                const sx = x === 160 ? 150 : x === 200 ? 185 : x === 80 ? 75 : x;
                const sy = y === 160 ? 145 : y === 60 ? 55 : y === 130 ? 118 : y;
                return (
                  <g key={lbl}>
                    <circle cx={sx} cy={sy} r="3.2" fill="#e2e8f0"/>
                    <text x={sx+dx} y={sy+dy} fill="#f8fafc" fontSize="9" fontFamily="monospace" fontWeight="bold">{lbl}</text>
                  </g>
                );
              })}
              <text x="112" y="175" fill={d.color} fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {d.key}
              </text>
            </svg>
            <div>
              <p className="text-xs font-semibold" style={{ color: d.color }}>{`${i + 1}. Diagonal ${d.key}`}</p>
              <p className="text-[11px] text-white/55">{`Sisi ${d.face}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DiagonalRuangSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Diagonal ruang kubus">
    <defs>
      <style>{`
        @keyframes diagRuang{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 8px #f87171);}50%{stroke-opacity:0.15;filter:drop-shadow(0 0 0 #f87171);}}
        .dr-a{animation:diagRuang 1.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill="rgba(30,41,59,0.7)" stroke="#475569" strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="rgba(30,41,59,0.5)" stroke="#475569" strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke="#475569" strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke="#475569" strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke="#475569" strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke="#475569" strokeWidth="1.5"/>
    {/* Diagonal ruang */}
    <line x1="40" y1="60" x2="200" y2="130" stroke="#f87171" strokeWidth="3" className="dr-a"/>
    <line x1="160" y1="60" x2="80" y2="130" stroke="#f87171" strokeWidth="3" className="dr-a" style={{animationDelay:"0.7s"}}/>
    <circle cx="40" cy="60" r="5" fill="#f87171"/>
    <circle cx="200" cy="130" r="5" fill="#f87171"/>
    <text x="95" y="100" fill="#f87171" fontSize="10" fontFamily="monospace">d_r</text>
    <text x="182" y="175" fill="#fff" fontSize="10" fontFamily="monospace">4 diagonal</text>
    <text x="182" y="188" fill="#f87171" fontSize="10" fontFamily="monospace">s√3</text>
  </svg>
);

const AllDiagonalRuangSVG = () => {
  // Larger cube vertices (scaled up ~1.4×)
  // Front face: E(20,52) F(195,52) B(195,195) A(20,195)
  // Back face:  H(75,10) G(250,10) C(250,153) D(75,153)
  const diags = [
    { x1:20,  y1:195, x2:250, y2:10,  color:"#f44336", key:"AG", desc:"A → G" },
    { x1:195, y1:195, x2:75,  y2:10,  color:"#4caf50", key:"BH", desc:"B → H" },
    { x1:195, y1:52,  x2:75,  y2:153, color:"#38bdf8", key:"DF", desc:"D → F" },
    { x1:20,  y1:52,  x2:250, y2:153, color:"#facc15", key:"CE", desc:"C → E" },
  ];
  const verts: [number,number,string,number,number][] = [
    [20,52,  "E",-14,-4],
    [195,52, "F",  6,-4],
    [195,195,"B",  6, 12],
    [20,195, "A",-14, 12],
    [75,10,  "H", -5,-6],
    [250,10, "G",  5,-6],
    [250,153,"C",  6,  5],
    [75,153, "D",-16,  5],
  ];
  return (
    <svg viewBox="0 0 278 255" className="w-full max-w-sm mx-auto my-2" aria-label="4 diagonal ruang kubus">
      <defs>
        <style>{`@keyframes drGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style>
      </defs>
      {/* Wireframe */}
      <polygon points="20,52 195,52 195,195 20,195"   fill="rgba(20,30,50,0.75)" stroke="#334155" strokeWidth="1.8"/>
      <polygon points="75,10 250,10 250,153 75,153"   fill="rgba(20,30,50,0.4)"  stroke="#334155" strokeWidth="1.8"/>
      <line x1="20"  y1="52"  x2="75"  y2="10"  stroke="#334155" strokeWidth="1.8"/>
      <line x1="195" y1="52"  x2="250" y2="10"  stroke="#334155" strokeWidth="1.8"/>
      <line x1="20"  y1="195" x2="75"  y2="153" stroke="#334155" strokeWidth="1.8"/>
      <line x1="195" y1="195" x2="250" y2="153" stroke="#334155" strokeWidth="1.8"/>
      {/* Diagonal ruang — redup nyala */}
      {diags.map((d,i)=>(
        <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
          stroke={d.color} strokeWidth="3.5" strokeLinecap="round"
          style={{
            filter:`drop-shadow(0 0 8px ${d.color})`,
            animation:`drGlow 1.5s ease-in-out infinite ${(i*0.37).toFixed(2)}s`,
          }}/>
      ))}
      {/* Vertex dots & labels */}
      {verts.map(([x,y,lbl,dx,dy],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="#94a3b8"/>
          <text x={x+dx} y={y+dy} fill="#f1f5f9" fontSize="11" fontFamily="monospace" fontWeight="bold">{lbl}</text>
        </g>
      ))}
      {/* Legend */}
      <text x="10" y="215" fill="#94a3b8" fontSize="9" fontFamily="monospace">Keterangan (4 diagonal ruang):</text>
      {diags.map((d,i)=>{
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 14 + col * 140;
        const y = 228 + row * 20;
        return (
          <g key={i}>
            <line x1={x} y1={y+3} x2={x+20} y2={y+3} stroke={d.color} strokeWidth="2.5"/>
            <circle cx={x}    cy={y+3} r="3.5" fill={d.color}/>
            <circle cx={x+20} cy={y+3} r="3.5" fill={d.color}/>
            <text x={x+26} y={y+7} fill={d.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
              {`${d.key}  (${d.desc})`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const BidangDiagonalSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Bidang diagonal kubus">
    <defs>
      <style>{`
        @keyframes bdGlow{0%,100%{fill-opacity:0.55;filter:drop-shadow(0 0 5px #a78bfa);}50%{fill-opacity:0.1;filter:drop-shadow(0 0 0 #a78bfa);}}
        .bd-a{animation:bdGlow 1.6s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon points="40,60 160,60 160,160 40,160" fill="rgba(30,41,59,0.7)" stroke="#475569" strokeWidth="1.5"/>
    <polygon points="80,30 200,30 200,130 80,130" fill="rgba(30,41,59,0.5)" stroke="#475569" strokeWidth="1.5"/>
    <line x1="40" y1="60" x2="80" y2="30" stroke="#475569" strokeWidth="1.5"/>
    <line x1="160" y1="60" x2="200" y2="30" stroke="#475569" strokeWidth="1.5"/>
    <line x1="40" y1="160" x2="80" y2="130" stroke="#475569" strokeWidth="1.5"/>
    <line x1="160" y1="160" x2="200" y2="130" stroke="#475569" strokeWidth="1.5"/>
    {/* Bidang diagonal (rect through cube) */}
    <polygon points="40,60 200,30 200,130 40,160" fill="#a78bfa" className="bd-a"/>
    <polygon points="40,60 200,30 200,130 40,160" fill="none" stroke="#a78bfa" strokeWidth="2"/>
    <text x="95" y="105" fill="#a78bfa" fontSize="11" fontFamily="monospace" fontWeight="bold">EACG</text>
    <text x="170" y="175" fill="#fff" fontSize="10" fontFamily="monospace">6 bidang</text>
    <text x="170" y="188" fill="#a78bfa" fontSize="10" fontFamily="monospace">diagonal</text>
  </svg>
);

type BidangDiagonalVariant = {
  title: string;
  points: string;
  color: string;
  label: string;
  note: string;
};

const bidangDiagonalVariants: BidangDiagonalVariant[] = [
  {
    title: "Bidang EACG",
    points: "40,160 40,60 200,30 200,130",
    color: "#a78bfa",
    label: "EACG",
    note: "sejajar dengan bidang FBDH",
  },
  {
    title: "Bidang FBDH",
    points: "160,60 160,160 80,130 80,30",
    color: "#22d3ee",
    label: "FBDH",
    note: "sejajar dengan bidang EACG",
  },
  {
    title: "Bidang DCEF",
    points: "160,60 40,60 80,130 200,130",
    color: "#34d399",
    label: "DCEF",
    note: "melalui rusuk DC dan EF",
  },
  {
    title: "Bidang ABGH",
    points: "40,160 160,160 200,30 80,30",
    color: "#facc15",
    label: "ABGH",
    note: "melalui rusuk AB dan GH",
  },
  {
    title: "Bidang EHCB",
    points: "40,60 80,30 200,130 160,160",
    color: "#fb7185",
    label: "EHCB",
    note: "melalui rusuk EH dan BC",
  },
  {
    title: "Bidang FGDA",
    points: "160,60 200,30 80,130 40,160",
    color: "#a78bfa",
    label: "FGDA",
    note: "melalui rusuk FG dan AD",
  },
];

const BidangDiagonalVariantCube = ({ variant, idx = 0 }: { variant: BidangDiagonalVariant; idx?: number }) => (
  <div className="rounded-lg border border-slate-700/70 bg-slate-900/55 p-3 space-y-2">
    <svg viewBox="0 0 240 190" className="w-full mx-auto" aria-label={variant.title}>
      <defs>
        <style>{`
          @keyframes bdPulse {
            0%,100% { fill-opacity: 0.52; stroke-opacity: 1; }
            50%      { fill-opacity: 0.08; stroke-opacity: 0.25; }
          }
          .bd-pulse { animation: bdPulse 2s ease-in-out infinite; }
        `}</style>
      </defs>
      <polygon points="40,55 150,55 150,145 40,145" fill="rgba(30,41,59,0.72)" stroke="#64748b" strokeWidth="1.4"/>
      <polygon points="75,28 185,28 185,118 75,118" fill="rgba(30,41,59,0.45)" stroke="#64748b" strokeWidth="1.4"/>
      <line x1="40" y1="55" x2="75" y2="28" stroke="#64748b" strokeWidth="1.4"/>
      <line x1="150" y1="55" x2="185" y2="28" stroke="#64748b" strokeWidth="1.4"/>
      <line x1="40" y1="145" x2="75" y2="118" stroke="#64748b" strokeWidth="1.4"/>
      <line x1="150" y1="145" x2="185" y2="118" stroke="#64748b" strokeWidth="1.4"/>
      <polygon
        points={variant.points
          .replaceAll("160", "150")
          .replaceAll("200", "185")
          .replaceAll("80", "75")
          .replaceAll("60", "55")
          .replaceAll("130", "118")}
        fill={variant.color}
        stroke={variant.color}
        strokeWidth="2.4"
        strokeLinejoin="round"
        className="bd-pulse"
        style={{ filter: `drop-shadow(0 0 9px ${variant.color})`, animationDelay: `${idx * 0.33}s` }}
      />
      {[
        [40,55,"E",-12,-5],[150,55,"F",5,-5],[150,145,"B",5,12],[40,145,"A",-12,12],
        [75,28,"H",-3,-8],[185,28,"G",5,-5],[185,118,"C",6,4],[75,118,"D",-14,5],
      ].map(([x,y,lbl,dx,dy]) => (
        <g key={lbl}>
          <circle cx={x as number} cy={y as number} r="3" fill="#e2e8f0"/>
          <text x={(x as number) + (dx as number)} y={(y as number) + (dy as number)} fill="#f8fafc" fontSize="9" fontFamily="monospace" fontWeight="bold">{lbl}</text>
        </g>
      ))}
      <text x="112" y="90" fill={variant.color} fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {variant.label}
      </text>
      {/* Alas label ABCD */}
      <text x="95" y="178" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.75">ABCD</text>
      {/* Atap label EFGH */}
      <text x="130" y="16" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.75">EFGH</text>
    </svg>
    <div>
      <p className="text-xs font-semibold" style={{ color: variant.color }}>{variant.title}</p>
      <p className="text-[11px] text-white/55">{variant.note}</p>
    </div>
  </div>
);

const BidangDiagonalVariasiGallery = () => (
  <div className="space-y-3">
    <div className="rounded-lg bg-slate-900/60 border border-violet-700/30 p-3">
      <p className="text-xs text-violet-200">
        Keenam (6) bidang diagonal pada kubus ABCD.EFGH. Setiap warna menunjukkan satu bidang diagonal yang berbeda.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {bidangDiagonalVariants.map((variant, i) => (
        <BidangDiagonalVariantCube key={variant.title} variant={variant} idx={i} />
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   LUAS PERMUKAAN ANIMATION
───────────────────────────────────────────────────────────── */
const LuasPermukaanSVG = () => (
  <svg viewBox="0 0 340 220" className="w-full max-w-sm mx-auto my-2" aria-label="Animasi luas permukaan kubus">
    <defs>
      <style>{`
        @keyframes lp1{0%,100%{fill-opacity:0.8;}50%{fill-opacity:0.15;}}
        .lp1{animation:lp1 2s ease-in-out infinite;}
        .lp2{animation:lp1 2s ease-in-out infinite 0.33s;}
        .lp3{animation:lp1 2s ease-in-out infinite 0.66s;}
        .lp4{animation:lp1 2s ease-in-out infinite 1s;}
        .lp5{animation:lp1 2s ease-in-out infinite 1.33s;}
        .lp6{animation:lp1 2s ease-in-out infinite 1.66s;}
      `}</style>
    </defs>
    {/* Cross net layout */}
    {/* Top */}
    <rect x="122" y="10" width="70" height="70" fill="#eab308" className="lp1" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="157" y="44" fill="#000" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ATAS</text>
    <text x="157" y="59" fill="#000" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
    {/* Left */}
    <rect x="50" y="82" width="70" height="70" fill="#22c55e" className="lp2" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="85" y="115" fill="#000" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">KIRI</text>
    <text x="85" y="130" fill="#000" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
    {/* Front */}
    <rect x="122" y="82" width="70" height="70" fill="#3b82f6" className="lp3" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="157" y="115" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DEPAN</text>
    <text x="157" y="130" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
    {/* Right */}
    <rect x="194" y="82" width="70" height="70" fill="#f97316" className="lp4" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="229" y="115" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">KANAN</text>
    <text x="229" y="130" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
    {/* Back */}
    <rect x="266" y="82" width="70" height="70" fill="#8b5cf6" className="lp5" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="301" y="115" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BELAK.</text>
    <text x="301" y="130" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
    {/* Bottom */}
    <rect x="122" y="154" width="70" height="70" fill="#ef4444" className="lp6" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="157" y="187" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BAWAH</text>
    <text x="157" y="202" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = s²</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   VOLUME ANIMATION
───────────────────────────────────────────────────────────── */
const VolumeSVG = () => (
  <svg viewBox="0 0 300 230" className="w-full max-w-sm mx-auto my-2" aria-label="Animasi volume kubus — kubus utuh bersinar">
    <defs>
      <style>{`
        @keyframes faceGlowTop{0%,100%{fill-opacity:0.92;filter:drop-shadow(0 0 14px #a78bfa);}50%{fill-opacity:0.65;filter:drop-shadow(0 0 4px #7c3aed);}}
        @keyframes faceGlowLeft{0%,100%{fill-opacity:0.88;filter:drop-shadow(0 0 12px #60a5fa);}50%{fill-opacity:0.55;filter:drop-shadow(0 0 3px #1d4ed8);}}
        @keyframes faceGlowRight{0%,100%{fill-opacity:0.85;filter:drop-shadow(0 0 12px #818cf8);}50%{fill-opacity:0.50;filter:drop-shadow(0 0 3px #4338ca);}}
        @keyframes edgeGlow{0%,100%{stroke-opacity:1;stroke-width:2.5;filter:drop-shadow(0 0 6px #e0e7ff);}50%{stroke-opacity:0.4;stroke-width:1.5;filter:drop-shadow(0 0 1px #e0e7ff);}}
        @keyframes labelPulse{0%,100%{opacity:1;}50%{opacity:0.55;}}
        .vol-top{animation:faceGlowTop 2.4s ease-in-out infinite;}
        .vol-left{animation:faceGlowLeft 2.4s ease-in-out infinite 0.4s;}
        .vol-right{animation:faceGlowRight 2.4s ease-in-out infinite 0.8s;}
        .vol-edge{animation:edgeGlow 2.4s ease-in-out infinite;}
        .vol-lbl{animation:labelPulse 2.4s ease-in-out infinite;}
      `}</style>
      <filter id="volBloom">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* ── Isometric solid cube ── */}
    {/* Top face */}
    <polygon
      points="150,28 74,72 150,116 226,72"
      fill="#7c3aed" className="vol-top"
      stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"
    />
    {/* Left face */}
    <polygon
      points="74,72 74,162 150,206 150,116"
      fill="#1d4ed8" className="vol-left"
      stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"
    />
    {/* Right face */}
    <polygon
      points="226,72 226,162 150,206 150,116"
      fill="#4338ca" className="vol-right"
      stroke="#a5b4fc" strokeWidth="2" strokeLinejoin="round"
    />

    {/* Glowing edges */}
    {/* Top face edges */}
    <polyline points="150,28 74,72 150,116 226,72 150,28"
      fill="none" stroke="#e0e7ff" strokeWidth="2" className="vol-edge" strokeLinejoin="round"/>
    {/* Vertical edges */}
    <line x1="74" y1="72" x2="74" y2="162" stroke="#93c5fd" strokeWidth="2" className="vol-edge"/>
    <line x1="226" y1="72" x2="226" y2="162" stroke="#a5b4fc" strokeWidth="2" className="vol-edge"/>
    <line x1="150" y1="116" x2="150" y2="206" stroke="#c4b5fd" strokeWidth="2" className="vol-edge"/>
    {/* Bottom face edges */}
    <polyline points="74,162 150,206 226,162"
      fill="none" stroke="#e0e7ff" strokeWidth="2" className="vol-edge" strokeLinejoin="round"/>

    {/* Dimension labels */}
    {/* s on left vertical edge */}
    <text x="52" y="122" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" className="vol-lbl">s</text>
    <line x1="66" y1="72" x2="66" y2="162" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"/>
    <line x1="62" y1="72" x2="70" y2="72" stroke="#93c5fd" strokeWidth="1" opacity="0.6"/>
    <line x1="62" y1="162" x2="70" y2="162" stroke="#93c5fd" strokeWidth="1" opacity="0.6"/>

    {/* s on top-right edge */}
    <text x="196" y="48" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" className="vol-lbl">s</text>
    <line x1="152" y1="22" x2="228" y2="66" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>

    {/* s on top-left edge */}
    <text x="94" y="46" fill="#a5b4fc" fontSize="11" fontFamily="monospace" fontWeight="bold" className="vol-lbl">s</text>

    {/* Formula */}
    <text x="150" y="224" fill="#e0e7ff" fontSize="14" fontFamily="monospace" fontWeight="bold"
      textAnchor="middle" filter="url(#volBloom)" className="vol-lbl">
      V = s³
    </text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   VOLUME KUBUS — animated water-fill visualization
───────────────────────────────────────────────────────────── */
type V2k = [number, number];

const WaterKubusAnimation = () => {
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

  // Cube in oblique projection — all sides equal (s)
  const FL:   V2k = [62, 178];
  const FR:   V2k = [162, 178];
  const Hpx   = 100;
  const dx = 30, dy = -22;

  const BkL:  V2k = [FL[0] + dx,  FL[1] + dy];
  const BkR:  V2k = [FR[0] + dx,  FR[1] + dy];
  const FTL:  V2k = [FL[0],       FL[1] - Hpx];
  const FTR:  V2k = [FR[0],       FR[1] - Hpx];
  const BkTL: V2k = [BkL[0],     BkL[1] - Hpx];
  const BkTR: V2k = [BkR[0],     BkR[1] - Hpx];

  const lerp = (a: V2k, b: V2k, t: number): V2k => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const p  = (v: V2k) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pp = (...vs: V2k[]) => vs.map(p).join(" ");

  const WFL  = lerp(FL,  FTL,  fill);
  const WFR  = lerp(FR,  FTR,  fill);
  const WBkL = lerp(BkL, BkTL, fill);
  const WBkR = lerp(BkR, BkTR, fill);

  const pct     = Math.round(fill * 100);
  const isEmpty = fill < 0.005;
  const isFull  = fill > 0.995;

  const barX = 202, barY = FTL[1], barW = 13, barH = Hpx;
  const filledH = barH * fill;

  return (
    <svg viewBox="0 0 280 215" className="w-full max-w-sm mx-auto my-2"
      aria-label="Animasi kubus diisi air">
      <defs>
        <filter id="wBloomK">
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
          {/* Floor */}
          <polygon points={pp(FL, FR, BkR, BkL)}
            fill="#1e3a8a" fillOpacity={0.90}/>
          {/* Right face water band */}
          <polygon points={pp(FR, BkR, WBkR, WFR)}
            fill="#1d4ed8" fillOpacity={0.80}/>
          {/* Front face water band */}
          <polygon points={pp(FL, FR, WFR, WFL)}
            fill="#2563eb" fillOpacity={0.90}/>
          {/* Water surface (parallelogram) */}
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

      {/* Cube wireframe */}
      <polygon points={pp(FL, FR, FTR, FTL)}
        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points={pp(FR, BkR, BkTR, FTR)}
        fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Top face */}
      <polygon points={pp(FTL, FTR, BkTR, BkTL)}
        fill="#0f172a" fillOpacity={isFull ? 0.7 : 0.2} stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round"/>

      {/* Dimension "s" labels on three visible edges */}
      {/* Front bottom edge */}
      <text x={(FL[0] + FR[0]) / 2} y={FL[1] + 12}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
      {/* Left vertical edge */}
      <text x={FL[0] - 13} y={(FL[1] + FTL[1]) / 2 + 4}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
      <line x1={FL[0] - 7} y1={FL[1]} x2={FL[0] - 7} y2={FTL[1]}
        stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" strokeOpacity={0.6}/>
      {/* Top-right depth edge */}
      <text x={(FTR[0] + BkTR[0]) / 2 + 4} y={(FTR[1] + BkTR[1]) / 2 - 6}
        fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>

      {/* TUTUP label */}
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
      <text x="118" y="198"
        fill={isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc"}
        fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle"
        filter="url(#wBloomK)">
        {isFull ? "🌊 Penuh!" : isEmpty ? "⬛ Kosong" : `🔵 Mengisi... ${pct}%`}
      </text>
      <text x="118" y="212"
        fill="#e0e7ff" fontSize="12" fontFamily="monospace" fontWeight="bold"
        textAnchor="middle" filter="url(#wBloomK)">
        V = s³
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

const sections: Sec[] = [
  {
    title: "Definisi Kubus",
    icon: "⬛",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          Kubus adalah <strong className="text-cyan-300">bangun ruang sisi datar</strong> yang paling simetris —
          semua sisinya berbentuk persegi dengan ukuran yang persis sama. Bayangkan dadu angka: itu adalah kubus!
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">📌 Sifat-sifat Kubus:</p>
          <ul className="space-y-1 text-xs text-white/75">
            <li>• Memiliki <strong className="text-yellow-300">6 sisi</strong> berbentuk persegi yang sama besar</li>
            <li>• Memiliki <strong className="text-yellow-300">12 rusuk</strong> yang sama panjang</li>
            <li>• Memiliki <strong className="text-yellow-300">8 titik sudut</strong></li>
            <li>• Memiliki <strong className="text-yellow-300">12 diagonal bidang</strong></li>
            <li>• Memiliki <strong className="text-yellow-300">4 diagonal ruang</strong></li>
            <li>• Memiliki <strong className="text-yellow-300">6 bidang diagonal</strong></li>
            <li>• Setiap sudut pertemuannya selalu <strong className="text-yellow-300">90°</strong></li>
            <li>• Panjang, lebar, dan tingginya <strong className="text-yellow-300">selalu sama</strong> (= <InlineMath math="s" />)</li>
          </ul>
        </div>
        <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
          💡 <strong>Kubus vs Balok:</strong> Jika semua sisi persegi panjang sebuah balok berukuran sama, ia menjadi kubus!
          Kubus adalah kasus khusus dari balok.
        </blockquote>
      </div>
    ),
  },
  {
    title: "Unsur-unsur Kubus (Interaktif)",
    icon: "🔍",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        {/* Rusuk */}
        <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-4 space-y-2">
          <p className="text-cyan-300 font-semibold">① Rusuk (12 buah)</p>
          <p className="text-xs text-white/70">Rusuk adalah <strong>ruas garis yang merupakan pertemuan dua sisi</strong> kubus. Semua rusuk kubus sama panjang (<InlineMath math="= s" />).</p>
          <RusukAnimSVG />
        </div>
        {/* Sisi */}
        <div className="bg-blue-950/40 border border-blue-700/40 rounded-lg p-4 space-y-2">
          <p className="text-blue-300 font-semibold">② Sisi / Bidang (6 buah)</p>
          <p className="text-xs text-white/70">Sisi adalah <strong>bidang yang membatasi</strong> kubus. Setiap sisi berbentuk persegi dengan luas <InlineMath math="s^2" />. Ada 6 sisi: depan, belakang, kiri, kanan, atas, bawah.</p>
          <SisiAnimSVG />
        </div>
        {/* Titik sudut */}
        <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-4 space-y-2">
          <p className="text-yellow-300 font-semibold">③ Titik Sudut (8 buah)</p>
          <p className="text-xs text-white/70">Titik sudut adalah <strong>titik pertemuan tiga rusuk</strong>. Diberi nama dengan huruf kapital (A, B, C, D, E, F, G, H).</p>
          <TitikSudutAnimSVG />
        </div>
        {/* Diagonal bidang */}
        <div className="bg-green-950/40 border border-green-700/40 rounded-lg p-4 space-y-2">
          <p className="text-green-300 font-semibold">④ Diagonal Bidang (12 buah)</p>
          <p className="text-xs text-white/70">Diagonal bidang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dalam satu sisi</strong>. Setiap sisi memiliki 2 diagonal bidang → total 12.</p>
          <AllDiagonalBidangSVG />
          <div className="bg-green-950/60 rounded p-2 text-center">
            <BlockMath math="d_b = s\sqrt{2}" />
          </div>
        </div>
        {/* Diagonal ruang */}
        <div className="bg-red-950/40 border border-red-700/40 rounded-lg p-4 space-y-2">
          <p className="text-red-300 font-semibold">⑤ Diagonal Ruang (4 buah)</p>
          <p className="text-xs text-white/70">Diagonal ruang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dan melewati bagian dalam kubus</strong>.</p>
          <DiagonalRuangSVG />
          <div className="bg-red-950/60 rounded p-2 text-center">
            <BlockMath math="d_r = s\sqrt{3}" />
          </div>
        </div>
        {/* Bidang diagonal */}
        <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-4 space-y-2">
          <p className="text-violet-300 font-semibold">⑥ Bidang Diagonal (6 buah)</p>
          <p className="text-xs text-white/70">Bidang diagonal adalah <strong>bidang yang memotong melalui empat titik sudut dan dua diagonal ruang</strong>. Berbentuk persegi panjang (diagonal bidang × sisi).</p>
          <BidangDiagonalSVG />
          <BidangDiagonalVariasiGallery />
          <div className="bg-violet-950/60 rounded p-2 text-center">
            <BlockMath math="L_{\text{bidang diag}} = s \times s\sqrt{2} = s^2\sqrt{2}" />
          </div>
        </div>
        {/* Summary table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Unsur</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Jumlah</th>
              <th className="px-3 py-2 text-cyan-300">Ukuran</th>
            </tr></thead>
            <tbody>
              {[
                ["Rusuk","12","s"],
                ["Sisi / Bidang","6","s²"],
                ["Titik Sudut","8","—"],
                ["Diagonal Bidang","12","s√2"],
                ["Diagonal Ruang","4","s√3"],
                ["Bidang Diagonal","6","s²√2"],
              ].map(([u,j,uk],i)=>(
                <tr key={i} className={`border-t border-slate-700 ${i%2===0?"bg-slate-900/40":"bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{u}</td>
                  <td className="px-3 py-2 text-yellow-300 border-r border-slate-700">{j}</td>
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
    title: "Rumus Diagonal Bidang, Diagonal Ruang & Bidang Diagonal",
    icon: "📐",
    content: (
      <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
        {/* Diagonal bidang derivation */}
        <div className="bg-green-950/50 border border-green-700/40 rounded-lg p-4 space-y-3">
          <p className="text-green-300 font-semibold">📌 Penurunan: Diagonal Bidang</p>
          <p className="text-xs text-white/70">Ambil satu sisi kubus berbentuk persegi sisi <InlineMath math="s" />. Diagonal bidang adalah diagonal persegi tersebut:</p>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="d_b^2 = s^2 + s^2 = 2s^2" />
            <BlockMath math="\boxed{d_b = s\sqrt{2}}" />
          </div>
        </div>
        {/* Diagonal ruang derivation */}
        <div className="bg-red-950/50 border border-red-700/40 rounded-lg p-4 space-y-3">
          <p className="text-red-300 font-semibold">📌 Penurunan: Diagonal Ruang</p>
          <p className="text-xs text-white/70">Diagonal ruang adalah sisi miring dari segitiga siku-siku yang dibentuk oleh satu sisi alas (<InlineMath math="s" />), diagonal bidang alas (<InlineMath math="s\sqrt{2}" />), dan diagonal ruang sendiri:</p>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="d_r^2 = s^2 + (s\sqrt{2})^2 = s^2 + 2s^2 = 3s^2" />
            <BlockMath math="\boxed{d_r = s\sqrt{3}}" />
          </div>
          <blockquote className="border-l-4 border-red-500 pl-3 text-red-200 text-xs italic">
            🔑 <strong>Cara mudah ingat:</strong> Diagonal bidang = <InlineMath math="s\sqrt{2}" /> (akar 2), Diagonal ruang = <InlineMath math="s\sqrt{3}" /> (akar 3)
          </blockquote>
        </div>
        {/* Bidang diagonal area */}
        <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-4 space-y-3">
          <p className="text-violet-300 font-semibold">📌 Luas Bidang Diagonal</p>
          <p className="text-xs text-white/70">Bidang diagonal berbentuk persegi panjang dengan ukuran: panjang = diagonal bidang (<InlineMath math="s\sqrt{2}" />), lebar = sisi kubus (<InlineMath math="s" />):</p>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="\boxed{L_{\text{BD}} = s \times s\sqrt{2} = s^2\sqrt{2}}" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Jaring-jaring Kubus (11 Pola Interaktif 3D)",
    icon: "🧊",
    content: (
      <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
        <p>
          <strong className="text-cyan-300">Jaring-jaring kubus</strong> adalah pola 2D yang jika dilipat akan membentuk kubus.
          Ada tepat <strong className="text-yellow-300">11 pola jaring-jaring</strong> yang berbeda untuk sebuah kubus.
          Gunakan kubus 3D di bawah untuk melihat proses "pembongkaran" kubus menjadi jaring-jaringnya!
        </p>
        <InteractiveCube3D />
        <div className="space-y-2">
          <p className="text-white/70 text-xs text-center">
            Kubus di atas menggunakan <strong className="text-cyan-300">Jaring #1 (Cross/Salib)</strong> saat dibongkar sepenuhnya.
            Di bawah ini adalah semua <strong className="text-yellow-300">11 pola jaring-jaring</strong> yang valid:
          </p>
          <NetGallery />
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🔑 <strong className="text-white">Cara memverifikasi jaring-jaring:</strong></p>
          <p>Bayangkan melipat setiap kotak. Jika 6 kotak bisa menutup semua sisi kubus tanpa tumpang tindih dan tanpa celah, maka itu adalah jaring-jaring yang valid!</p>
        </div>
      </div>
    ),
  },
  {
    title: "Luas Permukaan Kubus",
    icon: "🎨",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          <strong className="text-orange-300">Luas permukaan kubus</strong> adalah total luas semua sisi yang membungkus kubus.
          Bayangkan kamu ingin membungkus sebuah kotak berbentuk kubus dengan kertas kado — berapa kertas yang dibutuhkan?
        </p>
        <LuasPermukaanSVG />
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
          <p className="text-orange-300 font-semibold">📌 Penurunan Rumus:</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>Kubus punya <strong>6 sisi</strong>, masing-masing berbentuk <strong>persegi dengan luas <InlineMath math="s^2" /></strong>.</p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="L_{\text{permukaan}} = 6 \times s^2" />
            <BlockMath math="\boxed{L = 6s^2}" />
          </div>
        </div>
        <blockquote className="border-l-4 border-orange-500 pl-3 text-orange-200 text-xs italic">
          💡 <strong>Trik mengingat:</strong> Kubus punya 6 sisi persegi yang identik → kalikan luas 1 sisi dengan 6.
        </blockquote>
      </div>
    ),
  },
  {
    title: "Volume Kubus",
    icon: "📦",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          <strong className="text-blue-300">Volume kubus</strong> menyatakan seberapa besar "isi" atau "ruang" yang ditempati kubus.
          Bayangkan kubus terdiri dari lapisan-lapisan kecil berbentuk kubus satuan yang disusun rapat:
        </p>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-1">
          <p className="text-cyan-300 text-xs font-semibold font-body text-center">
            🌊 Kubus diisi air — dari kosong hingga penuh
          </p>
          <WaterKubusAnimation />
          <p className="text-white/45 text-[10px] font-body text-center mt-4">
            Persentase menunjukkan proporsi volume terisi terhadap volume total
          </p>
        </div>
        <div className="bg-blue-950/60 border border-blue-700/50 rounded-lg p-4 space-y-2">
          <p className="text-blue-300 font-semibold">📌 Penurunan Rumus:</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>• Luas alas persegi = <InlineMath math="s \times s = s^2" /></p>
            <p>• Volume = Luas alas × tinggi = <InlineMath math="s^2 \times s = s^3" /></p>
          </div>
          <div className="bg-slate-800/60 rounded p-3">
            <BlockMath math="\boxed{V = s^3}" />
          </div>
          <p className="text-white/60 text-xs">Di mana <InlineMath math="s" /> adalah panjang satu rusuk kubus.</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
          <p>🎯 <strong className="text-white">Satuan volume:</strong></p>
          <p>• Jika <InlineMath math="s" /> dalam cm → Volume dalam <InlineMath math="\text{cm}^3" /></p>
          <p>• Jika <InlineMath math="s" /> dalam m → Volume dalam <InlineMath math="\text{m}^3" /></p>
          <p>• <InlineMath math="1 \text{ m}^3 = 1.000.000 \text{ cm}^3 = 10^6 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    title: "Kesimpulan — Rumus Lengkap Kubus",
    icon: "📊",
    content: (
      <div className="space-y-3 font-body">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: "🔷", label: "8 Titik Sudut", color: "text-yellow-300" },
            { icon: "📏", label: "12 Rusuk", color: "text-cyan-300" },
            { icon: "🟦", label: "6 Sisi", color: "text-blue-300" },
            { icon: "📐", label: "12 Diagonal Bidang", color: "text-green-300" },
            { icon: "🔀", label: "4 Diagonal Ruang", color: "text-red-300" },
            { icon: "🔲", label: "6 Bidang Diagonal", color: "text-violet-300" },
          ].map(({ icon, label, color }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col items-center gap-1">
              <span className="text-2xl">{icon}</span>
              <span className={`text-xs font-semibold font-body text-center ${color}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Besaran</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Rumus</th>
              <th className="px-3 py-2 text-cyan-300">Catatan</th>
            </tr></thead>
            <tbody>
              {[
                ["Keliling semua rusuk","K = 12s","12 rusuk × s"],
                ["Luas 1 sisi","L₁ = s²","persegi"],
                ["Luas permukaan","L = 6s²","6 sisi"],
                ["Diagonal bidang","db = s√2","Pythagoras 2D"],
                ["Diagonal ruang","dr = s√3","Pythagoras 3D"],
                ["Luas bidang diagonal","Lbd = s²√2","persegi panjang"],
                ["Volume","V = s³","pangkat tiga"],
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
          <p>🚀 <strong>Kunci utama kubus:</strong> Semua rumus bergantung pada <strong className="text-yellow-300">satu variabel saja: s (panjang rusuk)</strong>!</p>
          <p>Kalau kamu tahu <InlineMath math="s" />, kamu bisa menghitung segalanya — keliling, luas, diagonal, dan volume.</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE PROBLEMS
───────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const luasExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kotak kado berbentuk kubus dengan panjang rusuk <InlineMath math="8 \text{ cm}" />.</p>
        <p>Berapa luas kertas minimum yang dibutuhkan untuk membungkus seluruh kotak tersebut?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = 6s^2 = 6 \times 8^2 = 6 \times 64 = 384 \text{ cm}^2" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Jawaban: <InlineMath math="384 \text{ cm}^2" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Luas permukaan sebuah kubus adalah <InlineMath math="600 \text{ cm}^2" />.</p>
        <p>Tentukan: (a) panjang rusuknya, (b) panjang diagonal bidang, (c) panjang diagonal ruang.</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Panjang rusuk:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="6s^2 = 600 \Rightarrow s^2 = 100 \Rightarrow s = 10 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Diagonal bidang:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="d_b = s\sqrt{2} = 10\sqrt{2} \approx 14{,}14 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(c) Diagonal ruang:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="d_r = s\sqrt{3} = 10\sqrt{3} \approx 17{,}32 \text{ cm}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs text-white/80 space-y-0.5">
          <p>✅ <InlineMath math="s = 10 \text{ cm}" />, <InlineMath math="d_b = 10\sqrt{2} \text{ cm}" />, <InlineMath math="d_r = 10\sqrt{3} \text{ cm}" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah akuarium berbentuk kubus dengan kapasitas <InlineMath math="125 \text{ liter}" />.</p>
        <p>Jika semua sisi (kecuali bagian atas) terbuat dari kaca setebal <InlineMath math="0{,}5 \text{ cm}" /> seharga <InlineMath math="Rp\,120.000/\text{m}^2" />,</p>
        <p>berapa total biaya kaca untuk akuarium tersebut?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Cari panjang rusuk dari volume:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
          <p><InlineMath math="125 \text{ liter} = 125.000 \text{ cm}^3" /></p>
          <BlockMath math="s^3 = 125.000 \Rightarrow s = \sqrt[3]{125.000} = 50 \text{ cm} = 0{,}5 \text{ m}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Hitung luas kaca (5 sisi, tanpa tutup atas):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = 5 \times s^2 = 5 \times (0{,}5)^2 = 5 \times 0{,}25 = 1{,}25 \text{ m}^2" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Hitung biaya:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Biaya} = 1{,}25 \times 120.000 = Rp\,150.000" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Rusuk akuarium = 50 cm = 0,5 m</p>
          <p className="text-white/80">• Luas kaca = 1,25 m²</p>
          <p className="text-white/80">• Total biaya = <strong className="text-yellow-300">Rp 150.000</strong></p>
        </div>
      </div>
    ),
  },
];

const volExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body">
        <p>Sebuah dadu berbentuk kubus memiliki panjang rusuk <InlineMath math="2 \text{ cm}" />. Berapa volume dadu tersebut?</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="V = s^3 = 2^3 = 8 \text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume = <InlineMath math="8 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah bak mandi berbentuk kubus dapat menampung <InlineMath math="1 \text{ m}^3" /> air.</p>
        <p>Jika bak diisi air hingga <InlineMath math="75\%" /> kapasitasnya, berapa liter air di dalamnya?</p>
        <p className="text-xs text-white/60">(Ingat: <InlineMath math="1 \text{ m}^3 = 1.000 \text{ liter}" />)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
          <BlockMath math="V_{\text{total}} = 1 \text{ m}^3 = 1.000 \text{ liter}" />
          <BlockMath math="V_{75\%} = 75\% \times 1.000 = 750 \text{ liter}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Volume air = 750 liter</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kubus besar dengan rusuk <InlineMath math="12 \text{ cm}" /> diisi dengan kubus-kubus kecil berrusuk <InlineMath math="2 \text{ cm}" />.</p>
        <p>Berapa banyak kubus kecil yang dapat mengisi kubus besar tersebut?</p>
        <p>Jika setiap kubus kecil beratnya <InlineMath math="4 \text{ gram}" />, berapa total beratnya?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2 text-xs">
          <BlockMath math="V_{\text{besar}} = 12^3 = 1.728 \text{ cm}^3" />
          <BlockMath math="V_{\text{kecil}} = 2^3 = 8 \text{ cm}^3" />
          <BlockMath math="\text{Banyak kubus kecil} = \frac{1.728}{8} = 216 \text{ buah}" />
          <BlockMath math="\text{Total berat} = 216 \times 4 = 864 \text{ gram}" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Banyak kubus kecil = <strong className="text-yellow-300">216 buah</strong></p>
          <p className="text-white/80">• Total berat = <strong className="text-yellow-300">864 gram</strong></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          💡 <strong>Cek:</strong> <InlineMath math="\frac{12}{2} = 6" /> kubus per dimensi → <InlineMath math="6^3 = 216" /> ✓
        </div>
      </div>
    ),
  },
];

const kerangkaExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah kerangka kubus dibuat dari kawat. Panjang rusuk kubus tersebut adalah <InlineMath math="9 \text{ cm}" />.</p>
        <p>Berapa panjang kawat minimal yang dibutuhkan untuk membuat kerangka kubus itu?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1 text-xs text-white/70">
          <p>Kubus memiliki <strong className="text-white">12 rusuk</strong>, semuanya sama panjang.</p>
          <p>Kerangka kubus = jumlah panjang semua rusuk = <InlineMath math="12 \times s" /></p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = 12 \times s = 12 \times 9 = 108 \text{ cm}" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Panjang kawat = <InlineMath math="108 \text{ cm}" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Kerangka kubus dibuat menggunakan kawat sepanjang <InlineMath math="144 \text{ cm}" />.</p>
        <p>Tentukan: (a) panjang rusuk kubus, (b) luas permukaan kubus, (c) volume kubus.</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">(a) Panjang rusuk:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="K = 12s \Rightarrow 144 = 12s \Rightarrow s = \frac{144}{12} = 12 \text{ cm}" />
        </div>
        <p className="text-yellow-400 font-semibold">(b) Luas permukaan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = 6s^2 = 6 \times 12^2 = 6 \times 144 = 864 \text{ cm}^2" />
        </div>
        <p className="text-yellow-400 font-semibold">(c) Volume:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="V = s^3 = 12^3 = 1.728 \text{ cm}^3" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs text-white/80 space-y-0.5">
          <p className="text-yellow-300 font-semibold">✅ Jawaban:</p>
          <p>• Rusuk = <InlineMath math="12 \text{ cm}" /></p>
          <p>• Luas permukaan = <InlineMath math="864 \text{ cm}^2" /></p>
          <p>• Volume = <InlineMath math="1.728 \text{ cm}^3" /></p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Tiga kerangka kubus dibuat dari kawat. Panjang rusuk ketiga kubus merupakan tiga bilangan bulat berurutan (dalam cm).</p>
        <p>Jika total panjang kawat untuk ketiga kerangka tersebut adalah <InlineMath math="432 \text{ cm}" />, tentukan:</p>
        <p>(a) Panjang rusuk masing-masing kubus</p>
        <p>(b) Volume kubus yang terbesar</p>
        <p>(c) Luas permukaan kubus yang terkecil</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Misalkan rusuk ketiga kubus:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1 text-xs text-white/70">
          <p>Misalkan rusuk ketiga kubus: <InlineMath math="n,\ n+1,\ n+2" /> (cm)</p>
          <p>Total kerangka = jumlah panjang semua kawat ketiga kubus</p>
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Buat persamaan dan selesaikan:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="12n + 12(n+1) + 12(n+2) = 432" />
          <BlockMath math="12(3n + 3) = 432" />
          <BlockMath math="3n + 3 = 36 \Rightarrow n = 11" />
        </div>
        <p className="text-red-400 font-semibold">(a) Panjang rusuk:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/80 space-y-0.5">
          <p>• Kubus 1: <InlineMath math="s_1 = 11 \text{ cm}" /></p>
          <p>• Kubus 2: <InlineMath math="s_2 = 12 \text{ cm}" /></p>
          <p>• Kubus 3: <InlineMath math="s_3 = 13 \text{ cm}" /></p>
        </div>
        <p className="text-red-400 font-semibold">(b) Volume kubus terbesar (<InlineMath math="s = 13" /> cm):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="V = s^3 = 13^3 = 2.197 \text{ cm}^3" />
        </div>
        <p className="text-red-400 font-semibold">(c) Luas permukaan kubus terkecil (<InlineMath math="s = 11" /> cm):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="L = 6s^2 = 6 \times 11^2 = 6 \times 121 = 726 \text{ cm}^2" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Rusuk: <strong className="text-yellow-300">11 cm, 12 cm, 13 cm</strong></p>
          <p className="text-white/80">• Volume terbesar: <strong className="text-yellow-300">2.197 cm³</strong></p>
          <p className="text-white/80">• Luas permukaan terkecil: <strong className="text-yellow-300">726 cm²</strong></p>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
          💡 <strong>Cek:</strong> <InlineMath math="12(11+12+13) = 12 \times 36 = 432 \text{ cm}" /> ✓
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────── */
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
   MAIN PAGE — SLIDE LAYOUT
───────────────────────────────────────────── */
const KubusPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Pengantar",
      icon: "🎯",
      content: (
        <div className="space-y-4 font-body">
          <SimpleRotatableCube />
          <div className="bg-card/60 border border-border rounded-xl p-4 text-sm text-white/75 leading-relaxed">
            <p>
              Dari kotak pembungkus kado hingga dadu permainan, kubus ada di mana-mana! Pelajari semua tentang
              <strong className="text-cyan-300"> kubus</strong> — mulai dari unsur-unsurnya, jaring-jaring interaktif 3D,
              hingga cara menghitung <strong className="text-yellow-300">luas permukaan</strong> dan <strong className="text-green-300">volume</strong>-nya.
            </p>
          </div>
          {/* Contoh benda berbentuk kubus */}
          <div className="bg-slate-800/50 border border-slate-600/40 rounded-xl p-3">
            <p className="text-xs text-cyan-300 font-semibold mb-2 text-center">📦 Contoh Benda Berbentuk Kubus dalam Kehidupan Sehari-hari</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { src: imgRubik,    label: "Rubik's Cube" },
                { src: imgDadu,     label: "Dadu" },
                { src: imgAkuarium, label: "Akuarium Kubus" },
                { src: imgBrankas,  label: "Brankas" },
                { src: imgHadiah,   label: "Kotak Hadiah" },
                { src: imgEsBatu,   label: "Es Batu" },
                { src: imgJam,      label: "Jam Digital" },
                { src: imgSpeaker,  label: "Speaker Bluetooth" },
                { src: imgBak,      label: "Bak Mandi" },
              ].map(({ src, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-600/50 bg-slate-900/40">
                    <img src={src} alt={label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-white/65 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/40 text-center mt-2">
              Sumber:{" "}
              <a href="https://salamadian.com/benda-berbentuk-kubus/" target="_blank" rel="noopener noreferrer" className="text-cyan-400/70 underline hover:text-cyan-300 transition-colors">
                salamadian.com/benda-berbentuk-kubus
              </a>
            </p>
          </div>
        </div>
      ),
    },
    { title: sections[0].title, icon: sections[0].icon, content: sections[0].content },
    {
      title: "Unsur Kubus — Rusuk",
      icon: "📏",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-cyan-950/40 border border-cyan-700/40 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">① Rusuk (12 buah)</p>
            <p className="text-xs text-white/70">Rusuk adalah <strong>ruas garis yang merupakan pertemuan dua sisi</strong> kubus. Pada kubus <strong className="text-cyan-300">ABCD.EFGH</strong>, semua rusuk sama panjang (<InlineMath math="= s" />).</p>
            <RusukAnimSVG />
          </div>
          <div className="bg-cyan-950/30 border border-cyan-700/40 rounded-lg p-3 space-y-3">
            <p className="text-xs text-cyan-200 font-semibold">Penamaan 12 rusuk pada kubus ABCD.EFGH:</p>
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-cyan-300 font-semibold mb-1">Rusuk alas ABCD</p>
                <p className="text-white/75">AB, BC, CD, DA</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-cyan-300 font-semibold mb-1">Rusuk atas EFGH</p>
                <p className="text-white/75">EF, FG, GH, HE</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-cyan-300 font-semibold mb-1">Rusuk tegak</p>
                <p className="text-white/75">AE, BF, CG, DH</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
            <p>🔑 <strong className="text-cyan-300">Jumlah rusuk kubus = 12</strong>, semuanya memiliki panjang yang sama yaitu <InlineMath math="s" />.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Unsur Kubus — Sisi / Bidang",
      icon: "🟦",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-blue-950/40 border border-blue-700/40 rounded-lg p-4 space-y-2">
            <p className="text-blue-300 font-semibold">② Sisi / Bidang (6 buah)</p>
            <p className="text-xs text-white/70">Sisi adalah <strong>bidang yang membatasi</strong> kubus. Setiap sisi berbentuk persegi dengan luas <InlineMath math="s^2" />. Pada kubus <strong className="text-blue-300">ABCD.EFGH</strong>, terdapat 6 sisi:</p>
            <SisiAnimSVG />
          </div>
          <div className="bg-blue-950/30 border border-blue-700/40 rounded-lg p-3 space-y-2">
            <p className="text-xs text-blue-200 font-semibold">Penamaan 6 sisi pada kubus ABCD.EFGH:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-blue-300 font-semibold mb-1">Sisi Alas</p>
                <p className="text-white/75">ABCD</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-blue-300 font-semibold mb-1">Sisi Atas</p>
                <p className="text-white/75">EFGH</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-blue-300 font-semibold mb-1">Sisi Depan</p>
                <p className="text-white/75">ABFE</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-blue-300 font-semibold mb-1">Sisi Belakang</p>
                <p className="text-white/75">DCGH</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-blue-300 font-semibold mb-1">Sisi Kiri</p>
                <p className="text-white/75">ADHE</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-blue-300 font-semibold mb-1">Sisi Kanan</p>
                <p className="text-white/75">BCGF</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
            <p>🔑 <strong className="text-blue-300">Jumlah sisi kubus = 6</strong>, setiap sisi berbentuk persegi dengan luas <InlineMath math="s^2" />.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Unsur Kubus — Titik Sudut",
      icon: "🔷",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-lg p-4 space-y-2">
            <p className="text-yellow-300 font-semibold">③ Titik Sudut (8 buah)</p>
            <p className="text-xs text-white/70">Titik sudut adalah <strong>titik pertemuan tiga rusuk</strong>. Pada kubus <strong className="text-yellow-300">ABCD.EFGH</strong>, terdapat 8 titik sudut:</p>
            <TitikSudutAnimSVG />
          </div>
          <div className="bg-yellow-950/30 border border-yellow-700/40 rounded-lg p-3 space-y-2">
            <p className="text-xs text-yellow-200 font-semibold">8 Titik Sudut pada kubus ABCD.EFGH:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut A</p>
                <p className="text-white/65">Alas — depan kiri</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut B</p>
                <p className="text-white/65">Alas — depan kanan</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut C</p>
                <p className="text-white/65">Alas — belakang kanan</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut D</p>
                <p className="text-white/65">Alas — belakang kiri</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut E</p>
                <p className="text-white/65">Atas — depan kiri</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut F</p>
                <p className="text-white/65">Atas — depan kanan</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut G</p>
                <p className="text-white/65">Atas — belakang kanan</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 border border-slate-700/60 p-3">
                <p className="text-yellow-300 font-semibold mb-1">Titik Sudut H</p>
                <p className="text-white/65">Atas — belakang kiri</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
            <p>🔑 <strong className="text-yellow-300">Jumlah titik sudut kubus = 8</strong>, setiap titik merupakan pertemuan tiga rusuk.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Unsur Kubus — Diagonal Bidang",
      icon: "📐",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-green-950/40 border border-green-700/40 rounded-lg p-4 space-y-2">
            <p className="text-green-300 font-semibold">④ Diagonal Bidang (12 buah)</p>
            <p className="text-xs text-white/70">Diagonal bidang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dalam satu sisi</strong>. Setiap sisi memiliki 2 diagonal bidang → total 12.</p>
            <AllDiagonalBidangSVG />
            <div className="bg-green-950/60 rounded p-2 text-center">
              <BlockMath math="d_b = s\sqrt{2}" />
            </div>
          </div>

          {/* Pythagoras derivation */}
          <div className="bg-slate-900/70 border border-cyan-700/40 rounded-lg p-4 space-y-3">
            <p className="text-cyan-300 font-semibold text-xs">📐 Mengapa diagonal bidang = <InlineMath math="s\sqrt{2}" /> ? — Pembuktian dengan Pythagoras</p>
            <p className="text-xs text-white/65">Ambil contoh diagonal bidang <strong className="text-cyan-300">AC</strong> pada sisi alas ABCD. Karena ABCD adalah persegi, segitiga ABC siku-siku di B.</p>

            {/* Side-by-side diagrams */}
            <div className="flex flex-wrap gap-4 justify-center items-end">

              {/* Cube sketch with AC highlighted */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] text-slate-400 font-body">Kubus ABCD.EFGH</p>
                <svg width="155" height="175" viewBox="0 0 155 175">
                  {/* Bottom face ABCD – green fill to highlight */}
                  <polygon points="15,148 95,148 128,122 48,122" fill="#14532d55" stroke="#16a34a" strokeWidth="1.5"/>
                  {/* Front face ABFE */}
                  <polygon points="15,148 95,148 95,68 15,68" fill="#0f172a99" stroke="#334155" strokeWidth="1"/>
                  {/* Right face BCGF */}
                  <polygon points="95,148 128,122 128,42 95,68" fill="#0f172a66" stroke="#334155" strokeWidth="1"/>
                  {/* Top face EFGH */}
                  <polygon points="15,68 95,68 128,42 48,42" fill="#1e293b88" stroke="#334155" strokeWidth="1"/>
                  {/* Hidden back edges dashed */}
                  <line x1="48" y1="122" x2="48" y2="42" stroke="#475569" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="48" y1="122" x2="128" y2="122" stroke="#16a34a" strokeWidth="1" strokeDasharray="3,3"/>
                  <line x1="15" y1="68" x2="48" y2="42" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3"/>
                  {/* Diagonal AC – bright cyan */}
                  <line x1="15" y1="148" x2="128" y2="122" stroke="#22d3ee" strokeWidth="2.5"/>
                  {/* Right-angle marker at B on bottom face */}
                  <polyline points="95,135 84,132 87,121" fill="none" stroke="#ffffff55" strokeWidth="1.2"/>
                  {/* s labels on visible edges */}
                  <text x="50" y="162" fill="#86efac" fontSize="8" fontFamily="monospace" textAnchor="middle">s</text>
                  <text x="113" y="142" fill="#86efac" fontSize="8" fontFamily="monospace">s</text>
                  {/* AC label */}
                  <text x="58" y="140" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(-13,58,140)">AC</text>
                  {/* Vertex labels bottom face */}
                  <text x="4"  y="158" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
                  <text x="97" y="158" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
                  <text x="130" y="130" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
                  <text x="42" y="132" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">D</text>
                  {/* Vertex labels top face */}
                  <text x="4"  y="66" fill="#94a3b8" fontSize="9" fontFamily="monospace">E</text>
                  <text x="97" y="66" fill="#94a3b8" fontSize="9" fontFamily="monospace">F</text>
                  <text x="130" y="50" fill="#94a3b8" fontSize="9" fontFamily="monospace">G</text>
                  <text x="42" y="50" fill="#94a3b8" fontSize="9" fontFamily="monospace">H</text>
                </svg>
              </div>

              {/* Right triangle ABC */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] text-slate-400 font-body">Segitiga siku-siku ABC</p>
                <svg width="130" height="175" viewBox="0 0 130 175">
                  {/* Triangle fill */}
                  <polygon points="10,148 110,148 110,48" fill="#0c4a6e44"/>
                  {/* Side AB – orange */}
                  <line x1="10" y1="148" x2="110" y2="148" stroke="#f97316" strokeWidth="2.5"/>
                  {/* Side BC – purple */}
                  <line x1="110" y1="148" x2="110" y2="48" stroke="#a855f7" strokeWidth="2.5"/>
                  {/* Hypotenuse AC – cyan */}
                  <line x1="10" y1="148" x2="110" y2="48" stroke="#22d3ee" strokeWidth="2.5"/>
                  {/* Right angle box at B */}
                  <rect x="98" y="136" width="12" height="12" fill="none" stroke="#ffffff66" strokeWidth="1.5"/>
                  {/* Labels sides */}
                  <text x="60" y="163" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">AB = s</text>
                  <text x="116" y="103" fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="bold">BC = s</text>
                  <text x="34" y="93" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(-45,54,98)" textAnchor="middle">AC = s√2</text>
                  {/* Vertex labels */}
                  <text x="1"  y="162" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
                  <text x="113" y="162" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
                  <text x="113" y="47"  fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
                  {/* Siku-siku label */}
                  <text x="55" y="20" fill="#ffffff44" fontSize="8" fontFamily="monospace" textAnchor="middle">∠B = 90°</text>
                </svg>
              </div>
            </div>

            {/* Step-by-step Pythagoras */}
            <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs">
              <p className="text-white/80 font-semibold">Langkah pembuktian:</p>
              <div className="space-y-1 text-white/70">
                <p>① Sisi ABCD adalah persegi dengan sisi <InlineMath math="s"/>, sehingga <InlineMath math="AB = BC = s"/></p>
                <p>② Sudut di titik B adalah <strong className="text-white/90">90°</strong> (sudut kubus)</p>
                <p>③ Terapkan Teorema Pythagoras pada segitiga ABC:</p>
              </div>
              <div className="bg-slate-900/60 rounded p-2 text-center space-y-1">
                <BlockMath math="AC^2 = AB^2 + BC^2"/>
                <BlockMath math="AC^2 = s^2 + s^2 = 2s^2"/>
                <BlockMath math="\boxed{AC = s\sqrt{2}}"/>
              </div>
              <p className="text-green-300 text-xs">∴ Panjang diagonal bidang AC = <InlineMath math="s\sqrt{2}"/>, berlaku untuk semua 12 diagonal bidang kubus.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Unsur Kubus — Diagonal Ruang",
      icon: "🔀",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-red-950/40 border border-red-700/40 rounded-lg p-4 space-y-2">
            <p className="text-red-300 font-semibold">⑤ Diagonal Ruang (4 buah)</p>
            <p className="text-xs text-white/70">Diagonal ruang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dan melewati bagian dalam kubus</strong>. Kubus ABCD.EFGH memiliki tepat <strong className="text-red-300">4 diagonal ruang</strong>:</p>
            <div className="bg-red-950/60 rounded p-2 text-center">
              <BlockMath math="d_r = s\sqrt{3}" />
            </div>
          </div>

          {/* 4 individual cubes, one diagonal each */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. AG — merah */}
            <div className="bg-slate-900/70 border border-red-700/50 rounded-xl p-3 flex flex-col items-center gap-1">
              <p className="text-red-400 font-bold text-xs font-body">Diagonal AG</p>
              <svg className="w-full" viewBox="0 0 100 108">
                <defs><style>{`@keyframes drGlow1{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style></defs>
                <polygon points="8,95 62,95 84,77 30,77" fill="#14532d22" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,95 62,95 62,44 8,44"  fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="62,95 84,77 84,26 62,44" fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,44 62,44 84,26 30,26" fill="#1e293b" stroke="#475569" strokeWidth="0.8"/>
                <line x1="30" y1="77" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="30" y1="77" x2="84" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8"  y1="44" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8" y1="95" x2="30" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8" y1="95" x2="84" y2="26" stroke="#ef4444" strokeWidth="2.2"
                  style={{filter:"drop-shadow(0 0 6px #ef4444)",animation:"drGlow1 1.5s ease-in-out infinite"}}/>
                <circle cx="8"  cy="95" r="3" fill="#ef4444"/>
                <circle cx="84" cy="26" r="3" fill="#ef4444"/>
                <text x="1"  y="106" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">A</text>
                <text x="86" y="24"  fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">G</text>
                <text x="63" y="103" fill="#94a3b8" fontSize="7" fontFamily="monospace">B</text>
                <text x="85" y="80"  fill="#94a3b8" fontSize="7" fontFamily="monospace">C</text>
                <text x="24" y="80"  fill="#94a3b8" fontSize="7" fontFamily="monospace">D</text>
                <text x="1"  y="42"  fill="#94a3b8" fontSize="7" fontFamily="monospace">E</text>
                <text x="63" y="42"  fill="#94a3b8" fontSize="7" fontFamily="monospace">F</text>
                <text x="24" y="24"  fill="#94a3b8" fontSize="7" fontFamily="monospace">H</text>
              </svg>
            </div>

            {/* 2. BH — amber */}
            <div className="bg-slate-900/70 border border-amber-600/50 rounded-xl p-3 flex flex-col items-center gap-1">
              <p className="text-amber-400 font-bold text-xs font-body">Diagonal BH</p>
              <svg className="w-full" viewBox="0 0 100 108">
                <defs><style>{`@keyframes drGlow2{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style></defs>
                <polygon points="8,95 62,95 84,77 30,77" fill="#14532d22" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,95 62,95 62,44 8,44"  fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="62,95 84,77 84,26 62,44" fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,44 62,44 84,26 30,26" fill="#1e293b" stroke="#475569" strokeWidth="0.8"/>
                <line x1="30" y1="77" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="30" y1="77" x2="84" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8"  y1="44" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8" y1="95" x2="30" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="62" y1="95" x2="30" y2="26" stroke="#f59e0b" strokeWidth="2.2"
                  style={{filter:"drop-shadow(0 0 6px #f59e0b)",animation:"drGlow2 1.5s ease-in-out infinite 0.37s"}}/>
                <circle cx="62" cy="95" r="3" fill="#f59e0b"/>
                <circle cx="30" cy="26" r="3" fill="#f59e0b"/>
                <text x="63" y="106" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">B</text>
                <text x="22" y="24"  fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">H</text>
                <text x="1"  y="106" fill="#94a3b8" fontSize="7" fontFamily="monospace">A</text>
                <text x="85" y="80"  fill="#94a3b8" fontSize="7" fontFamily="monospace">C</text>
                <text x="24" y="80"  fill="#94a3b8" fontSize="7" fontFamily="monospace">D</text>
                <text x="1"  y="42"  fill="#94a3b8" fontSize="7" fontFamily="monospace">E</text>
                <text x="63" y="42"  fill="#94a3b8" fontSize="7" fontFamily="monospace">F</text>
                <text x="86" y="24"  fill="#94a3b8" fontSize="7" fontFamily="monospace">G</text>
              </svg>
            </div>

            {/* 3. CE — hijau */}
            <div className="bg-slate-900/70 border border-green-600/50 rounded-xl p-3 flex flex-col items-center gap-1">
              <p className="text-green-400 font-bold text-xs font-body">Diagonal CE</p>
              <svg className="w-full" viewBox="0 0 100 108">
                <defs><style>{`@keyframes drGlow3{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style></defs>
                <polygon points="8,95 62,95 84,77 30,77" fill="#14532d22" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,95 62,95 62,44 8,44"  fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="62,95 84,77 84,26 62,44" fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,44 62,44 84,26 30,26" fill="#1e293b" stroke="#475569" strokeWidth="0.8"/>
                <line x1="30" y1="77" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="30" y1="77" x2="84" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8"  y1="44" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8" y1="95" x2="30" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="84" y1="77" x2="8" y2="44" stroke="#22c55e" strokeWidth="2.2"
                  style={{filter:"drop-shadow(0 0 6px #22c55e)",animation:"drGlow3 1.5s ease-in-out infinite 0.74s"}}/>
                <circle cx="84" cy="77" r="3" fill="#22c55e"/>
                <circle cx="8"  cy="44" r="3" fill="#22c55e"/>
                <text x="85" y="80"  fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">C</text>
                <text x="1"  y="42"  fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">E</text>
                <text x="1"  y="106" fill="#94a3b8" fontSize="7" fontFamily="monospace">A</text>
                <text x="63" y="106" fill="#94a3b8" fontSize="7" fontFamily="monospace">B</text>
                <text x="24" y="80"  fill="#94a3b8" fontSize="7" fontFamily="monospace">D</text>
                <text x="63" y="42"  fill="#94a3b8" fontSize="7" fontFamily="monospace">F</text>
                <text x="86" y="24"  fill="#94a3b8" fontSize="7" fontFamily="monospace">G</text>
                <text x="24" y="24"  fill="#94a3b8" fontSize="7" fontFamily="monospace">H</text>
              </svg>
            </div>

            {/* 4. DF — violet */}
            <div className="bg-slate-900/70 border border-violet-600/50 rounded-xl p-3 flex flex-col items-center gap-1">
              <p className="text-violet-400 font-bold text-xs font-body">Diagonal DF</p>
              <svg className="w-full" viewBox="0 0 100 108">
                <defs><style>{`@keyframes drGlow4{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.1;}}`}</style></defs>
                <polygon points="8,95 62,95 84,77 30,77" fill="#14532d22" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,95 62,95 62,44 8,44"  fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="62,95 84,77 84,26 62,44" fill="#0f172a" stroke="#475569" strokeWidth="0.8"/>
                <polygon points="8,44 62,44 84,26 30,26" fill="#1e293b" stroke="#475569" strokeWidth="0.8"/>
                <line x1="30" y1="77" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="30" y1="77" x2="84" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8"  y1="44" x2="30" y2="26" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="8" y1="95" x2="30" y2="77" stroke="#475569" strokeWidth="0.6" strokeDasharray="3,2"/>
                <line x1="30" y1="77" x2="62" y2="44" stroke="#a855f7" strokeWidth="2.2"
                  style={{filter:"drop-shadow(0 0 6px #a855f7)",animation:"drGlow4 1.5s ease-in-out infinite 1.11s"}}/>
                <circle cx="30" cy="77" r="3" fill="#a855f7"/>
                <circle cx="62" cy="44" r="3" fill="#a855f7"/>
                <text x="22" y="80"  fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">D</text>
                <text x="63" y="42"  fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">F</text>
                <text x="1"  y="106" fill="#94a3b8" fontSize="7" fontFamily="monospace">A</text>
                <text x="63" y="106" fill="#94a3b8" fontSize="7" fontFamily="monospace">B</text>
                <text x="85" y="80"  fill="#94a3b8" fontSize="7" fontFamily="monospace">C</text>
                <text x="1"  y="42"  fill="#94a3b8" fontSize="7" fontFamily="monospace">E</text>
                <text x="86" y="24"  fill="#94a3b8" fontSize="7" fontFamily="monospace">G</text>
                <text x="24" y="24"  fill="#94a3b8" fontSize="7" fontFamily="monospace">H</text>
              </svg>
            </div>
          </div>

          {/* Pythagoras derivation for HB */}
          <div className="bg-slate-900/70 border border-amber-600/40 rounded-lg p-4 space-y-3">
            <p className="text-amber-300 font-semibold text-xs">📐 Mengapa diagonal ruang = <InlineMath math="s\sqrt{3}" /> ? — Pembuktian 2 langkah (sampel: BH)</p>
            <p className="text-xs text-white/65">
              Gunakan <strong className="text-amber-300">dua kali Teorema Pythagoras</strong>: pertama cari diagonal bidang BD pada sisi alas, lalu gunakan BD dan DH untuk mencari BH.
            </p>

            {/* Side-by-side: cube sketch + triangle */}
            <div className="flex flex-wrap gap-4 justify-center items-end">

              {/* Cube sketch highlighting BH and the helper triangle */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] text-slate-400 font-body">Kubus — diagonal BH</p>
                <svg width="155" height="175" viewBox="0 0 155 175">
                  {/* Bottom face */}
                  <polygon points="15,148 95,148 128,122 48,122" fill="#78350f22" stroke="#475569" strokeWidth="1"/>
                  {/* Front face */}
                  <polygon points="15,148 95,148 95,68 15,68" fill="#0f172a99" stroke="#334155" strokeWidth="1"/>
                  {/* Right face */}
                  <polygon points="95,148 128,122 128,42 95,68" fill="#0f172a66" stroke="#334155" strokeWidth="1"/>
                  {/* Top face */}
                  <polygon points="15,68 95,68 128,42 48,42" fill="#1e293b88" stroke="#334155" strokeWidth="1"/>
                  {/* Hidden back edges */}
                  <line x1="48" y1="122" x2="48" y2="42"  stroke="#475569" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="48" y1="122" x2="128" y2="122" stroke="#475569" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="15" y1="68"  x2="48" y2="42"  stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3"/>
                  {/* BD — diagonal bidang alas (orange, step 1) */}
                  <line x1="95" y1="148" x2="48" y2="122" stroke="#f97316" strokeWidth="2" strokeDasharray="5,3"/>
                  {/* DH — rusuk tegak (purple, step 2) */}
                  <line x1="48" y1="122" x2="48" y2="42" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,3"/>
                  {/* BH — diagonal ruang (amber, result) */}
                  <line x1="95" y1="148" x2="48" y2="42" stroke="#f59e0b" strokeWidth="2.5"/>
                  {/* Right angle at D */}
                  <polyline points="48,109 56,112 55,122" fill="none" stroke="#ffffff55" strokeWidth="1.2"/>
                  {/* Vertex labels */}
                  <text x="4"  y="158" fill="#94a3b8" fontSize="10" fontFamily="monospace">A</text>
                  <text x="97" y="158" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
                  <text x="130" y="130" fill="#94a3b8" fontSize="10" fontFamily="monospace">C</text>
                  <text x="38" y="132" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">D</text>
                  <text x="4"  y="66"  fill="#94a3b8" fontSize="9" fontFamily="monospace">E</text>
                  <text x="97" y="66"  fill="#94a3b8" fontSize="9" fontFamily="monospace">F</text>
                  <text x="130" y="50" fill="#94a3b8" fontSize="9" fontFamily="monospace">G</text>
                  <text x="38" y="40"  fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">H</text>
                  {/* Labels on key segments */}
                  <text x="68" y="143" fill="#f97316" fontSize="8" fontFamily="monospace" fontWeight="bold">BD=s√2</text>
                  <text x="3"  y="88"  fill="#a855f7" fontSize="8" fontFamily="monospace" fontWeight="bold" transform="rotate(-90,20,90)">DH=s</text>
                  <text x="58" y="100" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold" transform="rotate(-50,75,108)">BH=s√3</text>
                </svg>
              </div>

              {/* Right triangle BDH */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] text-slate-400 font-body">Segitiga siku-siku BDH</p>
                <svg width="130" height="175" viewBox="0 0 130 175">
                  {/* Triangle fill */}
                  <polygon points="10,148 110,148 10,48" fill="#78350f33"/>
                  {/* BD — orange (bottom) */}
                  <line x1="10" y1="148" x2="110" y2="148" stroke="#f97316" strokeWidth="2.5"/>
                  {/* DH — purple (left vertical) */}
                  <line x1="10" y1="148" x2="10"  y2="48"  stroke="#a855f7" strokeWidth="2.5"/>
                  {/* BH — amber hypotenuse */}
                  <line x1="110" y1="148" x2="10" y2="48"  stroke="#f59e0b" strokeWidth="2.5"/>
                  {/* Right angle at D */}
                  <rect x="10" y="136" width="12" height="12" fill="none" stroke="#ffffff66" strokeWidth="1.5"/>
                  {/* Side labels */}
                  <text x="60" y="163" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">BD = s√2</text>
                  <text x="16" y="103" fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold">DH = s</text>
                  <text x="58" y="85"  fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(-46,58,105)" textAnchor="middle">BH = s√3</text>
                  {/* Vertex labels */}
                  <text x="1"  y="162" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
                  <text x="113" y="162" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
                  <text x="1"  y="46"  fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">H</text>
                  {/* angle label */}
                  <text x="60" y="20" fill="#ffffff44" fontSize="8" fontFamily="monospace" textAnchor="middle">∠D = 90°</text>
                </svg>
              </div>
            </div>

            {/* Step-by-step proof */}
            <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs">
              <p className="text-white/80 font-semibold">Langkah pembuktian (2 tahap):</p>
              <div className="space-y-1 text-white/70">
                <p><strong className="text-orange-400">Tahap 1</strong> — Cari diagonal bidang BD (pada sisi alas ABCD):</p>
              </div>
              <div className="bg-slate-900/60 rounded p-2 text-center space-y-1">
                <BlockMath math="BD^2 = AB^2 + AD^2 = s^2 + s^2 = 2s^2"/>
                <BlockMath math="BD = s\sqrt{2}"/>
              </div>
              <div className="space-y-1 text-white/70">
                <p><strong className="text-purple-400">Tahap 2</strong> — Cari diagonal ruang BH dengan segitiga BDH siku-siku di D:</p>
              </div>
              <div className="bg-slate-900/60 rounded p-2 text-center space-y-1">
                <BlockMath math="BH^2 = BD^2 + DH^2"/>
                <BlockMath math="BH^2 = (s\sqrt{2})^2 + s^2 = 2s^2 + s^2 = 3s^2"/>
                <BlockMath math="\boxed{BH = s\sqrt{3}}"/>
              </div>
              <p className="text-amber-300 text-xs">∴ Panjang diagonal ruang BH = <InlineMath math="s\sqrt{3}"/>, berlaku untuk semua 4 diagonal ruang kubus.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Unsur Kubus — Bidang Diagonal",
      icon: "🔲",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body">
          <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-4 space-y-2">
            <p className="text-violet-300 font-semibold">⑥ Bidang Diagonal (6 buah)</p>
            <p className="text-xs text-white/70">Bidang diagonal adalah <strong>bidang yang memotong melalui empat titik sudut dan dua diagonal ruang</strong>. Berbentuk persegi panjang (diagonal bidang × sisi).</p>
            <BidangDiagonalVariasiGallery />
            <div className="bg-violet-950/60 rounded p-2 text-center">
              <BlockMath math="L_{\text{bidang diag}} = s \times s\sqrt{2} = s^2\sqrt{2}" />
            </div>
          </div>

          {/* Penjelasan rumus L = p × l */}
          <div className="bg-slate-900/70 border border-violet-600/40 rounded-lg p-4 space-y-3">
            <p className="text-violet-300 font-semibold text-xs">🔲 Mengapa L = s × s√2 ? — Karena Bidang Diagonal Berbentuk Persegi Panjang</p>
            <p className="text-xs text-white/65">
              Ambil contoh bidang diagonal <strong className="text-violet-300">ABGH</strong>. Bidang ini terbentuk dari empat titik sudut kubus dan memiliki dua pasang sisi sejajar yang berbeda ukuran, yaitu:
            </p>

            {/* Rectangle diagram */}
            <div className="flex justify-center">
              <svg width="220" height="120" viewBox="0 0 220 120">
                {/* Rectangle ABGH */}
                <rect x="20" y="20" width="180" height="80" fill="#4c1d9522" stroke="#a855f7" strokeWidth="2" rx="3"/>
                {/* Labels vertices */}
                <text x="8"  y="18"  fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
                <text x="200" y="18" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
                <text x="200" y="112" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">G</text>
                <text x="8"  y="112" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">H</text>
                {/* lebar label (top — s, rusuk alas/atas) */}
                <text x="110" y="14" fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">l = s  (rusuk)</text>
                {/* panjang label (right — s√2, diagonal bidang) */}
                <text x="216" y="62" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(90,213,62)">p = s√2  (diagonal bidang)</text>
                {/* right angle marks */}
                <rect x="20" y="20" width="10" height="10" fill="none" stroke="#ffffff44" strokeWidth="1"/>
                <rect x="190" y="20" width="10" height="10" fill="none" stroke="#ffffff44" strokeWidth="1"/>
                <rect x="190" y="90" width="10" height="10" fill="none" stroke="#ffffff44" strokeWidth="1"/>
                <rect x="20" y="90" width="10" height="10" fill="none" stroke="#ffffff44" strokeWidth="1"/>
              </svg>
            </div>

            {/* Step-by-step */}
            <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs">
              <p className="text-white/80 font-semibold">Penurunan rumus:</p>
              <div className="space-y-1 text-white/70">
                <p>① Bidang diagonal <strong className="text-violet-300">ABGH</strong> berbentuk <strong className="text-white/90">persegi panjang</strong></p>
                <p>② Panjang (<InlineMath math="p"/>): sisi AH atau BG = diagonal bidang = <strong className="text-orange-400">s√2</strong></p>
                <p>③ Lebar (<InlineMath math="l"/>): sisi AB atau GH = rusuk kubus = <strong className="text-violet-400">s</strong></p>
                <p>④ Terapkan rumus luas persegi panjang <InlineMath math="L = p \times l"/>:</p>
              </div>
              <div className="bg-slate-900/60 rounded p-2 text-center space-y-1">
                <BlockMath math="L = p \times l"/>
                <BlockMath math="L = s\sqrt{2} \times s"/>
                <BlockMath math="\boxed{L = s^2\sqrt{2}}"/>
              </div>
              <p className="text-violet-300 text-xs">∴ Luas bidang diagonal = <InlineMath math="s^2\sqrt{2}"/>, berlaku untuk semua 6 bidang diagonal kubus.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Jaring-jaring Kubus — 3D Interaktif",
      icon: "🧊",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <p>
            <strong className="text-cyan-300">Jaring-jaring kubus</strong> adalah pola 2D yang jika dilipat akan membentuk kubus.
            Gunakan kubus 3D di bawah untuk melihat proses "pembongkaran" kubus menjadi jaring-jaringnya!
          </p>
          <InteractiveCube3D />
        </div>
      ),
    },
    {
      title: "11 Pola Jaring-jaring Kubus",
      icon: "🗂️",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <p className="text-white/70 text-xs text-center">
            Ada tepat <strong className="text-yellow-300">11 pola jaring-jaring</strong> yang berbeda dan valid untuk sebuah kubus:
          </p>
          <NetGallery />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p>🔑 <strong className="text-white">Cara memverifikasi jaring-jaring:</strong></p>
            <p>Bayangkan melipat setiap kotak. Jika 6 kotak bisa menutup semua sisi kubus tanpa tumpang tindih dan tanpa celah, maka itu adalah jaring-jaring yang valid!</p>
          </div>
        </div>
      ),
    },
    {
      title: "Kerangka Kubus",
      icon: "🪡",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
            <p className="text-cyan-300 font-semibold text-sm font-display">🪡 Kerangka Kubus</p>
            <p className="text-white/70 text-xs font-body leading-relaxed">
              Kerangka kubus adalah rangka yang terbentuk dari semua rusuknya.
              Kubus memiliki <strong className="text-white">12 rusuk</strong> yang{" "}
              <strong className="text-cyan-300">semuanya sama panjang</strong>.
              Bongkar kerangka di bawah ini untuk membuktikan bahwa total panjang rusuk ={" "}
              <strong className="text-yellow-300">12 × s</strong>:
            </p>
          </div>

          <InteractiveKerangkaKubus />

          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p>🚀 <strong>Kunci utama kubus:</strong> Karena semua rusuk{" "}
              <strong className="text-yellow-300">sama panjang (s)</strong>, rumus kerangka cukup{" "}
              <InlineMath math="K = 12s" />.
            </p>
            <p>Contoh: jika <InlineMath math="s = 8\text{ cm}" />, maka{" "}
              <InlineMath math="K = 12 \times 8 = 96\text{ cm}" />.
            </p>
          </div>
        </div>
      ),
    },
    { title: sections[4].title, icon: sections[4].icon, content: sections[4].content },
    { title: sections[5].title, icon: sections[5].icon, content: sections[5].content },
    { title: sections[6].title, icon: sections[6].icon, content: sections[6].content },
    {
      title: "Contoh Soal — Kerangka",
      icon: "🪡",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
            <p className="text-cyan-300 font-semibold text-sm font-display">🪡 Kerangka Kubus</p>
            <p className="text-white/70 text-xs font-body leading-relaxed">
              Kerangka kubus adalah rangka/tulang kubus yang terbentuk dari semua rusuknya.
              Kubus memiliki <strong className="text-white">12 rusuk</strong> yang sama panjang, sehingga:
            </p>
            <div className="bg-slate-900/60 rounded-lg p-3 text-center">
              <BlockMath math="K_{\text{kerangka}} = 12 \times s" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
              <div className="bg-blue-950/50 border border-blue-700/40 rounded p-2">
                <p className="text-blue-300 font-semibold">4 rusuk alas</p>
                <p className="text-white/60">bawah</p>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/40 rounded p-2">
                <p className="text-purple-300 font-semibold">4 rusuk tegak</p>
                <p className="text-white/60">samping</p>
              </div>
              <div className="bg-teal-950/50 border border-teal-700/40 rounded p-2">
                <p className="text-teal-300 font-semibold">4 rusuk atas</p>
                <p className="text-white/60">atas</p>
              </div>
            </div>
          </div>
          {kerangkaExamples.map((ex, i) => <ExampleCard key={`k${i}`} ex={ex} idx={i} prefix="KERANGKA"/>)}
        </div>
      ),
    },
    {
      title: "Contoh Soal — Luas Permukaan",
      icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix="LUAS"/>)}
        </div>
      ),
    },
    {
      title: "Contoh Soal — Volume",
      icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix="VOLUME"/>)}
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

        {/* Page Header */}
        <Layers className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          KUBUS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Bangun Ruang Sisi Datar</p>

        {/* Dot / pill indicators */}
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

        {/* Slide Card */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden mb-5">
          {/* Slide Header bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-slate-800/40">
            <span className="text-2xl">{slide.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[10px] font-body uppercase tracking-widest">
                Slide {currentSlide + 1} / {totalSlides}
              </p>
              <h2 className="font-display text-sm font-bold text-white">{slide.title}</h2>
            </div>
          </div>

          {/* Slide Content */}
          <div className="px-5 py-5">
            {slide.content}
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold font-body bg-slate-800/60 border border-slate-600 text-white/70 rounded-xl hover:bg-slate-700/60 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          <span className="text-white/30 text-xs font-body">{currentSlide + 1} / {totalSlides}</span>
          <button
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold font-body bg-primary/20 border border-primary/50 text-primary rounded-xl hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>

        <div className="text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default KubusPage;
