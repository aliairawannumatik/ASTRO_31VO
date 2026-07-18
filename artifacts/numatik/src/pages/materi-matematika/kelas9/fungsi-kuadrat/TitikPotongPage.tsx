import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const TitikPotongPage = () => {
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
      language === "en" ? "INTERCEPTS WITH THE AXES" :
      language === "ja" ? "軸との切片" :
      "TITIK POTONG TERHADAP SUMBU-SUMBU",
    subtitle:
      language === "en" ? "Grade 9 · Quadratic Functions · Math Animation Book" :
      language === "ja" ? "中学3年 · 二次関数 · 数学アニメーション" :
      "Kelas 9 · Fungsi Kuadrat · Materi Matematika",
    introTitle:
      language === "en" ? "🎯 Where Does the Parabola Touch the Axes?" :
      language === "ja" ? "🎯 放物線はどこで軸と交わるか？" :
      "🎯 Di Mana Parabola Menyentuh Sumbu?",
    teoriTitle:
      language === "en" ? "📘 How to Find the Intercepts" :
      language === "ja" ? "📘 切片の求め方" :
      "📘 Cara Menentukan Titik Potong",
    contohTitle:
      language === "en" ? "📝 Examples — Axis Intercepts" :
      language === "ja" ? "📝 例題 — 軸との切片" :
      "📝 Contoh Soal — Titik Potong Sumbu",
    keySum:
      language === "en" ? "Key Summary" :
      language === "ja" ? "要点まとめ" :
      "Ringkasan Intisari",
    yIntLabel:
      language === "en" ? "📌 y-intercept" :
      language === "ja" ? "📌 y切片" :
      "📌 Titik Potong dengan Sumbu-y",
    xIntLabel:
      language === "en" ? "📌 x-intercept" :
      language === "ja" ? "📌 x切片" :
      "📌 Titik Potong dengan Sumbu-x",
    yIntDesc:
      language === "en" ? "Substitute x = 0 into the function:" :
      language === "ja" ? "x = 0 を代入する：" :
      "Substitusikan x = 0 ke dalam fungsi:",
    yIntNote:
      language === "en" ? "The y-intercept is always at (0, c)" :
      language === "ja" ? "y切片は常に (0, c) にある" :
      "Titik potong sumbu-y selalu di (0, c)",
    xIntDesc:
      language === "en" ? "Substitute f(x) = 0, then solve:" :
      language === "ja" ? "f(x) = 0 として解く：" :
      "Substitusikan f(x) = 0, lalu selesaikan:",
    xIntNote:
      language === "en" ? "Use factoring or the quadratic formula to find x₁ and x₂" :
      language === "ja" ? "因数分解や解の公式で x₁, x₂ を求める" :
      "Gunakan pemfaktoran atau rumus kuadratik untuk mencari x₁ dan x₂",
    discLabel:
      language === "en" ? "🌟 Number of x-intercepts based on the Discriminant:" :
      language === "ja" ? "🌟 判別式による x切片の個数：" :
      "🌟 Jumlah Titik Potong Berdasarkan Diskriminan:",
    d2pts:
      language === "en" ? "2 distinct intercepts" :
      language === "ja" ? "2つの異なる切片" :
      "2 titik potong berbeda",
    d1pt:
      language === "en" ? "1 tangent point (repeated root)" :
      language === "ja" ? "1点で接する（重根）" :
      "1 titik singgung (akar kembar)",
    d0pt:
      language === "en" ? "No x-intercept" :
      language === "ja" ? "x切片なし" :
      "Tidak ada titik potong",
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
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-100",
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
                      ? <>When drawing the graph of a quadratic function, we need to know <strong>where it crosses the coordinate axes</strong>. There are two types of intercepts: with the <strong>x-axis</strong> (roots of the function) and with the <strong>y-axis</strong> (the value of the function when <InlineMath math="x=0" />).</>
                      : language === "ja"
                      ? <>二次関数のグラフを描くとき、<strong>座標軸との交点</strong>を知ることが重要です。切片には2種類あります：<strong>x軸</strong>との交点（関数の根）と<strong>y軸</strong>との交点（<InlineMath math="x=0" /> のときの関数値）です。</>
                      : <>Saat menggambar grafik fungsi kuadrat, kita perlu tahu <strong>di mana grafik memotong sumbu koordinat</strong>. Ada dua jenis titik potong: dengan <strong>sumbu-x</strong> (akar-akar fungsi) dan dengan <strong>sumbu-y</strong> (nilai fungsi saat <InlineMath math="x=0" />).</>}
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "en"
                    ? <>These intercepts act like "anchors" 🪝 that help us place the graph precisely on the coordinate plane. The number of x-intercepts is determined by the <strong>discriminant</strong> <InlineMath math="D = b^2 - 4ac" />.</>
                    : language === "ja"
                    ? <>これらの切片はグラフを座標平面に正確に配置するための「アンカー」🪝の役割を果たします。x切片の数は<strong>判別式</strong> <InlineMath math="D = b^2 - 4ac" /> によって決まります。</>
                    : <>Titik-titik potong ini seperti "jangkar" 🪝 yang membantu kita menempatkan grafik dengan tepat di bidang koordinat. Banyaknya titik potong dengan sumbu-x ditentukan oleh nilai <strong>diskriminan</strong> <InlineMath math="D = b^2 - 4ac" />.</>}
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm">
                    {language === "en"
                      ? <><strong>💡 Remember:</strong> The y-intercept always exists (exactly one point), but the number of x-intercepts can be 0, 1, or 2 — depending on the discriminant!</>
                      : language === "ja"
                      ? <><strong>💡 覚えよう：</strong>y切片は必ず1つ存在しますが、x切片は判別式の値によって0個、1個、または2個になります！</>
                      : <><strong>💡 Ingat:</strong> Titik potong sumbu-y selalu ada (satu titik saja), tapi titik potong sumbu-x bisa 0, 1, atau 2 titik — tergantung nilai diskriminan!</>}
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
                  <div className="space-y-3">
                    <div>
                      <p className="font-body text-sm font-semibold text-cyan-300">{t.yIntLabel}</p>
                      <p className="font-body text-xs text-white/80 mt-1">{t.yIntDesc}</p>
                      <Dark><BlockMath math="f(0) = a(0)^2 + b(0) + c = c" /></Dark>
                      <p className="font-body text-xs text-white/70">{t.yIntNote}</p>
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-green-300">{t.xIntLabel}</p>
                      <p className="font-body text-xs text-white/80 mt-1">{t.xIntDesc}</p>
                      <Dark><BlockMath math="ax^2 + bx + c = 0" /></Dark>
                      <p className="font-body text-xs text-white/70">{t.xIntNote}</p>
                    </div>
                  </div>
                </Box>

                <p className="font-body text-sm text-white/80 font-semibold">{t.discLabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1"><InlineMath math="D > 0" /></p>
                    <div className="flex justify-center my-1">
                      <svg viewBox="0 0 80 60" className="w-20 h-14">
                        <line x1="5" y1="35" x2="75" y2="35" stroke="#4ade8060" strokeWidth="1"/>
                        <path d="M 5 55 Q 40 10 75 55" stroke="#4ade80" strokeWidth="2" fill="none"/>
                        <circle cx="18" cy="35" r="3" fill="#4ade80"/>
                        <circle cx="62" cy="35" r="3" fill="#4ade80"/>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70 text-center"><strong>{t.d2pts}</strong></p>
                  </Box>
                  <Box color="yellow">
                    <p className="font-body text-xs font-bold text-yellow-300 mb-1"><InlineMath math="D = 0" /></p>
                    <div className="flex justify-center my-1">
                      <svg viewBox="0 0 80 60" className="w-20 h-14">
                        <line x1="5" y1="35" x2="75" y2="35" stroke="#facc1560" strokeWidth="1"/>
                        <path d="M 5 55 Q 40 35 75 55" stroke="#facc15" strokeWidth="2" fill="none"/>
                        <circle cx="40" cy="35" r="3" fill="#facc15"/>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70 text-center"><strong>{t.d1pt}</strong></p>
                  </Box>
                  <Box color="red">
                    <p className="font-body text-xs font-bold text-red-300 mb-1"><InlineMath math="D < 0" /></p>
                    <div className="flex justify-center my-1">
                      <svg viewBox="0 0 80 60" className="w-20 h-14">
                        <line x1="5" y1="45" x2="75" y2="45" stroke="#f8717160" strokeWidth="1"/>
                        <path d="M 5 58 Q 40 20 75 58" stroke="#f87171" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70 text-center"><strong>{t.d0pt}</strong></p>
                  </Box>
                </div>
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
                      ? <>Find the intercepts of <InlineMath math="f(x) = x^2 - 5x + 6" /> with the x-axis and y-axis.</>
                      : language === "ja"
                      ? <><InlineMath math="f(x) = x^2 - 5x + 6" /> のx軸・y軸との切片を求めよ。</>
                      : <>Tentukan titik potong fungsi <InlineMath math="f(x) = x^2 - 5x + 6" /> dengan sumbu-x dan sumbu-y.</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "y-intercept" : language === "ja" ? "y切片" : "Titik potong sumbu-y"}</strong> ({language === "en" ? "substitute" : language === "ja" ? "代入" : "substitusi"} <InlineMath math="x = 0" />):</p>
                    <Dark><BlockMath math="f(0) = 0 - 0 + 6 = 6 \implies (0, 6)" /></Dark>
                    <p><strong>{language === "en" ? "x-intercepts" : language === "ja" ? "x切片" : "Titik potong sumbu-x"}</strong> ({language === "en" ? "solve" : language === "ja" ? "解く" : "selesaikan"} <InlineMath math="f(x) = 0" />):</p>
                    <Dark><BlockMath math="x^2 - 5x + 6 = 0 \implies (x-2)(x-3) = 0" /></Dark>
                    <p>✅ <InlineMath math="x_1 = 2" /> {language === "en" ? "and" : language === "ja" ? "と" : "dan"} <InlineMath math="x_2 = 3" /> → {language === "en" ? "intercepts:" : language === "ja" ? "切片：" : "titik potong:"} <InlineMath math="(2, 0)" /> {language === "en" ? "and" : language === "ja" ? "と" : "dan"} <InlineMath math="(3, 0)" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "en"
                      ? <>Find the intercepts of <InlineMath math="g(x) = 2x^2 - 8" /> with both coordinate axes.</>
                      : language === "ja"
                      ? <><InlineMath math="g(x) = 2x^2 - 8" /> の両座標軸との切片を求めよ。</>
                      : <>Tentukan titik potong <InlineMath math="g(x) = 2x^2 - 8" /> dengan kedua sumbu koordinat.</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "y-intercept:" : language === "ja" ? "y切片：" : "Titik potong sumbu-y:"}</strong> <InlineMath math="g(0) = -8" /> → <InlineMath math="(0, -8)" /></p>
                    <p><strong>{language === "en" ? "x-intercepts" : language === "ja" ? "x切片" : "Titik potong sumbu-x"}</strong> (<InlineMath math="g(x) = 0" />):</p>
                    <Dark><BlockMath math="2x^2 - 8 = 0 \implies x^2 = 4 \implies x = \pm 2" /></Dark>
                    <p>✅ {language === "en" ? "x-intercepts:" : language === "ja" ? "x切片：" : "Titik potong sumbu-x:"} <InlineMath math="(-2, 0)" /> {language === "en" ? "and" : language === "ja" ? "と" : "dan"} <InlineMath math="(2, 0)" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "en"
                      ? <>Find the x-intercept of <InlineMath math="h(x) = x^2 - 4x + 4" />. What is special about this intercept?</>
                      : language === "ja"
                      ? <><InlineMath math="h(x) = x^2 - 4x + 4" /> のx切片を求めよ。この切片の特別な性質は何か？</>
                      : <>Tentukan titik potong <InlineMath math="h(x) = x^2 - 4x + 4" /> dengan sumbu-x. Apa yang istimewa dari titik potong ini?</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "Check the discriminant:" : language === "ja" ? "判別式を確認：" : "Cek diskriminan:"}</strong> <InlineMath math="a=1, b=-4, c=4" /></p>
                    <Dark><BlockMath math="D = (-4)^2 - 4(1)(4) = 16 - 16 = 0" /></Dark>
                    <p>{language === "en" ? "Since" : language === "ja" ? "" : "Karena"} <InlineMath math="D = 0" />{language === "ja" ? "なので" : ","} {language === "en" ? "there is a" : language === "ja" ? "" : "ada"} <strong>{language === "en" ? "repeated root:" : language === "ja" ? "重根：" : "akar kembar:"}</strong></p>
                    <Dark><BlockMath math="x = \frac{-(-4)}{2(1)} = \frac{4}{2} = 2" /></Dark>
                    <p>✅ {language === "en"
                      ? <>The parabola only <strong>touches</strong> the x-axis at <InlineMath math="(2, 0)" /> — it does not cross, just grazes it!</>
                      : language === "ja"
                      ? <>放物線は <InlineMath math="(2, 0)" /> でx軸に<strong>接する</strong>だけで、交わらない！</>
                      : <>Parabola hanya <strong>menyinggung</strong> sumbu-x di titik <InlineMath math="(2, 0)" /> — tidak memotong, hanya menyentuh!</>}</p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "en"
                      ? <>Does the graph of <InlineMath math="p(x) = -x^2 + 3x - 5" /> intersect the x-axis? Find its y-intercept.</>
                      : language === "ja"
                      ? <><InlineMath math="p(x) = -x^2 + 3x - 5" /> のグラフはx軸と交わるか？またy切片を求めよ。</>
                      : <>Fungsi <InlineMath math="p(x) = -x^2 + 3x - 5" />. Apakah grafiknya memotong sumbu-x? Tentukan titik potong sumbu-y-nya.</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "Discriminant:" : language === "ja" ? "判別式：" : "Diskriminan:"}</strong> <InlineMath math="a=-1, b=3, c=-5" /></p>
                    <Dark><BlockMath math="D = 9 - 4(-1)(-5) = 9 - 20 = -11 < 0" /></Dark>
                    <p>❌ <InlineMath math="D < 0" /> → {language === "en"
                      ? "the graph does not intersect the x-axis at all."
                      : language === "ja"
                      ? "グラフはx軸と全く交わらない。"
                      : "grafik tidak memotong sumbu-x sama sekali."}</p>
                    <p><strong>{language === "en" ? "y-intercept:" : language === "ja" ? "y切片：" : "Titik potong sumbu-y:"}</strong></p>
                    <Dark><BlockMath math="p(0) = -0 + 0 - 5 = -5 \implies (0, -5)" /></Dark>
                    <p>✅ {language === "en"
                      ? <>Since <InlineMath math="a < 0" /> and no x-intercepts exist, the entire graph lies <strong>below the x-axis</strong>.</>
                      : language === "ja"
                      ? <><InlineMath math="a < 0" /> でx切片がないため、グラフ全体が<strong>x軸の下方</strong>にある。</>
                      : <>Karena <InlineMath math="a < 0" /> dan tidak memotong sumbu-x → seluruh grafik berada di <strong>bawah sumbu-x</strong>.</>}</p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "en"
                      ? <>The function <InlineMath math="f(x) = 2x^2 + (k-1)x - 6" /> passes through <InlineMath math="(2, 0)" />. Find the value of <InlineMath math="k" /> and the other x-intercept.</>
                      : language === "ja"
                      ? <><InlineMath math="f(x) = 2x^2 + (k-1)x - 6" /> が <InlineMath math="(2, 0)" /> を通るとき、<InlineMath math="k" /> の値ともう一方のx切片を求めよ。</>
                      : <>Fungsi <InlineMath math="f(x) = 2x^2 + (k-1)x - 6" /> memotong sumbu-x di titik <InlineMath math="(2, 0)" />. Tentukan nilai <InlineMath math="k" /> dan titik potong lainnya.</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "Step 1:" : language === "ja" ? "手順1：" : "Langkah 1:"}</strong> {language === "en" ? "Substitute" : language === "ja" ? "代入" : "Substitusikan"} <InlineMath math="x = 2,\; f(x) = 0" />:</p>
                    <Dark><BlockMath math="2(4) + (k-1)(2) - 6 = 0" /></Dark>
                    <Dark><BlockMath math="8 + 2k - 2 - 6 = 0 \implies 2k = 0 \implies k = 0" /></Dark>
                    <p><strong>{language === "en" ? "Step 2:" : language === "ja" ? "手順2：" : "Langkah 2:"}</strong> {language === "en" ? "Substitute" : language === "ja" ? "代入" : "Substitusi"} <InlineMath math="k = 0" />: <InlineMath math="f(x) = 2x^2 - x - 6" /></p>
                    <p><strong>{language === "en" ? "Step 3:" : language === "ja" ? "手順3：" : "Langkah 3:"}</strong> {language === "en" ? "Factor to find the other root:" : language === "ja" ? "因数分解してもう一方の根を求める：" : "Faktorkan untuk menemukan akar lain:"}</p>
                    <Dark><BlockMath math="2x^2 - x - 6 = (2x + 3)(x - 2) = 0" /></Dark>
                    <p>✅ <InlineMath math="x = 2" /> ({language === "en" ? "confirmed" : language === "ja" ? "確認" : "konfirmasi"}) {language === "en" ? "and" : language === "ja" ? "と" : "dan"} <InlineMath math="x = -\dfrac{3}{2}" /> → {language === "en" ? "other intercept:" : language === "ja" ? "もう一方の切片：" : "titik potong lain:"} <InlineMath math="\left(-\dfrac{3}{2}, 0\right)" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "en"
                      ? <>A parabola <InlineMath math="f(x) = ax^2 + bx + c" /> crosses the x-axis at <InlineMath math="(-1, 0)" /> and <InlineMath math="(4, 0)" />, and the y-axis at <InlineMath math="(0, -8)" />. Find <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />.</>
                      : language === "ja"
                      ? <>放物線 <InlineMath math="f(x) = ax^2 + bx + c" /> がx軸と <InlineMath math="(-1, 0)" />、<InlineMath math="(4, 0)" /> で交わり、y軸と <InlineMath math="(0, -8)" /> で交わるとき、<InlineMath math="a" />、<InlineMath math="b" />、<InlineMath math="c" /> を求めよ。</>
                      : <>Parabola <InlineMath math="f(x) = ax^2 + bx + c" /> memotong sumbu-x di <InlineMath math="(-1, 0)" /> dan <InlineMath math="(4, 0)" />, serta memotong sumbu-y di <InlineMath math="(0, -8)" />. Tentukan nilai <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />.</>
                  }
                  pembahasan={<>
                    <p><strong>{language === "en" ? "Step 1:" : language === "ja" ? "手順1：" : "Langkah 1:"}</strong> {language === "en" ? "From the x-intercepts, the roots are" : language === "ja" ? "x切片から根は" : "Dari titik potong sumbu-x, akar-akarnya"} <InlineMath math="x_1 = -1" /> {language === "en" ? "and" : language === "ja" ? "と" : "dan"} <InlineMath math="x_2 = 4" />:</p>
                    <Dark><BlockMath math="f(x) = a(x+1)(x-4)" /></Dark>
                    <p><strong>{language === "en" ? "Step 2:" : language === "ja" ? "手順2：" : "Langkah 2:"}</strong> {language === "en" ? "Use the y-intercept:" : language === "ja" ? "y切片を使う：" : "Gunakan titik potong sumbu-y:"} <InlineMath math="f(0) = -8" /></p>
                    <Dark><BlockMath math="a(0+1)(0-4) = -8 \implies -4a = -8 \implies a = 2" /></Dark>
                    <p><strong>{language === "en" ? "Step 3:" : language === "ja" ? "手順3：" : "Langkah 3:"}</strong> {language === "en" ? "Expand:" : language === "ja" ? "展開：" : "Ekspansikan:"}</p>
                    <Dark><BlockMath math="f(x) = 2(x+1)(x-4) = 2(x^2 - 3x - 4) = 2x^2 - 6x - 8" /></Dark>
                    <p>✅ <InlineMath math="a = 2,\; b = -6,\; c = -8" /></p>
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

export default TitikPotongPage;
