import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, TrendingUp } from "lucide-react";
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
    h1: "FREKUENSI HARAPAN",
    h2: "Prediksi Berapa Kali Suatu Kejadian Akan Terjadi",
    ctx: "Kelas 9 · Peluang · Materi Matematika",
    back: "← Kembali ke Menu Peluang",
    soal: "Soal",
    pembahasan: "✅ Pembahasan",
    imgAlt: "Melempar dadu – ilustrasi frekuensi harapan",
  },
  en: {
    h1: "EXPECTED FREQUENCY",
    h2: "Predicting How Many Times an Event Will Occur",
    ctx: "Grade 9 · Probability · Math Material",
    back: "← Back to Probability Menu",
    soal: "Problem",
    pembahasan: "✅ Solution",
    imgAlt: "Rolling a die – expected frequency illustration",
  },
  ja: {
    h1: "期待度数",
    h2: "ある事象が何回起こるかを予測する",
    ctx: "中学3年・確率・数学教材",
    back: "← 確率メニューに戻る",
    soal: "問題",
    pembahasan: "✅ 解説",
    imgAlt: "サイコロを投げる — 期待度数のイラスト",
  },
} as const;

const sectionTitles = {
  id: {
    intro: "🌟 Apa Itu Frekuensi Harapan?",
    konsep1: "📘 Rumus & Konsep Frekuensi Harapan",
    contoh1: "📝 Contoh Soal & Pembahasan",
    rangkuman: "📋 Rangkuman",
  },
  en: {
    intro: "🌟 What Is Expected Frequency?",
    konsep1: "📘 Formula & Concept of Expected Frequency",
    contoh1: "📝 Examples & Solutions",
    rangkuman: "📋 Summary",
  },
  ja: {
    intro: "🌟 期待度数とは？",
    konsep1: "📘 期待度数の公式と概念",
    contoh1: "📝 例題と解説",
    rangkuman: "📋 まとめ",
  },
} as const;

