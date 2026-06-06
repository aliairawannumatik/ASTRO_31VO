import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, Database } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengantarStatistikaPage = () => {
  const navigate = useNavigate();

  const SectionHeader = ({
    icon, iconColor, title,
  }: { icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
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
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Mengapa Statistika Penting?" />
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu ingin tahu nilai rata-rata teman sekelasmu, atau ingin mengetahui berapa banyak siswa yang suka olahraga tertentu. Nah, untuk menjawab pertanyaan seperti itu, kamu butuh ilmu yang bernama <strong className="text-cyan-300">statistika</strong>!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    Statistika ada di mana-mana: laporan cuaca, hasil survei, hasil ujian nasional, grafik penjualan, <strong className="text-cyan-300">harga saham</strong>, hingga data vaksinasi. Menguasai statistika berarti kamu mampu membaca dan mengambil keputusan dari data secara cerdas! 📊🚀
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-600/40 bg-slate-800/60">
                  <img
                    src="/harga-saham-bbca.jpeg"
                    alt="Grafik Harga Saham BBCA (Bank Central Asia) — contoh nyata penggunaan statistika dalam dunia keuangan"
                    className="w-full object-cover"
                  />
                  <div className="px-4 py-2 bg-slate-900/70">
                    <p className="font-body text-xs text-slate-400 text-center leading-relaxed">
                      📈 <strong className="text-slate-300">Grafik harga saham BBCA (Bank Central Asia)</strong> — contoh nyata data statistika di dunia keuangan.{" "}
                      <a
                        href="https://pintarsaham.id/harga-wajar-saham-bbca-update-kuartal-1-2024/#google_vignette"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 underline hover:text-cyan-300 transition-colors"
                      >
                        Sumber: pintarsaham.id
                      </a>
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan:</strong> Statistika adalah materi penting di kelas 9. Kuasai konsep dasarnya dulu sebelum lanjut ke ukuran pemusatan dan penyebaran data!
                  </p>
                </div>
              </div>
          </div>

          {/* ===== SUB-BAB 1: ISTILAH DASAR STATISTIKA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Istilah Dasar dalam Statistika" />
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
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title="📝 Contoh Soal — Istilah Dasar Statistika" />
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
          </div>

          {/* ===== SUB-BAB 2: JENIS-JENIS PENGUMPULAN DATA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 2: Cara-Cara Mengumpulkan Data" />
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
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Pengumpulan Data" />
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
          </div>

          {/* ===== SUB-BAB 3: JENIS-JENIS PENYAJIAN DATA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Sub-Bab 3: Cara-Cara Menyajikan Data" />
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Setelah data dikumpulkan, langkah berikutnya adalah <strong className="text-cyan-300">menyajikan data</strong> agar mudah dibaca dan dipahami. Ada beberapa bentuk penyajian data yang umum digunakan:
                  </p>
                </div>

                {/* Kartu Jenis Penyajian */}
                <div className="flex flex-col gap-4">

                  {/* 1. TABEL */}
                  <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">📋 Tabel Distribusi Frekuensi</p>
                      <p className="font-body text-xs text-white/70">Data disusun dalam baris dan kolom. Cocok untuk data berjumlah banyak dan memudahkan pembacaan frekuensi tiap kelompok.</p>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-cyan-500/20">
                      <table className="w-full text-xs font-body">
                        <thead>
                          <tr className="bg-cyan-800/40">
                            <th className="px-3 py-2 text-cyan-200 font-bold text-center">Nilai</th>
                            <th className="px-3 py-2 text-cyan-200 font-bold text-center">Turus</th>
                            <th className="px-3 py-2 text-cyan-200 font-bold text-center">Frekuensi</th>
                            <th className="px-3 py-2 text-cyan-200 font-bold text-center">Persentase</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-500/10">
                          {[
                            { nilai: "50 – 59", turus: "||", f: 2, pct: "6,7%" },
                            { nilai: "60 – 69", turus: "||||", f: 5, pct: "16,7%" },
                            { nilai: "70 – 79", turus: "|||| |||||", f: 10, pct: "33,3%" },
                            { nilai: "80 – 89", turus: "|||| ||||", f: 9, pct: "30,0%" },
                            { nilai: "90 – 99", turus: "||||", f: 4, pct: "13,3%" },
                          ].map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-cyan-900/20" : "bg-slate-900/30"}>
                              <td className="px-3 py-2 text-white font-semibold text-center">{row.nilai}</td>
                              <td className="px-3 py-2 text-cyan-300 text-center tracking-widest">{row.turus}</td>
                              <td className="px-3 py-2 text-white text-center font-bold">{row.f}</td>
                              <td className="px-3 py-2 text-cyan-200 text-center">{row.pct}</td>
                            </tr>
                          ))}
                          <tr className="bg-cyan-700/30">
                            <td className="px-3 py-2 text-cyan-200 font-bold text-center">Jumlah</td>
                            <td className="px-3 py-2 text-center">—</td>
                            <td className="px-3 py-2 text-yellow-300 font-bold text-center">30</td>
                            <td className="px-3 py-2 text-yellow-300 font-bold text-center">100%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-xs text-cyan-400 italic">📌 Data: Nilai ulangan 30 siswa Kelas 9A</p>
                  </div>

                  {/* 2. DIAGRAM BATANG */}
                  <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-body text-sm font-bold text-green-300 mb-1">📊 Diagram Batang</p>
                      <p className="font-body text-xs text-white/70">Batang-batang tegak untuk membandingkan beberapa kategori. Tinggi batang menunjukkan frekuensi/nilai data.</p>
                    </div>
                    <svg viewBox="0 0 280 170" className="w-full" style={{ fontFamily: "inherit" }}>
                      <rect width="280" height="170" fill="transparent" />
                      {/* Grid lines */}
                      {[0,3,6,9,12,15].map(v => {
                        const y = 140 - (v / 16) * 110;
                        return (
                          <g key={v}>
                            <line x1="38" y1={y} x2="268" y2={y} stroke="#22d3ee" strokeOpacity="0.15" strokeWidth="1" />
                            <text x="34" y={y + 4} fontSize="8" fill="#67e8f9" textAnchor="end">{v}</text>
                          </g>
                        );
                      })}
                      {/* Bars */}
                      {[
                        { label: "Futsal", val: 15, color: "#22c55e" },
                        { label: "Basket", val: 12, color: "#06b6d4" },
                        { label: "Pramuka", val: 8,  color: "#f59e0b" },
                        { label: "Tari",   val: 5,  color: "#ec4899" },
                      ].map((d, i) => {
                        const bw = 40, gap = 15, x = 50 + i * (bw + gap);
                        const h = (d.val / 16) * 110;
                        const y = 140 - h;
                        return (
                          <g key={i}>
                            <rect x={x} y={y} width={bw} height={h} fill={d.color} fillOpacity="0.8" rx="3" />
                            <text x={x + bw / 2} y={y - 4} fontSize="9" fill={d.color} textAnchor="middle" fontWeight="bold">{d.val}</text>
                            <text x={x + bw / 2} y="158" fontSize="8" fill="#cbd5e1" textAnchor="middle">{d.label}</text>
                          </g>
                        );
                      })}
                      {/* Axes */}
                      <line x1="38" y1="140" x2="268" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="38" y1="10" x2="38" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x="10" y="80" fontSize="8" fill="#94a3b8" textAnchor="middle" transform="rotate(-90,10,80)">Jumlah Siswa</text>
                    </svg>
                    <p className="font-body text-xs text-green-400 italic">📌 Data: Ekskul favorit 40 siswa Kelas 9B</p>
                  </div>

                  {/* 3. DIAGRAM GARIS */}
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-body text-sm font-bold text-purple-300 mb-1">📈 Diagram Garis</p>
                      <p className="font-body text-xs text-white/70">Titik-titik data dihubungkan garis. Ideal untuk menampilkan tren atau perubahan data dari waktu ke waktu.</p>
                    </div>
                    {(() => {
                      const pts: [number, number][] = [[45,121],[90,86],[135,75],[180,62],[225,46],[265,25]];
                      const labels = ["2019","2020","2021","2022","2023","2024"];
                      const vals = [170, 196, 204, 213, 225, 240];
                      const polyline = pts.map(p => p.join(",")).join(" ");
                      const area = `M${pts[0][0]},140 ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length-1][0]},140 Z`;
                      return (
                        <svg viewBox="0 0 280 160" className="w-full">
                          <rect width="280" height="160" fill="transparent" />
                          {[170,190,210,230].map(v => {
                            const y = 140 - ((v - 160) / 90) * 110;
                            return (
                              <g key={v}>
                                <line x1="42" y1={y} x2="272" y2={y} stroke="#a855f7" strokeOpacity="0.15" strokeWidth="1" />
                                <text x="38" y={y + 3} fontSize="8" fill="#c084fc" textAnchor="end">{v}</text>
                              </g>
                            );
                          })}
                          <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
                            </linearGradient>
                          </defs>
                          <path d={area} fill="url(#lineGrad)" />
                          <polyline points={polyline} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                          {pts.map(([x, y], i) => (
                            <g key={i}>
                              <circle cx={x} cy={y} r="5" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
                              <text x={x} y={y - 9} fontSize="8" fill="#e879f9" textAnchor="middle" fontWeight="bold">{vals[i]}</text>
                              <text x={x} y="153" fontSize="8" fill="#cbd5e1" textAnchor="middle">{labels[i]}</text>
                            </g>
                          ))}
                          <line x1="42" y1="140" x2="272" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                          <line x1="42" y1="10" x2="42" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                          <text x="12" y="80" fontSize="8" fill="#94a3b8" textAnchor="middle" transform="rotate(-90,12,80)">Juta Pengguna</text>
                        </svg>
                      );
                    })()}
                    <p className="font-body text-xs text-purple-400 italic">📌 Data: Pertumbuhan pengguna internet Indonesia 2019–2024 (dalam juta)</p>
                  </div>

                  {/* 4. DIAGRAM LINGKARAN */}
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-body text-sm font-bold text-orange-300 mb-1">🥧 Diagram Lingkaran (Pie Chart)</p>
                      <p className="font-body text-xs text-white/70">Lingkaran dibagi menjadi beberapa sektor. Ideal untuk menunjukkan proporsi atau persentase tiap kategori dari keseluruhan.</p>
                    </div>
                    <svg viewBox="0 0 280 160" className="w-full">
                      <rect width="280" height="160" fill="transparent" />
                      {/* Pie slices — cx=100, cy=80, r=68 */}
                      {/* Olahraga 35% (126°): 0°→126° */}
                      <path d="M100,80 L100,12 A68,68 0 0,1 155.6,137.2 Z" fill="#22c55e" fillOpacity="0.85" />
                      {/* Seni 25% (90°): 126°→216° */}
                      <path d="M100,80 L155.6,137.2 A68,68 0 0,1 44.9,137.5 Z" fill="#a855f7" fillOpacity="0.85" />
                      {/* Sains 20% (72°): 216°→288° */}
                      <path d="M100,80 L44.9,137.5 A68,68 0 0,1 53.3,38.1 Z" fill="#22d3ee" fillOpacity="0.85" />
                      {/* Bahasa 15% (54°): 288°→342° */}
                      <path d="M100,80 L53.3,38.1 A68,68 0 0,1 82.7,12.7 Z" fill="#f59e0b" fillOpacity="0.85" />
                      {/* Lainnya 5% (18°): 342°→360° */}
                      <path d="M100,80 L82.7,12.7 A68,68 0 0,1 100,12 Z" fill="#f43f5e" fillOpacity="0.85" />
                      {/* Center circle */}
                      <circle cx="100" cy="80" r="22" fill="#0f172a" />
                      <text x="100" y="77" fontSize="8" fill="#e2e8f0" textAnchor="middle" fontWeight="bold">Total</text>
                      <text x="100" y="88" fontSize="9" fill="#22d3ee" textAnchor="middle" fontWeight="bold">40 siswa</text>
                      {/* Legend */}
                      {[
                        { color: "#22c55e", label: "Olahraga", pct: "35%" },
                        { color: "#a855f7", label: "Seni",     pct: "25%" },
                        { color: "#22d3ee", label: "Sains",    pct: "20%" },
                        { color: "#f59e0b", label: "Bahasa",   pct: "15%" },
                        { color: "#f43f5e", label: "Lainnya",  pct: "5%" },
                      ].map((item, i) => (
                        <g key={i}>
                          <rect x="188" y={18 + i * 26} width="12" height="12" rx="2" fill={item.color} fillOpacity="0.85" />
                          <text x="204" y={28 + i * 26} fontSize="9" fill="#e2e8f0">{item.label}</text>
                          <text x="270" y={28 + i * 26} fontSize="9" fill={item.color} textAnchor="end" fontWeight="bold">{item.pct}</text>
                        </g>
                      ))}
                    </svg>
                    <p className="font-body text-xs text-orange-400 italic">📌 Data: Ekskul favorit 40 siswa Kelas 9C</p>
                  </div>

                  {/* 5. DIAGRAM BATANG DAUN */}
                  <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-body text-sm font-bold text-indigo-300 mb-1">🌿 Diagram Batang Daun</p>
                      <p className="font-body text-xs text-white/70">Angka dipisah menjadi "batang" (puluhan) dan "daun" (satuan). Mempertahankan data asli dan mudah membaca distribusinya.</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-4">
                      <p className="font-body text-xs text-indigo-300 font-bold mb-3 text-center">Nilai Ulangan 18 Siswa</p>
                      <div className="font-mono text-sm">
                        <div className="flex items-center gap-0 mb-1">
                          <div className="w-24 text-right pr-3 text-indigo-300 font-bold border-r-2 border-indigo-500/50">Batang</div>
                          <div className="pl-3 text-slate-400 text-xs italic">Daun</div>
                        </div>
                        {[
                          { stem: "6", leaves: "2  5  8", color: "text-cyan-300" },
                          { stem: "7", leaves: "0  2  4  4  6  8", color: "text-green-300" },
                          { stem: "8", leaves: "0  2  4  5  6  8", color: "text-yellow-300" },
                          { stem: "9", leaves: "0  2  5", color: "text-orange-300" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center gap-0 py-1.5 border-b border-slate-700/40 last:border-0">
                            <div className={`w-24 text-right pr-3 font-bold text-lg border-r-2 border-indigo-500/50 ${row.color}`}>{row.stem}</div>
                            <div className="pl-4 text-white tracking-widest font-mono text-sm">{row.leaves}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-body">
                        <div className="bg-indigo-900/30 rounded p-2 text-center">
                          <p className="text-indigo-300 font-bold">Min</p>
                          <p className="text-white font-bold text-base">62</p>
                        </div>
                        <div className="bg-indigo-900/30 rounded p-2 text-center">
                          <p className="text-indigo-300 font-bold">Max</p>
                          <p className="text-white font-bold text-base">95</p>
                        </div>
                      </div>
                    </div>
                    <p className="font-body text-xs text-indigo-400 italic">📌 Data: Nilai ulangan 18 siswa — batang = puluhan, daun = satuan</p>
                  </div>

                  {/* 6. HISTOGRAM */}
                  <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-body text-sm font-bold text-yellow-300 mb-1">📉 Histogram</p>
                      <p className="font-body text-xs text-white/70">Diagram batang untuk data berkelompok — batang saling berdempetan (tanpa celah). Menunjukkan distribusi frekuensi tiap kelas interval.</p>
                    </div>
                    <svg viewBox="0 0 280 170" className="w-full">
                      <rect width="280" height="170" fill="transparent" />
                      {[0,2,4,6,8,10].map(v => {
                        const y = 140 - (v / 11) * 115;
                        return (
                          <g key={v}>
                            <line x1="38" y1={y} x2="270" y2={y} stroke="#f59e0b" strokeOpacity="0.15" strokeWidth="1" />
                            <text x="34" y={y + 3} fontSize="8" fill="#fcd34d" textAnchor="end">{v}</text>
                          </g>
                        );
                      })}
                      {[
                        { label: "50–59", f: 2,  color: "#818cf8" },
                        { label: "60–69", f: 5,  color: "#22d3ee" },
                        { label: "70–79", f: 10, color: "#22c55e" },
                        { label: "80–89", f: 9,  color: "#f59e0b" },
                        { label: "90–99", f: 4,  color: "#f87171" },
                      ].map((d, i) => {
                        const bw = 46, x = 38 + i * bw;
                        const h = (d.f / 11) * 115;
                        const y = 140 - h;
                        return (
                          <g key={i}>
                            <rect x={x} y={y} width={bw} height={h} fill={d.color} fillOpacity="0.75" />
                            <rect x={x} y={y} width={bw} height={h} fill="none" stroke="#0f172a" strokeWidth="1" />
                            <text x={x + bw / 2} y={y - 4} fontSize="9" fill={d.color} textAnchor="middle" fontWeight="bold">{d.f}</text>
                            <text x={x + bw / 2} y="158" fontSize="7.5" fill="#cbd5e1" textAnchor="middle">{d.label}</text>
                          </g>
                        );
                      })}
                      <line x1="38" y1="140" x2="270" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="38" y1="10" x2="38" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x="10" y="80" fontSize="8" fill="#94a3b8" textAnchor="middle" transform="rotate(-90,10,80)">Frekuensi</text>
                      <text x="154" y="170" fontSize="8" fill="#94a3b8" textAnchor="middle">Kelas Interval Nilai</text>
                    </svg>
                    <p className="font-body text-xs text-yellow-400 italic">📌 Data: Distribusi nilai 30 siswa — batang saling berdempetan (ciri khas histogram)</p>
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
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title="📝 Contoh Soal — Jenis Penyajian Data" />
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
          </div>

          {/* ===== RANGKUMAN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Database className="w-5 h-5" />} iconColor="text-yellow-400" title="🏁 Rangkuman Materi" />
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
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/materi-matematika/kelas-9/statistika")}
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
