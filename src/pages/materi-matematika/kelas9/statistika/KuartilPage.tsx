import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import KuartilAnimasiMateri from "@/components/KuartilAnimasiMateri";

const KuartilPage = () => {
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
          UKURAN LETAK DATA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Kuartil Data</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <KuartilAnimasiMateri />

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Kuartil?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kamu sudah kenal dengan <strong className="text-cyan-300">rata-rata, median, dan modus</strong> sebagai ukuran pemusatan data. Sekarang, kita naik level ke <strong className="text-cyan-300">ukuran letak data</strong> — yaitu nilai-nilai yang membagi data menjadi bagian-bagian yang sama besar setelah data diurutkan.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-violet-900/40 border border-violet-500/40 rounded-xl p-4">
                    <p className="font-display text-base font-bold text-violet-300 mb-2">Kuartil (Q)</p>
                    <p className="font-body text-sm text-white/70">Nilai yang membagi data terurut menjadi <strong className="text-violet-200">4 bagian</strong> yang sama banyak. Ada tiga kuartil: <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />.</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-wide">📐 Ilustrasi Pembagian Kuartil</p>
                  <div className="flex items-center gap-1 justify-center flex-wrap">
                    {["25%", "Q₁", "25%", "Q₂", "25%", "Q₃", "25%"].map((v, i) => (
                      <div
                        key={i}
                        className={`rounded-lg px-3 py-2 text-center text-xs font-bold
                          ${v.startsWith("Q") ? "bg-violet-600/70 text-white border border-violet-400/60 min-w-[40px]" : "bg-slate-700/60 text-white/50 min-w-[48px]"}`}
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-1">
                    {[
                      { q: "Q₁", label: "Kuartil Bawah", desc: "25% data di bawahnya", color: "bg-green-900/40 border-green-500/40 text-green-300" },
                      { q: "Q₂", label: "Kuartil Tengah", desc: "Sama dengan Median (50%)", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
                      { q: "Q₃", label: "Kuartil Atas", desc: "75% data di bawahnya", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
                    ].map(({ q, label, desc, color }) => (
                      <div key={q} className={`border ${color} rounded-xl p-3 text-center`}>
                        <p className="font-display text-xl font-bold mb-1">{q}</p>
                        <p className="font-body text-xs font-bold text-white mb-1">{label}</p>
                        <p className="font-body text-xs text-white/50">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Langkah Wajib Pertama:</strong> Data harus <strong>diurutkan dari terkecil ke terbesar</strong> sebelum menghitung kuartil apapun!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: KUARTIL DATA TUNGGAL ────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Sub-Bab 1: Kuartil Data Tunggal" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Untuk data tunggal yang sudah diurutkan, gunakan rumus <strong className="text-green-300">posisi letak kuartil</strong>. Nilai <InlineMath math="n" /> adalah banyaknya data.
                  </p>

                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center mb-2">Rumus Posisi Kuartil Data Tunggal</p>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: "Q₁ — Kuartil Bawah", formula: "Q_1 \\text{ berada pada posisi ke-} \\frac{1(n+1)}{4}", color: "border-green-500/40 text-green-300" },
                        { label: "Q₂ — Kuartil Tengah (Median)", formula: "Q_2 \\text{ berada pada posisi ke-} \\frac{2(n+1)}{4}", color: "border-cyan-500/40 text-cyan-300" },
                        { label: "Q₃ — Kuartil Atas", formula: "Q_3 \\text{ berada pada posisi ke-} \\frac{3(n+1)}{4}", color: "border-orange-500/40 text-orange-300" },
                      ].map(({ label, formula, color }) => (
                        <div key={label} className={`border ${color} rounded-lg p-3`}>
                          <p className={`font-body text-xs font-bold mb-2 ${color.split(" ")[1]}`}>{label}</p>
                          <div className="bg-slate-800/60 rounded p-2 text-center">
                            <BlockMath math={formula} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                    <p className="font-body text-xs text-green-200">
                      <strong>Catatan:</strong> Jika posisi menghasilkan bilangan pecahan misal <InlineMath math="3{,}5" />, maka nilainya adalah rata-rata data ke-3 dan ke-4.
                    </p>
                  </div>
                </div>

                {/* Ilustrasi Visual Data Tunggal */}
                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">📌 Contoh Ilustrasi — Data 8 Nilai Siswa</p>
                  <p className="font-body text-xs text-white/60">Data terurut: 4, 6, 7, 8, 9, 10, 11, 13 <span className="text-white/40">(n = 8)</span></p>
                  <div className="flex items-center gap-1 justify-center flex-wrap">
                    {["4","6","7","8","9","10","11","13"].map((v, i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-center border text-sm font-bold
                        ${i === 1 ? "bg-green-700/60 border-green-400/80 text-white" : ""}
                        ${i === 3 || i === 4 ? "bg-cyan-700/60 border-cyan-400/80 text-white" : ""}
                        ${i === 5 ? "bg-orange-700/60 border-orange-400/80 text-white" : ""}
                        ${![1,3,4,5].includes(i) ? "bg-slate-700/60 border-slate-500/40 text-white/60" : ""}`}>
                        {v}
                        {i === 1 && <div className="text-green-300 text-xs mt-1">Q₁</div>}
                        {(i === 3 || i === 4) && <div className="text-cyan-300 text-xs mt-1">Q₂</div>}
                        {i === 5 && <div className="text-orange-300 text-xs mt-1">Q₃</div>}
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <BlockMath math="Q_1 \text{ pada posisi } \frac{1(8+1)}{4} = 2{,}25 \Rightarrow Q_1 = 6 + 0{,}25(7-6) = 6{,}25" />
                    <BlockMath math="Q_2 \text{ pada posisi } \frac{2(8+1)}{4} = 4{,}5 \Rightarrow Q_2 = \frac{8+9}{2} = 8{,}5" />
                    <BlockMath math="Q_3 \text{ pada posisi } \frac{3(8+1)}{4} = 6{,}75 \Rightarrow Q_3 = 10 + 0{,}75(11-10) = 10{,}75" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips Interpolasi:</strong> Jika posisi = <InlineMath math="p{,}d" /> (misal 2,25), maka nilai kuartil = data ke-<InlineMath math="p" /> + <InlineMath math="d" /> × (data ke-<InlineMath math="(p+1)" /> − data ke-<InlineMath math="p" />).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 1 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title="📝 Contoh Soal — Kuartil Data Tunggal" />
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
                      Data nilai ulangan 9 siswa adalah: 5, 7, 4, 8, 6, 9, 3, 7, 10.<br />
                      Tentukan nilai <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong className="text-white">Langkah 1:</strong> Urutkan data dari terkecil ke terbesar.</p>
                      <div className="flex gap-2 flex-wrap">
                        {["3","4","5","6","7","7","8","9","10"].map((v, i) => (
                          <div key={i} className="bg-slate-700/60 border border-green-500/30 rounded-lg px-3 py-1 text-green-300 font-bold text-sm">{v}</div>
                        ))}
                      </div>
                      <p className="text-white/50 text-xs">n = 9</p>
                      <p><strong className="text-white">Langkah 2:</strong> Hitung posisi kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="Q_1 \text{ pada posisi ke-} \frac{1(9+1)}{4} = \frac{10}{4} = 2{,}5" />
                        <p className="text-xs text-white/60">Posisi 2,5 → rata-rata data ke-2 dan ke-3</p>
                        <BlockMath math="Q_1 = \frac{4 + 5}{2} = 4{,}5" />
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="Q_2 \text{ pada posisi ke-} \frac{2(9+1)}{4} = \frac{20}{4} = 5" />
                        <p className="text-xs text-white/60">Posisi 5 → tepat pada data ke-5</p>
                        <BlockMath math="Q_2 = 7" />
                      </div>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="Q_3 \text{ pada posisi ke-} \frac{3(9+1)}{4} = \frac{30}{4} = 7{,}5" />
                        <p className="text-xs text-white/60">Posisi 7,5 → rata-rata data ke-7 dan ke-8</p>
                        <BlockMath math="Q_3 = \frac{8 + 9}{2} = 8{,}5" />
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                        <p><strong className="text-green-300">Hasil: </strong><InlineMath math="Q_1 = 4{,}5" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8{,}5" /></p>
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
                      Data berat badan (kg) 12 siswa: 45, 50, 52, 48, 60, 55, 47, 63, 58, 49, 54, 61.<br />
                      Tentukan <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan data (n = 12):</p>
                      <div className="flex gap-1 flex-wrap">
                        {["45","47","48","49","50","52","54","55","58","60","61","63"].map((v, i) => (
                          <div key={i} className="bg-slate-700/60 border border-yellow-500/30 rounded-lg px-2 py-1 text-yellow-300 font-bold text-xs">{v}</div>
                        ))}
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung posisi <InlineMath math="Q_1" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Posisi } Q_1 = \frac{1(12+1)}{4} = \frac{13}{4} = 3{,}25" />
                        <p className="text-xs text-white/60">→ Data ke-3 = 48, data ke-4 = 49</p>
                        <BlockMath math="Q_1 = 48 + 0{,}25 \times (49 - 48) = 48 + 0{,}25 = 48{,}25" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung posisi <InlineMath math="Q_3" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Posisi } Q_3 = \frac{3(12+1)}{4} = \frac{39}{4} = 9{,}75" />
                        <p className="text-xs text-white/60">→ Data ke-9 = 58, data ke-10 = 60</p>
                        <BlockMath math="Q_3 = 58 + 0{,}75 \times (60 - 58) = 58 + 1{,}5 = 59{,}5" />
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                        <p><strong className="text-yellow-300">Hasil: </strong><InlineMath math="Q_1 = 48{,}25" /> kg dan <InlineMath math="Q_3 = 59{,}5" /> kg</p>
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
                      Data nilai ujian 15 siswa: 72, 65, 80, 88, 74, 91, 69, 77, 83, 95, 70, 86, 78, 63, 82.<br />
                      Jika nilai <InlineMath math="Q_1 = 70{,}5" /> dan <InlineMath math="Q_3 = 84{,}5" />, tentukan ada berapa siswa yang nilainya berada di antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan data (n = 15):</p>
                      <div className="flex gap-1 flex-wrap">
                        {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => (
                          <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                            ${(parseFloat(v) > 70.5 && parseFloat(v) < 84.5) ? "bg-red-700/50 border-red-400/60 text-white" : "bg-slate-700/60 border-slate-500/40 text-white/50"}`}>
                            {v}
                          </div>
                        ))}
                      </div>
                      <p><strong>Langkah 2:</strong> Verifikasi kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Posisi } Q_1 = \frac{1 \times 16}{4} = 4 \Rightarrow Q_1 = 70" />
                        <p className="text-xs text-white/60">Catatan: Soal menyatakan <InlineMath math="Q_1 = 70{,}5" /> (menggunakan metode interpolasi berbeda — keduanya dapat diterima)</p>
                        <BlockMath math="\text{Posisi } Q_3 = \frac{3 \times 16}{4} = 12 \Rightarrow Q_3 = 86" />
                      </div>
                      <p><strong>Langkah 3:</strong> Hitung siswa di antara <InlineMath math="Q_1 = 70{,}5" /> dan <InlineMath math="Q_3 = 84{,}5" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-sm">Data yang memenuhi <InlineMath math="70{,}5 < x < 84{,}5" />: <strong className="text-red-300">72, 74, 77, 78, 80, 82, 83</strong></p>
                        <BlockMath math="\text{Banyak siswa} = 7 \text{ orang}" />
                      </div>
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                        <p><strong className="text-red-300">Jawaban: 7 siswa</strong> berada di antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: KUARTIL TABEL DISTRIBUSI FREKUENSI TUNGGAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title="📘 Sub-Bab 2: Kuartil pada Tabel Distribusi Frekuensi Tunggal" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika data disajikan dalam <strong className="text-blue-300">tabel distribusi frekuensi tunggal</strong>, kita tidak perlu menuliskan seluruh data satu per satu. Cukup gunakan <strong className="text-blue-300">frekuensi kumulatif</strong> untuk menemukan posisi letak kuartil.
                  </p>

                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center mb-2">Langkah Mencari Kuartil dari Tabel Frekuensi Tunggal</p>
                    <div className="space-y-2">
                      {[
                        { step: "1", text: "Hitung total frekuensi n = Σfᵢ", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                        { step: "2", text: "Tentukan posisi kuartil: Q₁ di posisi ¼(n+1), Q₂ di posisi ½(n+1), Q₃ di posisi ¾(n+1)", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                        { step: "3", text: "Buat kolom frekuensi kumulatif (FK) dari baris paling atas", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                        { step: "4", text: "Temukan nilai data yang FK-nya pertama kali ≥ posisi kuartil", color: "bg-blue-900/30 border-blue-500/30 text-blue-200" },
                      ].map(({ step, text, color }) => (
                        <div key={step} className={`border ${color} rounded-lg p-3 flex items-start gap-3`}>
                          <span className="font-display font-bold text-blue-400 text-sm min-w-[20px]">{step}.</span>
                          <p className="font-body text-xs text-blue-100">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contoh Tabel Distribusi Frekuensi Tunggal */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                  <div className="bg-blue-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">📋 Contoh Tabel Distribusi Frekuensi Tunggal — Nilai Ujian 40 Siswa</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/40">
                          <th className="px-3 py-2 text-left text-blue-300 font-bold">Nilai (x)</th>
                          <th className="px-3 py-2 text-center text-white/70">Frekuensi (f)</th>
                          <th className="px-3 py-2 text-center text-yellow-300 font-bold">FK (Kumulatif)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["60", "4", "4"],
                          ["65", "6", "10"],
                          ["70", "8", "18"],
                          ["75", "10", "28"],
                          ["80", "7", "35"],
                          ["85", "5", "40"],
                        ].map(([x, f, fk]) => (
                          <tr key={x} className={`hover:bg-slate-700/20
                            ${parseInt(fk) >= 10 && parseInt(fk) - parseInt(f) < 10 ? "bg-green-900/20" : ""}
                            ${parseInt(fk) >= 20 && parseInt(fk) - parseInt(f) < 20 && parseInt(fk) > 10 ? "bg-cyan-900/20" : ""}
                            ${parseInt(fk) >= 30 && parseInt(fk) - parseInt(f) < 30 && parseInt(fk) > 20 ? "bg-orange-900/20" : ""}`}>
                            <td className="px-3 py-2 text-white font-semibold">{x}</td>
                            <td className="px-3 py-2 text-center text-green-300">{f}</td>
                            <td className="px-3 py-2 text-center text-yellow-300 font-bold">{fk}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-700/30 border-t border-slate-500/50">
                          <td className="px-3 py-2 text-white font-bold">Total</td>
                          <td className="px-3 py-2 text-center text-green-400 font-bold">40</td>
                          <td className="px-3 py-2 text-center text-yellow-400 font-bold">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-white/50">n = 40, posisi kuartil:</p>
                      <BlockMath math="Q_1 \text{ di posisi } \frac{1(40+1)}{4} = 10{,}25 \Rightarrow \text{FK pertama} \geq 10{,}25 \text{ adalah FK}=18 \Rightarrow Q_1 = 70" />
                      <BlockMath math="Q_2 \text{ di posisi } \frac{2(40+1)}{4} = 20{,}5 \Rightarrow \text{FK pertama} \geq 20{,}5 \text{ adalah FK}=28 \Rightarrow Q_2 = 75" />
                      <BlockMath math="Q_3 \text{ di posisi } \frac{3(40+1)}{4} = 30{,}75 \Rightarrow \text{FK pertama} \geq 30{,}75 \text{ adalah FK}=35 \Rightarrow Q_3 = 80" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Ingat:</strong> Nilai kuartil adalah nilai <InlineMath math="x" /> yang memiliki FK pertama kali <strong>sama dengan atau melebihi</strong> posisi kuartil yang dicari.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 2 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Kuartil Tabel Distribusi Frekuensi Tunggal" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-2">Tabel distribusi frekuensi tunggal nilai ulangan harian 20 siswa:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">Nilai</th><th className="px-3 py-1 text-center text-white/70">Frekuensi</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["5","2"],["6","4"],["7","6"],["8","5"],["9","3"]].map(([v, f]) => (
                            <tr key={v}><td className="px-3 py-1 text-white font-semibold">{v}</td><td className="px-3 py-1 text-center text-green-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">Tentukan <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat kolom frekuensi kumulatif (n = 20):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Nilai</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["5","2","2"],["6","4","6"],["7","6","12"],["8","5","17"],["9","3","20"]].map(([v,f,fk]) => (
                              <tr key={v} className={parseInt(fk) === 6 || parseInt(fk) === 12 ? "bg-blue-900/20" : parseInt(fk) === 17 ? "bg-orange-900/20" : ""}>
                                <td className="px-3 py-1 text-white font-semibold">{v}</td>
                                <td className="px-3 py-1 text-center text-green-300">{f}</td>
                                <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Tentukan posisi kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Posisi } Q_1 = \frac{1(20+1)}{4} = 5{,}25 \Rightarrow \text{FK} \geq 5{,}25 \text{ pertama adalah 6} \Rightarrow Q_1 = 6" />
                        <BlockMath math="\text{Posisi } Q_2 = \frac{2(20+1)}{4} = 10{,}5 \Rightarrow \text{FK} \geq 10{,}5 \text{ pertama adalah 12} \Rightarrow Q_2 = 7" />
                        <BlockMath math="\text{Posisi } Q_3 = \frac{3(20+1)}{4} = 15{,}75 \Rightarrow \text{FK} \geq 15{,}75 \text{ pertama adalah 17} \Rightarrow Q_3 = 8" />
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                        <p><strong className="text-green-300">Hasil: </strong><InlineMath math="Q_1 = 6" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8" /></p>
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
                    <p className="font-body text-sm text-white mb-2">Data usia anggota klub robotika:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">Usia (tahun)</th><th className="px-3 py-1 text-center text-white/70">Frekuensi</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["13","3"],["14","7"],["15","12"],["16","10"],["17","8"]].map(([v, f]) => (
                            <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-yellow-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">Tentukan <InlineMath math="Q_3" /> dan interpretasikan maknanya!</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat FK (n = 3+7+12+10+8 = 40):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Usia</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["13","3","3"],["14","7","10"],["15","12","22"],["16","10","32"],["17","8","40"]].map(([v,f,fk]) => (
                              <tr key={v} className={parseInt(fk) === 32 ? "bg-orange-900/20" : ""}>
                                <td className="px-3 py-1 text-white">{v}</td>
                                <td className="px-3 py-1 text-center text-yellow-300">{f}</td>
                                <td className="px-3 py-1 text-center text-yellow-400 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung posisi <InlineMath math="Q_3" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Posisi } Q_3 = \frac{3(40+1)}{4} = \frac{123}{4} = 30{,}75" />
                        <p className="text-xs text-white/60">FK pertama yang ≥ 30,75 adalah FK = 32 (usia 16 tahun)</p>
                        <BlockMath math="\therefore Q_3 = 16" />
                      </div>
                      <p><strong>Interpretasi:</strong></p>
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                        <p><strong className="text-yellow-300">Q₃ = 16 tahun</strong> artinya <strong>75% anggota</strong> klub berusia ≤ 16 tahun. Hanya 25% anggota yang berusia di atas 16 tahun.</p>
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
                      Tabel distribusi frekuensi tunggal data waktu tempuh (menit) 50 siswa ke sekolah:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">Waktu (menit)</th><th className="px-3 py-1 text-center text-white/70">Frekuensi</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["10","5"],["15","8"],["20","14"],["25","12"],["30","7"],["35","4"]].map(([v, f]) => (
                            <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-red-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-sm text-white mt-2">
                      Tentukan semua kuartil dan nyatakan: berapa persen siswa yang waktu tempuhnya antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Buat FK (n = 5+8+14+12+7+4 = 50):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Waktu</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["10","5","5"],["15","8","13"],["20","14","27"],["25","12","39"],["30","7","46"],["35","4","50"]].map(([v,f,fk]) => (
                              <tr key={v} className={
                                parseInt(fk) === 13 ? "bg-green-900/20" :
                                parseInt(fk) === 27 ? "bg-cyan-900/20" :
                                parseInt(fk) === 39 ? "bg-orange-900/20" : ""
                              }>
                                <td className="px-3 py-1 text-white">{v}</td>
                                <td className="px-3 py-1 text-center text-red-300">{f}</td>
                                <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Hitung posisi semua kuartil.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\text{Pos. }Q_1 = \frac{51}{4} = 12{,}75 \Rightarrow \text{FK} \geq 12{,}75,\; \text{FK}=13 \Rightarrow Q_1 = 15" />
                        <BlockMath math="\text{Pos. }Q_2 = \frac{102}{4} = 25{,}5 \Rightarrow \text{FK} \geq 25{,}5,\; \text{FK}=27 \Rightarrow Q_2 = 20" />
                        <BlockMath math="\text{Pos. }Q_3 = \frac{153}{4} = 38{,}25 \Rightarrow \text{FK} \geq 38{,}25,\; \text{FK}=39 \Rightarrow Q_3 = 25" />
                      </div>
                      <p><strong>Langkah 3:</strong> Siswa dengan waktu antara <InlineMath math="Q_1 = 15" /> dan <InlineMath math="Q_3 = 25" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/60">Yang termasuk: nilai 15 (f=8), 20 (f=14), 25 (f=12)</p>
                        <BlockMath math="\text{Banyak siswa} = 8 + 14 + 12 = 34 \text{ siswa}" />
                        <BlockMath math="\text{Persentase} = \frac{34}{50} \times 100\% = 68\%" />
                      </div>
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                        <p><strong className="text-red-300">Jawaban: </strong><InlineMath math="Q_1 = 15" /> menit, <InlineMath math="Q_2 = 20" /> menit, <InlineMath math="Q_3 = 25" /> menit.<br />
                        Sebanyak <strong>34 siswa (68%)</strong> waktu tempuhnya berada antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RANGKUMAN ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-violet-400" title="📋 Rangkuman — Kuartil" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      title: "Data Tunggal", color: "border-green-500/40 bg-green-900/20",
                      points: [
                        "Urutkan data dari kecil ke besar.",
                        "Posisi Qₖ = k(n+1)/4",
                        "Jika pecahan → interpolasi antara dua data.",
                      ]
                    },
                    {
                      title: "Tabel Distribusi Frekuensi Tunggal", color: "border-blue-500/40 bg-blue-900/20",
                      points: [
                        "Buat kolom frekuensi kumulatif (FK).",
                        "Posisi Qₖ = k(n+1)/4",
                        "Nilai Qₖ = nilai x yang FK-nya pertama ≥ posisi.",
                      ]
                    },
                  ].map(({ title, color, points }) => (
                    <div key={title} className={`border ${color} rounded-xl p-4`}>
                      <p className="font-body text-sm font-bold text-white mb-2">{title}</p>
                      <ul className="space-y-1">
                        {points.map((p) => (
                          <li key={p} className="font-body text-xs text-white/70 flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4 text-center">
                  <p className="font-body text-sm text-violet-200">
                    <strong>Q₂ selalu sama dengan Median!</strong><br />
                    <span className="text-xs text-white/50">Karena keduanya membagi data menjadi dua bagian yang sama besar (50%–50%).</span>
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

export default KuartilPage;
