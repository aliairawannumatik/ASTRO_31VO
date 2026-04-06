import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, Lightbulb, AlertCircle, Target, Hash, Circle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const PembulatanBentukDesimalPage = () => {
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
          PEMBULATAN BENTUK DESIMAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 7 - Bilangan Rasional</p>

        {/* Sub-bab 1: Aturan Dasar Pembulatan Desimal */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => toggleSection(0)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Target className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Aturan Dasar Pembulatan Desimal</span>
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
                  <strong>Pembulatan desimal</strong> adalah teknik menyederhanakan angka desimal ke jumlah tempat tertentu. 
                  Konsepnya sederhana: lihat angka di belakang posisi yang ingin kamu bulatkan. 
                  Jika angka itu <strong>5 atau lebih</strong>, bulatkan ke atas (tambah 1). 
                  Kalau <strong>kurang dari 5</strong>, cukup hilangkan saja angka sisanya!
                </p>
              </div>

              {/* Ilustrasi Visual */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <h4 className="text-slate-300 font-semibold text-sm mb-3">Ilustrasi Pembulatan:</h4>
                <div className="overflow-x-auto">
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sAb4zSyRJ4SV95WJABkpgzwNQw7fj0.png" 
                    alt="Ilustrasi pembulatan desimal dengan pensil" 
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                </div>
                <p className="text-white/70 text-xs text-center mt-2">
                  Contoh: Panjang pensil 9,59 cm dibulatkan menjadi 9,6 cm (karena 9 {">"} 5)
                </p>
              </div>

              {/* Aturan Pembulatan */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Aturan Pembulatan:</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded shrink-0">Angka {"≥"} 5</span>
                    <div className="text-white/80 text-sm">
                      <strong className="text-green-300">Bulatkan ke atas!</strong>
                      <p className="text-white/70 mt-1">Angka di depannya bertambah 1</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded shrink-0">Angka {"<"} 5</span>
                    <div className="text-white/80 text-sm">
                      <strong className="text-red-300">Bulatkan ke bawah!</strong>
                      <p className="text-white/70 mt-1">Angka di depannya tetap (tidak berubah)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cara Menentukan Posisi */}
              <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                <h4 className="text-orange-300 font-semibold text-sm mb-3">Cara Menentukan Posisi Pembulatan:</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-2 text-sm text-white/80">
                  <p><strong className="text-orange-200">1 desimal:</strong> Lihat angka desimal ke-2</p>
                  <p><strong className="text-orange-200">2 desimal:</strong> Lihat angka desimal ke-3</p>
                  <p><strong className="text-orange-200">3 desimal:</strong> Lihat angka desimal ke-4</p>
                  <p className="text-white/60 italic mt-2">...dan seterusnya!</p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Selalu tentukan dulu: mau dibulatkan sampai berapa desimal?</li>
                  <li>Cek angka <strong>tepat setelah</strong> posisi pembulatan</li>
                  <li>Ingat: 5 itu batas! Angka 5, 6, 7, 8, 9 = bulatkan ke atas</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Bulatkan <InlineMath math="4,638" /> sampai <strong>satu desimal</strong>
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka yang akan dibulatkan</p>
                    <div className="pl-4">
                      <InlineMath math="4,\underline{6}38" /> - Angka 6 adalah desimal ke-1 (yang akan dipertahankan)
                    </div>
                    <p><strong>Langkah 2:</strong> Lihat angka desimal ke-2 (setelah posisi pembulatan)</p>
                    <div className="pl-4">
                      Angka desimal ke-2 adalah <InlineMath math="3" /> (kurang dari 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 3 {"<"} 5, maka angka 6 <strong>tetap</strong></p>
                    <div className="pl-4">
                      Angka setelahnya dihilangkan
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="4,638 \approx 4,6" /></p>
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
                  Bulatkan <InlineMath math="5,70642" /> sampai <strong>dua desimal</strong>
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka yang akan dibulatkan</p>
                    <div className="pl-4">
                      <InlineMath math="5,7\underline{0}642" /> - Angka 0 adalah desimal ke-2 (yang akan dipertahankan)
                    </div>
                    <p><strong>Langkah 2:</strong> Lihat angka desimal ke-3 (setelah posisi pembulatan)</p>
                    <div className="pl-4">
                      Angka desimal ke-3 adalah <InlineMath math="6" /> (lebih dari 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 6 {">="} 5, maka angka 0 <strong>bertambah 1</strong></p>
                    <div className="pl-4">
                      <InlineMath math="0 + 1 = 1" />, jadi hasilnya adalah 5,71
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="5,70642 \approx 5,71" /></p>
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
                  Bulatkan <InlineMath math="7,638524" /> sampai <strong>tiga desimal</strong>
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka yang akan dibulatkan</p>
                    <div className="pl-4">
                      <InlineMath math="7,63\underline{8}524" /> - Angka 8 adalah desimal ke-3 (yang akan dipertahankan)
                    </div>
                    <p><strong>Langkah 2:</strong> Lihat angka desimal ke-4 (setelah posisi pembulatan)</p>
                    <div className="pl-4">
                      Angka desimal ke-4 adalah <InlineMath math="5" /> (sama dengan 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 5 {">="} 5, maka angka 8 <strong>bertambah 1</strong></p>
                    <div className="pl-4">
                      <InlineMath math="8 + 1 = 9" />, jadi hasilnya adalah 7,639
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="7,638524 \approx 7,639" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 2: Pembulatan ke Bilangan Satuan (Bulat) */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => toggleSection(1)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Circle className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Pembulatan ke Bilangan Satuan</span>
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
                  Kadang kita butuh bilangan bulat, bukan desimal. Nah, <strong>pembulatan ke bilangan satuan</strong> 
                  akan mengubah angka desimal menjadi bilangan bulat terdekat. Caranya sama: 
                  lihat angka desimal pertama (angka persepuluhan). Jika <strong>5 atau lebih</strong>, 
                  satuan naik 1. Kalau <strong>kurang dari 5</strong>, satuan tetap!
                </p>
              </div>

              {/* Aturan */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">Aturan Pembulatan ke Satuan:</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded shrink-0">Persepuluhan {"≥"} 5</span>
                    <div className="text-white/80 text-sm">
                      <strong className="text-green-300">Satuan bertambah 1</strong>
                      <p className="text-white/70 mt-1">Semua angka desimal dihilangkan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded shrink-0">Persepuluhan {"<"} 5</span>
                    <div className="text-white/80 text-sm">
                      <strong className="text-red-300">Satuan tetap</strong>
                      <p className="text-white/70 mt-1">Semua angka desimal dihilangkan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Perhatikan angka desimal ke-1 saja (angka persepuluhan)</li>
                  <li>Pembulatan ke satuan = pembulatan ke 0 desimal</li>
                  <li>Hasil akhir selalu bilangan bulat tanpa koma</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Bulatkan <InlineMath math="111,48" /> ke bilangan satuan terdekat
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka satuan dan persepuluhan</p>
                    <div className="pl-4">
                      <InlineMath math="11\underline{1},48" /> - Satuan = 1, Persepuluhan = 4
                    </div>
                    <p><strong>Langkah 2:</strong> Cek angka persepuluhan</p>
                    <div className="pl-4">
                      Angka persepuluhan adalah <InlineMath math="4" /> (kurang dari 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 4 {"<"} 5, maka angka satuan <strong>tetap</strong></p>
                    <div className="pl-4">
                      Semua angka desimal dihilangkan
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="111,48 \approx 111" /></p>
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
                  Bulatkan <InlineMath math="613,54" /> ke bilangan satuan terdekat
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka satuan dan persepuluhan</p>
                    <div className="pl-4">
                      <InlineMath math="61\underline{3},54" /> - Satuan = 3, Persepuluhan = 5
                    </div>
                    <p><strong>Langkah 2:</strong> Cek angka persepuluhan</p>
                    <div className="pl-4">
                      Angka persepuluhan adalah <InlineMath math="5" /> (sama dengan 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 5 {">="} 5, maka angka satuan <strong>bertambah 1</strong></p>
                    <div className="pl-4">
                      <InlineMath math="3 + 1 = 4" />, jadi hasilnya adalah 614
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="613,54 \approx 614" /></p>
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
                  Bulatkan <InlineMath math="319,837" /> ke bilangan satuan terdekat
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka satuan dan persepuluhan</p>
                    <div className="pl-4">
                      <InlineMath math="31\underline{9},837" /> - Satuan = 9, Persepuluhan = 8
                    </div>
                    <p><strong>Langkah 2:</strong> Cek angka persepuluhan</p>
                    <div className="pl-4">
                      Angka persepuluhan adalah <InlineMath math="8" /> (lebih dari 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 8 {">="} 5, maka angka satuan <strong>bertambah 1</strong></p>
                    <div className="pl-4">
                      <InlineMath math="9 + 1 = 10" />, karena hasilnya 10, maka puluhan juga ikut berubah
                    </div>
                    <p><strong>Langkah 4:</strong> Perhitungan lanjutan</p>
                    <div className="pl-4">
                      <InlineMath math="319 + 1 = 320" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> <InlineMath math="319,837 \approx 320" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-bab 3: Aplikasi Pembulatan dalam Kehidupan Sehari-hari */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => toggleSection(2)}
            className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4
              hover:border-primary/60 transition-all duration-300 cursor-pointer text-left"
          >
            <Hash className="w-5 h-5 text-orange-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Aplikasi Pembulatan dalam Kehidupan</span>
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
                  Pembulatan bukan cuma soal matematika di kelas! Dalam kehidupan sehari-hari, 
                  pembulatan sering digunakan untuk <strong>memperkirakan harga</strong>, 
                  <strong>mengukur jarak</strong>, <strong>menghitung waktu</strong>, dan banyak lagi. 
                  Dengan pembulatan, angka jadi lebih mudah dipahami dan dikomunikasikan!
                </p>
              </div>

              {/* Contoh Penggunaan */}
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <h4 className="text-slate-300 font-semibold text-sm mb-3">Contoh Penggunaan Sehari-hari:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 font-semibold">Belanja</p>
                    <p className="text-white/70">Total belanja Rp 49.750 dibulatkan jadi Rp 50.000</p>
                  </div>
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 font-semibold">Jarak</p>
                    <p className="text-white/70">Jarak 12,3 km dibulatkan jadi "sekitar 12 km"</p>
                  </div>
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 font-semibold">Berat Badan</p>
                    <p className="text-white/70">Berat 65,7 kg sering disebut "sekitar 66 kg"</p>
                  </div>
                  <div className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 font-semibold">Waktu</p>
                    <p className="text-white/70">Perjalanan 2 jam 45 menit = "sekitar 3 jam"</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Tips Penting
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  <li>Tentukan tingkat ketelitian yang dibutuhkan</li>
                  <li>Untuk estimasi kasar, bulatkan ke satuan atau puluhan</li>
                  <li>Untuk perhitungan detail (sains/keuangan), pertahankan lebih banyak desimal</li>
                </ul>
              </div>

              {/* Contoh Soal 1 - Mudah */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">MUDAH</span>
                  <span className="text-green-300 font-semibold text-sm">Contoh Soal 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">
                  Suhu ruangan tercatat <InlineMath math="25,48°C" />. 
                  Bulatkan suhu tersebut ke satu desimal untuk laporan harian!
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka yang akan dibulatkan</p>
                    <div className="pl-4">
                      <InlineMath math="25,\underline{4}8°C" /> - Angka 4 adalah desimal ke-1
                    </div>
                    <p><strong>Langkah 2:</strong> Lihat angka desimal ke-2</p>
                    <div className="pl-4">
                      Angka desimal ke-2 adalah <InlineMath math="8" /> (lebih dari 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 8 {">="} 5, maka 4 bertambah 1</p>
                    <div className="pl-4">
                      <InlineMath math="4 + 1 = 5" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Suhu ruangan <InlineMath math="= 25,5°C" /></p>
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
                  Seorang atlet berlari sejauh <InlineMath math="10,473" /> km dalam latihan maraton. 
                  Untuk catatan pribadi, ia ingin membulatkan jarak tersebut ke dua desimal. 
                  Berapa jarak yang dicatat?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka yang akan dibulatkan</p>
                    <div className="pl-4">
                      <InlineMath math="10,4\underline{7}3" /> km - Angka 7 adalah desimal ke-2
                    </div>
                    <p><strong>Langkah 2:</strong> Lihat angka desimal ke-3</p>
                    <div className="pl-4">
                      Angka desimal ke-3 adalah <InlineMath math="3" /> (kurang dari 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 3 {"<"} 5, maka 7 tetap</p>
                    <div className="pl-4">
                      Angka 3 dihilangkan
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Jarak yang dicatat <InlineMath math="= 10,47" /> km</p>
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
                  Hasil pengukuran massa suatu benda di laboratorium adalah <InlineMath math="2,99567" /> gram. 
                  Untuk laporan ilmiah, massa harus dibulatkan ke tiga desimal. 
                  Berapa nilai yang harus ditulis dalam laporan?
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">Pembahasan:</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>Langkah 1:</strong> Identifikasi angka yang akan dibulatkan</p>
                    <div className="pl-4">
                      <InlineMath math="2,99\underline{5}67" /> gram - Angka 5 adalah desimal ke-3
                    </div>
                    <p><strong>Langkah 2:</strong> Lihat angka desimal ke-4</p>
                    <div className="pl-4">
                      Angka desimal ke-4 adalah <InlineMath math="6" /> (lebih dari 5)
                    </div>
                    <p><strong>Langkah 3:</strong> Karena 6 {">="} 5, maka 5 bertambah 1</p>
                    <div className="pl-4">
                      <InlineMath math="5 + 1 = 6" />, sehingga desimal ke-3 menjadi 6
                    </div>
                    <p><strong>Langkah 4:</strong> Verifikasi hasil</p>
                    <div className="pl-4">
                      <InlineMath math="2,995 \rightarrow 2,996" /> gram
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>Jawaban:</strong> Massa dalam laporan <InlineMath math="= 2,996" /> gram</p>
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

export default PembulatanBentukDesimalPage;
