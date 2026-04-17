import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, RotateCcw, Layers } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

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
    <text x="98" y="46" fill="#22d3ee" fontSize="10" fontFamily="monospace">s</text>
    <text x="234" y="175" fill="#ffffff" fontSize="10" fontFamily="monospace">12 rusuk</text>
    <text x="234" y="188" fill="#22d3ee" fontSize="10" fontFamily="monospace">semua = s</text>
  </svg>
);

const SisiAnimSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Sisi kubus beranimasi">
    <defs>
      <style>{`
        @keyframes sisiGlow{0%,100%{fill-opacity:0.7;}50%{fill-opacity:0.1;}}
        .sisi-a{animation:sisiGlow 1.6s ease-in-out infinite;}
        .sisi-b{animation:sisiGlow 1.6s ease-in-out infinite 0.3s;}
        .sisi-c{animation:sisiGlow 1.6s ease-in-out infinite 0.6s;}
      `}</style>
    </defs>
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
    <text x="90" y="115" fill="#fff" fontSize="10" fontFamily="monospace" fontWeight="bold">DEPAN</text>
    <text x="230" y="175" fill="#fff" fontSize="10" fontFamily="monospace">6 sisi</text>
    <text x="230" y="188" fill="#facc15" fontSize="10" fontFamily="monospace">= s²</text>
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
    <text x="22" y="58" fill="#facc15" fontSize="10" fontFamily="monospace">A</text>
    <text x="164" y="58" fill="#facc15" fontSize="10" fontFamily="monospace">B</text>
    <text x="164" y="172" fill="#facc15" fontSize="10" fontFamily="monospace">C</text>
    <text x="22" y="172" fill="#facc15" fontSize="10" fontFamily="monospace">D</text>
    <text x="64" y="26" fill="#facc15" fontSize="10" fontFamily="monospace">E</text>
    <text x="202" y="26" fill="#facc15" fontSize="10" fontFamily="monospace">F</text>
    <text x="202" y="142" fill="#facc15" fontSize="10" fontFamily="monospace">G</text>
    <text x="64" y="142" fill="#facc15" fontSize="10" fontFamily="monospace">H</text>
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
    { x1:40,  y1:160, x2:160, y2:60,  color:"#ef4444", key:"AC", face:"Depan" },
    { x1:160, y1:160, x2:40,  y2:60,  color:"#f97316", key:"BD", face:"Depan" },
    { x1:80,  y1:130, x2:200, y2:30,  color:"#eab308", key:"EG", face:"Belakang" },
    { x1:200, y1:130, x2:80,  y2:30,  color:"#84cc16", key:"FH", face:"Belakang" },
    { x1:40,  y1:160, x2:80,  y2:30,  color:"#22c55e", key:"AH", face:"Kiri" },
    { x1:40,  y1:60,  x2:80,  y2:130, color:"#14b8a6", key:"DE", face:"Kiri" },
    { x1:160, y1:160, x2:200, y2:30,  color:"#06b6d4", key:"BG", face:"Kanan" },
    { x1:160, y1:60,  x2:200, y2:130, color:"#3b82f6", key:"CF", face:"Kanan" },
    { x1:40,  y1:60,  x2:200, y2:30,  color:"#6366f1", key:"DG", face:"Atas" },
    { x1:160, y1:60,  x2:80,  y2:30,  color:"#8b5cf6", key:"CH", face:"Atas" },
    { x1:40,  y1:160, x2:200, y2:130, color:"#d946ef", key:"AF", face:"Bawah" },
    { x1:160, y1:160, x2:80,  y2:130, color:"#f43f5e", key:"BE", face:"Bawah" },
  ];
  const verts: [number,number,string,number,number][] = [
    [40,60,"D",-10,-5],[160,60,"C",5,-5],[160,160,"B",5,10],[40,160,"A",-10,10],
    [80,30,"H",-2,-7],[200,30,"G",5,-5],[200,130,"F",6,4],[80,130,"E",-13,4],
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
                style={{ filter: `drop-shadow(0 0 7px ${d.color})` }}
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
  const diags = [
    { x1:40,  y1:160, x2:200, y2:30,  color:"#f44336", key:"AG", desc:"A → G" },
    { x1:160, y1:160, x2:80,  y2:30,  color:"#4caf50", key:"BH", desc:"B → H" },
    { x1:160, y1:60,  x2:80,  y2:130, color:"#2196f3", key:"CE", desc:"C → E" },
    { x1:40,  y1:60,  x2:200, y2:130, color:"#ffeb3b", key:"DF", desc:"D → F" },
  ];
  const verts: [number,number,string,number,number][] = [
    [40,60,"D",-10,-5],[160,60,"C",5,-5],[160,160,"B",5,10],[40,160,"A",-10,10],
    [80,30,"H",-2,-7],[200,30,"G",5,-5],[200,130,"F",6,4],[80,130,"E",-13,4],
  ];
  return (
    <svg viewBox="0 0 280 218" className="w-full max-w-xs mx-auto my-2" aria-label="4 diagonal ruang kubus">
      <defs>
        <style>{`@keyframes drPls{0%,100%{opacity:1}50%{opacity:0.35}}` +
          diags.map((_,i)=>`.dr${i}{animation:drPls 2s ease-in-out infinite;animation-delay:${(i*0.4).toFixed(1)}s}`).join("")
        }</style>
      </defs>
      <polygon points="40,60 160,60 160,160 40,160" fill="rgba(20,30,50,0.75)" stroke="#334155" strokeWidth="1.5"/>
      <polygon points="80,30 200,30 200,130 80,130" fill="rgba(20,30,50,0.4)"  stroke="#334155" strokeWidth="1.5"/>
      <line x1="40"  y1="60"  x2="80"  y2="30"  stroke="#334155" strokeWidth="1.5"/>
      <line x1="160" y1="60"  x2="200" y2="30"  stroke="#334155" strokeWidth="1.5"/>
      <line x1="40"  y1="160" x2="80"  y2="130" stroke="#334155" strokeWidth="1.5"/>
      <line x1="160" y1="160" x2="200" y2="130" stroke="#334155" strokeWidth="1.5"/>
      {diags.map((d,i)=>(
        <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
          stroke={d.color} strokeWidth="2.5"
          className={`dr${i}`} style={{filter:`drop-shadow(0 0 5px ${d.color})`}}/>
      ))}
      {verts.map(([x,y,lbl,dx,dy],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="#94a3b8"/>
          <text x={x+dx} y={y+dy} fill="#e2e8f0" fontSize="9" fontFamily="monospace" fontWeight="bold">{lbl}</text>
        </g>
      ))}
      <text x="10" y="178" fill="#94a3b8" fontSize="9" fontFamily="monospace">Keterangan (4 diagonal ruang):</text>
      {diags.map((d,i)=>{
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 14 + col * 136;
        const y = 191 + row * 19;
        return (
          <g key={i}>
            <line x1={x} y1={y+3} x2={x+18} y2={y+3} stroke={d.color} strokeWidth="2.5"/>
            <circle cx={x} cy={y+3} r="3" fill={d.color}/>
            <circle cx={x+18} cy={y+3} r="3" fill={d.color}/>
            <text x={x+24} y={y+7} fill={d.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
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
    <text x="95" y="105" fill="#a78bfa" fontSize="11" fontFamily="monospace" fontWeight="bold">BD</text>
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
    title: "Bidang CBEH",
    points: "160,60 160,160 80,130 80,30",
    color: "#22d3ee",
    label: "CBEH",
    note: "sejajar dengan bidang DAFG",
  },
  {
    title: "Bidang CDEF",
    points: "160,60 40,60 80,130 200,130",
    color: "#34d399",
    label: "CDEF",
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
    title: "Bidang DHFB",
    points: "40,60 80,30 200,130 160,160",
    color: "#fb7185",
    label: "DHFB",
    note: "melalui rusuk DH dan BF",
  },
  {
    title: "Bidang CGEA",
    points: "160,60 200,30 80,130 40,160",
    color: "#a78bfa",
    label: "CGEA",
    note: "melalui rusuk CG dan AE",
  },
];

const BidangDiagonalVariantCube = ({ variant }: { variant: BidangDiagonalVariant }) => (
  <div className="rounded-lg border border-slate-700/70 bg-slate-900/55 p-3 space-y-2">
    <svg viewBox="0 0 240 190" className="w-full mx-auto" aria-label={variant.title}>
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
        fillOpacity="0.48"
        stroke={variant.color}
        strokeWidth="2.4"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 7px ${variant.color})` }}
      />
      {[
        [40,55,"D",-12,-5],[150,55,"C",5,-5],[150,145,"B",5,12],[40,145,"A",-12,12],
        [75,28,"H",-3,-8],[185,28,"G",5,-5],[185,118,"F",6,4],[75,118,"E",-14,5],
      ].map(([x,y,lbl,dx,dy]) => (
        <g key={lbl}>
          <circle cx={x as number} cy={y as number} r="3" fill="#e2e8f0"/>
          <text x={(x as number) + (dx as number)} y={(y as number) + (dy as number)} fill="#f8fafc" fontSize="9" fontFamily="monospace" fontWeight="bold">{lbl}</text>
        </g>
      ))}
      <text x="112" y="90" fill={variant.color} fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {variant.label}
      </text>
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
        Contoh lain bidang diagonal pada kubus. Setiap warna menunjukkan satu bidang diagonal yang berbeda.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {bidangDiagonalVariants.map((variant) => (
        <BidangDiagonalVariantCube key={variant.title} variant={variant} />
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
    <text x="157" y="50" fill="#000" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ATAS</text>
    {/* Left */}
    <rect x="50" y="82" width="70" height="70" fill="#22c55e" className="lp2" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="85" y="122" fill="#000" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">KIRI</text>
    {/* Front */}
    <rect x="122" y="82" width="70" height="70" fill="#3b82f6" className="lp3" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="157" y="122" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DEPAN</text>
    {/* Right */}
    <rect x="194" y="82" width="70" height="70" fill="#f97316" className="lp4" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="229" y="122" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">KANAN</text>
    {/* Back */}
    <rect x="266" y="82" width="70" height="70" fill="#8b5cf6" className="lp5" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="301" y="122" fill="#fff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BELAK.</text>
    {/* Bottom */}
    <rect x="122" y="154" width="70" height="70" fill="#ef4444" className="lp6" rx="3" stroke="white" strokeWidth="1.5"/>
    <text x="157" y="194" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BAWAH</text>
    {/* Formula */}
    <text x="170" y="215" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = 6 × s²</text>
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

      {/* ALAS / TUTUP labels */}
      <text x={(FL[0] + FR[0]) / 2} y={FL[1] + 24}
        fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ALAS (s²)</text>
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
          <p className="text-white/45 text-[10px] font-body text-center">
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
                ["Diagonal bidang","d_b = s√2","Pythagoras 2D"],
                ["Diagonal ruang","d_r = s√3","Pythagoras 3D"],
                ["Luas bidang diagonal","L_BD = s²√2","persegi panjang"],
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
            <p className="text-xs text-white/70">Rusuk adalah <strong>ruas garis yang merupakan pertemuan dua sisi</strong> kubus. Semua rusuk kubus sama panjang (<InlineMath math="= s" />).</p>
            <RusukAnimSVG />
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
            <p className="text-xs text-white/70">Sisi adalah <strong>bidang yang membatasi</strong> kubus. Setiap sisi berbentuk persegi dengan luas <InlineMath math="s^2" />. Ada 6 sisi: depan, belakang, kiri, kanan, atas, bawah.</p>
            <SisiAnimSVG />
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
            <p className="text-xs text-white/70">Titik sudut adalah <strong>titik pertemuan tiga rusuk</strong>. Diberi nama dengan huruf kapital (A, B, C, D, E, F, G, H).</p>
            <TitikSudutAnimSVG />
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
            <p className="text-xs text-white/70">Diagonal ruang adalah <strong>ruas garis yang menghubungkan dua titik sudut yang berhadapan dan melewati bagian dalam kubus</strong>.</p>
            <AllDiagonalRuangSVG />
            <div className="bg-red-950/60 rounded p-2 text-center">
              <BlockMath math="d_r = s\sqrt{3}" />
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
            <BidangDiagonalSVG />
            <BidangDiagonalVariasiGallery />
            <div className="bg-violet-950/60 rounded p-2 text-center">
              <BlockMath math="L_{\text{bidang diag}} = s \times s\sqrt{2} = s^2\sqrt{2}" />
            </div>
          </div>
        </div>
      ),
    },
    { title: sections[2].title, icon: sections[2].icon, content: sections[2].content },
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
    { title: sections[4].title, icon: sections[4].icon, content: sections[4].content },
    { title: sections[5].title, icon: sections[5].icon, content: sections[5].content },
    { title: sections[6].title, icon: sections[6].icon, content: sections[6].content },
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
