import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Zap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import DiskMillMachine from "@/components/DiskMillMachine";

const PengertianFungsiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "penyajian", "bukan-fungsi", "contoh1", "contoh2", "contoh3", "rangkuman",
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
        <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGERTIAN FUNGSI DAN PENYAJIANNYA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Relasi Spesial: Satu Masukan, Tepat Satu Keluaran!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Fungsi — Relasi yang Lebih Ketat Aturannya" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan sebuah mesin pencetak nama: kamu masukkan satu nama, mesin mencetak satu label. Tidak mungkin mesin mencetak dua label berbeda dari satu nama yang sama. Itulah inti dari <strong className="text-cyan-300">fungsi</strong> — setiap masukan hanya punya <strong className="text-cyan-300">tepat satu keluaran</strong>.
                </p>
                <DiskMillMachine />
              </div>
            )}
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Syarat dan Konsep Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Fungsi</strong> (atau pemetaan) dari himpunan <InlineMath math="A" /> ke himpunan <InlineMath math="B" /> adalah relasi yang memenuhi syarat: <strong className="text-yellow-300">setiap anggota domain (A) dipasangkan dengan tepat satu anggota kodomain (B)</strong>.
                  </p>
                </div>

                {/* Syarat fungsi */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">✅ Syarat Suatu Relasi Disebut Fungsi:</p>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      { no: "1", syarat: "Setiap anggota domain harus dipasangkan", detail: "Tidak boleh ada anggota A yang tidak punya pasangan di B", color: "border-cyan-500/30 bg-cyan-900/10" },
                      { no: "2", syarat: "Setiap anggota domain hanya boleh dipasangkan SATU kali", detail: "Tidak boleh satu anggota A punya dua pasangan berbeda di B", color: "border-green-500/30 bg-green-900/10" },
                    ].map(({ no, syarat, detail, color }) => (
                      <div key={no} className={`border ${color} rounded-lg p-3 flex gap-3`}>
                        <span className="font-display font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm">{no}</span>
                        <div>
                          <p className="text-white font-semibold">{syarat}</p>
                          <p className="text-white/60 text-xs mt-0.5">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>⚠️ Catatan:</strong> Boleh saja dua anggota domain berbeda dipasangkan ke anggota kodomain yang sama. Yang tidak boleh adalah satu anggota domain punya dua keluaran berbeda!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FUNGSI vs BUKAN FUNGSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="bukan-fungsi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-red-400" title="🔍 Fungsi vs Bukan Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* FUNGSI — diagram panah oval */}
                  <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-green-300 mb-2 text-center">✅ INI FUNGSI</p>
                    <div className="flex justify-center">
                      <svg width="230" height="195" viewBox="0 0 230 195">
                        <defs>
                          <marker id="fv-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                          </marker>
                        </defs>
                        {/* Domain oval A */}
                        <ellipse cx="57" cy="100" rx="50" ry="85" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="13" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        <text x="57" y="188" textAnchor="middle" fill="#06b6d4" fontSize="8" opacity="0.55">Domain</text>
                        {/* A elements */}
                        {([["a",48],["b",100],["c",152]] as [string,number][]).map(([el,y]) => (
                          <g key={el}>
                            <ellipse cx={57} cy={y} rx={16} ry={11} fill="rgba(6,182,212,0.18)" stroke="#06b6d4" strokeWidth="1.2"/>
                            <text x={57} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
                        ))}
                        {/* Kodomain oval B */}
                        <ellipse cx="175" cy="103" rx="50" ry="88" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="13" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        <text x="175" y="192" textAnchor="middle" fill="#8b5cf6" fontSize="8" opacity="0.55">Kodomain</text>
                        {/* B elements */}
                        {([["1",44],["2",82],["3",120],["4",158]] as [string,number][]).map(([el,y]) => (
                          <g key={el}>
                            <ellipse cx={175} cy={y} rx={16} ry={11} fill="rgba(139,92,246,0.18)" stroke="#8b5cf6" strokeWidth="1.2"/>
                            <text x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
                        ))}
                        {/* Arrows: a→1, b→1, c→3 */}
                        <path d="M73,48 C110,48 138,44 159,44" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                        <path d="M73,100 C100,92 138,62 159,44" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                        <path d="M73,152 C105,152 138,128 159,120" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1">a→1, b→1, c→3 · Tiap anggota A tepat 1 panah ✓</p>
                  </div>

                  {/* BUKAN FUNGSI — diagram panah oval */}
                  <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-red-300 mb-2 text-center">❌ BUKAN FUNGSI</p>
                    <div className="flex justify-center">
                      <svg width="230" height="185" viewBox="0 0 230 185">
                        <defs>
                          <marker id="bfv-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                          </marker>
                          <marker id="bfv-err" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                            <polygon points="0,0 7,2.5 0,5" fill="#ef4444"/>
                          </marker>
                        </defs>
                        {/* Domain oval A */}
                        <ellipse cx="57" cy="93" rx="50" ry="80" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="11" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        {/* A elements — b highlighted red */}
                        {([["a",48],["b",93],["c",138]] as [string,number][]).map(([el,y]) => (
                          <g key={el}>
                            <ellipse cx={57} cy={y} rx={16} ry={11}
                              fill={el==="b" ? "rgba(239,68,68,0.22)" : "rgba(6,182,212,0.18)"}
                              stroke={el==="b" ? "#ef4444" : "#06b6d4"} strokeWidth="1.2"/>
                            <text x={57} y={y+4} textAnchor="middle"
                              fill={el==="b" ? "#fca5a5" : "#cffafe"} fontSize="12" fontWeight="bold">{el}</text>
                          </g>
                        ))}
                        {/* Kodomain oval B */}
                        <ellipse cx="175" cy="93" rx="50" ry="80" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="11" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        {/* B elements */}
                        {([["1",48],["2",93],["3",138]] as [string,number][]).map(([el,y]) => (
                          <g key={el}>
                            <ellipse cx={175} cy={y} rx={16} ry={11} fill="rgba(139,92,246,0.18)" stroke="#8b5cf6" strokeWidth="1.2"/>
                            <text x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                          </g>
                        ))}
                        {/* Arrows: a→1 ok, b→1 err, b→3 err, c→2 ok */}
                        <path d="M73,48 C108,48 140,48 159,48" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bfv-ok)"/>
                        <path d="M73,93 C98,78 138,60 159,48" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#bfv-err)"/>
                        <path d="M73,93 C98,108 138,128 159,138" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#bfv-err)"/>
                        <path d="M73,138 C105,138 140,100 159,93" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bfv-ok)"/>
                        {/* "2 panah!" label */}
                        <text x="116" y="78" textAnchor="middle" fill="#ef4444" fontSize="8.5" fontWeight="bold">2 panah!</text>
                        <text x="116" y="88" textAnchor="middle" fill="#ef4444" fontSize="7.5" opacity="0.8">↑ tidak boleh</text>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1">
                      <span className="text-red-400">b → 1 dan b → 3 ✗ · b punya 2 panah!</span>
                    </p>
                  </div>
                </div>

                {/* Cara penyajian fungsi */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">📋 Cara Menyajikan Fungsi</p>
                  <div className="space-y-2 text-xs font-body text-white/70">
                    {[
                      ["Diagram Panah", "Sama seperti relasi, tapi setiap anggota A hanya punya tepat 1 panah"],
                      ["Himpunan Pasangan Berurutan", "Tidak ada anggota pertama yang muncul dua kali berbeda: {(1,3),(2,5),(3,7)}"],
                      ["Tabel / Grafik", "Tidak ada nilai x yang memiliki dua nilai y berbeda"],
                      ["Rumus / Persamaan", "Dinyatakan dengan f(x) = ..., contoh: f(x) = 3x - 2"],
                    ].map(([cara, ket]) => (
                      <div key={cara} className="flex gap-2">
                        <span className="text-violet-400 shrink-0">▸</span>
                        <p><strong className="text-violet-300">{cara}:</strong> {ket}</p>
                      </div>
                    ))}
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
                    Dari himpunan pasangan berurutan berikut, tentukan mana yang merupakan fungsi dan mana yang bukan:
                    <br /><strong>A.</strong> <InlineMath math="\{(1,3),(2,5),(3,7),(4,9)\}" />
                    <br /><strong>B.</strong> <InlineMath math="\{(1,2),(1,4),(2,6),(3,8)\}" />
                    <br /><strong>C.</strong> <InlineMath math="\{(2,5),(3,5),(4,5),(5,5)\}" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      { label: "A", data: "{(1,3),(2,5),(3,7),(4,9)}", status: "FUNGSI", penj: "Setiap nilai x (1,2,3,4) muncul tepat sekali. Tidak ada duplikasi di nilai pertama.", color: "border-green-500/40 bg-green-900/10", statusColor: "text-green-300" },
                      { label: "B", data: "{(1,2),(1,4),(2,6),(3,8)}", status: "BUKAN FUNGSI", penj: "Nilai x=1 muncul DUA KALI (1→2 dan 1→4). Ini melanggar syarat fungsi!", color: "border-red-500/40 bg-red-900/10", statusColor: "text-red-300" },
                      { label: "C", data: "{(2,5),(3,5),(4,5),(5,5)}", status: "FUNGSI", penj: "Meski semua nilai y sama (5), setiap x dipasangkan tepat sekali. Ini TETAP fungsi (disebut fungsi konstan).", color: "border-green-500/40 bg-green-900/10", statusColor: "text-green-300" },
                    ].map(({ label, status, penj, color, statusColor }) => (
                      <div key={label} className={`border ${color} rounded-lg p-3`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-white/10 rounded px-2 py-0.5 text-xs font-bold text-white">{label}</span>
                          <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
                        </div>
                        <p className="text-xs text-white/60">{penj}</p>
                      </div>
                    ))}
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
                    Diketahui fungsi <InlineMath math="f : A \to B" /> dengan <InlineMath math="A = \{-2, -1, 0, 1, 2\}" /> dan aturan fungsi <InlineMath math="f(x) = x^2 + 3" />. Tentukan:
                    <br />a) Nilai fungsi untuk setiap anggota domain
                    <br />b) Kodomain B (range fungsi)
                    <br />c) Sajikan dalam bentuk tabel
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Nilai fungsi untuk setiap x:</p>
                      <div className="space-y-1 text-xs">
                        {[
                          ["-2", "(-2)² + 3", "4 + 3", "7"],
                          ["-1", "(-1)² + 3", "1 + 3", "4"],
                          ["0", "0² + 3", "0 + 3", "3"],
                          ["1", "1² + 3", "1 + 3", "4"],
                          ["2", "2² + 3", "4 + 3", "7"],
                        ].map(([x, eksp, hitung, hasil]) => (
                          <div key={x} className="flex gap-2 items-center text-white/70">
                            <span className="bg-cyan-800/50 rounded px-2 py-0.5 text-cyan-200 font-bold w-8 text-center shrink-0">x={x}</span>
                            <span className="text-white/40">→</span>
                            <span>f({x}) = {eksp} = {hitung} = </span>
                            <span className="text-green-300 font-bold">{hasil}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Range fungsi:</p>
                      <BlockMath math="\text{Range} = \{3, 4, 7\}" />
                      <p className="text-white/50 text-xs">Perhatikan: f(-2)=f(2)=7 dan f(-1)=f(1)=4, sehingga range hanya berisi nilai uniknya.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2">c) Tabel:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-orange-900/40">
                              <th className="border border-orange-500/30 px-2 py-1.5 text-orange-200">x</th>
                              {["-2", "-1", "0", "1", "2"].map(v => (
                                <td key={v} className="border border-orange-500/30 px-2 py-1.5 text-white text-center">{v}</td>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="border border-orange-500/30 px-2 py-1.5 text-orange-200">f(x)=x²+3</th>
                              {["7", "4", "3", "4", "7"].map((v, i) => (
                                <td key={i} className="border border-orange-500/30 px-2 py-1.5 text-green-300 text-center font-bold">{v}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ Range = <InlineMath math="\{3, 4, 7\}" /></p>
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
                    Diketahui <InlineMath math="f(x) = ax + b" /> adalah sebuah fungsi linear. Jika <InlineMath math="f(2) = 7" /> dan <InlineMath math="f(-1) = 1" />, tentukan:
                    <br />a) Nilai <InlineMath math="a" /> dan <InlineMath math="b" />
                    <br />b) Rumus fungsinya
                    <br />c) Nilai dari <InlineMath math="f(5)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Bentuk sistem persamaan:</p>
                      <p className="text-white/70 text-xs mb-2">Substitusi nilai yang diketahui ke <InlineMath math="f(x) = ax + b" />:</p>
                      <BlockMath math="f(2) = 2a + b = 7 \quad \cdots (1)" />
                      <BlockMath math="f(-1) = -a + b = 1 \quad \cdots (2)" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Selesaikan SPLDV:</p>
                      <p className="text-white/60 text-xs mb-1">Eliminasi: Persamaan (1) dikurangi (2):</p>
                      <BlockMath math="(2a + b) - (-a + b) = 7 - 1" />
                      <BlockMath math="3a = 6 \implies a = 2" />
                      <p className="text-white/60 text-xs mb-1 mt-2">Substitusi a=2 ke persamaan (2):</p>
                      <BlockMath math="-2 + b = 1 \implies b = 3" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">b) Rumus Fungsi:</p>
                      <BlockMath math="f(x) = 2x + 3" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">c) Nilai f(5):</p>
                      <BlockMath math="f(5) = 2(5) + 3 = 10 + 3 = 13" />
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ Jawaban: a=2, b=3, f(x) = 2x+3, dan f(5) = <strong>13</strong></p>
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
                    ["Fungsi", "Relasi khusus di mana setiap anggota domain dipasangkan dengan TEPAT SATU anggota kodomain"],
                    ["Syarat 1", "Semua anggota domain harus punya pasangan"],
                    ["Syarat 2", "Setiap anggota domain hanya boleh punya satu pasangan"],
                    ["Notasi Fungsi", "f : A → B, dibaca 'f adalah fungsi dari A ke B'"],
                    ["Nilai Fungsi", "f(x) dibaca 'f dari x' — nilai output saat input adalah x"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Ingat:</strong> Setiap fungsi adalah relasi, tapi tidak setiap relasi adalah fungsi! Fungsi adalah relasi yang "lebih ketat".
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

export default PengertianFungsiPage;
