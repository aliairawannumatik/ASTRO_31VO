import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Replace, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import SubstitusiInteraktif from "@/components/SubstitusiInteraktif";

const MetodeSubstitusiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "langkah", "lab", "contoh1", "rangkuman",
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
          METODE SUBSTITUSI
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Selesaikan SPLDV dengan Teknik "Penggantian" Variabel
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Ide Dasar Metode Substitusi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kata "substitusi" artinya <strong className="text-cyan-300">penggantian</strong>. Ide utamanya: dari salah satu persamaan, kita nyatakan satu variabel dalam bentuk variabel lain (misalnya <InlineMath math="y" /> dalam fungsi <InlineMath math="x" />), lalu kita <em>"masukkan"</em> (substitusikan) ekspresi tersebut ke persamaan kedua. Hasilnya: persamaan kedua berubah menjadi persamaan dengan <strong className="text-cyan-300">satu variabel</strong> saja, yang bisa langsung diselesaikan!
                </p>

                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔄 Alur Metode Substitusi</p>
                  <div className="flex flex-col gap-2 text-xs font-body">
                    {[
                      { from: "SPLDV (2 persamaan, 2 variabel)", to: "Nyatakan y = f(x) dari salah satu persamaan", color: "bg-slate-800/60" },
                      { from: "Substitusikan y = f(x) ke persamaan lain", to: "Dapat persamaan 1 variabel: ax = b", color: "bg-slate-700/60" },
                      { from: "Selesaikan: x = b/a", to: "Substitusikan x ke y = f(x) untuk dapat y", color: "bg-slate-600/60" },
                      { from: "Solusi SPLDV: (x, y)", to: "Verifikasi ke kedua persamaan!", color: "bg-cyan-900/40" },
                    ].map(({ from, to, color }, i) => (
                      <div key={i} className={`${color} border border-white/10 rounded-lg px-3 py-2`}>
                        <p className="text-white/60">{i + 1}. {from}</p>
                        <p className="text-cyan-300 mt-0.5">→ {to}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Keunggulan Substitusi:</strong> Hasilnya <em>presisi</em> — tidak bergantung pada akurasi gambar seperti metode grafik. Metode ini paling efektif ketika salah satu persamaan sudah ada variabel dengan koefisien 1 (mudah dinyatakan).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── LANGKAH-LANGKAH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Replace className="w-5 h-5" />} iconColor="text-green-400" title="📘 Langkah-Langkah Metode Substitusi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Metode substitusi mengubah SPLDV (dua persamaan, dua variabel) menjadi persamaan linear satu variabel dengan cara menggantikan salah satu variabel menggunakan ekspresi dari persamaan lain.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">📋 4 Langkah Sistematis</p>
                  <Step no="1" title="Pilih persamaan yang paling sederhana" color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">Pilih salah satu persamaan, lalu nyatakan satu variabel dalam variabel lainnya. Lebih mudah jika ada variabel dengan koefisien 1.</p>
                    <div className="mt-2">
                      <BlockMath math="\text{Dari } x + y = 5 \Rightarrow y = 5 - x" />
                    </div>
                  </Step>
                  <Step no="2" title="Substitusikan ke persamaan lain" color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">Gantikan variabel yang sudah dinyatakan tadi ke persamaan satunya. Persamaan baru hanya akan mengandung satu variabel.</p>
                    <div className="mt-2">
                      <BlockMath math="\text{Masukkan } y = 5 - x \text{ ke } 2x + 3y = 11" />
                      <BlockMath math="2x + 3(5 - x) = 11" />
                    </div>
                  </Step>
                  <Step no="3" title="Selesaikan persamaan satu variabel" color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">Sederhanakan dan selesaikan untuk mendapatkan nilai variabel pertama.</p>
                    <div className="mt-2">
                      <BlockMath math="2x + 15 - 3x = 11 \Rightarrow -x = -4 \Rightarrow x = 4" />
                    </div>
                  </Step>
                  <Step no="4" title="Cari nilai variabel kedua & verifikasi" color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">Substitusikan nilai yang ditemukan ke ekspresi dari Langkah 1 untuk mendapatkan variabel kedua. Verifikasi ke kedua persamaan!</p>
                    <div className="mt-2">
                      <BlockMath math="y = 5 - 4 = 1 \quad \Rightarrow \quad (x, y) = (4, 1)" />
                    </div>
                  </Step>
                </div>

                {/* Tips pemilihan variabel */}
                <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300">💡 Tips Memilih Variabel yang Tepat</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-yellow-900/40">
                          <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200 text-left">Situasi</th>
                          <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200 text-left">Strategi Terbaik</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Ada variabel berkoefisien 1", "Nyatakan variabel tersebut → paling mudah"],
                          ["Semua koefisien sama", "Pilih variabel apa saja, prosesnya setara"],
                          ["Koefisien besar semua", "Pertimbangkan metode eliminasi"],
                        ].map(([situasi, strategi], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-1 text-white/70">{situasi}</td>
                            <td className="border border-white/10 px-3 py-1 text-cyan-300">{strategi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── LAB INTERAKTIF ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400" title="🧪 Lab Interaktif — Coba Soalmu Sendiri!" />
            {expandedSections.includes("lab") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Masukkan <strong className="text-violet-300">sistem persamaan linear dua variabel</strong> milikmu, pilih persamaan & variabel yang ingin dinyatakan, lalu tekan <strong className="text-cyan-300">▶ Selesaikan</strong> — setiap langkah akan muncul satu per satu secara otomatis!
                  </p>
                </div>
                <SubstitusiInteraktif />
              </div>
            )}
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
                      Selesaikan SPLDV berikut dengan metode substitusi:<br />
                      <InlineMath math="y = 2x" /> dan <InlineMath math="x + y = 9" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                    <p className="font-body text-sm text-white/80">Persamaan 1 sudah berbentuk <InlineMath math="y = 2x" /> — langsung substitusikan ke Persamaan 2!</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 1 — Substitusi</strong> <InlineMath math="y = 2x" /> ke <InlineMath math="x + y = 9" />:</p>
                      <BlockMath math="x + 2x = 9" />
                      <BlockMath math="3x = 9" />
                      <BlockMath math="x = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 2 — Cari y:</strong></p>
                      <BlockMath math="y = 2x = 2(3) = 6" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 3 — Verifikasi:</strong></p>
                      <BlockMath math="P1: 6 = 2(3) = 6 \checkmark" />
                      <BlockMath math="P2: 3 + 6 = 9 \checkmark" />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 Solusi: <InlineMath math="x = 3,\ y = 6" /></p>
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
                      Selesaikan dengan metode substitusi:<br />
                      <InlineMath math="3x + 2y = 16" /> dan <InlineMath math="x - y = 2" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 1 — Nyatakan variabel dari Persamaan 2:</strong></p>
                      <p className="font-body text-xs text-white/60">Persamaan 2: <InlineMath math="x - y = 2" /> → koefisien x dan y keduanya 1, pilih nyatakan x:</p>
                      <BlockMath math="x = y + 2 \quad \cdots (*)" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 2 — Substitusikan (*) ke Persamaan 1:</strong></p>
                      <BlockMath math="3(y + 2) + 2y = 16" />
                      <BlockMath math="3y + 6 + 2y = 16" />
                      <BlockMath math="5y = 10" />
                      <BlockMath math="y = 2" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 3 — Cari x:</strong></p>
                      <BlockMath math="x = y + 2 = 2 + 2 = 4" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 4 — Verifikasi:</strong></p>
                      <BlockMath math="P1: 3(4) + 2(2) = 12 + 4 = 16 \checkmark" />
                      <BlockMath math="P2: 4 - 2 = 2 \checkmark" />
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 Solusi: <InlineMath math="x = 4,\ y = 2" />. Kunci: pilih persamaan yang lebih mudah dinyatakan (koefisien lebih kecil) untuk langkah pertama.</p>
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
                      Sebuah toko menjual 2 jenis tiket bioskop: reguler dan VIP. Seorang pelanggan membeli 3 tiket reguler dan 2 tiket VIP seharga Rp210.000. Pelanggan lain membeli 1 tiket reguler dan 4 tiket VIP seharga Rp270.000. Gunakan metode substitusi untuk menentukan harga masing-masing tiket!
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ Pembahasan</p>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 1 — Buat model SPLDV:</strong></p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                        <p>Misalkan <InlineMath math="x" /> = harga tiket reguler</p>
                        <p>Misalkan <InlineMath math="y" /> = harga tiket VIP</p>
                      </div>
                      <BlockMath math="\begin{cases} 3x + 2y = 210.000 \quad (1) \\ x + 4y = 270.000 \quad\ (2) \end{cases}" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 2 — Nyatakan x dari Persamaan 2</strong> (koefisien x = 1, paling mudah):</p>
                      <BlockMath math="x = 270.000 - 4y \quad \cdots (*)" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 3 — Substitusikan (*) ke Persamaan 1:</strong></p>
                      <BlockMath math="3(270.000 - 4y) + 2y = 210.000" />
                      <BlockMath math="810.000 - 12y + 2y = 210.000" />
                      <BlockMath math="-10y = 210.000 - 810.000" />
                      <BlockMath math="-10y = -600.000" />
                      <BlockMath math="y = 60.000" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 4 — Cari x:</strong></p>
                      <BlockMath math="x = 270.000 - 4(60.000) = 270.000 - 240.000 = 30.000" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 5 — Verifikasi:</strong></p>
                      <BlockMath math="P1: 3(30.000) + 2(60.000) = 90.000 + 120.000 = 210.000 \checkmark" />
                      <BlockMath math="P2: 30.000 + 4(60.000) = 30.000 + 240.000 = 270.000 \checkmark" />
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2 space-y-1">
                      <p className="font-body text-xs text-red-300 font-bold">🔑 Harga tiket reguler: Rp30.000 | Harga tiket VIP: Rp60.000</p>
                      <p className="font-body text-xs text-white/50">⚠️ Pada soal cerita, selalu cek apakah jawaban masuk akal — harga tidak mungkin negatif!</p>
                    </div>
                  </div>
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
                    { poin: "Metode substitusi: nyatakan satu variabel dari satu persamaan, lalu gantikan ke persamaan lain.", icon: "🔄" },
                    { poin: "Pilih persamaan dengan variabel berkoefisien 1 untuk langkah penyataan variabel — ini mempermudah perhitungan.", icon: "💡" },
                    { poin: "Setelah mendapat nilai satu variabel, substitusikan kembali untuk mendapat variabel kedua.", icon: "🔢" },
                    { poin: "Metode ini memberikan hasil yang presisi (tidak perlu gambar grafik).", icon: "🎯" },
                    { poin: "Selalu verifikasi solusi ke KEDUA persamaan awal untuk memastikan jawabannya benar.", icon: "✅" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-2 space-y-1 text-xs font-body">
                  <p className="text-green-300 font-bold text-center">Alur Singkat Metode Substitusi</p>
                  <BlockMath math="\text{P2: } x - y = c_2 \;\Rightarrow\; x = y + c_2 \;\Rightarrow\; \text{masukkan ke P1} \;\Rightarrow\; \text{selesaikan } y" />
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

export default MetodeSubstitusiPage;
