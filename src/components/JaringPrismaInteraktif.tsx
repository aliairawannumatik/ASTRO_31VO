import React, { useState, useEffect, useRef, useCallback } from "react";

type V2 = [number, number];
type V3 = [number, number, number];

/* ── 3-D math ── */
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
const project = (v: V3, fov = 500, scale = 1.6): V2 => {
  const tz = v[2] + fov;
  return [(v[0] * fov * scale) / tz, (v[1] * fov * scale) / tz];
};

/* ── Helpers ── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.5);
const smoothstep = (lo: number, hi: number, x: number) =>
  easeInOut(clamp01((x - lo) / (hi - lo)));

/* ── Build regular n-gon from base edge (in centred coords) ── */
function ngonFromEdge(
  n: number, a: number, ex: number, ey: number, upward: boolean
): V3[] {
  const inR = a / (2 * Math.tan(Math.PI / n));
  const R   = a / (2 * Math.sin(Math.PI / n));
  const cx  = ex + a / 2;
  const cyC = upward ? ey - inR : ey + inR;
  const ang0 = Math.atan2(ey - cyC, ex - cx);
  const step  = upward ? -2 * Math.PI / n : 2 * Math.PI / n;
  return Array.from({ length: n }, (_, k) => [
    cx  + R * Math.cos(ang0 + k * step),
    cyC + R * Math.sin(ang0 + k * step),
    0,
  ] as V3);
}

const RECT_COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f97316", "#ec4899"];
const R3D = 38, H3D = 70, SVG_CX = 200, SVG_CY = 160;

function makeConfig(n: number) {
  const a    = 2 * R3D * Math.sin(Math.PI / n);
  const inR  = a / (2 * Math.tan(Math.PI / n));
  const capH = inR + R3D;
  const netCY = 22 + capH + H3D / 2;
  const label = n === 3 ? "Segitiga" : n === 4 ? "Segiempat" : "Segilima";
  /* Dihedral angle between adjacent lateral faces of a regular n-gon prism = 2π/n */
  const dihedralRad = (2 * Math.PI) / n;
  return { a, h: H3D, netCY, label, dihedralRad };
}

/* ── Unfolding schedule for each face [start, end] in progress [0,1] ──
   Faces closest to the anchor (centre rect) unfold first; caps last. */
function schedule(k: number, midK: number, n: number): [number, number] {
  if (k >= n) return k === n ? [0.46, 0.78] : [0.58, 0.88]; // bottom / top cap
  const dist = Math.abs(k - midK);
  const s    = dist * 0.20;
  return [s, s + 0.45];
}

/* Current fold angle for face k.
   phi0 is the maximum (assembled) angle; returns phi0 at progress=0, 0 at progress=1. */
function localPhi(
  k: number, midK: number, n: number, phi0: number, p: number
): number {
  if (k === midK) return 0;
  const [s, e] = schedule(k, midK, n);
  return phi0 * (1 - easeOut(smoothstep(s, e, p)));
}

/* ─────────────────────────────────────────────────────────────
   True-3-D cascade hinge:
   ─ Every face is positioned in world-space 3-D.
   ─ The "right chain":  each rect extends from its left hinge point
     in direction  D = (cos(Σφ), 0, sin(Σφ)).
     Rotating D by φ around the vertical y-axis = changing Σφ.
   ─ The "left chain":  direction  D = (-cos(Σφ), 0, sin(Σφ)).
   ─ The caps rotate around a horizontal x-axis hinge.
   ─ At Σφ = n * (2π/n) the chain closes into the regular n-gon prism. ✓
───────────────────────────────────────────────────────────── */

