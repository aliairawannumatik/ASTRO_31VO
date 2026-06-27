import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const uiMap = {
  id: {
    pageTitle: "HUBUNGAN DUA GARIS",
    pageSubtitle: "Kelas 7 · Garis dan Sudut · Materi Matematika",
    examplesTitle: "CONTOH SOAL",
    soal: "Soal", pembahasan: "Pembahasan", backBtn: "Kembali ke Garis dan Sudut",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT", contoh: "Contoh",
    dTetap: "d tetap", titikPotong: "Titik Potong",
    bidangA: "bidang α", bidangB: "bidang β", bedaBidang: "⟵ berbeda bidang ⟶",
    berhimpit: "p dan q → satu garis yang sama",
    sec1: "Garis Sejajar", sec2: "Garis Berpotongan & Tegak Lurus",
    sec3: "Garis Berhimpit", sec4: "Garis Bersilangan",
    sec5: "Ringkasan: Tabel Perbandingan 4 Hubungan",
    tblH: "Hubungan", tblTP: "Titik Potong", tblSB: "Satu Bidang?", tblJ: "Jarak",
    tblSejajar: "Sejajar", tblBerpotongan: "Berpotongan", tblBerhimpit: "Berhimpit", tblBersilangan: "Bersilangan",
    tblTidakAda: "Tidak ada", tblSatuTitik: "Satu titik", tblInfinite: "∞ tak terhingga",
    tblYa: "✓ Ya", tblTidak: "✗ Tidak",
    tblTetap: "Selalu tetap", tblBerubah: "Berubah", tblNol: "= 0", tblVaries: "Ada, tidak tetap",
    capBerpot: "Berpotongan biasa", capTL: "Tegak lurus (90°)",
    s1p1: "Bayangkan rel kereta api yang membentang jauh ke cakrawala — kedua relnya tidak pernah bertemu, meskipun kamu perpanjang sampai ujung dunia. Inilah konsep",
    s1bold: "garis sejajar",
    s1def: "Definisi:", s1defTxt: "Dua garis dikatakan sejajar jika keduanya berada pada bidang yang sama dan tidak pernah berpotongan meskipun diperpanjang hingga tak terhingga.",
    s1sim: "Simbol:", s1ciri: "Ciri utama:", s1ciriTxt: "Jarak antara kedua garis selalu tetap/konstan di setiap titik.",
    s1tip: "Sifat Transitif Garis Sejajar: Jika", s1and: "dan", s1then: "maka",
    s2p1: "Ketika dua jalan raya saling bertemu di suatu persimpangan, itulah gambaran nyata dari",
    s2bold: "garis berpotongan",
    s2def: "Definisi:", s2defTxt: "Dua garis berpotongan jika keduanya memiliki tepat satu titik persekutuan (titik potong).",
    s2sp: "Kasus Khusus — Tegak Lurus:", s2spTxt: "Jika sudut yang terbentuk di titik potong tepat 90°, kedua garis disebut tegak lurus.",
    s2sim: "Simbol tegak lurus:", s2note: "Dua garis tegak lurus membagi bidang menjadi 4 sudut siku-siku yang sama besar.",
    s3p1: "Bayangkan kamu menggambar satu garis di atas garis yang sudah ada. Hasilnya terlihat seperti satu garis saja — inilah yang disebut",
    s3bold: "garis berhimpit",
    s3def: "Definisi:", s3defTxt: "Dua garis berhimpit jika keduanya terletak pada garis lurus yang persis sama, sehingga seolah-olah hanya ada satu garis.",
    s3ciri: "Ciri:", s3ciriTxt: "Setiap titik pada garis pertama juga merupakan titik pada garis kedua (titik persekutuan = tak terhingga).",
    s3note: "Garis berhimpit sering membingungkan karena secara visual terlihat seperti satu garis. Bedanya ada di persamaan garis — dua persamaan berbeda yang menghasilkan garis yang sama (misalnya",
    s3noteEnd: ").",
    s4p1: "Bayangkan jalan tol layang yang melintasi jalan biasa di bawahnya — mereka tidak berpotongan karena berada di ketinggian yang berbeda. Inilah",
    s4bold: "garis bersilangan",
    s4def: "Definisi:", s4defTxt: "Dua garis bersilangan jika keduanya tidak sejajar, tidak berpotongan, dan tidak berada pada satu bidang datar yang sama.",
    s4note: "Catatan:", s4noteTxt: "Garis bersilangan hanya ada pada bangun ruang (dimensi 3), bukan pada bidang datar.",
    s4ex: "Contoh nyata: rusuk-rusuk pada kubus yang tidak sejajar dan tidak berpotongan (misalnya rusuk bawah-depan dengan rusuk atas-kiri).",
    ex1q: "Rel kereta api membentang sejauh pandang mata. Kedua lintasannya tidak pernah bertemu meskipun diperpanjang ribuan kilometer. Tuliskan jenis hubungan kedua garis rel tersebut dan notasi matematikanya jika rel kiri adalah garis",
    ex1qEnd: "dan rel kanan adalah garis",
    ex1s1: "Langkah 1 — Identifikasi ciri:", ex1s2: "Langkah 2 — Kesimpulan:",
    ex1b1: "Kedua garis berada pada bidang yang sama (permukaan tanah).",
    ex1b2: "Kedua garis tidak pernah berpotongan.",
    ex1b3: "Jarak antara keduanya selalu tetap.",
    ex1ans: "Kedua garis rel adalah garis sejajar.",
    ex2q: "Perhatikan pernyataan-pernyataan berikut:",
    ex2s1: "Dua garis yang tidak sejajar pasti berpotongan.",
    ex2s3: "Dua garis berhimpit tidak memiliki titik potong sama sekali.",
    ex2s4: "Garis bersilangan hanya dapat terjadi pada ruang dimensi tiga.",
    ex2q2: "Tentukan pernyataan mana yang BENAR dan jelaskan alasannya!",
    ex2true: "Pernyataan yang BENAR:", ex2F: "SALAH", ex2T: "BENAR",
    ex2r1: "Dua garis yang tidak sejajar belum tentu berpotongan — bisa saja bersilangan (tidak sejajar, tidak berpotongan, beda bidang).",
    ex2r2: "Ini adalah sifat transitif garis sejajar. Jika", ex2r2b: "dapat disimpulkan",
    ex2r3: "Dua garis berhimpit justru memiliki tak terhingga titik persekutuan karena keduanya merupakan garis yang sama persis.",
    ex2r4: "Garis bersilangan memerlukan dua bidang berbeda, sehingga hanya mungkin terjadi pada ruang 3 dimensi.",
    ex3intro: "Perhatikan gambar dua garis sejajar berikut:",
    ex3q1: "Diketahui garis", ex3q2: "Titik A dan K berimpit di garis k, sedangkan B ada di garis h. Ruas garis",
    ex3q2b: "(tegak lurus garis h).", ex3q3: "Diketahui: AB = 8 satuan (jarak antar garis), PB = 17 satuan, dan KL = 10 satuan.",
    ex3q4: "Tentukan panjang", ex3s1: "Langkah 1 — Cari QB menggunakan Teorema Pythagoras:",
    ex3n1: "Segitiga PBQ siku-siku di B (karena AB ⊥ h dan AB = 8 = jarak antar garis):",
    ex3s2: "Langkah 2 — Cari PQ:", ex3n2: "(karena KBLQ adalah persegi panjang — sisi-sisi sejajar dan siku-siku).",
    ex3ans: "Jawaban:", ex3u: "satuan",
    ex3note: "Catatan: soal ini membutuhkan data gambar lengkap untuk menentukan posisi relatif P, Q, K, L secara tepat.",
    ex3tip: "💡 Kunci: Ketika dua garis sejajar dipotong garis transversal, gunakan Teorema Pythagoras untuk mencari jarak-jarak yang tidak diketahui pada segitiga siku-siku yang terbentuk.",
  },
  en: {
    pageTitle: "RELATIONSHIP BETWEEN TWO LINES",
    pageSubtitle: "Grade 7 · Lines & Angles · Mathematics",
    examplesTitle: "PRACTICE PROBLEMS",
    soal: "Problem", pembahasan: "Solution", backBtn: "Back to Lines & Angles",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD", contoh: "Example",
    dTetap: "d constant", titikPotong: "Intersection",
    bidangA: "plane α", bidangB: "plane β", bedaBidang: "⟵ different planes ⟶",
    berhimpit: "p and q → same line",
    sec1: "Parallel Lines", sec2: "Intersecting & Perpendicular Lines",
    sec3: "Coincident Lines", sec4: "Skew Lines",
    sec5: "Summary: Comparison of 4 Relationships",
    tblH: "Relationship", tblTP: "Intersection", tblSB: "Same Plane?", tblJ: "Distance",
    tblSejajar: "Parallel", tblBerpotongan: "Intersecting", tblBerhimpit: "Coincident", tblBersilangan: "Skew",
    tblTidakAda: "None", tblSatuTitik: "One point", tblInfinite: "∞ infinite",
    tblYa: "✓ Yes", tblTidak: "✗ No",
    tblTetap: "Always constant", tblBerubah: "Varies", tblNol: "= 0", tblVaries: "Exists, varies",
    capBerpot: "Intersecting", capTL: "Perpendicular (90°)",
    s1p1: "Imagine railway tracks stretching to the horizon — the two rails never meet, no matter how far you extend them. This is the concept of",
    s1bold: "parallel lines",
    s1def: "Definition:", s1defTxt: "Two lines are parallel if they lie in the same plane and never intersect, even when extended infinitely.",
    s1sim: "Symbol:", s1ciri: "Key feature:", s1ciriTxt: "The distance between the two lines is always constant at every point.",
    s1tip: "Transitive Property of Parallel Lines: If", s1and: "and", s1then: "then",
    s2p1: "When two roads meet at an intersection, that is a real-world example of",
    s2bold: "intersecting lines",
    s2def: "Definition:", s2defTxt: "Two lines intersect if they have exactly one common point (intersection point).",
    s2sp: "Special Case — Perpendicular:", s2spTxt: "If the angle formed at the intersection is exactly 90°, the lines are called perpendicular.",
    s2sim: "Perpendicular symbol:", s2note: "Two perpendicular lines divide the plane into 4 equal right angles.",
    s3p1: "Imagine drawing a line on top of an existing line. The result looks like a single line — this is called",
    s3bold: "coincident lines",
    s3def: "Definition:", s3defTxt: "Two lines are coincident if they lie on exactly the same straight line, making them appear as one.",
    s3ciri: "Feature:", s3ciriTxt: "Every point on the first line is also a point on the second line (common points = infinite).",
    s3note: "Coincident lines are often confusing because they look like a single line visually. The difference is in the equations — two different equations that produce the same line (e.g.",
    s3noteEnd: ").",
    s4p1: "Imagine a flyover crossing a road below — they do not intersect because they are at different heights. This is",
    s4bold: "skew lines",
    s4def: "Definition:", s4defTxt: "Two lines are skew if they are not parallel, do not intersect, and do not lie in the same plane.",
    s4note: "Note:", s4noteTxt: "Skew lines only exist in 3-dimensional space, not in a flat plane.",
    s4ex: "Real example: edges of a cube that are not parallel and do not intersect (e.g., the bottom-front edge and the top-left edge).",
    ex1q: "Railway tracks extend as far as the eye can see. The two tracks never meet even when extended for thousands of kilometres. State the relationship between the two rail lines and its notation if the left rail is line",
    ex1qEnd: "and the right rail is line",
    ex1s1: "Step 1 — Identify characteristics:", ex1s2: "Step 2 — Conclusion:",
    ex1b1: "Both lines are on the same plane (ground surface).",
    ex1b2: "The two lines never intersect.",
    ex1b3: "The distance between them is always constant.",
    ex1ans: "The two rail lines are parallel lines.",
    ex2q: "Examine the following statements:",
    ex2s1: "Two non-parallel lines must intersect.",
    ex2s3: "Coincident lines have no intersection point at all.",
    ex2s4: "Skew lines can only occur in three-dimensional space.",
    ex2q2: "Identify which statements are TRUE and explain why!",
    ex2true: "TRUE statements:", ex2F: "FALSE", ex2T: "TRUE",
    ex2r1: "Two non-parallel lines do not necessarily intersect — they could be skew lines (not parallel, not intersecting, different planes).",
    ex2r2: "This is the transitive property of parallel lines. If", ex2r2b: "we conclude",
    ex2r3: "Coincident lines actually have infinitely many common points because they are exactly the same line.",
    ex2r4: "Skew lines require two different planes, so they can only exist in 3-dimensional space.",
    ex3intro: "Observe the two parallel lines below:",
    ex3q1: "Given line", ex3q2: "Points A and K coincide on line k, while B is on line h. Segment",
    ex3q2b: "(perpendicular to h).", ex3q3: "Given: AB = 8 units (distance between lines), PB = 17 units, and KL = 10 units.",
    ex3q4: "Find the length of", ex3s1: "Step 1 — Find QB using the Pythagorean Theorem:",
    ex3n1: "Triangle PBQ is right-angled at B (since AB ⊥ h and AB = 8 = distance between lines):",
    ex3s2: "Step 2 — Find PQ:", ex3n2: "(since KBLQ is a rectangle — parallel and perpendicular sides).",
    ex3ans: "Answer:", ex3u: "units",
    ex3note: "Note: this problem requires the complete diagram data to determine the exact relative positions of P, Q, K, L.",
    ex3tip: "💡 Key: When two parallel lines are cut by a transversal, use the Pythagorean Theorem to find unknown distances in the right triangles formed.",
  },
  ja: {
    pageTitle: "2直線の関係",
    pageSubtitle: "中学1年 · 直線と角 · 数学",
    examplesTitle: "練習問題",
    soal: "問題", pembahasan: "解説", backBtn: "直線と角に戻る",
    mudah: "基本", sedang: "標準", sulit: "発展", contoh: "例題",
    dTetap: "d 一定", titikPotong: "交点",
    bidangA: "平面 α", bidangB: "平面 β", bedaBidang: "⟵ 異なる平面 ⟶",
    berhimpit: "p と q → 同じ直線",
    sec1: "平行線", sec2: "交わる直線と垂直",
    sec3: "重なる直線", sec4: "ねじれの位置",
    sec5: "まとめ：4つの関係の比較",
    tblH: "関係", tblTP: "交点", tblSB: "同一平面?", tblJ: "距離",
    tblSejajar: "平行", tblBerpotongan: "交わる", tblBerhimpit: "重なる", tblBersilangan: "ねじれ",
    tblTidakAda: "なし", tblSatuTitik: "1点", tblInfinite: "∞ 無限",
    tblYa: "✓ あり", tblTidak: "✗ なし",
    tblTetap: "常に一定", tblBerubah: "変化する", tblNol: "= 0", tblVaries: "あり、変化する",
    capBerpot: "交わる直線", capTL: "垂直（90°）",
    s1p1: "鉄道のレールが地平線まで延びているところを想像してください — どこまで伸ばしても2本のレールは交わりません。これが",
    s1bold: "平行線",
    s1def: "定義：", s1defTxt: "2直線が同一平面上にあり、どこまで延ばしても交わらないとき、その2直線を平行といいます。",
    s1sim: "記号：", s1ciri: "特徴：", s1ciriTxt: "2直線間の距離はどこでも常に一定です。",
    s1tip: "平行線の推移律：", s1and: "かつ", s1then: "ならば",
    s2p1: "2本の道路が交差点で出会う — これが",
    s2bold: "交わる直線",
    s2def: "定義：", s2defTxt: "2直線がちょうど1つの共有点（交点）をもつとき、その2直線は交わるといいます。",
    s2sp: "特殊な場合 — 垂直：", s2spTxt: "交点でできる角がちょうど90°のとき、2直線は垂直といいます。",
    s2sim: "垂直の記号：", s2note: "垂直な2直線は平面を4つの等しい直角に分けます。",
    s3p1: "すでにある直線の上に直線を引くと、見た目は1本の直線になります — これが",
    s3bold: "重なる直線",
    s3def: "定義：", s3defTxt: "2直線がまったく同じ直線上にあるとき、それらは重なるといいます。",
    s3ciri: "特徴：", s3ciriTxt: "第1の直線上のすべての点は第2の直線上にもあります（共有点 = 無限）。",
    s3note: "重なる直線は見た目が1本の直線なので混乱しやすいです。違いは方程式にあります — 異なる2つの方程式が同じ直線を表します（例：",
    s3noteEnd: "）。",
    s4p1: "高架道路が下の道路を通過しても交わらない — これが",
    s4bold: "ねじれの位置",
    s4def: "定義：", s4defTxt: "2直線が平行でなく、交わらず、同一平面上にもないとき、ねじれの位置にあるといいます。",
    s4note: "注意：", s4noteTxt: "ねじれの位置は3次元空間にのみ存在し、平面上には存在しません。",
    s4ex: "例：立方体の辺のうち、平行でも交わらないもの（例：前面下の辺と左面上の辺）。",
    ex1q: "鉄道のレールが遠くまで延びています。どこまで延ばしても2本のレールは交わりません。左のレールを直線",
    ex1qEnd: "、右のレールを直線",
    ex1s1: "ステップ1 — 特徴を確認：", ex1s2: "ステップ2 — 結論：",
    ex1b1: "2直線は同一平面上（地面）にある。",
    ex1b2: "2直線は交わらない。",
    ex1b3: "2直線間の距離は常に一定。",
    ex1ans: "2本のレールは平行線です。",
    ex2q: "次の命題を確認しましょう：",
    ex2s1: "平行でない2直線は必ず交わる。",
    ex2s3: "重なる直線は交点をもたない。",
    ex2s4: "ねじれの位置は3次元空間でのみ起こる。",
    ex2q2: "正しい命題を選び、理由を説明しなさい！",
    ex2true: "正しい命題：", ex2F: "誤り", ex2T: "正しい",
    ex2r1: "平行でない2直線は必ずしも交わらない — ねじれの位置（平行でなく、交わらず、異なる平面）の場合もあります。",
    ex2r2: "これは平行線の推移律です。", ex2r2b: "よって",
    ex2r3: "重なる直線はまったく同じ直線なので、共有点は無限にあります。",
    ex2r4: "ねじれの位置は2つの異なる平面が必要なので、3次元空間でのみ存在します。",
    ex3intro: "次の2本の平行線の図を見てください：",
    ex3q1: "直線", ex3q2: "点AとKは直線k上で一致し、Bは直線h上にあります。線分",
    ex3q2b: "（直線hに垂直）。", ex3q3: "既知：AB = 8単位（直線間の距離）、PB = 17単位、KL = 10単位。",
    ex3q4: "の長さを求めなさい！", ex3s1: "ステップ1 — 三平方の定理でQBを求める：",
    ex3n1: "三角形PBQはBで直角（AB⊥h、AB=8=2直線間の距離）：",
    ex3s2: "ステップ2 — PQを求める：", ex3n2: "（KBLQは長方形 — 平行かつ垂直な辺）。",
    ex3ans: "答え：", ex3u: "単位",
    ex3note: "注：この問題ではP、Q、K、Lの正確な相対位置を決めるために完全な図のデータが必要です。",
    ex3tip: "💡 ポイント：2本の平行線が横断線で切られるとき、三平方の定理を使って直角三角形の未知の距離を求めます。",
  },
};

