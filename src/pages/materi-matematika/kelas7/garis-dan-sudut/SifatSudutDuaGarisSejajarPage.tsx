import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ──────────────────────────────────────────
   UI MAP
────────────────────────────────────────── */
const uiMap = {
  id: {
    pageTitle: "SIFAT SUDUT DUA GARIS SEJAJAR",
    pageSubtitle2: "JIKA DIPOTONG GARIS LAIN",
    pageSubtitle: "Kelas 7 · Garis dan Sudut · Materi Matematika",
    backBtn: "← Kembali ke Garis dan Sudut",
    intisariTitle: "🌌 Ringkasan Intisari",
    intisariP: "Ketika dua garis sejajar dipotong oleh sebuah garis transversal, terbentuklah 8 sudut dengan",
    intisariBold: "4 sifat hubungan",
    intisariEnd: "yang penting:",
    b1bold: "Sudut sehadap", b1: "→ sama besar",
    b2bold: "Sudut dalam berseberangan", b2: "→ sama besar",
    b3bold: "Sudut luar berseberangan", b3: "→ sama besar",
    b4bold: "Sudut dalam sepihak", b4: "→ berjumlah 180°",
    materiLabel: "📚 Materi",
    examplesLabel: "✏️ Contoh Soal",
    contoh: "CONTOH",
    pembahasan: "💡 Pembahasan:",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT",
    // SVG legend text
    lgSejajar: "g₁ // g₂  (sejajar)",
    lgTransversal: "h = garis pemotong (transversal)",
    lgAtas: "∠A1,A2,B1,B2 = atas garis",
    lgBawah: "∠A3,A4,B3,B4 = bawah garis",
    // SVG footer labels
    svgSehadap: "∠A1 = ∠B1  (sudut sehadap)",
    svgDalamBers: "∠A3 = ∠B1  (dalam berseberangan)",
    svgLuarBers: "∠A1 = ∠B3  (luar berseberangan)",
    svgDalamSep: "∠A3 + ∠B2 = 180°  (dalam sepihak)",
    // Section titles
    sec1title: "Kenali Dulu: Apa Itu Dua Garis Sejajar?",
    sec2title: "Sifat 1 — Sudut Sehadap (Corresponding Angles)",
    sec3title: "Sifat 2 — Sudut Dalam Berseberangan (Alternate Interior Angles)",
    sec4title: "Sifat 3 — Sudut Luar Berseberangan (Alternate Exterior Angles)",
    sec5title: "Sifat 4 — Sudut Dalam Sepihak (Co-Interior / Same-Side Interior)",
    sec6title: "Ringkasan Semua Sifat Sudut",
    // Section 1
    s1p1a: "Bayangkan dua rel kereta yang membentang sejauh mata memandang — keduanya tidak pernah bertemu walau diperpanjang sampai tak terhingga. Itulah gambaran",
    s1bold: "dua garis sejajar",
    s1nota: "Notasi:",
    s1notaP2a: "Ketika garis ketiga (disebut",
    s1notaTransversal: "garis transversal / pemotong",
    s1notaP2b: ") memotong kedua garis sejajar itu, terbentuklah",
    s1notaAngles: "8 sudut",
    s1notaP2c: "unik yang punya hubungan menarik satu sama lain.",
    s1tipA: "terbentuk ∠A1, ∠A2, ∠A3, ∠A4.",
    s1tipB: "terbentuk ∠B1, ∠B2, ∠B3, ∠B4.",
    s1tipPotong: "(potong",
    s1atPointA: "Di titik A",
    s1atPointB: "Di titik B",
    s1notaWord1: "Garis",
    s1notaMeans: "artinya",
    s1notaParallel: "sejajar dengan",
    s1pengelompokan: "Pengelompokan Sudut:",
    s1dalam: "• Sudut dalam:",
    s1dalamTxt: "di antara dua garis sejajar → ∠A3, ∠A4 (di bawah g₁) dan ∠B1, ∠B2 (di atas g₂)",
    s1luar: "• Sudut luar:",
    s1luarTxt: "di luar area dua garis sejajar → ∠A1, ∠A2 dan ∠B3, ∠B4",
    // Section 2
    s2p1: "Sudut sehadap adalah pasangan sudut yang terletak di",
    s2bold: "posisi yang sama",
    s2p1b: "pada tiap titik potong — keduanya berada di sisi yang sama dari garis transversal dan sama-sama di atas (atau di bawah) garis sejajarnya.",
    s2property: "📌 Sifat: Sudut sehadap sama besar",
    s2tip: "Tips: Cara mudah mengidentifikasi sudut sehadap — posisinya selalu \"satu arah\", seperti bayangan di cermin yang dipindah ke garis satunya.",
    // Section 3
    s3p1: "Sudut dalam berseberangan berada di",
    s3bold1: "dalam",
    s3p1b: "(di antara dua garis sejajar) dan letaknya",
    s3bold2: "berseberangan",
    s3p1c: "dari garis transversal — satu di kiri atas, satu di kanan bawah.",
    s3property: "📌 Sifat: Sudut dalam berseberangan sama besar",
    s3tip: "Tips: Bayangkan huruf",
    s3tipBold: "Z",
    s3tipOr: "atau",
    s3tipBold2: "S",
    s3tipEnd: "yang terbentuk oleh garis-garis itu. Kedua sudut yang \"mentok\" di ujung huruf Z/S itulah sudut dalam berseberangan!",
    // Section 4
    s4p1: "Mirip dengan sudut dalam berseberangan, tapi kali ini keduanya berada di",
    s4bold1: "luar",
    s4p1b: "(di sisi terluar dari kedua garis sejajar), dan posisinya tetap berseberangan terhadap garis transversal.",
    s4property: "📌 Sifat: Sudut luar berseberangan sama besar",
    s4tip: "Tips: Sama seperti pola huruf Z/S, tapi kali ini \"lengan\" huruf Z ada di luar area antara dua garis sejajar.",
    // Section 5
    s5p1: "Sudut dalam sepihak keduanya berada",
    s5bold1: "di dalam",
    s5p1b: "(antara dua garis sejajar), dan terletak",
    s5bold2: "di sisi yang sama",
    s5p1c: "dari garis transversal. Sifatnya berbeda dari ketiga sifat sebelumnya — bukan sama besar, tapi",
    s5bold3: "saling berpelurus",
    s5property: "📌 Sifat: Sudut dalam sepihak berjumlah 180°",
    s5tip: "Tips: Bayangkan huruf",
    s5tipBold: "U",
    s5tipOr: "atau",
    s5tipBold2: "C",
    s5tipEnd: "yang terbentuk. Kedua sudut di \"dasar\" huruf C itulah sudut dalam sepihak — kalau dijumlah selalu 180°!",
    // Section 6 table
    tblJenis: "Jenis Sudut",
    tblPasangan: "Pasangan Contoh",
    tblHubungan: "Hubungan",
    tblSehadap: "Sehadap",
    tblDalamBers: "Dalam Berseberangan",
    tblLuarBers: "Luar Berseberangan",
    tblDalamSep: "Dalam Sepihak",
    tblSamaBesar: "Sama besar",
    tbl180: "= 180°",
    // Example questions/answers
    ex1qa: "Diketahui",
    ex1qb: "dipotong garis",
    ex1qc: ". Jika",
    ex1qd: ", tentukan besar:",
    ex1qa2: "a)",
    ex1qb2: "(sudut sehadap)",
    ex1qc2: "b)",
    ex1qd2: "(sudut bertolak belakang dengan ∠A1 di titik A)",
    ex1aa: "a) Sudut sehadap → sama besar:",
    ex1ab: "b) ∠A2 adalah sudut lurus dengan ∠A1 (membentuk garis lurus):",
    ex1ans: "Jawaban:",
    ex2q: "Garis",
    ex2qmid: "dipotong oleh garis",
    ex2qc: ". Diketahui",
    ex2qd: "dan",
    ex2qe: "Karena",
    ex2qf: "dan",
    ex2qg: "adalah sudut dalam berseberangan, tentukan nilai",
    ex2qh: "dan besar kedua sudut tersebut!",
    ex2cond: "Sudut dalam berseberangan → sama besar:",
    ex2calc: "Besar sudut-sudutnya:",
    ex2ans: "Jawaban:",
    ex3q: "Garis",
    ex3qmid: "dipotong garis",
    ex3qc: ". Diketahui",
    ex3qd: "dan",
    ex3qe: "adalah sudut dalam sepihak.",
    ex3qf: "Tentukan nilai",
    ex3qg: "dan besar setiap sudut yang terbentuk di titik A dan titik B!",
    ex3cond: "Sudut dalam sepihak → jumlahnya 180°:",
    ex3calc: "Besar sudut A3 dan B2:",
    ex3check: "Cek:",
    ex3calc2: "Sudut-sudut lain (bertolak belakang):",
    ex3ans: "Jawaban:",
    tipsBold: "Tips:",
    ingatBold: "Tips:",
  },
  en: {
    pageTitle: "PARALLEL LINES CUT BY A TRANSVERSAL",
    pageSubtitle2: "ANGLE RELATIONSHIPS",
    pageSubtitle: "Grade 7 · Lines & Angles · Mathematics",
    backBtn: "← Back to Lines & Angles",
    intisariTitle: "🌌 Key Summary",
    intisariP: "When two parallel lines are cut by a transversal, 8 angles are formed with",
    intisariBold: "4 important relationships",
    intisariEnd: ":",
    b1bold: "Corresponding angles", b1: "→ equal",
    b2bold: "Alternate interior angles", b2: "→ equal",
    b3bold: "Alternate exterior angles", b3: "→ equal",
    b4bold: "Co-interior angles", b4: "→ add up to 180°",
    materiLabel: "📚 Material",
    examplesLabel: "✏️ Practice Problems",
    contoh: "EXAMPLE",
    pembahasan: "💡 Solution:",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD",
    lgSejajar: "g₁ // g₂  (parallel)",
    lgTransversal: "h = transversal line",
    lgAtas: "∠A1,A2,B1,B2 = above lines",
    lgBawah: "∠A3,A4,B3,B4 = below lines",
    svgSehadap: "∠A1 = ∠B1  (corresponding angles)",
    svgDalamBers: "∠A3 = ∠B1  (alternate interior angles)",
    svgLuarBers: "∠A1 = ∠B3  (alternate exterior angles)",
    svgDalamSep: "∠A3 + ∠B2 = 180°  (co-interior angles)",
    sec1title: "First: What Are Parallel Lines?",
    sec2title: "Property 1 — Corresponding Angles",
    sec3title: "Property 2 — Alternate Interior Angles",
    sec4title: "Property 3 — Alternate Exterior Angles",
    sec5title: "Property 4 — Co-Interior (Same-Side Interior) Angles",
    sec6title: "Summary of All Angle Properties",
    s1p1a: "Imagine two railway tracks stretching as far as the eye can see — they never meet no matter how far you extend them. This is the concept of",
    s1bold: "parallel lines",
    s1nota: "Notation:",
    s1notaP2a: "When a third line (called a",
    s1notaTransversal: "transversal",
    s1notaP2b: ") cuts the two parallel lines,",
    s1notaAngles: "8 unique angles",
    s1notaP2c: "are formed with interesting relationships between them.",
    s1tipA: "forms ∠A1, ∠A2, ∠A3, ∠A4.",
    s1tipB: "forms ∠B1, ∠B2, ∠B3, ∠B4.",
    s1tipPotong: "(cuts",
    s1atPointA: "At point A",
    s1atPointB: "At point B",
    s1notaWord1: "",
    s1notaMeans: "means",
    s1notaParallel: "is parallel to",
    s1pengelompokan: "Angle Classification:",
    s1dalam: "• Interior angles:",
    s1dalamTxt: "between the two parallel lines → ∠A3, ∠A4 (below g₁) and ∠B1, ∠B2 (above g₂)",
    s1luar: "• Exterior angles:",
    s1luarTxt: "outside the area between the parallel lines → ∠A1, ∠A2 and ∠B3, ∠B4",
    s2p1: "Corresponding angles are pairs of angles at the",
    s2bold: "same position",
    s2p1b: "at each intersection — both on the same side of the transversal and both above (or below) their respective parallel line.",
    s2property: "📌 Property: Corresponding angles are equal",
    s2tip: "Tips: The easy way to spot corresponding angles — they always face \"the same direction\", like a reflection shifted to the other line.",
    s3p1: "Alternate interior angles lie",
    s3bold1: "inside",
    s3p1b: "(between the two parallel lines) and on",
    s3bold2: "opposite sides",
    s3p1c: "of the transversal — one upper-left, one lower-right.",
    s3property: "📌 Property: Alternate interior angles are equal",
    s3tip: "Tips: Picture the letter",
    s3tipBold: "Z",
    s3tipOr: "or",
    s3tipBold2: "S",
    s3tipEnd: "formed by the lines. The two angles at the ends of the Z/S shape are the alternate interior angles!",
    s4p1: "Similar to alternate interior angles, but both lie",
    s4bold1: "outside",
    s4p1b: "(on the outermost sides of the parallel lines), and still on opposite sides of the transversal.",
    s4property: "📌 Property: Alternate exterior angles are equal",
    s4tip: "Tips: Same Z/S pattern, but this time the \"arms\" of the Z are outside the area between the parallel lines.",
    s5p1: "Co-interior angles are both",
    s5bold1: "interior",
    s5p1b: "(between the parallel lines) and on the",
    s5bold2: "same side",
    s5p1c: "of the transversal. Their property differs from the previous three — not equal, but",
    s5bold3: "supplementary",
    s5property: "📌 Property: Co-interior angles add up to 180°",
    s5tip: "Tips: Picture the letter",
    s5tipBold: "U",
    s5tipOr: "or",
    s5tipBold2: "C",
    s5tipEnd: "formed by the lines. The two angles at the \"base\" of the C are co-interior angles — they always sum to 180°!",
    tblJenis: "Angle Type",
    tblPasangan: "Example Pair",
    tblHubungan: "Relationship",
    tblSehadap: "Corresponding",
    tblDalamBers: "Alternate Interior",
    tblLuarBers: "Alternate Exterior",
    tblDalamSep: "Co-Interior",
    tblSamaBesar: "Equal",
    tbl180: "= 180°",
    ex1qa: "Given",
    ex1qb: "cut by line",
    ex1qc: ". If",
    ex1qd: ", find:",
    ex1qa2: "a)",
    ex1qb2: "(corresponding angle)",
    ex1qc2: "b)",
    ex1qd2: "(vertical angle with ∠A1 at point A)",
    ex1aa: "a) Corresponding angles → equal:",
    ex1ab: "b) ∠A2 and ∠A1 are supplementary (they form a straight line):",
    ex1ans: "Answer:",
    ex2q: "Line",
    ex2qmid: "is cut by line",
    ex2qc: ". Given",
    ex2qd: "and",
    ex2qe: "Since",
    ex2qf: "and",
    ex2qg: "are alternate interior angles, find the value of",
    ex2qh: "and the measure of both angles!",
    ex2cond: "Alternate interior angles → equal:",
    ex2calc: "Angle measures:",
    ex2ans: "Answer:",
    ex3q: "Line",
    ex3qmid: "is cut by line",
    ex3qc: ". Given",
    ex3qd: "and",
    ex3qe: "are co-interior angles.",
    ex3qf: "Find the value of",
    ex3qg: "and all angles at points A and B!",
    ex3cond: "Co-interior angles → sum to 180°:",
    ex3calc: "Angles A3 and B2:",
    ex3check: "Check:",
    ex3calc2: "Other angles (vertical angles):",
    ex3ans: "Answer:",
    tipsBold: "Tips:",
    ingatBold: "Tips:",
  },
  ja: {
    pageTitle: "平行線と角",
    pageSubtitle2: "横断線で切ったときの角の性質",
    pageSubtitle: "中学1年 · 直線と角 · 数学",
    backBtn: "← 直線と角に戻る",
    intisariTitle: "🌌 要点まとめ",
    intisariP: "2本の平行線が横断線で切られると、8つの角ができ、それらには",
    intisariBold: "4つの重要な性質",
    intisariEnd: "があります：",
    b1bold: "同位角", b1: "→ 等しい",
    b2bold: "錯角（内側・互い違い）", b2: "→ 等しい",
    b3bold: "錯角（外側・互い違い）", b3: "→ 等しい",
    b4bold: "同側内角", b4: "→ 和が180°",
    materiLabel: "📚 内容",
    examplesLabel: "✏️ 練習問題",
    contoh: "例題",
    pembahasan: "💡 解説：",
    mudah: "基本", sedang: "標準", sulit: "発展",
    lgSejajar: "g₁ // g₂  （平行）",
    lgTransversal: "h = 横断線",
    lgAtas: "∠A1,A2,B1,B2 = 直線の上側",
    lgBawah: "∠A3,A4,B3,B4 = 直線の下側",
    svgSehadap: "∠A1 = ∠B1  （同位角）",
    svgDalamBers: "∠A3 = ∠B1  （錯角・内側）",
    svgLuarBers: "∠A1 = ∠B3  （錯角・外側）",
    svgDalamSep: "∠A3 + ∠B2 = 180°  （同側内角）",
    sec1title: "まず：平行線とは何か？",
    sec2title: "性質1 — 同位角（Corresponding Angles）",
    sec3title: "性質2 — 錯角・内側（Alternate Interior Angles）",
    sec4title: "性質3 — 錯角・外側（Alternate Exterior Angles）",
    sec5title: "性質4 — 同側内角（Co-Interior Angles）",
    sec6title: "すべての角の性質まとめ",
    s1p1a: "鉄道のレールが地平線まで延びているところを想像してください — どこまで伸ばしても2本のレールは交わりません。これが",
    s1bold: "平行線",
    s1nota: "記号：",
    s1notaP2a: "3本目の直線（",
    s1notaTransversal: "横断線",
    s1notaP2b: "という）が2本の平行線を切ると、",
    s1notaAngles: "8つの角",
    s1notaP2c: "ができ、それらの間に興味深い関係があります。",
    s1tipA: "で∠A1, ∠A2, ∠A3, ∠A4ができる。",
    s1tipB: "で∠B1, ∠B2, ∠B3, ∠B4ができる。",
    s1tipPotong: "（切る",
    s1atPointA: "A点",
    s1atPointB: "B点",
    s1notaWord1: "",
    s1notaMeans: "は",
    s1notaParallel: "と平行",
    s1pengelompokan: "角の分類：",
    s1dalam: "• 内角：",
    s1dalamTxt: "2本の平行線の間 → ∠A3, ∠A4（g₁の下）と∠B1, ∠B2（g₂の上）",
    s1luar: "• 外角：",
    s1luarTxt: "平行線の外側 → ∠A1, ∠A2と∠B3, ∠B4",
    s2p1: "同位角は各交点で",
    s2bold: "同じ位置",
    s2p1b: "にある角の組です — 横断線の同じ側にあり、どちらも平行線の上側（または下側）にあります。",
    s2property: "📌 性質：同位角は等しい",
    s2tip: "ヒント：同位角の見つけ方 — 常に「同じ向き」に並んでいます。もう一方の直線に移した鏡像のようなものです。",
    s3p1: "錯角（内側）は",
    s3bold1: "内側",
    s3p1b: "（2本の平行線の間）にあり、横断線を",
    s3bold2: "挟んで反対側",
    s3p1c: "に位置します — 一方が左上、もう一方が右下。",
    s3property: "📌 性質：錯角（内側）は等しい",
    s3tip: "ヒント：直線でできる",
    s3tipBold: "Z",
    s3tipOr: "または",
    s3tipBold2: "S",
    s3tipEnd: "の字を想像してください。Z/Sの両端の角が錯角（内側）です！",
    s4p1: "錯角（内側）と似ていますが、今度は両方が",
    s4bold1: "外側",
    s4p1b: "（平行線の外側）にあり、横断線の反対側に位置します。",
    s4property: "📌 性質：錯角（外側）は等しい",
    s4tip: "ヒント：Z/Sのパターンと同じですが、Zの「腕」が平行線の外側にあります。",
    s5p1: "同側内角はどちらも",
    s5bold1: "内側",
    s5p1b: "（平行線の間）にあり、横断線の",
    s5bold2: "同じ側",
    s5p1c: "に位置します。前の3つの性質と異なり — 等しいのではなく、",
    s5bold3: "補角（和が180°）",
    s5property: "📌 性質：同側内角の和は180°",
    s5tip: "ヒント：直線でできる",
    s5tipBold: "U",
    s5tipOr: "または",
    s5tipBold2: "C",
    s5tipEnd: "の字を想像してください。Cのベースにある2つの角が同側内角です — 合計すると常に180°！",
    tblJenis: "角の種類",
    tblPasangan: "例のペア",
    tblHubungan: "関係",
    tblSehadap: "同位角",
    tblDalamBers: "錯角（内側）",
    tblLuarBers: "錯角（外側）",
    tblDalamSep: "同側内角",
    tblSamaBesar: "等しい",
    tbl180: "= 180°",
    ex1qa: "既知：",
    ex1qb: "を直線",
    ex1qc: "が切る。",
    ex1qd: "のとき、次を求めなさい：",
    ex1qa2: "a)",
    ex1qb2: "（同位角）",
    ex1qc2: "b)",
    ex1qd2: "（点Aで∠A1と対頂角）",
    ex1aa: "a) 同位角 → 等しい：",
    ex1ab: "b) ∠A2と∠A1は補角（直線を作る）：",
    ex1ans: "答え：",
    ex2q: "直線",
    ex2qmid: "を直線",
    ex2qc: "が切る。",
    ex2qd: "と",
    ex2qe: "　",
    ex2qf: "と",
    ex2qg: "が錯角（内側）のとき、",
    ex2qh: "の値と両角の大きさを求めなさい！",
    ex2cond: "錯角（内側）→ 等しい：",
    ex2calc: "各角の大きさ：",
    ex2ans: "答え：",
    ex3q: "直線",
    ex3qmid: "を直線",
    ex3qc: "が切る。",
    ex3qd: "と",
    ex3qe: "は同側内角です。",
    ex3qf: "の値と",
    ex3qg: "点A・点Bのすべての角を求めなさい！",
    ex3cond: "同側内角 → 和が180°：",
    ex3calc: "∠A3と∠B2の大きさ：",
    ex3check: "確認：",
    ex3calc2: "他の角（対頂角）：",
    ex3ans: "答え：",
    tipsBold: "ヒント：",
    ingatBold: "ヒント：",
  },
};

