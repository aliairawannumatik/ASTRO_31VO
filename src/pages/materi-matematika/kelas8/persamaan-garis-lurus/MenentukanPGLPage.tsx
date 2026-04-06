import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Edit } from "lucide-react";
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

const MenentukanPGLPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus1", "rumus2", "rumus3", "peta-rumus", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const toggle = (s: string) => { playPopSound(); setExpandedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); };
  const SH = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
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
        <Edit className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">MENENTUKAN PERSAMAAN GARIS LURUS</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Bangun Persamaan dari Informasi yang Ada!</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Persamaan Garis Lurus · Materi Matematika</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Tiga Skenario Menentukan Persamaan Garis" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">Bergantung pada informasi yang diberikan, ada tiga skenario utama untuk menentukan persamaan garis lurus. Pilih rumus yang sesuai dengan data yang tersedia!</p>
                {/* Peta skenario */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-cyan-300 uppercase mb-3">🗺️ Peta Skenario Penentuan Persamaan Garis</p>
                  <div className="space-y-2">
                    {[
                      { no: "1", info: "Diketahui gradien (m) dan titik potong sb-y (c)", rumus: "y = mx + c", color: "border-cyan-500/40 bg-cyan-900/10" },
                      { no: "2", info: "Diketahui gradien (m) dan satu titik (x₁, y₁)", rumus: "y − y₁ = m(x − x₁)", color: "border-violet-500/40 bg-violet-900/10" },
                      { no: "3", info: "Diketahui dua titik (x₁, y₁) dan (x₂, y₂)", rumus: "y − y₁ / y₂ − y₁ = x − x₁ / x₂ − x₁", color: "border-orange-500/40 bg-orange-900/10" },
                    ].map(({ no, info, rumus, color }) => (
                      <div key={no} className={`border ${color} rounded-xl p-3 flex gap-3 text-sm font-body`}>
                        <div className="bg-white/10 rounded-full w-7 h-7 shrink-0 flex items-center justify-center font-bold text-white font-display">{no}</div>
                        <div>
                          <p className="text-white/80 text-xs">Info: <span className="text-white font-semibold">{info}</span></p>
                          <p className="text-cyan-300 font-mono text-xs mt-1">Rumus: {rumus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SKENARIO 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rumus1" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Skenario 1: Diketahui m dan c (Titik Potong sb-y)" />
            {expandedSections.includes("rumus1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-900/20 border border-cyan-500/40 rounded-xl p-4 text-center">
                  <BlockMath math="y = mx + c" />
                  <p className="text-xs text-white/60 mt-1">Langsung substitusi nilai m dan c yang diketahui</p>
                </div>
                {/* Visual */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-cyan-300 mb-2">Contoh: m = 2, c = 3 → y = 2x + 3</p>
                  <CoordSys label="y = 2x + 3">
                    <polyline points={[[-3,-3],[-2,-1],[-1,1],[0,3],[1,5],[2,7]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx={toX(0)} cy={toY(3)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                    <text x={toX(0)+5} y={toY(3)-4} fill="#facc15" fontSize="8">c = 3</text>
                  </CoordSys>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Skenario termudah!</strong> Titik potong sb-y langsung menjadi nilai c dalam persamaan y = mx + c.</p>
                </div>
              </div>
            )}
          </div>

          {/* SKENARIO 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rumus2" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📐 Skenario 2: Diketahui m dan Satu Titik (x₁, y₁)" />
            {expandedSections.includes("rumus2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-900/20 border border-violet-500/40 rounded-xl p-4 text-center">
                  <BlockMath math="y - y_1 = m(x - x_1)" />
                  <p className="text-xs text-white/60 mt-1">Rumus titik-gradien (point-slope form)</p>
                </div>
                {/* Step visual */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-violet-300 mb-2">Langkah-langkah:</p>
                  <div className="space-y-2">
                    {[
                      { n:"1", t:"Substitusi m, x₁, y₁ ke rumus", c:"border-violet-500/30 bg-violet-900/10" },
                      { n:"2", t:"Ekspansi ruas kanan: y − y₁ = mx − mx₁", c:"border-cyan-500/30 bg-cyan-900/10" },
                      { n:"3", t:"Pindahkan y₁ ke ruas kanan: y = mx − mx₁ + y₁", c:"border-green-500/30 bg-green-900/10" },
                    ].map(({ n,t,c }) => (
                      <div key={n} className={`border ${c} rounded-lg p-2 flex gap-2 text-xs font-body`}>
                        <span className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center font-bold text-white shrink-0">{n}</span>
                        <span className="text-white/70">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Example visual */}
                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-violet-300 mb-2">Contoh: m = 3, titik (1, 2) → y = 3x − 1</p>
                  <CoordSys label="y = 3x − 1">
                    <polyline points={[[-2,-7],[-1,-4],[0,-1],[1,2],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx={toX(1)} cy={toY(2)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                    <text x={toX(1)+5} y={toY(2)-4} fill="#facc15" fontSize="8">(1,2)</text>
                  </CoordSys>
                </div>
              </div>
            )}
          </div>

          {/* SKENARIO 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rumus3" icon={<Layers className="w-5 h-5" />} iconColor="text-orange-400" title="📐 Skenario 3: Diketahui Dua Titik" />
            {expandedSections.includes("rumus3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-900/20 border border-orange-500/40 rounded-xl p-4 text-center">
                  <BlockMath math="\frac{y - y_1}{y_2 - y_1} = \frac{x - x_1}{x_2 - x_1}" />
                  <p className="text-xs text-white/60 mt-1">Rumus dua titik (two-point form)</p>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-orange-300 mb-2">Strategi Alternatif (Lebih Mudah):</p>
                  <div className="space-y-1 text-xs font-body text-white/70">
                    <p>1. Hitung dulu gradien: <InlineMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" /></p>
                    <p>2. Pilih salah satu titik, masukkan ke skenario 2</p>
                    <p>3. Selesaikan untuk mendapat bentuk y = mx + c</p>
                  </div>
                </div>
                {/* Example visual */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-orange-300 mb-2">Contoh: titik A(0, 1) dan B(3, 7) → y = 2x + 1</p>
                  <CoordSys label="Melalui A(0,1) dan B(3,7)">
                    <polyline points={[[-1,-1],[0,1],[1,3],[2,5],[3,7],[4,9]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
                    {[[0,1],[3,7]].map(([x,y]) => (
                      <g key={`${x},${y}`}>
                        <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                        <text x={toX(x)+5} y={toY(y)-4} fill="#facc15" fontSize="8">({x},{y})</text>
                      </g>
                    ))}
                  </CoordSys>
                </div>
              </div>
            )}
          </div>

          {/* PETA RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="peta-rumus" icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400" title="🗺️ Peta Lengkap: Pilih Rumus yang Tepat!" />
            {expandedSections.includes("peta-rumus") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-4">
                  <svg viewBox="0 0 320 200" className="w-full" style={{ maxHeight: 200 }}>
                    {/* Start */}
                    <rect x="110" y="5" width="100" height="30" rx="6" fill="#1e3a5f" stroke="#22d3ee" strokeWidth="1.5" />
                    <text x="160" y="25" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">INFO GARIS?</text>
                    {/* Arrow down */}
                    <line x1="160" y1="35" x2="160" y2="55" stroke="#475569" strokeWidth="1.5" />
                    <polygon points="155,53 165,53 160,60" fill="#475569" />
                    {/* 3 branches */}
                    <line x1="160" y1="60" x2="55" y2="85" stroke="#22d3ee" strokeWidth="1.2" />
                    <line x1="160" y1="60" x2="160" y2="85" stroke="#a78bfa" strokeWidth="1.2" />
                    <line x1="160" y1="60" x2="265" y2="85" stroke="#fb923c" strokeWidth="1.2" />
                    {/* Labels on branches */}
                    <text x="90" y="76" textAnchor="middle" fill="#22d3ee" fontSize="8">m dan c</text>
                    <text x="160" y="76" textAnchor="middle" fill="#a78bfa" fontSize="8">m dan 1 titik</text>
                    <text x="240" y="76" textAnchor="middle" fill="#fb923c" fontSize="8">2 titik</text>
                    {/* Box 1 */}
                    <rect x="5" y="88" width="100" height="40" rx="5" fill="#0c2340" stroke="#22d3ee" strokeWidth="1.2" />
                    <text x="55" y="104" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold">y = mx + c</text>
                    <text x="55" y="117" textAnchor="middle" fill="#7dd3fc" fontSize="7">Langsung substitusi</text>
                    {/* Box 2 */}
                    <rect x="110" y="88" width="100" height="40" rx="5" fill="#1a0b3a" stroke="#a78bfa" strokeWidth="1.2" />
                    <text x="160" y="104" textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="bold">y−y₁ = m(x−x₁)</text>
                    <text x="160" y="117" textAnchor="middle" fill="#c4b5fd" fontSize="7">Titik-gradien</text>
                    {/* Box 3 */}
                    <rect x="215" y="88" width="100" height="40" rx="5" fill="#1c0d00" stroke="#fb923c" strokeWidth="1.2" />
                    <text x="265" y="104" textAnchor="middle" fill="#fb923c" fontSize="7" fontWeight="bold">Hitung m dulu,</text>
                    <text x="265" y="116" textAnchor="middle" fill="#fb923c" fontSize="7" fontWeight="bold">lalu skenario 2</text>
                    {/* All converge to result */}
                    <line x1="55" y1="128" x2="55" y2="155" stroke="#475569" strokeWidth="1" />
                    <line x1="160" y1="128" x2="160" y2="155" stroke="#475569" strokeWidth="1" />
                    <line x1="265" y1="128" x2="265" y2="155" stroke="#475569" strokeWidth="1" />
                    <line x1="55" y1="155" x2="265" y2="155" stroke="#475569" strokeWidth="1" />
                    <line x1="160" y1="155" x2="160" y2="168" stroke="#475569" strokeWidth="1" />
                    <polygon points="155,166 165,166 160,173" fill="#4ade80" />
                    <rect x="100" y="173" width="120" height="26" rx="5" fill="#064e3b" stroke="#4ade80" strokeWidth="1.5" />
                    <text x="160" y="190" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">y = mx + c ✅</text>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis dengan gradien <InlineMath math="m = 4" /> yang melalui titik <InlineMath math="(0, -3)" />.</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Diketahui titik (0, −3) → ini titik potong sb-y, jadi c = −3</p>
                    <BlockMath math="y = mx + c = 4x + (-3) = 4x - 3" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik y = 4x − 3:</p>
                    <CoordSys label="y = 4x − 3">
                      <polyline points={[[-2,-11],[-1,-7],[0,-3],[1,1],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx={toX(0)} cy={toY(-3)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                      <text x={toX(0)+5} y={toY(-3)-4} fill="#facc15" fontSize="8">(0,−3)</text>
                    </CoordSys>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">✅ Persamaan: y = 4x − 3</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-yellow-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis bergradien <InlineMath math="-\frac{1}{2}" /> yang melalui titik <InlineMath math="(4, 1)" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Gunakan rumus skenario 2: y − y₁ = m(x − x₁)</p>
                    <BlockMath math="y - 1 = -\frac{1}{2}(x - 4)" />
                    <BlockMath math="y - 1 = -\frac{1}{2}x + 2" />
                    <BlockMath math="y = -\frac{1}{2}x + 3" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2 text-xs">Grafik y = −½x + 3:</p>
                    <CoordSys label="y = −½x + 3">
                      <polyline points={[[-4,5],[-2,4],[0,3],[2,2],[4,1],[6,0]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                      {[[0,3],[4,1]].map(([x,y]) => (
                        <g key={`${x},${y}`}>
                          <circle cx={toX(x)} cy={toY(y)} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                          <text x={toX(x)+5} y={toY(y)-4} fill="#22d3ee" fontSize="8">({x},{y})</text>
                        </g>
                      ))}
                    </CoordSys>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">✅ Persamaan: <InlineMath math="y = -\frac{1}{2}x + 3" /> atau <InlineMath math="x + 2y - 6 = 0" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis yang melalui titik <InlineMath math="A(-2, 5)" /> dan <InlineMath math="B(4, -1)" />. Nyatakan dalam bentuk <InlineMath math="ax + by + c = 0" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Langkah 1 — Hitung gradien:</p>
                    <BlockMath math="m = \frac{-1-5}{4-(-2)} = \frac{-6}{6} = -1" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Gunakan titik A(−2, 5):</p>
                    <BlockMath math="y - 5 = -1(x - (-2))" />
                    <BlockMath math="y - 5 = -x - 2" />
                    <BlockMath math="y = -x + 3" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">Langkah 3 — Bentuk umum:</p>
                    <BlockMath math="y = -x + 3 \implies x + y - 3 = 0" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik melalui A(−2,5) dan B(4,−1):</p>
                    <CoordSys label="x + y − 3 = 0">
                      <polyline points={[[-2,5],[-1,4],[0,3],[1,2],[2,1],[3,0],[4,-1]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      {[[-2,5],[4,-1]].map(([x,y]) => (
                        <g key={`${x},${y}`}>
                          <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                          <text x={toX(x)+5} y={toY(y)-4} fill="#facc15" fontSize="8">({x},{y})</text>
                        </g>
                      ))}
                    </CoordSys>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-300">✅ Persamaan: y = −x + 3 atau x + y − 3 = 0. Gradien m = −1 (turun 45°)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Skenario 1 (m & c)", "Langsung pakai y = mx + c"],
                    ["Skenario 2 (m & 1 titik)", "y − y₁ = m(x − x₁)"],
                    ["Skenario 3 (2 titik)", "Hitung m dulu, lalu pakai skenario 2"],
                    ["Bentuk Umum", "ax + by + c = 0 (pindahkan semua ke satu sisi)"],
                    ["Verifikasi", "Substitusi koordinat titik ke persamaan, harus memenuhi!"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Selalu verifikasi!</strong> Setelah mendapat persamaan garis, cek dengan mensubstitusi koordinat titik yang diketahui. Jika benar, hasilnya harus memenuhi (sama kiri-kanan).</p>
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
export default MenentukanPGLPage;
