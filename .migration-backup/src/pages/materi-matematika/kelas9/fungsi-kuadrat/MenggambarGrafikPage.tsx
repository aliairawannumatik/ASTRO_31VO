import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const MenggambarGrafikPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const t = {
    title:
      language === "id" ? "MENGGAMBAR GRAFIK FUNGSI KUADRAT"
      : language === "en" ? "GRAPHING QUADRATIC FUNCTIONS"
      : "二次関数のグラフの描き方",
    subtitle:
      language === "id" ? "Kelas 9 · Fungsi Kuadrat · Materi Matematika"
      : language === "en" ? "Grade 9 · Quadratic Function · Math Material"
      : "中学3年 · 二次関数 · 数学教材",
    backLabel:
      language === "id" ? "Kembali ke Fungsi Kuadrat"
      : language === "en" ? "Back to Quadratic Function"
      : "二次関数に戻る",

    introTitle:
      language === "id" ? "🎨 Melukis Parabola Langkah demi Langkah!"
      : language === "en" ? "🎨 Painting a Parabola Step by Step!"
      : "🎨 放物線をステップごとに描こう！",
    introBox: (
      language === "id"
        ? <>Menggambar grafik fungsi kuadrat bukan sekadar menghubungkan titik-titik sembarangan.
            Ada <strong>urutan langkah sistematis</strong> yang membuat hasilnya akurat dan indah — seperti melukis dengan panduan bintang di langit malam 🌌.</>
        : language === "en"
        ? <>Graphing a quadratic function is not just connecting random points.
            There is a <strong>systematic sequence of steps</strong> that makes the result accurate and beautiful — like painting guided by the stars on a night sky 🌌.</>
        : <>二次関数のグラフを描くことは、ただ点をでたらめに結ぶのではありません。
            正確で美しい結果を得るための<strong>体系的な手順</strong>があります — 夜空の星を道しるべに描く絵のようです 🌌。</>
    ) as React.ReactNode,
    introPara: (
      language === "id"
        ? <>Dengan menemukan titik-titik kunci (titik potong sumbu, titik puncak, dan beberapa titik bantu),
            kamu bisa menggambar parabola yang sempurna tanpa perlu menghitung puluhan titik!</>
        : language === "en"
        ? <>By finding the key points (axis intercepts, vertex, and a few helper points),
            you can draw a perfect parabola without having to calculate dozens of points!</>
        : <>交点、頂点、補助点などの重要な点を見つけることで、
            何十もの点を計算しなくても完璧な放物線が描けます！</>
    ) as React.ReactNode,
    keyTip:
      language === "id" ? "💡 Kunci Sukses:"
      : language === "en" ? "💡 Key to Success:"
      : "💡 成功の鍵：",
    keyTipBody: (
      language === "id"
        ? <>Selalu cek tanda nilai <InlineMath math="a" /> dulu untuk tahu arah bukaan parabola sebelum menggambar!</>
        : language === "en"
        ? <>Always check the sign of <InlineMath math="a" /> first to know the opening direction of the parabola before drawing!</>
        : <>描く前に必ず <InlineMath math="a" /> の符号を確認して、放物線の開く方向を把握しましょう！</>
    ) as React.ReactNode,

    teoriTitle:
      language === "id" ? "📘 Langkah-Langkah Menggambar Grafik"
      : language === "en" ? "📘 Steps for Graphing"
      : "📘 グラフを描く手順",
    summaryTitle:
      language === "id" ? "🎯 Ringkasan Intisari — 5 Langkah Utama"
      : language === "en" ? "🎯 Key Summary — 5 Main Steps"
      : "🎯 要点まとめ — 5つの主なステップ",

    steps: language === "id"
      ? [
          { step: "1", color: "text-cyan-300",   label: "Tentukan arah bukaan",     desc: "Cek tanda a: positif → ke atas, negatif → ke bawah" },
          { step: "2", color: "text-green-300",  label: "Titik potong sumbu-y",     desc: "Substitusikan x = 0 → titik (0, c)" },
          { step: "3", color: "text-yellow-300", label: "Titik potong sumbu-x",     desc: "Selesaikan f(x) = 0 (jika ada)" },
          { step: "4", color: "text-orange-300", label: "Titik puncak (vertex)",    desc: "Hitung xp = -b/2a, lalu yp = f(xp)" },
          { step: "5", color: "text-pink-300",   label: "Titik bantu tambahan",     desc: "Pilih 2–4 nilai x lain, hitung f(x)-nya" },
        ]
      : language === "en"
      ? [
          { step: "1", color: "text-cyan-300",   label: "Determine opening direction", desc: "Check sign of a: positive → upward, negative → downward" },
          { step: "2", color: "text-green-300",  label: "y-intercept",                desc: "Substitute x = 0 → point (0, c)" },
          { step: "3", color: "text-yellow-300", label: "x-intercepts",               desc: "Solve f(x) = 0 (if they exist)" },
          { step: "4", color: "text-orange-300", label: "Vertex",                     desc: "Calculate xp = -b/2a, then yp = f(xp)" },
          { step: "5", color: "text-pink-300",   label: "Additional helper points",   desc: "Choose 2–4 more x values, compute f(x)" },
        ]
      : [
          { step: "1", color: "text-cyan-300",   label: "開く方向を確認する",   desc: "aの符号を確認：正 → 上、負 → 下" },
          { step: "2", color: "text-green-300",  label: "y軸との交点",          desc: "x = 0 を代入 → 点 (0, c)" },
          { step: "3", color: "text-yellow-300", label: "x軸との交点",          desc: "f(x) = 0 を解く（存在する場合）" },
          { step: "4", color: "text-orange-300", label: "頂点",                 desc: "xp = -b/2a を計算し、yp = f(xp) を求める" },
          { step: "5", color: "text-pink-300",   label: "補助点の追加",         desc: "x を2〜4個選び、f(x) を計算する" },
        ],

    tableCaption:
      language === "id" ? "📋 CONTOH TABEL NILAI —"
      : language === "en" ? "📋 SAMPLE VALUE TABLE —"
      : "📋 値の表の例 —",
    tableNote: (
      language === "id"
        ? <>🟡 Titik puncak: <InlineMath math="(1, -4)" /> | 🟢 Sumbu-y: <InlineMath math="(0,-3)" /> | Sumbu-x: <InlineMath math="(-1,0)" /> dan <InlineMath math="(3,0)" /></>
        : language === "en"
        ? <>🟡 Vertex: <InlineMath math="(1, -4)" /> | 🟢 y-intercept: <InlineMath math="(0,-3)" /> | x-intercepts: <InlineMath math="(-1,0)" /> and <InlineMath math="(3,0)" /></>
        : <>🟡 頂点：<InlineMath math="(1, -4)" /> | 🟢 y軸交点：<InlineMath math="(0,-3)" /> | x軸交点：<InlineMath math="(-1,0)" /> と <InlineMath math="(3,0)" /></>
    ) as React.ReactNode,
    tipsLabel:
      language === "id" ? "⚠️ Tips Gambar:"
      : language === "en" ? "⚠️ Drawing Tip:"
      : "⚠️ 描くときのポイント：",
    tipsBody: (
      language === "id"
        ? <>Selalu sertakan <strong>sumbu simetri</strong> sebagai garis putus-putus vertikal melewati titik puncak. Ini membantu menunjukkan sifat simetri parabola!</>
        : language === "en"
        ? <>Always include the <strong>axis of symmetry</strong> as a vertical dashed line through the vertex. This helps show the symmetry of the parabola!</>
        : <>常に頂点を通る垂直な破線として<strong>対称軸</strong>を描きましょう。これで放物線の対称性が伝わります！</>
    ) as React.ReactNode,

    contohTitle:
      language === "id" ? "📝 Contoh Soal — Menggambar Grafik"
      : language === "en" ? "📝 Worked Examples — Graphing"
      : "📝 例題 — グラフの描き方",
    exLabel: language === "id" ? "Contoh" : language === "en" ? "Example" : "例題",
    solLabel: language === "id" ? "📋 PEMBAHASAN:" : language === "en" ? "📋 SOLUTION:" : "📋 解答：",
    step: (n: number) =>
      language === "id" ? `Langkah ${n}` : language === "en" ? `Step ${n}` : `ステップ${n}`,
    levelLabel: (lv: "MUDAH" | "SEDANG" | "SULIT") =>
      language === "en" ? (lv === "MUDAH" ? "EASY" : lv === "SEDANG" ? "MEDIUM" : "HARD")
      : language === "ja" ? (lv === "MUDAH" ? "基本" : lv === "SEDANG" ? "標準" : "発展")
      : lv,

    upLabel:   language === "id" ? "atas"   : language === "en" ? "upward"   : "上",
    downLabel: language === "id" ? "bawah"  : language === "en" ? "downward" : "下",
    minLabel:  language === "id" ? "minimum" : language === "en" ? "minimum" : "最小",
    maxLabel:  language === "id" ? "maksimum" : language === "en" ? "maximum" : "最大",
    axisSymLabel: language === "id" ? "Sumbu simetri" : language === "en" ? "Axis of symmetry" : "対称軸",
    vertexLabel:  language === "id" ? "Titik puncak"  : language === "en" ? "Vertex"           : "頂点",
    yIntLabel:    language === "id" ? "Titik potong sumbu-y" : language === "en" ? "y-intercept" : "y軸との交点",
    xIntLabel:    language === "id" ? "Titik potong sumbu-x" : language === "en" ? "x-intercepts" : "x軸との交点",
    dirLabel:     language === "id" ? "Arah bukaan"  : language === "en" ? "Opening direction" : "開く方向",
    diskLabel:    language === "id" ? "Diskriminan"  : language === "en" ? "Discriminant"      : "判別式",
    aboveXLabel:  language === "id" ? "di atas sumbu-x" : language === "en" ? "above the x-axis" : "x軸の上",
  };

  // kAnd / kOr: language-adaptive conjunctions for KaTeX
  const kAnd =
    language === "id" ? "\\text{ dan }"
    : language === "en" ? "\\text{ and }"
    : "\\text{と}";
  const kOr =
    language === "id" ? "\\text{ atau }"
    : language === "en" ? "\\text{ or }"
    : "\\text{または}";

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
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
          <span className="font-body font-semibold text-white">{t.exLabel} {no}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white/90">{soal}</div>
        <div className="rounded-lg p-4" style={{ background: bg, border: `1px solid ${level === "MUDAH" ? "rgba(34,197,94,0.2)" : level === "SEDANG" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)"}` }}>
          <p className={`font-body text-xs font-semibold mb-3 ${pColor}`}>{t.solLabel}</p>
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
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">{t.introBox}</p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introPara}</p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>{t.keyTip}</strong> {t.keyTipBody}</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title={t.teoriTitle} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.summaryTitle}</p>
                  <div className="space-y-2">
                    {t.steps.map(({ step, color, label, desc }) => (
                      <div key={step} className="flex gap-3 items-start">
                        <span className={`font-bold text-lg ${color} shrink-0 w-5`}>{step}.</span>
                        <div>
                          <p className={`font-body text-xs font-semibold ${color}`}>{label}</p>
                          <p className="font-body text-xs text-white/60">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">
                    {t.tableCaption} <InlineMath math="f(x) = x^2 - 2x - 3" />
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse text-center">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="py-2 px-3 text-cyan-300"><InlineMath math="x" /></th>
                          <th className="py-2 px-3 text-white/60">-2</th>
                          <th className="py-2 px-3 text-white/60">-1</th>
                          <th className="py-2 px-3 text-yellow-300 font-bold">0</th>
                          <th className="py-2 px-3 text-yellow-300 font-bold">1</th>
                          <th className="py-2 px-3 text-yellow-300 font-bold">2</th>
                          <th className="py-2 px-3 text-white/60">3</th>
                          <th className="py-2 px-3 text-white/60">4</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-white/80">
                          <td className="py-2 px-3 text-cyan-300 font-semibold"><InlineMath math="f(x)" /></td>
                          <td className="py-2 px-3">5</td>
                          <td className="py-2 px-3">0</td>
                          <td className="py-2 px-3 text-green-300 font-bold">-3</td>
                          <td className="py-2 px-3 text-orange-300 font-bold">-4</td>
                          <td className="py-2 px-3 text-orange-300 font-bold">-3</td>
                          <td className="py-2 px-3">0</td>
                          <td className="py-2 px-3">5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-slate-400 mt-2">{t.tableNote}</p>
                </Box>

                <Box color="orange">
                  <p className="font-body text-sm"><strong>{t.tipsLabel}</strong> {t.tipsBody}</p>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={t.contohTitle} />
            {true && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={
                    language === "id"
                      ? <>Tentukan semua titik kunci dan arah grafik <InlineMath math="f(x) = x^2 - 4" /> untuk keperluan menggambar.</>
                      : language === "en"
                      ? <>Find all key points and the opening direction of the graph of <InlineMath math="f(x) = x^2 - 4" /> for graphing purposes.</>
                      : <>グラフを描くために <InlineMath math="f(x) = x^2 - 4" /> のすべての重要な点と開く方向を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>{t.step(1)} — Arah bukaan:</strong> <InlineMath math="a = 1 > 0" /> → terbuka ke <strong>atas</strong> ☝️</p>
                          <p><strong>{t.step(2)} — Titik potong sumbu-y:</strong> <InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                          <p><strong>{t.step(3)} — Titik potong sumbu-x</strong> (<InlineMath math="f(x) = 0" />):</p>
                          <Dark><BlockMath math={`x^2 = 4 \\implies x = \\pm 2 \\implies (-2,0) ${kAnd} (2,0)`} /></Dark>
                          <p><strong>{t.step(4)} — Titik puncak:</strong> <InlineMath math="x_p = 0" />, <InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                          <p>✅ Grafik berbentuk "U", puncak minimum di <InlineMath math="(0, -4)" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>{t.step(1)} — Opening direction:</strong> <InlineMath math="a = 1 > 0" /> → opens <strong>upward</strong> ☝️</p>
                          <p><strong>{t.step(2)} — y-intercept:</strong> <InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                          <p><strong>{t.step(3)} — x-intercepts</strong> (<InlineMath math="f(x) = 0" />):</p>
                          <Dark><BlockMath math={`x^2 = 4 \\implies x = \\pm 2 \\implies (-2,0) ${kAnd} (2,0)`} /></Dark>
                          <p><strong>{t.step(4)} — Vertex:</strong> <InlineMath math="x_p = 0" />, <InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                          <p>✅ U-shaped graph, minimum vertex at <InlineMath math="(0, -4)" /></p>
                        </>
                      : <>
                          <p><strong>{t.step(1)} — 開く方向：</strong> <InlineMath math="a = 1 > 0" /> → <strong>上</strong>に開く ☝️</p>
                          <p><strong>{t.step(2)} — y軸との交点：</strong> <InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                          <p><strong>{t.step(3)} — x軸との交点</strong>（<InlineMath math="f(x) = 0" />）：</p>
                          <Dark><BlockMath math={`x^2 = 4 \\implies x = \\pm 2 \\implies (-2,0) ${kAnd} (2,0)`} /></Dark>
                          <p><strong>{t.step(4)} — 頂点：</strong> <InlineMath math="x_p = 0" />、<InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                          <p>✅ U字型グラフ、最小頂点は <InlineMath math="(0, -4)" /></p>
                        </>
                  }
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "id"
                      ? <>Buatlah tabel nilai untuk <InlineMath math="f(x) = -x^2 + 2x + 3" /> dengan <InlineMath math="x \in \{-1, 0, 1, 2, 3\}" /> dan tentukan titik kuncinya.</>
                      : language === "en"
                      ? <>Create a value table for <InlineMath math="f(x) = -x^2 + 2x + 3" /> with <InlineMath math="x \in \{-1, 0, 1, 2, 3\}" /> and identify the key points.</>
                      : <><InlineMath math="f(x) = -x^2 + 2x + 3" /> について <InlineMath math="x \in \{-1, 0, 1, 2, 3\}" /> の値の表を作り、重要な点を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Hitung nilai f(x):</strong></p>
                          <Dark>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-center">
                                <thead><tr className="border-b border-slate-600"><th className="py-1 px-2 text-cyan-300">x</th><th className="px-2">-1</th><th className="px-2">0</th><th className="px-2 text-yellow-300">1</th><th className="px-2">2</th><th className="px-2">3</th></tr></thead>
                                <tbody><tr className="text-white/80"><td className="py-1 px-2 text-cyan-300">f(x)</td><td className="px-2">0</td><td className="px-2">3</td><td className="px-2 text-yellow-300 font-bold">4</td><td className="px-2">3</td><td className="px-2">0</td></tr></tbody>
                              </table>
                            </div>
                          </Dark>
                          <p>✅ Puncak maksimum di <InlineMath math="(1, 4)" />. Memotong sumbu-x di <InlineMath math="(-1, 0)" /> dan <InlineMath math="(3, 0)" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>Calculate f(x) values:</strong></p>
                          <Dark>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-center">
                                <thead><tr className="border-b border-slate-600"><th className="py-1 px-2 text-cyan-300">x</th><th className="px-2">-1</th><th className="px-2">0</th><th className="px-2 text-yellow-300">1</th><th className="px-2">2</th><th className="px-2">3</th></tr></thead>
                                <tbody><tr className="text-white/80"><td className="py-1 px-2 text-cyan-300">f(x)</td><td className="px-2">0</td><td className="px-2">3</td><td className="px-2 text-yellow-300 font-bold">4</td><td className="px-2">3</td><td className="px-2">0</td></tr></tbody>
                              </table>
                            </div>
                          </Dark>
                          <p>✅ Maximum vertex at <InlineMath math="(1, 4)" />. x-intercepts at <InlineMath math="(-1, 0)" /> and <InlineMath math="(3, 0)" /></p>
                        </>
                      : <>
                          <p><strong>f(x) の値を計算する：</strong></p>
                          <Dark>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-center">
                                <thead><tr className="border-b border-slate-600"><th className="py-1 px-2 text-cyan-300">x</th><th className="px-2">-1</th><th className="px-2">0</th><th className="px-2 text-yellow-300">1</th><th className="px-2">2</th><th className="px-2">3</th></tr></thead>
                                <tbody><tr className="text-white/80"><td className="py-1 px-2 text-cyan-300">f(x)</td><td className="px-2">0</td><td className="px-2">3</td><td className="px-2 text-yellow-300 font-bold">4</td><td className="px-2">3</td><td className="px-2">0</td></tr></tbody>
                              </table>
                            </div>
                          </Dark>
                          <p>✅ 最大頂点は <InlineMath math="(1, 4)" />。x軸交点は <InlineMath math="(-1, 0)" /> と <InlineMath math="(3, 0)" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "id"
                      ? <>Gambarkan (secara deskriptif) grafik <InlineMath math="f(x) = x^2 - 2x - 8" />. Sebutkan semua titik penting.</>
                      : language === "en"
                      ? <>Sketch (descriptively) the graph of <InlineMath math="f(x) = x^2 - 2x - 8" />. List all key points.</>
                      : <><InlineMath math="f(x) = x^2 - 2x - 8" /> のグラフを（記述的に）スケッチしなさい。すべての重要な点を述べなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Arah bukaan:</strong> <InlineMath math="a = 1 > 0" /> → ke atas.</p>
                          <p><strong>Titik potong sumbu-y:</strong> <InlineMath math="f(0) = -8" /> → <InlineMath math="(0,-8)" /></p>
                          <p><strong>Titik puncak:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{-2}{2} = 1,\quad f(1) = 1 - 2 - 8 = -9" /></Dark>
                          <p>Puncak minimum: <InlineMath math="(1, -9)" /></p>
                          <p><strong>Titik potong sumbu-x</strong> (<InlineMath math="f(x) = 0" />):</p>
                          <Dark><BlockMath math={`x^2 - 2x - 8 = (x-4)(x+2) = 0 \\implies x = 4 ${kOr} x = -2`} /></Dark>
                          <p>✅ Titik-titik kunci: <InlineMath math="(-2,0)" />, <InlineMath math="(0,-8)" />, <InlineMath math="(1,-9)" />, <InlineMath math="(4,0)" />. Sumbu simetri: <InlineMath math="x = 1" />.</p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>Opening direction:</strong> <InlineMath math="a = 1 > 0" /> → upward.</p>
                          <p><strong>y-intercept:</strong> <InlineMath math="f(0) = -8" /> → <InlineMath math="(0,-8)" /></p>
                          <p><strong>Vertex:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{-2}{2} = 1,\quad f(1) = 1 - 2 - 8 = -9" /></Dark>
                          <p>Minimum vertex: <InlineMath math="(1, -9)" /></p>
                          <p><strong>x-intercepts</strong> (<InlineMath math="f(x) = 0" />):</p>
                          <Dark><BlockMath math={`x^2 - 2x - 8 = (x-4)(x+2) = 0 \\implies x = 4 ${kOr} x = -2`} /></Dark>
                          <p>✅ Key points: <InlineMath math="(-2,0)" />, <InlineMath math="(0,-8)" />, <InlineMath math="(1,-9)" />, <InlineMath math="(4,0)" />. Axis of symmetry: <InlineMath math="x = 1" />.</p>
                        </>
                      : <>
                          <p><strong>開く方向：</strong> <InlineMath math="a = 1 > 0" /> → 上。</p>
                          <p><strong>y軸との交点：</strong> <InlineMath math="f(0) = -8" /> → <InlineMath math="(0,-8)" /></p>
                          <p><strong>頂点：</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{-2}{2} = 1,\quad f(1) = 1 - 2 - 8 = -9" /></Dark>
                          <p>最小頂点：<InlineMath math="(1, -9)" /></p>
                          <p><strong>x軸との交点</strong>（<InlineMath math="f(x) = 0" />）：</p>
                          <Dark><BlockMath math={`x^2 - 2x - 8 = (x-4)(x+2) = 0 \\implies x = 4 ${kOr} x = -2`} /></Dark>
                          <p>✅ 重要な点：<InlineMath math="(-2,0)" />、<InlineMath math="(0,-8)" />、<InlineMath math="(1,-9)" />、<InlineMath math="(4,0)" />。対称軸：<InlineMath math="x = 1" />。</p>
                        </>
                  }
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "id"
                      ? <>Grafik <InlineMath math="f(x) = 2x^2 - 4x + 5" /> tidak memotong sumbu-x. Tentukan semua titik kunci dan jelaskan posisi grafik terhadap sumbu-x.</>
                      : language === "en"
                      ? <>The graph of <InlineMath math="f(x) = 2x^2 - 4x + 5" /> does not intersect the x-axis. Find all key points and explain the graph's position relative to the x-axis.</>
                      : <><InlineMath math="f(x) = 2x^2 - 4x + 5" /> のグラフはx軸と交わりません。すべての重要な点を求め、グラフのx軸に対する位置を説明しなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Diskriminan:</strong> <InlineMath math="D = 16 - 40 = -24 < 0" /> → tidak memotong sumbu-x ✓</p>
                          <p><strong>Arah bukaan:</strong> <InlineMath math="a = 2 > 0" /> → ke atas → nilai minimum ada.</p>
                          <p><strong>Titik puncak:</strong></p>
                          <Dark><BlockMath math="x_p = 1,\quad f(1) = 2 - 4 + 5 = 3" /></Dark>
                          <p><strong>Titik potong sumbu-y:</strong> <InlineMath math="f(0) = 5" /> → <InlineMath math="(0, 5)" /></p>
                          <p>✅ Seluruh grafik berada <strong>di atas sumbu-x</strong> (<InlineMath math="f(x) > 0" /> untuk semua <InlineMath math="x" />), dengan titik terendah di <InlineMath math="(1, 3)" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>Discriminant:</strong> <InlineMath math="D = 16 - 40 = -24 < 0" /> → no x-intercepts ✓</p>
                          <p><strong>Opening direction:</strong> <InlineMath math="a = 2 > 0" /> → upward → has a minimum.</p>
                          <p><strong>Vertex:</strong></p>
                          <Dark><BlockMath math="x_p = 1,\quad f(1) = 2 - 4 + 5 = 3" /></Dark>
                          <p><strong>y-intercept:</strong> <InlineMath math="f(0) = 5" /> → <InlineMath math="(0, 5)" /></p>
                          <p>✅ The entire graph lies <strong>above the x-axis</strong> (<InlineMath math="f(x) > 0" /> for all <InlineMath math="x" />), with the lowest point at <InlineMath math="(1, 3)" /></p>
                        </>
                      : <>
                          <p><strong>判別式：</strong> <InlineMath math="D = 16 - 40 = -24 < 0" /> → x軸と交わらない ✓</p>
                          <p><strong>開く方向：</strong> <InlineMath math="a = 2 > 0" /> → 上 → 最小値あり。</p>
                          <p><strong>頂点：</strong></p>
                          <Dark><BlockMath math="x_p = 1,\quad f(1) = 2 - 4 + 5 = 3" /></Dark>
                          <p><strong>y軸との交点：</strong> <InlineMath math="f(0) = 5" /> → <InlineMath math="(0, 5)" /></p>
                          <p>✅ グラフ全体が<strong>x軸の上</strong>にある（すべての <InlineMath math="x" /> で <InlineMath math="f(x) > 0" />）、最低点は <InlineMath math="(1, 3)" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "id"
                      ? <>Sketsa grafik <InlineMath math="f(x) = -2x^2 + 8x - 6" />. Tentukan: titik potong kedua sumbu, titik puncak, sumbu simetri, dan interval di mana <InlineMath math="f(x) \geq 0" />.</>
                      : language === "en"
                      ? <>Sketch the graph of <InlineMath math="f(x) = -2x^2 + 8x - 6" />. Find: intercepts on both axes, vertex, axis of symmetry, and the interval where <InlineMath math="f(x) \geq 0" />.</>
                      : <><InlineMath math="f(x) = -2x^2 + 8x - 6" /> のグラフをスケッチしなさい。両軸との交点、頂点、対称軸、<InlineMath math="f(x) \geq 0" /> となる区間を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Titik potong sumbu-y:</strong> <InlineMath math="f(0) = -6" /> → <InlineMath math="(0,-6)" /></p>
                          <p><strong>Titik potong sumbu-x</strong> (<InlineMath math="f(x) = 0" />):</p>
                          <Dark><BlockMath math="-2x^2 + 8x - 6 = 0 \implies x^2 - 4x + 3 = 0 \implies (x-1)(x-3) = 0" /></Dark>
                          <p>Titik potong: <InlineMath math="(1, 0)" /> dan <InlineMath math="(3, 0)" /></p>
                          <p><strong>Titik puncak:</strong> <InlineMath math="x_p = 2" />, <InlineMath math="f(2) = -8 + 16 - 6 = 2" /> → <InlineMath math="(2, 2)" /> (maksimum)</p>
                          <p><strong>Sumbu simetri:</strong> <InlineMath math="x = 2" /></p>
                          <p>✅ <InlineMath math="f(x) \geq 0" /> pada interval <InlineMath math="1 \leq x \leq 3" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>y-intercept:</strong> <InlineMath math="f(0) = -6" /> → <InlineMath math="(0,-6)" /></p>
                          <p><strong>x-intercepts</strong> (<InlineMath math="f(x) = 0" />):</p>
                          <Dark><BlockMath math="-2x^2 + 8x - 6 = 0 \implies x^2 - 4x + 3 = 0 \implies (x-1)(x-3) = 0" /></Dark>
                          <p>Intercepts: <InlineMath math="(1, 0)" /> and <InlineMath math="(3, 0)" /></p>
                          <p><strong>Vertex:</strong> <InlineMath math="x_p = 2" />, <InlineMath math="f(2) = -8 + 16 - 6 = 2" /> → <InlineMath math="(2, 2)" /> (maximum)</p>
                          <p><strong>Axis of symmetry:</strong> <InlineMath math="x = 2" /></p>
                          <p>✅ <InlineMath math="f(x) \geq 0" /> on the interval <InlineMath math="1 \leq x \leq 3" /></p>
                        </>
                      : <>
                          <p><strong>y軸との交点：</strong> <InlineMath math="f(0) = -6" /> → <InlineMath math="(0,-6)" /></p>
                          <p><strong>x軸との交点</strong>（<InlineMath math="f(x) = 0" />）：</p>
                          <Dark><BlockMath math="-2x^2 + 8x - 6 = 0 \implies x^2 - 4x + 3 = 0 \implies (x-1)(x-3) = 0" /></Dark>
                          <p>交点：<InlineMath math="(1, 0)" /> と <InlineMath math="(3, 0)" /></p>
                          <p><strong>頂点：</strong> <InlineMath math="x_p = 2" />、<InlineMath math="f(2) = -8 + 16 - 6 = 2" /> → <InlineMath math="(2, 2)" />（最大）</p>
                          <p><strong>対称軸：</strong> <InlineMath math="x = 2" /></p>
                          <p>✅ <InlineMath math="f(x) \geq 0" /> となる区間：<InlineMath math="1 \leq x \leq 3" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "id"
                      ? <>Dua parabola: <InlineMath math="f(x) = x^2 - 4x + 3" /> dan <InlineMath math="g(x) = -x^2 + 2x + 3" />. Tentukan titik-titik potong antara kedua grafik tersebut.</>
                      : language === "en"
                      ? <>Two parabolas: <InlineMath math="f(x) = x^2 - 4x + 3" /> and <InlineMath math="g(x) = -x^2 + 2x + 3" />. Find the intersection points of the two graphs.</>
                      : <>2つの放物線：<InlineMath math="f(x) = x^2 - 4x + 3" /> と <InlineMath math="g(x) = -x^2 + 2x + 3" />。2つのグラフの交点を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> Dua grafik berpotongan saat <InlineMath math="f(x) = g(x)" />:</p>
                          <Dark><BlockMath math="x^2 - 4x + 3 = -x^2 + 2x + 3" /></Dark>
                          <Dark><BlockMath math="2x^2 - 6x = 0 \implies 2x(x - 3) = 0" /></Dark>
                          <p><InlineMath math="x = 0" /> atau <InlineMath math="x = 3" /></p>
                          <p><strong>{t.step(2)}:</strong> Hitung nilai y:</p>
                          <Dark>
                            <p className="text-sm"><InlineMath math="x = 0" />: <InlineMath math="f(0) = 3" /> → titik <InlineMath math="(0, 3)" /></p>
                            <p className="text-sm mt-1"><InlineMath math="x = 3" />: <InlineMath math="f(3) = 9-12+3 = 0" /> → titik <InlineMath math="(3, 0)" /></p>
                          </Dark>
                          <p>✅ Kedua grafik berpotongan di <InlineMath math="(0, 3)" /> dan <InlineMath math="(3, 0)" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> The two graphs intersect when <InlineMath math="f(x) = g(x)" />:</p>
                          <Dark><BlockMath math="x^2 - 4x + 3 = -x^2 + 2x + 3" /></Dark>
                          <Dark><BlockMath math="2x^2 - 6x = 0 \implies 2x(x - 3) = 0" /></Dark>
                          <p><InlineMath math="x = 0" /> or <InlineMath math="x = 3" /></p>
                          <p><strong>{t.step(2)}:</strong> Compute y values:</p>
                          <Dark>
                            <p className="text-sm"><InlineMath math="x = 0" />: <InlineMath math="f(0) = 3" /> → point <InlineMath math="(0, 3)" /></p>
                            <p className="text-sm mt-1"><InlineMath math="x = 3" />: <InlineMath math="f(3) = 9-12+3 = 0" /> → point <InlineMath math="(3, 0)" /></p>
                          </Dark>
                          <p>✅ The two graphs intersect at <InlineMath math="(0, 3)" /> and <InlineMath math="(3, 0)" /></p>
                        </>
                      : <>
                          <p><strong>{t.step(1)}:</strong> 2つのグラフは <InlineMath math="f(x) = g(x)" /> のとき交わる：</p>
                          <Dark><BlockMath math="x^2 - 4x + 3 = -x^2 + 2x + 3" /></Dark>
                          <Dark><BlockMath math="2x^2 - 6x = 0 \implies 2x(x - 3) = 0" /></Dark>
                          <p><InlineMath math="x = 0" /> または <InlineMath math="x = 3" /></p>
                          <p><strong>{t.step(2)}:</strong> y の値を計算する：</p>
                          <Dark>
                            <p className="text-sm"><InlineMath math="x = 0" />：<InlineMath math="f(0) = 3" /> → 点 <InlineMath math="(0, 3)" /></p>
                            <p className="text-sm mt-1"><InlineMath math="x = 3" />：<InlineMath math="f(3) = 9-12+3 = 0" /> → 点 <InlineMath math="(3, 0)" /></p>
                          </Dark>
                          <p>✅ 2つのグラフは <InlineMath math="(0, 3)" /> と <InlineMath math="(3, 0)" /> で交わる</p>
                        </>
                  }
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

export default MenggambarGrafikPage;
