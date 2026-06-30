import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, Layers, GitBranch } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const W = 180, H = 150, MX = 90, MY = 75, SC = 14;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSys = ({ children, label = "" }: { children?: React.ReactNode; label?: string }) => (
  <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ maxHeight: 170, background: "rgba(15,23,42,0.7)" }}>
    {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
      <g key={v}>
        <line x1={MX+v*SC*0.7} y1={4} x2={MX+v*SC*0.7} y2={H-4} stroke="#1e293b" strokeWidth="0.7" />
        <line x1={4} y1={MY-v*SC*0.7} x2={W-4} y2={MY-v*SC*0.7} stroke="#1e293b" strokeWidth="0.7" />
      </g>
    ))}
    <line x1={4} y1={MY} x2={W-4} y2={MY} stroke="#475569" strokeWidth="1.5" />
    <line x1={MX} y1={H-4} x2={MX} y2={4} stroke="#475569" strokeWidth="1.5" />
    <text x={W-10} y={MY+11} fill="#64748b" fontSize="8">x</text>
    <text x={MX+3} y={11} fill="#64748b" fontSize="8">y</text>
    <text x={MX+2} y={MY+10} fill="#475569" fontSize="7">O</text>
    {label && <text x={5} y={13} fill="#94a3b8" fontSize="8">{label}</text>}
    {children}
  </svg>
);

const gPts = (m: number, c: number) =>
  [-7, -4, -1, 2, 5, 7].map(x => `${toX(x)},${toY(m * x + c)}`).join(' ');

