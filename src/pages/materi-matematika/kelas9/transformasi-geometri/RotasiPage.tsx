import { useState, useRef, useEffect } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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
                    fill={dir === "ccw" ? "#7c3aed" : "#f97316"} stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.93" />
                  <text x={bx} y={by + 5} fontSize="15" fill="var(--icon-color)" textAnchor="middle" fontWeight="bold">
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
                    stroke="var(--icon-stroke)"
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

/* ── Helpers for Kurva Linear section ── */
function parseLinearR(eq: string): { m: number; c: number } | null {
  const s = eq.replace(/\s/g, '').toLowerCase();
  if (!s.startsWith('y=')) return null;
  const rhs = s.slice(2);
  if (!rhs) return null;
  if (/^-?\d+\.?\d*$/.test(rhs)) return { m: 0, c: parseFloat(rhs) };
  const match = rhs.match(/^(-?\d*\.?\d*)x([+-]\d+\.?\d*)?$/);
  if (match) {
    const coef = match[1];
    const m = coef === '' || coef === undefined ? 1 : coef === '-' ? -1 : parseFloat(coef);
    const c = match[2] ? parseFloat(match[2]) : 0;
    if (isNaN(m) || isNaN(c)) return null;
    return { m, c };
  }
  return null;
}

function parseStandardR(eq: string): { m: number; c: number; a: number; b_coef: number; c_val: number } | null {
  const s = eq.replace(/\s/g, '').toLowerCase();
  const eqIdx = s.indexOf('=');
  if (eqIdx === -1) return null;
  const lhs = s.slice(0, eqIdx);
  const rhs = s.slice(eqIdx + 1);
  if (!lhs || !rhs) return null;
  const c_val = parseFloat(rhs);
  if (isNaN(c_val)) return null;
  let a = 0, b_coef = 0;
  const xMatch = lhs.match(/(^|[+-])(\d*\.?\d*)x/);
  const yMatch = lhs.match(/(^|[+-])(\d*\.?\d*)y/);
  if (!xMatch && !yMatch) return null;
  if (xMatch) {
    const sign = xMatch[1] === '-' ? -1 : 1;
    a = sign * (xMatch[2] === '' ? 1 : parseFloat(xMatch[2]));
    if (isNaN(a)) return null;
  }
  if (yMatch) {
    const sign = yMatch[1] === '-' ? -1 : 1;
    b_coef = sign * (yMatch[2] === '' ? 1 : parseFloat(yMatch[2]));
    if (isNaN(b_coef)) return null;
  }
  if (b_coef === 0) return null;
  const m = -a / b_coef;
  const c = c_val / b_coef;
  if (!isFinite(m) || !isFinite(c)) return null;
  return { m, c, a, b_coef, c_val };
}

function fmtLineR(m: number, c: number): string {
  if (m === 0) return `y = ${c}`;
  const ms = m === 1 ? '' : m === -1 ? '-' : `${m}`;
  const cp = c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
  return `y = ${ms}x${cp}`;
}

function fmtStdR(a: number, b: number, c: number): string {
  let res = '';
  if (a !== 0) res += a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
  if (b !== 0) {
    if (res === '') res += b === 1 ? 'y' : b === -1 ? '-y' : `${b}y`;
    else if (b === 1) res += ' + y';
    else if (b === -1) res += ' - y';
    else if (b > 0) res += ` + ${b}y`;
    else res += ` - ${Math.abs(b)}y`;
  }
  res += ` = ${Math.round(c * 10000) / 10000}`;
  return res;
}

function round2(n: number) { return Math.round(n * 100) / 100; }

/* ── Animasi Interaktif Rotasi Kurva Linear ── */
const KURVA_ANIM_DURATION = 1800;

