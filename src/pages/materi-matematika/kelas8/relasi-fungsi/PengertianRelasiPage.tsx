import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, GitBranch } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianRelasiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "penyajian", "contoh1", "contoh2", "contoh3", "rangkuman",
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
        <GitBranch className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGERTIAN RELASI DAN PENYAJIANNYA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Hubungkan Dua Himpunan dengan Aturan yang Tepat!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Relasi — Menghubungkan Dua Dunia" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu punya daftar nama siswa dan daftar mata pelajaran favorit mereka. Hubungan "siapa suka apa" itulah yang disebut <strong className="text-cyan-300">relasi</strong>! Dalam matematika, relasi adalah <strong className="text-cyan-300">aturan yang menghubungkan anggota satu himpunan ke anggota himpunan lain</strong>.
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔍 Contoh Relasi dalam Kehidupan Sehari-hari</p>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body">
                    {[
                      { rel: "Siswa → Mata Pelajaran Favorit", ket: "Dinda suka Matematika, Rafi suka IPA", color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-200" },
                      { rel: "Buah → Warnanya", ket: "Apel merah, Pisang kuning, Anggur ungu", color: "bg-violet-900/40 border-violet-500/30 text-violet-200" },
                      { rel: "Bilangan → Kuadratnya", ket: "2 → 4, 3 → 9, 4 → 16", color: "bg-green-900/40 border-green-500/30 text-green-200" },
                    ].map(({ rel, ket, color }) => (
                      <div key={rel} className={`border ${color} rounded-lg px-3 py-2`}>
                        <p className="font-bold">{rel}</p>
                        <p className="text-white/60 text-xs mt-0.5">Contoh: {ket}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Mengapa perlu belajar relasi?</strong> Relasi adalah fondasi dari konsep fungsi — salah satu topik paling fundamental dalam matematika dan pemrograman komputer!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Konsep Dasar Relasi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Diberikan dua himpunan <InlineMath math="A" /> dan <InlineMath math="B" />, <strong className="text-cyan-300">relasi dari A ke B</strong> adalah aturan yang memasangkan <strong className="text-green-300">sebagian atau seluruh</strong> anggota himpunan <InlineMath math="A" /> dengan anggota himpunan <InlineMath math="B" />. Anggota himpunan <InlineMath math="A" /> disebut <strong className="text-yellow-300">domain (daerah asal)</strong> dan anggota himpunan <InlineMath math="B" /> disebut <strong className="text-orange-300">kodomain (daerah kawan)</strong>.
                  </p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>⚠️ Ingat:</strong> Range <InlineMath math="\subseteq" /> Kodomain, artinya range adalah bagian dari kodomain. Tidak semua anggota kodomain harus dipasangkan!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CARA PENYAJIAN RELASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="penyajian" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="🗂️ Cara Menyajikan Relasi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">Relasi dapat disajikan dengan <strong className="text-white">4 cara</strong>:</p>

                {/* Diagram Panah */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-cyan-300">1️⃣ Diagram Panah</p>
                  <p className="font-body text-xs text-white/60 mb-2">Dua oval mewakili himpunan A dan B, dihubungkan dengan anak panah sesuai relasinya.</p>
                  <div className="flex justify-center">
                    <svg viewBox="0 0 280 210" className="w-full max-w-xs" aria-label="Diagram panah relasi kuadrat dari">
                      <defs>
                        <marker id="arrowDP" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                          <polygon points="0 0, 7 2.5, 0 5" fill="#facc15" />
                        </marker>
                      </defs>
                      {/* Oval A (Domain) */}
                      <ellipse cx="70" cy="108" rx="52" ry="88" fill="rgba(8,145,178,0.12)" stroke="#22d3ee" strokeWidth="1.8" />
                      {/* Oval B (Kodomain) */}
                      <ellipse cx="210" cy="108" rx="52" ry="88" fill="rgba(124,58,237,0.12)" stroke="#a78bfa" strokeWidth="1.8" />
                      {/* Labels */}
                      <text x="70" y="17" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold">A (Domain)</text>
                      <text x="210" y="17" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="bold">B (Kodomain)</text>
                      {/* Domain elements — no boxes, plain text */}
                      <text x="70" y="64"  textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="bold">1</text>
                      <text x="70" y="92"  textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="bold">2</text>
                      <text x="70" y="120" textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="bold">3</text>
                      <text x="70" y="148" textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="bold">4</text>
                      {/* Kodomain elements */}
                      <text x="210" y="52"  textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">1</text>
                      <text x="210" y="76"  textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">4</text>
                      <text x="210" y="100" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">9</text>
                      <text x="210" y="124" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">16</text>
                      <text x="210" y="148" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">25</text>
                      {/* Arrows — start at right edge of domain number, end at left edge of kodomain number */}
                      {/* 1 → 1 */}
                      <line x1="77" y1="57"  x2="200" y2="45"  stroke="#facc15" strokeWidth="1.6" markerEnd="url(#arrowDP)" />
                      {/* 2 → 4 */}
                      <line x1="77" y1="85"  x2="200" y2="69"  stroke="#facc15" strokeWidth="1.6" markerEnd="url(#arrowDP)" />
                      {/* 3 → 9 */}
                      <line x1="77" y1="113" x2="200" y2="93"  stroke="#facc15" strokeWidth="1.6" markerEnd="url(#arrowDP)" />
                      {/* 4 → 16 */}
                      <line x1="77" y1="141" x2="196" y2="117" stroke="#facc15" strokeWidth="1.6" markerEnd="url(#arrowDP)" />
                    </svg>
                  </div>
                  <p className="text-center text-xs text-white/40 mt-2">
                    Relasi "kuadrat dari"<br />1→1, 2→4, 3→9, 4→16
                  </p>
                </div>

                {/* Himpunan Pasangan Berurutan */}
                <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-green-300">2️⃣ Himpunan Pasangan Berurutan</p>
                  <p className="font-body text-xs text-white/60 mb-2">Ditulis sebagai kumpulan pasangan <InlineMath math="(a, b)" /> di mana <InlineMath math="a \in A" /> dan <InlineMath math="b \in B" />.</p>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <BlockMath math="\{(1,1),\ (2,4),\ (3,9),\ (4,16)\}" />
                  </div>
                </div>

                {/* Grafik/Koordinat */}
                <div className="bg-slate-800/50 border border-violet-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">4️⃣ Grafik Kartesius</p>
                  <p className="font-body text-xs text-white/60">Pasangan <InlineMath math="(x, y)" /> digambarkan sebagai titik pada bidang koordinat Kartesius. Sumbu-x untuk domain, sumbu-y untuk range.</p>
                  <div className="bg-slate-900/60 border border-violet-500/20 rounded-xl p-4 flex justify-center">
                    {/* 
                      Grid: x ∈ {0..5}, y ∈ {0..16} 
                      Origin: (40, 178)
                      x-scale: 30px per unit  →  x=1→70, x=2→100, x=3→130, x=4→160
                      y-scale: 10px per unit  →  y=1→168, y=4→138, y=9→88, y=16→18
                    */}
                    <svg viewBox="0 0 210 210" className="w-full max-w-xs" aria-label="Grafik kartesius relasi kuadrat dari">
                      {/* Grid lines */}
                      {[1,2,3,4,5].map(gx => (
                        <line key={`gx${gx}`} x1={40+gx*30} y1={18} x2={40+gx*30} y2={178} stroke="rgba(148,163,184,0.18)" strokeWidth="1" strokeDasharray="3,3" />
                      ))}
                      {[2,4,6,8,10,12,14,16].map(gy => (
                        <line key={`gy${gy}`} x1={40} y1={178-gy*10} x2={190} y2={178-gy*10} stroke="rgba(148,163,184,0.18)" strokeWidth="1" strokeDasharray="3,3" />
                      ))}
                      {/* Axes */}
                      <line x1="40" y1="178" x2="193" y2="178" stroke="#94a3b8" strokeWidth="1.8" />
                      <line x1="40" y1="178" x2="40"  y2="12"  stroke="#94a3b8" strokeWidth="1.8" />
                      {/* Arrow tips */}
                      <polygon points="193,175 200,178 193,181" fill="#94a3b8" />
                      <polygon points="37,12 40,5 43,12" fill="#94a3b8" />
                      {/* Axis labels */}
                      <text x="202" y="181" fill="#94a3b8" fontSize="9" fontWeight="bold">x</text>
                      <text x="34"  y="9"   fill="#94a3b8" fontSize="9" fontWeight="bold">y</text>
                      {/* X-axis tick labels */}
                      {[1,2,3,4,5].map(v => (
                        <g key={`xl${v}`}>
                          <line x1={40+v*30} y1="178" x2={40+v*30} y2="182" stroke="#94a3b8" strokeWidth="1.2" />
                          <text x={40+v*30} y="191" textAnchor="middle" fill="#94a3b8" fontSize="8">{v}</text>
                        </g>
                      ))}
                      {/* Y-axis tick labels */}
                      {[2,4,6,8,10,12,14,16].map(v => (
                        <g key={`yl${v}`}>
                          <line x1="36" y1={178-v*10} x2="40" y2={178-v*10} stroke="#94a3b8" strokeWidth="1.2" />
                          <text x="32" y={178-v*10+3} textAnchor="end" fill="#94a3b8" fontSize="7">{v}</text>
                        </g>
                      ))}
                      {/* Origin label */}
                      <text x="33" y="191" textAnchor="middle" fill="#64748b" fontSize="7">0</text>
                      {/* Data points (1,1), (2,4), (3,9), (4,16) */}
                      {[{x:1,y:1},{x:2,y:4},{x:3,y:9},{x:4,y:16}].map(({x,y}) => {
                        const cx = 40 + x * 30;
                        const cy = 178 - y * 10;
                        return (
                          <g key={x}>
                            <circle cx={cx} cy={cy} r="5" fill="#818cf8" stroke="#c4b5fd" strokeWidth="1.8" />
                            <text x={cx+7} y={cy+3} fill="#c4b5fd" fontSize="7.5">({x},{y})</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Tips:</strong> Diagram panah paling mudah untuk memahami konsep, sedangkan grafik Kartesius berguna untuk visualisasi pola relasi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="A = \{1, 2, 3, 4\}" /> dan <InlineMath math="B = \{2, 4, 6, 8, 10\}" />. Tentukan relasi "dua kali dari" dari himpunan A ke B, lalu nyatakan dalam bentuk himpunan pasangan berurutan!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Tentukan setiap pasangan:</p>
                      <p className="text-white/70 mb-2">Aturan: <InlineMath math="b = 2 \times a" /></p>
                      <div className="space-y-1 text-xs">
                        {[
                          ["1", "2 × 1 = 2", "2 ∈ B ✓"],
                          ["2", "2 × 2 = 4", "4 ∈ B ✓"],
                          ["3", "2 × 3 = 6", "6 ∈ B ✓"],
                          ["4", "2 × 4 = 8", "8 ∈ B ✓"],
                        ].map(([a, hitung, cek]) => (
                          <div key={a} className="flex gap-3 items-center text-white/70">
                            <span className="bg-cyan-800/50 border border-cyan-500/30 rounded px-2 py-0.5 text-cyan-200 font-bold min-w-[24px] text-center">{a}</span>
                            <span>→</span>
                            <span className="text-white">{hitung}</span>
                            <span className="text-green-400">{cek}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Tulis himpunan pasangan berurutan:</p>
                      <BlockMath math="\{(1,2),\ (2,4),\ (3,6),\ (4,8)\}" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">Langkah 3 — Tentukan Range:</p>
                      <p className="text-white/70 text-xs">Range = anggota B yang benar-benar dipasangkan</p>
                      <BlockMath math="\text{Range} = \{2, 4, 6, 8\}" />
                      <p className="text-white/50 text-xs">Catatan: 10 ∈ B tapi tidak dipasangkan, sehingga bukan bagian dari range.</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">✅ Jawaban: <InlineMath math="\{(1,2),\ (2,4),\ (3,6),\ (4,8)\}" /></p>
                      <p className="text-white/60 text-xs mt-1">Range = <InlineMath math="\{2, 4, 6, 8\}" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Dari himpunan pasangan berurutan berikut: <InlineMath math="\{(2,5),\ (3,7),\ (4,9),\ (5,11)\}" />, tentukan:
                    <br />a) Domain, Kodomain, dan Range
                    <br />b) Aturan relasinya
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Domain, Kodomain, dan Range:</p>
                      <div className="space-y-1 text-xs text-white/70">
                        <p>• <strong className="text-cyan-300">Domain</strong> = himpunan nilai pertama = <InlineMath math="\{2, 3, 4, 5\}" /></p>
                        <p>• <strong className="text-orange-300">Kodomain</strong> = himpunan nilai kedua = <InlineMath math="\{5, 7, 9, 11\}" /></p>
                        <p>• <strong className="text-green-300">Range</strong> = nilai yang benar-benar muncul = <InlineMath math="\{5, 7, 9, 11\}" /></p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">b) Aturan Relasi:</p>
                      <p className="text-white/70 text-xs mb-2">Cari hubungan antara nilai pertama (x) dan nilai kedua (y):</p>
                      <div className="space-y-1 text-xs text-white/60">
                        <p>x=2: y=5 → 5 = 2×2+1 ✓</p>
                        <p>x=3: y=7 → 7 = 2×3+1 ✓</p>
                        <p>x=4: y=9 → 9 = 2×4+1 ✓</p>
                        <p>x=5: y=11 → 11 = 2×5+1 ✓</p>
                      </div>
                      <BlockMath math="y = 2x + 1" />
                      <p className="text-white/60 text-xs">Aturan: "dua kali lebih satu dari"</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ Aturan relasi: <InlineMath math="y = 2x + 1" /> ("dua kali lebih satu dari")</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="P = \{1, 2, 3, 4, 5\}" /> dan <InlineMath math="Q = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />. Relasi dari P ke Q didefinisikan sebagai "faktor dari". Tentukan:
                    <br />a) Himpunan pasangan berurutan dari relasi ini
                    <br />b) Range dari relasi tersebut
                    <br />c) Apakah setiap anggota P pasti memiliki pasangan di Q?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Tentukan aturan "faktor dari":</p>
                      <p className="text-white/60 text-xs mb-2">a adalah faktor dari b jika b habis dibagi a (b ÷ a tidak bersisa).</p>
                      <div className="space-y-1 text-xs text-white/70">
                        <p><strong className="text-cyan-200">1</strong> adalah faktor dari: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p>
                        <p><strong className="text-cyan-200">2</strong> adalah faktor dari: 2, 4, 6, 8, 10</p>
                        <p><strong className="text-cyan-200">3</strong> adalah faktor dari: 3, 6, 9</p>
                        <p><strong className="text-cyan-200">4</strong> adalah faktor dari: 4, 8</p>
                        <p><strong className="text-cyan-200">5</strong> adalah faktor dari: 5, 10</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">a) Himpunan Pasangan Berurutan:</p>
                      <div className="text-xs text-white/70 leading-relaxed">
                        <BlockMath math="\{(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10)," />
                        <BlockMath math="(2,2),(2,4),(2,6),(2,8),(2,10),(3,3),(3,6),(3,9)," />
                        <BlockMath math="(4,4),(4,8),(5,5),(5,10)\}" />
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">b) Range:</p>
                      <p className="text-white/60 text-xs mb-1">Anggota Q yang benar-benar dipasangkan:</p>
                      <BlockMath math="\text{Range} = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\} = Q" />
                      <p className="text-white/50 text-xs">Seluruh anggota Q menjadi range karena 1 adalah faktor dari semua bilangan!</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">c) Apakah setiap anggota P memiliki pasangan di Q?</p>
                      <p className="text-white/70 text-xs">Ya! Setiap bilangan <InlineMath math="a \in P" /> minimal merupakan faktor dari dirinya sendiri (karena <InlineMath math="a \in Q" /> untuk semua <InlineMath math="a \in P" />). Jadi setiap anggota P pasti punya pasangan di Q.</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ Total pasangan: 22 pasangan berurutan. Range = Q (seluruh kodomain).</p>
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
                    ["Relasi", "Aturan yang menghubungkan sebagian/seluruh anggota himpunan A ke B"],
                    ["Domain", "Himpunan asal (himpunan A)"],
                    ["Kodomain", "Himpunan kawan (himpunan B)"],
                    ["Range", "Bagian dari kodomain yang benar-benar dipasangkan"],
                    ["4 Cara Penyajian", "Diagram panah, pasangan berurutan, tabel, grafik Kartesius"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Kunci:</strong> Range ⊆ Kodomain — range selalu merupakan bagian dari kodomain, tidak harus sama!
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

export default PengertianRelasiPage;
