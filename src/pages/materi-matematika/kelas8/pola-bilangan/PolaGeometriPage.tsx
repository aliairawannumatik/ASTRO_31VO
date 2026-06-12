import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Zap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PolaGeometriPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus", "contoh1a", "contoh2a", "contoh3a",
    "jumlah", "contoh1b", "contoh2b", "contoh3b",
    "aplikasi", "contoh1c", "rangkuman",
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
          POLA GEOMETRI
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Barisan dengan Rasio Tetap — Pertumbuhan Dahsyat!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Pola Bilangan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══ BAGIAN 1: SUKU KE-N ══ */}
          <div className="bg-violet-500/10 border border-violet-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-violet-300 text-center">📐 BAGIAN 1 — SUKU KE-N POLA GEOMETRI</p>
          </div>

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Pola Geometri?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan sehelai kertas dilipat dua, lalu dilipat dua lagi, lagi, dan lagi. Ketebalan kertas berlipat ganda setiap kali dilipat — itu pola geometri! <strong className="text-violet-300">Pola geometri</strong> adalah barisan bilangan dengan <strong className="text-violet-300">rasio (perbandingan) tetap</strong> antara suku-suku berurutan. Berbeda dengan aritmetika (menambah), geometri <em>mengalikan!</em>
                </p>

                {/* BAKTERI */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl overflow-hidden">
                  <img
                    src="/bakteri-pola-geometri.png"
                    alt="Ilustrasi bakteri membelah diri"
                    className="w-full object-cover max-h-52"
                  />
                  <div className="p-3 text-center">
                    <p className="font-body text-xs text-white/40 italic">
                      Sumber gambar:{" "}
                      <a
                        href="https://www.halodoc.com/artikel/ini-yang-perlu-diketahui-tentang-bakteri"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 underline hover:text-cyan-300 transition-colors"
                      >
                        halodoc.com — Ini yang Perlu Diketahui tentang Bakteri
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-1">🦠 Fenomena Nyata: Pembelahan Bakteri</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pernahkah kamu membayangkan betapa cepatnya bakteri berkembang biak? Satu bakteri dapat <strong className="text-cyan-300">membelah diri menjadi 2</strong> setiap beberapa menit sekali secara konsisten. Artinya, dari 1 bakteri → menjadi 2 → lalu 4 → kemudian 8 → 16 → dan seterusnya.
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pola ini membentuk barisan: <strong className="text-violet-300">1, 2, 4, 8, 16, 32, …</strong> — setiap suku diperoleh dengan <strong className="text-violet-300">mengalikan 2</strong> dari suku sebelumnya. Inilah contoh sempurna <strong className="text-violet-300">pola geometri</strong> dengan rasio <em>r</em> = 2.
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Dengan rumus barisan geometri, kita bisa <strong className="text-yellow-300">memperkirakan</strong> jumlah bakteri kapan saja tanpa harus menghitung satu per satu. Misalnya, setelah 10 kali pembelahan, jumlah bakteri sudah mencapai <strong className="text-yellow-300">2¹⁰ = 1.024 bakteri</strong>! Setelah 20 kali pembelahan? Lebih dari satu juta!
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase mb-3">🔑 Komponen Utama Barisan Geometri</p>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body">
                    {[
                      { simbol: "a atau U₁", nama: "Suku pertama", desc: "Bilangan awal dalam barisan", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
                      { simbol: "r", nama: "Rasio (ratio)", desc: "Perbandingan tetap: r = Uₙ / Uₙ₋₁", color: "bg-pink-900/50 border-pink-500/40 text-pink-200" },
                      { simbol: "n", nama: "Nomor suku", desc: "Urutan suku dalam barisan", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
                      { simbol: "Uₙ", nama: "Suku ke-n", desc: "Nilai suku pada posisi ke-n", color: "bg-green-900/50 border-green-500/40 text-green-200" },
                    ].map(({ simbol, nama, desc, color }) => (
                      <div key={simbol} className={`border ${color} rounded-lg px-3 py-2 flex justify-between items-center`}>
                        <div>
                          <p className="font-bold font-mono">{simbol}</p>
                          <p className="text-white/60">{nama}</p>
                        </div>
                        <p className="text-white/50 text-right max-w-[50%]">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perbandingan Aritmetika vs Geometri */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-slate-700/60">
                        <th className="border border-white/10 px-3 py-2 text-white/60 text-left">Aspek</th>
                        <th className="border border-white/10 px-3 py-2 text-cyan-300 text-left">Aritmetika</th>
                        <th className="border border-white/10 px-3 py-2 text-violet-300 text-left">Geometri</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Aturan", "Tambah beda (b) tetap", "Kali rasio (r) tetap"],
                        ["Contoh", "2, 5, 8, 11, 14 (+3)", "2, 6, 18, 54, 162 (×3)"],
                        ["Pertumbuhan", "Linear (garis lurus)", "Eksponensial (melesat cepat)"],
                        ["Kelebihan", "Mudah diprediksi", "Menggambarkan pertumbuhan alami"],
                      ].map(([aspek, arit, geo], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-white/60 font-semibold">{aspek}</td>
                          <td className="border border-white/10 px-3 py-2 text-cyan-200">{arit}</td>
                          <td className="border border-white/10 px-3 py-2 text-violet-200">{geo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Zap className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Rumus Suku Ke-n Geometri" />
            {expandedSections.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Pola geometri memiliki <strong className="text-violet-300">rasio (r) yang tetap</strong>. Rumus suku ke-n memungkinkan kita langsung menemukan suku manapun — bahkan suku ke-100 — tanpa perlu mengalikan berulang-ulang.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-violet-500/30 rounded-xl p-4 text-center">
                  <p className="font-body text-xs text-white/60 mb-2">Rumus Suku ke-n Barisan Geometri:</p>
                  <BlockMath math="\boxed{U_n = a \cdot r^{n-1}}" />
                  <div className="flex justify-center gap-4 mt-2 text-xs font-body flex-wrap">
                    <span className="text-violet-300"><InlineMath math="a" /> = suku pertama</span>
                    <span className="text-pink-300"><InlineMath math="r" /> = rasio</span>
                    <span className="text-cyan-300"><InlineMath math="n" /> = nomor suku</span>
                  </div>
                </div>

                {/* Penurunan rumus */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-1 text-sm font-body">
                  <p className="text-white/70 font-semibold mb-2">💡 Mengapa pangkatnya (n-1)?</p>
                  <div className="space-y-1 text-xs text-white/70">
                    <p><InlineMath math="U_1 = a" /> (dikali r sebanyak 0 kali)</p>
                    <p><InlineMath math="U_2 = a \cdot r" /> (dikali r sebanyak 1 kali)</p>
                    <p><InlineMath math="U_3 = a \cdot r^2" /> (dikali r sebanyak 2 kali)</p>
                    <p><InlineMath math="U_4 = a \cdot r^3" /> (dikali r sebanyak 3 kali)</p>
                    <p className="text-violet-300 font-semibold mt-2"><InlineMath math="U_n = a \cdot r^{n-1}" /> ← suku ke-n dikali r sebanyak (n-1) kali</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>Penting!</strong> Jika <InlineMath math="r > 1" /> barisan naik (pertumbuhan). Jika <InlineMath math="0 < r < 1" /> barisan turun (peluruhan). Jika <InlineMath math="r < 0" /> barisan berganti tanda (positif-negatif bergantian).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1a" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Suku ke-n)" />
            {expandedSections.includes("contoh1a") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Barisan geometri: 3, 6, 12, 24, ...<br />Tentukan suku ke-8!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">Identifikasi: <InlineMath math="a = 3" />, <InlineMath math="r = \frac{6}{3} = 2" />, <InlineMath math="n = 8" /></p>
                      <BlockMath math="U_8 = 3 \cdot 2^{8-1} = 3 \cdot 2^7 = 3 \cdot 128 = 384" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Suku ke-8 = <strong>384</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2a" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Suku ke-n)" />
            {expandedSections.includes("contoh2a") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Suku ke-3 barisan geometri adalah 12 dan suku ke-6 adalah 96. Tentukan suku pertama, rasio, dan suku ke-10!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Bagi dua persamaan untuk mendapat r:</p>
                      <BlockMath math="\frac{U_6}{U_3} = \frac{a \cdot r^5}{a \cdot r^2} = r^3 = \frac{96}{12} = 8" />
                      <BlockMath math="r^3 = 8 \Rightarrow r = 2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Cari a:</p>
                      <BlockMath math="U_3 = a \cdot r^2 \Rightarrow 12 = a \cdot 4 \Rightarrow a = 3" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Langkah 3 — Suku ke-10:</p>
                      <BlockMath math="U_{10} = 3 \cdot 2^9 = 3 \times 512 = 1.536" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="a = 3" />, <InlineMath math="r = 2" />, <InlineMath math="U_{10} = 1.536" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3a" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Suku ke-n)" />
            {expandedSections.includes("contoh3a") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Tiga bilangan membentuk barisan geometri. Jumlah ketiganya adalah 14 dan hasil kali ketiganya adalah 64. Tentukan ketiga bilangan tersebut!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Misalkan tiga suku geometri:</p>
                      <p className="text-white/70">Trick: tulis sebagai <InlineMath math="\frac{a}{r},\ a,\ ar" /> agar perkaliannya elegan.</p>
                      <BlockMath math="\frac{a}{r} \cdot a \cdot ar = a^3 = 64 \Rightarrow a = 4" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Gunakan penjumlahan:</p>
                      <BlockMath math="\frac{a}{r} + a + ar = 14" />
                      <BlockMath math="\frac{4}{r} + 4 + 4r = 14" />
                      <BlockMath math="\frac{4}{r} + 4r = 10" />
                      <p className="text-white/60 text-xs">Kalikan dengan r:</p>
                      <BlockMath math="4 + 4r^2 = 10r \Rightarrow 4r^2 - 10r + 4 = 0 \Rightarrow 2r^2 - 5r + 2 = 0" />
                      <BlockMath math="(2r - 1)(r - 2) = 0 \Rightarrow r = \frac{1}{2} \text{ atau } r = 2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Langkah 3 — Ketiga bilangan:</p>
                      <p className="text-white/70 text-xs">Jika <InlineMath math="r = 2" />: <InlineMath math="\frac{4}{2},\ 4,\ 4 \times 2 = 2,\ 4,\ 8" /></p>
                      <p className="text-white/70 text-xs">Jika <InlineMath math="r = \frac{1}{2}" />: <InlineMath math="8,\ 4,\ 2" /> (urutan terbalik)</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Ketiga bilangan: <strong>2, 4, 8</strong> (atau 8, 4, 2)</p>
                      <p className="text-white/60 text-xs mt-1">Cek: 2+4+8 = 14 ✓, 2×4×8 = 64 ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ BAGIAN 2: JUMLAH KE-N ══ */}
          <div className="bg-green-500/10 border border-green-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-green-300 text-center">∑ BAGIAN 2 — JUMLAH HINGGA SUKU KE-N POLA GEOMETRI</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jumlah" icon={<Zap className="w-5 h-5" />} iconColor="text-green-400" title="📘 Rumus Jumlah Suku Geometri" />
            {expandedSections.includes("jumlah") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Jumlah <InlineMath math="n" /> suku pertama barisan geometri (<InlineMath math="S_n" />) dihitung dengan rumus yang berbeda tergantung nilai rasio <InlineMath math="r" />. Hati-hati: jika <InlineMath math="r = 1" /> maka semua suku sama, sehingga <InlineMath math="S_n = n \cdot a" />.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-4 space-y-3 text-center">
                  <p className="font-body text-xs text-white/60">Rumus Jumlah n Suku Pertama Geometri:</p>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">Jika <InlineMath math="r \neq 1" />:</p>
                    <BlockMath math="\boxed{S_n = \frac{a(r^n - 1)}{r - 1} \quad \text{atau} \quad S_n = \frac{a(1 - r^n)}{1 - r}}" />
                  </div>
                  <p className="text-white/50 text-xs">Gunakan bentuk pertama jika <InlineMath math="r > 1" />, bentuk kedua jika <InlineMath math="r < 1" /> (agar penyebut positif)</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1b" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Jumlah Suku)" />
            {expandedSections.includes("contoh1b") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Barisan geometri: 2, 6, 18, 54, ...<br />Hitung jumlah 7 suku pertama!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70"><InlineMath math="a = 2" />, <InlineMath math="r = 3" />, <InlineMath math="n = 7" /></p>
                      <BlockMath math="S_7 = \frac{2(3^7 - 1)}{3 - 1} = \frac{2(2187 - 1)}{2} = 2186" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="S_7 = 2186" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2b" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Jumlah Suku)" />
            {expandedSections.includes("contoh2b") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Jumlah 4 suku pertama barisan geometri adalah 15 dan rasionya 2. Tentukan suku pertama dan suku ke-6!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">Diketahui: <InlineMath math="S_4 = 15" />, <InlineMath math="r = 2" />, <InlineMath math="n = 4" /></p>
                      <BlockMath math="15 = \frac{a(2^4 - 1)}{2 - 1} = a \times 15 \Rightarrow a = 1" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Suku ke-6:</p>
                      <BlockMath math="U_6 = 1 \cdot 2^5 = 32" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="a = 1" />, <InlineMath math="U_6 = 32" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3b" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Jumlah Suku)" />
            {expandedSections.includes("contoh3b") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Diketahui <InlineMath math="S_n = 3(2^n) - 3" />. Tentukan <InlineMath math="U_1" />, <InlineMath math="U_2" />, <InlineMath math="U_3" />, dan buktikan bahwa itu barisan geometri. Berapa rasionya?</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Gunakan hubungan <InlineMath math="U_n = S_n - S_{n-1}" />:</p>
                      <BlockMath math="S_1 = 3(2^1) - 3 = 6 - 3 = 3 \Rightarrow U_1 = 3" />
                      <BlockMath math="S_2 = 3(2^2) - 3 = 12 - 3 = 9" />
                      <BlockMath math="U_2 = S_2 - S_1 = 9 - 3 = 6" />
                      <BlockMath math="S_3 = 3(2^3) - 3 = 24 - 3 = 21" />
                      <BlockMath math="U_3 = S_3 - S_2 = 21 - 9 = 12" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Cek rasio:</p>
                      <BlockMath math="\frac{U_2}{U_1} = \frac{6}{3} = 2 \quad \text{dan} \quad \frac{U_3}{U_2} = \frac{12}{6} = 2" />
                      <p className="text-white/70 text-xs mt-1">Rasio tetap = 2 → terbukti barisan geometri!</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="U_1 = 3,\ U_2 = 6,\ U_3 = 12" />. Barisan geometri dengan <InlineMath math="r = 2" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ BAGIAN 3: APLIKASI ══ */}
          <div className="bg-orange-500/10 border border-orange-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-orange-300 text-center">🌍 BAGIAN 3 — APLIKASI POLA GEOMETRI KONTEKSTUAL</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="aplikasi" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-orange-400" title="🌍 Pola Geometri dalam Kehidupan Nyata" />
            {expandedSections.includes("aplikasi") && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80">Geometri adalah pola pertumbuhan alam — ia ada di mana-mana!</p>
                <div className="grid grid-cols-1 gap-2 text-xs font-body">
                  {[
                    { icon: "🦠", contoh: "Pertumbuhan bakteri: 1 sel membelah jadi 2, lalu 4, 8, 16... setiap jam" },
                    { icon: "💹", contoh: "Bunga majemuk: uang Rp1.000.000 dengan bunga 10%/tahun → 1.000.000 × 1,1ⁿ" },
                    { icon: "☢️", contoh: "Peluruhan radioaktif: massa bahan berkurang separuh setiap periode waktu tertentu" },
                    { icon: "🖨️", contoh: "Kertas dilipat 42 kali ketebalannya akan melewati jarak Bumi-Bulan!" },
                  ].map(({ icon, contoh }) => (
                    <div key={icon} className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-2 flex gap-2">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/70">{contoh}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1C */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1c" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="✏️ Soal Aplikasi — Pertumbuhan Bakteri" />
            {expandedSections.includes("contoh1c") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="KONTEKSTUAL" color="bg-orange-700/60 text-orange-200" />
                <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Sebuah koloni bakteri berjumlah 500 sel pada pukul 08.00. Setiap jam, jumlahnya berlipat tiga.<br />
                    a) Berapa jumlah bakteri pada pukul 14.00 (6 jam kemudian)?<br />
                    b) Berapa total bakteri yang telah ada sejak pukul 08.00 hingga 14.00 (termasuk jam 08.00)?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">Barisan geometri: <InlineMath math="a = 500" />, <InlineMath math="r = 3" /></p>
                      <p className="text-white/60 text-xs mt-1">Pukul 08.00 = suku ke-1, pukul 14.00 = suku ke-7 (6 jam kemudian)</p>
                      <p className="text-cyan-300 font-semibold mt-2">a) Jumlah bakteri pukul 14.00:</p>
                      <BlockMath math="U_7 = 500 \times 3^{7-1} = 500 \times 3^6 = 500 \times 729 = 364.500 \text{ sel}" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Total bakteri 7 jam (suku 1 s.d. 7):</p>
                      <BlockMath math="S_7 = \frac{500(3^7 - 1)}{3 - 1} = \frac{500(2187 - 1)}{2} = \frac{500 \times 2186}{2} = 546.500 \text{ sel}" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Pukul 14.00: <strong>364.500 sel</strong>. Total: <strong>546.500 sel</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman Pola Geometri" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-slate-800/50 border border-violet-500/20 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Suku ke-n</p>
                      <BlockMath math="U_n = a \cdot r^{n-1}" />
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Jumlah n suku pertama (<InlineMath math="r \neq 1" />)</p>
                      <BlockMath math="S_n = \frac{a(r^n - 1)}{r - 1}" />
                    </div>
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Hubungan Uₙ dan Sₙ</p>
                      <BlockMath math="U_n = S_n - S_{n-1} \quad (n \geq 2)" />
                    </div>
                    <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-xs text-orange-300 font-bold mb-1">Cara Cari Rasio:</p>
                      <BlockMath math="r = \frac{U_2}{U_1} = \frac{U_3}{U_2} = \ldots = \frac{U_n}{U_{n-1}}" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>🚀 Tip Terakhir:</strong> Pola geometri tumbuh jauh lebih cepat dari aritmetika. Dengan <InlineMath math="r = 2" />, suku ke-30 sudah mencapai <InlineMath math="a \times 2^{29}" /> yang nilainya lebih dari 500 juta kali suku pertama! Inilah mengapa "kekuatan bunga berbunga" di dunia keuangan sangat dahsyat.
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

export default PolaGeometriPage;