type UI = typeof uiMap.id;

const SejajarSVG = ({ dLabel }: { dLabel: string }) => (
  <svg viewBox="0 0 320 120" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="arrowR1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" /></marker>
      <marker id="arrowL1" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse"><path d="M8,0 L8,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="arrowR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" /></marker>
      <marker id="arrowL2" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse"><path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" /></marker>
    </defs>
    <line x1="20" y1="40" x2="300" y2="40" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#arrowR1)" markerStart="url(#arrowL1)" />
    <line x1="20" y1="80" x2="300" y2="80" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#arrowR2)" markerStart="url(#arrowL2)" />
    <text x="305" y="44" fill="#22d3ee" fontSize="13" fontFamily="monospace">g</text>
    <text x="305" y="84" fill="#a78bfa" fontSize="13" fontFamily="monospace">h</text>
    <line x1="160" y1="40" x2="160" y2="80" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4,3" />
    <text x="165" y="65" fill="#facc15" fontSize="11" fontFamily="monospace">{dLabel}</text>
  </svg>
);

const BerpotSVG = ({ titikPotongLabel }: { titikPotongLabel: string }) => (
  <svg viewBox="0 0 320 140" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="bpArR1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" /></marker>
      <marker id="bpArL1" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse"><path d="M8,0 L8,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="bpArR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" /></marker>
      <marker id="bpArL2" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse"><path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" /></marker>
    </defs>
    <line x1="20" y1="110" x2="300" y2="30" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#bpArR1)" markerStart="url(#bpArL1)" />
    <line x1="20" y1="25" x2="300" y2="115" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#bpArR2)" markerStart="url(#bpArL2)" />
    <circle cx="160" cy="70" r="5" fill="#f87171" />
    <text x="167" y="66" fill="#f87171" fontSize="11" fontFamily="monospace">{titikPotongLabel}</text>
    <text x="24" y="124" fill="#22d3ee" fontSize="13" fontFamily="monospace">k</text>
    <text x="24" y="22" fill="#a78bfa" fontSize="13" fontFamily="monospace">l</text>
  </svg>
);

