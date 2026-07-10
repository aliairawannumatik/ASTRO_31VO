import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, MoveRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { language } = useLanguage();
  const t = {
    id: {
      title: "Petunjuk Arah",
      vecLabel: "Vektor translasi",
      dirs: [
        ["→", "Geser Kanan", "(+a)"],
        ["←", "Geser Kiri",  "(−a)"],
        ["↑", "Geser Atas",  "(+b)"],
        ["↓", "Geser Bawah", "(−b)"],
      ],
      diag: "Miring",
      notAllowed: "❌ Tidak diizinkan",
    },
    en: {
      title: "Direction Guide",
      vecLabel: "Translation vector",
      dirs: [
        ["→", "Shift Right", "(+a)"],
        ["←", "Shift Left",  "(−a)"],
        ["↑", "Shift Up",    "(+b)"],
        ["↓", "Shift Down",  "(−b)"],
      ],
      diag: "Diagonal",
      notAllowed: "❌ Not allowed",
    },
    ja: {
      title: "方向ガイド",
      vecLabel: "移動ベクトル",
      dirs: [
        ["→", "右へ", "(+a)"],
        ["←", "左へ", "(−a)"],
        ["↑", "上へ", "(+b)"],
        ["↓", "下へ", "(−b)"],
      ],
      diag: "斜め方向",
      notAllowed: "❌ 不可",
    },
  }[language];

  return (
    <div className="w-full bg-slate-800/70 border border-slate-600/40 rounded-xl px-4 py-3 text-xs font-body">
      <p className="text-white/50 font-semibold text-[10px] uppercase tracking-wider mb-2">{t.title}</p>
      <p className="text-yellow-300/80 text-[10px] font-body mb-2">
        {t.vecLabel} <span className="font-bold text-yellow-300">T(a, b)</span>
      </p>
      <div className="grid grid-cols-1 gap-y-1.5">
        {t.dirs.map(([arrow, label, note]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-green-400 font-bold w-4 text-center shrink-0">{arrow}</span>
            <span className="text-green-300/80">{label}</span>
            <span className="text-yellow-300/70 text-[9px]">{note}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-slate-600/40 flex items-center gap-2">
        <span className="text-red-400 font-bold">↗</span>
        <span className="text-red-400/80 line-through text-[11px]">{t.diag}</span>
        <span className="text-red-400 text-[10px]">{t.notAllowed}</span>
      </div>
    </div>
  );
}

/* ── Animasi 1: Geser Titik ── */
function AnimasiTitik() {
  const { language } = useLanguage();
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

  const t = {
    id: {
      title: "📍 Animasi 1 —",
      titleSub: "Translasi Titik",
      subtitle: "Tekan tombol arah untuk menggeser titik A",
      idle: "Tekan ↑ ↓ ← → untuk menggeser titik!",
      up: "⬆ Geser Atas", down: "⬇ Geser Bawah", left: "⬅ Geser Kiri", right: "➡ Geser Kanan",
      note: <>💡 Setiap kali ditekan, titik bergeser <strong>1 satuan</strong> ke satu arah saja. Inilah yang disebut <strong className="text-yellow-300">translasi</strong> — geser lurus, tidak miring!</>,
    },
    en: {
      title: "📍 Animation 1 —",
      titleSub: "Point Translation",
      subtitle: "Press direction buttons to shift point A",
      idle: "Press ↑ ↓ ← → to shift the point!",
      up: "⬆ Shift Up", down: "⬇ Shift Down", left: "⬅ Shift Left", right: "➡ Shift Right",
      note: <>💡 Each press moves the point <strong>1 unit</strong> in one direction only. This is called <strong className="text-yellow-300">translation</strong> — straight shift, not diagonal!</>,
    },
    ja: {
      title: "📍 アニメーション1 —",
      titleSub: "点の平行移動",
      subtitle: "方向ボタンを押して点Aを動かしましょう",
      idle: "↑ ↓ ← → を押して点を動かそう！",
      up: "⬆ 上へ", down: "⬇ 下へ", left: "⬅ 左へ", right: "➡ 右へ",
      note: <>💡 ボタンを押すたびに、点が<strong>1単位</strong>だけ1方向に動きます。これが<strong className="text-yellow-300">平行移動</strong>です — 斜めには動きません！</>,
    },
  }[language];

  const dirDesc = lastDir === 'up' ? t.up : lastDir === 'down' ? t.down
    : lastDir === 'left' ? t.left : lastDir === 'right' ? t.right : null;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-cyan-300 font-bold text-sm font-body">{t.title}<br className="sm:hidden" /> {t.titleSub}</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">{t.subtitle}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent="#22d3ee">
            <Dot x={OX} y={OY} color="#ef4444" labelColor="#22d3ee" label={`A(${OX},${OY})`} ghost />
            {moved && <Arrow x1={OX} y1={OY} x2={pos.x} y2={pos.y} color="#facc15" />}
            {moved && (
              <text
                x={(px(OX) + px(pos.x)) / 2 + (dy !== 0 ? 12 : 0)}
                y={(py(OY) + py(pos.y)) / 2 + (dx !== 0 ? -6 : 0)}
                fill="#fde68a" fontSize="8" textAnchor="middle" fontWeight="bold"
              >T({dx > 0 ? '+' : ''}{dx},{dy > 0 ? '+' : ''}{dy})</text>
            )}
            <Dot x={pos.x} y={pos.y} color="#ef4444" labelColor="#ef4444" label={moved ? `A'(${pos.x},${pos.y})` : `A(${pos.x},${pos.y})`} />
          </Grid>
        </div>
        <div className="hidden sm:flex sm:shrink-0 sm:items-center sm:justify-center">
          <DirPad onMove={move} onReset={() => { setPos({ x: OX, y: OY }); setLastDir(null); }} />
        </div>
      </div>
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
          <span className="text-white/30 whitespace-nowrap">{t.idle}</span>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 sm:hidden">
        <DirPad onMove={move} onReset={() => { setPos({ x: OX, y: OY }); setLastDir(null); }} />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
        <ArahLegend />
      </div>
      <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-cyan-300 text-xs font-body">{t.note}</p>
      </div>
    </div>
  );
}

/* ── Animasi 2: Geser Segitiga ── */
type Vec2 = [number, number];
const TRI_BASE: Vec2[] = [[-3, -1], [0, -1], [-2, 2]];
const TRI_LABELS = ['A', 'B', 'C'];

function AnimasiSegitiga() {
  const { language } = useLanguage();
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

  const t = {
    id: {
      title: "🔺 Animasi 2 —",
      titleSub: "Translasi Bangun Datar",
      subtitle: "Tekan tombol arah untuk menggeser segitiga ABC",
      idle: "Tekan ↑ ↓ ← → untuk menggeser segitiga!",
      up: "⬆ Geser Atas", down: "⬇ Geser Bawah", left: "⬅ Geser Kiri", right: "➡ Geser Kanan",
      note: <>💡 Semua titik sudut bergeser dengan <strong>jarak dan arah yang sama</strong>. Bentuk & ukuran segitiga <strong className="text-green-300">tetap</strong> — hanya posisinya yang berubah!</>,
    },
    en: {
      title: "🔺 Animation 2 —",
      titleSub: "Shape Translation",
      subtitle: "Press direction buttons to shift triangle ABC",
      idle: "Press ↑ ↓ ← → to shift the triangle!",
      up: "⬆ Shift Up", down: "⬇ Shift Down", left: "⬅ Shift Left", right: "➡ Shift Right",
      note: <>💡 All vertices shift by the <strong>same distance and direction</strong>. The triangle's shape & size <strong className="text-green-300">remain unchanged</strong> — only its position changes!</>,
    },
    ja: {
      title: "🔺 アニメーション2 —",
      titleSub: "図形の平行移動",
      subtitle: "方向ボタンを押して三角形ABCを動かしましょう",
      idle: "↑ ↓ ← → を押して三角形を動かそう！",
      up: "⬆ 上へ", down: "⬇ 下へ", left: "⬅ 左へ", right: "➡ 右へ",
      note: <>💡 全ての頂点が<strong>同じ距離・方向</strong>に移動します。三角形の形と大きさは<strong className="text-green-300">変わりません</strong> — 位置だけが変わります！</>,
    },
  }[language];

  const dirDesc = lastDir === 'up' ? t.up : lastDir === 'down' ? t.down
    : lastDir === 'left' ? t.left : lastDir === 'right' ? t.right : null;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-pink-300 font-bold text-sm font-body">{t.title}<br className="sm:hidden" /> {t.titleSub}</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">{t.subtitle}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent="#f472b6">
            <Poly pts={TRI_BASE} color="#22d3ee" fill="rgba(34,211,238,0.08)" dashed />
            {TRI_BASE.map(([x, y], i) => (
              <text key={i} x={px(x) + (i === 1 ? 6 : i === 0 ? -14 : -4)} y={py(y) + (i === 2 ? -5 : 10)}
                fill="#22d3ee" fontSize="8" fillOpacity={0.45}>{TRI_LABELS[i]}({x},{y})</text>
            ))}
            {moved && TRI_BASE.map(([x, y], i) => (
              <Arrow key={i} x1={x} y1={y} x2={x + off.dx} y2={y + off.dy} color="#facc15" />
            ))}
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
            <Poly pts={current} color="#f472b6" fill="rgba(244,114,182,0.18)" label={moved ? "△A'B'C'" : "△ABC"} />
            {moved && current.map(([x, y], i) => (
              <text key={i} x={px(x) + (i === 1 ? 6 : i === 0 ? -18 : -4)} y={py(y) + (i === 2 ? -5 : 10)}
                fill="#f472b6" fontSize="8">{TRI_LABELS[i]}'({x},{y})</text>
            ))}
          </Grid>
        </div>
        <div className="hidden sm:flex sm:shrink-0 sm:items-center sm:justify-center">
          <DirPad onMove={move} onReset={() => { setOff({ dx: 0, dy: 0 }); setLastDir(null); }} />
        </div>
      </div>
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
          <span className="text-white/30 whitespace-nowrap">{t.idle}</span>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 sm:hidden">
        <DirPad onMove={move} onReset={() => { setOff({ dx: 0, dy: 0 }); setLastDir(null); }} />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
        <ArahLegend />
      </div>
      <div className="bg-pink-950/40 border border-pink-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-pink-200 text-xs font-body">{t.note}</p>
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
  const { language } = useLanguage();
  const [revealed, setRevealed] = useState(false);

  const btnReveal = { id: "✨ Tampilkan Bayangan A'", en: "✨ Show Image A'", ja: "✨ 像 A' を表示" }[language];
  const btnReset  = { id: "↺ Reset", en: "↺ Reset", ja: "↺ リセット" }[language];

  const aX  = px(-3), aY  = py(2);
  const mX  = px(1),  mY  = py(2);
  const a2X = px(1),  a2Y = py(4);

  const hArcs = [-3,-2,-1,0].map(i =>
    `M ${px(i)},${aY} Q ${px(i + 0.5)},${aY + 13} ${px(i + 1)},${aY}`
  );
  const vArcs = [2,3].map(j =>
    `M ${a2X},${py(j)} Q ${a2X + 13},${py(j + 0.5)} ${a2X},${py(j + 1)}`
  );

  const op = (delay: number, dur = 0.4): React.CSSProperties =>
    ({ opacity: revealed ? 1 : 0, transition: revealed ? `opacity ${dur}s ease ${delay}s` : 'none' });

  const ld = (len: number, dur: number, delay: number): React.CSSProperties =>
    ({ opacity: revealed ? 1 : 0,
       strokeDashoffset: revealed ? 0 : len,
       transition: revealed
         ? `opacity 0s, stroke-dashoffset ${dur}s ease-in-out ${delay}s`
         : 'none' });

  return (
    <div className="space-y-3">
      <div className="sm:max-w-[350px] sm:mx-auto">
      <Grid accent="#a78bfa">
          <Dot x={-3} y={2} color="#22d3ee" />
          <text x={aX - 8} y={aY - 5} fontSize="8" fill="#22d3ee"
            textAnchor="end" fontWeight="bold">A(−3,2)</text>
          {hArcs.map((d, i) => (
            <path key={`ha${i}`} d={d} fill="none" stroke="#facc15" strokeWidth="1.8"
              strokeDasharray="35" style={ld(35, 0.5, i * 0.42)} />
          ))}
          <text x={(aX + mX) / 2} y={aY + 14} fontSize="7.5" fill="#fde68a"
            textAnchor="middle" fontWeight="bold" style={op(1.55, 0.4)}>+4</text>
          <text x={(aX + mX) / 2} y={aY + 22} fontSize="7" fill="#fde68a"
            textAnchor="middle" style={op(1.6, 0.35)}>a = 4</text>
          <circle cx={mX} cy={mY} r={3} fill="#a78bfa" style={op(1.65, 0.3)} />
          {vArcs.map((d, i) => (
            <path key={`va${i}`} d={d} fill="none" stroke="#a78bfa" strokeWidth="1.8"
              strokeDasharray="35" style={ld(35, 0.5, 1.7 + i * 0.45)} />
          ))}
          <text x={a2X + 8} y={(mY + a2Y) / 2 + 3} fontSize="7.5" fill="#c4b5fd"
            textAnchor="start" fontWeight="bold" style={op(2.5, 0.4)}>↑ +2</text>
          <text x={a2X + 8} y={(mY + a2Y) / 2 + 13} fontSize="7" fill="#c4b5fd"
            textAnchor="start" style={op(2.55, 0.35)}>b = 2</text>
          <circle cx={a2X} cy={a2Y} r={5} fill="#f472b6" style={op(2.65, 0.5)} />
          <text x={a2X + 8} y={a2Y - 6} fontSize="8" fill="#f472b6"
            textAnchor="start" fontWeight="bold" style={op(2.65, 0.5)}>A'(1,4)</text>
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
      <div className="flex justify-center">
        <button
          onClick={() => { playPopSound(); setRevealed(r => !r); }}
          className={`px-5 py-2 rounded-xl text-sm font-bold font-body transition-all active:scale-95
            ${revealed
              ? 'bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600/80'
              : 'bg-violet-500/20 border border-violet-400/50 text-violet-200 hover:bg-violet-500/40 hover:border-violet-300'
            }`}
        >
          {revealed ? btnReset : btnReveal}
        </button>
      </div>
    </div>
  );
}

/* ── Animated Diagram: Translasi Bangun Datar ── */
function DiagramBangunAnimated() {
  const { language } = useLanguage();
  const [revealed, setRevealed] = useState(false);

  const btnReveal = { id: "✨ Tampilkan Bayangan △P'Q'R'", en: "✨ Show Image △P'Q'R'", ja: "✨ 像 △P'Q'R' を表示" }[language];
  const btnReset  = { id: "↺ Reset", en: "↺ Reset", ja: "↺ リセット" }[language];

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

  const A = -3, B = -2;
  const VERTS: [number,number][] = [[1,1],[4,1],[2,4]];

  const mkHArcs = (vx: number, vy: number) =>
    [0,1,2].map(i =>
      `M ${px(vx-i)},${py(vy)} Q ${px(vx-i-0.5)},${py(vy)+13} ${px(vx-i-1)},${py(vy)}`
    );

  const mkVArcs = (vx: number, vy: number) =>
    [0,1].map(j =>
      `M ${px(vx+A)},${py(vy-j)} Q ${px(vx+A)+13},${py(vy-j-0.5)} ${px(vx+A)},${py(vy-j-1)}`
    );

  return (
    <div className="space-y-3">
      <div className="sm:max-w-[350px] sm:mx-auto">
      <Grid accent="#f472b6">
        <polygon points={ptsStr([[1,1],[4,1],[2,4]])}
          fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1.5" />
        <text x={px(2.3)} y={py(2)+4} fontSize="9" fill="#22d3ee" textAnchor="middle" fontWeight="bold">△PQR</text>
        <text x={px(1)-4} y={py(1)+13} fontSize="8" fill="#22d3ee" textAnchor="end" fontWeight="bold">P(1,1)</text>
        <text x={px(4)+4} y={py(1)+13} fontSize="8" fill="#22d3ee" textAnchor="start" fontWeight="bold">Q(4,1)</text>
        <text x={px(2)+4} y={py(4)-5} fontSize="8" fill="#22d3ee" textAnchor="start" fontWeight="bold">R(2,4)</text>
        {VERTS.map(([vx, vy]) =>
          mkHArcs(vx, vy).map((d, i) => (
            <path key={`h${vx}${vy}${i}`} d={d} fill="none" stroke="#facc15" strokeWidth="1.2"
              style={op(i * 0.38, 0.35)} />
          ))
        )}
        <text x={(px(1)+px(-2))/2} y={py(1)+18} fontSize="7.5" fill="#fde68a"
          textAnchor="middle" fontWeight="bold" style={op(1.15, 0.4)}>−3</text>
        <text x={(px(1)+px(-2))/2} y={py(1)+27} fontSize="7" fill="#fde68a"
          textAnchor="middle" style={op(1.2, 0.35)}>a = −3</text>
        {VERTS.map(([vx, vy]) => (
          <circle key={`m${vx}${vy}`} cx={px(vx+A)} cy={py(vy)} r={3} fill="#a78bfa" style={op(1.25, 0.3)} />
        ))}
        {VERTS.map(([vx, vy]) =>
          mkVArcs(vx, vy).map((d, j) => (
            <path key={`v${vx}${vy}${j}`} d={d} fill="none" stroke="#a78bfa" strokeWidth="1.2"
              style={op(1.3 + j * 0.42, 0.35)} />
          ))
        )}
        <text x={px(-2)+14} y={(py(1)+py(-1))/2+3} fontSize="7.5" fill="#c4b5fd"
          textAnchor="start" fontWeight="bold" style={op(2.1, 0.4)}>↓ −2</text>
        <text x={px(-2)+14} y={(py(1)+py(-1))/2+13} fontSize="7" fill="#c4b5fd"
          textAnchor="start" style={op(2.15, 0.35)}>b = −2</text>
        <circle cx={px(-2)} cy={py(-1)} r={5} fill="#f472b6" style={op(2.3, 0.5)} />
        <text x={px(-2)-7} y={py(-1)+13} fontSize="8" fill="#f472b6"
          textAnchor="end" fontWeight="bold" style={op(2.3, 0.5)}>P'(−2,−1)</text>
        <circle cx={px(1)} cy={py(-1)} r={5} fill="#f472b6" style={op(2.3, 0.5)} />
        <text x={px(1)+4} y={py(-1)+13} fontSize="8" fill="#f472b6"
          textAnchor="start" fontWeight="bold" style={op(2.3, 0.5)}>Q'(1,−1)</text>
        <circle cx={px(-1)} cy={py(2)} r={5} fill="#f472b6" style={op(2.3, 0.5)} />
        <text x={px(-1)-7} y={py(2)-5} fontSize="8" fill="#f472b6"
          textAnchor="end" fontWeight="bold" style={op(2.3, 0.5)}>R'(−1,2)</text>
        <polygon points={ptsStr([[-2,-1],[1,-1],[-1,2]])}
          fill="rgba(244,114,182,0.18)" stroke="#f472b6" strokeWidth="1.5"
          style={op(2.6, 0.5)} />
        <text x={px(-0.67)} y={py(0)+4} fontSize="9" fill="#f472b6"
          textAnchor="middle" fontWeight="bold" style={op(2.6, 0.5)}>△P'Q'R'</text>
        <rect x={px(-4.8)-4} y={py(4.2)-12} width={66} height={17} rx={4} ry={4}
          fill="#facc15" style={op(2.75, 0.4)} />
        <text x={px(-4.8)} y={py(4.2)} fontSize="11" fill="#1e1b4b"
          textAnchor="start" fontWeight="bold" style={op(2.75, 0.4)}>T(−3,−2)</text>
      </Grid>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => { playPopSound(); setRevealed(r => !r); }}
          className={`px-5 py-2 rounded-xl text-sm font-bold font-body transition-all active:scale-95
            ${revealed
              ? 'bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600/80'
              : 'bg-pink-500/20 border border-pink-400/50 text-pink-200 hover:bg-pink-500/40 hover:border-pink-300'
            }`}
        >
          {revealed ? btnReset : btnReveal}
        </button>
      </div>
    </div>
  );
}

