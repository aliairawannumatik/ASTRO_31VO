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
            {expandedSections.includes("intro") && (
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
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Diberikan dua himpunan <InlineMath math="A" /> dan <InlineMath math="B" />, <strong className="text-cyan-300">relasi dari A ke B</strong> adalah aturan yang memasangkan <strong className="text-green-300">sebagian atau seluruh</strong> anggota himpunan <InlineMath math="A" /> dengan anggota himpunan <InlineMath math="B" />. Anggota himpunan <InlineMath math="A" /> disebut <strong className="text-yellow-300">domain (daerah asal)</strong> dan anggota himpunan <InlineMath math="B" /> disebut <strong className="text-orange-300">kodomain (daerah kawan)</strong>.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-violet-900/40">
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Istilah</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Penjelasan</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Notasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Domain", "Himpunan asal / himpunan yang anggotanya dipasangkan", "A"],
                        ["Kodomain", "Himpunan kawan / himpunan tujuan pasangan", "B"],
                        ["Range", "Himpunan dari anggota B yang benar-benar dipasangkan", "R ⊆ B"],
                        ["Pasangan Berurutan", "Cara menyatakan hasil pasangan (a, b)", "(a, b)"],
                      ].map(([istilah, penj, notasi], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{istilah}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{penj}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300 font-mono">{notasi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            {expandedSections.includes("penyajian") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">Relasi dapat disajikan dengan <strong className="text-white">4 cara</strong>:</p>

                {/* Diagram Panah */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-cyan-300">1️⃣ Diagram Panah</p>
                  <p className="font-body text-xs text-white/60 mb-2">Dua lingkaran/oval mewakili himpunan A dan B, dihubungkan dengan anak panah sesuai relasinya.</p>
                  {/* Visual diagram panah */}
                  <div className="flex gap-4 justify-center items-start mt-3">
                    <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-xl px-4 py-3 text-center min-w-[90px]">
                      <p className="text-xs text-cyan-400 font-bold mb-2">A (Domain)</p>
                      {["1", "2", "3", "4"].map(n => (
                        <div key={n} className="bg-cyan-800/50 rounded-lg px-3 py-1 mb-1 text-cyan-200 text-sm font-bold">{n}</div>
                      ))}
                    </div>
                    <div className="flex flex-col justify-center items-center gap-3 pt-8">
                      {["→", "→", "→", "→"].map((a, i) => (
                        <span key={i} className="text-yellow-400 text-xl font-bold">{a}</span>
                      ))}
                    </div>
                    <div className="bg-violet-900/40 border border-violet-500/40 rounded-xl px-4 py-3 text-center min-w-[90px]">
                      <p className="text-xs text-violet-400 font-bold mb-2">B (Kodomain)</p>
                      {["1", "4", "9", "16", "25"].map(n => (
                        <div key={n} className="bg-violet-800/50 rounded-lg px-3 py-1 mb-1 text-violet-200 text-sm font-bold">{n}</div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-xs text-white/40 mt-1">Relasi "kuadrat dari" — 1→1, 2→4, 3→9, 4→16</p>
                </div>

                {/* Himpunan Pasangan Berurutan */}
                <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-green-300">2️⃣ Himpunan Pasangan Berurutan</p>
                  <p className="font-body text-xs text-white/60 mb-2">Ditulis sebagai kumpulan pasangan <InlineMath math="(a, b)" /> di mana <InlineMath math="a \in A" /> dan <InlineMath math="b \in B" />.</p>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <BlockMath math="\{(1,1),\ (2,4),\ (3,9),\ (4,16)\}" />
                  </div>
                </div>

                {/* Tabel */}
                <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-orange-300">3️⃣ Tabel</p>
                  <p className="font-body text-xs text-white/60 mb-2">Baris pertama berisi anggota domain, baris kedua berisi anggota range yang bersesuaian.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-orange-900/40">
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">x (Domain)</th>
                          <td className="border border-orange-500/30 px-3 py-2 text-white text-center">1</td>
                          <td className="border border-orange-500/30 px-3 py-2 text-white text-center">2</td>
                          <td className="border border-orange-500/30 px-3 py-2 text-white text-center">3</td>
                          <td className="border border-orange-500/30 px-3 py-2 text-white text-center">4</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">y = x²</th>
                          <td className="border border-orange-500/30 px-3 py-2 text-green-300 text-center font-bold">1</td>
                          <td className="border border-orange-500/30 px-3 py-2 text-green-300 text-center font-bold">4</td>
                          <td className="border border-orange-500/30 px-3 py-2 text-green-300 text-center font-bold">9</td>
                          <td className="border border-orange-500/30 px-3 py-2 text-green-300 text-center font-bold">16</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grafik/Koordinat */}
                <div className="bg-slate-800/50 border border-violet-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">4️⃣ Grafik Kartesius</p>
                  <p className="font-body text-xs text-white/60">Pasangan <InlineMath math="(x, y)" /> digambarkan sebagai titik pada bidang koordinat Kartesius. Sumbu-x untuk domain, sumbu-y untuk range.</p>
                  {/* Simple dot plot visual */}
                  <div className="bg-slate-900/60 border border-violet-500/20 rounded-xl p-4 flex justify-center">
                    <svg viewBox="0 0 160 160" className="w-40 h-40" aria-label="Grafik relasi x kuadrat">
                      <line x1="20" y1="140" x2="150" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="20" y1="10" x2="20" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x="153" y="143" fill="#94a3b8" fontSize="8">x</text>
                      <text x="13" y="9" fill="#94a3b8" fontSize="8">y</text>
                      {[
                        { x: 1, y: 1 }, { x: 2, y: 4 }, { x: 3, y: 9 }, { x: 4, y: 16 },
                      ].map(({ x, y }) => {
                        const cx = 20 + x * 28;
                        const cy = 140 - y * 7;
                        return (
                          <g key={x}>
                            <circle cx={cx} cy={cy} r="5" fill="#818cf8" stroke="#c4b5fd" strokeWidth="1.5" />
                            <text x={cx - 4} y={cy - 8} fill="#c4b5fd" fontSize="7">({x},{y})</text>
                          </g>
                        );
                      })}
                      {[1, 2, 3, 4].map((v) => (
                        <g key={v}>
                          <text x={20 + v * 28 - 3} y="150" fill="#64748b" fontSize="7">{v}</text>
                          <text x="5" y={140 - v * 7 + 3} fill="#64748b" fontSize="6">{(v * 7)}</text>
                        </g>
                      ))}
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
            {expandedSections.includes("contoh1") && (
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
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Dari himpunan pasangan berurutan berikut: <InlineMath math="\{(2,5),\ (3,7),\ (4,9),\ (5,11)\}" />, tentukan:
                    <br />a) Domain, Kodomain, dan Range
                    <br />b) Aturan relasinya
                    <br />c) Sajikan dalam bentuk tabel!
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
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2">c) Bentuk Tabel:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-orange-900/40">
                              <th className="border border-orange-500/30 px-3 py-1.5 text-orange-200">x</th>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-white text-center">2</td>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-white text-center">3</td>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-white text-center">4</td>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-white text-center">5</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="border border-orange-500/30 px-3 py-1.5 text-orange-200">y = 2x+1</th>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-green-300 text-center font-bold">5</td>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-green-300 text-center font-bold">7</td>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-green-300 text-center font-bold">9</td>
                              <td className="border border-orange-500/30 px-3 py-1.5 text-green-300 text-center font-bold">11</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
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
            {expandedSections.includes("contoh3") && (
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
            {expandedSections.includes("rangkuman") && (
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
