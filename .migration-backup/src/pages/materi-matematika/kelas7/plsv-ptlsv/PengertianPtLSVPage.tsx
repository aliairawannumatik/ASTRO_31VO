import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    title: "PENGERTIAN KETIDAKSAMAAN & PtLSV",
    subtitle: "Kelas 7 · PLSV & PtLSV · Materi Matematika",
    back: "Kembali ke PLSV & PtLSV",
    introTitle: "Lebih dari Sekadar Sama Dengan",
    introBody: 'Selama ini kita berkenalan dengan persamaan yang menggunakan tanda "=". Sekarang kita bertemu konsep baru yang lebih luas: <strong>pertidaksamaan</strong>. Dalam kehidupan nyata, kita sering menjumpai situasi seperti "harga tidak boleh lebih dari Rp50.000" atau "nilai ujian minimal 75" — itulah contoh pertidaksamaan!',
    introBox: "Pertidaksamaan bukan hanya tentang \"sama dengan\", melainkan tentang rentang nilai — lebih besar, lebih kecil, atau tidak sama dengan!",
    ketidakTitle: "Pengertian Ketidaksamaan",
    ketidakDefLabel: "Definisi:",
    ketidakDef: "adalah kalimat matematika yang menyatakan bahwa dua ekspresi",
    ketidakDef2: "tidak sama",
    ketidakDef3: ", dihubungkan dengan tanda",
    ketidakDef4: "pertidaksamaan",
    ketidakDef5: '(bukan tanda "=").',
    ketidakTableLabel: "Tanda-tanda Pertidaksamaan:",
    thSign: "Tanda", thRead: "Dibaca", thExample: "Contoh",
    sign1Read: "Lebih dari", sign2Read: "Kurang dari",
    sign3Read: "Lebih dari atau sama dengan", sign4Read: "Kurang dari atau sama dengan",
    sign5Read: "Tidak sama dengan",
    ketidakExLabel: "Contoh ketidaksamaan:",
    ex1: "Benar ✓ (10 memang lebih dari 7)",
    ex2: "Salah ✗ (3 tidak lebih dari 8)",
    ex3: "Benar ✓ (-5 memang kurang dari -2)",
    ex4: "Benar ✓ (6 sama dengan 6)",
    ptlsvTitle: "Pertidaksamaan Linear Satu Variabel (PtLSV)",
    ptlsvDefLabel: "Definisi PtLSV:",
    ptlsvDef: "adalah kalimat terbuka yang:",
    ptlsvB1: "Mengandung", ptlsvB1h: "tepat satu variabel",
    ptlsvB2: "Pangkat tertinggi variabelnya adalah", ptlsvB2h: "1 (linear)",
    ptlsvB3: "Dihubungkan dengan tanda", ptlsvB3h: "pertidaksamaan",
    ptlsvGeneralLabel: "Bentuk umum PtLSV:",
    ptlsvGeneralNote: "dengan",
    ptlsvExLabel: "Contoh PtLSV vs Bukan PtLSV:",
    ptlsvYes: "PtLSV", ptlsvNo: "Bukan PtLSV",
    ptlsvEx1: "PtLSV", ptlsvEx2: "PtLSV",
    ptlsvEx3: "Bukan PtLSV (pangkat 2)", ptlsvEx4: "Bukan PtLSV (dua variabel)",
    summaryTitle: "Ringkasan: Perbedaan PLSV dan PtLSV",
    thAspect: "Aspek", thPLSV: "PLSV", thPtLSV: "PtLSV",
    row1Label: "Tanda hubung", row1PLSV: "", row1PtLSV: "",
    row2Label: "Jumlah penyelesaian", row2PLSV: "1 nilai", row2PtLSV: "Banyak nilai (rentang)",
    row3Label: "Contoh", row4Label: "Penyelesaian",
    row4PLSV: "", row4PtLSV: "(tak terhingga)",
    summaryNote: "Ingat:",
    summaryNoteBody: "Penyelesaian PtLSV adalah",
    summaryNoteHighlight: "himpunan bilangan",
    summaryNoteEnd: "(bukan satu nilai), yang biasanya digambarkan pada",
    summaryNoteHighlight2: "garis bilangan",
    summaryNoteEnd2: "!",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "Contoh Soal", solution: "PEMBAHASAN:",
    c1Q: "Tentukan mana yang merupakan PtLSV dari kalimat-kalimat berikut:",
    c1a: "1 variabel, pangkat 1, tanda <", c1aR: "PtLSV ✓",
    c1b: "2 variabel", c1bR: "Bukan PtLSV ✗",
    c1c: "pangkat variabel = 2", c1cR: "Bukan PtLSV ✗",
    c1d: "1 variabel, pangkat 1, tanda ≤", c1dR: "PtLSV ✓",
    c2Q: "Dari PtLSV", c2QMid: ", tentukan apakah nilai-nilai berikut merupakan penyelesaiannya (dengan domain bilangan bulat):",
    c2Sub: "Substitusi setiap nilai ke",
    c2Yes: "Ya ✓", c2No: "Tidak ✗",
    c2Conc: "Penyelesaian dari",
    c2ConcMid: "adalah",
    c3Q: "Ubah kalimat berikut ke dalam bentuk PtLSV, kemudian tentukan apakah pernyataan tersebut benar atau salah:",
    c3a: '"Dua kali suatu bilangan dikurangi 3 tidak lebih dari 11"',
    c3b: "Apakah", c3bMid: "merupakan penyelesaian dari PtLSV tersebut?",
    c3c: "Apakah", c3cMid: "merupakan penyelesaian?",
    c3aModel: "Model PtLSV:",
    c3bTest: "Uji",
    c3True: "Benar ✓",
    c3bEnd: "adalah penyelesaian (karena 11 ≤ 11 berlaku).",
    c3cEnd: "juga penyelesaian.",
    c3Note: "Itulah mengapa PtLSV punya",
    c3NoteHighlight: "banyak penyelesaian",
    c3NoteEnd: "! Semua nilai",
    c3NoteEnd2: "adalah penyelesaian dari",
  },
  en: {
    title: "INEQUALITY AND LINEAR INEQUALITY IN ONE VARIABLE",
    subtitle: "Grade 7 · PLSV & PtLSV · Mathematics",
    back: "Back to PLSV & PtLSV",
    introTitle: "Beyond the Equals Sign",
    introBody: 'So far we have worked with equations using "=". Now we encounter a broader concept: <strong>inequalities</strong>. In real life, we often see situations like "the price must not exceed $50" or "minimum exam score is 75" — those are examples of inequalities!',
    introBox: 'Inequalities are not just about "equal to" — they are about a range of values: greater than, less than, or not equal to!',
    ketidakTitle: "What Is an Inequality?",
    ketidakDefLabel: "Definition:",
    ketidakDef: "is a mathematical statement expressing that two expressions are",
    ketidakDef2: "not equal",
    ketidakDef3: ", connected by an",
    ketidakDef4: "inequality sign",
    ketidakDef5: '(not "=").',
    ketidakTableLabel: "Inequality Signs:",
    thSign: "Sign", thRead: "Read as", thExample: "Example",
    sign1Read: "Greater than", sign2Read: "Less than",
    sign3Read: "Greater than or equal to", sign4Read: "Less than or equal to",
    sign5Read: "Not equal to",
    ketidakExLabel: "Examples of inequalities:",
    ex1: "True ✓ (10 is indeed greater than 7)",
    ex2: "False ✗ (3 is not greater than 8)",
    ex3: "True ✓ (-5 is indeed less than -2)",
    ex4: "True ✓ (6 equals 6)",
    ptlsvTitle: "Linear Inequality in One Variable (LIOV)",
    ptlsvDefLabel: "Definition of LIOV:",
    ptlsvDef: "is an open sentence that:",
    ptlsvB1: "Contains", ptlsvB1h: "exactly one variable",
    ptlsvB2: "The highest power of the variable is", ptlsvB2h: "1 (linear)",
    ptlsvB3: "Connected by an", ptlsvB3h: "inequality sign",
    ptlsvGeneralLabel: "General forms of LIOV:",
    ptlsvGeneralNote: "where",
    ptlsvExLabel: "Examples: LIOV vs Not LIOV:",
    ptlsvYes: "LIOV", ptlsvNo: "Not LIOV",
    ptlsvEx1: "LIOV", ptlsvEx2: "LIOV",
    ptlsvEx3: "Not LIOV (power 2)", ptlsvEx4: "Not LIOV (two variables)",
    summaryTitle: "Summary: Difference Between LEOV and LIOV",
    thAspect: "Aspect", thPLSV: "LEOV", thPtLSV: "LIOV",
    row1Label: "Connecting sign", row1PLSV: "", row1PtLSV: "",
    row2Label: "Number of solutions", row2PLSV: "1 value", row2PtLSV: "Many values (range)",
    row3Label: "Example", row4Label: "Solution",
    row4PLSV: "", row4PtLSV: "(infinitely many)",
    summaryNote: "Remember:",
    summaryNoteBody: "The solution of a LIOV is a",
    summaryNoteHighlight: "set of numbers",
    summaryNoteEnd: "(not a single value), usually shown on a",
    summaryNoteHighlight2: "number line",
    summaryNoteEnd2: "!",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "Example", solution: "SOLUTION:",
    c1Q: "Determine which of the following are LIOVs:",
    c1a: "1 variable, power 1, sign <", c1aR: "LIOV ✓",
    c1b: "2 variables", c1bR: "Not LIOV ✗",
    c1c: "variable power = 2", c1cR: "Not LIOV ✗",
    c1d: "1 variable, power 1, sign ≤", c1dR: "LIOV ✓",
    c2Q: "For the LIOV", c2QMid: ", determine whether each value is a solution (domain: integers):",
    c2Sub: "Substitute each value into",
    c2Yes: "Yes ✓", c2No: "No ✗",
    c2Conc: "Solutions from",
    c2ConcMid: "are",
    c3Q: "Translate the following into a LIOV, then determine if each value is a solution:",
    c3a: '"Twice a number minus 3 is at most 11"',
    c3b: "Is", c3bMid: "a solution of this LIOV?",
    c3c: "Is", c3cMid: "a solution?",
    c3aModel: "LIOV model:",
    c3bTest: "Test",
    c3True: "True ✓",
    c3bEnd: "is a solution (since 11 ≤ 11 holds).",
    c3cEnd: "is also a solution.",
    c3Note: "That is why a LIOV has",
    c3NoteHighlight: "many solutions",
    c3NoteEnd: "! All values",
    c3NoteEnd2: "are solutions of",
  },
  ja: {
    title: "不等号と一元一次不等式",
    subtitle: "中学1年 · 一元一次方程式と不等式 · 数学",
    back: "一元一次方程式・不等式に戻る",
    introTitle: "等号を超えた世界へ",
    introBody: 'これまでは「＝」を使った方程式を学んできました。今度はより広い概念、<strong>不等式</strong>を学びます。「価格は$50を超えてはならない」「試験の最低点は75点」といった日常の場面が不等式の例です！',
    introBox: "不等式は「等しい」だけでなく、値の範囲（大きい・小さい・等しくない）を表します！",
    ketidakTitle: "不等式とは",
    ketidakDefLabel: "定義：",
    ketidakDef: "は、2つの式が",
    ketidakDef2: "等しくない",
    ketidakDef3: "ことを表す数学的な文で、",
    ketidakDef4: "不等号",
    ketidakDef5: "（「＝」ではない記号）で結ばれています。",
    ketidakTableLabel: "不等号の種類：",
    thSign: "記号", thRead: "読み方", thExample: "例",
    sign1Read: "より大きい", sign2Read: "より小さい",
    sign3Read: "以上", sign4Read: "以下",
    sign5Read: "等しくない",
    ketidakExLabel: "不等式の例：",
    ex1: "真 ✓（10は7より大きい）",
    ex2: "偽 ✗（3は8より大きくない）",
    ex3: "真 ✓（-5は-2より小さい）",
    ex4: "真 ✓（6は6と等しい）",
    ptlsvTitle: "一元一次不等式",
    ptlsvDefLabel: "一元一次不等式の定義：",
    ptlsvDef: "は次の条件を満たす開いた文です：",
    ptlsvB1: "", ptlsvB1h: "変数がちょうど1種類",
    ptlsvB2: "変数の最高次数が", ptlsvB2h: "1（一次）",
    ptlsvB3: "", ptlsvB3h: "不等号",
    ptlsvGeneralLabel: "一元一次不等式の一般形：",
    ptlsvGeneralNote: "ただし",
    ptlsvExLabel: "一元一次不等式の例（○）と非例（✗）：",
    ptlsvYes: "一元一次不等式", ptlsvNo: "一元一次不等式でない",
    ptlsvEx1: "一元一次不等式", ptlsvEx2: "一元一次不等式",
    ptlsvEx3: "一元一次不等式でない（次数2）", ptlsvEx4: "一元一次不等式でない（変数2つ）",
    summaryTitle: "まとめ：一元一次方程式と一元一次不等式の違い",
    thAspect: "観点", thPLSV: "一元一次方程式", thPtLSV: "一元一次不等式",
    row1Label: "接続記号", row1PLSV: "", row1PtLSV: "",
    row2Label: "解の個数", row2PLSV: "1つ", row2PtLSV: "無数（範囲）",
    row3Label: "例", row4Label: "解",
    row4PLSV: "", row4PtLSV: "（無数）",
    summaryNote: "覚えよう：",
    summaryNoteBody: "一元一次不等式の解は",
    summaryNoteHighlight: "数の集合（解集合）",
    summaryNoteEnd: "であり（1つの値ではない）、通常は",
    summaryNoteHighlight2: "数直線",
    summaryNoteEnd2: "上に表します！",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題", solution: "解説：",
    c1Q: "次のうち一元一次不等式を選びなさい：",
    c1a: "変数1つ，次数1，不等号<", c1aR: "一元一次不等式 ✓",
    c1b: "変数2つ", c1bR: "一元一次不等式でない ✗",
    c1c: "変数の次数＝2", c1cR: "一元一次不等式でない ✗",
    c1d: "変数1つ，次数1，不等号≤", c1dR: "一元一次不等式 ✓",
    c2Q: "一元一次不等式", c2QMid: "について，次の値が解かどうか判断しなさい（整数の範囲）：",
    c2Sub: "各値を",
    c2Yes: "真 ✓", c2No: "偽 ✗",
    c2Conc: "",
    c2ConcMid: "の中で解になるものは",
    c3Q: "次の文を一元一次不等式に直し，各値が解かどうか確認しなさい：",
    c3a: "「ある数の2倍から3を引いた値が11以下」",
    c3b: "", c3bMid: "は一元一次不等式の解か？",
    c3c: "", c3cMid: "は解か？",
    c3aModel: "一元一次不等式：",
    c3bTest: "検証",
    c3True: "真 ✓",
    c3bEnd: "は解（11 ≤ 11 が成り立つ）。",
    c3cEnd: "も解。",
    c3Note: "これが一元一次不等式が",
    c3NoteHighlight: "無数の解",
    c3NoteEnd: "を持つ理由です！",
    c3NoteEnd2: "を満たすすべての",
  },
};

const PengertianPtLSVPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "ketidaksamaan", "ptlsv", "simbol", "contoh1", "contoh2", "contoh3"]);

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

          {/* Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.introBody }} />
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.introBox}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ketidaksamaan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("ketidaksamaan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.ketidakTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.ketidakDefLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>{language === "en" ? "An inequality" : language === "ja" ? "不等式" : "Ketidaksamaan"}</strong> {t.ketidakDef} <strong className="text-blue-300">{t.ketidakDef2}</strong>{t.ketidakDef3} <strong className="text-blue-300">{t.ketidakDef4}</strong> {t.ketidakDef5}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.ketidakTableLabel}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-4 text-primary">{t.thSign}</th>
                          <th className="text-left py-2 pr-4 text-primary">{t.thRead}</th>
                          <th className="text-left py-2 text-primary">{t.thExample}</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math=">" /></td>
                          <td className="py-2 pr-4">{t.sign1Read}</td>
                          <td className="py-2"><InlineMath math="8 > 5" /></td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math="<" /></td>
                          <td className="py-2 pr-4">{t.sign2Read}</td>
                          <td className="py-2"><InlineMath math="3 < 10" /></td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math="\geq" /></td>
                          <td className="py-2 pr-4">{t.sign3Read}</td>
                          <td className="py-2"><InlineMath math="x \geq 7" /></td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-xl"><InlineMath math="\leq" /></td>
                          <td className="py-2 pr-4">{t.sign4Read}</td>
                          <td className="py-2"><InlineMath math="x \leq 4" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-xl"><InlineMath math="\neq" /></td>
                          <td className="py-2 pr-4">{t.sign5Read}</td>
                          <td className="py-2"><InlineMath math="x \neq 0" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.ketidakExLabel}</p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    <p>• <InlineMath math="10 > 7" /> → {t.ex1}</p>
                    <p>• <InlineMath math="3 > 8" /> → {t.ex2}</p>
                    <p>• <InlineMath math="-5 < -2" /> → {t.ex3}</p>
                    <p>• <InlineMath math="6 \geq 6" /> → {t.ex4}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PtLSV */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("ptlsv")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">{t.ptlsvTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.ptlsvDefLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>{language === "en" ? "A Linear Inequality in One Variable (LIOV)" : language === "ja" ? "一元一次不等式" : "Pertidaksamaan Linear Satu Variabel (PtLSV)"}</strong> {t.ptlsvDef}
                  </p>
                  <ul className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <li>• {t.ptlsvB1} <strong className="text-purple-300">{t.ptlsvB1h}</strong></li>
                    <li>• {t.ptlsvB2} <strong className="text-purple-300">{t.ptlsvB2h}</strong></li>
                    <li>• {t.ptlsvB3} <strong className="text-purple-300">{t.ptlsvB3h}</strong> (<InlineMath math=">, <, \geq, \leq" />)</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.ptlsvGeneralLabel}</p>
                  <div className="space-y-1 text-center font-body text-sm text-white/80">
                    <p><InlineMath math="ax + b > c" />, {language === "en" ? "or" : language === "ja" ? "または" : "atau"} <InlineMath math="ax + b < c" />, {language === "en" ? "or" : language === "ja" ? "または" : "atau"}</p>
                    <p><InlineMath math="ax + b \geq c" />, {language === "en" ? "or" : language === "ja" ? "または" : "atau"} <InlineMath math="ax + b \leq c" /></p>
                    <p className="text-xs text-white/50 mt-1">{t.ptlsvGeneralNote} <InlineMath math="a \neq 0" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.ptlsvExLabel}</p>
                  <div className="space-y-2 font-body text-sm">
                    <p className="text-green-300">✓ <InlineMath math="2x + 3 > 7" /> → {t.ptlsvEx1}</p>
                    <p className="text-green-300">✓ <InlineMath math="5 - x \leq 10" /> → {t.ptlsvEx2}</p>
                    <p className="text-red-400">✗ <InlineMath math="x^2 > 4" /> → {t.ptlsvEx3}</p>
                    <p className="text-red-400">✗ <InlineMath math="2x + y > 5" /> → {t.ptlsvEx4}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("simbol")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.summaryTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body text-white/80">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2 pr-4 text-primary">{t.thAspect}</th>
                        <th className="text-left py-2 pr-4 text-blue-300">{t.thPLSV}</th>
                        <th className="text-left py-2 text-purple-300">{t.thPtLSV}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-2 pr-4">{t.row1Label}</td>
                        <td className="py-2 pr-4 text-blue-300"><InlineMath math="=" /></td>
                        <td className="py-2 text-purple-300"><InlineMath math=">, <, \geq, \leq" /></td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-2 pr-4">{t.row2Label}</td>
                        <td className="py-2 pr-4 text-blue-300">{t.row2PLSV}</td>
                        <td className="py-2 text-purple-300">{t.row2PtLSV}</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-2 pr-4">{t.row3Label}</td>
                        <td className="py-2 pr-4 text-blue-300"><InlineMath math="2x = 8" /></td>
                        <td className="py-2 text-purple-300"><InlineMath math="2x < 8" /></td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">{t.row4Label}</td>
                        <td className="py-2 pr-4 text-blue-300"><InlineMath math="x = 4" /></td>
                        <td className="py-2 text-purple-300"><InlineMath math="x < 4" /> {t.row4PtLSV}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.summaryNote}</strong> {t.summaryNoteBody} <strong>{t.summaryNoteHighlight}</strong> {t.summaryNoteEnd} <strong>{t.summaryNoteHighlight2}</strong>{t.summaryNoteEnd2}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 1 - Mudah */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh1")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded mr-2">{t.easy}</span>
                  {t.example} 1
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.c1Q}</p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="3x - 5 < 10" /></p>
                    <p>b. <InlineMath math="2x + y \geq 8" /></p>
                    <p>c. <InlineMath math="x^2 - 1 > 0" /></p>
                    <p>d. <InlineMath math="4x \leq 20" /></p>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="3x - 5 < 10" /> → {t.c1a} → <strong className="text-green-300">{t.c1aR}</strong></p>
                    <p>b. <InlineMath math="2x + y \geq 8" /> → {t.c1b} → <strong className="text-red-400">{t.c1bR}</strong></p>
                    <p>c. <InlineMath math="x^2 - 1 > 0" /> → {t.c1c} → <strong className="text-red-400">{t.c1cR}</strong></p>
                    <p>d. <InlineMath math="4x \leq 20" /> → {t.c1d} → <strong className="text-green-300">{t.c1dR}</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 2 - Sedang */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh2")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded mr-2">{t.medium}</span>
                  {t.example} 2
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {t.c2Q} <InlineMath math="x + 3 > 5" />{t.c2QMid}
                  </p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="x = 1" /> &nbsp;&nbsp; b. <InlineMath math="x = 3" /> &nbsp;&nbsp; c. <InlineMath math="x = 5" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.c2Sub} <InlineMath math="x + 3 > 5" />:</p>
                    <p>a. <InlineMath math="x=1" />: <InlineMath math="1 + 3 = 4 > 5" />? → <strong className="text-red-400">{t.c2No}</strong> (4 {language === "en" ? "is not greater than 5" : language === "ja" ? "は5より大きくない" : "tidak lebih dari 5"})</p>
                    <p>b. <InlineMath math="x=3" />: <InlineMath math="3 + 3 = 6 > 5" />? → <strong className="text-green-400">{t.c2Yes}</strong> (6 {language === "en" ? "is greater than 5" : language === "ja" ? "は5より大きい" : "lebih dari 5"})</p>
                    <p>c. <InlineMath math="x=5" />: <InlineMath math="5 + 3 = 8 > 5" />? → <strong className="text-green-400">{t.c2Yes}</strong> (8 {language === "en" ? "is greater than 5" : language === "ja" ? "は5より大きい" : "lebih dari 5"})</p>
                    <p className="mt-2">{t.c2Conc} <InlineMath math="\{1, 3, 5\}" /> {t.c2ConcMid} <InlineMath math="\{3, 5\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 3 - Sulit */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh3")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded mr-2">{t.hard}</span>
                  {t.example} 3
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.c3Q}</p>
                  <div className="mt-2 space-y-2 font-body text-sm text-white/80">
                    <p>a. {t.c3a}</p>
                    <p>b. {t.c3b} <InlineMath math="x = 7" /> {t.c3bMid}</p>
                    <p>c. {t.c3c} <InlineMath math="x = 6" /> {t.c3cMid}</p>
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>a.</strong> {language === "en" ? '"Twice a number minus 3" →' : language === "ja" ? "「ある数の2倍から3を引く」→" : '"Dua kali suatu bilangan dikurangi 3" →'} <InlineMath math="2x - 3" /></p>
                    <p>{language === "en" ? '"At most 11" →' : language === "ja" ? "「11以下」→" : '"Tidak lebih dari 11" →'} <InlineMath math="\leq 11" /></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>{t.c3aModel} <BlockMath math="2x - 3 \leq 11" /></p>
                    </div>
                    <p><strong>b.</strong> {t.c3bTest} <InlineMath math="x = 7" />:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="2(7) - 3 = 14 - 3 = 11 \leq 11" /> → <strong className="text-green-400">{t.c3True}</strong></p>
                      <p><InlineMath math="x = 7" /> {t.c3bEnd}</p>
                    </div>
                    <p><strong>c.</strong> {t.c3bTest} <InlineMath math="x = 6" />:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="2(6) - 3 = 12 - 3 = 9 \leq 11" /> → <strong className="text-green-400">{t.c3True}</strong></p>
                      <p><InlineMath math="x = 6" /> {t.c3cEnd}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="font-body text-sm text-purple-200">
                        {t.c3Note} <strong>{t.c3NoteHighlight}</strong>{t.c3NoteEnd} <InlineMath math="x \leq 7" /> {t.c3NoteEnd2} <InlineMath math="2x-3 \leq 11" />.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPtLSVPage;
