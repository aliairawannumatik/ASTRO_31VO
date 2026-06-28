import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, GitBranch } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "PENGERTIAN RELASI DAN PENYAJIANNYA",
    subtitle: "Hubungkan Dua Himpunan dengan Aturan yang Tepat!",
    breadcrumb: "Kelas 8 · Relasi dan Fungsi · Materi Matematika",
    secIntro: "🌟 Relasi — Menghubungkan Dua Dunia",
    secKonsep: "📘 Konsep Dasar Relasi",
    secData: "📋 Data: Siswa dan Ekstrakulikuler",
    secPenyajian: "🗂️ Cara Menyajikan Relasi",
    secContoh: "✏️ Contoh Soal",
    secRangkuman: "📌 Rangkuman & Kesimpulan",
    introP: "Bayangkan kamu punya daftar nama siswa dan daftar mata pelajaran favorit mereka. Hubungan \"siapa suka apa\" itulah yang disebut",
    introKata: "relasi",
    introP2: "! Dalam matematika, relasi adalah",
    introBold: "aturan yang menghubungkan anggota satu himpunan ke anggota himpunan lain",
    introExTitle: "🔍 Contoh Relasi dalam Kehidupan Sehari-hari",
    ex1r: "Siswa → Mata Pelajaran Favorit", ex1k: "Dinda suka Matematika, Rafi suka IPA",
    ex2r: "Buah → Warnanya",               ex2k: "Apel merah, Pisang kuning, Anggur ungu",
    ex3r: "Bilangan → Kuadratnya",          ex3k: "2 → 4, 3 → 9, 4 → 16",
    exContoh: "Contoh:",
    whyTitle: "Mengapa perlu belajar relasi?",
    whyText: "Relasi adalah fondasi dari konsep fungsi — salah satu topik paling fundamental dalam matematika dan pemrograman komputer!",
    konsepTitle: "🎯 Ringkasan Intisari",
    konsepP: "Diberikan dua himpunan",
    konsepDan: "dan",
    konsepRelasi: ", relasi dari A ke B adalah aturan yang memasangkan",
    konsepSebagian: "sebagian atau seluruh",
    konsepAnggota: "anggota himpunan",
    konsepDengan: "dengan anggota himpunan",
    konsepDomainPre: "Anggota himpunan",
    konsepDomainPost: "disebut",
    konsepDomainName: "domain (daerah asal)",
    konsepKodoPre: "dan anggota himpunan",
    konsepKodoPost: "disebut",
    konsepKodoName: "kodomain (daerah kawan)",
    konsepNote: "⚠️ Ingat:",
    konsepNoteText: "Range",
    konsepNoteSub: "Kodomain, artinya range adalah bagian dari kodomain. Tidak semua anggota kodomain harus dipasangkan!",
    dataIntro: "Perhatikan data berikut. Di sebuah sekolah, terdapat daftar siswa dan ekstrakulikuler yang mereka ikuti. Data ini akan kita gunakan untuk memahami cara-cara menyajikan relasi.",
    setALabel: "🎓 Himpunan A — Siswa",
    setBLabel: "🏅 Himpunan B — Ekskul",
    students: ["Enzo", "Justin", "Phoenix", "Wren"],
    sports: ["Badminton", "Basket", "Futsal", "Renang", "Voly"],
    relasiLabel: "🔗 Relasi: \"mengikuti ekstrakulikuler\"",
    studentSports: [
      { name: "Enzo",    sports: ["Badminton", "Basket", "Futsal"], color: "text-cyan-300" },
      { name: "Justin",  sports: ["Basket", "Renang"],              color: "text-green-300" },
      { name: "Phoenix", sports: ["Voly", "Futsal"],                color: "text-orange-300" },
      { name: "Wren",    sports: [],                                color: "text-red-300" },
    ],
    noSport: "tidak mengikuti ekstrakulikuler apapun",
    domainLabel: "Domain (A) = ",
    kodoLabel: "Kodomain (B) = ",
    rangeLabel: "Range = ",
    rangeNote: "(semua ekskul ada yang mengikuti)",
    wrenNote: "📌 Catatan:",
    wrenNoteText: "Wren tidak mengikuti ekstrakulikuler apapun, sehingga ia tidak memiliki pasangan di himpunan B. Namun Wren tetap termasuk anggota domain karena ia adalah anggota himpunan A.",
    svgA: "A (Siswa)",
    svgB: "B (Ekskul)",
    svgWrenNote: "Wren tidak memiliki pasangan",
    penyajianIntro: "Relasi dapat disajikan dengan",
    penyajian4: "4 cara",
    diag1Title: "1️⃣ Diagram Panah",
    diag1Desc: "Dua oval mewakili himpunan A (siswa) dan B (ekskul), dihubungkan dengan anak panah relasi \"mengikuti\".",
    wrenLegend: "Wren (∅)",
    diag2Title: "2️⃣ Himpunan Pasangan Berurutan",
    diag2Desc: "Ditulis sebagai kumpulan pasangan",
    diag2Di: "di mana",
    diag2Dan: "dan",
    diag2Total: "Total: 7 pasangan berurutan · Wren tidak memiliki pasangan",
    diag3Title: "3️⃣ Diagram Kartesius",
    diag3Desc: "Setiap pasangan digambar sebagai titik. Sumbu-x untuk siswa (domain), sumbu-y untuk ekskul (range).",
    domAxis: "Siswa (Domain)",
    rangeAxis: "Ekskul (Range)",
    fromPres: "📌 Dari ketiga penyajian di atas, kita dapat mengidentifikasi:",
    warnNote: "⚠️ Perhatikan:",
    warnText: "Wren adalah anggota domain tetapi tidak memiliki pasangan di kodomain — ia tidak muncul dalam himpunan pasangan berurutan maupun diagram. Range = Kodomain karena semua ekskul ada yang mengikuti.",
    tipLabel: "💡 Tips:",
    tipText: "Diagram panah paling mudah untuk memahami konsep, sedangkan grafik Kartesius berguna untuk visualisasi pola relasi.",
    contohSoal: "📝 Soal",
    contohP: "Diketahui",
    contohDan: "dan",
    contohRelasi: ". Relasi dari P ke Q didefinisikan sebagai \"faktor dari\". Tentukan:",
    contohA: "a) Sajikan relasi tersebut dalam diagram panah, himpunan pasangan berurutan, dan diagram kartesius!",
    contohB: "b) Tentukan Domain, Kodomain, dan Range dari relasi tersebut!",
    pembahasan: "🔍 Pembahasan",
    langkah: "Langkah awal — Tentukan pasangan berdasarkan aturan \"faktor dari\":",
    langkahNote: "a adalah faktor dari b jika b habis dibagi a (b ÷ a tidak bersisa).",
    faktorDari: "adalah faktor dari:",
    tigaCara: "a) Tiga Cara Penyajian Relasi:",
    arrow1: "① Diagram Panah",
    pair2: "② Himpunan Pasangan Berurutan",
    pair2Total: "Total: 22 pasangan berurutan",
    cart3: "③ Diagram Kartesius",
    svgPDom: "P (Domain)",
    svgQKod: "Q (Kodomain)",
    svgQRange: "Q (Range)",
    bAnswer: "b) Domain, Kodomain, dan Range:",
    rangeEqKod: "= Q",
    rangeNote2: "Range = Kodomain karena angka 1 adalah faktor dari semua bilangan di Q, sehingga setiap anggota Q punya pasangan.",
    totalResult: "✅ Total: 22 pasangan berurutan. Range = Kodomain = Q.",
    rangkumanTitle: "📚 Rangkuman Materi",
    tipsTitle: "💡 Tips & Trik",
    kesimpulanTitle: "🎯 Kesimpulan",
    rangItems: [
      { icon: "🔗", label: "Relasi",          desc: "Aturan yang menghubungkan sebagian atau seluruh anggota himpunan A ke himpunan B.",   color: "from-cyan-900/60 to-teal-900/60 border-cyan-500/40 text-cyan-300" },
      { icon: "📥", label: "Domain",          desc: "Himpunan asal (himpunan A) — semua nilai yang boleh menjadi input.",                  color: "from-blue-900/60 to-cyan-900/60 border-blue-500/40 text-blue-300" },
      { icon: "📤", label: "Kodomain",        desc: "Himpunan kawan (himpunan B) — semua nilai yang mungkin menjadi output.",             color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
      { icon: "🎯", label: "Range",           desc: "Bagian dari kodomain yang benar-benar dipasangkan. Range ⊆ Kodomain selalu!",        color: "from-pink-900/60 to-rose-900/60 border-pink-500/40 text-pink-300" },
      { icon: "📊", label: "4 Cara Penyajian", desc: "Diagram panah, pasangan berurutan, tabel, dan grafik Kartesius.",                  color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
    ],
    tipItems: [
      "Range ⊆ Kodomain SELALU benar — range tidak pernah lebih besar dari kodomain.",
      "Diagram panah adalah cara termudah untuk memeriksa apakah suatu relasi adalah fungsi.",
      "Jika soal meminta 'himpunan range', cari hanya anggota B yang punya anak panah masuk kepadanya.",
    ],
    kesP1: "Relasi adalah", kes1: "\"jembatan\"",
    kesP2: "antara dua himpunan. Kuasai perbedaan antara",
    kesDomain: "domain", kesKodo: "kodomain", kesRange: "range",
    kesEnd: "— itulah fondasi untuk memahami fungsi!",
    backBtn: "← Kembali ke Relasi dan Fungsi",
  },
  en: {
    title: "UNDERSTANDING RELATIONS AND THEIR REPRESENTATIONS",
    subtitle: "Connect Two Sets with the Right Rule!",
    breadcrumb: "Grade 8 · Relations & Functions · Math Content",
    secIntro: "🌟 Relations — Connecting Two Worlds",
    secKonsep: "📘 Basic Concepts of Relations",
    secData: "📋 Data: Students and Extracurriculars",
    secPenyajian: "🗂️ Ways to Represent Relations",
    secContoh: "✏️ Sample Problem",
    secRangkuman: "📌 Summary & Conclusion",
    introP: "Imagine you have a list of students and their favourite subjects. The connection of \"who likes what\" is called a",
    introKata: "relation",
    introP2: "! In mathematics, a relation is",
    introBold: "a rule that connects members of one set to members of another set",
    introExTitle: "🔍 Examples of Relations in Daily Life",
    ex1r: "Student → Favourite Subject", ex1k: "Dinda likes Maths, Rafi likes Science",
    ex2r: "Fruit → Its Colour",          ex2k: "Apple is red, Banana is yellow, Grape is purple",
    ex3r: "Number → Its Square",         ex3k: "2 → 4, 3 → 9, 4 → 16",
    exContoh: "Example:",
    whyTitle: "Why learn about relations?",
    whyText: "Relations are the foundation of the function concept — one of the most fundamental topics in mathematics and computer programming!",
    konsepTitle: "🎯 Key Summary",
    konsepP: "Given two sets",
    konsepDan: "and",
    konsepRelasi: ", a relation from A to B is a rule that pairs",
    konsepSebagian: "some or all",
    konsepAnggota: "members of set",
    konsepDengan: "with members of set",
    konsepDomainPre: "Members of set",
    konsepDomainPost: "are called the",
    konsepDomainName: "domain (source set)",
    konsepKodoPre: "and members of set",
    konsepKodoPost: "are called the",
    konsepKodoName: "codomain (target set)",
    konsepNote: "⚠️ Remember:",
    konsepNoteText: "Range",
    konsepNoteSub: "Codomain, meaning the range is a subset of the codomain. Not all codomain members need to be paired!",
    dataIntro: "Look at the following data. In a school, there is a list of students and the extracurriculars they join. We will use this data to understand the ways of representing a relation.",
    setALabel: "🎓 Set A — Students",
    setBLabel: "🏅 Set B — Extracurricular",
    students: ["Enzo", "Justin", "Phoenix", "Wren"],
    sports: ["Badminton", "Basketball", "Futsal", "Swimming", "Volleyball"],
    relasiLabel: "🔗 Relation: \"joins extracurricular\"",
    studentSports: [
      { name: "Enzo",    sports: ["Badminton", "Basketball", "Futsal"], color: "text-cyan-300" },
      { name: "Justin",  sports: ["Basketball", "Swimming"],            color: "text-green-300" },
      { name: "Phoenix", sports: ["Volleyball", "Futsal"],              color: "text-orange-300" },
      { name: "Wren",    sports: [],                                    color: "text-red-300" },
    ],
    noSport: "does not join any extracurricular",
    domainLabel: "Domain (A) = ",
    kodoLabel: "Codomain (B) = ",
    rangeLabel: "Range = ",
    rangeNote: "(all sports have at least one participant)",
    wrenNote: "📌 Note:",
    wrenNoteText: "Wren does not join any extracurricular, so Wren has no pair in set B. However, Wren is still a member of the domain because Wren is a member of set A.",
    svgA: "A (Students)",
    svgB: "B (Extracurricular)",
    svgWrenNote: "Wren has no partner",
    penyajianIntro: "A relation can be represented in",
    penyajian4: "4 ways",
    diag1Title: "1️⃣ Arrow Diagram",
    diag1Desc: "Two ovals represent set A (students) and B (extracurricular), connected by arrows for the relation \"joins\".",
    wrenLegend: "Wren (∅)",
    diag2Title: "2️⃣ Set of Ordered Pairs",
    diag2Desc: "Written as a collection of pairs",
    diag2Di: "where",
    diag2Dan: "and",
    diag2Total: "Total: 7 ordered pairs · Wren has no partner",
    diag3Title: "3️⃣ Cartesian Diagram",
    diag3Desc: "Each pair is plotted as a point. The x-axis for students (domain), y-axis for extracurricular (range).",
    domAxis: "Students (Domain)",
    rangeAxis: "Extracurricular (Range)",
    fromPres: "📌 From the three representations above, we can identify:",
    warnNote: "⚠️ Note:",
    warnText: "Wren is a domain member but has no pair in the codomain — Wren does not appear in the ordered pairs or diagram. Range = Codomain because all extracurriculars have at least one participant.",
    tipLabel: "💡 Tip:",
    tipText: "Arrow diagrams are easiest for understanding the concept, while Cartesian graphs are useful for visualising patterns.",
    contohSoal: "📝 Problem",
    contohP: "Given",
    contohDan: "and",
    contohRelasi: ". The relation from P to Q is defined as \"is a factor of\". Determine:",
    contohA: "a) Represent the relation using an arrow diagram, ordered pairs, and a Cartesian diagram!",
    contohB: "b) Determine the Domain, Codomain, and Range!",
    pembahasan: "🔍 Solution",
    langkah: "Step 1 — Find pairs using the rule \"is a factor of\":",
    langkahNote: "a is a factor of b if b is divisible by a (b ÷ a has no remainder).",
    faktorDari: "is a factor of:",
    tigaCara: "a) Three Ways to Represent the Relation:",
    arrow1: "① Arrow Diagram",
    pair2: "② Set of Ordered Pairs",
    pair2Total: "Total: 22 ordered pairs",
    cart3: "③ Cartesian Diagram",
    svgPDom: "P (Domain)",
    svgQKod: "Q (Codomain)",
    svgQRange: "Q (Range)",
    bAnswer: "b) Domain, Codomain, and Range:",
    rangeEqKod: "= Q",
    rangeNote2: "Range = Codomain because 1 is a factor of every number in Q, so every member of Q has a partner.",
    totalResult: "✅ Total: 22 ordered pairs. Range = Codomain = Q.",
    rangkumanTitle: "📚 Summary",
    tipsTitle: "💡 Tips & Tricks",
    kesimpulanTitle: "🎯 Conclusion",
    rangItems: [
      { icon: "🔗", label: "Relation",          desc: "A rule connecting some or all members of set A to set B.",                        color: "from-cyan-900/60 to-teal-900/60 border-cyan-500/40 text-cyan-300" },
      { icon: "📥", label: "Domain",            desc: "The source set (set A) — all input values allowed by the relation.",             color: "from-blue-900/60 to-cyan-900/60 border-blue-500/40 text-blue-300" },
      { icon: "📤", label: "Codomain",          desc: "The target set (set B) — all values that could possibly be an output.",         color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
      { icon: "🎯", label: "Range",             desc: "The subset of the codomain that is actually paired. Range ⊆ Codomain always!", color: "from-pink-900/60 to-rose-900/60 border-pink-500/40 text-pink-300" },
      { icon: "📊", label: "4 Representations", desc: "Arrow diagram, ordered pairs, table, and Cartesian graph.",                    color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
    ],
    tipItems: [
      "Range ⊆ Codomain is ALWAYS true — range is never larger than the codomain.",
      "Arrow diagrams are the easiest way to check whether a relation is a function.",
      "If asked for the 'range set', only include members of B that have an incoming arrow.",
    ],
    kesP1: "A relation is the", kes1: "\"bridge\"",
    kesP2: "between two sets. Master the difference between",
    kesDomain: "domain", kesKodo: "codomain", kesRange: "range",
    kesEnd: "— that is the foundation for understanding functions!",
    backBtn: "← Back to Relations & Functions",
  },
  ja: {
    title: "関係とその表し方",
    subtitle: "正しいルールで2つの集合を結ぼう！",
    breadcrumb: "中学2年 · 関係と関数 · 数学コンテンツ",
    secIntro: "🌟 関係 — 二つの世界をつなぐ",
    secKonsep: "📘 関係の基本概念",
    secData: "📋 データ：生徒と課外活動",
    secPenyajian: "🗂️ 関係の表し方",
    secContoh: "✏️ 例題",
    secRangkuman: "📌 まとめと結論",
    introP: "生徒の名前リストとお気に入りの科目リストがあるとします。「誰が何を好きか」のつながりを",
    introKata: "関係",
    introP2: "と呼びます！数学では、関係とは",
    introBold: "一つの集合の要素を別の集合の要素に結び付けるルール",
    introExTitle: "🔍 日常生活の中の関係の例",
    ex1r: "生徒 → 好きな科目",      ex1k: "Dindaは数学が好き、Rafiは理科が好き",
    ex2r: "果物 → 色",               ex2k: "リンゴは赤、バナナは黄、ブドウは紫",
    ex3r: "数 → その平方",           ex3k: "2 → 4、3 → 9、4 → 16",
    exContoh: "例：",
    whyTitle: "なぜ関係を学ぶのか？",
    whyText: "関係は関数の概念の基礎であり、数学とコンピュータプログラミングの最も基本的なトピックの一つです！",
    konsepTitle: "🎯 要点まとめ",
    konsepP: "二つの集合",
    konsepDan: "と",
    konsepRelasi: "が与えられたとき、AからBへの関係とは、集合",
    konsepSebagian: "一部または全部",
    konsepAnggota: "の要素を集合",
    konsepDengan: "の要素と対応させるルールです。",
    konsepDomainPre: "集合",
    konsepDomainPost: "の要素を",
    konsepDomainName: "定義域（始集合）",
    konsepKodoPre: "、集合",
    konsepKodoPost: "の要素を",
    konsepKodoName: "終域（共域）",
    konsepNote: "⚠️ 覚えよう：",
    konsepNoteText: "値域",
    konsepNoteSub: "⊆ 終域。値域は終域の部分集合です。終域のすべての要素が対応する必要はありません！",
    dataIntro: "以下のデータを見てください。ある学校に生徒のリストと参加している課外活動のリストがあります。このデータを使って関係の表し方を学びます。",
    setALabel: "🎓 集合A — 生徒",
    setBLabel: "🏅 集合B — 課外活動",
    students: ["Enzo", "Justin", "Phoenix", "Wren"],
    sports: ["バドミントン", "バスケット", "フットサル", "水泳", "バレーボール"],
    relasiLabel: "🔗 関係：「課外活動に参加する」",
    studentSports: [
      { name: "Enzo",    sports: ["バドミントン", "バスケット", "フットサル"], color: "text-cyan-300" },
      { name: "Justin",  sports: ["バスケット", "水泳"],                       color: "text-green-300" },
      { name: "Phoenix", sports: ["バレーボール", "フットサル"],               color: "text-orange-300" },
      { name: "Wren",    sports: [],                                           color: "text-red-300" },
    ],
    noSport: "課外活動に参加していない",
    domainLabel: "定義域 (A) = ",
    kodoLabel: "終域 (B) = ",
    rangeLabel: "値域 = ",
    rangeNote: "（全ての活動に参加者がいる）",
    wrenNote: "📌 注意：",
    wrenNoteText: "Wrenは課外活動に参加していないため、集合Bに対応する要素がありません。しかしWrenは集合Aの要素であるため、定義域のメンバーです。",
    svgA: "A（生徒）",
    svgB: "B（課外活動）",
    svgWrenNote: "Wrenに対応なし",
    penyajianIntro: "関係は",
    penyajian4: "4通り",
    diag1Title: "1️⃣ 矢印図",
    diag1Desc: "集合A（生徒）とB（課外活動）の2つの楕円を「参加する」という関係の矢印で結びます。",
    wrenLegend: "Wren（∅）",
    diag2Title: "2️⃣ 順序対の集合",
    diag2Desc: "対の集まりとして書かれます",
    diag2Di: "（",
    diag2Dan: "かつ",
    diag2Total: "合計：順序対7個 · Wrenに対応なし",
    diag3Title: "3️⃣ 座標平面",
    diag3Desc: "各対を点として描きます。x軸は生徒（定義域）、y軸は課外活動（値域）。",
    domAxis: "生徒（定義域）",
    rangeAxis: "課外活動（値域）",
    fromPres: "📌 以上の3つの表し方から次のことが分かります：",
    warnNote: "⚠️ 注意：",
    warnText: "Wrenは定義域のメンバーですが、終域に対応する要素がありません。値域 = 終域（全ての課外活動に参加者がいるため）。",
    tipLabel: "💡 ヒント：",
    tipText: "矢印図は概念理解に最適で、座標平面は関係のパターン可視化に役立ちます。",
    contohSoal: "📝 問題",
    contohP: "集合",
    contohDan: "と",
    contohRelasi: "において、PからQへの関係を「約数」とします。次を求めなさい：",
    contohA: "a) 矢印図、順序対の集合、座標平面で表しなさい！",
    contohB: "b) 定義域、終域、値域を求めなさい！",
    pembahasan: "🔍 解法",
    langkah: "ステップ1 — 「約数」のルールで対を求める：",
    langkahNote: "aがbの約数 ⟺ bをaで割り切れる（b ÷ a が割り切れる）。",
    faktorDari: "の約数：",
    tigaCara: "a) 関係の3つの表し方：",
    arrow1: "① 矢印図",
    pair2: "② 順序対の集合",
    pair2Total: "合計：順序対22個",
    cart3: "③ 座標平面",
    svgPDom: "P（定義域）",
    svgQKod: "Q（終域）",
    svgQRange: "Q（値域）",
    bAnswer: "b) 定義域、終域、値域：",
    rangeEqKod: "= Q",
    rangeNote2: "値域 = 終域（1はQの全ての数の約数であるため、Qの全要素に対応がある）。",
    totalResult: "✅ 合計：順序対22個。値域 = 終域 = Q。",
    rangkumanTitle: "📚 まとめ",
    tipsTitle: "💡 ヒントとコツ",
    kesimpulanTitle: "🎯 結論",
    rangItems: [
      { icon: "🔗", label: "関係 (Relation)",  desc: "集合Aの一部または全部の要素を集合Bの要素に結び付けるルール。",  color: "from-cyan-900/60 to-teal-900/60 border-cyan-500/40 text-cyan-300" },
      { icon: "📥", label: "定義域 (Domain)", desc: "始集合（集合A）— 入力として使える全ての値。",                   color: "from-blue-900/60 to-cyan-900/60 border-blue-500/40 text-blue-300" },
      { icon: "📤", label: "終域 (Codomain)", desc: "目標集合（集合B）— 出力になり得る全ての値。",                   color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
      { icon: "🎯", label: "値域 (Range)",    desc: "実際に対応している終域の部分。値域 ⊆ 終域 は常に成立！",        color: "from-pink-900/60 to-rose-900/60 border-pink-500/40 text-pink-300" },
      { icon: "📊", label: "4つの表し方",     desc: "矢印図、順序対、表、座標平面。",                               color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
    ],
    tipItems: [
      "値域 ⊆ 終域 は常に成立 — 値域が終域より大きくなることはありません。",
      "矢印図は関係が関数かどうかを確認する最も簡単な方法です。",
      "「値域の集合」を求めるときは、矢印が入ってくるBの要素だけを選びましょう。",
    ],
    kesP1: "関係は二つの集合の", kes1: "「橋」",
    kesP2: "です。",
    kesDomain: "定義域", kesKodo: "終域", kesRange: "値域",
    kesEnd: "の違いをマスターしましょう — これが関数を理解するための基礎です！",
    backBtn: "← 関係と関数に戻る",
  },
};

const PengertianRelasiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "data", "penyajian", "contoh3", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
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

  const isJa = language === "ja";
  const sportFontSize = isJa ? "9" : "10";

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <GitBranch className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.subtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secIntro} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introP} <strong className="text-cyan-300">{t.introKata}</strong>{t.introP2} <strong className="text-cyan-300">{t.introBold}</strong>.
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{t.introExTitle}</p>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body">
                    {[
                      { rel: t.ex1r, ket: t.ex1k, color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-200" },
                      { rel: t.ex2r, ket: t.ex2k, color: "bg-violet-900/40 border-violet-500/30 text-violet-200" },
                      { rel: t.ex3r, ket: t.ex3k, color: "bg-green-900/40 border-green-500/30 text-green-200" },
                    ].map(({ rel, ket, color }) => (
                      <div key={rel} className={`border ${color} rounded-lg px-3 py-2`}>
                        <p className="font-bold">{rel}</p>
                        <p className="text-white/60 text-xs mt-0.5">{t.exContoh} {ket}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.whyTitle}</strong> {t.whyText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.secKonsep} />
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.konsepTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.konsepP} <InlineMath math="A" /> {t.konsepDan} <InlineMath math="B" />{t.konsepRelasi}{" "}
                    <strong className="text-green-300">{t.konsepSebagian}</strong> {t.konsepAnggota} <InlineMath math="A" /> {t.konsepDengan} <InlineMath math="B" />.{" "}
                    {t.konsepDomainPre} <InlineMath math="A" /> {t.konsepDomainPost} <strong className="text-yellow-300">{t.konsepDomainName}</strong>{t.konsepKodoPre} <InlineMath math="B" /> {t.konsepKodoPost} <strong className="text-orange-300">{t.konsepKodoName}</strong>.
                  </p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>{t.konsepNote}</strong> {t.konsepNoteText} <InlineMath math="\subseteq" /> {t.konsepNoteSub}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DATA KONTEKS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="data" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.secData} />
            {expandedSections.includes("data") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">{t.dataIntro}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-2 text-center">{t.setALabel}</p>
                    <div className="space-y-1.5">
                      {t.students.map(n => (
                        <div key={n} className="text-center font-body text-sm font-semibold text-cyan-100">{n}</div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-violet-300 mb-2 text-center">{t.setBLabel}</p>
                    <div className="space-y-1.5">
                      {t.sports.map(n => (
                        <div key={n} className="text-center font-body text-xs font-semibold text-violet-100">{n}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-yellow-300 mb-3">{t.relasiLabel}</p>
                  <div className="space-y-2">
                    {t.studentSports.map(({ name, sports, color }) => (
                      <div key={name} className="flex items-start gap-3 text-xs font-body">
                        <span className={`font-bold min-w-[52px] ${color}`}>{name}</span>
                        <span className="text-yellow-400 font-bold">→</span>
                        <span className="text-white/70">
                          {sports.length > 0
                            ? sports.join(", ")
                            : <span className="text-white/30 italic">{t.noSport}</span>
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs font-body">
                  <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2">
                    <span className="text-cyan-400 font-bold">{t.domainLabel}</span>
                    <span className="text-white/80">{"{"}{t.students.join(", ")}{"}"}</span>
                  </div>
                  <div className="bg-violet-900/20 border border-violet-500/20 rounded-lg px-3 py-2">
                    <span className="text-violet-400 font-bold">{t.kodoLabel}</span>
                    <span className="text-white/80">{"{"}{t.sports.join(", ")}{"}"}</span>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg px-3 py-2">
                    <span className="text-green-400 font-bold">{t.rangeLabel}</span>
                    <span className="text-white/80">{"{"}{t.sports.join(", ")}{"}"}</span>
                    <span className="text-white/40 ml-1 italic">{t.rangeNote}</span>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>{t.wrenNote}</strong> {t.wrenNoteText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CARA PENYAJIAN RELASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="penyajian" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.secPenyajian} />
            {expandedSections.includes("penyajian") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">{t.penyajianIntro} <strong className="text-white">{t.penyajian4}</strong>:</p>

                {/* Diagram Panah */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-cyan-300">{t.diag1Title}</p>
                  <p className="font-body text-xs text-white/60 mb-2">{t.diag1Desc}</p>
                  <div className="flex justify-center">
                    <svg viewBox="0 0 340 260" className="w-full max-w-sm" aria-label="Arrow diagram relation">
                      <defs>
                        <marker id="arCyan"   markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#22d3ee"/></marker>
                        <marker id="arGreen"  markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#4ade80"/></marker>
                        <marker id="arOrange" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#fb923c"/></marker>
                      </defs>
                      <ellipse cx="85" cy="133" rx="72" ry="108" fill="rgba(8,145,178,0.10)" stroke="#22d3ee" strokeWidth="1.8"/>
                      <ellipse cx="265" cy="133" rx="72" ry="108" fill="rgba(124,58,237,0.10)" stroke="#a78bfa" strokeWidth="1.8"/>
                      <text x="85"  y="18" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold">{t.svgA}</text>
                      <text x="265" y="18" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="bold">{t.svgB}</text>
                      {/* Domain items */}
                      <text x="85" y="76"  textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">Enzo</text>
                      <text x="85" y="111" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">Justin</text>
                      <text x="85" y="146" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="bold">Phoenix</text>
                      <text x="85" y="181" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Wren</text>
                      {/* Kodomain items */}
                      <text x="265" y="64"  textAnchor="middle" fill="#c4b5fd" fontSize={sportFontSize} fontWeight="bold">{t.sports[0]}</text>
                      <text x="265" y="97"  textAnchor="middle" fill="#c4b5fd" fontSize={sportFontSize} fontWeight="bold">{t.sports[1]}</text>
                      <text x="265" y="130" textAnchor="middle" fill="#c4b5fd" fontSize={sportFontSize} fontWeight="bold">{t.sports[2]}</text>
                      <text x="265" y="163" textAnchor="middle" fill="#c4b5fd" fontSize={sportFontSize} fontWeight="bold">{t.sports[3]}</text>
                      <text x="265" y="196" textAnchor="middle" fill="#c4b5fd" fontSize={sportFontSize} fontWeight="bold">{t.sports[4]}</text>
                      {/* Enzo → sports[0], sports[1], sports[2] */}
                      <line x1="99" y1="72"  x2="237" y2="60"  stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arCyan)"/>
                      <line x1="99" y1="72"  x2="246" y2="93"  stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arCyan)"/>
                      <line x1="99" y1="72"  x2="246" y2="126" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arCyan)"/>
                      {/* Justin → sports[1], sports[3] */}
                      <line x1="106" y1="107" x2="246" y2="93"  stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#arGreen)"/>
                      <line x1="106" y1="107" x2="246" y2="159" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#arGreen)"/>
                      {/* Phoenix → sports[4], sports[2] */}
                      <line x1="107" y1="142" x2="252" y2="192" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#arOrange)"/>
                      <line x1="107" y1="142" x2="246" y2="126" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#arOrange)"/>
                      {/* Wren — no arrow */}
                      <text x="85" y="248" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="8">{t.svgWrenNote}</text>
                    </svg>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center mt-1">
                    {[
                      { color: "bg-cyan-400",   label: "Enzo" },
                      { color: "bg-green-400",  label: "Justin" },
                      { color: "bg-orange-400", label: "Phoenix" },
                      { color: "bg-slate-500",  label: t.wrenLegend },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-xs font-body text-white/60">
                        <span className={`w-3 h-0.5 ${color} inline-block`} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Himpunan Pasangan Berurutan */}
                <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-green-300">{t.diag2Title}</p>
                  <p className="font-body text-xs text-white/60 mb-2">
                    {t.diag2Desc} <InlineMath math="(a, b)" /> {t.diag2Di} <InlineMath math="a \in A" /> {t.diag2Dan} <InlineMath math="b \in B" />.
                  </p>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 font-body text-xs leading-relaxed text-white/80">
                    <span className="text-green-300 font-bold text-sm">{"{"}</span>
                    {" "}
                    <span className="text-cyan-300">(Enzo, {t.sports[0]})</span>,{" "}
                    <span className="text-cyan-300">(Enzo, {t.sports[1]})</span>,{" "}
                    <span className="text-cyan-300">(Enzo, {t.sports[2]})</span>,{" "}
                    <span className="text-green-200">(Justin, {t.sports[1]})</span>,{" "}
                    <span className="text-green-200">(Justin, {t.sports[3]})</span>,{" "}
                    <span className="text-orange-300">(Phoenix, {t.sports[4]})</span>,{" "}
                    <span className="text-orange-300">(Phoenix, {t.sports[2]})</span>
                    {" "}
                    <span className="text-green-300 font-bold text-sm">{"}"}</span>
                  </div>
                  <p className="font-body text-xs text-white/40 text-center">{t.diag2Total}</p>
                </div>

                {/* Grafik Kartesius */}
                <div className="bg-slate-800/50 border border-violet-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">{t.diag3Title}</p>
                  <p className="font-body text-xs text-white/60">{t.diag3Desc}</p>
                  <div className="bg-slate-900/60 border border-violet-500/20 rounded-xl p-4 flex justify-center">
                    <svg viewBox="0 0 310 240" className="w-full max-w-xs" aria-label="Cartesian diagram relation">
                      {[125,165,205,245].map(gx => (
                        <line key={gx} x1={gx} y1={20} x2={gx} y2={200} stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3,3"/>
                      ))}
                      {[48,83,118,153,188].map(gy => (
                        <line key={gy} x1={85} y1={gy} x2={260} y2={gy} stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3,3"/>
                      ))}
                      <line x1="85" y1="200" x2="263" y2="200" stroke="#94a3b8" strokeWidth="1.8"/>
                      <line x1="85" y1="200" x2="85"  y2="12"  stroke="#94a3b8" strokeWidth="1.8"/>
                      <polygon points="260,197 267,200 260,203" fill="#94a3b8"/>
                      <polygon points="82,12 85,5 88,12"         fill="#94a3b8"/>
                      {/* Y-axis sport labels */}
                      <text x="81" y="51"  textAnchor="end" fill="#a78bfa" fontSize="7.5" fontWeight="bold">{t.sports[4]}</text>
                      <text x="81" y="86"  textAnchor="end" fill="#a78bfa" fontSize="7.5" fontWeight="bold">{t.sports[3]}</text>
                      <text x="81" y="121" textAnchor="end" fill="#a78bfa" fontSize="7.5" fontWeight="bold">{t.sports[2]}</text>
                      <text x="81" y="156" textAnchor="end" fill="#a78bfa" fontSize="7.5" fontWeight="bold">{t.sports[1]}</text>
                      <text x="81" y="191" textAnchor="end" fill="#a78bfa" fontSize="7.5" fontWeight="bold">{t.sports[0]}</text>
                      {[48,83,118,153,188].map(gy => (
                        <line key={gy} x1="81" y1={gy} x2="85" y2={gy} stroke="#94a3b8" strokeWidth="1.2"/>
                      ))}
                      {/* X-axis student labels */}
                      <text x="125" y="214" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold">Enzo</text>
                      <text x="165" y="214" textAnchor="middle" fill="#4ade80" fontSize="8" fontWeight="bold">Justin</text>
                      <text x="205" y="214" textAnchor="middle" fill="#fb923c" fontSize="8" fontWeight="bold">Phoenix</text>
                      <text x="245" y="214" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">Wren</text>
                      {[125,165,205,245].map(gx => (
                        <line key={gx} x1={gx} y1="200" x2={gx} y2="204" stroke="#94a3b8" strokeWidth="1.2"/>
                      ))}
                      <text x="175" y="228" textAnchor="middle" fill="#64748b" fontSize="7">{t.domAxis}</text>
                      <text x="14"  y="110" textAnchor="middle" fill="#64748b" fontSize="7" transform="rotate(-90 14 110)">{t.rangeAxis}</text>
                      {/* Data points: x: Enzo=125, Justin=165, Phoenix=205; y: sports[4]=48, sports[3]=83, sports[2]=118, sports[1]=153, sports[0]=188 */}
                      {[
                        {cx:125, cy:188, c:"#22d3ee"},
                        {cx:125, cy:153, c:"#22d3ee"},
                        {cx:125, cy:118, c:"#22d3ee"},
                        {cx:165, cy:153, c:"#4ade80"},
                        {cx:165, cy:83,  c:"#4ade80"},
                        {cx:205, cy:48,  c:"#fb923c"},
                        {cx:205, cy:118, c:"#fb923c"},
                      ].map(({cx,cy,c},i) => (
                        <circle key={i} cx={cx} cy={cy} r="5" fill={c} stroke="white" strokeWidth="1.2"/>
                      ))}
                    </svg>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center mt-1">
                    {[
                      {color:"bg-cyan-400",   label:"Enzo"},
                      {color:"bg-green-400",  label:"Justin"},
                      {color:"bg-orange-400", label:"Phoenix"},
                    ].map(({color,label}) => (
                      <div key={label} className="flex items-center gap-1.5 text-xs font-body text-white/60">
                        <span className={`w-2.5 h-2.5 rounded-full ${color} inline-block`}/>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kesimpulan Domain, Kodomain, Range dari penyajian */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.fromPres}</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 bg-cyan-900/20 border border-cyan-500/25 rounded-lg px-3 py-2.5">
                      <span className="font-body text-xs font-bold text-cyan-400 min-w-[90px]">Domain (A)</span>
                      <span className="font-body text-xs text-white/80">= {"{"}{t.students.join(", ")}{"}"}</span>
                    </div>
                    <div className="flex items-start gap-3 bg-violet-900/20 border border-violet-500/25 rounded-lg px-3 py-2.5">
                      <span className="font-body text-xs font-bold text-violet-400 min-w-[90px]">Kodomain (B)</span>
                      <span className="font-body text-xs text-white/80">= {"{"}{t.sports.join(", ")}{"}"}</span>
                    </div>
                    <div className="flex items-start gap-3 bg-green-900/20 border border-green-500/25 rounded-lg px-3 py-2.5">
                      <span className="font-body text-xs font-bold text-green-400 min-w-[90px]">Range</span>
                      <span className="font-body text-xs text-white/80">= {"{"}{t.sports.join(", ")}{"}"}</span>
                    </div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
                    <p className="font-body text-xs text-orange-200">
                      <strong>{t.warnNote}</strong> {t.warnText}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.tipLabel}</strong> {t.tipText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.secContoh} />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.contohSoal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {t.contohP} <InlineMath math="P = \{1, 2, 3, 4, 5\}" /> {t.contohDan} <InlineMath math="Q = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />{t.contohRelasi}
                    <br />{t.contohA}
                    <br />{t.contohB}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-4 text-sm font-body">

                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.langkah}</p>
                      <p className="text-white/60 text-xs mb-2">{t.langkahNote}</p>
                      <div className="space-y-1 text-xs text-white/70">
                        {[
                          { n: "1", color: "text-cyan-300",   vals: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10" },
                          { n: "2", color: "text-green-300",  vals: "2, 4, 6, 8, 10" },
                          { n: "3", color: "text-orange-300", vals: "3, 6, 9" },
                          { n: "4", color: "text-violet-300", vals: "4, 8" },
                          { n: "5", color: "text-yellow-300", vals: "5, 10" },
                        ].map(({ n, color, vals }) => (
                          <p key={n}><strong className={color}>{n}</strong> {t.faktorDari} {vals}</p>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-5">
                      <p className="text-violet-300 font-semibold">{t.tigaCara}</p>

                      {/* ① Arrow diagram */}
                      <div className="space-y-2">
                        <p className="text-cyan-300 text-xs font-semibold">{t.arrow1}</p>
                        <div className="flex justify-center">
                          <svg viewBox="0 0 360 300" className="w-full max-w-sm" aria-label="Arrow diagram factor of">
                            <defs>
                              <marker id="ep1" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#22d3ee"/></marker>
                              <marker id="ep2" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#4ade80"/></marker>
                              <marker id="ep3" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#fb923c"/></marker>
                              <marker id="ep4" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#c084fc"/></marker>
                              <marker id="ep5" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#facc15"/></marker>
                            </defs>
                            <ellipse cx="75"  cy="152" rx="60" ry="120" fill="rgba(8,145,178,0.10)"   stroke="#22d3ee" strokeWidth="1.8"/>
                            <ellipse cx="285" cy="152" rx="60" ry="140" fill="rgba(124,58,237,0.10)" stroke="#a78bfa" strokeWidth="1.8"/>
                            <text x="75"  y="22" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold">{t.svgPDom}</text>
                            <text x="285" y="8"  textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="bold">{t.svgQKod}</text>
                            {[["1","#22d3ee",59],["2","#4ade80",91],["3","#fb923c",123],["4","#c084fc",155],["5","#facc15",187]].map(([n,c,y]) => (
                              <text key={n} x="75" y={y} textAnchor="middle" fill={c} fontSize="13" fontWeight="bold">{n}</text>
                            ))}
                            {[1,2,3,4,5,6,7,8,9,10].map((q,i) => (
                              <text key={q} x="285" y={30+i*27} textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="bold">{q}</text>
                            ))}
                            {[
                              [79,55, 281,26, "ep1"],[79,55, 281,53, "ep1"],[79,55, 281,80, "ep1"],
                              [79,55, 281,107,"ep1"],[79,55, 281,134,"ep1"],[79,55, 281,161,"ep1"],
                              [79,55, 281,188,"ep1"],[79,55, 281,215,"ep1"],[79,55, 281,242,"ep1"],[79,55, 277,269,"ep1"],
                              [79,87, 281,53, "ep2"],[79,87, 281,107,"ep2"],[79,87, 281,161,"ep2"],[79,87, 281,215,"ep2"],[79,87, 277,269,"ep2"],
                              [79,119,281,80, "ep3"],[79,119,281,161,"ep3"],[79,119,281,242,"ep3"],
                              [79,151,281,107,"ep4"],[79,151,281,215,"ep4"],
                              [79,183,281,134,"ep5"],[79,183,277,269,"ep5"],
                            ].map(([x1,y1,x2,y2,mk],i) => (
                              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={{"ep1":"#22d3ee","ep2":"#4ade80","ep3":"#fb923c","ep4":"#c084fc","ep5":"#facc15"}[mk]} strokeWidth="1.1" markerEnd={`url(#${mk})`} opacity="0.8"/>
                            ))}
                          </svg>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center text-xs font-body text-white/50">
                          {[["bg-cyan-400","1"],["bg-green-400","2"],["bg-orange-400","3"],["bg-violet-400","4"],["bg-yellow-400","5"]].map(([c,n]) => (
                            <span key={n} className="flex items-center gap-1"><span className={`w-2.5 h-0.5 ${c} inline-block`}/>{n}</span>
                          ))}
                        </div>
                      </div>

                      {/* ② Ordered pairs */}
                      <div className="space-y-1">
                        <p className="text-green-300 text-xs font-semibold">{t.pair2}</p>
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 font-body text-xs leading-relaxed text-white/80">
                          <span className="text-green-300 font-bold">{"{"}</span>{" "}
                          (1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7), (1,8), (1,9), (1,10),{" "}
                          (2,2), (2,4), (2,6), (2,8), (2,10), (3,3), (3,6), (3,9),{" "}
                          (4,4), (4,8), (5,5), (5,10){" "}
                          <span className="text-green-300 font-bold">{"}"}</span>
                        </div>
                        <p className="text-white/40 text-xs text-center">{t.pair2Total}</p>
                      </div>

                      {/* ③ Cartesian diagram */}
                      <div className="space-y-1">
                        <p className="text-violet-300 text-xs font-semibold">{t.cart3}</p>
                        <div className="flex justify-center">
                          <svg viewBox="0 0 210 250" className="w-full max-w-xs" aria-label="Cartesian diagram factor of">
                            {[1,2,3,4,5].map(p => <line key={p} x1={30+p*30} y1={25} x2={30+p*30} y2={215} stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3,3"/>)}
                            {[1,2,3,4,5,6,7,8,9,10].map(q => <line key={q} x1={30} y1={215-q*18} x2={195} y2={215-q*18} stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3,3"/>)}
                            <line x1="30" y1="215" x2="197" y2="215" stroke="#94a3b8" strokeWidth="1.8"/>
                            <line x1="30" y1="215" x2="30"  y2="18"  stroke="#94a3b8" strokeWidth="1.8"/>
                            <polygon points="194,212 201,215 194,218" fill="#94a3b8"/>
                            <polygon points="27,18 30,11 33,18"       fill="#94a3b8"/>
                            {[["1","#22d3ee"],["2","#4ade80"],["3","#fb923c"],["4","#c084fc"],["5","#facc15"]].map(([p,c],i) => (
                              <g key={p}>
                                <line x1={60+i*30} y1="215" x2={60+i*30} y2="219" stroke="#94a3b8" strokeWidth="1.2"/>
                                <text x={60+i*30} y="229" textAnchor="middle" fill={c} fontSize="8" fontWeight="bold">{p}</text>
                              </g>
                            ))}
                            {[1,2,3,4,5,6,7,8,9,10].map(q => (
                              <g key={q}>
                                <line x1="26" y1={215-q*18} x2="30" y2={215-q*18} stroke="#94a3b8" strokeWidth="1.2"/>
                                <text x="23" y={215-q*18+3} textAnchor="end" fill="#a78bfa" fontSize="7.5" fontWeight="bold">{q}</text>
                              </g>
                            ))}
                            <text x="113" y="243" textAnchor="middle" fill="#64748b" fontSize="7">{t.svgPDom}</text>
                            <text x="10"  y="115" textAnchor="middle" fill="#64748b" fontSize="7" transform="rotate(-90 10 115)">{t.svgQRange}</text>
                            {([
                              [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],
                              [2,2],[2,4],[2,6],[2,8],[2,10],
                              [3,3],[3,6],[3,9],
                              [4,4],[4,8],
                              [5,5],[5,10],
                            ] as [number,number][]).map(([p,q]) => {
                              const colors: Record<number,string> = {1:"#22d3ee",2:"#4ade80",3:"#fb923c",4:"#c084fc",5:"#facc15"};
                              return <circle key={`${p}-${q}`} cx={30+p*30} cy={215-q*18} r="4" fill={colors[p]} stroke="white" strokeWidth="1"/>;
                            })}
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* b) Domain, Kodomain, Range */}
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-orange-300 font-semibold mb-2">{t.bAnswer}</p>
                      <div className="flex items-start gap-3 bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2">
                        <span className="font-body text-xs font-bold text-cyan-400 min-w-[90px]">Domain (P)</span>
                        <span className="font-body text-xs text-white/80">= {"{"} 1, 2, 3, 4, 5 {"}"}</span>
                      </div>
                      <div className="flex items-start gap-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-3 py-2">
                        <span className="font-body text-xs font-bold text-violet-400 min-w-[90px]">Kodomain (Q)</span>
                        <span className="font-body text-xs text-white/80">= {"{"} 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 {"}"}</span>
                      </div>
                      <div className="flex items-start gap-3 bg-green-900/20 border border-green-500/20 rounded-lg px-3 py-2">
                        <span className="font-body text-xs font-bold text-green-400 min-w-[90px]">Range</span>
                        <span className="font-body text-xs text-white/80">= {"{"} 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 {"}"} {t.rangeEqKod}</span>
                      </div>
                      <p className="font-body text-xs text-white/50 pt-1">{t.rangeNote2}</p>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">{t.totalResult}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.secRangkuman} />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-6 space-y-4">

                <p className="font-display text-xs font-bold text-cyan-300 uppercase tracking-wider pt-1">{t.rangkumanTitle}</p>
                <div className="grid grid-cols-1 gap-2">
                  {t.rangItems.map(({ icon, label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className="font-body text-xs text-white/80 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">{t.tipsTitle}</p>
                  <div className="space-y-2">
                    {t.tipItems.map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                        <p className="font-body text-xs text-amber-100/90 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-900/60 to-cyan-900/60 border border-teal-400/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">{t.kesimpulanTitle}</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">
                    {t.kesP1} <strong className="text-teal-300">{t.kes1}</strong> {t.kesP2} <strong className="text-cyan-300">{t.kesDomain}</strong>, <strong className="text-violet-300">{t.kesKodo}</strong>, {language === "ja" ? "" : "dan "}<strong className="text-pink-300">{t.kesRange}</strong>{t.kesEnd}
                  </p>
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

export default PengertianRelasiPage;
