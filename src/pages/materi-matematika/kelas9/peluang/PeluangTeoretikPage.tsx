import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Calculator } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PeluangTeoretikPage = () => {
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
          PELUANG TEORETIK
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Peluang Berdasarkan Penalaran Logis & Matematika
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Peluang · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Peluang Teoretik?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu punya dadu sempurna yang benar-benar seimbang. Tanpa perlu melemparnya ribuan kali, kamu bisa langsung bilang: "Peluang muncul angka 3 adalah <InlineMath math="\frac{1}{6}" />." Inilah <strong className="text-cyan-300">Peluang Teoretik</strong> — peluang yang dihitung berdasarkan logika dan matematika, dengan asumsi semua kemungkinan memiliki kesempatan yang <em>sama besar</em> untuk terjadi.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      term: "Kejadian Sama Mungkin",
                      icon: "⚖️",
                      desc: "Syarat utama peluang teoretik: setiap hasil percobaan harus memiliki peluang yang sama untuk terjadi.",
                      color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
                    },
                    {
                      term: "n(A)",
                      icon: "🎯",
                      desc: "Banyaknya anggota kejadian A — hasil yang kita inginkan dari percobaan.",
                      color: "bg-green-900/40 border-green-500/40 text-green-300",
                    },
                    {
                      term: "n(S)",
                      icon: "🌐",
                      desc: "Banyaknya anggota ruang sampel — semua kemungkinan hasil yang bisa terjadi.",
                      color: "bg-violet-900/40 border-violet-500/40 text-violet-300",
                    },
                    {
                      term: "P(A)",
                      icon: "📊",
                      desc: "Peluang kejadian A — nilai antara 0 dan 1 yang menyatakan seberapa mungkin A terjadi.",
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
                    <strong>Perbedaan Kunci:</strong> Peluang <em>empirik</em> butuh percobaan nyata. Peluang <em>teoretik</em> cukup dengan menghitung kemungkinan secara logis, tanpa harus melakukan percobaan!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KONSEP & RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📘 Rumus & Konsep Peluang Teoretik" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Peluang teoretik dihitung dengan membandingkan banyaknya hasil yang kita inginkan (<InlineMath math="n(A)" />) terhadap total semua kemungkinan hasil yang ada (<InlineMath math="n(S)" />).
                  </p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide">📐 Rumus Peluang Teoretik</p>
                  <BlockMath math="P(A) = \frac{n(A)}{n(S)}" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-2 text-center">
                      <p className="text-blue-300 font-bold"><InlineMath math="P(A)" /></p>
                      <p className="text-white/60 mt-1">Peluang kejadian A</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="n(A)" /></p>
                      <p className="text-white/60 mt-1">Banyak anggota kejadian A</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2 text-center">
                      <p className="text-violet-300 font-bold"><InlineMath math="n(S)" /></p>
                      <p className="text-white/60 mt-1">Banyak anggota ruang sampel</p>
                    </div>
                  </div>
                </div>

                {/* Contoh Visual: Dadu */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">🎲 Ilustrasi: Peluang Pada Dadu</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 font-display text-xl font-bold
                        ${[2, 4, 6].includes(n) ? "bg-cyan-800/60 border-cyan-400 text-cyan-200" : "bg-white/10 border-white/20 text-white/60"}`}>
                        {n}
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-center text-cyan-300">Angka biru = bilangan genap (kejadian yang dicari)</p>
                  <div className="bg-slate-800/40 border border-cyan-500/20 rounded-lg p-3 text-sm font-body">
                    <BlockMath math="P(\text{genap}) = \frac{n(\{2,4,6\})}{n(\{1,2,3,4,5,6\})} = \frac{3}{6} = \frac{1}{2}" />
                  </div>
                </div>

                {/* Tabel Peluang Beberapa Kejadian */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">📊 Tabel Peluang Teoretik Dadu</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-violet-900/50">
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Kejadian</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">Anggota</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center"><InlineMath math="n(A)" /></th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center"><InlineMath math="P(A)" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Bilangan Genap", "{2, 4, 6}", "3", "3/6 = 1/2"],
                          ["Bilangan Ganjil", "{1, 3, 5}", "3", "3/6 = 1/2"],
                          ["Bilangan Prima", "{2, 3, 5}", "3", "3/6 = 1/2"],
                          ["Bilangan > 4", "{5, 6}", "2", "2/6 = 1/3"],
                          ["Bilangan = 7", "{ }", "0", "0 (mustahil)"],
                          ["Bilangan ≤ 6", "{1,2,3,4,5,6}", "6", "6/6 = 1 (pasti)"],
                        ].map(([k, a, n, p], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white">{k}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">{a}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">{n}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-yellow-300">{p}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                      Sebuah dadu bermuka enam dilempar satu kali. Tentukan peluang muncul mata dadu bilangan ganjil!
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Langkah 1 — Tentukan ruang sampel:</p>
                    <BlockMath math="S = \{1, 2, 3, 4, 5, 6\},\quad n(S) = 6" />
                    <p className="font-body text-sm text-white/80">Langkah 2 — Tentukan anggota kejadian (bilangan ganjil):</p>
                    <BlockMath math="A = \{1, 3, 5\},\quad n(A) = 3" />
                    <p className="font-body text-sm text-white/80">Langkah 3 — Hitung peluang teoretik:</p>
                    <BlockMath math="P(A) = \frac{n(A)}{n(S)} = \frac{3}{6} = \frac{1}{2}" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Peluang muncul bilangan ganjil adalah <InlineMath math="\frac{1}{2}" /> atau <InlineMath math="0{,}5" />.</p>
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
                      Dari satu set kartu bridge (52 kartu), diambil satu kartu secara acak. Tentukan peluang terambil:<br />
                      a. Kartu As (A)<br />
                      b. Kartu berwarna merah<br />
                      c. Kartu King berwarna hitam
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <BlockMath math="n(S) = 52" />
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Kartu As ada 4 (♠A, ♥A, ♦A, ♣A):</p>
                      <BlockMath math="P(\text{As}) = \frac{4}{52} = \frac{1}{13}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Kartu merah = ♥ dan ♦ = 26 kartu:</p>
                      <BlockMath math="P(\text{merah}) = \frac{26}{52} = \frac{1}{2}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">c. King hitam = K♠ dan K♣ = 2 kartu:</p>
                      <BlockMath math="P(\text{King hitam}) = \frac{2}{52} = \frac{1}{26}" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Pastikan kamu menghitung <InlineMath math="n(A)" /> dengan teliti sebelum memasukkan ke rumus!</p>
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
                      Dua buah dadu dilempar bersama-sama satu kali. Tentukan peluang:<br />
                      a. Jumlah kedua mata dadu sama dengan 7<br />
                      b. Selisih kedua mata dadu sama dengan 2<br />
                      c. Jumlah kedua mata dadu merupakan bilangan prima
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Dua dadu: <InlineMath math="n(S) = 6 \times 6 = 36" /></p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. Jumlah = 7: pasangan yang memenuhi:</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-body text-white/70 mb-1">
                        (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 pasangan
                      </div>
                      <BlockMath math="P(\text{jumlah}=7) = \frac{6}{36} = \frac{1}{6}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. Selisih = 2 (|dadu1 − dadu2| = 2):</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-body text-white/70 mb-1">
                        (1,3),(2,4),(3,5),(4,6),(3,1),(4,2),(5,3),(6,4) → 8 pasangan
                      </div>
                      <BlockMath math="P(\text{selisih}=2) = \frac{8}{36} = \frac{2}{9}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">c. Jumlah prima (2, 3, 5, 7, 11):</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-body text-white/70 mb-1 space-y-1">
                        <p>Jumlah 2: (1,1) → 1 pasangan</p>
                        <p>Jumlah 3: (1,2),(2,1) → 2 pasangan</p>
                        <p>Jumlah 5: (1,4),(2,3),(3,2),(4,1) → 4 pasangan</p>
                        <p>Jumlah 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 pasangan</p>
                        <p>Jumlah 11: (5,6),(6,5) → 2 pasangan</p>
                        <p className="font-bold text-white/90">Total: 1+2+4+6+2 = 15 pasangan</p>
                      </div>
                      <BlockMath math="P(\text{jumlah prima}) = \frac{15}{36} = \frac{5}{12}" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">⚠️ Untuk dua dadu, susunlah semua kemungkinan secara sistematis agar tidak ada yang terlewat. Tabel pasangan dadu sangat membantu!</p>
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
                    { poin: "Peluang teoretik dihitung menggunakan logika, tanpa perlu melakukan percobaan nyata.", icon: "🧠" },
                    { poin: "Rumus: P(A) = n(A) / n(S), dengan syarat setiap hasil memiliki kesempatan yang sama.", icon: "📐" },
                    { poin: "Nilai peluang selalu antara 0 (mustahil) dan 1 (pasti terjadi).", icon: "📏" },
                    { poin: "Semakin besar n(A) dibanding n(S), semakin besar peluang kejadian A.", icon: "📈" },
                    { poin: "Untuk dua alat atau lebih, n(S) = perkalian kemungkinan masing-masing alat.", icon: "✖️" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="P(A) = \frac{n(A)}{n(S)} \quad,\quad 0 \leq P(A) \leq 1" />
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

export default PeluangTeoretikPage;
