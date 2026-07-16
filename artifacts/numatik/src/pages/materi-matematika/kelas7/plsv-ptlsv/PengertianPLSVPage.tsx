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
    title: "PENGERTIAN PLSV, KESAMAAN & PERSAMAAN EKUIVALEN",
    subtitle: "Kelas 7 · PLSV & PtLSV · Materi Matematika",
    back: "Kembali ke PLSV & PtLSV",
    introTitle: 'Membongkar Rahasia di Balik Tanda "="',
    introBody: 'Pernahkah kamu berpikir: "Berapakah nilai',
    introBody2: 'sehingga',
    introBody3: '?" Inilah inti dari',
    introHighlight: "Persamaan Linear Satu Variabel (PLSV)",
    introEnd: ". Kita akan belajar mengenali, memahami, dan membedakan beberapa konsep penting seputar PLSV.",
    introBox: "Bayangkan persamaan seperti timbangan yang seimbang — sisi kiri dan sisi kanan harus selalu bernilai sama. Tugas kita adalah menemukan nilai yang menjaga keseimbangan itu!",
    plsvTitle: "Persamaan Linear Satu Variabel (PLSV)",
    plsvDefLabel: "Definisi PLSV:",
    plsvDef: "adalah kalimat terbuka yang:",
    plsvBullet1: "Mengandung",
    plsvBullet1h: "tepat satu variabel",
    plsvBullet1e: "(satu jenis peubah)",
    plsvBullet2: "Pangkat tertinggi variabelnya adalah",
    plsvBullet2h: "1 (linear)",
    plsvBullet3: "Dihubungkan dengan tanda",
    plsvBullet3h: "sama dengan (=)",
    plsvGeneralLabel: "Bentuk umum PLSV:",
    plsvGeneralNote: "dengan",
    plsvGeneralNote2: ", dan",
    plsvGeneralNote3: "adalah konstanta bilangan real",
    plsvExLabel: "Contoh PLSV vs Bukan PLSV:",
    plsvEx1: "PLSV (variabel",
    plsvEx1e: ", pangkat 1)",
    plsvEx2: "PLSV (variabel",
    plsvEx2e: ", pangkat 1)",
    plsvEx3: "Bukan PLSV (pangkat variabel = 2)",
    plsvEx4: "Bukan PLSV (dua variabel)",
    plsvEx5: "Bukan PLSV (tidak ada variabel)",
    akarTitle: "Akar atau Penyelesaian PLSV",
    akarDef: "(atau",
    akarDef2: "penyelesaian",
    akarDef3: ") adalah nilai variabel yang membuat persamaan menjadi",
    akarDef4: "kalimat yang benar",
    akarDef5: ".",
    akarExLabel: "Contoh: Untuk",
    akarTry1: "Coba",
    akarTryTrue: "→ x = 3 adalah akar/penyelesaiannya",
    akarTryFalse: "→ bukan penyelesaian",
    akarHP: "Himpunan Penyelesaian:",
    kesamaanTitle: "Kesamaan",
    kesamaanDef: "adalah kalimat matematika yang dihubungkan dengan tanda \"=\" yang",
    kesamaanDef2: "selalu benar",
    kesamaanDef3: "untuk semua nilai variabel, atau merupakan pernyataan yang sudah pasti benar tanpa perlu menyelesaikannya.",
    kesamaanPropLabel: "Sifat-sifat kesamaan (yang berlaku pada PLSV):",
    kesamaanP1: "Refleksif:",
    kesamaanP1b: "(setiap bilangan sama dengan dirinya sendiri)",
    kesamaanP2: "Simetri:",
    kesamaanP2b: "Jika",
    kesamaanP2c: ", maka",
    kesamaanP3: "Transitif:",
    kesamaanP3b: "Jika",
    kesamaanP3c: "dan",
    kesamaanP3d: ", maka",
    kesamaanP4: "Substitusi:",
    kesamaanP4b: "Jika",
    kesamaanP4c: ", maka",
    kesamaanP4d: "bisa diganti",
    kesamaanP4e: "dalam persamaan apapun.",
    kesamaanOpLabel: "Operasi pada kesamaan:",
    kesamaanOpBody: "Jika kedua ruas ditambah, dikurang, dikali, atau dibagi dengan bilangan yang sama (kecuali dibagi nol), maka kesamaan tetap berlaku.",
    ekuivalenTitle: "Persamaan yang Ekuivalen",
    ekuivalenDef: "Dua persamaan dikatakan",
    ekuivalenDef2: "ekuivalen",
    ekuivalenDef3: "(setara) jika keduanya memiliki",
    ekuivalenDef4: "himpunan penyelesaian yang sama persis",
    ekuivalenDef5: ". Ditulis dengan simbol",
    ekuivalenExLabel: "Contoh persamaan-persamaan yang ekuivalen:",
    ekuivalenNote: "Ketiga persamaan di atas",
    ekuivalenNote2: "ekuivalen",
    ekuivalenNote3: "karena memiliki HP yang sama!",
    ekuivalenHowLabel: "Cara menghasilkan persamaan ekuivalen:",
    ekuivalenHowBody: "Tambahkan/kurangi/kalikan/bagikan kedua ruas dengan bilangan yang sama (bukan nol). Ini adalah dasar dari semua metode penyelesaian PLSV!",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "Contoh Soal", solution: "PEMBAHASAN:",
    c1Q: "Dari persamaan-persamaan berikut, tentukan mana yang merupakan PLSV dan mana yang bukan!",
    c1aNote: "satu variabel", c1aNote2: ", pangkat 1",
    c1Yes: "PLSV ✓", c1No: "Bukan PLSV ✗",
    c1bNote: "pangkat variabel = 2",
    c1cNote: "satu variabel", c1cNote2: ", pangkat 1 (setelah didistribusikan jadi",
    c1dNote: "dua variabel berbeda",
    c2Q: "Tentukan apakah dua persamaan berikut merupakan pasangan persamaan yang ekuivalen, dan jelaskan alasannya!",
    c2P1: "Persamaan I:", c2P2: "Persamaan II:",
    step: "Langkah",
    c2Step1: "Cari HP Persamaan I:",
    c2Step2: "HP Persamaan II:",
    c2Conc: "Kesimpulan: HP I = HP II =",
    c2ConcEnd: ", maka kedua persamaan",
    c2ConcEnd2: "ekuivalen",
    c3Q: "Diketahui persamaan",
    c3QEnd: ". Tunjukkan bahwa persamaan ini ekuivalen dengan",
    c3QEnd2: "dengan menggunakan sifat-sifat kesamaan!",
    c3Step1: "Distribusikan (urai kurung):",
    c3Step2: "Kurangi kedua ruas dengan",
    c3Step2b: "(sifat kesamaan):",
    c3Step3: "Tambahkan",
    c3Step3b: "ke kedua ruas:",
    c3Step4: "Bagikan kedua ruas dengan",
    c3Verify: "Verifikasi:",
    c3Sub: "Substitusi",
    c3SubEnd: "ke persamaan asal:",
    c3LS: "Ruas kiri:",
    c3RS: "Ruas kanan:",
    c3Proven: "→ Terbukti ekuivalen!",
  },
  en: {
    title: "LINEAR EQUATION IN ONE VARIABLE, EQUALITY & EQUIVALENT EQUATIONS",
    subtitle: "Grade 7 · PLSV & PtLSV · Mathematics",
    back: "Back to PLSV & PtLSV",
    introTitle: 'Unlocking the Secret Behind the "=" Sign',
    introBody: 'Have you ever wondered: "What is the value of',
    introBody2: "such that",
    introBody3: '?" This is the core idea of a',
    introHighlight: "Linear Equation in One Variable (LEOV)",
    introEnd: ". We will learn to recognize, understand, and distinguish key concepts around LEOV.",
    introBox: "Think of an equation like a balanced scale — the left side and right side must always be equal. Our job is to find the value that keeps the balance!",
    plsvTitle: "Linear Equation in One Variable (LEOV)",
    plsvDefLabel: "Definition of LEOV:",
    plsvDef: "is an open sentence that:",
    plsvBullet1: "Contains",
    plsvBullet1h: "exactly one variable",
    plsvBullet1e: "(one type of unknown)",
    plsvBullet2: "The highest power of the variable is",
    plsvBullet2h: "1 (linear)",
    plsvBullet3: "Connected by an",
    plsvBullet3h: "equals sign (=)",
    plsvGeneralLabel: "General form of LEOV:",
    plsvGeneralNote: "where",
    plsvGeneralNote2: ", and",
    plsvGeneralNote3: "are real constants",
    plsvExLabel: "Examples: LEOV vs Not LEOV:",
    plsvEx1: "LEOV (variable",
    plsvEx1e: ", power 1)",
    plsvEx2: "LEOV (variable",
    plsvEx2e: ", power 1)",
    plsvEx3: "Not LEOV (variable power = 2)",
    plsvEx4: "Not LEOV (two variables)",
    plsvEx5: "Not LEOV (no variable)",
    akarTitle: "Root / Solution of LEOV",
    akarDef: "(or",
    akarDef2: "solution",
    akarDef3: ") is the value of the variable that makes the equation a",
    akarDef4: "true sentence",
    akarDef5: ".",
    akarExLabel: "Example: For",
    akarTry1: "Try",
    akarTryTrue: "→ x = 3 is the root/solution",
    akarTryFalse: "→ not a solution",
    akarHP: "Solution Set:",
    kesamaanTitle: "Equality",
    kesamaanDef: "is a mathematical statement connected by \"=\" that is",
    kesamaanDef2: "always true",
    kesamaanDef3: "for all values of the variable, or a statement that is definitely true without needing to be solved.",
    kesamaanPropLabel: "Properties of equality (used in LEOV):",
    kesamaanP1: "Reflexive:",
    kesamaanP1b: "(every number equals itself)",
    kesamaanP2: "Symmetric:",
    kesamaanP2b: "If",
    kesamaanP2c: ", then",
    kesamaanP3: "Transitive:",
    kesamaanP3b: "If",
    kesamaanP3c: "and",
    kesamaanP3d: ", then",
    kesamaanP4: "Substitution:",
    kesamaanP4b: "If",
    kesamaanP4c: ", then",
    kesamaanP4d: "can be replaced by",
    kesamaanP4e: "in any equation.",
    kesamaanOpLabel: "Operations on equality:",
    kesamaanOpBody: "If both sides are added to, subtracted from, multiplied, or divided by the same number (except division by zero), the equality still holds.",
    ekuivalenTitle: "Equivalent Equations",
    ekuivalenDef: "Two equations are called",
    ekuivalenDef2: "equivalent",
    ekuivalenDef3: "if they have exactly the",
    ekuivalenDef4: "same solution set",
    ekuivalenDef5: ". Written with the symbol",
    ekuivalenExLabel: "Example of equivalent equations:",
    ekuivalenNote: "All three equations above are",
    ekuivalenNote2: "equivalent",
    ekuivalenNote3: "because they share the same solution set!",
    ekuivalenHowLabel: "How to produce equivalent equations:",
    ekuivalenHowBody: "Add/subtract/multiply/divide both sides by the same number (not zero). This is the foundation of all LEOV solution methods!",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "Example", solution: "SOLUTION:",
    c1Q: "From the following equations, determine which are LEOVs and which are not!",
    c1aNote: "one variable", c1aNote2: ", power 1",
    c1Yes: "LEOV ✓", c1No: "Not LEOV ✗",
    c1bNote: "variable power = 2",
    c1cNote: "one variable", c1cNote2: ", power 1 (after distributing it becomes",
    c1dNote: "two different variables",
    c2Q: "Determine whether the following two equations are an equivalent pair, and explain why!",
    c2P1: "Equation I:", c2P2: "Equation II:",
    step: "Step",
    c2Step1: "Find SS of Equation I:",
    c2Step2: "SS of Equation II:",
    c2Conc: "Conclusion: SS I = SS II =",
    c2ConcEnd: ", so both equations are",
    c2ConcEnd2: "equivalent",
    c3Q: "Given the equation",
    c3QEnd: ". Show that this equation is equivalent to",
    c3QEnd2: "using the properties of equality!",
    c3Step1: "Distribute (expand brackets):",
    c3Step2: "Subtract",
    c3Step2b: "from both sides (equality property):",
    c3Step3: "Add",
    c3Step3b: "to both sides:",
    c3Step4: "Divide both sides by",
    c3Verify: "Verification:",
    c3Sub: "Substitute",
    c3SubEnd: "into the original equation:",
    c3LS: "Left side:",
    c3RS: "Right side:",
    c3Proven: "→ Equivalence proven!",
  },
  ja: {
    title: "一元一次方程式・等式・同値方程式",
    subtitle: "中学1年 · 一元一次方程式と不等式 · 数学",
    back: "一元一次方程式・不等式に戻る",
    introTitle: '「＝」記号の秘密を解き明かす',
    introBody: '「',
    introBody2: "がいくつのとき",
    introBody3: 'になるか？」と考えたことはありませんか？これが',
    introHighlight: "一元一次方程式",
    introEnd: "の核心です。一元一次方程式に関する重要な概念を学びましょう。",
    introBox: "方程式を天秤のようにイメージしましょう — 左辺と右辺は常に等しくなければなりません。そのバランスを保つ値を見つけるのが私たちの仕事です！",
    plsvTitle: "一元一次方程式",
    plsvDefLabel: "一元一次方程式の定義：",
    plsvDef: "は次の条件を満たす開いた文です：",
    plsvBullet1: "",
    plsvBullet1h: "変数がちょうど1種類",
    plsvBullet1e: "含まれる",
    plsvBullet2: "変数の最高次数が",
    plsvBullet2h: "1（一次）",
    plsvBullet3: "等号",
    plsvBullet3h: "（＝）で結ばれている",
    plsvGeneralLabel: "一元一次方程式の一般形：",
    plsvGeneralNote: "ただし",
    plsvGeneralNote2: "，",
    plsvGeneralNote3: "は実数の定数",
    plsvExLabel: "一元一次方程式の例（○）と非例（✗）：",
    plsvEx1: "一元一次方程式（変数",
    plsvEx1e: "，次数1）",
    plsvEx2: "一元一次方程式（変数",
    plsvEx2e: "，次数1）",
    plsvEx3: "一元一次方程式でない（次数＝2）",
    plsvEx4: "一元一次方程式でない（変数が2つ）",
    plsvEx5: "一元一次方程式でない（変数なし）",
    akarTitle: "方程式の解（根）",
    akarDef: "（または",
    akarDef2: "根",
    akarDef3: "）とは，方程式を",
    akarDef4: "真（正しい文）",
    akarDef5: "にする変数の値のことです。",
    akarExLabel: "例：",
    akarTry1: "試す",
    akarTryTrue: "→ x = 3 が解",
    akarTryFalse: "→ 解ではない",
    akarHP: "解集合：",
    kesamaanTitle: "等式",
    kesamaanDef: "は「＝」で結ばれた数学的な文で，変数のすべての値に対して",
    kesamaanDef2: "常に真",
    kesamaanDef3: "であるか，解かずとも明らかに真である命題です。",
    kesamaanPropLabel: "等式の性質（一元一次方程式で使う）：",
    kesamaanP1: "反射律：",
    kesamaanP1b: "（すべての数は自分自身と等しい）",
    kesamaanP2: "対称律：",
    kesamaanP2b: "ならば",
    kesamaanP2c: "",
    kesamaanP3: "推移律：",
    kesamaanP3b: "かつ",
    kesamaanP3c: "ならば",
    kesamaanP3d: "",
    kesamaanP4: "代入：",
    kesamaanP4b: "ならば，",
    kesamaanP4c: "を",
    kesamaanP4d: "に置き換えられる",
    kesamaanP4e: "（どんな方程式でも）。",
    kesamaanOpLabel: "等式への演算：",
    kesamaanOpBody: "両辺に同じ数を加えても，引いても，掛けても，ゼロ以外で割っても，等式は成り立ちます。",
    ekuivalenTitle: "同値方程式",
    ekuivalenDef: "2つの方程式が",
    ekuivalenDef2: "同値",
    ekuivalenDef3: "であるとは，両者の",
    ekuivalenDef4: "解集合がまったく同じ",
    ekuivalenDef5: "であることをいいます。記号",
    ekuivalenExLabel: "同値方程式の例：",
    ekuivalenNote: "3つの方程式は解集合が同じなので",
    ekuivalenNote2: "同値",
    ekuivalenNote3: "です！",
    ekuivalenHowLabel: "同値方程式を作る方法：",
    ekuivalenHowBody: "両辺に同じ数（ゼロ以外）を加減乗除する。これがすべての一元一次方程式の解法の基礎です！",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題", solution: "解説：",
    c1Q: "次の方程式のうち，一元一次方程式はどれか答えなさい。",
    c1aNote: "変数1つ", c1aNote2: "，次数1",
    c1Yes: "一元一次方程式 ✓", c1No: "一元一次方程式でない ✗",
    c1bNote: "変数の次数＝2",
    c1cNote: "変数1つ", c1cNote2: "，次数1（展開すると",
    c1dNote: "変数が2種類",
    c2Q: "次の2つの方程式が同値かどうか判断し，理由を説明しなさい。",
    c2P1: "方程式 I：", c2P2: "方程式 II：",
    step: "ステップ",
    c2Step1: "方程式 I の解集合を求める：",
    c2Step2: "方程式 II の解集合：",
    c2Conc: "結論：解集合 I = 解集合 II =",
    c2ConcEnd: "，よって2つの方程式は",
    c2ConcEnd2: "同値",
    c3Q: "方程式",
    c3QEnd: "が",
    c3QEnd2: "と同値であることを等式の性質を使って示しなさい。",
    c3Step1: "展開する：",
    c3Step2: "両辺から",
    c3Step2b: "を引く（等式の性質）：",
    c3Step3: "両辺に",
    c3Step3b: "を加える：",
    c3Step4: "両辺を",
    c3Verify: "確認：",
    c3Sub: "",
    c3SubEnd: "を元の方程式に代入：",
    c3LS: "左辺：",
    c3RS: "右辺：",
    c3Proven: "→ 同値であることが示された！",
  },
};

const PengertianPLSVPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "plsv", "akar", "kesamaan", "ekuivalen", "contoh1", "contoh2", "contoh3"]);

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
                  {t.introBody} <InlineMath math="x" /> {t.introBody2} <InlineMath math="2x + 3 = 11" />{t.introBody3} <strong className="text-primary">{t.introHighlight}</strong>{t.introEnd}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.introBox}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pengertian PLSV */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("plsv")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.plsvTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.plsvDefLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>{language === "en" ? "A Linear Equation in One Variable (LEOV)" : language === "ja" ? "一元一次方程式" : "Persamaan Linear Satu Variabel (PLSV)"}</strong> {t.plsvDef}
                  </p>
                  <ul className="mt-2 space-y-1 font-body text-sm text-white/80 list-none">
                    <li>• {t.plsvBullet1} <strong className="text-blue-300">{t.plsvBullet1h}</strong> {t.plsvBullet1e}</li>
                    <li>• {t.plsvBullet2} <strong className="text-blue-300">{t.plsvBullet2h}</strong></li>
                    <li>• {t.plsvBullet3} <strong className="text-blue-300">{t.plsvBullet3h}</strong></li>
                  </ul>
                </div>

                <p className="font-body text-sm text-white/80">{t.plsvGeneralLabel}</p>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <BlockMath math="ax + b = c" />
                  <p className="font-body text-xs text-white/60 mt-2">{t.plsvGeneralNote} <InlineMath math="a \neq 0" />{t.plsvGeneralNote2} <InlineMath math="a, b, c" /> {t.plsvGeneralNote3}</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.plsvExLabel}</p>
                  <div className="space-y-2 font-body text-sm">
                    <p className="text-green-300">✓ <InlineMath math="2x + 5 = 11" /> → {t.plsvEx1} <InlineMath math="x" />{t.plsvEx1e}</p>
                    <p className="text-green-300">✓ <InlineMath math="3y - 7 = 2" /> → {t.plsvEx2} <InlineMath math="y" />{t.plsvEx2e}</p>
                    <p className="text-red-400">✗ <InlineMath math="x^2 + 3 = 7" /> → {t.plsvEx3}</p>
                    <p className="text-red-400">✗ <InlineMath math="2x + 3y = 10" /> → {t.plsvEx4}</p>
                    <p className="text-red-400">✗ <InlineMath math="5 + 3 = 8" /> → {t.plsvEx5}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Akar / Penyelesaian */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("akar")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.akarTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">{language === "en" ? "The root" : language === "ja" ? "解" : "Akar persamaan"}</strong> {t.akarDef} <strong className="text-green-300">{t.akarDef2}</strong>{t.akarDef3} <strong>{t.akarDef4}</strong>{t.akarDef5}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.akarExLabel} <InlineMath math="2x + 1 = 7" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>• {t.akarTry1} <InlineMath math="x = 3" />: <InlineMath math="2(3)+1 = 7" /> ✓ → <strong className="text-green-400">{t.akarTryTrue}</strong></p>
                    <p>• {t.akarTry1} <InlineMath math="x = 2" />: <InlineMath math="2(2)+1 = 5 \neq 7" /> ✗ → {t.akarTryFalse}</p>
                  </div>
                  <p className="font-body text-sm text-white/80">
                    {t.akarHP} <InlineMath math="HP = \{3\}" />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Kesamaan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kesamaan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{t.kesamaanTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-orange-300">{language === "en" ? "Equality" : language === "ja" ? "等式" : "Kesamaan"}</strong> {t.kesamaanDef} <strong>{t.kesamaanDef2}</strong> {t.kesamaanDef3}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white">{t.kesamaanPropLabel}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    {language === "ja" ? (
                      <>
                        <p>• <strong className="text-orange-300">{t.kesamaanP1}</strong> <InlineMath math="a = a" /> {t.kesamaanP1b}</p>
                        <p>• <strong className="text-orange-300">{t.kesamaanP2}</strong> <InlineMath math="a = b" /> {t.kesamaanP2b} <InlineMath math="b = a" /></p>
                        <p>• <strong className="text-orange-300">{t.kesamaanP3}</strong> <InlineMath math="a = b" /> {t.kesamaanP3b} <InlineMath math="b = c" /> {t.kesamaanP3c} <InlineMath math="a = c" /></p>
                        <p>• <strong className="text-orange-300">{t.kesamaanP4}</strong> <InlineMath math="a = b" /> {t.kesamaanP4b} <InlineMath math="a" /> {t.kesamaanP4c} <InlineMath math="b" /> {t.kesamaanP4d}{t.kesamaanP4e}</p>
                      </>
                    ) : (
                      <>
                        <p>• <strong className="text-orange-300">{t.kesamaanP1}</strong> <InlineMath math="a = a" /> {t.kesamaanP1b}</p>
                        <p>• <strong className="text-orange-300">{t.kesamaanP2}</strong> {t.kesamaanP2b} <InlineMath math="a = b" />{t.kesamaanP2c} <InlineMath math="b = a" /></p>
                        <p>• <strong className="text-orange-300">{t.kesamaanP3}</strong> {t.kesamaanP3b} <InlineMath math="a = b" /> {t.kesamaanP3c} <InlineMath math="b = c" />{t.kesamaanP3d} <InlineMath math="a = c" /></p>
                        <p>• <strong className="text-orange-300">{t.kesamaanP4}</strong> {t.kesamaanP4b} <InlineMath math="a = b" />{t.kesamaanP4c} <InlineMath math="a" /> {t.kesamaanP4d} <InlineMath math="b" /> {t.kesamaanP4e}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-orange-200">
                    <strong>{t.kesamaanOpLabel}</strong> {t.kesamaanOpBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Persamaan Ekuivalen */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("ekuivalen")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">{t.ekuivalenTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.ekuivalenDef} <strong className="text-purple-300">{t.ekuivalenDef2}</strong> {t.ekuivalenDef3} <strong>{t.ekuivalenDef4}</strong>{t.ekuivalenDef5} <InlineMath math="\Leftrightarrow" />.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.ekuivalenExLabel}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p><InlineMath math="x + 3 = 7" /> → {language === "en" ? "SS" : language === "ja" ? "解集合" : "HP"} = <InlineMath math="\{4\}" /></p>
                    <p><InlineMath math="2x + 6 = 14" /> → {language === "en" ? "SS" : language === "ja" ? "解集合" : "HP"} = <InlineMath math="\{4\}" /></p>
                    <p><InlineMath math="x - 1 = 3" /> → {language === "en" ? "SS" : language === "ja" ? "解集合" : "HP"} = <InlineMath math="\{4\}" /></p>
                    <p className="text-purple-300">{t.ekuivalenNote} <strong>{t.ekuivalenNote2}</strong> {t.ekuivalenNote3}</p>
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-purple-200 leading-relaxed">
                    <strong>{t.ekuivalenHowLabel}</strong> {t.ekuivalenHowBody}
                  </p>
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
                  <p className="font-body text-sm text-white">{t.c1Q}</p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="4x - 8 = 0" /></p>
                    <p>b. <InlineMath math="x^2 - 9 = 0" /></p>
                    <p>c. <InlineMath math="3(y + 2) = 15" /></p>
                    <p>d. <InlineMath math="2a + 3b = 12" /></p>
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>a. <InlineMath math="4x - 8 = 0" /> → {t.c1aNote} <InlineMath math="x" />{t.c1aNote2} → <strong className="text-green-300">{t.c1Yes}</strong></p>
                    <p>b. <InlineMath math="x^2 - 9 = 0" /> → {t.c1bNote} → <strong className="text-red-400">{t.c1No}</strong></p>
                    <p>c. <InlineMath math="3(y + 2) = 15" /> → {t.c1cNote} <InlineMath math="y" />{t.c1cNote2} <InlineMath math="3y+6=15" />) → <strong className="text-green-300">{t.c1Yes}</strong></p>
                    <p>d. <InlineMath math="2a + 3b = 12" /> → {t.c1dNote} → <strong className="text-red-400">{t.c1No}</strong></p>
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
                  <p className="font-body text-sm text-white">{t.c2Q}</p>
                  <div className="mt-2 font-body text-sm text-white/80 space-y-1">
                    <p>{t.c2P1} <InlineMath math="5x - 10 = 0" /></p>
                    <p>{t.c2P2} <InlineMath math="x = 2" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1:</strong> {t.c2Step1}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="5x - 10 = 0" /></p>
                      <p><InlineMath math="5x = 10" /></p>
                      <p><InlineMath math="x = 2" /> → {language === "en" ? "SS I" : language === "ja" ? "解集合 I" : "HP I"} = <InlineMath math="\{2\}" /></p>
                    </div>
                    <p><strong>{t.step} 2:</strong> {t.c2Step2}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p><InlineMath math="x = 2" /> → {language === "en" ? "SS II" : language === "ja" ? "解集合 II" : "HP II"} = <InlineMath math="\{2\}" /></p>
                    </div>
                    <p><strong>{language === "en" ? "Conclusion" : language === "ja" ? "結論" : "Kesimpulan"}:</strong> {t.c2Conc} <InlineMath math="\{2\}" />{t.c2ConcEnd} <strong className="text-purple-300">{t.c2ConcEnd2}</strong>. <InlineMath math="5x - 10 = 0 \Leftrightarrow x = 2" /></p>
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
                    {t.c3Q} <InlineMath math="3(2x - 4) + 6 = 2(x + 5)" />{t.c3QEnd} <InlineMath math="x = 4" /> {t.c3QEnd2}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      <p><strong>{t.step} 1:</strong> {t.c3Step1}</p>
                      <BlockMath math="6x - 12 + 6 = 2x + 10" />
                      <BlockMath math="6x - 6 = 2x + 10" />
                      <p><strong>{t.step} 2:</strong> {t.c3Step2} <InlineMath math="2x" /> {t.c3Step2b}</p>
                      <BlockMath math="4x - 6 = 10" />
                      <p><strong>{t.step} 3:</strong> {t.c3Step3} <InlineMath math="6" /> {t.c3Step3b}</p>
                      <BlockMath math="4x = 16" />
                      <p><strong>{t.step} 4:</strong> {t.c3Step4} <InlineMath math="4" />{language === "ja" ? "で割る：" : ":"}</p>
                      <BlockMath math="x = 4" />
                    </div>
                    <p><strong>{t.c3Verify}</strong> {t.c3Sub} <InlineMath math="x = 4" /> {t.c3SubEnd}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>{t.c3LS} <InlineMath math="3(2(4)-4)+6 = 3(8-4)+6 = 3(4)+6 = 12+6 = 18" /></p>
                      <p>{t.c3RS} <InlineMath math="2(4+5) = 2(9) = 18" /></p>
                      <p className="text-green-400">18 = 18 ✓ {t.c3Proven}</p>
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

export default PengertianPLSVPage;
