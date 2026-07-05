import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  id: {
    pageTitle: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT",
    pageSub: "Kelas 9 · Bilangan Berpangkat · Materi Matematika",
    // Intro
    sec_intro: "Kenapa Kita Butuh Sifat-Sifat Pangkat?",
    intro_p: "Bayangkan kamu harus menghitung",
    intro_p2: ". Kalau ditulis penuh, itu",
    intro_p3: "25 kali perkalian",
    intro_p4: "! Tapi dengan sifat-sifat pangkat, kamu bisa selesaikan dalam hitungan detik. Sifat-sifat ini bukan sulap — semuanya punya logika yang bisa kamu turunkan sendiri.",
    intro_box: "Ada",
    intro_box2: "9 sifat utama",
    intro_box3: "bilangan berpangkat. Kuasai semuanya dan kamu akan jago menyederhanakan ekspresi matematika yang tampak rumit sekalipun! 🚀",
    tip_learn: "Tips:",
    tip_learn2: "Pelajari",
    tip_learn3: "cara menurunkan",
    tip_learn4: "rumusnya, bukan cuma menghafalnya. Jika lupa, kamu bisa reconstruct sendiri!",
    badge_intisari: "🎯 Ringkasan Intisari",
    asal_usul: "🔍 ASAL USUL RUMUS:",
    // Sifat 1
    sec_k1: "Sifat 1",
    k1_desc: "Ketika dua bilangan berpangkat dengan",
    k1_desc2: "basis yang sama",
    k1_desc3: "dikalikan, cukup",
    k1_desc4: "jumlahkan pangkatnya",
    k1_desc5: "saja. Basis tidak berubah.",
    k1_expand: "Ekspansi langsung dari definisi perkalian berulang:",
    k1_times: "kali",
    k1_note: "Catatan:",
    k1_note2: "Sifat ini hanya berlaku jika",
    k1_note3: "basisnya sama",
    k1_note4: "tidak bisa digabung.",
    // Sifat 2
    sec_k2: "Sifat 2",
    k2_desc: "Ketika basis yang sama",
    k2_desc2: "dibagi",
    k2_desc3: ", cukup",
    k2_desc4: "kurangkan pangkat penyebut dari pangkat pembilang",
    k2_desc5: ". Berlaku selama",
    k2_expand_note: "Anggap",
    k2_expand_note2: ". Masing-masing faktor",
    k2_expand_note3: "yang sama di atas dan bawah saling menghilangkan:",
    k2_note: "Catatan:",
    k2_note2: "Jika",
    k2_note3: ", hasilnya",
    k2_note4: ". Jika",
    k2_note5: ", hasilnya pangkat negatif (lihat Sifat 7).",
    // Sifat 3
    sec_k3: "Sifat 3",
    k3_desc: "Ketika suatu bilangan berpangkat",
    k3_desc2: "dipangkatkan lagi",
    k3_desc3: ", cukup",
    k3_desc4: "kalikan kedua pangkatnya",
    k3_desc5: ". Ini disebut",
    k3_desc6: "pangkat dari pangkat",
    k3_expand_note: "Gunakan Sifat 1 berulang kali:",
    // Expanded — language-specific text for the n-kali underbrace
    k3_ntimes: "n kali",
    k3_note: "Catatan:",
    k3_note2: "Jangan keliru!",
    k3_note3: ". Yang benar adalah",
    k3_note4: ", bukan",
    k3_note5: "dipangkat",
    // Sifat 4
    sec_k4: "Sifat 4",
    k4_desc: "Pangkat dari sebuah",
    k4_desc2: "perkalian",
    k4_desc3: "bisa",
    k4_desc4: "didistribusikan",
    k4_desc5: "ke masing-masing faktornya. Seperti berbagi \"beban pangkat\" secara merata.",
    k4_tip: "Tips:",
    k4_tip2: "Berlaku juga untuk lebih dari dua faktor:",
    k4_tip3: ". Distribusikan ke semua!",
    // Sifat 5
    sec_k5: "Sifat 5",
    k5_desc: "Pangkat dari sebuah",
    k5_desc2: "pecahan",
    k5_desc3: "bisa didistribusikan secara terpisah ke",
    k5_desc4: "pembilang dan penyebut",
    k5_desc5: ". Berlaku selama",
    k5_tip: "Tips:",
    k5_tip2: "Ini adalah kebalikan dari Sifat 4 — tapi untuk pembagian. Logikanya sama persis!",
    // Sifat 6
    sec_k6: "Sifat 6",
    k6_desc: "Bilangan apa pun (kecuali nol) yang dipangkatkan nol selalu menghasilkan",
    k6_desc2: "1",
    k6_desc3: ". Ini bukan definisi sembarangan — ada logika matematika yang mendasarinya!",
    k6_cara1: "Cara 1 — Pola Pembagian:",
    k6_cara2: "Cara 2 — Pola Deret:",
    k6_seq_note: "Setiap turun satu pangkat, nilainya dibagi 2 → maka",
    k6_note: "Catatan Penting:",
    k6_note2: "tidak terdefinisi! Hanya",
    k6_note3: "jika",
    // Sifat 7
    sec_k7: "Sifat 7",
    k7_desc: "Pangkat negatif adalah",
    k7_desc2: "kebalikan (invers)",
    k7_desc3: "dari pangkat positif:",
    k7_expand: "Dari Sifat 6 dan Sifat 2:",
    k7_note: "Tips:",
    k7_note2: "Cara mudah mengingat:",
    k7_note3: "pangkat negatif = balik posisi basis ke pecahan",
    k7_note4: ". Misalnya:",
    // Sifat 8
    sec_k8: "Sifat 8",
    k8_desc: "Pangkat pecahan menghubungkan",
    k8_desc2: "bilangan berpangkat dengan bentuk akar",
    k8_desc3: ". Penyebut pecahan menjadi indeks akar:",
    k8_note: "Tips:",
    k8_note2: "Penyebut = indeks akar · Pembilang = pangkat radicand. Mudah diingat!",
    // Sifat 9
    sec_k9: "Sifat 9",
    k9_desc: "Jika dua bilangan berpangkat dengan pangkat yang sama",
    k9_desc2: "dikalikan",
    k9_desc3: ", hasilnya bisa ditulis sebagai",
    k9_desc4: "perkalian basis dipangkatkan",
    k9_desc5: ". Ini kebalikan dari Sifat 4!",
    k9_note: "Tips:",
    k9_note2: "Kadang lebih mudah gabungkan basis dulu sebelum pangkatkan!",
    // Rangkuman
    sec_rangkuman: "📊 Rangkuman 9 Sifat Bilangan Berpangkat",
    col_no: "No",
    col_nama: "Nama",
    col_rumus: "Rumus",
    r1_nama: "Perkalian",
    r2_nama: "Pembagian",
    r3_nama: "Pangkat dari pangkat",
    r4_nama: "Perkalian ke pangkat",
    r5_nama: "Pecahan ke pangkat",
    r6_nama: "Pangkat nol",
    r7_nama: "Pangkat negatif",
    r8_nama: "Pangkat pecahan",
    r9_nama: "Perkalian → basis",
    // step/example labels
    step: "Langkah",
    pembahasan: "PEMBAHASAN:",
    example: "Contoh",
    diff_easy: "MUDAH",
    diff_med: "SEDANG",
    diff_hard: "SULIT",
    catatan: "Catatan:",
    basis_sama: "Basis sama",
    tiga_faktor: "Tiga faktor dengan basis sama",
    semua_dijumlah: ", semua pangkat dijumlahkan sekaligus:",
    kurangkan: "Basis sama, kurangkan pangkat:",
    kalikan: "Kalikan pangkatnya:",
    dalam_ke_luar: "Langkah 1: Kerjakan dari dalam ke luar:",
    langsung: "Atau langsung:",
    distribusi: "Distribusikan pangkat:",
    verif: "Verifikasi:",
    distribusi_faktor: "Distribusikan pangkat ke setiap faktor:",
    expand_masing: "Langkah 1: Ekspansi masing-masing:",
    kalikan_gabung: "Langkah 2: Kalikan, gabungkan basis yang sama:",
    // k6 proof note with \text{dan} fix
    k6_proof_dan: "dan",
    // k6 solution note
    k6_proof_note: "Dari pola pembagian:",
    k6_proof_note2: "dan dari definisi pecahan:",
    // karena fix
    karena: "karena",
    // contoh soal titles
    sec_c1: "Contoh Soal — Sifat 1",
    sec_c2: "Contoh Soal — Sifat 2",
    sec_c3: "Contoh Soal — Sifat 3",
    sec_c4: "Contoh Soal — Sifat 4",
    sec_c5: "Contoh Soal — Sifat 5",
    sec_c6: "Contoh Soal — Sifat 6",
    sec_c7: "Contoh Soal — Sifat 7",
    sec_c8: "Contoh Soal — Sifat 8",
    sec_c9: "Contoh Soal — Sifat 9",
    sederhanakan: "Sederhanakan:",
    hitung: "Hitunglah:",
    tentukan: "tentukan",
    nilai: "nilai",
    dan: "dan",
    maka: "maka",
    lalu_hitung: "lalu hitung",
    ubah: "Ubah",
    ke_basis: "ke basis 3:",
    substitusi: "Substitusi:",
    expand_perpangkatan: "Ekspansi perpangkatan:",
    bagi: "Bagi (kalikan dengan kebalikan penyebut):",
    cara1: "Cara 1 — Pola Pembagian:",
    cara2: "Cara 2 — Pola Deret:",
    terapkan: "Terapkan sifat",
    samakan: "Samakan dengan ruas kanan:",
    penyebut_s1: "Sederhanakan penyebut dengan Sifat 1:",
    gunakan_s2: "Gunakan Sifat 2:",
    dari_dalam: "Kerjakan dari dalam ke luar:",
    atau_langsung: "Atau langsung:",
    distribusi_ke: "Distribusikan pangkat ke setiap faktor:",
    expand_dua: "Ekspansi masing-masing:",
    kalikan_s1: "Kalikan, gabungkan basis yang sama:",
    ubah_k_akar: "Ubah ke bentuk akar:",
    cari_dulu: "Cari",
    terlebih: "terlebih dahulu:",
    pangkat3: "Pangkatkan dengan 3:",
    ubah_basis: "Ubah semua ke basis 3:",
    // k8 proof
    akar_ke_pangkat: "Gunakan hubungan akar dan pangkat pecahan:",
    // k6 result
    k6_both: "Keduanya menghasilkan 1 → maka",
    // k7 contoh
    k7_pindahkan: "Pindahkan ke bawah / ke atas garis pecahan:",
    // k9 contoh
    k9_gabungkan: "Gabungkan basis:",
    k9_langsung: "Atau langsung kalikan hasilnya:",
    // Sifat 9 formula
    s9_formula_note: "Hanya berlaku jika pangkatnya sama!",
    // extra
    jika: "Jika",
    maka_: "maka",
    hasil: "Hasil:",
    langkah: "Langkah",
  },
  en: {
    pageTitle: "LAWS OF EXPONENTS",
    pageSub: "Grade 9 · Exponents & Powers · Math Materials",
    sec_intro: "Why Do We Need the Laws of Exponents?",
    intro_p: "Imagine calculating",
    intro_p2: ". Written out fully, that's",
    intro_p3: "25 multiplications",
    intro_p4: "! But with the laws of exponents, you can solve it in seconds. These aren't tricks — they all have logic you can derive yourself.",
    intro_box: "There are",
    intro_box2: "9 main laws",
    intro_box3: "of exponents. Master them all and you'll simplify even complex-looking expressions easily! 🚀",
    tip_learn: "Tip:",
    tip_learn2: "Learn",
    tip_learn3: "how to derive",
    tip_learn4: "the formulas, not just memorise them. If you forget, you can reconstruct them yourself!",
    badge_intisari: "🎯 Key Summary",
    asal_usul: "🔍 FORMULA DERIVATION:",
    sec_k1: "Law 1",
    k1_desc: "When two powers with the",
    k1_desc2: "same base",
    k1_desc3: "are multiplied, simply",
    k1_desc4: "add the exponents",
    k1_desc5: ". The base stays the same.",
    k1_expand: "Direct expansion from the repeated multiplication definition:",
    k1_times: "times",
    k1_note: "Note:",
    k1_note2: "This law only works when the",
    k1_note3: "bases are the same",
    k1_note4: "cannot be combined.",
    sec_k2: "Law 2",
    k2_desc: "When the same base is",
    k2_desc2: "divided",
    k2_desc3: ", simply",
    k2_desc4: "subtract the denominator exponent from the numerator exponent",
    k2_desc5: ". Valid as long as",
    k2_expand_note: "Assume",
    k2_expand_note2: ". Matching factors of",
    k2_expand_note3: "in numerator and denominator cancel:",
    k2_note: "Note:",
    k2_note2: "If",
    k2_note3: ", the result is",
    k2_note4: ". If",
    k2_note5: ", the result is a negative exponent (see Law 7).",
    sec_k3: "Law 3",
    k3_desc: "When a power is",
    k3_desc2: "raised to another power",
    k3_desc3: ", simply",
    k3_desc4: "multiply the two exponents",
    k3_desc5: ". This is called",
    k3_desc6: "power of a power",
    k3_expand_note: "Apply Law 1 repeatedly:",
    k3_ntimes: "n times",
    k3_note: "Note:",
    k3_note2: "Don't confuse!",
    k3_note3: ". The correct form is",
    k3_note4: ", not",
    k3_note5: "raised to",
    sec_k4: "Law 4",
    k4_desc: "The power of a",
    k4_desc2: "product",
    k4_desc3: "can be",
    k4_desc4: "distributed",
    k4_desc5: "to each factor. Like sharing the \"exponent burden\" equally.",
    k4_tip: "Tip:",
    k4_tip2: "Also works for more than two factors:",
    k4_tip3: ". Distribute to all!",
    sec_k5: "Law 5",
    k5_desc: "The power of a",
    k5_desc2: "fraction",
    k5_desc3: "can be distributed separately to the",
    k5_desc4: "numerator and denominator",
    k5_desc5: ". Valid as long as",
    k5_tip: "Tip:",
    k5_tip2: "This is the counterpart of Law 4 — but for division. Same logic!",
    sec_k6: "Law 6",
    k6_desc: "Any non-zero number raised to the power of zero always equals",
    k6_desc2: "1",
    k6_desc3: ". This isn't arbitrary — there's solid mathematical reasoning behind it!",
    k6_cara1: "Method 1 — Division Pattern:",
    k6_cara2: "Method 2 — Sequence Pattern:",
    k6_seq_note: "Each step down divides by 2 → therefore",
    k6_note: "Important Note:",
    k6_note2: "is undefined! Only",
    k6_note3: "when",
    sec_k7: "Law 7",
    k7_desc: "A negative exponent is the",
    k7_desc2: "reciprocal (multiplicative inverse)",
    k7_desc3: "of the positive exponent:",
    k7_expand: "From Law 6 and Law 2:",
    k7_note: "Tip:",
    k7_note2: "Easy way to remember:",
    k7_note3: "negative exponent = flip the base into a fraction",
    k7_note4: ". For example:",
    sec_k8: "Law 8",
    k8_desc: "Fractional exponents connect",
    k8_desc2: "powers and radical expressions",
    k8_desc3: ". The denominator of the fraction becomes the index of the radical:",
    k8_note: "Tip:",
    k8_note2: "Denominator = radical index · Numerator = power of radicand. Easy to remember!",
    sec_k9: "Law 9",
    k9_desc: "When two powers with the same exponent are",
    k9_desc2: "multiplied",
    k9_desc3: ", the result can be written as the",
    k9_desc4: "product of bases raised to that exponent",
    k9_desc5: ". This is the reverse of Law 4!",
    k9_note: "Tip:",
    k9_note2: "Sometimes it's easier to combine the bases first before raising to the power!",
    sec_rangkuman: "📊 Summary: 9 Laws of Exponents",
    col_no: "No",
    col_nama: "Name",
    col_rumus: "Formula",
    r1_nama: "Multiplication",
    r2_nama: "Division",
    r3_nama: "Power of a power",
    r4_nama: "Power of a product",
    r5_nama: "Power of a fraction",
    r6_nama: "Zero exponent",
    r7_nama: "Negative exponent",
    r8_nama: "Fractional exponent",
    r9_nama: "Product of same powers",
    step: "Step",
    pembahasan: "SOLUTION:",
    example: "Example",
    diff_easy: "EASY",
    diff_med: "MEDIUM",
    diff_hard: "HARD",
    catatan: "Note:",
    basis_sama: "Same base",
    tiga_faktor: "Three factors with the same base",
    semua_dijumlah: ", all exponents added at once:",
    kurangkan: "Same base, subtract exponents:",
    kalikan: "Multiply the exponents:",
    dalam_ke_luar: "Step 1: Work from inside out:",
    langsung: "Or directly:",
    distribusi: "Distribute the exponent:",
    verif: "Verify:",
    distribusi_faktor: "Distribute the exponent to each factor:",
    expand_masing: "Step 1: Expand each:",
    kalikan_gabung: "Step 2: Multiply, combine same bases:",
    k6_proof_dan: "and",
    k6_proof_note: "From the division pattern:",
    k6_proof_note2: "and from the fraction definition:",
    karena: "since",
    sec_c1: "Practice Problems — Law 1",
    sec_c2: "Practice Problems — Law 2",
    sec_c3: "Practice Problems — Law 3",
    sec_c4: "Practice Problems — Law 4",
    sec_c5: "Practice Problems — Law 5",
    sec_c6: "Practice Problems — Law 6",
    sec_c7: "Practice Problems — Law 7",
    sec_c8: "Practice Problems — Law 8",
    sec_c9: "Practice Problems — Law 9",
    sederhanakan: "Simplify:",
    hitung: "Calculate:",
    tentukan: "find",
    nilai: "the value",
    dan: "and",
    maka: "then",
    lalu_hitung: "then calculate",
    ubah: "Convert",
    ke_basis: "to base 3:",
    substitusi: "Substitute:",
    expand_perpangkatan: "Expand the power:",
    bagi: "Divide (multiply by the reciprocal):",
    cara1: "Method 1 — Division Pattern:",
    cara2: "Method 2 — Sequence Pattern:",
    terapkan: "Apply law",
    samakan: "Set equal to the right side:",
    penyebut_s1: "Simplify the denominator using Law 1:",
    gunakan_s2: "Apply Law 2:",
    dari_dalam: "Work from inside out:",
    atau_langsung: "Or directly:",
    distribusi_ke: "Distribute the exponent to each factor:",
    expand_dua: "Expand each:",
    kalikan_s1: "Multiply, combine same bases:",
    ubah_k_akar: "Convert to radical form:",
    cari_dulu: "Find",
    terlebih: "first:",
    pangkat3: "Raise to the power of 3:",
    ubah_basis: "Convert all to base 3:",
    akar_ke_pangkat: "Use the radical–fractional exponent relationship:",
    k6_both: "Both equal 1 → therefore",
    k7_pindahkan: "Move between numerator and denominator:",
    k9_gabungkan: "Combine the bases:",
    k9_langsung: "Or just multiply the results:",
    s9_formula_note: "Only valid when the exponents are equal!",
    jika: "If",
    maka_: "then",
    hasil: "Result:",
    langkah: "Step",
  },
  ja: {
    pageTitle: "指数法則",
    pageSub: "中学3年 · 累乗・指数 · 数学教材",
    sec_intro: "なぜ指数法則が必要か？",
    intro_p: "もし",
    intro_p2: "を計算するとき、全部展開すると",
    intro_p3: "25回の掛け算",
    intro_p4: "になる！でも指数法則を使えば数秒で解ける。これは魔法ではなく、すべて自分で導ける論理だ。",
    intro_box: "指数には",
    intro_box2: "9つの主要な法則",
    intro_box3: "がある。すべてマスターすれば、複雑な式もスラスラ簡略化できる！ 🚀",
    tip_learn: "ヒント：",
    tip_learn2: "",
    tip_learn3: "公式の導き方",
    tip_learn4: "を学ぼう。丸暗記ではなく。忘れても自分で再導できる！",
    badge_intisari: "🎯 要点まとめ",
    asal_usul: "🔍 公式の導き方：",
    sec_k1: "法則1",
    k1_desc: "同じ底の累乗を",
    k1_desc2: "掛け合わせる",
    k1_desc3: "とき、",
    k1_desc4: "指数を足す",
    k1_desc5: "だけでよい。底は変わらない。",
    k1_expand: "繰り返し掛け算の定義からの展開：",
    k1_times: "回",
    k1_note: "注意：",
    k1_note2: "この法則は",
    k1_note3: "底が同じ",
    k1_note4: "ときのみ有効！異なる底は結合できない。",
    sec_k2: "法則2",
    k2_desc: "同じ底の累乗を",
    k2_desc2: "割る",
    k2_desc3: "とき、",
    k2_desc4: "分子の指数から分母の指数を引く",
    k2_desc5: "。ただし",
    k2_expand_note: "仮定：",
    k2_expand_note2: "。分子と分母の共通因数",
    k2_expand_note3: "が消える：",
    k2_note: "注意：",
    k2_note2: "もし",
    k2_note3: "なら結果は",
    k2_note4: "。もし",
    k2_note5: "なら負の指数（法則7を参照）。",
    sec_k3: "法則3",
    k3_desc: "累乗を",
    k3_desc2: "さらに累乗する",
    k3_desc3: "とき、",
    k3_desc4: "2つの指数を掛ける",
    k3_desc5: "。これを",
    k3_desc6: "累乗の累乗",
    k3_expand_note: "法則1を繰り返し適用：",
    k3_ntimes: "n回",
    k3_note: "注意：",
    k3_note2: "混同しないように！",
    k3_note3: "正しくは",
    k3_note4: "であり、",
    k3_note5: "の",
    sec_k4: "法則4",
    k4_desc: "",
    k4_desc2: "積",
    k4_desc3: "の累乗は、",
    k4_desc4: "各因数に分配",
    k4_desc5: "できる。",
    k4_tip: "ヒント：",
    k4_tip2: "3つ以上の因数にも使える：",
    k4_tip3: "。全部に分配！",
    sec_k5: "法則5",
    k5_desc: "",
    k5_desc2: "分数",
    k5_desc3: "の累乗は、",
    k5_desc4: "分子と分母に別々に",
    k5_desc5: "分配できる。ただし",
    k5_tip: "ヒント：",
    k5_tip2: "法則4の分数版。同じ論理！",
    sec_k6: "法則6",
    k6_desc: "ゼロでない数の0乗は常に",
    k6_desc2: "1",
    k6_desc3: "になる。これは任意の定義ではなく、数学的な論理がある！",
    k6_cara1: "方法1 — 除法パターン：",
    k6_cara2: "方法2 — 数列パターン：",
    k6_seq_note: "1段下がるごとに2で割る → よって",
    k6_note: "重要：",
    k6_note2: "は未定義！",
    k6_note3: "のとき",
    sec_k7: "法則7",
    k7_desc: "負の指数は正の指数の",
    k7_desc2: "逆数（乗法的逆元）",
    k7_desc3: "：",
    k7_expand: "法則6と法則2から：",
    k7_note: "ヒント：",
    k7_note2: "覚え方：",
    k7_note3: "負の指数 = 底を分数の逆位置に移す",
    k7_note4: "。例：",
    sec_k8: "法則8",
    k8_desc: "分数指数は",
    k8_desc2: "累乗と根号を結ぶ",
    k8_desc3: "。分母が根号の指数になる：",
    k8_note: "ヒント：",
    k8_note2: "分母 = 根号の次数 · 分子 = 被開数の指数。覚えやすい！",
    sec_k9: "法則9",
    k9_desc: "同じ指数の累乗を",
    k9_desc2: "掛け合わせる",
    k9_desc3: "と、",
    k9_desc4: "底の積を同じ指数で累乗した形",
    k9_desc5: "に書ける。法則4の逆！",
    k9_note: "ヒント：",
    k9_note2: "先に底を合わせてから累乗する方が楽なこともある！",
    sec_rangkuman: "📊 まとめ：指数の9つの法則",
    col_no: "No",
    col_nama: "名前",
    col_rumus: "公式",
    r1_nama: "乗法",
    r2_nama: "除法",
    r3_nama: "累乗の累乗",
    r4_nama: "積の累乗",
    r5_nama: "分数の累乗",
    r6_nama: "零乗",
    r7_nama: "負の指数",
    r8_nama: "分数指数",
    r9_nama: "同指数の積",
    step: "ステップ",
    pembahasan: "解説：",
    example: "例題",
    diff_easy: "基本",
    diff_med: "標準",
    diff_hard: "発展",
    catatan: "注意：",
    basis_sama: "底が同じ",
    tiga_faktor: "同じ底の3つの因数",
    semua_dijumlah: "、指数をすべて一度に足す：",
    kurangkan: "底が同じ、指数を引く：",
    kalikan: "指数を掛ける：",
    dalam_ke_luar: "ステップ1：内側から外側へ：",
    langsung: "または直接：",
    distribusi: "指数を分配：",
    verif: "確認：",
    distribusi_faktor: "各因数に指数を分配：",
    expand_masing: "ステップ1：それぞれ展開：",
    kalikan_gabung: "ステップ2：掛け算し、同じ底をまとめる：",
    k6_proof_dan: "かつ",
    k6_proof_note: "除法パターンから：",
    k6_proof_note2: "分数の定義から：",
    karena: "なぜなら",
    sec_c1: "練習問題 — 法則1",
    sec_c2: "練習問題 — 法則2",
    sec_c3: "練習問題 — 法則3",
    sec_c4: "練習問題 — 法則4",
    sec_c5: "練習問題 — 法則5",
    sec_c6: "練習問題 — 法則6",
    sec_c7: "練習問題 — 法則7",
    sec_c8: "練習問題 — 法則8",
    sec_c9: "練習問題 — 法則9",
    sederhanakan: "簡略化せよ：",
    hitung: "計算せよ：",
    tentukan: "求めよ",
    nilai: "の値",
    dan: "と",
    maka: "そして",
    lalu_hitung: "を計算せよ",
    ubah: "変換",
    ke_basis: "を底3に：",
    substitusi: "代入：",
    expand_perpangkatan: "累乗を展開：",
    bagi: "割り算（逆数を掛ける）：",
    cara1: "方法1 — 除法パターン：",
    cara2: "方法2 — 数列パターン：",
    terapkan: "法則",
    samakan: "右辺と等しくする：",
    penyebut_s1: "法則1で分母を簡略化：",
    gunakan_s2: "法則2を使う：",
    dari_dalam: "内側から外側へ：",
    atau_langsung: "または直接：",
    distribusi_ke: "各因数に指数を分配：",
    expand_dua: "それぞれ展開：",
    kalikan_s1: "掛けて同じ底をまとめる：",
    ubah_k_akar: "根号の形に変換：",
    cari_dulu: "まず",
    terlebih: "を求める：",
    pangkat3: "3乗する：",
    ubah_basis: "すべて底3に変換：",
    akar_ke_pangkat: "根号と分数指数の関係を使う：",
    k6_both: "両方とも1 → よって",
    k7_pindahkan: "分子と分母の間で移動：",
    k9_gabungkan: "底をまとめる：",
    k9_langsung: "または結果を直接掛ける：",
    s9_formula_note: "指数が同じ場合のみ有効！",
    jika: "もし",
    maka_: "なら",
    hasil: "結果：",
    langkah: "ステップ",
  },
};

const SifatSifatOperasiPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;

  const allSections = [
    "intro",
    "k1","c1","k2","c2","k3","c3","k4","c4",
    "k5","c5","k6","c6","k7","c7","k8","c8","k9","c9",
    "rangkuman",
  ];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);
  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };
  const isOpen = (id: string) => expandedSections.includes(id);

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {isOpen(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const diffCfg = (level: "easy" | "med" | "hard") => ({
    easy: { badge: "bg-green-500/20 text-green-400", bar: "border-l-4 border-green-500", hdr: "text-green-400", bg: "bg-green-500/5 border border-green-500/20" },
    med:  { badge: "bg-yellow-500/20 text-yellow-400", bar: "border-l-4 border-yellow-500", hdr: "text-yellow-400", bg: "bg-yellow-500/5 border border-yellow-500/20" },
    hard: { badge: "bg-red-500/20 text-red-400", bar: "border-l-4 border-red-500", hdr: "text-red-400", bg: "bg-red-500/5 border border-red-500/20" },
  }[level]);

  const ExBlock = ({
    level, n, soal, solution,
  }: { level: "easy" | "med" | "hard"; n: number; soal: React.ReactNode; solution: React.ReactNode }) => {
    const dc = diffCfg(level);
    const diffLabel = level === "easy" ? t.diff_easy : level === "med" ? t.diff_med : t.diff_hard;
    return (
      <div className={`${dc.bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{diffLabel}</span>
          <span className="font-body font-semibold text-white">{t.example} {n}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white">{soal}</div>
        <div className={`${dc.bg} rounded-lg p-4`}>
          <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
          <div className="space-y-3 font-body text-sm text-white/80">{solution}</div>
        </div>
      </div>
    );
  };

  const Box = ({ color, children }: { color: string; children: React.ReactNode }) => {
    const map: Record<string, string> = {
      cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-200",
      green: "bg-green-500/10 border-green-500/30",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
      purple: "bg-purple-500/10 border-purple-500/30",
      orange: "bg-orange-500/10 border-orange-500/30",
      blue: "bg-blue-500/10 border-blue-500/30",
      pink: "bg-pink-500/10 border-pink-500/30",
      slate: "bg-slate-900/50 border-slate-700/30",
    };
    return <div className={`border rounded-lg p-4 ${map[color] || map.slate}`}>{children}</div>;
  };

  const Dark = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-900/50 rounded p-3">{children}</div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.pageSub}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_intro} />
            {isOpen("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro_p} <InlineMath math="2^{10} \times 2^{15}" />{t.intro_p2} <strong>{t.intro_p3}</strong>{t.intro_p4}
                </p>
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    {t.intro_box} <strong>{t.intro_box2}</strong> {t.intro_box3}
                  </p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>{t.tip_learn}</strong> {t.tip_learn2} <em>{t.tip_learn3}</em> {t.tip_learn4}</p>
                </Box>
              </div>
            )}
          </div>

          {/* ═══ SIFAT 1 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title={<span>📘 {t.sec_k1}: <InlineMath math="a^m \times a^n = a^{m+n}" /></span>} />
            {isOpen("k1") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="green">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k1_desc} <strong className="text-green-300">{t.k1_desc2}</strong> {t.k1_desc3} <strong className="text-green-300">{t.k1_desc4}</strong>{t.k1_desc5}
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <p className="font-body text-xs text-white/70 mb-2">{t.k1_expand}</p>
                  {/* KaTeX fix: removed \text{kali} — use language-specific text below formula */}
                  <BlockMath math="a^m \times a^n = \underbrace{(a \times \cdots \times a)}_{m} \times \underbrace{(a \times \cdots \times a)}_{n} = \underbrace{a \times \cdots \times a}_{m+n} = a^{m+n}" />
                  <p className="font-body text-xs text-white/60 mt-2">{t.example}: <InlineMath math="2^3 \times 2^4 = (2\cdot2\cdot2)\times(2\cdot2\cdot2\cdot2) = 2^7 = 128" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k1_note}</strong> {t.k1_note2} <strong>{t.k1_note3}</strong>! <InlineMath math="2^3 \times 3^2" /> {t.k1_note4}</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c1" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={<span>📝 {t.sec_c1}: <InlineMath math="a^m \times a^n" /></span>} />
            {isOpen("c1") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.sederhanakan} <InlineMath math="5^3 \times 5^6" /></>}
                  solution={<>
                    <p><strong>{t.basis_sama} (5)</strong>, {t.tiga_faktor.split(",")[0].replace(t.tiga_faktor.split(",")[0], t.diff_easy === "MUDAH" ? "jumlahkan pangkat:" : t.diff_easy === "EASY" ? "add exponents:" : "指数を足す：")}</p>
                    <Dark><BlockMath math="5^3 \times 5^6 = 5^{3+6} = 5^9" /></Dark>
                    <p>{t.nilai} <InlineMath math="5^9 = 1.953.125" /></p>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="x^4 \cdot x^3 \cdot x^2" /></>}
                  solution={<>
                    <p><strong>{t.tiga_faktor}</strong>{t.semua_dijumlah}</p>
                    <Dark><BlockMath math="x^4 \cdot x^3 \cdot x^2 = x^{4+3+2} = x^9" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.jika} <InlineMath math="2^a \times 2^3 = 2^7" />, {t.tentukan} <InlineMath math="a" />!</>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.terapkan} 1:</p>
                    <Dark><BlockMath math="2^a \times 2^3 = 2^{a+3}" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.samakan}</p>
                    <Dark><BlockMath math="2^{a+3} = 2^7 \implies a+3 = 7 \implies a = 4" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 2 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k2" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title={<span>📘 {t.sec_k2}: <InlineMath math="a^m \div a^n = a^{m-n}" /></span>} />
            {isOpen("k2") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm leading-relaxed">
                    {t.k2_desc} <strong className="text-cyan-300">{t.k2_desc2}</strong>{t.k2_desc3} <strong className="text-cyan-300">{t.k2_desc4}</strong>{t.k2_desc5} <InlineMath math="a \neq 0" />.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <p className="font-body text-xs text-white/70 mb-2">{t.k2_expand_note} <InlineMath math="m > n" />{t.k2_expand_note2} <InlineMath math="a" /> {t.k2_expand_note3}</p>
                  <BlockMath math="\frac{a^m}{a^n} = \frac{\overbrace{a \times \cdots \times a}^{m}}{\underbrace{a \times \cdots \times a}_{n}} = \underbrace{a \times \cdots \times a}_{m-n} = a^{m-n}" />
                  <p className="font-body text-xs text-white/60 mt-2">{t.example}: <InlineMath math="\frac{3^5}{3^2} = \frac{3\cdot3\cdot3\cdot\cancel{3}\cdot\cancel{3}}{\cancel{3}\cdot\cancel{3}} = 3^3 = 27" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k2_note}</strong> {t.k2_note2} <InlineMath math="m = n" />{t.k2_note3} <InlineMath math="a^0 = 1" />{t.k2_note4} <InlineMath math="m < n" />{t.k2_note5}</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c2" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400"
              title={<span>📝 {t.sec_c2}: <InlineMath math="a^m \div a^n" /></span>} />
            {isOpen("c2") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.sederhanakan} <InlineMath math="\dfrac{7^8}{7^5}" /></>}
                  solution={<>
                    <p>{t.kurangkan}</p>
                    <Dark><BlockMath math="\frac{7^8}{7^5} = 7^{8-5} = 7^3 = 343" /></Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="\dfrac{y^{10}}{y^4 \cdot y^2}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.penyebut_s1}</p>
                    <Dark><BlockMath math="y^4 \cdot y^2 = y^{4+2} = y^6" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.gunakan_s2}</p>
                    <Dark><BlockMath math="\frac{y^{10}}{y^6} = y^{10-6} = y^4" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.jika} <InlineMath math="\dfrac{3^n}{3^4} = 81" />, {t.tentukan} <InlineMath math="n" />!</>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.ubah} 81 {t.ke_basis}</p>
                    <Dark><BlockMath math="81 = 3^4" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.terapkan} 2:</p>
                    <Dark><BlockMath math="3^{n-4} = 3^4 \implies n-4 = 4 \implies n = 8" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 3 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400"
              title={<span>📘 {t.sec_k3}: <InlineMath math="(a^m)^n = a^{mn}" /></span>} />
            {isOpen("k3") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k3_desc} <strong className="text-purple-300">{t.k3_desc2}</strong>{t.k3_desc3} <strong className="text-purple-300">{t.k3_desc4}</strong>{t.k3_desc5} <em>{t.k3_desc6}</em>.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <p className="font-body text-xs text-white/70 mb-2">{t.k3_expand_note}</p>
                  {/* KaTeX fix: remove \text{kali} — show as subscript number only, with language text in JSX */}
                  <BlockMath math="(a^m)^n = \underbrace{a^m \times a^m \times \cdots \times a^m}_{n} = a^{\underbrace{m+m+\cdots+m}_{n}} = a^{mn}" />
                  <p className="font-body text-xs text-white/50 mt-1">↑ n {t.k3_ntimes}</p>
                  <p className="font-body text-xs text-white/60 mt-2">{t.example}: <InlineMath math="(2^3)^4 = 2^{3 \times 4} = 2^{12} = 4096" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k3_note}</strong> {t.k3_note2} <InlineMath math="(a^m)^n \neq a^{m^n}" />. {t.k3_note3} <InlineMath math="a^{m \times n}" />{t.k3_note4} <InlineMath math="a" /> {t.k3_note5} <InlineMath math="m^n" />.</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c3" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400"
              title={<span>📝 {t.sec_c3}: <InlineMath math="(a^m)^n" /></span>} />
            {isOpen("c3") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.sederhanakan} <InlineMath math="(3^4)^5" /></>}
                  solution={<>
                    <p>{t.kalikan}</p>
                    <Dark><BlockMath math="(3^4)^5 = 3^{4 \times 5} = 3^{20}" /></Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="((x^2)^3)^4" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.dari_dalam}</p>
                    <Dark>
                      <BlockMath math="(x^2)^3 = x^{2 \times 3} = x^6" />
                      <BlockMath math="(x^6)^4 = x^{6 \times 4} = x^{24}" />
                    </Dark>
                    <p>{t.atau_langsung} <InlineMath math="x^{2 \times 3 \times 4} = x^{24}" /></p>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.jika} <InlineMath math="(5^a)^3 = 5^{21}" />, {t.tentukan} <InlineMath math="a" />, {t.lalu_hitung} <InlineMath math="(5^a)^2" />!</>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.terapkan} 3:</p>
                    <Dark><BlockMath math="5^{3a} = 5^{21} \implies 3a = 21 \implies a = 7" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.hitung} <InlineMath math="(5^7)^2" />:</p>
                    <Dark><BlockMath math="(5^7)^2 = 5^{14}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 4 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title={<span>📘 {t.sec_k4}: <InlineMath math="(a \cdot b)^n = a^n \cdot b^n" /></span>} />
            {isOpen("k4") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k4_desc} <strong className="text-orange-300">{t.k4_desc2}</strong> {t.k4_desc3} <strong className="text-orange-300">{t.k4_desc4}</strong>{t.k4_desc5}
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <BlockMath math="(a \cdot b)^n = \underbrace{(ab)(ab)\cdots(ab)}_{n} = \underbrace{(a \cdot a \cdots a)}_{n} \cdot \underbrace{(b \cdot b \cdots b)}_{n} = a^n \cdot b^n" />
                  <p className="font-body text-xs text-white/60 mt-2">{t.example}: <InlineMath math="(2 \cdot 3)^4 = 2^4 \cdot 3^4 = 16 \cdot 81 = 1296 = 6^4" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k4_tip}</strong> {t.k4_tip2} <InlineMath math="(abc)^n = a^n b^n c^n" />{t.k4_tip3}</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400"
              title={<span>📝 {t.sec_c4}: <InlineMath math="(a \cdot b)^n" /></span>} />
            {isOpen("c4") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.hitung} <InlineMath math="(2 \cdot 5)^3" /></>}
                  solution={<>
                    <p>{t.distribusi}</p>
                    <Dark><BlockMath math="(2 \cdot 5)^3 = 2^3 \cdot 5^3 = 8 \cdot 125 = 1000" /></Dark>
                    <p>{t.verif} <InlineMath math="10^3 = 1000" /> ✓</p>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="(3x^2y)^4" /></>}
                  solution={<>
                    <p>{t.distribusi_faktor}</p>
                    <Dark><BlockMath math="(3x^2y)^4 = 3^4 \cdot (x^2)^4 \cdot y^4 = 81x^8y^4" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.sederhanakan} <InlineMath math="(2a^3b^2)^3 \times (3a^2b)^2" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.expand_dua}</p>
                    <Dark>
                      <BlockMath math="(2a^3b^2)^3 = 2^3 a^9 b^6 = 8a^9b^6" />
                      <BlockMath math="(3a^2b)^2 = 3^2 a^4 b^2 = 9a^4b^2" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong> {t.kalikan_s1}</p>
                    <Dark><BlockMath math="8a^9b^6 \times 9a^4b^2 = 72\,a^{9+4}b^{6+2} = 72a^{13}b^8" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 5 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k5" icon={<Target className="w-5 h-5" />} iconColor="text-pink-400"
              title={<span>📘 {t.sec_k5}: <InlineMath math="\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}" /></span>} />
            {isOpen("k5") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="pink">
                  <p className="font-body text-sm font-semibold text-pink-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k5_desc} <strong className="text-pink-300">{t.k5_desc2}</strong> {t.k5_desc3} <strong className="text-pink-300">{t.k5_desc4}</strong>{t.k5_desc5} <InlineMath math="b \neq 0" />.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <BlockMath math="\left(\frac{a}{b}\right)^n = \underbrace{\frac{a}{b} \cdot \frac{a}{b} \cdots \frac{a}{b}}_{n} = \frac{a \cdot a \cdots a}{b \cdot b \cdots b} = \frac{a^n}{b^n}" />
                  <p className="font-body text-xs text-white/60 mt-2">{t.example}: <InlineMath math="\left(\frac{3}{4}\right)^2 = \frac{3^2}{4^2} = \frac{9}{16}" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k5_tip}</strong> {t.k5_tip2}</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c5" icon={<Calculator className="w-5 h-5" />} iconColor="text-pink-400"
              title={<span>📝 {t.sec_c5}: <InlineMath math="(a/b)^n" /></span>} />
            {isOpen("c5") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.hitung} <InlineMath math="\left(\dfrac{2}{3}\right)^5" /></>}
                  solution={<>
                    <Dark><BlockMath math="\left(\frac{2}{3}\right)^5 = \frac{2^5}{3^5} = \frac{32}{243}" /></Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="\left(\dfrac{x^3}{y^2}\right)^4" /></>}
                  solution={<>
                    <Dark><BlockMath math="\left(\frac{x^3}{y^2}\right)^4 = \frac{(x^3)^4}{(y^2)^4} = \frac{x^{12}}{y^8}" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.sederhanakan} <InlineMath math="\left(\dfrac{2a^2}{3b}\right)^3 \div \left(\dfrac{4a}{9b^2}\right)" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.expand_perpangkatan}</p>
                    <Dark><BlockMath math="\left(\frac{2a^2}{3b}\right)^3 = \frac{8a^6}{27b^3}" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.bagi}</p>
                    <Dark><BlockMath math="\frac{8a^6}{27b^3} \div \frac{4a}{9b^2} = \frac{8a^6}{27b^3} \times \frac{9b^2}{4a} = \frac{72a^6b^2}{108ab^3} = \frac{2a^5}{3b}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 6 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k6" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400"
              title={<span>📘 {t.sec_k6}: <InlineMath math="a^0 = 1" /> <InlineMath math="(a \neq 0)" /></span>} />
            {isOpen("k6") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="blue">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k6_desc} <strong className="text-blue-300">{t.k6_desc2}</strong>{t.k6_desc3}
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <p className="font-body text-xs font-semibold text-blue-300 mt-2 mb-1">{t.k6_cara1}</p>
                  {/* KaTeX fix: removed \text{dan} — split into two BlockMath with language JSX connector */}
                  <BlockMath math="\frac{a^n}{a^n} = a^{n-n} = a^0" />
                  <p className="font-body text-xs text-white/60 my-1">{t.k6_proof_dan}</p>
                  <BlockMath math="\frac{a^n}{a^n} = 1 \implies a^0 = 1" />
                  <p className="font-body text-xs font-semibold text-blue-300 mt-3 mb-1">{t.k6_cara2}</p>
                  <div className="bg-slate-800/50 rounded p-3 text-xs font-body text-white/70 space-y-1">
                    <p><InlineMath math="2^4 = 16,\; 2^3 = 8,\; 2^2 = 4,\; 2^1 = 2,\; 2^0 = ?" /></p>
                    <p>{t.k6_seq_note} <InlineMath math="2^0 = 2 \div 2 = 1" /></p>
                  </div>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k6_note}</strong> <InlineMath math="0^0" /> {t.k6_note2} <InlineMath math="a^0 = 1" /> {t.k6_note3} <InlineMath math="a \neq 0" />.</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c6" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={<span>📝 {t.sec_c6}: <InlineMath math="a^0 = 1" /></span>} />
            {isOpen("c6") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.hitung} <InlineMath math="7^0 + (-5)^0 + 100^0" /></>}
                  solution={<>
                    <Dark><BlockMath math="7^0 = 1,\quad (-5)^0 = 1,\quad 100^0 = 1" /></Dark>
                    <Dark><BlockMath math="7^0 + (-5)^0 + 100^0 = 1+1+1 = 3" /></Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="\dfrac{(3x)^0 + (2y)^0}{(xy)^0}" /></>}
                  solution={<>
                    <p>{t.nilai} <InlineMath math="0" />: <InlineMath math="(3x)^0 = 1,\;(2y)^0 = 1,\;(xy)^0 = 1" /></p>
                    <Dark><BlockMath math="\frac{1+1}{1} = 2" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.jika} <InlineMath math="(2x - 6)^0 = 1" />, {t.nilai} <InlineMath math="x" />?</>}
                  solution={<>
                    <p><InlineMath math="a^0 = 1" /> {t.diff_easy === "MUDAH" ? "berlaku untuk semua" : t.diff_easy === "EASY" ? "holds for all" : "はすべての"} <InlineMath math="a \neq 0" />.</p>
                    <Dark><BlockMath math="2x - 6 \neq 0 \implies x \neq 3" /></Dark>
                    <p>{t.diff_easy === "MUDAH" ? "Maka x bisa semua nilai kecuali 3." : t.diff_easy === "EASY" ? "So x can be any value except 3." : "よって x は 3 以外の任意の値。"}</p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 7 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k7" icon={<Target className="w-5 h-5" />} iconColor="text-red-400"
              title={<span>📘 {t.sec_k7}: <InlineMath math="a^{-n} = \dfrac{1}{a^n}" /></span>} />
            {isOpen("k7") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k7_desc} <strong className="text-orange-300">{t.k7_desc2}</strong> {t.k7_desc3}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-3 text-center">
                    <BlockMath math="a^{-n} = \frac{1}{a^n}, \quad a \neq 0" />
                  </div>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <p className="font-body text-xs text-white/70 mb-1">{t.k7_expand}</p>
                  {/* KaTeX fix: removed \text{dan} — split formulas with JSX connector */}
                  <BlockMath math="\frac{a^0}{a^n} = a^{0-n} = a^{-n}" />
                  <p className="font-body text-xs text-white/60 my-1">{t.k6_proof_dan}</p>
                  <BlockMath math="\frac{a^0}{a^n} = \frac{1}{a^n} \implies a^{-n} = \frac{1}{a^n}" />
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.k7_note}</strong> {t.k7_note2} {t.k7_note3}{t.k7_note4}{" "}
                    <InlineMath math="3^{-2} = \frac{1}{9}" />
                  </p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c7" icon={<Calculator className="w-5 h-5" />} iconColor="text-red-400"
              title={<span>📝 {t.sec_c7}: <InlineMath math="a^{-n}" /></span>} />
            {isOpen("c7") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.hitung} <InlineMath math="2^{-4} + 5^{-1}" /></>}
                  solution={<>
                    <Dark>
                      <BlockMath math="2^{-4} = \frac{1}{16}, \quad 5^{-1} = \frac{1}{5}" />
                      <BlockMath math="\frac{1}{16} + \frac{1}{5} = \frac{5 + 16}{80} = \frac{21}{80}" />
                    </Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="\dfrac{x^{-3} \cdot y^2}{x^2 \cdot y^{-1}}" /></>}
                  solution={<>
                    <p>{t.k7_pindahkan}</p>
                    <Dark>
                      <BlockMath math="\frac{x^{-3} \cdot y^2}{x^2 \cdot y^{-1}} = \frac{y^2 \cdot y}{x^2 \cdot x^3} = \frac{y^3}{x^5}" />
                    </Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.sederhanakan} <InlineMath math="\left(\dfrac{2^{-2} \cdot 3^3}{6^{-1}}\right)^2" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong></p>
                    <Dark>
                      <BlockMath math="2^{-2} = \frac{1}{4},\quad 3^3 = 27,\quad 6^{-1} = \frac{1}{6}" />
                      <BlockMath math="\frac{\frac{1}{4} \cdot 27}{\frac{1}{6}} = \frac{27}{4} \times 6 = \frac{162}{4} = \frac{81}{2}" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong></p>
                    <Dark><BlockMath math="\left(\frac{81}{2}\right)^2 = \frac{6561}{4}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 8 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k8" icon={<Target className="w-5 h-5" />} iconColor="text-emerald-400"
              title={<span>📘 {t.sec_k8}: <InlineMath math="a^{\frac{m}{n}} = \sqrt[n]{a^m}" /></span>} />
            {isOpen("k8") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="green">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k8_desc} <strong className="text-green-300">{t.k8_desc2}</strong>{t.k8_desc3}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-3 text-center space-y-2">
                    <BlockMath math="a^{\frac{1}{n}} = \sqrt[n]{a}" />
                    <BlockMath math="a^{\frac{m}{n}} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m" />
                  </div>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.asal_usul}</p>
                  <p className="font-body text-xs text-white/70 mb-2">{t.akar_ke_pangkat}</p>
                  <div className="text-xs font-body text-white/70 space-y-1">
                    <p><InlineMath math="25^{1/2} = \sqrt{25} = 5" /></p>
                    <p><InlineMath math="8^{2/3} = \sqrt[3]{8^2} = \sqrt[3]{64} = 4" /></p>
                  </div>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k8_note}</strong> {t.k8_note2}</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c8" icon={<Calculator className="w-5 h-5" />} iconColor="text-emerald-400"
              title={<span>📝 {t.sec_c8}: <InlineMath math="a^{m/n}" /></span>} />
            {isOpen("c8") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.hitung} <InlineMath math="64^{1/2}" /> {t.dan} <InlineMath math="27^{1/3}" /></>}
                  solution={<>
                    {/* KaTeX fix: removed \text{(karena...)} — use JSX annotation */}
                    <Dark>
                      <BlockMath math="64^{1/2} = \sqrt{64} = 8" />
                      <p className="text-xs text-cyan-300 mt-1">↑ {t.karena} <InlineMath math="8^2 = 64" /></p>
                      <BlockMath math="27^{1/3} = \sqrt[3]{27} = 3" />
                      <p className="text-xs text-cyan-300 mt-1">↑ {t.karena} <InlineMath math="3^3 = 27" /></p>
                    </Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.hitung} <InlineMath math="32^{3/5}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.ubah_k_akar}</p>
                    <Dark><BlockMath math="32^{3/5} = \sqrt[5]{32^3}" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.cari_dulu} <InlineMath math="\sqrt[5]{32}" /> {t.terlebih}</p>
                    <Dark><BlockMath math="\sqrt[5]{32} = 2" /></Dark>
                    <p className="text-xs text-white/60">{t.karena} <InlineMath math="2^5 = 32" /></p>
                    <p><strong>{t.step} 3:</strong> {t.pangkat3}</p>
                    <Dark><BlockMath math="32^{3/5} = \left(\sqrt[5]{32}\right)^3 = 2^3 = 8" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.sederhanakan} <InlineMath math="\dfrac{27^{2/3} \times 9^{1/2}}{3^2}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.ubah_basis}</p>
                    <Dark>
                      <BlockMath math="27 = 3^3 \Rightarrow 27^{2/3} = (3^3)^{2/3} = 3^2 = 9" />
                      <BlockMath math="9 = 3^2 \Rightarrow 9^{1/2} = (3^2)^{1/2} = 3^1 = 3" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong> {t.substitusi}</p>
                    <Dark><BlockMath math="\frac{9 \times 3}{3^2} = \frac{27}{9} = 3" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══ SIFAT 9 ═══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k9" icon={<Target className="w-5 h-5" />} iconColor="text-violet-400"
              title={<span>📘 {t.sec_k9}: <InlineMath math="a^n \cdot b^n = (a \cdot b)^n" /></span>} />
            {isOpen("k9") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k9_desc} <strong className="text-purple-300">{t.k9_desc2}</strong>{t.k9_desc3} <strong className="text-purple-300">{t.k9_desc4}</strong>{t.k9_desc5}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-3 text-center">
                    <BlockMath math="a^n \cdot b^n = (a \cdot b)^n" />
                  </div>
                  <p className="font-body text-xs text-white/50 mt-1">{t.s9_formula_note}</p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.k9_note}</strong> {t.k9_note2}</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c9" icon={<Calculator className="w-5 h-5" />} iconColor="text-violet-400"
              title={<span>📝 {t.sec_c9}: <InlineMath math="a^n \cdot b^n" /></span>} />
            {isOpen("c9") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.sederhanakan} <InlineMath math="3^4 \cdot 2^4" /></>}
                  solution={<>
                    <p>{t.k9_gabungkan}</p>
                    <Dark><BlockMath math="3^4 \cdot 2^4 = (3 \cdot 2)^4 = 6^4 = 1296" /></Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="4^3 \cdot 25^3" /></>}
                  solution={<>
                    <p>{t.k9_gabungkan}</p>
                    <Dark><BlockMath math="4^3 \cdot 25^3 = (4 \cdot 25)^3 = 100^3 = 1.000.000" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.sederhanakan} <InlineMath math="8^5 \cdot \left(\dfrac{1}{2}\right)^5" /></>}
                  solution={<>
                    <p>{t.k9_gabungkan}</p>
                    <Dark>
                      <BlockMath math="8^5 \cdot \left(\frac{1}{2}\right)^5 = \left(8 \cdot \frac{1}{2}\right)^5 = 4^5 = 1024" />
                    </Dark>
                    <p>{t.k9_langsung}</p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary"
              title={t.sec_rangkuman} />
            {isOpen("rangkuman") && (
              <div className="px-5 pb-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-white/50 pr-2">{t.col_no}</th>
                        <th className="text-left py-2 text-cyan-300 pr-4">{t.col_nama}</th>
                        <th className="text-left py-2 text-green-300">{t.col_rumus}</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      {[
                        { nama: t.r1_nama, rumus: "a^m \\times a^n = a^{m+n}" },
                        { nama: t.r2_nama, rumus: "a^m \\div a^n = a^{m-n}" },
                        { nama: t.r3_nama, rumus: "(a^m)^n = a^{mn}" },
                        { nama: t.r4_nama, rumus: "(ab)^n = a^n b^n" },
                        { nama: t.r5_nama, rumus: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}" },
                        { nama: t.r6_nama, rumus: "a^0 = 1" },
                        { nama: t.r7_nama, rumus: "a^{-n} = \\frac{1}{a^n}" },
                        { nama: t.r8_nama, rumus: "a^{m/n} = \\sqrt[n]{a^m}" },
                        { nama: t.r9_nama, rumus: "a^n \\cdot b^n = (ab)^n" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-2 pr-2 text-white/40">{i + 1}</td>
                          <td className="py-2 pr-4">{row.nama}</td>
                          <td className="py-1"><InlineMath math={row.rumus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SifatSifatOperasiPage;
