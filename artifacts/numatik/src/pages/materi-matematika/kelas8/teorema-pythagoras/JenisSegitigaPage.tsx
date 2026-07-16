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
    title: "PYTHAGORAS DAN JENIS-JENIS SEGITIGA",
    subtitle: "Kelas 8 · Teorema Pythagoras · Materi Matematika",
    back: "← Kembali ke Teorema Pythagoras",
    sec_intro: "🌟 Pythagoras Sebagai Pendeteksi Jenis Segitiga",
    sec_interaktif: "🎮 Animasi Interaktif — Ubah Sudut, Lihat Jenisnya!",
    sec_jenis: "📐 Detail Tiga Jenis Segitiga",
    sec_contoh1: "✏️ Contoh 1 — Identifikasi Segitiga (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Segitiga Lancip atau Tumpul? (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — Menentukan Segitiga Tumpul (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    intisari: "🎯 Ringkasan Intisari",
    introDesc1: "Siapa sangka, Teorema Pythagoras bukan hanya untuk menghitung sisi! Ia juga bisa kita gunakan sebagai",
    introDesc2: "\"detektor\"",
    introDesc3: "untuk menentukan apakah sebuah segitiga lancip, siku-siku, atau tumpul — hanya dengan membandingkan kuadrat sisi-sisinya.",
    keyTitle: "🔑 Kunci Penentuan Jenis Segitiga",
    keyNote: "Misalkan",
    keyNote2: "adalah sisi terpanjang dari segitiga dengan sisi",
    right: "Siku-siku:",
    rightDesc: "Tepat satu sudut = 90°",
    acute: "Lancip:",
    acuteDesc: "Semua sudut kurang dari 90°",
    obtuse: "Tumpul:",
    obtuseDesc: "Ada satu sudut lebih dari 90°",
    animHint: "💡 Geser slider atau tekan tombol untuk mengubah sudut θ di titik C. Amati bagaimana nilai a²+b² dibandingkan c² berubah seiring jenis segitiga yang terbentuk!",
    jenisSummary: "Dengan membandingkan",
    jenisSummary2: "dan",
    jenisSummary3: ", kita bisa",
    jenisSummary4: "mengklasifikasikan setiap segitiga",
    jenisSummary5: "tanpa harus mengukur sudutnya secara langsung. Ini sangat berguna di bidang teknik dan arsitektur!",
    tipTitle: "💡 Tips: Selalu urutkan sisi dari kecil ke besar dulu. Sisi terpanjang itulah yang menjadi",
    tipEnd: "dalam perbandingan. Jangan sampai terbalik!",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1Problem: "Tentukan jenis segitiga dengan panjang sisi 6 cm, 8 cm, dan 10 cm!",
    c1Sol: "Urutkan:",
    c1Sol2: ". Bandingkan",
    c1Sol3: "dan",
    c1Ans: "✅ Karena 100 = 100, segitiga ini adalah SIKU-SIKU (triple 3-4-5 × 2).",
    c2Problem: "Seorang desainer interior mempunyai segitiga logam dengan sisi 5 cm, 7 cm, dan 9 cm. Termasuk jenis apakah segitiga ini?",
    c2Sol: "Urutkan:",
    c2Sol2: ". Bandingkan:",
    c2Sol3: "Bandingkan:",
    c2Sol4: "74 < 81",
    c2Ans: "✅ Karena a²+b² < c², segitiga ini adalah TUMPUL — ada sudut yang lebih dari 90°.",
    c3Problem: "Diketahui panjang sisi-sisi pada segitiga sebagai berikut:",
    c3Question: "Panjang sisi-sisi di atas yang dapat membentuk segitiga tumpul adalah …",
    c3Syarat: "Syarat segitiga tumpul:",
    c3SyaratDesc: "(dengan",
    c3SyaratDesc2: "= sisi terpanjang)",
    c3RightLabel: "Segitiga Siku-siku",
    c3ObtLabel: "Segitiga Tumpul",
    c3AcuteLabel: "Segitiga Lancip",
    c3Ans: "✅ Yang membentuk segitiga tumpul: (2) dan (4) → Jawaban d",
    r_note: "Urutkan sisi:",
    r_note2: "lalu bandingkan",
    r_note3: "dengan",
    r_equal: "= c²",
    r_equalLabel: "Siku-siku",
    r_greater: "> c²",
    r_greaterLabel: "Lancip",
    r_less: "< c²",
    r_lessLabel: "Tumpul",
    svgAcute: "LANCIP",
    svgRight: "SIKU-SIKU",
    svgObtuse: "TUMPUL",
    svgAcuteDesc: "semua sudut <90°",
    svgRightDesc: "tepat 1 sudut =90°",
    svgObtuseDesc: "1 sudut >90°",
    checkerTitle: "🔬 Tentukan Jenis Segitigamu!",
    checkerA: "Sisi a",
    checkerB: "Sisi b",
    checkerC: "Sisi c (terpanjang)",
    checkerBtn: "Cek!",
    checkerInvalid: "Masukkan tiga sisi yang valid!",
    checkerNotTri: "❌ Bukan segitiga valid (tidak memenuhi syarat segitiga)!",
    checkerRight: "✅ Segitiga SIKU-SIKU — a² + b² = c² tepat!",
    checkerAcute: "🔺 Segitiga LANCIP — a² + b² > c², semua sudut < 90°",
    checkerObtuse: "🔶 Segitiga TUMPUL — a² + b² < c², ada sudut > 90°",
    presetAcute: "🔺 Lancip",
    presetRight: "▪ Siku-siku",
    presetObtuse: "▶ Tumpul",
    sliderLabel: "🔄 Ubah sudut di titik C (geser ke kiri/kanan):",
    sliderMin: "1° (lancip)",
    sliderMid: "90° (siku-siku)",
    sliderMax: "179° (tumpul)",
    colTagAcute: "🔺 LANCIP",
    colTagRight: "▪ SIKU-SIKU",
    colTagObtuse: "▶ TUMPUL",
    colDescAcute: "Semua sudut < 90° — segitiga lancip",
    colDescRight: "Tepat satu sudut = 90° — segitiga siku-siku",
    colDescObtuse: "Ada sudut > 90° — segitiga tumpul",
    colOpEq: "sama dengan",
    colOpGt: "lebih besar",
    colOpLt: "lebih kecil",
    cardFixed: "(tetap)",
    cardDynamic: "(berubah)",
  },
  en: {
    title: "PYTHAGORAS AND TYPES OF TRIANGLES",
    subtitle: "Grade 8 · Pythagorean Theorem · Math Book",
    back: "← Back to Pythagorean Theorem",
    sec_intro: "🌟 Pythagoras as a Triangle Type Detector",
    sec_interaktif: "🎮 Interactive Animation — Change Angle, See the Type!",
    sec_jenis: "📐 Detail: Three Triangle Types",
    sec_contoh1: "✏️ Example 1 — Identify the Triangle (Easy)",
    sec_contoh2: "✏️ Example 2 — Acute or Obtuse? (Medium)",
    sec_contoh3: "✏️ Example 3 — Identifying Obtuse Triangles (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    intisari: "🎯 Key Summary",
    introDesc1: "Surprisingly, the Pythagorean Theorem isn't only for calculating sides! It can also be used as a",
    introDesc2: "\"detector\"",
    introDesc3: "to determine whether a triangle is acute, right, or obtuse — just by comparing the squares of its sides.",
    keyTitle: "🔑 Key to Identifying Triangle Types",
    keyNote: "Let",
    keyNote2: "be the longest side of a triangle with sides",
    right: "Right triangle:",
    rightDesc: "Exactly one angle = 90°",
    acute: "Acute triangle:",
    acuteDesc: "All angles less than 90°",
    obtuse: "Obtuse triangle:",
    obtuseDesc: "One angle greater than 90°",
    animHint: "💡 Drag the slider or press a button to change angle θ at point C. Observe how the comparison between a²+b² and c² changes with the triangle type!",
    jenisSummary: "By comparing",
    jenisSummary2: "and",
    jenisSummary3: ", we can",
    jenisSummary4: "classify every triangle",
    jenisSummary5: "without measuring angles directly. Very useful in engineering and architecture!",
    tipTitle: "💡 Tip: Always sort the sides smallest to largest first. The longest side becomes",
    tipEnd: "in the comparison. Don't mix them up!",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1Problem: "Determine the type of triangle with sides 6 cm, 8 cm, and 10 cm!",
    c1Sol: "Sort:",
    c1Sol2: ". Compare",
    c1Sol3: "and",
    c1Ans: "✅ Since 100 = 100, this is a RIGHT triangle (triple 3-4-5 × 2).",
    c2Problem: "An interior designer has a metal triangle with sides 5 cm, 7 cm, and 9 cm. What type of triangle is it?",
    c2Sol: "Sort:",
    c2Sol2: ". Compare:",
    c2Sol3: "Compare:",
    c2Sol4: "74 < 81",
    c2Ans: "✅ Since a²+b² < c², this triangle is OBTUSE — one angle is greater than 90°.",
    c3Problem: "Given the following side lengths for triangles:",
    c3Question: "Which of the sets of side lengths above form an obtuse triangle?",
    c3Syarat: "Condition for an obtuse triangle:",
    c3SyaratDesc: "(where",
    c3SyaratDesc2: "= longest side)",
    c3RightLabel: "Right Triangle",
    c3ObtLabel: "Obtuse Triangle",
    c3AcuteLabel: "Acute Triangle",
    c3Ans: "✅ Obtuse triangles: (2) and (4) → Answer d",
    r_note: "Sort sides:",
    r_note2: "then compare",
    r_note3: "with",
    r_equal: "= c²",
    r_equalLabel: "Right",
    r_greater: "> c²",
    r_greaterLabel: "Acute",
    r_less: "< c²",
    r_lessLabel: "Obtuse",
    svgAcute: "ACUTE",
    svgRight: "RIGHT",
    svgObtuse: "OBTUSE",
    svgAcuteDesc: "all angles <90°",
    svgRightDesc: "exactly 1 angle =90°",
    svgObtuseDesc: "1 angle >90°",
    checkerTitle: "🔬 Identify Your Triangle!",
    checkerA: "Side a",
    checkerB: "Side b",
    checkerC: "Side c (longest)",
    checkerBtn: "Check!",
    checkerInvalid: "Enter three valid side lengths!",
    checkerNotTri: "❌ Not a valid triangle (triangle inequality not satisfied)!",
    checkerRight: "✅ RIGHT triangle — a² + b² = c² exactly!",
    checkerAcute: "🔺 ACUTE triangle — a² + b² > c², all angles < 90°",
    checkerObtuse: "🔶 OBTUSE triangle — a² + b² < c², one angle > 90°",
    presetAcute: "🔺 Acute",
    presetRight: "▪ Right",
    presetObtuse: "▶ Obtuse",
    sliderLabel: "🔄 Change angle at point C (drag left/right):",
    sliderMin: "1° (acute)",
    sliderMid: "90° (right)",
    sliderMax: "179° (obtuse)",
    colTagAcute: "🔺 ACUTE",
    colTagRight: "▪ RIGHT",
    colTagObtuse: "▶ OBTUSE",
    colDescAcute: "All angles < 90° — acute triangle",
    colDescRight: "Exactly one angle = 90° — right triangle",
    colDescObtuse: "One angle > 90° — obtuse triangle",
    colOpEq: "equals",
    colOpGt: "greater than",
    colOpLt: "less than",
    cardFixed: "(fixed)",
    cardDynamic: "(changing)",
  },
  ja: {
    title: "ピタゴラスと三角形の種類",
    subtitle: "8年生 · ピタゴラスの定理 · 数学テキスト",
    back: "← ピタゴラスの定理に戻る",
    sec_intro: "🌟 ピタゴラスで三角形の種類を判定する",
    sec_interaktif: "🎮 インタラクティブアニメーション — 角度を変えて種類を見よう！",
    sec_jenis: "📐 3種類の三角形の詳細",
    sec_contoh1: "✏️ 例題1 — 三角形の識別（基本）",
    sec_contoh2: "✏️ 例題2 — 鋭角？鈍角？（標準）",
    sec_contoh3: "✏️ 例題3 — 鈍角三角形の判定（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    intisari: "🎯 要点まとめ",
    introDesc1: "なんと、ピタゴラスの定理は辺の計算だけではありません！辺の2乗を比べるだけで、三角形が鋭角・直角・鈍角のどれかを判定する",
    introDesc2: "「検出器」",
    introDesc3: "としても使えます。",
    keyTitle: "🔑 三角形の種類を判定するポイント",
    keyNote: "",
    keyNote2: "を最長辺とし、辺を",
    right: "直角三角形：",
    rightDesc: "ちょうど1つの角が90°",
    acute: "鋭角三角形：",
    acuteDesc: "すべての角が90°未満",
    obtuse: "鈍角三角形：",
    obtuseDesc: "1つの角が90°より大きい",
    animHint: "💡 スライダーを動かすか、ボタンを押して点Cの角度θを変えてみよう。a²+b²とc²の比較がどう変わるか観察しよう！",
    jenisSummary: "",
    jenisSummary2: "と",
    jenisSummary3: "を比べることで、",
    jenisSummary4: "すべての三角形を分類",
    jenisSummary5: "できます。角度を直接測らずに。工学や建築に非常に役立ちます！",
    tipTitle: "💡 ヒント：まず辺を小さい順に並べよう。最も長い辺が",
    tipEnd: "になります。順番を間違えないように！",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解答",
    c1Problem: "辺の長さが6cm、8cm、10cmの三角形の種類を判定しなさい！",
    c1Sol: "並び替え：",
    c1Sol2: "。比較：",
    c1Sol3: "と",
    c1Ans: "✅ 100 = 100 なので、この三角形は直角三角形です（3-4-5の2倍のトリプル）。",
    c2Problem: "インテリアデザイナーが辺5cm、7cm、9cmの金属三角形を持っています。これはどの種類の三角形ですか？",
    c2Sol: "並び替え：",
    c2Sol2: "。比較：",
    c2Sol3: "比較：",
    c2Sol4: "74 < 81",
    c2Ans: "✅ a²+b² < c² なので、この三角形は鈍角三角形です — 90°より大きい角があります。",
    c3Problem: "次の辺の長さを持つ三角形について：",
    c3Question: "鈍角三角形を形成するものはどれですか？",
    c3Syarat: "鈍角三角形の条件：",
    c3SyaratDesc: "（",
    c3SyaratDesc2: "= 最長辺）",
    c3RightLabel: "直角三角形",
    c3ObtLabel: "鈍角三角形",
    c3AcuteLabel: "鋭角三角形",
    c3Ans: "✅ 鈍角三角形を形成するのは：(2)と(4) → 答え：d",
    r_note: "辺を並び替え：",
    r_note2: "、次に",
    r_note3: "と",
    r_equal: "= c²",
    r_equalLabel: "直角",
    r_greater: "> c²",
    r_greaterLabel: "鋭角",
    r_less: "< c²",
    r_lessLabel: "鈍角",
    svgAcute: "鋭角",
    svgRight: "直角",
    svgObtuse: "鈍角",
    svgAcuteDesc: "全角<90°",
    svgRightDesc: "1角=90°",
    svgObtuseDesc: "1角>90°",
    checkerTitle: "🔬 三角形の種類を判定しよう！",
    checkerA: "辺 a",
    checkerB: "辺 b",
    checkerC: "辺 c（最長辺）",
    checkerBtn: "判定！",
    checkerInvalid: "有効な3辺を入力してください！",
    checkerNotTri: "❌ 有効な三角形ではありません（三角不等式を満たしません）！",
    checkerRight: "✅ 直角三角形 — a² + b² = c² が成立！",
    checkerAcute: "🔺 鋭角三角形 — a² + b² > c²、全ての角が90°未満",
    checkerObtuse: "🔶 鈍角三角形 — a² + b² < c²、90°より大きい角あり",
    presetAcute: "🔺 鋭角",
    presetRight: "▪ 直角",
    presetObtuse: "▶ 鈍角",
    sliderLabel: "🔄 点Cの角度θを変える（スライダーを動かす）：",
    sliderMin: "1°（鋭角）",
    sliderMid: "90°（直角）",
    sliderMax: "179°（鈍角）",
    colTagAcute: "🔺 鋭角三角形",
    colTagRight: "▪ 直角三角形",
    colTagObtuse: "▶ 鈍角三角形",
    colDescAcute: "全ての角が90°未満 — 鋭角三角形",
    colDescRight: "ちょうど1つの角が90° — 直角三角形",
    colDescObtuse: "90°より大きい角あり — 鈍角三角形",
    colOpEq: "等しい",
    colOpGt: "より大きい",
    colOpLt: "より小さい",
    cardFixed: "（固定）",
    cardDynamic: "（変動）",
  },
} as const;
type Lang = keyof typeof translations;

const JenisSegitigaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as Lang];
  const [open, setOpen] = useState<string[]>(["intro","interaktif","jenis","contoh1","contoh2","contoh3","rangkuman"]);

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
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary"/> : <ChevronDown className="w-5 h-5 text-primary"/>}
    </button>
  );

  const TigaSegitigaSVG = () => (
    <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto my-2" aria-label="Three triangle types">
      <defs>
        <style>{`
          @keyframes glow{0%,100%{filter:drop-shadow(0 0 4px currentColor);}50%{filter:none;}}
          .t1{animation:glow 2s ease-in-out infinite;}
          .t2{animation:glow 2s ease-in-out infinite 0.7s;}
          .t3{animation:glow 2s ease-in-out infinite 1.4s;}
        `}</style>
      </defs>
      <polygon points="55,130 10,130 33,60" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="2" className="t1"/>
      <text x="33" y="148" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t.svgAcute}</text>
      <text x="33" y="158" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">a²+b² {'>'} c²</text>
      <text x="33" y="50" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svgAcuteDesc}</text>
      <line x1="115" y1="55" x2="115" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
      <polygon points="205,130 130,130 130,60" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="2" className="t2"/>
      <polyline points="130,110 150,110 150,130" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
      <text x="167" y="148" fill="#60a5fa" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t.svgRight}</text>
      <text x="167" y="158" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">a²+b² = c²</text>
      <text x="167" y="50" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svgRightDesc}</text>
      <line x1="225" y1="55" x2="225" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
      <polygon points="320,130 235,130 268,75" fill="rgba(249,115,22,0.25)" stroke="#f97316" strokeWidth="2" className="t3"/>
      <text x="278" y="148" fill="#fb923c" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t.svgObtuse}</text>
      <text x="278" y="158" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">a²+b² {'<'} c²</text>
      <text x="278" y="50" fill="#fb923c" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svgObtuseDesc}</text>
    </svg>
  );

  const TriangleTypeChecker = () => {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [c, setC] = useState("");
    const [result, setResult] = useState<null | string>(null);
    const [color, setColor] = useState("");

    const check = () => {
      const sides = [parseFloat(a), parseFloat(b), parseFloat(c)].filter(v => !isNaN(v) && v > 0);
      if (sides.length < 3) { setResult(t.checkerInvalid); setColor("text-white/60"); return; }
      sides.sort((x, y) => x - y);
      const [s1, s2, s3] = sides;
      if (s1 + s2 <= s3) { setResult(t.checkerNotTri); setColor("text-red-300"); return; }
      const sum = s1*s1 + s2*s2;
      const hyp = s3*s3;
      if (Math.abs(sum - hyp) < 0.001) { setResult(t.checkerRight); setColor("text-blue-300"); }
      else if (sum > hyp) { setResult(t.checkerAcute); setColor("text-green-300"); }
      else { setResult(t.checkerObtuse); setColor("text-orange-300"); }
    };

    return (
      <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-4 space-y-3">
        <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.checkerTitle}</p>
        <div className="flex gap-2 flex-wrap">
          {[{val:a,set:setA,label:t.checkerA},{val:b,set:setB,label:t.checkerB},{val:c,set:setC,label:t.checkerC}].map(({val,set,label})=>(
            <div key={label} className="flex flex-col gap-1">
              <label className="font-body text-xs text-white/50">{label}</label>
              <input type="number" min="0.1" step="0.1" value={val}
                onChange={e=>{set(e.target.value);setResult(null);}}
                className="w-24 bg-slate-900/60 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm font-body focus:outline-none"
                placeholder="..."/>
            </div>
          ))}
          <button onClick={check}
            className="mt-5 px-4 py-2 bg-cyan-700/60 border border-cyan-500 text-cyan-300 rounded-lg text-xs font-bold font-body hover:bg-cyan-600/60 transition-colors cursor-pointer">
            {t.checkerBtn}
          </button>
        </div>
        {result && (
          <div className="bg-slate-900/60 border border-slate-600 rounded-lg p-3">
            <p className={`font-body text-sm font-bold ${color}`}>{result}</p>
            {a && b && c && !isNaN(parseFloat(a)) && !isNaN(parseFloat(b)) && !isNaN(parseFloat(c)) && (
              <p className="font-body text-xs text-white/50 mt-1">
                a²+b² = {(parseFloat(a)**2+parseFloat(b)**2).toFixed(2)}, c² = {(parseFloat(c)**2).toFixed(2)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const SegitigaInteraktif = () => {
    const [theta, setTheta] = useState(90);
    const a = 5, b = 5, L = 105;
    const CX = 150, CY = 26;
    const rad  = (theta * Math.PI) / 180;
    const half = rad / 2;
    const AX = CX - L * Math.sin(half);
    const AY = CY + L * Math.cos(half);
    const BX = CX + L * Math.sin(half);
    const BY = AY;
    const cSqRaw = a*a + b*b - 2*a*b*Math.cos(rad);
    const cSq    = +cSqRaw.toFixed(2);
    const c      = +Math.sqrt(Math.max(0, cSqRaw)).toFixed(2);
    const abSq   = a*a + b*b;
    const diff = abSq - cSq;
    const type  = Math.abs(diff) < 0.06 ? 'right' : diff > 0 ? 'acute' : 'obtuse';

    const COL = {
      acute:  { fill:'rgba(34,197,94,0.2)',  stroke:'#22c55e', text:'text-green-300',  bg:'bg-green-900/30',  bd:'border-green-500/40',  op:'>',  tag:t.colTagAcute,  desc:t.colDescAcute, barFill:'rgba(34,197,94,0.7)'  },
      right:  { fill:'rgba(59,130,246,0.2)', stroke:'#3b82f6', text:'text-blue-300',   bg:'bg-blue-900/30',   bd:'border-blue-500/40',   op:'=',  tag:t.colTagRight,  desc:t.colDescRight, barFill:'rgba(59,130,246,0.7)'  },
      obtuse: { fill:'rgba(249,115,22,0.2)', stroke:'#f97316', text:'text-orange-300', bg:'bg-orange-900/30', bd:'border-orange-500/40', op:'<',  tag:t.colTagObtuse, desc:t.colDescObtuse, barFill:'rgba(249,115,22,0.7)' },
    }[type];

    const MK = 11;
    const nAx = (AX - CX) / L, nAy = (AY - CY) / L;
    const nBx = (BX - CX) / L, nBy = (BY - CY) / L;
    const rmPts = [
      `${(CX+MK*nAx).toFixed(1)},${(CY+MK*nAy).toFixed(1)}`,
      `${(CX+MK*(nAx+nBx)).toFixed(1)},${(CY+MK*(nAy+nBy)).toFixed(1)}`,
      `${(CX+MK*nBx).toFixed(1)},${(CY+MK*nBy).toFixed(1)}`,
    ].join(' ');
    const arcR = 22;
    const arcPath = `M ${(CX-arcR*Math.sin(half)).toFixed(1)},${(CY+arcR*Math.cos(half)).toFixed(1)} A ${arcR} ${arcR} 0 0 0 ${(CX+arcR*Math.sin(half)).toFixed(1)},${(CY+arcR*Math.cos(half)).toFixed(1)}`;
    const BASE_Y = 188, REF_H = 42;
    const abBar = REF_H;
    const cBar  = Math.min((cSq / abSq) * REF_H, REF_H * 2.1);
    const SK = { stroke:'rgba(2,6,23,0.85)', strokeWidth:2.5, paintOrder:'stroke' as const };

    return (
      <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label:t.presetAcute,  t:60,  cls:'bg-green-700/80 border-green-600' },
            { label:t.presetRight,  t:90,  cls:'bg-blue-700/80 border-blue-600'   },
            { label:t.presetObtuse, t:120, cls:'bg-orange-700/80 border-orange-600'},
          ].map(p => (
            <button key={p.t} onClick={() => setTheta(p.t)}
              className={`py-2 rounded-lg text-xs font-bold text-white border transition-all duration-200 cursor-pointer hover:brightness-125 ${p.cls} ${theta===p.t ? 'ring-2 ring-white/30 brightness-110' : 'opacity-75'}`}>
              {p.label}
            </button>
          ))}
        </div>
        <svg viewBox="0 0 300 195" className="w-full">
          <polygon points={`${CX},${CY} ${AX.toFixed(1)},${AY.toFixed(1)} ${BX.toFixed(1)},${BY.toFixed(1)}`} fill={COL.fill} stroke={COL.stroke} strokeWidth="2.2" strokeLinejoin="round"/>
          <path d={arcPath} fill="none" stroke="#eab308" strokeWidth="1.8"/>
          <text x={CX} y={CY + arcR + 14} textAnchor="middle" fill="#eab308" fontSize="11" fontWeight="bold" fontFamily="sans-serif" {...SK}>θ={theta}°</text>
          {type === 'right' && <polyline points={rmPts} fill="none" stroke="#94a3b8" strokeWidth="1.8"/>}
          <text x={(CX+AX)/2-9} y={(CY+AY)/2} textAnchor="end" fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="sans-serif" {...SK}>a=5</text>
          <text x={(CX+BX)/2+9} y={(CY+BY)/2} textAnchor="start" fill="#4ade80" fontSize="11" fontWeight="bold" fontFamily="sans-serif" {...SK}>b=5</text>
          <text x={(AX+BX)/2} y={Math.min(AY+17, 185)} textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="sans-serif" {...SK}>c={c}</text>
          <circle cx={CX} cy={CY} r="4.5" fill={COL.stroke} opacity="0.9"/>
          <circle cx={AX.toFixed(1)} cy={AY.toFixed(1)} r="4" fill="#60a5fa" opacity="0.8"/>
          <circle cx={BX.toFixed(1)} cy={BY.toFixed(1)} r="4" fill="#4ade80" opacity="0.8"/>
          <text x={CX} y={CY-9} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">C</text>
          <text x={Math.max(AX-10, 2)} y={Math.min(AY+12, 192)} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">A</text>
          <text x={Math.min(BX+3, 285)} y={Math.min(BY+12, 192)} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">B</text>
          <line x1="224" y1={BASE_Y} x2="292" y2={BASE_Y} stroke="#475569" strokeWidth="1"/>
          <rect x="224" y={BASE_Y - abBar} width="24" height={abBar} fill="rgba(59,130,246,0.55)" rx="2"/>
          <text x="236" y={BASE_Y - abBar - 12} textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">{abSq}</text>
          <text x="237" y={BASE_Y - abBar - 3} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">a²+b²</text>
          <rect x="256" y={BASE_Y - cBar} width="24" height={cBar} fill={COL.barFill} rx="2"/>
          <text x="268" y={BASE_Y - cBar - 12} textAnchor="middle" fill="#fdba74" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">{cSq}</text>
          <text x="270" y={BASE_Y - cBar - 3} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">c²</text>
          <text x="250" y={BASE_Y - Math.max(abBar, cBar)/2} textAnchor="middle" fill={COL.stroke} fontSize="13" fontWeight="bold" fontFamily="monospace" {...SK}>{COL.op}</text>
        </svg>
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-white/60">{t.sliderLabel}</span>
            <span className={`text-sm font-bold px-2 py-0.5 rounded font-mono bg-slate-700/60 ${COL.text}`}>θ = {theta}°</span>
          </div>
          <input type="range" min="1" max="179" step="1" value={theta} onChange={e => setTheta(+e.target.value)} className="w-full cursor-pointer" style={{ accentColor: COL.stroke }}/>
          <div className="flex justify-between text-xs text-slate-500 px-1 font-mono">
            <span>{t.sliderMin}</span><span>{t.sliderMid}</span><span>{t.sliderMax}</span>
          </div>
        </div>
        <div className={`${COL.bg} border ${COL.bd} rounded-xl p-4 space-y-3`}>
          <p className={`font-mono text-base font-bold text-center ${COL.text}`}>{COL.tag}</p>
          <div className="grid grid-cols-3 gap-2 text-center items-center">
            <div className="bg-slate-900/60 rounded-lg p-2 space-y-1">
              <p className="text-xs text-white/40">a² + b²</p>
              <p className="text-blue-300 font-bold text-xl font-mono">{abSq}</p>
              <p className="text-xs text-slate-500">{t.cardFixed}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className={`font-black text-3xl font-mono ${COL.text}`}>{COL.op}</p>
              <p className="text-xs text-white/40 leading-tight text-center">
                {COL.op === '=' ? t.colOpEq : COL.op === '>' ? t.colOpGt : t.colOpLt}
              </p>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2 space-y-1">
              <p className="text-xs text-white/40">c²</p>
              <p className="text-orange-300 font-bold text-xl font-mono">{cSq}</p>
              <p className="text-xs text-slate-500">{t.cardDynamic}</p>
            </div>
          </div>
          <p className="font-body text-xs text-white/60 text-center italic">{COL.desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield/>
      <PageNavigation/>
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3"/>
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title={t.sec_intro}/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introDesc1} <strong className="text-cyan-300">{t.introDesc2}</strong> {t.introDesc3}
                </p>
                <TigaSegitigaSVG/>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="text-cyan-300 font-semibold text-sm">{t.keyTitle}</p>
                  <p className="font-body text-xs text-white/60 mb-2">
                    {language === 'ja'
                      ? <>{t.keyNote2} <InlineMath math="a \leq b \leq c"/> とするとき：</>
                      : <>{t.keyNote} <InlineMath math="c"/> {t.keyNote2} <InlineMath math="a \leq b \leq c"/>:</>
                    }
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-blue-900/30 rounded-lg px-3 py-2">
                      <span className="text-blue-300 text-lg">▪</span>
                      <div>
                        <p className="font-body text-sm text-blue-300 font-bold">{t.right} <InlineMath math="a^2 + b^2 = c^2"/></p>
                        <p className="font-body text-xs text-white/60">{t.rightDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-green-900/30 rounded-lg px-3 py-2">
                      <span className="text-green-300 text-lg">▲</span>
                      <div>
                        <p className="font-body text-sm text-green-300 font-bold">{t.acute} <InlineMath math="a^2 + b^2 > c^2"/></p>
                        <p className="font-body text-xs text-white/60">{t.acuteDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-orange-900/30 rounded-lg px-3 py-2">
                      <span className="text-orange-300 text-lg">▶</span>
                      <div>
                        <p className="font-body text-sm text-orange-300 font-bold">{t.obtuse} <InlineMath math="a^2 + b^2 < c^2"/></p>
                        <p className="font-body text-xs text-white/60">{t.obtuseDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="interaktif" icon={<Target className="w-5 h-5"/>} iconColor="text-pink-400" title={t.sec_interaktif}/>
            {open.includes("interaktif") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg px-4 py-2">
                  <p className="font-body text-xs text-pink-200">{t.animHint}</p>
                </div>
                <SegitigaInteraktif/>
              </div>
            )}
          </div>

          {/* JENIS DETAIL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jenis" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title={t.sec_jenis}/>
            {open.includes("jenis") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.jenisSummary} <InlineMath math="a^2 + b^2"/> {t.jenisSummary2} <InlineMath math="c^2"/>{t.jenisSummary3}<strong className="text-cyan-300">{t.jenisSummary4}</strong>{t.jenisSummary5}
                  </p>
                </div>
                <TriangleTypeChecker/>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.tipTitle} <InlineMath math="c"/> {t.tipEnd}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title={t.sec_contoh1}/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.easy}</p>
                  <p className="font-body text-sm text-white/90">{t.c1Problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">{t.c1Sol} <InlineMath math="a=6, b=8, c=10"/>. {t.c1Sol2} <InlineMath math="a^2+b^2"/> {t.c1Sol3} <InlineMath math="c^2"/>:</p>
                  <BlockMath math="a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100"/>
                  <BlockMath math="c^2 = 10^2 = 100"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">{t.c1Ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title={t.sec_contoh2}/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.medium}</p>
                  <p className="font-body text-sm text-white/90">{t.c2Problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">{t.c2Sol} <InlineMath math="a=5, b=7, c=9"/>.</p>
                  <BlockMath math="a^2 + b^2 = 25 + 49 = 74"/>
                  <BlockMath math="c^2 = 81"/>
                  <p className="font-body text-sm text-white/80">{t.c2Sol3} <InlineMath math="74 < 81"/></p>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">{t.c2Ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title={t.sec_contoh3}/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.hard}</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{t.c3Problem}</p>
                  <div className="space-y-1 mb-3">
                    {[
                      { no: "(1)", sisi: "3 cm, 4 cm, 5 cm" },
                      { no: "(2)", sisi: "6 cm, 7 cm, 10 cm" },
                      { no: "(3)", sisi: "4 cm, 5 cm, 6 cm" },
                      { no: "(4)", sisi: "6 cm, 8 cm, 12 cm" },
                    ].map(({ no, sisi }) => (
                      <p key={no} className="font-body text-sm text-white/90">
                        <span className="text-red-300 font-bold">{no}</span> {sisi}
                      </p>
                    ))}
                  </div>
                  <p className="font-body text-sm text-white/90 font-semibold">{t.c3Question}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      { opt: "a.", label: "(1) dan (2)" },
                      { opt: "b.", label: "(2) dan (3)" },
                      { opt: "c.", label: "(3) dan (4)" },
                      { opt: "d.", label: "(2) dan (4)", correct: true },
                    ].map(({ opt, label, correct }) => (
                      <div key={opt} className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${correct ? "bg-green-900/30 border-green-500/50" : "bg-slate-900/40 border-slate-600/40"}`}>
                        <span className={`font-bold text-sm font-mono ${correct ? "text-green-300" : "text-white/50"}`}>{opt}</span>
                        <span className={`font-body text-sm ${correct ? "text-green-200 font-semibold" : "text-white/70"}`}>{label}</span>
                        {correct && <span className="ml-auto text-green-400 text-xs font-bold">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/70">{t.c3Syarat} <strong className="text-orange-300"><InlineMath math="a^2 + b^2 < c^2"/></strong> {t.c3SyaratDesc} <InlineMath math="c"/> {t.c3SyaratDesc2}</p>
                  {[
                    { label: "(1) 3, 4, 5", math: "3^2 + 4^2 = 9 + 16 = 25 \\quad;\\quad 5^2 = 25", result: "25 = 25", type: t.c3RightLabel, color: "bg-blue-900/30 border-blue-500/30 text-blue-300" },
                    { label: "(2) 6, 7, 10", math: "6^2 + 7^2 = 36 + 49 = 85 \\quad;\\quad 10^2 = 100", result: "85 < 100", type: t.c3ObtLabel + " ✓", color: "bg-orange-900/30 border-orange-500/30 text-orange-300" },
                    { label: "(3) 4, 5, 6", math: "4^2 + 5^2 = 16 + 25 = 41 \\quad;\\quad 6^2 = 36", result: "41 > 36", type: t.c3AcuteLabel, color: "bg-green-900/30 border-green-500/30 text-green-300" },
                    { label: "(4) 6, 8, 12", math: "6^2 + 8^2 = 36 + 64 = 100 \\quad;\\quad 12^2 = 144", result: "100 < 144", type: t.c3ObtLabel + " ✓", color: "bg-orange-900/30 border-orange-500/30 text-orange-300" },
                  ].map(({ label, math, result, type, color }) => (
                    <div key={label} className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                      <p className="font-body text-xs font-bold text-white/60 uppercase tracking-wide">{label}</p>
                      <BlockMath math={math}/>
                      <div className={`border rounded px-3 py-1 ${color.split(" ").slice(0,2).join(" ")}`}>
                        <p className={`font-body text-xs ${color.split(" ")[2]}`}>{result} → <strong>{type}</strong></p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-200 text-center font-bold">{t.c3Ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400" title={t.sec_rangkuman}/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• {t.r_note} <InlineMath math="a \leq b \leq c"/> {t.r_note2} <InlineMath math="a^2+b^2"/> {t.r_note3} <InlineMath math="c^2"/>.</p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-2">
                    <div className="bg-blue-900/40 rounded-lg p-2 text-center"><p className="text-blue-300 font-bold">{t.r_equal}</p><p className="text-white/60">{t.r_equalLabel}</p></div>
                    <div className="bg-green-900/40 rounded-lg p-2 text-center"><p className="text-green-300 font-bold">{t.r_greater}</p><p className="text-white/60">{t.r_greaterLabel}</p></div>
                    <div className="bg-orange-900/40 rounded-lg p-2 text-center"><p className="text-orange-300 font-bold">{t.r_less}</p><p className="text-white/60">{t.r_lessLabel}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JenisSegitigaPage;
