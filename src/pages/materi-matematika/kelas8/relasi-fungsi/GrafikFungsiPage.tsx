import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const GrafikFungsiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "langkah", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  // Helper: SVG coordinate system
  const Grid = ({ children, size = 180 }: { children: React.ReactNode; size?: number }) => {
    const mid = size / 2;
    const scale = mid / 5;
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs mx-auto" style={{ maxHeight: 200 }}>
        {/* Grid lines */}
        {[-4, -3, -2, -1, 1, 2, 3, 4].map(v => (
          <g key={v}>
            <line x1={mid + v * scale} y1={10} x2={mid + v * scale} y2={size - 10} stroke="#334155" strokeWidth="0.5" />
            <line x1={10} y1={mid - v * scale} x2={size - 10} y2={mid - v * scale} stroke="#334155" strokeWidth="0.5" />
          </g>
        ))}
        {/* Axes */}
        <line x1={10} y1={mid} x2={size - 10} y2={mid} stroke="#64748b" strokeWidth="1.5" />
        <line x1={mid} y1={10} x2={mid} y2={size - 10} stroke="#64748b" strokeWidth="1.5" />
        {/* Axis labels */}
        <text x={size - 8} y={mid + 10} fill="#64748b" fontSize="8">x</text>
        <text x={mid + 4} y={14} fill="#64748b" fontSize="8">y</text>
        {/* Tick labels */}
        {[-4, -2, 2, 4].map(v => (
          <g key={v}>
            <text x={mid + v * scale - 4} y={mid + 14} fill="#475569" fontSize="6">{v}</text>
            <text x={mid + 3} y={mid - v * scale + 3} fill="#475569" fontSize="6">{v}</text>
          </g>
        ))}
        {children}
      </svg>
    );
  };

  const toSvg = (x: number, y: number, mid = 90, scale = 18) => ({ cx: mid + x * scale, cy: mid - y * scale });

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          GRAFIK FUNGSI
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Visualisasikan Fungsi dalam Bidang Koordinat!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Grafik — Wajah Visual Sebuah Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Grafik fungsi adalah representasi visual dari semua pasangan <InlineMath math="(x, f(x))" /> dalam bidang koordinat Kartesius. Dengan grafik, kita bisa seketika melihat sifat-sifat fungsi seperti apakah ia naik, turun, atau membentuk lengkung tertentu.
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">📊 Jenis Grafik Fungsi</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                    {[
                      { jenis: "Fungsi Linear", bentuk: "Garis lurus", rumus: "f(x) = ax + b", color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-200" },
                      { jenis: "Fungsi Kuadrat", bentuk: "Parabola (U / ∩)", rumus: "f(x) = ax² + bx + c", color: "bg-violet-900/40 border-violet-500/30 text-violet-200" },
                      { jenis: "Fungsi Konstan", bentuk: "Garis horizontal", rumus: "f(x) = c", color: "bg-green-900/40 border-green-500/30 text-green-200" },
                    ].map(({ jenis, bentuk, rumus, color }) => (
                      <div key={jenis} className={`border ${color} rounded-lg px-3 py-2`}>
                        <p className="font-bold">{jenis}</p>
                        <p className="text-white/60 mt-0.5">Bentuk: {bentuk}</p>
                        <p className="text-white/40 mt-0.5 font-mono">{rumus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Membaca dan Memahami Grafik Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Setiap titik <InlineMath math="(x, y)" /> pada grafik fungsi merepresentasikan satu pasangan input-output: <InlineMath math="x" /> adalah nilai domain dan <InlineMath math="y = f(x)" /> adalah nilai range. Grafik fungsi <strong className="text-cyan-300">tidak pernah memiliki dua titik dengan nilai x yang sama tetapi nilai y berbeda</strong> (uji garis vertikal).
                  </p>
                </div>

                {/* Uji garis vertikal */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">📐 Uji Garis Vertikal (Vertical Line Test)</p>
                  <p className="text-xs text-white/70 mb-3">Cara mudah menentukan apakah suatu kurva merupakan grafik fungsi:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-3">
                      <p className="text-xs font-bold text-green-300 mb-2 text-center">✅ FUNGSI</p>
                      <p className="text-xs text-white/60 text-center">Setiap garis vertikal memotong grafik paling banyak di <strong className="text-green-300">satu titik</strong></p>
                    </div>
                    <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-3">
                      <p className="text-xs font-bold text-red-300 mb-2 text-center">❌ BUKAN FUNGSI</p>
                      <p className="text-xs text-white/60 text-center">Ada garis vertikal yang memotong grafik di <strong className="text-red-300">dua titik atau lebih</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sifat grafik */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Sifat Grafik</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Kondisi</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Artinya</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Naik (Increasing)", "f(x₁) < f(x₂) jika x₁ < x₂", "Nilai y bertambah saat x bertambah"],
                        ["Turun (Decreasing)", "f(x₁) > f(x₂) jika x₁ < x₂", "Nilai y berkurang saat x bertambah"],
                        ["Konstan", "f(x₁) = f(x₂) untuk semua x", "Nilai y selalu sama"],
                        ["Titik Potong Sumbu x", "f(x) = 0", "Grafik menyentuh sumbu-x"],
                        ["Titik Potong Sumbu y", "x = 0 → f(0)", "Grafik menyentuh sumbu-y"],
                      ].map(([sifat, kondisi, arti], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{sifat}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70 font-mono text-xs">{kondisi}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{arti}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* LANGKAH MENGGAMBAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<BookOpen className="w-5 h-5" />} iconColor="text-orange-400" title="🖊️ Langkah Menggambar Grafik Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="space-y-2 text-sm font-body">
                  {[
                    { step: "1", title: "Buat tabel nilai", desc: "Pilih beberapa nilai x yang mudah (biasanya -2 sampai 2), hitung f(x) untuk masing-masing.", color: "border-cyan-500/30 bg-cyan-900/10" },
                    { step: "2", title: "Tentukan titik-titik koordinat", desc: "Setiap baris tabel menghasilkan titik (x, f(x)) yang akan digambar.", color: "border-violet-500/30 bg-violet-900/10" },
                    { step: "3", title: "Plot titik di bidang koordinat", desc: "Gambar titik-titik tersebut pada sistem koordinat Kartesius.", color: "border-green-500/30 bg-green-900/10" },
                    { step: "4", title: "Hubungkan titik-titik", desc: "Hubungkan semua titik dengan garis mulus (untuk domain real/bilangan real) atau biarkan sebagai titik-titik (untuk domain terbatas).", color: "border-orange-500/30 bg-orange-900/10" },
                  ].map(({ step, title, desc, color }) => (
                    <div key={step} className={`border ${color} rounded-lg p-3 flex gap-3`}>
                      <span className="font-display font-bold text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center shrink-0">{step}</span>
                      <div>
                        <p className="text-white font-semibold">{title}</p>
                        <p className="text-white/60 text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Tips:</strong> Untuk fungsi linear, cukup 2 titik untuk menggambar garis. Untuk fungsi kuadrat, minimal 5 titik agar kurva parabola terlihat jelas.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah (Fungsi Linear)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Gambarlah grafik fungsi <InlineMath math="f(x) = 2x - 1" /> untuk <InlineMath math="x \in \{-2, -1, 0, 1, 2\}" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Buat Tabel Nilai:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-green-900/40">
                              <th className="border border-green-500/30 px-2 py-1.5 text-green-200">x</th>
                              {[-2, -1, 0, 1, 2].map(v => <td key={v} className="border border-green-500/30 px-2 py-1.5 text-white text-center">{v}</td>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="border border-green-500/30 px-2 py-1.5 text-green-200">f(x)=2x-1</th>
                              {[-5, -3, -1, 1, 3].map((v, i) => <td key={i} className="border border-green-500/30 px-2 py-1.5 text-cyan-300 text-center font-bold">{v}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Titik koordinat:</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {[[-2,-5],[-1,-3],[0,-1],[1,1],[2,3]].map(([x, y]) => (
                          <span key={x} className="bg-violet-800/40 border border-violet-500/30 rounded-lg px-2 py-1 text-violet-200 font-mono">({x}, {y})</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2">Langkah 3 — Grafik:</p>
                      <div className="bg-slate-900/60 border border-green-500/20 rounded-xl p-3 flex justify-center">
                        <Grid size={180}>
                          {/* Line through points */}
                          {(() => {
                            const pts = [[-2,-5],[-1,-3],[0,-1],[1,1],[2,3]];
                            const mid = 90, scale = 18;
                            const svgPts = pts.map(([x, y]) => `${mid + x * scale},${mid - y * scale}`).join(' ');
                            return (
                              <g>
                                <polyline points={svgPts} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinejoin="round" />
                                {pts.map(([x, y]) => {
                                  const p = toSvg(x, y);
                                  return <circle key={x} cx={p.cx} cy={p.cy} r="4" fill="#4ade80" stroke="#86efac" strokeWidth="1.5" />;
                                })}
                              </g>
                            );
                          })()}
                        </Grid>
                      </div>
                      <p className="text-xs text-white/40 text-center mt-2">Grafik f(x) = 2x - 1 — garis naik ke kanan</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">✅ Grafik berupa garis lurus yang naik (koefisien x positif = 2 &gt; 0)</p>
                      <p className="text-xs text-white/60 mt-1">Titik potong sumbu-y: f(0) = -1 → titik (0, -1)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang (Fungsi Kuadrat)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Gambarlah grafik fungsi <InlineMath math="f(x) = x^2 - 4" /> untuk <InlineMath math="x \in \{-3, -2, -1, 0, 1, 2, 3\}" />. Tentukan titik potong dengan sumbu-x dan sumbu-y!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Tabel Nilai:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-yellow-900/40">
                              <th className="border border-yellow-500/30 px-2 py-1.5 text-yellow-200">x</th>
                              {[-3,-2,-1,0,1,2,3].map(v => <td key={v} className="border border-yellow-500/30 px-2 py-1.5 text-white text-center">{v}</td>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="border border-yellow-500/30 px-2 py-1.5 text-yellow-200">f(x)=x²-4</th>
                              {[5, 0, -3, -4, -3, 0, 5].map((v, i) => <td key={i} className="border border-yellow-500/30 px-2 py-1.5 text-cyan-300 text-center font-bold">{v}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Grafik (parabola membuka ke atas):</p>
                      <div className="bg-slate-900/60 border border-yellow-500/20 rounded-xl p-3 flex justify-center">
                        <Grid size={180}>
                          {(() => {
                            const pts: [number, number][] = [[-3,5],[-2,0],[-1,-3],[0,-4],[1,-3],[2,0],[3,5]];
                            const mid = 90, scale = 18;
                            const svgPts = pts.map(([x, y]) => `${mid + x * scale},${mid - y * scale}`).join(' ');
                            return (
                              <g>
                                <polyline points={svgPts} fill="none" stroke="#facc15" strokeWidth="2" strokeLinejoin="round" />
                                {pts.map(([x, y]) => {
                                  const p = toSvg(x, y);
                                  return <circle key={x} cx={p.cx} cy={p.cy} r="4" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />;
                                })}
                              </g>
                            );
                          })()}
                        </Grid>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Titik Potong:</p>
                      <div className="space-y-1 text-xs text-white/70">
                        <p><strong className="text-green-300">Sumbu-x</strong> (f(x) = 0): <InlineMath math="x^2 - 4 = 0 \implies x = \pm 2" /> → titik (-2, 0) dan (2, 0)</p>
                        <p><strong className="text-cyan-300">Sumbu-y</strong> (x = 0): <InlineMath math="f(0) = -4" /> → titik (0, -4)</p>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ Parabola terbuka ke atas, titik terendah (minimum) di (0, -4)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit (Analisis Grafik)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Suatu fungsi linear <InlineMath math="f(x) = mx + n" /> memotong sumbu-x di titik <InlineMath math="(3, 0)" /> dan memotong sumbu-y di titik <InlineMath math="(0, -6)" />. Tentukan:
                    <br />a) Nilai m dan n
                    <br />b) Rumus fungsinya
                    <br />c) Nilai f(7) dan f(-2)
                    <br />d) Apakah grafik naik atau turun?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Mencari m dan n:</p>
                      <p className="text-white/60 text-xs mb-1">Dari titik potong sumbu-y (0, -6): saat x=0, f(0) = n = -6</p>
                      <BlockMath math="n = -6" />
                      <p className="text-white/60 text-xs mb-1 mt-1">Dari titik potong sumbu-x (3, 0): saat x=3, f(3) = 0</p>
                      <BlockMath math="3m + (-6) = 0 \implies 3m = 6 \implies m = 2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Rumus Fungsi:</p>
                      <BlockMath math="f(x) = 2x - 6" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">c) Nilai f(7) dan f(-2):</p>
                      <BlockMath math="f(7) = 2(7) - 6 = 14 - 6 = 8" />
                      <BlockMath math="f(-2) = 2(-2) - 6 = -4 - 6 = -10" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">d) Grafik naik atau turun?</p>
                      <p className="text-white/70 text-xs">Koefisien x (gradien) = m = 2 &gt; 0</p>
                      <p className="text-green-300 text-xs mt-1">→ Grafik <strong>NAIK</strong> dari kiri ke kanan.</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ m = 2, n = -6, f(x) = 2x-6. f(7) = 8, f(-2) = -10. Grafik naik.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Grafik Fungsi", "Kumpulan titik (x, f(x)) yang diplot di bidang Kartesius"],
                    ["Uji Garis Vertikal", "Jika satu garis vertikal memotong grafik di >1 titik, bukan fungsi"],
                    ["Titik Potong Sumbu-x", "Cari f(x) = 0 (y = 0)"],
                    ["Titik Potong Sumbu-y", "Hitung f(0) (x = 0)"],
                    ["Fungsi Linear", "Grafiknya garis lurus. Naik jika m > 0, turun jika m < 0"],
                    ["Fungsi Kuadrat", "Grafiknya parabola. Terbuka ke atas jika a > 0, ke bawah jika a < 0"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Strategi Cepat:</strong> Untuk menggambar grafik fungsi linear, cukup tentukan 2 titik (titik potong sumbu-x dan sumbu-y), lalu tarik garis lurusnya!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikFungsiPage;
