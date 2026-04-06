import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianPolaPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "contoh1", "contoh2", "contoh3", "rangkuman",
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
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGERTIAN POLA & BARISAN BILANGAN
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Temukan Aturan Tersembunyi di Balik Deretan Angka!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Pola Bilangan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Pola — Keteraturan yang Ada di Mana-mana" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Coba perhatikan lantai keramik bermotif, petikan dawai gitar, atau jadwal bus yang datang setiap 15 menit — semuanya punya <strong className="text-cyan-300">pola</strong>! Dalam matematika, pola bilangan adalah susunan angka-angka yang mengikuti <strong className="text-cyan-300">aturan tertentu</strong> yang bisa kita prediksi dan analisis.
                </p>

                {/* Visual: pola angka */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔍 Contoh Pola Sederhana</p>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body">
                    {[
                      { pola: "2, 4, 6, 8, 10, ...", aturan: "Tambah 2 setiap suku", color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-200" },
                      { pola: "1, 4, 9, 16, 25, ...", aturan: "Bilangan kuadrat (1², 2², 3², ...)", color: "bg-violet-900/40 border-violet-500/30 text-violet-200" },
                      { pola: "3, 6, 12, 24, 48, ...", aturan: "Dikali 2 setiap suku", color: "bg-green-900/40 border-green-500/30 text-green-200" },
                    ].map(({ pola, aturan, color }) => (
                      <div key={pola} className={`border ${color} rounded-lg px-3 py-2 flex justify-between items-center`}>
                        <span className="font-bold tracking-widest">{pola}</span>
                        <span className="text-white/50 text-right ml-2">→ {aturan}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Mengapa pola bilangan penting?</strong> Kemampuan mengenali pola adalah fondasi berpikir matematis. Dari sini kamu bisa memprediksi suku berikutnya, merumuskan persamaan, bahkan memecahkan masalah dunia nyata seperti bunga bank, pertumbuhan populasi, dan fisika!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Konsep: Pola vs Barisan vs Deret" />
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Sebuah <strong className="text-cyan-300">pola bilangan</strong> adalah kumpulan bilangan yang disusun berdasarkan aturan tertentu. Setiap bilangan dalam susunan itu disebut <strong className="text-green-300">suku</strong>. Ketika suku-suku itu berurutan secara beraturan, kita menyebutnya <strong className="text-yellow-300">barisan bilangan</strong>.
                  </p>
                </div>

                {/* Tabel perbedaan */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-violet-900/40">
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Istilah</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Arti</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Simbol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Suku", "Setiap bilangan dalam barisan", "U₁, U₂, U₃, ..., Uₙ"],
                        ["Barisan", "Deretan suku yang berurutan dengan aturan tertentu", "U₁, U₂, U₃, ..."],
                        ["Pola", "Aturan/hubungan yang menghubungkan antar suku", "Selisih tetap, rasio tetap, dll"],
                        ["Suku ke-n", "Rumus umum untuk menemukan suku manapun", "Uₙ = f(n)"],
                      ].map(([istilah, arti, simbol], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{istilah}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{arti}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300 font-mono">{simbol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cara menemukan pola */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">🔎 Cara Menemukan Aturan Pola</p>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      { step: "1", label: "Hitung selisih antar suku berurutan", desc: "Jika selisihnya tetap → Pola Aritmetika", color: "border-cyan-500/30 bg-cyan-900/10" },
                      { step: "2", label: "Hitung rasio antar suku berurutan", desc: "Jika rasionya tetap → Pola Geometri", color: "border-green-500/30 bg-green-900/10" },
                      { step: "3", label: "Cari hubungan dengan nomor suku (n)", desc: "Apakah Uₙ = n², n(n+1), 2ⁿ, dll?", color: "border-violet-500/30 bg-violet-900/10" },
                      { step: "4", label: "Uji rumus yang ditemukan", desc: "Masukkan n = 1, 2, 3 — apakah hasilnya cocok?", color: "border-orange-500/30 bg-orange-900/10" },
                    ].map(({ step, label, desc, color }) => (
                      <div key={step} className={`border ${color} rounded-lg p-2 flex gap-3`}>
                        <span className="font-display font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm">{step}</span>
                        <div>
                          <p className="text-white font-semibold">{label}</p>
                          <p className="text-white/60 text-xs mt-0.5">{desc}</p>
                        </div>
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
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Perhatikan barisan bilangan berikut: <strong>5, 8, 11, 14, 17, ...</strong><br />
                    a) Temukan aturan polanya.<br />
                    b) Tuliskan tiga suku berikutnya.
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Temukan Aturan Pola:</p>
                      <div className="flex gap-2 flex-wrap items-center text-white/80">
                        {["5", "8", "11", "14", "17"].map((n, i, arr) => (
                          <React.Fragment key={n}>
                            <span className="bg-cyan-800/50 border border-cyan-500/40 rounded-lg px-2 py-1 font-bold text-cyan-200">{n}</span>
                            {i < arr.length - 1 && <span className="text-green-400 font-bold text-xs">+3</span>}
                          </React.Fragment>
                        ))}
                        <span className="text-white/40">...</span>
                      </div>
                      <p className="text-white/70 mt-2">Selisih antar suku berurutan = <strong className="text-green-300">+3</strong> (tetap)</p>
                      <p className="text-white/70">Aturan: <strong className="text-cyan-300">setiap suku bertambah 3</strong> dari suku sebelumnya.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">b) Tiga Suku Berikutnya:</p>
                      <BlockMath math="U_6 = 17 + 3 = 20" />
                      <BlockMath math="U_7 = 20 + 3 = 23" />
                      <BlockMath math="U_8 = 23 + 3 = 26" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Jawaban: 20, 23, 26</p>
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
                    Diketahui barisan: <strong>2, 6, 12, 20, 30, ...</strong><br />
                    Temukan rumus suku ke-<InlineMath math="n" /> dari barisan ini.
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Perhatikan selisih bertingkat:</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-white/70">Suku: 2, 6, 12, 20, 30</p>
                        <p className="text-green-300">Selisih ke-1: 4, 6, 8, 10</p>
                        <p className="text-yellow-300">Selisih ke-2: 2, 2, 2 <span className="text-white/50">(tetap!)</span></p>
                      </div>
                      <p className="text-white/70 mt-2">Selisih kedua tetap → polanya berhubungan dengan <strong className="text-cyan-300">n²</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Hubungkan dengan nomor suku:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse mt-1">
                          <thead><tr className="bg-slate-700/50"><th className="border border-white/10 px-2 py-1 text-white/60">n</th><th className="border border-white/10 px-2 py-1 text-white/60">Suku</th><th className="border border-white/10 px-2 py-1 text-white/60">n(n+1)</th></tr></thead>
                          <tbody>
                            {[[1,2],[2,6],[3,12],[4,20],[5,30]].map(([n, u]) => (
                              <tr key={n} className="border-b border-white/5">
                                <td className="border border-white/10 px-2 py-1 text-cyan-300 text-center">{n}</td>
                                <td className="border border-white/10 px-2 py-1 text-white/70 text-center">{u}</td>
                                <td className="border border-white/10 px-2 py-1 text-green-300 text-center">{n*(n+1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">Langkah 3 — Rumus suku ke-n:</p>
                      <BlockMath math="U_n = n(n+1) = n^2 + n" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Rumus: <InlineMath math="U_n = n(n+1)" /></p>
                      <p className="text-white/60 text-xs mt-1">Cek: <InlineMath math="U_5 = 5 \times 6 = 30" /> ✓</p>
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
                    Sebuah barisan bilangan memenuhi aturan: suku ke-<InlineMath math="n" /> sama dengan jumlah <InlineMath math="n" /> dan kuadratnya dikurangi 1. Tuliskan 5 suku pertama barisan tersebut, lalu tentukan suku ke-10.
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Terjemahkan aturan ke rumus:</p>
                      <p className="text-white/70">"suku ke-n = n ditambah kuadratnya dikurangi 1"</p>
                      <BlockMath math="U_n = n + n^2 - 1 = n^2 + n - 1" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Hitung 5 suku pertama:</p>
                      <BlockMath math="U_1 = 1^2 + 1 - 1 = 1" />
                      <BlockMath math="U_2 = 2^2 + 2 - 1 = 5" />
                      <BlockMath math="U_3 = 3^2 + 3 - 1 = 11" />
                      <BlockMath math="U_4 = 4^2 + 4 - 1 = 19" />
                      <BlockMath math="U_5 = 5^2 + 5 - 1 = 29" />
                      <p className="text-white/70 mt-1">Barisan: <strong className="text-cyan-300">1, 5, 11, 19, 29</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Langkah 3 — Suku ke-10:</p>
                      <BlockMath math="U_{10} = 10^2 + 10 - 1 = 100 + 10 - 1 = 109" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Jawaban: Barisan: 1, 5, 11, 19, 29. Suku ke-10 = <strong>109</strong></p>
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
                    ["Pola Bilangan", "Susunan angka yang mengikuti aturan tertentu"],
                    ["Suku", "Setiap anggota/elemen dalam barisan"],
                    ["Barisan", "Deretan suku yang berurutan berdasarkan aturan"],
                    ["Cara menemukan pola", "Cek selisih → cek rasio → cek hubungan dengan n"],
                    ["Rumus suku ke-n", "Ekspresi matematika Uₙ = f(n) yang berlaku untuk semua suku"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Tip:</strong> Selalu uji rumus yang kamu temukan dengan minimal 3 suku pertama. Jika cocok, rumusmu sudah benar!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPolaPage;
