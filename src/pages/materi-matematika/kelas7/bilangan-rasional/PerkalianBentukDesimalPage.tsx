import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, Lightbulb, AlertCircle, Calculator, Zap, Hash } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const PerkalianBentukDesimalPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    playPopSound();
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-4xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERKALIAN BENTUK DESIMAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 7 - Bilangan Rasional</p>

        {/* Sub-bab 1: Perkalian Desimal dengan 10, 100, 1000 */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => toggleSection(0)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Perkalian Desimal dengan 10, 100, 1000</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 0 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 0 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
                <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  Mengalikan bilangan desimal dengan <strong>10, 100, atau 1000</strong> itu gampang banget! 
                  Kamu cukup <strong>geser tanda koma ke kanan</strong> sesuai jumlah angka nol pada pengali. 
                  Kalau dikali 10, geser 1 tempat. Dikali 100? Geser 2 tempat. Dikali 1000? Geser 3 tempat. Simpel, kan?
                </p>
              </div>

              {/* Rumus Utama */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Aturan Pergeseran Koma:</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">x10</span>
                    <span className="text-white/80 text-sm">Geser koma <strong className="text-purple-300">1 tempat</strong> ke kanan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">x100</span>
                    <span className="text-white/80 text-sm">Geser koma <strong className="text-purple-300">2 tempat</strong> ke kanan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">x1000</span>
                    <span className="text-white/80 text-sm">Geser koma <strong className="text-purple-300">3 tempat</strong> ke kanan</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Hitung jumlah angka nol pada pengali (10, 100, 1000)</li>
                  <li>Jika tempat desimal kurang, tambahkan angka 0 di belakang</li>
                  <li>Cara ini jauh lebih cepat dari perkalian biasa!</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="46,72 \times 10" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi pengali</p>
                    <div className="pl-4">Pengali adalah 10 (memiliki 1 angka nol)</div>
                    <p><strong>Langkah 2:</strong> Geser tanda koma ke kanan sebanyak 1 tempat</p>
                    <div className="pl-4">
                      <InlineMath math="46,72 \rightarrow 467,2" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="46,72 \times 10 = 467,2" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 2 - Sedang */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">SEDANG</span>
                  <span className="text-yellow-300 font-semibold text-sm">Contoh Soal 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="2,3467 \times 1000" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi pengali</p>
                    <div className="pl-4">Pengali adalah 1000 (memiliki 3 angka nol)</div>
                    <p><strong>Langkah 2:</strong> Geser tanda koma ke kanan sebanyak 3 tempat</p>
                    <div className="pl-4">
                      <InlineMath math="2,3467 \rightarrow 2346,7" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="2,3467 \times 1000 = 2346,7" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 3 - Sulit */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">SULIT</span>
                  <span className="text-red-300 font-semibold text-sm">Contoh Soal 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="8,6543 \times 100.000" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi pengali</p>
                    <div className="pl-4">Pengali adalah 100.000 (memiliki 5 angka nol)</div>
                    <p><strong>Langkah 2:</strong> Perhatikan bahwa 8,6543 hanya punya 4 angka di belakang koma</p>
                    <div className="pl-4">Kita perlu menambah 1 angka nol di belakang: <InlineMath math="8,65430" /></div>
                    <p><strong>Langkah 3:</strong> Geser tanda koma ke kanan sebanyak 5 tempat</p>
                    <div className="pl-4">
                      <InlineMath math="8,65430 \rightarrow 865430" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="8,6543 \times 100.000 = 865.430" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 2: Perkalian Desimal dengan Desimal */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => toggleSection(1)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Calculator className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Perkalian Desimal dengan Desimal</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 1 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 1 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  Saat mengalikan dua bilangan desimal, ada trik keren yang bisa kamu pakai: 
                  <strong> jumlahkan semua angka di belakang koma</strong> dari kedua bilangan. 
                  Angka totalnya itulah yang menentukan posisi koma pada hasil akhir. 
                  Kalikan dulu seperti bilangan bulat biasa, baru tentukan posisi komanya!
                </p>
              </div>

              {/* Rumus */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Aturan Tempat Desimal:</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <p className="text-white/90 text-sm mb-2">Jumlah angka di belakang koma pada hasil =</p>
                  <BlockMath math="\text{Tempat desimal pengali 1} + \text{Tempat desimal pengali 2}" />
                </div>
              </div>

              {/* Ilustrasi */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <h4 className="text-slate-300 font-semibold text-sm mb-3">Ilustrasi Konsep:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 mb-2">Contoh: <InlineMath math="0,25 \times 0,87" /></p>
                    <p className="text-white/70">0,25 = 2 tempat desimal</p>
                    <p className="text-white/70">0,87 = 2 tempat desimal</p>
                    <p className="text-green-300 mt-2">Total = 4 tempat desimal</p>
                  </div>
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 mb-2">Contoh: <InlineMath math="1,8 \times 1,3626" /></p>
                    <p className="text-white/70">1,8 = 1 tempat desimal</p>
                    <p className="text-white/70">1,3626 = 4 tempat desimal</p>
                    <p className="text-green-300 mt-2">Total = 5 tempat desimal</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Abaikan dulu tanda koma saat mengalikan</li>
                  <li>Hitung total tempat desimal dari kedua pengali</li>
                  <li>Letakkan koma dari kanan sebanyak total tempat desimal</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="0,25 \times 0,87" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Hitung jumlah tempat desimal</p>
                    <div className="pl-4">
                      <p>0,25 memiliki 2 tempat desimal</p>
                      <p>0,87 memiliki 2 tempat desimal</p>
                      <p className="text-yellow-300">Total = 2 + 2 = 4 tempat desimal</p>
                    </div>
                    <p><strong>Langkah 2:</strong> Kalikan seperti bilangan bulat</p>
                    <div className="pl-4">
                      <InlineMath math="25 \times 87 = 2175" />
                    </div>
                    <p><strong>Langkah 3:</strong> Letakkan koma (4 angka dari kanan)</p>
                    <div className="pl-4">
                      <InlineMath math="2175 \rightarrow 0,2175" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="0,25 \times 0,87 = 0,2175" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 2 - Sedang */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">SEDANG</span>
                  <span className="text-yellow-300 font-semibold text-sm">Contoh Soal 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="6,4 \times 1,38" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Hitung jumlah tempat desimal</p>
                    <div className="pl-4">
                      <p>6,4 memiliki 1 tempat desimal</p>
                      <p>1,38 memiliki 2 tempat desimal</p>
                      <p className="text-yellow-300">Total = 1 + 2 = 3 tempat desimal</p>
                    </div>
                    <p><strong>Langkah 2:</strong> Kalikan seperti bilangan bulat</p>
                    <div className="pl-4">
                      <BlockMath math="64 \times 138 = 8832" />
                    </div>
                    <p><strong>Langkah 3:</strong> Letakkan koma (3 angka dari kanan)</p>
                    <div className="pl-4">
                      <InlineMath math="8832 \rightarrow 8,832" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="6,4 \times 1,38 = 8,832" /></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 3 - Sulit */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">SULIT</span>
                  <span className="text-red-300 font-semibold text-sm">Contoh Soal 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil perkalian <InlineMath math="3,67 \times 4,258" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Hitung jumlah tempat desimal</p>
                    <div className="pl-4">
                      <p>3,67 memiliki 2 tempat desimal</p>
                      <p>4,258 memiliki 3 tempat desimal</p>
                      <p className="text-yellow-300">Total = 2 + 3 = 5 tempat desimal</p>
                    </div>
                    <p><strong>Langkah 2:</strong> Kalikan seperti bilangan bulat</p>
                    <div className="pl-4">
                      <BlockMath math="367 \times 4258 = 1.562.686" />
                    </div>
                    <p><strong>Langkah 3:</strong> Letakkan koma (5 angka dari kanan)</p>
                    <div className="pl-4">
                      <InlineMath math="1562686 \rightarrow 15,62686" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="3,67 \times 4,258 = 15,62686" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 3: Aplikasi Perkalian Desimal dalam Kehidupan */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => toggleSection(2)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Hash className="w-5 h-5 text-orange-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Aplikasi dalam Kehidupan Sehari-hari</span>
            <ChevronRight className={`w-4 h-4 text-primary ml-auto transition-transform ${activeSection === 2 ? 'rotate-90' : ''}`} />
          </button>
          
          {activeSection === 2 && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg p-4">
                <h3 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">
                  Perkalian bilangan desimal sering banget kita temui dalam kehidupan sehari-hari. 
                  Mulai dari menghitung <strong>harga barang</strong>, <strong>konsumsi bahan bakar</strong>, 
                  <strong>pengukuran berat</strong>, hingga <strong>perhitungan luas</strong>. 
                  Dengan menguasai teknik ini, kamu bisa lebih mudah memecahkan berbagai masalah praktis!
                </p>
              </div>

              {/* Contoh Penerapan */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <h4 className="text-slate-300 font-semibold text-sm mb-3">Contoh Penerapan:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    Menghitung total belanja
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Konsumsi bensin kendaraan
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Perhitungan luas tanah
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Konversi mata uang
                  </div>
                </div>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Sebuah toko menjual apel seharga Rp15.500 per kg. Berapakah harga yang harus dibayar jika membeli 2,5 kg apel?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Tulis persamaan matematika</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Harga total} = 15.500 \times 2,5" />
                    </div>
                    <p><strong>Langkah 2:</strong> Hitung perkalian</p>
                    <div className="pl-4">
                      <p>15.500 memiliki 0 tempat desimal</p>
                      <p>2,5 memiliki 1 tempat desimal</p>
                      <p><InlineMath math="15500 \times 25 = 387.500" /></p>
                      <p>Letakkan koma (1 angka dari kanan): 38.750,0</p>
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Harga yang harus dibayar adalah <strong>Rp38.750</strong></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 2 - Sedang */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">SEDANG</span>
                  <span className="text-yellow-300 font-semibold text-sm">Contoh Soal 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Sebuah mobil mengonsumsi bensin 8,5 liter untuk menempuh jarak 100 km. 
                  Jika harga bensin Rp12.650 per liter, berapa biaya bensin untuk perjalanan sejauh 350 km?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Hitung kebutuhan bensin untuk 350 km</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Bensin} = \frac{350}{100} \times 8,5 = 3,5 \times 8,5 = 29,75 \text{ liter}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Hitung total biaya</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Biaya} = 29,75 \times 12.650" />
                    </div>
                    <p><strong>Langkah 3:</strong> Hitung perkalian desimal</p>
                    <div className="pl-4">
                      <p>29,75 (2 tempat desimal) × 12.650 (0 tempat desimal)</p>
                      <p><InlineMath math="2975 \times 12650 = 37.633.750" /></p>
                      <p>Total = 2 tempat desimal = 376.337,50</p>
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Biaya bensin adalah <strong>Rp376.337,50</strong></p>
                  </div>
                </div>
              </div>

              {/* Contoh Soal 3 - Sulit */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">SULIT</span>
                  <span className="text-red-300 font-semibold text-sm">Contoh Soal 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Pak Ahmad memiliki sebidang tanah berbentuk persegi panjang dengan panjang 12,75 m dan lebar 8,4 m. 
                  Ia ingin memasang keramik dengan ukuran 0,3 m × 0,3 m. Jika harga keramik Rp25.000 per buah, 
                  berapa total biaya yang dibutuhkan untuk membeli keramik?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Hitung luas tanah</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Luas tanah} = 12,75 \times 8,4 = 107,1 \text{ m}^2" />
                    </div>
                    <p><strong>Langkah 2:</strong> Hitung luas satu keramik</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Luas keramik} = 0,3 \times 0,3 = 0,09 \text{ m}^2" />
                    </div>
                    <p><strong>Langkah 3:</strong> Hitung jumlah keramik yang dibutuhkan</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Jumlah} = \frac{107,1}{0,09} = 1190 \text{ buah}" />
                    </div>
                    <p><strong>Langkah 4:</strong> Hitung total biaya</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Biaya} = 1190 \times 25.000 = 29.750.000" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Total biaya keramik adalah <strong>Rp29.750.000</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Kembali */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-rasional"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Rasional
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianBentukDesimalPage;
