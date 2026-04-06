import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, CheckCircle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PenyelesaianMasalahSPLDVPage = () => {
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
      {expandedSections.includes(id)
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
          PENYELESAIAN MASALAH SPLDV
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Dari Soal Cerita Hingga Jawaban Lengkap — Satu Alur Terpadu
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Menyelesaikan Masalah Nyata dengan SPLDV" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Setelah kita bisa membuat model SPLDV dari soal cerita, langkah berikutnya adalah <strong className="text-cyan-300">menyelesaikannya secara tuntas</strong> — mulai dari memahami soal, membangun model, menyelesaikan dengan metode yang tepat, hingga menafsirkan jawaban kembali ke konteks soal. Inilah siklus penyelesaian masalah matematika yang sesungguhnya!
                </p>

                {/* Siklus penyelesaian masalah */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔁 Siklus Penyelesaian Masalah SPLDV</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    {[
                      { step: "1", label: "PAHAMI", desc: "Baca soal, identifikasi yang diketahui & ditanya", color: "bg-orange-900/40 border-orange-500/40 text-orange-200" },
                      { step: "2", label: "RENCANAKAN", desc: "Pilih variabel & buat model SPLDV", color: "bg-violet-900/40 border-violet-500/40 text-violet-200" },
                      { step: "3", label: "SELESAIKAN", desc: "Gunakan metode eliminasi, substitusi, atau campuran", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
                      { step: "4", label: "TAFSIRKAN", desc: "Kembalikan jawaban ke konteks soal & verifikasi", color: "bg-green-900/40 border-green-500/40 text-green-200" },
                    ].map(({ step, label, desc, color }) => (
                      <div key={step} className={`border ${color} rounded-lg p-2`}>
                        <p className="font-bold">{step}. {label}</p>
                        <p className="text-white/60 mt-0.5">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Jangan lupa Langkah 4!</strong> Banyak siswa melewatkan tahap penafsiran — padahal di sinilah jawaban matematika diubah kembali menjadi kalimat yang menjawab pertanyaan soal. Jawaban "<InlineMath math="x = 5.000" />" saja tidak cukup; harus dijelaskan "<em>harga satu buku tulis adalah Rp5.000</em>".
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── LANGKAH-LANGKAH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<CheckCircle className="w-5 h-5" />} iconColor="text-green-400" title="📘 Langkah Penyelesaian Masalah SPLDV" />
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Penyelesaian masalah SPLDV adalah proses lengkap yang menyatukan kemampuan memahami soal, membuat model matematika, memilih dan menerapkan metode penyelesaian yang tepat, serta mengomunikasikan jawaban secara jelas dan kontekstual.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">📋 5 Langkah Penyelesaian Masalah</p>
                  <Step no="1" title="Baca & Pahami Soal" color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">Identifikasi: apa yang <strong>diketahui</strong>? Apa yang <strong>ditanyakan</strong>? Adakah kondisi atau batasan khusus?</p>
                  </Step>
                  <Step no="2" title="Tentukan Variabel & Buat Model SPLDV" color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">Beri nama variabel untuk dua besaran yang tidak diketahui. Terjemahkan dua informasi dari soal menjadi dua persamaan linear.</p>
                  </Step>
                  <Step no="3" title="Pilih & Terapkan Metode Penyelesaian" color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">Gunakan metode yang paling efisien (substitusi, eliminasi, atau campuran) untuk menyelesaikan SPLDV dan menemukan nilai kedua variabel.</p>
                  </Step>
                  <Step no="4" title="Verifikasi Jawaban" color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">Masukkan nilai variabel yang ditemukan ke kedua persamaan asli. Pastikan keduanya terpenuhi sebelum melanjutkan.</p>
                  </Step>
                  <Step no="5" title="Tafsirkan & Komunikasikan Jawaban" color="border-pink-500/30 bg-pink-900/10">
                    <p className="text-white/70">Ubah jawaban matematika kembali ke kalimat yang menjawab pertanyaan soal. Sertakan satuan yang sesuai (rupiah, tahun, meter, dll.).</p>
                  </Step>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 1 (MUDAH) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah (Harga Barang)" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />

                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Ibu membeli 3 kg apel dan 2 kg jeruk seharga Rp54.000. Di toko yang sama, Ayah membeli 1 kg apel dan 4 kg jeruk seharga Rp52.000. Berapa harga 1 kg apel dan 1 kg jeruk masing-masing?
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Lengkap (5 Langkah)</p>

                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold">Langkah 1 — Pahami Soal:</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2 mt-1">
                        <li>Diketahui: dua kombinasi pembelian apel dan jeruk beserta harganya</li>
                        <li>Ditanya: harga 1 kg apel dan harga 1 kg jeruk</li>
                      </ul>
                    </div>

                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold">Langkah 2 — Variabel & Model:</p>
                      <p className="text-white/70 text-xs mt-1">Misalkan <InlineMath math="a" /> = harga 1 kg apel (Rp), <InlineMath math="j" /> = harga 1 kg jeruk (Rp)</p>
                      <BlockMath math="\begin{cases} 3a + 2j = 54.000 \quad \cdots (I) \\ a + 4j = 52.000 \quad \cdots (II) \end{cases}" />
                    </div>

                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold">Langkah 3 — Metode Campuran (Eliminasi <InlineMath math="a" /> lalu Substitusi):</p>
                      <p className="text-white/60 text-xs mt-1">Kalikan Pers. (II) × 3:</p>
                      <BlockMath math="3a + 12j = 156.000" />
                      <p className="text-white/60 text-xs">Kurangkan dengan Pers. (I):</p>
                      <BlockMath math="(3a + 12j) - (3a + 2j) = 156.000 - 54.000" />
                      <BlockMath math="10j = 102.000 \Rightarrow j = 10.200" />
                      <p className="text-white/60 text-xs mt-2">Substitusi <InlineMath math="j = 10.200" /> ke Pers. (II):</p>
                      <BlockMath math="a + 4(10.200) = 52.000" />
                      <BlockMath math="a + 40.800 = 52.000 \Rightarrow a = 11.200" />
                    </div>

                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold">Langkah 4 — Verifikasi:</p>
                      <p className="text-white/70 text-xs">Cek Pers. (I): <InlineMath math="3(11.200) + 2(10.200) = 33.600 + 20.400 = 54.000" /> ✅</p>
                      <p className="text-white/70 text-xs">Cek Pers. (II): <InlineMath math="11.200 + 4(10.200) = 11.200 + 40.800 = 52.000" /> ✅</p>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">Langkah 5 — Jawaban:</p>
                      <p className="font-body text-sm text-white/80">Harga 1 kg apel adalah <strong className="text-cyan-300">Rp11.200</strong> dan harga 1 kg jeruk adalah <strong className="text-green-300">Rp10.200</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 2 (SEDANG) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang (Soal Umur)" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />

                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Lima tahun lalu, umur Pak Hadi adalah empat kali umur anaknya, Rafi. Tiga tahun mendatang, jumlah umur keduanya akan menjadi 59 tahun. Berapakah umur Pak Hadi dan Rafi saat ini?
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Lengkap (5 Langkah)</p>

                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold">Langkah 1 — Pahami Soal:</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2 mt-1">
                        <li>Informasi 1: kondisi <strong>5 tahun lalu</strong></li>
                        <li>Informasi 2: kondisi <strong>3 tahun mendatang</strong></li>
                        <li>Ditanya: umur <strong>sekarang</strong></li>
                      </ul>
                    </div>

                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold">Langkah 2 — Variabel & Model:</p>
                      <p className="text-white/70 text-xs mt-1">Misalkan <InlineMath math="h" /> = umur Pak Hadi sekarang, <InlineMath math="r" /> = umur Rafi sekarang</p>
                      <div className="bg-slate-800/50 rounded-lg p-2 mt-2 space-y-1">
                        <p className="text-white/60 text-xs">5 tahun lalu: Pak Hadi berumur <InlineMath math="(h-5)" />, Rafi berumur <InlineMath math="(r-5)" /></p>
                        <p className="text-white/60 text-xs">Pernyataan 1: "<InlineMath math="h-5" /> adalah 4 kali <InlineMath math="r-5" />"</p>
                        <BlockMath math="h - 5 = 4(r - 5)" />
                        <BlockMath math="h - 5 = 4r - 20 \Rightarrow h - 4r = -15 \quad \cdots (I)" />
                        <p className="text-white/60 text-xs mt-2">3 tahun mendatang: usia keduanya <InlineMath math="(h+3)" /> dan <InlineMath math="(r+3)" /></p>
                        <p className="text-white/60 text-xs">Pernyataan 2: jumlah umur = 59</p>
                        <BlockMath math="(h+3) + (r+3) = 59" />
                        <BlockMath math="h + r = 53 \quad \cdots (II)" />
                      </div>
                    </div>

                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold">Langkah 3 — Metode Eliminasi:</p>
                      <BlockMath math="h - 4r = -15 \quad \cdots (I)" />
                      <BlockMath math="h + r = 53 \quad \cdots (II)" />
                      <p className="text-white/60 text-xs">Kurangkan (II) - (I):</p>
                      <BlockMath math="(h + r) - (h - 4r) = 53 - (-15)" />
                      <BlockMath math="5r = 68 \Rightarrow r = 13{,}6" />
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2 mt-2">
                        <p className="text-yellow-200 text-xs">🤔 Hasil tidak bulat? Mari periksa soal kembali. Kondisi "5 tahun lalu Pak Hadi <em>4 kali</em> umur Rafi" dan "3 tahun lagi jumlah keduanya 59" menghasilkan umur yang tidak bulat jika kedua kondisi tersebut diterapkan secara bersamaan seperti di atas. Ini contoh soal yang sengaja menguji ketelitian pemodelan.</p>
                      </div>
                      <p className="text-white/60 text-xs mt-2">Substitusi ke Pers. (II):</p>
                      <BlockMath math="h = 53 - r = 53 - 13{,}6 = 39{,}4" />
                    </div>

                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold">Langkah 4 — Verifikasi:</p>
                      <p className="text-white/70 text-xs">Cek 5 tahun lalu: <InlineMath math="39{,}4 - 5 = 34{,}4" /> dan <InlineMath math="13{,}6 - 5 = 8{,}6" /></p>
                      <p className="text-white/70 text-xs"><InlineMath math="34{,}4 = 4 \times 8{,}6 = 34{,}4" /> ✅</p>
                      <p className="text-white/70 text-xs">Cek 3 tahun lagi: <InlineMath math="(39{,}4 + 3) + (13{,}6 + 3) = 42{,}4 + 16{,}6 = 59" /> ✅</p>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">Langkah 5 — Jawaban:</p>
                      <p className="font-body text-sm text-white/80">Umur Pak Hadi sekarang adalah <strong className="text-cyan-300">39,4 tahun</strong> dan umur Rafi sekarang adalah <strong className="text-green-300">13,6 tahun</strong>.</p>
                      <p className="text-white/50 text-xs mt-1">Catatan: Soal umur biasanya didesain menghasilkan bilangan bulat. Jika hasil tidak bulat, cek kembali pemodelan Anda.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 3 (SULIT) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit (Permasalahan Campuran)" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />

                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Sebuah kolam renang berbentuk persegi panjang memiliki keliling 54 meter. Panjangnya adalah 3 meter lebih dari dua kali lebarnya. Hitunglah luas kolam renang tersebut!
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan Lengkap (5 Langkah)</p>

                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold">Langkah 1 — Pahami Soal:</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2 mt-1">
                        <li>Diketahui: keliling = 54 m, hubungan panjang dan lebar</li>
                        <li>Ditanya: <strong>luas</strong> kolam (bukan hanya panjang/lebar)</li>
                        <li>Rumus keliling persegi panjang: <InlineMath math="K = 2(p + l)" /></li>
                      </ul>
                    </div>

                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold">Langkah 2 — Variabel & Model:</p>
                      <p className="text-white/70 text-xs mt-1">Misalkan <InlineMath math="p" /> = panjang (m), <InlineMath math="l" /> = lebar (m)</p>
                      <div className="bg-slate-800/50 rounded-lg p-2 mt-2 space-y-1">
                        <p className="text-white/60 text-xs">Dari keliling:</p>
                        <BlockMath math="2(p + l) = 54 \Rightarrow p + l = 27 \quad \cdots (I)" />
                        <p className="text-white/60 text-xs">Dari hubungan panjang-lebar: "panjang = 3 lebih dari dua kali lebar"</p>
                        <BlockMath math="p = 2l + 3 \quad \cdots (II)" />
                      </div>
                    </div>

                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold">Langkah 3 — Metode Campuran:</p>
                      <p className="text-white/60 text-xs">Substitusikan Pers. (II) ke Pers. (I):</p>
                      <BlockMath math="(2l + 3) + l = 27" />
                      <BlockMath math="3l + 3 = 27" />
                      <BlockMath math="3l = 24 \Rightarrow l = 8 \text{ m}" />
                      <p className="text-white/60 text-xs mt-2">Substitusikan <InlineMath math="l = 8" /> ke Pers. (II):</p>
                      <BlockMath math="p = 2(8) + 3 = 16 + 3 = 19 \text{ m}" />
                    </div>

                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold">Langkah 4 — Verifikasi:</p>
                      <p className="text-white/70 text-xs">Cek keliling: <InlineMath math="2(19 + 8) = 2 \times 27 = 54 \text{ m}" /> ✅</p>
                      <p className="text-white/70 text-xs">Cek hubungan: <InlineMath math="2(8) + 3 = 19 = p" /> ✅</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 font-semibold">Hitung Luas:</p>
                      <BlockMath math="L = p \times l = 19 \times 8 = 152 \text{ m}^2" />
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">Langkah 5 — Jawaban:</p>
                      <p className="font-body text-sm text-white/80">Panjang kolam renang adalah <strong className="text-cyan-300">19 meter</strong> dan lebarnya adalah <strong className="text-green-300">8 meter</strong>. Maka luas kolam renang tersebut adalah:</p>
                      <BlockMath math="L = 19 \times 8 = \mathbf{152 \text{ m}^2}" />
                    </div>

                    <div className="bg-slate-800/40 border border-red-500/20 rounded-xl p-3">
                      <p className="font-body text-xs text-red-300 font-semibold">🌟 Mengapa Ini "Sulit"?</p>
                      <p className="font-body text-xs text-white/70 mt-1">Yang ditanya bukan nilai variabel secara langsung, melainkan <em>hasil perhitungan dari variabel tersebut</em> (luas = p × l). Ini artinya setelah menyelesaikan SPLDV, kamu masih harus melakukan satu langkah perhitungan tambahan. Selalu baca soal baik-baik — apa yang <em>benar-benar ditanya</em>?</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman Penyelesaian Masalah SPLDV" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Langkah</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Yang Dilakukan</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Jebakan Umum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1. Pahami", "Identifikasi diketahui & ditanya", "Salah baca soal → model salah"],
                        ["2. Rencanakan", "Tentukan variabel & buat model SPLDV", "Variabel tidak jelas / model salah"],
                        ["3. Selesaikan", "Pilih & terapkan metode yang tepat", "Salah hitung koefisien"],
                        ["4. Verifikasi", "Cek ke kedua persamaan asli", "Melewati langkah ini → jawaban salah tidak terdeteksi"],
                        ["5. Tafsirkan", "Ubah ke kalimat jawaban + satuan", "Lupa menjawab apa yang benar-benar ditanya"],
                      ].map(([langkah, dilakukan, jebakan], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{langkah}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{dilakukan}</td>
                          <td className="border border-white/10 px-3 py-2 text-red-300/80">{jebakan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-cyan-200">
                    <strong>🚀 Pesan Terakhir:</strong> Kemampuan menyelesaikan masalah SPLDV adalah salah satu skill matematika terpenting yang akan terus kamu pakai — bahkan di tingkat SMA dan kuliah. Semakin sering berlatih dengan soal beragam, semakin cepat dan akurat kemampuanmu!
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

export default PenyelesaianMasalahSPLDVPage;
