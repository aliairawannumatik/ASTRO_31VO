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
const project = (v: V3, fov = 500, scale = 1.5): V2 => {
  const tz = v[2] + fov;
  return [(v[0] * fov * scale) / tz, (v[1] * fov * scale) / tz];
};

/* ── Helpers ── */
const lerp      = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01   = (x: number) => Math.max(0, Math.min(1, x));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut   = (t: number) => 1 - Math.pow(1 - t, 2.5);
const smoothstep = (lo: number, hi: number, x: number) =>
  easeInOut(clamp01((x - lo) / (hi - lo)));

/* ── Rodrigues' rotation around an arbitrary unit axis ── */
function rotAroundAxis(v: V3, axis: V3, angle: number): V3 {
  const [ax, ay, az] = axis;
  const [vx, vy, vz] = v;
  const c = Math.cos(angle), s = Math.sin(angle);
  const dot = vx * ax + vy * ay + vz * az;
  const cx = ay * vz - az * vy;
  const cy = az * vx - ax * vz;
  const cz = ax * vy - ay * vx;
  return [
    vx * c + cx * s + ax * dot * (1 - c),
    vy * c + cy * s + ay * dot * (1 - c),
    vz * c + cz * s + az * dot * (1 - c),
  ];
}

/* ── Constants ── */
const R3D    = 42;
const H_PYR  = 72;
const SVG_CX = 200;
const SVG_CY = 168;

const TRI_COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f97316", "#ec4899"];
const BASE_COLOR  = "#ef4444";

function makeConfig(n: number) {
  const a      = 2 * R3D * Math.sin(Math.PI / n);
  const inR    = R3D * Math.cos(Math.PI / n);
  const slantH = Math.sqrt(H_PYR * H_PYR + inR * inR);
  const foldAngle = Math.PI - Math.atan2(H_PYR, inR);
  return { a, inR, slantH, foldAngle };
}

function getSchedule(k: number, n: number): [number, number] {
  const delay = (k / n) * 0.32;
  return [delay, delay + 0.55];
}