const introTrans = {
  id: {
    p1: <>&quot;Kalau dadu dilempar 120 kali, kira-kira berapa kali muncul angka 6?&quot; Pertanyaan seperti ini dijawab oleh konsep <strong className="text-cyan-300">Frekuensi Harapan</strong>. Ini adalah prediksi matematis tentang <em>berapa kali sebuah kejadian diperkirakan muncul</em> dalam sejumlah percobaan. Jadi frekuensi harapan adalah jembatan antara peluang (yang nilainya 0–1) dengan kenyataan di dunia nyata (berapa kali terjadi).</>,
    cards: [
      { term: "Frekuensi Harapan (Fh)", icon: "🎯", desc: "Perkiraan berapa kali suatu kejadian akan terjadi jika percobaan dilakukan sebanyak n kali.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
      { term: "Banyak Percobaan (n)", icon: "🔢", desc: "Total berapa kali percobaan akan dilakukan. Semakin besar n, perkiraan semakin dapat diandalkan.", color: "bg-green-900/40 border-green-500/40 text-green-300" },
      { term: "Peluang P(A)", icon: "📊", desc: "Peluang kejadian A yang sudah diketahui — bisa dari peluang empirik atau peluang teoretik.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
      { term: "Harapan ≠ Kepastian", icon: "⚠️", desc: "Frekuensi harapan adalah perkiraan, bukan kepastian. Hasil nyata bisa berbeda dari nilai yang dihitung.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
    ],
    kegunaanTitle: "Kegunaan Nyata:",
    kegunaanText: "Frekuensi harapan dipakai dalam berbagai bidang — mulai dari perkiraan penjualan produk, prediksi cuaca, hingga menghitung risiko dalam asuransi!",
  },
  en: {
    p1: <>&quot;If a die is rolled 120 times, roughly how many times will a 6 come up?&quot; Questions like this are answered by the concept of <strong className="text-cyan-300">Expected Frequency</strong>. It is a mathematical prediction of <em>how many times an event is expected to occur</em> over a number of trials. Expected frequency is the bridge between probability (a value between 0–1) and reality (how many times something actually happens).</>,
    cards: [
      { term: "Expected Frequency (Fh)", icon: "🎯", desc: "An estimate of how many times an event will occur if a trial is repeated n times.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
      { term: "Number of Trials (n)", icon: "🔢", desc: "The total number of times the trial will be carried out. The larger n is, the more reliable the estimate.", color: "bg-green-900/40 border-green-500/40 text-green-300" },
      { term: "Probability P(A)", icon: "📊", desc: "The already-known probability of event A — it can come from empirical or theoretical probability.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
      { term: "Expected ≠ Certain", icon: "⚠️", desc: "Expected frequency is an estimate, not a certainty. Actual results can differ from the calculated value.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
    ],
    kegunaanTitle: "Real-World Use:",
    kegunaanText: "Expected frequency is used in many fields — from estimating product sales and predicting weather, to calculating risk in insurance!",
  },
  ja: {
    p1: <>「サイコロを120回投げたら、6の目はおよそ何回出るか？」このような問いに答えるのが<strong className="text-cyan-300">期待度数</strong>という考え方です。これは、<em>ある試行を何回か行ったとき、ある事象が何回起こると予想されるか</em>を数学的に予測するものです。つまり期待度数は、確率（0〜1の値）と現実（実際に何回起こるか）をつなぐ橋渡しです。</>,
    cards: [
      { term: "期待度数（Fh）", icon: "🎯", desc: "ある試行をn回行ったとき、ある事象が起こると予想される回数。", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
      { term: "試行回数（n）", icon: "🔢", desc: "試行を行う回数の合計。nが大きいほど、予測の信頼性が高くなる。", color: "bg-green-900/40 border-green-500/40 text-green-300" },
      { term: "確率 P(A)", icon: "📊", desc: "すでにわかっている事象Aの確率 — 経験的確率または理論的確率から求められる。", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
      { term: "期待 ≠ 確実", icon: "⚠️", desc: "期待度数はあくまで予測であり、確実な結果ではない。実際の結果は計算値と異なることがある。", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
    ],
    kegunaanTitle: "実際の活用例：",
    kegunaanText: "期待度数はさまざまな分野で使われる — 商品の売上予測、天気予報、保険のリスク計算など！",
  },
} as const;

const konsepTrans = {
  id: {
    ringkasanLabel: "🎯 Ringkasan Intisari",
    ringkasanText: <>Frekuensi harapan dihitung dengan mengalikan peluang suatu kejadian dengan banyaknya percobaan yang akan dilakukan. Hasilnya adalah <em>perkiraan</em> berapa kali kejadian tersebut akan muncul.</>,
    rumusLabel: "📐 Rumus Frekuensi Harapan",
    fhLabel: "Frekuensi harapan",
    paLabel: "Peluang kejadian A",
    nLabel: "Banyak percobaan",
    ilustrasi: "🎲 Ilustrasi: Dadu Dilempar 60 Kali",
    thMataDadu: "Mata Dadu",
    mata: "Mata",
    penjelasanIlustrasi: "Artinya, diharapkan setiap angka muncul sekitar 10 kali dari 60 lemparan.",
    perhatikan: "💡 Perhatikan:",
    perhatikanText: <>Total frekuensi harapan untuk semua kejadian yang saling lepas harus sama dengan <InlineMath math="n" />. Pada contoh di atas:</>,
  },
  en: {
    ringkasanLabel: "🎯 Key Summary",
    ringkasanText: <>Expected frequency is calculated by multiplying the probability of an event by the number of trials to be carried out. The result is an <em>estimate</em> of how many times that event will occur.</>,
    rumusLabel: "📐 Expected Frequency Formula",
    fhLabel: "Expected frequency",
    paLabel: "Probability of event A",
    nLabel: "Number of trials",
    ilustrasi: "🎲 Illustration: A Die Rolled 60 Times",
    thMataDadu: "Die Face",
    mata: "Face",
    penjelasanIlustrasi: "This means each number is expected to come up about 10 times out of 60 rolls.",
    perhatikan: "💡 Note:",
    perhatikanText: <>The total expected frequency for all mutually exclusive events must equal <InlineMath math="n" />. In the example above:</>,
  },
  ja: {
    ringkasanLabel: "🎯 要点まとめ",
    ringkasanText: <>期待度数は、ある事象の確率に行う試行の回数を掛けて求める。結果は、その事象が何回起こるかの<em>予測値</em>である。</>,
    rumusLabel: "📐 期待度数の公式",
    fhLabel: "期待度数",
    paLabel: "事象Aの確率",
    nLabel: "試行回数",
    ilustrasi: "🎲 例：サイコロを60回投げる",
    thMataDadu: "サイコロの目",
    mata: "目",
    penjelasanIlustrasi: "つまり、60回の中でそれぞれの目がおよそ10回出ると予想される。",
    perhatikan: "💡 注意：",
    perhatikanText: <>互いに排反なすべての事象の期待度数の合計は<InlineMath math="n" />に等しくなければならない。上の例では：</>,
  },
} as const;

const soalTrans = {
  id: {
    s1q: <>Sebuah koin dilempar sebanyak <InlineMath math="80" /> kali. Berapa kali diharapkan muncul sisi Angka?</>,
    s1step1: "Langkah 1 — Tentukan peluang teoretik muncul Angka:",
    s1step2: "Langkah 2 — Hitung frekuensi harapan:",
    s1kunci: <>🔑 Diharapkan sisi Angka muncul sebanyak <strong>40 kali</strong> dari 80 lemparan.</>,
    s2q: <>Sebuah dadu dilempar sebanyak <InlineMath math="150" /> kali. Hitunglah frekuensi harapan untuk kejadian:<br />a. Muncul bilangan prima<br />b. Muncul bilangan kurang dari 4</>,
    s2diketahui: <>Diketahui: <InlineMath math="n = 150" />, <InlineMath math="n(S) = 6" /></>,
    s2a: <>a. Bilangan prima = {"{2, 3, 5}"} → <InlineMath math="n(A) = 3" /></>,
    s2b: <>b. Bilangan kurang dari 4 = {"{1, 2, 3}"} → <InlineMath math="n(B) = 3" /></>,
    s2kunci: "💡 Kedua kejadian memiliki peluang yang sama (½), maka frekuensi harapannya juga sama!",
    s3q: <>Dalam sebuah kotak terdapat 5 bola merah, 3 bola biru, dan 2 bola kuning. Sebuah bola diambil secara acak, lalu dikembalikan. Percobaan dilakukan sebanyak <InlineMath math="300" /> kali. Hitunglah frekuensi harapan terambilnya:<br />a. Bola merah<br />b. Bola biru<br />c. Bola yang bukan bola kuning</>,
    s3total: <>• Total bola: <InlineMath math="n(S) = 5 + 3 + 2 = 10" /></>,
    s3jumlah: "• Bola merah: 5, Bola biru: 3, Bola kuning: 2",
    s3n: <>• Banyak percobaan: <InlineMath math="n = 300" /></>,
    s3a: "a. Bola merah:",
    s3b: "b. Bola biru:",
    s3c: "c. Bola bukan kuning = merah + biru = 5 + 3 = 8 bola:",
    s3kunci: "⚠️ Perhatikan: \"bukan kuning\" berarti merah atau biru. Selalu identifikasi dengan jelas anggota kejadian yang diminta sebelum menghitung!",
  },
  en: {
    s1q: <>A coin is tossed <InlineMath math="80" /> times. How many times is Heads expected to appear?</>,
    s1step1: "Step 1 — Determine the theoretical probability of getting Heads:",
    s1step2: "Step 2 — Calculate the expected frequency:",
    s1kunci: <>🔑 Heads is expected to appear <strong>40 times</strong> out of 80 tosses.</>,
    s2q: <>A die is rolled <InlineMath math="150" /> times. Calculate the expected frequency for the events:<br />a. A prime number appears<br />b. A number less than 4 appears</>,
    s2diketahui: <>Given: <InlineMath math="n = 150" />, <InlineMath math="n(S) = 6" /></>,
    s2a: <>a. Prime numbers = {"{2, 3, 5}"} → <InlineMath math="n(A) = 3" /></>,
    s2b: <>b. Numbers less than 4 = {"{1, 2, 3}"} → <InlineMath math="n(B) = 3" /></>,
    s2kunci: "💡 Both events have the same probability (½), so their expected frequencies are also the same!",
    s3q: <>A box contains 5 red balls, 3 blue balls, and 2 yellow balls. A ball is drawn at random, then put back. The trial is repeated <InlineMath math="300" /> times. Calculate the expected frequency of drawing:<br />a. A red ball<br />b. A blue ball<br />c. A ball that is not yellow</>,
    s3total: <>• Total balls: <InlineMath math="n(S) = 5 + 3 + 2 = 10" /></>,
    s3jumlah: "• Red balls: 5, Blue balls: 3, Yellow balls: 2",
    s3n: <>• Number of trials: <InlineMath math="n = 300" /></>,
    s3a: "a. Red ball:",
    s3b: "b. Blue ball:",
    s3c: "c. Not-yellow ball = red + blue = 5 + 3 = 8 balls:",
    s3kunci: "⚠️ Note: \"not yellow\" means red or blue. Always clearly identify the members of the requested event before calculating!",
  },
  ja: {
    s1q: <>コインを<InlineMath math="80" />回投げる。表が出ると期待される回数は何回か？</>,
    s1step1: "ステップ1 — 表が出る理論的確率を求める：",
    s1step2: "ステップ2 — 期待度数を求める：",
    s1kunci: <>🔑 80回のうち、表は<strong>40回</strong>出ると期待される。</>,
    s2q: <>サイコロを<InlineMath math="150" />回投げる。次の事象の期待度数を求めよ：<br />a. 素数の目が出る<br />b. 4未満の目が出る</>,
    s2diketahui: <>与えられた条件：<InlineMath math="n = 150" />、<InlineMath math="n(S) = 6" /></>,
    s2a: <>a. 素数 = {"{2, 3, 5}"} → <InlineMath math="n(A) = 3" /></>,
    s2b: <>b. 4未満の数 = {"{1, 2, 3}"} → <InlineMath math="n(B) = 3" /></>,
    s2kunci: "💡 両方の事象の確率は同じ（½）なので、期待度数も同じになる！",
    s3q: <>箱の中に赤玉5個、青玉3個、黄玉2個が入っている。玉を1個ランダムに取り出し、元に戻す。この試行を<InlineMath math="300" />回行う。次の玉が出る期待度数を求めよ：<br />a. 赤玉<br />b. 青玉<br />c. 黄玉ではない玉</>,
    s3total: <>• 玉の総数：<InlineMath math="n(S) = 5 + 3 + 2 = 10" /></>,
    s3jumlah: "• 赤玉：5個、青玉：3個、黄玉：2個",
    s3n: <>• 試行回数：<InlineMath math="n = 300" /></>,
    s3a: "a. 赤玉：",
    s3b: "b. 青玉：",
    s3c: "c. 黄玉ではない玉 = 赤 + 青 = 5 + 3 = 8個：",
    s3kunci: "⚠️ 注意：「黄玉ではない」とは赤玉または青玉を意味する。計算前に、求める事象の要素を必ずはっきり確認すること！",
  },
} as const;

const rangkumanPoinTrans = {
  id: [
    { poin: "Frekuensi harapan adalah perkiraan berapa kali suatu kejadian akan terjadi dalam n percobaan.", icon: "🎯" },
    { poin: "Rumus: Fh = P(A) × n, dengan P(A) adalah peluang kejadian dan n adalah total percobaan.", icon: "📐" },
    { poin: "Frekuensi harapan adalah prediksi, bukan jaminan — hasil nyata bisa berbeda.", icon: "⚠️" },
    { poin: "Semakin besar n, hasil nyata cenderung mendekati frekuensi harapan yang dihitung.", icon: "📈" },
    { poin: "Total frekuensi harapan semua kejadian dalam satu percobaan selalu = n.", icon: "✅" },
  ],
  en: [
    { poin: "Expected frequency is an estimate of how many times an event will occur in n trials.", icon: "🎯" },
    { poin: "Formula: Fh = P(A) × n, where P(A) is the event's probability and n is the total number of trials.", icon: "📐" },
    { poin: "Expected frequency is a prediction, not a guarantee — actual results can differ.", icon: "⚠️" },
    { poin: "The larger n is, the closer the actual result tends to be to the calculated expected frequency.", icon: "📈" },
    { poin: "The total expected frequency of all events in one trial always equals n.", icon: "✅" },
  ],
  ja: [
    { poin: "期待度数とは、n回の試行の中である事象が起こると予想される回数のこと。", icon: "🎯" },
    { poin: "公式：Fh = P(A) × n。P(A)は事象の確率、nは試行回数の合計。", icon: "📐" },
    { poin: "期待度数は予測であり、保証ではない — 実際の結果は異なることがある。", icon: "⚠️" },
    { poin: "nが大きいほど、実際の結果は計算された期待度数に近づく傾向がある。", icon: "📈" },
    { poin: "1回の試行におけるすべての事象の期待度数の合計は常にnに等しい。", icon: "✅" },
  ],
} as const;

const rangkumanSectionTrans = {
  id: {
    judul: "Rangkuman — Frekuensi Harapan",
    subjudul: "Berapa kali suatu kejadian diharapkan muncul? Peluang bertemu jumlah percobaan!",
    ringkasan: [
      { emoji: "🎯", judul: "Apa Itu Frekuensi Harapan?", isi: "Frekuensi harapan (Fh) adalah perkiraan berapa kali suatu kejadian A diharapkan muncul jika percobaan dilakukan sebanyak n kali. Ini adalah nilai ekspektasi, bukan hasil pasti." },
      { emoji: "🔢", judul: "Rumus & Komponen", isi: "Fh = P(A) x n. Tiga komponen: P(A) = peluang kejadian A, n = jumlah percobaan, Fh = hasil yang diharapkan. Fh bisa berupa bilangan desimal!" },
      { emoji: "📈", judul: "Sifat Frekuensi Harapan", isi: "Fh adalah perkiraan teoritis, bukan jaminan. Semakin besar n, hasil percobaan nyata semakin mendekati Fh. Jumlah semua Fh dalam satu percobaan = n." },
      { emoji: "🌍", judul: "Aplikasi Nyata", isi: "Digunakan di industri: prediksi kerusakan mesin (1000 produk, P(cacat)=0.02, Fh=20 produk cacat). Di kesehatan: prediksi efek samping obat dari 500 pasien." },
    ],
    rumus: [
      { label: "Frekuensi Harapan", rumus: "F_h = P(A) \\times n" },
      { label: "Jumlah semua Fh = n", rumus: "\\sum F_h = P(A_1)n + P(A_2)n + \\cdots = n" },
    ],
    tips: [
      { emoji: "💡", teks: "Fh bisa berupa bilangan desimal dan itu wajar! Misal: dari 50 lemparan dadu, Fh(angka 1) = 1/6 x 50 = 8,33. Ini bukan berarti 8,33 kali secara fisik." },
      { emoji: "✅", teks: "Cara cek: jumlahkan semua Fh untuk seluruh kemungkinan — hasilnya harus sama dengan n. Ini bisa jadi alat verifikasi jawaban yang mudah." },
      { emoji: "🎯", teks: "Perbedaan Fh dan hasil nyata disebut deviasi. Makin kecil deviasi, makin akurat prediksi. Fh adalah titik tengah distribusi hasil percobaan." },
      { emoji: "📊", teks: "Frekuensi harapan digunakan di industri asuransi (expected claims), kontrol kualitas pabrik, dan riset medis untuk merencanakan jumlah sampel." },
    ],
    kesimpulan: "Frekuensi harapan adalah jembatan antara peluang dan kenyataan. Satu rumus sederhana Fh = P(A) x n memungkinkan kita merencanakan segala sesuatu — dari produksi pabrik, stok obat di rumah sakit, hingga strategi bisnis. Matematika bukan sekadar angka, tapi alat merencanakan masa depan!",
  },
  en: {
    judul: "Summary — Expected Frequency",
    subjudul: "How many times is an event expected to occur? Probability meets number of trials!",
    ringkasan: [
      { emoji: "🎯", judul: "What Is Expected Frequency?", isi: "Expected frequency (Fh) is an estimate of how many times an event A is expected to occur if a trial is repeated n times. It is an expectation value, not a guaranteed result." },
      { emoji: "🔢", judul: "Formula & Components", isi: "Fh = P(A) x n. Three components: P(A) = probability of event A, n = number of trials, Fh = the expected result. Fh can be a decimal number!" },
      { emoji: "📈", judul: "Properties of Expected Frequency", isi: "Fh is a theoretical estimate, not a guarantee. The larger n is, the closer the actual trial result gets to Fh. The sum of all Fh in one trial = n." },
      { emoji: "🌍", judul: "Real-World Applications", isi: "Used in industry: predicting machine defects (1000 products, P(defect)=0.02, Fh=20 defective products). In healthcare: predicting drug side effects among 500 patients." },
    ],
    rumus: [
      { label: "Expected Frequency", rumus: "F_h = P(A) \\times n" },
      { label: "Sum of all Fh = n", rumus: "\\sum F_h = P(A_1)n + P(A_2)n + \\cdots = n" },
    ],
    tips: [
      { emoji: "💡", teks: "Fh can be a decimal number and that's perfectly normal! For example, from 50 die rolls, Fh(number 1) = 1/6 x 50 = 8.33. This doesn't mean 8.33 physical occurrences." },
      { emoji: "✅", teks: "Check your work: add up all the Fh values for every possible outcome — the result must equal n. This is an easy way to verify your answer." },
      { emoji: "🎯", teks: "The difference between Fh and the actual result is called deviation. The smaller the deviation, the more accurate the prediction. Fh is the center of the trial's result distribution." },
      { emoji: "📊", teks: "Expected frequency is used in the insurance industry (expected claims), factory quality control, and medical research to plan sample sizes." },
    ],
    kesimpulan: "Expected frequency is the bridge between probability and reality. One simple formula, Fh = P(A) x n, lets us plan everything — from factory production and hospital medicine stock to business strategy. Math isn't just numbers; it's a tool for planning the future!",
  },
  ja: {
    judul: "まとめ — 期待度数",
    subjudul: "ある事象は何回起こると予想されるか？確率と試行回数が出会う場所！",
    ringkasan: [
      { emoji: "🎯", judul: "期待度数とは？", isi: "期待度数（Fh）とは、試行をn回行ったとき、事象Aが起こると期待される回数のこと。これは期待値であり、確定した結果ではない。" },
      { emoji: "🔢", judul: "公式と要素", isi: "Fh = P(A) × n。3つの要素：P(A) = 事象Aの確率、n = 試行回数、Fh = 期待される結果。Fhは小数になることもある！" },
      { emoji: "📈", judul: "期待度数の性質", isi: "Fhは理論的な予測であり、保証ではない。nが大きいほど、実際の試行結果はFhに近づく。1回の試行におけるすべてのFhの合計 = n。" },
      { emoji: "🌍", judul: "実際の応用", isi: "産業界での活用：機械の不良品予測（製品1000個、P(不良)=0.02、Fh=不良品20個）。医療分野：500人の患者における薬の副作用予測。" },
    ],
    rumus: [
      { label: "期待度数", rumus: "F_h = P(A) \\times n" },
      { label: "すべてのFhの合計 = n", rumus: "\\sum F_h = P(A_1)n + P(A_2)n + \\cdots = n" },
    ],
    tips: [
      { emoji: "💡", teks: "Fhは小数になることがあり、それは正常なこと！例：サイコロを50回投げたとき、Fh（1の目）= 1/6 × 50 = 8.33。これは実際に8.33回起こるという意味ではない。" },
      { emoji: "✅", teks: "確認方法：すべての可能な結果のFhを合計すると、必ずnに等しくなる。これは答えを検証する簡単な方法になる。" },
      { emoji: "🎯", teks: "Fhと実際の結果との差を「偏差」と呼ぶ。偏差が小さいほど、予測は正確になる。Fhは試行結果の分布の中心である。" },
      { emoji: "📊", teks: "期待度数は保険業界（予想される請求件数）、工場の品質管理、医学研究のサンプルサイズ計画などで使われる。" },
    ],
    kesimpulan: "期待度数は、確率と現実をつなぐ橋である。Fh = P(A) × nというシンプルな公式一つで、工場の生産計画、病院の薬の在庫、ビジネス戦略まで、あらゆることを計画できる。数学はただの数字ではなく、未来を計画するための道具なのだ！",
  },
} as const;

const FrekuensiHarapanPage = () => {
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
        <p className="text-white/50 text-xs text-center mb-4 font-body">
          {pt.ctx}
        </p>

        <div className="flex justify-center mb-6">
          <img src={"/images/Gemini_Generated_Image_vtcobhvtcobhvtco_1776224453788.png"} alt={pt.imgAlt} className="w-56 rounded-xl shadow-lg shadow-cyan-900/30 border border-cyan-500/20" />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={st.intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {it.p1}
                </p>

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
                    <strong>{it.kegunaanTitle}</strong> {it.kegunaanText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KONSEP & RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-orange-400" title={st.konsep1} />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{kt.ringkasanLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {kt.ringkasanText}
                  </p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide">{kt.rumusLabel}</p>
                  <BlockMath math="F_h = P(A) \times n" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-orange-900/30 border border-orange-500/20 rounded-lg p-2 text-center">
                      <p className="text-orange-300 font-bold"><InlineMath math="F_h" /></p>
                      <p className="text-white/60 mt-1">{kt.fhLabel}</p>
                    </div>
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold"><InlineMath math="P(A)" /></p>
                      <p className="text-white/60 mt-1">{kt.paLabel}</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="n" /></p>
                      <p className="text-white/60 mt-1">{kt.nLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Ilustrasi Visual */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{kt.ilustrasi}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-orange-900/50">
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">{kt.thMataDadu}</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-center"><InlineMath math="P(A)" /></th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-center"><InlineMath math="n" /></th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-center"><InlineMath math="F_h" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5, 6].map((mata, i) => (
                          <tr key={mata} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white font-bold">{kt.mata} {mata}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">1/6</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">60</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-orange-300">10</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/40 border border-orange-500/20 rounded-lg p-3">
                    <BlockMath math={`F_h = \\frac{1}{6} \\times 60 = 10 ${kali[language]}`} />
                    <p className="font-body text-xs text-orange-200 text-center mt-1">{kt.penjelasanIlustrasi}</p>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-yellow-500/20 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    {kt.perhatikan} {kt.perhatikanText} <InlineMath math="6 \times 10 = 60 = n" /> ✓
                  </p>
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
                    <p className="font-body text-sm text-white/80">{sq.s1step1}</p>
                    <BlockMath math={`P(${language === "id" ? "\\text{Angka}" : language === "en" ? "\\text{Heads}" : "\\text{表}"}) = \\frac{1}{2}`} />
                    <p className="font-body text-sm text-white/80">{sq.s1step2}</p>
                    <BlockMath math={`F_h = P(${language === "id" ? "\\text{Angka}" : language === "en" ? "\\text{Heads}" : "\\text{表}"}) \\times n = \\frac{1}{2} \\times 80 = 40 ${kali[language]}`} />
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
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s2a}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{prima}" : language === "en" ? "\\text{prime}" : "\\text{素数}"}) = \\frac{3}{6} = \\frac{1}{2}`} />
                      <BlockMath math={`F_h = \\frac{1}{2} \\times 150 = 75 ${kali[language]}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s2b}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{kurang dari 4}" : language === "en" ? "\\text{less than 4}" : "\\text{4未満}"}) = \\frac{3}{6} = \\frac{1}{2}`} />
                      <BlockMath math={`F_h = \\frac{1}{2} \\times 150 = 75 ${kali[language]}`} />
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
                      <p>{sq.s3jumlah}</p>
                      <p>{sq.s3n}</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s3a}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{merah}" : language === "en" ? "\\text{red}" : "\\text{赤}"}) = \\frac{5}{10} = \\frac{1}{2}`} />
                      <BlockMath math={`F_h(${language === "id" ? "\\text{merah}" : language === "en" ? "\\text{red}" : "\\text{赤}"}) = \\frac{1}{2} \\times 300 = 150 ${kali[language]}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s3b}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{biru}" : language === "en" ? "\\text{blue}" : "\\text{青}"}) = \\frac{3}{10}`} />
                      <BlockMath math={`F_h(${language === "id" ? "\\text{biru}" : language === "en" ? "\\text{blue}" : "\\text{青}"}) = \\frac{3}{10} \\times 300 = 90 ${kali[language]}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{sq.s3c}</p>
                      <BlockMath math={`P(${language === "id" ? "\\text{bukan kuning}" : language === "en" ? "\\text{not yellow}" : "\\text{黄色以外}"}) = \\frac{8}{10} = \\frac{4}{5}`} />
                      <BlockMath math={`F_h(${language === "id" ? "\\text{bukan kuning}" : language === "en" ? "\\text{not yellow}" : "\\text{黄色以外}"}) = \\frac{4}{5} \\times 300 = 240 ${kali[language]}`} />
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
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="F_h = P(A) \times n" />
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-orange-900"
            gradientVia="via-amber-900"
            gradientTo="to-yellow-900"
            borderColor="border-orange-500/40"
            accentColor="text-orange-300"
            headerIcon="📊"
            judul={rst.judul}
            subjudul={rst.subjudul}
            ringkasan={rst.ringkasan.map((r, i) => ({
              ...r,
              bg: ["bg-orange-900/50", "bg-amber-900/50", "bg-yellow-900/50", "bg-red-900/50"][i],
              border: ["border-orange-500/40", "border-amber-500/40", "border-yellow-700/40", "border-red-500/40"][i],
              textColor: ["text-orange-200", "text-amber-200", "text-yellow-200", "text-red-200"][i],
            }))}
            rumus={rst.rumus.map((r, i) => ({
              ...r,
              bg: ["bg-orange-900/60", "bg-amber-900/60"][i],
              border: ["border-orange-400/40", "border-amber-400/40"][i],
              labelColor: ["text-orange-300", "text-amber-300"][i],
            }))}
            tips={rst.tips}
            kesimpulan={rst.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-orange-900/80 to-amber-900/80"
            kesimpulanBorder="border-orange-400/50"
            kesimpulanTextColor="text-orange-100"
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

export default FrekuensiHarapanPage;