const TegakLurusSVG = () => (
  <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-3">
    <defs>
      <marker id="tlArU" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto"><path d="M0,8 L4,0 L8,8 z" fill="#22d3ee" /></marker>
      <marker id="tlArD" markerWidth="8" markerHeight="8" refX="4" refY="1" orient="auto-start-reverse"><path d="M0,0 L4,8 L8,0 z" fill="#22d3ee" /></marker>
      <marker id="tlArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" /></marker>
      <marker id="tlArL" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse"><path d="M8,0 L8,6 L0,3 z" fill="#a78bfa" /></marker>
    </defs>
    <line x1="100" y1="10" x2="100" y2="170" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#tlArU)" markerStart="url(#tlArD)" />
    <line x1="10" y1="90" x2="190" y2="90" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#tlArR)" markerStart="url(#tlArL)" />
    <rect x="100" y="78" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="2" />
    <text x="118" y="86" fill="#facc15" fontSize="11" fontFamily="monospace">90°</text>
    <text x="104" y="18" fill="#22d3ee" fontSize="13" fontFamily="monospace">m</text>
    <text x="178" y="86" fill="#a78bfa" fontSize="13" fontFamily="monospace">n</text>
  </svg>
);

const BerhimpitSVG = ({ label }: { label: string }) => (
  <svg viewBox="0 0 320 80" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="bhArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f87171" /></marker>
      <marker id="bhArL" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse"><path d="M8,0 L8,6 L0,3 z" fill="#f87171" /></marker>
    </defs>
    <line x1="20" y1="40" x2="300" y2="40" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#bhArR)" markerStart="url(#bhArL)" />
    <line x1="20" y1="40" x2="300" y2="40" stroke="#a78bfa" strokeWidth="2" strokeDasharray="8,6" opacity="0.8" />
    <text x="60" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace">{label}</text>
    <text x="300" y="35" fill="#22d3ee" fontSize="13" fontFamily="monospace">p(q)</text>
  </svg>
);

