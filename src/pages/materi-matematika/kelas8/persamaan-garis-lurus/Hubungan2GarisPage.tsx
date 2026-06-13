import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, GitBranch } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const W = 180, H = 150, MX = 90, MY = 75, SC = 14;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSys = ({ children, label = "" }: { children?: React.ReactNode; label?: string }) => (
  <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ maxHeight: 170, background: "rgba(15,23,42,0.7)" }}>
    {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
      <g key={v}>
        <line x1={MX+v*SC*0.7} y1={4} x2={MX+v*SC*0.7} y2={H-4} stroke="#1e293b" strokeWidth="0.7" />
        <line x1={4} y1={MY-v*SC*0.7} x2={W-4} y2={MY-v*SC*0.7} stroke="#1e293b" strokeWidth="0.7" />
      </g>
    ))}
    <line x1={4} y1={MY} x2={W-4} y2={MY} stroke="#475569" strokeWidth="1.5" />
    <line x1={MX} y1={H-4} x2={MX} y2={4} stroke="#475569" strokeWidth="1.5" />
    <text x={W-10} y={MY+11} fill="#64748b" fontSize="8">x</text>
    <text x={MX+3} y={11} fill="#64748b" fontSize="8">y</text>
    <text x={MX+2} y={MY+10} fill="#475569" fontSize="7">O</text>
    {label && <text x={5} y={13} fill="#94a3b8" fontSize="8">{label}</text>}
    {children}
  </svg>
);

