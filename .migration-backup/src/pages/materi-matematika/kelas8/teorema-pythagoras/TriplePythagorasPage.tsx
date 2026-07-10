import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Star } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "TRIPLE PYTHAGORAS",
    subtitle: "Kelas 8 · Teorema Pythagoras · Materi Matematika",
    back: "← Kembali ke Teorema Pythagoras",
    sec_intro: "🌟 Apa Itu Triple Pythagoras?",
    sec_daftar: "🏆 5 Tipe Triple Pythagoras Wajib Hafal",
    sec_pola: "📐 Tabel Ringkas 5 Tipe + Kelipatannya",
    sec_contoh1: "✏️ Contoh 1 — Triple di Berbagai Posisi Segitiga",
    sec_contoh2: "✏️ Contoh 2 — Cari Sisi Miring dengan Kelipatan Triple",
    sec_contoh3: "✏️ Contoh 3 — Soal Cerita Angka Besar (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    intisari: "🎯 Ringkasan Intisari",
    introDesc: "Triple Pythagoras adalah kumpulan tiga bilangan bulat positif yang memenuhi persamaan",
    introDesc2: ". Jika kamu hafal triple-triple ini, kamu bisa langsung mengenali segitiga siku-siku tanpa perlu menghitung akar — ini trik cepat favorit para matematikawan!",
    introPic: "Bayangkan kamu sedang di ujian dan muncul segitiga dengan kaki 5 cm dan 12 cm. Tanpa kalkulator, kamu bisa langsung bilang \"hipotenusanya 13 cm!\" karena kamu hafal triple",
    introPicEnd: ". Keren, kan? 🚀",
    leg: "Kaki",
    hyp: "Hipotenusa",
    bannerTitle: "⚡ 5 TIPE DASAR — INDUK SEMUA TRIPLE",
    bannerSub: "Setiap triple Pythagoras (umumnya) adalah kelipatan dari salah satu ke-5 tipe ini!",
    typeLabel: "TIPE",
    multiples: "🔢 Kelipatan (juga Triple Pythagoras):",
    whyTitle: "📌 Mengapa Kelipatan Juga Berlaku?",
    whyDesc: "Jika",
    whyDesc2: "triple Pythagoras, maka untuk sembarang",
    outsideTitle: "🌟 TRIPLE DI LUAR 5 TIPE — ADA LHO!",
    outsideDesc: "Meskipun 5 tipe di atas sangat populer,",
    outsideDescBold: "ada triple Pythagoras yang bukan kelipatan dari kelimanya",
    outsideDescEnd: ". Contoh paling terkenal:",
    outsideNote: "Bukan kelipatan dari Tipe 1–5 manapun!",
    primitiveDesc: "Triple seperti",
    primitiveDesc2: "disebut",
    primitiveBold: "triple primitif",
    primitiveDesc3: "— ketiga anggotanya tidak punya faktor persekutuan selain 1 (FPB = 1). Ini membuktikan bahwa dunia triple Pythagoras sangat luas!",
    tableNote: "⭐ Baris pertama = triple dasar (wajib hafal!), baris berikutnya = kelipatannya.",
    tableBase: "DASAR",
    tableLegend: "⭐ Baris ×1 = Triple Dasar (wajib hafal!)",
    tableLegend2: "Baris ×2–×5 = kelipatan valid",
    tableTip: "💡 Cara cepat: Lihat apakah dua kaki segitiga bisa dibagi bilangan yang sama. Jika hasil baginya cocok dengan tipe 1–5, langsung tahu sisi miringnya!",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1Desc: "Tentukan sisi yang belum diketahui pada masing-masing segitiga berikut",
    c1Bold: "tanpa kalkulator",
    c1End: "menggunakan hafalan Triple Pythagoras!",
    c1PattA: "Kenali pola:",
    c1RightB: "Siku-siku di B",
    c1RightR: "Siku-siku di R (kanan)",
    c1RightE: "Siku-siku di E (atas)",
    c1Conclusion: "✅ Triple Pythagoras berlaku di",
    c1ConcBold: "posisi manapun",
    c1ConcEnd: "— miring, terbalik, atau berputar!",
    c2Title: "✏️ Contoh 2 — Cari Sisi Miring dengan Kelipatan Triple",
    c2Desc: "Segitiga PQR siku-siku di Q. Diketahui panjang",
    c2Desc2: "dan",
    c2Desc3: ". Tentukan panjang sisi miring",
    c2Desc4: "menggunakan kelipatan Triple Pythagoras!",
    c2Step1: "🔍 Langkah 1: Cari FPB dari 15 dan 36",
    c2Step2: "🔍 Langkah 2: Kenali triple dasar",
    c2Step3: "🔍 Langkah 3: Hitung sisi miring dengan kelipatan k = 3",
    c2Verify: "5² + 12² = 25 + 144 = 169 = 13² ✓",
    c2Ans: "✅",
    c2AnsEnd: "— ini kelipatan triple",
    c2AnsEnd2: "dengan k = 3. Tidak perlu kalkulator!",
    c3Desc: "Seorang insinyur merancang tangga darurat sebuah gedung bertingkat. Jarak horizontal dari ujung bawah tangga ke dinding gedung adalah",
    c3Desc2: "dan tinggi dinding tempat tangga bersandar adalah",
    c3Desc3: ". Berapakah panjang tangga (sisi miring) yang dibutuhkan?",
    c3Step1: "🔍 Langkah 1: Cari FPB dari 560 dan 1.050",
    c3Step2: "🔍 Langkah 2: Kenali triple dasar",
    c3Step3: "🔍 Langkah 3: Hitung panjang tangga dengan kelipatan k = 70",
    c3Verify: "8² + 15² = 64 + 225 = 289 = 17² ✓",
    c3Ans: "✅ Panjang tangga = 1.190 cm — kelipatan triple",
    c3AnsEnd: "dengan k = 70. Angka besar pun selesai dalam hitungan detik! 🚀",
    c3TrickTitle: "💡 Trik Rahasia:",
    c3TrickDesc: "Angka sebesar apapun bisa diselesaikan dengan triple jika kamu bisa menemukan FPB-nya. Bagi kedua kaki dengan FPB → kenali triple dasar → kalikan hipotenusa dengan FPB yang sama!",
    r1: "• Triple Pythagoras: tiga bilangan bulat positif",
    r1b: "dengan",
    r2: "• Triple wajib hafal:",
    r3: "• Kelipatan triple juga valid:",
    r3b: "untuk sembarang",
    r4: "• Mengenali triple = menyelesaikan soal lebih cepat tanpa kalkulator.",
    sideLabel: "Sisi",
    checkerTitle: "🔬 Cek Triple Pythagoras Sendiri!",
    checkerHint: "Masukkan tiga sisi → klik Cek! → segitiga langsung digambar",
    checkerBtn: "Cek!",
    checkerResultTrue: "adalah Triple Pythagoras!",
    checkerResultFalse: "bukan Triple Pythagoras.",
    checkerRight: "✨ Segitiga siku-siku terbentuk!",
    checkerNotRight: "📐 Segitiga terbentuk (bukan siku-siku)",
  },
  en: {
    title: "PYTHAGOREAN TRIPLES",
    subtitle: "Grade 8 · Pythagorean Theorem · Math Book",
    back: "← Back to Pythagorean Theorem",
    sec_intro: "🌟 What is a Pythagorean Triple?",
    sec_daftar: "🏆 5 Types of Pythagorean Triples to Memorize",
    sec_pola: "📐 Compact Table: 5 Types + Multiples",
    sec_contoh1: "✏️ Example 1 — Triples in Various Triangle Positions",
    sec_contoh2: "✏️ Example 2 — Finding the Hypotenuse Using Triple Multiples",
    sec_contoh3: "✏️ Example 3 — Large-Number Word Problem (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    intisari: "🎯 Key Summary",
    introDesc: "A Pythagorean Triple is a set of three positive integers satisfying",
    introDesc2: ". If you memorize these triples, you can instantly identify right triangles without calculating square roots — a favorite trick of mathematicians!",
    introPic: "Imagine you're in an exam and see a triangle with legs 5 cm and 12 cm. Without a calculator, you can immediately say \"the hypotenuse is 13 cm!\" because you've memorized the triple",
    introPicEnd: ". Cool, right? 🚀",
    leg: "Leg",
    hyp: "Hypotenuse",
    bannerTitle: "⚡ 5 BASE TYPES — PARENTS OF ALL TRIPLES",
    bannerSub: "Every Pythagorean triple (generally) is a multiple of one of these 5 types!",
    typeLabel: "TYPE",
    multiples: "🔢 Multiples (also Pythagorean Triples):",
    whyTitle: "📌 Why Do Multiples Also Work?",
    whyDesc: "If",
    whyDesc2: "is a Pythagorean Triple, then for any",
    outsideTitle: "🌟 TRIPLES BEYOND THE 5 TYPES — THEY EXIST!",
    outsideDesc: "While the 5 types above are very popular,",
    outsideDescBold: "there are Pythagorean triples that are not multiples of any of them",
    outsideDescEnd: ". The most famous example:",
    outsideNote: "Not a multiple of any Type 1–5!",
    primitiveDesc: "Triples like",
    primitiveDesc2: "are called",
    primitiveBold: "primitive triples",
    primitiveDesc3: "— all three members share no common factor other than 1 (GCF = 1). This proves the world of Pythagorean triples is vast!",
    tableNote: "⭐ First row = base triple (must memorize!), next rows = multiples.",
    tableBase: "BASE",
    tableLegend: "⭐ Row ×1 = Base Triple (must memorize!)",
    tableLegend2: "Rows ×2–×5 = valid multiples",
    tableTip: "💡 Quick method: Check if the two legs share a common divisor. If the quotients match a type 1–5, you instantly know the hypotenuse!",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1Desc: "Find the missing side in each triangle below",
    c1Bold: "without a calculator",
    c1End: "using your memorized Pythagorean Triples!",
    c1PattA: "Recognize pattern:",
    c1RightB: "Right angle at B",
    c1RightR: "Right angle at R (right)",
    c1RightE: "Right angle at E (top)",
    c1Conclusion: "✅ Pythagorean Triples work in",
    c1ConcBold: "any position",
    c1ConcEnd: "— tilted, flipped, or rotated!",
    c2Title: "✏️ Example 2 — Finding the Hypotenuse Using Triple Multiples",
    c2Desc: "Right triangle PQR with right angle at Q. Given",
    c2Desc2: "and",
    c2Desc3: ". Find hypotenuse",
    c2Desc4: "using Pythagorean Triple multiples!",
    c2Step1: "🔍 Step 1: Find GCF of 15 and 36",
    c2Step2: "🔍 Step 2: Recognize the base triple",
    c2Step3: "🔍 Step 3: Calculate hypotenuse with multiple k = 3",
    c2Verify: "5² + 12² = 25 + 144 = 169 = 13² ✓",
    c2Ans: "✅",
    c2AnsEnd: "— this is a multiple of triple",
    c2AnsEnd2: "with k = 3. No calculator needed!",
    c3Desc: "An engineer designs an emergency staircase for a multi-story building. The horizontal distance from the base of the stairs to the building wall is",
    c3Desc2: "and the height of the wall where the stairs rest is",
    c3Desc3: ". What length of staircase (hypotenuse) is needed?",
    c3Step1: "🔍 Step 1: Find GCF of 560 and 1,050",
    c3Step2: "🔍 Step 2: Recognize the base triple",
    c3Step3: "🔍 Step 3: Calculate staircase length with multiple k = 70",
    c3Verify: "8² + 15² = 64 + 225 = 289 = 17² ✓",
    c3Ans: "✅ Staircase length = 1,190 cm — multiple of triple",
    c3AnsEnd: "with k = 70. Large numbers solved in seconds! 🚀",
    c3TrickTitle: "💡 Secret Trick:",
    c3TrickDesc: "Any large number can be solved with triples if you find the GCF. Divide both legs by GCF → recognize base triple → multiply the hypotenuse by the same GCF!",
    r1: "• Pythagorean Triple: three positive integers",
    r1b: "satisfying",
    r2: "• Triples to memorize:",
    r3: "• Multiples are also valid:",
    r3b: "for any",
    r4: "• Knowing triples = solving problems faster without a calculator.",
    sideLabel: "Side",
    checkerTitle: "🔬 Check Your Own Pythagorean Triple!",
    checkerHint: "Enter three sides → click Check! → triangle is drawn instantly",
    checkerBtn: "Check!",
    checkerResultTrue: "is a Pythagorean Triple!",
    checkerResultFalse: "is NOT a Pythagorean Triple.",
    checkerRight: "✨ Right triangle formed!",
    checkerNotRight: "📐 Triangle formed (not a right triangle)",
  },
  ja: {
    title: "ピタゴラス数（ピタゴラストリプル）",
    subtitle: "8年生 · ピタゴラスの定理 · 数学テキスト",
    back: "← ピタゴラスの定理に戻る",
    sec_intro: "🌟 ピタゴラス数とは？",
    sec_daftar: "🏆 暗記すべき5種類のピタゴラス数",
    sec_pola: "📐 5種類＋倍数のコンパクト表",
    sec_contoh1: "✏️ 例題1 — さまざまな向きの三角形でのトリプル",
    sec_contoh2: "✏️ 例題2 — 倍数トリプルを使って斜辺を求める",
    sec_contoh3: "✏️ 例題3 — 大きな数の文章問題（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    intisari: "🎯 要点まとめ",
    introDesc: "ピタゴラス数とは、",
    introDesc2: "を満たす3つの正の整数の組です。これらを覚えておけば、計算なしに直角三角形を即座に見分けられます — 数学者が愛用するテクニックです！",
    introPic: "試験で直角辺が5cmと12cmの三角形が出たとしましょう。計算機なしで「斜辺は13cm！」とすぐに言えます。なぜなら",
    introPicEnd: "を覚えているから。かっこいいですよね？ 🚀",
    leg: "直角辺",
    hyp: "斜辺",
    bannerTitle: "⚡ 5つの基本型 — 全トリプルの原型",
    bannerSub: "すべてのピタゴラス数は（一般的に）この5種類のどれかの倍数です！",
    typeLabel: "タイプ",
    multiples: "🔢 倍数（これもピタゴラス数）：",
    whyTitle: "📌 なぜ倍数も成立するのか？",
    whyDesc: "もし",
    whyDesc2: "がピタゴラス数なら、任意の",
    outsideTitle: "🌟 5種類以外のトリプルも存在する！",
    outsideDesc: "上記5種類はとても有名ですが、",
    outsideDescBold: "それらの倍数ではないピタゴラス数も存在します",
    outsideDescEnd: "。最も有名な例：",
    outsideNote: "タイプ1〜5のいずれの倍数でもありません！",
    primitiveDesc: "",
    primitiveDesc2: "のようなトリプルは",
    primitiveBold: "原始ピタゴラス数",
    primitiveDesc3: "と呼ばれます — 3数の公約数が1のみ（GCD=1）。ピタゴラス数の世界の広さを証明しています！",
    tableNote: "⭐ 1行目 = 基本トリプル（必ず暗記！）、以降の行 = 倍数。",
    tableBase: "基本",
    tableLegend: "⭐ ×1行 = 基本トリプル（必ず暗記！）",
    tableLegend2: "×2〜×5行 = 有効な倍数",
    tableTip: "💡 素早い方法：2辺が共通の約数を持つか確認する。商がタイプ1〜5と一致すれば、斜辺がすぐわかる！",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解答",
    c1Desc: "次の各三角形で未知の辺を求めなさい",
    c1Bold: "計算機なし",
    c1End: "で、ピタゴラス数の暗記を使って！",
    c1PattA: "パターン認識：",
    c1RightB: "Bで直角",
    c1RightR: "R（右）で直角",
    c1RightE: "E（上）で直角",
    c1Conclusion: "✅ ピタゴラス数は",
    c1ConcBold: "どの向きでも",
    c1ConcEnd: "成立します — 傾いても、反転しても、回転しても！",
    c2Title: "✏️ 例題2 — 倍数トリプルで斜辺を求める",
    c2Desc: "QでQが直角の直角三角形PQR。",
    c2Desc2: "と",
    c2Desc3: "が既知。倍数ピタゴラス数を使って斜辺",
    c2Desc4: "を求めなさい！",
    c2Step1: "🔍 ステップ1：15と36の最大公約数を求める",
    c2Step2: "🔍 ステップ2：基本トリプルを認識する",
    c2Step3: "🔍 ステップ3：倍数k = 3で斜辺を計算する",
    c2Verify: "5² + 12² = 25 + 144 = 169 = 13² ✓",
    c2Ans: "✅",
    c2AnsEnd: "— これはトリプル",
    c2AnsEnd2: "のk=3倍。計算機不要！",
    c3Desc: "エンジニアが高層ビルの非常階段を設計しています。階段の足元から壁までの水平距離は",
    c3Desc2: "、階段が立てかかる壁の高さは",
    c3Desc3: "です。必要な階段（斜辺）の長さは何cmですか？",
    c3Step1: "🔍 ステップ1：560と1050の最大公約数を求める",
    c3Step2: "🔍 ステップ2：基本トリプルを認識する",
    c3Step3: "🔍 ステップ3：倍数k = 70で階段の長さを計算する",
    c3Verify: "8² + 15² = 64 + 225 = 289 = 17² ✓",
    c3Ans: "✅ 階段の長さ = 1,190 cm — トリプル",
    c3AnsEnd: "のk=70倍。大きな数も数秒で解決！ 🚀",
    c3TrickTitle: "💡 秘密のコツ：",
    c3TrickDesc: "どんなに大きな数でも最大公約数が見つかればトリプルで解けます。両辺をGCFで割る → 基本トリプルを認識する → 斜辺に同じGCFを掛ける！",
    r1: "• ピタゴラス数：正の整数",
    r1b: "であって",
    r2: "• 暗記すべきトリプル：",
    r3: "• 倍数も有効：",
    r3b: "任意の",
    r4: "• トリプルを知ることで、計算機なしに問題を素早く解ける。",
    sideLabel: "辺",
    checkerTitle: "🔬 自分でピタゴラス数を確かめよう！",
    checkerHint: "3辺を入力 → 判定！ → 三角形がすぐ描画される",
    checkerBtn: "判定！",
    checkerResultTrue: "はピタゴラス数です！",
    checkerResultFalse: "はピタゴラス数ではありません。",
    checkerRight: "✨ 直角三角形が形成されました！",
    checkerNotRight: "📐 三角形が形成されました（直角三角形ではありません）",
  },
} as const;
type Lang = keyof typeof translations;

