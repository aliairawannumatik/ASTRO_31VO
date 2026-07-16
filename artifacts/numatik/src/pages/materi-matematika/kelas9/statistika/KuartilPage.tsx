import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import KuartilAnimasiMateri from "@/components/KuartilAnimasiMateri";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────────────────────────── */

const levelLabels: Record<string, Record<Language, string>> = {
  MUDAH:  { id: "MUDAH",  en: "EASY",   ja: "基本" },
  SEDANG: { id: "SEDANG", en: "MEDIUM", ja: "標準" },
  SULIT:  { id: "SULIT",  en: "HARD",   ja: "発展" },
};
function levelLabel(level: string, language: Language): string {
  return levelLabels[level]?.[language] ?? level;
}

const pageTrans = {
  id: {
    h1: "UKURAN LETAK DATA",
    h2: "Kuartil Data",
    ctx: "Kelas 9 · Statistika · Materi Matematika",
    back: "← Kembali ke Statistika Kelas 9",
    contohLabel: "Contoh",
    pembahasan: "PEMBAHASAN:",
  },
  en: {
    h1: "MEASURES OF POSITION",
    h2: "Quartile Data",
    ctx: "Grade 9 · Statistics · Math Material",
    back: "← Back to Grade 9 Statistics",
    contohLabel: "Example",
    pembahasan: "SOLUTION:",
  },
  ja: {
    h1: "位置の尺度",
    h2: "四分位数データ",
    ctx: "中学3年・統計・数学教材",
    back: "← 中学3年統計に戻る",
    contohLabel: "例題",
    pembahasan: "解説：",
  },
} as const;

const sectionTitles = {
  id: {
    intro: "🌟 Apa Itu Kuartil?",
    konsep1: "📘 Sub-Bab 1: Kuartil Data Tunggal",
    contoh1: "📝 Contoh Soal — Kuartil Data Tunggal",
    konsep2: "📘 Sub-Bab 2: Kuartil pada Tabel Distribusi Frekuensi Tunggal",
    contoh2: "📝 Contoh Soal — Kuartil Tabel Distribusi Frekuensi Tunggal",
    rangkuman: "📋 Rangkuman — Kuartil",
  },
  en: {
    intro: "🌟 What Is a Quartile?",
    konsep1: "📘 Sub-Topic 1: Quartiles of Single Data",
    contoh1: "📝 Examples — Quartiles of Single Data",
    konsep2: "📘 Sub-Topic 2: Quartiles from a Single Frequency Distribution Table",
    contoh2: "📝 Examples — Quartiles from a Frequency Distribution Table",
    rangkuman: "📋 Summary — Quartiles",
  },
  ja: {
    intro: "🌟 四分位数とは？",
    konsep1: "📘 サブトピック1：単一データの四分位数",
    contoh1: "📝 例題 — 単一データの四分位数",
    konsep2: "📘 サブトピック2：単純度数分布表の四分位数",
    contoh2: "📝 例題 — 度数分布表の四分位数",
    rangkuman: "📋 まとめ — 四分位数",
  },
} as const;

const introTrans = {
  id: {
    p1a: "Kamu sudah kenal dengan ", p1b: "rata-rata, median, dan modus", p1c: " sebagai ukuran pemusatan data. Sekarang, kita naik level ke ", p1d: "ukuran letak data", p1e: " — yaitu nilai-nilai yang membagi data menjadi bagian-bagian yang sama besar setelah data diurutkan.",
    quartileCardTitle: "Kuartil (Q)",
    quartileCardDescA: "Nilai yang membagi data terurut menjadi ", quartileCardDescB: "4 bagian", quartileCardDescC: " yang sama banyak. Ada tiga kuartil: ", quartileCardDescD: ", ", quartileCardDescE: ", dan ", quartileCardDescF: ".",
    illustrationLabel: "📐 Ilustrasi Pembagian Kuartil",
    badges: [
      { q: "Q₁", label: "Kuartil Bawah", desc: "25% data di bawahnya" },
      { q: "Q₂", label: "Kuartil Tengah", desc: "Sama dengan Median (50%)" },
      { q: "Q₃", label: "Kuartil Atas", desc: "75% data di bawahnya" },
    ],
    warningTitle: "Langkah Wajib Pertama:",
    warningTextA: "Data harus ", warningTextB: "diurutkan dari terkecil ke terbesar", warningTextC: " sebelum menghitung kuartil apapun!",
  },
  en: {
    p1a: "You already know ", p1b: "mean, median, and mode", p1c: " as measures of central tendency. Now let's level up to ", p1d: "measures of position", p1e: " — values that divide sorted data into equal-sized parts.",
    quartileCardTitle: "Quartile (Q)",
    quartileCardDescA: "A value that divides sorted data into ", quartileCardDescB: "4 equal parts", quartileCardDescC: ". There are three quartiles: ", quartileCardDescD: ", ", quartileCardDescE: ", and ", quartileCardDescF: ".",
    illustrationLabel: "📐 Illustration of Quartile Division",
    badges: [
      { q: "Q₁", label: "Lower Quartile", desc: "25% of data is below it" },
      { q: "Q₂", label: "Middle Quartile", desc: "Same as the Median (50%)" },
      { q: "Q₃", label: "Upper Quartile", desc: "75% of data is below it" },
    ],
    warningTitle: "Mandatory First Step:",
    warningTextA: "Data must be ", warningTextB: "sorted from smallest to largest", warningTextC: " before calculating any quartile!",
  },
  ja: {
    p1a: "すでに", p1b: "平均値・中央値・最頻値", p1c: "というデータの中心を示す尺度を学びましたね。ここでは、", p1d: "位置の尺度", p1e: "というレベルに進みます — これは、並べ替えたデータを同じ大きさの部分に分ける値です。",
    quartileCardTitle: "四分位数（Q）",
    quartileCardDescA: "並べ替えたデータを", quartileCardDescB: "4つの等しい部分", quartileCardDescC: "に分ける値です。四分位数は3つあります：", quartileCardDescD: "、", quartileCardDescE: "、", quartileCardDescF: "。",
    illustrationLabel: "📐 四分位数の分割イラスト",
    badges: [
      { q: "Q₁", label: "第1四分位数（下位）", desc: "その下に25%のデータ" },
      { q: "Q₂", label: "第2四分位数（中位）", desc: "中央値と同じ（50%）" },
      { q: "Q₃", label: "第3四分位数（上位）", desc: "その下に75%のデータ" },
    ],
    warningTitle: "必須の最初のステップ：",
    warningTextA: "四分位数を計算する前に、データを", warningTextB: "小さい順に並べ替える", warningTextC: "必要があります！",
  },
} as const;

const konsep1Trans = {
  id: {
    heading: "🎯 Cara Menentukan Kuartil Data Tunggal",
    introA: "Cukup dengan ", introB: "4 langkah mudah", introC: " — urutkan data, cari ", introD: " dahulu, lalu tentukan ", introE: " dan ", introF: " sebagai median kaum bawah dan kaum atas.",
    steps: [
      { title: "Urutkan data", desc: "Susun semua data dari nilai terkecil ke terbesar." },
      { title: "Cari Q₂ terlebih dahulu", desc: "Q₂ = median seluruh data. Jika n ganjil → nilai ke-½(n+1). Jika n genap → rata-rata nilai ke-n/2 dan ke-(n/2+1)." },
      { title: "Bagi data menjadi dua kaum", desc: "Kaum Bawah = semua data di bawah Q₂. Kaum Atas = semua data di atas Q₂. (Jika n ganjil, nilai Q₂ tidak dimasukkan ke kaum manapun.)" },
      { title: "Cari Q₁ dan Q₃", desc: "Q₁ = median Kaum Bawah. Q₃ = median Kaum Atas." },
    ],
    illustrationATitle: "📌 Ilustrasi A — Data n = 9 (Ganjil)",
    illustrationAData: "Data terurut: 2, 4, 6, 8, 10, 12, 14, 16, 18",
    step2Label: "Langkah 2 — Cari Q₂",
    step2AText: "n = 9 (ganjil) → Q₂ = data ke-5 = ",
    step3Label: "Langkah 3 — Bagi dua kaum (Q₂ tidak masuk keduanya)",
    kaumBawah: "← Kaum Bawah (4 data)",
    kaumAtas: "Kaum Atas (4 data) →",
    q1AnnotationA: "Q₁ = median kaum bawah = ",
    q3AnnotationA: "Q₃ = median kaum atas = ",
    illustrationBTitle: "📌 Ilustrasi B — Data n = 8 (Genap)",
    illustrationBData: "Data terurut: 4, 6, 7, 8, 9, 10, 11, 13",
    step2BTextA: "n = 8 (genap) → Q₂ = rata-rata data ke-4 dan ke-5 = ",
    step3BLabel: "Langkah 3 — Bagi dua kaum (n genap → langsung belah di tengah)",
    warningTitle: "Kunci Ingat:",
    warningTextA: "Selalu cari ", warningTextB: " dulu → pisahkan menjadi Kaum Bawah dan Kaum Atas → cari median masing-masing kaum untuk mendapat ", warningTextC: " dan ", warningTextD: ".",
  },
  en: {
    heading: "🎯 How to Find the Quartiles of Single Data",
    introA: "Just ", introB: "4 easy steps", introC: " — sort the data, find ", introD: " first, then determine ", introE: " and ", introF: " as the median of the lower half and upper half.",
    steps: [
      { title: "Sort the data", desc: "Arrange all data from smallest to largest." },
      { title: "Find Q₂ first", desc: "Q₂ = median of all the data. If n is odd → the ½(n+1)-th value. If n is even → the average of the n/2-th and (n/2+1)-th values." },
      { title: "Split the data into two halves", desc: "Lower Half = all data below Q₂. Upper Half = all data above Q₂. (If n is odd, the Q₂ value itself is not included in either half.)" },
      { title: "Find Q₁ and Q₃", desc: "Q₁ = median of the Lower Half. Q₃ = median of the Upper Half." },
    ],
    illustrationATitle: "📌 Illustration A — Data n = 9 (Odd)",
    illustrationAData: "Sorted data: 2, 4, 6, 8, 10, 12, 14, 16, 18",
    step2Label: "Step 2 — Find Q₂",
    step2AText: "n = 9 (odd) → Q₂ = 5th value = ",
    step3Label: "Step 3 — Split into two halves (Q₂ belongs to neither)",
    kaumBawah: "← Lower Half (4 values)",
    kaumAtas: "Upper Half (4 values) →",
    q1AnnotationA: "Q₁ = median of the lower half = ",
    q3AnnotationA: "Q₃ = median of the upper half = ",
    illustrationBTitle: "📌 Illustration B — Data n = 8 (Even)",
    illustrationBData: "Sorted data: 4, 6, 7, 8, 9, 10, 11, 13",
    step2BTextA: "n = 8 (even) → Q₂ = average of the 4th and 5th values = ",
    step3BLabel: "Step 3 — Split into two halves (n even → split exactly in the middle)",
    warningTitle: "Key Reminder:",
    warningTextA: "Always find ", warningTextB: " first → split into Lower Half and Upper Half → find the median of each half to get ", warningTextC: " and ", warningTextD: ".",
  },
  ja: {
    heading: "🎯 単一データの四分位数の求め方",
    introA: "たった", introB: "4つの簡単なステップ", introC: "です — データを並べ替え、まず", introD: "を求め、それから", introE: "と", introF: "を下半分・上半分の中央値として決定します。",
    steps: [
      { title: "データを並べ替える", desc: "すべてのデータを小さい順から大きい順に並べます。" },
      { title: "先にQ₂を求める", desc: "Q₂ = 全データの中央値。nが奇数なら第½(n+1)番目の値。nが偶数ならn/2番目と(n/2+1)番目の平均。" },
      { title: "データを2つの半分に分ける", desc: "下半分 = Q₂より小さいすべてのデータ。上半分 = Q₂より大きいすべてのデータ。（nが奇数の場合、Q₂の値自体はどちらの半分にも含めません。）" },
      { title: "Q₁とQ₃を求める", desc: "Q₁ = 下半分の中央値。Q₃ = 上半分の中央値。" },
    ],
    illustrationATitle: "📌 例A — データ n = 9（奇数）",
    illustrationAData: "並べ替えたデータ：2, 4, 6, 8, 10, 12, 14, 16, 18",
    step2Label: "ステップ2 — Q₂を求める",
    step2AText: "n = 9（奇数）→ Q₂ = 第5番目の値 = ",
    step3Label: "ステップ3 — 2つの半分に分ける（Q₂はどちらにも含めない）",
    kaumBawah: "← 下半分（4個のデータ）",
    kaumAtas: "上半分（4個のデータ）→",
    q1AnnotationA: "Q₁ = 下半分の中央値 = ",
    q3AnnotationA: "Q₃ = 上半分の中央値 = ",
    illustrationBTitle: "📌 例B — データ n = 8（偶数）",
    illustrationBData: "並べ替えたデータ：4, 6, 7, 8, 9, 10, 11, 13",
    step2BTextA: "n = 8（偶数）→ Q₂ = 第4番目と第5番目の平均 = ",
    step3BLabel: "ステップ3 — 2つの半分に分ける（nが偶数 → ちょうど中央で分割）",
    warningTitle: "覚えておくべきポイント：",
    warningTextA: "常に", warningTextB: "を先に求める → 下半分と上半分に分ける → 各半分の中央値を求めて", warningTextC: "と", warningTextD: "を得る。",
  },
} as const;

