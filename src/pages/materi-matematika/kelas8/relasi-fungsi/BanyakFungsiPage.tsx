import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Hash } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BanyakFungsiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus", "korespondensi", "contoh1", "contoh2", "contoh3", "rangkuman",
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
        <Hash className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          MENENTUKAN BANYAK FUNGSI & KORESPONDENSI SATU-SATU
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Hitung Berapa Fungsi yang Bisa Dibentuk!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Berapa Banyak Fungsi yang Bisa Dibuat?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Diberikan dua himpunan, berapa banyak fungsi yang bisa kita buat dari satu himpunan ke himpunan lain? Pertanyaan ini punya jawaban matematika yang elegan dan bisa dihitung dengan rumus sederhana!
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔢 Ide Dasar</p>
                  <p className="font-body text-sm text-white/70 leading-relaxed">
                    Jika <InlineMath math="A = \{1, 2\}" /> dan <InlineMath math="B = \{a, b, c\}" />, maka setiap anggota A bisa dipasangkan ke salah satu dari 3 pilihan di B.
                    Karena ada 2 anggota di A, maka total fungsi = <InlineMath math="3 \times 3 = 3^2 = 9" /> fungsi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS BANYAK FUNGSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Rumus Menentukan Banyak Fungsi" />
            {expandedSections.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jika <InlineMath math="n(A)" /> menyatakan banyak anggota himpunan A dan <InlineMath math="n(B)" /> menyatakan banyak anggota himpunan B, maka banyak fungsi yang dapat dibentuk dari A ke B adalah:
                  </p>
                  <div className="bg-violet-900/40 border border-violet-400/40 rounded-xl p-4 mt-3 text-center">
                    <BlockMath math="\text{Banyak fungsi dari } A \text{ ke } B = n(B)^{n(A)}" />
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">🔎 Mengapa Rumusnya Demikian?</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold text-xs mb-1">Misalkan A = &#123;a₁, a₂, ..., aₘ&#125; dan B = &#123;b₁, b₂, ..., bₙ&#125;</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><InlineMath math="a_1" /> bisa dipasangkan ke salah satu dari <InlineMath math="n" /> pilihan di B</li>
                        <li><InlineMath math="a_2" /> bisa dipasangkan ke salah satu dari <InlineMath math="n" /> pilihan di B</li>
                        <li>... dan seterusnya hingga <InlineMath math="a_m" /></li>
                      </ul>
                      <p className="text-white/70 text-xs mt-2">Total = <InlineMath math="n \times n \times \cdots \times n" /> (sebanyak m kali) <InlineMath math="= n^m" /></p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">n(A)</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">n(B)</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Banyak Fungsi A→B</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Banyak Fungsi B→A</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [2, 2, "2²=4", "2²=4"],
                        [2, 3, "3²=9", "2³=8"],
                        [3, 2, "2³=8", "3²=9"],
                        [3, 4, "4³=64", "3⁴=81"],
                        [4, 3, "3⁴=81", "4³=64"],
                      ].map(([nA, nB, f1, f2], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{nA}</td>
                          <td className="border border-white/10 px-3 py-2 text-violet-300 font-bold text-center">{nB}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300 font-mono text-center">{f1}</td>
                          <td className="border border-white/10 px-3 py-2 text-orange-300 font-mono text-center">{f2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* KORESPONDENSI SATU-SATU */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="korespondensi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-green-400" title="🔗 Korespondensi Satu-Satu (Bijeksi)" />
            {expandedSections.includes("korespondensi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Korespondensi satu-satu</strong> (bijeksi) adalah fungsi yang memenuhi dua syarat sekaligus:
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-2 text-sm text-white/80">
                      <span className="text-green-400 shrink-0">1.</span>
                      <p><strong className="text-yellow-300">Injektif (satu-satu):</strong> Setiap anggota kodomain dipasangkan oleh paling banyak satu anggota domain. Tidak ada dua anggota domain yang punya pasangan sama.</p>
                    </div>
                    <div className="flex gap-2 text-sm text-white/80">
                      <span className="text-green-400 shrink-0">2.</span>
                      <p><strong className="text-orange-300">Surjektif (pada):</strong> Setiap anggota kodomain punya pasangan (tidak ada yang "menganggur").</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">📐 Syarat Korespondensi Satu-Satu</p>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                    <p className="text-sm text-white/80 font-body">Korespondensi satu-satu hanya dapat terjadi jika:</p>
                    <BlockMath math="n(A) = n(B)" />
                    <p className="text-xs text-white/50">Jumlah anggota domain dan kodomain harus sama!</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">🔢 Rumus Banyak Korespondensi Satu-Satu</p>
                  <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-4 text-center">
                    <BlockMath math="\text{Banyak korespondensi satu-satu} = n! = n \times (n-1) \times \cdots \times 2 \times 1" />
                    <p className="text-xs text-white/50 mt-1">di mana n = n(A) = n(B)</p>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-violet-900/40">
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">n(A) = n(B)</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">n! (Faktorial)</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">Banyak Korespondensi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "1! = 1", 1],
                          [2, "2! = 2×1", 2],
                          [3, "3! = 3×2×1", 6],
                          [4, "4! = 4×3×2×1", 24],
                          [5, "5! = 5×4×3×2×1", 120],
                        ].map(([n, faktr, hasil], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                            <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{n}</td>
                            <td className="border border-white/10 px-3 py-2 text-white/70 text-center">{faktr}</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 font-bold text-center">{hasil}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual korespondensi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-300 text-center mb-2">✅ KORESPONDENSI SATU-SATU</p>
                    <div className="flex gap-3 justify-center items-center">
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-cyan-400 font-bold">A</p>
                        {["1", "2", "3"].map(x => <div key={x} className="bg-cyan-800/40 rounded px-3 py-1 text-cyan-200 text-xs font-bold">{x}</div>)}
                      </div>
                      <div className="flex flex-col gap-1.5 pt-5">
                        {["→", "→", "→"].map((a, i) => <span key={i} className="text-green-400 font-bold">{a}</span>)}
                      </div>
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-violet-400 font-bold">B</p>
                        {["a", "b", "c"].map(x => <div key={x} className="bg-violet-800/40 rounded px-3 py-1 text-violet-200 text-xs font-bold">{x}</div>)}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 text-center mt-2">n(A)=n(B)=3, tiap elemen berpasangan tepat satu</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-red-300 text-center mb-2">❌ BUKAN KORESPONDENSI 1-1</p>
                    <div className="flex gap-3 justify-center items-center">
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-cyan-400 font-bold">A</p>
                        {["1", "2", "3"].map(x => <div key={x} className="bg-cyan-800/40 rounded px-3 py-1 text-cyan-200 text-xs font-bold">{x}</div>)}
                      </div>
                      <div className="flex flex-col gap-1.5 pt-5">
                        <span className="text-red-400 font-bold">→</span>
                        <span className="text-red-400 font-bold">→</span>
                        <span className="text-red-400 font-bold">→</span>
                      </div>
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-violet-400 font-bold">B</p>
                        {["a", "b", "c", "d"].map(x => <div key={x} className="bg-violet-800/40 rounded px-3 py-1 text-violet-200 text-xs font-bold">{x}</div>)}
                      </div>
                    </div>
                    <p className="text-xs text-red-400 text-center mt-2">n(A)≠n(B), elemen d tidak punya pasangan</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="A = \{p, q, r\}" /> dan <InlineMath math="B = \{1, 2, 3, 4\}" />. Tentukan banyaknya fungsi yang dapat dibuat dari A ke B!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Identifikasi:</p>
                      <p className="text-white/70 text-xs"><InlineMath math="n(A) = 3" /> (banyak anggota domain)</p>
                      <p className="text-white/70 text-xs"><InlineMath math="n(B) = 4" /> (banyak pilihan untuk setiap anggota A)</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Gunakan Rumus:</p>
                      <BlockMath math="\text{Banyak fungsi} = n(B)^{n(A)} = 4^3 = 64" />
                    </div>
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">✅ Banyak fungsi dari A ke B = <strong>64 fungsi</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="P = \{a, b, c, d\}" /> dan <InlineMath math="Q = \{1, 2, 3, 4\}" />.
                    <br />a) Berapa banyak korespondensi satu-satu dari P ke Q?
                    <br />b) Berapa banyak fungsi (bukan hanya korespondensi) dari P ke Q?
                    <br />c) Berapa perbandingan keduanya?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">Identifikasi:</p>
                      <p className="text-white/60 text-xs"><InlineMath math="n(P) = 4" />, <InlineMath math="n(Q) = 4" /> → n(P) = n(Q) = 4, bisa dibuat korespondensi!</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">a) Korespondensi Satu-Satu:</p>
                      <BlockMath math="n! = 4! = 4 \times 3 \times 2 \times 1 = 24" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">b) Semua Fungsi dari P ke Q:</p>
                      <BlockMath math="n(Q)^{n(P)} = 4^4 = 256" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">c) Perbandingan:</p>
                      <BlockMath math="\frac{\text{Korespondensi}}{\text{Total Fungsi}} = \frac{24}{256} = \frac{3}{32}" />
                      <p className="text-white/50 text-xs mt-1">Hanya sekitar 9,4% dari semua fungsi yang merupakan korespondensi satu-satu!</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ Korespondensi = 24, Total Fungsi = 256</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Himpunan <InlineMath math="A" /> mempunyai <InlineMath math="n(A) = m" /> anggota dan himpunan <InlineMath math="B" /> mempunyai <InlineMath math="n(B) = 4" /> anggota. Jika banyaknya fungsi dari A ke B adalah 1024, tentukan:
                    <br />a) Nilai <InlineMath math="m" />
                    <br />b) Apakah mungkin membuat korespondensi satu-satu dari A ke B? Jika ya, berapa banyaknya?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Mencari nilai m:</p>
                      <p className="text-white/70 text-xs mb-1">Gunakan rumus banyak fungsi:</p>
                      <BlockMath math="n(B)^{n(A)} = 1024" />
                      <BlockMath math="4^m = 1024" />
                      <p className="text-white/70 text-xs mb-1">Ingat bahwa <InlineMath math="1024 = 2^{10}" /> dan <InlineMath math="4 = 2^2" />, maka:</p>
                      <BlockMath math="(2^2)^m = 2^{10} \implies 2^{2m} = 2^{10}" />
                      <BlockMath math="2m = 10 \implies m = 5" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Korespondensi Satu-Satu?</p>
                      <p className="text-white/70 text-xs">n(A) = 5, n(B) = 4</p>
                      <p className="text-white/70 text-xs mt-1">Karena <InlineMath math="n(A) \neq n(B)" /> (5 ≠ 4), maka <strong className="text-red-300">korespondensi satu-satu tidak mungkin dibuat</strong>.</p>
                      <p className="text-white/50 text-xs mt-1">Syarat korespondensi satu-satu adalah n(A) = n(B).</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ m = 5. Korespondensi satu-satu tidak mungkin karena n(A) ≠ n(B).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Banyak Fungsi A→B", "n(B)^n(A) — kodomain pangkat domain"],
                    ["Korespondensi Satu-Satu", "Fungsi bijektif: injektif + surjektif"],
                    ["Syarat Korespondensi", "n(A) = n(B) — jumlah anggota harus sama"],
                    ["Banyak Korespondensi", "n! (n faktorial) di mana n = n(A) = n(B)"],
                    ["Faktorial", "n! = n × (n-1) × ... × 2 × 1"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Trik cepat:</strong> Untuk menghitung <InlineMath math="n!" />, hitung mundur dari n sambil dikalikan: 5! = 5×4×3×2×1 = 120.
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

export default BanyakFungsiPage;
