import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, FlaskConical, Lightbulb } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─── Translations ─────────────────────────────────────── */
const translations = {
  id: {
    h1: "UNSUR-UNSUR LINGKARAN",
    subtitle: "Kelas 8 · Lingkaran · Materi Matematika",
    backBtn: "← Kembali ke Lingkaran",
    introTitle: "Apa Itu Lingkaran?",
    introP1: "Lingkaran adalah himpunan semua titik yang berjarak sama dari satu titik tetap yang disebut ",
    introPusat: "pusat",
    introP2: ". Jarak tersebut disebut ",
    introJari: "jari-jari (r)",
    introP3: ". Klik setiap slide di bawah untuk mempelajari unsur-unsurnya!",
    keyFactLabel: "💡 Fakta Kunci",
    formulaLabel: "Rumus",
    prev: "Sebelumnya",
    next: "Berikutnya",
    jumpTo: "Loncat ke unsur:",
    // Slide — Titik Pusat
    pusat_title: "Titik Pusat",
    pusat_desc: "Titik Pusat adalah titik yang menjadi acuan lingkaran. Setiap titik di garis lingkaran memiliki jarak yang SAMA persis dari titik pusat ini. Jarak tersebut disebut jari-jari.",
    pusat_keyFact: "Titik pusat biasanya dilambangkan dengan huruf O dan merupakan 'jantung' dari lingkaran.",
    pusat_caption: "Semua titik di lingkaran berjarak r dari O",
    pusat_aria: "Titik Pusat Lingkaran",
    // Slide — Jari-jari
    jari_title: "Jari-jari",
    jari_desc: "Jari-jari adalah ruas garis yang menghubungkan titik pusat O dengan titik mana saja yang berada di garis lingkaran. Semua jari-jari dalam satu lingkaran panjangnya SELALU sama.",
    jari_keyFact: "Dalam satu lingkaran, banyak jari-jari yang bisa digambar — dan semuanya panjangnya sama.",
    jari_caption: "r = jarak dari pusat O ke titik di lingkaran",
    jari_aria: "Jari-jari Lingkaran",
    // Slide — Diameter
    diam_title: "Diameter",
    diam_desc: "Diameter adalah tali busur yang melewati titik pusat O. Diameter merupakan tali busur TERPANJANG dalam sebuah lingkaran. Panjangnya dua kali jari-jari.",
    diam_keyFact: "Diameter membagi lingkaran menjadi dua bagian yang sama besar (dua setengah lingkaran).",
    diam_caption: "d = 2r  (melewati pusat O)",
    diam_aria: "Diameter Lingkaran",
    // Slide — Tali Busur
    tali_title: "Tali Busur",
    tali_desc: "Tali Busur adalah ruas garis lurus yang menghubungkan dua titik yang berada di garis lingkaran. Tali busur TIDAK harus melewati titik pusat. Jika melewati pusat, maka ia adalah diameter.",
    tali_keyFact: "Diameter adalah tali busur terpanjang! Semua tali busur lainnya panjangnya kurang dari diameter.",
    tali_caption: "Tidak harus melewati pusat lingkaran",
    tali_aria: "Tali Busur Lingkaran",
    // Slide — Busur
    busur_title: "Busur",
    busur_desc: "Busur adalah bagian dari garis lengkung (keliling) lingkaran yang dibatasi oleh dua titik. Ada Busur Minor (busur kecil, kurang dari setengah lingkaran) dan Busur Mayor (busur besar, lebih dari setengah lingkaran).",
    busur_keyFact: "Busur adalah GARIS LENGKUNG — bukan daerah. Panjang busur sebanding dengan sudut pusatnya.",
    busur_caption: "Bagian dari keliling (garis lengkung) lingkaran",
    busur_aria: "Busur Lingkaran",
    busur_formulaPrefix: "Panjang Busur",
    // Slide — Juring
    juring_title: "Juring (Sektor)",
    juring_desc: "Juring adalah daerah (luas) yang dibatasi oleh dua jari-jari dan busur yang mengapitnya. Bentuknya seperti potongan pizza atau irisan semangka. Juring sering disebut juga sebagai sektor.",
    juring_keyFact: "Juring adalah DAERAH (punya luas), bukan garis. Semakin besar sudut pusatnya, semakin luas juringnya.",
    juring_caption: "Daerah antara 2 jari-jari dan busur",
    juring_aria: "Juring Lingkaran",
    // Slide — Tembereng
    temb_title: "Tembereng",
    temb_desc: "Tembereng adalah daerah yang dibatasi oleh tali busur dan busur yang bersesuaian. Bentuknya mirip bulan sabit. Tembereng = Juring − Segitiga yang dibentuk oleh dua jari-jari dan tali busurnya.",
    temb_keyFact: "Tembereng adalah DAERAH (punya luas). Bentuknya seperti bulan sabit antara tali busur dan busur.",
    temb_caption: "Daerah antara tali busur AB dan busurnya",
    temb_aria: "Tembereng Lingkaran",
    // Slide — Apotema
    apo_title: "Apotema",
    apo_desc: "Apotema adalah jarak terpendek dari titik pusat O ke tali busur AB. Garis apotema selalu tegak lurus (⊥) terhadap tali busur dan memotong tali busur tepat di titik tengahnya.",
    apo_keyFact: "Apotema selalu tegak lurus terhadap tali busur dan membaginya menjadi dua bagian yang sama panjang.",
    apo_caption: "Jarak terpendek dari pusat ke tali busur",
    apo_aria: "Apotema Lingkaran",
    // Examples
    c1_header: "✏️ Contoh 1 — Identifikasi Unsur (Mudah)",
    c1_level: "🟢 Tingkat: Mudah",
    c1_q: "Lingkaran berpusat di O dengan titik A, B, C, dan D pada lingkaran. Jika ",
    c1_q2: " cm, sebutkan mana yang merupakan jari-jari, diameter, dan tali busur dari unsur: OA, OB, AB, dan CD yang melewati O!",
    c1_sol: "📋 Pembahasan",
    c1_p1: " = jari-jari, karena menghubungkan pusat ke titik di lingkaran. ",
    c1_p2: " = diameter, karena merupakan tali busur terpanjang yang melewati pusat.",
    c1_p3: " = tali busur, karena menghubungkan dua titik di lingkaran tapi tidak melewati pusat.",
    c1_check: "✅ Jari-jari = OA = OB = 7 cm | Diameter = CD = 14 cm | Tali Busur = AB",
    c2_header: "✏️ Contoh 2 — Mencari Jari-jari & Diameter (Sedang)",
    c2_level: "🟡 Tingkat: Sedang",
    c2_q: "Lingkaran O memiliki diameter ",
    c2_q2: " cm dan jari-jari ",
    c2_q3: " cm. Tentukan panjang jari-jari dan diameter lingkaran tersebut!",
    c2_sol: "📋 Pembahasan",
    c2_p1: "Gunakan hubungan: ",
    c2_rel: "diameter = 2 × jari-jari",
    c2_check: "✅ Jari-jari = 11 cm, Diameter = 22 cm (cek: 2 × 11 = 22 ✓)",
    c3_header: "✏️ Contoh 3 — Apotema dan Tali Busur (Sulit)",
    c3_level: "🔴 Tingkat: Sulit",
    c3_q: "Lingkaran berpusat di O dengan jari-jari 13 cm. Tali busur AB tegak lurus terhadap jari-jari OC di titik D, dan ",
    c3_q2: " cm. Tentukan panjang tali busur AB!",
    c3_sol: "📋 Pembahasan",
    c3_p1: "Karena OC ⊥ AB di titik D, maka OD adalah ",
    c3_apo: "apotema",
    c3_p2: " dan D adalah titik tengah AB.",
    c3_p3: "Gunakan teorema Pythagoras pada segitiga ODA:",
    c3_p4: "Karena D adalah titik tengah AB:",
    c3_check: "✅ Panjang tali busur AB = 24 cm.",
    rangkuman_header: "📌 Rangkuman Unsur-Unsur Lingkaran",
    tips: "🚀 Tips Astronot: Apotema digunakan dalam desain antena parabola dan satelit — semakin banyak sisi poligon, apotema-nya mendekati jari-jari lingkaran. Begitulah antena parabola dirancang!",
  },
  en: {
    h1: "PARTS OF A CIRCLE",
    subtitle: "Grade 8 · Circle · Math Animation Book",
    backBtn: "← Back to Circle",
    introTitle: "What Is a Circle?",
    introP1: "A circle is the set of all points equidistant from a fixed point called the ",
    introPusat: "center",
    introP2: ". That distance is called the ",
    introJari: "radius (r)",
    introP3: ". Click each slide below to learn about its parts!",
    keyFactLabel: "💡 Key Fact",
    formulaLabel: "Formula",
    prev: "Previous",
    next: "Next",
    jumpTo: "Jump to part:",
    pusat_title: "Center",
    pusat_desc: "The Center is the reference point of the circle. Every point on the circle is EXACTLY the same distance from this center. That distance is called the radius.",
    pusat_keyFact: "The center is usually labeled O and is the 'heart' of the circle.",
    pusat_caption: "All points on the circle are r from O",
    pusat_aria: "Circle Center Point",
    jari_title: "Radius",
    jari_desc: "The Radius is a line segment connecting the center O to any point on the circle. All radii in a single circle are ALWAYS the same length.",
    jari_keyFact: "You can draw many radii in one circle — they all have the same length.",
    jari_caption: "r = distance from center O to a point on the circle",
    jari_aria: "Circle Radius",
    diam_title: "Diameter",
    diam_desc: "The Diameter is a chord that passes through the center O. It is the LONGEST chord in a circle. Its length is twice the radius.",
    diam_keyFact: "The diameter divides the circle into two equal halves (two semicircles).",
    diam_caption: "d = 2r  (passes through center O)",
    diam_aria: "Circle Diameter",
    tali_title: "Chord",
    tali_desc: "A Chord is a straight line segment connecting any two points on the circle. A chord does NOT have to pass through the center. If it does, it is the diameter.",
    tali_keyFact: "The diameter is the longest chord! All other chords are shorter than the diameter.",
    tali_caption: "Does not need to pass through the center",
    tali_aria: "Circle Chord",
    busur_title: "Arc",
    busur_desc: "An Arc is a portion of the circumference (curved line) of a circle bounded by two points. There is a Minor Arc (less than a semicircle) and a Major Arc (more than a semicircle).",
    busur_keyFact: "An arc is a CURVED LINE — not an area. Arc length is proportional to its central angle.",
    busur_caption: "Part of the circumference (curved line) of the circle",
    busur_aria: "Circle Arc",
    busur_formulaPrefix: "Arc Length",
    juring_title: "Sector",
    juring_desc: "A Sector is the region bounded by two radii and the arc between them. It looks like a pizza slice or a wedge of melon. A sector is also called a circular sector.",
    juring_keyFact: "A sector is a REGION (has area), not a line. The larger the central angle, the larger the sector.",
    juring_caption: "Region between 2 radii and the arc",
    juring_aria: "Circle Sector",
    temb_title: "Segment",
    temb_desc: "A Segment is the region bounded by a chord and its corresponding arc. It looks like a crescent moon. Segment = Sector − Triangle formed by the two radii and the chord.",
    temb_keyFact: "A segment is a REGION (has area). It is shaped like a crescent between the chord and the arc.",
    temb_caption: "Region between chord AB and its arc",
    temb_aria: "Circle Segment",
    apo_title: "Apothem",
    apo_desc: "The Apothem is the shortest distance from the center O to a chord AB. The apothem is always perpendicular (⊥) to the chord and meets it at its exact midpoint.",
    apo_keyFact: "The apothem is always perpendicular to the chord and bisects it into two equal parts.",
    apo_caption: "Shortest distance from the center to a chord",
    apo_aria: "Circle Apothem",
    c1_header: "✏️ Example 1 — Identifying Parts (Easy)",
    c1_level: "🟢 Level: Easy",
    c1_q: "A circle centered at O has points A, B, C, and D on the circle. If ",
    c1_q2: " cm, identify which of OA, OB, AB, and CD (passing through O) are the radius, diameter, and chord.",
    c1_sol: "📋 Solution",
    c1_p1: " = radius, connecting the center to a point on the circle. ",
    c1_p2: " = diameter, the longest chord passing through the center.",
    c1_p3: " = chord, connecting two points on the circle without passing through the center.",
    c1_check: "✅ Radius = OA = OB = 7 cm | Diameter = CD = 14 cm | Chord = AB",
    c2_header: "✏️ Example 2 — Finding Radius & Diameter (Medium)",
    c2_level: "🟡 Level: Medium",
    c2_q: "Circle O has diameter ",
    c2_q2: " cm and radius ",
    c2_q3: " cm. Find the radius and diameter of the circle.",
    c2_sol: "📋 Solution",
    c2_p1: "Use the relationship: ",
    c2_rel: "diameter = 2 × radius",
    c2_check: "✅ Radius = 11 cm, Diameter = 22 cm (check: 2 × 11 = 22 ✓)",
    c3_header: "✏️ Example 3 — Apothem & Chord (Hard)",
    c3_level: "🔴 Level: Hard",
    c3_q: "A circle centered at O has radius 13 cm. Chord AB is perpendicular to radius OC at point D, and ",
    c3_q2: " cm. Find the length of chord AB.",
    c3_sol: "📋 Solution",
    c3_p1: "Since OC ⊥ AB at D, OD is the ",
    c3_apo: "apothem",
    c3_p2: " and D is the midpoint of AB.",
    c3_p3: "Apply the Pythagorean theorem to triangle ODA:",
    c3_p4: "Since D is the midpoint of AB:",
    c3_check: "✅ Length of chord AB = 24 cm.",
    rangkuman_header: "📌 Summary — Parts of a Circle",
    tips: "🚀 Astronaut Tip: The apothem is used in the design of parabolic antennas and satellites — as the number of polygon sides increases, the apothem approaches the circle's radius. That's how parabolic antennas are engineered!",
  },
  ja: {
    h1: "円の各部名称",
    subtitle: "中学2年 · 円 · 数学アニメーション",
    backBtn: "← 円に戻る",
    introTitle: "円とは？",
    introP1: "円とは、1 つの定点（",
    introPusat: "中心",
    introP2: "）から等距離にあるすべての点の集まりです。その距離を",
    introJari: "半径（r）",
    introP3: "といいます。下のスライドをタップして各部の名称を学びましょう！",
    keyFactLabel: "💡 重要ポイント",
    formulaLabel: "公式",
    prev: "前へ",
    next: "次へ",
    jumpTo: "各部に移動：",
    pusat_title: "中心",
    pusat_desc: "中心とは、円の基準となる点です。円上のすべての点は、この中心から必ず同じ距離にあります。その距離を半径といいます。",
    pusat_keyFact: "中心は通常 O で表され、円の「核心」です。",
    pusat_caption: "円上のすべての点がOからrの距離にある",
    pusat_aria: "円の中心点",
    jari_title: "半径",
    jari_desc: "半径とは、中心 O から円上の任意の点までの線分です。1 つの円の中で、すべての半径の長さは常に等しいです。",
    jari_keyFact: "1 つの円に半径は無数に引けますが、すべて同じ長さです。",
    jari_caption: "r = 中心Oから円上の点までの距離",
    jari_aria: "円の半径",
    diam_title: "直径",
    diam_desc: "直径とは、中心 O を通る弦です。円の中で最も長い弦です。長さは半径の 2 倍です。",
    diam_keyFact: "直径は円を 2 つの等しい半円に分けます。",
    diam_caption: "d = 2r（中心Oを通る）",
    diam_aria: "円の直径",
    tali_title: "弦",
    tali_desc: "弦とは、円上の 2 点を結ぶ線分です。弦は中心を通る必要はありません。中心を通る弦が直径です。",
    tali_keyFact: "直径が最も長い弦です！それ以外の弦はすべて直径より短くなります。",
    tali_caption: "中心を通る必要はない",
    tali_aria: "円の弦",
    busur_title: "弧",
    busur_desc: "弧とは、円周（曲線）上の 2 点に挟まれた部分です。半円より短い弧を「劣弧」、長い弧を「優弧」といいます。",
    busur_keyFact: "弧は曲線であり、面積をもつ領域ではありません。弧の長さは中心角に比例します。",
    busur_caption: "円周（曲線）の一部",
    busur_aria: "円の弧",
    busur_formulaPrefix: "弧の長さ",
    juring_title: "扇形",
    juring_desc: "扇形とは、2 本の半径とその間の弧で囲まれた領域です。ピザのスライスやすいかの切り身のような形です。「セクター」とも呼ばれます。",
    juring_keyFact: "扇形は面積をもつ領域です。中心角が大きいほど扇形の面積も大きくなります。",
    juring_caption: "2本の半径と弧に囲まれた領域",
    juring_aria: "円の扇形",
    temb_title: "弓形",
    temb_desc: "弓形とは、弦とそれに対応する弧で囲まれた領域です。三日月のような形です。弓形 ＝ 扇形 − 2 本の半径と弦からなる三角形。",
    temb_keyFact: "弓形は面積をもつ領域です。弦と弧の間の三日月形をしています。",
    temb_caption: "弦ABと弧の間の領域",
    temb_aria: "円の弓形",
    apo_title: "アポテマ",
    apo_desc: "アポテマとは、中心 O から弦 AB への最短距離です。アポテマは弦に必ず垂直（⊥）で、弦のちょうど中点と交わります。",
    apo_keyFact: "アポテマは弦に垂直で、弦を 2 等分します。",
    apo_caption: "中心から弦への最短距離",
    apo_aria: "円のアポテマ",
    c1_header: "✏️ 例題 1 — 各部名称の識別（基本）",
    c1_level: "🟢 レベル：基本",
    c1_q: "円Oの上に点A、B、C、Dがあります。",
    c1_q2: " cmのとき、OA、OB、AB、Oを通るCDのうち、半径・直径・弦はどれかを答えなさい。",
    c1_sol: "📋 解説",
    c1_p1: " は半径（中心から円上の点への線分）。",
    c1_p2: " は直径（中心を通る最長の弦）。",
    c1_p3: " は弦（円上の2点を結ぶが中心を通らない）。",
    c1_check: "✅ 半径 = OA = OB = 7 cm｜直径 = CD = 14 cm｜弦 = AB",
    c2_header: "✏️ 例題 2 — 半径と直径を求める（標準）",
    c2_level: "🟡 レベル：標準",
    c2_q: "円Oの直径が",
    c2_q2: " cm、半径が",
    c2_q3: " cmです。半径と直径の長さを求めなさい。",
    c2_sol: "📋 解説",
    c2_p1: "関係式を使います：",
    c2_rel: "直径 = 2 × 半径",
    c2_check: "✅ 半径 = 11 cm、直径 = 22 cm（確認：2 × 11 = 22 ✓）",
    c3_header: "✏️ 例題 3 — アポテマと弦（発展）",
    c3_level: "🔴 レベル：発展",
    c3_q: "円Oの半径は 13 cm です。弦ABが半径OCに点Dで垂直に交わり、",
    c3_q2: " cmです。弦ABの長さを求めなさい。",
    c3_sol: "📋 解説",
    c3_p1: "OC ⊥ AB（点D）より、ODは",
    c3_apo: "アポテマ",
    c3_p2: "であり、DはABの中点です。",
    c3_p3: "三角形ODAでピタゴラスの定理を使います：",
    c3_p4: "DがABの中点なので：",
    c3_check: "✅ 弦AB の長さ = 24 cm。",
    rangkuman_header: "📌 まとめ — 円の各部名称",
    tips: "🚀 宇宙人のヒント：アポテマは、パラボラアンテナや衛星の設計に使われています。多角形の辺数が増えるほど、アポテマは円の半径に近づきます。これがパラボラアンテナの設計原理です！",
  },
} as const;
type T = typeof translations.id;

