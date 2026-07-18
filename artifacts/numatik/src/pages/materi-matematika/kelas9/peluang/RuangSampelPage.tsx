import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const RuangSampelPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro",
    "konsep1", "contoh1a", "contoh1b", "contoh1c",
    "konsep2", "contoh2a", "contoh2b", "contoh2c",
    "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  // ── Coin labels (language-adaptive) ──────────────────────────────
  const coinH = language === "id" ? "A" : language === "en" ? "H" : "表";
  const coinT = language === "id" ? "G" : language === "en" ? "T" : "裏";
  const coinHLabel = language === "id" ? "Angka" : language === "en" ? "Heads" : "表面";
  const coinTLabel = language === "id" ? "Gambar" : language === "en" ? "Tails" : "裏面";

  // ── KaTeX units ──────────────────────────────────────────────────
  const kKartu = language === "id" ? "\\mathrm{kartu}" : language === "en" ? "\\mathrm{cards}" : "\\mathrm{枚}";
  const kSuit  = language === "id" ? "\\mathrm{suit}"  : language === "en" ? "\\mathrm{suits}" : "\\mathrm{スート}";
  const kPasanganTerurut = language === "id"
    ? "\\mathrm{pasangan\\;terurut}"
    : language === "en"
    ? "\\mathrm{ordered\\;pairs}"
    : "\\mathrm{順序対}";
  const kMajemuk = language === "id" ? "\\mathrm{majemuk}" : language === "en" ? "\\mathrm{compound}" : "\\mathrm{複合}";

  // ── Translations ─────────────────────────────────────────────────
  const t = {
    title:     language === "id" ? "RUANG SAMPEL & TITIK SAMPEL"  : language === "en" ? "SAMPLE SPACE & SAMPLE POINT" : "標本空間と標本点",
    subtitle:  language === "id" ? "Kejadian Tunggal & Kejadian Majemuk" : language === "en" ? "Simple Events & Compound Events" : "単純事象と複合事象",
    breadcrumb:language === "id" ? "Kelas 9 · Peluang · Materi Matematika" : language === "en" ? "Grade 9 · Probability · Mathematics" : "中学3年 · 確率 · 数学",
    imgAlt:    language === "id" ? "Melempar koin – ilustrasi ruang sampel" : language === "en" ? "Tossing a coin – sample space illustration" : "コイン投げ – 標本空間の図解",

    mudah: language === "id" ? "MUDAH"  : language === "en" ? "EASY"   : "基本",
    sedang:language === "id" ? "SEDANG" : language === "en" ? "MEDIUM" : "標準",
    sulit: language === "id" ? "SULIT"  : language === "en" ? "HARD"   : "発展",
    soal:  language === "id" ? "Soal"   : language === "en" ? "Problem": "問題",
    pembahasan: language === "id" ? "✅ Pembahasan" : language === "en" ? "✅ Solution" : "✅ 解答",

    // ── Intro ──────────────────────────────────────────────────────
    introTitle: language === "id" ? "🌟 Memahami Ruang Sampel" : language === "en" ? "🌟 Understanding Sample Space" : "🌟 標本空間を理解する",
    notasiTitle:language === "id" ? "📌 Notasi Penting" : language === "en" ? "📌 Key Notation" : "📌 重要な記号",
    notasiS:    language === "id" ? "= ruang sampel," : language === "en" ? "= sample space," : "= 標本空間,",
    notasiNS:   language === "id" ? "= banyaknya titik sampel" : language === "en" ? "= number of sample points" : "= 標本点の個数",
    notasiK:    language === "id" ? "= kejadian tertentu," : language === "en" ? "= a specific event," : "= 特定の事象,",
    notasiNK:   language === "id" ? "= banyaknya anggota kejadian" : language === "en" ? "= number of members of event" : "= 事象の要素の個数",

    // ── Sub-bab 1 ──────────────────────────────────────────────────
    sub1Title: language === "id" ? "📘 Sub-Bab 1: Ruang Sampel Kejadian Tunggal" : language === "en" ? "📘 Chapter 1: Sample Space — Simple Events" : "📘 第1節：単純事象の標本空間",
    summaryLabel: language === "id" ? "🎯 Ringkasan Intisari" : language === "en" ? "🎯 Key Concept" : "🎯 重要概念",
    coinTitle: language === "id" ? "🪙 a. Uang Koin" : language === "en" ? "🪙 a. Coin" : "🪙 a. コイン",
    coinImgAlt:language === "id" ? "Uang koin Rp1.000" : language === "en" ? "Coin" : "コイン",
    dieTitle:  language === "id" ? "🎲 b. Dadu Bermuka Enam" : language === "en" ? "🎲 b. Six-Sided Die" : "🎲 b. 六面サイコロ",
    dieFace:   language === "id" ? "Mata Dadu" : language === "en" ? "Die Face" : "目の数",
    dieEven:   language === "id" ? "Genap?" : language === "en" ? "Even?" : "偶数?",
    diePrime:  language === "id" ? "Prima?" : language === "en" ? "Prime?" : "素数?",
    dieOdd:    language === "id" ? "Ganjil?" : language === "en" ? "Odd?" : "奇数?",
    cardTitle: language === "id" ? "🃏 c. Kartu Bridge" : language === "en" ? "🃏 c. Playing Cards" : "🃏 c. トランプ",
    cardUnit:  language === "id" ? "kartu" : language === "en" ? "cards" : "枚",

    // ── Sub-bab 1 Examples ─────────────────────────────────────────
    contoh1Title: language === "id" ? "📝 Contoh Soal Sub-Bab 1" : language === "en" ? "📝 Practice Problems — Chapter 1" : "📝 例題 — 第1節",

    // ── Sub-bab 2 ──────────────────────────────────────────────────
    sub2Title:     language === "id" ? "📗 Sub-Bab 2: Ruang Sampel Kejadian Majemuk" : language === "en" ? "📗 Chapter 2: Sample Space — Compound Events" : "📗 第2節：複合事象の標本空間",
    sub2Multiply:  language === "id" ? "Kalikan banyaknya kemungkinan masing-masing alat!" : language === "en" ? "Multiply the number of outcomes for each object!" : "各道具の場合の数を掛け合わせます！",
    twoCoinTitle:  language === "id" ? "🪙🪙 a. Pengetosan Dua Koin"   : language === "en" ? "🪙🪙 a. Tossing Two Coins"      : "🪙🪙 a. コインを2枚投げる",
    threeCoinTitle:language === "id" ? "🪙🪙🪙 b. Pengetosan Tiga Koin" : language === "en" ? "🪙🪙🪙 b. Tossing Three Coins" : "🪙🪙🪙 b. コインを3枚投げる",
    treeDiagram:   language === "id" ? "🌳 Diagram Pohon" : language === "en" ? "🌳 Tree Diagram" : "🌳 樹形図",
    coin1:  language === "id" ? "Koin 1" : language === "en" ? "Coin 1" : "コイン1",
    coin2:  language === "id" ? "Koin 2" : language === "en" ? "Coin 2" : "コイン2",
    coin3:  language === "id" ? "Koin 3" : language === "en" ? "Coin 3" : "コイン3",
    hasil:  language === "id" ? "Hasil"  : language === "en" ? "Outcome" : "結果",
    twoDieTitle:   language === "id" ? "🎲🎲 c. Pengetosan Dua Dadu"      : language === "en" ? "🎲🎲 c. Rolling Two Dice"          : "🎲🎲 c. サイコロを2つ振る",
    coinDieTitle:  language === "id" ? "🪙🎲 d. Pengetosan Koin dan Dadu"  : language === "en" ? "🪙🎲 d. Tossing a Coin and a Die"   : "🪙🎲 d. コインとサイコロを投げる",
    coinDieHeader: language === "id" ? "Koin \\ Dadu" : language === "en" ? "Coin \\ Die" : "コイン \\ サイコロ",
    orderedPairNote: language === "id" ? "Ditulis sebagai pasangan terurut (dadu1, dadu2)" : language === "en" ? "Written as ordered pairs (die1, die2)" : "順序対 (サイコロ1, サイコロ2) として表す",
    sumHighlight: language === "id" ? "🟡 Sel berwarna kuning = pasangan dengan jumlah 7 (ada 6 pasangan)" : language === "en" ? "🟡 Yellow cells = pairs that sum to 7 (6 pairs)" : "🟡 黄色のセル = 和が7になる組み合わせ（6通り）",

    // ── Sub-bab 2 Examples ─────────────────────────────────────────
    contoh2Title: language === "id" ? "📝 Contoh Soal Sub-Bab 2" : language === "en" ? "📝 Practice Problems — Chapter 2" : "📝 例題 — 第2節",

    // ── Rangkuman table ────────────────────────────────────────────
    rangkumanTitle: language === "id" ? "📋 Rangkuman & Tabel Ruang Sampel" : language === "en" ? "📋 Summary & Sample Space Table" : "📋 まとめと標本空間の一覧",
    percobaan:     language === "id" ? "Percobaan" : language === "en" ? "Experiment" : "試行",
    caraMenghitung:language === "id" ? "Cara Menghitung" : language === "en" ? "How to Count" : "計算方法",
    rumusKunci: language === "id" ? "🧠 Rumus Kunci" : language === "en" ? "🧠 Key Formula" : "🧠 重要な公式",
    rumusNote:  language === "id" ? "Berlaku untuk kejadian majemuk yang saling bebas" : language === "en" ? "Applies to independent compound events" : "互いに独立な複合事象に適用される",
    checklist:  language === "id" ? "✅ Checklist Mengerjakan Soal Ruang Sampel" : language === "en" ? "✅ Checklist for Sample Space Problems" : "✅ 標本空間の問題を解くチェックリスト",
    backButton: language === "id" ? "Kembali ke Peluang" : language === "en" ? "Back to Probability" : "確率に戻る",
  };

  const introTerms = language === "id" ? [
    { term: "Percobaan (Eksperimen)", icon: "🧪", desc: "Kegiatan yang menghasilkan suatu hasil tertentu, misalnya melempar koin, melempar dadu, atau mengambil kartu.", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
    { term: "Ruang Sampel (S)", icon: "🌐", desc: "Himpunan semua hasil yang mungkin muncul dari suatu percobaan. Dilambangkan dengan huruf S.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
    { term: "Titik Sampel", icon: "📍", desc: "Setiap anggota dari ruang sampel. Satu hasil tunggal dari percobaan disebut satu titik sampel.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
    { term: "Kejadian (K)", icon: "🎯", desc: "Himpunan bagian dari ruang sampel yang memenuhi syarat tertentu. Contoh: muncul bilangan genap saat melempar dadu.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
  ] : language === "en" ? [
    { term: "Experiment", icon: "🧪", desc: "An activity that produces a definite outcome, such as tossing a coin, rolling a die, or drawing a card.", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
    { term: "Sample Space (S)", icon: "🌐", desc: "The set of all possible outcomes of an experiment. Denoted by the letter S.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
    { term: "Sample Point", icon: "📍", desc: "Each member of the sample space. A single outcome of the experiment is called one sample point.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
    { term: "Event (K)", icon: "🎯", desc: "A subset of the sample space satisfying certain conditions. Example: rolling an even number on a die.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
  ] : [
    { term: "実験（試行）", icon: "🧪", desc: "コインを投げる、サイコロを振る、カードを引くなど、特定の結果をもたらす活動。", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
    { term: "標本空間 (S)", icon: "🌐", desc: "ある試行で起こりうるすべての結果の集合。Sで表す。", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
    { term: "標本点", icon: "📍", desc: "標本空間の各要素。試行の1つの結果を1つの標本点という。", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
    { term: "事象 (K)", icon: "🎯", desc: "特定の条件を満たす標本空間の部分集合。例：サイコロで偶数が出る事象。", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
  ];

  const cardSuits = language === "id" ? [
    { suit: "♠ Sekop",    color: "bg-slate-700/70 border-slate-400/40 text-white",   count: 13, note: "Hitam" },
    { suit: "♥ Hati",    color: "bg-red-900/50 border-red-400/40 text-red-200",     count: 13, note: "Merah" },
    { suit: "♦ Wajik",   color: "bg-red-900/50 border-red-400/40 text-red-200",     count: 13, note: "Merah" },
    { suit: "♣ Keriting",color: "bg-slate-700/70 border-slate-400/40 text-white",   count: 13, note: "Hitam" },
  ] : language === "en" ? [
    { suit: "♠ Spades",  color: "bg-slate-700/70 border-slate-400/40 text-white",   count: 13, note: "Black" },
    { suit: "♥ Hearts",  color: "bg-red-900/50 border-red-400/40 text-red-200",     count: 13, note: "Red"   },
    { suit: "♦ Diamonds",color: "bg-red-900/50 border-red-400/40 text-red-200",     count: 13, note: "Red"   },
    { suit: "♣ Clubs",   color: "bg-slate-700/70 border-slate-400/40 text-white",   count: 13, note: "Black" },
  ] : [
    { suit: "♠ スペード", color: "bg-slate-700/70 border-slate-400/40 text-white",  count: 13, note: "黒" },
    { suit: "♥ ハート",  color: "bg-red-900/50 border-red-400/40 text-red-200",    count: 13, note: "赤" },
    { suit: "♦ ダイヤ",  color: "bg-red-900/50 border-red-400/40 text-red-200",    count: 13, note: "赤" },
    { suit: "♣ クラブ",  color: "bg-slate-700/70 border-slate-400/40 text-white",  count: 13, note: "黒" },
  ];

  const cardStats = language === "id" ? [
    "• Kartu merah: 26 (♥ + ♦)", "• Kartu hitam: 26 (♠ + ♣)",
    "• Kartu As (A): 4 kartu",    "• Kartu gambar (J/Q/K): 12 kartu",
    "• Kartu bernomor (2–10): 36 kartu", "• Kartu King: 4 kartu",
  ] : language === "en" ? [
    "• Red cards: 26 (♥ + ♦)",   "• Black cards: 26 (♠ + ♣)",
    "• Aces (A): 4 cards",        "• Face cards (J/Q/K): 12 cards",
    "• Numbered cards (2–10): 36 cards", "• Kings: 4 cards",
  ] : [
    "• 赤のカード: 26枚 (♥ + ♦)", "• 黒のカード: 26枚 (♠ + ♣)",
    "• エース (A): 4枚",           "• 絵札 (J/Q/K): 12枚",
    "• 数札 (2–10): 36枚",         "• キング: 4枚",
  ];

  const summaryRows = language === "id" ? [
    ["1 koin", "2", "Langsung daftar: {A, G}"],
    ["1 dadu", "6", "Langsung daftar: {1,2,3,4,5,6}"],
    ["1 kartu bridge", "52", "Langsung: 4 suit × 13 kartu"],
    ["2 koin", "4", "2 × 2 (tabel 2×2)"],
    ["3 koin", "8", "2 × 2 × 2 (diagram pohon)"],
    ["2 dadu", "36", "6 × 6 (tabel 6×6)"],
    ["1 koin + 1 dadu", "12", "2 × 6 (tabel 2×6)"],
  ] : language === "en" ? [
    ["1 coin",   "2",  "List directly: {H, T}"],
    ["1 die",    "6",  "List directly: {1,2,3,4,5,6}"],
    ["1 deck",   "52", "Direct: 4 suits × 13 cards"],
    ["2 coins",  "4",  "2 × 2 (2×2 table)"],
    ["3 coins",  "8",  "2 × 2 × 2 (tree diagram)"],
    ["2 dice",   "36", "6 × 6 (6×6 table)"],
    ["1 coin + 1 die", "12", "2 × 6 (2×6 table)"],
  ] : [
    ["コイン1枚",       "2",  "直接列挙：{表, 裏}"],
    ["サイコロ1個",     "6",  "直接列挙：{1,2,3,4,5,6}"],
    ["トランプ1枚",     "52", "直接：4スート × 13枚"],
    ["コイン2枚",       "4",  "2 × 2（2×2の表）"],
    ["コイン3枚",       "8",  "2 × 2 × 2（樹形図）"],
    ["サイコロ2個",     "36", "6 × 6（6×6の表）"],
    ["コイン1枚＋サイコロ1個", "12", "2 × 6（2×6の表）"],
  ];

  const checklistItems = language === "id" ? [
    "Identifikasi alat/benda yang digunakan dalam percobaan",
    "Tentukan n(S) masing-masing alat (koin=2, dadu=6, kartu=52)",
    "Untuk majemuk: kalikan n(S) tiap alat",
    "Buat tabel atau diagram pohon untuk melihat semua kemungkinan",
    "Tentukan kejadian K dan daftar anggotanya dari ruang sampel",
    "Hitung n(K) = banyaknya anggota kejadian K",
  ] : language === "en" ? [
    "Identify the objects used in the experiment",
    "Determine n(S) for each object (coin=2, die=6, cards=52)",
    "For compound events: multiply n(S) for each object",
    "Draw a table or tree diagram to list all possibilities",
    "Identify event K and list its members from the sample space",
    "Count n(K) = number of members of event K",
  ] : [
    "試行で使われる道具を確認する",
    "各道具の n(S) を求める（コイン=2，サイコロ=6，カード=52）",
    "複合事象の場合：各道具の n(S) を掛ける",
    "表または樹形図を作成してすべての場合を確認する",
    "事象Kを特定し、標本空間から要素を列挙する",
    "n(K) = 事象Kの要素の個数を数える",
  ];

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

  // ── Two-coin S string (language-adaptive) ────────────────────────
  const twoCoinS = `S = \\{${coinH}${coinH},\\; ${coinH}${coinT},\\; ${coinT}${coinH},\\; ${coinT}${coinT}\\},\\quad n(S) = 4`;
  const threeCoinS = `S = \\{${coinH}${coinH}${coinH},\\; ${coinH}${coinH}${coinT},\\; ${coinH}${coinT}${coinH},\\; ${coinH}${coinT}${coinT},\\; ${coinT}${coinH}${coinH},\\; ${coinT}${coinH}${coinT},\\; ${coinT}${coinT}${coinH},\\; ${coinT}${coinT}${coinT}\\}`;

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
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.breadcrumb}
        </p>

        <div className="mb-6 rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-900/30 mx-auto w-40">
          <img
            src={"/images/image_1776223164069.png"}
            alt={t.imgAlt}
            className="w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introTitle} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id"
                    ? <>Bayangkan kamu sedang melempar sebuah koin ke udara. Koin itu bisa jatuh menunjukkan sisi <strong className="text-cyan-300">Angka</strong> atau sisi <strong className="text-cyan-300">Gambar</strong>. Nah, himpunan semua hasil yang <em>mungkin</em> terjadi itulah yang disebut <strong className="text-cyan-300">Ruang Sampel</strong>!</>
                    : language === "en"
                    ? <>Imagine tossing a coin into the air. It can land showing <strong className="text-cyan-300">Heads</strong> or <strong className="text-cyan-300">Tails</strong>. The set of all <em>possible</em> outcomes is called the <strong className="text-cyan-300">Sample Space</strong>!</>
                    : <>コインを空中に投げる様子を想像してください。コインは<strong className="text-cyan-300">表</strong>か<strong className="text-cyan-300">裏</strong>のどちらかが出ます。起こりうるすべての結果の集合が<strong className="text-cyan-300">標本空間</strong>と呼ばれます！</>}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {introTerms.map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">{t.notasiTitle}</p>
                  <div className="space-y-1 font-body text-sm text-white/80">
                    <p><InlineMath math="S" /> {t.notasiS} <InlineMath math="n(S)" /> {t.notasiNS}</p>
                    <p><InlineMath math="K" /> {t.notasiK} <InlineMath math="n(K)" /> {t.notasiNK} <InlineMath math="K" /></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {language === "id"
                      ? <><strong>Tips:</strong> Ruang sampel selalu ditulis dalam kurung kurawal <InlineMath math="\{ \ldots \}" />, sama seperti penulisan himpunan dalam matematika!</>
                      : language === "en"
                      ? <><strong>Tip:</strong> The sample space is always written in curly braces <InlineMath math="\{ \ldots \}" />, just like sets in mathematics!</>
                      : <><strong>ヒント:</strong> 標本空間は数学の集合と同じように常に波括弧 <InlineMath math="\{ \ldots \}" /> で表します！</>}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
               SUB-BAB 1 — KEJADIAN TUNGGAL
          ════════════════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.sub1Title} />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-1">{t.summaryLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {language === "id"
                      ? <>Kejadian <strong className="text-green-300">tunggal</strong> artinya kita hanya melakukan <em>satu jenis percobaan</em> dengan <em>satu alat</em>, misalnya melempar satu koin, melempar satu dadu, atau mengambil satu kartu. Cara paling mudah menentukan ruang sampelnya adalah dengan <strong className="text-green-300">mendaftar semua kemungkinan</strong> satu per satu.</>
                      : language === "en"
                      ? <>A <strong className="text-green-300">simple</strong> event means we perform only <em>one type of experiment</em> with <em>one object</em>, such as tossing one coin, rolling one die, or drawing one card. The easiest way to find the sample space is to <strong className="text-green-300">list all possibilities</strong> one by one.</>
                      : <>単純事象とは、<em>1種類の試行</em>を<em>1つの道具</em>で行うことです（コイン1枚を投げる、サイコロ1個を振る、カード1枚を引くなど）。標本空間を求める最も簡単な方法は、<strong className="text-green-300">すべての可能性を1つずつ列挙</strong>することです。</>}
                  </p>
                </div>

                {/* COIN */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.coinTitle}</p>
                  <div className="flex justify-center">
                    <img src={"/images/koin_fix_1776223721630.png"} alt={t.coinImgAlt} className="w-44 rounded-lg" />
                  </div>
                  <div className="flex gap-3 justify-center">
                    {[
                      { sisi: coinH, label: coinHLabel, color: "bg-yellow-600/60 border-yellow-400/60 text-yellow-200" },
                      { sisi: coinT, label: coinTLabel, color: "bg-amber-800/60 border-amber-500/60 text-amber-200" },
                    ].map(({ sisi, label, color }) => (
                      <div key={sisi} className={`border ${color} rounded-full w-20 h-20 flex flex-col items-center justify-center`}>
                        <p className="font-display text-2xl font-bold">{sisi}</p>
                        <p className="font-body text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/60 border border-yellow-500/20 rounded-lg p-3 text-sm font-body">
                    <BlockMath math={`S = \\{${coinH},\\; ${coinT}\\},\\quad n(S) = 2`} />
                    <p className="text-white/60 text-xs text-center">{coinH} = {coinHLabel}, {coinT} = {coinTLabel}</p>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* DIE */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.dieTitle}</p>
                  <div className="flex justify-center">
                    <img src={"/images/image_1776223510131.png"} alt={language === "id" ? "Dadu bermuka enam" : language === "en" ? "Six-sided die" : "六面サイコロ"} className="w-60 rounded-lg" />
                  </div>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="w-12 h-12 bg-white/10 border border-white/30 rounded-xl flex items-center justify-center">
                        <span className="font-display text-xl font-bold text-white">{n}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-3 text-sm font-body">
                    <BlockMath math="S = \{1,\; 2,\; 3,\; 4,\; 5,\; 6\},\quad n(S) = 6" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-blue-900/50">
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200 text-left">{t.dieFace}</th>
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200">{t.dieEven}</th>
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200">{t.diePrime}</th>
                          <th className="border border-blue-500/30 px-3 py-2 text-blue-200">{t.dieOdd}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "—", "—", "✓"],
                          [2, "✓", "✓", "—"],
                          [3, "—", "✓", "✓"],
                          [4, "✓", "—", "—"],
                          [5, "—", "✓", "✓"],
                          [6, "✓", "—", "—"],
                        ].map(([n, g, p, gj], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 font-bold text-white text-center">{n}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-400">{g}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-400">{p}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-orange-400">{gj}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* PLAYING CARDS */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.cardTitle}</p>
                  <div className="flex justify-center">
                    <img src={"/images/image_1776224003366.png"} alt={language === "id" ? "Simbol kartu bridge" : language === "en" ? "Playing card suits" : "トランプのスート"} className="w-44 rounded-lg" />
                  </div>
                  <p className="font-body text-xs text-white/70 leading-relaxed">
                    {language === "id"
                      ? <>Satu set kartu bridge terdiri dari <strong className="text-white">52 kartu</strong> yang dibagi menjadi 4 jenis (suit), masing-masing berisi 13 kartu bernomor A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K.</>
                      : language === "en"
                      ? <>A standard deck has <strong className="text-white">52 cards</strong> divided into 4 suits, each with 13 cards: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K.</>
                      : <>トランプ1セットは<strong className="text-white">52枚</strong>で4つのスートに分けられ、それぞれA, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, Kの13枚からなります。</>}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {cardSuits.map(({ suit, color, count, note }) => (
                      <div key={suit} className={`border ${color} rounded-xl p-3 text-center`}>
                        <p className="font-display text-xl font-bold mb-1">{suit}</p>
                        <p className="font-body text-xs font-semibold">{count} {t.cardUnit} · {note}</p>
                        <p className="font-body text-xs text-white/50 mt-1">A 2 3 4 5 6 7 8 9 10 J Q K</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/60 border border-purple-500/20 rounded-lg p-3">
                    <BlockMath math={`n(S) = 52\\,${kKartu}`} />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs font-body text-white/70">
                      {cardStats.map((s, i) => <p key={i}>{s}</p>)}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 1 ──────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1a" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.contoh1Title} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — EASY */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.mudah} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {language === "id"
                        ? <>Sebuah uang koin dilempar satu kali. Tentukan:<br />a. Ruang sampel <InlineMath math="S" /> dan <InlineMath math="n(S)" /><br />b. Kejadian <InlineMath math="K" /> = muncul sisi Angka, serta <InlineMath math="n(K)" /></>
                        : language === "en"
                        ? <>A coin is tossed once. Determine:<br />a. The sample space <InlineMath math="S" /> and <InlineMath math="n(S)" /><br />b. Event <InlineMath math="K" /> = Heads appears, and <InlineMath math="n(K)" /></>
                        : <>コインを1回投げる。次を求めよ：<br />a. 標本空間 <InlineMath math="S" /> と <InlineMath math="n(S)" /><br />b. 事象 <InlineMath math="K" /> = 表が出る、および <InlineMath math="n(K)" /></>}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">
                      {language === "id"
                        ? `Satu koin memiliki 2 sisi: Angka (${coinH}) dan Gambar (${coinT}).`
                        : language === "en"
                        ? `A coin has 2 sides: Heads (${coinH}) and Tails (${coinT}).`
                        : `コインには2面あります：表 (${coinH}) と裏 (${coinT})。`}
                    </p>
                    <div className="space-y-1">
                      <p className="font-body text-sm text-white/80">
                        {language === "id" ? "a. Daftar semua kemungkinan:" : language === "en" ? "a. List all possibilities:" : "a. すべての可能性を列挙すると："}
                      </p>
                      <BlockMath math={`S = \\{${coinH},\\; ${coinT}\\},\\quad n(S) = 2`} />
                      <p className="font-body text-sm text-white/80">
                        {language === "id"
                          ? `b. Kejadian muncul Angka hanya ada 1 anggota:`
                          : language === "en"
                          ? `b. Event Heads has exactly 1 member:`
                          : `b. 表が出る事象の要素は1つだけ：`}
                      </p>
                      <BlockMath math={`K = \\{${coinH}\\},\\quad n(K) = 1`} />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">
                        {language === "id"
                          ? `🔑 Dari 2 kemungkinan, hanya 1 yang memenuhi kejadian K.`
                          : language === "en"
                          ? `🔑 Out of 2 possibilities, only 1 satisfies event K.`
                          : `🔑 2通りの中で、事象Kを満たすのは1通りだけです。`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — MEDIUM */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.sedang} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {language === "id"
                        ? <>Sebuah dadu bermuka enam dilempar satu kali. Tentukan ruang sampel <InlineMath math="S" />, kemudian tentukan anggota dan nilai <InlineMath math="n(K)" /> untuk kejadian berikut:<br />a. <InlineMath math="K_1" /> = muncul bilangan prima<br />b. <InlineMath math="K_2" /> = muncul bilangan lebih dari 4</>
                        : language === "en"
                        ? <>A six-sided die is rolled once. Find the sample space <InlineMath math="S" />, then find the members and <InlineMath math="n(K)" /> for:<br />a. <InlineMath math="K_1" /> = a prime number appears<br />b. <InlineMath math="K_2" /> = a number greater than 4 appears</>
                        : <>六面サイコロを1回振る。標本空間 <InlineMath math="S" /> を求め、次の事象の要素と <InlineMath math="n(K)" /> を求めよ：<br />a. <InlineMath math="K_1" /> = 素数が出る<br />b. <InlineMath math="K_2" /> = 4より大きい数が出る</>}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.pembahasan}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id" ? "Ruang sampel dadu:" : language === "en" ? "Die sample space:" : "サイコロの標本空間："}
                      </p>
                      <BlockMath math="S = \{1, 2, 3, 4, 5, 6\},\quad n(S) = 6" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? "a. Bilangan prima dari 1–6 adalah: 2, 3, 5"
                          : language === "en"
                          ? "a. Prime numbers from 1–6: 2, 3, 5"
                          : "a. 1〜6の素数：2, 3, 5"}
                      </p>
                      <BlockMath math="K_1 = \{2, 3, 5\},\quad n(K_1) = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? "b. Bilangan lebih dari 4 dari 1–6 adalah: 5, 6"
                          : language === "en"
                          ? "b. Numbers greater than 4 from 1–6: 5, 6"
                          : "b. 1〜6で4より大きい数：5, 6"}
                      </p>
                      <BlockMath math="K_2 = \{5, 6\},\quad n(K_2) = 2" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">
                        {language === "id"
                          ? "💡 Ingat: 1 bukan bilangan prima! Bilangan prima dimulai dari 2."
                          : language === "en"
                          ? "💡 Remember: 1 is NOT a prime number! Primes start from 2."
                          : "💡 注意：1は素数ではありません！素数は2から始まります。"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — HARD */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.sulit} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {language === "id"
                        ? <>Dari satu set kartu bridge (52 kartu), diambil satu kartu secara acak. Tentukan <InlineMath math="n(S)" /> dan nilai <InlineMath math="n(K)" /> untuk kejadian berikut:<br />a. <InlineMath math="K_1" /> = terambil kartu merah bernomor ganjil<br />b. <InlineMath math="K_2" /> = terambil kartu hitam bukan kartu gambar (bukan J, Q, K)</>
                        : language === "en"
                        ? <>From a standard deck (52 cards), one card is drawn at random. Find <InlineMath math="n(S)" /> and <InlineMath math="n(K)" /> for:<br />a. <InlineMath math="K_1" /> = a red odd-numbered card is drawn<br />b. <InlineMath math="K_2" /> = a black non-face card is drawn (not J, Q, K)</>
                        : <>トランプ1セット（52枚）から1枚無作為に引く。<InlineMath math="n(S)" /> と次の事象の <InlineMath math="n(K)" /> を求めよ：<br />a. <InlineMath math="K_1" /> = 赤の奇数カードが引かれる<br />b. <InlineMath math="K_2" /> = 黒の絵札でないカードが引かれる（J, Q, K以外）</>}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.pembahasan}</p>
                    <BlockMath math="n(S) = 52" />
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? <><strong>a. Kartu merah bernomor ganjil:</strong><br />Kartu merah = ♥ dan ♦ (masing-masing 13 kartu)<br />Nomor ganjil dari A, 2–10, J, Q, K: yaitu A, 3, 5, 7, 9 → <strong>5 nomor ganjil</strong></>
                          : language === "en"
                          ? <><strong>a. Red odd-numbered cards:</strong><br />Red cards = ♥ and ♦ (13 each)<br />Odd values from A, 2–10, J, Q, K: A, 3, 5, 7, 9 → <strong>5 odd values</strong></>
                          : <><strong>a. 赤の奇数カード：</strong><br />赤のカード = ♥ と ♦ (各13枚)<br />A, 2–10, J, Q, KのうちA, 3, 5, 7, 9が奇数 → <strong>奇数5種類</strong></>}
                      </p>
                      <BlockMath math={`n(K_1) = 2\\,${kSuit} \\times 5\\,${kKartu} = 10\\,${kKartu}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? <><strong>b. Kartu hitam bukan kartu gambar:</strong><br />Kartu hitam = ♠ dan ♣ (masing-masing 13 kartu)<br />Total kartu hitam = 26 kartu<br />Kartu gambar hitam = J♠, Q♠, K♠, J♣, Q♣, K♣ = 6 kartu</>
                          : language === "en"
                          ? <><strong>b. Black non-face cards:</strong><br />Black cards = ♠ and ♣ (13 each)<br />Total black cards = 26<br />Black face cards = J♠, Q♠, K♠, J♣, Q♣, K♣ = 6 cards</>
                          : <><strong>b. 黒の絵札でないカード：</strong><br />黒のカード = ♠ と ♣ (各13枚)<br />黒のカード合計 = 26枚<br />黒の絵札 = J♠, Q♠, K♠, J♣, Q♣, K♣ = 6枚</>}
                      </p>
                      <BlockMath math={`n(K_2) = 26 - 6 = 20\\,${kKartu}`} />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">
                        {language === "id"
                          ? "⚠️ Perhatikan As (A): dalam kartu bridge, As dihitung bernilai 1 dan termasuk bilangan ganjil!"
                          : language === "en"
                          ? "⚠️ Note on Ace (A): in a standard deck, Ace counts as 1 and is an odd number!"
                          : "⚠️ エース (A) に注意：トランプでエースは1として扱われ、奇数に含まれます！"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
               SUB-BAB 2 — KEJADIAN MAJEMUK
          ════════════════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sub2Title} />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.summaryLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {language === "id"
                      ? <>Kejadian <strong className="text-cyan-300">majemuk</strong> terjadi saat percobaan melibatkan <em>lebih dari satu alat</em> sekaligus, misalnya dua koin, tiga koin, dua dadu, atau koin dengan dadu. Ada rumus praktis untuk menghitung <InlineMath math="n(S)" />:</>
                      : language === "en"
                      ? <>A <strong className="text-cyan-300">compound</strong> event occurs when the experiment involves <em>more than one object</em> at once, such as two coins, three coins, two dice, or a coin with a die. There is a handy formula for <InlineMath math="n(S)" />:</>
                      : <>複合事象とは、2枚のコイン、3枚のコイン、2つのサイコロ、コインとサイコロなど、<em>複数の道具</em>を同時に使う試行の事象です。<InlineMath math="n(S)" /> を計算する便利な公式があります：</>}
                  </p>
                  <div className="mt-3">
                    <BlockMath math="n(S) = n(S_1) \times n(S_2) \times \cdots" />
                  </div>
                  <p className="font-body text-xs text-cyan-200/60 text-center -mt-1">{t.sub2Multiply}</p>
                </div>

                {/* TWO COINS */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.twoCoinTitle}</p>
                  <p className="font-body text-xs text-white/70">
                    {language === "id"
                      ? <>{coinHLabel} ({coinH}) {language === "id" ? "atau" : "or"} {coinTLabel} ({coinT}), jadi: <InlineMath math="n(S) = 2 \times 2 = 4" /></>
                      : language === "en"
                      ? <>Each coin has 2 outcomes ({coinH} or {coinT}), so: <InlineMath math="n(S) = 2 \times 2 = 4" /></>
                      : <>各コインに2通り（{coinH} または {coinT}）あるので：<InlineMath math="n(S) = 2 \times 2 = 4" /></>}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse mx-auto">
                      <thead>
                        <tr>
                          <th className="border border-cyan-500/30 bg-cyan-900/50 px-4 py-2 text-cyan-200">
                            {t.coin1} \ {t.coin2}
                          </th>
                          <th className="border border-cyan-500/30 bg-cyan-900/50 px-4 py-2 text-cyan-200">{coinH}</th>
                          <th className="border border-cyan-500/30 bg-cyan-900/50 px-4 py-2 text-cyan-200">{coinT}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[[coinH, `${coinH}${coinH}`, `${coinH}${coinT}`], [coinT, `${coinT}${coinH}`, `${coinT}${coinT}`]].map(([row, c1, c2], i) => (
                          <tr key={i}>
                            <td className="border border-cyan-500/30 bg-cyan-900/30 px-4 py-2 font-bold text-cyan-200 text-center">{row}</td>
                            <td className="border border-white/10 px-4 py-2 text-white text-center bg-white/5">{c1}</td>
                            <td className="border border-white/10 px-4 py-2 text-white text-center">{c2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-lg p-3">
                    <BlockMath math={twoCoinS} />
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* THREE COINS */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.threeCoinTitle}</p>
                  <p className="font-body text-xs text-white/70">
                    {language === "id"
                      ? <><InlineMath math="n(S) = 2 \times 2 \times 2 = 8" /> — gunakan diagram pohon untuk mendaftarnya:</>
                      : language === "en"
                      ? <><InlineMath math="n(S) = 2 \times 2 \times 2 = 8" /> — use a tree diagram to list all outcomes:</>
                      : <><InlineMath math="n(S) = 2 \times 2 \times 2 = 8" /> — 樹形図を使ってすべての結果を列挙します：</>}
                  </p>
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4">
                    <p className="font-body text-xs font-bold text-violet-300 mb-3">{t.treeDiagram}</p>
                    <div className="grid grid-cols-4 gap-1 text-xs font-body text-center">
                      <div className="text-violet-300 font-bold text-left pl-1">{t.coin1}</div>
                      <div className="text-violet-300 font-bold">{t.coin2}</div>
                      <div className="text-violet-300 font-bold">{t.coin3}</div>
                      <div className="text-violet-300 font-bold">{t.hasil}</div>
                      {[
                        [coinH, coinH, coinH, `${coinH}${coinH}${coinH}`],
                        ["",    "",    coinT, `${coinH}${coinH}${coinT}`],
                        ["",    coinT, coinH, `${coinH}${coinT}${coinH}`],
                        ["",    "",    coinT, `${coinH}${coinT}${coinT}`],
                        [coinT, coinH, coinH, `${coinT}${coinH}${coinH}`],
                        ["",    "",    coinT, `${coinT}${coinH}${coinT}`],
                        ["",    coinT, coinH, `${coinT}${coinT}${coinH}`],
                        ["",    "",    coinT, `${coinT}${coinT}${coinT}`],
                      ].map(([k1, k2, k3, hasil], i) => (
                        <React.Fragment key={i}>
                          <div className={`py-1 text-left pl-1 ${k1 ? "text-yellow-300 font-bold" : "text-white/20"}`}>{k1 || "│"}</div>
                          <div className={`py-1 ${k2 ? "text-amber-300 font-bold" : "text-white/20"}`}>{k2 || "│"}</div>
                          <div className="py-1 text-orange-300 font-bold">{k3}</div>
                          <div className="py-1 text-white bg-white/5 rounded">{hasil}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-lg p-3">
                    <BlockMath math={threeCoinS} />
                    <BlockMath math="n(S) = 8" />
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* TWO DICE */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.twoDieTitle}</p>
                  <p className="font-body text-xs text-white/70">
                    {language === "id"
                      ? <>Setiap dadu punya 6 sisi, jadi: <InlineMath math="n(S) = 6 \times 6 = 36" /></>
                      : language === "en"
                      ? <>Each die has 6 faces, so: <InlineMath math="n(S) = 6 \times 6 = 36" /></>
                      : <>各サイコロに6つの面があるので：<InlineMath math="n(S) = 6 \times 6 = 36" /></>}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-blue-500/30 bg-blue-900/50 px-2 py-2 text-blue-200">
                            {language === "id" ? "D1\\D2" : language === "en" ? "D1\\D2" : "D1\\D2"}
                          </th>
                          {[1,2,3,4,5,6].map(n => (
                            <th key={n} className="border border-blue-500/30 bg-blue-900/50 px-2 py-2 text-blue-200">{n}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[1,2,3,4,5,6].map((d1) => (
                          <tr key={d1}>
                            <td className="border border-blue-500/30 bg-blue-900/30 px-2 py-2 font-bold text-blue-200 text-center">{d1}</td>
                            {[1,2,3,4,5,6].map((d2) => {
                              const jumlah = d1 + d2;
                              const isHighlight = jumlah === 7;
                              return (
                                <td key={d2} className={`border border-white/10 px-2 py-2 text-center ${isHighlight ? "bg-yellow-600/30 text-yellow-200 font-bold" : "bg-white/3 text-white/70"}`}>
                                  ({d1},{d2})
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-yellow-300 text-center">{t.sumHighlight}</p>
                  <div className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-3">
                    <BlockMath math={`n(S) = 36\\,${kPasanganTerurut}`} />
                    <p className="font-body text-xs text-white/60 text-center">{t.orderedPairNote}</p>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* COIN + DIE */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.coinDieTitle}</p>
                  <p className="font-body text-xs text-white/70">
                    {language === "id"
                      ? <>Koin punya 2 kemungkinan, dadu punya 6: <InlineMath math="n(S) = 2 \times 6 = 12" /></>
                      : language === "en"
                      ? <>Coin has 2 outcomes, die has 6: <InlineMath math="n(S) = 2 \times 6 = 12" /></>
                      : <>コインは2通り、サイコロは6通り：<InlineMath math="n(S) = 2 \times 6 = 12" /></>}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse mx-auto">
                      <thead>
                        <tr>
                          <th className="border border-teal-500/30 bg-teal-900/50 px-3 py-2 text-teal-200">{t.coinDieHeader}</th>
                          {[1,2,3,4,5,6].map(n => (
                            <th key={n} className="border border-teal-500/30 bg-teal-900/50 px-3 py-2 text-teal-200">{n}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[coinH, coinT].map((k, i) => (
                          <tr key={k}>
                            <td className="border border-teal-500/30 bg-teal-900/30 px-3 py-2 font-bold text-teal-200 text-center">{k}</td>
                            {[1,2,3,4,5,6].map((d) => (
                              <td key={d} className={`border border-white/10 px-3 py-2 text-center ${i===0 ? "bg-yellow-900/20 text-yellow-200" : "bg-emerald-900/20 text-emerald-200"}`}>
                                ({k},{d})
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-800/60 border border-teal-500/20 rounded-lg p-3">
                    <BlockMath math={`S = \\{(${coinH},1),(${coinH},2),(${coinH},3),(${coinH},4),(${coinH},5),(${coinH},6),(${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6)\\}`} />
                    <BlockMath math="n(S) = 12" />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 2 ──────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2a" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title={t.contoh2Title} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — EASY */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.mudah} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {language === "id"
                        ? <>Dua uang koin dilempar bersamaan satu kali. Tentukan:<br />a. <InlineMath math="n(S)" /><br />b. Kejadian <InlineMath math="K" /> = muncul tepat satu sisi Angka, serta <InlineMath math="n(K)" /></>
                        : language === "en"
                        ? <>Two coins are tossed together once. Determine:<br />a. <InlineMath math="n(S)" /><br />b. Event <InlineMath math="K" /> = exactly one Heads appears, and <InlineMath math="n(K)" /></>
                        : <>コインを2枚同時に1回投げる。次を求めよ：<br />a. <InlineMath math="n(S)" /><br />b. 事象 <InlineMath math="K" /> = ちょうど1枚表が出る、および <InlineMath math="n(K)" /></>}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.pembahasan}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id" ? "a. Ruang sampel dua koin:" : language === "en" ? "a. Sample space for two coins:" : "a. 2枚のコインの標本空間："}
                      </p>
                      <BlockMath math={twoCoinS} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? `b. Tepat satu Angka artinya hanya satu koin menunjukkan ${coinH}:`
                          : language === "en"
                          ? `b. Exactly one Heads means only one coin shows ${coinH}:`
                          : `b. ちょうど1枚表（${coinH}）が出る場合：`}
                      </p>
                      <BlockMath math={`K = \\{${coinH}${coinT},\\; ${coinT}${coinH}\\},\\quad n(K) = 2`} />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">
                        {language === "id"
                          ? `🔑 ${coinH}${coinH} bukan karena ada DUA angka. ${coinT}${coinT} bukan karena tidak ada angka sama sekali.`
                          : language === "en"
                          ? `🔑 ${coinH}${coinH} is excluded (two Heads). ${coinT}${coinT} is excluded (no Heads).`
                          : `🔑 ${coinH}${coinH} は表が2枚なので除外。${coinT}${coinT} は表がないので除外。`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — MEDIUM */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.sedang} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {language === "id"
                        ? <>Dua buah dadu dilempar bersamaan. Tentukan <InlineMath math="n(S)" /> dan <InlineMath math="n(K)" /> untuk kejadian <InlineMath math="K" /> = jumlah kedua mata dadu sama dengan 8.</>
                        : language === "en"
                        ? <>Two dice are rolled together. Find <InlineMath math="n(S)" /> and <InlineMath math="n(K)" /> for event <InlineMath math="K" /> = the sum of both dice equals 8.</>
                        : <>サイコロを2つ同時に振る。<InlineMath math="n(S)" /> と事象 <InlineMath math="K" /> = 2つのサイコロの目の和が8 の <InlineMath math="n(K)" /> を求めよ。</>}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.pembahasan}</p>
                    <BlockMath math="n(S) = 6 \times 6 = 36" />
                    <p className="font-body text-sm text-white/80">
                      {language === "id"
                        ? "Cari semua pasangan (d1, d2) yang jumlahnya = 8:"
                        : language === "en"
                        ? "Find all pairs (d1, d2) whose sum = 8:"
                        : "和が8になるすべての組み合わせ (d1, d2) を探す："}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="text-xs font-body border-collapse mx-auto">
                        <thead>
                          <tr className="bg-yellow-900/40">
                            <th className="border border-yellow-500/30 px-3 py-1.5 text-yellow-200">
                              {language === "id" ? "Pasangan (d1, d2)" : language === "en" ? "Pair (d1, d2)" : "組み合わせ (d1, d2)"}
                            </th>
                            <th className="border border-yellow-500/30 px-3 py-1.5 text-yellow-200">
                              {language === "id" ? "Jumlah" : language === "en" ? "Sum" : "和"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[["(2, 6)", 8], ["(3, 5)", 8], ["(4, 4)", 8], ["(5, 3)", 8], ["(6, 2)", 8]].map(([p, j], i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                              <td className="border border-white/10 px-3 py-1.5 text-white text-center">{p}</td>
                              <td className="border border-white/10 px-3 py-1.5 text-yellow-300 font-bold text-center">{j}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <BlockMath math="K = \{(2,6),\;(3,5),\;(4,4),\;(5,3),\;(6,2)\},\quad n(K) = 5" />
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">
                        {language === "id"
                          ? "💡 Ingat: (2,6) dan (6,2) adalah pasangan yang <em>berbeda</em> karena dadu pertama dan kedua dibedakan!"
                          : language === "en"
                          ? "💡 Note: (2,6) and (6,2) are different pairs because the dice are distinguishable!"
                          : "💡 注意：(2,6) と (6,2) はサイコロが区別されるので異なる組み合わせです！"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — HARD */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.sulit} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {language === "id"
                        ? <>Sebuah koin dan sebuah dadu dilempar bersamaan. Tentukan <InlineMath math="n(S)" /> dan <InlineMath math="n(K)" /> untuk:<br />a. <InlineMath math="K_1" /> = muncul Angka dan bilangan genap<br />b. <InlineMath math="K_2" /> = muncul Gambar dan bilangan lebih dari 3<br />c. <InlineMath math="K_3" /> = muncul Gambar atau bilangan prima</>
                        : language === "en"
                        ? <>A coin and a die are tossed together. Find <InlineMath math="n(S)" /> and <InlineMath math="n(K)" /> for:<br />a. <InlineMath math="K_1" /> = Heads AND an even number<br />b. <InlineMath math="K_2" /> = Tails AND a number greater than 3<br />c. <InlineMath math="K_3" /> = Tails OR a prime number</>
                        : <>コインとサイコロを同時に投げる。<InlineMath math="n(S)" /> と次の事象の <InlineMath math="n(K)" /> を求めよ：<br />a. <InlineMath math="K_1" /> = 表かつ偶数<br />b. <InlineMath math="K_2" /> = 裏かつ3より大きい数<br />c. <InlineMath math="K_3" /> = 裏または素数</>}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.pembahasan}</p>
                    <BlockMath math="n(S) = 2 \times 6 = 12" />
                    <p className="font-body text-sm text-white/80">
                      {language === "id"
                        ? `Ruang sampel: {(${coinH},1),(${coinH},2),(${coinH},3),(${coinH},4),(${coinH},5),(${coinH},6),(${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6)}`
                        : language === "en"
                        ? `Sample space: {(${coinH},1),(${coinH},2),(${coinH},3),(${coinH},4),(${coinH},5),(${coinH},6),(${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6)}`
                        : `標本空間：{(${coinH},1),(${coinH},2),(${coinH},3),(${coinH},4),(${coinH},5),(${coinH},6),(${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6)}`}
                    </p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? `a. ${coinHLabel} DAN genap (bilangan genap: 2, 4, 6):`
                          : language === "en"
                          ? `a. Heads AND even (even numbers: 2, 4, 6):`
                          : `a. 表かつ偶数（偶数：2, 4, 6）：`}
                      </p>
                      <BlockMath math={`K_1 = \\{(${coinH},2),\\;(${coinH},4),\\;(${coinH},6)\\},\\quad n(K_1) = 3`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? `b. ${coinTLabel} DAN lebih dari 3 (yaitu 4, 5, 6):`
                          : language === "en"
                          ? `b. Tails AND greater than 3 (i.e. 4, 5, 6):`
                          : `b. 裏かつ3より大きい（4, 5, 6）：`}
                      </p>
                      <BlockMath math={`K_2 = \\{(${coinT},4),\\;(${coinT},5),\\;(${coinT},6)\\},\\quad n(K_2) = 3`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">
                        {language === "id"
                          ? `c. ${coinTLabel} ATAU prima (prima: 2, 3, 5). Hitung dengan metode gabungan:`
                          : language === "en"
                          ? `c. Tails OR prime (primes: 2, 3, 5). Use the union method:`
                          : `c. 裏または素数（素数：2, 3, 5）。和集合の方法で計算：`}
                      </p>
                      <p className="font-body text-xs text-white/60 mb-1">
                        {language === "id"
                          ? `${coinTLabel}: (${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6) → 6 pasangan`
                          : language === "en"
                          ? `Tails: (${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6) → 6 pairs`
                          : `裏：(${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6) → 6通り`}
                      </p>
                      <p className="font-body text-xs text-white/60 mb-1">
                        {language === "id"
                          ? `Prima tapi BUKAN ${coinTLabel}: (${coinH},2),(${coinH},3),(${coinH},5) → 3 pasangan`
                          : language === "en"
                          ? `Prime but NOT Tails: (${coinH},2),(${coinH},3),(${coinH},5) → 3 pairs`
                          : `素数かつ裏でない：(${coinH},2),(${coinH},3),(${coinH},5) → 3通り`}
                      </p>
                      <BlockMath math={`K_3 = \\{(${coinT},1),(${coinT},2),(${coinT},3),(${coinT},4),(${coinT},5),(${coinT},6),(${coinH},2),(${coinH},3),(${coinH},5)\\}`} />
                      <BlockMath math="n(K_3) = 9" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">
                        {language === "id"
                          ? `⚠️ Kata "ATAU" berarti salah satu atau keduanya terpenuhi. Hindari menghitung (${coinT},2), (${coinT},3), (${coinT},5) dua kali!`
                          : language === "en"
                          ? `⚠️ "OR" means at least one condition holds. Avoid counting (${coinT},2), (${coinT},3), (${coinT},5) twice!`
                          : `⚠️ 「または」は少なくとも一方が成り立つことを意味します。(${coinT},2), (${coinT},3), (${coinT},5) を二重に数えないよう注意！`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN TABLE ──────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.rangkumanTitle} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-violet-900/50">
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">{t.percobaan}</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200">n(S)</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">{t.caraMenghitung}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRows.map(([perc, ns, cara], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-white">{perc}</td>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{ns}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{cara}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">{t.rumusKunci}</p>
                  <BlockMath math={`n(S_{${kMajemuk}}) = n(S_1) \\times n(S_2) \\times \\cdots \\times n(S_k)`} />
                  <p className="font-body text-xs text-white/70 text-center">{t.rumusNote}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-1">
                  <p className="font-body text-sm font-bold text-yellow-300">{t.checklist}</p>
                  {checklistItems.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400 shrink-0">▸</span>
                      <p className="font-body text-xs text-white/80">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        <RangkumanSection
          gradientFrom="from-cyan-900"
          gradientVia="via-teal-900"
          gradientTo="to-emerald-900"
          borderColor="border-cyan-500/40"
          accentColor="text-cyan-300"
          headerIcon="🎲"
          judul={language === "id" ? "Rangkuman — Ruang Sampel & Kejadian" : language === "en" ? "Summary — Sample Space & Events" : "まとめ — 標本空間と事象"}
          subjudul={language === "id"
            ? "Fondasi peluang — pahami dulu semua kemungkinan sebelum menghitung peluang!"
            : language === "en"
            ? "The foundation of probability — understand all possibilities before calculating!"
            : "確率の基礎 — 確率を計算する前に、まずすべての場合を把握しよう！"}
          ringkasan={[
            {
              emoji: "🌐",
              judul: language === "id" ? "Ruang Sampel (S)" : language === "en" ? "Sample Space (S)" : "標本空間 (S)",
              isi: language === "id"
                ? "Himpunan semua kemungkinan hasil yang dapat terjadi dalam suatu percobaan. Ditulis dalam kurung kurawal {}. n(S) = banyaknya anggota ruang sampel."
                : language === "en"
                ? "The set of all possible outcomes of an experiment. Written in curly braces {}. n(S) = the number of elements in the sample space."
                : "ある試行で起こりうるすべての結果の集合。波括弧 {} で表す。n(S) = 標本空間の要素の個数。",
              bg: "bg-cyan-900/50",
              border: "border-cyan-500/40",
              textColor: "text-cyan-200",
            },
            {
              emoji: "📍",
              judul: language === "id" ? "Titik Sampel" : language === "en" ? "Sample Point" : "標本点",
              isi: language === "id"
                ? "Setiap anggota dari ruang sampel disebut titik sampel. Contoh: pada pelemparan dadu, setiap angka (1,2,3,4,5,6) adalah satu titik sampel."
                : language === "en"
                ? "Each element of the sample space is called a sample point. Example: when rolling a die, each number (1,2,3,4,5,6) is one sample point."
                : "標本空間の各要素を標本点という。例：サイコロを振るとき、各目（1,2,3,4,5,6）が1つの標本点。",
              bg: "bg-teal-900/50",
              border: "border-teal-500/40",
              textColor: "text-teal-200",
            },
            {
              emoji: "🎯",
              judul: language === "id" ? "Kejadian (K)" : language === "en" ? "Event (K)" : "事象 (K)",
              isi: language === "id"
                ? "Himpunan bagian dari ruang sampel yang memenuhi syarat tertentu. n(K) = banyak titik sampel yang memenuhi kejadian tersebut."
                : language === "en"
                ? "A subset of the sample space satisfying certain conditions. n(K) = the number of sample points satisfying that event."
                : "特定の条件を満たす標本空間の部分集合。n(K) = その事象を満たす標本点の個数。",
              bg: "bg-emerald-900/50",
              border: "border-emerald-500/40",
              textColor: "text-emerald-200",
            },
            {
              emoji: "🗂️",
              judul: language === "id" ? "Tabel & Diagram Pohon" : language === "en" ? "Table & Tree Diagram" : "表と樹形図",
              isi: language === "id"
                ? "Untuk percobaan majemuk (dua atau lebih), gunakan tabel silang atau diagram pohon agar semua kemungkinan tercatat dengan sistematis dan tidak ada yang terlewat."
                : language === "en"
                ? "For compound experiments (two or more), use a cross table or tree diagram to systematically record all possibilities without missing any."
                : "複合試行（2つ以上）では、クロス表または樹形図を使って、すべての可能性を漏れなく体系的に記録します。",
              bg: "bg-green-900/50",
              border: "border-green-500/40",
              textColor: "text-green-200",
            },
          ]}
          rumus={[
            {
              label: language === "id" ? "Ruang Sampel Pelemparan n Dadu" : language === "en" ? "Sample Space for n Dice" : "n個のサイコロの標本空間",
              rumus: "n(S) = 6^n",
              bg: "bg-cyan-900/60",
              border: "border-cyan-400/40",
              labelColor: "text-cyan-300",
            },
            {
              label: language === "id" ? "Ruang Sampel Pelemparan n Koin" : language === "en" ? "Sample Space for n Coins" : "n枚のコインの標本空間",
              rumus: "n(S) = 2^n",
              bg: "bg-teal-900/60",
              border: "border-teal-400/40",
              labelColor: "text-teal-300",
            },
          ]}
          tips={language === "id" ? [
            { emoji: "💡", teks: "Ruang sampel selalu ditulis dalam kurung kurawal {}, sama seperti himpunan. Pastikan semua kemungkinan tercantum dan tidak ada yang berulang!" },
            { emoji: "🎯", teks: "Untuk dua percobaan sekaligus (misal 2 dadu), gunakan tabel silang — baris = dadu 1, kolom = dadu 2. Total kotak = n(S)." },
            { emoji: "🌳", teks: "Diagram pohon sangat membantu untuk percobaan berantai (koin+dadu, ambil 2 bola, dll). Hitung semua cabang ujung untuk mendapat n(S)." },
            { emoji: "🃏", teks: "Kartu bridge: n(S) = 52. Terdiri dari 4 jenis (hati, wajik, keriting, sekop) masing-masing 13 kartu (As, 2-10, J, Q, K)." },
          ] : language === "en" ? [
            { emoji: "💡", teks: "The sample space is always written in curly braces {}, just like a set. Make sure all outcomes are listed and none are repeated!" },
            { emoji: "🎯", teks: "For two simultaneous experiments (e.g. 2 dice), use a cross table — rows = die 1, columns = die 2. Total cells = n(S)." },
            { emoji: "🌳", teks: "A tree diagram is very helpful for sequential experiments (coin+die, drawing 2 balls, etc.). Count all leaf branches to get n(S)." },
            { emoji: "🃏", teks: "Standard deck: n(S) = 52. Contains 4 suits (Hearts, Diamonds, Clubs, Spades) each with 13 cards (Ace, 2–10, J, Q, K)." },
          ] : [
            { emoji: "💡", teks: "標本空間は集合と同様に常に波括弧 {} で表します。すべての結果を列挙し、重複がないことを確認しましょう！" },
            { emoji: "🎯", teks: "2つの試行（例：サイコロ2個）では、クロス表を使います。行=サイコロ1、列=サイコロ2。セルの総数=n(S)。" },
            { emoji: "🌳", teks: "樹形図は連続した試行（コイン+サイコロ、2個取り出しなど）に非常に役立ちます。末端の枝の数がn(S)になります。" },
            { emoji: "🃏", teks: "トランプ：n(S)=52。4スート（ハート・ダイヤ・クラブ・スペード）各13枚（A, 2〜10, J, Q, K）からなります。" },
          ]}
          kesimpulan={language === "id"
            ? "Ruang sampel adalah peta lengkap semua kemungkinan — tanpa memahami ruang sampel, tidak mungkin menghitung peluang dengan benar. Pahami dulu seluruh kemungkinan, baru tentukan kejadian yang diinginkan. Inilah dasar logika peluang yang digunakan di kriptografi, AI, dan analisis risiko!"
            : language === "en"
            ? "The sample space is the complete map of all possibilities — without understanding the sample space, it's impossible to calculate probability correctly. First understand all possibilities, then identify the desired event. This is the logical foundation of probability used in cryptography, AI, and risk analysis!"
            : "標本空間はすべての可能性の完全な地図です。標本空間を理解しなければ、確率を正しく計算することはできません。まずすべての可能性を把握し、次に求める事象を特定しましょう。これは暗号理論・AI・リスク分析で使われる確率論の基本です！"}
          kesimpulanBg="bg-gradient-to-r from-cyan-900/80 to-teal-900/80"
          kesimpulanBorder="border-cyan-400/50"
          kesimpulanTextColor="text-cyan-100"
        />

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.backButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuangSampelPage;
