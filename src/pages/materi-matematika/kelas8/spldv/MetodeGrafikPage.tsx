import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import GrafikSPLDVInteraktif from "@/components/GrafikSPLDVInteraktif";

const MetodeGrafikPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "lab", "intro", "langkah", "contoh1", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {true
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  /* ── Mini SVG Graph Helper ── */
  const GraphSVG = ({
    lines, intersection, label,
  }: {
    lines: { points: [number, number][]; color: string; name: string }[];
    intersection?: [number, number];
    label?: string;
  }) => {
    const W = 220; const H = 180;
    const pad = 30;
    const xRange = 8; const yRange = 8;
    const toSVG = (x: number, y: number): [number, number] => [
      pad + (x / xRange) * (W - 2 * pad),
      H - pad - (y / yRange) * (H - 2 * pad),
    ];
    const ticks = [0, 2, 4, 6, 8];
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto">
        {/* Grid */}
        {ticks.map((t) => {
          const [sx] = toSVG(t, 0); const [, sy] = toSVG(0, t);
          return (
            <g key={t}>
              <line x1={sx} y1={pad} x2={sx} y2={H - pad} stroke="#334155" strokeWidth="0.5" />
              <line x1={pad} y1={sy} x2={W - pad} y2={sy} stroke="#334155" strokeWidth="0.5" />
              {t > 0 && <text x={sx} y={H - pad + 12} textAnchor="middle" fill="#64748b" fontSize="8">{t}</text>}
              {t > 0 && <text x={pad - 8} y={sy + 3} textAnchor="end" fill="#64748b" fontSize="8">{t}</text>}
            </g>
          );
        })}
        {/* Axes */}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#475569" strokeWidth="1.5" />
        <line x1={pad} y1={H - pad} x2={pad} y2={pad} stroke="#475569" strokeWidth="1.5" />
        <text x={W - pad + 4} y={H - pad + 4} fill="#94a3b8" fontSize="9">x</text>
        <text x={pad - 3} y={pad - 4} fill="#94a3b8" fontSize="9">y</text>
        {/* Lines */}
        {lines.map(({ points, color, name }) => {
          const svgPoints = points.map(([x, y]) => toSVG(x, y));
          return (
            <g key={name}>
              <polyline points={svgPoints.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
              {svgPoints[svgPoints.length - 1] && (
                <text x={svgPoints[svgPoints.length - 1][0] + 3} y={svgPoints[svgPoints.length - 1][1] - 3} fill={color} fontSize="8" fontWeight="bold">{name}</text>
              )}
            </g>
          );
        })}
        {/* Intersection */}
        {intersection && (() => {
          const [ix, iy] = toSVG(intersection[0], intersection[1]);
          return (
            <g>
              <circle cx={ix} cy={iy} r="5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <text x={ix + 7} y={iy - 5} fill="#fbbf24" fontSize="8" fontWeight="bold">
                ({intersection[0]},{intersection[1]})
              </text>
            </g>
          );
        })()}
        {label && <text x={W / 2} y={14} textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>}
      </svg>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          METODE GRAFIK
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Selesaikan SPLDV dengan Menggambar Dua Garis
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Ide Dasar Metode Grafik" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Setiap PLDV bisa digambar sebagai sebuah <strong className="text-cyan-300">garis lurus</strong> di bidang koordinat Kartesius. Karena SPLDV memiliki dua PLDV, kita akan menggambar <em>dua garis</em>. Solusi SPLDV adalah <strong className="text-cyan-300">titik potong</strong> kedua garis tersebut — koordinat titik itulah nilai <InlineMath math="x" /> dan <InlineMath math="y" /> yang memenuhi kedua persamaan!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: "1️⃣", title: "Gambar Garis 1", desc: "Buat tabel nilai untuk persamaan pertama, plot titik-titiknya, sambungkan jadi garis.", color: "border-cyan-500/30 bg-cyan-900/20" },
                    { icon: "2️⃣", title: "Gambar Garis 2", desc: "Ulangi langkah yang sama untuk persamaan kedua dengan warna garis yang berbeda.", color: "border-violet-500/30 bg-violet-900/20" },
                    { icon: "3️⃣", title: "Cari Titik Potong", desc: "Koordinat titik potong kedua garis adalah solusi (x, y) dari SPLDV.", color: "border-yellow-500/30 bg-yellow-900/20" },
                  ].map(({ icon, title, desc, color }) => (
                    <div key={title} className={`border ${color} rounded-xl p-3 text-center`}>
                      <p className="text-2xl mb-1">{icon}</p>
                      <p className="font-display text-sm font-bold text-white mb-1">{title}</p>
                      <p className="font-body text-xs text-white/60">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Keunggulan & Kelemahan:</strong> Metode grafik sangat intuitif dan visual, tapi hasilnya kurang akurat jika koordinat titik potong bukan bilangan bulat. Untuk solusi presisi, gunakan metode substitusi atau eliminasi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── LANGKAH-LANGKAH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-blue-400" title="📘 Langkah-Langkah Metode Grafik" />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kunci metode grafik adalah menemukan dua titik yang berada di setiap garis, lalu menyambungkannya. Cara paling mudah: cari titik potong dengan sumbu-x (saat <InlineMath math="y = 0" />) dan titik potong dengan sumbu-y (saat <InlineMath math="x = 0" />).
                  </p>
                </div>

                {/* Cara mencari titik bantu */}
                <div className="bg-slate-800/60 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide">📍 Cara Menentukan Dua Titik pada Garis</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-3">
                      <p className="text-cyan-300 font-bold mb-1">Titik Potong Sumbu-x</p>
                      <p className="text-white/70 text-xs">Substitusikan <InlineMath math="y = 0" /> ke persamaan, cari nilai <InlineMath math="x" /></p>
                      <div className="mt-2">
                        <BlockMath math="ax + b(0) = c \Rightarrow x = \frac{c}{a}" />
                      </div>
                      <p className="text-cyan-200/60 text-xs text-center">Titik: <InlineMath math="\left(\frac{c}{a},\ 0\right)" /></p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-3">
                      <p className="text-green-300 font-bold mb-1">Titik Potong Sumbu-y</p>
                      <p className="text-white/70 text-xs">Substitusikan <InlineMath math="x = 0" /> ke persamaan, cari nilai <InlineMath math="y" /></p>
                      <div className="mt-2">
                        <BlockMath math="a(0) + by = c \Rightarrow y = \frac{c}{b}" />
                      </div>
                      <p className="text-green-200/60 text-xs text-center">Titik: <InlineMath math="\left(0,\ \frac{c}{b}\right)" /></p>
                    </div>
                  </div>
                </div>

                {/* Ilustrasi grafik: 3 jenis solusi */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">📊 Kemungkinan Hasil Grafik SPLDV</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        title: "Berpotongan (1 solusi)",
                        color: "border-green-500/30 bg-green-900/10",
                        labelColor: "text-green-300",
                        desc: "Dua garis bertemu di satu titik → solusi tunggal (x, y)",
                      },
                      {
                        title: "Sejajar (Tidak ada solusi)",
                        color: "border-red-500/30 bg-red-900/10",
                        labelColor: "text-red-300",
                        desc: "Dua garis tidak pernah bertemu → SPLDV tidak memiliki solusi",
                      },
                      {
                        title: "Berimpit (Tak hingga solusi)",
                        color: "border-yellow-500/30 bg-yellow-900/10",
                        labelColor: "text-yellow-300",
                        desc: "Dua garis saling menumpuk → setiap titik di garis adalah solusi",
                      },
                    ].map(({ title, color, labelColor, desc }) => (
                      <div key={title} className={`border ${color} rounded-xl p-3 text-center`}>
                        <p className={`font-display text-xs font-bold mb-2 ${labelColor}`}>{title}</p>
                        <p className="font-body text-xs text-white/60">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── LAB INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="🖊️ Lab Interaktif: Gambar Garis & Temukan Solusi SPLDV" />
            {true && (
              <div className="px-4 pb-5 space-y-3">
                <p className="font-body text-xs text-white/55 leading-relaxed">
                  Ketik langsung persamaan SPLDV di kotak Garis 1 dan Garis 2, atau seret titik-titik secara manual, lalu gambar kedua garis untuk menemukan solusinya.
                  <strong className="text-yellow-300"> Titik potong</strong> kedua garis adalah penyelesaian SPLDV!
                </p>
                <GrafikSPLDVInteraktif />
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="📝 Contoh Soal & Pembahasan" />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Contoh Soal 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Selesaikan SPLDV berikut dengan metode grafik:<br />
                      <InlineMath math="x + y = 4" /> dan <InlineMath math="x - y = 0" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>

                    <div>
                      <p className="font-body text-sm font-semibold text-cyan-300 mb-2">📋 Persamaan 1: <InlineMath math="x + y = 4" /></p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse mx-auto">
                          <thead>
                            <tr className="bg-cyan-900/40">
                              <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200"><InlineMath math="x" /></th>
                              <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">0</th>
                              <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">4</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-white/10 px-4 py-1 text-cyan-200 font-bold"><InlineMath math="y" /></td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">4</td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">0</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="font-body text-xs text-center text-cyan-300/60 mt-1">Titik: (0, 4) dan (4, 0)</p>
                    </div>

                    <div>
                      <p className="font-body text-sm font-semibold text-violet-300 mb-2">📋 Persamaan 2: <InlineMath math="x - y = 0" /> → <InlineMath math="x = y" /></p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse mx-auto">
                          <thead>
                            <tr className="bg-violet-900/40">
                              <th className="border border-violet-500/30 px-4 py-1 text-violet-200"><InlineMath math="x" /></th>
                              <th className="border border-violet-500/30 px-4 py-1 text-violet-200">0</th>
                              <th className="border border-violet-500/30 px-4 py-1 text-violet-200">4</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-white/10 px-4 py-1 text-violet-200 font-bold"><InlineMath math="y" /></td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">0</td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">4</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="font-body text-xs text-center text-violet-300/60 mt-1">Titik: (0, 0) dan (4, 4)</p>
                    </div>

                    <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3">
                      <GraphSVG
                        lines={[
                          { points: [[0, 4], [4, 0]], color: "#22d3ee", name: "P1" },
                          { points: [[0, 0], [6, 6]], color: "#a78bfa", name: "P2" },
                        ]}
                        intersection={[2, 2]}
                        label="Grafik Penyelesaian SPLDV"
                      />
                    </div>

                    <p className="font-body text-sm text-white/80">Dari grafik, kedua garis berpotongan di titik <InlineMath math="(2, 2)" />.</p>
                    <p className="font-body text-sm text-white/80">Verifikasi:</p>
                    <BlockMath math="P1: 2 + 2 = 4 \checkmark \qquad P2: 2 - 2 = 0 \checkmark" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Solusi SPLDV: <InlineMath math="x = 2,\ y = 2" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">Contoh Soal 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Selesaikan dengan metode grafik:<br />
                      <InlineMath math="2x + y = 6" /> dan <InlineMath math="x + 2y = 6" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="font-body text-sm font-semibold text-cyan-300 mb-2">P1: <InlineMath math="2x + y = 6" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          <p>Jika <InlineMath math="x = 0" />: <InlineMath math="y = 6" /> → (0, 6)</p>
                          <p>Jika <InlineMath math="y = 0" />: <InlineMath math="x = 3" /> → (3, 0)</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-violet-300 mb-2">P2: <InlineMath math="x + 2y = 6" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          <p>Jika <InlineMath math="x = 0" />: <InlineMath math="y = 3" /> → (0, 3)</p>
                          <p>Jika <InlineMath math="y = 0" />: <InlineMath math="x = 6" /> → (6, 0)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3">
                      <GraphSVG
                        lines={[
                          { points: [[0, 6], [3, 0]], color: "#22d3ee", name: "P1" },
                          { points: [[0, 3], [6, 0]], color: "#a78bfa", name: "P2" },
                        ]}
                        intersection={[2, 2]}
                        label="Grafik Penyelesaian SPLDV"
                      />
                    </div>

                    <p className="font-body text-sm text-white/80">Titik potong kedua garis: <InlineMath math="(2, 2)" /></p>
                    <p className="font-body text-sm text-white/80">Verifikasi:</p>
                    <BlockMath math="P1: 2(2) + 2 = 6 \checkmark \qquad P2: 2 + 2(2) = 6 \checkmark" />
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Solusi: <InlineMath math="x = 2,\ y = 2" />. Meskipun kedua persamaan berbeda, mereka bertemu di titik yang sama!</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — SULIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">Contoh Soal 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Selesaikan SPLDV berikut dengan metode grafik:<br />
                      <InlineMath math="x + 2y = 6" /> dan <InlineMath math="x + 2y = 10" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>

                    {/* Langkah 1 — tabel titik */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="font-body text-sm font-semibold text-cyan-300 mb-2">📋 Persamaan 1: <InlineMath math="x + 2y = 6" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          <p>Jika <InlineMath math="x = 0" />: <InlineMath math="2y = 6 \Rightarrow y = 3" /> → (0, 3)</p>
                          <p>Jika <InlineMath math="y = 0" />: <InlineMath math="x = 6" /> → (6, 0)</p>
                        </div>
                        <div className="overflow-x-auto mt-2">
                          <table className="text-xs font-body border-collapse mx-auto">
                            <thead>
                              <tr className="bg-cyan-900/40">
                                <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200"><InlineMath math="x" /></th>
                                <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">0</th>
                                <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">6</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-white/10 px-4 py-1 text-cyan-200 font-bold"><InlineMath math="y" /></td>
                                <td className="border border-white/10 px-4 py-1 text-center text-white">3</td>
                                <td className="border border-white/10 px-4 py-1 text-center text-white">0</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-orange-300 mb-2">📋 Persamaan 2: <InlineMath math="x + 2y = 10" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          <p>Jika <InlineMath math="x = 0" />: <InlineMath math="2y = 10 \Rightarrow y = 5" /> → (0, 5)</p>
                          <p>Jika <InlineMath math="x = 6" />: <InlineMath math="6 + 2y = 10 \Rightarrow y = 2" /> → (6, 2)</p>
                        </div>
                        <div className="overflow-x-auto mt-2">
                          <table className="text-xs font-body border-collapse mx-auto">
                            <thead>
                              <tr className="bg-orange-900/40">
                                <th className="border border-orange-500/30 px-4 py-1 text-orange-200"><InlineMath math="x" /></th>
                                <th className="border border-orange-500/30 px-4 py-1 text-orange-200">0</th>
                                <th className="border border-orange-500/30 px-4 py-1 text-orange-200">6</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-white/10 px-4 py-1 text-orange-200 font-bold"><InlineMath math="y" /></td>
                                <td className="border border-white/10 px-4 py-1 text-center text-white">5</td>
                                <td className="border border-white/10 px-4 py-1 text-center text-white">2</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Grafik */}
                    <div className="bg-slate-800/40 border border-red-500/20 rounded-xl p-3 space-y-2">
                      <p className="font-body text-xs font-bold text-white text-center">📊 Grafik Kedua Persamaan</p>
                      {/* SVG grafik dua garis sejajar */}
                      <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto">
                        <defs>
                          <filter id="glowRed">
                            <feGaussianBlur stdDeviation="2.5" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                          <marker id="arrowR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                            <path d="M0,1 L5,3 L0,5 Z" fill="#475569"/>
                          </marker>
                        </defs>
                        {/* Background */}
                        <rect x="30" y="10" width="240" height="190" fill="#0f172a" rx="4"/>
                        {/* Grid lines */}
                        {[0,1,2,3,4,5,6,7,8].map(i => {
                          const sx = 30 + i * 30;
                          const sy = 200 - i * 22.5;
                          return (
                            <g key={i}>
                              <line x1={sx} y1="10" x2={sx} y2="200" stroke="#1e293b" strokeWidth="0.7"/>
                              <line x1="30" y1={sy} x2="270" y2={sy} stroke="#1e293b" strokeWidth="0.7"/>
                              <text x={sx} y="212" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace">{i}</text>
                              {i > 0 && <text x="22" y={sy + 3} textAnchor="end" fill="#475569" fontSize="9" fontFamily="monospace">{i}</text>}
                            </g>
                          );
                        })}
                        {/* Axes */}
                        <line x1="30" y1="200" x2="268" y2="200" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
                        <line x1="30" y1="200" x2="30" y2="12" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowR)"/>
                        <text x="272" y="204" fill="#64748b" fontSize="10" fontStyle="italic">x</text>
                        <text x="28" y="10" fill="#64748b" fontSize="10" fontStyle="italic">y</text>
                        {/* P1: x+2y=6 → (0,3)→(6,0)  svg: (30,132.5)→(210,200) */}
                        <line x1="30" y1="132.5" x2="210" y2="200"
                          stroke="#22d3ee" strokeWidth="2.8" strokeLinecap="round"
                          filter="url(#glowRed)" opacity="0.9"/>
                        {/* P2: x+2y=10 → (0,5)→(6,2)  svg: (30,87.5)→(210,155) */}
                        <line x1="30" y1="87.5" x2="210" y2="155"
                          stroke="#fb923c" strokeWidth="2.8" strokeLinecap="round"
                          filter="url(#glowRed)" opacity="0.9"/>
                        {/* Dots P1 */}
                        <circle cx="30" cy="132.5" r="4" fill="#22d3ee"/>
                        <circle cx="210" cy="200" r="4" fill="#22d3ee"/>
                        {/* Dots P2 */}
                        <circle cx="30" cy="87.5" r="4" fill="#fb923c"/>
                        <circle cx="210" cy="155" r="4" fill="#fb923c"/>
                        {/* "SEJAJAR" label between lines */}
                        <rect x="82" y="148" width="116" height="20" rx="5" fill="#1c0a0a" fillOpacity="0.9"/>
                        <text x="140" y="162" textAnchor="middle" fill="#f87171" fontSize="11" fontFamily="sans-serif" fontWeight="bold">⟺ Garis Sejajar</text>
                        {/* No solution symbol */}
                        <text x="220" y="100" fill="#ef4444" fontSize="22" fontFamily="monospace" fontWeight="bold" opacity="0.75">∅</text>
                        {/* Legend */}
                        <rect x="32" y="14" width="130" height="38" rx="4" fill="#0f172a" fillOpacity="0.85"/>
                        <line x1="38" y1="27" x2="58" y2="27" stroke="#22d3ee" strokeWidth="2.5"/>
                        <text x="62" y="31" fill="#22d3ee" fontSize="10" fontFamily="monospace">x + 2y = 6</text>
                        <line x1="38" y1="44" x2="58" y2="44" stroke="#fb923c" strokeWidth="2.5"/>
                        <text x="62" y="48" fill="#fb923c" fontSize="10" fontFamily="monospace">x + 2y = 10</text>
                      </svg>
                      <p className="font-body text-[11px] text-center text-red-300/80">
                        Kedua garis <strong>tidak berpotongan</strong> — selalu sejajar sepanjang bidang koordinat.
                      </p>
                    </div>

                    {/* Analisis gradien */}
                    <div className="space-y-2">
                      <p className="font-body text-sm text-white/80">🔍 Mengapa kedua garis sejajar? Ubah ke bentuk <InlineMath math="y = mx + c" />:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2 text-xs font-body space-y-1">
                          <p className="text-white font-mono">x + 2y = 6</p>
                          <BlockMath math="y = -\tfrac{1}{2}x + 3" />
                          <p className="text-white/50">gradien <InlineMath math="m = -\tfrac{1}{2}" />, titik potong sumbu-y = <strong className="text-cyan-300">3</strong></p>
                        </div>
                        <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg px-3 py-2 text-xs font-body space-y-1">
                          <p className="text-white font-mono">x + 2y = 10</p>
                          <BlockMath math="y = -\tfrac{1}{2}x + 5" />
                          <p className="text-white/50">gradien <InlineMath math="m = -\tfrac{1}{2}" />, titik potong sumbu-y = <strong className="text-orange-300">5</strong></p>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-body space-y-1">
                        <p className="text-white/70">Gradien kedua garis: <InlineMath math="-\tfrac{1}{2} = -\tfrac{1}{2}" /> <span className="text-yellow-300 font-bold">→ SAMA</span></p>
                        <p className="text-white/70">Konstanta (y-intercept): <InlineMath math="3 \neq 5" /> <span className="text-red-300 font-bold">→ BERBEDA</span></p>
                      </div>
                    </div>

                    {/* Kesimpulan */}
                    <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-center space-y-2">
                      <p className="font-display text-base font-bold text-red-300">∅ SPLDV Tidak Memiliki Penyelesaian!</p>
                      <p className="font-body text-xs text-white/60">
                        Karena gradien sama tetapi konstanta berbeda, kedua garis <strong className="text-red-300">sejajar</strong> dan tidak pernah berpotongan.
                        Tidak ada pasangan <InlineMath math="(x, y)" /> yang memenuhi kedua persamaan secara bersamaan.
                      </p>
                      <div className="bg-slate-900/50 rounded-lg px-4 py-2 inline-block mt-1">
                        <BlockMath math="\frac{1}{1} = \frac{2}{2} \neq \frac{6}{10} \quad \Rightarrow \quad \text{tidak ada penyelesaian}" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title="📋 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {[
                    { poin: "Metode grafik menyelesaikan SPLDV dengan menggambar dua garis lurus di koordinat Kartesius.", icon: "📊" },
                    { poin: "Setiap PLDV digambar dengan menentukan minimal 2 titik — paling mudah: titik potong sumbu-x (y=0) dan sumbu-y (x=0).", icon: "📍" },
                    { poin: "Solusi SPLDV adalah koordinat titik potong kedua garis: (x, y).", icon: "🎯" },
                    { poin: "Jika gradien berbeda → berpotongan (1 solusi). Gradien sama, konstanta beda → sejajar (tidak ada solusi). Keduanya sama → berimpit (tak hingga solusi).", icon: "📐" },
                    { poin: "Selalu verifikasi solusi dengan mensubstitusikan ke KEDUA persamaan.", icon: "✅" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              ← Kembali ke Menu SPLDV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetodeGrafikPage;
