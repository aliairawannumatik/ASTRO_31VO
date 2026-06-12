import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PerbandinganCampuranPage = () => {
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
          PERBANDINGAN CAMPURAN (PENGAYAAN)
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
                <span className="font-body font-semibold text-white">Apa Itu Perbandingan Campuran?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Perbandingan campuran muncul ketika <strong className="text-primary">tiga variabel atau lebih</strong> saling terkait secara bersamaan — melibatkan gabungan antara hubungan senilai dan berbalik nilai dalam satu soal.
                  Ini paling sering muncul dalam soal bertema <strong className="text-yellow-300">Pekerja–Waktu–Hasil</strong>.
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-white mb-1">Logika di Balik Perbandingan Campuran:</p>
                  <div className="space-y-2 font-body text-sm text-white/70">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold mt-0.5">↑↑</span>
                      <p><strong className="text-green-300">Pekerja vs Hasil (Senilai):</strong> Pekerja makin banyak → hasil produksi makin banyak.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">↑↓</span>
                      <p><strong className="text-red-300">Pekerja vs Waktu (Berbalik):</strong> Pekerja makin banyak → waktu yang dibutuhkan makin singkat.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold mt-0.5">↑↑</span>
                      <p><strong className="text-green-300">Waktu vs Hasil (Senilai):</strong> Waktu makin lama → hasil produksi makin banyak.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Perbandingan campuran tidak bisa diselesaikan hanya dengan satu jenis perbandingan. Kita butuh rumus gabungan!
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
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus Campuran</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Cara paling efisien menyelesaikan perbandingan campuran adalah dengan <strong className="text-primary">Rumus Kerja</strong> berikut. Rumus ini menggabungkan ketiga variabel sekaligus:
                </p>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">Rumus Perbandingan Campuran:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\frac{O_1 \times T_1}{H_1} = \frac{O_2 \times T_2}{H_2}" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-purple-500/20">
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">Simbol</th>
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">Nama</th>
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">Contoh</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-purple-500/20">
                        <td className="px-3 py-2 font-mono text-purple-300"><InlineMath math="O" /></td>
                        <td className="px-3 py-2">Objek / Orang</td>
                        <td className="px-3 py-2">Pekerja, mesin, hewan</td>
                      </tr>
                      <tr className="border border-purple-500/20 bg-slate-800/30">
                        <td className="px-3 py-2 font-mono text-purple-300"><InlineMath math="T" /></td>
                        <td className="px-3 py-2">Waktu</td>
                        <td className="px-3 py-2">Jam, hari, minggu</td>
                      </tr>
                      <tr className="border border-purple-500/20">
                        <td className="px-3 py-2 font-mono text-purple-300"><InlineMath math="H" /></td>
                        <td className="px-3 py-2">Hasil</td>
                        <td className="px-3 py-2">Baju, meter jembatan, lubang</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>Cara Membaca Rumus:</strong> "Satu tim (O pekerja selama T waktu) menghasilkan H hasil." Kedua kondisi dibandingkan menggunakan proporsi. Yang belum diketahui (biasanya ada satu variabel) dicari dengan perkalian silang.
                  </p>
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
                    <span className="font-body font-semibold text-white">Contoh 1 – Mencari Hasil Produksi</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebanyak 4 orang penjahit mampu menghasilkan 48 baju dalam waktu 6 hari.
                      Jika jumlah penjahit ditambah menjadi 6 orang dan waktu kerja diperpanjang menjadi 9 hari, berapa baju yang bisa dihasilkan?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Identifikasi:</strong> <InlineMath math="O_1 = 4,\ T_1 = 6,\ H_1 = 48,\ O_2 = 6,\ T_2 = 9,\ H_2 = x" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{O_1 \times T_1}{H_1} = \frac{O_2 \times T_2}{H_2}" />
                        <BlockMath math="\frac{4 \times 6}{48} = \frac{6 \times 9}{x}" />
                        <BlockMath math="\frac{24}{48} = \frac{54}{x} \Rightarrow \frac{1}{2} = \frac{54}{x}" />
                        <BlockMath math="x = 54 \times 2 = 108 \text{ baju}" />
                      </div>
                      <p className="text-primary font-semibold">Hasil produksi = <strong>108 baju</strong></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Mencari Jumlah Pekerja</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebanyak 8 orang pekerja dapat membangun tembok sepanjang 120 meter dalam waktu 10 hari.
                      Jika kontraktor ingin membangun tembok 300 meter dalam waktu 15 hari, berapa pekerja yang dibutuhkan?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Identifikasi:</strong> <InlineMath math="O_1 = 8,\ T_1 = 10,\ H_1 = 120,\ O_2 = x,\ T_2 = 15,\ H_2 = 300" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{8 \times 10}{120} = \frac{x \times 15}{300}" />
                        <BlockMath math="\frac{80}{120} = \frac{15x}{300}" />
                        <BlockMath math="\frac{2}{3} = \frac{15x}{300} \Rightarrow 3 \times 15x = 2 \times 300" />
                        <BlockMath math="45x = 600 \Rightarrow x = \frac{600}{45} = \frac{40}{3} \approx 13{,}3 \approx 14 \text{ orang}" />
                      </div>
                      <p className="text-primary font-semibold">Dibutuhkan <strong>14 pekerja</strong> (dibulatkan ke atas).</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Mencari Waktu yang Dibutuhkan</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah pabrik dengan 12 mesin dapat memproduksi 360 unit barang dalam waktu 5 hari.
                      Jika 3 mesin mengalami kerusakan dan tidak bisa dioperasikan, berapa hari yang dibutuhkan untuk tetap menghasilkan 480 unit barang?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Perhatikan:</strong> Mesin yang beroperasi berkurang menjadi <InlineMath math="12 - 3 = 9" /> mesin.</p>
                      <p><strong>Identifikasi:</strong> <InlineMath math="O_1 = 12,\ T_1 = 5,\ H_1 = 360,\ O_2 = 9,\ T_2 = x,\ H_2 = 480" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{12 \times 5}{360} = \frac{9 \times x}{480}" />
                        <BlockMath math="\frac{60}{360} = \frac{9x}{480}" />
                        <BlockMath math="\frac{1}{6} = \frac{9x}{480} \Rightarrow 9x = \frac{480}{6} = 80" />
                        <BlockMath math="x = \frac{80}{9} \approx 8{,}9 \approx 9 \text{ hari}" />
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="text-white/70 text-xs mb-1">Analisis logika:</p>
                        <p className="text-white/80">Mesin berkurang (12 → 9) <strong className="text-red-300">dan</strong> target naik (360 → 480 unit). Kedua faktor ini membuat waktu jadi lebih lama. Hasilnya masuk akal: dari 5 hari menjadi ~9 hari.</p>
                      </div>
                      <p className="text-primary font-semibold">Dibutuhkan sekitar <strong>9 hari</strong> untuk menghasilkan 480 unit.</p>
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

export default PerbandinganCampuranPage;
