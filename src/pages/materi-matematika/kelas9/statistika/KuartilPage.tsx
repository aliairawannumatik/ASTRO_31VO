import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import KuartilAnimasiMateri from "@/components/KuartilAnimasiMateri";

const KuartilPage = () => {
  const navigate = useNavigate();
  const expandedSections = ["intro", "konsep1", "contoh1", "konsep2", "contoh2", "rangkuman"];

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          UKURAN LETAK DATA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Kuartil Data</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Kuartil?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kamu sudah kenal dengan <strong className="text-cyan-300">rata-rata, median, dan modus</strong> sebagai ukuran pemusatan data. Sekarang, kita naik level ke <strong className="text-cyan-300">ukuran letak data</strong> — yaitu nilai-nilai yang membagi data menjadi bagian-bagian yang sama besar setelah data diurutkan.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-violet-900/40 border border-violet-500/40 rounded-xl p-4">
                    <p className="font-display text-base font-bold text-violet-300 mb-2">Kuartil (Q)</p>
                    <p className="font-body text-sm text-white/70">Nilai yang membagi data terurut menjadi <strong className="text-violet-200">4 bagian</strong> yang sama banyak. Ada tiga kuartil: <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />.</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-wide">📐 Ilustrasi Pembagian Kuartil</p>
                  <div className="flex items-center gap-1 justify-center flex-wrap">
                    {["25%", "Q₁", "25%", "Q₂", "25%", "Q₃", "25%"].map((v, i) => (
                      <div
                        key={i}
                        className={`rounded-lg px-3 py-2 text-center text-xs font-bold
                          ${v.startsWith("Q") ? "bg-violet-600/70 text-white border border-violet-400/60 min-w-[40px]" : "bg-slate-700/60 text-white/50 min-w-[48px]"}`}
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-1">
                    {[
                      { q: "Q₁", label: "Kuartil Bawah", desc: "25% data di bawahnya", color: "bg-green-900/40 border-green-500/40 text-green-300" },
                      { q: "Q₂", label: "Kuartil Tengah", desc: "Sama dengan Median (50%)", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
                      { q: "Q₃", label: "Kuartil Atas", desc: "75% data di bawahnya", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
                    ].map(({ q, label, desc, color }) => (
                      <div key={q} className={`border ${color} rounded-xl p-3 text-center`}>
                        <p className="font-display text-xl font-bold mb-1">{q}</p>
                        <p className="font-body text-xs font-bold text-white mb-1">{label}</p>
                        <p className="font-body text-xs text-white/50">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Langkah Wajib Pertama:</strong> Data harus <strong>diurutkan dari terkecil ke terbesar</strong> sebelum menghitung kuartil apapun!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: KUARTIL DATA TUNGGAL ────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Kuartil Data Tunggal" />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Cara Menentukan Kuartil Data Tunggal</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Cukup dengan <strong className="text-green-300">4 langkah mudah</strong> — urutkan data, cari <InlineMath math="Q_2" /> dahulu, lalu tentukan <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" /> sebagai median kaum bawah dan kaum atas.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    {[
                      { step: "1", title: "Urutkan data", desc: "Susun semua data dari nilai terkecil ke terbesar.", color: "border-slate-500/40 text-slate-300" },
                      { step: "2", title: "Cari Q₂ terlebih dahulu", desc: "Q₂ = median seluruh data. Jika n ganjil → nilai ke-½(n+1). Jika n genap → rata-rata nilai ke-n/2 dan ke-(n/2+1).", color: "border-cyan-500/40 text-cyan-300" },
                      { step: "3", title: "Bagi data menjadi dua kaum", desc: "Kaum Bawah = semua data di bawah Q₂. Kaum Atas = semua data di atas Q₂. (Jika n ganjil, nilai Q₂ tidak dimasukkan ke kaum manapun.)", color: "border-violet-500/40 text-violet-300" },
                      { step: "4", title: "Cari Q₁ dan Q₃", desc: "Q₁ = median Kaum Bawah. Q₃ = median Kaum Atas.", color: "border-green-500/40 text-green-300" },
                    ].map(({ step, title, desc, color }) => (
                      <div key={step} className={`border ${color} rounded-lg p-3 flex items-start gap-3 bg-slate-800/40`}>
                        <span className={`font-display font-bold text-sm min-w-[20px] ${color.split(" ")[1]}`}>{step}.</span>
                        <div>
                          <p className={`font-body text-xs font-bold ${color.split(" ")[1]}`}>{title}</p>
                          <p className="font-body text-xs text-white/65 mt-1 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ilustrasi Visual — n ganjil */}
                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">📌 Ilustrasi A — Data n = 9 (Ganjil)</p>
                  <p className="font-body text-xs text-white/60">Data terurut: 2, 4, 6, 8, <span className="text-cyan-300 font-bold">10</span>, 12, 14, 16, 18</p>

                  {/* Langkah 2: Q2 */}
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-2">Langkah 2 — Cari Q₂</p>
                    <p className="font-body text-xs text-white/70">n = 9 (ganjil) → Q₂ = data ke-5 = <strong className="text-cyan-300">10</strong></p>
                  </div>

                  {/* Langkah 3: Split */}
                  <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-violet-300 mb-1">Langkah 3 — Bagi dua kaum (Q₂ tidak masuk keduanya)</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex gap-1 flex-wrap">
                        {["2","4","6","8"].map(v => (
                          <div key={v} className="bg-green-900/50 border border-green-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-green-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-cyan-700/60 border border-cyan-400/80 rounded-lg px-2.5 py-1.5 text-center">
                        <p className="text-cyan-200 font-bold text-xs">10</p>
                        <p className="text-cyan-400 text-[10px]">Q₂</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {["12","14","16","18"].map(v => (
                          <div key={v} className="bg-orange-900/50 border border-orange-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-orange-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs font-body mt-1">
                      <span className="text-green-400 font-semibold">← Kaum Bawah (4 data)</span>
                      <span className="text-orange-400 font-semibold ml-auto">Kaum Atas (4 data) →</span>
                    </div>
                  </div>

                  {/* Langkah 4: Q1 Q3 */}
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <BlockMath math="Q_1 = \text{median kaum bawah} = \frac{4+6}{2} = 5" />
                    <BlockMath math="Q_2 = 10" />
                    <BlockMath math="Q_3 = \text{median kaum atas} = \frac{14+16}{2} = 15" />
                  </div>
                </div>

                {/* Ilustrasi Visual — n genap */}
                <div className="bg-slate-800/60 border border-indigo-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-indigo-300 uppercase tracking-wide">📌 Ilustrasi B — Data n = 8 (Genap)</p>
                  <p className="font-body text-xs text-white/60">Data terurut: 4, 6, 7, <span className="text-cyan-300 font-bold">8</span>, <span className="text-cyan-300 font-bold">9</span>, 10, 11, 13</p>

                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-1">Langkah 2 — Cari Q₂</p>
                    <p className="font-body text-xs text-white/70">n = 8 (genap) → Q₂ = rata-rata data ke-4 dan ke-5 = <InlineMath math="\frac{8+9}{2} = 8{,}5" /></p>
                  </div>

                  <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-violet-300 mb-1">Langkah 3 — Bagi dua kaum (n genap → langsung belah di tengah)</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex gap-1">
                        {["4","6","7","8"].map(v => (
                          <div key={v} className="bg-green-900/50 border border-green-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-green-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-l-2 border-cyan-500/60 self-stretch mx-1" />
                      <div className="flex gap-1">
                        {["9","10","11","13"].map(v => (
                          <div key={v} className="bg-orange-900/50 border border-orange-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-orange-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs font-body mt-1">
                      <span className="text-green-400 font-semibold">← Kaum Bawah (4 data)</span>
                      <span className="text-orange-400 font-semibold ml-auto">Kaum Atas (4 data) →</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <BlockMath math="Q_1 = \frac{6+7}{2} = 6{,}5" />
                    <BlockMath math="Q_2 = 8{,}5" />
                    <BlockMath math="Q_3 = \frac{10+11}{2} = 10{,}5" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Kunci Ingat:</strong> Selalu cari <InlineMath math="Q_2" /> dulu → pisahkan menjadi Kaum Bawah dan Kaum Atas → cari median masing-masing kaum untuk mendapat <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KALKULATOR KUARTIL INTERAKTIF ───────────────────────── */}
          <KuartilAnimasiMateri />

          {/* ── CONTOH SOAL SUB-BAB 1 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title="📝 Contoh Soal — Kuartil Data Tunggal" />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data nilai ulangan 9 siswa adalah: 5, 7, 4, 8, 6, 9, 3, 7, 10.<br />
                      Tentukan nilai <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong className="text-white">Langkah 1 — Urutkan data:</strong></p>
                      <div className="flex gap-2 flex-wrap">
                        {["3","4","5","6","7","7","8","9","10"].map((v, i) => (
                          <div key={i} className={`rounded-lg px-3 py-2 text-center border font-bold text-sm
                            ${i === 4 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" : "bg-slate-700/60 border-green-500/30 text-green-300"}`}>
                            {v}
                            {i === 4 && <div className="text-cyan-400 text-[10px] mt-0.5">Q₂</div>}
                          </div>
                        ))}
                      </div>
                      <p className="text-white/50 text-xs">n = 9 (ganjil)</p>

                      <p><strong className="text-white">Langkah 2 — Cari Q₂:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-xs text-white/60 mb-1">n = 9 (ganjil) → Q₂ = data ke-5</p>
                        <BlockMath math="Q_2 = 7" />
                      </div>

                      <p><strong className="text-white">Langkah 3 — Bagi dua kaum (Q₂ tidak masuk):</strong></p>
                      <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 rounded p-3">
                        <div className="space-y-1">
                          <p className="text-xs text-green-400 font-semibold">Kaum Bawah:</p>
                          <div className="flex gap-1">
                            {["3","4","5","6"].map(v => (
                              <div key={v} className="bg-green-900/50 border border-green-500/40 rounded px-2 py-1 text-green-300 font-bold text-xs">{v}</div>
                            ))}
                          </div>
                        </div>
                        <div className="mx-2 text-cyan-400 font-bold text-xs">| Q₂=7 |</div>
                        <div className="space-y-1">
                          <p className="text-xs text-orange-400 font-semibold">Kaum Atas:</p>
                          <div className="flex gap-1">
                            {["7","8","9","10"].map(v => (
                              <div key={v} className="bg-orange-900/50 border border-orange-500/40 rounded px-2 py-1 text-orange-300 font-bold text-xs">{v}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p><strong className="text-white">Langkah 4 — Cari Q₁ dan Q₃:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p className="text-xs text-white/60">Q₁ = median kaum bawah {"{3, 4, 5, 6}"} → rata-rata data ke-2 dan ke-3</p>
                        <BlockMath math="Q_1 = \frac{4 + 5}{2} = 4{,}5" />
                        <p className="text-xs text-white/60">Q₃ = median kaum atas {"{7, 8, 9, 10}"} → rata-rata data ke-2 dan ke-3</p>
                        <BlockMath math="Q_3 = \frac{8 + 9}{2} = 8{,}5" />
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                        <p><strong className="text-green-300">Hasil: </strong><InlineMath math="Q_1 = 4{,}5" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8{,}5" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data berat badan (kg) 12 siswa: 45, 50, 52, 48, 60, 55, 47, 63, 58, 49, 54, 61.<br />
                      Tentukan <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Urutkan data (n = 12, genap):</strong></p>
                      <div className="flex gap-1 flex-wrap">
                        {["45","47","48","49","50","52","54","55","58","60","61","63"].map((v, i) => (
                          <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                            ${i < 6 ? "bg-green-900/40 border-green-500/40 text-green-300" : "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                            {v}
                          </div>
                        ))}
                      </div>

                      <p><strong>Langkah 2 — Cari Q₂:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-xs text-white/60 mb-1">n = 12 (genap) → Q₂ = rata-rata data ke-6 dan ke-7</p>
                        <BlockMath math="Q_2 = \frac{52 + 54}{2} = 53" />
                      </div>

                      <p><strong>Langkah 3 — Bagi dua kaum (n genap → belah tepat di tengah):</strong></p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                          <p className="text-green-400 font-bold mb-1">Kaum Bawah (6 data):</p>
                          <p className="text-white/70">45, 47, 48, 49, 50, 52</p>
                        </div>
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                          <p className="text-orange-400 font-bold mb-1">Kaum Atas (6 data):</p>
                          <p className="text-white/70">54, 55, 58, 60, 61, 63</p>
                        </div>
                      </div>

                      <p><strong>Langkah 4 — Cari Q₁ dan Q₃:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p className="text-xs text-white/60">Q₁ = median kaum bawah {"{45,47,48,49,50,52}"} → rata-rata data ke-3 dan ke-4</p>
                        <BlockMath math="Q_1 = \frac{48 + 49}{2} = 48{,}5" />
                        <p className="text-xs text-white/60">Q₃ = median kaum atas {"{54,55,58,60,61,63}"} → rata-rata data ke-3 dan ke-4</p>
                        <BlockMath math="Q_3 = \frac{58 + 60}{2} = 59" />
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                        <p><strong className="text-yellow-300">Hasil: </strong><InlineMath math="Q_1 = 48{,}5" /> kg · <InlineMath math="Q_2 = 53" /> kg · <InlineMath math="Q_3 = 59" /> kg</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data nilai ujian 15 siswa: 72, 65, 80, 88, 74, 91, 69, 77, 83, 95, 70, 86, 78, 63, 82.<br />
                      Tentukan <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, <InlineMath math="Q_3" />, lalu hitung berapa siswa yang nilainya berada di antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Urutkan data (n = 15, ganjil):</strong></p>
                      <div className="flex gap-1 flex-wrap">
                        {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => (
                          <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                            ${i === 7 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" :
                              i < 7 ? "bg-green-900/40 border-green-500/40 text-green-300" :
                              "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                            {v}
                            {i === 7 && <div className="text-cyan-400 text-[9px] mt-0.5">Q₂</div>}
                          </div>
                        ))}
                      </div>

                      <p><strong>Langkah 2 — Cari Q₂:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-xs text-white/60 mb-1">n = 15 (ganjil) → Q₂ = data ke-8</p>
                        <BlockMath math="Q_2 = 78" />
                      </div>

                      <p><strong>Langkah 3 — Bagi dua kaum (Q₂ = 78 tidak masuk):</strong></p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                          <p className="text-green-400 font-bold mb-1">Kaum Bawah (7 data):</p>
                          <p className="text-white/70">63, 65, 69, 70, 72, 74, 77</p>
                        </div>
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                          <p className="text-orange-400 font-bold mb-1">Kaum Atas (7 data):</p>
                          <p className="text-white/70">80, 82, 83, 86, 88, 91, 95</p>
                        </div>
                      </div>

                      <p><strong>Langkah 4 — Cari Q₁ dan Q₃:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p className="text-xs text-white/60">Q₁ = median kaum bawah (7 data, ganjil) → data ke-4</p>
                        <BlockMath math="Q_1 = 70" />
                        <p className="text-xs text-white/60">Q₃ = median kaum atas (7 data, ganjil) → data ke-4</p>
                        <BlockMath math="Q_3 = 86" />
                      </div>

                      <p><strong>Langkah 5 — Hitung siswa di antara Q₁ dan Q₃:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/60">Cari data yang memenuhi <InlineMath math="70 < x < 86" />:</p>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => {
                            const n = parseFloat(v);
                            const inRange = n > 70 && n < 86;
                            return (
                              <div key={i} className={`rounded px-2 py-1 text-xs font-bold border
                                ${inRange ? "bg-red-700/50 border-red-400/60 text-white" : "bg-slate-700/60 border-slate-500/40 text-white/40"}`}>
                                {v}
                              </div>
                            );
                          })}
                        </div>
                        <BlockMath math="\text{Banyak siswa} = 7 \text{ orang}" />
                      </div>
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                        <p><strong className="text-red-300">Jawaban: </strong><InlineMath math="Q_1=70" /> · <InlineMath math="Q_2=78" /> · <InlineMath math="Q_3=86" /><br />
                        <strong>7 siswa</strong> nilainya berada di antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: KUARTIL TABEL DISTRIBUSI FREKUENSI TUNGGAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title="📘 Sub-Bab 2: Kuartil pada Tabel Distribusi Frekuensi Tunggal" />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika data disajikan dalam <strong className="text-blue-300">tabel distribusi frekuensi tunggal</strong>, kita tidak perlu menuliskan seluruh data satu per satu. Cukup gunakan <strong className="text-blue-300">frekuensi kumulatif</strong> untuk menemukan posisi letak kuartil.
                  </p>

                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center mb-2">Langkah Mencari Kuartil dari Tabel Frekuensi Tunggal</p>
                    <div className="space-y-2">
                      {[
                        { step: "1", text: "Hitung total frekuensi n = Σfᵢ", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                        { step: "2", text: "Tentukan posisi kuartil: Q₁ di posisi ¼(n+1), Q₂ di posisi ½(n+1), Q₃ di posisi ¾(n+1)", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                        { step: "3", text: "Buat kolom frekuensi kumulatif (FK) dari baris paling atas", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                        { step: "4", text: "Temukan nilai data yang FK-nya pertama kali ≥ posisi kuartil", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                      ].map(({ step, text, color }) => (
                        <div key={step} className={`border ${color} rounded-lg p-3 flex items-start gap-3`}>
                          <span className="font-display font-bold text-blue-400 text-sm min-w-[20px]">{step}.</span>
                          <p className="font-body text-xs text-blue-100">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contoh Tabel Distribusi Frekuensi Tunggal */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                  <div className="bg-blue-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">📋 Contoh Tabel Distribusi Frekuensi Tunggal — Nilai Ujian 40 Siswa</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/40">
                          <th className="px-3 py-2 text-left text-blue-300 font-bold">Nilai (x)</th>
                          <th className="px-3 py-2 text-center text-white/70">Frekuensi (f)</th>
                          <th className="px-3 py-2 text-center text-yellow-300 font-bold">FK (Kumulatif)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["60", "4", "4"],
                          ["65", "6", "10"],
                          ["70", "8", "18"],
                          ["75", "10", "28"],
                          ["80", "7", "35"],
                          ["85", "5", "40"],
                        ].map(([x, f, fk]) => (
                          <tr key={x} className={`hover:bg-slate-700/20
                            ${parseInt(fk) >= 10 && parseInt(fk) - parseInt(f) < 10 ? "bg-green-900/20" : ""}
                            ${parseInt(fk) >= 20 && parseInt(fk) - parseInt(f) < 20 && parseInt(fk) > 10 ? "bg-cyan-900/20" : ""}
                            ${parseInt(fk) >= 30 && parseInt(fk) - parseInt(f) < 30 && parseInt(fk) > 20 ? "bg-orange-900/20" : ""}`}>
                            <td className="px-3 py-2 text-white font-semibold">{x}</td>
                            <td className="px-3 py-2 text-center text-green-300">{f}</td>
                            <td className="px-3 py-2 text-center text-yellow-300 font-bold">{fk}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-700/30 border-t border-slate-500/50">
                          <td className="px-3 py-2 text-white font-bold">Total</td>
                          <td className="px-3 py-2 text-center text-green-400 font-bold">40</td>
                          <td className="px-3 py-2 text-center text-yellow-400 font-bold">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-white/50">n = 40, posisi kuartil:</p>
                      <BlockMath math="Q_1 \text{ di posisi } \frac{1(40+1)}{4} = 10{,}25 \Rightarrow \text{FK pertama} \geq 10{,}25 \text{ adalah FK}=18 \Rightarrow Q_1 = 70" />
                      <BlockMath math="Q_2 \text{ di posisi } \frac{2(40+1)}{4} = 20{,}5 \Rightarrow \text{FK pertama} \geq 20{,}5 \text{ adalah FK}=28 \Rightarrow Q_2 = 75" />
                      <BlockMath math="Q_3 \text{ di posisi } \frac{3(40+1)}{4} = 30{,}75 \Rightarrow \text{FK pertama} \geq 30{,}75 \text{ adalah FK}=35 \Rightarrow Q_3 = 80" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Nilai kuartil adalah nilai <InlineMath math="x" /> yang memiliki FK pertama kali <strong>sama dengan atau melebihi</strong> posisi kuartil yang dicari.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 2 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Kuartil Tabel Distribusi Frekuensi Tunggal" />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-3">Diagram batang berikut menunjukkan nilai ulangan harian 20 siswa. Tentukan <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!</p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">Nilai Ulangan Harian 20 Siswa</p>
                      <svg viewBox="0 0 280 190" className="w-full max-w-xs mx-auto" aria-label="Diagram batang nilai ulangan">
                        {[0,2,4,6].map(v => {
                          const y = 148 - v * (128/6);
                          return (
                            <g key={v}>
                              <line x1="32" y1={y} x2="272" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="27" y={y+4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        <line x1="32" y1="15" x2="32" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        <line x1="32" y1="148" x2="272" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {[{val:5,f:2},{val:6,f:4},{val:7,f:6},{val:8,f:5},{val:9,f:3}].map(({val,f},i) => {
                          const slotW = 48; const barW = 32;
                          const x = 32 + i*slotW + (slotW-barW)/2;
                          const barH = f*(128/6); const y = 148-barH;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH} fill="rgba(34,197,94,0.65)" stroke="rgba(74,222,128,0.8)" strokeWidth="1" rx="2"/>
                              <text x={x+barW/2} y={y-4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#86efac">{f}</text>
                              <text x={x+barW/2} y="162" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        <text x="152" y="178" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">Nilai</text>
                        <text x="10" y="82" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,82)">Frekuensi</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat kolom frekuensi kumulatif (n = 20):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Nilai</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["5","2","2"],["6","4","6"],["7","6","12"],["8","5","17"],["9","3","20"]].map(([v,f,fk]) => (
                              <tr key={v} className={parseInt(fk) === 6 || parseInt(fk) === 12 ? "bg-blue-900/20" : parseInt(fk) === 17 ? "bg-orange-900/20" : ""}>
                                <td className="px-3 py-1 text-white font-semibold">{v}</td>
                                <td className="px-3 py-1 text-center text-green-300">{f}</td>
                                <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Tentukan posisi kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Posisi } Q_1 = \frac{1(20+1)}{4} = 5{,}25 \Rightarrow \text{FK} \geq 5{,}25 \text{ pertama adalah 6} \Rightarrow Q_1 = 6" />
                        <BlockMath math="\text{Posisi } Q_2 = \frac{2(20+1)}{4} = 10{,}5 \Rightarrow \text{FK} \geq 10{,}5 \text{ pertama adalah 12} \Rightarrow Q_2 = 7" />
                        <BlockMath math="\text{Posisi } Q_3 = \frac{3(20+1)}{4} = 15{,}75 \Rightarrow \text{FK} \geq 15{,}75 \text{ pertama adalah 17} \Rightarrow Q_3 = 8" />
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                        <p><strong className="text-green-300">Hasil: </strong><InlineMath math="Q_1 = 6" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-3">Diagram batang berikut menunjukkan usia anggota klub robotika. Tentukan <InlineMath math="Q_3" /> dan interpretasikan maknanya!</p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">Usia Anggota Klub Robotika (40 anggota)</p>
                      <svg viewBox="0 0 280 190" className="w-full max-w-xs mx-auto" aria-label="Diagram batang usia anggota">
                        {[0,4,8,12].map(v => {
                          const y = 148 - v*(128/12);
                          return (
                            <g key={v}>
                              <line x1="32" y1={y} x2="272" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="27" y={y+4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        <line x1="32" y1="15" x2="32" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        <line x1="32" y1="148" x2="272" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {[{val:13,f:3},{val:14,f:7},{val:15,f:12},{val:16,f:10},{val:17,f:8}].map(({val,f},i) => {
                          const slotW = 48; const barW = 32;
                          const x = 32 + i*slotW + (slotW-barW)/2;
                          const barH = f*(128/12); const y = 148-barH;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH} fill="rgba(234,179,8,0.55)" stroke="rgba(253,224,71,0.8)" strokeWidth="1" rx="2"/>
                              <text x={x+barW/2} y={y-4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fde047">{f}</text>
                              <text x={x+barW/2} y="162" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        <text x="152" y="178" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">Usia (tahun)</text>
                        <text x="10" y="82" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,82)">Frekuensi</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat FK (n = 3+7+12+10+8 = 40):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Usia</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["13","3","3"],["14","7","10"],["15","12","22"],["16","10","32"],["17","8","40"]].map(([v,f,fk]) => (
                              <tr key={v} className={parseInt(fk) === 32 ? "bg-orange-900/20" : ""}>
                                <td className="px-3 py-1 text-white">{v}</td>
                                <td className="px-3 py-1 text-center text-yellow-300">{f}</td>
                                <td className="px-3 py-1 text-center text-yellow-400 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung posisi <InlineMath math="Q_3" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Posisi } Q_3 = \frac{3(40+1)}{4} = \frac{123}{4} = 30{,}75" />
                        <p className="text-xs text-white/60">FK pertama yang ≥ 30,75 adalah FK = 32 (usia 16 tahun)</p>
                        <BlockMath math="\therefore Q_3 = 16" />
                      </div>
                      <p><strong>Interpretasi:</strong></p>
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                        <p><strong className="text-yellow-300">Q₃ = 16 tahun</strong> artinya <strong>75% anggota</strong> klub berusia ≤ 16 tahun. Hanya 25% anggota yang berusia di atas 16 tahun.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-3">
                      Diagram batang berikut menunjukkan waktu tempuh (menit) 50 siswa ke sekolah. Tentukan semua kuartil dan nyatakan: berapa persen siswa yang waktu tempuhnya antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />?
                    </p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">Waktu Tempuh 50 Siswa ke Sekolah</p>
                      <svg viewBox="0 0 300 195" className="w-full max-w-sm mx-auto" aria-label="Diagram batang waktu tempuh">
                        {[0,4,8,12,14].map(v => {
                          const y = 148 - v*(128/14);
                          return (
                            <g key={v}>
                              <line x1="34" y1={y} x2="290" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="29" y={y+4} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        <line x1="34" y1="15" x2="34" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        <line x1="34" y1="148" x2="290" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {[{val:10,f:5},{val:15,f:8},{val:20,f:14},{val:25,f:12},{val:30,f:7},{val:35,f:4}].map(({val,f},i) => {
                          const slotW = 43; const barW = 28;
                          const x = 34 + i*slotW + (slotW-barW)/2;
                          const barH = f*(128/14); const y = 148-barH;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH} fill="rgba(239,68,68,0.55)" stroke="rgba(252,165,165,0.8)" strokeWidth="1" rx="2"/>
                              <text x={x+barW/2} y={y-4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fca5a5">{f}</text>
                              <text x={x+barW/2} y="162" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        <text x="162" y="178" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">Waktu (menit)</text>
                        <text x="10" y="82" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,82)">Frekuensi</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat FK (n = 5+8+14+12+7+4 = 50):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Waktu</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["10","5","5"],["15","8","13"],["20","14","27"],["25","12","39"],["30","7","46"],["35","4","50"]].map(([v,f,fk]) => (
                              <tr key={v} className={
                                parseInt(fk) === 13 ? "bg-green-900/20" :
                                parseInt(fk) === 27 ? "bg-cyan-900/20" :
                                parseInt(fk) === 39 ? "bg-orange-900/20" : ""
                              }>
                                <td className="px-3 py-1 text-white">{v}</td>
                                <td className="px-3 py-1 text-center text-red-300">{f}</td>
                                <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung posisi semua kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Pos. }Q_1 = \frac{51}{4} = 12{,}75 \Rightarrow \text{FK} \geq 12{,}75,\; \text{FK}=13 \Rightarrow Q_1 = 15" />
                        <BlockMath math="\text{Pos. }Q_2 = \frac{102}{4} = 25{,}5 \Rightarrow \text{FK} \geq 25{,}5,\; \text{FK}=27 \Rightarrow Q_2 = 20" />
                        <BlockMath math="\text{Pos. }Q_3 = \frac{153}{4} = 38{,}25 \Rightarrow \text{FK} \geq 38{,}25,\; \text{FK}=39 \Rightarrow Q_3 = 25" />
                      </div>
                      <p><strong>Langkah 3:</strong> Siswa dengan waktu antara <InlineMath math="Q_1 = 15" /> dan <InlineMath math="Q_3 = 25" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/60">Yang termasuk: nilai 15 (f=8), 20 (f=14), 25 (f=12)</p>
                        <BlockMath math="\text{Banyak siswa} = 8 + 14 + 12 = 34 \text{ siswa}" />
                        <BlockMath math="\text{Persentase} = \frac{34}{50} \times 100\% = 68\%" />
                      </div>
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                        <p><strong className="text-red-300">Jawaban: </strong><InlineMath math="Q_1 = 15" /> menit, <InlineMath math="Q_2 = 20" /> menit, <InlineMath math="Q_3 = 25" /> menit.<br />
                        Sebanyak <strong>34 siswa (68%)</strong> waktu tempuhnya berada antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RANGKUMAN ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-violet-400" title="📋 Rangkuman — Kuartil" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      title: "Data Tunggal", color: "border-green-500/40 bg-green-900/20",
                      points: [
                        "Urutkan data dari kecil ke besar.",
                        "Cari Q₂ (median seluruh data) terlebih dahulu.",
                        "Bagi jadi Kaum Bawah dan Kaum Atas (tidak termasuk Q₂ jika n ganjil).",
                        "Q₁ = median Kaum Bawah · Q₃ = median Kaum Atas.",
                      ]
                    },
                    {
                      title: "Tabel Distribusi Frekuensi Tunggal", color: "border-blue-500/40 bg-blue-900/20",
                      points: [
                        "Buat kolom frekuensi kumulatif (FK).",
                        "Posisi Qₖ = k(n+1)/4",
                        "Nilai Qₖ = nilai x yang FK-nya pertama ≥ posisi.",
                      ]
                    },
                  ].map(({ title, color, points }) => (
                    <div key={title} className={`border ${color} rounded-xl p-4`}>
                      <p className="font-body text-sm font-bold text-white mb-2">{title}</p>
                      <ul className="space-y-1">
                        {points.map((p) => (
                          <li key={p} className="font-body text-xs text-white/70 flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4 text-center">
                  <p className="font-body text-sm text-violet-200">
                    <strong>Q₂ selalu sama dengan Median!</strong><br />
                    <span className="text-xs text-white/50">Karena keduanya membagi data menjadi dua bagian yang sama besar (50%–50%).</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              ← Kembali ke Statistika Kelas 9
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KuartilPage;
