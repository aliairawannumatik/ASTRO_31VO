import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, MoveRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── SVG helpers ── */
const S = 220, sc = S / 14, ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;
const ticks = [-5,-4,-3,-2,-1,1,2,3,4,5];

function Grid({ children, accent = "#22d3ee" }: { children?: React.ReactNode; accent?: string }) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full rounded-xl border bg-slate-900/70" style={{ borderColor: `${accent}33` }}>
      {ticks.map(t => (
        <g key={t}>
          <line x1={px(t)} y1={0} x2={px(t)} y2={S} stroke="#334155" strokeWidth="0.5" />
          <line x1={0} y1={py(t)} x2={S} y2={py(t)} stroke="#334155" strokeWidth="0.5" />
        </g>
      ))}
      <line x1={0} y1={oy} x2={S} y2={oy} stroke="#64748b" strokeWidth="1.2" />
      <line x1={ox} y1={0} x2={ox} y2={S} stroke="#64748b" strokeWidth="1.2" />
      <polygon points={`${S},${oy} ${S-6},${oy-3} ${S-6},${oy+3}`} fill="#64748b" />
      <polygon points={`${ox},0 ${ox-3},6 ${ox+3},6`} fill="#64748b" />
      {ticks.map(t => (
        <g key={t}>
          <text x={px(t)} y={oy + 10} textAnchor="middle" fill="#64748b" fontSize="7">{t}</text>
          <text x={ox - 8} y={py(t) + 3} textAnchor="middle" fill="#64748b" fontSize="7">{t}</text>
        </g>
      ))}
      <text x={S - 5} y={oy - 4} fill="#94a3b8" fontSize="8">x</text>
      <text x={ox + 4} y={8} fill="#94a3b8" fontSize="8">y</text>
      {children}
    </svg>
  );
}

