import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, Navigation } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS",
    pageSubtitle: "Di Atas, Di Bawah, atau Tepat di Garis?",
    breadcrumb: "Kelas 8 · Koordinat Kartesius · Materi Matematika",
    introHeader: "🌟 Di Mana Posisimu Terhadap Garis Batas?",
    introBody: "Bayangkan garis pantai sebagai batas antara laut dan daratan. Rumah di sisi mana? Di sisi laut atau daratan? Pertanyaan yang sama muncul di matematika: ketika ada sebuah garis di bidang Kartesius, kita bisa menentukan apakah suatu titik berada",
    introEmph: "di atas, di bawah, atau tepat pada garis",
    introBody2: "tersebut — tanpa perlu menggambar, hanya dengan substitusi koordinat!",
    introFact: "Aplikasi nyata:",
    introFactBody: "Dalam machine learning, algoritma klasifikasi (seperti Support Vector Machine) menentukan apakah data baru berada di sisi positif atau negatif dari garis pemisah — persis konsep yang akan kamu pelajari ini!",
    konsepHeader: "📘 Cara Menentukan Posisi Titik terhadap Garis",
    konsepIntisari: "🎯 Ringkasan Intisari",
    konsepBody: "Untuk menentukan posisi titik",
    konsepBody2: "terhadap garis",
    konsepBody3: ", kita",
    konsepEmph: "substitusikan koordinat P",
    konsepBody4: "ke ekspresi garis dan perhatikan tandanya.",
    metodeHeader: "🔑 Metode Substitusi",
    metodeCalc: "Hitung nilai",
    metodeLalu: ", lalu:",
    pos_pos: "Titik P berada di sisi POSITIF garis",
    pos_zero: "Titik P berada TEPAT PADA garis",
    pos_neg: "Titik P berada di sisi NEGATIF garis",
    visualHeader: "📐 Contoh: Garis y = x (atau x − y = 0)",
    legendLine: "── Garis",
    legendAbove: "● Di atas",
    legendBelow: "● Di bawah",
    legendOn: "● Pada garis",
    sisiNegatif: "Sisi negatif",
    sisiPositif: "Sisi positif",
    padaGaris: "Pada garis",
    diAtasGaris: "(di atas garis y=x)",
    diBawahGaris: "(di bawah garis y=x)",
    warningHeader: "⚠️ Catatan Penting:",
    warningBody: "'Sisi positif' dan 'sisi negatif' bergantung pada cara penulisan persamaan garis. Selalu pastikan garis ditulis dalam bentuk baku",
    warningBody2: "sebelum mensubstitusi.",
    ex1Header: "✏️ Contoh 1 — Mudah",
    ex2Header: "✏️ Contoh 2 — Sedang",
    ex3Header: "✏️ Contoh 3 — Sulit",
    badge_easy: "MUDAH",
    badge_med: "SEDANG",
    badge_hard: "SULIT",
    soal: "📝 Soal",
    pembahasan: "🔍 Pembahasan",
    ex1q: "Tentukan posisi masing-masing titik berikut terhadap garis",
    ex1qb: "a)",
    ex1ans: "✅ A → sisi positif, B → tepat pada garis, C → sisi negatif",
    ex1subst: "Garis:",
    ex1substB: ". Substitusi setiap titik:",
    ex2q: "Garis",
    ex2q2: "memiliki persamaan",
    ex2q3: ". Titik",
    ex2q4: "berada di sisi negatif garis. Tentukan rentang nilai",
    ex2q5: "!",
    ex2body: "P di sisi negatif → substitusi P(k, 4) ke",
    ex2body2: "harus < 0:",
    ex2ans: "✅ Nilai k harus memenuhi",
    ex2ansNote: "Misalnya k = 1, 0, −5 semuanya valid. Tapi k = 3 tidak.",
    ex3q: "Titik",
    ex3q2: "dan",
    ex3q3: "berada di sisi yang sama atau berbeda terhadap garis",
    ex3q4: "? Jelaskan!",
    ex3calcHeader: "Hitung f(A) dan f(B):",
    ex3analHeader: "Analisis:",
    ex3posA: "A di sisi",
    ex3negB: "B di sisi",
    ex3diff: "Tanda berbeda → A dan B di sisi yang",
    ex3diffEmph: "berlawanan",
    ex3rule: "Aturan umum:",
    ex3sameRule: "f(A) × f(B) > 0 → A dan B di sisi yang",
    ex3sameSide: "sama",
    ex3diffRule: "f(A) × f(B) < 0 → A dan B di sisi yang",
    ex3diffSide: "berbeda",
    ex3diffGaris: "(garis memisahkan keduanya)",
    ex3check: "Cek: f(A) × f(B) = 2 × (−12) = −24 < 0 ✓ (berbeda sisi)",
    ex3ans: "✅ A dan B berada di sisi yang",
    ex3ansEmph: "BERBEDA",
    ex3ansSuffix: "terhadap garis 3x + 2y − 6 = 0",
    rangHeader: "📌 Rangkuman",
    rangProsedur: "Prosedur Menentukan Posisi Titik P(x₀,y₀) terhadap Garis ax+by+c=0",
    step1: "Tulis garis dalam bentuk baku ax + by + c = 0",
    step2: "Substitusikan x₀ dan y₀ ke dalam ax + by + c",
    step3: "Hitung hasilnya: positif, nol, atau negatif?",
    step4: "f(P) > 0 → sisi positif | f(P) = 0 → pada garis | f(P) < 0 → sisi negatif",
    rangSameHeader: "🔄 Menentukan apakah dua titik di sisi yang sama:",
    rangSameBody: "Hitung f(A) dan f(B). Jika",
    rangSameSide: "sisi sama. Jika",
    rangDiffSide: "sisi berbeda.",
    rangkumanJudul: "Rangkuman — Posisi Relatif Titik terhadap Garis",
    rangkumanSubjudul: "Cara menentukan di sisi mana sebuah titik berada terhadap suatu garis",
    r1judul: "Fungsi Penentu f(P)",
    r1isi: "Substitusikan koordinat titik P(xₚ,yₚ) ke persamaan garis ax+by+c=0 → hasilkan nilai f(P) = axₚ + byₚ + c.",
    r2judul: "f(P) = 0 → Di Garis",
    r2isi: "Jika nilai f(P) tepat nol, titik P memenuhi persamaan garis sehingga P berada tepat pada garis tersebut.",
    r3judul: "f(P) > 0 → Sisi Positif",
    r3isi: "Nilai f(P) positif berarti titik P berada di sisi positif garis (umumnya di atas atau di kiri, tergantung koefisien).",
    r4judul: "f(P) < 0 → Sisi Negatif",
    r4isi: "Nilai f(P) negatif berarti titik P berada di sisi negatif garis (umumnya di bawah atau di kanan garis).",
    tip1: <>Cara cepat: ubah garis ke bentuk baku <strong>ax + by + c = 0</strong>, substitusikan titik, lalu <strong>cukup lihat tandanya</strong> saja. Tidak perlu nilai pasti!</>,
    tip2: <>Trik origin: untuk garis y = mx + c, hitung f(O) = c. Jika c &gt; 0, origin berada di sisi positif. Gunakan ini untuk mengecek orientasi cepat.</>,
    tip3: "Dua titik berada di sisi SAMA jika f(P₁) dan f(P₂) bertanda SAMA (keduanya positif atau keduanya negatif). Berbeda tanda = berbeda sisi.",
    tip4: "Jika ragu, plot titik dan garis di kertas petak. Lalu substitusikan angka — tandanya akan konfirmasi posisi yang terlihat di gambar.",
    kesimpulan: "Menentukan sisi garis menggunakan f(P) adalah teknik yang dipakai dalam grafis komputer (rendering & clipping), game development (collision detection), dan pemrograman AI. Satu substitusi, tanda hasilnya menentukan segalanya!",
    back: "← Kembali ke Koordinat Kartesius",
    rumusLabel1: "Nilai fungsi garis di titik P:",
    rumusLabel2: "Khusus garis y = mx + c:",
  },
  en: {
    pageTitle: "RELATIVE POSITION OF A POINT TO A LINE",
    pageSubtitle: "Above, Below, or Exactly on the Line?",
    breadcrumb: "Grade 8 · Cartesian Coordinates · Math Material",
    introHeader: "🌟 Where Are You Relative to the Boundary Line?",
    introBody: "Imagine the coastline as the boundary between sea and land. Which side is the house on? Sea or land? The same question arises in mathematics: when there is a line on the Cartesian plane, we can determine whether a point is",
    introEmph: "above, below, or exactly on the line",
    introBody2: "— without drawing, just by substituting coordinates!",
    introFact: "Real-world application:",
    introFactBody: "In machine learning, classification algorithms (such as Support Vector Machine) determine whether new data is on the positive or negative side of a separator line — exactly the concept you will learn here!",
    konsepHeader: "📘 How to Determine the Position of a Point Relative to a Line",
    konsepIntisari: "🎯 Key Summary",
    konsepBody: "To determine the position of point",
    konsepBody2: "relative to line",
    konsepBody3: ", we",
    konsepEmph: "substitute the coordinates of P",
    konsepBody4: "into the line expression and observe the sign.",
    metodeHeader: "🔑 Substitution Method",
    metodeCalc: "Calculate the value",
    metodeLalu: ", then:",
    pos_pos: "Point P is on the POSITIVE side of the line",
    pos_zero: "Point P lies EXACTLY ON the line",
    pos_neg: "Point P is on the NEGATIVE side of the line",
    visualHeader: "📐 Example: Line y = x (or x − y = 0)",
    legendLine: "── Line",
    legendAbove: "● Above",
    legendBelow: "● Below",
    legendOn: "● On line",
    sisiNegatif: "Negative side",
    sisiPositif: "Positive side",
    padaGaris: "On the line",
    diAtasGaris: "(above line y=x)",
    diBawahGaris: "(below line y=x)",
    warningHeader: "⚠️ Important Note:",
    warningBody: "'Positive side' and 'negative side' depend on how the line equation is written. Always make sure the line is written in standard form",
    warningBody2: "before substituting.",
    ex1Header: "✏️ Example 1 — Easy",
    ex2Header: "✏️ Example 2 — Medium",
    ex3Header: "✏️ Example 3 — Hard",
    badge_easy: "EASY",
    badge_med: "MEDIUM",
    badge_hard: "HARD",
    soal: "📝 Problem",
    pembahasan: "🔍 Solution",
    ex1q: "Determine the position of each of the following points relative to the line",
    ex1qb: "a)",
    ex1ans: "✅ A → positive side, B → exactly on the line, C → negative side",
    ex1subst: "Line:",
    ex1substB: ". Substitute each point:",
    ex2q: "Line",
    ex2q2: "has equation",
    ex2q3: ". Point",
    ex2q4: "is on the negative side of the line. Find the range of values of",
    ex2q5: "!",
    ex2body: "P on the negative side → substitute P(k, 4) into",
    ex2body2: "must be < 0:",
    ex2ans: "✅ The value of k must satisfy",
    ex2ansNote: "For example k = 1, 0, −5 are all valid. But k = 3 is not.",
    ex3q: "Points",
    ex3q2: "and",
    ex3q3: "— are they on the same or different sides of the line",
    ex3q4: "? Explain!",
    ex3calcHeader: "Calculate f(A) and f(B):",
    ex3analHeader: "Analysis:",
    ex3posA: "A is on the",
    ex3negB: "B is on the",
    ex3diff: "Different signs → A and B are on",
    ex3diffEmph: "opposite sides",
    ex3rule: "General rule:",
    ex3sameRule: "f(A) × f(B) > 0 → A and B on the",
    ex3sameSide: "same side",
    ex3diffRule: "f(A) × f(B) < 0 → A and B on",
    ex3diffSide: "different sides",
    ex3diffGaris: "(line separates them)",
    ex3check: "Check: f(A) × f(B) = 2 × (−12) = −24 < 0 ✓ (different sides)",
    ex3ans: "✅ A and B are on",
    ex3ansEmph: "DIFFERENT",
    ex3ansSuffix: "sides of the line 3x + 2y − 6 = 0",
    rangHeader: "📌 Summary",
    rangProsedur: "Procedure for Determining Position of Point P(x₀,y₀) relative to Line ax+by+c=0",
    step1: "Write the line in standard form ax + by + c = 0",
    step2: "Substitute x₀ and y₀ into ax + by + c",
    step3: "Calculate the result: positive, zero, or negative?",
    step4: "f(P) > 0 → positive side | f(P) = 0 → on line | f(P) < 0 → negative side",
    rangSameHeader: "🔄 Determining whether two points are on the same side:",
    rangSameBody: "Calculate f(A) and f(B). If",
    rangSameSide: "same side. If",
    rangDiffSide: "different sides.",
    rangkumanJudul: "Summary — Relative Position of a Point to a Line",
    rangkumanSubjudul: "How to determine which side of a line a point is on",
    r1judul: "Determining Function f(P)",
    r1isi: "Substitute coordinates of point P(xₚ,yₚ) into line equation ax+by+c=0 → yields f(P) = axₚ + byₚ + c.",
    r2judul: "f(P) = 0 → On the Line",
    r2isi: "If f(P) is exactly zero, point P satisfies the line equation, so P lies exactly on the line.",
    r3judul: "f(P) > 0 → Positive Side",
    r3isi: "A positive f(P) value means point P is on the positive side of the line (generally above or to the left, depending on coefficients).",
    r4judul: "f(P) < 0 → Negative Side",
    r4isi: "A negative f(P) value means point P is on the negative side of the line (generally below or to the right).",
    tip1: <>Quick method: convert the line to standard form <strong>ax + by + c = 0</strong>, substitute the point, then <strong>just check the sign</strong>. No exact value needed!</>,
    tip2: <>Origin trick: for line y = mx + c, compute f(O) = c. If c &gt; 0, the origin is on the positive side. Use this for quick orientation checks.</>,
    tip3: "Two points are on the SAME side if f(P₁) and f(P₂) have the SAME sign (both positive or both negative). Different signs = different sides.",
    tip4: "If unsure, plot the point and line on graph paper. Then substitute the numbers — the sign will confirm the visually observed position.",
    kesimpulan: "Determining which side of a line using f(P) is a technique used in computer graphics (rendering & clipping), game development (collision detection), and AI programming. One substitution, and the sign determines everything!",
    back: "← Back to Cartesian Coordinates",
    rumusLabel1: "Line function value at point P:",
    rumusLabel2: "For line y = mx + c:",
  },
  ja: {
    pageTitle: "直線に対する点の相対位置",
    pageSubtitle: "線の上・下、または線上にある？",
    breadcrumb: "中学2年 · 直交座標 · 数学教材",
    introHeader: "🌟 境界線に対してどこにいる？",
    introBody: "海岸線を海と陸地の境界として想像してください。家はどちら側？海側？陸地側？数学でも同じ疑問が生まれます：直交座標上に直線があるとき、ある点が",
    introEmph: "直線の上・下、または直線上にある",
    introBody2: "かを、グラフを描かずに座標の代入だけで判定できます！",
    introFact: "実際の応用：",
    introFactBody: "機械学習では、分類アルゴリズム（サポートベクターマシンなど）が新しいデータを境界線の正の側か負の側かを判定します — まさにここで学ぶ概念と同じです！",
    konsepHeader: "📘 直線に対する点の位置の判定方法",
    konsepIntisari: "🎯 要点まとめ",
    konsepBody: "点",
    konsepBody2: "の直線",
    konsepBody3: "に対する位置を判定するには、",
    konsepEmph: "Pの座標を代入",
    konsepBody4: "して符号を確認します。",
    metodeHeader: "🔑 代入法",
    metodeCalc: "値を計算",
    metodeLalu: "、次に：",
    pos_pos: "点Pは直線の正の側にある",
    pos_zero: "点Pは直線上にある",
    pos_neg: "点Pは直線の負の側にある",
    visualHeader: "📐 例：直線 y = x（x − y = 0）",
    legendLine: "── 直線",
    legendAbove: "● 上にある",
    legendBelow: "● 下にある",
    legendOn: "● 線上にある",
    sisiNegatif: "負の側",
    sisiPositif: "正の側",
    padaGaris: "直線上",
    diAtasGaris: "（y=xの上）",
    diBawahGaris: "（y=xの下）",
    warningHeader: "⚠️ 重要な注意：",
    warningBody: "「正の側」と「負の側」は方程式の書き方に依存します。代入前に必ず直線を標準形",
    warningBody2: "に変換してください。",
    ex1Header: "✏️ 例題1 — 基本",
    ex2Header: "✏️ 例題2 — 標準",
    ex3Header: "✏️ 例題3 — 発展",
    badge_easy: "基本",
    badge_med: "標準",
    badge_hard: "発展",
    soal: "📝 問題",
    pembahasan: "🔍 解説",
    ex1q: "次の各点の直線に対する位置を判定しなさい",
    ex1qb: "a)",
    ex1ans: "✅ A → 正の側, B → 直線上, C → 負の側",
    ex1subst: "直線：",
    ex1substB: "。各点を代入：",
    ex2q: "直線",
    ex2q2: "は方程式",
    ex2q3: "を持ちます。点",
    ex2q4: "が直線の負の側にある場合、",
    ex2q5: "の範囲を求めなさい！",
    ex2body: "Pが負の側 → P(k, 4)を",
    ex2body2: "に代入して < 0 でなければならない：",
    ex2ans: "✅ k の値は次を満たす必要がある",
    ex2ansNote: "例えば k = 1, 0, −5 はすべて有効。k = 3 は無効。",
    ex3q: "点",
    ex3q2: "と",
    ex3q3: "は直線",
    ex3q4: "に対して同じ側にありますか、それとも異なる側にありますか？説明してください！",
    ex3calcHeader: "f(A) と f(B) を計算：",
    ex3analHeader: "分析：",
    ex3posA: "Aは",
    ex3negB: "Bは",
    ex3diff: "符号が異なる → A と B は",
    ex3diffEmph: "反対側",
    ex3rule: "一般ルール：",
    ex3sameRule: "f(A) × f(B) > 0 → AとBは",
    ex3sameSide: "同じ側",
    ex3diffRule: "f(A) × f(B) < 0 → AとBは",
    ex3diffSide: "異なる側",
    ex3diffGaris: "（直線が2点を分割）",
    ex3check: "確認：f(A) × f(B) = 2 × (−12) = −24 < 0 ✓（異なる側）",
    ex3ans: "✅ A と B は直線 3x + 2y − 6 = 0 に対して",
    ex3ansEmph: "異なる側",
    ex3ansSuffix: "にあります",
    rangHeader: "📌 まとめ",
    rangProsedur: "直線 ax+by+c=0 に対する点 P(x₀,y₀) の位置判定手順",
    step1: "直線を標準形 ax + by + c = 0 に変換する",
    step2: "x₀ と y₀ を ax + by + c に代入する",
    step3: "結果を計算：正、ゼロ、または負？",
    step4: "f(P) > 0 → 正の側 | f(P) = 0 → 直線上 | f(P) < 0 → 負の側",
    rangSameHeader: "🔄 2点が同じ側かどうかの判定：",
    rangSameBody: "f(A) と f(B) を計算する。",
    rangSameSide: "なら同じ側。",
    rangDiffSide: "なら異なる側。",
    rangkumanJudul: "まとめ — 直線に対する点の相対位置",
    rangkumanSubjudul: "点が直線のどちら側にあるかの判定方法",
    r1judul: "判定関数 f(P)",
    r1isi: "点P(xₚ,yₚ)の座標を直線方程式 ax+by+c=0 に代入 → f(P) = axₚ + byₚ + c の値を求める。",
    r2judul: "f(P) = 0 → 直線上",
    r2isi: "f(P) がちょうどゼロの場合、点P は直線の方程式を満たすので、P は直線上にあります。",
    r3judul: "f(P) > 0 → 正の側",
    r3isi: "f(P) が正の値は、点Pが直線の正の側にあることを意味します（係数により、一般に上側または左側）。",
    r4judul: "f(P) < 0 → 負の側",
    r4isi: "f(P) が負の値は、点Pが直線の負の側にあることを意味します（一般に下側または右側）。",
    tip1: <>素早い方法：直線を標準形 <strong>ax + by + c = 0</strong> に変換し、点を代入して、<strong>符号だけ確認</strong>。正確な値は不要！</>,
    tip2: <>原点トリック：y = mx + c の直線に対し、f(O) = c を計算。c &gt; 0 なら原点は正の側。方向の素早い確認に使えます。</>,
    tip3: "f(P₁) と f(P₂) の符号が同じ（両方正または両方負）なら同じ側。符号が異なれば異なる側。",
    tip4: "不明な場合は、点と直線を方眼紙にプロットし、数値を代入してください — 符号が視覚的に見える位置を確認します。",
    kesimpulan: "f(P) を使った直線の側面判定は、コンピュータグラフィックス（レンダリング＆クリッピング）、ゲーム開発（衝突検出）、AI プログラミングで使用される技術です。1回の代入で、その符号がすべてを決定します！",
    back: "← 直交座標に戻る",
    rumusLabel1: "点Pにおける直線関数の値：",
    rumusLabel2: "直線 y = mx + c の場合：",
  },
};

const PosisiRelatifGarisPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (id: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const LinePointGrid = ({ slope, intercept, points }: {
    slope: number; intercept: number;
    points: { x: number; y: number; label: string; side: "atas" | "bawah" | "pada" }[];
  }) => {
    const size = 5; const cellPx = 22; const total = size * 2;
    const toCell = (v: number) => (v + size) * cellPx;
    const sideColors: Record<string, string> = { atas: "bg-cyan-400", bawah: "bg-pink-400", pada: "bg-green-400" };
    const textColors: Record<string, string> = { atas: "text-cyan-300", bawah: "text-pink-300", pada: "text-green-300" };

    const linePoints: [number, number][] = [];
    for (let xi = -size; xi <= size; xi++) {
      const yi = slope * xi + intercept;
      if (yi >= -size && yi <= size) linePoints.push([xi, yi]);
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative border border-white/20 rounded-lg overflow-hidden"
          style={{ width: total * cellPx, height: total * cellPx, background: "rgba(15,23,42,0.85)" }}>
          {Array.from({ length: total + 1 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="absolute" style={{ left: i * cellPx, top: 0, width: 1, height: total * cellPx, background: i === size ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)" }} />
              <div className="absolute" style={{ top: i * cellPx, left: 0, height: 1, width: total * cellPx, background: i === size ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)" }} />
            </React.Fragment>
          ))}
          {linePoints.length >= 2 && (() => {
            const [x0, y0] = linePoints[0];
            const [x1, y1] = linePoints[linePoints.length - 1];
            const ax = toCell(x0); const ay = toCell(-y0);
            const bx = toCell(x1); const by = toCell(-y1);
            const dx = bx - ax; const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return <div className="absolute z-10 origin-left" style={{ left: ax, top: ay, width: len, height: 2, background: "#a78bfa", transform: `rotate(${angle}deg)`, opacity: 0.9 }} />;
          })()}
          {points.map(({ x, y, label, side }) => (
            <div key={label}>
              <div className={`absolute rounded-full ${sideColors[side]} border-2 border-white/80 z-20`}
                style={{ width: 8, height: 8, left: toCell(x) - 4, top: toCell(-y) - 4 }} />
              <span className={`absolute font-mono font-bold z-20 ${textColors[side]}`}
                style={{ fontSize: 8, left: toCell(x) + 5, top: toCell(-y) - 12, whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center text-xs font-mono">
          <span className="text-violet-300">{t.legendLine}</span>
          <span className="text-cyan-300">{t.legendAbove}</span>
          <span className="text-pink-300">{t.legendBelow}</span>
          <span className="text-green-300">{t.legendOn}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.pageSubtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introBody} <strong className="text-cyan-300">{t.introEmph}</strong> {t.introBody2}
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.introFact}</strong> {t.introFactBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Navigation className="w-5 h-5" />} iconColor="text-violet-400" title={t.konsepHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.konsepIntisari}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.konsepBody} <InlineMath math="P(x_0, y_0)" /> {t.konsepBody2} <InlineMath math="ax + by + c = 0" />{t.konsepBody3} <strong className="text-violet-300">{t.konsepEmph}</strong> {t.konsepBody4}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase mb-1">{t.metodeHeader}</p>
                  <p className="font-body text-xs text-white/60">{t.metodeCalc} <InlineMath math="f(P) = ax_0 + by_0 + c" />{t.metodeLalu}</p>
                  <div className="space-y-2 text-xs font-body">
                    {[
                      { kondisi: "f(P) > 0", arti: t.pos_pos, bg: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
                      { kondisi: "f(P) = 0", arti: t.pos_zero, bg: "bg-green-900/40 border-green-500/40 text-green-200" },
                      { kondisi: "f(P) < 0", arti: t.pos_neg, bg: "bg-pink-900/40 border-pink-500/40 text-pink-200" },
                    ].map(({ kondisi, arti, bg }) => (
                      <div key={kondisi} className={`border ${bg} rounded-lg p-3 flex gap-3 items-center`}>
                        <span className="font-mono font-bold text-sm min-w-[70px]">{kondisi}</span>
                        <span className="text-white/70">{arti}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-violet-500/20 rounded-xl p-4 flex flex-col items-center gap-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase">{t.visualHeader}</p>
                  <LinePointGrid
                    slope={1} intercept={0}
                    points={[
                      { x: -3, y: 2, label: "A(−3,2)", side: "atas" },
                      { x: 3, y: -1, label: "B(3,−1)", side: "bawah" },
                      { x: 2, y: 2, label: "C(2,2)", side: "pada" },
                    ]}
                  />
                  <div className="grid grid-cols-3 gap-2 w-full text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold">A(−3, 2)</p>
                      <p className="text-white/60">f(A) = −3−2 = −5</p>
                      <p className="text-cyan-300">{t.sisiNegatif}</p>
                      <p className="text-white/40 text-xs">{t.diAtasGaris}</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold">C(2, 2)</p>
                      <p className="text-white/60">f(C) = 2−2 = 0</p>
                      <p className="text-green-300">{t.padaGaris}</p>
                    </div>
                    <div className="bg-pink-900/30 border border-pink-500/30 rounded-lg p-2 text-center">
                      <p className="text-pink-300 font-bold">B(3, −1)</p>
                      <p className="text-white/60">f(B) = 3−(−1) = 4</p>
                      <p className="text-pink-300">{t.sisiPositif}</p>
                      <p className="text-white/40 text-xs">{t.diBawahGaris}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs font-body">
                  <p className="text-yellow-200 font-bold mb-1">{t.warningHeader}</p>
                  <p className="text-yellow-100/80">{t.warningBody} <InlineMath math="ax + by + c = 0" /> {t.warningBody2}</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex1q} <InlineMath math="2x + y - 4 = 0" />:<br />
                    {t.ex1qb} <InlineMath math="A(3, 2)" />&nbsp;&nbsp;b) <InlineMath math="B(1, 2)" />&nbsp;&nbsp;c) <InlineMath math="C(-1, 0)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70 mb-2">{t.ex1subst} <InlineMath math="f(x,y) = 2x + y - 4" />{t.ex1substB}</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-pink-900/20 border border-pink-500/20 rounded p-2">
                        <p className="text-pink-300">a) f(A) = 2(3) + 2 − 4 = 6 + 2 − 4 = <strong>4 &gt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">→ A: <strong className="text-pink-300">{t.sisiPositif}</strong></p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                        <p className="text-green-300">b) f(B) = 2(1) + 2 − 4 = 2 + 2 − 4 = <strong>0</strong></p>
                        <p className="text-white/60 mt-0.5">→ B: <strong className="text-green-300">{t.padaGaris}</strong></p>
                      </div>
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2">
                        <p className="text-cyan-300">c) f(C) = 2(−1) + 0 − 4 = −2 + 0 − 4 = <strong>−6 &lt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">→ C: <strong className="text-cyan-300">{t.sisiNegatif}</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex1ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_med} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex2q} <InlineMath math="\ell" /> {t.ex2q2} <InlineMath math="x - 2y + 6 = 0" />. {t.ex2q3} <InlineMath math="P(k, 4)" /> {t.ex2q4} <InlineMath math="k" />{t.ex2q5}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">{t.ex2body} <InlineMath math="f(x,y) = x - 2y + 6" /> {t.ex2body2}</p>
                      <BlockMath math="f(P) = k - 2(4) + 6 < 0" />
                      <BlockMath math="k - 8 + 6 < 0" />
                      <BlockMath math="k - 2 < 0 \Rightarrow k < 2" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex2ans} <InlineMath math="k < 2" /></p>
                      <p className="text-white/60 text-xs mt-1">{t.ex2ansNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex3q} <InlineMath math="A(2, 1)" /> {t.ex3q2} <InlineMath math="B(-4, 3)" /> {t.ex3q3} <InlineMath math="3x + 2y - 6 = 0" />{t.ex3q4}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.ex3calcHeader}</p>
                      <BlockMath math="f(A) = 3(2) + 2(1) - 6 = 6 + 2 - 6 = 2" />
                      <BlockMath math="f(B) = 3(-4) + 2(3) - 6 = -12 + 6 - 6 = -12" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.ex3analHeader}</p>
                      <p className="text-white/70 text-xs">f(A) = 2 &gt; 0 → {t.ex3posA} <strong className="text-pink-300">{t.sisiPositif}</strong></p>
                      <p className="text-white/70 text-xs">f(B) = −12 &lt; 0 → {t.ex3negB} <strong className="text-cyan-300">{t.sisiNegatif}</strong></p>
                      <p className="text-white/70 text-xs mt-2">{t.ex3diff} <strong className="text-yellow-300">{t.ex3diffEmph}</strong>!</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs font-body">
                      <p className="text-white/60 mb-1">💡 <strong>{t.ex3rule}</strong></p>
                      <p className="text-white/60">• {t.ex3sameRule} <strong className="text-green-300">{t.ex3sameSide}</strong></p>
                      <p className="text-white/60">• {t.ex3diffRule} <strong className="text-red-300">{t.ex3diffSide}</strong> {t.ex3diffGaris}</p>
                      <p className="text-white/60 mt-1">{t.ex3check}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex3ans} <strong>{t.ex3ansEmph}</strong> {t.ex3ansSuffix}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.rangHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-cyan-300 font-semibold text-xs uppercase">{t.rangProsedur}</p>
                  <div className="space-y-2 text-xs">
                    {[
                      { step: "1", desc: t.step1, color: "text-cyan-300" },
                      { step: "2", desc: t.step2, color: "text-violet-300" },
                      { step: "3", desc: t.step3, color: "text-green-300" },
                      { step: "4", desc: t.step4, color: "text-orange-300" },
                    ].map(({ step, desc, color }) => (
                      <div key={step} className="flex gap-2">
                        <span className={`font-display font-bold ${color} shrink-0`}>{step}.</span>
                        <p className="text-white/70">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs font-body">
                  <p className="text-white/70 font-semibold mb-1">{t.rangSameHeader}</p>
                  <p className="text-white/60">{t.rangSameBody} <strong className="text-green-300">f(A) × f(B) &gt; 0</strong>: {t.rangSameSide} <strong className="text-red-300">f(A) × f(B) &lt; 0</strong>: {t.rangDiffSide}</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RANGKUMAN ═══ */}
          <RangkumanSection
            gradientFrom="from-violet-600" gradientVia="via-purple-600" gradientTo="to-fuchsia-700"
            borderColor="border-violet-500/30" accentColor="text-violet-200"
            headerIcon="📋" judul={t.rangkumanJudul}
            subjudul={t.rangkumanSubjudul}
            ringkasan={[
              { emoji:"📝", judul: t.r1judul, bg:"bg-violet-900/40", border:"border-violet-500/30", textColor:"text-violet-300", isi: t.r1isi },
              { emoji:"✅", judul: t.r2judul, bg:"bg-green-900/40", border:"border-green-500/30", textColor:"text-green-300", isi: t.r2isi },
              { emoji:"➕", judul: t.r3judul, bg:"bg-sky-900/40", border:"border-sky-500/30", textColor:"text-sky-300", isi: t.r3isi },
              { emoji:"➖", judul: t.r4judul, bg:"bg-pink-900/40", border:"border-pink-500/30", textColor:"text-pink-300", isi: t.r4isi },
            ]}
            rumus={[
              { label: t.rumusLabel1, rumus:"f(P) = ax_P + by_P + c", bg:"bg-violet-900/30", border:"border-violet-500/25", labelColor:"text-violet-300" },
              { label: t.rumusLabel2, rumus:"f(P) = y_P - (mx_P + c)", bg:"bg-purple-900/30", border:"border-purple-500/25", labelColor:"text-purple-300" },
            ]}
            tips={[
              { emoji:"🧠", teks: t.tip1 },
              { emoji:"🎯", teks: t.tip2 },
              { emoji:"✅", teks: t.tip3 },
              { emoji:"📐", teks: t.tip4 },
            ]}
            kesimpulan={t.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20"
            kesimpulanBorder="border-violet-400/40"
            kesimpulanTextColor="text-violet-100/90"
          />

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifGarisPage;
