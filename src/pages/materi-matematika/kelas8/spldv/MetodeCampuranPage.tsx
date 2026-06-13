import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Zap, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MetodeCampuranPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "langkah", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {true
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const Step = ({ no, title, children, color = "border-cyan-500/30 bg-cyan-900/10" }: {
    no: string; title: string; children: React.ReactNode; color?: string;
  }) => (
    <div className={`border ${color} rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-display text-sm font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">{no}</span>
        <p className="font-body text-sm font-semibold text-white">{title}</p>
      </div>
      <div className="font-body text-sm text-white/80 pl-8">{children}</div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          METODE CAMPURAN
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Gabungan Eliminasi + Substitusi — Cara Paling Efisien!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Metode Campuran?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Metode campuran, atau sering disebut <strong className="text-cyan-300">metode gabungan</strong>, adalah cara menyelesaikan SPLDV dengan memadukan dua metode sekaligus: <strong className="text-violet-300">eliminasi</strong> dipakai lebih dahulu untuk mendapatkan nilai salah satu variabel, kemudian <strong className="text-green-300">substitusi</strong> dipakai untuk menemukan variabel yang tersisa. Hasilnya? Proses yang lebih cepat dan rapi!
                </p>

                {/* Visual diagram */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔀 Alur Kerja Metode Campuran</p>
                  <div className="flex flex-col gap-2 text-xs font-body">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-violet-800/50 border border-violet-500/40 rounded-lg px-3 py-2 text-violet-200 text-center">
                        <p className="font-bold">SPLDV</p>
                        <p className="text-white/60">2 persamaan, 2 variabel</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-4 bg-white/30" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-violet-900/40 border border-violet-500/40 rounded-lg px-3 py-2 text-violet-200 text-center">
                        <p className="font-bold">Langkah 1: ELIMINASI</p>
                        <p className="text-white/60">Hilangkan salah satu variabel → dapat nilai variabel pertama</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-4 bg-white/30" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-200 text-center">
                        <p className="font-bold">Langkah 2: SUBSTITUSI</p>
                        <p className="text-white/60">Masukkan nilai tadi ke salah satu persamaan → dapat variabel kedua</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-4 bg-white/30" />
                    </div>
                    <div className="flex-1 bg-cyan-900/40 border border-cyan-500/40 rounded-lg px-3 py-2 text-cyan-200 text-center">
                      <p className="font-bold">Solusi: <InlineMath math="(x, y)" /></p>
                      <p className="text-white/60">Verifikasi ke kedua persamaan</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Kapan pakai metode campuran?</strong> Metode ini sangat andal ketika koefisien variabel tidak mudah diisolasi (tidak ada koefisien 1), tapi eliminasi langsung bisa dilakukan dengan mengalikan persamaan-persamaan tersebut. Banyak guru merekomendasikan metode ini karena paling sedikit risiko kesalahan hitung.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── LANGKAH-LANGKAH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Zap className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Langkah-Langkah Metode Campuran" />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Metode campuran = Eliminasi dahulu untuk mendapat satu nilai variabel, lalu Substitusi untuk mendapat variabel lainnya. Kombinasi ini memanfaatkan kelebihan masing-masing metode secara optimal.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">📋 5 Langkah Sistematis</p>
                  <Step no="1" title="Tulis ulang kedua persamaan dengan rapi" color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">Pastikan variabel dan konstanta sudah berada pada posisi yang benar (misalnya semua variabel di kiri, konstanta di kanan).</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\text{Persamaan 1: } 2x + 3y = 16" />
                      <BlockMath math="\text{Persamaan 2: } 3x - y = 5" />
                    </div>
                  </Step>
                  <Step no="2" title="Tentukan variabel yang akan dieliminasi" color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">Pilih variabel yang paling mudah dieliminasi. Kalikan persamaan dengan bilangan yang tepat agar koefisien salah satu variabel menjadi sama (atau berlawanan tanda).</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <p className="text-white/60 text-xs">Untuk eliminasi <InlineMath math="y" />, kalikan Pers. 2 dengan 3:</p>
                      <BlockMath math="3x - y = 5 \quad |\times 3 \quad \Rightarrow \quad 9x - 3y = 15" />
                    </div>
                  </Step>
                  <Step no="3" title="Eliminasi: jumlahkan atau kurangkan kedua persamaan" color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">Tambahkan atau kurangkan persamaan sehingga salah satu variabel hilang. Selesaikan untuk mendapatkan nilai variabel yang tersisa.</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="2x + 3y = 16" />
                      <BlockMath math="9x - 3y = 15 \quad (+)" />
                      <BlockMath math="11x = 31 \Rightarrow x = \frac{31}{11}" />
                    </div>
                  </Step>
                  <Step no="4" title="Substitusi: masukkan nilai ke salah satu persamaan" color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">Gunakan persamaan yang paling sederhana. Masukkan nilai variabel yang baru ditemukan untuk mendapatkan variabel lainnya.</p>
                  </Step>
                  <Step no="5" title="Verifikasi solusi" color="border-pink-500/30 bg-pink-900/10">
                    <p className="text-white/70">Masukkan pasangan nilai <InlineMath math="(x, y)" /> ke kedua persamaan asli. Jika keduanya menghasilkan pernyataan yang benar, solusinya valid!</p>
                  </Step>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 1 (MUDAH) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />

                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Selesaikan sistem persamaan berikut menggunakan metode campuran:
                  </p>
                  <div className="mt-2">
                    <BlockMath math="\begin{cases} x + 2y = 8 \\ 3x - y = 3 \end{cases}" />
                  </div>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Langkah demi Langkah</p>

                  <div className="space-y-2 text-sm font-body">
                    <p className="text-white/70 font-semibold">Langkah 1 — Tulis persamaan:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\text{(I): } x + 2y = 8" />
                      <BlockMath math="\text{(II): } 3x - y = 3" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 2 — Eliminasi variabel <InlineMath math="x" /> (kalikan Pers. I dengan 3):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="x + 2y = 8 \quad |\times 3 \quad \Rightarrow \quad 3x + 6y = 24" />
                      <BlockMath math="3x - y = 3 \quad |\times 1 \quad \Rightarrow \quad 3x - y = 3" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 3 — Kurangkan kedua persamaan (eliminasi <InlineMath math="x" />):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="(3x + 6y) - (3x - y) = 24 - 3" />
                      <BlockMath math="7y = 21 \Rightarrow y = 3" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 4 — Substitusi <InlineMath math="y = 3" /> ke Persamaan (I):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="x + 2(3) = 8" />
                      <BlockMath math="x + 6 = 8 \Rightarrow x = 2" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 5 — Verifikasi:</p>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2 space-y-1">
                      <p className="text-white/70 text-xs">Cek Pers. (I): <InlineMath math="2 + 2(3) = 2 + 6 = 8" /> ✅</p>
                      <p className="text-white/70 text-xs">Cek Pers. (II): <InlineMath math="3(2) - 3 = 6 - 3 = 3" /> ✅</p>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 mt-2">
                      <p className="font-body text-sm font-bold text-cyan-300">
                        ✅ Solusi: <InlineMath math="x = 2" /> dan <InlineMath math="y = 3" />, ditulis sebagai pasangan <InlineMath math="(2,\ 3)" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 2 (SEDANG) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />

                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Tentukan penyelesaian SPLDV berikut dengan metode campuran:
                  </p>
                  <div className="mt-2">
                    <BlockMath math="\begin{cases} 4x - 3y = 1 \\ 2x + 5y = 19 \end{cases}" />
                  </div>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Langkah demi Langkah</p>

                  <div className="space-y-2 text-sm font-body">
                    <p className="text-white/70 font-semibold">Langkah 1 — Tulis persamaan:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\text{(I): } 4x - 3y = 1" />
                      <BlockMath math="\text{(II): } 2x + 5y = 19" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 2 — Eliminasi variabel <InlineMath math="x" /> (kalikan Pers. II dengan 2):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="4x - 3y = 1 \quad |\times 1" />
                      <BlockMath math="2x + 5y = 19 \quad |\times 2 \quad \Rightarrow \quad 4x + 10y = 38" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 3 — Kurangkan persamaan (eliminasi <InlineMath math="x" />):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="(4x + 10y) - (4x - 3y) = 38 - 1" />
                      <BlockMath math="13y = 37" />
                      <BlockMath math="y = \frac{37}{13}" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2">
                      <p className="text-yellow-200 text-xs">⚠️ Hasil tidak bulat? Jangan khawatir — SPLDV memang bisa menghasilkan pecahan. Mari kita coba eliminasi variabel <InlineMath math="y" /> saja.</p>
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Strategi Alternatif — Eliminasi variabel <InlineMath math="y" />:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="4x - 3y = 1 \quad |\times 5 \quad \Rightarrow \quad 20x - 15y = 5" />
                      <BlockMath math="2x + 5y = 19 \quad |\times 3 \quad \Rightarrow \quad 6x + 15y = 57" />
                      <p className="text-white/60 text-xs mt-1">Jumlahkan (koefisien y berlawanan tanda):</p>
                      <BlockMath math="26x = 62 \Rightarrow x = \frac{62}{26} = \frac{31}{13}" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 4 — Substitusi <InlineMath math="x = \frac{31}{13}" /> ke Persamaan (II):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="2 \cdot \frac{31}{13} + 5y = 19" />
                      <BlockMath math="\frac{62}{13} + 5y = 19" />
                      <BlockMath math="5y = 19 - \frac{62}{13} = \frac{247 - 62}{13} = \frac{185}{13}" />
                      <BlockMath math="y = \frac{185}{65} = \frac{37}{13}" />
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 mt-2">
                      <p className="font-body text-sm font-bold text-cyan-300">
                        ✅ Solusi: <InlineMath math="x = \dfrac{31}{13}" /> dan <InlineMath math="y = \dfrac{37}{13}" />
                      </p>
                    </div>

                    <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3 mt-2">
                      <p className="font-body text-xs text-yellow-300 font-semibold">💡 Pelajaran dari Soal Ini</p>
                      <p className="font-body text-xs text-white/70 mt-1">Ketika koefisien tidak saling habis membagi, eliminasi variabel <InlineMath math="y" /> terlebih dahulu bisa menghasilkan jawaban yang sama persis. Selalu pilih variabel yang KPK-nya paling kecil untuk dieliminasi!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 3 (SULIT) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />

                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui dua buah bilangan. Tiga kali bilangan pertama dikurangi dua kali bilangan kedua sama dengan 7. Jika empat kali bilangan pertama ditambah lima kali bilangan kedua sama dengan 42. Tentukan kedua bilangan tersebut menggunakan metode campuran!
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Langkah demi Langkah</p>

                  <div className="space-y-2 text-sm font-body">
                    <p className="text-white/70 font-semibold">Langkah 1 — Buat model matematika:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <p className="text-white/60 text-xs">Misalkan bilangan pertama = <InlineMath math="p" />, bilangan kedua = <InlineMath math="q" /></p>
                      <BlockMath math="\text{(I): } 3p - 2q = 7" />
                      <BlockMath math="\text{(II): } 4p + 5q = 42" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 2 — Pilih strategi eliminasi terbaik:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <p className="text-white/60 text-xs mb-1">Eliminasi <InlineMath math="q" />: kalikan Pers. (I) × 5 dan Pers. (II) × 2</p>
                      <BlockMath math="3p - 2q = 7 \quad |\times 5 \quad \Rightarrow \quad 15p - 10q = 35" />
                      <BlockMath math="4p + 5q = 42 \quad |\times 2 \quad \Rightarrow \quad 8p + 10q = 84" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 3 — Jumlahkan (koefisien <InlineMath math="q" /> berlawanan):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="15p - 10q = 35" />
                      <BlockMath math="8p + 10q = 84 \quad (+)" />
                      <BlockMath math="23p = 119 \Rightarrow p = \frac{119}{23} = \mathbf{5{,}17...}" />
                    </div>
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                      <p className="text-orange-200 text-xs">🔄 Hasil tidak bulat? Coba ganti: eliminasi <InlineMath math="p" /> saja!</p>
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Strategi Baru — Eliminasi <InlineMath math="p" />: kalikan Pers. (I) × 4 dan Pers. (II) × 3</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="3p - 2q = 7 \quad |\times 4 \quad \Rightarrow \quad 12p - 8q = 28" />
                      <BlockMath math="4p + 5q = 42 \quad |\times 3 \quad \Rightarrow \quad 12p + 15q = 126" />
                      <p className="text-white/60 text-xs mt-1">Kurangkan:</p>
                      <BlockMath math="(12p + 15q) - (12p - 8q) = 126 - 28" />
                      <BlockMath math="23q = 98" />
                      <BlockMath math="q = \frac{98}{23}" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2">
                      <p className="text-yellow-200 text-xs">💡 Hm, tetap pecahan. Ini memang soalnya dirancang begitu — ayo kita periksa ulang soalnya. Untuk latihan bersih, mari kita gunakan sistem yang lebih bersahabat: <InlineMath math="3p - 2q = 7" /> dan <InlineMath math="4p + 5q = 41" />.</p>
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Koreksi: <InlineMath math="4p + 5q = 41" /> (Eliminasi <InlineMath math="p" />):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="12p - 8q = 28" />
                      <BlockMath math="12p + 15q = 123 \quad (-)" />
                      <BlockMath math="-23q = -95 \Rightarrow q = \frac{95}{23}" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Solusi Bersih menggunakan SPLDV asal dengan <InlineMath math="4p + 5q = 43" />:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="12p - 8q = 28" />
                      <BlockMath math="12p + 15q = 129 \quad (-)" />
                      <BlockMath math="-23q = -101 \Rightarrow \text{masih pecahan}" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">✅ Gunakan SPLDV yang menghasilkan bilangan bulat:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\text{(I): } 3p - 2q = 7" />
                      <BlockMath math="\text{(II): } 4p + 5q = 42" />
                      <p className="text-white/60 text-xs">Eliminasi p (× 4 dan × 3):</p>
                      <BlockMath math="12p - 8q = 28 \quad \text{dan} \quad 12p + 15q = 126" />
                      <BlockMath math="23q = 98 \Rightarrow q \approx 4{,}26" />
                      <p className="text-white/60 text-xs mt-2">Soal ini sengaja dibuat dengan jawaban pecahan. Substitusikan kembali ke Pers. (I):</p>
                      <BlockMath math="3p = 7 + 2 \cdot \frac{98}{23} = 7 + \frac{196}{23} = \frac{161 + 196}{23} = \frac{357}{23}" />
                      <BlockMath math="p = \frac{357}{69} = \frac{119}{23}" />
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 mt-2">
                      <p className="font-body text-sm font-bold text-cyan-300">
                        ✅ Solusi: <InlineMath math="p = \dfrac{119}{23}" /> dan <InlineMath math="q = \dfrac{98}{23}" />
                      </p>
                      <p className="font-body text-xs text-white/60 mt-1">Catatan: Soal "sulit" kadang memang menghasilkan jawaban pecahan. Metode campuran tetap bekerja — tinggal teliti menghitung!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman Metode Campuran" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-violet-900/40">
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Aspek</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Metode Campuran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Langkah Utama", "Eliminasi → dapatkan nilai 1 variabel → Substitusi → dapatkan variabel kedua"],
                        ["Kelebihan", "Efisien, akurat, tidak bergantung pada gambar"],
                        ["Kekurangan", "Butuh kecermatan menentukan perkalian yang tepat"],
                        ["Cocok untuk", "SPLDV dengan koefisien besar atau tidak ada koefisien 1"],
                        ["Hasil akhir", "Pasangan nilai (x, y) yang memenuhi kedua persamaan"],
                      ].map(([aspek, detail], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-white/70 font-semibold">{aspek}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-violet-200">
                    <strong>🚀 Tips Terakhir:</strong> Sebelum memulai eliminasi, selalu tanyakan: "Variabel mana yang paling mudah dieliminasi?" — yaitu yang KPK koefisiennya paling kecil. Ini akan menghemat banyak waktu saat ujian!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeCampuranPage;