type UI = typeof uiMap.id;

/* ──────────────────────────────────────────
   SVG DIAGRAMS
────────────────────────────────────────── */

const DuaGarisSVGAll = ({ lgSejajar, lgTransversal, lgAtas, lgBawah }: {
  lgSejajar: string; lgTransversal: string; lgAtas: string; lgBawah: string;
}) => (
  <svg viewBox="0 0 340 260" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="ar1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" />
      </marker>
      <marker id="ar2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
      </marker>
      <marker id="ar3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#fb923c" />
      </marker>
      <marker id="ar1L" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#22d3ee" />
      </marker>
      <marker id="ar2L" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
        <path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" />
      </marker>
    </defs>
    <line x1="20" y1="80" x2="305" y2="80" stroke="#22d3ee" strokeWidth="2.5"
      markerEnd="url(#ar1)" markerStart="url(#ar1L)" />
    <text x="310" y="84" fill="#22d3ee" fontSize="13" fontFamily="monospace">g₁</text>
    <line x1="20" y1="180" x2="305" y2="180" stroke="#a78bfa" strokeWidth="2.5"
      markerEnd="url(#ar2)" markerStart="url(#ar2L)" />
    <text x="310" y="184" fill="#a78bfa" fontSize="13" fontFamily="monospace">g₂</text>
    <line x1="90" y1="15" x2="210" y2="245" stroke="#fb923c" strokeWidth="2.5"
      markerEnd="url(#ar3)" />
    <text x="213" y="248" fill="#fb923c" fontSize="13" fontFamily="monospace">h</text>
    <circle cx="128" cy="80" r="3.5" fill="#facc15" />
    <text x="112" y="70" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="102" y="76" fill="#4ade80" fontSize="11" fontFamily="monospace">∠A2</text>
    <text x="133" y="76" fill="#4ade80" fontSize="11" fontFamily="monospace">∠A1</text>
    <text x="102" y="97" fill="#f472b6" fontSize="11" fontFamily="monospace">∠A3</text>
    <text x="133" y="97" fill="#f472b6" fontSize="11" fontFamily="monospace">∠A4</text>
    <circle cx="168" cy="180" r="3.5" fill="#facc15" />
    <text x="152" y="172" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="142" y="176" fill="#4ade80" fontSize="11" fontFamily="monospace">∠B2</text>
    <text x="172" y="176" fill="#4ade80" fontSize="11" fontFamily="monospace">∠B1</text>
    <text x="142" y="197" fill="#f472b6" fontSize="11" fontFamily="monospace">∠B3</text>
    <text x="172" y="197" fill="#f472b6" fontSize="11" fontFamily="monospace">∠B4</text>
    {/* Legend — translated */}
    <rect x="10" y="215" width="320" height="36" rx="6" fill="rgba(15,23,42,0.7)" stroke="#334155" strokeWidth="1"/>
    <text x="18" y="229" fill="#22d3ee" fontSize="10" fontFamily="monospace">{lgSejajar}</text>
    <text x="18" y="244" fill="#fb923c" fontSize="10" fontFamily="monospace">{lgTransversal}</text>
    <text x="170" y="229" fill="#4ade80" fontSize="10" fontFamily="monospace">{lgAtas}</text>
    <text x="170" y="244" fill="#f472b6" fontSize="10" fontFamily="monospace">{lgBawah}</text>
  </svg>
);

