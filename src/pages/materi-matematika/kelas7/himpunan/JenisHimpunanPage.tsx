import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Calculator,
  Target,
  Layers,
  Star,
  Infinity,
  Circle,
  Grid3x3,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const JenisHimpunanPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "berhingga", "kosong", "takhingga", "bagian", "semesta", "kuasa",
  ]);

  const toggleSection = (s: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const SectionHeader = ({
    id, icon, label, iconColor,
  }: { id: string; icon: React.ReactNode; label: string; iconColor: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
      {expandedSections.includes(id) ? (
        <ChevronUp className="w-5 h-5 text-primary" />
      ) : (
        <ChevronDown className="w-5 h-5 text-primary" />
      )}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          JENIS-JENIS HIMPUNAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-1 font-body">
          Himpunan Berhingga · Kosong · Tak Hingga · Bagian · Semesta · Kuasa
        </p>
        <p className="text-white/40 text-xs text-center mb-6 font-body">
          Kelas 7 · Himpunan · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 1: HIMPUNAN BERHINGGA */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="berhingga"
              icon={<Target className="w-5 h-5" />}
              label="Sub-Bab 1: Himpunan Berhingga"
              iconColor="text-green-400"
            />
            {expandedSections.includes("berhingga") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Himpunan berhingga</strong> adalah himpunan yang
                    jumlah anggotanya bisa dihitung dan pasti ada habisnya. Kamu bisa menghitung
                    anggotanya satu per satu hingga selesai. Banyaknya anggota sebuah himpunan{" "}
                    <InlineMath math="A" /> dinotasikan sebagai <InlineMath math="n(A)" />.
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Contoh Himpunan Berhingga:</p>
                    <div className="space-y-1 font-body text-sm text-white/80">
                      <p><InlineMath math="A = \{1, 3, 5, 7, 9\}" /> → <InlineMath math="n(A) = 5" /></p>
                      <p><InlineMath math="B = \{a, b, c, d, e\}" /> → <InlineMath math="n(B) = 5" /></p>
                      <p><InlineMath math="C = \{\text{merah, kuning, hijau}\}" /> → <InlineMath math="n(C) = 3" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Himpunan kosong juga termasuk himpunan berhingga karena
                      banyak anggotanya adalah 0, yaitu <InlineMath math="n(\emptyset) = 0" />.
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan nilai <InlineMath math="n(A)" />, <InlineMath math="n(B)" />, dan{" "}
                      <InlineMath math="n(C)" /> dari himpunan-himpunan berikut:
                    </p>
                    <div className="font-body text-sm text-white/80 mt-2 space-y-1">
                      <p>a. <InlineMath math="A = \{2, 4, 6, 8, 10, 12\}" /></p>
                      <p>b. <InlineMath math="B = \{\text{Senin, Rabu, Jumat}\}" /></p>
                      <p>c. <InlineMath math={"C = \\{x \\mid x \\text{ adalah huruf pada kata HIMPUNAN}\\}"} /></p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>a.</strong> Hitung langsung anggota A: ada 6 bilangan genap.</p>
                        <p className="text-primary"><InlineMath math="n(A) = 6" /></p>
                        <p><strong>b.</strong> Hitung anggota B: Senin, Rabu, Jumat = 3 hari.</p>
                        <p className="text-primary"><InlineMath math="n(B) = 3" /></p>
                        <p><strong>c.</strong> Huruf pada "HIMPUNAN": H, I, M, P, U, N, A, N → <strong>N muncul dua kali, hanya ditulis sekali</strong>.</p>
                        <p>Anggota: H, I, M, P, U, N, A → ada 7 huruf berbeda.</p>
                        <p className="text-primary"><InlineMath math="n(C) = 7" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Himpunan <InlineMath math="P" /> adalah bilangan prima kurang dari 20. Himpunan{" "}
                      <InlineMath math="Q" /> adalah faktor dari 24 yang lebih dari 5. Tentukan{" "}
                      <InlineMath math="n(P)" /> dan <InlineMath math="n(Q)" />, lalu bandingkan mana yang lebih banyak anggotanya!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Tentukan P:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Bilangan prima &lt; 20: 2, 3, 5, 7, 11, 13, 17, 19</p>
                        <p className="text-primary"><InlineMath math="P = \{2,3,5,7,11,13,17,19\}" />, <InlineMath math="n(P) = 8" /></p>
                      </div>
                      <p><strong>Langkah 2 — Tentukan Q:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24. Yang &gt; 5: 6, 8, 12, 24</p>
                        <p className="text-primary"><InlineMath math="Q = \{6, 8, 12, 24\}" />, <InlineMath math="n(Q) = 4" /></p>
                      </div>
                      <p><strong>Kesimpulan:</strong> <InlineMath math="n(P) = 8 > n(Q) = 4" />, jadi himpunan P lebih banyak anggotanya.</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui himpunan <InlineMath math="R = \{x \mid 1 \leq x \leq 20,\ x \in \mathbb{Z},\ x \text{ habis dibagi 3 atau habis dibagi 5}\}" />.
                      Tentukan anggota R dan nilai <InlineMath math="n(R)" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Cari bilangan habis dibagi 3 (dari 1 s.d. 20):</strong></p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p>3, 6, 9, 12, 15, 18</p>
                      </div>
                      <p><strong>Langkah 2 — Cari bilangan habis dibagi 5 (dari 1 s.d. 20):</strong></p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p>5, 10, 15, 20</p>
                      </div>
                      <p><strong>Langkah 3 — Gabungkan (tanpa duplikasi, 15 dihitung sekali):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-primary"><InlineMath math="R = \{3, 5, 6, 9, 10, 12, 15, 18, 20\}" /></p>
                        <p className="mt-1 text-primary font-semibold"><InlineMath math="n(R) = 9" /></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 2: HIMPUNAN KOSONG */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="kosong"
              icon={<Circle className="w-5 h-5" />}
              label="Sub-Bab 2: Himpunan Kosong"
              iconColor="text-slate-300"
            />
            {expandedSections.includes("kosong") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-slate-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-slate-300">Himpunan kosong</strong> adalah himpunan yang
                    sama sekali tidak memiliki anggota. Kondisi ini terjadi ketika tidak ada objek apapun
                    yang memenuhi syarat yang diberikan. Ditulis dengan simbol{" "}
                    <InlineMath math="\emptyset" /> atau <InlineMath math="\{\}" />.
                  </p>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-red-400">⚠️ Jebakan yang Sering Muncul:</p>
                    <div className="font-body text-sm text-white/80 space-y-1">
                      <p><strong className="text-red-400">Salah:</strong> <InlineMath math="\{\emptyset\}" /> — ini bukan himpunan kosong! Ini himpunan yang berisi simbol kosong, jadi punya 1 anggota.</p>
                      <p><strong className="text-red-400">Salah:</strong> <InlineMath math="\{0\}" /> — ini bukan himpunan kosong! Ini himpunan yang berisi angka 0, jadi punya 1 anggota.</p>
                      <p><strong className="text-green-400">Benar:</strong> <InlineMath math="\emptyset" /> atau <InlineMath math="\{\}" /> — inilah himpunan kosong sejati, <InlineMath math="n(\emptyset) = 0" />.</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Contoh Himpunan Kosong:</p>
                    <ul className="font-body text-sm text-white/70 space-y-1 list-disc list-inside">
                      <li>Himpunan bilangan asli antara 3 dan 4 → tidak ada</li>
                      <li>Himpunan kucing yang bisa terbang → tidak ada</li>
                      <li>Himpunan bilangan prima yang genap selain 2 → tidak ada</li>
                      <li>Himpunan bilangan bulat yang kuadratnya negatif → tidak ada</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Himpunan kosong adalah himpunan yang paling "kecil"
                      sekaligus paling "unik" — ia merupakan himpunan bagian dari <em>setiap</em> himpunan!
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan apakah himpunan berikut merupakan himpunan kosong atau bukan:
                    </p>
                    <div className="font-body text-sm text-white/80 mt-2 space-y-1">
                      <p>a. Himpunan bilangan genap yang habis dibagi 3 antara 1 dan 10</p>
                      <p>b. Himpunan bilangan asli yang lebih besar dari 100 dan lebih kecil dari 101</p>
                      <p>c. <InlineMath math="\{0\}" /></p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>a.</strong> Bilangan genap antara 1–10: 2, 4, 6, 8, 10. Yang habis dibagi 3: 6. <strong className="text-green-400">Bukan kosong</strong> → <InlineMath math="\{6\}" /></p>
                      <p><strong>b.</strong> Tidak ada bilangan asli antara 100 dan 101. <strong className="text-slate-300">Himpunan Kosong</strong> → <InlineMath math="\emptyset" /></p>
                      <p><strong>c.</strong> <InlineMath math="\{0\}" /> memiliki satu anggota yaitu 0. <strong className="text-green-400">Bukan himpunan kosong</strong>, <InlineMath math="n = 1" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diberikan persamaan <InlineMath math="x^2 + 4 = 0" /> dengan <InlineMath math="x \in \mathbb{R}" />{" "}
                      (bilangan real). Nyatakan himpunan penyelesaiannya! Apakah himpunan kosong?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Selesaikan persamaan:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="x^2 + 4 = 0 \implies x^2 = -4" />
                        <p className="mt-1">Tidak ada bilangan real yang kuadratnya negatif.</p>
                      </div>
                      <p><strong>Kesimpulan:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-slate-300 font-semibold">Himpunan penyelesaiannya adalah <InlineMath math="\emptyset" /> (himpunan kosong).</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="A = \{x \mid x^2 = 9,\ x \in \mathbb{N}\}" /> dan{" "}
                      <InlineMath math="B = \{x \mid x < 0,\ x \in \mathbb{N}\}" />. Tentukan apakah A
                      dan B himpunan kosong. Jika tidak, tuliskan anggotanya!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>Himpunan A:</strong> Bilangan asli yang kuadratnya = 9</p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p><InlineMath math="x^2 = 9 \implies x = 3" /> atau <InlineMath math="x = -3" /></p>
                          <p>Karena <InlineMath math="x \in \mathbb{N}" />, hanya <InlineMath math="x = 3" /> yang memenuhi (bilangan asli &gt; 0).</p>
                          <p className="text-green-400 font-semibold"><InlineMath math="A = \{3\}" /> → <strong>Bukan himpunan kosong</strong></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>Himpunan B:</strong> Bilangan asli yang kurang dari 0</p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Bilangan asli (<InlineMath math="\mathbb{N}" />) adalah 1, 2, 3, ... — semuanya positif.</p>
                          <p>Tidak ada bilangan asli yang &lt; 0.</p>
                          <p className="text-slate-300 font-semibold"><InlineMath math="B = \emptyset" /> → <strong>Himpunan kosong</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 3: HIMPUNAN TAK HINGGA */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="takhingga"
              icon={<Infinity className="w-5 h-5" />}
              label="Sub-Bab 3: Himpunan Tak Hingga"
              iconColor="text-blue-400"
            />
            {expandedSections.includes("takhingga") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-blue-300">Himpunan tak hingga</strong> adalah himpunan yang
                    jumlah anggotanya tidak dapat dihitung habis karena terus berlanjut tanpa batas.
                    Saat mendaftar, digunakan tanda <InlineMath math="..." /> yang menunjukkan pola berlanjut
                    selamanya.
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Contoh Himpunan Tak Hingga:</p>
                    <div className="space-y-1 font-body text-sm text-white/80">
                      <p><InlineMath math="\mathbb{N} = \{1, 2, 3, 4, 5, ...\}" /> (bilangan asli)</p>
                      <p><InlineMath math="\mathbb{Z} = \{..., -2, -1, 0, 1, 2, ...\}" /> (bilangan bulat)</p>
                      <p><InlineMath math="G = \{2, 4, 6, 8, ...\}" /> (bilangan genap positif)</p>
                      <p><InlineMath math="K = \{3, 6, 9, 12, ...\}" /> (kelipatan 3 positif)</p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Tanda <InlineMath math="..." /> di tengah (seperti{" "}
                      <InlineMath math="\{1, 2, ..., 100\}" />) artinya himpunan <em>berhingga</em> yang
                      polanya jelas. Tanda <InlineMath math="..." /> di akhir (seperti{" "}
                      <InlineMath math="\{1, 2, 3, ...\}" />) artinya himpunan <em>tak hingga</em>!
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Klasifikasikan himpunan berikut: berhingga, kosong, atau tak hingga!
                    </p>
                    <div className="font-body text-sm text-white/80 mt-2 space-y-1">
                      <p>a. <InlineMath math="\{10, 20, 30, ..., 100\}" /></p>
                      <p>b. <InlineMath math="\{1, 4, 9, 16, 25, ...\}" /></p>
                      <p>c. Himpunan bilangan bulat negatif genap</p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>a.</strong> Titik-titik di tengah, ada batas atas (100). Anggota: 10, 20, ..., 100 = 10 anggota. <strong className="text-green-400">Berhingga</strong>, <InlineMath math="n = 10" /></p>
                      <p><strong>b.</strong> Ini adalah himpunan bilangan kuadrat sempurna: 1², 2², 3², 4², 5², ... Tidak ada batasnya. <strong className="text-blue-400">Tak Hingga</strong></p>
                      <p><strong>c.</strong> Bilangan bulat negatif genap: -2, -4, -6, -8, ... terus ke negatif tak berhingga. <strong className="text-blue-400">Tak Hingga</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Himpunan <InlineMath math="S = \{x \mid x = 2n - 1,\ n \in \mathbb{N}\}" />.
                      Tentukan jenis himpunan ini, lalu tuliskan 5 anggota pertamanya!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Substitusi n = 1, 2, 3, 4, 5:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><InlineMath math="n=1: 2(1)-1 = 1" /></p>
                        <p><InlineMath math="n=2: 2(2)-1 = 3" /></p>
                        <p><InlineMath math="n=3: 2(3)-1 = 5" /></p>
                        <p><InlineMath math="n=4: 2(4)-1 = 7" /></p>
                        <p><InlineMath math="n=5: 2(5)-1 = 9" /></p>
                      </div>
                      <p><strong>Langkah 2 — Identifikasi pola:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Ini adalah himpunan <strong>bilangan ganjil positif</strong>: <InlineMath math="S = \{1, 3, 5, 7, 9, ...\}" /></p>
                        <p className="text-blue-400 font-semibold mt-1">Jenis: <strong>Himpunan Tak Hingga</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari himpunan <InlineMath math="T = \{x \mid x \text{ adalah bilangan prima}\}" />,
                      apakah T himpunan berhingga atau tak hingga? Jelaskan! Kemudian buat himpunan{" "}
                      <InlineMath math="T_1" /> yang merupakan bilangan prima antara 1 dan 30, dan tentukan{" "}
                      <InlineMath math="n(T_1)" />.
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>Jenis T:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Telah dibuktikan secara matematis oleh Euclid bahwa bilangan prima ada tak terhingga banyaknya (tidak ada bilangan prima terbesar).</p>
                          <p className="text-blue-400 font-semibold mt-1"><strong>T adalah himpunan tak hingga.</strong></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>Himpunan T₁ (prima antara 1 dan 30):</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <BlockMath math="T_1 = \{2, 3, 5, 7, 11, 13, 17, 19, 23, 29\}" />
                          <p className="text-primary font-semibold"><InlineMath math="n(T_1) = 10" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 4: HIMPUNAN BAGIAN */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="bagian"
              icon={<Layers className="w-5 h-5" />}
              label="Sub-Bab 4: Himpunan Bagian"
              iconColor="text-purple-400"
            />
            {expandedSections.includes("bagian") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-purple-300">📌 Ringkasan Intisari</p>

                  {/* Definisi */}
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-purple-300">① Definisi</p>
                    <p className="font-body text-sm text-white/80">
                      Himpunan <InlineMath math="A" /> disebut <strong className="text-purple-300">himpunan bagian</strong>{" "}
                      dari himpunan <InlineMath math="B" /> (ditulis <InlineMath math="A \subseteq B" />) jika
                      setiap anggota <InlineMath math="A" /> juga merupakan anggota <InlineMath math="B" />.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <div className="flex-1 bg-green-900/30 rounded p-2">
                        <p className="font-body text-xs text-green-300 font-semibold">Contoh:</p>
                        <p className="font-body text-xs text-white/70 mt-1">
                          <InlineMath math="A = \{1,2\}" />, <InlineMath math="B = \{1,2,3,4\}" />
                        </p>
                        <p className="font-body text-xs text-green-400 mt-1">
                          <InlineMath math="A \subseteq B" /> ✓
                        </p>
                      </div>
                      <div className="flex-1 bg-red-900/30 rounded p-2">
                        <p className="font-body text-xs text-red-300 font-semibold">Bukan himpunan bagian:</p>
                        <p className="font-body text-xs text-white/70 mt-1">
                          <InlineMath math="C = \{1,5\}" />, <InlineMath math="B = \{1,2,3,4\}" />
                        </p>
                        <p className="font-body text-xs text-red-400 mt-1">
                          <InlineMath math="C \not\subseteq B" /> ✗ (5 tidak ada di B)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Aturan */}
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-purple-300">② Aturan Penting</p>
                    <ul className="font-body text-sm text-white/80 space-y-2 list-disc list-inside">
                      <li>Setiap himpunan adalah himpunan bagian dari dirinya sendiri: <InlineMath math="A \subseteq A" /></li>
                      <li>Himpunan kosong adalah himpunan bagian dari setiap himpunan: <InlineMath math="\emptyset \subseteq A" /></li>
                      <li>Jika <InlineMath math="A \subseteq B" /> dan <InlineMath math="B \subseteq A" />, maka <InlineMath math="A = B" /></li>
                      <li><InlineMath math="A \subset B" /> (himpunan bagian sejati): A ⊆ B tapi <InlineMath math="A \neq B" /></li>
                    </ul>
                  </div>

                  {/* Segitiga Pascal */}
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-3">
                    <p className="font-body text-xs font-semibold text-purple-300">③ Segitiga Pascal & Banyaknya Himpunan Bagian</p>
                    <p className="font-body text-sm text-white/80">
                      Jika <InlineMath math="n(A) = n" />, maka banyaknya himpunan bagian dari A adalah{" "}
                      <InlineMath math="2^n" />. Hubungan ini bisa ditemukan dari <strong>Segitiga Pascal</strong>:
                    </p>
                    {/* Visual Segitiga Pascal */}
                    <div className="flex flex-col items-center gap-1 py-2">
                      {[
                        [1],
                        [1,1],
                        [1,2,1],
                        [1,3,3,1],
                        [1,4,6,4,1],
                      ].map((row, ri) => (
                        <div key={ri} className="flex gap-2 items-center">
                          {row.map((val, ci) => (
                            <div key={ci} className="w-8 h-8 rounded-full bg-purple-600/40 border border-purple-500/50 flex items-center justify-center">
                              <span className="font-body text-xs font-bold text-purple-200">{val}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead>
                          <tr className="bg-purple-900/40">
                            <th className="border border-purple-700/40 px-2 py-1 text-purple-300">n(A)</th>
                            <th className="border border-purple-700/40 px-2 py-1 text-purple-300">Baris Pascal</th>
                            <th className="border border-purple-700/40 px-2 py-1 text-purple-300">Jumlah</th>
                            <th className="border border-purple-700/40 px-2 py-1 text-purple-300">= 2ⁿ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["0","1","1","2⁰ = 1"],
                            ["1","1  1","2","2¹ = 2"],
                            ["2","1  2  1","4","2² = 4"],
                            ["3","1  3  3  1","8","2³ = 8"],
                            ["4","1  4  6  4  1","16","2⁴ = 16"],
                          ].map(([n, row, sum, pow], i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-slate-900/30" : "bg-slate-800/20"}>
                              <td className="border border-purple-700/30 px-2 py-1 text-center text-white/80">{n}</td>
                              <td className="border border-purple-700/30 px-2 py-1 text-center text-white/70">{row}</td>
                              <td className="border border-purple-700/30 px-2 py-1 text-center text-primary font-bold">{sum}</td>
                              <td className="border border-purple-700/30 px-2 py-1 text-center text-purple-300 font-bold">{pow}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white/80 mt-1">
                      Setiap baris Segitiga Pascal mewakili kombinasi pemilihan anggota.
                      Jumlah semua bilangan di setiap baris selalu <strong className="text-purple-300">dua kali</strong> baris sebelumnya, sehingga rumusnya adalah <InlineMath math="2^n" />.
                    </p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Rumus Utama:</strong> Jika <InlineMath math="n(A) = n" />, maka banyak himpunan bagian dari A = <InlineMath math="2^n" />.
                      Ingat: himpunan kosong dan himpunan itu sendiri selalu termasuk!
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="A = \{1, 2, 3\}" />. Tuliskan semua himpunan bagian dari A!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Gunakan rumus:</strong> <InlineMath math="n(A) = 3 \implies 2^3 = 8" /> himpunan bagian.</p>
                      <p><strong>Langkah 2 — Daftar semua himpunan bagian:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <p>• <InlineMath math="\emptyset" /> (0 anggota)</p>
                          <p>• <InlineMath math="\{1\}" /> (1 anggota)</p>
                          <p>• <InlineMath math="\{2\}" /> (1 anggota)</p>
                          <p>• <InlineMath math="\{3\}" /> (1 anggota)</p>
                          <p>• <InlineMath math="\{1,2\}" /> (2 anggota)</p>
                          <p>• <InlineMath math="\{1,3\}" /> (2 anggota)</p>
                          <p>• <InlineMath math="\{2,3\}" /> (2 anggota)</p>
                          <p>• <InlineMath math="\{1,2,3\}" /> (3 anggota)</p>
                        </div>
                      </div>
                      <p className="text-primary font-semibold">Total: 8 himpunan bagian ✓</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="B = \{a, b, c, d, e\}" />. Berapa banyak himpunan bagian B?
                      Berapa banyak himpunan bagian yang memiliki tepat 3 anggota?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Total himpunan bagian:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="n(B) = 5 \implies 2^5 = 32 \text{ himpunan bagian}" />
                      </div>
                      <p><strong>Langkah 2 — Yang tepat 3 anggota (gunakan baris Pascal ke-5: 1 5 10 10 5 1):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>Baris Pascal untuk n=5: <strong>1 — 5 — 10 — 10 — 5 — 1</strong></p>
                        <p>Angka ke-4 (posisi 3 anggota dari 5) = <strong className="text-primary">10</strong></p>
                        <p className="text-xs text-white/60">Atau: C(5,3) = 5!/(3!·2!) = 10</p>
                      </div>
                      <p className="text-primary font-semibold">Ada <strong>10</strong> himpunan bagian yang memiliki tepat 3 anggota.</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah himpunan <InlineMath math="X" /> memiliki banyak himpunan bagian sebanyak 64.
                      Tentukan nilai <InlineMath math="n(X)" />! Kemudian, jika <InlineMath math="Y = \{p, q, r\}" />,
                      tentukan semua himpunan bagian sejati (proper subset) dari Y!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>Langkah 1 — Cari n(X):</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <BlockMath math="2^n = 64 \implies 2^n = 2^6 \implies n = 6" />
                          <p className="text-primary font-semibold"><InlineMath math="n(X) = 6" /></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>Langkah 2 — Himpunan bagian sejati Y (semua kecuali Y itu sendiri):</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Total himpunan bagian Y: <InlineMath math="2^3 = 8" /></p>
                          <p>Himpunan bagian sejati = total − 1 = <strong className="text-primary">7</strong></p>
                          <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                            <p>• <InlineMath math="\emptyset" /></p>
                            <p>• <InlineMath math="\{p\}" /></p>
                            <p>• <InlineMath math="\{q\}" /></p>
                            <p>• <InlineMath math="\{r\}" /></p>
                            <p>• <InlineMath math="\{p,q\}" /></p>
                            <p>• <InlineMath math="\{p,r\}" /></p>
                            <p>• <InlineMath math="\{q,r\}" /></p>
                          </div>
                          <p className="text-white/60 text-xs mt-2">( <InlineMath math="\{p,q,r\}" /> tidak termasuk karena bukan bagian <em>sejati</em>)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 5: HIMPUNAN SEMESTA */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="semesta"
              icon={<Star className="w-5 h-5" />}
              label="Sub-Bab 5: Himpunan Semesta"
              iconColor="text-yellow-400"
            />
            {expandedSections.includes("semesta") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-yellow-300">Himpunan semesta</strong> (simbol <InlineMath math="S" /> atau{" "}
                    <InlineMath math="U" />) adalah himpunan yang memuat <em>semua</em> anggota dari
                    himpunan-himpunan lain yang sedang dibahas. Ia adalah "wadah terbesar" dalam
                    suatu pembicaraan. Setiap himpunan yang dibahas pasti merupakan himpunan bagian
                    dari himpunan semesta.
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Contoh Himpunan Semesta:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="flex gap-3 items-start">
                        <span className="text-yellow-400 font-bold shrink-0">Jika membahas:</span>
                        <span>Himpunan bilangan ganjil dan genap</span>
                      </div>
                      <div className="flex gap-3 items-start">
                        <span className="text-yellow-400 font-bold shrink-0">Maka S =</span>
                        <span>Himpunan bilangan bulat (atau bilangan asli, tergantung konteks)</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-900/30 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-orange-300">🎨 Visualisasi Diagram Venn:</p>
                    {/* Simple Venn-like visual */}
                    <div className="relative bg-slate-900/60 border-2 border-yellow-500/50 rounded-xl p-4 h-28 flex items-center justify-center">
                      <div className="absolute top-2 left-3 font-body text-xs text-yellow-400 font-bold">S</div>
                      <div className="flex gap-4">
                        <div className="bg-blue-600/30 border border-blue-500/50 rounded-full w-16 h-16 flex items-center justify-center">
                          <span className="font-body text-xs text-blue-300 font-bold">A</span>
                        </div>
                        <div className="bg-green-600/30 border border-green-500/50 rounded-full w-16 h-16 flex items-center justify-center">
                          <span className="font-body text-xs text-green-300 font-bold">B</span>
                        </div>
                      </div>
                    </div>
                    <p className="font-body text-xs text-white/60 text-center">Kotak besar = S, lingkaran di dalam = A dan B yang menjadi himpunan bagian S</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Himpunan semesta tidak selalu unik — bisa berbeda tergantung
                      konteks pembicaraan. Yang penting: semua himpunan yang dibahas harus termasuk di dalamnya!
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan himpunan semesta yang paling tepat untuk setiap kelompok himpunan berikut:
                    </p>
                    <div className="font-body text-sm text-white/80 mt-2 space-y-1">
                      <p>a. <InlineMath math="A = \{1,3,5\}" /> dan <InlineMath math="B = \{2,4,6\}" /></p>
                      <p>b. <InlineMath math="C = \{\text{Kucing, Anjing}\}" /> dan <InlineMath math="D = \{\text{Ikan, Burung}\}" /></p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>a.</strong> A berisi bilangan ganjil, B berisi bilangan genap, semua positif kecil.</p>
                      <p className="text-primary">S = bilangan asli (atau bisa lebih spesifik: <InlineMath math="S = \{1,2,3,4,5,6\}" />)</p>
                      <p><strong>b.</strong> C dan D berisi hewan-hewan.</p>
                      <p className="text-primary">S = {"{"}semua jenis hewan{"}"} atau lebih spesifik "hewan peliharaan"</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="S = \{1,2,3,4,5,6,7,8,9,10\}" />,{" "}
                      <InlineMath math="A = \{2,4,6,8,10\}" />, <InlineMath math="B = \{1,3,5,7,9\}" />.
                      Tentukan komplemen A (yaitu <InlineMath math="A^c" />) dan komplemen B!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Komplemen</strong> adalah anggota S yang <em>tidak ada</em> di himpunan tersebut.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>A<sup>c</sup></strong> = S − A = anggota S yang tidak ada di A:</p>
                        <p className="text-primary"><InlineMath math="A^c = \{1,3,5,7,9\}" /></p>
                        <p><strong>B<sup>c</sup></strong> = S − B = anggota S yang tidak ada di B:</p>
                        <p className="text-primary"><InlineMath math="B^c = \{2,4,6,8,10\}" /></p>
                        <p className="text-white/60 text-xs mt-1">(Perhatikan: A<sup>c</sup> = B dan B<sup>c</sup> = A — ini karena A dan B saling melengkapi!)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Di kelas 7C ada 30 siswa. Himpunan semesta <InlineMath math="S" /> = semua siswa kelas 7C.{" "}
                      <InlineMath math="A" /> = siswa yang suka Matematika (18 siswa).{" "}
                      <InlineMath math="B" /> = siswa yang suka IPA (15 siswa).{" "}
                      Yang suka keduanya ada 7 siswa. Tentukan banyak siswa yang tidak suka keduanya!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Gunakan rumus:</strong> <InlineMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="n(A \cup B) = 18 + 15 - 7 = 26" />
                        <p>Yang suka minimal satu (Matematika atau IPA) = 26 siswa</p>
                      </div>
                      <p><strong>Yang tidak suka keduanya:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="n(S) - n(A \cup B) = 30 - 26 = 4 \text{ siswa}" />
                      </div>
                      <p className="text-primary font-semibold">Ada <strong>4 siswa</strong> yang tidak suka Matematika maupun IPA.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 6: HIMPUNAN KUASA */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="kuasa"
              icon={<Grid3x3 className="w-5 h-5" />}
              label="Sub-Bab 6: Himpunan Kuasa"
              iconColor="text-orange-400"
            />
            {expandedSections.includes("kuasa") && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-orange-300">Himpunan kuasa</strong> dari himpunan <InlineMath math="A" />{" "}
                    (ditulis <InlineMath math="\mathcal{P}(A)" />) adalah himpunan yang <em>anggotanya</em> adalah
                    semua himpunan bagian dari <InlineMath math="A" /> — termasuk himpunan kosong dan A
                    itu sendiri. Sederhananya: himpunan kuasa adalah "kumpulan semua himpunan bagian".
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Rumus Banyak Anggota Himpunan Kuasa:</p>
                    <div className="flex justify-center py-2">
                      <div className="bg-orange-900/30 border border-orange-500/40 rounded-xl px-6 py-3">
                        <BlockMath math="n(\mathcal{P}(A)) = 2^{n(A)}" />
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80 text-center">
                      Banyak anggota himpunan kuasa = <InlineMath math="2^n" /> (sama dengan banyaknya himpunan bagian!)
                    </p>
                  </div>
                  <div className="bg-orange-900/30 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-orange-300">Contoh Cepat:</p>
                    <p className="font-body text-sm text-white/80">
                      Jika <InlineMath math="A = \{1,2\}" />, maka:
                    </p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\mathcal{P}(A) = \{\emptyset,\ \{1\},\ \{2\},\ \{1,2\}\}" />
                      <p className="font-body text-xs text-primary">
                        <InlineMath math="n(\mathcal{P}(A)) = 4 = 2^2" /> ✓
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-orange-900/40">
                          <th className="border border-orange-700/40 px-2 py-1 text-orange-300">n(A)</th>
                          <th className="border border-orange-700/40 px-2 py-1 text-orange-300">n(𝒫(A)) = 2ⁿ</th>
                          <th className="border border-orange-700/40 px-2 py-1 text-orange-300">Nilai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[["0","2⁰","1"],["1","2¹","2"],["2","2²","4"],["3","2³","8"],["4","2⁴","16"],["5","2⁵","32"]].map(([n,f,v],i) => (
                          <tr key={i} className={i%2===0?"bg-slate-900/30":"bg-slate-800/20"}>
                            <td className="border border-orange-700/30 px-2 py-1 text-center text-white/80">{n}</td>
                            <td className="border border-orange-700/30 px-2 py-1 text-center text-orange-300">{f}</td>
                            <td className="border border-orange-700/30 px-2 py-1 text-center text-primary font-bold">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Perbedaan himpunan bagian vs himpunan kuasa:{" "}
                      <strong>Himpunan bagian</strong> adalah salah satu "isi" dari himpunan kuasa.
                      <strong> Himpunan kuasa</strong> adalah wadah yang menampung <em>semua</em> himpunan bagian tersebut.
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tuliskan himpunan kuasa dari <InlineMath math="K = \{x, y\}" /> dan{" "}
                      tentukan <InlineMath math="n(\mathcal{P}(K))" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Daftar semua himpunan bagian K:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>0 anggota: <InlineMath math="\emptyset" /></p>
                        <p>1 anggota: <InlineMath math="\{x\}" />, <InlineMath math="\{y\}" /></p>
                        <p>2 anggota: <InlineMath math="\{x,y\}" /></p>
                      </div>
                      <p><strong>Langkah 2 — Susun menjadi himpunan kuasa:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\mathcal{P}(K) = \{\emptyset,\ \{x\},\ \{y\},\ \{x,y\}\}" />
                        <p className="text-primary font-semibold"><InlineMath math="n(\mathcal{P}(K)) = 4 = 2^2" /> ✓</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="n(\mathcal{P}(M)) = 32" />. Tentukan nilai{" "}
                      <InlineMath math="n(M)" /> dan berapa banyak himpunan bagian M yang
                      memiliki tepat 2 anggota!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Cari n(M):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="2^n = 32 \implies 2^n = 2^5 \implies n(M) = 5" />
                      </div>
                      <p><strong>Langkah 2 — Himpunan bagian dengan tepat 2 anggota (dari 5 anggota):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Gunakan baris ke-5 Segitiga Pascal: 1 — 5 — <strong className="text-primary">10</strong> — 10 — 5 — 1</p>
                        <p className="mt-1">Nilai ke-3 (untuk 2 anggota dari 5) = <strong className="text-primary">10</strong></p>
                        <p className="text-xs text-white/60">Verifikasi: C(5,2) = 5!/(2!·3!) = 10 ✓</p>
                      </div>
                      <p className="text-primary font-semibold">Ada <strong>10</strong> himpunan bagian yang memiliki tepat 2 anggota.</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Himpunan <InlineMath math="A = \{1,2,3,4\}" />. Tentukan:{" "}
                      (a) <InlineMath math="n(\mathcal{P}(A))" />,{" "}
                      (b) banyak anggota <InlineMath math="\mathcal{P}(A)" /> yang memuat anggota "2", dan{" "}
                      (c) banyak anggota <InlineMath math="\mathcal{P}(A)" /> yang tidak memuat anggota "2"!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>(a) n(𝒫(A)):</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <BlockMath math="n(\mathcal{P}(A)) = 2^4 = 16" />
                        </div>
                      </div>
                      <div>
                        <p><strong>(b) Yang memuat "2":</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Jika "2" pasti ada, sisa 3 anggota (<InlineMath math="\{1,3,4\}" />) bebas masuk atau tidak.</p>
                          <p>Banyak cara = <InlineMath math="2^3 = 8" /></p>
                          <p className="text-xs text-white/60 mt-1">Contoh: <InlineMath math="\{2\}" />, <InlineMath math="\{1,2\}" />, <InlineMath math="\{2,3\}" />, <InlineMath math="\{2,4\}" />, <InlineMath math="\{1,2,3\}" />, <InlineMath math="\{1,2,4\}" />, <InlineMath math="\{2,3,4\}" />, <InlineMath math="\{1,2,3,4\}" /></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>(c) Yang tidak memuat "2":</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Total − yang memuat "2" = <InlineMath math="16 - 8 = 8" /></p>
                          <p>Atau: himpunan bagian dari <InlineMath math="\{1,3,4\}" /> = <InlineMath math="2^3 = 8" /></p>
                          <p className="text-primary font-semibold mt-1">Ada <strong>8</strong> himpunan bagian yang tidak memuat "2".</p>
                        </div>
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
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/himpunan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Himpunan
          </button>
        </div>
      </div>
    </div>
  );
};

export default JenisHimpunanPage;
