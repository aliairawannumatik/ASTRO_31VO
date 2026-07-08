import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const translations = {
  id: {
    badge: "Kelas 8 · Relasi dan Fungsi · Materi Matematika",
    title: "GRAFIK FUNGSI (PENGAYAAN)",
    subtitle: "Membaca Grafik Fungsi Linear dalam Kehidupan Nyata",
    backBtn: "← Kembali ke Relasi dan Fungsi",
    sec_intro: "🌟 Grafik Fungsi Linear di Kehidupan Nyata",
    sec_konsep: "📘 Cara Membaca Grafik Fungsi",
    sec_c1: "✏️ Contoh 1 — Grafik Modal dan Untung",
    sec_c2: "✏️ Contoh 2 — Grafik Tarif Taksi",
    sec_c3: "✏️ Contoh 3 — Menentukan Rumus dari Diagram Panah",
    sec_rang: "📌 Rangkuman & Kesimpulan",
    badge_read: "MEMBACA GRAFIK",
    badge_ctx: "KONTEKSTUAL",
    badge_guess: "MENEBAK RUMUS",
    intro_p: <>Fungsi linear <InlineMath math="f(x) = ax + b" /> menghasilkan grafik berupa <strong className="text-cyan-300">garis lurus</strong>. Grafik ini sering muncul dalam kehidupan nyata: tarif taksi, harga barang, keuntungan usaha, dan lain-lain.</>,
    graphs: [
      { icon: "📈", judul: "Grafik Naik", ket: "Koefisien a > 0, nilai y bertambah seiring x bertambah" },
      { icon: "📉", judul: "Grafik Turun", ket: "Koefisien a < 0, nilai y berkurang seiring x bertambah" },
      { icon: "➡️", judul: "Grafik Datar", ket: "Koefisien a = 0, nilai y selalu tetap (fungsi konstan)" },
    ],
    konsep_title: "🎯 Dua Cara Membaca Grafik",
    konsep_1_head: "① Diketahui x → Cari nilai y (f(x))",
    konsep_1: "Tarik garis vertikal ke atas dari nilai x di sumbu-x, lalu tarik garis horizontal ke kiri sampai sumbu-y. Nilai y yang diperoleh adalah f(x).",
    konsep_2_head: "② Diketahui y (bayangan) → Cari nilai x",
    konsep_2: "Tarik garis horizontal dari nilai y di sumbu-y, lalu tarik garis vertikal ke bawah sampai sumbu-x. Nilai x yang diperoleh adalah nilai input yang dicari.",
    graph1_title: "Ilustrasi 1: Grafik f(x) = x + 1",
    graph1_sub: "Dari x = 3 → f(3) = 3 + 1 = 4",
    graph2_title: "Ilustrasi 2: Grafik f(x) = 2x",
    graph2_sub: "Dari x = 2 → f(2) = 2 × 2 = 4",
    tips_label: "💡 Tips:",
    tips_p: "Pada soal kontekstual, perhatikan satuan pada sumbu-x dan sumbu-y. Bacalah keterangan grafik dengan teliti sebelum menjawab!",
    c1_soal_p: <>Perhatikan grafik berikut yang menunjukkan hubungan antara <strong className="text-cyan-300">modal</strong> (sumbu-x, dalam ribuan rupiah) dan <strong className="text-orange-300">keuntungan</strong> (sumbu-y, dalam ribuan rupiah) suatu usaha!</>,
    c1_q: <>Dengan modal <strong className="text-orange-300">Rp 25.000,00</strong>, berapakah untung yang diperoleh?</>,
    c1_opts: [
      { kode: "A", teks: "Rp 1.250,00" },
      { kode: "B", teks: "Rp 1.350,00" },
      { kode: "C", teks: "Rp 1.500,00" },
      { kode: "D", teks: "Rp 1.750,00" },
    ],
    c1_steps: [
      "Cari nilai x = 25 pada sumbu-x grafik.",
      "Tarik garis vertikal ke atas dari x = 25 hingga menyentuh garis grafik.",
      "Dari titik pertemuan itu, tarik garis horizontal ke kiri menuju sumbu-y.",
      "Nilai yang terbaca pada sumbu-y = 1,25 (ribuan Rp).",
      "Jadi, untung = 1,25 × Rp 1.000 = Rp 1.250,00 ✓",
    ],
    c1_graph_cap: "Grafik hubungan modal dan untung suatu usaha",
    c1_xLabel: "Modal",
    c1_yLabel: "Untung",
    c1_yUnit: "(ribu Rp)",
    c1_xUnit: "(ribuan Rp)",
    c2_soal_p: "Suatu perusahaan taksi memasang tarif seperti grafik berikut (sumbu-x = jarak tempuh dalam km, sumbu-y = tarif dalam ribuan rupiah).",
    c2_q: <>Rudi akan menumpang taksi sejauh <strong className="text-orange-300">5 kilometer</strong>. Berapa tarif taksi yang harus dibayar Rudi?</>,
    c2_opts: [
      { kode: "A", teks: "Rp 18.000,00" },
      { kode: "B", teks: "Rp 20.000,00" },
      { kode: "C", teks: "Rp 22.000,00" },
      { kode: "D", teks: "Rp 25.000,00" },
    ],
    c2_steps: [
      "Baca dua titik dari grafik: (2, 13) dan (4, 19).",
      "Misalkan rumus fungsi: f(x) = ax + b.",
      "Substitusi titik (2, 13): 2a + b = 13  … (1)",
      "Substitusi titik (4, 19): 4a + b = 19  … (2)",
      "Kurangi (1) dari (2): 2a = 6  →  a = 3.",
      "Substitusi a = 3 ke (1): 2(3) + b = 13  →  b = 7.",
      "Rumus fungsi: f(x) = 3x + 7.",
      "Hitung: f(5) = 3(5) + 7 = 15 + 7 = 22 (ribuan) = Rp 22.000,00 ✓",
    ],
    c2_graph_cap: "Grafik tarif taksi berdasarkan jarak tempuh",
    c2_yUnit: "(dalam ribuan)",
    c2_xLabel: "jarak",
    c3_soal_p: "Perhatikan gambar diagram panah berikut. Rumus fungsi diagram tersebut adalah …",
    c3_opts: [
      { kode: "A", teks: "f(x) = x + 1" },
      { kode: "B", teks: "f(x) = 2x – 1" },
      { kode: "C", teks: "f(x) = 3x – 1" },
      { kode: "D", teks: "f(x) = 4x – 2" },
    ],
    c3_steps: [
      "Misalkan rumus fungsi: f(x) = ax + b.",
      "Dari grafik, garis memotong sumbu-y di titik (0, −1)  →  f(0) = −1.",
      "Substitusi ke rumus: a(0) + b = −1  →  b = −1.",
      "Dari grafik, garis melalui titik (1, 2)  →  f(1) = 2.",
      "Substitusi ke rumus: a(1) + (−1) = 2  →  a = 3.",
      "Jadi rumus fungsinya: f(x) = 3x − 1.",
      "Verifikasi: f(1) = 3(1) − 1 = 2 ✓",
    ],
    sum_title: "📚 Rangkuman Materi",
    sum_items: [
      { icon: "📈", label: "Fungsi Linear", desc: "f(x) = ax + b menghasilkan grafik berupa garis lurus. a = kemiringan, b = titik potong sumbu-y." },
      { icon: "👁️", label: "Membaca Grafik", desc: "Dari x → tarik garis vertikal ke garis grafik → tarik horizontal → baca nilai y." },
      { icon: "🌍", label: "Konteks Nyata", desc: "Sumbu-x dan sumbu-y mewakili besaran nyata. Selalu baca satuannya sebelum menjawab!" },
      { icon: "↕️", label: "Selisih Tetap", desc: "Jika selisih nilai f(x) selalu sama, fungsinya linear. Nilai a = selisih f(x) per satuan x." },
      { icon: "🔍", label: "Mencari Rumus", desc: "Ambil dua titik dari grafik → misalkan f(x) = ax + b → substitusi → selesaikan a dan b." },
    ],
    tips_title: "💡 Tips & Trik",
    tips: [
      "Selalu cek satuan sumbu-x dan sumbu-y dulu — jangan langsung hitung tanpa tahu satuannya!",
      "Grafik naik (a > 0), grafik turun (a < 0), grafik datar/mendatar (a = 0).",
      "Untuk mencari rumus dari grafik: ambil dua titik yang jelas koordinatnya, lalu substitusi ke f(x) = ax + b.",
    ],
    concl_title: "🎯 Kesimpulan",
    concl_p: <>Grafik fungsi linear adalah <strong className="text-green-300">"peta visual"</strong> dari sebuah fungsi. Baca grafiknya dengan teliti, perhatikan <strong className="text-teal-300">satuannya</strong>, dan kamu bisa menjawab soal bahkan tanpa rumus!</>,
    discuss_label: "💡 Pembahasan:",
    correct_label: "✓ BENAR",
    wrong_label: "✗ SALAH",
    click_hint: "Klik salah satu pilihan untuk menjawab",
  },
  en: {
    badge: "Grade 8 · Relations and Functions · Math Material",
    title: "FUNCTION GRAPHS (ENRICHMENT)",
    subtitle: "Reading Linear Function Graphs in Real Life",
    backBtn: "← Back to Relations and Functions",
    sec_intro: "🌟 Linear Function Graphs in Real Life",
    sec_konsep: "📘 How to Read a Function Graph",
    sec_c1: "✏️ Example 1 — Capital vs. Profit Graph",
    sec_c2: "✏️ Example 2 — Taxi Fare Graph",
    sec_c3: "✏️ Example 3 — Finding the Formula from an Arrow Diagram",
    sec_rang: "📌 Summary & Conclusion",
    badge_read: "READING GRAPHS",
    badge_ctx: "CONTEXTUAL",
    badge_guess: "FINDING FORMULA",
    intro_p: <>The linear function <InlineMath math="f(x) = ax + b" /> produces a graph that is a <strong className="text-cyan-300">straight line</strong>. Such graphs appear frequently in real life: taxi fares, pricing, business profit, and more.</>,
    graphs: [
      { icon: "📈", judul: "Rising Graph", ket: "Coefficient a > 0, y increases as x increases" },
      { icon: "📉", judul: "Falling Graph", ket: "Coefficient a < 0, y decreases as x increases" },
      { icon: "➡️", judul: "Flat Graph", ket: "Coefficient a = 0, y stays constant (constant function)" },
    ],
    konsep_title: "🎯 Two Ways to Read a Graph",
    konsep_1_head: "① Given x → Find y (f(x))",
    konsep_1: "Draw a vertical line up from x on the x-axis until it hits the graph, then draw a horizontal line left to the y-axis. The y value read is f(x).",
    konsep_2_head: "② Given y (image) → Find x",
    konsep_2: "Draw a horizontal line from y on the y-axis, then draw a vertical line down to the x-axis. The x value read is the input being sought.",
    tips_label: "💡 Tip:",
    tips_p: "In contextual problems, note the units on both axes. Read the graph description carefully before answering!",
    c1_soal_p: <>The graph below shows the relationship between <strong className="text-cyan-300">capital</strong> (x-axis, in thousands of dollars) and <strong className="text-orange-300">profit</strong> (y-axis, in thousands of dollars) of a business!</>,
    c1_q: <>With a capital of <strong className="text-orange-300">$25,000</strong>, what is the profit earned?</>,
    c1_opts: [
      { kode: "A", teks: "$1,250" },
      { kode: "B", teks: "$1,350" },
      { kode: "C", teks: "$1,500" },
      { kode: "D", teks: "$1,750" },
    ],
    c1_steps: [
      "Find x = 25 on the x-axis of the graph.",
      "Draw a vertical line up from x = 25 until it touches the graph line.",
      "From that intersection, draw a horizontal line left to the y-axis.",
      "The value read on the y-axis = 1.25 (thousands of $).",
      "So, profit = 1.25 × $1,000 = $1,250 ✓",
    ],
    c1_graph_cap: "Graph of capital vs. profit for a business",
    c1_xLabel: "Capital",
    c1_yLabel: "Profit",
    c1_yUnit: "($ thousands)",
    c1_xUnit: "($ thousands)",
    c2_soal_p: "A taxi company charges the fare shown in the graph below (x-axis = distance in km, y-axis = fare in thousands of dollars).",
    c2_q: <>Alex will take a taxi for <strong className="text-orange-300">5 kilometers</strong>. How much will Alex pay for the taxi fare?</>,
    c2_opts: [
      { kode: "A", teks: "$18" },
      { kode: "B", teks: "$20" },
      { kode: "C", teks: "$22" },
      { kode: "D", teks: "$25" },
    ],
    c2_steps: [
      "Read two points from the graph: (2, 13) and (4, 19).",
      "Let the function formula be: f(x) = ax + b.",
      "Substitute point (2, 13): 2a + b = 13  … (1)",
      "Substitute point (4, 19): 4a + b = 19  … (2)",
      "Subtract (1) from (2): 2a = 6  →  a = 3.",
      "Substitute a = 3 into (1): 2(3) + b = 13  →  b = 7.",
      "Function formula: f(x) = 3x + 7.",
      "Calculate: f(5) = 3(5) + 7 = 15 + 7 = 22 (thousands) = $22 ✓",
    ],
    c2_graph_cap: "Graph of taxi fare based on distance traveled",
    c2_yUnit: "(in thousands)",
    c2_xLabel: "distance",
    c3_soal_p: "Look at the arrow diagram below. The function formula of this diagram is …",
    c3_opts: [
      { kode: "A", teks: "f(x) = x + 1" },
      { kode: "B", teks: "f(x) = 2x – 1" },
      { kode: "C", teks: "f(x) = 3x – 1" },
      { kode: "D", teks: "f(x) = 4x – 2" },
    ],
    c3_steps: [
      "Let the function formula be: f(x) = ax + b.",
      "From the graph, the line crosses the y-axis at (0, −1)  →  f(0) = −1.",
      "Substitute into the formula: a(0) + b = −1  →  b = −1.",
      "From the graph, the line passes through (1, 2)  →  f(1) = 2.",
      "Substitute into the formula: a(1) + (−1) = 2  →  a = 3.",
      "So the function formula is: f(x) = 3x − 1.",
      "Verify: f(1) = 3(1) − 1 = 2 ✓",
    ],
    sum_title: "📚 Material Summary",
    sum_items: [
      { icon: "📈", label: "Linear Function", desc: "f(x) = ax + b produces a straight-line graph. a = slope, b = y-intercept." },
      { icon: "👁️", label: "Reading Graphs", desc: "From x → draw vertical line to the graph → draw horizontal line → read y value." },
      { icon: "🌍", label: "Real Context", desc: "The x-axis and y-axis represent real quantities. Always check the units before answering!" },
      { icon: "↕️", label: "Constant Difference", desc: "If the difference in f(x) is always the same, the function is linear. a = difference in f(x) per unit of x." },
      { icon: "🔍", label: "Finding Formula", desc: "Take two points from the graph → assume f(x) = ax + b → substitute → solve for a and b." },
    ],
    tips_title: "💡 Tips & Tricks",
    tips: [
      "Always check the units on both axes first — don't calculate before knowing the units!",
      "Rising graph (a > 0), falling graph (a < 0), flat graph (a = 0).",
      "To find the formula from a graph: take two clear points, then substitute into f(x) = ax + b.",
    ],
    concl_title: "🎯 Conclusion",
    concl_p: <>A linear function graph is a <strong className="text-green-300">"visual map"</strong> of a function. Read it carefully, pay attention to <strong className="text-teal-300">the units</strong>, and you can answer questions even without a formula!</>,
    discuss_label: "💡 Explanation:",
    correct_label: "✓ CORRECT",
    wrong_label: "✗ WRONG",
    click_hint: "Click one of the options to answer",
  },
  ja: {
    badge: "中学2年 · 関係と関数 · 数学教材",
    title: "関数のグラフ（発展）",
    subtitle: "日常生活における一次関数のグラフを読む",
    backBtn: "← 関係と関数に戻る",
    sec_intro: "🌟 日常生活における一次関数のグラフ",
    sec_konsep: "📘 関数のグラフの読み方",
    sec_c1: "✏️ 例題 1 — 元手と利益のグラフ",
    sec_c2: "✏️ 例題 2 — タクシー料金のグラフ",
    sec_c3: "✏️ 例題 3 — 矢印図から公式を求める",
    sec_rang: "📌 まとめ・結論",
    badge_read: "グラフを読む",
    badge_ctx: "文脈問題",
    badge_guess: "公式を求める",
    intro_p: <>一次関数 <InlineMath math="f(x) = ax + b" /> のグラフは<strong className="text-cyan-300">直線</strong>になります。タクシー料金・商品価格・事業利益など日常生活でよく登場します。</>,
    graphs: [
      { icon: "📈", judul: "右上がりのグラフ", ket: "係数a > 0、xが増えるとyも増える" },
      { icon: "📉", judul: "右下がりのグラフ", ket: "係数a < 0、xが増えるとyは減る" },
      { icon: "➡️", judul: "水平なグラフ", ket: "係数a = 0、yは常に一定（定数関数）" },
    ],
    konsep_title: "🎯 グラフを読む2つの方法",
    konsep_1_head: "① xがわかっているとき → y（f(x)）を求める",
    konsep_1: "x軸の値xから垂直線を引いてグラフと交わる点を見つけ、そこからy軸へ水平線を引く。読み取ったyの値がf(x)。",
    konsep_2_head: "② y（像）がわかっているとき → xを求める",
    konsep_2: "y軸の値yから水平線を引いてグラフと交わる点を見つけ、そこからx軸へ垂直線を引く。読み取ったxの値が求めるxの値。",
    tips_label: "💡 ポイント：",
    tips_p: "文脈問題では、x軸とy軸の単位を確認しましょう。答える前にグラフの説明をよく読みましょう！",
    c1_soal_p: <>以下のグラフは、事業の<strong className="text-cyan-300">元手</strong>（x軸、単位：千ドル）と<strong className="text-orange-300">利益</strong>（y軸、単位：千ドル）の関係を示しています！</>,
    c1_q: <><strong className="text-orange-300">$25,000</strong>の元手で、利益はいくらになりますか？</>,
    c1_opts: [
      { kode: "A", teks: "$1,250" },
      { kode: "B", teks: "$1,350" },
      { kode: "C", teks: "$1,500" },
      { kode: "D", teks: "$1,750" },
    ],
    c1_steps: [
      "グラフのx軸でx = 25を見つける。",
      "x = 25から垂直線を引きグラフ上の点と交わらせる。",
      "その交点からy軸へ水平線を引く。",
      "y軸で読み取った値 = 1.25（千ドル）。",
      "よって、利益 = 1.25 × $1,000 = $1,250 ✓",
    ],
    c1_graph_cap: "事業の元手と利益の関係グラフ",
    c1_xLabel: "元手",
    c1_yLabel: "利益",
    c1_yUnit: "（千$）",
    c1_xUnit: "（千$）",
    c2_soal_p: "あるタクシー会社が以下のグラフのような料金を設定しています（x軸 = 走行距離（km）、y軸 = 料金（千ドル））。",
    c2_q: <><strong className="text-orange-300">5キロメートル</strong>のタクシー料金はいくらですか？</>,
    c2_opts: [
      { kode: "A", teks: "$18" },
      { kode: "B", teks: "$20" },
      { kode: "C", teks: "$22" },
      { kode: "D", teks: "$25" },
    ],
    c2_steps: [
      "グラフから2点を読み取る：(2, 13) と (4, 19)。",
      "関数の公式をf(x) = ax + bとおく。",
      "点(2, 13)を代入：2a + b = 13  … (1)",
      "点(4, 19)を代入：4a + b = 19  … (2)",
      "(2) − (1)：2a = 6  →  a = 3。",
      "a = 3を(1)に代入：2(3) + b = 13  →  b = 7。",
      "関数の公式：f(x) = 3x + 7。",
      "計算：f(5) = 3(5) + 7 = 15 + 7 = 22（千） = $22 ✓",
    ],
    c2_graph_cap: "走行距離に基づくタクシー料金グラフ",
    c2_yUnit: "（千単位）",
    c2_xLabel: "距離",
    c3_soal_p: "以下の矢印図を見てください。この図の関数の公式は何ですか？",
    c3_opts: [
      { kode: "A", teks: "f(x) = x + 1" },
      { kode: "B", teks: "f(x) = 2x – 1" },
      { kode: "C", teks: "f(x) = 3x – 1" },
      { kode: "D", teks: "f(x) = 4x – 2" },
    ],
    c3_steps: [
      "関数の公式をf(x) = ax + bとおく。",
      "グラフより、直線はy軸と(0, −1)で交わる  →  f(0) = −1。",
      "公式に代入：a(0) + b = −1  →  b = −1。",
      "グラフより、直線は点(1, 2)を通る  →  f(1) = 2。",
      "公式に代入：a(1) + (−1) = 2  →  a = 3。",
      "よって、関数の公式：f(x) = 3x − 1。",
      "確認：f(1) = 3(1) − 1 = 2 ✓",
    ],
    sum_title: "📚 学習内容のまとめ",
    sum_items: [
      { icon: "📈", label: "一次関数", desc: "f(x) = ax + b のグラフは直線。a = 傾き、b = y切片。" },
      { icon: "👁️", label: "グラフを読む", desc: "xからグラフへ垂直線 → 水平線 → yの値を読み取る。" },
      { icon: "🌍", label: "現実の文脈", desc: "x軸とy軸は現実の量を表す。答える前に必ず単位を確認！" },
      { icon: "↕️", label: "差が一定", desc: "f(x)の差が常に一定なら一次関数。a = xが1増えるときのf(x)の変化量。" },
      { icon: "🔍", label: "公式を求める", desc: "グラフから2点を取る → f(x) = ax + b と仮定 → 代入 → a と b を解く。" },
    ],
    tips_title: "💡 コツ・ポイント",
    tips: [
      "まずx軸とy軸の単位を確認しよう — 単位を知らずに計算しないこと！",
      "右上がり(a > 0)、右下がり(a < 0)、水平(a = 0)。",
      "グラフから公式を求める：2点を取りf(x) = ax + bに代入してaとbを解く。",
    ],
    concl_title: "🎯 結論",
    concl_p: <>一次関数のグラフは関数の<strong className="text-green-300">「視覚的な地図」</strong>です。グラフをよく読み、<strong className="text-teal-300">単位</strong>に注意すれば、公式なしでも問題に答えられます！</>,
    discuss_label: "💡 解説：",
    correct_label: "✓ 正解",
    wrong_label: "✗ 不正解",
    click_hint: "選択肢をクリックして答えてください",
  },
} as const;

const GrafikFungsiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isSp = theme === "dark";
  const sc = {
    grid:    isSp ? "#1e293b" : "rgba(0,0,0,0.09)",
    axis:    isSp ? "#475569" : "#94a3b8",
    arrow:   isSp ? "#475569" : "#94a3b8",
    label:   isSp ? "#94a3b8" : "#475569",
    tick:    isSp ? "#64748b" : "#374151",
    caption: isSp ? "text-white/40" : "text-gray-500",
  };
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const pilihJawaban = (soal: string, opsi: string) => {
    playPopSound();
    setJawaban((prev) => ({ ...prev, [soal]: opsi }));
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const PilihanGanda = ({
    soal, opsi, kunci, pembahasanSteps, autoShow = false
  }: {
    soal: string;
    opsi: { kode: string; teks: string }[];
    kunci: string;
    pembahasanSteps?: string[];
    autoShow?: boolean;
  }) => {
    const dipilih = autoShow ? kunci : jawaban[soal];
    const sudahJawab = autoShow || !!dipilih;
    return (
      <div className="space-y-2">
        {opsi.map(({ kode, teks }) => {
          const benar = kode === kunci;
          const dipilihIni = dipilih === kode;
          let cls = "border rounded-lg px-4 py-2.5 text-sm font-body transition-all flex items-center gap-3 ";
          if (!sudahJawab) {
            cls += "cursor-pointer border-white/20 text-white/80 hover:border-cyan-400/60 hover:bg-cyan-900/20";
          } else if (benar) {
            cls += "border-green-500 bg-green-900/30 text-green-300 font-semibold cursor-default";
          } else {
            cls += "border-white/10 text-white/40 cursor-default";
          }
          return (
            <button key={kode} onClick={() => !sudahJawab && pilihJawaban(soal, kode)} className={cls} disabled={sudahJawab}>
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${benar && sudahJawab ? "border-green-400 bg-green-500/30 text-green-300" : sudahJawab && dipilihIni ? "border-red-400 bg-red-500/20 text-red-300" : "border-white/30 text-white/50"}`}>{kode}</span>
              {teks}
              {sudahJawab && benar && <span className="ml-auto text-green-400 text-xs font-bold">{t.correct_label}</span>}
              {sudahJawab && dipilihIni && !benar && <span className="ml-auto text-red-400 text-xs font-bold">{t.wrong_label}</span>}
            </button>
          );
        })}
        {sudahJawab && (
          <div className="rounded-lg p-3 text-xs font-body mt-1 bg-green-900/20 border border-green-500/40 text-green-200 space-y-1">
            <p className="font-bold text-green-300 mb-2">{t.discuss_label}</p>
            {pembahasanSteps && (
              <ol className="space-y-1.5 list-none">
                {pembahasanSteps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-green-700/60 text-green-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
        {!sudahJawab && (
          <p className="text-xs text-white/30 text-center font-body pt-1">{t.click_hint}</p>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.subtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.badge}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_intro} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.intro_p}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                  {[
                    { ...t.graphs[0], color: "bg-green-900/30 border-green-500/30 text-green-200" },
                    { ...t.graphs[1], color: "bg-red-900/30 border-red-500/30 text-red-200" },
                    { ...t.graphs[2], color: "bg-slate-700/50 border-white/20 text-white/60" },
                  ].map(({ icon, judul, ket, color }) => (
                    <div key={judul} className={`border ${color} rounded-lg p-3`}>
                      <p className="font-bold mb-1">{icon} {judul}</p>
                      <p className="text-white/60 leading-relaxed">{ket}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KONSEP MEMBACA GRAFIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec_konsep} />
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.konsep_title}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">{t.konsep_1_head}</p>
                      <p className="text-white/70 text-xs leading-relaxed">{t.konsep_1}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">{t.konsep_2_head}</p>
                      <p className="text-white/70 text-xs leading-relaxed">{t.konsep_2}</p>
                    </div>
                  </div>
                </div>
                {/* Ilustrasi 1 */}
                <div className={`border rounded-xl p-4 ${isSp ? "bg-slate-900/60 border-cyan-500/20" : "bg-cyan-50/60 border-cyan-300/50"}`}>
                  <p className={`font-body text-xs font-bold mb-1 text-center ${isSp ? "text-cyan-300" : "text-cyan-700"}`}>{t.graph1_title}</p>
                  <p className={`font-body text-xs mb-3 text-center ${sc.caption}`}>{t.graph1_sub}</p>
                  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto">
                    {[1,2,3,4].map(v => (
                      <line key={"gx"+v} x1={40+v*45} y1={20} x2={40+v*45} y2={175} stroke={sc.grid} strokeWidth="1" />
                    ))}
                    {[1,2,3,4,5,6].map(v => (
                      <line key={"gy"+v} x1={40} y1={175-v*25.83} x2={225} y2={175-v*25.83} stroke={sc.grid} strokeWidth="1" />
                    ))}
                    <line x1={40} y1={15} x2={40} y2={180} stroke={sc.axis} strokeWidth="1.5" />
                    <line x1={35} y1={175} x2={230} y2={175} stroke={sc.axis} strokeWidth="1.5" />
                    <polygon points="230,172 230,178 237,175" fill={sc.arrow} />
                    <polygon points="37,15 43,15 40,8" fill={sc.arrow} />
                    <text x={240} y={179} fill={sc.label} fontSize="9">x</text>
                    <text x={44} y={13} fill={sc.label} fontSize="9">y</text>
                    {[1,2,3,4].map(v => (
                      <text key={v} x={40+v*45-3} y={189} fill={sc.tick} fontSize="8">{v}</text>
                    ))}
                    <text x={33} y={189} fill={sc.tick} fontSize="8">0</text>
                    {[1,2,3,4,5,6].map(v => (
                      <text key={v} x={28} y={175-v*25.83+3} fill={sc.tick} fontSize="8">{v}</text>
                    ))}
                    <line x1={40} y1={149} x2={220} y2={46} stroke="#22d3ee" strokeWidth="2.5" />
                    <line x1={175} y1={175} x2={175} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <line x1={40} y1={72} x2={175} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <circle cx={175} cy={72} r="5" fill="#fb923c" stroke="#fdba74" strokeWidth="1.5" />
                    <text x={179} y={69} fill="#fb923c" fontSize="9" fontWeight="bold">(3, 4)</text>
                    <text x={170} y={189} fill="#fb923c" fontSize="8" fontWeight="bold">3</text>
                    <text x={20} y={75} fill="#fb923c" fontSize="8" fontWeight="bold">4</text>
                    <circle cx={40} cy={149} r="4" fill="#22d3ee" opacity="0.7" />
                    <text x={44} y={146} fill={sc.label} fontSize="8">(0,1)</text>
                  </svg>
                </div>

                {/* Ilustrasi 2 */}
                <div className={`border rounded-xl p-4 ${isSp ? "bg-slate-900/60 border-violet-500/20" : "bg-violet-50/60 border-violet-300/50"}`}>
                  <p className={`font-body text-xs font-bold mb-1 text-center ${isSp ? "text-violet-300" : "text-violet-700"}`}>{t.graph2_title}</p>
                  <p className={`font-body text-xs mb-3 text-center ${sc.caption}`}>{t.graph2_sub}</p>
                  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto">
                    {[1,2,3].map(v => (
                      <line key={"gx"+v} x1={40+v*60} y1={20} x2={40+v*60} y2={175} stroke={sc.grid} strokeWidth="1" />
                    ))}
                    {[1,2,3,4,5,6].map(v => (
                      <line key={"gy"+v} x1={40} y1={175-v*25.83} x2={225} y2={175-v*25.83} stroke={sc.grid} strokeWidth="1" />
                    ))}
                    <line x1={40} y1={15} x2={40} y2={180} stroke={sc.axis} strokeWidth="1.5" />
                    <line x1={35} y1={175} x2={230} y2={175} stroke={sc.axis} strokeWidth="1.5" />
                    <polygon points="230,172 230,178 237,175" fill={sc.arrow} />
                    <polygon points="37,15 43,15 40,8" fill={sc.arrow} />
                    <text x={240} y={179} fill={sc.label} fontSize="9">x</text>
                    <text x={44} y={13} fill={sc.label} fontSize="9">y</text>
                    {[1,2,3].map(v => (
                      <text key={v} x={40+v*60-3} y={189} fill={sc.tick} fontSize="8">{v}</text>
                    ))}
                    <text x={33} y={189} fill={sc.tick} fontSize="8">0</text>
                    {[1,2,3,4,5,6].map(v => (
                      <text key={v} x={28} y={175-v*25.83+3} fill={sc.tick} fontSize="8">{v}</text>
                    ))}
                    <line x1={40} y1={175} x2={220} y2={20} stroke="#a78bfa" strokeWidth="2.5" />
                    <line x1={160} y1={175} x2={160} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <line x1={40} y1={72} x2={160} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <circle cx={160} cy={72} r="5" fill="#fb923c" stroke="#fdba74" strokeWidth="1.5" />
                    <text x={164} y={69} fill="#fb923c" fontSize="9" fontWeight="bold">(2, 4)</text>
                    <text x={155} y={189} fill="#fb923c" fontSize="8" fontWeight="bold">2</text>
                    <text x={20} y={75} fill="#fb923c" fontSize="8" fontWeight="bold">4</text>
                    <circle cx={40} cy={175} r="4" fill="#a78bfa" opacity="0.7" />
                    <text x={44} y={172} fill={sc.label} fontSize="8">(0,0)</text>
                  </svg>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.tips_label}</strong> {t.tips_p}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 — MODAL VS UNTUNG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.sec_c1} />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_read} color="bg-green-700/60 text-green-200" />
                <div className={`border rounded-xl p-4 ${isSp ? "bg-slate-800/60 border-green-500/30" : "bg-green-50/70 border-green-300"}`}>
                  <p className={`font-body text-sm font-semibold mb-3 ${isSp ? "text-green-300" : "text-green-700"}`}>📝 {language === "id" ? "Soal" : language === "en" ? "Problem" : "問題"}</p>
                  <p className={`font-body text-sm leading-relaxed mb-4 ${isSp ? "text-white/85" : "text-gray-700"}`}>{t.c1_soal_p}</p>
                  <div className={`border rounded-xl p-4 ${isSp ? "bg-slate-900/70 border-green-500/20" : "bg-white border-green-200"}`}>
                    <svg viewBox="0 0 310 220" className="w-full max-w-sm mx-auto">
                      {[1,2,3,4,5].map(i => (
                        <g key={i}>
                          <line x1={65+i*40} y1={15} x2={65+i*40} y2={175} stroke={sc.grid} strokeWidth="1" />
                          <line x1={65} y1={175-i*30} x2={270} y2={175-i*30} stroke={sc.grid} strokeWidth="1" />
                        </g>
                      ))}
                      <line x1={65} y1={15} x2={65} y2={180} stroke={sc.axis} strokeWidth="1.5" />
                      <line x1={60} y1={175} x2={275} y2={175} stroke={sc.axis} strokeWidth="1.5" />
                      <polygon points="275,172 275,178 282,175" fill={sc.arrow} />
                      <polygon points="62,15 68,15 65,8" fill={sc.arrow} />
                      <text x={283} y={179} fill={sc.label} fontSize="9">{t.c1_xLabel}</text>
                      <text x={2} y={9} fill={sc.label} fontSize="8">{t.c1_yLabel}</text>
                      <text x={2} y={17} fill={sc.label} fontSize="8">{t.c1_yUnit}</text>
                      {[10,20,30,40,50].map((v,i) => (
                        <text key={v} x={65+(i+1)*40-7} y={190} fill={sc.tick} fontSize="8">{v}</text>
                      ))}
                      {[0.5,1.0,1.5,2.0,2.5].map((v,i) => (
                        <text key={v} x={18} y={175-(i+1)*30+3} fill={sc.tick} fontSize="8">{v}</text>
                      ))}
                      <text x={49} y={179} fill={sc.tick} fontSize="8">0</text>
                      <text x={150} y={207} fill={sc.label} fontSize="8">{t.c1_xUnit}</text>
                      <line x1={65} y1={175} x2={265} y2={25} stroke="#4ade80" strokeWidth="2.5" />
                      {[[10,0.5],[20,1.0],[30,1.5],[40,2.0],[50,2.5]].map(([x,y]) => (
                        <circle key={x} cx={65+x*4} cy={175-y*60} r="4" fill="#4ade80" stroke="#86efac" strokeWidth="1.5" />
                      ))}
                      <line x1={165} y1={175} x2={165} y2={100} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5,3" />
                      <line x1={65} y1={100} x2={165} y2={100} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5,3" />
                      <circle cx={165} cy={100} r="5" fill="#f97316" stroke="#fdba74" strokeWidth="1.5" />
                      <text x={155} y={191} fill="#f97316" fontSize="9" fontWeight="bold">25</text>
                    </svg>
                    <p className={`text-xs text-center mt-1 font-body ${sc.caption}`}>{t.c1_graph_cap}</p>
                  </div>
                  <p className={`font-body text-sm mt-4 ${isSp ? "text-white/85" : "text-gray-700"}`}>{t.c1_q}</p>
                </div>
                <PilihanGanda
                  autoShow
                  soal="c1"
                  opsi={t.c1_opts}
                  kunci="A"
                  pembahasanSteps={t.c1_steps}
                />
              </div>
            )}
          </div>

          {/* CONTOH 2 — TARIF TAKSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_c2} />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_ctx} color="bg-yellow-700/60 text-yellow-200" />
                <div className={`border rounded-xl p-4 ${isSp ? "bg-slate-800/60 border-yellow-500/30" : "bg-yellow-50/70 border-yellow-300"}`}>
                  <p className={`font-body text-sm font-semibold mb-3 ${isSp ? "text-yellow-300" : "text-yellow-700"}`}>📝 {language === "id" ? "Soal" : language === "en" ? "Problem" : "問題"}</p>
                  <p className={`font-body text-sm leading-relaxed mb-4 ${isSp ? "text-white/85" : "text-gray-700"}`}>{t.c2_soal_p}</p>
                  <div className={`border rounded-xl p-4 ${isSp ? "bg-transparent border-yellow-500/20" : "bg-white border-yellow-200"}`}>
                    <svg viewBox="0 0 320 240" className="w-full max-w-sm mx-auto">
                      {[0,5,10,15,20,25,30].map((v) => {
                        const yPx = 195 - v * (170/30);
                        return <line key={v} x1={70} y1={yPx} x2={250} y2={yPx} stroke={sc.grid} strokeWidth="0.8" />;
                      })}
                      <line x1={70} y1={20} x2={70} y2={198} stroke={sc.axis} strokeWidth="1.5" />
                      <line x1={67} y1={195} x2={260} y2={195} stroke={sc.axis} strokeWidth="1.5" />
                      {[0,5,10,15,20,25,30].map((v) => {
                        const yPx = 195 - v * (170/30);
                        return (
                          <text key={v} x={58} y={yPx + 3} fill={sc.tick} fontSize="9" textAnchor="end">{v}</text>
                        );
                      })}
                      <text x={72} y={16} fill={sc.label} fontSize="8">{t.c2_yUnit}</text>
                      {[2,4,6].map((v) => {
                        const xPx = 70 + v * 25;
                        return (
                          <text key={v} x={xPx} y={210} fill={sc.tick} fontSize="9" textAnchor="middle">{v}</text>
                        );
                      })}
                      {[2,4,6].map((v) => {
                        const xPx = 70 + v * 25;
                        return <line key={v} x1={xPx} y1={195} x2={xPx} y2={200} stroke={sc.axis} strokeWidth="1" />;
                      })}
                      <polyline
                        points="120,121 170,87 220,53"
                        fill="none" stroke="#3b82f6" strokeWidth="2"
                      />
                      {([[120,121,13],[170,87,19],[220,53,25]] as [number,number,number][]).map(([cx,cy,label]) => (
                        <g key={cx}>
                          <polygon
                            points={`${cx},${cy-6} ${cx+6},${cy} ${cx},${cy+6} ${cx-6},${cy}`}
                            fill="#3b82f6" stroke={isSp ? "#e2e8f0" : "#1d4ed8"} strokeWidth="1"
                          />
                          <text x={cx+9} y={cy+4} fill={isSp ? "#f1f5f9" : "#1e3a8a"} fontSize="10" fontWeight="bold">{label}</text>
                        </g>
                      ))}
                      <polygon points="270,60 276,66 270,72 264,66" fill="#3b82f6" stroke={isSp ? "white" : "#1d4ed8"} strokeWidth="1" />
                      <line x1={258} y1={66} x2={282} y2={66} stroke="#3b82f6" strokeWidth="1.5" />
                      <text x={285} y={70} fill={sc.label} fontSize="9">{t.c2_xLabel}</text>
                      <line x1={195} y1={195} x2={195} y2={70} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" />
                      <line x1={70} y1={70} x2={195} y2={70} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" />
                      <circle cx={195} cy={70} r="5" fill="#f97316" stroke="#fdba74" strokeWidth="1.5" />
                      <text x={192} y={210} fill="#f97316" fontSize="9" fontWeight="bold" textAnchor="middle">5</text>
                    </svg>
                    <p className={`text-xs text-center mt-1 font-body ${sc.caption}`}>{t.c2_graph_cap}</p>
                  </div>
                  <p className={`font-body text-sm mt-4 ${isSp ? "text-white/85" : "text-gray-700"}`}>{t.c2_q}</p>
                </div>
                <PilihanGanda
                  autoShow
                  soal="c2"
                  opsi={t.c2_opts}
                  kunci="C"
                  pembahasanSteps={t.c2_steps}
                />
              </div>
            )}
          </div>

          {/* CONTOH 3 — DIAGRAM PANAH KE RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title={t.sec_c3} />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_guess} color="bg-purple-700/60 text-purple-200" />
                <div className={`border rounded-xl p-4 ${isSp ? "bg-slate-800/60 border-purple-500/30" : "bg-purple-50/70 border-purple-300"}`}>
                  <p className={`font-body text-sm font-semibold mb-3 ${isSp ? "text-purple-300" : "text-purple-700"}`}>📝 {language === "id" ? "Soal" : language === "en" ? "Problem" : "問題"}</p>
                  <p className={`font-body text-sm leading-relaxed mb-4 ${isSp ? "text-white/85" : "text-gray-700"}`}>{t.c3_soal_p}</p>
                  <div className={`border rounded-xl p-4 ${isSp ? "bg-slate-900/70 border-purple-500/20" : "bg-white border-purple-200"}`}>
                    <svg viewBox="0 0 180 200" className="w-full max-w-[200px] mx-auto">
                      <defs>
                        <marker id="axArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0,0 6,3 0,6" fill="#94a3b8" />
                        </marker>
                        <marker id="axArrRev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
                          <polygon points="0,0 6,3 0,6" fill="#94a3b8" />
                        </marker>
                        <marker id="lineArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0,0 6,3 0,6" fill="#a78bfa" />
                        </marker>
                        <marker id="lineArrRev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
                          <polygon points="0,0 6,3 0,6" fill="#a78bfa" />
                        </marker>
                      </defs>
                      <line x1={15} y1={125} x2={163} y2={125}
                        stroke="#94a3b8" strokeWidth="1.5"
                        markerEnd="url(#axArr)" markerStart="url(#axArrRev)" />
                      <line x1={80} y1={190} x2={80} y2={12}
                        stroke="#94a3b8" strokeWidth="1.5"
                        markerEnd="url(#axArr)" markerStart="url(#axArrRev)" />
                      <line x1={118} y1={121} x2={118} y2={129} stroke={sc.axis} strokeWidth="1.2" />
                      <text x={114} y={141} fill={sc.tick} fontSize="13" fontWeight="bold">1</text>
                      <line x1={76} y1={49} x2={84} y2={49} stroke={sc.axis} strokeWidth="1.2" />
                      <text x={60} y={53} fill={sc.tick} fontSize="13" fontWeight="bold">2</text>
                      <line x1={76} y1={163} x2={84} y2={163} stroke={sc.axis} strokeWidth="1.2" />
                      <text x={44} y={167} fill={sc.tick} fontSize="12" fontWeight="bold">-1</text>
                      <line x1={118} y1={125} x2={118} y2={49}
                        stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="4,3" />
                      <line x1={80} y1={49} x2={118} y2={49}
                        stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="4,3" />
                      <line x1={72} y1={188} x2={130} y2={14}
                        stroke="#a78bfa" strokeWidth="2"
                        markerEnd="url(#lineArr)" markerStart="url(#lineArrRev)" />
                    </svg>
                  </div>
                </div>
                <PilihanGanda
                  autoShow
                  soal="c3"
                  opsi={t.c3_opts}
                  kunci="C"
                  pembahasanSteps={t.c3_steps}
                />
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_rang} />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-6 space-y-4">
                <p className={`font-display text-xs font-bold uppercase tracking-wider pt-1 ${isSp ? "text-green-300" : "text-green-700"}`}>{t.sum_title}</p>
                <div className="grid grid-cols-1 gap-2">
                  {(isSp ? [
                    { ...t.sum_items[0], color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
                    { ...t.sum_items[1], color: "from-teal-900/60 to-cyan-900/60 border-teal-500/40 text-teal-300" },
                    { ...t.sum_items[2], color: "from-blue-900/60 to-indigo-900/60 border-blue-500/40 text-blue-300" },
                    { ...t.sum_items[3], color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
                    { ...t.sum_items[4], color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
                  ] : [
                    { ...t.sum_items[0], color: "from-green-50 to-emerald-50 border-green-200 text-green-700" },
                    { ...t.sum_items[1], color: "from-teal-50 to-cyan-50 border-teal-200 text-teal-700" },
                    { ...t.sum_items[2], color: "from-blue-50 to-indigo-50 border-blue-200 text-blue-700" },
                    { ...t.sum_items[3], color: "from-violet-50 to-purple-50 border-violet-200 text-violet-700" },
                    { ...t.sum_items[4], color: "from-orange-50 to-amber-50 border-orange-200 text-orange-700" },
                  ]).map(({ icon, label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className={`font-body text-xs leading-relaxed ${isSp ? "text-white/80" : "text-gray-600"}`}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`border rounded-xl p-4 ${isSp ? "bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-500/40" : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"}`}>
                  <p className={`font-display text-xs font-bold uppercase tracking-wider mb-3 ${isSp ? "text-amber-300" : "text-amber-700"}`}>{t.tips_title}</p>
                  <div className="space-y-2">
                    {t.tips.map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${isSp ? "bg-amber-500/30 text-amber-200" : "bg-amber-200 text-amber-800"}`}>{i + 1}</span>
                        <p className={`font-body text-xs leading-relaxed ${isSp ? "text-amber-100/90" : "text-amber-800"}`}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`border rounded-xl p-4 ${isSp ? "bg-gradient-to-r from-green-900/60 to-teal-900/60 border-green-400/40" : "bg-gradient-to-r from-green-50 to-teal-50 border-green-200"}`}>
                  <p className={`font-display text-xs font-bold uppercase tracking-wider mb-2 ${isSp ? "text-green-300" : "text-green-700"}`}>{t.concl_title}</p>
                  <p className={`font-body text-sm leading-relaxed ${isSp ? "text-white/90" : "text-gray-700"}`}>{t.concl_p}</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikFungsiPage;
