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
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianKeanggotaanPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "pengertian",
    "notasi",
    "kesamaan",
    "jenis",
  ]);

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
          PENGERTIAN & KEANGGOTAAN HIMPUNAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 · Himpunan · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Apa Itu Himpunan? Kenapa Penting?</span>
              </div>
              {expandedSections.includes("intro") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu sedang merapikan kamar dan mengelompokkan benda-benda: semua buku di rak,
                  semua pakaian di lemari, semua mainan di kotak. Tanpa sadar, kamu baru saja membuat
                  <strong className="text-primary"> himpunan</strong>! Di matematika, konsep ini punya
                  aturan yang lebih jelas dan sangat berguna dalam kehidupan sehari-hari.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    🚀 <strong>Fakta Seru:</strong> Teori himpunan pertama kali dikembangkan oleh matematikawan
                    Jerman bernama <strong>Georg Cantor</strong> pada tahun 1870-an. Ia dianggap sebagai
                    "Bapak Teori Himpunan" modern!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 1: PENGERTIAN HIMPUNAN */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("pengertian")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Sub-Bab 1: Pengertian Himpunan</span>
              </div>
              {expandedSections.includes("pengertian") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("pengertian") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Himpunan</strong> adalah kumpulan objek atau benda yang
                    memiliki <strong>definisi yang jelas dan tegas</strong>, sehingga dapat dipastikan apakah
                    suatu objek termasuk atau tidak termasuk ke dalam kelompok tersebut.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-green-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-green-400 mb-1">✅ Ini HIMPUNAN:</p>
                      <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                        <li>Kumpulan bilangan prima</li>
                        <li>Kumpulan huruf vokal</li>
                        <li>Kumpulan siswa kelas 7A</li>
                        <li>Kumpulan bilangan genap positif</li>
                      </ul>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-red-400 mb-1">❌ Ini BUKAN Himpunan:</p>
                      <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                        <li>Kumpulan anak pintar (subjektif!)</li>
                        <li>Kumpulan makanan enak (tidak jelas)</li>
                        <li>Kumpulan orang tinggi (relatif)</li>
                        <li>Kumpulan warna indah (tidak pasti)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Simbol Keanggotaan:</p>
                    <p className="font-body text-sm text-white/80">
                      Jika objek <InlineMath math="x" /> <strong>termasuk</strong> dalam himpunan{" "}
                      <InlineMath math="A" />, ditulis:{" "}
                      <InlineMath math="x \in A" /> (dibaca: "<InlineMath math="x" /> elemen <InlineMath math="A" />")
                    </p>
                    <p className="font-body text-sm text-white/80">
                      Jika objek <InlineMath math="x" /> <strong>tidak termasuk</strong> dalam himpunan{" "}
                      <InlineMath math="A" />, ditulis:{" "}
                      <InlineMath math="x \notin A" /> (dibaca: "<InlineMath math="x" /> bukan elemen <InlineMath math="A" />")
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Kunci utama himpunan adalah "kejelasan". Tanyakan dulu:
                      "Apakah bisa dipastikan objek ini masuk atau tidak?" Kalau bisa → himpunan. Kalau tergantung
                      pendapat orang → bukan himpunan!
                    </p>
                  </div>
                </div>

                {/* Contoh Soal */}
                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Manakah dari kelompok berikut yang merupakan himpunan?
                    </p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[upper-alpha] list-inside">
                      <li>Kumpulan bilangan asli kurang dari 6</li>
                      <li>Kumpulan artis yang cantik</li>
                      <li>Kumpulan warna pelangi</li>
                      <li>Kumpulan makanan yang lezat</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Cek kejelasan definisi setiap kelompok:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong className="text-green-400">A — Himpunan ✓:</strong> Bilangan asli kurang dari 6 → pasti: <InlineMath math="\{1, 2, 3, 4, 5\}" />. Tidak ada keraguan.</p>
                        <p><strong className="text-red-400">B — Bukan himpunan ✗:</strong> "Cantik" bersifat subjektif, setiap orang punya pendapat berbeda.</p>
                        <p><strong className="text-green-400">C — Himpunan ✓:</strong> Warna pelangi sudah pasti: merah, jingga, kuning, hijau, biru, nila, ungu.</p>
                        <p><strong className="text-red-400">D — Bukan himpunan ✗:</strong> "Lezat" sangat relatif dan subjektif.</p>
                      </div>
                      <p className="text-primary font-semibold">Jawaban: A dan C merupakan himpunan.</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui himpunan <InlineMath math="P = \{2, 4, 6, 8, 10\}" />. Tentukan apakah
                      pernyataan berikut bernilai benar atau salah:
                    </p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      <li><InlineMath math="4 \in P" /></li>
                      <li><InlineMath math="7 \in P" /></li>
                      <li><InlineMath math="10 \notin P" /></li>
                      <li><InlineMath math="3 \notin P" /></li>
                    </ul>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Identifikasi anggota himpunan P:</strong></p>
                      <p>Anggota <InlineMath math="P" /> adalah <InlineMath math="2, 4, 6, 8, 10" /> (bilangan genap dari 2 sampai 10).</p>
                      <p><strong>Langkah 2 — Periksa satu per satu:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>a. <InlineMath math="4 \in P" /> → <strong className="text-green-400">BENAR</strong> (4 adalah anggota P)</p>
                        <p>b. <InlineMath math="7 \in P" /> → <strong className="text-red-400">SALAH</strong> (7 bukan anggota P, 7 bilangan ganjil)</p>
                        <p>c. <InlineMath math="10 \notin P" /> → <strong className="text-red-400">SALAH</strong> (10 memang anggota P, bukan "bukan anggota")</p>
                        <p>d. <InlineMath math="3 \notin P" /> → <strong className="text-green-400">BENAR</strong> (3 memang bukan anggota P)</p>
                      </div>
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
                      Di kelas 7B terdapat 30 siswa. Himpunan <InlineMath math="A" /> adalah siswa yang
                      menyukai olahraga sepak bola, himpunan <InlineMath math="B" /> adalah siswa yang
                      menyukai olahraga basket. Diketahui <InlineMath math="A = \{Adi, Budi, Candra, Doni, Eka\}" />
                      {" "}dan <InlineMath math="B = \{Budi, Eka, Farel, Gita\}" />.
                      Tentukan: (a) anggota yang menyukai kedua olahraga, (b) apakah
                      "Haris" <InlineMath math="\in A" /> atau <InlineMath math="\notin A" />, (c) berapa banyak
                      anggota <InlineMath math="A" /> dan berapa banyak anggota <InlineMath math="B" />?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Anggota yang ada di A dan B:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Anggota <InlineMath math="A" />: Adi, Budi, Candra, Doni, Eka</p>
                        <p>Anggota <InlineMath math="B" />: Budi, Eka, Farel, Gita</p>
                        <p className="mt-1">Yang ada di keduanya: <strong className="text-primary">Budi dan Eka</strong></p>
                      </div>
                      <p><strong>Langkah 2 — Status "Haris":</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>"Haris" tidak ada dalam daftar anggota <InlineMath math="A" />, maka:</p>
                        <p className="text-primary font-semibold"><InlineMath math="\text{Haris} \notin A" /></p>
                      </div>
                      <p><strong>Langkah 3 — Banyak anggota:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Notasi banyak anggota: <InlineMath math="n(A)" /> dan <InlineMath math="n(B)" /></p>
                        <p><InlineMath math="n(A) = 5" /> (ada 5 anggota di A)</p>
                        <p><InlineMath math="n(B) = 4" /> (ada 4 anggota di B)</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 2: NOTASI & CARA PENYAJIAN */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("notasi")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Sub-Bab 2: Notasi & Cara Penyajian Himpunan</span>
              </div>
              {expandedSections.includes("notasi") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("notasi") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Himpunan biasanya diberi nama dengan <strong className="text-blue-300">huruf kapital</strong>{" "}
                    seperti <InlineMath math="A, B, C, ..." /> dan anggotanya ditulis menggunakan{" "}
                    <strong className="text-blue-300">kurung kurawal</strong>{" "}
                    <InlineMath math="\{ \, \}" />. Ada <strong>dua cara utama</strong> menyajikan himpunan:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-blue-900/30 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs font-semibold text-blue-400">① Dengan Kata-Kata (Deskripsi)</p>
                      <p className="font-body text-xs text-white/70">
                        Menjelaskan syarat keanggotaan himpunan menggunakan kalimat.
                      </p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="font-body text-xs text-white/80">
                          Contoh: <em>"Himpunan bilangan asli kurang dari 5"</em>
                        </p>
                        <p className="font-body text-xs text-white/80 mt-1">
                          Artinya: <InlineMath math="\{1, 2, 3, 4\}" />
                        </p>
                      </div>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs font-semibold text-purple-400">② Dengan Cara Mendaftar (Roster)</p>
                      <p className="font-body text-xs text-white/70">
                        Menuliskan semua anggota himpunan satu per satu dalam kurung kurawal.
                      </p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="font-body text-xs text-white/80">
                          Contoh: <InlineMath math="A = \{1, 2, 3, 4\}" />
                        </p>
                        <p className="font-body text-xs text-white/70 mt-1">
                          (urutan bebas, tidak ada duplikasi)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Aturan Penulisan Penting:</p>
                    <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                      <li>Setiap anggota hanya ditulis <strong>sekali</strong> (tidak ada duplikasi)</li>
                      <li>Anggota dipisahkan dengan <strong>tanda koma</strong></li>
                      <li>Urutan anggota <strong>tidak mempengaruhi</strong> himpunan</li>
                      <li><InlineMath math="\{1,2,3\}" /> sama dengan <InlineMath math="\{3,1,2\}" /></li>
                    </ul>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Untuk himpunan yang anggotanya sangat banyak atau tak terbatas,
                      gunakan tanda titik-titik (<InlineMath math="..." />) untuk mewakili pola yang berlanjut.
                      Contoh: <InlineMath math="\{2, 4, 6, 8, ...\}" /> untuk semua bilangan genap positif.
                    </p>
                  </div>
                </div>

                {/* Contoh Soal */}
                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Nyatakan himpunan berikut dengan cara mendaftar:
                    </p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      <li>Himpunan huruf vokal dalam alfabet</li>
                      <li>Himpunan bilangan asli kurang dari 8</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>a. Huruf vokal:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Deskripsi: "Himpunan huruf vokal dalam alfabet"</p>
                          <p className="text-primary mt-1">Cara mendaftar: <InlineMath math="V = \{a, i, u, e, o\}" /></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>b. Bilangan asli kurang dari 8:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Deskripsi: "Himpunan bilangan asli yang kurang dari 8"</p>
                          <p className="text-primary mt-1">Cara mendaftar: <InlineMath math="A = \{1, 2, 3, 4, 5, 6, 7\}" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="B = \{3, 6, 9, 12, 15\}" />. Nyatakan himpunan{" "}
                      <InlineMath math="B" /> tersebut dengan kata-kata! Kemudian tentukan nilai{" "}
                      <InlineMath math="n(B)" />.
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Cari pola dari anggotanya:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="3 = 3 \times 1" /></p>
                        <p><InlineMath math="6 = 3 \times 2" /></p>
                        <p><InlineMath math="9 = 3 \times 3" /></p>
                        <p><InlineMath math="12 = 3 \times 4" /></p>
                        <p><InlineMath math="15 = 3 \times 5" /></p>
                      </div>
                      <p><strong>Langkah 2 — Rumuskan deskripsinya:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-primary">Pola: bilangan kelipatan 3 dari 3 sampai 15</p>
                        <p className="mt-1">Cara kata-kata: <em>"Himpunan bilangan kelipatan 3 yang kurang dari atau sama dengan 15"</em></p>
                      </div>
                      <p><strong>Langkah 3 — Hitung banyak anggota:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Ada <strong>5</strong> anggota, maka <InlineMath math="n(B) = 5" /></p>
                      </div>
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
                      Himpunan <InlineMath math="K" /> didefinisikan dengan kata-kata sebagai: <em>"Himpunan
                      bilangan prima antara 1 dan 20"</em>. Himpunan <InlineMath math="L" /> adalah
                      himpunan bilangan genap antara 10 dan 20 (tidak termasuk 10 dan 20).
                      Nyatakan <InlineMath math="K" /> dan <InlineMath math="L" /> dengan cara mendaftar,
                      lalu tentukan anggota yang ada di kedua himpunan tersebut!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Daftar bilangan prima antara 1 dan 20:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Bilangan prima = bilangan yang hanya habis dibagi 1 dan dirinya sendiri.</p>
                        <p>2, 3, 5, 7, 11, 13, 17, 19</p>
                        <p className="text-primary mt-1"><InlineMath math="K = \{2, 3, 5, 7, 11, 13, 17, 19\}" /></p>
                      </div>
                      <p><strong>Langkah 2 — Daftar bilangan genap antara 10 dan 20 (tidak termasuk keduanya):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Bilangan antara 10 dan 20 (eksklusif): 11, 12, 13, 14, 15, 16, 17, 18, 19</p>
                        <p>Yang genap: 12, 14, 16, 18</p>
                        <p className="text-primary mt-1"><InlineMath math="L = \{12, 14, 16, 18\}" /></p>
                      </div>
                      <p><strong>Langkah 3 — Cari anggota yang ada di K dan L sekaligus:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Anggota K: 2, 3, 5, 7, 11, 13, 17, 19</p>
                        <p>Anggota L: 12, 14, 16, 18</p>
                        <p className="text-primary font-semibold mt-1">Tidak ada anggota yang sama! (Himpunan K dan L saling lepas)</p>
                        <p className="text-white/60 text-xs mt-1">Karena bilangan prima &gt; 2 selalu ganjil, sedangkan semua anggota L genap.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 3: KESAMAAN HIMPUNAN */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesamaan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Sub-Bab 3: Kesamaan Himpunan</span>
              </div>
              {expandedSections.includes("kesamaan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesamaan") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Dua himpunan dikatakan <strong className="text-purple-300">sama</strong> jika dan hanya
                    jika keduanya memiliki <strong>anggota yang persis sama</strong>, tidak peduli urutan
                    penulisannya. Simbol yang digunakan adalah <InlineMath math="=" />.
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Definisi Formal:</p>
                    <p className="font-body text-sm text-white/80">
                      <InlineMath math="A = B" /> jika setiap anggota <InlineMath math="A" /> juga merupakan anggota
                      {" "}<InlineMath math="B" />, dan sebaliknya.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-green-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-green-400 mb-2">✅ Himpunan yang SAMA:</p>
                      <p className="font-body text-xs text-white/70">
                        <InlineMath math="A = \{1, 2, 3\}" />
                      </p>
                      <p className="font-body text-xs text-white/70">
                        <InlineMath math="B = \{3, 1, 2\}" />
                      </p>
                      <p className="font-body text-xs text-green-400 mt-1">
                        <InlineMath math="A = B" /> ✓ (anggota sama, urutan berbeda)
                      </p>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-red-400 mb-2">❌ Himpunan yang TIDAK SAMA:</p>
                      <p className="font-body text-xs text-white/70">
                        <InlineMath math="C = \{1, 2, 3\}" />
                      </p>
                      <p className="font-body text-xs text-white/70">
                        <InlineMath math="D = \{1, 2, 4\}" />
                      </p>
                      <p className="font-body text-xs text-red-400 mt-1">
                        <InlineMath math="C \neq D" /> ✗ (anggota ke-3 berbeda)
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Dua himpunan sama jika <strong>banyak anggotanya sama</strong>{" "}
                      DAN <strong>setiap anggotanya identik</strong>. Kalau ada satu saja yang beda, himpunannya
                      sudah tidak sama!
                    </p>
                  </div>
                </div>

                {/* Contoh Soal */}
                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan apakah pasangan himpunan berikut sama atau tidak:
                    </p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-2 list-[lower-alpha] list-inside">
                      <li><InlineMath math="P = \{a, b, c, d\}" /> dan <InlineMath math="Q = \{d, c, a, b\}" /></li>
                      <li><InlineMath math="R = \{1, 2, 3, 4\}" /> dan <InlineMath math="S = \{1, 2, 3, 5\}" /></li>
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>a. P vs Q:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>P: a, b, c, d → Q: d, c, a, b</p>
                          <p>Setiap anggota P ada di Q dan sebaliknya.</p>
                          <p className="text-green-400 font-semibold"><InlineMath math="P = Q" /> ✓</p>
                        </div>
                      </div>
                      <div>
                        <p><strong>b. R vs S:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>R: 1, 2, 3, <strong className="text-red-400">4</strong></p>
                          <p>S: 1, 2, 3, <strong className="text-red-400">5</strong></p>
                          <p>Anggota "4" ada di R tapi tidak di S. Anggota "5" ada di S tapi tidak di R.</p>
                          <p className="text-red-400 font-semibold"><InlineMath math="R \neq S" /> ✗</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Himpunan <InlineMath math="M" /> adalah himpunan faktor dari 12. Himpunan{" "}
                      <InlineMath math="N = \{1, 2, 3, 4, 6, 12\}" />. Apakah <InlineMath math="M = N" />?
                      Jelaskan!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Cari semua faktor dari 12:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="12 = 1 \times 12" /></p>
                        <p><InlineMath math="12 = 2 \times 6" /></p>
                        <p><InlineMath math="12 = 3 \times 4" /></p>
                        <p className="text-primary mt-1"><InlineMath math="M = \{1, 2, 3, 4, 6, 12\}" /></p>
                      </div>
                      <p><strong>Langkah 2 — Bandingkan M dan N:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="M = \{1, 2, 3, 4, 6, 12\}" /></p>
                        <p><InlineMath math="N = \{1, 2, 3, 4, 6, 12\}" /></p>
                        <p className="text-green-400 font-semibold mt-1">Semua anggota identik, maka <InlineMath math="M = N" /> ✓</p>
                      </div>
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
                      Himpunan <InlineMath math="X" /> adalah himpunan bilangan asli yang jika dikuadratkan
                      hasilnya kurang dari 30. Himpunan{" "}
                      <InlineMath math="Y = \{1, 2, 3, 4, 5\}" />. Apakah <InlineMath math="X = Y" />?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Tentukan anggota X:</strong></p>
                      <p>Cari bilangan asli <InlineMath math="n" /> sedemikian sehingga <InlineMath math="n^2 < 30" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><InlineMath math="1^2 = 1 < 30" /> ✓</p>
                        <p><InlineMath math="2^2 = 4 < 30" /> ✓</p>
                        <p><InlineMath math="3^2 = 9 < 30" /> ✓</p>
                        <p><InlineMath math="4^2 = 16 < 30" /> ✓</p>
                        <p><InlineMath math="5^2 = 25 < 30" /> ✓</p>
                        <p><InlineMath math="6^2 = 36 \geq 30" /> ✗ (tidak memenuhi)</p>
                        <p className="text-primary mt-1"><InlineMath math="X = \{1, 2, 3, 4, 5\}" /></p>
                      </div>
                      <p><strong>Langkah 2 — Bandingkan X dan Y:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="X = \{1, 2, 3, 4, 5\}" /></p>
                        <p><InlineMath math="Y = \{1, 2, 3, 4, 5\}" /></p>
                        <p className="text-green-400 font-semibold mt-1"><InlineMath math="X = Y" /> ✓ Kedua himpunan sama!</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 4: HIMPUNAN BERHINGGA, KOSONG, TAK HINGGA */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("jenis")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Sub-Bab 4: Himpunan Berhingga, Kosong & Tak Hingga</span>
              </div>
              {expandedSections.includes("jenis") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("jenis") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Berdasarkan <strong>banyak anggotanya</strong>, himpunan dibedakan menjadi tiga jenis:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-green-900/30 border border-green-700/30 rounded-lg p-3">
                      <p className="font-body text-sm font-semibold text-green-400 mb-1">
                        1️⃣ Himpunan Berhingga
                      </p>
                      <p className="font-body text-sm text-white/80">
                        Himpunan yang memiliki anggota dalam jumlah tertentu dan bisa dihitung habis.
                        Notasi: <InlineMath math="n(A) = k" /> untuk suatu bilangan cacah <InlineMath math="k" />.
                      </p>
                      <div className="bg-slate-900/50 rounded p-2 mt-2 space-y-1">
                        <p className="font-body text-xs text-white/70">
                          Contoh: <InlineMath math="A = \{2, 4, 6, 8\}" />, maka <InlineMath math="n(A) = 4" />
                        </p>
                        <p className="font-body text-xs text-white/70">
                          Contoh: <InlineMath math="B = \{a, b, c, d, e\}" />, maka <InlineMath math="n(B) = 5" />
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
                      <p className="font-body text-sm font-semibold text-slate-300 mb-1">
                        2️⃣ Himpunan Kosong
                      </p>
                      <p className="font-body text-sm text-white/80">
                        Himpunan yang <strong>tidak memiliki anggota sama sekali</strong>. Ditulis{" "}
                        <InlineMath math="\emptyset" /> atau <InlineMath math="\{\}" />, dan <InlineMath math="n(\emptyset) = 0" />.
                      </p>
                      <div className="bg-slate-900/50 rounded p-2 mt-2 space-y-1">
                        <p className="font-body text-xs text-white/70">
                          Contoh: Himpunan bilangan prima yang genap selain 2 → <InlineMath math="\emptyset" />
                        </p>
                        <p className="font-body text-xs text-white/70">
                          Contoh: Himpunan bilangan asli antara 3 dan 4 → <InlineMath math="\emptyset" />
                        </p>
                        <p className="font-body text-xs text-red-400 mt-1">
                          ⚠️ Perhatian: <InlineMath math="\{0\}" /> BUKAN himpunan kosong! Ia punya anggota: angka 0.
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-3">
                      <p className="font-body text-sm font-semibold text-blue-400 mb-1">
                        3️⃣ Himpunan Tak Hingga
                      </p>
                      <p className="font-body text-sm text-white/80">
                        Himpunan yang memiliki anggota yang <strong>tidak terbatas jumlahnya</strong>.
                        Selalu menggunakan tanda <InlineMath math="..." /> saat didaftar.
                      </p>
                      <div className="bg-slate-900/50 rounded p-2 mt-2 space-y-1">
                        <p className="font-body text-xs text-white/70">
                          Contoh: <InlineMath math="\mathbb{N} = \{1, 2, 3, 4, 5, ...\}" /> (bilangan asli)
                        </p>
                        <p className="font-body text-xs text-white/70">
                          Contoh: <InlineMath math="G = \{2, 4, 6, 8, ...\}" /> (bilangan genap positif)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Cara mudah membedakan: kalau bisa dihitung sampai selesai
                      → berhingga. Kalau tidak ada habisnya → tak hingga. Kalau tidak ada isinya sama sekali
                      → kosong!
                    </p>
                  </div>
                </div>

                {/* Contoh Soal */}
                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan jenis himpunan (berhingga, kosong, atau tak hingga) dari himpunan berikut:
                    </p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      <li>Himpunan hari dalam seminggu</li>
                      <li>Himpunan bilangan bulat negatif</li>
                      <li>Himpunan bilangan asli antara 5 dan 6</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>a.</strong> Hari dalam seminggu: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu → ada 7 hari. <strong className="text-green-400">Berhingga</strong>, <InlineMath math="n = 7" /></p>
                        <p><strong>b.</strong> Bilangan bulat negatif: <InlineMath math="\{-1, -2, -3, -4, ...\}" /> → tidak ada habisnya. <strong className="text-blue-400">Tak Hingga</strong></p>
                        <p><strong>c.</strong> Bilangan asli antara 5 dan 6 → tidak ada bilangan asli di sana. <strong className="text-slate-300">Himpunan Kosong</strong>, <InlineMath math="n = 0" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Himpunan <InlineMath math="T" /> adalah himpunan bilangan ganjil antara 10 dan 22.
                      Tentukan anggota <InlineMath math="T" />, jenis himpunan, dan nilai <InlineMath math="n(T)" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Daftar bilangan ganjil antara 10 dan 22:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Bilangan di antara 10 dan 22: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21</p>
                        <p>Yang ganjil: 11, 13, 15, 17, 19, 21</p>
                        <p className="text-primary mt-1"><InlineMath math="T = \{11, 13, 15, 17, 19, 21\}" /></p>
                      </div>
                      <p><strong>Langkah 2 — Tentukan jenis dan banyak anggota:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>Himpunan T memiliki anggota yang bisa dihitung dan habis.</p>
                        <p className="text-green-400">Jenis: <strong>Himpunan Berhingga</strong></p>
                        <p className="text-primary"><InlineMath math="n(T) = 6" /></p>
                      </div>
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
                      Di bawah ini terdapat beberapa definisi himpunan. Untuk setiap himpunan, tentukan
                      jenisnya (berhingga/kosong/tak hingga) dan berikan alasanmu!
                    </p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      <li>Himpunan bilangan bulat yang kuadratnya sama dengan <InlineMath math="-4" /></li>
                      <li>Himpunan kelipatan 7 yang lebih dari 0</li>
                      <li>Himpunan bilangan prima antara 1 dan 50</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div>
                        <p><strong>a. Bilangan bulat yang kuadratnya = -4:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>Kuadrat dari bilangan apapun pasti <strong>≥ 0</strong>, tidak pernah negatif.</p>
                          <p>Tidak ada bilangan bulat yang memenuhi <InlineMath math="n^2 = -4" />.</p>
                          <p className="text-slate-300 font-semibold mt-1">Jenis: <strong>Himpunan Kosong</strong> → <InlineMath math="\emptyset" /></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>b. Kelipatan 7 yang lebih dari 0:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <BlockMath math="\{7, 14, 21, 28, 35, ...\}" />
                          <p>Kelipatan 7 tidak ada batasnya (7, 14, 21, ... terus bertambah tanpa henti).</p>
                          <p className="text-blue-400 font-semibold mt-1">Jenis: <strong>Himpunan Tak Hingga</strong></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>c. Bilangan prima antara 1 dan 50:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <BlockMath math="\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47\}" />
                          <p>Ada batas atas (50), sehingga anggotanya bisa dihitung habis.</p>
                          <p className="text-green-400 font-semibold mt-1">Jenis: <strong>Himpunan Berhingga</strong>, <InlineMath math="n = 15" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Tombol Kembali */}
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

export default PengertianKeanggotaanPage;