const SehadapSVG = ({ footerText }: { footerText: string }) => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="sh1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="sh1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="sh2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" /></marker>
      <marker id="sh2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" /></marker>
      <marker id="sh3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#sh1)" markerStart="url(#sh1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#sh2)" markerStart="url(#sh2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#sh3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M127,70 A20,20 0 0,0 113,52" fill="rgba(250,204,21,0.25)" stroke="#facc15" strokeWidth="1.5"/>
    <text x="128" y="62" fill="#facc15" fontSize="11" fontFamily="monospace">∠A1</text>
    <path d="M158,155 A20,20 0 0,0 144,137" fill="rgba(250,204,21,0.25)" stroke="#facc15" strokeWidth="1.5"/>
    <text x="159" y="148" fill="#facc15" fontSize="11" fontFamily="monospace">∠B1</text>
    <text x="60" y="185" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{footerText}</text>
  </svg>
);

const DalamBerseberanganSVG = ({ footerText }: { footerText: string }) => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="db1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="db1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="db2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" /></marker>
      <marker id="db2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" /></marker>
      <marker id="db3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#db1)" markerStart="url(#db1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#db2)" markerStart="url(#db2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#db3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M107,90 A20,20 0 0,1 91,72" fill="rgba(74,222,128,0.25)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="83" y="98" fill="#4ade80" fontSize="11" fontFamily="monospace">∠A3</text>
    <path d="M138,135 A20,20 0 0,1 154,153" fill="rgba(74,222,128,0.25)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="154" y="135" fill="#4ade80" fontSize="11" fontFamily="monospace">∠B1</text>
    <text x="40" y="185" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{footerText}</text>
  </svg>
);

