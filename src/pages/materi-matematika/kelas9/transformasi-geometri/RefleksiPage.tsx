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

function Grid({ children, accent = "#34d399" }: { children?: React.ReactNode; accent?: string }) {
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

function DashLine({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke={color} strokeWidth="1.5" strokeDasharray="5,3" />;
}

/* ── Diagrams ── */
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
    <line x1={0} y1={S} x2={S} y2={0} stroke="#facc15" strokeWidth="2" strokeDasharray="6,3" />
    <text x={px(3.5)} y={py(3.8)} fontSize="8" fill="#fde68a">y=x</text>
    <Poly pts={[[1, 1], [4, 1], [3, 3]]} color="#22d3ee" fill="rgba(34,211,238,0.15)" label="△ABC" />
    <Poly pts={[[1, 1], [1, 4], [3, 3]]} color="#fb923c" fill="rgba(251,146,60,0.15)" label="△A'B'C'" />
  </Grid>
);

/* ── Page ── */
const RefleksiPage = () => {
  const [open, setOpen] = useState<string[]>(["intro", "rumus", "contoh1", "contoh2", "diag", "rangkuman"]);
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