/* ─── SVG Components (accept caption + ariaLabel props) ── */
const PusatSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes pusatPulse{0%,100%{opacity:1;filter:drop-shadow(0 0 10px #fbbf24);}50%{opacity:0.4;filter:drop-shadow(0 0 2px #fbbf24);}}
        @keyframes ringExp{0%{r:8;opacity:0.9;}100%{r:50;opacity:0;}}
        .p-dot{animation:pusatPulse 1.4s ease-in-out infinite;}
        .p-r1{animation:ringExp 2s ease-out infinite;}
        .p-r2{animation:ringExp 2s ease-out infinite 0.8s;}
        .p-r3{animation:ringExp 2s ease-out infinite 1.4s;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <circle cx="150" cy="125" r="8" fill="none" stroke="#fbbf24" strokeWidth="2" className="p-r1"/>
    <circle cx="150" cy="125" r="8" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="p-r2"/>
    <circle cx="150" cy="125" r="8" fill="none" stroke="#fbbf24" strokeWidth="1" className="p-r3"/>
    <circle cx="150" cy="125" r="7" fill="#fbbf24" className="p-dot"/>
    <text x="162" y="118" fill="#fde68a" fontSize="15" fontWeight="bold" fontFamily="monospace">O</text>
    <text x="75" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

const JariJariSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes drawR{0%{stroke-dashoffset:90;}100%{stroke-dashoffset:0;}}
        @keyframes dotSlide{0%{transform:translate(150px,125px);}100%{transform:translate(240px,125px);}}
        @keyframes glowR{0%,100%{filter:drop-shadow(0 0 6px #22c55e);}50%{filter:drop-shadow(0 0 18px #22c55e);}}
        .r-line{stroke-dasharray:90;animation:drawR 1.8s ease-in-out infinite;}
        .r-dot{animation:dotSlide 1.8s ease-in-out infinite, glowR 1.8s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <line x1="150" y1="125" x2="240" y2="125" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" className="r-line"/>
    <circle cx="240" cy="125" r="5" fill="#22c55e"/>
    <text x="185" y="115" fill="#4ade80" fontSize="13" fontWeight="bold" fontFamily="monospace">r</text>
    <text x="143" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="245" y="120" fill="#86efac" fontSize="10" fontFamily="monospace">A</text>
    <text x="55" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

const DiameterSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes drawD{0%{stroke-dashoffset:180;}100%{stroke-dashoffset:0;}}
        @keyframes glowD{0%,100%{filter:drop-shadow(0 0 6px #a855f7);}50%{filter:drop-shadow(0 0 18px #a855f7);}}
        .d-line{stroke-dasharray:180;animation:drawD 2s ease-in-out infinite;}
        .d-glow{animation:glowD 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <line x1="60" y1="125" x2="240" y2="125" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" className="d-line d-glow"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <circle cx="60" cy="125" r="5" fill="#a855f7"/>
    <circle cx="240" cy="125" r="5" fill="#a855f7"/>
    <text x="140" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="42" y="120" fill="#d8b4fe" fontSize="10" fontFamily="monospace">P</text>
    <text x="246" y="120" fill="#d8b4fe" fontSize="10" fontFamily="monospace">Q</text>
    <text x="148" y="108" fill="#d8b4fe" fontSize="13" fontWeight="bold" fontFamily="monospace">d</text>
    <text x="60" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

const TaliBusurSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes drawTB{0%{stroke-dashoffset:170;}100%{stroke-dashoffset:0;}}
        @keyframes glowTB{0%,100%{filter:drop-shadow(0 0 6px #f97316);}50%{filter:drop-shadow(0 0 20px #f97316);}}
        .tb-line{stroke-dasharray:170;animation:drawTB 2s ease-in-out infinite;}
        .tb-glow{animation:glowTB 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.25)" strokeWidth="2"/>
    <circle cx="150" cy="125" r="4" fill="rgba(251,191,36,0.5)"/>
    <line x1="92" y1="56" x2="235" y2="157" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" className="tb-line tb-glow"/>
    <circle cx="92" cy="56" r="5" fill="#f97316"/>
    <circle cx="235" cy="157" r="5" fill="#f97316"/>
    <text x="72" y="50" fill="#fdba74" fontSize="11" fontFamily="monospace">A</text>
    <text x="241" y="152" fill="#fdba74" fontSize="11" fontFamily="monospace">B</text>
    <text x="148" y="100" fill="#fdba74" fontSize="12" fontWeight="bold" fontFamily="monospace">AB</text>
    <text x="30" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

const BusurSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes drawArc{0%{stroke-dashoffset:142;}100%{stroke-dashoffset:0;}}
        @keyframes glowArc{0%,100%{filter:drop-shadow(0 0 8px #fbbf24);}50%{filter:drop-shadow(0 0 22px #fbbf24);}}
        .arc-line{stroke-dasharray:142;animation:drawArc 2.2s ease-in-out infinite;}
        .arc-glow{animation:glowArc 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    <path d="M 150 35 A 90 90 0 0 1 240 125" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" className="arc-line arc-glow"/>
    <circle cx="150" cy="35" r="5" fill="#fbbf24"/>
    <circle cx="240" cy="125" r="5" fill="#fbbf24"/>
    <circle cx="150" cy="125" r="4" fill="rgba(251,191,36,0.5)"/>
    <text x="156" y="26" fill="#fde68a" fontSize="11" fontFamily="monospace">A</text>
    <text x="246" y="120" fill="#fde68a" fontSize="11" fontFamily="monospace">B</text>
    <text x="218" y="68" fill="#fde68a" fontSize="13" fontWeight="bold" fontFamily="monospace">⌢AB</text>
    <text x="30" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

const JuringSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes fillJuring{0%{opacity:0;}30%{opacity:0;}100%{opacity:1;}}
        @keyframes glowJuring{0%,100%{filter:drop-shadow(0 0 8px #ec4899);}50%{filter:drop-shadow(0 0 22px #ec4899);}}
        .juring-fill{animation:fillJuring 2s ease-in-out infinite;}
        .juring-glow{animation:glowJuring 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    <path d="M 150 125 L 150 35 A 90 90 0 0 1 240 125 Z" fill="rgba(236,72,153,0.3)" stroke="#ec4899" strokeWidth="2" className="juring-fill juring-glow"/>
    <line x1="150" y1="125" x2="150" y2="35" stroke="#ec4899" strokeWidth="2.5"/>
    <line x1="150" y1="125" x2="240" y2="125" stroke="#ec4899" strokeWidth="2.5"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <text x="156" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="156" y="27" fill="#f9a8d4" fontSize="11" fontFamily="monospace">A</text>
    <text x="246" y="120" fill="#f9a8d4" fontSize="11" fontFamily="monospace">B</text>
    <text x="200" y="90" fill="#f9a8d4" fontSize="13" fontWeight="bold" fontFamily="monospace">🍕</text>
    <text x="40" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

const TemberengSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes fillTemb{0%{opacity:0;}40%{opacity:0;}100%{opacity:1;}}
        @keyframes glowTemb{0%,100%{filter:drop-shadow(0 0 8px #ef4444);}50%{filter:drop-shadow(0 0 20px #ef4444);}}
        .temb-fill{animation:fillTemb 2s ease-in-out infinite;}
        .temb-glow{animation:glowTemb 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    <path d="M 92 56 A 90 90 0 0 1 235 157 Z" fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="2" className="temb-fill temb-glow"/>
    <line x1="92" y1="56" x2="235" y2="157" stroke="#ef4444" strokeWidth="2.5"/>
    <circle cx="92" cy="56" r="5" fill="#ef4444"/>
    <circle cx="235" cy="157" r="5" fill="#ef4444"/>
    <circle cx="150" cy="125" r="4" fill="rgba(251,191,36,0.4)"/>
    <text x="72" y="50" fill="#fca5a5" fontSize="11" fontFamily="monospace">A</text>
    <text x="241" y="152" fill="#fca5a5" fontSize="11" fontFamily="monospace">B</text>
    <text x="145" y="72" fill="#fca5a5" fontSize="11" fontWeight="bold" fontFamily="monospace">🌙</text>
    <text x="20" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

const ApotemaDetailSVG = ({ caption, ariaLabel }: { caption: string; ariaLabel: string }) => (
  <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto" aria-label={ariaLabel}>
    <defs>
      <style>{`
        @keyframes drawApo{0%{stroke-dashoffset:70;}100%{stroke-dashoffset:0;}}
        @keyframes glowApoYellow{0%,100%{filter:drop-shadow(0 0 4px rgba(253,224,71,0.45));}50%{filter:drop-shadow(0 0 10px rgba(253,224,71,0.7));}}
        .apo-line{stroke-dasharray:70;animation:drawApo 1.8s ease-in-out infinite;}
        .apo-glow{animation:glowApoYellow 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="150" cy="125" r="90" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.2)" strokeWidth="2"/>
    <line x1="150" y1="125" x2="77" y2="82" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round"/>
    <line x1="150" y1="125" x2="223" y2="82" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round"/>
    <text x="100" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">r</text>
    <text x="188" y="115" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">r</text>
    <line x1="77" y1="82" x2="223" y2="82" stroke="rgba(249,115,22,0.7)" strokeWidth="2.5"/>
    <circle cx="77" cy="82" r="4" fill="#f97316"/>
    <circle cx="223" cy="82" r="4" fill="#f97316"/>
    <text x="58" y="78" fill="#fdba74" fontSize="11" fontFamily="monospace">A</text>
    <text x="228" y="78" fill="#fdba74" fontSize="11" fontFamily="monospace">B</text>
    <line x1="150" y1="125" x2="150" y2="82" stroke="#fde047" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.75" className="apo-line apo-glow"/>
    <polyline points="142,82 142,90 150,90" fill="none" stroke="#fde047" strokeWidth="1.5" strokeOpacity="0.7"/>
    <circle cx="150" cy="125" r="5" fill="#fbbf24"/>
    <circle cx="150" cy="82" r="4" fill="#fde047"/>
    <text x="140" y="118" fill="#fde68a" fontSize="11" fontFamily="monospace">O</text>
    <text x="154" y="78" fill="#fef08a" fontSize="11" fontFamily="monospace">D</text>
    <text x="156" y="108" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="monospace">OD ⊥ AB</text>
    <text x="25" y="240" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="monospace">{caption}</text>
  </svg>
);

/* ─── Slide factory ──────────────────────────────────────── */
function makeSlides(t: T) {
  return [
    {
      id: "pusat", emoji: "⭐", symbol: "O", color: "yellow",
      borderColor: "border-yellow-500/40", bgColor: "bg-yellow-900/20",
      textColor: "text-yellow-300", badgeColor: "bg-yellow-500/20 text-yellow-200",
      title: t.pusat_title, desc: t.pusat_desc, keyFact: t.pusat_keyFact,
      svg: <PusatSVG caption={t.pusat_caption} ariaLabel={t.pusat_aria} />,
      formulaPrefix: null, formula: null,
    },
    {
      id: "jari-jari", emoji: "📏", symbol: "r", color: "green",
      borderColor: "border-green-500/40", bgColor: "bg-green-900/20",
      textColor: "text-green-300", badgeColor: "bg-green-500/20 text-green-200",
      title: t.jari_title, desc: t.jari_desc, keyFact: t.jari_keyFact,
      svg: <JariJariSVG caption={t.jari_caption} ariaLabel={t.jari_aria} />,
      formulaPrefix: null, formula: "r = \\frac{d}{2}",
    },
    {
      id: "diameter", emoji: "↔️", symbol: "d", color: "purple",
      borderColor: "border-purple-500/40", bgColor: "bg-purple-900/20",
      textColor: "text-purple-300", badgeColor: "bg-purple-500/20 text-purple-200",
      title: t.diam_title, desc: t.diam_desc, keyFact: t.diam_keyFact,
      svg: <DiameterSVG caption={t.diam_caption} ariaLabel={t.diam_aria} />,
      formulaPrefix: null, formula: "d = 2r",
    },
    {
      id: "tali-busur", emoji: "📐", symbol: "AB", color: "orange",
      borderColor: "border-orange-500/40", bgColor: "bg-orange-900/20",
      textColor: "text-orange-300", badgeColor: "bg-orange-500/20 text-orange-200",
      title: t.tali_title, desc: t.tali_desc, keyFact: t.tali_keyFact,
      svg: <TaliBusurSVG caption={t.tali_caption} ariaLabel={t.tali_aria} />,
      formulaPrefix: null, formula: null,
    },
    {
      id: "busur", emoji: "🌈", symbol: "⌢AB", color: "cyan",
      borderColor: "border-cyan-500/40", bgColor: "bg-cyan-900/20",
      textColor: "text-cyan-300", badgeColor: "bg-cyan-500/20 text-cyan-200",
      title: t.busur_title, desc: t.busur_desc, keyFact: t.busur_keyFact,
      svg: <BusurSVG caption={t.busur_caption} ariaLabel={t.busur_aria} />,
      formulaPrefix: t.busur_formulaPrefix,
      formula: "\\frac{\\alpha}{360°} \\times 2\\pi r",
    },
    {
      id: "juring", emoji: "🍕", symbol: "OAB", color: "pink",
      borderColor: "border-pink-500/40", bgColor: "bg-pink-900/20",
      textColor: "text-pink-300", badgeColor: "bg-pink-500/20 text-pink-200",
      title: t.juring_title, desc: t.juring_desc, keyFact: t.juring_keyFact,
      svg: <JuringSVG caption={t.juring_caption} ariaLabel={t.juring_aria} />,
      formulaPrefix: null, formula: "L_{sector} = \\frac{\\alpha}{360°} \\times \\pi r^2",
    },
    {
      id: "tembereng", emoji: "🌙", symbol: "—", color: "red",
      borderColor: "border-red-500/40", bgColor: "bg-red-900/20",
      textColor: "text-red-300", badgeColor: "bg-red-500/20 text-red-200",
      title: t.temb_title, desc: t.temb_desc, keyFact: t.temb_keyFact,
      svg: <TemberengSVG caption={t.temb_caption} ariaLabel={t.temb_aria} />,
      formulaPrefix: null, formula: "L_{seg} = L_{sector} - L_{\\triangle OAB}",
    },
    {
      id: "apotema", emoji: "📍", symbol: "OD ⊥ AB", color: "rose",
      borderColor: "border-rose-500/40", bgColor: "bg-rose-900/20",
      textColor: "text-rose-300", badgeColor: "bg-rose-500/20 text-rose-200",
      title: t.apo_title, desc: t.apo_desc, keyFact: t.apo_keyFact,
      svg: <ApotemaDetailSVG caption={t.apo_caption} ariaLabel={t.apo_aria} />,
      formulaPrefix: null, formula: "a^2 + \\left(\\frac{AB}{2}\\right)^2 = r^2",
    },
  ];
}

/* ─── Slide Carousel ─────────────────────────────────────── */
const SlideCarousel = ({ t }: { t: T }) => {
  const [idx, setIdx] = useState(0);
  const slides = makeSlides(t);
  const slide = slides[idx];

  const prev = () => { playPopSound(); setIdx(i => (i - 1 + slides.length) % slides.length); };
  const next = () => { playPopSound(); setIdx(i => (i + 1) % slides.length); };
  const goTo = (i: number) => { if (i !== idx) { playPopSound(); setIdx(i); } };

  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden">
      <div className={`px-5 py-3 flex items-center justify-between border-b ${slide.borderColor} ${slide.bgColor}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{slide.emoji}</span>
          <span className={`font-display font-bold text-base ${slide.textColor}`}>{slide.title}</span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${slide.badgeColor}`}>{slide.symbol}</span>
        </div>
        <span className="text-xs text-white/40 font-mono">{idx + 1} / {slides.length}</span>
      </div>

      <div className="px-4 pt-5 pb-2">{slide.svg}</div>

      <div className="px-5 pb-4 space-y-3">
        <p className="font-body text-sm text-white/80 leading-relaxed">{slide.desc}</p>
        <div className={`rounded-lg p-3 border ${slide.borderColor} ${slide.bgColor}`}>
          <p className={`font-body text-xs font-semibold ${slide.textColor} mb-1`}>{t.keyFactLabel}</p>
          <p className="font-body text-xs text-white/75">{slide.keyFact}</p>
        </div>
        {slide.formula && (
          <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 text-center">
            <p className="text-white/40 text-[10px] font-mono mb-1 uppercase tracking-wide">{t.formulaLabel}</p>
            {slide.formulaPrefix && (
              <p className="text-white/70 text-xs mb-1 font-body">{slide.formulaPrefix} =</p>
            )}
            <BlockMath math={slide.formula} />
          </div>
        )}
      </div>

      <div className="px-5 pb-4 flex items-center justify-between">
        <button onClick={prev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-600 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-body cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> {t.prev}
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === idx ? "bg-primary scale-125" : "bg-white/20 hover:bg-white/40"}`}/>
          ))}
        </div>
        <button onClick={next}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-600 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-body cursor-pointer">
          {t.next} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 pb-5">
        <p className="text-white/30 text-[10px] font-mono mb-2 uppercase tracking-wide">{t.jumpTo}</p>
        <div className="flex flex-wrap gap-1.5">
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={`text-[10px] px-2.5 py-1 rounded-full font-body font-semibold border transition-all cursor-pointer ${
                i === idx
                  ? `${s.borderColor} ${s.bgColor} ${s.textColor}`
                  : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
              }`}>
              {s.emoji} {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const UnsurUnsurPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [open, setOpen] = useState<string[]>(["contoh1"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/materi-matematika/kelas-8/lingkaran" nextPath="/materi-matematika/kelas-8/lingkaran/keliling-luas" />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">{t.h1}</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* Intro Banner */}
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl px-5 py-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.introTitle}</p>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                {t.introP1}<strong className="text-yellow-300">{t.introPusat}</strong>{t.introP2}
                <strong className="text-green-300">{t.introJari}</strong>{t.introP3}
              </p>
            </div>
          </div>

          {/* Slide Carousel */}
          <SlideCarousel t={t} />

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title={t.c1_header} />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c1_level}</p>
                  <p className="font-body text-sm text-white/90">
                    {t.c1_q}<InlineMath math="OA = 7"/>{t.c1_q2}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">{t.c1_sol}</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">OA, OB</strong>{t.c1_p1}<InlineMath math="r = 7"/> cm.</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-purple-300">CD</strong>{t.c1_p2}</p>
                  <BlockMath math="d = 2r = 2 \times 7 = 14 \text{ cm}" />
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">AB</strong>{t.c1_p3}</p>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-sm text-green-300 text-center">{t.c1_check}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title={t.c2_header} />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c2_level}</p>
                  <p className="font-body text-sm text-white/90">
                    {t.c2_q}<InlineMath math="d = 4x - 2"/>{t.c2_q2}<InlineMath math="r = x + 5"/>{t.c2_q3}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">{t.c2_sol}</p>
                  <p className="font-body text-sm text-white/80">{t.c2_p1}<strong className="text-cyan-300">{t.c2_rel}</strong></p>
                  <BlockMath math="4x - 2 = 2(x + 5)" />
                  <BlockMath math="4x - 2 = 2x + 10" />
                  <BlockMath math="2x = 12 \Rightarrow x = 6" />
                  <BlockMath math="r = 6 + 5 = 11 \text{ cm}" />
                  <BlockMath math="d = 4(6) - 2 = 22 \text{ cm}" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">{t.c2_check}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.c3_header} />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c3_level}</p>
                  <p className="font-body text-sm text-white/90">
                    {t.c3_q}<InlineMath math="OD = 5"/>{t.c3_q2}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">{t.c3_sol}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.c3_p1}<strong className="text-cyan-300">{t.c3_apo}</strong>{t.c3_p2}
                  </p>
                  <p className="font-body text-sm text-white/80">{t.c3_p3}</p>
                  <BlockMath math="OA^2 = OD^2 + DA^2" />
                  <BlockMath math="13^2 = 5^2 + DA^2" />
                  <BlockMath math="169 = 25 + DA^2 \Rightarrow DA^2 = 144 \Rightarrow DA = 12 \text{ cm}" />
                  <p className="font-body text-sm text-white/80">{t.c3_p4}</p>
                  <BlockMath math="AB = 2 \times DA = 2 \times 12 = 24 \text{ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">{t.c3_check}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.rangkuman_header} />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {makeSlides(t).map(s => (
                    <div key={s.id} className={`rounded-lg p-3 border ${s.borderColor} ${s.bgColor}`}>
                      <p className="font-body text-xs font-bold text-white">{s.emoji} {s.title} <span className={`font-mono ${s.textColor}`}>({s.symbol})</span></p>
                      <p className="font-body text-[11px] text-white/55 mt-0.5 leading-relaxed">{s.keyFact}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                  <p className="font-body text-sm text-yellow-200">{t.tips}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsurUnsurPage;
