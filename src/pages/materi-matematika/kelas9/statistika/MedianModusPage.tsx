import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MedianModusPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1","contoh1",
    "konsep2","contoh2",
    "konsep3","contoh3",
    "konsep4","contoh4",
    "konsep5","contoh5",
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

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          UKURAN PEMUSATAN DATA
        </h1>
        <p className="font-display text-sm font-semibold text-purple-400 text-center mb-1">Median & Modus</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Median & Modus — Dua Saudara Rata-Rata" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Selain rata-rata, ada dua ukuran pemusatan data lain yang sering digunakan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 border border-purple-500/40 rounded-xl p-4">
                    <p className="font-display text-3xl font-bold text-purple-300 text-center mb-2">Me</p>
                    <p className="font-body text-sm font-bold text-white text-center mb-2">MEDIAN</p>
                    <p className="font-body text-xs text-white/60 text-center">Nilai tengah setelah data diurutkan. Tidak terpengaruh nilai ekstrem.</p>
                    <p className="font-body text-xs text-purple-400 text-center mt-2 italic">Cocok untuk data yang ada nilai sangat besar/kecil.</p>
                  </div>
                  <div className="bg-orange-900/40 border border-orange-500/40 rounded-xl p-4">
                    <p className="font-display text-3xl font-bold text-orange-300 text-center mb-2">Mo</p>
                    <p className="font-body text-sm font-bold text-white text-center mb-2">MODUS</p>
                    <p className="font-body text-xs text-white/60 text-center">Nilai yang paling sering muncul dalam data. Bisa lebih dari satu.</p>
                    <p className="font-body text-xs text-orange-400 text-center mt-2 italic">Cocok untuk data kategori atau nilai terpopuler.</p>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Perbandingan singkat:</strong> Gaji 5 karyawan = 3, 3, 4, 5, 100 juta. Rata-rata = 23 juta (tidak representatif karena terpengaruh angka 100). Median = 4 juta (lebih representatif). Modus = 3 juta (paling sering muncul). 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 1: MEDIAN DATA TUNGGAL (JUMLAH GANJIL) */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 1: Median Data Tunggal (Jumlah Data Ganjil)" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika banyak data (<InlineMath math="n" />) adalah <strong className="text-purple-300">bilangan ganjil</strong>, ada tepat satu nilai di posisi tengah setelah data diurutkan. Nilai inilah yang menjadi median.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">Rumus posisi median (n ganjil)</p>
                    <BlockMath math="\text{Me} = x_{\left(\frac{n+1}{2}\right)}" />
                    <p className="font-body text-xs text-white/50">
                      Median = nilai data pada urutan ke-<InlineMath math="\dfrac{n+1}{2}" />
                    </p>
                  </div>
                </div>

                {/* Visual median ganjil */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">📌 Ilustrasi Median Data Ganjil (n = 7)</p>
                  <p className="font-body text-xs text-white/50 mb-3">Data terurut: 12, 15, 18, <span className="text-purple-300 font-bold">21</span>, 25, 30, 35</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {[12,15,18,21,25,30,35].map((v,i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-center border ${i === 3 ? "bg-purple-700/60 border-purple-400 ring-2 ring-purple-400" : "bg-slate-700/50 border-slate-600/40"}`}>
                        <p className={`font-bold text-sm ${i === 3 ? "text-purple-200" : "text-white/70"}`}>{v}</p>
                        <p className="text-white/30 text-xs">ke-{i+1}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1"><InlineMath math="n = 7" /> (ganjil) → posisi median = <InlineMath math="\frac{7+1}{2} = 4" /></p>
                    <p className="font-body text-sm text-purple-300 font-bold">Median = data urutan ke-4 = <strong>21</strong></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Langkah mencari median:</strong> (1) Urutkan data dari kecil ke besar. (2) Hitung banyak data (<InlineMath math="n" />). (3) Jika <InlineMath math="n" /> ganjil, median = data urutan ke-<InlineMath math="\frac{n+1}{2}" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Median Data Ganjil" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan median dari data berikut: 9, 3, 7, 5, 11, 1, 13
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan: 1, 3, 5, <strong className="text-purple-300">7</strong>, 9, 11, 13</p>
                      <p><strong>Langkah 2:</strong> <InlineMath math="n = 7" /> (ganjil) → posisi tengah = <InlineMath math="\frac{7+1}{2} = 4" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-purple-300 font-semibold">Median = data urutan ke-4 = <strong>7</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Nilai ulangan 9 siswa: 75, 62, 88, 70, 95, 55, 80, 73, 68. Tentukan median dan bandingkan dengan rata-ratanya!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan: 55, 62, 68, 70, <strong className="text-purple-300">73</strong>, 75, 80, 88, 95</p>
                      <p><strong>Langkah 2:</strong> Posisi median = <InlineMath math="\frac{9+1}{2} = 5" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p className="text-purple-300 font-semibold">Median = data ke-5 = <strong>73</strong></p>
                        <BlockMath math="\bar{x} = \frac{55+62+68+70+73+75+80+88+95}{9} = \frac{666}{9} \approx 74" />
                      </div>
                      <p>Median (73) ≈ Rata-rata (74) — keduanya cukup dekat karena tidak ada nilai yang terlalu ekstrem.</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data terdiri dari 11 bilangan yang sudah terurut. Diketahui median = 45, dan semua data di bawah median adalah 20, 25, 28, 32, <InlineMath math="a" />. Jika rata-rata data di bawah median = 27, tentukan nilai <InlineMath math="a" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><InlineMath math="n=11" /> ganjil, median = data ke-6 = 45. Data di bawah median: posisi 1–5 = 20, 25, 28, 32, <InlineMath math="a" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\bar{x}_{\text{bawah}} = \frac{20+25+28+32+a}{5} = 27" />
                        <BlockMath math="105 + a = 135" />
                        <BlockMath math="a = 30" />
                      </div>
                      <p>Cek urutan: 20, 25, 28, 30, 32 ✓ (terurut naik, semua &lt; 45 ✓)</p>
                      <p><strong className="text-primary">a = 30</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 2: MEDIAN DATA TUNGGAL (JUMLAH GENAP) */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-indigo-400" title="📘 Sub-Bab 2: Median Data Tunggal (Jumlah Data Genap)" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-indigo-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika banyak data (<InlineMath math="n" />) adalah <strong className="text-indigo-300">bilangan genap</strong>, tidak ada satu nilai tepat di tengah. Median diperoleh dengan merata-ratakan dua nilai yang berada di posisi tengah.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">Rumus Median (n genap)</p>
                    <BlockMath math="\text{Me} = \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2}" />
                    <p className="font-body text-xs text-white/50">
                      Median = rata-rata data urutan ke-<InlineMath math="\frac{n}{2}" /> dan ke-<InlineMath math="\frac{n}{2}+1" />
                    </p>
                  </div>
                </div>

                {/* Visual median genap */}
                <div className="bg-slate-800/60 border border-indigo-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">📌 Ilustrasi Median Data Genap (n = 8)</p>
                  <p className="font-body text-xs text-white/50 mb-3">Data terurut: 10, 14, 18, <span className="text-indigo-300 font-bold">20</span>, <span className="text-indigo-300 font-bold">24</span>, 28, 32, 36</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {[10,14,18,20,24,28,32,36].map((v,i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-center border ${(i===3||i===4) ? "bg-indigo-700/60 border-indigo-400 ring-2 ring-indigo-400" : "bg-slate-700/50 border-slate-600/40"}`}>
                        <p className={`font-bold text-sm ${(i===3||i===4) ? "text-indigo-200" : "text-white/70"}`}>{v}</p>
                        <p className="text-white/30 text-xs">ke-{i+1}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1"><InlineMath math="n = 8" /> (genap) → dua nilai tengah = ke-4 dan ke-5</p>
                    <BlockMath math="\text{Me} = \frac{20 + 24}{2} = \frac{44}{2} = 22" />
                  </div>
                </div>

                {/* Tabel ringkas perbandingan */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl overflow-hidden">
                  <div className="bg-slate-700/40 px-4 py-2">
                    <p className="font-body text-xs font-bold text-slate-200 uppercase tracking-wide">🔍 Perbandingan: Ganjil vs Genap</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/30">
                        <th className="px-3 py-2 text-left text-white/50">Kondisi</th>
                        <th className="px-3 py-2 text-center text-purple-300 font-bold">n Ganjil</th>
                        <th className="px-3 py-2 text-center text-indigo-300 font-bold">n Genap</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        <tr><td className="px-3 py-2 text-white/70">Posisi tengah</td><td className="px-3 py-2 text-center text-purple-300"><InlineMath math="\frac{n+1}{2}" /></td><td className="px-3 py-2 text-center text-indigo-300"><InlineMath math="\frac{n}{2}" /> dan <InlineMath math="\frac{n}{2}+1" /></td></tr>
                        <tr><td className="px-3 py-2 text-white/70">Nilai median</td><td className="px-3 py-2 text-center text-purple-300">1 nilai langsung</td><td className="px-3 py-2 text-center text-indigo-300">Rata-rata 2 nilai tengah</td></tr>
                        <tr><td className="px-3 py-2 text-white/70">Contoh (n=9)</td><td className="px-3 py-2 text-center text-purple-300">data ke-5</td><td className="px-3 py-2 text-center text-indigo-300">—</td></tr>
                        <tr><td className="px-3 py-2 text-white/70">Contoh (n=10)</td><td className="px-3 py-2 text-center text-purple-300">—</td><td className="px-3 py-2 text-center text-indigo-300">rata2 data ke-5 & ke-6</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips cepat:</strong> Selalu urutkan data terlebih dahulu! Ini adalah langkah paling sering terlupakan yang menyebabkan kesalahan dalam mencari median.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-indigo-400" title="📝 Contoh Soal — Median Data Tunggal (Genap)" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan median dari data: 14, 8, 22, 5, 18, 11, 27, 3
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan: 3, 5, 8, <strong className="text-indigo-300">11</strong>, <strong className="text-indigo-300">14</strong>, 18, 22, 27</p>
                      <p><strong>Langkah 2:</strong> <InlineMath math="n = 8" /> (genap) → dua nilai tengah = ke-4 dan ke-5</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = \frac{11 + 14}{2} = \frac{25}{2} = 12{,}5" />
                      </div>
                      <p><strong className="text-primary">Median = 12,5</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Nilai ujian 10 siswa: 72, 85, 60, 90, 78, 65, 88, 70, 55, 82. Tentukan median, kemudian tentukan berapa siswa yang nilainya di atas median!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan: 55, 60, 65, 70, <strong className="text-indigo-300">72</strong>, <strong className="text-indigo-300">78</strong>, 82, 85, 88, 90</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Me} = \frac{72+78}{2} = \frac{150}{2} = 75" />
                        <p className="text-xs text-white/50">Nilai di atas 75: 78, 82, 85, 88, 90 → <span className="text-yellow-300 font-bold">5 siswa</span></p>
                      </div>
                      <p><strong className="text-primary">Median = 75; 5 siswa nilainya di atas median.</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Terdapat 12 data terurut. Nilai terkecil 40, terbesar 95. Median = 68. Jika semua nilai di atas median dinaikkan 5, tentukan median yang baru!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><InlineMath math="n=12" /> (genap) → median = rata-rata data ke-6 dan ke-7.</p>
                      <p>Median awal = 68 berarti: <InlineMath math="\frac{x_6 + x_7}{2} = 68 \implies x_6 + x_7 = 136" /></p>
                      <p>Nilai di atas median = data ke-7 s.d. ke-12. Data ke-7 termasuk "di atas median" (nilai ke-7 ≥ nilai ke-6).</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p>Setelah data ke-7 s.d. ke-12 dinaikkan 5:</p>
                        <p>• <InlineMath math="x_6" /> tetap (tidak berubah)</p>
                        <p>• <InlineMath math="x_7" /> menjadi <InlineMath math="x_7 + 5" /></p>
                        <BlockMath math="\text{Me}_{\text{baru}} = \frac{x_6 + (x_7+5)}{2} = \frac{x_6+x_7}{2} + \frac{5}{2} = 68 + 2{,}5 = 70{,}5" />
                      </div>
                      <p><strong className="text-primary">Median baru = 70,5</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 3: MEDIAN PADA TABEL DISTRIBUSI FREKUENSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Sub-Bab 3: Median pada Tabel Distribusi Frekuensi" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Untuk data berkelompok (tabel distribusi frekuensi), kita tidak bisa langsung melihat nilai aslinya. Kita gunakan <strong className="text-cyan-300">rumus interpolasi</strong> untuk memperkirakan posisi median di dalam kelas median.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center mb-1">Rumus Median Data Berkelompok</p>
                    <BlockMath math="\text{Me} = T_b + p \cdot \frac{\frac{n}{2} - F}{f}" />
                    <div className="grid grid-cols-2 gap-2 text-xs font-body mt-2">
                      <div className="bg-cyan-900/30 rounded p-2">
                        <p className="text-cyan-300 font-bold"><InlineMath math="T_b" /></p>
                        <p className="text-white/50">tepi bawah kelas median = batas bawah − 0,5</p>
                      </div>
                      <div className="bg-cyan-900/30 rounded p-2">
                        <p className="text-cyan-300 font-bold"><InlineMath math="p" /></p>
                        <p className="text-white/50">panjang kelas</p>
                      </div>
                      <div className="bg-cyan-900/30 rounded p-2">
                        <p className="text-cyan-300 font-bold"><InlineMath math="n" /></p>
                        <p className="text-white/50">total frekuensi (banyak data)</p>
                      </div>
                      <div className="bg-cyan-900/30 rounded p-2">
                        <p className="text-cyan-300 font-bold"><InlineMath math="F" /></p>
                        <p className="text-white/50">frekuensi kumulatif sebelum kelas median</p>
                      </div>
                      <div className="bg-cyan-900/30 rounded p-2 col-span-2">
                        <p className="text-cyan-300 font-bold"><InlineMath math="f" /></p>
                        <p className="text-white/50">frekuensi kelas median</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-3">
                    <p className="font-body text-xs text-cyan-200">
                      <strong>Kelas median</strong> adalah kelas yang memuat data ke-<InlineMath math="\frac{n}{2}" />, yaitu kelas pertama yang frekuensi kumulatifnya ≥ <InlineMath math="\frac{n}{2}" />.
                    </p>
                  </div>
                </div>

                {/* Contoh penerapan rumus */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl overflow-hidden">
                  <div className="bg-cyan-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-cyan-200 uppercase tracking-wide">📋 Contoh Tabel: Nilai Ujian 40 Siswa</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-2 py-2 text-left text-cyan-300 font-bold">Kelas</th>
                        <th className="px-2 py-2 text-center text-white/70">f</th>
                        <th className="px-2 py-2 text-center text-white/70">fk</th>
                        <th className="px-2 py-2 text-center text-white/70">Keterangan</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["50–59","4","4",""],
                          ["60–69","8","12",""],
                          ["70–79","14","26","← kelas median (fk ≥ 20)"],
                          ["80–89","10","36",""],
                          ["90–99","4","40",""],
                        ].map(([k,f,fk,ket]) => (
                          <tr key={k} className={ket ? "bg-cyan-900/20" : "hover:bg-slate-700/20"}>
                            <td className="px-2 py-2 text-white font-semibold">{k}</td>
                            <td className="px-2 py-2 text-center text-green-300">{f}</td>
                            <td className="px-2 py-2 text-center text-purple-300">{fk}</td>
                            <td className="px-2 py-2 text-cyan-400 text-xs">{ket}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="font-body text-xs text-white/50 mb-2">Kelas median = 70–79, <InlineMath math="T_b = 69{,}5" />, <InlineMath math="p=10" />, <InlineMath math="F=12" />, <InlineMath math="f=14" />, <InlineMath math="n=40" /></p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Me} = 69{,}5 + 10 \cdot \frac{\frac{40}{2} - 12}{14} = 69{,}5 + 10 \cdot \frac{8}{14} \approx 69{,}5 + 5{,}71 \approx 75{,}21" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Langkah sistematis:</strong> (1) Buat kolom frekuensi kumulatif. (2) Cari kelas yang mengandung data ke-n/2. (3) Catat Tb, p, F, f dari kelas itu. (4) Substitusi ke rumus.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title="📝 Contoh Soal — Median Tabel Distribusi Frekuensi" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">Hitunglah median dari tabel distribusi frekuensi berikut!</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-2 py-1 text-left text-white/70">Kelas</th><th className="px-2 py-1 text-center text-white/70">f</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["40–49","3"],["50–59","7"],["60–69","10"],["70–79","8"],["80–89","2"]].map(([k,f]) => <tr key={k}><td className="px-2 py-1 text-white">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>fk: 3, 10, 20, 28, 30 → <InlineMath math="n=30" />, data ke-15 masuk kelas <strong className="text-cyan-300">60–69</strong> (fk=20 ≥ 15)</p>
                      <p><InlineMath math="T_b = 59{,}5" />, <InlineMath math="p = 10" />, <InlineMath math="F = 10" />, <InlineMath math="f = 10" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = 59{,}5 + 10 \cdot \frac{15-10}{10} = 59{,}5 + 5 = 64{,}5" />
                      </div>
                      <p><strong className="text-primary">Median = 64,5</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Tabel distribusi frekuensi tinggi badan 60 siswa (panjang kelas = 5 cm):
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-2 py-1 text-left text-white/70">Tinggi (cm)</th><th className="px-2 py-1 text-center text-white/70">f</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["150–154","5"],["155–159","12"],["160–164","20"],["165–169","15"],["170–174","8"]].map(([k,f]) => <tr key={k}><td className="px-2 py-1 text-white">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>fk: 5, 17, 37, 52, 60. <InlineMath math="n=60" />, data ke-30 masuk kelas <strong className="text-cyan-300">160–164</strong> (fk=37 ≥ 30)</p>
                      <p><InlineMath math="T_b = 159{,}5" />, <InlineMath math="p=5" />, <InlineMath math="F=17" />, <InlineMath math="f=20" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = 159{,}5 + 5 \cdot \frac{30-17}{20} = 159{,}5 + 5 \cdot 0{,}65 = 159{,}5 + 3{,}25 = 162{,}75 \text{ cm}" />
                      </div>
                      <p><strong className="text-primary">Median ≈ 162,75 cm</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tabel distribusi frekuensi data nilai ujian memiliki kelas 50–59, 60–69, 70–79, 80–89. Frekuensi: 4, <InlineMath math="a" />, 18, 8 dengan median = 72,5. Tentukan nilai <InlineMath math="a" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Kelas median = 70–79 (karena median 72,5 ada di sana).</p>
                      <p><InlineMath math="T_b = 69{,}5" />, <InlineMath math="p=10" />, <InlineMath math="f=18" />, <InlineMath math="F = 4+a" />, <InlineMath math="n = 30+a" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="72{,}5 = 69{,}5 + 10 \cdot \frac{\frac{30+a}{2} - (4+a)}{18}" />
                        <BlockMath math="3 = 10 \cdot \frac{\frac{30+a}{2} - 4 - a}{18}" />
                        <BlockMath math="3 \times 18 = 10 \left(\frac{30+a-8-2a}{2}\right)" />
                        <BlockMath math="54 = 10 \cdot \frac{22-a}{2} = 5(22-a)" />
                        <BlockMath math="10{,}8 = 22-a \implies a = 22 - 10{,}8 = 11{,}2 \approx 11" />
                      </div>
                      <p><strong className="text-primary">a = 11</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 4: MODUS DATA TUNGGAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Sub-Bab 4: Modus Data Tunggal" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-orange-300">Modus</strong> adalah nilai yang paling sering muncul dalam sekumpulan data. Berbeda dengan rata-rata dan median, modus <em>tidak perlu mengurutkan data</em> — cukup cari nilai yang frekuensinya terbesar.
                  </p>
                </div>

                {/* Jenis-jenis modus */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">Unimodal</p>
                    <p className="font-body text-xs text-white/60 mb-2">Hanya satu nilai terbanyak</p>
                    <p className="font-body text-xs text-white/80">Data: 2, 3, <strong className="text-orange-300">5</strong>, <strong className="text-orange-300">5</strong>, 7, 8</p>
                    <p className="font-body text-xs text-orange-400 mt-1">Modus = <strong>5</strong></p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-yellow-300 mb-1">Bimodal</p>
                    <p className="font-body text-xs text-white/60 mb-2">Dua nilai terbanyak (sama frekuensi)</p>
                    <p className="font-body text-xs text-white/80">Data: 2, <strong className="text-yellow-300">3</strong>, <strong className="text-yellow-300">3</strong>, <strong className="text-yellow-300">5</strong>, <strong className="text-yellow-300">5</strong>, 8</p>
                    <p className="font-body text-xs text-yellow-400 mt-1">Modus = <strong>3 dan 5</strong></p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-600/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-slate-300 mb-1">Tidak Memiliki Modus</p>
                    <p className="font-body text-xs text-white/60 mb-2">Semua nilai frekuensinya sama</p>
                    <p className="font-body text-xs text-white/80">Data: 2, 3, 5, 7, 8, 9</p>
                    <p className="font-body text-xs text-slate-400 mt-1">Modus = <strong>tidak ada</strong></p>
                  </div>
                </div>

                {/* Visual modus */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">📌 Contoh Mencari Modus</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="font-body text-xs text-white/50 mb-2">Data: 4, 7, 2, 7, 9, 7, 3, 5, 7, 2, 4</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[4,7,2,7,9,7,3,5,7,2,4].map((v,i) => (
                          <div key={i} className={`rounded-md px-2 py-1 text-xs font-bold ${v===7 ? "bg-orange-600/50 text-orange-200 ring-1 ring-orange-500" : "bg-slate-700/50 text-white/60"}`}>{v}</div>
                        ))}
                      </div>
                      <p className="font-body text-xs text-orange-300 font-semibold">Angka 7 muncul 4 kali → Modus = <strong>7</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Cara paling mudah mencari modus data tunggal adalah membuat tabel frekuensi sederhana, lalu lihat nilai mana yang frekuensinya paling tinggi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title="📝 Contoh Soal — Modus Data Tunggal" />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan modus dari data nilai ulangan berikut: 7, 8, 6, 9, 8, 7, 8, 6, 10, 8
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Hitung frekuensi tiap nilai:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <div className="flex flex-wrap gap-3 text-xs">
                          {[["6","2×"],["7","2×"],["8","4×"],["9","1×"],["10","1×"]].map(([v,f]) => (
                            <div key={v} className={`rounded-lg px-3 py-2 text-center border ${v==="8" ? "bg-orange-700/40 border-orange-400 ring-1 ring-orange-400" : "bg-slate-700/40 border-slate-600/40"}`}>
                              <p className={`font-bold text-sm ${v==="8" ? "text-orange-200" : "text-white/70"}`}>{v}</p>
                              <p className={v==="8" ? "text-orange-400" : "text-white/40"}>{f}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p>Nilai 8 muncul paling banyak (4 kali). <strong className="text-primary">Modus = 8</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data hobi 20 siswa: Membaca (6), Olahraga (8), Memasak (3), Menggambar (8), Musik (–). Jika total siswa 30 dan frekuensi Musik belum diketahui, tentukan modus data tersebut!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>Musik = 30 − (6+8+3+8) = 30 − 25 = <strong>5</strong></p>
                        <p>Frekuensi: Membaca=6, Olahraga=8, Memasak=3, Menggambar=8, Musik=5</p>
                        <p className="text-yellow-400 mt-1">Olahraga dan Menggambar sama-sama tertinggi (8 siswa)</p>
                      </div>
                      <p><strong className="text-primary">Modus = Olahraga dan Menggambar (data bimodal)</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data: 5, 8, <InlineMath math="p" />, 8, 12, 5, 15, <InlineMath math="p" />, 8, 5. Jika modus data tersebut adalah 5, tentukan nilai <InlineMath math="p" /> yang mungkin, disertai penjelasan!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Frekuensi nilai yang sudah diketahui: 5 muncul 3×, 8 muncul 3×, 12 muncul 1×, 15 muncul 1×. Nilai <InlineMath math="p" /> muncul 2×.</p>
                      <p>Agar modus = 5, maka frekuensi 5 (=3) harus <strong>lebih besar</strong> dari semua frekuensi lain.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>• Nilai 8 sudah 3× → sama dengan 5. Agar 5 satu-satunya modus, nilai 8 tidak boleh bertambah. Jadi <InlineMath math="p \neq 8" />.</p>
                        <p>• Nilai <InlineMath math="p" /> muncul 2×, sudah lebih kecil dari 3 → oke selama <InlineMath math="p \neq 5" /> dan <InlineMath math="p \neq 8" />.</p>
                      </div>
                      <p><strong className="text-primary">p bisa berupa nilai apapun kecuali 5 dan 8, misalnya p = 3, 7, 10, 11, dll.</strong></p>
                      <p className="text-xs text-white/50">(Jika p=5, maka 5 muncul 5× → modus tetap 5 ✓. Jika p=8, maka 8 muncul 5× → modus menjadi 8, bukan 5 ✗)</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 5: MODUS PADA TABEL DISTRIBUSI FREKUENSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep5" icon={<Target className="w-5 h-5" />} iconColor="text-pink-400" title="📘 Sub-Bab 5: Modus pada Tabel Distribusi Frekuensi" />
            {expandedSections.includes("konsep5") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-pink-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Untuk data berkelompok, kita tidak tahu persis nilai asli yang paling sering muncul. Kita gunakan <strong className="text-pink-300">rumus modus</strong> untuk memperkirakan nilai modus di dalam <strong className="text-pink-300">kelas modus</strong> (kelas dengan frekuensi terbesar).
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center mb-1">Rumus Modus Data Berkelompok</p>
                    <BlockMath math="\text{Mo} = T_b + p \cdot \frac{d_1}{d_1 + d_2}" />
                    <div className="grid grid-cols-2 gap-2 text-xs font-body mt-2">
                      <div className="bg-pink-900/30 rounded p-2">
                        <p className="text-pink-300 font-bold"><InlineMath math="T_b" /></p>
                        <p className="text-white/50">tepi bawah kelas modus = batas bawah − 0,5</p>
                      </div>
                      <div className="bg-pink-900/30 rounded p-2">
                        <p className="text-pink-300 font-bold"><InlineMath math="p" /></p>
                        <p className="text-white/50">panjang kelas</p>
                      </div>
                      <div className="bg-pink-900/30 rounded p-2">
                        <p className="text-pink-300 font-bold"><InlineMath math="d_1" /></p>
                        <p className="text-white/50">selisih frekuensi kelas modus dengan kelas sebelumnya</p>
                      </div>
                      <div className="bg-pink-900/30 rounded p-2">
                        <p className="text-pink-300 font-bold"><InlineMath math="d_2" /></p>
                        <p className="text-white/50">selisih frekuensi kelas modus dengan kelas sesudahnya</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh tabel modus */}
                <div className="bg-slate-800/60 border border-pink-500/20 rounded-xl overflow-hidden">
                  <div className="bg-pink-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-pink-200 uppercase tracking-wide">📋 Contoh Penerapan Rumus Modus</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-2 py-2 text-left text-pink-300 font-bold">Kelas</th>
                        <th className="px-2 py-2 text-center text-white/70">f</th>
                        <th className="px-2 py-2 text-center text-white/70">Keterangan</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["50–59","4",""],
                          ["60–69","8","← kelas sebelum modus (f=8)"],
                          ["70–79","15","← KELAS MODUS (f terbesar)"],
                          ["80–89","9","← kelas sesudah modus (f=9)"],
                          ["90–99","4",""],
                        ].map(([k,f,ket]) => (
                          <tr key={k} className={ket.includes("MODUS") ? "bg-pink-900/20" : "hover:bg-slate-700/20"}>
                            <td className="px-2 py-2 text-white font-semibold">{k}</td>
                            <td className="px-2 py-2 text-center text-green-300">{f}</td>
                            <td className="px-2 py-2 text-pink-400 text-xs">{ket}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="font-body text-xs text-white/50 mb-2">
                      <InlineMath math="T_b = 69{,}5" />, <InlineMath math="p = 10" />, <InlineMath math="d_1 = 15-8 = 7" />, <InlineMath math="d_2 = 15-9 = 6" />
                    </p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\text{Mo} = 69{,}5 + 10 \cdot \frac{7}{7+6} = 69{,}5 + 10 \cdot \frac{7}{13} \approx 69{,}5 + 5{,}38 \approx 74{,}88" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Penting:</strong> <InlineMath math="d_1" /> dan <InlineMath math="d_2" /> selalu positif (selisih, bukan pengurangan bertanda). Kelas modus = kelas dengan frekuensi tertinggi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh5" icon={<Calculator className="w-5 h-5" />} iconColor="text-pink-400" title="📝 Contoh Soal — Modus Tabel Distribusi Frekuensi" />
            {expandedSections.includes("contoh5") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">Hitunglah modus dari tabel berikut!</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-2 py-1 text-left text-white/70">Kelas</th><th className="px-2 py-1 text-center text-white/70">f</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["40–49","5"],["50–59","12"],["60–69","18"],["70–79","10"],["80–89","5"]].map(([k,f]) => <tr key={k}><td className="px-2 py-1 text-white">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Kelas modus = 60–69 (f=18, terbesar). <InlineMath math="d_1 = 18-12=6" />, <InlineMath math="d_2 = 18-10=8" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Mo} = 59{,}5 + 10 \cdot \frac{6}{6+8} = 59{,}5 + 10 \cdot \frac{6}{14} \approx 59{,}5 + 4{,}29 = 63{,}79" />
                      </div>
                      <p><strong className="text-primary">Modus ≈ 63,79</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      Tabel distribusi frekuensi berat badan (kg) 50 siswa:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-2 py-1 text-left text-white/70">Berat (kg)</th><th className="px-2 py-1 text-center text-white/70">f</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["45–49","4"],["50–54","11"],["55–59","20"],["60–64","10"],["65–69","5"]].map(([k,f]) => <tr key={k}><td className="px-2 py-1 text-white">{k}</td><td className="px-2 py-1 text-center text-green-300">{f}</td></tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Kelas modus = 55–59 (f=20). <InlineMath math="T_b = 54{,}5" />, <InlineMath math="p=5" />, <InlineMath math="d_1 = 20-11=9" />, <InlineMath math="d_2 = 20-10=10" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Mo} = 54{,}5 + 5 \cdot \frac{9}{9+10} = 54{,}5 + 5 \cdot \frac{9}{19} \approx 54{,}5 + 2{,}37 = 56{,}87 \text{ kg}" />
                      </div>
                      <p><strong className="text-primary">Modus ≈ 56,87 kg</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari tabel distribusi frekuensi, kelas modus adalah 70–79 dengan <InlineMath math="T_b = 69{,}5" /> dan <InlineMath math="p=10" />. Diketahui frekuensi kelas sebelumnya = 10 dan kelas sesudahnya = 8. Jika modus = 73, tentukan frekuensi kelas modus!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Misalkan frekuensi kelas modus = <InlineMath math="f" />, maka <InlineMath math="d_1 = f-10" /> dan <InlineMath math="d_2 = f-8" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="73 = 69{,}5 + 10 \cdot \frac{f-10}{(f-10)+(f-8)}" />
                        <BlockMath math="3{,}5 = 10 \cdot \frac{f-10}{2f-18}" />
                        <BlockMath math="3{,}5(2f-18) = 10(f-10)" />
                        <BlockMath math="7f - 63 = 10f - 100" />
                        <BlockMath math="37 = 3f \implies f = \frac{37}{3} \approx 12{,}3" />
                      </div>
                      <p>Dibulatkan ke bilangan bulat: <strong className="text-primary">f ≈ 12</strong></p>
                      <p className="text-xs text-white/50">Verifikasi: Mo = 69,5 + 10 × (12−10)/((12−10)+(12−8)) = 69,5 + 10×2/6 ≈ 72,83 ≈ 73 ✓</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-yellow-400" title="🏁 Rangkuman Median & Modus" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-bold text-purple-300 text-center mb-2">⭐ Rumus-Rumus Kunci Median & Modus</p>

                  <div className="space-y-3">
                    <div className="border border-purple-500/30 bg-purple-900/20 rounded-xl p-3">
                      <p className="font-body text-xs font-bold text-purple-300 mb-2">MEDIAN</p>
                      <div className="space-y-2">
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data tunggal — n ganjil:</p>
                          <BlockMath math="\text{Me} = x_{\left(\frac{n+1}{2}\right)}" />
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data tunggal — n genap:</p>
                          <BlockMath math="\text{Me} = \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2}" />
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data berkelompok:</p>
                          <BlockMath math="\text{Me} = T_b + p \cdot \frac{\frac{n}{2} - F}{f}" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-orange-500/30 bg-orange-900/20 rounded-xl p-3">
                      <p className="font-body text-xs font-bold text-orange-300 mb-2">MODUS</p>
                      <div className="space-y-2">
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data tunggal:</p>
                          <p className="font-body text-xs text-orange-300">Nilai dengan frekuensi terbesar</p>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data berkelompok:</p>
                          <BlockMath math="\text{Mo} = T_b + p \cdot \frac{d_1}{d_1+d_2}" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabel perbandingan */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-2 py-2 text-left text-white/50">Ukuran</th>
                        <th className="px-2 py-2 text-center text-cyan-300">Rata-rata</th>
                        <th className="px-2 py-2 text-center text-purple-300">Median</th>
                        <th className="px-2 py-2 text-center text-orange-300">Modus</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        <tr>
                          <td className="px-2 py-2 text-white/70">Dipengaruhi nilai ekstrem?</td>
                          <td className="px-2 py-2 text-center text-red-400">Ya</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-white/70">Perlu diurutkan?</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                          <td className="px-2 py-2 text-center text-red-400">Ya</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-white/70">Selalu ada 1 nilai?</td>
                          <td className="px-2 py-2 text-center text-green-400">Ya</td>
                          <td className="px-2 py-2 text-center text-green-400">Ya</td>
                          <td className="px-2 py-2 text-center text-red-400">Bisa lebih dari 1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Selamat! 🎉</strong> Kamu sudah menguasai Median dan Modus. Lanjutkan ke materi berikutnya: Ukuran Letak Data (Kuartil) untuk belajar cara membagi data menjadi bagian-bagian yang lebih detail! 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedianModusPage;
