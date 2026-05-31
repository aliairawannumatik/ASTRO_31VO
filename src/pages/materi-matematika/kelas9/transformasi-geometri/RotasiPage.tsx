import { useState, useRef, useEffect } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

/* ── SVG grid helpers ── */
const S = 360, sc = S / 14, ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;
const ticks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
const DEG = Math.PI / 180;

function Grid({ children, accent = "#fb923c" }: { children?: React.ReactNode; accent?: string }) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full rounded-xl border bg-slate-900/70" style={{ maxWidth: S, aspectRatio: "1 / 1", borderColor: `${accent}33` }}>
      {ticks.map(t => (
        <g key={t}>
          <line x1={px(t)} y1={0} x2={px(t)} y2={S} stroke="#334155" strokeWidth="0.6" />
          <line x1={0} y1={py(t)} x2={S} y2={py(t)} stroke="#334155" strokeWidth="0.6" />
        </g>
      ))}
      <line x1={0} y1={oy} x2={S} y2={oy} stroke="#64748b" strokeWidth="1.4" />
      <line x1={ox} y1={0} x2={ox} y2={S} stroke="#64748b" strokeWidth="1.4" />
      <polygon points={`${S},${oy} ${S - 7},${oy - 4} ${S - 7},${oy + 4}`} fill="#64748b" />
      <polygon points={`${ox},0 ${ox - 4},8 ${ox + 4},8`} fill="#64748b" />
      {ticks.map(t => (
        <g key={t}>
          <text x={px(t)} y={oy + 13} textAnchor="middle" fill="#64748b" fontSize="9">{t}</text>
          <text x={ox - 10} y={py(t) + 4} textAnchor="middle" fill="#64748b" fontSize="9">{t}</text>
        </g>
      ))}
      <text x={S - 6} y={oy - 5} fill="#94a3b8" fontSize="10">x</text>
      <text x={ox + 5} y={10} fill="#94a3b8" fontSize="10">y</text>
      {children}
    </svg>
  );
}

function Poly({ pts, color, fill, label }: { pts: [number, number][]; color: string; fill: string; label?: string }) {
  const d = pts.map(([x, y]) => `${px(x)},${py(y)}`).join(" ");
  const cx_ = pts.reduce((s, [x]) => s + x, 0) / pts.length;
  const cy_ = pts.reduce((s, [, y]) => s + y, 0) / pts.length;
  return (
    <g>
      <polygon points={d} fill={fill} stroke={color} strokeWidth="2" />
      {label && <text x={px(cx_)} y={py(cy_) + 4} textAnchor="middle" fill={color} fontSize="11" fontWeight="bold">{label}</text>}
    </g>
  );
}

function Dot({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={5} fill={color} />
      <text x={px(x) + 7} y={py(y) - 5} fill={color} fontSize="10" fontWeight="bold">{label}</text>
    </g>
  );
}

/* Center crosshair — titik pusat rotasi yang jelas */
function CenterMark({ x, y, color }: { x: number; y: number; color: string }) {
  const cx = px(x), cy = py(y);
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3,2" opacity="0.5" />
      <circle cx={cx} cy={cy} r={6} fill={color} opacity="0.9" />
      <line x1={cx - 18} y1={cy} x2={cx + 18} y2={cy} stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} stroke={color} strokeWidth="1.5" opacity="0.7" />
    </g>
  );
}

/* Garis dari pusat ke titik (jari-jari rotasi) */
function RadiusLine({ cx, cy, tx, ty, color, dashed }: { cx: number; cy: number; tx: number; ty: number; color: string; dashed?: boolean }) {
  return (
    <line
      x1={px(cx)} y1={py(cy)}
      x2={px(tx)} y2={py(ty)}
      stroke={color}
      strokeWidth={dashed ? 1.2 : 2}
      strokeDasharray={dashed ? "5,4" : "none"}
      opacity={dashed ? 0.45 : 0.85}
    />
  );
}

function ArcArrow({ cx: acx, cy: acy, r, aStart, aEnd, color }: { cx: number; cy: number; r: number; aStart: number; aEnd: number; color: string }) {
  const x1 = px(acx) + r * Math.cos(aStart * DEG);
  const y1 = py(acy) - r * Math.sin(aStart * DEG);
  const x2 = px(acx) + r * Math.cos(aEnd * DEG);
  const y2 = py(acy) - r * Math.sin(aEnd * DEG);
  const large = Math.abs(aEnd - aStart) > 180 ? 1 : 0;
  const sweep = aEnd > aStart ? 0 : 1;
  return (
    <g>
      <path d={`M${x1},${y1} A${r},${r},0,${large},${sweep},${x2},${y2}`} fill="none" stroke={color} strokeWidth="2" strokeDasharray="5,3" />
      <circle cx={x2} cy={y2} r={3} fill={color} />
    </g>
  );
}

function rotatePtAround(x: number, y: number, a: number, b: number, deg: number): [number, number] {
  const r = deg * DEG;
  const tx = x - a, ty = y - b;
  return [
    a + tx * Math.cos(r) - ty * Math.sin(r),
    b + tx * Math.sin(r) + ty * Math.cos(r),
  ];
}

/* ── Animasi Interaktif Rotasi TITIK ── */
const TITIK_ANIM_DURATION = 1800;

