import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const SumbuSimetriPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const t = {
    title:
      language === "id" ? "SUMBU SIMETRI & TITIK PUNCAK (OPTIMUM)"
      : language === "en" ? "AXIS OF SYMMETRY & VERTEX (OPTIMUM)"
      : "対称軸と頂点（最適値）",
    subtitle:
      language === "id" ? "Kelas 9 · Fungsi Kuadrat · Materi Matematika"
      : language === "en" ? "Grade 9 · Quadratic Function · Math Material"
      : "中学3年 · 二次関数 · 数学教材",
    backLabel:
      language === "id" ? "Kembali ke Fungsi Kuadrat"
      : language === "en" ? "Back to Quadratic Function"
      : "二次関数に戻る",

    introTitle:
      language === "id" ? "⭐ Jantung dari Sebuah Parabola!"
      : language === "en" ? "⭐ The Heart of a Parabola!"
      : "⭐ 放物線の中心！",
    introBox: (
      language === "id"
        ? <>Setiap parabola punya "jantung" yang bernama <strong>titik puncak (vertex)</strong> — titik tertinggi atau terendah pada grafik.
            Dan melewati titik puncak itu ada garis vertikal spesial yang disebut <strong>sumbu simetri</strong>,
            yang membagi parabola menjadi dua bagian yang sama persis seperti cermin 🪞.</>
        : language === "en"
        ? <>Every parabola has a "heart" called the <strong>vertex</strong> — the highest or lowest point on the graph.
            Through the vertex runs a special vertical line called the <strong>axis of symmetry</strong>,
            which divides the parabola into two mirror-image halves 🪞.</>
        : <>すべての放物線には「中心」があり、それが<strong>頂点（vertex）</strong>です — グラフの最高点または最低点。
            頂点を通る特別な垂直線を<strong>対称軸</strong>と呼び、放物線を鏡のような2つの等しい部分に分けます 🪞。</>
    ) as React.ReactNode,
    introPara: (
      language === "id"
        ? <>Bayangkan kamu melipat grafik parabola tepat di garis sumbu simetri — kedua sisi akan bertepatan sempurna!
            Titik puncak ini disebut juga <strong>titik optimum</strong> karena mewakili nilai maksimum atau minimum dari fungsi.</>
        : language === "en"
        ? <>Imagine folding the parabola graph exactly along the axis of symmetry — both sides will align perfectly!
            The vertex is also called the <strong>optimum point</strong> because it represents the maximum or minimum value of the function.</>
        : <>グラフを対称軸に沿って折り畳むと、両側がぴったり重なります！
            頂点は関数の最大値または最小値を表すため、<strong>最適点</strong>とも呼ばれます。</>
    ) as React.ReactNode,
    introNote: (
      language === "id"
        ? <><strong>💡 Ingat:</strong> Jika <InlineMath math="a > 0" /> → titik puncak adalah nilai <strong>minimum</strong>. Jika <InlineMath math="a < 0" /> → titik puncak adalah nilai <strong>maksimum</strong>.</>
        : language === "en"
        ? <><strong>💡 Remember:</strong> If <InlineMath math="a > 0" /> → the vertex is the <strong>minimum</strong> value. If <InlineMath math="a < 0" /> → the vertex is the <strong>maximum</strong> value.</>
        : <><strong>💡 覚えよう：</strong> <InlineMath math="a > 0" /> → 頂点は<strong>最小</strong>値。<InlineMath math="a < 0" /> → 頂点は<strong>最大</strong>値。</>
    ) as React.ReactNode,

    teoriTitle:
      language === "id" ? "📘 Rumus Sumbu Simetri & Titik Puncak"
      : language === "en" ? "📘 Axis of Symmetry & Vertex Formulas"
      : "📘 対称軸と頂点の公式",
    summaryTitle:
      language === "id" ? "🎯 Ringkasan Intisari"
      : language === "en" ? "🎯 Key Summary"
      : "🎯 要点まとめ",
    summaryFor:
      language === "id" ? "Untuk fungsi"
      : language === "en" ? "For the function"
      : "関数",
    axisLabel:
      language === "id" ? "Sumbu Simetri (persamaan garis):"
      : language === "en" ? "Axis of Symmetry (line equation):"
      : "対称軸（直線の方程式）：",
    vertexLabel:
      language === "id" ? "Koordinat Titik Puncak:"
      : language === "en" ? "Vertex Coordinates:"
      : "頂点の座標：",
    vertexAlt:
      language === "id" ? "atau menggunakan rumus langsung untuk koordinat-y puncak:"
      : language === "en" ? "or using the direct formula for the vertex y-coordinate:"
      : "または頂点のy座標の直接公式：",
    svgVertexLabel:
      language === "id" ? "Titik Puncak (xp, yp)"
      : language === "en" ? "Vertex (xp, yp)"
      : "頂点 (xp, yp)",
    svgAxisLabel:
      language === "id" ? "Sumbu Simetri"
      : language === "en" ? "Axis of Symmetry"
      : "対称軸",
    vizTitle:
      language === "id" ? "🎨 Visualisasi Titik Puncak:"
      : language === "en" ? "🎨 Vertex Visualization:"
      : "🎨 頂点の視覚化：",
    altTitle:
      language === "id" ? "🔑 Cara Alternatif: Melengkapi Kuadrat"
      : language === "en" ? "🔑 Alternative Method: Completing the Square"
      : "🔑 別の方法：平方完成",
    altDesc:
      language === "id" ? "Ubah ke bentuk vertex:"
      : language === "en" ? "Convert to vertex form:"
      : "頂点形に変換する：",
    altAxis:
      language === "id" ? "• Sumbu simetri:"
      : language === "en" ? "• Axis of symmetry:"
      : "• 対称軸：",
    altVertex:
      language === "id" ? "• Titik puncak:"
      : language === "en" ? "• Vertex:"
      : "• 頂点：",
    altOpt:
      language === "id" ? "• Nilai optimum:"
      : language === "en" ? "• Optimum value:"
      : "• 最適値：",

    contohTitle:
      language === "id" ? "📝 Contoh Soal — Sumbu Simetri & Titik Puncak"
      : language === "en" ? "📝 Worked Examples — Axis of Symmetry & Vertex"
      : "📝 例題 — 対称軸と頂点",
    exLabel: language === "id" ? "Contoh" : language === "en" ? "Example" : "例題",
    solLabel: language === "id" ? "📋 PEMBAHASAN:" : language === "en" ? "📋 SOLUTION:" : "📋 解答：",
    step: (n: number) =>
      language === "id" ? `Langkah ${n}` : language === "en" ? `Step ${n}` : `ステップ${n}`,
    levelLabel: (lv: "MUDAH" | "SEDANG" | "SULIT") =>
      language === "en" ? (lv === "MUDAH" ? "EASY" : lv === "SEDANG" ? "MEDIUM" : "HARD")
      : language === "ja" ? (lv === "MUDAH" ? "基本" : lv === "SEDANG" ? "標準" : "発展")
      : lv,
    minLabel: language === "id" ? "minimum" : language === "en" ? "minimum" : "最小",
    maxLabel: language === "id" ? "maksimum" : language === "en" ? "maximum" : "最大",
    axisSymLabel: language === "id" ? "Sumbu simetri" : language === "en" ? "Axis of symmetry" : "対称軸",
    vertexPtLabel: language === "id" ? "Titik puncak" : language === "en" ? "Vertex" : "頂点",
    yPeakLabel: language === "id" ? "Nilai y puncak" : language === "en" ? "Vertex y-value" : "頂点のy値",
    method1: language === "id" ? "Metode 1 — Titik puncak ada di sumbu-x artinya"
      : language === "en" ? "Method 1 — Vertex on x-axis means"
      : "方法1 — 頂点がx軸上にある、つまり",
  };

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
                  <p className="font-body text-sm">{t.introNote}</p>
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
                  <p className="font-body text-sm mb-2">{t.summaryFor} <InlineMath math="f(x) = ax^2 + bx + c" />:</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-body text-xs text-cyan-300 font-semibold">{t.axisLabel}</p>
                      <Dark><BlockMath math="x = -\frac{b}{2a}" /></Dark>
                    </div>
                    <div>
                      <p className="font-body text-xs text-green-300 font-semibold">{t.vertexLabel}</p>
                      <Dark><BlockMath math="\left(-\frac{b}{2a},\; f\!\left(-\frac{b}{2a}\right)\right)" /></Dark>
                      <p className="font-body text-xs text-white/70 mt-1">{t.vertexAlt}</p>
                      <Dark><BlockMath math="y_p = \frac{4ac - b^2}{4a} = -\frac{D}{4a}" /></Dark>
                    </div>
                  </div>
                </Box>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.vizTitle}</p>
                  <div className="flex justify-center">
                    <svg viewBox="0 0 200 130" className="w-full max-w-xs">
                      <defs>
                        <linearGradient id="axisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9"/>
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9"/>
                        </linearGradient>
                      </defs>
                      <line x1="10" y1="100" x2="190" y2="100" stroke="#ffffff30" strokeWidth="1"/>
                      <line x1="100" y1="10" x2="100" y2="120" stroke="#ffffff30" strokeWidth="1"/>
                      <path d="M 20 105 Q 100 20 180 105" stroke="url(#axisGrad)" strokeWidth="2.5" fill="none"/>
                      <line x1="100" y1="20" x2="100" y2="105" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4,3"/>
                      <circle cx="100" cy="20" r="4" fill="#facc15"/>
                      <text x="108" y="18" fontSize="9" fill="#facc15" fontFamily="monospace">{t.svgVertexLabel}</text>
                      <text x="104" y="112" fontSize="8" fill="#22d3ee" fontFamily="monospace">xp = -b/2a</text>
                      <text x="185" y="104" fontSize="8" fill="#ffffff60" fontFamily="monospace">x</text>
                      <text x="102" y="10" fontSize="8" fill="#ffffff60" fontFamily="monospace">y</text>
                      <text x="80" y="125" fontSize="8" fill="#facc1590" fontFamily="monospace">{t.svgAxisLabel}</text>
                    </svg>
                  </div>
                </Box>

                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.altTitle}</p>
                  <p className="font-body text-xs text-white/80">{t.altDesc} <InlineMath math="f(x) = a(x - h)^2 + k" /></p>
                  <ul className="mt-2 space-y-1 font-body text-xs text-white/70">
                    <li>{t.altAxis} <InlineMath math="x = h" /></li>
                    <li>{t.altVertex} <InlineMath math="(h, k)" /></li>
                    <li>{t.altOpt} <InlineMath math="k" /></li>
                  </ul>
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
                      ? <>Tentukan sumbu simetri dan titik puncak dari <InlineMath math="f(x) = x^2 - 6x + 5" />.</>
                      : language === "en"
                      ? <>Find the axis of symmetry and vertex of <InlineMath math="f(x) = x^2 - 6x + 5" />.</>
                      : <><InlineMath math="f(x) = x^2 - 6x + 5" /> の対称軸と頂点を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><InlineMath math="a = 1,\; b = -6,\; c = 5" /></p>
                          <p><strong>Sumbu simetri:</strong></p>
                          <Dark><BlockMath math="x = -\frac{b}{2a} = -\frac{-6}{2(1)} = 3" /></Dark>
                          <p><strong>Nilai y puncak:</strong></p>
                          <Dark><BlockMath math="f(3) = 9 - 18 + 5 = -4" /></Dark>
                          <p>✅ Sumbu simetri: <InlineMath math="x = 3" />, Titik puncak: <InlineMath math="(3, -4)" /> → nilai <strong>minimum</strong> = <InlineMath math="-4" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><InlineMath math="a = 1,\; b = -6,\; c = 5" /></p>
                          <p><strong>Axis of symmetry:</strong></p>
                          <Dark><BlockMath math="x = -\frac{b}{2a} = -\frac{-6}{2(1)} = 3" /></Dark>
                          <p><strong>Vertex y-value:</strong></p>
                          <Dark><BlockMath math="f(3) = 9 - 18 + 5 = -4" /></Dark>
                          <p>✅ Axis of symmetry: <InlineMath math="x = 3" />, Vertex: <InlineMath math="(3, -4)" /> → <strong>minimum</strong> value = <InlineMath math="-4" /></p>
                        </>
                      : <>
                          <p><InlineMath math="a = 1,\; b = -6,\; c = 5" /></p>
                          <p><strong>対称軸：</strong></p>
                          <Dark><BlockMath math="x = -\frac{b}{2a} = -\frac{-6}{2(1)} = 3" /></Dark>
                          <p><strong>頂点のy値：</strong></p>
                          <Dark><BlockMath math="f(3) = 9 - 18 + 5 = -4" /></Dark>
                          <p>✅ 対称軸：<InlineMath math="x = 3" />、頂点：<InlineMath math="(3, -4)" /> → <strong>最小</strong>値 = <InlineMath math="-4" /></p>
                        </>
                  }
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "id"
                      ? <>Tentukan titik puncak dan jenis optimumnya untuk <InlineMath math="g(x) = -2x^2 + 8x - 3" />.</>
                      : language === "en"
                      ? <>Find the vertex and type of optimum for <InlineMath math="g(x) = -2x^2 + 8x - 3" />.</>
                      : <><InlineMath math="g(x) = -2x^2 + 8x - 3" /> の頂点と最適値の種類を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><InlineMath math="a = -2,\; b = 8,\; c = -3" /></p>
                          <p><strong>Sumbu simetri:</strong></p>
                          <Dark><BlockMath math="x = -\frac{8}{2(-2)} = -\frac{8}{-4} = 2" /></Dark>
                          <p><strong>Nilai y puncak:</strong></p>
                          <Dark><BlockMath math="g(2) = -2(4) + 8(2) - 3 = -8 + 16 - 3 = 5" /></Dark>
                          <p>✅ Titik puncak: <InlineMath math="(2, 5)" />. Karena <InlineMath math="a = -2 < 0" /> → nilai <strong>maksimum</strong> = <InlineMath math="5" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><InlineMath math="a = -2,\; b = 8,\; c = -3" /></p>
                          <p><strong>Axis of symmetry:</strong></p>
                          <Dark><BlockMath math="x = -\frac{8}{2(-2)} = -\frac{8}{-4} = 2" /></Dark>
                          <p><strong>Vertex y-value:</strong></p>
                          <Dark><BlockMath math="g(2) = -2(4) + 8(2) - 3 = -8 + 16 - 3 = 5" /></Dark>
                          <p>✅ Vertex: <InlineMath math="(2, 5)" />. Since <InlineMath math="a = -2 < 0" /> → <strong>maximum</strong> value = <InlineMath math="5" /></p>
                        </>
                      : <>
                          <p><InlineMath math="a = -2,\; b = 8,\; c = -3" /></p>
                          <p><strong>対称軸：</strong></p>
                          <Dark><BlockMath math="x = -\frac{8}{2(-2)} = -\frac{8}{-4} = 2" /></Dark>
                          <p><strong>頂点のy値：</strong></p>
                          <Dark><BlockMath math="g(2) = -2(4) + 8(2) - 3 = -8 + 16 - 3 = 5" /></Dark>
                          <p>✅ 頂点：<InlineMath math="(2, 5)" />。<InlineMath math="a = -2 < 0" /> なので → <strong>最大</strong>値 = <InlineMath math="5" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "id"
                      ? <>Gunakan metode melengkapi kuadrat untuk menemukan titik puncak dari <InlineMath math="f(x) = 2x^2 - 4x + 7" />.</>
                      : language === "en"
                      ? <>Use the completing the square method to find the vertex of <InlineMath math="f(x) = 2x^2 - 4x + 7" />.</>
                      : <>平方完成を使って <InlineMath math="f(x) = 2x^2 - 4x + 7" /> の頂点を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> Faktorkan koefisien <InlineMath math="a" /> dari suku-suku dengan <InlineMath math="x" />:</p>
                          <Dark><BlockMath math="f(x) = 2(x^2 - 2x) + 7" /></Dark>
                          <p><strong>{t.step(2)}:</strong> Lengkapi kuadrat di dalam kurung. Setengah dari <InlineMath math="-2" /> adalah <InlineMath math="-1" />, kuadratnya <InlineMath math="1" />:</p>
                          <Dark><BlockMath math="f(x) = 2(x^2 - 2x + 1 - 1) + 7 = 2(x-1)^2 - 2 + 7" /></Dark>
                          <Dark><BlockMath math="f(x) = 2(x-1)^2 + 5" /></Dark>
                          <p>✅ Bentuk vertex: <InlineMath math="h = 1,\; k = 5" /> → Titik puncak <InlineMath math="(1, 5)" />, nilai <strong>minimum</strong> = <InlineMath math="5" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> Factor out coefficient <InlineMath math="a" /> from the <InlineMath math="x" />-terms:</p>
                          <Dark><BlockMath math="f(x) = 2(x^2 - 2x) + 7" /></Dark>
                          <p><strong>{t.step(2)}:</strong> Complete the square inside the brackets. Half of <InlineMath math="-2" /> is <InlineMath math="-1" />, squared is <InlineMath math="1" />:</p>
                          <Dark><BlockMath math="f(x) = 2(x^2 - 2x + 1 - 1) + 7 = 2(x-1)^2 - 2 + 7" /></Dark>
                          <Dark><BlockMath math="f(x) = 2(x-1)^2 + 5" /></Dark>
                          <p>✅ Vertex form: <InlineMath math="h = 1,\; k = 5" /> → Vertex <InlineMath math="(1, 5)" />, <strong>minimum</strong> value = <InlineMath math="5" /></p>
                        </>
                      : <>
                          <p><strong>{t.step(1)}:</strong> <InlineMath math="x" /> を含む項から係数 <InlineMath math="a" /> をくくり出す：</p>
                          <Dark><BlockMath math="f(x) = 2(x^2 - 2x) + 7" /></Dark>
                          <p><strong>{t.step(2)}:</strong> かっこ内を平方完成する。<InlineMath math="-2" /> の半分は <InlineMath math="-1" />、その2乗は <InlineMath math="1" />：</p>
                          <Dark><BlockMath math="f(x) = 2(x^2 - 2x + 1 - 1) + 7 = 2(x-1)^2 - 2 + 7" /></Dark>
                          <Dark><BlockMath math="f(x) = 2(x-1)^2 + 5" /></Dark>
                          <p>✅ 頂点形：<InlineMath math="h = 1,\; k = 5" /> → 頂点 <InlineMath math="(1, 5)" />、<strong>最小</strong>値 = <InlineMath math="5" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "id"
                      ? <>Parabola <InlineMath math="f(x) = ax^2 + bx + c" /> memiliki sumbu simetri <InlineMath math="x = -2" /> dan melalui titik <InlineMath math="(0, 3)" /> serta <InlineMath math="(-1, 0)" />. Tentukan nilai <InlineMath math="a, b, c" />.</>
                      : language === "en"
                      ? <>A parabola <InlineMath math="f(x) = ax^2 + bx + c" /> has axis of symmetry <InlineMath math="x = -2" /> and passes through <InlineMath math="(0, 3)" /> and <InlineMath math="(-1, 0)" />. Find <InlineMath math="a, b, c" />.</>
                      : <>放物線 <InlineMath math="f(x) = ax^2 + bx + c" /> は対称軸 <InlineMath math="x = -2" /> を持ち、点 <InlineMath math="(0, 3)" /> と <InlineMath math="(-1, 0)" /> を通る。<InlineMath math="a, b, c" /> を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Dari sumbu simetri:</strong> <InlineMath math="-\dfrac{b}{2a} = -2 \implies b = 4a" /></p>
                          <p><strong>Dari titik <InlineMath math="(0, 3)" />:</strong> <InlineMath math="c = 3" /></p>
                          <p><strong>Dari titik <InlineMath math="(-1, 0)" />:</strong></p>
                          <Dark><BlockMath math="a(-1)^2 + b(-1) + 3 = 0 \implies a - b + 3 = 0" /></Dark>
                          <p>Substitusi <InlineMath math="b = 4a" />: <InlineMath math="a - 4a + 3 = 0 \implies -3a = -3 \implies a = 1" /></p>
                          <p>Maka <InlineMath math="b = 4" /></p>
                          <p>✅ <InlineMath math="a = 1,\; b = 4,\; c = 3" /> → <InlineMath math="f(x) = x^2 + 4x + 3" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>From axis of symmetry:</strong> <InlineMath math="-\dfrac{b}{2a} = -2 \implies b = 4a" /></p>
                          <p><strong>From point <InlineMath math="(0, 3)" />:</strong> <InlineMath math="c = 3" /></p>
                          <p><strong>From point <InlineMath math="(-1, 0)" />:</strong></p>
                          <Dark><BlockMath math="a(-1)^2 + b(-1) + 3 = 0 \implies a - b + 3 = 0" /></Dark>
                          <p>Substitute <InlineMath math="b = 4a" />: <InlineMath math="a - 4a + 3 = 0 \implies -3a = -3 \implies a = 1" /></p>
                          <p>So <InlineMath math="b = 4" /></p>
                          <p>✅ <InlineMath math="a = 1,\; b = 4,\; c = 3" /> → <InlineMath math="f(x) = x^2 + 4x + 3" /></p>
                        </>
                      : <>
                          <p><strong>対称軸より：</strong> <InlineMath math="-\dfrac{b}{2a} = -2 \implies b = 4a" /></p>
                          <p><strong>点 <InlineMath math="(0, 3)" /> より：</strong> <InlineMath math="c = 3" /></p>
                          <p><strong>点 <InlineMath math="(-1, 0)" /> より：</strong></p>
                          <Dark><BlockMath math="a(-1)^2 + b(-1) + 3 = 0 \implies a - b + 3 = 0" /></Dark>
                          <p><InlineMath math="b = 4a" /> を代入：<InlineMath math="a - 4a + 3 = 0 \implies -3a = -3 \implies a = 1" /></p>
                          <p>よって <InlineMath math="b = 4" /></p>
                          <p>✅ <InlineMath math="a = 1,\; b = 4,\; c = 3" /> → <InlineMath math="f(x) = x^2 + 4x + 3" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "id"
                      ? <>Fungsi <InlineMath math="f(x) = 3x^2 + kx + (k+3)" /> memiliki nilai minimum <InlineMath math="= 0" />. Tentukan nilai <InlineMath math="k" /> yang mungkin.</>
                      : language === "en"
                      ? <>The function <InlineMath math="f(x) = 3x^2 + kx + (k+3)" /> has a minimum value of <InlineMath math="0" />. Find all possible values of <InlineMath math="k" />.</>
                      : <>関数 <InlineMath math="f(x) = 3x^2 + kx + (k+3)" /> の最小値が <InlineMath math="0" /> となる <InlineMath math="k" /> の値を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p>Nilai minimum terjadi saat <InlineMath math="D = 0" /> (parabola menyinggung sumbu-x):</p>
                          <Dark><BlockMath math="D = k^2 - 4(3)(k+3) = 0" /></Dark>
                          <Dark><BlockMath math="k^2 - 12k - 36 = 0" /></Dark>
                          <p>Gunakan rumus kuadratik:</p>
                          <Dark><BlockMath math="k = \frac{12 \pm \sqrt{144 + 144}}{2} = \frac{12 \pm 12\sqrt{2}}{2} = 6 \pm 6\sqrt{2}" /></Dark>
                          <p>✅ <InlineMath math="k = 6 + 6\sqrt{2}" /> atau <InlineMath math="k = 6 - 6\sqrt{2}" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p>The minimum value occurs when <InlineMath math="D = 0" /> (parabola is tangent to the x-axis):</p>
                          <Dark><BlockMath math="D = k^2 - 4(3)(k+3) = 0" /></Dark>
                          <Dark><BlockMath math="k^2 - 12k - 36 = 0" /></Dark>
                          <p>Apply the quadratic formula:</p>
                          <Dark><BlockMath math="k = \frac{12 \pm \sqrt{144 + 144}}{2} = \frac{12 \pm 12\sqrt{2}}{2} = 6 \pm 6\sqrt{2}" /></Dark>
                          <p>✅ <InlineMath math="k = 6 + 6\sqrt{2}" /> or <InlineMath math="k = 6 - 6\sqrt{2}" /></p>
                        </>
                      : <>
                          <p>最小値は <InlineMath math="D = 0" /> のとき（放物線がx軸に接する）：</p>
                          <Dark><BlockMath math="D = k^2 - 4(3)(k+3) = 0" /></Dark>
                          <Dark><BlockMath math="k^2 - 12k - 36 = 0" /></Dark>
                          <p>二次方程式の解の公式を使う：</p>
                          <Dark><BlockMath math="k = \frac{12 \pm \sqrt{144 + 144}}{2} = \frac{12 \pm 12\sqrt{2}}{2} = 6 \pm 6\sqrt{2}" /></Dark>
                          <p>✅ <InlineMath math="k = 6 + 6\sqrt{2}" /> または <InlineMath math="k = 6 - 6\sqrt{2}" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "id"
                      ? <>Diketahui <InlineMath math="f(x) = x^2 - 2px + (p^2 - p + 2)" />. Tentukan nilai <InlineMath math="p" /> agar titik puncaknya berada tepat di sumbu-x (nilai minimumnya = 0).</>
                      : language === "en"
                      ? <>Given <InlineMath math="f(x) = x^2 - 2px + (p^2 - p + 2)" />. Find the value of <InlineMath math="p" /> so that its vertex lies exactly on the x-axis (minimum value = 0).</>
                      : <><InlineMath math="f(x) = x^2 - 2px + (p^2 - p + 2)" /> の頂点がちょうどx軸上にある（最小値 = 0）ような <InlineMath math="p" /> の値を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Metode 1 — Titik puncak ada di sumbu-x artinya <InlineMath math="y_{\min} = 0" />:</strong></p>
                          <p>Gunakan <InlineMath math="y_p = -\dfrac{D}{4a} = 0 \implies D = 0" /></p>
                          <Dark><BlockMath math="D = (-2p)^2 - 4(1)(p^2 - p + 2) = 0" /></Dark>
                          <Dark><BlockMath math="4p^2 - 4p^2 + 4p - 8 = 0" /></Dark>
                          <Dark><BlockMath math="4p = 8 \implies p = 2" /></Dark>
                          <p>✅ Saat <InlineMath math="p = 2" />: <InlineMath math="f(x) = x^2 - 4x + 4 = (x-2)^2" />, puncak di <InlineMath math="(2, 0)" /> ✔</p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>Method 1 — Vertex on x-axis means <InlineMath math="y_{\min} = 0" />:</strong></p>
                          <p>Use <InlineMath math="y_p = -\dfrac{D}{4a} = 0 \implies D = 0" /></p>
                          <Dark><BlockMath math="D = (-2p)^2 - 4(1)(p^2 - p + 2) = 0" /></Dark>
                          <Dark><BlockMath math="4p^2 - 4p^2 + 4p - 8 = 0" /></Dark>
                          <Dark><BlockMath math="4p = 8 \implies p = 2" /></Dark>
                          <p>✅ When <InlineMath math="p = 2" />: <InlineMath math="f(x) = x^2 - 4x + 4 = (x-2)^2" />, vertex at <InlineMath math="(2, 0)" /> ✔</p>
                        </>
                      : <>
                          <p><strong>方法1 — 頂点がx軸上にある、つまり <InlineMath math="y_{\min} = 0" />：</strong></p>
                          <p><InlineMath math="y_p = -\dfrac{D}{4a} = 0 \implies D = 0" /> を使う</p>
                          <Dark><BlockMath math="D = (-2p)^2 - 4(1)(p^2 - p + 2) = 0" /></Dark>
                          <Dark><BlockMath math="4p^2 - 4p^2 + 4p - 8 = 0" /></Dark>
                          <Dark><BlockMath math="4p = 8 \implies p = 2" /></Dark>
                          <p>✅ <InlineMath math="p = 2" /> のとき：<InlineMath math="f(x) = x^2 - 4x + 4 = (x-2)^2" />、頂点は <InlineMath math="(2, 0)" /> ✔</p>
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

export default SumbuSimetriPage;