const konsep2Trans = {
  id: {
    heading: "🎯 Ringkasan Intisari",
    introA: "Ketika data disajikan dalam ", introB: "tabel distribusi frekuensi tunggal", introC: ", kita tidak perlu menuliskan seluruh data satu per satu. Cukup gunakan ", introD: "frekuensi kumulatif", introE: " untuk menemukan posisi letak kuartil.",
    stepsHeading: "Langkah Mencari Kuartil dari Tabel Frekuensi Tunggal",
    steps: [
      "Hitung total frekuensi n = Σfᵢ",
      "Tentukan posisi kuartil: Q₁ di posisi ¼(n+1), Q₂ di posisi ½(n+1), Q₃ di posisi ¾(n+1)",
      "Buat kolom frekuensi kumulatif (FK) dari baris paling atas",
      "Temukan nilai data yang FK-nya pertama kali ≥ posisi kuartil",
    ],
    tableTitle: "📋 Contoh Tabel Distribusi Frekuensi Tunggal — Nilai Ujian 40 Siswa",
    colNilai: "Nilai (x)", colFrekuensi: "Frekuensi (f)", colFK: "FK (Kumulatif)", total: "Total",
    posNote: "n = 40, posisi kuartil:",
    q1Explain: "Posisi Q₁ = 1(40+1)/4 = 10,25. FK pertama yang ≥ 10,25 adalah FK = 18, sehingga:",
    q2Explain: "Posisi Q₂ = 2(40+1)/4 = 20,5. FK pertama yang ≥ 20,5 adalah FK = 28, sehingga:",
    q3Explain: "Posisi Q₃ = 3(40+1)/4 = 30,75. FK pertama yang ≥ 30,75 adalah FK = 35, sehingga:",
    warningTitle: "Ingat:",
    warningTextA: "Nilai kuartil adalah nilai ", warningTextB: " yang memiliki FK pertama kali ", warningTextC: "sama dengan atau melebihi", warningTextD: " posisi kuartil yang dicari.",
  },
  en: {
    heading: "🎯 Key Summary",
    introA: "When data is shown in a ", introB: "single frequency distribution table", introC: ", we don't need to write out every data point one by one. We simply use the ", introD: "cumulative frequency", introE: " to find each quartile's position.",
    stepsHeading: "Steps to Find Quartiles from a Single Frequency Table",
    steps: [
      "Calculate the total frequency n = Σfᵢ",
      "Determine the quartile positions: Q₁ at position ¼(n+1), Q₂ at position ½(n+1), Q₃ at position ¾(n+1)",
      "Build a cumulative frequency (CF) column starting from the top row",
      "Find the data value whose CF is the first to reach ≥ the quartile position",
    ],
    tableTitle: "📋 Sample Single Frequency Table — Exam Scores of 40 Students",
    colNilai: "Score (x)", colFrekuensi: "Frequency (f)", colFK: "CF (Cumulative)", total: "Total",
    posNote: "n = 40, quartile positions:",
    q1Explain: "Position Q₁ = 1(40+1)/4 = 10.25. The first CF ≥ 10.25 is CF = 18, so:",
    q2Explain: "Position Q₂ = 2(40+1)/4 = 20.5. The first CF ≥ 20.5 is CF = 28, so:",
    q3Explain: "Position Q₃ = 3(40+1)/4 = 30.75. The first CF ≥ 30.75 is CF = 35, so:",
    warningTitle: "Remember:",
    warningTextA: "The quartile value is the value of ", warningTextB: " whose CF is the first to be ", warningTextC: "equal to or greater than", warningTextD: " the quartile position being sought.",
  },
  ja: {
    heading: "🎯 要点まとめ",
    introA: "データが", introB: "単純度数分布表", introC: "で示されている場合、データを1つずつ書き出す必要はありません。", introD: "累積度数", introE: "を使うだけで、各四分位数の位置を見つけられます。",
    stepsHeading: "単純度数分布表から四分位数を求めるステップ",
    steps: [
      "合計度数 n = Σfᵢ を計算する",
      "四分位数の位置を決める：Q₁は¼(n+1)、Q₂は½(n+1)、Q₃は¾(n+1)の位置",
      "最上段から累積度数（FK）の列を作る",
      "FKが四分位数の位置以上に初めて達するデータの値を見つける",
    ],
    tableTitle: "📋 単純度数分布表の例 — 生徒40人の試験の点数",
    colNilai: "点数 (x)", colFrekuensi: "度数 (f)", colFK: "累積度数 (FK)", total: "合計",
    posNote: "n = 40、四分位数の位置：",
    q1Explain: "Q₁の位置 = 1(40+1)/4 = 10.25。10.25以上になる最初のFKはFK = 18なので：",
    q2Explain: "Q₂の位置 = 2(40+1)/4 = 20.5。20.5以上になる最初のFKはFK = 28なので：",
    q3Explain: "Q₃の位置 = 3(40+1)/4 = 30.75。30.75以上になる最初のFKはFK = 35なので：",
    warningTitle: "覚えておこう：",
    warningTextA: "四分位数の値は、FKが求めている四分位数の位置に初めて", warningTextB: "以上になる", warningTextC: "値 ", warningTextD: "です。",
  },
} as const;

const rangkumanTrans = {
  id: {
    dataTunggalTitle: "Data Tunggal",
    dataTunggalPoints: [
      "Urutkan data dari kecil ke besar.",
      "Cari Q₂ (median seluruh data) terlebih dahulu.",
      "Bagi jadi Kaum Bawah dan Kaum Atas (tidak termasuk Q₂ jika n ganjil).",
      "Q₁ = median Kaum Bawah · Q₃ = median Kaum Atas.",
    ],
    tabelTitle: "Tabel Distribusi Frekuensi Tunggal",
    tabelPoints: [
      "Buat kolom frekuensi kumulatif (FK).",
      "Posisi Qₖ = k(n+1)/4",
      "Nilai Qₖ = nilai x yang FK-nya pertama ≥ posisi.",
    ],
    footerTitle: "Q₂ selalu sama dengan Median!",
    footerSubtitle: "Karena keduanya membagi data menjadi dua bagian yang sama besar (50%–50%).",
  },
  en: {
    dataTunggalTitle: "Single Data",
    dataTunggalPoints: [
      "Sort the data from smallest to largest.",
      "Find Q₂ (the median of all the data) first.",
      "Split into a Lower Half and an Upper Half (excluding Q₂ if n is odd).",
      "Q₁ = median of the Lower Half · Q₃ = median of the Upper Half.",
    ],
    tabelTitle: "Single Frequency Distribution Table",
    tabelPoints: [
      "Build a cumulative frequency (CF) column.",
      "Position of Qₖ = k(n+1)/4",
      "Value of Qₖ = the value of x whose CF is the first to reach ≥ the position.",
    ],
    footerTitle: "Q₂ is always the same as the Median!",
    footerSubtitle: "Because both divide the data into two equal halves (50%–50%).",
  },
  ja: {
    dataTunggalTitle: "単一データ",
    dataTunggalPoints: [
      "データを小さい順から大きい順に並べ替える。",
      "先にQ₂（全データの中央値）を求める。",
      "下半分と上半分に分ける（nが奇数の場合、Q₂は含めない）。",
      "Q₁ = 下半分の中央値 · Q₃ = 上半分の中央値。",
    ],
    tabelTitle: "単純度数分布表",
    tabelPoints: [
      "累積度数（FK）の列を作る。",
      "Qₖの位置 = k(n+1)/4",
      "Qₖの値 = FKが位置以上に初めて達するxの値。",
    ],
    footerTitle: "Q₂は常に中央値と同じ！",
    footerSubtitle: "どちらもデータを等しい2つの部分（50%–50%）に分けるためです。",
  },
} as const;