const perpMark = (ix: number, iy: number, m1: number, m2: number, d = 0.48) => {
  const n1 = Math.sqrt(1 + m1 * m1), n2 = Math.sqrt(1 + m2 * m2);
  const u1x = d / n1, u1y = d * m1 / n1;
  const u2x = d / n2, u2y = d * m2 / n2;
  return [
    [toX(ix),           toY(iy)],
    [toX(ix + u1x),     toY(iy + u1y)],
    [toX(ix+u1x+u2x),  toY(iy+u1y+u2y)],
    [toX(ix + u2x),     toY(iy + u2y)],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
};

const lineIntersect = (m1: number, c1: number, m2: number, c2: number): [number,number]|null => {
  if (Math.abs(m1 - m2) < 1e-9) return null;
  const x = (c2 - c1) / (m1 - m2);
  return [x, m1 * x + c1];
};

const gcd = (a: number, b: number): number => { a=Math.abs(a); b=Math.abs(b); while(b){const t=b;b=a%b;a=t;} return a||1; };
const mTeX = (m: number): string => {
  const r = Math.round(m * 1000) / 1000;
  if (Number.isInteger(r)) return String(r);
  for (let d = 2; d <= 9; d++) {
    const n = Math.round(m * d);
    if (Math.abs(n / d - m) < 0.001) {
      const g = gcd(Math.abs(n), d);
      const sn = n / g, sd = d / g;
      if (sd === 1) return String(sn);
      return sn < 0 ? `-\\frac{${-sn}}{${sd}}` : `\\frac{${sn}}{${sd}}`;
    }
  }
  return String(r);
};
const mDisp = (m: number): string => {
  const r = Math.round(m * 1000) / 1000;
  if (Number.isInteger(r)) return String(r);
  for (let d = 2; d <= 9; d++) {
    const n = Math.round(m * d);
    if (Math.abs(n / d - m) < 0.001) {
      const g = gcd(Math.abs(n), d);
      const sn = n / g, sd = d / g;
      if (sd === 1) return String(sn);
      return sn < 0 ? `−${-sn}/${sd}` : `${sn}/${sd}`;
    }
  }
  return String(r);
};

const SEJ_OPTS = [-2, -1, -0.5, 0.5, 1, 2, 3];
const TEK_OPTS = [-3, -2, -1, 1, 2, 3];
const BER_OPTS = [-2, -1, 1, 2, 3];

const T_HUBUNGAN = {
  id: {
    title: "HUBUNGAN DUA GARIS",
    subtitle: "Sejajar, Tegak Lurus, atau Berpotongan?",
    breadcrumb: "Kelas 8 · Persamaan Garis Lurus · Materi Matematika",
    sh_intro: "🌟 Tiga Kemungkinan Hubungan Dua Garis",
    sh_sejajar: "∥ Garis Sejajar",
    sh_tegaklurus: "⊥ Garis Tegak Lurus (Saling Berpotongan 90°)",
    sh_berpotongan: "✕ Garis Berpotongan (Tidak Sejajar, Tidak Tegak Lurus)",
    sh_visual: "🎨 Galeri Visual: Perbandingan Tiga Hubungan Garis",
    sh_contoh1: "✏️ Contoh 1 — Tingkat Mudah",
    sh_contoh2: "✏️ Contoh 2 — Tingkat Sedang",
    sh_contoh3: "✏️ Contoh 3 — Tingkat Sulit",
    sh_rangkuman: "📌 Rangkuman",
    back: "← Kembali ke Persamaan Garis Lurus",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT",
    soal: "📝 Soal", pem: "💡 Pembahasan",
    introP: "Ketika dua garis lurus ada di bidang yang sama, hanya ada tiga kemungkinan hubungan di antara mereka. Hubungan ini ditentukan oleh nilai gradien masing-masing garis.",
    cards: [
      { label: "SEJAJAR", ket: "Tidak pernah bertemu" },
      { label: "TEGAK LURUS", ket: "Berpotongan 90°" },
      { label: "BERPOTONGAN", ket: "Bertemu di satu titik" },
    ],
    sej_syarat: "🎯 Syarat Garis Sejajar",
    sej_sub: "Gradien sama, titik potong sb-y berbeda",
    sej_why: "💡 Mengapa harus m₁ = m₂?",
    sej_p1: "Gradien (m) menunjukkan kecuraman atau laju kenaikan sebuah garis — setiap bergerak 1 satuan ke kanan, garis naik sebesar m. Jika dua garis punya gradien sama, keduanya naik dan turun dengan laju yang identik.",
    sej_p2: "Bayangkan dua mobil yang melaju dengan kecepatan yang sama: mobil A selalu 5 km di depan mobil B. Mobil B tidak akan pernah menyalip A karena lajunya sama persis. Begitu juga dua garis sejajar — jarak vertikal antara keduanya selalu konstan, sehingga tidak pernah bertemu.",
    sej_note: "📌 Jika c₁ = c₂ juga: kedua garis berimpit (sama persis, bukan sejajar).",
    sej_vis: "Visual: Dua garis sejajar",
    sej_vis_note: "Keduanya m=2, tidak berpotongan",
    sej_pairs: "Contoh pasangan sejajar:",
    sej_anim: "🎮 Animasi Interaktif — Garis Sejajar",
    sej_anim_desc: "Ubah nilai gradien m. Amati: kedua garis selalu tetap sejajar karena gradiennya sama!",
    sej_obs: "Observasi:",
    sej_obs_sejajar: "sejajar",
    sej_obs_jarak: "Jarak vertikal antar garis selalu = |2 − (−2)| = 4 (konstan)",
    tek_syarat: "🎯 Syarat Garis Tegak Lurus",
    tek_sub: "Perkalian kedua gradien sama dengan −1",
    tek_m2: "Artinya jika m₁ diketahui:",
    tek_m2_sub: "m₂ adalah negatif kebalikan dari m₁",
    tek_why: "💡 Mengapa harus m₁ × m₂ = −1?",
    tek_p1: "Bayangkan garis ℓ₁ memiliki gradien m₁, artinya arahnya adalah \"bergerak 1 ke kanan, naik m₁\" — vektor arahnya adalah (1, m₁).",
    tek_p2: "Untuk mendapat garis yang tegak lurus, kita perlu memutar vektor ini 90°. Rotasi 90° dari (1, m₁) menghasilkan (−m₁, 1) atau (m₁, −1).",
    tek_note: "📌 Cara mudah: balik pembilang dan penyebut, lalu ubah tanda. Contoh: m₁ = 3 → m₂ = −⅓. m₁ = −⅔ → m₂ = 3/2.",
    tek_vis: "Visual: Dua garis tegak lurus",
    tek_vis_note: "m₁×m₂ = 2×(−½) = −1 ✓",
    tek_pairs: "Contoh pasangan tegak lurus:",
    tek_anim: "🎮 Animasi Interaktif — Garis Tegak Lurus",
    tek_anim_desc: "Pilih gradien m₁. Gradien m₂ otomatis dihitung sebagai negatif kebalikannya. Perhatikan sudut 90° yang terbentuk!",
    tek_obs: "Observasi:",
    tek_obs_note: "Kotak kuning kecil = tanda sudut 90° di titik potong",
    ber_syarat: "🎯 Syarat Garis Berpotongan",
    ber_sub: "Gradien berbeda → pasti berpotongan di suatu titik",
    ber_sub2: "Jika m₁ × m₂ ≠ −1 → berpotongan biasa (bukan 90°)",
    ber_why: "💡 Mengapa m₁ ≠ m₂ pasti berpotongan?",
    ber_p1: "Jika dua garis punya gradien berbeda, kemiringannya berbeda. Garis dengan kemiringan yang berbeda tidak bisa tetap berjarak konstan — pasti ada titik di mana keduanya bertemu.",
    ber_p2: "Secara aljabar: sistem persamaan dengan dua persamaan berbeda (gradien berbeda) pasti punya tepat satu solusi (x, y) — titik potongnya.",
    ber_note: "📌 Kasus khusus: jika m₁ × m₂ = −1, garis berpotongan dengan sudut tepat 90° → masuk kategori TEGAK LURUS.",
    ber_vis: "Visual: Dua garis berpotongan",
    ber_anim: "🎮 Animasi Interaktif — Garis Berpotongan",
    ber_anim_desc: "Ubah gradien m₁ dan m₂. Titik potong berpindah sesuai gradien yang dipilih!",
    ber_obs: "Observasi:",
    ber_obs_titik: "Titik potong:",
    ber_obs_none: "Tidak berpotongan (gradien sama!)",
    vis_tabel_h: ["Hubungan", "Syarat Gradien", "Titik Potong"],
    vis_tabel_rows: [
      ["Sejajar (∥)", "m₁ = m₂, c₁ ≠ c₂", "Tidak ada (tidak berpotongan)"],
      ["Berimpit", "m₁ = m₂, c₁ = c₂", "Tak terhingga (garis sama)"],
      ["Tegak Lurus (⊥)", "m₁ × m₂ = −1", "Satu titik (sudut 90°)"],
      ["Berpotongan", "m₁ ≠ m₂", "Satu titik (sudut ≠ 90°)"],
    ],
    c1_soal: "Tentukan hubungan antara garis ℓ₁: y = 3x − 5 dan ℓ₂: y = 3x + 2!",
    c1_id_grad: "Identifikasi gradien:",
    c1_ans: "✅ ℓ₁ ∥ ℓ₂ (SEJAJAR) karena m₁ = m₂ = 3 dan c berbeda",
    c2_soal: "Tentukan persamaan garis yang melalui titik (2, 5) dan tegak lurus dengan garis y = 4x − 3!",
    c2_l1: "Langkah 1 — Cari gradien tegak lurus:",
    c2_l2: "Langkah 2 — Tentukan persamaan:",
    c2_vis: "Grafik kedua garis:",
    c2_ans: "✅ Persamaan garis: y = −¼x + 11/2 (tegak lurus dengan y = 4x − 3)",
    c3_soal: "Tentukan nilai k agar garis (2k+1)x + 3y − 6 = 0 sejajar dengan garis kx − 2y + 4 = 0!",
    c3_l1: "Langkah 1 — Cari gradien masing-masing garis:",
    c3_l2: "Langkah 2 — Syarat sejajar m₁ = m₂:",
    c3_l3: "Langkah 3 — Verifikasi k = −3/4:",
    c3_ans: "✅ Nilai k = −3/4",
    rang_items: [
      ["Sejajar (∥)", "m₁ = m₂, c₁ ≠ c₂"],
      ["Tegak Lurus (⊥)", "m₁ × m₂ = −1"],
      ["Berpotongan", "m₁ ≠ m₂"],
      ["Berimpit", "m₁ = m₂, c₁ = c₂"],
    ],
    rang_tip: "💡 Selalu mulai dengan mengubah persamaan ke bentuk y = mx + c untuk mengidentifikasi gradien dengan mudah!",
  },
  en: {
    title: "RELATIONSHIP BETWEEN TWO LINES",
    subtitle: "Parallel, Perpendicular, or Intersecting?",
    breadcrumb: "Grade 8 · Equation of a Line · Mathematics",
    sh_intro: "🌟 Three Possible Relationships Between Two Lines",
    sh_sejajar: "∥ Parallel Lines",
    sh_tegaklurus: "⊥ Perpendicular Lines (Intersect at 90°)",
    sh_berpotongan: "✕ Intersecting Lines (Not Parallel, Not Perpendicular)",
    sh_visual: "🎨 Visual Gallery: Comparing Three Line Relationships",
    sh_contoh1: "✏️ Example 1 — Easy Level",
    sh_contoh2: "✏️ Example 2 — Medium Level",
    sh_contoh3: "✏️ Example 3 — Hard Level",
    sh_rangkuman: "📌 Summary",
    back: "← Back to Equation of a Line",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD",
    soal: "📝 Problem", pem: "💡 Solution",
    introP: "When two straight lines exist in the same plane, there are only three possible relationships between them. This relationship is determined by the slope of each line.",
    cards: [
      { label: "PARALLEL", ket: "Never meet" },
      { label: "PERPENDICULAR", ket: "Intersect at 90°" },
      { label: "INTERSECTING", ket: "Meet at one point" },
    ],
    sej_syarat: "🎯 Condition for Parallel Lines",
    sej_sub: "Same slope, different y-intercepts",
    sej_why: "💡 Why must m₁ = m₂?",
    sej_p1: "Slope (m) indicates the steepness or rate of rise of a line — for every 1 unit moved right, the line rises by m. If two lines have the same slope, they rise and fall at identical rates.",
    sej_p2: "Imagine two cars traveling at the same speed: car A is always 5 km ahead of car B. Car B will never overtake A because their speeds are exactly the same. Similarly, two parallel lines — the vertical distance between them is always constant, so they never meet.",
    sej_note: "📌 If c₁ = c₂ as well: both lines coincide (identical, not parallel).",
    sej_vis: "Visual: Two parallel lines",
    sej_vis_note: "Both have m=2, they never intersect",
    sej_pairs: "Example parallel pairs:",
    sej_anim: "🎮 Interactive Animation — Parallel Lines",
    sej_anim_desc: "Change the slope value m. Observe: both lines always stay parallel because they have the same slope!",
    sej_obs: "Observation:",
    sej_obs_sejajar: "parallel",
    sej_obs_jarak: "Vertical distance between the lines is always |2 − (−2)| = 4 (constant)",
    tek_syarat: "🎯 Condition for Perpendicular Lines",
    tek_sub: "The product of both slopes equals −1",
    tek_m2: "This means if m₁ is known:",
    tek_m2_sub: "m₂ is the negative reciprocal of m₁",
    tek_why: "💡 Why must m₁ × m₂ = −1?",
    tek_p1: "Imagine line ℓ₁ has slope m₁, meaning its direction is \"move 1 right, rise m₁\" — its direction vector is (1, m₁).",
    tek_p2: "To get a perpendicular line, we need to rotate this vector 90°. A 90° rotation of (1, m₁) gives (−m₁, 1) or (m₁, −1).",
    tek_note: "📌 Easy trick: flip numerator and denominator, then change the sign. Example: m₁ = 3 → m₂ = −⅓. m₁ = −⅔ → m₂ = 3/2.",
    tek_vis: "Visual: Two perpendicular lines",
    tek_vis_note: "m₁×m₂ = 2×(−½) = −1 ✓",
    tek_pairs: "Example perpendicular pairs:",
    tek_anim: "🎮 Interactive Animation — Perpendicular Lines",
    tek_anim_desc: "Choose slope m₁. Slope m₂ is automatically calculated as its negative reciprocal. Notice the 90° angle formed!",
    tek_obs: "Observation:",
    tek_obs_note: "Small yellow square = 90° angle marker at the intersection",
    ber_syarat: "🎯 Condition for Intersecting Lines",
    ber_sub: "Different slopes → they will definitely intersect at some point",
    ber_sub2: "If m₁ × m₂ ≠ −1 → regular intersection (not 90°)",
    ber_why: "💡 Why do m₁ ≠ m₂ lines always intersect?",
    ber_p1: "If two lines have different slopes, their inclinations are different. Lines with different inclinations cannot maintain a constant distance — there must be a point where they meet.",
    ber_p2: "Algebraically: a system with two different equations (different slopes) always has exactly one solution (x, y) — the intersection point.",
    ber_note: "📌 Special case: if m₁ × m₂ = −1, lines intersect at exactly 90° → falls under PERPENDICULAR.",
    ber_vis: "Visual: Two intersecting lines",
    ber_anim: "🎮 Interactive Animation — Intersecting Lines",
    ber_anim_desc: "Change slopes m₁ and m₂. The intersection point moves according to the chosen slopes!",
    ber_obs: "Observation:",
    ber_obs_titik: "Intersection point:",
    ber_obs_none: "No intersection (equal slopes!)",
    vis_tabel_h: ["Relationship", "Slope Condition", "Intersection"],
    vis_tabel_rows: [
      ["Parallel (∥)", "m₁ = m₂, c₁ ≠ c₂", "None (never intersect)"],
      ["Coincident", "m₁ = m₂, c₁ = c₂", "Infinite (same line)"],
      ["Perpendicular (⊥)", "m₁ × m₂ = −1", "One point (90° angle)"],
      ["Intersecting", "m₁ ≠ m₂", "One point (angle ≠ 90°)"],
    ],
    c1_soal: "Determine the relationship between lines ℓ₁: y = 3x − 5 and ℓ₂: y = 3x + 2!",
    c1_id_grad: "Identify slopes:",
    c1_ans: "✅ ℓ₁ ∥ ℓ₂ (PARALLEL) because m₁ = m₂ = 3 and c values differ",
    c2_soal: "Find the equation of a line through (2, 5) perpendicular to the line y = 4x − 3!",
    c2_l1: "Step 1 — Find the perpendicular slope:",
    c2_l2: "Step 2 — Find the equation:",
    c2_vis: "Graph of both lines:",
    c2_ans: "✅ Line equation: y = −¼x + 11/2 (perpendicular to y = 4x − 3)",
    c3_soal: "Find the value of k so that the line (2k+1)x + 3y − 6 = 0 is parallel to kx − 2y + 4 = 0!",
    c3_l1: "Step 1 — Find the slope of each line:",
    c3_l2: "Step 2 — Parallel condition m₁ = m₂:",
    c3_l3: "Step 3 — Verify k = −3/4:",
    c3_ans: "✅ Value of k = −3/4",
    rang_items: [
      ["Parallel (∥)", "m₁ = m₂, c₁ ≠ c₂"],
      ["Perpendicular (⊥)", "m₁ × m₂ = −1"],
      ["Intersecting", "m₁ ≠ m₂"],
      ["Coincident", "m₁ = m₂, c₁ = c₂"],
    ],
    rang_tip: "💡 Always start by converting the equation to y = mx + c form to easily identify the slope!",
  },
  ja: {
    title: "2直線の関係",
    subtitle: "平行・垂直・交差のどれ？",
    breadcrumb: "中学2年 · 直線の方程式 · 数学",
    sh_intro: "🌟 2直線の3つの関係",
    sh_sejajar: "∥ 平行な直線",
    sh_tegaklurus: "⊥ 垂直な直線（90°で交わる）",
    sh_berpotongan: "✕ 交差する直線（平行でも垂直でもない）",
    sh_visual: "🎨 ビジュアルギャラリー：3つの関係を比較",
    sh_contoh1: "✏️ 例題1 — 基本レベル",
    sh_contoh2: "✏️ 例題2 — 標準レベル",
    sh_contoh3: "✏️ 例題3 — 発展レベル",
    sh_rangkuman: "📌 まとめ",
    back: "← 直線の方程式に戻る",
    mudah: "基本", sedang: "標準", sulit: "発展",
    soal: "📝 問題", pem: "💡 解答",
    introP: "同一平面上に2本の直線がある場合、それらの間には3つの関係しかありません。この関係は各直線の傾きによって決まります。",
    cards: [
      { label: "平行", ket: "永遠に交わらない" },
      { label: "垂直", ket: "90°で交わる" },
      { label: "交差", ket: "1点で交わる" },
    ],
    sej_syarat: "🎯 平行線の条件",
    sej_sub: "傾きが同じ、y切片が異なる",
    sej_why: "💡 なぜm₁ = m₂でなければならないか？",
    sej_p1: "傾き(m)は直線の急さまたは上昇率を示す — 右に1単位移動するたびに、直線はm分だけ上昇する。2本の直線が同じ傾きを持てば、両方とも同じ速度で上下する。",
    sej_p2: "2台の車が同じ速度で走るとき、車Aは常に車Bの5km前にいる。速度がまったく同じなので車BはAに追いつけない。平行な2直線も同じ — 縦の距離は常に一定で、交わることはない。",
    sej_note: "📌 c₁ = c₂の場合: 2直線は一致する（平行ではなく同じ直線）。",
    sej_vis: "ビジュアル：2本の平行線",
    sej_vis_note: "どちらもm=2で交差しない",
    sej_pairs: "平行のペアの例：",
    sej_anim: "🎮 インタラクティブアニメーション — 平行線",
    sej_anim_desc: "傾きmの値を変えてみよう。傾きが同じため、2直線は常に平行のまま！",
    sej_obs: "観察：",
    sej_obs_sejajar: "平行",
    sej_obs_jarak: "直線間の縦の距離は常に|2 − (−2)| = 4（一定）",
    tek_syarat: "🎯 垂直線の条件",
    tek_sub: "2つの傾きの積が−1に等しい",
    tek_m2: "つまりm₁がわかれば：",
    tek_m2_sub: "m₂はm₁の負の逆数",
    tek_why: "💡 なぜm₁ × m₂ = −1でなければならないか？",
    tek_p1: "直線ℓ₁の傾きがm₁の場合、その方向は「右に1、m₁上昇」— 方向ベクトルは(1, m₁)。",
    tek_p2: "垂直な直線を得るには、このベクトルを90°回転させる必要がある。(1, m₁)を90°回転させると(−m₁, 1)または(m₁, −1)になる。",
    tek_note: "📌 簡単な方法: 分子と分母をひっくり返してから符号を変える。例: m₁ = 3 → m₂ = −⅓。m₁ = −⅔ → m₂ = 3/2。",
    tek_vis: "ビジュアル：2本の垂直線",
    tek_vis_note: "m₁×m₂ = 2×(−½) = −1 ✓",
    tek_pairs: "垂直のペアの例：",
    tek_anim: "🎮 インタラクティブアニメーション — 垂直線",
    tek_anim_desc: "m₁の傾きを選ぶと、m₂は自動的に負の逆数として計算される。90°の角度に注目！",
    tek_obs: "観察：",
    tek_obs_note: "小さな黄色の四角 = 交点の90°角マーカー",
    ber_syarat: "🎯 交差する直線の条件",
    ber_sub: "傾きが異なる → 必ずどこかで交わる",
    ber_sub2: "m₁ × m₂ ≠ −1の場合 → 通常の交差（90°ではない）",
    ber_why: "💡 なぜm₁ ≠ m₂なら必ず交わるか？",
    ber_p1: "2本の直線の傾きが異なる場合、傾き度が異なる。傾きが異なる直線は一定の距離を保てない — 必ずどこかで交わる。",
    ber_p2: "代数的に: 2つの異なる方程式（異なる傾き）からなる連立方程式は、必ず1つの解(x, y)を持つ — それが交点。",
    ber_note: "📌 特殊な場合: m₁ × m₂ = −1なら、90°で交わる → 垂直の分類に入る。",
    ber_vis: "ビジュアル：2本の交差する直線",
    ber_anim: "🎮 インタラクティブアニメーション — 交差する直線",
    ber_anim_desc: "m₁とm₂の傾きを変えてみよう。選んだ傾きに応じて交点が移動する！",
    ber_obs: "観察：",
    ber_obs_titik: "交点：",
    ber_obs_none: "交差しない（傾きが同じ！）",
    vis_tabel_h: ["関係", "傾きの条件", "交点"],
    vis_tabel_rows: [
      ["平行（∥）", "m₁ = m₂, c₁ ≠ c₂", "なし（交わらない）"],
      ["一致", "m₁ = m₂, c₁ = c₂", "無限（同じ直線）"],
      ["垂直（⊥）", "m₁ × m₂ = −1", "1点（90°の角）"],
      ["交差", "m₁ ≠ m₂", "1点（90°以外の角）"],
    ],
    c1_soal: "直線ℓ₁: y = 3x − 5とℓ₂: y = 3x + 2の関係を求めなさい！",
    c1_id_grad: "傾きを確認：",
    c1_ans: "✅ ℓ₁ ∥ ℓ₂（平行）m₁ = m₂ = 3でcが異なる",
    c2_soal: "点(2, 5)を通り、直線y = 4x − 3に垂直な直線の方程式を求めなさい！",
    c2_l1: "ステップ1 — 垂直な傾きを求める：",
    c2_l2: "ステップ2 — 方程式を求める：",
    c2_vis: "2本の直線のグラフ：",
    c2_ans: "✅ 直線の方程式：y = −¼x + 11/2（y = 4x − 3に垂直）",
    c3_soal: "直線(2k+1)x + 3y − 6 = 0がkx − 2y + 4 = 0に平行になるkの値を求めなさい！",
    c3_l1: "ステップ1 — 各直線の傾きを求める：",
    c3_l2: "ステップ2 — 平行条件m₁ = m₂：",
    c3_l3: "ステップ3 — k = −3/4を検証：",
    c3_ans: "✅ k = −3/4",
    rang_items: [
      ["平行（∥）", "m₁ = m₂, c₁ ≠ c₂"],
      ["垂直（⊥）", "m₁ × m₂ = −1"],
      ["交差", "m₁ ≠ m₂"],
      ["一致", "m₁ = m₂, c₁ = c₂"],
    ],
    rang_tip: "💡 まずy = mx + cの形に変換して傾きを簡単に確認しよう！",
  },
};

const Hubungan2GarisPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T_HUBUNGAN[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "sejajar", "tegaklurus", "berpotongan", "visual-trio", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const toggle = (s: string) => { playPopSound(); setExpandedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); };
  const SH = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );
  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const [sejM, setSejM] = useState(2);
  const [tekM1, setTekM1] = useState(2);
  const tekM2 = -1 / tekM1;
  const [berM1, setBerM1] = useState(2);
  const [berM2, setBerM2] = useState(-1);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <GitBranch className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introP}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { ...t.cards[0], icon: "∥", color: "#22d3ee", bg: "border-cyan-500/40 bg-cyan-900/20" },
                    { ...t.cards[1], icon: "⊥", color: "#a78bfa", bg: "border-violet-500/40 bg-violet-900/20" },
                    { ...t.cards[2], icon: "✕", color: "#4ade80", bg: "border-green-500/40 bg-green-900/20" },
                  ].map(({ label, icon, color, bg, ket }) => (
                    <div key={label} className={`border ${bg} rounded-xl p-3 text-center`}>
                      <div className="text-3xl mb-1" style={{ color }}>{icon}</div>
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-xs text-white/40 mt-1">{ket}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEJAJAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="sejajar" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sh_sejajar} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-900/20 border border-cyan-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-cyan-300 mb-2 font-body">{t.sej_syarat}</p>
                  <div className="text-center">
                    <BlockMath math="m_1 = m_2 \quad \wedge \quad c_1 \neq c_2" />
                  </div>
                  <p className="text-xs text-white/60 text-center mt-1">{t.sej_sub}</p>
                </div>

                {/* Penjelasan MENGAPA */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-wide">{t.sej_why}</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">{t.sej_p1}</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    {t.sej_p2} <InlineMath math="|c_1 - c_2|" />,
                  </p>
                  <div className="bg-cyan-900/30 rounded-lg p-2 text-xs font-body">
                    <p className="text-cyan-200">{t.sej_note}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2">{t.sej_vis}</p>
                    <CoordSys label="ℓ₁ ∥ ℓ₂">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-5],[0,-3],[1,-1],[2,1],[3,3],[4,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                      <text x={toX(-2.5)} y={toY(4)} fill="#22d3ee" fontSize="8">ℓ₁: y=2x+1</text>
                      <text x={toX(0)} y={toY(-4)} fill="#67e8f9" fontSize="8">ℓ₂: y=2x−3</text>
                    </CoordSys>
                    <p className="text-xs text-white/40 text-center mt-1">{t.sej_vis_note}</p>
                  </div>
                  <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2">{t.sej_pairs}</p>
                    <div className="space-y-1.5 text-xs font-body">
                      {[
                        ["y = 3x + 1", "y = 3x − 4", "m = 3"],
                        ["y = −2x + 5", "y = −2x + 1", "m = −2"],
                        ["2x + y = 3", "2x + y = 7", "m = −2"],
                      ].map(([l1, l2, m]) => (
                        <div key={l1} className="bg-cyan-900/30 rounded-lg p-2">
                          <p className="text-cyan-300">{l1} ∥ {l2}</p>
                          <p className="text-white/40">{m} (sama)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ANIMASI INTERAKTIF SEJAJAR */}
                <div className="bg-cyan-900/10 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">{t.sej_anim}</p>
                  <p className="text-xs text-white/60 font-body">{t.sej_anim_desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {SEJ_OPTS.map(v => (
                      <button key={v} onClick={() => { playPopSound(); setSejM(v); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${sejM === v ? "bg-cyan-500 text-white" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                        m = {mDisp(v)}
                      </button>
                    ))}
                  </div>
                  <CoordSys label={`ℓ₁ ∥ ℓ₂ (m=${mDisp(sejM)})`}>
                    <polyline points={gPts(sejM, 2)} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                    <polyline points={gPts(sejM, -2)} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,3" />
                    <text x={5} y={H-20} fill="#22d3ee" fontSize="7">ℓ₁: y={mDisp(sejM)}x+2</text>
                    <text x={5} y={H-11} fill="#67e8f9" fontSize="7">ℓ₂: y={mDisp(sejM)}x−2</text>
                  </CoordSys>
                  <div className="bg-cyan-900/30 rounded-lg p-3 text-xs font-body space-y-1">
                    <p className="text-cyan-300 font-semibold">{t.sej_obs}</p>
                    <p className="text-white/70">ℓ₁: y = <InlineMath math={`${mTeX(sejM)}x + 2`} />, ℓ₂: y = <InlineMath math={`${mTeX(sejM)}x - 2`} /></p>
                    <p className="text-white/70">Gradien: m₁ = m₂ = <strong className="text-cyan-300">{mDisp(sejM)}</strong> → kedua garis <strong className="text-cyan-300">{t.sej_obs_sejajar}</strong></p>
                    <p className="text-white/50">{t.sej_obs_jarak}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TEGAK LURUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="tegaklurus" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.sh_tegaklurus} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-900/20 border border-violet-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-300 mb-2 font-body">{t.tek_syarat}</p>
                  <div className="text-center">
                    <BlockMath math="m_1 \times m_2 = -1" />
                    <p className="text-xs text-white/60 mt-1">{t.tek_sub}</p>
                  </div>
                  <div className="bg-violet-900/30 rounded-lg p-3 mt-2">
                    <p className="text-xs text-violet-300 font-semibold mb-1">{t.tek_m2}</p>
                    <BlockMath math="m_2 = -\frac{1}{m_1}" />
                    <p className="text-xs text-white/50">{t.tek_m2_sub}</p>
                  </div>
                </div>

                {/* Penjelasan MENGAPA */}
                <div className="bg-slate-800/50 border border-violet-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-violet-300 uppercase tracking-wide">{t.tek_why}</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">{t.tek_p1}</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">{t.tek_p2}</p>
                  <div className="text-center">
                    <BlockMath math="m_2 = \frac{1}{-m_1} = -\frac{1}{m_1}" />
                  </div>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    <InlineMath math="m_1 \times m_2 = m_1 \times \left(-\frac{1}{m_1}\right) = -1" /> ✓
                  </p>
                  <div className="bg-violet-900/30 rounded-lg p-2 text-xs font-body">
                    <p className="text-violet-200">{t.tek_note}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2">{t.tek_vis}</p>
                    <CoordSys label="ℓ₁ ⊥ ℓ₂">
                      <polyline points={[[-3,-6],[-2,-4],[-1,-2],[0,0],[1,2],[2,4],[3,6]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-4,4],[-2,3],[0,2],[2,1],[4,0],[6,-1]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      {/* ℓ₁: y=2x, ℓ₂: y=-0.5x+2 → intersect at (0.8,1.6) */}
                      <polygon points={perpMark(0.8, 1.6, 2, -0.5)} fill="none" stroke="#facc15" strokeWidth="1.5" />
                      <text x={toX(-2)} y={toY(5)} fill="#a78bfa" fontSize="8">ℓ₁: y=2x</text>
                      <text x={toX(1)} y={toY(-2)} fill="#f472b6" fontSize="8">ℓ₂: y=−½x+2</text>
                    </CoordSys>
                    <p className="text-xs text-white/40 text-center mt-1">{t.tek_vis_note}</p>
                  </div>
                  <div className="bg-violet-900/10 border border-violet-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2">{t.tek_pairs}</p>
                    <div className="space-y-1.5 text-xs font-body">
                      {[
                        { l1: "y = 3x + 1", l2: "y = −⅓x + 2", ket: "3 × (−⅓) = −1 ✓" },
                        { l1: "y = −4x", l2: "y = ¼x + 3", ket: "(−4) × ¼ = −1 ✓" },
                        { l1: "y = ½x − 1", l2: "y = −2x + 5", ket: "½ × (−2) = −1 ✓" },
                      ].map(({ l1, l2, ket }) => (
                        <div key={l1} className="bg-violet-900/30 rounded-lg p-2">
                          <p className="text-violet-300">{l1} ⊥ {l2}</p>
                          <p className="text-white/40">{ket}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ANIMASI INTERAKTIF TEGAK LURUS */}
                <div className="bg-violet-900/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">{t.tek_anim}</p>
                  <p className="text-xs text-white/60 font-body">{t.tek_anim_desc} <InlineMath math="m_2 = -\frac{1}{m_1}" /></p>
                  <div className="flex flex-wrap gap-2">
                    {TEK_OPTS.map(v => (
                      <button key={v} onClick={() => { playPopSound(); setTekM1(v); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${tekM1 === v ? "bg-violet-500 text-white" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                        m₁ = {mDisp(v)}
                      </button>
                    ))}
                  </div>
                  <CoordSys label={`m₁·m₂=−1`}>
                    <polyline points={gPts(tekM1, 0)} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                    <polyline points={gPts(tekM2, 0)} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Both lines pass through origin (0,0) */}
                    <polygon points={perpMark(0, 0, tekM1, tekM2, 0.5)} fill="none" stroke="#facc15" strokeWidth="1.8" />
                    <text x={5} y={H-20} fill="#a78bfa" fontSize="7">ℓ₁: y={mDisp(tekM1)}x</text>
                    <text x={5} y={H-11} fill="#f472b6" fontSize="7">ℓ₂: y={mDisp(tekM2)}x</text>
                  </CoordSys>
                  <div className="bg-violet-900/30 rounded-lg p-3 text-xs font-body space-y-1">
                    <p className="text-violet-300 font-semibold">{t.tek_obs}</p>
                    <p className="text-white/70">m₁ = <strong className="text-violet-300">{mDisp(tekM1)}</strong>, maka m₂ = −1/m₁ = <strong className="text-pink-300">{mDisp(tekM2)}</strong></p>
                    <p className="text-white/70">Verifikasi: <InlineMath math={`m_1 \\times m_2 = ${mTeX(tekM1)} \\times ${mTeX(tekM2)} = -1`} /> ✓</p>
                    <p className="text-white/50">{t.tek_obs_note}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BERPOTONGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="berpotongan" icon={<Layers className="w-5 h-5" />} iconColor="text-green-400" title={t.sh_berpotongan} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">{t.ber_syarat}</p>
                  <BlockMath math="m_1 \neq m_2" />
                  <p className="text-xs text-white/60 mt-1">{t.ber_sub}</p>
                  <p className="text-xs text-white/50 mt-1">{t.ber_sub2} <InlineMath math="m_1 \times m_2 \neq -1" /></p>
                </div>

                {/* Penjelasan MENGAPA */}
                <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-green-300 uppercase tracking-wide">{t.ber_why}</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">{t.ber_p1}</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    {t.ber_p2} <InlineMath math="y = m_1 x + c_1" /> dan <InlineMath math="y = m_2 x + c_2" /> dengan <InlineMath math="m_1 \neq m_2" />:
                  </p>
                  <div className="text-center">
                    <BlockMath math="x = \frac{c_2 - c_1}{m_1 - m_2}" />
                  </div>
                  <div className="bg-green-900/30 rounded-lg p-2 text-xs font-body">
                    <p className="text-green-200">{t.ber_note}</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-300 mb-2">Cara menentukan titik potong:</p>
                  <p className="text-xs text-white/60 mb-2">Selesaikan sistem persamaan kedua garis (SPLDV)</p>
                  <div className="space-y-1 text-xs font-body text-white/70">
                    <p>ℓ₁: y = 2x + 1 dan ℓ₂: y = −x + 4</p>
                    <p>→ 2x + 1 = −x + 4</p>
                    <p>→ 3x = 3 → x = 1</p>
                    <p>→ y = 2(1) + 1 = 3</p>
                  </div>
                  <p className="text-green-300 font-bold text-xs mt-1">Titik potong: (1, 3)</p>
                </div>

                {/* ANIMASI INTERAKTIF BERPOTONGAN */}
                <div className="bg-green-900/10 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-green-300 uppercase tracking-wider">{t.ber_anim}</p>
                  <p className="text-xs text-white/60 font-body">{t.ber_anim_desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-cyan-300 font-semibold mb-2">m₁ (ℓ₁ — biru):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {BER_OPTS.map(v => (
                          <button key={v} onClick={() => { playPopSound(); setBerM1(v); }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${berM1 === v ? "bg-cyan-500 text-white" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                            {mDisp(v)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-300 font-semibold mb-2">m₂ (ℓ₂ — kuning):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {BER_OPTS.map(v => (
                          <button key={v} onClick={() => { playPopSound(); setBerM2(v); }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${berM2 === v ? "bg-yellow-500 text-slate-900" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                            {mDisp(v)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {(() => {
                    const pt = lineIntersect(berM1, 1, berM2, -1);
                    const isParallel = berM1 === berM2;
                    const isPerp = Math.abs(berM1 * berM2 + 1) < 0.001;
                    return (
                      <>
                        <CoordSys label={isParallel ? "Sejajar!" : `Titik potong ${pt ? `(${Math.round(pt[0]*10)/10}, ${Math.round(pt[1]*10)/10})` : ""}`}>
                          <polyline points={gPts(berM1, 1)} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                          <polyline points={gPts(berM2, -1)} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                          {pt && !isParallel && (
                            <>
                              {isPerp && <polygon points={perpMark(pt[0], pt[1], berM1, berM2, 0.45)} fill="none" stroke="#f87171" strokeWidth="1.5" />}
                              <circle cx={toX(pt[0])} cy={toY(pt[1])} r="5" fill={isPerp ? "#f87171" : "#4ade80"} stroke={isPerp ? "#fca5a5" : "#86efac"} strokeWidth="1.5" />
                              <text x={toX(pt[0])+6} y={toY(pt[1])-4} fill={isPerp ? "#f87171" : "#4ade80"} fontSize="8">({Math.round(pt[0]*10)/10},{Math.round(pt[1]*10)/10})</text>
                            </>
                          )}
                          <text x={5} y={H-20} fill="#22d3ee" fontSize="7">ℓ₁: y={mDisp(berM1)}x+1</text>
                          <text x={5} y={H-11} fill="#facc15" fontSize="7">ℓ₂: y={mDisp(berM2)}x−1</text>
                        </CoordSys>
                        <div className={`rounded-lg p-3 text-xs font-body space-y-1 border ${isParallel ? "bg-cyan-900/30 border-cyan-500/30" : isPerp ? "bg-red-900/30 border-red-500/30" : "bg-green-900/30 border-green-500/30"}`}>
                          <p className={`font-semibold ${isParallel ? "text-cyan-300" : isPerp ? "text-red-300" : "text-green-300"}`}>
                            {isParallel ? "⚠️ SEJAJAR" : isPerp ? "⊥ TEGAK LURUS (90°)" : "✕ BERPOTONGAN BIASA"}
                          </p>
                          <p className="text-white/70">m₁ = <strong>{mDisp(berM1)}</strong>, m₂ = <strong>{mDisp(berM2)}</strong></p>
                          {isParallel && <p className="text-white/60">m₁ = m₂ → garis sejajar, tidak berpotongan!</p>}
                          {isPerp && pt && <p className="text-white/60">m₁ × m₂ = {mDisp(berM1)} × {mDisp(berM2)} = −1 → sudut 90° di ({Math.round(pt[0]*10)/10}, {Math.round(pt[1]*10)/10})</p>}
                          {!isParallel && !isPerp && pt && <p className="text-white/60">m₁ ≠ m₂, m₁×m₂ = {Math.round(berM1*berM2*100)/100} ≠ −1 → titik potong ({Math.round(pt[0]*10)/10}, {Math.round(pt[1]*10)/10})</p>}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* GALERI VISUAL TIGA JENIS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="visual-trio" icon={<GitBranch className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_visual} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Sejajar */}
                  <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2 text-center">∥ SEJAJAR</p>
                    <CoordSys label="m₁=m₂=2">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-5],[0,-3],[1,-1],[2,1],[3,3]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-cyan-300 font-mono">ℓ₁: y = 2x + 1</p>
                      <p className="text-cyan-200/60 font-mono">ℓ₂: y = 2x − 3</p>
                      <p className="text-white/40">m₁ = m₂ = 2</p>
                    </div>
                  </div>
                  {/* Tegak lurus — fixed right-angle marker */}
                  <div className="bg-slate-900/60 border border-violet-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2 text-center">⊥ TEGAK LURUS</p>
                    <CoordSys label="m₁·m₂=−1">
                      {/* ℓ₁: y=2x, ℓ₂: y=-0.5x → intersect at origin (0,0) */}
                      <polyline points={[[-3,-6],[-2,-4],[-1,-2],[0,0],[1,2],[2,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-4,2],[-2,1],[0,0],[2,-1],[4,-2]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      <polygon points={perpMark(0, 0, 2, -0.5)} fill="none" stroke="#facc15" strokeWidth="1.5" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-violet-300 font-mono">ℓ₁: y = 2x</p>
                      <p className="text-pink-400 font-mono">ℓ₂: y = −½x</p>
                      <p className="text-white/40">2 × (−½) = −1 ✓</p>
                    </div>
                  </div>
                  {/* Berpotongan */}
                  <div className="bg-slate-900/60 border border-green-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-300 mb-2 text-center">✕ BERPOTONGAN</p>
                    <CoordSys label="m₁≠m₂">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-3,6],[-2,5],[0,3],[1,2],[2,1],[3,0]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx={toX(-1)} cy={toY(-1)} r="5" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-green-300 font-mono">ℓ₁: y = 2x + 1</p>
                      <p className="text-yellow-300 font-mono">ℓ₂: y = −x + 2</p>
                      <p className="text-white/40">m₁=2 ≠ m₂=−1</p>
                    </div>
                  </div>
                </div>

                {/* Summary table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead><tr className="bg-slate-700/60">
                      {t.vis_tabel_h.map((h: string) => (
                        <th key={h} className="border border-white/10 px-3 py-2 text-white">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {t.vis_tabel_rows.map(([h,s,p]: string[], i: number) => (
                        <tr key={i} className={i%2===0?"bg-slate-800/30":"bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{h}</td>
                          <td className="border border-white/10 px-3 py-2 text-yellow-300 font-mono">{s}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.sh_contoh1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.mudah} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">{t.soal}</p>
                  <p className="text-sm text-white/85 font-body">{t.c1_soal} <InlineMath math="\ell_1: y = 3x - 5" /> dan <InlineMath math="\ell_2: y = 3x + 2" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">{t.c1_id_grad}</p>
                    <p className="text-white/70 text-xs">ℓ₁: y = 3x − 5 → m₁ = 3</p>
                    <p className="text-white/70 text-xs">ℓ₂: y = 3x + 2 → m₂ = 3</p>
                    <p className="text-white/70 text-xs mt-1">m₁ = m₂ = 3, tetapi c₁ = −5 ≠ c₂ = 2</p>
                  </div>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-3">
                    <CoordSys label="ℓ₁ ∥ ℓ₂">
                      <polyline points={[[-1,-8],[0,-5],[1,-2],[2,1],[3,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-1],[0,2],[1,5],[2,8]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                      <text x={toX(1)} y={toY(3)} fill="#22d3ee" fontSize="8">ℓ₁</text>
                      <text x={toX(-0.5)} y={toY(4)} fill="#67e8f9" fontSize="8">ℓ₂</text>
                    </CoordSys>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">{t.c1_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_contoh2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.sedang} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-yellow-300 mb-2 font-body">{t.soal}</p>
                  <p className="text-sm text-white/85 font-body">{t.c2_soal} <InlineMath math="(2, 5)" /> <InlineMath math="y = 4x - 3" /></p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">{t.c2_l1}</p>
                    <p className="text-white/70 text-xs">m₁ = 4 (dari y = 4x − 3)</p>
                    <BlockMath math="m_2 = -\frac{1}{m_1} = -\frac{1}{4}" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">{t.c2_l2}</p>
                    <BlockMath math="y - 5 = -\frac{1}{4}(x - 2)" />
                    <BlockMath math="y = -\frac{1}{4}x + \frac{1}{2} + 5 = -\frac{1}{4}x + \frac{11}{2}" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">{t.c2_vis}</p>
                    <CoordSys label="⊥ di (2,5)">
                      {/* ℓ₁: y=4x-3, ℓ₂: y=-¼x+5.5, intersect at (2,5) */}
                      <polyline points={[[-1,-7],[0,-3],[1,1],[2,5],[3,9]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                      <polyline points={[[-4,6.5],[-2,6],[0,5.5],[2,5],[4,4.5],[6,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                      <polygon points={perpMark(2, 5, 4, -0.25, 0.3)} fill="none" stroke="#f87171" strokeWidth="1.2" />
                      <circle cx={toX(2)} cy={toY(5)} r="5" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5" />
                      <text x={toX(2)+5} y={toY(5)-5} fill="#f87171" fontSize="8">(2,5)</text>
                    </CoordSys>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">{t.c2_ans} <InlineMath math="y = -\frac{1}{4}x + \frac{11}{2}" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.sh_contoh3} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.sulit} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-300 mb-2 font-body">{t.soal}</p>
                  <p className="text-sm text-white/85 font-body">{t.c3_soal} <InlineMath math="\ell_1: 2x - y + 4 = 0" />, <InlineMath math="\ell_2: x + 2y - 6 = 0" />, <InlineMath math="\ell_3: 4x - 2y + 1 = 0" />.</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">{t.c3_l1}</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-cyan-900/20 rounded-lg p-2">
                        <p className="text-cyan-300 font-semibold">ℓ₁: 2x − y + 4 = 0</p>
                        <p className="text-white/70">y = 2x + 4 → <strong className="text-yellow-300">m₁ = 2</strong></p>
                      </div>
                      <div className="bg-violet-900/20 rounded-lg p-2">
                        <p className="text-violet-300 font-semibold">ℓ₂: x + 2y − 6 = 0</p>
                        <p className="text-white/70">2y = −x + 6 → y = −½x + 3 → <strong className="text-yellow-300">m₂ = −½</strong></p>
                      </div>
                      <div className="bg-orange-900/20 rounded-lg p-2">
                        <p className="text-orange-300 font-semibold">ℓ₃: 4x − 2y + 1 = 0</p>
                        <p className="text-white/70">2y = 4x + 1 → y = 2x + ½ → <strong className="text-yellow-300">m₃ = 2</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2">{t.c3_l2}</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="bg-green-900/20 rounded-lg p-2">
                        <p className="text-green-300 font-bold">a) ℓ₁ ⊥ ℓ₂:</p>
                        <p className="text-white/60">m₁ × m₂ = 2 × (−½) = −1 ✓ → <strong className="text-green-300">TEGAK LURUS</strong></p>
                      </div>
                      <div className="bg-cyan-900/20 rounded-lg p-2">
                        <p className="text-cyan-300 font-bold">b) ℓ₁ ∥ ℓ₃:</p>
                        <p className="text-white/60">m₁ = m₃ = 2, c₁ = 4 ≠ c₃ = ½ → <strong className="text-cyan-300">SEJAJAR</strong></p>
                      </div>
                      <div className="bg-orange-900/20 rounded-lg p-2">
                        <p className="text-orange-300 font-bold">c) ℓ₂ dan ℓ₃:</p>
                        <p className="text-white/60">m₂ = −½ ≠ m₃ = 2, m₂×m₃ = −1 → <strong className="text-orange-300">TEGAK LURUS</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-300">{t.c3_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sh_rangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {t.rang_items.map(([label, desc]: string[]) => (
                    <div key={label} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{label}:</strong> {desc}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body">{t.rang_tip}</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Hubungan2GarisPage;
