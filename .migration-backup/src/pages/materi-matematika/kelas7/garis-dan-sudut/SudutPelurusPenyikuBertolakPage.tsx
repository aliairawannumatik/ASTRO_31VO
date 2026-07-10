import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import ProtractorAnimation from "@/components/ProtractorAnimation";

const uiMap = {
  id: {
    pageTitle: "SUDUT PELURUS, SUDUT PENYIKU\n& SUDUT BERTOLAK BELAKANG",
    pageSubtitle: "Kelas 7 · Garis dan Sudut · Materi Matematika",
    examplesTitle: "CONTOH SOAL",
    soal: "Soal", pembahasan: "Pembahasan", backBtn: "Kembali ke Garis dan Sudut",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT", contoh: "Contoh",
    sec1: "Mengenal Sudut: Dari Mana Asalnya?",
    sec2: "Sudut Bertolak Belakang",
    sec3: "Sudut Pelurus (Berpelurus / Supplementary)",
    sec4: "Sudut Penyiku (Berpenyiku / Complementary)",
    sec5: "Ringkasan: Perbandingan 3 Jenis Sudut",
    svgRay1: "sinar 1", svgRay2: "sinar 2",
    svgAngleDesc: "Sudut α dibentuk oleh 2 sinar dari titik O",
    svgBertolak: "∠1 = ∠3 (bertolak belakang)  |  ∠2 = ∠4 (bertolak belakang)",
    svgPelurus: "α + β = 180°  →  saling berpelurus",
    svgPenyiku: "α + β = 90°  →  saling berpenyiku",
    svgSuppP: "pelurus P",
    svgSuppEq: "pelurus P = 3 × penyiku P = ?",
    tblJenis: "Jenis Sudut", tblSyarat: "Syarat", tblRumus: "Rumus Mencari Pasangan", tblEng: "Istilah Inggris",
    tblBertolak: "Bertolak Belakang", tblPelurus: "Berpelurus", tblPenyiku: "Berpenyiku",
    s1p1: "Coba bayangkan dua sinar cahaya yang keluar dari satu titik lampu — sudut adalah",
    s1bold: "daerah yang terbentuk di antara dua sinar garis yang bertemu di satu titik pangkal",
    s1p2: "Semakin lebar bukaannya, semakin besar sudutnya!",
    s1deg0: "Sudut 0°", s1deg0t: "kedua sinar garis saling berhimpit (nol jarak).",
    s1deg90: "Sudut 90°", s1deg90t: "sudut siku-siku, membentuk huruf L.",
    s1deg180: "Sudut 180°", s1deg180t: "kedua sinar membentuk garis lurus.",
    s1deg360: "Sudut 360°", s1deg360t: "satu putaran penuh, kembali ke posisi awal.",
    s1tip: "Di jenjang SMP, kita fokus pada besar/ukuran sudut, bukan arah putarnya (positif/negatif).",
    s2p1: "Bayangkan kamu menekan gunting — kedua mata guntingnya membentuk dua garis yang berpotongan. Perpotongan itu menghasilkan 4 sudut, dan yang saling \"bersebrangan\" disebut",
    s2bold: "sudut bertolak belakang",
    s2def: "Definisi:", s2defTxt: "Sudut-sudut yang dibentuk oleh dua garis berpotongan yang saling berhadapan disebut sudut bertolak belakang.",
    s2thm: "Teorema (Dalil):", s2thmSub: "Sudut bertolak belakang selalu sama besar.",
    s2proofLabel: "Bukti Deduktif:",
    proofNo: "No.", proofStat: "Pernyataan", proofReason: "Alasan",
    proof1r: "∠1 dan ∠2 membentuk sudut lurus",
    proof2r: "∠2 dan ∠3 membentuk sudut lurus",
    proof3r: "Dari (1) dan (2), kurangi ∠2",
    s3p1: "Pernah lihat pintu yang terbuka setengah? Kalau ditambah sisi dindingnya, mereka membentuk garis lurus — itulah ilustrasi",
    s3bold: "sudut pelurus",
    s3def: "Definisi:", s3defTxt: "Dua sudut saling berpelurus (supplementary) jika jumlah keduanya tepat 180°.",
    s3sub: "Jika α diketahui, maka pelurusnya =",
    s3tip: "Contoh: Pelurus dari 110° adalah 180° − 110° = 70°.",
    s4p1: "Pojok meja yang sempurna membentuk",
    s4bold1: "sudut siku-siku 90°",
    s4p2: "Jika sebuah garis membagi pojok itu, dua sudut kecil yang terbentuk adalah pasangan",
    s4bold2: "sudut penyiku",
    s4def: "Definisi:", s4defTxt: "Dua sudut saling berpenyiku (complementary) jika jumlah keduanya tepat 90°.",
    s4sub: "Jika α diketahui, maka penyikunya =",
    s4tip: "Contoh: Penyiku dari 70° adalah 90° − 70° = 20°.",
    ex1q: "Tentukan besar sudut pelurus dan sudut penyiku dari", ex1qEnd: "!",
    ex1sp: "Mencari Sudut Pelurus:", ex1sc: "Mencari Sudut Penyiku:",
    ex1ans: "Jawaban: Pelurus =", ex1ansMid: ", Penyiku =",
    ex1chk: "✅ Cek:",
    ex2q: "Dua garis a dan b berpotongan membentuk 4 sudut. Sudut",
    ex2qMid: "dan sudut", ex2qEnd: ".",
    ex2q2: "Jika ∠1 dan ∠3 adalah sudut bertolak belakang, tentukan:",
    ex2a: "a) Nilai", ex2b: "b) Besar",
    ex2ansA: "a) Mencari nilai x:", ex2cond: "Sudut bertolak belakang → sama besar:",
    ex2ansB: "b) Besar sudut-sudutnya:",
    ex2supp: "∠1 dan ∠2 berpelurus (membentuk garis lurus):",
    ex2final: "Jawaban:",
    ex3q: "Pelurus sudut P adalah tiga kali penyiku sudut P. Tentukan besar sudut P!",
    ex3s1: "Langkah 1 — Misalkan:", ex3s2: "Langkah 2 — Buat persamaan:", ex3s3: "Langkah 3 — Verifikasi:",
    ex3let: "Misalkan besar sudut P =",
    ex3pelurus: "Pelurus P =", ex3penyiku: "Penyiku P =",
    ex3eq: "\"Pelurus P adalah tiga kali penyiku P\":",
    ex3verify1: "Pelurus 45° =", ex3verify2: "Penyiku 45° =", ex3verify3: "Cek:",
    ex3ans: "Jawaban:",
  },
  en: {
    pageTitle: "SUPPLEMENTARY, COMPLEMENTARY\n& VERTICAL ANGLES",
    pageSubtitle: "Grade 7 · Lines & Angles · Mathematics",
    examplesTitle: "PRACTICE PROBLEMS",
    soal: "Problem", pembahasan: "Solution", backBtn: "Back to Lines & Angles",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD", contoh: "Example",
    sec1: "Understanding Angles: Where Do They Come From?",
    sec2: "Vertical Angles",
    sec3: "Supplementary Angles",
    sec4: "Complementary Angles",
    sec5: "Summary: Comparison of 3 Angle Types",
    svgRay1: "ray 1", svgRay2: "ray 2",
    svgAngleDesc: "Angle α formed by 2 rays from point O",
    svgBertolak: "∠1 = ∠3 (vertical angles)  |  ∠2 = ∠4 (vertical angles)",
    svgPelurus: "α + β = 180°  →  supplementary",
    svgPenyiku: "α + β = 90°  →  complementary",
    svgSuppP: "supp. P",
    svgSuppEq: "supp. P = 3 × comp. P = ?",
    tblJenis: "Angle Type", tblSyarat: "Condition", tblRumus: "Formula for Partner", tblEng: "English Term",
    tblBertolak: "Vertical Angles", tblPelurus: "Supplementary", tblPenyiku: "Complementary",
    s1p1: "Imagine two light rays coming from a single lamp — an angle is the",
    s1bold: "region formed between two rays meeting at a common point",
    s1p2: "The wider the opening, the larger the angle!",
    s1deg0: "0° angle", s1deg0t: "both rays coincide (zero opening).",
    s1deg90: "90° angle", s1deg90t: "right angle, forming the letter L.",
    s1deg180: "180° angle", s1deg180t: "both rays form a straight line.",
    s1deg360: "360° angle", s1deg360t: "full rotation, back to starting position.",
    s1tip: "At this level, we focus on the size/measure of angles, not their rotational direction.",
    s2p1: "Imagine pressing scissors — both blades form two intersecting lines. The intersection creates 4 angles, and those that face each other are called",
    s2bold: "vertical angles",
    s2def: "Definition:", s2defTxt: "Angles formed by two intersecting lines that face each other are called vertical angles.",
    s2thm: "Theorem:", s2thmSub: "Vertical angles are always equal.",
    s2proofLabel: "Deductive Proof:",
    proofNo: "No.", proofStat: "Statement", proofReason: "Reason",
    proof1r: "∠1 and ∠2 form a straight angle",
    proof2r: "∠2 and ∠3 form a straight angle",
    proof3r: "From (1) and (2), subtract ∠2",
    s3p1: "Imagine a door half open — adding the wall makes a straight line. This illustrates",
    s3bold: "supplementary angles",
    s3def: "Definition:", s3defTxt: "Two angles are supplementary if their sum is exactly 180°.",
    s3sub: "If α is known, its supplement =",
    s3tip: "Example: The supplement of 110° is 180° − 110° = 70°.",
    s4p1: "A perfect table corner forms a",
    s4bold1: "right angle of 90°",
    s4p2: "If a line divides that corner, the two small angles formed are",
    s4bold2: "complementary angles",
    s4def: "Definition:", s4defTxt: "Two angles are complementary if their sum is exactly 90°.",
    s4sub: "If α is known, its complement =",
    s4tip: "Example: The complement of 70° is 90° − 70° = 20°.",
    ex1q: "Find the supplementary and complementary angles of", ex1qEnd: "!",
    ex1sp: "Finding Supplementary Angle:", ex1sc: "Finding Complementary Angle:",
    ex1ans: "Answer: Supplementary =", ex1ansMid: ", Complementary =",
    ex1chk: "✅ Check:",
    ex2q: "Two lines a and b intersect forming 4 angles. Angle",
    ex2qMid: "and angle", ex2qEnd: ".",
    ex2q2: "If ∠1 and ∠3 are vertical angles, find:",
    ex2a: "a) Value of", ex2b: "b) Measure of",
    ex2ansA: "a) Finding x:", ex2cond: "Vertical angles → equal:",
    ex2ansB: "b) Angle measures:",
    ex2supp: "∠1 and ∠2 are supplementary (forming a straight line):",
    ex2final: "Answer:",
    ex3q: "The supplement of angle P is three times its complement. Find angle P!",
    ex3s1: "Step 1 — Let:", ex3s2: "Step 2 — Set up equation:", ex3s3: "Step 3 — Verify:",
    ex3let: "Let angle P =",
    ex3pelurus: "Supplement of P =", ex3penyiku: "Complement of P =",
    ex3eq: "\"Supplement of P is three times complement of P\":",
    ex3verify1: "Supplement of 45° =", ex3verify2: "Complement of 45° =", ex3verify3: "Check:",
    ex3ans: "Answer:",
  },
  ja: {
    pageTitle: "補角・余角・対頂角",
    pageSubtitle: "中学1年 · 直線と角 · 数学",
    examplesTitle: "練習問題",
    soal: "問題", pembahasan: "解説", backBtn: "直線と角に戻る",
    mudah: "基本", sedang: "標準", sulit: "発展", contoh: "例題",
    sec1: "角を知ろう：角はどこから来る？",
    sec2: "対頂角",
    sec3: "補角（Supplementary）",
    sec4: "余角（Complementary）",
    sec5: "まとめ：3種類の角の比較",
    svgRay1: "光線 1", svgRay2: "光線 2",
    svgAngleDesc: "点Oから出る2本の光線が作る角α",
    svgBertolak: "∠1 = ∠3 (対頂角)  |  ∠2 = ∠4 (対頂角)",
    svgPelurus: "α + β = 180°  →  補角",
    svgPenyiku: "α + β = 90°  →  余角",
    svgSuppP: "Pの補角",
    svgSuppEq: "補角P = 3 × 余角P = ?",
    tblJenis: "角の種類", tblSyarat: "条件", tblRumus: "ペアを求める公式", tblEng: "英語の用語",
    tblBertolak: "対頂角", tblPelurus: "補角", tblPenyiku: "余角",
    s1p1: "1つの光源から出る2本の光線を想像してください — 角とは",
    s1bold: "1点から出る2本の直線の間にできる領域",
    s1p2: "開きが広いほど、角は大きくなります！",
    s1deg0: "0°の角", s1deg0t: "2本の直線が重なる（開きゼロ）。",
    s1deg90: "90°の角", s1deg90t: "直角、Lの字の形。",
    s1deg180: "180°の角", s1deg180t: "2本の直線が直線を作る。",
    s1deg360: "360°の角", s1deg360t: "一回転、元の位置に戻る。",
    s1tip: "このレベルでは、角の大きさ・測り方に注目します（回転方向は扱いません）。",
    s2p1: "はさみを押すところを想像してください — 2枚の刃が交わる直線を作ります。その交点で4つの角ができ、向かい合うものを",
    s2bold: "対頂角",
    s2def: "定義：", s2defTxt: "2直線が交わるときにできる向かい合う角を対頂角といいます。",
    s2thm: "定理：", s2thmSub: "対頂角は常に等しい。",
    s2proofLabel: "論理的証明：",
    proofNo: "番号", proofStat: "命題", proofReason: "理由",
    proof1r: "∠1と∠2で直線の角を作る",
    proof2r: "∠2と∠3で直線の角を作る",
    proof3r: "(1)と(2)から∠2を引く",
    s3p1: "半開きのドアを想像してください — 壁を足すと直線になります。これが",
    s3bold: "補角",
    s3def: "定義：", s3defTxt: "2つの角の和がちょうど180°のとき、それらは補角といいます。",
    s3sub: "αがわかれば、補角 =",
    s3tip: "例：110°の補角は 180° − 110° = 70°。",
    s4p1: "机の角は",
    s4bold1: "直角（90°）",
    s4p2: "を形成します。その角を1本の直線で分けると、できる2つの小さな角が",
    s4bold2: "余角",
    s4def: "定義：", s4defTxt: "2つの角の和がちょうど90°のとき、それらは余角といいます。",
    s4sub: "αがわかれば、余角 =",
    s4tip: "例：70°の余角は 90° − 70° = 20°。",
    ex1q: "次の角の補角と余角を求めなさい：", ex1qEnd: "",
    ex1sp: "補角を求める：", ex1sc: "余角を求める：",
    ex1ans: "答え：補角 =", ex1ansMid: "、余角 =",
    ex1chk: "✅ 確認：",
    ex2q: "2直線aとbが交わって4つの角を作ります。角",
    ex2qMid: "と角", ex2qEnd: "。",
    ex2q2: "∠1と∠3が対頂角のとき、求めなさい：",
    ex2a: "a) xの値", ex2b: "b) ∠1と∠2の大きさ",
    ex2ansA: "a) xを求める：", ex2cond: "対頂角 → 等しい：",
    ex2ansB: "b) 各角の大きさ：",
    ex2supp: "∠1と∠2は補角（直線を作る）：",
    ex2final: "答え：",
    ex3q: "角Pの補角は余角の3倍です。角Pの大きさを求めなさい！",
    ex3s1: "ステップ1 — 設定：", ex3s2: "ステップ2 — 方程式を立てる：", ex3s3: "ステップ3 — 確認：",
    ex3let: "角Pの大きさを",
    ex3pelurus: "Pの補角 =", ex3penyiku: "Pの余角 =",
    ex3eq: "「補角Pは余角Pの3倍」：",
    ex3verify1: "45°の補角 =", ex3verify2: "45°の余角 =", ex3verify3: "確認：",
    ex3ans: "答え：",
  },
};