/* ── 5 Tipe Triple Pythagoras — labels are i18n-safe (numbers/emoji only now) ── */
const LIMA_TIPE_DATA = [
  { tipe:1, a:3,  b:4,  c:5,  emoji:'🥇', text:'text-cyan-300',   bd:'border-cyan-500/60',   hdr:'bg-cyan-900/50',   chip:'bg-cyan-900/40'   },
  { tipe:2, a:5,  b:12, c:13, emoji:'🥈', text:'text-green-300',  bd:'border-green-500/60',  hdr:'bg-green-900/50',  chip:'bg-green-900/40'  },
  { tipe:3, a:7,  b:24, c:25, emoji:'🥉', text:'text-violet-300', bd:'border-violet-500/60', hdr:'bg-violet-900/50', chip:'bg-violet-900/40' },
  { tipe:4, a:8,  b:15, c:17, emoji:'⭐', text:'text-yellow-300', bd:'border-yellow-500/60', hdr:'bg-yellow-900/50', chip:'bg-yellow-900/40' },
  { tipe:5, a:9,  b:40, c:41, emoji:'💎', text:'text-pink-300',   bd:'border-pink-500/60',   hdr:'bg-pink-900/50',   chip:'bg-pink-900/40'   },
];

const LIMA_TIPE_LABELS: Record<string, string[]> = {
  id: ['Triple Paling Dasar', 'Triple Pelaut & Navigator', 'Triple Tersembunyi', 'Triple Para Arsitek', 'Triple Luar Biasa'],
  en: ['Most Basic Triple', 'Sailor & Navigator Triple', 'Hidden Triple', "Architects' Triple", 'Extraordinary Triple'],
  ja: ['最も基本的なトリプル', '航海者のトリプル', '隠れたトリプル', '建築家のトリプル', '驚異のトリプル'],
};

