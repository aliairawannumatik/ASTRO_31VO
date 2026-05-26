import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, AlertTriangle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianNotasiPangkatPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "contoh1", "konsep2", "contoh2", "konsep3", "contoh3", "konsep4", "contoh4",
  ]);

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
          PENGERTIAN DAN NOTASI PANGKAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Bilangan Berpangkat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ===================== PENGANTAR ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">🚀 Perkalian Berulang? Ada Cara Lebih Cepatnya!</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Coba bayangkan kamu diminta menghitung luas sebuah persegi dengan sisi 1.000 meter.
                  Rumusnya <InlineMath math="L = s \times s" />. Tapi bagaimana kalau kamu harus mengalikan bilangan yang sama sebanyak 10 kali?
                  Menulisnya secara manual tentu panjang banget, kan?
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Inilah alasan kenapa matematika punya notasi pangkat! Daripada nulis{" "}
                    <InlineMath math="2 \times 2 \times 2 \times 2 \times 2" />, cukup tulis{" "}
                    <InlineMath math="2^5" /> saja. Lebih ringkas, lebih keren! 🌟
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Konsep bilangan berpangkat digunakan luas dalam ilmu sains, komputer, dan keuangan — dari menghitung ukuran file komputer (KB, MB, GB) hingga pertumbuhan bakteri!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 1: PENGERTIAN ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep1")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">📘 Sub-Bab 1: Pengertian Bilangan Berpangkat</span>
              </div>
              {expandedSections.includes("konsep1") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Bilangan berpangkat</strong> adalah cara singkat menuliskan perkalian berulang dari bilangan yang sama.
                    Secara umum, bentuknya ditulis sebagai:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="a^n = \underbrace{a \times a \times a \times \cdots \times a}_{n \text{ faktor}}" />
                  </div>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>
                      <strong className="text-green-300">Bilangan Pokok (Basis)</strong> → <InlineMath math="a" /> adalah bilangan yang dikalikan berulang-ulang.
                    </p>
                    <p>
                      <strong className="text-green-300">Pangkat (Eksponen)</strong> → <InlineMath math="n" /> menunjukkan berapa kali basis dikalikan dengan dirinya sendiri.
                    </p>
                    <p>
                      <strong className="text-green-300">Syarat:</strong> Pada definisi ini, <InlineMath math="n" /> adalah bilangan bulat positif dan <InlineMath math="n \geq 1" />.
                    </p>
                  </div>
                </div>

                {/* Visualisasi Anatomi Pangkat */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ANATOMI NOTASI PANGKAT:</p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative inline-block">
                      <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border-2 border-cyan-500/50 rounded-xl px-10 py-6 text-center">
                        <span className="inline-flex items-start">
                          <span className="font-display text-5xl font-bold text-white leading-none">5</span>
                          <span className="font-display text-2xl font-bold text-yellow-400 leading-none" style={{ marginTop: '-4px', marginLeft: '3px' }}>3</span>
                        </span>
                      </div>
                      <div className="mt-3 flex justify-around text-xs font-body">
                        <div className="text-center">
                          <div className="w-2 h-6 border-l-2 border-cyan-400 mx-auto mb-1"></div>
                          <span className="text-cyan-300 font-semibold">BASIS (5)</span>
                          <br />
                          <span className="text-white/60">Bilangan Pokok</span>
                        </div>
                        <div className="text-center">
                          <div className="w-2 h-6 border-l-2 border-yellow-400 mx-auto mb-1"></div>
                          <span className="text-yellow-300 font-semibold">EKSPONEN (3)</span>
                          <br />
                          <span className="text-white/60">Pangkat</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center w-full">
                      <p className="font-body text-sm text-white/80">
                        <InlineMath math="5^3 = 5 \times 5 \times 5 = 125" />
                      </p>
                      <p className="font-body text-xs text-white/50 mt-1">Dibaca: "lima pangkat tiga" atau "lima kubik"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Pangkat 2 biasa disebut <em>"kuadrat"</em> dan pangkat 3 disebut <em>"kubik"</em>. Jadi <InlineMath math="7^2" /> dibaca "tujuh kuadrat" dan <InlineMath math="4^3" /> dibaca "empat kubik".
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh1")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">📝 Contoh Soal — Pengertian Bilangan Berpangkat</span>
              </div>
              {expandedSections.includes("contoh1") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Nyatakan perkalian berulang <InlineMath math="7 \times 7 \times 7 \times 7" /> dalam bentuk notasi pangkat, lalu sebutkan basis dan eksponenya!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung berapa kali angka 7 muncul → sebanyak <strong className="text-primary">4 kali</strong>.</p>
                      <p><strong>Langkah 2:</strong> Tulis dalam notasi pangkat:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="7 \times 7 \times 7 \times 7 = 7^4" />
                      </div>
                      <p><strong>Langkah 3:</strong> Identifikasi unsur-unsurnya:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>Basis (bilangan pokok) = <strong className="text-cyan-300">7</strong></p>
                        <p>Eksponen (pangkat) = <strong className="text-yellow-300">4</strong></p>
                        <p>Nilai: <InlineMath math="7^4 = 7 \times 7 \times 7 \times 7 = 2.401" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah kubus memiliki panjang rusuk <InlineMath math="6" /> cm. Hitunglah volume kubus tersebut dan nyatakan dalam notasi pangkat!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Gunakan rumus volume kubus:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="V = s \times s \times s = s^3" />
                      </div>
                      <p><strong>Langkah 2:</strong> Substitusi <InlineMath math="s = 6" /> cm:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="V = 6^3 = 6 \times 6 \times 6 = 216 \text{ cm}^3" />
                      </div>
                      <p>Notasi pangkat <InlineMath math="6^3" /> artinya: <strong className="text-primary">basis = 6</strong>, <strong className="text-primary">eksponen = 3</strong>.</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah bakteri membelah diri menjadi 2 setiap jam. Jika awalnya ada 1 bakteri, berapa banyak bakteri setelah 8 jam? Nyatakan jawabanmu menggunakan notasi pangkat!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Perhatikan polanya:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>Jam ke-0: <InlineMath math="2^0 = 1" /> bakteri</p>
                        <p>Jam ke-1: <InlineMath math="2^1 = 2" /> bakteri</p>
                        <p>Jam ke-2: <InlineMath math="2^2 = 4" /> bakteri</p>
                        <p>Jam ke-3: <InlineMath math="2^3 = 8" /> bakteri</p>
                        <p className="text-white/50">... dan seterusnya</p>
                      </div>
                      <p><strong>Langkah 2:</strong> Setelah <InlineMath math="n" /> jam, jumlah bakteri = <InlineMath math="2^n" /></p>
                      <p><strong>Langkah 3:</strong> Untuk <InlineMath math="n = 8" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="2^8 = 2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 = 256" />
                      </div>
                      <p><strong className="text-primary">Setelah 8 jam, terdapat 256 bakteri.</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 2: BILANGAN BULAT & PECAHAN BERPANGKAT ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep2")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">📘 Sub-Bab 2: Bilangan Bulat dan Pecahan Berpangkat</span>
              </div>
              {expandedSections.includes("konsep2") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Notasi pangkat tidak hanya berlaku untuk bilangan bulat positif. Basis <InlineMath math="a" /> bisa berupa bilangan bulat apa pun (termasuk nol dan negatif) maupun bilangan pecahan.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-purple-300 mb-2">Bilangan Bulat Berpangkat:</p>
                      <BlockMath math="a^n = \underbrace{a \times a \times \cdots \times a}_{n}" />
                      <p className="font-body text-xs text-white/60 mt-1">Berlaku untuk semua bilangan bulat <InlineMath math="a" /> dan <InlineMath math="n \in \mathbb{Z}^+" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-purple-300 mb-2">Pecahan Berpangkat:</p>
                      <BlockMath math="\left(\frac{p}{q}\right)^n = \frac{p^n}{q^n}, \quad q \neq 0" />
                      <p className="font-body text-xs text-white/60 mt-1">Basis berupa pecahan → pembilang dan penyebut masing-masing dipangkatkan!</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Pecahan berpangkat caranya mudah — pangkatkan pembilang dan penyebutnya secara terpisah! Misalnya: <InlineMath math="\left(\frac{2}{3}\right)^4 = \frac{2^4}{3^4} = \frac{16}{81}" />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh2")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">📝 Contoh Soal — Bilangan Bulat & Pecahan Berpangkat</span>
              </div>
              {expandedSections.includes("contoh2") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Hitunglah nilai dari <InlineMath math="\left(\dfrac{3}{4}\right)^3" />!</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Pangkatkan pembilang dan penyebut secara terpisah:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\left(\frac{3}{4}\right)^3 = \frac{3^3}{4^3} = \frac{3 \times 3 \times 3}{4 \times 4 \times 4} = \frac{27}{64}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="\dfrac{27}{64}" /></strong></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Hitunglah: <InlineMath math="3^4 + \left(\dfrac{1}{2}\right)^3" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung masing-masing:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="3^4 = 3 \times 3 \times 3 \times 3 = 81" />
                        <BlockMath math="\left(\frac{1}{2}\right)^3 = \frac{1^3}{2^3} = \frac{1}{8}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Jumlahkan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="81 + \frac{1}{8} = \frac{648}{8} + \frac{1}{8} = \frac{649}{8} = 81\frac{1}{8}" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sederhanakan: <InlineMath math="\left(\dfrac{2}{5}\right)^2 \times \left(\dfrac{5}{2}\right)^3" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Pangkatkan masing-masing pecahan:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\left(\frac{2}{5}\right)^2 = \frac{4}{25}" />
                        <BlockMath math="\left(\frac{5}{2}\right)^3 = \frac{125}{8}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Kalikan hasilnya:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{4}{25} \times \frac{125}{8} = \frac{4 \times 125}{25 \times 8} = \frac{500}{200} = \frac{5}{2}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="\dfrac{5}{2}" /></strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 3: BILANGAN NEGATIF BERPANGKAT ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep3")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">📘 Sub-Bab 3: Bilangan Negatif Berpangkat</span>
              </div>
              {expandedSections.includes("konsep3") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika basis berupa bilangan <strong className="text-orange-300">negatif</strong>, hasilnya bergantung pada jenis pangkatnya (ganjil atau genap). Ingat aturan dasar perkalian bilangan negatif!
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <p className="font-body text-xs font-semibold text-green-300 mb-2">Pangkat GENAP</p>
                      <BlockMath math="(-a)^{\text{genap}} > 0" />
                      <p className="font-body text-xs text-white/60 mt-1">Hasilnya <strong className="text-green-400">POSITIF</strong></p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <p className="font-body text-xs font-semibold text-red-300 mb-2">Pangkat GANJIL</p>
                      <BlockMath math="(-a)^{\text{ganjil}} < 0" />
                      <p className="font-body text-xs text-white/60 mt-1">Hasilnya <strong className="text-red-400">NEGATIF</strong></p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1 font-body text-sm text-white/80">
                    <p>Kenapa? Karena: <InlineMath math="(-) \times (-) = +" /> dan <InlineMath math="(-) \times (-) \times (-) = -" /></p>
                  </div>
                </div>

                {/* Visualisasi pola */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">📊 POLA TANDA BILANGAN NEGATIF BERPANGKAT:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-xs text-center">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="py-2 px-3 text-slate-300">Pangkat</th>
                          <th className="py-2 px-3 text-slate-300">Perkalian</th>
                          <th className="py-2 px-3 text-slate-300">Hasil</th>
                          <th className="py-2 px-3 text-slate-300">Tanda</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 px-3"><InlineMath math="(-2)^1" /></td>
                          <td className="py-2 px-3"><InlineMath math="-2" /></td>
                          <td className="py-2 px-3">-2</td>
                          <td className="py-2 px-3 text-red-400">−</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 px-3"><InlineMath math="(-2)^2" /></td>
                          <td className="py-2 px-3"><InlineMath math="(-2)(-2)" /></td>
                          <td className="py-2 px-3">4</td>
                          <td className="py-2 px-3 text-green-400">+</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 px-3"><InlineMath math="(-2)^3" /></td>
                          <td className="py-2 px-3"><InlineMath math="(-2)(-2)(-2)" /></td>
                          <td className="py-2 px-3">-8</td>
                          <td className="py-2 px-3 text-red-400">−</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 px-3"><InlineMath math="(-2)^4" /></td>
                          <td className="py-2 px-3"><InlineMath math="(-2)^4" /></td>
                          <td className="py-2 px-3">16</td>
                          <td className="py-2 px-3 text-green-400">+</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3"><InlineMath math="(-2)^5" /></td>
                          <td className="py-2 px-3"><InlineMath math="(-2)^5" /></td>
                          <td className="py-2 px-3">-32</td>
                          <td className="py-2 px-3 text-red-400">−</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Hafal Cepat:</strong> Genap = Good (positif) 😊 | Ganjil = Gloomy (negatif) 😔
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh3")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">📝 Contoh Soal — Bilangan Negatif Berpangkat</span>
              </div>
              {expandedSections.includes("contoh3") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Hitunglah nilai dari <InlineMath math="(-5)^4" /> dan <InlineMath math="(-3)^3" />!</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>Pangkat genap → hasil positif:</strong></p>
                        <BlockMath math="(-5)^4 = (-5) \times (-5) \times (-5) \times (-5) = 625" />
                        <p><strong>Pangkat ganjil → hasil negatif:</strong></p>
                        <BlockMath math="(-3)^3 = (-3) \times (-3) \times (-3) = -27" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Hitunglah: <InlineMath math="(-2)^6 + (-3)^5" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="(-2)^6 = 64 \quad \text{(pangkat genap, positif)}" />
                        <BlockMath math="(-3)^5 = -243 \quad \text{(pangkat ganjil, negatif)}" />
                        <BlockMath math="64 + (-243) = 64 - 243 = -179" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan nilai <InlineMath math="n" /> jika <InlineMath math="(-4)^n = 1024" /> dan <InlineMath math="n" /> adalah bilangan bulat positif!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Karena hasilnya positif (1024 {`>`} 0), maka <InlineMath math="n" /> harus <strong>genap</strong>.</p>
                      <p><strong>Langkah 2:</strong> Coba pangkat genap dari 4:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p><InlineMath math="4^1 = 4" /> (skip — ganjil)</p>
                        <p><InlineMath math="4^2 = 16" /> ❌</p>
                        <p><InlineMath math="4^3 = 64" /> (skip — ganjil)</p>
                        <p><InlineMath math="4^4 = 256" /> ❌</p>
                        <p><InlineMath math="4^5 = 1024" /> (skip — ganjil)</p>
                        <p><InlineMath math="(-4)^4 = 256" /> ❌</p>
                        <p><InlineMath math="(-4)^5 = -1024" /> ❌ (negatif)</p>
                        <p><strong className="text-green-400"><InlineMath math="(-4)^5 = -1024" /> → berarti kita coba <InlineMath math="4^5 = 1024" /></strong></p>
                      </div>
                      <p><strong>Langkah 3:</strong> Verifikasi — <InlineMath math="1024 = 4^5" />, tapi basis kita <InlineMath math="-4" />. Karena pangkat 5 ganjil, hasilnya negatif. Jadi cek <InlineMath math="(-4)^n = 1024" /> dengan <InlineMath math="n" /> genap:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(-4)^5 = -1024 \quad \text{(bukan 1024)}" />
                        <BlockMath math="1024 = 2^{10} = 4^5" />
                        <p className="text-xs mt-1">Perhatikan: <InlineMath math="(-4)^n = 1024 = 4^5" /> → tidak ada bilangan pangkat genap dari <InlineMath math="-4" /> yang = 1024 karena <InlineMath math="1024 = 4^5" /> (pangkat ganjil). Maka <strong className="text-primary">tidak ada solusi bulat genap</strong>. Jawaban: <strong className="text-yellow-300">tidak ada nilai <InlineMath math="n" /> bulat positif genap yang memenuhi.</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 4: PERBEDAAN (-a)^n dan -a^n ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep4")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">📘 Sub-Bab 4: Perbedaan <InlineMath math="(-a)^n" /> dan <InlineMath math="-a^n" /></span>
              </div>
              {expandedSections.includes("konsep4") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-red-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ini adalah salah satu jebakan paling sering yang bikin siswa salah! Perhatikan letak kurung (tanda kurung) sangat menentukan makna dari ekspresi.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-cyan-300 mb-2">Bentuk <InlineMath math="(-a)^n" /> — Basis NEGATIF</p>
                      <p className="font-body text-xs text-white/70 mb-2">Tanda minus <strong className="text-cyan-300">termasuk dalam kurung</strong>, artinya yang dipangkatkan adalah <InlineMath math="-a" /> (bilangan negatif secara keseluruhan).</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <BlockMath math="(-3)^4 = (-3) \times (-3) \times (-3) \times (-3) = +81" />
                      </div>
                    </div>
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-pink-300 mb-2">Bentuk <InlineMath math="-a^n" /> — Nilai Negatif dari Pangkat</p>
                      <p className="font-body text-xs text-white/70 mb-2">Tanda minus <strong className="text-pink-300">di luar</strong>, artinya yang dipangkatkan hanya <InlineMath math="a" /> (positif), lalu hasilnya dinegatifkan. Ini setara dengan <InlineMath math="-(a^n)" />.</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <BlockMath math="-3^4 = -(3^4) = -(3 \times 3 \times 3 \times 3) = -81" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visualisasi perbandingan */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">⚡ PERBANDINGAN LANGSUNG:</p>
                  <div className="grid grid-cols-2 gap-3 text-center font-body text-sm">
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-cyan-300 font-bold text-xs mb-1">dengan kurung</p>
                      <p className="text-white"><InlineMath math="(-3)^2 = 9" /></p>
                      <p className="text-white"><InlineMath math="(-3)^3 = -27" /></p>
                      <p className="text-white"><InlineMath math="(-3)^4 = 81" /></p>
                    </div>
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3">
                      <p className="text-pink-300 font-bold text-xs mb-1">tanpa kurung</p>
                      <p className="text-white"><InlineMath math="-3^2 = -9" /></p>
                      <p className="text-white"><InlineMath math="-3^3 = -27" /></p>
                      <p className="text-white"><InlineMath math="-3^4 = -81" /></p>
                    </div>
                  </div>
                  <p className="font-body text-xs text-white/50 text-center mt-3">Perhatikan: <InlineMath math="-3^n" /> selalu negatif, sedangkan <InlineMath math="(-3)^n" /> bisa positif atau negatif tergantung pangkatnya!</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan Penting:</strong> <InlineMath math="-a^n \neq (-a)^n" /> kecuali jika pangkatnya ganjil! Pada pangkat ganjil, keduanya memang sama-sama negatif. Tapi pada pangkat genap, hasilnya berbeda tanda!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh4")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">📝 Contoh Soal — Perbedaan <InlineMath math="(-a)^n" /> dan <InlineMath math="-a^n" /></span>
              </div>
              {expandedSections.includes("contoh4") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan apakah nilai berikut positif atau negatif, lalu hitung: <InlineMath math="(-7)^2" /> dan <InlineMath math="-7^2" />
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong className="text-cyan-300"><InlineMath math="(-7)^2" />:</strong> Basis = <InlineMath math="-7" />, pangkat genap → <strong className="text-green-400">positif</strong></p>
                        <BlockMath math="(-7)^2 = (-7) \times (-7) = +49" />
                        <p><strong className="text-pink-300"><InlineMath math="-7^2" />:</strong> Dipangkatkan dulu baru dinegatifkan → <strong className="text-red-400">negatif</strong></p>
                        <BlockMath math="-7^2 = -(7^2) = -(49) = -49" />
                      </div>
                      <p>Kesimpulan: <InlineMath math="(-7)^2 \neq -7^2" /> karena <InlineMath math="49 \neq -49" />!</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Hitunglah: <InlineMath math="(-5)^3 - (-5^3)" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>Langkah 1:</strong> Hitung <InlineMath math="(-5)^3" />:</p>
                        <BlockMath math="(-5)^3 = (-5) \times (-5) \times (-5) = -125" />
                        <p><strong>Langkah 2:</strong> Hitung <InlineMath math="-5^3" />:</p>
                        <BlockMath math="-5^3 = -(5^3) = -(125) = -125" />
                        <p><strong>Langkah 3:</strong> Kurangkan:</p>
                        <BlockMath math="(-5)^3 - (-5^3) = -125 - (-125) = -125 + 125 = 0" />
                      </div>
                      <p>Menarik! Pada pangkat ganjil, <InlineMath math="(-a)^n = -a^n" />, jadi hasilnya nol.</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sederhanakan dan tentukan tanda dari: <InlineMath math="(-2)^4 + (-2^4) + (-2)^5 + (-2^5)" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung tiap suku:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p><InlineMath math="(-2)^4 = 16" /> <span className="text-green-400">(genap → +)</span></p>
                        <p><InlineMath math="-2^4 = -(16) = -16" /> <span className="text-red-400">(selalu −)</span></p>
                        <p><InlineMath math="(-2)^5 = -32" /> <span className="text-red-400">(ganjil → −)</span></p>
                        <p><InlineMath math="-2^5 = -(32) = -32" /> <span className="text-red-400">(selalu −)</span></p>
                      </div>
                      <p><strong>Langkah 2:</strong> Jumlahkan semua:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="16 + (-16) + (-32) + (-32) = 0 - 64 = -64" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="-64" /></strong> (negatif)</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Rangkuman Akhir */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-cyan-300 text-center">🌟 RANGKUMAN MATERI</p>
            <div className="space-y-2 font-body text-xs text-white/80">
              <p>✅ <strong>Bilangan berpangkat</strong> <InlineMath math="a^n" /> = perkalian <InlineMath math="a" /> sebanyak <InlineMath math="n" /> kali</p>
              <p>✅ <strong>Pecahan berpangkat:</strong> <InlineMath math="(p/q)^n = p^n/q^n" /></p>
              <p>✅ <strong>Negatif pangkat genap</strong> = hasil <strong className="text-green-400">positif</strong></p>
              <p>✅ <strong>Negatif pangkat ganjil</strong> = hasil <strong className="text-red-400">negatif</strong></p>
              <p>✅ <strong><InlineMath math="(-a)^n" /></strong> ≠ <strong><InlineMath math="-a^n" /></strong> (kecuali pangkat ganjil)</p>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bilangan-berpangkat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianNotasiPangkatPage;