type UI = typeof uiMap.id;

const SudutDasarSVG = ({ ray1, ray2, desc }: { ray1: string; ray2: string; desc: string }) => (
  <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="sdArR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" /></marker>
      <marker id="sdArR2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" /></marker>
    </defs>
    <circle cx="80" cy="120" r="3" fill="#facc15" />
    <line x1="80" y1="120" x2="280" y2="120" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#sdArR)" />
    <line x1="80" y1="120" x2="200" y2="30" stroke="#a78bfa" strokeWidth="2.5" markerEnd="url(#sdArR2)" />
    <path d="M120,120 A40,40 0 0,0 104,88" fill="none" stroke="#facc15" strokeWidth="1.8" />
    <text x="128" y="108" fill="#facc15" fontSize="13" fontFamily="monospace">α</text>
    <text x="283" y="124" fill="#22d3ee" fontSize="12" fontFamily="monospace">{ray1}</text>
    <text x="203" y="28" fill="#a78bfa" fontSize="12" fontFamily="monospace">{ray2}</text>
    <circle cx="80" cy="120" r="3" fill="#facc15" />
    <text x="65" y="138" fill="#facc15" fontSize="11" fontFamily="monospace">O</text>
    <text x="60" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">{desc}</text>
  </svg>
);

const BertolakSVG = ({ footerText }: { footerText: string }) => (
  <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="btArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="btArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="btArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
      <marker id="btArD" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="20" y1="110" x2="300" y2="110" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#btArR)" markerStart="url(#btArL)" />
    <line x1="160" y1="15" x2="160" y2="205" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#btArU)" markerStart="url(#btArD)" />
    <circle cx="160" cy="110" r="4" fill="#facc15" />
    <path d="M185,110 A25,25 0 0,0 160,85" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5" />
    <text x="188" y="100" fill="#facc15" fontSize="13" fontFamily="monospace">∠1</text>
    <path d="M135,110 A25,25 0 0,0 160,135" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5" />
    <text x="120" y="135" fill="#facc15" fontSize="13" fontFamily="monospace">∠3</text>
    <path d="M160,85 A25,25 0 0,0 135,110" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="120" y="100" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠2</text>
    <path d="M160,135 A25,25 0 0,0 185,110" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="167" y="148" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠4</text>
    <text x="10" y="106" fill="#22d3ee" fontSize="12" fontFamily="monospace">a</text>
    <text x="164" y="13" fill="#fb923c" fontSize="12" fontFamily="monospace">b</text>
    <text x="20" y="215" fill="#94a3b8" fontSize="10" fontFamily="monospace">{footerText}</text>
  </svg>
);

const BuktiBertolakSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto my-2">
    <defs>
      <marker id="bbArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="bbArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="bbArD" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
      <marker id="bbArU" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="20" y1="90" x2="280" y2="90" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#bbArR)" markerStart="url(#bbArL)" />
    <line x1="150" y1="170" x2="150" y2="10" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#bbArD)" markerStart="url(#bbArU)" />
    <circle cx="150" cy="90" r="4" fill="#facc15" />
    <text x="10" y="86" fill="#22d3ee" fontSize="12" fontFamily="monospace">a</text>
    <text x="154" y="14" fill="#fb923c" fontSize="12" fontFamily="monospace">b</text>
    <path d="M175,90 A25,25 0 0,0 150,65" fill="rgba(250,204,21,0.2)" stroke="#facc15" strokeWidth="1.5" />
    <text x="177" y="80" fill="#facc15" fontSize="13" fontFamily="monospace">∠1</text>
    <path d="M125,90 A25,25 0 0,0 150,115" fill="rgba(250,204,21,0.2)" stroke="#facc15" strokeWidth="1.5" />
    <text x="108" y="118" fill="#facc15" fontSize="13" fontFamily="monospace">∠3</text>
    <path d="M150,65 A25,25 0 0,0 125,90" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="107" y="76" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠2</text>
    <path d="M150,115 A25,25 0 0,0 175,90" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="158" y="118" fill="#a78bfa" fontSize="13" fontFamily="monospace">∠4</text>
  </svg>
);

