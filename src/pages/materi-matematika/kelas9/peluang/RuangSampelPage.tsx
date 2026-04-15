import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import heroImage from "@assets/image_1776223164069.png";
import coinImage from "@assets/koin_fix_1776223721630.png";
import diceImage from "@assets/image_1776223510131.png";

const RuangSampelPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1", "contoh1a", "contoh1b", "contoh1c",
    "konsep2", "contoh2a", "contoh2b", "contoh2c",
    "rangkuman",
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
      {expandedSections.includes(id)
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
          RUANG SAMPEL &amp; TITIK SAMPEL
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Kejadian Tunggal &amp; Kejadian Majemuk
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Peluang · Materi Matematika
        </p>

        <div className="mb-6 rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-900/30 mx-auto w-40">
          <img
            src={heroImage}
            alt="Melempar koin – ilustrasi ruang sampel"
            className="w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Memahami Ruang Sampel" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu sedang melempar sebuah koin ke udara. Koin itu bisa jatuh menunjukkan sisi <strong className="text-cyan-300">Angka</strong> atau sisi <strong className="text-cyan-300">Gambar</strong>. Nah, himpunan semua hasil yang <em>mungkin</em> terjadi itulah yang disebut <strong className="text-cyan-300">Ruang Sampel</strong>!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      term: "Percobaan (Eksperimen)",
                      icon: "🧪",
                      desc: "Kegiatan yang menghasilkan suatu hasil tertentu, misalnya melempar koin, melempar dadu, atau mengambil kartu.",
                      color: "bg-blue-900/40 border-blue-500/40 text-blue-300",
                    },
                    {
                      term: "Ruang Sampel (S)",
                      icon: "🌐",
                      desc: "Himpunan semua hasil yang mungkin muncul dari suatu percobaan. Dilambangkan dengan huruf S.",
                      color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
                    },
                    {
                      term: "Titik Sampel",
                      icon: "📍",
                      desc: "Setiap anggota dari ruang sampel. Satu hasil tunggal dari percobaan disebut satu titik sampel.",
                      color: "bg-violet-900/40 border-violet-500/40 text-violet-300",
                    },
                    {
                      term: "Kejadian (K)",
                      icon: "🎯",
                      desc: "Himpunan bagian dari ruang sampel yang memenuhi syarat tertentu. Contoh: muncul bilangan genap saat melempar dadu.",
                      color: "bg-orange-900/40 border-orange-500/40 text-orange-300",
                    },
                  ].map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">📌 Notasi Penting</p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    <p><InlineMath math="S" /> = ruang sampel, <InlineMath math="n(S)" /> = banyaknya titik sampel</p>
                    <p><InlineMath math="K" /> = kejadian tertentu, <InlineMath math="n(K)" /> = banyaknya anggota kejadian <InlineMath math="K" /></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Ruang sampel selalu ditulis dalam kurung kurawal <InlineMath math="\{ \ldots \}" />, sama seperti penulisan himpunan dalam matematika!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
               SUB-BAB 1 — RUANG SAMPEL KEJADIAN TUNGGAL
          ════════════════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Ruang Sampel Kejadian Tunggal" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kejadian <strong className="text-green-300">tunggal</strong> artinya kita hanya melakukan <em>satu jenis percobaan</em> dengan <em>satu alat</em>, misalnya melempar satu koin, melempar satu dadu, atau mengambil satu kartu. Cara paling mudah menentukan ruang sampelnya adalah dengan <strong className="text-green-300">mendaftar semua kemungkinan</strong> satu per satu.
                  </p>
                </div>

                {/* UANG KOIN */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🪙 a. Uang Koin</p>
                  <div className="flex justify-center">
                    <img src={coinImage} alt="Uang koin Rp1.000" className="w-52 rounded-lg" />
                  </div>
                  <div className="flex gap-3 justify-center">
                    {[
                      { sisi: "A", label: "Angka", color: "bg-yellow-600/60 border-yellow-400/60 text-yellow-200" },
                      { sisi: "G", label: "Gambar", color: "bg-amber-800/60 border-amber-500/60 text-amber-200" },
                    ].map(({ sisi, label, color }) => (
                      <div key={sisi} className={`border ${color} rounded-full w-20 h-20 flex flex-col items-center justify-center`}>
                        <p className="font-display text-2xl font-bold">{sisi}</p>
                        <p className="font-body text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/60 border border-yellow-500/20 rounded-lg p-3 text-sm font-body">
                    <BlockMath math="S = \{A,\; G\},\quad n(S) = 2" />
                    <p className="text-white/60 text-xs text-center">A = Angka, G = Gambar</p>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* DADU */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🎲 b. Dadu Bermuka Enam</p>
                  <div className="flex justify-center">
                    <img src={diceImage} alt="Dadu bermuka enam" className="w-48 rounded-lg" />
                  </div>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="w-12 h-12 bg-white/10 border border-white/30 rounded-xl flex items-center justify-center">
                        <span className="font-display text-xl font-bold text-white">{n}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-3 text-sm font-body">
                    <BlockMath math="S = \{1,\; 2,\; 3,\; 4,\; 5,\; 6\},\quad n(S) = 6" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-blue-900/50">
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200 text-left">Mata Dadu</th>
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200">Genap?</th>
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200">Prima?</th>
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200">Ganjil?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "—", "—", "✓"],
                          [2, "✓", "✓", "—"],
                          [3, "—", "✓", "✓"],
                          [4, "✓", "—", "—"],
                          [5, "—", "✓", "✓"],
                          [6, "✓", "—", "—"],
                        ].map(([n, g, p, gj], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 font-bold text-white text-center">{n}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-400">{g}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-400">{p}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-orange-400">{gj}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* KARTU BRIDGE */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🃏 c. Kartu Bridge</p>
                  <p className="font-body text-xs text-white/70 leading-relaxed">
                    Satu set kartu bridge terdiri dari <strong className="text-white">52 kartu</strong> yang dibagi menjadi 4 jenis (suit), masing-masing berisi 13 kartu bernomor A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { suit: "♠ Sekop", color: "bg-slate-700/70 border-slate-400/40 text-white", count: 13, note: "Hitam" },
                      { suit: "♣ Keriting", color: "bg-slate-700/70 border-slate-400/40 text-white", count: 13, note: "Hitam" },
                      { suit: "♥ Hati", color: "bg-red-900/50 border-red-400/40 text-red-200", count: 13, note: "Merah" },
                      { suit: "♦ Wajik", color: "bg-red-900/50 border-red-400/40 text-red-200", count: 13, note: "Merah" },
                    ].map(({ suit, color, count, note }) => (
                      <div key={suit} className={`border ${color} rounded-xl p-3 text-center`}>
                        <p className="font-display text-xl font-bold mb-1">{suit}</p>
                        <p className="font-body text-xs font-semibold">{count} kartu · {note}</p>
                        <p className="font-body text-xs text-white/50 mt-1">A 2 3 4 5 6 7 8 9 10 J Q K</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/60 border border-purple-500/20 rounded-lg p-3">
                    <BlockMath math="n(S) = 52 \text{ kartu}" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs font-body text-white/70">
                      <p>• Kartu merah: 26 (♥ + ♦)</p>
                      <p>• Kartu hitam: 26 (♠ + ♣)</p>
                      <p>• Kartu As (A): 4 kartu</p>
                      <p>• Kartu gambar (J/Q/K): 12 kartu</p>
                      <p>• Kartu bernomor (2–10): 36 kartu</p>
                      <p>• Kartu King: 4 kartu</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 1 ──────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1a" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📝 Contoh Soal Sub-Bab 1" />
            {expandedSections.includes("contoh1a") && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Sebuah uang koin dilempar satu kali. Tentukan:<br />
                      a. Ruang sampel <InlineMath math="S" /> dan <InlineMath math="n(S)" /><br />
                      b. Kejadian <InlineMath math="K" /> = muncul sisi Angka, serta <InlineMath math="n(K)" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Satu koin memiliki 2 sisi: Angka (A) dan Gambar (G).</p>
                    <div className="space-y-1">
                      <p className="font-body text-sm text-white/80">a. Daftar semua kemungkinan:</p>
                      <BlockMath math="S = \{A,\; G\},\quad n(S) = 2" />
                      <p className="font-body text-sm text-white/80">b. Kejadian muncul Angka hanya ada 1 anggota:</p>
                      <BlockMath math="K = \{A\},\quad n(K) = 1" />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Dari 2 kemungkinan, hanya 1 yang memenuhi kejadian K.</p>
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
                      Sebuah dadu bermuka enam dilempar satu kali. Tentukan ruang sampel <InlineMath math="S" />, kemudian tentukan anggota dan nilai <InlineMath math="n(K)" /> untuk kejadian berikut:<br />
                      a. <InlineMath math="K_1" /> = muncul bilangan prima<br />
                      b. <InlineMath math="K_2" /> = muncul bilangan lebih dari 4
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">Ruang sampel dadu:</p>
                      <BlockMath math="S = \{1, 2, 3, 4, 5, 6\},\quad n(S) = 6" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Bilangan prima dari 1–6 adalah: 2, 3, 5</p>
                      <BlockMath math="K_1 = \{2, 3, 5\},\quad n(K_1) = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Bilangan lebih dari 4 dari 1–6 adalah: 5, 6</p>
                      <BlockMath math="K_2 = \{5, 6\},\quad n(K_2) = 2" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Ingat: 1 bukan bilangan prima! Bilangan prima dimulai dari 2.</p>
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
                      Dari satu set kartu bridge (52 kartu), diambil satu kartu secara acak. Tentukan <InlineMath math="n(S)" /> dan nilai <InlineMath math="n(K)" /> untuk kejadian berikut:<br />
                      a. <InlineMath math="K_1" /> = terambil kartu merah bernomor ganjil<br />
                      b. <InlineMath math="K_2" /> = terambil kartu hitam bukan kartu gambar (bukan J, Q, K)
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <BlockMath math="n(S) = 52" />
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        a. <strong>Kartu merah bernomor ganjil:</strong><br />
                        Kartu merah = ♥ dan ♦ (masing-masing 13 kartu)<br />
                        Nomor ganjil dari A, 2–10, J, Q, K: yaitu A, 3, 5, 7, 9 → <strong>5 nomor ganjil</strong>
                      </p>
                      <BlockMath math="n(K_1) = 2 \text{ suit} \times 5 \text{ kartu} = 10 \text{ kartu}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        b. <strong>Kartu hitam bukan kartu gambar:</strong><br />
                        Kartu hitam = ♠ dan ♣ (masing-masing 13 kartu)<br />
                        Total kartu hitam = 26 kartu<br />
                        Kartu gambar hitam = J♠, Q♠, K♠, J♣, Q♣, K♣ = 6 kartu
                      </p>
                      <BlockMath math="n(K_2) = 26 - 6 = 20 \text{ kartu}" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">⚠️ Perhatikan As (A): dalam kartu bridge, As dihitung bernilai 1 dan termasuk bilangan ganjil!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
               SUB-BAB 2 — RUANG SAMPEL KEJADIAN MAJEMUK
          ════════════════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title="📗 Sub-Bab 2: Ruang Sampel Kejadian Majemuk" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kejadian <strong className="text-cyan-300">majemuk</strong> terjadi saat percobaan melibatkan <em>lebih dari satu alat</em> sekaligus, misalnya dua koin, tiga koin, dua dadu, atau koin dengan dadu. Ada rumus praktis untuk menghitung <InlineMath math="n(S)" />:
                  </p>
                  <div className="mt-3">
                    <BlockMath math="n(S) = n(S_1) \times n(S_2) \times \cdots" />
                  </div>
                  <p className="font-body text-xs text-cyan-200/60 text-center -mt-1">Kalikan banyaknya kemungkinan masing-masing alat!</p>
                </div>

                {/* DUA KOIN */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🪙🪙 a. Pengetosan Dua Koin</p>
                  <p className="font-body text-xs text-white/70">
                    Setiap koin punya 2 kemungkinan (A atau G), jadi: <InlineMath math="n(S) = 2 \times 2 = 4" />
                  </p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse mx-auto">
                      <thead>
                        <tr>
                          <th className="border border-cyan-500/30 bg-cyan-900/50 px-4 py-2 text-cyan-200">Koin 1 \ Koin 2</th>
                          <th className="border border-cyan-500/30 bg-cyan-900/50 px-4 py-2 text-cyan-200">A</th>
                          <th className="border border-cyan-500/30 bg-cyan-900/50 px-4 py-2 text-cyan-200">G</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[["A", "AA", "AG"], ["G", "GA", "GG"]].map(([row, c1, c2], i) => (
                          <tr key={i}>
                            <td className="border border-cyan-500/30 bg-cyan-900/30 px-4 py-2 font-bold text-cyan-200 text-center">{row}</td>
                            <td className="border border-white/10 px-4 py-2 text-white text-center bg-white/5">{c1}</td>
                            <td className="border border-white/10 px-4 py-2 text-white text-center">{c2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-lg p-3">
                    <BlockMath math="S = \{AA,\; AG,\; GA,\; GG\},\quad n(S) = 4" />
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* TIGA KOIN */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🪙🪙🪙 b. Pengetosan Tiga Koin</p>
                  <p className="font-body text-xs text-white/70">
                    <InlineMath math="n(S) = 2 \times 2 \times 2 = 8" /> — gunakan diagram pohon untuk mendaftarnya:
                  </p>
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-violet-300 mb-3">🌳 Diagram Pohon</p>
                    <div className="grid grid-cols-4 gap-1 text-xs font-body text-center">
                      <div className="text-violet-300 font-bold text-left pl-1">Koin 1</div>
                      <div className="text-violet-300 font-bold">Koin 2</div>
                      <div className="text-violet-300 font-bold">Koin 3</div>
                      <div className="text-violet-300 font-bold">Hasil</div>
                      {[
                        ["A", "A", "A", "AAA"],
                        ["", "", "G", "AAG"],
                        ["", "G", "A", "AGA"],
                        ["", "", "G", "AGG"],
                        ["G", "A", "A", "GAA"],
                        ["", "", "G", "GAG"],
                        ["", "G", "A", "GGA"],
                        ["", "", "G", "GGG"],
                      ].map(([k1, k2, k3, hasil], i) => (
                        <React.Fragment key={i}>
                          <div className={`py-1 text-left pl-1 ${k1 ? "text-yellow-300 font-bold" : "text-white/20"}`}>{k1 || "│"}</div>
                          <div className={`py-1 ${k2 ? "text-amber-300 font-bold" : "text-white/20"}`}>{k2 || "│"}</div>
                          <div className="py-1 text-orange-300 font-bold">{k3}</div>
                          <div className="py-1 text-white bg-white/5 rounded">{hasil}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-lg p-3">
                    <BlockMath math="S = \{AAA,\; AAG,\; AGA,\; AGG,\; GAA,\; GAG,\; GGA,\; GGG\}" />
                    <BlockMath math="n(S) = 8" />
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* DUA DADU */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🎲🎲 c. Pengetosan Dua Dadu</p>
                  <p className="font-body text-xs text-white/70">
                    Setiap dadu punya 6 sisi, jadi: <InlineMath math="n(S) = 6 \times 6 = 36" />
                  </p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-blue-500/30 bg-blue-900/50 px-2 py-2 text-blue-200">D1\D2</th>
                          {[1,2,3,4,5,6].map(n => (
                            <th key={n} className="border border-blue-500/30 bg-blue-900/50 px-2 py-2 text-blue-200">{n}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[1,2,3,4,5,6].map((d1) => (
                          <tr key={d1}>
                            <td className="border border-blue-500/30 bg-blue-900/30 px-2 py-2 font-bold text-blue-200 text-center">{d1}</td>
                            {[1,2,3,4,5,6].map((d2) => {
                              const jumlah = d1 + d2;
                              const isHighlight = jumlah === 7;
                              return (
                                <td key={d2} className={`border border-white/10 px-2 py-2 text-center ${isHighlight ? "bg-yellow-600/30 text-yellow-200 font-bold" : "bg-white/3 text-white/70"}`}>
                                  ({d1},{d2})
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-yellow-300 text-center">🟡 Sel berwarna kuning = pasangan dengan jumlah 7 (ada 6 pasangan)</p>
                  <div className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-3">
                    <BlockMath math="n(S) = 36 \text{ pasangan terurut}" />
                    <p className="font-body text-xs text-white/60 text-center">Ditulis sebagai pasangan terurut (dadu1, dadu2)</p>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* KOIN DAN DADU */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🪙🎲 d. Pengetosan Koin dan Dadu</p>
                  <p className="font-body text-xs text-white/70">
                    Koin punya 2 kemungkinan, dadu punya 6: <InlineMath math="n(S) = 2 \times 6 = 12" />
                  </p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse mx-auto">
                      <thead>
                        <tr>
                          <th className="border border-teal-500/30 bg-teal-900/50 px-3 py-2 text-teal-200">Koin \ Dadu</th>
                          {[1,2,3,4,5,6].map(n => (
                            <th key={n} className="border border-teal-500/30 bg-teal-900/50 px-3 py-2 text-teal-200">{n}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {["A","G"].map((k, i) => (
                          <tr key={k}>
                            <td className="border border-teal-500/30 bg-teal-900/30 px-3 py-2 font-bold text-teal-200 text-center">{k}</td>
                            {[1,2,3,4,5,6].map((d) => (
                              <td key={d} className={`border border-white/10 px-3 py-2 text-center ${i===0 ? "bg-yellow-900/20 text-yellow-200" : "bg-emerald-900/20 text-emerald-200"}`}>
                                ({k},{d})
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/60 border border-teal-500/20 rounded-lg p-3">
                    <BlockMath math="S = \{(A,1),(A,2),(A,3),(A,4),(A,5),(A,6),(G,1),(G,2),(G,3),(G,4),(G,5),(G,6)\}" />
                    <BlockMath math="n(S) = 12" />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 2 ──────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2a" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title="📝 Contoh Soal Sub-Bab 2" />
            {expandedSections.includes("contoh2a") && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Dua uang koin dilempar bersamaan satu kali. Tentukan:<br />
                      a. <InlineMath math="n(S)" /><br />
                      b. Kejadian <InlineMath math="K" /> = muncul tepat satu sisi Angka, serta <InlineMath math="n(K)" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Ruang sampel dua koin:</p>
                      <BlockMath math="S = \{AA,\; AG,\; GA,\; GG\},\quad n(S) = 4" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Tepat satu Angka artinya hanya satu koin menunjukkan A:</p>
                      <BlockMath math="K = \{AG,\; GA\},\quad n(K) = 2" />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 AA bukan karena ada DUA angka. GG bukan karena tidak ada angka sama sekali.</p>
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
                      Dua buah dadu dilempar bersamaan. Tentukan <InlineMath math="n(S)" /> dan <InlineMath math="n(K)" /> untuk kejadian <InlineMath math="K" /> = jumlah kedua mata dadu sama dengan 8.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <BlockMath math="n(S) = 6 \times 6 = 36" />
                    <p className="font-body text-sm text-white/80">Cari semua pasangan (d1, d2) yang jumlahnya = 8:</p>
                    <div className="overflow-x-auto">
                      <table className="text-xs font-body border-collapse mx-auto">
                        <thead>
                          <tr className="bg-yellow-900/40">
                            <th className="border border-yellow-500/30 px-3 py-1.5 text-yellow-200">Pasangan (d1, d2)</th>
                            <th className="border border-yellow-500/30 px-3 py-1.5 text-yellow-200">Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[["(2, 6)", 8], ["(3, 5)", 8], ["(4, 4)", 8], ["(5, 3)", 8], ["(6, 2)", 8]].map(([p, j], i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                              <td className="border border-white/10 px-3 py-1.5 text-white text-center">{p}</td>
                              <td className="border border-white/10 px-3 py-1.5 text-yellow-300 font-bold text-center">{j}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <BlockMath math="K = \{(2,6),\;(3,5),\;(4,4),\;(5,3),\;(6,2)\},\quad n(K) = 5" />
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Ingat: (2,6) dan (6,2) adalah pasangan yang <em>berbeda</em> karena dadu pertama dan kedua dibedakan!</p>
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
                      Sebuah koin dan sebuah dadu dilempar bersamaan. Tentukan <InlineMath math="n(S)" /> dan <InlineMath math="n(K)" /> untuk:<br />
                      a. <InlineMath math="K_1" /> = muncul Angka dan bilangan genap<br />
                      b. <InlineMath math="K_2" /> = muncul Gambar dan bilangan lebih dari 3<br />
                      c. <InlineMath math="K_3" /> = muncul Gambar atau bilangan prima
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <BlockMath math="n(S) = 2 \times 6 = 12" />
                    <p className="font-body text-sm text-white/80">Ruang sampel: {"{"}(A,1),(A,2),(A,3),(A,4),(A,5),(A,6),(G,1),(G,2),(G,3),(G,4),(G,5),(G,6){"}"}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Angka DAN genap (bilangan genap: 2, 4, 6):</p>
                      <BlockMath math="K_1 = \{(A,2),\;(A,4),\;(A,6)\},\quad n(K_1) = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Gambar DAN lebih dari 3 (yaitu 4, 5, 6):</p>
                      <BlockMath math="K_2 = \{(G,4),\;(G,5),\;(G,6)\},\quad n(K_2) = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">c. Gambar ATAU prima (prima: 2, 3, 5). Hitung dengan metode gabungan:</p>
                      <p className="font-body text-xs text-white/60 mb-1">Gambar: (G,1),(G,2),(G,3),(G,4),(G,5),(G,6) → 6 pasangan</p>
                      <p className="font-body text-xs text-white/60 mb-1">Prima tapi BUKAN Gambar: (A,2),(A,3),(A,5) → 3 pasangan</p>
                      <BlockMath math="K_3 = \{(G,1),(G,2),(G,3),(G,4),(G,5),(G,6),(A,2),(A,3),(A,5)\}" />
                      <BlockMath math="n(K_3) = 9" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">⚠️ Kata "ATAU" berarti salah satu atau keduanya terpenuhi. Hindari menghitung (G,2), (G,3), (G,5) dua kali!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="📋 Rangkuman & Tabel Ruang Sampel" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-violet-900/50">
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Percobaan</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200">n(S)</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Cara Menghitung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1 koin", "2", "Langsung daftar: {A, G}"],
                        ["1 dadu", "6", "Langsung daftar: {1,2,3,4,5,6}"],
                        ["1 kartu bridge", "52", "Langsung: 4 suit × 13 kartu"],
                        ["2 koin", "4", "2 × 2 (tabel 2×2)"],
                        ["3 koin", "8", "2 × 2 × 2 (diagram pohon)"],
                        ["2 dadu", "36", "6 × 6 (tabel 6×6)"],
                        ["1 koin + 1 dadu", "12", "2 × 6 (tabel 2×6)"],
                      ].map(([perc, ns, cara], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-white">{perc}</td>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{ns}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{cara}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">🧠 Rumus Kunci</p>
                  <BlockMath math="n(S_{\text{majemuk}}) = n(S_1) \times n(S_2) \times \cdots \times n(S_k)" />
                  <p className="font-body text-xs text-white/70 text-center">
                    Berlaku untuk kejadian majemuk yang saling bebas
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-1">
                  <p className="font-body text-sm font-bold text-yellow-300">✅ Checklist Mengerjakan Soal Ruang Sampel</p>
                  {[
                    "Identifikasi alat/benda yang digunakan dalam percobaan",
                    "Tentukan n(S) masing-masing alat (koin=2, dadu=6, kartu=52)",
                    "Untuk majemuk: kalikan n(S) tiap alat",
                    "Buat tabel atau diagram pohon untuk melihat semua kemungkinan",
                    "Tentukan kejadian K dan daftar anggotanya dari ruang sampel",
                    "Hitung n(K) = banyaknya anggota kejadian K",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400 shrink-0">▸</span>
                      <p className="font-body text-xs text-white/80">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuangSampelPage;
