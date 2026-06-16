import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Sliders, TrendingUp, PlayCircle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import GradienInvariantAnimation from "@/components/GradienInvariantAnimation";
import GradienDuaTitikInteraktif from "@/components/GradienDuaTitikInteraktif";

const W = 180, H = 150, MX = 90, MY = 75, SC = 14;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSys = ({ children, label = "", w = W, h = H }: { children?: React.ReactNode; label?: string; w?: number; h?: number }) => {
  const mx = w / 2, my = h / 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-xl" style={{ maxHeight: 170, background: "rgba(15,23,42,0.7)" }}>
      {[-4,-3,-2,-1,1,2,3,4].map(v => (
        <g key={v}>
          <line x1={mx+v*(w/10)} y1={4} x2={mx+v*(w/10)} y2={h-4} stroke="#1e293b" strokeWidth="0.8" />
          <line x1={4} y1={my-v*(h/10)} x2={w-4} y2={my-v*(h/10)} stroke="#1e293b" strokeWidth="0.8" />
        </g>
      ))}
      <line x1={4} y1={my} x2={w-4} y2={my} stroke="#475569" strokeWidth="1.5" />
      <line x1={mx} y1={h-4} x2={mx} y2={4} stroke="#475569" strokeWidth="1.5" />
      <text x={w-9} y={my+11} fill="#64748b" fontSize="8">x</text>
      <text x={mx+3} y={11} fill="#64748b" fontSize="8">y</text>
      <text x={mx+2} y={my+10} fill="#475569" fontSize="7">O</text>
      {label && <text x={5} y={13} fill="#94a3b8" fontSize="8">{label}</text>}
      {children}
    </svg>
  );
};

const GradienPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "definisi", "animasi", "duatitik", "rumus", "visualgradien", "jenis", "contoh1", "contoh2", "contoh3", "rangkuman",
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
        <Sliders className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">GRADIEN (KEMIRINGAN GARIS)</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Seberapa Curam Sebuah Garis?</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Persamaan Garis Lurus · Materi Matematika</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Gradien — Ukuran Kemiringan Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Tanjakan jalan yang curam vs landai, lereng gunung yang terjal vs miring perlahan — semua punya tingkat kemiringan yang berbeda. Dalam matematika, tingkat kemiringan ini disebut <strong className="text-cyan-300">gradien</strong> (atau slope).
                </p>
                {/* Foto ilustrasi jalan tanjakan */}
                <figure className="rounded-xl overflow-hidden border border-white/10">
                  <img
                    src="/jalan-tanjakan.png"
                    alt="Perbandingan jalan tanjakan terjal dan landai"
                    className="w-full object-cover"
                  />
                  <figcaption className="text-center text-[10px] text-white/40 font-body py-1.5 bg-slate-900/60">
                    bing.com/images/create
                  </figcaption>
                </figure>
                {/* Analogi kemiringan */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-cyan-300 uppercase mb-3">⛰️ Analogi Kemiringan dalam Kehidupan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                    {[
                      { icon: "🏔️", label: "Lereng Terjal", m: "m = 5", ket: "Naik 5 unit per 1 unit ke kanan", color: "bg-red-900/40 border-red-500/30" },
                      { icon: "🏕️", label: "Lereng Landai", m: "m = 0.5", ket: "Naik 0.5 unit per 1 unit ke kanan", color: "bg-yellow-900/40 border-yellow-500/30" },
                      { icon: "🏖️", label: "Jalan Datar", m: "m = 0", ket: "Tidak naik maupun turun", color: "bg-green-900/40 border-green-500/30" },
                    ].map(({ icon, label, m, ket, color }) => (
                      <div key={label} className={`border ${color} rounded-xl p-3 text-center`}>
                        <div className="text-2xl mb-1">{icon}</div>
                        <p className="font-bold text-white">{label}</p>
                        <p className="text-cyan-300 font-mono font-bold mt-1">{m}</p>
                        <p className="text-white/40 text-xs mt-0.5">{ket}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DEFINISI & RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="definisi" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Definisi dan Rumus Gradien" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-violet-300 mb-2 font-body">🎯 Ringkasan Intisari</p>
                  <p className="text-sm text-white/80 font-body leading-relaxed">
                    <strong className="text-cyan-300">Gradien (m)</strong> adalah perbandingan antara panjang{" "}
                    <strong className="text-pink-300">sisi tegak</strong> (jarak naik/turun) dan panjang{" "}
                    <strong className="text-green-300">sisi datar</strong> (jarak ke kanan) dari segitiga siku-siku yang terbentuk di bawah garis.
                  </p>
                  <div className="bg-violet-900/40 border border-violet-400/30 rounded-xl p-4 mt-3 text-center">
                    <BlockMath math="m = \frac{\text{panjang sisi tegak}}{\text{panjang sisi datar}}" />
                  </div>
                </div>

                {/* Positif vs Negatif — SVG illustrations */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Gradien Positif */}
                  <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-3 flex flex-col items-center gap-2">
                    <svg viewBox="0 0 150 100" className="w-full max-w-[160px]" style={{ background: "rgba(15,23,42,0.7)", borderRadius: 8 }}>
                      {[20,40,60,80].map(v => (
                        <line key={`gh${v}`} x1="10" y1={v} x2="120" y2={v} stroke="#1e293b" strokeWidth="1" />
                      ))}
                      {[30,50,70,90,110].map(v => (
                        <line key={`gv${v}`} x1={v} y1="10" x2={v} y2="90" stroke="#1e293b" strokeWidth="1" />
                      ))}
                      <line x1="20" y1="80" x2="110" y2="20" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
                      <line x1="20" y1="80" x2="110" y2="80" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <line x1="110" y1="80" x2="110" y2="20" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <text x="55" y="93" fill="#4ade80" fontSize="8.5" fontWeight="bold" textAnchor="middle">datar</text>
                      <text x="123" y="53" fill="#f472b6" fontSize="8.5" fontWeight="bold" textAnchor="start" transform="rotate(-90,123,53)">tegak</text>
                    </svg>
                    <p className="text-xs font-bold text-green-300 font-body text-center">Gradien <span className="text-green-400">POSITIF (+)</span></p>
                    <p className="text-[10px] text-white/50 font-body text-center">Garis naik ke kanan</p>
                  </div>

                  {/* Gradien Negatif */}
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-3 flex flex-col items-center gap-2">
                    <svg viewBox="0 0 150 100" className="w-full max-w-[160px]" style={{ background: "rgba(15,23,42,0.7)", borderRadius: 8 }}>
                      {[20,40,60,80].map(v => (
                        <line key={`rh${v}`} x1="10" y1={v} x2="120" y2={v} stroke="#1e293b" strokeWidth="1" />
                      ))}
                      {[30,50,70,90,110].map(v => (
                        <line key={`rv${v}`} x1={v} y1="10" x2={v} y2="90" stroke="#1e293b" strokeWidth="1" />
                      ))}
                      <line x1="20" y1="20" x2="110" y2="80" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
                      <line x1="20" y1="20" x2="110" y2="20" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <line x1="110" y1="20" x2="110" y2="80" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <text x="55" y="14" fill="#4ade80" fontSize="8.5" fontWeight="bold" textAnchor="middle">datar</text>
                      <text x="123" y="53" fill="#f472b6" fontSize="8.5" fontWeight="bold" textAnchor="start" transform="rotate(-90,123,53)">tegak</text>
                    </svg>
                    <p className="text-xs font-bold text-red-300 font-body text-center">Gradien <span className="text-red-400">NEGATIF (−)</span></p>
                    <p className="text-[10px] text-white/50 font-body text-center">Garis turun ke kanan</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ANIMASI INVARIANSI GRADIEN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="animasi" icon={<PlayCircle className="w-5 h-5" />} iconColor="text-cyan-400" title="🎬 Animasi: Gradien Tidak Bergantung Panjang Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Seret kedua titik ke posisi mana pun di grid — gradien selalu bisa dihitung dari <strong className="text-green-300">sisi datar</strong> dan <strong className="text-pink-300">sisi tegak</strong> di antara keduanya.
                </p>
                <GradienInvariantAnimation />
              </div>
            )}
          </div>

          {/* GRADIEN MELALUI DUA TITIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="duatitik" icon={<Target className="w-5 h-5" />} iconColor="text-violet-400" title="📍 Gradien Melalui Dua Titik" />
            {expandedSections.includes("duatitik") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Jika diketahui dua titik <InlineMath math="P_1(x_1,\, y_1)" /> dan <InlineMath math="P_2(x_2,\, y_2)" />,
                  gradien garis yang melalui keduanya dihitung dengan rumus:
                </p>
                <div className="bg-violet-900/30 border border-violet-400/30 rounded-xl p-4 text-center">
                  <BlockMath math="m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\Delta y}{\Delta x}" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-body">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2.5 text-center">
                    <p className="text-green-300 font-bold mb-1">Δy = sisi tegak</p>
                    <InlineMath math="\Delta y = y_2 - y_1" />
                    <p className="text-white/40 mt-1">selisih vertikal</p>
                  </div>
                  <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-2.5 text-center">
                    <p className="text-pink-300 font-bold mb-1">Δx = sisi datar</p>
                    <InlineMath math="\Delta x = x_2 - x_1" />
                    <p className="text-white/40 mt-1">selisih horizontal</p>
                  </div>
                </div>
                <p className="font-body text-xs text-white/50 leading-relaxed">
                  Seret titik <span className="text-cyan-300 font-bold">P₁</span> dan <span className="text-yellow-300 font-bold">P₂</span> ke sembarang posisi — rumus akan terisi otomatis langkah demi langkah.
                </p>
                <GradienDuaTitikInteraktif />
              </div>
            )}
          </div>

          {/* CARA MENENTUKAN GRADIEN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rumus" icon={<BookOpen className="w-5 h-5" />} iconColor="text-green-400" title="🔢 3 Cara Menentukan Gradien" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      no: "1", judul: "Dari Persamaan y = mx + c",
                      penj: "Gradien = koefisien x", contoh: "y = 3x - 7", hasil: "m = 3",
                      color: "border-cyan-500/40 bg-cyan-900/10",
                    },
                    {
                      no: "2", judul: "Dari Persamaan ax + by + c = 0",
                      penj: "Ubah ke bentuk y = mx + c terlebih dahulu", contoh: "2x + 3y - 6 = 0 → y = -⅔x + 2", hasil: "m = -⅔",
                      color: "border-violet-500/40 bg-violet-900/10",
                    },
                    {
                      no: "3", judul: "Dari Dua Titik (x₁,y₁) dan (x₂,y₂)",
                      penj: "Gunakan rumus m = (y₂-y₁)/(x₂-x₁)", contoh: "Titik A(1,3) dan B(4,9)", hasil: "m = (9-3)/(4-1) = 6/3 = 2",
                      color: "border-orange-500/40 bg-orange-900/10",
                    },
                  ].map(({ no, judul, penj, contoh, hasil, color }) => (
                    <div key={no} className={`border ${color} rounded-xl p-4 text-sm font-body`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/10 rounded-full w-7 h-7 flex items-center justify-center font-bold text-white font-display">{no}</span>
                        <p className="font-bold text-white">{judul}</p>
                      </div>
                      <p className="text-white/60 text-xs mb-2">{penj}</p>
                      <div className="bg-slate-800/60 rounded-lg p-2 text-xs">
                        <p className="text-white/60">Contoh: <span className="text-cyan-300 font-mono">{contoh}</span></p>
                        <p className="text-green-300 font-bold mt-1">{hasil}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* GALERI VISUAL GRADIEN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="visualgradien" icon={<Sliders className="w-5 h-5" />} iconColor="text-orange-400" title="🎨 Galeri Visual: Efek Berbagai Nilai Gradien" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { m: 3, label: "m = 3", color: "#22d3ee", note: "Curam ke kanan ↗" },
                    { m: 1, label: "m = 1", color: "#4ade80", note: "45° ke kanan ↗" },
                    { m: 0.3, label: "m = ⅓", color: "#a78bfa", note: "Landai ke kanan ↗" },
                    { m: 0, label: "m = 0", color: "#facc15", note: "Horizontal →" },
                    { m: -1, label: "m = −1", color: "#fb923c", note: "Turun 45° ↘" },
                    { m: -3, label: "m = −3", color: "#f472b6", note: "Curam ke kiri ↘" },
                  ].map(({ m, label, color, note }) => {
                    const pts: [number,number][] = [[-3, -3*m],[-2,-2*m],[-1,-m],[0,0],[1,m],[2,2*m],[3,3*m]];
                    const maxY = Math.max(...pts.map(([,y])=>Math.abs(y)));
                    const scl = maxY > 3 ? 3/maxY : 1;
                    return (
                      <div key={label} className="bg-slate-900/70 border border-white/10 rounded-xl p-2">
                        <CoordSys w={130} h={110} label={label}>
                          <polyline
                            points={pts.map(([x,y])=>`${65+x*13},${55-y*scl*12}`).join(' ')}
                            fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
                          />
                          <circle cx={65} cy={55} r="3" fill={color} opacity="0.8" />
                        </CoordSys>
                        <p className="text-center text-xs mt-1 text-white/40">{note}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-bold text-white mb-2 font-body">📊 Tabel Ringkasan Nilai Gradien</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead><tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-2 py-2 text-cyan-200">Nilai m</th>
                        <th className="border border-cyan-500/30 px-2 py-2 text-cyan-200">Arah Garis</th>
                        <th className="border border-cyan-500/30 px-2 py-2 text-cyan-200">Semakin besar |m|</th>
                      </tr></thead>
                      <tbody>
                        {[
                          ["m > 0", "↗ Naik dari kiri ke kanan", "Semakin curam ke kanan"],
                          ["m < 0", "↘ Turun dari kiri ke kanan", "Semakin curam ke kiri"],
                          ["m = 0", "→ Horizontal (mendatar)", "Tidak berubah"],
                          ["m tidak ada", "↕ Vertikal (x = konstanta)", "Tidak terdefinisi"],
                        ].map(([v,a,s],i) => (
                          <tr key={i} className={i%2===0?"bg-slate-800/30":"bg-slate-700/20"}>
                            <td className="border border-white/10 px-2 py-2 text-cyan-300 font-mono font-bold text-center">{v}</td>
                            <td className="border border-white/10 px-2 py-2 text-white/70 text-center">{a}</td>
                            <td className="border border-white/10 px-2 py-2 text-white/60 text-center">{s}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* JENIS GARIS KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="jenis" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-cyan-400" title="⚡ Garis Horizontal, Vertikal & Melalui Titik Asal" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      judul: "Garis Horizontal", eq: "y = c", m: "m = 0",
                      color: "#4ade80", ket: "Gradien 0, sejajar sumbu-x",
                      pts: [[-4,2],[0,2],[4,2]],
                    },
                    {
                      judul: "Garis Vertikal", eq: "x = c", m: "m = ∞ (tdk ada)",
                      color: "#f472b6", ket: "Gradien tidak terdefinisi, sejajar sumbu-y",
                      pts: [[2,-3],[2,0],[2,3]],
                    },
                    {
                      judul: "Melalui Titik Asal", eq: "y = mx", m: "c = 0",
                      color: "#a78bfa", ket: "Melewati titik (0,0), c=0",
                      pts: [[-3,-3],[0,0],[3,3]],
                    },
                  ].map(({ judul, eq, m, color, ket, pts }) => (
                    <div key={judul} className="bg-slate-900/60 border border-white/10 rounded-xl p-3">
                      <p className="text-xs font-bold mb-1" style={{ color }}>{judul}</p>
                      <CoordSys w={130} h={100} label={eq}>
                        {pts[0][0] === pts[1][0] ? (
                          /* vertical line */
                          <line x1={65+pts[0][0]*13} y1={10} x2={65+pts[0][0]*13} y2={90} stroke={color} strokeWidth="2.5" />
                        ) : (
                          <polyline points={pts.map(([x,y])=>`${65+x*13},${50-y*13}`).join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                        )}
                        <circle cx={65+pts[1][0]*13} cy={50-pts[1][1]*13} r="3.5" fill={color} />
                      </CoordSys>
                      <p className="text-xs font-mono mt-1" style={{ color }}>{m}</p>
                      <p className="text-xs text-white/40 mt-0.5">{ket}</p>
                    </div>
                  ))}
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
                  <p className="text-sm text-white/85 font-body">Tentukan gradien dari persamaan berikut: a) <InlineMath math="y = -4x + 7" />, b) <InlineMath math="6x - 3y + 9 = 0" />, c) <InlineMath math="y = 5" /></p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  {[
                    { bag: "a) y = −4x + 7", ket: "Koefisien x adalah −4", hasil: "m = −4", color: "text-cyan-300" },
                    { bag: "b) 6x − 3y + 9 = 0", ket: "Ubah: −3y = −6x − 9 → y = 2x + 3", hasil: "m = 2", color: "text-violet-300" },
                    { bag: "c) y = 5", ket: "Garis horizontal → gradien = 0", hasil: "m = 0", color: "text-green-300" },
                  ].map(({ bag, ket, hasil, color }) => (
                    <div key={bag} className="bg-slate-800/50 rounded-lg p-3">
                      <p className={`${color} font-semibold text-xs mb-1`}>{bag}</p>
                      <p className="text-white/60 text-xs">{ket}</p>
                      <p className="text-green-300 font-bold text-sm mt-1">→ {hasil}</p>
                    </div>
                  ))}
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">✅ a) m = −4, b) m = 2, c) m = 0</p>
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
                  <p className="text-sm text-white/85 font-body">Tentukan gradien garis yang melalui titik <InlineMath math="A(3, -2)" /> dan <InlineMath math="B(-1, 6)" />. Gambarkan segitiga gradiennya!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Gunakan rumus gradien 2 titik:</p>
                    <BlockMath math="m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{6 - (-2)}{-1 - 3} = \frac{8}{-4} = -2" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Visualisasi segitiga gradien:</p>
                    <CoordSys w={W} h={H} label="A(3,−2) ke B(−1,6)">
                      {/* line through A(3,-2) and B(-1,6) */}
                      <polyline points={[[-3,10],[-1,6],[1,2],[3,-2],[4,-4]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                      {/* A and B */}
                      <circle cx={toX(3)} cy={toY(-2)} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                      <circle cx={toX(-1)} cy={toY(6)} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                      <text x={toX(3)+5} y={toY(-2)+4} fill="#22d3ee" fontSize="8">A(3,−2)</text>
                      <text x={toX(-1)+5} y={toY(6)-4} fill="#22d3ee" fontSize="8">B(−1,6)</text>
                      {/* triangle */}
                      <line x1={toX(3)} y1={toY(-2)} x2={toX(-1)} y2={toY(-2)} stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" />
                      <line x1={toX(-1)} y1={toY(-2)} x2={toX(-1)} y2={toY(6)} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2" />
                      <text x={toX(0.8)} y={toY(-2)+13} fill="#4ade80" fontSize="8">Δx=−4</text>
                      <text x={toX(-1)+5} y={toY(1)} fill="#f472b6" fontSize="8">Δy=8</text>
                    </CoordSys>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">✅ Gradien = −2 (garis turun curam dari kiri ke kanan)</p>
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
                  <p className="text-sm text-white/85 font-body">Titik <InlineMath math="P(k, 3)" /> dan <InlineMath math="Q(2, 7)" /> terletak pada sebuah garis dengan gradien <InlineMath math="m = -2" />. Tentukan nilai <InlineMath math="k" /> dan gambarkan garisnya!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Substitusi ke rumus gradien:</p>
                    <BlockMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" />
                    <BlockMath math="-2 = \frac{7 - 3}{2 - k} = \frac{4}{2 - k}" />
                    <BlockMath math="-2(2 - k) = 4" />
                    <BlockMath math="-4 + 2k = 4" />
                    <BlockMath math="2k = 8 \implies k = 4" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2 text-xs">Jadi P(4, 3) dan Q(2, 7). Grafik garis:</p>
                    <CoordSys w={W} h={H} label="P(4,3) dan Q(2,7)">
                      <polyline points={[[-1,13],[0,11],[1,9],[2,7],[3,5],[4,3],[5,1]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      {[[4,3],[2,7]].map(([x,y]) => (
                        <g key={`${x},${y}`}>
                          <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                          <text x={toX(x)+6} y={toY(y)} fill="#facc15" fontSize="8">({x},{y})</text>
                        </g>
                      ))}
                    </CoordSys>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-300">✅ k = 4, sehingga P(4, 3). Garis turun dengan m = −2.</p>
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
                    ["Gradien (m)", "Ukuran kemiringan garis = Δy/Δx"],
                    ["Dari y=mx+c", "m adalah koefisien x langsung"],
                    ["Dari ax+by+c=0", "Ubah ke y=mx+c dulu, m = −a/b"],
                    ["Dari 2 titik", "m = (y₂−y₁)/(x₂−x₁)"],
                    ["m > 0", "Garis naik; m < 0 = Garis turun; m = 0 = Horizontal"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Trik cepat ax+by+c=0:</strong> gradien = <InlineMath math="m = -\frac{a}{b}" />. Contoh: 3x − 2y + 1 = 0 → m = −(3)/(−2) = 3/2</p>
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
export default GradienPage;
