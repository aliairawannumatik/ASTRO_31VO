import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import LabPercobaanEmpirik from "@/components/LabPercobaanEmpirik";
import { useLanguage } from "@/contexts/LanguageContext";

const PeluangEmpirikPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "contoh1", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  /* ── translations ── */
  const t = {
    id: {
      title: "PELUANG EMPIRIK & FREKUENSI RELATIF",
      subtitle: "Peluang Berbasis Data Nyata dari Percobaan",
      breadcrumb: "Kelas 9 · Peluang · Materi Matematika",
      imgAlt: "Melempar koin – ilustrasi peluang empirik",
      sec1Title: "🌟 Apa Itu Peluang Empirik?",
      sec2Title: "📘 Rumus & Konsep Peluang Empirik",
      sec3Title: "📝 Contoh Soal & Pembahasan",
      sec4Title: "📋 Rangkuman",
      tip: "Tips",
      tipText: "Peluang empirik disebut juga peluang <em>relatif</em> atau peluang <em>statistik</em> karena berasal dari data statistik percobaan, bukan dari perhitungan teori murni.",
      // intro cards
      c1Term: "Peluang Empirik", c1Desc: "Peluang yang dihitung berdasarkan data hasil percobaan yang sudah dilakukan secara nyata.",
      c2Term: "Frekuensi Relatif", c2Desc: "Perbandingan antara frekuensi munculnya suatu kejadian dengan banyaknya seluruh percobaan.",
      c3Term: "Frekuensi (f)", c3Desc: "Banyaknya suatu kejadian muncul dalam percobaan yang dilakukan berulang kali.",
      c4Term: "Banyak Percobaan (n)", c4Desc: "Total berapa kali percobaan dilakukan. Semakin besar n, semakin akurat nilai peluang empiriknya.",
      introBody: "Pernah iseng melempar koin 100 kali dan mencatat hasilnya? Dari percobaan nyata itulah lahir konsep",
      introBody2: "Berbeda dengan peluang yang dihitung dari teori, peluang empirik berangkat dari",
      introBody3: "data hasil percobaan sungguhan",
      introBody4: "Semakin banyak percobaan yang dilakukan, semakin dekat nilai peluang empirik mendekati nilai sebenarnya!",
      // konsep
      intisariLabel: "🎯 Ringkasan Intisari",
      intisariText: "Peluang empirik suatu kejadian A adalah hasil bagi antara frekuensi kemunculan kejadian tersebut dengan total percobaan yang dilakukan. Nilai peluang selalu berada di antara 0 dan 1.",
      formulaLabel: "📐 Rumus Peluang Empirik",
      fPA: "Peluang kejadian A", ffA: "Frekuensi kejadian A muncul", fn: "Total banyak percobaan",
      propertiesTitle: "📌 Sifat-Sifat Peluang",
      prop1: "Nilai peluang selalu di antara 0 dan 1",
      prop2: "Kejadian mustahil (tidak mungkin terjadi)",
      prop3: "Kejadian pasti (selalu terjadi)",
      tableTitle: "🪙 Ilustrasi: Pelemparan Koin 40 Kali",
      tHead1: "Hasil", tHead2: "Frekuensi", tHead3: "Peluang Empirik",
      tR1c1: "🪙 Angka (A)", tR2c1: "🪙 Gambar (G)", tTotal: "Total",
      tR1c3: "23/40 = 0,575", tR2c3: "17/40 = 0,425", tTotalc3: "1,000",
      tableTip: "💡 Secara teori, peluang muncul Angka = 0,5. Dari percobaan ini diperoleh 0,575 — <strong>semakin banyak percobaan, nilainya akan makin mendekati 0,5</strong>.",
      labTitle: "🧪 Coba Sendiri — Laboratorium Peluang Empirik",
      labDesc: "Lempar koin atau dadu berkali-kali dan lihat bagaimana peluang empirik secara bertahap mendekati nilai teoritisnya. Inilah inti dari",
      // contoh soal badges
      bMudah: "MUDAH", bSedang: "SEDANG", bSulit: "SULIT",
      soal: "Soal", pembahasan: "✅ Pembahasan", diketahui: "Diketahui:",
      // soal 1
      s1q: "Sebuah dadu dilempar sebanyak 50 kali. Mata dadu 4 muncul sebanyak 8 kali. Tentukan peluang empirik muncul mata dadu 4!",
      s1d1: "Total percobaan:", s1d2: "Frekuensi muncul mata 4:",
      s1guide: "Gunakan rumus peluang empirik:",
      s1key: "🔑 Peluang empirik muncul mata dadu 4 adalah",
      s1keyOr: "atau",
      // soal 2
      s2q: "Dari 200 kali pelemparan koin, diperoleh hasil Angka sebanyak 94 kali dan Gambar sebanyak 106 kali. Hitunglah:\na. Peluang empirik muncul Angka\nb. Peluang empirik muncul Gambar\nc. Apakah jumlah keduanya sama dengan 1?",
      s2given: "Diketahui:",
      s2a: "a. Peluang empirik Angka:", s2b: "b. Peluang empirik Gambar:", s2c: "c. Jumlah keduanya:",
      s2tip: "💡 Jumlah seluruh peluang kejadian yang mungkin dalam satu percobaan selalu sama dengan 1. Ini berlaku untuk peluang empirik maupun teoretik!",
      // soal 3
      s3q: "Sebuah pabrik memproduksi 1.200 lampu. Setelah diuji kualitas, diperoleh data sebagai berikut: 36 lampu cacat, sisanya tidak cacat.\na. Tentukan peluang empirik terambilnya lampu cacat jika diambil satu secara acak.\nb. Tentukan peluang empirik terambilnya lampu tidak cacat.\nc. Jika pabrik memproduksi 5.000 lampu lagi, berapa lampu yang diperkirakan cacat?",
      s3d1: "Total lampu:", s3d2: "Lampu cacat:", s3d3: "Lampu tidak cacat:",
      s3a: "a. Peluang empirik lampu cacat:", s3b: "b. Peluang empirik lampu tidak cacat:",
      s3c: "c. Perkiraan lampu cacat dari 5.000 lampu:", s3cnote: "Gunakan peluang empirik sebagai dasar estimasi:",
      s3tip: "⚠️ Peluang empirik bisa digunakan untuk memperkirakan (memprediksi) kejadian di masa depan — itulah kegunaannya dalam dunia nyata seperti industri, kesehatan, dan bisnis!",
      // rangkuman
      rp1: "Peluang empirik dihitung dari data percobaan nyata, bukan dari teori.",
      rp2: "Rumus: P(A) = f/n, dengan f = frekuensi kejadian dan n = total percobaan.",
      rp3: "Nilai peluang selalu antara 0 dan 1: 0 ≤ P(A) ≤ 1.",
      rp4: "Semakin banyak percobaan dilakukan, nilai peluang empirik makin mendekati nilai peluang teoretik.",
      rp5: "Peluang empirik dapat digunakan untuk memprediksi kejadian di masa depan.",
      backBtn: "← Kembali ke Menu Peluang",
    },
    en: {
      title: "EMPIRICAL PROBABILITY & RELATIVE FREQUENCY",
      subtitle: "Probability Based on Real Experimental Data",
      breadcrumb: "Grade 9 · Probability · Mathematics",
      imgAlt: "Coin toss – empirical probability illustration",
      sec1Title: "🌟 What Is Empirical Probability?",
      sec2Title: "📘 Formula & Concept of Empirical Probability",
      sec3Title: "📝 Worked Examples",
      sec4Title: "📋 Summary",
      tip: "Tip",
      tipText: "Empirical probability is also called <em>relative</em> or <em>statistical</em> probability because it comes from statistical experimental data, not pure theoretical calculation.",
      c1Term: "Empirical Probability", c1Desc: "Probability calculated based on the results of actual experiments conducted.",
      c2Term: "Relative Frequency", c2Desc: "The ratio of the frequency of an event occurring to the total number of trials.",
      c3Term: "Frequency (f)", c3Desc: "The number of times an event occurs in repeated trials.",
      c4Term: "Number of Trials (n)", c4Desc: "The total number of times the experiment is conducted. The larger n, the more accurate the empirical probability.",
      introBody: "Have you ever tossed a coin 100 times and recorded the results? That real experiment is where the concept of",
      introBody2: "comes from. Unlike probability calculated from theory, empirical probability starts from",
      introBody3: "actual experimental result data",
      introBody4: "The more trials conducted, the closer the empirical probability approaches the true value!",
      intisariLabel: "🎯 Key Summary",
      intisariText: "The empirical probability of an event A is the quotient of the frequency of that event's occurrence and the total number of trials. Probability values always lie between 0 and 1.",
      formulaLabel: "📐 Empirical Probability Formula",
      fPA: "Probability of event A", ffA: "Frequency of event A occurring", fn: "Total number of trials",
      propertiesTitle: "📌 Properties of Probability",
      prop1: "Probability value always between 0 and 1",
      prop2: "Impossible event (cannot occur)",
      prop3: "Certain event (always occurs)",
      tableTitle: "🪙 Illustration: 40 Coin Tosses",
      tHead1: "Outcome", tHead2: "Frequency", tHead3: "Empirical Probability",
      tR1c1: "🪙 Heads (H)", tR2c1: "🪙 Tails (T)", tTotal: "Total",
      tR1c3: "23/40 = 0.575", tR2c3: "17/40 = 0.425", tTotalc3: "1.000",
      tableTip: "💡 Theoretically, the probability of Heads = 0.5. This experiment gave 0.575 — <strong>the more trials, the closer the value approaches 0.5</strong>.",
      labTitle: "🧪 Try It Yourself — Empirical Probability Lab",
      labDesc: "Toss a coin or roll a die many times and see how empirical probability gradually approaches its theoretical value. This is the essence of the",
      bMudah: "EASY", bSedang: "MEDIUM", bSulit: "HARD",
      soal: "Problem", pembahasan: "✅ Solution", diketahui: "Given:",
      s1q: "A die is rolled 50 times. Face 4 appears 8 times. Find the empirical probability of rolling face 4!",
      s1d1: "Total trials:", s1d2: "Frequency of face 4:",
      s1guide: "Use the empirical probability formula:",
      s1key: "🔑 The empirical probability of rolling face 4 is",
      s1keyOr: "or",
      s2q: "A coin is tossed 200 times. Heads appears 94 times and Tails 106 times. Calculate:\na. Empirical probability of Heads\nb. Empirical probability of Tails\nc. Does their sum equal 1?",
      s2given: "Given:",
      s2a: "a. Empirical probability of Heads:", s2b: "b. Empirical probability of Tails:", s2c: "c. Their sum:",
      s2tip: "💡 The sum of all possible outcome probabilities in a single experiment always equals 1. This applies to both empirical and theoretical probability!",
      s3q: "A factory produces 1,200 light bulbs. After quality testing, 36 bulbs are defective and the rest are good.\na. Find the empirical probability of drawing a defective bulb at random.\nb. Find the empirical probability of drawing a good bulb.\nc. If the factory produces another 5,000 bulbs, how many are expected to be defective?",
      s3d1: "Total bulbs:", s3d2: "Defective bulbs:", s3d3: "Good bulbs:",
      s3a: "a. Empirical probability of a defective bulb:", s3b: "b. Empirical probability of a good bulb:",
      s3c: "c. Expected defective bulbs out of 5,000:", s3cnote: "Use empirical probability as the basis for estimation:",
      s3tip: "⚠️ Empirical probability can be used to estimate (predict) future events — that is its utility in the real world such as industry, healthcare, and business!",
      rp1: "Empirical probability is calculated from real experimental data, not theory.",
      rp2: "Formula: P(A) = f/n, where f = frequency of the event and n = total trials.",
      rp3: "Probability values always lie between 0 and 1: 0 ≤ P(A) ≤ 1.",
      rp4: "The more trials conducted, the closer empirical probability gets to the theoretical value.",
      rp5: "Empirical probability can be used to predict future events.",
      backBtn: "← Back to Probability Menu",
    },
    ja: {
      title: "経験的確率と相対頻度",
      subtitle: "実験データに基づく確率",
      breadcrumb: "9年生 · 確率 · 数学",
      imgAlt: "コイン投げ – 経験的確率のイラスト",
      sec1Title: "🌟 経験的確率とは？",
      sec2Title: "📘 経験的確率の公式と概念",
      sec3Title: "📝 例題と解説",
      sec4Title: "📋 まとめ",
      tip: "ヒント",
      tipText: "経験的確率は、純粋な理論計算ではなく実験の統計データから得られるため、<em>相対</em>確率または<em>統計的</em>確率とも呼ばれます。",
      c1Term: "経験的確率", c1Desc: "実際の実験結果に基づいて計算される確率。",
      c2Term: "相対頻度", c2Desc: "ある事象が起こる頻度と全試行回数の比。",
      c3Term: "頻度 (f)", c3Desc: "繰り返し実験でその事象が起こる回数。",
      c4Term: "試行回数 (n)", c4Desc: "実験を行う合計回数。nが大きいほど、経験的確率はより正確になります。",
      introBody: "コインを100回投げて結果を記録したことはありますか？その実験から生まれた概念が",
      introBody2: "です。理論から計算する確率とは異なり、経験的確率は",
      introBody3: "実際の実験結果データ",
      introBody4: "から始まります。試行回数が多いほど、経験的確率は真の値に近づきます！",
      intisariLabel: "🎯 重要まとめ",
      intisariText: "事象Aの経験的確率は、その事象の出現頻度と総試行回数の商です。確率の値は常に0と1の間にあります。",
      formulaLabel: "📐 経験的確率の公式",
      fPA: "事象Aの確率", ffA: "事象Aの出現頻度", fn: "総試行回数",
      propertiesTitle: "📌 確率の性質",
      prop1: "確率の値は常に0と1の間",
      prop2: "不可能事象（絶対に起こらない）",
      prop3: "確実事象（必ず起こる）",
      tableTitle: "🪙 イラスト：コイン投げ40回",
      tHead1: "結果", tHead2: "頻度", tHead3: "経験的確率",
      tR1c1: "🪙 表 (H)", tR2c1: "🪙 裏 (T)", tTotal: "合計",
      tR1c3: "23/40 = 0.575", tR2c3: "17/40 = 0.425", tTotalc3: "1.000",
      tableTip: "💡 理論的には、表が出る確率 = 0.5です。この実験では0.575が得られました — <strong>試行回数が多いほど、0.5に近づきます</strong>。",
      labTitle: "🧪 自分で試そう — 経験的確率ラボ",
      labDesc: "コインを投げたりサイコロを振ったりして、経験的確率が理論値に徐々に近づく様子を見てみましょう。これが",
      bMudah: "やさしい", bSedang: "ふつう", bSulit: "むずかしい",
      soal: "問題", pembahasan: "✅ 解説", diketahui: "既知：",
      s1q: "サイコロを50回振ります。4の目が8回出ます。4の目が出る経験的確率を求めなさい。",
      s1d1: "総試行回数：", s1d2: "4の目の頻度：",
      s1guide: "経験的確率の公式を使います：",
      s1key: "🔑 4の目が出る経験的確率は",
      s1keyOr: "または",
      s2q: "コインを200回投げた結果、表が94回、裏が106回出ました。求めなさい：\na. 表が出る経験的確率\nb. 裏が出る経験的確率\nc. 両者の和は1に等しいか？",
      s2given: "既知：",
      s2a: "a. 表の経験的確率：", s2b: "b. 裏の経験的確率：", s2c: "c. 両者の和：",
      s2tip: "💡 一つの実験における全事象の確率の和は常に1です。これは経験的確率にも理論的確率にも適用されます！",
      s3q: "ある工場が電球を1,200個生産しました。品質検査後、36個が不良品で残りは良品でした。\na. 1個をランダムに取り出したとき、不良品を取り出す経験的確率を求めなさい。\nb. 良品を取り出す経験的確率を求めなさい。\nc. この工場がさらに5,000個生産する場合、不良品は何個と予測されますか？",
      s3d1: "電球合計：", s3d2: "不良品：", s3d3: "良品：",
      s3a: "a. 不良品の経験的確率：", s3b: "b. 良品の経験的確率：",
      s3c: "c. 5,000個中の不良品予測数：", s3cnote: "経験的確率を推定の基礎として使用します：",
      s3tip: "⚠️ 経験的確率は将来の事象を推定（予測）するために使用できます — これが産業、医療、ビジネスなどの現実世界での有用性です！",
      rp1: "経験的確率は理論ではなく、実際の実験データから計算されます。",
      rp2: "公式：P(A) = f/n、ここでf = 事象の頻度、n = 総試行回数。",
      rp3: "確率の値は常に0と1の間：0 ≤ P(A) ≤ 1。",
      rp4: "試行回数が増えるほど、経験的確率は理論的確率に近づきます。",
      rp5: "経験的確率は将来の事象を予測するために使用できます。",
      backBtn: "← 確率メニューへ戻る",
    },
  }[language];

  /* ── language-dependent KaTeX strings ── */
  const dc     = language === "id" ? "{,}" : ".";       // decimal separator
  const th_sep = language === "id" ? "." : "{,}";       // thousands separator

  const pMata4  = language === "id" ? "P(\\text{mata 4})"    : language === "en" ? "P(\\text{face 4})"  : "P(\\text{4の目})";
  const fCacat  = language === "id" ? "f_{\\text{cacat}}"    : language === "en" ? "f_{\\text{def}}"    : "f_{\\text{不良}}";
  const fBaik   = language === "id" ? "f_{\\text{baik}}"     : language === "en" ? "f_{\\text{good}}"   : "f_{\\text{良}}";
  const pCacat  = language === "id" ? "P(\\text{cacat})"     : language === "en" ? "P(\\text{def})"     : "P(\\text{不良})";
  const pBaik   = language === "id" ? "P(\\text{baik})"      : language === "en" ? "P(\\text{good})"   : "P(\\text{良})";
  const n1200   = language === "id" ? "1.200"  : "1{,}200";
  const n5000   = language === "id" ? "5.000"  : "5{,}000";
  const n1164   = language === "id" ? "1.164"  : "1{,}164";
  const lampu   = language === "id" ? "\\,\\mathrm{lampu}" : language === "en" ? "\\,\\mathrm{bulbs}" : "\\,\\mathrm{個}";

  /* formula Soal 1 */
  const formulaS1 = `${pMata4} = \\frac{8}{50} = \\frac{4}{25} = 0${dc}16`;

  /* formula Soal 3 data bullets (InlineMath) */
  const fCacatEq = `${fCacat} = 36`;
  const fBaikEq  = `${fBaik} = ${n1200} - 36 = ${n1164}`;
  const formulaS3a = `${pCacat} = \\frac{36}{${n1200}} = \\frac{3}{100} = 0${dc}03`;
  const formulaS3b = `${pBaik}  = \\frac{${n1164}}{${n1200}} = \\frac{97}{100} = 0${dc}97`;
  const formulaS3c = `${pCacat} \\times ${n5000} = 0${dc}03 \\times ${n5000} = 150${lampu}`;

  /* ── helpers ── */
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

  /* ── definition cards ── */
  const defCards = [
    { term: t.c1Term, icon: "🔬", desc: t.c1Desc, color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
    { term: t.c2Term, icon: "📊", desc: t.c2Desc, color: "bg-green-900/40 border-green-500/40 text-green-300" },
    { term: t.c3Term, icon: "🔢", desc: t.c3Desc, color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
    { term: t.c4Term, icon: "🧮", desc: t.c4Desc, color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
  ];

  /* ── RangkumanSection props ── */
  const rangkumanData = language === "id" ? {
    judul: "Rangkuman — Peluang Empirik",
    subjudul: "Peluang berdasarkan hasil percobaan nyata — semakin banyak percobaan, semakin akurat!",
    ringkasan: [
      { emoji: "🔬", judul: "Apa Itu Peluang Empirik?", isi: "Peluang yang dihitung berdasarkan hasil percobaan/observasi nyata, bukan teori. Nilainya diperoleh dari frekuensi relatif kemunculan suatu kejadian.", bg: "bg-green-900/50", border: "border-green-500/40", textColor: "text-green-200" },
      { emoji: "📊", judul: "Frekuensi Relatif", isi: "P(A) = fA/n, di mana fA = frekuensi kemunculan kejadian A, dan n = total percobaan. Nilai selalu 0 hingga 1 (bisa dinyatakan dalam desimal atau persen).", bg: "bg-emerald-900/50", border: "border-emerald-500/40", textColor: "text-emerald-200" },
      { emoji: "📈", judul: "Hukum Bilangan Besar", isi: "Semakin banyak percobaan dilakukan, nilai peluang empirik akan semakin mendekati peluang teoretik. Inilah mengapa survei dengan sampel besar lebih akurat.", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
      { emoji: "🌍", judul: "Kapan Digunakan?", isi: "Digunakan ketika percobaan tidak bisa diasumsikan seimbang sempurna, atau ketika kondisi tidak diketahui secara pasti (dadu tidak seimbang, kondisi cuaca, dll).", bg: "bg-lime-900/50", border: "border-lime-700/40", textColor: "text-lime-200" },
    ],
    tips: [
      { emoji: "⚗️", teks: "Semakin besar n (banyak percobaan), semakin stabil dan akurat nilai peluang empirik. Jangan ambil kesimpulan dari percobaan yang terlalu sedikit!" },
      { emoji: "🎯", teks: "Peluang empirik bisa berbeda antar kelompok yang melakukan percobaan yang sama karena faktor keacakan. Ini normal — gunakan rata-rata beberapa percobaan." },
      { emoji: "📉", teks: "P(A) = 0 berarti kejadian A tidak pernah muncul dalam percobaan. P(A) = 1 berarti selalu muncul. Nilai di luar 0-1 berarti ada kesalahan hitung!" },
      { emoji: "💡", teks: "Peluang empirik digunakan di asuransi (menghitung risiko klaim), meteorologi (prakiraan hujan), dan quality control di pabrik." },
    ],
    kesimpulan: "Peluang empirik mengajarkan bahwa matematika bisa langsung diuji dengan dunia nyata. Setiap percobaan adalah satu langkah menuju kebenaran statistik. Inilah cara ilmuwan, dokter, dan insinyur membuat keputusan berbasis data — bukan sekadar teori!",
  } : language === "en" ? {
    judul: "Summary — Empirical Probability",
    subjudul: "Probability based on real experimental results — more trials = more accurate!",
    ringkasan: [
      { emoji: "🔬", judul: "What Is Empirical Probability?", isi: "Probability calculated from real experimental/observational results, not theory. Its value comes from the relative frequency of an event's occurrence.", bg: "bg-green-900/50", border: "border-green-500/40", textColor: "text-green-200" },
      { emoji: "📊", judul: "Relative Frequency", isi: "P(A) = fA/n, where fA = frequency of event A occurring, and n = total trials. Value always 0 to 1 (can be expressed as decimal or percentage).", bg: "bg-emerald-900/50", border: "border-emerald-500/40", textColor: "text-emerald-200" },
      { emoji: "📈", judul: "Law of Large Numbers", isi: "The more trials conducted, the closer empirical probability gets to the theoretical probability. This is why surveys with large samples are more accurate.", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
      { emoji: "🌍", judul: "When Is It Used?", isi: "Used when trials cannot be assumed perfectly balanced, or when conditions are not precisely known (biased dice, weather conditions, etc).", bg: "bg-lime-900/50", border: "border-lime-700/40", textColor: "text-lime-200" },
    ],
    tips: [
      { emoji: "⚗️", teks: "The larger n (number of trials), the more stable and accurate the empirical probability. Don't draw conclusions from too few trials!" },
      { emoji: "🎯", teks: "Empirical probability can differ between groups doing the same experiment due to randomness. This is normal — use the average of several experiments." },
      { emoji: "📉", teks: "P(A) = 0 means event A never appeared in the experiment. P(A) = 1 means it always appeared. Values outside 0–1 mean a calculation error!" },
      { emoji: "💡", teks: "Empirical probability is used in insurance (calculating claim risk), meteorology (rain forecasting), and quality control in factories." },
    ],
    kesimpulan: "Empirical probability teaches us that mathematics can be tested directly against the real world. Each trial is one step toward statistical truth. This is how scientists, doctors, and engineers make data-driven decisions — not just theory!",
  } : {
    judul: "まとめ — 経験的確率",
    subjudul: "実際の実験結果に基づく確率 — 試行回数が多いほど正確！",
    ringkasan: [
      { emoji: "🔬", judul: "経験的確率とは？", isi: "理論ではなく、実際の実験・観察結果から計算される確率。その値は事象の相対頻度から得られます。", bg: "bg-green-900/50", border: "border-green-500/40", textColor: "text-green-200" },
      { emoji: "📊", judul: "相対頻度", isi: "P(A) = fA/n、ここでfA = 事象Aが起こる頻度、n = 総試行回数。値は常に0から1（小数またはパーセントで表現可）。", bg: "bg-emerald-900/50", border: "border-emerald-500/40", textColor: "text-emerald-200" },
      { emoji: "📈", judul: "大数の法則", isi: "試行回数が増えるほど、経験的確率は理論的確率に近づきます。大きなサンプルの調査がより正確なのはこのためです。", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
      { emoji: "🌍", judul: "いつ使うか？", isi: "完全に均等とは仮定できない実験や、条件が正確に分からない場合（偏ったサイコロ、天候条件など）に使用します。", bg: "bg-lime-900/50", border: "border-lime-700/40", textColor: "text-lime-200" },
    ],
    tips: [
      { emoji: "⚗️", teks: "nが大きい（試行回数が多い）ほど、経験的確率はより安定・正確になります。少なすぎる試行から結論を出さないでください！" },
      { emoji: "🎯", teks: "経験的確率は、ランダム性のために同じ実験を行うグループ間で異なる場合があります。これは正常です — 複数の実験の平均を使用してください。" },
      { emoji: "📉", teks: "P(A) = 0は事象Aが実験で一度も現れなかったことを意味します。P(A) = 1は常に現れたことを意味します。0〜1以外の値は計算ミスを意味します！" },
      { emoji: "💡", teks: "経験的確率は保険（請求リスクの計算）、気象学（降雨予測）、工場での品質管理に使用されます。" },
    ],
    kesimpulan: "経験的確率は、数学が現実世界で直接テストできることを教えてくれます。各試行は統計的真実への一歩です。これが科学者、医師、エンジニアが理論だけでなく、データに基づいた意思決定を行う方法です！",
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.subtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-4 font-body">
          {t.breadcrumb}
        </p>

        <div className="flex justify-center mb-6">
          <img src={"/images/image_1776224212212.png"} alt={t.imgAlt} className="w-40 rounded-xl shadow-lg shadow-cyan-900/30 border border-cyan-500/20" />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec1Title} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? (
                    <>
                      Pernah iseng melempar koin 100 kali dan mencatat hasilnya? Dari percobaan nyata itulah lahir konsep{" "}
                      <strong className="text-cyan-300">Peluang Empirik</strong>. Berbeda dengan peluang yang dihitung dari teori,
                      peluang empirik berangkat dari <em>data hasil percobaan sungguhan</em>.
                      Semakin banyak percobaan yang dilakukan, semakin dekat nilai peluang empirik mendekati nilai sebenarnya!
                    </>
                  ) : language === "en" ? (
                    <>
                      Have you ever tossed a coin 100 times and recorded the results? That real experiment is where the concept of{" "}
                      <strong className="text-cyan-300">Empirical Probability</strong> comes from. Unlike probability calculated
                      from theory, empirical probability starts from <em>actual experimental result data</em>.
                      The more trials conducted, the closer the empirical probability approaches the true value!
                    </>
                  ) : (
                    <>
                      コインを100回投げて結果を記録したことはありますか？その実験から生まれた概念が{" "}
                      <strong className="text-cyan-300">経験的確率</strong>です。理論から計算する確率とは異なり、
                      経験的確率は<em>実際の実験結果データ</em>から始まります。
                      試行回数が多いほど、経験的確率は真の値に近づきます！
                    </>
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {defCards.map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip}:</strong>{" "}
                    <span dangerouslySetInnerHTML={{ __html: t.tipText }} />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KONSEP ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title={t.sec2Title} />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.intisariLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.intisariText}</p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">{t.formulaLabel}</p>
                  <BlockMath math="P(A) = \frac{f_A}{n}" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold"><InlineMath math="P(A)" /></p>
                      <p className="text-white/60 mt-1">{t.fPA}</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="f_A" /></p>
                      <p className="text-white/60 mt-1">{t.ffA}</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2 text-center">
                      <p className="text-violet-300 font-bold"><InlineMath math="n" /></p>
                      <p className="text-white/60 mt-1">{t.fn}</p>
                    </div>
                  </div>
                </div>

                {/* Sifat */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.propertiesTitle}</p>
                  <div className="space-y-2 font-body text-sm">
                    {[
                      { sifat: t.prop1, rumus: "0 \\leq P(A) \\leq 1", color: "border-cyan-500/20" },
                      { sifat: t.prop2, rumus: "P(A) = 0",              color: "border-red-500/20" },
                      { sifat: t.prop3, rumus: "P(A) = 1",              color: "border-green-500/20" },
                    ].map(({ sifat, rumus, color }) => (
                      <div key={sifat} className={`bg-slate-800/40 border ${color} rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2`}>
                        <p className="text-white/70 flex-1">{sifat}</p>
                        <div className="shrink-0"><InlineMath math={rumus} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabel Koin */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.tableTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-cyan-900/50">
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{t.tHead1}</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-center">{t.tHead2} <InlineMath math="(f)" /></th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-center">{t.tHead3} <InlineMath math="P(A)" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [t.tR1c1, "23", t.tR1c3],
                          [t.tR2c1, "17", t.tR2c3],
                          [t.tTotal, "40", t.tTotalc3],
                        ].map(([h, f, p], i) => (
                          <tr key={i} className={i === 2 ? "bg-cyan-900/20 font-bold" : i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white">{h}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">{f}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">{p}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/40 border border-yellow-500/20 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      <span dangerouslySetInnerHTML={{ __html: t.tableTip }} />
                    </p>
                  </div>
                </div>

                {/* Lab */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.labTitle}</p>
                  <p className="font-body text-xs text-white/50 leading-relaxed">
                    {t.labDesc}{" "}
                    <strong className="text-cyan-300">
                      {language === "id" ? "Hukum Bilangan Besar" : language === "en" ? "Law of Large Numbers" : "大数の法則"}
                    </strong>
                    {language === "ja" ? "の本質です！" : "!"}
                  </p>
                  <LabPercobaanEmpirik />
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec3Title} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.bMudah} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.s1q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">{t.diketahui}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• {t.s1d1} <InlineMath math="n = 50" /></p>
                      <p>• {t.s1d2} <InlineMath math="f_4 = 8" /></p>
                    </div>
                    <p className="font-body text-sm text-white/80">{t.s1guide}</p>
                    <BlockMath math={formulaS1} />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">
                        {t.s1key}{" "}
                        <InlineMath math="\frac{4}{25}" /> {t.s1keyOr} <InlineMath math={`0${dc}16`} />.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.bSedang} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90" style={{ whiteSpace: "pre-line" }}>{t.s2q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">
                      {t.s2given} <InlineMath math="n = 200" />,{" "}
                      {language === "id" ? <><InlineMath math="f_A = 94" />, <InlineMath math="f_G = 106" /></>
                        : language === "en" ? <><InlineMath math="f_H = 94" />, <InlineMath math="f_T = 106" /></>
                        : <><InlineMath math="f_表 = 94" />, <InlineMath math="f_裏 = 106" /></>}
                    </p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s2a}</p>
                      <BlockMath math={`P(A) = \\frac{94}{200} = \\frac{47}{100} = 0${dc}47`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s2b}</p>
                      <BlockMath math={`P(G) = \\frac{106}{200} = \\frac{53}{100} = 0${dc}53`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s2c}</p>
                      <BlockMath math={`P(A) + P(G) = 0${dc}47 + 0${dc}53 = 1 \\checkmark`} />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">{t.s2tip}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.bSulit} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90" style={{ whiteSpace: "pre-line" }}>{t.s3q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.pembahasan}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      <p>• {t.s3d1} <InlineMath math={`n = ${n1200}`} /></p>
                      <p>• {t.s3d2} <InlineMath math={fCacatEq} /></p>
                      <p>• {t.s3d3} <InlineMath math={fBaikEq} /></p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s3a}</p>
                      <BlockMath math={formulaS3a} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s3b}</p>
                      <BlockMath math={formulaS3b} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s3c}</p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.s3cnote}</p>
                      <BlockMath math={formulaS3c} />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">{t.s3tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={t.sec4Title} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {[
                    { poin: t.rp1, icon: "🔬" },
                    { poin: t.rp2, icon: "📐" },
                    { poin: t.rp3, icon: "📏" },
                    { poin: t.rp4, icon: "📈" },
                    { poin: t.rp5, icon: "🔮" },
                  ].map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="P(A) = \frac{f_A}{n} \quad \Rightarrow \quad 0 \leq P(A) \leq 1" />
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-green-900"
            gradientVia="via-emerald-900"
            gradientTo="to-lime-900"
            borderColor="border-green-500/40"
            accentColor="text-green-300"
            headerIcon="🧪"
            judul={rangkumanData.judul}
            subjudul={rangkumanData.subjudul}
            ringkasan={rangkumanData.ringkasan}
            rumus={[
              { label: language === "id" ? "Peluang Empirik" : language === "en" ? "Empirical Probability" : "経験的確率", rumus: "P(A) = \\frac{f_A}{n}", bg: "bg-green-900/60", border: "border-green-400/40", labelColor: "text-green-300" },
              { label: language === "id" ? "Rentang Nilai Peluang" : language === "en" ? "Probability Range" : "確率の範囲", rumus: "0 \\leq P(A) \\leq 1", bg: "bg-emerald-900/60", border: "border-emerald-400/40", labelColor: "text-emerald-300" },
            ]}
            tips={rangkumanData.tips}
            kesimpulan={rangkumanData.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-green-900/80 to-emerald-900/80"
            kesimpulanBorder="border-green-400/50"
            kesimpulanTextColor="text-green-100"
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/peluang"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              {t.backBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeluangEmpirikPage;