/* ── Main component ── */
export default function JaringLimasInteraktif() {
  const { language: lang } = useLanguage();
  const [activeN,     setActiveN]     = useState(4);
  const [rotX,        setRotX]        = useState(-20);
  const [rotY,        setRotY]        = useState(0);
  const [progress,    setProgress]    = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging,  setIsDragging]  = useState(false);

  const dragRef     = useRef({ sx: 0, sy: 0, bx: -20, by: 0 });
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

  const faceLabel = (k: number) =>
    k === activeN
      ? (lang === "en" ? "Base" : lang === "ja" ? "底面" : "Alas")
      : (lang === "en" ? `Face ${k + 1}` : lang === "ja" ? `面 ${k + 1}` : `Sisi ${k + 1}`);

  const tr = {
    disassemble: lang === "en" ? "📤 Unfold"         : lang === "ja" ? "📤 展開"      : "📤 Bongkar",
    assemble:    lang === "en" ? "📥 Fold"            : lang === "ja" ? "📥 組み立て"  : "📥 Satukan",
    resetRot:    lang === "en" ? "↺ Reset Rotation"  : lang === "ja" ? "↺ 回転リセット" : "↺ Reset Rotasi",
    dragHint:    lang === "en"
      ? "Drag to rotate · press Unfold to see the net"
      : lang === "ja" ? "ドラッグで回転 · 展開ボタンで展開図表示"
      : "Drag untuk memutar · tekan Bongkar untuk melihat jaring-jaring",
    unfolding:   lang === "en" ? "Unfolding…"   : lang === "ja" ? "展開中…"      : "Membongkar…",
    folding:     lang === "en" ? "Folding…"     : lang === "ja" ? "組み立て中…"  : "Menyatukan…",
    netLabel: (lbl: string, n: number) =>
      lang === "en"
        ? `Pyramid net (${lbl.toLowerCase()}) — ${n + 1} faces (${n} triangles + 1 base)`
        : lang === "ja"
        ? `${lbl}錐の展開図 — ${n + 1}面（三角形${n}枚 + 底面1枚）`
        : `Jaring-jaring Limas ${lbl.toLowerCase()} — ${n + 1} bidang (${n} segitiga + 1 alas)`,
    legendBase: lang === "en" ? "Base" : lang === "ja" ? "底面" : "Alas",
    legendFace: (i: number) =>
      lang === "en" ? `Face ${i + 1}` : lang === "ja" ? `面 ${i + 1}` : `Sisi ${i + 1}`,
  };

  /* ── Geometry ── */
  const cfg = makeConfig(activeN);
  const { inR, slantH: _slantH, foldAngle } = cfg;

  const baseVerts: V3[] = Array.from({ length: activeN }, (_, k) => {
    const offset = activeN === 4 ? -Math.PI / 4 : 0;
    const angle = (2 * Math.PI * k / activeN) - Math.PI / 2 + offset;
    return [R3D * Math.cos(angle), H_PYR / 2, R3D * Math.sin(angle)] as V3;
  });

  const apexAssembled: V3 = [0, -H_PYR / 2, 0];

  const tCam     = easeInOut(Math.min(progress, 0.18) / 0.18);
  const camRxDeg = lerp(rotX, -46, tCam);
  const camRyDeg = lerp(rotY,   0, tCam);
  const camRx    = camRxDeg * Math.PI / 180;
  const camRy    = camRyDeg * Math.PI / 180;

  const proj = (v: V3): V2 => {
    const rv = rotXv(rotYv(v, camRy), camRx);
    const [px, py] = project(rv);
    return [SVG_CX + px, SVG_CY + py];
  };

  function getLateralFaceVerts(k: number): V3[] {
    const v0 = baseVerts[k];
    const v1 = baseVerts[(k + 1) % activeN];
    const hdx = v1[0] - v0[0], hdz = v1[2] - v0[2];
    const hLen = Math.sqrt(hdx * hdx + hdz * hdz);
    const hingeAxis: V3 = [hdx / hLen, 0, hdz / hLen];
    const M: V3 = [(v0[0] + v1[0]) / 2, H_PYR / 2, (v0[2] + v1[2]) / 2];
    const A_rel: V3 = [
      apexAssembled[0] - M[0],
      apexAssembled[1] - M[1],
      apexAssembled[2] - M[2],
    ];
    const [s, e]   = getSchedule(k, activeN);
    const localP   = smoothstep(s, e, progress);
    const angle    = foldAngle * easeOut(localP);
    const A_rot    = rotAroundAxis(A_rel, hingeAxis, angle);
    const apexPos: V3 = [M[0] + A_rot[0], M[1] + A_rot[1], M[2] + A_rot[2]];
    return [v0, v1, apexPos];
  }

  const allFaces = [
    { k: activeN, verts: baseVerts, fill: BASE_COLOR, label: faceLabel(activeN) },
    ...Array.from({ length: activeN }, (_, k) => ({
      k,
      verts: getLateralFaceVerts(k),
      fill:  TRI_COLORS[k % TRI_COLORS.length],
      label: faceLabel(k),
    })),
  ];

  const renderedFaces = allFaces
    .map(f => {
      const poly = f.verts.map(proj);
      const avgZ = f.verts.reduce(
        (s, v) => s + rotXv(rotYv(v, camRy), camRx)[2], 0
      ) / f.verts.length;
      return { ...f, poly, avgZ };
    })
    .sort((a, b) => b.avgZ - a.avgZ);

  const animateTo = (target: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startP = progressRef.current;
    const startT = performance.now();
    const dur    = 1800;
    setIsAnimating(true);
    const tick = (now: number) => {
      const raw  = Math.min((now - startT) / dur, 1);
      const newP = startP + (target - startP) * easeInOut(raw);
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

  const dragXDirection = activeN === 5 ? -1 : 1;
  const dragYDirection = activeN === 5 ? 1 : -1;

  const onMouseDown = (e: React.MouseEvent) => {
    if (progress > 0.05 || isAnimating) return;
    setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.by + (e.clientX - dragRef.current.sx) * 0.55 * dragXDirection);
    setRotX(dragRef.current.bx + (e.clientY - dragRef.current.sy) * 0.55 * dragYDirection);
  }, [dragXDirection, dragYDirection, isDragging]);
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
    setRotY(dragRef.current.by + (t.clientX - dragRef.current.sx) * 0.55 * dragXDirection);
    setRotX(dragRef.current.bx + (t.clientY - dragRef.current.sy) * 0.55 * dragYDirection);
  }, [dragXDirection, dragYDirection, isDragging]);
  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseup",    onMouseUp);
    window.addEventListener("touchmove",  onTouchMove, { passive: true });
    window.addEventListener("touchend",   onTouchEnd);
    return () => {
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseup",    onMouseUp);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setProgress(0); progressRef.current = 0;
    setRotX(-20); setRotY(0);
    setIsAnimating(false);
  }, [activeN]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const isAssembled = progress < 0.05;
  const isFlatNet   = progress > 0.95;

  const hingeAlpha = Math.min(1, progress * 8, (1 - progress) * 8) * 0.30;
  const tLabel = typeLabel(activeN);

  return (
    <div className="space-y-3">
      {/* Pyramid type selector */}
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
            const ptStr = f.poly.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
            const mx    = f.poly.reduce((s, p) => s + p[0], 0) / f.poly.length;
            const my    = f.poly.reduce((s, p) => s + p[1], 0) / f.poly.length;
            const lAlpha = Math.max(0, (progress - 0.80) / 0.20);
            return (
              <g key={fi}>
                <polygon points={ptStr} fill={f.fill} fillOpacity={0.88}
                  stroke="rgba(255,255,255,0.82)" strokeWidth={1.4} strokeLinejoin="round" />
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

          {hingeAlpha > 0.01 && Array.from({ length: activeN }, (_, k) => {
            const p0 = proj(baseVerts[k]);
            const p1 = proj(baseVerts[(k + 1) % activeN]);
            return (
              <line key={`h${k}`}
                x1={p0[0].toFixed(1)} y1={p0[1].toFixed(1)}
                x2={p1[0].toFixed(1)} y2={p1[1].toFixed(1)}
                stroke="var(--icon-stroke)" strokeWidth={1.3}
                strokeDasharray="4,3" opacity={hingeAlpha} />
            );
          })}

          {isAssembled && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#64748b" fontFamily="monospace">{tr.dragHint}</text>
          )}
          {isFlatNet && (
            <text x="200" y="334" textAnchor="middle" fontSize="8"
              fill="#facc15" fontFamily="monospace">
              {tr.netLabel(tLabel, activeN)}
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
        <button onClick={() => { setRotX(-20); setRotY(0); }}
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
          { c: BASE_COLOR, l: tr.legendBase },
          ...TRI_COLORS.slice(0, activeN).map((c, i) => ({ c, l: tr.legendFace(i) })),
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