const PelurusSVG = ({ footerText }: { footerText: string }) => (
  <svg viewBox="0 0 320 130" className="w-full max-w-sm mx-auto my-3">
    <defs>
      <marker id="plArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="plArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
      <marker id="plArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="20" y1="80" x2="300" y2="80" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#plArR)" markerStart="url(#plArL)" />
    <line x1="160" y1="80" x2="230" y2="20" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#plArU)" />
    <circle cx="160" cy="80" r="4" fill="#facc15" />
    <path d="M200,80 A40,40 0 0,0 185,48" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.8" />
    <text x="205" y="68" fill="#facc15" fontSize="12" fontFamily="monospace">α</text>
    <path d="M185,48 A40,40 0 0,0 120,80" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.8" />
    <text x="125" y="58" fill="#a78bfa" fontSize="12" fontFamily="monospace">β</text>
    <text x="40" y="110" fill="#e2e8f0" fontSize="11" fontFamily="monospace">{footerText}</text>
  </svg>
);

const PenyikuSVG = ({ footerText }: { footerText: string }) => (
  <svg viewBox="0 0 220 180" className="w-full max-w-xs mx-auto my-3">
    <defs>
      <marker id="pyArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
      <marker id="pyArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#4ade80" /></marker>
      <marker id="pyArUo" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
    </defs>
    <line x1="40" y1="140" x2="190" y2="140" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#pyArR)" />
    <line x1="40" y1="140" x2="40" y2="20" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#pyArU)" />
    <line x1="40" y1="140" x2="155" y2="50" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#pyArUo)" />
    <rect x="40" y="128" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
    <path d="M80,140 A40,40 0 0,0 64,107" fill="rgba(250,204,21,0.2)" stroke="#facc15" strokeWidth="1.8" />
    <text x="83" y="128" fill="#facc15" fontSize="12" fontFamily="monospace">α</text>
    <path d="M64,107 A40,40 0 0,0 40,100" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.8" />
    <text x="42" y="102" fill="#a78bfa" fontSize="12" fontFamily="monospace">β</text>
    <text x="15" y="168" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{footerText}</text>
  </svg>
);

