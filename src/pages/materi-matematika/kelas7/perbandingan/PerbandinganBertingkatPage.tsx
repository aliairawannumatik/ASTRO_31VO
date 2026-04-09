import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PerbandinganBertingkatPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh"]);

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
          PERBANDINGAN BERTINGKAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Perbandingan - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* SECTION: PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Apa Itu Perbandingan Bertingkat?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-primary">Perbandingan bertingkat</strong> muncul ketika dua perbandingan berbeda dihubungkan melalui satu <strong className="text-cyan-300">variabel perantara</strong>.
                  Misalnya, diketahui A : B dan B : C — maka B adalah variabel perantara yang menghubungkan A dan C.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-blue-300 mb-2">Contoh Masalah</p>
                    <p className="font-body text-sm text-white/70">
                      <InlineMath math="A : B = 2 : 3" /> dan <InlineMath math="B : C = 4 : 5" />.
                      Berapakah <InlineMath math="A : B : C" />?
                    </p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">Kunci Utama</p>
                    <p className="font-body text-sm text-white/70">
                      Samakan nilai B di kedua perbandingan menggunakan <strong className="text-purple-300">KPK</strong>, lalu gabungkan menjadi satu rasio <InlineMath math="A : B : C" />.
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Catatan:</strong> Jika nilai perantara sudah sama di kedua perbandingan, tidak perlu menggunakan KPK — langsung gabungkan saja!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: RINGKASAN INTISARI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("konsep")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Langkah-Langkah Penyelesaian</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/60 mb-3">LANGKAH-LANGKAH:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="flex gap-3">
                      <span className="text-cyan-300 font-bold shrink-0">1.</span>
                      <p><strong className="text-cyan-300">Temukan variabel perantara</strong> — variabel yang muncul di kedua perbandingan.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-cyan-300 font-bold shrink-0">2.</span>
                      <p><strong className="text-cyan-300">Cari KPK</strong> dari angka variabel perantara di kedua perbandingan.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-cyan-300 font-bold shrink-0">3.</span>
                      <p><strong className="text-cyan-300">Kalikan</strong> masing-masing perbandingan sehingga nilai perantara menjadi sama (= KPK).</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-cyan-300 font-bold shrink-0">4.</span>
                      <p><strong className="text-cyan-300">Gabungkan</strong> menjadi satu rasio <InlineMath math="A : B : C" />.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-cyan-300 font-bold shrink-0">5.</span>
                      <p><strong className="text-cyan-300">Gunakan</strong> jumlah/selisih angka rasio untuk mencari nilai yang ditanyakan.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">Rumus Cepat:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Nilai}_x = \frac{\text{angka rasio}_x}{\text{total/selisih rasio}} \times \text{total/selisih yang diketahui}" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-body text-xs text-white/70">
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-green-300 font-semibold mb-1">Jika diketahui JUMLAH:</p>
                      <p>Gunakan jumlah seluruh angka rasio sebagai pembagi.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-yellow-300 font-semibold mb-1">Jika diketahui SELISIH:</p>
                      <p>Gunakan selisih dua angka rasio yang bersangkutan sebagai pembagi.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              {expandedSections.includes("contoh") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 – Nilai Perantara Sudah Sama</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Uang Adi : Beni = <InlineMath math="2 : 3" /> dan uang Beni : Candra = <InlineMath math="3 : 4" />.
                      Jika jumlah uang ketiganya adalah Rp180.000, tentukan uang masing-masing!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Variabel perantara = Beni. Nilai Beni di kedua perbandingan = <InlineMath math="3" /> (sudah sama, tidak perlu KPK).</p>
                      <p><strong>Langkah 2:</strong> Langsung gabungkan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Adi} : \text{Beni} : \text{Candra} = 2 : 3 : 4" />
                      </div>
                      <p><strong>Langkah 3:</strong> Total rasio <InlineMath math="= 2 + 3 + 4 = 9" /> bagian.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="1 \text{ bagian} = \frac{180.000}{9} = \text{Rp20.000}" />
                      </div>
                      <p><strong>Langkah 4:</strong> Hitung uang masing-masing:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Adi} = 2 \times 20.000 = \text{Rp40.000}" />
                        <BlockMath math="\text{Beni} = 3 \times 20.000 = \text{Rp60.000}" />
                        <BlockMath math="\text{Candra} = 4 \times 20.000 = \text{Rp80.000}" />
                      </div>
                      <p className="text-primary font-semibold">Cek: <InlineMath math="40.000 + 60.000 + 80.000 = 180.000" /> ✓</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Perlu KPK, Diketahui Selisih</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Kelereng Anto : Budi = <InlineMath math="3 : 4" /> dan kelereng Budi : Cepi = <InlineMath math="2 : 5" />.
                      Jika selisih kelereng Anto dan Cepi adalah 14 butir, tentukan kelereng Budi!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Variabel perantara = Budi. Nilai Budi di dua perbandingan: <InlineMath math="4" /> dan <InlineMath math="2" />. KPK(4, 2) = 4.</p>
                      <p><strong>Langkah 2:</strong> Sesuaikan kedua perbandingan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-white/60 text-xs mb-1">Anto : Budi = 3 : 4 (sudah 4, tidak perlu dikali)</p>
                        <BlockMath math="3 : 4" />
                        <p className="text-white/60 text-xs mb-1">Budi : Cepi = 2 : 5 → dikali 2 → (Budi menjadi 4)</p>
                        <BlockMath math="4 : 10" />
                      </div>
                      <p><strong>Langkah 3:</strong> Gabungkan → Anto : Budi : Cepi = <InlineMath math="3 : 4 : 10" /></p>
                      <p><strong>Langkah 4:</strong> Selisih Cepi dan Anto: <InlineMath math="10 - 3 = 7" /> bagian = 14 butir.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="1 \text{ bagian} = \frac{14}{7} = 2 \text{ butir}" />
                      </div>
                      <p><strong>Langkah 5:</strong> Kelereng Budi:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Budi} = 4 \times 2 = 8 \text{ butir}" />
                      </div>
                      <p className="text-primary font-semibold">Kelereng Budi = <strong>8 butir</strong>. Cek: Anto=6, Cepi=20, selisih=14 ✓</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – KPK, Selisih Ujung, Tanya Total</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Modal usaha Adi : Budi = <InlineMath math="3 : 4" /> dan modal Budi : Candra = <InlineMath math="6 : 5" />.
                      Jika selisih modal Adi dan Candra adalah Rp35.000, tentukan:
                    </p>
                    <ul className="list-disc list-inside font-body text-sm text-white/80 mt-2 space-y-1">
                      <li>Modal masing-masing</li>
                      <li>Total modal ketiganya</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Variabel perantara = Budi. Nilai Budi: <InlineMath math="4" /> dan <InlineMath math="6" />. KPK(4, 6) = 12.</p>
                      <p><strong>Langkah 2:</strong> Sesuaikan perbandingan agar nilai Budi menjadi 12:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-white/60 text-xs mb-1">Adi : Budi = 3 : 4 → dikali 3 → 9 : 12</p>
                        <p className="text-white/60 text-xs mb-1">Budi : Candra = 6 : 5 → dikali 2 → 12 : 10</p>
                        <BlockMath math="\text{Adi} : \text{Budi} : \text{Candra} = 9 : 12 : 10" />
                      </div>
                      <p><strong>Langkah 3:</strong> Selisih Candra – Adi: <InlineMath math="10 - 9 = 1" /> bagian = Rp35.000.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="1 \text{ bagian} = \text{Rp35.000}" />
                      </div>
                      <p><strong>Langkah 4:</strong> Modal masing-masing:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Adi} = 9 \times 35.000 = \text{Rp315.000}" />
                        <BlockMath math="\text{Budi} = 12 \times 35.000 = \text{Rp420.000}" />
                        <BlockMath math="\text{Candra} = 10 \times 35.000 = \text{Rp350.000}" />
                      </div>
                      <p><strong>Langkah 5:</strong> Total modal:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Total} = (9+12+10) \times 35.000 = 31 \times 35.000 = \text{Rp1.085.000}" />
                      </div>
                      <p className="text-primary font-semibold">Cek selisih: <InlineMath math="350.000 - 315.000 = 35.000" /> ✓</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/perbandingan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Perbandingan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganBertingkatPage;
