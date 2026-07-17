import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const PenerapanKontekstualPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const t = {
    title:
      language === "id" ? "PENERAPAN PERSAMAAN KUADRAT"
      : language === "en" ? "QUADRATIC EQUATION APPLICATIONS"
      : "二次方程式の文脈的応用",
    subtitle:
      language === "id" ? "Kelas 9 · Persamaan Kuadrat · Permasalahan Kontekstual"
      : language === "en" ? "Grade 9 · Quadratic Equations · Contextual Problems"
      : "中学3年 · 二次方程式 · 文脈的問題",
    backLabel:
      language === "id" ? "Kembali ke Persamaan Kuadrat"
      : language === "en" ? "Back to Quadratic Equations"
      : "二次方程式に戻る",
    introHeader:
      language === "id" ? "🌍 Matematika dalam Kehidupan Nyata"
      : language === "en" ? "🌍 Mathematics in Real Life"
      : "🌍 数学と現実の生活",
    teoriHeader:
      language === "id" ? "📘 Langkah Menyelesaikan Soal Kontekstual"
      : language === "en" ? "📘 Steps to Solve Contextual Problems"
      : "📘 文章題を解く手順",
    contohHeader:
      language === "id" ? "📝 Soal Kontekstual — Penerapan Persamaan Kuadrat"
      : language === "en" ? "📝 Contextual Problems — Quadratic Equation Applications"
      : "📝 文脈的問題 — 二次方程式の応用",
    problemWord:
      language === "id" ? "Soal" : language === "en" ? "Problem" : "問題",
    solutionLabel:
      language === "id" ? "📋 PEMBAHASAN:" : language === "en" ? "📋 SOLUTION:" : "📋 解説：",
    summaryLabel:
      language === "id" ? "🎯 Ringkasan Intisari — 5 Langkah Emas"
      : language === "en" ? "🎯 Key Summary — 5 Golden Steps"
      : "🎯 要点まとめ — 黄金の5ステップ",
    // 5-step labels
    step1Title: language === "id" ? "Baca & Pahami" : language === "en" ? "Read & Understand" : "読んで理解する",
    step1Desc:
      language === "id" ? "Identifikasi apa yang diketahui dan ditanyakan."
      : language === "en" ? "Identify what is given and what is asked."
      : "既知の情報と求めるものを特定する。",
    step2Title: language === "id" ? "Definisikan variabel" : language === "en" ? "Define variables" : "変数を定義する",
    step2Desc:
      language === "id" ? <>Misalkan besaran yang tidak diketahui dengan <InlineMath math="x" />.</>
      : language === "en" ? <>Let the unknown quantity be <InlineMath math="x" />.</>
      : <><InlineMath math="x" /> を未知の量とおく。</>,
    step3Title: language === "id" ? "Buat model matematika" : language === "en" ? "Build a mathematical model" : "数学モデルを作る",
    step3Desc:
      language === "id" ? "Ubah soal menjadi persamaan kuadrat."
      : language === "en" ? "Convert the problem into a quadratic equation."
      : "問題を二次方程式に変換する。",
    step4Title: language === "id" ? "Selesaikan persamaan" : language === "en" ? "Solve the equation" : "方程式を解く",
    step4Desc:
      language === "id" ? "Gunakan pemfaktoran, rumus ABC, atau melengkapi kuadrat."
      : language === "en" ? "Use factoring, the quadratic formula, or completing the square."
      : "因数分解・解の公式・平方完成を使う。",
    step5Title: language === "id" ? "Interpretasi & validasi" : language === "en" ? "Interpret & validate" : "解釈・検証する",
    step5Desc:
      language === "id" ? "Pilih solusi yang masuk akal sesuai konteks."
      : language === "en" ? "Choose the solution that makes sense in context."
      : "文脈に合った解を選ぶ。",
    // Common solution words
    define:
      language === "id" ? "Definisikan" : language === "en" ? "Define" : "定義",
    letWord:
      language === "id" ? "Misalkan" : language === "en" ? "Let" : "設定",
    factor:
      language === "id" ? "Faktorkan" : language === "en" ? "Factor" : "因数分解",
    model:
      language === "id" ? "Model" : language === "en" ? "Model" : "モデル",
    andWord:
      language === "id" ? "dan" : language === "en" ? "and" : "と",
    orWord:
      language === "id" ? "atau" : language === "en" ? "or" : "または",
  };

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
          <span className="font-body font-semibold text-white">{t.problemWord} {no}</span>
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

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title={t.introHeader} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    {language === "id"
                      ? <>Persamaan kuadrat bukan hanya ada di buku matematika — ia muncul di mana-mana! Dari <strong>lintasan bola yang dilempar</strong>, <strong>desain kolam renang</strong>, <strong>perhitungan laba-rugi bisnis</strong>, hingga <strong>kecepatan kendaraan</strong>. Di sini, kamu akan belajar menerjemahkan soal cerita menjadi model matematika kuadrat.</>
                      : language === "en"
                      ? <>Quadratic equations are not just in math textbooks — they appear everywhere! From the <strong>trajectory of a thrown ball</strong>, to <strong>swimming pool design</strong>, <strong>business profit calculations</strong>, and <strong>vehicle speeds</strong>. Here, you will learn to translate word problems into quadratic mathematical models.</>
                      : <>二次方程式は数学の教科書の中だけではありません — あらゆるところに現れます！<strong>投げたボールの軌跡</strong>、<strong>プールの設計</strong>、<strong>ビジネスの損益計算</strong>、<strong>乗り物の速度</strong>など。ここでは、文章題を二次方程式のモデルに変換する方法を学びます。</>}
                  </p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm">
                    {language === "id"
                      ? <><strong>⚠️ Hal Penting:</strong> Setelah mendapat akar-akar, selalu <strong>periksa relevansinya</strong> dengan konteks soal. Misalnya, panjang atau waktu tidak bisa negatif!</>
                      : language === "en"
                      ? <><strong>⚠️ Important:</strong> After finding the roots, always <strong>check their relevance</strong> to the problem context. For example, length or time cannot be negative!</>
                      : <><strong>⚠️ 注意事項：</strong>解を求めた後、必ず問題の文脈に照らして<strong>妥当性を確認</strong>してください。例えば、長さや時間は負の値になれません！</>}
                  </p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title={t.teoriHeader} />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.summaryLabel}</p>
                </Box>
                <Box color="slate">
                  <ol className="font-body text-sm text-white/80 space-y-3 list-decimal list-inside">
                    <li><strong className="text-cyan-300">{t.step1Title}:</strong> {t.step1Desc}</li>
                    <li><strong className="text-green-300">{t.step2Title}:</strong> {t.step2Desc}</li>
                    <li><strong className="text-yellow-300">{t.step3Title}:</strong> {t.step3Desc}</li>
                    <li><strong className="text-orange-300">{t.step4Title}:</strong> {t.step4Desc}</li>
                    <li><strong className="text-pink-300">{t.step5Title}:</strong> {t.step5Desc}</li>
                  </ol>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={t.contohHeader} />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                {/* Soal 1 — Bilangan bulat berurutan */}
                <ExampleBlock level="MUDAH" no={1}
                  soal={
                    language === "id"
                      ? <>Hasil kali dua bilangan bulat positif berurutan adalah 72. Tentukan kedua bilangan tersebut! 🔢</>
                      : language === "en"
                      ? <>The product of two consecutive positive integers is 72. Find both integers! 🔢</>
                      : <>連続する2つの正の整数の積が72です。その2つの整数を求めよ。🔢</>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{t.define}:</strong>{" "}
                      {language === "id"
                        ? <>Bilangan pertama = <InlineMath math="x" />, bilangan kedua = <InlineMath math="x + 1" /></>
                        : language === "en"
                        ? <>First integer = <InlineMath math="x" />, second integer = <InlineMath math="x + 1" /></>
                        : <>最初の整数 = <InlineMath math="x" />、次の整数 = <InlineMath math="x + 1" /></>}
                    </p>
                    <Dark><BlockMath math="x(x+1) = 72" /></Dark>
                    <Dark><BlockMath math="x^2 + x - 72 = 0" /></Dark>
                    <p>
                      <strong>{t.factor}:</strong> <InlineMath math="(x+9)(x-8) = 0" />
                    </p>
                    <p>
                      <InlineMath math="x = 8" /> {t.orWord} <InlineMath math="x = -9" />{" "}
                      ({language === "id"
                        ? "tidak valid karena positif"
                        : language === "en"
                        ? "invalid since both must be positive"
                        : "正の整数なので無効"})
                    </p>
                    <p>
                      ✅{" "}
                      {language === "id" ? "Kedua bilangan: " : language === "en" ? "The two integers are: " : "2つの整数は："}
                      <strong>8 {t.andWord} 9</strong>
                    </p>
                  </>}
                />

                {/* Soal 2 — Kebun persegi panjang */}
                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "id"
                      ? <>Sebuah kebun berbentuk persegi panjang memiliki panjang 5 m lebih dari lebarnya. Jika luasnya 84 m², tentukan dimensi kebun! 🌿</>
                      : language === "en"
                      ? <>A rectangular garden has a length 5 m greater than its width. If the area is 84 m², find the dimensions of the garden! 🌿</>
                      : <>長方形の庭の長さは幅より5 m長いです。面積が84 m²のとき、庭の寸法を求めよ。🌿</>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{t.letWord}:</strong>{" "}
                      {language === "id"
                        ? <>Lebar = <InlineMath math="x" /> m, Panjang = <InlineMath math="(x+5)" /> m</>
                        : language === "en"
                        ? <>Width = <InlineMath math="x" /> m, Length = <InlineMath math="(x+5)" /> m</>
                        : <>幅 = <InlineMath math="x" /> m、長さ = <InlineMath math="(x+5)" /> m</>}
                    </p>
                    <Dark><BlockMath math="x(x+5) = 84" /></Dark>
                    <Dark><BlockMath math="x^2 + 5x - 84 = 0" /></Dark>
                    <p>
                      <strong>{t.factor}:</strong> <InlineMath math="(x+12)(x-7) = 0" />
                    </p>
                    <p>
                      <InlineMath math="x = 7" />{" "}
                      ({language === "id"
                        ? "karena lebar tidak boleh negatif"
                        : language === "en"
                        ? "since width cannot be negative"
                        : "幅は負にならないため"})
                    </p>
                    <p>
                      ✅{" "}
                      {language === "id" ? "Lebar = " : language === "en" ? "Width = " : "幅 = "}
                      <strong>7 m</strong>,{" "}
                      {language === "id" ? "Panjang = " : language === "en" ? "Length = " : "長さ = "}
                      <strong>12 m</strong>
                    </p>
                  </>}
                />

                {/* Soal 3 — Bola dilempar */}
                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "id"
                      ? <>Sebuah bola dilempar ke atas dengan ketinggian (dalam meter) setelah <InlineMath math="t" /> detik dimodelkan sebagai <InlineMath math="h = -5t^2 + 20t + 1" />. Kapan bola kembali ke ketinggian 16 m? 🏀</>
                      : language === "en"
                      ? <>A ball is thrown upward. Its height (in meters) after <InlineMath math="t" /> seconds is modeled as <InlineMath math="h = -5t^2 + 20t + 1" />. When does the ball reach a height of 16 m? 🏀</>
                      : <>ボールを投げ上げたとき、<InlineMath math="t" /> 秒後の高さ（メートル）は <InlineMath math="h = -5t^2 + 20t + 1" /> でモデル化されます。ボールが高さ16 mになるのはいつですか？🏀</>
                  }
                  pembahasan={<>
                    <p>
                      {language === "id" ? <>代入 <InlineMath math="h = 16" />:</>
                      : language === "en" ? <>Substitute <InlineMath math="h = 16" />:</>
                      : <><InlineMath math="h = 16" /> を代入：</>}
                    </p>
                    <Dark><BlockMath math="-5t^2 + 20t + 1 = 16" /></Dark>
                    <Dark><BlockMath math="-5t^2 + 20t - 15 = 0 \div (-5)" /></Dark>
                    <Dark><BlockMath math="t^2 - 4t + 3 = 0" /></Dark>
                    <p>
                      <strong>{t.factor}:</strong> <InlineMath math="(t-1)(t-3) = 0" />
                    </p>
                    <p>
                      ✅ <InlineMath math="t = 1" />{" "}
                      {language === "id" ? "detik (saat naik)"
                      : language === "en" ? "second (on the way up)"
                      : "秒（上昇時）"}{" "}
                      {t.andWord}{" "}
                      <InlineMath math="t = 3" />{" "}
                      {language === "id" ? "detik (saat turun)"
                      : language === "en" ? "seconds (on the way down)"
                      : "秒（下降時）"}
                    </p>
                  </>}
                />

                {/* Soal 4 — Pedagang jeruk (CURRENCY LOCALIZED) */}
                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "id"
                      ? <>Seorang pedagang menjual <InlineMath math="x" /> buah jeruk per hari dengan harga <InlineMath math="(20 - x)" /> ribu rupiah per buah. Jika pendapatannya Rp 96.000, berapa buah yang terjual? 🍊</>
                      : language === "en"
                      ? <>A vendor sells <InlineMath math="x" /> oranges per day at a price of <InlineMath math="(20 - x)" /> dollars each. If the total revenue is $96, how many oranges were sold? 🍊</>
                      : <>ある商人が1日にオレンジを <InlineMath math="x" /> 個、1個 <InlineMath math="(20 - x)" /> ドルで販売します。売上が96ドルのとき、何個売れましたか？🍊</>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{t.model}:</strong>{" "}
                      {language === "id"
                        ? "Pendapatan = jumlah × harga"
                        : language === "en"
                        ? "Revenue = quantity × price"
                        : "売上 = 個数 × 価格"}
                    </p>
                    <Dark><BlockMath math="x(20 - x) = 96" /></Dark>
                    <Dark><BlockMath math="20x - x^2 = 96" /></Dark>
                    <Dark><BlockMath math="x^2 - 20x + 96 = 0" /></Dark>
                    <p>
                      <strong>{t.factor}:</strong> <InlineMath math="(x-8)(x-12) = 0" />
                    </p>
                    <p>
                      ✅ <InlineMath math="x = 8" /> {t.orWord} <InlineMath math="x = 12" />{" "}
                      {language === "id" ? "buah (keduanya valid)"
                      : language === "en" ? "oranges (both are valid)"
                      : "個（どちらも有効）"}
                    </p>
                  </>}
                />

                {/* Soal 5 — Kolam renang (unit meter = universal) */}
                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "id"
                      ? <>Sebuah kolam renang berbentuk persegi panjang berukuran 8 m × 6 m. Di sekelilingnya terdapat jalan setapak dengan lebar yang sama. Jika luas total (kolam + jalan) adalah 120 m², tentukan lebar jalan! 🏊‍♂️</>
                      : language === "en"
                      ? <>A rectangular swimming pool measures 8 m × 6 m. A uniform-width path surrounds it on all sides. If the total area (pool + path) is 120 m², find the width of the path! 🏊‍♂️</>
                      : <>8 m × 6 m の長方形のプールがあります。周囲に均一な幅の通路があります。全体（プール＋通路）の面積が120 m²のとき、通路の幅を求めよ。🏊‍♂️</>
                  }
                  pembahasan={<>
                    <p>
                      <strong>{t.letWord}</strong>{" "}
                      {language === "id" ? "lebar jalan" : language === "en" ? "path width" : "通路の幅"}{" "}
                      = <InlineMath math="x" /> m
                    </p>
                    <p>
                      {language === "id" ? "Dimensi total:" : language === "en" ? "Total dimensions:" : "全体の寸法："}
                      {" "}
                      {language === "id" ? "panjang" : language === "en" ? "length" : "長さ"} = <InlineMath math="(8 + 2x)" />,{" "}
                      {language === "id" ? "lebar" : language === "en" ? "width" : "幅"} = <InlineMath math="(6 + 2x)" />
                    </p>
                    <Dark><BlockMath math="(8 + 2x)(6 + 2x) = 120" /></Dark>
                    <Dark><BlockMath math="48 + 16x + 12x + 4x^2 = 120" /></Dark>
                    <Dark><BlockMath math="4x^2 + 28x - 72 = 0 \div 4" /></Dark>
                    <Dark><BlockMath math="x^2 + 7x - 18 = 0" /></Dark>
                    <p>
                      <strong>{t.factor}:</strong> <InlineMath math="(x+9)(x-2) = 0" />
                    </p>
                    <p>
                      <InlineMath math="x = 2" />{" "}
                      ({language === "id" ? "nilai negatif tidak valid"
                      : language === "en" ? "negative value is invalid"
                      : "負の値は無効"})
                    </p>
                    <p>
                      ✅{" "}
                      {language === "id" ? "Lebar jalan = " : language === "en" ? "Path width = " : "通路の幅 = "}
                      <strong>2 m</strong>
                    </p>
                  </>}
                />

                {/* Soal 6 — Kapal Pythagoras */}
                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "id"
                      ? <>Sebuah kapal berlayar ke arah timur sejauh <InlineMath math="x" /> km, kemudian berbelok ke utara sejauh <InlineMath math="(x+7)" /> km. Jarak lurus dari titik awal ke titik akhir adalah 13 km. Tentukan jarak yang ditempuh ke timur! 🚢</>
                      : language === "en"
                      ? <>A ship sails <InlineMath math="x" /> km east, then turns and sails <InlineMath math="(x+7)" /> km north. The straight-line distance from start to end is 13 km. Find the distance traveled east! 🚢</>
                      : <>船が東に <InlineMath math="x" /> km 進み、次に北に <InlineMath math="(x+7)" /> km 進みます。出発点から終点までの直線距離は13 kmです。東に進んだ距離を求めよ。🚢</>
                  }
                  pembahasan={<>
                    <p>
                      {language === "id" ? <>Gunakan <strong>Teorema Pythagoras</strong>:</>
                      : language === "en" ? <>Apply the <strong>Pythagorean Theorem</strong>:</>
                      : <><strong>ピタゴラスの定理</strong>を使う：</>}
                    </p>
                    <Dark><BlockMath math="x^2 + (x+7)^2 = 13^2" /></Dark>
                    <Dark><BlockMath math="x^2 + x^2 + 14x + 49 = 169" /></Dark>
                    <Dark><BlockMath math="2x^2 + 14x - 120 = 0 \div 2" /></Dark>
                    <Dark><BlockMath math="x^2 + 7x - 60 = 0" /></Dark>
                    <p>
                      <strong>{t.factor}:</strong> <InlineMath math="(x+12)(x-5) = 0" />
                    </p>
                    <p>
                      <InlineMath math="x = 5" />{" "}
                      ({language === "id" ? "jarak tidak boleh negatif"
                      : language === "en" ? "distance cannot be negative"
                      : "距離は負になれない"})
                    </p>
                    <p>
                      ✅{" "}
                      {language === "id" ? "Jarak ke timur = " : language === "en" ? "Distance east = " : "東への距離 = "}
                      <strong>5 km</strong>,{" "}
                      {language === "id" ? "ke utara = " : language === "en" ? "north = " : "北への距離 = "}
                      <strong>12 km</strong>
                    </p>
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

export default PenerapanKontekstualPage;
