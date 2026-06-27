import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, MapPin, Navigation, MousePointerClick } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { InteraktifTitikAcuan, InteraktifGaris } from "@/components/PosisiRelatifInteraktif";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const T = {
  id: {
    pageTitle: "POSISI RELATIF TITIK TERHADAP TITIK ACUAN DAN SUATU GARIS",
    pageSubtitle: "Dua Perspektif Posisi: Dari Titik & Dari Garis!",
    breadcrumb: "Kelas 8 · Koordinat Kartesius · Materi Matematika",
    part1Header: "📍 Bagian 1 — Posisi Relatif terhadap Titik Acuan",
    part1Intisari: "🎯 Ringkasan Intisari",
    part1Body: "Jika",
    part1BodyMid: "adalah titik acuan dan",
    part1BodyEnd: "adalah titik yang dicari posisinya, maka posisi B relatif terhadap A dinyatakan sebagai selisih koordinat.",
    part1FormulaLabel: "Selisih koordinat (posisi B terhadap A):",
    part1AnimHeader: "🎮 Animasi Interaktif — Seret Titik Acuan & Titik B",
    part1AnimBody: "Geser titik A (acuan) dan titik B — arah dan selisih koordinat otomatis diperbarui!",
    part1ReadHeader: "🧭 Cara Membaca Hasil (Δx, Δy):",
    dx_pos: "B di KANAN A",
    dx_neg: "B di KIRI A",
    dy_pos: "B di ATAS A",
    dy_neg: "B di BAWAH A",
    part2Header: "📐 Bagian 2 — Posisi Relatif terhadap Garis",
    part2Intisari: "🎯 Ringkasan Intisari",
    part2Body: "Untuk menentukan posisi titik",
    part2BodyMid: "terhadap garis",
    part2BodyEnd: ", substitusikan koordinat P ke ekspresi garis.",
    part2MetodeHeader: "🔑 Metode Substitusi",
    part2MetodeCalc: "Hitung nilai",
    part2MetodeLalu: ", lalu:",
    pos_pos: "P di sisi POSITIF garis",
    pos_zero: "P TEPAT PADA garis",
    pos_neg: "P di sisi NEGATIF garis",
    part2AnimHeader: "🎮 Animasi Interaktif — Seret Garis & Titik P",
    part2AnimBody: "Geser L₁, L₂ untuk mengubah garis, dan titik P — posisi P otomatis ditentukan!",
    part2ReadHeader: "🧭 Cara Membaca Nilai f(P):",
    fpos: "f(P) > 0 → Sisi POSITIF",
    fzero: "f(P) = 0 → TEPAT PADA garis",
    fneg: "f(P) < 0 → Sisi NEGATIF",
    fposDesc: "Titik P berada di sisi positif garis (di atas atau di bawah bergantung penulisan persamaan)",
    fzeroDesc: "Koordinat titik P memenuhi persamaan garis — titik P tepat berada di atasnya",
    fnegDesc: "Titik P berada di sisi negatif garis (berlawanan dengan sisi positif)",
    warningHeader: "⚠️ Catatan Penting:",
    warningBody: '"Sisi positif" dan "sisi negatif" bergantung pada cara penulisan persamaan garis. Selalu pastikan garis ditulis dalam bentuk baku',
    warningBody2: "sebelum mensubstitusi.",
    ex1aHeader: "✏️ Contoh 1 — Mudah (Posisi terhadap Titik Acuan)",
    ex2aHeader: "✏️ Contoh 2 — Sedang (Posisi terhadap Titik Acuan)",
    ex3aHeader: "✏️ Contoh 3 — Sulit (Posisi terhadap Titik Acuan)",
    ex1bHeader: "✏️ Contoh 1 — Mudah (Posisi terhadap Garis)",
    ex2bHeader: "✏️ Contoh 2 — Sedang (Posisi terhadap Garis)",
    ex3bHeader: "✏️ Contoh 3 — Sulit (Posisi terhadap Garis)",
    badge_easy: "MUDAH", badge_med: "SEDANG", badge_hard: "SULIT",
    soal: "📝 Soal", pembahasan: "🔍 Pembahasan",
    rang1Header: "📌 Rangkuman — Posisi terhadap Titik Acuan",
    rang2Header: "📌 Rangkuman — Posisi Titik terhadap Garis",
    rangkumanJudul: "Rangkuman — Posisi Relatif Titik dan Garis",
    rangkumanSubjudul: "Gabungan dua teknik: posisi terhadap titik acuan dan posisi terhadap garis",
    back: "← Kembali ke Koordinat Kartesius",
    sisiPositif: "sisi positif",
    sisiNegatif: "sisi negatif",
    tepat: "tepat pada garis",
    r1judul: "Posisi vs Titik Acuan (Δx, Δy)", r1isi: "Δx = xB − xA (arah mendatar), Δy = yB − yA (arah tegak). Positif = kanan/atas, negatif = kiri/bawah.",
    r2judul: "Posisi vs Garis f(P)", r2isi: "Substitusikan P ke f(x,y)=ax+by+c. Hasilnya: f(P)>0 sisi positif, f(P)=0 di garis, f(P)<0 sisi negatif.",
    r3judul: "Dua Teknik Saling Melengkapi", r3isi: "Titik acuan: analisis vektor arah (Δx,Δy). Garis: analisis fungsi substitusi. Keduanya menjawab pertanyaan berbeda tentang posisi.",
    r4judul: "Aplikasi Gabungan", r4isi: "Di pemetaan & CAD: tentukan posisi gedung (titik) relatif terhadap jalan (garis acuan) dan batas wilayah (garis fungsi).",
    tip1: <>Dua rumus satu langkah: <strong>Titik acuan → TUJUAN − ACUAN</strong>. <strong>Garis → substitusi → cek tanda</strong>. Hafal keduanya!</>,
    tip2: <>Δx &gt; 0 (kanan) | Δx &lt; 0 (kiri) | Δy &gt; 0 (atas) | Δy &lt; 0 (bawah). f(P) &gt; 0 (sisi +) | f(P)=0 (di garis) | f(P) &lt; 0 (sisi −).</>,
    tip3: "Gabungkan keduanya: tentukan arah titik dari titik acuan (Δx,Δy), lalu cek apakah titik itu di atas/bawah garis batas dengan f(P). Teknik double-check!",
    tip4: "Untuk soal ujian: baca soal dua kali. Jika pertanyaan 'posisi dari titik' → gunakan Δx,Δy. Jika 'di sisi mana terhadap garis' → gunakan f(P).",
    kesimpulan: "Dua teknik posisi relatif ini adalah fondasi sistem koordinat di robotika, drone navigation, dan GIS (Geographic Information System). Titik dan garis — dua konsep sederhana yang menggambarkan seluruh tata ruang dua dimensi!",
    rumusLabel1: "Posisi relatif terhadap titik acuan A:", rumusLabel2: "Posisi relatif terhadap garis ax+by+c=0:",
    rang1ProseLabel: "Prosedur — Posisi B terhadap A:",
    rang2ProseLabel: "Prosedur Menentukan Posisi Titik P(x₀,y₀) terhadap Garis ax+by+c=0",
    rang2SameHeader: "🔄 Dua titik di sisi yang sama:",
    rang2SameBody: "Jika f(A) × f(B) > 0: sisi sama. Jika f(A) × f(B) < 0: sisi berbeda.",
    acuanLabel: "Titik Acuan",
    posRelLabel: "Posisi B relatif terhadap A:",
    rangTerms1: [["Δx = xB − xA", "Positif → B di kanan A | Negatif → B di kiri A"], ["Δy = yB − yA", "Positif → B di atas A | Negatif → B di bawah A"], ["Keduanya nol", "A dan B berimpit (sama posisi)"]],
    rangTerms2: [["f(P) > 0", "Sisi positif garis"], ["f(P) = 0", "Tepat pada garis"], ["f(P) < 0", "Sisi negatif garis"]],
  },
  en: {
    pageTitle: "RELATIVE POSITION OF A POINT TO A REFERENCE POINT AND A LINE",
    pageSubtitle: "Two Perspectives of Position: From a Point & From a Line!",
    breadcrumb: "Grade 8 · Cartesian Coordinates · Math Material",
    part1Header: "📍 Part 1 — Relative Position to a Reference Point",
    part1Intisari: "🎯 Key Summary",
    part1Body: "If",
    part1BodyMid: "is the reference point and",
    part1BodyEnd: "is the point whose position we seek, then the position of B relative to A is expressed as the difference of their coordinates.",
    part1FormulaLabel: "Coordinate difference (position of B w.r.t. A):",
    part1AnimHeader: "🎮 Interactive Animation — Drag Reference Point & Point B",
    part1AnimBody: "Slide point A (reference) and point B — direction and coordinate difference update automatically!",
    part1ReadHeader: "🧭 Reading the Result (Δx, Δy):",
    dx_pos: "B is to the RIGHT of A",
    dx_neg: "B is to the LEFT of A",
    dy_pos: "B is ABOVE A",
    dy_neg: "B is BELOW A",
    part2Header: "📐 Part 2 — Relative Position to a Line",
    part2Intisari: "🎯 Key Summary",
    part2Body: "To determine the position of point",
    part2BodyMid: "relative to line",
    part2BodyEnd: ", substitute the coordinates of P into the line expression.",
    part2MetodeHeader: "🔑 Substitution Method",
    part2MetodeCalc: "Calculate the value",
    part2MetodeLalu: ", then:",
    pos_pos: "P is on the POSITIVE side of the line",
    pos_zero: "P lies EXACTLY ON the line",
    pos_neg: "P is on the NEGATIVE side of the line",
    part2AnimHeader: "🎮 Interactive Animation — Drag Line & Point P",
    part2AnimBody: "Slide L₁, L₂ to change the line, and point P — position of P is determined automatically!",
    part2ReadHeader: "🧭 Reading the Value f(P):",
    fpos: "f(P) > 0 → POSITIVE Side",
    fzero: "f(P) = 0 → EXACTLY ON the line",
    fneg: "f(P) < 0 → NEGATIVE Side",
    fposDesc: "Point P is on the positive side of the line (above or below depends on how the equation is written)",
    fzeroDesc: "The coordinates of point P satisfy the line equation — P lies exactly on the line",
    fnegDesc: "Point P is on the negative side of the line (opposite the positive side)",
    warningHeader: "⚠️ Important Note:",
    warningBody: '"Positive side" and "negative side" depend on how the line equation is written. Always make sure the line is in standard form',
    warningBody2: "before substituting.",
    ex1aHeader: "✏️ Example 1 — Easy (Position to Reference Point)",
    ex2aHeader: "✏️ Example 2 — Medium (Position to Reference Point)",
    ex3aHeader: "✏️ Example 3 — Hard (Position to Reference Point)",
    ex1bHeader: "✏️ Example 1 — Easy (Position to Line)",
    ex2bHeader: "✏️ Example 2 — Medium (Position to Line)",
    ex3bHeader: "✏️ Example 3 — Hard (Position to Line)",
    badge_easy: "EASY", badge_med: "MEDIUM", badge_hard: "HARD",
    soal: "📝 Problem", pembahasan: "🔍 Solution",
    rang1Header: "📌 Summary — Position to Reference Point",
    rang2Header: "📌 Summary — Position of Point to Line",
    rangkumanJudul: "Summary — Relative Position of Points and Lines",
    rangkumanSubjudul: "Combining two techniques: position relative to a reference point and position relative to a line",
    back: "← Back to Cartesian Coordinates",
    sisiPositif: "positive side",
    sisiNegatif: "negative side",
    tepat: "exactly on the line",
    r1judul: "Position vs Reference Point (Δx, Δy)", r1isi: "Δx = xB − xA (horizontal direction), Δy = yB − yA (vertical direction). Positive = right/up, negative = left/down.",
    r2judul: "Position vs Line f(P)", r2isi: "Substitute P into f(x,y)=ax+by+c. Result: f(P)>0 positive side, f(P)=0 on line, f(P)<0 negative side.",
    r3judul: "Two Complementary Techniques", r3isi: "Reference point: direction vector analysis (Δx,Δy). Line: substitution function analysis. Both answer different questions about position.",
    r4judul: "Combined Application", r4isi: "In mapping & CAD: determine position of a building (point) relative to a road (reference line) and territory boundary (function line).",
    tip1: <>Two formulas in one step: <strong>Reference point → DESTINATION − REFERENCE</strong>. <strong>Line → substitute → check sign</strong>. Memorize both!</>,
    tip2: <>Δx &gt; 0 (right) | Δx &lt; 0 (left) | Δy &gt; 0 (up) | Δy &lt; 0 (down). f(P) &gt; 0 (+side) | f(P)=0 (on line) | f(P) &lt; 0 (−side).</>,
    tip3: "Combine both: determine direction of point from reference point (Δx,Δy), then check if the point is above/below the boundary line with f(P). Double-check technique!",
    tip4: "For exams: read the question twice. If asking 'position from a point' → use Δx,Δy. If asking 'which side of a line' → use f(P).",
    kesimpulan: "These two relative position techniques are the foundation of coordinate systems in robotics, drone navigation, and GIS (Geographic Information System). Points and lines — two simple concepts that describe the entire two-dimensional space!",
    rumusLabel1: "Relative position to reference point A:", rumusLabel2: "Relative position to line ax+by+c=0:",
    rang1ProseLabel: "Procedure — Position of B relative to A:",
    rang2ProseLabel: "Procedure for determining position of P(x₀,y₀) relative to line ax+by+c=0",
    rang2SameHeader: "🔄 Two points on the same side:",
    rang2SameBody: "If f(A) × f(B) > 0: same side. If f(A) × f(B) < 0: different sides.",
    acuanLabel: "Reference Point",
    posRelLabel: "Position of B relative to A:",
    rangTerms1: [["Δx = xB − xA", "Positive → B right of A | Negative → B left of A"], ["Δy = yB − yA", "Positive → B above A | Negative → B below A"], ["Both zero", "A and B coincide (same position)"]],
    rangTerms2: [["f(P) > 0", "Positive side of line"], ["f(P) = 0", "Exactly on the line"], ["f(P) < 0", "Negative side of line"]],
  },
  ja: {
    pageTitle: "基準点と直線に対する点の相対位置",
    pageSubtitle: "位置の2つの視点：点から & 直線から！",
    breadcrumb: "中学2年 · 直交座標 · 数学教材",
    part1Header: "📍 パート1 — 基準点に対する相対位置",
    part1Intisari: "🎯 要点まとめ",
    part1Body: "",
    part1BodyMid: "が基準点で、",
    part1BodyEnd: "の位置を求める場合、AからみたBの相対位置は座標の差で表されます。",
    part1FormulaLabel: "座標の差（AからみたBの位置）：",
    part1AnimHeader: "🎮 インタラクティブアニメーション — 基準点とBをドラッグ",
    part1AnimBody: "点A（基準）と点Bをスライドさせると、方向と座標の差が自動的に更新されます！",
    part1ReadHeader: "🧭 結果（Δx, Δy）の読み方：",
    dx_pos: "BはAの右にある",
    dx_neg: "BはAの左にある",
    dy_pos: "BはAの上にある",
    dy_neg: "BはAの下にある",
    part2Header: "📐 パート2 — 直線に対する相対位置",
    part2Intisari: "🎯 要点まとめ",
    part2Body: "点",
    part2BodyMid: "の直線",
    part2BodyEnd: "に対する位置を判定するには、Pの座標を直線の式に代入します。",
    part2MetodeHeader: "🔑 代入法",
    part2MetodeCalc: "値を計算",
    part2MetodeLalu: "、次に：",
    pos_pos: "Pは直線の正の側にある",
    pos_zero: "Pは直線上にある",
    pos_neg: "Pは直線の負の側にある",
    part2AnimHeader: "🎮 インタラクティブアニメーション — 直線とPをドラッグ",
    part2AnimBody: "L₁、L₂をスライドして直線を変え、点Pも動かすと、Pの位置が自動的に判定されます！",
    part2ReadHeader: "🧭 f(P)の値の読み方：",
    fpos: "f(P) > 0 → 正の側",
    fzero: "f(P) = 0 → 直線上",
    fneg: "f(P) < 0 → 負の側",
    fposDesc: "点Pは直線の正の側にある（式の書き方により上または下）",
    fzeroDesc: "点Pの座標が直線の方程式を満たす — Pは直線上にある",
    fnegDesc: "点Pは直線の負の側にある（正の側の逆）",
    warningHeader: "⚠️ 重要な注意：",
    warningBody: "「正の側」と「負の側」は方程式の書き方に依存します。代入前に必ず直線を標準形",
    warningBody2: "に変換してください。",
    ex1aHeader: "✏️ 例題1 — 基本（基準点に対する位置）",
    ex2aHeader: "✏️ 例題2 — 標準（基準点に対する位置）",
    ex3aHeader: "✏️ 例題3 — 発展（基準点に対する位置）",
    ex1bHeader: "✏️ 例題1 — 基本（直線に対する位置）",
    ex2bHeader: "✏️ 例題2 — 標準（直線に対する位置）",
    ex3bHeader: "✏️ 例題3 — 発展（直線に対する位置）",
    badge_easy: "基本", badge_med: "標準", badge_hard: "発展",
    soal: "📝 問題", pembahasan: "🔍 解説",
    rang1Header: "📌 まとめ — 基準点に対する位置",
    rang2Header: "📌 まとめ — 直線に対する点の位置",
    rangkumanJudul: "まとめ — 点と直線の相対位置",
    rangkumanSubjudul: "2つの技法の組み合わせ：基準点に対する位置と直線に対する位置",
    back: "← 直交座標に戻る",
    sisiPositif: "正の側",
    sisiNegatif: "負の側",
    tepat: "直線上",
    r1judul: "基準点に対する位置（Δx, Δy）", r1isi: "Δx = xB − xA（水平方向）、Δy = yB − yA（垂直方向）。正 = 右/上、負 = 左/下。",
    r2judul: "直線に対する位置 f(P)", r2isi: "f(x,y)=ax+by+c にPを代入。f(P)>0 → 正の側、f(P)=0 → 直線上、f(P)<0 → 負の側。",
    r3judul: "2つの補完的な技法", r3isi: "基準点：方向ベクトル分析（Δx,Δy）。直線：代入関数分析。両者は位置に関する異なる質問に答える。",
    r4judul: "組み合わせ応用", r4isi: "地図作成・CAD：建物（点）の道路（基準線）と区域境界（関数直線）に対する位置を決定する。",
    tip1: <>2つの公式を1ステップで：<strong>基準点 → 目標 − 基準</strong>。<strong>直線 → 代入 → 符号確認</strong>。両方覚える！</>,
    tip2: <>Δx &gt; 0（右）| Δx &lt; 0（左）| Δy &gt; 0（上）| Δy &lt; 0（下）。f(P) &gt; 0（+側）| f(P)=0（直線上）| f(P) &lt; 0（−側）。</>,
    tip3: "両方を組み合わせる：基準点からの方向（Δx,Δy）を求め、f(P)で境界線の上下を確認する。ダブルチェック技法！",
    tip4: "試験では：問題を2回読む。「点からの位置」なら → Δx,Δy。「直線のどちら側か」なら → f(P)。",
    kesimpulan: "この2つの相対位置技法は、ロボット工学、ドローンナビゲーション、GIS（地理情報システム）の座標系の基礎です。点と直線 — 2次元空間全体を記述する2つのシンプルな概念！",
    rumusLabel1: "基準点Aに対する相対位置：", rumusLabel2: "直線ax+by+c=0に対する相対位置：",
    rang1ProseLabel: "手順 — AからみたBの位置：",
    rang2ProseLabel: "点P(x₀,y₀)の直線ax+by+c=0に対する位置判定手順",
    rang2SameHeader: "🔄 2点が同じ側かどうか：",
    rang2SameBody: "f(A) × f(B) > 0 なら同じ側。f(A) × f(B) < 0 なら異なる側。",
    acuanLabel: "基準点",
    posRelLabel: "AからみたBの相対位置：",
    rangTerms1: [["Δx = xB − xA", "正 → BはAの右 | 負 → BはAの左"], ["Δy = yB − yA", "正 → BはAの上 | 負 → BはAの下"], ["両方ゼロ", "AとBが重なる（同じ位置）"]],
    rangTerms2: [["f(P) > 0", "直線の正の側"], ["f(P) = 0", "直線上"], ["f(P) < 0", "直線の負の側"]],
  },
};

const PosisiRelatifTitikDanGarisPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: React.ReactNode;
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

  /* ── Mini grid untuk visualisasi posisi relatif terhadap titik acuan ── */
  const RelativeGrid = ({ acuan, titik, label }: {
    acuan: [number, number]; titik: [number, number][]; label: string[];
  }) => {
    const size = 5;
    const cellPx = 24;
    const total = size * 2;
    const toCell = (v: number) => v + size;
    const colors = ["bg-cyan-400", "bg-green-400", "bg-yellow-400", "bg-pink-400"];
    const textColors = ["text-cyan-300", "text-green-300", "text-yellow-300", "text-pink-300"];

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
          <div className="absolute z-20 flex items-center justify-center"
            style={{ left: toCell(acuan[0]) * cellPx - 6, top: toCell(-acuan[1]) * cellPx - 6, width: 12, height: 12 }}>
            <div className="w-3 h-3 bg-orange-400 rotate-45 border border-white/80" />
          </div>
          <span className="absolute z-20 font-mono font-bold text-orange-300"
            style={{ fontSize: 8, left: toCell(acuan[0]) * cellPx + 7, top: toCell(-acuan[1]) * cellPx - 12, whiteSpace: "nowrap" }}>
            {t.acuanLabel}({acuan[0]},{acuan[1]})
          </span>
          {titik.map(([tx, ty], i) => {
            const ax = toCell(acuan[0]) * cellPx;
            const ay = toCell(-acuan[1]) * cellPx;
            const bx = toCell(tx) * cellPx;
            const by = toCell(-ty) * cellPx;
            const dx = bx - ax; const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return (
              <div key={i} className="absolute z-10 origin-left opacity-50"
                style={{ left: ax, top: ay, width: len, height: 1, background: ["#22d3ee", "#4ade80", "#facc15", "#f472b6"][i % 4], transform: `rotate(${angle}deg)` }} />
            );
          })}
          {titik.map(([tx, ty], i) => (
            <div key={i}>
              <div className={`absolute rounded-full ${colors[i % 4]} border-2 border-white/80 z-20`}
                style={{ width: 8, height: 8, left: toCell(tx) * cellPx - 4, top: toCell(-ty) * cellPx - 4 }} />
              <span className={`absolute font-mono font-bold z-20 ${textColors[i % 4]}`}
                style={{ fontSize: 8, left: toCell(tx) * cellPx + 5, top: toCell(-ty) * cellPx - 10, whiteSpace: "nowrap" }}>
                {label[i]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <span className="text-orange-300 text-xs font-mono flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-orange-400 rotate-45" />{t.acuanLabel}
          </span>
          {titik.map((_, i) => (
            <span key={i} className={`text-xs font-mono flex items-center gap-1 ${textColors[i % 4]}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${colors[i % 4]}`} />{label[i]}
            </span>
          ))}
        </div>
      </div>
    );
  };

  /* ── Visualisasi titik terhadap garis ── */
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
          <span className="text-violet-300">── Garis</span>
          <span className="text-cyan-300">● Di atas</span>
          <span className="text-pink-300">● Di bawah</span>
          <span className="text-green-300">● Pada garis</span>
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
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.pageSubtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══════════════════════════════════════════════ */}
          {/* BAGIAN 1: POSISI RELATIF TERHADAP TITIK ACUAN */}
          {/* ══════════════════════════════════════════════ */}
          <div className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border border-orange-400/40 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="font-display text-base font-bold text-orange-300 leading-tight">{t.part1Header}</p>
            </div>
          </div>

          {/* INTRO 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro1" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={language === "id" ? "🌟 Bayangkan Ini..." : language === "en" ? "🌟 Imagine This..." : "🌟 想像してみよう..."} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kamu berdiri di alun-alun kota (titik acuan). Temanmu ada di 3 meter ke kananmu dan 5 meter di depanmu. Ini bukan koordinat mutlak terhadap "nol" — ini adalah <strong className="text-cyan-300">posisi relatif</strong> terhadap dirimu sebagai titik acuan. Konsep yang sama digunakan dalam matematika: menentukan letak suatu titik bukan terhadap O(0,0), tapi terhadap <strong className="text-cyan-300">sembarang titik acuan</strong> yang kita pilih!
                </p>
                <div className="rounded-xl overflow-hidden border border-orange-500/20">
                  <img
                    src="/images/posisi-relatif-alunalun.png"
                    alt="Ilustrasi posisi relatif di alun-alun kota"
                    className="w-full object-cover"
                  />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>Aplikasi nyata:</strong> Sistem navigasi kapal, peta militer, permainan strategi, hingga robotika menggunakan konsep posisi relatif. Robot tahu "bergerak 3 langkah ke kanan dari posisi saat ini" — bukan dari titik nol mutlak!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<MapPin className="w-5 h-5" />} iconColor="text-orange-400" title={language === "id" ? "📘 Konsep: Koordinat Relatif terhadap Titik Acuan" : language === "en" ? "📘 Concept: Relative Coordinates to a Reference Point" : "📘 概念：基準点への相対座標"} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jika <InlineMath math="A(x_1, y_1)" /> adalah titik acuan dan <InlineMath math="B(x_2, y_2)" /> adalah titik yang ingin kita tentukan posisinya, maka <strong className="text-cyan-300">posisi B relatif terhadap A</strong> dinyatakan sebagai selisih koordinat B terhadap A.
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 text-center space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-2">📐 Rumus Posisi Relatif</p>
                  <BlockMath math="\text{Posisi B relatif terhadap A} = (x_2 - x_1,\ y_2 - y_1)" />
                  <div className="flex justify-center gap-4 text-xs font-body flex-wrap mt-1">
                    <span className="text-cyan-300"><InlineMath math="x_2 - x_1" /> = selisih horizontal</span>
                    <span className="text-green-300"><InlineMath math="y_2 - y_1" /> = selisih vertikal</span>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF 1 */}
          <div className="bg-card/80 backdrop-blur border border-orange-500/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-3 border-b border-orange-500/20">
              <MousePointerClick className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="font-body font-semibold text-white">🎮 Animasi Interaktif — Seret Titik Acuan & Dua Titik</p>
                <p className="text-white/50 text-xs font-body mt-0.5">Geser titik A (acuan), P, dan Q — posisi relatif otomatis dihitung!</p>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <InteraktifTitikAcuan />
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-body">
                <p className="font-bold text-white mb-2">{t.part1ReadHeader}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { kondisi: "Δx > 0", arti: t.dx_pos, color: "text-cyan-300" },
                    { kondisi: "Δx < 0", arti: t.dx_neg, color: "text-cyan-300" },
                    { kondisi: "Δy > 0", arti: t.dy_pos, color: "text-green-300" },
                    { kondisi: "Δy < 0", arti: t.dy_neg, color: "text-green-300" },
                  ].map(({ kondisi, arti, color }) => (
                    <div key={kondisi} className="bg-slate-700/40 border border-white/10 rounded-lg p-2">
                      <p className={`font-mono font-bold ${color}`}>{kondisi}</p>
                      <p className="text-white/60 mt-0.5">{arti}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 1A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1a" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1aHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    Diketahui titik acuan <InlineMath math="A(3, 2)" /> dan titik <InlineMath math="B(7, 6)" />. Tentukan posisi titik B relatif terhadap titik A, dan jelaskan arahnya!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">{t.posRelLabel}</p>
                    <BlockMath math="\Delta x = x_B - x_A = 7 - 3 = 4" />
                    <BlockMath math="\Delta y = y_B - y_A = 6 - 2 = 4" />
                    <p className="text-white/70">Posisi relatif: <strong className="text-cyan-300">(4, 4)</strong></p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta x = 4 > 0" />: B berada 4 satuan di <strong className="text-cyan-300">kanan</strong> A</p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta y = 4 > 0" />: B berada 4 satuan di <strong className="text-green-300">atas</strong> A</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ Posisi B relatif terhadap A = (4, 4) — 4 satuan ke kanan dan 4 satuan ke atas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2a" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2aHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_med} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    Titik <InlineMath math="P(1, -3)" /> digunakan sebagai titik acuan. Jika titik Q berposisi relatif <InlineMath math="(-4, 5)" /> terhadap P, tentukan koordinat titik Q yang sebenarnya (koordinat mutlaknya)!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">Diketahui posisi relatif Q terhadap P = (−4, 5), artinya:</p>
                    <BlockMath math="x_Q - x_P = -4 \Rightarrow x_Q = x_P + (-4) = 1 + (-4) = -3" />
                    <BlockMath math="y_Q - y_P = 5 \Rightarrow y_Q = y_P + 5 = -3 + 5 = 2" />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
                    <p className="text-yellow-200">💡 <strong>Rumus balik:</strong> Koordinat mutlak = koordinat acuan + posisi relatif</p>
                    <p className="text-white/60 mt-0.5"><InlineMath math="B = A + (\Delta x, \Delta y)" /></p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ Koordinat Q = <InlineMath math="(-3, 2)" /></p>
                    <p className="text-white/60 text-xs mt-1">Cek: Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3a" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3aHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    Diketahui titik-titik <InlineMath math="A(-2, 4)" />, <InlineMath math="B(3, 1)" />, dan <InlineMath math="C(c_1, c_2)" />. Jika posisi C relatif terhadap B sama dengan posisi B relatif terhadap A, tentukan koordinat C!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Hitung posisi B relatif terhadap A:</p>
                      <BlockMath math="\Delta x_{BA} = x_B - x_A = 3 - (-2) = 5" />
                      <BlockMath math="\Delta y_{BA} = y_B - y_A = 1 - 4 = -3" />
                      <p className="text-white/70">Posisi B relatif terhadap A = <strong className="text-cyan-300">(5, −3)</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Terapkan selisih yang sama untuk C relatif terhadap B:</p>
                      <p className="text-white/70">Posisi C relatif terhadap B juga = (5, −3)</p>
                      <BlockMath math="c_1 = x_B + 5 = 3 + 5 = 8" />
                      <BlockMath math="c_2 = y_B + (-3) = 1 - 3 = -2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-white/60">
                      <p className="text-white/70 mb-1">💡 Ini sebenarnya membuat barisan aritmetika 2D: A → B → C dengan selisih (5, −3)!</p>
                      <p>A(−2, 4) → B(3, 1) → C(8, −2)</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ Koordinat C = <InlineMath math="(8, -2)" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman1" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.rang1Header} />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  {[
                    ["Posisi relatif B terhadap A", "(x₂ − x₁, y₂ − y₁)"],
                    ["Koordinat mutlak dari posisi relatif", "B = A + (Δx, Δy)"],
                    ["Δx > 0", "B di KANAN A"],
                    ["Δx < 0", "B di KIRI A"],
                    ["Δy > 0", "B di ATAS A"],
                    ["Δy < 0", "B di BAWAH A"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-xs"><strong>💡 Perbedaan kunci:</strong> Koordinat mutlak selalu dihitung dari O(0,0). Koordinat relatif dihitung dari titik acuan yang dipilih.</p>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════ */}
          {/* BAGIAN 2: POSISI RELATIF TERHADAP GARIS       */}
          {/* ══════════════════════════════════════════════ */}
          <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/40 rounded-xl px-5 py-4 flex items-center gap-3 mt-4">
            <span className="text-2xl">🗺️</span>
            <div>
              <p className="font-display text-base font-bold text-violet-300 leading-tight">{t.part2Header}</p>
            </div>
          </div>

          {/* INTRO 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro2" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={language === "id" ? "🌟 Di Mana Posisimu Terhadap Garis Batas?" : language === "en" ? "🌟 Where Is Your Position Relative to the Boundary Line?" : "🌟 境界線に対する位置はどこ？"} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan garis pantai sebagai batas antara laut dan daratan. Rumah di sisi mana? Di sisi laut atau daratan? Pertanyaan yang sama muncul di matematika: ketika ada sebuah garis di bidang Kartesius, kita bisa menentukan apakah suatu titik berada <strong className="text-cyan-300">di atas, di bawah, atau tepat pada garis</strong> tersebut — tanpa perlu menggambar, hanya dengan substitusi koordinat!
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>Aplikasi nyata:</strong> Dalam machine learning, algoritma klasifikasi (seperti Support Vector Machine) menentukan apakah data baru berada di sisi positif atau negatif dari garis pemisah — persis konsep yang akan kamu pelajari ini!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Navigation className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Cara Menentukan Posisi Titik terhadap Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Untuk menentukan posisi titik <InlineMath math="P(x_0, y_0)" /> terhadap garis <InlineMath math="ax + by + c = 0" />, kita <strong className="text-violet-300">substitusikan koordinat P</strong> ke ekspresi garis dan perhatikan tandanya.
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase mb-1">🔑 Metode Substitusi</p>
                  <p className="font-body text-xs text-white/60">Hitung nilai <InlineMath math="f(P) = ax_0 + by_0 + c" />, lalu:</p>
                  <div className="space-y-2 text-xs font-body">
                    {[
                      { kondisi: "f(P) > 0", arti: "Titik P berada di sisi POSITIF garis", bg: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
                      { kondisi: "f(P) = 0", arti: "Titik P berada TEPAT PADA garis", bg: "bg-green-900/40 border-green-500/40 text-green-200" },
                      { kondisi: "f(P) < 0", arti: "Titik P berada di sisi NEGATIF garis", bg: "bg-pink-900/40 border-pink-500/40 text-pink-200" },
                    ].map(({ kondisi, arti, bg }) => (
                      <div key={kondisi} className={`border ${bg} rounded-lg p-3 flex gap-3 items-center`}>
                        <span className="font-mono font-bold text-sm min-w-[70px]">{kondisi}</span>
                        <span className="text-white/70">{arti}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF 2 */}
          <div className="bg-card/80 backdrop-blur border border-violet-500/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-3 border-b border-violet-500/20">
              <MousePointerClick className="w-5 h-5 text-violet-400 shrink-0" />
              <div>
                <p className="font-body font-semibold text-white">{t.part2AnimHeader}</p>
                <p className="text-white/50 text-xs font-body mt-0.5">{t.part2AnimBody}</p>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <InteraktifGaris />

              {/* Keterangan nilai f(P) */}
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-body">
                <p className="font-bold text-white mb-2">{t.part2ReadHeader}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 bg-pink-900/30 border border-pink-500/30 rounded-lg p-3">
                    <span className="w-4 h-4 rounded-full bg-pink-400 shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-pink-300">{t.fpos}</p>
                      <p className="text-white/60 mt-0.5">{t.fposDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                    <span className="w-4 h-4 rounded-full bg-green-400 shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-green-300">{t.fzero}</p>
                      <p className="text-white/60 mt-0.5">{t.fzeroDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3">
                    <span className="w-4 h-4 rounded-full bg-cyan-400 shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-cyan-300">{t.fneg}</p>
                      <p className="text-white/60 mt-0.5">{t.fnegDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Catatan penting */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs font-body">
                <p className="text-yellow-200 font-bold mb-1">⚠️ Catatan Penting:</p>
                <p className="text-yellow-100/80">"Sisi positif" dan "sisi negatif" bergantung pada cara penulisan persamaan garis. Selalu pastikan garis ditulis dalam bentuk baku <InlineMath math="ax + by + c = 0" /> sebelum mensubstitusi.</p>
              </div>
            </div>
          </div>

          {/* CONTOH 1B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1b" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1bHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    Tentukan posisi masing-masing titik berikut terhadap garis <InlineMath math="2x + y - 4 = 0" />:<br />
                    a) <InlineMath math="A(3, 2)" />&nbsp;&nbsp;b) <InlineMath math="B(1, 2)" />&nbsp;&nbsp;c) <InlineMath math="C(-1, 0)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70 mb-2">Garis: <InlineMath math="f(x,y) = 2x + y - 4" />. Substitusi setiap titik:</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-pink-900/20 border border-pink-500/20 rounded p-2">
                        <p className="text-pink-300">a) f(A) = 2(3) + 2 − 4 = 6 + 2 − 4 = <strong>4 &gt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">→ A berada di <strong className="text-pink-300">sisi positif</strong> garis</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                        <p className="text-green-300">b) f(B) = 2(1) + 2 − 4 = 2 + 2 − 4 = <strong>0</strong></p>
                        <p className="text-white/60 mt-0.5">→ B berada <strong className="text-green-300">tepat pada garis</strong></p>
                      </div>
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2">
                        <p className="text-cyan-300">c) f(C) = 2(−1) + 0 − 4 = −2 + 0 − 4 = <strong>−6 &lt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">→ C berada di <strong className="text-cyan-300">sisi negatif</strong> garis</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ A → sisi positif, B → tepat pada garis, C → sisi negatif</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2b" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2bHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_med} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    Garis <InlineMath math="\ell" /> memiliki persamaan <InlineMath math="x - 2y + 6 = 0" />. Titik <InlineMath math="P(k, 4)" /> berada di sisi negatif garis. Tentukan rentang nilai <InlineMath math="k" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">P di sisi negatif → substitusi P(k, 4) ke <InlineMath math="f(x,y) = x - 2y + 6" /> harus &lt; 0:</p>
                      <BlockMath math="f(P) = k - 2(4) + 6 < 0" />
                      <BlockMath math="k - 8 + 6 < 0" />
                      <BlockMath math="k - 2 < 0 \Rightarrow k < 2" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ Nilai k harus memenuhi <InlineMath math="k < 2" /></p>
                      <p className="text-white/60 text-xs mt-1">Misalnya k = 1, 0, −5 semuanya valid. Tapi k = 3 tidak.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3b" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3bHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    Titik <InlineMath math="A(2, 1)" /> dan <InlineMath math="B(-4, 3)" /> berada di sisi yang sama atau berbeda terhadap garis <InlineMath math="3x + 2y - 6 = 0" />? Jelaskan!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Hitung f(A) dan f(B):</p>
                      <BlockMath math="f(A) = 3(2) + 2(1) - 6 = 6 + 2 - 6 = 2" />
                      <BlockMath math="f(B) = 3(-4) + 2(3) - 6 = -12 + 6 - 6 = -12" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Analisis:</p>
                      <p className="text-white/70 text-xs">f(A) = 2 &gt; 0 → A di sisi <strong className="text-pink-300">positif</strong></p>
                      <p className="text-white/70 text-xs">f(B) = −12 &lt; 0 → B di sisi <strong className="text-cyan-300">negatif</strong></p>
                      <p className="text-white/70 text-xs mt-2">Tanda berbeda → A dan B di sisi yang <strong className="text-yellow-300">berlawanan</strong>!</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs font-body">
                      <p className="text-white/60 mb-1">💡 <strong>Aturan umum:</strong></p>
                      <p className="text-white/60">• f(A) × f(B) &gt; 0 → A dan B di sisi yang <strong className="text-green-300">sama</strong></p>
                      <p className="text-white/60">• f(A) × f(B) &lt; 0 → A dan B di sisi yang <strong className="text-red-300">berbeda</strong></p>
                      <p className="text-white/60 mt-1">Cek: f(A) × f(B) = 2 × (−12) = −24 &lt; 0 ✓ (berbeda sisi)</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ A dan B berada di sisi yang <strong>BERBEDA</strong> terhadap garis 3x + 2y − 6 = 0</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman2" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.rang2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-violet-300 font-semibold text-xs uppercase">{t.rang2ProseLabel}</p>
                  <div className="space-y-2 text-xs">
                    {[
                      { step: "1", desc: language === "id" ? "Tulis garis dalam bentuk baku ax + by + c = 0" : language === "en" ? "Write the line in standard form ax + by + c = 0" : "直線を標準形 ax + by + c = 0 に変換", color: "text-cyan-300" },
                      { step: "2", desc: language === "id" ? "Substitusikan x₀ dan y₀ ke dalam ax + by + c" : language === "en" ? "Substitute x₀ and y₀ into ax + by + c" : "x₀ と y₀ を ax + by + c に代入", color: "text-violet-300" },
                      { step: "3", desc: language === "id" ? "Hitung hasilnya: positif, nol, atau negatif?" : language === "en" ? "Calculate the result: positive, zero, or negative?" : "結果を計算：正、ゼロ、または負？", color: "text-green-300" },
                      { step: "4", desc: language === "id" ? "f(P) > 0 → sisi positif | f(P) = 0 → pada garis | f(P) < 0 → sisi negatif" : language === "en" ? "f(P) > 0 → positive side | f(P) = 0 → on line | f(P) < 0 → negative side" : "f(P) > 0 → 正の側 | f(P) = 0 → 直線上 | f(P) < 0 → 負の側", color: "text-orange-300" },
                    ].map(({ step, desc, color }) => (
                      <div key={step} className="flex gap-2">
                        <span className={`font-display font-bold ${color} shrink-0`}>{step}.</span>
                        <p className="text-white/70">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs font-body">
                  <p className="text-white/70 font-semibold mb-1">{t.rang2SameHeader}</p>
                  <p className="text-white/60">{t.rang2SameBody}</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RANGKUMAN ═══ */}
          <RangkumanSection
            gradientFrom="from-orange-600" gradientVia="via-amber-600" gradientTo="to-yellow-600"
            borderColor="border-amber-500/30" accentColor="text-amber-200"
            headerIcon="📋" judul={t.rangkumanJudul}
            subjudul={t.rangkumanSubjudul}
            ringkasan={[
              { emoji:"🎯", judul:t.r1judul, bg:"bg-orange-900/40", border:"border-orange-500/30", textColor:"text-orange-300", isi:t.r1isi },
              { emoji:"📐", judul:t.r2judul, bg:"bg-amber-900/40", border:"border-amber-500/30", textColor:"text-amber-300", isi:t.r2isi },
              { emoji:"🔗", judul:t.r3judul, bg:"bg-yellow-900/40", border:"border-yellow-500/30", textColor:"text-yellow-300", isi:t.r3isi },
              { emoji:"🌐", judul:t.r4judul, bg:"bg-lime-900/40", border:"border-lime-500/30", textColor:"text-lime-300", isi:t.r4isi },
            ]}
            rumus={[
              { label:t.rumusLabel1, rumus:"\\Delta x = x_B - x_A \\qquad \\Delta y = y_B - y_A", bg:"bg-orange-900/30", border:"border-orange-500/25", labelColor:"text-orange-300" },
              { label:t.rumusLabel2, rumus:"f(P) = ax_P + by_P + c \\quad (> 0,\\, = 0,\\, < 0)", bg:"bg-amber-900/30", border:"border-amber-500/25", labelColor:"text-amber-300" },
            ]}
            tips={[
              { emoji:"🧠", teks:t.tip1 },
              { emoji:"↔️", teks:t.tip2 },
              { emoji:"🗺️", teks:t.tip3 },
              { emoji:"✅", teks:t.tip4 },
            ]}
            kesimpulan={t.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-orange-600/20 to-yellow-600/20"
            kesimpulanBorder="border-amber-400/40"
            kesimpulanTextColor="text-amber-100/90"
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

export default PosisiRelatifTitikDanGarisPage;
