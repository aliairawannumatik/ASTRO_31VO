import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, Layers, TrendingUp } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import GeoGebraGrapher from "@/components/GeoGebraGrapher";

/* ─── SVG helpers ─── */
const W = 200, H = 160, MX = 100, MY = 80, SC = 16;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSystem = ({ children, w = W, h = H, label = "", showNumbers = false }: { children?: React.ReactNode; w?: number; h?: number; label?: string; showNumbers?: boolean }) => {
  const mx = w / 2, my = h / 2;
  const uid = React.useId().replace(/:/g, "");
  const xStep = w / 12, yStep = h / 10;
  const ticks = [-4, -2, 2, 4];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-xl" style={{ maxHeight: showNumbers ? 220 : 180, background: "rgba(15,23,42,0.7)" }}>
      {/* grid */}
      {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
        <g key={v}>
          <line x1={mx + v*xStep} y1={4} x2={mx + v*xStep} y2={h-4} stroke="#1e293b" strokeWidth="1" />
          <line x1={4} y1={my - v*yStep} x2={w-4} y2={my - v*yStep} stroke="#1e293b" strokeWidth="1" />
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
      <text x={mx+3} y={my+11} fill="#475569" fontSize="7">O</text>
      {label && <text x={6} y={14} fill="#94a3b8" fontSize="8">{label}</text>}
      {/* axis numbers */}
      {showNumbers && [-4,-3,-2,-1,1,2,3,4].map(v => (
        <g key={`num-${v}`}>
          <text x={mx + v*xStep - (v < -9 ? 9 : v < 0 ? 6 : 3)} y={my + 11} fill="#64748b" fontSize="7">{v}</text>
          <text x={mx - 15} y={my - v*yStep + 3} fill="#64748b" fontSize="7">{v}</text>
        </g>
      ))}
      {children}
    </svg>
  );
};

/* ─── Interactive Step Graph ─── */
const ISG_W = 300, ISG_H = 260, ISG_MX = 150, ISG_MY = 130, ISG_SC = 22;
const iax = (x: number) => ISG_MX + x * ISG_SC;
const iay = (y: number) => ISG_MY - y * ISG_SC;
const ISG_TICKS = [-5,-4,-3,-2,-1,1,2,3,4,5];

interface IStepDef { label: string; color: string; bg: string; desc: string; }

