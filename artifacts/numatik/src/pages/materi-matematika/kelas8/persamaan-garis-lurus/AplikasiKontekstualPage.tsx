import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Globe } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const W = 220, H = 160, MX = 30, MY = 130, SC = 25;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const Chart = ({ children, label = "", xLabel = "x", yLabel = "y" }: { children?: React.ReactNode; label?: string; xLabel?: string; yLabel?: string }) => {
  const { isDark } = useTheme();
  const svgBg  = isDark ? "rgba(15,23,42,0.7)"  : "rgba(241,245,249,0.9)";
  const gridS  = isDark ? "#1e293b" : "#cbd5e1";
  const axisS  = isDark ? "#64748b" : "#475569";
  const tickF  = isDark ? "#475569" : "#64748b";
  const lblF   = isDark ? "#64748b" : "#475569";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ maxHeight: 180, background: svgBg }}>
      {[1,2,3,4,5,6].map(v => (
        <g key={v}>
          <line x1={toX(v)} y1={MY} x2={toX(v)} y2={10} stroke={gridS} strokeWidth="0.7" strokeDasharray="3,3" />
          <line x1={MX} y1={toY(v)} x2={W-5} y2={toY(v)} stroke={gridS} strokeWidth="0.7" strokeDasharray="3,3" />
          <text x={toX(v)-3} y={MY+12} fill={tickF} fontSize="7">{v}</text>
          <text x={MX-15} y={toY(v)+3} fill={tickF} fontSize="7">{v}</text>
        </g>
      ))}
      <line x1={MX} y1={MY} x2={W-5} y2={MY} stroke={axisS} strokeWidth="1.5" markerEnd="url(#arrC)" />
      <line x1={MX} y1={MY} x2={MX} y2={10} stroke={axisS} strokeWidth="1.5" markerEnd="url(#arrC)" />
      <defs>
        <marker id="arrC" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill={axisS} />
        </marker>
      </defs>
      <text x={W-12} y={MY+12} fill={axisS} fontSize="8">{xLabel}</text>
      <text x={MX+3} y={12} fill={axisS} fontSize="8">{yLabel}</text>
      <text x={MX+2} y={MY+12} fill={lblF} fontSize="7">0</text>
      {label && <text x={MX+5} y={22} fill={isDark ? "#94a3b8" : "#64748b"} fontSize="8">{label}</text>}
      {children}
    </svg>
  );
};

const T_APLIKASI = {
  id: {
    title: "APLIKASI PERSAMAAN GARIS LURUS",
    subtitle: "Matematika dalam Kehidupan Nyata!",
    breadcrumb: "Kelas 8 · Persamaan Garis Lurus · Materi Matematika",
    sh_intro: "🌟 Garis Lurus Ada di Sekeliling Kita!",
    sh_langkah: "📘 Langkah Menyelesaikan Soal Kontekstual",
    sh_konteks: "🔍 Memahami Makna m dan c dalam Konteks",
    sh_contoh1: "✏️ Contoh 1 — Tingkat Mudah (Tarif Taksi)",
    sh_contoh2: "✏️ Contoh 2 — Tingkat Sedang (Pertumbuhan Tanaman)",
    sh_contoh3: "✏️ Contoh 3 — Tingkat Sulit (Analisis Biaya Produksi)",
    sh_rangkuman: "📌 Rangkuman",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT",
    back: "← Kembali ke Persamaan Garis Lurus",
  },
  en: {
    title: "APPLICATIONS OF LINEAR EQUATIONS",
    subtitle: "Mathematics in Real Life!",
    breadcrumb: "Grade 8 · Equation of a Line · Math",
    sh_intro: "🌟 Straight Lines Are All Around Us!",
    sh_langkah: "📘 Steps for Solving Word Problems",
    sh_konteks: "🔍 Understanding m and c in Context",
    sh_contoh1: "✏️ Example 1 — Easy Level (Taxi Fare)",
    sh_contoh2: "✏️ Example 2 — Medium Level (Plant Growth)",
    sh_contoh3: "✏️ Example 3 — Hard Level (Production Cost Analysis)",
    sh_rangkuman: "📌 Summary",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD",
    back: "← Back to Equation of a Line",
  },
  ja: {
    title: "一次方程式の応用",
    subtitle: "現実の数学！",
    breadcrumb: "中学2年 · 直線の方程式 · 数学",
    sh_intro: "🌟 直線は私たちの周りにある！",
    sh_langkah: "📘 文章問題の解き方",
    sh_konteks: "🔍 文脈でのmとcの意味を理解する",
    sh_contoh1: "✏️ 例題1 — 基本レベル（タクシー料金）",
    sh_contoh2: "✏️ 例題2 — 標準レベル（植物の成長）",
    sh_contoh3: "✏️ 例題3 — 発展レベル（生産コスト分析）",
    sh_rangkuman: "📌 まとめ",
    mudah: "基本", sedang: "標準", sulit: "発展",
    back: "← 直線の方程式に戻る",
  },
} as const;
type LangKey = keyof typeof T_APLIKASI;

const AplikasiKontekstualPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = T_APLIKASI[language as LangKey] ?? T_APLIKASI.id;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "langkah", "konteks-list", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const toggle = (s: string) => { playPopSound(); setExpandedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); };
  const SH = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );
  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">Persamaan garis lurus bukan hanya soal di buku pelajaran — ia hadir dalam banyak situasi nyata: tarif taksi, pertumbuhan tanaman, pemakaian listrik, hingga harga jual-beli. Memahami aplikasinya membantu kita membuat prediksi dan keputusan yang lebih baik!</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { icon: "🚖", label: "Tarif Taksi", ket: "Tarif dasar + per km" },
                    { icon: "💧", label: "Tagihan Air", ket: "Biaya tetap + per m³" },
                    { icon: "🌱", label: "Pertumbuhan", ket: "Tinggi vs waktu" },
                    { icon: "💰", label: "Tabungan", ket: "Saldo vs waktu" },
                  ].map(({ icon, label, ket }) => (
                    <div key={label} className={`border border-white/10 rounded-xl p-3 text-center ${isDark ? "bg-slate-800/60" : "bg-gray-100"}`}>
                      <div className="text-2xl mb-1">{icon}</div>
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{ket}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LANGKAH PEMECAHAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="langkah" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.sh_langkah} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-violet-300 mb-2 font-body">🎯 Ringkasan Intisari</p>
                  <p className="text-sm text-white/80 font-body leading-relaxed">Soal kontekstual persamaan garis lurus umumnya berbentuk: diketahui hubungan linear antara dua besaran (x dan y), diminta membuat model persamaan dan memprediksi nilai tertentu.</p>
                </div>
                <div className="space-y-2">
                  {[
                    { n:"1", t:"Identifikasi variabel", d:"Tentukan variabel bebas (x) dan variabel terikat (y). Biasanya: x = waktu/jumlah, y = biaya/hasil", c:"border-cyan-500/30 bg-cyan-900/10" },
                    { n:"2", t:"Temukan dua data/titik", d:"Ambil dua informasi dari soal → ubah ke titik koordinat (x₁,y₁) dan (x₂,y₂)", c:"border-violet-500/30 bg-violet-900/10" },
                    { n:"3", t:"Buat model persamaan", d:"Gunakan rumus menentukan PGL dari 2 titik atau gradien + 1 titik", c:"border-green-500/30 bg-green-900/10" },
                    { n:"4", t:"Jawab pertanyaan", d:"Substitusi nilai yang ditanyakan ke persamaan yang sudah ditemukan", c:"border-orange-500/30 bg-orange-900/10" },
                    { n:"5", t:"Verifikasi & interpretasi", d:"Pastikan jawaban logis dalam konteks soal. Cek satuan dan makna hasilnya", c:"border-yellow-500/30 bg-yellow-900/10" },
                  ].map(({ n,t,d,c }) => (
                    <div key={n} className={`border ${c} rounded-xl p-3 flex gap-3 text-sm font-body`}>
                      <span className="bg-white/10 rounded-full w-7 h-7 flex items-center justify-center font-bold text-white font-display shrink-0">{n}</span>
                      <div><p className="text-white font-semibold">{t}</p><p className="text-white/60 text-xs">{d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KONTEKS DAN INTERPRETASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="konteks-list" icon={<BookOpen className="w-5 h-5" />} iconColor="text-orange-400" title={t.sh_konteks} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead><tr className="bg-orange-900/40">
                      <th className="border border-orange-500/30 px-3 py-2 text-orange-200">Konteks</th>
                      <th className="border border-orange-500/30 px-3 py-2 text-orange-200">Variabel x</th>
                      <th className="border border-orange-500/30 px-3 py-2 text-orange-200">Variabel y</th>
                      <th className="border border-orange-500/30 px-3 py-2 text-orange-200">Makna m</th>
                      <th className="border border-orange-500/30 px-3 py-2 text-orange-200">Makna c</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Tarif taksi", "Jarak (km)", "Biaya (Rp)", "Tarif per km", "Tarif dasar (saat naik)"],
                        ["Tagihan listrik", "kWh dipakai", "Tagihan (Rp)", "Harga per kWh", "Biaya abonemen tetap"],
                        ["Pertumbuhan tanaman", "Waktu (hari)", "Tinggi (cm)", "Pertambahan per hari", "Tinggi awal"],
                        ["Tabungan", "Waktu (bulan)", "Saldo (Rp)", "Tabungan per bulan", "Saldo awal"],
                        ["Produksi", "Unit diproduksi", "Biaya produksi", "Biaya per unit", "Biaya tetap"],
                      ].map(([k,x,y,m,c],i) => (
                        <tr key={i} className={i%2===0?(isDark?"bg-slate-800/30":"bg-blue-50/50"):(isDark?"bg-slate-700/20":"bg-gray-50")}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{k}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{x}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{y}</td>
                          <td className="border border-white/10 px-3 py-2 text-yellow-300">{m}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Kunci:</strong> Dalam konteks nyata, m adalah <strong>laju perubahan</strong> (seberapa cepat y berubah per satuan x), sedangkan c adalah <strong>nilai awal</strong> (nilai y saat x = 0).</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.sh_contoh1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.mudah} color="bg-green-700/60 text-green-200" />
                <div className={`border border-green-500/30 rounded-xl p-4 ${isDark ? "bg-slate-800/60" : "bg-gray-100"}`}>
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body leading-relaxed">
                    🚖 Sebuah taksi online mengenakan tarif dasar Rp 8.000 saat penumpang naik, ditambah Rp 4.000 untuk setiap kilometer perjalanan.
                    <br />a) Buat model persamaan garis lurusnya!
                    <br />b) Berapa tarif untuk perjalanan 5 km?
                    <br />c) Jika tarif Rp 32.000, berapa jarak tempuhnya?
                  </p>
                </div>
                <div className={`border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body ${isDark ? "bg-slate-700/40" : "bg-gray-50"}`}>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-cyan-300 font-semibold mb-1">a) Model Persamaan:</p>
                    <p className="text-white/60 text-xs mb-1">Misalkan x = jarak (km), y = tarif (Rp ribu)</p>
                    <p className="text-white/60 text-xs">m = 4 (tarif per km), c = 8 (tarif dasar)</p>
                    <BlockMath math="y = 4x + 8" />
                    <p className="text-xs text-white/50">Atau: Tarif = 4.000 × jarak + 8.000</p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-violet-300 font-semibold mb-1">b) Tarif untuk 5 km:</p>
                    <BlockMath math="y = 4(5) + 8 = 20 + 8 = 28" />
                    <p className="text-green-300 font-bold text-xs">Tarif = Rp 28.000</p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-orange-300 font-semibold mb-1">c) Jarak jika tarif = Rp 32.000 (y = 32):</p>
                    <BlockMath math="32 = 4x + 8 \Rightarrow 4x = 24 \Rightarrow x = 6" />
                    <p className="text-green-300 font-bold text-xs">Jarak = 6 km</p>
                  </div>
                  {/* Grafik tarif */}
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-cyan-300 font-semibold mb-2 text-xs">Grafik Tarif Taksi:</p>
                    <Chart label="y = 4x + 8" xLabel="km" yLabel="Rb Rp">
                      {/* y = 4x + 8, scaled: x in km (0-6), y in Rp/1000 (0-32) */}
                      {(() => {
                        const pts: [number,number][] = [[0,8],[1,12],[2,16],[3,20],[4,24],[5,28],[6,32]];
                        const scaleX = (x: number) => MX + x * 28;
                        const scaleY = (y: number) => MY - (y/4) * 15;
                        return (
                          <g>
                            <polyline
                              points={pts.map(([x,y]) => `${scaleX(x)},${scaleY(y)}`).join(' ')}
                              fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"
                            />
                            {pts.map(([x,y]) => (
                              <circle key={x} cx={scaleX(x)} cy={scaleY(y)} r="3" fill="#4ade80" />
                            ))}
                            {/* highlight 5km */}
                            <circle cx={scaleX(5)} cy={scaleY(28)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                            <text x={scaleX(5)+4} y={scaleY(28)-4} fill="#facc15" fontSize="7">5km→Rp28k</text>
                            {/* x-axis labels */}
                            {[1,2,3,4,5,6].map(v => (
                              <text key={v} x={scaleX(v)-3} y={MY+12} fill="#475569" fontSize="7">{v}</text>
                            ))}
                            {/* y-axis labels */}
                            {[8,16,24,32].map(v => (
                              <text key={v} x={MX-20} y={scaleY(v)+3} fill="#475569" fontSize="7">{v}k</text>
                            ))}
                          </g>
                        );
                      })()}
                    </Chart>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">✅ Model: y = 4x + 8. Tarif 5km = Rp28.000. Jika tarif Rp32.000 → jarak = 6 km.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_contoh2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.sedang} color="bg-yellow-700/60 text-yellow-200" />
                <div className={`border border-yellow-500/30 rounded-xl p-4 ${isDark ? "bg-slate-800/60" : "bg-gray-100"}`}>
                  <p className="text-sm font-semibold text-yellow-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body leading-relaxed">
                    🌱 Sebuah tanaman diukur tingginya setiap hari. Pada hari ke-2, tingginya 11 cm. Pada hari ke-5, tingginya 17 cm. Asumsikan pertumbuhan linier.
                    <br />a) Buat model persamaan pertumbuhan!
                    <br />b) Berapa tinggi tanaman pada hari ke-10?
                    <br />c) Berapa tinggi awal tanaman (hari ke-0)?
                  </p>
                </div>
                <div className={`border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body ${isDark ? "bg-slate-700/40" : "bg-gray-50"}`}>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-cyan-300 font-semibold mb-1">a) Identifikasi titik-titik: (2, 11) dan (5, 17)</p>
                    <p className="text-white/60 text-xs mb-1">Hitung gradien (laju pertumbuhan per hari):</p>
                    <BlockMath math="m = \frac{17 - 11}{5 - 2} = \frac{6}{3} = 2" />
                    <p className="text-white/60 text-xs mb-1">Gunakan titik (2, 11):</p>
                    <BlockMath math="y - 11 = 2(x - 2) \Rightarrow y = 2x + 7" />
                    <p className="text-green-300 font-bold text-xs">Model: y = 2x + 7 (y = tinggi cm, x = hari)</p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-violet-300 font-semibold mb-1">b) Tinggi pada hari ke-10:</p>
                    <BlockMath math="y = 2(10) + 7 = 27" />
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-orange-300 font-semibold mb-1">c) Tinggi awal (x = 0):</p>
                    <BlockMath math="y = 2(0) + 7 = 7" />
                    <p className="text-green-300 font-bold text-xs">Tinggi awal = 7 cm (nilai c dalam persamaan!)</p>
                  </div>
                  {/* Grafik pertumbuhan */}
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-cyan-300 font-semibold mb-2 text-xs">Grafik Pertumbuhan Tanaman:</p>
                    <Chart label="y = 2x + 7" xLabel="hari" yLabel="cm">
                      {(() => {
                        const pts: [number,number][] = [[0,7],[1,9],[2,11],[3,13],[4,15],[5,17],[6,19],[7,21]];
                        const scX = (x: number) => MX + x * 25;
                        const scY = (y: number) => MY - (y - 5) * 6.5;
                        return (
                          <g>
                            <polyline
                              points={pts.map(([x,y]) => `${scX(x)},${scY(y)}`).join(' ')}
                              fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"
                            />
                            {pts.map(([x,y]) => (
                              <circle key={x} cx={scX(x)} cy={scY(y)} r="3" fill="#4ade80" />
                            ))}
                            {/* highlight day 2 and 5 */}
                            <circle cx={scX(2)} cy={scY(11)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                            <text x={scX(2)+4} y={scY(11)-4} fill="#facc15" fontSize="7">(2,11)</text>
                            <circle cx={scX(5)} cy={scY(17)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                            <text x={scX(5)+4} y={scY(17)-4} fill="#facc15" fontSize="7">(5,17)</text>
                            {/* Growth triangle */}
                            <line x1={scX(2)} y1={scY(11)} x2={scX(5)} y2={scY(11)} stroke="#4ade80" strokeWidth="1" strokeDasharray="3,2" />
                            <line x1={scX(5)} y1={scY(11)} x2={scX(5)} y2={scY(17)} stroke="#f472b6" strokeWidth="1" strokeDasharray="3,2" />
                            <text x={scX(3.3)} y={scY(11)+12} fill="#4ade80" fontSize="7">3 hari</text>
                            <text x={scX(5)+4} y={scY(14)} fill="#f472b6" fontSize="7">6 cm</text>
                            {[0,2,4,6].map(v => (
                              <text key={v} x={scX(v)-3} y={MY+12} fill="#475569" fontSize="7">{v}</text>
                            ))}
                          </g>
                        );
                      })()}
                    </Chart>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">✅ Model: y = 2x + 7. Hari ke-10 = 27 cm. Tinggi awal = 7 cm. Laju tumbuh = 2 cm/hari.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.sh_contoh3} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.sulit} color="bg-red-700/60 text-red-200" />
                <div className={`border border-red-500/30 rounded-xl p-4 ${isDark ? "bg-slate-800/60" : "bg-gray-100"}`}>
                  <p className="text-sm font-semibold text-red-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body leading-relaxed">
                    🏭 Sebuah UMKM memproduksi tas. Biaya produksi untuk 20 tas adalah Rp 900.000, sedangkan untuk 50 tas adalah Rp 1.800.000 (biaya bersifat linear).
                    <br />a) Tentukan model persamaan biaya produksi!
                    <br />b) Berapa biaya tetap (biaya jika tidak ada produksi)?
                    <br />c) Berapa biaya per unit tas?
                    <br />d) Jika harga jual per tas Rp 45.000, berapa jumlah tas minimum yang harus dijual agar tidak rugi?
                  </p>
                </div>
                <div className={`border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body ${isDark ? "bg-slate-700/40" : "bg-gray-50"}`}>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-cyan-300 font-semibold mb-1">a) Model Persamaan Biaya (dalam Rp ribu):</p>
                    <p className="text-white/60 text-xs mb-1">x = jumlah tas, y = biaya (Rp ribu)</p>
                    <p className="text-white/60 text-xs mb-1">Dua titik: (20, 900) dan (50, 1800)</p>
                    <BlockMath math="m = \frac{1800 - 900}{50 - 20} = \frac{900}{30} = 30" />
                    <BlockMath math="y - 900 = 30(x - 20)" />
                    <BlockMath math="y = 30x + 300" />
                    <p className="text-green-300 font-bold text-xs">Model biaya: y = 30x + 300</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                      <p className="text-violet-300 font-semibold mb-1 text-xs">b) Biaya Tetap (x=0):</p>
                      <BlockMath math="y = 30(0) + 300 = 300" />
                      <p className="text-green-300 font-bold text-xs">Rp 300.000 (nilai c!)</p>
                    </div>
                    <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                      <p className="text-orange-300 font-semibold mb-1 text-xs">c) Biaya per unit:</p>
                      <p className="text-white/70 text-xs">= m = 30</p>
                      <p className="text-green-300 font-bold text-xs">Rp 30.000 per tas</p>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-green-300 font-semibold mb-1">d) Titik impas (Break Even Point):</p>
                    <p className="text-white/60 text-xs mb-1">Pendapatan = Biaya → 45x = 30x + 300</p>
                    <BlockMath math="45x = 30x + 300" />
                    <BlockMath math="15x = 300 \Rightarrow x = 20" />
                  </div>
                  {/* Grafik BEP */}
                  <div className={`rounded-lg p-3 ${isDark ? "bg-slate-800/50" : "bg-white/80"}`}>
                    <p className="text-cyan-300 font-semibold mb-2 text-xs">Grafik Biaya vs Pendapatan (BEP):</p>
                    <Chart label="BEP Analysis" xLabel="tas" yLabel="Rb Rp">
                      {(() => {
                        const scX = (x: number) => MX + x * 3.2;
                        const scY = (y: number) => MY - (y/500) * 28;
                        const biayaPts: [number,number][] = [[0,300],[10,600],[20,900],[30,1200],[40,1500],[50,1800]];
                        const pendPts: [number,number][] = [[0,0],[10,450],[20,900],[30,1350],[40,1800],[50,2250]];
                        return (
                          <g>
                            {/* cost line */}
                            <polyline points={biayaPts.map(([x,y]) => `${scX(x)},${scY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
                            {/* revenue line */}
                            <polyline points={pendPts.map(([x,y]) => `${scX(x)},${scY(y)}`).join(' ')} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
                            {/* BEP point */}
                            <circle cx={scX(20)} cy={scY(900)} r="6" fill="#facc15" stroke="#fde047" strokeWidth="2" />
                            <text x={scX(20)+5} y={scY(900)-5} fill="#facc15" fontSize="7">BEP (20, 900k)</text>
                            {/* labels */}
                            <text x={scX(45)} y={scY(1550)} fill="#f472b6" fontSize="8">Biaya</text>
                            <text x={scX(45)} y={scY(2050)} fill="#4ade80" fontSize="8">Pendapatan</text>
                            {/* zone labels */}
                            <text x={scX(8)} y={scY(200)} fill="#ef4444" fontSize="7">RUGI</text>
                            <text x={scX(28)} y={scY(1000)} fill="#4ade80" fontSize="7">UNTUNG</text>
                            {/* x labels */}
                            {[10,20,30,40,50].map(v => (
                              <text key={v} x={scX(v)-3} y={MY+12} fill="#475569" fontSize="7">{v}</text>
                            ))}
                          </g>
                        );
                      })()}
                    </Chart>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-300">✅ Model: y = 30x + 300. Biaya tetap = Rp300k. Per tas = Rp30k. BEP = 20 tas (minimal harus jual 20 tas agar impas)!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sh_rangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Identifikasi Variabel", "x = variabel bebas (input), y = variabel terikat (output)"],
                    ["Gradien (m)", "Laju perubahan — seberapa banyak y berubah per satuan x"],
                    ["Konstanta (c)", "Nilai awal — nilai y ketika x = 0"],
                    ["Model Linear", "y = mx + c: m = biaya/pertambahan per unit, c = nilai awal/biaya tetap"],
                    ["Break Even", "Titik di mana pendapatan = biaya → selesaikan persamaan pendapatan = biaya"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-xs text-yellow-200 font-body"><strong>💡 Tips Soal:</strong> Jika soal memberi dua data → gunakan 2 titik. Jika memberi gradien + 1 data → gunakan titik-gradien.</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-xs text-orange-200 font-body"><strong>⚠️ Ingat:</strong> Selalu cek satuan! Jika x dalam km, m harus dalam Rp/km. Jangan lupa interpretasikan hasilnya!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AplikasiKontekstualPage;
