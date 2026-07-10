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
    title: "PERBANDINGAN BERTINGKAT",
    subtitle: "Kelas 7 · Perbandingan · Materi Matematika",
    back: "← Kembali ke Perbandingan",
    introTitle: "Apa Itu Perbandingan Bertingkat?",
    introBody: "Perbandingan bertingkat muncul ketika dua perbandingan berbeda dihubungkan melalui satu variabel perantara. Misalnya, diketahui A : B dan B : C — maka B adalah variabel perantara yang menghubungkan A dan C.",
    introCard1Title: "Contoh Masalah",
    introCard1Body: "A : B = 2 : 3 dan B : C = 4 : 5. Berapakah A : B : C?",
    introCard2Title: "Kunci Utama",
    introCard2Body: "Samakan nilai B di kedua perbandingan menggunakan KPK, lalu gabungkan menjadi satu rasio A : B : C.",
    introNote: "Catatan: Jika nilai perantara sudah sama di kedua perbandingan, tidak perlu menggunakan KPK — langsung gabungkan saja!",
    konsepTitle: "Ringkasan Intisari: Langkah-Langkah Penyelesaian",
    langkah: "Langkah",
    step1h: "Temukan variabel perantara",
    step1b: "variabel yang muncul di kedua perbandingan.",
    step2h: "Cari KPK",
    step2b: "dari angka variabel perantara di kedua perbandingan.",
    step3h: "Kalikan",
    step3b: "masing-masing perbandingan sehingga nilai perantara menjadi sama (= KPK).",
    step4h: "Gabungkan",
    step4b: "menjadi satu rasio A : B : C.",
    step5h: "Gunakan",
    step5b: "jumlah/selisih angka rasio untuk mencari nilai yang ditanyakan.",
    rumusCepatTitle: "Rumus Cepat:",
    cardJumlah: "Jika diketahui JUMLAH:",
    cardJumlahBody: "Gunakan jumlah seluruh angka rasio sebagai pembagi.",
    cardSelisih: "Jika diketahui SELISIH:",
    cardSelisihBody: "Gunakan selisih dua angka rasio yang bersangkutan sebagai pembagi.",
    contohTitle: "Contoh Soal dan Pembahasan",
    badgeMudah: "MUDAH",
    badgeSedang: "SEDANG",
    badgeSulit: "SULIT",
    pembahasan: "PEMBAHASAN:",
    c1Title: "Contoh 1 – Nilai Perantara Sudah Sama",
    c1Q: "Uang Adi : Beni = 2 : 3 dan uang Beni : Candra = 3 : 4. Jika jumlah uang ketiganya adalah Rp180.000, tentukan uang masing-masing!",
    c1S1: "Variabel perantara = Beni. Nilai Beni di kedua perbandingan = 3 (sudah sama, tidak perlu KPK).",
    c1S2: "Langsung gabungkan:",
    c1S3: "Total rasio = 2 + 3 + 4 = 9 bagian.",
    c1Math1: "1 \\text{ bagian} = \\frac{180.000}{9} = \\text{Rp20.000}",
    c1S4: "Hitung uang masing-masing:",
    c1Math2: "\\text{Adi} = 2 \\times 20.000 = \\text{Rp40.000}",
    c1Math3: "\\text{Beni} = 3 \\times 20.000 = \\text{Rp60.000}",
    c1Math4: "\\text{Candra} = 4 \\times 20.000 = \\text{Rp80.000}",
    c1Check: "Cek: 40.000 + 60.000 + 80.000 = 180.000 ✓",
    c2Title: "Contoh 2 – Perlu KPK, Diketahui Selisih",
    c2Q: "Kelereng Anto : Budi = 3 : 4 dan kelereng Budi : Cepi = 2 : 5. Jika selisih kelereng Anto dan Cepi adalah 14 butir, tentukan kelereng Budi!",
    c2S1: "Variabel perantara = Budi. Nilai Budi di dua perbandingan: 4 dan 2. KPK(4, 2) = 4.",
    c2S2: "Sesuaikan kedua perbandingan:",
    c2Note1: "Anto : Budi = 3 : 4 (sudah 4, tidak perlu dikali)",
    c2Note2: "Budi : Cepi = 2 : 5 → dikali 2 → (Budi menjadi 4)",
    c2S3: "Gabungkan → Anto : Budi : Cepi = 3 : 4 : 10",
    c2S4: "Selisih Cepi dan Anto: 10 − 3 = 7 bagian = 14 butir.",
    c2S5: "Kelereng Budi:",
    c2Result: "Kelereng Budi = 8 butir. Cek: Anto=6, Cepi=20, selisih=14 ✓",
    c3Title: "Contoh 3 – KPK, Selisih Ujung, Tanya Total",
    c3Q: "Modal usaha Adi : Budi = 3 : 4 dan modal Budi : Candra = 6 : 5. Jika selisih modal Adi dan Candra adalah Rp35.000, tentukan:",
    c3Sub1: "Modal masing-masing",
    c3Sub2: "Total modal ketiganya",
    c3S1: "Variabel perantara = Budi. Nilai Budi: 4 dan 6. KPK(4, 6) = 12.",
    c3S2: "Sesuaikan perbandingan agar nilai Budi menjadi 12:",
    c3Note1: "Adi : Budi = 3 : 4 → dikali 3 → 9 : 12",
    c3Note2: "Budi : Candra = 6 : 5 → dikali 2 → 12 : 10",
    c3S3: "Selisih Candra – Adi: 10 − 9 = 1 bagian = Rp35.000.",
    c3Math1: "1 \\text{ bagian} = \\text{Rp35.000}",
    c3S4: "Modal masing-masing:",
    c3Math2: "\\text{Adi} = 9 \\times 35.000 = \\text{Rp315.000}",
    c3Math3: "\\text{Budi} = 12 \\times 35.000 = \\text{Rp420.000}",
    c3Math4: "\\text{Candra} = 10 \\times 35.000 = \\text{Rp350.000}",
    c3S5: "Total modal:",
    c3Math5: "\\text{Total} = (9+12+10) \\times 35.000 = 31 \\times 35.000 = \\text{Rp1.085.000}",
    c3Check: "Cek selisih: 350.000 − 315.000 = 35.000 ✓",
  },
  en: {
    title: "COMPOUND RATIO",
    subtitle: "Grade 7 · Ratio · Mathematics",
    back: "← Back to Ratio",
    introTitle: "What Is a Compound Ratio?",
    introBody: "A compound ratio arises when two separate ratios are linked through one common (bridge) variable. For example, if A : B and B : C are given, then B is the bridge connecting A and C.",
    introCard1Title: "Example Problem",
    introCard1Body: "A : B = 2 : 3 and B : C = 4 : 5. What is A : B : C?",
    introCard2Title: "Key Idea",
    introCard2Body: "Equalise the value of B in both ratios using the LCM, then combine into one ratio A : B : C.",
    introNote: "Note: If the bridge value is already equal in both ratios, no LCM is needed — just combine directly!",
    konsepTitle: "Summary: Step-by-Step Solution",
    langkah: "Step",
    step1h: "Find the bridge variable",
    step1b: "the variable that appears in both ratios.",
    step2h: "Find the LCM",
    step2b: "of the bridge variable's values in both ratios.",
    step3h: "Multiply",
    step3b: "each ratio so the bridge value becomes equal (= LCM).",
    step4h: "Combine",
    step4b: "into one ratio A : B : C.",
    step5h: "Apply",
    step5b: "the sum or difference of ratio parts to find the unknown.",
    rumusCepatTitle: "Quick Formula:",
    cardJumlah: "If TOTAL is given:",
    cardJumlahBody: "Use the sum of all ratio parts as the divisor.",
    cardSelisih: "If DIFFERENCE is given:",
    cardSelisihBody: "Use the difference of the two relevant ratio parts as the divisor.",
    contohTitle: "Examples and Solutions",
    badgeMudah: "EASY",
    badgeSedang: "MEDIUM",
    badgeSulit: "HARD",
    pembahasan: "SOLUTION:",
    c1Title: "Example 1 – Bridge Value Already Equal",
    c1Q: "Taylor's money : Riley's money = 2 : 3 and Riley's money : Casey's money = 3 : 4. If the total money of all three is $180, find each person's amount!",
    c1S1: "Bridge variable = Riley. Riley's value in both ratios = 3 (already equal, no LCM needed).",
    c1S2: "Combine directly:",
    c1S3: "Total ratio = 2 + 3 + 4 = 9 parts.",
    c1Math1: "1 \\text{ part} = \\frac{180}{9} = \\$20",
    c1S4: "Calculate each amount:",
    c1Math2: "\\text{Taylor} = 2 \\times 20 = \\$40",
    c1Math3: "\\text{Riley} = 3 \\times 20 = \\$60",
    c1Math4: "\\text{Casey} = 4 \\times 20 = \\$80",
    c1Check: "Check: 40 + 60 + 80 = 180 ✓",
    c2Title: "Example 2 – LCM Needed, Difference Given",
    c2Q: "Devon's marbles : Parker's marbles = 3 : 4 and Parker's marbles : Cameron's marbles = 2 : 5. If the difference between Devon's and Cameron's marbles is 14, find Parker's marbles!",
    c2S1: "Bridge variable = Parker. Parker's value in both ratios: 4 and 2. LCM(4, 2) = 4.",
    c2S2: "Adjust both ratios:",
    c2Note1: "Devon : Parker = 3 : 4 (already 4, no multiplication needed)",
    c2Note2: "Parker : Cameron = 2 : 5 → multiply by 2 → (Parker becomes 4)",
    c2S3: "Combine → Devon : Parker : Cameron = 3 : 4 : 10",
    c2S4: "Difference Cameron − Devon: 10 − 3 = 7 parts = 14 marbles.",
    c2S5: "Parker's marbles:",
    c2Result: "Parker's marbles = 8. Check: Devon = 6, Cameron = 20, difference = 14 ✓",
    c3Title: "Example 3 – LCM, Difference of Extremes, Find Total",
    c3Q: "Taylor's capital : Riley's capital = 3 : 4 and Riley's capital : Casey's capital = 6 : 5. If the difference between Taylor's and Casey's capital is $35, find:",
    c3Sub1: "Each person's capital",
    c3Sub2: "Total capital of all three",
    c3S1: "Bridge variable = Riley. Riley's value: 4 and 6. LCM(4, 6) = 12.",
    c3S2: "Adjust ratios so Riley's value becomes 12:",
    c3Note1: "Taylor : Riley = 3 : 4 → multiply by 3 → 9 : 12",
    c3Note2: "Riley : Casey = 6 : 5 → multiply by 2 → 12 : 10",
    c3S3: "Difference Casey − Taylor: 10 − 9 = 1 part = $35.",
    c3Math1: "1 \\text{ part} = \\$35",
    c3S4: "Each person's capital:",
    c3Math2: "\\text{Taylor} = 9 \\times 35 = \\$315",
    c3Math3: "\\text{Riley} = 12 \\times 35 = \\$420",
    c3Math4: "\\text{Casey} = 10 \\times 35 = \\$350",
    c3S5: "Total capital:",
    c3Math5: "\\text{Total} = (9+12+10) \\times 35 = 31 \\times 35 = \\$1{,}085",
    c3Check: "Check difference: 350 − 315 = 35 ✓",
  },
  ja: {
    title: "複合比",
    subtitle: "中学1年 · 比 · 数学",
    back: "← 比に戻る",
    introTitle: "複合比とは？",
    introBody: "複合比は、2つの異なる比が1つの共通（橋渡し）変数を通じて結びついている場合に登場します。たとえば A : B と B : C が与えられたとき、B が A と C をつなぐ橋の役割を果たします。",
    introCard1Title: "問題例",
    introCard1Body: "A : B = 2 : 3 かつ B : C = 4 : 5。A : B : C は？",
    introCard2Title: "ポイント",
    introCard2Body: "両方の比における B の値を最小公倍数（LCM）で揃え、A : B : C の1つの比にまとめます。",
    introNote: "注意：橋渡し変数の値が両方の比ですでに等しい場合、LCMは不要です — そのまま合わせます！",
    konsepTitle: "まとめ：解き方のステップ",
    langkah: "ステップ",
    step1h: "橋渡し変数を見つける",
    step1b: "両方の比に登場する変数。",
    step2h: "最小公倍数（LCM）を求める",
    step2b: "両方の比における橋渡し変数の値のLCM。",
    step3h: "掛け算する",
    step3b: "橋渡しの値が等しくなるよう（= LCM）、それぞれの比を掛け算する。",
    step4h: "まとめる",
    step4b: "A : B : C の1つの比にまとめる。",
    step5h: "活用する",
    step5b: "比の数字の和・差を使って求めたい値を計算する。",
    rumusCepatTitle: "公式：",
    cardJumlah: "合計が与えられた場合：",
    cardJumlahBody: "全比の数字の合計を割る数として使います。",
    cardSelisih: "差が与えられた場合：",
    cardSelisihBody: "関係する2つの比の数字の差を割る数として使います。",
    contohTitle: "例題と解説",
    badgeMudah: "基本",
    badgeSedang: "標準",
    badgeSulit: "発展",
    pembahasan: "解説：",
    c1Title: "例題1 – 橋渡しの値がすでに等しい場合",
    c1Q: "Taylorのお金：Rileyのお金 = 2：3、Rileyのお金：Caseyのお金 = 3：4。3人の合計が$180のとき、それぞれの金額を求めなさい。",
    c1S1: "橋渡し変数 = Riley。両方の比における Riley の値 = 3（すでに等しい、LCM不要）。",
    c1S2: "そのまままとめます：",
    c1S3: "比の合計 = 2 + 3 + 4 = 9 パート。",
    c1Math1: "1 \\text{ パート} = \\frac{180}{9} = \\$20",
    c1S4: "それぞれの金額を計算：",
    c1Math2: "\\text{Taylor} = 2 \\times 20 = \\$40",
    c1Math3: "\\text{Riley} = 3 \\times 20 = \\$60",
    c1Math4: "\\text{Casey} = 4 \\times 20 = \\$80",
    c1Check: "確認：40 + 60 + 80 = 180 ✓",
    c2Title: "例題2 – LCMが必要・差が与えられた場合",
    c2Q: "Devonのビー玉：Parkerのビー玉 = 3：4、Parkerのビー玉：Cameronのビー玉 = 2：5。DevonとCameronのビー玉の差が14個のとき、Parkerのビー玉を求めなさい。",
    c2S1: "橋渡し変数 = Parker。Parker の値：4 と 2。LCM(4, 2) = 4。",
    c2S2: "両方の比を調整します：",
    c2Note1: "Devon : Parker = 3 : 4（すでに4、掛け算不要）",
    c2Note2: "Parker : Cameron = 2 : 5 → 2倍 →（Parkerが4になる）",
    c2S3: "まとめると → Devon : Parker : Cameron = 3 : 4 : 10",
    c2S4: "Cameron − Devon の差：10 − 3 = 7 パート = 14個。",
    c2S5: "Parkerのビー玉：",
    c2Result: "Parkerのビー玉 = 8個。確認：Devon = 6、Cameron = 20、差 = 14 ✓",
    c3Title: "例題3 – LCM・両端の差・合計を求める",
    c3Q: "Taylorの出資額：Rileyの出資額 = 3：4、Rileyの出資額：Caseyの出資額 = 6：5。TaylorとCaseyの出資額の差が$35のとき、次を求めなさい：",
    c3Sub1: "それぞれの出資額",
    c3Sub2: "3人の合計出資額",
    c3S1: "橋渡し変数 = Riley。Riley の値：4 と 6。LCM(4, 6) = 12。",
    c3S2: "Riley の値が12になるよう比を調整：",
    c3Note1: "Taylor : Riley = 3 : 4 → 3倍 → 9 : 12",
    c3Note2: "Riley : Casey = 6 : 5 → 2倍 → 12 : 10",
    c3S3: "Casey − Taylor の差：10 − 9 = 1 パート = $35。",
    c3Math1: "1 \\text{ パート} = \\$35",
    c3S4: "それぞれの出資額：",
    c3Math2: "\\text{Taylor} = 9 \\times 35 = \\$315",
    c3Math3: "\\text{Riley} = 12 \\times 35 = \\$420",
    c3Math4: "\\text{Casey} = 10 \\times 35 = \\$350",
    c3S5: "合計出資額：",
    c3Math5: "\\text{合計} = (9+12+10) \\times 35 = 31 \\times 35 = \\$1{,}085",
    c3Check: "差の確認：350 − 315 = 35 ✓",
  },
};

