import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, Layers, Sparkles } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { ArcPatternPanel } from "@/components/ArcDifferenceAnimation";

const SectionHeader = ({ icon, iconColor, title }: {
  icon: React.ReactNode; iconColor?: string; title: string;
}) => (
  <div className="w-full flex items-center px-5 py-4">
    <div className="flex items-center gap-3">
      <span className={iconColor}>{icon}</span>
      <span className="font-body font-semibold text-white">{title}</span>
    </div>
  </div>
);

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
);

const PengertianPolaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGERTIAN POLA, BARISAN BILANGAN DAN POLA-POLA KHUSUS
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Temukan Aturan Tersembunyi di Balik Deretan Angka!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Pola Bilangan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── BAGIAN 1: PENGERTIAN POLA & BARISAN BILANGAN ── */}
          <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-cyan-300 text-center uppercase tracking-widest">
              📘 Bagian 1 — Pengertian Pola &amp; Barisan Bilangan
            </p>
          </div>

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Pola — Keteraturan yang Ada di Mana-mana" />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Coba perhatikan lantai keramik bermotif, petikan dawai gitar, atau jadwal bus yang datang setiap 15 menit — semuanya punya <strong className="text-cyan-300">pola</strong>! Bahkan <strong className="text-yellow-300">motif batik</strong> — warisan seni budaya Indonesia yang kaya — pun merupakan contoh nyata dari pola: setiap motif tercipta dari pengulangan bentuk yang mengikuti aturan tertentu. Dalam matematika, pola bilangan adalah susunan angka-angka yang mengikuti <strong className="text-cyan-300">aturan tertentu</strong> yang bisa kita prediksi dan analisis.
              </p>
              <figure className="flex flex-col items-center gap-2">
                <img
                  src="/batik-sidomukti.png"
                  alt="Batik Sidomukti"
                  className="w-full max-w-sm rounded-xl border border-cyan-500/30 shadow-lg object-cover"
                />
                <figcaption className="font-body text-xs text-white/50 italic text-center">
                  Batik Sidomukti 🇮🇩 — motif batik adalah pola berulang, bukti bahwa seni budaya Indonesia pun penuh matematika!
                </figcaption>
              </figure>
              <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔍 Contoh Pola Sederhana</p>
                <div className="grid grid-cols-1 gap-3 text-xs font-body">

                  {/* Contoh 1: Tambah 2 */}
                  <div className="border bg-cyan-900/40 border-cyan-500/30 rounded-lg px-3 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-cyan-200 tracking-widest">2, 4, 6, 8, 10, ...</span>
                      <span className="text-white/50 ml-2">→ Tambah 2</span>
                    </div>
                    <svg viewBox="0 0 248 52" className="w-full">
                      {[2,4,6,8,10].map((n, i) => {
                        const x = 24 + i * 48;
                        return (
                          <g key={i}>
                            <rect x={x-14} y={28} width={28} height={18} rx="3" fill="rgba(8,145,178,0.3)" stroke="#22d3ee" strokeWidth="0.9"/>
                            <text x={x} y={41} textAnchor="middle" fill="#a5f3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">{n}</text>
                          </g>
                        );
                      })}
                      <text x={236} y={41} fill="rgba(255,255,255,0.3)" fontSize="13" fontFamily="monospace">…</text>
                      {[0,1,2,3].map(i => {
                        const x1 = 24 + i * 48 + 14; const x2 = 24 + (i+1)*48 - 14; const mx = (x1+x2)/2;
                        return (
                          <g key={i}>
                            <path d={`M ${x1},28 Q ${mx},10 ${x2},28`} fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="3,2"/>
                            <text x={mx} y={7} textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">+2</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Contoh 2: Bilangan kuadrat */}
                  <div className="border bg-violet-900/40 border-violet-500/30 rounded-lg px-3 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-violet-200 tracking-widest">1, 4, 9, 16, 25, ...</span>
                      <span className="text-white/50 ml-2">→ Bilangan kuadrat</span>
                    </div>
                    <svg viewBox="0 0 248 52" className="w-full">
                      {[1,4,9,16,25].map((n, i) => {
                        const x = 24 + i * 48;
                        return (
                          <g key={i}>
                            <rect x={x-15} y={28} width={30} height={18} rx="3" fill="rgba(109,40,217,0.3)" stroke="#a855f7" strokeWidth="0.9"/>
                            <text x={x} y={41} textAnchor="middle" fill="#e9d5ff" fontSize="11" fontFamily="monospace" fontWeight="bold">{n}</text>
                          </g>
                        );
                      })}
                      <text x={236} y={41} fill="rgba(255,255,255,0.3)" fontSize="13" fontFamily="monospace">…</text>
                      {["+3","+5","+7","+9"].map((d, i) => {
                        const x1 = 24 + i * 48 + 15; const x2 = 24 + (i+1)*48 - 15; const mx = (x1+x2)/2;
                        return (
                          <g key={i}>
                            <path d={`M ${x1},28 Q ${mx},10 ${x2},28`} fill="none" stroke="#a855f7" strokeWidth="1.4" strokeDasharray="3,2"/>
                            <text x={mx} y={7} textAnchor="middle" fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold">{d}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Contoh 3: Dikali 2 */}
                  <div className="border bg-green-900/40 border-green-500/30 rounded-lg px-3 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-green-200 tracking-widest">3, 6, 12, 24, 48, ...</span>
                      <span className="text-white/50 ml-2">→ Dikali 2</span>
                    </div>
                    <svg viewBox="0 0 248 52" className="w-full">
                      {[3,6,12,24,48].map((n, i) => {
                        const x = 24 + i * 48;
                        return (
                          <g key={i}>
                            <rect x={x-15} y={28} width={30} height={18} rx="3" fill="rgba(22,101,52,0.3)" stroke="#4ade80" strokeWidth="0.9"/>
                            <text x={x} y={41} textAnchor="middle" fill="#bbf7d0" fontSize="11" fontFamily="monospace" fontWeight="bold">{n}</text>
                          </g>
                        );
                      })}
                      <text x={236} y={41} fill="rgba(255,255,255,0.3)" fontSize="13" fontFamily="monospace">…</text>
                      {[0,1,2,3].map(i => {
                        const x1 = 24 + i * 48 + 15; const x2 = 24 + (i+1)*48 - 15; const mx = (x1+x2)/2;
                        return (
                          <g key={i}>
                            <path d={`M ${x1},28 Q ${mx},10 ${x2},28`} fill="none" stroke="#4ade80" strokeWidth="1.4" strokeDasharray="3,2"/>
                            <text x={mx} y={7} textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold">×2</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">
                  <strong>Mengapa pola bilangan penting?</strong> Kemampuan mengenali pola adalah fondasi berpikir matematis. Dari sini kamu bisa memprediksi suku berikutnya, merumuskan persamaan, bahkan memecahkan masalah dunia nyata seperti bunga bank, pertumbuhan populasi, dan fisika!
                </p>
              </div>
            </div>
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Konsep: Pola vs Barisan vs Deret" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Sebuah <strong className="text-cyan-300">pola bilangan</strong> adalah kumpulan bilangan yang disusun berdasarkan aturan tertentu. Setiap bilangan dalam susunan itu disebut <strong className="text-green-300">suku</strong>. Ketika suku-suku itu berurutan secara beraturan, kita menyebutnya <strong className="text-yellow-300">barisan bilangan</strong>. Jika semua suku dalam barisan tersebut <strong className="text-pink-300">dijumlahkan</strong>, maka hasilnya disebut <strong className="text-pink-300">deret</strong>.
                </p>
              </div>
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
                      ["Deret", "Jumlah dari suku-suku dalam suatu barisan bilangan", "Sₙ = U₁ + U₂ + U₃ + ... + Uₙ"],
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
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-bold text-white">🔎 Cara Menemukan Aturan Pola</p>
                <div className="space-y-2 text-sm font-body">
                  {[
                    { step: "1", label: "Amati apakah selisih antar suku sama", desc: "Cek: 4−2=2, 6−4=2, 8−6=2 → setiap suku bertambah 2", color: "border-cyan-500/30 bg-cyan-900/10" },
                    { step: "2", label: "Amati apakah setiap suku dikali angka yang sama", desc: "Cek: 6÷3=2, 12÷6=2, 24÷12=2 → setiap suku dikali 2", color: "border-green-500/30 bg-green-900/10" },
                    { step: "3", label: "Lihat hubungan nilai suku dengan posisinya", desc: "Suku ke-1, ke-2, ke-3... apakah ada pola n², n(n+1), atau 2ⁿ?", color: "border-violet-500/30 bg-violet-900/10" },
                    { step: "4", label: "Uji aturan yang kamu temukan", desc: "Cek dengan n=1, 2, 3 — hasil harus cocok dengan barisan", color: "border-orange-500/30 bg-orange-900/10" },
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
          </div>


          {/* ── BAGIAN 2: POLA-POLA KHUSUS ── */}
          <div className="bg-violet-500/10 border border-violet-500/40 rounded-xl px-4 py-2 mt-2">
            <p className="font-display text-sm font-bold text-violet-300 text-center uppercase tracking-widest">
              ⭐ Bagian 2 — Pola-Pola Khusus
            </p>
          </div>

          {/* PENGANTAR KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Pola Khusus — Keindahan Matematika" />
            <div className="px-5 pb-5 space-y-3">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Dalam dunia matematika, ada pola-pola yang begitu terkenal dan muncul berulang kali di berbagai bidang — dari arsitektur hingga alam. Kita menyebutnya <strong className="text-cyan-300">pola khusus</strong>. Mengenalinya akan membuat kamu jauh lebih cepat menjawab soal dan memahami dunia!
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">
                  <strong>Fakta menarik:</strong> Pola Fibonacci ditemukan di kelopak bunga, cangkang siput, dan bahkan galaksi spiral. Pola segitiga Pascal muncul di teori probabilitas dan ekspansi binomial. Matematika bukan hanya angka — ini adalah bahasa alam semesta! 🌌
                </p>
              </div>
            </div>
          </div>

          {/* KATALOG POLA KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Sparkles className="w-5 h-5" />} iconColor="text-violet-400" title="📚 Katalog 7 Pola Khusus" />
            <div className="px-5 pb-5 space-y-4">

              {/* 1. Pola Genap */}
              <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded">1</span>
                  <p className="font-body text-sm font-bold text-cyan-300">Pola Bilangan Genap</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Bilangan yang habis dibagi 2.</p>
                <ArcPatternPanel
                  terms={[2, 4, 6, 8, 10, 12]}
                  arcColor="#22d3ee"
                  labelColor="#a5f3fc"
                  getDifferences={(t) => t.slice(1).map((v, i) => v - t[i])}
                  diffLabel="Beda tetap +2"
                />
                <BlockMath math="U_n = 2n \quad (n = 1, 2, 3, \ldots)" />
              </div>

              {/* 2. Pola Ganjil */}
              <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">2</span>
                  <p className="font-body text-sm font-bold text-orange-300">Pola Bilangan Ganjil</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Bilangan yang tidak habis dibagi 2.</p>
                <ArcPatternPanel
                  terms={[1, 3, 5, 7, 9, 11]}
                  arcColor="#fb923c"
                  labelColor="#fed7aa"
                  getDifferences={(t) => t.slice(1).map((v, i) => v - t[i])}
                  diffLabel="Beda tetap +2"
                />
                <BlockMath math="U_n = 2n - 1 \quad (n = 1, 2, 3, \ldots)" />
              </div>

              {/* 3. Pola Persegi */}
              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-violet-500 text-white text-xs font-bold px-2 py-0.5 rounded">3</span>
                  <p className="font-body text-sm font-bold text-violet-300">Pola Bilangan Persegi</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Bilangan kuadrat — bisa disusun membentuk persegi.</p>
                <ArcPatternPanel
                  terms={[1, 4, 9, 16, 25, 36]}
                  arcColor="#a78bfa"
                  labelColor="#ddd6fe"
                  getDifferences={(t) => t.slice(1).map((v, i) => v - t[i])}
                  diffLabel="Beda bertambah +2 setiap kali"
                  note="Beda: +3, +5, +7, +9, +11 → bilangan ganjil!"
                />
                <BlockMath math="U_n = n^2 \quad \Rightarrow \quad 1, 4, 9, 16, 25, \ldots" />
              </div>

              {/* 4. Pola Persegi Panjang */}
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">4</span>
                  <p className="font-body text-sm font-bold text-green-300">Pola Bilangan Persegi Panjang</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Titik-titik yang membentuk persegi panjang dengan sisi <InlineMath math="n" /> dan <InlineMath math="n+1" />.</p>
                <ArcPatternPanel
                  terms={[2, 6, 12, 20, 30, 42]}
                  arcColor="#4ade80"
                  labelColor="#bbf7d0"
                  getDifferences={(t) => t.slice(1).map((v, i) => v - t[i])}
                  diffLabel="Beda bertambah +2 setiap kali"
                  note="Beda: +4, +6, +8, +10, +12 → bilangan genap!"
                />
                <BlockMath math="U_n = n(n+1) \quad \Rightarrow \quad 2, 6, 12, 20, 30, \ldots" />
              </div>

              {/* 5. Pola Segitiga */}
              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded">5</span>
                  <p className="font-body text-sm font-bold text-yellow-300">Pola Bilangan Segitiga</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Titik-titik yang disusun membentuk segitiga sama sisi.</p>
                <ArcPatternPanel
                  terms={[1, 3, 6, 10, 15, 21]}
                  arcColor="#facc15"
                  labelColor="#fef08a"
                  getDifferences={(t) => t.slice(1).map((v, i) => v - t[i])}
                  diffLabel="Beda bertambah +1 setiap kali"
                  note="Beda: +2, +3, +4, +5, +6 → bilangan asli!"
                />
                <BlockMath math="U_n = \frac{n(n+1)}{2} \quad \Rightarrow \quad 1, 3, 6, 10, 15, \ldots" />
              </div>

              {/* 6. Segitiga Pascal */}
              <div className="bg-pink-900/30 border border-pink-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">6</span>
                  <p className="font-body text-sm font-bold text-pink-300">Pola Segitiga Pascal</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Setiap bilangan = jumlah dua bilangan di atasnya. Baris dimulai dan diakhiri angka 1.</p>
                <div className="flex flex-col items-center gap-1.5 my-3 font-mono text-xs">
                  {[
                    { row: [1],                  sum: 1,  expanded: "1",             power: "2⁰" },
                    { row: [1, 1],               sum: 2,  expanded: "1+1",           power: "2¹" },
                    { row: [1, 2, 1],            sum: 4,  expanded: "1+2+1",         power: "2²" },
                    { row: [1, 3, 3, 1],         sum: 8,  expanded: "1+3+3+1",       power: "2³" },
                    { row: [1, 4, 6, 4, 1],      sum: 16, expanded: "1+4+6+4+1",     power: "2⁴" },
                    { row: [1, 5, 10, 10, 5, 1], sum: 32, expanded: "1+5+10+10+5+1", power: "2⁵" },
                  ].map(({ row, sum, expanded, power }, ri) => (
                    <div key={ri} className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {row.map((val, ci) => (
                            <span key={ci} className="bg-pink-700/50 border border-pink-400/40 text-pink-200 font-bold rounded px-1.5 py-0.5 min-w-[22px] text-center text-xs">{val}</span>
                          ))}
                        </div>
                        <span className="text-white/30 text-[10px]">→</span>
                        <span className="text-pink-100 font-bold text-xs">{sum}</span>
                        <span className="text-white/30 text-[10px]">=</span>
                        <span className="text-amber-300 font-mono text-xs font-bold">{power}</span>
                      </div>
                      <p className="font-mono text-[10px] text-pink-300/55">= {expanded}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-3 space-y-1">
                  <p className="font-body text-xs text-white/70">Jumlah bilangan pada setiap baris: <strong className="text-pink-300">1, 2, 4, 8, 16, 32, ...</strong></p>
                  <p className="font-body text-xs text-white/70">Setiap baris, jumlahnya <strong className="text-pink-300">berlipat ganda (×2)</strong> dari baris sebelumnya.</p>
                  <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-2 mt-2">
                    <BlockMath math="\text{Jumlah baris ke-}n = 2^{n-1}" />
                  </div>
                </div>
                <ArcPatternPanel
                  terms={[1, 2, 4, 8, 16, 32]}
                  arcColor="#f472b6"
                  labelColor="#fbcfe8"
                  getDifferences={(t) => t.slice(1).map((v, i) => v - t[i])}
                  diffLabel="Beda selalu ×2 (berlipat ganda)"
                  note={<>Beda: +1, +2, +4, +8, +16 → jumlah baris ke-n = <InlineMath math="2^{n-1}" /></>}
                />
              </div>

              {/* 7. Fibonacci */}
              <div className="bg-teal-900/30 border border-teal-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded">7</span>
                  <p className="font-body text-sm font-bold text-teal-300">Pola Fibonacci</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Setiap suku = jumlah dua suku sebelumnya. Dimulai dari 1, 1.</p>
                <BlockMath math="U_n = U_{n-1} + U_{n-2} \quad (U_1 = U_2 = 1)" />
                <p className="font-body text-xs text-white/60 mt-1">🌿 Muncul di alam: kelopak bunga, cangkang nautilus, susunan biji bunga matahari!</p>
                <ArcPatternPanel
                  terms={[1, 1, 2, 3, 5, 8, 13]}
                  arcColor="#2dd4bf"
                  labelColor="#99f6e4"
                  getDifferences={(t) => t.slice(1).map((v, i) => v - t[i])}
                  note="Setiap suku = jumlah dua suku sebelumnya"
                  isFibonacci={true}
                />
              </div>

            </div>
          </div>

          {/* CONTOH 1 POLA KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah (Pola Persegi)" />
            <div className="px-5 pb-5 space-y-4">
              <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
              <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                <p className="font-body text-sm text-white/85">
                  Perhatikan barisan bilangan berikut: <strong>1, 4, 9, 16, ...</strong><br />
                  Tentukan suku ke-12 dari barisan tersebut!
                </p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Identifikasi pola:</p>
                    <div className="overflow-x-auto mb-2">
                      <table className="text-xs border-collapse">
                        <thead>
                          <tr className="bg-green-900/40">
                            <th className="border border-green-500/30 px-3 py-1 text-green-200">n</th>
                            {[1,2,3,4,12].map(n => <th key={n} className="border border-green-500/30 px-3 py-1 text-green-200">{n}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-1 text-white/60">Uₙ</td>
                            {[1,4,9,16,"?"].map((v, i) => <td key={i} className={`border border-white/10 px-3 py-1 text-center font-bold ${v === "?" ? "text-yellow-300" : "text-green-200"}`}>{v}</td>)}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-white/70 mb-1">Setiap suku merupakan kuadrat dari nomor sukunya:</p>
                    <BlockMath math="1 = 1^2,\quad 4 = 2^2,\quad 9 = 3^2,\quad 16 = 4^2" />
                    <p className="text-cyan-300 font-semibold mb-1">Rumus suku ke-n:</p>
                    <BlockMath math="U_n = n^2" />
                    <p className="text-cyan-300 font-semibold mb-1">Substitusi n = 12:</p>
                    <BlockMath math="U_{12} = 12^2 = 144" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ Jawaban: Suku ke-12 dari barisan 1, 4, 9, 16, ... adalah <strong>144</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 2 POLA KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang (Barisan Bertingkat)" />
            <div className="px-5 pb-5 space-y-4">
              <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
              <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                <p className="font-body text-sm text-white/85">
                  Perhatikan barisan berikut: <strong>6, 12, 20, 30, …</strong><br />
                  Tentukan suku ke-15 dari barisan tersebut!
                </p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                <div className="space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Nyatakan setiap suku sebagai perkalian dua bilangan berurutan:</p>
                    <div className="overflow-x-auto">
                      <table className="text-xs border-collapse w-full">
                        <thead>
                          <tr className="bg-yellow-900/40">
                            <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200">n</th>
                            <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200">Suku</th>
                            <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200">Bentuk Perkalian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [1, 6,  "2 × 3"],
                            [2, 12, "3 × 4"],
                            [3, 20, "4 × 5"],
                            [4, 30, "5 × 6"],
                          ].map(([n, u, bentuk]) => (
                            <tr key={String(n)} className="bg-slate-800/30">
                              <td className="border border-white/10 px-3 py-1 text-center text-white/60">{n}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-yellow-200 font-bold">{u}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-cyan-300 font-mono">{bentuk}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Temukan polanya:</p>
                    <p className="text-white/70 mb-2">Perhatikan hubungan antara nilai <InlineMath math="n" /> dan faktor perkaliannya:</p>
                    <BlockMath math="6 = 2 \times 3 = (1+1)(1+2)" />
                    <BlockMath math="12 = 3 \times 4 = (2+1)(2+2)" />
                    <BlockMath math="20 = 4 \times 5 = (3+1)(3+2)" />
                    <p className="text-green-300 font-semibold mt-2">Pola: faktor pertama = <InlineMath math="(n+1)" />, faktor kedua = <InlineMath math="(n+2)" /></p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">Langkah 3 — Rumus umum & substitusi n = 15:</p>
                    <BlockMath math="U_n = (n+1)(n+2)" />
                    <BlockMath math="U_{15} = (15+1)(15+2) = 16 \times 17 = 272" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ Jawaban: Suku ke-15 dari barisan 6, 12, 20, 30, … adalah <strong className="text-yellow-300">272</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 3 POLA KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit (Pola Gambar)" />
            <div className="px-5 pb-5 space-y-4">
              <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
              <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                <p className="font-body text-sm text-white/85 mb-3">
                  Perhatikan pola susunan lingkaran berikut. Tentukan <strong>banyaknya lingkaran pada Pola ke-20</strong>!
                </p>
                {/* Gambar ulang pola lingkaran */}
                <div className="flex gap-5 flex-wrap justify-center items-end">
                  {[
                    { pola: 1, rows: 1, cols: 3 },
                    { pola: 2, rows: 2, cols: 4 },
                    { pola: 3, rows: 3, cols: 5 },
                  ].map(({ pola, rows, cols }) => (
                    <div key={pola} className="text-center">
                      <div className="inline-flex flex-col gap-0.5 mb-1">
                        {Array.from({ length: rows }).map((_, ri) => (
                          <div key={ri} className="flex gap-0.5">
                            {Array.from({ length: cols }).map((_, ci) => (
                              <div key={ci} className="w-4 h-4 rounded-full border-2 border-red-300/70 bg-red-950/60" />
                            ))}
                          </div>
                        ))}
                      </div>
                      <p className="text-red-200 text-xs font-bold">{rows * cols} lingkaran</p>
                      <p className="text-red-400 text-[10px]">Pola ke-{pola}</p>
                    </div>
                  ))}
                  <span className="text-white/40 self-center text-lg">...</span>
                </div>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                <div className="space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Nyatakan setiap pola sebagai perkalian dua bilangan:</p>
                    <div className="overflow-x-auto">
                      <table className="text-xs border-collapse w-full">
                        <thead>
                          <tr className="bg-red-900/40">
                            <th className="border border-red-500/30 px-3 py-1 text-red-200">Pola ke-</th>
                            <th className="border border-red-500/30 px-3 py-1 text-red-200">Banyak Lingkaran</th>
                            <th className="border border-red-500/30 px-3 py-1 text-red-200">Bentuk Perkalian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [1, 3,  "1 × 3"],
                            [2, 8,  "2 × 4"],
                            [3, 15, "3 × 5"],
                            [4, 24, "4 × 6"],
                          ].map(([n, u, bentuk]) => (
                            <tr key={String(n)} className="bg-slate-800/30">
                              <td className="border border-white/10 px-3 py-1 text-center text-white/60">{n}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-red-200 font-bold">{u}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-cyan-300 font-mono">{bentuk}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Temukan polanya:</p>
                    <p className="text-white/70 mb-2">Perhatikan hubungan antara nilai <InlineMath math="n" /> dan faktor perkaliannya:</p>
                    <BlockMath math="3 = 1 \times 3 = 1 \times (1+2)" />
                    <BlockMath math="8 = 2 \times 4 = 2 \times (2+2)" />
                    <BlockMath math="15 = 3 \times 5 = 3 \times (3+2)" />
                    <p className="text-green-300 font-semibold mt-2">Pola: faktor pertama = <InlineMath math="n" />, faktor kedua = <InlineMath math="(n+2)" /></p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">Langkah 3 — Rumus umum & substitusi n = 20:</p>
                    <BlockMath math="U_n = n(n+2)" />
                    <BlockMath math="U_{20} = 20 \times (20+2) = 20 \times 22 = 440" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ Jawaban: Banyak lingkaran pada Pola ke-20 adalah <strong className="text-yellow-300">440 lingkaran</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN GABUNGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman Pengertian Pola, Barisan Bilangan & Pola-Pola Khusus" />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                {[
                  ["Pola Bilangan", "Susunan angka yang mengikuti aturan tertentu"],
                  ["Suku", "Setiap anggota/elemen dalam barisan"],
                  ["Barisan", "Deretan suku yang berurutan berdasarkan aturan"],
                  ["Deret", "Hasil penjumlahan suku-suku dalam suatu barisan"],
                  ["Cara menemukan pola", "Cek selisih → cek rasio → cek hubungan dengan n"],
                  ["Rumus suku ke-n", "Ekspresi matematika Uₙ = f(n) yang berlaku untuk semua suku"],
                ].map(([term, def]) => (
                  <div key={term} className="flex gap-2">
                    <span className="text-cyan-400 shrink-0">▸</span>
                    <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-body border-collapse">
                  <thead>
                    <tr className="bg-cyan-900/40">
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Nama Pola</th>
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Contoh</th>
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Rumus Uₙ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Genap", "2, 4, 6, 8, ...", "2n"],
                      ["Ganjil", "1, 3, 5, 7, ...", "2n − 1"],
                      ["Persegi", "1, 4, 9, 16, ...", "n²"],
                      ["Persegi Panjang", "2, 6, 12, 20, ...", "n(n+1)"],
                      ["Segitiga", "1, 3, 6, 10, ...", "n(n+1)/2"],
                      ["Pascal (jumlah baris n)", "1, 2, 4, 8, 16, 32, ...", "2ⁿ⁻¹"],
                      ["Fibonacci", "1, 1, 2, 3, 5, ...", "Uₙ = Uₙ₋₁ + Uₙ₋₂"],
                    ].map(([nama, contoh, rumus], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                        <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{nama}</td>
                        <td className="border border-white/10 px-3 py-2 text-white/60 font-mono">{contoh}</td>
                        <td className="border border-white/10 px-3 py-2 text-green-300 font-mono">{rumus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-xs text-yellow-200">
                  <strong>💡 Tip:</strong> Selalu uji rumus yang kamu temukan dengan minimal 3 suku pertama. Jika cocok, rumusmu sudah benar!
                </p>
              </div>
            </div>
          </div>

          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">📖 RANGKUMAN LENGKAP</p>
              <p className="font-body text-xs text-white/80 mt-0.5">Pengertian Pola, Barisan Bilangan &amp; Pola Khusus</p>
            </div>

            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              {/* Rangkuman Konsep */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[10px]">1</span>
                  Konsep Dasar
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Pola Bilangan", desc: "Susunan angka yang mengikuti aturan tertentu yang dapat diprediksi", color: "from-cyan-900/60 to-cyan-800/30 border-cyan-500/40 text-cyan-200" },
                    { label: "Barisan Bilangan", desc: "Suku-suku pola yang disusun secara berurutan: U₁, U₂, U₃, ..., Uₙ", color: "from-violet-900/60 to-violet-800/30 border-violet-500/40 text-violet-200" },
                    { label: "Deret Bilangan", desc: "Jumlah semua suku dalam barisan: Sₙ = U₁ + U₂ + ... + Uₙ", color: "from-pink-900/60 to-pink-800/30 border-pink-500/40 text-pink-200" },
                    { label: "Suku ke-n (Uₙ)", desc: "Rumus umum untuk menentukan nilai suku pada posisi ke-n", color: "from-green-900/60 to-green-800/30 border-green-500/40 text-green-200" },
                  ].map(({ label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                      <div>
                        <p className="font-body text-xs font-bold">{label}</p>
                        <p className="font-body text-xs text-white/65 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pola Khusus */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500 flex items-center justify-center text-[10px]">2</span>
                  7 Pola Khusus — Hafal Rumusnya!
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { nama: "Genap", rumus: "Uₙ = 2n", warna: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
                    { nama: "Ganjil", rumus: "Uₙ = 2n − 1", warna: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
                    { nama: "Persegi", rumus: "Uₙ = n²", warna: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
                    { nama: "Persegi Panjang", rumus: "Uₙ = n(n+1)", warna: "bg-green-900/50 border-green-500/40 text-green-200" },
                    { nama: "Segitiga", rumus: "Uₙ = n(n+1)/2", warna: "bg-yellow-900/50 border-yellow-500/40 text-yellow-200" },
                    { nama: "Pascal (baris n)", rumus: "Jumlah = 2ⁿ⁻¹", warna: "bg-pink-900/50 border-pink-500/40 text-pink-200" },
                    { nama: "Fibonacci", rumus: "Uₙ = Uₙ₋₁ + Uₙ₋₂", warna: "bg-teal-900/50 border-teal-500/40 text-teal-200" },
                  ].map(({ nama, rumus, warna }) => (
                    <div key={nama} className={`border ${warna} rounded-xl px-3 py-2 text-center`}>
                      <p className="font-body text-xs font-bold">{nama}</p>
                      <p className="font-mono text-[11px] text-white/70 mt-0.5">{rumus}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Trik */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">3</span>
                  Tips &amp; Trik Jitu
                </p>
                <div className="space-y-2">
                  {[
                    { tip: "Cek selisih antar suku terlebih dahulu", detail: "Jika selisihnya tetap → aritmetika. Jika rasionya tetap → geometri. Jika selisih 2× → bertingkat.", icon: "⚡", color: "bg-yellow-900/30 border-yellow-500/30" },
                    { tip: "Cocokkan suku dengan posisinya", detail: "Coba hubungkan nilai suku dengan n. Apakah suku ke-n = n², n(n+1), atau 2ⁿ? Uji dengan n=1, 2, 3.", icon: "🔍", color: "bg-blue-900/30 border-blue-500/30" },
                    { tip: "Hafal 7 pola khusus di atas", detail: "Soal ujian sering menyamarkan pola khusus. Kenali polanya dulu sebelum mencari rumus.", icon: "🧠", color: "bg-green-900/30 border-green-500/30" },
                    { tip: "Verifikasi dengan minimal 3 suku", detail: "Rumus yang benar harus cocok untuk semua suku, bukan hanya 1 atau 2 suku.", icon: "✅", color: "bg-violet-900/30 border-violet-500/30" },
                  ].map(({ tip, detail, icon, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kesimpulan */}
              <div className="bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-pink-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌟</div>
                <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pola bilangan bukan sekadar deretan angka — ia adalah{" "}
                  <strong className="text-cyan-300">bahasa tersembunyi alam semesta</strong>. Dari motif batik hingga galaksi spiral, dari petikan gitar hingga tumbuhan, matematika mengungkapkan keteraturan di balik segala sesuatu. Dengan menguasai pola bilangan, kamu memiliki <strong className="text-yellow-300">kunci untuk membaca dunia secara matematis</strong>.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Pola", "Barisan", "Deret", "Rumus Uₙ", "7 Pola Khusus"].map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">
                  🚀 Kamu sudah siap ke materi berikutnya!
                </p>
              </div>

            </div>
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
