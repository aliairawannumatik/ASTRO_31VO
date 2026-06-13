import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Code } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import FunctionMachineAnimation from "@/components/FunctionMachineAnimation";

const NotasiFungsiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "notasi", "operasi", "komposisi", "contoh1", "contoh2", "contoh3", "contoh4", "rangkuman",
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

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Code className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          NOTASI DAN RUMUS FUNGSI
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Bahasa Matematika Untuk Mengekspresikan Fungsi!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Notasi Fungsi — Bahasa Singkat yang Powerful" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Daripada selalu menulis "fungsi yang memetakan x menjadi dua kali x tambah tiga", matematikawan menggunakan notasi singkat yang universal. Notasi ini memungkinkan kita mengomunikasikan aturan fungsi secara efisien dan presisi.
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">📖 Anatomi Notasi Fungsi</p>
                  <div className="text-center">
                    <BlockMath math="f : A \to B,\ f(x) = 2x + 3" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body mt-3">
                    {[
                      { simbol: "f", arti: "Nama fungsi (bisa juga g, h, p, dll.)", color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-200" },
                      { simbol: "A → B", arti: "Fungsi memetakan dari himpunan A ke himpunan B", color: "bg-violet-900/40 border-violet-500/30 text-violet-200" },
                      { simbol: "f(x)", arti: "Nilai fungsi f saat input adalah x (dibaca: 'f dari x')", color: "bg-green-900/40 border-green-500/30 text-green-200" },
                      { simbol: "2x + 3", arti: "Aturan/rumus yang menghubungkan x dengan nilai keluarannya", color: "bg-orange-900/40 border-orange-500/30 text-orange-200" },
                    ].map(({ simbol, arti, color }) => (
                      <div key={simbol} className={`border ${color} rounded-lg px-3 py-2 flex gap-2 items-start`}>
                        <code className="font-bold font-mono text-sm shrink-0">{simbol}</code>
                        <span className="text-white/70">→ {arti}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NOTASI & CARA BACA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="notasi" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Bentuk Notasi dan Cara Membaca" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Fungsi <InlineMath math="f" /> dari himpunan <InlineMath math="A" /> ke himpunan <InlineMath math="B" /> ditulis <InlineMath math="f : A \to B" />. Jika <InlineMath math="x \in A" /> dipetakan ke <InlineMath math="y \in B" />, kita tulis <InlineMath math="f(x) = y" /> atau <InlineMath math="y = f(x)" />. Nilai <InlineMath math="y" /> disebut <strong className="text-yellow-300">bayangan</strong> atau <strong className="text-yellow-300">peta</strong> dari <InlineMath math="x" /> oleh fungsi <InlineMath math="f" />.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">📋 Cara Membaca Notasi Fungsi</p>
                  {[
                    { notasi: "f : A \\to B", baca: "f adalah fungsi dari A ke B", color: "cyan" },
                    { notasi: "f(x) = 3x - 1", baca: "f dari x sama dengan tiga x dikurangi satu", color: "violet" },
                    { notasi: "f(2) = 5", baca: "nilai f saat x = 2 adalah 5", color: "green" },
                    { notasi: "x \\mapsto 2x + 3", baca: "x dipetakan ke dua x tambah tiga", color: "orange" },
                  ].map(({ notasi, baca, color }) => (
                    <div key={notasi} className={`bg-${color}-900/20 border border-${color}-500/30 rounded-lg p-3 flex flex-col sm:flex-row gap-2`}>
                      <div className={`bg-${color}-900/40 rounded-lg px-3 py-2 text-sm font-mono min-w-fit`}>
                        <InlineMath math={notasi} />
                      </div>
                      <div className={`text-${color}-200 text-sm font-body flex items-center`}>→ "{baca}"</div>
                    </div>
                  ))}
                </div>

                {/* Menghitung nilai fungsi */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">🔢 Cara Menghitung Nilai Fungsi</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold text-xs mb-2">Contoh: Jika f(x) = 4x - 5, hitung f(3)</p>
                      <div className="space-y-1 text-xs text-white/70">
                        <p>Langkah 1: Tulis rumus fungsi</p>
                        <BlockMath math="f(x) = 4x - 5" />
                        <p>Langkah 2: Ganti semua x dengan 3</p>
                        <BlockMath math="f(3) = 4(3) - 5 = 12 - 5 = 7" />
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                      <p className="text-xs text-yellow-200"><strong>💡 Kunci:</strong> Ganti variabel x dengan nilai yang diberikan, lalu hitung hasilnya!</p>
                    </div>
                  </div>
                </div>

                {/* Mesin Fungsi Interaktif */}
                <FunctionMachineAnimation />

              </div>
            )}
          </div>

          {/* OPERASI PADA FUNGSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="operasi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-orange-400" title="🔧 Operasi pada Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">Dua fungsi atau lebih bisa dioperasikan untuk menghasilkan fungsi baru:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-orange-900/40">
                        <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">Operasi</th>
                        <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">Notasi</th>
                        <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">Definisi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Penjumlahan", "(f + g)(x)", "f(x) + g(x)"],
                        ["Pengurangan", "(f - g)(x)", "f(x) - g(x)"],
                        ["Perkalian", "(f · g)(x)", "f(x) × g(x)"],
                        ["Pembagian", "(f/g)(x)", "f(x) ÷ g(x), dengan g(x) ≠ 0"],
                      ].map(([op, not, def], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-orange-300 font-semibold">{op}</td>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-mono">{not}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{def}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-orange-300 mb-2">Contoh: f(x) = 3x + 1 dan g(x) = x - 2</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-white/70"><BlockMath math="(f+g)(x) = (3x+1) + (x-2) = 4x - 1" /></div>
                    <div className="text-white/70"><BlockMath math="(f-g)(x) = (3x+1) - (x-2) = 2x + 3" /></div>
                    <div className="text-white/70"><BlockMath math="(f \cdot g)(x) = (3x+1)(x-2) = 3x^2 - 5x - 2" /></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui fungsi <InlineMath math="f(x) = 5x - 3" />. Hitunglah:
                    <br />a) <InlineMath math="f(0)" />
                    <br />b) <InlineMath math="f(4)" />
                    <br />c) <InlineMath math="f(-2)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    {[
                      { bagian: "a) f(0)", sub: "x = 0", kalkulasi: "f(0) = 5(0) - 3 = 0 - 3 = -3", hasil: "-3" },
                      { bagian: "b) f(4)", sub: "x = 4", kalkulasi: "f(4) = 5(4) - 3 = 20 - 3 = 17", hasil: "17" },
                      { bagian: "c) f(-2)", sub: "x = -2", kalkulasi: "f(-2) = 5(-2) - 3 = -10 - 3 = -13", hasil: "-13" },
                    ].map(({ bagian, sub, kalkulasi, hasil }) => (
                      <div key={bagian} className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-cyan-300 font-semibold text-xs mb-1">{bagian} ({sub})</p>
                        <p className="text-white/70 text-xs">{kalkulasi}</p>
                        <p className="text-green-300 font-bold text-sm mt-1">Hasil: {hasil}</p>
                      </div>
                    ))}
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">✅ f(0) = -3, f(4) = 17, f(-2) = -13</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="f(x) = 3x - 2" /> dan <InlineMath math="g(x) = x^2 + 1" />. Tentukan:
                    <br />a) <InlineMath math="(f + g)(3)" />
                    <br />b) <InlineMath math="(f - g)(-1)" />
                    <br />c) <InlineMath math="(f \cdot g)(2)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) (f + g)(3):</p>
                      <p className="text-white/60 text-xs mb-1">Hitung dulu f(3) dan g(3):</p>
                      <BlockMath math="f(3) = 3(3) - 2 = 7" />
                      <BlockMath math="g(3) = 3^2 + 1 = 10" />
                      <BlockMath math="(f+g)(3) = f(3) + g(3) = 7 + 10 = 17" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">b) (f - g)(-1):</p>
                      <BlockMath math="f(-1) = 3(-1) - 2 = -5" />
                      <BlockMath math="g(-1) = (-1)^2 + 1 = 2" />
                      <BlockMath math="(f-g)(-1) = -5 - 2 = -7" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2">c) (f · g)(2):</p>
                      <BlockMath math="f(2) = 3(2) - 2 = 4" />
                      <BlockMath math="g(2) = 2^2 + 1 = 5" />
                      <BlockMath math="(f \cdot g)(2) = 4 \times 5 = 20" />
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ (f+g)(3) = 17, (f-g)(-1) = -7, (f·g)(2) = 20</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui fungsi <InlineMath math="f(x) = px + q" />. Jika <InlineMath math="f(3) = 11" /> dan <InlineMath math="f(5) = 17" />, tentukan:
                    <br />a) Nilai p dan q
                    <br />b) Rumus fungsi f(x)
                    <br />c) Nilai x jika <InlineMath math="f(x) = 29" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Mencari p dan q:</p>
                      <p className="text-white/60 text-xs mb-1">Substitusi ke f(x) = px + q:</p>
                      <BlockMath math="f(3) = 3p + q = 11 \quad \cdots (1)" />
                      <BlockMath math="f(5) = 5p + q = 17 \quad \cdots (2)" />
                      <p className="text-white/60 text-xs mt-1 mb-1">Eliminasi: (2) - (1):</p>
                      <BlockMath math="2p = 6 \implies p = 3" />
                      <p className="text-white/60 text-xs mb-1">Substitusi p=3 ke (1):</p>
                      <BlockMath math="3(3) + q = 11 \implies 9 + q = 11 \implies q = 2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Rumus Fungsi:</p>
                      <BlockMath math="f(x) = 3x + 2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">c) Mencari x jika f(x) = 29:</p>
                      <BlockMath math="3x + 2 = 29" />
                      <BlockMath math="3x = 27 \implies x = 9" />
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ p = 3, q = 2, f(x) = 3x + 2, dan x = 9 saat f(x) = 29</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="✏️ Contoh 4 — Mencari Nilai x dari Bayangan" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="TANTANGAN" color="bg-purple-700/60 text-purple-200" />
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-purple-200 leading-relaxed">
                    <strong>🎯 Konsep:</strong> Jika diketahui fungsi f(x) dan <em>bayangan</em> (nilai f(x)), kita bisa mencari nilai x dengan menyelesaikan persamaan. Bayangan = hasil keluaran dari fungsi.
                  </p>
                </div>

                {/* Sub-soal a */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">📝 Soal a</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui fungsi <InlineMath math="f(x) = 4x - 6" />. Jika bayangan dari <InlineMath math="x" /> adalah <InlineMath math="18" />, tentukan nilai <InlineMath math="x" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Penyelesaian a</p>
                  <p className="font-body text-xs text-white/60">Bayangan dari x adalah 18, artinya f(x) = 18. Kita substitusikan ke rumus fungsi:</p>
                  <BlockMath math="f(x) = 18" />
                  <BlockMath math="4x - 6 = 18" />
                  <BlockMath math="4x = 18 + 6 = 24" />
                  <BlockMath math="x = \frac{24}{4} = 6" />
                  <div className="bg-purple-500/10 border border-purple-500/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-sm font-bold text-purple-300">✅ Nilai x = 6</p>
                    <p className="font-body text-xs text-white/50 mt-1">Verifikasi: f(6) = 4(6) − 6 = 24 − 6 = 18 ✓</p>
                  </div>
                </div>

                {/* Sub-soal b */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">📝 Soal b</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui fungsi <InlineMath math="g(x) = 3x + 5" />. Bayangan dari <InlineMath math="x" /> oleh fungsi <InlineMath math="g" /> adalah <InlineMath math="-7" />. Tentukan nilai <InlineMath math="x" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Penyelesaian b</p>
                  <p className="font-body text-xs text-white/60">Bayangan −7 berarti g(x) = −7:</p>
                  <BlockMath math="g(x) = -7" />
                  <BlockMath math="3x + 5 = -7" />
                  <BlockMath math="3x = -7 - 5 = -12" />
                  <BlockMath math="x = \frac{-12}{3} = -4" />
                  <div className="bg-purple-500/10 border border-purple-500/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-sm font-bold text-purple-300">✅ Nilai x = −4</p>
                    <p className="font-body text-xs text-white/50 mt-1">Verifikasi: g(−4) = 3(−4) + 5 = −12 + 5 = −7 ✓</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Ingat:</strong> "Bayangan dari x adalah k" sama artinya dengan f(x) = k. Tinggal substitusi dan selesaikan persamaannya untuk mencari x!
                  </p>
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
                    ["Notasi Fungsi", "f : A → B atau f(x) = ... "],
                    ["f(x)", "Nilai fungsi f saat input adalah x (bayangan dari x)"],
                    ["Cara Hitung", "Ganti variabel x dengan nilai yang diberikan"],
                    ["Operasi Fungsi", "(f±g)(x) = f(x) ± g(x), (f·g)(x) = f(x)·g(x)"],
                    ["Mencari x", "Jika f(x) = k diketahui, selesaikan persamaan untuk x"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Tip:</strong> Ketika diminta mencari nilai x dari f(x) = k, anggap saja seperti menyelesaikan persamaan biasa — isolasi x di satu sisi!
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

export default NotasiFungsiPage;