const PerbandinganBertingkatPage = () => {
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.introCard1Title}</p>
                    <p className="font-body text-sm text-white/70">
                      <InlineMath math="A : B = 2 : 3" /> {language === "id" ? "dan" : language === "ja" ? "かつ" : "and"} <InlineMath math="B : C = 4 : 5" />.
                      {" "}{t.introCard1Body.split("A : B = 2 : 3")[0].includes("Berapakah") ? "" : ""}
                      {" "}{language === "id" ? "Berapakah" : language === "ja" ? "" : "What is"} <InlineMath math="A : B : C" />{language === "ja" ? "は？" : "?"}
                    </p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.introCard2Title}</p>
                    <p className="font-body text-sm text-white/70">
                      {t.introCard2Body}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{language === "id" ? "Catatan:" : language === "ja" ? "注意：" : "Note:"}</strong> {t.introNote.replace(/^Catatan: |^Note: |^注意：/, "")}
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
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.konsepTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/60 mb-3">{language === "id" ? "LANGKAH-LANGKAH:" : language === "ja" ? "ステップ：" : "STEPS:"}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {[
                      { h: t.step1h, b: t.step1b },
                      { h: t.step2h, b: t.step2b },
                      { h: t.step3h, b: t.step3b },
                      { h: t.step4h, b: t.step4b },
                      { h: t.step5h, b: t.step5b },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-cyan-300 font-bold shrink-0">{i + 1}.</span>
                        <p><strong className="text-cyan-300">{step.h}</strong> — {step.b}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.rumusCepatTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\text{Nilai}_x = \frac{\text{rasio}_x}{\text{jumlah/selisih rasio}} \times \text{jumlah/selisih yang diketahui}" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-body text-xs text-white/70">
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-green-300 font-semibold mb-1">{t.cardJumlah}</p>
                      <p>{t.cardJumlahBody}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-yellow-300 font-semibold mb-1">{t.cardSelisih}</p>
                      <p>{t.cardSelisihBody}</p>
                    </div>
                  </div>
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
                      <p><strong>{t.langkah} 1:</strong> {t.c1S1}</p>
                      <p><strong>{t.langkah} 2:</strong> {t.c1S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={language === "id" ? "\\text{Adi} : \\text{Beni} : \\text{Candra} = 2 : 3 : 4" : language === "ja" ? "\\text{Taylor} : \\text{Riley} : \\text{Casey} = 2 : 3 : 4" : "\\text{Taylor} : \\text{Riley} : \\text{Casey} = 2 : 3 : 4"} />
                      </div>
                      <p><strong>{t.langkah} 3:</strong> {t.c1S3}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={t.c1Math1} />
                      </div>
                      <p><strong>{t.langkah} 4:</strong> {t.c1S4}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={t.c1Math2} />
                        <BlockMath math={t.c1Math3} />
                        <BlockMath math={t.c1Math4} />
                      </div>
                      <p className="text-primary font-semibold">{t.c1Check}</p>
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
                      <p><strong>{t.langkah} 1:</strong> {t.c2S1}</p>
                      <p><strong>{t.langkah} 2:</strong> {t.c2S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-white/60 text-xs mb-1">{t.c2Note1}</p>
                        <BlockMath math="3 : 4" />
                        <p className="text-white/60 text-xs mb-1">{t.c2Note2}</p>
                        <BlockMath math="4 : 10" />
                      </div>
                      <p><strong>{t.langkah} 3:</strong> {t.c2S3}</p>
                      <p><strong>{t.langkah} 4:</strong> {t.c2S4}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={language === "id" ? "1 \\text{ bagian} = \\frac{14}{7} = 2 \\text{ butir}" : language === "ja" ? "1 \\text{ パート} = \\frac{14}{7} = 2 \\text{ 個}" : "1 \\text{ part} = \\frac{14}{7} = 2 \\text{ marbles}"} />
                      </div>
                      <p><strong>{t.langkah} 5:</strong> {t.c2S5}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={language === "id" ? "\\text{Budi} = 4 \\times 2 = 8 \\text{ butir}" : language === "ja" ? "\\text{Parker} = 4 \\times 2 = 8 \\text{ 個}" : "\\text{Parker} = 4 \\times 2 = 8 \\text{ marbles}"} />
                      </div>
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
                    <ul className="list-disc list-inside font-body text-sm text-white/80 mt-2 space-y-1">
                      <li>{t.c3Sub1}</li>
                      <li>{t.c3Sub2}</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.langkah} 1:</strong> {t.c3S1}</p>
                      <p><strong>{t.langkah} 2:</strong> {t.c3S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-white/60 text-xs mb-1">{t.c3Note1}</p>
                        <p className="text-white/60 text-xs mb-1">{t.c3Note2}</p>
                        <BlockMath math={language === "id" ? "\\text{Adi} : \\text{Budi} : \\text{Candra} = 9 : 12 : 10" : language === "ja" ? "\\text{Taylor} : \\text{Riley} : \\text{Casey} = 9 : 12 : 10" : "\\text{Taylor} : \\text{Riley} : \\text{Casey} = 9 : 12 : 10"} />
                      </div>
                      <p><strong>{t.langkah} 3:</strong> {t.c3S3}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={t.c3Math1} />
                      </div>
                      <p><strong>{t.langkah} 4:</strong> {t.c3S4}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={t.c3Math2} />
                        <BlockMath math={t.c3Math3} />
                        <BlockMath math={t.c3Math4} />
                      </div>
                      <p><strong>{t.langkah} 5:</strong> {t.c3S5}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={t.c3Math5} />
                      </div>
                      <p className="text-primary font-semibold">{t.c3Check}</p>
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

export default PerbandinganBertingkatPage;
