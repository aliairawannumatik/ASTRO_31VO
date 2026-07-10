import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import BalanceScaleAnimation from "@/components/BalanceScaleAnimation";

const translations = {
  id: {
    title: "PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL",
    subtitle: "Kelas 7 · PLSV & PtLSV · Materi Matematika",
    back: "Kembali ke PLSV & PtLSV",
    introTitle: "Lima Metode Menyelesaikan PLSV",
    introBody: "Ada beberapa cara untuk menemukan nilai variabel dalam PLSV. Setiap metode punya keunggulannya masing-masing. Kita akan pelajari semuanya!",
    methods: ["1. Metode Substitusi (coba-coba)", "2. Menambah/Mengurang kedua ruas", "3. Mengali/Membagi kedua ruas", "4. Metode Pindah Ruas", "5. Persamaan Bentuk Pecahan"],
    s1Title: "1. Metode Substitusi",
    s1Def: "dilakukan dengan cara",
    s1DefH: "mencoba-coba nilai satu per satu",
    s1DefEnd: "untuk variabel sampai mendapatkan kalimat yang benar. Metode ini paling sederhana, cocok untuk bilangan-bilangan kecil.",
    s1ExLabel: "Contoh: Selesaikan",
    s1Try: "Coba",
    s1HP: "HP =",
    s1Note: "Catatan:",
    s1NoteBody: "Metode substitusi kurang efisien untuk bilangan besar atau pecahan. Gunakan metode lain untuk kasus tersebut.",
    s2Title: "2. Menambah / Mengurang Kedua Ruas",
    s2Principle: "Prinsip:",
    s2PrincipleH: "Jika kedua ruas persamaan ditambah atau dikurang dengan bilangan yang sama, persamaan tetap ekuivalen.",
    s2P1: "Jika", s2P1m: ", maka",
    s2ExLabel1: "Contoh: Selesaikan",
    s2Add: "Tambahkan",
    s2AddEnd: "ke kedua ruas:",
    s2ExLabel2: "Contoh lain: Selesaikan",
    s2Sub: "Kurangi",
    s2SubEnd: "dari kedua ruas:",
    s3Title: "3. Mengali / Membagi Kedua Ruas",
    s3Principle: "Prinsip:",
    s3PrincipleH: "Jika kedua ruas dikalikan atau dibagi dengan bilangan yang sama (bukan nol), persamaan tetap ekuivalen.",
    s3P1: "Jika", s3P1m: ", maka",
    s3ExDiv: "Contoh (pembagian): Selesaikan",
    s3Div: "Bagi kedua ruas dengan",
    s3ExMul: "Contoh (perkalian): Selesaikan",
    s3Mul: "Kalikan kedua ruas dengan",
    s4Title: "4. Metode Pindah Ruas",
    s4DefH: "Pindah ruas",
    s4Def: "adalah cara cepat yang memanfaatkan sifat kesamaan. Intinya:",
    s4B1: "Suku yang",
    s4B1h: "berpindah ruas",
    s4B1e: "akan",
    s4B1h2: "berganti tanda",
    s4B1end: "(+ menjadi −, atau − menjadi +)",
    s4B2: "Faktor yang berpindah akan menjadi pembagi (× menjadi ÷)",
    s4ExLabel: "Contoh: Selesaikan",
    s4Move1: "Pindahkan",
    s4Move1end: "ke ruas kanan (menjadi",
    s4Move2: "Pindahkan faktor",
    s4Move2end: "ke ruas kanan (menjadi pembagi):",
    s4Tip: "Tips:",
    s4TipBody: "Metode pindah ruas adalah metode yang paling sering digunakan karena lebih cepat. Kumpulkan suku-suku dengan variabel di satu ruas, dan konstanta di ruas lainnya!",
    s5Title: "5. Persamaan Bentuk Pecahan",
    s5Def: "Jika PLSV memuat pecahan, langkah pertama adalah",
    s5DefH: "menghilangkan penyebut",
    s5DefMid: "dengan cara",
    s5DefH2: "mengalikan kedua ruas dengan KPK dari semua penyebut",
    s5DefEnd: ".",
    s5ExLabel: "Contoh: Selesaikan",
    s5LCM: "KPK dari 2 dan 3 adalah 6. Kalikan semua suku dengan 6:",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "Contoh Soal", solution: "PEMBAHASAN:",
    step: "Langkah",
    verify: "Verifikasi:",
    lsLabel: "Ruas kiri:",
    c1Q: "Selesaikan persamaan",
    c1QEnd: "menggunakan metode pindah ruas!",
    c1Move1: "Pindahkan",
    c1Move1end: "ke kanan (menjadi",
    c1Move2: "Pindahkan faktor 3 ke kanan (menjadi pembagi):",
    c2Q: "Selesaikan persamaan",
    c2s1: "Distribusikan (urai kurung):",
    c2s2: "Pindahkan suku-x ke kiri, konstanta ke kanan:",
    c2s3: "Bagi kedua ruas dengan 7:",
    c3Q: "Selesaikan persamaan:",
    c3s1: "KPK dari 3 dan 4 adalah 12. Kalikan semua suku dengan 12:",
    c3s2: "Distribusikan:",
    c3s3: "Pindah ruas:",
    hp: "HP =",
  },
  en: {
    title: "SOLVING A LINEAR EQUATION IN ONE VARIABLE",
    subtitle: "Grade 7 · PLSV & PtLSV · Mathematics",
    back: "Back to PLSV & PtLSV",
    introTitle: "Five Methods for Solving a Linear Equation in One Variable",
    introBody: "There are several ways to find the value of the variable in a linear equation. Each method has its own advantages. We will learn all of them!",
    methods: ["1. Substitution Method (trial and error)", "2. Adding/Subtracting both sides", "3. Multiplying/Dividing both sides", "4. Transposition Method", "5. Equations with Fractions"],
    s1Title: "1. Substitution Method",
    s1Def: "is performed by",
    s1DefH: "trying values one by one",
    s1DefEnd: "for the variable until a true sentence is obtained. This is the simplest method, suitable for small numbers.",
    s1ExLabel: "Example: Solve",
    s1Try: "Try",
    s1HP: "SS =",
    s1Note: "Note:",
    s1NoteBody: "The substitution method is inefficient for large numbers or fractions. Use other methods for those cases.",
    s2Title: "2. Adding / Subtracting Both Sides",
    s2Principle: "Principle:",
    s2PrincipleH: "If the same number is added to or subtracted from both sides of an equation, the equation remains equivalent.",
    s2P1: "If", s2P1m: ", then",
    s2ExLabel1: "Example: Solve",
    s2Add: "Add",
    s2AddEnd: "to both sides:",
    s2ExLabel2: "Another example: Solve",
    s2Sub: "Subtract",
    s2SubEnd: "from both sides:",
    s3Title: "3. Multiplying / Dividing Both Sides",
    s3Principle: "Principle:",
    s3PrincipleH: "If both sides are multiplied or divided by the same number (not zero), the equation remains equivalent.",
    s3P1: "If", s3P1m: ", then",
    s3ExDiv: "Example (division): Solve",
    s3Div: "Divide both sides by",
    s3ExMul: "Example (multiplication): Solve",
    s3Mul: "Multiply both sides by",
    s4Title: "4. Transposition Method",
    s4DefH: "Transposition",
    s4Def: "is a quick method that uses the properties of equality. The key idea:",
    s4B1: "A term that",
    s4B1h: "moves to the other side",
    s4B1e: "will",
    s4B1h2: "change its sign",
    s4B1end: "(+ becomes −, or − becomes +)",
    s4B2: "A factor that moves becomes a divisor (× becomes ÷)",
    s4ExLabel: "Example: Solve",
    s4Move1: "Move",
    s4Move1end: "to the right side (becomes",
    s4Move2: "Move factor",
    s4Move2end: "to the right side (becomes a divisor):",
    s4Tip: "Tip:",
    s4TipBody: "Transposition is the most commonly used method because it is faster. Collect variable terms on one side and constants on the other!",
    s5Title: "5. Equations with Fractions",
    s5Def: "If the equation contains fractions, the first step is to",
    s5DefH: "eliminate the denominators",
    s5DefMid: "by",
    s5DefH2: "multiplying both sides by the LCM of all denominators",
    s5DefEnd: ".",
    s5ExLabel: "Example: Solve",
    s5LCM: "LCM of 2 and 3 is 6. Multiply every term by 6:",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "Example", solution: "SOLUTION:",
    step: "Step",
    verify: "Verification:",
    lsLabel: "Left side:",
    c1Q: "Solve the equation",
    c1QEnd: "using the transposition method!",
    c1Move1: "Move",
    c1Move1end: "to the right (becomes",
    c1Move2: "Move factor 3 to the right (becomes a divisor):",
    c2Q: "Solve the equation",
    c2s1: "Distribute (expand brackets):",
    c2s2: "Move x-terms to the left, constants to the right:",
    c2s3: "Divide both sides by 7:",
    c3Q: "Solve the equation:",
    c3s1: "LCM of 3 and 4 is 12. Multiply every term by 12:",
    c3s2: "Distribute:",
    c3s3: "Transpose:",
    hp: "SS =",
  },
  ja: {
    title: "一元一次方程式の解き方",
    subtitle: "中学1年 · 一元一次方程式と不等式 · 数学",
    back: "一元一次方程式・不等式に戻る",
    introTitle: "一元一次方程式を解く5つの方法",
    introBody: "一元一次方程式の変数の値を求める方法はいくつかあります。それぞれの方法に長所があります。すべて学びましょう！",
    methods: ["1. 代入法（試し算）", "2. 両辺への加減", "3. 両辺への乗除", "4. 移項", "5. 分数を含む方程式"],
    s1Title: "1. 代入法（試し算）",
    s1Def: "は、変数に",
    s1DefH: "値を一つずつ試す",
    s1DefEnd: "方法で、式が真になる値を見つけます。最も基本的な方法で、小さな数に適しています。",
    s1ExLabel: "例：解きなさい",
    s1Try: "試す",
    s1HP: "解集合 =",
    s1Note: "注意：",
    s1NoteBody: "代入法は大きな数や分数には非効率です。そのような場合は他の方法を使いましょう。",
    s2Title: "2. 両辺への加減",
    s2Principle: "原理：",
    s2PrincipleH: "方程式の両辺に同じ数を加えても引いても、方程式は同値のまま。",
    s2P1: "", s2P1m: "ならば",
    s2ExLabel1: "例：解きなさい",
    s2Add: "両辺に",
    s2AddEnd: "を加える：",
    s2ExLabel2: "別の例：解きなさい",
    s2Sub: "両辺から",
    s2SubEnd: "を引く：",
    s3Title: "3. 両辺への乗除",
    s3Principle: "原理：",
    s3PrincipleH: "両辺に同じ数（ゼロ以外）を掛けても割っても、方程式は同値のまま。",
    s3P1: "", s3P1m: "ならば",
    s3ExDiv: "例（除法）：解きなさい",
    s3Div: "両辺を",
    s3ExMul: "例（乗法）：解きなさい",
    s3Mul: "両辺に",
    s4Title: "4. 移項",
    s4DefH: "移項",
    s4Def: "は等式の性質を利用した速い方法です。ポイント：",
    s4B1: "",
    s4B1h: "移項した項",
    s4B1e: "は",
    s4B1h2: "符号が変わります",
    s4B1end: "（＋→－、または－→＋）",
    s4B2: "移項した因数は除数になる（×→÷）",
    s4ExLabel: "例：解きなさい",
    s4Move1: "",
    s4Move1end: "を右辺に移項（",
    s4Move2: "因数",
    s4Move2end: "を右辺に移項（除数にする）：",
    s4Tip: "ヒント：",
    s4TipBody: "移項は最もよく使われる方法です。変数の項を一方の辺に、定数を他方の辺にまとめましょう！",
    s5Title: "5. 分数を含む方程式",
    s5Def: "方程式に分数が含まれる場合、最初のステップは",
    s5DefH: "分母をなくす",
    s5DefMid: "こと。すべての分母の",
    s5DefH2: "最小公倍数（LCM）を両辺に掛けます",
    s5DefEnd: "。",
    s5ExLabel: "例：解きなさい",
    s5LCM: "2と3のLCMは6。すべての項に6を掛ける：",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題", solution: "解説：",
    step: "ステップ",
    verify: "確認：",
    lsLabel: "左辺：",
    c1Q: "方程式",
    c1QEnd: "を移項を使って解きなさい。",
    c1Move1: "",
    c1Move1end: "を右辺に移項（",
    c1Move2: "係数3を右辺に移項（除数にする）：",
    c2Q: "方程式",
    c2s1: "展開する：",
    c2s2: "xの項を左辺、定数を右辺に移項：",
    c2s3: "両辺を7で割る：",
    c3Q: "方程式を解きなさい：",
    c3s1: "3と4のLCMは12。すべての項に12を掛ける：",
    c3s2: "展開する：",
    c3s3: "移項する：",
    hp: "解集合 =",
  },
};

const PenyelesaianPLSVPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "substitusi", "tamkur", "kaibagi", "pindahruas", "pecahan", "contoh1", "contoh2", "contoh3"]);

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
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="space-y-1 font-body text-sm text-cyan-200">
                    {t.methods.map((m, i) => <p key={i}>{m}</p>)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metode Substitusi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("substitusi")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.s1Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong>{language === "en" ? "The substitution method" : language === "ja" ? "代入法" : "Metode substitusi"}</strong> {t.s1Def} <strong className="text-blue-300">{t.s1DefH}</strong> {t.s1DefEnd}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s1ExLabel} <InlineMath math="x + 4 = 9" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>{t.s1Try} <InlineMath math="x = 3" />: <InlineMath math="3 + 4 = 7 \neq 9" /> ✗</p>
                    <p>{t.s1Try} <InlineMath math="x = 5" />: <InlineMath math="5 + 4 = 9" /> ✓</p>
                    <p className="text-green-400">{t.s1HP} <InlineMath math="\{5\}" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.s1Note}</strong> {t.s1NoteBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tambah Kurang */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tamkur")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.s2Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s2Principle} <strong className="text-green-300">{t.s2PrincipleH}</strong>
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 text-center font-body text-sm text-white/80">
                    <p>{t.s2P1} <InlineMath math="a = b" />{t.s2P1m} <InlineMath math="a + c = b + c" /></p>
                    <p>{t.s2P1} <InlineMath math="a = b" />{t.s2P1m} <InlineMath math="a - c = b - c" /></p>
                  </div>
                </div>
                <BalanceScaleAnimation />
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s2ExLabel1} <InlineMath math="x - 7 = 3" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s2Add} <InlineMath math="7" /> {t.s2AddEnd}</p>
                    <BlockMath math="x - 7 + 7 = 3 + 7" />
                    <BlockMath math="x = 10" />
                    <p className="text-green-400">{t.s1HP} <InlineMath math="\{10\}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s2ExLabel2} <InlineMath math="x + 5 = 13" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s2Sub} <InlineMath math="5" /> {t.s2SubEnd}</p>
                    <BlockMath math="x + 5 - 5 = 13 - 5" />
                    <BlockMath math="x = 8" />
                    <p className="text-green-400">{t.s1HP} <InlineMath math="\{8\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kali Bagi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kaibagi")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{t.s3Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s3Principle} <strong className="text-orange-300">{t.s3PrincipleH}</strong>
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 text-center font-body text-sm text-white/80">
                    <p>{t.s3P1} <InlineMath math="a = b" />{t.s3P1m} <InlineMath math="a \times c = b \times c" /></p>
                    <p>{t.s3P1} <InlineMath math="a = b" />{t.s3P1m} <InlineMath math="\frac{a}{c} = \frac{b}{c}" /> <InlineMath math="(c \neq 0)" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s3ExDiv} <InlineMath math="4x = 20" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s3Div} <InlineMath math="4" />{language === "ja" ? "で割る：" : ":"}</p>
                    <BlockMath math="\frac{4x}{4} = \frac{20}{4}" />
                    <BlockMath math="x = 5" />
                    <p className="text-green-400">{t.s1HP} <InlineMath math="\{5\}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s3ExMul} <InlineMath math="\frac{x}{3} = 6" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s3Mul} <InlineMath math="3" />{language === "ja" ? "を掛ける：" : ":"}</p>
                    <BlockMath math="\frac{x}{3} \times 3 = 6 \times 3" />
                    <BlockMath math="x = 18" />
                    <p className="text-green-400">{t.s1HP} <InlineMath math="\{18\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pindah Ruas */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("pindahruas")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">{t.s4Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-purple-300">{t.s4DefH}</strong> {t.s4Def}
                  </p>
                  <ul className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <li>• {t.s4B1} <strong className="text-purple-300">{t.s4B1h}</strong> {t.s4B1e} <strong className="text-purple-300">{t.s4B1h2}</strong> {t.s4B1end}</li>
                    <li>• {t.s4B2}</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s4ExLabel} <InlineMath math="2x + 6 = 14" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s4Move1} <InlineMath math="+6" /> {t.s4Move1end} <InlineMath math="-6" />):</p>
                    <BlockMath math="2x = 14 - 6" />
                    <BlockMath math="2x = 8" />
                    <p>{t.s4Move2} <InlineMath math="2" /> {t.s4Move2end}</p>
                    <BlockMath math="x = \frac{8}{2} = 4" />
                    <p className="text-green-400">{t.s1HP} <InlineMath math="\{4\}" /></p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.s4Tip}</strong> {t.s4TipBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("pecahan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-pink-400" />
                <span className="font-body font-semibold text-white">{t.s5Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s5Def} <strong className="text-pink-300">{t.s5DefH}</strong> {t.s5DefMid} <strong className="text-pink-300">{t.s5DefH2}</strong>{t.s5DefEnd}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s5ExLabel} <InlineMath math="\frac{x}{2} + \frac{x}{3} = 5" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s5LCM}</p>
                    <BlockMath math="6 \cdot \frac{x}{2} + 6 \cdot \frac{x}{3} = 6 \cdot 5" />
                    <BlockMath math="3x + 2x = 30" />
                    <BlockMath math="5x = 30" />
                    <BlockMath math="x = 6" />
                    <p className="text-green-400">{t.s1HP} <InlineMath math="\{6\}" /></p>
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
                    {t.c1Q} <InlineMath math="3x - 5 = 10" /> {t.c1QEnd}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.c1Move1} <InlineMath math="-5" /> {t.c1Move1end} <InlineMath math="+5" />):</p>
                    <BlockMath math="3x = 10 + 5 = 15" />
                    <p>{t.c1Move2}</p>
                    <BlockMath math="x = \frac{15}{3} = 5" />
                    <p className="text-green-400">{t.hp} <InlineMath math="\{5\}" /></p>
                    <p>{t.verify} <InlineMath math="3(5) - 5 = 15 - 5 = 10" /> ✓</p>
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
                    {t.c2Q} <InlineMath math="5(2x - 3) = 3(x + 4)" />!
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1:</strong> {t.c2s1}</p>
                    <BlockMath math="10x - 15 = 3x + 12" />
                    <p><strong>{t.step} 2:</strong> {t.c2s2}</p>
                    <BlockMath math="10x - 3x = 12 + 15" />
                    <BlockMath math="7x = 27" />
                    <p><strong>{t.step} 3:</strong> {t.c2s3}</p>
                    <BlockMath math="x = \frac{27}{7}" />
                    <p className="text-green-400">{t.hp} <InlineMath math="\left\{\frac{27}{7}\right\}" /></p>
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
                    {t.c3Q} <InlineMath math="\frac{2x + 1}{3} - \frac{x - 2}{4} = 2" />
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1:</strong> {t.c3s1}</p>
                    <BlockMath math="12 \cdot \frac{2x+1}{3} - 12 \cdot \frac{x-2}{4} = 12 \cdot 2" />
                    <BlockMath math="4(2x + 1) - 3(x - 2) = 24" />
                    <p><strong>{t.step} 2:</strong> {t.c3s2}</p>
                    <BlockMath math="8x + 4 - 3x + 6 = 24" />
                    <BlockMath math="5x + 10 = 24" />
                    <p><strong>{t.step} 3:</strong> {t.c3s3}</p>
                    <BlockMath math="5x = 24 - 10 = 14" />
                    <BlockMath math="x = \frac{14}{5}" />
                    <p className="text-green-400">{t.hp} <InlineMath math="\left\{\frac{14}{5}\right\}" /></p>
                    <p><strong>{t.verify}</strong></p>
                    <p>{t.lsLabel} <InlineMath math="\frac{2(\frac{14}{5})+1}{3} - \frac{\frac{14}{5}-2}{4} = \frac{\frac{33}{5}}{3} - \frac{\frac{4}{5}}{4} = \frac{33}{15} - \frac{4}{20} = \frac{11}{5} - \frac{1}{5} = \frac{10}{5} = 2" /> ✓</p>
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

export default PenyelesaianPLSVPage;
