import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    title: "PERBANDINGAN CAMPURAN (PENGAYAAN)",
    subtitle: "Kelas 7 · Perbandingan · Materi Matematika",
    back: "← Kembali ke Perbandingan",
    introTitle: "Apa Itu Perbandingan Campuran?",
    introBody: "Perbandingan campuran muncul ketika tiga variabel atau lebih saling terkait secara bersamaan — melibatkan gabungan antara hubungan senilai dan berbalik nilai dalam satu soal. Ini paling sering muncul dalam soal bertema Pekerja–Waktu–Hasil.",
    rel1Title: "Pekerja vs Hasil (Senilai):",
    rel1Body: "Pekerja makin banyak → hasil produksi makin banyak.",
    rel2Title: "Pekerja vs Waktu (Berbalik):",
    rel2Body: "Pekerja makin banyak → waktu yang dibutuhkan makin singkat.",
    rel3Title: "Waktu vs Hasil (Senilai):",
    rel3Body: "Waktu makin lama → hasil produksi makin banyak.",
    introNote: "Ingat: Perbandingan campuran tidak bisa diselesaikan hanya dengan satu jenis perbandingan. Kita butuh rumus gabungan!",
    konsepTitle: "Ringkasan Intisari: Rumus Campuran",
    konsepBody: "Cara paling efisien menyelesaikan perbandingan campuran adalah dengan Rumus Kerja berikut. Rumus ini menggabungkan ketiga variabel sekaligus:",
    formulaTitle: "Rumus Perbandingan Campuran:",
    symO: "O",
    symT: "T",
    symH: "H",
    nameO: "Objek / Orang",
    nameT: "Waktu",
    nameH: "Hasil",
    exO: "Pekerja, mesin, hewan",
    exT: "Jam, hari, minggu",
    exH: "Baju, meter jembatan, lubang",
    formulaNote: "Cara Membaca Rumus: \"Satu tim (O pekerja selama T waktu) menghasilkan H hasil.\" Kedua kondisi dibandingkan menggunakan proporsi. Yang belum diketahui (biasanya ada satu variabel) dicari dengan perkalian silang.",
    contohTitle: "Contoh Soal dan Pembahasan",
    badgeMudah: "MUDAH",
    badgeSedang: "SEDANG",
    badgeSulit: "SULIT",
    pembahasan: "PEMBAHASAN:",
    identifikasi: "Identifikasi:",
    langkah: "Langkah",
    analisis: "Perhatikan:",
    c1Title: "Contoh 1 – Mencari Hasil Produksi",
    c1Q: "Sebanyak 4 orang penjahit mampu menghasilkan 48 baju dalam waktu 6 hari. Jika jumlah penjahit ditambah menjadi 6 orang dan waktu kerja diperpanjang menjadi 9 hari, berapa baju yang bisa dihasilkan?",
    c1Id: "O₁ = 4, T₁ = 6, H₁ = 48, O₂ = 6, T₂ = 9, H₂ = x",
    c1Result: "Hasil produksi = 108 baju",
    c2Title: "Contoh 2 – Mencari Jumlah Pekerja",
    c2Q: "Sebanyak 8 orang pekerja dapat membangun tembok sepanjang 120 meter dalam waktu 10 hari. Jika kontraktor ingin membangun tembok 300 meter dalam waktu 15 hari, berapa pekerja yang dibutuhkan?",
    c2Id: "O₁ = 8, T₁ = 10, H₁ = 120, O₂ = x, T₂ = 15, H₂ = 300",
    c2Round: "Karena ini kebutuhan MINIMAL, kita selalu membulatkan KE ATAS (ceiling), bukan ke bilangan terdekat. Membulatkan ke bawah menjadi 13 pekerja tidak akan cukup untuk menyelesaikan tepat waktu. Ini disebut fungsi plafon: ⌈13,3⌉ = 14.",
    c2Result: "Dibutuhkan 14 pekerja  ⌈13,3⌉ = 14.",
    c3Title: "Contoh 3 – Mencari Waktu yang Dibutuhkan",
    c3Q: "Sebuah pabrik dengan 12 mesin dapat memproduksi 360 unit barang dalam waktu 5 hari. Jika 3 mesin mengalami kerusakan dan tidak bisa dioperasikan, berapa hari yang dibutuhkan untuk tetap menghasilkan 480 unit barang?",
    c3Note: "Mesin yang beroperasi berkurang menjadi 12 − 3 = 9 mesin.",
    c3Id: "O₁ = 12, T₁ = 5, H₁ = 360, O₂ = 9, T₂ = x, H₂ = 480",
    c3Analysis: "Mesin berkurang (12 → 9) dan target naik (360 → 480 unit). Kedua faktor ini membuat waktu jadi lebih lama. Hasilnya masuk akal: dari 5 hari menjadi ~9 hari.",
    c3AnalysisLabel: "Analisis logika:",
    c3Result: "Dibutuhkan sekitar 9 hari untuk menghasilkan 480 unit.",
  },
  en: {
    title: "COMBINED PROPORTION (ENRICHMENT)",
    subtitle: "Grade 7 · Ratio · Mathematics",
    back: "← Back to Ratio",
    introTitle: "What Is Combined Proportion?",
    introBody: "Combined proportion appears when three or more variables are interrelated simultaneously — involving both direct and inverse proportion in a single problem. This most often appears in Worker–Time–Output problems.",
    rel1Title: "Workers vs Output (Direct):",
    rel1Body: "More workers → more output produced.",
    rel2Title: "Workers vs Time (Inverse):",
    rel2Body: "More workers → less time needed.",
    rel3Title: "Time vs Output (Direct):",
    rel3Body: "More time → more output produced.",
    introNote: "Remember: Combined proportion cannot be solved with just one type of proportion. We need the combined formula!",
    konsepTitle: "Summary: The Combined Formula",
    konsepBody: "The most efficient way to solve combined proportion problems is with the Work Formula below. It combines all three variables at once:",
    formulaTitle: "Combined Proportion Formula:",
    symO: "O",
    symT: "T",
    symH: "H",
    nameO: "Object / People",
    nameT: "Time",
    nameH: "Output",
    exO: "Workers, machines, animals",
    exT: "Hours, days, weeks",
    exH: "Shirts, metres of wall, holes",
    formulaNote: "Reading the formula: \"One team (O workers over T time) produces H output.\" Both conditions are compared using proportion. The unknown (usually one variable) is found by cross-multiplication.",
    contohTitle: "Examples and Solutions",
    badgeMudah: "EASY",
    badgeSedang: "MEDIUM",
    badgeSulit: "HARD",
    pembahasan: "SOLUTION:",
    identifikasi: "Identify:",
    langkah: "Step",
    analisis: "Note:",
    c1Title: "Example 1 – Finding the Output",
    c1Q: "4 tailors can produce 48 shirts in 6 days. If the number of tailors increases to 6 and the working time extends to 9 days, how many shirts can be produced?",
    c1Id: "O₁ = 4, T₁ = 6, H₁ = 48, O₂ = 6, T₂ = 9, H₂ = x",
    c1Result: "Output = 108 shirts",
    c2Title: "Example 2 – Finding the Number of Workers",
    c2Q: "8 workers can build a 120-metre wall in 10 days. If a contractor wants to build a 300-metre wall in 15 days, how many workers are needed?",
    c2Id: "O₁ = 8, T₁ = 10, H₁ = 120, O₂ = x, T₂ = 15, H₂ = 300",
    c2Round: "Because this is a minimum requirement, we always round UP (ceiling), not to the nearest whole number. Rounding down to 13 workers would not be enough to finish on time. This is the ceiling function: ⌈13.3⌉ = 14.",
    c2Result: "14 workers are needed ⌈13.3⌉ = 14.",
    c3Title: "Example 3 – Finding the Time Needed",
    c3Q: "A factory with 12 machines can produce 360 units in 5 days. If 3 machines break down and cannot operate, how many days are needed to still produce 480 units?",
    c3Note: "Operating machines reduce to 12 − 3 = 9 machines.",
    c3Id: "O₁ = 12, T₁ = 5, H₁ = 360, O₂ = 9, T₂ = x, H₂ = 480",
    c3Analysis: "Fewer machines (12 → 9) and a higher target (360 → 480 units). Both factors increase the time needed. The result makes sense: from 5 days to ~9 days.",
    c3AnalysisLabel: "Logic check:",
    c3Result: "About 9 days are needed to produce 480 units.",
  },
  ja: {
    title: "複合比（発展）",
    subtitle: "中学1年 · 比 · 数学",
    back: "← 比に戻る",
    introTitle: "複合比とは？",
    introBody: "複合比は、3つ以上の変数が同時に関係し合う場合に登場します。正比例と反比例の両方を1つの問題で組み合わせます。これは「人数–時間–成果」問題に最もよく現れます。",
    rel1Title: "人数 vs 成果（正比例）：",
    rel1Body: "人数が増えると → 成果も増える。",
    rel2Title: "人数 vs 時間（反比例）：",
    rel2Body: "人数が増えると → かかる時間が減る。",
    rel3Title: "時間 vs 成果（正比例）：",
    rel3Body: "時間が長いほど → 成果も増える。",
    introNote: "注意：複合比は1種類の比だけでは解けません。複合公式が必要です！",
    konsepTitle: "まとめ：複合比の公式",
    konsepBody: "複合比問題を最も効率よく解く方法は、以下の作業公式です。3つの変数をすべて一度に組み合わせます：",
    formulaTitle: "複合比の公式：",
    symO: "O",
    symT: "T",
    symH: "H",
    nameO: "人数 / 機械数",
    nameT: "時間",
    nameH: "成果",
    exO: "作業員・機械・動物",
    exT: "時間・日・週",
    exH: "シャツ・壁の長さ・穴",
    formulaNote: "公式の読み方：「1チーム（O人がT時間働く）がH個の成果を出す。」両方の条件を比率で比較します。未知数（通常1変数）は交差乗算で求めます。",
    contohTitle: "例題と解説",
    badgeMudah: "基本",
    badgeSedang: "標準",
    badgeSulit: "発展",
    pembahasan: "解説：",
    identifikasi: "確認：",
    langkah: "ステップ",
    analisis: "注意：",
    c1Title: "例題1 – 成果を求める",
    c1Q: "4人の縫製工が6日間で48枚のシャツを作れます。縫製工が6人になり、作業日数が9日間に延びた場合、何枚のシャツが作れますか？",
    c1Id: "O₁ = 4, T₁ = 6, H₁ = 48, O₂ = 6, T₂ = 9, H₂ = x",
    c1Result: "成果 = 108枚のシャツ",
    c2Title: "例題2 – 作業員数を求める",
    c2Q: "8人の作業員が10日間で120メートルの壁を建設できます。請負業者が15日間で300メートルの壁を建設したい場合、何人の作業員が必要ですか？",
    c2Id: "O₁ = 8, T₁ = 10, H₁ = 120, O₂ = x, T₂ = 15, H₂ = 300",
    c2Round: "これは最低限必要な人数なので、四捨五入ではなく常に切り上げます（ceiling）。13人に切り捨てると期限内に完成できません。これを天井関数（ceiling function）といいます：⌈13.3⌉ = 14。",
    c2Result: "14人の作業員が必要（切り上げ）。",
    c3Title: "例題3 – かかる時間を求める",
    c3Q: "12台の機械がある工場で5日間に360個の製品を作れます。3台が故障して動かせない場合、480個の製品を作るのに何日かかりますか？",
    c3Note: "稼働機械数は 12 − 3 = 9台に減ります。",
    c3Id: "O₁ = 12, T₁ = 5, H₁ = 360, O₂ = 9, T₂ = x, H₂ = 480",
    c3Analysis: "機械が減り（12→9台）、目標が増える（360→480個）。どちらの要因も時間を長くします。結果は妥当：5日から約9日へ。",
    c3AnalysisLabel: "論理確認：",
    c3Result: "480個を作るには約9日かかります。",
  },
};

const PerbandinganCampuranPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;
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
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.subtitle}
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
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introBody}
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-white mb-1">
                    {language === "id" ? "Logika di Balik Perbandingan Campuran:" : language === "ja" ? "複合比の考え方：" : "The Logic Behind Combined Proportion:"}
                  </p>
                  <div className="space-y-2 font-body text-sm text-white/70">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold mt-0.5">↑↑</span>
                      <p><strong className="text-green-300">{t.rel1Title}</strong> {t.rel1Body}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold mt-0.5">↑↓</span>
                      <p><strong className="text-red-300">{t.rel2Title}</strong> {t.rel2Body}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold mt-0.5">↑↑</span>
                      <p><strong className="text-green-300">{t.rel3Title}</strong> {t.rel3Body}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{language === "id" ? "Ingat:" : language === "ja" ? "注意：" : "Remember:"}</strong> {t.introNote.replace(/^Ingat: |^Remember: |^注意：/, "")}
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
                <span className="font-body font-semibold text-white">{t.konsepTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.konsepBody}</p>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.formulaTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\frac{O_1 \times T_1}{H_1} = \frac{O_2 \times T_2}{H_2}" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-purple-500/20">
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">
                          {language === "id" ? "Simbol" : language === "ja" ? "記号" : "Symbol"}
                        </th>
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">
                          {language === "id" ? "Nama" : language === "ja" ? "名称" : "Name"}
                        </th>
                        <th className="px-3 py-2 text-purple-300 text-left border border-purple-500/30">
                          {language === "id" ? "Contoh" : language === "ja" ? "例" : "Example"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-purple-500/20">
                        <td className="px-3 py-2 font-mono text-purple-300"><InlineMath math="O" /></td>
                        <td className="px-3 py-2">{t.nameO}</td>
                        <td className="px-3 py-2">{t.exO}</td>
                      </tr>
                      <tr className="border border-purple-500/20 bg-slate-800/30">
                        <td className="px-3 py-2 font-mono text-purple-300"><InlineMath math="T" /></td>
                        <td className="px-3 py-2">{t.nameT}</td>
                        <td className="px-3 py-2">{t.exT}</td>
                      </tr>
                      <tr className="border border-purple-500/20">
                        <td className="px-3 py-2 font-mono text-purple-300"><InlineMath math="H" /></td>
                        <td className="px-3 py-2">{t.nameH}</td>
                        <td className="px-3 py-2">{t.exH}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">{t.formulaNote}</p>
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
                <span className="font-body font-semibold text-white">{t.contohTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMudah}</span>
                    <span className="font-body font-semibold text-white">{t.c1Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c1Q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.identifikasi}</strong> <InlineMath math="O_1 = 4,\ T_1 = 6,\ H_1 = 48,\ O_2 = 6,\ T_2 = 9,\ H_2 = x" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{O_1 \times T_1}{H_1} = \frac{O_2 \times T_2}{H_2}" />
                        <BlockMath math="\frac{4 \times 6}{48} = \frac{6 \times 9}{x}" />
                        <BlockMath math="\frac{24}{48} = \frac{54}{x} \Rightarrow \frac{1}{2} = \frac{54}{x}" />
                        <BlockMath math="x = 54 \times 2 = 108" />
                      </div>
                      <p className="text-primary font-semibold">{t.c1Result}</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSedang}</span>
                    <span className="font-body font-semibold text-white">{t.c2Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c2Q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.identifikasi}</strong> <InlineMath math="O_1 = 8,\ T_1 = 10,\ H_1 = 120,\ O_2 = x,\ T_2 = 15,\ H_2 = 300" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{8 \times 10}{120} = \frac{x \times 15}{300}" />
                        <BlockMath math="\frac{80}{120} = \frac{15x}{300}" />
                        <BlockMath math="\frac{2}{3} = \frac{15x}{300} \Rightarrow 3 \times 15x = 2 \times 300" />
                        <BlockMath math="45x = 600 \Rightarrow x = \frac{600}{45} = \frac{40}{3} \approx 13{,}3" />
                      </div>
                      <p className="text-white/60 text-xs">{t.c2Round}</p>
                      <p className="text-primary font-semibold">{t.c2Result}</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSulit}</span>
                    <span className="font-body font-semibold text-white">{t.c3Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c3Q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.analisis}</strong> {t.c3Note}</p>
                      <p><strong>{t.identifikasi}</strong> <InlineMath math="O_1 = 12,\ T_1 = 5,\ H_1 = 360,\ O_2 = 9,\ T_2 = x,\ H_2 = 480" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{12 \times 5}{360} = \frac{9 \times x}{480}" />
                        <BlockMath math="\frac{60}{360} = \frac{9x}{480}" />
                        <BlockMath math="\frac{1}{6} = \frac{9x}{480} \Rightarrow 9x = \frac{480}{6} = 80" />
                        <BlockMath math="x = \frac{80}{9} \approx 8{,}9 \approx 9" />
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="text-white/70 text-xs mb-1">{t.c3AnalysisLabel}</p>
                        <p className="text-white/80">{t.c3Analysis}</p>
                      </div>
                      <p className="text-primary font-semibold">{t.c3Result}</p>
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
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganCampuranPage;
