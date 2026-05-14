import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MetodeGrafikPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "langkah", "contoh1", "rangkuman",
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
      {expandedSections.includes(id)
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
            {expandedSections.includes("intro") && (
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
            {expandedSections.includes("langkah") && (
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

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="📝 Contoh Soal & Pembahasan" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 1</p>
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
                    <p className="font-body text-sm font-semibold text-white">Soal 2</p>
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
                    <p className="font-body text-sm font-semibold text-white">Soal 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Tanpa menggambar, tentukan jenis solusi (satu, tak hingga, atau tidak ada) dari SPLDV berikut dengan menganalisis gradiennya:<br />
                      a. <InlineMath math="2x + 4y = 8" /> dan <InlineMath math="x + 2y = 4" /><br />
                      b. <InlineMath math="3x - y = 6" /> dan <InlineMath math="3x - y = 9" /><br />
                      c. <InlineMath math="x + 2y = 5" /> dan <InlineMath math="2x - y = 5" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-xs text-white/60">Ubah ke bentuk <InlineMath math="y = mx + c" /> untuk membandingkan gradien (<InlineMath math="m" />) dan konstanta (<InlineMath math="c" />).</p>

                    <div className="space-y-4">
                      {[
                        {
                          no: "a",
                          p: [
                            { raw: "2x + 4y = 8", slope: "y = -\\frac{1}{2}x + 2", m: "-1/2", c: "2" },
                            { raw: "x + 2y = 4", slope: "y = -\\frac{1}{2}x + 2", m: "-1/2", c: "2" },
                          ],
                          verdict: "♾️ TAK HINGGA SOLUSI",
                          reason: "Gradien dan konstanta SAMA → kedua persamaan identik (garis berimpit).",
                          color: "text-yellow-300 bg-yellow-900/20 border-yellow-500/20",
                        },
                        {
                          no: "b",
                          p: [
                            { raw: "3x - y = 6", slope: "y = 3x - 6", m: "3", c: "-6" },
                            { raw: "3x - y = 9", slope: "y = 3x - 9", m: "3", c: "-9" },
                          ],
                          verdict: "🚫 TIDAK ADA SOLUSI",
                          reason: "Gradien SAMA tetapi konstanta BERBEDA → dua garis sejajar, tidak berpotongan.",
                          color: "text-red-300 bg-red-900/20 border-red-500/20",
                        },
                        {
                          no: "c",
                          p: [
                            { raw: "x + 2y = 5", slope: "y = -\\frac{1}{2}x + \\frac{5}{2}", m: "-1/2", c: "5/2" },
                            { raw: "2x - y = 5", slope: "y = 2x - 5", m: "2", c: "-5" },
                          ],
                          verdict: "🎯 TEPAT SATU SOLUSI",
                          reason: "Gradien BERBEDA → dua garis pasti berpotongan di satu titik.",
                          color: "text-green-300 bg-green-900/20 border-green-500/20",
                        },
                      ].map(({ no, p, verdict, reason, color }) => (
                        <div key={no} className="space-y-2">
                          <p className="font-body text-sm text-white/80 font-semibold">{no}. Analisis:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {p.map(({ raw, slope, m, c }) => (
                              <div key={raw} className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-body">
                                <p className="text-white font-mono">{raw}</p>
                                <p className="text-cyan-300 mt-1">→ <InlineMath math={slope} /></p>
                                <p className="text-white/50 mt-0.5">m = {m}, c = {c}</p>
                              </div>
                            ))}
                          </div>
                          <div className={`border ${color} rounded-lg px-3 py-2 text-xs font-body`}>
                            <p className="font-bold">{verdict}</p>
                            <p className="text-white/60 mt-0.5">{reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title="📋 Rangkuman" />
            {expandedSections.includes("rangkuman") && (
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
