import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const PemfaktoranPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const t = {
    title:
      language === "id" ? "AKAR PERSAMAAN KUADRAT — PEMFAKTORAN"
      : language === "en" ? "QUADRATIC EQUATION ROOTS — FACTORING"
      : "二次方程式の解 — 因数分解",
    subtitle:
      language === "id" ? "Kelas 9 · Persamaan Kuadrat · Materi Matematika"
      : language === "en" ? "Grade 9 · Quadratic Equations · Mathematics"
      : "中学3年 · 二次方程式 · 数学",
    backLabel:
      language === "id" ? "Kembali ke Persamaan Kuadrat"
      : language === "en" ? "Back to Quadratic Equations"
      : "二次方程式に戻る",
    introHeader:
      language === "id" ? "🔧 Kenapa Pakai Pemfaktoran?"
      : language === "en" ? "🔧 Why Use Factoring?"
      : "🔧 なぜ因数分解を使うの？",
    teoriHeader:
      language === "id" ? "📘 Strategi Pemfaktoran — 3 Pola Utama"
      : language === "en" ? "📘 Factoring Strategies — 3 Key Patterns"
      : "📘 因数分解の戦略 — 3つの主要パターン",
    contohHeader:
      language === "id" ? "📝 Contoh Soal — Pemfaktoran"
      : language === "en" ? "📝 Practice Problems — Factoring"
      : "📝 練習問題 — 因数分解",
    exampleWord:
      language === "id" ? "Contoh" : language === "en" ? "Example" : "例題",
    solutionLabel:
      language === "id" ? "📋 PEMBAHASAN:" : language === "en" ? "📋 SOLUTION:" : "📋 解説：",
    zppLabel:
      language === "id" ? "⚡ Sifat Zero Product Property:"
      : language === "en" ? "⚡ Zero Product Property:"
      : "⚡ 零積の法則：",
    summaryLabel:
      language === "id" ? "🎯 Ringkasan Intisari"
      : language === "en" ? "🎯 Key Summary"
      : "🎯 要点まとめ",
    summaryDesc:
      language === "id" ? "Ada 3 pola pemfaktoran yang wajib dikuasai:"
      : language === "en" ? "There are 3 factoring patterns you must master:"
      : "習得すべき因数分解の3つのパターンがあります：",
    pola1Cond:
      language === "id" ? <>Syarat: <InlineMath math="p + q = b" /> dan <InlineMath math="p \times q = c" /></>
      : language === "en" ? <>Condition: <InlineMath math="p + q = b" /> and <InlineMath math="p \times q = c" /></>
      : <>条件：<InlineMath math="p + q = b" /> かつ <InlineMath math="p \times q = c" /></>,
    pola2Desc:
      language === "id"
        ? <>Kalikan <InlineMath math="a \times c" />, cari dua bilangan dengan hasil kali tersebut dan jumlah = <InlineMath math="b" />.</>
        : language === "en"
        ? <>Multiply <InlineMath math="a \times c" />, find two numbers with that product and sum = <InlineMath math="b" />.</>
        : <><InlineMath math="a \times c" /> を掛けて、その積を持ち和が <InlineMath math="b" /> となる2つの数を探します。</>,
    pola3Desc:
      language === "id" ? "Berlaku saat tidak ada suku tengah dan konstanta negatif."
      : language === "en" ? "Applies when there is no middle term and the constant is negative."
      : "中間項がなく定数が負のときに適用できます。",
    step1: language === "id" ? "Langkah 1" : language === "en" ? "Step 1" : "手順1",
    step2: language === "id" ? "Langkah 2" : language === "en" ? "Step 2" : "手順2",
    step3: language === "id" ? "Langkah 3" : language === "en" ? "Step 3" : "手順3",
    remember: language === "id" ? "Ingat" : language === "en" ? "Remember" : "注意",
  };

  // KaTeX vars for \text{} fix — line 125 original (Pola 2 AC arrow label)
  const kFind =
    language === "id" ? "\\text{cari}" : language === "en" ? "\\text{find}" : "\\text{探す}";
  const kFactor =
    language === "id" ? "\\text{faktorkan}" : language === "en" ? "\\text{factor}" : "\\text{因数分解}";

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const levelLabel = (level: "MUDAH" | "SEDANG" | "SULIT") =>
    language === "id"
      ? level
      : language === "en"
      ? ({ MUDAH: "EASY", SEDANG: "MEDIUM", SULIT: "HARD" } as const)[level]
      : ({ MUDAH: "基本", SEDANG: "標準", SULIT: "発展" } as const)[level];

  const DiffBadge = ({ level }: { level: "MUDAH" | "SEDANG" | "SULIT" }) => {
    const map = {
      MUDAH: "bg-green-500/20 text-green-400 border border-green-500",
      SEDANG: "bg-yellow-500/20 text-yellow-400 border border-yellow-500",
      SULIT: "bg-red-500/20 text-red-400 border border-red-500",
    };
    const bar = { MUDAH: "border-green-500", SEDANG: "border-yellow-500", SULIT: "border-red-500" };
    return { badge: map[level], bar: bar[level] };
  };

  const ExampleBlock = ({
    level, no, soal, pembahasan,
  }: { level: "MUDAH" | "SEDANG" | "SULIT"; no: number; soal: React.ReactNode; pembahasan: React.ReactNode }) => {
    const { badge, bar } = DiffBadge({ level });
    const bg =
      level === "MUDAH" ? "rgba(34,197,94,0.04)"
      : level === "SEDANG" ? "rgba(234,179,8,0.04)"
      : "rgba(239,68,68,0.04)";
    const pColor =
      level === "MUDAH" ? "text-green-400"
      : level === "SEDANG" ? "text-yellow-400"
      : "text-red-400";
    return (
      <div className={`border-l-4 ${bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${badge}`}>{levelLabel(level)}</span>
          <span className="font-body font-semibold text-white">{t.exampleWord} {no}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white/90">{soal}</div>
        <div
          className="rounded-lg p-4"
          style={{
            background: bg,
            border: `1px solid ${level === "MUDAH" ? "rgba(34,197,94,0.2)" : level === "SEDANG" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          <p className={`font-body text-xs font-semibold mb-3 ${pColor}`}>{t.solutionLabel}</p>
          <div className="space-y-2 font-body text-sm text-white/80">{pembahasan}</div>
        </div>
      </div>
    );
  };

  const Box = ({ color, children }: { color: string; children: React.ReactNode }) => {
    const map: Record<string, string> = {
      cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-100",
      green: "bg-green-500/10 border-green-500/30 text-green-100",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-100",
      purple: "bg-purple-500/10 border-purple-500/30 text-purple-100",
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-100",
      slate: "bg-slate-900/60 border-slate-700/40 text-white/80",
    };
    return <div className={`border rounded-xl p-4 ${map[color] || map.slate}`}>{children}</div>;
  };

  const Dark = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-900/70 rounded-lg p-3 my-2">{children}</div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title={t.introHeader} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    {language === "id"
                      ? <>Pemfaktoran adalah cara <strong>tercepat</strong> dan paling elegan untuk mencari akar persamaan kuadrat — kalau bisa dilakukan. Idenya sederhana: ubah <InlineMath math="ax^2 + bx + c" /> menjadi hasil kali dua faktor linear <InlineMath math="(px + q)(rx + s)" />, lalu gunakan sifat <em>zero product property</em>: kalau hasil kali dua bilangan nol, maka salah satunya pasti nol!</>
                      : language === "en"
                      ? <>Factoring is the <strong>fastest</strong> and most elegant way to find the roots of a quadratic equation — when it works. The idea is simple: rewrite <InlineMath math="ax^2 + bx + c" /> as a product of two linear factors <InlineMath math="(px + q)(rx + s)" />, then apply the <em>zero product property</em>: if the product of two numbers is zero, at least one of them must be zero!</>
                      : <>因数分解は二次方程式の解を求める<strong>最速</strong>かつ最もエレガントな方法です（可能な場合）。考え方はシンプル：<InlineMath math="ax^2 + bx + c" /> を2つの一次式 <InlineMath math="(px + q)(rx + s)" /> の積に変形し、<em>零積の法則</em>を使います：2つの数の積がゼロなら、少なくとも一方はゼロです！</>}
                  </p>
                </Box>
                <Box color="green">
                  <p className="font-body text-sm font-bold text-green-300 mb-2">{t.zppLabel}</p>
                  {/* Fix: replaced \text{Jika}/\text{atau} with JSX words + InlineMath */}
                  <Dark>
                    <p className="font-body text-sm text-center">
                      {language === "id" ? "Jika " : language === "en" ? "If " : "もし "}
                      <InlineMath math="A \times B = 0" />
                      {language === "id" ? ", maka " : language === "en" ? ", then " : " なら、"}
                      <InlineMath math="A = 0" />
                      {language === "id" ? " atau " : language === "en" ? " or " : " または "}
                      <InlineMath math="B = 0" />
                    </p>
                  </Dark>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm">
                    {language === "id"
                      ? <><strong>💡 Tips:</strong> Pemfaktoran paling mudah saat <InlineMath math="a = 1" />. Cari dua bilangan yang <strong>hasil kalinya = c</strong> dan <strong>jumlahnya = b</strong>!</>
                      : language === "en"
                      ? <><strong>💡 Tip:</strong> Factoring is easiest when <InlineMath math="a = 1" />. Find two numbers whose <strong>product = c</strong> and <strong>sum = b</strong>!</>
                      : <><strong>💡 ヒント：</strong><InlineMath math="a = 1" /> のとき因数分解が最も簡単です。<strong>積が c</strong> かつ<strong>和が b</strong> となる2つの数を探しましょう！</>}
                  </p>
                </Box>
              </div>
            )}
          </div>

          {/* ── TEORI ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title={t.teoriHeader} />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.summaryLabel}</p>
                  <p className="font-body text-sm leading-relaxed">{t.summaryDesc}</p>
                </Box>

                <div className="space-y-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1">
                      {language === "id"
                        ? <><strong>Pola 1:</strong> Koefisien <InlineMath math="a = 1" /></>
                        : language === "en"
                        ? <><strong>Pattern 1:</strong> Coefficient <InlineMath math="a = 1" /></>
                        : <><strong>パターン1：</strong>係数 <InlineMath math="a = 1" /></>}
                    </p>
                    <Dark><BlockMath math="x^2 + bx + c = (x + p)(x + q)" /></Dark>
                    <p className="font-body text-xs text-white/70">{t.pola1Cond}</p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">
                      {language === "id"
                        ? <><strong>Pola 2:</strong> Koefisien <InlineMath math="a \neq 1" /> (Metode AC)</>
                        : language === "en"
                        ? <><strong>Pattern 2:</strong> Coefficient <InlineMath math="a \neq 1" /> (AC Method)</>
                        : <><strong>パターン2：</strong>係数 <InlineMath math="a \neq 1" />（AC法）</>}
                    </p>
                    {/* Fix: replaced \text{cari}/\text{faktorkan} with language-adaptive \text{} vars */}
                    <Dark>
                      <BlockMath math={`ax^2 + bx + c \\xrightarrow{${kFind}\\; p,q:\\; pq=ac,\\; p+q=b} ${kFactor}`} />
                    </Dark>
                    <p className="font-body text-xs text-white/70">{t.pola2Desc}</p>
                  </Box>
                  <Box color="cyan">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-1">
                      {language === "id"
                        ? <><strong>Pola 3:</strong> Selisih Dua Kuadrat</>
                        : language === "en"
                        ? <><strong>Pattern 3:</strong> Difference of Two Squares</>
                        : <><strong>パターン3：</strong>平方の差</>}
                    </p>
                    <Dark><BlockMath math="x^2 - k^2 = (x+k)(x-k)" /></Dark>
                    <p className="font-body text-xs text-white/70">{t.pola3Desc}</p>
                  </Box>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={t.contohHeader} />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={
                    language === "id"
                      ? <>Tentukan akar-akar dari <InlineMath math="x^2 + 5x + 6 = 0" /> dengan pemfaktoran.</>
                      : language === "en"
                      ? <>Find the roots of <InlineMath math="x^2 + 5x + 6 = 0" /> using factoring.</>
                      : <>因数分解を使って <InlineMath math="x^2 + 5x + 6 = 0" /> の解を求めよ。</>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{t.step1}:</strong>{" "}
                      {language === "id"
                        ? "Cari dua bilangan dengan hasil kali = 6 dan jumlah = 5:"
                        : language === "en"
                        ? "Find two numbers with product = 6 and sum = 5:"
                        : "積が6で和が5となる2つの数を探す："}
                    </p>
                    <p>
                      {language === "id" ? "Coba: " : language === "en" ? "Try: " : "確認："}
                      <InlineMath math="2 \times 3 = 6" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="2 + 3 = 5" /> ✅
                    </p>
                    <Dark><BlockMath math="x^2 + 5x + 6 = (x + 2)(x + 3) = 0" /></Dark>
                    <p><strong>{t.step2}:</strong> Zero product property:</p>
                    <Dark><BlockMath math="x + 2 = 0 \Rightarrow x_1 = -2" /></Dark>
                    <Dark><BlockMath math="x + 3 = 0 \Rightarrow x_2 = -3" /></Dark>
                    <p>
                      ✅{" "}
                      {language === "id" ? "Akar-akar: " : language === "en" ? "Roots: " : "解："}
                      <InlineMath math="x_1 = -2" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="x_2 = -3" />
                    </p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "id"
                      ? <>Selesaikan: <InlineMath math="x^2 - 49 = 0" /></>
                      : language === "en"
                      ? <>Solve: <InlineMath math="x^2 - 49 = 0" /></>
                      : <>次の方程式を解け：<InlineMath math="x^2 - 49 = 0" /></>
                  }
                  pembahasan={<>
                    <p>
                      {language === "id"
                        ? <>Kenali pola <strong>selisih dua kuadrat</strong>: <InlineMath math="x^2 - 7^2 = 0" /></>
                        : language === "en"
                        ? <>Recognize the <strong>difference of squares</strong> pattern: <InlineMath math="x^2 - 7^2 = 0" /></>
                        : <><strong>平方の差</strong>のパターンを認識：<InlineMath math="x^2 - 7^2 = 0" /></>}
                    </p>
                    <Dark><BlockMath math="(x + 7)(x - 7) = 0" /></Dark>
                    <p><InlineMath math="x + 7 = 0 \Rightarrow x_1 = -7" /></p>
                    <p><InlineMath math="x - 7 = 0 \Rightarrow x_2 = 7" /></p>
                    <p>✅ <InlineMath math="x_1 = -7" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="x_2 = 7" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "id"
                      ? <>Tentukan akar-akar: <InlineMath math="x^2 - 3x - 10 = 0" /></>
                      : language === "en"
                      ? <>Find the roots: <InlineMath math="x^2 - 3x - 10 = 0" /></>
                      : <>解を求めよ：<InlineMath math="x^2 - 3x - 10 = 0" /></>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{t.step1}:</strong>{" "}
                      {language === "id"
                        ? "Cari dua bilangan dengan hasil kali = −10 dan jumlah = −3:"
                        : language === "en"
                        ? "Find two numbers with product = −10 and sum = −3:"
                        : "積が−10で和が−3となる2つの数を探す："}
                    </p>
                    <p>
                      {language === "id" ? "Coba: " : language === "en" ? "Try: " : "確認："}
                      <InlineMath math="(-5) \times 2 = -10" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="(-5) + 2 = -3" /> ✅
                    </p>
                    <Dark><BlockMath math="(x - 5)(x + 2) = 0" /></Dark>
                    <p>
                      <InlineMath math="x_1 = 5" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="x_2 = -2" />
                    </p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "id"
                      ? <>Selesaikan dengan pemfaktoran: <InlineMath math="2x^2 + 7x + 3 = 0" /></>
                      : language === "en"
                      ? <>Solve by factoring: <InlineMath math="2x^2 + 7x + 3 = 0" /></>
                      : <>因数分解で解け：<InlineMath math="2x^2 + 7x + 3 = 0" /></>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{language === "id" ? "Metode AC" : language === "en" ? "AC Method" : "AC法"}:</strong>{" "}
                      <InlineMath math="a \times c = 2 \times 3 = 6" />.{" "}
                      {language === "id"
                        ? "Cari bilangan dengan hasil kali 6 dan jumlah 7:"
                        : language === "en"
                        ? "Find numbers with product 6 and sum 7:"
                        : "積が6で和が7となる数を探す："}
                    </p>
                    <p>
                      <InlineMath math="1 \times 6 = 6" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="1 + 6 = 7" /> ✅
                    </p>
                    <p>
                      <strong>{t.step2}:</strong>{" "}
                      {language === "id" ? "Pecah suku tengah:" : language === "en" ? "Split the middle term:" : "中間項を分割："}
                    </p>
                    <Dark><BlockMath math="2x^2 + x + 6x + 3 = 0" /></Dark>
                    <p>
                      <strong>{t.step3}:</strong>{" "}
                      {language === "id" ? "Faktorkan per kelompok:" : language === "en" ? "Factor by grouping:" : "グループごとに因数分解："}
                    </p>
                    <Dark><BlockMath math="x(2x + 1) + 3(2x + 1) = 0" /></Dark>
                    <Dark><BlockMath math="(2x + 1)(x + 3) = 0" /></Dark>
                    <p>✅ <InlineMath math="x_1 = -\dfrac{1}{2}" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="x_2 = -3" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "id"
                      ? <>Selesaikan: <InlineMath math="6x^2 - x - 2 = 0" /></>
                      : language === "en"
                      ? <>Solve: <InlineMath math="6x^2 - x - 2 = 0" /></>
                      : <>解け：<InlineMath math="6x^2 - x - 2 = 0" /></>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{language === "id" ? "Metode AC" : language === "en" ? "AC Method" : "AC法"}:</strong>{" "}
                      <InlineMath math="a \times c = 6 \times (-2) = -12" />.{" "}
                      {language === "id"
                        ? "Cari bilangan hasil kali −12, jumlah −1:"
                        : language === "en"
                        ? "Find numbers with product −12, sum −1:"
                        : "積が−12で和が−1となる数を探す："}
                    </p>
                    <p>
                      <InlineMath math="(-4) \times 3 = -12" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="(-4) + 3 = -1" /> ✅
                    </p>
                    <Dark><BlockMath math="6x^2 - 4x + 3x - 2 = 0" /></Dark>
                    <Dark><BlockMath math="2x(3x - 2) + 1(3x - 2) = 0" /></Dark>
                    <Dark><BlockMath math="(3x - 2)(2x + 1) = 0" /></Dark>
                    <p>✅ <InlineMath math="x_1 = \dfrac{2}{3}" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="x_2 = -\dfrac{1}{2}" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "id"
                      ? <>Selesaikan: <InlineMath math="3x^2 - 12x = 0" /></>
                      : language === "en"
                      ? <>Solve: <InlineMath math="3x^2 - 12x = 0" /></>
                      : <>解け：<InlineMath math="3x^2 - 12x = 0" /></>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{t.step1}:</strong>{" "}
                      {language === "id"
                        ? <>Faktorkan GCF (Faktor Persekutuan Terbesar). GCF dari <InlineMath math="3x^2" /> dan <InlineMath math="12x" /> adalah <InlineMath math="3x" />:</>
                        : language === "en"
                        ? <>Factor out the GCF (Greatest Common Factor). GCF of <InlineMath math="3x^2" /> and <InlineMath math="12x" /> is <InlineMath math="3x" />:</>
                        : <>最大公因数（GCF）を括り出す。<InlineMath math="3x^2" /> と <InlineMath math="12x" /> の GCF は <InlineMath math="3x" />：</>}
                    </p>
                    <Dark><BlockMath math="3x(x - 4) = 0" /></Dark>
                    <p><strong>{t.step2}:</strong> Zero product property:</p>
                    <p><InlineMath math="3x = 0 \Rightarrow x_1 = 0" /></p>
                    <p><InlineMath math="x - 4 = 0 \Rightarrow x_2 = 4" /></p>
                    <p>✅ <InlineMath math="x_1 = 0" />{" "}
                      {language === "id" ? "dan " : language === "en" ? "and " : "かつ "}
                      <InlineMath math="x_2 = 4" /></p>
                    <Box color="yellow">
                      <p className="font-body text-xs text-yellow-200">
                        <strong>{t.remember}:</strong>{" "}
                        {language === "id"
                          ? <>Jangan pernah bagi kedua ruas dengan <InlineMath math="x" />! Nanti kehilangan solusi <InlineMath math="x = 0" />.</>
                          : language === "en"
                          ? <>Never divide both sides by <InlineMath math="x" />! You will lose the solution <InlineMath math="x = 0" />.</>
                          : <>両辺を <InlineMath math="x" /> で割ってはいけません！<InlineMath math="x = 0" /> の解を失います。</>}
                      </p>
                    </Box>
                  </>}
                />

              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/persamaan-kuadrat"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body flex items-center gap-2 mx-auto"
            >
              <Star className="w-4 h-4" /> {t.backLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PemfaktoranPage;
