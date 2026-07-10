import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, Layers, TrendingUp } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import GeoGebraGrapher from "@/components/GeoGebraGrapher";
import EquasiGarisLurusAnim from "@/components/EquasiGarisLurusAnim";
import { useLanguage } from "@/contexts/LanguageContext";

const T_GRAFIK = {
  id: {
    title: "GRAFIK PERSAMAAN GARIS LURUS",
    subtitle: "Gambar Garis Lurus di Bidang Koordinat!",
    breadcrumb: "Kelas 8 · Persamaan Garis Lurus · Materi Matematika",
    sh_intro: "🌟 Garis Lurus — Ada di Mana-mana!",
    sh_konsep: "📘 Bentuk Umum Persamaan Garis Lurus",
    sh_titikpotong: "📌 Menggambar Grafik Persamaan Garis dengan 2 Titik Potong Sumbu X dan Sumbu Y",
    sh_titikacak: "📐 Cara Menggambar Persamaan Garis dengan Menggunakan Dua Titik Acak",
    sh_contoh1: "✏️ Contoh 1 — Tingkat Mudah",
    sh_contoh2: "✏️ Contoh 2 — Tingkat Sedang",
    sh_contoh3: "✏️ Contoh 3 — Tingkat Sulit",
    sh_rangkuman: "📌 Rangkuman",
    back: "← Kembali ke Persamaan Garis Lurus",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT",
    prev: "← Sebelumnya", next: "Selanjutnya →", repeat: "🔄 Ulangi",
    soal: "📝 Soal", pem: "💡 Pembahasan",
    intro_hook: "Rel kereta api, pinggir buku, garis horizon pantai — semuanya membentuk garis lurus. Dalam matematika, persamaan garis lurus mendeskripsikan semua garis tersebut dengan sebuah persamaan sederhana yang melibatkan variabel",
    intro_fig_cap: "Garis horizon di lautan — contoh nyata garis lurus yang dapat dideskripsikan dengan persamaan matematika.",
    intro_img_alt: "Garis horizon laut sebagai contoh nyata garis lurus",
    intro_img_src: "Sumber gambar",
    intro_vis_title: "📈 Visual dari Grafik Persamaan Garis",
    intro_panel_descs: ["Naik ke kanan", "Turun ke kanan", "Horizontal", "Vertikal"],
    intro_p1: "Persamaan garis lurus merupakan salah satu konsep paling fundamental dalam matematika. Kita bisa menemukannya di mana-mana dalam kehidupan nyata.",
    intro_examples: [
      ["🛣️ Jalan tol yang lurus", "Memodelkan garis lurus"],
      ["📈 Grafik pertumbuhan ekonomi", "Menunjukkan tren linear"],
      ["🏗️ Konstruksi bangunan", "Arsitektur berbasis garis lurus"],
      ["🚗 Kecepatan konstan", "Hubungan jarak-waktu linear"],
    ],
    intro_funfact: "💡 Fun fact: Setiap persamaan linear (pangkat satu) pasti menghasilkan grafik garis lurus. Sebaliknya, setiap garis lurus bisa ditulis sebagai persamaan linear!",
    konsep_summary: "🎯 Ringkasan Intisari",
    konsep_p1: "Ada tiga bentuk utama persamaan garis lurus yang sering digunakan:",
    konsep_forms: [
      { nama: "Bentuk Slope-Intercept", ket: "m = gradien, c = titik potong sumbu-y" },
      { nama: "Bentuk Umum", ket: "a, b, c = konstanta bilangan real" },
      { nama: "Bentuk Intersep", ket: "a = titik potong sb-x, b = titik potong sb-y" },
    ],
    konsep_anat: "🔬 Anatomi Persamaan y = mx + c",
    konsep_m: "Gradien/kemiringan",
    konsep_c: "Titik potong sb-y",
    konsep_tabel_h: ["Persamaan", "Gradien (m)", "Potong sb-x", "Potong sb-y (c)", "Arah"],
    konsep_tabel_rows: [
      ["y = 3x + 2", "3", "(-⅔, 0)", "(0, 2)", "↗ Naik"],
      ["y = -2x + 5", "-2", "(5/2, 0)", "(0, 5)", "↘ Turun"],
      ["x = -5", "∞ tak hingga", "(-5, 0)", "—", "↕ Vertikal"],
      ["y = 4", "0", "—", "(0, 4)", "→ Horizontal"],
    ],
    konsep_ciri: "Ciri Khas Persamaan Garis Lurus",
    konsep_ciri_sub: "Berlaku untuk semua bentuk persamaan garis",
    konsep_from: "Dari ketiga bentuk ini…",
    konsep_forms3: [
      { nama: "Lereng-Intersep" },
      { nama: "Bentuk Umum" },
      { nama: "Bentuk Intersep" },
    ],
    titikpotong_p1: "Cara termudah menggambar garis lurus adalah dengan mencari dua titik istimewa: titik potong sumbu-x (saat y = 0) dan titik potong sumbu-y (saat x = 0). Hubungkan dua titik ini, dan kamu mendapat grafik yang akurat!",
    titikpotong_steps: [
      { label: "Cari Titik Potong Sumbu X", desc: "Substitusi y = 0, selesaikan untuk x" },
      { label: "Cari Titik Potong Sumbu Y", desc: "Substitusi x = 0, selesaikan untuk y" },
      { label: "Plot Titik Pertama", desc: "Tandai titik potong sumbu-x di koordinat" },
      { label: "Plot Titik Kedua & Hubungkan", desc: "Tandai titik potong sumbu-y, lalu tarik garis" },
    ],
    titikacak_p1: "Jika titik potong sumbu sulit dihitung (atau keduanya di titik yang sama), gunakan dua titik acak. Pilih sembarang nilai x, hitung y-nya, plot, dan hubungkan!",
    titikacak_steps: [
      { label: "Pilih x₁ Sembarang", desc: "Misalnya x = 0, hitung y₁" },
      { label: "Pilih x₂ Berbeda", desc: "Misalnya x = 3, hitung y₂" },
      { label: "Plot Titik Pertama", desc: "Tandai (x₁, y₁) di koordinat" },
      { label: "Plot & Hubungkan", desc: "Tandai (x₂, y₂), lalu tarik garis" },
    ],
    mcq1_soal: "Perhatikan grafik berikut! Persamaan garis yang digambarkan pada grafik di bawah ini adalah…",
    mcq1_benar: "✅ Benar! Grafik tersebut merupakan garis y = x + 2.",
    mcq1_salah: "❌ Jawaban kurang tepat. Perhatikan titik-titik yang ditandai pada grafik dan coba lagi!",
    mcq1_retry: "Coba lagi",
    mcq1_lihat: "▼ Lihat Pembahasan",
    mcq1_tutup: "▲ Sembunyikan Pembahasan",
    mcq1_pem_title: "💡 Pembahasan:",
    mcq1_pem: "Dari grafik, garis melewati titik (−2, 0) dan (0, 2).",
    mcq1_pem_m: "Gradien = (2−0)/(0−(−2)) = 2/2 = 1",
    mcq1_pem_c: "Titik potong sb-y = (0, 2) → c = 2",
    mcq1_pem_ans: "✅ Persamaan: y = 1·x + 2 = x + 2",
    c1_soal: "Gambarlah grafik garis dengan persamaan 2x + y − 4 = 0!",
    c1_l1: "Langkah 1 — Cari titik potong sumbu x (y = 0):",
    c1_l2: "Langkah 2 — Cari titik potong sumbu y (x = 0):",
    c1_l3: "Langkah 3 — Plot titik dan hubungkan:",
    c1_vis: "Grafik 2x + y − 4 = 0:",
    c1_ans: "✅ Garis melalui (2, 0) dan (0, 4). Hubungkan kedua titik untuk mendapat grafik!",
    c2_soal: "Gambarlah grafik garis y = ⅔x − 1!",
    c2_l1: "Langkah 1 — Buat tabel nilai:",
    c2_l2: "Langkah 2 — Plot titik-titik:",
    c2_l3: "Langkah 3 — Hubungkan titik-titik:",
    c2_vis: "Grafik y = ⅔x − 1:",
    c2_ans: "✅ Gambar garis yang melewati semua titik yang sudah diplot!",
    c3_soal: "Gambarlah grafik garis 3x − 2y + 6 = 0, kemudian tentukan gradien dan titik potong sumbu!",
    c3_l1: "Langkah 1 — Ubah ke bentuk y = mx + c:",
    c3_l2: "Langkah 2 — Cari titik potong:",
    c3_l3: "Langkah 3 — Gambarlah grafik:",
    c3_vis: "Grafik 3x − 2y + 6 = 0:",
    c3_ans: "✅ Gradien m = 3/2, potong sb-x di (−2, 0), potong sb-y di (0, 3)",
    rang_items: [
      "Cara termudah: cari titik potong sumbu-x (y=0) dan sumbu-y (x=0), lalu hubungkan",
      "Cara alternatif: pilih 2 nilai x sembarang, hitung y, plot, hubungkan",
      "Periksa gradien dari persamaan untuk memastikan kemiringan garis benar",
      "Gunakan minimal 3 titik untuk akurasi yang lebih baik",
    ],
    rang_tip: "💡 Tips: Selalu periksa dengan mensubstitusi titik ke persamaan asal untuk memastikan kebenaran grafik!",
    ex_label1: "Contoh 1",
    ex_label2: "Contoh 2",
    konsep_key_title: "✦ Kunci Utama ✦",
    konsep_key_dan: "dan",
    konsep_key_pow: "hanya berpangkat",
    konsep_key_no: "Tidak ada x², y², xy, √x, atau pangkat lainnya.",
    konsep_key_no2: "Selama x dan y berpangkat 1, grafiknya",
    konsep_key_pasti: "pasti garis lurus",
    konsep_key_check: "Cara cepat mengecek:",
    konsep_key_check_b: "Lihat pangkat semua x dan y di persamaannya. Kalau",
    konsep_key_check_em: "semuanya pangkat 1",
    konsep_key_check_cond: "(tidak ada kuadrat, akar, atau pangkat negatif) →",
    konsep_key_check_concl: "itu pasti persamaan garis lurus!",
    konsep_explore_title: "Eksplorasi Lebih Lanjut",
    konsep_explore_p1a: "Kamu sudah melihat bagaimana berbagai persamaan menghasilkan bentuk kurva yang berbeda-beda — ada yang berupa",
    konsep_explore_kw1: "garis lurus",
    konsep_explore_kw2: "parabola",
    konsep_explore_kw3: "hiperbola",
    konsep_explore_p1b: ", dan lainnya.",
    konsep_explore_p2a: "Untuk lebih jelas memahami dan membandingkan berbagai jenis kurva tersebut, kamu bisa",
    konsep_explore_p2b: "menginput langsung persamaan apa saja",
    konsep_explore_p2c: "pada",
    konsep_explore_lab: "Laboratorium Grafik Interaktif",
    konsep_explore_p2d: "di bawah ini — grafiknya akan tergambar secara real-time sehingga kamu dapat mengamati perbedaan bentuknya secara langsung!",
    konsep_chips: [
      { label: "y = 2x + 1", warna: "#22d3ee", ket: "Garis Lurus" },
      { label: "y = x² − 3", warna: "#a78bfa", ket: "Parabola" },
      { label: "y = 1/x",    warna: "#f87171", ket: "Hiperbola" },
      { label: "y = √x",     warna: "#6ee7b7", ket: "Akar" },
    ],
    konsep_explore_hint: "↓ Coba masukkan salah satu persamaan di atas ke laboratorium berikut!",
    konsep_lab_title: "Laboratorium Grafik Interaktif",
    konsep_lab_desc: "Ketik persamaan apa saja di panel kanan — grafiknya langsung tergambar! Gunakan scroll untuk zoom, drag untuk geser bidang, dan hover untuk melihat koordinat.",
    konsep_lab_coba: "💡 Coba masukkan:",
    konsep_lab_note: "perhatikan titik potong sumbu dan perpotongan antar garis!",
    konsep_lab_then: "lalu",
    tp_sbx_title: "📍 Titik Potong Sumbu-x",
    tp_sbx_cond: "Syarat: nilai",
    tp_sbx_pt: "Titik:",
    tp_sby_title: "📍 Titik Potong Sumbu-y",
    tp_sby_cond: "Syarat: nilai",
    tp_sby_pt: "Titik:",
    tp_contoh: "📖 Contoh Soal",
    tp_pem: "Penyelesaian:",
    tp_tbl_titik: "Titik",
    tp_tbl_ket: "Keterangan",
    tp_tbl_sbx: "Titik potong sumbu-x (y = 0)",
    tp_tbl_sby: "Titik potong sumbu-y (x = 0)",
    tp_ex1_soal: "Tentukan grafik fungsi dari",
    tp_ex2_soal: "Tentukan grafik fungsi dari",
    tp_ex1_steps: [
      { label: "Siapkan Grid", desc: "Siapkan bidang koordinat Kartesius. Kita akan menggambar garis y = 2x + 4 menggunakan dua titik potong sumbu." },
      { label: "Titik Potong Sb-x", desc: "Substitusi y = 0 ke persamaan: 0 = 2x + 4 → 2x = −4 → x = −2. Titik potong sumbu-x adalah (−2, 0). Plot titik ini!" },
      { label: "Titik Potong Sb-y", desc: "Substitusi x = 0 ke persamaan: y = 2(0) + 4 = 4. Titik potong sumbu-y adalah (0, 4). Plot titik ini!" },
      { label: "Gambar Garis", desc: "Hubungkan titik (−2, 0) dan (0, 4) dengan garis lurus, lalu perpanjang ke kedua arah. Garis y = 2x + 4 selesai! 🎉" },
    ],
    tp_ex2_steps: [
      { label: "Siapkan Grid", desc: "Siapkan bidang koordinat Kartesius. Kita akan menggambar garis 3x − 5y = 15 menggunakan dua titik potong sumbu." },
      { label: "Titik Potong Sb-x", desc: "Substitusi y = 0: 3x − 5(0) = 15 → 3x = 15 → x = 5. Titik potong sumbu-x adalah (5, 0). Plot titik ini!" },
      { label: "Titik Potong Sb-y", desc: "Substitusi x = 0: 3(0) − 5y = 15 → −5y = 15 → y = −3. Titik potong sumbu-y adalah (0, −3). Plot titik ini!" },
      { label: "Gambar Garis", desc: "Hubungkan titik (5, 0) dan (0, −3) dengan garis lurus, lalu perpanjang ke kedua arah. Garis 3x − 5y = 15 selesai! 🎉" },
    ],
    ta_tip: "💡 Tips: Pilih nilai x yang mudah dihitung, misalnya x = 0, 1, 2, atau 3. Hindari pecahan agar koordinat titiknya bilangan bulat dan mudah diplot di bidang koordinat.",
    ta_tbl_r1: "Titik pertama",
    ta_tbl_r2: "Titik kedua",
    ta_tbl_dipilih: "dipilih",
    ta_ex1_soal: "Tentukan grafik fungsi dari",
    ta_ex2_soal: "Tentukan grafik fungsi dari",
    ta_ex1_steps: [
      { label: "Siapkan Grid", desc: "Siapkan bidang koordinat. Kita bebas memilih dua nilai x sembarang untuk menentukan dua titik pada garis y = x + 2." },
      { label: "Titik Pertama", desc: "Pilih x = −2: y = (−2) + 2 = 0. Titik pertama adalah (−2, 0). Plot titik ini di bidang koordinat!" },
      { label: "Titik Kedua", desc: "Pilih x = 2: y = 2 + 2 = 4. Titik kedua adalah (2, 4). Plot titik ini di bidang koordinat!" },
      { label: "Gambar Garis", desc: "Hubungkan titik (−2, 0) dan (2, 4) dengan garis lurus, lalu perpanjang ke kedua arah. Garis y = x + 2 selesai! 🎉" },
    ],
    ta_ex2_steps: [
      { label: "Siapkan Grid", desc: "Siapkan bidang koordinat. Kita bebas memilih dua nilai x sembarang untuk menentukan dua titik pada garis y = −2x + 4." },
      { label: "Titik Pertama", desc: "Pilih x = 1: y = −2(1) + 4 = −2 + 4 = 2. Titik pertama adalah (1, 2). Plot titik ini di bidang koordinat!" },
      { label: "Titik Kedua", desc: "Pilih x = 3: y = −2(3) + 4 = −6 + 4 = −2. Titik kedua adalah (3, −2). Plot titik ini di bidang koordinat!" },
      { label: "Gambar Garis", desc: "Hubungkan titik (1, 2) dan (3, −2) dengan garis lurus, lalu perpanjang ke kedua arah. Garis y = −2x + 4 selesai! 🎉" },
    ],
    c1_ubah: "Ubah ke bentuk y = mx + c terlebih dahulu:",
    c1_sbx: "Potong sb-x (y=0):",
    c1_sby: "Potong sb-y (x=0):",
    c1_soal_b: "Tentukan: a) titik potong sumbu-x dan sumbu-y, b) gambarkan grafiknya!",
    c1_ans_b: "✅ Sb-x = (−2, 0), Sb-y = (0, 3). Gradien m = 3/2, garis naik",
    mcq1_pem_intro: "Dari grafik, kita dapat membaca dua titik kunci yang sudah ditandai:",
    mcq1_sbx_label: "Titik potong sumbu-x",
    mcq1_sby_label: "Titik potong sumbu-y",
    mcq1_from_sby: "Dari titik potong sb-y →",
    mcq1_grad_label: "Gradien:",
    mcq1_thus: "Sehingga:",
    mcq1_wrong_explain: "Opsi B (y = 2x + 2) salah karena gradiennya 2, bukan 1. Opsi C (y = x − 2) salah karena intercept-y = −2, bukan 2. Opsi D (y = −x + 2) salah karena grafiknya turun ke kanan (gradien negatif).",
    c2_pem_title: "🔍 Pembahasan Lengkap",
    c2_l1_title: "📍 Langkah 1 — Baca Dua Titik dari Grafik",
    c2_l1_desc: "Dari grafik, baca dua titik yang dilalui garis (ditandai dengan titik kuning):",
    c2_pt1: "Titik 1",
    c2_pt2: "Titik 2",
    c2_l2_title: "🔁 Langkah 2 — Substitusi Titik ke Setiap Opsi",
    c2_l2_desc: "Masukkan kedua titik ke masing-masing persamaan. Persamaan yang",
    c2_l2_kw: "menghasilkan nilai y yang sama",
    c2_l2_for: "untuk",
    c2_l2_both: "kedua",
    c2_l2_end: "titik = jawaban yang benar.",
    c2_nia_yes: "Nilai y = 0 ✓",
    c2_nia_yes2: "Nilai y = 2 ✓",
    c2_nib: "Nilai y = −2, bukan 0 ✗",
    c2_nic: "Nilai y = −4, bukan 0 ✗",
    c2_nid: "Nilai y = 4, bukan 0 ✗",
    c2_pA_ok: "✅ Kedua titik terpenuhi → Opsi A BENAR",
    c2_pB_ko: "❌ Titik (−2, 0) tidak terpenuhi → Opsi B SALAH",
    c2_pC_ko: "❌ Titik (−2, 0) tidak terpenuhi → Opsi C SALAH",
    c2_pD_ko: "❌ Titik (−2, 0) tidak terpenuhi → Opsi D SALAH",
    c2_concl_title: "✅ Kesimpulan: Jawaban A —",
    c2_concl_desc: "Hanya opsi A yang menghasilkan nilai y yang tepat untuk",
    c2_concl_both: "kedua",
    c2_concl_end: "titik yang terbaca dari grafik.",
    c2_tip_title: "💡 Tips Teknik Substitusi",
    c2_tip_items: [
      "① Baca 2 titik yang dilalui garis dari grafik",
      "② Substitusi titik pertama ke semua opsi → eliminasi yang tidak cocok",
      "③ Jika masih ada 2+ opsi yang lolos, substitusi titik kedua untuk memastikan",
    ],
    c1_soal_a: "Persamaan garis:",
    c3_soal_dan: "dan",
    c3_soal_end: "digambar pada satu bidang koordinat. Tentukan titik potong kedua garis tersebut, lalu gambarkan!",
    c3_soal_b: "Dua garis",
    c3_bantu1: "Titik bantu",
    c3_bantu2: "Titik bantu",
    c3_elim_title: "Titik potong — selesaikan dengan eliminasi:",
    c3_sum: "Jumlahkan (1) dan (2):",
    c3_sub_eq1: "Substitusi x = 2 ke persamaan (1):",
    c3_graf_title: "Grafik",
    c3_graf_dan: "dan",
    c3_ans_main: "✅ Titik potong kedua garis: (2, 2) — semua koordinat bilangan bulat!",
  },
  en: {
    title: "GRAPHING LINEAR EQUATIONS",
    subtitle: "Draw Straight Lines on the Coordinate Plane!",
    breadcrumb: "Grade 8 · Equation of a Line · Mathematics",
    sh_intro: "🌟 Straight Lines — They're Everywhere!",
    sh_konsep: "📘 General Form of a Linear Equation",
    sh_titikpotong: "📌 Drawing a Line Using x- and y-Intercepts",
    sh_titikacak: "📐 Drawing a Line Using Any Two Points",
    sh_contoh1: "✏️ Example 1 — Easy Level",
    sh_contoh2: "✏️ Example 2 — Medium Level",
    sh_contoh3: "✏️ Example 3 — Hard Level",
    sh_rangkuman: "📌 Summary",
    back: "← Back to Equation of a Line",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD",
    prev: "← Previous", next: "Next →", repeat: "🔄 Repeat",
    soal: "📝 Problem", pem: "💡 Solution",
    intro_hook: "Train tracks, book edges, the sea horizon line — they all form straight lines. In mathematics, linear equations describe all these lines with a simple equation involving variables",
    intro_fig_cap: "The sea horizon line — a real-world example of a straight line that can be described by a mathematical equation.",
    intro_img_alt: "The sea horizon line — a real-world example of a straight line",
    intro_img_src: "Image source",
    intro_vis_title: "📈 Visual Graphs of Linear Equations",
    intro_panel_descs: ["Rising right", "Falling right", "Horizontal", "Vertical"],
    intro_p1: "Linear equations are one of the most fundamental concepts in mathematics. We can find them everywhere in real life.",
    intro_examples: [
      ["🛣️ Straight highways", "Modelling a straight line"],
      ["📈 Economic growth charts", "Showing linear trends"],
      ["🏗️ Building construction", "Architecture based on straight lines"],
      ["🚗 Constant speed", "Linear distance-time relationship"],
    ],
    intro_funfact: "💡 Fun fact: Every linear equation (first-degree) always produces a straight-line graph. Conversely, every straight line can be written as a linear equation!",
    konsep_summary: "🎯 Key Summary",
    konsep_p1: "There are three main forms of linear equations commonly used:",
    konsep_forms: [
      { nama: "Slope-Intercept Form", ket: "m = slope, c = y-intercept" },
      { nama: "General Form", ket: "a, b, c = real number constants" },
      { nama: "Intercept Form", ket: "a = x-intercept, b = y-intercept" },
    ],
    konsep_anat: "🔬 Anatomy of y = mx + c",
    konsep_m: "Slope/gradient",
    konsep_c: "y-intercept",
    konsep_tabel_h: ["Equation", "Slope (m)", "x-intercept", "y-intercept (c)", "Direction"],
    konsep_tabel_rows: [
      ["y = 3x + 2", "3", "(-⅔, 0)", "(0, 2)", "↗ Rising"],
      ["y = -2x + 5", "-2", "(5/2, 0)", "(0, 5)", "↘ Falling"],
      ["x = -5", "∞ undefined", "(-5, 0)", "—", "↕ Vertical"],
      ["y = 4", "0", "—", "(0, 4)", "→ Horizontal"],
    ],
    konsep_ciri: "Characteristics of Linear Equations",
    konsep_ciri_sub: "Applies to all forms of line equations",
    konsep_from: "From these three forms…",
    konsep_forms3: [
      { nama: "Slope-Intercept" },
      { nama: "General Form" },
      { nama: "Intercept Form" },
    ],
    titikpotong_p1: "The easiest way to draw a straight line is to find two special points: the x-intercept (when y = 0) and the y-intercept (when x = 0). Connect these two points and you have an accurate graph!",
    titikpotong_steps: [
      { label: "Find x-intercept", desc: "Substitute y = 0, solve for x" },
      { label: "Find y-intercept", desc: "Substitute x = 0, solve for y" },
      { label: "Plot First Point", desc: "Mark the x-intercept on the coordinate plane" },
      { label: "Plot Second Point & Connect", desc: "Mark the y-intercept, then draw the line" },
    ],
    titikacak_p1: "If the intercepts are hard to calculate (or both at the same point), use any two random points. Choose any x value, compute y, plot, and connect!",
    titikacak_steps: [
      { label: "Choose x₁", desc: "e.g. x = 0, compute y₁" },
      { label: "Choose x₂ (Different)", desc: "e.g. x = 3, compute y₂" },
      { label: "Plot First Point", desc: "Mark (x₁, y₁) on the coordinate plane" },
      { label: "Plot & Connect", desc: "Mark (x₂, y₂), then draw the line" },
    ],
    mcq1_soal: "Look at the graph below! The equation of the line shown in the graph is…",
    mcq1_benar: "✅ Correct! The graph shows the line y = x + 2.",
    mcq1_salah: "❌ Not quite right. Look at the marked points on the graph and try again!",
    mcq1_retry: "Try again",
    mcq1_lihat: "▼ Show Solution",
    mcq1_tutup: "▲ Hide Solution",
    mcq1_pem_title: "💡 Solution:",
    mcq1_pem: "From the graph, the line passes through (−2, 0) and (0, 2).",
    mcq1_pem_m: "Slope = (2−0)/(0−(−2)) = 2/2 = 1",
    mcq1_pem_c: "y-intercept = (0, 2) → c = 2",
    mcq1_pem_ans: "✅ Equation: y = 1·x + 2 = x + 2",
    c1_soal: "Draw the graph of the line with equation 2x + y − 4 = 0!",
    c1_l1: "Step 1 — Find the x-intercept (y = 0):",
    c1_l2: "Step 2 — Find the y-intercept (x = 0):",
    c1_l3: "Step 3 — Plot the points and connect:",
    c1_vis: "Graph of 2x + y − 4 = 0:",
    c1_ans: "✅ The line passes through (2, 0) and (0, 4). Connect both points to draw the graph!",
    c2_soal: "Draw the graph of the line y = ⅔x − 1!",
    c2_l1: "Step 1 — Build a value table:",
    c2_l2: "Step 2 — Plot the points:",
    c2_l3: "Step 3 — Connect the points:",
    c2_vis: "Graph of y = ⅔x − 1:",
    c2_ans: "✅ Draw the line passing through all the plotted points!",
    c3_soal: "Draw the graph of 3x − 2y + 6 = 0, then find the slope and intercepts!",
    c3_l1: "Step 1 — Convert to y = mx + c form:",
    c3_l2: "Step 2 — Find the intercepts:",
    c3_l3: "Step 3 — Draw the graph:",
    c3_vis: "Graph of 3x − 2y + 6 = 0:",
    c3_ans: "✅ Slope m = 3/2, x-intercept at (−2, 0), y-intercept at (0, 3)",
    rang_items: [
      "Easiest method: find x-intercept (y=0) and y-intercept (x=0), then connect",
      "Alternative: choose 2 arbitrary x values, compute y, plot, connect",
      "Check the slope from the equation to verify the line's inclination is correct",
      "Use at least 3 points for greater accuracy",
    ],
    rang_tip: "💡 Tip: Always verify by substituting points back into the original equation to confirm the graph is correct!",
    ex_label1: "Example 1",
    ex_label2: "Example 2",
    konsep_key_title: "✦ Key Principle ✦",
    konsep_key_dan: "and",
    konsep_key_pow: "raised only to the power of",
    konsep_key_no: "No x², y², xy, √x, or any other power.",
    konsep_key_no2: "As long as x and y are raised to the power of 1, the graph is",
    konsep_key_pasti: "always a straight line",
    konsep_key_check: "Quick check:",
    konsep_key_check_b: "Look at the powers of all x and y in the equation. If",
    konsep_key_check_em: "all powers are 1",
    konsep_key_check_cond: "(no squares, roots, or negative powers) →",
    konsep_key_check_concl: "it must be a linear equation!",
    konsep_explore_title: "Explore Further",
    konsep_explore_p1a: "You've seen how different equations produce different curve shapes — some are",
    konsep_explore_kw1: "straight lines",
    konsep_explore_kw2: "parabolas",
    konsep_explore_kw3: "hyperbolas",
    konsep_explore_p1b: ", and others.",
    konsep_explore_p2a: "To better understand and compare these different curve types, you can",
    konsep_explore_p2b: "directly input any equation",
    konsep_explore_p2c: "in the",
    konsep_explore_lab: "Interactive Graph Lab",
    konsep_explore_p2d: "below — the graph will be drawn in real-time so you can observe the differences directly!",
    konsep_chips: [
      { label: "y = 2x + 1", warna: "#22d3ee", ket: "Straight Line" },
      { label: "y = x² − 3", warna: "#a78bfa", ket: "Parabola" },
      { label: "y = 1/x",    warna: "#f87171", ket: "Hyperbola" },
      { label: "y = √x",     warna: "#6ee7b7", ket: "Square Root" },
    ],
    konsep_explore_hint: "↓ Try entering one of the equations above into the lab below!",
    konsep_lab_title: "Interactive Graph Lab",
    konsep_lab_desc: "Type any equation in the right panel — the graph is drawn instantly! Use scroll to zoom, drag to pan, and hover to see coordinates.",
    konsep_lab_coba: "💡 Try entering:",
    konsep_lab_note: "observe the intercepts and intersections between lines!",
    konsep_lab_then: "then",
    tp_sbx_title: "📍 x-intercept",
    tp_sbx_cond: "Condition: value",
    tp_sbx_pt: "Point:",
    tp_sby_title: "📍 y-intercept",
    tp_sby_cond: "Condition: value",
    tp_sby_pt: "Point:",
    tp_contoh: "📖 Example Problems",
    tp_pem: "Solution:",
    tp_tbl_titik: "Point",
    tp_tbl_ket: "Description",
    tp_tbl_sbx: "x-intercept (y = 0)",
    tp_tbl_sby: "y-intercept (x = 0)",
    tp_ex1_soal: "Draw the graph of",
    tp_ex2_soal: "Draw the graph of",
    tp_ex1_steps: [
      { label: "Set Up Grid", desc: "Set up a Cartesian coordinate plane. We'll draw the line y = 2x + 4 using the two axis intercepts." },
      { label: "x-intercept", desc: "Substitute y = 0 into the equation: 0 = 2x + 4 → 2x = −4 → x = −2. The x-intercept is (−2, 0). Plot this point!" },
      { label: "y-intercept", desc: "Substitute x = 0 into the equation: y = 2(0) + 4 = 4. The y-intercept is (0, 4). Plot this point!" },
      { label: "Draw the Line", desc: "Connect (−2, 0) and (0, 4) with a straight line, then extend in both directions. Line y = 2x + 4 done! 🎉" },
    ],
    tp_ex2_steps: [
      { label: "Set Up Grid", desc: "Set up a Cartesian coordinate plane. We'll draw the line 3x − 5y = 15 using the two axis intercepts." },
      { label: "x-intercept", desc: "Substitute y = 0: 3x − 5(0) = 15 → 3x = 15 → x = 5. The x-intercept is (5, 0). Plot this point!" },
      { label: "y-intercept", desc: "Substitute x = 0: 3(0) − 5y = 15 → −5y = 15 → y = −3. The y-intercept is (0, −3). Plot this point!" },
      { label: "Draw the Line", desc: "Connect (5, 0) and (0, −3) with a straight line, then extend in both directions. Line 3x − 5y = 15 done! 🎉" },
    ],
    ta_tip: "💡 Tip: Choose easy-to-compute x values, such as x = 0, 1, 2, or 3. Avoid fractions so that the point coordinates are integers and easy to plot on the coordinate plane.",
    ta_tbl_r1: "First point",
    ta_tbl_r2: "Second point",
    ta_tbl_dipilih: "chosen",
    ta_ex1_soal: "Draw the graph of",
    ta_ex2_soal: "Draw the graph of",
    ta_ex1_steps: [
      { label: "Set Up Grid", desc: "Set up the coordinate plane. We can freely choose any two x values to find two points on y = x + 2." },
      { label: "First Point", desc: "Choose x = −2: y = (−2) + 2 = 0. The first point is (−2, 0). Plot it on the coordinate plane!" },
      { label: "Second Point", desc: "Choose x = 2: y = 2 + 2 = 4. The second point is (2, 4). Plot it on the coordinate plane!" },
      { label: "Draw the Line", desc: "Connect (−2, 0) and (2, 4) with a straight line, then extend in both directions. Line y = x + 2 done! 🎉" },
    ],
    ta_ex2_steps: [
      { label: "Set Up Grid", desc: "Set up the coordinate plane. We can freely choose any two x values to find two points on y = −2x + 4." },
      { label: "First Point", desc: "Choose x = 1: y = −2(1) + 4 = −2 + 4 = 2. The first point is (1, 2). Plot it on the coordinate plane!" },
      { label: "Second Point", desc: "Choose x = 3: y = −2(3) + 4 = −6 + 4 = −2. The second point is (3, −2). Plot it on the coordinate plane!" },
      { label: "Draw the Line", desc: "Connect (1, 2) and (3, −2) with a straight line, then extend in both directions. Line y = −2x + 4 done! 🎉" },
    ],
    c1_ubah: "Convert to y = mx + c form first:",
    c1_sbx: "x-intercept (y=0):",
    c1_sby: "y-intercept (x=0):",
    c1_soal_b: "Find: a) x-intercept and y-intercept, b) draw the graph!",
    c1_ans_b: "✅ x-int = (−2, 0), y-int = (0, 3). Slope m = 3/2, line rises",
    mcq1_pem_intro: "From the graph, we can read two key points that are marked:",
    mcq1_sbx_label: "x-intercept",
    mcq1_sby_label: "y-intercept",
    mcq1_from_sby: "From y-intercept →",
    mcq1_grad_label: "Slope:",
    mcq1_thus: "Therefore:",
    mcq1_wrong_explain: "Option B (y = 2x + 2) is wrong because its slope is 2, not 1. Option C (y = x − 2) is wrong because y-intercept = −2, not 2. Option D (y = −x + 2) is wrong because the graph falls to the right (negative slope).",
    c2_pem_title: "🔍 Full Solution",
    c2_l1_title: "📍 Step 1 — Read Two Points from the Graph",
    c2_l1_desc: "From the graph, read two points on the line (marked with yellow dots):",
    c2_pt1: "Point 1",
    c2_pt2: "Point 2",
    c2_l2_title: "🔁 Step 2 — Substitute Points Into Each Option",
    c2_l2_desc: "Substitute both points into each equation. The equation that",
    c2_l2_kw: "gives the same y-value",
    c2_l2_for: "for",
    c2_l2_both: "both",
    c2_l2_end: "points = the correct answer.",
    c2_nia_yes: "y = 0 ✓",
    c2_nia_yes2: "y = 2 ✓",
    c2_nib: "y = −2, not 0 ✗",
    c2_nic: "y = −4, not 0 ✗",
    c2_nid: "y = 4, not 0 ✗",
    c2_pA_ok: "✅ Both points satisfied → Option A CORRECT",
    c2_pB_ko: "❌ Point (−2, 0) not satisfied → Option B WRONG",
    c2_pC_ko: "❌ Point (−2, 0) not satisfied → Option C WRONG",
    c2_pD_ko: "❌ Point (−2, 0) not satisfied → Option D WRONG",
    c2_concl_title: "✅ Conclusion: Answer A —",
    c2_concl_desc: "Only option A gives the correct y-values for",
    c2_concl_both: "both",
    c2_concl_end: "points read from the graph.",
    c2_tip_title: "💡 Substitution Technique Tips",
    c2_tip_items: [
      "① Read 2 points on the line from the graph",
      "② Substitute the first point into all options → eliminate those that don't match",
      "③ If 2+ options remain, substitute the second point to confirm",
    ],
    c1_soal_a: "Line equation:",
    c3_soal_dan: "and",
    c3_soal_end: "are drawn on the same coordinate plane. Find the intersection point of both lines, then draw the graph!",
    c3_soal_b: "Two lines",
    c3_bantu1: "Helper points for",
    c3_bantu2: "Helper points for",
    c3_elim_title: "Intersection — solve by elimination:",
    c3_sum: "Add equations (1) and (2):",
    c3_sub_eq1: "Substitute x = 2 into equation (1):",
    c3_graf_title: "Graph of",
    c3_graf_dan: "and",
    c3_ans_main: "✅ Intersection of both lines: (2, 2) — all integer coordinates!",
  },
  ja: {
    title: "一次方程式のグラフ",
    subtitle: "座標平面に直線を描こう！",
    breadcrumb: "中学2年 · 直線の方程式 · 数学",
    sh_intro: "🌟 直線 — あちこちにある！",
    sh_konsep: "📘 一次方程式の一般形",
    sh_titikpotong: "📌 x切片・y切片を使って直線を描く",
    sh_titikacak: "📐 任意の2点を使って直線を描く",
    sh_contoh1: "✏️ 例題1 — 基本レベル",
    sh_contoh2: "✏️ 例題2 — 標準レベル",
    sh_contoh3: "✏️ 例題3 — 発展レベル",
    sh_rangkuman: "📌 まとめ",
    back: "← 直線の方程式に戻る",
    mudah: "基本", sedang: "標準", sulit: "発展",
    prev: "← 前へ", next: "次へ →", repeat: "🔄 繰り返す",
    soal: "📝 問題", pem: "💡 解答",
    intro_hook: "線路、本の端、海の地平線 — これらはすべて直線を形成している。数学では、一次方程式は変数を含む単純な式でこれらの直線をすべて表す",
    intro_fig_cap: "海の地平線 — 数学的な方程式で表せる直線の実例。",
    intro_img_alt: "海の地平線 — 直線の実例",
    intro_img_src: "画像出典",
    intro_vis_title: "📈 一次方程式のグラフ　ビジュアル",
    intro_panel_descs: ["右上がり", "右下がり", "水平", "垂直"],
    intro_p1: "一次方程式は数学で最も基本的な概念の一つです。現実の生活でもあちこちで見つけられます。",
    intro_examples: [
      ["🛣️ まっすぐな高速道路", "直線をモデル化"],
      ["📈 経済成長グラフ", "線形トレンドを示す"],
      ["🏗️ 建築工事", "直線に基づくアーキテクチャ"],
      ["🚗 一定速度", "線形の距離-時間の関係"],
    ],
    intro_funfact: "💡 豆知識：すべての一次方程式（1次式）は必ず直線グラフになる。逆に、すべての直線は一次方程式として書ける！",
    konsep_summary: "🎯 要点まとめ",
    konsep_p1: "よく使われる直線の方程式には3つの主要な形がある：",
    konsep_forms: [
      { nama: "傾き切片形", ket: "m = 傾き、c = y切片" },
      { nama: "一般形", ket: "a、b、c = 実数定数" },
      { nama: "切片形", ket: "a = x切片、b = y切片" },
    ],
    konsep_anat: "🔬 y = mx + cの解析",
    konsep_m: "傾き/勾配",
    konsep_c: "y切片",
    konsep_tabel_h: ["方程式", "傾き(m)", "x切片", "y切片(c)", "方向"],
    konsep_tabel_rows: [
      ["y = 3x + 2", "3", "(-⅔, 0)", "(0, 2)", "↗ 上昇"],
      ["y = -2x + 5", "-2", "(5/2, 0)", "(0, 5)", "↘ 下降"],
      ["x = -5", "∞ 未定義", "(-5, 0)", "—", "↕ 垂直"],
      ["y = 4", "0", "—", "(0, 4)", "→ 水平"],
    ],
    konsep_ciri: "直線の方程式の特徴",
    konsep_ciri_sub: "すべての直線の方程式に適用される",
    konsep_from: "これら3つの形から…",
    konsep_forms3: [
      { nama: "傾き切片形" },
      { nama: "一般形" },
      { nama: "切片形" },
    ],
    titikpotong_p1: "直線を描く最も簡単な方法は、2つの特別な点を見つけること：x切片（y=0のとき）とy切片（x=0のとき）。この2点を結べば正確なグラフが得られる！",
    titikpotong_steps: [
      { label: "x切片を求める", desc: "y = 0を代入してxを求める" },
      { label: "y切片を求める", desc: "x = 0を代入してyを求める" },
      { label: "最初の点をプロット", desc: "座標平面にx切片をマークする" },
      { label: "2点目をプロットして結ぶ", desc: "y切片をマークして直線を引く" },
    ],
    titikacak_p1: "切片が計算しにくい場合（または両方が同じ点の場合）、任意の2点を使う。適当なx値を選び、yを計算してプロットし、結ぶ！",
    titikacak_steps: [
      { label: "x₁を選ぶ", desc: "例：x = 0、y₁を計算" },
      { label: "別のx₂を選ぶ", desc: "例：x = 3、y₂を計算" },
      { label: "最初の点をプロット", desc: "座標平面に(x₁, y₁)をマーク" },
      { label: "プロットして結ぶ", desc: "(x₂, y₂)をマークして直線を引く" },
    ],
    mcq1_soal: "次のグラフを見なさい！グラフに描かれている直線の方程式は…",
    mcq1_benar: "✅ 正解！グラフはy = x + 2の直線を表しています。",
    mcq1_salah: "❌ 答えが違います。グラフの印のある点をよく見てもう一度試してください！",
    mcq1_retry: "もう一度",
    mcq1_lihat: "▼ 解答を見る",
    mcq1_tutup: "▲ 解答を隠す",
    mcq1_pem_title: "💡 解答：",
    mcq1_pem: "グラフから、直線は(−2, 0)と(0, 2)を通っている。",
    mcq1_pem_m: "傾き = (2−0)/(0−(−2)) = 2/2 = 1",
    mcq1_pem_c: "y切片 = (0, 2) → c = 2",
    mcq1_pem_ans: "✅ 方程式：y = 1·x + 2 = x + 2",
    c1_soal: "方程式2x + y − 4 = 0のグラフを描きなさい！",
    c1_l1: "ステップ1 — x切片を求める(y = 0)：",
    c1_l2: "ステップ2 — y切片を求める(x = 0)：",
    c1_l3: "ステップ3 — 点をプロットして結ぶ：",
    c1_vis: "2x + y − 4 = 0のグラフ：",
    c1_ans: "✅ 直線は(2, 0)と(0, 4)を通る。2点を結んでグラフを描く！",
    c2_soal: "直線y = ⅔x − 1のグラフを描きなさい！",
    c2_l1: "ステップ1 — 値の表を作る：",
    c2_l2: "ステップ2 — 点をプロット：",
    c2_l3: "ステップ3 — 点を結ぶ：",
    c2_vis: "y = ⅔x − 1のグラフ：",
    c2_ans: "✅ プロットしたすべての点を通る直線を描く！",
    c3_soal: "3x − 2y + 6 = 0のグラフを描き、傾きと切片を求めなさい！",
    c3_l1: "ステップ1 — y = mx + cの形に変換：",
    c3_l2: "ステップ2 — 切片を求める：",
    c3_l3: "ステップ3 — グラフを描く：",
    c3_vis: "3x − 2y + 6 = 0のグラフ：",
    c3_ans: "✅ 傾きm = 3/2、x切片(−2, 0)、y切片(0, 3)",
    rang_items: [
      "最も簡単な方法：x切片(y=0)とy切片(x=0)を求めて結ぶ",
      "代替方法：任意の2つのx値を選びyを計算してプロット、結ぶ",
      "方程式から傾きを確認して直線の傾き度を検証",
      "精度を高めるために最低3点を使う",
    ],
    rang_tip: "💡 ヒント：元の方程式に点を代入して確認し、グラフの正確さを検証しよう！",
    ex_label1: "例 1",
    ex_label2: "例 2",
    konsep_key_title: "✦ 重要原則 ✦",
    konsep_key_dan: "と",
    konsep_key_pow: "の指数はすべて",
    konsep_key_no: "x²、y²、xy、√x、その他の指数は含まない。",
    konsep_key_no2: "x と y の指数がすべて 1 であれば、グラフは",
    konsep_key_pasti: "必ず直線",
    konsep_key_check: "素早い確認方法：",
    konsep_key_check_b: "方程式内の x と y の指数をすべて確認しよう。もし",
    konsep_key_check_em: "すべて 1 乗",
    konsep_key_check_cond: "（2乗・根号・負の指数がない）なら →",
    konsep_key_check_concl: "それは必ず一次方程式（直線）だ！",
    konsep_explore_title: "さらに探求しよう",
    konsep_explore_p1a: "さまざまな方程式がそれぞれ異なる曲線を描くことを見てきた — あるものは",
    konsep_explore_kw1: "直線",
    konsep_explore_kw2: "放物線",
    konsep_explore_kw3: "双曲線",
    konsep_explore_p1b: "、その他の形になる。",
    konsep_explore_p2a: "これらのさまざまな曲線をより深く理解・比較するために、",
    konsep_explore_p2b: "任意の方程式を直接入力",
    konsep_explore_p2c: "できる",
    konsep_explore_lab: "インタラクティブグラフ実験室",
    konsep_explore_p2d: "が下にある — グラフはリアルタイムで描画され、形の違いを直接観察できる！",
    konsep_chips: [
      { label: "y = 2x + 1", warna: "#22d3ee", ket: "直線" },
      { label: "y = x² − 3", warna: "#a78bfa", ket: "放物線" },
      { label: "y = 1/x",    warna: "#f87171", ket: "双曲線" },
      { label: "y = √x",     warna: "#6ee7b7", ket: "平方根" },
    ],
    konsep_explore_hint: "↓ 上の方程式のどれかを下の実験室に入力してみよう！",
    konsep_lab_title: "インタラクティブグラフ実験室",
    konsep_lab_desc: "右パネルに任意の方程式を入力すると、グラフが即座に描画される！スクロールでズーム、ドラッグで移動、ホバーで座標を確認できる。",
    konsep_lab_coba: "💡 入力してみよう：",
    konsep_lab_note: "軸との交点や直線の交点を観察しよう！",
    konsep_lab_then: "次に",
    tp_sbx_title: "📍 x 切片",
    tp_sbx_cond: "条件：",
    tp_sbx_pt: "点：",
    tp_sby_title: "📍 y 切片",
    tp_sby_cond: "条件：",
    tp_sby_pt: "点：",
    tp_contoh: "📖 例題",
    tp_pem: "解答：",
    tp_tbl_titik: "点",
    tp_tbl_ket: "説明",
    tp_tbl_sbx: "x 切片（y = 0）",
    tp_tbl_sby: "y 切片（x = 0）",
    tp_ex1_soal: "のグラフを描け：",
    tp_ex2_soal: "のグラフを描け：",
    tp_ex1_steps: [
      { label: "座標系を準備", desc: "デカルト座標平面を用意する。y = 2x + 4 の直線を 2 つの軸切片を使って描く。" },
      { label: "x 切片", desc: "y = 0 を代入：0 = 2x + 4 → 2x = −4 → x = −2。x 切片は (−2, 0)。この点をプロット！" },
      { label: "y 切片", desc: "x = 0 を代入：y = 2(0) + 4 = 4。y 切片は (0, 4)。この点をプロット！" },
      { label: "直線を引く", desc: "(−2, 0) と (0, 4) を直線で結び、両方向に延長する。y = 2x + 4 完成！🎉" },
    ],
    tp_ex2_steps: [
      { label: "座標系を準備", desc: "デカルト座標平面を用意する。3x − 5y = 15 の直線を 2 つの軸切片を使って描く。" },
      { label: "x 切片", desc: "y = 0 を代入：3x − 5(0) = 15 → 3x = 15 → x = 5。x 切片は (5, 0)。この点をプロット！" },
      { label: "y 切片", desc: "x = 0 を代入：3(0) − 5y = 15 → −5y = 15 → y = −3。y 切片は (0, −3)。この点をプロット！" },
      { label: "直線を引く", desc: "(5, 0) と (0, −3) を直線で結び、両方向に延長する。3x − 5y = 15 完成！🎉" },
    ],
    ta_tip: "💡 ヒント：計算しやすい x の値（例：x = 0, 1, 2, 3）を選ぼう。分数を避けることで、座標が整数になり、座標平面にプロットしやすくなる。",
    ta_tbl_r1: "第1点",
    ta_tbl_r2: "第2点",
    ta_tbl_dipilih: "を選択",
    ta_ex1_soal: "のグラフを描け：",
    ta_ex2_soal: "のグラフを描け：",
    ta_ex1_steps: [
      { label: "座標系を準備", desc: "座標平面を用意する。y = x + 2 上の 2 点を自由に選んで決める。" },
      { label: "第1点", desc: "x = −2 を選択：y = (−2) + 2 = 0。第1点は (−2, 0)。座標平面にプロット！" },
      { label: "第2点", desc: "x = 2 を選択：y = 2 + 2 = 4。第2点は (2, 4)。座標平面にプロット！" },
      { label: "直線を引く", desc: "(−2, 0) と (2, 4) を直線で結び、両方向に延長する。y = x + 2 完成！🎉" },
    ],
    ta_ex2_steps: [
      { label: "座標系を準備", desc: "座標平面を用意する。y = −2x + 4 上の 2 点を自由に選んで決める。" },
      { label: "第1点", desc: "x = 1 を選択：y = −2(1) + 4 = −2 + 4 = 2。第1点は (1, 2)。座標平面にプロット！" },
      { label: "第2点", desc: "x = 3 を選択：y = −2(3) + 4 = −6 + 4 = −2。第2点は (3, −2)。座標平面にプロット！" },
      { label: "直線を引く", desc: "(1, 2) と (3, −2) を直線で結び、両方向に延長する。y = −2x + 4 完成！🎉" },
    ],
    c1_ubah: "まず y = mx + c の形に変換：",
    c1_sbx: "x 切片（y=0）：",
    c1_sby: "y 切片（x=0）：",
    c1_soal_b: "求めなさい：a) x切片と y切片、b) グラフを描きなさい！",
    c1_ans_b: "✅ x切片 = (−2, 0)、y切片 = (0, 3)。傾き m = 3/2、右上がり直線",
    mcq1_pem_intro: "グラフから、印の付いた 2 つの主要な点を読み取れる：",
    mcq1_sbx_label: "x 切片",
    mcq1_sby_label: "y 切片",
    mcq1_from_sby: "y 切片より →",
    mcq1_grad_label: "傾き：",
    mcq1_thus: "よって：",
    mcq1_wrong_explain: "選択肢 B（y = 2x + 2）は傾きが 2 で 1 ではないため不正解。選択肢 C（y = x − 2）は y 切片が −2 で 2 ではないため不正解。選択肢 D（y = −x + 2）は右下がり（負の傾き）のため不正解。",
    c2_pem_title: "🔍 完全な解説",
    c2_l1_title: "📍 ステップ 1 — グラフから 2 点を読み取る",
    c2_l1_desc: "グラフから、直線が通る 2 点を読み取る（黄色の点で示されている）：",
    c2_pt1: "点 1",
    c2_pt2: "点 2",
    c2_l2_title: "🔁 ステップ 2 — 各選択肢に点を代入する",
    c2_l2_desc: "両方の点をそれぞれの方程式に代入する。",
    c2_l2_kw: "同じ y 値が得られる",
    c2_l2_for: "方程式（",
    c2_l2_both: "両方",
    c2_l2_end: "の点について）が正解。",
    c2_nia_yes: "y = 0 ✓",
    c2_nia_yes2: "y = 2 ✓",
    c2_nib: "y = −2（0 ではない）✗",
    c2_nic: "y = −4（0 ではない）✗",
    c2_nid: "y = 4（0 ではない）✗",
    c2_pA_ok: "✅ 両点が成立 → 選択肢 A 正解",
    c2_pB_ko: "❌ (−2, 0) が成立しない → 選択肢 B 不正解",
    c2_pC_ko: "❌ (−2, 0) が成立しない → 選択肢 C 不正解",
    c2_pD_ko: "❌ (−2, 0) が成立しない → 選択肢 D 不正解",
    c2_concl_title: "✅ 結論：答えは A —",
    c2_concl_desc: "選択肢 A だけがグラフから読み取った",
    c2_concl_both: "両方",
    c2_concl_end: "の点で正しい y 値を与える。",
    c2_tip_title: "💡 代入テクニックのヒント",
    c2_tip_items: [
      "① グラフから直線上の 2 点を読み取る",
      "② 第1点を全選択肢に代入 → 合わないものを除外",
      "③ 2つ以上残ったら、第2点を代入して確定",
    ],
    c1_soal_a: "直線の方程式：",
    c3_soal_dan: "と",
    c3_soal_end: "を同じ座標平面に描く。2 直線の交点を求め、グラフを描け！",
    c3_soal_b: "2 直線",
    c3_bantu1: "補助点",
    c3_bantu2: "補助点",
    c3_elim_title: "交点 — 加減法で解く：",
    c3_sum: "(1) と (2) を加える：",
    c3_sub_eq1: "x = 2 を方程式 (1) に代入：",
    c3_graf_title: "グラフ",
    c3_graf_dan: "と",
    c3_ans_main: "✅ 2 直線の交点：(2, 2) — すべて整数座標！",
  },
};

