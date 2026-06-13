import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, Scale, Equal } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const ArtiPecahanPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["arti-pecahan", "pecahan-senilai", "membandingkan"]);

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
          ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Bilangan Rasional - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section 1: Arti Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Arti Pecahan</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Ringkasan Intisari
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-4">
                    <strong className="text-primary">Pecahan</strong> adalah bilangan yang menggambarkan bagian dari suatu keseluruhan. Bayangkan kamu punya sepotong pizza yang dipotong rata menjadi beberapa bagian. Ketika kamu mengambil sebagian dari potongan tersebut, itulah yang disebut pecahan!
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src="/pizza_pecahan.jpg"
                      alt="Ilustrasi pecahan senilai dengan pizza"
                      className="w-full rounded-lg object-cover"
                    />
                    <p className="font-body text-xs text-white/60 text-center leading-relaxed">
                      Kelima pizza di atas memiliki ukuran yang sama dan masing-masing menunjukkan bagian yang diarsir (pepperoni). Walaupun penulisannya berbeda (<InlineMath math="\frac{1}{2}, \frac{2}{4}, \frac{3}{6}, \frac{4}{8}, \frac{6}{12}" />), bagian pizza yang diambil tetap sama besar — inilah yang disebut <strong className="text-green-300">Pecahan Senilai</strong>!
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Setiap pecahan terdiri dari dua komponen utama:
                </p>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-bold text-primary">
                      <InlineMath math="\frac{a}{b}" />
                    </div>
                    <div className="flex flex-col gap-1 text-sm font-body">
                      <p className="text-cyan-300"><InlineMath math="a" /> = <strong>Pembilang</strong> (angka di atas garis)</p>
                      <p className="text-yellow-300"><InlineMath math="b" /> = <strong>Penyebut</strong> (angka di bawah garis, <InlineMath math="b \neq 0" />)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Contoh Visual:</strong> Jika sebuah kue dipotong menjadi <strong>4 bagian sama besar</strong> dan kamu mengambil <strong>3 potong</strong>, maka bagianmu adalah <InlineMath math="\frac{3}{4}" /> dari kue tersebut. Di sini, 3 adalah pembilang (bagian yang diambil) dan 4 adalah penyebut (total bagian).
                  </p>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <p className="font-body text-sm text-accent leading-relaxed">
                    <strong>Pecahan Murni</strong> adalah pecahan di mana nilai pembilangnya <strong>lebih kecil</strong> dari penyebutnya. Contoh: <InlineMath math="\frac{1}{2}" />, <InlineMath math="\frac{3}{4}" />, <InlineMath math="\frac{5}{8}" />
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">Posisi Pecahan pada Garis Bilangan:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">
                    Pecahan berada di antara dua bilangan bulat pada garis bilangan. Misalnya, <InlineMath math="\frac{1}{2}" /> terletak tepat di tengah antara 0 dan 1.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <p className="text-white/60 text-xs text-center mb-3">Garis Bilangan:</p>
                    <svg viewBox="0 0 320 60" className="w-full max-w-sm mx-auto" aria-label="Garis bilangan pecahan">
                      {/* Garis utama kuning */}
                      <line x1="20" y1="30" x2="300" y2="30" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round"/>
                      {/* Panah kanan */}
                      <polygon points="300,30 292,25 292,35" fill="#facc15"/>
                      {/* Tanda titik 0 */}
                      <line x1="60" y1="22" x2="60" y2="38" stroke="#facc15" strokeWidth="2"/>
                      <text x="60" y="52" textAnchor="middle" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">0</text>
                      {/* Tanda titik 1/2 */}
                      <line x1="160" y1="20" x2="160" y2="40" stroke="#67e8f9" strokeWidth="2"/>
                      <circle cx="160" cy="30" r="4" fill="#67e8f9"/>
                      <text x="160" y="15" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">1/2</text>
                      {/* Tanda titik 1 */}
                      <line x1="260" y1="22" x2="260" y2="38" stroke="#facc15" strokeWidth="2"/>
                      <text x="260" y="52" textAnchor="middle" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">1</text>
                      {/* Label jarak kiri */}
                      <text x="110" y="24" textAnchor="middle" fill="#ffffff60" fontSize="8">← sama →</text>
                      {/* Label jarak kanan */}
                      <text x="210" y="24" textAnchor="middle" fill="#ffffff60" fontSize="8">← sama →</text>
                    </svg>
                  </div>
                </div>

                {/* Contoh Soal Arti Pecahan */}
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
                        Sebuah cokelat batangan dibagi menjadi 8 bagian yang sama. Dina memakan 3 bagian. Nyatakan bagian cokelat yang dimakan Dina dalam bentuk pecahan!
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Tentukan penyebut (total bagian) = 8</p>
                        <p><strong>Langkah 2:</strong> Tentukan pembilang (bagian yang dimakan) = 3</p>
                        <p><strong>Langkah 3:</strong> Tulis dalam bentuk pecahan:</p>
                        <div className="bg-slate-900/50 rounded p-3 mt-2">
                          <BlockMath math="\text{Bagian cokelat Dina} = \frac{3}{8}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, Dina memakan <InlineMath math="\frac{3}{8}" /> bagian dari cokelat.</p>
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
                        Nyatakan 45 menit dari 1 jam dalam bentuk pecahan paling sederhana!
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Ingat bahwa 1 jam = 60 menit</p>
                        <p><strong>Langkah 2:</strong> Tulis dalam bentuk pecahan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{45}{60}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Sederhanakan dengan membagi pembilang dan penyebut dengan FPB-nya (15):</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{45}{60} = \frac{45 \div 15}{60 \div 15} = \frac{3}{4}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, 45 menit = <InlineMath math="\frac{3}{4}" /> jam.</p>
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
                        Pada pecahan <InlineMath math="\frac{a}{b}" />, diketahui pembilang sama dengan 2 kurangnya dari penyebut. Jika penyebut bernilai 7, tentukan nilai pecahan tersebut dan gambarkan pada garis bilangan!
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Penyebut <InlineMath math="b = 7" /></p>
                        <p><strong>Langkah 2:</strong> Pembilang = penyebut - 2, maka <InlineMath math="a = 7 - 2 = 5" /></p>
                        <p><strong>Langkah 3:</strong> Pecahannya adalah:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{a}{b} = \frac{5}{7}" />
                        </div>
                        <p><strong>Langkah 4:</strong> Pada garis bilangan, <InlineMath math="\frac{5}{7}" /> terletak di antara 0 dan 1, lebih dekat ke 1:</p>
                        <div className="bg-slate-900/50 rounded p-3 font-mono text-xs text-center overflow-x-auto">
                          <p className="text-primary whitespace-nowrap">
                            {"0 ─┼─ 1/7 ─┼─ 2/7 ─┼─ 3/7 ─┼─ 4/7 ─┼─ 5/7 ─┼─ 6/7 ─┼─ 1"}
                          </p>
                          <p className="text-green-400 mt-1">{"                                        ↑"}</p>
                        </div>
                        <p className="text-primary font-semibold">Jadi, pecahannya adalah <InlineMath math="\frac{5}{7}" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Pecahan Senilai */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Equal className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">Pecahan Senilai</span>
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
                    <strong className="text-primary">Pecahan senilai</strong> adalah pecahan-pecahan yang memiliki nilai sama meskipun ditulis dengan angka yang berbeda. Ibarat mengukur jarak yang sama dengan satuan berbeda - 1 meter sama dengan 100 sentimeter!
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Contoh Visual:</strong> Bayangkan sebuah pizza. Jika dipotong jadi 2 dan kamu ambil 1 potong (<InlineMath math="\frac{1}{2}" />), itu sama dengan mengambil 2 potong dari pizza yang dipotong jadi 4 (<InlineMath math="\frac{2}{4}" />), atau 3 potong dari pizza yang dipotong jadi 6 (<InlineMath math="\frac{3}{6}" />).
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-lg font-bold text-primary"><InlineMath math="\frac{1}{2}" /></p>
                  </div>
                  <div className="flex items-center justify-center text-white/50">=</div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-lg font-bold text-cyan-400"><InlineMath math="\frac{2}{4}" /></p>
                  </div>
                  <div className="flex items-center justify-center text-white/50">=</div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-lg font-bold text-yellow-400"><InlineMath math="\frac{3}{6}" /></p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Rumus Pecahan Senilai:</p>
                  <div className="bg-slate-900/50 rounded p-4 text-center">
                    <BlockMath math="\frac{a}{b} = \frac{a \times m}{b \times m} = \frac{a \div n}{b \div n}" />
                    <p className="text-white/60 text-xs mt-2">dengan <InlineMath math="m, n \neq 0" /></p>
                  </div>
                  <p className="font-body text-sm text-white/70 mt-3 leading-relaxed">
                    Artinya, pecahan senilai diperoleh dengan <strong className="text-purple-300">mengalikan</strong> atau <strong className="text-purple-300">membagi</strong> pembilang dan penyebut dengan bilangan yang sama.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Menyederhanakan Pecahan:</strong> Untuk mendapatkan bentuk paling sederhana, bagi pembilang dan penyebut dengan <strong>FPB (Faktor Persekutuan Terbesar)</strong> keduanya!
                  </p>
                </div>

                {/* Contoh Soal Pecahan Senilai */}
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
                        Tentukan 2 pecahan yang senilai dengan <InlineMath math="\frac{2}{3}" />!
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Pecahan 1:</strong> Kalikan pembilang dan penyebut dengan 2</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{3} = \frac{2 \times 2}{3 \times 2} = \frac{4}{6}" />
                        </div>
                        <p><strong>Pecahan 2:</strong> Kalikan pembilang dan penyebut dengan 3</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{3} = \frac{2 \times 3}{3 \times 3} = \frac{6}{9}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, pecahan yang senilai dengan <InlineMath math="\frac{2}{3}" /> adalah <InlineMath math="\frac{4}{6}" /> dan <InlineMath math="\frac{6}{9}" /></p>
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
                        Sederhanakan pecahan <InlineMath math="\frac{24}{56}" /> ke bentuk paling sederhana!
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Cari FPB dari 24 dan 56</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p className="text-white/70 text-xs">Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24</p>
                          <p className="text-white/70 text-xs">Faktor 56: 1, 2, 4, 7, 8, 14, 28, 56</p>
                          <p className="text-cyan-300 text-sm mt-1">FPB = 8</p>
                        </div>
                        <p><strong>Langkah 2:</strong> Bagi pembilang dan penyebut dengan FPB</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{24}{56} = \frac{24 \div 8}{56 \div 8} = \frac{3}{7}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, bentuk paling sederhana dari <InlineMath math="\frac{24}{56}" /> adalah <InlineMath math="\frac{3}{7}" /></p>
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
                        Tentukan nilai <InlineMath math="x" /> jika <InlineMath math="\frac{3}{14} = \frac{x}{70}" /> adalah pecahan senilai!
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Cari pengali pada penyebut</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="14 \times ? = 70" />
                          <BlockMath math="? = 70 \div 14 = 5" />
                        </div>
                        <p><strong>Langkah 2:</strong> Karena penyebut dikali 5, maka pembilang juga harus dikali 5</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="x = 3 \times 5 = 15" />
                        </div>
                        <p><strong>Verifikasi:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{14} = \frac{3 \times 5}{14 \times 5} = \frac{15}{70}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, nilai <InlineMath math="x = 15" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Membandingkan Dua Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Membandingkan Dua Pecahan</span>
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
                    Untuk <strong className="text-primary">membandingkan dua pecahan</strong>, kuncinya adalah menyamakan penyebut terlebih dahulu. Setelah penyebutnya sama, tinggal bandingkan pembilangnya. Sederhana, kan?
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">Tiga Kemungkinan Hubungan:</p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-slate-900/50 rounded p-3 text-center">
                      <p className="text-green-400 text-lg font-bold"><InlineMath math="\frac{a}{b} > \frac{p}{q}" /></p>
                      <p className="text-white/60 text-xs mt-1">Lebih dari</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 text-center">
                      <p className="text-red-400 text-lg font-bold"><InlineMath math="\frac{a}{b} < \frac{p}{q}" /></p>
                      <p className="text-white/60 text-xs mt-1">Kurang dari</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 text-center">
                      <p className="text-yellow-400 text-lg font-bold"><InlineMath math="\frac{a}{b} = \frac{p}{q}" /></p>
                      <p className="text-white/60 text-xs mt-1">Sama dengan</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Langkah-langkah Membandingkan:</p>
                  <ol className="font-body text-sm text-white/80 space-y-2 list-decimal ml-4">
                    <li>Samakan penyebut kedua pecahan menggunakan <strong className="text-purple-300">KPK</strong></li>
                    <li>Ubah masing-masing pecahan ke bentuk senilai dengan penyebut yang sama</li>
                    <li>Bandingkan nilai pembilangnya</li>
                  </ol>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Tips Cepat:</strong> Kamu juga bisa membandingkan dengan <strong>cross multiplication</strong>. Untuk <InlineMath math="\frac{a}{b}" /> dan <InlineMath math="\frac{p}{q}" />, bandingkan <InlineMath math="a \times q" /> dengan <InlineMath math="b \times p" />
                  </p>
                </div>

                {/* Contoh Soal Membandingkan Pecahan */}
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
                        Bandingkan pecahan <InlineMath math="\frac{3}{4}" /> dan <InlineMath math="\frac{3}{5}" />! Manakah yang lebih besar?
                      </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Cari KPK dari 4 dan 5</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p>KPK(4, 5) = 20</p>
                        </div>
                        <p><strong>Langkah 2:</strong> Ubah ke penyebut 20</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{4} = \frac{3 \times 5}{4 \times 5} = \frac{15}{20}" />
                          <BlockMath math="\frac{3}{5} = \frac{3 \times 4}{5 \times 4} = \frac{12}{20}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Bandingkan pembilang: 15 {">"} 12</p>
                        <p className="text-primary font-semibold">Jadi, <InlineMath math="\frac{3}{4} > \frac{3}{5}" /></p>
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
                        Tentukan hubungan antara <InlineMath math="\frac{2}{3}" /> dan <InlineMath math="\frac{3}{4}" />!
                      </p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Metode Cross Multiplication:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p>Bandingkan <InlineMath math="2 \times 4" /> dengan <InlineMath math="3 \times 3" /></p>
                          <BlockMath math="2 \times 4 = 8" />
                          <BlockMath math="3 \times 3 = 9" />
                          <p className="text-cyan-300 mt-2">Karena 8 {"<"} 9</p>
                        </div>
                        <p className="text-primary font-semibold">Maka, <InlineMath math="\frac{2}{3} < \frac{3}{4}" /></p>
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
                        Urutkan pecahan berikut dari yang terkecil ke terbesar: <InlineMath math="\frac{7}{8}" />, <InlineMath math="\frac{11}{12}" />, <InlineMath math="\frac{2}{3}" />
                      </p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>Langkah 1:</strong> Cari KPK dari 8, 12, dan 3</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p>KPK(8, 12, 3) = 24</p>
                        </div>
                        <p><strong>Langkah 2:</strong> Ubah semua pecahan ke penyebut 24</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{7}{8} = \frac{7 \times 3}{8 \times 3} = \frac{21}{24}" />
                          <BlockMath math="\frac{11}{12} = \frac{11 \times 2}{12 \times 2} = \frac{22}{24}" />
                          <BlockMath math="\frac{2}{3} = \frac{2 \times 8}{3 \times 8} = \frac{16}{24}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Bandingkan pembilang: 16 {"<"} 21 {"<"} 22</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{16}{24} < \frac{21}{24} < \frac{22}{24}" />
                        </div>
                        <p className="text-primary font-semibold">Jadi, urutan dari terkecil ke terbesar: <InlineMath math="\frac{2}{3} < \frac{7}{8} < \frac{11}{12}" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Catatan Penting */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Catatan Penting
            </p>
            <ul className="font-body text-sm text-white/70 leading-relaxed space-y-2">
              <li>Penyebut pecahan tidak boleh nol (<InlineMath math="b \neq 0" />) karena pembagian dengan nol tidak terdefinisi.</li>
              <li>Untuk menyederhanakan pecahan, selalu cari FPB dari pembilang dan penyebut.</li>
              <li>Saat membandingkan pecahan dengan penyebut berbeda, gunakan KPK untuk menyamakan penyebutnya.</li>
            </ul>
          </div>

          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">🍕 RANGKUMAN LENGKAP</p>
              <p className="font-body text-xs text-white/80 mt-0.5">Arti Pecahan &amp; Bilangan Rasional — Kelas 7</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-[10px]">1</span>
                  Konsep Dasar Pecahan
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Pecahan = a/b", desc: "a = pembilang (bagian yang diambil), b = penyebut (jumlah bagian keseluruhan). Penyebut TIDAK boleh nol!", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
                    { label: "Pecahan Senilai", desc: "a/b = (a×k)/(b×k) dan a/b = (a÷k)/(b÷k). Kalikan atau bagi pembilang dan penyebut dengan bilangan yang sama.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
                    { label: "Menyederhanakan Pecahan", desc: "Bagi pembilang dan penyebut dengan FPB-nya. Contoh: 12/18 = 12÷6 / 18÷6 = 2/3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
                    { label: "Membandingkan Pecahan", desc: "Samakan penyebut dengan KPK terlebih dahulu. Setelah penyebut sama, bandingkan pembilangnya langsung.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
                    { label: "Jenis Pecahan", desc: "Biasa (a/b), Campuran (c a/b), Desimal (0,75), Persen (75%). Semuanya bisa dikonversi satu sama lain!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
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
                    { icon: "🔑", tip: "FPB untuk menyederhanakan, KPK untuk menyamakan", detail: "Ini dua alat utama dalam semua operasi pecahan. Kuasai FPB dan KPK, dan pecahan tidak akan pernah sulit lagi!", color: "bg-emerald-900/30 border-emerald-500/30" },
                    { icon: "👁️", tip: "Visualisasikan pecahan sebagai bagian kue/pizza", detail: "3/4 berarti 3 dari 4 potongan. Visualisasi ini membantu kamu mengerti operasi pecahan secara intuitif.", color: "bg-teal-900/30 border-teal-500/30" },
                    { icon: "⚡", tip: "Kalikan silang untuk membandingkan dua pecahan", detail: "Untuk a/b dan c/d: kalikan silang a×d dan b×c. Jika a×d > b×c, maka a/b > c/d. Tidak perlu cari KPK!", color: "bg-cyan-900/30 border-cyan-500/30" },
                    { icon: "✅", tip: "Selalu sederhanakan hasil akhirmu", detail: "Jawaban pecahan yang belum disederhanakan sering dianggap salah dalam ujian. Biasakan cari FPB di akhir!", color: "bg-blue-900/30 border-blue-500/30" },
                  ].map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌍</div>
                <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pecahan adalah <strong className="text-emerald-300">bahasa matematika untuk menyatakan bagian dari keseluruhan</strong>. Dari belahan pizza hingga nilai ujian, dari takaran resep masakan hingga persentase diskon — pecahan ada di mana-mana! Dengan memahami arti, jenis, dan cara menyederhanakan pecahan, kamu siap untuk <strong className="text-yellow-300">menguasai semua operasi pecahan</strong> berikutnya!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Pembilang/Penyebut", "Pecahan Senilai", "FPB untuk Sederhanakan", "KPK untuk Samakan", "Empat Jenis Pecahan"].map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🚀 Lanjut ke operasi-operasi pecahan!</p>
              </div>
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
  );
};

export default ArtiPecahanPage;
