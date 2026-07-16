import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, Database } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const PengantarStatistikaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = {
    pageTitle:  language === "id" ? "PENGANTAR STATISTIKA"               : language === "en" ? "INTRODUCTION TO STATISTICS"            : "統計学入門",
    breadcrumb: language === "id" ? "Kelas 9 · Statistika · Materi Matematika" : language === "en" ? "Grade 9 · Statistics · Mathematics" : "中学3年 · 統計学 · 数学",
    easy:       language === "id" ? "MUDAH"  : language === "en" ? "EASY"   : "基本",
    medium:     language === "id" ? "SEDANG" : language === "en" ? "MEDIUM" : "標準",
    hard:       language === "id" ? "SULIT"  : language === "en" ? "HARD"   : "発展",
    example:    language === "id" ? "Contoh"        : language === "en" ? "Example"     : "例題",
    discussion: language === "id" ? "PEMBAHASAN:"   : language === "en" ? "DISCUSSION:" : "解説：",
    total:      language === "id" ? "Jumlah"    : language === "en" ? "Total"     : "合計",
    freq:       language === "id" ? "Frekuensi" : language === "en" ? "Frequency" : "度数",
    score:      language === "id" ? "Nilai Ulangan" : language === "en" ? "Test Score" : "試験点数",
    backBtn:    language === "id" ? "← Kembali ke Statistika" : language === "en" ? "← Back to Statistics" : "← 統計学に戻る",
    population: language === "id" ? "POPULASI"  : language === "en" ? "POPULATION" : "母集団",
    sample:     language === "id" ? "SAMPEL"    : language === "en" ? "SAMPLE"     : "標本",
    students:   (n: number) => language === "id" ? `${n} siswa` : language === "en" ? `${n} students` : `${n}人`,
    selected:   language === "id" ? "Yang dipilih"        : language === "en" ? "Selected"             : "選ばれた",
    allStudents:language === "id" ? "Seluruh siswa SMP"   : language === "en" ? "All middle school students" : "中学生全員",
    stem:       language === "id" ? "Batang" : language === "en" ? "Stem" : "茎",
    leaf:       language === "id" ? "Daun (satuan)" : language === "en" ? "Leaf (units)" : "葉（一の位）",
    mode:       language === "id" ? "Modus" : language === "en" ? "Mode" : "最頻値",
  };

  const SectionHeader = ({
    icon, iconColor, title,
  }: { icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
  );

  /* ── Rangkuman data per language ── */
  const rangkumanData = {
    id: {
      judul: "Rangkuman — Pengantar Statistika",
      subjudul: "Konsep dasar ilmu pengolahan data yang mengubah angka menjadi informasi!",
      ringkasan: [
        { emoji: "📚", judul: "Statistika vs Statistik", isi: "Statistika = ilmu yang mempelajari data. Statistik = nilai/angka hasil pengolahan data (contoh: rata-rata, median). Satu ilmu, satu angka!", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
        { emoji: "👥", judul: "Populasi vs Sampel", isi: "Populasi = seluruh objek penelitian. Sampel = sebagian populasi yang dipilih mewakili keseluruhan. Sensus = ambil seluruh populasi.", bg: "bg-cyan-900/50", border: "border-cyan-500/40", textColor: "text-cyan-200" },
        { emoji: "🔢", judul: "Jenis Data", isi: "Kualitatif = data kategori/kualitas (warna, nama, jenis). Kuantitatif = data angka yang bisa dihitung. Diskrit = bulat. Kontinu = bisa desimal.", bg: "bg-sky-900/50", border: "border-sky-500/40", textColor: "text-sky-200" },
        { emoji: "🗂️", judul: "Pengumpulan Data", isi: "Cara: wawancara, angket/kuesioner, observasi, dokumentasi. Pilih metode sesuai tujuan dan sumber data yang tersedia.", bg: "bg-indigo-900/50", border: "border-indigo-500/40", textColor: "text-indigo-200" },
      ],
      rumus: [
        { label: "Rumus Rata-Rata (preview)", rumus: "\\bar{x} = \\frac{\\sum x_i}{n}", bg: "bg-teal-900/60", border: "border-teal-400/40", labelColor: "text-teal-300" },
        { label: "Sampel dari Populasi", rumus: "n_{\\text{sampel}} = \\frac{\\%}{100} \\times N_{\\text{populasi}}", bg: "bg-cyan-900/60", border: "border-cyan-400/40", labelColor: "text-cyan-300" },
      ],
      tips: [
        { emoji: "💡", teks: "Cara mudah bedakan data: Tanya diri sendiri 'Apakah bisa dirata-rata?' Jika ya = kuantitatif. Jika tidak masuk akal (misal rata-rata golongan darah?) = kualitatif." },
        { emoji: "🎯", teks: "Sampel yang baik harus representatif (mewakili populasi) dan diambil secara acak agar tidak bias." },
        { emoji: "📊", teks: "Pilih penyajian sesuai tujuan: batang untuk perbandingan, garis untuk tren, lingkaran untuk proporsi, tabel untuk data detail." },
        { emoji: "🔍", teks: "Statistika digunakan di mana-mana: riset medis, survei politik, analisis bisnis, kecerdasan buatan, dan sains olahraga." },
      ],
      kesimpulan: "Statistika adalah ilmu yang mengubah data mentah menjadi informasi berharga. Mulai dari memahami istilah, jenis data, cara mengumpulkan, hingga cara menyajikan — semua langkah ini membentuk fondasi analisis data modern yang digunakan di setiap bidang ilmu!",
    },
    en: {
      judul: "Summary — Introduction to Statistics",
      subjudul: "The fundamental concepts of data science that turn numbers into information!",
      ringkasan: [
        { emoji: "📚", judul: "Statistics (field) vs Statistic (value)", isi: "Statistics = the science that studies data. Statistic = a value produced from processing data (e.g. mean, median). One is a field of study; one is a number!", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
        { emoji: "👥", judul: "Population vs Sample", isi: "Population = all objects in a study. Sample = a portion of the population chosen to represent the whole. Census = using the entire population.", bg: "bg-cyan-900/50", border: "border-cyan-500/40", textColor: "text-cyan-200" },
        { emoji: "🔢", judul: "Types of Data", isi: "Qualitative = category/descriptive data (colors, names, types). Quantitative = numerical data that can be computed. Discrete = whole numbers. Continuous = can be decimal.", bg: "bg-sky-900/50", border: "border-sky-500/40", textColor: "text-sky-200" },
        { emoji: "🗂️", judul: "Data Collection", isi: "Methods: interview, questionnaire/survey, observation, documentation. Choose the method that fits your goal and available data sources.", bg: "bg-indigo-900/50", border: "border-indigo-500/40", textColor: "text-indigo-200" },
      ],
      rumus: [
        { label: "Mean Formula (preview)", rumus: "\\bar{x} = \\frac{\\sum x_i}{n}", bg: "bg-teal-900/60", border: "border-teal-400/40", labelColor: "text-teal-300" },
        { label: "Sample from Population", rumus: "n_{\\text{sample}} = \\frac{\\%}{100} \\times N_{\\text{population}}", bg: "bg-cyan-900/60", border: "border-cyan-400/40", labelColor: "text-cyan-300" },
      ],
      tips: [
        { emoji: "💡", teks: "Easy way to distinguish data: Ask yourself 'Can this be averaged?' If yes = quantitative. If averaging doesn't make sense (e.g. average blood type?) = qualitative." },
        { emoji: "🎯", teks: "A good sample must be representative (of the population) and chosen randomly to avoid bias." },
        { emoji: "📊", teks: "Choose a presentation to fit your goal: bar chart for comparison, line chart for trends, pie chart for proportions, table for detailed data." },
        { emoji: "🔍", teks: "Statistics is used everywhere: medical research, political surveys, business analytics, artificial intelligence, and sports science." },
      ],
      kesimpulan: "Statistics is the science that turns raw data into valuable information. From understanding terminology, types of data, collection methods, to presentation formats — all these steps form the foundation of modern data analysis used in every field of study!",
    },
    ja: {
      judul: "まとめ — 統計学入門",
      subjudul: "数字を情報に変えるデータ処理の基本的な概念！",
      ringkasan: [
        { emoji: "📚", judul: "統計学 vs 統計量", isi: "統計学 = データを研究する学問。統計量 = データの処理から得られる値（例：平均値、中央値）。一方は学問分野、もう一方は数値！", bg: "bg-teal-900/50", border: "border-teal-500/40", textColor: "text-teal-200" },
        { emoji: "👥", judul: "母集団 vs 標本", isi: "母集団 = 研究対象のすべての要素。標本 = 全体を代表するために選ばれた母集団の一部。全数調査 = 母集団全体を使う。", bg: "bg-cyan-900/50", border: "border-cyan-500/40", textColor: "text-cyan-200" },
        { emoji: "🔢", judul: "データの種類", isi: "定性的 = カテゴリー・記述的データ（色、名前、種類）。定量的 = 計算できる数値データ。離散型 = 整数。連続型 = 小数になりうる。", bg: "bg-sky-900/50", border: "border-sky-500/40", textColor: "text-sky-200" },
        { emoji: "🗂️", judul: "データの収集", isi: "方法：インタビュー、アンケート/調査票、観察、文書調査。目的と利用可能なデータソースに合った方法を選ぶ。", bg: "bg-indigo-900/50", border: "border-indigo-500/40", textColor: "text-indigo-200" },
      ],
      rumus: [
        { label: "平均の公式（プレビュー）", rumus: "\\bar{x} = \\frac{\\sum x_i}{n}", bg: "bg-teal-900/60", border: "border-teal-400/40", labelColor: "text-teal-300" },
        { label: "母集団からの標本", rumus: "n_{\\text{sample}} = \\frac{\\%}{100} \\times N_{\\text{population}}", bg: "bg-cyan-900/60", border: "border-cyan-400/40", labelColor: "text-cyan-300" },
      ],
      tips: [
        { emoji: "💡", teks: "データを見分ける簡単な方法：「これを平均できるか？」と自問しましょう。はいなら = 定量的。平均を求めても意味がない場合（例：血液型の平均？）= 定性的。" },
        { emoji: "🎯", teks: "良い標本は代表性があり（母集団を代表している）、偏りを避けるためにランダムに選ばれる必要があります。" },
        { emoji: "📊", teks: "目的に合った提示形式を選びましょう：比較には棒グラフ、傾向には折れ線グラフ、割合には円グラフ、詳細なデータには表。" },
        { emoji: "🔍", teks: "統計学はいたるところで使われています：医学研究、政治調査、ビジネス分析、人工知能、スポーツ科学。" },
      ],
      kesimpulan: "統計学は生データを価値ある情報に変える学問です。用語の理解から、データの種類、収集方法、提示方法まで — これらすべての手順が、あらゆる学問分野で使われる現代的なデータ分析の基盤を形成しています！",
    },
  };
  const rst = rangkumanData[language];

  /* ── Chart data (language-neutral numbers) ── */
  const DATA = [
    { nilai: 50,  f: 2,  pct: "6,7%",  deg: "24°",  color: "#818cf8", turus: "||" },
    { nilai: 60,  f: 5,  pct: "16,7%", deg: "60°",  color: "#22d3ee", turus: "||||" },
    { nilai: 70,  f: 10, pct: "33,3%", deg: "120°", color: "#22c55e", turus: "|||| |||||" },
    { nilai: 80,  f: 8,  pct: "26,7%", deg: "96°",  color: "#f59e0b", turus: "|||| |||" },
    { nilai: 90,  f: 4,  pct: "13,3%", deg: "48°",  color: "#f472b6", turus: "||||" },
    { nilai: 100, f: 1,  pct: "3,3%",  deg: "12°",  color: "#f87171", turus: "|" },
  ];
  const barXs = [45, 88, 131, 174, 217, 260];
  const bw = 28;
  const scaleY = (f: number) => 140 - (f / 12) * 115;

  /* Pie chart */
  const cx = 108, cy = 88, r = 72;
  const toXY = (angleDeg: number) => ({
    x: cx + r * Math.sin(angleDeg * Math.PI / 180),
    y: cy - r * Math.cos(angleDeg * Math.PI / 180),
  });
  let cumAngle = 0;
  const slices = DATA.map(d => {
    const startAngle = cumAngle;
    const sweep = (d.f / 30) * 360;
    cumAngle += sweep;
    const p1 = toXY(startAngle);
    const p2 = toXY(cumAngle);
    const largeArc = sweep > 180 ? 1 : 0;
    return { ...d, p1, p2, largeArc };
  });

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.breadcrumb}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ===== PENGANTAR ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title={language === "id" ? "🌟 Mengapa Statistika Penting?" : language === "en" ? "🌟 Why Is Statistics Important?" : "🌟 統計学はなぜ重要か？"} />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {language === "id" ? (
                  <>Bayangkan kamu ingin tahu nilai rata-rata teman sekelasmu, atau ingin mengetahui berapa banyak siswa yang suka olahraga tertentu. Nah, untuk menjawab pertanyaan seperti itu, kamu butuh ilmu yang bernama <strong className="text-cyan-300">statistika</strong>!</>
                ) : language === "en" ? (
                  <>Imagine you want to know the average score of your classmates, or how many students like a certain sport. Well, to answer questions like that, you need a subject called <strong className="text-cyan-300">statistics</strong>!</>
                ) : (
                  <>クラスメートの平均点を知りたいとき、あるいはある特定のスポーツが好きな生徒が何人いるかを知りたいとき。そんな疑問に答えるために必要な学問が、<strong className="text-cyan-300">統計学</strong>です！</>
                )}
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-cyan-200 leading-relaxed">
                  {language === "id" ? (
                    <>Statistika ada di mana-mana: laporan cuaca, hasil survei, hasil ujian nasional, grafik penjualan, <strong className="text-cyan-300">harga saham</strong>, hingga data vaksinasi. Menguasai statistika berarti kamu mampu membaca dan mengambil keputusan dari data secara cerdas! 📊🚀</>
                  ) : language === "en" ? (
                    <>Statistics is everywhere: weather reports, survey results, national exam scores, sales charts, <strong className="text-cyan-300">stock prices</strong>, and vaccination data. Mastering statistics means you can read data and make smart decisions! 📊🚀</>
                  ) : (
                    <>統計学はいたるところにあります：天気予報、調査結果、全国テストの結果、売上グラフ、<strong className="text-cyan-300">株価</strong>、ワクチンデータ。統計学をマスターすれば、データを読んで賢明な意思決定ができるようになります！📊🚀</>
                  )}
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-600/40 bg-slate-800/60">
                <img
                  src="/harga-saham-bbca.jpeg"
                  alt={language === "id" ? "Grafik Harga Saham BBCA — contoh nyata penggunaan statistika dalam dunia keuangan" : language === "en" ? "BBCA Stock Price Chart — real-world example of statistics in finance" : "BBCA株価チャート — 金融における統計の実例"}
                  className="w-full h-auto object-contain"
                />
                <div className="px-4 py-2 bg-slate-900/70">
                  <p className="font-body text-xs text-slate-400 text-center leading-relaxed">
                    📈{" "}
                    {language === "id" ? (
                      <><strong className="text-slate-300">Grafik harga saham BBCA (Bank Central Asia)</strong> — contoh nyata data statistika di dunia keuangan.{" "}</>
                    ) : language === "en" ? (
                      <><strong className="text-slate-300">BBCA (Bank Central Asia) stock price chart</strong> — a real-world example of statistics in finance.{" "}</>
                    ) : (
                      <><strong className="text-slate-300">BBCA（バンク・セントラル・アジア）株価チャート</strong> — 金融における統計の実例。{" "}</>
                    )}
                    <a href="https://pintarsaham.id/harga-wajar-saham-bbca-update-kuartal-1-2024/#google_vignette" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300 transition-colors">
                      {language === "id" ? "Sumber: pintarsaham.id" : language === "en" ? "Source: pintarsaham.id" : "出典：pintarsaham.id"}
                    </a>
                  </p>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? (
                    <><strong>Catatan:</strong> Statistika adalah materi penting di kelas 9. Kuasai konsep dasarnya dulu sebelum lanjut ke ukuran pemusatan dan penyebaran data!</>
                  ) : language === "en" ? (
                    <><strong>Note:</strong> Statistics is an important topic in Grade 9. Master the basic concepts first before moving on to measures of central tendency and data spread!</>
                  ) : (
                    <><strong>注意：</strong>統計学は中学3年生の重要な単元です。中心傾向の指標やデータの広がりに進む前に、まず基本的な概念をしっかり身につけましょう！</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* ===== SUB-BAB 1: ISTILAH DASAR ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title={language === "id" ? "📘 Sub-Bab 1: Istilah Dasar dalam Statistika" : language === "en" ? "📘 Chapter 1: Basic Statistical Terminology" : "📘 第1節：統計学の基本用語"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-green-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? "Sebelum masuk ke perhitungan, kita perlu kenalan dulu dengan kosakata utama dalam statistika. Ada beberapa istilah yang perlu kamu hafal baik-baik:"
                  : language === "en" ? "Before diving into calculations, we need to get familiar with the main vocabulary in statistics. There are several terms you need to memorize well:"
                  : "計算に入る前に、統計学の主要な語彙に慣れ親しんでおく必要があります。しっかりと覚えておくべき用語がいくつかあります："}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">

                {/* Statistika vs Statistik */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wide">
                    📌 {language === "id" ? "Statistika vs Statistik" : language === "en" ? "Statistics vs Statistic" : "統計学 vs 統計量"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-cyan-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">{language === "id" ? "Statistika" : language === "en" ? "Statistics" : "統計学"}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? "Ilmu yang mempelajari cara mengumpulkan, menyusun, mengolah, dan menganalisis data, serta menarik kesimpulan dari data tersebut."
                        : language === "en" ? "The science of collecting, organizing, processing, and analyzing data, and drawing conclusions from that data."
                        : "データを収集・整理・処理・分析し、そのデータから結論を導く学問。"}
                      </p>
                      <p className="font-body text-xs text-cyan-400 mt-2 italic">
                        {language === "id" ? "Contoh: Bidang ilmu Statistika digunakan oleh peneliti dan pemerintah."
                        : language === "en" ? "Example: The field of Statistics is used by researchers and governments."
                        : "例：統計学という学問は、研究者や政府機関によって活用されています。"}
                      </p>
                    </div>
                    <div className="bg-indigo-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-indigo-300 mb-1">{language === "id" ? "Statistik" : language === "en" ? "Statistic" : "統計量"}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? "Nilai atau angka yang dihasilkan dari pengolahan data, seperti rata-rata, median, dan modus."
                        : language === "en" ? "A value or number produced from processing data, such as the mean, median, and mode."
                        : "データの処理から得られる値や数（平均値、中央値、最頻値など）。"}
                      </p>
                      <p className="font-body text-xs text-indigo-400 mt-2 italic">
                        {language === "id" ? "Contoh: Rata-rata nilai ulangan kelas 9A adalah 78. Angka 78 adalah statistik."
                        : language === "en" ? "Example: The average quiz score of Grade 9A is 78. The number 78 is a statistic."
                        : "例：9年Aクラスの小テストの平均点は78点。この78という数値が統計量です。"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data & Datum */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-purple-400 mb-2 uppercase tracking-wide">
                    📌 {language === "id" ? "Data & Datum" : language === "en" ? "Data & Datum" : "データ & データ個"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-purple-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-purple-300 mb-1">{language === "id" ? "Data" : language === "en" ? "Data" : "データ"}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? "Kumpulan fakta atau informasi (jamak dari datum) yang dikumpulkan untuk suatu tujuan tertentu."
                        : language === "en" ? "A collection of facts or information (plural of datum) gathered for a specific purpose."
                        : "特定の目的のために収集された事実や情報の集まり（datumの複数形）。"}
                      </p>
                      <p className="font-body text-xs text-purple-400 mt-2 italic">
                        {language === "id" ? "Contoh: {70, 80, 75, 90, 85} adalah data nilai ulangan."
                        : language === "en" ? "Example: {70, 80, 75, 90, 85} is quiz score data."
                        : "例：{70, 80, 75, 90, 85} は小テストの点数データです。"}
                      </p>
                    </div>
                    <div className="bg-pink-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-pink-300 mb-1">Datum</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? "Satu buah nilai atau informasi tunggal dari keseluruhan data yang dikumpulkan."
                        : language === "en" ? "A single value or piece of information from the entire data collected."
                        : "収集された全データの中の1つの値または情報。"}
                      </p>
                      <p className="font-body text-xs text-pink-400 mt-2 italic">
                        {language === "id" ? "Contoh: Nilai 80 adalah satu datum dari kumpulan data di atas."
                        : language === "en" ? "Example: The score 80 is one datum from the data above."
                        : "例：80という点数は上のデータの1つのデータ個です。"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Populasi & Sampel */}
                <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-orange-400 mb-2 uppercase tracking-wide">
                    📌 {language === "id" ? "Populasi & Sampel" : language === "en" ? "Population & Sample" : "母集団 & 標本"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-orange-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-orange-300 mb-1">{language === "id" ? "Populasi" : language === "en" ? "Population" : "母集団"}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? "Keseluruhan objek atau individu yang menjadi subjek penelitian/pengamatan."
                        : language === "en" ? "The entire set of objects or individuals that are the subject of research or observation."
                        : "研究・観察の対象となるすべての物体や個人の集合。"}
                      </p>
                      <p className="font-body text-xs text-orange-400 mt-2 italic">
                        {language === "id" ? "Contoh: Seluruh siswa SMP Negeri 1 (misalnya 600 siswa) adalah populasinya."
                        : language === "en" ? "Example: All students of the local middle school (e.g. 600 students) are the population."
                        : "例：ある中学校の全生徒（例えば600人）が母集団です。"}
                      </p>
                    </div>
                    <div className="bg-yellow-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300 mb-1">{language === "id" ? "Sampel" : language === "en" ? "Sample" : "標本"}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? "Sebagian kecil anggota populasi yang dipilih untuk mewakili seluruh populasi."
                        : language === "en" ? "A small portion of the population selected to represent the entire population."
                        : "母集団全体を代表するために選ばれた母集団の一部。"}
                      </p>
                      <p className="font-body text-xs text-yellow-400 mt-2 italic">
                        {language === "id" ? "Contoh: 30 siswa yang dipilih dari 600 siswa untuk mengisi kuesioner."
                        : language === "en" ? "Example: 30 students chosen from 600 students to fill out a questionnaire."
                        : "例：600人の生徒の中から問診票記入のために選ばれた30人。"}
                      </p>
                    </div>
                  </div>
                  {/* Visual populasi vs sampel */}
                  <div className="mt-3 bg-slate-900/60 rounded-lg p-3 flex flex-col items-center gap-2">
                    <p className="font-body text-xs text-white/50 text-center">
                      {language === "id" ? "ILUSTRASI POPULASI DAN SAMPEL" : language === "en" ? "POPULATION AND SAMPLE ILLUSTRATION" : "母集団と標本のイラスト"}
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <div className="bg-orange-800/50 border-2 border-orange-500/60 rounded-xl px-6 py-3 text-center">
                        <p className="text-orange-300 font-bold text-xs">{t.population}</p>
                        <p className="text-white text-lg font-bold">{t.students(600)}</p>
                        <p className="text-white/50 text-xs">{t.allStudents}</p>
                      </div>
                      <div className="text-2xl text-primary">⊃</div>
                      <div className="bg-yellow-800/50 border-2 border-yellow-500/60 rounded-xl px-6 py-3 text-center">
                        <p className="text-yellow-300 font-bold text-xs">{t.sample}</p>
                        <p className="text-white text-lg font-bold">{t.students(30)}</p>
                        <p className="text-white/50 text-xs">{t.selected}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Kualitatif vs Kuantitatif */}
                <div className="bg-slate-800/60 border border-teal-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-teal-400 mb-2 uppercase tracking-wide">
                    📌 {language === "id" ? "Jenis Data: Kualitatif & Kuantitatif" : language === "en" ? "Data Types: Qualitative & Quantitative" : "データの種類：定性的・定量的"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-teal-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-teal-300 mb-1">
                        {language === "id" ? "Data Kualitatif" : language === "en" ? "Qualitative Data" : "定性的データ"}
                      </p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? <>Data yang <strong className="text-teal-300">tidak berupa angka</strong>, melainkan berupa kategori, label, atau deskripsi. Tidak bisa dihitung secara matematis.</>
                        : language === "en" ? <>Data that is <strong className="text-teal-300">not numerical</strong>, but consists of categories, labels, or descriptions. Cannot be calculated mathematically.</>
                        : <>数値ではなく、<strong className="text-teal-300">カテゴリー・ラベル・説明</strong>で表されるデータ。数学的に計算することはできない。</>}
                      </p>
                      <div className="mt-2 space-y-1">
                        {(language === "id" ? ["✔ Warna mata (hitam, cokelat)", "✔ Jenis kelamin (laki-laki, perempuan)", "✔ Golongan darah (A, B, AB, O)"]
                        : language === "en" ? ["✔ Eye color (black, brown)", "✔ Gender (male, female)", "✔ Blood type (A, B, AB, O)"]
                        : ["✔ 目の色（黒、茶色）", "✔ 性別（男性、女性）", "✔ 血液型（A、B、AB、O）"]).map((s, i) => (
                          <p key={i} className="font-body text-xs text-teal-400">{s}</p>
                        ))}
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-blue-300 mb-1">
                        {language === "id" ? "Data Kuantitatif" : language === "en" ? "Quantitative Data" : "定量的データ"}
                      </p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">
                        {language === "id" ? <>Data yang <strong className="text-blue-300">berupa angka</strong> dan bisa dihitung atau diukur secara matematis.</>
                        : language === "en" ? <>Data that <strong className="text-blue-300">is numerical</strong> and can be counted or measured mathematically.</>
                        : <>数値であり、<strong className="text-blue-300">数学的に計算または測定</strong>できるデータ。</>}
                      </p>
                      <div className="mt-2 space-y-1">
                        {(language === "id" ? ["✔ Tinggi badan: 165 cm", "✔ Nilai ujian: 87", "✔ Jumlah siswa: 32"]
                        : language === "en" ? ["✔ Height: 165 cm", "✔ Test score: 87", "✔ Number of students: 32"]
                        : ["✔ 身長：165 cm", "✔ 試験点数：87", "✔ 生徒数：32人"]).map((s, i) => (
                          <p key={i} className="font-body text-xs text-blue-400">{s}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
                    <p className="font-body text-xs text-blue-200">
                      {language === "id" ? (
                        <><strong>Data Kuantitatif terbagi lagi:</strong><br />• <strong className="text-blue-300">Diskrit</strong> → Bilangan bulat (cacahan). Contoh: jumlah anak = 2<br />• <strong className="text-blue-300">Kontinu</strong> → Bilangan real (pengukuran). Contoh: berat badan = 52,5 kg</>
                      ) : language === "en" ? (
                        <><strong>Quantitative Data is further divided:</strong><br />• <strong className="text-blue-300">Discrete</strong> → Whole numbers (counted). Example: number of children = 2<br />• <strong className="text-blue-300">Continuous</strong> → Real numbers (measured). Example: weight = 52.5 kg</>
                      ) : (
                        <><strong>定量的データはさらに分類されます：</strong><br />• <strong className="text-blue-300">離散型</strong> → 整数（計測値）。例：子どもの数 = 2<br />• <strong className="text-blue-300">連続型</strong> → 実数（測定値）。例：体重 = 52.5 kg</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? (
                    <><strong>Tips Membedakan:</strong> Tanya diri sendiri — "Apakah data ini bisa dijumlahkan atau dirata-rata?" Jika ya → <strong>kuantitatif</strong>. Jika tidak masuk akal untuk dirata-rata (misal rata-rata golongan darah?) → <strong>kualitatif</strong>.</>
                  ) : language === "en" ? (
                    <><strong>Tip to Distinguish:</strong> Ask yourself — "Can this data be summed or averaged?" If yes → <strong>quantitative</strong>. If averaging doesn't make sense (e.g. averaging blood types?) → <strong>qualitative</strong>.</>
                  ) : (
                    <><strong>見分け方のコツ：</strong>自問してみましょう — 「このデータは合計したり平均を求めたりできるか？」はいなら → <strong>定量的</strong>。平均を求めても意味がない場合（例：血液型の平均？）→ <strong>定性的</strong>。</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-green-400"
              title={language === "id" ? "📝 Contoh Soal — Istilah Dasar Statistika" : language === "en" ? "📝 Practice Problems — Basic Statistical Terminology" : "📝 練習問題 — 統計学の基本用語"} />
            <div className="px-5 pb-5 space-y-6">

              {/* Mudah */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Seorang guru mencatat nilai ulangan harian 5 siswa: 70, 85, 90, 75, 80.\nTentukan: (a) Apakah data tersebut kualitatif atau kuantitatif? (b) Sebutkan satu datum dari data tersebut!"
                    : language === "en" ? "A teacher records the daily quiz scores of 5 students: 70, 85, 90, 75, 80.\nDetermine: (a) Is this data qualitative or quantitative? (b) Name one datum from this data!"
                    : "ある先生が5人の生徒の日々の小テストの点数を記録しました：70、85、90、75、80。\n求めなさい：(a) このデータは定性的ですか、定量的ですか？(b) このデータから1つのデータ個を挙げなさい！"}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
                        <p><strong>(a)</strong> Data nilai ulangan berupa angka dan bisa dihitung (rata-rata, dsb).</p>
                        <div className="bg-slate-900/50 rounded p-3"><p className="text-green-300 font-semibold">→ Data kuantitatif (diskrit)</p></div>
                        <p><strong>(b)</strong> Salah satu datum dari data tersebut adalah nilai <strong className="text-green-300">85</strong> (atau 70, 90, 75, 80 — pilih salah satu).</p>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>(a)</strong> Quiz scores are numbers that can be calculated (averaged, etc.).</p>
                        <div className="bg-slate-900/50 rounded p-3"><p className="text-green-300 font-semibold">→ Quantitative data (discrete)</p></div>
                        <p><strong>(b)</strong> One datum from this data is the score <strong className="text-green-300">85</strong> (or 70, 90, 75, 80 — pick any one).</p>
                      </>
                    ) : (
                      <>
                        <p><strong>(a)</strong> 小テストの点数は数値であり計算できます（平均など）。</p>
                        <div className="bg-slate-900/50 rounded p-3"><p className="text-green-300 font-semibold">→ 定量的データ（離散型）</p></div>
                        <p><strong>(b)</strong> このデータの1つのデータ個は<strong className="text-green-300">85</strong>（または70、90、75、80 — どれか1つを選ぶ）。</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Sedang */}
              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Sebuah penelitian dilakukan pada seluruh siswa kelas 9 SMP Bintang (populasi = 120 siswa). Karena keterbatasan waktu, hanya 30 siswa yang diambil datanya. Klasifikasikan data berikut sebagai kualitatif atau kuantitatif:\n(i) Hobi siswa   (ii) Tinggi badan siswa   (iii) Warna seragam   (iv) IPK siswa"
                    : language === "en" ? "A study was conducted on all Grade 9 students of Bintang Middle School (population = 120 students). Due to time constraints, data was collected from only 30 students. Classify the following data as qualitative or quantitative:\n(i) Students' hobbies   (ii) Students' heights   (iii) Color of uniform   (iv) Students' GPA"
                    : "ある中学校（母集団 = 生徒120人）の中学3年生全員を対象に研究が行われました。時間の制約から、30人の生徒のみデータが収集されました。以下のデータを定性的または定量的に分類しなさい：\n(i) 生徒の趣味   (ii) 生徒の身長   (iii) 制服の色   (iv) 生徒の成績評点"}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    {language === "id" ? (
                      <>
                        <p><strong>Populasi:</strong> 120 siswa kelas 9 SMP Bintang.</p>
                        <p><strong>Sampel:</strong> 30 siswa yang dipilih.</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>(i) Hobi → kategori/label → <span className="text-teal-400 font-semibold">Kualitatif</span></p>
                          <p>(ii) Tinggi badan → angka ukuran → <span className="text-blue-400 font-semibold">Kuantitatif Kontinu</span></p>
                          <p>(iii) Warna seragam → kategori → <span className="text-teal-400 font-semibold">Kualitatif</span></p>
                          <p>(iv) IPK → angka, bisa dirata-rata → <span className="text-blue-400 font-semibold">Kuantitatif Kontinu</span></p>
                        </div>
                      </>
                    ) : language === "en" ? (
                      <>
                        <p><strong>Population:</strong> 120 Grade 9 students at Bintang Middle School.</p>
                        <p><strong>Sample:</strong> 30 selected students.</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>(i) Hobby → category/label → <span className="text-teal-400 font-semibold">Qualitative</span></p>
                          <p>(ii) Height → measured number → <span className="text-blue-400 font-semibold">Quantitative (Continuous)</span></p>
                          <p>(iii) Uniform color → category → <span className="text-teal-400 font-semibold">Qualitative</span></p>
                          <p>(iv) GPA → number, can be averaged → <span className="text-blue-400 font-semibold">Quantitative (Continuous)</span></p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>母集団：</strong>ある中学校の中学3年生120人。</p>
                        <p><strong>標本：</strong>選ばれた30人の生徒。</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>(i) 趣味 → カテゴリー/ラベル → <span className="text-teal-400 font-semibold">定性的</span></p>
                          <p>(ii) 身長 → 数値（測定値）→ <span className="text-blue-400 font-semibold">定量的（連続型）</span></p>
                          <p>(iii) 制服の色 → カテゴリー → <span className="text-teal-400 font-semibold">定性的</span></p>
                          <p>(iv) 成績評点 → 数値、平均可能 → <span className="text-blue-400 font-semibold">定量的（連続型）</span></p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Sulit */}
              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Seorang peneliti ingin mengetahui rata-rata jam belajar siswa SMP di Kota A yang berjumlah 5.000 siswa. Ia mengambil sampel 250 siswa. Jika diketahui dari 250 siswa tersebut, total jam belajar per minggu adalah 3.750 jam, tentukan:\n(a) Rata-rata jam belajar sampel.\n(b) Apakah rata-rata ini disebut statistik atau statistika? Jelaskan."
                    : language === "en" ? "A researcher wants to find the average weekly study hours of middle school students in City A, totaling 5,000 students. They select a sample of 250 students. Given that the 250 students' total weekly study hours is 3,750 hours, determine:\n(a) The average study hours of the sample.\n(b) Is this average called a 'statistic' or 'statistics'? Explain."
                    : "ある研究者がA市の中学生（全5,000人）の週平均学習時間を調べたいと考えています。250人を標本として選びました。250人の生徒の1週間の合計学習時間が3,750時間であるとき、以下を求めなさい：\n(a) 標本の平均学習時間\n(b) この平均値は「統計量」と「統計学」のどちらと呼ばれますか？説明しなさい。"}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{language === "id" ? "Langkah 1:" : language === "en" ? "Step 1:" : "ステップ1："}</strong>{" "}
                      {language === "id" ? "Hitung rata-rata jam belajar sampel:" : language === "en" ? "Calculate the average study hours of the sample:" : "標本の平均学習時間を計算する："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\bar{x} = \frac{3750}{250} = 15" />
                      <p className="font-body text-xs text-white/50 text-center mt-1">
                        {language === "id" ? "= 15 jam/minggu" : language === "en" ? "= 15 hours/week" : "= 週15時間"}
                      </p>
                    </div>
                    <p><strong>{language === "id" ? "Langkah 2:" : language === "en" ? "Step 2:" : "ステップ2："}</strong>{" "}
                      {language === "id" ? "Identifikasi istilah yang tepat:" : language === "en" ? "Identify the correct term:" : "正しい用語を特定する："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      {language === "id" ? (
                        <>
                          <p className="text-red-300">• Angka <strong>15 jam/minggu</strong> adalah hasil pengolahan data → disebut <strong className="text-yellow-300">Statistik</strong></p>
                          <p className="text-red-300">• Proses pengumpulan, pengolahan, dan interpretasi datanya → disebut <strong className="text-cyan-300">Statistika</strong></p>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p className="text-red-300">• The number <strong>15 hours/week</strong> is a result of data processing → called a <strong className="text-yellow-300">Statistic</strong></p>
                          <p className="text-red-300">• The process of collecting, processing, and interpreting the data → called <strong className="text-cyan-300">Statistics</strong></p>
                        </>
                      ) : (
                        <>
                          <p className="text-red-300">• <strong>週15時間</strong>という数値はデータ処理の結果 → <strong className="text-yellow-300">統計量</strong>と呼ばれる</p>
                          <p className="text-red-300">• データの収集・処理・解釈のプロセス → <strong className="text-cyan-300">統計学</strong>と呼ばれる</p>
                        </>
                      )}
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Rata-rata = 15 jam/minggu; Angka 15 disebut Statistik, bukan Statistika."
                      : language === "en" ? "Average = 15 hours/week; The number 15 is called a Statistic, not Statistics."
                      : "平均 = 週15時間；15という数値は「統計量」であり、「統計学」ではない。"}
                    </strong></p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ===== SUB-BAB 2: PENGUMPULAN DATA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-purple-400"
              title={language === "id" ? "📘 Sub-Bab 2: Cara-Cara Mengumpulkan Data" : language === "en" ? "📘 Chapter 2: Methods of Data Collection" : "📘 第2節：データの収集方法"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                <p className="font-body text-sm font-semibold text-purple-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? "Ada berbagai cara untuk mengumpulkan data. Setiap metode punya kelebihan dan kekurangannya masing-masing. Memilih metode yang tepat sangat menentukan kualitas data yang kamu dapatkan!"
                  : language === "en" ? "There are various ways to collect data. Each method has its own advantages and disadvantages. Choosing the right method greatly determines the quality of the data you obtain!"
                  : "データを収集する方法はさまざまです。それぞれの方法に長所と短所があります。適切な方法を選ぶことが、取得するデータの質を大きく左右します！"}
                </p>
              </div>

              {/* Table */}
              <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl overflow-hidden">
                <div className="bg-purple-700/40 px-4 py-2">
                  <p className="font-body text-xs font-bold text-purple-200 uppercase tracking-wide">
                    📋 {language === "id" ? "Metode Pengumpulan Data" : language === "en" ? "Data Collection Methods" : "データ収集方法"}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-slate-700/50">
                        <th className="px-3 py-2 text-left text-purple-300 font-bold w-1/4">
                          {language === "id" ? "Metode" : language === "en" ? "Method" : "方法"}
                        </th>
                        <th className="px-3 py-2 text-left text-white/70 font-semibold w-2/5">
                          {language === "id" ? "Penjelasan" : language === "en" ? "Explanation" : "説明"}
                        </th>
                        <th className="px-3 py-2 text-left text-white/70 font-semibold">
                          {language === "id" ? "Contoh" : language === "en" ? "Example" : "例"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/40">
                      {(language === "id" ? [
                        ["📋 Angket / Kuesioner", "Daftar pertanyaan tertulis yang diisi oleh responden secara mandiri", "Formulir survei kepuasan belajar siswa"],
                        ["🗣️ Wawancara", "Tanya jawab langsung antara peneliti dan narasumber", "Mewawancarai guru tentang metode mengajar"],
                        ["👀 Observasi", "Mengamati objek/peristiwa secara langsung dan mencatat hasilnya", "Menghitung jumlah kendaraan yang lewat"],
                        ["📁 Dokumentasi", "Mengambil data dari catatan, arsip, atau dokumen yang sudah ada", "Data nilai siswa dari buku raport sekolah"],
                        ["🧪 Eksperimen", "Mengumpulkan data dengan cara percobaan dan perlakuan khusus", "Mencatat pertumbuhan tanaman dengan pupuk berbeda"],
                      ] : language === "en" ? [
                        ["📋 Questionnaire / Survey", "A written list of questions filled out independently by respondents", "Student learning satisfaction survey form"],
                        ["🗣️ Interview", "Direct question-and-answer between researcher and respondent", "Interviewing a teacher about teaching methods"],
                        ["👀 Observation", "Directly observing objects/events and recording the results", "Counting the number of passing vehicles"],
                        ["📁 Documentation", "Obtaining data from existing records, archives, or documents", "Student grade data from school report books"],
                        ["🧪 Experiment", "Collecting data through trials and special treatment conditions", "Recording plant growth with different fertilizers"],
                      ] : [
                        ["📋 アンケート / 調査票", "回答者が自分で記入する質問票", "生徒の学習満足度調査票"],
                        ["🗣️ インタビュー", "研究者と回答者の直接的な質疑応答", "教授法について先生にインタビューする"],
                        ["👀 観察", "対象・出来事を直接観察して結果を記録する", "通過する車両の数を数える"],
                        ["📁 文書調査", "既存の記録・文書・アーカイブからデータを取得する", "学校の成績表から生徒の成績データを取得"],
                        ["🧪 実験", "試験や特殊な処理によってデータを収集する", "異なる肥料での植物の成長を記録する"],
                      ]).map(([method, desc, ex], i) => (
                        <tr key={i} className="hover:bg-slate-700/20">
                          <td className="px-3 py-3 font-bold" style={{ color: ["#22d3ee","#86efac","#fbbf24","#fb923c","#f472b6"][i] }}>{method}</td>
                          <td className="px-3 py-3 text-white/70">{desc}</td>
                          <td className="px-3 py-3 text-white/60">{ex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Primer vs Sekunder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-2">
                    📤 {language === "id" ? "Data Primer" : language === "en" ? "Primary Data" : "一次データ"}
                  </p>
                  <p className="font-body text-xs text-white/70 leading-relaxed">
                    {language === "id" ? <>Data yang dikumpulkan <strong className="text-blue-200">langsung</strong> oleh peneliti dari sumbernya.</>
                    : language === "en" ? <>Data collected <strong className="text-blue-200">directly</strong> by the researcher from the source.</>
                    : <>研究者が情報源から<strong className="text-blue-200">直接</strong>収集したデータ。</>}
                  </p>
                  <p className="font-body text-xs text-blue-400 mt-2">
                    {language === "id" ? "Contoh: Melakukan survei sendiri kepada teman-teman sekelas."
                    : language === "en" ? "Example: Conducting your own survey among classmates."
                    : "例：クラスメートに対して自分でアンケートを行う。"}
                  </p>
                </div>
                <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-indigo-300 mb-2">
                    📥 {language === "id" ? "Data Sekunder" : language === "en" ? "Secondary Data" : "二次データ"}
                  </p>
                  <p className="font-body text-xs text-white/70 leading-relaxed">
                    {language === "id" ? <>Data yang diperoleh dari <strong className="text-indigo-200">sumber lain</strong> (sudah dikumpulkan orang lain).</>
                    : language === "en" ? <>Data obtained from <strong className="text-indigo-200">another source</strong> (already collected by someone else).</>
                    : <>他者がすでに収集した<strong className="text-indigo-200">別の情報源</strong>から得たデータ。</>}
                  </p>
                  <p className="font-body text-xs text-indigo-400 mt-2">
                    {language === "id" ? "Contoh: Mengambil data penduduk dari Badan Pusat Statistik (BPS)."
                    : language === "en" ? "Example: Taking population data from the Central Statistics Agency."
                    : "例：中央統計局から人口データを取得する。"}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? <><strong>Tips:</strong> Pilih metode pengumpulan data sesuai kebutuhan. Angket cocok untuk data banyak responden dengan waktu terbatas. Wawancara cocok bila perlu penjelasan mendalam. Observasi tepat bila data tidak bisa diperoleh lewat pertanyaan.</>
                  : language === "en" ? <><strong>Tip:</strong> Choose a data collection method to suit your needs. Questionnaires work well for many respondents with limited time. Interviews are best when deep explanations are needed. Observation is ideal when data cannot be obtained through questioning.</>
                  : <><strong>ヒント：</strong>ニーズに合ったデータ収集方法を選びましょう。アンケートは時間が限られていて多くの回答者を対象とする場合に適しています。インタビューは詳しい説明が必要な場合に最適です。観察は質問では得られないデータに適しています。</>}
                </p>
              </div>
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400"
              title={language === "id" ? "📝 Contoh Soal — Pengumpulan Data" : language === "en" ? "📝 Practice Problems — Data Collection" : "📝 練習問題 — データの収集"} />
            <div className="px-5 pb-5 space-y-6">

              {/* Mudah */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Rini ingin mengetahui mata pelajaran favorit teman-teman sekelasnya. Ia membuat daftar pertanyaan yang diisi langsung oleh 30 teman sekelasnya. Metode apa yang digunakan Rini? Termasuk data primer atau sekunder?"
                    : language === "en" ? "Rini wants to find out her classmates' favorite subjects. She creates a list of questions filled out directly by 30 classmates. What method is Rini using? Is this primary or secondary data?"
                    : "リニはクラスメートの好きな科目を知りたいと思っています。彼女は30人のクラスメートが直接記入する質問票を作りました。リニが使っている方法は何ですか？これは一次データですか、二次データですか？"}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>
                      {language === "id" ? "Rini membuat daftar pertanyaan tertulis yang diisi sendiri oleh responden."
                      : language === "en" ? "Rini creates a written list of questions filled out independently by the respondents."
                      : "リニは回答者が自分で記入する筆記質問票を作成します。"}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-300 font-semibold">
                        {language === "id" ? "Metode: Angket/Kuesioner" : language === "en" ? "Method: Questionnaire/Survey" : "方法：アンケート/調査票"}
                      </p>
                      <p className="text-green-300 font-semibold">
                        {language === "id" ? "Jenis: Data Primer (dikumpulkan langsung oleh Rini sendiri)" : language === "en" ? "Type: Primary Data (collected directly by Rini herself)" : "種類：一次データ（リニ自身が直接収集）"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sedang */}
              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Seorang peneliti ingin meneliti pengaruh belajar di luar kelas terhadap konsentrasi siswa. Ia duduk di belakang kelas dan mencatat perilaku siswa tanpa diketahui siswanya. Tentukan: (a) Metode pengumpulan data yang digunakan, (b) Mengapa metode ini dipilih?"
                    : language === "en" ? "A researcher wants to study the effect of outdoor learning on student concentration. They sit at the back of the classroom and record student behavior without the students knowing. Determine: (a) The data collection method used, (b) Why was this method chosen?"
                    : "ある研究者が、課外学習が生徒の集中力に与える影響を研究したいと考えています。研究者は生徒に気づかれないよう、教室の後ろに座って生徒の行動を記録しました。求めなさい：(a) 使用したデータ収集方法、(b) なぜこの方法が選ばれたか？"}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>(a)</strong>{" "}
                      {language === "id" ? "Peneliti mengamati dan mencatat langsung tanpa bertanya."
                      : language === "en" ? "The researcher observes and records directly without asking questions."
                      : "研究者は質問せずに直接観察し、記録します。"}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-yellow-300 font-semibold">
                        {language === "id" ? "Metode: Observasi (pengamatan langsung)" : language === "en" ? "Method: Observation (direct observation)" : "方法：観察（直接観察）"}
                      </p>
                    </div>
                    <p><strong>(b)</strong>{" "}
                      {language === "id" ? "Metode observasi dipilih karena:" : language === "en" ? "The observation method was chosen because:" : "観察法が選ばれた理由："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      {language === "id" ? (
                        <>
                          <p>• Perilaku alami siswa hanya bisa diamati secara langsung</p>
                          <p>• Jika siswa tahu sedang diamati, perilaku mereka berubah (tidak alami)</p>
                          <p className="text-yellow-300 mt-1">→ Observasi memberikan data yang lebih objektif untuk kasus ini</p>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p>• Students' natural behavior can only be observed directly</p>
                          <p>• If students know they are being observed, their behavior changes (not natural)</p>
                          <p className="text-yellow-300 mt-1">→ Observation provides more objective data for this case</p>
                        </>
                      ) : (
                        <>
                          <p>• 生徒の自然な行動は直接観察でしか見られない</p>
                          <p>• 観察されていることが分かると行動が変わる（不自然になる）</p>
                          <p className="text-yellow-300 mt-1">→ このケースでは観察法がより客観的なデータを提供する</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sulit */}
              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Seorang peneliti ingin mengumpulkan data tentang tingkat kepuasan orang tua terhadap program sekolah. Populasi adalah 800 orang tua siswa. Ia memilih 10% sebagai sampel dan menggunakan dua metode: angket untuk data umum dan wawancara untuk klarifikasi mendalam. Hitunglah jumlah sampel, dan jelaskan mengapa menggunakan dua metode sekaligus merupakan pendekatan yang tepat!"
                    : language === "en" ? "A researcher wants to collect data on parent satisfaction with school programs. The population is 800 parents. They select 10% as a sample and use two methods: a questionnaire for general data and interviews for in-depth clarification. Calculate the sample size, and explain why using two methods at once is an appropriate approach!"
                    : "ある研究者が、学校のプログラムに対する保護者の満足度に関するデータを収集したいと考えています。母集団は保護者800人です。10%を標本として選び、一般データには調査票、詳細な確認にはインタビューの2種類の方法を使用します。標本サイズを計算し、2つの方法を同時に使用することがなぜ適切なアプローチであるかを説明しなさい！"}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{language === "id" ? "Langkah 1:" : language === "en" ? "Step 1:" : "ステップ1："}</strong>{" "}
                      {language === "id" ? "Hitung jumlah sampel:" : language === "en" ? "Calculate the sample size:" : "標本サイズを計算する："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{n} = 10\% \times 800 = \frac{10}{100} \times 800 = 80" />
                      <p className="font-body text-xs text-white/50 text-center mt-1">
                        {language === "id" ? "80 orang tua" : language === "en" ? "80 parents" : "80人の保護者"}
                      </p>
                    </div>
                    <p><strong>{language === "id" ? "Langkah 2:" : language === "en" ? "Step 2:" : "ステップ2："}</strong>{" "}
                      {language === "id" ? "Alasan penggunaan dua metode:" : language === "en" ? "Reasons for using two methods:" : "2つの方法を使う理由："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      {language === "id" ? (
                        <>
                          <p>• <strong className="text-cyan-300">Angket:</strong> Efisien untuk 80 responden, menghemat waktu, bisa diisi bersamaan</p>
                          <p>• <strong className="text-cyan-300">Wawancara:</strong> Menggali alasan mendalam di balik jawaban angket</p>
                          <p>• Kombinasi keduanya → data lebih <strong className="text-yellow-300">komprehensif</strong> (kuantitatif + kualitatif)</p>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p>• <strong className="text-cyan-300">Questionnaire:</strong> Efficient for 80 respondents, saves time, can be filled simultaneously</p>
                          <p>• <strong className="text-cyan-300">Interview:</strong> Uncovers deeper reasons behind questionnaire answers</p>
                          <p>• Combining both → data is more <strong className="text-yellow-300">comprehensive</strong> (quantitative + qualitative)</p>
                        </>
                      ) : (
                        <>
                          <p>• <strong className="text-cyan-300">調査票：</strong>80人の回答者に効率的で、時間を節約でき、同時に記入可能</p>
                          <p>• <strong className="text-cyan-300">インタビュー：</strong>調査票の回答の背後にある深い理由を引き出す</p>
                          <p>• 両方の組み合わせ → データがより<strong className="text-yellow-300">包括的</strong>（定量的＋定性的）</p>
                        </>
                      )}
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Sampel = 80 orang; dua metode digunakan agar data lebih lengkap dan valid."
                      : language === "en" ? "Sample = 80 people; two methods are used to make the data more complete and valid."
                      : "標本 = 80人；2つの方法を使うことでデータがより完全で有効になる。"}
                    </strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SUB-BAB 3: PENYAJIAN DATA ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title={language === "id" ? "📘 Sub-Bab 3: Cara-Cara Menyajikan Data" : language === "en" ? "📘 Chapter 3: Methods of Data Presentation" : "📘 第3節：データの提示方法"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                <p className="font-body text-sm font-semibold text-cyan-300">🎯 {language === "id" ? "Ringkasan Intisari" : language === "en" ? "Key Summary" : "要点まとめ"}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "id" ? <>Setelah data dikumpulkan, langkah berikutnya adalah <strong className="text-cyan-300">menyajikan data</strong> agar mudah dibaca dan dipahami. Ada beberapa bentuk penyajian data yang umum digunakan:</>
                  : language === "en" ? <>After data is collected, the next step is to <strong className="text-cyan-300">present the data</strong> so it is easy to read and understand. There are several common formats for data presentation:</>
                  : <>データが収集されたら、次のステップはデータを読みやすく理解しやすい形で<strong className="text-cyan-300">提示</strong>することです。一般的に使われるデータ提示形式がいくつかあります：</>}
                </p>
              </div>

              {(() => {
                const maxF = 10;
                const pts: [number, number][] = DATA.map((d, i) => [barXs[i] + bw / 2, scaleY(d.f)]);
                const polyline = pts.map(p => p.join(",")).join(" ");
                const area = `M${pts[0][0]},140 ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length-1][0]},140 Z`;

                return (
                  <div className="flex flex-col gap-4">

                    {/* 1. TABEL */}
                    <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="font-body text-sm font-bold text-cyan-300 mb-1">
                          📋 {language === "id" ? "Tabel Distribusi Frekuensi (Data Tunggal)" : language === "en" ? "Frequency Distribution Table (Individual Data)" : "度数分布表（個別データ）"}
                        </p>
                        <p className="font-body text-xs text-white/70">
                          {language === "id" ? "Data disusun dalam baris dan kolom berdasarkan nilai tunggal. Setiap nilai memiliki frekuensi (banyak kemunculan) masing-masing."
                          : language === "en" ? "Data is arranged in rows and columns based on individual values. Each value has its own frequency (number of occurrences)."
                          : "データは個々の値に基づいて行と列に整理されます。各値には固有の度数（出現回数）があります。"}
                        </p>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-cyan-500/20">
                        <table className="w-full text-xs font-body">
                          <thead>
                            <tr className="bg-cyan-800/40">
                              <th className="px-3 py-2 text-cyan-200 font-bold text-center">
                                {language === "id" ? "Nilai (x)" : language === "en" ? "Score (x)" : "点数 (x)"}
                              </th>
                              <th className="px-3 py-2 text-cyan-200 font-bold text-center">
                                {language === "id" ? "Turus" : language === "en" ? "Tally" : "集計"}
                              </th>
                              <th className="px-3 py-2 text-cyan-200 font-bold text-center">
                                {language === "id" ? "Frekuensi (f)" : language === "en" ? "Frequency (f)" : "度数 (f)"}
                              </th>
                              <th className="px-3 py-2 text-cyan-200 font-bold text-center">
                                {language === "id" ? "Persentase" : language === "en" ? "Percentage" : "パーセント"}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-cyan-500/10">
                            {DATA.map((row, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-cyan-900/20" : "bg-slate-900/30"}>
                                <td className="px-3 py-2 text-center font-bold" style={{ color: row.color }}>{row.nilai}</td>
                                <td className="px-3 py-2 text-cyan-300 text-center tracking-widest">{row.turus}</td>
                                <td className="px-3 py-2 text-white text-center font-bold">{row.f}</td>
                                <td className="px-3 py-2 text-cyan-200 text-center">{row.pct}</td>
                              </tr>
                            ))}
                            <tr className="bg-cyan-700/30">
                              <td className="px-3 py-2 text-cyan-200 font-bold text-center">{t.total}</td>
                              <td className="px-3 py-2 text-center">—</td>
                              <td className="px-3 py-2 text-yellow-300 font-bold text-center">30</td>
                              <td className="px-3 py-2 text-yellow-300 font-bold text-center">100%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="font-body text-xs text-cyan-400 italic">
                        📌 {language === "id" ? "Data: Nilai ulangan matematika 30 siswa Kelas 9A" : language === "en" ? "Data: Math test scores of 30 Grade 9A students" : "データ：9年Aクラス30人の数学の試験点数"}
                      </p>
                    </div>

                    {/* 2. DIAGRAM BATANG */}
                    <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="font-body text-sm font-bold text-green-300 mb-1">
                          📊 {language === "id" ? "Diagram Batang" : language === "en" ? "Bar Chart" : "棒グラフ"}
                        </p>
                        <p className="font-body text-xs text-white/70">
                          {language === "id" ? "Batang tegak mewakili setiap nilai data. Tinggi batang = frekuensi. Cocok untuk membandingkan banyaknya siswa per nilai."
                          : language === "en" ? "Vertical bars represent each data value. Bar height = frequency. Ideal for comparing the number of students per score."
                          : "縦棒が各データ値を表します。棒の高さ = 度数。各点数の生徒数を比較するのに最適です。"}
                        </p>
                      </div>
                      <svg viewBox="0 0 310 175" className="w-full">
                        <rect width="310" height="175" fill="transparent" />
                        {[0,2,4,6,8,10].map(v => {
                          const y = scaleY(v);
                          return (
                            <g key={v}>
                              <line x1="36" y1={y} x2="295" y2={y} stroke="#22c55e" strokeOpacity="0.12" strokeWidth="1" />
                              <text x="32" y={y + 3} fontSize="8" fill="#86efac" textAnchor="end">{v}</text>
                            </g>
                          );
                        })}
                        {DATA.map((d, i) => {
                          const x = barXs[i];
                          const h = (d.f / 12) * 115;
                          const y = 140 - h;
                          return (
                            <g key={i}>
                              <rect x={x} y={y} width={bw} height={h} fill={d.color} fillOpacity="0.8" rx="3" />
                              <text x={x + bw / 2} y={y - 4} fontSize="9" fill={d.color} textAnchor="middle" fontWeight="bold">{d.f}</text>
                              <text x={x + bw / 2} y="158" fontSize="8" fill="#cbd5e1" textAnchor="middle">{d.nilai}</text>
                            </g>
                          );
                        })}
                        <line x1="36" y1="140" x2="295" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="36" y1="10" x2="36" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="10" y="80" fontSize="8" fill="#94a3b8" textAnchor="middle" transform="rotate(-90,10,80)">{t.freq}</text>
                        <text x="165" y="171" fontSize="8" fill="#94a3b8" textAnchor="middle">{t.score}</text>
                      </svg>
                      <p className="font-body text-xs text-green-400 italic">
                        📌 {language === "id" ? "Data: Nilai ulangan matematika 30 siswa Kelas 9A" : language === "en" ? "Data: Math test scores of 30 Grade 9A students" : "データ：9年Aクラス30人の数学の試験点数"}
                      </p>
                    </div>

                    {/* 3. DIAGRAM GARIS */}
                    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="font-body text-sm font-bold text-purple-300 mb-1">
                          📈 {language === "id" ? "Diagram Garis" : language === "en" ? "Line Chart" : "折れ線グラフ"}
                        </p>
                        <p className="font-body text-xs text-white/70">
                          {language === "id" ? "Titik-titik dihubungkan dengan garis. Menunjukkan pola distribusi nilai — naik, puncak, lalu turun."
                          : language === "en" ? "Points connected by a line. Shows the score distribution pattern — rising, peak, then falling."
                          : "点を線で結んだグラフ。点数の分布パターンを示します — 上昇、ピーク、そして下降。"}
                        </p>
                      </div>
                      <svg viewBox="0 0 310 175" className="w-full">
                        <rect width="310" height="175" fill="transparent" />
                        {[0,2,4,6,8,10].map(v => {
                          const y = scaleY(v);
                          return (
                            <g key={v}>
                              <line x1="36" y1={y} x2="295" y2={y} stroke="#a855f7" strokeOpacity="0.12" strokeWidth="1" />
                              <text x="32" y={y + 3} fontSize="8" fill="#c084fc" textAnchor="end">{v}</text>
                            </g>
                          );
                        })}
                        <defs>
                          <linearGradient id="lineGrad2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        <path d={area} fill="url(#lineGrad2)" />
                        <polyline points={polyline} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                        {pts.map(([x, y], i) => (
                          <g key={i}>
                            <circle cx={x} cy={y} r="5" fill={DATA[i].color} stroke="#1e1b4b" strokeWidth="1.5" />
                            <text x={x} y={y - 9} fontSize="9" fill={DATA[i].color} textAnchor="middle" fontWeight="bold">{DATA[i].f}</text>
                            <text x={x} y="158" fontSize="8" fill="#cbd5e1" textAnchor="middle">{DATA[i].nilai}</text>
                          </g>
                        ))}
                        <line x1="36" y1="140" x2="295" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="36" y1="10" x2="36" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="10" y="80" fontSize="8" fill="#94a3b8" textAnchor="middle" transform="rotate(-90,10,80)">{t.freq}</text>
                        <text x="165" y="171" fontSize="8" fill="#94a3b8" textAnchor="middle">{t.score}</text>
                      </svg>
                      <p className="font-body text-xs text-purple-400 italic">
                        📌 {language === "id" ? "Data: Nilai ulangan matematika 30 siswa Kelas 9A" : language === "en" ? "Data: Math test scores of 30 Grade 9A students" : "データ：9年Aクラス30人の数学の試験点数"}
                      </p>
                    </div>

                    {/* 4. DIAGRAM LINGKARAN */}
                    <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="font-body text-sm font-bold text-orange-300 mb-1">
                          🥧 {language === "id" ? "Diagram Lingkaran (Pie Chart)" : language === "en" ? "Pie Chart" : "円グラフ"}
                        </p>
                        <p className="font-body text-xs text-white/70">
                          {language === "id" ? <>Lingkaran dibagi menjadi sektor-sektor. Besar sudut tiap sektor = <span className="text-yellow-300 font-semibold">frekuensi ÷ total × 360°</span>.</>
                          : language === "en" ? <>A circle divided into sectors. Sector angle = <span className="text-yellow-300 font-semibold">frequency ÷ total × 360°</span>.</>
                          : <>円をセクターに分割します。各セクターの角度 = <span className="text-yellow-300 font-semibold">度数 ÷ 合計 × 360°</span>。</>}
                        </p>
                      </div>
                      <svg viewBox="0 0 310 185" className="w-full">
                        <rect width="310" height="185" fill="transparent" />
                        {slices.map((s, i) => (
                          <path key={i}
                            d={`M${cx},${cy} L${s.p1.x.toFixed(1)},${s.p1.y.toFixed(1)} A${r},${r} 0 ${s.largeArc},1 ${s.p2.x.toFixed(1)},${s.p2.y.toFixed(1)} Z`}
                            fill={s.color} fillOpacity="0.85"
                          />
                        ))}
                        <circle cx={cx} cy={cy} r="24" fill="#0f172a" />
                        <text x={cx} y={cy - 5} fontSize="8" fill="#e2e8f0" textAnchor="middle" fontWeight="bold">{t.total}</text>
                        <text x={cx} y={cy + 7} fontSize="9" fill="#22d3ee" textAnchor="middle" fontWeight="bold">
                          {t.students(30)}
                        </text>
                        {DATA.map((d, i) => (
                          <g key={i}>
                            <rect x="196" y={8 + i * 28} width="12" height="12" rx="2" fill={d.color} fillOpacity="0.85" />
                            <text x="212" y={19 + i * 28} fontSize="9" fill="#e2e8f0">{d.nilai}</text>
                            <text x="310" y={19 + i * 28} fontSize="9" fill={d.color} textAnchor="end" fontWeight="bold">
                              {d.f} {language === "id" ? "siswa" : language === "en" ? "students" : "人"}
                            </text>
                          </g>
                        ))}
                      </svg>
                      {/* Conversion table */}
                      <div>
                        <p className="font-body text-xs font-bold text-orange-300 mb-2">
                          🔢 {language === "id" ? "Konversi Frekuensi → Persen → Derajat" : language === "en" ? "Conversion: Frequency → Percent → Degrees" : "換算：度数 → パーセント → 度数（角度）"}
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-orange-500/20">
                          <table className="w-full text-xs font-body">
                            <thead>
                              <tr className="bg-orange-900/40">
                                {(language === "id" ? ["Nilai","Frekuensi","Rumus %","%","Rumus °","Sudut"]
                                : language === "en" ? ["Score","Frequency","Formula %","%","Formula °","Angle"]
                                : ["点数","度数","計算式 %","%","計算式 °","角度"]).map((h, i) => (
                                  <th key={i} className="px-2 py-2 text-orange-200 font-bold text-center">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-500/10">
                              {DATA.map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-orange-900/15" : "bg-slate-900/30"}>
                                  <td className="px-2 py-1.5 text-center font-bold" style={{ color: row.color }}>{row.nilai}</td>
                                  <td className="px-2 py-1.5 text-white text-center font-bold">{row.f}</td>
                                  <td className="px-2 py-1.5 text-white/60 text-center">{row.f}/30 × 100</td>
                                  <td className="px-2 py-1.5 text-center font-bold" style={{ color: row.color }}>{row.pct}</td>
                                  <td className="px-2 py-1.5 text-white/60 text-center">{row.f}/30 × 360</td>
                                  <td className="px-2 py-1.5 text-center font-bold" style={{ color: row.color }}>{row.deg}</td>
                                </tr>
                              ))}
                              <tr className="bg-orange-700/25">
                                <td className="px-2 py-1.5 text-orange-200 font-bold text-center">{t.total}</td>
                                <td className="px-2 py-1.5 text-yellow-300 font-bold text-center">30</td>
                                <td className="px-2 py-1.5 text-center">—</td>
                                <td className="px-2 py-1.5 text-yellow-300 font-bold text-center">100%</td>
                                <td className="px-2 py-1.5 text-center">—</td>
                                <td className="px-2 py-1.5 text-yellow-300 font-bold text-center">360°</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <p className="font-body text-xs text-orange-400 italic">
                        📌 {language === "id" ? "Data: Nilai ulangan matematika 30 siswa Kelas 9A" : language === "en" ? "Data: Math test scores of 30 Grade 9A students" : "データ：9年Aクラス30人の数学の試験点数"}
                      </p>
                    </div>

                    {/* 5. DIAGRAM BATANG DAUN */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="font-body text-sm font-bold text-indigo-300 mb-1">
                          🌿 {language === "id" ? "Diagram Batang Daun" : language === "en" ? "Stem-and-Leaf Plot" : "茎葉図"}
                        </p>
                        <p className="font-body text-xs text-white/70">
                          {language === "id" ? <>Angka dipisah: <span className="text-yellow-300">batang</span> = puluhan, <span className="text-green-300">daun</span> = satuan. Mempertahankan semua data asli.</>
                          : language === "en" ? <>Digits split: <span className="text-yellow-300">stem</span> = tens, <span className="text-green-300">leaf</span> = units. Preserves all original data.</>
                          : <>数字を分割：<span className="text-yellow-300">茎</span> = 十の位、<span className="text-green-300">葉</span> = 一の位。すべての元データを保持します。</>}
                        </p>
                      </div>
                      <div className="bg-slate-900/60 rounded-lg p-4">
                        <p className="font-body text-xs text-indigo-300 font-bold mb-3 text-center">
                          {language === "id" ? "Nilai Ulangan Matematika 30 Siswa" : language === "en" ? "Math Test Scores — 30 Students" : "数学の試験点数（30人）"}
                        </p>
                        <div className="font-mono">
                          <div className="flex items-center gap-0 mb-2">
                            <div className="w-16 text-right pr-3 text-yellow-400 font-bold text-xs border-r-2 border-indigo-500/50">{t.stem}</div>
                            <div className="pl-3 text-slate-400 text-xs italic">{t.leaf}</div>
                          </div>
                          {[
                            { stem: "5", leaves: "0  0", count: 2, color: "text-indigo-300" },
                            { stem: "6", leaves: "0  0  0  0  0", count: 5, color: "text-cyan-300" },
                            { stem: "7", leaves: "0  0  0  0  0  0  0  0  0  0", count: 10, color: "text-green-300" },
                            { stem: "8", leaves: "0  0  0  0  0  0  0  0", count: 8, color: "text-yellow-300" },
                            { stem: "9", leaves: "0  0  0  0", count: 4, color: "text-pink-300" },
                            { stem: "10", leaves: "0", count: 1, color: "text-red-300" },
                          ].map((row, i) => (
                            <div key={i} className="flex items-center gap-0 py-1.5 border-b border-slate-700/30 last:border-0">
                              <div className={`w-16 text-right pr-3 font-bold text-base border-r-2 border-indigo-500/50 ${row.color}`}>{row.stem}</div>
                              <div className="pl-3 text-white tracking-widest font-mono text-sm flex-1">{row.leaves}</div>
                              <div className={`text-xs font-bold pl-2 ${row.color}`}>({row.count})</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-body">
                          <div className="bg-indigo-900/30 rounded p-2 text-center">
                            <p className="text-indigo-300 font-bold">Min</p>
                            <p className="text-white font-bold text-base">50</p>
                          </div>
                          <div className="bg-green-900/30 rounded p-2 text-center">
                            <p className="text-green-300 font-bold">{t.mode}</p>
                            <p className="text-white font-bold text-base">70</p>
                          </div>
                          <div className="bg-indigo-900/30 rounded p-2 text-center">
                            <p className="text-indigo-300 font-bold">Max</p>
                            <p className="text-white font-bold text-base">100</p>
                          </div>
                        </div>
                      </div>
                      <p className="font-body text-xs text-indigo-400 italic">
                        📌 {language === "id" ? "Karena semua nilai kelipatan 10, daun semuanya 0. Banyak kemunculan ditunjukkan di tanda kurung."
                        : language === "en" ? "Since all scores are multiples of 10, all leaves are 0. Occurrence counts are shown in parentheses."
                        : "すべての点数が10の倍数なので、葉はすべて0です。出現回数はカッコ内に示されています。"}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Selection guide */}
              <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl overflow-hidden">
                <div className="bg-slate-700/50 px-4 py-2">
                  <p className="font-body text-xs font-bold text-slate-200 uppercase tracking-wide">
                    🔍 {language === "id" ? "Panduan Memilih Jenis Penyajian" : language === "en" ? "Guide to Choosing a Presentation Format" : "提示形式の選び方ガイド"}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-slate-700/30">
                        <th className="px-3 py-2 text-left text-cyan-300 font-bold">
                          {language === "id" ? "Tujuan Penyajian" : language === "en" ? "Presentation Goal" : "提示目的"}
                        </th>
                        <th className="px-3 py-2 text-left text-white/70 font-semibold">
                          {language === "id" ? "Pilihan Terbaik" : language === "en" ? "Best Choice" : "最適な形式"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/40">
                      {(language === "id" ? [
                        ["Membandingkan beberapa kategori","Diagram Batang","text-green-400"],
                        ["Menunjukkan perubahan dari waktu ke waktu","Diagram Garis","text-purple-400"],
                        ["Menampilkan proporsi/bagian dari keseluruhan","Diagram Lingkaran","text-orange-400"],
                        ["Menampilkan data mentah secara detail","Diagram Batang Daun","text-indigo-400"],
                        ["Menyajikan data banyak secara terstruktur","Tabel Distribusi Frekuensi","text-cyan-400"],
                      ] : language === "en" ? [
                        ["Comparing multiple categories","Bar Chart","text-green-400"],
                        ["Showing changes over time","Line Chart","text-purple-400"],
                        ["Displaying proportions/parts of a whole","Pie Chart","text-orange-400"],
                        ["Showing raw data in detail","Stem-and-Leaf Plot","text-indigo-400"],
                        ["Presenting large data sets in a structured way","Frequency Distribution Table","text-cyan-400"],
                      ] : [
                        ["複数のカテゴリーの比較","棒グラフ","text-green-400"],
                        ["時間の経過に伴う変化の表示","折れ線グラフ","text-purple-400"],
                        ["全体に対する割合や部分の表示","円グラフ","text-orange-400"],
                        ["生データの詳細な表示","茎葉図","text-indigo-400"],
                        ["大量のデータを整理して提示","度数分布表","text-cyan-400"],
                      ]).map(([goal, choice, color], i) => (
                        <tr key={i} className="hover:bg-slate-700/20">
                          <td className="px-3 py-2 text-white/80">{goal}</td>
                          <td className={`px-3 py-2 font-semibold ${color}`}>{choice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  {language === "id" ? <><strong>Ingat:</strong> Penyajian data yang baik membuat pembaca langsung menangkap isi informasi tanpa perlu berpikir keras. Pilih bentuk yang paling sesuai dengan jenis datamu!</>
                  : language === "en" ? <><strong>Remember:</strong> Good data presentation allows readers to immediately grasp the information without having to think too hard. Choose the format that best suits your type of data!</>
                  : <><strong>覚えておこう：</strong>良いデータ提示は、読者が考えなくてもすぐに情報を把握できるようにします。データの種類に最も適した形式を選びましょう！</>}
                </p>
              </div>
            </div>
          </div>

          {/* Contoh Soal Sub-Bab 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400"
              title={language === "id" ? "📝 Contoh Soal — Jenis Penyajian Data" : language === "en" ? "📝 Practice Problems — Data Presentation Formats" : "📝 練習問題 — データの提示形式"} />
            <div className="px-5 pb-5 space-y-6">

              {/* Mudah */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                  <span className="font-body font-semibold text-white">{t.example} 1</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Tentukan jenis penyajian data yang paling tepat untuk masing-masing situasi berikut:\n(a) Perkembangan jumlah pengguna internet di Indonesia dari tahun 2018–2024.\n(b) Persentase siswa yang menyukai olahraga basket, sepak bola, renang, dan voli."
                    : language === "en" ? "Determine the most appropriate data presentation format for each of the following situations:\n(a) The growth in the number of internet users in a country from 2018–2024.\n(b) The percentage of students who like basketball, soccer, swimming, and volleyball."
                    : "以下の各状況に最も適したデータ提示形式を決めなさい：\n(a) 2018年〜2024年にかけてある国のインターネット利用者数の推移。\n(b) バスケットボール、サッカー、水泳、バレーボールが好きな生徒の割合。"}
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      {language === "id" ? (
                        <>
                          <p>(a) Data berubah seiring waktu (2018–2024) → <span className="text-purple-400 font-semibold">📈 Diagram Garis</span></p>
                          <p>(b) Data berupa proporsi/persentase kategori → <span className="text-orange-400 font-semibold">🥧 Diagram Lingkaran</span></p>
                        </>
                      ) : language === "en" ? (
                        <>
                          <p>(a) Data changes over time (2018–2024) → <span className="text-purple-400 font-semibold">📈 Line Chart</span></p>
                          <p>(b) Data shows proportions/percentages of categories → <span className="text-orange-400 font-semibold">🥧 Pie Chart</span></p>
                        </>
                      ) : (
                        <>
                          <p>(a) 時間の経過に伴ってデータが変化する（2018年〜2024年）→ <span className="text-purple-400 font-semibold">📈 折れ線グラフ</span></p>
                          <p>(b) データがカテゴリーの割合/パーセントを示す → <span className="text-orange-400 font-semibold">🥧 円グラフ</span></p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sedang */}
              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                  <span className="font-body font-semibold text-white">{t.example} 2</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Data ekskul yang diikuti 40 siswa adalah sebagai berikut:\nPramuka: 12 siswa, Seni Musik: 8 siswa, Futsal: 14 siswa, Tari: 6 siswa.\nJika ingin disajikan dalam diagram lingkaran, tentukan besar sudut sektor untuk masing-masing ekskul!"
                    : language === "en" ? "Data on extracurricular activities for 40 students is as follows:\nScouts: 12, Music: 8, Futsal: 14, Dance: 6.\nIf presented as a pie chart, find the sector angle for each activity!"
                    : "40人の生徒が参加している課外活動のデータは以下の通りです：\n奉仕活動：12人、音楽：8人、フットサル：14人、ダンス：6人。\n円グラフで表示する場合、各活動のセクターの角度を求めなさい！"}
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p>
                      <strong>{language === "id" ? "Rumus:" : language === "en" ? "Formula:" : "公式："}</strong>{" "}
                      <InlineMath math="\text{sector angle} = \dfrac{f}{n} \times 360°" />
                    </p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2">
                      {language === "id" ? (
                        <>
                          <BlockMath math="\text{Pramuka: } \frac{12}{40} \times 360° = 108°" />
                          <BlockMath math="\text{Seni Musik: } \frac{8}{40} \times 360° = 72°" />
                          <BlockMath math="\text{Futsal: } \frac{14}{40} \times 360° = 126°" />
                          <BlockMath math="\text{Tari: } \frac{6}{40} \times 360° = 54°" />
                        </>
                      ) : language === "en" ? (
                        <>
                          <BlockMath math="\text{Scouts: } \frac{12}{40} \times 360° = 108°" />
                          <BlockMath math="\text{Music: } \frac{8}{40} \times 360° = 72°" />
                          <BlockMath math="\text{Futsal: } \frac{14}{40} \times 360° = 126°" />
                          <BlockMath math="\text{Dance: } \frac{6}{40} \times 360° = 54°" />
                        </>
                      ) : (
                        <>
                          <BlockMath math="\text{奉仕活動: } \frac{12}{40} \times 360° = 108°" />
                          <BlockMath math="\text{音楽: } \frac{8}{40} \times 360° = 72°" />
                          <BlockMath math="\text{フットサル: } \frac{14}{40} \times 360° = 126°" />
                          <BlockMath math="\text{ダンス: } \frac{6}{40} \times 360° = 54°" />
                        </>
                      )}
                    </div>
                    <p className="text-yellow-300">{language === "id" ? "Cek:" : language === "en" ? "Check:" : "確認："} <InlineMath math="108° + 72° + 126° + 54° = 360°" /> ✓</p>
                  </div>
                </div>
              </div>

              {/* Sulit */}
              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                  <span className="font-body font-semibold text-white">{t.example} 3</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">
                    {language === "id" ? "Dari diagram lingkaran diketahui bahwa 25% siswa menyukai Matematika, 30% Bahasa Indonesia, 20% IPA, 15% IPS, dan sisanya menyukai Seni. Jika jumlah seluruh siswa adalah 200, tentukan:\n(a) Persentase siswa yang menyukai Seni.\n(b) Jumlah siswa yang menyukai setiap mata pelajaran.\n(c) Besar sudut sektor Seni pada diagram lingkaran."
                    : language === "en" ? "From a pie chart, 25% of students like Math, 30% Indonesian, 20% Science, 15% Social Studies, and the rest like Arts. If there are 200 students total, determine:\n(a) The percentage of students who like Arts.\n(b) The number of students who like each subject.\n(c) The sector angle for Arts in the pie chart."
                    : "円グラフから、生徒の25%が数学、30%が国語、20%が理科、15%が社会を好み、残りが芸術を好むことが分かっています。生徒が全部で200人いる場合、以下を求めなさい：\n(a) 芸術が好きな生徒の割合。\n(b) 各科目が好きな生徒の人数。\n(c) 円グラフにおける芸術のセクターの角度。"}
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussion}</p>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong>{language === "id" ? "Langkah 1:" : language === "en" ? "Step 1:" : "ステップ1："}</strong>{" "}
                      {language === "id" ? "Hitung persentase Seni:" : language === "en" ? "Calculate the Arts percentage:" : "芸術のパーセントを計算する："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\%_{\text{Arts}} = 100\% - (25+30+20+15)\% = 10\%" />
                    </div>
                    <p><strong>{language === "id" ? "Langkah 2:" : language === "en" ? "Step 2:" : "ステップ2："}</strong>{" "}
                      {language === "id" ? "Hitung jumlah siswa tiap mapel:" : language === "en" ? "Calculate the number of students per subject:" : "各科目の生徒数を計算する："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                      {(language === "id" ? [["Matematika","25"],["Bhs. Indonesia","30"],["IPA","20"],["IPS","15"],["Seni","10"]]
                      : language === "en" ? [["Math","25"],["Indonesian","30"],["Science","20"],["Social Studies","15"],["Arts","10"]]
                      : [["数学","25"],["国語","30"],["理科","20"],["社会","15"],["芸術","10"]]).map(([name, pct]) => (
                        <p key={name}>{name}: <InlineMath math={`${pct}\\% \\times 200 = ${parseInt(pct)*2}`} />{" "}{language === "id" ? "siswa" : language === "en" ? "students" : "人"}</p>
                      ))}
                    </div>
                    <p><strong>{language === "id" ? "Langkah 3:" : language === "en" ? "Step 3:" : "ステップ3："}</strong>{" "}
                      {language === "id" ? "Sudut sektor Seni:" : language === "en" ? "Sector angle for Arts:" : "芸術のセクターの角度："}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{Angle}_{\text{Arts}} = \frac{10}{100} \times 360° = 36°" />
                    </div>
                    <p><strong className="text-primary">
                      {language === "id" ? "Seni = 10%; 20 siswa; sudut sektor = 36°"
                      : language === "en" ? "Arts = 10%; 20 students; sector angle = 36°"
                      : "芸術 = 10%；20人；セクターの角度 = 36°"}
                    </strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RANGKUMAN ===== */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Database className="w-5 h-5" />} iconColor="text-yellow-400"
              title={language === "id" ? "🏁 Rangkuman Materi" : language === "en" ? "🏁 Material Summary" : "🏁 まとめ"} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-bold text-cyan-300 text-center mb-3">
                  ⭐ {language === "id" ? "Poin-Poin Kunci yang Harus Diingat" : language === "en" ? "Key Points to Remember" : "覚えておくべき重要ポイント"}
                </p>
                <div className="space-y-2 font-body text-sm text-white/80">
                  {(language === "id" ? [
                    <><strong className="text-cyan-300">Statistika</strong> = ilmu; <strong className="text-cyan-300">Statistik</strong> = nilai/angka hasil pengolahan data.</>,
                    <><strong className="text-green-300">Data</strong> = kumpulan fakta; <strong className="text-green-300">Datum</strong> = satu buah data.</>,
                    <><strong className="text-orange-300">Populasi</strong> = seluruh objek; <strong className="text-orange-300">Sampel</strong> = sebagian yang mewakili populasi.</>,
                    <><strong className="text-teal-300">Kualitatif</strong> = non-angka (kategori); <strong className="text-blue-300">Kuantitatif</strong> = angka (diskrit/kontinu).</>,
                    <>Metode pengumpulan: angket, wawancara, observasi, dokumentasi, eksperimen.</>,
                    <>Bentuk penyajian: tabel, diagram batang, diagram garis, diagram lingkaran, batang daun.</>,
                  ] : language === "en" ? [
                    <><strong className="text-cyan-300">Statistics</strong> (field) = a science; <strong className="text-cyan-300">Statistic</strong> (value) = a number from processed data.</>,
                    <><strong className="text-green-300">Data</strong> = a collection of facts; <strong className="text-green-300">Datum</strong> = a single data point.</>,
                    <><strong className="text-orange-300">Population</strong> = all objects; <strong className="text-orange-300">Sample</strong> = a portion representing the population.</>,
                    <><strong className="text-teal-300">Qualitative</strong> = non-numerical (categories); <strong className="text-blue-300">Quantitative</strong> = numerical (discrete/continuous).</>,
                    <>Collection methods: questionnaire, interview, observation, documentation, experiment.</>,
                    <>Presentation formats: table, bar chart, line chart, pie chart, stem-and-leaf plot.</>,
                  ] : [
                    <><strong className="text-cyan-300">統計学</strong>（学問） = 科学の一分野；<strong className="text-cyan-300">統計量</strong>（値）= データの処理で得られた数値。</>,
                    <><strong className="text-green-300">データ</strong> = 事実の集まり；<strong className="text-green-300">データ個</strong> = 1つのデータ点。</>,
                    <><strong className="text-orange-300">母集団</strong> = すべての対象；<strong className="text-orange-300">標本</strong> = 母集団を代表する一部。</>,
                    <><strong className="text-teal-300">定性的</strong> = 非数値（カテゴリー）；<strong className="text-blue-300">定量的</strong> = 数値（離散型/連続型）。</>,
                    <>収集方法：アンケート、インタビュー、観察、文書調査、実験。</>,
                    <>提示形式：表、棒グラフ、折れ線グラフ、円グラフ、茎葉図。</>,
                  ]).map((item, i) => (
                    <div key={i} className="flex gap-2"><span className="text-cyan-400 shrink-0">✅</span><p>{item}</p></div>
                  ))}
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-cyan-200">
                  {language === "id" ? <><strong>Siap lanjut?</strong> Kamu sudah menguasai fondasi statistika. Materi berikutnya akan membahas cara menyajikan data secara lebih mendalam, termasuk membaca dan membuat diagram batang daun, diagram garis, dan tabel distribusi frekuensi! 🚀</>
                  : language === "en" ? <><strong>Ready to continue?</strong> You've mastered the foundations of statistics. The next topic will cover presenting data in more depth, including reading and creating stem-and-leaf plots, line charts, and frequency distribution tables! 🚀</>
                  : <><strong>続ける準備はできていますか？</strong>統計学の基礎をマスターしました。次の単元では、茎葉図、折れ線グラフ、度数分布表の読み方と作り方を含む、より詳しいデータの提示方法を学びます！🚀</>}
                </p>
              </div>
            </div>
          </div>

        </div>

        <RangkumanSection
          gradientFrom="from-teal-900"
          gradientVia="via-cyan-900"
          gradientTo="to-sky-900"
          borderColor="border-teal-500/40"
          accentColor="text-teal-300"
          headerIcon="📊"
          judul={rst.judul}
          subjudul={rst.subjudul}
          ringkasan={rst.ringkasan}
          rumus={rst.rumus}
          tips={rst.tips}
          kesimpulan={rst.kesimpulan}
          kesimpulanBg="bg-gradient-to-r from-teal-900/80 to-cyan-900/80"
          kesimpulanBorder="border-teal-400/50"
          kesimpulanTextColor="text-teal-100"
        />

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/materi-matematika/kelas-9/statistika")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengantarStatistikaPage;
