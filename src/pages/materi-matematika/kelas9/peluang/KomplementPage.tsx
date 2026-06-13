import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Shuffle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";

const KomplementPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "contoh1", "rangkuman",
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
          KOMPLEMEN SUATU KEJADIAN
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Peluang Kejadian "Kebalikan" yang Selalu Berpasangan
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Peluang · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Komplemen Kejadian?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Saat kamu melempar dadu, ada dua kemungkinan besar: muncul angka 6, atau <em>tidak</em> muncul angka 6. Nah, "tidak muncul angka 6" inilah yang disebut <strong className="text-cyan-300">komplemen</strong> dari kejadian "muncul angka 6". Komplemen kejadian A adalah himpunan semua kejadian dalam ruang sampel yang <em>bukan</em> merupakan anggota A. Dilambangkan dengan <InlineMath math="A'" /> atau <InlineMath math="\bar{A}" />.
                </p>

                {/* Diagram Visual Komplemen */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide text-center">🌐 Diagram Ruang Sampel</p>
                  <div className="relative flex items-center justify-center">
                    <div className="w-64 h-32 rounded-xl border-2 border-purple-400/60 bg-purple-900/20 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute left-3 top-3 right-3 bottom-3 rounded-lg border-2 border-cyan-400/60 bg-cyan-900/30 flex items-center justify-center w-24 h-24">
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-cyan-300">A</p>
                          <p className="font-body text-xs text-cyan-200/70">Kejadian A</p>
                        </div>
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-red-300">A'</p>
                          <p className="font-body text-xs text-red-200/70">Komplemen</p>
                        </div>
                      </div>
                      <div className="absolute top-1 left-1/2 -translate-x-1/2">
                        <p className="font-body text-xs text-purple-300 font-bold">S (Ruang Sampel)</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-center text-white/60">A dan A' saling melengkapi — bersama-sama memenuhi seluruh ruang sampel S</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      term: "Kejadian A",
                      icon: "🎯",
                      desc: "Kejadian yang kita definisikan, misalnya 'muncul bilangan genap' saat melempar dadu.",
                      color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
                    },
                    {
                      term: "Komplemen A (A')",
                      icon: "🔄",
                      desc: "Semua kejadian dalam ruang sampel yang tidak termasuk dalam kejadian A.",
                      color: "bg-red-900/40 border-red-500/40 text-red-300",
                    },
                    {
                      term: "A ∪ A' = S",
                      icon: "🌐",
                      desc: "Gabungan A dan komplemen A selalu sama dengan ruang sampel S — tidak ada yang terlewat.",
                      color: "bg-violet-900/40 border-violet-500/40 text-violet-300",
                    },
                    {
                      term: "A ∩ A' = ∅",
                      icon: "🚫",
                      desc: "Irisan A dan komplemen A selalu kosong — tidak ada anggota yang sekaligus ada di A dan A'.",
                      color: "bg-orange-900/40 border-orange-500/40 text-orange-300",
                    },
                  ].map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Komplemen sering lebih mudah dihitung daripada kejadian aslinya! Jika menghitung P(A) langsung terasa rumit, coba hitung P(A') dulu, lalu gunakan rumus P(A) = 1 − P(A').
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KONSEP & RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Shuffle className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Rumus & Sifat Komplemen Kejadian" />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jumlah peluang suatu kejadian dan komplemennya selalu sama dengan 1. Ini karena kejadian A dan komplemen A' bersama-sama mencakup seluruh ruang sampel S.
                  </p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide">📐 Rumus Komplemen</p>
                  <div className="space-y-2">
                    <div className="bg-purple-900/20 rounded-lg p-3">
                      <BlockMath math="P(A) + P(A') = 1" />
                    </div>
                    <div className="bg-cyan-900/20 rounded-lg p-3">
                      <BlockMath math="P(A') = 1 - P(A)" />
                    </div>
                    <div className="bg-green-900/20 rounded-lg p-3">
                      <BlockMath math="P(A) = 1 - P(A')" />
                    </div>
                  </div>
                  <p className="font-body text-xs text-white/60 text-center">Ketiga bentuk ini setara — gunakan yang paling sesuai dengan soal!</p>
                </div>

                {/* Hubungan n(A) dan n(A') */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">🔗 Hubungan n(A) dan n(A')</p>
                  <BlockMath math="n(A) + n(A') = n(S)" />
                  <BlockMath math="n(A') = n(S) - n(A)" />
                  <p className="font-body text-xs text-white/60 text-center">Ini berguna untuk menghitung banyak anggota komplemen tanpa perlu mendaftar satu per satu!</p>
                </div>

                {/* Contoh Visual: Dadu */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🎲 Ilustrasi: Dadu & Komplemen</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-purple-900/50">
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-left">Kejadian A</th>
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-center"><InlineMath math="P(A)" /></th>
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-left">Komplemen A'</th>
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-center"><InlineMath math="P(A')" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Muncul bilangan genap {2,4,6}", "3/6 = 1/2", "Muncul bilangan ganjil {1,3,5}", "1/2"],
                          ["Muncul bilangan prima {2,3,5}", "3/6 = 1/2", "Muncul bukan prima {1,4,6}", "1/2"],
                          ["Muncul angka > 4 {5,6}", "2/6 = 1/3", "Muncul angka ≤ 4 {1,2,3,4}", "2/3"],
                          ["Muncul angka 6 {6}", "1/6", "Muncul bukan 6 {1,2,3,4,5}", "5/6"],
                        ].map(([a, pa, ak, pak], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-cyan-200">{a}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">{pa}</td>
                            <td className="border border-white/10 px-3 py-2 text-red-200">{ak}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-orange-300">{pak}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-center text-white/50">Perhatikan: setiap baris, P(A) + P(A') = 1 ✓</p>
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="📝 Contoh Soal & Pembahasan" />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Peluang seorang siswa lulus ujian adalah <InlineMath math="\frac{3}{4}" />. Tentukan peluang siswa tersebut <strong>tidak lulus</strong> ujian!
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Diketahui:</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80">
                      <p>• <InlineMath math="P(\text{lulus}) = \frac{3}{4}" /></p>
                      <p>• Ditanya: <InlineMath math="P(\text{tidak lulus}) = P(\text{lulus}')" /></p>
                    </div>
                    <p className="font-body text-sm text-white/80">Gunakan rumus komplemen:</p>
                    <BlockMath math="P(\text{tidak lulus}) = 1 - P(\text{lulus}) = 1 - \frac{3}{4} = \frac{1}{4}" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Peluang siswa tidak lulus adalah <InlineMath math="\frac{1}{4}" />.</p>
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
                      Dalam sebuah kotak terdapat 4 bola merah, 5 bola putih, dan 3 bola hitam. Sebuah bola diambil secara acak. Tentukan peluang terambil:<br />
                      a. Bola bukan bola merah<br />
                      b. Bola bukan bola hitam
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Diketahui:</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• <InlineMath math="n(S) = 4 + 5 + 3 = 12" /></p>
                      <p>• Merah: 4, Putih: 5, Hitam: 3</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. P(bukan merah) = P(merah'):</p>
                      <p className="font-body text-xs text-white/60 mb-1">Cara 1 (langsung): bukan merah = putih + hitam = 5 + 3 = 8</p>
                      <BlockMath math="P(\text{bukan merah}) = \frac{8}{12} = \frac{2}{3}" />
                      <p className="font-body text-xs text-white/60 mb-1">Cara 2 (komplemen): P(merah) = 4/12 = 1/3, lalu:</p>
                      <BlockMath math="P(\text{bukan merah}) = 1 - \frac{1}{3} = \frac{2}{3} \checkmark" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. P(bukan hitam) = P(hitam'):</p>
                      <BlockMath math="P(\text{hitam}) = \frac{3}{12} = \frac{1}{4}" />
                      <BlockMath math="P(\text{bukan hitam}) = 1 - \frac{1}{4} = \frac{3}{4}" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Kedua cara (langsung dan komplemen) memberikan hasil yang sama. Pilih cara yang lebih mudah sesuai soal!</p>
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
                      Dua buah dadu dilempar bersama-sama. Gunakan konsep komplemen untuk menentukan peluang bahwa jumlah kedua mata dadu <strong>bukan 12</strong>. Kemudian, jika dadu dilempar 360 kali, berapa kali diharapkan jumlah mata dadu bukan 12?
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• Dua dadu: <InlineMath math="n(S) = 6 \times 6 = 36" /></p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">Langkah 1 — Cari P(jumlah = 12):</p>
                      <p className="font-body text-xs text-white/60 mb-1">Jumlah 12 hanya dari (6,6) → 1 pasangan</p>
                      <BlockMath math="P(\text{jumlah} = 12) = \frac{1}{36}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">Langkah 2 — Gunakan komplemen:</p>
                      <BlockMath math="P(\text{bukan 12}) = 1 - P(\text{jumlah} = 12) = 1 - \frac{1}{36} = \frac{35}{36}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">Langkah 3 — Frekuensi harapan bukan 12 dalam 360 lemparan:</p>
                      <BlockMath math="F_h(\text{bukan 12}) = \frac{35}{36} \times 360 = 35 \times 10 = 350 \text{ kali}" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">⚠️ Strategi komplemen sangat efektif ketika kejadian yang ditanyakan lebih banyak anggotanya daripada komplemennya — menghitung komplemen dulu jauh lebih cepat!</p>
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
                    { poin: "Komplemen A (ditulis A') adalah semua kejadian dalam S yang bukan anggota A.", icon: "🔄" },
                    { poin: "Rumus utama: P(A') = 1 − P(A), atau P(A) + P(A') = 1.", icon: "📐" },
                    { poin: "n(A') = n(S) − n(A) — menghitung banyak anggota komplemen.", icon: "🔢" },
                    { poin: "A ∪ A' = S dan A ∩ A' = ∅ — A dan A' saling lepas dan melengkapi.", icon: "🌐" },
                    { poin: "Gunakan strategi komplemen saat kejadian yang diminta lebih mudah dihitung dari kebalikannya.", icon: "💡" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="P(A') = 1 - P(A) \quad \Leftrightarrow \quad P(A) + P(A') = 1" />
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-purple-900"
            gradientVia="via-violet-900"
            gradientTo="to-fuchsia-900"
            borderColor="border-purple-500/40"
            accentColor="text-purple-300"
            headerIcon="🔄"
            judul="Rangkuman — Komplemen Kejadian"
            subjudul="Jika bukan A, maka A' — dua sisi yang selalu melengkapi hingga sempurna!"
            ringkasan={[
              {
                emoji: "🔀",
                judul: "Apa Itu Komplemen?",
                isi: "Komplemen kejadian A (ditulis A' atau A-bar) adalah himpunan semua titik sampel dalam S yang BUKAN anggota A. A dan A' bersama-sama membentuk seluruh ruang sampel.",
                bg: "bg-purple-900/50",
                border: "border-purple-500/40",
                textColor: "text-purple-200",
              },
              {
                emoji: "⚖️",
                judul: "Sifat Utama Komplemen",
                isi: "P(A) + P(A') = 1 selalu berlaku. Artinya: peluang A terjadi + peluang A tidak terjadi = 1 (pasti). Ini adalah hukum mutlak dalam peluang!",
                bg: "bg-violet-900/50",
                border: "border-violet-500/40",
                textColor: "text-violet-200",
              },
              {
                emoji: "🔢",
                judul: "Anggota Komplemen",
                isi: "n(A') = n(S) - n(A). Banyak anggota komplemen = total ruang sampel dikurangi banyak anggota kejadian A. Selalu cek: n(A) + n(A') = n(S).",
                bg: "bg-fuchsia-900/50",
                border: "border-fuchsia-500/40",
                textColor: "text-fuchsia-200",
              },
              {
                emoji: "🛠️",
                judul: "Strategi Penggunaan",
                isi: "Jika menghitung P(A) langsung terasa rumit, coba hitung P(A') dulu lalu gunakan P(A) = 1 - P(A'). Sering kali jauh lebih mudah!",
                bg: "bg-pink-900/50",
                border: "border-pink-500/40",
                textColor: "text-pink-200",
              },
            ]}
            rumus={[
              {
                label: "Sifat Komplemen (peluang)",
                rumus: "P(A) + P(A') = 1 \\quad \\Rightarrow \\quad P(A') = 1 - P(A)",
                bg: "bg-purple-900/60",
                border: "border-purple-400/40",
                labelColor: "text-purple-300",
              },
              {
                label: "Sifat Komplemen (anggota)",
                rumus: "n(A') = n(S) - n(A)",
                bg: "bg-violet-900/60",
                border: "border-violet-400/40",
                labelColor: "text-violet-300",
              },
            ]}
            tips={[
              { emoji: "🚀", teks: "Trik komplemen: soal bertipe 'minimal satu...' atau 'paling sedikit satu...' selalu lebih mudah diselesaikan dengan komplemen. Hitung P(tidak satupun) lalu kurangi dari 1!" },
              { emoji: "✅", teks: "Cek wajib: P(A) + P(A') harus selalu = 1. Jika tidak, ada kesalahan dalam perhitungan. Gunakan ini sebagai verifikasi jawaban." },
              { emoji: "💡", teks: "Notasi: komplemen A bisa ditulis sebagai A', A-bar, atau Ac. Semua simbol tersebut bermakna sama: kejadian yang bukan A." },
              { emoji: "🎯", teks: "Jika P(A) = 0,3 maka P(A') = 0,7. Jika P(A) = 3/8 maka P(A') = 5/8. Selalu jumlahnya = 1. Ingat ini dan soal komplemen tidak akan pernah sulit!" },
            ]}
            kesimpulan="Komplemen adalah salah satu konsep paling elegan dalam matematika — setiap kejadian punya pasangan yang melengkapinya menjadi sempurna (total = 1). Dalam kehidupan nyata, komplemen digunakan di asuransi (P(klaim) = 1 - P(tidak klaim)), quality control, dan pemrograman logika AI!"
            kesimpulanBg="bg-gradient-to-r from-purple-900/80 to-violet-900/80"
            kesimpulanBorder="border-purple-400/50"
            kesimpulanTextColor="text-purple-100"
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/peluang"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              ← Kembali ke Menu Peluang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KomplementPage;
