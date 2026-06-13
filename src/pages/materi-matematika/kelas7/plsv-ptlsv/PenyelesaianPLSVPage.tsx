import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import BalanceScaleAnimation from "@/components/BalanceScaleAnimation";

const PenyelesaianPLSVPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "substitusi", "tamkur", "kaibagi", "pindahruas", "pecahan", "contoh1", "contoh2", "contoh3"]);

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
          PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 · PLSV & PtLSV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Lima Metode Menyelesaikan PLSV</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ada beberapa cara untuk menemukan nilai variabel dalam PLSV. Setiap metode punya keunggulannya masing-masing. Kita akan pelajari semuanya!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="space-y-1 font-body text-sm text-cyan-200">
                    <p>1. Metode Substitusi (coba-coba)</p>
                    <p>2. Menambah/Mengurang kedua ruas</p>
                    <p>3. Mengali/Membagi kedua ruas</p>
                    <p>4. Metode Pindah Ruas</p>
                    <p>5. Persamaan Bentuk Pecahan</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metode Substitusi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("substitusi")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">1. Metode Substitusi</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>Metode substitusi</strong> dilakukan dengan cara <strong className="text-blue-300">mencoba-coba nilai satu per satu</strong> untuk variabel sampai mendapatkan kalimat yang benar. Metode ini paling sederhana, cocok untuk bilangan-bilangan kecil.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="x + 4 = 9" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>Coba <InlineMath math="x = 3" />: <InlineMath math="3 + 4 = 7 \neq 9" /> ✗</p>
                    <p>Coba <InlineMath math="x = 5" />: <InlineMath math="5 + 4 = 9" /> ✓</p>
                    <p className="text-green-400">HP = <InlineMath math="\{5\}" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Metode substitusi kurang efisien untuk bilangan besar atau pecahan. Gunakan metode lain untuk kasus tersebut.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tambah Kurang */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tamkur")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">2. Menambah / Mengurang Kedua Ruas</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Prinsip: <strong className="text-green-300">Jika kedua ruas persamaan ditambah atau dikurang dengan bilangan yang sama, persamaan tetap ekuivalen.</strong>
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 text-center font-body text-sm text-white/80">
                    <p>Jika <InlineMath math="a = b" />, maka <InlineMath math="a + c = b + c" /></p>
                    <p>Jika <InlineMath math="a = b" />, maka <InlineMath math="a - c = b - c" /></p>
                  </div>
                </div>

                {/* Balance Scale Animation */}
                <BalanceScaleAnimation />

                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="x - 7 = 3" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Tambahkan <InlineMath math="7" /> ke kedua ruas:</p>
                    <BlockMath math="x - 7 + 7 = 3 + 7" />
                    <BlockMath math="x = 10" />
                    <p className="text-green-400">HP = <InlineMath math="\{10\}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh lain: Selesaikan <InlineMath math="x + 5 = 13" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Kurangi <InlineMath math="5" /> dari kedua ruas:</p>
                    <BlockMath math="x + 5 - 5 = 13 - 5" />
                    <BlockMath math="x = 8" />
                    <p className="text-green-400">HP = <InlineMath math="\{8\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kali Bagi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kaibagi")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">3. Mengali / Membagi Kedua Ruas</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Prinsip: <strong className="text-orange-300">Jika kedua ruas dikalikan atau dibagi dengan bilangan yang sama (bukan nol), persamaan tetap ekuivalen.</strong>
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 text-center font-body text-sm text-white/80">
                    <p>Jika <InlineMath math="a = b" />, maka <InlineMath math="a \times c = b \times c" /></p>
                    <p>Jika <InlineMath math="a = b" />, maka <InlineMath math="\frac{a}{c} = \frac{b}{c}" /> <InlineMath math="(c \neq 0)" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh (pembagian): Selesaikan <InlineMath math="4x = 20" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Bagi kedua ruas dengan <InlineMath math="4" />:</p>
                    <BlockMath math="\frac{4x}{4} = \frac{20}{4}" />
                    <BlockMath math="x = 5" />
                    <p className="text-green-400">HP = <InlineMath math="\{5\}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh (perkalian): Selesaikan <InlineMath math="\frac{x}{3} = 6" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Kalikan kedua ruas dengan <InlineMath math="3" />:</p>
                    <BlockMath math="\frac{x}{3} \times 3 = 6 \times 3" />
                    <BlockMath math="x = 18" />
                    <p className="text-green-400">HP = <InlineMath math="\{18\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pindah Ruas */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("pindahruas")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">4. Metode Pindah Ruas</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-purple-300">Pindah ruas</strong> adalah cara cepat yang memanfaatkan sifat kesamaan. Intinya:
                  </p>
                  <ul className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <li>• Suku yang <strong className="text-purple-300">berpindah ruas</strong> akan <strong className="text-purple-300">berganti tanda</strong> (+ menjadi −, atau − menjadi +)</li>
                    <li>• Faktor yang berpindah akan menjadi pembagi (× menjadi ÷)</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="2x + 6 = 14" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Pindahkan <InlineMath math="+6" /> ke ruas kanan (menjadi <InlineMath math="-6" />):</p>
                    <BlockMath math="2x = 14 - 6" />
                    <BlockMath math="2x = 8" />
                    <p>Pindahkan faktor <InlineMath math="2" /> ke ruas kanan (menjadi pembagi):</p>
                    <BlockMath math="x = \frac{8}{2} = 4" />
                    <p className="text-green-400">HP = <InlineMath math="\{4\}" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Metode pindah ruas adalah metode yang paling sering digunakan karena lebih cepat. Kumpulkan suku-suku dengan variabel di satu ruas, dan konstanta di ruas lainnya!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("pecahan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-pink-400" />
                <span className="font-body font-semibold text-white">5. Persamaan Bentuk Pecahan</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jika PLSV memuat pecahan, langkah pertama adalah <strong className="text-pink-300">menghilangkan penyebut</strong> dengan cara <strong className="text-pink-300">mengalikan kedua ruas dengan KPK dari semua penyebut</strong>.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">Contoh: Selesaikan <InlineMath math="\frac{x}{2} + \frac{x}{3} = 5" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>KPK dari 2 dan 3 adalah 6. Kalikan semua suku dengan 6:</p>
                    <BlockMath math="6 \cdot \frac{x}{2} + 6 \cdot \frac{x}{3} = 6 \cdot 5" />
                    <BlockMath math="3x + 2x = 30" />
                    <BlockMath math="5x = 30" />
                    <BlockMath math="x = 6" />
                    <p className="text-green-400">HP = <InlineMath math="\{6\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 1 - Mudah */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh1")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded mr-2">MUDAH</span>
                  Contoh Soal 1
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Selesaikan persamaan <InlineMath math="3x - 5 = 10" /> menggunakan metode pindah ruas!
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>Pindahkan <InlineMath math="-5" /> ke kanan (menjadi <InlineMath math="+5" />):</p>
                    <BlockMath math="3x = 10 + 5 = 15" />
                    <p>Pindahkan faktor 3 ke kanan (menjadi pembagi):</p>
                    <BlockMath math="x = \frac{15}{3} = 5" />
                    <p className="text-green-400">HP = <InlineMath math="\{5\}" /></p>
                    <p>Verifikasi: <InlineMath math="3(5) - 5 = 15 - 5 = 10" /> ✓</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 2 - Sedang */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh2")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded mr-2">SEDANG</span>
                  Contoh Soal 2
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Selesaikan persamaan <InlineMath math="5(2x - 3) = 3(x + 4)" />!
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p><strong>Langkah 1:</strong> Distribusikan (urai kurung):</p>
                    <BlockMath math="10x - 15 = 3x + 12" />
                    <p><strong>Langkah 2:</strong> Pindahkan suku-x ke kiri, konstanta ke kanan:</p>
                    <BlockMath math="10x - 3x = 12 + 15" />
                    <BlockMath math="7x = 27" />
                    <p><strong>Langkah 3:</strong> Bagi kedua ruas dengan 7:</p>
                    <BlockMath math="x = \frac{27}{7}" />
                    <p className="text-green-400">HP = <InlineMath math="\left\{\frac{27}{7}\right\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 3 - Sulit */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh3")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded mr-2">SULIT</span>
                  Contoh Soal 3
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    Selesaikan persamaan: <InlineMath math="\frac{2x + 1}{3} - \frac{x - 2}{4} = 2" />
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                    <p><strong>Langkah 1:</strong> KPK dari 3 dan 4 adalah 12. Kalikan semua suku dengan 12:</p>
                    <BlockMath math="12 \cdot \frac{2x+1}{3} - 12 \cdot \frac{x-2}{4} = 12 \cdot 2" />
                    <BlockMath math="4(2x + 1) - 3(x - 2) = 24" />
                    <p><strong>Langkah 2:</strong> Distribusikan:</p>
                    <BlockMath math="8x + 4 - 3x + 6 = 24" />
                    <BlockMath math="5x + 10 = 24" />
                    <p><strong>Langkah 3:</strong> Pindah ruas:</p>
                    <BlockMath math="5x = 24 - 10 = 14" />
                    <BlockMath math="x = \frac{14}{5}" />
                    <p className="text-green-400">HP = <InlineMath math="\left\{\frac{14}{5}\right\}" /></p>
                    <p><strong>Verifikasi:</strong></p>
                    <p>Ruas kiri: <InlineMath math="\frac{2(\frac{14}{5})+1}{3} - \frac{\frac{14}{5}-2}{4} = \frac{\frac{33}{5}}{3} - \frac{\frac{4}{5}}{4} = \frac{33}{15} - \frac{4}{20} = \frac{11}{5} - \frac{1}{5} = \frac{10}{5} = 2" /> ✓</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenyelesaianPLSVPage;
