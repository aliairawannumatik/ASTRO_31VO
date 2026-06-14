import React from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, Minus, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import EliminasiInteraktif from "@/components/EliminasiInteraktif";
import EliminasiAnimasiPembahasan from "@/components/EliminasiAnimasiPembahasan";

const MetodeEliminasiPage = () => {
  const SectionHeader = ({
    icon, iconColor, title,
  }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
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
          METODE ELIMINASI
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Selesaikan SPLDV dengan Teknik "Menghapus" Salah Satu Variabel
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Ide Dasar Metode Eliminasi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kata "eliminasi" berasal dari bahasa Latin yang berarti <strong className="text-cyan-300">menghilangkan</strong> atau <strong className="text-cyan-300">mengeliminasi</strong>. Ide utama metode ini: kita <em>menghapus</em> salah satu variabel dari sistem persamaan dengan cara menjumlahkan atau mengurangkan kedua persamaan, sehingga tersisa hanya satu variabel yang bisa langsung diselesaikan.
                </p>

                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-1">🔄 Prinsip Dasar Eliminasi</p>

                  {/* Kasus 1 — kurangkan */}
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-3">
                      🔴 Koefisien sama dan <span className="text-red-300">bertanda sama</span> → <strong className="text-red-300">Kurangkan (−)</strong>
                    </p>
                    <div className="font-mono text-sm inline-block min-w-0">
                      {/* Baris 1 */}
                      <div className="flex items-center gap-3 pr-6">
                        <span className="text-white/80">ax + by = d</span>
                      </div>
                      {/* Baris 2 */}
                      <div className="flex items-center gap-3">
                        <span className="text-white/80">ax + cy = e</span>
                        <span className="text-red-400 font-bold">−</span>
                      </div>
                      {/* Garis */}
                      <div className="border-t-2 border-white/30 my-1.5" />
                      {/* Hasil */}
                      <div className="flex items-center gap-3 pr-6">
                        <span className="text-yellow-300 font-semibold">(b − c)y = d − e</span>
                      </div>
                    </div>
                    <p className="font-body text-xs text-white/50 mt-1">
                      Variabel <InlineMath math="x" /> hilang karena <InlineMath math="ax - ax = 0" />
                    </p>
                  </div>

                  {/* Kasus 2 — jumlahkan */}
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-violet-300 mb-3">
                      🟢 Koefisien sama dan <span className="text-green-300">bertanda berbeda</span> → <strong className="text-green-300">Jumlahkan (+)</strong>
                    </p>
                    <div className="font-mono text-sm inline-block min-w-0">
                      {/* Baris 1 */}
                      <div className="flex items-center gap-3 pr-6">
                        <span className="text-white/80">ax + by = d</span>
                      </div>
                      {/* Baris 2 */}
                      <div className="flex items-center gap-3">
                        <span className="text-white/80">ax − by = e</span>
                        <span className="text-green-400 font-bold">+</span>
                      </div>
                      {/* Garis */}
                      <div className="border-t-2 border-white/30 my-1.5" />
                      {/* Hasil */}
                      <div className="flex items-center gap-3 pr-6">
                        <span className="text-yellow-300 font-semibold">2ax = d + e</span>
                      </div>
                    </div>
                    <p className="font-body text-xs text-white/50 mt-1">
                      Variabel <InlineMath math="y" /> hilang karena <InlineMath math="by + (-by) = 0" />
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-cyan-500/20 bg-cyan-900/20">
                    <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest">📐 Format Penulisan Eliminasi</p>
                  </div>
                  <div className="p-4 overflow-x-auto font-mono text-sm">
                    <div className="grid grid-cols-[1fr_58px_1fr] text-[10px] text-white/30 uppercase tracking-wider font-body mb-2">
                      <div className="text-center">Persamaan Asal</div>
                      <div className="text-center">Pengali</div>
                      <div className="text-center">Bentuk Baru</div>
                    </div>
                    <div className="border border-white/10 rounded-t-lg grid grid-cols-[1fr_58px_1fr]">
                      <div className="px-3 py-2.5 flex flex-col gap-0.5">
                        <span className="text-[10px] text-white/30 font-body">PLDV (1)</span>
                        <span className="text-white/70">ax + by = c</span>
                      </div>
                      <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
                        <span className="text-amber-300 font-bold">× k₁</span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center">
                        <span className="text-cyan-200">k₁ax + k₁by = k₁c</span>
                      </div>
                    </div>
                    <div className="border-x border-b border-white/10 rounded-b-lg grid grid-cols-[1fr_58px_1fr]">
                      <div className="px-3 py-2.5 flex flex-col gap-0.5">
                        <span className="text-[10px] text-white/30 font-body">PLDV (2)</span>
                        <span className="text-white/70">dx + ey = f</span>
                      </div>
                      <div className="flex items-center justify-center border-x border-white/10 bg-amber-900/10">
                        <span className="text-amber-300 font-bold">× k₂</span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center">
                        <span className="text-cyan-200">k₂dx + k₂ey = k₂f</span>
                      </div>
                    </div>
                    <div className="relative border-t-2 border-white/30 mt-1">
                      <div className="absolute right-0 -top-3.5 bg-slate-900 px-2">
                        <span className="text-red-400 font-bold text-base">(±)</span>
                      </div>
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="grid grid-cols-[1fr_58px_1fr]">
                        <div /><div />
                        <div className="px-3 py-0.5">
                          <span className="text-yellow-300 font-bold whitespace-pre">{`         px = q`}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_58px_1fr]">
                        <div /><div />
                        <div className="px-3 py-0.5 flex items-center">
                          <span className="text-emerald-300 font-bold whitespace-pre">{`          x = `}</span>
                          <span className="text-emerald-300 font-bold"><InlineMath math="\dfrac{q}{p}" /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Keunggulan Eliminasi:</strong> Sangat efektif ketika koefisien variabel sudah sama atau bisa disamakan dengan perkalian sederhana. Tidak perlu menyatakan satu variabel secara eksplisit seperti metode substitusi!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── LANGKAH-LANGKAH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Minus className="w-5 h-5" />} iconColor="text-red-400" title="📘 Langkah-Langkah Metode Eliminasi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Metode eliminasi "menghapus" satu variabel dengan membuat koefisiennya sama di kedua persamaan, lalu menjumlahkan atau mengurangkan kedua persamaan tersebut. Proses ini dilakukan dua kali — sekali untuk mencari <InlineMath math="x" />, sekali untuk mencari <InlineMath math="y" />.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">📋 5 Langkah Sistematis</p>
                  <Step no="1" title="Tulis kedua persamaan sejajar" color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">Pastikan kedua persamaan sudah dalam bentuk standar <InlineMath math="ax + by = c" /> dan tuliskan satu di atas yang lain.</p>
                    <div className="mt-2">
                      <BlockMath math="\begin{cases} 2x + 3y = 12 \quad (1)\\ 4x + y = 10 \quad\ (2) \end{cases}" />
                    </div>
                  </Step>
                  <Step no="2" title="Pilih variabel yang akan dieliminasi" color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">Pilih variabel yang paling mudah disamakan koefisiennya. Kalikan salah satu atau kedua persamaan dengan bilangan yang tepat.</p>
                    <div className="mt-2">
                      <BlockMath math="\text{Eliminasi } x: \text{ kalikan P1 dengan 2, P2 tetap}" />
                    </div>
                  </Step>
                  <Step no="3" title="Samakan koefisien variabel yang dipilih" color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">Setelah perkalian, koefisien variabel yang dipilih harus sama besar di kedua persamaan.</p>
                    <div className="mt-2 font-mono text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white/80">2x + 3y = 12</span>
                        <span className="text-yellow-300 font-bold">|× 2|</span>
                        <span className="text-cyan-300 font-bold">4x + 6y = 24</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/80">4x +  y  = 10</span>
                        <span className="text-yellow-300 font-bold">|× 1|</span>
                        <span className="text-cyan-300 font-bold">4x +  y  = 10</span>
                      </div>
                    </div>
                  </Step>
                  <Step no="4" title="Kurangkan atau jumlahkan kedua persamaan" color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">Jika koefisien bertanda sama → kurangkan. Jika bertanda berbeda → jumlahkan. Variabel yang dipilih akan lenyap!</p>
                    <div className="mt-2 font-mono text-sm inline-block min-w-0">
                      <div className="flex items-center gap-3 pr-6">
                        <span className="text-white/80">4x + 6y = 24</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/80">4x +  y = 10</span>
                        <span className="text-red-400 font-bold">−</span>
                      </div>
                      <div className="border-t-2 border-white/30 my-1.5" />
                      <div className="flex items-center gap-3 pr-6">
                        <span className="text-cyan-300 font-bold">5y = 14</span>
                      </div>
                      <div className="flex items-center gap-3 pr-6">
                        <span className="text-yellow-300 font-bold font-mono">&nbsp;y =&nbsp;</span>
                        <span className="text-yellow-300 font-bold"><InlineMath math="\dfrac{14}{5}" /></span>
                      </div>
                    </div>
                  </Step>
                  <Step no="5" title="Eliminasi variabel lain untuk mendapat nilai lengkap" color="border-yellow-500/30 bg-yellow-900/10">
                    <p className="text-white/70">Ulangi proses eliminasi, kali ini hapus variabel yang sudah ditemukan nilainya untuk mendapat variabel satunya.</p>
                  </Step>
                </div>

              </div>
            )}
          </div>

          {/* ── LAB INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="🧪 Lab Interaktif — Lihat Eliminasi Beraksi!" />
            <div className="px-5 pb-5 space-y-3">
                <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Masukkan <strong className="text-red-300">sistem persamaan</strong> milikmu, pilih variabel mana yang dieliminasi pertama, lalu tekan <strong className="text-orange-300">✖️ Eliminasi</strong> — kamu akan melihat secara langsung bagaimana variabel <strong className="text-red-300">lenyap</strong> dan tersisa satu variabel yang mudah diselesaikan!
                  </p>
                </div>
                <EliminasiInteraktif />
            </div>
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="📝 Contoh Soal & Pembahasan" />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Selesaikan SPLDV berikut dengan metode eliminasi:<br />
                      <InlineMath math="3x + y = 7" /> dan <InlineMath math="x + y = 3" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 1 — Eliminasi variabel <InlineMath math="y" /> untuk mencari <InlineMath math="x" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">Koefisien <InlineMath math="y" /> di kedua persamaan sudah sama (= 1) dan bertanda sama → kurangkan.</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 w-4">P1</span>
                          <span className="text-white font-mono">3x + y = 7</span>
                        </div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                          <span className="text-white/40 w-4">P2</span>
                          <span className="text-white font-mono">x + y = 3</span>
                          <span className="text-red-400 ml-auto text-xs">(dikurangkan)</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-white/40 w-4"></span>
                          <span className="text-cyan-300 font-mono font-bold">2x + 0 = 4</span>
                        </div>
                      </div>
                      <BlockMath math="2x = 4 \;\Rightarrow\; x = 2" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 2 — Eliminasi variabel <InlineMath math="x" /> untuk mencari <InlineMath math="y" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">Kalikan P2 dengan 3 agar koefisien <InlineMath math="x" /> sama, lalu kurangkan.</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 w-8">P1</span>
                          <span className="text-white font-mono">3x + y = 7</span>
                        </div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                          <span className="text-white/40 w-8">P2×3</span>
                          <span className="text-white font-mono">3x + 3y = 9</span>
                          <span className="text-red-400 ml-auto text-xs">(dikurangkan)</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-white/40 w-8"></span>
                          <span className="text-cyan-300 font-mono font-bold">0 + (−2y) = −2</span>
                        </div>
                      </div>
                      <BlockMath math="-2y = -2 \;\Rightarrow\; y = 1" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 3 — Verifikasi:</strong></p>
                      <BlockMath math="P1: 3(2) + 1 = 6 + 1 = 7 \checkmark" />
                      <BlockMath math="P2: 2 + 1 = 3 \checkmark" />
                    </div>

                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Solusi: <InlineMath math="x = 2,\ y = 1" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Selesaikan dengan metode eliminasi:<br />
                      <InlineMath math="2x + 3y = 16" /> dan <InlineMath math="5x - 2y = 2" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-xs text-white/60">Koefisien tidak ada yang sama — perlu perkalian dulu sebelum eliminasi.</p>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Eliminasi <InlineMath math="y" /> untuk mencari <InlineMath math="x" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">KPK dari 3 dan 2 adalah 6. Kalikan P1 × 2 dan P2 × 3.</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 w-8 shrink-0">P1×2</span>
                          <span className="text-white font-mono">4x + 6y = 32</span>
                        </div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                          <span className="text-white/40 w-8 shrink-0">P2×3</span>
                          <span className="text-white font-mono">15x − 6y = 6</span>
                          <span className="text-green-400 ml-auto text-xs">(dijumlahkan)</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-white/40 w-8 shrink-0"></span>
                          <span className="text-cyan-300 font-mono font-bold">19x = 38</span>
                        </div>
                      </div>
                      <BlockMath math="19x = 38 \;\Rightarrow\; x = 2" />
                      <p className="font-body text-xs text-white/50 -mt-2 text-center">Koefisien <InlineMath math="y" /> bertanda berbeda (+6 dan −6) → dijumlahkan, sehingga <InlineMath math="y" /> hilang!</p>
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Eliminasi <InlineMath math="x" /> untuk mencari <InlineMath math="y" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">KPK dari 2 dan 5 adalah 10. Kalikan P1 × 5 dan P2 × 2.</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 w-8 shrink-0">P1×5</span>
                          <span className="text-white font-mono">10x + 15y = 80</span>
                        </div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                          <span className="text-white/40 w-8 shrink-0">P2×2</span>
                          <span className="text-white font-mono">10x − 4y = 4</span>
                          <span className="text-red-400 ml-auto text-xs">(dikurangkan)</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-white/40 w-8 shrink-0"></span>
                          <span className="text-cyan-300 font-mono font-bold">19y = 76</span>
                        </div>
                      </div>
                      <BlockMath math="19y = 76 \;\Rightarrow\; y = 4" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Verifikasi:</strong></p>
                      <BlockMath math="P1: 2(2) + 3(4) = 4 + 12 = 16 \checkmark" />
                      <BlockMath math="P2: 5(2) - 2(4) = 10 - 8 = 2 \checkmark" />
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Solusi: <InlineMath math="x = 2,\ y = 4" />. Perhatikan: saat koefisien bertanda <em>berbeda</em> → <strong>jumlahkan</strong>. Saat bertanda <em>sama</em> → <strong>kurangkan</strong>!</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — SULIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">Soal 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      Seorang pedagang menjual dua jenis buah: mangga dan jeruk. Pada hari pertama ia menjual 4 kg mangga dan 6 kg jeruk dan mendapat uang Rp132.000. Pada hari kedua ia menjual 3 kg mangga dan 2 kg jeruk dengan pendapatan Rp72.000. Tentukan harga per kilogram masing-masing buah menggunakan metode eliminasi!
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 1 — Buat model SPLDV:</strong></p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                        <p>Misalkan <InlineMath math="m" /> = harga 1 kg mangga (rupiah)</p>
                        <p>Misalkan <InlineMath math="j" /> = harga 1 kg jeruk (rupiah)</p>
                      </div>
                      <BlockMath math="\begin{cases} 4m + 6j = 132.000 \quad (1) \\ 3m + 2j = 72.000 \quad\ (2) \end{cases}" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 2 — Sederhanakan persamaan:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-1">Bagi P1 dengan 2 dan P2 tetap:</p>
                      <BlockMath math="\begin{cases} 2m + 3j = 66.000 \quad (1') \\ 3m + 2j = 72.000 \quad (2) \end{cases}" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 3 — Eliminasi <InlineMath math="m" /> untuk mencari <InlineMath math="j" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">KPK dari 2 dan 3 adalah 6. Kalikan P1' × 3 dan P2 × 2.</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 w-10 shrink-0">P1'×3</span>
                          <span className="text-white font-mono">6m + 9j = 198.000</span>
                        </div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                          <span className="text-white/40 w-10 shrink-0">P2×2</span>
                          <span className="text-white font-mono">6m + 4j = 144.000</span>
                          <span className="text-red-400 ml-auto text-xs shrink-0">(dikurangkan)</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-white/40 w-10 shrink-0"></span>
                          <span className="text-cyan-300 font-mono font-bold">5j = 54.000</span>
                        </div>
                      </div>
                      <BlockMath math="j = \frac{54.000}{5} = 10.800" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 4 — Eliminasi <InlineMath math="j" /> untuk mencari <InlineMath math="m" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">KPK dari 3 dan 2 adalah 6. Kalikan P1' × 2 dan P2 × 3.</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 w-10 shrink-0">P1'×2</span>
                          <span className="text-white font-mono">4m + 6j = 132.000</span>
                        </div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                          <span className="text-white/40 w-10 shrink-0">P2×3</span>
                          <span className="text-white font-mono">9m + 6j = 216.000</span>
                          <span className="text-red-400 ml-auto text-xs shrink-0">(dikurangkan)</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-white/40 w-10 shrink-0"></span>
                          <span className="text-cyan-300 font-mono font-bold">−5m = −84.000</span>
                        </div>
                      </div>
                      <BlockMath math="m = \frac{84.000}{5} = 16.800" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 5 — Verifikasi:</strong></p>
                      <BlockMath math="P1: 4(16.800) + 6(10.800) = 67.200 + 64.800 = 132.000 \checkmark" />
                      <BlockMath math="P2: 3(16.800) + 2(10.800) = 50.400 + 21.600 = 72.000 \checkmark" />
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2 space-y-1">
                      <p className="font-body text-xs text-red-300 font-bold">🔑 Harga 1 kg mangga: Rp16.800 | Harga 1 kg jeruk: Rp10.800</p>
                      <p className="font-body text-xs text-white/50">⚠️ Sederhanakan persamaan di awal (bagi dengan bilangan yang sama) untuk membuat angka lebih kecil dan perhitungan lebih ringan!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── PERBANDINGAN 3 METODE ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="perbandingan" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="🔍 Perbandingan Tiga Metode SPLDV" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-violet-900/50">
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">Aspek</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">Grafik</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">Substitusi</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">Eliminasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Cara kerja", "Gambar 2 garis, cari titik potong", "Gantikan variabel ke persamaan lain", "Hapus satu variabel dengan +/−"],
                        ["Keakuratan", "⚠️ Kurang presisi", "✅ Presisi", "✅ Presisi"],
                        ["Terbaik untuk", "Solusi bilangan bulat kecil", "Ada variabel berkoefisien 1", "Koefisien besar / sama"],
                        ["Visualisasi", "✅ Sangat visual", "❌ Tidak visual", "❌ Tidak visual"],
                        ["Kecepatan", "🐢 Lambat (perlu gambar)", "🚀 Cepat jika koef. 1", "🚀 Cepat untuk koef. besar"],
                      ].map(([aspek, grafik, sub, elim], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-white font-semibold">{aspek}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-blue-300">{grafik}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-green-300">{sub}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-red-300">{elim}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-violet-200">
                    💡 <strong>Tips memilih metode:</strong> Tidak ada metode yang selalu terbaik — pilih yang paling efisien berdasarkan bentuk persamaan yang dihadapi. Dalam ujian, metode eliminasi sering jadi pilihan utama karena konsisten dan mudah diterapkan pada berbagai bentuk SPLDV.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title="📋 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {[
                    { poin: "Metode eliminasi menghilangkan satu variabel dengan menyamakan koefisiennya, lalu menjumlahkan atau mengurangkan kedua persamaan.", icon: "🗑️" },
                    { poin: "Koefisien sama, tanda sama → kurangkan. Koefisien sama, tanda berbeda → jumlahkan.", icon: "➕➖" },
                    { poin: "Lakukan proses eliminasi dua kali: sekali untuk x, sekali untuk y.", icon: "🔁" },
                    { poin: "Sederhanakan persamaan di awal (bagi dengan faktor persekutuan) untuk mempermudah perhitungan.", icon: "✂️" },
                    { poin: "Selalu verifikasi solusi ke KEDUA persamaan awal untuk memastikan kebenaran jawaban.", icon: "✅" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-2">
                  <p className="font-body text-xs text-center text-red-300 font-bold mb-1">Inti Metode Eliminasi</p>
                  <BlockMath math="\text{Samakan koefisien} \;\xrightarrow{+\text{ atau }-}\; \text{variabel lenyap} \;\Rightarrow\; \text{selesaikan}" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              ← Kembali ke Menu SPLDV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetodeEliminasiPage;