const LuarBerseberanganSVG = ({ footerText }: { footerText: string }) => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="lb1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="lb1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="lb2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" /></marker>
      <marker id="lb2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" /></marker>
      <marker id="lb3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#lb1)" markerStart="url(#lb1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#lb2)" markerStart="url(#lb2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#lb3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M127,70 A20,20 0 0,0 113,52" fill="rgba(244,114,182,0.25)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x="128" y="61" fill="#f472b6" fontSize="11" fontFamily="monospace">∠A1</text>
    <path d="M138,175 A20,20 0 0,1 154,157" fill="rgba(244,114,182,0.25)" stroke="#f472b6" strokeWidth="1.5"/>
    <text x="155" y="178" fill="#f472b6" fontSize="11" fontFamily="monospace">∠B3</text>
    <text x="40" y="195" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{footerText}</text>
  </svg>
);

const DalamSepihakSVG = ({ footerText }: { footerText: string }) => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2">
    <defs>
      <marker id="ds1" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="ds1L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="ds2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#a78bfa" /></marker>
      <marker id="ds2L" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#a78bfa" /></marker>
      <marker id="ds3" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="15" y1="70" x2="285" y2="70" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#ds1)" markerStart="url(#ds1L)" />
    <line x1="15" y1="155" x2="285" y2="155" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#ds2)" markerStart="url(#ds2L)" />
    <line x1="78" y1="10" x2="162" y2="190" stroke="#fb923c" strokeWidth="2" markerEnd="url(#ds3)" />
    <circle cx="107" cy="70" r="3" fill="#facc15" />
    <circle cx="138" cy="155" r="3" fill="#facc15" />
    <text x="87" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">A</text>
    <text x="118" y="150" fill="#facc15" fontSize="11" fontFamily="monospace">B</text>
    <path d="M107,90 A20,20 0 0,1 91,72" fill="rgba(251,146,60,0.25)" stroke="#fb923c" strokeWidth="1.5"/>
    <text x="74" y="97" fill="#fb923c" fontSize="11" fontFamily="monospace">∠A3</text>
    <path d="M138,135 A20,20 0 0,1 122,153" fill="rgba(251,146,60,0.25)" stroke="#fb923c" strokeWidth="1.5"/>
    <text x="104" y="142" fill="#fb923c" fontSize="11" fontFamily="monospace">∠B2</text>
    <text x="30" y="190" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{footerText}</text>
  </svg>
);

