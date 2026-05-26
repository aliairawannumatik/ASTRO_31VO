import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BentukAkarPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1","contoh1",
    "konsep2","contoh2",
    "konsep3","contoh3",
    "konsep4","contoh4",
    "konsep5","contoh5",
    "konsep6","contoh6",
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
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BENTUK AKAR
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Bilangan Berpangkat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ===== PENGANTAR ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Kenapa Kita Perlu Belajar Bentuk Akar?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernahkah kamu mencoba menghitung panjang sisi persegi yang luasnya 5 cm²?
                  Jawabannya adalah <InlineMath math="\sqrt{5}" /> cm — bukan bilangan bulat, bukan juga pecahan biasa.
                  Inilah yang disebut <strong className="text-cyan-300">bentuk akar</strong>!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Bentuk akar muncul di banyak tempat: menghitung diagonal layar HP, jarak antar titik di peta, hingga kecepatan gelombang suara. Memahaminya berarti kamu siap bermain di level matematika yang lebih tinggi! 🚀
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Materi ini erat kaitannya dengan pangkat. Pastikan kamu sudah paham konsep bilangan berpangkat sebelum melanjutkan!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 1: PENGERTIAN BENTUK AKAR ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Pengertian Bentuk Akar" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">

                {/* Ringkasan Intisari */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">Bentuk akar</strong> adalah akar dari suatu bilangan yang <em>tidak dapat disederhanakan menjadi bilangan rasional</em> (bilangan bulat atau pecahan biasa).
                    Secara umum, akar pangkat <InlineMath math="n" /> dari bilangan <InlineMath math="a" /> didefinisikan sebagai:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="\sqrt[n]{a} = b \iff b^n = a, \quad a \geq 0,\; b \geq 0" />
                  </div>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jika <InlineMath math="n = 2" />, tanda akar ditulis <InlineMath math="\sqrt{\;}" /> (tanpa angka 2).
                    Bilangan di dalam tanda akar disebut <strong className="text-green-300">radicand</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">Bukan bentuk akar (rasional)</p>
                      <p className="font-body text-sm text-white"><InlineMath math="\sqrt{9} = 3" /></p>
                      <p className="font-body text-sm text-white"><InlineMath math="\sqrt{49} = 7" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">Bentuk akar (irasional)</p>
                      <p className="font-body text-sm text-cyan-300"><InlineMath math="\sqrt{2},\; \sqrt{3},\; \sqrt{5}" /></p>
                      <p className="font-body text-sm text-cyan-300"><InlineMath math="\sqrt{7},\; \sqrt{11}" /></p>
                    </div>
                  </div>
                </div>

                {/* Visual diagram */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ANATOMI BENTUK AKAR:</p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-green-900/60 to-teal-900/60 border-2 border-green-500/50 rounded-xl px-10 py-5 text-center">
                      <span className="font-display text-2xl font-bold text-yellow-400 align-super mr-1">n</span>
                      <span className="font-display text-5xl font-bold text-white">√</span>
                      <span className="font-display text-4xl font-bold text-cyan-300">a</span>
                    </div>
                    <div className="flex justify-around w-full text-xs font-body">
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-yellow-400 mx-auto mb-1"></div>
                        <span className="text-yellow-300 font-semibold">INDEKS (n)</span>
                        <br /><span className="text-white/60">Pangkat akar</span>
                      </div>
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-cyan-400 mx-auto mb-1"></div>
                        <span className="text-cyan-300 font-semibold">RADICAND (a)</span>
                        <br /><span className="text-white/60">Bilangan di bawah akar</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Cara mudah mengenali bentuk akar — coba cari apakah radicand adalah bilangan kuadrat sempurna (1, 4, 9, 16, 25, …). Jika ya, hasilnya bilangan bulat (bukan bentuk akar). Jika tidak, itulah bentuk akar!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Pengertian Bentuk Akar" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dari daftar berikut, tentukan mana yang merupakan bentuk akar dan mana yang bukan:<br />
                      <InlineMath math="\sqrt{16},\quad \sqrt{20},\quad \sqrt{36},\quad \sqrt{50}" />
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah:</strong> Cek apakah radicand adalah bilangan kuadrat sempurna.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-sm">
                        <p><InlineMath math="\sqrt{16} = 4" /> → <span className="text-red-400 font-semibold">Bukan bentuk akar</span> (16 = 4²)</p>
                        <p><InlineMath math="\sqrt{20}" /> → <span className="text-green-400 font-semibold">Bentuk akar</span> (20 bukan kuadrat sempurna)</p>
                        <p><InlineMath math="\sqrt{36} = 6" /> → <span className="text-red-400 font-semibold">Bukan bentuk akar</span> (36 = 6²)</p>
                        <p><InlineMath math="\sqrt{50}" /> → <span className="text-green-400 font-semibold">Bentuk akar</span> (50 bukan kuadrat sempurna)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah taman berbentuk persegi memiliki luas <InlineMath math="75 \text{ m}^2" />. Tentukan panjang sisi taman tersebut dalam bentuk akar!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Gunakan rumus luas persegi <InlineMath math="L = s^2" /></p>
                      <p><strong>Langkah 2:</strong> Cari <InlineMath math="s" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="s = \sqrt{L} = \sqrt{75}" />
                      </div>
                      <p><strong>Langkah 3:</strong> Cek apakah 75 kuadrat sempurna → <strong>tidak</strong>, karena <InlineMath math="8^2 = 64" /> dan <InlineMath math="9^2 = 81" />.</p>
                      <p><strong className="text-primary">Panjang sisi taman = <InlineMath math="\sqrt{75}" /> m (bentuk akar)</strong></p>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Hitunglah nilai dari <InlineMath math="\sqrt[3]{-125}" /> dan tentukan apakah hasilnya termasuk bentuk akar atau bukan. Jelaskan!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Akar pangkat tiga dari bilangan negatif diperbolehkan (karena <InlineMath math="(-5)^3 = -125" />).</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sqrt[3]{-125} = -5" />
                      </div>
                      <p><strong>Langkah 2:</strong> Periksa hasilnya:</p>
                      <p>Hasilnya adalah <InlineMath math="-5" />, yaitu bilangan bulat (bilangan rasional).</p>
                      <p><strong className="text-primary">Kesimpulan: <InlineMath math="\sqrt[3]{-125}" /> BUKAN bentuk akar</strong>, karena hasilnya bilangan rasional (<InlineMath math="-5" />).</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 2: HUBUNGAN BENTUK AKAR & PANGKAT PECAHAN ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 2: Hubungan Bentuk Akar dengan Pangkat Pecahan" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ternyata, bentuk akar dan pangkat pecahan adalah <strong className="text-purple-300">dua cara berbeda menulis hal yang sama!</strong>
                    Hubungannya dirumuskan sebagai:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-3">
                    <BlockMath math="a^{\frac{1}{n}} = \sqrt[n]{a}" />
                    <BlockMath math="a^{\frac{m}{n}} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm font-body">
                    <div className="bg-purple-900/30 rounded p-3">
                      <p className="text-purple-300 font-semibold">Contoh sederhana:</p>
                      <p className="text-white/80 mt-1"><InlineMath math="25^{\frac{1}{2}} = \sqrt{25} = 5" /></p>
                      <p className="text-white/80"><InlineMath math="8^{\frac{2}{3}} = \sqrt[3]{8^2} = \sqrt[3]{64} = 4" /></p>
                    </div>
                  </div>
                </div>

                {/* Visual Jembatan */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🌉 JEMBATAN ANTARA DUA NOTASI:</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="bg-purple-900/50 border border-purple-500/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-300 mb-1">Pangkat Pecahan</p>
                      <p className="text-white font-bold text-lg"><InlineMath math="a^{\frac{m}{n}}" /></p>
                    </div>
                    <div className="text-2xl text-primary font-bold">⇌</div>
                    <div className="bg-green-900/50 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-300 mb-1">Bentuk Akar</p>
                      <p className="text-white font-bold text-lg"><InlineMath math="\sqrt[n]{a^m}" /></p>
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-900/50 rounded p-2 text-center">
                    <p className="font-body text-xs text-white/60">Penyebut pangkat = indeks akar · Pembilang pangkat = pangkat radicand</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Hafal pola ini — <strong>penyebut pecahan</strong> menjadi <strong>indeks akar</strong>, dan <strong>pembilang pecahan</strong> menjadi <strong>pangkat di dalam akar</strong>. Mudah!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Hubungan Akar & Pangkat Pecahan" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Ubah ke bentuk akar: <InlineMath math="7^{\frac{1}{2}}" /> dan <InlineMath math="5^{\frac{1}{3}}" />
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Gunakan rumus <InlineMath math="a^{\frac{1}{n}} = \sqrt[n]{a}" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="7^{\frac{1}{2}} = \sqrt[2]{7} = \sqrt{7}" />
                        <BlockMath math="5^{\frac{1}{3}} = \sqrt[3]{5}" />
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
                      Hitunglah nilai dari <InlineMath math="32^{\frac{3}{5}}" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Ubah ke bentuk akar:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="32^{\frac{3}{5}} = \sqrt[5]{32^3}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Cari <InlineMath math="\sqrt[5]{32}" /> terlebih dahulu:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sqrt[5]{32} = 2 \quad (\text{karena } 2^5 = 32)" />
                      </div>
                      <p><strong>Langkah 3:</strong> Pangkatkan dengan 3:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="32^{\frac{3}{5}} = \left(\sqrt[5]{32}\right)^3 = 2^3 = 8" />
                      </div>
                      <p><strong className="text-primary">Hasil: 8</strong></p>
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
                      Sederhanakan: <InlineMath math="\dfrac{27^{\frac{2}{3}} \times 9^{\frac{1}{2}}}{3^2}" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Ubah semua ke basis 3:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="27 = 3^3 \Rightarrow 27^{\frac{2}{3}} = (3^3)^{\frac{2}{3}} = 3^2 = 9" />
                        <BlockMath math="9 = 3^2 \Rightarrow 9^{\frac{1}{2}} = (3^2)^{\frac{1}{2}} = 3^1 = 3" />
                      </div>
                      <p><strong>Langkah 2:</strong> Substitusi:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{9 \times 3}{3^2} = \frac{27}{9} = 3" />
                      </div>
                      <p><strong className="text-primary">Hasil: 3</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 3: PENYEDERHANAAN BENTUK AKAR ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Sub-Bab 3: Penyederhanaan Bentuk Akar" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bentuk akar dikatakan <strong className="text-cyan-300">sederhana</strong> jika radicand tidak memiliki faktor yang merupakan kuadrat sempurna (selain 1).
                    Cara menyederhanakan: <em>faktorkan radicand, lalu keluarkan faktor kuadrat sempurna dari dalam akar.</em>
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2 text-center">
                    <BlockMath math="\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}" />
                    <BlockMath math="\sqrt{m^2 \cdot k} = m\sqrt{k}, \quad m > 0" />
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-2">Langkah Penyederhanaan:</p>
                    <ol className="space-y-1 font-body text-sm text-white/80 list-decimal list-inside">
                      <li>Faktorkan radicand ke faktor-faktor prima.</li>
                      <li>Kelompokkan faktor yang berpasangan (kuadrat sempurna).</li>
                      <li>Keluarkan faktor berpasangan dari tanda akar.</li>
                    </ol>
                  </div>
                </div>

                {/* Visualisasi */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">📊 CONTOH VISUALISASI <InlineMath math="\sqrt{72}" />:</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="72 = 4 \times 18 = 4 \times 9 \times 2 = 36 \times 2" />
                    </div>
                    <div className="flex items-center gap-2 justify-center text-sm font-body text-white/80">
                      <div className="bg-red-900/40 border border-red-500/40 rounded px-3 py-1"><InlineMath math="\sqrt{72}" /></div>
                      <span className="text-primary">→</span>
                      <div className="bg-yellow-900/40 border border-yellow-500/40 rounded px-3 py-1"><InlineMath math="\sqrt{36 \times 2}" /></div>
                      <span className="text-primary">→</span>
                      <div className="bg-green-900/40 border border-green-500/40 rounded px-3 py-1"><InlineMath math="6\sqrt{2}" /></div>
                    </div>
                    <p className="text-xs text-white/50 text-center font-body">Belum sederhana → Faktorkan → Bentuk sederhana ✓</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Cari faktor kuadrat sempurna terbesar dari radicand untuk mempersingkat langkah! Misalnya untuk <InlineMath math="\sqrt{72}" />, langsung cari 36 (bukan 4 atau 9) agar lebih efisien.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title="📝 Contoh Soal — Penyederhanaan Bentuk Akar" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Sederhanakan: <InlineMath math="\sqrt{48}" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari faktor kuadrat sempurna terbesar dari 48:</p>
                      <p className="text-white/60 text-xs">48 = 16 × 3 (karena 16 = 4² adalah faktor kuadrat sempurna terbesar)</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sqrt{48} = \sqrt{16 \times 3} = \sqrt{16} \times \sqrt{3} = 4\sqrt{3}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="4\sqrt{3}" /></strong></p>
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
                      Sederhanakan: <InlineMath math="3\sqrt{50} - \sqrt{32} + 2\sqrt{8}" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Sederhanakan tiap bentuk akar:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\sqrt{50} = \sqrt{25 \times 2} = 5\sqrt{2}" />
                        <BlockMath math="\sqrt{32} = \sqrt{16 \times 2} = 4\sqrt{2}" />
                        <BlockMath math="\sqrt{8} = \sqrt{4 \times 2} = 2\sqrt{2}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Substitusi dan kumpulkan suku sejenis:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="3(5\sqrt{2}) - 4\sqrt{2} + 2(2\sqrt{2}) = 15\sqrt{2} - 4\sqrt{2} + 4\sqrt{2} = 15\sqrt{2}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="15\sqrt{2}" /></strong></p>
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
                      Sederhanakan: <InlineMath math="\sqrt{98a^3b^5}" /> (dengan <InlineMath math="a, b \geq 0" />)
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Faktorkan 98 dan pangkat variabel:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="98 = 49 \times 2 = 7^2 \times 2" />
                        <BlockMath math="a^3 = a^2 \times a, \quad b^5 = b^4 \times b = (b^2)^2 \times b" />
                      </div>
                      <p><strong>Langkah 2:</strong> Susun dan keluarkan faktor kuadrat sempurna:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sqrt{7^2 \cdot 2 \cdot a^2 \cdot a \cdot b^4 \cdot b} = 7 \cdot a \cdot b^2 \cdot \sqrt{2ab}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="7ab^2\sqrt{2ab}" /></strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 4: SIFAT-SIFAT OPERASI BENTUK AKAR ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Sub-Bab 4: Sifat-Sifat Operasi pada Bentuk Akar" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ada empat sifat utama operasi pada bentuk akar. Sifat-sifat ini adalah "senjata utama" dalam menyederhanakan dan menghitung ekspresi yang melibatkan akar.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-orange-500">
                      <p className="font-body text-xs font-semibold text-orange-300 mb-1">① Sifat Perkalian Akar</p>
                      <BlockMath math="\sqrt{a} \times \sqrt{b} = \sqrt{a \times b}, \quad a, b \geq 0" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-yellow-500">
                      <p className="font-body text-xs font-semibold text-yellow-300 mb-1">② Sifat Pembagian Akar</p>
                      <BlockMath math="\frac{\sqrt{a}}{\sqrt{b}} = \sqrt{\frac{a}{b}}, \quad a \geq 0,\; b > 0" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-cyan-500">
                      <p className="font-body text-xs font-semibold text-cyan-300 mb-1">③ Sifat Penjumlahan & Pengurangan Akar (Suku Sejenis)</p>
                      <BlockMath math="p\sqrt{a} + q\sqrt{a} = (p+q)\sqrt{a}" />
                      <BlockMath math="p\sqrt{a} - q\sqrt{a} = (p-q)\sqrt{a}" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="font-body text-xs font-semibold text-green-300 mb-1">④ Sifat Pangkat Akar</p>
                      <BlockMath math="\left(\sqrt{a}\right)^2 = a, \quad a \geq 0" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Perhatian:</strong> Penjumlahan dan pengurangan hanya bisa dilakukan jika radicand-nya <em>sama</em>! <InlineMath math="\sqrt{2} + \sqrt{3} \neq \sqrt{5}" /> — ini kesalahan umum!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title="📝 Contoh Soal — Sifat-Sifat Operasi Bentuk Akar" />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">Hitunglah: <InlineMath math="\sqrt{6} \times \sqrt{24}" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Gunakan sifat perkalian akar:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sqrt{6} \times \sqrt{24} = \sqrt{6 \times 24} = \sqrt{144} = 12" />
                      </div>
                      <p><strong className="text-primary">Hasil: 12</strong></p>
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
                      Hitung dan sederhanakan: <InlineMath math="(\sqrt{3} + 2\sqrt{5})(3\sqrt{3} - \sqrt{5})" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Kali seperti perkalian aljabar (distributif):</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="= \sqrt{3} \cdot 3\sqrt{3} + \sqrt{3} \cdot (-\sqrt{5}) + 2\sqrt{5} \cdot 3\sqrt{3} + 2\sqrt{5} \cdot (-\sqrt{5})" />
                        <BlockMath math="= 3(\sqrt{3})^2 - \sqrt{15} + 6\sqrt{15} - 2(\sqrt{5})^2" />
                        <BlockMath math="= 3(3) + 5\sqrt{15} - 2(5)" />
                        <BlockMath math="= 9 + 5\sqrt{15} - 10 = -1 + 5\sqrt{15}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="5\sqrt{15} - 1" /></strong></p>
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
                      Buktikan bahwa <InlineMath math="(\sqrt{5} + \sqrt{3})^2 - (\sqrt{5} - \sqrt{3})^2 = 4\sqrt{15}" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Gunakan identitas <InlineMath math="(A+B)^2 - (A-B)^2 = 4AB" /> dengan <InlineMath math="A = \sqrt{5}, B = \sqrt{3}" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="(\sqrt{5} + \sqrt{3})^2 = 5 + 2\sqrt{15} + 3 = 8 + 2\sqrt{15}" />
                        <BlockMath math="(\sqrt{5} - \sqrt{3})^2 = 5 - 2\sqrt{15} + 3 = 8 - 2\sqrt{15}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Kurangkan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(8 + 2\sqrt{15}) - (8 - 2\sqrt{15}) = 4\sqrt{15} \quad \checkmark" />
                      </div>
                      <p><strong className="text-primary">Terbukti!</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 5: MERASIONALKAN BENTUK AKAR ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep5" icon={<Target className="w-5 h-5" />} iconColor="text-pink-400" title="📘 Sub-Bab 5: Merasionalkan Bentuk Akar" />
            {expandedSections.includes("konsep5") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-pink-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-pink-300">Merasionalkan penyebut</strong> artinya mengubah pecahan yang penyebutnya mengandung bentuk akar menjadi bentuk yang penyebutnya rasional (tanpa akar).
                    Caranya: kalikan pembilang dan penyebut dengan <strong>sekawan (conjugate)</strong>-nya.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-pink-500">
                      <p className="font-body text-xs font-semibold text-pink-300 mb-2">① Penyebut: <InlineMath math="\sqrt{a}" /></p>
                      <BlockMath math="\frac{p}{\sqrt{a}} = \frac{p}{\sqrt{a}} \times \frac{\sqrt{a}}{\sqrt{a}} = \frac{p\sqrt{a}}{a}" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-fuchsia-500">
                      <p className="font-body text-xs font-semibold text-fuchsia-300 mb-2">② Penyebut: <InlineMath math="p + \sqrt{q}" /> (kalikan dengan sekawannya <InlineMath math="p - \sqrt{q}" />)</p>
                      <BlockMath math="\frac{k}{p + \sqrt{q}} \times \frac{p - \sqrt{q}}{p - \sqrt{q}} = \frac{k(p - \sqrt{q})}{p^2 - q}" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-purple-500">
                      <p className="font-body text-xs font-semibold text-purple-300 mb-2">③ Penyebut: <InlineMath math="\sqrt{p} + \sqrt{q}" /> (kalikan dengan <InlineMath math="\sqrt{p} - \sqrt{q}" />)</p>
                      <BlockMath math="\frac{k}{\sqrt{p}+\sqrt{q}} \times \frac{\sqrt{p}-\sqrt{q}}{\sqrt{p}-\sqrt{q}} = \frac{k(\sqrt{p}-\sqrt{q})}{p - q}" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Kunci Sekawan:</strong> Sekawan dari <InlineMath math="(a + b)" /> adalah <InlineMath math="(a - b)" />, dan berlaku juga sebaliknya.
                    Perkalian keduanya menghasilkan selisih kuadrat: <InlineMath math="(a+b)(a-b) = a^2 - b^2" />. Itulah cara akar hilang dari penyebut!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh5" icon={<Calculator className="w-5 h-5" />} iconColor="text-pink-400" title="📝 Contoh Soal — Merasionalkan Bentuk Akar" />
            {expandedSections.includes("contoh5") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rasionalkan penyebut: <InlineMath math="\dfrac{6}{\sqrt{3}}" />
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Kalikan dengan <InlineMath math="\dfrac{\sqrt{3}}{\sqrt{3}}" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{6}{\sqrt{3}} \times \frac{\sqrt{3}}{\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="2\sqrt{3}" /></strong></p>
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
                      Rasionalkan penyebut: <InlineMath math="\dfrac{4}{3 - \sqrt{5}}" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Sekawan dari <InlineMath math="3 - \sqrt{5}" /> adalah <InlineMath math="3 + \sqrt{5}" />. Kalikan:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\frac{4}{3 - \sqrt{5}} \times \frac{3 + \sqrt{5}}{3 + \sqrt{5}} = \frac{4(3 + \sqrt{5})}{3^2 - (\sqrt{5})^2}" />
                        <BlockMath math="= \frac{4(3 + \sqrt{5})}{9 - 5} = \frac{4(3 + \sqrt{5})}{4} = 3 + \sqrt{5}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="3 + \sqrt{5}" /></strong></p>
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
                      Rasionalkan dan sederhanakan: <InlineMath math="\dfrac{\sqrt{7} + \sqrt{2}}{\sqrt{7} - \sqrt{2}}" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Kalikan dengan sekawan penyebutnya <InlineMath math="(\sqrt{7}+\sqrt{2})" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\frac{(\sqrt{7}+\sqrt{2})^2}{(\sqrt{7})^2-(\sqrt{2})^2} = \frac{7 + 2\sqrt{14} + 2}{7 - 2}" />
                        <BlockMath math="= \frac{9 + 2\sqrt{14}}{5}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="\dfrac{9 + 2\sqrt{14}}{5}" /></strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===================== SUB-BAB 6: MENYEDERHANAKAN √(a+b)±2ab ===================== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep6" icon={<Target className="w-5 h-5" />} iconColor="text-teal-400" title="📘 Sub-Bab 6: Menyederhanakan Bentuk √(a+b) ± 2√(ab)" />
            {expandedSections.includes("konsep6") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-teal-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bentuk khusus ini muncul dari pola kuadrat sempurna binomial yang melibatkan akar.
                    Dasarnya adalah identitas:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3 text-center">
                    <BlockMath math="(\sqrt{a} + \sqrt{b})^2 = a + b + 2\sqrt{ab}" />
                    <BlockMath math="(\sqrt{a} - \sqrt{b})^2 = a + b - 2\sqrt{ab}" />
                  </div>
                  <p className="font-body text-sm text-white/80">Maka berlaku kebalikannya:</p>
                  <div className="space-y-2">
                    <div className="bg-teal-900/40 border border-teal-500/40 rounded-lg p-3 text-center">
                      <BlockMath math="\sqrt{a + b + 2\sqrt{ab}} = \sqrt{a} + \sqrt{b}" />
                    </div>
                    <div className="bg-teal-900/40 border border-teal-500/40 rounded-lg p-3 text-center">
                      <BlockMath math="\sqrt{a + b - 2\sqrt{ab}} = \sqrt{a} - \sqrt{b} \quad (\text{dengan } a > b)" />
                    </div>
                  </div>
                </div>

                {/* Strategi */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔑 STRATEGI PENYELESAIAN:</p>
                  <ol className="space-y-2 font-body text-sm text-white/80 list-decimal list-inside">
                    <li>Identifikasi suku <InlineMath math="(a+b)" /> dan suku <InlineMath math="2\sqrt{ab}" />.</li>
                    <li>Tentukan nilai <InlineMath math="a \cdot b" /> dari suku akar tengah: <InlineMath math="2\sqrt{ab} \Rightarrow ab = \left(\frac{\text{koef.}}{2}\right)^2 \cdot (\text{radicand})" />.</li>
                    <li>Cari dua bilangan yang <strong>jumlahnya = (a+b)</strong> dan <strong>hasilkalinya = ab</strong>.</li>
                    <li>Gunakan rumus penyederhanaan di atas.</li>
                  </ol>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Cepat:</strong> Jika menemui <InlineMath math="\sqrt{c \pm 2\sqrt{d}}" />, cari dua bilangan <InlineMath math="a" /> dan <InlineMath math="b" /> sehingga <InlineMath math="a + b = c" /> dan <InlineMath math="ab = d" />. Selesai!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 6 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh6" icon={<Calculator className="w-5 h-5" />} iconColor="text-teal-400" title="📝 Contoh Soal — Menyederhanakan √(a+b) ± 2√(ab)" />
            {expandedSections.includes("contoh6") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sederhanakan: <InlineMath math="\sqrt{7 + 2\sqrt{12}}" />
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Ubah <InlineMath math="2\sqrt{12} = 2\sqrt{4 \times 3} = 4\sqrt{3}" />. Jadi:</p>
                      <p className="text-white/60 text-xs">Kita punya: <InlineMath math="\sqrt{7 + 2\sqrt{12}}" /> → perlu <InlineMath math="a + b = 7" /> dan <InlineMath math="ab = 12" /></p>
                      <p><strong>Langkah 2:</strong> Cari <InlineMath math="a" /> dan <InlineMath math="b" />: dua bilangan berjumlah 7 dan berhasil kali 12 → <InlineMath math="a = 4, b = 3" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sqrt{7 + 2\sqrt{12}} = \sqrt{4 + 3 + 2\sqrt{4 \times 3}} = \sqrt{4} + \sqrt{3} = 2 + \sqrt{3}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="2 + \sqrt{3}" /></strong></p>
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
                      Sederhanakan: <InlineMath math="\sqrt{11 - 2\sqrt{30}}" />
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Identifikasi: <InlineMath math="a + b = 11" /> dan <InlineMath math="ab = 30" /></p>
                      <p><strong>Langkah 2:</strong> Cari dua bilangan: berjumlah 11 dan berhasil kali 30 → <InlineMath math="a = 6, b = 5" /></p>
                      <p><strong>Langkah 3:</strong> Karena tanda −, gunakan: <InlineMath math="\sqrt{a} - \sqrt{b}" /> dengan <InlineMath math="a > b" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\sqrt{11 - 2\sqrt{30}} = \sqrt{6} - \sqrt{5}" />
                      </div>
                      <p className="text-white/60 text-xs">Verifikasi: <InlineMath math="(\sqrt{6}-\sqrt{5})^2 = 6 + 5 - 2\sqrt{30} = 11 - 2\sqrt{30}" /> ✓</p>
                      <p><strong className="text-primary">Hasil: <InlineMath math="\sqrt{6} - \sqrt{5}" /></strong></p>
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
                      Sederhanakan dan hitunglah: <InlineMath math="\sqrt{9 + 4\sqrt{5}} + \sqrt{9 - 4\sqrt{5}}" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Ubah <InlineMath math="4\sqrt{5} = 2\sqrt{20}" />. Cari <InlineMath math="a + b = 9" /> dan <InlineMath math="ab = 20" />:</p>
                      <p className="text-white/60 text-xs">Dua bilangan berjumlah 9 dan berhasil kali 20 → <InlineMath math="a = 5, b = 4" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\sqrt{9 + 4\sqrt{5}} = \sqrt{5 + 4 + 2\sqrt{20}} = \sqrt{5} + \sqrt{4} = \sqrt{5} + 2" />
                        <BlockMath math="\sqrt{9 - 4\sqrt{5}} = \sqrt{5} - \sqrt{4} = \sqrt{5} - 2" />
                      </div>
                      <p><strong>Langkah 2:</strong> Jumlahkan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(\sqrt{5} + 2) + (\sqrt{5} - 2) = 2\sqrt{5}" />
                      </div>
                      <p><strong className="text-primary">Hasil: <InlineMath math="2\sqrt{5}" /></strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Rangkuman */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-cyan-300 text-center">🌟 RANGKUMAN MATERI</p>
            <div className="space-y-2 font-body text-xs text-white/80">
              <p>✅ <strong>Bentuk akar:</strong> <InlineMath math="\sqrt[n]{a} = a^{1/n}" /> — akar adalah pangkat pecahan</p>
              <p>✅ <strong>Menyederhanakan:</strong> uraikan bilangan dalam akar menjadi faktor kuadrat sempurna</p>
              <p>✅ <strong>Operasi sejenis:</strong> <InlineMath math="a\sqrt{c} \pm b\sqrt{c} = (a \pm b)\sqrt{c}" /> — koefisiennya dioperasikan</p>
              <p>✅ <strong>Perkalian akar:</strong> <InlineMath math="\sqrt{a} \times \sqrt{b} = \sqrt{ab}" /></p>
              <p>✅ <strong>Merasionalkan penyebut:</strong> kalikan dengan <em>sekawan</em> agar penyebut bebas dari akar</p>
            </div>
          </div>

          {/* Tips dan Trik */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/40 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-5 py-4 flex items-center gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <p className="font-display text-base font-bold text-yellow-300 leading-tight">Akar Itu Bukan Musuh — Ini Rahasianya!</p>
                <p className="font-body text-xs text-yellow-200/70">Tips & trik agar operasi bentuk akar terasa mudah</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3 font-body text-sm text-white/80">
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Sederhanakan dulu, hitung kemudian!</strong> Sebelum menjumlah atau mengalikan, sederhanakan setiap akar. <InlineMath math="\sqrt{50} = 5\sqrt{2}" /> jauh lebih mudah diolah daripada membiarkan angkanya besar.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Akar beda TIDAK bisa langsung dijumlah!</strong> <InlineMath math="\sqrt{2} + \sqrt{3} \neq \sqrt{5}" /> — ini kesalahan paling sering! Penjumlahan hanya bisa jika bentuk akarnya sama.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Sekawan = ganti tanda tengah.</strong> Sekawan dari <InlineMath math="a + \sqrt{b}" /> adalah <InlineMath math="a - \sqrt{b}" />. Kalikan keduanya dan gunakan selisih kuadrat: <InlineMath math="(a+b)(a-b) = a^2 - b^2" />.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 text-base mt-0.5">💡</span>
                <p><strong className="text-yellow-300">Cek dengan kuadratkan hasilmu.</strong> Cara paling mudah memverifikasi jawaban bentuk akar adalah dengan mengkuadratkannya kembali — jika dapat bilangan bulat, jawabanmu kemungkinan besar benar!</p>
              </div>
            </div>
          </div>

          {/* Tombol Kembali */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bilangan-berpangkat"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              Kembali ke Bilangan Berpangkat
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BentukAkarPage;