/* ── SVG: Triple verification bar chart ── */
const TripleVerifSVG = ({ a, b, c }: { a: number; b: number; c: number }) => {
  const max = c * c;
  const scaleW = 220 / max;
  return (
    <svg viewBox="0 0 300 90" className="w-full max-w-xs mx-auto" aria-label={`Verification ${a}-${b}-${c}`}>
      <rect x="20" y="12" width={a*a*scaleW} height="16" rx="3" fill="#3b82f6" fillOpacity="0.85"/>
      <text x={a*a*scaleW+24} y="24" fill="#60a5fa" fontSize="9" fontFamily="monospace">{a}²={a*a}</text>
      <rect x="20" y="34" width={b*b*scaleW} height="16" rx="3" fill="#22c55e" fillOpacity="0.85"/>
      <text x={b*b*scaleW+24} y="46" fill="#4ade80" fontSize="9" fontFamily="monospace">{b}²={b*b}</text>
      <rect x="20" y="58" width={c*c*scaleW} height="16" rx="3" fill="#f97316" fillOpacity="0.85"/>
      <text x={c*c*scaleW+24} y="70" fill="#fb923c" fontSize="9" fontFamily="monospace">{c}²={c*c}</text>
      <text x="20" y="86" fill="#94a3b8" fontSize="8" fontFamily="monospace">{a}²+{b}²={a*a+b*b} = {c}²={c*c} ✓</text>
    </svg>
  );
};

