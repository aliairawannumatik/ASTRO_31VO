import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import JangkauanAnimasi from "@/components/JangkauanAnimasi";
import JIKdanSKAnimasi from "@/components/JIKdanSKAnimasi";
import { useLanguage } from "@/contexts/LanguageContext";

const levelLabels = {
  id: { MUDAH: "MUDAH", SEDANG: "SEDANG", SULIT: "SULIT" },
  en: { MUDAH: "EASY", SEDANG: "MEDIUM", SULIT: "HARD" },
  ja: { MUDAH: "基本", SEDANG: "標準", SULIT: "発展" },
} as const;

const pageTrans = {
  id: {
    h1: "UKURAN PENYEBARAN DATA",
    h2: "Jangkauan · Jangkauan Interkuartil · Simpangan Kuartil",
    context: "Kelas 9 · Statistika · Materi Matematika",
    back: "← Kembali ke Statistika Kelas 9",
  },
  en: {
    h1: "MEASURES OF DISPERSION",
    h2: "Range · Interquartile Range · Quartile Deviation",
    context: "Grade 9 · Statistics · Math Material",
    back: "← Back to Grade 9 Statistics",
  },
  ja: {
    h1: "散らばりの尺度",
    h2: "範囲・四分位範囲・四分位偏差",
    context: "中学3年・統計・数学教材",
    back: "← 中学3年統計に戻る",
  },
} as const;

const sectionTitles = {
  id: {
    intro: "🌟 Apa Itu Ukuran Penyebaran Data?",
    konsep1: "📘 Sub-Bab 1: Ukuran Penyebaran Data Tunggal",
    contoh1: "📝 Contoh Soal — Penyebaran Data Tunggal",
    konsep2: "📘 Sub-Bab 2: Penyebaran Data pada Tabel Distribusi Frekuensi Tunggal",
    contoh2: "📝 Contoh Soal — Penyebaran Data Tabel Frekuensi Tunggal",
    rangkuman: "📋 Rangkuman — Ukuran Penyebaran Data",
  },
  en: {
    intro: "🌟 What Is a Measure of Dispersion?",
    konsep1: "📘 Sub-Topic 1: Dispersion of Single Data",
    contoh1: "📝 Example Problems — Single Data Dispersion",
    konsep2: "📘 Sub-Topic 2: Dispersion for Single Frequency Distribution Tables",
    contoh2: "📝 Example Problems — Frequency Table Dispersion",
    rangkuman: "📋 Summary — Measures of Dispersion",
  },
  ja: {
    intro: "🌟 散らばりの尺度とは？",
    konsep1: "📘 サブトピック1：単一データの散らばり",
    contoh1: "📝 例題 — 単一データの散らばり",
    konsep2: "📘 サブトピック2：単一データ度数分布表の散らばり",
    contoh2: "📝 例題 — 度数分布表の散らばり",
    rangkuman: "📋 まとめ — 散らばりの尺度",
  },
} as const;

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

const PenyebaranDataPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const pt = pageTrans[language];
  const st = sectionTitles[language];
  const lvl = levelLabels[language];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {pt.h1}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{pt.h2}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {pt.context}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={st.intro} />
            <div className="px-5 pb-5 space-y-4">
              {language === "id" ? (
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dua kelompok data bisa punya rata-rata yang sama, tapi karakter data-nya sangat berbeda. Nah, di sinilah <strong className="text-cyan-300">ukuran penyebaran data</strong> berperan — ia mengukur seberapa "menyebar" atau "rapat" data di sekitar pusatnya.
                </p>
              ) : language === "en" ? (
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Two groups of data can have the same average, yet their character can be very different. This is where <strong className="text-cyan-300">measures of dispersion</strong> come in — they measure how "spread out" or "tightly clustered" data is around its center.
                </p>
              ) : (
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  2つのデータ群が同じ平均値を持っていても、データの性質は大きく異なることがあります。ここで役立つのが<strong className="text-cyan-300">散らばりの尺度</strong>です — データが中心のまわりでどれだけ「広がっている」か「集まっている」かを測ります。
                </p>
              )}

              <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  {language === "id" ? "💡 Ilustrasi Pentingnya Penyebaran" : language === "en" ? "💡 Why Dispersion Matters — Illustration" : "💡 散らばりの重要性を示す例"}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-green-300 mb-2">
                      {language === "id" ? "Tim A (Nilai Ujian)" : language === "en" ? "Team A (Exam Scores)" : "チームA（試験の点数）"}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {["68","70","70","71","71"].map((v,i)=>(
                        <span key={i} className="bg-green-700/40 text-green-200 text-xs px-2 py-0.5 rounded font-bold">{v}</span>
                      ))}
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      {language === "id" ? "Rata-rata = 70 ✓" : language === "en" ? "Mean = 70 ✓" : "平均 = 70 ✓"}
                    </p>
                    <p className="text-xs text-green-300 font-semibold">
                      {language === "id" ? "Data RAPAT 🎯" : language === "en" ? "TIGHT Data 🎯" : "データは密集 🎯"}
                    </p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-red-300 mb-2">
                      {language === "id" ? "Tim B (Nilai Ujian)" : language === "en" ? "Team B (Exam Scores)" : "チームB（試験の点数）"}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {["40","55","70","85","100"].map((v,i)=>(
                        <span key={i} className="bg-red-700/40 text-red-200 text-xs px-2 py-0.5 rounded font-bold">{v}</span>
                      ))}
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      {language === "id" ? "Rata-rata = 70 ✓" : language === "en" ? "Mean = 70 ✓" : "平均 = 70 ✓"}
                    </p>
                    <p className="text-xs text-red-300 font-semibold">
                      {language === "id" ? "Data MENYEBAR ⚡" : language === "en" ? "SPREAD Data ⚡" : "データは分散 ⚡"}
                    </p>
                  </div>
                </div>
                <p className="font-body text-xs text-white/60 text-center">
                  {language === "id" ? "Rata-ratanya sama, tapi sebarannya sangat berbeda!" : language === "en" ? "Same mean, but very different spread!" : "平均は同じですが、散らばりは大きく異なります！"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(language === "id" ? [
                  { simbol: "J", nama: "Jangkauan (Range)", desc: "Selisih nilai terbesar dan terkecil", color: "bg-emerald-900/40 border-emerald-500/40 text-emerald-300" },
                  { simbol: "JIK", nama: "Jangkauan Interkuartil", desc: "Selisih Q₃ dan Q₁ — mengukur sebaran 50% data tengah", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
                  { simbol: "Qd", nama: "Simpangan Kuartil", desc: "Setengah dari JIK — disebut juga semi-interkuartil", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                ] : language === "en" ? [
                  { simbol: "J", nama: "Range", desc: "Difference between the largest and smallest value", color: "bg-emerald-900/40 border-emerald-500/40 text-emerald-300" },
                  { simbol: "IQR", nama: "Interquartile Range", desc: "Difference between Q₃ and Q₁ — measures the spread of the middle 50% of data", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
                  { simbol: "QD", nama: "Quartile Deviation", desc: "Half of the IQR — also called the semi-interquartile range", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                ] : [
                  { simbol: "J", nama: "範囲（レンジ）", desc: "最大値と最小値の差", color: "bg-emerald-900/40 border-emerald-500/40 text-emerald-300" },
                  { simbol: "IQR", nama: "四分位範囲", desc: "Q₃とQ₁の差 — データ中央50%の散らばりを測る", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
                  { simbol: "QD", nama: "四分位偏差", desc: "四分位範囲の半分 — 半四分位範囲とも呼ばれる", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
                ]).map(({ simbol, nama, desc, color }) => (
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
          </div>

          {/* ── SUB-BAB 1: DATA TUNGGAL ────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-emerald-400" title={st.konsep1} />
            <div className="px-5 pb-5 space-y-4">

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 space-y-4">
                <p className="font-body text-sm font-semibold text-emerald-300">
                  {language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Core Summary" : "🎯 要点まとめ"}
                </p>
                {language === "id" ? (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Untuk data tunggal, kita terlebih dahulu cari <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" /> (seperti materi sebelumnya), kemudian gunakan keduanya untuk menghitung ketiga ukuran penyebaran berikut:
                  </p>
                ) : language === "en" ? (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    For single data, we first find <InlineMath math="Q_1" /> and <InlineMath math="Q_3" /> (as in the previous topic), then use both to calculate the following three measures of dispersion:
                  </p>
                ) : (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    単一データの場合、まず<InlineMath math="Q_1" />と<InlineMath math="Q_3" />を求め（前の単元と同様）、それらを使って以下の3つの散らばりの尺度を計算します。
                  </p>
                )}

                <div className="space-y-3">
                  {/* Jangkauan */}
                  <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded">1</span>
                      <p className="font-body text-sm font-bold text-emerald-300">
                        {language === "id" ? "Jangkauan (Range)" : language === "en" ? "Range" : "範囲（レンジ）"}
                      </p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                      <BlockMath math="J = x_{\text{maks}} - x_{\text{min}}" />
                      <p className="text-xs text-white/50 font-body">
                        {language === "id" ? "selisih nilai terbesar dengan nilai terkecil" : language === "en" ? "difference between the largest and the smallest value" : "最大値と最小値の差"}
                      </p>
                    </div>
                  </div>

                  <JangkauanAnimasi language={language} />

                  {/* Jangkauan Interkuartil */}
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-1 rounded">2</span>
                      <p className="font-body text-sm font-bold text-blue-300">
                        {language === "id" ? "Jangkauan Interkuartil (JIK)" : language === "en" ? "Interquartile Range (IQR)" : "四分位範囲（IQR）"}
                      </p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                      <BlockMath math="\text{JIK} = Q_3 - Q_1" />
                      <p className="text-xs text-white/50 font-body">
                        {language === "id" ? "mengukur sebaran 50% data di bagian tengah" : language === "en" ? "measures the spread of the middle 50% of the data" : "データ中央50%の散らばりを測る"}
                      </p>
                    </div>
                  </div>

                  {/* Simpangan Kuartil */}
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded">3</span>
                      <p className="font-body text-sm font-bold text-purple-300">
                        {language === "id" ? "Simpangan Kuartil (Qd)" : language === "en" ? "Quartile Deviation (QD)" : "四分位偏差（QD）"}
                      </p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                      <BlockMath math="Q_d = \frac{Q_3 - Q_1}{2} = \frac{\text{JIK}}{2}" />
                      <p className="text-xs text-white/50 font-body">
                        {language === "id" ? "setengah dari JIK — disebut juga semi-interkuartil range" : language === "en" ? "half of the IQR — also called the semi-interquartile range" : "四分位範囲の半分 — 半四分位範囲とも呼ばれる"}
                      </p>
                    </div>
                  </div>

                  <JIKdanSKAnimasi language={language} />
                </div>
              </div>

              {/* Ilustrasi Visual Boxplot sederhana */}
              <div className="bg-slate-800/60 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  {language === "id" ? "📌 Visualisasi Lima Serangkai Data" : language === "en" ? "📌 Five-Number Summary Visualization" : "📌 5数要約の可視化"}
                </p>
                <p className="font-body text-xs text-white/60 mb-3">
                  {language === "id" ? "Data: 2, 5, 7, 8, 9, 12, 14, 16, 18, 20" : language === "en" ? "Data: 2, 5, 7, 8, 9, 12, 14, 16, 18, 20" : "データ：2, 5, 7, 8, 9, 12, 14, 16, 18, 20"}
                </p>

                {/* ── Boxplot (skala 0–20) ── */}
                <div className="relative" style={{ paddingTop: "28px", paddingBottom: "24px" }}>

                  {/* Label lima serangkai — sejajar dengan posisi data */}
                  <div className="absolute top-0 left-0 right-0 h-7 pointer-events-none">
                    <span className="absolute text-[10px] font-bold text-white/60"
                      style={{ left: "10%", transform: "translateX(-50%)" }}>{language === "id" ? "Min=2" : language === "en" ? "Min=2" : "最小=2"}</span>
                    <span className="absolute text-[10px] font-bold text-green-300"
                      style={{ left: "30%", transform: "translateX(-50%)" }}>Q₁=6</span>
                    <span className="absolute text-[10px] font-bold text-cyan-300"
                      style={{ left: "52.5%", transform: "translateX(-50%)" }}>Q₂={language === "en" ? "10.5" : "10,5"}</span>
                    <span className="absolute text-[10px] font-bold text-orange-300"
                      style={{ left: "75%", transform: "translateX(-50%)" }}>Q₃=15</span>
                    <span className="absolute text-[10px] font-bold text-white/60"
                      style={{ left: "100%", transform: "translateX(-50%)" }}>{language === "id" ? "Maks=20" : language === "en" ? "Max=20" : "最大=20"}</span>
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
                    {(language === "id" ? [
                      { cls: "bg-blue-500/50 border-blue-400/60",  label: "Kotak IQR (Q₁–Q₃)" },
                      { cls: "bg-cyan-400",                        label: "Median (Q₂)" },
                      { cls: "bg-slate-400",                       label: "Whisker (Min–Maks)" },
                    ] : language === "en" ? [
                      { cls: "bg-blue-500/50 border-blue-400/60",  label: "IQR Box (Q₁–Q₃)" },
                      { cls: "bg-cyan-400",                        label: "Median (Q₂)" },
                      { cls: "bg-slate-400",                       label: "Whisker (Min–Max)" },
                    ] : [
                      { cls: "bg-blue-500/50 border-blue-400/60",  label: "四分位範囲の箱（Q₁–Q₃）" },
                      { cls: "bg-cyan-400",                        label: "中央値（Q₂）" },
                      { cls: "bg-slate-400",                       label: "ひげ（最小–最大）" },
                    ]).map(({ cls, label }) => (
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
                  <BlockMath math={language === "en" ? "Q_d = \\frac{9}{2} = 4.5" : "Q_d = \\frac{9}{2} = 4{,}5"} />
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                {language === "id" ? (
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Keunggulan JIK & Qd:</strong> Tidak terpengaruh oleh nilai ekstrem (outlier), karena hanya memperhitungkan 50% data di bagian tengah. Lebih stabil dibanding Jangkauan biasa.
                  </p>
                ) : language === "en" ? (
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Advantage of IQR & QD:</strong> Unaffected by extreme values (outliers), since they only account for the middle 50% of the data. More stable than the plain Range.
                  </p>
                ) : (
                  <p className="font-body text-sm text-yellow-200">
                    <strong>四分位範囲・四分位偏差の利点：</strong> データ中央50%だけを考慮するため、極端な値（外れ値）の影響を受けません。単純な範囲より安定しています。
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── CONTOH SOAL SUB-BAB 1 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-emerald-400" title={st.contoh1} />
            <div className="px-5 pb-5 space-y-6">

              {/* MUDAH */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{lvl.MUDAH}</span>
                  <span className="font-body font-semibold text-white">
                    {language === "id" ? "Contoh 1" : language === "en" ? "Example 1" : "例題1"}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-white">
                      Data tinggi badan (cm) 7 siswa: 155, 162, 148, 170, 158, 165, 152.<br />
                      Hitung jangkauan, JIK, dan simpangan kuartilnya!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white">
                      Height data (cm) of 7 students: 155, 162, 148, 170, 158, 165, 152.<br />
                      Calculate the range, IQR, and quartile deviation!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white">
                      7人の生徒の身長データ（cm）：155, 162, 148, 170, 158, 165, 152。<br />
                      範囲、四分位範囲、四分位偏差を求めなさい！
                    </p>
                  )}
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">
                    {language === "id" ? "PEMBAHASAN:" : language === "en" ? "SOLUTION:" : "解説："}
                  </p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
                        <p><strong>Langkah 1:</strong> Urutkan data (n = 7):</p>
                        <div className="flex gap-2 flex-wrap">
                          {["148","152","155","158","162","165","170"].map((v,i)=>(
                            <div key={i} className="bg-slate-700/60 border border-green-500/30 rounded-lg px-3 py-1 text-green-300 font-bold text-sm">{v}</div>
                          ))}
                        </div>
                        <p><strong>Langkah 2:</strong> Hitung Jangkauan:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="J = x_{\text{maks}} - x_{\text{min}} = 170 - 148 = 22 \,\mathrm{cm}" />
                        </div>
                        <p><strong>Langkah 3:</strong> Cari <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />:</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>Posisi Q₁ = 8/4 = 2 → Q₁ = 152</p>
                          <BlockMath math="Q_1 = 152" />
                          <p>Posisi Q₃ = 24/4 = 6 → Q₃ = 165</p>
                          <BlockMath math="Q_3 = 165" />
                        </div>
                        <p><strong>Langkah 4:</strong> Hitung JIK dan Qd:</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="\text{JIK} = Q_3 - Q_1 = 165 - 152 = 13 \,\mathrm{cm}" />
                          <BlockMath math="Q_d = \frac{13}{2} = 6{,}5 \,\mathrm{cm}" />
                        </div>
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <p><strong className="text-green-300">Hasil:</strong> J = 22 cm · JIK = 13 cm · Qd = 6,5 cm</p>
                        </div>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>Step 1:</strong> Sort the data (n = 7):</p>
                        <div className="flex gap-2 flex-wrap">
                          {["148","152","155","158","162","165","170"].map((v,i)=>(
                            <div key={i} className="bg-slate-700/60 border border-green-500/30 rounded-lg px-3 py-1 text-green-300 font-bold text-sm">{v}</div>
                          ))}
                        </div>
                        <p><strong>Step 2:</strong> Calculate the Range:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="J = x_{\text{max}} - x_{\text{min}} = 170 - 148 = 22 \,\mathrm{cm}" />
                        </div>
                        <p><strong>Step 3:</strong> Find <InlineMath math="Q_1" /> and <InlineMath math="Q_3" />:</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>Position of Q₁ = 8/4 = 2 → Q₁ = 152</p>
                          <BlockMath math="Q_1 = 152" />
                          <p>Position of Q₃ = 24/4 = 6 → Q₃ = 165</p>
                          <BlockMath math="Q_3 = 165" />
                        </div>
                        <p><strong>Step 4:</strong> Calculate IQR and QD:</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="\text{IQR} = Q_3 - Q_1 = 165 - 152 = 13 \,\mathrm{cm}" />
                          <BlockMath math="Q_d = \frac{13}{2} = 6.5 \,\mathrm{cm}" />
                        </div>
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <p><strong className="text-green-300">Result:</strong> J = 22 cm · IQR = 13 cm · QD = 6.5 cm</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>ステップ1：</strong> データを並べ替える（n = 7）：</p>
                        <div className="flex gap-2 flex-wrap">
                          {["148","152","155","158","162","165","170"].map((v,i)=>(
                            <div key={i} className="bg-slate-700/60 border border-green-500/30 rounded-lg px-3 py-1 text-green-300 font-bold text-sm">{v}</div>
                          ))}
                        </div>
                        <p><strong>ステップ2：</strong> 範囲を計算する：</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="J = x_{\text{max}} - x_{\text{min}} = 170 - 148 = 22 \,\mathrm{cm}" />
                        </div>
                        <p><strong>ステップ3：</strong> <InlineMath math="Q_1" />と<InlineMath math="Q_3" />を求める：</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>Q₁の位置 = 8/4 = 2 → Q₁ = 152</p>
                          <BlockMath math="Q_1 = 152" />
                          <p>Q₃の位置 = 24/4 = 6 → Q₃ = 165</p>
                          <BlockMath math="Q_3 = 165" />
                        </div>
                        <p><strong>ステップ4：</strong> 四分位範囲と四分位偏差を計算する：</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="\text{IQR} = Q_3 - Q_1 = 165 - 152 = 13 \,\mathrm{cm}" />
                          <BlockMath math="Q_d = \frac{13}{2} = 6.5 \,\mathrm{cm}" />
                        </div>
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <p><strong className="text-green-300">結果：</strong> J = 22 cm · IQR = 13 cm · QD = 6.5 cm</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* SEDANG */}
              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{lvl.SEDANG}</span>
                  <span className="font-body font-semibold text-white">
                    {language === "id" ? "Contoh 2" : language === "en" ? "Example 2" : "例題2"}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-white">
                      Diketahui data nilai ujian 10 siswa (sudah urut): 55, 60, 65, 70, 72, 78, 80, 85, 88, 95.<br />
                      Jika nilai 95 diganti 135 (outlier), bandingkan jangkauan dan JIK sebelum dan sesudah perubahan!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white">
                      Given the exam scores of 10 students (already sorted): 55, 60, 65, 70, 72, 78, 80, 85, 88, 95.<br />
                      If the score 95 is replaced with 135 (an outlier), compare the range and IQR before and after the change!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white">
                      10人の生徒の試験の点数（すでに並べ替え済み）：55, 60, 65, 70, 72, 78, 80, 85, 88, 95。<br />
                      95が135（外れ値）に変わった場合、変更前後の範囲と四分位範囲を比較しなさい！
                    </p>
                  )}
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">
                    {language === "id" ? "PEMBAHASAN:" : language === "en" ? "SOLUTION:" : "解説："}
                  </p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
                        <p><strong>Data Awal</strong> (n=10): 55, 60, 65, 70, 72, 78, 80, 85, 88, 95</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J_{\text{awal}} = 95 - 55 = 40" />
                          <BlockMath math="Q_1 = \frac{11}{4} = 2{,}75 \Rightarrow Q_1 = 60 + 0{,}75(65-60) = 63{,}75" />
                          <BlockMath math="Q_3 = \frac{33}{4} = 8{,}25 \Rightarrow Q_3 = 85 + 0{,}25(88-85) = 85{,}75" />
                          <BlockMath math="\text{JIK}_{\text{awal}} = 85{,}75 - 63{,}75 = 22" />
                        </div>
                        <p><strong>Data Setelah</strong> 95 → 135: 55, 60, 65, 70, 72, 78, 80, 85, 88, 135</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J_{\text{baru}} = 135 - 55 = 80" />
                          <p className="text-xs text-white/50">(naik 2 kali lipat!!)</p>
                          <p className="text-xs text-white/50">Q₁ dan Q₃ tidak berubah karena 135 ada di posisi terakhir (tidak mempengaruhi Q₁ dan Q₃)</p>
                          <BlockMath math="\text{JIK}_{\text{baru}} = 85{,}75 - 63{,}75 = 22" />
                          <p className="text-xs text-white/50">(tidak berubah)</p>
                        </div>
                        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-yellow-200"><strong>Kesimpulan:</strong> Jangkauan berubah drastis (40→80), tapi <strong>JIK tetap sama (22)</strong>. Ini membuktikan JIK lebih tahan terhadap outlier!</p>
                        </div>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>Original Data</strong> (n=10): 55, 60, 65, 70, 72, 78, 80, 85, 88, 95</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J_{\text{original}} = 95 - 55 = 40" />
                          <BlockMath math="Q_1 = \frac{11}{4} = 2.75 \Rightarrow Q_1 = 60 + 0.75(65-60) = 63.75" />
                          <BlockMath math="Q_3 = \frac{33}{4} = 8.25 \Rightarrow Q_3 = 85 + 0.25(88-85) = 85.75" />
                          <BlockMath math="\text{IQR}_{\text{original}} = 85.75 - 63.75 = 22" />
                        </div>
                        <p><strong>Data After</strong> 95 → 135: 55, 60, 65, 70, 72, 78, 80, 85, 88, 135</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J_{\text{new}} = 135 - 55 = 80" />
                          <p className="text-xs text-white/50">(doubled!!)</p>
                          <p className="text-xs text-white/50">Q₁ and Q₃ do not change because 135 is at the last position (it does not affect Q₁ and Q₃)</p>
                          <BlockMath math="\text{IQR}_{\text{new}} = 85.75 - 63.75 = 22" />
                          <p className="text-xs text-white/50">(unchanged)</p>
                        </div>
                        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-yellow-200"><strong>Conclusion:</strong> The range changes drastically (40→80), but <strong>the IQR stays the same (22)</strong>. This proves the IQR is more resistant to outliers!</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>元のデータ</strong>（n=10）：55, 60, 65, 70, 72, 78, 80, 85, 88, 95</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J_{\text{元}} = 95 - 55 = 40" />
                          <BlockMath math="Q_1 = \frac{11}{4} = 2.75 \Rightarrow Q_1 = 60 + 0.75(65-60) = 63.75" />
                          <BlockMath math="Q_3 = \frac{33}{4} = 8.25 \Rightarrow Q_3 = 85 + 0.25(88-85) = 85.75" />
                          <BlockMath math="\text{IQR}_{\text{元}} = 85.75 - 63.75 = 22" />
                        </div>
                        <p><strong>変更後のデータ</strong> 95 → 135：55, 60, 65, 70, 72, 78, 80, 85, 88, 135</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J_{\text{新}} = 135 - 55 = 80" />
                          <p className="text-xs text-white/50">（2倍に増加！！）</p>
                          <p className="text-xs text-white/50">135は最後の位置にあるためQ₁とQ₃は変化しません（Q₁とQ₃に影響しない）</p>
                          <BlockMath math="\text{IQR}_{\text{新}} = 85.75 - 63.75 = 22" />
                          <p className="text-xs text-white/50">（変化なし）</p>
                        </div>
                        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-yellow-200"><strong>結論：</strong> 範囲は大きく変化しますが（40→80）、<strong>四分位範囲は変わりません（22）</strong>。これは四分位範囲が外れ値に対してより強いことを証明しています！</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* SULIT */}
              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{lvl.SULIT}</span>
                  <span className="font-body font-semibold text-white">
                    {language === "id" ? "Contoh 3" : language === "en" ? "Example 3" : "例題3"}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  {language === "id" ? (
                    <p className="font-body text-sm text-white">
                      Data berat badan (kg) 12 siswa: 40, 44, 47, 50, 52, 55, 58, 60, 63, 65, 70, 75.<br />
                      Diketahui simpangan kuartil <InlineMath math="Q_d = 8" />. Sebuah data baru ditambahkan, dan nilai <InlineMath math="Q_3" /> berubah menjadi 66. Jika <InlineMath math="Q_1" /> tetap, tentukan nilai JIK yang baru dan data apa yang ditambahkan!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white">
                      Weight data (kg) of 12 students: 40, 44, 47, 50, 52, 55, 58, 60, 63, 65, 70, 75.<br />
                      Given the quartile deviation <InlineMath math="Q_d = 8" />. A new data value is added, and <InlineMath math="Q_3" /> becomes 66. If <InlineMath math="Q_1" /> stays the same, determine the new IQR and what data value was added!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white">
                      12人の生徒の体重データ（kg）：40, 44, 47, 50, 52, 55, 58, 60, 63, 65, 70, 75。<br />
                      四分位偏差<InlineMath math="Q_d = 8" />が既知です。新しいデータが追加され、<InlineMath math="Q_3" />が66に変わりました。<InlineMath math="Q_1" />が変わらない場合、新しい四分位範囲の値と追加されたデータを求めなさい！
                    </p>
                  )}
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">
                    {language === "id" ? "PEMBAHASAN:" : language === "en" ? "SOLUTION:" : "解説："}
                  </p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
                        <p><strong>Langkah 1:</strong> Cari <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" /> awal (n=12):</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>Posisi Q₁ = 13/4 = 3,25 → Q₁ = 47 + 0,25(50−47) = 47,75</p>
                          <BlockMath math="Q_1 = 47{,}75" />
                          <p>Posisi Q₃ = 39/4 = 9,75 → Q₃ = 63 + 0,75(65−63) = 64,5</p>
                          <BlockMath math="Q_3 = 64{,}5" />
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
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>Step 1:</strong> Find the original <InlineMath math="Q_1" /> and <InlineMath math="Q_3" /> (n=12):</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>Position of Q₁ = 13/4 = 3.25 → Q₁ = 47 + 0.25(50−47) = 47.75</p>
                          <BlockMath math="Q_1 = 47.75" />
                          <p>Position of Q₃ = 39/4 = 9.75 → Q₃ = 63 + 0.75(65−63) = 64.5</p>
                          <BlockMath math="Q_3 = 64.5" />
                          <BlockMath math="Q_d = \frac{64.5 - 47.75}{2} = \frac{16.75}{2} = 8.375 \approx 8 \checkmark" />
                        </div>
                        <p><strong>Step 2:</strong> With the new data, <InlineMath math="Q_3 = 66" /> and <InlineMath math="Q_1 = 47.75" /> (unchanged):</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="\text{IQR}_{\text{new}} = Q_3 - Q_1 = 66 - 47.75 = 18.25" />
                          <BlockMath math="Q_{d,\text{new}} = \frac{18.25}{2} = 9.125" />
                        </div>
                        <p><strong>Step 3:</strong> Identify the new data value.</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p className="text-xs text-white/60">New n = 13. New position of Q₃ = 3(14)/4 = 10.5 → average of the 10th and 11th data. For Q₃ = 66, the new data must affect the 10th or 11th position. The 10th data value is 65, so the new value must be around 67: for example <strong className="text-red-300">67 kg</strong>.</p>
                          <p className="text-xs text-white/50 mt-1">New sorted data: 40, 44, 47, 50, 52, 55, 58, 60, 63, 65, <strong>67</strong>, 70, 75 → Q₃ at position 10.5 = (65+67)/2 = 66 ✓</p>
                        </div>
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                          <p><strong className="text-red-300">Answer:</strong> The data value added is <InlineMath math="67" /> kg.<br />
                          New IQR = <InlineMath math="18.25" /> kg and <InlineMath math="Q_d = 9.125" /> kg.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>ステップ1：</strong> 元の<InlineMath math="Q_1" />と<InlineMath math="Q_3" />を求める（n=12）：</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>Q₁の位置 = 13/4 = 3.25 → Q₁ = 47 + 0.25(50−47) = 47.75</p>
                          <BlockMath math="Q_1 = 47.75" />
                          <p>Q₃の位置 = 39/4 = 9.75 → Q₃ = 63 + 0.75(65−63) = 64.5</p>
                          <BlockMath math="Q_3 = 64.5" />
                          <BlockMath math="Q_d = \frac{64.5 - 47.75}{2} = \frac{16.75}{2} = 8.375 \approx 8 \checkmark" />
                        </div>
                        <p><strong>ステップ2：</strong> 新しいデータでは<InlineMath math="Q_3 = 66" />、<InlineMath math="Q_1 = 47.75" />（変わらず）：</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="\text{IQR}_{\text{新}} = Q_3 - Q_1 = 66 - 47.75 = 18.25" />
                          <BlockMath math="Q_{d,\text{新}} = \frac{18.25}{2} = 9.125" />
                        </div>
                        <p><strong>ステップ3：</strong> 新しいデータを特定する。</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p className="text-xs text-white/60">新しいn = 13。新しいQ₃の位置 = 3(14)/4 = 10.5 → 10番目と11番目のデータの平均。Q₃ = 66にするには、新しいデータが10番目か11番目の位置に影響する必要があります。10番目のデータは65なので、新しいデータは67付近になります：例えば<strong className="text-red-300">67 kg</strong>。</p>
                          <p className="text-xs text-white/50 mt-1">新しく並べ替えたデータ：40, 44, 47, 50, 52, 55, 58, 60, 63, 65, <strong>67</strong>, 70, 75 → 位置10.5のQ₃ = (65+67)/2 = 66 ✓</p>
                        </div>
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                          <p><strong className="text-red-300">答え：</strong> 追加されたデータは<InlineMath math="67" /> kgです。<br />
                          新しいIQR = <InlineMath math="18.25" /> kg、<InlineMath math="Q_d = 9.125" /> kg。</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── SUB-BAB 2: TABEL DISTRIBUSI FREKUENSI TUNGGAL ───────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title={st.konsep2} />
            <div className="px-5 pb-5 space-y-4">

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-blue-300">
                  {language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Core Summary" : "🎯 要点まとめ"}
                </p>
                {language === "id" ? (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika data disajikan dalam <strong className="text-blue-300">tabel distribusi frekuensi tunggal</strong>, cara menghitung J, JIK, dan Qd pada dasarnya sama — kita tetap butuh <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" /> yang dicari via frekuensi kumulatif, kemudian menerapkan rumus yang sudah kita kenal.
                  </p>
                ) : language === "en" ? (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    When data is presented in a <strong className="text-blue-300">single frequency distribution table</strong>, calculating J, IQR, and QD works basically the same way — we still need <InlineMath math="Q_1" /> and <InlineMath math="Q_3" />, found via cumulative frequency, then apply the formulas we already know.
                  </p>
                ) : (
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    データが<strong className="text-blue-300">単一データ度数分布表</strong>で提示されている場合、J、四分位範囲、四分位偏差の計算方法は基本的に同じです — 累積度数から<InlineMath math="Q_1" />と<InlineMath math="Q_3" />を求め、すでに学んだ公式を適用します。
                  </p>
                )}

                <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                  <p className="font-body text-xs text-white/50 text-center">
                    {language === "id" ? "Alur Kerja Menghitung Penyebaran dari Tabel Frekuensi Tunggal" : language === "en" ? "Workflow for Calculating Dispersion from a Single Frequency Table" : "単一度数分布表から散らばりを計算する流れ"}
                  </p>
                  <div className="flex flex-col gap-2">
                    {(language === "id" ? [
                      { n: "1", t: "Buat kolom Frekuensi Kumulatif (FK)", c: "text-blue-300" },
                      { n: "2", t: "Cari Q₁ dan Q₃ menggunakan posisi k(n+1)/4", c: "text-blue-300" },
                      { n: "3", t: "Hitung J = x_maks − x_min dari nilai di tabel", c: "text-emerald-300" },
                      { n: "4", t: "Hitung JIK = Q₃ − Q₁", c: "text-purple-300" },
                      { n: "5", t: "Hitung Qd = JIK / 2", c: "text-pink-300" },
                    ] : language === "en" ? [
                      { n: "1", t: "Create a Cumulative Frequency (CF) column", c: "text-blue-300" },
                      { n: "2", t: "Find Q₁ and Q₃ using the position k(n+1)/4", c: "text-blue-300" },
                      { n: "3", t: "Calculate J = x_max − x_min from the values in the table", c: "text-emerald-300" },
                      { n: "4", t: "Calculate IQR = Q₃ − Q₁", c: "text-purple-300" },
                      { n: "5", t: "Calculate QD = IQR / 2", c: "text-pink-300" },
                    ] : [
                      { n: "1", t: "累積度数（FK）の列を作る", c: "text-blue-300" },
                      { n: "2", t: "位置 k(n+1)/4 を使ってQ₁とQ₃を求める", c: "text-blue-300" },
                      { n: "3", t: "表の値からJ = x_max − x_minを計算する", c: "text-emerald-300" },
                      { n: "4", t: "IQR = Q₃ − Q₁を計算する", c: "text-purple-300" },
                      { n: "5", t: "QD = IQR / 2を計算する", c: "text-pink-300" },
                    ]).map(({ n, t, c }) => (
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
                  <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">
                    {language === "id" ? "📋 Contoh Tabel — Jumlah Absensi 50 Siswa dalam Sebulan" : language === "en" ? "📋 Example Table — Number of Absences for 50 Students in a Month" : "📋 表の例 — 1ヶ月間の50人の生徒の欠席回数"}
                  </p>
                </div>
                <div className="p-3 overflow-x-auto">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-slate-700/40">
                        <th className="px-3 py-2 text-left text-blue-300 font-bold">
                          {language === "id" ? "Absensi (hari)" : language === "en" ? "Absences (days)" : "欠席（日）"}
                        </th>
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
                        <td className="px-3 py-2 text-white font-bold">
                          {language === "id" ? "Total" : language === "en" ? "Total" : "合計"}
                        </td>
                        <td className="px-3 py-2 text-center text-green-400 font-bold">50</td>
                        <td className="px-3 py-2 text-center text-yellow-400">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-4 pb-4 space-y-2">
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="text-xs text-white/50">n = 50:</p>
                    {language === "id" ? (
                      <>
                        <p className="text-xs text-white/60">Posisi Q₁ = 51/4 = 12,75 → FK≥12,75 → FK=20 → Q₁ = 1</p>
                        <BlockMath math="Q_1 = 1" />
                        <p className="text-xs text-white/60">Posisi Q₃ = 153/4 = 38,25 → FK≥38,25 → FK=44 → Q₃ = 3</p>
                        <BlockMath math="Q_3 = 3" />
                        <BlockMath math="J = x_{\text{maks}} - x_{\text{min}} = 5 - 0 = 5 \,\mathrm{hari}" />
                        <BlockMath math="\text{JIK} = 3 - 1 = 2 \,\mathrm{hari}" />
                        <BlockMath math="Q_d = \frac{2}{2} = 1 \,\mathrm{hari}" />
                      </>
                    ) : language === "en" ? (
                      <>
                        <p className="text-xs text-white/60">Position of Q₁ = 51/4 = 12.75 → CF≥12.75 → CF=20 → Q₁ = 1</p>
                        <BlockMath math="Q_1 = 1" />
                        <p className="text-xs text-white/60">Position of Q₃ = 153/4 = 38.25 → CF≥38.25 → CF=44 → Q₃ = 3</p>
                        <BlockMath math="Q_3 = 3" />
                        <BlockMath math="J = x_{\text{max}} - x_{\text{min}} = 5 - 0 = 5 \,\mathrm{days}" />
                        <BlockMath math="\text{IQR} = 3 - 1 = 2 \,\mathrm{days}" />
                        <BlockMath math="Q_d = \frac{2}{2} = 1 \,\mathrm{day}" />
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-white/60">Q₁の位置 = 51/4 = 12.75 → FK≥12.75 → FK=20 → Q₁ = 1</p>
                        <BlockMath math="Q_1 = 1" />
                        <p className="text-xs text-white/60">Q₃の位置 = 153/4 = 38.25 → FK≥38.25 → FK=44 → Q₃ = 3</p>
                        <BlockMath math="Q_3 = 3" />
                        <BlockMath math="J = x_{\text{max}} - x_{\text{min}} = 5 - 0 = 5 \,\mathrm{日}" />
                        <BlockMath math="\text{IQR} = 3 - 1 = 2 \,\mathrm{日}" />
                        <BlockMath math="Q_d = \frac{2}{2} = 1 \,\mathrm{日}" />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                {language === "id" ? (
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Catatan Penting:</strong> Untuk tabel distribusi frekuensi tunggal, <InlineMath math="x_{\text{maks}}" /> dan <InlineMath math="x_{\text{min}}" /> adalah nilai terbesar dan terkecil yang tertulis dalam kolom nilai, bukan frekuensinya.
                  </p>
                ) : language === "en" ? (
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Important Note:</strong> For a single frequency distribution table, <InlineMath math="x_{\text{max}}" /> and <InlineMath math="x_{\text{min}}" /> are the largest and smallest values written in the value column, not their frequency.
                  </p>
                ) : (
                  <p className="font-body text-sm text-yellow-200">
                    <strong>重要な注意：</strong> 単一データ度数分布表では、<InlineMath math="x_{\text{max}}" />と<InlineMath math="x_{\text{min}}" />は値の列に書かれている最大値と最小値であり、度数ではありません。
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── CONTOH SOAL SUB-BAB 2 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title={st.contoh2} />
            <div className="px-5 pb-5 space-y-6">

              {/* MUDAH */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{lvl.MUDAH}</span>
                  <span className="font-body font-semibold text-white">
                    {language === "id" ? "Contoh 1" : language === "en" ? "Example 1" : "例題1"}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-white mb-2">
                    {language === "id" ? "Tabel distribusi frekuensi jumlah buku yang dibaca 30 siswa selama sebulan:" : language === "en" ? "Frequency distribution table of the number of books read by 30 students in a month:" : "1ヶ月間に30人の生徒が読んだ本の数の度数分布表："}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">{language === "id" ? "Jumlah Buku" : language === "en" ? "Number of Books" : "本の数"}</th><th className="px-3 py-1 text-center text-white/70">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</th></tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[["1","4"],["2","8"],["3","10"],["4","6"],["5","2"]].map(([v,f])=>(
                          <tr key={v}><td className="px-3 py-1 text-white font-semibold">{v}</td><td className="px-3 py-1 text-center text-green-300">{f}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-sm text-white mt-2">
                    {language === "id" ? "Tentukan J, JIK, dan Qd!" : language === "en" ? "Determine J, IQR, and QD!" : "J、IQR、QDを求めなさい！"}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">
                    {language === "id" ? "PEMBAHASAN:" : language === "en" ? "SOLUTION:" : "解説："}
                  </p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
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
                          <p className="text-xs">Posisi Q₁ = 31/4 = 7,75 → FK≥7,75 → FK=12 → Q₁ = 2</p>
                          <BlockMath math="Q_1 = 2" />
                          <p className="text-xs">Posisi Q₃ = 93/4 = 23,25 → FK≥23,25 → FK=28 → Q₃ = 4</p>
                          <BlockMath math="Q_3 = 4" />
                        </div>
                        <p><strong>Langkah 3:</strong> Hitung ukuran penyebaran.</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J = 5 - 1 = 4 \,\mathrm{buku}" />
                          <BlockMath math="\text{JIK} = 4 - 2 = 2 \,\mathrm{buku}" />
                          <BlockMath math="Q_d = \frac{2}{2} = 1 \,\mathrm{buku}" />
                        </div>
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <p><strong className="text-green-300">Hasil:</strong> J = 4 · JIK = 2 · Qd = 1 (dalam satuan buku)</p>
                        </div>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>Step 1:</strong> Build the CF (n = 30):</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body">
                            <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Books</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">CF</th></tr></thead>
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
                        <p><strong>Step 2:</strong> Find the quartiles.</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p className="text-xs">Position of Q₁ = 31/4 = 7.75 → CF≥7.75 → CF=12 → Q₁ = 2</p>
                          <BlockMath math="Q_1 = 2" />
                          <p className="text-xs">Position of Q₃ = 93/4 = 23.25 → CF≥23.25 → CF=28 → Q₃ = 4</p>
                          <BlockMath math="Q_3 = 4" />
                        </div>
                        <p><strong>Step 3:</strong> Calculate the measures of dispersion.</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J = 5 - 1 = 4 \,\mathrm{books}" />
                          <BlockMath math="\text{IQR} = 4 - 2 = 2 \,\mathrm{books}" />
                          <BlockMath math="Q_d = \frac{2}{2} = 1 \,\mathrm{book}" />
                        </div>
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <p><strong className="text-green-300">Result:</strong> J = 4 · IQR = 2 · QD = 1 (in book units)</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>ステップ1：</strong> FKを作る（n = 30）：</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body">
                            <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">本の数</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">FK</th></tr></thead>
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
                        <p><strong>ステップ2：</strong> 四分位数を求める。</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p className="text-xs">Q₁の位置 = 31/4 = 7.75 → FK≥7.75 → FK=12 → Q₁ = 2</p>
                          <BlockMath math="Q_1 = 2" />
                          <p className="text-xs">Q₃の位置 = 93/4 = 23.25 → FK≥23.25 → FK=28 → Q₃ = 4</p>
                          <BlockMath math="Q_3 = 4" />
                        </div>
                        <p><strong>ステップ3：</strong> 散らばりの尺度を計算する。</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J = 5 - 1 = 4 \,\mathrm{冊}" />
                          <BlockMath math="\text{IQR} = 4 - 2 = 2 \,\mathrm{冊}" />
                          <BlockMath math="Q_d = \frac{2}{2} = 1 \,\mathrm{冊}" />
                        </div>
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <p><strong className="text-green-300">結果：</strong> J = 4 · IQR = 2 · QD = 1（単位：冊）</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* SEDANG */}
              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{lvl.SEDANG}</span>
                  <span className="font-body font-semibold text-white">
                    {language === "id" ? "Contoh 2" : language === "en" ? "Example 2" : "例題2"}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-white mb-2">
                    {language === "id" ? "Data skor game 40 pemain esports:" : language === "en" ? "Game score data of 40 esports players:" : "40人のeスポーツ選手のゲームスコアデータ："}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">{language === "id" ? "Skor" : language === "en" ? "Score" : "スコア"}</th><th className="px-3 py-1 text-center text-white/70">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</th></tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[["30","5"],["40","10"],["50","12"],["60","8"],["70","5"]].map(([v,f])=>(
                          <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-yellow-300">{f}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-sm text-white mt-2">
                    {language === "id" ? "Hitung simpangan kuartil dan interpretasikan artinya!" : language === "en" ? "Calculate the quartile deviation and interpret its meaning!" : "四分位偏差を計算し、その意味を解釈しなさい！"}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">
                    {language === "id" ? "PEMBAHASAN:" : language === "en" ? "SOLUTION:" : "解説："}
                  </p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
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
                          <p className="text-xs">Posisi Q₁ = 41/4 = 10,25 → FK≥10,25 → FK=15 → Q₁ = 40</p>
                          <BlockMath math="Q_1 = 40" />
                          <p className="text-xs">Posisi Q₃ = 123/4 = 30,75 → FK≥30,75 → FK=35 → Q₃ = 60</p>
                          <BlockMath math="Q_3 = 60" />
                          <BlockMath math="\text{JIK} = 60 - 40 = 20" />
                          <BlockMath math="Q_d = \frac{20}{2} = 10" />
                        </div>
                        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-yellow-200"><strong>Interpretasi:</strong> Simpangan kuartil = 10. Artinya, 50% pemain di bagian tengah memiliki skor yang "menyimpang" rata-rata sebesar <strong>10 poin</strong> dari median. Semakin kecil Qd, semakin seragam kemampuan para pemain.</p>
                        </div>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>Build the CF</strong> (n = 40):</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body">
                            <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Score</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">CF</th></tr></thead>
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
                          <p className="text-xs">Position of Q₁ = 41/4 = 10.25 → CF≥10.25 → CF=15 → Q₁ = 40</p>
                          <BlockMath math="Q_1 = 40" />
                          <p className="text-xs">Position of Q₃ = 123/4 = 30.75 → CF≥30.75 → CF=35 → Q₃ = 60</p>
                          <BlockMath math="Q_3 = 60" />
                          <BlockMath math="\text{IQR} = 60 - 40 = 20" />
                          <BlockMath math="Q_d = \frac{20}{2} = 10" />
                        </div>
                        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-yellow-200"><strong>Interpretation:</strong> Quartile deviation = 10. This means the middle 50% of players have scores that "deviate" by an average of <strong>10 points</strong> from the median. The smaller the QD, the more uniform the players' skill levels.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>FKを作る</strong>（n = 40）：</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body">
                            <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">スコア</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">FK</th></tr></thead>
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
                          <p className="text-xs">Q₁の位置 = 41/4 = 10.25 → FK≥10.25 → FK=15 → Q₁ = 40</p>
                          <BlockMath math="Q_1 = 40" />
                          <p className="text-xs">Q₃の位置 = 123/4 = 30.75 → FK≥30.75 → FK=35 → Q₃ = 60</p>
                          <BlockMath math="Q_3 = 60" />
                          <BlockMath math="\text{IQR} = 60 - 40 = 20" />
                          <BlockMath math="Q_d = \frac{20}{2} = 10" />
                        </div>
                        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                          <p className="text-yellow-200"><strong>解釈：</strong> 四分位偏差 = 10。これは、中央50%の選手のスコアが中央値から平均<strong>10点</strong>「偏差」していることを意味します。QDが小さいほど、選手の実力はより均一です。</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* SULIT */}
              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{lvl.SULIT}</span>
                  <span className="font-body font-semibold text-white">
                    {language === "id" ? "Contoh 3" : language === "en" ? "Example 3" : "例題3"}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-white mb-2">
                    {language === "id" ? "Data nilai keterampilan 60 siswa dalam skala 1–10:" : language === "en" ? "Skill score data for 60 students on a 1–10 scale:" : "1〜10のスケールにおける60人の生徒の技能スコアデータ："}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40"><th className="px-3 py-1 text-left text-white/70">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}</th><th className="px-3 py-1 text-center text-white/70">f</th></tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[["5","4"],["6","9"],["7","15"],["8","18"],["9","10"],["10","4"]].map(([v,f])=>(
                          <tr key={v}><td className="px-3 py-1 text-white">{v}</td><td className="px-3 py-1 text-center text-red-300">{f}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {language === "id" ? (
                    <p className="font-body text-sm text-white mt-2">
                      a) Hitung J, JIK, dan Qd.<br />
                      b) Tentukan persentase siswa yang nilainya berada dalam rentang <InlineMath math="[Q_2 - Q_d,\ Q_2 + Q_d]" />!
                    </p>
                  ) : language === "en" ? (
                    <p className="font-body text-sm text-white mt-2">
                      a) Calculate J, IQR, and QD.<br />
                      b) Determine the percentage of students whose scores fall within the range <InlineMath math="[Q_2 - Q_d,\ Q_2 + Q_d]" />!
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white mt-2">
                      a) J、IQR、QDを計算しなさい。<br />
                      b) 点数が範囲<InlineMath math="[Q_2 - Q_d,\ Q_2 + Q_d]" />内にある生徒の割合を求めなさい！
                    </p>
                  )}
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">
                    {language === "id" ? "PEMBAHASAN:" : language === "en" ? "SOLUTION:" : "解説："}
                  </p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
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
                          <p className="text-xs">Posisi Q₁ = 61/4 = 15,25 → FK≥15,25 → FK=28 → Q₁ = 7</p>
                          <BlockMath math="Q_1 = 7" />
                          <p className="text-xs">Posisi Q₂ = 122/4 = 30,5 → FK≥30,5 → FK=46 → Q₂ = 8</p>
                          <BlockMath math="Q_2 = 8" />
                          <p className="text-xs">Posisi Q₃ = 183/4 = 45,75 → FK≥45,75 → FK=46 → Q₃ = 8</p>
                          <BlockMath math="Q_3 = 8" />
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
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>Step 1:</strong> Build the CF (n = 60):</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body">
                            <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Score</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">CF</th></tr></thead>
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
                        <p><strong>Step 2:</strong> Find all the quartiles.</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p className="text-xs">Position of Q₁ = 61/4 = 15.25 → CF≥15.25 → CF=28 → Q₁ = 7</p>
                          <BlockMath math="Q_1 = 7" />
                          <p className="text-xs">Position of Q₂ = 122/4 = 30.5 → CF≥30.5 → CF=46 → Q₂ = 8</p>
                          <BlockMath math="Q_2 = 8" />
                          <p className="text-xs">Position of Q₃ = 183/4 = 45.75 → CF≥45.75 → CF=46 → Q₃ = 8</p>
                          <BlockMath math="Q_3 = 8" />
                        </div>
                        <p><strong>Step 3:</strong> Calculate the measures of dispersion.</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J = 10 - 5 = 5" />
                          <BlockMath math="\text{IQR} = Q_3 - Q_1 = 8 - 7 = 1" />
                          <BlockMath math="Q_d = \frac{1}{2} = 0.5" />
                        </div>
                        <p><strong>Step 4:</strong> Calculate the range <InlineMath math="[Q_2 - Q_d,\ Q_2 + Q_d]" />:</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="[8 - 0.5,\ 8 + 0.5] = [7.5;\ 8.5]" />
                          <p className="text-xs text-white/60">Only the value <strong className="text-red-300">8</strong> (f = 18) falls within this range</p>
                          <BlockMath math="\text{Percentage} = \frac{18}{60} \times 100\% = 30\%" />
                        </div>
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 space-y-1">
                          <p><strong className="text-red-300">Answer:</strong></p>
                          <p>a) J = 5, IQR = 1, QD = 0.5</p>
                          <p>b) Only <strong>30% of students (18 of 60)</strong> have scores within the range <InlineMath math="[7.5;\ 8.5]" />. This shows the data is fairly concentrated at the value 8.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>ステップ1：</strong> FKを作る（n = 60）：</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body">
                            <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">点数</th><th className="px-2 py-1 text-center text-white/50">f</th><th className="px-2 py-1 text-center text-yellow-300">FK</th></tr></thead>
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
                        <p><strong>ステップ2：</strong> すべての四分位数を求める。</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p className="text-xs">Q₁の位置 = 61/4 = 15.25 → FK≥15.25 → FK=28 → Q₁ = 7</p>
                          <BlockMath math="Q_1 = 7" />
                          <p className="text-xs">Q₂の位置 = 122/4 = 30.5 → FK≥30.5 → FK=46 → Q₂ = 8</p>
                          <BlockMath math="Q_2 = 8" />
                          <p className="text-xs">Q₃の位置 = 183/4 = 45.75 → FK≥45.75 → FK=46 → Q₃ = 8</p>
                          <BlockMath math="Q_3 = 8" />
                        </div>
                        <p><strong>ステップ3：</strong> 散らばりの尺度を計算する。</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="J = 10 - 5 = 5" />
                          <BlockMath math="\text{IQR} = Q_3 - Q_1 = 8 - 7 = 1" />
                          <BlockMath math="Q_d = \frac{1}{2} = 0.5" />
                        </div>
                        <p><strong>ステップ4：</strong> 範囲<InlineMath math="[Q_2 - Q_d,\ Q_2 + Q_d]" />を計算する：</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <BlockMath math="[8 - 0.5,\ 8 + 0.5] = [7.5;\ 8.5]" />
                          <p className="text-xs text-white/60">この範囲に入るのは値<strong className="text-red-300">8</strong>（f = 18）のみです</p>
                          <BlockMath math="\text{割合} = \frac{18}{60} \times 100\% = 30\%" />
                        </div>
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 space-y-1">
                          <p><strong className="text-red-300">答え：</strong></p>
                          <p>a) J = 5, IQR = 1, QD = 0.5</p>
                          <p>b) 範囲<InlineMath math="[7.5;\ 8.5]" />内に点数がある生徒は<strong>60人中18人（30%）</strong>のみです。これはデータが値8にかなり集中していることを示しています。</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── RANGKUMAN ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<TrendingUp className="w-5 h-5" />} iconColor="text-emerald-400" title={st.rangkuman} />
            <div className="px-5 pb-5 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-body">
                  <thead>
                    <tr className="bg-slate-700/40">
                      <th className="px-3 py-2 text-left text-white/70">
                        {language === "id" ? "Ukuran" : language === "en" ? "Measure" : "尺度"}
                      </th>
                      <th className="px-3 py-2 text-center text-white/70">
                        {language === "id" ? "Rumus" : language === "en" ? "Formula" : "公式"}
                      </th>
                      <th className="px-3 py-2 text-left text-white/70">
                        {language === "id" ? "Kelebihan" : language === "en" ? "Advantage" : "利点"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    <tr className="hover:bg-slate-700/20">
                      <td className="px-3 py-2 text-emerald-300 font-bold">
                        {language === "id" ? "Jangkauan (J)" : language === "en" ? "Range (J)" : "範囲（J）"}
                      </td>
                      <td className="px-3 py-2 text-center"><InlineMath math="x_{\text{maks}} - x_{\text{min}}" /></td>
                      <td className="px-3 py-2 text-white/60">
                        {language === "id" ? "Mudah dihitung" : language === "en" ? "Easy to calculate" : "計算が簡単"}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-700/20">
                      <td className="px-3 py-2 text-blue-300 font-bold">
                        {language === "id" ? "JIK" : language === "en" ? "IQR" : "IQR"}
                      </td>
                      <td className="px-3 py-2 text-center"><InlineMath math="Q_3 - Q_1" /></td>
                      <td className="px-3 py-2 text-white/60">
                        {language === "id" ? "Tahan outlier" : language === "en" ? "Resistant to outliers" : "外れ値に強い"}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-700/20">
                      <td className="px-3 py-2 text-purple-300 font-bold">
                        {language === "id" ? "Simpangan Kuartil (Qd)" : language === "en" ? "Quartile Deviation (QD)" : "四分位偏差（QD）"}
                      </td>
                      <td className="px-3 py-2 text-center"><InlineMath math="\dfrac{Q_3 - Q_1}{2}" /></td>
                      <td className="px-3 py-2 text-white/60">
                        {language === "id" ? "Stabil & intuitif" : language === "en" ? "Stable & intuitive" : "安定していて直感的"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(language === "id" ? [
                  { title: "Data Tunggal", color: "border-emerald-500/40 bg-emerald-900/20", points: ["Urutkan dulu, cari Q₁ dan Q₃ dengan rumus posisi.", "Gunakan interpolasi jika posisi berupa bilangan desimal.", "J = nilai terbesar − nilai terkecil dari data asli."] },
                  { title: "Tabel Frekuensi Tunggal", color: "border-blue-500/40 bg-blue-900/20", points: ["Buat kolom FK terlebih dahulu.", "Cari Q₁ dan Q₃ dari FK (FK pertama ≥ posisi).", "J = nilai terbesar − nilai terkecil dalam tabel."] },
                ] : language === "en" ? [
                  { title: "Single Data", color: "border-emerald-500/40 bg-emerald-900/20", points: ["Sort first, then find Q₁ and Q₃ using the position formula.", "Use interpolation if the position is a decimal number.", "J = largest value − smallest value from the original data."] },
                  { title: "Single Frequency Table", color: "border-blue-500/40 bg-blue-900/20", points: ["Build the CF column first.", "Find Q₁ and Q₃ from the CF (first CF ≥ position).", "J = largest value − smallest value in the table."] },
                ] : [
                  { title: "単一データ", color: "border-emerald-500/40 bg-emerald-900/20", points: ["まず並べ替え、位置の公式でQ₁とQ₃を求める。", "位置が小数の場合は補間法を使う。", "J = 元データの最大値 − 最小値。"] },
                  { title: "単一度数分布表", color: "border-blue-500/40 bg-blue-900/20", points: ["まずFKの列を作る。", "FKからQ₁とQ₃を求める（最初のFK ≥ 位置）。", "J = 表の最大値 − 最小値。"] },
                ]).map(({ title, color, points }) => (
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
                {language === "id" ? (
                  <p className="font-body text-sm text-purple-200">
                    <strong>Makin kecil Qd → data makin seragam (homogen)</strong><br />
                    <strong>Makin besar Qd → data makin beragam (heterogen)</strong>
                  </p>
                ) : language === "en" ? (
                  <p className="font-body text-sm text-purple-200">
                    <strong>Smaller QD → more uniform (homogeneous) data</strong><br />
                    <strong>Larger QD → more varied (heterogeneous) data</strong>
                  </p>
                ) : (
                  <p className="font-body text-sm text-purple-200">
                    <strong>QDが小さいほど → データはより均一（同質）</strong><br />
                    <strong>QDが大きいほど → データはより多様（異質）</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          <RangkumanSection
            gradientFrom="from-orange-900"
            gradientVia="via-amber-900"
            gradientTo="to-yellow-900"
            borderColor="border-orange-500/40"
            accentColor="text-orange-300"
            headerIcon="📡"
            judul={language === "id" ? "Rangkuman — Ukuran Penyebaran Data" : language === "en" ? "Summary — Measures of Dispersion" : "まとめ — 散らばりの尺度"}
            subjudul={language === "id" ? "Mengukur seberapa tersebar atau mengelompok data — pelengkap ukuran pemusatan!" : language === "en" ? "Measures how spread out or clustered data is — complements measures of central tendency!" : "データがどれだけ散らばっているか、集まっているかを測る — 代表値を補完します！"}
            ringkasan={language === "id" ? [
              {
                emoji: "📏",
                judul: "Jangkauan (J)",
                isi: "J = nilai terbesar - nilai terkecil. Sangat mudah dihitung, tapi sangat sensitif terhadap outlier. Satu nilai ekstrem bisa membuat J sangat besar.",
                bg: "bg-orange-900/50",
                border: "border-orange-500/40",
                textColor: "text-orange-200",
              },
              {
                emoji: "🔲",
                judul: "JIK — Jangkauan Antar Kuartil",
                isi: "JIK = Q3 - Q1. Mengukur rentang 50% data bagian tengah. Tidak terpengaruh outlier sehingga lebih robust (tahan). Selalu hitung Q1 dan Q3 dulu.",
                bg: "bg-amber-900/50",
                border: "border-amber-500/40",
                textColor: "text-amber-200",
              },
              {
                emoji: "⚖️",
                judul: "Simpangan Kuartil (Qd)",
                isi: "Qd = JIK / 2 = (Q3 - Q1) / 2. Rata-rata jarak dari Q1 ke Q2 dan dari Q2 ke Q3. Mengukur variabilitas data bagian tengah secara simetris.",
                bg: "bg-yellow-900/50",
                border: "border-yellow-600/40",
                textColor: "text-yellow-200",
              },
              {
                emoji: "📊",
                judul: "Interpretasi Penyebaran",
                isi: "Nilai penyebaran kecil = data berkelompok dekat (konsisten). Nilai besar = data tersebar jauh (variatif). Dua dataset bisa punya mean sama tapi penyebaran berbeda!",
                bg: "bg-red-900/50",
                border: "border-red-500/40",
                textColor: "text-red-200",
              },
            ] : language === "en" ? [
              {
                emoji: "📏",
                judul: "Range (J)",
                isi: "J = largest value − smallest value. Very easy to calculate, but very sensitive to outliers. One extreme value can make J very large.",
                bg: "bg-orange-900/50",
                border: "border-orange-500/40",
                textColor: "text-orange-200",
              },
              {
                emoji: "🔲",
                judul: "IQR — Interquartile Range",
                isi: "IQR = Q3 − Q1. Measures the range of the middle 50% of data. Not affected by outliers, so it's more robust. Always find Q1 and Q3 first.",
                bg: "bg-amber-900/50",
                border: "border-amber-500/40",
                textColor: "text-amber-200",
              },
              {
                emoji: "⚖️",
                judul: "Quartile Deviation (QD)",
                isi: "QD = IQR / 2 = (Q3 − Q1) / 2. The average distance from Q1 to Q2 and from Q2 to Q3. Measures the variability of the middle data symmetrically.",
                bg: "bg-yellow-900/50",
                border: "border-yellow-600/40",
                textColor: "text-yellow-200",
              },
              {
                emoji: "📊",
                judul: "Interpreting Dispersion",
                isi: "A small dispersion value = data is closely grouped (consistent). A large value = data is spread far apart (varied). Two datasets can have the same mean but different dispersion!",
                bg: "bg-red-900/50",
                border: "border-red-500/40",
                textColor: "text-red-200",
              },
            ] : [
              {
                emoji: "📏",
                judul: "範囲（J）",
                isi: "J = 最大値 − 最小値。計算は非常に簡単ですが、外れ値に非常に敏感です。1つの極端な値がJを非常に大きくすることがあります。",
                bg: "bg-orange-900/50",
                border: "border-orange-500/40",
                textColor: "text-orange-200",
              },
              {
                emoji: "🔲",
                judul: "IQR — 四分位範囲",
                isi: "IQR = Q3 − Q1。データ中央50%の範囲を測ります。外れ値の影響を受けないためより頑健です。常に先にQ1とQ3を計算します。",
                bg: "bg-amber-900/50",
                border: "border-amber-500/40",
                textColor: "text-amber-200",
              },
              {
                emoji: "⚖️",
                judul: "四分位偏差（QD）",
                isi: "QD = IQR / 2 = (Q3 − Q1) / 2。Q1からQ2、Q2からQ3までの平均距離。中央データの変動性を対称的に測ります。",
                bg: "bg-yellow-900/50",
                border: "border-yellow-600/40",
                textColor: "text-yellow-200",
              },
              {
                emoji: "📊",
                judul: "散らばりの解釈",
                isi: "散らばりの値が小さい = データが密集している（一貫性がある）。値が大きい = データが広く散らばっている（多様）。2つのデータセットが同じ平均を持ちながら散らばりが異なることがあります！",
                bg: "bg-red-900/50",
                border: "border-red-500/40",
                textColor: "text-red-200",
              },
            ]}
            rumus={language === "id" ? [
              {
                label: "Jangkauan",
                rumus: "J = x_{\\text{maks}} - x_{\\text{min}}",
                bg: "bg-orange-900/60",
                border: "border-orange-400/40",
                labelColor: "text-orange-300",
              },
              {
                label: "JIK dan Simpangan Kuartil",
                rumus: "\\text{JIK} = Q_3 - Q_1 \\quad;\\quad Q_d = \\frac{Q_3 - Q_1}{2}",
                bg: "bg-amber-900/60",
                border: "border-amber-400/40",
                labelColor: "text-amber-300",
              },
            ] : language === "en" ? [
              {
                label: "Range",
                rumus: "J = x_{\\text{max}} - x_{\\text{min}}",
                bg: "bg-orange-900/60",
                border: "border-orange-400/40",
                labelColor: "text-orange-300",
              },
              {
                label: "IQR and Quartile Deviation",
                rumus: "\\text{IQR} = Q_3 - Q_1 \\quad;\\quad Q_d = \\frac{Q_3 - Q_1}{2}",
                bg: "bg-amber-900/60",
                border: "border-amber-400/40",
                labelColor: "text-amber-300",
              },
            ] : [
              {
                label: "範囲",
                rumus: "J = x_{\\text{max}} - x_{\\text{min}}",
                bg: "bg-orange-900/60",
                border: "border-orange-400/40",
                labelColor: "text-orange-300",
              },
              {
                label: "四分位範囲と四分位偏差",
                rumus: "\\text{IQR} = Q_3 - Q_1 \\quad;\\quad Q_d = \\frac{Q_3 - Q_1}{2}",
                bg: "bg-amber-900/60",
                border: "border-amber-400/40",
                labelColor: "text-amber-300",
              },
            ]}
            tips={language === "id" ? [
              { emoji: "⚠️", teks: "Jangkauan sangat sensitif terhadap outlier. Jika ada data ekstrem, J bisa sangat besar dan tidak merepresentasikan penyebaran data secara umum." },
              { emoji: "🛡️", teks: "JIK dan Qd lebih robust (tahan outlier) daripada Jangkauan. Gunakan JIK/Qd saat data memiliki nilai ekstrem atau distribusi tidak simetris." },
              { emoji: "🔍", teks: "Cek selalu: Q1 < Q2 < Q3. Jika tidak, ada kesalahan dalam pengurutan atau penentuan kuartil. Ini adalah syarat mutlak yang harus terpenuhi!" },
              { emoji: "💡", teks: "Hubungan penting: Qd = JIK/2. Jika tahu salah satu, langsung bisa hitung yang lain. Jika soal memberi Qd = 8, maka JIK = 16." },
            ] : language === "en" ? [
              { emoji: "⚠️", teks: "The range is very sensitive to outliers. If there is extreme data, J can be very large and fail to represent the general spread of the data." },
              { emoji: "🛡️", teks: "IQR and QD are more robust (resistant to outliers) than the Range. Use IQR/QD when data has extreme values or an asymmetric distribution." },
              { emoji: "🔍", teks: "Always check: Q1 < Q2 < Q3. If not, there's an error in sorting or determining the quartiles. This is an absolute requirement that must be met!" },
              { emoji: "💡", teks: "Important relationship: QD = IQR/2. If you know one, you can immediately calculate the other. If a problem gives QD = 8, then IQR = 16." },
            ] : [
              { emoji: "⚠️", teks: "範囲は外れ値に非常に敏感です。極端なデータがある場合、Jは非常に大きくなり、データ全体の散らばりを表さなくなることがあります。" },
              { emoji: "🛡️", teks: "IQRとQDは範囲よりも頑健です（外れ値に強い）。データに極端な値や非対称な分布がある場合はIQR/QDを使用します。" },
              { emoji: "🔍", teks: "常に確認：Q1 < Q2 < Q3。そうでない場合、並べ替えや四分位数の決定に誤りがあります。これは必ず満たすべき条件です！" },
              { emoji: "💡", teks: "重要な関係：QD = IQR/2。片方が分かれば、もう片方も即座に計算できます。問題でQD = 8が与えられれば、IQR = 16です。" },
            ]}
            kesimpulan={
              language === "id"
                ? "Ukuran penyebaran melengkapi ukuran pemusatan — dua dataset bisa punya rata-rata yang sama tapi penyebaran yang sangat berbeda. Data dengan penyebaran kecil lebih konsisten dan dapat diandalkan. Ini adalah kunci analisis risiko di dunia keuangan, kontrol kualitas industri, dan penelitian ilmiah!"
                : language === "en"
                ? "Measures of dispersion complement measures of central tendency — two datasets can have the same average but very different spreads. Data with small dispersion is more consistent and reliable. This is key to risk analysis in finance, industrial quality control, and scientific research!"
                : "散らばりの尺度は代表値を補完します — 2つのデータセットが同じ平均を持ちながら、散らばりが大きく異なることがあります。散らばりが小さいデータはより一貫性があり信頼できます。これは金融のリスク分析、産業の品質管理、科学研究の鍵となります！"
            }
            kesimpulanBg="bg-gradient-to-r from-orange-900/80 to-amber-900/80"
            kesimpulanBorder="border-orange-400/50"
            kesimpulanTextColor="text-orange-100"
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              {pt.back}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PenyebaranDataPage;