const InteractiveStepGraph = ({
  equationLabel, linePoints, point1, point2, lineColor, steps,
}: {
  equationLabel: string;
  linePoints: [number,number][];
  point1: [number,number];
  point2: [number,number];
  lineColor: string;
  steps: [IStepDef, IStepDef, IStepDef, IStepDef];
}) => {
  const [step, setStep] = React.useState(0);

  const ptLabelPos = (x: number, y: number, above: boolean): [number,number] => {
    const px = iax(x), py = iay(y);
    const dx = px > ISG_MX + 70 ? -62 : 9;
    const dy = above ? -9 : 16;
    return [px + dx, py + dy];
  };
  const [p1lx, p1ly] = ptLabelPos(point1[0], point1[1], point1[1] > 1);
  const [p2lx, p2ly] = ptLabelPos(point2[0], point2[1], point2[1] < 0);

  const stepIcons = ["🗺️","📍","📌","✏️"];

  return (
    <div className="space-y-3">
      {/* Step pills */}
      <div className="flex gap-2 flex-wrap">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={i === step ? { background: s.bg, borderColor: s.color + "88", color: s.color, boxShadow: `0 0 12px ${s.color}33` } : {}}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-body font-semibold transition-all duration-200 border ${
              i === step ? 'scale-105' :
              i < step ? 'border-white/20 bg-white/10 text-white/50' :
              'border-white/8 bg-white/5 text-white/25'
            }`}>
            <span className="text-[11px]">{stepIcons[i]}</span>
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{i+1}</span>
          </button>
        ))}
      </div>

      {/* Step description */}
      <div className="rounded-xl p-3.5 border" style={{ background: steps[step].bg, borderColor: steps[step].color + "44" }}>
        <div className="flex items-start gap-2">
          <span className="text-base shrink-0 mt-0.5">{stepIcons[step]}</span>
          <div>
            <p className="text-xs font-bold font-body mb-0.5" style={{ color: steps[step].color }}>{steps[step].label}</p>
            <p className="text-xs font-body text-white/80 leading-relaxed">{steps[step].desc}</p>
          </div>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="relative">
        <svg viewBox={`0 0 ${ISG_W} ${ISG_H}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.97)", maxHeight: 380 }}>
          {/* grid lines */}
          {[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(v => (
            <g key={v}>
              <line x1={iax(v)} y1={3} x2={iax(v)} y2={ISG_H-3} stroke={v===0?"#334155":"#0f1f3d"} strokeWidth={v===0?"1":"0.8"}/>
              <line x1={3} y1={iay(v)} x2={ISG_W-3} y2={iay(v)} stroke={v===0?"#334155":"#0f1f3d"} strokeWidth={v===0?"1":"0.8"}/>
            </g>
          ))}
          {/* axes */}
          <line x1={6} y1={ISG_MY} x2={ISG_W-6} y2={ISG_MY} stroke="#475569" strokeWidth="2"/>
          <line x1={ISG_MX} y1={ISG_H-6} x2={ISG_MX} y2={6} stroke="#475569" strokeWidth="2"/>
          {/* axis arrow tips */}
          <polygon points={`${ISG_W-6},${ISG_MY} ${ISG_W-12},${ISG_MY-4} ${ISG_W-12},${ISG_MY+4}`} fill="#475569"/>
          <polygon points={`${ISG_MX},6 ${ISG_MX-4},12 ${ISG_MX+4},12`} fill="#475569"/>
          {/* axis labels */}
          <text x={ISG_W-14} y={ISG_MY+13} fill="#64748b" fontSize="10" fontWeight="bold">x</text>
          <text x={ISG_MX+6} y={15} fill="#64748b" fontSize="10" fontWeight="bold">y</text>
          <text x={ISG_MX+3} y={ISG_MY+13} fill="#475569" fontSize="8">O</text>
          {/* tick numbers - x axis */}
          {ISG_TICKS.map(v => (
            <g key={`xn${v}`}>
              <line x1={iax(v)} y1={ISG_MY-3} x2={iax(v)} y2={ISG_MY+3} stroke="#475569" strokeWidth="1"/>
              <text x={iax(v)-(v<=-10?10:v<0?7:3)} y={ISG_MY+13} fill="#4b5563" fontSize="7.5">{v}</text>
            </g>
          ))}
          {/* tick numbers - y axis */}
          {ISG_TICKS.map(v => (
            <g key={`yn${v}`}>
              <line x1={ISG_MX-3} y1={iay(v)} x2={ISG_MX+3} y2={iay(v)} stroke="#475569" strokeWidth="1"/>
              <text x={ISG_MX-16} y={iay(v)+3} fill="#4b5563" fontSize="7.5">{v}</text>
            </g>
          ))}
          {/* equation label badge */}
          <rect x={6} y={6} width={equationLabel.length*6+10} height={14} rx="3" fill="rgba(30,41,59,0.9)"/>
          <text x={11} y={16} fill="#94a3b8" fontSize="8.5" fontWeight="bold">{equationLabel}</text>

          {/* Step 3: draw line */}
          {step >= 3 && (
            <polyline
              points={linePoints.map(([x,y]) => `${iax(x)},${iay(y)}`).join(' ')}
              fill="none" stroke={lineColor} strokeWidth="2.8" strokeLinecap="round"
            />
          )}

          {/* Step 1: point1 (cyan) */}
          {step >= 1 && (
            <g>
              <circle cx={iax(point1[0])} cy={iay(point1[1])} r="7" fill="#22d3ee" stroke="#cffafe" strokeWidth="2"/>
              <circle cx={iax(point1[0])} cy={iay(point1[1])} r="11" fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.4"/>
              <rect x={p1lx-1} y={p1ly-9} width={`${String(point1).replace(',',' ').length*5+16}px`} height="12" rx="2" fill="rgba(6,12,30,0.85)"/>
              <text x={p1lx} y={p1ly} fill="#22d3ee" fontSize="9" fontWeight="bold">({point1[0]}, {point1[1]})</text>
            </g>
          )}

          {/* Step 2: point2 (violet) */}
          {step >= 2 && (
            <g>
              <circle cx={iax(point2[0])} cy={iay(point2[1])} r="7" fill="#a78bfa" stroke="#ede9fe" strokeWidth="2"/>
              <circle cx={iax(point2[0])} cy={iay(point2[1])} r="11" fill="none" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.4"/>
              <rect x={p2lx-1} y={p2ly-9} width={`${String(point2).replace(',',' ').length*5+16}px`} height="12" rx="2" fill="rgba(6,12,30,0.85)"/>
              <text x={p2lx} y={p2ly} fill="#a78bfa" fontSize="9" fontWeight="bold">({point2[0]}, {point2[1]})</text>
            </g>
          )}
        </svg>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-white/10 text-white/80 disabled:opacity-25 hover:bg-white/20 active:scale-95 transition-all">
          ← Sebelumnya
        </button>
        <div className="flex gap-2 items-center">
          {steps.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              style={i === step ? { background: s.color } : {}}
              className={`rounded-full transition-all duration-300 ${i === step ? 'w-6 h-2.5' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'}`}/>
          ))}
        </div>
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)}
            style={{ background: steps[step+1 < 4 ? step+1 : step].bg, borderColor: steps[step+1 < 4 ? step+1 : step].color + "66", color: steps[step+1 < 4 ? step+1 : step].color }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-body border active:scale-95 transition-all hover:opacity-80">
            Selanjutnya →
          </button>
        ) : (
          <button onClick={() => setStep(0)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-green-600/20 border border-green-500/40 text-green-300 active:scale-95 transition-all hover:bg-green-600/30">
            🔄 Ulangi
          </button>
        )}
      </div>
    </div>
  );
};

