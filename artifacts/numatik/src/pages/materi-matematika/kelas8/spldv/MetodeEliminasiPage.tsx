import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, Minus, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import EliminasiInteraktif from "@/components/EliminasiInteraktif";
import EliminasiAnimasiPembahasan from "@/components/EliminasiAnimasiPembahasan";

const translations = {
  id: {
    pageTitle: "METODE ELIMINASI",
    pageSubtitle: 'Selesaikan SPLDV dengan Teknik "Menghapus" Salah Satu Variabel',
    gradeLabel: "Kelas 8 · SPLDV · Materi Matematika",
    secIntro: "🌟 Ide Dasar Metode Eliminasi",
    secLangkah: "📘 Langkah-Langkah Metode Eliminasi",
    secLab: "🧪 Lab Interaktif — Lihat Eliminasi Beraksi!",
    secContoh: "📝 Contoh Soal & Pembahasan",
    secPerbandingan: "🔍 Perbandingan Tiga Metode SPLDV",
    secRangkuman: "📋 Rangkuman",
    introDesc: 'Kata "eliminasi" berasal dari bahasa Latin yang berarti menghilangkan atau mengeliminasi. Ide utama metode ini: kita menghapus salah satu variabel dari sistem persamaan dengan cara menjumlahkan atau mengurangkan kedua persamaan, sehingga tersisa hanya satu variabel yang bisa langsung diselesaikan.',
    sameSignLabel: "🔴 Koefisien sama dan bertanda sama → Kurangkan (−)",
    diffSignLabel: "🟢 Koefisien sama dan bertanda berbeda → Jumlahkan (+)",
    advantageTitle: "Keunggulan Eliminasi:",
    advantageDesc: "Sangat efektif ketika koefisien variabel sudah sama atau bisa disamakan dengan perkalian sederhana. Tidak perlu menyatakan satu variabel secara eksplisit seperti metode substitusi!",
    summaryTitle: "🎯 Ringkasan Intisari",
    summaryDesc: 'Metode eliminasi "menghapus" satu variabel dengan membuat koefisiennya sama di kedua persamaan, lalu menjumlahkan atau mengurangkan kedua persamaan tersebut. Proses ini dilakukan dua kali — sekali untuk mencari x, sekali untuk mencari y.',
    stepsTitle: "📋 5 Langkah Sistematis",
    step1Title: "Tulis kedua persamaan sejajar",
    step1Desc: "Pastikan kedua persamaan sudah dalam bentuk standar dan tuliskan satu di atas yang lain.",
    step2Title: "Pilih variabel yang akan dieliminasi",
    step2Desc: "Pilih variabel yang paling mudah disamakan koefisiennya. Kalikan salah satu atau kedua persamaan dengan bilangan yang tepat.",
    step3Title: "Samakan koefisien variabel yang dipilih",
    step3Desc: "Setelah perkalian, koefisien variabel yang dipilih harus sama besar di kedua persamaan.",
    step4Title: "Kurangkan atau jumlahkan kedua persamaan",
    step4Desc: "Jika koefisien bertanda sama → kurangkan. Jika bertanda berbeda → jumlahkan. Variabel yang dipilih akan lenyap!",
    step5Title: "Eliminasi variabel lain untuk mendapat nilai lengkap",
    step5Desc: "Ulangi proses eliminasi, kali ini hapus variabel yang sudah ditemukan nilainya untuk mendapat variabel satunya.",
    labDesc: "Masukkan sistem persamaan milikmu, pilih variabel mana yang dieliminasi pertama, lalu tekan ✖️ Eliminasi — kamu akan melihat secara langsung bagaimana variabel lenyap dan tersisa satu variabel yang mudah diselesaikan!",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    problem: "Soal",
    solution: "✅ Pembahasan",
    q1: "Selesaikan SPLDV berikut dengan metode eliminasi:",
    q1L1: "Langkah 1 — Eliminasi variabel",
    q1L1b: "untuk mencari",
    q1L1Note: "Koefisien y di kedua persamaan sudah sama (= 1) dan bertanda sama → kurangkan.",
    q1L2: "Langkah 2 — Eliminasi variabel",
    q1L2Note: "Kalikan P2 dengan 3 agar koefisien x sama, lalu kurangkan.",
    q1L3: "Langkah 3 — Verifikasi:",
    q1Answer: "🔑 Solusi:",
    q2: "Selesaikan dengan metode eliminasi:",
    q2Intro: "Koefisien tidak ada yang sama — perlu perkalian dulu sebelum eliminasi.",
    q2EliminateY: "Eliminasi y untuk mencari x:",
    q2EliminateX: "Eliminasi x untuk mencari y:",
    q2EqLabel: "Samakan koefisien → kalikan kedua persamaan",
    q2Added: "dijumlahkan",
    q2Subtracted: "dikurangkan",
    q2Note1: "Koefisien y bertanda berbeda (+6 dan −6) → dijumlahkan, sehingga y hilang!",
    q2Verify: "Verifikasi:",
    q2Tip: "💡 Solusi: Perhatikan: saat koefisien bertanda berbeda → jumlahkan. Saat bertanda sama → kurangkan!",
    q3: "Seorang pedagang menjual dua jenis buah: mangga dan jeruk. Pada hari pertama ia menjual 4 kg mangga dan 6 kg jeruk dan mendapat $132. Pada hari kedua ia menjual 3 kg mangga dan 2 kg jeruk dengan pendapatan $72. Tentukan harga per kilogram masing-masing buah menggunakan metode eliminasi!",
    q3MangoVar: "m = harga 1 kg mangga",
    q3OrangeVar: "j = harga 1 kg jeruk",
    q3L1: "Langkah 1 — Buat model SPLDV:",
    q3L2: "Langkah 2 — Sederhanakan persamaan:",
    q3L2Note: "Bagi P1 dengan 2 dan P2 tetap:",
    q3L3: "Langkah 3 — Eliminasi m untuk mencari j:",
    q3L3Note: "KPK dari 2 dan 3 adalah 6. Kalikan P1' × 3 dan P2 × 2 agar koefisien m sama.",
    q3EqLabel: "Samakan koefisien m → kalikan kedua persamaan",
    q3L4: "Langkah 4 — Eliminasi j untuk mencari m:",
    q3L4Note: "KPK dari 3 dan 2 adalah 6. Kalikan P1' × 2 dan P2 × 3 agar koefisien j sama.",
    q3EqLabel2: "Samakan koefisien j → kalikan kedua persamaan",
    q3L5: "Langkah 5 — Verifikasi:",
    q3Answer: "🔑 Harga 1 kg mangga: $16.80 | Harga 1 kg jeruk: $10.80",
    q3Warning: "⚠️ Sederhanakan persamaan di awal (bagi dengan bilangan yang sama) untuk membuat angka lebih kecil dan perhitungan lebih ringan!",
    comparisonTitle: "Perbandingan Tiga Metode SPLDV",
    comparisonAspect: "Aspek",
    comparisonRows: [
      ["Cara kerja", "Gambar 2 garis, cari titik potong", "Gantikan variabel ke persamaan lain", "Hapus satu variabel dengan +/−"],
      ["Keakuratan", "⚠️ Kurang presisi", "✅ Presisi", "✅ Presisi"],
      ["Terbaik untuk", "Solusi bilangan bulat kecil", "Ada variabel berkoefisien 1", "Koefisien besar / sama"],
      ["Visualisasi", "✅ Sangat visual", "❌ Tidak visual", "❌ Tidak visual"],
      ["Kecepatan", "🐢 Lambat (perlu gambar)", "🚀 Cepat jika koef. 1", "🚀 Cepat untuk koef. besar"],
    ],
    comparisonTip: "💡 Tips memilih metode: Tidak ada metode yang selalu terbaik — pilih yang paling efisien berdasarkan bentuk persamaan yang dihadapi. Dalam ujian, metode eliminasi sering jadi pilihan utama karena konsisten dan mudah diterapkan pada berbagai bentuk SPLDV.",
    summaryPoints: [
      { poin: "Metode eliminasi menghilangkan satu variabel dengan menyamakan koefisiennya, lalu menjumlahkan atau mengurangkan kedua persamaan.", icon: "🗑️" },
      { poin: "Koefisien sama, tanda sama → kurangkan. Koefisien sama, tanda berbeda → jumlahkan.", icon: "➕➖" },
      { poin: "Lakukan proses eliminasi dua kali: sekali untuk x, sekali untuk y.", icon: "🔁" },
      { poin: "Sederhanakan persamaan di awal (bagi dengan faktor persekutuan) untuk mempermudah perhitungan.", icon: "✂️" },
      { poin: "Selalu verifikasi solusi ke KEDUA persamaan awal untuk memastikan kebenaran jawaban.", icon: "✅" },
    ],
    summaryCore: "Inti Metode Eliminasi",
    backBtn: "← Kembali ke Menu SPLDV",
    misalkan: "Misalkan",
    graphMethod: "Grafik",
    subMethod: "Substitusi",
    elimMethod: "Eliminasi",
  },
  en: {
    pageTitle: "ELIMINATION METHOD",
    pageSubtitle: 'Solve Systems of Linear Equations by "Eliminating" a Variable',
    gradeLabel: "Grade 8 · SLETV · Mathematics",
    secIntro: "🌟 Core Idea of the Elimination Method",
    secLangkah: "📘 Steps of the Elimination Method",
    secLab: "🧪 Interactive Lab — See Elimination in Action!",
    secContoh: "📝 Example Problems & Solutions",
    secPerbandingan: "🔍 Comparison of Three SLETV Methods",
    secRangkuman: "📋 Summary",
    introDesc: 'The word "elimination" comes from Latin meaning to remove or eliminate. The main idea: we eliminate one variable from the system by adding or subtracting the two equations, leaving only one variable that can be solved directly.',
    sameSignLabel: "🔴 Same coefficient, same sign → Subtract (−)",
    diffSignLabel: "🟢 Same coefficient, opposite signs → Add (+)",
    advantageTitle: "Advantage of Elimination:",
    advantageDesc: "Very effective when variable coefficients are already equal or can be equalized by simple multiplication. No need to explicitly express one variable as in the substitution method!",
    summaryTitle: "🎯 Key Summary",
    summaryDesc: "The elimination method 'removes' one variable by making its coefficient equal in both equations, then adding or subtracting the equations. This is done twice — once for x, once for y.",
    stepsTitle: "📋 5 Systematic Steps",
    step1Title: "Write both equations aligned",
    step1Desc: "Ensure both equations are in standard form and write them one above the other.",
    step2Title: "Choose the variable to eliminate",
    step2Desc: "Choose the variable whose coefficient is easiest to equalize. Multiply one or both equations by appropriate numbers.",
    step3Title: "Equalize the coefficient of the chosen variable",
    step3Desc: "After multiplication, the coefficient of the chosen variable must be equal in both equations.",
    step4Title: "Subtract or add the two equations",
    step4Desc: "If coefficients have the same sign → subtract. If opposite signs → add. The chosen variable disappears!",
    step5Title: "Eliminate the other variable to get the full solution",
    step5Desc: "Repeat the elimination process, this time eliminating the variable whose value was already found.",
    labDesc: "Enter your system of equations, choose which variable to eliminate first, then press ✖️ Eliminate — you'll see how a variable vanishes leaving a single-variable equation!",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    problem: "Problem",
    solution: "✅ Solution",
    q1: "Solve the following system using the elimination method:",
    q1L1: "Step 1 — Eliminate variable",
    q1L1b: "to find",
    q1L1Note: "The coefficient of y in both equations is already equal (= 1) with the same sign → subtract.",
    q1L2: "Step 2 — Eliminate variable",
    q1L2Note: "Multiply P2 by 3 so the coefficient of x is equal, then subtract.",
    q1L3: "Step 3 — Verify:",
    q1Answer: "🔑 Solution:",
    q2: "Solve using the elimination method:",
    q2Intro: "No coefficients are equal — multiplication is needed before eliminating.",
    q2EliminateY: "Eliminate y to find x:",
    q2EliminateX: "Eliminate x to find y:",
    q2EqLabel: "Equalize coefficients → multiply both equations",
    q2Added: "added",
    q2Subtracted: "subtracted",
    q2Note1: "y coefficients have opposite signs (+6 and −6) → add, so y disappears!",
    q2Verify: "Verify:",
    q2Tip: "💡 Solution: Note: when coefficients have opposite signs → add. When same signs → subtract!",
    q3: "A merchant sells two types of fruit: mango and orange. On the first day they sold 4 kg of mango and 6 kg of orange, earning $132. On the second day they sold 3 kg of mango and 2 kg of orange, earning $72. Find the price per kilogram of each fruit using the elimination method!",
    q3MangoVar: "m = price per kg of mango",
    q3OrangeVar: "j = price per kg of orange",
    q3L1: "Step 1 — Build the system:",
    q3L2: "Step 2 — Simplify the equations:",
    q3L2Note: "Divide Eq 1 by 2 and keep Eq 2:",
    q3L3: "Step 3 — Eliminate m to find j:",
    q3L3Note: "LCM of 2 and 3 is 6. Multiply P1' × 3 and P2 × 2 to equalize coefficients of m.",
    q3EqLabel: "Equalize coefficient of m → multiply both equations",
    q3L4: "Step 4 — Eliminate j to find m:",
    q3L4Note: "LCM of 3 and 2 is 6. Multiply P1' × 2 and P2 × 3 to equalize coefficients of j.",
    q3EqLabel2: "Equalize coefficient of j → multiply both equations",
    q3L5: "Step 5 — Verify:",
    q3Answer: "🔑 Price per kg of mango: $16.80 | Price per kg of orange: $10.80",
    q3Warning: "⚠️ Simplify equations at the start (divide by a common factor) to get smaller numbers and easier calculations!",
    comparisonTitle: "Comparison of Three SLETV Methods",
    comparisonAspect: "Aspect",
    comparisonRows: [
      ["How it works", "Draw 2 lines, find intersection", "Substitute a variable into the other equation", "Remove one variable by +/−"],
      ["Accuracy", "⚠️ Less precise", "✅ Precise", "✅ Precise"],
      ["Best for", "Small integer solutions", "Variable with coefficient 1", "Large/equal coefficients"],
      ["Visualization", "✅ Very visual", "❌ Not visual", "❌ Not visual"],
      ["Speed", "🐢 Slow (need drawing)", "🚀 Fast if coeff. 1", "🚀 Fast for large coeff."],
    ],
    comparisonTip: "💡 Method selection tip: No method is always best — choose the most efficient one based on the form of the equations. In exams, the elimination method is often the first choice because it is consistent and easy to apply.",
    summaryPoints: [
      { poin: "The elimination method removes one variable by equalizing its coefficient, then adding or subtracting the equations.", icon: "🗑️" },
      { poin: "Same coefficient, same sign → subtract. Same coefficient, opposite signs → add.", icon: "➕➖" },
      { poin: "Perform elimination twice: once for x, once for y.", icon: "🔁" },
      { poin: "Simplify equations at the start (divide by GCF) to make calculations easier.", icon: "✂️" },
      { poin: "Always verify the solution in BOTH original equations.", icon: "✅" },
    ],
    summaryCore: "Core of the Elimination Method",
    backBtn: "← Back to SLETV Menu",
    misalkan: "Let",
    graphMethod: "Graphical",
    subMethod: "Substitution",
    elimMethod: "Elimination",
  },
  ja: {
    pageTitle: "加減法",
    pageSubtitle: "一方の変数を「消去」して連立方程式を解く",
    gradeLabel: "中学2年 · 連立方程式 · 数学",
    secIntro: "🌟 加減法の基本的なアイデア",
    secLangkah: "📘 加減法の手順",
    secLab: "🧪 インタラクティブ演習 — 加減法を実際に見よう！",
    secContoh: "📝 例題と解説",
    secPerbandingan: "🔍 3つの解法の比較",
    secRangkuman: "📋 まとめ",
    introDesc: "「消去」とは取り除くことです。加減法の基本的なアイデア：2つの方程式を加算または減算することで一方の変数を消去し、残った1変数の方程式を直接解きます。",
    sameSignLabel: "🔴 係数が同じで同符号 → 引く（−）",
    diffSignLabel: "🟢 係数が同じで異符号 → 足す（+）",
    advantageTitle: "加減法の利点：",
    advantageDesc: "変数の係数がすでに等しい場合や、簡単な掛け算で等しくできる場合に非常に効果的です。代入法のように変数を明示的に表す必要がありません！",
    summaryTitle: "🎯 要点まとめ",
    summaryDesc: "加減法は、両方の方程式で係数を等しくしてから足し引きすることで変数を消去します。これをxとyそれぞれに対して2回行います。",
    stepsTitle: "📋 5つのステップ",
    step1Title: "両方の方程式を縦に並べて書く",
    step1Desc: "両方の方程式が標準形になっていることを確認し、縦に並べて書きます。",
    step2Title: "消去する変数を選ぶ",
    step2Desc: "係数を最も簡単に等しくできる変数を選びます。適切な数で一方または両方の方程式を掛けます。",
    step3Title: "選んだ変数の係数を等しくする",
    step3Desc: "掛け算の後、選んだ変数の係数が両方の方程式で等しくなります。",
    step4Title: "2つの方程式を足すか引く",
    step4Desc: "係数の符号が同じ → 引く。符号が異なる → 足す。選んだ変数が消えます！",
    step5Title: "もう一方の変数を消去して完全な解を求める",
    step5Desc: "消去の工程を繰り返し、今度はすでに値が分かった変数を消去します。",
    labDesc: "連立方程式を入力し、最初に消去する変数を選んで ✖️ 消去 を押してください — 変数が消えて1変数の方程式になる様子を実際に見られます！",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    problem: "問題",
    solution: "✅ 解説",
    q1: "以下の連立方程式を加減法で解きましょう：",
    q1L1: "ステップ1 — 変数を消去",
    q1L1b: "を求めるため",
    q1L1Note: "両方の方程式でyの係数はすでに等しい（= 1）で同符号 → 引く。",
    q1L2: "ステップ2 — 変数を消去",
    q1L2Note: "P2を3倍してxの係数を等しくし、引く。",
    q1L3: "ステップ3 — 確認：",
    q1Answer: "🔑 解：",
    q2: "加減法で解きましょう：",
    q2Intro: "係数がまだ等しくない — 消去の前に掛け算が必要です。",
    q2EliminateY: "yを消去してxを求める：",
    q2EliminateX: "xを消去してyを求める：",
    q2EqLabel: "係数を等しくする → 両方の方程式を掛ける",
    q2Added: "加算",
    q2Subtracted: "減算",
    q2Note1: "yの係数の符号が異なる（+6と−6）→ 足してyを消去！",
    q2Verify: "確認：",
    q2Tip: "💡 解：係数の符号が異なる → 足す。同符号 → 引く！",
    q3: "ある商人が2種類の果物（マンゴーとオレンジ）を販売しています。初日は4kgのマンゴーと6kgのオレンジを$132で売りました。2日目は3kgのマンゴーと2kgのオレンジを$72で売りました。加減法を使って各果物の1kgあたりの価格を求めてください！",
    q3MangoVar: "m = マンゴー1kgの価格",
    q3OrangeVar: "j = オレンジ1kgの価格",
    q3L1: "ステップ1 — 連立方程式を立てる：",
    q3L2: "ステップ2 — 方程式を簡略化する：",
    q3L2Note: "式1を2で割り、式2はそのまま：",
    q3L3: "ステップ3 — mを消去してjを求める：",
    q3L3Note: "2と3の最小公倍数は6。P1'×3とP2×2でmの係数を揃える。",
    q3EqLabel: "mの係数を揃える → 両方の方程式を掛ける",
    q3L4: "ステップ4 — jを消去してmを求める：",
    q3L4Note: "3と2の最小公倍数は6。P1'×2とP2×3でjの係数を揃える。",
    q3EqLabel2: "jの係数を揃える → 両方の方程式を掛ける",
    q3L5: "ステップ5 — 確認：",
    q3Answer: "🔑 マンゴー1kg：$16.80 | オレンジ1kg：$10.80",
    q3Warning: "⚠️ 最初に方程式を簡略化（公約数で割る）すると、数が小さくなり計算が楽になります！",
    comparisonTitle: "3つの解法の比較",
    comparisonAspect: "観点",
    comparisonRows: [
      ["仕組み", "2本の直線を描き交点を求める", "変数を他の式に代入する", "+/−で一方の変数を消去"],
      ["精度", "⚠️ やや不正確", "✅ 正確", "✅ 正確"],
      ["最適な場合", "整数解で小さい値", "係数が1の変数がある", "係数が大きい・等しい"],
      ["視覚化", "✅ 非常に視覚的", "❌ 視覚化なし", "❌ 視覚化なし"],
      ["速度", "🐢 遅い（作図が必要）", "🚀 係数が1なら速い", "🚀 係数が大きい時に速い"],
    ],
    comparisonTip: "💡 解法の選び方：常に最善の解法はありません。方程式の形に応じて最も効率的な方法を選びましょう。試験では、加減法はさまざまな形の連立方程式に一貫して適用できるため、よく使われます。",
    summaryPoints: [
      { poin: "加減法は係数を揃えて足し引きすることで一方の変数を消去します。", icon: "🗑️" },
      { poin: "係数が同じで同符号 → 引く。係数が同じで異符号 → 足す。", icon: "➕➖" },
      { poin: "消去の工程を2回行う：xに1回、yに1回。", icon: "🔁" },
      { poin: "最初に方程式を簡略化（最大公約数で割る）すると計算が楽になる。", icon: "✂️" },
      { poin: "元の2つの方程式に代入して解を確認する。", icon: "✅" },
    ],
    summaryCore: "加減法の核心",
    backBtn: "← 連立方程式メニューに戻る",
    misalkan: "設：",
    graphMethod: "グラフ法",
    subMethod: "代入法",
    elimMethod: "加減法",
  },
};

const MetodeEliminasiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isSpaceTheme = theme === "dark";
  const t = translations[language];

  const SectionHeader = ({
    icon, iconColor, title,
  }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const Step = ({ no, title, children, color = "border-cyan-500/30 bg-cyan-900/10" }: {
    no: string; title: string; children: React.ReactNode; color?: string;
  }) => (
    <div className={`border ${color} rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-display text-sm font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">{no}</span>
        <p className="font-body text-sm font-semibold text-white">{title}</p>
      </div>
      <div className="font-body text-sm text-white/80 pl-8">{children}</div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.pageTitle}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.pageSubtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.gradeLabel}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secIntro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introDesc}</p>

                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-1">
                    {language === "id" ? "🔄 Prinsip Dasar Eliminasi" : language === "en" ? "🔄 Core Principle of Elimination" : "🔄 加減法の基本原理"}
                  </p>

                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-3">{t.sameSignLabel}</p>
                    <div className="font-mono text-sm inline-block min-w-0">
                      <div className="flex items-center gap-3 pr-6"><span className="text-white/80">ax + by = d</span></div>
                      <div className="flex items-center gap-3"><span className="text-white/80">ax + cy = e</span><span className="text-red-400 font-bold">−</span></div>
                      <div className="border-t-2 border-white/30 my-1.5" />
                      <div className="flex items-center gap-3 pr-6"><span className="text-yellow-300 font-semibold">(b − c)y = d − e</span></div>
                    </div>
                    <p className="font-body text-xs text-white/50 mt-1">
                      {language === "id" ? "Variabel x hilang karena" : language === "en" ? "Variable x disappears because" : "xが消えるのは"} <InlineMath math="ax - ax = 0" />
                    </p>
                  </div>

                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-violet-300 mb-3">{t.diffSignLabel}</p>
                    <div className="font-mono text-sm inline-block min-w-0">
                      <div className="flex items-center gap-3 pr-6"><span className="text-white/80">ax + by = d</span></div>
                      <div className="flex items-center gap-3"><span className="text-white/80">ax − by = e</span><span className="text-green-400 font-bold">+</span></div>
                      <div className="border-t-2 border-white/30 my-1.5" />
                      <div className="flex items-center gap-3 pr-6"><span className="text-yellow-300 font-semibold">2ax = d + e</span></div>
                    </div>
                    <p className="font-body text-xs text-white/50 mt-1">
                      {language === "id" ? "Variabel y hilang karena" : language === "en" ? "Variable y disappears because" : "yが消えるのは"} <InlineMath math="by + (-by) = 0" />
                    </p>
                  </div>
                </div>

                <div className={`border border-cyan-500/30 rounded-xl overflow-hidden ${isSpaceTheme ? "bg-slate-900/70" : "bg-white/90"}`}>
                  <div className={`px-4 py-3 border-b border-cyan-500/20 ${isSpaceTheme ? "bg-cyan-900/20" : "bg-cyan-100/70"}`}>
                    <p className={`font-body text-xs font-bold uppercase tracking-widest ${isSpaceTheme ? "text-cyan-300" : "text-cyan-700"}`}>
                      {language === "id" ? "📐 Format Penulisan Eliminasi" : language === "en" ? "📐 Elimination Format" : "📐 加減法の書き方"}
                    </p>
                  </div>
                  <div className="p-4 overflow-x-auto font-mono text-sm">
                    <div className={`grid grid-cols-[1fr_58px_1fr] text-[10px] uppercase tracking-wider font-body mb-2 ${isSpaceTheme ? "text-white/30" : "text-slate-500"}`}>
                      <div className="text-center">{language === "id" ? "Persamaan Asal" : language === "en" ? "Original Equation" : "元の方程式"}</div>
                      <div className="text-center">{language === "id" ? "Pengali" : language === "en" ? "Multiplier" : "倍数"}</div>
                      <div className="text-center">{language === "id" ? "Bentuk Baru" : language === "en" ? "New Form" : "変換後"}</div>
                    </div>
                    <div className={`rounded-t-lg grid grid-cols-[1fr_58px_1fr] border ${isSpaceTheme ? "border-white/10" : "border-slate-200"}`}>
                      <div className="px-3 py-2.5 flex flex-col gap-0.5">
                        <span className={`text-[10px] font-body ${isSpaceTheme ? "text-white/30" : "text-slate-400"}`}>{language === "id" ? "PLDV (1)" : language === "en" ? "Eq (1)" : "式 (1)"}</span>
                        <span className={isSpaceTheme ? "text-white/70" : "text-slate-700"}>ax + by = c</span>
                      </div>
                      <div className={`flex items-center justify-center border-x ${isSpaceTheme ? "border-white/10 bg-amber-900/10" : "border-slate-200 bg-amber-50"}`}><span className={`font-bold ${isSpaceTheme ? "text-amber-300" : "text-amber-600"}`}>× k₁</span></div>
                      <div className="px-3 py-2.5 flex items-center"><span className={isSpaceTheme ? "text-cyan-200" : "text-cyan-700"}>k₁ax + k₁by = k₁c</span></div>
                    </div>
                    <div className={`rounded-b-lg grid grid-cols-[1fr_58px_1fr] border-x border-b ${isSpaceTheme ? "border-white/10" : "border-slate-200"}`}>
                      <div className="px-3 py-2.5 flex flex-col gap-0.5">
                        <span className={`text-[10px] font-body ${isSpaceTheme ? "text-white/30" : "text-slate-400"}`}>{language === "id" ? "PLDV (2)" : language === "en" ? "Eq (2)" : "式 (2)"}</span>
                        <span className={isSpaceTheme ? "text-white/70" : "text-slate-700"}>dx + ey = f</span>
                      </div>
                      <div className={`flex items-center justify-center border-x ${isSpaceTheme ? "border-white/10 bg-amber-900/10" : "border-slate-200 bg-amber-50"}`}><span className={`font-bold ${isSpaceTheme ? "text-amber-300" : "text-amber-600"}`}>× k₂</span></div>
                      <div className="px-3 py-2.5 flex items-center"><span className={isSpaceTheme ? "text-cyan-200" : "text-cyan-700"}>k₂dx + k₂ey = k₂f</span></div>
                    </div>
                    <div className={`relative border-t-2 mt-1 ${isSpaceTheme ? "border-white/30" : "border-slate-400"}`}>
                      <div className={`absolute right-0 -top-3.5 px-2 ${isSpaceTheme ? "bg-slate-900" : "bg-white"}`}><span className={`font-bold text-base ${isSpaceTheme ? "text-red-400" : "text-red-500"}`}>(±)</span></div>
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="grid grid-cols-[1fr_58px_1fr]"><div /><div /><div className="px-3 py-0.5"><span className={`font-bold whitespace-pre ${isSpaceTheme ? "text-yellow-300" : "text-yellow-600"}`}>{`         px = q`}</span></div></div>
                      <div className="grid grid-cols-[1fr_58px_1fr]"><div /><div /><div className="px-3 py-0.5 flex items-center"><span className={`font-bold whitespace-pre ${isSpaceTheme ? "text-emerald-300" : "text-emerald-600"}`}>{`          x = `}</span><span className={`font-bold ${isSpaceTheme ? "text-emerald-300" : "text-emerald-600"}`}><InlineMath math="\dfrac{q}{p}" /></span></div></div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.advantageTitle}</strong> {t.advantageDesc}</p>
                </div>
              </div>
            )}
          </div>

          {/* LANGKAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Minus className="w-5 h-5" />} iconColor="text-red-400" title={t.secLangkah} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.summaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.summaryDesc}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.stepsTitle}</p>
                  <Step no="1" title={t.step1Title} color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">{t.step1Desc}</p>
                    <div className="mt-2"><BlockMath math="\begin{cases} 2x + 3y = 12 \quad (1)\\ 4x + y = 10 \quad\ (2) \end{cases}" /></div>
                  </Step>
                  <Step no="2" title={t.step2Title} color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">{t.step2Desc}</p>
                    <div className="mt-2">
                      <p className="text-white/60 text-xs">{language === "id" ? "Eliminasi x: kalikan P1 dengan 2, P2 tetap" : language === "en" ? "Eliminate x: multiply P1 by 2, keep P2" : "xを消去：P1を2倍、P2はそのまま"}</p>
                    </div>
                  </Step>
                  <Step no="3" title={t.step3Title} color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">{t.step3Desc}</p>
                    <div className="mt-2 font-mono text-sm space-y-1">
                      <div className="flex items-center gap-2"><span className="text-white/80">2x + 3y = 12</span><span className="text-yellow-300 font-bold">|× 2|</span><span className="text-cyan-300 font-bold">4x + 6y = 24</span></div>
                      <div className="flex items-center gap-2"><span className="text-white/80">4x +  y  = 10</span><span className="text-yellow-300 font-bold">|× 1|</span><span className="text-cyan-300 font-bold">4x +  y  = 10</span></div>
                    </div>
                  </Step>
                  <Step no="4" title={t.step4Title} color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">{t.step4Desc}</p>
                    <div className="mt-2 font-mono text-sm inline-block min-w-0">
                      <div className="flex items-center gap-3 pr-6"><span className="text-white/80">4x + 6y = 24</span></div>
                      <div className="flex items-center gap-3"><span className="text-white/80">4x +  y = 10</span><span className="text-red-400 font-bold">−</span></div>
                      <div className="border-t-2 border-white/30 my-1.5" />
                      <div className="flex items-center gap-3 pr-6"><span className="text-cyan-300 font-bold">5y = 14</span></div>
                      <div className="flex items-center gap-3 pr-6"><span className="text-yellow-300 font-bold font-mono">&nbsp;y =&nbsp;</span><span className="text-yellow-300 font-bold"><InlineMath math="\dfrac{14}{5}" /></span></div>
                    </div>
                  </Step>
                  <Step no="5" title={t.step5Title} color="border-yellow-500/30 bg-yellow-900/10">
                    <p className="text-white/70">{t.step5Desc}</p>
                  </Step>
                </div>
              </div>
            )}
          </div>

          {/* LAB */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.secLab} />
            <div className="px-5 pb-5 space-y-3">
              <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.labDesc}</p>
              </div>
              <EliminasiInteraktif />
            </div>
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secContoh} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.easy} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {t.q1}<br />
                      <InlineMath math="3x + y = 7" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="x + y = 3" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.solution}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1L1} <InlineMath math="y" /> {t.q1L1b} <InlineMath math="x" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.q1L1Note}</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-4">P1</span><span className="text-white font-mono">3x + y = 7</span></div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1"><span className="text-white/40 w-4">P2</span><span className="text-white font-mono">x + y = 3</span><span className="text-red-400 ml-auto text-xs">({t.q2Subtracted})</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-white/40 w-4"></span><span className="text-cyan-300 font-mono font-bold">2x + 0 = 4</span></div>
                      </div>
                      <BlockMath math="2x = 4 \;\Rightarrow\; x = 2" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1L2} <InlineMath math="x" /> {t.q1L1b} <InlineMath math="y" />:</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.q1L2Note}</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-8">P1</span><span className="text-white font-mono">3x + y = 7</span></div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1"><span className="text-white/40 w-8">P2×3</span><span className="text-white font-mono">3x + 3y = 9</span><span className="text-red-400 ml-auto text-xs">({t.q2Subtracted})</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-white/40 w-8"></span><span className="text-cyan-300 font-mono font-bold">0 + (−2y) = −2</span></div>
                      </div>
                      <BlockMath math="-2y = -2 \;\Rightarrow\; y = 1" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1L3}</strong></p>
                      <BlockMath math="P1: 3(2) + 1 = 6 + 1 = 7 \checkmark" />
                      <BlockMath math="P2: 2 + 1 = 3 \checkmark" />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">{t.q1Answer} <InlineMath math="x = 2,\ y = 1" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.medium} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {t.q2}<br />
                      <InlineMath math="2x + 3y = 16" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="5x - 2y = 2" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.solution}</p>
                    <p className="font-body text-xs text-white/60">{t.q2Intro}</p>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2EliminateY}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">
                        {language === "id" ? "KPK dari 3 dan 2 adalah 6. Kalikan P1 × 2 dan P2 × 3." : language === "en" ? "LCM of 3 and 2 is 6. Multiply P1 × 2 and P2 × 3." : "3と2の最小公倍数は6。P1×2とP2×3。"}
                      </p>
                      <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 text-sm font-body mb-2">
                        <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">{t.q2EqLabel}</p>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P1</span><span className="text-white/80">2x + 3y = 16</span><span className="text-yellow-300 font-bold mx-1">|×2|</span><span className="text-cyan-300 font-bold">4x + 6y = 32</span></div>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P2</span><span className="text-white/80">5x − 2y = 2</span><span className="text-yellow-300 font-bold mx-1">|×3|</span><span className="text-cyan-300 font-bold">15x − 6y = 6</span></div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-8 shrink-0">P1×2</span><span className="text-white font-mono">4x + 6y = 32</span></div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1"><span className="text-white/40 w-8 shrink-0">P2×3</span><span className="text-white font-mono">15x − 6y = 6</span><span className="text-green-300 ml-auto text-xs font-bold px-1.5 py-0.5 rounded bg-green-900/50 border border-green-500/30">{t.q2Added}</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-white/40 w-8 shrink-0"></span><span className="text-cyan-300 font-mono font-bold">19x = 38</span></div>
                      </div>
                      <BlockMath math="19x = 38 \;\Rightarrow\; x = 2" />
                      <p className="font-body text-xs text-white/50 -mt-2 text-center">{t.q2Note1}</p>
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2EliminateX}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">
                        {language === "id" ? "KPK dari 2 dan 5 adalah 10. Kalikan P1 × 5 dan P2 × 2." : language === "en" ? "LCM of 2 and 5 is 10. Multiply P1 × 5 and P2 × 2." : "2と5の最小公倍数は10。P1×5とP2×2。"}
                      </p>
                      <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 text-sm font-body mb-2">
                        <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">{t.q2EqLabel}</p>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P1</span><span className="text-white/80">2x + 3y = 16</span><span className="text-yellow-300 font-bold mx-1">|×5|</span><span className="text-cyan-300 font-bold">10x + 15y = 80</span></div>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P2</span><span className="text-white/80">5x − 2y = 2</span><span className="text-yellow-300 font-bold mx-1">|×2|</span><span className="text-cyan-300 font-bold">10x − 4y = 4</span></div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-8 shrink-0">P1×5</span><span className="text-white font-mono">10x + 15y = 80</span></div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1"><span className="text-white/40 w-8 shrink-0">P2×2</span><span className="text-white font-mono">10x − 4y = 4</span><span className="text-red-300 ml-auto text-xs font-bold px-1.5 py-0.5 rounded bg-red-900/50 border border-red-500/30">{t.q2Subtracted}</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-white/40 w-8 shrink-0"></span><span className="text-cyan-300 font-mono font-bold">19y = 76</span></div>
                      </div>
                      <BlockMath math="19y = 76 \;\Rightarrow\; y = 4" />
                    </div>

                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2Verify}</strong></p>
                      <BlockMath math="P1: 2(2) + 3(4) = 4 + 12 = 16 \checkmark" />
                      <BlockMath math="P2: 5(2) - 2(4) = 10 - 8 = 2 \checkmark" />
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">{t.q2Tip} <InlineMath math="x = 2,\ y = 4" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — SULIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.hard} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q3}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.solution}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L1}</strong></p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                        <p>{t.misalkan} <InlineMath math="m" /> = {t.q3MangoVar.split("=")[1].trim()}</p>
                        <p>{t.misalkan} <InlineMath math="j" /> = {t.q3OrangeVar.split("=")[1].trim()}</p>
                      </div>
                      <BlockMath math="\begin{cases} 4m + 6j = 132 \quad (1) \\ 3m + 2j = 72 \quad\ (2) \end{cases}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L2}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.q3L2Note}</p>
                      <BlockMath math="\begin{cases} 2m + 3j = 66 \quad (1') \\ 3m + 2j = 72 \quad (2) \end{cases}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L3}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.q3L3Note}</p>
                      <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 text-sm font-body mb-2">
                        <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">{t.q3EqLabel}</p>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-6 shrink-0">P1'</span><span className="text-white/80">2m + 3j = 66</span><span className="text-yellow-300 font-bold mx-1">|×3|</span><span className="text-cyan-300 font-bold">6m + 9j = 198</span></div>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-6 shrink-0">P2</span><span className="text-white/80">3m + 2j = 72</span><span className="text-yellow-300 font-bold mx-1">|×2|</span><span className="text-cyan-300 font-bold">6m + 4j = 144</span></div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 text-sm font-body">
                        <div className="flex items-center gap-2 pr-2"><span className="text-white/40 w-10 shrink-0">P1'×3</span><span className="text-white font-mono">6m + 9j = 198</span></div>
                        <div className="flex items-center gap-2 pr-2 pb-1 border-b border-white/20"><span className="text-white/40 w-10 shrink-0">P2×2</span><span className="text-white font-mono">6m + 4j = 144</span><span className="text-red-400 font-bold ml-2">−</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-white/40 w-10 shrink-0"></span><span className="text-cyan-300 font-mono font-bold">5j = 54</span></div>
                      </div>
                      <BlockMath math="j = \frac{54}{5} = 10.8" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L4}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.q3L4Note}</p>
                      <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 text-sm font-body mb-2">
                        <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">{t.q3EqLabel2}</p>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-6 shrink-0">P1'</span><span className="text-white/80">2m + 3j = 66</span><span className="text-yellow-300 font-bold mx-1">|×2|</span><span className="text-cyan-300 font-bold">4m + 6j = 132</span></div>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-6 shrink-0">P2</span><span className="text-white/80">3m + 2j = 72</span><span className="text-yellow-300 font-bold mx-1">|×3|</span><span className="text-cyan-300 font-bold">9m + 6j = 216</span></div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 text-sm font-body">
                        <div className="flex items-center gap-2 pr-2"><span className="text-white/40 w-10 shrink-0">P1'×2</span><span className="text-white font-mono">4m + 6j = 132</span></div>
                        <div className="flex items-center gap-2 pr-2 pb-1 border-b border-white/20"><span className="text-white/40 w-10 shrink-0">P2×3</span><span className="text-white font-mono">9m + 6j = 216</span><span className="text-red-400 font-bold ml-2">−</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-white/40 w-10 shrink-0"></span><span className="text-cyan-300 font-mono font-bold">−5m = −84</span></div>
                      </div>
                      <BlockMath math="m = \frac{84}{5} = 16.8" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L5}</strong></p>
                      <BlockMath math="P1: 4(16.8) + 6(10.8) = 67.2 + 64.8 = 132 \checkmark" />
                      <BlockMath math="P2: 3(16.8) + 2(10.8) = 50.4 + 21.6 = 72 \checkmark" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2 space-y-1">
                      <p className="font-body text-xs text-red-300 font-bold">{t.q3Answer}</p>
                      <p className="font-body text-xs text-white/50">{t.q3Warning}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PERBANDINGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="perbandingan" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={`🔍 ${t.comparisonTitle}`} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-violet-900/50">
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">{t.comparisonAspect}</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">{t.graphMethod}</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">{t.subMethod}</th>
                        <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">{t.elimMethod}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.comparisonRows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-white font-semibold">{row[0]}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-blue-300">{row[1]}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-green-300">{row[2]}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-red-300">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-violet-200">{t.comparisonTip}</p>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={t.secRangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {t.summaryPoints.map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-2">
                  <p className="font-body text-xs text-center text-red-300 font-bold mb-1">{t.summaryCore}</p>
                  <BlockMath math="\text{equalize coeff.} \;\xrightarrow{+ \text{ or } -}\; \text{variable vanishes} \;\Rightarrow\; \text{solve}" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
              {t.backBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetodeEliminasiPage;
