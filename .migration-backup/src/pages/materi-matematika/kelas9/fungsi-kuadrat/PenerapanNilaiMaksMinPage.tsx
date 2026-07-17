import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import AngryBirdParabola from "@/components/AngryBirdParabola";
import { useLanguage } from "@/contexts/LanguageContext";

const PenerapanNilaiMaksMinPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "game", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const t = {
    title:
      language === "id" ? "PENERAPAN FUNGSI KUADRAT"
      : language === "en" ? "APPLICATIONS OF QUADRATIC FUNCTIONS"
      : "二次関数の応用",
    titleSub:
      language === "id" ? "Nilai Maksimum & Minimum"
      : language === "en" ? "Maximum & Minimum Values"
      : "最大値・最小値",
    subtitle:
      language === "id" ? "Kelas 9 · Fungsi Kuadrat · Materi Matematika"
      : language === "en" ? "Grade 9 · Quadratic Function · Math Material"
      : "中学3年 · 二次関数 · 数学教材",
    backLabel:
      language === "id" ? "Kembali ke Fungsi Kuadrat"
      : language === "en" ? "Back to Quadratic Function"
      : "二次関数に戻る",

    // ── Intro ──────────────────────────────────────────────────────────
    introTitle:
      language === "id" ? "🌍 Matematika yang Nyata di Dunia Nyata!"
      : language === "en" ? "🌍 Real Mathematics in the Real World!"
      : "🌍 現実世界の数学！",
    introBox: (
      language === "id"
        ? <>Fungsi kuadrat bukan hanya ada di buku pelajaran — ia hadir di mana-mana!
            Dari menghitung <strong>keuntungan maksimum</strong> suatu usaha, menentukan <strong>luas maksimum</strong> sebidang tanah,
            hingga menghitung <strong>ketinggian tertinggi</strong> bola yang dilempar ke atas 🚀.</>
        : language === "en"
        ? <>Quadratic functions aren't just in textbooks — they're everywhere!
            From calculating the <strong>maximum profit</strong> of a business, finding the <strong>maximum area</strong> of a plot of land,
            to computing the <strong>highest point</strong> of a ball thrown upward 🚀.</>
        : <>二次関数は教科書の中だけではありません — どこにでもあります！
            事業の<strong>最大利益</strong>の計算から、土地の<strong>最大面積</strong>の決定、
            さらには投げ上げたボールの<strong>最高点</strong>の計算まで 🚀。</>
    ) as React.ReactNode,
    introPara: (
      language === "id"
        ? <>Kunci dari penerapan ini adalah kemampuan kita menerjemahkan situasi nyata ke dalam
            <strong> model matematika</strong> berupa fungsi kuadrat, lalu mencari titik puncaknya
            (nilai optimum yang dicari — maksimum atau minimum).</>
        : language === "en"
        ? <>The key to these applications is our ability to translate real-world situations into a
            <strong> mathematical model</strong> in the form of a quadratic function, then find its vertex
            (the optimum value we seek — maximum or minimum).</>
        : <>これらの応用の鍵は、現実の状況を二次関数という<strong>数学モデル</strong>に変換し、
            その頂点（求める最適値 — 最大または最小）を見つける能力です。</>
    ) as React.ReactNode,
    keyStrategyLabel:
      language === "id" ? "💡 Strategi Utama:"
      : language === "en" ? "💡 Key Strategy:"
      : "💡 主な戦略：",
    keyStrategyBody: (
      language === "id"
        ? <>Nyatakan besaran yang ingin dioptimalkan sebagai fungsi kuadrat satu variabel, lalu cari titik puncaknya menggunakan <InlineMath math="x_p = -\dfrac{b}{2a}" />.</>
        : language === "en"
        ? <>Express the quantity to be optimized as a single-variable quadratic function, then find its vertex using <InlineMath math="x_p = -\dfrac{b}{2a}" />.</>
        : <>最適化したい量を1変数の二次関数で表し、<InlineMath math="x_p = -\dfrac{b}{2a}" /> を使って頂点を求めます。</>
    ) as React.ReactNode,

    // ── Game ───────────────────────────────────────────────────────────
    gameTitle:
      language === "id" ? "🐦 Simulasi: Angry Math Bird — Lintasan Parabola!"
      : language === "en" ? "🐦 Simulation: Angry Math Bird — Parabolic Path!"
      : "🐦 シミュレーション：Angry Math Bird — 放物線の軌跡！",
    gameDesc: (
      language === "id"
        ? <>Tarik burung pada ketapel dan lepaskan! Lintasannya mengikuti <strong className="text-orange-300">fungsi kuadrat h(x) = ax² + bx + c</strong>.
            Perhatikan bagaimana nilai <em>a</em>, <em>b</em>, <em>c</em> berubah tergantung sudut dan kekuatan lemparanmu.</>
        : language === "en"
        ? <>Pull the bird on the slingshot and release! Its path follows the <strong className="text-orange-300">quadratic function h(x) = ax² + bx + c</strong>.
            Watch how <em>a</em>, <em>b</em>, <em>c</em> change depending on the angle and power of your throw.</>
        : <>パチンコで鳥を引っ張って放しましょう！軌跡は<strong className="text-orange-300">二次関数 h(x) = ax² + bx + c</strong> に従います。
            投げる角度と力に応じて <em>a</em>、<em>b</em>、<em>c</em> がどう変わるか観察しましょう。</>
    ) as React.ReactNode,

    // ── Teori ──────────────────────────────────────────────────────────
    teoriTitle:
      language === "id" ? "📘 Langkah Penerapan & Rumus Optimum"
      : language === "en" ? "📘 Application Steps & Optimum Formulas"
      : "📘 応用手順と最適公式",
    summaryTitle:
      language === "id" ? "🎯 Ringkasan Intisari"
      : language === "en" ? "🎯 Key Summary"
      : "🎯 要点まとめ",
    steps: language === "id"
      ? [
          { no: "1", color: "text-cyan-300",   label: "Pahami situasi masalah",        desc: "Identifikasi variabel dan besaran yang dicari (maksimum/minimum)" },
          { no: "2", color: "text-green-300",  label: "Buat model fungsi kuadrat",     desc: "Nyatakan besaran yang dioptimalkan sebagai f(x) = ax² + bx + c" },
          { no: "3", color: "text-yellow-300", label: "Tentukan titik puncak",         desc: "Hitung xₚ = -b/2a dan yₚ = f(xₚ)" },
          { no: "4", color: "text-orange-300", label: "Interpretasikan hasil",         desc: "Kembalikan ke konteks masalah: apa arti xₚ dan yₚ?" },
        ]
      : language === "en"
      ? [
          { no: "1", color: "text-cyan-300",   label: "Understand the problem",        desc: "Identify the variable and the quantity to maximize/minimize" },
          { no: "2", color: "text-green-300",  label: "Build a quadratic model",       desc: "Express the optimized quantity as f(x) = ax² + bx + c" },
          { no: "3", color: "text-yellow-300", label: "Find the vertex",               desc: "Calculate xₚ = -b/2a and yₚ = f(xₚ)" },
          { no: "4", color: "text-orange-300", label: "Interpret the result",          desc: "Return to the problem context: what do xₚ and yₚ mean?" },
        ]
      : [
          { no: "1", color: "text-cyan-300",   label: "問題の状況を理解する",          desc: "変数と求める量（最大/最小）を特定する" },
          { no: "2", color: "text-green-300",  label: "二次関数モデルを作る",          desc: "最適化する量を f(x) = ax² + bx + c として表す" },
          { no: "3", color: "text-yellow-300", label: "頂点を求める",                  desc: "xₚ = -b/2a と yₚ = f(xₚ) を計算する" },
          { no: "4", color: "text-orange-300", label: "結果を解釈する",                desc: "問題の文脈に戻る：xₚ と yₚ は何を意味するか？" },
        ],
    minLabel:
      language === "id" ? "📈 Nilai Minimum"
      : language === "en" ? "📈 Minimum Value"
      : "📈 最小値",
    minDesc: (
      language === "id"
        ? <>Terjadi jika <InlineMath math="a > 0" /> (parabola terbuka ke atas)</>
        : language === "en"
        ? <>Occurs when <InlineMath math="a > 0" /> (parabola opens upward)</>
        : <><InlineMath math="a > 0" /> のとき（放物線が上に開く）</>
    ) as React.ReactNode,
    maxLabel:
      language === "id" ? "📉 Nilai Maksimum"
      : language === "en" ? "📉 Maximum Value"
      : "📉 最大値",
    maxDesc: (
      language === "id"
        ? <>Terjadi jika <InlineMath math="a < 0" /> (parabola terbuka ke bawah)</>
        : language === "en"
        ? <>Occurs when <InlineMath math="a < 0" /> (parabola opens downward)</>
        : <><InlineMath math="a < 0" /> のとき（放物線が下に開く）</>
    ) as React.ReactNode,
    realContextTitle:
      language === "id" ? "🌐 Konteks Nyata yang Sering Muncul:"
      : language === "en" ? "🌐 Common Real-World Contexts:"
      : "🌐 よく出る現実の文脈：",
    realContextItems: language === "id"
      ? [
          "🏗️ **Luas/Keliling:** optimasi bentuk persegi panjang dengan batasan keliling",
          "💰 **Keuntungan/Pendapatan:** model bisnis dengan biaya dan harga jual",
          "🎯 **Fisika:** ketinggian maksimum benda yang dilempar ke atas",
          "🌾 **Pertanian:** luas panen maksimum dengan pagar terbatas",
        ]
      : language === "en"
      ? [
          "🏗️ **Area/Perimeter:** optimizing a rectangle with a fixed perimeter",
          "💰 **Profit/Revenue:** business models with costs and selling price",
          "🎯 **Physics:** maximum height of an object thrown upward",
          "🌾 **Agriculture:** maximum harvest area with limited fencing",
        ]
      : [
          "🏗️ **面積・周長：** 周長が決まった長方形の最適化",
          "💰 **利益・収益：** コストと販売価格によるビジネスモデル",
          "🎯 **物理：** 投げ上げた物体の最高点",
          "🌾 **農業：** フェンスが限られた状態での最大収穫面積",
        ],

    // ── Contoh section labels ──────────────────────────────────────────
    contohTitle:
      language === "id" ? "📝 Contoh Soal — Penerapan Fungsi Kuadrat"
      : language === "en" ? "📝 Worked Examples — Applications of Max/Min Values"
      : "📝 例題 — 最大値・最小値の応用",
    exLabel: language === "id" ? "Contoh" : language === "en" ? "Example" : "例題",
    solLabel: language === "id" ? "📋 PEMBAHASAN:" : language === "en" ? "📋 SOLUTION:" : "📋 解答：",
    step: (n: number) =>
      language === "id" ? `Langkah ${n}` : language === "en" ? `Step ${n}` : `ステップ${n}`,
    levelLabel: (lv: "MUDAH" | "SEDANG" | "SULIT") =>
      language === "en" ? (lv === "MUDAH" ? "EASY" : lv === "SEDANG" ? "MEDIUM" : "HARD")
      : language === "ja" ? (lv === "MUDAH" ? "基本" : lv === "SEDANG" ? "標準" : "発展")
      : lv,
  };

  // ── KaTeX unit variables ───────────────────────────────────────────────
  const kSec =
    language === "id" ? "\\text{ detik}"
    : language === "en" ? "\\text{ seconds}"
    : "\\text{ 秒}";
  const kMeter =
    language === "id" ? "\\text{ meter}"
    : language === "en" ? "\\text{ m}"
    : "\\text{ m}";

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
        <p className="text-white/50 text-xs text-center mb-2 font-body">
          {t.titleSub}
        </p>
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
                  <p className="font-body text-sm"><strong>{t.keyStrategyLabel}</strong> {t.keyStrategyBody}</p>
                </Box>
              </div>
            )}
          </div>

          {/* ANGRY BIRD GAME */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="game" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title={t.gameTitle} />
            {true && (
              <div className="px-4 pb-5 space-y-3">
                <p className="font-body text-xs text-white/60 leading-relaxed">{t.gameDesc}</p>
                <AngryBirdParabola />
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
                    {t.steps.map(({ no, color, label, desc }) => (
                      <div key={no} className="flex gap-3 items-start">
                        <span className={`font-bold ${color} shrink-0`}>{no}.</span>
                        <div>
                          <p className={`font-body text-xs font-semibold ${color}`}>{label}</p>
                          <p className="font-body text-xs text-white/60">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-2">{t.minLabel}</p>
                    <p className="font-body text-xs text-white/70">{t.minDesc}</p>
                    <Dark><BlockMath math="y_{\min} = f\!\left(-\frac{b}{2a}\right) = \frac{4ac-b^2}{4a}" /></Dark>
                  </Box>
                  <Box color="red">
                    <p className="font-body text-xs font-bold text-red-300 mb-2">{t.maxLabel}</p>
                    <p className="font-body text-xs text-white/70">{t.maxDesc}</p>
                    <Dark><BlockMath math="y_{\max} = f\!\left(-\frac{b}{2a}\right) = \frac{4ac-b^2}{4a}" /></Dark>
                  </Box>
                </div>

                <Box color="blue">
                  <p className="font-body text-sm"><strong>{t.realContextTitle}</strong></p>
                  <ul className="mt-2 space-y-1 font-body text-xs text-white/70 list-none">
                    {t.realContextItems.map((item, i) => {
                      const parts = item.split("**");
                      return (
                        <li key={i}>
                          {parts[0]}<strong>{parts[1]}</strong>{parts[2]}
                        </li>
                      );
                    })}
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

                {/* ── Contoh 1 — Bola dilempar (kSec, kMeter) ───────────── */}
                <ExampleBlock level="MUDAH" no={1}
                  soal={
                    language === "id"
                      ? <>Sebuah bola dilempar ke atas. Ketinggiannya (dalam meter) dinyatakan dengan <InlineMath math="h(t) = -5t^2 + 20t + 2" />, di mana <InlineMath math="t" /> adalah waktu dalam detik. Tentukan ketinggian maksimum bola.</>
                      : language === "en"
                      ? <>A ball is thrown upward. Its height (in meters) is given by <InlineMath math="h(t) = -5t^2 + 20t + 2" />, where <InlineMath math="t" /> is time in seconds. Find the maximum height of the ball.</>
                      : <>ボールを上に投げる。高さ（メートル）は <InlineMath math="h(t) = -5t^2 + 20t + 2" /> で表され、<InlineMath math="t" /> は秒単位の時間である。ボールの最高点を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><InlineMath math="a = -5 < 0" /> → ada nilai maksimum ✅</p>
                          <p><strong>Waktu saat ketinggian maksimum:</strong></p>
                          <Dark><BlockMath math={`t_p = -\\frac{20}{2(-5)} = -\\frac{20}{-10} = 2${kSec}`} /></Dark>
                          <p><strong>Ketinggian maksimum:</strong></p>
                          <Dark><BlockMath math={`h(2) = -5(4) + 20(2) + 2 = -20 + 40 + 2 = 22${kMeter}`} /></Dark>
                          <p>✅ Ketinggian maksimum bola adalah <strong>22 meter</strong> yang dicapai pada <strong>t = 2 detik</strong>.</p>
                        </>
                      : language === "en"
                      ? <>
                          <p><InlineMath math="a = -5 < 0" /> → maximum value exists ✅</p>
                          <p><strong>Time at maximum height:</strong></p>
                          <Dark><BlockMath math={`t_p = -\\frac{20}{2(-5)} = -\\frac{20}{-10} = 2${kSec}`} /></Dark>
                          <p><strong>Maximum height:</strong></p>
                          <Dark><BlockMath math={`h(2) = -5(4) + 20(2) + 2 = -20 + 40 + 2 = 22${kMeter}`} /></Dark>
                          <p>✅ The maximum height of the ball is <strong>22 m</strong>, reached at <strong>t = 2 seconds</strong>.</p>
                        </>
                      : <>
                          <p><InlineMath math="a = -5 < 0" /> → 最大値が存在する ✅</p>
                          <p><strong>最高点に達する時刻：</strong></p>
                          <Dark><BlockMath math={`t_p = -\\frac{20}{2(-5)} = -\\frac{20}{-10} = 2${kSec}`} /></Dark>
                          <p><strong>最大高さ：</strong></p>
                          <Dark><BlockMath math={`h(2) = -5(4) + 20(2) + 2 = -20 + 40 + 2 = 22${kMeter}`} /></Dark>
                          <p>✅ ボールの最大高さは <strong>22 m</strong> で、<strong>t = 2 秒</strong>のときに達する。</p>
                        </>
                  }
                />

                {/* ── Contoh 2 — Kebun persegi panjang ─────────────────── */}
                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "id"
                      ? <>Sebuah kebun berbentuk persegi panjang dengan panjang <InlineMath math="(20 - x)" /> meter dan lebar <InlineMath math="x" /> meter. Tentukan nilai <InlineMath math="x" /> agar luasnya maksimum, dan berapa luas maksimumnya?</>
                      : language === "en"
                      ? <>A rectangular garden has length <InlineMath math="(20 - x)" /> meters and width <InlineMath math="x" /> meters. Find the value of <InlineMath math="x" /> that maximizes the area, and what is that maximum area?</>
                      : <>長方形の庭の長さは <InlineMath math="(20 - x)" /> メートル、幅は <InlineMath math="x" /> メートルである。面積を最大にする <InlineMath math="x" /> の値を求め、最大面積を答えなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Model fungsi luas:</strong></p>
                          <Dark><BlockMath math="L(x) = x(20 - x) = -x^2 + 20x" /></Dark>
                          <p><InlineMath math="a = -1 < 0" /> → ada nilai maksimum.</p>
                          <p><strong>Nilai x optimal:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{20}{2(-1)} = 10" /></Dark>
                          <p><strong>Luas maksimum:</strong></p>
                          <Dark><BlockMath math="L(10) = -(100) + 200 = 100 \text{ m}^2" /></Dark>
                          <p>✅ Luas maksimum <strong>100 m²</strong> saat panjang = lebar = <strong>10 m</strong> (berbentuk persegi!).</p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>Area function model:</strong></p>
                          <Dark><BlockMath math="A(x) = x(20 - x) = -x^2 + 20x" /></Dark>
                          <p><InlineMath math="a = -1 < 0" /> → maximum value exists.</p>
                          <p><strong>Optimal x:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{20}{2(-1)} = 10" /></Dark>
                          <p><strong>Maximum area:</strong></p>
                          <Dark><BlockMath math="A(10) = -(100) + 200 = 100 \text{ m}^2" /></Dark>
                          <p>✅ Maximum area is <strong>100 m²</strong> when length = width = <strong>10 m</strong> (a square!).</p>
                        </>
                      : <>
                          <p><strong>面積関数のモデル：</strong></p>
                          <Dark><BlockMath math="A(x) = x(20 - x) = -x^2 + 20x" /></Dark>
                          <p><InlineMath math="a = -1 < 0" /> → 最大値が存在する。</p>
                          <p><strong>最適な x：</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{20}{2(-1)} = 10" /></Dark>
                          <p><strong>最大面積：</strong></p>
                          <Dark><BlockMath math="A(10) = -(100) + 200 = 100 \text{ m}^2" /></Dark>
                          <p>✅ 最大面積は <strong>100 m²</strong>、長さ = 幅 = <strong>10 m</strong> のとき（正方形！）。</p>
                        </>
                  }
                />

                {/* ── Contoh 3 — Tiket konser (lokalisasi mata uang) ────── */}
                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "id"
                      ? <>Harga tiket konser: jika harga tiket <InlineMath math="x" /> ribu rupiah, maka jumlah penonton yang datang adalah <InlineMath math="(300 - 2x)" /> orang. Tentukan harga tiket agar pendapatan total maksimum.</>
                      : language === "en"
                      ? <>Concert ticket pricing: if the ticket price is <InlineMath math="\$x" />, the number of attendees is <InlineMath math="(300 - 2x)" /> people. Find the ticket price that maximizes total revenue.</>
                      : <>コンサートの料金設定：チケット1枚の価格が <InlineMath math="\$x" /> のとき、来場者数は <InlineMath math="(300 - 2x)" /> 人である。総収益を最大にするチケット価格を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Model pendapatan total:</strong></p>
                          <Dark><BlockMath math="P(x) = x \cdot (300 - 2x) = -2x^2 + 300x" /></Dark>
                          <p><InlineMath math="a = -2 < 0" /> → ada nilai maksimum.</p>
                          <p><strong>Harga tiket optimal:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{300}{2(-2)} = \frac{300}{4} = 75 \text{ ribu rupiah}" /></Dark>
                          <p><strong>Pendapatan maksimum:</strong></p>
                          <Dark><BlockMath math="P(75) = -2(5625) + 300(75) = -11250 + 22500 = 11250 \text{ ribu rupiah}" /></Dark>
                          <p>✅ Harga tiket optimal: <strong>Rp75.000</strong>, pendapatan maksimum: <strong>Rp11.250.000</strong></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>Total revenue model:</strong></p>
                          <Dark><BlockMath math="R(x) = x \cdot (300 - 2x) = -2x^2 + 300x" /></Dark>
                          <p><InlineMath math="a = -2 < 0" /> → maximum value exists.</p>
                          <p><strong>Optimal ticket price:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{300}{2(-2)} = \frac{300}{4} = \$75" /></Dark>
                          <p><strong>Maximum revenue:</strong></p>
                          <Dark><BlockMath math="R(75) = -2(5625) + 300(75) = -11250 + 22500 = \$11{,}250" /></Dark>
                          <p>✅ Optimal ticket price: <strong>$75</strong>, maximum revenue: <strong>$11,250</strong></p>
                        </>
                      : <>
                          <p><strong>総収益のモデル：</strong></p>
                          <Dark><BlockMath math="R(x) = x \cdot (300 - 2x) = -2x^2 + 300x" /></Dark>
                          <p><InlineMath math="a = -2 < 0" /> → 最大値が存在する。</p>
                          <p><strong>最適なチケット価格：</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{300}{2(-2)} = \frac{300}{4} = \$75" /></Dark>
                          <p><strong>最大収益：</strong></p>
                          <Dark><BlockMath math="R(75) = -2(5625) + 300(75) = -11250 + 22500 = \$11{,}250" /></Dark>
                          <p>✅ 最適チケット価格：<strong>$75</strong>、最大収益：<strong>$11,250</strong></p>
                        </>
                  }
                />

                {/* ── Contoh 4 — Petani & kawat pagar ──────────────────── */}
                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "id"
                      ? <>Seorang petani memiliki kawat pagar 60 m untuk memagari kebun berbentuk persegi panjang di tepi sungai (sisi yang berbatasan sungai tidak perlu dipagar). Tentukan dimensi agar luas kebun maksimum.</>
                      : language === "en"
                      ? <>A farmer has 60 m of fencing to enclose a rectangular garden along a river (the side along the river needs no fence). Find the dimensions that maximize the garden area.</>
                      : <>農家が60 mのフェンスで川沿いの長方形の庭を囲む（川に接する辺は不要）。面積を最大にする寸法を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p>Misal lebar kebun = <InlineMath math="x" /> m (tegak lurus sungai). Panjang kebun = <InlineMath math="(60 - 2x)" /> m.</p>
                          <p><strong>Syarat:</strong> <InlineMath math="x > 0" /> dan <InlineMath math="60 - 2x > 0 \implies x < 30" /></p>
                          <p><strong>Model luas:</strong></p>
                          <Dark><BlockMath math="L(x) = x(60 - 2x) = -2x^2 + 60x" /></Dark>
                          <p><strong>Lebar optimal:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{60}{2(-2)} = 15 \text{ m}" /></Dark>
                          <p><strong>Panjang:</strong> <InlineMath math="60 - 2(15) = 30" /> m</p>
                          <p><strong>Luas maksimum:</strong> <InlineMath math="15 \times 30 = 450 \text{ m}^2" /></p>
                          <p>✅ Dimensi optimal: <strong>15 m × 30 m</strong>, luas <strong>450 m²</strong></p>
                        </>
                      : language === "en"
                      ? <>
                          <p>Let width = <InlineMath math="x" /> m (perpendicular to river). Length = <InlineMath math="(60 - 2x)" /> m.</p>
                          <p><strong>Constraints:</strong> <InlineMath math="x > 0" /> and <InlineMath math="60 - 2x > 0 \implies x < 30" /></p>
                          <p><strong>Area model:</strong></p>
                          <Dark><BlockMath math="A(x) = x(60 - 2x) = -2x^2 + 60x" /></Dark>
                          <p><strong>Optimal width:</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{60}{2(-2)} = 15 \text{ m}" /></Dark>
                          <p><strong>Length:</strong> <InlineMath math="60 - 2(15) = 30" /> m</p>
                          <p><strong>Maximum area:</strong> <InlineMath math="15 \times 30 = 450 \text{ m}^2" /></p>
                          <p>✅ Optimal dimensions: <strong>15 m × 30 m</strong>, area <strong>450 m²</strong></p>
                        </>
                      : <>
                          <p>幅を <InlineMath math="x" /> m（川に垂直）とする。長さ = <InlineMath math="(60 - 2x)" /> m。</p>
                          <p><strong>制約条件：</strong> <InlineMath math="x > 0" /> かつ <InlineMath math="60 - 2x > 0 \implies x < 30" /></p>
                          <p><strong>面積のモデル：</strong></p>
                          <Dark><BlockMath math="A(x) = x(60 - 2x) = -2x^2 + 60x" /></Dark>
                          <p><strong>最適な幅：</strong></p>
                          <Dark><BlockMath math="x_p = -\frac{60}{2(-2)} = 15 \text{ m}" /></Dark>
                          <p><strong>長さ：</strong> <InlineMath math="60 - 2(15) = 30" /> m</p>
                          <p><strong>最大面積：</strong> <InlineMath math="15 \times 30 = 450 \text{ m}^2" /></p>
                          <p>✅ 最適寸法：<strong>15 m × 30 m</strong>、面積 <strong>450 m²</strong></p>
                        </>
                  }
                />

                {/* ── Contoh 5 — Peluru (kSec, kMeter) ─────────────────── */}
                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "id"
                      ? <>Sebuah peluru ditembakkan dengan ketinggian <InlineMath math="h(t) = -4t^2 + 32t" /> meter. Tentukan: (a) ketinggian maksimum, (b) waktu saat peluru kembali ke tanah, (c) total waktu di udara.</>
                      : language === "en"
                      ? <>A projectile is launched with height <InlineMath math="h(t) = -4t^2 + 32t" /> meters. Find: (a) maximum height, (b) time when the projectile returns to the ground, (c) total time in the air.</>
                      : <>発射体の高さ（メートル）は <InlineMath math="h(t) = -4t^2 + 32t" /> で与えられる。(a) 最大高さ、(b) 地面に戻る時刻、(c) 空中にいる合計時間を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>(a) Ketinggian maksimum:</strong></p>
                          <Dark><BlockMath math={`t_p = -\\frac{32}{2(-4)} = 4${kSec}`} /></Dark>
                          <Dark><BlockMath math={`h(4) = -4(16) + 32(4) = -64 + 128 = 64${kMeter}`} /></Dark>
                          <p><strong>(b) Saat kembali ke tanah:</strong> <InlineMath math="h(t) = 0" /></p>
                          <Dark><BlockMath math="-4t^2 + 32t = 0 \implies -4t(t - 8) = 0" /></Dark>
                          <p><InlineMath math="t = 0" /> (saat ditembak) atau <InlineMath math="t = 8" /> detik (saat mendarat)</p>
                          <p><strong>(c) Total waktu di udara: 8 detik</strong></p>
                          <p>✅ Ketinggian maks: <strong>64 m</strong> pada t = 4s. Mendarat saat <strong>t = 8 detik</strong>.</p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>(a) Maximum height:</strong></p>
                          <Dark><BlockMath math={`t_p = -\\frac{32}{2(-4)} = 4${kSec}`} /></Dark>
                          <Dark><BlockMath math={`h(4) = -4(16) + 32(4) = -64 + 128 = 64${kMeter}`} /></Dark>
                          <p><strong>(b) When it returns to the ground:</strong> <InlineMath math="h(t) = 0" /></p>
                          <Dark><BlockMath math="-4t^2 + 32t = 0 \implies -4t(t - 8) = 0" /></Dark>
                          <p><InlineMath math="t = 0" /> (launched) or <InlineMath math="t = 8" /> seconds (lands)</p>
                          <p><strong>(c) Total time in the air: 8 seconds</strong></p>
                          <p>✅ Max height: <strong>64 m</strong> at t = 4 s. Lands at <strong>t = 8 seconds</strong>.</p>
                        </>
                      : <>
                          <p><strong>(a) 最大高さ：</strong></p>
                          <Dark><BlockMath math={`t_p = -\\frac{32}{2(-4)} = 4${kSec}`} /></Dark>
                          <Dark><BlockMath math={`h(4) = -4(16) + 32(4) = -64 + 128 = 64${kMeter}`} /></Dark>
                          <p><strong>(b) 地面に戻る時刻：</strong> <InlineMath math="h(t) = 0" /></p>
                          <Dark><BlockMath math="-4t^2 + 32t = 0 \implies -4t(t - 8) = 0" /></Dark>
                          <p><InlineMath math="t = 0" />（発射時）または <InlineMath math="t = 8" /> 秒（着地時）</p>
                          <p><strong>(c) 空中にいる合計時間：8 秒</strong></p>
                          <p>✅ 最大高さ：<strong>64 m</strong>（t = 4 s）。着地時刻：<strong>t = 8 秒</strong>。</p>
                        </>
                  }
                />

                {/* ── Contoh 6 — Toko profit (lokalisasi mata uang) ─────── */}
                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "id"
                      ? <>Sebuah toko menjual <InlineMath math="(100 - 2p)" /> unit produk per hari jika harga satuan <InlineMath math="p" /> ribu rupiah. Biaya produksi per unit adalah 10 ribu rupiah dan biaya tetap per hari 200 ribu rupiah. Tentukan harga jual <InlineMath math="p" /> agar keuntungan harian maksimum dan berapa keuntungan maksimumnya.</>
                      : language === "en"
                      ? <>A store sells <InlineMath math="(100 - 2p)" /> units per day when the unit price is <InlineMath math="\$p" />. Production cost is <InlineMath math="\$10" /> per unit and fixed daily cost is <InlineMath math="\$200" />. Find the selling price <InlineMath math="p" /> that maximizes daily profit, and what is the maximum profit?</>
                      : <>ある店が1個あたり <InlineMath math="\$p" /> で販売するとき、1日 <InlineMath math="(100 - 2p)" /> 個売れる。生産コストは1個あたり <InlineMath math="\$10" />、1日の固定費は <InlineMath math="\$200" /> である。1日の利益を最大にする価格 <InlineMath math="p" /> と最大利益を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>Jumlah unit terjual:</strong> <InlineMath math="n = 100 - 2p" /></p>
                          <p><strong>Pendapatan total:</strong> <InlineMath math="R = p \cdot n = p(100 - 2p) = -2p^2 + 100p" /></p>
                          <p><strong>Biaya total:</strong> <InlineMath math="C = 10n + 200 = 10(100-2p) + 200 = 1200 - 20p" /></p>
                          <p><strong>Keuntungan:</strong></p>
                          <Dark><BlockMath math="\pi(p) = R - C = -2p^2 + 100p - 1200 + 20p = -2p^2 + 120p - 1200" /></Dark>
                          <p><strong>Harga optimal:</strong></p>
                          <Dark><BlockMath math="p_p = -\frac{120}{2(-2)} = 30 \text{ ribu rupiah}" /></Dark>
                          <p><strong>Keuntungan maksimum:</strong></p>
                          <Dark><BlockMath math="\pi(30) = -2(900) + 120(30) - 1200 = -1800 + 3600 - 1200 = 600 \text{ ribu rupiah}" /></Dark>
                          <p>✅ Harga jual optimal: <strong>Rp30.000/unit</strong>. Keuntungan maksimum: <strong>Rp600.000/hari</strong></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>Units sold:</strong> <InlineMath math="n = 100 - 2p" /></p>
                          <p><strong>Total revenue:</strong> <InlineMath math="R = p \cdot n = p(100 - 2p) = -2p^2 + 100p" /></p>
                          <p><strong>Total cost:</strong> <InlineMath math="C = 10n + 200 = 10(100-2p) + 200 = 1200 - 20p" /></p>
                          <p><strong>Profit:</strong></p>
                          <Dark><BlockMath math="\pi(p) = R - C = -2p^2 + 100p - 1200 + 20p = -2p^2 + 120p - 1200" /></Dark>
                          <p><strong>Optimal price:</strong></p>
                          <Dark><BlockMath math="p_p = -\frac{120}{2(-2)} = \$30" /></Dark>
                          <p><strong>Maximum profit:</strong></p>
                          <Dark><BlockMath math="\pi(30) = -2(900) + 120(30) - 1200 = -1800 + 3600 - 1200 = \$600" /></Dark>
                          <p>✅ Optimal selling price: <strong>$30/unit</strong>. Maximum daily profit: <strong>$600/day</strong></p>
                        </>
                      : <>
                          <p><strong>販売数：</strong> <InlineMath math="n = 100 - 2p" /></p>
                          <p><strong>総収益：</strong> <InlineMath math="R = p \cdot n = p(100 - 2p) = -2p^2 + 100p" /></p>
                          <p><strong>総コスト：</strong> <InlineMath math="C = 10n + 200 = 10(100-2p) + 200 = 1200 - 20p" /></p>
                          <p><strong>利益：</strong></p>
                          <Dark><BlockMath math="\pi(p) = R - C = -2p^2 + 100p - 1200 + 20p = -2p^2 + 120p - 1200" /></Dark>
                          <p><strong>最適価格：</strong></p>
                          <Dark><BlockMath math="p_p = -\frac{120}{2(-2)} = \$30" /></Dark>
                          <p><strong>最大利益：</strong></p>
                          <Dark><BlockMath math="\pi(30) = -2(900) + 120(30) - 1200 = -1800 + 3600 - 1200 = \$600" /></Dark>
                          <p>✅ 最適販売価格：<strong>$30/個</strong>。1日の最大利益：<strong>$600/日</strong></p>
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

export default PenerapanNilaiMaksMinPage;
