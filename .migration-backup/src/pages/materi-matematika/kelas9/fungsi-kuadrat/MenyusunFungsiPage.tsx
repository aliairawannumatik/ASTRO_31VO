import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MenyusunFungsiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const t = {
    title:
      language === "en" ? "FORMING QUADRATIC FUNCTIONS" :
      language === "ja" ? "二次関数の作成" :
      "MENYUSUN FUNGSI KUADRAT",
    subtitle:
      language === "en" ? "Grade 9 · Quadratic Functions · Math Animation Book" :
      language === "ja" ? "中学3年 · 二次関数 · 数学アニメーション" :
      "Kelas 9 · Fungsi Kuadrat · Materi Matematika",
    introTitle:
      language === "en" ? "🔧 Design Your Own Parabola!" :
      language === "ja" ? "🔧 自分で放物線を設計しよう！" :
      "🔧 Merancang Parabola Sendiri!",
    teoriTitle:
      language === "en" ? "📘 Three Methods for Forming Quadratic Functions" :
      language === "ja" ? "📘 二次関数を作成する3つの方法" :
      "📘 Tiga Cara Menyusun Fungsi Kuadrat",
    contohTitle:
      language === "en" ? "📝 Examples — Forming Quadratic Functions" :
      language === "ja" ? "📝 例題 — 二次関数の作成" :
      "📝 Contoh Soal — Menyusun Fungsi Kuadrat",
    keySum:
      language === "en" ? "Key Summary" :
      language === "ja" ? "要点まとめ" :
      "Ringkasan Intisari",
    m1Label:
      language === "en" ? "📌 Method 1 — Given the Roots (x₁ and x₂)" :
      language === "ja" ? "📌 方法1 — 根（x₁ と x₂）が与えられた場合" :
      "📌 Cara 1 — Diketahui Akar-Akar (x₁ dan x₂)",
    m1Note:
      language === "en" ? "The value of a is determined using one additional point on the graph." :
      language === "ja" ? "a の値はグラフ上の別の1点を用いて決める。" :
      "Nilai a ditentukan menggunakan satu titik lain yang dilalui grafik.",
    m2Label:
      language === "en" ? "📌 Method 2 — Given the Vertex (h, k)" :
      language === "ja" ? "📌 方法2 — 頂点（h, k）が与えられた場合" :
      "📌 Cara 2 — Diketahui Titik Puncak (h, k)",
    m2Note:
      language === "en" ? "The value of a is determined using one additional point on the graph." :
      language === "ja" ? "a の値はグラフ上の別の1点を用いて決める。" :
      "Nilai a ditentukan menggunakan satu titik lain yang dilalui grafik.",
    m3Label:
      language === "en" ? "📌 Method 3 — Given Three Arbitrary Points" :
      language === "ja" ? "📌 方法3 — 任意の3点が与えられた場合" :
      "📌 Cara 3 — Diketahui Tiga Titik Sembarang",
    m3Note:
      language === "en" ? "Substitute the three points → a system of 3 linear equations to find a, b, c." :
      language === "ja" ? "3点を代入 → a, b, c を求める連立3元1次方程式を解く。" :
      "Substitusikan ketiga titik → sistem persamaan linear 3 variabel untuk mencari a, b, c.",
    tableHead1:
      language === "en" ? "Given Information" :
      language === "ja" ? "与えられた情報" :
      "Informasi yang Diketahui",
    tableHead2:
      language === "en" ? "Use Method" :
      language === "ja" ? "使用する方法" :
      "Gunakan Cara",
    row1:
      language === "en" ? "Two roots + one point" :
      language === "ja" ? "2つの根 + 1点" :
      "Dua akar + satu titik",
    row2:
      language === "en" ? "Vertex + one point" :
      language === "ja" ? "頂点 + 1点" :
      "Titik puncak + satu titik",
    row3:
      language === "en" ? "Axis of symmetry + two points" :
      language === "ja" ? "対称軸 + 2点" :
      "Sumbu simetri + dua titik",
    row4:
      language === "en" ? "Three arbitrary points" :
      language === "ja" ? "任意の3点" :
      "Tiga titik sembarang",
    method:
      language === "en" ? "Method" :
      language === "ja" ? "方法" :
      "Cara",
    exampleWord:
      language === "en" ? "Example" :
      language === "ja" ? "例題" :
      "Contoh",
    solutionLabel:
      language === "en" ? "📋 SOLUTION:" :
      language === "ja" ? "📋 解説：" :
      "📋 PEMBAHASAN:",
    backLabel:
      language === "en" ? "Back to Quadratic Functions" :
      language === "ja" ? "二次関数に戻る" :
      "Kembali ke Fungsi Kuadrat",
    levelLabel: (level: "MUDAH" | "SEDANG" | "SULIT") =>
      level === "MUDAH" ? (language === "en" ? "EASY" : language === "ja" ? "基本" : "MUDAH") :
      level === "SEDANG" ? (language === "en" ? "MEDIUM" : language === "ja" ? "標準" : "SEDANG") :
      (language === "en" ? "HARD" : language === "ja" ? "発展" : "SULIT"),
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const DiffBadge = ({ level }: { level: "MUDAH" | "SEDANG" | "SULIT" }) => {
    const map = {
      MUDAH: "bg-green-500/20 text-green-400 border border-green-500",
      SEDANG: "bg-yellow-500/20 text-yellow-400 border border-yellow-500",
      SULIT: "bg-red-500/20 text-red-400 border border-red-500",
    };
    const bar = { MUDAH: "border-green-500", SEDANG: "border-yellow-500", SULIT: "border-red-500" };
    return { badge: map[level], bar: bar[level] };
  };

  const ExampleBlock = ({ level, no, soal, pembahasan }: {
    level: "MUDAH" | "SEDANG" | "SULIT"; no: number;
    soal: React.ReactNode; pembahasan: React.ReactNode;
  }) => {
    const { badge, bar } = DiffBadge({ level });
    const bg = level === "MUDAH" ? "rgba(34,197,94,0.04)" : level === "SEDANG" ? "rgba(234,179,8,0.04)" : "rgba(239,68,68,0.04)";
    const pColor = level === "MUDAH" ? "text-green-400" : level === "SEDANG" ? "text-yellow-400" : "text-red-400";
    return (
      <div className={`border-l-4 ${bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${badge}`}>{t.levelLabel(level)}</span>
          <span className="font-body font-semibold text-white">{t.exampleWord} {no}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white/90">{soal}</div>
        <div className="rounded-lg p-4" style={{ background: bg, border: `1px solid ${level === "MUDAH" ? "rgba(34,197,94,0.2)" : level === "SEDANG" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)"}` }}>
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
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-500/30 text-orange-100",
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-100",
      pink: "bg-pink-500/10 border-pink-500/30 text-pink-100",
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
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.subtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title={t.introTitle} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    {language === "en"
                      ? <>Forming a quadratic function is the <strong>reverse</strong> of analyzing a graph — we are given <strong>information about the graph</strong> and determine <strong>the function's formula</strong>. It is like an architect designing a bridge from given specifications 🌉.</>
                      : language === "ja"
                      ? <>二次関数を作成することは、グラフを分析することの<strong>逆</strong>です — <strong>グラフに関する情報</strong>が与えられ、<strong>関数の式</strong>を決定します。まるで建築家が仕様書から橋を設計するようなものです 🌉。</>
                      : <>Menyusun fungsi kuadrat adalah kebalikan dari menganalisis grafik — kita punya <strong>informasi tentang grafik</strong>, lalu kita tentukan <strong>rumus fungsinya</strong>. Ibarat seorang arsitek yang merancang jembatan dari spesifikasi yang diberikan 🌉.</>}
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "en"
                    ? <>There are three main methods depending on what information is given: based on the <strong>x-intercepts (roots)</strong>, based on the <strong>vertex</strong>, or based on <strong>three arbitrary points</strong> the graph passes through.</>
                    : language === "ja"
                    ? <>与えられた情報に応じて3つの主な方法があります：<strong>x切片（根）</strong>に基づく方法、<strong>頂点</strong>に基づく方法、またはグラフが通る<strong>任意の3点</strong>に基づく方法です。</>
                    : <>Ada tiga cara utama menyusun fungsi kuadrat, tergantung informasi yang diberikan: berdasarkan <strong>titik potong sumbu-x</strong>, berdasarkan <strong>titik puncak</strong>, atau berdasarkan <strong>tiga titik sembarang</strong> yang dilalui grafik.</>}
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm">
                    {language === "en"
                      ? <><strong>💡 Key Insight:</strong> There is always a free constant (usually denoted <InlineMath math="a" />) that is determined by substituting an additional known point!</>
                      : language === "ja"
                      ? <><strong>💡 重要ポイント：</strong>常に自由定数（通常 <InlineMath math="a" /> と表す）があり、追加の既知点を代入して決定します！</>
                      : <><strong>💡 Kunci:</strong> Selalu ada konstanta bebas (biasanya dilambangkan <InlineMath math="a" />) yang ditentukan menggunakan titik tambahan yang diketahui!</>}
                  </p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title={t.teoriTitle} />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 {t.keySum}</p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-xs font-bold text-green-300 mb-1">{t.m1Label}</p>
                      <Dark><BlockMath math="f(x) = a(x - x_1)(x - x_2)" /></Dark>
                      <p className="font-body text-xs text-white/60">{t.m1Note}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs font-bold text-cyan-300 mb-1">{t.m2Label}</p>
                      <Dark><BlockMath math="f(x) = a(x - h)^2 + k" /></Dark>
                      <p className="font-body text-xs text-white/60">{t.m2Note}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs font-bold text-orange-300 mb-1">{t.m3Label}</p>
                      <Dark><BlockMath math="f(x) = ax^2 + bx + c" /></Dark>
                      <p className="font-body text-xs text-white/60">{t.m3Note}</p>
                    </div>
                  </div>
                </Box>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">📊 {language === "en" ? "CHOOSING A METHOD:" : language === "ja" ? "方法の選択ガイド：" : "PANDUAN MEMILIH CARA:"}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 pr-3 text-cyan-300">{t.tableHead1}</th>
                          <th className="text-left py-2 text-yellow-300">{t.tableHead2}</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-3">{t.row1}</td><td className="py-2 text-green-300 font-bold">{t.method} 1</td></tr>
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-3">{t.row2}</td><td className="py-2 text-cyan-300 font-bold">{t.method} 2</td></tr>
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-3">{t.row3}</td><td className="py-2 text-cyan-300 font-bold">{t.method} 2</td></tr>
                        <tr><td className="py-2 pr-3">{t.row4}</td><td className="py-2 text-orange-300 font-bold">{t.method} 3</td></tr>
                      </tbody>
                    </table>
                  </div>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={t.contohTitle} />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={
                    language === "en"
                      ? <>Find the quadratic function with roots <InlineMath math="x_1 = 1" /> and <InlineMath math="x_2 = 5" /> that passes through <InlineMath math="(0, 5)" />.</>
                      : language === "ja"
                      ? <><InlineMath math="x_1 = 1" />、<InlineMath math="x_2 = 5" /> を根に持ち、<InlineMath math="(0, 5)" /> を通る二次関数を求めよ。</>
                      : <>Tentukan fungsi kuadrat yang memiliki akar-akar <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = 5" />, dan melalui titik <InlineMath math="(0, 5)" />.</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "Step 1:" : language === "ja" ? "手順1：" : "Langkah 1:"}</strong> {language === "en" ? "Use the root form:" : language === "ja" ? "根の形を使う：" : "Gunakan bentuk dari akar-akar:"}</p>
                    <Dark><BlockMath math="f(x) = a(x - 1)(x - 5)" /></Dark>
                    <p><strong>{language === "en" ? "Step 2:" : language === "ja" ? "手順2：" : "Langkah 2:"}</strong> {language === "en" ? "Substitute point" : language === "ja" ? "点" : "Substitusi titik"} <InlineMath math="(0, 5)" />{language === "ja" ? "を代入：" : ":"}:</p>
                    <Dark><BlockMath math="5 = a(0-1)(0-5) = a(-1)(-5) = 5a \implies a = 1" /></Dark>
                    <p><strong>{language === "en" ? "Step 3:" : language === "ja" ? "手順3：" : "Langkah 3:"}</strong> {language === "en" ? "Expand:" : language === "ja" ? "展開：" : "Ekspansikan:"}</p>
                    <Dark><BlockMath math="f(x) = (x-1)(x-5) = x^2 - 6x + 5" /></Dark>
                    <p>✅ <InlineMath math="f(x) = x^2 - 6x + 5" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "en"
                      ? <>Find the quadratic function with vertex <InlineMath math="(3, -4)" /> that passes through <InlineMath math="(5, 0)" />.</>
                      : language === "ja"
                      ? <>頂点が <InlineMath math="(3, -4)" /> で <InlineMath math="(5, 0)" /> を通る二次関数を求めよ。</>
                      : <>Susun fungsi kuadrat yang titik puncaknya <InlineMath math="(3, -4)" /> dan melalui titik <InlineMath math="(5, 0)" />.</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "Step 1:" : language === "ja" ? "手順1：" : "Langkah 1:"}</strong> {language === "en" ? "Use vertex form with" : language === "ja" ? "頂点形式を使う（" : "Gunakan bentuk vertex dengan"} <InlineMath math="h = 3,\; k = -4" />{language === "ja" ? "）：" : ":"}:</p>
                    <Dark><BlockMath math="f(x) = a(x - 3)^2 - 4" /></Dark>
                    <p><strong>{language === "en" ? "Step 2:" : language === "ja" ? "手順2：" : "Langkah 2:"}</strong> {language === "en" ? "Substitute point" : language === "ja" ? "点" : "Substitusi titik"} <InlineMath math="(5, 0)" />{language === "ja" ? "を代入：" : ":"}:</p>
                    <Dark><BlockMath math="0 = a(5-3)^2 - 4 = 4a - 4 \implies a = 1" /></Dark>
                    <p><strong>{language === "en" ? "Step 3:" : language === "ja" ? "手順3：" : "Langkah 3:"}</strong> {language === "en" ? "Expand:" : language === "ja" ? "展開：" : "Ekspansikan:"}</p>
                    <Dark><BlockMath math="f(x) = (x-3)^2 - 4 = x^2 - 6x + 9 - 4 = x^2 - 6x + 5" /></Dark>
                    <p>✅ <InlineMath math="f(x) = x^2 - 6x + 5" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "en"
                      ? <>A quadratic function passes through <InlineMath math="(0, 2)" />, <InlineMath math="(1, 0)" />, and <InlineMath math="(-2, 0)" />. Find the function.</>
                      : language === "ja"
                      ? <>二次関数が <InlineMath math="(0, 2)" />、<InlineMath math="(1, 0)" />、<InlineMath math="(-2, 0)" /> を通るとき、その関数を求めよ。</>
                      : <>Grafik fungsi kuadrat melalui titik <InlineMath math="(0, 2)" />, <InlineMath math="(1, 0)" />, dan <InlineMath math="(-2, 0)" />. Susunlah fungsi kuadrat tersebut.</>
                  }
                  pembahasan={<>
                    <p>{language === "en"
                      ? <>From <InlineMath math="(1,0)" /> and <InlineMath math="(-2,0)" /> → roots are <InlineMath math="x_1 = 1" /> and <InlineMath math="x_2 = -2" /></>
                      : language === "ja"
                      ? <><InlineMath math="(1,0)" /> と <InlineMath math="(-2,0)" /> から → 根は <InlineMath math="x_1 = 1" />、<InlineMath math="x_2 = -2" /></>
                      : <>Dari titik <InlineMath math="(1,0)" /> dan <InlineMath math="(-2,0)" /> → akar-akar adalah <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = -2" /></>}</p>
                    <Dark><BlockMath math="f(x) = a(x-1)(x+2)" /></Dark>
                    <p>{language === "en" ? "Substitute point" : language === "ja" ? "点" : "Substitusi titik"} <InlineMath math="(0,2)" />{language === "ja" ? "を代入：" : ":"}:</p>
                    <Dark><BlockMath math="2 = a(0-1)(0+2) = -2a \implies a = -1" /></Dark>
                    <Dark><BlockMath math="f(x) = -(x-1)(x+2) = -(x^2 + x - 2) = -x^2 - x + 2" /></Dark>
                    <p>✅ <InlineMath math="f(x) = -x^2 - x + 2" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "en"
                      ? <>Find the quadratic function with axis of symmetry <InlineMath math="x = 2" />, optimum value <InlineMath math="3" />, that passes through <InlineMath math="(4, -5)" />.</>
                      : language === "ja"
                      ? <>対称軸 <InlineMath math="x = 2" />、最適値 <InlineMath math="3" /> を持ち、<InlineMath math="(4, -5)" /> を通る二次関数を求めよ。</>
                      : <>Susun fungsi kuadrat yang memiliki sumbu simetri <InlineMath math="x = 2" />, nilai optimum <InlineMath math="3" />, dan melalui titik <InlineMath math="(4, -5)" />.</>
                  }
                  pembahasan={<>
                    <p>{language === "en"
                      ? <>Axis of symmetry <InlineMath math="x = 2" /> and optimum value <InlineMath math="3" /> → vertex <InlineMath math="(2, 3)" /></>
                      : language === "ja"
                      ? <>対称軸 <InlineMath math="x = 2" /> と最適値 <InlineMath math="3" /> → 頂点 <InlineMath math="(2, 3)" /></>
                      : <>Sumbu simetri <InlineMath math="x = 2" /> dan nilai optimum <InlineMath math="3" /> → titik puncak <InlineMath math="(2, 3)" /></>}</p>
                    <Dark><BlockMath math="f(x) = a(x-2)^2 + 3" /></Dark>
                    <p>{language === "en" ? "Substitute point" : language === "ja" ? "点" : "Substitusi titik"} <InlineMath math="(4, -5)" />{language === "ja" ? "を代入：" : ":"}:</p>
                    <Dark><BlockMath math="-5 = a(4-2)^2 + 3 = 4a + 3 \implies 4a = -8 \implies a = -2" /></Dark>
                    <Dark><BlockMath math="f(x) = -2(x-2)^2 + 3 = -2x^2 + 8x - 8 + 3 = -2x^2 + 8x - 5" /></Dark>
                    <p>✅ <InlineMath math="f(x) = -2x^2 + 8x - 5" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "en"
                      ? <>Find the quadratic function passing through three points: <InlineMath math="A(-1, 6)" />, <InlineMath math="B(1, 2)" />, <InlineMath math="C(3, 6)" />.</>
                      : language === "ja"
                      ? <>3点 <InlineMath math="A(-1, 6)" />、<InlineMath math="B(1, 2)" />、<InlineMath math="C(3, 6)" /> を通る二次関数を求めよ。</>
                      : <>Susun fungsi kuadrat yang melalui tiga titik: <InlineMath math="A(-1, 6)" />, <InlineMath math="B(1, 2)" />, <InlineMath math="C(3, 6)" />.</>
                  }
                  pembahasan={<>
                    <p>{language === "en" ? "Use" : language === "ja" ? "" : "Gunakan"} <InlineMath math="f(x) = ax^2 + bx + c" />{language === "en" ? ". Substitute all three points:" : language === "ja" ? "を使う。3点を代入：" : ". Substitusi ketiga titik:"}</p>
                    <Dark>
                      <p className="text-sm">{language === "en" ? "From" : language === "ja" ? "" : "Dari"} A(-1,6){language === "ja" ? "から：" : ":"} <InlineMath math="a - b + c = 6 \quad \cdots (1)" /></p>
                      <p className="text-sm mt-1">{language === "en" ? "From" : language === "ja" ? "" : "Dari"} B(1,2){language === "ja" ? "から：" : ":"} <InlineMath math="a + b + c = 2 \quad \cdots (2)" /></p>
                      <p className="text-sm mt-1">{language === "en" ? "From" : language === "ja" ? "" : "Dari"} C(3,6){language === "ja" ? "から：" : ":"} <InlineMath math="9a + 3b + c = 6 \quad \cdots (3)" /></p>
                    </Dark>
                    <p><strong>(2) - (1):</strong> <InlineMath math="2b = -4 \implies b = -2" /></p>
                    <p><strong>(2) + (1):</strong> <InlineMath math="2a + 2c = 8 \implies a + c = 4 \quad \cdots (4)" /></p>
                    <p><strong>{language === "en" ? "Sub b=−2 into (3):" : language === "ja" ? "b=−2 を(3)に代入：" : "Substitusi b=−2 ke (3):"}</strong> <InlineMath math="9a - 6 + c = 6 \implies 9a + c = 12 \quad \cdots (5)" /></p>
                    <p><strong>(5) - (4):</strong> <InlineMath math="8a = 8 \implies a = 1,\; c = 3" /></p>
                    <p>✅ <InlineMath math="f(x) = x^2 - 2x + 3" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "en"
                      ? <>A quadratic function <InlineMath math="f" /> has vertex <InlineMath math="(p, q)" /> and roots <InlineMath math="x_1" />, <InlineMath math="x_2" />. Prove that <InlineMath math="p = \dfrac{x_1 + x_2}{2}" />.</>
                      : language === "ja"
                      ? <>二次関数 <InlineMath math="f" /> が頂点 <InlineMath math="(p, q)" /> と根 <InlineMath math="x_1" />、<InlineMath math="x_2" /> を持つとき、<InlineMath math="p = \dfrac{x_1 + x_2}{2}" /> を証明せよ。</>
                      : <>Fungsi kuadrat <InlineMath math="f" /> memiliki titik puncak di <InlineMath math="(p, q)" /> dan akar-akar <InlineMath math="x_1" />, <InlineMath math="x_2" />. Buktikan bahwa <InlineMath math="p = \dfrac{x_1 + x_2}{2}" />.</>
                  }
                  pembahasan={<>
                    <p>{language === "en" ? "From the factored form:" : language === "ja" ? "因数形から：" : "Dari bentuk faktor:"} <InlineMath math="f(x) = a(x - x_1)(x - x_2)" /></p>
                    <p>{language === "en" ? "Expand:" : language === "ja" ? "展開：" : "Ekspansikan:"} <InlineMath math="f(x) = a[x^2 - (x_1+x_2)x + x_1 x_2]" /></p>
                    <p>{language === "en" ? "Compare with" : language === "ja" ? "" : "Bandingkan dengan"} <InlineMath math="ax^2 + bx + c" />{language === "ja" ? "と比較：" : ":"} <InlineMath math="b = -a(x_1 + x_2)" /></p>
                    <p>{language === "en" ? "Axis of symmetry (x-coordinate of vertex):" : language === "ja" ? "対称軸（頂点のx座標）：" : "Sumbu simetri (koordinat-x puncak):"}</p>
                    <Dark><BlockMath math="p = -\frac{b}{2a} = -\frac{-a(x_1+x_2)}{2a} = \frac{x_1 + x_2}{2}" /></Dark>
                    <p>✅ {language === "en"
                      ? <>Proved: the vertex lies exactly at the <strong>midpoint</strong> between the two roots! (Symmetry property of the parabola)</>
                      : language === "ja"
                      ? <>証明完了：頂点は2つの根の<strong>中点</strong>に位置する！（放物線の対称性）</>
                      : <>Terbukti: titik puncak berada tepat di <strong>tengah-tengah</strong> antara kedua akar! (Sifat simetri parabola)</>}</p>
                  </>}
                />

              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/fungsi-kuadrat"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body flex items-center gap-2 mx-auto">
              <Star className="w-4 h-4" /> {t.backLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenyusunFungsiPage;