/* ─── SVG helpers ─── */
const W = 200, H = 160, MX = 100, MY = 80, SC = 16;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSystem = ({ children, w = W, h = H, label = "", showNumbers = false }: { children?: React.ReactNode; w?: number; h?: number; label?: string; showNumbers?: boolean }) => {
  const mx = w / 2, my = h / 2;
  const uid = React.useId().replace(/:/g, "");
  const xStep = w / 12, yStep = h / 10;
  const ticks = [-4, -2, 2, 4];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-xl" style={{ maxHeight: showNumbers ? 220 : 180, background: "rgba(15,23,42,0.7)" }}>
      {/* grid */}
      {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
        <g key={v}>
          <line x1={mx + v*xStep} y1={4} x2={mx + v*xStep} y2={h-4} stroke="#1e293b" strokeWidth="1" />
          <line x1={4} y1={my - v*yStep} x2={w-4} y2={my - v*yStep} stroke="#1e293b" strokeWidth="1" />
        </g>
      ))}
      {/* axes */}
      <line x1={4} y1={my} x2={w-4} y2={my} stroke="#475569" strokeWidth="1.5" markerEnd={`url(#arr-${uid})`} />
      <line x1={mx} y1={h-4} x2={mx} y2={4} stroke="#475569" strokeWidth="1.5" markerEnd={`url(#arr-${uid})`} />
      <defs>
        <marker id={`arr-${uid}`} markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#475569" />
        </marker>
      </defs>
      <text x={w-10} y={my+12} fill="#64748b" fontSize="9">x</text>
      <text x={mx+4} y={12} fill="#64748b" fontSize="9">y</text>
      <text x={mx+3} y={my+11} fill="#475569" fontSize="7">O</text>
      {label && <text x={6} y={14} fill="#94a3b8" fontSize="8">{label}</text>}
      {/* axis numbers */}
      {showNumbers && [-4,-3,-2,-1,1,2,3,4].map(v => (
        <g key={`num-${v}`}>
          <text x={mx + v*xStep - (v < -9 ? 9 : v < 0 ? 6 : 3)} y={my + 11} fill="#64748b" fontSize="7">{v}</text>
          <text x={mx - 15} y={my - v*yStep + 3} fill="#64748b" fontSize="7">{v}</text>
        </g>
      ))}
      {children}
    </svg>
  );
};

