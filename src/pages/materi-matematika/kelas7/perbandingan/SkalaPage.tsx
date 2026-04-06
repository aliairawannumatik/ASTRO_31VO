import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Map } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import imgSkala from "@assets/image_1775455799668.png";

const SkalaPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "luas", "contoh"]);

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
          SKALA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Perbandingan - Materi Matematika
        </p>

        <div className="rounded-xl overflow-hidden mb-4 border border-white/10 shadow-lg animate-slide-up">
          <img
            src={imgSkala}
            alt="Ilustrasi skala denah dan bangunan"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* SECTION: PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Kenapa Kita Butuh Skala?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Coba bayangkan kamu diminta menggambar peta Indonesia di selembar kertas A4. Mustahil menggambar sesuai ukuran aslinya, kan? Di sinilah <strong className="text-primary">skala</strong> berperan — ia memungkinkan kita merepresentasikan benda besar dalam ukuran yang jauh lebih kecil, atau benda kecil dalam ukuran yang lebih besar, tanpa mengubah proporsinya.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                    <Map className="w-6 h-6 text-blue-300 mx-auto mb-1" />
                    <p className="font-body text-xs font-semibold text-blue-300">Peta & Denah</p>
                    <p className="font-body text-xs text-white/60 mt-1">Wilayah luas jadi muat di kertas</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <BookOpen className="w-6 h-6 text-green-300 mx-auto mb-1" />
                    <p className="font-body text-xs font-semibold text-green-300">Arsitektur</p>
                    <p className="font-body text-xs text-white/60 mt-1">Denah rumah atau gedung</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
                    <Target className="w-6 h-6 text-purple-300 mx-auto mb-1" />
                    <p className="font-body text-xs font-semibold text-purple-300">Miniatur</p>
                    <p className="font-body text-xs text-white/60 mt-1">Maket, model, dan replika</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Penting:</strong> Skala selalu menyamakan satuan sebelum dibandingkan. Ubah dulu ke satuan yang sama (biasanya cm), baru hitung rasionya!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: RINGKASAN INTISARI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("konsep")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus Skala</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-primary">Skala</strong> adalah perbandingan antara ukuran pada gambar/peta dengan ukuran aslinya di dunia nyata. Secara matematis:
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">Rumus Dasar Skala:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="S = \frac{J_p}{J_s}" />
                  </div>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/70">
                    <p><InlineMath math="S" /> = Skala (biasanya ditulis sebagai <InlineMath math="1 : n" />)</p>
                    <p><InlineMath math="J_p" /> = Jarak/ukuran pada peta atau gambar</p>
                    <p><InlineMath math="J_s" /> = Jarak/ukuran sebenarnya di dunia nyata</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-blue-300 mb-2">Mencari Jarak Sebenarnya:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="J_s = \frac{J_p}{S}" />
                    </div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">Mencari Jarak di Peta:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="J_p = S \times J_s" />
                    </div>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Cara Baca Skala 1 : 500.000:</strong> Setiap 1 cm di peta = 500.000 cm (atau 5 km) di dunia nyata. Semakin besar angka di belakang titik dua, semakin kecil gambar dibanding aslinya.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: SKALA LUAS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("luas")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Konsep Khusus: Skala pada Luas</span>
              </div>
              {expandedSections.includes("luas") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("luas") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ketika berurusan dengan <strong className="text-orange-300">luas</strong> (bukan panjang), skala harus <strong className="text-primary">dikuadratkan</strong> terlebih dahulu karena luas adalah hasil kali dua dimensi panjang.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-3">Rumus Skala untuk Luas:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body text-xs text-white/60 mb-1">Mencari Luas Sebenarnya:</p>
                      <BlockMath math="L_s = \frac{L_p}{S^2}" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body text-xs text-white/60 mb-1">Mencari Luas di Peta:</p>
                      <BlockMath math="L_p = S^2 \times L_s" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white/60 mb-2 text-xs font-semibold">CONTOH SINGKAT:</p>
                  <p className="font-body text-sm text-white/80">Peta berskala <InlineMath math="1:500" />. Luas taman di peta = <InlineMath math="6 \text{ cm}^2" />. Berapa luas sebenarnya?</p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2">
                    <BlockMath math="L_s = \frac{6 \text{ cm}^2}{(1/500)^2} = 6 \times 500^2 = 6 \times 250.000 = 1.500.000 \text{ cm}^2 = 150 \text{ m}^2" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              {expandedSections.includes("contoh") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 – Mencari Jarak Sebenarnya</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah peta memiliki skala <InlineMath math="1 : 2.000.000" />. Jarak antara Kota A dan Kota B pada peta tersebut adalah 4,5 cm. Berapa jarak sebenarnya kedua kota itu dalam kilometer?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Diketahui: <InlineMath math="S = \frac{1}{2.000.000}" />, <InlineMath math="J_p = 4{,}5 \text{ cm}" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="J_s = \frac{J_p}{S} = 4{,}5 \times 2.000.000 = 9.000.000 \text{ cm}" />
                        <BlockMath math="J_s = \frac{9.000.000}{100.000} = 90 \text{ km}" />
                      </div>
                      <p className="text-primary font-semibold">Jarak sebenarnya Kota A ke Kota B = <strong>90 km</strong></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Mencari Skala & Jarak di Peta</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Jarak antara dua desa adalah 15 km. Pada sebuah denah wilayah, jarak keduanya digambar sepanjang 3 cm.
                      <br />(a) Tentukan skala denah tersebut!
                      <br />(b) Jika ada desa ketiga yang jaraknya 24 km dari desa pertama, berapa cm jaraknya di denah?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Bagian (a) – Mencari Skala:</strong></p>
                      <p>Ubah dulu: <InlineMath math="J_s = 15 \text{ km} = 15 \times 100.000 \text{ cm} = 1.500.000 \text{ cm}" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="S = \frac{J_p}{J_s} = \frac{3 \text{ cm}}{1.500.000 \text{ cm}} = \frac{1}{500.000}" />
                      </div>
                      <p className="text-yellow-300">Skala denah = <strong>1 : 500.000</strong></p>
                      <p><strong>Bagian (b) – Mencari Jarak di Denah:</strong></p>
                      <p><InlineMath math="J_s = 24 \text{ km} = 2.400.000 \text{ cm}" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="J_p = S \times J_s = \frac{1}{500.000} \times 2.400.000 = 4{,}8 \text{ cm}" />
                      </div>
                      <p className="text-primary font-semibold">Jarak di denah = <strong>4,8 cm</strong></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Skala pada Luas</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah denah lapangan olahraga menggunakan skala <InlineMath math="1 : 1.000" />. Pada denah, luas lapangan tersebut adalah <InlineMath math="12 \text{ cm}^2" />.
                      <br />(a) Tentukan luas lapangan sebenarnya dalam <InlineMath math="\text{m}^2" />!
                      <br />(b) Jika lapangan futsal di sebelahnya luasnya <InlineMath math="800 \text{ m}^2" />, berapa <InlineMath math="\text{cm}^2" /> luasnya di denah?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Bagian (a) – Mencari Luas Sebenarnya:</strong></p>
                      <p>Skala panjang <InlineMath math="1:1.000" />, maka skala luas = <InlineMath math="1 : 1.000^2 = 1 : 1.000.000" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="L_s = L_p \times 1.000.000 = 12 \times 1.000.000 = 12.000.000 \text{ cm}^2" />
                        <BlockMath math="L_s = \frac{12.000.000}{10.000} = 1.200 \text{ m}^2" />
                      </div>
                      <p className="text-red-300">Luas lapangan sebenarnya = <strong><InlineMath math="1.200 \text{ m}^2" /></strong></p>
                      <p><strong>Bagian (b) – Mencari Luas di Denah:</strong></p>
                      <p><InlineMath math="L_s = 800 \text{ m}^2 = 800 \times 10.000 = 8.000.000 \text{ cm}^2" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="L_p = \frac{L_s}{1.000.000} = \frac{8.000.000}{1.000.000} = 8 \text{ cm}^2" />
                      </div>
                      <p className="text-primary font-semibold">Luas lapangan futsal di denah = <strong><InlineMath math="8 \text{ cm}^2" /></strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/perbandingan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Perbandingan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkalaPage;
