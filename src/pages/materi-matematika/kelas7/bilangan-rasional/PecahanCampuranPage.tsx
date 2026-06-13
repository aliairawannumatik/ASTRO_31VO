import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, Layers, Percent, ArrowRightLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PecahanCampuranPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["pecahan-campuran", "konversi", "persen"]);

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
          PECAHAN CAMPURAN DAN PERSEN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Rasional - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section 1: Pecahan Campuran */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Pecahan Campuran</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">Pecahan campuran</strong> adalah gabungan antara bilangan bulat dengan pecahan murni. Bayangkan kamu punya 2 pizza utuh ditambah setengah pizza lagi - itulah bentuk pecahan campuran <InlineMath math="2\frac{1}{2}" />!
                  </p>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pecahan campuran muncul ketika pembilang suatu pecahan <strong className="text-cyan-300">lebih besar</strong> dari penyebutnya. Misalnya <InlineMath math="\frac{7}{3}" /> dapat diubah menjadi pecahan campuran.
                </p>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-bold text-primary">
                      <InlineMath math="a\frac{b}{c}" />
                    </div>
                    <div className="flex flex-col gap-1 text-sm font-body">
                      <p className="text-cyan-300"><InlineMath math="a" /> = <strong>Bilangan bulat</strong></p>
                      <p className="text-yellow-300"><InlineMath math="\frac{b}{c}" /> = <strong>Pecahan murni</strong> (pembilang lebih kecil dari penyebut)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Contoh Visual:</strong> Pecahan <InlineMath math="\frac{7}{3}" /> artinya 7 bagian dari keseluruhan yang masing-masing dibagi 3. Karena <InlineMath math="7 \div 3 = 2" /> sisa 1, maka <InlineMath math="\frac{7}{3} = 2\frac{1}{3}" /> (2 bulat dan <InlineMath math="\frac{1}{3}" /> sisa).
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Cara Mengubah Pecahan Biasa ke Pecahan Campuran:</p>
                  <div className="space-y-2 font-body text-sm text-white/70">
                    <p><strong className="text-purple-300">Langkah 1:</strong> Bagi pembilang dengan penyebut</p>
                    <p><strong className="text-purple-300">Langkah 2:</strong> Hasil bagi menjadi bilangan bulat</p>
                    <p><strong className="text-purple-300">Langkah 3:</strong> Sisa pembagian menjadi pembilang baru, penyebut tetap</p>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mt-3 text-center">
                    <BlockMath math="\frac{a}{b} = \text{hasil bagi} + \frac{\text{sisa}}{b}" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips:</strong> Pecahan campuran lebih mudah dibayangkan dalam kehidupan sehari-hari karena menggambarkan "berapa banyak utuh" ditambah "berapa sisa bagiannya".
                  </p>
                </div>

                {/* Contoh Soal Pecahan Campuran */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                  </p>

                  {/* Contoh 1 - Mudah */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                      <span className="font-body font-semibold text-white">Contoh 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Nyatakan <InlineMath math="\frac{8}{3}" /> sebagai pecahan campuran!
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Bagi pembilang dengan penyebut</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="8 \div 3 = 2 \text{ sisa } 2" />
                        </div>
                        <p><strong>Langkah 2:</strong> Tulis dalam bentuk pecahan campuran</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{8}{3} = 2\frac{2}{3}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{8}{3} = 2\frac{2}{3}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 2 - Sedang */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                      <span className="font-body font-semibold text-white">Contoh 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Nyatakan <InlineMath math="\frac{17}{5}" /> sebagai pecahan campuran, lalu nyatakan kembali dalam bentuk pecahan biasa untuk memverifikasi!
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Ubah ke pecahan campuran</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="17 \div 5 = 3 \text{ sisa } 2" />
                          <BlockMath math="\frac{17}{5} = 3\frac{2}{5}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Verifikasi dengan mengubah kembali ke pecahan biasa</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="3\frac{2}{5} = \frac{(5 \times 3) + 2}{5} = \frac{15 + 2}{5} = \frac{17}{5}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{17}{5} = 3\frac{2}{5}" /> (terverifikasi!)</p>
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
                        Dua per lima dari penduduk kota A adalah laki-laki. Jika total penduduk kota tersebut adalah 8 juta jiwa, berapa banyak penduduk laki-laki di kota tersebut?
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Identifikasi pecahan dan nilai total</p>
                        <p className="pl-4">Pecahan laki-laki = <InlineMath math="\frac{2}{5}" /></p>
                        <p className="pl-4">Total penduduk = 8.000.000 jiwa</p>
                        <p><strong>Langkah 2:</strong> Hitung banyak penduduk laki-laki</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\text{Penduduk laki-laki} = \frac{2}{5} \times 8.000.000" />
                          <BlockMath math="= \frac{2 \times 8.000.000}{5}" />
                          <BlockMath math="= \frac{16.000.000}{5}" />
                          <BlockMath math="= 3.200.000 \text{ jiwa}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, penduduk laki-laki di kota A adalah 3.200.000 jiwa (3,2 juta jiwa).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Konversi Pecahan Campuran dan Pecahan Biasa */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">Konversi Pecahan Campuran dan Pecahan Biasa</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pecahan campuran dan pecahan biasa dapat saling dikonversi. Kemampuan ini sangat berguna saat melakukan operasi hitung seperti penjumlahan, pengurangan, perkalian, dan pembagian pecahan.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-cyan-300 mb-2">Pecahan Biasa ke Campuran:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\frac{a}{b} \rightarrow \text{bagi } a \div b" />
                    </div>
                    <p className="font-body text-xs text-white/60 mt-2">Hasil bagi = bulat, sisa = pembilang baru</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">Pecahan Campuran ke Biasa:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="a\frac{b}{c} = \frac{(c \times a) + b}{c}" />
                    </div>
                    <p className="font-body text-xs text-white/60 mt-2">Penyebut x bulat + pembilang</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Mudah Mengingat:</strong> Untuk mengubah pecahan campuran ke biasa, bayangkan "penyebut naik ke atas mengalikan bilangan bulat, lalu hasilnya ditambah pembilang".
                  </p>
                </div>

                {/* Contoh Soal Konversi */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                  </p>

                  {/* Contoh 1 - Mudah */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                      <span className="font-body font-semibold text-white">Contoh 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Nyatakan <InlineMath math="2\frac{5}{6}" /> sebagai pecahan biasa!
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Gunakan rumus konversi</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="2\frac{5}{6} = \frac{(6 \times 2) + 5}{6}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Hitung pembilang baru</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{12 + 5}{6} = \frac{17}{6}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="2\frac{5}{6} = \frac{17}{6}" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 2 - Sedang */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                      <span className="font-body font-semibold text-white">Contoh 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Nyatakan <InlineMath math="\frac{126}{12}" /> sebagai pecahan campuran dalam bentuk paling sederhana!
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Bagi pembilang dengan penyebut</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="126 \div 12 = 10 \text{ sisa } 6" />
                        </div>
                        <p><strong>Langkah 2:</strong> Tulis dalam bentuk pecahan campuran</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{126}{12} = 10\frac{6}{12}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Sederhanakan pecahan (FPB 6 dan 12 adalah 6)</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="10\frac{6}{12} = 10\frac{6 \div 6}{12 \div 6} = 10\frac{1}{2}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{126}{12} = 10\frac{1}{2}" /></p>
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
                        Emas 18 karat mengandung <InlineMath math="\frac{18}{24}" /> emas murni. Jika kamu memiliki 48 gram emas 18 karat, berapa gram emas murni yang terkandung di dalamnya?
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Sederhanakan pecahan kadar emas</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{18}{24} = \frac{18 \div 6}{24 \div 6} = \frac{3}{4}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Hitung kandungan emas murni</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\text{Emas murni} = \frac{3}{4} \times 48 \text{ gram}" />
                          <BlockMath math="= \frac{3 \times 48}{4} = \frac{144}{4} = 36 \text{ gram}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, dalam 48 gram emas 18 karat terkandung 36 gram emas murni.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Persen */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Percent className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Persen</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">Persen (%)</strong> adalah cara menyatakan pecahan dengan penyebut 100. Kata "persen" berasal dari bahasa Latin "per centum" yang berarti "per seratus". Persen sangat umum digunakan dalam kehidupan sehari-hari seperti diskon, pajak, dan statistik.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl font-bold text-primary">
                      <InlineMath math="x\% = \frac{x}{100}" />
                    </div>
                    <p className="text-white/60 text-sm font-body mt-2">Contoh: <InlineMath math="25\% = \frac{25}{100} = \frac{1}{4}" /></p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Rumus Mengubah Pecahan ke Persen:</p>
                  <div className="bg-slate-900/50 rounded p-4 text-center">
                    <BlockMath math="\frac{a}{b} = \frac{a}{b} \times 100\%" />
                  </div>
                  <p className="font-body text-sm text-white/70 mt-3 leading-relaxed">
                    Artinya, kalikan pecahan dengan 100 lalu tambahkan simbol %.
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">Hubungan Persen - Pecahan - Desimal:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body">
                      <thead>
                        <tr className="text-white/60 border-b border-border">
                          <th className="py-2 px-3 text-center">Persen</th>
                          <th className="py-2 px-3 text-center">Pecahan</th>
                          <th className="py-2 px-3 text-center">Desimal</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-3 text-center text-primary">25%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{1}{4}" /></td>
                          <td className="py-2 px-3 text-center">0,25</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-3 text-center text-primary">50%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{1}{2}" /></td>
                          <td className="py-2 px-3 text-center">0,5</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-3 text-center text-primary">75%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{3}{4}" /></td>
                          <td className="py-2 px-3 text-center">0,75</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-center text-primary">100%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{4}{4} = 1" /></td>
                          <td className="py-2 px-3 text-center">1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Praktis:</strong> Untuk menghitung persen dari suatu nilai, kalikan nilai tersebut dengan persen dalam bentuk desimal. Contoh: 20% dari 150 = 0,20 x 150 = 30.
                  </p>
                </div>

                {/* Contoh Soal Persen */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                  </p>

                  {/* Contoh 1 - Mudah */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                      <span className="font-body font-semibold text-white">Contoh 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Nyatakan <InlineMath math="\frac{7}{20}" /> dalam bentuk persen!
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Kalikan pecahan dengan 100%</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{7}{20} \times 100\% = \frac{7 \times 100}{20}\%" />
                        </div>
                        <p><strong>Langkah 2:</strong> Hitung hasilnya</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{700}{20}\% = 35\%" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{7}{20} = 35\%" /></p>
                      </div>
                    </div>
                  </div>

                  {/* Contoh 2 - Sedang */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                      <span className="font-body font-semibold text-white">Contoh 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        Nyatakan <InlineMath math="\frac{2}{15}" /> dalam bentuk persen!
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Kalikan pecahan dengan 100%</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{15} \times 100\% = \frac{200}{15}\%" />
                        </div>
                        <p><strong>Langkah 2:</strong> Sederhanakan (bagi dengan 5)</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{200 \div 5}{15 \div 5}\% = \frac{40}{3}\%" />
                        </div>
                        <p><strong>Langkah 3:</strong> Ubah ke pecahan campuran</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= 13\frac{1}{3}\%" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{2}{15} = 13\frac{1}{3}\%" /></p>
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
                        Dalam sebuah kelas terdapat 18 siswa putra dan 22 siswa putri. Pada suatu hari, 3 orang tidak masuk karena sakit. Berapa persen siswa yang tidak masuk sekolah?
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Hitung total siswa</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\text{Total siswa} = 18 + 22 = 40 \text{ siswa}" />
                        </div>
                        <p><strong>Langkah 2:</strong> Nyatakan dalam pecahan</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\text{Siswa tidak masuk} = \frac{3}{40}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Ubah ke persen</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{40} \times 100\% = \frac{300}{40}\% = 7,5\%" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, persentase siswa yang tidak masuk adalah 7,5%.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bonus: Aplikasi Persen dalam Kehidupan */}
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm font-semibold text-accent mb-3">Aplikasi Persen dalam Kehidupan Sehari-hari:</p>
                  <ul className="space-y-2 font-body text-sm text-white/80">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">1.</span>
                      <span><strong>Diskon:</strong> "Diskon 30%" artinya harga dikurangi <InlineMath math="\frac{30}{100}" /> dari harga asli.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">2.</span>
                      <span><strong>Pajak:</strong> PPN 11% berarti membayar tambahan <InlineMath math="\frac{11}{100}" /> dari harga barang.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">3.</span>
                      <span><strong>Bunga:</strong> Bunga tabungan 5% per tahun berarti tabungan bertambah <InlineMath math="\frac{5}{100}" /> dari saldo.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">🔀 RANGKUMAN LENGKAP</p>
              <p className="font-body text-xs text-white/80 mt-0.5">Pecahan Campuran, Persen &amp; Konversi — Kelas 7</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500 flex items-center justify-center text-[10px]">1</span>
                  Pecahan Campuran &amp; Persen — Konsep Utama
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Pecahan Campuran: a b/c", desc: "Terdiri dari bagian bulat (a) dan bagian pecahan (b/c). Contoh: 2¾ = 2 + 3/4. Selalu ubah ke biasa untuk operasi!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
                    { label: "Campuran → Biasa: (a×c + b)/c", desc: "2¾ = (2×4 + 3)/4 = 11/4. Kalikan bagian bulat dengan penyebut, tambahkan pembilang, letakkan di atas penyebut.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
                    { label: "Biasa → Campuran: bagi dan sisa", desc: "11 ÷ 4 = 2 sisa 3 → 2¾. Hasil bagi = bagian bulat, sisa = pembilang, penyebut tetap.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
                    { label: "Persen (%) = per seratus", desc: "75% = 75/100 = 3/4 = 0,75. Konversi: % → desimal (÷100), % → pecahan (/100 lalu sederhanakan).", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
                    { label: "Menghitung Persen dari Suatu Nilai", desc: "p% dari n = (p/100) × n. Contoh: 25% dari 80 = (25/100) × 80 = 20.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
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
                    { icon: "🔄", tip: "Selalu ubah campuran ke biasa sebelum operasi", detail: "2¾ + 1½ → ubah ke 11/4 + 3/2 terlebih dahulu, baru jumlahkan. Jangan operasikan bagian bulat dan pecahan secara terpisah!", color: "bg-violet-900/30 border-violet-500/30" },
                    { icon: "💯", tip: "Hafal konversi persen-pecahan umum", detail: "10%=1/10 | 20%=1/5 | 25%=1/4 | 33%≈1/3 | 50%=1/2 | 75%=3/4 | 100%=1. Hafal ini untuk perhitungan cepat!", color: "bg-indigo-900/30 border-indigo-500/30" },
                    { icon: "🎯", tip: "Persen dari n: kalikan n dengan persen/100", detail: "30% dari 150 = 150 × 30/100 = 150 × 3/10 = 45. Atau cepat: 10% dari 150 = 15, jadi 30% = 15 × 3 = 45!", color: "bg-blue-900/30 border-blue-500/30" },
                    { icon: "📊", tip: "Diskon, pajak, bunga semuanya pakai persen", detail: "Diskon 20% dari Rp 150.000 = 150.000 × 20/100 = Rp 30.000. Harga bayar = 150.000 − 30.000 = Rp 120.000.", color: "bg-cyan-900/30 border-cyan-500/30" },
                  ].map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-blue-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌌</div>
                <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pecahan campuran, desimal, dan persen adalah <strong className="text-violet-300">tiga wajah dari satu konsep yang sama</strong>. Ketiganya bisa saling dikonversi! Kuasai cara mengubah antar bentuk ini, dan kamu akan siap menghadapi soal matematika maupun situasi kehidupan nyata — dari menghitung diskon belanja hingga memahami statistik dan grafik!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Campuran ↔ Biasa", "% = /100", "Sederhanakan FPB", "p% dari n = n×p/100", "Diskon & Pajak"].map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🏆 Selesai! Kamu sudah menguasai semua bentuk pecahan!</p>
              </div>
            </div>
          </div>

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
    </div>
  );
};

export default PecahanCampuranPage;
