import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import JangkauanAnimasi from "@/components/JangkauanAnimasi";
import JIKdanSKAnimasi from "@/components/JIKdanSKAnimasi";

const PenyebaranDataPage = () => {
  const navigate = useNavigate();
  const expandedSections = ["intro", "konsep1", "contoh1", "konsep2", "contoh2", "rangkuman"];

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
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
          UKURAN PENYEBARAN DATA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Jangkauan · Jangkauan Interkuartil · Simpangan Kuartil</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Ukuran Penyebaran Data?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dua kelompok data bisa punya rata-rata yang sama, tapi karakter data-nya sangat berbeda. Nah, di sinilah <strong className="text-cyan-300">ukuran penyebaran data</strong> berperan — ia mengukur seberapa "menyebar" atau "rapat" data di sekitar pusatnya.
                </p>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">💡 Ilustrasi Pentingnya Penyebaran</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-xs font-bold text-green-300 mb-2">Tim A (Nilai Ujian)</p>
                      <div className="flex gap-1 flex-wrap">
                        {["68","70","70","71","71"].map((v,i)=>(
                          <span key={i} className="bg-green-700/40 text-green-200 text-xs px-2 py-0.5 rounded font-bold">{v}</span>
                        ))}
                      </div>
                      <p className="text-xs text-white/50 mt-2">Rata-rata = 70 ✓</p>
                      <p className="text-xs text-green-300 font-semibold">Data RAPAT 🎯</p>
                    </div>
                    <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-xs font-bold text-red-300 mb-2">Tim B (Nilai Ujian)</p>
                      <div className="flex gap-1 flex-wrap">
                        {["40","55","70","85","100"].map((v,i)=>(
                          <span key={i} className="bg-red-700/40 text-red-200 text-xs px-2 py-0.5 rounded font-bold">{v}</span>
                        ))}
                      </div>
                      <p className="text-xs text-white/50 mt-2">Rata-rata = 70 ✓</p>
                      <p className="text-xs text-red-300 font-semibold">Data MENYEBAR ⚡</p>
                    </div>
                  </div>
                  <p className="font-body text-xs text-white/60 text-center">Rata-ratanya sama, tapi sebarannya sangat berbeda!</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { simbol: "J", nama: "Jangkauan (Range)", desc: "Selisih nilai terbesar dan terkecil", color: "bg-emerald-900/40 border-emerald-500/40 text-emerald-300" },
                    { simbol: "JIK", nama: "Jangkauan Interkuartil", desc: "Selisih Q₃ dan Q₁ — mengukur sebaran 50% data tengah", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
                    { simbol: "Qd", nama: "Simpangan Kuartil", desc: "Setengah dari JIK — disebut juga semi-interkuartil", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                  ].map(({ simbol, nama, desc, color }) => (
                    <div key={simbol} className={`border ${color} rounded-xl p-3 flex items-center gap-4`}>
                      <p className="font-display text-xl font-bold min-w-[48px] text-center">{simbol}</p>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{nama}</p>
                        <p className="font-body text-xs text-white/50">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: DATA TUNGGAL ────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-emerald-400" title="📘 Sub-Bab 1: Ukuran Penyebaran Data Tunggal" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-emerald-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Untuk data tunggal, kita terlebih dahulu cari <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" /> (seperti materi sebelumnya), kemudian gunakan keduanya untuk menghitung ketiga ukuran penyebaran berikut:
                  </p>

                  <div className="space-y-3">
                    {/* Jangkauan */}
                    <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded">1</span>
                        <p className="font-body text-sm font-bold text-emerald-300">Jangkauan (Range)</p>
                      </div>
                      <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                        <BlockMath math="J = x_{\text{maks}} - x_{\text{min}}" />
                        <p className="text-xs text-white/50 font-body">selisih nilai terbesar dengan nilai terkecil</p>
                      </div>
                    </div>

                    <JangkauanAnimasi />

                    {/* Jangkauan Interkuartil */}
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-1 rounded">2</span>
                        <p className="font-body text-sm font-bold text-blue-300">Jangkauan Interkuartil (JIK)</p>
                      </div>
                      <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                        <BlockMath math="\text{JIK} = Q_3 - Q_1" />
                        <p className="text-xs text-white/50 font-body">mengukur sebaran 50% data di bagian tengah</p>
                      </div>
                    </div>

                    {/* Simpangan Kuartil */}
                    <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded">3</span>
                        <p className="font-body text-sm font-bold text-purple-300">Simpangan Kuartil (Qd)</p>
                      </div>
                      <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                        <BlockMath math="Q_d = \frac{Q_3 - Q_1}{2} = \frac{\text{JIK}}{2}" />
                        <p className="text-xs text-white/50 font-body">setengah dari JIK — disebut juga semi-interkuartil range</p>
                      </div>
                    </div>

                    <JIKdanSKAnimasi />
                  </div>
                </div>

                {/* Ilustrasi Visual Boxplot sederhana */}
                <div className="bg-slate-800/60 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-emerald-300 uppercase tracking-wide">📌 Visualisasi Lima Serangkai Data</p>
                  <p className="font-body text-xs text-white/60 mb-3">Data: 2, 5, 7, 8, 9, 12, 14, 16, 18, 20</p>

                  {/* ── Boxplot (skala 0–20) ── */}
                  {/* Posisi berdasarkan nilai / 20 × 100%:
                      Min=2 → 10%, Q₁=6 → 30%, Q₂=10.5 → 52.5%, Q₃=15 → 75%, Maks=20 → 100% */}
                  <div className="relative" style={{ paddingTop: "28px", paddingBottom: "24px" }}>

                    {/* Label lima serangkai — sejajar dengan posisi data */}
                    <div className="absolute top-0 left-0 right-0 h-7 pointer-events-none">
                      <span className="absolute text-[10px] font-bold text-white/60"
                        style={{ left: "10%", transform: "translateX(-50%)" }}>Min=2</span>
                      <span className="absolute text-[10px] font-bold text-green-300"
                        style={{ left: "30%", transform: "translateX(-50%)" }}>Q₁=6</span>
                      <span className="absolute text-[10px] font-bold text-cyan-300"
                        style={{ left: "52.5%", transform: "translateX(-50%)" }}>Q₂=10,5</span>
                      <span className="absolute text-[10px] font-bold text-orange-300"
                        style={{ left: "75%", transform: "translateX(-50%)" }}>Q₃=15</span>
                      <span className="absolute text-[10px] font-bold text-white/60"
                        style={{ left: "100%", transform: "translateX(-50%)" }}>Maks=20</span>
                    </div>

                    {/* Boxplot drawing area */}
                    <div className="relative" style={{ height: "40px" }}>

                      {/* Garis whisker kiri: Min → Q₁ */}
                      <div className="absolute bg-slate-400"
                        style={{ top: "50%", left: "10%", width: "20%", height: "2px", transform: "translateY(-50%)" }} />

                      {/* Garis whisker kanan: Q₃ → Maks */}
                      <div className="absolute bg-slate-400"
                        style={{ top: "50%", left: "75%", width: "25%", height: "2px", transform: "translateY(-50%)" }} />

                      {/* Kotak IQR: Q₁ → Q₃ */}
                      <div className="absolute rounded border-2 border-blue-400/70 bg-blue-800/30"
                        style={{ top: "10%", bottom: "10%", left: "30%", width: "45%" }} />

                      {/* Garis median Q₂ */}
                      <div className="absolute bg-cyan-400 rounded"
                        style={{ top: "10%", bottom: "10%", left: "52.5%", width: "2px", transform: "translateX(-50%)" }} />

                      {/* Tanda tegak di Min */}
                      <div className="absolute bg-white/50 rounded"
                        style={{ top: "20%", bottom: "20%", left: "10%", width: "2px", transform: "translateX(-50%)" }} />

                      {/* Tanda tegak di Maks */}
                      <div className="absolute bg-white/50 rounded"
                        style={{ top: "20%", bottom: "20%", left: "100%", width: "2px", transform: "translateX(-50%)" }} />
                    </div>

                    {/* Sumbu skala 0–5–10–15–20 */}
                    <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                      <div className="relative h-5">
                        {[0, 5, 10, 15, 20].map((v) => (
                          <span key={v}
                            className="absolute text-[10px] text-white/30"
                            style={{ left: `${(v / 20) * 100}%`, transform: "translateX(-50%)" }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Keterangan warna */}
                    <div className="flex flex-wrap gap-3 mt-1 pt-1">
                      {[
                        { cls: "bg-blue-500/50 border-blue-400/60",  label: "Kotak IQR (Q₁–Q₃)" },
                        { cls: "bg-cyan-400",                        label: "Median (Q₂)" },
                        { cls: "bg-slate-400",                       label: "Whisker (Min–Maks)" },
                      ].map(({ cls, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <span className={`w-3 h-3 rounded border inline-block ${cls}`} />
                          <span className="text-[10px] text-white/40">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <BlockMath math="J = 20 - 2 = 18" />
                    <BlockMath math="\text{JIK} = Q_3 - Q_1 = 15 - 6 = 9" />
                    <BlockMath math="Q_d = \frac{9}{2} = 4{,}5" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Keunggulan JIK & Qd:</strong> Tidak terpengaruh oleh nilai ekstrem (outlier), karena hanya memperhitungkan 50% data di bagian tengah. Lebih stabil dibanding Jangkauan biasa.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 1 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-emerald-400" title="📝 Contoh Soal — Penyebaran Data Tunggal" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data tinggi badan (cm) 7 siswa: 155, 162, 148, 170, 158, 165, 152.<br />
                      Hitung jangkauan, JIK, dan simpangan kuartilnya!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan data (n = 7):</p>
                      <div className="flex gap-2 flex-wrap">
                        {["148","152","155","158","162","165","170"].map((v,i)=>(
                          <div key={i} className="bg-slate-700/60 border border-green-500/30 rounded-lg px-3 py-1 text-green-300 font-bold text-sm">{v}</div>
                        ))}
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung Jangkauan:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="J = x_{\text{maks}} - x_{\text{min}} = 170 - 148 = 22 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 3:</strong> Cari <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="Q_1 \text{ di posisi } \frac{8}{4} = 2 \Rightarrow Q_1 = 152" />
                        <BlockMath math="Q_3 \text{ di posisi } \frac{24}{4} = 6 \Rightarrow Q_3 = 165" />
                      </div>
                      <p><strong>Langkah 4:</strong> Hitung JIK dan Qd:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{JIK} = Q_3 - Q_1 = 165 - 152 = 13 \text{ cm}" />
                        <BlockMath math="Q_d = \frac{13}{2} = 6{,}5 \text{ cm}" />
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                        <p><strong className="text-green-300">Hasil:</strong> J = 22 cm · JIK = 13 cm · Qd = 6,5 cm</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui data nilai ujian 10 siswa (sudah urut): 55, 60, 65, 70, 72, 78, 80, 85, 88, 95.<br />
                      Jika nilai 95 diganti 135 (outlier), bandingkan jangkauan dan JIK sebelum dan sesudah perubahan!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Data Awal</strong> (n=10): 55, 60, 65, 70, 72, 78, 80, 85, 88, 95</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="J_{\text{awal}} = 95 - 55 = 40" />
                        <BlockMath math="Q_1 = \frac{11}{4} = 2{,}75 \Rightarrow Q_1 = 60 + 0{,}75(65-60) = 63{,}75" />
                        <BlockMath math="Q_3 = \frac{33}{4} = 8{,}25 \Rightarrow Q_3 = 85 + 0{,}25(88-85) = 85{,}75" />
                        <BlockMath math="\text{JIK}_{\text{awal}} = 85{,}75 - 63{,}75 = 22" />
                      </div>
                      <p><strong>Data Setelah</strong> 95 → 135: 55, 60, 65, 70, 72, 78, 80, 85, 88, 135</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="J_{\text{baru}} = 135 - 55 = 80 \quad \text{(naik 2 kali lipat!!)}" />
                        <p className="text-xs text-white/50">Q₁ dan Q₃ tidak berubah karena 135 ada di posisi terakhir (tidak mempengaruhi Q₁ dan Q₃)</p>
                        <BlockMath math="\text{JIK}_{\text{baru}} = 85{,}75 - 63{,}75 = 22 \quad \text{(tidak berubah)}" />
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-yellow-200"><strong>Kesimpulan:</strong> Jangkauan berubah drastis (40→80), tapi <strong>JIK tetap sama (22)</strong>. Ini membuktikan JIK lebih tahan terhadap outlier!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data berat badan (kg) 12 siswa: 40, 44, 47, 50, 52, 55, 58, 60, 63, 65, 70, 75.<br />
                      Diketahui simpangan kuartil <InlineMath math="Q_d = 8" />. Sebuah data baru ditambahkan, dan nilai <InlineMath math="Q_3" /> berubah menjadi 66. Jika <InlineMath math="Q_1" /> tetap, tentukan nilai JIK yang baru dan data apa yang ditambahkan!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" /> awal (n=12):</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Pos. }Q_1 = \frac{13}{4} = 3{,}25 \Rightarrow Q_1 = 47 + 0{,}25(50-47) = 47{,}75" />
                        <BlockMath math="\text{Pos. }Q_3 = \frac{39}{4} = 9{,}75 \Rightarrow Q_3 = 63 + 0{,}75(65-63) = 64{,}5" />
                        <BlockMath math="Q_d = \frac{64{,}5 - 47{,}75}{2} = \frac{16{,}75}{2} = 8{,}375 \approx 8 \checkmark" />
                      </div>
                      <p><strong>Langkah 2:</strong> Dengan data baru, <InlineMath math="Q_3 = 66" /> dan <InlineMath math="Q_1 = 47{,}75" /> (tetap):</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{JIK}_{\text{baru}} = Q_3 - Q_1 = 66 - 47{,}75 = 18{,}25" />
                        <BlockMath math="Q_{d,\text{baru}} = \frac{18{,}25}{2} = 9{,}125" />
                      </div>
                      <p><strong>Langkah 3:</strong> Identifikasi data baru.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-xs text-white/60">n baru = 13. Posisi Q₃ baru = 3(14)/4 = 10,5 → rata-rata data ke-10 dan ke-11. Agar Q₃ = 66, data baru harus berpengaruh pada posisi ke-10 atau ke-11. Data ke-10 = 65, jadi data baru yang masuk di sekitar 67: misal <strong className="text-red-300">67 kg</strong>.</p>
                        <p className="text-xs text-white/50 mt-1">Data terurut baru: 40, 44, 47, 50, 52, 55, 58, 60, 63, 65, <strong>67</strong>, 70, 75 → Q₃ pada posisi 10,5 = (65+67)/2 = 66 ✓</p>
                      </div>
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                        <p><strong className="text-red-300">Jawaban:</strong> Data yang ditambahkan adalah <InlineMath math="67" /> kg.<br />
                        JIK baru = <InlineMath math="18{,}25" /> kg dan <InlineMath math="Q_d = 9{,}125" /> kg.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: TABEL DISTRIBUSI FREKUENSI TUNGGAL ───────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title="📘 Sub-Bab 2: Penyebaran Data pada Tabel Distribusi Frekuensi Tunggal" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika data disajikan dalam <strong className="text-blue-300">tabel distribusi frekuensi tunggal</strong>, cara menghitung J, JIK, dan Qd pada dasarnya sama — kita tetap butuh <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" /> yang dicari via frekuensi kumulatif, kemudian menerapkan rumus yang sudah kita kenal.
                  </p>

                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center">Alur Kerja Menghitung Penyebaran dari Tabel Frekuensi Tunggal</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { n: "1", t: "Buat kolom Frekuensi Kumulatif (FK)", c: "text-blue-300" },
                        { n: "2", t: "Cari Q₁ dan Q₃ menggunakan posisi k(n+1)/4", c: "text-blue-300" },
                        { n: "3", t: "Hitung J = x_maks − x_min dari nilai di tabel", c: "text-emerald-300" },
                        { n: "4", t: "Hitung JIK = Q₃ − Q₁", c: "text-purple-300" },
                        { n: "5", t: "Hitung Qd = JIK / 2", c: "text-pink-300" },
                      ].map(({ n, t, c }) => (
                        <div key={n} className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
                          <span className="font-display font-bold text-white/30 text-sm">{n}</span>
                          <span className={`font-body text-xs ${c}`}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contoh tabel + perhitungan lengkap */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                  <div className="bg-blue-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">📋 Contoh Tabel — Jumlah Absensi 50 Siswa dalam Sebulan</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/40">
                          <th className="px-3 py-2 text-left text-blue-300 font-bold">Absensi (hari)</th>
                          <th className="px-3 py-2 text-center text-white/70">f</th>
                          <th className="px-3 py-2 text-center text-yellow-300 font-bold">FK</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["0","8","8"],
                          ["1","12","20"],
                          ["2","15","35"],
                          ["3","9","44"],
                          ["4","4","48"],
                          ["5","2","50"],
                        ].map(([x, f, fk]) => (
                          <tr key={x} className={`hover:bg-slate-700/20
                            ${parseInt(fk) === 20 ? "bg-green-900/20" : ""}
                            ${parseInt(fk) === 35 ? "bg-cyan-900/20" : ""}
                            ${parseInt(fk) === 44 ? "bg-orange-900/20" : ""}`}>
                            <td className="px-3 py-2 text-white font-semibold">{x}</td>
                            <td className="px-3 py-2 text-center text-green-300">{f}</td>
                            <td className="px-3 py-2 text-center text-yellow-300 font-bold">{fk}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-700/30 border-t border-slate-500/50">
                          <td className="px-3 py-2 text-white font-bold">Total</td>
                          <td className="px-3 py-2 text-center text-green-400 font-bold">50</td>
                          <td className="px-3 py-2 text-center text-yellow-400">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-white/50">n = 50:</p>
                      <BlockMath math="\text{Pos. }Q_1 = \frac{51}{4} = 12{,}75 \Rightarrow FK \geq 12{,}75 \to FK=20 \Rightarrow Q_1 = 1" />
                      <BlockMath math="\text{Pos. }Q_3 = \frac{153}{4} = 38{,}25 \Rightarrow FK \geq 38{,}25 \to FK=44 \Rightarrow Q_3 = 3" />
                      <BlockMath math="J = x_{\text{maks}} - x_{\text{min}} = 5 - 0 = 5 \text{ hari}" />
                      <BlockMath math="\text{JIK} = 3 - 1 = 2 \text{ hari}" />
                      <BlockMath math="Q_d = \frac{2}{2} = 1 \text{ hari}" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan Penting:</strong> Untuk tabel distribusi frekuensi tunggal, <InlineMath math="x_{\text{maks}}" /> dan <InlineMath math="x_{\text{min}}" /> adalah nilai terbesar dan terkecil yang tertulis dalam kolom nilai, bukan frekuensinya.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 2 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Penyebaran Data Tabel Frekuensi Tunggal" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-2">Tabel distribusi frekuensi jumlah buku yang dibaca 30 siswa selama sebulan:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">Jumlah Buku</th><th className="px-3 py-1 text-center text-white/70">Frekuensi</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["1","4"],["2","8"],["3","10"],["4","6"],["5","2"]].map(([v,f])=>(
                            <tr key={v}><td className="px-3 py-1 text-white font-semibold">{v}</td><td className="px-3 py-1 text-center text-green-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">Tentukan J, JIK, dan Qd!</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat FK (n = 30):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Buku</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["1","4","4"],["2","8","12"],["3","10","22"],["4","6","28"],["5","2","30"]].map(([v,f,fk])=>(
                              <tr key={v} className={parseInt(fk)===12?"bg-green-900/20":parseInt(fk)===22?"bg-orange-900/20":""}>
                                <td className="px-2 py-1 text-white font-semibold">{v}</td>
                                <td className="px-2 py-1 text-center text-green-300">{f}</td>
                                <td className="px-2 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Cari kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Pos. }Q_1 = \frac{31}{4} = 7{,}75 \Rightarrow FK \geq 7{,}75 \to FK=12 \Rightarrow Q_1 = 2" />
                        <BlockMath math="\text{Pos. }Q_3 = \frac{93}{4} = 23{,}25 \Rightarrow FK \geq 23{,}25 \to FK=28 \Rightarrow Q_3 = 4" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung ukuran penyebaran.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="J = 5 - 1 = 4 \text{ buku}" />
                        <BlockMath math="\text{JIK} = 4 - 2 = 2 \text{ buku}" />
                        <BlockMath math="Q_d = \frac{2}{2} = 1 \text{ buku}" />
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                        <p><strong className="text-green-300">Hasil:</strong> J = 4 · JIK = 2 · Qd = 1 (dalam satuan buku)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-2">Data skor game 40 pemain esports:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">Skor</th><th className="px-3 py-1 text-center text-white/70">Frekuensi</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["30","5"],["40","10"],["50","12"],["60","8"],["70","5"]].map(([v,f])=>(
                            <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-yellow-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">Hitung simpangan kuartil dan interpretasikan artinya!</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Buat FK</strong> (n = 40):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Skor</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["30","5","5"],["40","10","15"],["50","12","27"],["60","8","35"],["70","5","40"]].map(([v,f,fk])=>(
                              <tr key={v} className={parseInt(fk)===15?"bg-green-900/20":parseInt(fk)===35?"bg-orange-900/20":""}>
                                <td className="px-2 py-1 text-white">{v}</td>
                                <td className="px-2 py-1 text-center text-yellow-300">{f}</td>
                                <td className="px-2 py-1 text-center text-yellow-400 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Pos. }Q_1 = \frac{41}{4} = 10{,}25 \Rightarrow FK \geq 10{,}25 \to FK=15 \Rightarrow Q_1 = 40" />
                        <BlockMath math="\text{Pos. }Q_3 = \frac{123}{4} = 30{,}75 \Rightarrow FK \geq 30{,}75 \to FK=35 \Rightarrow Q_3 = 60" />
                        <BlockMath math="\text{JIK} = 60 - 40 = 20" />
                        <BlockMath math="Q_d = \frac{20}{2} = 10" />
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-yellow-200"><strong>Interpretasi:</strong> Simpangan kuartil = 10. Artinya, 50% pemain di bagian tengah memiliki skor yang "menyimpang" rata-rata sebesar <strong>10 poin</strong> dari median. Semakin kecil Qd, semakin seragam kemampuan para pemain.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-2">
                      Data nilai keterampilan 60 siswa dalam skala 1–10:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">Nilai</th><th className="px-3 py-1 text-center text-white/70">f</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["5","4"],["6","9"],["7","15"],["8","18"],["9","10"],["10","4"]].map(([v,f])=>(
                            <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-red-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">
                      a) Hitung J, JIK, dan Qd.<br />
                      b) Tentukan persentase siswa yang nilainya berada dalam rentang <InlineMath math="[Q_2 - Q_d,\ Q_2 + Q_d]" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat FK (n = 60):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Nilai</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["5","4","4"],["6","9","13"],["7","15","28"],["8","18","46"],["9","10","56"],["10","4","60"]].map(([v,f,fk])=>(
                              <tr key={v} className={
                                parseInt(fk)===13?"bg-green-900/20":
                                parseInt(fk)===28?"bg-cyan-900/20":
                                parseInt(fk)===46?"bg-orange-900/20":""
                              }>
                                <td className="px-2 py-1 text-white font-semibold">{v}</td>
                                <td className="px-2 py-1 text-center text-red-300">{f}</td>
                                <td className="px-2 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Cari semua kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Pos. }Q_1 = \frac{61}{4} = 15{,}25 \Rightarrow FK \geq 15{,}25 \to FK=28 \Rightarrow Q_1 = 7" />
                        <BlockMath math="\text{Pos. }Q_2 = \frac{122}{4} = 30{,}5 \Rightarrow FK \geq 30{,}5 \to FK=46 \Rightarrow Q_2 = 8" />
                        <BlockMath math="\text{Pos. }Q_3 = \frac{183}{4} = 45{,}75 \Rightarrow FK \geq 45{,}75 \to FK=46 \Rightarrow Q_3 = 8" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung ukuran penyebaran.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="J = 10 - 5 = 5" />
                        <BlockMath math="\text{JIK} = Q_3 - Q_1 = 8 - 7 = 1" />
                        <BlockMath math="Q_d = \frac{1}{2} = 0{,}5" />
                      </div>
                      <p><strong>Langkah 4:</strong> Hitung rentang <InlineMath math="[Q_2 - Q_d,\ Q_2 + Q_d]" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="[8 - 0{,}5,\ 8 + 0{,}5] = [7{,}5;\ 8{,}5]" />
                        <p className="text-xs text-white/60">Nilai yang masuk rentang ini: hanya nilai <strong className="text-red-300">8</strong> (f = 18)</p>
                        <BlockMath math="\text{Persentase} = \frac{18}{60} \times 100\% = 30\%" />
                      </div>
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 space-y-1">
                        <p><strong className="text-red-300">Jawaban:</strong></p>
                        <p>a) J = 5, JIK = 1, Qd = 0,5</p>
                        <p>b) Hanya <strong>30% siswa (18 dari 60)</strong> yang nilainya dalam rentang <InlineMath math="[7{,}5;\ 8{,}5]" />. Ini menunjukkan data cukup terkonsentrasi di nilai 8.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RANGKUMAN ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-emerald-400" title="📋 Rangkuman — Ukuran Penyebaran Data" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-slate-700/40">
                        <th className="px-3 py-2 text-left text-white/70">Ukuran</th>
                        <th className="px-3 py-2 text-center text-white/70">Rumus</th>
                        <th className="px-3 py-2 text-left text-white/70">Kelebihan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      <tr className="hover:bg-slate-700/20">
                        <td className="px-3 py-2 text-emerald-300 font-bold">Jangkauan (J)</td>
                        <td className="px-3 py-2 text-center"><InlineMath math="x_{\text{maks}} - x_{\text{min}}" /></td>
                        <td className="px-3 py-2 text-white/60">Mudah dihitung</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20">
                        <td className="px-3 py-2 text-blue-300 font-bold">JIK</td>
                        <td className="px-3 py-2 text-center"><InlineMath math="Q_3 - Q_1" /></td>
                        <td className="px-3 py-2 text-white/60">Tahan outlier</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20">
                        <td className="px-3 py-2 text-purple-300 font-bold">Simpangan Kuartil (Qd)</td>
                        <td className="px-3 py-2 text-center"><InlineMath math="\dfrac{Q_3 - Q_1}{2}" /></td>
                        <td className="px-3 py-2 text-white/60">Stabil & intuitif</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: "Data Tunggal", color: "border-emerald-500/40 bg-emerald-900/20", points: ["Urutkan dulu, cari Q₁ dan Q₃ dengan rumus posisi.", "Gunakan interpolasi jika posisi berupa bilangan desimal.", "J = nilai terbesar − nilai terkecil dari data asli."] },
                    { title: "Tabel Frekuensi Tunggal", color: "border-blue-500/40 bg-blue-900/20", points: ["Buat kolom FK terlebih dahulu.", "Cari Q₁ dan Q₃ dari FK (FK pertama ≥ posisi).", "J = nilai terbesar − nilai terkecil dalam tabel."] },
                  ].map(({ title, color, points }) => (
                    <div key={title} className={`border ${color} rounded-xl p-4`}>
                      <p className="font-body text-sm font-bold text-white mb-2">{title}</p>
                      <ul className="space-y-1">
                        {points.map((p) => (
                          <li key={p} className="font-body text-xs text-white/70 flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span><span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                  <p className="font-body text-sm text-purple-200">
                    <strong>Makin kecil Qd → data makin seragam (homogen)</strong><br />
                    <strong>Makin besar Qd → data makin beragam (heterogen)</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              ← Kembali ke Statistika Kelas 9
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PenyebaranDataPage;
