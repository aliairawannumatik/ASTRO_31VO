import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── SVG helpers ── */
const S = 220, sc = S / 14, ox = S / 2, oy = S / 2;
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

function ArcArrow({ cx: acx, cy: acy, r, aStart, aEnd, color }: { cx: number; cy: number; r: number; aStart: number; aEnd: number; color: string }) {
  const x1 = px(acx) + r * Math.cos(aStart * DEG);
  const y1 = py(acy) - r * Math.sin(aStart * DEG);
  const x2 = px(acx) + r * Math.cos(aEnd * DEG);
  const y2 = py(acy) - r * Math.sin(aEnd * DEG);
  const large = Math.abs(aEnd - aStart) > 180 ? 1 : 0;
  const sweep = aEnd > aStart ? 0 : 1;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len * 4, ny = dx / len * 4;
  return (
    <g>
      <path d={`M${x1},${y1} A${r},${r},0,${large},${sweep},${x2},${y2}`} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4,2" />
      <circle cx={x2} cy={y2} r={2.5} fill={color} />
    </g>
  );
}

function rotatePt(x: number, y: number, deg: number): [number, number] {
  const r = deg * DEG;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
}

/* ── Diagrams ── */
const origPts: [number, number][] = [[2, 0], [4, 0], [3, 2]];

const DiagramR90 = () => {
  const r90 = origPts.map(([x, y]) => rotatePt(x, y, 90) as [number, number]);
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
  const r270 = origPts.map(([x, y]) => rotatePt(x, y, -90) as [number, number]);
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
  const r180 = origPts.map(([x, y]) => rotatePt(x, y, 180) as [number, number]);
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
  const [open, setOpen] = useState<string[]>(["intro", "rumus", "contoh90", "contoh90cw", "contoh180", "rangkuman"]);
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
                    <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">1.</span><div><strong className="text-white">Titik pusat rotasi</strong> — titik yang diam (tidak bergerak), biasanya O(0,0) atau titik lain</div></li>
                    <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold">2.</span><div><strong className="text-white">Sudut rotasi (θ)</strong> — besar putaran, positif = berlawanan jarum jam (CCW), negatif = searah jarum jam (CW)</div></li>
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

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="rumus" icon={<Calculator className="w-5 h-5" />} color="#22d3ee" title="📐 Rumus Rotasi terhadap O(0,0)" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="text-sm text-white/70 font-body">Untuk titik <InlineMath math="A(x, y)" /> yang dirotasikan sebesar <InlineMath math="\theta" /> terhadap titik asal O(0,0):</p>
                <div className="space-y-3">
                  {[
                    { sudut: "90° (berlawanan jarum jam / CCW)", rumus: "(x, y) \\rightarrow (-y, x)", color: "#22d3ee" },
                    { sudut: "90° (searah jarum jam / CW)", rumus: "(x, y) \\rightarrow (y, -x)", color: "#a78bfa" },
                    { sudut: "180°", rumus: "(x, y) \\rightarrow (-x, -y)", color: "#fb923c" },
                    { sudut: "270° CCW (= 90° CW)", rumus: "(x, y) \\rightarrow (y, -x)", color: "#4ade80" },
                  ].map(({ sudut, rumus, color }) => (
                    <div key={sudut} className="bg-slate-800/60 rounded-xl p-3">
                      <p className="text-xs font-bold font-body mb-1" style={{ color }}>{sudut}</p>
                      <div className="text-center"><InlineMath math={rumus} /></div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4">
                  <p className="text-xs text-white/60 font-body mb-2 text-center">Rumus umum untuk sudut θ sembarang:</p>
                  <BlockMath math="\begin{pmatrix}x'\\y'\end{pmatrix} = \begin{pmatrix}\cos\theta & -\sin\theta\\\sin\theta & \cos\theta\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}" />
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 90 CCW */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh90" icon={<BookOpen className="w-5 h-5" />} color="#22d3ee" title="📌 Contoh 1: Rotasi 90° CCW terhadap O(0,0)" />
            {open.includes("contoh90") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-cyan-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(2,0), B(4,0), C(3,2)" /> yang dirotasikan 90° berlawanan jarum jam terhadap O(0,0)!</p>
                </div>
                <div className="flex justify-center"><DiagramR90 /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-cyan-300 font-body">Penyelesaian: <InlineMath math="(x,y) \to (-y, x)" /></p>
                  {[
                    { dari: "A(2, 0)", ke: "A'(0, 2)", x: 2, y: 0 },
                    { dari: "B(4, 0)", ke: "B'(0, 4)", x: 4, y: 0 },
                    { dari: "C(3, 2)", ke: "C'(−2, 3)", x: 3, y: 2 },
                  ].map(({ dari, ke, x, y }) => (
                    <div key={dari} className="flex items-center gap-3 text-sm font-body">
                      <span className="text-cyan-300 min-w-[80px]">{dari}</span>
                      <span className="text-white/40">→</span>
                      <InlineMath math={`(-${y},\\; ${x})`} />
                      <span className="text-pink-300 font-bold ml-1">= {ke}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 90 CW */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh90cw" icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title="📌 Contoh 2: Rotasi 90° CW terhadap O(0,0)" />
            {open.includes("contoh90cw") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(2,0), B(4,0), C(3,2)" /> yang dirotasikan 90° searah jarum jam terhadap O(0,0)!</p>
                </div>
                <div className="flex justify-center"><DiagramR90CW /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-violet-300 font-body">Penyelesaian: <InlineMath math="(x,y) \to (y, -x)" /></p>
                  {[
                    { dari: "A(2, 0)", ke: "A'(0, −2)", x: 2, y: 0 },
                    { dari: "B(4, 0)", ke: "B'(0, −4)", x: 4, y: 0 },
                    { dari: "C(3, 2)", ke: "C'(2, −3)", x: 3, y: 2 },
                  ].map(({ dari, ke, x, y }) => (
                    <div key={dari} className="flex items-center gap-3 text-sm font-body">
                      <span className="text-violet-300 min-w-[80px]">{dari}</span>
                      <span className="text-white/40">→</span>
                      <InlineMath math={`(${y},\\; -${x})`} />
                      <span className="text-orange-300 font-bold ml-1">= {ke}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 180 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="contoh180" icon={<BookOpen className="w-5 h-5" />} color="#fb923c" title="📌 Contoh 3: Rotasi 180° terhadap O(0,0)" />
            {open.includes("contoh180") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-orange-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan segitiga ABC dengan <InlineMath math="A(2,0), B(4,0), C(3,2)" /> yang dirotasikan 180° terhadap O(0,0)!</p>
                </div>
                <div className="flex justify-center"><DiagramR180 /></div>
                <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-orange-300 font-body">Penyelesaian: <InlineMath math="(x,y) \to (-x, -y)" /></p>
                  {[
                    { dari: "A(2, 0)", ke: "A'(−2, 0)" },
                    { dari: "B(4, 0)", ke: "B'(−4, 0)" },
                    { dari: "C(3, 2)", ke: "C'(−3, −2)" },
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
                  ["Definisi", "Memutar setiap titik sebesar θ terhadap titik pusat O"],
                  ["90° CCW", "(x, y) → (−y, x)"],
                  ["90° CW", "(x, y) → (y, −x)"],
                  ["180°", "(x, y) → (−x, −y)"],
                  ["270° CCW", "(x, y) → (y, −x)  [= 90° CW]"],
                  ["Sifat", "Bentuk & ukuran tetap, jarak ke pusat tetap"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-3">
                    <span className="text-orange-400 font-bold text-sm font-body min-w-[100px]">{k}</span>
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
