import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PenjumlahanPenguranganPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh"]);

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
          PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 · Aljabar · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Aturan Dasar: Hanya Suku Sejenis yang Bisa Digabung</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Menjumlahkan atau mengurangkan bentuk aljabar itu seperti menghitung buah. Kamu bisa menjumlahkan apel dengan apel, tapi tidak bisa langsung menjumlahkan apel dengan jeruk!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Prinsip utama:</strong> Operasi penjumlahan dan pengurangan hanya bisa dilakukan pada <strong>suku-suku yang sejenis</strong> — yaitu suku dengan variabel dan pangkat yang sama.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Intisari */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Cara Menyederhanakan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Untuk menyederhanakan bentuk aljabar melalui penjumlahan/pengurangan, ikuti dua langkah berikut:
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-green-300">Langkah-Langkah:</p>
                  <p className="font-body text-sm text-white/80"><strong>1.</strong> Kelompokkan suku-suku yang sejenis.</p>
                  <p className="font-body text-sm text-white/80"><strong>2.</strong> Gunakan sifat distributif untuk menggabungkan koefisiennya.</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">Sifat Distributif yang Dipakai:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <BlockMath math="ab + ac = a(b + c)" />
                    <BlockMath math="ab - ac = a(b - c)" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Contoh Cepat:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="9p + 8q - 2q + 5p = (9+5)p + (8-2)q = 14p + 6q" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat!</strong> Koefisien 1 tidak perlu ditulis. Jadi <InlineMath math="1 \cdot x" /> cukup ditulis <InlineMath math="x" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Sederhanakan: <InlineMath math="7a^3 - 8a^2 - 16a^3 + 11a^2 + 9" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Kelompokkan suku sejenis:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(7a^3 - 16a^3) + (-8a^2 + 11a^2) + 9" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung masing-masing kelompok:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= -9a^3 + 3a^2 + 9" />
                      </div>
                      <p className="text-primary font-semibold">Hasil: <InlineMath math="-9a^3 + 3a^2 + 9" /></p>
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
                    <p className="font-body text-sm text-white">Tentukan hasil dari <InlineMath math="(12x^2 - 9x + 6) + (-7x^2 + 8x - 14)" />!</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buka kurung (tanda + tidak mengubah tanda suku):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="12x^2 - 9x + 6 - 7x^2 + 8x - 14" />
                      </div>
                      <p><strong>Langkah 2:</strong> Kelompokkan suku sejenis:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(12x^2 - 7x^2) + (-9x + 8x) + (6 - 14)" />
                      </div>
                      <p><strong>Langkah 3:</strong> Sederhanakan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 5x^2 - x - 8" />
                      </div>
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
                      Kurangkan <InlineMath math="-4(2x + 3)" /> dari <InlineMath math="-5(x - 2)" />, kemudian sederhanakan hasilnya!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Ingat, "<InlineMath math="A" /> dikurangkan dari <InlineMath math="B" />" artinya <InlineMath math="B - A" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-5(x-2) - [-4(2x+3)]" />
                      </div>
                      <p><strong>Langkah 2:</strong> Jabarkan dengan sifat distributif:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= -5x + 10 - (-8x - 12)" />
                        <BlockMath math="= -5x + 10 + 8x + 12" />
                      </div>
                      <p><strong>Langkah 3:</strong> Kelompokkan dan sederhanakan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= (-5x + 8x) + (10 + 12) = 3x + 22" />
                      </div>
                      <p className="text-primary font-semibold">Hasil akhir: <InlineMath math="3x + 22" /></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aljabar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanPenguranganPage;
