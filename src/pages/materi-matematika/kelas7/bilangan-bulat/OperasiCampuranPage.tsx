import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Zap, Calculator, AlertTriangle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const OperasiCampuranBilanganBulatPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "prioritas", "kurung", "contoh", "kesimpulan"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OPERASI HITUNG CAMPURAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Bulat - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Apa itu Operasi Campuran?</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Operasi campuran adalah perhitungan yang melibatkan <strong className="text-primary">lebih dari satu jenis operasi</strong> dalam satu ekspresi matematika. Bayangkan kamu sedang memasak: tidak hanya mencampurkan satu bahan, tapi beberapa bahan sekaligus dengan urutan tertentu agar hasilnya pas!
                </p>
                
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">Contoh Operasi Campuran:</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="5 + 3 \times 2 - 1" />
                      <p className="text-white/60 text-xs text-center mt-1">Ada penjumlahan, perkalian, dan pengurangan</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="12 \div 4 + 6 \times (-2)" />
                      <p className="text-white/60 text-xs text-center mt-1">Ada pembagian, penjumlahan, dan perkalian</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Pertanyaan Kunci:</strong> Operasi mana yang harus dikerjakan duluan? Kalau urutan pengerjaannya salah, hasilnya pasti berbeda! Itulah mengapa kita perlu memahami <strong>aturan prioritas</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Aturan Prioritas (KaKuKaBaKu) */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("prioritas")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Aturan Prioritas: KaKuKaBaKu</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Untuk menyelesaikan operasi campuran, kita punya jurus sakti bernama <strong className="text-green-400">KaKuKaBaKu</strong>! Ini adalah singkatan yang membantu mengingat urutan pengerjaan:
                </p>

                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3 text-center">URUTAN PRIORITAS</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">1</span>
                      <div>
                        <p className="font-body font-semibold text-green-300">Ka - Kurung ( )</p>
                        <p className="text-white/60 text-xs">Kerjakan yang ada di dalam kurung terlebih dahulu</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-blue-500 text-white font-bold px-3 py-1 rounded-full text-sm">2</span>
                      <div>
                        <p className="font-body font-semibold text-blue-300">Ku - Kuadrat/Pangkat</p>
                        <p className="text-white/60 text-xs">Kerjakan perpangkatan setelah kurung</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-yellow-500 text-white font-bold px-3 py-1 rounded-full text-sm">3</span>
                      <div>
                        <p className="font-body font-semibold text-yellow-300">
                          Ka &amp; Ba — Kali <InlineMath math="\times" /> dan Bagi <InlineMath math="\div" />
                        </p>
                        <p className="text-white/60 text-xs">Setingkat — kerjakan dari kiri ke kanan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">4</span>
                      <div>
                        <p className="font-body font-semibold text-red-300">Ku - Kurang <InlineMath math="-" /> & Tambah <InlineMath math="+" /></p>
                        <p className="text-white/60 text-xs">Penjumlahan dan pengurangan dikerjakan terakhir, dari kiri</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Tips Mudah:</strong> Perkalian dan pembagian punya tingkat yang SAMA, jadi kerjakan dari kiri ke kanan. Begitu juga penjumlahan dan pengurangan - keduanya setingkat!
                  </p>
                </div>

                {/* Ringkasan Intisari */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">Ringkasan Intisari:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Kurung} \rightarrow \text{Pangkat} \rightarrow \times \div \rightarrow + -" />
                  </div>
                  <p className="text-white/60 text-xs mt-2 text-center">
                    Jika ada operasi setingkat, kerjakan dari kiri ke kanan
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Penggunaan Kurung */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kurung")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Jenis-Jenis Kurung</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dalam matematika, ada <strong className="text-orange-400">3 jenis kurung</strong> yang perlu kamu kenal. Masing-masing punya tingkat prioritas berbeda!
                </p>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-3">Urutan Pengerjaan Kurung:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3 flex items-center gap-4">
                      <span className="text-2xl font-mono text-green-400">( )</span>
                      <div>
                        <p className="font-body font-semibold text-green-300">Kurung Biasa</p>
                        <p className="text-white/60 text-xs">Dikerjakan paling awal (kurung terdalam)</p>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 flex items-center gap-4">
                      <span className="text-2xl font-mono text-blue-400">[ ]</span>
                      <div>
                        <p className="font-body font-semibold text-blue-300">Kurung Siku</p>
                        <p className="text-white/60 text-xs">Dikerjakan setelah kurung biasa</p>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 flex items-center gap-4">
                      <span className="text-2xl font-mono text-purple-400">{"{ }"}</span>
                      <div>
                        <p className="font-body font-semibold text-purple-300">Kurung Kurawal</p>
                        <p className="text-white/60 text-xs">Dikerjakan paling akhir (kurung terluar)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-orange-300 mb-3">Contoh dengan Tiga Kurung:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <BlockMath math="\{5 + [3 \times (2 + 1)]\}" />
                    <p className="text-white/60 text-xs">Langkah 1: Kerjakan <InlineMath math="(2 + 1) = 3" /></p>
                    <p className="text-white/60 text-xs">Langkah 2: Kerjakan <InlineMath math="[3 \times 3] = 9" /></p>
                    <p className="text-green-400 text-sm">Langkah 3: Kerjakan <InlineMath math="\{5 + 9\} = 14" /></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Ingat!</strong> Prinsipnya adalah "dari dalam ke luar". Kerjakan kurung yang paling dalam terlebih dahulu, baru kemudian kurung yang lebih luar.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">Contoh Soal Bertingkat</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">
                {/* Soal Mudah */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-green-300">Contoh 1</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Hitunglah:</p>
                    <BlockMath math="8 + 4 \times 3 - 10" />
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Identifikasi operasi yang ada: penjumlahan, perkalian, pengurangan</p>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Kerjakan perkalian terlebih dahulu (prioritas lebih tinggi):</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="4 \times 3 = 12" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Substitusi ke ekspresi awal:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="8 + 12 - 10" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 4:</strong> Kerjakan dari kiri ke kanan:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="8 + 12 = 20" />
                        <br />
                        <InlineMath math="20 - 10 = 10" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: <InlineMath math="8 + 4 \times 3 - 10 = 10" /></p>
                    </div>
                  </div>
                </div>

                {/* Soal Sedang */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-yellow-300">Contoh 2</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Hitunglah:</p>
                    <BlockMath math="(-6) \times 4 + 24 \div (-3) - 5" />
                  </div>
                  <div className="border-t border-yellow-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-yellow-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Kerjakan perkalian dan pembagian terlebih dahulu (dari kiri ke kanan):</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4 space-y-1">
                        <p><InlineMath math="(-6) \times 4 = -24" /> <span className="text-white/50 text-xs">(negatif x positif = negatif)</span></p>
                        <p><InlineMath math="24 \div (-3) = -8" /> <span className="text-white/50 text-xs">(positif : negatif = negatif)</span></p>
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Substitusi ke ekspresi:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="-24 + (-8) - 5" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Kerjakan dari kiri ke kanan:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="-24 + (-8) = -32" />
                        <br />
                        <InlineMath math="-32 - 5 = -37" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: <InlineMath math="(-6) \times 4 + 24 \div (-3) - 5 = -37" /></p>
                    </div>
                  </div>
                </div>

                {/* Soal Sulit */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-red-300">Contoh 3</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">Hitunglah:</p>
                    <BlockMath math="15 - [(-8) + 4 \times (6 - 9)] \div 5" />
                  </div>
                  <div className="border-t border-red-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-red-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Kerjakan kurung biasa ( ) terlebih dahulu:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="6 - 9 = -3" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Persamaan menjadi:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="15 - [(-8) + 4 \times (-3)] \div 5" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Di dalam kurung siku, kerjakan perkalian dulu:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="4 \times (-3) = -12" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 4:</strong> Selesaikan isi kurung siku:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="(-8) + (-12) = -20" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 5:</strong> Persamaan menjadi:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="15 - (-20) \div 5" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 6:</strong> Kerjakan pembagian:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="(-20) \div 5 = -4" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 7:</strong> Kerjakan pengurangan:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="15 - (-4) = 15 + 4 = 19" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: <InlineMath math="15 - [(-8) + 4 \times (6 - 9)] \div 5 = 19" /></p>
                    </div>
                  </div>
                </div>

                {/* Soal Bonus - Soal Cerita */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-purple-300">Soal Cerita</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Pak Budi seorang pedagang buah. Pada pagi hari, ia memiliki stok <strong>50 kg</strong> jeruk. 
                      Siang hari terjual <strong>28 kg</strong>, lalu sore hari datang kiriman <strong>3 karung</strong> yang 
                      masing-masing berisi <strong>15 kg</strong>. Malam hari, ada <strong>12 kg</strong> jeruk yang busuk 
                      dan harus dibuang. Berapa kg stok jeruk Pak Budi sekarang?
                    </p>
                  </div>
                  <div className="border-t border-purple-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-purple-300 mb-2">PEMBAHASAN:</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>Langkah 1:</strong> Ubah ke model matematika:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs mb-1">Stok awal - terjual + kiriman - busuk</p>
                        <InlineMath math="50 - 28 + (3 \times 15) - 12" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 2:</strong> Kerjakan perkalian dalam kurung:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="3 \times 15 = 45" />
                      </div>
                      <p className="text-white/70"><strong>Langkah 3:</strong> Kerjakan dari kiri ke kanan:</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="50 - 28 + 45 - 12" />
                        <br />
                        <InlineMath math="= 22 + 45 - 12" />
                        <br />
                        <InlineMath math="= 67 - 12" />
                        <br />
                        <InlineMath math="= 55" />
                      </div>
                      <p className="text-green-400 font-semibold">Jawaban: Stok jeruk Pak Budi sekarang adalah <strong>55 kg</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesalahan Umum */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesalahan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Kesalahan Umum yang Harus Dihindari</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">Kesalahan #1: Mengerjakan dari Kiri ke Kanan Tanpa Melihat Prioritas</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-red-400 text-xs mb-1">SALAH:</p>
                      <InlineMath math="5 + 3 \times 2 = 8 \times 2 = 16" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-xs mb-1">BENAR:</p>
                      <InlineMath math="5 + 3 \times 2 = 5 + 6 = 11" />
                      <p className="text-white/50 text-xs mt-1">(Perkalian dikerjakan duluan!)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">Kesalahan #2: Lupa Aturan Tanda Saat Mengurangi Bilangan Negatif</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-red-400 text-xs mb-1">SALAH:</p>
                      <InlineMath math="10 - (-5) = 10 - 5 = 5" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-xs mb-1">BENAR:</p>
                      <InlineMath math="10 - (-5) = 10 + 5 = 15" />
                      <p className="text-white/50 text-xs mt-1">(Mengurangi negatif = menambah positif!)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">Kesalahan #3: Tidak Menyelesaikan Kurung Terdalam Lebih Dulu</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-red-400 text-xs mb-1">SALAH: Langsung mengerjakan kurung siku</p>
                      <InlineMath math="[3 + (2 \times 4)] \rightarrow [3 + 2] \times 4 = 20" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-xs mb-1">BENAR: Kerjakan kurung biasa dulu</p>
                      <InlineMath math="[3 + (2 \times 4)] = [3 + 8] = 11" />
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Tips Anti Salah:</strong> Selalu tandai atau garis bawahi operasi yang harus dikerjakan lebih dulu sebelum mulai menghitung. Ini akan membantu kamu tetap fokus pada urutan yang benar!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesimpulan & Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-body font-semibold text-white">Kesimpulan & Tips Operasi Campuran</span>
              </div>
              {true ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">

                {/* Urutan Prioritas */}
                <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">Kesimpulan Urutan Prioritas:</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="bg-green-500/20 border border-green-500/40 text-green-300 font-bold px-3 py-2 rounded-lg text-sm">1. Kurung ( ) [ ] &#123; &#125;</span>
                    <span className="text-white/40 font-bold">→</span>
                    <span className="bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold px-3 py-2 rounded-lg text-sm">2. Pangkat</span>
                    <span className="text-white/40 font-bold">→</span>
                    <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-bold px-3 py-2 rounded-lg text-sm">3. × dan ÷</span>
                    <span className="text-white/40 font-bold">→</span>
                    <span className="bg-red-500/20 border border-red-500/40 text-red-300 font-bold px-3 py-2 rounded-lg text-sm">4. + dan −</span>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 mt-3">
                    <BlockMath math="\text{Kurung} \rightarrow \text{Pangkat} \rightarrow \times\div \rightarrow +-" />
                    <p className="text-white/60 text-xs text-center mt-1">Operasi setingkat dikerjakan dari <strong className="text-cyan-300">kiri ke kanan</strong></p>
                  </div>
                </div>

                {/* Aturan Penting */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">Aturan Penting:</p>
                  <div className="space-y-2">
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">× dan ÷ setingkat</strong> — jika keduanya ada bersamaan, kerjakan dari kiri ke kanan, bukan × dulu baru ÷.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Zap className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-red-300">+ dan − setingkat</strong> — jika keduanya ada bersamaan, kerjakan dari kiri ke kanan, bukan + dulu baru −.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-orange-300">Kurung bertingkat</strong> — kerjakan kurung paling dalam ( ) terlebih dahulu, baru [ ], lalu &#123; &#125;.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-3">Tips Cepat Mengerjakan Soal:</p>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">1.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Baca soal dulu secara keseluruhan</strong> sebelum menghitung — identifikasi semua jenis operasi yang ada, lalu tandai mana yang dikerjakan lebih dulu.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">2.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Kerjakan langkah demi langkah</strong> dan tulis hasilnya setiap langkah. Hindari menghitung semuanya sekaligus dalam kepala — rawan salah!
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">3.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Jangan tertipu urutan penulisan.</strong> <InlineMath math="3 + 2 \times 4" /> bukan berarti 3+2 dikerjakan dulu! Perkalian tetap lebih prioritas meski ditulis belakangan.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">4.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">Verifikasi hasil akhir</strong> dengan mensubstitusi kembali ke soal asal. Kalau tidak yakin, ulangi dari langkah pertama.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">🔀 RANGKUMAN LENGKAP</p>
              <p className="font-body text-xs text-white/80 mt-0.5">Operasi Hitung Campuran Bilangan Bulat — Kelas 7</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              {/* Hierarki Prioritas */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">1</span>
                  Hierarki Prioritas — Urutan Wajib!
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { nomor: "1", label: "Kurung  ( )", desc: "Kerjakan SEMUA yang ada dalam kurung terlebih dahulu, dari dalam ke luar.", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200", badge: "bg-red-500" },
                    { nomor: "2", label: "Pangkat / Akar", desc: "Setelah kurung selesai, kerjakan pemangkatan dan penarikan akar.", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200", badge: "bg-orange-500" },
                    { nomor: "3", label: "× dan ÷  (kiri ke kanan)", desc: "Perkalian dan pembagian memiliki prioritas yang sama. Kerjakan dari kiri ke kanan.", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200", badge: "bg-yellow-500" },
                    { nomor: "4", label: "+ dan −  (kiri ke kanan)", desc: "Penjumlahan dan pengurangan dikerjakan terakhir, dari kiri ke kanan.", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200", badge: "bg-green-500" },
                  ].map(({ nomor, label, desc, color, badge }) => (
                    <div key={nomor} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className={`${badge} text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5`}>{nomor}</span>
                      <div>
                        <p className="font-body text-xs font-bold">{label}</p>
                        <p className="font-body text-xs text-white/65 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/30 border border-amber-500/40 rounded-xl px-4 py-3 text-center">
                  <p className="font-body text-xs font-bold text-yellow-200">🧠 Mnemonik untuk diingat:</p>
                  <p className="font-body text-sm text-white font-bold mt-1">"<span className="text-red-300">K</span>urung — <span className="text-orange-300">P</span>angkat — <span className="text-yellow-300">K</span>ali/<span className="text-yellow-300">B</span>agi — <span className="text-green-300">T</span>ambah/<span className="text-green-300">K</span>urang"</p>
                  <p className="font-body text-xs text-white/50 mt-1">Ingat: KP-KB-TK atau "Kurung Pangkat — Kali Bagi — Tambah Kurang"</p>
                </div>
              </div>

              {/* Contoh Cepat */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/30 border border-amber-500 flex items-center justify-center text-[10px]">2</span>
                  Contoh Penerapan Prioritas
                </p>
                <div className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-4 space-y-3">
                  {[
                    { soal: "3 + 2 × 4", langkah: "= 3 + (2 × 4) = 3 + 8 = 11", salah: "Bukan (3+2)×4 = 20 ✗", color: "text-yellow-300" },
                    { soal: "(−5 + 3) × (−2)", langkah: "= (−2) × (−2) = 4", salah: "Kurung dikerjakan dulu ✓", color: "text-green-300" },
                    { soal: "20 ÷ (−4) − 3 × 2", langkah: "= (−5) − 6 = −11", salah: "× dan ÷ dulu, baru −", color: "text-cyan-300" },
                  ].map(({ soal, langkah, salah, color }) => (
                    <div key={soal} className="flex gap-3">
                      <p className={`font-mono text-xs font-bold ${color} shrink-0 min-w-[120px]`}>{soal}</p>
                      <div>
                        <p className="font-mono text-xs text-white/80">{langkah}</p>
                        <p className="font-body text-[11px] text-white/40 italic">{salah}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Trik */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500 flex items-center justify-center text-[10px]">3</span>
                  Tips &amp; Trik Jitu Operasi Campuran
                </p>
                <div className="space-y-2">
                  {[
                    { icon: "📝", tip: "Tandai langkah pengerjaan sebelum menghitung", detail: "Baca soal dulu, lingkari atau garis bawahi mana yang dikerjakan pertama. Jangan langsung menghitung!", color: "bg-yellow-900/30 border-yellow-500/30" },
                    { icon: "🔍", tip: "Waspada jebakan prioritas kiri-ke-kanan", detail: "12 ÷ 3 × 2 = (12÷3)×2 = 8, BUKAN 12÷(3×2) = 2. × dan ÷ dikerjakan dari kiri ke kanan!", color: "bg-orange-900/30 border-orange-500/30" },
                    { icon: "🎯", tip: "Kurung beranak — kerjakan dari dalam", detail: "Jika ada kurung bersarang seperti [(2+3)×4], kerjakan kurung paling dalam dulu: (2+3)=5, lalu 5×4=20.", color: "bg-red-900/30 border-red-500/30" },
                    { icon: "✅", tip: "Verifikasi dengan substitusi bertahap", detail: "Tulis setiap langkah secara terpisah. Jika ada kesalahan, kamu bisa langsung tahu di langkah mana terjadi.", color: "bg-green-900/30 border-green-500/30" },
                  ].map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kesimpulan */}
              <div className="bg-gradient-to-br from-yellow-500/20 via-amber-500/15 to-orange-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🎓</div>
                <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Operasi campuran bukan soal menghitung cepat, tapi soal{" "}
                  <strong className="text-yellow-300">mengikuti aturan urutan yang tepat</strong>. Selalu ingat hierarki:{" "}
                  <strong className="text-red-300">Kurung</strong> →{" "}
                  <strong className="text-orange-300">Pangkat</strong> →{" "}
                  <strong className="text-yellow-300">× dan ÷</strong> →{" "}
                  <strong className="text-green-300">+ dan −</strong>. Siapapun yang mengikuti aturan ini{" "}
                  <strong className="text-cyan-300">tidak akan pernah salah</strong>!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Kurung Dulu", "Pangkat/Akar", "× dan ÷ = Sederajat", "+ dan − = Sederajat", "Kiri ke Kanan"].map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🏆 Kamu telah menguasai semua operasi dasar bilangan bulat!</p>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperasiCampuranBilanganBulatPage;
