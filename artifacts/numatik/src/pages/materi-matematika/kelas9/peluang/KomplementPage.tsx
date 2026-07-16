import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Shuffle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────────────────────────── */

const levelLabels: Record<string, Record<Language, string>> = {
  MUDAH: { id: "MUDAH", en: "EASY", ja: "基本" },
  SEDANG: { id: "SEDANG", en: "MEDIUM", ja: "標準" },
  SULIT: { id: "SULIT", en: "HARD", ja: "発展" },
};
function levelLabel(level: string, language: Language): string {
  return levelLabels[level]?.[language] ?? level;
}

const kali: Record<Language, string> = { id: "\\,\\mathrm{kali}", en: "\\,\\mathrm{times}", ja: "\\,\\mathrm{回}" };

const pageTrans = {
  id: {
    h1: "KOMPLEMEN SUATU KEJADIAN",
    h2: "Peluang Kejadian \"Kebalikan\" yang Selalu Berpasangan",
    ctx: "Kelas 9 · Peluang · Materi Matematika",
    back: "← Kembali ke Menu Peluang",
    soal: "Soal",
    pembahasan: "✅ Pembahasan",
  },
  en: {
    h1: "COMPLEMENT OF AN EVENT",
    h2: "The Probability of the \"Opposite\" Event — Always Paired",
    ctx: "Grade 9 · Probability · Math Material",
    back: "← Back to Probability Menu",
    soal: "Problem",
    pembahasan: "✅ Solution",
  },
  ja: {
    h1: "余事象（事象の補集合）",
    h2: "常にペアで存在する「反対の」事象の確率",
    ctx: "中学3年・確率・数学教材",
    back: "← 確率メニューに戻る",
    soal: "問題",
    pembahasan: "✅ 解説",
  },
} as const;

const sectionTitles = {
  id: {
    intro: "🌟 Apa Itu Komplemen Kejadian?",
    konsep1: "📘 Rumus & Sifat Komplemen Kejadian",
    contoh1: "📝 Contoh Soal & Pembahasan",
    rangkuman: "📋 Rangkuman",
  },
  en: {
    intro: "🌟 What Is the Complement of an Event?",
    konsep1: "📘 Formula & Properties of the Complement",
    contoh1: "📝 Examples & Solutions",
    rangkuman: "📋 Summary",
  },
  ja: {
    intro: "🌟 余事象とは？",
    konsep1: "📘 余事象の公式と性質",
    contoh1: "📝 例題と解説",
    rangkuman: "📋 まとめ",
  },
} as const;

