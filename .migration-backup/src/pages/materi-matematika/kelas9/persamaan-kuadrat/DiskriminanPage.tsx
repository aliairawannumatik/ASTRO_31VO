import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const DiskriminanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const t = {
    title:
      language === "id" ? "DISKRIMINAN PERSAMAAN KUADRAT"
      : language === "en" ? "DISCRIMINANT OF A QUADRATIC EQUATION"
      : "二次方程式の判別式",
    subtitle:
      language === "id" ? "Kelas 9 · Persamaan Kuadrat · Materi Matematika"
      : language === "en" ? "Grade 9 · Quadratic Equations · Mathematics"
      : "中学3年 · 二次方程式 · 数学",
    backLabel:
      language === "id" ? "Kembali ke Persamaan Kuadrat"
      : language === "en" ? "Back to Quadratic Equations"
      : "二次方程式に戻る",
    introHeader:
      language === "id" ? "🔭 Apa Itu Diskriminan?"
      : language === "en" ? "🔭 What Is the Discriminant?"
      : "🔭 判別式とは？",
    teoriHeader:
      language === "id" ? "📘 Jenis-Jenis Diskriminan & Artinya"
      : language === "en" ? "📘 Types of Discriminant & Their Meaning"
      : "📘 判別式の種類とその意味",
    contohHeader:
      language === "id" ? "📝 Contoh Soal — Diskriminan"
      : language === "en" ? "📝 Practice Problems — Discriminant"
      : "📝 練習問題 — 判別式",
    exampleWord:
      language === "id" ? "Contoh" : language === "en" ? "Example" : "例題",
    solutionLabel:
      language === "id" ? "📋 PEMBAHASAN:" : language === "en" ? "📋 SOLUTION:" : "📋 解説：",
    summaryLabel:
      language === "id" ? "🎯 Ringkasan Intisari"
      : language === "en" ? "🎯 Key Summary"
      : "🎯 要点まとめ",
  };

  // KaTeX var for \text{} fix — line 200 original (\text{ atau })
  const kOr =
    language === "id" ? "\\text{ atau }" : language === "en" ? "\\text{ or }" : "\\text{または}";

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
      red: "bg-red-500/10 border-red-500/30 text-red-100",
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
                      ? <>Diskriminan adalah nilai yang bisa memberi tahu kamu <strong>jenis akar</strong> persamaan kuadrat <em>tanpa perlu menghitung akarnya dulu</em>! Ibarat ramalan bintang — hanya dari satu angka, kamu sudah tahu "nasib" solusinya.</>
                      : language === "en"
                      ? <>The discriminant is a value that tells you the <strong>type of roots</strong> a quadratic equation has — <em>without computing them first</em>! Like a weather forecast — from just one number, you already know the "fate" of the solutions.</>
                      : <>判別式は、解を実際に計算しなくても二次方程式の<strong>解の種類</strong>を教えてくれる値です！天気予報のように — たった一つの数で、解の「運命」がわかります。</>}
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80">
                  {language === "id"
                    ? <>Ingat rumus ABC? Di bawah tanda akarnya ada ekspresi <InlineMath math="b^2 - 4ac" />. Itulah yang kita sebut <strong>diskriminan</strong>, dilambangkan dengan huruf <InlineMath math="D" /> (atau kadang <InlineMath math="\Delta" />).</>
                    : language === "en"
                    ? <>Remember the quadratic formula? Under the square root there is the expression <InlineMath math="b^2 - 4ac" />. That is what we call the <strong>discriminant</strong>, denoted by the letter <InlineMath math="D" /> (or sometimes <InlineMath math="\Delta" />).</>
                    : <>二次方程式の解の公式を覚えていますか？根号の下の式 <InlineMath math="b^2 - 4ac" /> — それが<strong>判別式</strong>と呼ばれるものです。<InlineMath math="D" />（または <InlineMath math="\Delta" />）で表します。</>}
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm">
                    {language === "id"
                      ? <><strong>💡 Manfaat Utama:</strong> Dengan diskriminan, kamu bisa langsung tahu apakah persamaan punya 2 akar berbeda, 1 akar kembar, atau tidak punya akar real — tanpa repot menghitung!</>
                      : language === "en"
                      ? <><strong>💡 Main Benefit:</strong> With the discriminant, you can instantly tell whether the equation has 2 distinct roots, 1 repeated root, or no real roots — without computing!</>
                      : <><strong>💡 主な利点：</strong>判別式を使えば、方程式が2つの異なる解・重解・実数解なしのどれかをすぐに判断できます — 計算なしで！</>}
                  </p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title={t.teoriHeader} />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.summaryLabel}</p>
                  <Dark><BlockMath math="D = b^2 - 4ac" /></Dark>
                </Box>
                <div className="space-y-3">
                  <Box color="green">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-body text-sm font-bold text-green-300">
                          {language === "id" ? <>Jika <InlineMath math="D > 0" /></>
                          : language === "en" ? <>If <InlineMath math="D > 0" /></>
                          : <><InlineMath math="D > 0" /> の場合</>}
                        </p>
                        <p className="font-body text-xs text-white/80 mt-1">
                          {language === "id"
                            ? <>Persamaan memiliki <strong>dua akar real yang berbeda</strong> (<InlineMath math="x_1 \neq x_2" />). Parabola memotong sumbu-x di <strong>dua titik</strong>.</>
                            : language === "en"
                            ? <>The equation has <strong>two distinct real roots</strong> (<InlineMath math="x_1 \neq x_2" />). The parabola intersects the x-axis at <strong>two points</strong>.</>
                            : <>方程式は<strong>2つの異なる実数解</strong>を持ちます（<InlineMath math="x_1 \neq x_2" />）。放物線はx軸と<strong>2点</strong>で交わります。</>}
                        </p>
                        <p className="font-body text-xs text-green-300 mt-1">
                          {language === "id"
                            ? <>Jika <InlineMath math="D" /> adalah bilangan kuadrat sempurna → akar-akarnya <strong>rasional</strong>.</>
                            : language === "en"
                            ? <>If <InlineMath math="D" /> is a perfect square → the roots are <strong>rational</strong>.</>
                            : <><InlineMath math="D" /> が完全平方数なら → 解は<strong>有理数</strong>。</>}
                        </p>
                      </div>
                    </div>
                  </Box>
                  <Box color="yellow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-body text-sm font-bold text-yellow-300">
                          {language === "id" ? <>Jika <InlineMath math="D = 0" /></>
                          : language === "en" ? <>If <InlineMath math="D = 0" /></>
                          : <><InlineMath math="D = 0" /> の場合</>}
                        </p>
                        <p className="font-body text-xs text-white/80 mt-1">
                          {language === "id"
                            ? <>Persamaan memiliki <strong>dua akar real yang sama</strong> (akar kembar): <InlineMath math="x_1 = x_2 = -\dfrac{b}{2a}" />. Parabola <strong>menyentuh</strong> sumbu-x di satu titik.</>
                            : language === "en"
                            ? <>The equation has <strong>two equal real roots</strong> (repeated root): <InlineMath math="x_1 = x_2 = -\dfrac{b}{2a}" />. The parabola <strong>touches</strong> the x-axis at exactly one point.</>
                            : <>方程式は<strong>等しい2つの実数解</strong>（重解）を持ちます：<InlineMath math="x_1 = x_2 = -\dfrac{b}{2a}" />。放物線はx軸に1点で<strong>接します</strong>。</>}
                        </p>
                      </div>
                    </div>
                  </Box>
                  <Box color="red">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">❌</span>
                      <div>
                        <p className="font-body text-sm font-bold text-red-300">
                          {language === "id" ? <>Jika <InlineMath math="D < 0" /></>
                          : language === "en" ? <>If <InlineMath math="D < 0" /></>
                          : <><InlineMath math="D < 0" /> の場合</>}
                        </p>
                        <p className="font-body text-xs text-white/80 mt-1">
                          {language === "id"
                            ? <>Persamaan <strong>tidak memiliki akar real</strong> (akar-akarnya imajiner/kompleks). Parabola <strong>tidak memotong</strong> sumbu-x sama sekali.</>
                            : language === "en"
                            ? <>The equation has <strong>no real roots</strong> (the roots are imaginary/complex). The parabola does <strong>not intersect</strong> the x-axis at all.</>
                            : <>方程式は<strong>実数解を持ちません</strong>（解は虚数/複素数）。放物線はx軸と<strong>交わりません</strong>。</>}
                        </p>
                      </div>
                    </div>
                  </Box>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={t.contohHeader} />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={
                    language === "id"
                      ? <>Tentukan jenis akar dari <InlineMath math="x^2 - 5x + 4 = 0" /> menggunakan diskriminan.</>
                      : language === "en"
                      ? <>Determine the type of roots of <InlineMath math="x^2 - 5x + 4 = 0" /> using the discriminant.</>
                      : <>判別式を使って <InlineMath math="x^2 - 5x + 4 = 0" /> の解の種類を求めよ。</>
                  }
                  pembahasan={<>
                    <p><InlineMath math="a = 1,\; b = -5,\; c = 4" /></p>
                    <Dark><BlockMath math="D = (-5)^2 - 4(1)(4) = 25 - 16 = 9" /></Dark>
                    <p>
                      <InlineMath math="D = 9 > 0" /> →{" "}
                      <strong>
                        {language === "id" ? "Dua akar real berbeda"
                        : language === "en" ? "Two distinct real roots"
                        : "2つの異なる実数解"}
                      </strong>.{" "}
                      {language === "id"
                        ? <>Karena 9 = 3², akarnya bilangan <strong>rasional</strong> ✅</>
                        : language === "en"
                        ? <>Since 9 = 3², the roots are <strong>rational</strong> ✅</>
                        : <>9 = 3² なので、解は<strong>有理数</strong> ✅</>}
                    </p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "id"
                      ? <>Tentukan jenis akar dari <InlineMath math="x^2 - 6x + 9 = 0" /></>
                      : language === "en"
                      ? <>Determine the type of roots of <InlineMath math="x^2 - 6x + 9 = 0" /></>
                      : <><InlineMath math="x^2 - 6x + 9 = 0" /> の解の種類を求めよ</>
                  }
                  pembahasan={<>
                    <p><InlineMath math="a = 1,\; b = -6,\; c = 9" /></p>
                    <Dark><BlockMath math="D = (-6)^2 - 4(1)(9) = 36 - 36 = 0" /></Dark>
                    <p>
                      <InlineMath math="D = 0" /> →{" "}
                      <strong>
                        {language === "id" ? "Akar kembar (dua akar sama)"
                        : language === "en" ? "Repeated root (two equal roots)"
                        : "重解（等しい2つの解）"}
                      </strong>.{" "}
                      {language === "id" ? "Akar:" : language === "en" ? "Root:" : "解："}
                      {" "}<InlineMath math="x = -\frac{-6}{2} = 3" /> ✅
                    </p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "id"
                      ? <>Tentukan nilai <InlineMath math="k" /> agar <InlineMath math="x^2 + kx + 9 = 0" /> memiliki akar kembar.</>
                      : language === "en"
                      ? <>Find the value of <InlineMath math="k" /> so that <InlineMath math="x^2 + kx + 9 = 0" /> has a repeated root.</>
                      : <><InlineMath math="x^2 + kx + 9 = 0" /> が重解を持つような <InlineMath math="k" /> の値を求めよ。</>
                  }
                  pembahasan={<>
                    <p>
                      {language === "id" ? "Syarat akar kembar:" : language === "en" ? "Condition for repeated root:" : "重解の条件："}
                      {" "}<InlineMath math="D = 0" />
                    </p>
                    <Dark><BlockMath math="k^2 - 4(1)(9) = 0" /></Dark>
                    <Dark><BlockMath math="k^2 = 36 \implies k = \pm 6" /></Dark>
                    <p>✅ <InlineMath math="k = 6" />{" "}
                      {language === "id" ? "atau " : language === "en" ? "or " : "または "}
                      <InlineMath math="k = -6" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "id"
                      ? <>Tentukan jenis akar dari <InlineMath math="2x^2 + 3x + 5 = 0" /></>
                      : language === "en"
                      ? <>Determine the type of roots of <InlineMath math="2x^2 + 3x + 5 = 0" /></>
                      : <><InlineMath math="2x^2 + 3x + 5 = 0" /> の解の種類を求めよ</>
                  }
                  pembahasan={<>
                    <p><InlineMath math="a = 2,\; b = 3,\; c = 5" /></p>
                    <Dark><BlockMath math="D = 9 - 40 = -31" /></Dark>
                    <p>
                      <InlineMath math="D = -31 < 0" /> →{" "}
                      {language === "id"
                        ? <>Persamaan <strong>tidak memiliki akar real</strong> ❌</>
                        : language === "en"
                        ? <>The equation has <strong>no real roots</strong> ❌</>
                        : <>方程式は<strong>実数解を持ちません</strong> ❌</>}
                    </p>
                    <p>
                      {language === "id"
                        ? "Grafiknya adalah parabola yang seluruhnya berada di atas sumbu-x."
                        : language === "en"
                        ? "Its graph is a parabola that lies entirely above the x-axis."
                        : "グラフはx軸より上にある放物線です。"}
                    </p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "id"
                      ? <>Tentukan nilai <InlineMath math="m" /> agar <InlineMath math="mx^2 - 4x + m = 0" /> memiliki dua akar real berbeda.</>
                      : language === "en"
                      ? <>Find values of <InlineMath math="m" /> so that <InlineMath math="mx^2 - 4x + m = 0" /> has two distinct real roots.</>
                      : <><InlineMath math="mx^2 - 4x + m = 0" /> が2つの異なる実数解を持つ <InlineMath math="m" /> の値を求めよ。</>
                  }
                  pembahasan={<>
                    <p>
                      {language === "id" ? <>Syarat: <InlineMath math="D > 0" /> dan <InlineMath math="m \neq 0" /></>
                      : language === "en" ? <>Condition: <InlineMath math="D > 0" /> and <InlineMath math="m \neq 0" /></>
                      : <>条件：<InlineMath math="D > 0" /> かつ <InlineMath math="m \neq 0" /></>}
                    </p>
                    <Dark><BlockMath math="D = 16 - 4m^2 > 0" /></Dark>
                    <Dark><BlockMath math="4m^2 < 16 \implies m^2 < 4 \implies -2 < m < 2" /></Dark>
                    <p>
                      {language === "id" ? <>Tapi <InlineMath math="m \neq 0" />, maka:</> 
                      : language === "en" ? <>But <InlineMath math="m \neq 0" />, so:</>
                      : <>ただし <InlineMath math="m \neq 0" /> なので：</>}
                      {" "}✅ <InlineMath math="-2 < m < 2,\; m \neq 0" />
                    </p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "id"
                      ? <>Persamaan <InlineMath math="3x^2 + (k-1)x + 3 = 0" /> memiliki dua akar real. Tentukan rentang nilai <InlineMath math="k" />.</>
                      : language === "en"
                      ? <>The equation <InlineMath math="3x^2 + (k-1)x + 3 = 0" /> has two real roots. Find the range of values of <InlineMath math="k" />.</>
                      : <>方程式 <InlineMath math="3x^2 + (k-1)x + 3 = 0" /> が2つの実数解を持つ。<InlineMath math="k" /> の値の範囲を求めよ。</>
                  }
                  pembahasan={<>
                    <p>
                      {language === "id" ? "Syarat dua akar real:" : language === "en" ? "Condition for two real roots:" : "2つの実数解の条件："}
                      {" "}<InlineMath math="D \geq 0" />
                    </p>
                    <Dark><BlockMath math="D = (k-1)^2 - 4(3)(3) \geq 0" /></Dark>
                    <Dark><BlockMath math="(k-1)^2 \geq 36" /></Dark>
                    {/* Fix: replaced \text{ atau } with language-adaptive kOr var */}
                    <p><InlineMath math={`|k - 1| \\geq 6 \\implies k - 1 \\geq 6 ${kOr} k - 1 \\leq -6`} /></p>
                    <p>
                      ✅ <InlineMath math="k \geq 7" />{" "}
                      {language === "id" ? "atau " : language === "en" ? "or " : "または "}
                      <InlineMath math="k \leq -5" />
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

export default DiskriminanPage;
