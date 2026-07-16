import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const dihedralRad = (2 * Math.PI) / n;
  return { a, h: H3D, netCY, dihedralRad };
}

function schedule(k: number, midK: number, n: number): [number, number] {
  if (k >= n) return k === n ? [0.46, 0.78] : [0.58, 0.88];
  const dist = Math.abs(k - midK);
  const s    = dist * 0.20;
  return [s, s + 0.45];
}

function localPhi(
  k: number, midK: number, n: number, phi0: number, p: number
): number {
  if (k === midK) return 0;
  const [s, e] = schedule(k, midK, n);
  return phi0 * (1 - easeOut(smoothstep(s, e, p)));
}

export default function JaringPrismaInteraktif() {
  const { language: lang } = useLanguage();
  const [activeN,     setActiveN]     = useState(3);
  const [rotX,        setRotX]        = useState(-22);
  const [rotY,        setRotY]        = useState(32);
  const [progress,    setProgress]    = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging,  setIsDragging]  = useState(false);

  const dragRef     = useRef({ sx: 0, sy: 0, bx: -22, by: 32 });
  const animRef     = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  /* ── Translation helpers ── */
  const typeLabel = (n: number) =>
    n === 3
      ? (lang === "en" ? "Triangle" : lang === "ja" ? "三角形" : "Segitiga")
      : n === 4
      ? (lang === "en" ? "Quadrilateral" : lang === "ja" ? "四角形" : "Segiempat")
      : (lang === "en" ? "Pentagon" : lang === "ja" ? "五角形" : "Segilima");

  const faceLabel = (k: number, n: number) =>
    k < n
      ? (lang === "en" ? `Face ${k + 1}` : lang === "ja" ? `面 ${k + 1}` : `Sisi ${k + 1}`)
      : k === n
      ? (lang === "en" ? "Base" : lang === "ja" ? "底面" : "Alas")
      : (lang === "en" ? "Lid" : lang === "ja" ? "上面" : "Tutup");

  const tr = {
    disassemble:  lang === "en" ? "📤 Unfold"        : lang === "ja" ? "📤 展開"     : "📤 Bongkar",
    assemble:     lang === "en" ? "📥 Fold"           : lang === "ja" ? "📥 組み立て" : "📥 Satukan",
    resetRot:     lang === "en" ? "↺ Reset Rotation" : lang === "ja" ? "↺ 回転リセット" : "↺ Reset Rotasi",
    dragHint:     lang === "en"
      ? "Drag to rotate · press Unfold to see the net"
      : lang === "ja" ? "ドラッグで回転 · 展開ボタンで展開図表示"
      : "Drag untuk memutar · tekan Bongkar untuk melihat jaring-jaring",
    unfolding:    lang === "en" ? "Unfolding…"   : lang === "ja" ? "展開中…"     : "Membongkar…",
    folding:      lang === "en" ? "Folding…"     : lang === "ja" ? "組み立て中…" : "Menyatukan…",
    netLabel: (lbl: string, sides: number) =>
      lang === "en"
        ? `Prism net (${lbl.toLowerCase()}) — ${sides} faces`
        : lang === "ja"
        ? `${lbl}柱の展開図 — ${sides}面`
        : `Jaring-jaring Prisma ${lbl.toLowerCase()} — ${sides} bidang`,
    legendBase: lang === "en" ? "Base" : lang === "ja" ? "底面" : "Alas",
    legendLid:  lang === "en" ? "Lid"  : lang === "ja" ? "上面" : "Tutup",
    legendFace: (i: number) =>
      lang === "en" ? `Face ${i + 1}` : lang === "ja" ? `面 ${i + 1}` : `Sisi ${i + 1}`,
  };

  /* ── Geometry constants ── */
  const cfg = makeConfig(activeN);
  const { a, netCY: _netCY, dihedralRad } = cfg;

  const cx0 = (Math.floor(activeN / 2) - activeN / 2) * a;
  const cx1 = cx0 + a;
  const cy0 = -H3D / 2;
  const cy1 =  H3D / 2;
  const midK = Math.floor(activeN / 2);

  const botNgon = ngonFromEdge(activeN, a, cx0, cy1, false);
  const topNgon = ngonFromEdge(activeN, a, cx0, cy0, true);
  const botCapCentred: V3[] = new Array(activeN);
  const topCapCentred: V3[] = new Array(activeN);
  for (let i = 0; i < activeN; i++) {
    botCapCentred[(midK + i) % activeN] = botNgon[i];
    topCapCentred[(midK + i) % activeN] = topNgon[i];
  }

  const tCam = easeInOut(Math.min(progress, 0.18) / 0.18);
  const camRxDeg = lerp(rotX, -28, tCam);
  const camRyDeg = lerp(rotY,   0, tCam);
  const camRx = camRxDeg * Math.PI / 180;
  const camRy = camRyDeg * Math.PI / 180;

  const proj = (v: V3): V2 => {
    const rv = rotXv(rotYv(v, camRy), camRx);
    const [px, py] = project(rv);
    return [SVG_CX + px, SVG_CY + py];
  };

  function getCascadeV3D(k: number): V3[] {
    if (k === midK) {
      return [
        [cx0, cy1, 0], [cx1, cy1, 0],
        [cx1, cy0, 0], [cx0, cy0, 0],
      ];
    }
    if (k < activeN) {
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
    const isBot  = k === activeN;
    const capNet = isBot ? botCapCentred : topCapCentred;
    const hy     = isBot ? cy1 : cy0;
    const phi    = localPhi(k, midK, activeN, Math.PI / 2, progress);
    return capNet.map(([vx, vy, _]) => {
      const dy   = vy - hy;
      const sign = isBot ? 1 : -1;
      return [vx, hy + dy * Math.cos(phi), sign * dy * Math.sin(phi)] as V3;
    });
  }

  const allFaces = Array.from({ length: activeN + 2 }, (_, k) => ({
    k,
    fill:  k < activeN ? RECT_COLORS[k % RECT_COLORS.length]
                       : k === activeN ? "#ef4444" : "#eab308",
    label: faceLabel(k, activeN),
  }));

  const renderedFaces = allFaces
    .map(f => {
      const v3d  = getCascadeV3D(f.k);
      const poly = v3d.map(proj);
      const avgZ = v3d.reduce(
        (s, v) => s + rotXv(rotYv(v, camRy), camRx)[2], 0
      ) / v3d.length;
      return { ...f, poly, avgZ };
    })
    .sort((a, b) => b.avgZ - a.avgZ);

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

  const onMouseDown = (e: React.MouseEvent) => {
    if (progress > 0.05 || isAnimating) return;
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.by - (e.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.bx + (e.clientY - dragRef.current.sy) * 0.55);
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
    setRotY(dragRef.current.by - (t.clientX - dragRef.current.sx) * 0.55);
    setRotX(dragRef.current.bx + (t.clientY - dragRef.current.sy) * 0.55);
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

  const hingeAlpha = Math.min(1, progress * 8, (1 - progress) * 8) * 0.28;

  const topLeft  = proj([cx0, cy0, 0]);
  const topRight = proj([cx1, cy0, 0]);
  const botLeft  = proj([cx0, cy1, 0]);
  const botRight = proj([cx1, cy1, 0]);

  const vertHinges: Array<[V2, V2]> = Array.from(
    { length: activeN - 1 },
    (_, i) => {
      const hx = cx0 - (Math.floor(activeN / 2) - (i + 1)) * a;
      return [proj([hx, cy0, 0]), proj([hx, cy1, 0])];
    }
  );

  const tLabel = typeLabel(activeN);

  return (
    <div className="space-y-3">
      {/* Prism type selector */}
      <div className="flex gap-2 justify-center">
        {[3, 4, 5].map(n => (
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
            {typeLabel(n)}
          </button>
        ))}
      </div>

      {/* SVG canvas */}
      <div
        className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden select-none"
        style={{ cursor: isAssembled && !isAnimating ? (isDragging ? "grabbing" : "grab") : "default" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <svg viewBox="0 0 400 340" className="w-full" style={{ maxHeight: 360 }}>
          {renderedFaces.map((f, fi) => {
            const pts = f.poly.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
            const mx  = f.poly.reduce((s, p) => s + p[0], 0) / f.poly.length;
            const my  = f.poly.reduce((s, p) => s + p[1], 0) / f.poly.length;
            const lAlpha = Math.max(0, (progress - 0.78) / 0.22);
            return (
              <g key={fi}>
                <polygon points={pts}
                  fill={f.fill} fillOpacity={0.88}
                  stroke="rgba(255,255,255,0.82)" strokeWidth={1.4}
                  strokeLinejoin="round" />
                {isFlatNet && (
                  <text x={mx.toFixed(1)} y={my.toFixed(1)}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="var(--icon-color)" fontSize="7.5" fontFamily="monospace" fontWeight="bold"
                    style={{ pointerEvents: "none", opacity: lAlpha }}>
                    {f.label}
                  </text>
                )}
              </g>
            );
          })}

          {hingeAlpha > 0.01 && (
            <g opacity={hingeAlpha} strokeDasharray="4,3" stroke="var(--icon-stroke)" strokeWidth={1.2}>
              {vertHinges.map(([p0, p1], i) => (
                <line key={`vh${i}`}
                  x1={p0[0].toFixed(1)} y1={p0[1].toFixed(1)}
                  x2={p1[0].toFixed(1)} y2={p1[1].toFixed(1)} />
              ))}
              <line x1={botLeft[0].toFixed(1)} y1={botLeft[1].toFixed(1)}
                    x2={botRight[0].toFixed(1)} y2={botRight[1].toFixed(1)} />
              <line x1={topLeft[0].toFixed(1)} y1={topLeft[1].toFixed(1)}
                    x2={topRight[0].toFixed(1)} y2={topRight[1].toFixed(1)} />
            </g>
          )}

          {isAssembled && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#64748b" fontFamily="monospace">
              {tr.dragHint}
            </text>
          )}
          {isFlatNet && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#facc15" fontFamily="monospace">
              {tr.netLabel(tLabel, activeN + 2)}
            </text>
          )}
          {!isAssembled && !isFlatNet && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#a78bfa" fontFamily="monospace">
              {progress < 0.5 ? tr.unfolding : tr.folding}
            </text>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button onClick={() => animateTo(1)}
          disabled={isFlatNet || isAnimating}
          className="text-xs font-bold py-1.5 px-4 rounded-lg border transition-all duration-200 font-body"
          style={{
            borderColor: "#f97316", color: "#f97316", backgroundColor: "transparent",
            opacity: (isFlatNet || isAnimating) ? 0.35 : 1,
          }}>
          {tr.disassemble}
        </button>
        <button onClick={() => { setRotX(-22); setRotY(32); }}
          disabled={!isAssembled || isAnimating}
          className="text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-600 text-slate-400 transition-all duration-200 font-body"
          style={{ opacity: (!isAssembled || isAnimating) ? 0.35 : 1 }}>
          {tr.resetRot}
        </button>
        <button onClick={() => animateTo(0)}
          disabled={isAssembled || isAnimating}
          className="text-xs font-bold py-1.5 px-4 rounded-lg border transition-all duration-200 font-body"
          style={{
            borderColor: "#22d3ee", color: "#22d3ee", backgroundColor: "transparent",
            opacity: (isAssembled || isAnimating) ? 0.35 : 1,
          }}>
          {tr.assemble}
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[
          { c: "#ef4444", l: tr.legendBase },
          { c: "#eab308", l: tr.legendLid },
          ...RECT_COLORS.slice(0, activeN).map((c, i) => ({ c, l: tr.legendFace(i) })),
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
