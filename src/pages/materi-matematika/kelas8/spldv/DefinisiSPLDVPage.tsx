import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DefinisiSPLDVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "pldv", "spldv", "contoh1", "rangkuman",
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
          DEFINISI & BENTUK UMUM SPLDV
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Kaitannya dengan PLDV & Konsep Dasar Sistem Persamaan
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Mengapa Kita Butuh SPLDV?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu pergi ke kantin dan membeli 2 nasi goreng dan 1 mie goreng seharga Rp25.000. Temanmu membeli 1 nasi goreng dan 2 mie goreng seharga Rp23.000. Dari dua informasi ini, bisa tidak kita tahu harga masing-masing makanan? Nah, inilah kegunaan <strong className="text-cyan-300">SPLDV</strong> — alat matematika untuk memecahkan masalah yang punya <em>dua ketidaktahuan</em> sekaligus!
                </p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 text-sm font-body space-y-2">
                  <p className="text-cyan-300 font-semibold">🛸 Peta Konsep</p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
                    <div className="bg-yellow-800/40 border border-yellow-500/40 rounded-lg px-3 py-2 text-yellow-200 text-xs font-bold">
                      PLDV<br /><span className="font-normal text-white/60">1 persamaan, 2 variabel</span>
                    </div>
                    <span className="text-white/40 text-lg">+</span>
                    <div className="bg-yellow-800/40 border border-yellow-500/40 rounded-lg px-3 py-2 text-yellow-200 text-xs font-bold">
                      PLDV<br /><span className="font-normal text-white/60">1 persamaan, 2 variabel</span>
                    </div>
                    <span className="text-white/40 text-lg">→</span>
                    <div className="bg-cyan-800/50 border border-cyan-400/50 rounded-lg px-3 py-2 text-cyan-200 text-xs font-bold">
                      SPLDV<br /><span className="font-normal text-white/60">sistem 2 persamaan</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> SPLDV = <em>Sistem Persamaan Linear Dua Variabel</em>. Kata "linear" berarti pangkat tertinggi variabelnya adalah 1. Kata "dua variabel" berarti ada dua besaran yang tidak diketahui (biasanya <InlineMath math="x" /> dan <InlineMath math="y" />).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: PLDV ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pldv" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: PLDV — Satu Persamaan, Dua Variabel" />
            {expandedSections.includes("pldv") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">PLDV</strong> (Persamaan Linear Dua Variabel) adalah persamaan yang memiliki tepat dua variabel dan pangkat tertinggi setiap variabelnya adalah 1. Bentuk umumnya adalah <InlineMath math="ax + by = c" /> dengan <InlineMath math="a, b \neq 0" />. Satu persamaan linear dua variabel memiliki tak hingga banyak solusi karena kita bisa memasangkan nilai <InlineMath math="x" /> apa saja dengan <InlineMath math="y" /> yang sesuai.
                  </p>
                </div>

                {/* Bentuk Umum PLDV */}
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">📐 Bentuk Umum PLDV</p>
                  <BlockMath math="ax + by = c" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="a" /> dan <InlineMath math="b" /></p>
                      <p className="text-white/60 mt-1">Koefisien variabel (bukan nol)</p>
                    </div>
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold"><InlineMath math="x" /> dan <InlineMath math="y" /></p>
                      <p className="text-white/60 mt-1">Dua variabel yang dicari</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2 text-center">
                      <p className="text-violet-300 font-bold"><InlineMath math="c" /></p>
                      <p className="text-white/60 mt-1">Konstanta (bilangan tetap)</p>
                    </div>
                  </div>
                </div>

                {/* Contoh PLDV dan bukan PLDV */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">✅ Contoh PLDV vs ❌ Bukan PLDV</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-green-900/50">
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">Persamaan</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-center">PLDV?</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">Alasan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["2x + 3y = 6", "✅ Ya", "2 variabel, pangkat 1"],
                          ["x − 5y = 10", "✅ Ya", "2 variabel, pangkat 1"],
                          ["x² + y = 4", "❌ Bukan", "Ada pangkat 2 pada x"],
                          ["3x = 9", "❌ Bukan", "Hanya 1 variabel"],
                          ["xy + 2 = 0", "❌ Bukan", "Ada perkalian x dan y"],
                          ["4x + 0y = 8", "❌ Bukan", "Koefisien y = 0 (jadi 1 variabel)"],
                        ].map(([persamaan, pldv, alasan], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white font-mono">{persamaan}</td>
                            <td className={`border border-white/10 px-3 py-2 text-center font-bold ${pldv.includes("✅") ? "text-green-400" : "text-red-400"}`}>{pldv}</td>
                            <td className="border border-white/10 px-3 py-2 text-white/60">{alasan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Solusi PLDV — tak hingga */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">🌐 Solusi PLDV: Tak Hingga Banyaknya</p>
                  <p className="font-body text-xs text-white/70">Contoh: <InlineMath math="x + 2y = 6" /> memiliki banyak pasangan solusi:</p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse mx-auto">
                      <thead>
                        <tr className="bg-cyan-900/40">
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200"><InlineMath math="x" /></th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">0</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">2</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">4</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">6</th>
                          <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">...</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-white/10 px-4 py-2 text-cyan-200 font-bold"><InlineMath math="y" /></td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">3</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">2</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">1</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white">0</td>
                          <td className="border border-white/10 px-4 py-2 text-center text-white/40">∞</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-center text-white/50">Inilah kenapa kita butuh <strong className="text-cyan-300">dua</strong> persamaan untuk mendapat solusi tunggal!</p>
                </div>

              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: SPLDV ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="spldv" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title="📗 Sub-Bab 2: SPLDV — Sistem Dua Persamaan" />
            {expandedSections.includes("spldv") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">SPLDV</strong> adalah kumpulan (sistem) dua buah PLDV yang harus dipenuhi secara <em>bersamaan</em> oleh sepasang nilai variabel <InlineMath math="(x, y)" />. Solusi SPLDV adalah nilai <InlineMath math="x" /> dan <InlineMath math="y" /> yang membuat <strong>kedua</strong> persamaan bernilai benar sekaligus.
                  </p>
                </div>

                {/* Bentuk Umum SPLDV */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">📐 Bentuk Umum SPLDV</p>
                  <BlockMath math="\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2">
                      <p className="text-cyan-300 font-bold">Persamaan 1: <InlineMath math="a_1x + b_1y = c_1" /></p>
                      <p className="text-white/60 mt-1">PLDV pertama dengan koefisiennya sendiri</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2">
                      <p className="text-violet-300 font-bold">Persamaan 2: <InlineMath math="a_2x + b_2y = c_2" /></p>
                      <p className="text-white/60 mt-1">PLDV kedua yang berbeda dari pertama</p>
                    </div>
                  </div>
                </div>

                {/* Jenis Solusi SPLDV */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">🔢 Tiga Kemungkinan Solusi SPLDV</p>
                  <div className="space-y-2">
                    {[
                      {
                        jenis: "Tepat satu solusi",
                        icon: "🎯",
                        desc: "Dua garis berpotongan di satu titik — SPLDV memiliki penyelesaian tunggal (x, y).",
                        color: "bg-green-900/30 border-green-500/30 text-green-300",
                        syarat: "Gradien kedua garis berbeda",
                      },
                      {
                        jenis: "Tak hingga solusi",
                        icon: "♾️",
                        desc: "Dua garis saling berimpit (persamaan sebenarnya sama) — setiap titik di garis adalah solusi.",
                        color: "bg-yellow-900/30 border-yellow-500/30 text-yellow-300",
                        syarat: "Kedua persamaan setara",
                      },
                      {
                        jenis: "Tidak ada solusi",
                        icon: "🚫",
                        desc: "Dua garis sejajar (tidak pernah berpotongan) — tidak ada pasangan (x, y) yang memenuhi keduanya.",
                        color: "bg-red-900/30 border-red-500/30 text-red-300",
                        syarat: "Gradien sama, tetapi konstanta berbeda",
                      },
                    ].map(({ jenis, icon, desc, color, syarat }) => (
                      <div key={jenis} className={`border ${color} rounded-xl p-3`}>
                        <p className="font-display text-sm font-bold mb-1">{icon} {jenis}</p>
                        <p className="font-body text-xs text-white/70 mb-1">{desc}</p>
                        <p className="font-body text-xs text-white/40">Syarat: {syarat}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verifikasi solusi */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">🔍 Cara Memverifikasi Solusi</p>
                  <p className="font-body text-xs text-white/70">Misalkan solusi SPLDV adalah <InlineMath math="x = 3, y = 1" />. Untuk membuktikannya, substitusikan ke <strong>kedua</strong> persamaan:</p>
                  <div className="space-y-1 text-sm font-body">
                    <BlockMath math="\text{Persamaan 1: } 2(3) + 3(1) = 6 + 3 = 9 \checkmark" />
                    <BlockMath math="\text{Persamaan 2: } (3) - (1) = 2 \checkmark" />
                  </div>
                  <p className="font-body text-xs text-center text-cyan-300">Jika keduanya benar, maka <InlineMath math="(3, 1)" /> adalah solusi SPLDV yang valid!</p>
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
                      Manakah dari persamaan berikut yang merupakan PLDV?<br />
                      a. <InlineMath math="3x + 2y = 12" /><br />
                      b. <InlineMath math="x^2 - y = 5" /><br />
                      c. <InlineMath math="5x - y = 0" /><br />
                      d. <InlineMath math="2x = 8" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <div className="space-y-2 font-body text-sm">
                      {[
                        { ex: "a. 3x + 2y = 12", verdict: "✅ PLDV", reason: "Ada 2 variabel (x dan y), masing-masing berpangkat 1, dan kedua koefisiennya bukan nol.", c: "text-green-400" },
                        { ex: "b. x² − y = 5", verdict: "❌ Bukan PLDV", reason: "Pangkat x adalah 2, bukan 1. Ini adalah persamaan kuadrat.", c: "text-red-400" },
                        { ex: "c. 5x − y = 0", verdict: "✅ PLDV", reason: "Ada 2 variabel (x dan y), keduanya berpangkat 1. Konstanta 0 tetap valid.", c: "text-green-400" },
                        { ex: "d. 2x = 8", verdict: "❌ Bukan PLDV", reason: "Hanya ada satu variabel (x). PLDV wajib memiliki tepat dua variabel.", c: "text-red-400" },
                      ].map(({ ex, verdict, reason, c }) => (
                        <div key={ex} className="bg-slate-800/40 border border-white/10 rounded-lg px-3 py-2">
                          <p className="font-mono text-white/80">{ex}</p>
                          <p className={`font-bold text-xs mt-1 ${c}`}>{verdict}</p>
                          <p className="text-xs text-white/50 mt-0.5">{reason}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 PLDV yang valid: <strong>a</strong> dan <strong>c</strong>.</p>
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
                      Diketahui SPLDV: <InlineMath math="2x + y = 7" /> dan <InlineMath math="x - y = 2" />. Periksa apakah pasangan berikut merupakan solusi SPLDV:<br />
                      a. <InlineMath math="(x, y) = (3, 1)" /><br />
                      b. <InlineMath math="(x, y) = (2, 3)" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Cek <InlineMath math="(3, 1)" /> — substitusi ke kedua persamaan:</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 space-y-1">
                        <BlockMath math="\text{P1: } 2(3) + 1 = 6 + 1 = 7 \checkmark" />
                        <BlockMath math="\text{P2: } 3 - 1 = 2 \checkmark" />
                      </div>
                      <p className="font-body text-xs text-green-300 mt-1">✅ Kedua persamaan terpenuhi → <InlineMath math="(3, 1)" /> adalah solusi SPLDV.</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Cek <InlineMath math="(2, 3)" /> — substitusi ke kedua persamaan:</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 space-y-1">
                        <BlockMath math="\text{P1: } 2(2) + 3 = 4 + 3 = 7 \checkmark" />
                        <BlockMath math="\text{P2: } 2 - 3 = -1 \neq 2 \times" />
                      </div>
                      <p className="font-body text-xs text-red-300 mt-1">❌ Persamaan 2 tidak terpenuhi → <InlineMath math="(2, 3)" /> bukan solusi SPLDV.</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Solusi SPLDV harus memenuhi SEMUA persamaan dalam sistem secara bersamaan!</p>
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
                      Ubahlah permasalahan berikut menjadi model SPLDV, kemudian identifikasi koefisien, variabel, dan konstantanya!<br /><br />
                      <em>"Sebuah toko menjual pensil dan pulpen. Harga 3 pensil dan 2 pulpen adalah Rp13.000. Harga 1 pensil dan 4 pulpen adalah Rp15.000."</em>
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Langkah 1 — Definisikan variabel:</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>Misalkan <InlineMath math="x" /> = harga satu pensil (rupiah)</p>
                      <p>Misalkan <InlineMath math="y" /> = harga satu pulpen (rupiah)</p>
                    </div>
                    <p className="font-body text-sm text-white/80">Langkah 2 — Buat model persamaan:</p>
                    <BlockMath math="\begin{cases} 3x + 2y = 13.000 \quad \cdots (1)\\ x + 4y = 15.000 \quad \cdots (2) \end{cases}" />
                    <p className="font-body text-sm text-white/80">Langkah 3 — Identifikasi komponen:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead>
                          <tr className="bg-red-900/40">
                            <th className="border border-red-500/30 px-3 py-2 text-red-200">Persamaan</th>
                            <th className="border border-red-500/30 px-3 py-2 text-red-200 text-center"><InlineMath math="a" /></th>
                            <th className="border border-red-500/30 px-3 py-2 text-red-200 text-center"><InlineMath math="b" /></th>
                            <th className="border border-red-500/30 px-3 py-2 text-red-200 text-center"><InlineMath math="c" /></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white/5">
                            <td className="border border-white/10 px-3 py-2 text-white font-mono">3x + 2y = 13.000</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">3</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">2</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-yellow-300">13.000</td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 px-3 py-2 text-white font-mono">x + 4y = 15.000</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">1</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">4</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-yellow-300">15.000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">⚠️ Membuat model SPLDV adalah langkah paling kritis dalam memecahkan soal cerita! Pastikan definisi variabel jelas dan setiap kalimat dalam soal terwakilkan oleh satu persamaan.</p>
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
                    { poin: "PLDV adalah persamaan linear dengan tepat dua variabel berpangkat 1: ax + by = c (a, b ≠ 0).", icon: "📐" },
                    { poin: "Satu PLDV memiliki tak hingga solusi karena hanya ada satu persamaan untuk dua ketidaktahuan.", icon: "♾️" },
                    { poin: "SPLDV adalah sistem dua PLDV yang harus dipenuhi secara bersamaan oleh (x, y).", icon: "🔗" },
                    { poin: "Solusi SPLDV bisa: satu pasangan (x, y), tak hingga, atau tidak ada sama sekali.", icon: "🔢" },
                    { poin: "Untuk memverifikasi solusi, substitusikan ke KEDUA persamaan — keduanya harus benar.", icon: "✅" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="\text{PLDV: } ax + by = c \quad \longrightarrow \quad \text{SPLDV: } \begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              ← Kembali ke Menu SPLDV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefinisiSPLDVPage;
