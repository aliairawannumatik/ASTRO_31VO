import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DefinisiSPLDVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "pldv", "spldv", "contoh1", "rangkuman",
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

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          DEFINISI & BENTUK UMUM SPLDV
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Kaitannya dengan PLDV & Konsep Dasar Sistem Persamaan
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Mengapa Kita Butuh SPLDV?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu pergi ke kantin dan membeli 2 nasi goreng dan 1 mie goreng seharga Rp25.000. Temanmu membeli 1 nasi goreng dan 2 mie goreng seharga Rp23.000. Dari dua informasi ini, bisa tidak kita tahu harga masing-masing makanan? Nah, inilah kegunaan <strong className="text-cyan-300">SPLDV</strong> — alat matematika untuk memecahkan masalah yang punya <em>dua ketidaktahuan</em> sekaligus!
                </p>
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src="/images/spldv-konteks-warung.png" alt="Konteks warung nasi goreng dan mie goreng SPLDV" className="w-full object-contain" />
                  <div className="bg-black/40 px-3 py-1.5 flex items-center gap-1.5">
                    <span className="text-white/40 text-[10px]">🖼️</span>
                    <p className="font-body text-[10px] text-white/40">Sumber gambar:</p>
                    <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="font-body text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors underline underline-offset-2">bing.com/images/create</a>
                  </div>
                </div>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 text-sm font-body space-y-2">
                  <p className="text-cyan-300 font-semibold">🛸 Peta Konsep</p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
                    <div className="bg-yellow-800/40 border border-yellow-500/40 rounded-lg px-3 py-2 text-yellow-200 text-xs font-bold">
                      PLDV<br /><span className="font-normal text-white/60">1 persamaan, 2 variabel</span>
                    </div>
                    <span className="text-white/40 text-lg">+</span>
                    <div className="bg-yellow-800/40 border border-yellow-500/40 rounded-lg px-3 py-2 text-yellow-200 text-xs font-bold">
                      PLDV<br /><span className="font-normal text-white/60">1 persamaan, 2 variabel</span>
                    </div>
                    <span className="text-white/40 text-lg">→</span>
                    <div className="bg-cyan-800/50 border border-cyan-400/50 rounded-lg px-3 py-2 text-cyan-200 text-xs font-bold">
                      SPLDV<br /><span className="font-normal text-white/60">sistem 2 persamaan</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> SPLDV = <em>Sistem Persamaan Linear Dua Variabel</em>. Kata "linear" berarti pangkat tertinggi variabelnya adalah 1. Kata "dua variabel" berarti ada dua besaran yang tidak diketahui (biasanya <InlineMath math="x" /> dan <InlineMath math="y" />).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: PLDV ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pldv" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: PLDV — Satu Persamaan, Dua Variabel" />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">PLDV</strong> (Persamaan Linear Dua Variabel) adalah persamaan yang memiliki tepat dua variabel dan pangkat tertinggi setiap variabelnya adalah 1. Bentuk umumnya adalah <InlineMath math="ax + by = c" /> dengan <InlineMath math="a, b \neq 0" />. Satu persamaan linear dua variabel memiliki tak hingga banyak solusi karena kita bisa memasangkan nilai <InlineMath math="x" /> apa saja dengan <InlineMath math="y" /> yang sesuai.
                  </p>
                </div>

                {/* Bentuk Umum PLDV */}
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">📐 Bentuk Umum PLDV</p>
                  <BlockMath math="ax + by = c" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="a" /> dan <InlineMath math="b" /></p>
                      <p className="text-white/60 mt-1">Koefisien variabel (bukan nol)</p>
                    </div>
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold"><InlineMath math="x" /> dan <InlineMath math="y" /></p>
                      <p className="text-white/60 mt-1">Dua variabel yang dicari</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2 text-center">
                      <p className="text-violet-300 font-bold"><InlineMath math="c" /></p>
                      <p className="text-white/60 mt-1">Konstanta (bilangan tetap)</p>
                    </div>
                  </div>
                </div>

                {/* Contoh PLDV dan bukan PLDV */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">✅ Contoh PLDV vs ❌ Bukan PLDV</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-green-900/50">
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">Persamaan</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-center">PLDV?</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">Alasan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["2x + 3y = 6", "✅ Ya", "2 variabel, pangkat 1"],
                          ["x − 5y = 10", "✅ Ya", "2 variabel, pangkat 1"],
                          ["x² + y = 4", "❌ Bukan", "Ada pangkat 2 pada x"],
                          ["3x = 9", "❌ Bukan", "Hanya 1 variabel"],
                          ["xy + 2 = 0", "❌ Bukan", "Ada perkalian x dan y"],
                          ["4x + 0y = 8", "❌ Bukan", "Koefisien y = 0 (jadi 1 variabel)"],
                        ].map(([persamaan, pldv, alasan], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white font-mono">{persamaan}</td>
                            <td className={`border border-white/10 px-3 py-2 text-center font-bold ${pldv.includes("✅") ? "text-green-400" : "text-red-400"}`}>{pldv}</td>
                            <td className="border border-white/10 px-3 py-2 text-white/60">{alasan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Solusi PLDV — tak hingga */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">🌐 Solusi PLDV: Tak Hingga Banyaknya</p>
                  <p className="font-body text-xs text-white/70">Contoh: <InlineMath math="x + 2y = 6" /> memiliki banyak pasangan solusi:</p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse mx-auto">
                      <thead>
                        <tr className="bg-cyan-900/40">
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200"><InlineMath math="x" /></th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">0</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">2</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">4</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">6</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">...</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-white/10 px-4 py-2 text-cyan-200 font-bold"><InlineMath math="y" /></td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">3</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">2</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">1</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">0</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white/40">∞</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-center text-white/50">Inilah kenapa kita butuh <strong className="text-cyan-300">dua</strong> persamaan untuk mendapat solusi tunggal!</p>
                </div>

                {/* Verifikasi solusi */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">🔍 Cara Memverifikasi Solusi</p>
                  <p className="font-body text-xs text-white/70">Misalkan solusi SPLDV adalah <InlineMath math="x = 3, y = 1" />. Untuk membuktikannya, substitusikan ke <strong>kedua</strong> persamaan:</p>
                  <div className="space-y-1 text-sm font-body">
                    <BlockMath math="\text{Persamaan 1: } 2(3) + 3(1) = 6 + 3 = 9 \checkmark" />
                    <BlockMath math="\text{Persamaan 2: } (3) - (1) = 2 \checkmark" />
                  </div>
                  <p className="font-body text-xs text-center text-cyan-300">Jika keduanya benar, maka <InlineMath math="(3, 1)" /> adalah solusi SPLDV yang valid!</p>
                </div>

              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: SPLDV ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="spldv" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title="📗 Sub-Bab 2: SPLDV — Sistem Dua Persamaan" />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">SPLDV</strong> adalah kumpulan (sistem) dua buah PLDV yang harus dipenuhi secara <em>bersamaan</em> oleh sepasang nilai variabel <InlineMath math="(x, y)" />. Solusi SPLDV adalah nilai <InlineMath math="x" /> dan <InlineMath math="y" /> yang membuat <strong>kedua</strong> persamaan bernilai benar sekaligus.
                  </p>
                </div>

                {/* Bentuk Umum SPLDV */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">📐 Bentuk Umum SPLDV</p>
                  <BlockMath math="\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2">
                      <p className="text-cyan-300 font-bold">Persamaan 1: <InlineMath math="a_1x + b_1y = c_1" /></p>
                      <p className="text-white/60 mt-1">PLDV pertama dengan koefisiennya sendiri</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2">
                      <p className="text-violet-300 font-bold">Persamaan 2: <InlineMath math="a_2x + b_2y = c_2" /></p>
                      <p className="text-white/60 mt-1">PLDV kedua yang berbeda dari pertama</p>
                    </div>
                  </div>
                </div>

                {/* Jenis Solusi SPLDV — SVG Illustrations */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🔢 Tiga Kemungkinan Solusi SPLDV</p>

                  {/* ── KASUS 1: BERPOTONGAN ── */}
                  <div className="bg-gradient-to-br from-emerald-950/80 to-green-900/40 border border-emerald-500/50 rounded-2xl overflow-hidden">
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="font-display text-sm font-bold text-emerald-300">Tepat Satu Solusi</p>
                        <p className="font-body text-[11px] text-white/50">Dua garis berpotongan di satu titik</p>
                      </div>
                    </div>
                    <div className="px-3 py-1">
                      <svg viewBox="0 0 280 190" className="w-full rounded-xl" style={{background:"linear-gradient(135deg,#052e16cc,#14532dcc)"}}>
                        <defs>
                          <radialGradient id="dot1" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fef08a" stopOpacity="1"/>
                            <stop offset="100%" stopColor="#eab308" stopOpacity="0"/>
                          </radialGradient>
                          <filter id="glow1">
                            <feGaussianBlur stdDeviation="3" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                        </defs>
                        {/* Grid */}
                        {[-4,-3,-2,-1,1,2,3,4].map(k => (
                          <line key={`vg1-${k}`} x1={140+k*25} y1={5} x2={140+k*25} y2={185} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1"/>
                        ))}
                        {[-3,-2,-1,1,2,3].map(k => (
                          <line key={`hg1-${k}`} x1={5} y1={95-k*25} x2={275} y2={95-k*25} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1"/>
                        ))}
                        {/* Axes */}
                        <line x1="5" y1="95" x2="275" y2="95" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5"/>
                        <line x1="140" y1="5" x2="140" y2="185" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5"/>
                        {/* Axis arrows */}
                        <polygon points="275,95 268,91 268,99" fill="#ffffff" fillOpacity="0.25"/>
                        <polygon points="140,5 136,12 144,12" fill="#ffffff" fillOpacity="0.25"/>
                        {/* Line 1: y = x  (cyan) — svg_y = 235 − svg_x */}
                        <line x1="15" y1="220" x2="235" y2="0" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow1)" strokeOpacity="0.9"/>
                        <line x1="15" y1="220" x2="235" y2="0" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round"/>
                        {/* Line 2: y = -x + 4  (rose) */}
                        <line x1="120" y1="-25" x2="275" y2="130" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow1)" strokeOpacity="0.9"/>
                        <line x1="120" y1="-25" x2="275" y2="130" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round"/>
                        {/* Intersection: x=2, y=2  → svg=(190, 45) */}
                        <circle cx="190" cy="45" r="10" fill="url(#dot1)" opacity="0.6"/>
                        <circle cx="190" cy="45" r="5" fill="#fef08a" filter="url(#glow1)"/>
                        <circle cx="190" cy="45" r="3.5" fill="#ffffff"/>
                        {/* Dashed guide lines to intersection */}
                        <line x1="190" y1="45" x2="190" y2="95" stroke="#fef08a" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.6"/>
                        <line x1="140" y1="45" x2="190" y2="45" stroke="#fef08a" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.6"/>
                        {/* Intersection label */}
                        <rect x="198" y="28" width="72" height="22" rx="5" fill="#1a2e1a" fillOpacity="0.85"/>
                        <text x="234" y="43" textAnchor="middle" fill="#fef08a" fontSize="11" fontFamily="monospace" fontWeight="bold">(2 , 2)</text>
                        {/* Axis labels */}
                        <text x="269" y="109" fill="#ffffff" fillOpacity="0.4" fontSize="10" fontFamily="monospace">x</text>
                        <text x="144" y="14" fill="#ffffff" fillOpacity="0.4" fontSize="10" fontFamily="monospace">y</text>
                        {/* Line labels */}
                        <text x="103" y="129" fill="#67e8f9" fontSize="10" fontFamily="monospace">y = x</text>
                        <text x="148" y="14" fill="#fda4af" fontSize="10" fontFamily="monospace">y = -x+4</text>
                      </svg>
                    </div>
                    <div className="px-4 pb-3 pt-1 space-y-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-body bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-full px-2.5 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"/>y = x
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-body bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-full px-2.5 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"/>y = −x + 4
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-body bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 rounded-full px-2.5 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block"/>Titik potong (2 ; 2)
                        </span>
                      </div>
                      <p className="font-body text-[11px] text-white/55">Gradien berbeda → garis pasti berpotongan → ada <strong className="text-emerald-300">tepat satu solusi</strong> (x, y).</p>
                    </div>
                  </div>

                  {/* ── KASUS 2: BERIMPIT ── */}
                  <div className="bg-gradient-to-br from-yellow-950/80 to-amber-900/30 border border-yellow-500/50 rounded-2xl overflow-hidden">
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                      <span className="text-2xl">♾️</span>
                      <div>
                        <p className="font-display text-sm font-bold text-yellow-300">Tak Hingga Solusi</p>
                        <p className="font-body text-[11px] text-white/50">Dua garis saling berimpit (sama persis)</p>
                      </div>
                    </div>
                    <div className="px-3 py-1">
                      <svg viewBox="0 0 280 190" className="w-full rounded-xl" style={{background:"linear-gradient(135deg,#1c1400cc,#2d2000cc)"}}>
                        <defs>
                          <filter id="glow2">
                            <feGaussianBlur stdDeviation="4" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                        </defs>
                        {/* Grid */}
                        {[-4,-3,-2,-1,1,2,3,4].map(k => (
                          <line key={`vg2-${k}`} x1={140+k*25} y1={5} x2={140+k*25} y2={185} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1"/>
                        ))}
                        {[-3,-2,-1,1,2,3].map(k => (
                          <line key={`hg2-${k}`} x1={5} y1={95-k*25} x2={275} y2={95-k*25} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1"/>
                        ))}
                        {/* Axes */}
                        <line x1="5" y1="95" x2="275" y2="95" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5"/>
                        <line x1="140" y1="5" x2="140" y2="185" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5"/>
                        <polygon points="275,95 268,91 268,99" fill="#ffffff" fillOpacity="0.25"/>
                        <polygon points="140,5 136,12 144,12" fill="#ffffff" fillOpacity="0.25"/>
                        {/* Line glow (fat) - represents berimpit */}
                        <line x1="10" y1="143" x2="270" y2="47" stroke="#fbbf24" strokeWidth="10" strokeLinecap="round" strokeOpacity="0.18" filter="url(#glow2)"/>
                        {/* Line 1: y = 0.5x + 1  (amber) */}
                        <line x1="10" y1="143" x2="270" y2="47" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.9"/>
                        {/* Line 2: same, violet on top */}
                        <line x1="10" y1="143" x2="270" y2="47" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" strokeDasharray="6,5"/>
                        {/* "Berimpit" label in center */}
                        <rect x="90" y="72" width="100" height="22" rx="6" fill="#1c1400" fillOpacity="0.9"/>
                        <text x="140" y="87" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily="monospace" fontWeight="bold">● Garis Berimpit</text>
                        {/* Infinity dots along line */}
                        {[40,80,120,160,200,240].map((cx, i) => {
                          const cy = 143 - (cx-10)*(96/260);
                          return <circle key={i} cx={cx} cy={cy} r="3" fill="#fef3c7" fillOpacity="0.7"/>;
                        })}
                        <text x="269" y="109" fill="#ffffff" fillOpacity="0.4" fontSize="10" fontFamily="monospace">x</text>
                        <text x="144" y="14" fill="#ffffff" fillOpacity="0.4" fontSize="10" fontFamily="monospace">y</text>
                        <text x="15" y="170" fill="#fcd34d" fontSize="10" fontFamily="monospace">2y = x+2</text>
                        {/* y = ½x+1 dengan pecahan gaya LaTeX */}
                        <text x="148" y="42" fill="#c084fc" fontSize="10" fontFamily="monospace">y = </text>
                        <text x="176" y="37" fill="#c084fc" fontSize="7" fontFamily="monospace" textAnchor="middle">1</text>
                        <line x1="170" y1="39" x2="182" y2="39" stroke="#c084fc" strokeWidth="0.9"/>
                        <text x="176" y="47" fill="#c084fc" fontSize="7" fontFamily="monospace" textAnchor="middle">2</text>
                        <text x="184" y="42" fill="#c084fc" fontSize="10" fontFamily="monospace">x+1</text>
                      </svg>
                    </div>
                    <div className="px-4 pb-3 pt-1 space-y-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-body bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full px-2.5 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>2y = x + 2
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-body bg-violet-500/15 border border-violet-500/30 text-violet-300 rounded-full px-2.5 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-violet-400 inline-block"/>y = ½x + 1 (sama!)
                        </span>
                      </div>
                      <p className="font-body text-[11px] text-white/55">Kedua persamaan setara → garis berimpit → <strong className="text-yellow-300">semua titik di garis adalah solusi</strong>.</p>
                    </div>
                  </div>

                  {/* ── KASUS 3: SEJAJAR ── */}
                  <div className="bg-gradient-to-br from-red-950/80 to-rose-900/30 border border-red-500/50 rounded-2xl overflow-hidden">
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                      <span className="text-2xl">🚫</span>
                      <div>
                        <p className="font-display text-sm font-bold text-red-300">Tidak Ada Solusi</p>
                        <p className="font-body text-[11px] text-white/50">Dua garis sejajar, tidak pernah bertemu</p>
                      </div>
                    </div>
                    <div className="px-3 py-1">
                      <svg viewBox="0 0 280 190" className="w-full rounded-xl" style={{background:"linear-gradient(135deg,#2d0a0acc,#1c0505cc)"}}>
                        <defs>
                          <filter id="glow3">
                            <feGaussianBlur stdDeviation="3" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                        </defs>
                        {/* Grid */}
                        {[-4,-3,-2,-1,1,2,3,4].map(k => (
                          <line key={`vg3-${k}`} x1={140+k*25} y1={5} x2={140+k*25} y2={185} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1"/>
                        ))}
                        {[-3,-2,-1,1,2,3].map(k => (
                          <line key={`hg3-${k}`} x1={5} y1={95-k*25} x2={275} y2={95-k*25} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1"/>
                        ))}
                        {/* Axes */}
                        <line x1="5" y1="95" x2="275" y2="95" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5"/>
                        <line x1="140" y1="5" x2="140" y2="185" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5"/>
                        <polygon points="275,95 268,91 268,99" fill="#ffffff" fillOpacity="0.25"/>
                        <polygon points="140,5 136,12 144,12" fill="#ffffff" fillOpacity="0.25"/>
                        {/* Line 1: y = x + 2.5  (orange)  → svg: at x=-5,y=-2.5:(15,157.5) at x=2,y=4.5:(190,7.5) */}
                        <line x1="15" y1="157.5" x2="195" y2="2.5" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow3)" strokeOpacity="0.8"/>
                        <line x1="15" y1="157.5" x2="195" y2="2.5" stroke="#fdba74" strokeWidth="1.8" strokeLinecap="round"/>
                        {/* Line 2: y = x - 1.5  (red)   → svg: at x=-1.5,y=-3:(102.5,170) at x=4.5,y=3:(252.5,20) */}
                        <line x1="95" y1="182.5" x2="265" y2="7.5" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow3)" strokeOpacity="0.8"/>
                        <line x1="95" y1="182.5" x2="265" y2="7.5" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round"/>
                        {/* Parallel gap indicator */}
                        <line x1="130" y1="60" x2="155" y2="60" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" markerEnd="url(#arrow)"/>
                        {/* "Sejajar" label */}
                        <rect x="82" y="85" width="116" height="22" rx="6" fill="#1c0505" fillOpacity="0.9"/>
                        <text x="140" y="100" textAnchor="middle" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">⟺ Garis Sejajar</text>
                        {/* No intersection cross mark */}
                        <text x="200" y="75" fill="#ef4444" fontSize="18" fontFamily="monospace" fontWeight="bold" opacity="0.7">∅</text>
                        <text x="269" y="109" fill="#ffffff" fillOpacity="0.4" fontSize="10" fontFamily="monospace">x</text>
                        <text x="144" y="14" fill="#ffffff" fillOpacity="0.4" fontSize="10" fontFamily="monospace">y</text>
                        <text x="16" y="180" fill="#fdba74" fontSize="10" fontFamily="monospace">2x−2y=−5</text>
                        <text x="188" y="20" fill="#fca5a5" fontSize="10" fontFamily="monospace">2x−2y=3</text>
                      </svg>
                    </div>
                    <div className="px-4 pb-3 pt-1 space-y-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-body bg-orange-500/15 border border-orange-500/30 text-orange-300 rounded-full px-2.5 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"/>2x − 2y = −5
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-body bg-red-500/15 border border-red-500/30 text-red-300 rounded-full px-2.5 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>2x − 2y = 3
                        </span>
                      </div>
                      <p className="font-body text-[11px] text-white/55">Koefisien x dan y sama, konstanta berbeda → garis sejajar → <strong className="text-red-300">tidak ada solusi</strong> (∅).</p>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="📝 Contoh Soal & Pembahasan" />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* CONTOH SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Contoh Soal 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Manakah dari persamaan berikut yang merupakan PLDV?<br />
                      a. <InlineMath math="3x + 2y = 12" /><br />
                      b. <InlineMath math="x^2 - y = 5" /><br />
                      c. <InlineMath math="5x - y = 0" /><br />
                      d. <InlineMath math="2x = 8" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <div className="space-y-2 font-body text-sm">
                      {[
                        { ex: "a. 3x + 2y = 12", verdict: "✅ PLDV", reason: "Ada 2 variabel (x dan y), masing-masing berpangkat 1, dan kedua koefisiennya bukan nol.", c: "text-green-400" },
                        { ex: "b. x² − y = 5", verdict: "❌ Bukan PLDV", reason: "Pangkat x adalah 2, bukan 1. Ini adalah persamaan kuadrat.", c: "text-red-400" },
                        { ex: "c. 5x − y = 0", verdict: "✅ PLDV", reason: "Ada 2 variabel (x dan y), keduanya berpangkat 1. Konstanta 0 tetap valid.", c: "text-green-400" },
                        { ex: "d. 2x = 8", verdict: "❌ Bukan PLDV", reason: "Hanya ada satu variabel (x). PLDV wajib memiliki tepat dua variabel.", c: "text-red-400" },
                      ].map(({ ex, verdict, reason, c }) => (
                        <div key={ex} className="bg-slate-800/40 border border-white/10 rounded-lg px-3 py-2">
                          <p className="font-mono text-white/80">{ex}</p>
                          <p className={`font-bold text-xs mt-1 ${c}`}>{verdict}</p>
                          <p className="text-xs text-white/50 mt-0.5">{reason}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 PLDV yang valid: <strong>a</strong> dan <strong>c</strong>.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* CONTOH SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">Contoh Soal 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Diketahui SPLDV: <InlineMath math="2x + y = 7" /> dan <InlineMath math="x - y = 2" />. Periksa apakah pasangan berikut merupakan solusi SPLDV:<br />
                      a. <InlineMath math="(x, y) = (3, 1)" /><br />
                      b. <InlineMath math="(x, y) = (2, 3)" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Cek <InlineMath math="(3, 1)" /> — substitusi ke kedua persamaan:</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 space-y-1">
                        <BlockMath math="\text{P1: } 2(3) + 1 = 6 + 1 = 7 \checkmark" />
                        <BlockMath math="\text{P2: } 3 - 1 = 2 \checkmark" />
                      </div>
                      <p className="font-body text-xs text-green-300 mt-1">✅ Kedua persamaan terpenuhi → <InlineMath math="(3, 1)" /> adalah solusi SPLDV.</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Cek <InlineMath math="(2, 3)" /> — substitusi ke kedua persamaan:</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 space-y-1">
                        <BlockMath math="\text{P1: } 2(2) + 3 = 4 + 3 = 7 \checkmark" />
                        <BlockMath math="\text{P2: } 2 - 3 = -1 \neq 2 \times" />
                      </div>
                      <p className="font-body text-xs text-red-300 mt-1">❌ Persamaan 2 tidak terpenuhi → <InlineMath math="(2, 3)" /> bukan solusi SPLDV.</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Solusi SPLDV harus memenuhi SEMUA persamaan dalam sistem secara bersamaan!</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* CONTOH SOAL 3 — SULIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">Contoh Soal 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90 leading-relaxed">
                      Tentukan apakah setiap SPLDV berikut memiliki <strong className="text-emerald-300">tepat satu penyelesaian</strong>, <strong className="text-yellow-300">tak hingga penyelesaian</strong>, atau <strong className="text-red-300">tidak memiliki penyelesaian</strong>!
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-body">
                      {[
                        { no: "a", sys: String.raw`\begin{cases} x + 2y = 6 \\ 3x - y = 4 \end{cases}` },
                        { no: "b", sys: String.raw`\begin{cases} 2x + 4y = 8 \\ x + 2y = 4 \end{cases}` },
                        { no: "c", sys: String.raw`\begin{cases} 3x - 6y = 9 \\ x - 2y = 5 \end{cases}` },
                        { no: "d", sys: String.raw`\begin{cases} 5x + y = 10 \\ 10x + 2y = 20 \end{cases}` },
                        { no: "e", sys: String.raw`\begin{cases} 4x - 2y = 6 \\ 6x - 3y = 9 \end{cases}` },
                        { no: "f", sys: String.raw`\begin{cases} x + 3y = 7 \\ 2x + 6y = 15 \end{cases}` },
                      ].map(({ no, sys }) => (
                        <div key={no} className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2">
                          <p className="font-body text-xs text-white/50 mb-1 font-bold">{no}.</p>
                          <BlockMath math={sys} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>

                    {/* Kunci cara cepat */}
                    <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3 space-y-2">
                      <p className="font-body text-xs font-bold text-cyan-300">🔑 Cara Cepat Menentukan Jenis Penyelesaian</p>
                      <p className="font-body text-xs text-white/70">Untuk SPLDV <InlineMath math="a_1x+b_1y=c_1" /> dan <InlineMath math="a_2x+b_2y=c_2" />, bandingkan rasio koefisiennya:</p>
                      <div className="space-y-1 text-xs font-body">
                        <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                          <span className="text-emerald-300 font-bold shrink-0">🎯 1 penyelesaian:</span>
                          <span className="text-white/70"><InlineMath math="\dfrac{a_1}{a_2} \neq \dfrac{b_1}{b_2}" /> (gradien berbeda, garis berpotongan)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                          <span className="text-yellow-300 font-bold shrink-0">♾️ Tak hingga:</span>
                          <span className="text-white/70"><InlineMath math="\dfrac{a_1}{a_2} = \dfrac{b_1}{b_2} = \dfrac{c_1}{c_2}" /> (garis berimpit)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/20 rounded-lg px-3 py-1.5">
                          <span className="text-red-300 font-bold shrink-0">∅ Tidak ada:</span>
                          <span className="text-white/70"><InlineMath math="\dfrac{a_1}{a_2} = \dfrac{b_1}{b_2} \neq \dfrac{c_1}{c_2}" /> (garis sejajar)</span>
                        </div>
                      </div>
                    </div>

                    {/* Pembahasan tiap soal */}
                    <div className="space-y-3">

                      {/* a */}
                      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-3 space-y-1">
                        <p className="font-body text-xs font-bold text-emerald-300">a. <InlineMath math="x + 2y = 6" /> dan <InlineMath math="3x - y = 4" /></p>
                        <p className="font-body text-xs text-white/70">Bandingkan rasio: <InlineMath math="\dfrac{a_1}{a_2} = \dfrac{1}{3}" />, <InlineMath math="\dfrac{b_1}{b_2} = \dfrac{2}{-1} = -2" /></p>
                        <p className="font-body text-xs text-white/70"><InlineMath math="\dfrac{1}{3} \neq -2" /> → gradien berbeda → garis berpotongan</p>
                        <p className="font-body text-xs font-bold text-emerald-300">✅ Tepat satu penyelesaian</p>
                      </div>

                      {/* b */}
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 space-y-1">
                        <p className="font-body text-xs font-bold text-yellow-300">b. <InlineMath math="2x + 4y = 8" /> dan <InlineMath math="x + 2y = 4" /></p>
                        <p className="font-body text-xs text-white/70">Persamaan 2 dikalikan 2: <InlineMath math="2x + 4y = 8" /> → identik dengan persamaan 1</p>
                        <p className="font-body text-xs text-white/70">Rasio: <InlineMath math="\dfrac{2}{1} = \dfrac{4}{2} = \dfrac{8}{4} = 2" /> → semua rasio sama</p>
                        <p className="font-body text-xs font-bold text-yellow-300">♾️ Tak hingga penyelesaian</p>
                      </div>

                      {/* c */}
                      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 space-y-1">
                        <p className="font-body text-xs font-bold text-red-300">c. <InlineMath math="3x - 6y = 9" /> dan <InlineMath math="x - 2y = 5" /></p>
                        <p className="font-body text-xs text-white/70">Rasio koefisien: <InlineMath math="\dfrac{3}{1} = \dfrac{-6}{-2} = 3" />, rasio konstanta: <InlineMath math="\dfrac{9}{5}" /></p>
                        <p className="font-body text-xs text-white/70"><InlineMath math="3 \neq \dfrac{9}{5}" /> → koefisien sebanding, konstanta tidak → garis sejajar</p>
                        <p className="font-body text-xs font-bold text-red-300">∅ Tidak memiliki penyelesaian</p>
                      </div>

                      {/* d */}
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 space-y-1">
                        <p className="font-body text-xs font-bold text-yellow-300">d. <InlineMath math="5x + y = 10" /> dan <InlineMath math="10x + 2y = 20" /></p>
                        <p className="font-body text-xs text-white/70">Persamaan 2 dikalikan <InlineMath math="\tfrac{1}{2}" />: <InlineMath math="5x + y = 10" /> → identik dengan persamaan 1</p>
                        <p className="font-body text-xs text-white/70">Rasio: <InlineMath math="\dfrac{5}{10} = \dfrac{1}{2} = \dfrac{10}{20} = \dfrac{1}{2}" /> → semua rasio sama</p>
                        <p className="font-body text-xs font-bold text-yellow-300">♾️ Tak hingga penyelesaian</p>
                      </div>

                      {/* e */}
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 space-y-1">
                        <p className="font-body text-xs font-bold text-yellow-300">e. <InlineMath math="4x - 2y = 6" /> dan <InlineMath math="6x - 3y = 9" /></p>
                        <p className="font-body text-xs text-white/70">Rasio: <InlineMath math="\dfrac{4}{6} = \dfrac{2}{3}" />, <InlineMath math="\dfrac{-2}{-3} = \dfrac{2}{3}" />, <InlineMath math="\dfrac{6}{9} = \dfrac{2}{3}" /> → semua rasio sama</p>
                        <p className="font-body text-xs text-white/70">Persamaan 2 = <InlineMath math="\tfrac{3}{2}" /> kali persamaan 1 → garis berimpit</p>
                        <p className="font-body text-xs font-bold text-yellow-300">♾️ Tak hingga penyelesaian</p>
                      </div>

                      {/* f */}
                      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 space-y-1">
                        <p className="font-body text-xs font-bold text-red-300">f. <InlineMath math="x + 3y = 7" /> dan <InlineMath math="2x + 6y = 15" /></p>
                        <p className="font-body text-xs text-white/70">Rasio koefisien: <InlineMath math="\dfrac{1}{2} = \dfrac{3}{6} = \dfrac{1}{2}" />, rasio konstanta: <InlineMath math="\dfrac{7}{15}" /></p>
                        <p className="font-body text-xs text-white/70"><InlineMath math="\dfrac{1}{2} \neq \dfrac{7}{15}" /> → koefisien sebanding, konstanta tidak → garis sejajar</p>
                        <p className="font-body text-xs font-bold text-red-300">∅ Tidak memiliki penyelesaian</p>
                      </div>

                    </div>

                    {/* Tabel Rekapitulasi */}
                    <div className="space-y-1">
                      <p className="font-body text-xs font-bold text-white">📊 Rekapitulasi Jawaban</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body border-collapse">
                          <thead>
                            <tr className="bg-slate-700/60">
                              <th className="border border-white/15 px-3 py-2 text-white/80 text-left">SPLDV</th>
                              <th className="border border-white/15 px-3 py-2 text-white/80 text-center">Jenis Penyelesaian</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { lbl: "a. x + 2y = 6  ;  3x − y = 4", result: "🎯 Tepat satu penyelesaian", c: "text-emerald-300" },
                              { lbl: "b. 2x + 4y = 8  ;  x + 2y = 4", result: "♾️ Tak hingga penyelesaian", c: "text-yellow-300" },
                              { lbl: "c. 3x − 6y = 9  ;  x − 2y = 5", result: "∅ Tidak memiliki penyelesaian", c: "text-red-300" },
                              { lbl: "d. 5x + y = 10  ;  10x + 2y = 20", result: "♾️ Tak hingga penyelesaian", c: "text-yellow-300" },
                              { lbl: "e. 4x − 2y = 6  ;  6x − 3y = 9", result: "♾️ Tak hingga penyelesaian", c: "text-yellow-300" },
                              { lbl: "f. x + 3y = 7  ;  2x + 6y = 15", result: "∅ Tidak memiliki penyelesaian", c: "text-red-300" },
                            ].map(({ lbl, result, c }, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                                <td className="border border-white/10 px-3 py-2 text-white/70 font-mono">{lbl}</td>
                                <td className={`border border-white/10 px-3 py-2 text-center font-bold ${c}`}>{result}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">💡 Ingat: cukup bandingkan rasio koefisien <InlineMath math="\tfrac{a_1}{a_2}" />, <InlineMath math="\tfrac{b_1}{b_2}" />, dan <InlineMath math="\tfrac{c_1}{c_2}" /> — tidak perlu menyelesaikan SPLDV-nya secara lengkap!</p>
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
                    { poin: "PLDV adalah persamaan linear dengan tepat dua variabel berpangkat 1: ax + by = c (a, b ≠ 0).", icon: "📐" },
                    { poin: "Satu PLDV memiliki tak hingga solusi karena hanya ada satu persamaan untuk dua ketidaktahuan.", icon: "♾️" },
                    { poin: "SPLDV adalah sistem dua PLDV yang harus dipenuhi secara bersamaan oleh (x, y).", icon: "🔗" },
                    { poin: "Solusi SPLDV bisa: satu pasangan (x, y), tak hingga, atau tidak ada sama sekali.", icon: "🔢" },
                    { poin: "Untuk memverifikasi solusi, substitusikan ke KEDUA persamaan — keduanya harus benar.", icon: "✅" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="\text{PLDV: } ax + by = c \quad \longrightarrow \quad \text{SPLDV: } \begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}" />
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

export default DefinisiSPLDVPage;
