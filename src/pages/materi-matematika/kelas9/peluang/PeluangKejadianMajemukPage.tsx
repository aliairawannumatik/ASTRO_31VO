import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, GitMerge, GitBranch, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";

const PeluangKejadianMajemukPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "saling-lepas", "tidak-saling-lepas", "saling-bebas", "bersyarat", "contoh", "rangkuman",
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

  const FormulaBox = ({ title, color, formulas }: { title: string; color: string; formulas: { label: string; math: string }[] }) => (
    <div className={`border ${color} rounded-xl p-4 space-y-3`}>
      <p className="font-body text-xs font-bold uppercase tracking-wide text-center" style={{ color: "inherit" }}>{title}</p>
      <div className="space-y-2">
        {formulas.map(({ label, math }) => (
          <div key={label} className="bg-black/20 rounded-lg p-3">
            {label && <p className="font-body text-xs text-white/60 mb-1">{label}</p>}
            <BlockMath math={math} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Layers className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
            PELUANG KEJADIAN MAJEMUK
          </h1>
          <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
            Menggabungkan Dua Kejadian atau Lebih dalam Satu Perhitungan
          </p>
          <p className="text-white/50 text-xs text-center mb-4 font-body">
            Kelas 9 · Peluang · Materi Matematika
          </p>

          {/* ── JENIS BADGE ── */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Saling Lepas", color: "bg-blue-700/50 text-blue-200 border border-blue-500/40" },
              { label: "Tidak Saling Lepas", color: "bg-purple-700/50 text-purple-200 border border-purple-500/40" },
              { label: "Saling Bebas", color: "bg-green-700/50 text-green-200 border border-green-500/40" },
              { label: "Bersyarat", color: "bg-orange-700/50 text-orange-200 border border-orange-500/40" },
            ].map(({ label, color }) => (
              <span key={label} className={`text-xs font-body font-semibold px-3 py-1 rounded-full ${color}`}>{label}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Kejadian Majemuk?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-cyan-300">Kejadian majemuk</strong> adalah gabungan dari dua kejadian atau lebih. Misalnya, saat melempar dadu, kita bisa menanyakan: "Berapa peluang muncul angka genap <em>atau</em> angka lebih dari 4?" — ini melibatkan dua kejadian sekaligus.
                </p>

                {/* Peta Konsep Visual */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide text-center mb-4">🗺️ Peta Konsep Kejadian Majemuk</p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-cyan-900/40 border border-cyan-500/50 rounded-lg px-6 py-2">
                      <p className="font-display font-bold text-cyan-200 text-sm text-center">Kejadian Majemuk</p>
                    </div>
                    <div className="flex gap-2 text-white/30 text-lg">↙ ↓ ↘</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                      {[
                        { label: "Operasi Gabungan (∪)", desc: "A atau B", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
                        { label: "Operasi Irisan (∩)", desc: "A dan B", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                        { label: "Kejadian Bersyarat", desc: "A | B (A jika B terjadi)", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
                      ].map(({ label, desc, color }) => (
                        <div key={label} className={`border ${color} rounded-lg p-3 text-center`}>
                          <p className="font-display font-bold text-xs">{label}</p>
                          <p className="font-body text-xs text-white/60 mt-1">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { term: "Kejadian A ∪ B", icon: "🔵", desc: "Gabungan: A terjadi, B terjadi, atau keduanya terjadi.", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
                    { term: "Kejadian A ∩ B", icon: "🟣", desc: "Irisan: A dan B keduanya terjadi secara bersamaan.", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                    { term: "Saling Lepas", icon: "↔️", desc: "A dan B tidak bisa terjadi bersamaan: A ∩ B = ∅.", color: "bg-sky-900/40 border-sky-500/40 text-sky-300" },
                    { term: "Saling Bebas", icon: "⚡", desc: "Terjadinya A tidak mempengaruhi peluang terjadinya B.", color: "bg-green-900/40 border-green-500/40 text-green-300" },
                  ].map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SALING LEPAS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="saling-lepas" icon={<GitBranch className="w-5 h-5" />} iconColor="text-blue-400" title="🔵 Kejadian Saling Lepas (Mutually Exclusive)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dua kejadian disebut <strong className="text-blue-300">saling lepas</strong> jika tidak mungkin keduanya terjadi pada saat yang sama. Artinya irisan keduanya kosong: <InlineMath math="A \cap B = \emptyset" />.
                </p>

                {/* Diagram Venn Saling Lepas */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide text-center mb-3">📊 Diagram Venn – Saling Lepas</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-24 h-24 rounded-full border-2 border-blue-400/70 bg-blue-900/40 flex items-center justify-center">
                      <span className="font-display font-bold text-blue-300 text-xl">A</span>
                    </div>
                    <div className="text-white/40 text-2xl font-bold">∅</div>
                    <div className="w-24 h-24 rounded-full border-2 border-purple-400/70 bg-purple-900/40 flex items-center justify-center">
                      <span className="font-display font-bold text-purple-300 text-xl">B</span>
                    </div>
                  </div>
                  <p className="font-body text-xs text-center text-white/50 mt-2">Lingkaran A dan B tidak berpotongan → saling lepas</p>
                </div>

                {/* Rumus */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide">📐 Rumus – Kejadian Saling Lepas</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">Karena A ∩ B = ∅, maka P(A ∩ B) = 0</p>
                    <BlockMath math="P(A \cup B) = P(A) + P(B)" />
                  </div>
                  <p className="font-body text-xs text-center text-white/50">Tidak perlu dikurangi irisan karena tidak ada anggota yang sama!</p>
                </div>

                {/* Contoh Saling Lepas */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">🎲 Contoh: Dadu Satu Kali</p>
                  <p className="font-body text-sm text-white/80">
                    A = muncul angka 2 = <InlineMath math="\{2\}" />, B = muncul angka 5 = <InlineMath math="\{5\}" />.
                    <br />A ∩ B = ∅ → saling lepas ✓
                  </p>
                  <BlockMath math="P(A \cup B) = \frac{1}{6} + \frac{1}{6} = \frac{2}{6} = \frac{1}{3}" />
                </div>
              </div>
            )}
          </div>

          {/* ── TIDAK SALING LEPAS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="tidak-saling-lepas" icon={<GitMerge className="w-5 h-5" />} iconColor="text-purple-400" title="🟣 Kejadian Tidak Saling Lepas (Non-Mutually Exclusive)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dua kejadian disebut <strong className="text-purple-300">tidak saling lepas</strong> jika bisa terjadi bersamaan. Ada anggota yang merupakan bagian dari kedua kejadian sekaligus: <InlineMath math="A \cap B \neq \emptyset" />.
                </p>

                {/* Diagram Venn Tidak Saling Lepas */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide text-center mb-3">📊 Diagram Venn – Tidak Saling Lepas</p>
                  <div className="flex items-center justify-center">
                    <div className="relative w-52 h-28 flex items-center justify-center">
                      <div className="absolute left-4 w-28 h-24 rounded-full border-2 border-blue-400/70 bg-blue-900/40 flex items-center">
                        <span className="font-display font-bold text-blue-300 text-lg ml-4">A</span>
                      </div>
                      <div className="absolute right-4 w-28 h-24 rounded-full border-2 border-purple-400/70 bg-purple-900/40 flex items-end justify-end">
                        <span className="font-display font-bold text-purple-300 text-lg mr-4 mb-2">B</span>
                      </div>
                      <div className="relative z-10 bg-indigo-600/60 rounded-full w-10 h-14 border border-indigo-400/60 flex items-center justify-center">
                        <span className="font-display font-bold text-white text-xs">A∩B</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-center text-white/50 mt-2">Lingkaran A dan B berpotongan → ada irisan</p>
                </div>

                {/* Rumus */}
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide">📐 Rumus Umum Peluang Gabungan (Aturan Penjumlahan)</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">Anggota irisan dihitung dua kali, jadi harus dikurangi sekali:</p>
                    <BlockMath math="P(A \cup B) = P(A) + P(B) - P(A \cap B)" />
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                    <p className="font-body text-xs text-yellow-300">💡 Rumus ini berlaku untuk SEMUA kasus! Jika saling lepas, P(A ∩ B) = 0, sehingga rumus menjadi P(A) + P(B).</p>
                  </div>
                </div>

                {/* Contoh Tidak Saling Lepas */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">🃏 Contoh: Kartu Bridge</p>
                  <p className="font-body text-sm text-white/80">
                    A = kartu merah (26 kartu), B = kartu As (4 kartu), A ∩ B = As merah (2 kartu).
                  </p>
                  <BlockMath math="P(A \cup B) = \frac{26}{52} + \frac{4}{52} - \frac{2}{52} = \frac{28}{52} = \frac{7}{13}" />
                </div>
              </div>
            )}
          </div>

          {/* ── SALING BEBAS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="saling-bebas" icon={<Layers className="w-5 h-5" />} iconColor="text-green-400" title="🟢 Kejadian Saling Bebas (Independent Events)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dua kejadian disebut <strong className="text-green-300">saling bebas</strong> jika terjadinya salah satu kejadian tidak mempengaruhi peluang kejadian lainnya. Contoh klasik: melempar dua koin secara terpisah.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3">
                    <p className="font-display text-sm font-bold text-green-300 mb-2">✅ Contoh Saling Bebas</p>
                    <ul className="font-body text-xs text-white/70 space-y-1">
                      <li>• Melempar koin dan melempar dadu</li>
                      <li>• Melempar dua dadu secara bersamaan</li>
                      <li>• Mengambil bola dengan pengembalian</li>
                    </ul>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3">
                    <p className="font-display text-sm font-bold text-red-300 mb-2">❌ Bukan Saling Bebas</p>
                    <ul className="font-body text-xs text-white/70 space-y-1">
                      <li>• Mengambil bola tanpa pengembalian</li>
                      <li>• Peristiwa yang saling mempengaruhi</li>
                      <li>• Kejadian bersyarat (A | B)</li>
                    </ul>
                  </div>
                </div>

                {/* Rumus Saling Bebas */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">📐 Rumus – Aturan Perkalian (Kejadian Saling Bebas)</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <BlockMath math="P(A \cap B) = P(A) \times P(B)" />
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">Untuk n kejadian saling bebas:</p>
                    <BlockMath math="P(A_1 \cap A_2 \cap \cdots \cap A_n) = P(A_1) \times P(A_2) \times \cdots \times P(A_n)" />
                  </div>
                </div>

                {/* Tabel Perbandingan */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-green-900/50">
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">Jenis</th>
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-center">Rumus P(A ∩ B)</th>
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-center">Ciri Khas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Saling Bebas", "P(A) × P(B)", "Kejadian tidak saling pengaruhi"],
                        ["Tidak Saling Bebas", "P(A) × P(B|A)", "Peluang B dipengaruhi A"],
                        ["Saling Lepas", "0", "Tidak bisa terjadi bersamaan"],
                      ].map(([jenis, rumus, ciri], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-200 font-semibold">{jenis}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-green-300">{rumus}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{ciri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── KEJADIAN BERSYARAT ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="bersyarat" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="🟠 Peluang Kejadian Bersyarat (Conditional Probability)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-orange-300">Peluang bersyarat</strong> adalah peluang terjadinya kejadian A dengan syarat bahwa kejadian B sudah terjadi. Ditulis <InlineMath math="P(A|B)" /> (dibaca: "peluang A diketahui B").
                </p>

                <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide mb-2">🔑 Analogi Sehari-hari</p>
                  <p className="font-body text-sm text-white/80">
                    "Berapa peluang seorang siswa mendapat nilai A, <em>jika diketahui</em> siswa tersebut rajin belajar?" — Ini adalah peluang bersyarat. Syarat "rajin belajar" mempersempit ruang sampel yang kita pertimbangkan.
                  </p>
                </div>

                {/* Rumus Bersyarat */}
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide">📐 Rumus – Peluang Bersyarat</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <BlockMath math="P(A|B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) \neq 0" />
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">Turunannya – Aturan Perkalian Umum:</p>
                    <BlockMath math="P(A \cap B) = P(B) \times P(A|B) = P(A) \times P(B|A)" />
                  </div>
                </div>

                {/* Contoh Bersyarat */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">🎴 Contoh: Kartu Bridge</p>
                  <p className="font-body text-sm text-white/80">
                    Dari setumpuk kartu bridge (52 kartu), sebuah kartu diambil tanpa dikembalikan. Tentukan peluang kartu kedua adalah As, jika kartu pertama adalah As.
                  </p>
                  <div className="bg-slate-900/60 border border-orange-500/20 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-white/60">Setelah 1 kartu As diambil, tersisa 51 kartu dan 3 kartu As:</p>
                    <BlockMath math="P(\text{As}_2 | \text{As}_1) = \frac{3}{51} = \frac{1}{17}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400" title="📝 Contoh Soal & Pembahasan" />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 1 – Kejadian Saling Lepas</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Sebuah dadu dilempar sekali. Tentukan peluang muncul angka 2 <strong>atau</strong> angka 5!
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• A = muncul angka 2 = <InlineMath math="\{2\}" />, sehingga <InlineMath math="P(A) = \frac{1}{6}" /></p>
                      <p>• B = muncul angka 5 = <InlineMath math="\{5\}" />, sehingga <InlineMath math="P(B) = \frac{1}{6}" /></p>
                      <p>• A ∩ B = ∅ (tidak mungkin muncul 2 dan 5 sekaligus) → <strong>Saling Lepas</strong></p>
                    </div>
                    <BlockMath math="P(A \cup B) = P(A) + P(B) = \frac{1}{6} + \frac{1}{6} = \frac{2}{6} = \frac{1}{3}" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Peluang muncul angka 2 atau 5 adalah <InlineMath math="\frac{1}{3}" />.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 2 – Tidak Saling Lepas</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Dari setumpuk kartu bridge (52 kartu), sebuah kartu diambil secara acak. Tentukan peluang terambil kartu <strong>merah atau kartu bergambar (J, Q, K)</strong>!
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• <InlineMath math="n(S) = 52" /></p>
                      <p>• A = kartu merah: <InlineMath math="n(A) = 26" />, maka <InlineMath math="P(A) = \frac{26}{52} = \frac{1}{2}" /></p>
                      <p>• B = kartu bergambar (J, Q, K): <InlineMath math="n(B) = 12" />, maka <InlineMath math="P(B) = \frac{12}{52} = \frac{3}{13}" /></p>
                      <p>• A ∩ B = kartu bergambar merah (J♥, Q♥, K♥, J♦, Q♦, K♦): <InlineMath math="n(A \cap B) = 6" /></p>
                      <p>• <InlineMath math="P(A \cap B) = \frac{6}{52} = \frac{3}{26}" /></p>
                    </div>
                    <p className="font-body text-sm text-white/80">A ∩ B ≠ ∅, jadi <strong className="text-yellow-300">tidak saling lepas</strong>. Gunakan aturan penjumlahan umum:</p>
                    <BlockMath math="P(A \cup B) = \frac{26}{52} + \frac{12}{52} - \frac{6}{52} = \frac{32}{52} = \frac{8}{13}" />
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Peluang terambil kartu merah atau bergambar adalah <InlineMath math="\frac{8}{13}" />.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — SULIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 3 – Saling Bebas & Bersyarat</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Sebuah kotak berisi 5 bola merah dan 3 bola biru. Dua bola diambil satu per satu <strong>tanpa pengembalian</strong>. Tentukan peluang:
                      <br />a. Kedua bola merah
                      <br />b. Bola pertama merah dan bola kedua biru
                      <br />c. Setidaknya satu bola merah
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• Kotak: 5 merah + 3 biru = 8 bola total</p>
                      <p>• Pengambilan tanpa pengembalian → <strong className="text-orange-300">kejadian tidak saling bebas</strong></p>
                    </div>

                    <div>
                      <p className="font-body text-sm font-semibold text-white mb-2">a. P(keduanya merah)</p>
                      <p className="font-body text-xs text-white/60 mb-1">
                        <InlineMath math="P(M_1) = \frac{5}{8}" />, setelah 1 merah diambil: <InlineMath math="P(M_2|M_1) = \frac{4}{7}" />
                      </p>
                      <BlockMath math="P(M_1 \cap M_2) = \frac{5}{8} \times \frac{4}{7} = \frac{20}{56} = \frac{5}{14}" />
                    </div>

                    <div>
                      <p className="font-body text-sm font-semibold text-white mb-2">b. P(pertama merah, kedua biru)</p>
                      <p className="font-body text-xs text-white/60 mb-1">
                        <InlineMath math="P(M_1) = \frac{5}{8}" />, setelah 1 merah diambil: <InlineMath math="P(B_2|M_1) = \frac{3}{7}" />
                      </p>
                      <BlockMath math="P(M_1 \cap B_2) = \frac{5}{8} \times \frac{3}{7} = \frac{15}{56}" />
                    </div>

                    <div>
                      <p className="font-body text-sm font-semibold text-white mb-2">c. P(setidaknya 1 merah) — Gunakan komplemen!</p>
                      <p className="font-body text-xs text-white/60 mb-1">Komplemen: "tidak ada yang merah" = keduanya biru:</p>
                      <BlockMath math="P(\text{keduanya biru}) = \frac{3}{8} \times \frac{2}{7} = \frac{6}{56} = \frac{3}{28}" />
                      <BlockMath math="P(\text{setidaknya 1 merah}) = 1 - \frac{3}{28} = \frac{25}{28}" />
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 rounded p-3 space-y-1">
                      <p className="font-body text-xs font-bold text-red-300">⚠️ Poin Penting:</p>
                      <p className="font-body text-xs text-white/70">• "Tanpa pengembalian" → kejadian tidak saling bebas → gunakan aturan perkalian bersyarat.</p>
                      <p className="font-body text-xs text-white/70">• Untuk "setidaknya satu", selalu pertimbangkan strategi komplemen — jauh lebih cepat!</p>
                      <p className="font-body text-xs text-white/70">• Periksa: a + b + (BB) = 5/14 + 15/56 + 3/28 = 20/56 + 15/56 + 6/56 = 41/56 ≠ 1 (karena a, b, BB bukan semua kemungkinan — ada juga biru-merah). Konfirmasi: P(biru-merah) = 3/8 × 5/7 = 15/56. Total: 20+15+15+6 = 56/56 = 1 ✓</p>
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
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {[
                    { poin: "Kejadian Saling Lepas: A ∩ B = ∅, sehingga P(A ∪ B) = P(A) + P(B).", icon: "🔵", color: "text-blue-300" },
                    { poin: "Kejadian Tidak Saling Lepas: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).", icon: "🟣", color: "text-purple-300" },
                    { poin: "Kejadian Saling Bebas: P(A ∩ B) = P(A) × P(B).", icon: "🟢", color: "text-green-300" },
                    { poin: "Peluang Bersyarat: P(A|B) = P(A ∩ B) / P(B).", icon: "🟠", color: "text-orange-300" },
                    { poin: "Aturan perkalian umum: P(A ∩ B) = P(A) × P(B|A).", icon: "⚡", color: "text-yellow-300" },
                    { poin: "Untuk 'setidaknya satu', gunakan strategi komplemen: 1 − P(tidak satupun).", icon: "💡", color: "text-cyan-300" },
                  ].map(({ poin, icon, color }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className={`text-lg shrink-0 ${color}`}>{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>

                {/* Tabel Ringkasan Rumus */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse mt-2">
                    <thead>
                      <tr className="bg-primary/20">
                        <th className="border border-primary/30 px-3 py-2 text-primary text-left">Jenis Kejadian</th>
                        <th className="border border-primary/30 px-3 py-2 text-primary text-center">Syarat</th>
                        <th className="border border-primary/30 px-3 py-2 text-primary text-center">Rumus Utama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Saling Lepas", "A ∩ B = ∅", "P(A∪B) = P(A) + P(B)"],
                        ["Tidak Saling Lepas", "A ∩ B ≠ ∅", "P(A∪B) = P(A) + P(B) − P(A∩B)"],
                        ["Saling Bebas", "A & B independen", "P(A∩B) = P(A) × P(B)"],
                        ["Bersyarat", "B sudah terjadi", "P(A|B) = P(A∩B) / P(B)"],
                      ].map(([jenis, syarat, rumus], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-200 font-semibold">{jenis}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-white/60">{syarat}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-yellow-300">{rumus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-rose-900"
            gradientVia="via-pink-900"
            gradientTo="to-red-900"
            borderColor="border-rose-500/40"
            accentColor="text-rose-300"
            headerIcon="🔗"
            judul="Rangkuman — Peluang Kejadian Majemuk"
            subjudul="Menggabungkan dua kejadian atau lebih — tiga jenis hubungan yang wajib dikuasai!"
            ringkasan={[
              {
                emoji: "🔵",
                judul: "Saling Lepas (Mutually Exclusive)",
                isi: "A dan B tidak bisa terjadi bersamaan. A irisan B = kosong. Rumus gabungan: P(A U B) = P(A) + P(B). Contoh: muncul angka genap ATAU ganjil pada satu dadu.",
                bg: "bg-rose-900/50",
                border: "border-rose-500/40",
                textColor: "text-rose-200",
              },
              {
                emoji: "🟣",
                judul: "Tidak Saling Lepas",
                isi: "A dan B bisa terjadi bersamaan (ada irisan). Rumus: P(A U B) = P(A) + P(B) - P(A irisan B). Harus dikurangi P(irisan) agar tidak dihitung dua kali!",
                bg: "bg-pink-900/50",
                border: "border-pink-500/40",
                textColor: "text-pink-200",
              },
              {
                emoji: "🟢",
                judul: "Saling Bebas (Independent)",
                isi: "Kejadian A tidak mempengaruhi kejadian B sama sekali. Rumus irisan: P(A irisan B) = P(A) x P(B). Contoh: melempar dadu dan koin secara bersamaan.",
                bg: "bg-red-900/50",
                border: "border-red-500/40",
                textColor: "text-red-200",
              },
              {
                emoji: "📊",
                judul: "Cara Identifikasi Jenisnya",
                isi: "Saling lepas: apakah bisa terjadi bersamaan? Saling bebas: apakah hasil A mempengaruhi B? Cek keduanya sebelum memilih rumus yang tepat.",
                bg: "bg-orange-900/50",
                border: "border-orange-500/40",
                textColor: "text-orange-200",
              },
            ]}
            rumus={[
              {
                label: "Saling Lepas: P(A atau B)",
                rumus: "P(A \\cup B) = P(A) + P(B)",
                bg: "bg-rose-900/60",
                border: "border-rose-400/40",
                labelColor: "text-rose-300",
              },
              {
                label: "Tidak Saling Lepas: P(A atau B)",
                rumus: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
                bg: "bg-pink-900/60",
                border: "border-pink-400/40",
                labelColor: "text-pink-300",
              },
            ]}
            tips={[
              { emoji: "🔑", teks: "Kunci identifikasi: (1) Saling lepas: A irisan B = kosong. (2) Tidak saling lepas: A irisan B tidak kosong. (3) Saling bebas: P(A|B) = P(A), artinya B tidak mengubah peluang A." },
              { emoji: "⚠️", teks: "Kesalahan paling umum: lupa mengurangi P(A irisan B) pada kejadian tidak saling lepas. Selalu gambar diagram Venn untuk membantu visualisasi!" },
              { emoji: "🎲", teks: "Saling bebas =/= saling lepas! Saling bebas berarti tidak saling mempengaruhi. Saling lepas berarti tidak bisa terjadi bersamaan. Dua konsep yang berbeda!" },
              { emoji: "💡", teks: "Untuk dua dadu atau dua lemparan koin yang terpisah, selalu gunakan rumus saling bebas: P(A dan B) = P(A) x P(B) karena hasilnya tidak saling mempengaruhi." },
            ]}
            kesimpulan="Kejadian majemuk adalah inti dari statistika modern — setiap keputusan di dunia nyata melibatkan kombinasi beberapa kejadian sekaligus. Dari analisis cuaca (hujan DAN angin kencang), prediksi saham (naik ATAU turun), hingga diagnosis medis — semuanya menggunakan prinsip peluang kejadian majemuk!"
            kesimpulanBg="bg-gradient-to-r from-rose-900/80 to-pink-900/80"
            kesimpulanBorder="border-rose-400/50"
            kesimpulanTextColor="text-rose-100"
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

export default PeluangKejadianMajemukPage;
