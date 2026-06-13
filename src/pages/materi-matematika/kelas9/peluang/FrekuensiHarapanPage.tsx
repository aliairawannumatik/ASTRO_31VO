import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const FrekuensiHarapanPage = () => {
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
          FREKUENSI HARAPAN
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Prediksi Berapa Kali Suatu Kejadian Akan Terjadi
        </p>
        <p className="text-white/50 text-xs text-center mb-4 font-body">
          Kelas 9 · Peluang · Materi Matematika
        </p>

        <div className="flex justify-center mb-6">
          <img src={"/images/Gemini_Generated_Image_vtcobhvtcobhvtco_1776224453788.png"} alt="Melempar dadu – ilustrasi frekuensi harapan" className="w-56 rounded-xl shadow-lg shadow-cyan-900/30 border border-cyan-500/20" />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Frekuensi Harapan?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  "Kalau dadu dilempar 120 kali, kira-kira berapa kali muncul angka 6?" Pertanyaan seperti ini dijawab oleh konsep <strong className="text-cyan-300">Frekuensi Harapan</strong>. Ini adalah prediksi matematis tentang <em>berapa kali sebuah kejadian diperkirakan muncul</em> dalam sejumlah percobaan. Jadi frekuensi harapan adalah jembatan antara peluang (yang nilainya 0–1) dengan kenyataan di dunia nyata (berapa kali terjadi).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      term: "Frekuensi Harapan (Fh)",
                      icon: "🎯",
                      desc: "Perkiraan berapa kali suatu kejadian akan terjadi jika percobaan dilakukan sebanyak n kali.",
                      color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
                    },
                    {
                      term: "Banyak Percobaan (n)",
                      icon: "🔢",
                      desc: "Total berapa kali percobaan akan dilakukan. Semakin besar n, perkiraan semakin dapat diandalkan.",
                      color: "bg-green-900/40 border-green-500/40 text-green-300",
                    },
                    {
                      term: "Peluang P(A)",
                      icon: "📊",
                      desc: "Peluang kejadian A yang sudah diketahui — bisa dari peluang empirik atau peluang teoretik.",
                      color: "bg-violet-900/40 border-violet-500/40 text-violet-300",
                    },
                    {
                      term: "Harapan ≠ Kepastian",
                      icon: "⚠️",
                      desc: "Frekuensi harapan adalah perkiraan, bukan kepastian. Hasil nyata bisa berbeda dari nilai yang dihitung.",
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
                    <strong>Kegunaan Nyata:</strong> Frekuensi harapan dipakai dalam berbagai bidang — mulai dari perkiraan penjualan produk, prediksi cuaca, hingga menghitung risiko dalam asuransi!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KONSEP & RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Rumus & Konsep Frekuensi Harapan" />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Frekuensi harapan dihitung dengan mengalikan peluang suatu kejadian dengan banyaknya percobaan yang akan dilakukan. Hasilnya adalah <em>perkiraan</em> berapa kali kejadian tersebut akan muncul.
                  </p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide">📐 Rumus Frekuensi Harapan</p>
                  <BlockMath math="F_h = P(A) \times n" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-orange-900/30 border border-orange-500/20 rounded-lg p-2 text-center">
                      <p className="text-orange-300 font-bold"><InlineMath math="F_h" /></p>
                      <p className="text-white/60 mt-1">Frekuensi harapan</p>
                    </div>
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold"><InlineMath math="P(A)" /></p>
                      <p className="text-white/60 mt-1">Peluang kejadian A</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="n" /></p>
                      <p className="text-white/60 mt-1">Banyak percobaan</p>
                    </div>
                  </div>
                </div>

                {/* Ilustrasi Visual */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🎲 Ilustrasi: Dadu Dilempar 60 Kali</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-orange-900/50">
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">Mata Dadu</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-center"><InlineMath math="P(A)" /></th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-center"><InlineMath math="n" /></th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-center"><InlineMath math="F_h" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5, 6].map((mata, i) => (
                          <tr key={mata} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white font-bold">Mata {mata}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">1/6</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">60</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-orange-300">10</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/40 border border-orange-500/20 rounded-lg p-3">
                    <BlockMath math="F_h = \frac{1}{6} \times 60 = 10 \text{ kali (untuk setiap mata dadu)}" />
                    <p className="font-body text-xs text-orange-200 text-center mt-1">Artinya, diharapkan setiap angka muncul sekitar 10 kali dari 60 lemparan.</p>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-yellow-500/20 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    💡 <strong>Perhatikan:</strong> Total frekuensi harapan untuk semua kejadian yang saling lepas harus sama dengan <InlineMath math="n" />. Pada contoh di atas: <InlineMath math="6 \times 10 = 60 = n" /> ✓
                  </p>
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
                      Sebuah koin dilempar sebanyak <InlineMath math="80" /> kali. Berapa kali diharapkan muncul sisi Angka?
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Langkah 1 — Tentukan peluang teoretik muncul Angka:</p>
                    <BlockMath math="P(\text{Angka}) = \frac{1}{2}" />
                    <p className="font-body text-sm text-white/80">Langkah 2 — Hitung frekuensi harapan:</p>
                    <BlockMath math="F_h = P(\text{Angka}) \times n = \frac{1}{2} \times 80 = 40 \text{ kali}" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Diharapkan sisi Angka muncul sebanyak <strong>40 kali</strong> dari 80 lemparan.</p>
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
                      Sebuah dadu dilempar sebanyak <InlineMath math="150" /> kali. Hitunglah frekuensi harapan untuk kejadian:<br />
                      a. Muncul bilangan prima<br />
                      b. Muncul bilangan kurang dari 4
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="n = 150" />, <InlineMath math="n(S) = 6" /></p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Bilangan prima = {"{2, 3, 5}"} → <InlineMath math="n(A) = 3" /></p>
                      <BlockMath math="P(\text{prima}) = \frac{3}{6} = \frac{1}{2}" />
                      <BlockMath math="F_h = \frac{1}{2} \times 150 = 75 \text{ kali}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Bilangan kurang dari 4 = {"{1, 2, 3}"} → <InlineMath math="n(B) = 3" /></p>
                      <BlockMath math="P(\text{kurang dari 4}) = \frac{3}{6} = \frac{1}{2}" />
                      <BlockMath math="F_h = \frac{1}{2} \times 150 = 75 \text{ kali}" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Kedua kejadian memiliki peluang yang sama (½), maka frekuensi harapannya juga sama!</p>
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
                      Dalam sebuah kotak terdapat 5 bola merah, 3 bola biru, dan 2 bola kuning. Sebuah bola diambil secara acak, lalu dikembalikan. Percobaan dilakukan sebanyak <InlineMath math="300" /> kali. Hitunglah frekuensi harapan terambilnya:<br />
                      a. Bola merah<br />
                      b. Bola biru<br />
                      c. Bola yang bukan bola kuning
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• Total bola: <InlineMath math="n(S) = 5 + 3 + 2 = 10" /></p>
                      <p>• Bola merah: 5, Bola biru: 3, Bola kuning: 2</p>
                      <p>• Banyak percobaan: <InlineMath math="n = 300" /></p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Bola merah:</p>
                      <BlockMath math="P(\text{merah}) = \frac{5}{10} = \frac{1}{2}" />
                      <BlockMath math="F_h(\text{merah}) = \frac{1}{2} \times 300 = 150 \text{ kali}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Bola biru:</p>
                      <BlockMath math="P(\text{biru}) = \frac{3}{10}" />
                      <BlockMath math="F_h(\text{biru}) = \frac{3}{10} \times 300 = 90 \text{ kali}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">c. Bola bukan kuning = merah + biru = 5 + 3 = 8 bola:</p>
                      <BlockMath math="P(\text{bukan kuning}) = \frac{8}{10} = \frac{4}{5}" />
                      <BlockMath math="F_h(\text{bukan kuning}) = \frac{4}{5} \times 300 = 240 \text{ kali}" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">⚠️ Perhatikan: "bukan kuning" berarti merah atau biru. Selalu identifikasi dengan jelas anggota kejadian yang diminta sebelum menghitung!</p>
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
                    { poin: "Frekuensi harapan adalah perkiraan berapa kali suatu kejadian akan terjadi dalam n percobaan.", icon: "🎯" },
                    { poin: "Rumus: Fh = P(A) × n, dengan P(A) adalah peluang kejadian dan n adalah total percobaan.", icon: "📐" },
                    { poin: "Frekuensi harapan adalah prediksi, bukan jaminan — hasil nyata bisa berbeda.", icon: "⚠️" },
                    { poin: "Semakin besar n, hasil nyata cenderung mendekati frekuensi harapan yang dihitung.", icon: "📈" },
                    { poin: "Total frekuensi harapan semua kejadian dalam satu percobaan selalu = n.", icon: "✅" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="F_h = P(A) \times n" />
                </div>
              </div>
            )}
          </div>

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

export default FrekuensiHarapanPage;