/* ── Parse linear equation y=mx+c ── */
function parseLinear(eq: string): { m: number; c: number } | null {
  const s = eq.replace(/\s/g, '').toLowerCase();
  if (!s.startsWith('y=')) return null;
  const rhs = s.slice(2);
  if (!rhs) return null;
  if (/^-?\d+\.?\d*$/.test(rhs)) return { m: 0, c: parseFloat(rhs) };
  const match = rhs.match(/^(-?\d*\.?\d*)x([+-]\d+\.?\d*)?$/);
  if (match) {
    const coef = match[1];
    let m = coef === '' || coef === undefined ? 1 : coef === '-' ? -1 : parseFloat(coef);
    const c = match[2] ? parseFloat(match[2]) : 0;
    if (isNaN(m) || isNaN(c)) return null;
    return { m, c };
  }
  return null;
}

function fmtLine(m: number, c: number): string {
  if (m === 0) return `y = ${c}`;
  const ms = m === 1 ? '' : m === -1 ? '-' : `${m}`;
  const cp = c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
  return `y = ${ms}x${cp}`;
}

/* ── Parse standard form ax + by = c ── */
function parseStandard(eq: string): { m: number; c: number; a: number; b_coef: number; c_val: number } | null {
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
    const coef = xMatch[2];
    a = sign * (coef === '' ? 1 : parseFloat(coef));
    if (isNaN(a)) return null;
  }
  if (yMatch) {
    const sign = yMatch[1] === '-' ? -1 : 1;
    const coef = yMatch[2];
    b_coef = sign * (coef === '' ? 1 : parseFloat(coef));
    if (isNaN(b_coef)) return null;
  }
  if (b_coef === 0) return null;
  const m = -a / b_coef;
  const c = c_val / b_coef;
  if (!isFinite(m) || !isFinite(c)) return null;
  return { m, c, a, b_coef, c_val };
}

/* ── Format result in ax + by = c notation ── */
function fmtStandard(a: number, b: number, c: number): string {
  let res = '';
  if (a !== 0) {
    res += a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
  }
  if (b !== 0) {
    if (res === '') {
      res += b === 1 ? 'y' : b === -1 ? '-y' : `${b}y`;
    } else {
      if (b === 1)       res += ' + y';
      else if (b === -1) res += ' - y';
      else if (b > 0)    res += ` + ${b}y`;
      else               res += ` - ${Math.abs(b)}y`;
    }
  }
  const cRound = Math.round(c * 10000) / 10000;
  res += ` = ${cRound}`;
  return res;
}

