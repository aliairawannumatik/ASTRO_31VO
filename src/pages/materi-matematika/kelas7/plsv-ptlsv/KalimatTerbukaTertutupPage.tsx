import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const KalimatTerbukaTertutupPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "terbuka", "tertutup", "tips", "contoh1", "contoh2", "contoh3"]);

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
          KALIMAT TERBUKA DAN TERTUTUP
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
                <span className="font-body font-semibold text-white">Apa Itu Kalimat Terbuka dan Tertutup?</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dalam matematika, tidak semua kalimat langsung bisa dinilai benar atau salah. Ada kalimat yang "menggantung" karena ada bagian yang belum diketahui — dan ada yang langsung bisa dinilai. Di sinilah perbedaan <strong className="text-primary">kalimat terbuka</strong> dan <strong className="text-primary">kalimat tertutup</strong>.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Bayangkan kamu menemukan secarik kertas bertuliskan: <em>"Aku punya __ ekor kucing."</em> Kamu tidak bisa menilai apakah itu banyak atau sedikit sebelum tahu isinya. Itulah konsep kalimat terbuka!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Kalimat Terbuka */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("terbuka")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Kalimat Terbuka</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">Definisi:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>Kalimat terbuka</strong> adalah kalimat matematika yang mengandung <strong className="text-primary">variabel (peubah)</strong> — yaitu simbol seperti <InlineMath math="x, y, n" />, dll — sehingga nilai kebenarannya (benar atau salah) belum bisa ditentukan sampai variabel tersebut diganti dengan suatu nilai tertentu.
                  </p>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Contoh kalimat terbuka:
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <InlineMath math="x + 5 = 12" /> → belum tahu apakah benar atau salah sebelum nilai <InlineMath math="x" /> diketahui.</p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="2y - 3 > 7" /> → bergantung pada nilai <InlineMath math="y" />.</p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="n^2 = 25" /> → bisa benar atau salah tergantung <InlineMath math="n" />.</p>
                  <p className="font-body text-sm text-white/80">• "Hari ini adalah hari ___" → tergantung hari apa.</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">Penyelesaian Kalimat Terbuka:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kalimat terbuka bisa diselesaikan dengan cara <strong>mengganti variabelnya</strong> dengan suatu bilangan hingga kalimat tersebut menjadi <strong className="text-green-300">kalimat yang benar</strong>. Pengganti variabel yang membuat kalimat terbuka menjadi benar disebut <strong className="text-primary">penyelesaian</strong> atau <strong className="text-primary">solusi</strong>.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <p className="font-body text-sm text-white/80">
                      Contoh: Kalimat terbuka <InlineMath math="x + 5 = 12" />
                    </p>
                    <p className="font-body text-sm text-white/80">
                      Coba <InlineMath math="x = 7" />: <InlineMath math="7 + 5 = 12" /> → <strong className="text-green-400">BENAR ✓</strong> → Jadi <InlineMath math="x = 7" /> adalah penyelesaiannya.
                    </p>
                    <p className="font-body text-sm text-white/80">
                      Coba <InlineMath math="x = 3" />: <InlineMath math="3 + 5 = 8 \neq 12" /> → <strong className="text-red-400">SALAH ✗</strong>
                    </p>
                  </div>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Himpunan semua nilai pengganti yang membuat kalimat terbuka menjadi benar disebut <strong className="text-primary">Himpunan Penyelesaian (HP)</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Kalimat Tertutup */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tertutup")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Kalimat Tertutup (Pernyataan)</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">Definisi:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>Kalimat tertutup</strong> (juga disebut <strong className="text-primary">pernyataan</strong>) adalah kalimat matematika yang sudah <strong>tidak mengandung variabel</strong>, sehingga bisa langsung ditentukan nilai kebenarannya — apakah <strong className="text-green-400">benar (B)</strong> atau <strong className="text-red-400">salah (S)</strong>.
                  </p>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Contoh kalimat tertutup (pernyataan):
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <InlineMath math="5 + 3 = 8" /> → <strong className="text-green-400">Benar ✓</strong></p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="10 - 4 = 7" /> → <strong className="text-red-400">Salah ✗</strong> (harusnya 6)</p>
                  <p className="font-body text-sm text-white/80">• "Jakarta adalah ibukota Indonesia" → <strong className="text-green-400">Benar ✓</strong></p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="2^3 = 6" /> → <strong className="text-red-400">Salah ✗</strong> (harusnya 8)</p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="15 > 9" /> → <strong className="text-green-400">Benar ✓</strong></p>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-orange-200 leading-relaxed">
                    <strong>Catatan penting:</strong> Kalimat yang tidak bisa dinilai benar/salah, seperti perintah ("Tutup pintunya!") atau pertanyaan ("Berapa umurmu?"), <strong>bukan</strong> termasuk kalimat tertutup maupun terbuka dalam matematika.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tips")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Tips Cepat Membedakan Kalimat Terbuka & Tertutup</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">🚀 Tips Astronot Matematika:</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>✅ <strong>Langkah 1:</strong> Cek apakah ada huruf variabel (<InlineMath math="x, y, n, a" />, dll) di dalam kalimat.</p>
                    <p>✅ <strong>Langkah 2:</strong> Jika <strong className="text-blue-300">ada variabel</strong> → itu <strong className="text-blue-300">Kalimat Terbuka</strong>.</p>
                    <p>✅ <strong>Langkah 3:</strong> Jika <strong className="text-purple-300">tidak ada variabel</strong> dan bisa dinilai benar/salah → itu <strong className="text-purple-300">Kalimat Tertutup (Pernyataan)</strong>.</p>
                    <p>✅ <strong>Langkah 4:</strong> Jika berupa perintah atau pertanyaan → <strong className="text-red-300">bukan keduanya</strong>.</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">Tabel Ringkasan:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-4 text-primary">Jenis</th>
                          <th className="text-left py-2 pr-4 text-primary">Ciri-ciri</th>
                          <th className="text-left py-2 text-primary">Bisa dinilai?</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-blue-300 font-semibold">Terbuka</td>
                          <td className="py-2 pr-4">Ada variabel</td>
                          <td className="py-2 text-red-400">Belum bisa</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-purple-300 font-semibold">Tertutup</td>
                          <td className="py-2 pr-4">Tanpa variabel</td>
                          <td className="py-2 text-green-400">Bisa (B/S)</td>
                        </tr>
                      </tbody>
                    </table>
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
                    Tentukan mana yang termasuk kalimat terbuka dan mana yang termasuk kalimat tertutup (pernyataan) dari kalimat-kalimat berikut:
                  </p>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="7 + x = 15" /></p>
                    <p>b. <InlineMath math="3 \times 4 = 12" /></p>
                    <p>c. <InlineMath math="9 - 2 = 8" /></p>
                    <p>d. <InlineMath math="2n + 1 = 9" /></p>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>Cek setiap kalimat:</strong></p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <p>a. <InlineMath math="7 + x = 15" /> → ada variabel <InlineMath math="x" /> → <strong className="text-blue-300">Kalimat Terbuka</strong></p>
                      <p>b. <InlineMath math="3 \times 4 = 12" /> → tidak ada variabel, nilainya benar → <strong className="text-purple-300">Kalimat Tertutup (Benar)</strong></p>
                      <p>c. <InlineMath math="9 - 2 = 8" /> → tidak ada variabel, nilainya salah (harusnya 7) → <strong className="text-purple-300">Kalimat Tertutup (Salah)</strong></p>
                      <p>d. <InlineMath math="2n + 1 = 9" /> → ada variabel <InlineMath math="n" /> → <strong className="text-blue-300">Kalimat Terbuka</strong></p>
                    </div>
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
                    Diberikan kalimat terbuka <InlineMath math="3x - 2 = 7" />. Tentukan apakah nilai-nilai berikut merupakan penyelesaiannya:
                  </p>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="x = 3" /></p>
                    <p>b. <InlineMath math="x = 5" /></p>
                    <p>c. <InlineMath math="x = 4" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p>Cara menguji: substitusi setiap nilai ke kalimat terbuka, lihat apakah hasilnya benar.</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3">
                      <div>
                        <p><strong>a. Uji <InlineMath math="x = 3" />:</strong></p>
                        <p className="ml-4"><InlineMath math="3(3) - 2 = 9 - 2 = 7" /> → <strong className="text-green-400">Benar! ✓</strong> → <InlineMath math="x = 3" /> adalah penyelesaian.</p>
                      </div>
                      <div>
                        <p><strong>b. Uji <InlineMath math="x = 5" />:</strong></p>
                        <p className="ml-4"><InlineMath math="3(5) - 2 = 15 - 2 = 13 \neq 7" /> → <strong className="text-red-400">Salah ✗</strong> → <InlineMath math="x = 5" /> bukan penyelesaian.</p>
                      </div>
                      <div>
                        <p><strong>c. Uji <InlineMath math="x = 4" />:</strong></p>
                        <p className="ml-4"><InlineMath math="3(4) - 2 = 12 - 2 = 10 \neq 7" /> → <strong className="text-red-400">Salah ✗</strong> → <InlineMath math="x = 4" /> bukan penyelesaian.</p>
                      </div>
                    </div>
                    <p><strong>Kesimpulan:</strong> Himpunan Penyelesaian (HP) = <InlineMath math="\{3\}" /></p>
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
                    Dari kalimat-kalimat berikut, klasifikasikan masing-masing sebagai kalimat terbuka, kalimat tertutup benar, kalimat tertutup salah, atau bukan keduanya. Jika kalimat terbuka, tentukan satu nilai penyelesaiannya!
                  </p>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="\frac{x+1}{2} = 4" /></p>
                    <p>b. <InlineMath math="5^2 + 12^2 = 13^2" /></p>
                    <p>c. "Kerjakan soal nomor 3!"</p>
                    <p>d. <InlineMath math="n^2 - 4 = 0" /> untuk <InlineMath math="n \in \{1, 2, 3\}" /></p>
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-4 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-3">
                      <div>
                        <p><strong>a. <InlineMath math="\frac{x+1}{2} = 4" /></strong> → Ada variabel <InlineMath math="x" /> → <strong className="text-blue-300">Kalimat Terbuka</strong></p>
                        <p className="ml-4">Cari penyelesaian: <InlineMath math="x + 1 = 8" />, maka <InlineMath math="x = 7" />. Cek: <InlineMath math="\frac{7+1}{2} = \frac{8}{2} = 4" /> ✓</p>
                        <p className="ml-4">HP = <InlineMath math="\{7\}" /></p>
                      </div>
                      <div>
                        <p><strong>b. <InlineMath math="5^2 + 12^2 = 13^2" /></strong> → Tidak ada variabel.</p>
                        <p className="ml-4">Cek: <InlineMath math="25 + 144 = 169" /> dan <InlineMath math="13^2 = 169" /> → <strong className="text-purple-300">Kalimat Tertutup Benar ✓</strong> (ini adalah Triple Pythagoras!)</p>
                      </div>
                      <div>
                        <p><strong>c. "Kerjakan soal nomor 3!"</strong> → Berupa perintah, tidak bisa dinilai benar/salah → <strong className="text-orange-300">Bukan kalimat terbuka maupun tertutup</strong></p>
                      </div>
                      <div>
                        <p><strong>d. <InlineMath math="n^2 - 4 = 0" /></strong> → Ada variabel <InlineMath math="n" /> → <strong className="text-blue-300">Kalimat Terbuka</strong></p>
                        <p className="ml-4">Uji dari <InlineMath math="\{1, 2, 3\}" />:</p>
                        <p className="ml-4">• <InlineMath math="n=1" />: <InlineMath math="1-4 = -3 \neq 0" /> ✗</p>
                        <p className="ml-4">• <InlineMath math="n=2" />: <InlineMath math="4-4 = 0" /> ✓ → <InlineMath math="n=2" /> adalah penyelesaian</p>
                        <p className="ml-4">• <InlineMath math="n=3" />: <InlineMath math="9-4 = 5 \neq 0" /> ✗</p>
                        <p className="ml-4">HP dari himpunan <InlineMath math="\{1,2,3\}" /> = <InlineMath math="\{2\}" /></p>
                      </div>
                    </div>
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

export default KalimatTerbukaTertutupPage;
