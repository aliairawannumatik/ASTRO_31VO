import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, Layers, Sparkles, Activity } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import ArcDifferenceAnimation from "@/components/ArcDifferenceAnimation";

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
                Coba perhatikan lantai keramik bermotif, petikan dawai gitar, atau jadwal bus yang datang setiap 15 menit — semuanya punya <strong className="text-cyan-300">pola</strong>! Dalam matematika, pola bilangan adalah susunan angka-angka yang mengikuti <strong className="text-cyan-300">aturan tertentu</strong> yang bisa kita prediksi dan analisis.
              </p>
              <figure className="flex flex-col items-center gap-2">
                <img
                  src="/batik-sidomukti.png"
                  alt="Batik Sidomukti"
                  className="w-full max-w-sm rounded-xl border border-cyan-500/30 shadow-lg object-cover"
                />
                <figcaption className="font-body text-xs text-white/50 italic text-center">
                  Batik Sidomukti — salah satu contoh pola berulang dalam seni budaya Indonesia
                </figcaption>
              </figure>
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
                <div className="flex gap-1 flex-wrap mb-2">
                  {[2,4,6,8,10].map(n => (
                    <span key={n} className="bg-cyan-700/50 border border-cyan-400/40 text-cyan-200 text-xs font-bold px-2 py-1 rounded-lg">{n}</span>
                  ))}
                  <span className="text-white/40 self-center">...</span>
                </div>
                <BlockMath math="U_n = 2n \quad (n = 1, 2, 3, \ldots)" />
              </div>

              {/* 2. Pola Ganjil */}
              <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">2</span>
                  <p className="font-body text-sm font-bold text-orange-300">Pola Bilangan Ganjil</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Bilangan yang tidak habis dibagi 2.</p>
                <div className="flex gap-1 flex-wrap mb-2">
                  {[1,3,5,7,9].map(n => (
                    <span key={n} className="bg-orange-700/50 border border-orange-400/40 text-orange-200 text-xs font-bold px-2 py-1 rounded-lg">{n}</span>
                  ))}
                  <span className="text-white/40 self-center">...</span>
                </div>
                <BlockMath math="U_n = 2n - 1 \quad (n = 1, 2, 3, \ldots)" />
              </div>

              {/* 3. Pola Persegi */}
              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-violet-500 text-white text-xs font-bold px-2 py-0.5 rounded">3</span>
                  <p className="font-body text-sm font-bold text-violet-300">Pola Bilangan Persegi</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Bilangan kuadrat — bisa disusun membentuk persegi.</p>
                <div className="flex gap-3 flex-wrap mb-2 items-end">
                  {[
                    { n: 1, dots: [[1]] },
                    { n: 4, dots: [[1,1],[1,1]] },
                    { n: 9, dots: [[1,1,1],[1,1,1],[1,1,1]] },
                  ].map(({ n, dots }) => (
                    <div key={n} className="text-center">
                      <div className="inline-flex flex-col gap-0.5 mb-1">
                        {dots.map((row, ri) => (
                          <div key={ri} className="flex gap-0.5">
                            {row.map((_, ci) => <div key={ci} className="w-3 h-3 rounded-sm bg-violet-400" />)}
                          </div>
                        ))}
                      </div>
                      <p className="text-violet-200 text-xs font-bold">{n}</p>
                    </div>
                  ))}
                  <span className="text-white/40 self-center text-lg">...</span>
                </div>
                <BlockMath math="U_n = n^2 \quad \Rightarrow \quad 1, 4, 9, 16, 25, \ldots" />
              </div>

              {/* 4. Pola Persegi Panjang */}
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">4</span>
                  <p className="font-body text-sm font-bold text-green-300">Pola Bilangan Persegi Panjang</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Titik-titik yang membentuk persegi panjang dengan sisi <InlineMath math="n" /> dan <InlineMath math="n+1" />.</p>
                <div className="flex gap-3 flex-wrap mb-2 items-end">
                  {[
                    { n: 2, rows: 1, cols: 2 },
                    { n: 6, rows: 2, cols: 3 },
                    { n: 12, rows: 3, cols: 4 },
                  ].map(({ n, rows, cols }) => (
                    <div key={n} className="text-center">
                      <div className="inline-flex flex-col gap-0.5 mb-1">
                        {Array.from({ length: rows }).map((_, ri) => (
                          <div key={ri} className="flex gap-0.5">
                            {Array.from({ length: cols }).map((_, ci) => <div key={ci} className="w-3 h-3 rounded-sm bg-green-400" />)}
                          </div>
                        ))}
                      </div>
                      <p className="text-green-200 text-xs font-bold">{n}</p>
                    </div>
                  ))}
                  <span className="text-white/40 self-center text-lg">...</span>
                </div>
                <BlockMath math="U_n = n(n+1) \quad \Rightarrow \quad 2, 6, 12, 20, 30, \ldots" />
              </div>

              {/* 5. Pola Segitiga */}
              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded">5</span>
                  <p className="font-body text-sm font-bold text-yellow-300">Pola Bilangan Segitiga</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Titik-titik yang disusun membentuk segitiga sama sisi.</p>
                <div className="flex gap-4 flex-wrap mb-2 items-end">
                  {[
                    { n: 1, rows: [1] },
                    { n: 3, rows: [1, 2] },
                    { n: 6, rows: [1, 2, 3] },
                    { n: 10, rows: [1, 2, 3, 4] },
                  ].map(({ n, rows }) => (
                    <div key={n} className="text-center">
                      <div className="inline-flex flex-col items-center gap-0.5 mb-1">
                        {rows.map((count, ri) => (
                          <div key={ri} className="flex gap-0.5">
                            {Array.from({ length: count }).map((_, ci) => <div key={ci} className="w-3 h-3 rounded-full bg-yellow-400" />)}
                          </div>
                        ))}
                      </div>
                      <p className="text-yellow-200 text-xs font-bold">{n}</p>
                    </div>
                  ))}
                  <span className="text-white/40 self-center text-lg">...</span>
                </div>
                <BlockMath math="U_n = \frac{n(n+1)}{2} \quad \Rightarrow \quad 1, 3, 6, 10, 15, \ldots" />
              </div>

              {/* 6. Segitiga Pascal */}
              <div className="bg-pink-900/30 border border-pink-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">6</span>
                  <p className="font-body text-sm font-bold text-pink-300">Pola Segitiga Pascal</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Setiap bilangan = jumlah dua bilangan di atasnya. Baris dimulai dan diakhiri angka 1.</p>
                <div className="flex flex-col items-center gap-1 my-3 font-mono text-xs">
                  {[
                    { row: [1],                sum: 1  },
                    { row: [1, 1],             sum: 2  },
                    { row: [1, 2, 1],          sum: 4  },
                    { row: [1, 3, 3, 1],       sum: 8  },
                    { row: [1, 4, 6, 4, 1],    sum: 16 },
                    { row: [1, 5, 10, 10, 5, 1], sum: 32 },
                  ].map(({ row, sum }, ri) => (
                    <div key={ri} className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {row.map((val, ci) => (
                          <span key={ci} className="bg-pink-700/50 border border-pink-400/40 text-pink-200 font-bold rounded px-1.5 py-0.5 min-w-[24px] text-center">{val}</span>
                        ))}
                      </div>
                      <span className="text-white/30 text-xs">→</span>
                      <span className="bg-pink-500/20 border border-pink-400/50 text-pink-100 font-bold rounded px-1.5 py-0.5 min-w-[28px] text-center">{sum}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 space-y-1">
                  <p className="font-body text-xs text-white/70">Jumlah bilangan pada setiap baris: <strong className="text-pink-300">1, 2, 4, 8, 16, 32, ...</strong></p>
                  <p className="font-body text-xs text-white/70">Setiap baris, jumlahnya <strong className="text-pink-300">berlipat ganda (×2)</strong> dari baris sebelumnya.</p>
                  <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-2 mt-2">
                    <BlockMath math="\text{Jumlah baris ke-}n = 2^{n-1}" />
                  </div>
                </div>
              </div>

              {/* 7. Fibonacci */}
              <div className="bg-teal-900/30 border border-teal-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded">7</span>
                  <p className="font-body text-sm font-bold text-teal-300">Pola Fibonacci</p>
                </div>
                <p className="font-body text-xs text-white/70 mb-2">Setiap suku = jumlah dua suku sebelumnya. Dimulai dari 1, 1.</p>
                <div className="flex gap-1 flex-wrap mb-2">
                  {[1,1,2,3,5,8,13,21,34,55].map((n, i) => (
                    <span key={i} className="bg-teal-700/50 border border-teal-400/40 text-teal-200 text-xs font-bold px-2 py-1 rounded-lg">{n}</span>
                  ))}
                  <span className="text-white/40 self-center">...</span>
                </div>
                <BlockMath math="U_n = U_{n-1} + U_{n-2} \quad (U_1 = U_2 = 1)" />
                <p className="font-body text-xs text-white/60 mt-1">🌿 Muncul di alam: kelopak bunga, cangkang nautilus, susunan biji bunga matahari!</p>
              </div>

            </div>
          </div>

          {/* ANIMASI BUSUR BEDA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Activity className="w-5 h-5" />} iconColor="text-cyan-400" title="🌀 Animasi Busur Beda — Visualisasi Selisih Setiap Pola" />
            <div className="px-5 pb-5 space-y-3">
              <p className="font-body text-sm text-white/70 leading-relaxed">
                Pilih sebuah pola di bawah lalu perhatikan <strong className="text-cyan-300">busur melengkung</strong> yang menunjukkan <strong className="text-cyan-300">beda (selisih)</strong> antara dua suku yang berurutan. Busur muncul satu per satu dari kiri ke kanan — amati polanya!
              </p>
              <ArcDifferenceAnimation />
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
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang (Fibonacci)" />
            <div className="px-5 pb-5 space-y-4">
              <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
              <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                <p className="font-body text-sm text-white/85">Barisan Fibonacci dimulai: 1, 1, 2, 3, 5, 8, 13, 21, ...<br />a) Tuliskan suku ke-11 dan ke-12.<br />b) Berapa hasil bagi suku ke-12 terhadap suku ke-11? Apa pola yang muncul?</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">a) Lanjutkan barisan hingga suku ke-12:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead><tr className="bg-teal-900/40"><th className="border border-white/10 px-2 py-1 text-teal-200">n</th><th className="border border-white/10 px-2 py-1 text-teal-200">Uₙ</th></tr></thead>
                        <tbody>
                          {[[1,1],[2,1],[3,2],[4,3],[5,5],[6,8],[7,13],[8,21],[9,34],[10,55],[11,89],[12,144]].map(([n, u]) => (
                            <tr key={n} className={n >= 11 ? "bg-teal-900/30" : "bg-slate-800/20"}>
                              <td className="border border-white/10 px-2 py-1 text-white/60 text-center">{n}</td>
                              <td className="border border-white/10 px-2 py-1 text-center font-bold text-teal-200">{u}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-white/70 mt-2"><InlineMath math="U_{11} = 89" />, <InlineMath math="U_{12} = 144" /></p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">b) Rasio suku berurutan:</p>
                    <BlockMath math="\frac{U_{12}}{U_{11}} = \frac{144}{89} \approx 1{,}618" />
                    <p className="text-white/70 text-xs mt-1">Nilai ini mendekati <strong className="text-yellow-300">Rasio Emas (Golden Ratio) φ ≈ 1,618!</strong> Semakin besar suku Fibonacci, rasio antar suku berurutan semakin mendekati φ.</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="U_{11} = 89" />, <InlineMath math="U_{12} = 144" />, rasio ≈ 1,618 (Golden Ratio!)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 3 POLA KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit (Segitiga Pascal)" />
            <div className="px-5 pb-5 space-y-4">
              <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
              <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                <p className="font-body text-sm text-white/85">
                  a) Tuliskan baris ke-7 dari Segitiga Pascal (baris pertama = baris ke-1, bernilai "1").<br />
                  b) Berapa jumlah semua bilangan pada baris ke-7?<br />
                  c) Apa rumus jumlah bilangan pada baris ke-<InlineMath math="n" />?
                </p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                <div className="space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">a) Baris ke-7 dari Segitiga Pascal:</p>
                    <div className="flex flex-col items-center gap-1 my-2 font-mono text-xs">
                      {[
                        { baris: 1, values: [1] },
                        { baris: 2, values: [1, 1] },
                        { baris: 3, values: [1, 2, 1] },
                        { baris: 4, values: [1, 3, 3, 1] },
                        { baris: 5, values: [1, 4, 6, 4, 1] },
                        { baris: 6, values: [1, 5, 10, 10, 5, 1] },
                        { baris: 7, values: [1, 6, 15, 20, 15, 6, 1] },
                      ].map(({ baris, values }) => (
                        <div key={baris} className="flex gap-1 items-center">
                          <span className="text-white/30 text-xs w-4 text-right mr-1">{baris}</span>
                          {values.map((val, ci) => (
                            <span key={ci} className={`${baris === 7 ? "bg-pink-700/60 border-pink-400/50 text-pink-100 font-bold" : "bg-slate-700/50 border-white/10 text-white/50"} border rounded px-1.5 py-0.5 min-w-[28px] text-center`}>{val}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                    <p className="text-pink-300 font-semibold mt-1">Baris ke-7: <strong>1, 6, 15, 20, 15, 6, 1</strong></p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">b) Jumlah baris ke-7:</p>
                    <BlockMath math="1 + 6 + 15 + 20 + 15 + 6 + 1 = 64" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">c) Pola jumlah per baris:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead><tr className="bg-pink-900/40"><th className="border border-white/10 px-2 py-1 text-pink-200">Baris (n)</th><th className="border border-white/10 px-2 py-1 text-pink-200">Jumlah</th><th className="border border-white/10 px-2 py-1 text-pink-200">= 2^?</th></tr></thead>
                        <tbody>
                          {[[1,1,"2⁰"],[2,2,"2¹"],[3,4,"2²"],[4,8,"2³"],[5,16,"2⁴"],[6,32,"2⁵"],[7,64,"2⁶"]].map(([n, j, p]) => (
                            <tr key={n} className={n === 7 ? "bg-pink-900/30" : "bg-slate-800/20"}>
                              <td className="border border-white/10 px-2 py-1 text-center text-white/60">{n}</td>
                              <td className="border border-white/10 px-2 py-1 text-center font-bold text-pink-200">{j}</td>
                              <td className="border border-white/10 px-2 py-1 text-center text-green-300">{p}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <BlockMath math="\text{Jumlah baris ke-}n = 2^{n-1}" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ Baris ke-7: 1, 6, 15, 20, 15, 6, 1. Jumlah = 64 = <InlineMath math="2^6" />. Rumus: <InlineMath math="\text{Jumlah baris ke-}n = 2^{n-1}" /></p>
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
