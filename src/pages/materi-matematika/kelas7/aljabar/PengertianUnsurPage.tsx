import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    title: "PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Kenapa Matematika Pakai Huruf?",
    introPara1: "Bayangkan kamu punya 3 kantong, dan setiap kantong berisi sejumlah uang yang sama — tapi kamu belum tahu berapa isinya. Gimana cara nulisnya? Di sinilah",
    introPara1b: "masuk!",
    introPara1strong: "aljabar",
    introBox: "Misalnya, isi tiap kantong kita sebut",
    introBoxMid: "rupiah. Maka total uang dari 3 kantong adalah",
    introBoxEnd: "rupiah. Bentuk",
    introBoxEnd2: "inilah yang disebut",
    introBoxEnd3: "bentuk aljabar",
    introPara2a: "Kata "aljabar" sendiri berasal dari karya ilmuwan muslim bernama",
    introPara2b: "(780–850 M). Beliau menulis buku berjudul",
    introPara2c: "yang menjadi fondasi ilmu aljabar modern.",

    konsepTitle: "Ringkasan Intisari: Unsur-Unsur Aljabar",
    konsepPara: "Sebuah bentuk aljabar tersusun dari beberapa unsur penting. Mari kenali satu per satu!",
    konsepBoxTitle: "Unsur-Unsur Bentuk Aljabar:",
    variabel: "Variabel (Peubah):",
    variabelDesc: "Simbol huruf yang mewakili bilangan yang belum diketahui. Contoh:",
    koefisien: "Koefisien:",
    koefisienDesc: "Bilangan yang dikalikan dengan variabel. Pada",
    koefisienDesc2: ", koefisiennya adalah",
    konstanta: "Konstanta:",
    konstantaDesc: "Bilangan tetap tanpa variabel. Pada",
    konstantaDesc2: ", konstantanya adalah",
    suku: "Suku:",
    sukuDesc: "Bagian dari bentuk aljabar yang dipisahkan oleh tanda + atau −.",
    jenisSuku: "Jenis-Jenis Suku:",
    sukuSatu: "Suku satu (monomial):",
    sukuDua: "Suku dua (binom):",
    sukuTiga: "Suku tiga (trinom):",
    sukuBanyak: "Suku banyak (polinom):",
    sukuBanyakDesc: "bentuk aljabar dengan lebih dari tiga suku.",
    sukuSejenis: "Suku Sejenis:",
    sukuSejenisDesc: "Dua suku disebut sejenis jika memiliki variabel",
    sukuSejenisDesc2: "dan pangkat",
    sukuSejenisDesc3: "yang sama. Hanya koefisiennya yang boleh berbeda.",
    sejenis: "sejenis ✓",
    tidakSejenis: "tidak sejenis ✗",
    tidakSejenisNote: "(pangkat y berbeda)",
    tips: "Tips:",
    tipsDesc: "Suku sejenis itu seperti "keluarga" — boleh beda nama (koefisien), tapi harus punya "silsilah" variabel yang sama persis!",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",

    ex1Q: "Pada bentuk aljabar",
    ex1Q2: ", tentukan: koefisien",
    ex1Q3: ", koefisien",
    ex1Q4: ", konstanta, dan jumlah sukunya!",
    ex1S1: "Identifikasi setiap suku →",
    ex1S1b: "dan",
    ex1S2: "Temukan masing-masing unsur:",
    ex1Koef: "Koefisien",
    ex1Kons: "Konstanta",
    ex1Jml: "Jumlah suku",
    ex1JmlVal: "3 (suku tiga / trinom)",

    ex2Q: "Dari bentuk aljabar",
    ex2Q2: ", kelompokkan suku-suku yang sejenis!",
    ex2S1: "Daftarkan semua suku:",
    ex2S2: "Cari pasangan yang variabel dan pangkatnya sama:",
    ex2Dan: "dan",
    ex2Sejenis: "sejenis",
    ex2SamaX2: "(sama-sama",
    ex2TidakSejenis: "tidak sejenis",

    ex3Q: "Sebuah toko menjual pensil seharga",
    ex3Q2: "rupiah per batang dan buku seharga",
    ex3Q3: "rupiah per buah. Alex membeli 5 pensil dan 3 buku, lalu Sam membeli 2 pensil dan 7 buku. Nyatakan total belanja Alex dan Sam dalam bentuk aljabar! Identifikasi koefisien, variabel, dan konstantanya.",
    ex3S1: "Susun bentuk aljabar untuk masing-masing:",
    ex3Alex: "Belanja Alex",
    ex3Sam: "Belanja Sam",
    ex3S2: "Total belanja keduanya:",
    ex3S3: "Identifikasi unsur dari",
    ex3Variabel: "Variabel:",
    ex3KoefP: "Koefisien",
    ex3KoefQ: "Koefisien",
    ex3Kons: "Konstanta:",
    ex3KonsVal: "tidak ada",
    ex3Jenis: "Jenis:",
    ex3JenisVal: "suku dua (binom)",
  },
  en: {
    title: "UNDERSTANDING ALGEBRAIC EXPRESSIONS AND THEIR ELEMENTS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "Why Does Math Use Letters?",
    introPara1: "Imagine you have 3 bags, each containing the same amount of money — but you don't know how much. How would you write it? That's where",
    introPara1b: "comes in!",
    introPara1strong: "algebra",
    introBox: "For example, let's call the amount in each bag",
    introBoxMid: "dollars. The total money from 3 bags is",
    introBoxEnd: "dollars. The expression",
    introBoxEnd2: "is called an",
    introBoxEnd3: "algebraic expression",
    introPara2a: "The word "algebra" comes from the work of a Muslim scholar named",
    introPara2b: "(780–850 AD). He wrote a book titled",
    introPara2c: "which became the foundation of modern algebra.",

    konsepTitle: "Key Summary: Elements of an Algebraic Expression",
    konsepPara: "An algebraic expression is made up of several important elements. Let's learn them one by one!",
    konsepBoxTitle: "Elements of an Algebraic Expression:",
    variabel: "Variable:",
    variabelDesc: "A letter symbol representing an unknown number. Example:",
    koefisien: "Coefficient:",
    koefisienDesc: "The number multiplied by a variable. In",
    koefisienDesc2: ", the coefficient is",
    konstanta: "Constant:",
    konstantaDesc: "A fixed number with no variable. In",
    konstantaDesc2: ", the constant is",
    suku: "Term:",
    sukuDesc: "A part of an algebraic expression separated by + or − signs.",
    jenisSuku: "Types of Terms:",
    sukuSatu: "Single term (monomial):",
    sukuDua: "Two-term (binomial):",
    sukuTiga: "Three-term (trinomial):",
    sukuBanyak: "Many terms (polynomial):",
    sukuBanyakDesc: "an algebraic expression with more than three terms.",
    sukuSejenis: "Like Terms:",
    sukuSejenisDesc: "Two terms are called like terms if they have the same variable",
    sukuSejenisDesc2: "and exponent",
    sukuSejenisDesc3: ". Only the coefficients may differ.",
    sejenis: "like terms ✓",
    tidakSejenis: "unlike terms ✗",
    tidakSejenisNote: "(different exponent of y)",
    tips: "Tips:",
    tipsDesc: "Like terms are like a "family" — the names (coefficients) can differ, but they must share the exact same variable "lineage"!",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",

    ex1Q: "In the algebraic expression",
    ex1Q2: ", find: the coefficient of",
    ex1Q3: ", the coefficient of",
    ex1Q4: ", the constant, and the number of terms!",
    ex1S1: "Identify each term →",
    ex1S1b: "and",
    ex1S2: "Find each element:",
    ex1Koef: "Coefficient of",
    ex1Kons: "Constant",
    ex1Jml: "Number of terms",
    ex1JmlVal: "3 (trinomial)",

    ex2Q: "From the algebraic expression",
    ex2Q2: ", group the like terms!",
    ex2S1: "List all terms:",
    ex2S2: "Find pairs with the same variable and exponent:",
    ex2Dan: "and",
    ex2Sejenis: "like terms",
    ex2SamaX2: "(both are",
    ex2TidakSejenis: "unlike terms",

    ex3Q: "A store sells pencils for $",
    ex3Q2: "per pencil and books for $",
    ex3Q3: "per book. Alex buys 5 pencils and 3 books, and Sam buys 2 pencils and 7 books. Express the total spending of Alex and Sam in algebraic form! Identify the coefficients, variables, and constants.",
    ex3S1: "Write the algebraic expression for each:",
    ex3Alex: "Alex's spending",
    ex3Sam: "Sam's spending",
    ex3S2: "Total spending for both:",
    ex3S3: "Identify the elements of",
    ex3Variabel: "Variables:",
    ex3KoefP: "Coefficient of",
    ex3KoefQ: "Coefficient of",
    ex3Kons: "Constant:",
    ex3KonsVal: "none",
    ex3Jenis: "Type:",
    ex3JenisVal: "two-term (binomial)",
  },
  ja: {
    title: "代数式とその要素の理解",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "なぜ数学は文字を使うの？",
    introPara1: "3つの袋があって、それぞれに同じ金額が入っているとします — でも、いくら入っているかわかりません。どう書けばいいでしょう？そこで登場するのが",
    introPara1b: "です！",
    introPara1strong: "代数",
    introBox: "例えば、各袋の金額を",
    introBoxMid: "ドルとします。3つの袋の合計金額は",
    introBoxEnd: "ドルです。この",
    introBoxEnd2: "という式が",
    introBoxEnd3: "代数式",
    introPara2a: "「代数」という言葉は、イスラム学者",
    introPara2b: "（780〜850年）の著作に由来します。彼は",
    introPara2c: "という本を書き、それが現代代数学の基礎となりました。",

    konsepTitle: "要点まとめ：代数式の要素",
    konsepPara: "代数式はいくつかの重要な要素で構成されています。一つずつ確認しましょう！",
    konsepBoxTitle: "代数式の要素：",
    variabel: "変数：",
    variabelDesc: "未知の数を表す文字記号。例：",
    koefisien: "係数：",
    koefisienDesc: "変数にかけられる数。",
    koefisienDesc2: "の係数は",
    konstanta: "定数：",
    konstantaDesc: "変数を含まない固定の数。",
    konstantaDesc2: "の定数は",
    suku: "項：",
    sukuDesc: "+ または − で区切られた代数式の各部分。",
    jenisSuku: "項の種類：",
    sukuSatu: "1項式（単項式）：",
    sukuDua: "2項式（二項式）：",
    sukuTiga: "3項式（三項式）：",
    sukuBanyak: "多項式（ポリノミアル）：",
    sukuBanyakDesc: "3項より多い代数式。",
    sukuSejenis: "同類項：",
    sukuSejenisDesc: "同じ変数",
    sukuSejenisDesc2: "と指数",
    sukuSejenisDesc3: "を持つ2つの項を同類項といいます。係数だけが異なっても構いません。",
    sejenis: "同類項 ✓",
    tidakSejenis: "異類項 ✗",
    tidakSejenisNote: "（yの指数が異なる）",
    tips: "ヒント：",
    tipsDesc: "同類項は「家族」のようなもの — 名前（係数）が違っても、変数の「系統」が完全に同じでなければなりません！",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",

    ex1Q: "代数式",
    ex1Q2: "において、",
    ex1Q3: "の係数、",
    ex1Q4: "の係数、定数、および項の数を求めなさい！",
    ex1S1: "各項を確認する →",
    ex1S1b: "と",
    ex1S2: "各要素を見つける：",
    ex1Koef: "の係数",
    ex1Kons: "定数",
    ex1Jml: "項の数",
    ex1JmlVal: "3（三項式）",

    ex2Q: "代数式",
    ex2Q2: "から同類項をグループ分けしなさい！",
    ex2S1: "すべての項を列挙する：",
    ex2S2: "変数と指数が同じペアを探す：",
    ex2Dan: "と",
    ex2Sejenis: "同類項",
    ex2SamaX2: "（どちらも",
    ex2TidakSejenis: "異類項",

    ex3Q: "あるお店では、鉛筆を1本$",
    ex3Q2: "、本を1冊$",
    ex3Q3: "で販売しています。Alexは鉛筆5本と本3冊を、Samは鉛筆2本と本7冊を買いました。AlexとSamの合計金額を代数式で表し、係数・変数・定数を特定してください。",
    ex3S1: "それぞれの代数式を立てる：",
    ex3Alex: "Alexの購入金額",
    ex3Sam: "Samの購入金額",
    ex3S2: "2人の合計金額：",
    ex3S3: "の要素を特定する：",
    ex3Variabel: "変数：",
    ex3KoefP: "の係数",
    ex3KoefQ: "の係数",
    ex3Kons: "定数：",
    ex3KonsVal: "なし",
    ex3Jenis: "種類：",
    ex3JenisVal: "2項式（二項式）",
  },
};

const PengertianUnsurPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.subtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Intro */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introPara1} <strong className="text-primary">{t.introPara1strong}</strong> {t.introPara1b}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.introBox} <InlineMath math="x" /> {t.introBoxMid} <InlineMath math="x + x + x = 3x" /> {t.introBoxEnd} <InlineMath math="3x" /> {t.introBoxEnd2} <strong>{t.introBoxEnd3}</strong>.
                  </p>
                </div>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introPara2a} <strong className="text-primary">Al-Khawarizmi</strong> {t.introPara2b} <em>al-jabr wal-muqabalah</em> {t.introPara2c}
                </p>
              </div>
            )}
          </div>

          {/* Konsep */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.konsepTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.konsepPara}</p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.konsepBoxTitle}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong className="text-green-300">{t.variabel}</strong> {t.variabelDesc} <InlineMath math="x, y, a, b" /></p>
                    <p><strong className="text-green-300">{t.koefisien}</strong> {t.koefisienDesc} <InlineMath math="5x" />{t.koefisienDesc2} <InlineMath math="5" />.</p>
                    <p><strong className="text-green-300">{t.konstanta}</strong> {t.konstantaDesc} <InlineMath math="-7x^2y + 3" />{t.konstantaDesc2} <InlineMath math="3" />.</p>
                    <p><strong className="text-green-300">{t.suku}</strong> {t.sukuDesc}</p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.jenisSuku}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{t.sukuSatu}</strong> <InlineMath math="4a,\ 6ab^2,\ -5a^2bc^3" /></p>
                    <p><strong>{t.sukuDua}</strong> <InlineMath math="2p + 15,\ 7p^2 - 10p" /></p>
                    <p><strong>{t.sukuTiga}</strong> <InlineMath math="8x - 4y + 9,\ 6x^2 + 3xy - 5y^2" /></p>
                    <p><strong>{t.sukuBanyak}</strong> {t.sukuBanyakDesc}</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.sukuSejenis}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.sukuSejenisDesc} <strong>{t.sukuSejenisDesc2}</strong> {t.sukuSejenisDesc3}
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2">
                    <p className="font-body text-sm text-white/70"><InlineMath math="12x^2" /> {t.ex2Dan} <InlineMath math="-4x^2" /> → <strong className="text-green-400">{t.sejenis}</strong></p>
                    <p className="font-body text-sm text-white/70 mt-1"><InlineMath math="-9xy" /> {t.ex2Dan} <InlineMath math="7xy^2" /> → <strong className="text-red-400">{t.tidakSejenis}</strong> {t.tidakSejenisNote}</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tips}</strong> {t.tipsDesc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.contohTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - Mudah/Easy/基本 */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                    <span className="font-body font-semibold text-white">{t.example} 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.ex1Q} <InlineMath math="5x^2 - 3x + 7" />{t.ex1Q2} <InlineMath math="x^2" />{t.ex1Q3} <InlineMath math="x" />{t.ex1Q4}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex1S1} <InlineMath math="5x^2" />, <InlineMath math="-3x" />, {t.ex1S1b} <InlineMath math="7" />.</p>
                      <p><strong>{t.step} 2:</strong> {t.ex1S2}</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>{t.ex1Koef} <InlineMath math="x^2" /> = <strong className="text-primary">5</strong></p>
                        <p>{t.ex1Koef} <InlineMath math="x" /> = <strong className="text-primary">-3</strong></p>
                        <p>{t.ex1Kons} = <strong className="text-primary">7</strong></p>
                        <p>{t.ex1Jml} = <strong className="text-primary">{t.ex1JmlVal}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang/Medium/標準 */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                    <span className="font-body font-semibold text-white">{t.example} 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.ex2Q} <InlineMath math="12x^2 - 9xy - 8y + 7xy^2 - 4x^2 + 5xy" />{t.ex2Q2}
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex2S1} <InlineMath math="12x^2,\ -9xy,\ -8y,\ 7xy^2,\ -4x^2,\ 5xy" /></p>
                      <p><strong>{t.step} 2:</strong> {t.ex2S2}</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><InlineMath math="12x^2" /> {t.ex2Dan} <InlineMath math="-4x^2" /> → <strong className="text-green-400">{t.ex2Sejenis}</strong> {t.ex2SamaX2} <InlineMath math="x^2" />)</p>
                        <p><InlineMath math="-9xy" /> {t.ex2Dan} <InlineMath math="5xy" /> → <strong className="text-green-400">{t.ex2Sejenis}</strong> {t.ex2SamaX2} <InlineMath math="xy" />)</p>
                        <p><InlineMath math="-8y" /> {t.ex2Dan} <InlineMath math="7xy^2" /> → <strong className="text-red-400">{t.ex2TidakSejenis}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit/Hard/発展 — Alex & Sam, Rupiah→$ in EN/JA */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                    <span className="font-body font-semibold text-white">{t.example} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.ex3Q}<InlineMath math="p" />{t.ex3Q2}<InlineMath math="q" />{t.ex3Q3}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex3S1}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.ex3Alex} = <InlineMath math="5p + 3q" /></p>
                        <p>{t.ex3Sam} = <InlineMath math="2p + 7q" /></p>
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex3S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(5p + 3q) + (2p + 7q) = 7p + 10q" />
                      </div>
                      <p><strong>{t.step} 3:</strong> {t.ex3S3} <InlineMath math="7p + 10q" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>{t.ex3Variabel} <InlineMath math="p" /> {t.ex2Dan} <InlineMath math="q" /></p>
                        <p>{t.ex3KoefP} <InlineMath math="p" /> = <strong className="text-primary">7</strong></p>
                        <p>{t.ex3KoefQ} <InlineMath math="q" /> = <strong className="text-primary">10</strong></p>
                        <p>{t.ex3Kons} <strong className="text-primary">{t.ex3KonsVal}</strong></p>
                        <p>{t.ex3Jenis} <strong className="text-primary">{t.ex3JenisVal}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aljabar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianUnsurPage;
