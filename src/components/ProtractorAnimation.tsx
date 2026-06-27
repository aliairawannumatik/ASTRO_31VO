import { useState, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Constants ──────────────────────────────────────────────────────────
const R = 86;
const SVG_W = 400;
const SVG_H = 320;
const VX = 200;
const VY = 248;
const RAY = 130;

// Mode keys are internal logic/state — never translated
type Mode = "pelurus" | "penyiku" | "bertolak";

// ── uiMap ──────────────────────────────────────────────────────────────
const uiMap = {
  id: {
    header: "Busur Derajat Portabel — Simulasi Interaktif",
    dragHint: "seret busur untuk memindahkan",
    tabPelurus: "↔ Pelurus",
    tabPenyiku: "⌐ Penyiku",
    tabBertolak: "✕ Bertolak",
    svgDragGrip: "✥ seret",
    svgBusurAt: (x: number, y: number) => `Busur @ (${x}, ${y})`,
    sliderAngleLabel: "📐 Besar Sudut α",
    sliderTiltLabel: "🔄 Kemiringan Busur",
    tiltLeft: "miring kiri −80°",
    tiltCenter: "tegak 0°",
    tiltRight: "miring kanan +80°",
    modePelurusTitle: "↔ Sudut Pelurus (Supplementary)",
    modePenyikuTitle: "⌐ Sudut Penyiku (Complementary)",
    modeBertolakTitle: "✕ Sudut Bertolak Belakang (Vertical Angles)",
    betaPelurus: "β (pelurus)",
    betaPenyiku: "β (penyiku)",
    bertolakLabel: "(bertolak belakang)",
    bertolakPelurus: "(pelurus)",
    tipPelurus: (compl: number, a: number) =>
      `Jika pelurus dari α diketahui, α = 180° − ${compl}° = ${a}°. Busur derajat mengukur sudut langsung.`,
    tipPenyiku:
      "Penyiku hanya ada untuk sudut < 90°. Dua sudut yang penyiku membentuk sudut siku-siku sempurna.",
    tipBertolak:
      "Dua garis berpotongan selalu membentuk 2 pasang sudut bertolak belakang yang sama besar. Tidak perlu mengukur semua!",
    howToTitle: "💡 Cara Menggunakan Busur:",
    howTo1a: "Seret busur",
    howTo1b: "ke titik sudut (O) untuk mengukur",
    howTo2a: "Geser α",
    howTo2b: "untuk mengubah besar sudut yang diukur",
    howTo3a: "Miringkan busur",
    howTo3b: "untuk menyelaraskan dengan sisi sudut",
    howTo4: "Baca angka pada busur di mana sinar kedua memotong skala",
    resetBtn: "Kembalikan Busur ke Posisi Awal",
  },
  en: {
    header: "Portable Protractor — Interactive Simulation",
    dragHint: "drag protractor to move",
    tabPelurus: "↔ Supplementary",
    tabPenyiku: "⌐ Complementary",
    tabBertolak: "✕ Vertical Angles",
    svgDragGrip: "✥ drag",
    svgBusurAt: (x: number, y: number) => `Protractor @ (${x}, ${y})`,
    sliderAngleLabel: "📐 Angle Size α",
    sliderTiltLabel: "🔄 Protractor Tilt",
    tiltLeft: "tilt left −80°",
    tiltCenter: "upright 0°",
    tiltRight: "tilt right +80°",
    modePelurusTitle: "↔ Supplementary Angles",
    modePenyikuTitle: "⌐ Complementary Angles",
    modeBertolakTitle: "✕ Vertical Angles",
    betaPelurus: "β (supplement)",
    betaPenyiku: "β (complement)",
    bertolakLabel: "(vertical angles)",
    bertolakPelurus: "(supplementary)",
    tipPelurus: (compl: number, a: number) =>
      `If the supplement of α is known, α = 180° − ${compl}° = ${a}°. The protractor measures the angle directly.`,
    tipPenyiku:
      "Complementary angles only exist for angles < 90°. Two complementary angles together form a perfect right angle.",
    tipBertolak:
      "Two intersecting lines always form 2 pairs of equal vertical angles. No need to measure all of them!",
    howToTitle: "💡 How to Use the Protractor:",
    howTo1a: "Drag the protractor",
    howTo1b: "to the vertex point (O) to measure",
    howTo2a: "Slide α",
    howTo2b: "to change the measured angle size",
    howTo3a: "Tilt the protractor",
    howTo3b: "to align it with the angle's side",
    howTo4: "Read the number on the protractor where the second ray crosses the scale",
    resetBtn: "Reset Protractor to Initial Position",
  },
  ja: {
    header: "携帯分度器 — インタラクティブシミュレーション",
    dragHint: "ドラッグして移動",
    tabPelurus: "↔ 補角",
    tabPenyiku: "⌐ 余角",
    tabBertolak: "✕ 対頂角",
    svgDragGrip: "✥ ドラッグ",
    svgBusurAt: (x: number, y: number) => `分度器 @ (${x}, ${y})`,
    sliderAngleLabel: "📐 角αの大きさ",
    sliderTiltLabel: "🔄 分度器の傾き",
    tiltLeft: "左に傾ける −80°",
    tiltCenter: "垂直 0°",
    tiltRight: "右に傾ける +80°",
    modePelurusTitle: "↔ 補角（Supplementary）",
    modePenyikuTitle: "⌐ 余角（Complementary）",
    modeBertolakTitle: "✕ 対頂角（Vertical Angles）",
    betaPelurus: "β（補角）",
    betaPenyiku: "β（余角）",
    bertolakLabel: "（対頂角）",
    bertolakPelurus: "（補角）",
    tipPelurus: (compl: number, a: number) =>
      `αの補角がわかれば、α = 180° − ${compl}° = ${a}°。分度器で直接測定できます。`,
    tipPenyiku:
      "余角は90°未満の角にのみ存在します。2つの余角を合わせると直角になります。",
    tipBertolak:
      "2直線が交わると常に2組の等しい対頂角ができます。すべてを測る必要はありません！",
    howToTitle: "💡 分度器の使い方：",
    howTo1a: "分度器をドラッグ",
    howTo1b: "して頂点（O）に合わせて測る",
    howTo2a: "αをスライド",
    howTo2b: "して測る角の大きさを変える",
    howTo3a: "分度器を傾ける",
    howTo3b: "角の辺に合わせる",
    howTo4: "2本目の光線が目盛りと交わる数字を読む",
    resetBtn: "分度器を元の位置に戻す",
  },
};

type UI = typeof uiMap.id;

// ── Helpers ────────────────────────────────────────────────────────────
const deg2rad = (d: number) => (d * Math.PI) / 180;

const arcPt = (deg: number, r = R) => ({
  x: r * Math.cos(deg2rad(deg)),
  y: -r * Math.sin(deg2rad(deg)),
});

const rayPt = (vx: number, vy: number, angleDeg: number, len = RAY) => ({
  x: vx + len * Math.cos(deg2rad(angleDeg)),
  y: vy - len * Math.sin(deg2rad(angleDeg)),
});

const sectorPath = (vx: number, vy: number, r: number, a1: number, a2: number) => {
  const s = rayPt(vx, vy, a1, r);
  const e = rayPt(vx, vy, a2, r);
  const span = ((a2 - a1 + 360) % 360);
  const large = span > 180 ? 1 : 0;
  return `M ${vx},${vy} L ${s.x},${s.y} A ${r},${r} 0 ${large},0 ${e.x},${e.y} Z`;
};

// ── Protractor SVG (local, center at origin) ───────────────────────────
function ProtractorBody({ angle, dragGripLabel }: { angle: number; dragGripLabel: string }) {
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
      <path
        d={`M ${-R},0 L ${R},0 A ${R},${R} 0 0,1 ${-R},0 Z`}
        fill="rgba(34,211,238,0.07)"
        stroke="none"
      />
      <path
        d={`M 0,0 L ${R},0 A ${R},${R} 0 ${angle > 180 ? 1 : 0},1 ${arm.x},${arm.y} Z`}
        fill="rgba(250,204,21,0.18)"
        stroke="none"
      />
      <path
        d={`M ${R},0 A ${R},${R} 0 0,1 ${-R},0`}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.2"
      />
      <path
        d={`M ${R - 18},0 A ${R - 18},${R - 18} 0 0,1 ${-(R - 18)},0`}
        fill="none"
        stroke="rgba(34,211,238,0.2)"
        strokeWidth="1"
      />
      <line x1={-R} y1={0} x2={R} y2={0} stroke="#22d3ee" strokeWidth="2" />
      {ticks.map(({ d, ox, oy, ix, iy, major }) => (
        <line
          key={d}
          x1={ox} y1={oy} x2={ix} y2={iy}
          stroke={major ? "#7dd3fc" : "#334155"}
          strokeWidth={major ? 1.5 : 0.8}
        />
      ))}
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
      <rect x={-3} y={-3} width={6} height={6} fill="var(--bg-secondary)" rx={1} />
      <circle cx={0} cy={0} r={2.5} fill="#facc15" />
      <text x={R + 6} y={4} fontSize="8" fill="#22d3ee" fontFamily="monospace" textAnchor="start">0°</text>
      <text x={-(R + 6)} y={4} fontSize="8" fill="#22d3ee" fontFamily="monospace" textAnchor="end">180°</text>
      <line
        x1={0} y1={0}
        x2={arm.x} y2={arm.y}
        stroke="#facc15"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="none"
      />
      <circle cx={arm.x} cy={arm.y} r={4} fill="#facc15" />
      <g transform={`translate(${midPt.x},${midPt.y})`}>
        <rect x={-18} y={-9} width={36} height={18} rx={5} fill="var(--bg-card)" stroke="#facc15" strokeWidth={1} />
        <text textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#facc15" fontWeight="bold" fontFamily="monospace">
          {angle}°
        </text>
      </g>
      {/* Drag grip label — translated */}
      <text x={0} y={15} textAnchor="middle" fontSize="7" fill="rgba(34,211,238,0.5)" fontFamily="sans-serif">
        {dragGripLabel}
      </text>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function ProtractorAnimation() {
  const { language } = useLanguage();
  const ui: UI = uiMap[language as "id" | "en" | "ja"] ?? uiMap.id;

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

  const p = (a: number, len = RAY) => rayPt(VX, VY, a, len);

  const C_ALPHA = "#facc15";
  const C_BETA  = "#a78bfa";
  const C_COMP  = "#22d3ee";
  const C_OPP   = "#fb923c";

  // Display label for mode tab — separated from internal Mode key
  const modeTabLabel = (m: Mode): string =>
    m === "pelurus" ? ui.tabPelurus : m === "penyiku" ? ui.tabPenyiku : ui.tabBertolak;

  const modeTitle =
    mode === "pelurus" ? ui.modePelurusTitle :
    mode === "penyiku" ? ui.modePenyikuTitle :
    ui.modeBertolakTitle;

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-4 py-3 flex items-center gap-2">
        <span className="text-lg">📏</span>
        <span className="font-body font-semibold text-cyan-300 text-sm">
          {ui.header}
        </span>
        <span className="ml-auto text-xs text-white/30 font-body">{ui.dragHint}</span>
      </div>

      <div className="p-4 space-y-3">

        {/* Mode tabs — display label translated, internal key unchanged */}
        <div className="flex gap-1 p-1 bg-slate-800/60 rounded-lg">
          {(["pelurus", "penyiku", "bertolak"] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setAngle(m === "penyiku" ? 40 : 55); }}
              className={`flex-1 py-1.5 text-xs rounded-md font-body font-semibold cursor-pointer transition-all ${
                mode === m ? "bg-cyan-600/80 text-white shadow" : "text-white/50 hover:text-white/80"
              }`}
            >
              {modeTabLabel(m)}
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
              {[
                ["arC", "#22d3ee"], ["arO", "#fb923c"], ["arG", "#4ade80"],
                ["arY", "#facc15"], ["arP", "#a78bfa"],
              ].map(([id, color]) => (
                <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill={color} />
                </marker>
              ))}
              {[
                ["arCR", "#22d3ee"], ["arOR", "#fb923c"],
              ].map(([id, color]) => (
                <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
                  <path d="M7,0 L7,6 L0,3 z" fill={color} />
                </marker>
              ))}
            </defs>

            <rect width={SVG_W} height={SVG_H} fill="url(#pgrid)" />

            {/* ─ PELURUS MODE ─ */}
            {mode === "pelurus" && (
              <g>
                <line x1={p(180).x} y1={p(180).y} x2={p(0).x} y2={p(0).y}
                  stroke={C_COMP} strokeWidth={2.5}
                  markerEnd="url(#arC)" markerStart="url(#arCR)" />
                <line x1={VX} y1={VY} x2={p(α).x} y2={p(α).y}
                  stroke={C_OPP} strokeWidth={2.5} markerEnd="url(#arO)" />
                <path d={sectorPath(VX, VY, 45, 0, α)}
                  fill="rgba(250,204,21,0.18)" stroke={C_ALPHA} strokeWidth={1.2} />
                <path d={sectorPath(VX, VY, 45, α, 180)}
                  fill="rgba(167,139,250,0.15)" stroke={C_BETA} strokeWidth={1.2} />
                <text {...textProps(rayPt(VX, VY, α / 2, 60), C_ALPHA, 14, "bold")}>α</text>
                <text {...textProps(rayPt(VX, VY, (α + 180) / 2, 60), C_BETA, 14, "bold")}>β</text>
                <text {...textProps(rayPt(VX, VY, α / 2, 78), C_ALPHA, 9)}>{α}°</text>
                <text {...textProps(rayPt(VX, VY, (α + 180) / 2, 78), C_BETA, 9)}>{180 - α}°</text>
              </g>
            )}

            {/* ─ PENYIKU MODE ─ */}
            {mode === "penyiku" && (
              <g>
                <line x1={VX} y1={VY} x2={p(0).x} y2={p(0).y}
                  stroke={C_COMP} strokeWidth={2.5} markerEnd="url(#arC)" />
                <line x1={VX} y1={VY} x2={p(90).x} y2={p(90).y}
                  stroke={C_COMP} strokeWidth={2.5} markerEnd="url(#arC)" />
                <rect x={VX} y={VY - 16} width={16} height={16}
                  fill="none" stroke={C_COMP} strokeWidth={1.5} />
                <line x1={VX} y1={VY} x2={p(α).x} y2={p(α).y}
                  stroke={C_OPP} strokeWidth={2.5} markerEnd="url(#arO)" />
                <path d={sectorPath(VX, VY, 45, 0, α)}
                  fill="rgba(250,204,21,0.18)" stroke={C_ALPHA} strokeWidth={1.2} />
                <path d={sectorPath(VX, VY, 45, α, 90)}
                  fill="rgba(167,139,250,0.15)" stroke={C_BETA} strokeWidth={1.2} />
                <text {...textProps(rayPt(VX, VY, α / 2, 60), C_ALPHA, 14, "bold")}>α</text>
                <text {...textProps(rayPt(VX, VY, (α + 90) / 2, 60), C_BETA, 14, "bold")}>β</text>
                <text {...textProps(rayPt(VX, VY, α / 2, 77), C_ALPHA, 9)}>{α}°</text>
                <text {...textProps(rayPt(VX, VY, (α + 90) / 2, 77), C_BETA, 9)}>{90 - α}°</text>
              </g>
            )}

            {/* ─ BERTOLAK BELAKANG MODE ─ */}
            {mode === "bertolak" && (
              <g>
                <line x1={p(180).x} y1={p(180).y} x2={p(0).x} y2={p(0).y}
                  stroke={C_COMP} strokeWidth={2.5}
                  markerEnd="url(#arC)" markerStart="url(#arCR)" />
                <line x1={p(α + 180).x} y1={p(α + 180).y} x2={p(α).x} y2={p(α).y}
                  stroke={C_OPP} strokeWidth={2.5}
                  markerEnd="url(#arO)" markerStart="url(#arOR)" />
                <path d={sectorPath(VX, VY, 38, 0, α)}
                  fill="rgba(250,204,21,0.22)" stroke={C_ALPHA} strokeWidth={1} />
                <path d={sectorPath(VX, VY, 38, α, 180)}
                  fill="rgba(167,139,250,0.18)" stroke={C_BETA} strokeWidth={1} />
                <path d={sectorPath(VX, VY, 38, 180, 180 + α)}
                  fill="rgba(250,204,21,0.22)" stroke={C_ALPHA} strokeWidth={1} />
                <path d={sectorPath(VX, VY, 38, 180 + α, 360)}
                  fill="rgba(167,139,250,0.18)" stroke={C_BETA} strokeWidth={1} />
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
              <ProtractorBody angle={α} dragGripLabel={ui.svgDragGrip} />
            </g>

            {/* Snap guide */}
            {!isDragging && (Math.abs(protX - VX) > 20 || Math.abs(protY - VY) > 20) && (
              <line
                x1={VX} y1={VY} x2={protX} y2={protY}
                stroke="rgba(250,204,21,0.15)"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            )}

            {/* Position info — translated */}
            <text x={8} y={15} fontSize={9} fill="#334155" fontFamily="monospace">
              {ui.svgBusurAt(Math.round(protX), Math.round(protY))}
            </text>
          </svg>
        </div>

        {/* Angle slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-body text-xs font-semibold text-white/70">{ui.sliderAngleLabel}</label>
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
            <label className="font-body text-xs font-semibold text-white/70">{ui.sliderTiltLabel}</label>
            <span className="font-mono text-xs font-bold text-cyan-400">{protRot > 0 ? "+" : ""}{protRot}°</span>
          </div>
          <input
            type="range" min={-80} max={80} step={1} value={protRot}
            onChange={e => setProtRot(+e.target.value)}
            className="w-full h-2 rounded-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/25 font-body">
            <span>{ui.tiltLeft}</span>
            <span>{ui.tiltCenter}</span>
            <span>{ui.tiltRight}</span>
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
            {modeTitle}
          </p>

          <div className="bg-slate-900/60 rounded p-2 space-y-1 font-mono text-xs">
            {mode === "pelurus" && (
              <>
                <p className="text-yellow-400">α = {α}°</p>
                <p className="text-purple-400">{ui.betaPelurus} = 180° − {α}° = {180 - α}°</p>
                <p className="text-green-400">✓ α + β = {α}° + {180 - α}° = 180°</p>
              </>
            )}
            {mode === "penyiku" && (
              <>
                <p className="text-yellow-400">α = {α}°</p>
                <p className="text-purple-400">{ui.betaPenyiku} = 90° − {α}° = {90 - α}°</p>
                <p className="text-green-400">✓ α + β = {α}° + {90 - α}° = 90°</p>
              </>
            )}
            {mode === "bertolak" && (
              <>
                <p className="text-yellow-400">∠1 = ∠3 = {α}° {ui.bertolakLabel}</p>
                <p className="text-purple-400">∠2 = ∠4 = {180 - α}° {ui.bertolakLabel}</p>
                <p className="text-green-400">✓ ∠1 + ∠2 = {α}° + {180 - α}° = 180° {ui.bertolakPelurus}</p>
              </>
            )}
          </div>

          <p className="font-body text-xs text-white/50 leading-relaxed">
            {mode === "pelurus"
              ? ui.tipPelurus(complement, α)
              : mode === "penyiku"
              ? ui.tipPenyiku
              : ui.tipBertolak
            }
          </p>
        </div>

        {/* How to use */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3">
          <p className="font-body text-xs font-semibold text-slate-300 mb-1.5">{ui.howToTitle}</p>
          <div className="space-y-1 font-body text-xs text-white/50 leading-relaxed">
            <p>① <strong className="text-white/70">{ui.howTo1a}</strong> {ui.howTo1b}</p>
            <p>② <strong className="text-white/70">{ui.howTo2a}</strong> {ui.howTo2b}</p>
            <p>③ <strong className="text-white/70">{ui.howTo3a}</strong> {ui.howTo3b}</p>
            <p>④ {ui.howTo4}</p>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={resetProt}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/50 hover:text-white text-xs font-body cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {ui.resetBtn}
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
