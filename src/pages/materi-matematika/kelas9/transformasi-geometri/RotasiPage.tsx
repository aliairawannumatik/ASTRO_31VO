import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

/* ── SVG grid helpers ── */
const S = 240, sc = S / 14, ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;
const ticks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
const DEG = Math.PI / 180;

function Grid({ children, accent = "#fb923c" }: { children?: React.ReactNode; accent?: string }) {
  return (
    <svg width={S} height={S} className="rounded-xl border bg-slate-900/70" style={{ borderColor: `${accent}33` }}>
      {ticks.map(t => (
        <g key={t}>
          <line x1={px(t)} y1={0} x2={px(t)} y2={S} stroke="#334155" strokeWidth="0.5" />
          <line x1={0} y1={py(t)} x2={S} y2={py(t)} stroke="#334155" strokeWidth="0.5" />
        </g>
      ))}
      <line x1={0} y1={oy} x2={S} y2={oy} stroke="#64748b" strokeWidth="1.2" />
      <line x1={ox} y1={0} x2={ox} y2={S} stroke="#64748b" strokeWidth="1.2" />
      <polygon points={`${S},${oy} ${S - 6},${oy - 3} ${S - 6},${oy + 3}`} fill="#64748b" />
      <polygon points={`${ox},0 ${ox - 3},6 ${ox + 3},6`} fill="#64748b" />
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

function Dot({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={4} fill={color} />
      <text x={px(x) + 5} y={py(y) - 4} fill={color} fontSize="8" fontWeight="bold">{label}</text>
    </g>
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
      <path d={`M${x1},${y1} A${r},${r},0,${large},${sweep},${x2},${y2}`} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4,2" />
      <circle cx={x2} cy={y2} r={2.5} fill={color} />
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

/* ── Animasi Interaktif Rotasi ── */
const ORIG_PTS: [number, number][] = [[1, 1], [4, 1], [1, 3]];
const ORIG_LABELS = ["A(1,1)", "B(4,1)", "C(1,3)"];

function AnimasiRotasi() {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [dir, setDir] = useState<"ccw" | "cw">("ccw");
  const [centerType, setCenterType] = useState<"origin" | "custom">("origin");
  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");
  const [show, setShow] = useState(false);

  const ca = centerType === "origin" ? 0 : parseFloat(inputA) || 0;
  const cb = centerType === "origin" ? 0 : parseFloat(inputB) || 0;
  const actualDeg = dir === "ccw" ? angle : -angle;

  const rotated = ORIG_PTS.map(([x, y]) => rotatePtAround(x, y, ca, cb, actualDeg) as [number, number]);

  const dirLabel = dir === "ccw" ? "berlawanan arah jarum jam" : "searah jarum jam";

  const handlePutar = () => { playPopSound(); setShow(true); };
  const handleReset = () => { playPopSound(); setShow(false); };

  const arcStart = dir === "ccw" ? 30 : 30;
  const arcEnd = dir === "ccw" ? 30 + angle : 30 - angle;

  return (
    <div className="space-y-4 pt-2">
      <p className="text-cyan-300 font-bold text-sm font-body">🔄 Animasi Interaktif — Rotasi Bangun Datar</p>

      {/* Pilih sudut */}
      <div className="space-y-1.5">
        <p className="text-xs font-body text-white/50 uppercase tracking-wide">Sudut Rotasi</p>
        <div className="flex flex-col gap-2">
          {/* Berlawanan arah jarum jam */}
          <div className="space-y-1">
            <p className="text-xs font-body text-emerald-400 font-semibold">Berlawanan arah jarum jam</p>
            <div className="flex gap-2 flex-wrap">
              {([90, 180, 270] as const).map(a => (
                <button
                  key={`ccw-${a}`}
                  onClick={() => { playPopSound(); setAngle(a); setDir("ccw"); setShow(false); }}
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
          {/* Searah jarum jam */}
          <div className="space-y-1">
            <p className="text-xs font-body text-orange-400 font-semibold">Searah jarum jam</p>
            <div className="flex gap-2 flex-wrap">
              {([90, 180, 270] as const).map(a => (
                <button
                  key={`cw-${a}`}
                  onClick={() => { playPopSound(); setAngle(a); setDir("cw"); setShow(false); }}
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
              onClick={() => { playPopSound(); setCenterType(c); setShow(false); }}
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
              onChange={e => { setInputA(e.target.value); setShow(false); }}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono"
            />
            <label className="text-xs text-white/60 font-body">b =</label>
            <input
              type="number"
              value={inputB}
              onChange={e => { setInputB(e.target.value); setShow(false); }}
              className="w-16 bg-slate-700 border border-slate-500 rounded-lg px-2 py-1 text-sm text-white text-center font-mono"
            />
          </div>
        )}
      </div>

      {/* Grid + info */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-center">
        <Grid accent={dir === "ccw" ? "#22d3ee" : "#fb923c"}>
          {/* Pusat rotasi */}
          <circle cx={px(ca)} cy={py(cb)} r={5} fill={dir === "ccw" ? "#22d3ee" : "#fb923c"} />
          <text x={px(ca) + 6} y={py(cb) - 5} fill={dir === "ccw" ? "#22d3ee" : "#fb923c"} fontSize="8" fontWeight="bold">
            {centerType === "origin" ? "O" : `(${ca},${cb})`}
          </text>

          {/* Arc arrow */}
          <ArcArrow cx={ca} cy={cb} r={36} aStart={arcStart} aEnd={arcEnd} color="#facc15" />
          <text
            x={px(ca) + (dir === "ccw" ? -30 : 30)}
            y={py(cb) - 30}
            fontSize="7"
            fill="#fde68a"
            textAnchor="middle"
          >
            {angle}°
          </text>

          {/* Segitiga asli */}
          <Poly pts={ORIG_PTS} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
          {ORIG_PTS.map(([x, y], i) => (
            <Dot key={i} x={x} y={y} color="#22d3ee" label={["A","B","C"][i]} />
          ))}

          {/* Segitiga bayangan */}
          {show && (
            <g style={{ transition: "opacity 0.4s" }}>
              <Poly pts={rotated} color={dir === "ccw" ? "#f472b6" : "#fb923c"} fill={dir === "ccw" ? "rgba(244,114,182,0.2)" : "rgba(251,146,60,0.2)"} label="△A'B'C'" />
              {rotated.map(([x, y], i) => (
                <Dot key={i} x={x} y={y} color={dir === "ccw" ? "#f472b6" : "#fb923c"} label={["A'","B'","C'"][i]} />
              ))}
            </g>
          )}
        </Grid>

        {/* Panel hasil */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="bg-slate-700/40 rounded-xl p-3 space-y-1 text-xs font-body">
            <p className="text-yellow-300 font-bold text-sm">{angle}° {dirLabel}</p>
            <p className="text-white/50">Pusat: {centerType === "origin" ? "O(0, 0)" : `(${ca}, ${cb})`}</p>
          </div>

          {show && (
            <div className="bg-slate-700/40 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-white/60 font-body uppercase">Hasil:</p>
              {ORIG_PTS.map(([x, y], i) => {
                const [rx, ry] = rotated[i];
                const rx_ = Math.round(rx * 100) / 100;
                const ry_ = Math.round(ry * 100) / 100;
                return (
                  <div key={i} className="flex items-center gap-2 text-sm font-body">
                    <span className="text-cyan-300 min-w-[60px]">{ORIG_LABELS[i]}</span>
                    <span className="text-white/30">→</span>
                    <span className={`font-bold ${dir === "ccw" ? "text-pink-300" : "text-orange-300"}`}>
                      ({rx_}, {ry_})
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePutar}
              className={`flex-1 py-2 rounded-xl font-bold text-sm font-body transition-all ${
                dir === "ccw"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                  : "bg-orange-500 hover:bg-orange-400 text-white"
              }`}
            >
              🔄 Putar!
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl font-bold text-sm font-body bg-slate-700 hover:bg-slate-600 text-white/70 transition-all"
            >
              Reset
            </button>
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
      <ArcArrow cx={0} cy={0} r={40} aStart={0} aEnd={90} color="#facc15" />
      <text x={px(0.5)} y={py(2.8)} fontSize="8" fill="#fde68a">90°</text>
      <circle cx={ox} cy={oy} r={3} fill="#f97316" />
      <text x={ox + 4} y={oy - 4} fontSize="9" fill="#f97316">O</text>
    </Grid>
  );
};

const DiagramR90CW = () => {
  const r270 = origPts.map(([x, y]) => rotatePtAround(x, y, 0, 0, -90) as [number, number]);
  return (
    <Grid accent="#a78bfa">
      <Poly pts={origPts} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
      <Poly pts={r270} color="#a78bfa" fill="rgba(167,139,250,0.15)" label="△A'B'C'" />
      <ArcArrow cx={0} cy={0} r={40} aStart={0} aEnd={-90} color="#facc15" />
      <text x={px(2.5)} y={py(-2.5)} fontSize="8" fill="#fde68a">90°</text>
      <circle cx={ox} cy={oy} r={3} fill="#f97316" />
      <text x={ox + 4} y={oy - 4} fontSize="9" fill="#f97316">O</text>
    </Grid>
  );
};

const DiagramR180 = () => {
  const r180 = origPts.map(([x, y]) => rotatePtAround(x, y, 0, 0, 180) as [number, number]);
  return (
    <Grid accent="#fb923c">
      <Poly pts={origPts} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
      <Poly pts={r180} color="#fb923c" fill="rgba(251,146,60,0.15)" label="△A'B'C'" />
      <ArcArrow cx={0} cy={0} r={44} aStart={15} aEnd={165} color="#facc15" />
      <text x={px(-0.3)} y={py(3.5)} fontSize="8" fill="#fde68a">180°</text>
      <circle cx={ox} cy={oy} r={3} fill="#f97316" />
    </Grid>
  );
};

/* ── Page ── */
const RotasiPage = () => {
  const [open, setOpen] = useState<string[]>(["intro", "animasi", "rumus", "contoh90", "contoh90cw", "contoh180", "rangkuman"]);
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

          {/* ANIMASI INTERAKTIF */}
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
                    <span className="text-orange-400 font-bold text-sm font-body min-w-[140px]">{k}</span>
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

export default RotasiPage;