/* ── Dynamic triangle SVG for checker ── */
const CheckerTriangleSVG = ({
  s1, s2, s3, isTriple, sideLabel,
}: { s1: number; s2: number; s3: number; isTriple: boolean; sideLabel: string }) => {
  const p3x = (s1 * s1 + s2 * s2 - s3 * s3) / (2 * s1);
  const p3ySq = s2 * s2 - p3x * p3x;
  if (p3ySq < 0) return null;
  const p3y = Math.sqrt(p3ySq);
  const minX = Math.min(0, p3x);
  const maxX = Math.max(s1, p3x);
  const rawW = maxX - minX || 1;
  const rawH = p3y || 1;
  const drawW = 300, drawH = 140;
  const scale = Math.min(drawW / rawW, drawH / rawH) * 0.75;
  const offsetX = (drawW - rawW * scale) / 2 + 30;
  const offsetY = 20;
  const tx = (x: number) => (x - minX) * scale + offsetX;
  const ty = (y: number) => drawH + offsetY - y * scale;
  const P1 = { x: tx(0),   y: ty(0)   };
  const P2 = { x: tx(s1),  y: ty(0)   };
  const P3 = { x: tx(p3x), y: ty(p3y) };
  const mid12 = { x: (P1.x + P2.x) / 2, y: (P1.y + P2.y) / 2 };
  const mid13 = { x: (P1.x + P3.x) / 2, y: (P1.y + P3.y) / 2 };
  const mid23 = { x: (P2.x + P3.x) / 2, y: (P2.y + P3.y) / 2 };
  const rightAngleSize = Math.min(10, scale * Math.min(s1, s2, s3) * 0.12);
  const RightAngleAt = ({ vx, vy, ax, ay, bx, by }: { vx:number;vy:number;ax:number;ay:number;bx:number;by:number }) => {
    const lenA = Math.hypot(ax - vx, ay - vy);
    const lenB = Math.hypot(bx - vx, by - vy);
    const uAx = (ax - vx) / lenA * rightAngleSize;
    const uAy = (ay - vy) / lenA * rightAngleSize;
    const uBx = (bx - vx) / lenB * rightAngleSize;
    const uBy = (by - vy) / lenB * rightAngleSize;
    const mx = vx + uAx + uBx;
    const my = vy + uAy + uBy;
    return <polyline points={`${vx+uAx},${vy+uAy} ${mx},${my} ${vx+uBx},${vy+uBy}`} fill="none" stroke="#4ade80" strokeWidth="1.8"/>;
  };
  const sides = [s1, s2, s3].sort((x, y) => x - y);
  const hyp = sides[2];
  let rightVertex: { vx:number;vy:number;ax:number;ay:number;bx:number;by:number } | null = null;
  if (isTriple) {
    if (hyp === s3) rightVertex = { vx:P2.x,vy:P2.y,ax:P1.x,ay:P1.y,bx:P3.x,by:P3.y };
    else if (hyp === s2) rightVertex = { vx:P3.x,vy:P3.y,ax:P1.x,ay:P1.y,bx:P2.x,by:P2.y };
    else rightVertex = { vx:P1.x,vy:P1.y,ax:P2.x,ay:P2.y,bx:P3.x,by:P3.y };
  }
  const vb = `0 0 ${drawW + 60} ${drawH + offsetY + 30}`;
  return (
    <svg viewBox={vb} className="w-full max-w-xs mx-auto block" aria-label="Triangle from input">
      <defs>
        <filter id="cglow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <polygon points={`${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`}
        fill={isTriple ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)"} stroke="none"/>
      <line x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" filter="url(#cglow)"/>
      <line x1={P1.x} y1={P1.y} x2={P3.x} y2={P3.y} stroke="#4ade80" strokeWidth="3" strokeLinecap="round" filter="url(#cglow)"/>
      <line x1={P2.x} y1={P2.y} x2={P3.x} y2={P3.y} stroke="#fb923c" strokeWidth="3" strokeLinecap="round" filter="url(#cglow)"/>
      {rightVertex && <RightAngleAt {...rightVertex}/>}
      <circle cx={P1.x} cy={P1.y} r="4" fill="#60a5fa"/>
      <circle cx={P2.x} cy={P2.y} r="4" fill="#fb923c"/>
      <circle cx={P3.x} cy={P3.y} r="4" fill="#4ade80"/>
      <text x={mid12.x} y={mid12.y + 14} fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{sideLabel} 1 = {s1}</text>
      <text x={mid13.x - 14} y={mid13.y} fill="#86efac" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{sideLabel} 2 = {s2}</text>
      <text x={mid23.x + 14} y={mid23.y} fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{sideLabel} 3 = {s3}</text>
    </svg>
  );
};

const TriplePythagorasPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as Lang];
  const limaLabels = LIMA_TIPE_LABELS[language] ?? LIMA_TIPE_LABELS.id;
  const LIMA_TIPE = LIMA_TIPE_DATA.map((item, i) => ({ ...item, label: limaLabels[i] }));

  const [open, setOpen] = useState<string[]>(["intro","daftar","pola","contoh1","contoh2","contoh3","rangkuman"]);
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

  const TripleChecker = () => {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [c, setC] = useState("");
    const [result, setResult] = useState<null | boolean>(null);
    const [checked, setChecked] = useState<{ na: number; nb: number; nc: number } | null>(null);

    const check = () => {
      const na = parseInt(a), nb = parseInt(b), nc = parseInt(c);
      if (isNaN(na) || isNaN(nb) || isNaN(nc) || na <= 0 || nb <= 0 || nc <= 0) {
        setResult(null); setChecked(null); return;
      }
      const sides = [na, nb, nc].sort((x, y) => x - y);
      setResult(sides[0]**2 + sides[1]**2 === sides[2]**2);
      setChecked({ na, nb, nc });
    };

    return (
      <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-4 space-y-3">
        <div className="rounded-xl bg-slate-900/60 border border-slate-600/50 px-3 pt-3 pb-1">
          <svg viewBox="0 0 320 150" className="w-full max-w-xs mx-auto block" aria-label="Right triangle illustration">
            <defs>
              <filter id="ck-glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <polygon points="40,125 240,125 40,25" fill="rgba(99,102,241,0.10)" stroke="none"/>
            <line x1="40" y1="125" x2="40" y2="25" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" filter="url(#ck-glow)"/>
            <line x1="40" y1="125" x2="240" y2="125" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" filter="url(#ck-glow)"/>
            <line x1="240" y1="125" x2="40" y2="25" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" filter="url(#ck-glow)"/>
            <polyline points="40,107 58,107 58,125" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinejoin="miter"/>
            <circle cx="40"  cy="125" r="4" fill="#4ade80"/>
            <circle cx="240" cy="125" r="4" fill="#60a5fa"/>
            <circle cx="40"  cy="25"  r="4" fill="#facc15"/>
            <text x="6" y="78" fill="#86efac" fontSize="11" fontFamily="monospace" fontWeight="bold">{t.sideLabel} 2</text>
            <text x="118" y="142" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{t.sideLabel} 1</text>
            <text x="158" y="66" fill="#fde047" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-27,158,66)">{t.sideLabel} 3</text>
            <text x="62" y="122" fill="#86efac" fontSize="9" fontFamily="monospace" fontWeight="bold">90°</text>
            <rect x="248" y="38" width="66" height="34" rx="8" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" opacity="0.95"/>
            <text x="281" y="54" fill="#a5b4fc" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{t.sideLabel}1²+{t.sideLabel}2²</text>
            <text x="281" y="66" fill="#facc15" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">= {t.sideLabel}3² ?</text>
          </svg>
          <p className="text-center text-[10px] text-white/30 font-body pb-1">{t.checkerHint}</p>
        </div>
        <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.checkerTitle}</p>
        <div className="flex gap-2 items-center flex-wrap">
          {[
            { val: a, set: setA, label: `${t.sideLabel} 1`, col: "border-blue-500" },
            { val: b, set: setB, label: `${t.sideLabel} 2`, col: "border-green-500" },
            { val: c, set: setC, label: `${t.sideLabel} 3`, col: "border-orange-500" },
          ].map(({ val, set, label, col }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="font-body text-xs text-white/50">{label}</label>
              <input type="number" min="1" value={val}
                onChange={e => { set(e.target.value); setResult(null); setChecked(null); }}
                className={`w-20 bg-slate-900/60 border ${col} rounded-lg px-3 py-2 text-white text-sm font-body focus:outline-none`}
                placeholder="..."/>
            </div>
          ))}
          <button onClick={check}
            className="mt-5 px-4 py-2 bg-cyan-700/60 border border-cyan-500 text-cyan-300 rounded-lg text-xs font-bold font-body hover:bg-cyan-600/60 transition-colors cursor-pointer">
            {t.checkerBtn}
          </button>
        </div>
        {result !== null && checked && (
          <>
            <div className={`rounded-lg p-3 border ${result ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"}`}>
              <p className={`font-body text-sm font-bold ${result ? "text-green-300" : "text-red-300"}`}>
                {result
                  ? `✅ ${checked.na}-${checked.nb}-${checked.nc} ${t.checkerResultTrue}`
                  : `❌ ${checked.na}-${checked.nb}-${checked.nc} ${t.checkerResultFalse}`}
              </p>
            </div>
            <div className={`rounded-xl border p-3 ${result ? "border-green-500/30 bg-green-950/20" : "border-red-500/30 bg-red-950/20"}`}>
              <p className="text-center text-xs font-body text-white/50 mb-2">
                {result ? t.checkerRight : t.checkerNotRight}
              </p>
              <CheckerTriangleSVG s1={checked.na} s2={checked.nb} s3={checked.nc} isTriple={result} sideLabel={t.sideLabel}/>
              <div className="flex justify-center gap-4 mt-2 flex-wrap">
                {[
                  { color:"#60a5fa", textColor:"text-blue-300", label:`${t.sideLabel} 1` },
                  { color:"#4ade80", textColor:"text-green-300", label:`${t.sideLabel} 2` },
                  { color:"#fb923c", textColor:"text-orange-300", label:`${t.sideLabel} 3` },
                ].map(({ color, textColor, label }) => (
                  <span key={label} className={`flex items-center gap-1 text-[10px] font-mono ${textColor}`}>
                    <span className="inline-block w-4 h-0.5 rounded" style={{ background: color, boxShadow: `0 0 4px ${color}` }}/>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
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
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">{t.title}</strong> {t.introDesc} <InlineMath math="a^2 + b^2 = c^2"/>{t.introDesc2}
                  </p>
                </div>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introPic} <strong className="text-yellow-300">5-12-13</strong>{t.introPicEnd}
                </p>
                <div className="relative rounded-2xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/60 to-slate-900/90 p-4">
                  <p className="text-center text-xs font-bold text-yellow-300 uppercase tracking-widest mb-3 font-body">✨ 5 – 12 – 13</p>
                  <svg viewBox="0 0 380 230" className="w-full max-w-sm mx-auto block" aria-label="5-12-13 right triangle">
                    <defs>
                      <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25"/>
                      </linearGradient>
                      <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      <filter id="glowStrong"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    </defs>
                    <polygon points="50,190 290,190 50,50" fill="url(#triGrad)" stroke="none"/>
                    <line x1="50" y1="190" x2="290" y2="190" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)"/>
                    <line x1="50" y1="190" x2="50" y2="50" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)"/>
                    <line x1="290" y1="190" x2="50" y2="50" stroke="#facc15" strokeWidth="4" strokeLinecap="round" filter="url(#glowStrong)"/>
                    <polyline points="50,172 68,172 68,190" fill="none" stroke="#4ade80" strokeWidth="2.2" strokeLinejoin="miter"/>
                    <circle cx="50"  cy="190" r="5" fill="#4ade80"  filter="url(#glow)"/>
                    <circle cx="290" cy="190" r="5" fill="#22d3ee"  filter="url(#glow)"/>
                    <circle cx="50"  cy="50"  r="5" fill="#facc15"  filter="url(#glowStrong)"/>
                    <text x="30"  y="210" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
                    <text x="295" y="210" fill="#22d3ee" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
                    <text x="34"  y="44"  fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
                    <text x="160" y="215" fill="#22d3ee" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">12 cm</text>
                    <text x="26"  y="125" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5 cm</text>
                    <text x="186" y="108" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-33,186,108)">13 cm</text>
                    <text x="74" y="188" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">90°</text>
                    <rect x="285" y="30" width="80" height="28" rx="8" fill="#1e1b4b" stroke="#facc15" strokeWidth="1.5" opacity="0.9"/>
                    <text x="325" y="49" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5²+12²=13²✓</text>
                  </svg>
                  <div className="flex justify-center gap-5 mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#4ade80',boxShadow:'0 0 6px #4ade80'}}/>
                      <span className="text-green-300">{t.leg} = 5 cm</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#22d3ee',boxShadow:'0 0 6px #22d3ee'}}/>
                      <span className="text-cyan-300">{t.leg} = 12 cm</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="inline-block w-5 h-1 rounded" style={{background:'#facc15',boxShadow:'0 0 8px #facc15'}}/>
                      <span className="text-yellow-300">{t.hyp} = 13 cm</span>
                    </span>
                  </div>
                </div>
                <TripleVerifSVG a={3} b={4} c={5}/>
              </div>
            )}
          </div>

          {/* DAFTAR TRIPLE */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="daftar" icon={<Star className="w-5 h-5"/>} iconColor="text-yellow-400" title={t.sec_daftar}/>
            {open.includes("daftar") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="relative rounded-xl overflow-hidden border border-white/10 p-4 text-center"
                  style={{background:'linear-gradient(135deg,rgba(8,145,178,0.35) 0%,rgba(124,58,237,0.35) 50%,rgba(219,39,119,0.35) 100%)'}}>
                  <p className="font-display text-base md:text-lg font-black text-white tracking-wide">{t.bannerTitle}</p>
                  <p className="font-body text-xs text-white/60 mt-1">{t.bannerSub}</p>
                </div>
                {LIMA_TIPE.map(({ tipe, a, b, c, emoji, label, text, bd, hdr, chip }) => (
                  <div key={tipe} className={`border ${bd} rounded-xl overflow-hidden`}>
                    <div className={`${hdr} px-4 py-3 flex items-center justify-between gap-2`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{emoji}</span>
                        <div className="min-w-0">
                          <p className={`font-display text-xs font-black ${text} uppercase tracking-[0.15em]`}>{t.typeLabel} {tipe}</p>
                          <p className="text-white/50 text-xs truncate">{label}</p>
                        </div>
                      </div>
                      <div className={`font-mono font-black text-xl md:text-2xl ${text} flex-shrink-0`}>
                        {a} – {b} – {c}
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-slate-900/30 space-y-3">
                      <div className="bg-slate-800/70 rounded-lg px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
                        <span className="text-blue-300">{a}²</span><span className="text-white/30">+</span>
                        <span className="text-green-300">{b}²</span><span className="text-white/30">=</span>
                        <span className="text-blue-300">{a*a}</span><span className="text-white/30">+</span>
                        <span className="text-green-300">{b*b}</span><span className="text-white/30">=</span>
                        <span className="text-white font-bold">{a*a+b*b}</span><span className="text-white/30">=</span>
                        <span className="text-orange-300">{c}²</span><span className="text-white/30">=</span>
                        <span className="text-orange-300">{c*c}</span>
                        <span className={`font-bold ${text} ml-1`}>✓</span>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1.5 font-body">{t.multiples}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {[2,3,4,5].map(k => (
                            <div key={k} className={`${chip} rounded-lg px-2 py-2 text-center border border-white/5`}>
                              <p className="text-[10px] text-white/40 font-body">×{k}</p>
                              <p className={`text-xs font-bold font-mono ${text}`}>{a*k}–{b*k}–{c*k}</p>
                              <p className="text-[9px] text-white/30 font-mono">{a*a*k*k+b*b*k*k}={c*c*k*k}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="text-cyan-300 font-semibold text-sm">{t.whyTitle}</p>
                  <p className="font-body text-xs text-white/70">
                    {t.whyDesc} <InlineMath math="(a, b, c)"/> {t.whyDesc2} <InlineMath math="k > 0"/>:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="(ka)^2 + (kb)^2 = k^2(a^2+b^2) = k^2c^2 = (kc)^2 \checkmark"/>
                  </div>
                </div>
                <div className="bg-amber-900/20 border-2 border-amber-500/50 rounded-xl overflow-hidden">
                  <div className="bg-amber-900/40 px-4 py-2 border-b border-amber-500/30">
                    <p className="font-display text-sm font-black text-amber-300 tracking-wide">{t.outsideTitle}</p>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <p className="font-body text-xs text-white/70">
                      {t.outsideDesc} <strong className="text-amber-300">{t.outsideDescBold}</strong>{t.outsideDescEnd}
                    </p>
                    <div className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
                      <span className="text-4xl flex-shrink-0">💡</span>
                      <div className="min-w-0">
                        <p className="text-amber-300 font-mono font-black text-2xl tracking-wide">20 – 21 – 29</p>
                        <div className="mt-1 text-xs font-mono text-white/60 flex flex-wrap gap-x-2">
                          <span>20²+21² = 400+441 =</span>
                          <span className="text-green-300 font-bold">841</span>
                          <span>= 29² ✓</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1 font-body italic">{t.outsideNote}</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                      <p className="text-xs font-body text-white/60">
                        {t.primitiveDesc} <strong className="text-amber-300">20-21-29</strong> {t.primitiveDesc2} <strong className="text-amber-300">{t.primitiveBold}</strong>{t.primitiveDesc3}
                      </p>
                    </div>
                  </div>
                </div>
                <TripleChecker/>
              </div>
            )}
          </div>

          {/* POLA KELIPATAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pola" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title={t.sec_pola}/>
            {open.includes("pola") && (
              <div className="px-3 sm:px-5 pb-5 space-y-4">
                <p className="font-body text-xs text-white/60">{t.tableNote}</p>
                <div className="rounded-2xl overflow-hidden border border-slate-600/60"
                  style={{background:'linear-gradient(180deg,rgba(15,23,42,0.95) 0%,rgba(2,6,23,0.98) 100%)'}}>
                  <div className="grid font-mono" style={{gridTemplateColumns:'auto repeat(5,1fr)'}}>
                    <div className="px-1.5 sm:px-3 py-2 flex items-center justify-center bg-slate-800/80 border-b border-r border-slate-700/50">
                      <span className="text-[9px] sm:text-[11px] text-white/40 font-bold tracking-widest">k</span>
                    </div>
                    {LIMA_TIPE.map(item => (
                      <div key={item.tipe} className="py-2 px-0.5 flex flex-col items-center justify-center gap-0.5 border-b border-r border-slate-700/50 last:border-r-0"
                        style={{background:'linear-gradient(160deg,rgba(15,23,42,0.9) 0%,rgba(30,41,59,0.85) 100%)'}}>
                        <span className="text-sm sm:text-base leading-none">{item.emoji}</span>
                        <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-tight ${item.text}`}>{t.typeLabel} {item.tipe}</span>
                        <span className={`text-[7px] sm:text-[9px] font-bold font-mono ${item.text} opacity-80`}>{item.a}–{item.b}–{item.c}</span>
                      </div>
                    ))}
                  </div>
                  {[1,2,3,4,5].map(k => {
                    const isBase = k === 1;
                    return (
                      <div key={k} className="grid border-b border-slate-700/30 last:border-b-0"
                        style={{gridTemplateColumns:'auto repeat(5,1fr)', background: isBase ? 'linear-gradient(90deg,rgba(6,182,212,0.18) 0%,rgba(139,92,246,0.12) 50%,rgba(236,72,153,0.10) 100%)' : k%2===0 ? 'rgba(15,23,42,0.6)' : 'rgba(30,41,59,0.3)'}}>
                        <div className={`px-1.5 sm:px-3 flex items-center justify-center border-r border-slate-700/40 ${isBase?'py-3':'py-2'}`}>
                          {isBase ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[8px] sm:text-[10px] leading-none">⭐</span>
                              <span className="text-[9px] sm:text-[11px] font-black text-cyan-300 font-mono">×1</span>
                              <span className="text-[6px] sm:text-[8px] text-cyan-400/70 font-body leading-none hidden sm:block">{t.tableBase}</span>
                            </div>
                          ) : (
                            <span className="text-[9px] sm:text-[11px] font-bold text-white/40 font-mono">×{k}</span>
                          )}
                        </div>
                        {LIMA_TIPE.map(item => (
                          <div key={item.tipe} className={`flex items-center justify-center border-r border-slate-700/30 last:border-r-0 text-center ${isBase?'py-3':'py-2'}`}>
                            {isBase ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <span className={`text-[10px] sm:text-[13px] font-black font-mono leading-tight ${item.text}`} style={{textShadow:'0 0 8px currentColor'}}>
                                  {item.a*k}–{item.b*k}–{item.c*k}
                                </span>
                                <span className="text-[7px] sm:text-[9px] text-white/30 font-mono hidden sm:block">
                                  {item.a*item.a}+{item.b*item.b}={item.c*item.c}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[8px] sm:text-[11px] font-mono text-white/55">
                                {item.a*k}–{item.b*k}–{item.c*k}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-start gap-2 flex-wrap text-[10px] font-body text-white/50">
                  <span className="flex items-center gap-1"><span className="text-sm">⭐</span> {t.tableLegend}</span>
                  <span className="flex items-center gap-1 ml-auto sm:ml-0">{t.tableLegend2}</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-600 rounded-lg px-4 py-2">
                  <p className="font-body text-xs text-white/50">{t.tableTip}</p>
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
                  <p className="font-body text-sm text-white/90">
                    {t.c1Desc} <strong className="text-yellow-300">{t.c1Bold}</strong> {t.c1End}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* (a) Triple 3-4-5 */}
                  <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-2">
                    <p className="text-cyan-300 font-bold text-xs font-body text-center">(a) {t.c1RightB}</p>
                    <svg viewBox="0 0 130 130" className="w-full max-w-[130px] mx-auto" aria-label="Triangle a">
                      <defs><filter id="g1"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <polygon points="25,105 25,25 85,105" fill="rgba(6,182,212,0.08)" stroke="none"/>
                      <line x1="25" y1="105" x2="25" y2="25" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" filter="url(#g1)"/>
                      <line x1="25" y1="105" x2="85" y2="105" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" filter="url(#g1)"/>
                      <line x1="25" y1="25" x2="85" y2="105" stroke="#facc15" strokeWidth="3" strokeLinecap="round" filter="url(#g1)"/>
                      <polyline points="25,90 40,90 40,105" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                      <text x="10" y="70" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">4 cm</text>
                      <text x="45" y="118" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">3 cm</text>
                      <text x="58" y="58" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">?</text>
                      <text x="20" y="18" fill="#94a3b8" fontSize="9" fontFamily="monospace">A</text>
                      <text x="10" y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">B</text>
                      <text x="88" y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">C</text>
                    </svg>
                    <div className="bg-slate-900/60 rounded-lg px-2 py-1.5 space-y-1">
                      <p className="text-[10px] text-white/50 font-body">{t.c1PattA} <span className="text-yellow-300 font-bold">3–4–5</span></p>
                      <p className="text-[11px] text-green-300 font-mono font-bold text-center">AC = 5 cm ✓</p>
                    </div>
                  </div>
                  {/* (b) Triple 7-24-25 */}
                  <div className="bg-slate-800/60 border border-violet-500/30 rounded-xl p-3 flex flex-col gap-2">
                    <p className="text-violet-300 font-bold text-xs font-body text-center">(b) {t.c1RightR}</p>
                    <svg viewBox="0 0 130 130" className="w-full max-w-[130px] mx-auto" aria-label="Triangle b">
                      <defs><filter id="g2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <polygon points="105,105 105,10 20,105" fill="rgba(139,92,246,0.08)" stroke="none"/>
                      <line x1="105" y1="105" x2="105" y2="10" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" filter="url(#g2)"/>
                      <line x1="105" y1="105" x2="20" y2="105" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" filter="url(#g2)"/>
                      <line x1="105" y1="10" x2="20" y2="105" stroke="#facc15" strokeWidth="3" strokeLinecap="round" filter="url(#g2)"/>
                      <polyline points="105,90 90,90 90,105" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                      <text x="108" y="62" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">24</text>
                      <text x="52" y="118" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">7 cm</text>
                      <text x="46" y="52" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">?</text>
                      <text x="100" y="8" fill="#94a3b8" fontSize="9" fontFamily="monospace">P</text>
                      <text x="8"   y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">Q</text>
                      <text x="108" y="118" fill="#94a3b8" fontSize="9" fontFamily="monospace">R</text>
                    </svg>
                    <div className="bg-slate-900/60 rounded-lg px-2 py-1.5 space-y-1">
                      <p className="text-[10px] text-white/50 font-body">{t.c1PattA} <span className="text-violet-300 font-bold">7–24–25</span></p>
                      <p className="text-[11px] text-green-300 font-mono font-bold text-center">PQ = 25 cm ✓</p>
                    </div>
                  </div>
                  {/* (c) Triple 8-15-17 */}
                  <div className="bg-slate-800/60 border border-pink-500/30 rounded-xl p-3 flex flex-col gap-2">
                    <p className="text-pink-300 font-bold text-xs font-body text-center">(c) {t.c1RightE}</p>
                    <svg viewBox="0 0 130 130" className="w-full max-w-[130px] mx-auto" aria-label="Triangle c">
                      <defs><filter id="g3"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <polygon points="20,20 20,95 52,20" fill="rgba(236,72,153,0.08)" stroke="none"/>
                      <line x1="20" y1="20" x2="20" y2="95" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" filter="url(#g3)"/>
                      <line x1="20" y1="20" x2="52" y2="20" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" filter="url(#g3)"/>
                      <line x1="20" y1="95" x2="52" y2="20" stroke="#facc15" strokeWidth="3" strokeLinecap="round" filter="url(#g3)"/>
                      <polyline points="20,35 35,35 35,20" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                      <text x="2" y="62" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">15</text>
                      <text x="22" y="14" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">8 cm</text>
                      <text x="50" y="65" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">?</text>
                      <text x="14" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">E</text>
                      <text x="8"  y="108" fill="#94a3b8" fontSize="9" fontFamily="monospace">D</text>
                      <text x="54" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">F</text>
                    </svg>
                    <div className="bg-slate-900/60 rounded-lg px-2 py-1.5 space-y-1">
                      <p className="text-[10px] text-white/50 font-body">{t.c1PattA} <span className="text-pink-300 font-bold">8–15–17</span></p>
                      <p className="text-[11px] text-green-300 font-mono font-bold text-center">DF = 17 cm ✓</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-green-300 text-center">
                    {t.c1Conclusion} <strong>{t.c1ConcBold}</strong>{t.c1ConcEnd}
                  </p>
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
                  <p className="font-body text-sm text-white/90">
                    {t.c2Desc} <strong className="text-cyan-300">PQ = 15 cm</strong> {t.c2Desc2} <strong className="text-green-300">QR = 36 cm</strong>. {t.c2Desc3} <strong className="text-yellow-300">PR</strong> {t.c2Desc4}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80 font-semibold">{t.c2Step1}</p>
                  <BlockMath math="15 = 3 \times 5, \quad 36 = 3 \times 12"/>
                  <p className="font-body text-sm text-white/80">GCF/FPB = <strong className="text-cyan-300">3</strong>:</p>
                  <BlockMath math="\frac{15}{3} = 5 \qquad \frac{36}{3} = 12"/>
                  <p className="font-body text-sm text-white/80 font-semibold">{t.c2Step2}</p>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg px-3 py-2 text-center">
                    <p className="font-mono text-yellow-300 font-bold text-sm">5 – 12 – 13</p>
                    <p className="text-xs text-white/50 font-body">{t.c2Verify}</p>
                  </div>
                  <p className="font-body text-sm text-white/80 font-semibold">{t.c2Step3}</p>
                  <BlockMath math="PR = k \times 13 = 3 \times 13 = 39 \text{ cm}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">
                      {t.c2Ans} <strong>PR = 39 cm</strong> {t.c2AnsEnd} <span className="text-yellow-300 font-bold">5–12–13</span> {t.c2AnsEnd2}
                    </p>
                  </div>
                  <TripleVerifSVG a={15} b={36} c={39}/>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title={t.sec_contoh3}/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 space-y-3">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide">{t.hard}</p>
                  <div className="flex gap-3 items-center bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
                    <span className="text-4xl flex-shrink-0">🏗️</span>
                    <p className="font-body text-sm text-white/90 leading-relaxed">
                      {t.c3Desc} <strong className="text-cyan-300">560 cm</strong>, {t.c3Desc2} <strong className="text-green-300">1.050 cm</strong>. {t.c3Desc3}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80 font-semibold">{t.c3Step1}</p>
                  <BlockMath math="560 = 70 \times 8 \qquad 1050 = 70 \times 15"/>
                  <p className="font-body text-sm text-white/80 font-semibold">{t.c3Step2}</p>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-2 text-center">
                    <p className="font-mono text-red-300 font-bold text-sm">8 – 15 – 17</p>
                    <p className="text-xs text-white/50 font-body">{t.c3Verify}</p>
                  </div>
                  <p className="font-body text-sm text-white/80 font-semibold">{t.c3Step3}</p>
                  <BlockMath math="= k \times 17 = 70 \times 17 = 1.190 \text{ cm}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">
                      {t.c3Ans} <span className="text-red-300 font-bold">8–15–17</span> {t.c3AnsEnd}
                    </p>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-2">
                    <p className="font-body text-xs text-amber-300 font-semibold mb-1">{t.c3TrickTitle}</p>
                    <p className="font-body text-xs text-white/70">{t.c3TrickDesc}</p>
                  </div>
                  <TripleVerifSVG a={560} b={1050} c={1190}/>
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
                  <p className="font-body text-sm text-white/80">• {t.r1} <InlineMath math="a, b, c"/> {t.r1b} <InlineMath math="a^2+b^2=c^2"/>.</p>
                  <p className="font-body text-sm text-white/80">• {t.r2} <strong className="text-yellow-300">3-4-5, 5-12-13, 8-15-17, 7-24-25</strong>.</p>
                  <p className="font-body text-sm text-white/80">• {t.r3} <InlineMath math="(ka, kb, kc)"/> {t.r3b} <InlineMath math="k > 0"/>.</p>
                  <p className="font-body text-sm text-white/80">• {t.r4}</p>
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

export default TriplePythagorasPage;
