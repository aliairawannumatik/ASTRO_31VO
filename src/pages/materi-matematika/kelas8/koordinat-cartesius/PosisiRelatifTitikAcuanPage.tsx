import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, MapPin } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "POSISI RELATIF TITIK TERHADAP TITIK ACUAN",
    pageSubtitle: "Bukan Hanya Terhadap Sumbu — Terhadap Titik Manapun!",
    breadcrumb: "Kelas 8 · Koordinat Kartesius · Materi Matematika",
    introHeader: "🌟 Bayangkan Ini...",
    introBody: "Kamu berdiri di alun-alun kota (titik acuan). Temanmu ada di 3 meter ke kananmu dan 5 meter di depanmu. Ini bukan koordinat mutlak terhadap \"nol\" — ini adalah",
    introEmph: "posisi relatif",
    introBody2: "terhadap dirimu sebagai titik acuan. Konsep yang sama digunakan dalam matematika: menentukan letak suatu titik bukan terhadap O(0,0), tapi terhadap",
    introEmph2: "sembarang titik acuan",
    introBody3: "yang kita pilih!",
    introFact: "Aplikasi nyata:",
    introFactBody: "Sistem navigasi kapal, peta militer, permainan strategi, hingga robotika menggunakan konsep posisi relatif. Robot tahu \"bergerak 3 langkah ke kanan dari posisi saat ini\" — bukan dari titik nol mutlak!",
    konsepHeader: "📘 Konsep: Koordinat Relatif",
    konsepIntisari: "🎯 Ringkasan Intisari",
    konsepBody: "Jika",
    konsepBody2: "adalah titik acuan dan",
    konsepBody3: "adalah titik yang ingin kita tentukan posisinya, maka",
    konsepEmph: "posisi B relatif terhadap A",
    konsepBody4: "dinyatakan sebagai selisih koordinat B terhadap A.",
    rumusHeader: "📐 Rumus Posisi Relatif",
    selisihH: "= selisih horizontal",
    selisihV: "= selisih vertikal",
    visualHeader: "🗺️ Contoh Visual: A(2,1) sebagai Acuan",
    pRelA: "P relatif terhadap A:",
    pArah: "→ 3 ke kiri, 3 ke atas dari A",
    qRelA: "Q relatif terhadap A:",
    qArah: "→ 2 ke kanan, 3 ke bawah dari A",
    readHeader: "🧭 Cara Membaca Hasil (Δx, Δy):",
    dx_pos: "B ada di KANAN A",
    dx_neg: "B ada di KIRI A",
    dy_pos: "B ada di ATAS A",
    dy_neg: "B ada di BAWAH A",
    ex1Header: "✏️ Contoh 1 — Mudah",
    ex2Header: "✏️ Contoh 2 — Sedang",
    ex3Header: "✏️ Contoh 3 — Sulit",
    badge_easy: "MUDAH",
    badge_med: "SEDANG",
    badge_hard: "SULIT",
    soal: "📝 Soal",
    pembahasan: "🔍 Pembahasan",
    ex1q: "Diketahui titik acuan",
    ex1q2: "dan titik",
    ex1q3: ". Tentukan posisi titik B relatif terhadap titik A, dan jelaskan arahnya!",
    ex1posRel: "Posisi B relatif terhadap A:",
    ex1posRelVal: "Posisi relatif:",
    ex1dirR: "B berada 4 satuan di",
    ex1kanan: "kanan",
    ex1atas: "atas",
    ex1ans: "✅ Posisi B relatif terhadap A = (4, 4) — 4 satuan ke kanan dan 4 satuan ke atas.",
    ex2q: "Titik",
    ex2q2: "digunakan sebagai titik acuan. Jika titik Q berposisi relatif",
    ex2q3: "terhadap P, tentukan koordinat titik Q yang sebenarnya (koordinat mutlaknya)!",
    ex2body: "Diketahui posisi relatif Q terhadap P = (−4, 5), artinya:",
    ex2tip: "Rumus balik:",
    ex2tipBody: "Koordinat mutlak = koordinat acuan + posisi relatif",
    ex2ans: "✅ Koordinat Q =",
    ex2check: "Cek: Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓",
    ex3q: "Diketahui titik-titik",
    ex3q2: ", dan",
    ex3q3: ". Jika posisi C relatif terhadap B sama dengan posisi B relatif terhadap A, tentukan koordinat C!",
    step1: "Langkah 1 — Hitung posisi B relatif terhadap A:",
    step2: "Langkah 2 — Terapkan selisih yang sama untuk C relatif terhadap B:",
    step2body: "Posisi C relatif terhadap B juga = (5, −3)",
    step2note: "💡 Ini sebenarnya membuat barisan aritmetika 2D: A → B → C dengan selisih (5, −3) di setiap langkah!",
    step2seq: "A(−2, 4) → B(3, 1) → C(8, −2)",
    ex3ans: "✅ Koordinat C =",
    rangHeader: "📌 Rangkuman",
    rang1: "Posisi relatif B terhadap A",
    rang1val: "(x₂ − x₁, y₂ − y₁)",
    rang2: "Koordinat mutlak dari posisi relatif",
    rang2val: "B = A + (Δx, Δy)",
    rang3: "Δx > 0",
    rang3val: "B di KANAN A",
    rang4: "Δx < 0",
    rang4val: "B di KIRI A",
    rang5: "Δy > 0",
    rang5val: "B di ATAS A",
    rang6: "Δy < 0",
    rang6val: "B di BAWAH A",
    rangTip: "Perbedaan kunci:",
    rangTipBody: "Koordinat mutlak selalu dihitung dari O(0,0). Koordinat relatif dihitung dari titik acuan yang dipilih. Keduanya bisa dikonversi satu sama lain!",
    rangkumanJudul: "Rangkuman — Posisi Relatif terhadap Titik Acuan",
    rangkumanSubjudul: "Cara menentukan arah dan letak suatu titik dari titik referensi manapun",
    r1judul: "Titik Acuan sebagai Pusat Lokal",
    r1isi: "Titik acuan berperan sebagai 'origin baru'. Semua posisi dihitung relatif terhadap titik ini, bukan terhadap O(0,0) asli.",
    r2judul: "Selisih Absis (Δx)",
    r2isi: "Δx = xB − xA. Jika Δx > 0 → B di kanan A. Jika Δx < 0 → B di kiri A. Jika Δx = 0 → segaris vertikal.",
    r3judul: "Selisih Ordinat (Δy)",
    r3isi: "Δy = yB − yA. Jika Δy > 0 → B di atas A. Jika Δy < 0 → B di bawah A. Jika Δy = 0 → segaris horizontal.",
    r4judul: "Posisi Relatif Berbalik",
    r4isi: "Posisi B terhadap A ≠ posisi A terhadap B. Keduanya selalu berlawanan: jika B di kanan A, maka A di kiri B.",
    tip1: <>Rumus mudah: <strong>TUJUAN − ACUAN</strong>. Koordinat titik yang dicari posisinya (tujuan) dikurangi koordinat titik acuan. Jangan sampai terbalik!</>,
    tip2: "Bayangkan titik acuan sebagai 'rumahmu' yang menjadi titik (0,0) di peta barumu. Semua jarak diukur dari sana ke segala arah.",
    tip3: <>Δx = 0 → kedua titik pada garis vertikal yang sama. Δy = 0 → kedua titik pada garis horizontal yang sama. Keduanya nol → titik berimpit.</>,
    tip4: "Cek jawaban: jika B(5,3) dan A(2,1), maka Δx=3 (kanan 3 satuan), Δy=2 (atas 2 satuan). Bayangkan panah dari A ke B — masuk akal?",
    kesimpulan: "Posisi relatif digunakan di mana-mana — arahan GPS ('belok kiri 200 m'), sistem koordinat robot, peta militer, hingga spreadsheet. Konsep Δx dan Δy adalah dasar dari semua sistem navigasi modern di bumi!",
    back: "← Kembali ke Koordinat Kartesius",
    rumusLabel: "Selisih koordinat (posisi B terhadap A):",
    acuanLabel: "Titik Acuan",
    posBALabel: "P relatif terhadap A:",
    pArahLabel: "→ 3 ke kiri, 3 ke atas dari A",
    qArahLabel: "→ 2 ke kanan, 3 ke bawah dari A",
  },
  en: {
    pageTitle: "RELATIVE POSITION OF A POINT TO A REFERENCE POINT",
    pageSubtitle: "Not Just Toward the Axes — Toward Any Point!",
    breadcrumb: "Grade 8 · Cartesian Coordinates · Math Material",
    introHeader: "🌟 Imagine This...",
    introBody: "You are standing in the town square (the reference point). Your friend is 3 meters to your right and 5 meters in front of you. This is not an absolute coordinate from \"zero\" — it is a",
    introEmph: "relative position",
    introBody2: "with respect to you as the reference point. The same concept is used in mathematics: determining the location of a point not relative to O(0,0), but relative to",
    introEmph2: "any chosen reference point",
    introBody3: "!",
    introFact: "Real-world application:",
    introFactBody: "Ship navigation, military maps, strategy games, and robotics all use relative position. A robot knows \"move 3 steps to the right from the current position\" — not from absolute zero!",
    konsepHeader: "📘 Concept: Relative Coordinates",
    konsepIntisari: "🎯 Key Summary",
    konsepBody: "If",
    konsepBody2: "is the reference point and",
    konsepBody3: "is the point whose position we want to determine, then",
    konsepEmph: "the position of B relative to A",
    konsepBody4: "is expressed as the difference of B's coordinates from A's.",
    rumusHeader: "📐 Relative Position Formula",
    selisihH: "= horizontal difference",
    selisihV: "= vertical difference",
    visualHeader: "🗺️ Visual Example: A(2,1) as Reference Point",
    pRelA: "P relative to A:",
    pArah: "→ 3 left, 3 up from A",
    qRelA: "Q relative to A:",
    qArah: "→ 2 right, 3 down from A",
    readHeader: "🧭 Reading the Result (Δx, Δy):",
    dx_pos: "B is to the RIGHT of A",
    dx_neg: "B is to the LEFT of A",
    dy_pos: "B is ABOVE A",
    dy_neg: "B is BELOW A",
    ex1Header: "✏️ Example 1 — Easy",
    ex2Header: "✏️ Example 2 — Medium",
    ex3Header: "✏️ Example 3 — Hard",
    badge_easy: "EASY",
    badge_med: "MEDIUM",
    badge_hard: "HARD",
    soal: "📝 Problem",
    pembahasan: "🔍 Solution",
    ex1q: "Given reference point",
    ex1q2: "and point",
    ex1q3: ". Find the position of point B relative to point A, and explain the direction!",
    ex1posRel: "Position of B relative to A:",
    ex1posRelVal: "Relative position:",
    ex1dirR: "B is 4 units to the",
    ex1kanan: "right of",
    ex1atas: "above",
    ex1ans: "✅ Position of B relative to A = (4, 4) — 4 units to the right and 4 units above.",
    ex2q: "Point",
    ex2q2: "is used as the reference point. If point Q has relative position",
    ex2q3: "from P, find the absolute coordinates of point Q!",
    ex2body: "Given relative position of Q from P = (−4, 5), meaning:",
    ex2tip: "Reverse formula:",
    ex2tipBody: "Absolute coordinate = reference coordinate + relative position",
    ex2ans: "✅ Coordinates of Q =",
    ex2check: "Check: Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓",
    ex3q: "Given points",
    ex3q2: ", and",
    ex3q3: ". If the position of C relative to B equals the position of B relative to A, find the coordinates of C!",
    step1: "Step 1 — Calculate the position of B relative to A:",
    step2: "Step 2 — Apply the same difference for C relative to B:",
    step2body: "Position of C relative to B is also = (5, −3)",
    step2note: "💡 This actually forms a 2D arithmetic sequence: A → B → C with difference (5, −3) at each step!",
    step2seq: "A(−2, 4) → B(3, 1) → C(8, −2)",
    ex3ans: "✅ Coordinates of C =",
    rangHeader: "📌 Summary",
    rang1: "Relative position of B w.r.t. A",
    rang1val: "(x₂ − x₁, y₂ − y₁)",
    rang2: "Absolute coordinates from relative position",
    rang2val: "B = A + (Δx, Δy)",
    rang3: "Δx > 0",
    rang3val: "B is to the RIGHT of A",
    rang4: "Δx < 0",
    rang4val: "B is to the LEFT of A",
    rang5: "Δy > 0",
    rang5val: "B is ABOVE A",
    rang6: "Δy < 0",
    rang6val: "B is BELOW A",
    rangTip: "Key difference:",
    rangTipBody: "Absolute coordinates are always measured from O(0,0). Relative coordinates are measured from the chosen reference point. Both can be converted to each other!",
    rangkumanJudul: "Summary — Relative Position to a Reference Point",
    rangkumanSubjudul: "How to determine the direction and location of a point from any reference point",
    r1judul: "Reference Point as Local Origin",
    r1isi: "The reference point acts as the 'new origin'. All positions are calculated relative to this point, not the original O(0,0).",
    r2judul: "Horizontal Difference (Δx)",
    r2isi: "Δx = xB − xA. If Δx > 0 → B is right of A. If Δx < 0 → B is left of A. If Δx = 0 → on the same vertical line.",
    r3judul: "Vertical Difference (Δy)",
    r3isi: "Δy = yB − yA. If Δy > 0 → B is above A. If Δy < 0 → B is below A. If Δy = 0 → on the same horizontal line.",
    r4judul: "Reversed Relative Position",
    r4isi: "Position of B w.r.t. A ≠ position of A w.r.t. B. They are always opposite: if B is right of A, then A is left of B.",
    tip1: <>Easy formula: <strong>DESTINATION − REFERENCE</strong>. Subtract the reference point coordinates from the target point coordinates. Don't get them mixed up!</>,
    tip2: "Think of the reference point as 'your home' that becomes (0,0) on your new map. All distances are measured from there in every direction.",
    tip3: <>Δx = 0 → both points on the same vertical line. Δy = 0 → both points on the same horizontal line. Both zero → points coincide.</>,
    tip4: "Check your answer: if B(5,3) and A(2,1), then Δx=3 (3 units right), Δy=2 (2 units up). Imagine an arrow from A to B — does it make sense?",
    kesimpulan: "Relative position is used everywhere — GPS directions ('turn left in 200 m'), robot coordinate systems, military maps, even spreadsheets. The concepts of Δx and Δy are the foundation of all modern navigation systems on Earth!",
    back: "← Back to Cartesian Coordinates",
    rumusLabel: "Coordinate difference (position of B w.r.t. A):",
    acuanLabel: "Reference Point",
    posBALabel: "P relative to A:",
    pArahLabel: "→ 3 left, 3 up from A",
    qArahLabel: "→ 2 right, 3 down from A",
  },
  ja: {
    pageTitle: "基準点に対する点の相対位置",
    pageSubtitle: "軸だけでなく — どんな点に対しても！",
    breadcrumb: "中学2年 · 直交座標 · 数学教材",
    introHeader: "🌟 想像してみよう...",
    introBody: "あなたは町の広場（基準点）に立っています。友達はあなたの右3メートル、前5メートルにいます。これは「ゼロ」からの絶対座標ではなく、あなたを基準点とした",
    introEmph: "相対位置",
    introBody2: "です。数学でも同じ概念を使います：O(0,0)からではなく、",
    introEmph2: "任意の基準点",
    introBody3: "に対して点の位置を決めることができます！",
    introFact: "実際の応用：",
    introFactBody: "船舶ナビゲーション、軍事地図、戦略ゲーム、ロボット工学はすべて相対位置の概念を使用します。ロボットは「現在位置から右に3歩移動」と認識します — 絶対ゼロからではなく！",
    konsepHeader: "📘 概念：相対座標",
    konsepIntisari: "🎯 要点まとめ",
    konsepBody: "",
    konsepBody2: "が基準点で、",
    konsepBody3: "の位置を求めたい場合、",
    konsepEmph: "AからみたBの相対位置",
    konsepBody4: "はBとAの座標の差で表されます。",
    rumusHeader: "📐 相対位置の公式",
    selisihH: "= 水平方向の差",
    selisihV: "= 垂直方向の差",
    visualHeader: "🗺️ 視覚例：A(2,1) を基準点として",
    pRelA: "AからみたP：",
    pArah: "→ Aの左3、上3",
    qRelA: "AからみたQ：",
    qArah: "→ Aの右2、下3",
    readHeader: "🧭 結果（Δx, Δy）の読み方：",
    dx_pos: "BはAの右にある",
    dx_neg: "BはAの左にある",
    dy_pos: "BはAの上にある",
    dy_neg: "BはAの下にある",
    ex1Header: "✏️ 例題1 — 基本",
    ex2Header: "✏️ 例題2 — 標準",
    ex3Header: "✏️ 例題3 — 発展",
    badge_easy: "基本",
    badge_med: "標準",
    badge_hard: "発展",
    soal: "📝 問題",
    pembahasan: "🔍 解説",
    ex1q: "基準点",
    ex1q2: "と点",
    ex1q3: "が与えられています。点Aに対するBの相対位置を求め、方向を説明してください！",
    ex1posRel: "AからみたBの相対位置：",
    ex1posRelVal: "相対位置：",
    ex1dirR: "Bは",
    ex1kanan: "Aの右",
    ex1atas: "Aの上",
    ex1ans: "✅ AからみたBの相対位置 = (4, 4) — 右に4単位、上に4単位",
    ex2q: "点",
    ex2q2: "を基準点として使います。点Qが P に対して相対位置",
    ex2q3: "にある場合、点Qの絶対座標を求めなさい！",
    ex2body: "PからみたQの相対位置 = (−4, 5) とわかっているので：",
    ex2tip: "逆公式：",
    ex2tipBody: "絶対座標 = 基準座標 + 相対位置",
    ex2ans: "✅ Qの座標 =",
    ex2check: "確認：Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓",
    ex3q: "点",
    ex3q2: "、",
    ex3q3: "が与えられています。BからみたCの相対位置がAからみたBの相対位置と等しい場合、Cの座標を求めなさい！",
    step1: "ステップ1 — AからみたBの相対位置を計算する：",
    step2: "ステップ2 — BからみたCに同じ差を適用する：",
    step2body: "BからみたCの相対位置も (5, −3)",
    step2note: "💡 実はこれは2次元の等差数列です：A → B → C で各ステップの差は (5, −3)！",
    step2seq: "A(−2, 4) → B(3, 1) → C(8, −2)",
    ex3ans: "✅ Cの座標 =",
    rangHeader: "📌 まとめ",
    rang1: "AからみたBの相対位置",
    rang1val: "(x₂ − x₁, y₂ − y₁)",
    rang2: "相対位置から絶対座標",
    rang2val: "B = A + (Δx, Δy)",
    rang3: "Δx > 0",
    rang3val: "BはAの右にある",
    rang4: "Δx < 0",
    rang4val: "BはAの左にある",
    rang5: "Δy > 0",
    rang5val: "BはAの上にある",
    rang6: "Δy < 0",
    rang6val: "BはAの下にある",
    rangTip: "重要な違い：",
    rangTipBody: "絶対座標は常にO(0,0)から測定されます。相対座標は選んだ基準点から測定されます。両者は相互に変換できます！",
    rangkumanJudul: "まとめ — 基準点に対する相対位置",
    rangkumanSubjudul: "任意の基準点からの点の方向と位置の求め方",
    r1judul: "基準点をローカル原点として",
    r1isi: "基準点は「新しい原点」として機能します。すべての位置はこの点に対して計算され、元のO(0,0)ではありません。",
    r2judul: "x座標の差（Δx）",
    r2isi: "Δx = xB − xA。Δx > 0 → BはAの右。Δx < 0 → BはAの左。Δx = 0 → 同じ垂直線上。",
    r3judul: "y座標の差（Δy）",
    r3isi: "Δy = yB − yA。Δy > 0 → BはAの上。Δy < 0 → BはAの下。Δy = 0 → 同じ水平線上。",
    r4judul: "逆の相対位置",
    r4isi: "AからみたBの位置 ≠ BからみたAの位置。常に逆：BがAの右ならば、AはBの左。",
    tip1: <>簡単な公式：<strong>目標 − 基準</strong>。求めたい点の座標から基準点の座標を引く。逆にしないように！</>,
    tip2: "基準点を新しい地図の「自分の家」(0,0)として考えましょう。すべての距離はそこからあらゆる方向に測定されます。",
    tip3: <>Δx = 0 → 両点は同じ垂直線上。Δy = 0 → 両点は同じ水平線上。両方ゼロ → 点が重なる。</>,
    tip4: "答えの確認：B(5,3)、A(2,1) なら Δx=3（右3単位）、Δy=2（上2単位）。AからBへの矢印を想像して — 合理的ですか？",
    kesimpulan: "相対位置はあらゆる場所で使われます — GPS案内（「200m先を左折」）、ロボット座標系、軍事地図、スプレッドシートまで。ΔxとΔyの概念は地球上のすべての現代ナビゲーションシステムの基礎です！",
    back: "← 直交座標に戻る",
    rumusLabel: "座標の差（AからみたBの位置）：",
    acuanLabel: "基準点",
    posBALabel: "AからみたP：",
    pArahLabel: "→ Aの左3、上3",
    qArahLabel: "→ Aの右2、下3",
  },
};

const PosisiRelatifTitikAcuanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (id: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const RelativeGrid = ({ acuan, titik, label }: {
    acuan: [number, number]; titik: [number, number][]; label: string[];
  }) => {
    const size = 5;
    const cellPx = 24;
    const total = size * 2;
    const toCell = (v: number) => v + size;
    const colors = ["bg-cyan-400", "bg-green-400", "bg-yellow-400", "bg-pink-400"];
    const textColors = ["text-cyan-300", "text-green-300", "text-yellow-300", "text-pink-300"];

    const darkTextColors = ["text-cyan-600", "text-green-600", "text-yellow-600", "text-pink-600"];
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative border border-gray-300 rounded-lg overflow-hidden"
          style={{ width: total * cellPx, height: total * cellPx, background: "#ffffff" }}>
          {Array.from({ length: total + 1 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="absolute" style={{ left: i * cellPx, top: 0, width: 1, height: total * cellPx, background: i === size ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.1)" }} />
              <div className="absolute" style={{ top: i * cellPx, left: 0, height: 1, width: total * cellPx, background: i === size ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.1)" }} />
            </React.Fragment>
          ))}
          <div className="absolute z-20 flex items-center justify-center"
            style={{ left: toCell(acuan[0]) * cellPx - 6, top: toCell(-acuan[1]) * cellPx - 6, width: 12, height: 12 }}>
            <div className="w-3 h-3 bg-orange-500 rotate-45 border border-orange-800" />
          </div>
          <span className="absolute z-20 font-mono font-bold text-orange-700"
            style={{ fontSize: 8, left: toCell(acuan[0]) * cellPx + 7, top: toCell(-acuan[1]) * cellPx - 12, whiteSpace: "nowrap" }}>
            {t.acuanLabel}({acuan[0]},{acuan[1]})
          </span>
          {titik.map(([tx, ty], i) => {
            const ax = toCell(acuan[0]) * cellPx;
            const ay = toCell(-acuan[1]) * cellPx;
            const bx = toCell(tx) * cellPx;
            const by = toCell(-ty) * cellPx;
            const dx = bx - ax;
            const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return (
              <div key={i} className="absolute z-10 origin-left opacity-70"
                style={{ left: ax, top: ay, width: len, height: 2, background: ["#0891b2", "#16a34a", "#ca8a04", "#db2777"][i % 4], transform: `rotate(${angle}deg)` }} />
            );
          })}
          {titik.map(([tx, ty], i) => (
            <div key={i}>
              <div className={`absolute rounded-full ${colors[i % 4]} border-2 border-white z-20`}
                style={{ width: 8, height: 8, left: toCell(tx) * cellPx - 4, top: toCell(-ty) * cellPx - 4 }} />
              <span className={`absolute font-mono font-bold z-20 ${darkTextColors[i % 4]}`}
                style={{ fontSize: 8, left: toCell(tx) * cellPx + 5, top: toCell(-ty) * cellPx - 10, whiteSpace: "nowrap" }}>
                {label[i]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <span className="text-orange-600 text-xs font-mono flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-orange-500 rotate-45" />{t.acuanLabel}
          </span>
          {titik.map((_, i) => (
            <span key={i} className={`text-xs font-mono flex items-center gap-1 ${darkTextColors[i % 4]}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${colors[i % 4]}`} />{label[i]}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.pageSubtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introBody} <strong className="text-cyan-300">{t.introEmph}</strong> {t.introBody2} <strong className="text-cyan-300">{t.introEmph2}</strong> {t.introBody3}
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.introFact}</strong> {t.introFactBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<MapPin className="w-5 h-5" />} iconColor="text-orange-400" title={t.konsepHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.konsepIntisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.konsepBody} <InlineMath math="A(x_1, y_1)" /> {t.konsepBody2} <InlineMath math="B(x_2, y_2)" /> {t.konsepBody3} <strong className="text-cyan-300">{t.konsepEmph}</strong> {t.konsepBody4}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 text-center space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-2">{t.rumusHeader}</p>
                  <p className="font-body text-xs text-orange-200 mb-1">{t.rumusLabel}</p>
                  <BlockMath math="\Delta x = x_2 - x_1 \qquad \Delta y = y_2 - y_1" />
                  <div className="flex justify-center gap-4 text-xs font-body flex-wrap mt-1">
                    <span className="text-cyan-300"><InlineMath math="x_2 - x_1" /> {t.selisihH}</span>
                    <span className="text-green-300"><InlineMath math="y_2 - y_1" /> {t.selisihV}</span>
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-orange-500/20 rounded-xl p-4 flex flex-col items-center gap-3">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase">{t.visualHeader}</p>
                  <RelativeGrid
                    acuan={[2, 1]}
                    titik={[[-1, 4], [4, -2]]}
                    label={["P(−1,4)", "Q(4,−2)"]}
                  />
                  <div className="grid grid-cols-2 gap-2 w-full text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-2">
                      <p className="text-cyan-300 font-semibold">{t.pRelA}</p>
                      <p className="text-white/70 mt-1"><InlineMath math="(-1-2,\ 4-1) = (-3, 3)" /></p>
                      <p className="text-white/50 text-xs">{t.pArah}</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2">
                      <p className="text-green-300 font-semibold">{t.qRelA}</p>
                      <p className="text-white/70 mt-1"><InlineMath math="(4-2,\ -2-1) = (2, -3)" /></p>
                      <p className="text-white/50 text-xs">{t.qArah}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-body">
                  <p className="font-bold text-white mb-2">{t.readHeader}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { kondisi: "Δx > 0", arti: t.dx_pos, color: "text-cyan-300" },
                      { kondisi: "Δx < 0", arti: t.dx_neg, color: "text-cyan-300" },
                      { kondisi: "Δy > 0", arti: t.dy_pos, color: "text-green-300" },
                      { kondisi: "Δy < 0", arti: t.dy_neg, color: "text-green-300" },
                    ].map(({ kondisi, arti, color }) => (
                      <div key={kondisi} className="bg-slate-700/40 border border-white/10 rounded-lg p-2">
                        <p className={`font-mono font-bold ${color}`}>{kondisi}</p>
                        <p className="text-white/60 mt-0.5">{arti}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex1q} <InlineMath math="A(3, 2)" /> {t.ex1q2} <InlineMath math="B(7, 6)" />{t.ex1q3}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">{t.ex1posRel}</p>
                    <BlockMath math="\Delta x = x_B - x_A = 7 - 3 = 4" />
                    <BlockMath math="\Delta y = y_B - y_A = 6 - 2 = 4" />
                    <p className="text-white/70">{t.ex1posRelVal} <strong className="text-cyan-300">(4, 4)</strong></p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta x = 4 > 0" />: B 4 {language === "ja" ? "単位" : "satuan"} <strong className="text-cyan-300">{t.ex1kanan}</strong> A</p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta y = 4 > 0" />: B 4 {language === "ja" ? "単位" : "satuan"} <strong className="text-green-300">{t.ex1atas}</strong> A</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex1ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_med} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex2q} <InlineMath math="P(1, -3)" /> {t.ex2q2} <InlineMath math="(-4, 5)" /> {t.ex2q3}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">{t.ex2body}</p>
                    <BlockMath math="x_Q - x_P = -4 \Rightarrow x_Q = x_P + (-4) = 1 + (-4) = -3" />
                    <BlockMath math="y_Q - y_P = 5 \Rightarrow y_Q = y_P + 5 = -3 + 5 = 2" />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
                    <p className="text-yellow-200">💡 <strong>{t.ex2tip}</strong> {t.ex2tipBody}</p>
                    <p className="text-white/60 mt-0.5"><InlineMath math="B = A + (\Delta x, \Delta y)" /></p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex2ans} <InlineMath math="(-3, 2)" /></p>
                    <p className="text-white/60 text-xs mt-1">{t.ex2check}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex3q} <InlineMath math="A(-2, 4)" />, <InlineMath math="B(3, 1)" />{t.ex3q2} <InlineMath math="C(c_1, c_2)" />{t.ex3q3}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.step1}</p>
                      <BlockMath math="\Delta x_{BA} = x_B - x_A = 3 - (-2) = 5" />
                      <BlockMath math="\Delta y_{BA} = y_B - y_A = 1 - 4 = -3" />
                      <p className="text-white/70">{language === "ja" ? "AからみたBの相対位置 = " : "Posisi B relatif terhadap A = "}<strong className="text-cyan-300">(5, −3)</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">{t.step2}</p>
                      <p className="text-white/70">{t.step2body}</p>
                      <BlockMath math="c_1 = x_B + 5 = 3 + 5 = 8" />
                      <BlockMath math="c_2 = y_B + (-3) = 1 - 3 = -2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-white/60">
                      <p className="text-white/70 mb-1">{t.step2note}</p>
                      <p>{t.step2seq}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex3ans} <InlineMath math="(8, -2)" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.rangHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  {[
                    [t.rang1, t.rang1val],
                    [t.rang2, t.rang2val],
                    [t.rang3, t.rang3val],
                    [t.rang4, t.rang4val],
                    [t.rang5, t.rang5val],
                    [t.rang6, t.rang6val],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-xs"><strong>💡 {t.rangTip}</strong> {t.rangTipBody}</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RANGKUMAN ═══ */}
          <RangkumanSection
            gradientFrom="from-emerald-600" gradientVia="via-teal-600" gradientTo="to-cyan-700"
            borderColor="border-emerald-500/30" accentColor="text-emerald-200"
            headerIcon="📋" judul={t.rangkumanJudul}
            subjudul={t.rangkumanSubjudul}
            ringkasan={[
              { emoji:"🎯", judul: t.r1judul, bg:"bg-emerald-900/40", border:"border-emerald-500/30", textColor:"text-emerald-300", isi: t.r1isi },
              { emoji:"↔️", judul: t.r2judul, bg:"bg-teal-900/40", border:"border-teal-500/30", textColor:"text-teal-300", isi: t.r2isi },
              { emoji:"↕️", judul: t.r3judul, bg:"bg-cyan-900/40", border:"border-cyan-500/30", textColor:"text-cyan-300", isi: t.r3isi },
              { emoji:"🔄", judul: t.r4judul, bg:"bg-green-900/40", border:"border-green-500/30", textColor:"text-green-300", isi: t.r4isi },
            ]}
            rumus={[
              { label: t.rumusLabel, rumus:"\\Delta x = x_B - x_A \\qquad \\Delta y = y_B - y_A", bg:"bg-emerald-900/30", border:"border-emerald-500/25", labelColor:"text-emerald-300" },
            ]}
            tips={[
              { emoji:"🧠", teks: t.tip1 },
              { emoji:"🗺️", teks: t.tip2 },
              { emoji:"📐", teks: t.tip3 },
              { emoji:"✅", teks: t.tip4 },
            ]}
            kesimpulan={t.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20"
            kesimpulanBorder="border-emerald-400/40"
            kesimpulanTextColor="text-emerald-100/90"
          />

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifTitikAcuanPage;
