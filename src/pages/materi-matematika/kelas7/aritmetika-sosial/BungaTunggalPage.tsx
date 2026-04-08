import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, DollarSign, AlertCircle, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BungaTunggalPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "satuan", "kesalahan", "contoh", "rangkuman"]);

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
          BUNGA TUNGGAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Aritmetika Sosial - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Apa Itu Bunga Tunggal?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ketika kamu menabung di bank atau meminjam uang, ada "biaya" yang disebut <strong className="text-primary">bunga</strong>. Bunga tunggal adalah jenis bunga paling sederhana — dihitung hanya dari <strong className="text-yellow-300">modal awal</strong>, bukan dari bunga yang sudah terkumpul sebelumnya.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <DollarSign className="w-5 h-5 text-green-400 mb-2" />
                    <p className="font-body text-sm font-semibold text-green-300 mb-1">Jika Menabung</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">Bunga = tambahan uang dari bank atas tabunganmu. Kamu diuntungkan karena uangmu bertambah setiap periode.</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <DollarSign className="w-5 h-5 text-red-400 mb-2" />
                    <p className="font-body text-sm font-semibold text-red-300 mb-1">Jika Meminjam</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">Bunga = biaya tambahan yang harus kamu bayar ke bank atas pinjaman. Makin lama pinjam, makin besar total bunganya.</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-border rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-2">🔑 Ciri Khas Bunga Tunggal:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Setiap periode, bunga dihitung dari <strong className="text-yellow-300">modal awal yang sama</strong>. Tidak ada "bunga berbunga" — itulah yang membedakannya dari bunga majemuk yang lebih kompleks.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RINGKASAN INTISARI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Rumus Bunga Tunggal</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="font-body text-sm font-semibold text-green-300 mb-2">Rumus Besar Bunga:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\boxed{B = M \times W \times P}" />
                    </div>
                    <div className="mt-3 space-y-1 font-body text-sm text-white/70">
                      <p><InlineMath math="B" /> = Besar bunga yang diperoleh/dibayar</p>
                      <p><InlineMath math="M" /> = Modal awal (pokok tabungan/pinjaman)</p>
                      <p><InlineMath math="W" /> = Waktu (dalam satuan yang sama dengan periode bunga)</p>
                      <p><InlineMath math="P" /> = Persentase bunga per periode (dalam bentuk desimal)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">Modal Akhir setelah W periode:</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\boxed{M_1 = M + B = M \times (1 + W \times P)}" />
                  </div>
                  <p className="font-body text-xs text-white/60"><InlineMath math="M_1" /> = Modal akhir setelah dikenakan bunga</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-purple-300 mb-2">Mencari Modal Awal:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="M = \frac{M_1}{1 + W \times P}" />
                    </div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-orange-300 mb-2">Mencari Waktu:</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="W = \frac{B}{M \times P}" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KONSISTENSI SATUAN WAKTU */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("satuan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Kunci: Konsistensi Satuan Waktu</span>
              </div>
              {expandedSections.includes("satuan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("satuan") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ini adalah jebakan paling umum dalam soal bunga tunggal! Pastikan satuan waktu <InlineMath math="W" /> selalu <strong className="text-orange-300">sesuai dengan periode bunga</strong> yang diberikan.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-orange-500/20">
                        <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30">Bunga Per...</th>
                        <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30">Satuan W</th>
                        <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30">Konversi Jika Perlu</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-orange-500/20">
                        <td className="px-3 py-2">Tahun</td>
                        <td className="px-3 py-2">Tahun</td>
                        <td className="px-3 py-2">Bulan ÷ 12 &nbsp;|&nbsp; Hari ÷ 365</td>
                      </tr>
                      <tr className="border border-orange-500/20 bg-slate-800/30">
                        <td className="px-3 py-2">Bulan</td>
                        <td className="px-3 py-2">Bulan</td>
                        <td className="px-3 py-2">Tahun × 12 &nbsp;|&nbsp; Hari ÷ 30</td>
                      </tr>
                      <tr className="border border-orange-500/20">
                        <td className="px-3 py-2">Hari</td>
                        <td className="px-3 py-2">Hari</td>
                        <td className="px-3 py-2">Tahun × 365 &nbsp;|&nbsp; Bulan × 30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Contoh konversi:</strong> Bunga 12% per tahun selama 9 bulan → <InlineMath math="W = \frac{9}{12} = \frac{3}{4}" /> tahun, <InlineMath math="P = 12\% = 0{,}12" />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KESALAHAN UMUM */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kesalahan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Kesalahan Umum & Tips Penting</span>
              </div>
              {expandedSections.includes("kesalahan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("kesalahan") && (
              <div className="px-5 pb-5 space-y-3">
                {[
                  {
                    salah: "Tidak mengonversi satuan waktu — langsung pakai angka bulan padahal bunga per tahun",
                    benar: "Selalu samakan satuan waktu W dengan periode bunga P. Jika P per tahun dan W diberikan dalam bulan, konversi W ke tahun (÷12).",
                  },
                  {
                    salah: "Menghitung bunga majemuk (bunga berbunga) saat soal meminta bunga tunggal",
                    benar: "Bunga tunggal: setiap periode bunga dihitung dari modal AWAL yang tetap, bukan dari total saldo sebelumnya.",
                  },
                  {
                    salah: "Lupa menambahkan bunga ke modal saat mencari modal akhir",
                    benar: "Modal Akhir = Modal + Bunga. Jangan lupa jumlahkan keduanya di langkah terakhir.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 text-xs font-bold shrink-0 mt-0.5">✗ SALAH:</span>
                      <p className="font-body text-xs text-red-300">{item.salah}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 text-xs font-bold shrink-0 mt-0.5">✓ BENAR:</span>
                      <p className="font-body text-xs text-green-300">{item.benar}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              {expandedSections.includes("contoh") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 – Menghitung Bunga & Modal Akhir</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Rafa menabung Rp2.000.000 di bank dengan bunga tunggal 6% per tahun. Berapa besar bunga yang diperoleh dan berapa total tabungannya setelah 2 tahun?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p className="text-xs text-white/60">✦ Diketahui: <InlineMath math="M = 2.000.000" />, <InlineMath math="P = 6\% = 0{,}06" />, <InlineMath math="W = 2 \text{ tahun}" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="B = M \times W \times P = 2.000.000 \times 2 \times 0{,}06 = \text{Rp}240.000" />
                        <BlockMath math="M_1 = M + B = 2.000.000 + 240.000 = \text{Rp}2.240.000" />
                      </div>
                      <p className="text-primary font-semibold">Bunga = Rp240.000. Total tabungan = <strong>Rp2.240.000</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Bunga Tahunan, Waktu dalam Bulan</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Ibu Ani meminjam uang Rp5.000.000 dengan bunga tunggal 18% per tahun. Berapa besar bunga yang harus dibayar setelah 8 bulan? Berapa total yang harus dikembalikan?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p className="text-xs text-white/60">✦ Bunga per tahun → konversi waktu: <InlineMath math="W = \frac{8}{12} = \frac{2}{3}" /> tahun</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="B = 5.000.000 \times \frac{2}{3} \times 0{,}18 = 5.000.000 \times 0{,}12 = \text{Rp}600.000" />
                        <BlockMath math="M_1 = 5.000.000 + 600.000 = \text{Rp}5.600.000" />
                      </div>
                      <p className="text-primary font-semibold">Bunga 8 bulan = Rp600.000. Total dikembalikan = <strong>Rp5.600.000</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Mencari Modal Awal dari Modal Akhir</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Setelah 2,5 tahun dengan bunga tunggal 8% per tahun, total tabungan Budi menjadi Rp3.600.000. Berapa modal awal yang ia tabungkan?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p className="text-xs text-white/60">✦ Diketahui: <InlineMath math="M_1 = 3.600.000" />, <InlineMath math="P = 8\% = 0{,}08" />, <InlineMath math="W = 2{,}5" /> tahun. Cari M.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="M_1 = M \times (1 + W \times P)" />
                        <BlockMath math="3.600.000 = M \times (1 + 2{,}5 \times 0{,}08)" />
                        <BlockMath math="3.600.000 = M \times 1{,}2" />
                        <BlockMath math="M = \frac{3.600.000}{1{,}2} = \text{Rp}3.000.000" />
                      </div>
                      <p className="text-primary font-semibold">Modal awal yang ditabung = <strong>Rp3.000.000</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("rangkuman")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Rangkuman Materi Bunga Tunggal</span>
              </div>
              {expandedSections.includes("rangkuman") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-border rounded-lg p-4 space-y-3">
                  {[
                    { no: "1", poin: "Bunga tunggal dihitung dari modal awal yang tetap setiap periodenya." },
                    { no: "2", poin: "Rumus: B = M × W × P. Modal akhir: M₁ = M + B = M(1 + W × P)." },
                    { no: "3", poin: "Satuan waktu W harus selalu disesuaikan dengan periode bunga P." },
                    { no: "4", poin: "Untuk mencari modal awal: M = M₁ ÷ (1 + W × P)." },
                    { no: "5", poin: "Bunga tunggal berbeda dengan bunga majemuk — tidak ada 'bunga dari bunga'." },
                  ].map((item) => (
                    <div key={item.no} className="flex items-start gap-3">
                      <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.no}</span>
                      <p className="font-body text-sm text-white/80">{item.poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-xs text-green-200 leading-relaxed">
                    <strong>Koneksi ke Kehidupan Nyata:</strong> Bunga tunggal dipakai pada tabungan jangka pendek, koperasi simpan pinjam, dan pinjaman informal. Kreditur (pemberi pinjaman) dan debitur (peminjam) sama-sama perlu memahami cara kerja bunga ini.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aritmetika-sosial"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aritmetika Sosial
          </button>
        </div>
      </div>
    </div>
  );
};

export default BungaTunggalPage;
