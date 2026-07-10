import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Zap, Calculator, AlertTriangle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const OperasiCampuranBilanganBulatPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "prioritas", "kurung", "contoh", "kesimpulan"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const translations = {
    id: {
      title: "OPERASI HITUNG CAMPURAN",
      subtitle: "Kelas 7 - Bilangan Bulat - Materi Matematika",
      secIntroTitle: "Apa itu Operasi Campuran?",
      secPrioritasTitle: "Aturan Prioritas: KaKuKaBaKu",
      secKurungTitle: "Jenis-Jenis Kurung",
      secContohTitle: "Contoh Soal Bertingkat",
      secKesalahanTitle: "Kesalahan Umum yang Harus Dihindari",
      secKesimpulanTitle: "Kesimpulan & Tips Operasi Campuran",
      introP1: "Operasi campuran adalah perhitungan yang melibatkan lebih dari satu jenis operasi dalam satu ekspresi matematika. Bayangkan kamu sedang memasak: tidak hanya mencampurkan satu bahan, tapi beberapa bahan sekaligus dengan urutan tertentu agar hasilnya pas!",
      introExample: "Contoh Operasi Campuran:",
      introExDesc1: "Ada penjumlahan, perkalian, dan pengurangan",
      introExDesc2: "Ada pembagian, penjumlahan, dan perkalian",
      introKeyQ: "Pertanyaan Kunci:",
      introKeyQBody: "Operasi mana yang harus dikerjakan duluan? Kalau urutan pengerjaannya salah, hasilnya pasti berbeda! Itulah mengapa kita perlu memahami aturan prioritas.",
      prioritasIntro: 'Untuk menyelesaikan operasi campuran, kita punya jurus sakti bernama KaKuKaBaKu! Ini adalah singkatan yang membantu mengingat urutan pengerjaan:',
      prioritasTitle: "URUTAN PRIORITAS",
      p1Label: "Ka - Kurung ( )",
      p1Desc: "Kerjakan yang ada di dalam kurung terlebih dahulu",
      p2Label: "Ku - Kuadrat/Pangkat",
      p2Desc: "Kerjakan perpangkatan setelah kurung",
      p3Label: "Ka & Ba — Kali × dan Bagi ÷",
      p3Desc: "Setingkat — kerjakan dari kiri ke kanan",
      p4Label: "Ku - Kurang − & Tambah +",
      p4Desc: "Penjumlahan dan pengurangan dikerjakan terakhir, dari kiri",
      prioritasTip: "Tips Mudah:",
      prioritasTipBody: "Perkalian dan pembagian punya tingkat yang SAMA, jadi kerjakan dari kiri ke kanan. Begitu juga penjumlahan dan pengurangan - keduanya setingkat!",
      ringkasanIntisari: "Ringkasan Intisari:",
      prioritasFormula: "\\text{Kurung} \\rightarrow \\text{Pangkat} \\rightarrow \\times \\div \\rightarrow + -",
      prioritasFormulaNote: "Jika ada operasi setingkat, kerjakan dari kiri ke kanan",
      kurungIntro: "Dalam matematika, ada 3 jenis kurung yang perlu kamu kenal. Masing-masing punya tingkat prioritas berbeda!",
      kurungTitle: "Urutan Pengerjaan Kurung:",
      k1Label: "Kurung Biasa",
      k1Desc: "Dikerjakan paling awal (kurung terdalam)",
      k2Label: "Kurung Siku",
      k2Desc: "Dikerjakan setelah kurung biasa",
      k3Label: "Kurung Kurawal",
      k3Desc: "Dikerjakan paling akhir (kurung terluar)",
      kurungExTitle: "Contoh dengan Tiga Kurung:",
      kurungStep1: "Langkah 1: Kerjakan",
      kurungStep2: "Langkah 2: Kerjakan",
      kurungStep3: "Langkah 3: Kerjakan",
      kurungRemember: "Ingat!",
      kurungRememberBody: "Prinsipnya adalah \"dari dalam ke luar\". Kerjakan kurung yang paling dalam terlebih dahulu, baru kemudian kurung yang lebih luar.",
      badgeEasy: "MUDAH",
      badgeMedium: "SEDANG",
      badgeHard: "SULIT",
      badgeBonus: "BONUS",
      example: "Contoh",
      calculate: "Hitunglah:",
      discussion: "PEMBAHASAN:",
      answer: "Jawaban:",
      step: "Langkah",
      ex1s1: "Identifikasi operasi yang ada: penjumlahan, perkalian, pengurangan",
      ex1s2: "Kerjakan perkalian terlebih dahulu (prioritas lebih tinggi):",
      ex1s3: "Substitusi ke ekspresi awal:",
      ex1s4: "Kerjakan dari kiri ke kanan:",
      ex2s1: "Kerjakan perkalian dan pembagian terlebih dahulu (dari kiri ke kanan):",
      ex2note1: "(negatif x positif = negatif)",
      ex2note2: "(positif : negatif = negatif)",
      ex2s2: "Substitusi ke ekspresi:",
      ex2s3: "Kerjakan dari kiri ke kanan:",
      ex3s1: "Kerjakan kurung biasa ( ) terlebih dahulu:",
      ex3s2: "Persamaan menjadi:",
      ex3s3: "Di dalam kurung siku, kerjakan perkalian dulu:",
      ex3s4: "Selesaikan isi kurung siku:",
      ex3s5: "Persamaan menjadi:",
      ex3s6: "Kerjakan pembagian:",
      ex3s7: "Kerjakan pengurangan:",
      bonusTitle: "Soal Cerita",
      bonusStory: "Pak Budi seorang pedagang buah. Pada pagi hari, ia memiliki stok 50 kg jeruk. Siang hari terjual 28 kg, lalu sore hari datang kiriman 3 karung yang masing-masing berisi 15 kg. Malam hari, ada 12 kg jeruk yang busuk dan harus dibuang. Berapa kg stok jeruk Pak Budi sekarang?",
      bonusStockNote: "Stok awal - terjual + kiriman - busuk",
      bonusS1: "Ubah ke model matematika:",
      bonusS2: "Kerjakan perkalian dalam kurung:",
      bonusS3: "Kerjakan dari kiri ke kanan:",
      bonusAns: "Stok jeruk Pak Budi sekarang adalah 55 kg",
      err1Title: "Kesalahan #1: Mengerjakan dari Kiri ke Kanan Tanpa Melihat Prioritas",
      errWrong: "SALAH:",
      errRight: "BENAR:",
      err1Note: "(Perkalian dikerjakan duluan!)",
      err2Title: "Kesalahan #2: Lupa Aturan Tanda Saat Mengurangi Bilangan Negatif",
      err2Note: "(Mengurangi negatif = menambah positif!)",
      err3Title: "Kesalahan #3: Tidak Menyelesaikan Kurung Terdalam Lebih Dulu",
      err3Wrong: "SALAH: Langsung mengerjakan kurung siku",
      err3Right: "BENAR: Kerjakan kurung biasa dulu",
      errTip: "Tips Anti Salah:",
      errTipBody: "Selalu tandai atau garis bawahi operasi yang harus dikerjakan lebih dulu sebelum mulai menghitung. Ini akan membantu kamu tetap fokus pada urutan yang benar!",
      concPriorityTitle: "Kesimpulan Urutan Prioritas:",
      concStep1: "1. Kurung ( ) [ ] { }",
      concStep2: "2. Pangkat",
      concStep3: "3. × dan ÷",
      concStep4: "4. + dan −",
      concFormulaNote: "Operasi setingkat dikerjakan dari kiri ke kanan",
      concRulesTitle: "Aturan Penting:",
      concRule1: "× dan ÷ setingkat",
      concRule1Body: "— jika keduanya ada bersamaan, kerjakan dari kiri ke kanan, bukan × dulu baru ÷.",
      concRule2: "+ dan − setingkat",
      concRule2Body: "— jika keduanya ada bersamaan, kerjakan dari kiri ke kanan, bukan + dulu baru −.",
      concRule3: "Kurung bertingkat",
      concRule3Body: "— kerjakan kurung paling dalam ( ) terlebih dahulu, baru [ ], lalu { }.",
      tipTitle: "Tips Cepat Mengerjakan Soal:",
      tip1: "Baca soal dulu secara keseluruhan",
      tip1Body: "sebelum menghitung — identifikasi semua jenis operasi yang ada, lalu tandai mana yang dikerjakan lebih dulu.",
      tip2: "Kerjakan langkah demi langkah",
      tip2Body: "dan tulis hasilnya setiap langkah. Hindari menghitung semuanya sekaligus dalam kepala — rawan salah!",
      tip3: "Jangan tertipu urutan penulisan.",
      tip3Body: "bukan berarti 3+2 dikerjakan dulu! Perkalian tetap lebih prioritas meski ditulis belakangan.",
      tip4: "Verifikasi hasil akhir",
      tip4Body: "dengan mensubstitusi kembali ke soal asal. Kalau tidak yakin, ulangi dari langkah pertama.",
      summaryTitle: "🔀 RANGKUMAN LENGKAP",
      summarySubtitle: "Operasi Hitung Campuran Bilangan Bulat — Kelas 7",
      summarySection1: "Hierarki Prioritas — Urutan Wajib!",
      sumP1Label: "Kurung  ( )",
      sumP1Desc: "Kerjakan SEMUA yang ada dalam kurung terlebih dahulu, dari dalam ke luar.",
      sumP2Label: "Pangkat / Akar",
      sumP2Desc: "Setelah kurung selesai, kerjakan pemangkatan dan penarikan akar.",
      sumP3Label: "× dan ÷  (kiri ke kanan)",
      sumP3Desc: "Perkalian dan pembagian memiliki prioritas yang sama. Kerjakan dari kiri ke kanan.",
      sumP4Label: "+ dan −  (kiri ke kanan)",
      sumP4Desc: "Penjumlahan dan pengurangan dikerjakan terakhir, dari kiri ke kanan.",
      mnemTitle: "🧠 Mnemonik untuk diingat:",
      mnemPhrase: '"Kurung — Pangkat — Kali/Bagi — Tambah/Kurang"',
      mnemNote: 'Ingat: KP-KB-TK atau "Kurung Pangkat — Kali Bagi — Tambah Kurang"',
      summarySection2: "Contoh Penerapan Prioritas",
      exNote1: "Bukan (3+2)×4 = 20 ✗",
      exNote2: "Kurung dikerjakan dulu ✓",
      exNote3: "× dan ÷ dulu, baru −",
      summarySection3: "Tips & Trik Jitu Operasi Campuran",
      sumTip1: "Tandai langkah pengerjaan sebelum menghitung",
      sumTip1D: "Baca soal dulu, lingkari atau garis bawahi mana yang dikerjakan pertama. Jangan langsung menghitung!",
      sumTip2: "Waspada jebakan prioritas kiri-ke-kanan",
      sumTip2D: "12 ÷ 3 × 2 = (12÷3)×2 = 8, BUKAN 12÷(3×2) = 2. × dan ÷ dikerjakan dari kiri ke kanan!",
      sumTip3: "Kurung beranak — kerjakan dari dalam",
      sumTip3D: "Jika ada kurung bersarang seperti [(2+3)×4], kerjakan kurung paling dalam dulu: (2+3)=5, lalu 5×4=20.",
      sumTip4: "Verifikasi dengan substitusi bertahap",
      sumTip4D: "Tulis setiap langkah secara terpisah. Jika ada kesalahan, kamu bisa langsung tahu di langkah mana terjadi.",
      conclusionTitle: "KESIMPULAN",
      conclusionBody: "Operasi campuran bukan soal menghitung cepat, tapi soal mengikuti aturan urutan yang tepat. Selalu ingat hierarki: Kurung → Pangkat → × dan ÷ → + dan −. Siapapun yang mengikuti aturan ini tidak akan pernah salah!",
      tags: ["Kurung Dulu", "Pangkat/Akar", "× dan ÷ = Sederajat", "+ dan − = Sederajat", "Kiri ke Kanan"],
      congratsMsg: "🏆 Kamu telah menguasai semua operasi dasar bilangan bulat!",
      backBtn: "Kembali ke Bilangan Bulat",
    },
    en: {
      title: "MIXED OPERATIONS",
      subtitle: "Grade 7 - Integers - Mathematics",
      secIntroTitle: "What are Mixed Operations?",
      secPrioritasTitle: "Order of Operations: PEMDAS",
      secKurungTitle: "Types of Brackets",
      secContohTitle: "Worked Examples",
      secKesalahanTitle: "Common Mistakes to Avoid",
      secKesimpulanTitle: "Summary & Tips for Mixed Operations",
      introP1: "Mixed operations are calculations involving more than one type of operation in a single mathematical expression. Imagine cooking: you don't just add one ingredient, but several at once in a specific order to get the right result!",
      introExample: "Mixed Operations Examples:",
      introExDesc1: "Involves addition, multiplication, and subtraction",
      introExDesc2: "Involves division, addition, and multiplication",
      introKeyQ: "Key Question:",
      introKeyQBody: "Which operation should be done first? If you work in the wrong order, you will get a different answer! That's why we need to understand the order of operations.",
      prioritasIntro: "To solve mixed operations, we use the mnemonic PEMDAS to remember the correct order:",
      prioritasTitle: "ORDER OF OPERATIONS",
      p1Label: "P - Parentheses ( )",
      p1Desc: "Work through everything inside brackets first",
      p2Label: "E - Exponents",
      p2Desc: "Work out powers and roots after brackets",
      p3Label: "M & D — Multiplication × and Division ÷",
      p3Desc: "Same level — work from left to right",
      p4Label: "A & S — Addition + and Subtraction −",
      p4Desc: "Addition and subtraction are done last, from left to right",
      prioritasTip: "Easy Tip:",
      prioritasTipBody: "Multiplication and division have the SAME level, so work from left to right. The same applies to addition and subtraction — both are equal!",
      ringkasanIntisari: "Summary:",
      prioritasFormula: "\\text{Parentheses} \\rightarrow \\text{Exponents} \\rightarrow \\times \\div \\rightarrow + -",
      prioritasFormulaNote: "For operations at the same level, work from left to right",
      kurungIntro: "In mathematics, there are 3 types of brackets you need to know. Each has a different priority level!",
      kurungTitle: "Order of Bracket Operations:",
      k1Label: "Round Brackets",
      k1Desc: "Worked out first (innermost brackets)",
      k2Label: "Square Brackets",
      k2Desc: "Worked out after round brackets",
      k3Label: "Curly Brackets",
      k3Desc: "Worked out last (outermost brackets)",
      kurungExTitle: "Example with Three Bracket Types:",
      kurungStep1: "Step 1: Work out",
      kurungStep2: "Step 2: Work out",
      kurungStep3: "Step 3: Work out",
      kurungRemember: "Remember!",
      kurungRememberBody: 'The principle is "from inside to outside". Work out the innermost brackets first, then move outward.',
      badgeEasy: "EASY",
      badgeMedium: "MEDIUM",
      badgeHard: "HARD",
      badgeBonus: "BONUS",
      example: "Example",
      calculate: "Calculate:",
      discussion: "SOLUTION:",
      answer: "Answer:",
      step: "Step",
      ex1s1: "Identify the operations: addition, multiplication, subtraction",
      ex1s2: "Perform multiplication first (higher priority):",
      ex1s3: "Substitute back into the expression:",
      ex1s4: "Work from left to right:",
      ex2s1: "Perform multiplication and division first (from left to right):",
      ex2note1: "(negative × positive = negative)",
      ex2note2: "(positive ÷ negative = negative)",
      ex2s2: "Substitute into the expression:",
      ex2s3: "Work from left to right:",
      ex3s1: "Work out round brackets ( ) first:",
      ex3s2: "The equation becomes:",
      ex3s3: "Inside square brackets, perform multiplication first:",
      ex3s4: "Finish the square bracket:",
      ex3s5: "The equation becomes:",
      ex3s6: "Perform the division:",
      ex3s7: "Perform the subtraction:",
      bonusTitle: "Word Problem",
      bonusStory: "Mr. Budi is a fruit seller. In the morning, he has 50 kg of oranges in stock. During the day, 28 kg are sold, then in the afternoon 3 bags arrive, each containing 15 kg. At night, 12 kg of oranges have gone bad and must be thrown away. How many kg of oranges does Mr. Budi have now?",
      bonusStockNote: "Initial stock − sold + delivery − spoiled",
      bonusS1: "Write a mathematical model:",
      bonusS2: "Work out the multiplication in brackets:",
      bonusS3: "Work from left to right:",
      bonusAns: "Mr. Budi now has 55 kg of oranges in stock",
      err1Title: "Mistake #1: Working from Left to Right Without Checking Priority",
      errWrong: "WRONG:",
      errRight: "CORRECT:",
      err1Note: "(Multiplication must be done first!)",
      err2Title: "Mistake #2: Forgetting the Sign Rule When Subtracting a Negative",
      err2Note: "(Subtracting a negative = adding a positive!)",
      err3Title: "Mistake #3: Not Solving the Innermost Brackets First",
      err3Wrong: "WRONG: Going straight to the square bracket",
      err3Right: "CORRECT: Work the round bracket first",
      errTip: "Anti-Mistake Tip:",
      errTipBody: "Always mark or underline operations that need to be done first before you start calculating. This will help you stay focused on the correct order!",
      concPriorityTitle: "Summary of Operation Priority:",
      concStep1: "1. Brackets ( ) [ ] { }",
      concStep2: "2. Exponents",
      concStep3: "3. × and ÷",
      concStep4: "4. + and −",
      concFormulaNote: "Same-level operations are worked from left to right",
      concRulesTitle: "Important Rules:",
      concRule1: "× and ÷ are the same level",
      concRule1Body: "— if both appear together, work from left to right, not × before ÷.",
      concRule2: "+ and − are the same level",
      concRule2Body: "— if both appear together, work from left to right, not + before −.",
      concRule3: "Nested brackets",
      concRule3Body: "— work the innermost ( ) first, then [ ], then { }.",
      tipTitle: "Quick Tips for Solving Problems:",
      tip1: "Read the whole problem first",
      tip1Body: "before calculating — identify all operations, then mark which ones to do first.",
      tip2: "Work step by step",
      tip2Body: "and write down the result at each step. Avoid doing everything in your head at once — easy to make mistakes!",
      tip3: "Don't be fooled by the order of writing.",
      tip3Body: "doesn't mean 3+2 is done first! Multiplication still has higher priority even if written later.",
      tip4: "Verify the final answer",
      tip4Body: "by substituting back into the original problem. If unsure, start over from step one.",
      summaryTitle: "🔀 COMPLETE SUMMARY",
      summarySubtitle: "Mixed Operations with Integers — Grade 7",
      summarySection1: "Priority Hierarchy — Must Follow!",
      sumP1Label: "Brackets  ( )",
      sumP1Desc: "Work through EVERYTHING inside brackets first, from inside to outside.",
      sumP2Label: "Exponents / Roots",
      sumP2Desc: "After brackets, work out powers and square roots.",
      sumP3Label: "× and ÷  (left to right)",
      sumP3Desc: "Multiplication and division have the same priority. Work from left to right.",
      sumP4Label: "+ and −  (left to right)",
      sumP4Desc: "Addition and subtraction are done last, from left to right.",
      mnemTitle: "🧠 Mnemonic to remember:",
      mnemPhrase: '"Please Excuse My Dear Aunt Sally" (PEMDAS)',
      mnemNote: "Parentheses — Exponents — Multiplication/Division — Addition/Subtraction",
      summarySection2: "Priority Application Examples",
      exNote1: "Not (3+2)×4 = 20 ✗",
      exNote2: "Brackets done first ✓",
      exNote3: "× and ÷ first, then −",
      summarySection3: "Quick Tips for Mixed Operations",
      sumTip1: "Mark the order before calculating",
      sumTip1D: "Read the problem, circle or underline what to work out first. Don't just start calculating!",
      sumTip2: "Watch out for the left-to-right priority trap",
      sumTip2D: "12 ÷ 3 × 2 = (12÷3)×2 = 8, NOT 12÷(3×2) = 2. × and ÷ are done left to right!",
      sumTip3: "Nested brackets — work from inside",
      sumTip3D: "If there are nested brackets like [(2+3)×4], work the innermost first: (2+3)=5, then 5×4=20.",
      sumTip4: "Verify with step-by-step substitution",
      sumTip4D: "Write each step separately. If there's a mistake, you can immediately see which step it occurred at.",
      conclusionTitle: "CONCLUSION",
      conclusionBody: "Mixed operations are not about calculating fast, but about following the correct order of operations. Always remember the hierarchy: Brackets → Exponents → × and ÷ → + and −. Anyone who follows this rule will never get the wrong answer!",
      tags: ["Brackets First", "Exponents/Roots", "× and ÷ = Equal", "+ and − = Equal", "Left to Right"],
      congratsMsg: "🏆 You have mastered all basic integer operations!",
      backBtn: "Back to Integers",
    },
    ja: {
      title: "混合演算",
      subtitle: "中学1年 - 整数 - 数学",
      secIntroTitle: "混合演算とは？",
      secPrioritasTitle: "計算の順序",
      secKurungTitle: "括弧の種類",
      secContohTitle: "練習問題",
      secKesalahanTitle: "よくある間違い",
      secKesimpulanTitle: "まとめとコツ",
      introP1: "混合演算とは、一つの数式に複数の演算が含まれる計算のことです。料理に例えると、一つの材料だけでなく、いくつかの材料を決まった順番で混ぜる感じです！",
      introExample: "混合演算の例：",
      introExDesc1: "加法、乗法、減法が含まれる",
      introExDesc2: "除法、加法、乗法が含まれる",
      introKeyQ: "重要な問い：",
      introKeyQBody: "どの演算を先にすべきか？順序を間違えると答えが変わります！だから計算の順序を理解する必要があります。",
      prioritasIntro: "混合演算を解くためのルールを覚えましょう（計算の順序）：",
      prioritasTitle: "計算の順序",
      p1Label: "括弧 ( )",
      p1Desc: "括弧の中を最初に計算する",
      p2Label: "指数・累乗",
      p2Desc: "括弧の次に累乗を計算する",
      p3Label: "乗法 × と除法 ÷",
      p3Desc: "同じ優先度 — 左から右へ",
      p4Label: "加法 + と減法 −",
      p4Desc: "加法と減法は最後に、左から右へ",
      prioritasTip: "簡単なコツ：",
      prioritasTipBody: "乗法と除法は同じ優先度なので左から右へ計算します。加法と減法も同様に同じ優先度です！",
      ringkasanIntisari: "まとめ：",
      prioritasFormula: "\\text{括弧} \\rightarrow \\text{指数} \\rightarrow \\times \\div \\rightarrow + -",
      prioritasFormulaNote: "同じ優先度の演算は左から右へ計算する",
      kurungIntro: "数学には3種類の括弧があります。それぞれ優先度が異なります！",
      kurungTitle: "括弧の計算順序：",
      k1Label: "丸括弧",
      k1Desc: "最初に計算する（最も内側）",
      k2Label: "角括弧",
      k2Desc: "丸括弧の後に計算する",
      k3Label: "波括弧",
      k3Desc: "最後に計算する（最も外側）",
      kurungExTitle: "3種類の括弧の例：",
      kurungStep1: "手順1：",
      kurungStep2: "手順2：",
      kurungStep3: "手順3：",
      kurungRemember: "注意！",
      kurungRememberBody: "原則は「内側から外側へ」。最も内側の括弧から順に計算します。",
      badgeEasy: "基本",
      badgeMedium: "標準",
      badgeHard: "発展",
      badgeBonus: "ボーナス",
      example: "例題",
      calculate: "計算しなさい：",
      discussion: "解答：",
      answer: "答え：",
      step: "手順",
      ex1s1: "演算を確認する：加法、乗法、減法",
      ex1s2: "先に乗法を計算する（優先度が高い）：",
      ex1s3: "式に代入する：",
      ex1s4: "左から右へ計算する：",
      ex2s1: "先に乗法と除法を計算する（左から右へ）：",
      ex2note1: "（負 × 正 = 負）",
      ex2note2: "（正 ÷ 負 = 負）",
      ex2s2: "式に代入する：",
      ex2s3: "左から右へ計算する：",
      ex3s1: "丸括弧 ( ) を先に計算する：",
      ex3s2: "式が次のようになる：",
      ex3s3: "角括弧内で乗法を先に計算する：",
      ex3s4: "角括弧の中を計算する：",
      ex3s5: "式が次のようになる：",
      ex3s6: "除法を計算する：",
      ex3s7: "減法を計算する：",
      bonusTitle: "文章問題",
      bonusStory: "ブディさんは果物屋です。朝、オレンジが50kg在庫にあります。昼間に28kg売れ、夕方に各15kgの袋が3袋届きました。夜に12kgのオレンジが腐って廃棄されました。今、ブディさんの在庫は何kgですか？",
      bonusStockNote: "初期在庫 − 販売 + 入荷 − 廃棄",
      bonusS1: "数式に変換する：",
      bonusS2: "括弧内の乗法を計算する：",
      bonusS3: "左から右へ計算する：",
      bonusAns: "ブディさんの在庫は現在55kgです",
      err1Title: "間違い①：優先度を確認せずに左から右へ計算する",
      errWrong: "誤り：",
      errRight: "正解：",
      err1Note: "（乗法を先に計算する！）",
      err2Title: "間違い②：負の数を引くときの符号を忘れる",
      err2Note: "（負を引く = 正を足す！）",
      err3Title: "間違い③：最も内側の括弧を先に計算しない",
      err3Wrong: "誤り：角括弧を先に計算する",
      err3Right: "正解：丸括弧を先に計算する",
      errTip: "ミス防止のコツ：",
      errTipBody: "計算を始める前に、最初に計算すべき演算に印をつけましょう。正しい順序に集中できます！",
      concPriorityTitle: "計算順序のまとめ：",
      concStep1: "1. 括弧 ( ) [ ] { }",
      concStep2: "2. 指数",
      concStep3: "3. × と ÷",
      concStep4: "4. + と −",
      concFormulaNote: "同じ優先度の演算は左から右へ計算する",
      concRulesTitle: "重要なルール：",
      concRule1: "× と ÷ は同じ優先度",
      concRule1Body: "— 両方ある場合は左から右へ計算する。× を先にするわけではない。",
      concRule2: "+ と − は同じ優先度",
      concRule2Body: "— 両方ある場合は左から右へ計算する。+ を先にするわけではない。",
      concRule3: "入れ子の括弧",
      concRule3Body: "— 最も内側の ( ) から先に計算し、次に [ ]、最後に { }。",
      tipTitle: "問題を解くコツ：",
      tip1: "まず問題全体を読む",
      tip1Body: "計算を始める前に — すべての演算を確認し、どれを先にするか印をつける。",
      tip2: "ステップごとに計算する",
      tip2Body: "各ステップの結果を書き留める。頭の中だけで全部計算しようとしない — 間違いやすい！",
      tip3: "書かれた順序に惑わされない。",
      tip3Body: "3+2を先に計算するわけではない！後に書かれていても乗法の優先度は高い。",
      tip4: "最終答えを確認する",
      tip4Body: "元の問題に代入して確認する。不安な場合は手順1からやり直す。",
      summaryTitle: "🔀 完全まとめ",
      summarySubtitle: "整数の混合演算 — 中学1年",
      summarySection1: "計算の優先順位 — 必ず守ること！",
      sumP1Label: "括弧  ( )",
      sumP1Desc: "括弧の中を全て先に計算する（内側から外側へ）。",
      sumP2Label: "指数 / 平方根",
      sumP2Desc: "括弧の後に累乗と平方根を計算する。",
      sumP3Label: "× と ÷  （左から右へ）",
      sumP3Desc: "乗法と除法は同じ優先度。左から右へ計算する。",
      sumP4Label: "+ と −  （左から右へ）",
      sumP4Desc: "加法と減法は最後に、左から右へ計算する。",
      mnemTitle: "🧠 覚え方：",
      mnemPhrase: '"括弧 → 指数 → 乗除 → 加減"',
      mnemNote: "括弧・指数・乗法除法・加法減法の順に計算する",
      summarySection2: "優先順位の適用例",
      exNote1: "(3+2)×4 = 20 ではない ✗",
      exNote2: "括弧を先に計算 ✓",
      exNote3: "× と ÷ を先に、次に −",
      summarySection3: "混合演算のコツ",
      sumTip1: "計算前に手順をマークする",
      sumTip1D: "問題を読んで、最初に計算するものに丸や下線をつける。いきなり計算しない！",
      sumTip2: "左から右への優先度の落とし穴に注意",
      sumTip2D: "12 ÷ 3 × 2 = (12÷3)×2 = 8、12÷(3×2) = 2 ではない。× と ÷ は左から右へ！",
      sumTip3: "入れ子の括弧は内側から計算",
      sumTip3D: "[(2+3)×4]のような入れ子の括弧は最初に(2+3)=5を計算し、次に5×4=20。",
      sumTip4: "段階的な代入で確認",
      sumTip4D: "各ステップを別々に書く。間違いがあれば、どの手順で起きたかすぐわかる。",
      conclusionTitle: "まとめ",
      conclusionBody: "混合演算は速く計算することではなく、正しい順序に従うことです。常に優先順位を覚えておきましょう：括弧 → 指数 → × と ÷ → + と −。このルールに従えば必ず正解できます！",
      tags: ["括弧を先に", "指数/平方根", "× と ÷ = 同じ", "+ と − = 同じ", "左から右へ"],
      congratsMsg: "🏆 整数の基本演算をすべてマスターしました！",
      backBtn: "整数に戻る",
    },
  };

  const c = translations[language];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {c.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {c.subtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{c.secIntroTitle}</span>
              </div>
              {expandedSections.includes("intro") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.introP1}
                </p>
                
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">{c.introExample}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="5 + 3 \times 2 - 1" />
                      <p className="text-white/60 text-xs text-center mt-1">{c.introExDesc1}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="12 \div 4 + 6 \times (-2)" />
                      <p className="text-white/60 text-xs text-center mt-1">{c.introExDesc2}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{c.introKeyQ}</strong> {c.introKeyQBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Aturan Prioritas */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("prioritas")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{c.secPrioritasTitle}</span>
              </div>
              {expandedSections.includes("prioritas") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("prioritas") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.prioritasIntro}
                </p>

                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3 text-center">{c.prioritasTitle}</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">1</span>
                      <div>
                        <p className="font-body font-semibold text-green-300">{c.p1Label}</p>
                        <p className="text-white/60 text-xs">{c.p1Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-blue-500 text-white font-bold px-3 py-1 rounded-full text-sm">2</span>
                      <div>
                        <p className="font-body font-semibold text-blue-300">{c.p2Label}</p>
                        <p className="text-white/60 text-xs">{c.p2Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-yellow-500 text-white font-bold px-3 py-1 rounded-full text-sm">3</span>
                      <div>
                        <p className="font-body font-semibold text-yellow-300">
                          {c.p3Label}
                        </p>
                        <p className="text-white/60 text-xs">{c.p3Desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">4</span>
                      <div>
                        <p className="font-body font-semibold text-red-300">{c.p4Label}</p>
                        <p className="text-white/60 text-xs">{c.p4Desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.prioritasTip}</strong> {c.prioritasTipBody}
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">{c.ringkasanIntisari}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.prioritasFormula} />
                  </div>
                  <p className="text-white/60 text-xs mt-2 text-center">
                    {c.prioritasFormulaNote}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Jenis Kurung */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kurung")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{c.secKurungTitle}</span>
              </div>
              {expandedSections.includes("kurung") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kurung") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.kurungIntro}
                </p>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-3">{c.kurungTitle}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3 flex items-center gap-4">
                      <span className="text-2xl font-mono text-green-400">( )</span>
                      <div>
                        <p className="font-body font-semibold text-green-300">{c.k1Label}</p>
                        <p className="text-white/60 text-xs">{c.k1Desc}</p>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 flex items-center gap-4">
                      <span className="text-2xl font-mono text-blue-400">[ ]</span>
                      <div>
                        <p className="font-body font-semibold text-blue-300">{c.k2Label}</p>
                        <p className="text-white/60 text-xs">{c.k2Desc}</p>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 flex items-center gap-4">
                      <span className="text-2xl font-mono text-purple-400">{"{ }"}</span>
                      <div>
                        <p className="font-body font-semibold text-purple-300">{c.k3Label}</p>
                        <p className="text-white/60 text-xs">{c.k3Desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-orange-300 mb-3">{c.kurungExTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <BlockMath math="\{5 + [3 \times (2 + 1)]\}" />
                    <p className="text-white/60 text-xs">{c.kurungStep1} <InlineMath math="(2 + 1) = 3" /></p>
                    <p className="text-white/60 text-xs">{c.kurungStep2} <InlineMath math="[3 \times 3] = 9" /></p>
                    <p className="text-green-400 text-sm">{c.kurungStep3} <InlineMath math="\{5 + 9\} = 14" /></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{c.kurungRemember}</strong> {c.kurungRememberBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">{c.secContohTitle}</span>
              </div>
              {expandedSections.includes("contoh") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeEasy}</span>
                    <span className="font-body font-semibold text-green-300">{c.example} 1</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.calculate}</p>
                    <BlockMath math="8 + 4 \times 3 - 10" />
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step} 1:</strong> {c.ex1s1}</p>
                      <p className="text-white/70"><strong>{c.step} 2:</strong> {c.ex1s2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="4 \times 3 = 12" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 3:</strong> {c.ex1s3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="8 + 12 - 10" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 4:</strong> {c.ex1s4}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="8 + 12 = 20" />
                        <br />
                        <InlineMath math="20 - 10 = 10" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answer} <InlineMath math="8 + 4 \times 3 - 10 = 10" /></p>
                    </div>
                  </div>
                </div>

                {/* Medium */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeMedium}</span>
                    <span className="font-body font-semibold text-yellow-300">{c.example} 2</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.calculate}</p>
                    <BlockMath math="(-6) \times 4 + 24 \div (-3) - 5" />
                  </div>
                  <div className="border-t border-yellow-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-yellow-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step} 1:</strong> {c.ex2s1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4 space-y-1">
                        <p><InlineMath math="(-6) \times 4 = -24" /> <span className="text-white/50 text-xs">{c.ex2note1}</span></p>
                        <p><InlineMath math="24 \div (-3) = -8" /> <span className="text-white/50 text-xs">{c.ex2note2}</span></p>
                      </div>
                      <p className="text-white/70"><strong>{c.step} 2:</strong> {c.ex2s2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="-24 + (-8) - 5" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 3:</strong> {c.ex2s3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="-24 + (-8) = -32" />
                        <br />
                        <InlineMath math="-32 - 5 = -37" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answer} <InlineMath math="(-6) \times 4 + 24 \div (-3) - 5 = -37" /></p>
                    </div>
                  </div>
                </div>

                {/* Hard */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeHard}</span>
                    <span className="font-body font-semibold text-red-300">{c.example} 3</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.calculate}</p>
                    <BlockMath math="15 - [(-8) + 4 \times (6 - 9)] \div 5" />
                  </div>
                  <div className="border-t border-red-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-red-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step} 1:</strong> {c.ex3s1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="6 - 9 = -3" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 2:</strong> {c.ex3s2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="15 - [(-8) + 4 \times (-3)] \div 5" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 3:</strong> {c.ex3s3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="4 \times (-3) = -12" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 4:</strong> {c.ex3s4}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="(-8) + (-12) = -20" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 5:</strong> {c.ex3s5}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="15 - (-20) \div 5" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 6:</strong> {c.ex3s6}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="(-20) \div 5 = -4" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 7:</strong> {c.ex3s7}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="15 - (-4) = 15 + 4 = 19" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answer} <InlineMath math="15 - [(-8) + 4 \times (6 - 9)] \div 5 = 19" /></p>
                    </div>
                  </div>
                </div>

                {/* Bonus */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeBonus}</span>
                    <span className="font-body font-semibold text-purple-300">{c.bonusTitle}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white leading-relaxed">{c.bonusStory}</p>
                  </div>
                  <div className="border-t border-purple-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-purple-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step} 1:</strong> {c.bonusS1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs mb-1">{c.bonusStockNote}</p>
                        <InlineMath math="50 - 28 + (3 \times 15) - 12" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 2:</strong> {c.bonusS2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="3 \times 15 = 45" />
                      </div>
                      <p className="text-white/70"><strong>{c.step} 3:</strong> {c.bonusS3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="50 - 28 + 45 - 12" />
                        <br />
                        <InlineMath math="= 22 + 45 - 12" />
                        <br />
                        <InlineMath math="= 67 - 12" />
                        <br />
                        <InlineMath math="= 55" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answer} {c.bonusAns}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesalahan Umum */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesalahan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">{c.secKesalahanTitle}</span>
              </div>
              {expandedSections.includes("kesalahan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesalahan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">{c.err1Title}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-red-400 text-xs mb-1">{c.errWrong}</p>
                      <InlineMath math="5 + 3 \times 2 = 8 \times 2 = 16" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-xs mb-1">{c.errRight}</p>
                      <InlineMath math="5 + 3 \times 2 = 5 + 6 = 11" />
                      <p className="text-white/50 text-xs mt-1">{c.err1Note}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">{c.err2Title}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-red-400 text-xs mb-1">{c.errWrong}</p>
                      <InlineMath math="10 - (-5) = 10 - 5 = 5" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-xs mb-1">{c.errRight}</p>
                      <InlineMath math="10 - (-5) = 10 + 5 = 15" />
                      <p className="text-white/50 text-xs mt-1">{c.err2Note}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">{c.err3Title}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-red-400 text-xs mb-1">{c.err3Wrong}</p>
                      <InlineMath math="[3 + (2 \times 4)] \rightarrow [3 + 2] \times 4 = 20" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-xs mb-1">{c.err3Right}</p>
                      <InlineMath math="[3 + (2 \times 4)] = [3 + 8] = 11" />
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.errTip}</strong> {c.errTipBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesimpulan & Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-body font-semibold text-white">{c.secKesimpulanTitle}</span>
              </div>
              {expandedSections.includes("kesimpulan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesimpulan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">{c.concPriorityTitle}</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="bg-green-500/20 border border-green-500/40 text-green-300 font-bold px-3 py-2 rounded-lg text-sm">{c.concStep1}</span>
                    <span className="text-white/40 font-bold">→</span>
                    <span className="bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold px-3 py-2 rounded-lg text-sm">{c.concStep2}</span>
                    <span className="text-white/40 font-bold">→</span>
                    <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-bold px-3 py-2 rounded-lg text-sm">{c.concStep3}</span>
                    <span className="text-white/40 font-bold">→</span>
                    <span className="bg-red-500/20 border border-red-500/40 text-red-300 font-bold px-3 py-2 rounded-lg text-sm">{c.concStep4}</span>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 mt-3">
                    <BlockMath math={c.prioritasFormula} />
                    <p className="text-white/60 text-xs text-center mt-1">{c.concFormulaNote}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">{c.concRulesTitle}</p>
                  <div className="space-y-2">
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.concRule1}</strong> {c.concRule1Body}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Zap className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-red-300">{c.concRule2}</strong> {c.concRule2Body}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-orange-300">{c.concRule3}</strong> {c.concRule3Body}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-3">{c.tipTitle}</p>
                  <div className="space-y-3">
                    {[
                      { n: "1", bold: c.tip1, body: c.tip1Body },
                      { n: "2", bold: c.tip2, body: c.tip2Body },
                      { n: "3", bold: c.tip3, body: <><InlineMath math="3 + 2 \times 4" /> {c.tip3Body}</> },
                      { n: "4", bold: c.tip4, body: c.tip4Body },
                    ].map(({ n, bold, body }) => (
                      <div key={n} className="flex gap-3 items-start">
                        <span className="text-yellow-400 font-bold text-lg leading-none">{n}.</span>
                        <p className="font-body text-sm text-white/80">
                          <strong className="text-yellow-300">{bold}</strong>{" "}{body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{c.summaryTitle}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{c.summarySubtitle}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">1</span>
                  {c.summarySection1}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { nomor: "1", label: c.sumP1Label, desc: c.sumP1Desc, color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200", badge: "bg-red-500" },
                    { nomor: "2", label: c.sumP2Label, desc: c.sumP2Desc, color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200", badge: "bg-orange-500" },
                    { nomor: "3", label: c.sumP3Label, desc: c.sumP3Desc, color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200", badge: "bg-yellow-500" },
                    { nomor: "4", label: c.sumP4Label, desc: c.sumP4Desc, color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200", badge: "bg-green-500" },
                  ].map(({ nomor, label, desc, color, badge }) => (
                    <div key={nomor} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className={`${badge} text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5`}>{nomor}</span>
                      <div>
                        <p className="font-body text-xs font-bold">{label}</p>
                        <p className="font-body text-xs text-white/65 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/30 border border-amber-500/40 rounded-xl px-4 py-3 text-center">
                  <p className="font-body text-xs font-bold text-yellow-200">{c.mnemTitle}</p>
                  <p className="font-body text-sm text-white font-bold mt-1">{c.mnemPhrase}</p>
                  <p className="font-body text-xs text-white/50 mt-1">{c.mnemNote}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/30 border border-amber-500 flex items-center justify-center text-[10px]">2</span>
                  {c.summarySection2}
                </p>
                <div className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-4 space-y-3">
                  {[
                    { soal: "3 + 2 × 4", langkah: "= 3 + (2 × 4) = 3 + 8 = 11", note: c.exNote1, color: "text-yellow-300" },
                    { soal: "(−5 + 3) × (−2)", langkah: "= (−2) × (−2) = 4", note: c.exNote2, color: "text-green-300" },
                    { soal: "20 ÷ (−4) − 3 × 2", langkah: "= (−5) − 6 = −11", note: c.exNote3, color: "text-cyan-300" },
                  ].map(({ soal, langkah, note, color }) => (
                    <div key={soal} className="flex gap-3">
                      <p className={`font-mono text-xs font-bold ${color} shrink-0 min-w-[120px]`}>{soal}</p>
                      <div>
                        <p className="font-mono text-xs text-white/80">{langkah}</p>
                        <p className="font-body text-[11px] text-white/40 italic">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500 flex items-center justify-center text-[10px]">3</span>
                  {c.summarySection3}
                </p>
                <div className="space-y-2">
                  {[
                    { icon: "📝", tip: c.sumTip1, detail: c.sumTip1D, color: "bg-yellow-900/30 border-yellow-500/30" },
                    { icon: "🔍", tip: c.sumTip2, detail: c.sumTip2D, color: "bg-orange-900/30 border-orange-500/30" },
                    { icon: "🎯", tip: c.sumTip3, detail: c.sumTip3D, color: "bg-red-900/30 border-red-500/30" },
                    { icon: "✅", tip: c.sumTip4, detail: c.sumTip4D, color: "bg-green-900/30 border-green-500/30" },
                  ].map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 via-amber-500/15 to-orange-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🎓</div>
                <p className="font-display text-base font-bold text-white">{c.conclusionTitle}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">{c.conclusionBody}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {c.tags.map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{c.congratsMsg}</p>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {c.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperasiCampuranBilanganBulatPage;
