import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, MoveRight } from "lucide-react";
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

function Dot({ x, y, color, label }: { x: number; y: number; color: string; label?: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={4} fill={color} />
      {label && <text x={px(x) + 6} y={py(y) - 4} fill={color} fontSize="9" fontWeight="bold">{label}</text>}
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

/* ── Diagrams ── */
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

const DiagramTitik = () => (
  <Grid accent="#a78bfa">
    <Dot x={-3} y={2} color="#22d3ee" label="A(−3,2)" />
    <Dot x={1} y={4} color="#f472b6" label="A'(1,4)" />
    <Arrow x1={-3} y1={2} x2={1} y2={4} color="#a78bfa" />
    <text x={px(-1.5)} y={py(2.8)} fontSize="8" fill="#c4b5fd" textAnchor="middle">T(4,2)</text>
  </Grid>
);

/* ── Page ── */
const TranslasiPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "rumus", "titik", "bangun", "vektor", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]); };

  const Hdr = ({ id, icon, color, title }: { id: string; icon: React.ReactNode; color: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-cyan-400" />}
    </button>
  );

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
            <Hdr id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" title="🌟 Apa Itu Translasi?" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-cyan-300">Translasi</strong> adalah jenis transformasi yang memindahkan setiap titik pada suatu bangun ke posisi baru berdasarkan arah dan jarak tertentu, <strong className="text-white">tanpa mengubah bentuk, ukuran, maupun orientasi</strong> bangun tersebut.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-body text-sm font-semibold">🔑 Kata Kunci:</p>
                  <p className="text-white/80 text-sm font-body mt-1">Translasi ditentukan oleh sebuah <strong className="text-yellow-300">vektor translasi</strong> <InlineMath math="\begin{pmatrix}a\\b\end{pmatrix}" /> yang menunjukkan berapa jauh bangun digeser ke kanan/kiri (a) dan ke atas/bawah (b).</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-white/60 text-xs font-body mb-3 text-center">Contoh: Segitiga ABC digeser oleh T(3, −3)</p>
                  <div className="flex justify-center"><DiagramKonsep /></div>
                  <div className="flex gap-4 justify-center mt-3">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-cyan-400/50 border border-cyan-400" /><span className="text-xs text-cyan-300 font-body">△ABC (asli)</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-pink-400/50 border border-pink-400" /><span className="text-xs text-pink-300 font-body">△A'B'C' (bayangan)</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[["✅ Bentuk", "Tetap sama"], ["✅ Ukuran", "Tetap sama"], ["✅ Orientasi", "Tetap sama"], ["❌ Posisi", "Berubah"]].map(([k, v]) => (
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
            <Hdr id="rumus" icon={<Calculator className="w-5 h-5" />} color="#22d3ee" title="📐 Rumus Translasi" />
            {open.includes("rumus") && (
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
            )}
          </div>

          {/* CONTOH TITIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="titik" icon={<BookOpen className="w-5 h-5" />} color="#a78bfa" title="📌 Contoh: Translasi Titik" />
            {open.includes("titik") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-300 font-body mb-2">Soal:</p>
                  <p className="text-sm text-white/80 font-body">Tentukan bayangan titik <InlineMath math="A(-3, 2)" /> oleh translasi <InlineMath math="T = \begin{pmatrix}4\\2\end{pmatrix}" /></p>
                </div>
                <div className="flex justify-center"><DiagramTitik /></div>
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
            )}
          </div>

          {/* CONTOH BANGUN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="bangun" icon={<BookOpen className="w-5 h-5" />} color="#f472b6" title="📐 Contoh: Translasi Bangun Datar" />
            {open.includes("bangun") && (
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
                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-white/60 font-body mb-3 text-center">Visualisasi</p>
                  <div className="flex justify-center">
                    <Grid accent="#f472b6">
                      <Poly pts={[[1,1],[4,1],[2,4]]} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△PQR" />
                      <Poly pts={[[-2,-1],[1,-1],[-1,2]]} color="#f472b6" fill="rgba(244,114,182,0.15)" label="△P'Q'R'" />
                      <Arrow x1={1} y1={1} x2={-2} y2={-1} color="#facc15" />
                      <Arrow x1={4} y1={1} x2={1} y2={-1} color="#facc15" />
                      <Arrow x1={2} y1={4} x2={-1} y2={2} color="#facc15" />
                    </Grid>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VEKTOR KOMPOSISI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="vektor" icon={<Calculator className="w-5 h-5" />} color="#4ade80" title="🔗 Komposisi Translasi" />
            {open.includes("vektor") && (
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
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Hdr id="rangkuman" icon={<Target className="w-5 h-5" />} color="#f97316" title="🎯 Rangkuman" />
            {open.includes("rangkuman") && (
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
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TranslasiPage;