export default function JaringPrismaInteraktif() {
  const [activeN,     setActiveN]     = useState(3);
  const [rotX,        setRotX]        = useState(-22);
  const [rotY,        setRotY]        = useState(32);
  const [progress,    setProgress]    = useState(0);   // 0 = assembled, 1 = flat net
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging,  setIsDragging]  = useState(false);

  const dragRef     = useRef({ sx: 0, sy: 0, bx: -22, by: 32 });
  const animRef     = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  /* ── Geometry constants ── */
  const cfg = makeConfig(activeN);
  const { a, netCY, dihedralRad } = cfg;

  /* Centred coords: origin = visual centre of the assembled prism / net */
  const cx0 = (Math.floor(activeN / 2) - activeN / 2) * a;       // anchor rect left x
  const cx1 = cx0 + a;                                            // anchor rect right x
  const cy0 = -H3D / 2;                                           // top  y (negative = up in 3-D)
  const cy1 =  H3D / 2;                                           // bottom y

  const midK = Math.floor(activeN / 2);

  /* Cap net vertices in centred coords (z = 0 = flat net plane) */
  const botNgon = ngonFromEdge(activeN, a, cx0, cy1, false);
  const topNgon = ngonFromEdge(activeN, a, cx0, cy0, true);
  /* Re-index so vertex midK+i is botNgon[i] */
  const botCapCentred: V3[] = new Array(activeN);
  const topCapCentred: V3[] = new Array(activeN);
  for (let i = 0; i < activeN; i++) {
    botCapCentred[(midK + i) % activeN] = botNgon[i];
    topCapCentred[(midK + i) % activeN] = topNgon[i];
  }

  /* ── Camera angles ──
     When assembled (progress=0): use live drag angles.
     During animation: gradually shift to a gentle top-down view that
     shows the net laid flat at the end.  */
  const tCam = easeInOut(Math.min(progress, 0.18) / 0.18);   // 0→1 in first 18 %
  const camRxDeg = lerp(rotX, -28, tCam);
  const camRyDeg = lerp(rotY,   0, tCam);
  const camRx = camRxDeg * Math.PI / 180;
  const camRy = camRyDeg * Math.PI / 180;

  /* Project a centred 3-D point to SVG screen coords */
  const proj = (v: V3): V2 => {
    const rv = rotXv(rotYv(v, camRy), camRx);
    const [px, py] = project(rv);
    return [SVG_CX + px, SVG_CY + py];
  };

  /* ── True-3-D cascade vertex computation ──
     Each rectangular face is described by two 3-D points:
       • hinge position  H = (hx, *, hz)          (one vertical edge)
       • extent direction D = (cos Φ, 0, sin Φ)   (Φ = cumulative fold angle)
     All faces share y-extents cy0..cy1.
     Cap faces rotate around the horizontal bottom / top edge of the anchor rect.
  */
  function getCascadeV3D(k: number): V3[] {
    /* ── Anchor (centre) rect — always flat at z = 0 ── */
    if (k === midK) {
      return [
        [cx0, cy1, 0],
        [cx1, cy1, 0],
        [cx1, cy0, 0],
        [cx0, cy0, 0],
      ];
    }

    if (k < activeN) {
      /* ── Right chain: k = midK+1, midK+2, … ── */
      if (k > midK) {
        let hx = cx1, hz = 0, cumPhi = 0;
        for (let j = 1; j <= k - midK; j++) {
          const phi = localPhi(midK + j, midK, activeN, dihedralRad, progress);
          cumPhi += phi;
          const nx = hx + a * Math.cos(cumPhi);
          const nz = hz + a * Math.sin(cumPhi);
          if (midK + j === k) {
            return [
              [hx, cy1, hz], [nx, cy1, nz],
              [nx, cy0, nz], [hx, cy0, hz],
            ];
          }
          hx = nx; hz = nz;
        }
      }

      /* ── Left chain: k = midK-1, midK-2, … ── */
      let hx = cx0, hz = 0, cumPhi = 0;
      for (let j = 1; j <= midK - k; j++) {
        const phi = localPhi(midK - j, midK, activeN, dihedralRad, progress);
        cumPhi += phi;
        const nx = hx - a * Math.cos(cumPhi);
        const nz = hz + a * Math.sin(cumPhi);
        if (midK - j === k) {
          return [
            [nx, cy1, nz], [hx, cy1, hz],
            [hx, cy0, hz], [nx, cy0, nz],
          ];
        }
        hx = nx; hz = nz;
      }
    }

    /* ── Cap faces ──
       Rotate around the horizontal bottom / top edge of the anchor rect.
       Hinge axis = X direction.  Positive φ folds the cap inward (into +z). */
    const isBot  = k === activeN;
    const capNet = isBot ? botCapCentred : topCapCentred;
    const hy     = isBot ? cy1 : cy0;   // hinge y
    const phi    = localPhi(k, midK, activeN, Math.PI / 2, progress);

    return capNet.map(([vx, vy, _]) => {
      const dy = vy - hy;              // signed offset from hinge
      const sign = isBot ? 1 : -1;    // bottom folds into +z, top also into +z
      return [
        vx,
        hy + dy * Math.cos(phi),
        sign * dy * Math.sin(phi),
      ] as V3;
    });
  }

  /* ── Build and sort all faces by depth ── */
  const allFaces = Array.from({ length: activeN + 2 }, (_, k) => ({
    k,
    fill:  k < activeN ? RECT_COLORS[k % RECT_COLORS.length]
                       : k === activeN ? "#ef4444" : "#eab308",
    label: k < activeN ? `Sisi ${k + 1}` : k === activeN ? "Alas" : "Tutup",
  }));

  const renderedFaces = allFaces
    .map(f => {
      const v3d  = getCascadeV3D(f.k);
      const poly = v3d.map(proj);
      /* Depth = average z after camera rotation (for painter's sort) */
      const avgZ = v3d.reduce(
        (s, v) => s + rotXv(rotYv(v, camRy), camRx)[2], 0
      ) / v3d.length;
      return { ...f, poly, avgZ };
    })
    .sort((a, b) => b.avgZ - a.avgZ); // back to front

  /* ── Animate to target progress ── */
  const animateTo = (target: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startP = progressRef.current;
    const startT = performance.now();
    const dur    = 1700;
    setIsAnimating(true);

    const tick = (now: number) => {
      const raw   = Math.min((now - startT) / dur, 1);
      const eased = easeInOut(raw);
      const newP  = startP + (target - startP) * eased;
      setProgress(newP);
      progressRef.current = newP;
      if (raw < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(target);
        progressRef.current = target;
        setIsAnimating(false);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  /* ── Drag (3-D rotation) — only when assembled ── */
  const onMouseDown = (e: React.MouseEvent) => {
    if (progress > 0.05 || isAnimating) return;
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
    if (progress > 0.05 || isAnimating) return;
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
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  /* Reset on prism-type change */
  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setProgress(0); progressRef.current = 0;
    setRotX(-22); setRotY(32);
    setIsAnimating(false);
  }, [activeN]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const isAssembled = progress < 0.05;
  const isFlatNet   = progress > 0.95;

  /* Subtle dashed hinge lines — visible mid-animation */
  const hingeAlpha = Math.min(1, progress * 8, (1 - progress) * 8) * 0.28;

  /* Hinge line SVG coords: project the anchor rect edges */
  const topLeft  = proj([cx0, cy0, 0]);
  const topRight = proj([cx1, cy0, 0]);
  const botLeft  = proj([cx0, cy1, 0]);
  const botRight = proj([cx1, cy1, 0]);

  /* Vertical hinge lines between rects (project midpoints in net plane) */
  const vertHinges: Array<[V2, V2]> = Array.from(
    { length: activeN - 1 },
    (_, i) => {
      const hx = cx0 - (Math.floor(activeN / 2) - (i + 1)) * a; /* absolute x of hinge */
      return [proj([hx, cy0, 0]), proj([hx, cy1, 0])];
    }
  );

  return (
    <div className="space-y-3">

      {/* Prism type selector */}
      <div className="flex gap-2 justify-center">
        {[3, 4, 5].map(n => {
          const c = makeConfig(n);
          return (
            <button key={n}
              onClick={() => setActiveN(n)}
              disabled={isAnimating}
              className="text-xs font-bold py-1.5 px-3 rounded-lg border transition-all duration-200 font-body"
              style={{
                borderColor: "#6366f1",
                color: activeN === n ? "#0f172a" : "#818cf8",
                backgroundColor: activeN === n ? "#6366f1" : "transparent",
                opacity: isAnimating ? 0.45 : activeN === n ? 1 : 0.65,
              }}>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* SVG canvas */}
      <div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden select-none"
        style={{ cursor: isAssembled && !isAnimating ? (isDragging ? "grabbing" : "grab") : "default" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <svg viewBox="0 0 400 340" className="w-full" style={{ maxHeight: 360 }}>

          {/* Faces — back to front */}
          {renderedFaces.map((f, fi) => {
            const pts = f.poly.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
            const mx  = f.poly.reduce((s, p) => s + p[0], 0) / f.poly.length;
            const my  = f.poly.reduce((s, p) => s + p[1], 0) / f.poly.length;
            const lAlpha = Math.max(0, (progress - 0.78) / 0.22);
            return (
              <g key={fi}>
                <polygon
                  points={pts}
                  fill={f.fill} fillOpacity={0.88}
                  stroke="rgba(255,255,255,0.82)" strokeWidth={1.4}
                  strokeLinejoin="round"
                />
                {isFlatNet && (
                  <text
                    x={mx.toFixed(1)} y={my.toFixed(1)}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize="7.5" fontFamily="monospace" fontWeight="bold"
                    style={{ pointerEvents: "none", opacity: lAlpha }}
                  >
                    {f.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Hinge indicator lines (dashed) */}
          {hingeAlpha > 0.01 && (
            <g opacity={hingeAlpha} strokeDasharray="4,3" stroke="white" strokeWidth={1.2}>
              {/* Vertical hinges between rect faces */}
              {vertHinges.map(([p0, p1], i) => (
                <line key={`vh${i}`}
                  x1={p0[0].toFixed(1)} y1={p0[1].toFixed(1)}
                  x2={p1[0].toFixed(1)} y2={p1[1].toFixed(1)}
                />
              ))}
              {/* Horizontal hinge — bottom cap */}
              <line
                x1={botLeft[0].toFixed(1)} y1={botLeft[1].toFixed(1)}
                x2={botRight[0].toFixed(1)} y2={botRight[1].toFixed(1)}
              />
              {/* Horizontal hinge — top cap */}
              <line
                x1={topLeft[0].toFixed(1)} y1={topLeft[1].toFixed(1)}
                x2={topRight[0].toFixed(1)} y2={topRight[1].toFixed(1)}
              />
            </g>
          )}

          {/* Status text */}
          {isAssembled && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#64748b" fontFamily="monospace">
              Drag untuk memutar · tekan Bongkar untuk melihat jaring-jaring
            </text>
          )}
          {isFlatNet && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#facc15" fontFamily="monospace">
              Jaring-jaring Prisma {cfg.label.toLowerCase()} — {activeN + 2} bidang
            </text>
          )}
          {!isAssembled && !isFlatNet && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#a78bfa" fontFamily="monospace">
              {progress < 0.5 ? "Membongkar…" : "Menyatukan…"}
            </text>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => animateTo(1)}
          disabled={isFlatNet || isAnimating}
          className="text-xs font-bold py-1.5 px-4 rounded-lg border transition-all duration-200 font-body"
          style={{
            borderColor: "#f97316", color: "#f97316", backgroundColor: "transparent",
            opacity: (isFlatNet || isAnimating) ? 0.35 : 1,
          }}>
          📤 Bongkar
        </button>
        <button
          onClick={() => { setRotX(-22); setRotY(32); }}
          disabled={!isAssembled || isAnimating}
          className="text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-600 text-slate-400 transition-all duration-200 font-body"
          style={{ opacity: (!isAssembled || isAnimating) ? 0.35 : 1 }}>
          ↺ Reset Rotasi
        </button>
        <button
          onClick={() => animateTo(0)}
          disabled={isAssembled || isAnimating}
          className="text-xs font-bold py-1.5 px-4 rounded-lg border transition-all duration-200 font-body"
          style={{
            borderColor: "#22d3ee", color: "#22d3ee", backgroundColor: "transparent",
            opacity: (isAssembled || isAnimating) ? 0.35 : 1,
          }}>
          📥 Satukan
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[
          { c: "#ef4444", l: "Alas" },
          { c: "#eab308", l: "Tutup" },
          ...RECT_COLORS.slice(0, activeN).map((c, i) => ({ c, l: `Sisi ${i + 1}` })),
        ].map(x => (
          <div key={x.l} className="flex items-center gap-1 text-xs font-body">
            <div className="w-3 h-3 rounded-sm opacity-85" style={{ backgroundColor: x.c }} />
            <span style={{ color: x.c }}>{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
