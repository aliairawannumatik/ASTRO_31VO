import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN",
    subtitle: "Kelas 8 · Garis Singgung Lingkaran · Materi Matematika",
    back: "← Kembali ke Garis Singgung Lingkaran",
    sec_intro: "🌟 Pythagoras Hadir Lagi!",
    sec_rumus: "📐 Variasi Rumus dan Dua Garis Singgung",
    sec_contoh1: "✏️ Contoh 1 — Cari Panjang Garis Singgung (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Cari Jari-jari (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — Koordinat Titik Singgung dari Titik Luar (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    insight_p: "Ketika sebuah garis singgung ditarik dari titik P di luar lingkaran ke titik singgung T, dan kita tarik juga jari-jari OT serta garis OP — terbentuklah sebuah segitiga siku-siku OTP dengan sudut siku-siku tepat di T! Dari sini, Teorema Pythagoras menjadi senjata utama kita.",
    insight_bold: "segitiga siku-siku OTP",
    rumus_key: "🔑 Rumus Panjang Garis Singgung",
    l_label: "Panjang garis singgung (PT)",
    d_label: "Jarak titik luar ke pusat (OP)",
    r_label: "Jari-jari lingkaran",
    intisari: "🎯 Ringkasan Intisari",
    intisari_desc: "Dari segitiga OTP yang siku-siku di T, kita punya sehingga tiga variasi rumus bisa diturunkan tergantung mana yang dicari.",
    three_var: "📋 Tiga Variasi Rumus",
    cari_l: "Cari panjang garis singgung (l):",
    cari_r: "Cari jari-jari (r):",
    cari_d: "Cari jarak O ke P (d):",
    tips_two: "Dari titik luar P, selalu ada dua garis singgung dengan panjang yang sama persis. Gunakan ini untuk memeriksa jawaban!",
    tips_bold: "dua garis singgung",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1_problem: "Lingkaran O berjari-jari 5 cm. Titik P berada di luar lingkaran, berjarak 13 cm dari pusat O. Hitung panjang garis singgung dari P ke lingkaran!",
    c1_given: "Diketahui: r = 5 cm, d = OP = 13 cm. Dicari: l = PT.",
    c1_ans: "✅ Panjang garis singgung = 12 cm. (Triple 5-12-13 🎉)",
    c2_problem: "Dari titik P yang berjarak 25 cm dari pusat lingkaran O, ditarik garis singgung sepanjang 24 cm. Tentukan jari-jari lingkaran tersebut!",
    c2_given: "Diketahui: d = 25 cm, l = 24 cm. Dicari: r.",
    c2_ans: "✅ Jari-jari lingkaran = 7 cm. (Triple 7-24-25!)",
    c3_problem: "Dari titik P(10, 0), ditarik garis singgung ke lingkaran berpusat di O(2, 0) dengan jari-jari 6 cm. Tentukan panjang garis singgung PT, lalu tentukan koordinat titik singgung T₁ dan T₂!",
    c3_step1: "Langkah 1: Hitung jarak OP.",
    c3_step2: "Langkah 2: Hitung panjang garis singgung.",
    c3_step3: "Langkah 3: Tentukan koordinat titik singgung T.",
    c3_step3_detail: "Misalkan T = (x, y). Titik T ada di lingkaran dan OT ⊥ PT. Susun sistem persamaan:",
    c3_circle_eq: "Dari persamaan lingkaran:",
    c3_tangent_eq: "Dari panjang garis singgung kuadrat:",
    c3_substitute: "Substitusikan y² ke persamaan kedua:",
    c3_solve_x: "Selesaikan untuk x:",
    c3_solve_y: "Hitung y²:",
    c3_final: "Jadi kedua titik singgung:",
    c3_ans: "✅ Panjang garis singgung = 2√7 ≈ 5,29 cm. Koordinat titik singgung: T₁ = (13/2, 3√7/2) dan T₂ = (13/2, −3√7/2).",
    sum1: "• Segitiga OTP siku-siku di T → gunakan Pythagoras.",
    sum_pythagoras: "Pythagoras",
    sum2: "• Cari l",
    sum3: "• Cari r",
    sum4: "• Cari d",
    sum5: "• Dua garis singgung dari titik luar:",
  },
  en: {
    title: "CALCULATING THE LENGTH OF A TANGENT FROM AN EXTERNAL POINT",
    subtitle: "Grade 8 · Circle Tangent Lines · Math Book",
    back: "← Back to Circle Tangent Lines",
    sec_intro: "🌟 Pythagoras to the Rescue!",
    sec_rumus: "📐 Formula Variations and Two Tangents",
    sec_contoh1: "✏️ Example 1 — Find the Tangent Length (Easy)",
    sec_contoh2: "✏️ Example 2 — Find the Radius (Medium)",
    sec_contoh3: "✏️ Example 3 — Coordinates of Tangent Points from an External Point (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    insight_p: "When a tangent is drawn from external point P to tangent point T, and we also draw radius OT and line OP — a right triangle OTP is formed with the right angle exactly at T! From here, the Pythagorean Theorem becomes our main weapon.",
    insight_bold: "right triangle OTP",
    rumus_key: "🔑 Formula for Tangent Length",
    l_label: "Tangent length (PT)",
    d_label: "Distance from external point to center (OP)",
    r_label: "Radius of circle",
    intisari: "🎯 Key Summary",
    intisari_desc: "From right triangle OTP with the right angle at T, we have OP² = OT² + PT², so three formula variations can be derived depending on what is being found.",
    three_var: "📋 Three Formula Variations",
    cari_l: "Find tangent length (l):",
    cari_r: "Find radius (r):",
    cari_d: "Find distance O to P (d):",
    tips_two: "From external point P, there are always exactly two tangent lines of equal length. Use this to verify your answer!",
    tips_bold: "two tangent lines",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1_problem: "Circle O has radius 5 cm. Point P is outside the circle, at a distance of 13 cm from center O. Calculate the tangent length from P to the circle!",
    c1_given: "Given: r = 5 cm, d = OP = 13 cm. Find: l = PT.",
    c1_ans: "✅ Tangent length = 12 cm. (5-12-13 Triple 🎉)",
    c2_problem: "From point P at a distance of 25 cm from center O, a tangent of length 24 cm is drawn. Find the radius of the circle!",
    c2_given: "Given: d = 25 cm, l = 24 cm. Find: r.",
    c2_ans: "✅ Radius = 7 cm. (7-24-25 Triple!)",
    c3_problem: "From point P(10, 0), tangent lines are drawn to a circle centered at O(2, 0) with radius 6 cm. Find the tangent length PT, then find the coordinates of the tangent points T₁ and T₂!",
    c3_step1: "Step 1: Calculate distance OP.",
    c3_step2: "Step 2: Calculate the tangent length.",
    c3_step3: "Step 3: Find the coordinates of tangent point T.",
    c3_step3_detail: "Let T = (x, y). Point T lies on the circle and OT ⊥ PT. Set up the system of equations:",
    c3_circle_eq: "From the circle equation:",
    c3_tangent_eq: "From the squared tangent length:",
    c3_substitute: "Substitute y² into the second equation:",
    c3_solve_x: "Solve for x:",
    c3_solve_y: "Calculate y²:",
    c3_final: "So the two tangent points are:",
    c3_ans: "✅ Tangent length = 2√7 ≈ 5.29 cm. Tangent point coordinates: T₁ = (13/2, 3√7/2) and T₂ = (13/2, −3√7/2).",
    sum1: "• Right triangle OTP at T → use",
    sum_pythagoras: "Pythagoras",
    sum2: "• Find l",
    sum3: "• Find r",
    sum4: "• Find d",
    sum5: "• Two tangents from external point:",
  },
  ja: {
    title: "外部点からの接線の長さの計算",
    subtitle: "中学2年 · 円の接線 · 数学テキスト",
    back: "← 円の接線に戻る",
    sec_intro: "🌟 ピタゴラスの登場！",
    sec_rumus: "📐 公式のバリエーションと2本の接線",
    sec_contoh1: "✏️ 例題1 — 接線の長さを求める（基本）",
    sec_contoh2: "✏️ 例題2 — 半径を求める（標準）",
    sec_contoh3: "✏️ 例題3 — 外部点からの接点の座標（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    insight_p: "外部点Pから接点Tへ接線を引き、半径OTとOP線も引くと、Tで直角となる直角三角形OTPが形成されます！ここでピタゴラスの定理が主な武器になります。",
    insight_bold: "直角三角形OTP",
    rumus_key: "🔑 接線の長さの公式",
    l_label: "接線の長さ (PT)",
    d_label: "外部点から中心までの距離 (OP)",
    r_label: "円の半径",
    intisari: "🎯 要点まとめ",
    intisari_desc: "TでのT直角三角形OTPから、OP² = OT² + PT²が得られるので、求める量に応じて3つの公式が導けます。",
    three_var: "📋 3つの公式のバリエーション",
    cari_l: "接線の長さ (l) を求める：",
    cari_r: "半径 (r) を求める：",
    cari_d: "OからPの距離 (d) を求める：",
    tips_two: "外部点Pから、等しい長さの接線が常に2本あります。これを使って答えを確認しましょう！",
    tips_bold: "2本の接線",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解説",
    c1_problem: "円Oの半径は5 cmです。点Pは円の外部にあり、中心Oから13 cmの距離にあります。PからのPから円への接線の長さを計算しなさい！",
    c1_given: "既知：r = 5 cm、d = OP = 13 cm。求める：l = PT。",
    c1_ans: "✅ 接線の長さ = 12 cm。（5-12-13 三つ組 🎉）",
    c2_problem: "中心Oから25 cmの距離にある点Pから、長さ24 cmの接線が引かれました。円の半径を求めなさい！",
    c2_given: "既知：d = 25 cm、l = 24 cm。求める：r。",
    c2_ans: "✅ 半径 = 7 cm。（7-24-25 三つ組！）",
    c3_problem: "点P(10, 0)から、中心O(2, 0)、半径6 cmの円への接線を引く。接線の長さPTを求め、接点T₁とT₂の座標を求めなさい！",
    c3_step1: "ステップ1：OP の距離を計算する。",
    c3_step2: "ステップ2：接線の長さを計算する。",
    c3_step3: "ステップ3：接点Tの座標を求める。",
    c3_step3_detail: "T = (x, y) とおく。点Tは円上にあり、OT ⊥ PT。連立方程式を立てる：",
    c3_circle_eq: "円の方程式より：",
    c3_tangent_eq: "接線の長さの二乗より：",
    c3_substitute: "y² を第2式に代入する：",
    c3_solve_x: "x を解く：",
    c3_solve_y: "y² を計算する：",
    c3_final: "よって、2つの接点は：",
    c3_ans: "✅ 接線の長さ = 2√7 ≈ 5.29 cm。接点の座標：T₁ = (13/2, 3√7/2)、T₂ = (13/2, −3√7/2)。",
    sum1: "• TでのT直角三角形OTP → 使う",
    sum_pythagoras: "ピタゴラス",
    sum2: "• l を求める",
    sum3: "• r を求める",
    sum4: "• d を求める",
    sum5: "• 外部点からの2本の接線：",
  },
};