type Section = { title: string; icon: string; content: React.ReactNode };

const getSections = (ui: UI): Section[] => [
  {
    title: ui.sec1, icon: "📐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s1p1} <strong className="text-cyan-300">{ui.s1bold}</strong>. {ui.s1p2}</p>
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-1">
          <p><strong className="text-cyan-300">{ui.s1deg0}</strong> — {ui.s1deg0t}</p>
          <p><strong className="text-cyan-300">{ui.s1deg90}</strong> — {ui.s1deg90t}</p>
          <p><strong className="text-cyan-300">{ui.s1deg180}</strong> — {ui.s1deg180t}</p>
          <p><strong className="text-cyan-300">{ui.s1deg360}</strong> — {ui.s1deg360t}</p>
        </div>
        <SudutDasarSVG ray1={ui.svgRay1} ray2={ui.svgRay2} desc={ui.svgAngleDesc} />
        <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
          💡 {ui.s1tip}
        </div>
      </div>
    ),
  },
  {
    title: ui.sec2, icon: "⟺",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s2p1} <strong className="text-yellow-300">{ui.s2bold}</strong>.</p>
        <BertolakSVG footerText={ui.svgBertolak} />
        <div className="bg-yellow-950/60 border border-yellow-600/50 rounded-lg p-4">
          <p><strong className="text-yellow-300">{ui.s2def}</strong> {ui.s2defTxt}</p>
          <p className="mt-2"><strong className="text-yellow-300">{ui.s2thm}</strong></p>
          <BlockMath math="\angle 1 = \angle 3 \quad \text{dan} \quad \angle 2 = \angle 4" />
          <p className="text-white/70 text-xs mt-1">{ui.s2thmSub}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          <p className="text-white/80 font-semibold mb-1">{ui.s2proofLabel}</p>
          <BuktiBertolakSVG />
          <div className="overflow-x-auto mt-1">
            <table className="w-full text-xs text-center border border-slate-600 rounded">
              <thead>
                <tr className="bg-slate-700">
                  <th className="px-2 py-1 border-r border-slate-600">{ui.proofNo}</th>
                  <th className="px-2 py-1 border-r border-slate-600">{ui.proofStat}</th>
                  <th className="px-2 py-1">{ui.proofReason}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-600">
                  <td className="px-2 py-1 border-r border-slate-600">1</td>
                  <td className="px-2 py-1 border-r border-slate-600"><InlineMath math="\angle 1 + \angle 2 = 180°" /></td>
                  <td className="px-2 py-1 text-left">{ui.proof1r}</td>
                </tr>
                <tr className="border-t border-slate-600">
                  <td className="px-2 py-1 border-r border-slate-600">2</td>
                  <td className="px-2 py-1 border-r border-slate-600"><InlineMath math="\angle 2 + \angle 3 = 180°" /></td>
                  <td className="px-2 py-1 text-left">{ui.proof2r}</td>
                </tr>
                <tr className="border-t border-slate-600">
                  <td className="px-2 py-1 border-r border-slate-600">3</td>
                  <td className="px-2 py-1 border-r border-slate-600"><InlineMath math="\angle 1 = \angle 3" /></td>
                  <td className="px-2 py-1 text-left">{ui.proof3r}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: ui.sec3, icon: "↔",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s3p1} <strong className="text-violet-300">{ui.s3bold}</strong>.</p>
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4">
          <p><strong className="text-violet-300">{ui.s3def}</strong> {ui.s3defTxt}</p>
          <BlockMath math="\alpha + \beta = 180°" />
          <p className="text-white/70 text-xs">{ui.s3sub} <InlineMath math="180° - \alpha" /></p>
        </div>
        <PelurusSVG footerText={ui.svgPelurus} />
        <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">
          📌 {ui.s3tip}
        </div>
      </div>
    ),
  },
  {
    title: ui.sec4, icon: "⌐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>{ui.s4p1} <strong className="text-green-300">{ui.s4bold1}</strong>. {ui.s4p2} <strong className="text-green-300">{ui.s4bold2}</strong>.</p>
        <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4">
          <p><strong className="text-green-300">{ui.s4def}</strong> {ui.s4defTxt}</p>
          <BlockMath math="\alpha + \beta = 90°" />
          <p className="text-white/70 text-xs">{ui.s4sub} <InlineMath math="90° - \alpha" /></p>
        </div>
        <PenyikuSVG footerText={ui.svgPenyiku} />
        <div className="bg-green-950/40 border border-green-600/30 rounded-lg p-3 text-xs text-green-200">
          📌 {ui.s4tip}
        </div>
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
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblJenis}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblSyarat}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tblRumus}</th>
                <th className="px-3 py-2 text-cyan-300">{ui.tblEng}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-700 bg-yellow-950/30">
                <td className="px-3 py-2 text-yellow-300 font-semibold border-r border-slate-700">{ui.tblBertolak}</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700">2 intersecting lines</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\angle 1 = \angle 3" /></td>
                <td className="px-3 py-2 text-white/70">Vertical Angles</td>
              </tr>
              <tr className="border-t border-slate-700 bg-violet-950/30">
                <td className="px-3 py-2 text-violet-300 font-semibold border-r border-slate-700">{ui.tblPelurus}</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\alpha + \beta = 180°" /></td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="180° - \alpha" /></td>
                <td className="px-3 py-2 text-white/70">Supplementary</td>
              </tr>
              <tr className="border-t border-slate-700 bg-green-950/30">
                <td className="px-3 py-2 text-green-300 font-semibold border-r border-slate-700">{ui.tblPenyiku}</td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="\alpha + \beta = 90°" /></td>
                <td className="px-3 py-2 text-white/70 border-r border-slate-700"><InlineMath math="90° - \alpha" /></td>
                <td className="px-3 py-2 text-white/70">Complementary</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

