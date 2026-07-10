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
    title: "KALIMAT TERBUKA DAN TERTUTUP",
    subtitle: "Kelas 7 · PLSV & PtLSV · Materi Matematika",
    back: "Kembali ke PLSV & PtLSV",
    introTitle: "Apa Itu Kalimat Terbuka dan Tertutup?",
    introBody: "Dalam matematika, tidak semua kalimat langsung bisa dinilai benar atau salah. Ada kalimat yang \"menggantung\" karena ada bagian yang belum diketahui — dan ada yang langsung bisa dinilai. Di sinilah perbedaan",
    introHighlight1: "kalimat terbuka",
    introAnd: "dan",
    introHighlight2: "kalimat tertutup",
    introEnd: ".",
    introBox: 'Bayangkan kamu menemukan secarik kertas bertuliskan: "Aku punya __ ekor kucing." Kamu tidak bisa menilai apakah itu banyak atau sedikit sebelum tahu isinya. Itulah konsep kalimat terbuka!',
    terbukaSectionTitle: "Kalimat Terbuka",
    terbukaDef: "Definisi:",
    terbukaDefBody: "adalah kalimat matematika yang mengandung",
    terbukaDefBody2: "— yaitu simbol seperti",
    terbukaDefBody3: ", dll — sehingga nilai kebenarannya (benar atau salah) belum bisa ditentukan sampai variabel tersebut diganti dengan suatu nilai tertentu.",
    terbukaExampleLabel: "Contoh kalimat terbuka:",
    terbukaEx1: "belum tahu apakah benar atau salah sebelum nilai",
    terbukaEx1b: "diketahui.",
    terbukaEx2: "bergantung pada nilai",
    terbukaEx3: "bisa benar atau salah tergantung",
    terbukaEx4: '"Hari ini adalah hari ___" → tergantung hari apa.',
    terbukaSolTitle: "Penyelesaian Kalimat Terbuka:",
    terbukaSolBody: "Kalimat terbuka bisa diselesaikan dengan cara",
    terbukaSolHighlight1: "mengganti variabelnya",
    terbukaSolBody2: "dengan suatu bilangan hingga kalimat tersebut menjadi",
    terbukaSolHighlight2: "kalimat yang benar",
    terbukaSolBody3: ". Pengganti variabel yang membuat kalimat terbuka menjadi benar disebut",
    terbukaSolHighlight3: "penyelesaian",
    terbukaSolOr: "atau",
    terbukaSolHighlight4: "solusi",
    terbukaSolEnd: ".",
    terbukaSubEx: "Contoh: Kalimat terbuka",
    terbukaTry1: "Coba",
    terbukaTryResult1: "→",
    terbukaTryTrue: "BENAR ✓",
    terbukaTryFalse: "SALAH ✗",
    terbukaTrySol: "→ Jadi",
    terbukaTrySolEnd: "adalah penyelesaiannya.",
    terbukaHP: "Himpunan semua nilai pengganti yang membuat kalimat terbuka menjadi benar disebut",
    terbukaHPHighlight: "Himpunan Penyelesaian (HP)",
    terbukaHPEnd: ".",
    tertutupSectionTitle: "Kalimat Tertutup (Pernyataan)",
    tertutupDef: "Definisi:",
    tertutupDefBody1: "(juga disebut",
    tertutupDefBody2: "pernyataan",
    tertutupDefBody3: ") adalah kalimat matematika yang sudah",
    tertutupDefBody4: "tidak mengandung variabel",
    tertutupDefBody5: ", sehingga bisa langsung ditentukan nilai kebenarannya — apakah",
    tertutupBenar: "benar (B)",
    tertutupOr: "atau",
    tertutupSalah: "salah (S)",
    tertutupEnd: ".",
    tertutupExLabel: "Contoh kalimat tertutup (pernyataan):",
    tertutupClosed1: '"Paris adalah ibu kota Prancis" →',
    tertutupClosed2: "Benar ✓",
    tertutupNote: "Catatan penting:",
    tertutupNoteBody: 'Kalimat yang tidak bisa dinilai benar/salah, seperti perintah ("Tutup pintunya!") atau pertanyaan ("Berapa umurmu?"),',
    tertutupNoteBold: "bukan",
    tertutupNoteEnd: "termasuk kalimat tertutup maupun terbuka dalam matematika.",
    tipsSectionTitle: "Tips Cepat Membedakan Kalimat Terbuka & Tertutup",
    tipsHeader: "🚀 Tips Astronot Matematika:",
    tipsStep1: "Langkah 1:",
    tipsStep1Body: "Cek apakah ada huruf variabel (",
    tipsStep1BodyEnd: ", dll) di dalam kalimat.",
    tipsStep2: "Langkah 2:",
    tipsStep2Body: "Jika",
    tipsStep2Highlight: "ada variabel",
    tipsStep2End: "→ itu",
    tipsStep2Result: "Kalimat Terbuka",
    tipsStep3: "Langkah 3:",
    tipsStep3Body: "Jika",
    tipsStep3Highlight: "tidak ada variabel",
    tipsStep3End: "dan bisa dinilai benar/salah → itu",
    tipsStep3Result: "Kalimat Tertutup (Pernyataan)",
    tipsStep4: "Langkah 4:",
    tipsStep4Body: "Jika berupa perintah atau pertanyaan →",
    tipsStep4Result: "bukan keduanya",
    tipsStep4End: ".",
    tableTitle: "Tabel Ringkasan:",
    tableColType: "Jenis",
    tableColChar: "Ciri-ciri",
    tableColJudge: "Bisa dinilai?",
    tableRow1Type: "Terbuka",
    tableRow1Char: "Ada variabel",
    tableRow1Judge: "Belum bisa",
    tableRow2Type: "Tertutup",
    tableRow2Char: "Tanpa variabel",
    tableRow2Judge: "Bisa (B/S)",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh Soal",
    solution: "PEMBAHASAN:",
    c1Question: "Tentukan mana yang termasuk kalimat terbuka dan mana yang termasuk kalimat tertutup (pernyataan) dari kalimat-kalimat berikut:",
    c1Check: "Cek setiap kalimat:",
    c1a: "ada variabel",
    c1aResult: "Kalimat Terbuka",
    c1b: "tidak ada variabel, nilainya benar",
    c1bResult: "Kalimat Tertutup (Benar)",
    c1c: "tidak ada variabel, nilainya salah (harusnya 7)",
    c1cResult: "Kalimat Tertutup (Salah)",
    c1d: "ada variabel",
    c1dResult: "Kalimat Terbuka",
    c2Question: "Diberikan kalimat terbuka",
    c2QuestionEnd: ". Tentukan apakah nilai-nilai berikut merupakan penyelesaiannya:",
    c2Method: "Cara menguji: substitusi setiap nilai ke kalimat terbuka, lihat apakah hasilnya benar.",
    c2Test: "Uji",
    c2TrueResult: "Benar! ✓",
    c2TrueEnd: "adalah penyelesaian.",
    c2FalseResult: "Salah ✗",
    c2FalseEnd: "bukan penyelesaian.",
    c2Conclusion: "Kesimpulan: Himpunan Penyelesaian (HP) =",
    c3Question: "Dari kalimat-kalimat berikut, klasifikasikan masing-masing sebagai kalimat terbuka, kalimat tertutup benar, kalimat tertutup salah, atau bukan keduanya. Jika kalimat terbuka, tentukan satu nilai penyelesaiannya!",
    c3d: "Uji dari",
    c3Open: "Kalimat Terbuka",
    c3TrueClose: "Kalimat Tertutup Benar ✓",
    c3Neither: "Bukan kalimat terbuka maupun tertutup",
    c3NoteLabel: "c. \"Kerjakan soal nomor 3!\"",
    c3NoteResult: "Berupa perintah, tidak bisa dinilai benar/salah →",
    c3Sol: "HP dari himpunan",
  },
  en: {
    title: "OPEN AND CLOSED SENTENCES",
    subtitle: "Grade 7 · PLSV & PtLSV · Mathematics",
    back: "Back to PLSV & PtLSV",
    introTitle: "What Are Open and Closed Sentences?",
    introBody: "In mathematics, not every sentence can immediately be judged as true or false. Some sentences are \"hanging\" because a part is unknown — others can be evaluated right away. This is the difference between",
    introHighlight1: "open sentences",
    introAnd: "and",
    introHighlight2: "closed sentences",
    introEnd: ".",
    introBox: 'Imagine finding a note that reads: "I have __ cats." You cannot judge whether that is many or few until you know the number. That is the concept of an open sentence!',
    terbukaSectionTitle: "Open Sentence",
    terbukaDef: "Definition:",
    terbukaDefBody: "is a mathematical sentence that contains a",
    terbukaDefBody2: "— a symbol such as",
    terbukaDefBody3: ", etc. — so its truth value (true or false) cannot be determined until the variable is replaced by a specific value.",
    terbukaExampleLabel: "Examples of open sentences:",
    terbukaEx1: "we do not know if it is true or false before the value of",
    terbukaEx1b: "is known.",
    terbukaEx2: "depends on the value of",
    terbukaEx3: "can be true or false depending on",
    terbukaEx4: '"Today is ___ day." → depends on which day.',
    terbukaSolTitle: "Solving an Open Sentence:",
    terbukaSolBody: "An open sentence can be solved by",
    terbukaSolHighlight1: "replacing the variable",
    terbukaSolBody2: "with a number until the sentence becomes a",
    terbukaSolHighlight2: "true sentence",
    terbukaSolBody3: ". The replacement that makes the open sentence true is called the",
    terbukaSolHighlight3: "solution",
    terbukaSolOr: "or",
    terbukaSolHighlight4: "root",
    terbukaSolEnd: ".",
    terbukaSubEx: "Example: Open sentence",
    terbukaTry1: "Try",
    terbukaTryResult1: "→",
    terbukaTryTrue: "TRUE ✓",
    terbukaTryFalse: "FALSE ✗",
    terbukaTrySol: "→ So",
    terbukaTrySolEnd: "is the solution.",
    terbukaHP: "The set of all replacements that make the open sentence true is called the",
    terbukaHPHighlight: "Solution Set (SS)",
    terbukaHPEnd: ".",
    tertutupSectionTitle: "Closed Sentence (Statement / Proposition)",
    tertutupDef: "Definition:",
    tertutupDefBody1: "(also called a",
    tertutupDefBody2: "statement",
    tertutupDefBody3: ") is a mathematical sentence that",
    tertutupDefBody4: "contains no variable",
    tertutupDefBody5: ", so its truth value can be determined immediately — either",
    tertutupBenar: "true (T)",
    tertutupOr: "or",
    tertutupSalah: "false (F)",
    tertutupEnd: ".",
    tertutupExLabel: "Examples of closed sentences (statements):",
    tertutupClosed1: '"Paris is the capital of France" →',
    tertutupClosed2: "True ✓",
    tertutupNote: "Important note:",
    tertutupNoteBody: 'Sentences that cannot be judged true or false, such as commands ("Close the door!") or questions ("How old are you?"),',
    tertutupNoteBold: "are not",
    tertutupNoteEnd: "open or closed sentences in mathematics.",
    tipsSectionTitle: "Quick Tips: Telling Open & Closed Sentences Apart",
    tipsHeader: "🚀 Math Astronaut Tips:",
    tipsStep1: "Step 1:",
    tipsStep1Body: "Check whether there is a variable letter (",
    tipsStep1BodyEnd: ", etc.) in the sentence.",
    tipsStep2: "Step 2:",
    tipsStep2Body: "If",
    tipsStep2Highlight: "a variable is present",
    tipsStep2End: "→ it is an",
    tipsStep2Result: "Open Sentence",
    tipsStep3: "Step 3:",
    tipsStep3Body: "If",
    tipsStep3Highlight: "no variable is present",
    tipsStep3End: "and it can be judged true/false → it is a",
    tipsStep3Result: "Closed Sentence (Statement)",
    tipsStep4: "Step 4:",
    tipsStep4Body: "If it is a command or a question →",
    tipsStep4Result: "neither",
    tipsStep4End: ".",
    tableTitle: "Summary Table:",
    tableColType: "Type",
    tableColChar: "Characteristics",
    tableColJudge: "Can be judged?",
    tableRow1Type: "Open",
    tableRow1Char: "Has a variable",
    tableRow1Judge: "Not yet",
    tableRow2Type: "Closed",
    tableRow2Char: "No variable",
    tableRow2Judge: "Yes (T/F)",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    c1Question: "Determine which of the following are open sentences and which are closed sentences (statements):",
    c1Check: "Check each sentence:",
    c1a: "has variable",
    c1aResult: "Open Sentence",
    c1b: "no variable, value is true",
    c1bResult: "Closed Sentence (True)",
    c1c: "no variable, value is false (should be 7)",
    c1cResult: "Closed Sentence (False)",
    c1d: "has variable",
    c1dResult: "Open Sentence",
    c2Question: "Given the open sentence",
    c2QuestionEnd: ". Determine whether each of the following values is a solution:",
    c2Method: "Method: substitute each value into the open sentence and check if the result is true.",
    c2Test: "Test",
    c2TrueResult: "True! ✓",
    c2TrueEnd: "is a solution.",
    c2FalseResult: "False ✗",
    c2FalseEnd: "is not a solution.",
    c2Conclusion: "Conclusion: Solution Set (SS) =",
    c3Question: "Classify each of the following as: open sentence, true closed sentence, false closed sentence, or neither. If it is an open sentence, find one solution!",
    c3d: "Test from",
    c3Open: "Open Sentence",
    c3TrueClose: "True Closed Sentence ✓",
    c3Neither: "Neither open nor closed sentence",
    c3NoteLabel: 'c. "Do problem number 3!"',
    c3NoteResult: "It is a command, cannot be judged true/false →",
    c3Sol: "SS from the set",
  },
  ja: {
    title: "開いた文と閉じた文",
    subtitle: "中学1年 · 一元一次方程式と不等式 · 数学",
    back: "一元一次方程式・不等式に戻る",
    introTitle: "開いた文と閉じた文とは？",
    introBody: "数学では、すべての文がすぐに真か偽か判断できるわけではありません。不明な部分がある「宙ぶらりんな」文もあれば、すぐ判断できる文もあります。これが",
    introHighlight1: "開いた文",
    introAnd: "と",
    introHighlight2: "閉じた文",
    introEnd: "の違いです。",
    introBox: '「私は __ 匹の猫を飼っています。」というメモを見つけたとしましょう。数がわかるまで、多いか少ないかを判断できません。これが開いた文の概念です！',
    terbukaSectionTitle: "開いた文",
    terbukaDef: "定義：",
    terbukaDefBody: "は、",
    terbukaDefBody2: "変数（未知数）",
    terbukaDefBody3: "（例：",
    terbukaDefBody4: "などの記号）を含む数学的な文で、変数が特定の値に置き換えられるまで真偽が確定しないものです。",
    terbukaExampleLabel: "開いた文の例：",
    terbukaEx1: "の値がわかるまで真偽不明。",
    terbukaEx1b: "",
    terbukaEx2: "の値による。",
    terbukaEx3: "の値による。",
    terbukaEx4: "「今日は___曜日だ。」→ 何曜日かによる。",
    terbukaSolTitle: "開いた文の解：",
    terbukaSolBody: "開いた文は、変数を",
    terbukaSolHighlight1: "特定の値に置き換えて",
    terbukaSolBody2: "文が",
    terbukaSolHighlight2: "真（正しい）",
    terbukaSolBody3: "になるように解きます。開いた文を真にする値を",
    terbukaSolHighlight3: "解",
    terbukaSolOr: "または",
    terbukaSolHighlight4: "根",
    terbukaSolEnd: "といいます。",
    terbukaSubEx: "例：開いた文",
    terbukaTry1: "試す",
    terbukaTryResult1: "→",
    terbukaTryTrue: "真 ✓",
    terbukaTryFalse: "偽 ✗",
    terbukaTrySol: "→ よって",
    terbukaTrySolEnd: "が解。",
    terbukaHP: "開いた文を真にするすべての値の集合を",
    terbukaHPHighlight: "解集合",
    terbukaHPEnd: "といいます。",
    tertutupSectionTitle: "閉じた文（命題）",
    tertutupDef: "定義：",
    tertutupDefBody1: "（",
    tertutupDefBody2: "命題",
    tertutupDefBody3: "ともいう）は、",
    tertutupDefBody4: "変数を含まない",
    tertutupDefBody5: "数学的な文で、すぐに真偽を判断できるものです。",
    tertutupBenar: "真（正しい）",
    tertutupOr: "または",
    tertutupSalah: "偽（誤り）",
    tertutupEnd: "。",
    tertutupExLabel: "閉じた文（命題）の例：",
    tertutupClosed1: "「パリはフランスの首都である。」→",
    tertutupClosed2: "真 ✓",
    tertutupNote: "重要な注意：",
    tertutupNoteBody: "「ドアを閉めなさい！」のような命令文や「あなたは何歳ですか？」のような疑問文は、真偽を判断できないため、",
    tertutupNoteBold: "開いた文でも閉じた文でもありません。",
    tertutupNoteEnd: "",
    tipsSectionTitle: "開いた文・閉じた文の見分け方",
    tipsHeader: "🚀 数学の宇宙飛行士のヒント：",
    tipsStep1: "ステップ1：",
    tipsStep1Body: "文の中に変数（",
    tipsStep1BodyEnd: "など）があるか確認する。",
    tipsStep2: "ステップ2：",
    tipsStep2Body: "",
    tipsStep2Highlight: "変数がある",
    tipsStep2End: "→",
    tipsStep2Result: "開いた文",
    tipsStep3: "ステップ3：",
    tipsStep3Body: "",
    tipsStep3Highlight: "変数がなく",
    tipsStep3End: "真偽を判断できる →",
    tipsStep3Result: "閉じた文（命題）",
    tipsStep4: "ステップ4：",
    tipsStep4Body: "命令文や疑問文は →",
    tipsStep4Result: "どちらでもない",
    tipsStep4End: "。",
    tableTitle: "まとめ表：",
    tableColType: "種類",
    tableColChar: "特徴",
    tableColJudge: "真偽判断",
    tableRow1Type: "開いた文",
    tableRow1Char: "変数あり",
    tableRow1Judge: "できない",
    tableRow2Type: "閉じた文",
    tableRow2Char: "変数なし",
    tableRow2Judge: "できる（真/偽）",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    c1Question: "次の文のうち、開いた文と閉じた文（命題）を区別しなさい：",
    c1Check: "各文を確認：",
    c1a: "変数あり",
    c1aResult: "開いた文",
    c1b: "変数なし、値は真",
    c1bResult: "閉じた文（真）",
    c1c: "変数なし、値は偽（正しくは7）",
    c1cResult: "閉じた文（偽）",
    c1d: "変数あり",
    c1dResult: "開いた文",
    c2Question: "開いた文",
    c2QuestionEnd: "について、次の値が解かどうか判断しなさい：",
    c2Method: "方法：各値を開いた文に代入して真偽を確認する。",
    c2Test: "検証",
    c2TrueResult: "真！ ✓",
    c2TrueEnd: "は解。",
    c2FalseResult: "偽 ✗",
    c2FalseEnd: "は解ではない。",
    c2Conclusion: "結論：解集合 =",
    c3Question: "次の各文を「開いた文」「真の閉じた文」「偽の閉じた文」「どちらでもない」に分類しなさい。開いた文なら解を1つ求めなさい！",
    c3d: "の中から検証：",
    c3Open: "開いた文",
    c3TrueClose: "真の閉じた文 ✓",
    c3Neither: "開いた文でも閉じた文でもない",
    c3NoteLabel: 'c.「問題3を解きなさい！」',
    c3NoteResult: "命令文のため真偽判断不可 →",
    c3Sol: "集合",
  },
};

const KalimatTerbukaTertutupPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "terbuka", "tertutup", "tips", "contoh1", "contoh2", "contoh3"]);

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
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introBody} <strong className="text-primary">{t.introHighlight1}</strong> {t.introAnd} <strong className="text-primary">{t.introHighlight2}</strong>{t.introEnd}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.introBox}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Kalimat Terbuka */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("terbuka")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.terbukaSectionTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.terbukaDef}</p>
                  {language === "ja" ? (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong>開いた文</strong>{t.terbukaDefBody}{t.terbukaDefBody2}（<InlineMath math="x, y, n" />{t.terbukaDefBody3}{t.terbukaDefBody4}
                    </p>
                  ) : (
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong>{language === "en" ? "An open sentence" : "Kalimat terbuka"}</strong> {t.terbukaDefBody} <strong className="text-primary">{language === "en" ? "variable" : "variabel (peubah)"}</strong> {t.terbukaDefBody2} <InlineMath math="x, y, n" />{t.terbukaDefBody3}
                    </p>
                  )}
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.terbukaExampleLabel}
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <InlineMath math="x + 5 = 12" /> → {t.terbukaEx1} <InlineMath math="x" /> {t.terbukaEx1b}</p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="2y - 3 > 7" /> → {t.terbukaEx2} <InlineMath math="y" />.</p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="n^2 = 25" /> → {t.terbukaEx3} <InlineMath math="n" />.</p>
                  <p className="font-body text-sm text-white/80">• {t.terbukaEx4}</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.terbukaSolTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.terbukaSolBody} <strong>{t.terbukaSolHighlight1}</strong> {t.terbukaSolBody2} <strong className="text-green-300">{t.terbukaSolHighlight2}</strong>{t.terbukaSolBody3} <strong className="text-primary">{t.terbukaSolHighlight3}</strong> {t.terbukaSolOr} <strong className="text-primary">{t.terbukaSolHighlight4}</strong>{t.terbukaSolEnd}
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <p className="font-body text-sm text-white/80">
                      {t.terbukaSubEx} <InlineMath math="x + 5 = 12" />
                    </p>
                    <p className="font-body text-sm text-white/80">
                      {t.terbukaTry1} <InlineMath math="x = 7" />: <InlineMath math="7 + 5 = 12" /> {t.terbukaTryResult1} <strong className="text-green-400">{t.terbukaTryTrue}</strong> {t.terbukaTrySol} <InlineMath math="x = 7" /> {t.terbukaTrySolEnd}
                    </p>
                    <p className="font-body text-sm text-white/80">
                      {t.terbukaTry1} <InlineMath math="x = 3" />: <InlineMath math="3 + 5 = 8 \neq 12" /> {t.terbukaTryResult1} <strong className="text-red-400">{t.terbukaTryFalse}</strong>
                    </p>
                  </div>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.terbukaHP} <strong className="text-primary">{t.terbukaHPHighlight}</strong>{t.terbukaHPEnd}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Kalimat Tertutup */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tertutup")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">{t.tertutupSectionTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.tertutupDef}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>{language === "en" ? "A closed sentence" : language === "ja" ? "閉じた文" : "Kalimat tertutup"}</strong> {t.tertutupDefBody1} <strong className="text-primary">{t.tertutupDefBody2}</strong>{t.tertutupDefBody3} <strong>{t.tertutupDefBody4}</strong>{t.tertutupDefBody5} <strong className="text-green-400">{t.tertutupBenar}</strong> {t.tertutupOr} <strong className="text-red-400">{t.tertutupSalah}</strong>{t.tertutupEnd}
                  </p>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.tertutupExLabel}
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <InlineMath math="5 + 3 = 8" /> → <strong className="text-green-400">{language === "en" ? "True ✓" : language === "ja" ? "真 ✓" : "Benar ✓"}</strong></p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="10 - 4 = 7" /> → <strong className="text-red-400">{language === "en" ? "False ✗" : language === "ja" ? "偽 ✗" : "Salah ✗"}</strong> ({language === "en" ? "should be 6" : language === "ja" ? "正しくは6" : "harusnya 6"})</p>
                  <p className="font-body text-sm text-white/80">• {t.tertutupClosed1} <strong className="text-green-400">{t.tertutupClosed2}</strong></p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="2^3 = 6" /> → <strong className="text-red-400">{language === "en" ? "False ✗" : language === "ja" ? "偽 ✗" : "Salah ✗"}</strong> ({language === "en" ? "should be 8" : language === "ja" ? "正しくは8" : "harusnya 8"})</p>
                  <p className="font-body text-sm text-white/80">• <InlineMath math="15 > 9" /> → <strong className="text-green-400">{language === "en" ? "True ✓" : language === "ja" ? "真 ✓" : "Benar ✓"}</strong></p>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-orange-200 leading-relaxed">
                    <strong>{t.tertutupNote}</strong> {t.tertutupNoteBody} <strong>{t.tertutupNoteBold}</strong> {t.tertutupNoteEnd}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tips")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.tipsSectionTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">{t.tipsHeader}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>✅ <strong>{t.tipsStep1}</strong> {t.tipsStep1Body}<InlineMath math="x, y, n, a" />{t.tipsStep1BodyEnd}</p>
                    <p>✅ <strong>{t.tipsStep2}</strong> {t.tipsStep2Body} <strong className="text-blue-300">{t.tipsStep2Highlight}</strong> {t.tipsStep2End} <strong className="text-blue-300">{t.tipsStep2Result}</strong>.</p>
                    <p>✅ <strong>{t.tipsStep3}</strong> {t.tipsStep3Body}<strong className="text-purple-300">{t.tipsStep3Highlight}</strong> {t.tipsStep3End} <strong className="text-purple-300">{t.tipsStep3Result}</strong>.</p>
                    <p>✅ <strong>{t.tipsStep4}</strong> {t.tipsStep4Body} <strong className="text-red-300">{t.tipsStep4Result}</strong>{t.tipsStep4End}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.tableTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-4 text-primary">{t.tableColType}</th>
                          <th className="text-left py-2 pr-4 text-primary">{t.tableColChar}</th>
                          <th className="text-left py-2 text-primary">{t.tableColJudge}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-blue-300 font-semibold">{t.tableRow1Type}</td>
                          <td className="py-2 pr-4">{t.tableRow1Char}</td>
                          <td className="py-2 text-red-400">{t.tableRow1Judge}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 pr-4 text-purple-300 font-semibold">{t.tableRow2Type}</td>
                          <td className="py-2 pr-4">{t.tableRow2Char}</td>
                          <td className="py-2 text-green-400">{t.tableRow2Judge}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 1 - Mudah */}
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
                  <p className="font-body text-sm text-white">
                    {t.c1Question}
                  </p>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="7 + x = 15" /></p>
                    <p>b. <InlineMath math="3 \times 4 = 12" /></p>
                    <p>c. <InlineMath math="9 - 2 = 8" /></p>
                    <p>d. <InlineMath math="2n + 1 = 9" /></p>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>{t.c1Check}</strong></p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <p>a. <InlineMath math="7 + x = 15" /> → {t.c1a} <InlineMath math="x" /> → <strong className="text-blue-300">{t.c1aResult}</strong></p>
                      <p>b. <InlineMath math="3 \times 4 = 12" /> → {t.c1b} → <strong className="text-purple-300">{t.c1bResult}</strong></p>
                      <p>c. <InlineMath math="9 - 2 = 8" /> → {t.c1c} → <strong className="text-purple-300">{t.c1cResult}</strong></p>
                      <p>d. <InlineMath math="2n + 1 = 9" /> → {t.c1d} <InlineMath math="n" /> → <strong className="text-blue-300">{t.c1dResult}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 2 - Sedang */}
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
                    {t.c2Question} <InlineMath math="3x - 2 = 7" />{t.c2QuestionEnd}
                  </p>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="x = 3" /></p>
                    <p>b. <InlineMath math="x = 5" /></p>
                    <p>c. <InlineMath math="x = 4" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p>{t.c2Method}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3">
                      <div>
                        <p><strong>a. {t.c2Test} <InlineMath math="x = 3" />:</strong></p>
                        <p className="ml-4"><InlineMath math="3(3) - 2 = 9 - 2 = 7" /> → <strong className="text-green-400">{t.c2TrueResult}</strong> → <InlineMath math="x = 3" /> {t.c2TrueEnd}</p>
                      </div>
                      <div>
                        <p><strong>b. {t.c2Test} <InlineMath math="x = 5" />:</strong></p>
                        <p className="ml-4"><InlineMath math="3(5) - 2 = 15 - 2 = 13 \neq 7" /> → <strong className="text-red-400">{t.c2FalseResult}</strong> → <InlineMath math="x = 5" /> {t.c2FalseEnd}</p>
                      </div>
                      <div>
                        <p><strong>c. {t.c2Test} <InlineMath math="x = 4" />:</strong></p>
                        <p className="ml-4"><InlineMath math="3(4) - 2 = 12 - 2 = 10 \neq 7" /> → <strong className="text-red-400">{t.c2FalseResult}</strong> → <InlineMath math="x = 4" /> {t.c2FalseEnd}</p>
                      </div>
                    </div>
                    <p><strong>{t.c2Conclusion}</strong> <InlineMath math="\{3\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal 3 - Sulit */}
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
                  <p className="font-body text-sm text-white">
                    {t.c3Question}
                  </p>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="\frac{x+1}{2} = 4" /></p>
                    <p>b. <InlineMath math="5^2 + 12^2 = 13^2" /></p>
                    <p>c. {language === "en" ? '"Do problem number 3!"' : language === "ja" ? "「問題3を解きなさい！」" : '"Kerjakan soal nomor 3!"'}</p>
                    <p>d. <InlineMath math="n^2 - 4 = 0" /> {language === "en" ? "for" : language === "ja" ? "（" : "untuk"} <InlineMath math="n \in \{1, 2, 3\}" />{language === "ja" ? "）" : ""}</p>
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                  <div className="space-y-4 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-3">
                      <div>
                        <p><strong>a. <InlineMath math="\frac{x+1}{2} = 4" /></strong> → {t.c1a} <InlineMath math="x" /> → <strong className="text-blue-300">{t.c3Open}</strong></p>
                        <p className="ml-4">{language === "en" ? "Find solution:" : language === "ja" ? "解を求める：" : "Cari penyelesaian:"} <InlineMath math="x + 1 = 8" />, {language === "en" ? "so" : language === "ja" ? "よって" : "maka"} <InlineMath math="x = 7" />. {language === "en" ? "Check:" : language === "ja" ? "確認：" : "Cek:"} <InlineMath math="\frac{7+1}{2} = \frac{8}{2} = 4" /> ✓</p>
                        <p className="ml-4">{language === "en" ? "SS" : language === "ja" ? "解集合" : "HP"} = <InlineMath math="\{7\}" /></p>
                      </div>
                      <div>
                        <p><strong>b. <InlineMath math="5^2 + 12^2 = 13^2" /></strong> → {language === "en" ? "No variable." : language === "ja" ? "変数なし。" : "Tidak ada variabel."}</p>
                        <p className="ml-4">{language === "en" ? "Check:" : language === "ja" ? "確認：" : "Cek:"} <InlineMath math="25 + 144 = 169" /> {language === "en" ? "and" : language === "ja" ? "かつ" : "dan"} <InlineMath math="13^2 = 169" /> → <strong className="text-purple-300">{t.c3TrueClose}</strong> ({language === "en" ? "Pythagorean triple!" : language === "ja" ? "ピタゴラス数！" : "ini adalah Triple Pythagoras!"})</p>
                      </div>
                      <div>
                        <p><strong>{t.c3NoteLabel}</strong> → {t.c3NoteResult} <strong className="text-orange-300">{t.c3Neither}</strong></p>
                      </div>
                      <div>
                        <p><strong>d. <InlineMath math="n^2 - 4 = 0" /></strong> → {t.c1d} <InlineMath math="n" /> → <strong className="text-blue-300">{t.c3Open}</strong></p>
                        <p className="ml-4">{t.c3d} <InlineMath math="\{1, 2, 3\}" />:</p>
                        <p className="ml-4">• <InlineMath math="n=1" />: <InlineMath math="1-4 = -3 \neq 0" /> ✗</p>
                        <p className="ml-4">• <InlineMath math="n=2" />: <InlineMath math="4-4 = 0" /> ✓ → <InlineMath math="n=2" /> {language === "en" ? "is a solution" : language === "ja" ? "は解" : "adalah penyelesaian"}</p>
                        <p className="ml-4">• <InlineMath math="n=3" />: <InlineMath math="9-4 = 5 \neq 0" /> ✗</p>
                        <p className="ml-4">{t.c3Sol} <InlineMath math="\{1,2,3\}" /> → {language === "en" ? "SS" : language === "ja" ? "解集合" : "HP"} = <InlineMath math="\{2\}" /></p>
                      </div>
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

export default KalimatTerbukaTertutupPage;
