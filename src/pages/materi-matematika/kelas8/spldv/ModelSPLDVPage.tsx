import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const ModelSPLDVPage = () => {
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
          MEMBUAT MODEL SPLDV
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Ubah Cerita Sehari-hari Menjadi Persamaan Matematika
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 8 · SPLDV · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Mengapa Perlu Membuat Model?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dalam kehidupan nyata, masalah tidak datang dalam bentuk persamaan siap pakai. Kita perlu "menerjemahkan" situasi nyata ke dalam bahasa matematika — inilah yang disebut <strong className="text-cyan-300">pemodelan matematika</strong>. Kemampuan ini adalah jembatan penting antara teori dan penerapan!
                </p>

                {/* Visual analogy */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔄 Proses Pemodelan</p>
                  <div className="flex flex-col gap-2 text-xs font-body">
                    <div className="bg-orange-800/40 border border-orange-500/40 rounded-lg px-3 py-2">
                      <p className="text-orange-200 font-bold">1. SITUASI NYATA</p>
                      <p className="text-white/60">Cerita / soal dalam kalimat</p>
                    </div>
                    <div className="flex justify-center"><div className="w-0.5 h-3 bg-white/20" /></div>
                    <div className="bg-violet-800/40 border border-violet-500/40 rounded-lg px-3 py-2">
                      <p className="text-violet-200 font-bold">2. IDENTIFIKASI VARIABEL</p>
                      <p className="text-white/60">Tentukan apa yang dicari, beri nama variabel</p>
                    </div>
                    <div className="flex justify-center"><div className="w-0.5 h-3 bg-white/20" /></div>
                    <div className="bg-cyan-800/40 border border-cyan-500/40 rounded-lg px-3 py-2">
                      <p className="text-cyan-200 font-bold">3. BUAT PERSAMAAN</p>
                      <p className="text-white/60">Terjemahkan setiap hubungan ke bentuk persamaan</p>
                    </div>
                    <div className="flex justify-center"><div className="w-0.5 h-3 bg-white/20" /></div>
                    <div className="bg-green-800/40 border border-green-500/40 rounded-lg px-3 py-2">
                      <p className="text-green-200 font-bold">4. MODEL SPLDV SIAP</p>
                      <p className="text-white/60">Dua persamaan dengan dua variabel</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Kunci Sukses Pemodelan:</strong> Baca soal minimal <em>dua kali</em>. Pertama untuk memahami situasinya, kedua untuk mengidentifikasi informasi yang bisa dijadikan persamaan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── LANGKAH-LANGKAH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Langkah-Langkah Membuat Model SPLDV" />
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Membuat model SPLDV adalah proses mengubah permasalahan verbal/nyata menjadi dua buah persamaan linear yang memuat dua variabel. Kunci utamanya: identifikasi <strong className="text-cyan-300">dua hal yang tidak diketahui</strong> dan <strong className="text-cyan-300">dua hubungan</strong> di antara keduanya.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">📋 4 Langkah Membuat Model</p>
                  <Step no="1" title="Identifikasi hal yang tidak diketahui" color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">Baca soal dan tentukan dua besaran yang diminta atau belum diketahui. Beri nama variabel yang jelas.</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <p className="text-white/60 text-xs">Contoh: "harga pensil" → <InlineMath math="x" />, "harga buku" → <InlineMath math="y" /></p>
                    </div>
                  </Step>
                  <Step no="2" title="Cari dua hubungan/informasi berbeda" color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">Dalam soal, cari dua pernyataan yang menghubungkan kedua variabel tersebut. Setiap pernyataan akan menjadi satu persamaan.</p>
                  </Step>
                  <Step no="3" title="Terjemahkan ke persamaan matematika" color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">Ubah setiap pernyataan menjadi persamaan linear. Gunakan kata-kata kunci: "jumlah" = tambah, "selisih" = kurang, "kali" = perkalian, "sama dengan" = tanda =.</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <p className="text-white/60 text-xs">Tabel kata kunci:</p>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {[["jumlah / dan / ditambah", "+"], ["selisih / dikurangi", "−"], ["kali / hasil kali", "×"], ["dibagi", "÷"], ["sama dengan / adalah", "="]].map(([kata, simbol]) => (
                          <div key={kata} className="flex gap-1 items-center">
                            <span className="text-white/50 text-xs">"{kata}"</span>
                            <span className="text-cyan-300 text-xs font-bold">{simbol}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Step>
                  <Step no="4" title="Tuliskan model SPLDV secara lengkap" color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">Susun dua persamaan yang diperoleh dalam bentuk SPLDV yang siap diselesaikan. Periksa: sudah ada 2 variabel dan 2 persamaan yang berbeda?</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\begin{cases} \text{Persamaan 1 dari informasi pertama} \\ \text{Persamaan 2 dari informasi kedua} \end{cases}" />
                    </div>
                  </Step>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 1 (MUDAH) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah (Belanja di Toko)" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />

                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Nisa membeli 2 penghapus dan 3 penggaris seharga Rp13.000. Dinda membeli 1 penghapus dan 2 penggaris seharga Rp8.000. Buatlah model matematika dari permasalahan ini!
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan: Membuat Model</p>

                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 font-semibold">Langkah 1 — Tentukan Variabel:</p>
                      <p className="text-white/70">Misalkan:</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
                        <li><InlineMath math="x" /> = harga 1 penghapus (dalam rupiah)</li>
                        <li><InlineMath math="y" /> = harga 1 penggaris (dalam rupiah)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-violet-300 font-semibold">Langkah 2 — Identifikasi Dua Hubungan:</p>
                      <div className="bg-violet-900/20 rounded p-2 mt-1">
                        <p className="text-white/70 text-xs">Informasi 1 (dari Nisa): "2 penghapus dan 3 penggaris = Rp13.000"</p>
                        <p className="text-white/70 text-xs mt-1">Informasi 2 (dari Dinda): "1 penghapus dan 2 penggaris = Rp8.000"</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-green-300 font-semibold">Langkah 3 — Terjemahkan ke Persamaan:</p>
                      <BlockMath math="\text{Informasi 1} \Rightarrow 2x + 3y = 13.000" />
                      <BlockMath math="\text{Informasi 2} \Rightarrow x + 2y = 8.000" />
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">✅ Model SPLDV:</p>
                      <BlockMath math="\begin{cases} 2x + 3y = 13.000 \\ x + 2y = 8.000 \end{cases}" />
                      <p className="text-white/60 text-xs mt-1">dengan <InlineMath math="x" /> = harga penghapus, <InlineMath math="y" /> = harga penggaris</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 2 (SEDANG) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang (Umur & Selisih)" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />

                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Umur Budi sekarang adalah 3 tahun lebih tua dari Ani. Jika jumlah umur mereka berdua adalah 27 tahun, buatlah model SPLDV dari permasalahan ini!
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan: Membuat Model</p>

                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 font-semibold">Langkah 1 — Tentukan Variabel:</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
                        <li><InlineMath math="b" /> = umur Budi sekarang (tahun)</li>
                        <li><InlineMath math="a" /> = umur Ani sekarang (tahun)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-violet-300 font-semibold">Langkah 2 & 3 — Identifikasi & Terjemahkan:</p>
                      <div className="space-y-2">
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs">Informasi 1: "Budi 3 tahun lebih tua dari Ani"</p>
                          <p className="text-white/60 text-xs mt-0.5">→ Artinya: umur Budi = umur Ani + 3</p>
                          <BlockMath math="b = a + 3 \quad \text{atau} \quad b - a = 3" />
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs">Informasi 2: "Jumlah umur keduanya = 27 tahun"</p>
                          <BlockMath math="b + a = 27" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">✅ Model SPLDV:</p>
                      <BlockMath math="\begin{cases} b - a = 3 \\ b + a = 27 \end{cases}" />
                      <p className="text-white/60 text-xs mt-1">dengan <InlineMath math="b" /> = umur Budi, <InlineMath math="a" /> = umur Ani</p>
                    </div>

                    <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3">
                      <p className="font-body text-xs text-yellow-300 font-semibold">💡 Perhatikan!</p>
                      <p className="font-body text-xs text-white/70 mt-1">Frasa "lebih tua dari" berarti selisih positif. Jika soal mengatakan "lebih muda dari", maka tandanya berbeda. Selalu perhatikan arah perbandingannya!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 3 (SULIT) ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit (Campuran Persentase)" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />

                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Sebuah tempat parkir menampung kendaraan roda dua dan roda empat. Jumlah seluruh kendaraan ada 50 unit. Jumlah seluruh roda dari semua kendaraan ada 140 roda. Buatlah model SPLDV dari situasi ini!
                  </p>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan: Membuat Model</p>

                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 font-semibold">Langkah 1 — Tentukan Variabel:</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
                        <li><InlineMath math="m" /> = banyak kendaraan roda dua (motor)</li>
                        <li><InlineMath math="k" /> = banyak kendaraan roda empat (mobil)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-violet-300 font-semibold">Langkah 2 — Identifikasi Dua Hubungan:</p>
                      <div className="space-y-2">
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs font-semibold">Hubungan 1: Jumlah kendaraan</p>
                          <p className="text-white/60 text-xs">Roda dua + Roda empat = 50 kendaraan</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs font-semibold">Hubungan 2: Jumlah roda</p>
                          <p className="text-white/60 text-xs">Setiap motor punya 2 roda, setiap mobil punya 4 roda</p>
                          <p className="text-white/60 text-xs">Total roda = 140</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-green-300 font-semibold">Langkah 3 — Terjemahkan ke Persamaan:</p>
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-white/60 text-xs">Dari Hubungan 1:</p>
                        <BlockMath math="m + k = 50 \quad \cdots (I)" />
                      </div>
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-white/60 text-xs">Dari Hubungan 2 (motor punya 2 roda, mobil punya 4 roda):</p>
                        <BlockMath math="2m + 4k = 140 \quad \cdots (II)" />
                      </div>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">✅ Model SPLDV:</p>
                      <BlockMath math="\begin{cases} m + k = 50 \\ 2m + 4k = 140 \end{cases}" />
                      <p className="text-white/60 text-xs mt-1">dengan <InlineMath math="m" /> = jumlah motor, <InlineMath math="k" /> = jumlah mobil</p>
                    </div>

                    <div className="bg-slate-800/40 border border-red-500/20 rounded-xl p-3">
                      <p className="font-body text-xs text-red-300 font-semibold">🌟 Mengapa Ini "Sulit"?</p>
                      <p className="font-body text-xs text-white/70 mt-1">Persamaan kedua tidak langsung terlihat jelas dari soal. Kamu harus sadar bahwa "jumlah roda" bukan sekadar menjumlahkan kendaraan, melainkan mengalikan jumlah kendaraan dengan banyaknya roda masing-masing. Inilah kunci pemodelan yang lebih dalam!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman Membuat Model SPLDV" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🗝️ Kunci Pemodelan yang Sukses</p>
                  <ul className="space-y-2 text-sm font-body text-white/75">
                    <li className="flex gap-2">
                      <span className="text-green-400 shrink-0">✔</span>
                      <span>Selalu definisikan variabel dengan jelas (<strong className="text-white">beri satuan!</strong>)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400 shrink-0">✔</span>
                      <span>Pastikan ada <strong className="text-white">tepat 2 persamaan berbeda</strong> untuk 2 variabel</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400 shrink-0">✔</span>
                      <span>Perhatikan kata kunci dalam soal: "jumlah", "selisih", "kali", "lebih dari", dll.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400 shrink-0">✔</span>
                      <span>Periksa: apakah model yang dibuat masuk akal secara konteks?</span>
                    </li>
                  </ul>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Kata dalam Soal</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Artinya</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["jumlah ... dan ...", "penjumlahan kedua variabel"],
                        ["selisih / lebih dari / lebih muda", "pengurangan antar variabel"],
                        ["dua kali / tiga kali", "perkalian variabel dengan koefisien"],
                        ["sama dengan / adalah / menjadi", "tanda = (sama dengan)"],
                        ["jumlah total / keseluruhan", "biasanya menjadi satu persamaan"],
                      ].map(([kata, arti], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">"{kata}"</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{arti}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default ModelSPLDVPage;