const Hubungan2GarisPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "sejajar", "tegaklurus", "berpotongan", "visual-trio", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const toggle = (s: string) => { playPopSound(); setExpandedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); };
  const SH = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );
  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <GitBranch className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">HUBUNGAN DUA GARIS</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Sejajar, Tegak Lurus, atau Berpotongan?</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Persamaan Garis Lurus · Materi Matematika</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Tiga Kemungkinan Hubungan Dua Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">Ketika dua garis lurus ada di bidang yang sama, hanya ada tiga kemungkinan hubungan di antara mereka. Hubungan ini ditentukan oleh nilai gradien masing-masing garis.</p>
                {/* 3-panel overview */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "SEJAJAR", icon: "∥", color: "#22d3ee", bg: "border-cyan-500/40 bg-cyan-900/20",
                      ket: "Tidak pernah bertemu"
                    },
                    {
                      label: "TEGAK LURUS", icon: "⊥", color: "#a78bfa", bg: "border-violet-500/40 bg-violet-900/20",
                      ket: "Berpotongan 90°"
                    },
                    {
                      label: "BERPOTONGAN", icon: "✕", color: "#4ade80", bg: "border-green-500/40 bg-green-900/20",
                      ket: "Bertemu di satu titik"
                    },
                  ].map(({ label, icon, color, bg, ket }) => (
                    <div key={label} className={`border ${bg} rounded-xl p-3 text-center`}>
                      <div className="text-3xl mb-1" style={{ color }}>{icon}</div>
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-xs text-white/40 mt-1">{ket}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEJAJAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="sejajar" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title="∥ Garis Sejajar" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-900/20 border border-cyan-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-cyan-300 mb-2 font-body">🎯 Syarat Garis Sejajar</p>
                  <div className="text-center">
                    <BlockMath math="m_1 = m_2 \quad \text{dan} \quad c_1 \neq c_2" />
                  </div>
                  <p className="text-xs text-white/60 text-center mt-1">Gradien sama, titik potong sb-y berbeda</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2">Visual: Dua garis sejajar</p>
                    <CoordSys label="ℓ₁ ∥ ℓ₂">
                      {/* l1: y=2x+1 */}
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      {/* l2: y=2x-3 */}
                      <polyline points={[[-1,-5],[0,-3],[1,-1],[2,1],[3,3],[4,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                      <text x={toX(-2.5)} y={toY(4)} fill="#22d3ee" fontSize="8">ℓ₁: y=2x+1</text>
                      <text x={toX(0)} y={toY(-4)} fill="#67e8f9" fontSize="8">ℓ₂: y=2x−3</text>
                    </CoordSys>
                    <p className="text-xs text-white/40 text-center mt-1">Keduanya m=2, tidak berpotongan</p>
                  </div>
                  <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2">Contoh pasangan sejajar:</p>
                    <div className="space-y-1.5 text-xs font-body">
                      {[
                        ["y = 3x + 1", "y = 3x − 4", "m = 3"],
                        ["y = −2x + 5", "y = −2x + 1", "m = −2"],
                        ["2x + y = 3", "2x + y = 7", "m = −2"],
                      ].map(([l1, l2, m]) => (
                        <div key={l1} className="bg-cyan-900/30 rounded-lg p-2">
                          <p className="text-cyan-300">{l1} ∥ {l2}</p>
                          <p className="text-white/40">{m} (sama)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TEGAK LURUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="tegaklurus" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="⊥ Garis Tegak Lurus (Saling Berpotongan 90°)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-900/20 border border-violet-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-300 mb-2 font-body">🎯 Syarat Garis Tegak Lurus</p>
                  <div className="text-center">
                    <BlockMath math="m_1 \times m_2 = -1" />
                    <p className="text-xs text-white/60 mt-1">Perkalian kedua gradien sama dengan −1</p>
                  </div>
                  <div className="bg-violet-900/30 rounded-lg p-3 mt-2">
                    <p className="text-xs text-violet-300 font-semibold mb-1">Artinya jika m₁ diketahui:</p>
                    <BlockMath math="m_2 = -\frac{1}{m_1}" />
                    <p className="text-xs text-white/50">m₂ adalah negatif kebalikan dari m₁</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2">Visual: Dua garis tegak lurus</p>
                    <CoordSys label="ℓ₁ ⊥ ℓ₂">
                      {/* l1: y=2x */}
                      <polyline points={[[-3,-6],[-2,-4],[-1,-2],[0,0],[1,2],[2,4],[3,6]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                      {/* l2: y=-0.5x+2 */}
                      <polyline points={[[-4,4],[-2,3],[0,2],[2,1],[4,0],[6,-1]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      {/* right angle marker at intersection */}
                      <rect x={toX(0.8)} y={toY(1.5)} width="8" height="8" fill="none" stroke="#facc15" strokeWidth="1" />
                      <text x={toX(-2)} y={toY(5)} fill="#a78bfa" fontSize="8">ℓ₁: y=2x</text>
                      <text x={toX(1)} y={toY(-2)} fill="#f472b6" fontSize="8">ℓ₂: y=−½x+2</text>
                    </CoordSys>
                    <p className="text-xs text-white/40 text-center mt-1">m₁×m₂ = 2×(−½) = −1 ✓</p>
                  </div>
                  <div className="bg-violet-900/10 border border-violet-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2">Contoh pasangan tegak lurus:</p>
                    <div className="space-y-1.5 text-xs font-body">
                      {[
                        { l1: "y = 3x + 1", l2: "y = −⅓x + 2", ket: "3 × (−⅓) = −1 ✓" },
                        { l1: "y = −4x", l2: "y = ¼x + 3", ket: "(−4) × ¼ = −1 ✓" },
                        { l1: "y = ½x − 1", l2: "y = −2x + 5", ket: "½ × (−2) = −1 ✓" },
                      ].map(({ l1, l2, ket }) => (
                        <div key={l1} className="bg-violet-900/30 rounded-lg p-2">
                          <p className="text-violet-300">{l1} ⊥ {l2}</p>
                          <p className="text-white/40">{ket}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BERPOTONGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="berpotongan" icon={<Layers className="w-5 h-5" />} iconColor="text-green-400" title="✕ Garis Berpotongan (Tidak Sejajar, Tidak Tegak Lurus)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">🎯 Syarat Garis Berpotongan</p>
                  <BlockMath math="m_1 \neq m_2" />
                  <p className="text-xs text-white/60 mt-1">Gradien berbeda → pasti berpotongan di suatu titik</p>
                  <p className="text-xs text-white/50 mt-1">Jika <InlineMath math="m_1 \times m_2 \neq -1" /> → berpotongan biasa (bukan 90°)</p>
                </div>
                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-300 mb-2">Cara menentukan titik potong:</p>
                  <p className="text-xs text-white/60 mb-2">Selesaikan sistem persamaan kedua garis (SPLDV)</p>
                  <div className="space-y-1 text-xs font-body text-white/70">
                    <p>ℓ₁: y = 2x + 1 dan ℓ₂: y = −x + 4</p>
                    <p>→ 2x + 1 = −x + 4</p>
                    <p>→ 3x = 3 → x = 1</p>
                    <p>→ y = 2(1) + 1 = 3</p>
                  </div>
                  <p className="text-green-300 font-bold text-xs mt-1">Titik potong: (1, 3)</p>
                </div>
              </div>
            )}
          </div>

          {/* GALERI VISUAL TIGA JENIS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="visual-trio" icon={<GitBranch className="w-5 h-5" />} iconColor="text-yellow-400" title="🎨 Galeri Visual: Perbandingan Tiga Hubungan Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Sejajar */}
                  <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2 text-center">∥ SEJAJAR</p>
                    <CoordSys label="m₁=m₂=2">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-5],[0,-3],[1,-1],[2,1],[3,3]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-cyan-300 font-mono">ℓ₁: y = 2x + 1</p>
                      <p className="text-cyan-200/60 font-mono">ℓ₂: y = 2x − 3</p>
                      <p className="text-white/40">m₁ = m₂ = 2</p>
                    </div>
                  </div>
                  {/* Tegak lurus */}
                  <div className="bg-slate-900/60 border border-violet-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2 text-center">⊥ TEGAK LURUS</p>
                    <CoordSys label="m₁·m₂=−1">
                      <polyline points={[[-3,-6],[-2,-4],[-1,-2],[0,0],[1,2],[2,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-4,2],[-2,1],[0,0],[2,-1],[4,-2]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      <rect x={toX(0)-5} y={toY(0)-5} width="8" height="8" fill="none" stroke="#facc15" strokeWidth="1.5" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-violet-300 font-mono">ℓ₁: y = 2x</p>
                      <p className="text-pink-400 font-mono">ℓ₂: y = −½x</p>
                      <p className="text-white/40">2 × (−½) = −1 ✓</p>
                    </div>
                  </div>
                  {/* Berpotongan */}
                  <div className="bg-slate-900/60 border border-green-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-300 mb-2 text-center">✕ BERPOTONGAN</p>
                    <CoordSys label="m₁≠m₂">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-3,6],[-2,5],[0,3],[1,2],[2,1],[3,0]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx={toX(-1)} cy={toY(-1)} r="5" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-green-300 font-mono">ℓ₁: y = 2x + 1</p>
                      <p className="text-yellow-300 font-mono">ℓ₂: y = −x + 2</p>
                      <p className="text-white/40">m₁=2 ≠ m₂=−1</p>
                    </div>
                  </div>
                </div>

                {/* Summary table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead><tr className="bg-slate-700/60">
                      <th className="border border-white/10 px-3 py-2 text-white">Hubungan</th>
                      <th className="border border-white/10 px-3 py-2 text-white">Syarat Gradien</th>
                      <th className="border border-white/10 px-3 py-2 text-white">Titik Potong</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Sejajar (∥)", "m₁ = m₂, c₁ ≠ c₂", "Tidak ada (tidak berpotongan)"],
                        ["Berimpit", "m₁ = m₂, c₁ = c₂", "Tak terhingga (garis sama)"],
                        ["Tegak Lurus (⊥)", "m₁ × m₂ = −1", "Satu titik (sudut 90°)"],
                        ["Berpotongan", "m₁ ≠ m₂", "Satu titik (sudut ≠ 90°)"],
                      ].map(([h,s,t],i) => (
                        <tr key={i} className={i%2===0?"bg-slate-800/30":"bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{h}</td>
                          <td className="border border-white/10 px-3 py-2 text-yellow-300 font-mono">{s}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{t}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan hubungan antara garis <InlineMath math="\ell_1: y = 3x - 5" /> dan <InlineMath math="\ell_2: y = 3x + 2" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Identifikasi gradien:</p>
                    <p className="text-white/70 text-xs">ℓ₁: y = 3x − 5 → m₁ = 3</p>
                    <p className="text-white/70 text-xs">ℓ₂: y = 3x + 2 → m₂ = 3</p>
                    <p className="text-white/70 text-xs mt-1">m₁ = m₂ = 3, tetapi c₁ = −5 ≠ c₂ = 2</p>
                  </div>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-3">
                    <CoordSys label="ℓ₁ ∥ ℓ₂">
                      <polyline points={[[-1,-8],[0,-5],[1,-2],[2,1],[3,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-1],[0,2],[1,5],[2,8]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                      <text x={toX(1)} y={toY(3)} fill="#22d3ee" fontSize="8">ℓ₁</text>
                      <text x={toX(-0.5)} y={toY(4)} fill="#67e8f9" fontSize="8">ℓ₂</text>
                    </CoordSys>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">✅ ℓ₁ ∥ ℓ₂ (SEJAJAR) karena m₁ = m₂ = 3 dan c berbeda</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-yellow-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis yang melalui titik <InlineMath math="(2, 5)" /> dan tegak lurus dengan garis <InlineMath math="y = 4x - 3" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Langkah 1 — Cari gradien tegak lurus:</p>
                    <p className="text-white/70 text-xs">m₁ = 4 (dari y = 4x − 3)</p>
                    <BlockMath math="m_2 = -\frac{1}{m_1} = -\frac{1}{4}" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Tentukan persamaan:</p>
                    <BlockMath math="y - 5 = -\frac{1}{4}(x - 2)" />
                    <BlockMath math="y = -\frac{1}{4}x + \frac{1}{2} + 5 = -\frac{1}{4}x + \frac{11}{2}" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik kedua garis:</p>
                    <CoordSys label="⊥ di (2,5)">
                      <polyline points={[[-1,-7],[0,-3],[1,1],[2,5],[3,9]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                      <polyline points={[[-4,6.5],[-2,6],[0,5.5],[2,5],[4,4.5],[6,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                      <circle cx={toX(2)} cy={toY(5)} r="5" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5" />
                      <text x={toX(2)+5} y={toY(5)-5} fill="#f87171" fontSize="8">(2,5)</text>
                      <rect x={toX(2)-2} y={toY(5)-2} width="7" height="7" fill="none" stroke="#facc15" strokeWidth="1" />
                    </CoordSys>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">✅ Persamaan: <InlineMath math="y = -\frac{1}{4}x + \frac{11}{2}" /> atau <InlineMath math="x + 4y - 22 = 0" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Diketahui tiga garis: <InlineMath math="\ell_1: 2x - y + 4 = 0" />, <InlineMath math="\ell_2: x + 2y - 6 = 0" />, <InlineMath math="\ell_3: 4x - 2y + 1 = 0" />. Tentukan hubungan antara: a) ℓ₁ dan ℓ₂, b) ℓ₁ dan ℓ₃, c) ℓ₂ dan ℓ₃!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Cari gradien masing-masing (ubah ke y = mx + c):</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-cyan-900/20 rounded-lg p-2">
                        <p className="text-cyan-300 font-semibold">ℓ₁: 2x − y + 4 = 0</p>
                        <p className="text-white/70">y = 2x + 4 → <strong className="text-yellow-300">m₁ = 2</strong></p>
                      </div>
                      <div className="bg-violet-900/20 rounded-lg p-2">
                        <p className="text-violet-300 font-semibold">ℓ₂: x + 2y − 6 = 0</p>
                        <p className="text-white/70">2y = −x + 6 → y = −½x + 3 → <strong className="text-yellow-300">m₂ = −½</strong></p>
                      </div>
                      <div className="bg-orange-900/20 rounded-lg p-2">
                        <p className="text-orange-300 font-semibold">ℓ₃: 4x − 2y + 1 = 0</p>
                        <p className="text-white/70">2y = 4x + 1 → y = 2x + ½ → <strong className="text-yellow-300">m₃ = 2</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2">Analisis hubungan:</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="bg-green-900/20 rounded-lg p-2">
                        <p className="text-green-300 font-bold">a) ℓ₁ ⊥ ℓ₂:</p>
                        <p className="text-white/60">m₁ × m₂ = 2 × (−½) = −1 ✓ → <strong className="text-green-300">TEGAK LURUS</strong></p>
                      </div>
                      <div className="bg-cyan-900/20 rounded-lg p-2">
                        <p className="text-cyan-300 font-bold">b) ℓ₁ ∥ ℓ₃:</p>
                        <p className="text-white/60">m₁ = m₃ = 2, c₁ = 4 ≠ c₃ = ½ → <strong className="text-cyan-300">SEJAJAR</strong></p>
                      </div>
                      <div className="bg-orange-900/20 rounded-lg p-2">
                        <p className="text-orange-300 font-bold">c) ℓ₂ dan ℓ₃:</p>
                        <p className="text-white/60">m₂ = −½ ≠ m₃ = 2, m₂×m₃ = −1 → <strong className="text-orange-300">TEGAK LURUS</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-300">✅ ℓ₁⊥ℓ₂, ℓ₁∥ℓ₃, ℓ₂⊥ℓ₃. Tiga garis dengan relasi saling tegak lurus dan sejajar!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Sejajar (∥)", "m₁ = m₂ dan c₁ ≠ c₂"],
                    ["Tegak Lurus (⊥)", "m₁ × m₂ = −1 (atau m₂ = −1/m₁)"],
                    ["Berpotongan", "m₁ ≠ m₂ (dan m₁ × m₂ ≠ −1)"],
                    ["Berimpit", "m₁ = m₂ dan c₁ = c₂ (garis sama persis)"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Ingat!</strong> Gradien tegak lurus adalah negatif kebalikan. m₁ = 3 → m₂ = −1/3. m₁ = −2/5 → m₂ = 5/2. Cukup balik pecahannya dan ubah tandanya!</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};
export default Hubungan2GarisPage;
