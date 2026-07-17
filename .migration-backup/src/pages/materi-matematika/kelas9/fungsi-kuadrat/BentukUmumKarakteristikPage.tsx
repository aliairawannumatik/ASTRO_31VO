import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const BentukUmumKarakteristikPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const t = {
    title:
      language === "id" ? "BENTUK UMUM & KARAKTERISTIK GRAFIK"
      : language === "en" ? "GENERAL FORM & GRAPH CHARACTERISTICS"
      : "一般形とグラフの特徴",
    subtitle:
      language === "id" ? "Kelas 9 · Fungsi Kuadrat · Materi Matematika"
      : language === "en" ? "Grade 9 · Quadratic Function · Math Material"
      : "中学3年 · 二次関数 · 数学教材",
    backLabel:
      language === "id" ? "Kembali ke Fungsi Kuadrat"
      : language === "en" ? "Back to Quadratic Function"
      : "二次関数に戻る",

    introTitle:
      language === "id" ? "🚀 Fungsi Kuadrat — Si Parabola Luar Angkasa!"
      : language === "en" ? "🚀 Quadratic Function — The Cosmic Parabola!"
      : "🚀 二次関数 — 宇宙のパラボラ！",
    introBox: (
      language === "id"
        ? <>Pernah lihat lintasan bola yang dilempar ke udara? Atau bentuk jembatan gantung yang melengkung indah?
            Semua itu adalah contoh nyata dari <strong>fungsi kuadrat</strong> — sebuah fungsi yang menghasilkan kurva mulus bernama <strong>parabola</strong> 🌙.</>
        : language === "en"
        ? <>Ever seen the path of a thrown ball? Or the graceful curve of a suspension bridge?
            These are all real examples of a <strong>quadratic function</strong> — a function that produces a smooth curve called a <strong>parabola</strong> 🌙.</>
        : <>ボールが空を飛ぶ軌跡や、吊り橋の美しい曲線を見たことがありますか？
            これらはすべて<strong>二次関数</strong>の実例です — <strong>放物線</strong>と呼ばれる滑らかな曲線を描く関数です 🌙。</>
    ) as React.ReactNode,
    introPara: (
      language === "id"
        ? <>Berbeda dengan persamaan kuadrat yang kita cari solusinya (titik potong sumbu-x), fungsi kuadrat
            menggambarkan <strong>hubungan antara input dan output</strong> secara keseluruhan — menghasilkan sebuah kurva yang bisa kita pelajari bentuk dan sifatnya.</>
        : language === "en"
        ? <>Unlike a quadratic equation where we find solutions (x-intercepts), a quadratic function describes the
            <strong> relationship between input and output</strong> as a whole — producing a curve whose shape and properties we can study.</>
        : <>解を求める二次方程式（x軸との交点を探す）とは異なり、二次関数は
            <strong>入力と出力の関係</strong>を全体として表します — 形と性質を学べる曲線を生み出します。</>
    ) as React.ReactNode,
    keyDiffTitle:
      language === "id" ? "💡 Perbedaan Kunci:"
      : language === "en" ? "💡 Key Difference:"
      : "💡 重要な違い：",
    keyDiffBody: (
      language === "id"
        ? <>Persamaan kuadrat → mencari nilai <InlineMath math="x" /> saat <InlineMath math="y = 0" />.
            Fungsi kuadrat → memetakan setiap nilai <InlineMath math="x" /> ke nilai <InlineMath math="y" /> tertentu.</>
        : language === "en"
        ? <>Quadratic equation → finding <InlineMath math="x" /> when <InlineMath math="y = 0" />.
            Quadratic function → mapping every <InlineMath math="x" /> to a specific <InlineMath math="y" /> value.</>
        : <>二次方程式 → <InlineMath math="y = 0" /> のとき <InlineMath math="x" /> を求める。
            二次関数 → すべての <InlineMath math="x" /> の値を特定の <InlineMath math="y" /> の値に対応させる。</>
    ) as React.ReactNode,

    teoriTitle:
      language === "id" ? "📘 Bentuk Umum & Karakteristik Grafik"
      : language === "en" ? "📘 General Form & Graph Characteristics"
      : "📘 一般形とグラフの特徴",
    summaryTitle:
      language === "id" ? "🎯 Ringkasan Intisari"
      : language === "en" ? "🎯 Key Summary"
      : "🎯 要点まとめ",
    summaryDesc:
      language === "id" ? "Bentuk umum fungsi kuadrat adalah:"
      : language === "en" ? "The general form of a quadratic function is:"
      : "二次関数の一般形は：",
    summaryNote: (
      language === "id"
        ? <>di mana <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> adalah konstanta real dan <InlineMath math="a \neq 0" />.</>
        : language === "en"
        ? <>where <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> are real constants and <InlineMath math="a \neq 0" />.</>
        : <><InlineMath math="a" />、<InlineMath math="b" />、<InlineMath math="c" /> は実数定数で <InlineMath math="a \neq 0" />。</>
    ) as React.ReactNode,
    charTitle:
      language === "id" ? "⭐ Karakteristik Berdasarkan Nilai"
      : language === "en" ? "⭐ Characteristics Based on Value of"
      : "⭐ 値による特徴",
    aPosLabel:
      language === "id" ? "📈 Jika" : language === "en" ? "📈 If" : "📈 の場合",
    aNegLabel:
      language === "id" ? "📉 Jika" : language === "en" ? "📉 If" : "📉 の場合",
    svgUp:
      language === "id" ? "Terbuka ke Atas ↑"
      : language === "en" ? "Opens Upward ↑"
      : "上に開く ↑",
    svgDown:
      language === "id" ? "Terbuka ke Bawah ↓"
      : language === "en" ? "Opens Downward ↓"
      : "下に開く ↓",
    aPosDesc: (
      language === "id"
        ? <>Parabola terbuka ke <strong>atas</strong>. Titik puncak adalah nilai <strong>minimum</strong>.</>
        : language === "en"
        ? <>Parabola opens <strong>upward</strong>. The vertex is the <strong>minimum</strong> value.</>
        : <>放物線は<strong>上</strong>に開きます。頂点は<strong>最小</strong>値です。</>
    ) as React.ReactNode,
    aNegDesc: (
      language === "id"
        ? <>Parabola terbuka ke <strong>bawah</strong>. Titik puncak adalah nilai <strong>maksimum</strong>.</>
        : language === "en"
        ? <>Parabola opens <strong>downward</strong>. The vertex is the <strong>maximum</strong> value.</>
        : <>放物線は<strong>下</strong>に開きます。頂点は<strong>最大</strong>値です。</>
    ) as React.ReactNode,
    tableTitle:
      language === "id" ? "📊 PENGARUH KOEFISIEN TERHADAP GRAFIK:"
      : language === "en" ? "📊 EFFECT OF COEFFICIENTS ON THE GRAPH:"
      : "📊 係数がグラフに与える影響：",
    tableH1:
      language === "id" ? "Koefisien" : language === "en" ? "Coefficient" : "係数",
    tableH2:
      language === "id" ? "Pengaruh pada Grafik" : language === "en" ? "Effect on Graph" : "グラフへの影響",
    tableR1: (
      language === "id" ? <>Parabola lebih <strong>sempit/lancip</strong></>
      : language === "en" ? <>Parabola is <strong>narrower/steeper</strong></>
      : <>放物線は<strong>より細く/急</strong>になる</>
    ) as React.ReactNode,
    tableR2: (
      language === "id" ? <>Parabola lebih <strong>lebar/landai</strong></>
      : language === "en" ? <>Parabola is <strong>wider/flatter</strong></>
      : <>放物線は<strong>より広く/緩やか</strong>になる</>
    ) as React.ReactNode,
    tableR3: (
      language === "id" ? <>Titik potong grafik dengan <strong>sumbu-y</strong> di <InlineMath math="(0, c)" /></>
      : language === "en" ? <>Graph y-intercept at <InlineMath math="(0, c)" /></>
      : <>グラフの<strong>y軸</strong>との交点は <InlineMath math="(0, c)" /></>
    ) as React.ReactNode,
    tableR4: (
      language === "id" ? <>Mempengaruhi posisi <strong>sumbu simetri</strong></>
      : language === "en" ? <>Affects the position of the <strong>axis of symmetry</strong></>
      : <><strong>対称軸</strong>の位置に影響する</>
    ) as React.ReactNode,
    propTitle:
      language === "id" ? "🔑 Sifat-Sifat Penting Parabola"
      : language === "en" ? "🔑 Key Properties of a Parabola"
      : "🔑 放物線の重要な性質",
    prop1: (
      language === "id" ? <>🪐 <strong>Simetris</strong> terhadap garis vertikal yang disebut sumbu simetri</>
      : language === "en" ? <>🪐 <strong>Symmetric</strong> about a vertical line called the axis of symmetry</>
      : <>🪐 対称軸と呼ばれる垂直線に対して<strong>対称</strong>です</>
    ) as React.ReactNode,
    prop2: (
      language === "id" ? <>🌟 Punya satu titik <strong>ekstrem</strong> (puncak/minimum atau maksimum)</>
      : language === "en" ? <>🌟 Has one <strong>extreme point</strong> (vertex/minimum or maximum)</>
      : <>🌟 一つの<strong>極値点</strong>（頂点/最小または最大）があります</>
    ) as React.ReactNode,
    prop3: (
      language === "id" ? <>🚀 Domain fungsi: semua bilangan real <InlineMath math="(\mathbb{R})" /></>
      : language === "en" ? <>🚀 Domain of the function: all real numbers <InlineMath math="(\mathbb{R})" /></>
      : <>🚀 関数の定義域：すべての実数 <InlineMath math="(\mathbb{R})" /></>
    ) as React.ReactNode,
    prop4: (
      language === "id" ? <>🌙 Range tergantung pada nilai <InlineMath math="a" /> dan titik puncak</>
      : language === "en" ? <>🌙 Range depends on the value of <InlineMath math="a" /> and the vertex</>
      : <>🌙 値域は <InlineMath math="a" /> の値と頂点によって決まります</>
    ) as React.ReactNode,

    contohTitle:
      language === "id" ? "📝 Contoh Soal — Bentuk Umum & Karakteristik"
      : language === "en" ? "📝 Worked Examples — General Form & Characteristics"
      : "📝 例題 — 一般形と特徴",
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
    upLabel: language === "id" ? "atas" : language === "en" ? "upward" : "上",
    downLabel: language === "id" ? "bawah" : language === "en" ? "downward" : "下",
    narrowLabel: language === "id" ? "sempit/lancip" : language === "en" ? "narrower" : "細く/急",
    wideLabel: language === "id" ? "lebar/landai" : language === "en" ? "wider" : "広く/緩やか",
    yIntercept: language === "id" ? "sumbu-y" : language === "en" ? "y-axis" : "y軸",
    axisSym: language === "id" ? "sumbu simetri" : language === "en" ? "axis of symmetry" : "対称軸",
    reflection: language === "id" ? "pencerminan grafik" : language === "en" ? "reflection of graph" : "グラフの反転",
    xAxisRef: language === "id" ? "terhadap sumbu-x" : language === "en" ? "over the x-axis" : "x軸に対して",
    identicalOpp: language === "id" ? "identik tetapi saling berkebalikan arah (simetri terhadap sumbu-x)"
      : language === "en" ? "identical but opposite in direction (symmetric about the x-axis)"
      : "形は同じだが向きが逆（x軸に対して対称）",
  };

  // kAnd: language-adaptive conjunction for KaTeX
  const kAnd =
    language === "id" ? "\\text{dan}"
    : language === "en" ? "\\text{and}"
    : "\\text{と}";

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
                  <p className="font-body text-sm"><strong>{t.keyDiffTitle}</strong> {t.keyDiffBody}</p>
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
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.summaryTitle}</p>
                  <p className="font-body text-sm mb-2">{t.summaryDesc}</p>
                  <Dark><BlockMath math="f(x) = ax^2 + bx + c, \quad a \neq 0" /></Dark>
                  <p className="font-body text-xs text-purple-200">{t.summaryNote}</p>
                </Box>

                <p className="font-body text-sm text-white/80 font-semibold">⭐ {t.charTitle} <InlineMath math="a" />:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-2">{t.aPosLabel} <InlineMath math="a > 0" /></p>
                    <div className="flex justify-center my-2">
                      <svg viewBox="0 0 120 80" className="w-28 h-20">
                        <defs>
                          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8"/>
                          </linearGradient>
                        </defs>
                        <line x1="10" y1="60" x2="110" y2="60" stroke="#ffffff30" strokeWidth="1"/>
                        <line x1="60" y1="5" x2="60" y2="75" stroke="#ffffff30" strokeWidth="1"/>
                        <path d="M 15 65 Q 60 10 105 65" stroke="url(#grad1)" strokeWidth="2.5" fill="none"/>
                        <text x="60" y="78" textAnchor="middle" fontSize="7" fill="#4ade80">{t.svgUp}</text>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70">{t.aPosDesc}</p>
                  </Box>
                  <Box color="red">
                    <p className="font-body text-xs font-bold text-red-300 mb-2">{t.aNegLabel} <InlineMath math="a < 0" /></p>
                    <div className="flex justify-center my-2">
                      <svg viewBox="0 0 120 80" className="w-28 h-20">
                        <defs>
                          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f87171" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.8"/>
                          </linearGradient>
                        </defs>
                        <line x1="10" y1="20" x2="110" y2="20" stroke="#ffffff30" strokeWidth="1"/>
                        <line x1="60" y1="5" x2="60" y2="75" stroke="#ffffff30" strokeWidth="1"/>
                        <path d="M 15 15 Q 60 70 105 15" stroke="url(#grad2)" strokeWidth="2.5" fill="none"/>
                        <text x="60" y="78" textAnchor="middle" fontSize="7" fill="#f87171">{t.svgDown}</text>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70">{t.aNegDesc}</p>
                  </Box>
                </div>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.tableTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 pr-3 text-cyan-300">{t.tableH1}</th>
                          <th className="text-left py-2 pr-3 text-yellow-300">{t.tableH2}</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-3 font-bold"><InlineMath math="|a|" /> {language === "id" ? "besar" : language === "en" ? "large" : "が大きい"}</td>
                          <td className="py-2">{t.tableR1}</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-3 font-bold"><InlineMath math="|a|" /> {language === "id" ? "kecil" : language === "en" ? "small" : "が小さい"}</td>
                          <td className="py-2">{t.tableR2}</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-3 font-bold"><InlineMath math="c" /></td>
                          <td className="py-2">{t.tableR3}</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-3 font-bold"><InlineMath math="b" /></td>
                          <td className="py-2">{t.tableR4}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Box>

                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.propTitle}</p>
                  <ul className="space-y-1 font-body text-xs text-white/80 list-none">
                    <li>{t.prop1}</li>
                    <li>{t.prop2}</li>
                    <li>{t.prop3}</li>
                    <li>{t.prop4}</li>
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
                      ? <>Identifikasi nilai <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> dari fungsi <InlineMath math="f(x) = 3x^2 - 4x + 7" />, lalu tentukan arah bukaan parabolanya.</>
                      : language === "en"
                      ? <>Identify the values of <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> from <InlineMath math="f(x) = 3x^2 - 4x + 7" />, then determine the direction the parabola opens.</>
                      : <><InlineMath math="f(x) = 3x^2 - 4x + 7" /> から <InlineMath math="a" />、<InlineMath math="b" />、<InlineMath math="c" /> の値を求め、放物線の開く方向を答えなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> Bandingkan dengan bentuk umum <InlineMath math="ax^2 + bx + c" />:</p>
                          <Dark><BlockMath math="a = 3,\quad b = -4,\quad c = 7" /></Dark>
                          <p><strong>{t.step(2)}:</strong> Karena <InlineMath math="a = 3 > 0" />, parabola <strong>terbuka ke atas</strong> ☝️</p>
                          <p>✅ Titik puncaknya adalah nilai <strong>minimum</strong> fungsi.</p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> Compare with the general form <InlineMath math="ax^2 + bx + c" />:</p>
                          <Dark><BlockMath math="a = 3,\quad b = -4,\quad c = 7" /></Dark>
                          <p><strong>{t.step(2)}:</strong> Since <InlineMath math="a = 3 > 0" />, the parabola <strong>opens upward</strong> ☝️</p>
                          <p>✅ The vertex is the <strong>minimum</strong> value of the function.</p>
                        </>
                      : <>
                          <p><strong>{t.step(1)}:</strong> 一般形 <InlineMath math="ax^2 + bx + c" /> と比較する：</p>
                          <Dark><BlockMath math="a = 3,\quad b = -4,\quad c = 7" /></Dark>
                          <p><strong>{t.step(2)}:</strong> <InlineMath math="a = 3 > 0" /> なので、放物線は<strong>上に開く</strong> ☝️</p>
                          <p>✅ 頂点は関数の<strong>最小</strong>値です。</p>
                        </>
                  }
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={
                    language === "id"
                      ? <>Diketahui <InlineMath math="f(x) = -2x^2 + x - 5" />. Tentukan: (a) nilai <InlineMath math="a, b, c" />, (b) arah bukaan parabola, (c) nilai <InlineMath math="f(0)" />.</>
                      : language === "en"
                      ? <>Given <InlineMath math="f(x) = -2x^2 + x - 5" />. Find: (a) values of <InlineMath math="a, b, c" />, (b) direction the parabola opens, (c) value of <InlineMath math="f(0)" />.</>
                      : <><InlineMath math="f(x) = -2x^2 + x - 5" /> について：(a) <InlineMath math="a, b, c" /> の値、(b) 放物線の開く方向、(c) <InlineMath math="f(0)" /> の値を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>(a)</strong> <InlineMath math="a = -2,\; b = 1,\; c = -5" /></p>
                          <p><strong>(b)</strong> <InlineMath math="a = -2 < 0" /> → parabola <strong>terbuka ke bawah</strong> 👇 (punya nilai maksimum)</p>
                          <p><strong>(c)</strong> <InlineMath math="f(0) = -2(0)^2 + 1(0) - 5" /></p>
                          <Dark><BlockMath math="f(0) = -5" /></Dark>
                          <p>✅ Titik potong dengan sumbu-y adalah <InlineMath math="(0, -5)" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>(a)</strong> <InlineMath math="a = -2,\; b = 1,\; c = -5" /></p>
                          <p><strong>(b)</strong> <InlineMath math="a = -2 < 0" /> → parabola <strong>opens downward</strong> 👇 (has a maximum value)</p>
                          <p><strong>(c)</strong> <InlineMath math="f(0) = -2(0)^2 + 1(0) - 5" /></p>
                          <Dark><BlockMath math="f(0) = -5" /></Dark>
                          <p>✅ The y-intercept is <InlineMath math="(0, -5)" /></p>
                        </>
                      : <>
                          <p><strong>(a)</strong> <InlineMath math="a = -2,\; b = 1,\; c = -5" /></p>
                          <p><strong>(b)</strong> <InlineMath math="a = -2 < 0" /> → 放物線は<strong>下に開く</strong> 👇（最大値を持つ）</p>
                          <p><strong>(c)</strong> <InlineMath math="f(0) = -2(0)^2 + 1(0) - 5" /></p>
                          <Dark><BlockMath math="f(0) = -5" /></Dark>
                          <p>✅ y軸との交点は <InlineMath math="(0, -5)" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={
                    language === "id"
                      ? <>Fungsi <InlineMath math="g(x) = (x - 3)(2x + 1)" />. Ubah ke bentuk umum dan identifikasi karakteristiknya.</>
                      : language === "en"
                      ? <>The function <InlineMath math="g(x) = (x - 3)(2x + 1)" />. Convert to general form and identify its characteristics.</>
                      : <>関数 <InlineMath math="g(x) = (x - 3)(2x + 1)" /> を一般形に変換し、特徴を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> Kalikan dua faktor (distribusi):</p>
                          <Dark><BlockMath math="g(x) = 2x^2 + x - 6x - 3" /></Dark>
                          <Dark><BlockMath math="g(x) = 2x^2 - 5x - 3" /></Dark>
                          <p><strong>{t.step(2)}:</strong> Identifikasi: <InlineMath math="a = 2,\; b = -5,\; c = -3" /></p>
                          <p><strong>{t.step(3)}:</strong> <InlineMath math="a = 2 > 0" /> → parabola <strong>terbuka ke atas</strong>, nilai minimum ada.</p>
                          <p>✅ Titik potong sumbu-y: <InlineMath math="g(0) = -3" />, yaitu <InlineMath math="(0,-3)" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p><strong>{t.step(1)}:</strong> Multiply the two factors (expand):</p>
                          <Dark><BlockMath math="g(x) = 2x^2 + x - 6x - 3" /></Dark>
                          <Dark><BlockMath math="g(x) = 2x^2 - 5x - 3" /></Dark>
                          <p><strong>{t.step(2)}:</strong> Identify: <InlineMath math="a = 2,\; b = -5,\; c = -3" /></p>
                          <p><strong>{t.step(3)}:</strong> <InlineMath math="a = 2 > 0" /> → parabola <strong>opens upward</strong>, has a minimum.</p>
                          <p>✅ y-intercept: <InlineMath math="g(0) = -3" />, i.e. <InlineMath math="(0,-3)" /></p>
                        </>
                      : <>
                          <p><strong>{t.step(1)}:</strong> 2つの因数を展開する：</p>
                          <Dark><BlockMath math="g(x) = 2x^2 + x - 6x - 3" /></Dark>
                          <Dark><BlockMath math="g(x) = 2x^2 - 5x - 3" /></Dark>
                          <p><strong>{t.step(2)}:</strong> 係数の確認：<InlineMath math="a = 2,\; b = -5,\; c = -3" /></p>
                          <p><strong>{t.step(3)}:</strong> <InlineMath math="a = 2 > 0" /> → 放物線は<strong>上に開く</strong>、最小値あり。</p>
                          <p>✅ y軸との交点：<InlineMath math="g(0) = -3" />、すなわち <InlineMath math="(0,-3)" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={
                    language === "id"
                      ? <>Dua fungsi: <InlineMath math="f(x) = \frac{1}{2}x^2 + 3" /> dan <InlineMath math="g(x) = 4x^2 + 3" />. Keduanya memiliki <InlineMath math="c = 3" /> yang sama. Jelaskan perbedaan bentuk grafik keduanya.</>
                      : language === "en"
                      ? <>Two functions: <InlineMath math="f(x) = \frac{1}{2}x^2 + 3" /> and <InlineMath math="g(x) = 4x^2 + 3" />. Both have the same <InlineMath math="c = 3" />. Explain the difference in their graphs.</>
                      : <>2つの関数：<InlineMath math="f(x) = \frac{1}{2}x^2 + 3" /> と <InlineMath math="g(x) = 4x^2 + 3" />。どちらも <InlineMath math="c = 3" /> が同じです。グラフの形の違いを説明しなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p>Kedua fungsi sama-sama terbuka ke atas (<InlineMath math="a > 0" />) dan memotong sumbu-y di <InlineMath math="(0, 3)" />.</p>
                          <p><strong>Perbedaannya pada nilai <InlineMath math="|a|" />:</strong></p>
                          <Dark>
                            <p className="text-sm text-white/80">• <InlineMath math="f(x)" />: <InlineMath math="a = \frac{1}{2}" /> → parabola <strong>lebar/landai</strong></p>
                            <p className="text-sm text-white/80 mt-1">• <InlineMath math="g(x)" />: <InlineMath math="a = 4" /> → parabola <strong>sempit/lancip</strong></p>
                          </Dark>
                          <p>✅ Semakin besar <InlineMath math="|a|" />, semakin lancip/sempit parabolanya.</p>
                        </>
                      : language === "en"
                      ? <>
                          <p>Both functions open upward (<InlineMath math="a > 0" />) and intersect the y-axis at <InlineMath math="(0, 3)" />.</p>
                          <p><strong>The difference lies in the value of <InlineMath math="|a|" />:</strong></p>
                          <Dark>
                            <p className="text-sm text-white/80">• <InlineMath math="f(x)" />: <InlineMath math="a = \frac{1}{2}" /> → parabola is <strong>wide/flat</strong></p>
                            <p className="text-sm text-white/80 mt-1">• <InlineMath math="g(x)" />: <InlineMath math="a = 4" /> → parabola is <strong>narrow/steep</strong></p>
                          </Dark>
                          <p>✅ The larger <InlineMath math="|a|" /> is, the narrower and steeper the parabola.</p>
                        </>
                      : <>
                          <p>どちらの関数も上に開き（<InlineMath math="a > 0" />）、y軸との交点は <InlineMath math="(0, 3)" />。</p>
                          <p><strong><InlineMath math="|a|" /> の値による違い：</strong></p>
                          <Dark>
                            <p className="text-sm text-white/80">• <InlineMath math="f(x)" />：<InlineMath math="a = \frac{1}{2}" /> → 放物線は<strong>広く/緩やか</strong></p>
                            <p className="text-sm text-white/80 mt-1">• <InlineMath math="g(x)" />：<InlineMath math="a = 4" /> → 放物線は<strong>細く/急</strong></p>
                          </Dark>
                          <p>✅ <InlineMath math="|a|" /> が大きいほど、放物線は細く急になります。</p>
                        </>
                  }
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={
                    language === "id"
                      ? <>Fungsi <InlineMath math="h(x) = (k-1)x^2 - 2kx + 4" />. Tentukan nilai <InlineMath math="k" /> agar grafik <InlineMath math="h" /> merupakan parabola yang terbuka ke bawah.</>
                      : language === "en"
                      ? <>The function <InlineMath math="h(x) = (k-1)x^2 - 2kx + 4" />. Find the value(s) of <InlineMath math="k" /> so that the graph of <InlineMath math="h" /> is a downward-opening parabola.</>
                      : <>関数 <InlineMath math="h(x) = (k-1)x^2 - 2kx + 4" /> のグラフが下に開く放物線となる <InlineMath math="k" /> の値を求めなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p>Agar merupakan <strong>fungsi kuadrat</strong> dengan parabola terbuka ke bawah, syaratnya:</p>
                          <Dark><BlockMath math={`a < 0 \\quad ${kAnd} \\quad a \\neq 0`} /></Dark>
                          <p>Di sini <InlineMath math="a = k - 1" />, maka:</p>
                          <Dark><BlockMath math="k - 1 < 0 \implies k < 1" /></Dark>
                          <p>Dan syarat fungsi kuadrat: <InlineMath math="k - 1 \neq 0 \implies k \neq 1" /> (sudah terpenuhi karena <InlineMath math="k < 1" />)</p>
                          <p>✅ Nilai <InlineMath math="k" /> yang memenuhi: <InlineMath math="k < 1" /></p>
                        </>
                      : language === "en"
                      ? <>
                          <p>For it to be a <strong>quadratic function</strong> opening downward, the conditions are:</p>
                          <Dark><BlockMath math={`a < 0 \\quad ${kAnd} \\quad a \\neq 0`} /></Dark>
                          <p>Here <InlineMath math="a = k - 1" />, so:</p>
                          <Dark><BlockMath math="k - 1 < 0 \implies k < 1" /></Dark>
                          <p>And for it to be quadratic: <InlineMath math="k - 1 \neq 0 \implies k \neq 1" /> (already satisfied since <InlineMath math="k < 1" />)</p>
                          <p>✅ Values of <InlineMath math="k" /> that satisfy: <InlineMath math="k < 1" /></p>
                        </>
                      : <>
                          <p>下に開く<strong>二次関数</strong>となるための条件：</p>
                          <Dark><BlockMath math={`a < 0 \\quad ${kAnd} \\quad a \\neq 0`} /></Dark>
                          <p>ここで <InlineMath math="a = k - 1" /> なので：</p>
                          <Dark><BlockMath math="k - 1 < 0 \implies k < 1" /></Dark>
                          <p>二次関数の条件：<InlineMath math="k - 1 \neq 0 \implies k \neq 1" />（<InlineMath math="k < 1" /> なので自動的に満たされる）</p>
                          <p>✅ 条件を満たす <InlineMath math="k" /> の範囲：<InlineMath math="k < 1" /></p>
                        </>
                  }
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={
                    language === "id"
                      ? <>Diketahui <InlineMath math="f(x) = -x^2 + 4x + 5" /> dan <InlineMath math="g(x) = x^2 - 4x - 5" />. Jelaskan hubungan geometri antara kedua grafik tersebut tanpa menghitung titik puncaknya.</>
                      : language === "en"
                      ? <>Given <InlineMath math="f(x) = -x^2 + 4x + 5" /> and <InlineMath math="g(x) = x^2 - 4x - 5" />. Explain the geometric relationship between the two graphs without computing the vertex.</>
                      : <><InlineMath math="f(x) = -x^2 + 4x + 5" /> と <InlineMath math="g(x) = x^2 - 4x - 5" /> の幾何学的関係を、頂点を計算せずに説明しなさい。</>
                  }
                  pembahasan={
                    language === "id"
                      ? <>
                          <p>Perhatikan: <InlineMath math="g(x) = -(- x^2 + 4x + 5) = -f(x)" /></p>
                          <Dark><BlockMath math="g(x) = -f(x)" /></Dark>
                          <p><strong>Interpretasi geometri:</strong></p>
                          <ul className="list-disc ml-4 space-y-1 text-white/80">
                            <li>Grafik <InlineMath math="g" /> adalah <strong>pencerminan grafik <InlineMath math="f" /> terhadap sumbu-x</strong></li>
                            <li><InlineMath math="f(x)" />: <InlineMath math="a = -1 < 0" /> → terbuka ke <strong>bawah</strong></li>
                            <li><InlineMath math="g(x)" />: <InlineMath math="a = 1 > 0" /> → terbuka ke <strong>atas</strong></li>
                          </ul>
                          <p>✅ Kedua parabola identik tetapi saling berkebalikan arah (simetri terhadap sumbu-x).</p>
                        </>
                      : language === "en"
                      ? <>
                          <p>Notice: <InlineMath math="g(x) = -(- x^2 + 4x + 5) = -f(x)" /></p>
                          <Dark><BlockMath math="g(x) = -f(x)" /></Dark>
                          <p><strong>Geometric interpretation:</strong></p>
                          <ul className="list-disc ml-4 space-y-1 text-white/80">
                            <li>Graph of <InlineMath math="g" /> is the <strong>reflection of graph <InlineMath math="f" /> over the x-axis</strong></li>
                            <li><InlineMath math="f(x)" />: <InlineMath math="a = -1 < 0" /> → opens <strong>downward</strong></li>
                            <li><InlineMath math="g(x)" />: <InlineMath math="a = 1 > 0" /> → opens <strong>upward</strong></li>
                          </ul>
                          <p>✅ The two parabolas are identical but face opposite directions (symmetric about the x-axis).</p>
                        </>
                      : <>
                          <p>注目：<InlineMath math="g(x) = -(- x^2 + 4x + 5) = -f(x)" /></p>
                          <Dark><BlockMath math="g(x) = -f(x)" /></Dark>
                          <p><strong>幾何学的解釈：</strong></p>
                          <ul className="list-disc ml-4 space-y-1 text-white/80">
                            <li>グラフ <InlineMath math="g" /> は<strong>グラフ <InlineMath math="f" /> のx軸に対する反転</strong></li>
                            <li><InlineMath math="f(x)" />：<InlineMath math="a = -1 < 0" /> → <strong>下</strong>に開く</li>
                            <li><InlineMath math="g(x)" />：<InlineMath math="a = 1 > 0" /> → <strong>上</strong>に開く</li>
                          </ul>
                          <p>✅ 2つの放物線は形は同じだが向きが逆（x軸に対して対称）。</p>
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

export default BentukUmumKarakteristikPage;
