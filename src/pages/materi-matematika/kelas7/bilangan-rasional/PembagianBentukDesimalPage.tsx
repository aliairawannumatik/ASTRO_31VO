import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, Lightbulb, AlertCircle, Calculator, Zap, Hash } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const PembagianBentukDesimalPage = () => {
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
          PEMBAGIAN BENTUK DESIMAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 7 - Bilangan Rasional</p>

        {/* Sub-bab 1: Pembagian Desimal dengan 10, 100, 1000 */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => toggleSection(0)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Pembagian Desimal dengan 10, 100, 1000</span>
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
                  Membagi bilangan desimal dengan <strong>10, 100, atau 1000</strong> itu kebalikan dari perkalian! 
                  Kamu cukup <strong>geser tanda koma ke kiri</strong> sesuai jumlah angka nol pada pembagi. 
                  Kalau dibagi 10, geser 1 tempat ke kiri. Dibagi 100? Geser 2 tempat. Dibagi 1000? Geser 3 tempat. Praktis banget!
                </p>
              </div>

              {/* Rumus Utama */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Aturan Pergeseran Koma:</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">:10</span>
                    <span className="text-white/80 text-sm">Geser koma <strong className="text-purple-300">1 tempat</strong> ke kiri</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">:100</span>
                    <span className="text-white/80 text-sm">Geser koma <strong className="text-purple-300">2 tempat</strong> ke kiri</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">:1000</span>
                    <span className="text-white/80 text-sm">Geser koma <strong className="text-purple-300">3 tempat</strong> ke kiri</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Hitung jumlah angka nol pada pembagi (10, 100, 1000)</li>
                  <li>Jika tempat di depan koma kurang, tambahkan angka 0 di depan</li>
                  <li>Ingat: pembagian = geser koma ke <strong>KIRI</strong> (kebalikan dari perkalian)</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil pembagian <InlineMath math="234,5 \div 10" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi pembagi</p>
                    <div className="pl-4">Pembagi adalah 10 (memiliki 1 angka nol)</div>
                    <p><strong>Langkah 2:</strong> Geser tanda koma ke kiri sebanyak 1 tempat</p>
                    <div className="pl-4">
                      <InlineMath math="234,5 \rightarrow 23,45" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="234,5 \div 10 = 23,45" /></p>
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
                  Hitunglah hasil pembagian <InlineMath math="3456,78 \div 1000" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi pembagi</p>
                    <div className="pl-4">Pembagi adalah 1000 (memiliki 3 angka nol)</div>
                    <p><strong>Langkah 2:</strong> Geser tanda koma ke kiri sebanyak 3 tempat</p>
                    <div className="pl-4">
                      <InlineMath math="3456,78 \rightarrow 3,45678" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="3456,78 \div 1000 = 3,45678" /></p>
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
                  Hitunglah hasil pembagian <InlineMath math="3456,78 \div 100.000" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi pembagi</p>
                    <div className="pl-4">Pembagi adalah 100.000 (memiliki 5 angka nol)</div>
                    <p><strong>Langkah 2:</strong> Perhatikan bahwa 3456,78 hanya punya 4 angka di depan koma</p>
                    <div className="pl-4">Kita perlu menambah 1 angka nol di depan: <InlineMath math="03456,78" /></div>
                    <p><strong>Langkah 3:</strong> Geser tanda koma ke kiri sebanyak 5 tempat</p>
                    <div className="pl-4">
                      <InlineMath math="03456,78 \rightarrow 0,0345678" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="3456,78 \div 100.000 = 0,0345678" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 2: Pembagian Desimal dengan Desimal */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => toggleSection(1)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Calculator className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Pembagian Desimal dengan Desimal</span>
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
                  Membagi bilangan desimal dengan bilangan desimal lainnya butuh trik khusus: 
                  <strong> ubah pembagi menjadi bilangan bulat terlebih dahulu!</strong> Caranya? 
                  Kalikan pembilang dan pembagi dengan angka yang sama (10, 100, atau 1000) 
                  sampai pembaginya jadi bilangan bulat. Setelah itu, tinggal bagi seperti biasa!
                </p>
              </div>

              {/* Rumus */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Strategi Pembagian Desimal:</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <p className="text-white/90 text-sm mb-2">Ubah bentuk pembagian menjadi pecahan:</p>
                  <BlockMath math="\frac{a}{b} = \frac{a \times n}{b \times n}" />
                  <p className="text-white/70 text-xs mt-2">di mana <InlineMath math="n" /> adalah 10, 100, atau 1000 agar pembagi menjadi bilangan bulat</p>
                </div>
              </div>

              {/* Ilustrasi */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <h4 className="text-slate-300 font-semibold text-sm mb-3">Ilustrasi Konsep:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 mb-2">Contoh: <InlineMath math="14,245 \div 0,7" /></p>
                    <p className="text-white/70">Pembagi 0,7 punya 1 desimal</p>
                    <p className="text-white/70">Kalikan keduanya dengan 10</p>
                    <p className="text-green-300 mt-2"><InlineMath math="= \frac{142,45}{7}" /></p>
                  </div>
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 mb-2">Contoh: <InlineMath math="1,03248 \div 0,012" /></p>
                    <p className="text-white/70">Pembagi 0,012 punya 3 desimal</p>
                    <p className="text-white/70">Kalikan keduanya dengan 1000</p>
                    <p className="text-green-300 mt-2"><InlineMath math="= \frac{1032,48}{12}" /></p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Fokus pada pembagi - hitung berapa angka di belakang komanya</li>
                  <li>Kalikan pembilang dan pembagi dengan kelipatan 10 yang sama</li>
                  <li>Setelah pembagi jadi bilangan bulat, lakukan pembagian biasa</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Hitunglah hasil pembagian <InlineMath math="14,245 \div 0,7" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah menjadi bentuk pecahan</p>
                    <div className="pl-4">
                      <InlineMath math="14,245 \div 0,7 = \frac{14,245}{0,7}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Kalikan pembilang dan pembagi dengan 10</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{14,245 \times 10}{0,7 \times 10} = \frac{142,45}{7}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Lakukan pembagian</p>
                    <div className="pl-4">
                      <InlineMath math="142,45 \div 7 = 20,35" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="14,245 \div 0,7 = 20,35" /></p>
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
                  Hitunglah hasil pembagian <InlineMath math="1,03248 \div 0,012" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah menjadi bentuk pecahan</p>
                    <div className="pl-4">
                      <InlineMath math="1,03248 \div 0,012 = \frac{1,03248}{0,012}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Pembagi punya 3 angka desimal, kalikan dengan 1000</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{1,03248 \times 1000}{0,012 \times 1000} = \frac{1032,48}{12}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Lakukan pembagian</p>
                    <div className="pl-4">
                      <InlineMath math="1032,48 \div 12 = 86,04" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="1,03248 \div 0,012 = 86,04" /></p>
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
                  Hitunglah hasil pembagian <InlineMath math="0,4563 \div 0,0015" />
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Ubah menjadi bentuk pecahan</p>
                    <div className="pl-4">
                      <InlineMath math="0,4563 \div 0,0015 = \frac{0,4563}{0,0015}" />
                    </div>
                    <p><strong>Langkah 2:</strong> Pembagi punya 4 angka desimal, kalikan dengan 10.000</p>
                    <div className="pl-4">
                      <InlineMath math="= \frac{0,4563 \times 10000}{0,0015 \times 10000} = \frac{4563}{15}" />
                    </div>
                    <p><strong>Langkah 3:</strong> Lakukan pembagian</p>
                    <div className="pl-4">
                      <InlineMath math="4563 \div 15 = 304,2" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="0,4563 \div 0,0015 = 304,2" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 3: Aplikasi Pembagian Desimal dalam Kehidupan */}
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
                  Pembagian desimal bukan cuma teori di buku pelajaran! Kamu akan sering menemukannya 
                  dalam kehidupan nyata, misalnya saat <strong>menghitung harga satuan</strong>, 
                  <strong> membagi makanan</strong>, atau <strong>menghitung kecepatan rata-rata</strong>. 
                  Yuk, latihan dengan contoh-contoh praktis!
                </p>
              </div>

              {/* Contoh Aplikasi */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <h4 className="text-slate-300 font-semibold text-sm mb-3">Contoh Penggunaan Sehari-hari:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-black/30 rounded p-3 text-center">
                    <span className="text-2xl mb-2 block">🛒</span>
                    <p className="text-cyan-300">Harga per unit</p>
                    <p className="text-white/60 text-xs">Rp15.750 : 2,5 kg</p>
                  </div>
                  <div className="bg-black/30 rounded p-3 text-center">
                    <span className="text-2xl mb-2 block">⛽</span>
                    <p className="text-cyan-300">Konsumsi BBM</p>
                    <p className="text-white/60 text-xs">125,5 km : 8,5 liter</p>
                  </div>
                  <div className="bg-black/30 rounded p-3 text-center">
                    <span className="text-2xl mb-2 block">📏</span>
                    <p className="text-cyan-300">Pembagian panjang</p>
                    <p className="text-white/60 text-xs">18,6 m : 1,2 bagian</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Baca soal cerita dengan teliti, identifikasi mana yang dibagi dan pembaginya</li>
                  <li>Perhatikan satuan dalam soal (rupiah, kg, meter, liter)</li>
                  <li>Gunakan teknik mengubah pembagi jadi bilangan bulat untuk mempermudah</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Andi membeli 2,5 kg gula dengan harga Rp37.500. Berapakah harga gula per kilogram?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Diketahui:</strong></p>
                    <div className="pl-4">
                      <p>Total harga = Rp37.500</p>
                      <p>Berat gula = 2,5 kg</p>
                    </div>
                    <p><strong>Ditanya:</strong> Harga per kilogram</p>
                    <p><strong>Penyelesaian:</strong></p>
                    <div className="pl-4">
                      <p>Harga per kg = <InlineMath math="\frac{37500}{2,5}" /></p>
                      <p className="mt-1">Kalikan dengan 10: <InlineMath math="= \frac{375000}{25} = 15000" /></p>
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Harga gula per kilogram adalah <strong>Rp15.000</strong></p>
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
                  Sebuah mobil menempuh jarak 187,5 km dengan menghabiskan 12,5 liter bensin. 
                  Berapa kilometer yang dapat ditempuh mobil tersebut untuk setiap liter bensin?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Diketahui:</strong></p>
                    <div className="pl-4">
                      <p>Jarak tempuh = 187,5 km</p>
                      <p>Bensin yang dipakai = 12,5 liter</p>
                    </div>
                    <p><strong>Ditanya:</strong> Jarak per liter bensin</p>
                    <p><strong>Penyelesaian:</strong></p>
                    <div className="pl-4">
                      <p>Jarak per liter = <InlineMath math="\frac{187,5}{12,5}" /></p>
                      <p className="mt-1">Kalikan dengan 10: <InlineMath math="= \frac{1875}{125}" /></p>
                      <p className="mt-1">Hitung: <InlineMath math="= 15" /></p>
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Mobil dapat menempuh <strong>15 km per liter bensin</strong></p>
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
                  Seutas tali sepanjang 24,36 meter akan dipotong menjadi beberapa bagian. 
                  Setiap bagian memiliki panjang 0,84 meter. Berapa banyak potongan tali yang didapat 
                  dan berapa sisa panjang tali yang tidak terpotong?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Diketahui:</strong></p>
                    <div className="pl-4">
                      <p>Panjang tali = 24,36 meter</p>
                      <p>Panjang setiap potongan = 0,84 meter</p>
                    </div>
                    <p><strong>Ditanya:</strong> Jumlah potongan dan sisa tali</p>
                    <p><strong>Penyelesaian:</strong></p>
                    <div className="pl-4">
                      <p>Jumlah potongan = <InlineMath math="\frac{24,36}{0,84}" /></p>
                      <p className="mt-1">Kalikan dengan 100: <InlineMath math="= \frac{2436}{84} = 29" /></p>
                      <p className="mt-1">Cek: <InlineMath math="29 \times 0,84 = 24,36" /> meter</p>
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Didapat <strong>29 potongan tali</strong> dan <strong>tidak ada sisa</strong> (habis terbagi)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">➗ RANGKUMAN LENGKAP</p>
            <p className="font-body text-xs text-white/80 mt-0.5">Pembagian Bentuk Desimal — Kelas 7</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-green-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/30 border border-green-500 flex items-center justify-center text-[10px]">1</span>
                Aturan Pembagian Desimal
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Kalikan keduanya agar pembagi jadi bilangan bulat", desc: "4,8 ÷ 0,12 → kalikan ×100 → 480 ÷ 12 = 40. Selalu kalikan pembagi dan yang dibagi dengan 10ⁿ yang sama!", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
                  { label: "Jumlah desimal menentukan pengali", desc: "Pembagi 0,12 punya 2 desimal → kalikan ×100. Pembagi 0,5 punya 1 desimal → kalikan ×10.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
                  { label: "Pembagian dengan 10, 100, 1000", desc: "Geser koma ke kiri! 56,4 ÷ 10 = 5,64. 56,4 ÷ 100 = 0,564. 56,4 ÷ 1000 = 0,0564", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
                  { label: "Hasilnya bisa pecahan tak berulang atau berulang", desc: "1 ÷ 3 = 0,333... (berulang). 1 ÷ 4 = 0,25 (berhenti). Kenali keduanya!", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
                ].map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div><p className="font-body text-xs font-bold">{label}</p><p className="font-body text-xs text-white/65 mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                Tips &amp; Trik Jitu
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🎯", tip: "Jadikan pembagi bilangan bulat SELALU!", detail: "Aturan emas pembagian desimal: buat pembagi jadi bilangan bulat dengan kalikan ×10ⁿ. Setelah itu, hitung biasa.", color: "bg-green-900/30 border-green-500/30" },
                  { icon: "⬅️", tip: "÷10ⁿ = geser koma ke kiri n langkah", detail: "123,4 ÷ 100 = 1,234. Hanya perlu menggeser koma — tidak perlu menghitung panjang!", color: "bg-teal-900/30 border-teal-500/30" },
                  { icon: "✅", tip: "Verifikasi dengan perkalian balik", detail: "Jika 4,8 ÷ 0,12 = 40, cek: 40 × 0,12 = 4,8 ✓. Sangat mudah untuk mengecek jawaban!", color: "bg-emerald-900/30 border-emerald-500/30" },
                  { icon: "🎲", tip: "Estimasi kewajaran hasil", detail: "4,8 ÷ 0,12 ≈ 5 ÷ 0,1 = 50. Hasil 40 dekat dari estimasi 50 → wajar! Jika dapat 4 atau 400, ada yang salah.", color: "bg-cyan-900/30 border-cyan-500/30" },
                ].map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 via-teal-500/15 to-emerald-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌿</div>
              <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Pembagian desimal memiliki <strong className="text-green-300">satu strategi utama: ubah pembagi menjadi bilangan bulat</strong> dengan mengalikan keduanya dengan 10ⁿ. Setelah pembagi menjadi bilangan bulat, lakukan pembagian biasa. Dan untuk pembagian dengan 10ⁿ, cukup <strong className="text-yellow-300">geser koma ke kiri</strong> — tidak perlu menghitung!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {["Kalikan ×10ⁿ dulu", "Pembagi jadi bulat", "÷10ⁿ = geser kiri", "Verifikasi ×balik", "Estimasi kewajaran"].map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🚀 Lanjut ke Pembulatan Bilangan Desimal!</p>
            </div>
          </div>
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

export default PembagianBentukDesimalPage;
