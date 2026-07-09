import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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
      {label && <text x={px(cx_)} y={py(cy_) + 3} textAnchor="middle" fill={color} fontSize="7" opacity="0.75">{label}</text>}
    </g>
  );
}

/* Compute smart label offset: pushes label away from triangle centroid */
function vtxOffset(x: number, y: number, pts: [number,number][]) {
  const cx = pts.reduce((s,[vx])=>s+vx,0)/pts.length;
  const cy = pts.reduce((s,[,vy])=>s+vy,0)/pts.length;
  const vx = x - cx, vy = y - cy;
  const len = Math.sqrt(vx*vx+vy*vy) || 1;
  const nx = vx/len, ny = vy/len;
  return {
    dx: nx * 12,
    dy: -ny * 12,   // SVG y-axis is flipped
    anchor: nx > 0.25 ? "start" : nx < -0.25 ? "end" : "middle",
  };
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

function getMirrors(language: Language): { id: MirrorType; label: string; rule: string; color: string }[] {
  const L = (id: string, en: string, ja: string) => ({ id, en, ja }[language] ?? id);
  return [
    { id: "sumbu-x", label: L("Sumbu X", "X-axis", "x軸"), rule: "(x,y)→(x,−y)",   color: "#22d3ee" },
    { id: "sumbu-y", label: L("Sumbu Y", "Y-axis", "y軸"), rule: "(x,y)→(−x,y)",   color: "#f472b6" },
    { id: "y=x",    label: "y = x",    rule: "(x,y)→(y,x)",     color: "#fbbf24" },
    { id: "y=-x",   label: "y = −x",   rule: "(x,y)→(−y,−x)",  color: "#a78bfa" },
    { id: "titik-o", label: L("Titik O", "Point O", "原点O"), rule: "(x,y)→(−x,−y)",  color: "#34d399" },
  ];
}

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
  const { language } = useLanguage();
  const m = getMirrors(language).find(m => m.id === mirror)!;
  const c = m.color;
  const dash = "5,3";
  const lw = "2";
  switch (mirror) {
    case "sumbu-x":
      return (
        <>
          <line x1={4} y1={oy} x2={S-4} y2={oy} stroke={c} strokeWidth={lw} strokeDasharray={dash} />
          <text x={S-10} y={oy-5} fontSize="8" fill={c} textAnchor="end" fontWeight="bold">{m.label}</text>
        </>
      );
    case "sumbu-y":
      return (
        <>
          <line x1={ox} y1={4} x2={ox} y2={S-4} stroke={c} strokeWidth={lw} strokeDasharray={dash} />
          <text x={ox+4} y={14} fontSize="8" fill={c} fontWeight="bold">{m.label}</text>
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
  const { language } = useLanguage();
  const mirrors = getMirrors(language);
  const pilihCermin = { id: "Pilih Cermin", en: "Choose Mirror", ja: "鏡を選ぶ" }[language];
  const aturan = { id: "Aturan", en: "Rule", ja: "規則" }[language];
  return (
    <div className="w-full">
      <p className="text-[10px] text-white/40 uppercase tracking-wider font-body mb-1.5 text-center">{pilihCermin}</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {mirrors.map(m => (
          <button
            key={m.id}
            onClick={() => { playPopSound(); onChange(m.id); }}
            aria-label={m.label}
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
        const m = mirrors.find(m => m.id === value)!;
        return (
          <p className="text-center mt-1.5 font-mono text-[11px]" style={{ color: m.color }}>
            {aturan}: {m.rule}
          </p>
        );
      })()}
    </div>
  );
}

/* Direction pad (same style as TranslasiPage) */
type Dir4 = "up" | "down" | "left" | "right";

function DirPad({ onMove, onReset }: { onMove: (d: Dir4) => void; onReset: () => void }) {
  const { language } = useLanguage();
  const dirLabels: Record<Dir4, string> = {
    up: { id: "Naik", en: "Up", ja: "上" }[language],
    down: { id: "Turun", en: "Down", ja: "下" }[language],
    left: { id: "Kiri", en: "Left", ja: "左" }[language],
    right: { id: "Kanan", en: "Right", ja: "右" }[language],
  };
  const resetLabel = { id: "Reset", en: "Reset", ja: "リセット" }[language];
  const Btn = ({ d, label }: { d: Dir4 | null; label: string }) => (
    <button
      onClick={() => { playPopSound(); d ? onMove(d) : onReset(); }}
      aria-label={d ? dirLabels[d] : resetLabel}
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
          aria-label={resetLabel}
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

  const { language } = useLanguage();
  const t1 = {
    title: { id: "📍 Animasi 1 — Refleksi Titik", en: "📍 Animation 1 — Point Reflection", ja: "📍 アニメーション1 — 点の反射" }[language],
    intro: { id: "Arahkan titik A, pilih cermin, lalu tampilkan bayangannya!", en: "Move point A, choose a mirror, then reveal its image!", ja: "点Aを動かし、鏡を選んで、像を表示しよう!" }[language],
    hide: { id: "↺ Sembunyikan", en: "↺ Hide", ja: "↺ 隠す" }[language],
    hideImage: { id: "↺ Sembunyikan Bayangan", en: "↺ Hide Image", ja: "↺ 像を隠す" }[language],
    showImage: { id: "🪞 Tampilkan\nBayangan A'", en: "🪞 Show\nImage A'", ja: "🪞 像A'を\n表示する" }[language],
    showImageFull: { id: "🪞 Tampilkan Bayangan A'", en: "🪞 Show Image A'", ja: "🪞 像A'を表示する" }[language],
    hint: { id: "Tekan ↑ ↓ ← → untuk menggeser titik, lalu tampilkan bayangan!", en: "Press ↑ ↓ ← → to move the point, then show the image!", ja: "↑ ↓ ← → を押して点を動かし、像を表示しよう!" }[language],
    tip: {
      id: <>💡 Bayangan A' berjarak <strong>sama</strong> ke garis cermin seperti titik A — dan garis AA' <strong className="text-yellow-300">tegak lurus</strong> garis cermin!</>,
      en: <>💡 Image A' is the <strong>same</strong> distance from the mirror line as point A — and line AA' is <strong className="text-yellow-300">perpendicular</strong> to the mirror line!</>,
      ja: <>💡 像A'は点Aと同じように鏡の線から<strong>同じ距離</strong>にあり、直線AA'は鏡の線に<strong className="text-yellow-300">垂直</strong>です!</>,
    }[language],
  };
  const [rx, ry] = reflectMath(pos.x, pos.y, mirror);
  const mc = getMirrors(language).find(m => m.id === mirror)!;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-emerald-300 font-bold text-sm font-body">{t1.title}</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">{t1.intro}</p>
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
            {show ? t1.hide : t1.showImage}
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
          <span className="text-white/30">{t1.hint}</span>
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
          {show ? t1.hideImage : t1.showImageFull}
        </button>
      </div>

      {/* Mirror selector */}
      <MirrorSelector value={mirror} onChange={m => { setMirror(m); setShow(false); }} />

      <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-emerald-300 text-xs font-body">
          {t1.tip}
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

  const { language } = useLanguage();
  const t2 = {
    title: { id: "📐 Animasi 3 — Refleksi Garis x = k dan y = k", en: "📐 Animation 3 — Reflection over x = k and y = k", ja: "📐 アニメーション3 — 直線x=kとy=kに関する反射" }[language],
    intro: { id: "Arahkan titik A, atur nilai k, lalu tampilkan bayangannya!", en: "Move point A, set the value of k, then show its image!", ja: "点Aを動かし、kの値を設定して、像を表示しよう!" }[language],
    line: { id: "Garis", en: "Line", ja: "直線" }[language],
    hide: { id: "↺ Sembunyikan", en: "↺ Hide", ja: "↺ 隠す" }[language],
    hideFull: { id: "↺ Sembunyikan Bayangan", en: "↺ Hide Image", ja: "↺ 像を隠す" }[language],
    showSmall: { id: "🪞 Tampilkan\nBayangan A'", en: "🪞 Show\nImage A'", ja: "🪞 像A'を\n表示する" }[language],
    showFull: { id: "🪞 Tampilkan Bayangan A'", en: "🪞 Show Image A'", ja: "🪞 像A'を表示する" }[language],
    kValue: { id: "nilai k", en: "value of k", ja: "kの値" }[language],
    hint: { id: "Tekan ↑ ↓ ← → untuk menggeser titik, atur k, lalu tampilkan bayangan!", en: "Press ↑ ↓ ← → to move the point, set k, then show the image!", ja: "↑ ↓ ← → を押して点を動かし、kを設定して像を表示しよう!" }[language],
    infoX: (kv: number) => ({
      id: <>💡 Rumus: <strong>A(x, y) → A'(2k−x, y)</strong> · y tetap, x dicerminkan terhadap garis vertikal x = {kv}</>,
      en: <>💡 Formula: <strong>A(x, y) → A'(2k−x, y)</strong> · y stays the same, x is reflected over the vertical line x = {kv}</>,
      ja: <>💡 公式: <strong>A(x, y) → A'(2k−x, y)</strong> · yはそのまま、xは垂直線x = {kv} に関して反射</>,
    }[language]),
    infoY: (kv: number) => ({
      id: <>💡 Rumus: <strong>A(x, y) → A'(x, 2k−y)</strong> · x tetap, y dicerminkan terhadap garis horizontal y = {kv}</>,
      en: <>💡 Formula: <strong>A(x, y) → A'(x, 2k−y)</strong> · x stays the same, y is reflected over the horizontal line y = {kv}</>,
      ja: <>💡 公式: <strong>A(x, y) → A'(x, 2k−y)</strong> · xはそのまま、yは水平線y = {kv} に関して反射</>,
    }[language]),
  };
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
      {show ? (small ? t2.hide : t2.hideFull) : (small ? t2.showSmall : t2.showFull)}
    </button>
  );

  const KControl = () => (
    <EditableVal
      label={t2.kValue} value={k} min={-4} max={4} color={accent}
      onChange={v => { setK(clamp5(v)); setShow(false); }}
    />
  );

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="font-bold text-sm font-body" style={{ color: accent }}>
          {t2.title}
        </p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">
          {t2.intro}
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
            {t2.line} {m}
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
                  r={3} fill="var(--icon-color)" fillOpacity="0.5" />
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
          <span className="text-white/30">{t2.hint}</span>
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
          {mode === "x=k" ? t2.infoX(k) : t2.infoY(k)}
        </p>
      </div>
    </div>
  );
}

/* ── Animasi 3 — Refleksi Bangun Datar (Segitiga) ── */
type Vec2 = [number, number];
// Segitiga siku-siku: sudut siku-siku di A(1,1), sehingga bayangan jelas berbalik arah
const TRI_BASE: Vec2[] = [[1, 1], [4, 1], [1, 3]];
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

  const { language } = useLanguage();
  const t3 = {
    title: { id: "🔺 Animasi 2 — Refleksi Bangun Datar", en: "🔺 Animation 2 — Reflection of a Shape", ja: "🔺 アニメーション2 — 図形の反射" }[language],
    intro: { id: "Arahkan segitiga △ABC, pilih cermin, lalu tampilkan bayangannya!", en: "Move triangle △ABC, choose a mirror, then reveal its image!", ja: "△ABCを動かし、鏡を選んで、像を表示しよう!" }[language],
    hide: { id: "↺ Sembunyikan", en: "↺ Hide", ja: "↺ 隠す" }[language],
    hideFull: { id: "↺ Sembunyikan Bayangan", en: "↺ Hide Image", ja: "↺ 像を隠す" }[language],
    showSmall: { id: "🪞 Tampilkan\nBayangan △A'B'C'", en: "🪞 Show\nImage △A'B'C'", ja: "🪞 像△A'B'C'を\n表示する" }[language],
    showFull: { id: "🪞 Tampilkan Bayangan △A'B'C'", en: "🪞 Show Image △A'B'C'", ja: "🪞 像△A'B'C'を表示する" }[language],
    hintIdle: { id: "Arahkan segitiga lalu tampilkan bayangannya!", en: "Move the triangle then show its image!", ja: "三角形を動かして像を表示しよう!" }[language],
    tip: {
      id: <>💡 Semua titik dicerminkan dengan aturan yang <strong>sama</strong>.
          Bentuk & ukuran segitiga <strong className="text-green-300">tetap</strong> — hanya posisi & orientasinya yang berubah!</>,
      en: <>💡 Every point is reflected with the <strong>same</strong> rule.
          The shape & size of the triangle stay <strong className="text-green-300">the same</strong> — only its position & orientation change!</>,
      ja: <>💡 すべての点は<strong>同じ</strong>規則で反射されます。
          三角形の形とサイズは<strong className="text-green-300">変わりません</strong> — 位置と向きだけが変わります!</>,
    }[language],
  };
  const reflected: Vec2[] = current.map(([x, y]) => reflectMath(x, y, mirror));
  const mc = getMirrors(language).find(m => m.id === mirror)!;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-pink-300 font-bold text-sm font-body">{t3.title}</p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">{t3.intro}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="sm:flex-1 min-w-0">
          <Grid accent="#f472b6">
            <MirrorLine mirror={mirror} />
            <Poly pts={current} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
            {current.map(([x, y], i) => {
              const { dx, dy, anchor } = vtxOffset(x, y, current);
              return (
                <text key={i}
                  x={px(x) + dx} y={py(y) + dy}
                  fill="#67e8f9" fontSize="8" fontWeight="bold"
                  textAnchor={anchor}
                >{TRI_LABELS[i]}({x},{y})</text>
              );
            })}
            {show && (
              <>
                {current.map(([x, y], i) => (
                  <DashLine key={i} x1={x} y1={y} x2={reflected[i][0]} y2={reflected[i][1]} color="rgba(255,255,255,0.2)" />
                ))}
                <Poly pts={reflected} color={mc.color} fill={`${mc.color}22`} label="△A'B'C'" />
                {reflected.map(([x, y], i) => {
                  const { dx, dy, anchor } = vtxOffset(x, y, reflected);
                  return (
                    <text key={i}
                      x={px(x) + dx} y={py(y) + dy}
                      fill={mc.color} fontSize="8" fontWeight="bold"
                      textAnchor={anchor}
                    >{TRI_LABELS[i]}'({x},{y})</text>
                  );
                })}
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
            {show ? t3.hide : t3.showSmall}
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
          <span className="text-white/30">{t3.hintIdle}</span>
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
          {show ? t3.hideFull : t3.showFull}
        </button>
      </div>

      {/* Mirror selector */}
      <MirrorSelector value={mirror} onChange={m => { setMirror(m); setShow(false); }} />

      <div className="bg-pink-950/40 border border-pink-500/20 rounded-lg px-4 py-2.5 text-center">
        <p className="text-pink-200 text-xs font-body">
          {t3.tip}
        </p>
      </div>
    </div>
  );
}

/* ── Animasi 4 — Refleksi Bangun Datar terhadap Garis x = k dan y = k ── */
function AnimasiRefleksiBangunGarisK() {
  const [mode, setMode] = useState<ModeK>("x=k");
  const [off, setOff]   = useState({ dx: 0, dy: 0 });
  const [k, setK]       = useState(1);
  const [show, setShow] = useState(false);

  const clamp5 = (v: number) => Math.max(-5, Math.min(5, v));
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

  const reset = () => { setOff({ dx: 0, dy: 0 }); setK(1); setShow(false); };

  const reflected: Vec2[] = current.map(([x, y]) =>
    mode === "x=k" ? [2 * k - x, y] : [x, 2 * k - y]
  );

  const accent = mode === "x=k" ? "#f97316" : "#a78bfa";

  const { language } = useLanguage();
  const t4 = {
    title: { id: "🔺 Animasi 4 — Refleksi Bangun Datar terhadap Garis x = k dan y = k", en: "🔺 Animation 4 — Reflection of a Shape over x = k and y = k", ja: "🔺 アニメーション4 — 直線x=kとy=kに関する図形の反射" }[language],
    intro: { id: "Arahkan segitiga △ABC, atur nilai k, lalu tampilkan bayangannya!", en: "Move triangle △ABC, set the value of k, then show its image!", ja: "△ABCを動かし、kの値を設定して、像を表示しよう!" }[language],
    line: { id: "Garis", en: "Line", ja: "直線" }[language],
    hide: { id: "↺ Sembunyikan", en: "↺ Hide", ja: "↺ 隠す" }[language],
    hideFull: { id: "↺ Sembunyikan Bayangan", en: "↺ Hide Image", ja: "↺ 像を隠す" }[language],
    showSmall: { id: "🪞 Tampilkan\nBayangan", en: "🪞 Show\nImage", ja: "🪞 像を\n表示する" }[language],
    showFull: { id: "🪞 Tampilkan Bayangan △A'B'C'", en: "🪞 Show Image △A'B'C'", ja: "🪞 像△A'B'C'を表示する" }[language],
    kValue: { id: "nilai k", en: "value of k", ja: "kの値" }[language],
    hintIdle: { id: "Arahkan segitiga dan atur k, lalu tampilkan bayangannya!", en: "Move the triangle and set k, then show its image!", ja: "三角形を動かしてkを設定し、像を表示しよう!" }[language],
    infoX: (kv: number) => ({
      id: <>💡 Rumus: <strong>A(x, y) → A'(2k−x, y)</strong> · semua titik dicerminkan terhadap garis vertikal x = {kv}</>,
      en: <>💡 Formula: <strong>A(x, y) → A'(2k−x, y)</strong> · every point is reflected over the vertical line x = {kv}</>,
      ja: <>💡 公式: <strong>A(x, y) → A'(2k−x, y)</strong> · すべての点は垂直線x = {kv} に関して反射されます</>,
    }[language]),
    infoY: (kv: number) => ({
      id: <>💡 Rumus: <strong>A(x, y) → A'(x, 2k−y)</strong> · semua titik dicerminkan terhadap garis horizontal y = {kv}</>,
      en: <>💡 Formula: <strong>A(x, y) → A'(x, 2k−y)</strong> · every point is reflected over the horizontal line y = {kv}</>,
      ja: <>💡 公式: <strong>A(x, y) → A'(x, 2k−y)</strong> · すべての点は水平線y = {kv} に関して反射されます</>,
    }[language]),
  };

  const ShowBtn = ({ small }: { small?: boolean }) => (
    <button
      onClick={() => { playPopSound(); setShow(v => !v); }}
      className={`rounded-xl font-bold font-body transition-all active:scale-95 border cursor-pointer text-center ${
        small ? "px-4 py-2 text-xs" : "px-5 py-2 text-sm"
      } ${show
        ? "bg-slate-700/60 border-slate-500/40 text-slate-300 hover:bg-slate-600/80"
        : "border"
      }`}
      style={!show ? { background: `${accent}33`, borderColor: `${accent}88`, color: accent } : {}}
    >
      {show
        ? (small ? t4.hide : t4.hideFull)
        : (small ? t4.showSmall : t4.showFull)}
    </button>
  );

  const KControl = () => (
    <EditableVal
      label={t4.kValue} value={k} min={-4} max={4} color={accent}
      onChange={v => { setK(clamp5(v)); setShow(false); }}
    />
  );

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="font-bold text-sm font-body" style={{ color: accent }}>
          {t4.title}
        </p>
        <p className="text-white/50 text-[11px] font-body mt-0.5">
          {t4.intro}
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
            {t4.line} {m}
          </button>
        ))}
      </div>

      {/* Grid + right column */}
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
            {/* Dashed connectors */}
            {show && current.map(([x, y], i) => (
              <DashLine key={i} x1={x} y1={y} x2={reflected[i][0]} y2={reflected[i][1]} color="rgba(255,255,255,0.2)" />
            ))}
            {/* Original triangle */}
            <Poly pts={current} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
            {current.map(([x, y], i) => {
              const { dx, dy, anchor } = vtxOffset(x, y, current);
              return (
                <text key={i} x={px(x) + dx} y={py(y) + dy}
                  fill="#67e8f9" fontSize="8" fontWeight="bold" textAnchor={anchor}
                >{TRI_LABELS[i]}({x},{y})</text>
              );
            })}
            {/* Reflected triangle */}
            {show && (
              <>
                <Poly pts={reflected} color={accent} fill={`${accent}22`} label="△A'B'C'" />
                {reflected.map(([x, y], i) => {
                  const { dx, dy, anchor } = vtxOffset(x, y, reflected);
                  return (
                    <text key={i} x={px(x) + dx} y={py(y) + dy}
                      fill={accent} fontSize="8" fontWeight="bold" textAnchor={anchor}
                    >{TRI_LABELS[i]}'({x},{y})</text>
                  );
                })}
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
      <div className="bg-slate-800/60 rounded-lg px-3 py-2 text-center font-body min-h-[32px] flex items-center justify-center gap-1.5 flex-wrap text-[11px] sm:text-xs">
        {show ? (
          <>
            {current.map(([x, y], i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-cyan-300 font-bold">{TRI_LABELS[i]}({x},{y})</span>
                <span className="text-white/40">→</span>
                <span className="font-bold" style={{ color: accent }}>{TRI_LABELS[i]}'({reflected[i][0]},{reflected[i][1]})</span>
                {i < 2 && <span className="text-white/20 mx-0.5">·</span>}
              </span>
            ))}
          </>
        ) : (
          <span className="text-white/30">{t4.hintIdle}</span>
        )}
      </div>

      {/* Portrait controls */}
      <div className="flex flex-col items-center gap-3 sm:hidden">
        <DirPad onMove={move} onReset={reset} />
        <KControl />
        <ShowBtn />
      </div>

      {/* Info box */}
      <div className="rounded-lg px-4 py-2.5 text-center border" style={{ background: `${accent}15`, borderColor: `${accent}40` }}>
        <p className="text-xs font-body" style={{ color: accent }}>
          {mode === "x=k" ? t4.infoX(k) : t4.infoY(k)}
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
/* ── Parse linear y=mx+c ── */
function parseLinearR(eq: string): { m: number; c: number } | null {
  const s = eq.replace(/\s/g, '').toLowerCase();
  if (!s.startsWith('y=')) return null;
  const rhs = s.slice(2);
  if (!rhs) return null;
  if (/^-?\d+\.?\d*$/.test(rhs)) return { m: 0, c: parseFloat(rhs) };
  const match = rhs.match(/^(-?\d*\.?\d*)x([+-]\d+\.?\d*)?$/);
  if (!match) return null;
  const coef = match[1];
  const m = coef === '' || coef === undefined ? 1 : coef === '-' ? -1 : parseFloat(coef);
  const c = match[2] ? parseFloat(match[2]) : 0;
  if (isNaN(m) || isNaN(c)) return null;
  return { m, c };
}

function fmtLineR(m: number, c: number): string {
  const fmt = (v: number) => {
    const r = Math.round(v * 1000) / 1000;
    return Math.abs(r - Math.round(r)) < 0.0001 ? `${Math.round(r)}` : `${r}`;
  };
  if (m === 0) return `y = ${fmt(c)}`;
  const ms = m === 1 ? '' : m === -1 ? '-' : `${fmt(m)}`;
  const cp = c === 0 ? '' : c > 0 ? ` + ${fmt(c)}` : ` - ${fmt(Math.abs(c))}`;
  return `y = ${ms}x${cp}`;
}

/* Parse ax + by = c → {m, c} in y=mx+c */
function parseStandardR(eq: string): { m: number; c: number } | null {
  const s = eq.replace(/\s/g, '').toLowerCase();
  const eqIdx = s.indexOf('=');
  if (eqIdx === -1) return null;
  const lhs = s.slice(0, eqIdx);
  const rhs = s.slice(eqIdx + 1);
  if (!lhs || !rhs) return null;
  const cVal = parseFloat(rhs);
  if (isNaN(cVal)) return null;
  let a = 0, b = 0;
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
    b = sign * (coef === '' ? 1 : parseFloat(coef));
    if (isNaN(b)) return null;
  }
  if (b === 0) return null;
  const m = -a / b;
  const c = cVal / b;
  if (!isFinite(m) || !isFinite(c)) return null;
  return { m, c };
}

/* Try y=mx+c first, then ax+by=c */
function parseEqR(eq: string): { m: number; c: number } | null {
  return parseLinearR(eq) ?? parseStandardR(eq);
}

function reflectLinearR(m: number, c: number, mirror: MirrorType): { m: number; c: number } | null {
  switch (mirror) {
    case "sumbu-x": return { m: -m, c: -c };
    case "sumbu-y": return { m: -m, c };
    case "titik-o": return { m, c: -c };
    case "y=x":  if (m === 0) return null; return { m: 1 / m, c: -c / m };
    case "y=-x": if (m === 0) return null; return { m: 1 / m, c: c / m };
  }
}

/* ── Animasi Refleksi Kurva Linear ── */
function AnimasiRefleksiKurva() {
  const { language } = useLanguage();
  const [input, setInput]   = useState('y=2x+3');
  const [mirror, setMirror] = useState<MirrorType>('sumbu-x');
  const [show, setShow]     = useState(false);

  const parsed    = parseEqR(input);
  const isValid   = parsed !== null;
  const reflected = isValid && parsed ? reflectLinearR(parsed.m, parsed.c, mirror) : null;
  const mc        = getMirrors(language).find(m => m.id === mirror)!;

  const tt = {
    title: { id: '🪞 Animasi Interaktif — Refleksi Kurva Linear', en: '🪞 Interactive Animation — Linear Curve Reflection', ja: '🪞 インタラクティブアニメーション — 直線の対称移動' }[language],
    eqLabel: { id: 'Persamaan Garis', en: 'Line Equation', ja: '直線の方程式' }[language],
    placeholder: { id: 'Contoh: y=2x+3 atau 2x-y=1', en: 'Example: y=2x+3 or 2x-y=1', ja: '例：y=2x+3 または 2x-y=1' }[language],
    formatHint: { id: '📋 Petunjuk Format', en: '📋 Format Hint', ja: '📋 入力形式のヒント' }[language],
    typeHint: { id: 'Ketik langsung · tanpa spasi · gunakan keyboard laptop/HP', en: 'Type directly · no spaces · use laptop/phone keyboard', ja: '直接入力・スペースなし・PC/スマホのキーボードを使用' }[language],
    errMsg: { id: '⚠ Format tidak dikenali. Coba: y=2x+3 atau 2x-y=1', en: '⚠ Format not recognized. Try: y=2x+3 or 2x-y=1', ja: '⚠ 形式が認識できません。y=2x+3 または 2x-y=1 を試してください' }[language],
    showBtn: { id: '🪞 Tampilkan Bayangan', en: '🪞 Show Image', ja: '🪞 像を表示' }[language],
    origLine: { id: 'Garis asli', en: 'Original line', ja: '元の直線' }[language],
    image: { id: 'Bayangan', en: 'Image', ja: '像' }[language],
    mirrorLbl: { id: 'Cermin', en: 'Mirror', ja: '鏡' }[language],
    resultLabel: { id: 'HASIL REFLEKSI:', en: 'REFLECTION RESULT:', ja: '対称移動の結果：' }[language],
    reflectedAgainst: { id: 'dicerminkan terhadap', en: 'reflected across', ja: 'を基準に対称移動すると' }[language],
    verticalWarn: { id: '⚠️ Hasil berupa garis vertikal (tidak dapat ditulis y=mx+c)', en: '⚠️ Result is a vertical line (cannot be written as y=mx+c)', ja: '⚠️ 結果は垂直線です（y=mx+c の形では表せません）' }[language],
    verticalTag: { id: 'garis vertikal', en: 'vertical line', ja: '垂直線' }[language],
  };

  return (
    <div className="space-y-4 pt-2">
      <p className="font-bold text-sm font-body" style={{ color: mc.color }}>{tt.title}</p>

      {/* Input */}
      <div className="space-y-2">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">{tt.eqLabel}</p>
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value.replace(/\s/g, '')); setShow(false); }}
          placeholder={tt.placeholder}
          className="w-full bg-slate-800 border border-slate-500 focus:border-violet-400 focus:outline-none rounded-lg px-4 py-2.5 font-mono text-white text-sm transition-colors"
        />
        <div className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 space-y-1">
          <p className="text-[10px] text-white/40 font-body uppercase tracking-wider">{tt.formatHint}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-mono">
            <span className="text-cyan-300">y=2x+3</span>
            <span className="text-white/30">·</span>
            <span className="text-cyan-300">y=-x+1</span>
            <span className="text-white/30">·</span>
            <span className="text-cyan-300">y=3x</span>
            <span className="text-white/30">·</span>
            <span className="text-violet-300">2x+3y=6</span>
            <span className="text-white/30">·</span>
            <span className="text-violet-300">x-y=4</span>
          </div>
          <p className="text-[10px] text-white/30 font-body">{tt.typeHint}</p>
        </div>
        {!isValid && input.length > 0 && (
          <p className="text-[11px] text-red-400 font-body">{tt.errMsg}</p>
        )}
      </div>

      {/* Mirror selector */}
      <MirrorSelector value={mirror} onChange={m => { setMirror(m); setShow(false); }} />

      {/* Action */}
      <div className="flex gap-2">
        <button onClick={() => { playPopSound(); setShow(true); }} disabled={!isValid}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: isValid ? mc.color : '#475569' }}>
          {tt.showBtn}
        </button>
        <button onClick={() => { playPopSound(); setInput('y=2x+3'); setShow(false); }}
          className="px-4 py-2.5 rounded-xl font-bold text-sm font-body transition-all bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600 cursor-pointer">
          ↺
        </button>
      </div>

      {/* Grid */}
      <div className="w-full max-w-[360px] mx-auto">
        <Grid accent="#a78bfa">
          <MirrorLine mirror={mirror} />
          {isValid && parsed && (
            <line x1={px(-5)} y1={py(parsed.m * -5 + parsed.c)} x2={px(5)} y2={py(parsed.m * 5 + parsed.c)}
              stroke="#22d3ee" strokeWidth="2.5" />
          )}
          {show && reflected && (
            <line x1={px(-5)} y1={py(reflected.m * -5 + reflected.c)} x2={px(5)} y2={py(reflected.m * 5 + reflected.c)}
              stroke={mc.color} strokeWidth="2.5" strokeDasharray="6,3" />
          )}
          {isValid && parsed && (
            <text x={px(2)} y={py(parsed.m * 2 + parsed.c) - 7} fill="#22d3ee" fontSize="9" fontWeight="bold">{input}</text>
          )}
          {show && reflected && (
            <text x={px(-2.5)} y={py(reflected.m * -2.5 + reflected.c) - 7} fontSize="9" fontWeight="bold" fill={mc.color}>
              {fmtLineR(reflected.m, reflected.c)}
            </text>
          )}
          {show && isValid && parsed && !reflected && (
            <text x={ox} y={16} fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">{tt.verticalTag}</text>
          )}
        </Grid>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center text-xs font-body">
          <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-cyan-400 inline-block rounded" /><span className="text-cyan-300">{tt.origLine}</span></div>
          {show && reflected && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 inline-block rounded" style={{ background: mc.color }} />
              <span style={{ color: mc.color }}>{tt.image}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 inline-block rounded border-t-2 border-dashed" style={{ borderColor: mc.color }} />
            <span className="text-white/50">{tt.mirrorLbl} ({mc.label})</span>
          </div>
        </div>
      </div>

      {/* Result */}
      {show && isValid && parsed && (
        <div className="rounded-xl p-4 space-y-1.5 border" style={{ background: `${mc.color}18`, borderColor: `${mc.color}44` }}>
          <p className="text-xs font-semibold font-body uppercase tracking-wide" style={{ color: mc.color }}>{tt.resultLabel}</p>
          <p className="text-sm font-body text-white/80">
            <span className="text-cyan-300 font-bold">{input}</span> {tt.reflectedAgainst}{' '}
            <span className="font-bold" style={{ color: mc.color }}>{mc.label}</span>:
          </p>
          {reflected ? (
            <p className="font-body font-bold text-base" style={{ color: mc.color }}>{fmtLineR(reflected.m, reflected.c)}</p>
          ) : (
            <p className="text-yellow-300 text-sm font-body">{tt.verticalWarn}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Animasi Refleksi Kurva pada x=k dan y=k ── */
type ModeK2 = 'x=k' | 'y=k';

function AnimasiRefleksiKurvaK() {
  const { language } = useLanguage();
  const [mode, setMode]   = useState<ModeK2>('x=k');
  const [k, setK]         = useState(2);
  const [input, setInput] = useState('y=2x+1');
  const [show, setShow]   = useState(false);

  const parsed  = parseEqR(input);
  const isValid = parsed !== null;
  const color   = mode === 'x=k' ? '#f97316' : '#ec4899';

  const computeReflected = (): { m: number; c: number } | null => {
    if (!parsed) return null;
    if (mode === 'x=k') return { m: -parsed.m, c: 2 * parsed.m * k + parsed.c };
    return { m: -parsed.m, c: 2 * k - parsed.c };
  };
  const reflected = isValid ? computeReflected() : null;
  const clampK = (v: number) => Math.max(-5, Math.min(5, v));

  const tt = {
    titlePrefix: { id: '📏 Animasi Interaktif — Refleksi terhadap', en: '📏 Interactive Animation — Reflection across', ja: '📏 インタラクティブアニメーション — 対称移動の基準：' }[language],
    mirrorXK: { id: 'Cermin x = k', en: 'Mirror x = k', ja: '鏡 x = k' }[language],
    mirrorYK: { id: 'Cermin y = k', en: 'Mirror y = k', ja: '鏡 y = k' }[language],
    eqLabel: { id: 'Persamaan Garis', en: 'Line Equation', ja: '直線の方程式' }[language],
    placeholder: { id: 'Contoh: y=2x+1 atau 2x-y=4', en: 'Example: y=2x+1 or 2x-y=4', ja: '例：y=2x+1 または 2x-y=4' }[language],
    formatHint: { id: '📋 Petunjuk Format', en: '📋 Format Hint', ja: '📋 入力形式のヒント' }[language],
    typeHint: { id: 'Ketik langsung · tanpa spasi · gunakan keyboard laptop/HP', en: 'Type directly · no spaces · use laptop/phone keyboard', ja: '直接入力・スペースなし・PC/スマホのキーボードを使用' }[language],
    errMsg: { id: '⚠ Format tidak dikenali. Coba: y=2x+1 atau 2x-y=4', en: '⚠ Format not recognized. Try: y=2x+1 or 2x-y=4', ja: '⚠ 形式が認識できません。y=2x+1 または 2x-y=4 を試してください' }[language],
    nilaiK: { id: 'Nilai', en: 'Value of', ja: 'の値' }[language],
    showBtn: { id: '🪞 Tampilkan Bayangan', en: '🪞 Show Image', ja: '🪞 像を表示' }[language],
    origLine: { id: 'Garis asli', en: 'Original line', ja: '元の直線' }[language],
    image: { id: 'Bayangan', en: 'Image', ja: '像' }[language],
    mirrorLbl: { id: 'Cermin', en: 'Mirror', ja: '鏡' }[language],
    resultLabel: { id: 'HASIL REFLEKSI:', en: 'REFLECTION RESULT:', ja: '対称移動の結果：' }[language],
    reflectedAgainst: { id: 'dicerminkan terhadap', en: 'reflected across', ja: 'を基準に対称移動すると' }[language],
  };

  return (
    <div className="space-y-4 pt-2">
      <p className="font-bold text-sm font-body" style={{ color }}>
        {tt.titlePrefix} {mode === 'x=k' ? 'x = k' : 'y = k'}
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['x=k', 'y=k'] as ModeK2[]).map(m => (
          <button key={m} onClick={() => { playPopSound(); setMode(m); setShow(false); }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold font-body border transition-all cursor-pointer
              ${mode === m ? 'text-black' : 'bg-slate-800/60 border-white/10 text-white/50 hover:text-white/80'}`}
            style={mode === m ? { background: color, borderColor: color } : {}}>
            {m === 'x=k' ? tt.mirrorXK : tt.mirrorYK}
          </button>
        ))}
      </div>

      {/* Input garis */}
      <div className="space-y-2">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">{tt.eqLabel}</p>
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value.replace(/\s/g, '')); setShow(false); }}
          placeholder={tt.placeholder}
          className="w-full bg-slate-800 border border-slate-500 focus:border-orange-400 focus:outline-none rounded-lg px-4 py-2.5 font-mono text-white text-sm transition-colors"
        />
        <div className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 space-y-1">
          <p className="text-[10px] text-white/40 font-body uppercase tracking-wider">{tt.formatHint}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-mono">
            <span className="text-cyan-300">y=2x+1</span>
            <span className="text-white/30">·</span>
            <span className="text-cyan-300">y=-3x+5</span>
            <span className="text-white/30">·</span>
            <span className="text-cyan-300">y=x</span>
            <span className="text-white/30">·</span>
            <span className="text-orange-300">2x+3y=6</span>
            <span className="text-white/30">·</span>
            <span className="text-orange-300">x-y=4</span>
          </div>
          <p className="text-[10px] text-white/30 font-body">{tt.typeHint}</p>
        </div>
        {!isValid && input.length > 0 && (
          <p className="text-[11px] text-red-400 font-body">{tt.errMsg}</p>
        )}
      </div>

      {/* Nilai k */}
      <div className="flex items-center justify-center gap-4 bg-slate-800/60 border border-slate-600/40 rounded-xl p-3">
        <p className="text-sm font-body text-white/60">{tt.nilaiK} <InlineMath math="k" /> :</p>
        <div className="flex items-center gap-2">
          <button onClick={() => { playPopSound(); setK(p => clampK(p - 1)); setShow(false); }}
            className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-500 text-white font-bold hover:bg-slate-600 active:scale-90 transition-all cursor-pointer">−</button>
          <span className="w-10 text-center font-mono font-bold text-lg" style={{ color }}>{k}</span>
          <button onClick={() => { playPopSound(); setK(p => clampK(p + 1)); setShow(false); }}
            className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-500 text-white font-bold hover:bg-slate-600 active:scale-90 transition-all cursor-pointer">+</button>
        </div>
        <p className="text-sm font-mono text-white/50">{mode === 'x=k' ? `x = ${k}` : `y = ${k}`}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={() => { playPopSound(); setShow(true); }} disabled={!isValid}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm font-body transition-all text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: isValid ? color : '#475569' }}>
          {tt.showBtn}
        </button>
        <button onClick={() => { playPopSound(); setInput('y=2x+1'); setK(2); setShow(false); }}
          className="px-4 py-2.5 rounded-xl font-bold text-sm font-body transition-all bg-slate-700/60 border border-slate-500/40 text-slate-300 hover:bg-slate-600 cursor-pointer">↺</button>
      </div>

      {/* Grid */}
      <div className="w-full max-w-[360px] mx-auto">
        <Grid accent={color}>
          {mode === 'x=k' ? (
            <>
              <line x1={px(k)} y1={4} x2={px(k)} y2={S - 4} stroke={color} strokeWidth="2" strokeDasharray="5,3" />
              <text x={px(k) + 4} y={14} fontSize="8" fill={color} fontWeight="bold">x={k}</text>
            </>
          ) : (
            <>
              <line x1={4} y1={py(k)} x2={S - 4} y2={py(k)} stroke={color} strokeWidth="2" strokeDasharray="5,3" />
              <text x={S - 8} y={py(k) - 4} fontSize="8" fill={color} fontWeight="bold" textAnchor="end">y={k}</text>
            </>
          )}
          {isValid && parsed && (
            <line x1={px(-5)} y1={py(parsed.m * -5 + parsed.c)} x2={px(5)} y2={py(parsed.m * 5 + parsed.c)}
              stroke="#22d3ee" strokeWidth="2.5" />
          )}
          {show && reflected && (
            <line x1={px(-5)} y1={py(reflected.m * -5 + reflected.c)} x2={px(5)} y2={py(reflected.m * 5 + reflected.c)}
              stroke={color} strokeWidth="2.5" strokeDasharray="6,3" />
          )}
          {isValid && parsed && (
            <text x={px(2)} y={py(parsed.m * 2 + parsed.c) - 7} fill="#22d3ee" fontSize="9" fontWeight="bold">{input}</text>
          )}
          {show && reflected && (
            <text x={px(-2)} y={py(reflected.m * -2 + reflected.c) - 7} fontSize="9" fontWeight="bold" fill={color}>
              {fmtLineR(reflected.m, reflected.c)}
            </text>
          )}
        </Grid>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center text-xs font-body">
          <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-cyan-400 inline-block rounded" /><span className="text-cyan-300">{tt.origLine}</span></div>
          {show && reflected && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 inline-block rounded" style={{ background: color }} />
              <span style={{ color }}>{tt.image}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 inline-block rounded border-t-2 border-dashed" style={{ borderColor: color }} />
            <span className="text-white/50">{tt.mirrorLbl} ({mode === 'x=k' ? `x=${k}` : `y=${k}`})</span>
          </div>
        </div>
      </div>

      {/* Result */}
      {show && isValid && reflected && (
        <div className="rounded-xl p-4 space-y-1.5 border" style={{ background: `${color}18`, borderColor: `${color}44` }}>
          <p className="text-xs font-semibold font-body uppercase tracking-wide" style={{ color }}>{tt.resultLabel}</p>
          <p className="text-sm font-body text-white/80">
            <span className="text-cyan-300 font-bold">{input}</span> {tt.reflectedAgainst}{' '}
            <span className="font-bold" style={{ color }}>{mode === 'x=k' ? `x = ${k}` : `y = ${k}`}</span>:
          </p>
          <p className="font-body font-bold text-base" style={{ color }}>{fmtLineR(reflected.m, reflected.c)}</p>
        </div>
      )}
    </div>
  );
}

const RefleksiPage = () => {
  const { language } = useLanguage();

  const translations = {
    id: {
      pageTitle: "REFLEKSI (PENCERMINAN)",
      pageSubtitle: "Bayangan di Cermin Matematika!",
      pageMeta: "Kelas 9 · Transformasi Geometri · Materi Matematika",
      secA: "A. 🌟 Apa Itu Refleksi?",
      introText: <>
        <strong className="text-emerald-300">Refleksi</strong> adalah transformasi yang mencerminkan setiap titik terhadap suatu garis yang disebut <strong className="text-yellow-300">sumbu pencerminan</strong> (garis cermin). Jarak titik dari garis cermin <strong className="text-white">tetap sama</strong>, hanya posisinya yang bercermin.
      </>,
    },
    en: {
      pageTitle: "REFLECTION",
      pageSubtitle: "Mirror Images in Math!",
      pageMeta: "Grade 9 · Geometric Transformation · Math Material",
      secA: "A. 🌟 What Is Reflection?",
      introText: <>
        <strong className="text-emerald-300">Reflection</strong> is a transformation that mirrors every point across a line called the <strong className="text-yellow-300">axis of reflection</strong> (mirror line). The distance from the point to the mirror line <strong className="text-white">stays the same</strong>, only its position is mirrored.
      </>,
    },
    ja: {
      pageTitle: "対称移動（鏡映）",
      pageSubtitle: "数学の鏡に映る像！",
      pageMeta: "中学3年 · 図形の変換 · 数学教材",
      secA: "A. 🌟 対称移動とは？",
      introText: <>
        <strong className="text-emerald-300">対称移動</strong>とは、<strong className="text-yellow-300">対称の軸</strong>（鏡の線）と呼ばれる直線を基準に、すべての点を鏡映させる変換です。点から鏡の線までの距離は<strong className="text-white">変わらず</strong>、位置だけが鏡映されます。
      </>,
    },
  }[language];

  const t = translations;

  const g = {
    soalLabel: { id: "Soal:", en: "Question:", ja: "問題：" }[language],
    pembahasanLabel: { id: "Pembahasan:", en: "Solution:", ja: "解説：" }[language],
    pembahasanCaps: { id: "PEMBAHASAN:", en: "SOLUTION:", ja: "解説：" }[language],
    jawabanLabel: { id: "Jawaban:", en: "Answer:", ja: "答え：" }[language],
    bayanganLabel: { id: "Bayangan:", en: "Image:", ja: "像：" }[language],
    contohSoalLabel: { id: "Contoh Soal", en: "Example Problems", ja: "例題" }[language],
    verifikasiLabel: { id: "Verifikasi dengan rumus", en: "Verification using the formula", ja: "公式による検証" }[language],
    altAmbulance: { id: "Tulisan AMBULANCE terbalik di kaca spion", en: "The word AMBULANCE written backward, seen normally in a rear-view mirror", ja: "バックミラーに映ると正しく読める、左右反転した「AMBULANCE」の文字" }[language],
    altCermin: { id: "Seseorang berdiri di depan cermin — jarak ke cermin sama dengan jarak bayangan", en: "A person standing in front of a mirror — the distance to the mirror equals the distance of the reflection", ja: "鏡の前に立つ人 — 鏡までの距離と鏡像までの距離は等しい" }[language],

    // D
    secDTitle: { id: "D. 📌 Contoh 1: Pencerminan terhadap Sumbu Y", en: "D. 📌 Example 1: Reflection across the Y-axis", ja: "D. 📌 例1：y軸に関する対称移動" }[language],
    secDQuestion: { id: "Contoh pencerminan terhadap sumbu Y yang benar adalah . . . .", en: "The correct example of reflection across the Y-axis is . . . .", ja: "y軸に関する対称移動の正しい例は . . . ." }[language],
    rumusY: { id: "Rumus refleksi terhadap sumbu Y", en: "Reflection formula across the Y-axis", ja: "y軸に関する対称移動の公式" }[language],
    rumusYNote: { id: "x dinegasikan, y tetap", en: "x is negated, y stays the same", ja: "xの符号を反転し、yはそのまま" }[language],
    dArrow: { id: "→ seharusnya", en: "→ should be", ja: "→ 本来は" }[language],
    dGiven: { id: "| diberikan:", en: "| given:", ja: "｜与えられた値：" }[language],
    dReasons: [
      { id: "y berubah, bukan refleksi sumbu Y", en: "y changes, not a Y-axis reflection", ja: "yが変化しており、y軸に関する対称移動ではない" }[language],
      { id: "x tidak berubah, y berubah → refleksi sumbu X", en: "x unchanged, y changes → X-axis reflection", ja: "xは変化せずyが変化 → x軸に関する対称移動" }[language],
      { id: "y ikut berubah → bukan refleksi sumbu Y", en: "y also changes → not a Y-axis reflection", ja: "yも変化している → y軸に関する対称移動ではない" }[language],
      { id: "−(−3) = 3, y tetap −1 ✓", en: "−(−3) = 3, y stays −1 ✓", ja: "−(−3) = 3、yは−1のまま ✓" }[language],
    ],
    dJawabanNote: { id: "D(−3, −1) → D′(3, −1) mengikuti aturan (x, y) → (−x, y) dengan benar", en: "D(−3, −1) → D′(3, −1) correctly follows the rule (x, y) → (−x, y)", ja: "D(−3, −1) → D′(3, −1) は規則 (x, y) → (−x, y) に正しく従っている" }[language],

    // E
    secETitle: { id: "E. 📌 Contoh 2: Pencerminan terhadap Garis x = 3", en: "E. 📌 Example 2: Reflection across the Line x = 3", ja: "E. 📌 例2：直線x = 3に関する対称移動" }[language],
    secEQuestion: { id: "Hasil pencerminan titik (8, 4) terhadap garis x = 3 adalah . . . .", en: "The result of reflecting point (8, 4) across the line x = 3 is . . . .", ja: "点(8, 4)を直線x = 3に関して対称移動した結果は . . . ." }[language],
    rumusXK: { id: "Rumus refleksi terhadap garis x = k", en: "Reflection formula across the line x = k", ja: "直線x = kに関する対称移動の公式" }[language],
    rumusXKNote: { id: "y tetap, x dicerminkan terhadap garis vertikal x = k", en: "y stays the same, x is reflected across the vertical line x = k", ja: "yはそのまま、xは垂直線x = kに関して対称移動する" }[language],
    eGiven: { id: "Diketahui: titik (8, 4), garis cermin x = 3 sehingga k = 3", en: "Given: point (8, 4), mirror line x = 3, so k = 3", ja: "与えられた条件：点(8, 4)、鏡の直線x = 3、よってk = 3" }[language],
    yTetapNote: { id: "(y tetap)", en: "(y stays the same)", ja: "（yはそのまま）" }[language],
    eConclusion: { id: "Jadi bayangan titik (8, 4) adalah", en: "So the image of point (8, 4) is", ja: "よって点(8, 4)の像は" }[language],

    // F
    secFTitle: { id: "F. 📌 Contoh 3: Refleksi Berantai (Sumbu Y lalu y = 5)", en: "F. 📌 Example 3: Chained Reflection (Y-axis then y = 5)", ja: "F. 📌 例3：連続対称移動（y軸の後にy = 5）" }[language],
    secFQuestion: { id: "Titik B(6, 3) mula-mula dicerminkan terhadap sumbu Y, selanjutnya dicerminkan terhadap garis y = 5. Bayangan terakhir titik B adalah . . . .", en: "Point B(6, 3) is first reflected across the Y-axis, then reflected across the line y = 5. The final image of point B is . . . .", ja: "点B(6, 3)をまずy軸に関して対称移動し、次に直線y = 5に関して対称移動する。点Bの最終的な像は . . . ." }[language],
    fLangkah1: { id: "Langkah 1 — Cerminkan terhadap Sumbu Y", en: "Step 1 — Reflect across the Y-axis", ja: "ステップ1 — y軸に関して対称移動する" }[language],
    fRumus1: { id: "Rumus: (x, y) → (−x, y) · x dinegasikan, y tetap", en: "Formula: (x, y) → (−x, y) · x is negated, y stays the same", ja: "公式：(x, y) → (−x, y)・xの符号を反転し、yはそのまま" }[language],
    fLangkah2: { id: "Langkah 2 — Cerminkan B′(−6, 3) terhadap Garis y = 5", en: "Step 2 — Reflect B′(−6, 3) across the Line y = 5", ja: "ステップ2 — B′(−6, 3)を直線y = 5に関して対称移動する" }[language],
    fRumus2: { id: "Rumus: (x, y) → (x, 2k − y) · k = 5, x tetap", en: "Formula: (x, y) → (x, 2k − y) · k = 5, x stays the same", ja: "公式：(x, y) → (x, 2k − y)・k = 5、xはそのまま" }[language],
    xTetapNote: { id: "(x tetap)", en: "(x stays the same)", ja: "（xはそのまま）" }[language],
    fFinalImage: { id: "Bayangan terakhir:", en: "Final image:", ja: "最終的な像：" }[language],

    // G intro
    secGTitle: { id: "G. 📈 [Tambahan] Refleksi pada Kurva Linear", en: "G. 📈 [Additional] Reflection of Linear Curves", ja: "G. 📈 【補足】直線（一次関数）の対称移動" }[language],
    gIntro: { id: <>Seperti pada titik dan bangun datar, refleksi juga dapat diterapkan pada <strong className="text-violet-300">persamaan garis (kurva linear)</strong>. Jika garis <InlineMath math="y = mx + c" /> dicerminkan, maka setiap titik <InlineMath math="(x, y)" /> pada garis tersebut berpindah ke bayangan <InlineMath math="(x', y')" /> sesuai aturan cermin yang dipilih. Kita substitusikan hubungan tersebut ke persamaan asli untuk menemukan persamaan bayangan.</>,
      en: <>Just like points and shapes, reflection can also be applied to a <strong className="text-violet-300">line equation (linear curve)</strong>. If the line <InlineMath math="y = mx + c" /> is reflected, then every point <InlineMath math="(x, y)" /> on that line moves to an image <InlineMath math="(x', y')" /> according to the chosen mirror rule. We substitute that relationship into the original equation to find the image equation.</>,
      ja: <>点や図形と同様に、対称移動は<strong className="text-violet-300">直線の方程式（一次関数）</strong>にも適用できます。直線<InlineMath math="y = mx + c" />を対称移動すると、その直線上のすべての点<InlineMath math="(x, y)" />は選んだ鏡の規則に従って像<InlineMath math="(x', y')" />へ移動します。この関係を元の方程式に代入して、像の方程式を求めます。</> }[language],
    penurunanX: { id: "Penurunan Rumus — Contoh: Refleksi terhadap Sumbu X", en: "Formula Derivation — Example: Reflection across the X-axis", ja: "公式の導出 — 例：x軸に関する対称移動" }[language],
    gTextX1: { id: <>Refleksi sumbu X memetakan <InlineMath math="(x, y) \to (x, -y)" />, sehingga:</>, en: <>Reflection across the X-axis maps <InlineMath math="(x, y) \to (x, -y)" />, so:</>, ja: <>x軸に関する対称移動は<InlineMath math="(x, y) \to (x, -y)" />へ写像するので：</> }[language],
    gSubOrig: { id: <>Substitusikan ke persamaan garis asli <InlineMath math="y = mx + c" />:</>, en: <>Substitute into the original line equation <InlineMath math="y = mx + c" />:</>, ja: <>元の直線の方程式<InlineMath math="y = mx + c" />に代入すると：</> }[language],
    gOrNote: { id: "atau (aksen diabaikan):", en: "or (dropping the prime marks):", ja: "または（プライム記号を省略すると）：" }[language],
    penurunanXKYK: { id: "Penurunan Rumus — Refleksi terhadap x = k dan y = k", en: "Formula Derivation — Reflection across x = k and y = k", ja: "公式の導出 — x = k および y = k に関する対称移動" }[language],
    cerminXK: { id: "① Cermin x = k", en: "① Mirror x = k", ja: "① 鏡 x = k" }[language],
    gTextXK1: { id: <>Refleksi terhadap <InlineMath math="x = k" /> memetakan <InlineMath math="(x, y) \to (2k-x,\; y)" />, sehingga:</>, en: <>Reflection across <InlineMath math="x = k" /> maps <InlineMath math="(x, y) \to (2k-x,\; y)" />, so:</>, ja: <><InlineMath math="x = k" />に関する対称移動は<InlineMath math="(x, y) \to (2k-x,\; y)" />へ写像するので：</> }[language],
    gSubInto: { id: <>Substitusikan ke <InlineMath math="y = mx + c" />:</>, en: <>Substitute into <InlineMath math="y = mx + c" />:</>, ja: <><InlineMath math="y = mx + c" />に代入すると：</> }[language],
    cerminYK: { id: "② Cermin y = k", en: "② Mirror y = k", ja: "② 鏡 y = k" }[language],
    gTextYK1: { id: <>Refleksi terhadap <InlineMath math="y = k" /> memetakan <InlineMath math="(x, y) \to (x,\; 2k-y)" />, sehingga:</>, en: <>Reflection across <InlineMath math="y = k" /> maps <InlineMath math="(x, y) \to (x,\; 2k-y)" />, so:</>, ja: <><InlineMath math="y = k" />に関する対称移動は<InlineMath math="(x, y) \to (x,\; 2k-y)" />へ写像するので：</> }[language],
    perhatikan: { id: "Perhatikan:", en: "Note:", ja: "注意：" }[language],
    perhatikanBody: { id: <>Baik refleksi x=k maupun y=k menghasilkan gradien <InlineMath math="-m" /> (tanda berubah). Yang berbeda hanya nilai intersep-y-nya.</>, en: <>Both x=k and y=k reflections produce a gradient of <InlineMath math="-m" /> (sign flips). Only the y-intercept value differs.</>, ja: <>x=kとy=kのどちらの対称移動でも傾きは<InlineMath math="-m" />になります（符号が反転）。異なるのはy切片の値だけです。</> }[language],
    catatan: { id: "Catatan:", en: "Note:", ja: "注：" }[language],
    catatanBody: { id: <>Gradien <InlineMath math="m" /> <em>berubah tanda</em> setelah refleksi terhadap sumbu X. Intersep-y juga berubah tanda. Untuk cermin lain, lihat tabel di bawah.</>, en: <>The gradient <InlineMath math="m" /> <em>flips sign</em> after reflection across the X-axis. The y-intercept also flips sign. For other mirrors, see the table below.</>, ja: <>x軸に関する対称移動後、傾き<InlineMath math="m" />の<em>符号が反転</em>します。y切片も符号が反転します。他の鏡については下の表を参照してください。</> }[language],
    tableTitle: { id: <>Tabel Refleksi Kurva Linear <InlineMath math="y = mx + c" /></>, en: <>Table of Linear Curve Reflections <InlineMath math="y = mx + c" /></>, ja: <>直線<InlineMath math="y = mx + c" />の対称移動一覧表</> }[language],
    thCermin: { id: "Cermin", en: "Mirror", ja: "鏡" }[language],
    thSubstitusi: { id: "Substitusi", en: "Substitution", ja: "代入" }[language],
    thBayangan: { id: "Bayangan", en: "Image", ja: "像" }[language],
    tableFootnote: { id: "*) y=x dan y=−x: berlaku jika m ≠ 0 (jika m=0, hasilnya garis vertikal)", en: "*) y=x and y=−x: valid if m ≠ 0 (if m=0, the result is a vertical line)", ja: "*) y=xおよびy=−x：m ≠ 0のとき成立（m=0のときは結果が垂直線になる）" }[language],
    cerminSumbuX: { id: "Sumbu X", en: "X-axis", ja: "x軸" }[language],
    cerminSumbuY: { id: "Sumbu Y", en: "Y-axis", ja: "y軸" }[language],
    cerminTitikO: { id: "Titik O(0,0)", en: "Point O(0,0)", ja: "原点O(0,0)" }[language],

    // Contoh 1 (Mudah)
    badgeMudah: { id: "MUDAH", en: "Easy", ja: "基本" }[language],
    contoh1: { id: "Contoh 1", en: "Example 1", ja: "例1" }[language],
    contoh1Soal: { id: <>Garis <InlineMath math="y = 2x + 3" /> dicerminkan terhadap <strong className="text-green-300">sumbu X</strong>. Tentukan persamaan bayangan garis tersebut!</>, en: <>The line <InlineMath math="y = 2x + 3" /> is reflected across the <strong className="text-green-300">X-axis</strong>. Determine the equation of the image line!</>, ja: <>直線<InlineMath math="y = 2x + 3" />を<strong className="text-green-300">x軸</strong>に関して対称移動する。像となる直線の方程式を求めよ！</> }[language],
    contoh1Text1: { id: <>Refleksi sumbu X memetakan <InlineMath math="(x, y) \to (x', y')" /> dengan:</>, en: <>Reflection across the X-axis maps <InlineMath math="(x, y) \to (x', y')" /> with:</>, ja: <>x軸に関する対称移動は<InlineMath math="(x, y) \to (x', y')" />へ写像し：</> }[language],
    contoh1Text2: { id: <>Substitusikan ke persamaan garis asli <InlineMath math="y = 2x + 3" />:</>, en: <>Substitute into the original line equation <InlineMath math="y = 2x + 3" />:</>, ja: <>元の直線の方程式<InlineMath math="y = 2x + 3" />に代入すると：</> }[language],

    // Contoh 4 (x=k)
    badgeXK: { id: "CERMIN x=k", en: "MIRROR x=k", ja: "鏡 x=k" }[language],
    contoh4: { id: "Contoh 4", en: "Example 4", ja: "例4" }[language],
    contoh4Soal: { id: <>Garis <InlineMath math="y = 2x + 1" /> dicerminkan terhadap garis <strong className="text-orange-300">x = 3</strong>. Tentukan persamaan bayangan garis tersebut!</>, en: <>The line <InlineMath math="y = 2x + 1" /> is reflected across the line <strong className="text-orange-300">x = 3</strong>. Determine the equation of the image line!</>, ja: <>直線<InlineMath math="y = 2x + 1" />を直線<strong className="text-orange-300">x = 3</strong>に関して対称移動する。像となる直線の方程式を求めよ！</> }[language],
    contoh4Text1: { id: <>Refleksi terhadap <InlineMath math="x = 3" /> memetakan <InlineMath math="(x, y) \to (6-x,\; y)" />, sehingga:</>, en: <>Reflection across <InlineMath math="x = 3" /> maps <InlineMath math="(x, y) \to (6-x,\; y)" />, so:</>, ja: <><InlineMath math="x = 3" />に関する対称移動は<InlineMath math="(x, y) \to (6-x,\; y)" />へ写像するので：</> }[language],
    contoh4Text2: { id: <>Substitusikan ke persamaan garis asli <InlineMath math="y = 2x + 1" />:</>, en: <>Substitute into the original line equation <InlineMath math="y = 2x + 1" />:</>, ja: <>元の直線の方程式<InlineMath math="y = 2x + 1" />に代入すると：</> }[language],

    // Contoh 5 (Translasi + y=k)
    badgeTransYK: { id: "TRANSLASI + CERMIN y=k", en: "TRANSLATION + MIRROR y=k", ja: "平行移動＋鏡 y=k" }[language],
    contoh5: { id: "Contoh 5", en: "Example 5", ja: "例5" }[language],
    contoh5Soal: { id: <>Garis <InlineMath math="y = 2x + 1" /> ditranslasikan oleh <strong className="text-pink-300"><InlineMath math="T\binom{3}{-2}" /></strong>, kemudian bayangannya dicerminkan terhadap garis <strong className="text-pink-300"><InlineMath math="y = 3" /></strong>. Tentukan persamaan bayangan akhir!</>, en: <>The line <InlineMath math="y = 2x + 1" /> is translated by <strong className="text-pink-300"><InlineMath math="T\binom{3}{-2}" /></strong>, then its image is reflected across the line <strong className="text-pink-300"><InlineMath math="y = 3" /></strong>. Determine the final image equation!</>, ja: <>直線<InlineMath math="y = 2x + 1" />を<strong className="text-pink-300"><InlineMath math="T\binom{3}{-2}" /></strong>で平行移動し、その像を直線<strong className="text-pink-300"><InlineMath math="y = 3" /></strong>に関して対称移動する。最終的な像の方程式を求めよ！</> }[language],
    c5Langkah1: { id: <>Langkah 1 — Translasi <InlineMath math="T\binom{3}{-2}" /></>, en: <>Step 1 — Translation <InlineMath math="T\binom{3}{-2}" /></>, ja: <>ステップ1 — 平行移動<InlineMath math="T\binom{3}{-2}" /></> }[language],
    c5Text1: { id: <>Translasi memetakan <InlineMath math="(x, y) \to (x+3,\; y-2)" />, sehingga:</>, en: <>The translation maps <InlineMath math="(x, y) \to (x+3,\; y-2)" />, so:</>, ja: <>平行移動は<InlineMath math="(x, y) \to (x+3,\; y-2)" />へ写像するので：</> }[language],
    c5Text2: { id: <>Substitusikan ke persamaan garis asli <InlineMath math="y = 2x + 1" />:</>, en: <>Substitute into the original line equation <InlineMath math="y = 2x + 1" />:</>, ja: <>元の直線の方程式<InlineMath math="y = 2x + 1" />に代入すると：</> }[language],
    c5GarisSetelahTranslasi: { id: <>✦ <strong>Garis setelah translasi:</strong></>, en: <>✦ <strong>Line after translation:</strong></>, ja: <>✦ <strong>平行移動後の直線：</strong></> }[language],
    c5Langkah2: { id: <>Langkah 2 — Refleksi terhadap <InlineMath math="y = 3" /></>, en: <>Step 2 — Reflection across <InlineMath math="y = 3" /></>, ja: <>ステップ2 — <InlineMath math="y = 3" />に関する対称移動</> }[language],
    c5Text3: { id: <>Refleksi terhadap <InlineMath math="y = 3" /> memetakan <InlineMath math="(x, y) \to (x,\; 6-y)" />, sehingga:</>, en: <>Reflection across <InlineMath math="y = 3" /> maps <InlineMath math="(x, y) \to (x,\; 6-y)" />, so:</>, ja: <><InlineMath math="y = 3" />に関する対称移動は<InlineMath math="(x, y) \to (x,\; 6-y)" />へ写像するので：</> }[language],
    c5Text4: { id: <>Substitusikan ke <InlineMath math="y_1 = 2x_1 - 9" />:</>, en: <>Substitute into <InlineMath math="y_1 = 2x_1 - 9" />:</>, ja: <><InlineMath math="y_1 = 2x_1 - 9" />に代入すると：</> }[language],
    bayanganAkhir: { id: "Bayangan Akhir", en: "Final Image", ja: "最終的な像" }[language],
    verifikasiYK: { id: "Verifikasi dengan rumus refleksi y=k", en: "Verification using the y=k reflection formula", ja: "y=kに関する対称移動の公式による検証" }[language],
    garisSetelahTranslasiLbl: { id: "Garis setelah translasi:", en: "Line after translation:", ja: "平行移動後の直線：" }[language],
  };

  const badgeColor = (badge: string) => {
    if (badge === "MUDAH" || badge === "Easy"   || badge === "基本") return "bg-green-500/20 text-green-400";
    if (badge === "SEDANG"|| badge === "Medium" || badge === "標準") return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const Hdr = ({ icon, color, title }: { icon: React.ReactNode; color: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <div className="text-4xl text-center mb-3">🪞</div>
        <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-400 text-center mb-1">{t.pageTitle}</h1>
        <p className="font-display text-sm font-semibold text-emerald-300 text-center mb-1">{t.pageSubtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.pageMeta}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO — paling atas */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr icon={<Lightbulb className="w-5 h-5" />} color="#facc15" title={t.secA} />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {t.introText}
              </p>
              <div>
                <img
                  src="/ambulance-refleksi.png"
                  alt={g.altAmbulance}
                  className="w-full rounded-xl object-cover"
                />
                <a
                  href="https://rri.co.id/cek-fakta/1779334/alasan-mengapa-tulisan-ambulance-terbalik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400/50 hover:text-cyan-300 text-right mt-1 font-body block transition-colors"
                >
                  https://rri.co.id/cek-fakta/1779334/alasan-mengapa-tulisan-ambulance-terbalik
                </a>
              </div>
              <div>
                <img
                  src="/cermin-refleksi.png"
                  alt={g.altCermin}
                  className="w-full rounded-xl object-cover"
                />
                <p className="text-[10px] text-white/30 text-right mt-1 font-body">gemini.google.com/app</p>
              </div>

              {/* Penjelasan kedua gambar */}
              <div className="bg-slate-800/60 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                <p className="text-emerald-300 font-body text-sm font-bold">🪞 Refleksi dalam Kehidupan Nyata</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 bg-slate-900/50 rounded-lg px-3 py-2.5">
                    <span className="text-lg shrink-0 mt-0.5">🚑</span>
                    <div>
                      <p className="text-xs font-bold text-yellow-300 font-body">Gambar 1 — Tulisan AMBULANCE Terbalik</p>
                      <p className="text-xs text-white/60 font-body mt-0.5">
                        Tulisan <strong className="text-white">AMBULANCE</strong> sengaja ditulis terbalik (seperti cerminan) di bagian depan kendaraan. Saat pengemudi lain melihatnya melalui <strong className="text-white">kaca spion</strong>, tulisan tersebut terpantul sehingga terbaca normal. Inilah konsep <strong className="text-emerald-300">refleksi terhadap sumbu vertikal</strong> — orientasi gambar berbalik, namun bentuk dan ukuran huruf tetap sama.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/50 rounded-lg px-3 py-2.5">
                    <span className="text-lg shrink-0 mt-0.5">🧍</span>
                    <div>
                      <p className="text-xs font-bold text-yellow-300 font-body">Gambar 2 — Jarak ke Cermin = Jarak Bayangan</p>
                      <p className="text-xs text-white/60 font-body mt-0.5">
                        Seseorang berdiri sejauh <em>d</em> dari cermin, maka bayangannya pun tampak sejauh <em>d</em> di belakang cermin. Cermin berperan sebagai <strong className="text-white">sumbu pencerminan (garis cermin)</strong>. Ini menunjukkan sifat utama refleksi: <strong className="text-emerald-300">jarak titik ke garis cermin selalu sama dengan jarak bayangannya</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-950/50 border border-emerald-500/20 rounded-lg px-4 py-2.5">
                  <p className="text-emerald-200 text-xs font-body leading-relaxed">
                    💡 Kedua gambar membuktikan dua sifat inti refleksi dalam transformasi geometri: <strong>(1) orientasi benda berbalik</strong> seperti terlihat di kaca spion ambulance, dan <strong>(2) jarak benda ke sumbu cermin sama dengan jarak bayangannya</strong> seperti pada orang yang berdiri di depan cermin.
                  </p>
                </div>
              </div>

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
          </div>

          {/* ── ANIMASI INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-emerald-500/30 rounded-xl overflow-hidden">
            <Hdr icon={<span>🎮</span>} color="#34d399" title="B. Animasi Interaktif — Refleksi Titik & Bangun Datar" />
            <div className="px-4 pb-5 space-y-8">
              <AnimasiRefleksiTitik />
              <div className="border-t border-white/10" />
              <AnimasiRefleksiBangun />
              <div className="border-t border-white/10" />
              <AnimasiRefleksiGarisK />
              <div className="border-t border-white/10" />
              <AnimasiRefleksiBangunGarisK />
            </div>
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr icon={<Calculator className="w-5 h-5" />} color="#22d3ee" title="C. 📐 Rumus Refleksi" />
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
          </div>

          {/* CONTOH 1 - Soal Pilihan Ganda Sumbu Y */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr icon={<BookOpen className="w-5 h-5" />} color="#34d399" title={g.secDTitle} />
            <div className="px-5 pb-5 space-y-4">

              {/* Soal */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-emerald-300 font-body mb-3">{g.soalLabel}</p>
                {[
                  ["(i)",   "A(3, −2)",   "A′(3, 2)"],
                  ["(ii)",  "B(−1, 2)",   "B′(−1, −2)"],
                  ["(iii)", "C(2, 3)",    "C′(−2, −3)"],
                  ["(iv)",  "D(−3, −1)",  "D′(3, −1)"],
                ].map(([num, dari, ke]) => (
                  <div key={num} className="flex items-center gap-2 text-sm font-body text-white/80">
                    <span className="text-white/40 min-w-[32px]">{num}</span>
                    <span className="text-cyan-200">{dari}</span>
                    <span className="text-white/40 mx-1">→</span>
                    <span className="text-pink-200">{ke}</span>
                  </div>
                ))}
                <p className="text-sm text-white/80 font-body mt-3 pt-3 border-t border-white/10">
                  {g.secDQuestion}
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-1">
                  {[["A.", "(i)"], ["C.", "(iii)"], ["B.", "(ii)"], ["D.", "(iv)"]].map(([huruf, pilihan]) => (
                    <p key={huruf} className="text-sm font-body text-white/70">
                      <span className="font-bold text-white/90">{huruf}</span> {pilihan}
                    </p>
                  ))}
                </div>
              </div>

              {/* Pembahasan */}
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-emerald-300 font-body">{g.pembahasanLabel}</p>
                <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-white/50 font-body">{g.rumusY}</p>
                  <p className="text-sm font-bold text-yellow-300 font-mono mt-0.5">(x, y) → (−x, y)</p>
                  <p className="text-xs text-white/40 font-body">{g.rumusYNote}</p>
                </div>
                <div className="space-y-2">
                  {[
                    { num: "(i)",   dari: "A(3, −2)",  seharusnya: "A′(−3, −2)", hasil: "A′(3, 2)",   benar: false, alasan: g.dReasons[0] },
                    { num: "(ii)",  dari: "B(−1, 2)",  seharusnya: "B′(1, 2)",   hasil: "B′(−1, −2)", benar: false, alasan: g.dReasons[1] },
                    { num: "(iii)", dari: "C(2, 3)",   seharusnya: "C′(−2, 3)",  hasil: "C′(−2, −3)", benar: false, alasan: g.dReasons[2] },
                    { num: "(iv)",  dari: "D(−3, −1)", seharusnya: "D′(3, −1)",  hasil: "D′(3, −1)",  benar: true,  alasan: g.dReasons[3] },
                  ].map(({ num, dari, seharusnya, hasil, benar, alasan }) => (
                    <div key={num} className={`rounded-lg p-3 border text-sm font-body ${benar ? "bg-emerald-900/30 border-emerald-500/40" : "bg-red-900/20 border-red-500/20"}`}>
                      <div className="flex items-start gap-2 flex-wrap">
                        <span className="text-white/40 min-w-[32px] font-bold">{num}</span>
                        <span className="text-cyan-300">{dari}</span>
                        <span className="text-white/30">{g.dArrow}</span>
                        <span className="font-bold" style={{ color: benar ? "#34d399" : "#f87171" }}>{seharusnya}</span>
                        <span className="text-white/30">{g.dGiven}</span>
                        <span className="text-white/60">{hasil}</span>
                        <span className="ml-1">{benar ? "✅" : "❌"}</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1 ml-8">{alasan}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl px-4 py-3 text-center mt-2">
                  <p className="text-emerald-300 font-bold text-sm font-body">
                    {g.jawabanLabel} <span className="text-yellow-300 text-base">D. (iv)</span>
                  </p>
                  <p className="text-xs text-white/50 font-body mt-0.5">{g.dJawabanNote}</p>
                </div>
              </div>

            </div>
          </div>

          {/* CONTOH 2 - Garis x = k */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title={g.secETitle} />
            <div className="px-5 pb-5 space-y-4">

              {/* Soal */}
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-violet-300 font-body">{g.soalLabel}</p>
                <p className="text-sm text-white/80 font-body leading-relaxed">
                  {g.secEQuestion}
                </p>
                <div className="space-y-1 pl-2">
                  {[["A.", "(−8, 4)"], ["B.", "(−5, 4)"], ["C.", "(−4, 4)"], ["D.", "(−2, 4)"]].map(([huruf, pilihan]) => (
                    <p key={huruf} className="text-sm font-body text-white/70">
                      <span className="font-bold text-white/90 min-w-[20px] inline-block">{huruf}</span> {pilihan}
                    </p>
                  ))}
                </div>
              </div>

              {/* Pembahasan */}
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-violet-300 font-body">{g.pembahasanLabel}</p>

                <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-white/50 font-body">{g.rumusXK}</p>
                  <p className="text-sm font-bold text-yellow-300 font-mono mt-0.5">(x, y) → (2k − x, y)</p>
                  <p className="text-xs text-white/40 font-body">{g.rumusXKNote}</p>
                </div>

                <div className="space-y-2 text-sm font-body">
                  <p className="text-white/60">{g.eGiven}</p>
                  <div className="bg-slate-700/40 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/50">x′</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">2k − x</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">2 × 3 − 8</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">6 − 8</span>
                      <span className="text-white/30">=</span>
                      <span className="text-emerald-300 font-bold">−2</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/50">y′</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">y</span>
                      <span className="text-white/30">=</span>
                      <span className="text-emerald-300 font-bold">4</span>
                      <span className="text-white/30 text-xs">{g.yTetapNote}</span>
                    </div>
                  </div>
                  <p className="text-white/60">{g.eConclusion} <span className="text-emerald-300 font-bold">(−2, 4)</span></p>
                </div>

                <div className="bg-violet-500/15 border border-violet-400/40 rounded-xl px-4 py-3 text-center">
                  <p className="text-violet-300 font-bold text-sm font-body">
                    {g.jawabanLabel} <span className="text-yellow-300 text-base">D. (−2, 4)</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* CONTOH 3 - Refleksi Berantai */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr icon={<BookOpen className="w-5 h-5" />} color="#fb923c" title={g.secFTitle} />
            <div className="px-5 pb-5 space-y-4">

              {/* Soal */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-orange-300 font-body">{g.soalLabel}</p>
                <p className="text-sm text-white/80 font-body leading-relaxed">
                  {g.secFQuestion}
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 pt-1">
                  {[["A.", "(−6, 3)"], ["C.", "(6, 8)"], ["B.", "(−6, 7)"], ["D.", "(6, 13)"]].map(([huruf, pilihan]) => (
                    <p key={huruf} className="text-sm font-body text-white/70">
                      <span className="font-bold text-white/90 min-w-[20px] inline-block">{huruf}</span> {pilihan}
                    </p>
                  ))}
                </div>
              </div>

              {/* Pembahasan */}
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-orange-300 font-body">{g.pembahasanLabel}</p>

                {/* Langkah 1 */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-yellow-300 font-body uppercase tracking-wide">{g.fLangkah1}</p>
                  <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-xs text-white/50 font-body text-center">
                    {g.fRumus1}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body flex-wrap pl-1">
                    <span className="text-cyan-300 font-bold">B(6, 3)</span>
                    <span className="text-white/30">→</span>
                    <span className="text-white/60">B′(−6, 3)</span>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-yellow-300 font-body uppercase tracking-wide">{g.fLangkah2}</p>
                  <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-xs text-white/50 font-body text-center">
                    {g.fRumus2}
                  </div>
                  <div className="bg-slate-700/40 rounded-lg p-3 space-y-1.5 text-sm font-body">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/50">x″</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">x′</span>
                      <span className="text-white/30">=</span>
                      <span className="text-emerald-300 font-bold">−6</span>
                      <span className="text-white/30 text-xs">{g.xTetapNote}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/50">y″</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">2k − y′</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">2 × 5 − 3</span>
                      <span className="text-white/30">=</span>
                      <span className="text-white/70">10 − 3</span>
                      <span className="text-white/30">=</span>
                      <span className="text-emerald-300 font-bold">7</span>
                    </div>
                  </div>
                  <p className="text-sm font-body text-white/60 pl-1">
                    {g.fFinalImage} <span className="text-emerald-300 font-bold">B″(−6, 7)</span>
                  </p>
                </div>

                <div className="bg-orange-500/15 border border-orange-400/40 rounded-xl px-4 py-3 text-center">
                  <p className="text-orange-300 font-bold text-sm font-body">
                    {g.jawabanLabel} <span className="text-yellow-300 text-base">B. (−6, 7)</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* TAMBAHAN — Refleksi pada Kurva Linear */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title={g.secGTitle} />
            <div className="px-5 pb-5 space-y-5">

              {/* Pengantar */}
              <p className="text-sm text-white/80 font-body leading-relaxed">
                {g.gIntro}
              </p>

              {/* Penurunan Rumus — Contoh Sumbu X */}
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-violet-400 font-body uppercase tracking-wide">{g.penurunanX}</p>
                <p className="text-sm text-white/80 font-body">{g.gTextX1}</p>
                <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                  <BlockMath math="x' = x \implies x = x'" />
                  <BlockMath math="y' = -y \implies y = -y'" />
                </div>
                <p className="text-sm text-white/80 font-body">{g.gSubOrig}</p>
                <div className="bg-violet-950/50 border border-violet-500/30 rounded-xl p-4 text-center space-y-1">
                  <BlockMath math="-y' = mx' + c" />
                  <BlockMath math="\therefore\quad y' = -mx' - c" />
                  <p className="text-xs text-white/50 font-body mt-1">{g.gOrNote}</p>
                  <BlockMath math="\boxed{y = -mx - c}" />
                </div>
                {/* Penurunan Rumus x=k dan y=k */}
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-semibold text-orange-400 font-body uppercase tracking-wide">{g.penurunanXKYK}</p>

                  {/* x=k */}
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-orange-300 font-body">{g.cerminXK}</p>
                    <p className="text-sm text-white/80 font-body">{g.gTextXK1}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x' = 2k - x \implies x = 2k - x'" />
                      <BlockMath math="y' = y" />
                    </div>
                    <p className="text-sm text-white/80 font-body">{g.gSubInto}</p>
                    <div className="bg-orange-950/50 border border-orange-500/30 rounded-xl p-4 text-center space-y-1">
                      <BlockMath math="y' = m(2k - x') + c" />
                      <BlockMath math="\boxed{y = -mx + (2mk + c)}" />
                    </div>
                  </div>

                  {/* y=k */}
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-pink-300 font-body">{g.cerminYK}</p>
                    <p className="text-sm text-white/80 font-body">{g.gTextYK1}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x' = x" />
                      <BlockMath math="y' = 2k - y \implies y = 2k - y'" />
                    </div>
                    <p className="text-sm text-white/80 font-body">{g.gSubInto}</p>
                    <div className="bg-pink-950/50 border border-pink-500/30 rounded-xl p-4 text-center space-y-1">
                      <BlockMath math="2k - y' = mx' + c" />
                      <BlockMath math="\boxed{y = -mx + (2k - c)}" />
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-sm text-yellow-200 font-body">
                      <strong>{g.perhatikan}</strong> {g.perhatikanBody}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-sm text-yellow-200 font-body">
                    <strong>{g.catatan}</strong> {g.catatanBody}
                  </p>
                </div>
              </div>

              {/* Tabel Ringkasan */}
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-violet-400 font-body uppercase tracking-wide">{g.tableTitle}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-separate" style={{ borderSpacing: '0 4px' }}>
                    <thead>
                      <tr>
                        <th className="text-white/40 font-semibold text-left px-3 py-1">{g.thCermin}</th>
                        <th className="text-white/40 font-semibold text-left px-3 py-1">{g.thSubstitusi}</th>
                        <th className="text-white/40 font-semibold text-left px-3 py-1">{g.thBayangan}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cermin: g.cerminSumbuX,  sub: "x=x',\\; y=-y'",  hasil: "y=-mx-c",              color: "#22d3ee" },
                        { cermin: g.cerminSumbuY,  sub: "x=-x',\\; y=y'",  hasil: "y=-mx+c",              color: "#f472b6" },
                        { cermin: "y = x",   sub: "x=y',\\; y=x'",   hasil: "y=\\tfrac{1}{m}x-\\tfrac{c}{m}", color: "#fbbf24" },
                        { cermin: "y = −x",  sub: "x=-y',\\; y=-x'", hasil: "y=\\tfrac{1}{m}x+\\tfrac{c}{m}", color: "#a78bfa" },
                        { cermin: g.cerminTitikO, sub: "x=-x',\\; y=-y'", hasil: "y=mx-c",           color: "#34d399" },
                        { cermin: "x = k", sub: "x'=2k-x,\\; y'=y", hasil: "y=-mx+(2mk+c)",  color: "#f97316" },
                        { cermin: "y = k", sub: "x'=x,\\; y'=2k-y", hasil: "y=-mx+(2k-c)",   color: "#ec4899" },
                      ].map(row => (
                        <tr key={row.cermin} className="bg-slate-900/40 rounded-lg">
                          <td className="px-3 py-2 rounded-l-lg font-bold text-xs" style={{ color: row.color }}>{row.cermin}</td>
                          <td className="px-3 py-2 text-white/60"><InlineMath math={row.sub} /></td>
                          <td className="px-3 py-2 rounded-r-lg font-bold" style={{ color: row.color }}><InlineMath math={row.hasil} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-white/40 font-body">{g.tableFootnote}</p>
              </div>

              {/* Animasi Interaktif */}
              <AnimasiRefleksiKurva />

              {/* Animasi x=k dan y=k */}
              <AnimasiRefleksiKurvaK />

              {/* Contoh Soal */}
              <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wider">{g.contohSoalLabel}</p>

              {/* Mudah */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded font-body ${badgeColor(g.badgeMudah)}`}>{g.badgeMudah}</span>
                  <span className="font-body font-semibold text-white text-sm">{g.contoh1}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {g.contoh1Soal}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-green-400 font-body">{g.pembahasanCaps}</p>
                  <p className="text-sm text-white/80 font-body">{g.contoh1Text1}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="x' = x \implies x = x'" />
                    <BlockMath math="y' = -y \implies y = -y'" />
                  </div>
                  <p className="text-sm text-white/80 font-body">{g.contoh1Text2}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="-y' = 2x' + 3" />
                    <BlockMath math="y' = -2x' - 3" />
                  </div>
                  <p className="font-body font-bold text-green-300"><strong>{g.bayanganLabel}</strong> <InlineMath math="y = -2x - 3" /></p>
                </div>
              </div>

              {/* Contoh 4 — x=k */}
              <div className="border-l-4 border-orange-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded font-body">{g.badgeXK}</span>
                  <span className="font-body font-semibold text-white text-sm">{g.contoh4}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {g.contoh4Soal}
                  </p>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-orange-400 font-body">{g.pembahasanCaps}</p>
                  <p className="text-sm text-white/80 font-body">{g.contoh4Text1}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="x' = 6 - x \implies x = 6 - x'" />
                    <BlockMath math="y' = y" />
                  </div>
                  <p className="text-sm text-white/80 font-body">{g.contoh4Text2}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                    <BlockMath math="y' = 2(6 - x') + 1" />
                    <BlockMath math="y' = 12 - 2x' + 1" />
                    <BlockMath math="y' = -2x' + 13" />
                  </div>
                  <p className="font-body font-bold text-orange-300"><strong>{g.bayanganLabel}</strong> <InlineMath math="y = -2x + 13" /></p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wide">{g.verifikasiLabel}</p>
                    <p className="text-xs text-white/60 font-body"><InlineMath math="m=-2,\; c=2mk+c_0=2(2)(3)+1=13" /> ✓</p>
                  </div>
                </div>
              </div>

              {/* Contoh 5 — Translasi + Refleksi y=k */}
              <div className="border-l-4 border-pink-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-pink-500/20 text-pink-400 text-xs font-bold px-2 py-1 rounded font-body">{g.badgeTransYK}</span>
                  <span className="font-body font-semibold text-white text-sm">{g.contoh5}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {g.contoh5Soal}
                  </p>
                </div>
                <div className="bg-pink-500/5 border border-pink-500/20 rounded-lg p-4 space-y-4">
                  <p className="text-xs font-semibold text-pink-400 font-body">{g.pembahasanCaps}</p>

                  {/* Langkah 1 */}
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-white/90 font-body">{g.c5Langkah1}</p>
                    <p className="text-sm text-white/70 font-body">{g.c5Text1}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x_1 = x + 3 \implies x = x_1 - 3" />
                      <BlockMath math="y_1 = y - 2 \implies y = y_1 + 2" />
                    </div>
                    <p className="text-sm text-white/70 font-body">{g.c5Text2}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="(y_1 + 2) = 2(x_1 - 3) + 1" />
                      <BlockMath math="y_1 + 2 = 2x_1 - 6 + 1" />
                      <BlockMath math="y_1 = 2x_1 - 9" />
                    </div>
                    <p className="text-sm text-white/80 font-body">{g.c5GarisSetelahTranslasi} <InlineMath math="y = 2x - 9" /></p>
                  </div>

                  {/* Langkah 2 */}
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-white/90 font-body">{g.c5Langkah2}</p>
                    <p className="text-sm text-white/70 font-body">{g.c5Text3}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="x' = x_1" />
                      <BlockMath math="y' = 6 - y_1 \implies y_1 = 6 - y'" />
                    </div>
                    <p className="text-sm text-white/70 font-body">{g.c5Text4}</p>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                      <BlockMath math="6 - y' = 2x' - 9" />
                      <BlockMath math="y' = -2x' + 15" />
                    </div>
                  </div>

                  <div className="bg-pink-950/50 border border-pink-500/30 rounded-xl p-4 text-center">
                    <p className="text-xs text-white/50 font-body mb-1">{g.bayanganAkhir}</p>
                    <BlockMath math="\boxed{y = -2x + 15}" />
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-white/50 font-body uppercase tracking-wide">{g.verifikasiYK}</p>
                    <p className="text-xs text-white/60 font-body">
                      {g.garisSetelahTranslasiLbl} <InlineMath math="m=2,\; c=-9,\; k=3" />
                    </p>
                    <p className="text-xs text-white/60 font-body">
                      <InlineMath math="y = -mx + (2k - c) = -2x + (6-(-9)) = -2x + 15" /> ✓
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RANGKUMAN, TIPS & KESIMPULAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr icon={<Target className="w-5 h-5" />} color="#f97316" title="H. 🎯 Rangkuman, Tips & Kesimpulan" />
            <div className="px-5 pb-5 space-y-5">

              {/* ── Rumus Kunci ── */}
              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-green-300 uppercase tracking-widest">📐 Rumus Kunci Refleksi</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { cermin: "Sumbu-x", rumus: "A(x, y) → A'(x, −y)", color: "from-cyan-900/50 to-blue-900/50", border: "border-cyan-500/30", tc: "text-cyan-300" },
                    { cermin: "Sumbu-y", rumus: "A(x, y) → A'(−x, y)", color: "from-green-900/50 to-teal-900/50", border: "border-green-500/30", tc: "text-green-300" },
                    { cermin: "Garis y = x", rumus: "A(x, y) → A'(y, x)", color: "from-purple-900/50 to-pink-900/50", border: "border-purple-500/30", tc: "text-purple-300" },
                    { cermin: "Garis y = −x", rumus: "A(x, y) → A'(−y, −x)", color: "from-rose-900/50 to-red-900/50", border: "border-rose-500/30", tc: "text-rose-300" },
                    { cermin: "Titik O(0,0)", rumus: "A(x, y) → A'(−x, −y)", color: "from-orange-900/50 to-yellow-900/50", border: "border-orange-500/30", tc: "text-orange-300" },
                    { cermin: "Garis x = h", rumus: "A(x, y) → A'(2h−x, y)", color: "from-indigo-900/50 to-blue-900/50", border: "border-indigo-500/30", tc: "text-indigo-300" },
                  ].map(r => (
                    <div key={r.cermin} className={`bg-gradient-to-br ${r.color} ${r.border} border rounded-xl p-3`}>
                      <p className={`font-body text-xs font-bold ${r.tc} mb-1.5`}>🪞 {r.cermin}</p>
                      <p className="font-body text-sm text-white font-mono bg-slate-900/60 rounded-lg px-3 py-1.5 text-center">{r.rumus}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-green-900/30 border border-green-500/20 rounded-xl p-3">
                  <p className="font-body text-xs text-green-400 font-bold mb-2">📌 Sifat-sifat Refleksi</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    {[
                      { icon: "📐", label: "Bentuk", val: "Tetap" },
                      { icon: "📏", label: "Ukuran", val: "Tetap" },
                      { icon: "🔄", label: "Orientasi", val: "Berbalik" },
                      { icon: "↔️", label: "Jarak ke cermin", val: "Sama" },
                    ].map(item => (
                      <div key={item.label} className="bg-slate-900/50 rounded-lg p-2">
                        <p className="text-base">{item.icon}</p>
                        <p className="font-body text-xs text-white/60">{item.label}</p>
                        <p className={`font-body text-xs font-bold ${item.val === "Tetap" || item.val === "Sama" ? "text-green-400" : "text-yellow-400"}`}>{item.val}</p>
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
                      color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
                      title: "Hafal pasangan tukar koordinat",
                      body: "Sumbu-x → negasikan y. Sumbu-y → negasikan x. Garis y=x → tukar x dan y. Garis y=−x → tukar DAN negasikan keduanya.",
                    },
                    {
                      num: "2",
                      color: "bg-green-500/10 border-green-500/30 text-green-300",
                      title: "Refleksi terhadap garis y = k atau x = h",
                      body: "Gunakan rumus umum: y=k → A'(x, 2k−y); x=h → A'(2h−x, y). Substitusikan nilai k atau h langsung.",
                    },
                    {
                      num: "3",
                      color: "bg-purple-500/10 border-purple-500/30 text-purple-300",
                      title: "Soal terbalik: cari titik asal",
                      body: "Refleksi bersifat simetri — jika A' adalah bayangan A, maka A juga merupakan bayangan dari A'! Gunakan rumus yang sama untuk mencari balik.",
                    },
                    {
                      num: "4",
                      color: "bg-rose-500/10 border-rose-500/30 text-rose-300",
                      title: "Refleksi garis ax + by + c = 0",
                      body: "Substitusikan invers koordinat refleksi ke persamaan garis bayangan. Contoh: refleksi sumbu-x → ganti y dengan −y di persamaan bayangan.",
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
              <div className="bg-gradient-to-r from-green-900/40 via-teal-900/30 to-green-900/40 border border-green-500/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏁</span>
                  <p className="font-body text-sm font-bold text-green-300 uppercase tracking-wide">Kesimpulan</p>
                </div>
                <p className="font-body text-sm text-white/85 leading-relaxed">
                  <strong className="text-green-300">Refleksi</strong> adalah transformasi yang mencerminkan titik terhadap suatu garis (cermin). Hasilnya seperti bayangan di cermin — bentuk dan ukuran sama persis, tetapi <strong className="text-yellow-300">orientasi berbalik</strong>. Kunci sukses refleksi: hafal rumus masing-masing sumbu cermin, dan ingat bahwa refleksi bersifat <strong className="text-cyan-300">simetri sempurna</strong> — jarak titik ke cermin sama sebelum dan sesudah transformasi!
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Isometri ✅", "Orientasi berbalik", "6 jenis cermin", "Simetri sempurna"].map(tag => (
                    <span key={tag} className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-0.5 text-xs font-body text-green-200">{tag}</span>
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

export default RefleksiPage;