function Poly({ pts, color, fill, label, dashed }: { pts: [number, number][]; color: string; fill: string; label?: string; dashed?: boolean }) {
  const d = pts.map(([x, y]) => `${px(x)},${py(y)}`).join(" ");
  const cx_ = pts.reduce((s, [x]) => s + x, 0) / pts.length;
  const cy_ = pts.reduce((s, [, y]) => s + y, 0) / pts.length;
  return (
    <g>
      <polygon points={d} fill={fill} stroke={color} strokeWidth="1.5" strokeDasharray={dashed ? "4,2" : undefined} />
      {label && <text x={px(cx_)} y={py(cy_) + 4} textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </g>
  );
}

function Dot({ x, y, color, label, labelColor, ghost }: { x: number; y: number; color: string; label?: string; labelColor?: string; ghost?: boolean }) {
  const lc = labelColor ?? color;
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={5} fill={ghost ? "none" : color} stroke={color} strokeWidth={ghost ? 1.5 : 0}
        strokeDasharray={ghost ? "3,2" : undefined} fillOpacity={ghost ? 0 : 1} strokeOpacity={ghost ? 0.5 : 1} />
      {label && <text x={px(x) + 7} y={py(y) - 5} fill={lc} fontSize="8" fontWeight="bold" fillOpacity={ghost ? 0.5 : 1}>{label}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = px(x2) - px(x1), dy = py(y2) - py(y1);
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;
  const ex = px(x2) - ux * 4, ey = py(y2) - uy * 4;
  return (
    <g>
      <line x1={px(x1)} y1={py(y1)} x2={ex} y2={ey} stroke={color} strokeWidth="1.5" strokeDasharray="4,2" />
      <polygon points={`${px(x2)},${py(y2)} ${ex - uy * 3},${ey + ux * 3} ${ex + uy * 3},${ey - ux * 3}`} fill={color} />
    </g>
  );
}

/* ── Direction Pad ── */
type Dir4 = 'up' | 'down' | 'left' | 'right';

function DirPad({ onMove, onReset }: { onMove: (d: Dir4) => void; onReset: () => void }) {
  const Btn = ({ d, label }: { d: Dir4 | null; label: string }) => (
    <button
      onClick={() => { playPopSound(); d ? onMove(d) : onReset(); }}
      className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold text-base
                 hover:bg-cyan-500/40 hover:border-cyan-300 active:scale-90 transition-all flex items-center justify-center select-none"
    >{label}</button>
  );
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex"><Btn d="up" label="↑" /></div>
      <div className="flex gap-1">
        <Btn d="left" label="←" />
        <button onClick={() => { playPopSound(); onReset(); }}
          className="w-10 h-10 rounded-lg bg-slate-700/60 border border-slate-500/40 text-slate-300 text-sm
                     hover:bg-slate-600 active:scale-90 transition-all flex items-center justify-center select-none">↺</button>
        <Btn d="right" label="→" />
      </div>
      <div className="flex"><Btn d="down" label="↓" /></div>
    </div>
  );
}

/* ── Legend: valid directions ── */
function ArahLegend() {
  return (
    <div className="w-full bg-slate-800/70 border border-slate-600/40 rounded-xl px-4 py-3 text-xs font-body">
      <p className="text-white/50 font-semibold text-[10px] uppercase tracking-wider mb-2">Petunjuk Arah</p>
      <p className="text-yellow-300/80 text-[10px] font-body mb-2">
        Vektor translasi <span className="font-bold text-yellow-300">T(a, b)</span>
      </p>
      <div className="grid grid-cols-1 gap-y-1.5">
        {[
          ["→", "Geser Kanan", "(+a)"],
          ["←", "Geser Kiri",  "(−a)"],
          ["↑", "Geser Atas",  "(+b)"],
          ["↓", "Geser Bawah", "(−b)"],
        ].map(([arrow, label, note]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-green-400 font-bold w-4 text-center shrink-0">{arrow}</span>
            <span className="text-green-300/80">{label}</span>
            <span className="text-yellow-300/70 text-[9px]">{note}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-slate-600/40 flex items-center gap-2">
        <span className="text-red-400 font-bold">↗</span>
        <span className="text-red-400/80 line-through text-[11px]">Miring</span>
        <span className="text-red-400 text-[10px]">❌ Tidak diizinkan</span>
      </div>
    </div>
  );
}

/* ── Animasi 1: Geser Titik ── */
function AnimasiTitik() {
  const OX = -3, OY = 2;
  const [pos, setPos] = useState({ x: OX, y: OY });
  const dx = pos.x - OX, dy = pos.y - OY;
  const moved = dx !== 0 || dy !== 0;

  const [lastDir, setLastDir] = useState<Dir4 | null>(null);

  const move = (d: Dir4) => {
    setLastDir(d);
    setPos(p => {
      if (d === 'up'    && p.y < 5)  return { ...p, y: p.y + 1 };
      if (d === 'down'  && p.y > -5) return { ...p, y: p.y - 1 };
      if (d === 'left'  && p.x > -5) return { ...p, x: p.x - 1 };
      if (d === 'right' && p.x < 5)  return { ...p, x: p.x + 1 };
      return p;
    });
  };

  const dirDesc = lastDir === 'up' ? '⬆ Geser Atas' : lastDir === 'down' ? '⬇ Geser Bawah'
    : lastDir === 'left' ? '⬅ Geser Kiri' : lastDir === 'right' ? '➡ Geser Kanan' : null;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-cyan-300 font-bold text-sm font-body">📍 Animasi 1 —<br className="sm:hidden" /> Translasi Titik</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">Tekan tombol arah untuk menggeser titik A</p>
      </div>

      {/* Portrait: grid then controls below | Landscape: grid left, DirPad right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent="#22d3ee">
            {/* Ghost origin */}
            <Dot x={OX} y={OY} color="#ef4444" labelColor="#22d3ee" label={`A(${OX},${OY})`} ghost />
            {/* Arrow */}
            {moved && <Arrow x1={OX} y1={OY} x2={pos.x} y2={pos.y} color="#facc15" />}
            {/* Vector label mid-arrow */}
            {moved && (
              <text
                x={(px(OX) + px(pos.x)) / 2 + (dy !== 0 ? 12 : 0)}
                y={(py(OY) + py(pos.y)) / 2 + (dx !== 0 ? -6 : 0)}
                fill="#fde68a" fontSize="8" textAnchor="middle" fontWeight="bold"
              >T({dx > 0 ? '+' : ''}{dx},{dy > 0 ? '+' : ''}{dy})</text>
            )}
            {/* Current point */}
            <Dot x={pos.x} y={pos.y} color="#ef4444" labelColor="#ef4444" label={moved ? `A'(${pos.x},${pos.y})` : `A(${pos.x},${pos.y})`} />
          </Grid>
        </div>
        {/* DirPad — portrait: hidden here (shown below); landscape: right of grid */}
        <div className="hidden sm:flex sm:shrink-0 sm:items-center sm:justify-center">
          <DirPad onMove={move} onReset={() => { setPos({ x: OX, y: OY }); setLastDir(null); }} />
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-slate-800/60 rounded-lg px-2 py-2 text-center font-body min-h-[32px] flex flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-2 sm:px-4 text-[10px] sm:text-xs">
        {moved ? (
          <>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-cyan-300 font-bold whitespace-nowrap">A({OX},{OY})</span>
              <span className="text-white/40">→</span>
              <span className="text-yellow-300 font-bold whitespace-nowrap">A'({pos.x},{pos.y})</span>
              <span className="text-white/40">|</span>
              <span className="text-yellow-200 whitespace-nowrap">T({dx > 0 ? '+' : ''}{dx},{dy > 0 ? '+' : ''}{dy})</span>
            </div>
            {dirDesc && <span className="text-green-400 font-semibold whitespace-nowrap">{dirDesc}</span>}
          </>
        ) : (
          <span className="text-white/30 whitespace-nowrap">Tekan ↑ ↓ ← → untuk menggeser titik!</span>
        )}
      </div>

      {/* Controls — portrait only: DirPad centered + legend below */}
      <div className="flex flex-col items-center gap-4 sm:hidden">
        <DirPad onMove={move} onReset={() => { setPos({ x: OX, y: OY }); setLastDir(null); }} />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
        <ArahLegend />
      </div>

      {/* Concept note */}
      <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-cyan-300 text-xs font-body">
          💡 Setiap kali ditekan, titik bergeser <strong>1 satuan</strong> ke satu arah saja.
          Inilah yang disebut <strong className="text-yellow-300">translasi</strong> — geser lurus, tidak miring!
        </p>
      </div>
    </div>
  );
}

/* ── Animasi 2: Geser Segitiga ── */
type Vec2 = [number, number];
const TRI_BASE: Vec2[] = [[-3, -1], [0, -1], [-2, 2]];
const TRI_LABELS = ['A', 'B', 'C'];

function AnimasiSegitiga() {
  const [off, setOff] = useState({ dx: 0, dy: 0 });
  const [lastDir, setLastDir] = useState<Dir4 | null>(null);

  const current: Vec2[] = TRI_BASE.map(([x, y]) => [x + off.dx, y + off.dy]);
  const moved = off.dx !== 0 || off.dy !== 0;

  const clampDx = (dx: number) => Math.max(-2, Math.min(5, dx));
  const clampDy = (dy: number) => Math.max(-4, Math.min(3, dy));

  const move = (d: Dir4) => {
    setLastDir(d);
    setOff(o => {
      if (d === 'up')    return { ...o, dy: clampDy(o.dy + 1) };
      if (d === 'down')  return { ...o, dy: clampDy(o.dy - 1) };
      if (d === 'left')  return { ...o, dx: clampDx(o.dx - 1) };
      if (d === 'right') return { ...o, dx: clampDx(o.dx + 1) };
      return o;
    });
  };

  const dirDesc = lastDir === 'up' ? '⬆ Geser Atas' : lastDir === 'down' ? '⬇ Geser Bawah'
    : lastDir === 'left' ? '⬅ Geser Kiri' : lastDir === 'right' ? '➡ Geser Kanan' : null;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-pink-300 font-bold text-sm font-body">🔺 Animasi 2 —<br className="sm:hidden" /> Translasi Bangun Datar</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">Tekan tombol arah untuk menggeser segitiga ABC</p>
      </div>

      {/* Portrait: grid then controls below | Landscape: grid left, DirPad right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent="#f472b6">
            {/* Original ghost triangle */}
            <Poly pts={TRI_BASE} color="#22d3ee" fill="rgba(34,211,238,0.08)" dashed />
            {/* Ghost vertex labels */}
            {TRI_BASE.map(([x, y], i) => (
              <text key={i} x={px(x) + (i === 1 ? 6 : i === 0 ? -14 : -4)} y={py(y) + (i === 2 ? -5 : 10)}
                fill="#22d3ee" fontSize="8" fillOpacity={0.45}>{TRI_LABELS[i]}({x},{y})</text>
            ))}
            {/* Arrows from each vertex */}
            {moved && TRI_BASE.map(([x, y], i) => (
              <Arrow key={i} x1={x} y1={y} x2={x + off.dx} y2={y + off.dy} color="#facc15" />
            ))}
            {/* Vector label (on middle arrow) */}
            {moved && (() => {
              const [mx, my] = TRI_BASE[2];
              return (
                <text
                  x={(px(mx) + px(mx + off.dx)) / 2 + (off.dy !== 0 ? 14 : 0)}
                  y={(py(my) + py(my + off.dy)) / 2 + (off.dx !== 0 ? -6 : 0)}
                  fill="#fde68a" fontSize="8" textAnchor="middle" fontWeight="bold"
                >T({off.dx > 0 ? '+' : ''}{off.dx},{off.dy > 0 ? '+' : ''}{off.dy})</text>
              );
            })()}
            {/* Current (translated) triangle */}
            <Poly pts={current} color="#f472b6" fill="rgba(244,114,182,0.18)" label={moved ? "△A'B'C'" : "△ABC"} />
            {/* Current vertex labels */}
            {moved && current.map(([x, y], i) => (
              <text key={i} x={px(x) + (i === 1 ? 6 : i === 0 ? -18 : -4)} y={py(y) + (i === 2 ? -5 : 10)}
                fill="#f472b6" fontSize="8">{TRI_LABELS[i]}'({x},{y})</text>
            ))}
          </Grid>
        </div>
        {/* DirPad — portrait: hidden here (shown below); landscape: right of grid */}
        <div className="hidden sm:flex sm:shrink-0 sm:items-center sm:justify-center">
          <DirPad onMove={move} onReset={() => { setOff({ dx: 0, dy: 0 }); setLastDir(null); }} />
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-slate-800/60 rounded-lg px-2 py-2 text-center font-body min-h-[32px] flex flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-2 sm:px-4 text-[10px] sm:text-xs">
        {moved ? (
          <>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-cyan-300 font-bold whitespace-nowrap">△ABC</span>
              <span className="text-white/40">→</span>
              <span className="text-pink-300 font-bold whitespace-nowrap">△A'B'C'</span>
              <span className="text-white/40">|</span>
              <span className="text-yellow-200 whitespace-nowrap">T({off.dx > 0 ? '+' : ''}{off.dx},{off.dy > 0 ? '+' : ''}{off.dy})</span>
            </div>
            {dirDesc && <span className="text-green-400 font-semibold whitespace-nowrap">{dirDesc}</span>}
          </>
        ) : (
          <span className="text-white/30 whitespace-nowrap">Tekan ↑ ↓ ← → untuk menggeser segitiga!</span>
        )}
      </div>

      {/* Controls — portrait only: DirPad centered + legend below */}
      <div className="flex flex-col items-center gap-4 sm:hidden">
        <DirPad onMove={move} onReset={() => { setOff({ dx: 0, dy: 0 }); setLastDir(null); }} />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
        <ArahLegend />
      </div>

      {/* Concept note */}
      <div className="bg-pink-950/40 border border-pink-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-pink-200 text-xs font-body">
          💡 Semua titik sudut bergeser dengan <strong>jarak dan arah yang sama</strong>.
          Bentuk & ukuran segitiga <strong className="text-green-300">tetap</strong> — hanya posisinya yang berubah!
        </p>
      </div>
    </div>
  );
}

/* ── Static diagrams ── */
const DiagramKonsep = () => (
  <Grid accent="#22d3ee">
    <Poly pts={[[-4, 1], [-2, 1], [-3, 3]]} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
    <Poly pts={[[-1, -2], [1, -2], [0, 0]]} color="#f472b6" fill="rgba(244,114,182,0.15)" label="△A'B'C'" />
    <Arrow x1={-4} y1={1} x2={-1} y2={-2} color="#facc15" />
    <Arrow x1={-2} y1={1} x2={1} y2={-2} color="#facc15" />
    <Arrow x1={-3} y1={3} x2={0} y2={0} color="#facc15" />
    <text x={px(-2)} y={py(0.3)} fontSize="8" fill="#fde68a" textAnchor="middle">T(3,−3)</text>
  </Grid>
);

/* ── Animated Diagram: Translasi Titik ── */
function DiagramTitikAnimated() {
  const [revealed, setRevealed] = useState(false);

  // SVG coords — A(-3,2) → mid(1,2) → A'(1,4)
  const aX  = px(-3), aY  = py(2);
  const mX  = px(1),  mY  = py(2);
  const a2X = px(1),  a2Y = py(4);
  const hLen = mX - aX;                          // ≈ 62.8 px
  const vLen = mY - a2Y;                         // ≈ 31.4 px (positive, going up)

  // Hop arcs — satu busur kecil per satuan langkah
  // Horizontal: 4 busur dari x=-3 ke x=1, melengkung ke BAWAH
  const hArcs = [-3,-2,-1,0].map(i =>
    `M ${px(i)},${aY} Q ${px(i + 0.5)},${aY + 13} ${px(i + 1)},${aY}`
  );
  // Vertikal: 2 busur dari y=2 ke y=4, melengkung ke KANAN
  const vArcs = [2,3].map(j =>
    `M ${a2X},${py(j)} Q ${a2X + 13},${py(j + 0.5)} ${a2X},${py(j + 1)}`
  );

  // opacity helper
  const op = (delay: number, dur = 0.4): React.CSSProperties =>
    ({ opacity: revealed ? 1 : 0, transition: revealed ? `opacity ${dur}s ease ${delay}s` : 'none' });

  // line-draw helper: opacity=0 hides fully; dashoffset drives the draw animation
  const ld = (len: number, dur: number, delay: number): React.CSSProperties =>
    ({ opacity: revealed ? 1 : 0,
       strokeDashoffset: revealed ? 0 : len,
       transition: revealed
         ? `opacity 0s, stroke-dashoffset ${dur}s ease-in-out ${delay}s`
         : 'none' });

  return (
    <div className="space-y-3">
      <div className="sm:max-w-[210px] sm:mx-auto">
      <Grid accent="#a78bfa">
          {/* Selalu tampil: titik asal A — label di KIRI titik */}
          <Dot x={-3} y={2} color="#22d3ee" />
          <text x={aX - 8} y={aY - 5} fontSize="8" fill="#22d3ee"
            textAnchor="end" fontWeight="bold">A(−3,2)</text>

          {/* ── Langkah 1: 4 hop busur ke kanan, slowmotion ── */}
          {hArcs.map((d, i) => (
            <path key={`ha${i}`} d={d} fill="none" stroke="#facc15" strokeWidth="1.8"
              strokeDasharray="35" style={ld(35, 0.5, i * 0.42)} />
          ))}
          {/* "+4" di bawah busur, tengah-tengah busur horizontal */}
          <text x={(aX + mX) / 2} y={aY + 14} fontSize="7.5" fill="#fde68a"
            textAnchor="middle" fontWeight="bold" style={op(1.55, 0.4)}>+4</text>
          {/* "a = 4" sedikit di bawah "+4" */}
          <text x={(aX + mX) / 2} y={aY + 22} fontSize="7" fill="#fde68a"
            textAnchor="middle" style={op(1.6, 0.35)}>a = 4</text>

          {/* ── Langkah 2: 2 hop busur ke atas, mulai setelah langkah 1 selesai ── */}
          <circle cx={mX} cy={mY} r={3} fill="#a78bfa" style={op(1.65, 0.3)} />
          {vArcs.map((d, i) => (
            <path key={`va${i}`} d={d} fill="none" stroke="#a78bfa" strokeWidth="1.8"
              strokeDasharray="35" style={ld(35, 0.5, 1.7 + i * 0.45)} />
          ))}
          {/* "↑ +2" di tengah busur vertikal, "b = 2" di bawahnya */}
          <text x={a2X + 8} y={(mY + a2Y) / 2 + 3} fontSize="7.5" fill="#c4b5fd"
            textAnchor="start" fontWeight="bold" style={op(2.5, 0.4)}>↑ +2</text>
          <text x={a2X + 8} y={(mY + a2Y) / 2 + 13} fontSize="7" fill="#c4b5fd"
            textAnchor="start" style={op(2.55, 0.35)}>b = 2</text>

          {/* ── A' muncul terakhir — label di KANAN titik ── */}
          <circle cx={a2X} cy={a2Y} r={5} fill="#f472b6" style={op(2.65, 0.5)} />
          <text x={a2X + 8} y={a2Y - 6} fontSize="8" fill="#f472b6"
            textAnchor="start" fontWeight="bold" style={op(2.65, 0.5)}>A'(1,4)</text>

          {/* T(4,2) — headline besar di pojok kiri atas, dengan text box cerah */}
          <rect
            x={px(-4.8) - 4} y={py(3.8) - 12}
            width={52} height={17}
            rx={4} ry={4}
            fill="#facc15"
            style={op(2.8, 0.4)}
          />
          <text x={px(-4.8)} y={py(3.8)} fontSize="11" fill="#1e1b4b"
            textAnchor="start" fontWeight="bold" style={op(2.8, 0.4)}>T(4,2)</text>
        </Grid>
      </div>

      {/* Reveal / Reset button */}
      <div className="flex justify-center">
        <button
          onClick={() => { playPopSound(); setRevealed(r => !r); }}
          className={`px-5 py-2 rounded-xl text-sm font-bold font-body transition-all active:scale-95
            ${revealed
              ? 'bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600/80'
              : 'bg-violet-500/20 border border-violet-400/50 text-violet-200 hover:bg-violet-500/40 hover:border-violet-300'
            }`}
        >
          {revealed ? '↺ Reset' : "✨ Tampilkan Bayangan A'"}
        </button>
      </div>
    </div>
  );
}

/* ── Animated Diagram: Translasi Bangun Datar ── */
function DiagramBangunAnimated() {
  const [revealed, setRevealed] = useState(false);

  const op = (delay: number, dur = 0.4): React.CSSProperties =>
    ({ opacity: revealed ? 1 : 0, transition: revealed ? `opacity ${dur}s ease ${delay}s` : 'none' });

  const ld = (len: number, dur: number, delay: number): React.CSSProperties =>
    ({ opacity: revealed ? 1 : 0,
       strokeDashoffset: revealed ? 0 : len,
       transition: revealed
         ? `opacity 0s, stroke-dashoffset ${dur}s ease-in-out ${delay}s`
         : 'none' });

  const ptsStr = (coords: [number,number][]) =>
    coords.map(([x, y]) => `${px(x)},${py(y)}`).join(' ');

  // Translation T(-3,-2)
  const A = -3, B = -2;
  const VERTS: [number,number][] = [[1,1],[4,1],[2,4]];

  // 3 horizontal arcs per vertex (going LEFT 3 steps, bowing DOWN like DiagramTitikAnimated)
  const mkHArcs = (vx: number, vy: number) =>
    [0,1,2].map(i =>
      `M ${px(vx-i)},${py(vy)} Q ${px(vx-i-0.5)},${py(vy)+13} ${px(vx-i-1)},${py(vy)}`
    );

  // 2 vertical arcs per vertex (going DOWN 2 steps, bowing RIGHT like DiagramTitikAnimated)
  const mkVArcs = (vx: number, vy: number) =>
    [0,1].map(j =>
      `M ${px(vx+A)},${py(vy-j)} Q ${px(vx+A)+13},${py(vy-j-0.5)} ${px(vx+A)},${py(vy-j-1)}`
    );

  return (
    <div className="space-y-3">
      <div className="sm:max-w-[210px] sm:mx-auto">
      <Grid accent="#f472b6">
        {/* ── Always visible: original △PQR ── */}
        <polygon points={ptsStr([[1,1],[4,1],[2,4]])}
          fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1.5" />
        <text x={px(2.3)} y={py(2)+4} fontSize="9" fill="#22d3ee" textAnchor="middle" fontWeight="bold">△PQR</text>
        <text x={px(1)-4} y={py(1)+13} fontSize="8" fill="#22d3ee" textAnchor="end" fontWeight="bold">P(1,1)</text>
        <text x={px(4)+4} y={py(1)+13} fontSize="8" fill="#22d3ee" textAnchor="start" fontWeight="bold">Q(4,1)</text>
        <text x={px(2)+4} y={py(4)-5} fontSize="8" fill="#22d3ee" textAnchor="start" fontWeight="bold">R(2,4)</text>

        {/* ── Langkah 1: 3 hop busur ke kiri (semua vertex serentak) ── */}
        {VERTS.map(([vx, vy]) =>
          mkHArcs(vx, vy).map((d, i) => (
            <path key={`h${vx}${vy}${i}`} d={d} fill="none" stroke="#facc15" strokeWidth="1.2"
              style={op(i * 0.38, 0.35)} />
          ))
        )}
        {/* "a = −3" di bawah busur P */}
        <text x={(px(1)+px(-2))/2} y={py(1)+18} fontSize="7.5" fill="#fde68a"
          textAnchor="middle" fontWeight="bold" style={op(1.15, 0.4)}>−3</text>
        <text x={(px(1)+px(-2))/2} y={py(1)+27} fontSize="7" fill="#fde68a"
          textAnchor="middle" style={op(1.2, 0.35)}>a = −3</text>

        {/* ── Titik elbow (posisi tengah setelah geser horizontal) ── */}
        {VERTS.map(([vx, vy]) => (
          <circle key={`m${vx}${vy}`} cx={px(vx+A)} cy={py(vy)} r={3} fill="#a78bfa" style={op(1.25, 0.3)} />
        ))}

        {/* ── Langkah 2: 2 hop busur ke bawah ── */}
        {VERTS.map(([vx, vy]) =>
          mkVArcs(vx, vy).map((d, j) => (
            <path key={`v${vx}${vy}${j}`} d={d} fill="none" stroke="#a78bfa" strokeWidth="1.2"
              style={op(1.3 + j * 0.42, 0.35)} />
          ))
        )}
        {/* "b = −2" di kanan busur vertikal P */}
        <text x={px(-2)+14} y={(py(1)+py(-1))/2+3} fontSize="7.5" fill="#c4b5fd"
          textAnchor="start" fontWeight="bold" style={op(2.1, 0.4)}>↓ −2</text>
        <text x={px(-2)+14} y={(py(1)+py(-1))/2+13} fontSize="7" fill="#c4b5fd"
          textAnchor="start" style={op(2.15, 0.35)}>b = −2</text>

        {/* ── Image dots + labels ── */}
        <circle cx={px(-2)} cy={py(-1)} r={5} fill="#f472b6" style={op(2.3, 0.5)} />
        <text x={px(-2)-7} y={py(-1)+13} fontSize="8" fill="#f472b6"
          textAnchor="end" fontWeight="bold" style={op(2.3, 0.5)}>P'(−2,−1)</text>

        <circle cx={px(1)} cy={py(-1)} r={5} fill="#f472b6" style={op(2.3, 0.5)} />
        <text x={px(1)+4} y={py(-1)+13} fontSize="8" fill="#f472b6"
          textAnchor="start" fontWeight="bold" style={op(2.3, 0.5)}>Q'(1,−1)</text>

        <circle cx={px(-1)} cy={py(2)} r={5} fill="#f472b6" style={op(2.3, 0.5)} />
        <text x={px(-1)-7} y={py(2)-5} fontSize="8" fill="#f472b6"
          textAnchor="end" fontWeight="bold" style={op(2.3, 0.5)}>R'(−1,2)</text>

        {/* ── △P'Q'R' polygon + label ── */}
        <polygon points={ptsStr([[-2,-1],[1,-1],[-1,2]])}
          fill="rgba(244,114,182,0.18)" stroke="#f472b6" strokeWidth="1.5"
          style={op(2.6, 0.5)} />
        <text x={px(-0.67)} y={py(0)+4} fontSize="9" fill="#f472b6"
          textAnchor="middle" fontWeight="bold" style={op(2.6, 0.5)}>△P'Q'R'</text>

        {/* ── T(−3,−2) bright text box — top-left ── */}
        <rect x={px(-4.8)-4} y={py(4.2)-12} width={66} height={17} rx={4} ry={4}
          fill="#facc15" style={op(2.75, 0.4)} />
        <text x={px(-4.8)} y={py(4.2)} fontSize="11" fill="#1e1b4b"
          textAnchor="start" fontWeight="bold" style={op(2.75, 0.4)}>T(−3,−2)</text>
      </Grid>
      </div>

      {/* Reveal / Reset button */}
      <div className="flex justify-center">
        <button
          onClick={() => { playPopSound(); setRevealed(r => !r); }}
          className={`px-5 py-2 rounded-xl text-sm font-bold font-body transition-all active:scale-95
            ${revealed
              ? 'bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600/80'
              : 'bg-pink-500/20 border border-pink-400/50 text-pink-200 hover:bg-pink-500/40 hover:border-pink-300'
            }`}
        >
          {revealed ? "↺ Reset" : "✨ Tampilkan Bayangan △P'Q'R'"}
        </button>
      </div>
    </div>
  );
}

/* ── Static section header (no toggle) ── */
function SectionHdr({ icon, color, title }: { icon: React.ReactNode; color: string; title: string }) {
  return (
    <div className="w-full flex items-center gap-3 px-5 py-4">
      <span style={{ color }}>{icon}</span>
      <span className="font-body font-semibold text-white">{title}</span>
    </div>
  );
}

/* ── Page ── */
const TranslasiPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <MoveRight className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-400 text-center mb-1">TRANSLASI (PERGESERAN)</h1>
        <p className="font-display text-sm font-semibold text-cyan-300 text-center mb-1">Memindahkan Bangun Tanpa Mengubah Bentuk!</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Transformasi Geometri · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<Lightbulb className="w-5 h-5" />} color="#facc15" title="🌟 Apa Itu Translasi?" />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                <strong className="text-cyan-300">Translasi</strong> adalah jenis transformasi yang memindahkan setiap titik pada suatu bangun ke posisi baru berdasarkan arah dan jarak tertentu, <strong className="text-white">tanpa mengubah bentuk, ukuran, maupun orientasi</strong> bangun tersebut.
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-cyan-300 font-body text-sm font-semibold">🔑 Kata Kunci:</p>
                <p className="text-white/80 text-sm font-body mt-1">Translasi ditentukan oleh sebuah <strong className="text-yellow-300">vektor translasi</strong> <InlineMath math="\begin{pmatrix}a\\b\end{pmatrix}" /> yang menunjukkan berapa jauh bangun digeser ke kanan/kiri (a) dan ke atas/bawah (b).</p>
              </div>
            </div>
          </div>

          {/* ── ANIMASI INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-cyan-500/30 rounded-xl overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎮</span>
                <span className="font-body font-bold text-cyan-300 text-sm">Coba Sendiri — Animasi Interaktif</span>
              </div>
              <p className="text-white/50 text-xs font-body">
                Geser titik dan segitiga menggunakan tombol arah. Perhatikan bahwa translasi hanya bergerak
                <strong className="text-yellow-300"> atas, bawah, kiri, atau kanan</strong> — tidak miring!
              </p>
            </div>
            <div className="mx-5 my-3 border-t border-white/10" />
            <div className="px-5 pb-4">
              <AnimasiTitik />
            </div>
            <div className="mx-5 my-1 border-t border-white/10" />
            <div className="px-5 pb-4 pt-3">
              <AnimasiSegitiga />
            </div>

            {/* Sifat translasi */}
            <div className="mx-5 mb-5 grid grid-cols-2 gap-3">
              {[["✅ Bentuk", "Tetap sama"], ["✅ Ukuran", "Tetap sama"], ["✅ Orientasi", "Tetap sama"], ["❌ Posisi", "Berubah"]].map(([k, v]) => (
                <div key={k} className="bg-slate-800/60 rounded-lg p-3 text-center">
                  <p className="text-xs font-semibold text-white/60 font-body">{k}</p>
                  <p className="text-sm font-bold text-white font-body">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<Calculator className="w-5 h-5" />} color="#22d3ee" title="📐 Rumus Translasi" />
            <div className="px-5 pb-5 space-y-4">
              <p className="text-sm text-white/80 font-body">Jika titik <InlineMath math="A(x, y)" /> ditranslasikan oleh vektor <InlineMath math="T = \begin{pmatrix}a\\b\end{pmatrix}" />, maka bayangan <InlineMath math="A'(x', y')" /> adalah:</p>
              <div className="bg-cyan-950/60 border border-cyan-500/40 rounded-xl p-5 text-center">
                <BlockMath math="A(x,y) \xrightarrow{T\begin{pmatrix}a\\b\end{pmatrix}} A'(x+a,\; y+b)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                  <p className="text-xs text-white/50 font-body mb-1">Komponen x</p>
                  <BlockMath math="x' = x + a" />
                  <p className="text-xs text-white/60 font-body">a &gt; 0: geser kanan<br />a &lt; 0: geser kiri</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                  <p className="text-xs text-white/50 font-body mb-1">Komponen y</p>
                  <BlockMath math="y' = y + b" />
                  <p className="text-xs text-white/60 font-body">b &gt; 0: geser atas<br />b &lt; 0: geser bawah</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH TITIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title="📌 Contoh: Translasi Titik" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-violet-300 font-body mb-2">Soal:</p>
                <p className="text-sm text-white/80 font-body">Tentukan bayangan titik <InlineMath math="A(-3, 2)" /> oleh translasi <InlineMath math="T = \begin{pmatrix}4\\2\end{pmatrix}" /></p>
              </div>
              <DiagramTitikAnimated />
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-cyan-300 font-body">Penyelesaian:</p>
                <div className="space-y-1 text-sm font-body text-white/80">
                  <p>• <InlineMath math="a = 4, \; b = 2" /></p>
                  <p>• <InlineMath math="x' = x + a = -3 + 4 = 1" /></p>
                  <p>• <InlineMath math="y' = y + b = 2 + 2 = 4" /></p>
                  <div className="mt-2 bg-cyan-500/15 rounded-lg p-2 text-center">
                    <p className="text-cyan-300 font-bold">Bayangan: <InlineMath math="A'(1, 4)" /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH BANGUN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<BookOpen className="w-5 h-5" />} color="#f472b6" title="📐 Contoh: Translasi Bangun Datar" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-pink-300 font-body mb-2">Soal:</p>
                <p className="text-sm text-white/80 font-body">Segitiga PQR dengan <InlineMath math="P(1,1), Q(4,1), R(2,4)" /> ditranslasikan oleh <InlineMath math="T = \begin{pmatrix}-3\\-2\end{pmatrix}" />. Tentukan bayangan!</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-pink-300 font-body">Penyelesaian (terapkan ke setiap titik):</p>
                {[
                  { titik: "P(1,1)", x: 1, y: 1, a: -3, b: -2, hasil: "P'(−2, −1)" },
                  { titik: "Q(4,1)", x: 4, y: 1, a: -3, b: -2, hasil: "Q'(1, −1)" },
                  { titik: "R(2,4)", x: 2, y: 4, a: -3, b: -2, hasil: "R'(−1, 2)" },
                ].map(({ titik, x, y, a, b, hasil }) => (
                  <div key={titik} className="bg-slate-900/60 rounded-lg p-3">
                    <p className="text-xs text-white/60 font-body font-semibold mb-1">{titik}</p>
                    <p className="text-sm font-body text-white/80">
                      <InlineMath math={`x' = ${x} + (${a}) = ${x + a}`} />{" "}&nbsp;<InlineMath math={`\\quad y' = ${y} + (${b}) = ${y + b}`} />
                    </p>
                    <p className="text-cyan-300 text-sm font-bold font-body mt-1">→ {hasil}</p>
                  </div>
                ))}
              </div>
              <DiagramBangunAnimated />
            </div>
          </div>

          {/* VEKTOR KOMPOSISI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<Calculator className="w-5 h-5" />} color="#4ade80" title="🔗 Komposisi Translasi" />
            <div className="px-5 pb-5 space-y-4">
              <p className="text-sm text-white/80 font-body">Jika suatu titik dikenai dua translasi berturut-turut, kita bisa menggabungkan keduanya:</p>
              <div className="bg-green-950/50 border border-green-500/30 rounded-xl p-4">
                <BlockMath math="T_1\begin{pmatrix}a_1\\b_1\end{pmatrix} \text{ lalu } T_2\begin{pmatrix}a_2\\b_2\end{pmatrix} \equiv T\begin{pmatrix}a_1+a_2\\b_1+b_2\end{pmatrix}" />
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-green-300 font-body">Contoh:</p>
                <p className="text-sm text-white/80 font-body">Titik <InlineMath math="A(2,3)" /> dikenai <InlineMath math="T_1\begin{pmatrix}3\\-1\end{pmatrix}" /> lalu <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /></p>
                <div className="space-y-1 text-sm font-body text-white/80 mt-2">
                  <p>Gabung: <InlineMath math="T = \begin{pmatrix}3+(-1)\\-1+4\end{pmatrix} = \begin{pmatrix}2\\3\end{pmatrix}" /></p>
                  <p>Bayangan: <InlineMath math="A'(2+2,\; 3+3) = A'(4, 6)" /></p>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<Target className="w-5 h-5" />} color="#f97316" title="🎯 Rangkuman" />
            <div className="px-5 pb-5 space-y-3">
              {[
                ["Definisi", "Memindahkan setiap titik sejauh dan searah vektor translasi T(a, b)"],
                ["Rumus", "A(x, y) → A'(x + a, y + b)"],
                ["Sifat", "Bentuk, ukuran, dan orientasi bangun tidak berubah"],
                ["Komposisi", "Dua translasi dapat digabung: T = T₁ + T₂"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-3">
                  <span className="text-orange-400 font-bold text-sm font-body min-w-[90px]">{k}</span>
                  <span className="text-white/80 text-sm font-body">{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TranslasiPage;