const GrafikPGLPage = () => {
  const navigate = useNavigate();
  const SH = ({ icon, iconColor, title }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4 border-b border-white/10">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
    </div>
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
                    Garis horizon di lautan — contoh nyata garis lurus yang dapat dideskripsikan dengan persamaan matematika.{" "}
                    <a
                      href="https://id.pngtree.com/freebackground/sea-horizon-line-unAder-aquatic-photo_9262149.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white/80 transition-colors"
                    >
                      Sumber gambar
                    </a>
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

          {/* METODE 1 — 2 TITIK POTONG SUMBU */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="titik-potong" icon={<BookOpen className="w-5 h-5" />} iconColor="text-orange-400" title="📌 Menggambar Grafik Persamaan Garis dengan 2 Titik Potong Sumbu X dan Sumbu Y" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Untuk menggambar grafik persamaan garis lurus, kita membutuhkan <strong className="text-orange-300">minimal 2 titik</strong>. Dua titik sudah cukup untuk menentukan sebuah garis lurus secara tepat. Salah satu cara termudah adalah menggunakan <strong className="text-orange-300">titik potong sumbu-x</strong> (saat <InlineMath math="y=0" />) dan <strong className="text-orange-300">titik potong sumbu-y</strong> (saat <InlineMath math="x=0" />) sebagai dua titik tersebut.
                  </p>
                </div>
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

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-bold text-white mb-3">🖊️ Langkah Menggambar (Metode Titik Potong Sumbu)</p>
                  <div className="space-y-2">
                    {[
                      { n:"1", t:"Cari titik potong sumbu-x", d:"Substitusi y = 0, hitung x → titik (x₀, 0)", c:"border-cyan-500/30 bg-cyan-900/10" },
                      { n:"2", t:"Cari titik potong sumbu-y", d:"Substitusi x = 0, hitung y → titik (0, y₀)", c:"border-violet-500/30 bg-violet-900/10" },
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

                {/* Contoh Metode Titik Potong Sumbu */}
                <p className="text-sm font-bold text-white/90 font-body">📖 Contoh Soal</p>
                <div className="flex flex-col gap-5">

                  {/* Contoh 1 */}
                  <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-cyan-300 font-body uppercase tracking-wide">Contoh 1</p>
                    <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">Tentukan grafik fungsi dari <InlineMath math="y = 2x + 4" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">Penyelesaian:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-cyan-900/40">
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">x</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">y</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Titik</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Keterangan</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-2</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(-2, 0)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik potong sumbu-x (y = 0)</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">4</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(0, 4)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik potong sumbu-y (x = 0)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="y = 2x + 4"
                      linePoints={[[-5,-6],[-4,-4],[-3,-2],[-2,0],[-1,2],[0,4],[1,6]]}
                      point1={[-2, 0]}
                      point2={[0, 4]}
                      lineColor="#22d3ee"
                      steps={[
                        { label:"Siapkan Grid", color:"#94a3b8", bg:"rgba(148,163,184,0.08)", desc:"Siapkan bidang koordinat Kartesius. Kita akan menggambar garis y = 2x + 4 menggunakan dua titik potong sumbu." },
                        { label:"Titik Potong Sb-x", color:"#22d3ee", bg:"rgba(34,211,238,0.1)", desc:"Substitusi y = 0 ke persamaan: 0 = 2x + 4 → 2x = −4 → x = −2. Titik potong sumbu-x adalah (−2, 0). Plot titik ini!" },
                        { label:"Titik Potong Sb-y", color:"#a78bfa", bg:"rgba(167,139,250,0.1)", desc:"Substitusi x = 0 ke persamaan: y = 2(0) + 4 = 4. Titik potong sumbu-y adalah (0, 4). Plot titik ini!" },
                        { label:"Gambar Garis", color:"#4ade80", bg:"rgba(74,222,128,0.08)", desc:"Hubungkan titik (−2, 0) dan (0, 4) dengan garis lurus, lalu perpanjang ke kedua arah. Garis y = 2x + 4 selesai! 🎉" },
                      ]}
                    />
                  </div>

                  {/* Contoh 2 */}
                  <div className="bg-slate-800/60 border border-violet-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-violet-300 font-body uppercase tracking-wide">Contoh 2</p>
                    <div className="bg-violet-900/20 border border-violet-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">Tentukan grafik fungsi dari <InlineMath math="2x - 3y = 12" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">Penyelesaian:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-violet-900/40">
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">x</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">y</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">Titik</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Keterangan</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">6</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(6, 0)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik potong sumbu-x (y = 0)</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-4</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(0, -4)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik potong sumbu-y (x = 0)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="2x - 3y = 12"
                      linePoints={[[-1,-14/3],[0,-4],[3,-2],[6,0]]}
                      point1={[6, 0]}
                      point2={[0, -4]}
                      lineColor="#a78bfa"
                      steps={[
                        { label:"Siapkan Grid", color:"#94a3b8", bg:"rgba(148,163,184,0.08)", desc:"Siapkan bidang koordinat Kartesius. Kita akan menggambar garis 2x − 3y = 12 menggunakan dua titik potong sumbu." },
                        { label:"Titik Potong Sb-x", color:"#22d3ee", bg:"rgba(34,211,238,0.1)", desc:"Substitusi y = 0: 2x − 3(0) = 12 → 2x = 12 → x = 6. Titik potong sumbu-x adalah (6, 0). Plot titik ini!" },
                        { label:"Titik Potong Sb-y", color:"#a78bfa", bg:"rgba(167,139,250,0.1)", desc:"Substitusi x = 0: 2(0) − 3y = 12 → −3y = 12 → y = −4. Titik potong sumbu-y adalah (0, −4). Plot titik ini!" },
                        { label:"Gambar Garis", color:"#4ade80", bg:"rgba(74,222,128,0.08)", desc:"Hubungkan titik (6, 0) dan (0, −4) dengan garis lurus, lalu perpanjang ke kedua arah. Garis 2x − 3y = 12 selesai! 🎉" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* METODE 2 — 2 TITIK ACAK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="titik-acak" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-green-400" title="📐 Cara Menggambar Persamaan Garis dengan Menggunakan Dua Titik Acak" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ingat, kita hanya butuh <strong className="text-green-300">minimal 2 titik</strong> untuk menggambar garis lurus. Selain menggunakan titik potong sumbu, kita bisa bebas memilih <strong className="text-green-300">dua nilai x sembarang</strong>, lalu menghitung nilai y yang bersesuaian dari persamaan. Kedua pasangan (x, y) itulah yang menjadi dua titik penentu garis.
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-bold text-white mb-3">🖊️ Langkah Menggambar (Metode Dua Titik Acak)</p>
                  <div className="space-y-2">
                    {[
                      { n:"1", t:"Pilih sembarang nilai x₁", d:"Misalnya x₁ = 1, substitusi ke persamaan untuk mendapat y₁ → titik (x₁, y₁)", c:"border-green-500/30 bg-green-900/10" },
                      { n:"2", t:"Pilih sembarang nilai x₂ yang berbeda", d:"Misalnya x₂ = 3, substitusi ke persamaan untuk mendapat y₂ → titik (x₂, y₂)", c:"border-teal-500/30 bg-teal-900/10" },
                      { n:"3", t:"Plot kedua titik di bidang koordinat", d:"Tandai (x₁, y₁) dan (x₂, y₂) pada sumbu koordinat", c:"border-cyan-500/30 bg-cyan-900/10" },
                      { n:"4", t:"Tarik garis lurus melewati kedua titik", d:"Hubungkan dan perpanjang garis ke kedua arah", c:"border-orange-500/30 bg-orange-900/10" },
                    ].map(({ n,t,d,c }) => (
                      <div key={n} className={`border ${c} rounded-lg p-3 flex gap-3 text-sm font-body`}>
                        <span className="font-display font-bold text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center shrink-0">{n}</span>
                        <div><p className="text-white font-semibold">{t}</p><p className="text-white/60 text-xs">{d}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Tips:</strong> Pilih nilai x yang mudah dihitung, misalnya x = 0, 1, 2, atau 3. Hindari pecahan agar koordinat titiknya bilangan bulat dan mudah diplot di bidang koordinat.</p>
                </div>

                {/* Contoh Metode Dua Titik Acak */}
                <p className="text-sm font-bold text-white/90 font-body">📖 Contoh Soal</p>
                <div className="flex flex-col gap-5">

                  {/* Contoh 1 */}
                  <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-green-300 font-body uppercase tracking-wide">Contoh 1</p>
                    <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">Tentukan grafik fungsi dari <InlineMath math="y = 3x - 2" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">Penyelesaian:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-green-900/40">
                          <th className="border border-green-500/30 px-3 py-2 text-green-200">x</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200">y</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200">Titik</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">Keterangan</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-2</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(0, -2)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik pertama (x = 0 dipilih)</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">2</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">4</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(2, 4)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik kedua (x = 2 dipilih)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="y = 3x - 2"
                      linePoints={[[-1,-5],[0,-2],[1,1],[2,4],[3,7]]}
                      point1={[0, -2]}
                      point2={[2, 4]}
                      lineColor="#4ade80"
                      steps={[
                        { label:"Siapkan Grid", color:"#94a3b8", bg:"rgba(148,163,184,0.08)", desc:"Siapkan bidang koordinat. Kita bebas memilih dua nilai x sembarang untuk menentukan dua titik pada garis y = 3x − 2." },
                        { label:"Titik Pertama", color:"#22d3ee", bg:"rgba(34,211,238,0.1)", desc:"Pilih x = 0: y = 3(0) − 2 = −2. Titik pertama adalah (0, −2). Plot titik ini di bidang koordinat!" },
                        { label:"Titik Kedua", color:"#a78bfa", bg:"rgba(167,139,250,0.1)", desc:"Pilih x = 2: y = 3(2) − 2 = 6 − 2 = 4. Titik kedua adalah (2, 4). Plot titik ini di bidang koordinat!" },
                        { label:"Gambar Garis", color:"#4ade80", bg:"rgba(74,222,128,0.08)", desc:"Hubungkan titik (0, −2) dan (2, 4) dengan garis lurus, lalu perpanjang ke kedua arah. Garis y = 3x − 2 selesai! 🎉" },
                      ]}
                    />
                  </div>

                  {/* Contoh 2 */}
                  <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-orange-300 font-body uppercase tracking-wide">Contoh 2</p>
                    <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">Tentukan grafik fungsi dari <InlineMath math="y = -x + 3" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">Penyelesaian:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-orange-900/40">
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200">x</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200">y</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200">Titik</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">Keterangan</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">1</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">2</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(1, 2)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik pertama (x = 1 dipilih)</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">4</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-1</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(4, -1)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">Titik kedua (x = 4 dipilih)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="y = -x + 3"
                      linePoints={[[-1,4],[0,3],[1,2],[2,1],[3,0],[4,-1],[5,-2]]}
                      point1={[1, 2]}
                      point2={[4, -1]}
                      lineColor="#fb923c"
                      steps={[
                        { label:"Siapkan Grid", color:"#94a3b8", bg:"rgba(148,163,184,0.08)", desc:"Siapkan bidang koordinat. Kita bebas memilih dua nilai x sembarang untuk menentukan dua titik pada garis y = −x + 3." },
                        { label:"Titik Pertama", color:"#22d3ee", bg:"rgba(34,211,238,0.1)", desc:"Pilih x = 1: y = −(1) + 3 = 2. Titik pertama adalah (1, 2). Plot titik ini di bidang koordinat!" },
                        { label:"Titik Kedua", color:"#a78bfa", bg:"rgba(167,139,250,0.1)", desc:"Pilih x = 4: y = −(4) + 3 = −1. Titik kedua adalah (4, −1). Plot titik ini di bidang koordinat!" },
                        { label:"Gambar Garis", color:"#fb923c", bg:"rgba(251,146,60,0.08)", desc:"Hubungkan titik (1, 2) dan (4, −1) dengan garis lurus, lalu perpanjang ke kedua arah. Garis y = −x + 3 selesai! 🎉" },
                      ]}
                    />
                  </div>
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
