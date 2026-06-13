import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const NotasiIlmiahPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1", "contoh1",
    "konsep2", "contoh2",
    "konsep3", "contoh3",
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
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          NOTASI ILMIAH
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Bilangan Berpangkat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ===== PENGANTAR ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🔭 Ketika Angka Terlalu Besar atau Terlalu Kecil..." />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Jarak dari Bumi ke Matahari sekitar <strong className="text-white">150.000.000.000 meter</strong>.
                  Massa sebuah elektron hanya <strong className="text-white">0,000000000000000000000000000000911 kg</strong>.
                  Coba bayangkan betapa ribetnya menulis dan menghitung dengan angka-angka seperti itu setiap hari!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Di sinilah <strong>notasi ilmiah</strong> hadir sebagai penyelamat. Para ilmuwan, insinyur, dan ahli matematika di seluruh dunia menggunakannya untuk menulis bilangan sangat besar atau sangat kecil dengan cara yang ringkas, rapi, dan mudah dihitung. 🚀
                  </p>
                </div>
                {/* Visual skala bilangan */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🌌 PERBANDINGAN SKALA:</p>
                  <div className="space-y-2 font-body text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 shrink-0"></div>
                      <span className="text-white/70">Jarak Bumi–Matahari:</span>
                      <span className="text-red-400 font-semibold">150.000.000.000 m</span>
                      <span className="text-primary mx-1">→</span>
                      <span className="text-green-400 font-semibold"><InlineMath math="1{,}5 \times 10^{11}" /> m</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 shrink-0"></div>
                      <span className="text-white/70">Massa elektron:</span>
                      <span className="text-red-400 font-semibold">0,000...911 kg</span>
                      <span className="text-primary mx-1">→</span>
                      <span className="text-green-400 font-semibold"><InlineMath math="9{,}11 \times 10^{-31}" /> kg</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-400 shrink-0"></div>
                      <span className="text-white/70">Kecepatan cahaya:</span>
                      <span className="text-red-400 font-semibold">300.000.000 m/s</span>
                      <span className="text-primary mx-1">→</span>
                      <span className="text-green-400 font-semibold"><InlineMath math="3 \times 10^{8}" /> m/s</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Notasi ilmiah tidak hanya dipakai di fisika dan kimia — tapi juga di ilmu komputer (ukuran data), astronomi, biologi (ukuran sel), dan keuangan (nilai GDP negara)!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 1: BENTUK UMUM ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Bentuk Umum Notasi Ilmiah" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Notasi ilmiah</strong> adalah cara penulisan bilangan dalam bentuk perkalian antara suatu bilangan dengan pangkat sepuluh.
                    Bentuk umumnya adalah:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="a \times 10^n" />
                    <p className="font-body text-xs text-white/60 mt-2">dengan syarat: <InlineMath math="1 \leq |a| < 10" /> dan <InlineMath math="n \in \mathbb{Z}" /></p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-green-300 mb-1">Koefisien (a)</p>
                      <p className="font-body text-xs text-white/70">Bilangan desimal antara 1 dan 10 (tidak termasuk 10)</p>
                      <p className="font-body text-xs text-green-200 mt-1">Contoh: 1,5 · 2,7 · 9,99</p>
                    </div>
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-blue-300 mb-1">Pangkat (n)</p>
                      <p className="font-body text-xs text-white/70">Bilangan bulat positif, negatif, atau nol</p>
                      <p className="font-body text-xs text-blue-200 mt-1">Positif → besar · Negatif → kecil</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/50 mb-1">Bukan notasi ilmiah</p>
                      <p className="font-body text-sm text-red-400"><InlineMath math="12 \times 10^3" /></p>
                      <p className="font-body text-xs text-white/40">(12 ≥ 10, salah!)</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/50 mb-1">Notasi ilmiah yang benar</p>
                      <p className="font-body text-sm text-green-400"><InlineMath math="1{,}2 \times 10^4" /></p>
                      <p className="font-body text-xs text-white/40">(1 ≤ 1,2 &lt; 10 ✓)</p>
                    </div>
                  </div>
                </div>

                {/* Visual Anatomi */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ANATOMI NOTASI ILMIAH:</p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-green-900/60 to-blue-900/60 border-2 border-green-500/50 rounded-xl px-6 py-5 text-center">
                      <span className="font-display text-4xl font-bold text-yellow-300">3,8</span>
                      <span className="font-display text-3xl font-bold text-white mx-2">×</span>
                      <span className="inline-flex items-start">
                        <span className="font-display text-4xl font-bold text-white">10</span>
                        <span className="font-display text-2xl font-bold text-cyan-400 -mt-2 leading-none">5</span>
                      </span>
                    </div>
                    <div className="flex justify-around w-full text-xs font-body">
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-yellow-400 mx-auto mb-1"></div>
                        <span className="text-yellow-300 font-semibold">KOEFISIEN (a)</span>
                        <br /><span className="text-white/60">1 ≤ a &lt; 10</span>
                      </div>
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-cyan-400 mx-auto mb-1"></div>
                        <span className="text-cyan-300 font-semibold">EKSPONEN (n)</span>
                        <br /><span className="text-white/60">Bilangan bulat</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center w-full">
                      <p className="font-body text-sm text-white/80">
                        <InlineMath math="3{,}8 \times 10^5 = 380.000" />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabel Konversi */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">📊 TABEL NILAI PANGKAT SEPULUH:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-cyan-300 pr-4">Pangkat</th>
                          <th className="text-left py-2 text-green-300 pr-4">Nilai</th>
                          <th className="text-left py-2 text-yellow-300">Nama</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^9" /></td><td className="pr-4">1.000.000.000</td><td>Miliar</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^6" /></td><td className="pr-4">1.000.000</td><td>Juta</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^3" /></td><td className="pr-4">1.000</td><td>Ribu</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^0" /></td><td className="pr-4">1</td><td>Satu</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^{-3}" /></td><td className="pr-4">0,001</td><td>Seperseribu</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^{-6}" /></td><td className="pr-4">0,000001</td><td>Seperjuta</td></tr>
                        <tr><td className="py-1 pr-4"><InlineMath math="10^{-9}" /></td><td className="pr-4">0,000000001</td><td>Sepermiliar</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Ingat:</strong> Pangkat positif → geser koma ke <em>kanan</em> (bilangan makin besar). Pangkat negatif → geser koma ke <em>kiri</em> (bilangan makin kecil). Pangkat = jumlah geseran!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Bentuk Umum Notasi Ilmiah" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Nyatakan bilangan <strong>57.000.000</strong> dalam bentuk notasi ilmiah!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Tentukan koefisien dengan meletakkan koma setelah angka pertama yang bukan nol:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-sm text-white">57.000.000 → <span className="text-yellow-300 font-bold">5,7</span></p>
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung berapa kali koma bergeser ke kiri untuk mendapat koefisien 5,7:</p>
                      <div className="bg-slate-900/50 rounded p-3 text-center">
                        <p className="text-sm text-white/70 mb-1">5<span className="text-cyan-300">7.000.000</span> → bergeser <span className="text-cyan-300 font-bold">7</span> langkah ke kiri</p>
                        <BlockMath math="57.000.000 = 5{,}7 \times 10^7" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="5{,}7 \times 10^7" /></strong></p>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Ubah <InlineMath math="4{,}05 \times 10^{-4}" /> ke bentuk bilangan biasa!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Eksponen negatif (<InlineMath math="n = -4" />) → geser koma ke <em>kiri</em> sebanyak 4 langkah:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p className="text-xs text-white/60">4,05 → geser koma 4 langkah ke kiri → tambah nol di depan:</p>
                        <BlockMath math="4{,}05 \times 10^{-4} = 0{,}000405" />
                      </div>
                      <p><strong className="text-primary">Hasil: 0,000405</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Urutkan bilangan-bilangan berikut dari yang terkecil ke terbesar:<br />
                      <InlineMath math="3{,}2 \times 10^5" />,&nbsp;
                      <InlineMath math="8{,}1 \times 10^4" />,&nbsp;
                      <InlineMath math="2{,}9 \times 10^5" />,&nbsp;
                      <InlineMath math="9{,}9 \times 10^3" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Bandingkan eksponen terlebih dahulu — semakin besar eksponen, semakin besar bilangan:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p><InlineMath math="9{,}9 \times 10^3" /> = 9.900</p>
                        <p><InlineMath math="8{,}1 \times 10^4" /> = 81.000</p>
                        <p><InlineMath math="2{,}9 \times 10^5" /> = 290.000</p>
                        <p><InlineMath math="3{,}2 \times 10^5" /> = 320.000</p>
                      </div>
                      <p><strong>Langkah 2:</strong> Untuk eksponen sama (<InlineMath math="10^5" />), bandingkan koefisiennya: 2,9 &lt; 3,2.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="9{,}9\times10^3 < 8{,}1\times10^4 < 2{,}9\times10^5 < 3{,}2\times10^5" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 2: ATURAN PENULISAN ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 2: Aturan Penulisan Notasi Ilmiah" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ada dua proses utama dalam penulisan notasi ilmiah:
                    mengubah bilangan biasa ke notasi ilmiah, dan sebaliknya.
                    Kunci utamanya adalah <strong className="text-purple-300">menghitung perpindahan titik desimal</strong>.
                  </p>

                  {/* Aturan 1 */}
                  <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="font-body text-xs font-semibold text-purple-300 mb-2">📌 ATURAN 1 — Bilangan Biasa → Notasi Ilmiah</p>
                    <ol className="space-y-2 font-body text-sm text-white/80 list-decimal list-inside">
                      <li>Letakkan titik desimal tepat setelah angka pertama yang bukan nol → inilah koefisien <InlineMath math="a" />.</li>
                      <li>Hitung jumlah langkah perpindahan titik desimal → inilah nilai <InlineMath math="|n|" />.</li>
                      <li>Jika koma bergerak ke <strong className="text-green-300">kiri</strong> → <InlineMath math="n" /> positif. Jika ke <strong className="text-red-400">kanan</strong> → <InlineMath math="n" /> negatif.</li>
                    </ol>
                  </div>

                  {/* Aturan 2 */}
                  <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-fuchsia-500">
                    <p className="font-body text-xs font-semibold text-fuchsia-300 mb-2">📌 ATURAN 2 — Notasi Ilmiah → Bilangan Biasa</p>
                    <ol className="space-y-2 font-body text-sm text-white/80 list-decimal list-inside">
                      <li>Jika <InlineMath math="n > 0" />: geser titik desimal ke <strong className="text-green-300">kanan</strong> sebanyak <InlineMath math="n" /> langkah (tambah nol jika perlu).</li>
                      <li>Jika <InlineMath math="n < 0" />: geser titik desimal ke <strong className="text-red-400">kiri</strong> sebanyak <InlineMath math="|n|" /> langkah (tambah nol di depan jika perlu).</li>
                    </ol>
                  </div>
                </div>

                {/* Visual Diagram Arah Geser */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">↔️ DIAGRAM ARAH PERGESERAN KOMA:</p>
                  <div className="flex items-center justify-center gap-2 text-xs font-body flex-wrap">
                    <div className="bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2 text-center">
                      <p className="text-red-300 font-semibold">n negatif</p>
                      <p className="text-white/60">Bilangan kecil</p>
                      <p className="text-white/60">(0,000...)</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-red-400">← kiri</span>
                      <div className="w-20 h-1 bg-gradient-to-l from-primary to-red-500 rounded"></div>
                      <span className="text-white/40 text-xs">koma bergeser</span>
                      <div className="w-20 h-1 bg-gradient-to-r from-primary to-green-500 rounded"></div>
                      <span className="text-green-400">kanan →</span>
                    </div>
                    <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-center">
                      <p className="text-green-300 font-semibold">n positif</p>
                      <p className="text-white/60">Bilangan besar</p>
                      <p className="text-white/60">(1.000...)</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-900/50 rounded-lg p-3">
                    <div className="flex justify-between text-xs font-body text-white/60">
                      <span><InlineMath math="10^{-6}" /> → 0,000001</span>
                      <span><InlineMath math="10^0" /> → 1</span>
                      <span><InlineMath math="10^6" /> → 1.000.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Cepat:</strong> Untuk bilangan bulat positif besar, nilai <InlineMath math="n" /> = jumlah digit dikurangi 1.
                    Contoh: 5.000.000 punya 7 digit → <InlineMath math="n = 7 - 1 = 6" />, sehingga <InlineMath math="5 \times 10^6" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Aturan Penulisan Notasi Ilmiah" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tuliskan <strong>0,00000072</strong> dalam notasi ilmiah!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Temukan angka pertama yang bukan nol → angka <strong>7</strong>. Koefisien = <strong>7,2</strong>.</p>
                      <p><strong>Langkah 2:</strong> Hitung langkah koma dari 7,2 ke posisi awal:</p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs text-white/70">
                        0,<span className="text-cyan-300">0000007</span>2 → koma bergerak 7 langkah ke <strong className="text-red-400">kanan</strong> → <InlineMath math="n = -7" />
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="0{,}00000072 = 7{,}2 \times 10^{-7}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="7{,}2 \times 10^{-7}" /></strong></p>
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
                      Periksa apakah bilangan-bilangan berikut sudah dalam bentuk notasi ilmiah yang benar. Jika belum, perbaiki!<br />
                      a) <InlineMath math="0{,}35 \times 10^6" />&nbsp;&nbsp; b) <InlineMath math="15 \times 10^{-3}" />&nbsp;&nbsp; c) <InlineMath math="6{,}02 \times 10^{23}" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>a)</strong> <InlineMath math="0{,}35 \times 10^6" /> → koefisien 0,35 &lt; 1, <span className="text-red-400">salah!</span></p>
                        <p className="pl-3">Perbaikan: <InlineMath math="0{,}35 = 3{,}5 \times 10^{-1}" /></p>
                        <BlockMath math="0{,}35 \times 10^6 = 3{,}5 \times 10^{-1} \times 10^6 = 3{,}5 \times 10^5" />
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>b)</strong> <InlineMath math="15 \times 10^{-3}" /> → koefisien 15 ≥ 10, <span className="text-red-400">salah!</span></p>
                        <p className="pl-3">Perbaikan: <InlineMath math="15 = 1{,}5 \times 10^1" /></p>
                        <BlockMath math="15 \times 10^{-3} = 1{,}5 \times 10^1 \times 10^{-3} = 1{,}5 \times 10^{-2}" />
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><strong>c)</strong> <InlineMath math="6{,}02 \times 10^{23}" /> → koefisien 6,02: 1 ≤ 6,02 &lt; 10, <span className="text-green-400">benar! ✓</span></p>
                        <p className="text-xs text-white/50 mt-1">(Ini adalah bilangan Avogadro yang terkenal dalam kimia!)</p>
                      </div>
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
                      Kecepatan cahaya adalah <InlineMath math="3 \times 10^8" /> m/s. Satu tahun cahaya adalah jarak yang ditempuh cahaya dalam 1 tahun. Nyatakan satu tahun cahaya dalam meter menggunakan notasi ilmiah!<br />
                      <span className="text-white/50 text-xs">(1 tahun = 365 hari, 1 hari = 86.400 detik)</span>
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung jumlah detik dalam 1 tahun:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="365 \times 86.400 = 31.536.000 \approx 3{,}1536 \times 10^7 \text{ detik}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung jarak = kecepatan × waktu:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="d = (3 \times 10^8) \times (3{,}1536 \times 10^7)" />
                        <BlockMath math="= (3 \times 3{,}1536) \times 10^{8+7}" />
                        <BlockMath math="= 9{,}46 \times 10^{15} \text{ meter}" />
                      </div>
                      <p><strong className="text-primary">1 tahun cahaya ≈ <InlineMath math="9{,}46 \times 10^{15}" /> meter</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 3: OPERASI MATEMATIKA ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Sub-Bab 3: Operasi Matematika pada Notasi Ilmiah" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Melakukan operasi hitung pada notasi ilmiah mengikuti aturan <strong className="text-orange-300">sifat-sifat pangkat</strong>.
                    Caranya: operasikan koefisien secara terpisah, lalu operasikan pangkat sepuluhnya.
                  </p>

                  {/* Perkalian */}
                  <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-orange-500">
                    <p className="font-body text-xs font-semibold text-orange-300 mb-2">✖️ PERKALIAN</p>
                    <BlockMath math="(a \times 10^m) \times (b \times 10^n) = (a \times b) \times 10^{m+n}" />
                    <p className="font-body text-xs text-white/60">Koefisien dikali, eksponen dijumlahkan.</p>
                  </div>

                  {/* Pembagian */}
                  <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-yellow-500">
                    <p className="font-body text-xs font-semibold text-yellow-300 mb-2">➗ PEMBAGIAN</p>
                    <BlockMath math="\frac{a \times 10^m}{b \times 10^n} = \frac{a}{b} \times 10^{m-n}" />
                    <p className="font-body text-xs text-white/60">Koefisien dibagi, eksponen dikurangi.</p>
                  </div>

                  {/* Penjumlahan / Pengurangan */}
                  <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-cyan-500">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-2">➕➖ PENJUMLAHAN & PENGURANGAN</p>
                    <p className="font-body text-sm text-white/80">Samakan eksponen terlebih dahulu, baru operasikan koefisiennya!</p>
                    <div className="mt-2">
                      <BlockMath math="(a \times 10^n) \pm (b \times 10^n) = (a \pm b) \times 10^n" />
                    </div>
                    <p className="font-body text-xs text-white/60">Jika eksponen berbeda, ubah salah satunya agar eksponen sama.</p>
                  </div>

                  {/* Pangkat */}
                  <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-green-500">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">🔺 PERPANGKATAN</p>
                    <BlockMath math="(a \times 10^m)^n = a^n \times 10^{m \cdot n}" />
                    <p className="font-body text-xs text-white/60">Koefisien dipangkatkan, eksponen dikali.</p>
                  </div>
                </div>

                {/* Visual Langkah Perkalian */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔄 ALUR OPERASI PERKALIAN:</p>
                  <div className="flex flex-col gap-2 items-center font-body text-sm">
                    <div className="flex gap-2 items-center flex-wrap justify-center">
                      <div className="bg-orange-900/40 border border-orange-500/40 rounded px-3 py-2">
                        <span className="text-yellow-300">a</span> × <span className="text-cyan-300">10<sup>m</sup></span>
                      </div>
                      <span className="text-white text-lg">×</span>
                      <div className="bg-orange-900/40 border border-orange-500/40 rounded px-3 py-2">
                        <span className="text-yellow-300">b</span> × <span className="text-cyan-300">10<sup>n</sup></span>
                      </div>
                    </div>
                    <div className="text-primary text-xl">↓</div>
                    <div className="flex gap-3 items-center flex-wrap justify-center">
                      <div className="bg-yellow-900/40 border border-yellow-500/40 rounded px-3 py-2 text-center">
                        <p className="text-xs text-yellow-300">Koefisien</p>
                        <p className="text-white"><InlineMath math="a \times b" /></p>
                      </div>
                      <span className="text-white">×</span>
                      <div className="bg-cyan-900/40 border border-cyan-500/40 rounded px-3 py-2 text-center">
                        <p className="text-xs text-cyan-300">Eksponen</p>
                        <p className="text-white"><InlineMath math="10^{m+n}" /></p>
                      </div>
                    </div>
                    <div className="text-primary text-xl">↓</div>
                    <div className="bg-green-900/40 border border-green-500/40 rounded px-4 py-2">
                      <p className="text-green-300 text-center text-sm">Periksa: apakah koefisien masih 1 ≤ a &lt; 10?</p>
                      <p className="text-white/60 text-xs text-center">Jika tidak, sesuaikan eksponen!</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Perhatian:</strong> Setelah operasi, selalu periksa apakah hasilnya masih berbentuk notasi ilmiah yang valid! Jika koefisien &lt; 1 atau ≥ 10, lakukan penyesuaian eksponen.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title="📝 Contoh Soal — Operasi pada Notasi Ilmiah" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Hitunglah: <InlineMath math="(2{,}5 \times 10^4) \times (4 \times 10^3)" />
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Kalikan koefisien, jumlahkan eksponen:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="(2{,}5 \times 4) \times 10^{4+3} = 10 \times 10^7" />
                      </div>
                      <p><strong>Langkah 2:</strong> Koefisien = 10, belum valid (10 ≥ 10). Sesuaikan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="10 \times 10^7 = 1{,}0 \times 10^1 \times 10^7 = 1{,}0 \times 10^8" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="1{,}0 \times 10^8" /></strong></p>
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
                      Hitunglah: <InlineMath math="(6{,}4 \times 10^7) + (3{,}2 \times 10^6)" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Eksponen berbeda (7 dan 6). Samakan ke eksponen terbesar (<InlineMath math="10^7" />):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="3{,}2 \times 10^6 = 0{,}32 \times 10^7" />
                      </div>
                      <p><strong>Langkah 2:</strong> Jumlahkan koefisien:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="(6{,}4 + 0{,}32) \times 10^7 = 6{,}72 \times 10^7" />
                      </div>
                      <p>Koefisien 6,72 sudah valid (1 ≤ 6,72 &lt; 10). ✓</p>
                      <p><strong className="text-primary">Hasil: <InlineMath math="6{,}72 \times 10^7" /></strong></p>
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
                      Massa planet A adalah <InlineMath math="8{,}4 \times 10^{24}" /> kg dan massa planet B adalah <InlineMath math="2{,}1 \times 10^{22}" /> kg. Hitunglah:
                      <br />a) Berapa kali lipat massa planet A dibanding planet B?
                      <br />b) Total massa kedua planet (dalam notasi ilmiah)?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Bagian a) — Pembagian:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\frac{8{,}4 \times 10^{24}}{2{,}1 \times 10^{22}} = \frac{8{,}4}{2{,}1} \times 10^{24-22} = 4 \times 10^2 = 400" />
                      </div>
                      <p><strong className="text-green-300">Planet A 400 kali lebih masif dari planet B.</strong></p>

                      <p><strong>Bagian b) — Penjumlahan:</strong></p>
                      <p>Samakan eksponen ke <InlineMath math="10^{24}" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="2{,}1 \times 10^{22} = 0{,}021 \times 10^{24}" />
                        <BlockMath math="(8{,}4 + 0{,}021) \times 10^{24} = 8{,}421 \times 10^{24} \text{ kg}" />
                      </div>
                      <p><strong className="text-primary">Total massa = <InlineMath math="8{,}421 \times 10^{24}" /> kg</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Rangkuman */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-cyan-300 text-center">🌟 RANGKUMAN MATERI</p>
            <div className="space-y-2 font-body text-xs text-white/80">
              <p>✅ <strong>Bentuk notasi ilmiah:</strong> <InlineMath math="a \times 10^n" /> dengan <InlineMath math="1 \leq a < 10" /> dan <InlineMath math="n" /> bilangan bulat</p>
              <p>✅ <strong>Bilangan besar</strong> (≥ 10) → eksponen <strong className="text-green-400">positif</strong> &nbsp;|&nbsp; <strong>Bilangan kecil</strong> (&lt; 1) → eksponen <strong className="text-red-400">negatif</strong></p>
              <p>✅ <strong>Perkalian/pembagian:</strong> operasi koefisien & eksponen <em>secara terpisah</em></p>
              <p>✅ <strong>Penjumlahan/pengurangan:</strong> samakan eksponen terlebih dahulu, baru hitung koefisien</p>
              <p>✅ <strong>Membandingkan:</strong> lihat eksponen dulu; jika sama, baru bandingkan koefisiennya</p>
            </div>
          </div>

          {/* Tips dan Trik */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/40 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-5 py-4 flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-display text-base font-bold text-yellow-300 leading-tight">Geser Koma, Ubah Dunia!</p>
                <p className="font-body text-xs text-yellow-200/70">Tips & trik baca dan hitung notasi ilmiah dengan cepat</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3 font-body text-sm text-white/80">
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Kanan = positif, Kiri = negatif.</strong> Geser koma ke kanan → eksponen bertambah (bilangan membesar). Geser ke kiri → eksponen berkurang (bilangan mengecil). Hitung jumlah geserannya!</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Koefisien wajib antara 1 dan 10!</strong> Jika hasil operasimu menghasilkan koefisien di luar rentang itu (misal <InlineMath math="15 \times 10^3" />), sesuaikan: <InlineMath math="= 1{,}5 \times 10^4" />.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Eksponen berbeda? Samakan dulu.</strong> Untuk penjumlahan/pengurangan, ubah ke eksponen yang lebih besar baru hitung — hindari mengubah ke eksponen kecil agar koefisien tidak jadi angka panjang.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Bandingkan eksponen dulu.</strong> Saat membandingkan dua notasi ilmiah, cukup lihat eksponen — yang eksponennya lebih besar pasti bilangan yang lebih besar, tanpa perlu hitung detailnya.</p>
              </div>
            </div>
          </div>

          {/* Kesimpulan */}
          <div className="bg-gradient-to-br from-blue-500/15 to-indigo-500/15 border border-blue-400/40 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/25 to-indigo-500/25 px-5 py-4 flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-display text-base font-bold text-blue-300 leading-tight">Kesimpulan</p>
                <p className="font-body text-xs text-blue-200/70">Bahasa para ilmuwan kini ada di tanganmu!</p>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4 font-body text-sm text-white/85">
              <p>Hebat! Kamu kini bisa berbicara dalam <strong className="text-blue-300">bahasa para ilmuwan dan astronom</strong>. Notasi ilmiah adalah cara paling efisien untuk menuliskan bilangan yang terlalu besar atau terlalu kecil untuk ditulis biasa.</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg px-3 py-2">
                  <span className="text-blue-400">⭐</span>
                  <span>Kamu bisa mengubah bilangan besar/kecil ke bentuk <InlineMath math="a \times 10^n" /> dengan tepat</span>
                </div>
                <div className="flex items-center gap-2 bg-indigo-500/10 rounded-lg px-3 py-2">
                  <span className="text-indigo-400">⭐</span>
                  <span>Kamu menguasai operasi perkalian, pembagian, penjumlahan, dan pengurangan notasi ilmiah</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/10 rounded-lg px-3 py-2">
                  <span className="text-purple-400">⭐</span>
                  <span>Kamu bisa membandingkan besaran astronomi dan ilmu pengetahuan dengan percaya diri</span>
                </div>
              </div>
              <p className="text-center text-blue-300 font-semibold text-sm pt-1">
                🌟 Dari massa elektron hingga jarak bintang — notasi ilmiah membuat segalanya terukur. Kamu luar biasa! 🌟
              </p>
            </div>
          </div>

          {/* Tombol Kembali */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bilangan-berpangkat"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              Kembali ke Bilangan Berpangkat
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotasiIlmiahPage;
