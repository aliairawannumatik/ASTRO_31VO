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
    title: "PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL",
    subtitle: "Kelas 7 · PLSV & PtLSV · Materi Matematika",
    back: "Kembali ke PLSV & PtLSV",
    introTitle: "Serupa tapi Tidak Sama dengan PLSV",
    introBody: "Cara menyelesaikan PtLSV hampir sama dengan PLSV — kita boleh menambah, mengurang, mengali, atau membagi kedua ruas. Namun ada",
    introCritical: "satu aturan kritis yang berbeda",
    introBody2: ": saat mengali atau membagi dengan bilangan",
    introNeg: "negatif",
    introBody3: ", tanda pertidaksamaan harus",
    introFlip: "dibalik!",
    criticalLabel: "⚠️ Aturan Kritis:",
    criticalBody: "Jika kedua ruas dikali atau dibagi dengan bilangan",
    criticalNeg: "negatif",
    criticalEnd: ", maka tanda pertidaksamaan",
    criticalFlip: "DIBALIK",
    criticalNote: "menjadi",
    s1Title: "1. Menambah / Mengurang Kedua Ruas",
    s1Principle: "Menambahkan atau mengurangi kedua ruas dengan bilangan yang sama",
    s1PrincipleH: "tidak mengubah tanda pertidaksamaan",
    s1P: "Jika", s1Pm: ", maka",
    s1Ex: "Contoh: Selesaikan",
    s1Add: "Tambahkan 4 ke kedua ruas:",
    hp: "HP =",
    s2Title: "2. Mengali / Membagi dengan Bilangan Positif",
    s2Def: "Mengali atau membagi kedua ruas dengan bilangan",
    s2Pos: "positif",
    s2DefEnd: "tidak mengubah",
    s2DefEnd2: "tanda pertidaksamaan.",
    s2P: "Jika", s2Pm: "dan", s2Pm2: ", maka",
    s2Ex: "Contoh: Selesaikan",
    s2Div: "Bagi kedua ruas dengan 3 (positif, tanda tidak berubah):",
    s3Title: "3. Mengali / Membagi dengan Bilangan Negatif ⚠️",
    s3WarnLabel: "⚠️ ATURAN PENTING — TANDA DIBALIK!",
    s3Def: "Mengali atau membagi kedua ruas dengan bilangan",
    s3Neg: "negatif",
    s3DefEnd: "akan",
    s3Flip: "membalik tanda pertidaksamaan",
    s3P: "Jika", s3Pm: "dan", s3Pm2: ", maka",
    s3WhyLabel: "Mengapa tanda dibalik? Lihat contoh ini:",
    s3Know: "Kita tahu:",
    s3Mul: "Kalikan keduanya dengan",
    s3Which: "→ manakah yang lebih besar?",
    s3Result: "(tanda jadi terbalik!)",
    s3Ex: "Contoh: Selesaikan",
    s3DivNeg: "Bagi kedua ruas dengan",
    s3DivNegEnd: "(negatif → tanda DIBALIK):",
    s4Title: "4. Metode Pindah Ruas",
    s4Body: "Sama seperti PLSV, suku yang berpindah ruas berganti tanda.",
    s4Critical: "Namun, perhatikan apakah koefisien variabel bertanda negatif atau tidak!",
    s4CriticalEnd: "Jika negatif, tanda pertidaksamaan dibalik saat membagi.",
    s4Ex: "Contoh: Selesaikan",
    s4Move: "Pindahkan 5 ke kanan:",
    s4DivNeg: "Bagi kedua ruas dengan",
    s4DivNegEnd: "(negatif → tanda DIBALIK):",
    s5Title: "5. Pertidaksamaan Bentuk Pecahan",
    s5Body: "Sama seperti PLSV pecahan: kalikan kedua ruas dengan",
    s5BodyH: "KPK semua penyebut",
    s5BodyEnd: ". Perhatikan tanda penyebutnya — jika KPK positif, tanda tidak berubah.",
    s5Ex: "Contoh: Selesaikan",
    s5LCM: "KPK dari 4 dan 6 adalah 12. Kalikan semua suku dengan 12:",
    s5Move: "Pindah ruas:",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "Contoh Soal", solution: "PEMBAHASAN:",
    step: "Langkah",
    c1Q: "Selesaikan PtLSV:",
    c1Move: "Pindahkan 5 ke kanan:",
    c1Div: "Bagi dengan 2 (positif, tanda tidak berubah):",
    c2Q: "Selesaikan:",
    c2s1: "Distribusikan:",
    c2s2: "Pindah ruas:",
    c2s3: "Bagi dengan 5 (positif):",
    c3Q: "Selesaikan:",
    c3s1: "KPK dari 2 dan 4 adalah 4. Kalikan semua suku dengan 4:",
    c3s2: "Distribusikan:",
    c3s3: "Pindah ruas:",
    c3s4: "Bagi dengan 5 (positif):",
  },
  en: {
    title: "SOLVING A LINEAR INEQUALITY IN ONE VARIABLE",
    subtitle: "Grade 7 · PLSV & PtLSV · Mathematics",
    back: "Back to PLSV & PtLSV",
    introTitle: "Similar to LEOV, but with One Key Difference",
    introBody: "Solving a linear inequality is almost the same as a linear equation — we may add, subtract, multiply, or divide both sides. However, there is",
    introCritical: "one critical rule that is different",
    introBody2: ": when multiplying or dividing by a",
    introNeg: "negative",
    introBody3: "number, the inequality sign must be",
    introFlip: "flipped!",
    criticalLabel: "⚠️ Critical Rule:",
    criticalBody: "If both sides are multiplied or divided by a",
    criticalNeg: "negative",
    criticalEnd: "number, the inequality sign is",
    criticalFlip: "REVERSED",
    criticalNote: "becomes",
    s1Title: "1. Adding / Subtracting Both Sides",
    s1Principle: "Adding or subtracting the same number from both sides",
    s1PrincipleH: "does not change the inequality sign",
    s1P: "If", s1Pm: ", then",
    s1Ex: "Example: Solve",
    s1Add: "Add 4 to both sides:",
    hp: "SS =",
    s2Title: "2. Multiplying / Dividing by a Positive Number",
    s2Def: "Multiplying or dividing both sides by a",
    s2Pos: "positive",
    s2DefEnd: "number does",
    s2DefEnd2: "not change the inequality sign.",
    s2P: "If", s2Pm: "and", s2Pm2: ", then",
    s2Ex: "Example: Solve",
    s2Div: "Divide both sides by 3 (positive, sign unchanged):",
    s3Title: "3. Multiplying / Dividing by a Negative Number ⚠️",
    s3WarnLabel: "⚠️ IMPORTANT RULE — SIGN IS REVERSED!",
    s3Def: "Multiplying or dividing both sides by a",
    s3Neg: "negative",
    s3DefEnd: "number will",
    s3Flip: "reverse the inequality sign",
    s3P: "If", s3Pm: "and", s3Pm2: ", then",
    s3WhyLabel: "Why is the sign reversed? See this example:",
    s3Know: "We know:",
    s3Mul: "Multiply both by",
    s3Which: "→ which is greater?",
    s3Result: "(the sign is reversed!)",
    s3Ex: "Example: Solve",
    s3DivNeg: "Divide both sides by",
    s3DivNegEnd: "(negative → sign REVERSED):",
    s4Title: "4. Transposition Method",
    s4Body: "Same as for LEOV, a term that moves changes its sign.",
    s4Critical: "However, check whether the coefficient of the variable is negative!",
    s4CriticalEnd: "If negative, the inequality sign is reversed when dividing.",
    s4Ex: "Example: Solve",
    s4Move: "Move 5 to the right:",
    s4DivNeg: "Divide both sides by",
    s4DivNegEnd: "(negative → sign REVERSED):",
    s5Title: "5. Inequalities with Fractions",
    s5Body: "Same as for fraction equations: multiply both sides by the",
    s5BodyH: "LCM of all denominators",
    s5BodyEnd: ". Check the sign of the LCM — if it is positive, the sign does not change.",
    s5Ex: "Example: Solve",
    s5LCM: "LCM of 4 and 6 is 12. Multiply every term by 12:",
    s5Move: "Transpose:",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "Example", solution: "SOLUTION:",
    step: "Step",
    c1Q: "Solve the inequality:",
    c1Move: "Move 5 to the right:",
    c1Div: "Divide by 2 (positive, sign unchanged):",
    c2Q: "Solve:",
    c2s1: "Distribute:",
    c2s2: "Transpose:",
    c2s3: "Divide by 5 (positive):",
    c3Q: "Solve:",
    c3s1: "LCM of 2 and 4 is 4. Multiply every term by 4:",
    c3s2: "Distribute:",
    c3s3: "Transpose:",
    c3s4: "Divide by 5 (positive):",
  },
  ja: {
    title: "一元一次不等式の解き方",
    subtitle: "中学1年 · 一元一次方程式と不等式 · 数学",
    back: "一元一次方程式・不等式に戻る",
    introTitle: "方程式と似ているが、決定的な違いがある",
    introBody: "不等式の解き方は方程式とほぼ同じです — 両辺への加減乗除が使えます。しかし",
    introCritical: "決定的に異なるルールが1つあります",
    introBody2: "：",
    introNeg: "負の数",
    introBody3: "を掛けたり割ったりするとき、不等号を",
    introFlip: "逆向きにしなければなりません！",
    criticalLabel: "⚠️ 重要なルール：",
    criticalBody: "両辺を",
    criticalNeg: "負の数",
    criticalEnd: "で掛けたり割ったりすると、不等号が",
    criticalFlip: "逆向き",
    criticalNote: "になる",
    s1Title: "1. 両辺への加減",
    s1Principle: "両辺に同じ数を加えても引いても、",
    s1PrincipleH: "不等号は変わりません",
    s1P: "", s1Pm: "ならば",
    s1Ex: "例：解きなさい",
    s1Add: "両辺に4を加える：",
    hp: "解集合 =",
    s2Title: "2. 正の数を掛けたり割ったりする",
    s2Def: "両辺に",
    s2Pos: "正の数",
    s2DefEnd: "を掛けたり割ったりしても、不等号は",
    s2DefEnd2: "変わりません。",
    s2P: "", s2Pm: "かつ", s2Pm2: "ならば",
    s2Ex: "例：解きなさい",
    s2Div: "両辺を3で割る（正なので不等号は変わらない）：",
    s3Title: "3. 負の数を掛けたり割ったりする ⚠️",
    s3WarnLabel: "⚠️ 重要なルール — 不等号が逆向きになる！",
    s3Def: "両辺に",
    s3Neg: "負の数",
    s3DefEnd: "を掛けたり割ったりすると、",
    s3Flip: "不等号が逆向きになります",
    s3P: "", s3Pm: "かつ", s3Pm2: "ならば",
    s3WhyLabel: "なぜ逆向きになるの？この例を見てみよう：",
    s3Know: "わかっていること：",
    s3Mul: "両辺に",
    s3Which: "→ どちらが大きい？",
    s3Result: "（不等号が逆向きになった！）",
    s3Ex: "例：解きなさい",
    s3DivNeg: "両辺を",
    s3DivNegEnd: "で割る（負なので不等号が逆向き）：",
    s4Title: "4. 移項",
    s4Body: "方程式と同様に、移項した項は符号が変わります。",
    s4Critical: "ただし、変数の係数が負かどうか確認しましょう！",
    s4CriticalEnd: "負の場合、割るときに不等号が逆向きになります。",
    s4Ex: "例：解きなさい",
    s4Move: "5を右辺に移項：",
    s4DivNeg: "両辺を",
    s4DivNegEnd: "で割る（負なので不等号が逆向き）：",
    s5Title: "5. 分数を含む不等式",
    s5Body: "分数方程式と同様：両辺にすべての分母の",
    s5BodyH: "最小公倍数（LCM）",
    s5BodyEnd: "を掛けます。LCMが正であれば不等号は変わりません。",
    s5Ex: "例：解きなさい",
    s5LCM: "4と6のLCMは12。すべての項に12を掛ける：",
    s5Move: "移項する：",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題", solution: "解説：",
    step: "ステップ",
    c1Q: "不等式を解きなさい：",
    c1Move: "5を右辺に移項：",
    c1Div: "両辺を2で割る（正なので不等号は変わらない）：",
    c2Q: "解きなさい：",
    c2s1: "展開する：",
    c2s2: "移項する：",
    c2s3: "両辺を5で割る（正）：",
    c3Q: "解きなさい：",
    c3s1: "2と4のLCMは4。すべての項に4を掛ける：",
    c3s2: "展開する：",
    c3s3: "移項する：",
    c3s4: "両辺を5で割る（正）：",
  },
};

const PenyelesaianPtLSVPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "tamkur", "kalibagi_pos", "kalibagi_neg", "pindahruas", "pecahan", "contoh1", "contoh2", "contoh3"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const ss = language === "en" ? "SS" : language === "ja" ? "解集合" : "HP";

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
                  {t.introBody} <strong className="text-primary">{t.introCritical}</strong>{t.introBody2} <strong className="text-red-400">{t.introNeg}</strong>{t.introBody3} <strong className="text-red-400">{t.introFlip}</strong>
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-red-300 font-semibold">{t.criticalLabel}</p>
                  <p className="font-body text-sm text-white/80 mt-1">
                    {t.criticalBody} <strong className="text-red-400">{t.criticalNeg}</strong>{t.criticalEnd} <strong className="text-red-400">{t.criticalFlip}</strong>!
                  </p>
                  <p className="font-body text-sm text-white/60 mt-1">
                    ({t.criticalNote} <InlineMath math=">" /> {language === "ja" ? "は" : language === "en" ? "becomes" : "menjadi"} <InlineMath math="<" />, {language === "ja" ? "または" : language === "en" ? "or" : "atau"} <InlineMath math="\leq" /> {language === "ja" ? "は" : language === "en" ? "becomes" : "menjadi"} <InlineMath math="\geq" />, {language === "ja" ? "など" : "dst."})
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
                <span className="font-body font-semibold text-white">{t.s1Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80">
                    {t.s1Principle} <strong className="text-green-300">{t.s1PrincipleH}</strong>.
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 font-body text-sm text-white/80">
                    <p>{t.s1P} <InlineMath math="a > b" />{t.s1Pm} <InlineMath math="a + c > b + c" /></p>
                    <p>{t.s1P} <InlineMath math="a > b" />{t.s1Pm} <InlineMath math="a - c > b - c" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s1Ex} <InlineMath math="x - 4 > 3" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>{t.s1Add}</p>
                    <BlockMath math="x - 4 + 4 > 3 + 4" />
                    <BlockMath math="x > 7" />
                    <p className="text-green-400">{ss} = <InlineMath math="\{x \mid x > 7, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kali Bagi Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kalibagi_pos")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.s2Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80">
                    {t.s2Def} <strong className="text-blue-300">{t.s2Pos}</strong> {t.s2DefEnd} <strong>{t.s2DefEnd2}</strong>
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 font-body text-sm text-white/80">
                    <p>{t.s2P} <InlineMath math="a > b" /> {t.s2Pm} <InlineMath math="c > 0" />{t.s2Pm2} <InlineMath math="ac > bc" /></p>
                    <p>{t.s2P} <InlineMath math="a > b" /> {t.s2Pm} <InlineMath math="c > 0" />{t.s2Pm2} <InlineMath math="\frac{a}{c} > \frac{b}{c}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s2Ex} <InlineMath math="3x \leq 15" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/80">
                    <p>{t.s2Div}</p>
                    <BlockMath math="\frac{3x}{3} \leq \frac{15}{3}" />
                    <BlockMath math="x \leq 5" />
                    <p className="text-green-400">{ss} = <InlineMath math="\{x \mid x \leq 5, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kali Bagi Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("kalibagi_neg")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">{t.s3Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.s3WarnLabel}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.s3Def} <strong className="text-red-400">{t.s3Neg}</strong> {t.s3DefEnd} <strong className="text-red-400">{t.s3Flip}</strong>.
                  </p>
                  <div className="mt-2 bg-slate-900/50 rounded p-2 font-body text-sm text-white/80">
                    <p>{t.s3P} <InlineMath math="a > b" /> {t.s3Pm} <InlineMath math="c < 0" />{t.s3Pm2} <InlineMath math="ac < bc" /></p>
                    <p>{t.s3P} <InlineMath math="a \leq b" /> {t.s3Pm} <InlineMath math="c < 0" />{t.s3Pm2} <InlineMath math="\frac{a}{c} \geq \frac{b}{c}" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s3WhyLabel}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s3Know} <InlineMath math="3 < 7" /> ({language === "en" ? "true" : language === "ja" ? "真" : "benar"})</p>
                    <p>{t.s3Mul} <InlineMath math="-1" />{language === "ja" ? "を掛ける：" : ":"}</p>
                    <p><InlineMath math="-3" /> {language === "en" ? "and" : language === "ja" ? "と" : "dan"} <InlineMath math="-7" /> {t.s3Which}</p>
                    <p><InlineMath math="-3 > -7" /> {t.s3Result}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s3Ex} <InlineMath math="-2x > 10" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s3DivNeg} <InlineMath math="-2" /> {t.s3DivNegEnd}</p>
                    <BlockMath math="\frac{-2x}{-2} < \frac{10}{-2}" />
                    <BlockMath math="x < -5" />
                    <p className="text-green-400">{ss} = <InlineMath math="\{x \mid x < -5, x \in \mathbb{R}\}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pindah Ruas */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("pindahruas")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{t.s4Title}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80">
                    {t.s4Body} <strong className="text-orange-300">{t.s4Critical}</strong> {t.s4CriticalEnd}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s4Ex} <InlineMath math="5 - 3x \geq 14" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s4Move}</p>
                    <BlockMath math="-3x \geq 14 - 5" />
                    <BlockMath math="-3x \geq 9" />
                    <p>{t.s4DivNeg} <InlineMath math="-3" /> {t.s4DivNegEnd}</p>
                    <BlockMath math="x \leq \frac{9}{-3}" />
                    <BlockMath math="x \leq -3" />
                    <p className="text-green-400">{ss} = <InlineMath math="\{x \mid x \leq -3, x \in \mathbb{R}\}" /></p>
                  </div>
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
                  <p className="font-body text-sm text-white/80">
                    {t.s5Body} <strong className="text-pink-300">{t.s5BodyH}</strong>{t.s5BodyEnd}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm text-white/80">{t.s5Ex} <InlineMath math="\frac{x}{4} - 1 < \frac{x}{6} + 2" /></p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.s5LCM}</p>
                    <BlockMath math="12 \cdot \frac{x}{4} - 12 \cdot 1 < 12 \cdot \frac{x}{6} + 12 \cdot 2" />
                    <BlockMath math="3x - 12 < 2x + 24" />
                    <p>{t.s5Move}</p>
                    <BlockMath math="3x - 2x < 24 + 12" />
                    <BlockMath math="x < 36" />
                    <p className="text-green-400">{ss} = <InlineMath math="\{x \mid x < 36, x \in \mathbb{R}\}" /></p>
                  </div>
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
                  <p className="font-body text-sm text-white">{t.c1Q} <InlineMath math="2x + 5 < 13" /></p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p>{t.c1Move}</p>
                    <BlockMath math="2x < 13 - 5" />
                    <BlockMath math="2x < 8" />
                    <p>{t.c1Div}</p>
                    <BlockMath math="x < 4" />
                    <p className="text-green-400">{ss} = <InlineMath math="\{x \mid x < 4, x \in \mathbb{R}\}" /></p>
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
                  <p className="font-body text-sm text-white">{t.c2Q} <InlineMath math="3(x + 4) > -2(x - 1) + 5" /></p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1:</strong> {t.c2s1}</p>
                    <BlockMath math="3x + 12 > -2x + 2 + 5" />
                    <BlockMath math="3x + 12 > -2x + 7" />
                    <p><strong>{t.step} 2:</strong> {t.c2s2}</p>
                    <BlockMath math="3x + 2x > 7 - 12" />
                    <BlockMath math="5x > -5" />
                    <p><strong>{t.step} 3:</strong> {t.c2s3}</p>
                    <BlockMath math="x > -1" />
                    <p className="text-green-400">{ss} = <InlineMath math="\{x \mid x > -1, x \in \mathbb{R}\}" /></p>
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
                  <p className="font-body text-sm text-white">
                    {t.c3Q} <InlineMath math="\frac{3x - 1}{2} \geq \frac{x + 3}{4} + 1" />
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1:</strong> {t.c3s1}</p>
                    <BlockMath math="4 \cdot \frac{3x-1}{2} \geq 4 \cdot \frac{x+3}{4} + 4 \cdot 1" />
                    <BlockMath math="2(3x - 1) \geq (x + 3) + 4" />
                    <p><strong>{t.step} 2:</strong> {t.c3s2}</p>
                    <BlockMath math="6x - 2 \geq x + 7" />
                    <p><strong>{t.step} 3:</strong> {t.c3s3}</p>
                    <BlockMath math="6x - x \geq 7 + 2" />
                    <BlockMath math="5x \geq 9" />
                    <p><strong>{t.step} 4:</strong> {t.c3s4}</p>
                    <BlockMath math="x \geq \frac{9}{5}" />
                    <p className="text-green-400">{ss} = <InlineMath math="\left\{x \mid x \geq \frac{9}{5},\, x \in \mathbb{R}\right\}" /></p>
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

export default PenyelesaianPtLSVPage;