type TranslationKey = keyof typeof translations.id;

/* ── SVG: Right triangle OTP ── */
const RumusPanjangSVG = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-sm mx-auto my-2" aria-label="Right triangle for tangent length">
    <defs>
      <style>{`
        @keyframes tangLen{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #fbbf24);}50%{stroke-opacity:0.3;filter:none;}}
        .tl{animation:tangLen 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="80" cy="120" r="60" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2"/>
    <circle cx="80" cy="120" r="4" fill="#22c55e"/>
    <text x="66" y="117" fill="#4ade80" fontSize="12" fontFamily="monospace" fontWeight="bold">O</text>
    <circle cx="250" cy="120" r="5" fill="#f97316"/>
    <text x="256" y="124" fill="#fb923c" fontSize="12" fontFamily="monospace" fontWeight="bold">P</text>
    <circle cx="80" cy="60" r="5" fill="#fbbf24"/>
    <text x="85" y="56" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">T</text>
    <polyline points="80,60 91,64 87,75" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.9"/>
    <line x1="80" y1="120" x2="80" y2="60" stroke="#22c55e" strokeWidth="2.5"/>
    <text x="55" y="93" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    <line x1="80" y1="120" x2="250" y2="120" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 3"/>
    <text x="160" y="137" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">d</text>
    <line x1="80" y1="60" x2="250" y2="120" stroke="#fbbf24" strokeWidth="3" className="tl"/>
    <text x="182" y="80" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">l</text>
    <text x="95" y="72" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" opacity="0.8">90°</text>
    <rect x="5" y="185" width="295" height="32" rx="8" fill="rgba(30,41,59,0.9)" stroke="#334155" strokeWidth="1"/>
    <text x="150" y="198" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Pythagoras on right triangle OTP (right angle at T):</text>
    <text x="150" y="212" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">l = √(d² − r²)   or   d² = r² + l²</text>
  </svg>
);

/* ── SVG: Two tangents from external point ── */
const DuaGarisSinggungSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-sm mx-auto my-2" aria-label="Two tangents from external point">
    <defs>
      <style>{`@keyframes dgs{0%,100%{opacity:1;}50%{opacity:0.3;}}.dgs1{animation:dgs 2s ease-in-out infinite;}.dgs2{animation:dgs 2s ease-in-out infinite 1s;}`}</style>
    </defs>
    <circle cx="100" cy="100" r="60" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="2"/>
    <circle cx="100" cy="100" r="4" fill="#3b82f6"/>
    <text x="87" y="97" fill="#60a5fa" fontSize="12" fontFamily="monospace" fontWeight="bold">O</text>
    <circle cx="250" cy="100" r="5" fill="#f97316"/>
    <text x="257" y="104" fill="#fb923c" fontSize="12" fontFamily="monospace" fontWeight="bold">P</text>
    <circle cx="70" cy="42" r="5" fill="#fbbf24"/>
    <text x="55" y="37" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">T₁</text>
    <line x1="70" y1="42" x2="250" y2="100" stroke="#fbbf24" strokeWidth="3" className="dgs1"/>
    <text x="170" y="52" fill="#fbbf24" fontSize="10" fontFamily="monospace">l = PT₁</text>
    <circle cx="70" cy="158" r="5" fill="#fbbf24"/>
    <text x="55" y="170" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">T₂</text>
    <line x1="70" y1="158" x2="250" y2="100" stroke="#fbbf24" strokeWidth="3" className="dgs2"/>
    <text x="170" y="148" fill="#fbbf24" fontSize="10" fontFamily="monospace">l = PT₂</text>
    <line x1="100" y1="100" x2="70" y2="42" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
    <line x1="100" y1="100" x2="70" y2="158" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"/>
    <text x="75" y="70" fill="#60a5fa" fontSize="9" fontFamily="monospace">r</text>
    <text x="75" y="136" fill="#60a5fa" fontSize="9" fontFamily="monospace">r</text>
    <text x="125" y="100" fill="#4ade80" fontSize="20" fontFamily="monospace" textAnchor="middle" fontWeight="bold">=</text>
    <text x="125" y="115" fill="#4ade80" fontSize="9" fontFamily="monospace" textAnchor="middle">PT₁ = PT₂</text>
  </svg>
);

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] as Record<TranslationKey, string>;

  const [open, setOpen] = useState<string[]>(["intro", "rumus", "contoh1", "contoh2", "contoh3", "rangkuman"]);

  const toggle = (id: string) => {
    playPopSound();
    setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_intro} />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.insight_p.split(t.insight_bold)[0]}
                  <strong className="text-cyan-300">{t.insight_bold}</strong>
                  {t.insight_p.split(t.insight_bold)[1]}
                </p>
                <RumusPanjangSVG />
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-semibold text-sm mb-2">{t.rumus_key}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <BlockMath math="l = \sqrt{d^2 - r^2}" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-body">
                    <div className="bg-yellow-900/40 rounded-lg p-2 text-center">
                      <p className="text-yellow-300 font-bold"><InlineMath math="l" /></p>
                      <p className="text-white/60">{t.l_label}</p>
                    </div>
                    <div className="bg-purple-900/40 rounded-lg p-2 text-center">
                      <p className="text-purple-300 font-bold"><InlineMath math="d" /></p>
                      <p className="text-white/60">{t.d_label}</p>
                    </div>
                    <div className="bg-green-900/40 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="r" /></p>
                      <p className="text-white/60">{t.r_label}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS DETAIL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_rumus} />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.intisari_desc.split("OP²")[0]}<InlineMath math="OP^2 = OT^2 + PT^2" />{t.intisari_desc.split("OP²")[1]}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.three_var}</p>
                  <div className="space-y-2">
                    <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg px-4 py-2">
                      <p className="text-yellow-300 text-xs font-bold mb-1">{t.cari_l}</p>
                      <BlockMath math="l = \sqrt{d^2 - r^2}" />
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg px-4 py-2">
                      <p className="text-green-300 text-xs font-bold mb-1">{t.cari_r}</p>
                      <BlockMath math="r = \sqrt{d^2 - l^2}" />
                    </div>
                    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg px-4 py-2">
                      <p className="text-purple-300 text-xs font-bold mb-1">{t.cari_d}</p>
                      <BlockMath math="d = \sqrt{r^2 + l^2}" />
                    </div>
                  </div>
                </div>
                <DuaGarisSinggungSVG />
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>{t.tips_two.split(t.tips_bold)[0]}</strong><strong className="text-yellow-300">{t.tips_bold}</strong>{t.tips_two.split(t.tips_bold)[1]} (<InlineMath math="PT_1 = PT_2" />).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title={t.sec_contoh1} />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.easy}</p>
                  <p className="font-body text-sm text-white/90">{t.c1_problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">{t.c1_given}</p>
                  <BlockMath math="l = \sqrt{d^2 - r^2} = \sqrt{13^2 - 5^2}" />
                  <BlockMath math="l = \sqrt{169 - 25} = \sqrt{144}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="l = 12 \mathrm{\ cm}" />
                    <p className="font-body text-sm text-green-300 text-center mt-1">{t.c1_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_contoh2} />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.medium}</p>
                  <p className="font-body text-sm text-white/90">{t.c2_problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">{t.c2_given}</p>
                  <BlockMath math="r = \sqrt{d^2 - l^2} = \sqrt{25^2 - 24^2}" />
                  <BlockMath math="r = \sqrt{625 - 576} = \sqrt{49}" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="r = 7 \mathrm{\ cm}" />
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">{t.c2_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 — koordinat titik singgung T₁ dan T₂ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.sec_contoh3} />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.hard}</p>
                  <p className="font-body text-sm text-white/90">{t.c3_problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>

                  <p className="font-body text-sm text-white/80"><strong>{t.c3_step1}</strong></p>
                  <BlockMath math="d = OP = \sqrt{(10-2)^2 + (0-0)^2} = \sqrt{64} = 8 \mathrm{\ cm}" />

                  <p className="font-body text-sm text-white/80"><strong>{t.c3_step2}</strong></p>
                  <BlockMath math="l = \sqrt{d^2 - r^2} = \sqrt{8^2 - 6^2} = \sqrt{64 - 36} = \sqrt{28} = 2\sqrt{7} \mathrm{\ cm}" />

                  <p className="font-body text-sm text-white/80"><strong>{t.c3_step3}</strong></p>
                  <p className="font-body text-sm text-white/70">{t.c3_step3_detail}</p>

                  <p className="font-body text-sm text-white/80">{t.c3_circle_eq}</p>
                  <BlockMath math="(x - 2)^2 + y^2 = 36 \quad \cdots (1)" />

                  <p className="font-body text-sm text-white/80">{t.c3_tangent_eq}</p>
                  <BlockMath math="(x - 10)^2 + y^2 = 28 \quad \cdots (2)" />

                  <p className="font-body text-sm text-white/80">{t.c3_substitute}</p>
                  <BlockMath math="y^2 = 36 - (x-2)^2" />
                  <BlockMath math="(x-10)^2 + 36 - (x-2)^2 = 28" />

                  <p className="font-body text-sm text-white/80">{t.c3_solve_x}</p>
                  <BlockMath math="x^2 - 20x + 100 + 36 - x^2 + 4x - 4 = 28" />
                  <BlockMath math="-16x + 132 = 28 \;\Rightarrow\; -16x = -104 \;\Rightarrow\; x = \dfrac{13}{2}" />

                  <p className="font-body text-sm text-white/80">{t.c3_solve_y}</p>
                  <BlockMath math="y^2 = 36 - \!\left(\tfrac{13}{2} - 2\right)^{\!2} = 36 - \tfrac{81}{4} = \tfrac{144 - 81}{4} = \tfrac{63}{4}" />
                  <BlockMath math="y = \pm\frac{3\sqrt{7}}{2}" />

                  <p className="font-body text-sm text-white/80">{t.c3_final}</p>
                  <BlockMath math="T_1 = \!\left(\tfrac{13}{2},\;\tfrac{3\sqrt{7}}{2}\right), \quad T_2 = \!\left(\tfrac{13}{2},\;-\tfrac{3\sqrt{7}}{2}\right)" />

                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">{t.c3_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec_rangkuman} />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">{t.sum1} <strong className="text-cyan-300">{t.sum_pythagoras}</strong>.</p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-2">
                    <div className="bg-yellow-900/40 rounded-lg p-2 text-center">
                      <p className="text-yellow-300 font-bold">{t.sum2}</p>
                      <p className="text-white/70"><InlineMath math="\sqrt{d^2-r^2}" /></p>
                    </div>
                    <div className="bg-green-900/40 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold">{t.sum3}</p>
                      <p className="text-white/70"><InlineMath math="\sqrt{d^2-l^2}" /></p>
                    </div>
                    <div className="bg-purple-900/40 rounded-lg p-2 text-center">
                      <p className="text-purple-300 font-bold">{t.sum4}</p>
                      <p className="text-white/70"><InlineMath math="\sqrt{r^2+l^2}" /></p>
                    </div>
                  </div>
                  <p className="font-body text-sm text-white/80 mt-2">{t.sum5} <InlineMath math="PT_1 = PT_2" /></p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenghitungPanjangPage;