/* ─── Interactive Step Graph ─── */
const ISG_W = 300, ISG_H = 260, ISG_MX = 150, ISG_MY = 130, ISG_SC = 22;
const iax = (x: number) => ISG_MX + x * ISG_SC;
const iay = (y: number) => ISG_MY - y * ISG_SC;
const ISG_TICKS = [-5,-4,-3,-2,-1,1,2,3,4,5];

interface IStepDef { label: string; color: string; bg: string; desc: string; }

const InteractiveStepGraph = ({
  equationLabel, linePoints, point1, point2, lineColor, steps, navPrev, navNext, navRepeat,
}: {
  equationLabel: string;
  linePoints: [number,number][];
  point1: [number,number];
  point2: [number,number];
  lineColor: string;
  steps: [IStepDef, IStepDef, IStepDef, IStepDef];
  navPrev: string;
  navNext: string;
  navRepeat: string;
}) => {
  const [step, setStep] = React.useState(0);

  const ptLabelPos = (x: number, y: number, above: boolean): [number,number] => {
    const px = iax(x), py = iay(y);
    const dx = px > ISG_MX + 70 ? -62 : 9;
    const dy = above ? -9 : 16;
    return [px + dx, py + dy];
  };
  const [p1lx, p1ly] = ptLabelPos(point1[0], point1[1], point1[1] > 1);
  const [p2lx, p2ly] = ptLabelPos(point2[0], point2[1], point2[1] < 0);

  const stepIcons = ["🗺️","📍","📌","✏️"];

  return (
    <div className="space-y-3">
      {/* Step pills */}
      <div className="flex gap-2 flex-wrap">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={i === step ? { background: s.bg, borderColor: s.color + "88", color: s.color, boxShadow: `0 0 12px ${s.color}33` } : {}}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-body font-semibold transition-all duration-200 border ${
              i === step ? 'scale-105' :
              i < step ? 'border-white/20 bg-white/10 text-white/50' :
              'border-white/8 bg-white/5 text-white/25'
            }`}>
            <span className="text-[11px]">{stepIcons[i]}</span>
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{i+1}</span>
          </button>
        ))}
      </div>

      {/* Step description */}
      <div className="rounded-xl p-3.5 border" style={{ background: steps[step].bg, borderColor: steps[step].color + "44" }}>
        <div className="flex items-start gap-2">
          <span className="text-base shrink-0 mt-0.5">{stepIcons[step]}</span>
          <div>
            <p className="text-xs font-bold font-body mb-0.5" style={{ color: steps[step].color }}>{steps[step].label}</p>
            <p className="text-xs font-body text-white/80 leading-relaxed">{steps[step].desc}</p>
          </div>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="relative">
        <svg viewBox={`0 0 ${ISG_W} ${ISG_H}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.97)", maxHeight: 380 }}>
          {/* grid lines */}
          {[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(v => (
            <g key={v}>
              <line x1={iax(v)} y1={3} x2={iax(v)} y2={ISG_H-3} stroke={v===0?"#334155":"#0f1f3d"} strokeWidth={v===0?"1":"0.8"}/>
              <line x1={3} y1={iay(v)} x2={ISG_W-3} y2={iay(v)} stroke={v===0?"#334155":"#0f1f3d"} strokeWidth={v===0?"1":"0.8"}/>
            </g>
          ))}
          {/* axes */}
          <line x1={6} y1={ISG_MY} x2={ISG_W-6} y2={ISG_MY} stroke="#475569" strokeWidth="2"/>
          <line x1={ISG_MX} y1={ISG_H-6} x2={ISG_MX} y2={6} stroke="#475569" strokeWidth="2"/>
          {/* axis arrow tips */}
          <polygon points={`${ISG_W-6},${ISG_MY} ${ISG_W-12},${ISG_MY-4} ${ISG_W-12},${ISG_MY+4}`} fill="#475569"/>
          <polygon points={`${ISG_MX},6 ${ISG_MX-4},12 ${ISG_MX+4},12`} fill="#475569"/>
          {/* axis labels */}
          <text x={ISG_W-14} y={ISG_MY+13} fill="#64748b" fontSize="10" fontWeight="bold">x</text>
          <text x={ISG_MX+6} y={15} fill="#64748b" fontSize="10" fontWeight="bold">y</text>
          <text x={ISG_MX+3} y={ISG_MY+13} fill="#475569" fontSize="8">O</text>
          {/* tick numbers - x axis */}
          {ISG_TICKS.map(v => (
            <g key={`xn${v}`}>
              <line x1={iax(v)} y1={ISG_MY-3} x2={iax(v)} y2={ISG_MY+3} stroke="#475569" strokeWidth="1"/>
              <text x={iax(v)-(v<=-10?10:v<0?7:3)} y={ISG_MY+13} fill="#4b5563" fontSize="7.5">{v}</text>
            </g>
          ))}
          {/* tick numbers - y axis */}
          {ISG_TICKS.map(v => (
            <g key={`yn${v}`}>
              <line x1={ISG_MX-3} y1={iay(v)} x2={ISG_MX+3} y2={iay(v)} stroke="#475569" strokeWidth="1"/>
              <text x={ISG_MX-16} y={iay(v)+3} fill="#4b5563" fontSize="7.5">{v}</text>
            </g>
          ))}
          {/* equation label badge */}
          <rect x={6} y={6} width={equationLabel.length*6+10} height={14} rx="3" fill="rgba(30,41,59,0.9)"/>
          <text x={11} y={16} fill="#94a3b8" fontSize="8.5" fontWeight="bold">{equationLabel}</text>

          {/* Step 3: draw line */}
          {step >= 3 && (
            <polyline
              points={linePoints.map(([x,y]) => `${iax(x)},${iay(y)}`).join(' ')}
              fill="none" stroke={lineColor} strokeWidth="2.8" strokeLinecap="round"
            />
          )}

          {/* Step 1: point1 (cyan) */}
          {step >= 1 && (
            <g>
              <circle cx={iax(point1[0])} cy={iay(point1[1])} r="7" fill="#22d3ee" stroke="#cffafe" strokeWidth="2"/>
              <circle cx={iax(point1[0])} cy={iay(point1[1])} r="11" fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.4"/>
              <rect x={p1lx-1} y={p1ly-9} width={`${String(point1).replace(',',' ').length*5+16}px`} height="12" rx="2" fill="rgba(6,12,30,0.85)"/>
              <text x={p1lx} y={p1ly} fill="#22d3ee" fontSize="9" fontWeight="bold">({point1[0]}, {point1[1]})</text>
            </g>
          )}

          {/* Step 2: point2 (violet) */}
          {step >= 2 && (
            <g>
              <circle cx={iax(point2[0])} cy={iay(point2[1])} r="7" fill="#a78bfa" stroke="#ede9fe" strokeWidth="2"/>
              <circle cx={iax(point2[0])} cy={iay(point2[1])} r="11" fill="none" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.4"/>
              <rect x={p2lx-1} y={p2ly-9} width={`${String(point2).replace(',',' ').length*5+16}px`} height="12" rx="2" fill="rgba(6,12,30,0.85)"/>
              <text x={p2lx} y={p2ly} fill="#a78bfa" fontSize="9" fontWeight="bold">({point2[0]}, {point2[1]})</text>
            </g>
          )}
        </svg>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-white/10 text-white/80 disabled:opacity-25 hover:bg-white/20 active:scale-95 transition-all">
          {navPrev}
        </button>
        <div className="flex gap-2 items-center">
          {steps.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              style={i === step ? { background: s.color } : {}}
              className={`rounded-full transition-all duration-300 ${i === step ? 'w-6 h-2.5' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'}`}/>
          ))}
        </div>
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)}
            style={{ background: steps[step+1 < 4 ? step+1 : step].bg, borderColor: steps[step+1 < 4 ? step+1 : step].color + "66", color: steps[step+1 < 4 ? step+1 : step].color }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-body border active:scale-95 transition-all hover:opacity-80">
            {navNext}
          </button>
        ) : (
          <button onClick={() => setStep(0)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-body bg-green-600/20 border border-green-500/40 text-green-300 active:scale-95 transition-all hover:bg-green-600/30">
            {navRepeat}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── MCQ Contoh 1: Identifikasi Persamaan dari Grafik ── */
const MCQGrafik1: React.FC = () => {
  const { language } = useLanguage();
  const t = T_GRAFIK[language];
  const [pilihan, setPilihan] = React.useState<string | null>(null);
  const [lihatPembahasan, setLihatPembahasan] = React.useState(false);

  const opsi = [
    { kode: "A", rumus: "y = x + 2",  katex: "y = x + 2",  benar: true  },
    { kode: "B", rumus: "y = 2x + 2", katex: "y = 2x + 2", benar: false },
    { kode: "C", rumus: "y = x - 2",  katex: "y = x - 2",  benar: false },
    { kode: "D", rumus: "y = -x + 2", katex: "y = -x + 2", benar: false },
  ];

  const sudahJawab = pilihan !== null;
  const benar = opsi.find(o => o.kode === pilihan)?.benar ?? false;

  /* koordinat SVG */
  const GW = 220, GH = 200, GMX = GW / 2, GMY = GH / 2, SCALE = 20;
  const gx = (x: number) => GMX + x * SCALE;
  const gy = (y: number) => GMY - y * SCALE;
  /* garis y = x + 2 */
  const pts: [number, number][] = [[-5,-3],[-4,-2],[-3,-1],[-2,0],[-1,1],[0,2],[1,3],[2,4],[3,5]];
  const linePts = pts.map(([x,y]) => `${gx(x)},${gy(y)}`).join(" ");

  return (
    <div className="space-y-4">
      {/* Pertanyaan */}
      <div className="bg-green-900/20 border border-green-500/25 rounded-xl p-4">
        <p className="text-xs font-bold text-green-300 uppercase tracking-wider mb-1 font-body">{t.soal}</p>
        <p className="text-sm text-white/90 font-body leading-relaxed">
          {t.mcq1_soal}
        </p>
      </div>

      {/* Grafik SVG */}
      <div className="flex justify-center">
        <div className="rounded-xl overflow-hidden border border-white/15" style={{ background: "rgba(6,12,30,0.95)", maxWidth: 240 }}>
          <svg viewBox={`0 0 ${GW} ${GH}`} width={GW} height={GH}>
            {/* Grid */}
            {[-4,-3,-2,-1,1,2,3,4].map(v => (
              <g key={v}>
                <line x1={gx(v)} y1={4} x2={gx(v)} y2={GH-4} stroke="#0f1f3d" strokeWidth="0.7"/>
                <line x1={4} y1={gy(v)} x2={GW-4} y2={gy(v)} stroke="#0f1f3d" strokeWidth="0.7"/>
              </g>
            ))}
            {/* Axes */}
            <line x1={4} y1={GMY} x2={GW-4} y2={GMY} stroke="#2d3f5e" strokeWidth="1.5"/>
            <line x1={GMX} y1={GH-4} x2={GMX} y2={4} stroke="#2d3f5e" strokeWidth="1.5"/>
            {/* Arrows */}
            <polygon points={`${GW-4},${GMY} ${GW-9},${GMY-3} ${GW-9},${GMY+3}`} fill="#2d3f5e"/>
            <polygon points={`${GMX},4 ${GMX-3},9 ${GMX+3},9`} fill="#2d3f5e"/>
            {/* Axis labels */}
            <text x={GW-13} y={GMY+10} fill="#3d5275" fontSize="8" fontWeight="bold">x</text>
            <text x={GMX+3} y={13} fill="#3d5275" fontSize="8" fontWeight="bold">y</text>
            {/* Tick labels */}
            {[-4,-2,2,4].map(v => (
              <g key={v}>
                <text x={gx(v)-3} y={GMY+12} fill="#3d5275" fontSize="7">{v}</text>
                <text x={GMX+3} y={gy(v)+3} fill="#3d5275" fontSize="7">{v}</text>
              </g>
            ))}
            {/* The line — hidden before answered */}
            <polyline points={linePts} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Key points */}
            <circle cx={gx(-2)} cy={gy(0)} r="4" fill="#facc15" stroke="#fde04788" strokeWidth="1.5"/>
            <text x={gx(-2)+5} y={gy(0)-5} fill="#fde047" fontSize="7.5" fontWeight="bold">(-2, 0)</text>
            <circle cx={gx(0)} cy={gy(2)} r="4" fill="#facc15" stroke="#fde04788" strokeWidth="1.5"/>
            <text x={gx(0)+5} y={gy(2)-5} fill="#fde047" fontSize="7.5" fontWeight="bold">(0, 2)</text>
          </svg>
        </div>
      </div>

      {/* Pilihan ganda */}
      <div className="grid grid-cols-1 gap-2">
        {opsi.map(({ kode, katex, benar: isBenar }) => {
          const dipilih = pilihan === kode;
          let style = "bg-slate-800/60 border-white/15 text-white/80";
          if (sudahJawab && dipilih && isBenar)  style = "bg-green-800/50 border-green-400/60 text-green-200";
          if (sudahJawab && dipilih && !isBenar) style = "bg-rose-800/40 border-rose-400/50 text-rose-200";
          if (sudahJawab && !dipilih && isBenar) style = "bg-green-900/30 border-green-500/40 text-green-300";
          return (
            <button
              key={kode}
              disabled={sudahJawab}
              onClick={() => { setPilihan(kode); setLihatPembahasan(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-body text-left transition-all duration-200 active:scale-98 disabled:cursor-default ${style}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                sudahJawab && dipilih && isBenar  ? "bg-green-500 text-white" :
                sudahJawab && dipilih && !isBenar ? "bg-rose-500 text-white" :
                sudahJawab && isBenar             ? "bg-green-700/60 text-green-200" :
                                                    "bg-white/10 text-white/60"
              }`}>{kode}</span>
              <span className="flex-1"><InlineMath math={katex} /></span>
              {sudahJawab && isBenar  && <span className="text-green-400 text-base shrink-0">✓</span>}
              {sudahJawab && dipilih && !isBenar && <span className="text-rose-400 text-base shrink-0">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback setelah jawab */}
      {sudahJawab && (
        <div className={`rounded-xl px-4 py-3 border text-sm font-body ${benar ? "bg-green-900/30 border-green-500/40 text-green-200" : "bg-rose-900/25 border-rose-500/35 text-rose-200"}`}>
          {benar ? t.mcq1_benar : t.mcq1_salah}
          {!benar && (
            <button onClick={() => { setPilihan(null); setLihatPembahasan(false); }}
              className="ml-3 text-xs underline text-rose-300 hover:text-white transition-colors">
              {t.mcq1_retry}
            </button>
          )}
        </div>
      )}

      {/* Tombol lihat pembahasan */}
      {sudahJawab && (
        <button onClick={() => setLihatPembahasan(v => !v)}
          className="w-full py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold font-body hover:bg-cyan-500/20 transition-all">
          {lihatPembahasan ? t.mcq1_tutup : t.mcq1_lihat}
        </button>
      )}

      {/* Pembahasan */}
      {lihatPembahasan && (
        <div className="rounded-xl border border-cyan-500/25 bg-slate-800/60 p-4 space-y-3 text-sm font-body" style={{ animation: "slideDown 0.3s ease-out" }}>
          <p className="text-cyan-300 font-bold">{t.mcq1_pem_title}</p>
          <p className="text-white/75 leading-relaxed">{t.mcq1_pem_intro}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: t.mcq1_sbx_label, titik: "(−2, 0)", warna: "text-cyan-300" },
              { label: t.mcq1_sby_label, titik: "(0, 2)", warna: "text-violet-300" },
            ].map(({ label, titik, warna }) => (
              <div key={label} className="bg-slate-900/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-white/40 mb-1">{label}</p>
                <p className={`font-bold text-sm ${warna}`}>{titik}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-900/60 rounded-lg p-3 space-y-1 text-xs">
            <p className="text-white/60">{t.mcq1_from_sby} <span className="text-yellow-300 font-bold">c = 2</span></p>
            <p className="text-white/60">{t.mcq1_grad_label} <InlineMath math="m = \dfrac{0-2}{-2-0} = \dfrac{-2}{-2} = 1" /></p>
            <p className="text-white/60">{t.mcq1_thus} <span className="text-green-300 font-bold">y = 1·x + 2 = x + 2</span> ✅</p>
          </div>
          <p className="text-white/50 text-xs">{t.mcq1_wrong_explain}</p>
        </div>
      )}
    </div>
  );
};

const GrafikPGLPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T_GRAFIK[language];
  const SH = ({ icon, iconColor, title }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4 border-b border-white/10">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
    </div>
  );
  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro_hook} <InlineMath math="x" /> {t.konsep_key_dan} <InlineMath math="y" />.
                </p>
                <figure className="flex flex-col items-center gap-2">
                  <img
                    src="/image_1781556662891.png"
                    alt={t.intro_img_alt}
                    className="w-full rounded-xl object-cover max-h-80 border border-cyan-500/20"
                  />
                  <figcaption className="text-xs text-white/50 font-body text-center italic">
                    {t.intro_fig_cap}{" "}
                    <a
                      href="https://id.pngtree.com/freebackground/sea-horizon-line-unAder-aquatic-photo_9262149.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white/80 transition-colors"
                    >
                      {t.intro_img_src}
                    </a>
                  </figcaption>
                </figure>
                {/* Judul visual grafik */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                  <p className="text-sm font-bold text-cyan-300 font-body tracking-wide whitespace-nowrap">{t.intro_vis_title}</p>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-500/40 to-transparent" />
                </div>

                {/* 4-panel visual intro */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "y = 2x + 1", color: "#22d3ee", pts: [[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]], desc: t.intro_panel_descs[0] },
                    { label: "y = -x + 2", color: "#a78bfa", pts: [[-2,4],[-1,3],[0,2],[1,1],[2,0],[3,-1]], desc: t.intro_panel_descs[1] },
                    { label: "y = 3", color: "#4ade80", pts: [[-3,3],[-1,3],[0,3],[1,3],[3,3]], desc: t.intro_panel_descs[2] },
                    { label: "x = 2", color: "#fb923c", pts: [[2,-4],[2,-2],[2,0],[2,2],[2,4]], desc: t.intro_panel_descs[3] },
                  ].map(({ label, color, pts, desc }) => (
                    <div key={label} className="bg-slate-900/60 border border-white/10 rounded-xl p-2">
                      <CoordSystem w={140} h={120} label={label}>
                        <polyline points={pts.map(([x,y])=>`${70+x*14},${60-y*11}`).join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                        {pts.map(([x,y], pi) => <circle key={pi} cx={70+x*14} cy={60-y*11} r="2.5" fill={color} />)}
                      </CoordSystem>
                      <p className="text-xs text-center mt-1" style={{ color }}>{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">{t.intro_funfact}</p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.sh_konsep} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-3">{t.konsep_summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">{t.konsep_p1}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { ...t.konsep_forms[0], rumus: "y = mx + c", color: "bg-cyan-900/40 border-cyan-500/40" },
                      { ...t.konsep_forms[1], rumus: "ax + by + c = 0", color: "bg-violet-900/40 border-violet-500/40" },
                      { ...t.konsep_forms[2], rumus: "x/a + y/b = 1", color: "bg-green-900/40 border-green-500/40" },
                    ].map(({ nama, rumus, ket, color }: { nama: string; rumus: string; ket: string; color: string }) => (
                      <div key={nama} className={`${color} border rounded-xl p-3`}>
                        <p className="text-xs text-white/60 font-body">{nama}</p>
                        <div className="my-1"><BlockMath math={rumus} /></div>
                        <p className="text-xs text-white/50">{ket}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anatomy visual */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-cyan-300 mb-3">{t.konsep_anat}</p>
                  <div className="relative flex flex-col items-center">
                    <div className="text-3xl font-bold font-mono text-white tracking-widest">y = mx + c</div>
                    <div className="flex gap-8 mt-3 text-xs font-body">
                      <div className="text-center">
                        <div className="w-1 h-6 bg-yellow-400 mx-auto mb-1" />
                        <span className="text-yellow-300 font-bold">m</span>
                        <p className="text-white/50 text-xs">{t.konsep_m}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-1 h-6 bg-cyan-400 mx-auto mb-1" />
                        <span className="text-cyan-300 font-bold">c</span>
                        <p className="text-white/50 text-xs">{t.konsep_c}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead><tr className="bg-cyan-900/40">
                      {t.konsep_tabel_h.map((h: string) => (
                        <th key={h} className="border border-cyan-500/30 px-3 py-2 text-cyan-200">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {t.konsep_tabel_rows.map(([p,m,sx,sy,a]: string[], i: number) => (
                        <tr key={i} className={i%2===0?"bg-slate-800/30":"bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-mono">{p}</td>
                          <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center">{m}</td>
                          <td className="border border-white/10 px-3 py-2 text-orange-300 text-center">{sx}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300 text-center">{sy}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60 text-center">{a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Ciri Khas Persamaan Garis Lurus ── */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg,#0d1b3e 0%,#0c1a2e 40%,#130d2e 100%)", border: "1px solid rgba(139,92,246,0.35)" }}>

                  {/* Header gradien */}
                  <div className="px-5 py-4 flex items-center gap-3" style={{ background: "linear-gradient(90deg,rgba(139,92,246,0.35) 0%,rgba(6,182,212,0.25) 60%,rgba(16,185,129,0.15) 100%)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "linear-gradient(135deg,#7c3aed,#0891b2)" }}>🔑</div>
                    <div>
                      <p className="font-body font-extrabold text-transparent text-sm bg-clip-text tracking-wide" style={{ backgroundImage: "linear-gradient(90deg,#c4b5fd,#67e8f9,#6ee7b7)" }}>
                        {t.konsep_ciri}
                      </p>
                      <p className="text-[11px] text-white/45 font-body">{t.konsep_ciri_sub}</p>
                    </div>
                  </div>

                  <div className="px-4 pb-5 pt-4 space-y-4">

                    {/* Tiga bentuk — 3 kartu warna */}
                    <div>
                      <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{t.konsep_from}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { rumus: "y = mx + c",      nama: t.konsep_forms3[0].nama, from: "#0e7490", to: "#0284c7", border: "#22d3ee" },
                          { rumus: "ax+by+c = 0",     nama: t.konsep_forms3[1].nama, from: "#5b21b6", to: "#7c3aed", border: "#a78bfa" },
                          { rumus: "x/a + y/b = 1",   nama: t.konsep_forms3[2].nama, from: "#065f46", to: "#0d9488", border: "#6ee7b7" },
                        ].map(({ rumus, nama, from, to, border }) => (
                          <div key={nama} className="rounded-xl p-2.5 text-center" style={{ background: `linear-gradient(135deg,${from}55,${to}33)`, border: `1px solid ${border}44` }}>
                            <p className="font-mono text-[10px] font-bold text-white leading-snug">{rumus}</p>
                            <p className="text-[9px] mt-0.5 font-body" style={{ color: border }}>{nama}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BIG highlight — pangkat 1 */}
                    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(250,204,21,0.12),rgba(234,179,8,0.06))", border: "2px solid rgba(250,204,21,0.45)" }}>
                      <div className="px-4 py-1.5 text-center text-[10px] font-bold tracking-widest uppercase font-body text-yellow-300/70" style={{ background: "rgba(250,204,21,0.10)", borderBottom: "1px solid rgba(250,204,21,0.20)" }}>
                        {t.konsep_key_title}
                      </div>
                      <div className="px-4 py-5 flex flex-col items-center gap-3 text-center">
                        {/* Big formula */}
                        <div className="flex items-end justify-center gap-1">
                          <span className="font-display font-black text-4xl" style={{ color: "#22d3ee", textShadow: "0 0 20px #22d3ee88" }}>x</span>
                          <span className="font-display font-black text-2xl mb-1 text-white/40"> {t.konsep_key_dan} </span>
                          <span className="font-display font-black text-4xl" style={{ color: "#a78bfa", textShadow: "0 0 20px #a78bfa88" }}>y</span>
                          <span className="font-display font-black text-2xl mb-1 text-white/50"> {t.konsep_key_pow} </span>
                          <span className="font-display font-black text-5xl" style={{ color: "#fde047", textShadow: "0 0 24px #fde04799" }}>1</span>
                        </div>
                        <p className="text-xs font-body text-white/60 max-w-xs leading-relaxed">
                          {t.konsep_key_no} <br />
                          {t.konsep_key_no2} <span className="text-yellow-200 font-bold">{t.konsep_key_pasti}</span>.
                        </p>
                      </div>
                    </div>

                    {/* Tips ingat cepat */}
                    <div className="rounded-xl px-4 py-3 flex gap-3 items-start" style={{ background: "linear-gradient(135deg,rgba(234,179,8,0.15),rgba(245,158,11,0.08))", border: "1px solid rgba(250,204,21,0.35)" }}>
                      <span className="text-xl shrink-0 mt-0.5">💡</span>
                      <p className="text-xs font-body text-yellow-100 leading-relaxed">
                        <strong className="text-yellow-300">{t.konsep_key_check}</strong> {t.konsep_key_check_b} <span className="text-yellow-200 font-bold">{t.konsep_key_check_em}</span> {t.konsep_key_check_cond} <span className="underline decoration-yellow-400 underline-offset-2 font-bold">{t.konsep_key_check_concl}</span>
                      </p>
                    </div>

                  </div>
                </div>

                {/* ── Animasi Interaktif: Persamaan Garis Lurus vs Bukan ── */}
                <div className="rounded-xl border border-violet-500/25 bg-slate-900/50 px-4 pb-4 pt-3">
                  <EquasiGarisLurusAnim />
                </div>

                {/* ── Jembatan deskripsi ke Laboratorium ── */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.08) 0%,rgba(139,92,246,0.08) 50%,rgba(16,185,129,0.06) 100%)", border: "1px solid rgba(6,182,212,0.25)" }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(90deg,rgba(6,182,212,0.15),rgba(139,92,246,0.10))", borderBottom: "1px solid rgba(6,182,212,0.15)" }}>
                    <span className="text-base">🔭</span>
                    <p className="font-body font-bold text-cyan-200 text-xs tracking-wide uppercase">{t.konsep_explore_title}</p>
                  </div>
                  <div className="px-4 py-4 space-y-2">
                    <p className="text-sm font-body text-white/85 leading-relaxed">
                      {t.konsep_explore_p1a}{" "}
                      <span className="text-cyan-300 font-semibold">{t.konsep_explore_kw1}</span>,{" "}
                      <span className="text-violet-300 font-semibold">{t.konsep_explore_kw2}</span>,{" "}
                      <span className="text-emerald-300 font-semibold">{t.konsep_explore_kw3}</span>
                      {t.konsep_explore_p1b}
                    </p>
                    <p className="text-sm font-body text-white/75 leading-relaxed">
                      {t.konsep_explore_p2a}{" "}
                      <strong className="text-white">{t.konsep_explore_p2b}</strong>{" "}
                      {t.konsep_explore_p2c}{" "}
                      <span className="text-cyan-300 font-semibold"> {t.konsep_explore_lab}</span>{" "}
                      {t.konsep_explore_p2d}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(t.konsep_chips as { label: string; warna: string; ket: string }[]).map(({ label, warna, ket }) => (
                        <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${warna}15`, border: `1px solid ${warna}35` }}>
                          <span className="font-mono text-[11px] font-bold" style={{ color: warna }}>{label}</span>
                          <span className="text-[10px] text-white/40 font-body">({ket})</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/45 font-body italic">{t.konsep_explore_hint}</p>
                  </div>
                </div>

                {/* ── GeoGebra-style interactive graphing tool ── */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🖥️</span>
                    <p className="text-sm font-bold text-cyan-300 font-body">{t.konsep_lab_title}</p>
                  </div>
                  <p className="text-xs text-white/60 font-body leading-relaxed">
                    {t.konsep_lab_desc}
                  </p>
                  <GeoGebraGrapher />
                  <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                    <p className="text-xs text-violet-200 font-body">
                      <strong>{t.konsep_lab_coba}</strong> <span className="font-mono">y = 3x + 2</span> {t.konsep_lab_then} <span className="font-mono">3x - 2y + 6 = 0</span> {t.konsep_lab_then} <span className="font-mono">x/4 + y/3 = 1</span> — {t.konsep_lab_note}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* METODE 1 — 2 TITIK POTONG SUMBU */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="titik-potong" icon={<BookOpen className="w-5 h-5" />} iconColor="text-orange-400" title={t.sh_titikpotong} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.titikpotong_p1}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-cyan-900/20 border border-cyan-500/40 rounded-xl p-4">
                    <p className="text-sm font-bold text-cyan-300 mb-2">{t.tp_sbx_title}</p>
                    <p className="text-xs text-white/70 mb-2">{t.tp_sbx_cond} <strong className="text-white">y = 0</strong></p>
                    <div className="bg-cyan-900/30 rounded-lg p-2 text-xs text-center">
                      <BlockMath math="y = 0 \Rightarrow ax + b(0) = c" />
                      <BlockMath math="x = \frac{c}{a}" />
                    </div>
                    <p className="text-xs text-white/50 mt-2 text-center">{t.tp_sbx_pt} <InlineMath math="\left(\frac{c}{a},\ 0\right)" /></p>
                  </div>
                  <div className="bg-violet-900/20 border border-violet-500/40 rounded-xl p-4">
                    <p className="text-sm font-bold text-violet-300 mb-2">{t.tp_sby_title}</p>
                    <p className="text-xs text-white/70 mb-2">{t.tp_sby_cond} <strong className="text-white">x = 0</strong></p>
                    <div className="bg-violet-900/30 rounded-lg p-2 text-xs text-center">
                      <BlockMath math="x = 0 \Rightarrow a(0) + by = c" />
                      <BlockMath math="y = \frac{c}{b}" />
                    </div>
                    <p className="text-xs text-white/50 mt-2 text-center">{t.tp_sby_pt} <InlineMath math="\left(0,\ \frac{c}{b}\right)" /></p>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-bold text-white mb-3">🖊️</p>
                  <div className="space-y-2">
                    {t.titikpotong_steps.map(({ label, desc }: { label: string; desc: string }, idx: number) => {
                      const colors = ["border-cyan-500/30 bg-cyan-900/10","border-violet-500/30 bg-violet-900/10","border-green-500/30 bg-green-900/10","border-orange-500/30 bg-orange-900/10"];
                      return (
                        <div key={idx} className={`border ${colors[idx]} rounded-lg p-3 flex gap-3 text-sm font-body`}>
                          <span className="font-display font-bold text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center shrink-0">{idx+1}</span>
                          <div><p className="text-white font-semibold">{label}</p><p className="text-white/60 text-xs">{desc}</p></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contoh Metode Titik Potong Sumbu */}
                <p className="text-sm font-bold text-white/90 font-body">{t.tp_contoh}</p>
                <div className="flex flex-col gap-5">

                  {/* Contoh 1 */}
                  <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-cyan-300 font-body uppercase tracking-wide">{t.ex_label1}</p>
                    <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">{t.tp_ex1_soal} <InlineMath math="y = 2x + 4" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">{t.tp_pem}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-cyan-900/40">
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">x</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">y</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">{t.tp_tbl_titik}</th>
                          <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{t.tp_tbl_ket}</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-2</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(-2, 0)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.tp_tbl_sbx}</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">4</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(0, 4)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.tp_tbl_sby}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="y = 2x + 4"
                      linePoints={[[-5,-6],[-4,-4],[-3,-2],[-2,0],[-1,2],[0,4],[1,6]]}
                      point1={[-2, 0]}
                      point2={[0, 4]}
                      lineColor="#22d3ee"
                      navPrev={t.prev} navNext={t.next} navRepeat={t.repeat}
                      steps={(t.tp_ex1_steps as { label: string; desc: string }[]).map((s, i) => ({
                        ...s,
                        color: ["#94a3b8","#22d3ee","#a78bfa","#4ade80"][i],
                        bg: ["rgba(148,163,184,0.08)","rgba(34,211,238,0.1)","rgba(167,139,250,0.1)","rgba(74,222,128,0.08)"][i],
                      }))}
                    />
                  </div>

                  {/* Contoh 2 */}
                  <div className="bg-slate-800/60 border border-violet-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-violet-300 font-body uppercase tracking-wide">{t.ex_label2}</p>
                    <div className="bg-violet-900/20 border border-violet-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">{t.tp_ex2_soal} <InlineMath math="3x - 5y = 15" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">{t.tp_pem}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-violet-900/40">
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">x</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">y</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">{t.tp_tbl_titik}</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">{t.tp_tbl_ket}</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">5</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(5, 0)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.tp_tbl_sbx}</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-3</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(0, -3)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.tp_tbl_sby}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="3x - 5y = 15"
                      linePoints={[[-5,-6],[0,-3],[5,0],[10,3]]}
                      point1={[5, 0]}
                      point2={[0, -3]}
                      lineColor="#a78bfa"
                      navPrev={t.prev} navNext={t.next} navRepeat={t.repeat}
                      steps={(t.tp_ex2_steps as { label: string; desc: string }[]).map((s, i) => ({
                        ...s,
                        color: ["#94a3b8","#22d3ee","#a78bfa","#4ade80"][i],
                        bg: ["rgba(148,163,184,0.08)","rgba(34,211,238,0.1)","rgba(167,139,250,0.1)","rgba(74,222,128,0.08)"][i],
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* METODE 2 — 2 TITIK ACAK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="titik-acak" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-green-400" title={t.sh_titikacak} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.titikacak_p1}</p>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-bold text-white mb-3">🖊️</p>
                  <div className="space-y-2">
                    {t.titikacak_steps.map(({ label, desc }: { label: string; desc: string }, idx: number) => {
                      const colors = ["border-green-500/30 bg-green-900/10","border-teal-500/30 bg-teal-900/10","border-cyan-500/30 bg-cyan-900/10","border-orange-500/30 bg-orange-900/10"];
                      return (
                        <div key={idx} className={`border ${colors[idx]} rounded-lg p-3 flex gap-3 text-sm font-body`}>
                          <span className="font-display font-bold text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center shrink-0">{idx+1}</span>
                          <div><p className="text-white font-semibold">{label}</p><p className="text-white/60 text-xs">{desc}</p></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body">{t.ta_tip}</p>
                </div>

                {/* Contoh Metode Dua Titik Acak */}
                <p className="text-sm font-bold text-white/90 font-body">{t.tp_contoh}</p>
                <div className="flex flex-col gap-5">

                  {/* Contoh 1 */}
                  <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-green-300 font-body uppercase tracking-wide">{t.ex_label1}</p>
                    <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">{t.ta_ex1_soal} <InlineMath math="y = x + 2" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">{t.tp_pem}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-green-900/40">
                          <th className="border border-green-500/30 px-3 py-2 text-green-200">x</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200">y</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200">{t.tp_tbl_titik}</th>
                          <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">{t.tp_tbl_ket}</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-2</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">0</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(-2, 0)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.ta_tbl_r1} (x = -2 {t.ta_tbl_dipilih})</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">2</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">4</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(2, 4)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.ta_tbl_r2} (x = 2 {t.ta_tbl_dipilih})</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="y = x + 2"
                      linePoints={[[-4,-2],[-2,0],[0,2],[2,4],[4,6]]}
                      point1={[-2, 0]}
                      point2={[2, 4]}
                      lineColor="#4ade80"
                      navPrev={t.prev} navNext={t.next} navRepeat={t.repeat}
                      steps={(t.ta_ex1_steps as { label: string; desc: string }[]).map((s, i) => ({
                        ...s,
                        color: ["#94a3b8","#22d3ee","#a78bfa","#4ade80"][i],
                        bg: ["rgba(148,163,184,0.08)","rgba(34,211,238,0.1)","rgba(167,139,250,0.1)","rgba(74,222,128,0.08)"][i],
                      }))}
                    />
                  </div>

                  {/* Contoh 2 */}
                  <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-orange-300 font-body uppercase tracking-wide">{t.ex_label2}</p>
                    <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-sm text-white font-body">{t.ta_ex2_soal} <InlineMath math="y = -2x + 4" />!</p>
                    </div>
                    <p className="text-xs font-semibold text-white/70 font-body">{t.tp_pem}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse">
                        <thead><tr className="bg-orange-900/40">
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200">x</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200">y</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200">{t.tp_tbl_titik}</th>
                          <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">{t.tp_tbl_ket}</th>
                        </tr></thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">1</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">2</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(1, 2)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.ta_tbl_r1} (x = 1 {t.ta_tbl_dipilih})</td>
                          </tr>
                          <tr className="bg-slate-700/20">
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">3</td>
                            <td className="border border-white/10 px-3 py-2 text-yellow-300 text-center font-mono">-2</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 text-center font-bold">(3, -2)</td>
                            <td className="border border-white/10 px-3 py-2 text-white/50">{t.ta_tbl_r2} (x = 3 {t.ta_tbl_dipilih})</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <InteractiveStepGraph
                      equationLabel="y = -2x + 4"
                      linePoints={[[-1,6],[0,4],[1,2],[2,0],[3,-2],[4,-4]]}
                      point1={[1, 2]}
                      point2={[3, -2]}
                      lineColor="#fb923c"
                      navPrev={t.prev} navNext={t.next} navRepeat={t.repeat}
                      steps={(t.ta_ex2_steps as { label: string; desc: string }[]).map((s, i) => ({
                        ...s,
                        color: ["#94a3b8","#22d3ee","#a78bfa","#fb923c"][i],
                        bg: ["rgba(148,163,184,0.08)","rgba(34,211,238,0.1)","rgba(167,139,250,0.1)","rgba(251,146,60,0.08)"][i],
                      }))}
                    />
                  </div>
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
                  <p className="text-sm text-white/85 font-body">{t.c1_soal_a} <InlineMath math="3x - 2y + 6 = 0" />. {t.c1_soal_b}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-cyan-300 font-body">{t.pem}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">{t.c1_ubah}</p>
                      <BlockMath math="3x - 2y + 6 = 0" />
                      <BlockMath math="-2y = -3x - 6" />
                      <BlockMath math="y = \frac{3}{2}x + 3" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-800/50 rounded-lg p-2 text-xs">
                        <p className="text-cyan-300 font-semibold mb-1">{t.c1_sbx}</p>
                        <BlockMath math="0 = \frac{3}{2}x + 3 \Rightarrow x = -2" />
                        <p className="text-green-300 font-bold">(-2, 0)</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-xs">
                        <p className="text-violet-300 font-semibold mb-1">{t.c1_sby}</p>
                        <BlockMath math="y = \frac{3}{2}(0) + 3 = 3" />
                        <p className="text-green-300 font-bold">(0, 3)</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2 text-xs">{t.c3_graf_title} 3x − 2y + 6 = 0:</p>
                      <CoordSystem w={W} h={H} label="3x−2y+6=0">
                        <polyline
                          points={[[-4,-3],[-2,0],[0,3],[2,6]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')}
                          fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"
                        />
                        {[[-2,0],[0,3]].map(([x,y]) => (
                          <g key={`${x},${y}`}>
                            <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                            <text x={toX(x)+6} y={toY(y)-4} fill="#fde047" fontSize="8">({x},{y})</text>
                          </g>
                        ))}
                      </CoordSystem>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="text-sm font-bold text-green-300 font-body">{t.c1_ans_b}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_contoh2} />
            <div className="px-5 pb-5 pt-4 space-y-4">
              <Badge label={t.sedang} color="bg-yellow-700/60 text-yellow-200" />
              <MCQGrafik1 />

                  {/* ── PEMBAHASAN ── */}
                  <div className="bg-slate-700/40 border border-yellow-500/25 rounded-xl p-4 space-y-4">
                    <p className="text-sm font-semibold text-yellow-300 font-body">{t.c2_pem_title}</p>

                    {/* Langkah 1 — baca titik dari grafik */}
                    <div className="bg-slate-800/60 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-bold text-cyan-300 font-body">{t.c2_l1_title}</p>
                      <p className="text-xs text-white/70 font-body leading-relaxed">
                        {t.c2_l1_desc}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-2.5 text-center">
                          <p className="text-[10px] text-white/50 font-body mb-1">{t.c2_pt1}</p>
                          <p className="text-base font-bold text-cyan-300 font-mono">(−2, 0)</p>
                        </div>
                        <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-2.5 text-center">
                          <p className="text-[10px] text-white/50 font-body mb-1">{t.c2_pt2}</p>
                          <p className="text-base font-bold text-violet-300 font-mono">(0, 2)</p>
                        </div>
                      </div>
                    </div>

                    {/* Langkah 2 — substitusi ke tiap opsi */}
                    <div className="bg-slate-800/60 rounded-xl p-3 space-y-3">
                      <p className="text-xs font-bold text-yellow-300 font-body">{t.c2_l2_title}</p>
                      <p className="text-xs text-white/65 font-body leading-relaxed">
                        {t.c2_l2_desc} <strong className="text-white">{t.c2_l2_kw}</strong> {t.c2_l2_for} <em>{t.c2_l2_both}</em> {t.c2_l2_end}
                      </p>

                      {/* Opsi A */}
                      <div className="rounded-xl border border-green-500/40 bg-green-900/15 p-3 space-y-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0">A</span>
                          <InlineMath math="y = x + 2" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-body">
                          <div className="bg-slate-900/50 rounded-lg p-2 space-y-0.5">
                            <p className="text-white/50">{t.c2_nia_yes} <span className="text-cyan-300 font-bold">(−2, 0)</span>:</p>
                            <BlockMath math="y = -2 + 2 = 0 \checkmark" />
                            <p className="text-green-400 font-bold text-center">{t.c2_nia_yes2} 0 ✓</p>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-2 space-y-0.5">
                            <p className="text-white/50">{t.c2_nia_yes} <span className="text-violet-300 font-bold">(0, 2)</span>:</p>
                            <BlockMath math="y = 0 + 2 = 2 \checkmark" />
                            <p className="text-green-400 font-bold text-center">{t.c2_nia_yes2} 2 ✓</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-green-300 font-body text-center pt-1">{t.c2_pA_ok}</p>
                      </div>

                      {/* Opsi B */}
                      <div className="rounded-xl border border-red-500/25 bg-red-900/10 p-3 space-y-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-full bg-red-700/70 text-white text-xs font-bold flex items-center justify-center shrink-0">B</span>
                          <InlineMath math="y = 2x + 2" />
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-2 text-xs font-body">
                          <p className="text-white/50 mb-0.5">{t.c2_nia_yes} <span className="text-cyan-300 font-bold">(−2, 0)</span>:</p>
                          <BlockMath math="y = 2(-2) + 2 = -4 + 2 = -2 \neq 0" />
                          <p className="text-red-400 font-bold text-center">{t.c2_nib}</p>
                        </div>
                        <p className="text-xs text-red-300/70 font-body text-center">{t.c2_pB_ko}</p>
                      </div>

                      {/* Opsi C */}
                      <div className="rounded-xl border border-red-500/25 bg-red-900/10 p-3 space-y-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-full bg-red-700/70 text-white text-xs font-bold flex items-center justify-center shrink-0">C</span>
                          <InlineMath math="y = x - 2" />
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-2 text-xs font-body">
                          <p className="text-white/50 mb-0.5">{t.c2_nia_yes} <span className="text-cyan-300 font-bold">(−2, 0)</span>:</p>
                          <BlockMath math="y = -2 - 2 = -4 \neq 0" />
                          <p className="text-red-400 font-bold text-center">{t.c2_nic}</p>
                        </div>
                        <p className="text-xs text-red-300/70 font-body text-center">{t.c2_pC_ko}</p>
                      </div>

                      {/* Opsi D */}
                      <div className="rounded-xl border border-red-500/25 bg-red-900/10 p-3 space-y-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-full bg-red-700/70 text-white text-xs font-bold flex items-center justify-center shrink-0">D</span>
                          <InlineMath math="y = -x + 2" />
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-2 text-xs font-body">
                          <p className="text-white/50 mb-0.5">{t.c2_nia_yes} <span className="text-cyan-300 font-bold">(−2, 0)</span>:</p>
                          <BlockMath math="y = -(-2) + 2 = 2 + 2 = 4 \neq 0" />
                          <p className="text-red-400 font-bold text-center">{t.c2_nid}</p>
                        </div>
                        <p className="text-xs text-red-300/70 font-body text-center">{t.c2_pD_ko}</p>
                      </div>
                    </div>

                    {/* Kesimpulan */}
                    <div className="bg-green-500/10 border border-green-500/35 rounded-xl p-3">
                      <p className="text-sm font-bold text-green-300 font-body mb-1">{t.c2_concl_title} <InlineMath math="y = x + 2" /></p>
                      <p className="text-xs text-white/65 font-body leading-relaxed">{t.c2_concl_desc} <strong>{t.c2_concl_both}</strong> {t.c2_concl_end}</p>
                    </div>

                    {/* Tips */}
                    <div className="bg-yellow-500/10 border border-yellow-500/35 rounded-xl p-3">
                      <p className="text-xs font-bold text-yellow-300 font-body mb-1">{t.c2_tip_title}</p>
                      <div className="space-y-1 text-xs text-white/70 font-body">
                        {(t.c2_tip_items as string[]).map((item, i) => (
                          <p key={i}>{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
            </div>
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.sh_contoh3} />
            {true && (() => {
              const W3 = 320, H3 = 280, MX3 = 160, MY3 = 140, SC3 = 22;
              const tx = (x: number) => MX3 + x * SC3;
              const ty = (y: number) => MY3 - y * SC3;
              const ticks3 = [-6,-5,-4,-3,-2,-1,1,2,3,4,5,6];
              return (
                <div className="px-5 pb-5 space-y-4">
                  <Badge label={t.sulit} color="bg-red-700/60 text-red-200" />
                  <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                    <p className="text-sm font-semibold text-red-300 mb-2 font-body">{t.soal}</p>
                    <p className="text-sm text-white/85 font-body">{t.c3_soal_b} <InlineMath math="\ell_1: x + y = 4" /> {t.c3_soal_dan} <InlineMath math="\ell_2: 2x - y = 2" /> {t.c3_soal_end}</p>
                  </div>
                  <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-cyan-300 font-body">{t.pem}</p>
                    <div className="space-y-3 text-sm font-body">

                      {/* Tabel titik potong l1 */}
                      <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                        <p className="text-cyan-300 font-semibold text-xs">{t.c3_bantu1} <InlineMath math="\ell_1: x + y = 4" /> <span className="text-white/50">(y = 4 − x)</span></p>
                        <div className="overflow-x-auto">
                          <table className="text-xs font-body border-collapse w-full">
                            <thead><tr className="bg-cyan-900/40">
                              <th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200">x</th>
                              <th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200">y = 4 − x</th>
                              <th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200">{t.tp_tbl_titik}</th>
                            </tr></thead>
                            <tbody>
                              <tr className="bg-slate-800/30">
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">0</td>
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">4</td>
                                <td className="border border-white/10 px-3 py-1.5 text-green-300 text-center font-bold">(0, 4)</td>
                              </tr>
                              <tr className="bg-slate-700/20">
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">4</td>
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">0</td>
                                <td className="border border-white/10 px-3 py-1.5 text-green-300 text-center font-bold">(4, 0)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Tabel titik potong l2 */}
                      <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                        <p className="text-pink-300 font-semibold text-xs">{t.c3_bantu2} <InlineMath math="\ell_2: 2x - y = 2" /> <span className="text-white/50">(y = 2x − 2)</span></p>
                        <div className="overflow-x-auto">
                          <table className="text-xs font-body border-collapse w-full">
                            <thead><tr className="bg-pink-900/40">
                              <th className="border border-pink-500/30 px-3 py-1.5 text-pink-200">x</th>
                              <th className="border border-pink-500/30 px-3 py-1.5 text-pink-200">y = 2x − 2</th>
                              <th className="border border-pink-500/30 px-3 py-1.5 text-pink-200">{t.tp_tbl_titik}</th>
                            </tr></thead>
                            <tbody>
                              <tr className="bg-slate-800/30">
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">0</td>
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">−2</td>
                                <td className="border border-white/10 px-3 py-1.5 text-green-300 text-center font-bold">(0, −2)</td>
                              </tr>
                              <tr className="bg-slate-700/20">
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">1</td>
                                <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-mono">0</td>
                                <td className="border border-white/10 px-3 py-1.5 text-green-300 text-center font-bold">(1, 0)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Eliminasi */}
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-cyan-300 font-semibold mb-1 text-xs">{t.c3_elim_title}</p>
                        <BlockMath math="\ell_1:\quad x + y = 4 \quad \cdots (1)" />
                        <BlockMath math="\ell_2:\quad 2x - y = 2 \quad \cdots (2)" />
                        <p className="text-white/60 text-xs mb-1">{t.c3_sum}</p>
                        <BlockMath math="3x = 6 \Rightarrow x = 2" />
                        <p className="text-white/60 text-xs mb-1">{t.c3_sub_eq1}</p>
                        <BlockMath math="2 + y = 4 \Rightarrow y = 2" />
                      </div>

                      {/* Grafik besar */}
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-orange-300 font-semibold mb-3 text-xs">{t.c3_graf_title} <InlineMath math="\ell_1" /> {t.c3_graf_dan} <InlineMath math="\ell_2" />:</p>
                        <svg viewBox={`0 0 ${W3} ${H3}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.97)" }}>
                          {/* grid */}
                          {ticks3.concat([0]).map(v => (
                            <g key={v}>
                              <line x1={tx(v)} y1={4} x2={tx(v)} y2={H3-4} stroke={v===0?"#334155":"#0f1f3d"} strokeWidth={v===0?"1":"0.8"}/>
                              <line x1={4} y1={ty(v)} x2={W3-4} y2={ty(v)} stroke={v===0?"#334155":"#0f1f3d"} strokeWidth={v===0?"1":"0.8"}/>
                            </g>
                          ))}
                          {/* axes */}
                          <line x1={6} y1={MY3} x2={W3-6} y2={MY3} stroke="#475569" strokeWidth="2"/>
                          <line x1={MX3} y1={H3-6} x2={MX3} y2={6} stroke="#475569" strokeWidth="2"/>
                          <polygon points={`${W3-6},${MY3} ${W3-12},${MY3-4} ${W3-12},${MY3+4}`} fill="#475569"/>
                          <polygon points={`${MX3},6 ${MX3-4},12 ${MX3+4},12`} fill="#475569"/>
                          {/* axis labels */}
                          <text x={W3-16} y={MY3+13} fill="#64748b" fontSize="11" fontWeight="bold">x</text>
                          <text x={MX3+6} y={16} fill="#64748b" fontSize="11" fontWeight="bold">y</text>
                          <text x={MX3+4} y={MY3+13} fill="#475569" fontSize="9">O</text>
                          {/* tick numbers */}
                          {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
                            <g key={`t${v}`}>
                              <line x1={tx(v)} y1={MY3-3} x2={tx(v)} y2={MY3+3} stroke="#475569" strokeWidth="1"/>
                              <text x={tx(v)-(v<-9?11:v<0?8:4)} y={MY3+14} fill="#4b5563" fontSize="9">{v}</text>
                              <line x1={MX3-3} y1={ty(v)} x2={MX3+3} y2={ty(v)} stroke="#475569" strokeWidth="1"/>
                              <text x={MX3-18} y={ty(v)+4} fill="#4b5563" fontSize="9">{v}</text>
                            </g>
                          ))}
                          {/* ℓ1: x+y=4 → y=4-x, points: (-1,5)→(5,-1) */}
                          <polyline
                            points={[[-1,5],[0,4],[1,3],[2,2],[3,1],[4,0],[5,-1]].map(([x,y])=>`${tx(x)},${ty(y)}`).join(' ')}
                            fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"
                          />
                          {/* ℓ2: 2x-y=2 → y=2x-2, points: (-1,-4)→(3,4) */}
                          <polyline
                            points={[[-1,-4],[0,-2],[1,0],[2,2],[3,4]].map(([x,y])=>`${tx(x)},${ty(y)}`).join(' ')}
                            fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round"
                          />
                          {/* key axis intercepts - l1 */}
                          <circle cx={tx(0)} cy={ty(4)} r="5" fill="#22d3ee" stroke="#cffafe" strokeWidth="1.5"/>
                          <text x={tx(0)+8} y={ty(4)+4} fill="#22d3ee" fontSize="9" fontWeight="bold">(0, 4)</text>
                          <circle cx={tx(4)} cy={ty(0)} r="5" fill="#22d3ee" stroke="#cffafe" strokeWidth="1.5"/>
                          <text x={tx(4)-36} y={ty(0)-8} fill="#22d3ee" fontSize="9" fontWeight="bold">(4, 0)</text>
                          {/* key axis intercepts - l2 */}
                          <circle cx={tx(0)} cy={ty(-2)} r="5" fill="#f472b6" stroke="#fce7f3" strokeWidth="1.5"/>
                          <text x={tx(0)+8} y={ty(-2)+4} fill="#f472b6" fontSize="9" fontWeight="bold">(0, −2)</text>
                          <circle cx={tx(1)} cy={ty(0)} r="5" fill="#f472b6" stroke="#fce7f3" strokeWidth="1.5"/>
                          <text x={tx(1)+8} y={ty(0)-8} fill="#f472b6" fontSize="9" fontWeight="bold">(1, 0)</text>
                          {/* intersection point */}
                          <circle cx={tx(2)} cy={ty(2)} r="9" fill="#facc15" stroke="#fde047" strokeWidth="2.5"/>
                          <circle cx={tx(2)} cy={ty(2)} r="14" fill="none" stroke="#facc1566" strokeWidth="1.5"/>
                          <text x={tx(2)+13} y={ty(2)-6} fill="#fde047" fontSize="11" fontWeight="bold">(2, 2)</text>
                          {/* line labels */}
                          <rect x={tx(-0.8)-2} y={ty(4.8)-10} width={22} height={14} rx="3" fill="rgba(6,12,30,0.8)"/>
                          <text x={tx(-0.8)} y={ty(4.8)} fill="#22d3ee" fontSize="11" fontWeight="bold">ℓ₁</text>
                          <rect x={tx(2.6)-2} y={ty(3.2)-10} width={22} height={14} rx="3" fill="rgba(6,12,30,0.8)"/>
                          <text x={tx(2.6)} y={ty(3.2)} fill="#f472b6" fontSize="11" fontWeight="bold">ℓ₂</text>
                        </svg>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                        <p className="text-sm font-bold text-red-300 font-body">{t.c3_ans_main}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sh_rangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {t.rang_items.map((item: string) => (
                    <div key={item} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80">{item}</p></div>
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
export default GrafikPGLPage;