/* ──────────────────────────────────────────
   SECTION DATA
────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const getSections = (ui: UI): Section[] => [
  {
    title: ui.sec1title, icon: "🚀",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s1p1a} <strong className="text-cyan-300">{ui.s1bold}</strong>.
        </p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p><strong className="text-cyan-300">{ui.s1nota}</strong> {ui.s1notaWord1 ? ui.s1notaWord1 + " " : ""}<InlineMath math="g_1 \parallel g_2" /> {ui.s1notaMeans} <InlineMath math="g_1" /> {ui.s1notaParallel} <InlineMath math="g_2" />.</p>
          <p>{ui.s1notaP2a} <strong className="text-orange-300">{ui.s1notaTransversal}</strong>{ui.s1notaP2b} <strong className="text-yellow-300">{ui.s1notaAngles}</strong> {ui.s1notaP2c}</p>
        </div>
        <DuaGarisSVGAll lgSejajar={ui.lgSejajar} lgTransversal={ui.lgTransversal} lgAtas={ui.lgAtas} lgBawah={ui.lgBawah} />
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 {ui.s1atPointA} {ui.s1tipPotong} <InlineMath math="g_1" />) {ui.s1tipA}<br />
          {ui.s1atPointB} {ui.s1tipPotong} <InlineMath math="g_2" />) {ui.s1tipB}
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          <p className="text-white/80 font-semibold mb-1">{ui.s1pengelompokan}</p>
          <p><span className="text-cyan-300">{ui.s1dalam}</span> {ui.s1dalamTxt}</p>
          <p><span className="text-pink-300">{ui.s1luar}</span> {ui.s1luarTxt}</p>
        </div>
      </div>
    ),
  },
  {
    title: ui.sec2title, icon: "🔭",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s2p1} <strong className="text-yellow-300">{ui.s2bold}</strong> {ui.s2p1b}
        </p>
        <div className="bg-yellow-950/60 border border-yellow-600/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-yellow-300">{ui.s2property}</p>
          <BlockMath math="\angle A1 = \angle B1 \quad ; \quad \angle A2 = \angle B2" />
          <BlockMath math="\angle A3 = \angle B3 \quad ; \quad \angle A4 = \angle B4" />
        </div>
        <SehadapSVG footerText={ui.svgSehadap} />
        <blockquote className="border-l-4 border-cyan-500 bg-cyan-950/40 pl-4 py-2 text-cyan-200 text-xs rounded-r-lg">
          <strong>{ui.tipsBold}</strong> {ui.s2tip}
        </blockquote>
      </div>
    ),
  },
  {
    title: ui.sec3title, icon: "⚡",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s3p1} <strong className="text-green-300">{ui.s3bold1}</strong> {ui.s3p1b}
          <strong className="text-green-300"> {ui.s3bold2}</strong> {ui.s3p1c}
        </p>
        <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-green-300">{ui.s3property}</p>
          <BlockMath math="\angle A3 = \angle B1 \quad ; \quad \angle A4 = \angle B2" />
        </div>
        <DalamBerseberanganSVG footerText={ui.svgDalamBers} />
        <blockquote className="border-l-4 border-green-500 bg-green-950/40 pl-4 py-2 text-green-200 text-xs rounded-r-lg">
          <strong>{ui.tipsBold}</strong> {ui.s3tip} <strong>{ui.s3tipBold}</strong> {ui.s3tipOr} <strong>{ui.s3tipBold2}</strong> {ui.s3tipEnd}
        </blockquote>
      </div>
    ),
  },
  {
    title: ui.sec4title, icon: "🌟",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s4p1} <strong className="text-pink-300">{ui.s4bold1}</strong> {ui.s4p1b}
        </p>
        <div className="bg-pink-950/60 border border-pink-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-pink-300">{ui.s4property}</p>
          <BlockMath math="\angle A1 = \angle B3 \quad ; \quad \angle A2 = \angle B4" />
        </div>
        <LuarBerseberanganSVG footerText={ui.svgLuarBers} />
        <blockquote className="border-l-4 border-pink-500 bg-pink-950/40 pl-4 py-2 text-pink-200 text-xs rounded-r-lg">
          <strong>{ui.tipsBold}</strong> {ui.s4tip}
        </blockquote>
      </div>
    ),
  },
  {
    title: ui.sec5title, icon: "🪐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s5p1} <strong className="text-orange-300">{ui.s5bold1}</strong> {ui.s5p1b}
          <strong className="text-orange-300"> {ui.s5bold2}</strong> {ui.s5p1c}
          <strong className="text-orange-300"> {ui.s5bold3}</strong>!
        </p>
        <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-orange-300">{ui.s5property}</p>
          <BlockMath math="\angle A3 + \angle B2 = 180°" />
          <BlockMath math="\angle A4 + \angle B1 = 180°" />
        </div>
        <DalamSepihakSVG footerText={ui.svgDalamSep} />
        <blockquote className="border-l-4 border-orange-500 bg-orange-950/40 pl-4 py-2 text-orange-200 text-xs rounded-r-lg">
          <strong>{ui.tipsBold}</strong> {ui.s5tip} <strong>{ui.s5tipBold}</strong> {ui.s5tipOr} <strong>{ui.s5tipBold2}</strong> {ui.s5tipEnd}
        </blockquote>
      </div>
    ),
  },
  {
    title: ui.sec6title, icon: "📊",
    content: (
      <div className="space-y-3 text-sm font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblJenis}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblPasangan}</th>
                <th className="px-3 py-2 text-cyan-300">{ui.tblHubungan}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-700 bg-yellow-950/30">
                <td className="px-3 py-2 text-yellow-300 font-semibold border-r border-slate-700">{ui.tblSehadap}</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A1 \text{ dan } \angle B1" /></td>
                <td className="px-3 py-2 text-white/70">{ui.tblSamaBesar}</td>
              </tr>
              <tr className="border-t border-slate-700 bg-green-950/30">
                <td className="px-3 py-2 text-green-300 font-semibold border-r border-slate-700">{ui.tblDalamBers}</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A3 \text{ dan } \angle B1" /></td>
                <td className="px-3 py-2 text-white/70">{ui.tblSamaBesar}</td>
              </tr>
              <tr className="border-t border-slate-700 bg-pink-950/30">
                <td className="px-3 py-2 text-pink-300 font-semibold border-r border-slate-700">{ui.tblLuarBers}</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A1 \text{ dan } \angle B3" /></td>
                <td className="px-3 py-2 text-white/70">{ui.tblSamaBesar}</td>
              </tr>
              <tr className="border-t border-slate-700 bg-orange-950/30">
                <td className="px-3 py-2 text-orange-300 font-semibold border-r border-slate-700">{ui.tblDalamSep}</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle A3 + \angle B2" /></td>
                <td className="px-3 py-2 text-white/70">{ui.tbl180}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

/* ──────────────────────────────────────────
   CONTOH SOAL
────────────────────────────────────────── */
type Example = { level: string; color: string; bg: string; border: string; question: React.ReactNode; answer: React.ReactNode };

