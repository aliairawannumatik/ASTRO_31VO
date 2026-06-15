import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import GeoGebraGrapher from "@/components/GeoGebraGrapher";

/* ─── SVG helpers ─── */
const W = 200, H = 160, MX = 100, MY = 80, SC = 16;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSystem = ({ children, w = W, h = H, label = "" }: { children?: React.ReactNode; w?: number; h?: number; label?: string }) => {
  const mx = w / 2, my = h / 2;
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-xl" style={{ maxHeight: 180, background: "rgba(15,23,42,0.7)" }}>
      {/* grid */}
      {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
        <g key={v}>
          <line x1={mx + v*(w/12)} y1={4} x2={mx + v*(w/12)} y2={h-4} stroke="#1e293b" strokeWidth="1" />
          <line x1={4} y1={my - v*(h/10)} x2={w-4} y2={my - v*(h/10)} stroke="#1e293b" strokeWidth="1" />
        </g>
      ))}
      {/* axes */}
      <line x1={4} y1={my} x2={w-4} y2={my} stroke="#475569" strokeWidth="1.5" markerEnd={`url(#arr-${uid})`} />
      <line x1={mx} y1={h-4} x2={mx} y2={4} stroke="#475569" strokeWidth="1.5" markerEnd={`url(#arr-${uid})`} />
      <defs>
        <marker id={`arr-${uid}`} markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#475569" />
        </marker>
      </defs>
      <text x={w-10} y={my+12} fill="#64748b" fontSize="9">x</text>
      <text x={mx+4} y={12} fill="#64748b" fontSize="9">y</text>
      {/* origin */}
      <text x={mx+3} y={my+11} fill="#475569" fontSize="7">O</text>
      {label && <text x={6} y={14} fill="#94a3b8" fontSize="8">{label}</text>}
      {children}
    </svg>
  );
};

const GrafikPGLPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "bentuk", "titik-potong", "visual-lines", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const toggleSection = (s: string) => { playPopSound(); setExpandedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); };
  const SH = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
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
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">GRAFIK PERSAMAAN GARIS LURUS</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Gambar Garis Lurus di Bidang Koordinat!</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Persamaan Garis Lurus · Materi Matematika</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Garis Lurus — Ada di Mana-mana!" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Rel kereta api, pinggir buku, garis horizon pantai — semuanya membentuk <strong className="text-cyan-300">garis lurus</strong>. Dalam matematika, persamaan garis lurus mendeskripsikan semua garis tersebut dengan sebuah persamaan sederhana yang melibatkan variabel <InlineMath math="x" /> dan <InlineMath math="y" />.
                </p>
                <figure className="flex flex-col items-center gap-2">
                  <img
                    src="/image_1781556662891.png"
                    alt="Garis horizon laut sebagai contoh nyata garis lurus"
                    className="w-full rounded-xl object-cover max-h-80 border border-cyan-500/20"
                  />
                  <figcaption className="text-xs text-white/50 font-body text-center italic">
                    Garis horizon di lautan — contoh nyata garis lurus yang dapat dideskripsikan dengan persamaan matematika
                  </figcaption>
                </figure>
                {/* 4-panel visual intro */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "y = 2x + 1", color: "#22d3ee", pts: [[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]], desc: "Naik ke kanan" },
                    { label: "y = -x + 2", color: "#a78bfa", pts: [[-2,4],[-1,3],[0,2],[1,1],[2,0],[3,-1]], desc: "Turun ke kanan" },
                    { label: "y = 3", color: "#4ade80", pts: [[-3,3],[-1,3],[0,3],[1,3],[3,3]], desc: "Horizontal" },
                    { label: "x = 2", color: "#fb923c", pts: [[2,-4],[2,-2],[2,0],[2,2],[2,4]], desc: "Vertikal" },
                  ].map(({ label, color, pts, desc }) => (
                    <div key={label} className="bg-slate-900/60 border border-white/10 rounded-xl p-2">
                      <CoordSystem w={140} h={120} label={label}>
                        <polyline points={pts.map(([x,y])=>`${70+x*14},${60-y*11}`).join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                        {pts.map(([x,y]) => <circle key={x} cx={70+x*14} cy={60-y*11} r="2.5" fill={color} />)}
                      </CoordSystem>
                      <p className="text-xs text-center mt-1" style={{ color }}>{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200"><strong>💡 Fun fact:</strong> Setiap persamaan linear (pangkat satu) pasti menghasilkan grafik garis lurus. Sebaliknya, setiap garis lurus bisa ditulis sebagai persamaan linear!</p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Bentuk Umum Persamaan Garis Lurus" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-3">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">Ada tiga bentuk utama persamaan garis lurus yang sering digunakan:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { nama: "Bentuk Slope-Intercept", rumus: "y = mx + c", ket: "m = gradien, c = titik potong sumbu-y", color: "bg-cyan-900/40 border-cyan-500/40" },
                      { nama: "Bentuk Umum", rumus: "ax + by + c = 0", ket: "a, b, c = konstanta bilangan real", color: "bg-violet-900/40 border-violet-500/40" },
                      { nama: "Bentuk Intersep", rumus: "x/a + y/b = 1", ket: "a = titik potong sb-x, b = titik potong sb-y", color: "bg-green-900/40 border-green-500/40" },
                    ].map(({ nama, rumus, ket, color }) => (
                      <div key={nama} className={`${color} border rounded-xl p-3`}>
                        <p className="text-xs text-white/60 font-body">{nama}</p>
                        <div className="my-1"><BlockMath math={rumus} /></div>
                        <p className="text-xs text-white/50">{ket}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anatomy visual */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-cyan-300 mb-3">🔬 Anatomi Persamaan y = mx + c</p>
                  <div className="relative flex flex-col items-center">
                    <div className="text-3xl font-bold font-mono text-white tracking-widest">y = mx + c</div>
                    <div className="flex gap-8 mt-3 text-xs font-body">
                      <div className="text-center">
                        <div className="w-1 h-6 bg-yellow-400 mx-auto mb-1" />
                        <span className="text-yellow-300 font-bold">m</span>
                        <p className="text-white/50 text-xs">Gradien/kemiringan</p>
                      </div>
                      <div className="text-center">
                        <div className="w-1 h-6 bg-cyan-400 mx-auto mb-1" />
                        <span className="text-cyan-300 font-bold">c</span>
                        <p className="text-white/50 text-xs">Titik potong sb-y</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead><tr className="bg-cyan-900/40">
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Persamaan</th>
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Gradien (m)</th>
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Potong sb-x</th>
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Potong sb-y (c)</th>
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Arah</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["y = 3x + 2",  "3",          "(-⅔, 0)",  "(0, 2)",  "↗ Naik"],
                        ["y = -2x + 5", "-2",         "(5/2, 0)", "(0, 5)",  "↘ Turun"],
                        ["x = -5",      "∞ tak hingga", "(-5, 0)", "—",       "↕ Vertikal"],
                        ["y = 4",       "0",           "—",        "(0, 4)",  "→ Horizontal"],
                      ].map(([p,m,sx,sy,a],i) => (
                        <tr key={i} className={i%2===0?"bg-slate-800/30":"bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-mono">{p}</td>
                          <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center">{m}</td>
                          <td className="border border-white/10 px-3 py-2 text-orange-300 text-center">{sx}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300 text-center">{sy}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60 text-center">{a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── GeoGebra-style interactive graphing tool ── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🖥️</span>
                    <p className="text-sm font-bold text-cyan-300 font-body">Laboratorium Grafik Interaktif</p>
                    <span className="text-xs bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full">GeoGebra-style</span>
                  </div>
                  <p className="text-xs text-white/60 font-body leading-relaxed">
                    Ketik persamaan apa saja di panel kanan — grafiknya langsung tergambar! Gunakan scroll untuk zoom, drag untuk geser bidang, dan hover untuk melihat koordinat.
                  </p>
                  <GeoGebraGrapher />
                  <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                    <p className="text-xs text-violet-200 font-body">
                      <strong>💡 Coba masukkan:</strong> <span className="font-mono">y = 3x + 2</span> lalu <span className="font-mono">3x - 2y + 6 = 0</span> lalu <span className="font-mono">x/4 + y/3 = 1</span> — perhatikan titik potong sumbu dan perpotongan antar garis!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TITIK POTONG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="titik-potong" icon={<BookOpen className="w-5 h-5" />} iconColor="text-orange-400" title="📌 Titik Potong Sumbu dan Cara Menggambar" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-cyan-900/20 border border-cyan-500/40 rounded-xl p-4">
                    <p className="text-sm font-bold text-cyan-300 mb-2">📍 Titik Potong Sumbu-x</p>
                    <p className="text-xs text-white/70 mb-2">Syarat: nilai <strong className="text-white">y = 0</strong></p>
                    <div className="bg-cyan-900/30 rounded-lg p-2 text-xs text-center">
                      <BlockMath math="y = 0 \Rightarrow ax + b(0) = c" />
                      <BlockMath math="x = \frac{c}{a}" />
                    </div>
                    <p className="text-xs text-white/50 mt-2 text-center">Titik: <InlineMath math="\left(\frac{c}{a},\ 0\right)" /></p>
                  </div>
                  <div className="bg-violet-900/20 border border-violet-500/40 rounded-xl p-4">
                    <p className="text-sm font-bold text-violet-300 mb-2">📍 Titik Potong Sumbu-y</p>
                    <p className="text-xs text-white/70 mb-2">Syarat: nilai <strong className="text-white">x = 0</strong></p>
                    <div className="bg-violet-900/30 rounded-lg p-2 text-xs text-center">
                      <BlockMath math="x = 0 \Rightarrow a(0) + by = c" />
                      <BlockMath math="y = \frac{c}{b}" />
                    </div>
                    <p className="text-xs text-white/50 mt-2 text-center">Titik: <InlineMath math="\left(0,\ \frac{c}{b}\right)" /></p>
                  </div>
                </div>

                {/* Step-by-step cara menggambar */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-bold text-white mb-3">🖊️ Langkah Menggambar Garis (Metode 2 Titik)</p>
                  <div className="space-y-2">
                    {[
                      { n:"1", t:"Cari titik potong sumbu-x", d:"Substitusi y=0, hitung x → titik (x₀, 0)", c:"border-cyan-500/30 bg-cyan-900/10" },
                      { n:"2", t:"Cari titik potong sumbu-y", d:"Substitusi x=0, hitung y → titik (0, y₀)", c:"border-violet-500/30 bg-violet-900/10" },
                      { n:"3", t:"Plot kedua titik", d:"Tandai titik (x₀, 0) dan (0, y₀) di bidang koordinat", c:"border-green-500/30 bg-green-900/10" },
                      { n:"4", t:"Tarik garis lurus", d:"Hubungkan kedua titik dan perpanjang ke kedua arah", c:"border-orange-500/30 bg-orange-900/10" },
                    ].map(({ n,t,d,c }) => (
                      <div key={n} className={`border ${c} rounded-lg p-3 flex gap-3 text-sm font-body`}>
                        <span className="font-display font-bold text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center shrink-0">{n}</span>
                        <div><p className="text-white font-semibold">{t}</p><p className="text-white/60 text-xs">{d}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GALERI VISUAL GARIS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="visual-lines" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-green-400" title="🎨 Galeri Visual: Berbagai Jenis Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { eq: "y = x", color: "#22d3ee", pts: [[-4,-4],[-2,-2],[0,0],[2,2],[4,4]], note: "m=1, c=0" },
                    { eq: "y = 2x − 3", color: "#a78bfa", pts: [[-1,-5],[0,-3],[1,-1],[2,1],[3,3]], note: "m=2, c=−3" },
                    { eq: "y = −x + 4", color: "#fb923c", pts: [[-1,5],[0,4],[1,3],[2,2],[3,1],[4,0]], note: "m=−1, c=4" },
                    { eq: "y = ½x + 1", color: "#4ade80", pts: [[-4,-1],[-2,0],[0,1],[2,2],[4,3]], note: "m=½, c=1" },
                    { eq: "y = −2x", color: "#f472b6", pts: [[-2,4],[-1,2],[0,0],[1,-2],[2,-4]], note: "m=−2, c=0" },
                    { eq: "y = 5", color: "#facc15", pts: [[-4,5],[-2,5],[0,5],[2,5],[4,5]], note: "m=0 (horizontal)" },
                  ].map(({ eq, color, pts, note }) => (
                    <div key={eq} className="bg-slate-900/70 border border-white/10 rounded-xl p-2">
                      <CoordSystem w={130} h={110} label={eq}>
                        <polyline
                          points={pts.map(([x,y])=>`${65+x*12},${55-y*9}`).join(' ')}
                          fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
                        />
                        {pts.slice(1,-1).map(([x,y],i) => <circle key={i} cx={65+x*12} cy={55-y*9} r="2.5" fill={color} opacity="0.8" />)}
                      </CoordSystem>
                      <p className="text-center text-xs mt-1 text-white/40">{note}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200"><strong>💡 Perhatikan:</strong> Gradien positif → garis naik dari kiri ke kanan. Gradien negatif → garis turun dari kiri ke kanan. Gradien nol → garis mendatar (horizontal).</p>
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
                  <p className="text-sm text-white/85 font-body">Gambarlah grafik garis <InlineMath math="y = 2x - 4" />! Tentukan titik potong dengan sumbu-x dan sumbu-y terlebih dahulu.</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-cyan-300 font-body">🔍 Pembahasan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1 text-xs">Titik potong sumbu-x (y = 0):</p>
                      <BlockMath math="0 = 2x - 4 \Rightarrow x = 2" />
                      <p className="text-green-300 text-xs font-bold">Titik: (2, 0)</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1 text-xs">Titik potong sumbu-y (x = 0):</p>
                      <BlockMath math="y = 2(0) - 4 = -4" />
                      <p className="text-green-300 text-xs font-bold">Titik: (0, -4)</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik y = 2x − 4:</p>
                    <CoordSystem w={W} h={H} label="y = 2x − 4">
                      <polyline
                        points={[[-2,-8],[-1,-6],[0,-4],[1,-2],[2,0],[3,2],[4,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')}
                        fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"
                      />
                      {/* Key points */}
                      {[[2,0],[0,-4]].map(([x,y]) => (
                        <g key={`${x},${y}`}>
                          <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                          <text x={toX(x)+6} y={toY(y)-4} fill="#fde047" fontSize="8">({x},{y})</text>
                        </g>
                      ))}
                    </CoordSystem>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300 font-body">✅ Titik potong sb-x = (2, 0), sb-y = (0, −4). Garis naik karena m = 2 &gt; 0</p>
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
                  <p className="text-sm text-white/85 font-body">Persamaan garis: <InlineMath math="3x - 2y + 6 = 0" />. Tentukan: a) titik potong sumbu-x dan sumbu-y, b) gambarkan grafiknya!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-cyan-300 font-body">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">Ubah ke bentuk y = mx + c terlebih dahulu:</p>
                      <BlockMath math="3x - 2y + 6 = 0" />
                      <BlockMath math="-2y = -3x - 6" />
                      <BlockMath math="y = \frac{3}{2}x + 3" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-800/50 rounded-lg p-2 text-xs">
                        <p className="text-cyan-300 font-semibold mb-1">Potong sb-x (y=0):</p>
                        <BlockMath math="0 = \frac{3}{2}x + 3 \Rightarrow x = -2" />
                        <p className="text-green-300 font-bold">(-2, 0)</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-xs">
                        <p className="text-violet-300 font-semibold mb-1">Potong sb-y (x=0):</p>
                        <BlockMath math="y = \frac{3}{2}(0) + 3 = 3" />
                        <p className="text-green-300 font-bold">(0, 3)</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik 3x − 2y + 6 = 0:</p>
                      <CoordSystem w={W} h={H} label="3x−2y+6=0">
                        <polyline
                          points={[[-4,-3],[-2,0],[0,3],[2,6]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')}
                          fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"
                        />
                        {[[-2,0],[0,3]].map(([x,y]) => (
                          <g key={`${x},${y}`}>
                            <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                            <text x={toX(x)+6} y={toY(y)-4} fill="#fde047" fontSize="8">({x},{y})</text>
                          </g>
                        ))}
                      </CoordSystem>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="text-sm font-bold text-yellow-300 font-body">✅ Sb-x = (−2, 0), Sb-y = (0, 3). Gradien m = 3/2, garis naik</p>
                    </div>
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
                  <p className="text-sm text-white/85 font-body">Dua garis <InlineMath math="\ell_1: 2x + y - 6 = 0" /> dan <InlineMath math="\ell_2: x - 2y - 2 = 0" /> digambar pada satu bidang koordinat. Tentukan titik potong kedua garis tersebut, lalu gambarkan!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-cyan-300 font-body">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">Selesaikan sistem persamaan (eliminasi):</p>
                      <BlockMath math="\ell_1: 2x + y = 6 \quad \cdots (1)" />
                      <BlockMath math="\ell_2: x - 2y = 2 \quad \cdots (2)" />
                      <p className="text-white/60 text-xs">(1)×2: 4x + 2y = 12, kemudian tambahkan dengan (2):</p>
                      <BlockMath math="5x = 14 \Rightarrow x = \frac{14}{5} = 2{,}8" />
                      <p className="text-white/60 text-xs">Sub x ke (1):</p>
                      <BlockMath math="2(2{,}8) + y = 6 \Rightarrow y = 0{,}4" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik kedua garis:</p>
                      <CoordSystem w={W} h={H} label="ℓ₁ dan ℓ₂">
                        {/* l1: 2x+y=6 → y=6-2x */}
                        <polyline points={[[-1,8],[0,6],[1,4],[2,2],[3,0],[4,-2]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                        {/* l2: x-2y=2 → y=(x-2)/2 */}
                        <polyline points={[[-2,-2],[0,-1],[2,0],[4,1],[6,2]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                        {/* intersection */}
                        <circle cx={toX(2.8)} cy={toY(0.4)} r="6" fill="#facc15" stroke="#fde047" strokeWidth="2" />
                        <text x={toX(2.8)+7} y={toY(0.4)-4} fill="#fde047" fontSize="8">(2.8; 0.4)</text>
                        {/* labels */}
                        <text x={toX(-0.5)} y={toY(7)} fill="#22d3ee" fontSize="8">ℓ₁</text>
                        <text x={toX(3.5)} y={toY(0.8)} fill="#f472b6" fontSize="8">ℓ₂</text>
                      </CoordSystem>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="text-sm font-bold text-red-300 font-body">✅ Titik potong kedua garis: <InlineMath math="\left(\frac{14}{5},\ \frac{2}{5}\right) = (2{,}8;\ 0{,}4)" /></p>
                    </div>
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
                    ["Bentuk Umum", "y = mx + c (slope-intercept) atau ax + by + c = 0"],
                    ["Titik Potong sb-x", "Substitusi y = 0, hitung x"],
                    ["Titik Potong sb-y", "Substitusi x = 0, hitung y"],
                    ["Menggambar Garis", "Cukup 2 titik: titik potong sb-x dan sb-y"],
                    ["Titik Potong 2 Garis", "Selesaikan sistem persamaan linear dua variabel"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Strategi Cepat:</strong> Untuk menggambar garis dari persamaan ax + by = c, langsung cari titik saat x=0 dan y=0 — dua titik ini sudah cukup!</p>
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
export default GrafikPGLPage;