const rangkumanSectionTrans = {
  id: {
    judul: "Rangkuman — Kuartil",
    subjudul: "Membagi data menjadi 4 bagian sama besar — kunci analisis distribusi data!",
    ringkasan: [
      { emoji: "1️⃣", judul: "Q1 — Kuartil Bawah", isi: "Membagi 25% data terbawah. Q1 = median dari 'kaum bawah' (data di bawah Q2). Artinya 25% data berada di bawah nilai Q1." },
      { emoji: "2️⃣", judul: "Q2 — Kuartil Tengah (Median)", isi: "Q2 adalah median seluruh data. Membagi data menjadi dua kelompok sama besar. 50% data di bawah Q2, 50% di atas Q2." },
      { emoji: "3️⃣", judul: "Q3 — Kuartil Atas", isi: "Membagi 25% data teratas. Q3 = median dari 'kaum atas' (data di atas Q2). Artinya 75% data berada di bawah nilai Q3." },
      { emoji: "📏", judul: "IQR — Jangkauan Interkuartil", isi: "IQR = Q3 - Q1. Mengukur rentang 50% data bagian tengah. Tidak terpengaruh nilai ekstrem (outlier) sehingga lebih andal dari jangkauan biasa." },
    ],
    rumus: [
      { label: "Jangkauan Interkuartil", rumus: "\\text{IQR} = Q_3 - Q_1" },
      { label: "Q2 = Median seluruh data", rumus: "Q_1 < Q_2 < Q_3" },
    ],
    tips: [
      { emoji: "🔑", teks: "Langkah wajib: (1) Urutkan data dari terkecil, (2) Cari Q2 dahulu, (3) Pisah menjadi kaum bawah dan kaum atas, (4) Cari median masing-masing kaum." },
      { emoji: "⚠️", teks: "Untuk data genap: Q2 = rata-rata dua nilai tengah. Kaum bawah dan kaum atas tidak menyertakan nilai Q2 dalam pencariannya." },
      { emoji: "🛡️", teks: "IQR tidak terpengaruh outlier — berbeda dengan jangkauan total (xmaks - xmin). Gunakan IQR saat data memiliki nilai ekstrem." },
      { emoji: "💡", teks: "Q2 = Median. Jangan lupa ini! Sering muncul di soal ujian: 'cari Q2' = 'cari median'. Jawaban sama persis." },
    ],
    kesimpulan: "Kuartil membagi data menjadi 4 kelompok yang sama besar dan menjadi dasar Box Plot — alat visualisasi statistik yang digunakan di seluruh dunia. Kuartil sangat berguna untuk mendeteksi outlier, menganalisis distribusi data, dan membandingkan dua kelompok data di bidang medis, keuangan, dan machine learning!",
  },
  en: {
    judul: "Summary — Quartiles",
    subjudul: "Dividing data into 4 equal parts — the key to analyzing data distribution!",
    ringkasan: [
      { emoji: "1️⃣", judul: "Q1 — Lower Quartile", isi: "Divides off the bottom 25% of data. Q1 = median of the 'lower half' (data below Q2). This means 25% of the data lies below Q1." },
      { emoji: "2️⃣", judul: "Q2 — Middle Quartile (Median)", isi: "Q2 is the median of the entire dataset. It splits the data into two equal groups. 50% of the data lies below Q2, 50% above." },
      { emoji: "3️⃣", judul: "Q3 — Upper Quartile", isi: "Divides off the top 25% of data. Q3 = median of the 'upper half' (data above Q2). This means 75% of the data lies below Q3." },
      { emoji: "📏", judul: "IQR — Interquartile Range", isi: "IQR = Q3 - Q1. Measures the spread of the middle 50% of the data. Unaffected by extreme values (outliers), making it more reliable than the plain range." },
    ],
    rumus: [
      { label: "Interquartile Range", rumus: "\\text{IQR} = Q_3 - Q_1" },
      { label: "Q2 = Median of all data", rumus: "Q_1 < Q_2 < Q_3" },
    ],
    tips: [
      { emoji: "🔑", teks: "Required steps: (1) Sort data from smallest, (2) Find Q2 first, (3) Split into lower and upper halves, (4) Find the median of each half." },
      { emoji: "⚠️", teks: "For even-sized data: Q2 = average of the two middle values. The lower and upper halves do not include the Q2 value when searching." },
      { emoji: "🛡️", teks: "IQR is unaffected by outliers — unlike the total range (xmax - xmin). Use IQR when the data has extreme values." },
      { emoji: "💡", teks: "Q2 = Median. Don't forget this! It often appears on exams: 'find Q2' = 'find the median'. The answer is exactly the same." },
    ],
    kesimpulan: "Quartiles divide data into 4 equal groups and form the basis of the Box Plot — a statistical visualization tool used worldwide. Quartiles are extremely useful for detecting outliers, analyzing data distribution, and comparing two data groups in medicine, finance, and machine learning!",
  },
  ja: {
    judul: "まとめ — 四分位数",
    subjudul: "データを4つの等しい部分に分ける — データ分布分析の鍵！",
    ringkasan: [
      { emoji: "1️⃣", judul: "Q1 — 第1四分位数（下位）", isi: "下位25%のデータを分けます。Q1 = 「下半分」（Q2より下のデータ）の中央値。つまり、データの25%がQ1より下にあります。" },
      { emoji: "2️⃣", judul: "Q2 — 第2四分位数（中位・中央値）", isi: "Q2は全データの中央値です。データを2つの等しいグループに分けます。データの50%がQ2より下、50%がQ2より上にあります。" },
      { emoji: "3️⃣", judul: "Q3 — 第3四分位数（上位）", isi: "上位25%のデータを分けます。Q3 = 「上半分」（Q2より上のデータ）の中央値。つまり、データの75%がQ3より下にあります。" },
      { emoji: "📏", judul: "IQR — 四分位範囲", isi: "IQR = Q3 - Q1。データ中央50%の広がりを測ります。極端な値（外れ値）に影響されないため、単純な範囲より信頼性があります。" },
    ],
    rumus: [
      { label: "四分位範囲", rumus: "\\text{IQR} = Q_3 - Q_1" },
      { label: "Q2 = 全データの中央値", rumus: "Q_1 < Q_2 < Q_3" },
    ],
    tips: [
      { emoji: "🔑", teks: "必須ステップ：（1）データを小さい順に並べる、（2）先にQ2を求める、（3）下半分と上半分に分ける、（4）各半分の中央値を求める。" },
      { emoji: "⚠️", teks: "偶数個のデータの場合：Q2 = 中央の2つの値の平均。下半分と上半分にはQ2の値を含めません。" },
      { emoji: "🛡️", teks: "IQRは外れ値の影響を受けません — 全体の範囲（最大値-最小値）とは異なります。極端な値があるデータにはIQRを使いましょう。" },
      { emoji: "💡", teks: "Q2 = 中央値。これを忘れずに！試験でよく出ます：「Q2を求めよ」＝「中央値を求めよ」。答えは完全に同じです。" },
    ],
    kesimpulan: "四分位数はデータを4つの等しいグループに分け、世界中で使われている統計可視化ツールである箱ひげ図の基礎となります。四分位数は、外れ値の検出、データ分布の分析、医療・金融・機械学習の分野での2つのデータグループの比較に非常に役立ちます！",
  },
} as const;

const KuartilPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const pt = pageTrans[language];
  const st = sectionTitles[language];
  const it = introTrans[language];
  const k1 = konsep1Trans[language];
  const k2 = konsep2Trans[language];
  const rt = rangkumanTrans[language];
  const rst = rangkumanSectionTrans[language];

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
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
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{pt.h2}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {pt.ctx}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={st.intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {it.p1a}<strong className="text-cyan-300">{it.p1b}</strong>{it.p1c}<strong className="text-cyan-300">{it.p1d}</strong>{it.p1e}
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-violet-900/40 border border-violet-500/40 rounded-xl p-4">
                    <p className="font-display text-base font-bold text-violet-300 mb-2">{it.quartileCardTitle}</p>
                    <p className="font-body text-sm text-white/70">
                      {it.quartileCardDescA}<strong className="text-violet-200">{it.quartileCardDescB}</strong>{it.quartileCardDescC}<InlineMath math="Q_1" />{it.quartileCardDescD}<InlineMath math="Q_2" />{it.quartileCardDescE}<InlineMath math="Q_3" />{it.quartileCardDescF}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-wide">{it.illustrationLabel}</p>
                  <div className="flex items-center gap-1 justify-center flex-wrap">
                    {["25%", "Q₁", "25%", "Q₂", "25%", "Q₃", "25%"].map((v, i) => (
                      <div
                        key={i}
                        className={`rounded-lg px-3 py-2 text-center text-xs font-bold
                          ${v.startsWith("Q") ? "bg-violet-600/70 text-white border border-violet-400/60 min-w-[40px]" : "bg-slate-700/60 text-white/50 min-w-[48px]"}`}
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body mt-1">
                    {it.badges.map(({ q, label, desc }, i) => {
                      const colors = [
                        "bg-green-900/40 border-green-500/40 text-green-300",
                        "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
                        "bg-orange-900/40 border-orange-500/40 text-orange-300",
                      ];
                      return (
                        <div key={q} className={`border ${colors[i]} rounded-xl p-3 text-center`}>
                          <p className="font-display text-xl font-bold mb-1">{q}</p>
                          <p className="font-body text-xs font-bold text-white mb-1">{label}</p>
                          <p className="font-body text-xs text-white/50">{desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{it.warningTitle}</strong> {it.warningTextA}<strong>{it.warningTextB}</strong>{it.warningTextC}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: KUARTIL DATA TUNGGAL ────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={st.konsep1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{k1.heading}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {k1.introA}<strong className="text-green-300">{k1.introB}</strong>{k1.introC}<InlineMath math="Q_2" />{k1.introD}<InlineMath math="Q_1" />{k1.introE}<InlineMath math="Q_3" />{k1.introF}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    {k1.steps.map(({ title, desc }, i) => {
                      const colors = ["border-slate-500/40 text-slate-300", "border-cyan-500/40 text-cyan-300", "border-violet-500/40 text-violet-300", "border-green-500/40 text-green-300"];
                      const color = colors[i];
                      return (
                        <div key={i} className={`border ${color} rounded-lg p-3 flex items-start gap-3 bg-slate-800/40`}>
                          <span className={`font-display font-bold text-sm min-w-[20px] ${color.split(" ")[1]}`}>{i + 1}.</span>
                          <div>
                            <p className={`font-body text-xs font-bold ${color.split(" ")[1]}`}>{title}</p>
                            <p className="font-body text-xs text-white/65 mt-1 leading-relaxed">{desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ilustrasi Visual — n ganjil */}
                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">{k1.illustrationATitle}</p>
                  <p className="font-body text-xs text-white/60">{k1.illustrationAData.replace("10", "")}<span className="text-cyan-300 font-bold">10</span></p>

                  {/* Langkah 2: Q2 */}
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-2">{k1.step2Label}</p>
                    <p className="font-body text-xs text-white/70">{k1.step2AText}<strong className="text-cyan-300">10</strong></p>
                  </div>

                  {/* Langkah 3: Split */}
                  <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-violet-300 mb-1">{k1.step3Label}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex gap-1 flex-wrap">
                        {["2","4","6","8"].map(v => (
                          <div key={v} className="bg-green-900/50 border border-green-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-green-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-cyan-700/60 border border-cyan-400/80 rounded-lg px-2.5 py-1.5 text-center">
                        <p className="text-cyan-200 font-bold text-xs">10</p>
                        <p className="text-cyan-400 text-[10px]">Q₂</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {["12","14","16","18"].map(v => (
                          <div key={v} className="bg-orange-900/50 border border-orange-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-orange-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs font-body mt-1">
                      <span className="text-green-400 font-semibold">{k1.kaumBawah}</span>
                      <span className="text-orange-400 font-semibold ml-auto">{k1.kaumAtas}</span>
                    </div>
                  </div>

                  {/* Langkah 4: Q1 Q3 */}
                  <p className="font-body text-xs text-white/60">{k1.q1AnnotationA}</p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <BlockMath math="Q_1 = \frac{4+6}{2} = 5" />
                    <BlockMath math="Q_2 = 10" />
                  </div>
                  <p className="font-body text-xs text-white/60">{k1.q3AnnotationA}</p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <BlockMath math="Q_3 = \frac{14+16}{2} = 15" />
                  </div>
                </div>

                {/* Ilustrasi Visual — n genap */}
                <div className="bg-slate-800/60 border border-indigo-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-indigo-300 uppercase tracking-wide">{k1.illustrationBTitle}</p>
                  <p className="font-body text-xs text-white/60">{k1.illustrationBData}</p>

                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-1">{k1.step2Label}</p>
                    <p className="font-body text-xs text-white/70">{k1.step2BTextA}<InlineMath math="\frac{8+9}{2} = 8{,}5" /></p>
                  </div>

                  <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-violet-300 mb-1">{k1.step3BLabel}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex gap-1">
                        {["4","6","7","8"].map(v => (
                          <div key={v} className="bg-green-900/50 border border-green-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-green-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-l-2 border-cyan-500/60 self-stretch mx-1" />
                      <div className="flex gap-1">
                        {["9","10","11","13"].map(v => (
                          <div key={v} className="bg-orange-900/50 border border-orange-500/50 rounded-lg px-2.5 py-1.5 text-center">
                            <p className="text-orange-300 font-bold text-xs">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs font-body mt-1">
                      <span className="text-green-400 font-semibold">{k1.kaumBawah}</span>
                      <span className="text-orange-400 font-semibold ml-auto">{k1.kaumAtas}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <BlockMath math="Q_1 = \frac{6+7}{2} = 6{,}5" />
                    <BlockMath math="Q_2 = 8{,}5" />
                    <BlockMath math="Q_3 = \frac{10+11}{2} = 10{,}5" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{k1.warningTitle}</strong> {k1.warningTextA}<InlineMath math="Q_2" />{k1.warningTextB}<InlineMath math="Q_1" />{k1.warningTextC}<InlineMath math="Q_3" />{k1.warningTextD}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KALKULATOR KUARTIL INTERAKTIF ───────────────────────── */}
          <KuartilAnimasiMateri language={language} />

          {/* ── CONTOH SOAL SUB-BAB 1 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400" title={st.contoh1} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("MUDAH", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? (
                        <>Data nilai ulangan 9 siswa adalah: 5, 7, 4, 8, 6, 9, 3, 7, 10.<br />Tentukan nilai <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!</>
                      ) : language === "en" ? (
                        <>The test scores of 9 students are: 5, 7, 4, 8, 6, 9, 3, 7, 10.<br />Determine the value of <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, and <InlineMath math="Q_3" />!</>
                      ) : (
                        <>9人の生徒の試験の点数は：5, 7, 4, 8, 6, 9, 3, 7, 10。<br /><InlineMath math="Q_1" />、<InlineMath math="Q_2" />、<InlineMath math="Q_3" />の値を求めなさい！</>
                      )}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p><strong className="text-white">Langkah 1 — Urutkan data:</strong></p>
                          <div className="flex gap-2 flex-wrap">
                            {["3","4","5","6","7","7","8","9","10"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-3 py-2 text-center border font-bold text-sm
                                ${i === 4 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" : "bg-slate-700/60 border-green-500/30 text-green-300"}`}>
                                {v}
                                {i === 4 && <div className="text-cyan-400 text-[10px] mt-0.5">Q₂</div>}
                              </div>
                            ))}
                          </div>
                          <p className="text-white/50 text-xs">n = 9 (ganjil)</p>
                          <p><strong className="text-white">Langkah 2 — Cari Q₂:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 9 (ganjil) → Q₂ = data ke-5</p>
                            <BlockMath math="Q_2 = 7" />
                          </div>
                          <p><strong className="text-white">Langkah 3 — Bagi dua kaum (Q₂ tidak masuk):</strong></p>
                          <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 rounded p-3">
                            <div className="space-y-1">
                              <p className="text-xs text-green-400 font-semibold">Kaum Bawah:</p>
                              <div className="flex gap-1">
                                {["3","4","5","6"].map(v => (
                                  <div key={v} className="bg-green-900/50 border border-green-500/40 rounded px-2 py-1 text-green-300 font-bold text-xs">{v}</div>
                                ))}
                              </div>
                            </div>
                            <div className="mx-2 text-cyan-400 font-bold text-xs">| Q₂=7 |</div>
                            <div className="space-y-1">
                              <p className="text-xs text-orange-400 font-semibold">Kaum Atas:</p>
                              <div className="flex gap-1">
                                {["7","8","9","10"].map(v => (
                                  <div key={v} className="bg-orange-900/50 border border-orange-500/40 rounded px-2 py-1 text-orange-300 font-bold text-xs">{v}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p><strong className="text-white">Langkah 4 — Cari Q₁ dan Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = median kaum bawah {"{3, 4, 5, 6}"} → rata-rata data ke-2 dan ke-3</p>
                            <BlockMath math="Q_1 = \frac{4 + 5}{2} = 4{,}5" />
                            <p className="text-xs text-white/60">Q₃ = median kaum atas {"{7, 8, 9, 10}"} → rata-rata data ke-2 dan ke-3</p>
                            <BlockMath math="Q_3 = \frac{8 + 9}{2} = 8{,}5" />
                          </div>
                          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                            <p><strong className="text-green-300">Hasil: </strong><InlineMath math="Q_1 = 4{,}5" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8{,}5" /></p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p><strong className="text-white">Step 1 — Sort the data:</strong></p>
                          <div className="flex gap-2 flex-wrap">
                            {["3","4","5","6","7","7","8","9","10"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-3 py-2 text-center border font-bold text-sm
                                ${i === 4 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" : "bg-slate-700/60 border-green-500/30 text-green-300"}`}>
                                {v}
                                {i === 4 && <div className="text-cyan-400 text-[10px] mt-0.5">Q₂</div>}
                              </div>
                            ))}
                          </div>
                          <p className="text-white/50 text-xs">n = 9 (odd)</p>
                          <p><strong className="text-white">Step 2 — Find Q₂:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 9 (odd) → Q₂ = 5th value</p>
                            <BlockMath math="Q_2 = 7" />
                          </div>
                          <p><strong className="text-white">Step 3 — Split into two halves (Q₂ excluded):</strong></p>
                          <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 rounded p-3">
                            <div className="space-y-1">
                              <p className="text-xs text-green-400 font-semibold">Lower Half:</p>
                              <div className="flex gap-1">
                                {["3","4","5","6"].map(v => (
                                  <div key={v} className="bg-green-900/50 border border-green-500/40 rounded px-2 py-1 text-green-300 font-bold text-xs">{v}</div>
                                ))}
                              </div>
                            </div>
                            <div className="mx-2 text-cyan-400 font-bold text-xs">| Q₂=7 |</div>
                            <div className="space-y-1">
                              <p className="text-xs text-orange-400 font-semibold">Upper Half:</p>
                              <div className="flex gap-1">
                                {["7","8","9","10"].map(v => (
                                  <div key={v} className="bg-orange-900/50 border border-orange-500/40 rounded px-2 py-1 text-orange-300 font-bold text-xs">{v}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p><strong className="text-white">Step 4 — Find Q₁ and Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = median of the lower half {"{3, 4, 5, 6}"} → average of the 2nd and 3rd values</p>
                            <BlockMath math="Q_1 = \frac{4 + 5}{2} = 4.5" />
                            <p className="text-xs text-white/60">Q₃ = median of the upper half {"{7, 8, 9, 10}"} → average of the 2nd and 3rd values</p>
                            <BlockMath math="Q_3 = \frac{8 + 9}{2} = 8.5" />
                          </div>
                          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                            <p><strong className="text-green-300">Result: </strong><InlineMath math="Q_1 = 4.5" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8.5" /></p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong className="text-white">ステップ1 — データを並べ替える：</strong></p>
                          <div className="flex gap-2 flex-wrap">
                            {["3","4","5","6","7","7","8","9","10"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-3 py-2 text-center border font-bold text-sm
                                ${i === 4 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" : "bg-slate-700/60 border-green-500/30 text-green-300"}`}>
                                {v}
                                {i === 4 && <div className="text-cyan-400 text-[10px] mt-0.5">Q₂</div>}
                              </div>
                            ))}
                          </div>
                          <p className="text-white/50 text-xs">n = 9（奇数）</p>
                          <p><strong className="text-white">ステップ2 — Q₂を求める：</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 9（奇数）→ Q₂ = 第5番目の値</p>
                            <BlockMath math="Q_2 = 7" />
                          </div>
                          <p><strong className="text-white">ステップ3 — 2つの半分に分ける（Q₂は含めない）：</strong></p>
                          <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 rounded p-3">
                            <div className="space-y-1">
                              <p className="text-xs text-green-400 font-semibold">下半分：</p>
                              <div className="flex gap-1">
                                {["3","4","5","6"].map(v => (
                                  <div key={v} className="bg-green-900/50 border border-green-500/40 rounded px-2 py-1 text-green-300 font-bold text-xs">{v}</div>
                                ))}
                              </div>
                            </div>
                            <div className="mx-2 text-cyan-400 font-bold text-xs">| Q₂=7 |</div>
                            <div className="space-y-1">
                              <p className="text-xs text-orange-400 font-semibold">上半分：</p>
                              <div className="flex gap-1">
                                {["7","8","9","10"].map(v => (
                                  <div key={v} className="bg-orange-900/50 border border-orange-500/40 rounded px-2 py-1 text-orange-300 font-bold text-xs">{v}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p><strong className="text-white">ステップ4 — Q₁とQ₃を求める：</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = 下半分{"{3, 4, 5, 6}"}の中央値 → 第2番目と第3番目の平均</p>
                            <BlockMath math="Q_1 = \frac{4 + 5}{2} = 4{,}5" />
                            <p className="text-xs text-white/60">Q₃ = 上半分{"{7, 8, 9, 10}"}の中央値 → 第2番目と第3番目の平均</p>
                            <BlockMath math="Q_3 = \frac{8 + 9}{2} = 8{,}5" />
                          </div>
                          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                            <p><strong className="text-green-300">結果：</strong><InlineMath math="Q_1 = 4{,}5" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8{,}5" /></p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SEDANG", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? (
                        <>Data berat badan (kg) 12 siswa: 45, 50, 52, 48, 60, 55, 47, 63, 58, 49, 54, 61.<br />Tentukan <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!</>
                      ) : language === "en" ? (
                        <>The weights (kg) of 12 students: 45, 50, 52, 48, 60, 55, 47, 63, 58, 49, 54, 61.<br />Determine <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, and <InlineMath math="Q_3" />!</>
                      ) : (
                        <>12人の生徒の体重（kg）：45, 50, 52, 48, 60, 55, 47, 63, 58, 49, 54, 61。<br /><InlineMath math="Q_1" />、<InlineMath math="Q_2" />、<InlineMath math="Q_3" />を求めなさい！</>
                      )}
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p><strong>Langkah 1 — Urutkan data (n = 12, genap):</strong></p>
                          <div className="flex gap-1 flex-wrap">
                            {["45","47","48","49","50","52","54","55","58","60","61","63"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                                ${i < 6 ? "bg-green-900/40 border-green-500/40 text-green-300" : "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                                {v}
                              </div>
                            ))}
                          </div>
                          <p><strong>Langkah 2 — Cari Q₂:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 12 (genap) → Q₂ = rata-rata data ke-6 dan ke-7</p>
                            <BlockMath math="Q_2 = \frac{52 + 54}{2} = 53" />
                          </div>
                          <p><strong>Langkah 3 — Bagi dua kaum (n genap → belah tepat di tengah):</strong></p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                              <p className="text-green-400 font-bold mb-1">Kaum Bawah (6 data):</p>
                              <p className="text-white/70">45, 47, 48, 49, 50, 52</p>
                            </div>
                            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                              <p className="text-orange-400 font-bold mb-1">Kaum Atas (6 data):</p>
                              <p className="text-white/70">54, 55, 58, 60, 61, 63</p>
                            </div>
                          </div>
                          <p><strong>Langkah 4 — Cari Q₁ dan Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = median kaum bawah {"{45,47,48,49,50,52}"} → rata-rata data ke-3 dan ke-4</p>
                            <BlockMath math="Q_1 = \frac{48 + 49}{2} = 48{,}5" />
                            <p className="text-xs text-white/60">Q₃ = median kaum atas {"{54,55,58,60,61,63}"} → rata-rata data ke-3 dan ke-4</p>
                            <BlockMath math="Q_3 = \frac{58 + 60}{2} = 59" />
                          </div>
                          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                            <p><strong className="text-yellow-300">Hasil: </strong><InlineMath math="Q_1 = 48{,}5" /> kg · <InlineMath math="Q_2 = 53" /> kg · <InlineMath math="Q_3 = 59" /> kg</p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p><strong>Step 1 — Sort the data (n = 12, even):</strong></p>
                          <div className="flex gap-1 flex-wrap">
                            {["45","47","48","49","50","52","54","55","58","60","61","63"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                                ${i < 6 ? "bg-green-900/40 border-green-500/40 text-green-300" : "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                                {v}
                              </div>
                            ))}
                          </div>
                          <p><strong>Step 2 — Find Q₂:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 12 (even) → Q₂ = average of the 6th and 7th values</p>
                            <BlockMath math="Q_2 = \frac{52 + 54}{2} = 53" />
                          </div>
                          <p><strong>Step 3 — Split into two halves (n even → split exactly in the middle):</strong></p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                              <p className="text-green-400 font-bold mb-1">Lower Half (6 values):</p>
                              <p className="text-white/70">45, 47, 48, 49, 50, 52</p>
                            </div>
                            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                              <p className="text-orange-400 font-bold mb-1">Upper Half (6 values):</p>
                              <p className="text-white/70">54, 55, 58, 60, 61, 63</p>
                            </div>
                          </div>
                          <p><strong>Step 4 — Find Q₁ and Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = median of the lower half {"{45,47,48,49,50,52}"} → average of the 3rd and 4th values</p>
                            <BlockMath math="Q_1 = \frac{48 + 49}{2} = 48.5" />
                            <p className="text-xs text-white/60">Q₃ = median of the upper half {"{54,55,58,60,61,63}"} → average of the 3rd and 4th values</p>
                            <BlockMath math="Q_3 = \frac{58 + 60}{2} = 59" />
                          </div>
                          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                            <p><strong className="text-yellow-300">Result: </strong><InlineMath math="Q_1 = 48.5" /> kg · <InlineMath math="Q_2 = 53" /> kg · <InlineMath math="Q_3 = 59" /> kg</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong>ステップ1 — データを並べ替える（n = 12、偶数）：</strong></p>
                          <div className="flex gap-1 flex-wrap">
                            {["45","47","48","49","50","52","54","55","58","60","61","63"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                                ${i < 6 ? "bg-green-900/40 border-green-500/40 text-green-300" : "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                                {v}
                              </div>
                            ))}
                          </div>
                          <p><strong>ステップ2 — Q₂を求める：</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 12（偶数）→ Q₂ = 第6番目と第7番目の平均</p>
                            <BlockMath math="Q_2 = \frac{52 + 54}{2} = 53" />
                          </div>
                          <p><strong>ステップ3 — 2つの半分に分ける（nが偶数 → ちょうど中央で分割）：</strong></p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                              <p className="text-green-400 font-bold mb-1">下半分（6個）：</p>
                              <p className="text-white/70">45, 47, 48, 49, 50, 52</p>
                            </div>
                            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                              <p className="text-orange-400 font-bold mb-1">上半分（6個）：</p>
                              <p className="text-white/70">54, 55, 58, 60, 61, 63</p>
                            </div>
                          </div>
                          <p><strong>ステップ4 — Q₁とQ₃を求める：</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = 下半分{"{45,47,48,49,50,52}"}の中央値 → 第3番目と第4番目の平均</p>
                            <BlockMath math="Q_1 = \frac{48 + 49}{2} = 48{,}5" />
                            <p className="text-xs text-white/60">Q₃ = 上半分{"{54,55,58,60,61,63}"}の中央値 → 第3番目と第4番目の平均</p>
                            <BlockMath math="Q_3 = \frac{58 + 60}{2} = 59" />
                          </div>
                          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                            <p><strong className="text-yellow-300">結果：</strong><InlineMath math="Q_1 = 48{,}5" /> kg · <InlineMath math="Q_2 = 53" /> kg · <InlineMath math="Q_3 = 59" /> kg</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SULIT", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {language === "id" ? (
                        <>Data nilai ujian 15 siswa: 72, 65, 80, 88, 74, 91, 69, 77, 83, 95, 70, 86, 78, 63, 82.<br />Tentukan <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, <InlineMath math="Q_3" />, lalu hitung berapa siswa yang nilainya berada di antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />!</>
                      ) : language === "en" ? (
                        <>The exam scores of 15 students: 72, 65, 80, 88, 74, 91, 69, 77, 83, 95, 70, 86, 78, 63, 82.<br />Determine <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, <InlineMath math="Q_3" />, then find how many students scored between <InlineMath math="Q_1" /> and <InlineMath math="Q_3" />!</>
                      ) : (
                        <>15人の生徒の試験の点数：72, 65, 80, 88, 74, 91, 69, 77, 83, 95, 70, 86, 78, 63, 82。<br /><InlineMath math="Q_1" />、<InlineMath math="Q_2" />、<InlineMath math="Q_3" />を求め、<InlineMath math="Q_1" />と<InlineMath math="Q_3" />の間にある生徒の人数を求めなさい！</>
                      )}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p><strong>Langkah 1 — Urutkan data (n = 15, ganjil):</strong></p>
                          <div className="flex gap-1 flex-wrap">
                            {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                                ${i === 7 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" :
                                  i < 7 ? "bg-green-900/40 border-green-500/40 text-green-300" :
                                  "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                                {v}
                                {i === 7 && <div className="text-cyan-400 text-[9px] mt-0.5">Q₂</div>}
                              </div>
                            ))}
                          </div>
                          <p><strong>Langkah 2 — Cari Q₂:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 15 (ganjil) → Q₂ = data ke-8</p>
                            <BlockMath math="Q_2 = 78" />
                          </div>
                          <p><strong>Langkah 3 — Bagi dua kaum (Q₂ = 78 tidak masuk):</strong></p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                              <p className="text-green-400 font-bold mb-1">Kaum Bawah (7 data):</p>
                              <p className="text-white/70">63, 65, 69, 70, 72, 74, 77</p>
                            </div>
                            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                              <p className="text-orange-400 font-bold mb-1">Kaum Atas (7 data):</p>
                              <p className="text-white/70">80, 82, 83, 86, 88, 91, 95</p>
                            </div>
                          </div>
                          <p><strong>Langkah 4 — Cari Q₁ dan Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = median kaum bawah (7 data, ganjil) → data ke-4</p>
                            <BlockMath math="Q_1 = 70" />
                            <p className="text-xs text-white/60">Q₃ = median kaum atas (7 data, ganjil) → data ke-4</p>
                            <BlockMath math="Q_3 = 86" />
                          </div>
                          <p><strong>Langkah 5 — Hitung siswa di antara Q₁ dan Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <p className="text-xs text-white/60">Cari data yang memenuhi <InlineMath math="70 < x < 86" />:</p>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => {
                                const num = parseFloat(v);
                                const inRange = num > 70 && num < 86;
                                return (
                                  <div key={i} className={`rounded px-2 py-1 text-xs font-bold border
                                    ${inRange ? "bg-red-700/50 border-red-400/60 text-white" : "bg-slate-700/60 border-slate-500/40 text-white/40"}`}>
                                    {v}
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-white/60">Jumlah data yang memenuhi:</p>
                            <BlockMath math="7 \,\mathrm{orang}" />
                          </div>
                          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                            <p><strong className="text-red-300">Jawaban: </strong><InlineMath math="Q_1=70" /> · <InlineMath math="Q_2=78" /> · <InlineMath math="Q_3=86" /><br />
                            <strong>7 siswa</strong> nilainya berada di antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />.</p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p><strong>Step 1 — Sort the data (n = 15, odd):</strong></p>
                          <div className="flex gap-1 flex-wrap">
                            {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                                ${i === 7 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" :
                                  i < 7 ? "bg-green-900/40 border-green-500/40 text-green-300" :
                                  "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                                {v}
                                {i === 7 && <div className="text-cyan-400 text-[9px] mt-0.5">Q₂</div>}
                              </div>
                            ))}
                          </div>
                          <p><strong>Step 2 — Find Q₂:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 15 (odd) → Q₂ = 8th value</p>
                            <BlockMath math="Q_2 = 78" />
                          </div>
                          <p><strong>Step 3 — Split into two halves (Q₂ = 78 excluded):</strong></p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                              <p className="text-green-400 font-bold mb-1">Lower Half (7 values):</p>
                              <p className="text-white/70">63, 65, 69, 70, 72, 74, 77</p>
                            </div>
                            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                              <p className="text-orange-400 font-bold mb-1">Upper Half (7 values):</p>
                              <p className="text-white/70">80, 82, 83, 86, 88, 91, 95</p>
                            </div>
                          </div>
                          <p><strong>Step 4 — Find Q₁ and Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = median of the lower half (7 values, odd) → 4th value</p>
                            <BlockMath math="Q_1 = 70" />
                            <p className="text-xs text-white/60">Q₃ = median of the upper half (7 values, odd) → 4th value</p>
                            <BlockMath math="Q_3 = 86" />
                          </div>
                          <p><strong>Step 5 — Count students scoring between Q₁ and Q₃:</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <p className="text-xs text-white/60">Find data satisfying <InlineMath math="70 < x < 86" />:</p>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => {
                                const num = parseFloat(v);
                                const inRange = num > 70 && num < 86;
                                return (
                                  <div key={i} className={`rounded px-2 py-1 text-xs font-bold border
                                    ${inRange ? "bg-red-700/50 border-red-400/60 text-white" : "bg-slate-700/60 border-slate-500/40 text-white/40"}`}>
                                    {v}
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-white/60">Number of matching data points:</p>
                            <BlockMath math="7 \,\mathrm{people}" />
                          </div>
                          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                            <p><strong className="text-red-300">Answer: </strong><InlineMath math="Q_1=70" /> · <InlineMath math="Q_2=78" /> · <InlineMath math="Q_3=86" /><br />
                            <strong>7 students</strong> scored between <InlineMath math="Q_1" /> and <InlineMath math="Q_3" />.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong>ステップ1 — データを並べ替える（n = 15、奇数）：</strong></p>
                          <div className="flex gap-1 flex-wrap">
                            {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => (
                              <div key={i} className={`rounded-lg px-2 py-1 font-bold text-xs border
                                ${i === 7 ? "bg-cyan-700/60 border-cyan-400/80 text-cyan-200" :
                                  i < 7 ? "bg-green-900/40 border-green-500/40 text-green-300" :
                                  "bg-orange-900/40 border-orange-500/40 text-orange-300"}`}>
                                {v}
                                {i === 7 && <div className="text-cyan-400 text-[9px] mt-0.5">Q₂</div>}
                              </div>
                            ))}
                          </div>
                          <p><strong>ステップ2 — Q₂を求める：</strong></p>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-white/60 mb-1">n = 15（奇数）→ Q₂ = 第8番目の値</p>
                            <BlockMath math="Q_2 = 78" />
                          </div>
                          <p><strong>ステップ3 — 2つの半分に分ける（Q₂ = 78は含めない）：</strong></p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                              <p className="text-green-400 font-bold mb-1">下半分（7個）：</p>
                              <p className="text-white/70">63, 65, 69, 70, 72, 74, 77</p>
                            </div>
                            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                              <p className="text-orange-400 font-bold mb-1">上半分（7個）：</p>
                              <p className="text-white/70">80, 82, 83, 86, 88, 91, 95</p>
                            </div>
                          </div>
                          <p><strong>ステップ4 — Q₁とQ₃を求める：</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁ = 下半分（7個、奇数）の中央値 → 第4番目の値</p>
                            <BlockMath math="Q_1 = 70" />
                            <p className="text-xs text-white/60">Q₃ = 上半分（7個、奇数）の中央値 → 第4番目の値</p>
                            <BlockMath math="Q_3 = 86" />
                          </div>
                          <p><strong>ステップ5 — Q₁とQ₃の間にある生徒の数を数える：</strong></p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <p className="text-xs text-white/60"><InlineMath math="70 < x < 86" />を満たすデータを探す：</p>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {["63","65","69","70","72","74","77","78","80","82","83","86","88","91","95"].map((v, i) => {
                                const num = parseFloat(v);
                                const inRange = num > 70 && num < 86;
                                return (
                                  <div key={i} className={`rounded px-2 py-1 text-xs font-bold border
                                    ${inRange ? "bg-red-700/50 border-red-400/60 text-white" : "bg-slate-700/60 border-slate-500/40 text-white/40"}`}>
                                    {v}
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-white/60">条件を満たすデータの数：</p>
                            <BlockMath math="7 \,\mathrm{人}" />
                          </div>
                          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                            <p><strong className="text-red-300">答え：</strong><InlineMath math="Q_1=70" /> · <InlineMath math="Q_2=78" /> · <InlineMath math="Q_3=86" /><br />
                            <strong>7人</strong>の生徒の点数が<InlineMath math="Q_1" />と<InlineMath math="Q_3" />の間にあります。</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: KUARTIL TABEL DISTRIBUSI FREKUENSI TUNGGAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400" title={st.konsep2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">{k2.heading}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {k2.introA}<strong className="text-blue-300">{k2.introB}</strong>{k2.introC}<strong className="text-blue-300">{k2.introD}</strong>{k2.introE}
                  </p>

                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs text-white/50 text-center mb-2">{k2.stepsHeading}</p>
                    <div className="space-y-2">
                      {k2.steps.map((text, i) => (
                        <div key={i} className="border bg-blue-900/30 border-blue-500/30 text-blue-200 rounded-lg p-3 flex items-start gap-3">
                          <span className="font-display font-bold text-blue-400 text-sm min-w-[20px]">{i + 1}.</span>
                          <p className="font-body text-xs text-blue-100">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contoh Tabel Distribusi Frekuensi Tunggal */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
                  <div className="bg-blue-800/30 px-4 py-2">
                    <p className="font-body text-xs font-bold text-blue-200 uppercase tracking-wide">{k2.tableTitle}</p>
                  </div>
                  <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="bg-slate-700/40">
                          <th className="px-3 py-2 text-left text-blue-300 font-bold">{k2.colNilai}</th>
                          <th className="px-3 py-2 text-center text-white/70">{k2.colFrekuensi}</th>
                          <th className="px-3 py-2 text-center text-yellow-300 font-bold">{k2.colFK}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {[
                          ["60", "4", "4"],
                          ["65", "6", "10"],
                          ["70", "8", "18"],
                          ["75", "10", "28"],
                          ["80", "7", "35"],
                          ["85", "5", "40"],
                        ].map(([x, f, fk]) => (
                          <tr key={x} className={`hover:bg-slate-700/20
                            ${parseInt(fk) >= 10 && parseInt(fk) - parseInt(f) < 10 ? "bg-green-900/20" : ""}
                            ${parseInt(fk) >= 20 && parseInt(fk) - parseInt(f) < 20 && parseInt(fk) > 10 ? "bg-cyan-900/20" : ""}
                            ${parseInt(fk) >= 30 && parseInt(fk) - parseInt(f) < 30 && parseInt(fk) > 20 ? "bg-orange-900/20" : ""}`}>
                            <td className="px-3 py-2 text-white font-semibold">{x}</td>
                            <td className="px-3 py-2 text-center text-green-300">{f}</td>
                            <td className="px-3 py-2 text-center text-yellow-300 font-bold">{fk}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-700/30 border-t border-slate-500/50">
                          <td className="px-3 py-2 text-white font-bold">{k2.total}</td>
                          <td className="px-3 py-2 text-center text-green-400 font-bold">40</td>
                          <td className="px-3 py-2 text-center text-yellow-400 font-bold">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-white/50">{k2.posNote}</p>
                      <p className="text-xs text-white/60">{k2.q1Explain}</p>
                      <BlockMath math="Q_1 = 70" />
                      <p className="text-xs text-white/60">{k2.q2Explain}</p>
                      <BlockMath math="Q_2 = 75" />
                      <p className="text-xs text-white/60">{k2.q3Explain}</p>
                      <BlockMath math="Q_3 = 80" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{k2.warningTitle}</strong> {k2.warningTextA}<InlineMath math="x" />{k2.warningTextB}<strong>{k2.warningTextC}</strong>{k2.warningTextD}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL SUB-BAB 2 ───────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title={st.contoh2} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("MUDAH", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-3">
                      {language === "id" ? (
                        <>Diagram batang berikut menunjukkan nilai ulangan harian 20 siswa. Tentukan <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, dan <InlineMath math="Q_3" />!</>
                      ) : language === "en" ? (
                        <>The bar chart below shows the daily quiz scores of 20 students. Determine <InlineMath math="Q_1" />, <InlineMath math="Q_2" />, and <InlineMath math="Q_3" />!</>
                      ) : (
                        <>次の柱状グラフは20人の生徒の日々の小テストの点数を示しています。<InlineMath math="Q_1" />、<InlineMath math="Q_2" />、<InlineMath math="Q_3" />を求めなさい！</>
                      )}
                    </p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">
                        {language === "id" ? "Nilai Ulangan Harian 20 Siswa" : language === "en" ? "Daily Quiz Scores of 20 Students" : "20人の生徒の日々の小テストの点数"}
                      </p>
                      <svg viewBox="0 0 280 190" className="w-full max-w-xs mx-auto" aria-label="Diagram batang nilai ulangan">
                        {[0,2,4,6].map(v => {
                          const y = 148 - v * (128/6);
                          return (
                            <g key={v}>
                              <line x1="32" y1={y} x2="272" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="27" y={y+4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        <line x1="32" y1="15" x2="32" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        <line x1="32" y1="148" x2="272" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {[{val:5,f:2},{val:6,f:4},{val:7,f:6},{val:8,f:5},{val:9,f:3}].map(({val,f},i) => {
                          const slotW = 48; const barW = 32;
                          const x = 32 + i*slotW + (slotW-barW)/2;
                          const barH = f*(128/6); const y = 148-barH;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH} fill="rgba(34,197,94,0.65)" stroke="rgba(74,222,128,0.8)" strokeWidth="1" rx="2"/>
                              <text x={x+barW/2} y={y-4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#86efac">{f}</text>
                              <text x={x+barW/2} y="162" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        <text x="152" y="178" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{language === "id" ? "Nilai" : language === "en" ? "Score" : "点数"}</text>
                        <text x="10" y="82" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,82)">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p><strong>Langkah 1:</strong> Buat kolom frekuensi kumulatif (n = 20):</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Nilai</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["5","2","2"],["6","4","6"],["7","6","12"],["8","5","17"],["9","3","20"]].map(([v,f,fk]) => (
                                  <tr key={v} className={parseInt(fk) === 6 || parseInt(fk) === 12 ? "bg-blue-900/20" : parseInt(fk) === 17 ? "bg-orange-900/20" : ""}>
                                    <td className="px-3 py-1 text-white font-semibold">{v}</td>
                                    <td className="px-3 py-1 text-center text-green-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>Langkah 2:</strong> Tentukan posisi kuartil.</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Posisi Q₁ = 1(20+1)/4 = 5,25. FK ≥ 5,25 pertama adalah FK = 6:</p>
                            <BlockMath math="Q_1 = 6" />
                            <p className="text-xs text-white/60">Posisi Q₂ = 2(20+1)/4 = 10,5. FK ≥ 10,5 pertama adalah FK = 12:</p>
                            <BlockMath math="Q_2 = 7" />
                            <p className="text-xs text-white/60">Posisi Q₃ = 3(20+1)/4 = 15,75. FK ≥ 15,75 pertama adalah FK = 17:</p>
                            <BlockMath math="Q_3 = 8" />
                          </div>
                          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                            <p><strong className="text-green-300">Hasil: </strong><InlineMath math="Q_1 = 6" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8" /></p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p><strong>Step 1:</strong> Build the cumulative frequency column (n = 20):</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Score</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">CF</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["5","2","2"],["6","4","6"],["7","6","12"],["8","5","17"],["9","3","20"]].map(([v,f,fk]) => (
                                  <tr key={v} className={parseInt(fk) === 6 || parseInt(fk) === 12 ? "bg-blue-900/20" : parseInt(fk) === 17 ? "bg-orange-900/20" : ""}>
                                    <td className="px-3 py-1 text-white font-semibold">{v}</td>
                                    <td className="px-3 py-1 text-center text-green-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>Step 2:</strong> Determine the quartile positions.</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Position Q₁ = 1(20+1)/4 = 5.25. The first CF ≥ 5.25 is CF = 6:</p>
                            <BlockMath math="Q_1 = 6" />
                            <p className="text-xs text-white/60">Position Q₂ = 2(20+1)/4 = 10.5. The first CF ≥ 10.5 is CF = 12:</p>
                            <BlockMath math="Q_2 = 7" />
                            <p className="text-xs text-white/60">Position Q₃ = 3(20+1)/4 = 15.75. The first CF ≥ 15.75 is CF = 17:</p>
                            <BlockMath math="Q_3 = 8" />
                          </div>
                          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                            <p><strong className="text-green-300">Result: </strong><InlineMath math="Q_1 = 6" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8" /></p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong>ステップ1：</strong>累積度数の列を作る（n = 20）：</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">点数</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["5","2","2"],["6","4","6"],["7","6","12"],["8","5","17"],["9","3","20"]].map(([v,f,fk]) => (
                                  <tr key={v} className={parseInt(fk) === 6 || parseInt(fk) === 12 ? "bg-blue-900/20" : parseInt(fk) === 17 ? "bg-orange-900/20" : ""}>
                                    <td className="px-3 py-1 text-white font-semibold">{v}</td>
                                    <td className="px-3 py-1 text-center text-green-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>ステップ2：</strong>四分位数の位置を決める。</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁の位置 = 1(20+1)/4 = 5.25。5.25以上になる最初のFKはFK = 6：</p>
                            <BlockMath math="Q_1 = 6" />
                            <p className="text-xs text-white/60">Q₂の位置 = 2(20+1)/4 = 10.5。10.5以上になる最初のFKはFK = 12：</p>
                            <BlockMath math="Q_2 = 7" />
                            <p className="text-xs text-white/60">Q₃の位置 = 3(20+1)/4 = 15.75。15.75以上になる最初のFKはFK = 17：</p>
                            <BlockMath math="Q_3 = 8" />
                          </div>
                          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                            <p><strong className="text-green-300">結果：</strong><InlineMath math="Q_1 = 6" /> · <InlineMath math="Q_2 = 7" /> · <InlineMath math="Q_3 = 8" /></p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SEDANG", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-3">
                      {language === "id" ? (
                        <>Diagram batang berikut menunjukkan usia anggota klub robotika. Tentukan <InlineMath math="Q_3" /> dan interpretasikan maknanya!</>
                      ) : language === "en" ? (
                        <>The bar chart below shows the ages of robotics club members. Determine <InlineMath math="Q_3" /> and interpret its meaning!</>
                      ) : (
                        <>次の柱状グラフはロボット部の部員の年齢を示しています。<InlineMath math="Q_3" />を求め、その意味を解釈しなさい！</>
                      )}
                    </p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">
                        {language === "id" ? "Usia Anggota Klub Robotika (40 anggota)" : language === "en" ? "Ages of Robotics Club Members (40 members)" : "ロボット部の部員の年齢（部員40人）"}
                      </p>
                      <svg viewBox="0 0 280 190" className="w-full max-w-xs mx-auto" aria-label="Diagram batang usia anggota">
                        {[0,4,8,12].map(v => {
                          const y = 148 - v*(128/12);
                          return (
                            <g key={v}>
                              <line x1="32" y1={y} x2="272" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="27" y={y+4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        <line x1="32" y1="15" x2="32" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        <line x1="32" y1="148" x2="272" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {[{val:13,f:3},{val:14,f:7},{val:15,f:12},{val:16,f:10},{val:17,f:8}].map(({val,f},i) => {
                          const slotW = 48; const barW = 32;
                          const x = 32 + i*slotW + (slotW-barW)/2;
                          const barH = f*(128/12); const y = 148-barH;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH} fill="rgba(234,179,8,0.55)" stroke="rgba(253,224,71,0.8)" strokeWidth="1" rx="2"/>
                              <text x={x+barW/2} y={y-4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fde047">{f}</text>
                              <text x={x+barW/2} y="162" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        <text x="152" y="178" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{language === "id" ? "Usia (tahun)" : language === "en" ? "Age (years)" : "年齢（歳）"}</text>
                        <text x="10" y="82" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,82)">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p><strong>Langkah 1:</strong> Buat FK (n = 3+7+12+10+8 = 40):</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Usia</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["13","3","3"],["14","7","10"],["15","12","22"],["16","10","32"],["17","8","40"]].map(([v,f,fk]) => (
                                  <tr key={v} className={parseInt(fk) === 32 ? "bg-orange-900/20" : ""}>
                                    <td className="px-3 py-1 text-white">{v}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-400 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>Langkah 2:</strong> Hitung posisi <InlineMath math="Q_3" />:</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <BlockMath math="\text{Posisi } Q_3 = \frac{3(40+1)}{4} = \frac{123}{4} = 30{,}75" />
                            <p className="text-xs text-white/60">FK pertama yang ≥ 30,75 adalah FK = 32 (usia 16 tahun)</p>
                            <BlockMath math="\therefore Q_3 = 16" />
                          </div>
                          <p><strong>Interpretasi:</strong></p>
                          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                            <p><strong className="text-yellow-300">Q₃ = 16 tahun</strong> artinya <strong>75% anggota</strong> klub berusia ≤ 16 tahun. Hanya 25% anggota yang berusia di atas 16 tahun.</p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p><strong>Step 1:</strong> Build the CF column (n = 3+7+12+10+8 = 40):</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Age</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">CF</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["13","3","3"],["14","7","10"],["15","12","22"],["16","10","32"],["17","8","40"]].map(([v,f,fk]) => (
                                  <tr key={v} className={parseInt(fk) === 32 ? "bg-orange-900/20" : ""}>
                                    <td className="px-3 py-1 text-white">{v}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-400 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>Step 2:</strong> Calculate the position of <InlineMath math="Q_3" />:</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <BlockMath math="Q_3 \text{ position} = \frac{3(40+1)}{4} = \frac{123}{4} = 30.75" />
                            <p className="text-xs text-white/60">The first CF ≥ 30.75 is CF = 32 (age 16 years)</p>
                            <BlockMath math="\therefore Q_3 = 16" />
                          </div>
                          <p><strong>Interpretation:</strong></p>
                          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                            <p><strong className="text-yellow-300">Q₃ = 16 years</strong> means <strong>75% of members</strong> are 16 years old or younger. Only 25% of members are older than 16.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong>ステップ1：</strong>FKを作る（n = 3+7+12+10+8 = 40）：</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">年齢</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["13","3","3"],["14","7","10"],["15","12","22"],["16","10","32"],["17","8","40"]].map(([v,f,fk]) => (
                                  <tr key={v} className={parseInt(fk) === 32 ? "bg-orange-900/20" : ""}>
                                    <td className="px-3 py-1 text-white">{v}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-400 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>ステップ2：</strong><InlineMath math="Q_3" />の位置を計算する：</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <BlockMath math="Q_3 \text{の位置} = \frac{3(40+1)}{4} = \frac{123}{4} = 30.75" />
                            <p className="text-xs text-white/60">30.75以上になる最初のFKはFK = 32（16歳）</p>
                            <BlockMath math="\therefore Q_3 = 16" />
                          </div>
                          <p><strong>解釈：</strong></p>
                          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                            <p><strong className="text-yellow-300">Q₃ = 16歳</strong>とは、<strong>部員の75%</strong>が16歳以下であることを意味します。16歳より上の部員はわずか25%です。</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{levelLabel("SULIT", language)}</span>
                    <span className="font-body font-semibold text-white">{pt.contohLabel} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white mb-3">
                      {language === "id" ? (
                        <>Diagram batang berikut menunjukkan waktu tempuh (menit) 50 siswa ke sekolah. Tentukan semua kuartil dan nyatakan: berapa persen siswa yang waktu tempuhnya antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />?</>
                      ) : language === "en" ? (
                        <>The bar chart below shows the commute time (minutes) of 50 students to school. Determine all the quartiles and state: what percentage of students have a commute time between <InlineMath math="Q_1" /> and <InlineMath math="Q_3" />?</>
                      ) : (
                        <>次の柱状グラフは50人の生徒の通学時間（分）を示しています。すべての四分位数を求め、<InlineMath math="Q_1" />と<InlineMath math="Q_3" />の間に通学時間がある生徒の割合を答えなさい。</>
                      )}
                    </p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-2 text-center font-semibold">
                        {language === "id" ? "Waktu Tempuh 50 Siswa ke Sekolah" : language === "en" ? "Commute Time of 50 Students to School" : "50人の生徒の通学時間"}
                      </p>
                      <svg viewBox="0 0 300 195" className="w-full max-w-sm mx-auto" aria-label="Diagram batang waktu tempuh">
                        {[0,4,8,12,14].map(v => {
                          const y = 148 - v*(128/14);
                          return (
                            <g key={v}>
                              <line x1="34" y1={y} x2="290" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                              <text x="29" y={y+4} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.55)">{v}</text>
                            </g>
                          );
                        })}
                        <line x1="34" y1="15" x2="34" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        <line x1="34" y1="148" x2="290" y2="148" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                        {[{val:10,f:5},{val:15,f:8},{val:20,f:14},{val:25,f:12},{val:30,f:7},{val:35,f:4}].map(({val,f},i) => {
                          const slotW = 43; const barW = 28;
                          const x = 34 + i*slotW + (slotW-barW)/2;
                          const barH = f*(128/14); const y = 148-barH;
                          return (
                            <g key={val}>
                              <rect x={x} y={y} width={barW} height={barH} fill="rgba(239,68,68,0.55)" stroke="rgba(252,165,165,0.8)" strokeWidth="1" rx="2"/>
                              <text x={x+barW/2} y={y-4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fca5a5">{f}</text>
                              <text x={x+barW/2} y="162" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.65)">{val}</text>
                            </g>
                          );
                        })}
                        <text x="162" y="178" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">{language === "id" ? "Waktu (menit)" : language === "en" ? "Time (minutes)" : "時間（分）"}</text>
                        <text x="10" y="82" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" transform="rotate(-90,10,82)">{language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数"}</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{pt.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      {language === "id" ? (
                        <>
                          <p><strong>Langkah 1:</strong> Buat FK (n = 5+8+14+12+7+4 = 50):</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Waktu</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["10","5","5"],["15","8","13"],["20","14","27"],["25","12","39"],["30","7","46"],["35","4","50"]].map(([v,f,fk]) => (
                                  <tr key={v} className={
                                    parseInt(fk) === 13 ? "bg-green-900/20" :
                                    parseInt(fk) === 27 ? "bg-cyan-900/20" :
                                    parseInt(fk) === 39 ? "bg-orange-900/20" : ""
                                  }>
                                    <td className="px-3 py-1 text-white">{v}</td>
                                    <td className="px-3 py-1 text-center text-red-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>Langkah 2:</strong> Hitung posisi semua kuartil.</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Posisi Q₁ = 51/4 = 12,75. FK ≥ 12,75 pertama adalah FK=13:</p>
                            <BlockMath math="Q_1 = 15" />
                            <p className="text-xs text-white/60">Posisi Q₂ = 102/4 = 25,5. FK ≥ 25,5 pertama adalah FK=27:</p>
                            <BlockMath math="Q_2 = 20" />
                            <p className="text-xs text-white/60">Posisi Q₃ = 153/4 = 38,25. FK ≥ 38,25 pertama adalah FK=39:</p>
                            <BlockMath math="Q_3 = 25" />
                          </div>
                          <p><strong>Langkah 3:</strong> Siswa dengan waktu antara <InlineMath math="Q_1 = 15" /> dan <InlineMath math="Q_3 = 25" />:</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <p className="text-xs text-white/60">Yang termasuk: nilai 15 (f=8), 20 (f=14), 25 (f=12)</p>
                            <p className="text-xs text-white/60">Jumlah siswa:</p>
                            <BlockMath math="8 + 14 + 12 = 34 \,\mathrm{orang}" />
                            <BlockMath math="\text{Persentase} = \frac{34}{50} \times 100\% = 68\%" />
                          </div>
                          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                            <p><strong className="text-red-300">Jawaban: </strong><InlineMath math="Q_1 = 15" /> menit, <InlineMath math="Q_2 = 20" /> menit, <InlineMath math="Q_3 = 25" /> menit.<br />
                            Sebanyak <strong>34 siswa (68%)</strong> waktu tempuhnya berada antara <InlineMath math="Q_1" /> dan <InlineMath math="Q_3" />.</p>
                          </div>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p><strong>Step 1:</strong> Build the CF column (n = 5+8+14+12+7+4 = 50):</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">Time</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">CF</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["10","5","5"],["15","8","13"],["20","14","27"],["25","12","39"],["30","7","46"],["35","4","50"]].map(([v,f,fk]) => (
                                  <tr key={v} className={
                                    parseInt(fk) === 13 ? "bg-green-900/20" :
                                    parseInt(fk) === 27 ? "bg-cyan-900/20" :
                                    parseInt(fk) === 39 ? "bg-orange-900/20" : ""
                                  }>
                                    <td className="px-3 py-1 text-white">{v}</td>
                                    <td className="px-3 py-1 text-center text-red-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>Step 2:</strong> Calculate the position of every quartile.</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Position Q₁ = 51/4 = 12.75. The first CF ≥ 12.75 is CF=13:</p>
                            <BlockMath math="Q_1 = 15" />
                            <p className="text-xs text-white/60">Position Q₂ = 102/4 = 25.5. The first CF ≥ 25.5 is CF=27:</p>
                            <BlockMath math="Q_2 = 20" />
                            <p className="text-xs text-white/60">Position Q₃ = 153/4 = 38.25. The first CF ≥ 38.25 is CF=39:</p>
                            <BlockMath math="Q_3 = 25" />
                          </div>
                          <p><strong>Step 3:</strong> Students with a commute time between <InlineMath math="Q_1 = 15" /> and <InlineMath math="Q_3 = 25" />:</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <p className="text-xs text-white/60">Included: value 15 (f=8), 20 (f=14), 25 (f=12)</p>
                            <p className="text-xs text-white/60">Number of students:</p>
                            <BlockMath math="8 + 14 + 12 = 34 \,\mathrm{people}" />
                            <BlockMath math="\text{Percentage} = \frac{34}{50} \times 100\% = 68\%" />
                          </div>
                          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                            <p><strong className="text-red-300">Answer: </strong><InlineMath math="Q_1 = 15" /> min, <InlineMath math="Q_2 = 20" /> min, <InlineMath math="Q_3 = 25" /> min.<br />
                            A total of <strong>34 students (68%)</strong> have a commute time between <InlineMath math="Q_1" /> and <InlineMath math="Q_3" />.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong>ステップ1：</strong>FKを作る（n = 5+8+14+12+7+4 = 50）：</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-body">
                              <thead><tr className="bg-slate-700/30"><th className="px-3 py-1 text-left text-white/50">時間</th><th className="px-3 py-1 text-center text-white/50">f</th><th className="px-3 py-1 text-center text-yellow-300">FK</th></tr></thead>
                              <tbody className="divide-y divide-slate-700/20">
                                {[["10","5","5"],["15","8","13"],["20","14","27"],["25","12","39"],["30","7","46"],["35","4","50"]].map(([v,f,fk]) => (
                                  <tr key={v} className={
                                    parseInt(fk) === 13 ? "bg-green-900/20" :
                                    parseInt(fk) === 27 ? "bg-cyan-900/20" :
                                    parseInt(fk) === 39 ? "bg-orange-900/20" : ""
                                  }>
                                    <td className="px-3 py-1 text-white">{v}</td>
                                    <td className="px-3 py-1 text-center text-red-300">{f}</td>
                                    <td className="px-3 py-1 text-center text-yellow-300 font-bold">{fk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p><strong>ステップ2：</strong>すべての四分位数の位置を計算する。</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-2">
                            <p className="text-xs text-white/60">Q₁の位置 = 51/4 = 12.75。12.75以上になる最初のFKはFK=13：</p>
                            <BlockMath math="Q_1 = 15" />
                            <p className="text-xs text-white/60">Q₂の位置 = 102/4 = 25.5。25.5以上になる最初のFKはFK=27：</p>
                            <BlockMath math="Q_2 = 20" />
                            <p className="text-xs text-white/60">Q₃の位置 = 153/4 = 38.25。38.25以上になる最初のFKはFK=39：</p>
                            <BlockMath math="Q_3 = 25" />
                          </div>
                          <p><strong>ステップ3：</strong><InlineMath math="Q_1 = 15" />と<InlineMath math="Q_3 = 25" />の間に通学時間がある生徒：</p>
                          <div className="bg-slate-900/50 rounded p-3 space-y-1">
                            <p className="text-xs text-white/60">含まれるもの：15（f=8）、20（f=14）、25（f=12）</p>
                            <p className="text-xs text-white/60">生徒の人数：</p>
                            <BlockMath math="8 + 14 + 12 = 34 \,\mathrm{人}" />
                            <BlockMath math="\text{割合} = \frac{34}{50} \times 100\% = 68\%" />
                          </div>
                          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                            <p><strong className="text-red-300">答え：</strong><InlineMath math="Q_1 = 15" />分、<InlineMath math="Q_2 = 20" />分、<InlineMath math="Q_3 = 25" />分。<br />
                            合計<strong>34人（68%）</strong>の生徒の通学時間が<InlineMath math="Q_1" />と<InlineMath math="Q_3" />の間にあります。</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RANGKUMAN ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-violet-400" title={st.rangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: rt.dataTunggalTitle, color: "border-green-500/40 bg-green-900/20", points: rt.dataTunggalPoints },
                    { title: rt.tabelTitle, color: "border-blue-500/40 bg-blue-900/20", points: rt.tabelPoints },
                  ].map(({ title, color, points }) => (
                    <div key={title} className={`border ${color} rounded-xl p-4`}>
                      <p className="font-body text-sm font-bold text-white mb-2">{title}</p>
                      <ul className="space-y-1">
                        {points.map((p, i) => (
                          <li key={i} className="font-body text-xs text-white/70 flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4 text-center">
                  <p className="font-body text-sm text-violet-200">
                    <strong>{rt.footerTitle}</strong><br />
                    <span className="text-xs text-white/50">{rt.footerSubtitle}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-violet-900"
            gradientVia="via-purple-900"
            gradientTo="to-fuchsia-900"
            borderColor="border-violet-500/40"
            accentColor="text-violet-300"
            headerIcon="🎯"
            judul={rst.judul}
            subjudul={rst.subjudul}
            ringkasan={rst.ringkasan.map((r, i) => ({
              ...r,
              bg: ["bg-violet-900/50", "bg-purple-900/50", "bg-fuchsia-900/50", "bg-pink-900/50"][i],
              border: ["border-violet-500/40", "border-purple-500/40", "border-fuchsia-500/40", "border-pink-500/40"][i],
              textColor: ["text-violet-200", "text-purple-200", "text-fuchsia-200", "text-pink-200"][i],
            }))}
            rumus={rst.rumus.map((r, i) => ({
              ...r,
              bg: ["bg-violet-900/60", "bg-purple-900/60"][i],
              border: ["border-violet-400/40", "border-purple-400/40"][i],
              labelColor: ["text-violet-300", "text-purple-300"][i],
            }))}
            tips={rst.tips}
            kesimpulan={rst.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-violet-900/80 to-purple-900/80"
            kesimpulanBorder="border-violet-400/50"
            kesimpulanTextColor="text-violet-100"
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
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

export default KuartilPage;