const ContohSoalSVG = ({ labelA, labelB, type }: { labelA: string; labelB: string; type: "sehadap" | "berseberangan" | "sepihak" }) => {
  const colorA = type === "sepihak" ? "#fb923c" : "#facc15";
  const colorB = type === "sepihak" ? "#fb923c" : "#facc15";
  return (
    <svg viewBox="0 0 280 175" className="w-full max-w-xs mx-auto my-2">
      <defs>
        <marker id={"cAr1" + type} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#22d3ee" /></marker>
        <marker id={"cAr1L" + type} markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse"><path d="M6,0 L6,6 L0,3 z" fill="#22d3ee" /></marker>
        <marker id={"cAr2" + type} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#a78bfa" /></marker>
        <marker id={"cAr2L" + type} markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse"><path d="M6,0 L6,6 L0,3 z" fill="#a78bfa" /></marker>
        <marker id={"cAr3" + type} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#fb923c" /></marker>
      </defs>
      <line x1="10" y1="60" x2="265" y2="60" stroke="#22d3ee" strokeWidth="2"
        markerEnd={"url(#cAr1" + type + ")"} markerStart={"url(#cAr1L" + type + ")"} />
      <text x="268" y="64" fill="#22d3ee" fontSize="11" fontFamily="monospace">g₁</text>
      <line x1="10" y1="135" x2="265" y2="135" stroke="#a78bfa" strokeWidth="2"
        markerEnd={"url(#cAr2" + type + ")"} markerStart={"url(#cAr2L" + type + ")"} />
      <text x="268" y="139" fill="#a78bfa" fontSize="11" fontFamily="monospace">g₂</text>
      <line x1="65" y1="8" x2="148" y2="168" stroke="#fb923c" strokeWidth="2"
        markerEnd={"url(#cAr3" + type + ")"} />
      <circle cx="93" cy="60" r="3" fill="#facc15" />
      <circle cx="122" cy="135" r="3" fill="#facc15" />
      <text x="70" y="56" fill="#facc15" fontSize="10" fontFamily="monospace">A</text>
      <text x="103" y="131" fill="#facc15" fontSize="10" fontFamily="monospace">B</text>
      <text x="100" y="53" fill={colorA} fontSize="11" fontFamily="monospace" fontWeight="bold">{labelA}</text>
      {type === "berseberangan" && <text x="74" y="148" fill={colorB} fontSize="11" fontFamily="monospace" fontWeight="bold">{labelB}</text>}
      {type !== "berseberangan" && <text x="128" y="148" fill={colorB} fontSize="11" fontFamily="monospace" fontWeight="bold">{labelB}</text>}
    </svg>
  );
};

