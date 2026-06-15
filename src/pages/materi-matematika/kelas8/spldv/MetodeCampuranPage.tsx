import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Zap, Target, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import CampuranInteraktif from "@/components/CampuranInteraktif";

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
                    <p className="text-white/70">Pastikan variabel dan konstanta sudah berada pada posisi yang benar (semua variabel di kiri, konstanta di kanan).</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\begin{cases} \text{(I):}\quad 2x + 3y = 16 \\ \text{(II):}\quad 3x - y = 2 \end{cases}" />
                    </div>
                  </Step>
                  <Step no="2" title="Tentukan variabel yang akan dieliminasi" color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">Pilih variabel yang paling mudah dieliminasi. Kalikan persamaan dengan bilangan yang tepat agar koefisien salah satu variabel menjadi sama besar (atau berlawanan tanda).</p>
                    <div className="mt-2 bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 font-body">
                      <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">Eliminasi y — KPK koefisien y (3 dan 1) adalah 3</p>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P1</span>
                        <span className="text-white/80">2x + 3y = 16</span>
                        <span className="text-white/30 text-xs mx-1">|×1 (tetap)|</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P2</span>
                        <span className="text-white/80">3x − y = 2</span>
                        <span className="text-yellow-300 font-bold mx-1">|×3|</span>
                        <span className="text-cyan-300 font-bold">9x − 3y = 6</span>
                      </div>
                    </div>
                  </Step>
                  <Step no="3" title="Eliminasi: jumlahkan atau kurangkan kedua persamaan" color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">Koefisien <InlineMath math="y" /> sekarang berlawanan tanda (+3y dan −3y) → <strong className="text-green-300">jumlahkan</strong> agar <InlineMath math="y" /> lenyap.</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg px-4 py-3 font-body">
                      <div className="flex items-center gap-2 pr-2">
                        <span className="text-white/40 w-10 shrink-0">P1×1</span>
                        <span className="text-white font-mono">2x + 3y = 16</span>
                      </div>
                      <div className="flex items-center gap-2 pr-2 pb-1 border-b border-white/20">
                        <span className="text-white/40 w-10 shrink-0">P2×3</span>
                        <span className="text-white font-mono">9x − 3y = 6</span>
                        <span className="text-green-400 font-bold ml-2">+</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-white/40 w-10 shrink-0"></span>
                        <span className="text-cyan-300 font-mono font-bold">11x = 22</span>
                      </div>
                    </div>
                    <BlockMath math="x = \dfrac{22}{11} = 2" />
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

          {/* ── LAB INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400" title="🧪 Lab Interaktif — Lihat Metode Campuran Beraksi!" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Masukkan <strong className="text-violet-300">sistem persamaan</strong> milikmu, pilih variabel yang dieliminasi, lalu tekan <strong className="text-blue-300">🔀 Metode Campuran</strong> — kamu akan melihat secara langsung bagaimana proses <strong className="text-violet-300">eliminasi</strong> dan <strong className="text-green-300">substitusi</strong> bekerja langkah demi langkah!
                  </p>
                </div>
                <CampuranInteraktif />
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
                      <BlockMath math="\begin{cases} \text{(I):}\quad x + 2y = 8 \\ \text{(II):}\quad 3x - y = 3 \end{cases}" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 2 — Samakan koefisien <InlineMath math="x" /> (KPK dari 1 dan 3 adalah 3):</p>
                    <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 font-body">
                      <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">Samakan koefisien x → kalikan kedua persamaan</p>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P1</span>
                        <span className="text-white/80">x + 2y = 8</span>
                        <span className="text-yellow-300 font-bold mx-1">|×3|</span>
                        <span className="text-cyan-300 font-bold">3x + 6y = 24</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P2</span>
                        <span className="text-white/80">3x − y = 3</span>
                        <span className="text-white/30 text-xs mx-1">|×1 (tetap)|</span>
                      </div>
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 3 — Kurangkan (koefisien <InlineMath math="x" /> sama tanda) → <InlineMath math="x" /> lenyap:</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-3 font-body">
                      <div className="flex items-center gap-2 pr-2">
                        <span className="text-white/40 w-10 shrink-0">P1×3</span>
                        <span className="text-white font-mono">3x + 6y = 24</span>
                      </div>
                      <div className="flex items-center gap-2 pr-2 pb-1 border-b border-white/20">
                        <span className="text-white/40 w-10 shrink-0">P2×1</span>
                        <span className="text-white font-mono">3x − y = 3</span>
                        <span className="text-red-400 font-bold ml-2">−</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-white/40 w-10 shrink-0"></span>
                        <span className="text-cyan-300 font-mono font-bold">7y = 21</span>
                      </div>
                    </div>
                    <BlockMath math="y = \dfrac{21}{7} = 3" />

                    <p className="text-white/70 font-semibold mt-3">Langkah 4 — Substitusi <InlineMath math="y = 3" /> ke Persamaan (I):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="x + 2(3) = 8" />
                      <BlockMath math="x + 6 = 8 \;\Rightarrow\; x = 2" />
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
                    <BlockMath math="\begin{cases} 3x + 2y = 12 \\ 2x - y = 1 \end{cases}" />
                  </div>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Langkah demi Langkah</p>

                  <div className="space-y-2 text-sm font-body">
                    <p className="text-white/70 font-semibold">Langkah 1 — Tulis persamaan:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\begin{cases} \text{(I):}\quad 3x + 2y = 12 \\ \text{(II):}\quad 2x - y = 1 \end{cases}" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 2 — Samakan koefisien <InlineMath math="y" /> (KPK dari 2 dan 1 adalah 2):</p>
                    <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 font-body">
                      <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">Samakan koefisien y → kalikan kedua persamaan</p>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P1</span>
                        <span className="text-white/80">3x + 2y = 12</span>
                        <span className="text-white/30 text-xs mx-1">|×1 (tetap)|</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P2</span>
                        <span className="text-white/80">2x − y = 1</span>
                        <span className="text-yellow-300 font-bold mx-1">|×2|</span>
                        <span className="text-cyan-300 font-bold">4x − 2y = 2</span>
                      </div>
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 3 — Jumlahkan (koefisien <InlineMath math="y" /> berlawanan tanda) → <InlineMath math="y" /> lenyap:</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-3 font-body">
                      <div className="flex items-center gap-2 pr-2">
                        <span className="text-white/40 w-10 shrink-0">P1×1</span>
                        <span className="text-white font-mono">3x + 2y = 12</span>
                      </div>
                      <div className="flex items-center gap-2 pr-2 pb-1 border-b border-white/20">
                        <span className="text-white/40 w-10 shrink-0">P2×2</span>
                        <span className="text-white font-mono">4x − 2y = 2</span>
                        <span className="text-green-400 font-bold ml-2">+</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-white/40 w-10 shrink-0"></span>
                        <span className="text-cyan-300 font-mono font-bold">7x = 14</span>
                      </div>
                    </div>
                    <BlockMath math="x = \dfrac{14}{7} = 2" />

                    <p className="text-white/70 font-semibold mt-3">Langkah 4 — Substitusi <InlineMath math="x = 2" /> ke Persamaan (II):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="2(2) - y = 1" />
                      <BlockMath math="4 - y = 1 \;\Rightarrow\; y = 3" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 5 — Verifikasi:</p>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2 space-y-1">
                      <p className="text-white/70 text-xs">Cek Pers. (I): <InlineMath math="3(2) + 2(3) = 6 + 6 = 12" /> ✅</p>
                      <p className="text-white/70 text-xs">Cek Pers. (II): <InlineMath math="2(2) - 3 = 4 - 3 = 1" /> ✅</p>
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

          {/* ── CONTOH 3 (SULIT) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />

                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Di sebuah toko buah, 3 kg apel dan 5 kg jeruk dijual seharga Rp58.000. Jika 2 kg apel dan 3 kg jeruk dijual seharga Rp37.000, tentukan harga 1 kg apel dan 1 kg jeruk menggunakan metode campuran!
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Langkah demi Langkah</p>

                  <div className="space-y-2 text-sm font-body">
                    <p className="text-white/70 font-semibold">Langkah 1 — Buat model SPLDV:</p>
                    <div className="bg-slate-800/50 rounded-lg p-2 space-y-1">
                      <p className="text-white/60 text-xs">Misalkan <InlineMath math="a" /> = harga 1 kg apel (rupiah), <InlineMath math="j" /> = harga 1 kg jeruk (rupiah)</p>
                      <BlockMath math="\begin{cases} \text{(I):}\quad 3a + 5j = 58.000 \\ \text{(II):}\quad 2a + 3j = 37.000 \end{cases}" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 2 — Samakan koefisien <InlineMath math="a" /> (KPK dari 3 dan 2 adalah 6):</p>
                    <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 font-body">
                      <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">Samakan koefisien a → kalikan kedua persamaan</p>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P1</span>
                        <span className="text-white/80">3a + 5j = 58.000</span>
                        <span className="text-yellow-300 font-bold mx-1">|×2|</span>
                        <span className="text-cyan-300 font-bold">6a + 10j = 116.000</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                        <span className="text-white/50 w-5 shrink-0">P2</span>
                        <span className="text-white/80">2a + 3j = 37.000</span>
                        <span className="text-yellow-300 font-bold mx-1">|×3|</span>
                        <span className="text-cyan-300 font-bold">6a + 9j = 111.000</span>
                      </div>
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 3 — Kurangkan (koefisien <InlineMath math="a" /> sama tanda) → <InlineMath math="a" /> lenyap:</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-3 font-body">
                      <div className="flex items-center gap-2 pr-2">
                        <span className="text-white/40 w-10 shrink-0">P1×2</span>
                        <span className="text-white font-mono">6a + 10j = 116.000</span>
                      </div>
                      <div className="flex items-center gap-2 pr-2 pb-1 border-b border-white/20">
                        <span className="text-white/40 w-10 shrink-0">P2×3</span>
                        <span className="text-white font-mono">6a + 9j = 111.000</span>
                        <span className="text-red-400 font-bold ml-2">−</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-white/40 w-10 shrink-0"></span>
                        <span className="text-cyan-300 font-mono font-bold">j = 5.000</span>
                      </div>
                    </div>
                    <BlockMath math="j = 5.000" />

                    <p className="text-white/70 font-semibold mt-3">Langkah 4 — Substitusi <InlineMath math="j = 5.000" /> ke Persamaan (I):</p>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="3a + 5(5.000) = 58.000" />
                      <BlockMath math="3a + 25.000 = 58.000" />
                      <BlockMath math="3a = 33.000 \;\Rightarrow\; a = 11.000" />
                    </div>

                    <p className="text-white/70 font-semibold mt-3">Langkah 5 — Verifikasi:</p>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2 space-y-1">
                      <p className="text-white/70 text-xs">Cek Pers. (I): <InlineMath math="3(11.000) + 5(5.000) = 33.000 + 25.000 = 58.000" /> ✅</p>
                      <p className="text-white/70 text-xs">Cek Pers. (II): <InlineMath math="2(11.000) + 3(5.000) = 22.000 + 15.000 = 37.000" /> ✅</p>
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2 space-y-1 mt-2">
                      <p className="font-body text-xs text-red-300 font-bold">🔑 Harga 1 kg apel: Rp11.000 | Harga 1 kg jeruk: Rp5.000</p>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 mt-1">
                      <p className="font-body text-sm font-bold text-cyan-300">
                        ✅ Solusi: <InlineMath math="a = 11.000" /> dan <InlineMath math="j = 5.000" />
                      </p>
                      <p className="font-body text-xs text-white/60 mt-1">Tips: Pada soal cerita, selalu definisikan variabel di awal dan verifikasi ke soal aslinya!</p>
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