const introTrans = {
  id: {
    p1: <>Saat kamu melempar dadu, ada dua kemungkinan besar: muncul angka 6, atau <em>tidak</em> muncul angka 6. Nah, &quot;tidak muncul angka 6&quot; inilah yang disebut <strong className="text-cyan-300">komplemen</strong> dari kejadian &quot;muncul angka 6&quot;. Komplemen kejadian A adalah himpunan semua kejadian dalam ruang sampel yang <em>bukan</em> merupakan anggota A. Dilambangkan dengan <InlineMath math="A'" /> atau <InlineMath math="\bar{A}" />.</>,
    diagramLabel: "🌐 Diagram Ruang Sampel",
    kejadianA: "Kejadian A",
    komplemenLabel: "Komplemen",
    ruangSampelLabel: "S (Ruang Sampel)",
    diagramFooter: "A dan A' saling melengkapi — bersama-sama memenuhi seluruh ruang sampel S",
    cards: [
      { term: "Kejadian A", icon: "🎯", desc: "Kejadian yang kita definisikan, misalnya 'muncul bilangan genap' saat melempar dadu.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
      { term: "Komplemen A (A')", icon: "🔄", desc: "Semua kejadian dalam ruang sampel yang tidak termasuk dalam kejadian A.", color: "bg-red-900/40 border-red-500/40 text-red-300" },
      { term: "A ∪ A' = S", icon: "🌐", desc: "Gabungan A dan komplemen A selalu sama dengan ruang sampel S — tidak ada yang terlewat.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
      { term: "A ∩ A' = ∅", icon: "🚫", desc: "Irisan A dan komplemen A selalu kosong — tidak ada anggota yang sekaligus ada di A dan A'.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
    ],
    tipsTitle: "Tips:",
    tipsText: "Komplemen sering lebih mudah dihitung daripada kejadian aslinya! Jika menghitung P(A) langsung terasa rumit, coba hitung P(A') dulu, lalu gunakan rumus P(A) = 1 − P(A').",
  },
  en: {
    p1: <>When you roll a die, there are two main possibilities: a 6 comes up, or a 6 does <em>not</em> come up. That &quot;a 6 does not come up&quot; is exactly what we call the <strong className="text-cyan-300">complement</strong> of the event &quot;a 6 comes up&quot;. The complement of event A is the set of all outcomes in the sample space that are <em>not</em> members of A. It is denoted <InlineMath math="A'" /> or <InlineMath math="\bar{A}" />.</>,
    diagramLabel: "🌐 Sample Space Diagram",
    kejadianA: "Event A",
    komplemenLabel: "Complement",
    ruangSampelLabel: "S (Sample Space)",
    diagramFooter: "A and A' complement each other — together they cover the entire sample space S",
    cards: [
      { term: "Event A", icon: "🎯", desc: "The event we define, e.g. 'an even number appears' when rolling a die.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
      { term: "Complement of A (A')", icon: "🔄", desc: "All outcomes in the sample space that are not included in event A.", color: "bg-red-900/40 border-red-500/40 text-red-300" },
      { term: "A ∪ A' = S", icon: "🌐", desc: "The union of A and its complement always equals the sample space S — nothing is left out.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
      { term: "A ∩ A' = ∅", icon: "🚫", desc: "The intersection of A and its complement is always empty — no outcome belongs to both A and A' at once.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
    ],
    tipsTitle: "Tip:",
    tipsText: "The complement is often easier to calculate than the original event! If finding P(A) directly feels complicated, try finding P(A') first, then use the formula P(A) = 1 − P(A').",
  },
  ja: {
    p1: <>サイコロを投げるとき、大きく2つの可能性がある：6の目が出る、または6の目が<em>出ない</em>。この「6の目が出ない」ことこそが、「6の目が出る」という事象の<strong className="text-cyan-300">余事象</strong>と呼ばれる。事象Aの余事象とは、標本空間の中でAに<em>属さない</em>すべての事象の集合である。<InlineMath math="A'" />または<InlineMath math="\bar{A}" />と表す。</>,
    diagramLabel: "🌐 標本空間の図",
    kejadianA: "事象A",
    komplemenLabel: "余事象",
    ruangSampelLabel: "S（標本空間）",
    diagramFooter: "AとA'は互いを補い合い、合わせて標本空間Sの全体を満たす",
    cards: [
      { term: "事象A", icon: "🎯", desc: "私たちが定義する事象。例：サイコロを投げて「偶数の目が出る」。", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
      { term: "Aの余事象（A'）", icon: "🔄", desc: "標本空間の中で、事象Aに含まれないすべての事象。", color: "bg-red-900/40 border-red-500/40 text-red-300" },
      { term: "A ∪ A' = S", icon: "🌐", desc: "Aとその余事象の和集合は常に標本空間Sに等しい — 漏れがない。", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
      { term: "A ∩ A' = ∅", icon: "🚫", desc: "Aとその余事象の積集合は常に空集合 — AとA'の両方に属する要素はない。", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
    ],
    tipsTitle: "ヒント：",
    tipsText: "余事象は元の事象より計算が簡単な場合が多い！P(A)を直接求めるのが複雑に感じるなら、先にP(A')を求めて、公式P(A) = 1 − P(A')を使うとよい。",
  },
} as const;

const konsepTrans = {
  id: {
    ringkasanLabel: "🎯 Ringkasan Intisari",
    ringkasanText: "Jumlah peluang suatu kejadian dan komplemennya selalu sama dengan 1. Ini karena kejadian A dan komplemen A' bersama-sama mencakup seluruh ruang sampel S.",
    rumusLabel: "📐 Rumus Komplemen",
    rumusFooter: "Ketiga bentuk ini setara — gunakan yang paling sesuai dengan soal!",
    hubunganLabel: "🔗 Hubungan n(A) dan n(A')",
    hubunganFooter: "Ini berguna untuk menghitung banyak anggota komplemen tanpa perlu mendaftar satu per satu!",
    ilustrasi: "🎲 Ilustrasi: Dadu & Komplemen",
    thKejadianA: "Kejadian A",
    thKomplemenA: "Komplemen A'",
    tableRows: [
      ["Muncul bilangan genap {2,4,6}", "3/6 = 1/2", "Muncul bilangan ganjil {1,3,5}", "1/2"],
      ["Muncul bilangan prima {2,3,5}", "3/6 = 1/2", "Muncul bukan prima {1,4,6}", "1/2"],
      ["Muncul angka > 4 {5,6}", "2/6 = 1/3", "Muncul angka ≤ 4 {1,2,3,4}", "2/3"],
      ["Muncul angka 6 {6}", "1/6", "Muncul bukan 6 {1,2,3,4,5}", "5/6"],
    ],
    tableFooter: "Perhatikan: setiap baris, P(A) + P(A') = 1 ✓",
  },
  en: {
    ringkasanLabel: "🎯 Key Summary",
    ringkasanText: "The sum of the probability of an event and its complement always equals 1. This is because event A and its complement A' together cover the entire sample space S.",
    rumusLabel: "📐 Complement Formula",
    rumusFooter: "These three forms are equivalent — use whichever suits the problem best!",
    hubunganLabel: "🔗 Relationship Between n(A) and n(A')",
    hubunganFooter: "This is useful for counting the members of the complement without listing them one by one!",
    ilustrasi: "🎲 Illustration: A Die & Its Complement",
    thKejadianA: "Event A",
    thKomplemenA: "Complement A'",
    tableRows: [
      ["An even number appears {2,4,6}", "3/6 = 1/2", "An odd number appears {1,3,5}", "1/2"],
      ["A prime number appears {2,3,5}", "3/6 = 1/2", "A non-prime appears {1,4,6}", "1/2"],
      ["A number > 4 appears {5,6}", "2/6 = 1/3", "A number ≤ 4 appears {1,2,3,4}", "2/3"],
      ["The number 6 appears {6}", "1/6", "A number other than 6 appears {1,2,3,4,5}", "5/6"],
    ],
    tableFooter: "Notice: in every row, P(A) + P(A') = 1 ✓",
  },
  ja: {
    ringkasanLabel: "🎯 要点まとめ",
    ringkasanText: "ある事象の確率とその余事象の確率の合計は常に1になる。これは、事象Aとその余事象A'が合わせて標本空間S全体をカバーするからである。",
    rumusLabel: "📐 余事象の公式",
    rumusFooter: "この3つの形はすべて同じことを表す — 問題に合わせて使いやすいものを選ぼう！",
    hubunganLabel: "🔗 n(A)とn(A')の関係",
    hubunganFooter: "これは、余事象の要素を1つずつ数えなくても、その個数を求めるのに役立つ！",
    ilustrasi: "🎲 例：サイコロとその余事象",
    thKejadianA: "事象A",
    thKomplemenA: "余事象A'",
    tableRows: [
      ["偶数の目が出る {2,4,6}", "3/6 = 1/2", "奇数の目が出る {1,3,5}", "1/2"],
      ["素数の目が出る {2,3,5}", "3/6 = 1/2", "素数以外の目が出る {1,4,6}", "1/2"],
      ["4より大きい目が出る {5,6}", "2/6 = 1/3", "4以下の目が出る {1,2,3,4}", "2/3"],
      ["6の目が出る {6}", "1/6", "6以外の目が出る {1,2,3,4,5}", "5/6"],
    ],
    tableFooter: "注目：どの行も、P(A) + P(A') = 1 ✓",
  },
} as const;

const soalTrans = {
  id: {
    s1q: <>Peluang seorang siswa lulus ujian adalah <InlineMath math="\frac{3}{4}" />. Tentukan peluang siswa tersebut <strong>tidak lulus</strong> ujian!</>,
    s1diketahui: "Diketahui:",
    s1p: <>• <InlineMath math="P(\text{lulus}) = \frac{3}{4}" /></>,
    s1ditanya: <>• Ditanya: <InlineMath math="P(\text{tidak lulus}) = P(\text{lulus}')" /></>,
    s1gunakan: "Gunakan rumus komplemen:",
    s1kunci: <>🔑 Peluang siswa tidak lulus adalah <InlineMath math="\frac{1}{4}" />.</>,
    s2q: <>Dalam sebuah kotak terdapat 4 bola merah, 5 bola putih, dan 3 bola hitam. Sebuah bola diambil secara acak. Tentukan peluang terambil:<br />a. Bola bukan bola merah<br />b. Bola bukan bola hitam</>,
    s2diketahui: "Diketahui:",
    s2total: <>• <InlineMath math="n(S) = 4 + 5 + 3 = 12" /></>,
    s2jumlah: "• Merah: 4, Putih: 5, Hitam: 3",
    s2a: "a. P(bukan merah) = P(merah'):",
    s2aCara1: "Cara 1 (langsung): bukan merah = putih + hitam = 5 + 3 = 8",
    s2aCara2: "Cara 2 (komplemen): P(merah) = 4/12 = 1/3, lalu:",
    s2b: "b. P(bukan hitam) = P(hitam'):",
    s2kunci: "💡 Kedua cara (langsung dan komplemen) memberikan hasil yang sama. Pilih cara yang lebih mudah sesuai soal!",
    s3q: <>Dua buah dadu dilempar bersama-sama. Gunakan konsep komplemen untuk menentukan peluang bahwa jumlah kedua mata dadu <strong>bukan 12</strong>. Kemudian, jika dadu dilempar 360 kali, berapa kali diharapkan jumlah mata dadu bukan 12?</>,
    s3total: <>• Dua dadu: <InlineMath math="n(S) = 6 \times 6 = 36" /></>,
    s3step1: "Langkah 1 — Cari P(jumlah = 12):",
    s3step1sub: "Jumlah 12 hanya dari (6,6) → 1 pasangan",
    s3step2: "Langkah 2 — Gunakan komplemen:",
    s3step3: "Langkah 3 — Frekuensi harapan bukan 12 dalam 360 lemparan:",
    s3kunci: "⚠️ Strategi komplemen sangat efektif ketika kejadian yang ditanyakan lebih banyak anggotanya daripada komplemennya — menghitung komplemen dulu jauh lebih cepat!",
  },
  en: {
    s1q: <>The probability that a student passes an exam is <InlineMath math="\frac{3}{4}" />. Find the probability that the student <strong>does not pass</strong> the exam!</>,
    s1diketahui: "Given:",
    s1p: <>• <InlineMath math="P(\text{pass}) = \frac{3}{4}" /></>,
    s1ditanya: <>• Find: <InlineMath math="P(\text{not pass}) = P(\text{pass}')" /></>,
    s1gunakan: "Use the complement formula:",
    s1kunci: <>🔑 The probability that the student does not pass is <InlineMath math="\frac{1}{4}" />.</>,
    s2q: <>A box contains 4 red balls, 5 white balls, and 3 black balls. A ball is drawn at random. Find the probability of drawing:<br />a. A ball that is not red<br />b. A ball that is not black</>,
    s2diketahui: "Given:",
    s2total: <>• <InlineMath math="n(S) = 4 + 5 + 3 = 12" /></>,
    s2jumlah: "• Red: 4, White: 5, Black: 3",
    s2a: "a. P(not red) = P(red'):",
    s2aCara1: "Method 1 (direct): not red = white + black = 5 + 3 = 8",
    s2aCara2: "Method 2 (complement): P(red) = 4/12 = 1/3, then:",
    s2b: "b. P(not black) = P(black'):",
    s2kunci: "💡 Both methods (direct and complement) give the same result. Choose whichever is easier for the problem!",
    s3q: <>Two dice are rolled together. Use the complement concept to find the probability that the sum of the two dice is <strong>not 12</strong>. Then, if the dice are rolled 360 times, how many times is a sum other than 12 expected?</>,
    s3total: <>• Two dice: <InlineMath math="n(S) = 6 \times 6 = 36" /></>,
    s3step1: "Step 1 — Find P(sum = 12):",
    s3step1sub: "A sum of 12 only comes from (6,6) → 1 pair",
    s3step2: "Step 2 — Use the complement:",
    s3step3: "Step 3 — Expected frequency of a sum other than 12 in 360 rolls:",
    s3kunci: "⚠️ The complement strategy is very effective when the requested event has more members than its complement — calculating the complement first is much faster!",
  },
  ja: {
    s1q: <>ある生徒が試験に合格する確率は<InlineMath math="\frac{3}{4}" />である。その生徒が試験に<strong>合格しない</strong>確率を求めよ！</>,
    s1diketahui: "与えられた条件：",
    s1p: <>• <InlineMath math="P(\text{合格}) = \frac{3}{4}" /></>,
    s1ditanya: <>• 求める：<InlineMath math="P(\text{不合格}) = P(\text{合格}')" /></>,
    s1gunakan: "余事象の公式を使う：",
    s1kunci: <>🔑 その生徒が不合格になる確率は<InlineMath math="\frac{1}{4}" />である。</>,
    s2q: <>箱の中に赤玉4個、白玉5個、黒玉3個が入っている。玉を1個ランダムに取り出す。次の玉が出る確率を求めよ：<br />a. 赤玉ではない玉<br />b. 黒玉ではない玉</>,
    s2diketahui: "与えられた条件：",
    s2total: <>• <InlineMath math="n(S) = 4 + 5 + 3 = 12" /></>,
    s2jumlah: "• 赤：4個、白：5個、黒：3個",
    s2a: "a. P(赤ではない) = P(赤'):",
    s2aCara1: "方法1（直接）：赤ではない = 白 + 黒 = 5 + 3 = 8",
    s2aCara2: "方法2（余事象）：P(赤) = 4/12 = 1/3、よって：",
    s2b: "b. P(黒ではない) = P(黒'):",
    s2kunci: "💡 直接法と余事象を使う方法、どちらも同じ結果になる。問題に合わせて簡単な方を選ぼう！",
    s3q: <>2つのサイコロを同時に投げる。余事象の考え方を使って、2つのサイコロの目の合計が<strong>12ではない</strong>確率を求めよ。さらに、このサイコロ投げを360回行うとき、合計が12ではない回数は何回と期待されるか？</>,
    s3total: <>• 2つのサイコロ：<InlineMath math="n(S) = 6 \times 6 = 36" /></>,
    s3step1: "ステップ1 — P(合計 = 12)を求める：",
    s3step1sub: "合計が12になるのは(6,6)のみ → 1通り",
    s3step2: "ステップ2 — 余事象を使う：",
    s3step3: "ステップ3 — 360回中、合計が12ではない期待度数：",
    s3kunci: "⚠️ 求める事象が余事象より要素数が多い場合、余事象戦略は非常に効果的 — 先に余事象を計算する方がはるかに速い！",
  },
} as const;

const rangkumanPoinTrans = {
  id: [
    { poin: "Komplemen A (ditulis A') adalah semua kejadian dalam S yang bukan anggota A.", icon: "🔄" },
    { poin: "Rumus utama: P(A') = 1 − P(A), atau P(A) + P(A') = 1.", icon: "📐" },
    { poin: "n(A') = n(S) − n(A) — menghitung banyak anggota komplemen.", icon: "🔢" },
    { poin: "A ∪ A' = S dan A ∩ A' = ∅ — A dan A' saling lepas dan melengkapi.", icon: "🌐" },
    { poin: "Gunakan strategi komplemen saat kejadian yang diminta lebih mudah dihitung dari kebalikannya.", icon: "💡" },
  ],
  en: [
    { poin: "The complement of A (written A') is every outcome in S that is not a member of A.", icon: "🔄" },
    { poin: "Main formula: P(A') = 1 − P(A), or P(A) + P(A') = 1.", icon: "📐" },
    { poin: "n(A') = n(S) − n(A) — for counting the members of the complement.", icon: "🔢" },
    { poin: "A ∪ A' = S and A ∩ A' = ∅ — A and A' are mutually exclusive and complementary.", icon: "🌐" },
    { poin: "Use the complement strategy when the requested event is easier to compute from its opposite.", icon: "💡" },
  ],
  ja: [
    { poin: "Aの余事象（A'と表す）は、Sの中でAに属さないすべての事象である。", icon: "🔄" },
    { poin: "基本公式：P(A') = 1 − P(A)、または P(A) + P(A') = 1。", icon: "📐" },
    { poin: "n(A') = n(S) − n(A) — 余事象の要素数を求める式。", icon: "🔢" },
    { poin: "A ∪ A' = S、A ∩ A' = ∅ — AとA'は排反であり、互いを補い合う。", icon: "🌐" },
    { poin: "求める事象がその反対から計算する方が簡単な場合は、余事象戦略を使う。", icon: "💡" },
  ],
} as const;

const rangkumanSectionTrans = {
  id: {
    judul: "Rangkuman — Komplemen Kejadian",
    subjudul: "Jika bukan A, maka A' — dua sisi yang selalu melengkapi hingga sempurna!",
    ringkasan: [
      { emoji: "🔀", judul: "Apa Itu Komplemen?", isi: "Komplemen kejadian A (ditulis A' atau A-bar) adalah himpunan semua titik sampel dalam S yang BUKAN anggota A. A dan A' bersama-sama membentuk seluruh ruang sampel." },
      { emoji: "⚖️", judul: "Sifat Utama Komplemen", isi: "P(A) + P(A') = 1 selalu berlaku. Artinya: peluang A terjadi + peluang A tidak terjadi = 1 (pasti). Ini adalah hukum mutlak dalam peluang!" },
      { emoji: "🔢", judul: "Anggota Komplemen", isi: "n(A') = n(S) - n(A). Banyak anggota komplemen = total ruang sampel dikurangi banyak anggota kejadian A. Selalu cek: n(A) + n(A') = n(S)." },
      { emoji: "🛠️", judul: "Strategi Penggunaan", isi: "Jika menghitung P(A) langsung terasa rumit, coba hitung P(A') dulu lalu gunakan P(A) = 1 - P(A'). Sering kali jauh lebih mudah!" },
    ],
    rumus: [
      { label: "Sifat Komplemen (peluang)", rumus: "P(A) + P(A') = 1 \\quad \\Rightarrow \\quad P(A') = 1 - P(A)" },
      { label: "Sifat Komplemen (anggota)", rumus: "n(A') = n(S) - n(A)" },
    ],
    tips: [
      { emoji: "🚀", teks: "Trik komplemen: soal bertipe 'minimal satu...' atau 'paling sedikit satu...' selalu lebih mudah diselesaikan dengan komplemen. Hitung P(tidak satupun) lalu kurangi dari 1!" },
      { emoji: "✅", teks: "Cek wajib: P(A) + P(A') harus selalu = 1. Jika tidak, ada kesalahan dalam perhitungan. Gunakan ini sebagai verifikasi jawaban." },
      { emoji: "💡", teks: "Notasi: komplemen A bisa ditulis sebagai A', A-bar, atau Ac. Semua simbol tersebut bermakna sama: kejadian yang bukan A." },
      { emoji: "🎯", teks: "Jika P(A) = 0,3 maka P(A') = 0,7. Jika P(A) = 3/8 maka P(A') = 5/8. Selalu jumlahnya = 1. Ingat ini dan soal komplemen tidak akan pernah sulit!" },
    ],
    kesimpulan: "Komplemen adalah salah satu konsep paling elegan dalam matematika — setiap kejadian punya pasangan yang melengkapinya menjadi sempurna (total = 1). Dalam kehidupan nyata, komplemen digunakan di asuransi (P(klaim) = 1 - P(tidak klaim)), quality control, dan pemrograman logika AI!",
  },
  en: {
    judul: "Summary — Complement of an Event",
    subjudul: "If not A, then A' — two sides that always complement each other perfectly!",
    ringkasan: [
      { emoji: "🔀", judul: "What Is a Complement?", isi: "The complement of event A (written A' or A-bar) is the set of all sample points in S that are NOT members of A. A and A' together make up the entire sample space." },
      { emoji: "⚖️", judul: "The Main Property of a Complement", isi: "P(A) + P(A') = 1 always holds. This means: the probability A happens + the probability A doesn't happen = 1 (certain). This is an absolute law in probability!" },
      { emoji: "🔢", judul: "Members of the Complement", isi: "n(A') = n(S) - n(A). The number of members of the complement equals the total sample space minus the number of members of event A. Always check: n(A) + n(A') = n(S)." },
      { emoji: "🛠️", judul: "Strategy for Use", isi: "If finding P(A) directly feels complicated, try finding P(A') first, then use P(A) = 1 - P(A'). It's often much easier!" },
    ],
    rumus: [
      { label: "Complement Property (probability)", rumus: "P(A) + P(A') = 1 \\quad \\Rightarrow \\quad P(A') = 1 - P(A)" },
      { label: "Complement Property (count)", rumus: "n(A') = n(S) - n(A)" },
    ],
    tips: [
      { emoji: "🚀", teks: "Complement trick: problems like 'at least one...' are always easier to solve with the complement. Find P(none) then subtract from 1!" },
      { emoji: "✅", teks: "Mandatory check: P(A) + P(A') must always equal 1. If not, there's a calculation error. Use this to verify your answer." },
      { emoji: "💡", teks: "Notation: the complement of A can be written as A', A-bar, or Ac. All these symbols mean the same thing: the event that is not A." },
      { emoji: "🎯", teks: "If P(A) = 0.3, then P(A') = 0.7. If P(A) = 3/8, then P(A') = 5/8. The sum is always 1. Remember this and complement problems will never be hard again!" },
    ],
    kesimpulan: "The complement is one of the most elegant concepts in mathematics — every event has a partner that completes it perfectly (total = 1). In real life, the complement is used in insurance (P(claim) = 1 - P(no claim)), quality control, and AI logic programming!",
  },
  ja: {
    judul: "まとめ — 事象の余事象",
    subjudul: "Aでなければ、A' — 常に完璧に補い合う2つの側面！",
    ringkasan: [
      { emoji: "🔀", judul: "余事象とは？", isi: "事象Aの余事象（A'またはAバーと書く）は、SにおいてAに属さないすべての標本点の集合である。AとA'を合わせると標本空間全体になる。" },
      { emoji: "⚖️", judul: "余事象の主な性質", isi: "P(A) + P(A') = 1は常に成り立つ。つまり：Aが起こる確率 + Aが起こらない確率 = 1（確実）。これは確率における絶対的な法則である！" },
      { emoji: "🔢", judul: "余事象の要素数", isi: "n(A') = n(S) - n(A)。余事象の要素数 = 標本空間全体から事象Aの要素数を引いたもの。常に確認：n(A) + n(A') = n(S)。" },
      { emoji: "🛠️", judul: "活用の戦略", isi: "P(A)を直接求めるのが複雑に感じるなら、先にP(A')を求めてP(A) = 1 - P(A')を使うとよい。多くの場合、はるかに簡単になる！" },
    ],
    rumus: [
      { label: "余事象の性質（確率）", rumus: "P(A) + P(A') = 1 \\quad \\Rightarrow \\quad P(A') = 1 - P(A)" },
      { label: "余事象の性質（要素数）", rumus: "n(A') = n(S) - n(A)" },
    ],
    tips: [
      { emoji: "🚀", teks: "余事象のコツ：「少なくとも1つ…」というタイプの問題は、常に余事象を使う方が簡単。P(1つもない)を求めて1から引く！" },
      { emoji: "✅", teks: "必須の確認：P(A) + P(A')は常に1になるはず。そうでなければ計算に誤りがある。これを答えの検証に使おう。" },
      { emoji: "💡", teks: "記法：Aの余事象はA'、Aバー、またはAcと書かれる。これらの記号はすべて同じ意味 — Aではない事象を表す。" },
      { emoji: "🎯", teks: "P(A) = 0.3ならP(A') = 0.7。P(A) = 3/8ならP(A') = 5/8。合計は常に1。これを覚えれば余事象の問題は決して難しくない！" },
    ],
    kesimpulan: "余事象は数学の中でも最も美しい概念の一つ — すべての事象には、それを完璧に補うパートナー（合計=1）が存在する。実生活では、保険（P(請求) = 1 - P(請求なし)）、品質管理、AIの論理プログラミングなどで余事象が使われている！",
  },
} as const;

const KomplementPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const pt = pageTrans[language];
  const st = sectionTitles[language];
  const it = introTrans[language];
  const kt = konsepTrans[language];
  const sq = soalTrans[language];
  const rt = rangkumanPoinTrans[language];
  const rst = rangkumanSectionTrans[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "contoh1", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {true
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {pt.h1}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {pt.h2}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {pt.ctx}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={st.intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {it.p1}
                </p>

                {/* Diagram Visual Komplemen */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide text-center">{it.diagramLabel}</p>
                  <div className="relative flex items-center justify-center">
                    <div className="w-64 h-32 rounded-xl border-2 border-purple-400/60 bg-purple-900/20 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute left-3 top-3 right-3 bottom-3 rounded-lg border-2 border-cyan-400/60 bg-cyan-900/30 flex items-center justify-center w-24 h-24">
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-cyan-300">A</p>
                          <p className="font-body text-xs text-cyan-200/70">{it.kejadianA}</p>
                        </div>
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <div className="text-center">
                          <p className="font-display text-lg font-bold text-red-300">A'</p>
                          <p className="font-body text-xs text-red-200/70">{it.komplemenLabel}</p>
                        </div>
                      </div>
                      <div className="absolute top-1 left-1/2 -translate-x-1/2">
                        <p className="font-body text-xs text-purple-300 font-bold">{it.ruangSampelLabel}</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-center text-white/60">{it.diagramFooter}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {it.cards.map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{it.tipsTitle}</strong> {it.tipsText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KONSEP & RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Shuffle className="w-5 h-5" />} iconColor="text-purple-400" title={st.konsep1} />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{kt.ringkasanLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {kt.ringkasanText}
                  </p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide">{kt.rumusLabel}</p>
                  <div className="space-y-2">
                    <div className="bg-purple-900/20 rounded-lg p-3">
                      <BlockMath math="P(A) + P(A') = 1" />
                    </div>
                    <div className="bg-cyan-900/20 rounded-lg p-3">
                      <BlockMath math="P(A') = 1 - P(A)" />
                    </div>
                    <div className="bg-green-900/20 rounded-lg p-3">
                      <BlockMath math="P(A) = 1 - P(A')" />
                    </div>
                  </div>
                  <p className="font-body text-xs text-white/60 text-center">{kt.rumusFooter}</p>
                </div>

                {/* Hubungan n(A) dan n(A') */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">{kt.hubunganLabel}</p>
                  <BlockMath math="n(A) + n(A') = n(S)" />
                  <BlockMath math="n(A') = n(S) - n(A)" />
                  <p className="font-body text-xs text-white/60 text-center">{kt.hubunganFooter}</p>
                </div>

                {/* Contoh Visual: Dadu */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{kt.ilustrasi}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-purple-900/50">
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-left">{kt.thKejadianA}</th>
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-center"><InlineMath math="P(A)" /></th>
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-left">{kt.thKomplemenA}</th>
                          <th className="border border-purple-500/30 px-3 py-2 text-purple-200 text-center"><InlineMath math="P(A')" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {kt.tableRows.map(([a, pa, ak, pak], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-cyan-200">{a}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">{pa}</td>
                            <td className="border border-white/10 px-3 py-2 text-red-200">{ak}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-orange-300">{pak}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-center text-white/50">{kt.tableFooter}</p>
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={st.contoh1} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={levelLabel("MUDAH", language)} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{pt.soal} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {sq.s1q}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{pt.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">{sq.s1diketahui}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80">
                      <p>{sq.s1p}</p>
                      <p>{sq.s1ditanya}</p>
                    </div>
                    <p className="font-body text-sm text-white/80">{sq.s1gunakan}</p>
                    <BlockMath math={`P(${language === "id" ? "\\text{tidak lulus}" : language === "en" ? "\\text{not pass}" : "\\text{不合格}"}) = 1 - P(${language === "id" ? "\\text{lulus}" : language === "en" ? "\\text{pass}" : "\\text{合格}"}) = 1 - \\frac{3}{4} = \\frac{1}{4}`} />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">{sq.s1kunci}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={levelLabel("SEDANG", language)} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{pt.soal} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {sq.s2q}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{pt.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">{sq.s2diketahui}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>{sq.s2total}</p>
                      <p>{sq.s2jumlah}</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s2a}</p>
                      <p className="font-body text-xs text-white/60 mb-1">{sq.s2aCara1}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{bukan merah}" : language === "en" ? "\\text{not red}" : "\\text{赤ではない}"}) = \\frac{8}{12} = \\frac{2}{3}`} />
                      <p className="font-body text-xs text-white/60 mb-1">{sq.s2aCara2}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{bukan merah}" : language === "en" ? "\\text{not red}" : "\\text{赤ではない}"}) = 1 - \\frac{1}{3} = \\frac{2}{3} \\checkmark`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s2b}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{hitam}" : language === "en" ? "\\text{black}" : "\\text{黒}"}) = \\frac{3}{12} = \\frac{1}{4}`} />
                      <BlockMath math={`P(${language === "id" ? "\\text{bukan hitam}" : language === "en" ? "\\text{not black}" : "\\text{黒ではない}"}) = 1 - \\frac{1}{4} = \\frac{3}{4}`} />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">{sq.s2kunci}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — SULIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={levelLabel("SULIT", language)} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{pt.soal} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {sq.s3q}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{pt.pembahasan}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>{sq.s3total}</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s3step1}</p>
                      <p className="font-body text-xs text-white/60 mb-1">{sq.s3step1sub}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{jumlah} = 12" : language === "en" ? "\\text{sum} = 12" : "\\text{和} = 12"}) = \\frac{1}{36}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s3step2}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{bukan 12}" : language === "en" ? "\\text{not 12}" : "\\text{12以外}"}) = 1 - P(${language === "id" ? "\\text{jumlah} = 12" : language === "en" ? "\\text{sum} = 12" : "\\text{和} = 12"}) = 1 - \\frac{1}{36} = \\frac{35}{36}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s3step3}</p>
                      <BlockMath math={`F_h(${language === "id" ? "\\text{bukan 12}" : language === "en" ? "\\text{not 12}" : "\\text{12以外}"}) = \\frac{35}{36} \\times 360 = 35 \\times 10 = 350 ${kali[language]}`} />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">{sq.s3kunci}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={st.rangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {rt.map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="P(A') = 1 - P(A) \quad \Leftrightarrow \quad P(A) + P(A') = 1" />
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-purple-900"
            gradientVia="via-violet-900"
            gradientTo="to-fuchsia-900"
            borderColor="border-purple-500/40"
            accentColor="text-purple-300"
            headerIcon="🔄"
            judul={rst.judul}
            subjudul={rst.subjudul}
            ringkasan={rst.ringkasan.map((r, i) => ({
              ...r,
              bg: ["bg-purple-900/50", "bg-violet-900/50", "bg-fuchsia-900/50", "bg-pink-900/50"][i],
              border: ["border-purple-500/40", "border-violet-500/40", "border-fuchsia-500/40", "border-pink-500/40"][i],
              textColor: ["text-purple-200", "text-violet-200", "text-fuchsia-200", "text-pink-200"][i],
            }))}
            rumus={rst.rumus.map((r, i) => ({
              ...r,
              bg: ["bg-purple-900/60", "bg-violet-900/60"][i],
              border: ["border-purple-400/40", "border-violet-400/40"][i],
              labelColor: ["text-purple-300", "text-violet-300"][i],
            }))}
            tips={rst.tips}
            kesimpulan={rst.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-purple-900/80 to-violet-900/80"
            kesimpulanBorder="border-purple-400/50"
            kesimpulanTextColor="text-purple-100"
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/peluang"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              {pt.back}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KomplementPage;