const getExamples = (ui: UI): Example[] => [
  {
    level: ui.mudah,
    color: "text-green-400",
    bg: "bg-green-950/40",
    border: "border-green-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          {ui.ex1qa} <InlineMath math="g_1 \parallel g_2" /> {ui.ex1qb} <InlineMath math="h" />.
          {ui.ex1qc} <InlineMath math="\angle A1 = 65°" />{ui.ex1qd}
        </p>
        <p>{ui.ex1qa2} <InlineMath math="\angle B1" /> {ui.ex1qb2}</p>
        <p>{ui.ex1qc2} <InlineMath math="\angle A2" /> {ui.ex1qd2}</p>
        <ContohSoalSVG labelA="65°" labelB="∠B1=?" type="sehadap" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex1aa}</p>
          <BlockMath math="\angle B1 = \angle A1 = 65°" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex1ab}</p>
          <BlockMath math="\angle A2 = 180° - \angle A1 = 180° - 65° = 115°" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">{ui.ex1ans} <InlineMath math="\angle B1 = 65°" /> {ui.ex1qa2.replace("a)", "dan")} <InlineMath math="\angle A2 = 115°" /></p>
        </div>
      </div>
    ),
  },
  {
    level: ui.sedang,
    color: "text-yellow-400",
    bg: "bg-yellow-950/40",
    border: "border-yellow-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          {ui.ex2q} <InlineMath math="g_1 \parallel g_2" /> {ui.ex2qmid} <InlineMath math="h" />.
          {ui.ex2qc} <InlineMath math="\angle A3 = (4x - 10)°" /> {ui.ex2qd} <InlineMath math="\angle B1 = (2x + 30)°" />.
        </p>
        <p>{ui.ex2qe} <InlineMath math="\angle A3" /> {ui.ex2qf} <InlineMath math="\angle B1" /> {ui.ex2qg} <InlineMath math="x" /> {ui.ex2qh}</p>
        <ContohSoalSVG labelA="∠A3=(4x-10)°" labelB="∠B1=(2x+30)°" type="berseberangan" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex2cond}</p>
          <BlockMath math="4x - 10 = 2x + 30" />
          <BlockMath math="4x - 2x = 30 + 10" />
          <BlockMath math="2x = 40 \implies x = 20" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex2calc}</p>
          <BlockMath math="\angle A3 = 4(20) - 10 = 80 - 10 = 70°" />
          <BlockMath math="\angle B1 = 2(20) + 30 = 40 + 30 = 70° \checkmark" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">{ui.ex2ans} <InlineMath math="x = 20" />, <InlineMath math="\angle A3 = \angle B1 = 70°" /></p>
        </div>
      </div>
    ),
  },
  {
    level: ui.sulit,
    color: "text-red-400",
    bg: "bg-red-950/40",
    border: "border-red-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          {ui.ex3q} <InlineMath math="g_1 \parallel g_2" /> {ui.ex3qmid} <InlineMath math="h" />.
          {ui.ex3qc} <InlineMath math="\angle A3 = (5x + 15)°" /> {ui.ex3qd} <InlineMath math="\angle B2 = (3x + 25)°" />.
        </p>
        <p><strong className="text-red-300"><InlineMath math="\angle A3" /> {ui.ex3qe}</strong></p>
        <p>{ui.ex3qf} <InlineMath math="x" /> {ui.ex3qg}</p>
        <ContohSoalSVG labelA="∠A3=(5x+15)°" labelB="∠B2=(3x+25)°" type="sepihak" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex3cond}</p>
          <BlockMath math="(5x + 15) + (3x + 25) = 180" />
          <BlockMath math="8x + 40 = 180" />
          <BlockMath math="8x = 140 \implies x = 17{,}5" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex3calc}</p>
          <BlockMath math="\angle A3 = 5(17{,}5) + 15 = 87{,}5 + 15 = 102{,}5°" />
          <BlockMath math="\angle B2 = 3(17{,}5) + 25 = 52{,}5 + 25 = 77{,}5°" />
          <p className="text-white/60 text-xs mt-1">{ui.ex3check} <InlineMath math="102{,}5° + 77{,}5° = 180°" /> ✓</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex3calc2}</p>
          <BlockMath math="\angle A4 = \angle A2 \text{ (berpelurus dengan } \angle A3\text{)} = 180° - 102{,}5° = 77{,}5°" />
          <BlockMath math="\angle B1 = 180° - 77{,}5° = 102{,}5°" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">{ui.ex3ans} <InlineMath math="x = 17{,}5" />, <InlineMath math="\angle A3 = 102{,}5°" />, <InlineMath math="\angle B2 = 77{,}5°" /></p>
        </div>
      </div>
    ),
  },
];

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const SifatSudutDuaGarisSejajarPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui: UI = uiMap[language as "id" | "en" | "ja"] ?? uiMap.id;

  const [openSection, setOpenSection] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);
  const [openExample, setOpenExample] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);

  const toggle = (i: number, setter: React.Dispatch<React.SetStateAction<number[]>>, cur: number[]) => {
    playPopSound();
    setter(cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i]);
  };

  const sections = getSections(ui);
  const examples = getExamples(ui);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-1 text-center leading-snug">
          {ui.pageTitle}
        </h1>
        <p className="text-cyan-300 text-xs text-center font-display mb-1">{ui.pageSubtitle2}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{ui.pageSubtitle}</p>

        {/* RINGKASAN INTISARI */}
        <div className="bg-slate-900/80 border border-cyan-700/50 rounded-2xl p-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="text-cyan-300 font-semibold mb-2">{ui.intisariTitle}</p>
          <p>
            {ui.intisariP} <InlineMath math="g_1 \parallel g_2" /> {ui.intisariBold ? "" : ""}<strong className="text-yellow-300">{ui.intisariBold}</strong> {ui.intisariEnd}
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-white/70">
            <li><span className="text-yellow-300 font-semibold">{ui.b1bold}</span> {ui.b1}</li>
            <li><span className="text-green-300 font-semibold">{ui.b2bold}</span> {ui.b2}</li>
            <li><span className="text-pink-300 font-semibold">{ui.b3bold}</span> {ui.b3}</li>
            <li><span className="text-orange-300 font-semibold">{ui.b4bold}</span> {ui.b4}</li>
          </ul>
        </div>

        {/* MATERI */}
        <p className="text-white/60 text-xs font-body mb-3 uppercase tracking-widest">{ui.materiLabel}</p>
        <div className="flex flex-col gap-2 mb-8">
          {sections.map((sec, i) => (
            <div key={i} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(i, setOpenSection, openSection)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-body text-sm font-semibold text-white flex items-center gap-2">
                  <span className="text-base">{sec.icon}</span> {sec.title}
                </span>
                {openSection.includes(i)
                  ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openSection.includes(i) && (
                <div className="px-4 pb-4 pt-1 border-t border-border/50 animate-slide-up">
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CONTOH SOAL */}
        <p className="text-white/60 text-xs font-body mb-3 uppercase tracking-widest">{ui.examplesLabel}</p>
        <div className="flex flex-col gap-3">
          {examples.map((ex, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden ${ex.border} ${ex.bg}`}>
              <button
                onClick={() => toggle(i, setOpenExample, openExample)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className={`font-display text-xs font-bold ${ex.color}`}>
                  ⭐ {ui.contoh} {i + 1} — {ex.level}
                </span>
                {openExample.includes(i)
                  ? <ChevronUp className="w-4 h-4 shrink-0 text-white/60" />
                  : <ChevronDown className="w-4 h-4 shrink-0 text-white/60" />}
              </button>
              {openExample.includes(i) && (
                <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3 animate-slide-up">
                  <div className="bg-slate-900/60 rounded-lg p-3">{ex.question}</div>
                  <p className={`text-xs font-semibold font-body ${ex.color}`}>{ui.pembahasan}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3">{ex.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/garis-dan-sudut"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {ui.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SifatSudutDuaGarisSejajarPage;
