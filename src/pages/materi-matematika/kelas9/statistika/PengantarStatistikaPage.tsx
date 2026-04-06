import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Database } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengantarStatistikaPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1", "contoh1",
    "konsep2", "contoh2",
    "konsep3", "contoh3",
    "konsep4", "contoh4",
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
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGANTAR STATISTIKA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ===== PENGANTAR ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Mengapa Statistika Penting?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu ingin tahu nilai rata-rata teman sekelasmu, atau ingin mengetahui berapa banyak siswa yang suka olahraga tertentu. Nah, untuk menjawab pertanyaan seperti itu, kamu butuh ilmu yang bernama <strong className="text-cyan-300">statistika</strong>!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Statistika ada di mana-mana: laporan cuaca, hasil survei, hasil ujian nasional, grafik penjualan, hingga data vaksinasi. Menguasai statistika berarti kamu mampu membaca dan mengambil keputusan dari data secara cerdas! 📊🚀
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Statistika adalah materi penting di kelas 9. Kuasai konsep dasarnya dulu sebelum lanjut ke ukuran pemusatan dan penyebaran data!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== SUB-BAB 1: ISTILAH DASAR STATISTIKA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Istilah Dasar dalam Statistika" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Sebelum masuk ke perhitungan, kita perlu kenalan dulu dengan kosakata utama dalam statistika. Ada beberapa istilah yang perlu kamu hafal baik-baik:
                  </p>
                </div>

                {/* Kartu Istilah */}
                <div className="grid grid-cols-1 gap-3">

                  {/* Statistika vs Statistik */}
                  <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wide">📌 Statistika vs Statistik</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-cyan-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-cyan-300 mb-1">Statistika</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Ilmu yang mempelajari cara mengumpulkan, menyusun, mengolah, dan menganalisis data, serta menarik kesimpulan dari data tersebut.
                        </p>
                        <p className="font-body text-xs text-cyan-400 mt-2 italic">Contoh: Bidang ilmu Statistika digunakan oleh peneliti dan pemerintah.</p>
                      </div>
                      <div className="bg-indigo-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-indigo-300 mb-1">Statistik</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Nilai atau angka yang dihasilkan dari pengolahan data, seperti rata-rata, median, dan modus.
                        </p>
                        <p className="font-body text-xs text-indigo-400 mt-2 italic">Contoh: Rata-rata nilai ulangan kelas 9A adalah 78. Angka 78 adalah statistik.</p>
                      </div>
                    </div>
                  </div>

                  {/* Data & Datum */}
                  <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-purple-400 mb-2 uppercase tracking-wide">📌 Data & Datum</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-purple-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-purple-300 mb-1">Data</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Kumpulan fakta atau informasi (jamak dari datum) yang dikumpulkan untuk suatu tujuan tertentu.
                        </p>
                        <p className="font-body text-xs text-purple-400 mt-2 italic">Contoh: {"{"}70, 80, 75, 90, 85{"}"} adalah data nilai ulangan.</p>
                      </div>
                      <div className="bg-pink-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-pink-300 mb-1">Datum</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Satu buah nilai atau informasi tunggal dari keseluruhan data yang dikumpulkan.
                        </p>
                        <p className="font-body text-xs text-pink-400 mt-2 italic">Contoh: Nilai 80 adalah satu datum dari kumpulan data di atas.</p>
                      </div>
                    </div>
                  </div>

                  {/* Populasi & Sampel */}
                  <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-orange-400 mb-2 uppercase tracking-wide">📌 Populasi & Sampel</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-orange-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-orange-300 mb-1">Populasi</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Keseluruhan objek atau individu yang menjadi subjek penelitian/pengamatan.
                        </p>
                        <p className="font-body text-xs text-orange-400 mt-2 italic">Contoh: Seluruh siswa SMP Negeri 1 (misalnya 600 siswa) adalah populasinya.</p>
                      </div>
                      <div className="bg-yellow-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-yellow-300 mb-1">Sampel</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Sebagian kecil anggota populasi yang dipilih untuk mewakili seluruh populasi.
                        </p>
                        <p className="font-body text-xs text-yellow-400 mt-2 italic">Contoh: 30 siswa yang dipilih dari 600 siswa untuk mengisi kuesioner.</p>
                      </div>
                    </div>
                    {/* Visual populasi vs sampel */}
                    <div className="mt-3 bg-slate-900/60 rounded-lg p-3 flex flex-col items-center gap-2">
                      <p className="font-body text-xs text-white/50 text-center">ILUSTRASI POPULASI DAN SAMPEL</p>
                      <div className="flex items-center justify-center gap-4 flex-wrap">
                        <div className="bg-orange-800/50 border-2 border-orange-500/60 rounded-xl px-6 py-3 text-center">
                          <p className="text-orange-300 font-bold text-xs">POPULASI</p>
                          <p className="text-white text-lg font-bold">600 siswa</p>
                          <p className="text-white/50 text-xs">Seluruh siswa SMP</p>
                        </div>
                        <div className="text-2xl text-primary">⊃</div>
                        <div className="bg-yellow-800/50 border-2 border-yellow-500/60 rounded-xl px-6 py-3 text-center">
                          <p className="text-yellow-300 font-bold text-xs">SAMPEL</p>
                          <p className="text-white text-lg font-bold">30 siswa</p>
                          <p className="text-white/50 text-xs">Yang dipilih</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Kualitatif vs Kuantitatif */}
                  <div className="bg-slate-800/60 border border-teal-500/30 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-teal-400 mb-2 uppercase tracking-wide">📌 Jenis Data: Kualitatif & Kuantitatif</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-teal-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-teal-300 mb-1">Data Kualitatif</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Data yang <strong className="text-teal-300">tidak berupa angka</strong>, melainkan berupa kategori, label, atau deskripsi. Tidak bisa dihitung secara matematis.
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="font-body text-xs text-teal-400">✔ Warna mata (hitam, cokelat)</p>
                          <p className="font-body text-xs text-teal-400">✔ Jenis kelamin (laki-laki, perempuan)</p>
                          <p className="font-body text-xs text-teal-400">✔ Golongan darah (A, B, AB, O)</p>
                        </div>
                      </div>
                      <div className="bg-blue-900/30 rounded-lg p-3">
                        <p className="font-body text-sm font-bold text-blue-300 mb-1">Data Kuantitatif</p>
                        <p className="font-body text-xs text-white/70 leading-relaxed">
                          Data yang <strong className="text-blue-300">berupa angka</strong> dan bisa dihitung atau diukur secara matematis.
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="font-body text-xs text-blue-400">✔ Tinggi badan: 165 cm</p>
                          <p className="font-body text-xs text-blue-400">✔ Nilai ujian: 87</p>
                          <p className="font-body text-xs text-blue-400">✔ Jumlah siswa: 32</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
                      <p className="font-body text-xs text-blue-200">
                        <strong>Data Kuantitatif terbagi lagi:</strong><br />
                        • <strong className="text-blue-300">Diskrit</strong> → Bilangan bulat (cacahan). Contoh: jumlah anak = 2<br />
                        • <strong className="text-blue-300">Kontinu</strong> → Bilangan real (pengukuran). Contoh: berat badan = 52,5 kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Membedakan:</strong> Tanya diri sendiri — "Apakah data ini bisa dijumlahkan atau dirata-rata?" Jika ya → <strong>kuantitatif</strong>. Jika tidak masuk akal untuk dirata-rata (misal rata-rata golongan darah?) → <strong>kualitatif</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title="📝 Contoh Soal — Istilah Dasar Statistika" />
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
                      Seorang guru mencatat nilai ulangan harian 5 siswa: 70, 85, 90, 75, 80.<br />
                      Tentukan: (a) Apakah data tersebut kualitatif atau kuantitatif? (b) Sebutkan satu datum dari data tersebut!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>(a)</strong> Data nilai ulangan berupa angka dan bisa dihitung (rata-rata, dsb).</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-green-300 font-semibold">→ Data kuantitatif (diskrit)</p>
                      </div>
                      <p><strong>(b)</strong> Salah satu datum dari data tersebut adalah nilai <strong className="text-green-300">85</strong> (atau 70, 90, 75, 80 — pilih salah satu).</p>
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
                      Sebuah penelitian dilakukan pada seluruh siswa kelas 9 SMP Bintang (populasi = 120 siswa). Karena keterbatasan waktu, hanya 30 siswa yang diambil datanya. Klasifikasikan data berikut sebagai kualitatif atau kuantitatif:<br />
                      (i) Hobi siswa &nbsp; (ii) Tinggi badan siswa &nbsp; (iii) Warna seragam &nbsp; (iv) IPK siswa
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Populasi:</strong> 120 siswa kelas 9 SMP Bintang.</p>
                      <p><strong>Sampel:</strong> 30 siswa yang dipilih.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>(i) Hobi → kategori/label → <span className="text-teal-400 font-semibold">Kualitatif</span></p>
                        <p>(ii) Tinggi badan → angka ukuran → <span className="text-blue-400 font-semibold">Kuantitatif Kontinu</span></p>
                        <p>(iii) Warna seragam → kategori → <span className="text-teal-400 font-semibold">Kualitatif</span></p>
                        <p>(iv) IPK → angka, bisa dirata-rata → <span className="text-blue-400 font-semibold">Kuantitatif Kontinu</span></p>
                      </div>
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
                      Seorang peneliti ingin mengetahui rata-rata jam belajar siswa SMP di Kota A yang berjumlah 5.000 siswa. Ia mengambil sampel 250 siswa. Jika diketahui dari 250 siswa tersebut, total jam belajar per minggu adalah 3.750 jam, tentukan:
                      (a) Rata-rata jam belajar sampel.
                      (b) Apakah rata-rata ini disebut statistik atau statistika? Jelaskan.
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung rata-rata jam belajar sampel:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\bar{x} = \frac{\text{Total jam belajar}}{\text{Jumlah sampel}} = \frac{3.750}{250} = 15 \text{ jam/minggu}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Identifikasi istilah yang tepat:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-red-300">• Angka <strong>15 jam/minggu</strong> adalah hasil pengolahan data → disebut <strong className="text-yellow-300">Statistik</strong></p>
                        <p className="text-red-300">• Proses pengumpulan, pengolahan, dan interpretasi datanya → disebut <strong className="text-cyan-300">Statistika</strong></p>
                      </div>
                      <p><strong className="text-primary">Rata-rata = 15 jam/minggu; Angka 15 disebut Statistik, bukan Statistika.</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 2: JENIS-JENIS PENGUMPULAN DATA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 2: Cara-Cara Mengumpulkan Data" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ada berbagai cara untuk mengumpulkan data. Setiap metode punya kelebihan dan kekurangannya masing-masing. Memilih metode yang tepat sangat menentukan kualitas data yang kamu dapatkan!
                  </p>
                </div>

                {/* Tabel Metode Pengumpulan Data */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl overflow-hidden">
                  <div className="bg-purple-700/40 px-4 py-2">
                    <p className="font-body text-xs font-bold text-purple-200 uppercase tracking-wide">📋 Metode Pengumpulan Data</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/50">
                          <th className="px-3 py-2 text-left text-purple-300 font-bold w-1/4">Metode</th>
                          <th className="px-3 py-2 text-left text-white/70 font-semibold w-2/5">Penjelasan</th>
                          <th className="px-3 py-2 text-left text-white/70 font-semibold">Contoh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/40">
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-3 text-cyan-300 font-bold">📋 Angket / Kuesioner</td>
                          <td className="px-3 py-3 text-white/70">Daftar pertanyaan tertulis yang diisi oleh responden secara mandiri</td>
                          <td className="px-3 py-3 text-white/60">Formulir survei kepuasan belajar siswa</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-3 text-green-300 font-bold">🗣️ Wawancara</td>
                          <td className="px-3 py-3 text-white/70">Tanya jawab langsung antara peneliti dan narasumber</td>
                          <td className="px-3 py-3 text-white/60">Mewawancarai guru tentang metode mengajar</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-3 text-yellow-300 font-bold">👀 Observasi</td>
                          <td className="px-3 py-3 text-white/70">Mengamati objek/peristiwa secara langsung dan mencatat hasilnya</td>
                          <td className="px-3 py-3 text-white/60">Menghitung jumlah kendaraan yang lewat</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-3 text-orange-300 font-bold">📁 Dokumentasi</td>
                          <td className="px-3 py-3 text-white/70">Mengambil data dari catatan, arsip, atau dokumen yang sudah ada</td>
                          <td className="px-3 py-3 text-white/60">Data nilai siswa dari buku raport sekolah</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-3 text-pink-300 font-bold">🧪 Eksperimen</td>
                          <td className="px-3 py-3 text-white/70">Mengumpulkan data dengan cara percobaan dan perlakuan khusus</td>
                          <td className="px-3 py-3 text-white/60">Mencatat pertumbuhan tanaman dengan pupuk berbeda</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pembagian sumber data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-blue-300 mb-2">📤 Data Primer</p>
                    <p className="font-body text-xs text-white/70 leading-relaxed">
                      Data yang dikumpulkan <strong className="text-blue-200">langsung</strong> oleh peneliti dari sumbernya.
                    </p>
                    <p className="font-body text-xs text-blue-400 mt-2">Contoh: Melakukan survei sendiri kepada teman-teman sekelas.</p>
                  </div>
                  <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-indigo-300 mb-2">📥 Data Sekunder</p>
                    <p className="font-body text-xs text-white/70 leading-relaxed">
                      Data yang diperoleh dari <strong className="text-indigo-200">sumber lain</strong> (sudah dikumpulkan orang lain).
                    </p>
                    <p className="font-body text-xs text-indigo-400 mt-2">Contoh: Mengambil data penduduk dari Badan Pusat Statistik (BPS).</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Pilih metode pengumpulan data sesuai kebutuhan. Angket cocok untuk data banyak responden dengan waktu terbatas. Wawancara cocok bila perlu penjelasan mendalam. Observasi tepat bila data tidak bisa diperoleh lewat pertanyaan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Pengumpulan Data" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rini ingin mengetahui mata pelajaran favorit teman-teman sekelasnya. Ia membuat daftar pertanyaan yang diisi langsung oleh 30 teman sekelasnya. Metode apa yang digunakan Rini? Termasuk data primer atau sekunder?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Rini membuat <strong>daftar pertanyaan tertulis</strong> yang diisi sendiri oleh responden.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-green-300 font-semibold">Metode: Angket/Kuesioner</p>
                        <p className="text-green-300 font-semibold">Jenis: Data Primer (dikumpulkan langsung oleh Rini sendiri)</p>
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
                      Pak Budi ingin meneliti pengaruh belajar di luar kelas terhadap konsentrasi siswa. Ia duduk di belakang kelas dan mencatat perilaku siswa tanpa diketahui siswanya. Tentukan: (a) Metode pengumpulan data yang digunakan, (b) Mengapa metode ini dipilih?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>(a)</strong> Pak Budi mengamati dan mencatat langsung tanpa bertanya.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-yellow-300 font-semibold">Metode: Observasi (pengamatan langsung)</p>
                      </div>
                      <p><strong>(b)</strong> Metode observasi dipilih karena:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>• Perilaku alami siswa hanya bisa diamati secara langsung</p>
                        <p>• Jika siswa tahu sedang diamati, perilaku mereka berubah (tidak alami)</p>
                        <p className="text-yellow-300 mt-1">→ Observasi memberikan data yang lebih objektif untuk kasus ini</p>
                      </div>
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
                      Seorang peneliti ingin mengumpulkan data tentang tingkat kepuasan orang tua terhadap program sekolah. Populasi adalah 800 orang tua siswa. Ia memilih 10% sebagai sampel dan menggunakan dua metode: angket untuk data umum dan wawancara untuk klarifikasi mendalam. Hitunglah jumlah sampel, dan jelaskan mengapa menggunakan dua metode sekaligus merupakan pendekatan yang tepat!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung jumlah sampel:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Sampel} = 10\% \times 800 = \frac{10}{100} \times 800 = 80 \text{ orang tua}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Alasan penggunaan dua metode:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>• <strong className="text-cyan-300">Angket:</strong> Efisien untuk 80 responden, menghemat waktu, bisa diisi bersamaan</p>
                        <p>• <strong className="text-cyan-300">Wawancara:</strong> Menggali alasan mendalam di balik jawaban angket</p>
                        <p>• Kombinasi keduanya → data lebih <strong className="text-yellow-300">komprehensif</strong> (kuantitatif + kualitatif)</p>
                      </div>
                      <p><strong className="text-primary">Sampel = 80 orang; dua metode digunakan agar data lebih lengkap dan valid.</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== SUB-BAB 3: JENIS-JENIS PENYAJIAN DATA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep3" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Sub-Bab 3: Cara-Cara Menyajikan Data" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Setelah data dikumpulkan, langkah berikutnya adalah <strong className="text-cyan-300">menyajikan data</strong> agar mudah dibaca dan dipahami. Ada beberapa bentuk penyajian data yang umum digunakan:
                  </p>
                </div>

                {/* Kartu Jenis Penyajian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-4">
                    <p className="text-2xl mb-1">📋</p>
                    <p className="font-body text-sm font-bold text-cyan-300 mb-1">Tabel</p>
                    <p className="font-body text-xs text-white/70">Data disusun dalam baris dan kolom. Cocok untuk data berjumlah banyak. Contoh: tabel nilai siswa, tabel distribusi frekuensi.</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-xl p-4">
                    <p className="text-2xl mb-1">📊</p>
                    <p className="font-body text-sm font-bold text-green-300 mb-1">Diagram Batang</p>
                    <p className="font-body text-xs text-white/70">Batang-batang tegak atau mendatar untuk membandingkan beberapa kategori data. Tinggi batang = frekuensi/nilai.</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-2xl mb-1">📈</p>
                    <p className="font-body text-sm font-bold text-purple-300 mb-1">Diagram Garis</p>
                    <p className="font-body text-xs text-white/70">Titik-titik yang dihubungkan garis. Ideal untuk data yang berubah seiring waktu (tren).</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-2xl mb-1">🥧</p>
                    <p className="font-body text-sm font-bold text-orange-300 mb-1">Diagram Lingkaran</p>
                    <p className="font-body text-xs text-white/70">Lingkaran dibagi jadi beberapa sektor. Ideal untuk menunjukkan proporsi/persentase tiap kategori.</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-xl p-4">
                    <p className="text-2xl mb-1">🌿</p>
                    <p className="font-body text-sm font-bold text-indigo-300 mb-1">Diagram Batang Daun</p>
                    <p className="font-body text-xs text-white/70">Mirip tabel, angka dipisah jadi "batang" (puluhan) dan "daun" (satuan). Bagus untuk data mentah.</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-2xl mb-1">📉</p>
                    <p className="font-body text-sm font-bold text-yellow-300 mb-1">Ogive / Histogram</p>
                    <p className="font-body text-xs text-white/70">Grafik untuk data berkelompok. Histogram mirip diagram batang tanpa celah. Ogive adalah grafik frekuensi kumulatif.</p>
                  </div>
                </div>

                {/* Panduan Pemilihan */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl overflow-hidden">
                  <div className="bg-slate-700/50 px-4 py-2">
                    <p className="font-body text-xs font-bold text-slate-200 uppercase tracking-wide">🔍 Panduan Memilih Jenis Penyajian</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/30">
                          <th className="px-3 py-2 text-left text-cyan-300 font-bold">Tujuan Penyajian</th>
                          <th className="px-3 py-2 text-left text-white/70 font-semibold">Pilihan Terbaik</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/40">
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-2 text-white/80">Membandingkan beberapa kategori</td>
                          <td className="px-3 py-2 text-green-400 font-semibold">Diagram Batang</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-2 text-white/80">Menunjukkan perubahan dari waktu ke waktu</td>
                          <td className="px-3 py-2 text-purple-400 font-semibold">Diagram Garis</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-2 text-white/80">Menampilkan proporsi/bagian dari keseluruhan</td>
                          <td className="px-3 py-2 text-orange-400 font-semibold">Diagram Lingkaran</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-2 text-white/80">Menampilkan data mentah secara detail</td>
                          <td className="px-3 py-2 text-indigo-400 font-semibold">Diagram Batang Daun</td>
                        </tr>
                        <tr className="hover:bg-slate-700/20">
                          <td className="px-3 py-2 text-white/80">Menyajikan data banyak secara terstruktur</td>
                          <td className="px-3 py-2 text-cyan-400 font-semibold">Tabel Distribusi Frekuensi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Penyajian data yang baik membuat pembaca langsung menangkap isi informasi tanpa perlu berpikir keras. Pilih bentuk yang paling sesuai dengan jenis datamu!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title="📝 Contoh Soal — Jenis Penyajian Data" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan jenis penyajian data yang paling tepat untuk masing-masing situasi berikut:<br />
                      (a) Perkembangan jumlah pengguna internet di Indonesia dari tahun 2018–2024.<br />
                      (b) Persentase siswa yang menyukai olahraga basket, sepak bola, renang, dan voli.
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p>(a) Data berubah seiring waktu (2018–2024) → <span className="text-purple-400 font-semibold">📈 Diagram Garis</span></p>
                        <p>(b) Data berupa proporsi/persentase kategori → <span className="text-orange-400 font-semibold">🥧 Diagram Lingkaran</span></p>
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
                      Data ekskul yang diikuti 40 siswa adalah sebagai berikut:<br />
                      Pramuka: 12 siswa, Seni Musik: 8 siswa, Futsal: 14 siswa, Tari: 6 siswa.<br />
                      Jika ingin disajikan dalam diagram lingkaran, tentukan besar sudut sektor untuk masing-masing ekskul!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Rumus:</strong> <InlineMath math="\text{Sudut sektor} = \dfrac{\text{frekuensi}}{\text{total}} \times 360°" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Pramuka: } \frac{12}{40} \times 360° = 108°" />
                        <BlockMath math="\text{Seni Musik: } \frac{8}{40} \times 360° = 72°" />
                        <BlockMath math="\text{Futsal: } \frac{14}{40} \times 360° = 126°" />
                        <BlockMath math="\text{Tari: } \frac{6}{40} \times 360° = 54°" />
                      </div>
                      <p className="text-yellow-300">Cek: <InlineMath math="108° + 72° + 126° + 54° = 360°" /> ✓</p>
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
                      Dari diagram lingkaran diketahui bahwa 25% siswa menyukai Matematika, 30% Bahasa Indonesia, 20% IPA, 15% IPS, dan sisanya menyukai Seni. Jika jumlah seluruh siswa adalah 200, tentukan:<br />
                      (a) Persentase siswa yang menyukai Seni.<br />
                      (b) Jumlah siswa yang menyukai setiap mata pelajaran.<br />
                      (c) Besar sudut sektor Seni pada diagram lingkaran.
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung persentase Seni:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\%\text{Seni} = 100\% - (25+30+20+15)\% = 100\% - 90\% = 10\%" />
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung jumlah siswa tiap mapel:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>Matematika: <InlineMath math="25\% \times 200 = 50" /> siswa</p>
                        <p>Bhs. Indonesia: <InlineMath math="30\% \times 200 = 60" /> siswa</p>
                        <p>IPA: <InlineMath math="20\% \times 200 = 40" /> siswa</p>
                        <p>IPS: <InlineMath math="15\% \times 200 = 30" /> siswa</p>
                        <p>Seni: <InlineMath math="10\% \times 200 = 20" /> siswa</p>
                      </div>
                      <p><strong>Langkah 3:</strong> Sudut sektor Seni:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Sudut Seni} = \frac{10}{100} \times 360° = 36°" />
                      </div>
                      <p><strong className="text-primary">Seni = 10%; 20 siswa; sudut sektor = 36°</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ===== RANGKUMAN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Database className="w-5 h-5" />} iconColor="text-yellow-400" title="🏁 Rangkuman Materi" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-cyan-300 text-center mb-3">⭐ Poin-Poin Kunci yang Harus Diingat</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="flex gap-2"><span className="text-cyan-400 shrink-0">✅</span><p><strong className="text-cyan-300">Statistika</strong> = ilmu; <strong className="text-cyan-300">Statistik</strong> = nilai/angka hasil pengolahan data.</p></div>
                    <div className="flex gap-2"><span className="text-cyan-400 shrink-0">✅</span><p><strong className="text-green-300">Data</strong> = kumpulan fakta; <strong className="text-green-300">Datum</strong> = satu buah data.</p></div>
                    <div className="flex gap-2"><span className="text-cyan-400 shrink-0">✅</span><p><strong className="text-orange-300">Populasi</strong> = seluruh objek; <strong className="text-orange-300">Sampel</strong> = sebagian yang mewakili populasi.</p></div>
                    <div className="flex gap-2"><span className="text-cyan-400 shrink-0">✅</span><p><strong className="text-teal-300">Kualitatif</strong> = non-angka (kategori); <strong className="text-blue-300">Kuantitatif</strong> = angka (diskrit/kontinu).</p></div>
                    <div className="flex gap-2"><span className="text-cyan-400 shrink-0">✅</span><p>Metode pengumpulan: angket, wawancara, observasi, dokumentasi, eksperimen.</p></div>
                    <div className="flex gap-2"><span className="text-cyan-400 shrink-0">✅</span><p>Bentuk penyajian: tabel, diagram batang, diagram garis, diagram lingkaran, batang daun.</p></div>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Siap lanjut?</strong> Kamu sudah menguasai fondasi statistika. Materi berikutnya akan membahas cara menyajikan data secara lebih mendalam, termasuk membaca dan membuat diagram batang daun, diagram garis, dan tabel distribusi frekuensi! 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengantarStatistikaPage;