/* ── Animasi Kurva Linear ── */
function AnimasiKurva() {
  const { language } = useLanguage();
  const [formType, setFormType] = useState<'slope' | 'standard'>('slope');
  const [inputSlope, setInputSlope] = useState('y=2x+1');
  const [inputStd,   setInputStd]   = useState('2x+3y=6');
  const [inputA, setInputA] = useState('3');
  const [inputB, setInputB] = useState('2');
  const [show, setShow] = useState(false);

  const isStd = formType === 'standard';
  const input    = isStd ? inputStd   : inputSlope;
  const setInput = isStd ? setInputStd : setInputSlope;

  const transA = parseFloat(inputA) || 0;
  const transB = parseFloat(inputB) || 0;

  const parsedSlope = isStd ? null : parseLinear(input);
  const parsedStd   = isStd ? parseStandard(input) : null;
  const parsed      = isStd ? parsedStd : parsedSlope;
  const isValid     = parsed !== null;

  const imgM  = parsed?.m ?? 0;
  const imgC  = isValid && parsed ? (parsed.c - parsed.m * transA + transB) : 0;

  const newCval = (parsedStd && isValid)
    ? parsedStd.c_val + parsedStd.a * transA + parsedStd.b_coef * transB
    : 0;

  const handleKey = (k: string) => {
    playPopSound();
    setShow(false);
    if (k === '⌫')  { setInput(p => p.slice(0, -1)); return; }
    if (k === 'CLR') { setInput(''); return; }
    setInput(p => p + k);
  };

  const rowsSlope = [
    ['7','8','9','+','y'],
    ['4','5','6','-','x'],
    ['1','2','3','.','='],
    ['0','CLR','⌫'],
  ];
  const rowsStd = [
    ['7','8','9','+','x'],
    ['4','5','6','-','y'],
    ['1','2','3','.','='],
    ['0','CLR','⌫'],
  ];
  const rows = isStd ? rowsStd : rowsSlope;

  const handleReset = () => {
    playPopSound();
    setShow(false);
    if (isStd) { setInputStd('2x+3y=6'); } else { setInputSlope('y=2x+1'); }
    setInputA('3');
    setInputB('2');
  };

  const handleToggle = (t: 'slope' | 'standard') => {
    playPopSound();
    setShow(false);
    setFormType(t);
  };

  const ui = {
    id: {
      animTitle: "📈 Animasi Interaktif — Translasi Kurva Linear",
      eqLabel: "Persamaan Garis",
      kbLabel: "Keyboard",
      errSlope: "Format: y=mx+c · Contoh: y=2x+1 · y=-3x",
      errStd:   "Format: ax+by=c · Contoh: 2x+3y=6 · x-y=4 · -x+2y=8",
      valA: "a (geser x)", valB: "b (geser y)",
      nilaiOf: "Nilai",
      showBtn: "▶ Tampilkan Translasi",
      legendOrig: "Garis asli", legendImg: "Bayangan", legendVec: "Vektor",
      resultHdrSlope: "HASIL TRANSLASI:",
      resultHdrStd: "HASIL TRANSLASI (bentuk ax + by = c):",
      coefUnchanged: "Koefisien a, b tetap:",
      cNew: "c baru = c + a·p + b·q",
      equiv: "Setara:",
    },
    en: {
      animTitle: "📈 Interactive Animation — Translation of a Linear Curve",
      eqLabel: "Line Equation",
      kbLabel: "Keyboard",
      errSlope: "Format: y=mx+c · Example: y=2x+1 · y=-3x",
      errStd:   "Format: ax+by=c · Example: 2x+3y=6 · x-y=4 · -x+2y=8",
      valA: "a (x-shift)", valB: "b (y-shift)",
      nilaiOf: "Value of",
      showBtn: "▶ Show Translation",
      legendOrig: "Original line", legendImg: "Image", legendVec: "Vector",
      resultHdrSlope: "TRANSLATION RESULT:",
      resultHdrStd: "TRANSLATION RESULT (ax + by = c form):",
      coefUnchanged: "Coefficients a, b unchanged:",
      cNew: "new c = c + a·p + b·q",
      equiv: "Equivalent:",
    },
    ja: {
      animTitle: "📈 インタラクティブアニメーション — 一次関数の平行移動",
      eqLabel: "直線の方程式",
      kbLabel: "キーボード",
      errSlope: "形式: y=mx+c · 例: y=2x+1 · y=-3x",
      errStd:   "形式: ax+by=c · 例: 2x+3y=6 · x-y=4 · -x+2y=8",
      valA: "a（x方向の移動）", valB: "b（y方向の移動）",
      nilaiOf: "値",
      showBtn: "▶ 平行移動を表示",
      legendOrig: "元の直線", legendImg: "像", legendVec: "移動ベクトル",
      resultHdrSlope: "平行移動の結果：",
      resultHdrStd: "平行移動の結果（ax + by = c の形）：",
      coefUnchanged: "係数a, bは変わらない：",
      cNew: "新しいc = c + a·p + b·q",
      equiv: "等価：",
    },
  }[language];

  return (
    <div className="space-y-4 pt-2">
      <p className="text-emerald-300 font-bold text-sm font-body">{ui.animTitle}</p>

      <div className="flex rounded-xl overflow-hidden border border-slate-600/50 bg-slate-800/50">
        <button
          onClick={() => handleToggle('slope')}
          className={`flex-1 py-2 text-xs font-bold font-mono transition-all
            ${!isStd ? 'bg-emerald-500/30 text-emerald-200 border-r border-emerald-500/40' : 'text-white/40 hover:text-white/70'}`}
        >y = mx + c</button>
        <button
          onClick={() => handleToggle('standard')}
          className={`flex-1 py-2 text-xs font-bold font-mono transition-all
            ${isStd ? 'bg-violet-500/30 text-violet-200' : 'text-white/40 hover:text-white/70'}`}
        >ax + by = c</button>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">{ui.eqLabel}</p>
        <div className={`bg-slate-800 border rounded-lg px-4 py-2.5 font-mono text-white text-sm min-h-[40px] flex items-center gap-0.5
          ${isStd ? 'border-violet-500/50' : 'border-slate-500'}`}>
          <span>{input || <span className="text-white/30">{language === 'ja' ? '入力...' : language === 'en' ? 'type...' : 'ketik...'}</span>}</span>
          <span className="animate-pulse text-cyan-400">|</span>
        </div>
        {!isValid && input.length > 0 && (
          <p className="text-[11px] text-red-400 font-body">
            {isStd ? ui.errStd : ui.errSlope}
          </p>
        )}
      </div>

      <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-3 space-y-1.5">
        <p className="text-[10px] text-white/30 font-body text-center uppercase tracking-wider mb-1">{ui.kbLabel}</p>
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map(k => (
              <button key={k} onClick={() => handleKey(k)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono transition-all active:scale-90 select-none
                  ${k === '⌫'  ? 'bg-red-500/25 border border-red-500/50 text-red-300 hover:bg-red-500/45' :
                    k === 'CLR' ? 'bg-slate-600/60 border border-slate-500 text-slate-300 hover:bg-slate-500/70' :
                    ['x','y','=','+','-','.'].includes(k)
                      ? 'bg-violet-500/20 border border-violet-500/40 text-violet-200 hover:bg-violet-500/40'
                      : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/25'
                  }`}
              >{k}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {([[ui.valA, inputA, setInputA], [ui.valB, inputB, setInputB]] as const).map(([label, val, setter]) => (
          <div key={label as string} className="space-y-1">
            <p className="text-xs font-body text-white/50">{ui.nilaiOf} {label as string}</p>
            <input type="number" step="1" value={val as string}
              onChange={e => { (setter as (v: string) => void)(e.target.value); setShow(false); }}
              className="w-full bg-slate-700 border border-slate-500 rounded-lg px-3 py-1.5 text-sm text-white text-center font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => { playPopSound(); setShow(true); }} disabled={!isValid}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-40 disabled:cursor-not-allowed">
          {ui.showBtn}
        </button>
        <button onClick={handleReset}
          className="px-4 py-2.5 rounded-xl font-bold text-sm font-body transition-all bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600">
          ↺
        </button>
      </div>

      <div className="w-full max-w-[360px] mx-auto">
        <Grid accent="#4ade80">
          {isValid && parsed && (
            <line x1={px(-5)} y1={py(parsed.m*-5+parsed.c)} x2={px(5)} y2={py(parsed.m*5+parsed.c)}
              stroke="#22d3ee" strokeWidth="2.5" />
          )}
          {show && isValid && (
            <line x1={px(-5)} y1={py(imgM*-5+imgC)} x2={px(5)} y2={py(imgM*5+imgC)}
              stroke="#4ade80" strokeWidth="2.5" strokeDasharray="6,3" />
          )}
          {show && isValid && parsed && transA === 0 && transB !== 0 && (
            <Arrow x1={0} y1={parsed.c} x2={0} y2={parsed.c + transB} color="#facc15" />
          )}
          {show && isValid && parsed && transA !== 0 && (
            <Arrow x1={0} y1={parsed.c} x2={transA} y2={parsed.c + transB} color="#facc15" />
          )}
          {isValid && parsed && (
            <text x={px(2)} y={py(parsed.m*2+parsed.c)-7} fill="#22d3ee" fontSize="9" fontWeight="bold">{input}</text>
          )}
          {show && isValid && (
            <text x={px(-1)} y={py(imgM*-1+imgC)-7} fill="#4ade80" fontSize="9" fontWeight="bold">
              {isStd && parsedStd
                ? fmtStandard(parsedStd.a, parsedStd.b_coef, newCval)
                : fmtLine(imgM, imgC)}
            </text>
          )}
        </Grid>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center text-xs font-body">
          <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-cyan-400 inline-block rounded" /><span className="text-cyan-300">{ui.legendOrig}</span></div>
          {show && <>
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-green-400 inline-block rounded" /><span className="text-green-300">{ui.legendImg}</span></div>
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-yellow-400 inline-block rounded" /><span className="text-yellow-300">{ui.legendVec} T({transA},{transB})</span></div>
          </>}
        </div>
      </div>

      {show && isValid && !isStd && parsedSlope && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-1.5">
          <p className="text-xs font-semibold text-emerald-400 font-body">{ui.resultHdrSlope}</p>
          <p className="text-sm font-body text-white/80">
            <span className="text-cyan-300 font-bold">{input}</span> {language === 'ja' ? 'を T(' : language === 'en' ? 'with T(' : 'dengan T('}{transA},{transB}):
          </p>
          <div className="bg-slate-900/60 rounded-lg p-3 text-sm font-body text-white/80 space-y-1">
            <p>y′ = {parsedSlope.m === 1 ? '' : parsedSlope.m === -1 ? '−' : `${parsedSlope.m}`}(x − {transA})
              {parsedSlope.c !== 0 ? ` ${parsedSlope.c > 0 ? '+' : '−'} ${Math.abs(parsedSlope.c)}` : ''}
              {transB !== 0 ? ` ${transB > 0 ? '+' : '−'} ${Math.abs(transB)}` : ''}</p>
          </div>
          <p className="font-body font-bold text-emerald-300 text-base">{fmtLine(imgM, imgC)}</p>
        </div>
      )}

      {show && isValid && isStd && parsedStd && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-violet-300 font-body">{ui.resultHdrStd}</p>
          <p className="text-sm font-body text-white/80">
            <span className="text-cyan-300 font-bold">{input}</span> {language === 'ja' ? 'を T(' : language === 'en' ? 'with T(' : 'dengan T('}{transA},{transB}):
          </p>
          <div className="bg-slate-900/60 rounded-lg p-3 text-sm font-body text-white/80 space-y-1.5">
            <p className="text-[12px]">
              <span className="text-white/50">{ui.coefUnchanged}</span>{' '}
              a = {parsedStd.a}, b = {parsedStd.b_coef}
            </p>
            <p className="text-[12px]">
              <span className="text-white/50">{ui.cNew}</span>
            </p>
            <p className="text-[12px]">
              c′ = {parsedStd.c_val} + ({parsedStd.a})·({transA}) + ({parsedStd.b_coef})·({transB})
              {' '}= {Math.round(newCval * 10000) / 10000}
            </p>
          </div>
          <p className="font-body font-bold text-violet-200 text-base">
            {fmtStandard(parsedStd.a, parsedStd.b_coef, newCval)}
          </p>
          <p className="text-[11px] text-white/40 font-body">
            {ui.equiv} {fmtLine(imgM, imgC)}
          </p>
        </div>
      )}
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
  const { language } = useLanguage();

  const translations = {
    id: {
      pageTitle: "TRANSLASI (PERGESERAN)",
      pageSubtitle: "Memindahkan Bangun Tanpa Mengubah Bentuk!",
      pageMeta: "Kelas 9 · Transformasi Geometri · Materi Matematika",

      overviewTitle: "Transformasi Geometri",
      overviewMeta: "Kelas 9 SMP · Matematika",
      defLabel: "📖 Definisi",
      defText: <>
        <strong className="text-indigo-300">Transformasi geometri</strong> adalah suatu operasi yang
        <strong className="text-white"> memindahkan, mencerminkan, memutar, atau mengubah ukuran</strong> bangun
        di bidang koordinat mengikuti aturan tertentu — sehingga setiap titik punya bayangan baru.
      </>,
      imgAlt: "Transformasi Geometri",
      jenis4: "4 Jenis Transformasi",
      kinds: [
        { icon: "➡️", name: "Translasi",  sub: "Pergeseran" },
        { icon: "🪞", name: "Refleksi",   sub: "Pencerminan" },
        { icon: "🔄", name: "Rotasi",     sub: "Perputaran" },
        { icon: "🔍", name: "Dilatasi",   sub: "Penskalaan" },
      ],
      konsepPenting: "Konsep Penting",
      concepts: [
        { icon: "📍", color: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-400/20", label: "Pra-bayangan (Pre-image)", desc: "Bangun awal sebelum ditransformasi" },
        { icon: "🎯", color: "text-cyan-300",   bg: "bg-cyan-500/10 border-cyan-400/20",     label: "Bayangan (Image)", desc: "Bangun hasil transformasi — titiknya diberi tanda ′ (aksen)" },
        { icon: "📐", color: "text-violet-300", bg: "bg-violet-500/10 border-violet-400/20", label: "Isometri", desc: "Transformasi yang mempertahankan ukuran & bentuk: Translasi, Refleksi, Rotasi" },
        { icon: "🔎", color: "text-pink-300",   bg: "bg-pink-500/10 border-pink-400/20",     label: "Non-Isometri", desc: "Transformasi yang mengubah ukuran: Dilatasi" },
      ],

      secA: "A. 🌟 Apa Itu Translasi?",
      defTranslasi: <>
        <strong className="text-cyan-300">Translasi</strong> adalah jenis transformasi yang memindahkan setiap titik pada suatu bangun ke posisi baru berdasarkan arah dan jarak tertentu, <strong className="text-white">tanpa mengubah bentuk, ukuran, maupun orientasi</strong> bangun tersebut.
      </>,
      keyTitle: "🔑 Kata Kunci:",
      keyBody: <>Translasi ditentukan oleh sebuah <strong className="text-yellow-300">vektor translasi</strong> <InlineMath math="\begin{pmatrix}a\\b\end{pmatrix}" /> yang menunjukkan berapa jauh bangun digeser ke kanan/kiri (a) dan ke atas/bawah (b).</>,
      clawTitle: "🕹️ Mesin Capit & Konsep Translasi",
      clawIntro: <>Mesin capit (claw machine) adalah contoh nyata penerapan <strong className="text-cyan-300">translasi</strong> dalam kehidupan sehari-hari. Perhatikan cara kerja lengan capitnya:</>,
      clawItems: [
        ["➡️", "Geser Horizontal", "Pemain menekan tombol kiri/kanan → lengan capit bergerak sejajar sumbu-x sejauh a satuan, tanpa berubah ketinggian."],
        ["⬆️", "Geser Vertikal",   "Pemain menekan tombol maju/mundur → lengan capit bergerak sejajar sumbu-y sejauh b satuan, tanpa berubah posisi horizontal."],
        ["⬇️", "Turun & Capit",    "Setelah posisi pas, capit turun lurus ke bawah — gerak vertikal murni, sejajar sumbu-y negatif."],
      ],
      clawNote: "💡 Setiap gerakan lengan capit memenuhi syarat translasi: bentuk tidak berubah, arah tetap lurus, dan setiap titik berpindah dengan jarak yang sama. Inilah mengapa mesin capit sering dijadikan analogi konsep translasi dalam matematika!",

      animHdr: "🎮 Coba Sendiri — Animasi Interaktif",
      animDesc: <>Geser titik dan segitiga menggunakan tombol arah. Perhatikan bahwa translasi hanya bergerak <strong className="text-yellow-300">atas, bawah, kiri, atau kanan</strong> — tidak miring!</>,
      propsGrid: [
        ["✅ Bentuk",     "Tetap sama"],
        ["✅ Ukuran",     "Tetap sama"],
        ["✅ Orientasi",  "Tetap sama"],
        ["❌ Posisi",     "Berubah"],
      ],

      secB: "B. 📐 Rumus Translasi",
      rumusIntro: <>Jika titik <InlineMath math="A(x, y)" /> ditranslasikan oleh vektor <InlineMath math="T = \begin{pmatrix}a\\b\end{pmatrix}" />, maka bayangan <InlineMath math="A'(x', y')" /> adalah:</>,
      compX: "Komponen x",
      compY: "Komponen y",
      compXNote: <>a &gt; 0: geser kanan<br />a &lt; 0: geser kiri</>,
      compYNote: <>b &gt; 0: geser atas<br />b &lt; 0: geser bawah</>,

      secC: "C. 📌 Contoh: Translasi Titik",
      soalCLabel: "Soal:",
      soalC: <>Tentukan bayangan titik <InlineMath math="A(-3, 2)" /> oleh translasi <InlineMath math="T = \begin{pmatrix}4\\2\end{pmatrix}" /></>,
      solC: "Penyelesaian:",
      bayanganC: "Bayangan:",

      secD: "D. 📐 Contoh: Translasi Bangun Datar",
      soalDLabel: "Soal:",
      soalD: <>Segitiga PQR dengan <InlineMath math="P(1,1), Q(4,1), R(2,4)" /> ditranslasikan oleh <InlineMath math="T = \begin{pmatrix}-3\\-2\end{pmatrix}" />. Tentukan bayangan!</>,
      solD: "Penyelesaian (terapkan ke setiap titik):",

      secE: "E. 🔗 Komposisi Translasi",
      kompIntro: "Jika suatu titik dikenai dua translasi berturut-turut, kita bisa menggabungkan keduanya:",
      kompFormulaThen: "\\to",
      kompContoh: "Contoh:",
      kompSoal: <>Titik <InlineMath math="A(2,3)" /> dikenai <InlineMath math="T_1\begin{pmatrix}3\\-1\end{pmatrix}" /> lalu <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /></>,
      gabung: "Gabung:",
      bayangan: "Bayangan:",

      secF: "F. 📈 [Tambahan] Translasi pada Kurva Linear",
      kurvaIntro: <>Translasi tidak hanya berlaku untuk titik atau bangun datar — ia juga dapat diterapkan pada <strong className="text-green-300">persamaan garis (kurva linear)</strong>. Jika garis <InlineMath math="y = mx + c" /> ditranslasikan oleh vektor <InlineMath math="T\begin{pmatrix}a\\b\end{pmatrix}" />, maka setiap titik <InlineMath math="(x, y)" /> berpindah ke <InlineMath math="(x+a,\; y+b)" />.</>,
      derivLabel: "Penurunan Rumus",
      derivIntro: <>Misalkan titik asal <InlineMath math="(x, y)" /> berpindah ke <InlineMath math="(x', y')" /> dengan:</>,
      derivSubstitute: <>Substitusikan ke persamaan garis asli <InlineMath math="y = mx + c" />:</>,
      derivOr: "atau (aksen diabaikan):",
      derivNote: <><strong>Catatan:</strong> Gradien <InlineMath math="m" /> <em>tidak berubah</em> setelah translasi — hanya konstanta (intersep-y) yang berubah.</>,
      exampleLabel: "Contoh Soal",

      ex1badge: "MUDAH", ex1title: "Contoh 1",
      ex1soal: <>Garis <InlineMath math="y = 2x" /> ditranslasikan oleh <InlineMath math="T\begin{pmatrix}3\\1\end{pmatrix}" />. Tentukan persamaan bayangan garis tersebut!</>,
      ex1solLabel: "PEMBAHASAN:",
      ex1sol1: <>Translasi <InlineMath math="T\begin{pmatrix}3\\1\end{pmatrix}" /> menggeser setiap titik <InlineMath math="(x,y) \to (x', y')" /> dengan:</>,
      ex1sol2: <>Substitusikan ke persamaan garis asli <InlineMath math="y = 2x" />:</>,
      ex1result: <><strong>Bayangan:</strong> <InlineMath math="y = 2x - 5" /></>,

      ex2badge: "SEDANG", ex2title: "Contoh 2",
      ex2soal: <>Garis <InlineMath math="2x - y + 1 = 0" /> ditranslasikan <strong className="text-yellow-300">dua kali berturut-turut</strong> oleh <InlineMath math="T_1\begin{pmatrix}3\\-2\end{pmatrix}" /> kemudian <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" />. Tentukan persamaan bayangan akhir garis tersebut!</>,
      ex2solLabel: "PEMBAHASAN:",
      ex2t1hdr: <>🔁 Translasi ke-1: <InlineMath math="T_1\begin{pmatrix}3\\-2\end{pmatrix}" /></>,
      ex2t1intro: <>Setiap titik <InlineMath math="(x, y)" /> berpindah ke <InlineMath math="(x', y')" /> dengan:</>,
      ex2t1sub: <>Substitusikan ke persamaan garis asli <InlineMath math="2x - y + 1 = 0" />:</>,
      ex2t1result: <>Bayangan ke-1: <InlineMath math="2x - y - 7 = 0" /></>,
      ex2t2hdr: <>🔁 Translasi ke-2: <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /></>,
      ex2t2intro: <>Sekarang garis <InlineMath math="2x - y - 7 = 0" /> ditranslasikan. Setiap titik <InlineMath math="(x', y')" /> berpindah ke <InlineMath math="(x'', y'')" /> dengan:</>,
      ex2t2sub: <>Substitusikan ke bayangan ke-1 <InlineMath math="2x - y - 7 = 0" />:</>,
      ex2result: <>✅ <strong>Bayangan Akhir:</strong> <InlineMath math="2x - y - 1 = 0" /></>,

      ex3badge: "SULIT", ex3title: "Contoh 3",
      ex3soal: <>Bayangan suatu garis oleh translasi <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> adalah <InlineMath math="3x - y + 5 = 0" />. Tentukan persamaan <strong className="text-red-300">garis sebelum mengalami translasi</strong>!</>,
      ex3solLabel: "PEMBAHASAN:",
      ex3sol1: <>Translasi <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> memetakan setiap titik asal <InlineMath math="(x, y)" /> ke bayangan <InlineMath math="(x', y')" /> dengan:</>,
      ex3sol2: <>Artinya, jika <InlineMath math="(x, y)" /> adalah titik pada <strong className="text-white">garis asli</strong>, maka bayangannya <InlineMath math="(x', y') = (x+2,\; y-3)" /> terletak pada garis bayangan <InlineMath math="3x' - y' + 5 = 0" />.</>,
      ex3sub: <>Substitusikan <InlineMath math="x' = x + 2" /> dan <InlineMath math="y' = y - 3" /> ke persamaan bayangan:</>,
      ex3result: <>✅ <strong>Garis Sebelum Translasi:</strong> <InlineMath math="3x - y + 14 = 0" /></>,
      ex3verifyLabel: "Verifikasi",
      ex3verifyNote: <>Translasikan <InlineMath math="3x - y + 14 = 0" /> dengan <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> → substitusi <InlineMath math="x = x' - 2,\ y = y' + 3" />:</>,

      secG: "G. 🎯 Rangkuman, Tips & Kesimpulan",
      rumusKunciLabel: "📐 Rumus Kunci Translasi",
      card1title: "📌 Titik tunggal",
      card1formula: "A(x, y) → A'(x+a, y+b)",
      card1sub: "dengan vektor T(a, b)",
      card2title: "📌 Komposisi dua translasi",
      card2formula: "T = T₁(a₁,b₁) + T₂(a₂,b₂)",
      card2sub: "= T(a₁+a₂, b₁+b₂)",
      card3title: "📌 Sifat-sifat Translasi",
      propItems: [
        { icon: "📐", label: "Bentuk",    val: "Tetap" },
        { icon: "📏", label: "Ukuran",    val: "Tetap" },
        { icon: "🔄", label: "Orientasi", val: "Tetap" },
        { icon: "➡️", label: "Posisi",    val: "Berubah" },
      ],
      tipsLabel: "💡 Tips & Trik",
      tips: [
        { num:"1", color:"bg-yellow-500/20 border-yellow-500/40 text-yellow-300", title:"Ingat tanda positif/negatif", body:"a > 0 → geser KANAN, a < 0 → geser KIRI. b > 0 → geser ATAS, b < 0 → geser BAWAH." },
        { num:"2", color:"bg-cyan-500/20 border-cyan-500/40 text-cyan-300",       title:"Soal balik: cari titik asal", body:"Jika diketahui bayangan A'(x', y') dan vektor T(a,b), maka titik asal: A(x'−a, y'−b). Kebalikan dari rumus biasa!" },
        { num:"3", color:"bg-green-500/20 border-green-500/40 text-green-300",    title:"Translasi garis ax + by + c = 0", body:"Substitusi x = x'−a dan y = y'−b ke persamaan garis, lalu sederhanakan. Koefisien a dan b (gradien) tidak berubah!" },
        { num:"4", color:"bg-purple-500/20 border-purple-500/40 text-purple-300", title:"Komposisi translasi bisa dijumlah langsung", body:"T₁(3,−2) lalu T₂(−1,4) = T(3+(−1), −2+4) = T(2,2). Tidak perlu menghitung satu per satu!" },
      ],
      conclTitle: "Kesimpulan",
      conclBody: <><strong className="text-yellow-300">Translasi</strong> adalah transformasi paling sederhana — setiap titik dipindahkan dengan <strong className="text-cyan-300">jarak dan arah yang sama</strong> tanpa rotasi maupun perubahan ukuran. Kuncinya ada di vektor T(a, b): nilai <em>a</em> menentukan geser horizontal, nilai <em>b</em> menentukan geser vertikal. Kuasai tanda positif/negatifnya, dan kamu bisa menyelesaikan semua soal translasi dengan cepat!</>,
      tags: ["Isometri ✅", "Posisi berubah", "Rumus: +a, +b", "Bisa dikomposisi"],
    },
    en: {
      pageTitle: "TRANSLATION (SLIDING)",
      pageSubtitle: "Moving Shapes Without Changing Their Form!",
      pageMeta: "Grade 9 · Geometric Transformation · Math Material",

      overviewTitle: "Geometric Transformation",
      overviewMeta: "Grade 9 · Mathematics",
      defLabel: "📖 Definition",
      defText: <>
        <strong className="text-indigo-300">Geometric transformation</strong> is an operation that
        <strong className="text-white"> moves, reflects, rotates, or resizes</strong> a shape
        in the coordinate plane according to specific rules — giving every point a new image.
      </>,
      imgAlt: "Geometric Transformation",
      jenis4: "4 Types of Transformation",
      kinds: [
        { icon: "➡️", name: "Translation", sub: "Sliding" },
        { icon: "🪞", name: "Reflection",  sub: "Mirroring" },
        { icon: "🔄", name: "Rotation",    sub: "Turning" },
        { icon: "🔍", name: "Dilation",    sub: "Scaling" },
      ],
      konsepPenting: "Key Concepts",
      concepts: [
        { icon: "📍", color: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-400/20", label: "Pre-image", desc: "The original shape before transformation" },
        { icon: "🎯", color: "text-cyan-300",   bg: "bg-cyan-500/10 border-cyan-400/20",     label: "Image", desc: "The resulting shape after transformation — its points are marked with ′ (prime)" },
        { icon: "📐", color: "text-violet-300", bg: "bg-violet-500/10 border-violet-400/20", label: "Isometry", desc: "Transformations that preserve size & shape: Translation, Reflection, Rotation" },
        { icon: "🔎", color: "text-pink-300",   bg: "bg-pink-500/10 border-pink-400/20",     label: "Non-Isometry", desc: "Transformations that change size: Dilation" },
      ],

      secA: "A. 🌟 What Is Translation?",
      defTranslasi: <>
        <strong className="text-cyan-300">Translation</strong> is a type of transformation that moves every point of a shape to a new position based on a specific direction and distance, <strong className="text-white">without changing its form, size, or orientation</strong>.
      </>,
      keyTitle: "🔑 Key Concept:",
      keyBody: <>Translation is determined by a <strong className="text-yellow-300">translation vector</strong> <InlineMath math="\begin{pmatrix}a\\b\end{pmatrix}" /> that shows how far the shape is shifted right/left (a) and up/down (b).</>,
      clawTitle: "🕹️ Claw Machine & Translation",
      clawIntro: <>A claw machine is a real-life example of <strong className="text-cyan-300">translation</strong> in everyday life. Notice how the claw arm works:</>,
      clawItems: [
        ["➡️", "Horizontal Shift", "Player presses left/right → claw arm moves parallel to x-axis by a units, without changing height."],
        ["⬆️", "Vertical Shift",   "Player presses forward/backward → claw arm moves parallel to y-axis by b units, without changing horizontal position."],
        ["⬇️", "Drop & Grab",      "Once in position, the claw descends straight down — a pure vertical motion, parallel to the negative y-axis."],
      ],
      clawNote: "💡 Every claw arm movement satisfies translation conditions: shape unchanged, direction straight, every point moves the same distance. That's why claw machines are often used as a translation analogy in math!",

      animHdr: "🎮 Try It Yourself — Interactive Animation",
      animDesc: <>Shift the point and triangle using the direction buttons. Notice that translation only moves <strong className="text-yellow-300">up, down, left, or right</strong> — never diagonal!</>,
      propsGrid: [
        ["✅ Form",        "Unchanged"],
        ["✅ Size",        "Unchanged"],
        ["✅ Orientation", "Unchanged"],
        ["❌ Position",    "Changed"],
      ],

      secB: "B. 📐 Translation Formula",
      rumusIntro: <>If point <InlineMath math="A(x, y)" /> is translated by vector <InlineMath math="T = \begin{pmatrix}a\\b\end{pmatrix}" />, then the image <InlineMath math="A'(x', y')" /> is:</>,
      compX: "x-component",
      compY: "y-component",
      compXNote: <>a &gt; 0: shift right<br />a &lt; 0: shift left</>,
      compYNote: <>b &gt; 0: shift up<br />b &lt; 0: shift down</>,

      secC: "C. 📌 Example: Translation of a Point",
      soalCLabel: "Problem:",
      soalC: <>Find the image of point <InlineMath math="A(-3, 2)" /> under translation <InlineMath math="T = \begin{pmatrix}4\\2\end{pmatrix}" /></>,
      solC: "Solution:",
      bayanganC: "Image:",

      secD: "D. 📐 Example: Translation of a Shape",
      soalDLabel: "Problem:",
      soalD: <>Triangle PQR with <InlineMath math="P(1,1), Q(4,1), R(2,4)" /> is translated by <InlineMath math="T = \begin{pmatrix}-3\\-2\end{pmatrix}" />. Find the image!</>,
      solD: "Solution (apply to each vertex):",

      secE: "E. 🔗 Composition of Translations",
      kompIntro: "If a point undergoes two consecutive translations, we can combine them:",
      kompFormulaThen: "\\to",
      kompContoh: "Example:",
      kompSoal: <>Point <InlineMath math="A(2,3)" /> is translated by <InlineMath math="T_1\begin{pmatrix}3\\-1\end{pmatrix}" /> then <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /></>,
      gabung: "Combined:",
      bayangan: "Image:",

      secF: "F. 📈 [Bonus] Translation of a Linear Curve",
      kurvaIntro: <>Translation doesn't only apply to points or shapes — it can also be applied to <strong className="text-green-300">linear equations</strong>. If line <InlineMath math="y = mx + c" /> is translated by vector <InlineMath math="T\begin{pmatrix}a\\b\end{pmatrix}" />, every point <InlineMath math="(x, y)" /> moves to <InlineMath math="(x+a,\; y+b)" />.</>,
      derivLabel: "Formula Derivation",
      derivIntro: <>Suppose original point <InlineMath math="(x, y)" /> moves to <InlineMath math="(x', y')" /> with:</>,
      derivSubstitute: <>Substitute into the original line equation <InlineMath math="y = mx + c" />:</>,
      derivOr: "or (dropping primes):",
      derivNote: <><strong>Note:</strong> Gradient <InlineMath math="m" /> <em>does not change</em> after translation — only the constant (y-intercept) changes.</>,
      exampleLabel: "Examples",

      ex1badge: "Easy", ex1title: "Example 1",
      ex1soal: <>Line <InlineMath math="y = 2x" /> is translated by <InlineMath math="T\begin{pmatrix}3\\1\end{pmatrix}" />. Find the equation of the image!</>,
      ex1solLabel: "Solution:",
      ex1sol1: <>Translation <InlineMath math="T\begin{pmatrix}3\\1\end{pmatrix}" /> moves every point <InlineMath math="(x,y) \to (x', y')" /> with:</>,
      ex1sol2: <>Substitute into the original line <InlineMath math="y = 2x" />:</>,
      ex1result: <><strong>Image:</strong> <InlineMath math="y = 2x - 5" /></>,

      ex2badge: "Medium", ex2title: "Example 2",
      ex2soal: <>Line <InlineMath math="2x - y + 1 = 0" /> is translated <strong className="text-yellow-300">twice consecutively</strong> by <InlineMath math="T_1\begin{pmatrix}3\\-2\end{pmatrix}" /> then <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" />. Find the final image equation!</>,
      ex2solLabel: "Solution:",
      ex2t1hdr: <>🔁 1st Translation: <InlineMath math="T_1\begin{pmatrix}3\\-2\end{pmatrix}" /></>,
      ex2t1intro: <>Every point <InlineMath math="(x, y)" /> moves to <InlineMath math="(x', y')" /> with:</>,
      ex2t1sub: <>Substitute into the original line <InlineMath math="2x - y + 1 = 0" />:</>,
      ex2t1result: <>1st image: <InlineMath math="2x - y - 7 = 0" /></>,
      ex2t2hdr: <>🔁 2nd Translation: <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /></>,
      ex2t2intro: <>Now line <InlineMath math="2x - y - 7 = 0" /> is translated. Every point <InlineMath math="(x', y')" /> moves to <InlineMath math="(x'', y'')" /> with:</>,
      ex2t2sub: <>Substitute into the 1st image <InlineMath math="2x - y - 7 = 0" />:</>,
      ex2result: <>✅ <strong>Final Image:</strong> <InlineMath math="2x - y - 1 = 0" /></>,

      ex3badge: "Hard", ex3title: "Example 3",
      ex3soal: <>The image of a line under translation <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> is <InlineMath math="3x - y + 5 = 0" />. Find the equation of the <strong className="text-red-300">line before translation</strong>!</>,
      ex3solLabel: "Solution:",
      ex3sol1: <>Translation <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> maps every original point <InlineMath math="(x, y)" /> to image <InlineMath math="(x', y')" /> with:</>,
      ex3sol2: <>So if <InlineMath math="(x, y)" /> is a point on the <strong className="text-white">original line</strong>, its image <InlineMath math="(x', y') = (x+2,\; y-3)" /> lies on the image line <InlineMath math="3x' - y' + 5 = 0" />.</>,
      ex3sub: <>Substitute <InlineMath math="x' = x + 2" /> and <InlineMath math="y' = y - 3" /> into the image equation:</>,
      ex3result: <>✅ <strong>Line Before Translation:</strong> <InlineMath math="3x - y + 14 = 0" /></>,
      ex3verifyLabel: "Verification",
      ex3verifyNote: <>Translate <InlineMath math="3x - y + 14 = 0" /> by <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> → substitute <InlineMath math="x = x' - 2,\ y = y' + 3" />:</>,

      secG: "G. 🎯 Summary, Tips & Conclusion",
      rumusKunciLabel: "📐 Key Translation Formulas",
      card1title: "📌 Single point",
      card1formula: "A(x, y) → A'(x+a, y+b)",
      card1sub: "with vector T(a, b)",
      card2title: "📌 Composition of two translations",
      card2formula: "T = T₁(a₁,b₁) + T₂(a₂,b₂)",
      card2sub: "= T(a₁+a₂, b₁+b₂)",
      card3title: "📌 Properties of Translation",
      propItems: [
        { icon: "📐", label: "Form",        val: "Unchanged" },
        { icon: "📏", label: "Size",        val: "Unchanged" },
        { icon: "🔄", label: "Orientation", val: "Unchanged" },
        { icon: "➡️", label: "Position",    val: "Changed" },
      ],
      tipsLabel: "💡 Tips & Tricks",
      tips: [
        { num:"1", color:"bg-yellow-500/20 border-yellow-500/40 text-yellow-300", title:"Remember the signs", body:"a > 0 → shift RIGHT, a < 0 → shift LEFT. b > 0 → shift UP, b < 0 → shift DOWN." },
        { num:"2", color:"bg-cyan-500/20 border-cyan-500/40 text-cyan-300",       title:"Reverse problems: find the original point", body:"If image A'(x', y') and vector T(a,b) are given, original: A(x'−a, y'−b). The reverse of the normal formula!" },
        { num:"3", color:"bg-green-500/20 border-green-500/40 text-green-300",    title:"Translating line ax + by + c = 0", body:"Substitute x = x'−a and y = y'−b into the line equation, then simplify. Coefficients a and b (gradient) don't change!" },
        { num:"4", color:"bg-purple-500/20 border-purple-500/40 text-purple-300", title:"Compositions can be added directly", body:"T₁(3,−2) then T₂(−1,4) = T(3+(−1), −2+4) = T(2,2). No need to compute one by one!" },
      ],
      conclTitle: "Conclusion",
      conclBody: <><strong className="text-yellow-300">Translation</strong> is the simplest transformation — every point moves by the <strong className="text-cyan-300">same distance and direction</strong> without rotation or size change. The key is vector T(a, b): value <em>a</em> sets horizontal shift, value <em>b</em> sets vertical shift. Master the signs and you can solve any translation problem quickly!</>,
      tags: ["Isometry ✅", "Position changes", "Formula: +a, +b", "Composable"],
    },
    ja: {
      pageTitle: "平行移動",
      pageSubtitle: "形を変えずに図形を動かそう！",
      pageMeta: "中学3年 · 図形の移動 · 数学",

      overviewTitle: "図形の移動",
      overviewMeta: "中学3年 · 数学",
      defLabel: "📖 定義",
      defText: <>
        <strong className="text-indigo-300">図形の移動</strong>とは、座標平面上の図形を
        <strong className="text-white">移動・対称移動・回転・拡大縮小</strong>する操作で、
        決まった規則に従って各点が新しい位置（像）に対応します。
      </>,
      imgAlt: "図形の移動",
      jenis4: "4種類の移動",
      kinds: [
        { icon: "➡️", name: "平行移動", sub: "Translation" },
        { icon: "🪞", name: "対称移動", sub: "Reflection" },
        { icon: "🔄", name: "回転移動", sub: "Rotation" },
        { icon: "🔍", name: "拡大・縮小", sub: "Dilation" },
      ],
      konsepPenting: "重要な概念",
      concepts: [
        { icon: "📍", color: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-400/20", label: "元の図形（Pre-image）", desc: "移動前の元の図形" },
        { icon: "🎯", color: "text-cyan-300",   bg: "bg-cyan-500/10 border-cyan-400/20",     label: "像（Image）", desc: "移動後の図形 — 点には ′（プライム）をつけて表す" },
        { icon: "📐", color: "text-violet-300", bg: "bg-violet-500/10 border-violet-400/20", label: "合同変換（等長変換）", desc: "形・大きさを保つ移動：平行移動・対称移動・回転移動" },
        { icon: "🔎", color: "text-pink-300",   bg: "bg-pink-500/10 border-pink-400/20",     label: "非合同変換", desc: "大きさが変わる移動：拡大・縮小" },
      ],

      secA: "A. 🌟 平行移動とは？",
      defTranslasi: <>
        <strong className="text-cyan-300">平行移動</strong>とは、図形の全ての点を特定の方向と距離だけ動かす変換で、<strong className="text-white">形・大きさ・向きを変えずに</strong>位置だけを変えます。
      </>,
      keyTitle: "🔑 ポイント：",
      keyBody: <>平行移動は<strong className="text-yellow-300">移動ベクトル</strong> <InlineMath math="\begin{pmatrix}a\\b\end{pmatrix}" /> によって決まります。aは左右の移動量、bは上下の移動量を表します。</>,
      clawTitle: "🕹️ クレーンゲームと平行移動",
      clawIntro: <>クレーンゲームは日常生活における<strong className="text-cyan-300">平行移動</strong>の身近な例です。アームの動きを観察しましょう：</>,
      clawItems: [
        ["➡️", "水平移動", "左右ボタンを押す → アームがx軸に平行にa単位移動し、高さは変わらない。"],
        ["⬆️", "垂直移動", "前後ボタンを押す → アームがy軸に平行にb単位移動し、水平位置は変わらない。"],
        ["⬇️", "降下・把持", "位置が決まったらアームが真下に降りる — y軸負方向への純粋な縦移動。"],
      ],
      clawNote: "💡 アームの動きは平行移動の条件をすべて満たしています：形は変わらず、方向は直線的で、全ての点が同じ距離だけ移動します。これがクレーンゲームが平行移動の例えとして使われる理由です！",

      animHdr: "🎮 自分で試そう — インタラクティブアニメーション",
      animDesc: <>方向ボタンで点と三角形を動かしましょう。平行移動は<strong className="text-yellow-300">上・下・左・右</strong>にしか動かないことを確認してください — 斜めには動きません！</>,
      propsGrid: [
        ["✅ 形",   "変わらない"],
        ["✅ 大きさ", "変わらない"],
        ["✅ 向き",  "変わらない"],
        ["❌ 位置",  "変わる"],
      ],

      secB: "B. 📐 平行移動の公式",
      rumusIntro: <>点 <InlineMath math="A(x, y)" /> を移動ベクトル <InlineMath math="T = \begin{pmatrix}a\\b\end{pmatrix}" /> で平行移動すると、像 <InlineMath math="A'(x', y')" /> は：</>,
      compX: "x成分",
      compY: "y成分",
      compXNote: <>a &gt; 0: 右へ<br />a &lt; 0: 左へ</>,
      compYNote: <>b &gt; 0: 上へ<br />b &lt; 0: 下へ</>,

      secC: "C. 📌 例：点の平行移動",
      soalCLabel: "問題：",
      soalC: <>移動ベクトル <InlineMath math="T = \begin{pmatrix}4\\2\end{pmatrix}" /> による点 <InlineMath math="A(-3, 2)" /> の像を求めなさい。</>,
      solC: "解答：",
      bayanganC: "像：",

      secD: "D. 📐 例：図形の平行移動",
      soalDLabel: "問題：",
      soalD: <>三角形PQRで <InlineMath math="P(1,1),\, Q(4,1),\, R(2,4)" /> を移動ベクトル <InlineMath math="T = \begin{pmatrix}-3\\-2\end{pmatrix}" /> で平行移動した。像を求めなさい！</>,
      solD: "解答（各頂点に適用）：",

      secE: "E. 🔗 平行移動の合成",
      kompIntro: "点が2回連続して平行移動する場合、2つを合成できます：",
      kompFormulaThen: "\\to",
      kompContoh: "例：",
      kompSoal: <>点 <InlineMath math="A(2,3)" /> を <InlineMath math="T_1\begin{pmatrix}3\\-1\end{pmatrix}" />、次に <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /> で平行移動する。</>,
      gabung: "合成：",
      bayangan: "像：",

      secF: "F. 📈 【発展】一次関数の平行移動",
      kurvaIntro: <>平行移動は点や図形だけでなく、<strong className="text-green-300">一次方程式（直線）</strong>にも適用できます。直線 <InlineMath math="y = mx + c" /> を移動ベクトル <InlineMath math="T\begin{pmatrix}a\\b\end{pmatrix}" /> で平行移動すると、各点 <InlineMath math="(x, y)" /> は <InlineMath math="(x+a,\; y+b)" /> に移ります。</>,
      derivLabel: "公式の導出",
      derivIntro: <>元の点 <InlineMath math="(x, y)" /> が <InlineMath math="(x', y')" /> に移るとき：</>,
      derivSubstitute: <>元の直線の式 <InlineMath math="y = mx + c" /> に代入：</>,
      derivOr: "（プライムを省略すると）：",
      derivNote: <><strong>注意：</strong>傾き <InlineMath math="m" /> は平行移動後も<em>変わりません</em> — 定数項（y切片）のみが変化します。</>,
      exampleLabel: "例題",

      ex1badge: "基本", ex1title: "例題1",
      ex1soal: <>直線 <InlineMath math="y = 2x" /> を移動ベクトル <InlineMath math="T\begin{pmatrix}3\\1\end{pmatrix}" /> で平行移動する。像の方程式を求めなさい！</>,
      ex1solLabel: "解説：",
      ex1sol1: <>移動ベクトル <InlineMath math="T\begin{pmatrix}3\\1\end{pmatrix}" /> により各点 <InlineMath math="(x,y) \to (x', y')" /> と移動する：</>,
      ex1sol2: <>元の直線 <InlineMath math="y = 2x" /> に代入：</>,
      ex1result: <><strong>像：</strong> <InlineMath math="y = 2x - 5" /></>,

      ex2badge: "標準", ex2title: "例題2",
      ex2soal: <>直線 <InlineMath math="2x - y + 1 = 0" /> を <InlineMath math="T_1\begin{pmatrix}3\\-2\end{pmatrix}" />、次に <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /> で<strong className="text-yellow-300">2回連続</strong>して平行移動する。最終的な像の方程式を求めなさい！</>,
      ex2solLabel: "解説：",
      ex2t1hdr: <>🔁 第1回の平行移動: <InlineMath math="T_1\begin{pmatrix}3\\-2\end{pmatrix}" /></>,
      ex2t1intro: <>各点 <InlineMath math="(x, y)" /> は <InlineMath math="(x', y')" /> に移動する：</>,
      ex2t1sub: <>元の直線 <InlineMath math="2x - y + 1 = 0" /> に代入：</>,
      ex2t1result: <>第1の像: <InlineMath math="2x - y - 7 = 0" /></>,
      ex2t2hdr: <>🔁 第2回の平行移動: <InlineMath math="T_2\begin{pmatrix}-1\\4\end{pmatrix}" /></>,
      ex2t2intro: <>次に直線 <InlineMath math="2x - y - 7 = 0" /> を平行移動する。各点 <InlineMath math="(x', y')" /> は <InlineMath math="(x'', y'')" /> に移動する：</>,
      ex2t2sub: <>第1の像 <InlineMath math="2x - y - 7 = 0" /> に代入：</>,
      ex2result: <>✅ <strong>最終的な像：</strong> <InlineMath math="2x - y - 1 = 0" /></>,

      ex3badge: "発展", ex3title: "例題3",
      ex3soal: <>移動ベクトル <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> による直線の像が <InlineMath math="3x - y + 5 = 0" /> である。<strong className="text-red-300">平行移動前の直線の方程式</strong>を求めなさい！</>,
      ex3solLabel: "解説：",
      ex3sol1: <>移動ベクトル <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> は元の点 <InlineMath math="(x, y)" /> を像 <InlineMath math="(x', y')" /> に対応させる：</>,
      ex3sol2: <><InlineMath math="(x, y)" /> が<strong className="text-white">元の直線</strong>上の点なら、その像 <InlineMath math="(x', y') = (x+2,\; y-3)" /> は像の直線 <InlineMath math="3x' - y' + 5 = 0" /> 上にある。</>,
      ex3sub: <>像の方程式に <InlineMath math="x' = x + 2" />、<InlineMath math="y' = y - 3" /> を代入：</>,
      ex3result: <>✅ <strong>平行移動前の直線：</strong> <InlineMath math="3x - y + 14 = 0" /></>,
      ex3verifyLabel: "確認",
      ex3verifyNote: <><InlineMath math="3x - y + 14 = 0" /> を <InlineMath math="T\begin{pmatrix}2\\-3\end{pmatrix}" /> で移動 → <InlineMath math="x = x' - 2,\ y = y' + 3" /> を代入：</>,

      secG: "G. 🎯 まとめ・コツ・結論",
      rumusKunciLabel: "📐 平行移動の重要公式",
      card1title: "📌 1点の場合",
      card1formula: "A(x, y) → A'(x+a, y+b)",
      card1sub: "移動ベクトル T(a, b) による",
      card2title: "📌 2回合成の場合",
      card2formula: "T = T₁(a₁,b₁) + T₂(a₂,b₂)",
      card2sub: "= T(a₁+a₂, b₁+b₂)",
      card3title: "📌 平行移動の性質",
      propItems: [
        { icon: "📐", label: "形",   val: "変わらない" },
        { icon: "📏", label: "大きさ", val: "変わらない" },
        { icon: "🔄", label: "向き",  val: "変わらない" },
        { icon: "➡️", label: "位置",  val: "変わる" },
      ],
      tipsLabel: "💡 コツとヒント",
      tips: [
        { num:"1", color:"bg-yellow-500/20 border-yellow-500/40 text-yellow-300", title:"符号を覚えよう", body:"a > 0 → 右へ, a < 0 → 左へ。b > 0 → 上へ, b < 0 → 下へ。" },
        { num:"2", color:"bg-cyan-500/20 border-cyan-500/40 text-cyan-300",       title:"逆問題：元の点を求める", body:"像A'(x', y')とベクトルT(a,b)がわかれば、元の点：A(x'−a, y'−b)。通常の公式の逆です！" },
        { num:"3", color:"bg-green-500/20 border-green-500/40 text-green-300",    title:"直線 ax + by + c = 0 の平行移動", body:"x = x'−a、y = y'−bを直線の式に代入して整理。係数a, b（傾き）は変わりません！" },
        { num:"4", color:"bg-purple-500/20 border-purple-500/40 text-purple-300", title:"合成は直接足せる", body:"T₁(3,−2)の後T₂(−1,4) = T(3+(−1), −2+4) = T(2,2)。1つずつ計算しなくてOK！" },
      ],
      conclTitle: "結論",
      conclBody: <><strong className="text-yellow-300">平行移動</strong>は最もシンプルな変換です — 全ての点が回転や大きさの変化なく、<strong className="text-cyan-300">同じ距離と方向</strong>に移動します。カギは移動ベクトルT(a, b)：aが水平移動量、bが垂直移動量を決めます。符号をマスターすれば、全ての平行移動の問題が素早く解けます！</>,
      tags: ["合同変換 ✅", "位置が変わる", "公式：+a, +b", "合成可能"],
    },
  }[language];

  const t = translations;

  const badgeColor = (badge: string) => {
    if (badge === "MUDAH" || badge === "Easy"   || badge === "基本") return "bg-green-500/20 text-green-400";
    if (badge === "SEDANG"|| badge === "Medium" || badge === "標準") return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };
  const borderColor = (badge: string) => {
    if (badge === "MUDAH" || badge === "Easy"   || badge === "基本") return "border-green-500";
    if (badge === "SEDANG"|| badge === "Medium" || badge === "標準") return "border-yellow-500";
    return "border-red-500";
  };
  const bgColor = (badge: string) => {
    if (badge === "MUDAH" || badge === "Easy"   || badge === "基本") return "bg-green-500/5 border border-green-500/20";
    if (badge === "SEDANG"|| badge === "Medium" || badge === "標準") return "bg-yellow-500/5 border border-yellow-500/20";
    return "bg-red-500/5 border border-red-500/20";
  };
  const solColor = (badge: string) => {
    if (badge === "MUDAH" || badge === "Easy"   || badge === "基本") return "text-green-400";
    if (badge === "SEDANG"|| badge === "Medium" || badge === "標準") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <MoveRight className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-400 text-center mb-1">{t.pageTitle}</h1>
        <p className="font-display text-sm font-semibold text-cyan-300 text-center mb-1">{t.pageSubtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.pageMeta}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── TRANSFORMASI GEOMETRI OVERVIEW ── */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-blue-950/80 border border-indigo-400/30 rounded-2xl overflow-hidden">
            <div className="px-5 pt-6 pb-3 text-center">
              <div className="text-4xl mb-2">🔷</div>
              <h2 className="font-display text-lg font-bold text-indigo-300 mb-1">{t.overviewTitle}</h2>
              <p className="text-xs text-white/40 font-body uppercase tracking-widest">{t.overviewMeta}</p>
            </div>
            <div className="mx-5 border-t border-indigo-400/20 mb-4" />
            <div className="mx-5 mb-5 bg-indigo-500/10 border border-indigo-400/25 rounded-xl p-4">
              <p className="text-xs font-body font-bold text-indigo-300 uppercase tracking-wider mb-2">{t.defLabel}</p>
              <p className="text-sm font-body text-white/80 leading-relaxed">{t.defText}</p>
            </div>
            <div className="px-5 mb-4">
              <img src="/transformasi-geometri-space.png" alt={t.imgAlt} className="w-full rounded-xl object-cover" />
              <p className="text-[10px] text-white/30 text-right mt-1 font-body">bing.com/images/create</p>
            </div>
            <div className="px-5 mb-5">
              <p className="text-[11px] font-body text-white/40 text-center mb-3 uppercase tracking-widest">{t.jenis4}</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { bg: "bg-cyan-500/20 border-2 border-cyan-400/70 shadow-cyan-500/10",    nc: "text-cyan-300",    idx: 0 },
                  { bg: "bg-emerald-500/20 border-2 border-emerald-400/70 shadow-emerald-500/10", nc: "text-emerald-300", idx: 1 },
                  { bg: "bg-orange-500/20 border-2 border-orange-400/70 shadow-orange-500/10",   nc: "text-orange-300",  idx: 2 },
                  { bg: "bg-pink-500/20 border-2 border-pink-400/70 shadow-pink-500/10",         nc: "text-pink-300",    idx: 3 },
                ] as const).map(({ bg, nc, idx }) => (
                  <div key={idx} className={`relative ${bg} rounded-xl p-3 text-center shadow-lg`}>
                    <div className="text-2xl mb-1">{t.kinds[idx].icon}</div>
                    <p className={`font-body font-bold ${nc} text-sm`}>{t.kinds[idx].name}</p>
                    <p className="font-body text-[11px] text-white/50 mt-0.5">{t.kinds[idx].sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 pb-5">
              <p className="text-[11px] font-body text-white/40 text-center mb-3 uppercase tracking-widest">{t.konsepPenting}</p>
              <div className="space-y-2">
                {t.concepts.map(({ icon, color, bg, label, desc }) => (
                  <div key={label} className={`flex items-start gap-3 border rounded-xl px-3 py-2.5 ${bg}`}>
                    <span className="text-lg shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className={`text-xs font-bold font-body ${color}`}>{label}</p>
                      <p className="text-xs text-white/55 font-body mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<Lightbulb className="w-5 h-5" />} color="#facc15" title={t.secA} />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.defTranslasi}</p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-cyan-300 font-body text-sm font-semibold">{t.keyTitle}</p>
                <p className="text-white/80 text-sm font-body mt-1">{t.keyBody}</p>
              </div>
              <div>
                <img src="/translasi-claw-machine.png" alt="Ilustrasi Translasi" className="w-full rounded-xl object-cover" />
                <p className="text-[10px] text-white/30 text-right mt-1 font-body">bing.com/images/create</p>
              </div>
              <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                <p className="text-cyan-300 font-body text-sm font-bold">{t.clawTitle}</p>
                <p className="text-white/75 text-sm font-body leading-relaxed">{t.clawIntro}</p>
                <div className="space-y-2">
                  {t.clawItems.map(([icon, judul, desc]) => (
                    <div key={judul as string} className="flex items-start gap-3 bg-slate-900/50 rounded-lg px-3 py-2.5">
                      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="text-xs font-bold text-yellow-300 font-body">{judul as string}</p>
                        <p className="text-xs text-white/60 font-body mt-0.5">{desc as string}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-950/50 border border-cyan-500/20 rounded-lg px-4 py-2.5">
                  <p className="text-cyan-200 text-xs font-body leading-relaxed">{t.clawNote}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── ANIMASI INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-cyan-500/30 rounded-xl overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎮</span>
                <span className="font-body font-bold text-cyan-300 text-sm">{t.animHdr}</span>
              </div>
              <p className="text-white/50 text-xs font-body">{t.animDesc}</p>
            </div>
            <div className="mx-5 my-3 border-t border-white/10" />
            <div className="px-5 pb-4">
              <AnimasiTitik />
            </div>
            <div className="mx-5 my-1 border-t border-white/10" />
            <div className="px-5 pb-4 pt-3">
              <AnimasiSegitiga />
            </div>
            <div className="mx-5 mb-5 grid grid-cols-2 gap-3">
              {t.propsGrid.map(([k, v]) => (
                <div key={k as string} className="bg-slate-800/60 rounded-lg p-3 text-center">
                  <p className="text-xs font-semibold text-white/60 font-body">{k as string}</p>
                  <p className="text-sm font-bold text-white font-body">{v as string}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<Calculator className="w-5 h-5" />} color="#22d3ee" title={t.secB} />
            <div className="px-5 pb-5 space-y-4">
              <p className="text-sm text-white/80 font-body">{t.rumusIntro}</p>
              <div className="bg-cyan-950/60 border border-cyan-500/40 rounded-xl p-5 text-center">
                <BlockMath math="A(x,y) \xrightarrow{T\begin{pmatrix}a\\b\end{pmatrix}} A'(x+a,\; y+b)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                  <p className="text-xs text-white/50 font-body mb-1">{t.compX}</p>
                  <BlockMath math="x' = x + a" />
                  <p className="text-xs text-white/60 font-body">{t.compXNote}</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                  <p className="text-xs text-white/50 font-body mb-1">{t.compY}</p>
                  <BlockMath math="y' = y + b" />
                  <p className="text-xs text-white/60 font-body">{t.compYNote}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH TITIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title={t.secC} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-violet-300 font-body mb-2">{t.soalCLabel}</p>
                <p className="text-sm text-white/80 font-body">{t.soalC}</p>
              </div>
              <DiagramTitikAnimated />
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-cyan-300 font-body">{t.solC}</p>
                <div className="space-y-1 text-sm font-body text-white/80">
                  <p>• <InlineMath math="a = 4, \; b = 2" /></p>
                  <p>• <InlineMath math="x' = x + a = -3 + 4 = 1" /></p>
                  <p>• <InlineMath math="y' = y + b = 2 + 2 = 4" /></p>
                  <div className="mt-2 bg-cyan-500/15 rounded-lg p-2 text-center">
                    <p className="text-cyan-300 font-bold">{t.bayanganC} <InlineMath math="A'(1, 4)" /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH BANGUN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<BookOpen className="w-5 h-5" />} color="#f472b6" title={t.secD} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-pink-300 font-body mb-2">{t.soalDLabel}</p>
                <p className="text-sm text-white/80 font-body">{t.soalD}</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-pink-300 font-body">{t.solD}</p>
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
            <SectionHdr icon={<Calculator className="w-5 h-5" />} color="#4ade80" title={t.secE} />
            <div className="px-5 pb-5 space-y-4">
              <p className="text-sm text-white/80 font-body">{t.kompIntro}</p>
              {/* \text{ lalu } replaced with \to — language-neutral */}
              <div className="bg-green-950/50 border border-green-500/30 rounded-xl p-4">
                <BlockMath math="T_1\begin{pmatrix}a_1\\b_1\end{pmatrix} \to T_2\begin{pmatrix}a_2\\b_2\end{pmatrix} \equiv T\begin{pmatrix}a_1+a_2\\b_1+b_2\end{pmatrix}" />
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-green-300 font-body">{t.kompContoh}</p>
                <p className="text-sm text-white/80 font-body">{t.kompSoal}</p>
                <div className="space-y-1 text-sm font-body text-white/80 mt-2">
                  <p>{t.gabung} <InlineMath math="T = \begin{pmatrix}3+(-1)\\-1+4\end{pmatrix} = \begin{pmatrix}2\\3\end{pmatrix}" /></p>
                  <p>{t.bayangan} <InlineMath math="A'(2+2,\; 3+3) = A'(4, 6)" /></p>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSLASI PADA KURVA LINEAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<BookOpen className="w-5 h-5" />} color="#4ade80" title={t.secF} />
            <div className="px-5 pb-5 space-y-5">
              <p className="text-sm text-white/80 font-body leading-relaxed">{t.kurvaIntro}</p>

              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-green-400 font-body uppercase tracking-wide">{t.derivLabel}</p>
                <p className="text-sm text-white/80 font-body">{t.derivIntro}</p>
                <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                  <BlockMath math="x' = x + a \implies x = x' - a" />
                  <BlockMath math="y' = y + b \implies y = y' - b" />
                </div>
                <p className="text-sm text-white/80 font-body">{t.derivSubstitute}</p>
                <div className="bg-green-950/50 border border-green-500/30 rounded-xl p-4 text-center space-y-1">
                  <BlockMath math="y' - b = m(x' - a) + c" />
                  <BlockMath math="y' = m(x' - a) + c + b" />
                  <BlockMath math="\therefore\quad y' = mx' + (c - ma + b)" />
                  <p className="text-xs text-white/50 font-body mt-1">{t.derivOr}</p>
                  <BlockMath math="\boxed{y = mx + (c - ma + b)}" />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-sm text-yellow-200 font-body">{t.derivNote}</p>
                </div>
              </div>

              <AnimasiKurva />

              <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wider">{t.exampleLabel}</p>

              {/* Example 1 */}
              <div className={`border-l-4 ${borderColor(t.ex1badge)} pl-4 space-y-3`}>
                <div className="flex items-center gap-2">
                  <span className={`${badgeColor(t.ex1badge)} text-xs font-bold px-2 py-1 rounded font-body`}>{t.ex1badge}</span>
                  <span className="font-body font-semibold text-white text-sm">{t.ex1title}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.ex1soal}</p>
                </div>
                <div className={`${bgColor(t.ex1badge)} rounded-lg p-4 space-y-2`}>
                  <p className={`text-xs font-semibold ${solColor(t.ex1badge)} font-body`}>{t.ex1solLabel}</p>
                  <p className="text-sm text-white/80 font-body">{t.ex1sol1}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="x' = x + 3 \implies x = x' - 3" />
                    <BlockMath math="y' = y + 1 \implies y = y' - 1" />
                  </div>
                  <p className="text-sm text-white/80 font-body">{t.ex1sol2}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="y' - 1 = 2(x' - 3)" />
                    <BlockMath math="y' - 1 = 2x' - 6" />
                    <BlockMath math="y' = 2x' - 5" />
                  </div>
                  <p className={`font-body font-bold ${solColor(t.ex1badge)}`}>{t.ex1result}</p>
                </div>
              </div>

              {/* Example 2 */}
              <div className={`border-l-4 ${borderColor(t.ex2badge)} pl-4 space-y-3`}>
                <div className="flex items-center gap-2">
                  <span className={`${badgeColor(t.ex2badge)} text-xs font-bold px-2 py-1 rounded font-body`}>{t.ex2badge}</span>
                  <span className="font-body font-semibold text-white text-sm">{t.ex2title}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.ex2soal}</p>
                </div>
                <div className={`${bgColor(t.ex2badge)} rounded-lg p-4 space-y-4`}>
                  <p className={`text-xs font-semibold ${solColor(t.ex2badge)} font-body`}>{t.ex2solLabel}</p>
                  <div className="space-y-2">
                    <p className={`text-sm font-semibold ${solColor(t.ex2badge)} font-body`}>{t.ex2t1hdr}</p>
                    <p className="text-sm text-white/80 font-body">{t.ex2t1intro}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x' = x + 3 \implies x = x' - 3" />
                      <BlockMath math="y' = y - 2 \implies y = y' + 2" />
                    </div>
                    <p className="text-sm text-white/80 font-body">{t.ex2t1sub}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="2(x' - 3) - (y' + 2) + 1 = 0" />
                      <BlockMath math="2x' - 6 - y' - 2 + 1 = 0" />
                      <BlockMath math="2x' - y' - 7 = 0" />
                    </div>
                    <p className={`font-body text-sm ${solColor(t.ex2badge)}`}>{t.ex2t1result}</p>
                  </div>
                  <div className={`border-t ${t.ex2badge === 'SEDANG' || t.ex2badge === 'Medium' || t.ex2badge === '標準' ? 'border-yellow-500/20' : 'border-green-500/20'}`} />
                  <div className="space-y-2">
                    <p className={`text-sm font-semibold ${solColor(t.ex2badge)} font-body`}>{t.ex2t2hdr}</p>
                    <p className="text-sm text-white/80 font-body">{t.ex2t2intro}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x'' = x' - 1 \implies x' = x'' + 1" />
                      <BlockMath math="y'' = y' + 4 \implies y' = y'' - 4" />
                    </div>
                    <p className="text-sm text-white/80 font-body">{t.ex2t2sub}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="2(x'' + 1) - (y'' - 4) - 7 = 0" />
                      <BlockMath math="2x'' + 2 - y'' + 4 - 7 = 0" />
                      <BlockMath math="2x'' - y'' - 1 = 0" />
                    </div>
                  </div>
                  <p className={`font-body font-bold ${solColor(t.ex2badge)}`}>{t.ex2result}</p>
                </div>
              </div>

              {/* Example 3 */}
              <div className={`border-l-4 ${borderColor(t.ex3badge)} pl-4 space-y-3`}>
                <div className="flex items-center gap-2">
                  <span className={`${badgeColor(t.ex3badge)} text-xs font-bold px-2 py-1 rounded font-body`}>{t.ex3badge}</span>
                  <span className="font-body font-semibold text-white text-sm">{t.ex3title}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.ex3soal}</p>
                </div>
                <div className={`${bgColor(t.ex3badge)} rounded-lg p-4 space-y-3`}>
                  <p className={`text-xs font-semibold ${solColor(t.ex3badge)} font-body`}>{t.ex3solLabel}</p>
                  <p className="text-sm text-white/80 font-body">{t.ex3sol1}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="x' = x + 2" />
                    <BlockMath math="y' = y - 3" />
                  </div>
                  <p className="text-sm text-white/80 font-body">{t.ex3sol2}</p>
                  <p className="text-sm text-white/80 font-body">{t.ex3sub}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="3(x + 2) - (y - 3) + 5 = 0" />
                    <BlockMath math="3x + 6 - y + 3 + 5 = 0" />
                    <BlockMath math="3x - y + 14 = 0" />
                  </div>
                  <p className={`font-body font-bold ${solColor(t.ex3badge)}`}>{t.ex3result}</p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wide">{t.ex3verifyLabel}</p>
                    <p className="text-xs text-white/60 font-body">{t.ex3verifyNote}</p>
                    <BlockMath math="3(x'-2) - (y'+3) + 14 = 0" />
                    <BlockMath math="3x' - 6 - y' - 3 + 14 = 0" />
                    <BlockMath math="3x' - y' + 5 = 0 \checkmark" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RANGKUMAN, TIPS & KESIMPULAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHdr icon={<Target className="w-5 h-5" />} color="#f97316" title={t.secG} />
            <div className="px-5 pb-5 space-y-5">

              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-widest">{t.rumusKunciLabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 rounded-xl p-4">
                    <p className="font-body text-xs text-cyan-400 font-bold mb-2">{t.card1title}</p>
                    <p className="font-body text-sm text-white font-mono bg-slate-900/60 rounded-lg px-3 py-2 text-center">{t.card1formula}</p>
                    <p className="font-body text-xs text-white/60 mt-2">{t.card1sub}</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border border-pink-500/30 rounded-xl p-4">
                    <p className="font-body text-xs text-pink-400 font-bold mb-2">{t.card2title}</p>
                    <p className="font-body text-sm text-white font-mono bg-slate-900/60 rounded-lg px-3 py-2 text-center">{t.card2formula}</p>
                    <p className="font-body text-xs text-white/60 mt-2">{t.card2sub}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border border-green-500/30 rounded-xl p-4 sm:col-span-2">
                    <p className="font-body text-xs text-green-400 font-bold mb-2">{t.card3title}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      {t.propItems.map(item => (
                        <div key={item.label} className="bg-slate-900/50 rounded-lg p-2">
                          <p className="text-lg">{item.icon}</p>
                          <p className="font-body text-xs text-white/60">{item.label}</p>
                          <p className={`font-body text-xs font-bold ${item.val === "Tetap" || item.val === "Unchanged" || item.val === "変わらない" ? "text-green-400" : "text-yellow-400"}`}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest">{t.tipsLabel}</p>
                <div className="space-y-2">
                  {t.tips.map(tip => (
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

              <div className="bg-gradient-to-r from-orange-900/40 via-yellow-900/30 to-orange-900/40 border border-orange-500/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏁</span>
                  <p className="font-body text-sm font-bold text-orange-300 uppercase tracking-wide">{t.conclTitle}</p>
                </div>
                <p className="font-body text-sm text-white/85 leading-relaxed">{t.conclBody}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.tags.map(tag => (
                    <span key={tag} className="bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-0.5 text-xs font-body text-orange-200">{tag}</span>
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

export default TranslasiPage;
