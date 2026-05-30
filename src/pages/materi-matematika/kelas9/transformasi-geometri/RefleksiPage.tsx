import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

/* ── SVG helpers ── */
const S = 220, sc = S / 14, ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;
const ticks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

function Grid({ children, accent = "#34d399" }: { children?: React.ReactNode; accent?: string }) {
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

function Poly({ pts, color, fill, label }: { pts: [number, number][]; color: string; fill: string; label?: string }) {
  const d = pts.map(([x, y]) => `${px(x)},${py(y)}`).join(" ");
  const cx_ = pts.reduce((s, [x]) => s + x, 0) / pts.length;
  const cy_ = pts.reduce((s, [, y]) => s + y, 0) / pts.length;
  return (
    <g>
      <polygon points={d} fill={fill} stroke={color} strokeWidth="1.5" />
      {label && <text x={px(cx_)} y={py(cy_) + 4} textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </g>
  );
}

function Dot({ x, y, color, label, anchor = "start" }: { x: number; y: number; color: string; label?: string; anchor?: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={4} fill={color} />
      {label && <text x={px(x) + (anchor === "end" ? -7 : 7)} y={py(y) - 4} fill={color} fontSize="9" fontWeight="bold" textAnchor={anchor}>{label}</text>}
    </g>
  );
}

function DashLine({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke={color} strokeWidth="1" strokeDasharray="4,2" />;
}

/* ── Mirror line types ── */
type MirrorType = "sumbu-x" | "sumbu-y" | "y=x" | "y=-x" | "titik-o";

const MIRRORS: { id: MirrorType; label: string; rule: string; color: string }[] = [
  { id: "sumbu-x", label: "Sumbu X",  rule: "(x,y)→(x,−y)",   color: "#22d3ee" },
  { id: "sumbu-y", label: "Sumbu Y",  rule: "(x,y)→(−x,y)",   color: "#f472b6" },
  { id: "y=x",    label: "y = x",    rule: "(x,y)→(y,x)",     color: "#fbbf24" },
  { id: "y=-x",   label: "y = −x",   rule: "(x,y)→(−y,−x)",  color: "#a78bfa" },
  { id: "titik-o", label: "Titik O", rule: "(x,y)→(−x,−y)",  color: "#34d399" },
];

function reflectMath(x: number, y: number, m: MirrorType): [number, number] {
  switch (m) {
    case "sumbu-x": return [x, -y];
    case "sumbu-y": return [-x, y];
    case "y=x":     return [y, x];
    case "y=-x":    return [-y, -x];
    case "titik-o": return [-x, -y];
  }
}

/* Render the dashed mirror line inside the 220px SVG */
function MirrorLine({ mirror }: { mirror: MirrorType }) {
  const m = MIRRORS.find(m => m.id === mirror)!;
  const c = m.color;
  const dash = "5,3";
  const lw = "2";
  switch (mirror) {
    case "sumbu-x":
      return (
        <>
          <line x1={4} y1={oy} x2={S-4} y2={oy} stroke={c} strokeWidth={lw} strokeDasharray={dash} />
          <text x={S-10} y={oy-5} fontSize="8" fill={c} textAnchor="end" fontWeight="bold">Sumbu X</text>
        </>
      );
    case "sumbu-y":
      return (
        <>
          <line x1={ox} y1={4} x2={ox} y2={S-4} stroke={c} strokeWidth={lw} strokeDasharray={dash} />
          <text x={ox+4} y={14} fontSize="8" fill={c} fontWeight="bold">Sumbu Y</text>
        </>
      );
    case "y=x":
      return (
        <>
          <line x1={px(-5)} y1={py(-5)} x2={px(5)} y2={py(5)} stroke={c} strokeWidth={lw} strokeDasharray={dash} />
          <text x={px(4.2)} y={py(4.2)-5} fontSize="8" fill={c} textAnchor="middle" fontWeight="bold">y=x</text>
        </>
      );
    case "y=-x":
      return (
        <>
          <line x1={px(-5)} y1={py(5)} x2={px(5)} y2={py(-5)} stroke={c} strokeWidth={lw} strokeDasharray={dash} />
          <text x={px(3.5)} y={py(-3.5)+14} fontSize="8" fill={c} textAnchor="middle" fontWeight="bold">y=−x</text>
        </>
      );
    case "titik-o":
      return (
        <>
          <circle cx={ox} cy={oy} r={8} fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.5" />
          <circle cx={ox} cy={oy} r={3} fill={c} />
          <text x={ox+10} y={oy-7} fontSize="8" fill={c} fontWeight="bold">O(0,0)</text>
        </>
      );
  }
}

/* Compact mirror selector */
function MirrorSelector({ value, onChange }: { value: MirrorType; onChange: (m: MirrorType) => void }) {
  return (
    <div className="w-full">
      <p className="text-[10px] text-white/40 uppercase tracking-wider font-body mb-1.5 text-center">Pilih Cermin</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {MIRRORS.map(m => (
          <button
            key={m.id}
            onClick={() => { playPopSound(); onChange(m.id); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-body border transition-all cursor-pointer ${
              value === m.id
                ? "text-black scale-105"
                : "bg-slate-800/60 border-white/10 text-white/50 hover:text-white/80"
            }`}
            style={value === m.id ? { background: m.color, borderColor: m.color } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>
      {(() => {
        const m = MIRRORS.find(m => m.id === value)!;
        return (
          <p className="text-center mt-1.5 font-mono text-[11px]" style={{ color: m.color }}>
            Aturan: {m.rule}
          </p>
        );
      })()}
    </div>
  );
}

/* Direction pad (same style as TranslasiPage) */
type Dir4 = "up" | "down" | "left" | "right";

function DirPad({ onMove, onReset }: { onMove: (d: Dir4) => void; onReset: () => void }) {
  const Btn = ({ d, label }: { d: Dir4 | null; label: string }) => (
    <button
      onClick={() => { playPopSound(); d ? onMove(d) : onReset(); }}
      className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 font-bold text-base
                 hover:bg-emerald-500/40 hover:border-emerald-300 active:scale-90 transition-all flex items-center justify-center select-none cursor-pointer"
    >{label}</button>
  );
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex"><Btn d="up" label="↑" /></div>
      <div className="flex gap-1">
        <Btn d="left" label="←" />
        <button
          onClick={() => { playPopSound(); onReset(); }}
          className="w-10 h-10 rounded-lg bg-slate-700/60 border border-slate-500/40 text-slate-300 text-sm
                     hover:bg-slate-600 active:scale-90 transition-all flex items-center justify-center select-none cursor-pointer"
        >↺</button>
        <Btn d="right" label="→" />
      </div>
      <div className="flex"><Btn d="down" label="↓" /></div>
    </div>
  );
}

/* ── Animasi 1 — Refleksi Titik ── */
function AnimasiRefleksiTitik() {
  const OX = 3, OY = 2;
  const [pos, setPos]       = useState({ x: OX, y: OY });
  const [mirror, setMirror] = useState<MirrorType>("sumbu-x");
  const [show, setShow]     = useState(false);

  const move = (d: Dir4) => {
    setShow(false);
    setPos(p => {
      if (d === "up"    && p.y < 5)  return { ...p, y: p.y + 1 };
      if (d === "down"  && p.y > -5) return { ...p, y: p.y - 1 };
      if (d === "left"  && p.x > -5) return { ...p, x: p.x - 1 };
      if (d === "right" && p.x < 5)  return { ...p, x: p.x + 1 };
      return p;
    });
  };

  const reset = () => { setPos({ x: OX, y: OY }); setShow(false); };

  const [rx, ry] = reflectMath(pos.x, pos.y, mirror);
  const mc = MIRRORS.find(m => m.id === mirror)!;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-emerald-300 font-bold text-sm font-body">📍 Animasi 1 — Refleksi Titik</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">Arahkan titik A, pilih cermin, lalu tampilkan bayangannya!</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent="#34d399">
            <MirrorLine mirror={mirror} />
            <Dot x={pos.x} y={pos.y} color="#22d3ee"
              label={`A(${pos.x},${pos.y})`}
              anchor={pos.x >= 0 ? "start" : "end"} />
            {show && (
              <>
                <DashLine x1={pos.x} y1={pos.y} x2={rx} y2={ry} color="rgba(255,255,255,0.25)" />
                <circle cx={px(rx)} cy={py(ry)} r={4} fill={mc.color} />
                <text
                  x={px(rx) + (rx >= 0 ? 7 : -7)} y={py(ry) - 4}
                  fill={mc.color} fontSize="9" fontWeight="bold"
                  textAnchor={rx >= 0 ? "start" : "end"}
                >A'({rx},{ry})</text>
              </>
            )}
          </Grid>
        </div>
        {/* Desktop: DirPad + button stacked in right column */}
        <div className="hidden sm:flex sm:shrink-0 sm:flex-col sm:items-center sm:gap-3">
          <DirPad onMove={move} onReset={reset} />
          <button
            onClick={() => { playPopSound(); setShow(v => !v); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-all active:scale-95 border cursor-pointer text-center ${
              show
                ? "bg-slate-700/60 border-slate-500/40 text-slate-300 hover:bg-slate-600/80"
                : "bg-emerald-500/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/40"
            }`}
          >
            {show ? "↺ Sembunyikan" : "🪞 Tampilkan\nBayangan A'"}
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-slate-800/60 rounded-lg px-3 py-2 text-center font-body min-h-[32px] flex items-center justify-center gap-2 flex-wrap text-[11px] sm:text-xs">
        {show ? (
          <>
            <span className="text-cyan-300 font-bold">A({pos.x},{pos.y})</span>
            <span className="text-white/40">→</span>
            <span className="font-bold" style={{ color: mc.color }}>A'({rx},{ry})</span>
            <span className="text-white/30">|</span>
            <span className="font-mono" style={{ color: mc.color }}>{mc.rule}</span>
          </>
        ) : (
          <span className="text-white/30">Tekan ↑ ↓ ← → untuk menggeser titik, lalu tampilkan bayangan!</span>
        )}
      </div>

      {/* Portrait: DirPad + button below grid */}
      <div className="flex flex-col items-center gap-3 sm:hidden">
        <DirPad onMove={move} onReset={reset} />
        <button
          onClick={() => { playPopSound(); setShow(v => !v); }}
          className={`px-5 py-2 rounded-xl text-sm font-bold font-body transition-all active:scale-95 border cursor-pointer ${
            show
              ? "bg-slate-700/60 border-slate-500/40 text-slate-300 hover:bg-slate-600/80"
              : "bg-emerald-500/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/40"
          }`}
        >
          {show ? "↺ Sembunyikan Bayangan" : "🪞 Tampilkan Bayangan A'"}
        </button>
      </div>

      {/* Mirror selector */}
      <MirrorSelector value={mirror} onChange={m => { setMirror(m); setShow(false); }} />

      <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-emerald-300 text-xs font-body">
          💡 Bayangan A' berjarak <strong>sama</strong> ke garis cermin seperti titik A — dan garis AA' <strong className="text-yellow-300">tegak lurus</strong> garis cermin!
        </p>
      </div>
    </div>
  );
}

/* ── Animasi 2 — Refleksi Garis x = k dan y = k ── */
type ModeK = "x=k" | "y=k";

function NumBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={() => { playPopSound(); onClick(); }}
      className="w-7 h-7 rounded-md bg-slate-700/60 border border-slate-500/40 text-white/80 text-sm font-bold
                 hover:bg-slate-600 active:scale-90 transition-all flex items-center justify-center select-none cursor-pointer"
    >{label}</button>
  );
}

function EditableVal({
  label, value, min, max, color, onChange,
}: { label: string; value: number; min: number; max: number; color: string; onChange: (v: number) => void }) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-white/40 uppercase tracking-wider font-body">{label}</span>
      <div className="flex items-center gap-1">
        <NumBtn label="−" onClick={() => onChange(clamp(value - 1))} />
        <span className="w-8 text-center font-mono text-sm font-bold" style={{ color }}>{value}</span>
        <NumBtn label="+" onClick={() => onChange(clamp(value + 1))} />
      </div>
    </div>
  );
}

function AnimasiRefleksiGarisK() {
  const [mode, setMode] = useState<ModeK>("x=k");
  const [ptX, setPtX]   = useState(2);
  const [ptY, setPtY]   = useState(3);
  const [k, setK]       = useState(1);
  const [show, setShow] = useState(false);

  const clamp5 = (v: number) => Math.max(-5, Math.min(5, v));

  const move = (d: Dir4) => {
    setShow(false);
    if (d === "up")    setPtY(p => p < 5  ? p + 1 : p);
    if (d === "down")  setPtY(p => p > -5 ? p - 1 : p);
    if (d === "left")  setPtX(p => p > -5 ? p - 1 : p);
    if (d === "right") setPtX(p => p < 5  ? p + 1 : p);
  };

  const reset = () => { setPtX(2); setPtY(3); setK(1); setShow(false); };

  const rx = mode === "x=k" ? 2 * k - ptX : ptX;
  const ry = mode === "x=k" ? ptY : 2 * k - ptY;

  const accent  = mode === "x=k" ? "#f97316" : "#a78bfa";
  const formula = mode === "x=k"
    ? `(${ptX}, ${ptY}) → (2·${k}−${ptX}, ${ptY}) = (${rx}, ${ry})`
    : `(${ptX}, ${ptY}) → (${ptX}, 2·${k}−${ptY}) = (${rx}, ${ry})`;

  const ShowBtn = ({ small }: { small?: boolean }) => (
    <button
      onClick={() => { playPopSound(); setShow(v => !v); }}
      className={`rounded-xl font-bold font-body transition-all active:scale-95 border cursor-pointer text-center ${
        small ? "px-4 py-2 text-xs" : "px-5 py-2 text-sm"
      } ${
        show
          ? "bg-slate-700/60 border-slate-500/40 text-slate-300 hover:bg-slate-600/80"
          : "border"
      }`}
      style={!show ? { background: `${accent}33`, borderColor: `${accent}88`, color: accent } : {}}
    >
      {show ? (small ? "↺ Sembunyikan" : "↺ Sembunyikan Bayangan") : (small ? "🪞 Tampilkan\nBayangan A'" : "🪞 Tampilkan Bayangan A'")}
    </button>
  );

  const KControl = () => (
    <EditableVal
      label="nilai k" value={k} min={-4} max={4} color={accent}
      onChange={v => { setK(clamp5(v)); setShow(false); }}
    />
  );

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="font-bold text-sm font-body" style={{ color: accent }}>
          📐 Animasi 2 — Refleksi Garis x = k dan y = k
        </p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">
          Arahkan titik A, atur nilai k, lalu tampilkan bayangannya!
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2">
        {(["x=k", "y=k"] as ModeK[]).map(m => (
          <button
            key={m}
            onClick={() => { playPopSound(); setMode(m); setShow(false); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold font-body border transition-all cursor-pointer ${
              mode === m ? "text-black scale-105" : "bg-slate-800/60 border-white/10 text-white/50 hover:text-white/80"
            }`}
            style={mode === m ? { background: accent, borderColor: accent } : {}}
          >
            Garis {m}
          </button>
        ))}
      </div>

      {/* Grid + right column (landscape identical to Animasi 1) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent={accent}>
            {/* Mirror line */}
            {mode === "x=k" ? (
              <>
                <line x1={px(k)} y1={4} x2={px(k)} y2={S - 4}
                  stroke={accent} strokeWidth="2" strokeDasharray="5,3" />
                <text x={px(k) + 4} y={14} fontSize="8" fill={accent} fontWeight="bold">x={k}</text>
              </>
            ) : (
              <>
                <line x1={4} y1={py(k)} x2={S - 4} y2={py(k)}
                  stroke={accent} strokeWidth="2" strokeDasharray="5,3" />
                <text x={S - 10} y={py(k) - 5} fontSize="8" fill={accent} fontWeight="bold" textAnchor="end">y={k}</text>
              </>
            )}
            {show && <DashLine x1={ptX} y1={ptY} x2={rx} y2={ry} color="rgba(255,255,255,0.25)" />}
            <Dot x={ptX} y={ptY} color="#22d3ee"
              label={`A(${ptX},${ptY})`} anchor={ptX >= 0 ? "start" : "end"} />
            {show && (
              <>
                <circle cx={px(rx)} cy={py(ry)} r={4} fill={accent} />
                <text x={px(rx) + (rx >= 0 ? 7 : -7)} y={py(ry) - 4}
                  fill={accent} fontSize="9" fontWeight="bold"
                  textAnchor={rx >= 0 ? "start" : "end"}>A'({rx},{ry})</text>
                <circle
                  cx={mode === "x=k" ? px(k) : px((ptX + rx) / 2)}
                  cy={mode === "x=k" ? py((ptY + ry) / 2) : py(k)}
                  r={3} fill="white" fillOpacity="0.5" />
              </>
            )}
          </Grid>
        </div>

        {/* Landscape right column */}
        <div className="hidden sm:flex sm:shrink-0 sm:flex-col sm:items-center sm:gap-3">
          <DirPad onMove={move} onReset={reset} />
          <KControl />
          <ShowBtn small />
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-slate-800/60 rounded-lg px-3 py-2 text-center font-body min-h-[32px] flex items-center justify-center flex-wrap gap-1.5 text-[11px] sm:text-xs">
        {show ? (
          <>
            <span className="text-cyan-300 font-bold">A({ptX},{ptY})</span>
            <span className="text-white/40">→</span>
            <span className="font-mono text-white/50">{formula}</span>
            <span className="text-white/30">→</span>
            <span className="font-bold" style={{ color: accent }}>A'({rx},{ry})</span>
          </>
        ) : (
          <span className="text-white/30">Tekan ↑ ↓ ← → untuk menggeser titik, atur k, lalu tampilkan bayangan!</span>
        )}
      </div>

      {/* Portrait controls below grid */}
      <div className="flex flex-col items-center gap-3 sm:hidden">
        <DirPad onMove={move} onReset={reset} />
        <KControl />
        <ShowBtn />
      </div>

      {/* Info box */}
      <div className="rounded-lg px-4 py-2.5 text-center border" style={{ background: `${accent}15`, borderColor: `${accent}40` }}>
        <p className="text-xs font-body" style={{ color: accent }}>
          {mode === "x=k" ? (
            <>💡 Rumus: <strong>A(x, y) → A'(2k−x, y)</strong> · y tetap, x dicerminkan terhadap garis vertikal x = {k}</>
          ) : (
            <>💡 Rumus: <strong>A(x, y) → A'(x, 2k−y)</strong> · x tetap, y dicerminkan terhadap garis horizontal y = {k}</>
          )}
        </p>
      </div>
    </div>
  );
}

/* ── Animasi 3 — Refleksi Bangun Datar (Segitiga) ── */
type Vec2 = [number, number];
const TRI_BASE: Vec2[] = [[1, 1], [3, 1], [2, 3]];
const TRI_LABELS = ["A", "B", "C"];

function AnimasiRefleksiBangun() {
  const [off, setOff]       = useState({ dx: 0, dy: 0 });
  const [mirror, setMirror] = useState<MirrorType>("sumbu-y");
  const [show, setShow]     = useState(false);

  const current: Vec2[] = TRI_BASE.map(([x, y]) => [x + off.dx, y + off.dy]);

  const inRange = (pts: Vec2[]) => pts.every(([x, y]) => x >= -5 && x <= 5 && y >= -5 && y <= 5);

  const move = (d: Dir4) => {
    setShow(false);
    setOff(o => {
      const next =
        d === "up"    ? { ...o, dy: o.dy + 1 } :
        d === "down"  ? { ...o, dy: o.dy - 1 } :
        d === "left"  ? { ...o, dx: o.dx - 1 } :
                        { ...o, dx: o.dx + 1 };
      const newPts: Vec2[] = TRI_BASE.map(([x, y]) => [x + next.dx, y + next.dy]);
      return inRange(newPts) ? next : o;
    });
  };

  const reset = () => { setOff({ dx: 0, dy: 0 }); setShow(false); };

  const reflected: Vec2[] = current.map(([x, y]) => reflectMath(x, y, mirror));
  const mc = MIRRORS.find(m => m.id === mirror)!;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-pink-300 font-bold text-sm font-body">🔺 Animasi 3 — Refleksi Bangun Datar</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">Arahkan segitiga △ABC, pilih cermin, lalu tampilkan bayangannya!</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent="#f472b6">
            <MirrorLine mirror={mirror} />
            <Poly pts={current} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
            {current.map(([x, y], i) => (
              <text
                key={i}
                x={px(x) + (i === 1 ? 6 : -4)} y={py(y) + (i === 2 ? -5 : 11)}
                fill="#67e8f9" fontSize="8" fontWeight="bold"
                textAnchor={i === 1 ? "start" : "end"}
              >{TRI_LABELS[i]}({x},{y})</text>
            ))}
            {show && (
              <>
                {current.map(([x, y], i) => (
                  <DashLine key={i} x1={x} y1={y} x2={reflected[i][0]} y2={reflected[i][1]} color="rgba(255,255,255,0.2)" />
                ))}
                <Poly pts={reflected} color={mc.color} fill={`${mc.color}22`} label="△A'B'C'" />
                {reflected.map(([x, y], i) => (
                  <text
                    key={i}
                    x={px(x) + (i === 1 ? 6 : -4)} y={py(y) + (i === 2 ? -5 : 11)}
                    fill={mc.color} fontSize="8" fontWeight="bold"
                    textAnchor={i === 1 ? "start" : "end"}
                  >{TRI_LABELS[i]}'({x},{y})</text>
                ))}
              </>
            )}
          </Grid>
        </div>
        {/* Desktop: DirPad + button stacked in right column */}
        <div className="hidden sm:flex sm:shrink-0 sm:flex-col sm:items-center sm:gap-3">
          <DirPad onMove={move} onReset={reset} />
          <button
            onClick={() => { playPopSound(); setShow(v => !v); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-all active:scale-95 border cursor-pointer text-center ${
              show
                ? "bg-slate-700/60 border-slate-500/40 text-slate-300 hover:bg-slate-600/80"
                : "bg-pink-500/20 border-pink-400/50 text-pink-200 hover:bg-pink-500/40"
            }`}
          >
            {show ? "↺ Sembunyikan" : "🪞 Tampilkan\nBayangan △A'B'C'"}
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-slate-800/60 rounded-lg px-3 py-2 text-center font-body min-h-[32px] flex items-center justify-center gap-1.5 flex-wrap text-[11px] sm:text-xs">
        {show ? (
          <>
            {current.map(([x, y], i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-cyan-300 font-bold">{TRI_LABELS[i]}({x},{y})</span>
                <span className="text-white/40">→</span>
                <span className="font-bold" style={{ color: mc.color }}>{TRI_LABELS[i]}'({reflected[i][0]},{reflected[i][1]})</span>
                {i < 2 && <span className="text-white/20 mx-0.5">·</span>}
              </span>
            ))}
          </>
        ) : (
          <span className="text-white/30">Arahkan segitiga lalu tampilkan bayangannya!</span>
        )}
      </div>

      {/* Portrait: DirPad + button below grid */}
      <div className="flex flex-col items-center gap-3 sm:hidden">
        <DirPad onMove={move} onReset={reset} />
        <button
          onClick={() => { playPopSound(); setShow(v => !v); }}
          className={`px-5 py-2 rounded-xl text-sm font-bold font-body transition-all active:scale-95 border cursor-pointer ${
            show
              ? "bg-slate-700/60 border-slate-500/40 text-slate-300 hover:bg-slate-600/80"
              : "bg-pink-500/20 border-pink-400/50 text-pink-200 hover:bg-pink-500/40"
          }`}
        >
          {show ? "↺ Sembunyikan Bayangan" : "🪞 Tampilkan Bayangan △A'B'C'"}
        </button>
      </div>

      {/* Mirror selector */}
      <MirrorSelector value={mirror} onChange={m => { setMirror(m); setShow(false); }} />

      <div className="bg-pink-950/40 border border-pink-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-pink-200 text-xs font-body">
          💡 Semua titik dicerminkan dengan aturan yang <strong>sama</strong>.
          Bentuk & ukuran segitiga <strong className="text-green-300">tetap</strong> — hanya posisi & orientasinya yang berubah!
        </p>
      </div>
    </div>
  );
}

/* ── Static SVG diagrams ── */
const DiagramSbX = () => (
  <Grid accent="#34d399">
    <line x1={0} y1={oy} x2={S} y2={oy} stroke="#facc15" strokeWidth="2.5" strokeDasharray="6,3" />
    <Poly pts={[[-4, 1], [-1, 1], [-2, 3]]} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
    <Poly pts={[[-4, -1], [-1, -1], [-2, -3]]} color="#f472b6" fill="rgba(244,114,182,0.15)" label="△A'B'C'" />
    <DashLine x1={-4} y1={1} x2={-4} y2={-1} color="#94a3b8" />
    <DashLine x1={-1} y1={1} x2={-1} y2={-1} color="#94a3b8" />
    <DashLine x1={-2} y1={3} x2={-2} y2={-3} color="#94a3b8" />
    <text x={px(2)} y={py(0.4)} fontSize="8" fill="#fde68a" fontWeight="bold">sumbu-x</text>
  </Grid>
);

const DiagramSbY = () => (
  <Grid accent="#a78bfa">
    <line x1={ox} y1={0} x2={ox} y2={S} stroke="#facc15" strokeWidth="2.5" strokeDasharray="6,3" />
    <Poly pts={[[1, 4], [3, 4], [2, 2]]} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△PQR" />
    <Poly pts={[[-1, 4], [-3, 4], [-2, 2]]} color="#f472b6" fill="rgba(244,114,182,0.15)" label="△P'Q'R'" />
    <DashLine x1={1} y1={4} x2={-1} y2={4} color="#94a3b8" />
    <DashLine x1={3} y1={4} x2={-3} y2={4} color="#94a3b8" />
    <DashLine x1={2} y1={2} x2={-2} y2={2} color="#94a3b8" />
    <text x={px(0)} y={py(0.5)} fontSize="8" fill="#fde68a" fontWeight="bold" textAnchor="middle">sumbu-y</text>
  </Grid>
);

const DiagramDiag = () => (
  <Grid accent="#fb923c">
    <line x1={px(-5)} y1={py(-5)} x2={px(5)} y2={py(5)} stroke="#facc15" strokeWidth="2" strokeDasharray="6,3" />
    <text x={px(3.5)} y={py(3.8)} fontSize="8" fill="#fde68a">y=x</text>
    <Poly pts={[[1, 1], [4, 1], [3, 3]]} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
    <Poly pts={[[1, 1], [1, 4], [3, 3]]} color="#fb923c" fill="rgba(251,146,60,0.15)" label="△A'B'C'" />
  </Grid>
);

/* ── Page ── */
const RefleksiPage = () => {
  const [open, setOpen] = useState<string[]>(["animasi", "intro", "rumus", "contoh1", "contoh2", "diag", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]); };

  const Hdr = ({ id, icon, color, title }: { id: string; icon: React.ReactNode; color: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <div className="text-4xl text-center mb-3">🪞</div>
        <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-400 text-center mb-1">REFLEKSI (PENCERMINAN)</h1>
        <p className="font-display text-sm font-semibold text-emerald-300 text-center mb-1">Bayangan di Cermin Matematika!</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Transformasi Geometri · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── ANIMASI INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-emerald-500/30 rounded-xl overflow-hidden">
            <Hdr id="animasi" icon={<span>🎮</span>} color="#34d399" title="Animasi Interaktif — Refleksi Titik & Bangun Datar" />
            {open.includes("animasi") && (
              <div className="px-4 pb-5 space-y-8">
                <AnimasiRefleksiTitik />
                <div className="border-t border-white/10" />
                <AnimasiRefleksiGarisK />
                <div className="border-t border-white/10" />
                <AnimasiRefleksiBangun />
              </div>
            )}
          </div>

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" title="🌟 Apa Itu Refleksi?" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-emerald-300">Refleksi</strong> adalah transformasi yang mencerminkan setiap titik terhadap suatu garis yang disebut <strong className="text-yellow-300">sumbu pencerminan</strong> (garis cermin). Jarak titik dari garis cermin <strong className="text-white">tetap sama</strong>, hanya posisinya yang bercermin.
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <p className="text-emerald-300 font-body text-sm font-semibold mb-2">🔑 Sifat-Sifat Refleksi:</p>
                  <ul className="space-y-1 text-sm text-white/80 font-body list-disc list-inside">
                    <li>Bentuk dan ukuran bangun <strong className="text-white">tetap sama</strong></li>
                    <li>Orientasi bangun <strong className="text-red-300">berbalik</strong> (seperti melihat di cermin)</li>
                    <li>Jarak titik ke garis cermin = Jarak bayangan ke garis cermin</li>
                    <li>Garis yang menghubungkan titik dan bayangannya <strong className="text-white">tegak lurus</strong> garis cermin</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[["✅ Bentuk", "Tetap sama"], ["✅ Ukuran", "Tetap sama"], ["❌ Orientasi", "Berbalik"], ["✅ Jarak ke cermin", "Tetap sama"]].map(([k, v]) => (
                    <div key={k} className="bg-slate-800/60 rounded-lg p-3 text-center">
                      <p className="text-xs font-semibold text-white/60 font-body">{k}</p>
                      <p className="text-sm font-bold text-white font-body">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="rumus" icon={<Calculator className="w-5 h-5" />} color="#22d3ee" title="📐 Rumus Refleksi" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="text-sm text-white/70 font-body">Untuk titik <InlineMath math="A(x, y)" />, bayangannya <InlineMath math="A'(x', y')" /> tergantung pada garis cermin:</p>
                <div className="space-y-3">
                  {[
                    { cermin: "Sumbu-x (y = 0)", rumus: "(x, y) \\rightarrow (x, -y)", catatan: "x tetap, y dinegasikan" },
                    { cermin: "Sumbu-y (x = 0)", rumus: "(x, y) \\rightarrow (-x, y)", catatan: "x dinegasikan, y tetap" },
                    { cermin: "Garis y = x", rumus: "(x, y) \\rightarrow (y, x)", catatan: "x dan y ditukar" },
                    { cermin: "Garis y = −x", rumus: "(x, y) \\rightarrow (-y, -x)", catatan: "x dan y ditukar lalu dinegasikan" },
                    { cermin: "Garis x = k", rumus: "(x, y) \\rightarrow (2k-x, y)", catatan: "y tetap, x dicerminkan terhadap x=k" },
                    { cermin: "Garis y = k", rumus: "(x, y) \\rightarrow (x, 2k-y)", catatan: "x tetap, y dicerminkan terhadap y=k" },
                  ].map(({ cermin, rumus, catatan }) => (
                    <div key={cermin} className="bg-slate-800/60 rounded-xl p-3 flex flex-col gap-1">
                      <p className="text-xs font-bold text-yellow-300 font-body">{cermin}</p>
                      <div className="text-center"><InlineMath math={rumus} /></div>
                      <p className="text-xs text-white/50 font-body">{catatan}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - Sumbu X */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh1" icon={<BookOpen className="w-5 h-5" />} color="#34d399" title="📌 Contoh 1: Refleksi terhadap Sumbu-x" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-emerald-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(-4,1), B(-1,1), C(-2,3)" /> jika dicerminkan terhadap sumbu-x!</p>
                </div>
                <div className="flex justify-center"><DiagramSbX /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-emerald-300 font-body">Penyelesaian (y dinegasikan):</p>
                  {[["A(−4, 1)", "A'(−4, −1)"], ["B(−1, 1)", "B'(−1, −1)"], ["C(−2, 3)", "C'(−2, −3)"]].map(([dari, ke]) => (
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

          {/* CONTOH 2 - Sumbu Y */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh2" icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title="📌 Contoh 2: Refleksi terhadap Sumbu-y" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga PQR dengan <InlineMath math="P(1,4), Q(3,4), R(2,2)" /> jika dicerminkan terhadap sumbu-y!</p>
                </div>
                <div className="flex justify-center"><DiagramSbY /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-violet-300 font-body">Penyelesaian (x dinegasikan):</p>
                  {[["P(1, 4)", "P'(−1, 4)"], ["Q(3, 4)", "Q'(−3, 4)"], ["R(2, 2)", "R'(−2, 2)"]].map(([dari, ke]) => (
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

          {/* CONTOH 3 - y = x */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="diag" icon={<BookOpen className="w-5 h-5" />} color="#fb923c" title="📌 Contoh 3: Refleksi terhadap Garis y = x" />
            {open.includes("diag") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-orange-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(1,1), B(4,1), C(3,3)" /> jika dicerminkan terhadap garis <InlineMath math="y = x" />!</p>
                </div>
                <div className="flex justify-center"><DiagramDiag /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-orange-300 font-body">Penyelesaian (x dan y ditukar):</p>
                  {[["A(1, 1)", "A'(1, 1)"], ["B(4, 1)", "B'(1, 4)"], ["C(3, 3)", "C'(3, 3)"]].map(([dari, ke]) => (
                    <div key={dari} className="flex items-center gap-3 text-sm font-body">
                      <span className="text-cyan-300 min-w-[80px]">{dari}</span>
                      <span className="text-white/40">→</span>
                      <span className="text-orange-300 font-bold">{ke}</span>
                    </div>
                  ))}
                  <p className="text-xs text-white/50 font-body mt-2">Catatan: A dan C adalah titik tetap karena berada di garis y = x</p>
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
                  ["Definisi", "Mencerminkan setiap titik terhadap garis cermin (sumbu)"],
                  ["Sumbu-x", "A(x, y) → A'(x, −y)"],
                  ["Sumbu-y", "A(x, y) → A'(−x, y)"],
                  ["Garis y = x", "A(x, y) → A'(y, x)"],
                  ["Garis y = −x", "A(x, y) → A'(−y, −x)"],
                  ["Titik O(0,0)", "A(x, y) → A'(−x, −y)"],
                  ["Sifat", "Bentuk & ukuran tetap, orientasi berbalik"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-3">
                    <span className="text-orange-400 font-bold text-sm font-body min-w-[90px]">{k}</span>
                    <span className="text-white/80 text-sm font-body">{v}</span>
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

export default RefleksiPage;
