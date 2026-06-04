import { useState, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────
const R = 86;          // protractor outer radius (local coords)
const SVG_W = 400;
const SVG_H = 320;
const VX = 200;        // vertex X in canvas
const VY = 248;        // vertex Y in canvas
const RAY = 130;       // ray length

type Mode = "pelurus" | "penyiku" | "bertolak";

// ── Helpers ────────────────────────────────────────────────────────────
const deg2rad = (d: number) => (d * Math.PI) / 180;

/** Point on protractor arc at deg (0=right, 90=up, 180=left) in local coords */
const arcPt = (deg: number, r = R) => ({
  x: r * Math.cos(deg2rad(deg)),
  y: -r * Math.sin(deg2rad(deg)),
});

/** Canvas endpoint of a ray from (vx,vy) at angleDeg, length len */
const rayPt = (vx: number, vy: number, angleDeg: number, len = RAY) => ({
  x: vx + len * Math.cos(deg2rad(angleDeg)),
  y: vy - len * Math.sin(deg2rad(angleDeg)),
});

/** Sector arc path (for filled sectors around a vertex in canvas coords) */
const sectorPath = (vx: number, vy: number, r: number, a1: number, a2: number) => {
  const s = rayPt(vx, vy, a1, r);
  const e = rayPt(vx, vy, a2, r);
  const span = ((a2 - a1 + 360) % 360);
  const large = span > 180 ? 1 : 0;
  return `M ${vx},${vy} L ${s.x},${s.y} A ${r},${r} 0 ${large},0 ${e.x},${e.y} Z`;
};

// ── Protractor SVG (local, center at origin) ───────────────────────────
function ProtractorBody({ angle }: { angle: number }) {
  const sectors = [];
  const ticks: { d: number; ox: number; oy: number; ix: number; iy: number; major: boolean }[] = [];

  for (let d = 0; d <= 180; d += 5) {
    const major = d % 10 === 0;
    const outer = arcPt(d, R);
    const innerR = major ? R - 16 : d % 5 === 0 ? R - 9 : R - 5;
    const inner = arcPt(d, innerR);
    ticks.push({ d, ox: outer.x, oy: outer.y, ix: inner.x, iy: inner.y, major });
  }

  const arm = arcPt(angle);
  const midPt = arcPt(angle / 2, R * 0.51);

  return (
    <>
      {/* Body fill */}
      <path
        d={`M ${-R},0 L ${R},0 A ${R},${R} 0 0,1 ${-R},0 Z`}
        fill="rgba(34,211,238,0.07)"
        stroke="none"
      />

      {/* Highlighted sector (measured angle) */}
      <path
        d={`M 0,0 L ${R},0 A ${R},${R} 0 ${angle > 180 ? 1 : 0},1 ${arm.x},${arm.y} Z`}
        fill="rgba(250,204,21,0.18)"
        stroke="none"
      />

      {/* Outer arc */}
      <path
        d={`M ${R},0 A ${R},${R} 0 0,1 ${-R},0`}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.2"
      />

      {/* Inner arc (decoration) */}
      <path
        d={`M ${R - 18},0 A ${R - 18},${R - 18} 0 0,1 ${-(R - 18)},0`}
        fill="none"
        stroke="rgba(34,211,238,0.2)"
        strokeWidth="1"
      />

      {/* Baseline */}
      <line x1={-R} y1={0} x2={R} y2={0} stroke="#22d3ee" strokeWidth="2" />

      {/* Tick marks */}
      {ticks.map(({ d, ox, oy, ix, iy, major }) => (
        <line
          key={d}
          x1={ox} y1={oy} x2={ix} y2={iy}
          stroke={major ? "#7dd3fc" : "#334155"}
          strokeWidth={major ? 1.5 : 0.8}
        />
      ))}

      {/* Degree labels (every 10°) */}
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180].map(d => {
        const lp = arcPt(d, R - 26);
        return (
          <text
            key={d}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={d === 0 || d === 180 ? 7.5 : 7}
            fill={Math.abs(d - angle) < 3 ? "#facc15" : "#64748b"}
            fontWeight={Math.abs(d - angle) < 3 ? "bold" : "normal"}
            fontFamily="monospace"
          >
            {d}
          </text>
        );
      })}

      {/* Center base notch */}
      <rect x={-3} y={-3} width={6} height={6} fill="var(--bg-secondary)" rx={1} />
      <circle cx={0} cy={0} r={2.5} fill="#facc15" />

      {/* 0 and 180 end markers */}
      <text x={R + 6} y={4} fontSize="8" fill="#22d3ee" fontFamily="monospace" textAnchor="start">0°</text>
      <text x={-(R + 6)} y={4} fontSize="8" fill="#22d3ee" fontFamily="monospace" textAnchor="end">180°</text>

      {/* Angle indicator arm */}
      <line
        x1={0} y1={0}
        x2={arm.x} y2={arm.y}
        stroke="#facc15"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="none"
      />
      {/* Arm tip circle */}
      <circle cx={arm.x} cy={arm.y} r={4} fill="#facc15" />

      {/* Angle readout bubble */}
      <g transform={`translate(${midPt.x},${midPt.y})`}>
        <rect x={-18} y={-9} width={36} height={18} rx={5} fill="var(--bg-card)" stroke="#facc15" strokeWidth={1} />
        <text textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#facc15" fontWeight="bold" fontFamily="monospace">
          {angle}°
        </text>
      </g>

      {/* Drag grip label */}
      <text x={0} y={15} textAnchor="middle" fontSize="7" fill="rgba(34,211,238,0.5)" fontFamily="sans-serif">✥ seret</text>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function ProtractorAnimation() {
  const [angle, setAngle] = useState(55);
  const [mode, setMode] = useState<Mode>("pelurus");
  const [protX, setProtX] = useState(VX);
  const [protY, setProtY] = useState(VY);
  const [protRot, setProtRot] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const maxAngle = mode === "penyiku" ? 85 : 175;
  const α = Math.min(angle, maxAngle);
  const complement = mode === "penyiku" ? 90 - α : 180 - α;

  // ── Get SVG-space coords from pointer/mouse event
  const getSVGXY = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const cy = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    return {
      x: ((cx - rect.left) / rect.width) * SVG_W,
      y: ((cy - rect.top) / rect.height) * SVG_H,
    };
  }, []);

  // ── Drag handlers
  const onDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getSVGXY(e);
    const dx = x - protX;
    const dy = y - protY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < R + 12) {
      e.preventDefault();
      setIsDragging(true);
      setOffset({ x: dx, y: dy });
    }
  }, [getSVGXY, protX, protY]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const { x, y } = getSVGXY(e);
    const nx = Math.max(R + 8, Math.min(SVG_W - R - 8, x - offset.x));
    const ny = Math.max(R + 5, Math.min(SVG_H - 15, y - offset.y));
    setProtX(nx);
    setProtY(ny);
  }, [isDragging, getSVGXY, offset]);

  const onUp = useCallback(() => setIsDragging(false), []);

  const resetProt = () => { setProtX(VX); setProtY(VY); setProtRot(0); };

  // ── Diagram geometry
  const p = (a: number, len = RAY) => rayPt(VX, VY, a, len);

  // ── Colors
  const C_ALPHA = "#facc15";
  const C_BETA  = "#a78bfa";
  const C_COMP  = "#22d3ee";
  const C_OPP   = "#fb923c";

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-4 py-3 flex items-center gap-2">
        <span className="text-lg">📏</span>
        <span className="font-body font-semibold text-cyan-300 text-sm">
          Busur Derajat Portabel — Simulasi Interaktif
        </span>
        <span className="ml-auto text-xs text-white/30 font-body">seret busur untuk memindahkan</span>
      </div>

      <div className="p-4 space-y-3">

        {/* Mode tabs */}
        <div className="flex gap-1 p-1 bg-slate-800/60 rounded-lg">
          {(["pelurus", "penyiku", "bertolak"] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setAngle(m === "penyiku" ? 40 : 55); }}
              className={`flex-1 py-1.5 text-xs rounded-md font-body font-semibold cursor-pointer transition-all ${
                mode === m ? "bg-cyan-600/80 text-white shadow" : "text-white/50 hover:text-white/80"
              }`}
            >
              {m === "pelurus" ? "↔ Pelurus" : m === "penyiku" ? "⌐ Penyiku" : "✕ Bertolak"}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div
          className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-950/80 select-none"
          style={{ touchAction: "none" }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{ cursor: isDragging ? "grabbing" : "default" }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          >
            <defs>
              <pattern id="pgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0L0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.8" />
              </pattern>
              {/* Arrow markers */}
              {[
                ["arC", "#22d3ee"], ["arO", "#fb923c"], ["arG", "#4ade80"],
                ["arY", "#facc15"], ["arP", "#a78bfa"],
              ].map(([id, color]) => (
                <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill={color} />
                </marker>
              ))}
              {/* Reverse arrows for bidirectional */}
              {[
                ["arCR", "#22d3ee"], ["arOR", "#fb923c"],
              ].map(([id, color]) => (
                <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
                  <path d="M7,0 L7,6 L0,3 z" fill={color} />
                </marker>
              ))}
            </defs>

            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="url(#pgrid)" />

            {/* ─ PELURUS MODE ─ */}
            {mode === "pelurus" && (
              <g>
                {/* Full straight line */}
                <line x1={p(180).x} y1={p(180).y} x2={p(0).x} y2={p(0).y}
                  stroke={C_COMP} strokeWidth={2.5}
                  markerEnd="url(#arC)" markerStart="url(#arCR)" />
                {/* Second ray */}
                <line x1={VX} y1={VY} x2={p(α).x} y2={p(α).y}
                  stroke={C_OPP} strokeWidth={2.5} markerEnd="url(#arO)" />
                {/* Alpha sector */}
                <path d={sectorPath(VX, VY, 45, 0, α)}
                  fill="rgba(250,204,21,0.18)" stroke={C_ALPHA} strokeWidth={1.2} />
                {/* Beta sector */}
                <path d={sectorPath(VX, VY, 45, α, 180)}
                  fill="rgba(167,139,250,0.15)" stroke={C_BETA} strokeWidth={1.2} />
                {/* Labels */}
                <text {...textProps(rayPt(VX, VY, α / 2, 60), C_ALPHA, 14, "bold")}>α</text>
                <text {...textProps(rayPt(VX, VY, (α + 180) / 2, 60), C_BETA, 14, "bold")}>β</text>
                {/* Degree values near arcs */}
                <text {...textProps(rayPt(VX, VY, α / 2, 78), C_ALPHA, 9)}>{α}°</text>
                <text {...textProps(rayPt(VX, VY, (α + 180) / 2, 78), C_BETA, 9)}>{180 - α}°</text>
              </g>
            )}

            {/* ─ PENYIKU MODE ─ */}
            {mode === "penyiku" && (
              <g>
                {/* Horizontal ray */}
                <line x1={VX} y1={VY} x2={p(0).x} y2={p(0).y}
                  stroke={C_COMP} strokeWidth={2.5} markerEnd="url(#arC)" />
                {/* Vertical ray */}
                <line x1={VX} y1={VY} x2={p(90).x} y2={p(90).y}
                  stroke={C_COMP} strokeWidth={2.5} markerEnd="url(#arC)" />
                {/* Right-angle box */}
                <rect x={VX} y={VY - 16} width={16} height={16}
                  fill="none" stroke={C_COMP} strokeWidth={1.5} />
                {/* Second ray */}
                <line x1={VX} y1={VY} x2={p(α).x} y2={p(α).y}
                  stroke={C_OPP} strokeWidth={2.5} markerEnd="url(#arO)" />
                {/* Alpha sector */}
                <path d={sectorPath(VX, VY, 45, 0, α)}
                  fill="rgba(250,204,21,0.18)" stroke={C_ALPHA} strokeWidth={1.2} />
                {/* Beta sector */}
                <path d={sectorPath(VX, VY, 45, α, 90)}
                  fill="rgba(167,139,250,0.15)" stroke={C_BETA} strokeWidth={1.2} />
                {/* Labels */}
                <text {...textProps(rayPt(VX, VY, α / 2, 60), C_ALPHA, 14, "bold")}>α</text>
                <text {...textProps(rayPt(VX, VY, (α + 90) / 2, 60), C_BETA, 14, "bold")}>β</text>
                <text {...textProps(rayPt(VX, VY, α / 2, 77), C_ALPHA, 9)}>{α}°</text>
                <text {...textProps(rayPt(VX, VY, (α + 90) / 2, 77), C_BETA, 9)}>{90 - α}°</text>
              </g>
            )}

            {/* ─ BERTOLAK BELAKANG MODE ─ */}
            {mode === "bertolak" && (
              <g>
                {/* Line 1: horizontal */}
                <line x1={p(180).x} y1={p(180).y} x2={p(0).x} y2={p(0).y}
                  stroke={C_COMP} strokeWidth={2.5}
                  markerEnd="url(#arC)" markerStart="url(#arCR)" />
                {/* Line 2: at angle α, bidirectional */}
                <line x1={p(α + 180).x} y1={p(α + 180).y} x2={p(α).x} y2={p(α).y}
                  stroke={C_OPP} strokeWidth={2.5}
                  markerEnd="url(#arO)" markerStart="url(#arOR)" />
                {/* 4 sectors */}
                {/* ∠1 = α (top-right) */}
                <path d={sectorPath(VX, VY, 38, 0, α)}
                  fill="rgba(250,204,21,0.22)" stroke={C_ALPHA} strokeWidth={1} />
                {/* ∠2 = 180-α (top-left) */}
                <path d={sectorPath(VX, VY, 38, α, 180)}
                  fill="rgba(167,139,250,0.18)" stroke={C_BETA} strokeWidth={1} />
                {/* ∠3 = α (bottom-left, = ∠1) */}
                <path d={sectorPath(VX, VY, 38, 180, 180 + α)}
                  fill="rgba(250,204,21,0.22)" stroke={C_ALPHA} strokeWidth={1} />
                {/* ∠4 = 180-α (bottom-right, = ∠2) */}
                <path d={sectorPath(VX, VY, 38, 180 + α, 360)}
                  fill="rgba(167,139,250,0.18)" stroke={C_BETA} strokeWidth={1} />
                {/* Labels */}
                <text {...textProps(rayPt(VX, VY, α / 2, 58), C_ALPHA, 11, "bold")}>∠1={α}°</text>
                <text {...textProps(rayPt(VX, VY, (α + 180) / 2, 58), C_BETA, 11, "bold")}>∠2={180-α}°</text>
                <text {...textProps(rayPt(VX, VY, 180 + α / 2, 58), C_ALPHA, 11, "bold")}>∠3={α}°</text>
                <text {...textProps(rayPt(VX, VY, 180 + (α + 180) / 2, 58), C_BETA, 11, "bold")}>∠4={180-α}°</text>
              </g>
            )}

            {/* ─ Vertex dot ─ */}
            <circle cx={VX} cy={VY} r={5} fill={C_ALPHA} stroke="#0f172a" strokeWidth={1.5} />
            <text x={VX + 10} y={VY + 14} fontSize={10} fill="#475569" fontFamily="monospace">O</text>

            {/* ─ Draggable Protractor ─ */}
            <g
              transform={`translate(${protX},${protY}) rotate(${protRot})`}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <ProtractorBody angle={α} />
            </g>

            {/* Snap guide: dashed line from vertex to protractor center */}
            {!isDragging && (Math.abs(protX - VX) > 20 || Math.abs(protY - VY) > 20) && (
              <line
                x1={VX} y1={VY} x2={protX} y2={protY}
                stroke="rgba(250,204,21,0.15)"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            )}

            {/* Position info */}
            <text x={8} y={15} fontSize={9} fill="#334155" fontFamily="monospace">
              Busur @ ({Math.round(protX)}, {Math.round(protY)})
            </text>
          </svg>
        </div>

        {/* Angle slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-body text-xs font-semibold text-white/70">📐 Besar Sudut α</label>
            <span className="font-mono text-sm font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
              α = {α}°
            </span>
          </div>
          <input
            type="range" min={5} max={maxAngle} step={1} value={α}
            onChange={e => setAngle(+e.target.value)}
            className="w-full h-2 rounded-full accent-yellow-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/25 font-body">
            <span>5°</span>
            <span>{Math.round(maxAngle / 2)}°</span>
            <span>{maxAngle}°</span>
          </div>
        </div>

        {/* Protractor rotation slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-body text-xs font-semibold text-white/70">🔄 Kemiringan Busur</label>
            <span className="font-mono text-xs font-bold text-cyan-400">{protRot > 0 ? "+" : ""}{protRot}°</span>
          </div>
          <input
            type="range" min={-80} max={80} step={1} value={protRot}
            onChange={e => setProtRot(+e.target.value)}
            className="w-full h-2 rounded-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/25 font-body">
            <span>miring kiri −80°</span>
            <span>tegak 0°</span>
            <span>miring kanan +80°</span>
          </div>
        </div>

        {/* Info panel */}
        <div className={`rounded-lg p-3 border space-y-2 ${
          mode === "pelurus"   ? "bg-violet-500/10 border-violet-500/25" :
          mode === "penyiku"   ? "bg-green-500/10  border-green-500/25"  :
                                 "bg-yellow-500/10 border-yellow-500/25"
        }`}>
          <p className={`font-body text-xs font-semibold ${
            mode === "pelurus"   ? "text-violet-300" :
            mode === "penyiku"   ? "text-green-300"  :
                                   "text-yellow-300"
          }`}>
            {mode === "pelurus"   ? "↔ Sudut Pelurus (Supplementary)" :
             mode === "penyiku"   ? "⌐ Sudut Penyiku (Complementary)" :
                                    "✕ Sudut Bertolak Belakang (Vertical Angles)"}
          </p>

          <div className="bg-slate-900/60 rounded p-2 space-y-1 font-mono text-xs">
            {mode === "pelurus" && (
              <>
                <p className="text-yellow-400">α = {α}°</p>
                <p className="text-purple-400">β (pelurus) = 180° − {α}° = {180 - α}°</p>
                <p className="text-green-400">✓ α + β = {α}° + {180 - α}° = 180°</p>
              </>
            )}
            {mode === "penyiku" && (
              <>
                <p className="text-yellow-400">α = {α}°</p>
                <p className="text-purple-400">β (penyiku) = 90° − {α}° = {90 - α}°</p>
                <p className="text-green-400">✓ α + β = {α}° + {90 - α}° = 90°</p>
              </>
            )}
            {mode === "bertolak" && (
              <>
                <p className="text-yellow-400">∠1 = ∠3 = {α}° (bertolak belakang)</p>
                <p className="text-purple-400">∠2 = ∠4 = {180 - α}° (bertolak belakang)</p>
                <p className="text-green-400">✓ ∠1 + ∠2 = {α}° + {180 - α}° = 180° (pelurus)</p>
              </>
            )}
          </div>

          <p className="font-body text-xs text-white/50 leading-relaxed">
            {mode === "pelurus"
              ? `Jika pelurus dari α diketahui, α = 180° − ${180-α}° = ${α}°. Busur derajat mengukur sudut langsung.`
              : mode === "penyiku"
              ? `Penyiku hanya ada untuk sudut < 90°. Dua sudut yang penyiku membentuk sudut siku-siku sempurna.`
              : `Dua garis berpotongan selalu membentuk 2 pasang sudut bertolak belakang yang sama besar. Tidak perlu mengukur semua!`
            }
          </p>
        </div>

        {/* How to use */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
          <p className="font-body text-xs font-semibold text-slate-300 mb-1.5">💡 Cara Menggunakan Busur:</p>
          <div className="space-y-1 font-body text-xs text-white/50 leading-relaxed">
            <p>① <strong className="text-white/70">Seret busur</strong> ke titik sudut (O) untuk mengukur</p>
            <p>② <strong className="text-white/70">Geser α</strong> untuk mengubah besar sudut yang diukur</p>
            <p>③ <strong className="text-white/70">Miringkan busur</strong> untuk menyelaraskan dengan sisi sudut</p>
            <p>④ Baca angka pada busur di mana sinar kedua memotong skala</p>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={resetProt}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/50 hover:text-white text-xs font-body cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Kembalikan Busur ke Posisi Awal
        </button>
      </div>
    </div>
  );
}

// ── Tiny helper for SVG text props ─────────────────────────────────────
function textProps(
  pt: { x: number; y: number },
  fill: string,
  fontSize: number,
  fontWeight?: string
) {
  return {
    x: pt.x,
    y: pt.y,
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    fontSize,
    fill,
    fontWeight: fontWeight ?? "normal",
    fontFamily: "monospace",
  };
}