function AnimasiRotasiTitik() {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [dir, setDir] = useState<"ccw" | "cw">("ccw");
  const [centerType, setCenterType] = useState<"origin" | "custom">("origin");
  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");
  const [inputPx, setInputPx] = useState("3");
  const [inputPy, setInputPy] = useState("2");
  const [show, setShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animAngle, setAnimAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  const ca = centerType === "origin" ? 0 : parseFloat(inputA) || 0;
  const cb = centerType === "origin" ? 0 : parseFloat(inputB) || 0;
  const ptX = parseFloat(inputPx) || 3;
  const ptY = parseFloat(inputPy) || 2;
  const actualDeg = dir === "ccw" ? angle : -angle;

  const displayAngle = isAnimating ? animAngle : (show ? actualDeg : 0);
  const [curX, curY] = rotatePtAround(ptX, ptY, ca, cb, displayAngle);
  const [resX, resY] = rotatePtAround(ptX, ptY, ca, cb, actualDeg);
  const showResult = show || isAnimating;

  const dirLabel = dir === "ccw" ? "berlawanan arah jarum jam" : "searah jarum jam";
  const accentColor = dir === "ccw" ? "#22d3ee" : "#fb923c";
  const resultColor = dir === "ccw" ? "#f472b6" : "#fb923c";

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  const reset = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(false); setAnimAngle(0);
  };

  const handlePutar = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(true); setAnimAngle(0);
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / TITIK_ANIM_DURATION, 1);
      setAnimAngle(easeOut(t) * actualDeg);
      if (t < 1) { rafRef.current = requestAnimationFrame(animate); }
      else { setAnimAngle(actualDeg); setIsAnimating(false); setShow(true); }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const changeAndReset = (fn: () => void) => { fn(); if (rafRef.current) cancelAnimationFrame(rafRef.current); setShow(false); setIsAnimating(false); setAnimAngle(0); };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  /* jari-jari dari pusat ke titik P */
  const dx = ptX - ca, dy = ptY - cb;
  const radius = Math.sqrt(dx * dx + dy * dy);
  const radiusSvg = radius * sc;

  /* sudut awal P terhadap pusat (dalam derajat, sistem koordinat layar) */
  const startAngleDeg = Math.atan2(-(ptY - cb), ptX - ca) * (180 / Math.PI);

  /* arc jejak rotasi */
  const animatedAngleAbs = Math.abs(displayAngle);
  const arcEndDeg = dir === "ccw"
    ? startAngleDeg - animatedAngleAbs   // CCW = sudut naik di math = turun di screen
    : startAngleDeg + animatedAngleAbs;

  function svgArc(cx: number, cy: number, r: number, a1deg: number, a2deg: number) {
    const a1 = a1deg * DEG, a2 = a2deg * DEG;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const diff = ((a2deg - a1deg) % 360 + 360) % 360;
    const large = diff > 180 ? 1 : 0;
    const sweep = 1;
    return `M${x1},${y1} A${r},${r},0,${large},${sweep},${x2},${y2}`;
  }

  const cx_svg = px(ca), cy_svg = py(cb);
  const tracePath = svgArc(cx_svg, cy_svg, radiusSvg, startAngleDeg, arcEndDeg);

  const rx_ = Math.round(resX * 100) / 100;
  const ry_ = Math.round(resY * 100) / 100;

  return (
    <div className="space-y-4 pt-2">
      <p className="text-violet-300 font-bold text-sm font-body">📍 Animasi Interaktif — Rotasi Titik</p>

      {/* Input titik P */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Titik yang Dirotasi</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold font-body text-violet-300">P =</span>
          <span className="text-sm text-white/60 font-body">(</span>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-white/50 font-body">x =</label>
            <input
              type="number"
              value={inputPx}
              onChange={e => changeAndReset(() => setInputPx(e.target.value))}
              className="w-16 bg-slate-700 border border-violet-500/50 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-violet-400"
            />
          </div>
          <span className="text-white/40">,</span>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-white/50 font-body">y =</label>
            <input
              type="number"
              value={inputPy}
              onChange={e => changeAndReset(() => setInputPy(e.target.value))}
              className="w-16 bg-slate-700 border border-violet-500/50 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-violet-400"
            />
          </div>
          <span className="text-sm text-white/60 font-body">)</span>
        </div>
      </div>

      {/* Pilih sudut */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Sudut Rotasi</p>
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <p className="text-xs font-body text-emerald-400 font-semibold">Berlawanan arah jarum jam</p>
            <div className="flex gap-2 flex-wrap">
              {([90, 180, 270] as const).map(a => (
                <button key={`ccw-${a}`}
                  onClick={() => changeAndReset(() => { setAngle(a); setDir("ccw"); })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${angle === a && dir === "ccw" ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30" : "bg-slate-700/60 border-slate-600 text-white/60 hover:border-emerald-500/50 hover:text-white/90"}`}
                >{a}°</button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-body text-orange-400 font-semibold">Searah jarum jam</p>
            <div className="flex gap-2 flex-wrap">
              {([90, 180, 270] as const).map(a => (
                <button key={`cw-${a}`}
                  onClick={() => changeAndReset(() => { setAngle(a); setDir("cw"); })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${angle === a && dir === "cw" ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30" : "bg-slate-700/60 border-slate-600 text-white/60 hover:border-orange-500/50 hover:text-white/90"}`}
                >{a}°</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pilih pusat */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Pusat Rotasi</p>
        <div className="flex gap-2">
          {(["origin", "custom"] as const).map(c => (
            <button key={c}
              onClick={() => changeAndReset(() => setCenterType(c))}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${centerType === c ? "bg-yellow-500/80 border-yellow-400 text-white shadow-md" : "bg-slate-700/60 border-slate-600 text-white/60 hover:text-white/90"}`}
            >{c === "origin" ? "O(0, 0)" : "Titik (a, b)"}</button>
          ))}
        </div>
        {centerType === "custom" && (
          <div className="flex items-center gap-3 pt-1">
            <label className="text-xs text-white/60 font-body">a =</label>
            <input type="number" value={inputA} onChange={e => changeAndReset(() => setInputA(e.target.value))} className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono" />
            <label className="text-xs text-white/60 font-body">b =</label>
            <input type="number" value={inputB} onChange={e => changeAndReset(() => setInputB(e.target.value))} className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono" />
          </div>
        )}
      </div>

      {/* Grid + panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full overflow-hidden">

        {/* SVG Grid */}
        <div className="w-full max-w-[360px] mx-auto lg:mx-0 flex-shrink-0">
          <Grid accent={accentColor}>

            {/* Lingkaran orbit penuh (ghost) — selalu tampil agar terlihat lintasan */}
            {radiusSvg > 2 && (
              <circle cx={cx_svg} cy={cy_svg} r={radiusSvg}
                fill="none" stroke="#ffffff" strokeWidth="0.8"
                strokeDasharray="4,4" opacity="0.12" />
            )}

            {/* Jejak busur animasi (arc yang sudah dilalui) */}
            {showResult && animatedAngleAbs > 1 && radiusSvg > 2 && (
              <path d={tracePath} fill="none"
                stroke={dir === "ccw" ? "#a78bfa" : "#fb923c"}
                strokeWidth="2.2" strokeDasharray="6,3" opacity="0.7" />
            )}

            {/* Garis jari-jari pusat → P asli */}
            {showResult && (
              <RadiusLine cx={ca} cy={cb} tx={ptX} ty={ptY} color="#22d3ee" dashed />
            )}

            {/* Garis jari-jari pusat → P sekarang (bergerak) */}
            {showResult && (
              <RadiusLine cx={ca} cy={cb} tx={curX} ty={curY} color="#4ade80" dashed />
            )}

            {/* Label sudut — textbox cerah atas tengah */}
            {animatedAngleAbs > 2 && (() => {
              const bx = S / 2, by = 18, bw = 72, bh = 28;
              return (
                <g>
                  <rect x={bx - bw / 2} y={by - bh / 2} width={bw} height={bh} rx={7} ry={7}
                    fill={dir === "ccw" ? "#7c3aed" : "#f97316"} stroke="#fff" strokeWidth="1.5" opacity="0.93" />
                  <text x={bx} y={by + 5} fontSize="15" fill="#fff" textAnchor="middle" fontWeight="bold">
                    {Math.round(animatedAngleAbs)}°
                  </text>
                </g>
              );
            })()}

            {/* Titik P asli */}
            <Dot x={ptX} y={ptY} color="#22d3ee" label={`P(${ptX},${ptY})`} />

            {/* Titik P' (bergerak saat animasi) */}
            {showResult && (
              <g>
                <circle cx={px(curX)} cy={py(curY)} r={7} fill={resultColor} opacity="0.9" />
                <circle cx={px(curX)} cy={py(curY)} r={11} fill="none" stroke={resultColor} strokeWidth="1.5" opacity="0.5" />
                {show && !isAnimating && (
                  <text x={px(curX) + 10} y={py(curY) - 8} fill={resultColor} fontSize="10" fontWeight="bold">
                    P'({rx_},{ry_})
                  </text>
                )}
              </g>
            )}

            {/* Pusat rotasi */}
            <CenterMark x={ca} y={cb} color="#facc15" />
            <text x={px(ca) + 16} y={py(cb) - 14} fill="#facc15" fontSize="11" fontWeight="bold">
              {centerType === "origin" ? "O(0,0)" : `O(${ca},${cb})`}
            </text>

          </Grid>

          {/* Legenda */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center text-xs font-body">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-cyan-400 inline-block" />
              <span className="text-cyan-300">Titik P asli</span>
            </div>
            {showResult && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded bg-green-400 inline-block" />
                  <span className="text-green-400">Jari-jari putar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: resultColor }} />
                  <span style={{ color: resultColor }}>Titik P' bayangan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: dir === "ccw" ? "#a78bfa" : "#fb923c" }} />
                  <span className="text-white/50">Jejak busur</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-yellow-400 inline-block" />
              <span className="text-yellow-300">Pusat rotasi</span>
            </div>
          </div>
        </div>

        {/* Panel kanan */}
        <div className="flex-1 min-w-0 space-y-2 w-full">

          {/* Tombol — di atas info */}
          <div className="flex gap-2">
            <button onClick={handlePutar} disabled={isAnimating}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all ${isAnimating ? "opacity-50 cursor-not-allowed bg-slate-600" : dir === "ccw" ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30" : "bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/30"}`}
            >{isAnimating ? "⏳ Memutar…" : "🔄 Putar!"}</button>
            <button onClick={reset}
              className="px-4 py-2.5 rounded-xl font-bold text-sm font-body bg-slate-700 hover:bg-slate-600 text-white/70 transition-all"
            >Reset</button>
          </div>

          {/* Bingkai info sudut */}
          <div className="bg-slate-700/40 rounded-xl p-3 space-y-1 text-xs font-body">
            <p className="text-yellow-300 font-bold text-sm">{angle}° {dirLabel}</p>
            <p className="text-white/50">Titik: P({ptX}, {ptY})</p>
            <p className="text-white/50">Pusat: {centerType === "origin" ? "O(0, 0)" : `(${ca}, ${cb})`}</p>
            {isAnimating && <p className="text-emerald-400 font-semibold animate-pulse">⏳ Memutar perlahan…</p>}
          </div>

          {/* Hasil */}
          {show && !isAnimating && (
            <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-violet-300 font-body uppercase">Hasil Rotasi Titik:</p>
              <div className="flex items-center gap-2 text-sm font-body flex-wrap">
                <span className="text-cyan-300 font-semibold">P({ptX}, {ptY})</span>
                <span className="text-white/30 text-lg">→</span>
                <span className="font-bold text-base" style={{ color: resultColor }}>P'({rx_}, {ry_})</span>
              </div>
              <p className="text-xs text-white/40 font-body">Jarak ke pusat: <span className="text-white/70">{Math.round(radius * 100) / 100} satuan</span> (tetap sama)</p>
            </div>
          )}

          {/* Petunjuk */}
          <div className="bg-slate-800/50 rounded-xl p-3 text-xs font-body text-white/50 space-y-1.5 w-full overflow-hidden">
            <p className="text-violet-300 font-semibold">💡 Keterangan visual:</p>
            <p>— <span className="text-cyan-400">Titik biru</span> = P asli (tidak bergerak)</p>
            <p>— <span style={{ color: resultColor }}>Titik berwarna</span> = P' bayangan (bergerak saat putar)</p>
            <p>— <span className="text-white/30">Lingkaran putih samar</span> = lintasan orbit titik</p>
            <p>— Jarak titik ke pusat <strong className="text-white">selalu sama</strong> sebelum &amp; sesudah rotasi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Animasi Interaktif Rotasi ── */
const ORIG_PTS: [number, number][] = [[1, 1], [4, 1], [1, 3]];
const ORIG_LABELS = ["A(1,1)", "B(4,1)", "C(1,3)"];
const ANIM_DURATION = 1800; // ms — slow motion

function AnimasiRotasi() {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [dir, setDir] = useState<"ccw" | "cw">("ccw");
  const [centerType, setCenterType] = useState<"origin" | "custom">("origin");
  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");
  const [show, setShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animAngle, setAnimAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  const ca = centerType === "origin" ? 0 : parseFloat(inputA) || 0;
  const cb = centerType === "origin" ? 0 : parseFloat(inputB) || 0;
  const actualDeg = dir === "ccw" ? angle : -angle;

  const displayAngle = isAnimating ? animAngle : (show ? actualDeg : 0);
  const currentPts = ORIG_PTS.map(([x, y]) => rotatePtAround(x, y, ca, cb, displayAngle) as [number, number]);
  const rotated = ORIG_PTS.map(([x, y]) => rotatePtAround(x, y, ca, cb, actualDeg) as [number, number]);
  const showRotated = show || isAnimating;

  const dirLabel = dir === "ccw" ? "berlawanan arah jarum jam" : "searah jarum jam";
  const accentColor = dir === "ccw" ? "#22d3ee" : "#fb923c";
  const resultColor = dir === "ccw" ? "#f472b6" : "#fb923c";

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  const handlePutar = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false);
    setIsAnimating(true);
    setAnimAngle(0);
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / ANIM_DURATION, 1);
      const eased = easeOut(t);
      setAnimAngle(eased * actualDeg);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setAnimAngle(actualDeg);
        setIsAnimating(false);
        setShow(true);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false);
    setIsAnimating(false);
    setAnimAngle(0);
  };

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const arcStart = 30;
  const animatedAngleAbs = Math.abs(displayAngle);
  const arcEnd = dir === "ccw" ? arcStart + animatedAngleAbs : arcStart - animatedAngleAbs;
  const arcR = sc * 2.6;

  return (
    <div className="space-y-4 pt-2">
      <p className="text-cyan-300 font-bold text-sm font-body">🔄 Animasi Interaktif — Rotasi Bangun Datar</p>

      {/* Pilih sudut */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Sudut Rotasi</p>
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <p className="text-xs font-body text-emerald-400 font-semibold">Berlawanan arah jarum jam</p>
            <div className="flex gap-2 flex-wrap">
              {([90, 180, 270] as const).map(a => (
                <button
                  key={`ccw-${a}`}
                  onClick={() => { playPopSound(); setAngle(a); setDir("ccw"); setShow(false); setIsAnimating(false); if (rafRef.current) cancelAnimationFrame(rafRef.current); setAnimAngle(0); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
                    angle === a && dir === "ccw"
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-slate-700/60 border-slate-600 text-white/60 hover:border-emerald-500/50 hover:text-white/90"
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-body text-orange-400 font-semibold">Searah jarum jam</p>
            <div className="flex gap-2 flex-wrap">
              {([90, 180, 270] as const).map(a => (
                <button
                  key={`cw-${a}`}
                  onClick={() => { playPopSound(); setAngle(a); setDir("cw"); setShow(false); setIsAnimating(false); if (rafRef.current) cancelAnimationFrame(rafRef.current); setAnimAngle(0); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
                    angle === a && dir === "cw"
                      ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30"
                      : "bg-slate-700/60 border-slate-600 text-white/60 hover:border-orange-500/50 hover:text-white/90"
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pilih pusat rotasi */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Pusat Rotasi</p>
        <div className="flex gap-2">
          {(["origin", "custom"] as const).map(c => (
            <button
              key={c}
              onClick={() => { playPopSound(); setCenterType(c); setShow(false); setIsAnimating(false); if (rafRef.current) cancelAnimationFrame(rafRef.current); setAnimAngle(0); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold font-body transition-all border ${
                centerType === c
                  ? "bg-yellow-500/80 border-yellow-400 text-white shadow-md"
                  : "bg-slate-700/60 border-slate-600 text-white/60 hover:text-white/90"
              }`}
            >
              {c === "origin" ? "O(0, 0)" : "Titik (a, b)"}
            </button>
          ))}
        </div>
        {centerType === "custom" && (
          <div className="flex items-center gap-3 pt-1">
            <label className="text-xs text-white/60 font-body">a =</label>
            <input
              type="number"
              value={inputA}
              onChange={e => { setInputA(e.target.value); setShow(false); setIsAnimating(false); if (rafRef.current) cancelAnimationFrame(rafRef.current); setAnimAngle(0); }}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono"
            />
            <label className="text-xs text-white/60 font-body">b =</label>
            <input
              type="number"
              value={inputB}
              onChange={e => { setInputB(e.target.value); setShow(false); setIsAnimating(false); if (rafRef.current) cancelAnimationFrame(rafRef.current); setAnimAngle(0); }}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono"
            />
          </div>
        )}
      </div>

      {/* Grid + info */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full overflow-hidden">

        {/* SVG Grid — responsif */}
        <div className="w-full max-w-[360px] mx-auto lg:mx-0 flex-shrink-0">
          <Grid accent={accentColor}>

            {/* Garis jari-jari dari pusat ke titik ASLI (selalu tampil saat animasi/hasil) */}
            {showRotated && ORIG_PTS.map(([x, y], i) => (
              <RadiusLine key={`r-orig-${i}`} cx={ca} cy={cb} tx={x} ty={y} color="#22d3ee" dashed />
            ))}

            {/* Garis jari-jari dari pusat ke titik SEKARANG (bergerak saat animasi) — hijau */}
            {showRotated && currentPts.map(([x, y], i) => (
              <RadiusLine key={`r-curr-${i}`} cx={ca} cy={cb} tx={x} ty={y} color="#4ade80" dashed />
            ))}

            {/* Label sudut rotasi — textbox cerah di pojok atas */}
            {animatedAngleAbs > 2 && (() => {
              const labelText = `${Math.round(animatedAngleAbs)}°`;
              const bx = S / 2, by = 18;
              const bw = 72, bh = 28;
              return (
                <g>
                  <rect
                    x={bx - bw / 2} y={by - bh / 2}
                    width={bw} height={bh}
                    rx={7} ry={7}
                    fill={dir === "ccw" ? "#10b981" : "#f97316"}
                    stroke="#fff"
                    strokeWidth="1.5"
                    opacity="0.93"
                  />
                  <text
                    x={bx}
                    y={by + 5}
                    fontSize="15"
                    fill="#ffffff"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {labelText}
                  </text>
                </g>
              );
            })()}

            {/* Segitiga asli */}
            <Poly pts={ORIG_PTS} color="#22d3ee" fill={showRotated ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.18)"} label="△ABC" />
            {ORIG_PTS.map(([x, y], i) => (
              <Dot key={i} x={x} y={y} color="#22d3ee" label={["A","B","C"][i]} />
            ))}

            {/* Segitiga bayangan (bergerak saat animasi) */}
            {showRotated && (
              <g>
                <Poly
                  pts={currentPts}
                  color={resultColor}
                  fill={isAnimating ? `${resultColor}55` : `${resultColor}30`}
                  label={show && !isAnimating ? "△A'B'C'" : undefined}
                />
                {currentPts.map(([x, y], i) => (
                  <Dot key={i} x={x} y={y} color={resultColor} label={show && !isAnimating ? ["A'","B'","C'"][i] : ""} />
                ))}
              </g>
            )}

            {/* Titik pusat rotasi — paling atas supaya selalu terlihat */}
            <CenterMark x={ca} y={cb} color="#facc15" />
            <text
              x={px(ca) + 16}
              y={py(cb) - 14}
              fill="#facc15"
              fontSize="11"
              fontWeight="bold"
            >
              {centerType === "origin" ? "O(0,0)" : `P(${ca},${cb})`}
            </text>

          </Grid>

          {/* Legenda warna di bawah grid */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center text-xs font-body">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-cyan-400 inline-block" />
              <span className="text-cyan-300">Asli (△ABC)</span>
            </div>
            {showRotated && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block bg-green-400" />
                  <span className="text-green-400">Garis putar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: resultColor }} />
                  <span style={{ color: resultColor }}>Bayangan (△A'B'C')</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-yellow-400 inline-block" />
              <span className="text-yellow-300">Pusat rotasi</span>
            </div>
          </div>
        </div>

        {/* Panel hasil */}
        <div className="flex-1 min-w-0 space-y-2 w-full">

          {/* Tombol Putar & Reset — di atas bingkai info */}
          <div className="flex gap-2">
            <button
              onClick={handlePutar}
              disabled={isAnimating}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all ${
                isAnimating
                  ? "opacity-50 cursor-not-allowed bg-slate-600"
                  : dir === "ccw"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/30"
              }`}
            >
              {isAnimating ? "⏳ Memutar…" : "🔄 Putar!"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl font-bold text-sm font-body bg-slate-700 hover:bg-slate-600 text-white/70 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Bingkai info sudut */}
          <div className="bg-slate-700/40 rounded-xl p-3 space-y-1 text-xs font-body">
            <p className="text-yellow-300 font-bold text-sm">{angle}° {dirLabel}</p>
            <p className="text-white/50">Pusat: {centerType === "origin" ? "O(0, 0)" : `(${ca}, ${cb})`}</p>
            {isAnimating && (
              <p className="text-emerald-400 font-semibold animate-pulse">⏳ Memutar perlahan…</p>
            )}
          </div>

          {show && !isAnimating && (
            <div className="bg-slate-700/40 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-white/60 font-body uppercase">Hasil Rotasi:</p>
              {ORIG_PTS.map(([x, y], i) => {
                const [rx, ry] = rotated[i];
                const rx_ = Math.round(rx * 100) / 100;
                const ry_ = Math.round(ry * 100) / 100;
                return (
                  <div key={i} className="flex items-center gap-2 text-sm font-body">
                    <span className="text-cyan-300 min-w-[68px]">{ORIG_LABELS[i]}</span>
                    <span className="text-white/30">→</span>
                    <span className="font-bold" style={{ color: resultColor }}>
                      ({rx_}, {ry_})
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Petunjuk */}
          <div className="bg-slate-800/50 rounded-xl p-3 text-xs font-body text-white/50 space-y-1.5 w-full overflow-hidden">
            <p className="text-yellow-300 font-semibold">💡 Keterangan visual:</p>
            <p className="break-words">— Garis <span className="text-cyan-400">putus-putus biru</span> = jari-jari ke titik asli</p>
            <p className="break-words">— Garis <span className="text-green-400">putus-putus hijau</span> = jari-jari ke titik bayangan</p>
            <p className="break-words">— <span className="text-yellow-400">✦ kuning</span> = titik pusat rotasi (diam)</p>
            <p className="break-words">— Panjang jari-jari <strong className="text-white">selalu sama</strong> sebelum &amp; sesudah rotasi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Static diagrams (for Contoh sections) ── */
const origPts: [number, number][] = [[2, 0], [4, 0], [3, 2]];

const DiagramR90 = () => {
  const r90 = origPts.map(([x, y]) => rotatePtAround(x, y, 0, 0, 90) as [number, number]);
  return (
    <Grid accent="#22d3ee">
      <Poly pts={origPts} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
      <Poly pts={r90} color="#f472b6" fill="rgba(244,114,182,0.15)" label="△A'B'C'" />
      <ArcArrow cx={0} cy={0} r={58} aStart={0} aEnd={90} color="#facc15" />
      <text x={px(0.6)} y={py(4)} fontSize="10" fill="#fde68a" fontWeight="bold">90°</text>
      <CenterMark x={0} y={0} color="#f97316" />
      <text x={ox + 18} y={oy - 16} fontSize="10" fill="#f97316" fontWeight="bold">O</text>
    </Grid>
  );
};

const DiagramR90CW = () => {
  const r270 = origPts.map(([x, y]) => rotatePtAround(x, y, 0, 0, -90) as [number, number]);
  return (
    <Grid accent="#a78bfa">
      <Poly pts={origPts} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
      <Poly pts={r270} color="#a78bfa" fill="rgba(167,139,250,0.15)" label="△A'B'C'" />
      <ArcArrow cx={0} cy={0} r={58} aStart={0} aEnd={-90} color="#facc15" />
      <text x={px(3.5)} y={py(-3.5)} fontSize="10" fill="#fde68a" fontWeight="bold">90°</text>
      <CenterMark x={0} y={0} color="#f97316" />
      <text x={ox + 18} y={oy - 16} fontSize="10" fill="#f97316" fontWeight="bold">O</text>
    </Grid>
  );
};

const DiagramR180 = () => {
  const r180 = origPts.map(([x, y]) => rotatePtAround(x, y, 0, 0, 180) as [number, number]);
  return (
    <Grid accent="#fb923c">
      <Poly pts={origPts} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
      <Poly pts={r180} color="#fb923c" fill="rgba(251,146,60,0.15)" label="△A'B'C'" />
      <ArcArrow cx={0} cy={0} r={64} aStart={15} aEnd={165} color="#facc15" />
      <text x={px(-0.4)} y={py(5)} fontSize="10" fill="#fde68a" fontWeight="bold">180°</text>
      <CenterMark x={0} y={0} color="#f97316" />
    </Grid>
  );
};

/* ── Page ── */
const RotasiPage = () => {
  const [open, setOpen] = useState<string[]>(["intro", "animasi-titik", "animasi", "rumus", "contoh90", "contoh90cw", "contoh180", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]); };

  const Hdr = ({ id, icon, color, title }: { id: string; icon: React.ReactNode; color: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-orange-400" /> : <ChevronDown className="w-5 h-5 text-orange-400" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <div className="text-4xl text-center mb-3">🔄</div>
        <h1 className="font-display text-xl md:text-2xl font-bold text-orange-400 text-center mb-1">ROTASI (PERPUTARAN)</h1>
        <p className="font-display text-sm font-semibold text-orange-300 text-center mb-1">Memutar Bangun di Sekitar Titik Pusat!</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Transformasi Geometri · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" title="🌟 Apa Itu Rotasi?" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-orange-300">Rotasi</strong> adalah transformasi yang memutar setiap titik sebesar sudut tertentu terhadap sebuah <strong className="text-yellow-300">titik pusat</strong>. Bentuk dan ukuran bangun <strong className="text-white">tidak berubah</strong>, hanya posisi dan orientasinya yang bergeser sesuai sudut putaran.
                </p>
                <div>
                  <img
                    src="/tata-surya-rotasi.jpg"
                    alt="Planet-planet mengelilingi matahari — ilustrasi rotasi pada pusat tertentu"
                    className="w-full rounded-xl object-cover"
                  />
                  <p className="text-[10px] text-white/30 text-right mt-1 font-body">gemini.google.com/app</p>
                </div>
                <div>
                  <img
                    src="/pontiac-rotasi.png"
                    alt="Ban roda mobil Pontiac GTO yang berputar — ilustrasi konsep rotasi"
                    className="w-full rounded-xl object-cover"
                  />
                  <a
                    href="https://www.blackxperience.com/blackauto/autonews/pontiac-gto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-400/50 hover:text-cyan-300 text-right mt-1 font-body block transition-colors"
                  >
                    https://www.blackxperience.com/blackauto/autonews/pontiac-gto
                  </a>
                </div>
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4 space-y-3">
                  <p className="text-orange-300 font-body text-sm font-bold">🔄 Rotasi di Alam & Kehidupan Sehari-hari</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 bg-slate-900/50 rounded-lg px-3 py-2.5">
                      <span className="text-lg shrink-0 mt-0.5">🌍</span>
                      <div>
                        <p className="text-xs font-bold text-yellow-300 font-body">Planet Mengelilingi Matahari</p>
                        <p className="text-xs text-white/60 font-body mt-0.5">Setiap planet bergerak mengelilingi <strong className="text-white">matahari sebagai titik pusat rotasi</strong>. Jarak planet ke matahari relatif tetap, dan seluruh pergerakannya membentuk lintasan melingkar — sebuah rotasi penuh dengan sudut 360°. Matahari adalah "titik O" yang diam, sementara planet adalah titik yang berputar di sekelilingnya.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-900/50 rounded-lg px-3 py-2.5">
                      <span className="text-lg shrink-0 mt-0.5">🚗</span>
                      <div>
                        <p className="text-xs font-bold text-yellow-300 font-body">Ban Roda Kendaraan</p>
                        <p className="text-xs text-white/60 font-body mt-0.5">Setiap titik pada tepi ban bergerak mengelilingi <strong className="text-white">sumbu roda sebagai titik pusat</strong> yang diam. Jarak setiap titik ke pusat selalu tetap, dan sudut putarannya terus bertambah seiring pergerakan kendaraan. Bentuk dan ukuran ban pun tidak berubah — hanya posisi tiap titiknya yang berputar.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-950/50 border border-orange-500/20 rounded-lg px-4 py-2.5">
                    <p className="text-orange-200 text-xs font-body leading-relaxed">
                      💡 Keduanya membuktikan konsep inti rotasi: <strong>ada titik pusat yang diam</strong>, <strong>jarak ke pusat selalu tetap</strong>, dan <strong>benda bergerak membentuk lintasan melingkar</strong> sesuai sudut rotasi — persis seperti rumus transformasi rotasi dalam matematika!
                    </p>
                  </div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <p className="text-orange-300 font-body text-sm font-semibold mb-2">🔑 Dua hal yang menentukan rotasi:</p>
                  <ul className="space-y-2 text-sm text-white/80 font-body">
                    <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">1.</span><div><strong className="text-white">Titik pusat rotasi</strong> — titik yang diam (tidak bergerak), biasanya O(0,0) atau titik lain (a, b)</div></li>
                    <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">2.</span><div><strong className="text-white">Sudut rotasi (θ)</strong> — besar putaran; <span className="text-emerald-300">berlawanan arah jarum jam</span> atau <span className="text-orange-300">searah jarum jam</span></div></li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[["✅ Bentuk", "Tetap sama"], ["✅ Ukuran", "Tetap sama"], ["⚠️ Orientasi", "Berubah sesuai θ"], ["✅ Jarak ke pusat", "Tetap sama"]].map(([k, v]) => (
                    <div key={k} className="bg-slate-800/60 rounded-lg p-3 text-center">
                      <p className="text-xs font-semibold text-white/60 font-body">{k}</p>
                      <p className="text-sm font-bold text-white font-body">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF — ROTASI TITIK */}
          <div className="bg-card/80 backdrop-blur border border-violet-500/20 rounded-xl overflow-hidden">
            <Hdr id="animasi-titik" icon={<span>📍</span>} color="#a78bfa" title="Animasi Interaktif — Rotasi Titik" />
            {open.includes("animasi-titik") && (
              <div className="px-5 pb-5">
                <AnimasiRotasiTitik />
              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF — ROTASI BANGUN DATAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="animasi" icon={<span>🎮</span>} color="#34d399" title="Animasi Interaktif — Rotasi Bangun Datar" />
            {open.includes("animasi") && (
              <div className="px-5 pb-5">
                <AnimasiRotasi />
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="rumus" icon={<span>📐</span>} color="#22d3ee" title="📐 Rumus Rotasi terhadap O(0,0)" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-3">
                <p className="text-sm text-white/70 font-body">Rumus bayangan titik <InlineMath math="(x, y)" /> setelah dirotasikan terhadap titik asal O(0,0):</p>
                {[
                  { label: "90° berlawanan arah jarum jam", rumus: "(x, y) → (−y, x)", color: "#22d3ee" },
                  { label: "90° searah jarum jam", rumus: "(x, y) → (y, −x)", color: "#a78bfa" },
                  { label: "180° (berlawanan maupun searah)", rumus: "(x, y) → (−x, −y)", color: "#fb923c" },
                  { label: "270° berlawanan arah jarum jam  (= 90° searah)", rumus: "(x, y) → (y, −x)", color: "#4ade80" },
                  { label: "270° searah jarum jam  (= 90° berlawanan)", rumus: "(x, y) → (−y, x)", color: "#f472b6" },
                ].map(({ label, rumus, color }) => (
                  <div key={label} className="bg-slate-800/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-xs font-bold font-body" style={{ color }}>{label}</p>
                    <p className="text-sm font-mono text-yellow-200">{rumus}</p>
                  </div>
                ))}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                  <p className="text-xs text-white/60 font-body">
                    💡 <strong className="text-orange-300">Catatan:</strong> Rotasi terhadap pusat <InlineMath math="(a, b)" />: geser titik dengan <InlineMath math="(x-a,\; y-b)" />, terapkan rumus, lalu geser balik dengan <InlineMath math="(+a,\; +b)" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1: 90° berlawanan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh90" icon={<BookOpen className="w-5 h-5" />} color="#22d3ee" title="📌 Contoh 1: Rotasi 90° Berlawanan Arah Jarum Jam" />
            {open.includes("contoh90") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-cyan-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(2,0), B(4,0), C(3,2)" /> yang dirotasikan 90° berlawanan arah jarum jam terhadap O(0,0)!</p>
                </div>
                <div className="flex justify-center"><DiagramR90 /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-cyan-300 font-body">Penyelesaian: <span className="font-mono text-yellow-200">(x, y) → (−y, x)</span></p>
                  {[
                    { dari: "A(2, 0)", ke: "A′(0, 2)" },
                    { dari: "B(4, 0)", ke: "B′(0, 4)" },
                    { dari: "C(3, 2)", ke: "C′(−2, 3)" },
                  ].map(({ dari, ke }) => (
                    <div key={dari} className="flex items-center gap-3 text-sm font-body">
                      <span className="text-cyan-300 min-w-[80px]">{dari}</span>
                      <span className="text-white/40">→</span>
                      <span className="text-pink-300 font-bold">{ke}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2: 90° searah */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh90cw" icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title="📌 Contoh 2: Rotasi 90° Searah Jarum Jam" />
            {open.includes("contoh90cw") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(2,0), B(4,0), C(3,2)" /> yang dirotasikan 90° searah jarum jam terhadap O(0,0)!</p>
                </div>
                <div className="flex justify-center"><DiagramR90CW /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-violet-300 font-body">Penyelesaian: <span className="font-mono text-yellow-200">(x, y) → (y, −x)</span></p>
                  {[
                    { dari: "A(2, 0)", ke: "A′(0, −2)" },
                    { dari: "B(4, 0)", ke: "B′(0, −4)" },
                    { dari: "C(3, 2)", ke: "C′(2, −3)" },
                  ].map(({ dari, ke }) => (
                    <div key={dari} className="flex items-center gap-3 text-sm font-body">
                      <span className="text-violet-300 min-w-[80px]">{dari}</span>
                      <span className="text-white/40">→</span>
                      <span className="text-orange-300 font-bold">{ke}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3: 180° */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh180" icon={<BookOpen className="w-5 h-5" />} color="#fb923c" title="📌 Contoh 3: Rotasi 180°" />
            {open.includes("contoh180") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-orange-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(2,0), B(4,0), C(3,2)" /> yang dirotasikan 180° terhadap O(0,0)!</p>
                </div>
                <div className="flex justify-center"><DiagramR180 /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-orange-300 font-body">Penyelesaian: <span className="font-mono text-yellow-200">(x, y) → (−x, −y)</span></p>
                  {[
                    { dari: "A(2, 0)", ke: "A′(−2, 0)" },
                    { dari: "B(4, 0)", ke: "B′(−4, 0)" },
                    { dari: "C(3, 2)", ke: "C′(−3, −2)" },
                  ].map(({ dari, ke }) => (
                    <div key={dari} className="flex items-center gap-3 text-sm font-body">
                      <span className="text-cyan-300 min-w-[80px]">{dari}</span>
                      <span className="text-white/40">→</span>
                      <span className="text-orange-300 font-bold">{ke}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="rangkuman" icon={<Target className="w-5 h-5" />} color="#f97316" title="🎯 Rangkuman" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                {[
                  ["Definisi", "Memutar setiap titik sebesar θ terhadap titik pusat"],
                  ["90° berlawanan arah jarum jam", "(x, y) → (−y, x)"],
                  ["90° searah jarum jam", "(x, y) → (y, −x)"],
                  ["180°", "(x, y) → (−x, −y)"],
                  ["270° berlawanan arah jarum jam", "(x, y) → (y, −x)  [= 90° searah]"],
                  ["270° searah jarum jam", "(x, y) → (−y, x)  [= 90° berlawanan]"],
                  ["Sifat", "Bentuk & ukuran tetap, jarak ke pusat tetap"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-3">
                    <span className="text-orange-400 font-bold font-body text-xs min-w-[140px]">{k}</span>
                    <span className="text-white/70 font-body text-xs">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RotasiPage;