type Example = { level: string; color: string; bg: string; border: string; question: React.ReactNode; answer: React.ReactNode };

const TwoLinesCutSVG = ({ angle }: { angle: number }) => {
  const rad = (angle * Math.PI) / 180;
  const x2 = 150 + 100 * Math.cos(rad);
  const y2 = 90 - 100 * Math.sin(rad);
  return (
    <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-2">
      <defs>
        <marker id="tcArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
        <marker id="tcArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
        <marker id="tcArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
        <marker id="tcArD" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#fb923c" /></marker>
      </defs>
      <line x1="20" y1="90" x2="280" y2="90" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#tcArR)" markerStart="url(#tcArL)" />
      <line x1={300 - x2} y1={180 - y2} x2={x2} y2={y2} stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#tcArU)" markerStart="url(#tcArD)" />
      <circle cx="150" cy="90" r="4" fill="#facc15" />
      <path d={`M185,90 A35,35 0 0,0 ${150 + 35 * Math.cos(rad)},${90 - 35 * Math.sin(rad)}`}
        fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.5" />
      <text x="192" y="80" fill="#facc15" fontSize="12" fontFamily="monospace">{angle}°</text>
    </svg>
  );
};

const getExamples = (ui: UI): Example[] => [
  {
    level: ui.mudah, color: "text-green-400", bg: "bg-green-950/40", border: "border-green-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>{ui.ex1q} <InlineMath math="75°" />{ui.ex1qEnd}</p>
        <PelurusSVG footerText={ui.svgPelurus} />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-green-400">{ui.ex1sp}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Supplement} = 180° - 75° = 105°" />
        </div>
        <p className="text-white/80"><strong className="text-green-400">{ui.ex1sc}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\text{Complement} = 90° - 75° = 15°" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">{ui.ex1ans} <InlineMath math="105°" />{ui.ex1ansMid} <InlineMath math="15°" /></p>
        </div>
        <div className="bg-yellow-950/40 border border-yellow-600/30 rounded p-2 text-xs text-yellow-200">
          {ui.ex1chk} <InlineMath math="75° + 105° = 180°" /> ✓ {ui.s1and} <InlineMath math="75° + 15° = 90°" /> ✓
        </div>
      </div>
    ),
  },
  {
    level: ui.sedang, color: "text-yellow-400", bg: "bg-yellow-950/40", border: "border-yellow-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>{ui.ex2q} <InlineMath math="\angle 1 = (3x + 15)°" /> {ui.ex2qMid} <InlineMath math="\angle 3 = (5x - 25)°" />{ui.ex2qEnd}</p>
        <p>{ui.ex2q2}</p>
        <p>{ui.ex2a} <InlineMath math="x" /></p>
        <p>{ui.ex2b} <InlineMath math="\angle 1" /> {ui.s1and} <InlineMath math="\angle 2" /></p>
        <TwoLinesCutSVG angle={55} />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-yellow-400">{ui.ex2ansA}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex2cond}</p>
          <BlockMath math="3x + 15 = 5x - 25" />
          <BlockMath math="40 = 2x \implies x = 20" />
        </div>
        <p className="text-white/80"><strong className="text-yellow-400">{ui.ex2ansB}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <BlockMath math="\angle 1 = 3(20) + 15 = 75°" />
          <p className="text-white/60 text-xs mb-1">{ui.ex2supp}</p>
          <BlockMath math="\angle 2 = 180° - 75° = 105°" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">{ui.ex2final} <InlineMath math="x = 20" />, <InlineMath math="\angle 1 = 75°" />, <InlineMath math="\angle 2 = 105°" /></p>
        </div>
      </div>
    ),
  },
  {
    level: ui.sulit, color: "text-red-400", bg: "bg-red-950/40", border: "border-red-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>{ui.ex3q}</p>
        <svg viewBox="0 0 300 140" className="w-full max-w-xs mx-auto my-2">
          <defs>
            <marker id="slArR" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#22d3ee" /></marker>
            <marker id="slArL" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#22d3ee" /></marker>
            <marker id="slArU" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#fb923c" /></marker>
          </defs>
          <line x1="20" y1="90" x2="280" y2="90" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#slArR)" markerStart="url(#slArL)" />
          <line x1="150" y1="90" x2="220" y2="20" stroke="#fb923c" strokeWidth="2.5" markerEnd="url(#slArU)" />
          <circle cx="150" cy="90" r="4" fill="#facc15" />
          <path d="M185,90 A35,35 0 0,0 173,61" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="1.8" />
          <text x="190" y="78" fill="#facc15" fontSize="13" fontFamily="monospace">P</text>
          <path d="M173,61 A35,35 0 0,0 115,90" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.8" />
          <text x="118" y="72" fill="#a78bfa" fontSize="12" fontFamily="monospace">{ui.svgSuppP}</text>
          <text x="30" y="120" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{ui.svgSuppEq}</text>
        </svg>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-white/80"><strong className="text-red-400">{ui.ex3s1}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/70 text-xs">{ui.ex3let} <InlineMath math="p" /></p>
          <BlockMath math="\text{Supplement} = 180° - p" />
          <BlockMath math="\text{Complement} = 90° - p" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">{ui.ex3s2}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex3eq}</p>
          <BlockMath math="180° - p = 3 \times (90° - p)" />
          <BlockMath math="180° - p = 270° - 3p" />
          <BlockMath math="2p = 90° \implies p = 45°" />
        </div>
        <p className="text-white/80"><strong className="text-red-400">{ui.ex3s3}</strong></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70">
          <p>{ui.ex3verify1} <InlineMath math="180° - 45° = 135°" /></p>
          <p>{ui.ex3verify2} <InlineMath math="90° - 45° = 45°" /></p>
          <p>{ui.ex3verify3} <InlineMath math="135° = 3 \times 45°" /> ✓</p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">{ui.ex3ans} <InlineMath math="P = 45°" /></p>
        </div>
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

const SudutPelurusPenyikuBertolakPage = () => {
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
        <h1 className="font-display text-base md:text-lg font-bold text-primary text-glow-cyan mb-1 text-center leading-tight whitespace-pre-line">
          {ui.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{ui.pageSubtitle}</p>
        <div className="flex flex-col gap-3 mb-6">
          {sections.map((s) => <AccordionSection key={s.title} section={s} />)}
        </div>
        <div className="mb-10">
          <ProtractorAnimation />
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

export default SudutPelurusPenyikuBertolakPage;
