import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const R = 92;
const SVG_W = 400;
const SVG_H = 270;
const VX = 200;
const VY = 232;
const RAY_LEN = R + 22;

const PRESETS = [30, 45, 60, 90, 120, 135, 150, 180];

const ANGLE_NAMES: Record<number, string> = {
  30:  "Sudut lancip (30°)",
  45:  "Sudut lancip (45°)",
  60:  "Sudut lancip (60°)",
  90:  "Sudut siku-siku (90°)",
  120: "Sudut tumpul (120°)",
  135: "Sudut tumpul (135°)",
  150: "Sudut tumpul (150°)",
  180: "Sudut lurus (180°)",
};

const deg2rad = (d: number) => (d * Math.PI) / 180;

const arcPt = (deg: number, r = R) => ({
  x: VX + r * Math.cos(deg2rad(deg)),
  y: VY - r * Math.sin(deg2rad(deg)),
});

function ProtractorFace() {
  const ticks: { d: number; ox: number; oy: number; ix: number; iy: number; major: boolean; mid: boolean }[] = [];
  for (let d = 0; d <= 180; d += 1) {
    const major = d % 10 === 0;
    const mid   = d % 5 === 0;
    const outer = arcPt(d, R);
    const innerR = major ? R - 18 : mid ? R - 10 : R - 5;
    const inner = arcPt(d, innerR);
    ticks.push({ d, ox: outer.x, oy: outer.y, ix: inner.x, iy: inner.y, major, mid });
  }

  return (
    <>
      {/* Semicircle fill */}
      <path
        d={`M ${VX - R},${VY} L ${VX + R},${VY} A ${R},${R} 0 0,1 ${VX - R},${VY} Z`}
        fill="rgba(34,211,238,0.055)"
        stroke="none"
      />
      {/* Inner decorative arc */}
      <path
        d={`M ${VX + R - 20},${VY} A ${R - 20},${R - 20} 0 0,1 ${VX - R + 20},${VY}`}
        fill="none"
        stroke="rgba(34,211,238,0.12)"
        strokeWidth="1"
      />
      {/* Outer arc */}
      <path
        d={`M ${VX + R},${VY} A ${R},${R} 0 0,1 ${VX - R},${VY}`}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.2"
      />
      {/* Baseline */}
      <line x1={VX - R - 20} y1={VY} x2={VX + R + 20} y2={VY} stroke="#22d3ee" strokeWidth="2" />

      {/* Tick marks */}
      {ticks.map(({ d, ox, oy, ix, iy, major, mid }) => (
        <line
          key={d}
          x1={ox} y1={oy} x2={ix} y2={iy}
          stroke={major ? "#7dd3fc" : mid ? "#1e3a4a" : "#111827"}
          strokeWidth={major ? 1.6 : 0.8}
        />
      ))}

      {/* Degree labels every 10° */}
      {[0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map(d => {
        const lp = arcPt(d, R - 29);
        return (
          <text
            key={d}
            x={lp.x} y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={d === 0 || d === 180 ? 7 : 6.5}
            fill="#374151"
            fontFamily="monospace"
          >
            {d}
          </text>
        );
      })}

      {/* Center notch */}
      <rect x={VX - 4} y={VY - 4} width={8} height={8} rx={2} fill="#0f172a" />
      <circle cx={VX} cy={VY} r={2.5} fill="#facc15" />

      {/* 0° / 180° end labels */}
      <text x={VX + R + 8} y={VY + 4} fontSize="8.5" fill="#22d3ee" fontFamily="monospace">0°</text>
      <text x={VX - R - 8} y={VY + 4} fontSize="8.5" fill="#22d3ee" fontFamily="monospace" textAnchor="end">180°</text>
    </>
  );
}

export default function JangkaAnimasi() {
  const [targetAngle, setTargetAngle] = useState(60);
  const [current, setCurrent]         = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [speed, setSpeed]             = useState(1.2);
  const [done, setDone]               = useState(false);

  const rafRef     = useRef<number | null>(null);
  const currentRef = useRef(0);
  const targetRef  = useRef(targetAngle);
  const speedRef   = useRef(speed);

  useEffect(() => { targetRef.current = targetAngle; }, [targetAngle]);
  useEffect(() => { speedRef.current  = speed; },       [speed]);

  const stopAnim = useCallback(() => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setIsPlaying(false);
  }, []);

  const startAnim = useCallback((from = 0) => {
    stopAnim();
    currentRef.current = from;
    setCurrent(from);
    setDone(false);
    setIsPlaying(true);

    const tick = () => {
      currentRef.current = Math.min(currentRef.current + speedRef.current, targetRef.current);
      setCurrent(Math.round(currentRef.current));
      if (currentRef.current < targetRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
        setDone(true);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAnim]);

  useEffect(() => {
    const t = setTimeout(() => startAnim(0), 600);
    return () => { clearTimeout(t); stopAnim(); };
  }, []);

  const handlePreset = (a: number) => {
    stopAnim();
    setTargetAngle(a);
    setCurrent(0);
    currentRef.current = 0;
    setDone(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAnim();
    } else {
      if (done) {
        startAnim(0);
      } else {
        startAnim(currentRef.current);
      }
    }
  };

  const handleReset = () => { stopAnim(); setCurrent(0); currentRef.current = 0; setDone(false); };

  const arm     = arcPt(current);
  const armRay  = { x: VX + RAY_LEN * Math.cos(deg2rad(current)), y: VY - RAY_LEN * Math.sin(deg2rad(current)) };
  const labelPt = arcPt(Math.max(current / 2, 1), R * 0.54);
  const large   = current > 180 ? 1 : 0;

  const sectorD = current > 0
    ? `M ${VX},${VY} L ${VX + R},${VY} A ${R},${R} 0 ${large},1 ${arm.x},${arm.y} Z`
    : "";

  const arcHighD = current > 0
    ? `M ${VX + R},${VY} A ${R},${R} 0 ${large},1 ${arm.x},${arm.y}`
    : "";

  const sectorColor =
    current <= 90  ? "rgba(250,204,21,0.16)"  :
    current <= 180 ? "rgba(251,146,60,0.16)"  :
                     "rgba(167,139,250,0.16)";

  const armColor =
    current <= 90  ? "#facc15" :
    current <= 180 ? "#fb923c" :
                     "#a78bfa";

  const angleType =
    current === 0   ? "" :
    current < 90    ? "lancip" :
    current === 90  ? "siku-siku" :
    current < 180   ? "tumpul" :
    current === 180 ? "lurus" : "";

  return (
    <div className="rounded-xl border border-yellow-500/30 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3 flex items-center gap-2">
        <span className="text-lg">🧭</span>
        <span className="font-body font-semibold text-yellow-300 text-sm">
          Jangka Busur — Animasi Pengukuran Sudut
        </span>
      </div>

      <div className="p-4 space-y-3">

        {/* Preset angle buttons */}
        <div>
          <p className="font-body text-xs font-semibold text-white/55 mb-2">📐 Pilih Sudut yang Ingin Diukur:</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(a => (
              <button
                key={a}
                onClick={() => handlePreset(a)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono font-bold cursor-pointer transition-all ${
                  targetAngle === a
                    ? "bg-yellow-500/35 text-yellow-200 border border-yellow-400/50 shadow"
                    : "bg-slate-700/60 text-white/45 hover:text-white hover:bg-slate-600/60"
                }`}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-700/50 overflow-hidden select-none">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
            <defs>
              <pattern id="jgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0L0 0 0 20" fill="none" stroke="#0a0f1a" strokeWidth="0.8" />
              </pattern>
              <marker id="jArC" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" />
              </marker>
              <marker id="jArCL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse">
                <path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" />
              </marker>
            </defs>

            <rect width={SVG_W} height={SVG_H} fill="url(#jgrid)" />

            {/* Static protractor face */}
            <ProtractorFace />

            {/* Animated sector fill */}
            {current > 0 && (
              <path d={sectorD} fill={sectorColor} stroke="none" />
            )}

            {/* Highlighted arc */}
            {current > 0 && (
              <path
                d={arcHighD}
                fill="none"
                stroke={armColor}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            )}

            {/* Base ray (0° direction) */}
            <line
              x1={VX} y1={VY}
              x2={VX + RAY_LEN} y2={VY}
              stroke="#22d3ee"
              strokeWidth="2.2"
              markerEnd="url(#jArC)"
            />

            {/* Animated arm */}
            {current > 0 && (
              <line
                x1={VX} y1={VY}
                x2={armRay.x} y2={armRay.y}
                stroke={armColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                markerEnd="url(#jArC)"
              />
            )}

            {/* Arm tip dot (when done) */}
            {done && (
              <circle cx={arm.x} cy={arm.y} r={5} fill={armColor} stroke="#0f172a" strokeWidth={1.5} />
            )}

            {/* Live angle readout bubble */}
            {current > 4 && (
              <g transform={`translate(${labelPt.x},${labelPt.y})`}>
                <rect
                  x={-24} y={-11}
                  width={48} height={22}
                  rx={6}
                  fill="rgba(10,15,26,0.92)"
                  stroke={armColor}
                  strokeWidth={1.2}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fill={armColor}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {current}°
                </text>
              </g>
            )}

            {/* Target dashed line (ghost) */}
            {!done && targetAngle > 0 && (
              <line
                x1={VX} y1={VY}
                x2={VX + RAY_LEN * Math.cos(deg2rad(targetAngle))}
                y2={VY - RAY_LEN * Math.sin(deg2rad(targetAngle))}
                stroke="rgba(250,204,21,0.2)"
                strokeWidth="1.5"
                strokeDasharray="5,4"
              />
            )}

            {/* Vertex O label */}
            <text x={VX} y={VY + 17} textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">O</text>

            {/* Done badge */}
            {done && (
              <g transform={`translate(${SVG_W - 10},12)`}>
                <rect x={-82} y={-9} width={82} height={18} rx={5} fill="rgba(21,128,61,0.5)" stroke="#4ade80" strokeWidth={0.8} />
                <text textAnchor="middle" dominantBaseline="middle" x={-41} fontSize="9" fill="#4ade80" fontFamily="sans-serif" fontWeight="bold">
                  ✓ {ANGLE_NAMES[targetAngle] ?? `${targetAngle}°`}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Play / Reset controls */}
        <div className="flex gap-2">
          <button
            onClick={handlePlayPause}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-body font-semibold cursor-pointer transition-all ${
              isPlaying
                ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
                : "bg-yellow-500/30 hover:bg-yellow-500/45 text-yellow-200"
            }`}
          >
            {isPlaying
              ? <><Pause className="w-3.5 h-3.5" /> Pause</>
              : <><Play  className="w-3.5 h-3.5" /> {done ? "Ulangi" : `Ukur ${targetAngle}°`}</>
            }
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/50 hover:text-white text-xs font-body cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed control */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="font-body text-xs text-white/50">⚡ Kecepatan Animasi</label>
            <span className="font-mono text-xs text-cyan-400">
              {speed <= 0.6 ? "Lambat" : speed <= 1.5 ? "Normal" : "Cepat"}
            </span>
          </div>
          <div className="flex gap-1.5">
            {([0.5, 1.2, 2.5] as const).map((s, i) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`flex-1 py-1 text-xs rounded font-body cursor-pointer transition-all ${
                  speed === s ? "bg-cyan-600/50 text-cyan-200" : "bg-slate-700/40 text-white/40 hover:text-white/70"
                }`}
              >
                {["🐢 Lambat", "⚡ Normal", "🚀 Cepat"][i]}
              </button>
            ))}
          </div>
        </div>

        {/* Angle type label */}
        {done && (
          <div className={`rounded-lg px-3 py-2 text-xs font-body flex items-center gap-2 border ${
            targetAngle < 90  ? "bg-yellow-500/10 border-yellow-500/25 text-yellow-200" :
            targetAngle === 90 ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-200" :
            targetAngle < 180 ? "bg-orange-500/10 border-orange-500/25 text-orange-200" :
                                 "bg-purple-500/10 border-purple-500/25 text-purple-200"
          }`}>
            <span className="text-base">
              {targetAngle < 90 ? "🔺" : targetAngle === 90 ? "📐" : targetAngle < 180 ? "📏" : "↔️"}
            </span>
            <div>
              <p className="font-semibold">
                {targetAngle < 90  ? `Sudut Lancip — ${targetAngle}° (0° < α < 90°)` :
                 targetAngle === 90 ? "Sudut Siku-Siku — 90° tepat" :
                 targetAngle < 180 ? `Sudut Tumpul — ${targetAngle}° (90° < α < 180°)` :
                                     "Sudut Lurus — 180° (garis lurus)"}
              </p>
              <p className="text-white/45 mt-0.5">
                {targetAngle < 90  ? "Lebih kecil dari sudut siku-siku." :
                 targetAngle === 90 ? "Membentuk huruf L sempurna." :
                 targetAngle < 180 ? "Lebih besar dari siku-siku, lebih kecil dari lurus." :
                                     "Dua sinar membentuk satu garis lurus."}
              </p>
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3 text-xs font-body text-white/50 space-y-1 leading-relaxed">
          <p>① Tekan <strong className="text-white/70">tombol sudut</strong> di atas untuk memilih besar sudut yang diukur.</p>
          <p>② Tekan <strong className="text-yellow-300">▶ Ukur</strong> untuk melihat jangka bergerak mengukur sudut tersebut.</p>
          <p>③ Dalam praktik: letakkan <strong className="text-white/70">titik pusat busur di titik sudut</strong>, luruskan garis dasar dengan sisi pertama, lalu baca skala di mana sisi kedua memotong busur.</p>
        </div>
      </div>
    </div>
  );
}