const BersilanganSVG = ({ bidangA, bidangB, bedaBidang }: { bidangA: string; bidangB: string; bedaBidang: string }) => (
  <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="bsArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" /></marker>
      <marker id="bsArR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#fb923c" /></marker>
    </defs>
    <polygon points="30,130 180,130 240,90 90,90" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,3" />
    <line x1="10" y1="110" x2="260" y2="110" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#bsArR)" />
    <line x1="160" y1="20" x2="90" y2="150" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#bsArR2)" />
    <text x="265" y="114" fill="#22d3ee" fontSize="12" fontFamily="monospace">a</text>
    <text x="88" y="158" fill="#fb923c" fontSize="12" fontFamily="monospace">b</text>
    <text x="75" y="82" fill="#64748b" fontSize="10" fontFamily="monospace">{bidangA}</text>
    <text x="80" y="140" fill="#64748b" fontSize="10" fontFamily="monospace">{bidangB}</text>
    <text x="80" y="10" fill="#94a3b8" fontSize="10" fontFamily="monospace">{bedaBidang}</text>
  </svg>
);

type Section = { title: string; icon: string; content: React.ReactNode };

const getSections = (ui: UI): Section[] => [
  {
    title: ui.sec1, icon: "〰️",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s1p1} <strong className="text-cyan-300">{ui.s1bold}</strong>.</p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4">
          <p><strong className="text-cyan-300">{ui.s1def}</strong> {ui.s1defTxt}</p>
          <p className="mt-2"><strong className="text-cyan-300">{ui.s1sim}</strong> <InlineMath math="g \parallel h" /></p>
          <p className="mt-1"><strong className="text-cyan-300">{ui.s1ciri}</strong> {ui.s1ciriTxt}</p>
        </div>
        <SejajarSVG dLabel={ui.dTetap} />
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 <strong>{ui.s1tip}</strong> <InlineMath math="a \parallel b" /> {ui.s1and} <InlineMath math="b \parallel c" />, {ui.s1then} <InlineMath math="a \parallel c" />.
        </div>
      </div>
    ),
  },
  {
    title: ui.sec2, icon: "✕",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s2p1} <strong className="text-violet-300">{ui.s2bold}</strong>.</p>
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
          <p><strong className="text-violet-300">{ui.s2def}</strong> {ui.s2defTxt}</p>
          <p><strong className="text-violet-300">{ui.s2sp}</strong> {ui.s2spTxt}</p>
          <p><strong className="text-violet-300">{ui.s2sim}</strong> <InlineMath math="k \perp l" /></p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-xs text-white/50 text-center mb-1">{ui.capBerpot}</p><BerpotSVG titikPotongLabel={ui.titikPotong} /></div>
          <div><p className="text-xs text-white/50 text-center mb-1">{ui.capTL}</p><TegakLurusSVG /></div>
        </div>
        <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">📐 {ui.s2note}</div>
      </div>
    ),
  },
  {
    title: ui.sec3, icon: "═",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s3p1} <strong className="text-red-300">{ui.s3bold}</strong>.</p>
        <div className="bg-red-950/50 border border-red-700/40 rounded-lg p-4">
          <p><strong className="text-red-300">{ui.s3def}</strong> {ui.s3defTxt}</p>
          <p className="mt-2"><strong className="text-red-300">{ui.s3ciri}</strong> {ui.s3ciriTxt}</p>
        </div>
        <BerhimpitSVG label={ui.berhimpit} />
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          ⚠️ {ui.s3note} <InlineMath math="y = 2x" /> {ui.s1and} <InlineMath math="2y = 4x" />{ui.s3noteEnd}
        </div>
      </div>
    ),
  },
  {
    title: ui.sec4, icon: "⤢",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s4p1} <strong className="text-orange-300">{ui.s4bold}</strong>.</p>
        <div className="bg-orange-950/50 border border-orange-700/40 rounded-lg p-4">
          <p><strong className="text-orange-300">{ui.s4def}</strong> {ui.s4defTxt}</p>
          <p className="mt-2"><strong className="text-orange-300">{ui.s4note}</strong> {ui.s4noteTxt}</p>
        </div>
        <BersilanganSVG bidangA={ui.bidangA} bidangB={ui.bidangB} bedaBidang={ui.bedaBidang} />
        <div className="bg-orange-950/40 border border-orange-600/30 rounded-lg p-3 text-xs text-orange-200">🏗️ {ui.s4ex}</div>
      </div>
    ),
  },
  {
    title: ui.sec5, icon: "📊",
    content: (
      <div className="space-y-3 text-sm font-body">
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblH}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblTP}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblSB}</th>
                <th className="px-3 py-2 text-cyan-300">{ui.tblJ}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: ui.tblSejajar, color: "text-cyan-300", bg: "bg-cyan-950/30", tp: ui.tblTidakAda, sb: ui.tblYa, sbColor: "text-green-400", j: ui.tblTetap },
                { label: ui.tblBerpotongan, color: "text-violet-300", bg: "bg-violet-950/30", tp: ui.tblSatuTitik, sb: ui.tblYa, sbColor: "text-green-400", j: ui.tblBerubah },
                { label: ui.tblBerhimpit, color: "text-red-300", bg: "bg-red-950/30", tp: ui.tblInfinite, sb: ui.tblYa, sbColor: "text-green-400", j: ui.tblNol },
                { label: ui.tblBersilangan, color: "text-orange-300", bg: "bg-orange-950/30", tp: ui.tblTidakAda, sb: ui.tblTidak, sbColor: "text-red-400", j: ui.tblVaries },
              ].map((row, i) => (
                <tr key={i} className={`border-t border-slate-700 ${row.bg}`}>
                  <td className={`px-3 py-2 font-semibold border-r border-slate-700 ${row.color}`}>{row.label}</td>
                  <td className="px-3 py-2 text-white/70 border-r border-slate-700">{row.tp}</td>
                  <td className={`px-3 py-2 border-r border-slate-700 ${row.sbColor}`}>{row.sb}</td>
                  <td className="px-3 py-2 text-white/70">{row.j}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

type Example = { level: string; color: string; bg: string; border: string; question: React.ReactNode; answer: React.ReactNode };

const getExamples = (ui: UI): Example[] => [
  {
    level: ui.mudah, color: "text-green-400", bg: "bg-green-950/40", border: "border-green-700/50",
    question: (
      <p className="text-sm text-white/85 font-body">
        {ui.ex1q} <InlineMath math="p" /> {ui.ex1qEnd} <InlineMath math="q" />.
      </p>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">{ui.ex1s1}</strong></p>
        <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
          <li>{ui.ex1b1}</li><li>{ui.ex1b2}</li><li>{ui.ex1b3}</li>
        </ul>
        <p className="text-white/80 mt-2"><strong className="text-green-400">{ui.ex1s2}</strong></p>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300">{ui.ex1ans}</p>
          <BlockMath math="p \parallel q" />
        </div>
      </div>
    ),
  },
  {
    level: ui.sedang, color: "text-yellow-400", bg: "bg-yellow-950/40", border: "border-yellow-700/50",
    question: (
      <p className="text-sm text-white/85 font-body">
        {ui.ex2q}
        <br />(i) {ui.ex2s1}
        <br />(ii) {ui.s1tip} <InlineMath math="a \parallel b" /> {ui.s1and} <InlineMath math="b \parallel c" />, {ui.s1then} <InlineMath math="a \parallel c" />.
        <br />(iii) {ui.ex2s3}
        <br />(iv) {ui.ex2s4}
        <br /><br /><strong>{ui.ex2q2}</strong>
      </p>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="space-y-2">
          <div className="flex gap-2 items-start">
            <span className="text-red-400 font-bold shrink-0">(i) {ui.ex2F}</span>
            <p className="text-white/70">{ui.ex2r1}</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-green-400 font-bold shrink-0">(ii) {ui.ex2T}</span>
            <p className="text-white/70">{ui.ex2r2} <InlineMath math="a \parallel b" /> {ui.s1and} <InlineMath math="b \parallel c" />, {ui.ex2r2b} <InlineMath math="a \parallel c" />.</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-red-400 font-bold shrink-0">(iii) {ui.ex2F}</span>
            <p className="text-white/70">{ui.ex2r3}</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-green-400 font-bold shrink-0">(iv) {ui.ex2T}</span>
            <p className="text-white/70">{ui.ex2r4}</p>
          </div>
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">{ui.ex2true} <strong>(ii) {ui.s1and} (iv)</strong></p>
        </div>
      </div>
    ),
  },
  {
    level: ui.sulit, color: "text-red-400", bg: "bg-red-950/40", border: "border-red-700/50",
    question: (
      <div className="text-sm text-white/85 font-body space-y-2">
        <p>{ui.ex3intro}</p>
        <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto my-2">
          <line x1="20" y1="40" x2="320" y2="40" stroke="#22d3ee" strokeWidth="2" />
          <line x1="20" y1="140" x2="320" y2="140" stroke="#a78bfa" strokeWidth="2" />
          <text x="10" y="36" fill="#22d3ee" fontSize="13" fontFamily="monospace">k</text>
          <text x="10" y="136" fill="#a78bfa" fontSize="13" fontFamily="monospace">h</text>
          <circle cx="80" cy="40" r="4" fill="#fb923c" />
          <circle cx="200" cy="40" r="4" fill="#fb923c" />
          <circle cx="80" cy="140" r="4" fill="#f87171" />
          <circle cx="200" cy="140" r="4" fill="#f87171" />
          <text x="74" y="30" fill="#fb923c" fontSize="12" fontFamily="monospace">P</text>
          <text x="196" y="30" fill="#fb923c" fontSize="12" fontFamily="monospace">K</text>
          <text x="74" y="157" fill="#f87171" fontSize="12" fontFamily="monospace">Q</text>
          <text x="196" y="157" fill="#f87171" fontSize="12" fontFamily="monospace">L</text>
          <line x1="200" y1="40" x2="200" y2="140" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="205" y="95" fill="#facc15" fontSize="11" fontFamily="monospace">AB = 8</text>
          <line x1="80" y1="40" x2="200" y2="140" stroke="#4ade80" strokeWidth="2" />
          <text x="120" y="100" fill="#4ade80" fontSize="11" fontFamily="monospace" transform="rotate(39,140,90)">PB = 17</text>
          <circle cx="200" cy="40" r="3" fill="#facc15" />
          <text x="205" y="38" fill="#facc15" fontSize="10" fontFamily="monospace">A(K)</text>
          <line x1="80" y1="140" x2="200" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="125" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">QB</text>
          <rect x="200" y="128" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5" />
        </svg>
        <p>{ui.ex3q1} <InlineMath math="k \parallel h" />. {ui.ex3q2} <InlineMath math="AB \perp h" /> {ui.ex3q2b}</p>
        <p>{ui.ex3q3}</p>
        <p>{ui.ex3q4} <InlineMath math="PQ" />!</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">{ui.ex3s1}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-1">{ui.ex3n1}</p>
          <BlockMath math="QB = \sqrt{PB^2 - AB^2} = \sqrt{17^2 - 8^2} = \sqrt{225} = 15" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">{ui.ex3s2}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs mb-1"><InlineMath math="KL = QB = 15" /> {ui.ex3n2}</p>
          <BlockMath math="PQ = QB - KL = 15 - 10 = 5" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">{ui.ex3ans} <InlineMath math="PQ = 6" /> {ui.ex3u}</p>
          <p className="text-white/60 text-xs mt-1">({ui.ex3note})</p>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded p-3 text-xs text-cyan-200">{ui.ex3tip}</div>
      </div>
    ),
  },
];

const AccordionSection = ({ section }: { section: Section }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
        onClick={() => { playPopSound(); setOpen((o) => !o); }}>
        <span className="font-display text-sm font-semibold text-white flex items-center gap-2">
          <span>{section.icon}</span> {section.title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-primary shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5">{section.content}</div>}
    </div>
  );
};

const ExampleCard = ({ example, idx, contoh, soal, pembahasan }: {
  example: Example; idx: number; contoh: string; soal: string; pembahasan: string;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl border ${example.border} ${example.bg} overflow-hidden`}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
        onClick={() => { playPopSound(); setOpen((o) => !o); }}>
        <span className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${example.border} ${example.color}`}>{example.level}</span>
          <span className="font-body text-sm text-white/80">{contoh} {idx + 1}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-white/50 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4">
          <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-4">
            <p className="text-xs text-white/40 font-body mb-2 uppercase tracking-wider">{soal}</p>
            {example.question}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-white/40 font-body uppercase tracking-wider">{pembahasan}</p>
            {example.answer}
          </div>
        </div>
      )}
    </div>
  );
};

const HubunganDuaGarisPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const ui = uiMap[lang] ?? uiMap.id;
  const sections = getSections(ui);
  const examples = getExamples(ui);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {ui.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{ui.pageSubtitle}</p>
        <div className="flex flex-col gap-3 mb-10">
          {sections.map((s) => <AccordionSection key={s.title} section={s} />)}
        </div>
        <div className="mb-4">
          <h2 className="font-display text-base font-bold text-primary mb-3 text-center">{ui.examplesTitle}</h2>
          <div className="flex flex-col gap-3">
            {examples.map((ex, i) => (
              <ExampleCard key={i} example={ex} idx={i} contoh={ui.contoh} soal={ui.soal} pembahasan={ui.pembahasan} />
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/garis-dan-sudut"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {ui.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubunganDuaGarisPage;
