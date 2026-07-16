import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Scale } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    title: "PERBANDINGAN",
    subtitle: "Kelas 7 · Perbandingan · Materi Matematika",
    back: "← Kembali ke Perbandingan",
    introTitle: "Apa Itu Perbandingan?",
    introBody: "Pernahkah kamu membandingkan tinggi badanmu dengan temanmu? Atau perbandingan jumlah siswa perempuan dan laki-laki di kelasmu? Itulah yang disebut perbandingan dalam matematika!",
    introCard1Body: "Miyu membawa 4 buku. Arvinza membawa 6 buku. Perbandingan buku mereka adalah 4 : 6 = 2 : 3.",
    introDef: "adalah cara membandingkan dua besaran atau lebih menggunakan tanda titik dua (:) atau pecahan (a/b), dan dinyatakan dalam bentuk paling sederhana.",
    introDefH: "Perbandingan",
    pengertianTitle: "Pengertian & Bentuk Perbandingan",
    defLabel: "Definisi:",
    def1: "Perbandingan membandingkan dua besaran sejenis (sama satuannya).",
    def2: "Ditulis sebagai",
    def2h: "a : b",
    def2e: "atau",
    def2f: "(dibaca: a berbanding b)",
    def3: "Harus sudah dalam",
    def3h: "bentuk paling sederhana",
    def3e: "(dibagi FPB/GCD).",
    exTitle: "Contoh Perbandingan:",
    ex1: "5 mangga berbanding 8 jeruk →",
    ex2: "12 siswa laki-laki berbanding 8 siswa perempuan →",
    ex2Note: "(sederhanakan ÷ 4)",
    ex3: "Perbandingan usia paman (35 th) dan keponakan (7 th) →",
    ex3Note: "(sederhanakan ÷ 7)",
    sederTitle: "Cara Menyederhanakan Perbandingan",
    sederBody: "Perbandingan harus selalu dinyatakan dalam bentuk paling sederhana — artinya angka-angka di dalamnya sudah tidak bisa dibagi lagi dengan bilangan bulat yang sama (selain 1). Caranya adalah membagi semua angka dengan FPB (Faktor Persekutuan Terbesar) / GCD.",
    sederStepsLabel: "Langkah Menyederhanakan:",
    sederS1: "Tulis perbandingan dalam bentuk a : b (atau a : b : c untuk 3 besaran).",
    sederS2: "Cari FPB dari semua angka dalam perbandingan.",
    sederS3: "Bagi semua angka dengan FPB tersebut.",
    sederS4: "Hasilnya adalah perbandingan paling sederhana.",
    sederS1h: "Tulis",
    sederS2h: "Cari FPB",
    sederS3h: "Bagi",
    sederS4h: "Hasil",
    sederExTitle: "Contoh Penyederhanaan:",
    sederEx1: "Sederhanakan 18 : 24 : 30",
    sederEx1Sol: "FPB(18, 24, 30) = 6 → sederhanakan:",
    sederEx2: "Sederhanakan 45 : 75",
    sederEx2Sol: "FPB(45, 75) = 15 → sederhanakan:",
    contohTitle: "Contoh Soal dan Pembahasan",
    badgeMudah: "MUDAH",
    badgeSedang: "SEDANG",
    badgeSulit: "SULIT",
    pembahasan: "PEMBAHASAN:",
    langkah: "Langkah",
    diketahui: "Diketahui:",
    ditanya: "Ditanya:",
    c1Title: "Contoh 1 – Menyederhanakan dan Membandingkan",
    c1Q: "Bayu memiliki 12 buku dan Citra memiliki 8 buku. Harga 3 buku adalah Rp15.000. (a) Tentukan perbandingan buku Bayu dan Citra! (b) Berapa harga 1 buku? (c) Berapa harga semua buku Bayu?",
    c1A: "Bagian (a):",
    c1B: "Bagian (b):",
    c1C: "Bagian (c):",
    c1Aa: "Perbandingan buku Bayu : Citra = 12 : 8",
    c1Ab: "FPB(12, 8) = 4, sederhanakan: 12÷4 : 8÷4 = 3 : 2",
    c1Ba: "Harga 1 buku:",
    c1Ca: "Harga semua buku Bayu (12 buku):",
    c1AResult: "Perbandingan buku Bayu : Citra = 3 : 2",
    c1BResult: "Harga 1 buku = Rp5.000",
    c1CResult: "Harga semua buku Bayu = Rp60.000",
    c1BMath: "\\frac{\\text{Rp15.000}}{3} = \\text{Rp5.000}",
    c1CMath: "12 \\times \\text{Rp5.000} = \\text{Rp60.000}",
    c2Title: "Contoh 2 – Perbandingan Tiga Besaran",
    c2Q: "Panjang sisi-sisi segitiga berbanding 3 : 4 : 5. Jika keliling segitiga adalah 48 cm, tentukan panjang setiap sisi!",
    c2S1: "Total rasio = 3 + 4 + 5 = 12 bagian",
    c2S2: "Panjang sisi-sisi segitiga:",
    c2Check: "Cek: 12 + 16 + 20 = 48 cm ✓",
    c2Math1: "\\text{Sisi 1} = \\frac{3}{12} \\times 48 = 12 \\text{ cm}",
    c2Math2: "\\text{Sisi 2} = \\frac{4}{12} \\times 48 = 16 \\text{ cm}",
    c2Math3: "\\text{Sisi 3} = \\frac{5}{12} \\times 48 = 20 \\text{ cm}",
    c2Result: "Sisi segitiga: 12 cm, 16 cm, dan 20 cm.",
    c3Title: "Contoh 3 – Mencari Nilai dari Selisih",
    c3Q: "Uang Dafa dan Rani berbanding 3 : 5. Jika selisih uang mereka adalah Rp24.000, tentukan (a) uang masing-masing, dan (b) jumlah uang keduanya.",
    c3Cara1: "✦ CARA 1 – Menggunakan Variabel",
    c3Cara2: "✦ CARA 2 – Langsung Menggunakan Perbandingan",
    c3S1: "Misalkan uang Dafa",
    c3S1b: "dan uang Rani",
    c3S2: "Gunakan informasi selisih:",
    c3S3: "Hitung uang masing-masing:",
    c3S4: "Hitung jumlah uang keduanya:",
    c3Method2Intro: "Gunakan rumus:",
    c3Method2Formula: "\\text{Nilai yang dicari} = \\frac{\\text{unsur rasio yang dicari}}{\\text{selisih angka rasio}} \\times \\text{selisih yang diketahui}",
    c3Method2Given: "rasio",
    c3Method2Given2: ", selisih angka rasio",
    c3Method2Given3: ", selisih uang",
    c3Method2Dafa: "Uang Dafa:",
    c3Method2Rani: "Uang Rani:",
    c3Method2Total: "Jumlah uang keduanya",
    c3Method2Note: "jumlah angka rasio",
    c3Method2Same: "Hasil Cara 2 sama dengan Cara 1 ✓",
    c3DafaMath: "3 \\times 12.000 = \\text{Rp36.000}",
    c3RaniMath: "5 \\times 12.000 = \\text{Rp60.000}",
    c3TotalMath: "36.000 + 60.000 = \\text{Rp96.000}",
    c3DafaLabel: "Uang Dafa",
    c3RaniLabel: "Uang Rani",
    c3DafaM2Math: "\\frac{3}{2} \\times 24.000 = \\text{Rp36.000}",
    c3RaniM2Math: "\\frac{5}{2} \\times 24.000 = \\text{Rp60.000}",
    c3TotalM2Math: "\\frac{8}{2} \\times 24.000 = \\text{Rp96.000}",
    c3Var1: "= 3x",
    c3Var2: "= 5x",
    c3VarEq: "5x - 3x = 24.000",
    c3VarSolve: "2x = 24.000 \\Rightarrow x = 12.000",
  },
  en: {
    title: "RATIO",
    subtitle: "Grade 7 · Ratio · Mathematics",
    back: "← Back to Ratio",
    introTitle: "What Is a Ratio?",
    introBody: "Have you ever compared your height with a friend's? Or the ratio of girls to boys in your class? That is what a ratio means in mathematics!",
    introCard1Body: "Jamie has 4 books. Quinn has 6 books. The ratio of their books is 4 : 6 = 2 : 3.",
    introDef: "is a way of comparing two or more quantities using a colon (:) or fraction (a/b), expressed in its simplest form.",
    introDefH: "A ratio",
    pengertianTitle: "Definition & Forms of Ratio",
    defLabel: "Definition:",
    def1: "A ratio compares two quantities of the same type (same units).",
    def2: "Written as",
    def2h: "a : b",
    def2e: "or",
    def2f: "(read: a to b)",
    def3: "Must be in",
    def3h: "simplest form",
    def3e: "(divided by the GCD).",
    exTitle: "Examples of Ratios:",
    ex1: "5 mangoes to 8 oranges →",
    ex2: "12 male students to 8 female students →",
    ex2Note: "(simplify ÷ 4)",
    ex3: "Age ratio of uncle (35 yrs) to niece (7 yrs) →",
    ex3Note: "(simplify ÷ 7)",
    sederTitle: "How to Simplify a Ratio",
    sederBody: "A ratio must always be expressed in its simplest form — meaning the numbers cannot be divided any further by the same whole number (other than 1). This is done by dividing all numbers by the GCD (Greatest Common Divisor).",
    sederStepsLabel: "Steps to Simplify:",
    sederS1: "Write the ratio in the form a : b (or a : b : c for three quantities).",
    sederS2: "Find the GCD of all numbers in the ratio.",
    sederS3: "Divide all numbers by the GCD.",
    sederS4: "The result is the simplest form of the ratio.",
    sederS1h: "Write",
    sederS2h: "Find the GCD",
    sederS3h: "Divide",
    sederS4h: "Result",
    sederExTitle: "Simplification Examples:",
    sederEx1: "Simplify 18 : 24 : 30",
    sederEx1Sol: "GCD(18, 24, 30) = 6 → simplify:",
    sederEx2: "Simplify 45 : 75",
    sederEx2Sol: "GCD(45, 75) = 15 → simplify:",
    contohTitle: "Examples and Solutions",
    badgeMudah: "EASY",
    badgeSedang: "MEDIUM",
    badgeSulit: "HARD",
    pembahasan: "SOLUTION:",
    langkah: "Step",
    diketahui: "Given:",
    ditanya: "Find:",
    c1Title: "Example 1 – Simplify and Compare",
    c1Q: "Drew has 12 books and Sage has 8 books. The price of 3 books is $15. (a) Find the ratio of Drew's books to Sage's books. (b) What is the price of 1 book? (c) What is the total price of all Drew's books?",
    c1A: "Part (a):",
    c1B: "Part (b):",
    c1C: "Part (c):",
    c1Aa: "Ratio of Drew's books : Sage's books = 12 : 8",
    c1Ab: "GCD(12, 8) = 4, simplify: 12÷4 : 8÷4 = 3 : 2",
    c1Ba: "Price of 1 book:",
    c1Ca: "Price of all Drew's books (12 books):",
    c1AResult: "Ratio of Drew's books : Sage's books = 3 : 2",
    c1BResult: "Price of 1 book = $5",
    c1CResult: "Total price of Drew's books = $60",
    c1BMath: "\\frac{\\$15}{3} = \\$5",
    c1CMath: "12 \\times \\$5 = \\$60",
    c2Title: "Example 2 – Ratio of Three Quantities",
    c2Q: "The sides of a triangle are in the ratio 3 : 4 : 5. If the perimeter of the triangle is 48 cm, find the length of each side!",
    c2S1: "Total ratio = 3 + 4 + 5 = 12 parts",
    c2S2: "Length of each side:",
    c2Check: "Check: 12 + 16 + 20 = 48 cm ✓",
    c2Math1: "\\text{Side 1} = \\frac{3}{12} \\times 48 = 12 \\text{ cm}",
    c2Math2: "\\text{Side 2} = \\frac{4}{12} \\times 48 = 16 \\text{ cm}",
    c2Math3: "\\text{Side 3} = \\frac{5}{12} \\times 48 = 20 \\text{ cm}",
    c2Result: "Triangle sides: 12 cm, 16 cm, and 20 cm.",
    c3Title: "Example 3 – Finding a Value from a Difference",
    c3Q: "Reed's money and Blair's money are in the ratio 3 : 5. If the difference between their amounts is $24, find (a) each person's amount, and (b) their total combined amount.",
    c3Cara1: "✦ METHOD 1 – Using a Variable",
    c3Cara2: "✦ METHOD 2 – Using the Ratio Directly",
    c3S1: "Let Reed's money",
    c3S1b: "and Blair's money",
    c3S2: "Use the difference information:",
    c3S3: "Calculate each amount:",
    c3S4: "Calculate the combined total:",
    c3Method2Intro: "Use the formula:",
    c3Method2Formula: "\\text{Value sought} = \\frac{\\text{ratio part sought}}{\\text{difference of ratio parts}} \\times \\text{known difference}",
    c3Method2Given: "ratio",
    c3Method2Given2: ", difference of ratio parts",
    c3Method2Given3: ", money difference",
    c3Method2Dafa: "Reed's money:",
    c3Method2Rani: "Blair's money:",
    c3Method2Total: "Total combined amount",
    c3Method2Note: "sum of ratio parts",
    c3Method2Same: "Method 2 gives the same result as Method 1 ✓",
    c3DafaMath: "3 \\times 12 = \\$36",
    c3RaniMath: "5 \\times 12 = \\$60",
    c3TotalMath: "36 + 60 = \\$96",
    c3DafaLabel: "Reed's money",
    c3RaniLabel: "Blair's money",
    c3DafaM2Math: "\\frac{3}{2} \\times 24 = \\$36",
    c3RaniM2Math: "\\frac{5}{2} \\times 24 = \\$60",
    c3TotalM2Math: "\\frac{8}{2} \\times 24 = \\$96",
    c3Var1: "= 3x",
    c3Var2: "= 5x",
    c3VarEq: "5x - 3x = 24",
    c3VarSolve: "2x = 24 \\Rightarrow x = 12",
  },
  ja: {
    title: "比",
    subtitle: "中学1年 · 比 · 数学",
    back: "← 比に戻る",
    introTitle: "比とは？",
    introBody: "友達と身長を比べたことはありますか？またはクラスの男女の人数の比？それが数学でいう「比」です！",
    introCard1Body: "Jamieは4冊の本を持っています。Quinnは6冊。2人の本の比は 4：6 = 2：3 です。",
    introDef: "は2つ以上の量をコロン（:）または分数（a/b）で比較する方法で、最も簡単な形で表します。",
    introDefH: "比",
    pengertianTitle: "比の定義と形式",
    defLabel: "定義：",
    def1: "比は同じ種類の量（同じ単位）を比べます。",
    def2: "形式：",
    def2h: "a : b",
    def2e: "または",
    def2f: "（読み方：a対b）",
    def3: "常に",
    def3h: "最も簡単な形",
    def3e: "（GCDで割る）で表します。",
    exTitle: "比の例：",
    ex1: "マンゴー5個対オレンジ8個 →",
    ex2: "男子生徒12人対女子生徒8人 →",
    ex2Note: "（÷4で簡約）",
    ex3: "おじさん（35歳）と姪（7歳）の年齢の比 →",
    ex3Note: "（÷7で簡約）",
    sederTitle: "比の簡約方法",
    sederBody: "比は常に最も簡単な形で表します — 数字をこれ以上同じ整数（1以外）で割れない状態。最大公約数（GCD）で全ての数字を割ります。",
    sederStepsLabel: "簡約の手順：",
    sederS1: "比を a : b（または3量の場合 a : b : c）の形で書く。",
    sederS2: "比の全ての数字のGCDを求める。",
    sederS3: "全ての数字をGCDで割る。",
    sederS4: "結果が最も簡単な形の比。",
    sederS1h: "書く",
    sederS2h: "GCDを求める",
    sederS3h: "割る",
    sederS4h: "結果",
    sederExTitle: "簡約の例：",
    sederEx1: "18 : 24 : 30 を簡約",
    sederEx1Sol: "GCD(18, 24, 30) = 6 → 簡約：",
    sederEx2: "45 : 75 を簡約",
    sederEx2Sol: "GCD(45, 75) = 15 → 簡約：",
    contohTitle: "例題と解説",
    badgeMudah: "基本",
    badgeSedang: "標準",
    badgeSulit: "発展",
    pembahasan: "解説：",
    langkah: "ステップ",
    diketahui: "与えられた情報：",
    ditanya: "求めるもの：",
    c1Title: "例題1 – 簡約と比較",
    c1Q: "Drewは12冊の本を持ち、Sageは8冊持っています。本3冊の値段は$15です。(a) DrewとSageの本の比を求めなさい。(b) 本1冊の値段は？(c) Drewの本全部の値段は？",
    c1A: "(a)：",
    c1B: "(b)：",
    c1C: "(c)：",
    c1Aa: "Drewの本 : Sageの本 = 12 : 8",
    c1Ab: "GCD(12, 8) = 4、簡約：12÷4 : 8÷4 = 3 : 2",
    c1Ba: "本1冊の値段：",
    c1Ca: "Drewの本全部（12冊）の値段：",
    c1AResult: "Drewの本 : Sageの本 = 3 : 2",
    c1BResult: "本1冊の値段 = $5",
    c1CResult: "Drewの本全部の値段 = $60",
    c1BMath: "\\frac{\\$15}{3} = \\$5",
    c1CMath: "12 \\times \\$5 = \\$60",
    c2Title: "例題2 – 3量の比",
    c2Q: "三角形の各辺の比は 3：4：5 です。周の長さが48cmのとき、各辺の長さを求めなさい。",
    c2S1: "比の合計 = 3 + 4 + 5 = 12 パート",
    c2S2: "各辺の長さ：",
    c2Check: "確認：12 + 16 + 20 = 48cm ✓",
    c2Math1: "\\text{辺1} = \\frac{3}{12} \\times 48 = 12 \\text{ cm}",
    c2Math2: "\\text{辺2} = \\frac{4}{12} \\times 48 = 16 \\text{ cm}",
    c2Math3: "\\text{辺3} = \\frac{5}{12} \\times 48 = 20 \\text{ cm}",
    c2Result: "三角形の辺：12cm、16cm、20cm。",
    c3Title: "例題3 – 差から値を求める",
    c3Q: "Reedのお金とBlairのお金の比は 3：5 です。2人の金額の差が$24のとき、(a) それぞれの金額と、(b) 合計金額を求めなさい。",
    c3Cara1: "✦ 方法1 – 変数を使う",
    c3Cara2: "✦ 方法2 – 比を直接使う",
    c3S1: "Reedのお金を",
    c3S1b: "、Blairのお金を",
    c3S2: "差の情報を使う：",
    c3S3: "それぞれの金額を計算：",
    c3S4: "合計金額を計算：",
    c3Method2Intro: "公式を使う：",
    c3Method2Formula: "\\text{求める値} = \\frac{\\text{求める比の数字}}{\\text{比の数字の差}} \\times \\text{既知の差}",
    c3Method2Given: "比",
    c3Method2Given2: "、比の数字の差",
    c3Method2Given3: "、金額の差",
    c3Method2Dafa: "Reedのお金：",
    c3Method2Rani: "Blairのお金：",
    c3Method2Total: "合計金額",
    c3Method2Note: "比の数字の和",
    c3Method2Same: "方法2の結果も方法1と同じ ✓",
    c3DafaMath: "3 \\times 12 = \\$36",
    c3RaniMath: "5 \\times 12 = \\$60",
    c3TotalMath: "36 + 60 = \\$96",
    c3DafaLabel: "Reedのお金",
    c3RaniLabel: "Blairのお金",
    c3DafaM2Math: "\\frac{3}{2} \\times 24 = \\$36",
    c3RaniM2Math: "\\frac{5}{2} \\times 24 = \\$60",
    c3TotalM2Math: "\\frac{8}{2} \\times 24 = \\$96",
    c3Var1: "= 3x",
    c3Var2: "= 5x",
    c3VarEq: "5x - 3x = 24",
    c3VarSolve: "2x = 24 \\Rightarrow x = 12",
  },
};

const PerbandinganUmumPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "pengertian", "seder", "contoh"]);

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

          {/* SECTION: PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.introCard1Body}
                  </p>
                  <div className="mt-3 bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="4 : 6 = 2 : 3" />
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">{t.introDefH}</strong> {t.introDef}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: PENGERTIAN & BENTUK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("pengertian")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.pengertianTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.defLabel}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>• {t.def1}</p>
                    <p>• {t.def2} <strong className="text-cyan-300">{t.def2h}</strong> {t.def2e} <InlineMath math="\frac{a}{b}" /> {t.def2f}</p>
                    <p>• {t.def3} <strong className="text-cyan-300">{t.def3h}</strong> {t.def3e}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-white">{t.exTitle}</p>
                  <div className="space-y-2 font-body text-sm text-white/70">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{t.ex1}</span>
                      <InlineMath math="5 : 8" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{t.ex2}</span>
                      <InlineMath math="12 : 8 = 3 : 2" />
                      <span className="text-xs text-white/50">{t.ex2Note}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{t.ex3}</span>
                      <InlineMath math="35 : 7 = 5 : 1" />
                      <span className="text-xs text-white/50">{t.ex3Note}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: MENYEDERHANAKAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("seder")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.sederTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.sederBody}</p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">{t.sederStepsLabel}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    {[
                      { h: t.sederS1h, b: t.sederS1 },
                      { h: t.sederS2h, b: t.sederS2 },
                      { h: t.sederS3h, b: t.sederS3 },
                      { h: t.sederS4h, b: t.sederS4 },
                    ].map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-green-300 font-bold shrink-0">{i + 1}.</span>
                        <p><strong className="text-green-300">{s.h}</strong> — {s.b}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-sm font-semibold text-white">{t.sederExTitle}</p>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/80">{t.sederEx1}</p>
                    <p className="font-body text-xs text-white/60">{t.sederEx1Sol}</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\frac{18}{6} : \frac{24}{6} : \frac{30}{6} = 3 : 4 : 5" />
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/80">{t.sederEx2}</p>
                    <p className="font-body text-xs text-white/60">{t.sederEx2Sol}</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="\frac{45}{15} : \frac{75}{15} = 3 : 5" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.contohTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMudah}</span>
                    <span className="font-body font-semibold text-white">{t.c1Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c1Q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-semibold text-green-400">{t.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p className="font-semibold text-green-300">{t.c1A}</p>
                      <p>{t.c1Aa}</p>
                      <p>{t.c1Ab}</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <BlockMath math="12 : 8 = 3 : 2" />
                      </div>
                      <p className="text-primary">{t.c1AResult}</p>
                      <p className="font-semibold text-green-300 mt-2">{t.c1B}</p>
                      <p>{t.c1Ba}</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <BlockMath math={t.c1BMath} />
                      </div>
                      <p className="text-primary">{t.c1BResult}</p>
                      <p className="font-semibold text-green-300 mt-2">{t.c1C}</p>
                      <p>{t.c1Ca}</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <BlockMath math={t.c1CMath} />
                      </div>
                      <p className="text-primary">{t.c1CResult}</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSedang}</span>
                    <span className="font-body font-semibold text-white">{t.c2Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c2Q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-semibold text-yellow-400">{t.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.c2S1}</p>
                      <p>{t.c2S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={t.c2Math1} />
                        <BlockMath math={t.c2Math2} />
                        <BlockMath math={t.c2Math3} />
                      </div>
                      <p className="text-primary">{t.c2Check}</p>
                      <p className="text-primary font-semibold">{t.c2Result}</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSulit}</span>
                    <span className="font-body font-semibold text-white">{t.c3Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c3Q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-semibold text-red-400">{t.pembahasan}</p>

                    {/* Cara 1 */}
                    <div>
                      <p className="font-body text-xs font-bold text-cyan-400 mb-3 tracking-wide">{t.c3Cara1}</p>
                      <div className="space-y-3 font-body text-sm text-white/80">
                        <p><strong>{t.langkah} 1:</strong> {t.c3S1} <InlineMath math="= 3x" /> {t.c3S1b} <InlineMath math="= 5x" />.</p>
                        <p><strong>{t.langkah} 2:</strong> {t.c3S2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.c3VarEq} />
                          <BlockMath math={t.c3VarSolve} />
                        </div>
                        <p><strong>{t.langkah} 3:</strong> {t.c3S3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={language === "id" ? "\\text{Uang Dafa} = " + t.c3DafaMath : language === "ja" ? "\\text{Reed} = " + t.c3DafaMath : "\\text{Reed} = " + t.c3DafaMath} />
                          <BlockMath math={language === "id" ? "\\text{Uang Rani} = " + t.c3RaniMath : language === "ja" ? "\\text{Blair} = " + t.c3RaniMath : "\\text{Blair} = " + t.c3RaniMath} />
                        </div>
                        <p><strong>{t.langkah} 4:</strong> {t.c3S4}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.c3TotalMath} />
                        </div>
                        <p className="text-primary font-semibold">
                          {t.c3DafaLabel} = {language === "id" ? "Rp36.000" : "$36"},{" "}
                          {t.c3RaniLabel} = {language === "id" ? "Rp60.000" : "$60"},{" "}
                          {language === "id" ? "Jumlah = Rp96.000" : language === "ja" ? "合計 = $96" : "Total = $96"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-white/10" />

                    {/* Cara 2 */}
                    <div>
                      <p className="font-body text-xs font-bold text-purple-400 mb-3 tracking-wide">{t.c3Cara2}</p>
                      <div className="space-y-3 font-body text-sm text-white/80">
                        <p>{t.c3Method2Intro}</p>
                        <div className="bg-slate-900/50 rounded p-3 text-center">
                          <BlockMath math={t.c3Method2Formula} />
                        </div>
                        <p>
                          <strong>{language === "id" ? "Diketahui:" : language === "ja" ? "与えられた情報：" : "Given:"}</strong>{" "}
                          {t.c3Method2Given} <InlineMath math="3 : 5" />,
                          {" "}{t.c3Method2Given2} <InlineMath math="= 5 - 3 = 2" />,
                          {" "}{t.c3Method2Given3} {language === "id" ? "= Rp24.000" : "= $24"}
                        </p>
                        <p><strong>{t.c3Method2Dafa}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.c3DafaM2Math} />
                        </div>
                        <p><strong>{t.c3Method2Rani}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.c3RaniM2Math} />
                        </div>
                        <p>
                          <strong>{t.c3Method2Total}</strong>{" "}
                          ({t.c3Method2Note} <InlineMath math="= 3 + 5 = 8" />):
                        </p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.c3TotalM2Math} />
                        </div>
                        <p className="text-primary font-semibold">{t.c3Method2Same}</p>
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
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/perbandingan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganUmumPage;
