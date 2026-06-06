import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import heroImage from "@assets/image_1776224212212.png";
import LabPercobaanEmpirik from "@/components/LabPercobaanEmpirik";

const PeluangEmpirikPage = () => {
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
          PELUANG EMPIRIK & FREKUENSI RELATIF
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Peluang Berbasis Data Nyata dari Percobaan
        </p>
        <p className="text-white/50 text-xs text-center mb-4 font-body">
          Kelas 9 · Peluang · Materi Matematika
        </p>

        <div className="flex justify-center mb-6">
          <img src={heroImage} alt="Melempar koin – ilustrasi peluang empirik" className="w-40 rounded-xl shadow-lg shadow-cyan-900/30 border border-cyan-500/20" />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Peluang Empirik?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernah iseng melempar koin 100 kali dan mencatat hasilnya? Dari percobaan nyata itulah lahir konsep <strong className="text-cyan-300">Peluang Empirik</strong>. Berbeda dengan peluang yang dihitung dari teori, peluang empirik berangkat dari <em>data hasil percobaan sungguhan</em>. Semakin banyak percobaan yang dilakukan, semakin dekat nilai peluang empirik mendekati nilai sebenarnya!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      term: "Peluang Empirik",
                      icon: "🔬",
                      desc: "Peluang yang dihitung berdasarkan data hasil percobaan yang sudah dilakukan secara nyata.",
                      color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
                    },
                    {
                      term: "Frekuensi Relatif",
                      icon: "📊",
                      desc: "Perbandingan antara frekuensi munculnya suatu kejadian dengan banyaknya seluruh percobaan.",
                      color: "bg-green-900/40 border-green-500/40 text-green-300",
                    },
                    {
                      term: "Frekuensi (f)",
                      icon: "🔢",
                      desc: "Banyaknya suatu kejadian muncul dalam percobaan yang dilakukan berulang kali.",
                      color: "bg-violet-900/40 border-violet-500/40 text-violet-300",
                    },
                    {
                      term: "Banyak Percobaan (n)",
                      icon: "🧮",
                      desc: "Total berapa kali percobaan dilakukan. Semakin besar n, semakin akurat nilai peluang empiriknya.",
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
                    <strong>Tips:</strong> Peluang empirik disebut juga peluang <em>relatif</em> atau peluang <em>statistik</em> karena berasal dari data statistik percobaan, bukan dari perhitungan teori murni.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB KONSEP ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="📘 Rumus & Konsep Peluang Empirik" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Peluang empirik suatu kejadian <InlineMath math="A" /> adalah hasil bagi antara frekuensi kemunculan kejadian tersebut dengan total percobaan yang dilakukan. Nilai peluang selalu berada di antara 0 dan 1.
                  </p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">📐 Rumus Peluang Empirik</p>
                  <BlockMath math="P(A) = \frac{f_A}{n}" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold"><InlineMath math="P(A)" /></p>
                      <p className="text-white/60 mt-1">Peluang kejadian A</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="f_A" /></p>
                      <p className="text-white/60 mt-1">Frekuensi kejadian A muncul</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2 text-center">
                      <p className="text-violet-300 font-bold"><InlineMath math="n" /></p>
                      <p className="text-white/60 mt-1">Total banyak percobaan</p>
                    </div>
                  </div>
                </div>

                {/* Sifat Peluang */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">📌 Sifat-Sifat Peluang</p>
                  <div className="space-y-2 font-body text-sm">
                    {[
                      { sifat: "Nilai peluang selalu di antara 0 dan 1", rumus: "0 \\leq P(A) \\leq 1", color: "border-cyan-500/20" },
                      { sifat: "Kejadian mustahil (tidak mungkin terjadi)", rumus: "P(A) = 0", color: "border-red-500/20" },
                      { sifat: "Kejadian pasti (selalu terjadi)", rumus: "P(A) = 1", color: "border-green-500/20" },
                    ].map(({ sifat, rumus, color }) => (
                      <div key={sifat} className={`bg-slate-800/40 border ${color} rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2`}>
                        <p className="text-white/70 flex-1">{sifat}</p>
                        <div className="shrink-0">
                          <InlineMath math={rumus} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visualisasi Percobaan Koin */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🪙 Ilustrasi: Pelemparan Koin 40 Kali</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-cyan-900/50">
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Hasil</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-center">Frekuensi <InlineMath math="(f)" /></th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-center">Peluang Empirik <InlineMath math="P(A)" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["🪙 Angka (A)", "23", "23/40 = 0,575"],
                          ["🪙 Gambar (G)", "17", "17/40 = 0,425"],
                          ["Total", "40", "1,000"],
                        ].map(([h, f, p], i) => (
                          <tr key={i} className={i === 2 ? "bg-cyan-900/20 font-bold" : i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white">{h}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">{f}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">{p}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/40 border border-yellow-500/20 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 Secara teori, peluang muncul Angka = 0,5. Dari percobaan ini diperoleh 0,575 — <strong>semakin banyak percobaan, nilainya akan makin mendekati 0,5</strong>.
                    </p>
                  </div>
                </div>

                {/* ── LABORATORIUM INTERAKTIF ── */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">🧪 Coba Sendiri — Laboratorium Peluang Empirik</p>
                  <p className="font-body text-xs text-white/50 leading-relaxed">
                    Lempar koin atau dadu berkali-kali dan lihat bagaimana peluang empirik secara bertahap mendekati nilai teoritisnya. Inilah inti dari <strong className="text-cyan-300">Hukum Bilangan Besar</strong>!
                  </p>
                  <LabPercobaanEmpirik />
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="📝 Contoh Soal & Pembahasan" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Sebuah dadu dilempar sebanyak <InlineMath math="50" /> kali. Mata dadu 4 muncul sebanyak <InlineMath math="8" /> kali. Tentukan peluang empirik muncul mata dadu 4!
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Diketahui:</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• Total percobaan: <InlineMath math="n = 50" /></p>
                      <p>• Frekuensi muncul mata 4: <InlineMath math="f_4 = 8" /></p>
                    </div>
                    <p className="font-body text-sm text-white/80">Gunakan rumus peluang empirik:</p>
                    <BlockMath math="P(\text{mata 4}) = \frac{f_4}{n} = \frac{8}{50} = \frac{4}{25} = 0{,}16" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Peluang empirik muncul mata dadu 4 adalah <InlineMath math="\frac{4}{25}" /> atau <InlineMath math="0{,}16" />.</p>
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
                      Dari 200 kali pelemparan koin, diperoleh hasil Angka sebanyak 94 kali dan Gambar sebanyak 106 kali. Hitunglah:<br />
                      a. Peluang empirik muncul Angka<br />
                      b. Peluang empirik muncul Gambar<br />
                      c. Apakah jumlah keduanya sama dengan 1?
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="n = 200" />, <InlineMath math="f_A = 94" />, <InlineMath math="f_G = 106" /></p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Peluang empirik Angka:</p>
                      <BlockMath math="P(A) = \frac{94}{200} = \frac{47}{100} = 0{,}47" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Peluang empirik Gambar:</p>
                      <BlockMath math="P(G) = \frac{106}{200} = \frac{53}{100} = 0{,}53" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">c. Jumlah keduanya:</p>
                      <BlockMath math="P(A) + P(G) = 0{,}47 + 0{,}53 = 1 \checkmark" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Jumlah seluruh peluang kejadian yang mungkin dalam satu percobaan selalu sama dengan 1. Ini berlaku untuk peluang empirik maupun teoretik!</p>
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
                      Sebuah pabrik memproduksi 1.200 lampu. Setelah diuji kualitas, diperoleh data sebagai berikut: 36 lampu cacat, sisanya tidak cacat.<br />
                      a. Tentukan peluang empirik terambilnya lampu cacat jika diambil satu secara acak.<br />
                      b. Tentukan peluang empirik terambilnya lampu tidak cacat.<br />
                      c. Jika pabrik memproduksi 5.000 lampu lagi, berapa lampu yang diperkirakan cacat?
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• Total lampu: <InlineMath math="n = 1.200" /></p>
                      <p>• Lampu cacat: <InlineMath math="f_{\text{cacat}} = 36" /></p>
                      <p>• Lampu tidak cacat: <InlineMath math="f_{\text{baik}} = 1.200 - 36 = 1.164" /></p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Peluang empirik lampu cacat:</p>
                      <BlockMath math="P(\text{cacat}) = \frac{36}{1.200} = \frac{3}{100} = 0{,}03" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Peluang empirik lampu tidak cacat:</p>
                      <BlockMath math="P(\text{baik}) = \frac{1.164}{1.200} = \frac{97}{100} = 0{,}97" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">c. Perkiraan lampu cacat dari 5.000 lampu:</p>
                      <p className="font-body text-xs text-white/60 mb-1">Gunakan peluang empirik sebagai dasar estimasi:</p>
                      <BlockMath math="\text{Perkiraan cacat} = P(\text{cacat}) \times 5.000 = 0{,}03 \times 5.000 = 150 \text{ lampu}" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">⚠️ Peluang empirik bisa digunakan untuk memperkirakan (memprediksi) kejadian di masa depan — itulah kegunaannya dalam dunia nyata seperti industri, kesehatan, dan bisnis!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title="📋 Rangkuman" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {[
                    { poin: "Peluang empirik dihitung dari data percobaan nyata, bukan dari teori.", icon: "🔬" },
                    { poin: "Rumus: P(A) = f/n, dengan f = frekuensi kejadian dan n = total percobaan.", icon: "📐" },
                    { poin: "Nilai peluang selalu antara 0 dan 1: 0 ≤ P(A) ≤ 1.", icon: "📏" },
                    { poin: "Semakin banyak percobaan dilakukan, nilai peluang empirik makin mendekati nilai peluang teoretik.", icon: "📈" },
                    { poin: "Peluang empirik dapat digunakan untuk memprediksi kejadian di masa depan.", icon: "🔮" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="P(A) = \frac{f_A}{n} \quad \Rightarrow \quad 0 \leq P(A) \leq 1" />
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

export default PeluangEmpirikPage;