function AnimasiRotasiKurva() {
  const [input, setInput] = useState('y=2x+1');
  const [rotation, setRotation] = useState<'90ccw' | '270cw' | '270ccw' | '90cw' | '180ccw' | '180cw'>('90ccw');
  const [centerType, setCenterType] = useState<'origin' | 'custom'>('origin');
  const [inputA, setInputA] = useState('0');
  const [inputB, setInputB] = useState('0');
  const [show, setShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animAngle, setAnimAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  const ca = centerType === 'origin' ? 0 : (parseFloat(inputA) || 0);
  const cb = centerType === 'origin' ? 0 : (parseFloat(inputB) || 0);

  /* Auto-detect format: coba y=mx+c dulu, lalu ax+by=c */
  const parsedSlope = parseLinearR(input);
  const parsedStd   = parsedSlope ? null : parseStandardR(input);
  const parsed      = parsedSlope ?? parsedStd;
  const isStd       = parsedStd !== null && parsedSlope === null;
  const isValid     = parsed !== null;

  const m = parsed?.m ?? 0;
  const c = parsed?.c ?? 0;

  /* Kelompok ekivalen rotasi */
  const isPos90 = rotation === '90ccw' || rotation === '270cw';
  const isNeg90 = rotation === '270ccw' || rotation === '90cw';
  const is180   = rotation === '180ccw' || rotation === '180cw';

  /* Target angle — negatif = searah jarum jam */
  const actualDeg = isPos90 ? 90 : isNeg90 ? -90 : rotation === '180cw' ? -180 : 180;

  /* General rotation of line y=mx+c around (ca,cb) by arbitrary deg — for animation */
  const rotateLineAt = (deg: number): { M: number; C: number } | null => {
    const θ = deg * DEG;
    const cosT = Math.cos(θ), sinT = Math.sin(θ);
    const denom = cosT - m * sinT;
    if (Math.abs(denom) < 0.06) return null; // near-vertical: skip this frame
    const M = (m * cosT + sinT) / denom;
    const C = cb - ca * M + (m * ca + c - cb) / denom;
    if (!isFinite(M) || !isFinite(C) || Math.abs(M) > 200) return null;
    return { M, C };
  };

  /* Final result (exact closed-form formulas, berdasarkan kelas ekivalen) */
  const isVertical = m === 0 && !is180;
  let imgM = 0, imgC = 0, imgVertX = 0;
  if (is180) {
    imgM = m; imgC = round2(2 * cb - 2 * ca * m - c);
  } else if (isPos90) {
    if (m === 0) { imgVertX = round2(ca + cb - c); }
    else { imgM = round2(-1 / m); imgC = round2((ca * (1 - m) + cb * (m + 1) - c) / m); }
  } else {
    if (m === 0) { imgVertX = round2(ca + c - cb); }
    else { imgM = round2(-1 / m); imgC = round2((ca * (1 + m) + cb * (m - 1) + c) / m); }
  }

  const accent =
    rotation === '90ccw'  ? '#a78bfa' :
    rotation === '270cw'  ? '#818cf8' :
    rotation === '270ccw' ? '#fb923c' :
    rotation === '90cw'   ? '#f97316' :
    rotation === '180ccw' ? '#f472b6' : '#ec4899';

  const rotLabel =
    rotation === '90ccw'  ? '90° BAJ' :
    rotation === '270cw'  ? '270° SAJ' :
    rotation === '270ccw' ? '270° BAJ' :
    rotation === '90cw'   ? '90° SAJ' :
    rotation === '180ccw' ? '180° BAJ' : '180° SAJ';
  const centerLabel = centerType === 'origin' ? 'O(0,0)' : `(${ca}, ${cb})`;
  const easeOut     = (t: number) => 1 - Math.pow(1 - t, 3);

  /* Current display angle: 0 at start, animAngle during animation, actualDeg after */
  const displayAngle   = isAnimating ? animAngle : (show ? actualDeg : 0);
  const animAngleAbs   = Math.abs(displayAngle);
  const showingResult  = show || isAnimating;
  const animLine       = showingResult && isValid && !isVertical ? rotateLineAt(displayAngle) : null;

  const handleTampilkan = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(true); setAnimAngle(0);
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / KURVA_ANIM_DURATION, 1);
      setAnimAngle(easeOut(t) * actualDeg);
      if (t < 1) { rafRef.current = requestAnimationFrame(animate); }
      else { setAnimAngle(actualDeg); setIsAnimating(false); setShow(true); }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const changeAndReset = (fn: () => void) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    fn(); setShow(false); setIsAnimating(false); setAnimAngle(0);
  };

  const handleReset = () => {
    playPopSound();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false); setIsAnimating(false); setAnimAngle(0);
    setInput('y=2x+1'); setRotation('90ccw');
    setCenterType('origin'); setInputA('0'); setInputB('0');
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const ROT_OPTS = [
    { val: '90ccw'  as const, label: '90°',  sub: 'Berlawanan AJ', color: '#a78bfa' },
    { val: '270cw'  as const, label: '270°', sub: 'Searah AJ',     color: '#818cf8' },
    { val: '270ccw' as const, label: '270°', sub: 'Berlawanan AJ', color: '#fb923c' },
    { val: '90cw'   as const, label: '90°',  sub: 'Searah AJ',     color: '#f97316' },
    { val: '180ccw' as const, label: '180°', sub: 'Berlawanan AJ', color: '#f472b6' },
    { val: '180cw'  as const, label: '180°', sub: 'Searah AJ',     color: '#ec4899' },
  ];

  return (
    <div className="space-y-4 pt-2">
      <p className="font-bold text-sm font-body" style={{ color: accent }}>📐 Animasi Interaktif — Rotasi Kurva Linear</p>

      {/* Petunjuk pengetikan */}
      <div className="bg-slate-800/70 border border-cyan-500/25 rounded-xl p-3 space-y-2">
        <p className="text-[11px] font-bold text-cyan-300 font-body uppercase tracking-wider">📝 Petunjuk Pengetikan</p>
        <div className="grid grid-cols-1 gap-1.5 text-xs font-body">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-violet-400 font-bold font-mono shrink-0">Format 1</span>
            <span className="text-white/60 shrink-0">y = mx + c</span>
            <span className="text-white/30 shrink-0">→</span>
            <span className="text-white/80 font-mono">Ketik: <span className="text-violet-300">y=2x+1</span> atau <span className="text-violet-300">y=-3x+4</span></span>
          </div>
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-orange-400 font-bold font-mono shrink-0">Format 2</span>
            <span className="text-white/60 shrink-0">ax + by = c</span>
            <span className="text-white/30 shrink-0">→</span>
            <span className="text-white/80 font-mono">Ketik: <span className="text-orange-300">2x+3y=6</span> atau <span className="text-orange-300">x-y=4</span></span>
          </div>
        </div>
        <p className="text-[10px] text-white/35 font-body">Gunakan keyboard laptop/HP · Tidak ada spasi · Huruf kecil (x, y)</p>
      </div>

      {/* Input persamaan */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-body text-white/50 uppercase tracking-wide">Persamaan Garis</p>
          {isValid && (
            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${isStd ? 'bg-orange-500/20 text-orange-300' : 'bg-violet-500/20 text-violet-300'}`}>
              {isStd ? 'ax + by = c' : 'y = mx + c'}
            </span>
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={e => changeAndReset(() => setInput(e.target.value))}
          placeholder="Contoh: y=2x+1 atau 2x+3y=6"
          className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 font-mono text-white text-sm focus:outline-none transition-all placeholder:text-white/25
            ${isValid ? (isStd ? 'border-orange-500/60 focus:border-orange-400' : 'border-violet-500/60 focus:border-violet-400') : input.length > 0 ? 'border-red-500/60 focus:border-red-400' : 'border-slate-600 focus:border-cyan-500/60'}`}
        />
        {!isValid && input.length > 0 && (
          <p className="text-[11px] text-red-400 font-body">
            ❌ Format tidak dikenali · Coba: <span className="font-mono">y=2x+1</span> atau <span className="font-mono">2x+3y=6</span>
          </p>
        )}
      </div>

      {/* Pusat Rotasi */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Pusat Rotasi</p>
        <div className="flex gap-2">
          {(['origin', 'custom'] as const).map(type => (
            <button key={type}
              onClick={() => changeAndReset(() => { playPopSound(); setCenterType(type); })}
              className={`flex-1 py-2 rounded-xl text-xs font-bold font-body border transition-all ${centerType === type ? 'bg-yellow-500/80 border-yellow-400 text-black shadow-md' : 'bg-slate-800/60 border-white/10 text-white/60 hover:text-white/80'}`}
            >{type === 'origin' ? 'O(0, 0)' : 'Titik (a, b)'}</button>
          ))}
        </div>
        {centerType === 'custom' && (
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <label className="text-xs text-white/60 font-body">a =</label>
            <input type="number" value={inputA}
              onChange={e => changeAndReset(() => setInputA(e.target.value))}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-yellow-400" />
            <label className="text-xs text-white/60 font-body">b =</label>
            <input type="number" value={inputB}
              onChange={e => changeAndReset(() => setInputB(e.target.value))}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono focus:outline-none focus:border-yellow-400" />
          </div>
        )}
      </div>

      {/* Pilih rotasi */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">
          Sudut Rotasi terhadap <span className="text-yellow-300 font-bold">{centerLabel}</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ROT_OPTS.map(({ val, label, sub, color }) => (
            <button key={val}
              onClick={() => changeAndReset(() => { playPopSound(); setRotation(val); })}
              className={`py-2 px-2 rounded-xl text-center font-body border transition-all leading-tight ${rotation === val ? 'text-black shadow-lg' : 'bg-slate-800/60 border-white/10 text-white/60 hover:text-white/80'}`}
              style={rotation === val ? { background: color, borderColor: color } : {}}
            >
              <span className="block text-sm font-bold">{label}</span>
              <span className={`block text-[10px] font-semibold ${rotation === val ? 'text-black/70' : 'text-white/35'}`}>{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="flex gap-2">
        <button onClick={handleTampilkan} disabled={!isValid || isAnimating}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all text-black disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: isAnimating ? '#64748b' : accent }}
        >{isAnimating ? '⏳ Memutar…' : '▶ Tampilkan Bayangan'}</button>
        <button onClick={handleReset} disabled={isAnimating}
          className="px-4 py-2.5 rounded-xl font-bold text-sm font-body bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600 transition-all disabled:opacity-40"
        >↺</button>
      </div>

      {/* Grid SVG */}
      {(() => {
        /* ── Anchor point: titik di garis asli yang dipakai untuk visualisasi jari-jari pusat ── */
        const ARC_R_SVG = 42;
        const r_math = ARC_R_SVG / sc;
        const K = m * ca + c - cb;
        const disc = r_math * r_math * (1 + m * m) - K * K;
        let aStart = Math.atan(m) * (180 / Math.PI);
        let anchorMathX = ca + r_math / Math.sqrt(1 + m * m);
        let anchorMathY = m * anchorMathX + c;
        if (isValid && disc >= 0) {
          const u = (-m * K + Math.sqrt(disc)) / (1 + m * m);
          const v = m * u + K;
          aStart = Math.atan2(v, u) * (180 / Math.PI);
          anchorMathX = ca + u;
          anchorMathY = cb + v;
        }
        const [rotAnchorX, rotAnchorY] = rotatePtAround(anchorMathX, anchorMathY, ca, cb, displayAngle);

        return (
        <div className="w-full max-w-[360px] mx-auto">
          <Grid accent={accent}>

            {/* Garis asli */}
            {isValid && (
              <line x1={px(-5)} y1={py(m * -5 + c)} x2={px(5)} y2={py(m * 5 + c)}
                stroke="#22d3ee" strokeWidth="2.5" opacity={showingResult ? 0.45 : 1} />
            )}
            {isValid && !showingResult && (
              <text x={px(2)} y={py(m * 2 + c) - 8} fill="#22d3ee" fontSize="9" fontWeight="bold">{input}</text>
            )}

            {/* Garis berputar (animasi & hasil) */}
            {showingResult && isValid && animLine && (
              <line
                x1={px(-5)} y1={py(animLine.M * -5 + animLine.C)}
                x2={px(5)}  y2={py(animLine.M * 5  + animLine.C)}
                stroke={accent} strokeWidth="2.5"
                strokeDasharray={show && !isAnimating ? '6,3' : 'none'}
                opacity={0.9}
              />
            )}
            {/* Label bayangan (hanya setelah animasi selesai) */}
            {show && !isAnimating && isValid && !isVertical && animLine && (
              <text x={px(-2)} y={py(animLine.M * -2 + animLine.C) - 8}
                fill={accent} fontSize="9" fontWeight="bold">{fmtLineR(imgM, imgC)}</text>
            )}
            {/* Garis vertikal hasil (m=0 + 90°) */}
            {show && !isAnimating && isValid && isVertical && (
              <line x1={px(imgVertX)} y1={0} x2={px(imgVertX)} y2={S}
                stroke={accent} strokeWidth="2.5" strokeDasharray="6,3" />
            )}
            {show && !isAnimating && isValid && isVertical && (
              <text x={px(imgVertX) + 5} y={py(2)} fill={accent} fontSize="9" fontWeight="bold">x={imgVertX}</text>
            )}

            {/* ── Peran Pusat Rotasi — jari-jari dari pusat ke titik pada garis ── */}
            {showingResult && isValid && !isVertical && (
              <g>
                {/* Jari-jari ke titik asli (tetap diam) — putus-putus cyan */}
                <line
                  x1={px(ca)} y1={py(cb)}
                  x2={px(anchorMathX)} y2={py(anchorMathY)}
                  stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6"
                />
                {/* Jari-jari ke titik berputar (bergerak) — accent */}
                <line
                  x1={px(ca)} y1={py(cb)}
                  x2={px(rotAnchorX)} y2={py(rotAnchorY)}
                  stroke={accent} strokeWidth="1.8" strokeDasharray="5,3" opacity="0.85"
                />
                {/* Titik jangkar di garis asli */}
                <circle cx={px(anchorMathX)} cy={py(anchorMathY)} r={4} fill="#22d3ee" opacity="0.9" />
                {/* Titik berputar — lebih besar, berdenyut saat animasi */}
                <circle cx={px(rotAnchorX)} cy={py(rotAnchorY)} r={5} fill={accent} opacity="0.95" />
                <circle cx={px(rotAnchorX)} cy={py(rotAnchorY)} r={9} fill="none"
                  stroke={accent} strokeWidth="1.2" opacity={isAnimating ? 0.45 : 0.2} />
                {/* Label "r" di tengah jari-jari berputar */}
                {(() => {
                  const midX = (px(ca) + px(rotAnchorX)) / 2;
                  const midY = (py(cb) + py(rotAnchorY)) / 2;
                  const dx = px(rotAnchorX) - px(ca);
                  const dy = py(rotAnchorY) - py(cb);
                  const perp = Math.atan2(dy, dx);
                  const offset = 10;
                  return (
                    <text
                      x={midX + offset * Math.cos(perp - Math.PI / 2)}
                      y={midY + offset * Math.sin(perp - Math.PI / 2)}
                      fill={accent} fontSize="9" fontWeight="bold" textAnchor="middle"
                      opacity="0.85"
                    >r</text>
                  );
                })()}
                {/* Label "r" di tengah jari-jari asli */}
                {show && !isAnimating && (() => {
                  const midX = (px(ca) + px(anchorMathX)) / 2;
                  const midY = (py(cb) + py(anchorMathY)) / 2;
                  const dx = px(anchorMathX) - px(ca);
                  const dy = py(anchorMathY) - py(cb);
                  const perp = Math.atan2(dy, dx);
                  const offset = 10;
                  return (
                    <text
                      x={midX + offset * Math.cos(perp + Math.PI / 2)}
                      y={midY + offset * Math.sin(perp + Math.PI / 2)}
                      fill="#22d3ee" fontSize="9" fontWeight="bold" textAnchor="middle"
                      opacity="0.65"
                    >r</text>
                  );
                })()}
              </g>
            )}

            {/* Arc busur rotasi — titik awal & akhir tepat menyentuh garis asli & bayangan */}
            {showingResult && animAngleAbs > 2 && (
              <ArcArrow cx={ca} cy={cb} r={ARC_R_SVG} aStart={aStart} aEnd={aStart + displayAngle} color={accent} />
            )}

            {/* Badge sudut — kotak warna di tengah atas SVG */}
            {showingResult && animAngleAbs > 2 && (() => {
              const bx = S / 2, by = 18, bw = 76, bh = 28;
              return (
                <g>
                  <rect x={bx - bw / 2} y={by - bh / 2} width={bw} height={bh} rx={7} ry={7}
                    fill={isPos90 ? '#7c3aed' : isNeg90 ? '#f97316' : '#db2777'}
                    stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.95" />
                  <text x={bx} y={by + 5} fontSize="15" fill="var(--icon-color)" textAnchor="middle" fontWeight="bold">
                    {Math.round(animAngleAbs)}°
                  </text>
                </g>
              );
            })()}

            {/* Label garis asli (selama animasi tampilkan di bawah agar tidak tumpuk badge) */}
            {showingResult && isValid && (
              <text x={px(2)} y={py(m * 2 + c) + 14} fill="#22d3ee" fontSize="8" fontWeight="bold" opacity="0.6">{input}</text>
            )}

            {/* Pusat rotasi */}
            <CenterMark x={ca} y={cb} color="#facc15" />
            <text x={px(ca) + 14} y={py(cb) - 12} fill="#facc15" fontSize="9" fontWeight="bold">{centerLabel}</text>
          </Grid>

          {/* Legenda */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center text-xs font-body">
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-cyan-400 inline-block rounded" /><span className="text-cyan-300">Garis asli</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /><span className="text-yellow-300">Pusat rotasi</span></div>
            {showingResult && <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block rounded" style={{ background: accent }} /><span style={{ color: accent }}>Bayangan ({rotLabel})</span></div>}
            {showingResult && !isVertical && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-cyan-400 inline-block rounded opacity-50 border-dashed" style={{ borderTop: '1px dashed #22d3ee', height: 0 }} />
                <span className="text-white/40">r = jarak ke pusat (tetap sama)</span>
              </div>
            )}
          </div>
        </div>
        );
      })()}

      {/* Info selama animasi */}
      {isAnimating && (
        <div className="bg-slate-700/40 rounded-xl p-3 text-xs font-body space-y-1">
          <p className="font-bold animate-pulse" style={{ color: accent }}>⏳ Memutar perlahan…</p>
          <p className="text-white/50">Sudut saat ini: <span className="text-white font-semibold">{Math.round(animAngleAbs)}°</span></p>
          <p className="text-yellow-300/80">📍 Pusat <span className="font-bold">{centerLabel}</span> tetap diam — semua titik berputar mengelilinginya</p>
          <p className="text-cyan-300/70">📏 Jarak titik ke pusat <span className="font-bold text-white">selalu sama</span> (jari-jari r tidak berubah)</p>
        </div>
      )}

      {/* Hasil */}
      {show && !isAnimating && isValid && (
        <div className="rounded-xl p-4 space-y-1.5 border" style={{ background: `${accent}15`, borderColor: `${accent}40` }}>
          <p className="text-xs font-semibold font-body uppercase tracking-wide" style={{ color: accent }}>HASIL ROTASI terhadap {centerLabel}:</p>
          <div className="flex items-center gap-2 text-sm font-body flex-wrap">
            <span className="text-cyan-300 font-bold">{input}</span>
            <span className="text-white/30 text-lg">→</span>
            <span className="font-bold" style={{ color: accent }}>
              {isVertical ? `x = ${imgVertX}` : fmtLineR(imgM, imgC)}
            </span>
          </div>
          {isVertical && <p className="text-[11px] text-yellow-200 font-body">⚠️ Rotasi garis horizontal menghasilkan garis vertikal.</p>}
        </div>
      )}
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
const rotasiPageTranslations = {
  title: { id: "ROTASI (PERPUTARAN)", en: "ROTATION", ja: "回転" },
  subtitle: { id: "Memutar Bangun di Sekitar Titik Pusat!", en: "Turning Shapes Around a Center Point!", ja: "図形を中心点の周りに回そう!" },
  breadcrumb: { id: "Kelas 9 · Transformasi Geometri · Materi Matematika", en: "Grade 9 · Geometric Transformation · Math Material", ja: "中学3年 · 図形の変換 · 数学教材" },
  introTitle: { id: "🌟 Apa Itu Rotasi?", en: "🌟 What Is Rotation?", ja: "🌟 回転とは?" },
  introBody: {
    id: "Rotasi adalah transformasi yang memutar setiap titik sebesar sudut tertentu terhadap sebuah titik pusat. Bentuk dan ukuran bangun tidak berubah, hanya posisi dan orientasinya yang bergeser sesuai sudut putaran.",
    en: "Rotation is a transformation that turns every point by a certain angle around a center point. The shape's size and form stay the same — only its position and orientation shift according to the angle of rotation.",
    ja: "回転とは、ある中心点を基準にすべての点を一定の角度だけ回す変換です。図形の形と大きさは変わらず、位置と向きだけが回転角に応じて変化します。",
  },
  badgeMudah: { id: "MUDAH", en: "Easy", ja: "基本" },
  badgeSedang: { id: "SEDANG", en: "Medium", ja: "標準" },
  badgeSulit: { id: "SULIT", en: "Hard", ja: "発展" },
  badgeOlimpiade: { id: "OLIMPIADE", en: "Olympiad", ja: "オリンピック" },
};

const RotasiPage = () => {
  const { language } = useLanguage();
  const rt = {
    title: rotasiPageTranslations.title[language],
    subtitle: rotasiPageTranslations.subtitle[language],
    breadcrumb: rotasiPageTranslations.breadcrumb[language],
    introTitle: rotasiPageTranslations.introTitle[language],
    introBody: rotasiPageTranslations.introBody[language],
    badgeMudah: rotasiPageTranslations.badgeMudah[language],
    badgeSedang: rotasiPageTranslations.badgeSedang[language],
    badgeSulit: rotasiPageTranslations.badgeSulit[language],
    badgeOlimpiade: rotasiPageTranslations.badgeOlimpiade[language],
  };
  const open = ["intro", "animasi-titik", "animasi", "rumus", "contoh90", "contoh90cw", "contoh180", "kurva-linear", "rangkuman"];

  const Hdr = ({ id, icon, color, title }: { id: string; icon: React.ReactNode; color: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4 text-left">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <div className="text-4xl text-center mb-3">🔄</div>
        <h1 className="font-display text-xl md:text-2xl font-bold text-orange-400 text-center mb-1">{rt.title}</h1>
        <p className="font-display text-sm font-semibold text-orange-300 text-center mb-1">{rt.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{rt.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" title={rt.introTitle} />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {rt.introBody}
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

          {/* CONTOH 1: −90° */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh90" icon={<BookOpen className="w-5 h-5" />} color="#22d3ee" title="📌 Contoh 1: Rotasi −90°" />
            {open.includes("contoh90") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Notasi rotasi */}
                <div className="flex justify-center items-center gap-2 py-2">
                  <InlineMath math="P(x,\ y) \xrightarrow{R[O,\ -90°]} P'(x',\ y')." />
                </div>
                <p className="text-sm text-white/80 font-body text-center">
                  Diagram di atas menyatakan rotasi titik <InlineMath math="P" /> sejauh (−90°) dengan titik pusat <InlineMath math="O(0,\ 0)" />.
                </p>
                {/* Soal */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-white/80 font-body">
                    <span className="font-bold text-white">78.</span> Jika <InlineMath math="P(3,\ -4)" />, koordinat titik <InlineMath math="P'" /> adalah . . . .
                  </p>
                  {/* Pilihan ganda 2 kolom */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-body text-white/80 pl-2">
                    <div><span className="text-cyan-300 font-semibold">A.</span> (−4, −3)</div>
                    <div><span className="text-cyan-300 font-semibold">C.</span> (4, 3)</div>
                    <div><span className="text-cyan-300 font-semibold">B.</span> (−4, 3)</div>
                    <div><span className="text-cyan-300 font-semibold">D.</span> (4, −3)</div>
                  </div>
                </div>
                {/* Penyelesaian */}
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-cyan-300 font-body">Penyelesaian: <span className="font-mono text-yellow-200">(x, y) → (y, −x)</span></p>
                  <div className="flex items-center gap-3 text-sm font-body">
                    <InlineMath math="P(3,\ -4)" />
                    <span className="text-white/40">→</span>
                    <InlineMath math="P'(-4,\ -3)" />
                  </div>
                  <p className="text-sm font-body text-white/70 pt-1">
                    Jawaban: <span className="text-green-400 font-bold">A. (−4, −3)</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2: mencari sudut rotasi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh90cw" icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title="📌 Contoh 2: Mencari Sudut Rotasi" />
            {open.includes("contoh90cw") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Notasi rotasi */}
                <div className="flex justify-center items-center gap-2 py-2 flex-wrap text-center">
                  <InlineMath math="P(-5,\ 12) \xrightarrow{R[O,\ \alpha]} P'(5,\ -12)." />
                </div>
                {/* Soal */}
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-white/80 font-body">
                    Nilai <InlineMath math="\alpha" /> yang mungkin adalah . . . .
                  </p>
                  {/* Pilihan ganda 2 kolom */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-body text-white/80 pl-2">
                    <div><span className="text-violet-300 font-semibold">A.</span> −90°</div>
                    <div><span className="text-violet-300 font-semibold">C.</span> 180°</div>
                    <div><span className="text-violet-300 font-semibold">B.</span> 90°</div>
                    <div><span className="text-violet-300 font-semibold">D.</span> 270°</div>
                  </div>
                </div>
                {/* Penyelesaian */}
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-violet-300 font-body">Penyelesaian:</p>
                  <p className="text-sm font-body text-white/80">Periksa setiap sudut rotasi terhadap <InlineMath math="P(-5,\ 12)" />:</p>
                  <div className="space-y-1 text-sm font-body text-white/70 pl-2">
                    <p>• 180°: <InlineMath math="(x, y) \to (-x, -y)" /> → <InlineMath math="(-5,12) \to (5,-12)" /> ✓</p>
                  </div>
                  <p className="text-sm font-body text-white/70 pt-1">
                    Jawaban: <span className="text-green-400 font-bold">C. 180°</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3: 180° */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh180" icon={<BookOpen className="w-5 h-5" />} color="#fb923c" title="📌 Contoh 3: Rotasi 180°" />
            {open.includes("contoh180") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Soal */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-white/80 font-body leading-relaxed">
                    Dilakukan rotasi berturut-turut terhadap titik <InlineMath math="(b,\ 12 - a)" /> sejauh 180° dan 90°. Jika koordinat bayangannya adalah <InlineMath math="(2a,\ -5)" />, nilai <InlineMath math="a + b" /> = . . . .
                  </p>
                  {/* Pilihan ganda 2 kolom */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-body text-white/80 pl-2">
                    <div><span className="text-orange-300 font-semibold">A.</span> −1</div>
                    <div><span className="text-orange-300 font-semibold">C.</span> 5</div>
                    <div><span className="text-orange-300 font-semibold">B.</span> 1</div>
                    <div><span className="text-orange-300 font-semibold">D.</span> 9</div>
                  </div>
                </div>
                {/* Penyelesaian */}
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-orange-300 font-body">Penyelesaian:</p>
                  <div className="space-y-2 text-sm font-body text-white/80">
                    <p className="font-semibold text-white/90">Langkah 1 — Rotasi 180°: <span className="font-mono text-yellow-200">(x, y) → (−x, −y)</span></p>
                    <p className="pl-2"><InlineMath math="(b,\ 12-a) \to (-b,\ -(12-a)) = (-b,\ a-12)" /></p>
                    <p className="font-semibold text-white/90 pt-1">Langkah 2 — Rotasi 90° (berlawanan arah jarum jam): <span className="font-mono text-yellow-200">(x, y) → (−y, x)</span></p>
                    <p className="pl-2"><InlineMath math="(-b,\ a-12) \to (-(a-12),\ -b) = (12-a,\ -b)" /></p>
                    <p className="font-semibold text-white/90 pt-1">Samakan dengan <InlineMath math="(2a,\ -5)" />:</p>
                    <div className="pl-2 space-y-1">
                      <p><InlineMath math="12 - a = 2a \Rightarrow a = 4" /></p>
                      <p><InlineMath math="-b = -5 \Rightarrow b = 5" /></p>
                      <p><InlineMath math="a + b = 4 + 5 = 9" /></p>
                    </div>
                  </div>
                  <p className="text-sm font-body text-white/70 pt-1">
                    Jawaban: <span className="text-green-400 font-bold">D. 9</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ROTASI KURVA LINEAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="kurva-linear" icon={<BookOpen className="w-5 h-5" />} color="#4ade80" title="📈 [Tambahan] Rotasi pada Kurva Linear" />
            {open.includes("kurva-linear") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Pengantar */}
                <p className="text-sm text-white/80 font-body leading-relaxed">
                  Rotasi tidak hanya berlaku untuk titik atau bangun datar — ia juga dapat diterapkan pada <strong className="text-green-300">persamaan garis (kurva linear)</strong>. Jika garis <InlineMath math="y = mx + c" /> dirotasi sebesar sudut tertentu terhadap titik asal <InlineMath math="O(0,0)" />, kita cukup <strong className="text-white">menginverskan pemetaan rotasi</strong> lalu mensubstitusikannya ke persamaan semula.
                </p>

                {/* Penurunan Rumus */}
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-green-400 font-body uppercase tracking-wide">Penurunan Rumus — Rotasi terhadap O(0,0)</p>
                  <p className="text-sm text-white/80 font-body">Misalkan titik <InlineMath math="(x, y)" /> pada garis asli berpindah ke <InlineMath math="(x', y')" /> setelah rotasi. Kita nyatakan <InlineMath math="x" /> dan <InlineMath math="y" /> dalam bentuk <InlineMath math="x'" /> dan <InlineMath math="y'" />, lalu substitusikan ke <InlineMath math="y = mx + c" />.</p>

                  {/* 90° CCW */}
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-violet-300 font-body">🔄 90° Berlawanan Arah Jarum Jam: <InlineMath math="(x,y) \to (-y,\, x)" /></p>
                    <p className="text-xs text-white/60 font-body">Invers: <InlineMath math="x = y',\quad y = -x'" /></p>
                    <BlockMath math="-x' = my' + c \implies \boxed{y' = -\tfrac{1}{m}\,x' - \tfrac{c}{m}}" />
                  </div>

                  {/* 90° CW */}
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-orange-300 font-body">🔄 90° Searah Jarum Jam: <InlineMath math="(x,y) \to (y,\, -x)" /></p>
                    <p className="text-xs text-white/60 font-body">Invers: <InlineMath math="x = -y',\quad y = x'" /></p>
                    <BlockMath math="x' = -my' + c \implies \boxed{y' = -\tfrac{1}{m}\,x' + \tfrac{c}{m}}" />
                  </div>

                  {/* 180° */}
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-pink-300 font-body">🔄 180°: <InlineMath math="(x,y) \to (-x,\, -y)" /></p>
                    <p className="text-xs text-white/60 font-body">Invers: <InlineMath math="x = -x',\quad y = -y'" /></p>
                    <BlockMath math="-y' = m(-x') + c \implies \boxed{y' = mx' - c}" />
                  </div>

                  {/* Tabel ringkas */}
                  <div className="bg-green-950/40 border border-green-500/20 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-green-400 font-body">Tabel Ringkas — Bayangan garis <InlineMath math="y = mx + c" /> terhadap O(0,0):</p>
                    <div className="text-xs font-body space-y-1 text-white/80">
                      <div className="flex gap-2"><span className="text-violet-300 min-w-[160px]">90° berlawanan AJ</span><span><InlineMath math="y = -\frac{1}{m}x - \frac{c}{m}" /></span></div>
                      <div className="flex gap-2"><span className="text-orange-300 min-w-[160px]">90° searah AJ</span><span><InlineMath math="y = -\frac{1}{m}x + \frac{c}{m}" /></span></div>
                      <div className="flex gap-2"><span className="text-pink-300 min-w-[160px]">180°</span><span><InlineMath math="y = mx - c" /></span></div>
                    </div>
                    <p className="text-xs text-yellow-200 font-body mt-1">💡 Gradien berubah menjadi <InlineMath math="-\frac{1}{m}" /> (tegak lurus) untuk rotasi 90°, dan tetap <InlineMath math="m" /> untuk rotasi 180° — hanya tanda intersep yang berbalik.</p>
                  </div>
                </div>

                {/* Animasi Interaktif */}
                <AnimasiRotasiKurva />

                {/* Contoh Soal */}
                <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wider">Contoh Soal</p>

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded font-body">{rt.badgeMudah}</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Garis <InlineMath math="y = 3x + 2" /> dirotasi <strong className="text-green-300">180°</strong> terhadap titik asal <InlineMath math="O(0,0)" />. Tentukan persamaan bayangan garis tersebut!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-semibold text-green-400 font-body">PEMBAHASAN:</p>
                    <p className="text-sm text-white/80 font-body">Rotasi 180° memetakan setiap titik <InlineMath math="(x, y) \to (-x, -y)" />. Inversnya:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x = -x', \quad y = -y'" />
                    </div>
                    <p className="text-sm text-white/80 font-body">Substitusikan ke persamaan garis asli <InlineMath math="y = 3x + 2" />:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="-y' = 3(-x') + 2" />
                      <BlockMath math="-y' = -3x' + 2" />
                      <BlockMath math="y' = 3x' - 2" />
                    </div>
                    <p className="font-body font-bold text-green-300">✅ <strong>Bayangan:</strong> <InlineMath math="y = 3x - 2" /></p>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded font-body">{rt.badgeSedang}</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white">
                      Garis <InlineMath math="2x - y + 3 = 0" /> dirotasi <strong className="text-yellow-300">90° searah arah jarum jam</strong> terhadap pusat <InlineMath math="(1,\,-2)" />. Tentukan persamaan bayangan garis tersebut!
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm font-body text-white/80 pl-2 pt-1">
                      <div><span className="text-yellow-300 font-semibold">A.</span> <InlineMath math="x + 2y - 4 = 0" /></div>
                      <div><span className="text-yellow-300 font-semibold">C.</span> <InlineMath math="2x + y - 4 = 0" /></div>
                      <div><span className="text-yellow-300 font-semibold">B.</span> <InlineMath math="x + 2y + 4 = 0" /></div>
                      <div><span className="text-yellow-300 font-semibold">D.</span> <InlineMath math="x - 2y + 4 = 0" /></div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold text-yellow-400 font-body">PEMBAHASAN:</p>
                    <p className="text-sm text-white/80 font-body">
                      Rotasi 90° searah jarum jam terhadap pusat <InlineMath math="(p,q) = (1,-2)" /> memetakan:
                    </p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="(x,y) \;\to\; \bigl(p+(y-q),\; q-(x-p)\bigr) = (y+3,\; -x-1)" />
                    </div>
                    <p className="text-sm text-white/80 font-body">Cari inversnya (<InlineMath math="x,y" /> dalam <InlineMath math="x',y'" />):</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x' = y + 3 \;\Rightarrow\; y = x' - 3" />
                      <BlockMath math="y' = -x - 1 \;\Rightarrow\; x = -y' - 1" />
                    </div>
                    <p className="text-sm text-white/80 font-body">Substitusikan ke persamaan garis asli <InlineMath math="2x - y + 3 = 0" />:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="2(-y'-1) - (x'-3) + 3 = 0" />
                      <BlockMath math="-2y' - 2 - x' + 3 + 3 = 0" />
                      <BlockMath math="-x' - 2y' + 4 = 0 \;\implies\; \boxed{x' + 2y' - 4 = 0}" />
                    </div>
                    <p className="font-body font-bold text-yellow-300">✅ <strong>Bayangan:</strong> <InlineMath math="x + 2y - 4 = 0" /> &nbsp;→ Jawaban <strong>A</strong></p>
                    <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                      <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wide">Verifikasi dengan titik</p>
                      <p className="text-xs text-white/60 font-body">Ambil titik <InlineMath math="(0, 3)" /> di garis asli (cek: <InlineMath math="0-3+3=0" /> ✓). Rotasi 90° SAJ pusat <InlineMath math="(1,-2)" />: <InlineMath math="(0,3)\to(6,-1)" />. Cek bayangan: <InlineMath math="6+2(-1)-4=0" /> ✓</p>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded font-body">{rt.badgeSulit}</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white">
                      Garis <InlineMath math="y = 2x + 1" /> ditranslasi oleh <InlineMath math="T(3,\,-1)" />, kemudian dirotasi <strong className="text-red-300">90° berlawanan arah jarum jam</strong> terhadap <InlineMath math="O(0,0)" />. Tentukan persamaan bayangan akhir!
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm font-body text-white/80 pl-2 pt-1">
                      <div><span className="text-red-300 font-semibold">A.</span> <InlineMath math="x + 2y - 6 = 0" /></div>
                      <div><span className="text-red-300 font-semibold">C.</span> <InlineMath math="2x - y + 6 = 0" /></div>
                      <div><span className="text-red-300 font-semibold">B.</span> <InlineMath math="x + 2y + 6 = 0" /></div>
                      <div><span className="text-red-300 font-semibold">D.</span> <InlineMath math="x - 2y + 6 = 0" /></div>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold text-red-400 font-body">PEMBAHASAN:</p>
                    <p className="text-sm text-white/80 font-body font-semibold">Langkah 1 — Translasi <InlineMath math="T(3,-1)" />:</p>
                    <p className="text-sm text-white/70 font-body">Invers translasi: <InlineMath math="x = x' - 3,\quad y = y' + 1" />. Substitusi ke <InlineMath math="y = 2x + 1" />:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="y' + 1 = 2(x' - 3) + 1" />
                      <BlockMath math="y' = 2x' - 6" />
                    </div>
                    <p className="text-sm text-white/80 font-body font-semibold">Langkah 2 — Rotasi 90° berlawanan AJ terhadap O(0,0):</p>
                    <p className="text-sm text-white/70 font-body">Pemetaan: <InlineMath math="(x,y)\to(-y,x)" />. Invers: <InlineMath math="x = y',\quad y = -x'" />. Substitusi ke <InlineMath math="y' = 2x' - 6" />:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="-x'' = 2y'' - 6" />
                      <BlockMath math="x'' + 2y'' - 6 = 0" />
                    </div>
                    <p className="font-body font-bold text-red-300">✅ <strong>Bayangan akhir:</strong> <InlineMath math="x + 2y - 6 = 0" /> &nbsp;→ Jawaban <strong>A</strong></p>
                    <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                      <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wide">Verifikasi</p>
                      <p className="text-xs text-white/60 font-body">Titik <InlineMath math="(0,1)" /> di garis asli → translasi: <InlineMath math="(3,0)" /> → rotasi 90° BAJ: <InlineMath math="(0,3)" />. Cek: <InlineMath math="0+2(3)-6=0" /> ✓</p>
                    </div>
                  </div>
                </div>

                {/* SANGAT SULIT */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded font-body">{rt.badgeOlimpiade}</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white">
                      Garis <InlineMath math="3x - y + 2 = 0" /> dicerminkan terhadap garis <InlineMath math="y = 1" />, kemudian dirotasi <strong className="text-purple-300">90° berlawanan arah jarum jam</strong> terhadap pusat <InlineMath math="(2,\,1)" />. Tentukan persamaan bayangan akhir!
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm font-body text-white/80 pl-2 pt-1">
                      <div><span className="text-purple-300 font-semibold">A.</span> <InlineMath math="x - 3y - 6 = 0" /></div>
                      <div><span className="text-purple-300 font-semibold">C.</span> <InlineMath math="3x - y + 6 = 0" /></div>
                      <div><span className="text-purple-300 font-semibold">B.</span> <InlineMath math="x + 3y + 6 = 0" /></div>
                      <div><span className="text-purple-300 font-semibold">D.</span> <InlineMath math="x - 3y + 6 = 0" /></div>
                    </div>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold text-purple-300 font-body">PEMBAHASAN:</p>
                    <p className="text-sm text-white/80 font-body font-semibold">Langkah 1 — Refleksi terhadap <InlineMath math="y = 1" />:</p>
                    <p className="text-sm text-white/70 font-body">Cermin <InlineMath math="y = k" /> memetakan <InlineMath math="(x,y)\to(x,\, 2k-y)" />. Dengan <InlineMath math="k=1" />: <InlineMath math="(x,y)\to(x,\, 2-y)" />. Invers: <InlineMath math="x = x',\; y = 2 - y'" />. Substitusi ke <InlineMath math="3x - y + 2 = 0" />:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="3x' - (2 - y') + 2 = 0 \;\implies\; 3x' + y' = 0" />
                    </div>
                    <p className="text-sm text-white/80 font-body font-semibold">Langkah 2 — Rotasi 90° berlawanan AJ terhadap pusat <InlineMath math="(2,1)" />:</p>
                    <p className="text-sm text-white/70 font-body">Pemetaan: <InlineMath math="(x,y)\to\bigl(2-(y-1),\;1+(x-2)\bigr)=(3-y,\;x-1)" />. Invers: <InlineMath math="x = y'' + 1,\quad y = 3 - x''" />. Substitusi ke <InlineMath math="3x + y = 0" />:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="3(y'' + 1) + (3 - x'') = 0" />
                      <BlockMath math="3y'' + 3 + 3 - x'' = 0" />
                      <BlockMath math="-x'' + 3y'' + 6 = 0 \;\implies\; \boxed{x'' - 3y'' - 6 = 0}" />
                    </div>
                    <p className="font-body font-bold text-purple-300">✅ <strong>Bayangan akhir:</strong> <InlineMath math="x - 3y - 6 = 0" /> &nbsp;→ Jawaban <strong>A</strong></p>
                    <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wide">Verifikasi dengan titik</p>
                      <p className="text-xs text-white/60 font-body">Titik <InlineMath math="(0,2)" /> di garis asli → refleksi <InlineMath math="y=1" />: <InlineMath math="(0,0)" /> → rotasi 90° BAJ pusat <InlineMath math="(2,1)" />: geser <InlineMath math="(-2,-1)" />, putar: <InlineMath math="(1,-2)" />, geser balik: <InlineMath math="(3,-1)" />.</p>
                      <p className="text-xs text-white/60 font-body">Cek <InlineMath math="x-3y-6=0" />: <InlineMath math="3-3(-1)-6 = 3+3-6 = 0" /> ✓</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RANGKUMAN, TIPS & KESIMPULAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="rangkuman" icon={<Target className="w-5 h-5" />} color="#f97316" title="🎯 Rangkuman, Tips & Kesimpulan" />
            <div className="px-5 pb-5 space-y-5">

              {/* ── Rumus Kunci ── */}
              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-widest">📐 Rumus Kunci Rotasi (Pusat O)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { sudut: "90° berlawanan AJ", rumus: "(x, y) → (−y, x)", color: "from-purple-900/50 to-indigo-900/50", border: "border-purple-500/30", tc: "text-purple-300" },
                    { sudut: "90° searah AJ", rumus: "(x, y) → (y, −x)", color: "from-blue-900/50 to-cyan-900/50", border: "border-blue-500/30", tc: "text-blue-300" },
                    { sudut: "180° (kedua arah)", rumus: "(x, y) → (−x, −y)", color: "from-rose-900/50 to-pink-900/50", border: "border-rose-500/30", tc: "text-rose-300" },
                    { sudut: "270° berlawanan AJ", rumus: "(x, y) → (y, −x)", color: "from-orange-900/50 to-amber-900/50", border: "border-orange-500/30", tc: "text-orange-300" },
                  ].map(r => (
                    <div key={r.sudut} className={`bg-gradient-to-br ${r.color} ${r.border} border rounded-xl p-3`}>
                      <p className={`font-body text-xs font-bold ${r.tc} mb-1.5`}>🔄 {r.sudut}</p>
                      <p className="font-body text-sm text-white font-mono bg-slate-900/60 rounded-lg px-3 py-1.5 text-center">{r.rumus}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-3">
                  <p className="font-body text-xs text-purple-300 font-bold mb-2">📌 Rotasi pusat P(a, b) — langkah umum</p>
                  <div className="font-body text-xs text-white/75 space-y-1">
                    <p>1. Geser titik: <span className="text-yellow-300 font-mono">(x−a, y−b)</span></p>
                    <p>2. Terapkan rotasi pusat O sesuai sudut</p>
                    <p>3. Geser balik: tambah <span className="text-yellow-300 font-mono">(a, b)</span> ke hasil</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="font-body text-xs text-slate-300 font-bold mb-2">📌 Sifat-sifat Rotasi</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    {[
                      { icon: "📐", label: "Bentuk", val: "Tetap" },
                      { icon: "📏", label: "Ukuran", val: "Tetap" },
                      { icon: "🔄", label: "Orientasi", val: "Berputar" },
                      { icon: "📍", label: "Jarak ke pusat", val: "Tetap" },
                    ].map(item => (
                      <div key={item.label} className="bg-slate-900/50 rounded-lg p-2">
                        <p className="text-base">{item.icon}</p>
                        <p className="font-body text-xs text-white/60">{item.label}</p>
                        <p className={`font-body text-xs font-bold ${item.val === "Tetap" ? "text-green-400" : "text-yellow-400"}`}>{item.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Tips & Trik ── */}
              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest">💡 Tips & Trik</p>
                <div className="space-y-2">
                  {[
                    {
                      num: "1",
                      color: "bg-purple-500/10 border-purple-500/30 text-purple-300",
                      title: "Jembatan keledai 90° berlawanan AJ",
                      body: "Ingat: (x, y) → (−y, x). Cara mudah: tukar posisi x dan y, lalu negasikan yang tadinya x (sekarang jadi elemen pertama).",
                    },
                    {
                      num: "2",
                      color: "bg-blue-500/10 border-blue-500/30 text-blue-300",
                      title: "270° berlawanan AJ = 90° searah AJ",
                      body: "Hafalkan saja satu rumus! Rotasi 270° berlawanan sama hasilnya dengan 90° searah: (x,y) → (y, −x). Hemat hapalan.",
                    },
                    {
                      num: "3",
                      color: "bg-rose-500/10 border-rose-500/30 text-rose-300",
                      title: "180° = negasikan semua",
                      body: "Untuk rotasi 180° (searah atau berlawanan — sama saja): cukup negasikan x dan y. A(x,y) → A'(−x, −y). Paling mudah!",
                    },
                    {
                      num: "4",
                      color: "bg-amber-500/10 border-amber-500/30 text-amber-300",
                      title: "Rotasi pusat P(a,b) — geser-putar-balik",
                      body: "Jangan langsung pakai rumus rumit. Geser ke pusat O dulu, putar, lalu geser balik. Tiga langkah sederhana yang selalu benar.",
                    },
                  ].map(tip => (
                    <div key={tip.num} className={`flex gap-3 items-start border rounded-xl p-3 ${tip.color.split(" ").slice(0,2).join(" ")}`}>
                      <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${tip.color}`}>{tip.num}</span>
                      <div>
                        <p className={`font-body text-sm font-bold ${tip.color.split(" ")[2]}`}>{tip.title}</p>
                        <p className="font-body text-xs text-white/70 mt-0.5">{tip.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Kesimpulan ── */}
              <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-900/40 border border-purple-500/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏁</span>
                  <p className="font-body text-sm font-bold text-purple-300 uppercase tracking-wide">Kesimpulan</p>
                </div>
                <p className="font-body text-sm text-white/85 leading-relaxed">
                  <strong className="text-purple-300">Rotasi</strong> adalah transformasi memutar titik atau bangun sebesar sudut θ terhadap suatu titik pusat. Bentuk dan ukuran <strong className="text-green-300">tetap sama</strong>, hanya posisi dan arah orientasi yang berubah. Kunci sukses: hafal 3 rumus utama (90° BAJ, 90° SAJ, 180°), dan gunakan teknik <strong className="text-yellow-300">geser-putar-balik</strong> untuk rotasi dengan pusat sembarang!
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Isometri ✅", "Jarak ke pusat tetap", "3 rumus utama", "Geser-putar-balik"].map(tag => (
                    <span key={tag} className="bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-0.5 text-xs font-body text-purple-200">{tag}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RotasiPage;
