import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import WarungAritmetika from "@/components/WarungAritmetika";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, TrendingUp, TrendingDown, Minus, Star, AlertCircle,
  CheckCircle, XCircle, RefreshCw, ShoppingCart, Percent,
  Search, ArrowRight
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

type Lang = "id" | "en" | "ja";

const makeFmt = (lang: Lang) => (n: number) =>
  lang === "id"
    ? "Rp" + Math.round(n).toLocaleString("id-ID")
    : "$" + Math.round(n).toLocaleString("en-US");

const parse = (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0;

const translations = {
  id: {
    title: "JUAL BELI, UNTUNG DAN RUGI",
    subtitle: "Kelas 7 — Aritmetika Sosial — Materi Matematika",
    back: "← Kembali ke Aritmetika Sosial",
    secIntroTitle: "Kenapa Harus Paham Untung & Rugi?",
    secIntroBody: "Bayangkan kamu membeli sepasang sepatu seharga Rp150.000, lalu menjualnya ke temanmu Rp180.000. Apakah kamu untung atau rugi? Dari warung kelontong, toko online, hingga perusahaan besar — semua transaksi jual beli selalu berpusat pada dua angka kunci:",
    hbLabel: "Harga Beli (HB) = Modal",
    hbDesc: "Uang yang kamu keluarkan untuk mendapatkan atau membuat suatu barang. Disebut juga modal. Ini adalah titik acuan dalam semua perhitungan.",
    hjLabel: "Harga Jual (HJ)",
    hjDesc: "Uang yang kamu terima saat menjual barang kepada pembeli. Bisa lebih tinggi, sama, atau lebih rendah dari harga beli.",
    kunciUtama: "🔑 Kunci Utama:",
    kunciDesc: "Selisih antara HJ dan HB itulah yang menentukan apakah transaksi menghasilkan untung, rugi, atau impas.",
    untungCond: "HJ > HB → UNTUNG",
    rugiCond: "HJ < HB → RUGI",
    impasCond: "HJ = HB → IMPAS",
    secKonsepTitle: "Rumus Untung & Rugi",
    untungTitle: "Untung (Laba)",
    untungWhen: "Untung terjadi ketika harga jual lebih tinggi dari harga beli.",
    untungHJ: "HJ = Harga Jual (uang yang masuk)",
    untungHB: "HB = Harga Beli / Modal (uang yang keluar)",
    untungNote: "Rumus ini hanya berlaku ketika HJ > HB. Hasilnya selalu positif.",
    rugiTitle: "Rugi",
    rugiWhen: "Rugi terjadi ketika harga jual lebih rendah dari harga beli.",
    rugiHB: "HB = Harga Beli / Modal (uang yang keluar)",
    rugiHJ: "HJ = Harga Jual (uang yang masuk)",
    rugiNote: "Posisi HB dan HJ dibalik dibanding rumus untung! Hasilnya selalu positif karena HB > HJ saat rugi.",
    cariHJTitle: "Mencari Harga Jual dari Persentase",
    targetUntung: "Jika target untung U%:",
    batasRugi: "Jika batas rugi R%:",
    warningPersen: "Perhatian: Persentase untung dan rugi selalu dihitung terhadap harga beli (modal), bukan harga jual. Ini adalah kesalahan paling umum dalam soal aritmetika sosial!",
    secImpasTitle: "Kondisi Impas (Break Even)",
    impasDesc: "Impas (break even) adalah kondisi di mana harga jual sama persis dengan harga beli. Penjual tidak untung, tapi juga tidak rugi.",
    impasUntung: "Untung",
    impasImpas: "Impas",
    impasRugi: "Rugi",
    impasContoh: "Contoh situasi impas: Sebuah toko membeli buku seharga Rp25.000 per buah. Agar tidak rugi, harga jual minimum yang boleh dipatok adalah Rp25.000. Di titik ini penjual impas — belum ada keuntungan, tapi modal sudah kembali.",
    secPersenTitle: "Persentase Untung/Rugi & Mencari Harga Beli",
    persenIntro: "Nilai untung/rugi dalam rupiah saja tidak selalu cukup. Persentase memberikan gambaran seberapa besar untung atau rugi relatif terhadap modal.",
    pctUntungTitle: "Persentase Untung",
    pctUntungEx: "Contoh: untung Rp20.000 dari modal Rp100.000 →",
    pctRugiTitle: "Persentase Rugi",
    pctRugiEx: "Rugi dihitung dari HB − HJ, lalu dibagi modal × 100%. Hasilnya selalu positif.",
    cariHBTitle: "Mencari Harga Beli dari Harga Jual & Persentase",
    jikaUntung: "Jika diketahui untung U%:",
    jikaRugi: "Jika diketahui rugi R%:",
    secKalkTitle: "Kalkulator Jual Beli Interaktif",
    kalkIntro: "Gunakan kalkulator ini untuk memverifikasi perhitunganmu. Pilih mode sesuai yang ingin dihitung, lalu masukkan nilai yang diketahui — hasilnya langsung muncul secara otomatis.",
    modeHitung: "Hitung Untung/Rugi",
    modeCariHJ: "Cari Harga Jual",
    modeCariHB: "Cari Harga Beli",
    modeCariPersen: "Cari % Untung/Rugi",
    hbInput: "Harga Beli / Modal",
    hjInput: "Harga Jual",
    persenInput: "Persentase (%)",
    hbInputPH: "Contoh: 200000",
    hjInputPH: "Contoh: 250000",
    pctPH: "Contoh: 25",
    targetUntungBtn: "📈 Target Untung",
    batasRugiBtn: "📉 Batas Rugi",
    adaUntungBtn: "📈 Ada Untung",
    adaRugiBtn: "📉 Ada Rugi",
    modeDeskHitung: "Masukkan harga beli (modal) dan harga jual → kalkulator akan otomatis menentukan untung, rugi, atau impas beserta persentasenya.",
    modeDeskCariHJ: "Masukkan modal (harga beli) dan target persentase untung atau rugi → hitung harga jual yang tepat.",
    modeDeskCariHB: "Ketahui harga jual dan persentase untung/rugi → temukan modal awal (harga beli) yang semula dikeluarkan.",
    modeDeskCariPersen: "Masukkan harga beli dan harga jual → kalkulator menghitung persentase untung atau rugi terhadap modal.",
    hbLabel2: "Harga Beli",
    hjLabel2: "Harga Jual",
    modalLabel: "Modal (HB)",
    impasPct: "⚖️ IMPAS — Persentase = 0%",
    impasMsg: "Harga jual sama dengan modal. Tidak untung, tidak rugi.",
    caraMenghitung: "Cara menghitung:",
    langkahPenyelesaian: "Langkah penyelesaian:",
    pctUntungLabel: "% Untung",
    pctRugiLabel: "% Rugi",
    pctImpasLabel: "% Impas",
    rumusRingkasan: "Ringkasan Semua Rumus",
    secTipsTitle: "Tips & Strategi Mengerjakan Soal",
    tips: [
      { n: "01", judul: "Tentukan dulu: Untung atau Rugi?", isi: "Sebelum menghitung, bandingkan HJ dan HB. Jika HJ > HB → pakai rumus untung. Jika HJ < HB → pakai rumus rugi. Jangan sampai terbalik!" },
      { n: "02", judul: "Persen selalu terhadap modal (HB)", isi: "Ingat: %U dan %R dibagi oleh HB, bukan HJ. Kalau salah pembagi, hasil persennya akan salah." },
      { n: "03", judul: "Cara cepat mencari HJ dari persentase", isi: "Gunakan faktor pengali: untung 20% → kalikan modal dengan 1,2. Rugi 15% → kalikan modal dengan 0,85." },
      { n: "04", judul: "Cek ulang dengan logika sederhana", isi: "Setelah mendapat jawaban, tanyakan: 'Masuk akal tidak?' Jika modal Rp100.000 dan dijual untung 20%, HJ harus lebih dari Rp100.000." },
    ],
    secKuisTitle: "Mini Kuis — Uji Pemahamanmu!",
    soalLabel: "Soal",
    quizBenar: "✓ Benar!",
    quizSalah: "✗ Belum tepat.",
    sebelumnya: "← Sebelumnya",
    lanjut: "Lanjut →",
    lihatHasil: "Lihat Hasil",
    hasilKuis: "Hasil Kuis",
    benar: "Benar",
    cobaLagi: "Coba Lagi",
    quizPesan: ["Luar biasa! Kamu sangat memahami materi jual beli.", "Bagus! Coba pelajari lagi bagian yang belum tepat.", "Tetap semangat! Baca kembali materinya dan coba lagi."],
    quiz: [
      { soal: "Seorang pedagang membeli buku seharga Rp80.000 lalu menjualnya Rp100.000. Berapa persen keuntungannya?", pilihan: ["20%","25%","30%","35%"], benar: 1, penjelasan: "Untung = Rp100.000 − Rp80.000 = Rp20.000. % Untung = Rp20.000 ÷ Rp80.000 × 100% = 25%" },
      { soal: "Modal Rp500.000, ingin untung 30%. Berapa harga jualnya?", pilihan: ["Rp550.000","Rp600.000","Rp650.000","Rp700.000"], benar: 2, penjelasan: "HJ = (100 + 30)% × Rp500.000 = 1,3 × Rp500.000 = Rp650.000" },
      { soal: "Sebuah tas dijual Rp340.000 dengan rugi 15%. Berapa harga belinya?", pilihan: ["Rp380.000","Rp390.000","Rp400.000","Rp420.000"], benar: 2, penjelasan: "HB = Rp340.000 ÷ (100−15)% = Rp340.000 ÷ 0,85 = Rp400.000" },
      { soal: "HB Rp200.000, HJ Rp170.000. Apa yang terjadi dan berapa persentasenya?", pilihan: ["Untung 15%","Rugi 15%","Untung 17%","Rugi 17%"], benar: 1, penjelasan: "HJ < HB → RUGI. Rugi = Rp200.000 − Rp170.000 = Rp30.000. % Rugi = Rp30.000 ÷ Rp200.000 × 100% = 15%" },
      { soal: "Pedagang menjual sepeda dengan untung 20% dan harga jualnya Rp480.000. Berapa harga belinya?", pilihan: ["Rp380.000","Rp390.000","Rp400.000","Rp420.000"], benar: 2, penjelasan: "HB = 100/(100+20) × Rp480.000 = 100/120 × Rp480.000 = Rp400.000" },
    ],
    secContohTitle: "Contoh Soal dan Pembahasan",
    badgeMudah: "MUDAH", badgeSedang: "SEDANG", badgeSulit: "SULIT", badgeBonus: "BONUS",
    pembahasan: "PEMBAHASAN:",
    diketahui: "✦ Diketahui:",
    langkah1: "Langkah 1 — Cari Harga Beli:",
    langkah2: "Langkah 2 — Cari Rugi dalam Rupiah:",
    verifikasi: "✦ Verifikasi:",
    c1Title: "Contoh 1 – Menghitung Untung & Persentasenya",
    c1Q: "Seorang pedagang membeli 1 karung beras seharga Rp180.000 lalu menjualnya seharga Rp225.000. Hitunglah besar untung dan persentase keuntungannya!",
    c1Known: "HB = Rp180.000, HJ = Rp225.000",
    c1Cond: "Karena HJ > HB, maka pedagang UNTUNG",
    c1Result: "✅ Pedagang untung Rp45.000 atau 25% dari modal.",
    c2Title: "Contoh 2 – Menentukan Harga Jual dari Persentase Untung",
    c2Q: "Seorang pedagang buah membeli durian seharga Rp240.000 per buah. Ia ingin mendapatkan untung 35% dari modal. Berapa harga jual yang harus ia patok?",
    c2Known: "HB = Rp240.000, untung U = 35%",
    c2Result: "✅ Harga jual yang harus dipatok = Rp324.000",
    c3Title: "Contoh 3 – Mencari Harga Beli dari Harga Jual & Persentase Rugi",
    c3Q: "Sebuah sepeda dijual seharga Rp680.000 dan penjual mengalami kerugian sebesar 15%. Berapakah harga beli sepeda tersebut? Berapa pula rugi dalam rupiah?",
    c3Known: "HJ = Rp680.000, rugi R = 15%",
    c3Result: "✅ Harga beli sepeda = Rp800.000. Kerugian = Rp120.000.",
    c4Title: "Contoh 4 – Kondisi Impas (Break Even)",
    c4Q: "Seorang pedagang membeli 10 buah mangga seharga Rp50.000. Ia menjual 7 buah seharga Rp6.000 per buah dan sisanya busuk. Apakah pedagang untung, rugi, atau impas?",
    c4Known1: "✦ HB (modal) = Rp50.000",
    c4Known2: "✦ HJ (total hasil jual) = 7 × Rp6.000 = Rp42.000",
    c4Note: "Agar impas, pedagang perlu menjual total Rp50.000 → minimal ⌈50.000 ÷ 6.000⌉ = 9 buah mangga.",
    c4Result: "✅ Pedagang rugi Rp8.000. Agar impas, ia harus jual minimal 9 buah.",
    impasBarLabel: "⚖️ IMPAS — Tidak untung, tidak rugi",
    untungBarPrefix: "📈 UNTUNG",
    rugiBarPrefix: "📉 RUGI",
  },
  en: {
    title: "BUYING & SELLING — PROFIT AND LOSS",
    subtitle: "Grade 7 — Social Arithmetic — Mathematics",
    back: "← Back to Social Arithmetic",
    secIntroTitle: "Why Understand Profit & Loss?",
    secIntroBody: "Imagine you buy a pair of shoes for $150 and sell them to your friend for $180. Did you make a profit or a loss? From small shops, online stores, to large corporations — every trade always revolves around two key numbers:",
    hbLabel: "Cost Price (CP) = Capital",
    hbDesc: "The money you spend to obtain or produce an item. Also called capital. This is the reference point for all calculations.",
    hjLabel: "Selling Price (SP)",
    hjDesc: "The money you receive when you sell an item to a buyer. Can be higher, equal, or lower than the cost price.",
    kunciUtama: "🔑 Key Principle:",
    kunciDesc: "The difference between SP and CP determines whether a transaction results in profit, loss, or break-even.",
    untungCond: "SP > CP → PROFIT",
    rugiCond: "SP < CP → LOSS",
    impasCond: "SP = CP → BREAK EVEN",
    secKonsepTitle: "Profit & Loss Formulas",
    untungTitle: "Profit",
    untungWhen: "Profit occurs when the selling price is higher than the cost price.",
    untungHJ: "SP = Selling Price (money received)",
    untungHB: "CP = Cost Price / Capital (money spent)",
    untungNote: "This formula only applies when SP > CP. The result is always positive.",
    rugiTitle: "Loss",
    rugiWhen: "Loss occurs when the selling price is lower than the cost price.",
    rugiHB: "CP = Cost Price / Capital (money spent)",
    rugiHJ: "SP = Selling Price (money received)",
    rugiNote: "CP and SP are swapped compared to the profit formula! The result is always positive because CP > SP when there is a loss.",
    cariHJTitle: "Finding the Selling Price from a Percentage",
    targetUntung: "If target profit is U%:",
    batasRugi: "If maximum loss is R%:",
    warningPersen: "Warning: Profit and loss percentages are always calculated against the cost price (capital), not the selling price. This is the most common mistake in social arithmetic problems!",
    secImpasTitle: "Break-Even Condition",
    impasDesc: "Break-even is the condition where the selling price equals the cost price exactly. The seller neither profits nor loses.",
    impasUntung: "Profit",
    impasImpas: "Break Even",
    impasRugi: "Loss",
    impasContoh: "Break-even example: A store buys a book for $25. To avoid a loss, the minimum selling price is $25. At this point the seller breaks even — no profit yet, but capital is recovered.",
    secPersenTitle: "Profit/Loss % & Finding the Cost Price",
    persenIntro: "The monetary value of profit/loss alone is not always enough. Percentages show how large the profit or loss is relative to the capital.",
    pctUntungTitle: "Profit Percentage",
    pctUntungEx: "Example: profit $20 from capital $100 →",
    pctRugiTitle: "Loss Percentage",
    pctRugiEx: "Loss is calculated from CP − SP, then divided by capital × 100%. Result is always positive.",
    cariHBTitle: "Finding the Cost Price from Selling Price & Percentage",
    jikaUntung: "If profit U% is known:",
    jikaRugi: "If loss R% is known:",
    secKalkTitle: "Interactive Trading Calculator",
    kalkIntro: "Use this calculator to verify your calculations. Choose a mode, enter the known values — results appear instantly.",
    modeHitung: "Calc Profit/Loss",
    modeCariHJ: "Find Selling Price",
    modeCariHB: "Find Cost Price",
    modeCariPersen: "Find % Profit/Loss",
    hbInput: "Cost Price / Capital",
    hjInput: "Selling Price",
    persenInput: "Percentage (%)",
    hbInputPH: "e.g. 200",
    hjInputPH: "e.g. 250",
    pctPH: "e.g. 25",
    targetUntungBtn: "📈 Target Profit",
    batasRugiBtn: "📉 Max Loss",
    adaUntungBtn: "📈 Has Profit",
    adaRugiBtn: "📉 Has Loss",
    modeDeskHitung: "Enter cost price (capital) and selling price → the calculator will automatically determine profit, loss, or break-even with the percentage.",
    modeDeskCariHJ: "Enter capital and target profit/loss percentage → calculate the correct selling price.",
    modeDeskCariHB: "Know the selling price and profit/loss percentage → find the original capital (cost price).",
    modeDeskCariPersen: "Enter cost price and selling price → the calculator computes the profit or loss percentage against capital.",
    hbLabel2: "Cost Price",
    hjLabel2: "Selling Price",
    modalLabel: "Capital (CP)",
    impasPct: "⚖️ BREAK EVEN — Percentage = 0%",
    impasMsg: "Selling price equals capital. No profit, no loss.",
    caraMenghitung: "Calculation method:",
    langkahPenyelesaian: "Solution steps:",
    pctUntungLabel: "% Profit",
    pctRugiLabel: "% Loss",
    pctImpasLabel: "% Break Even",
    rumusRingkasan: "All Formulas Summary",
    secTipsTitle: "Tips & Strategies for Solving Problems",
    tips: [
      { n: "01", judul: "Determine first: Profit or Loss?", isi: "Before calculating, compare SP and CP. If SP > CP → use profit formula. If SP < CP → use loss formula. Don't mix them up!" },
      { n: "02", judul: "Percentage is always against capital (CP)", isi: "Remember: %P and %L are divided by CP, not SP. Wrong divisor = wrong percentage." },
      { n: "03", judul: "Quick way to find SP from percentage", isi: "Use a multiplier: 20% profit → multiply capital by 1.2. 15% loss → multiply capital by 0.85." },
      { n: "04", judul: "Double-check with simple logic", isi: "After getting the answer, ask: 'Does it make sense?' If capital is $100 and sold at 20% profit, SP must be more than $100." },
    ],
    secKuisTitle: "Mini Quiz — Test Your Understanding!",
    soalLabel: "Question",
    quizBenar: "✓ Correct!",
    quizSalah: "✗ Not quite right.",
    sebelumnya: "← Previous",
    lanjut: "Next →",
    lihatHasil: "See Results",
    hasilKuis: "Quiz Results",
    benar: "Correct",
    cobaLagi: "Try Again",
    quizPesan: ["Excellent! You understand profit & loss very well.", "Good! Review the parts you got wrong.", "Keep going! Re-read the material and try again."],
    quiz: [
      { soal: "A merchant buys a book for $80 and sells it for $100. What is the profit percentage?", pilihan: ["20%","25%","30%","35%"], benar: 1, penjelasan: "Profit = $100 − $80 = $20. % Profit = $20 ÷ $80 × 100% = 25%" },
      { soal: "Capital $500, target 30% profit. What is the selling price?", pilihan: ["$550","$600","$650","$700"], benar: 2, penjelasan: "SP = (100 + 30)% × $500 = 1.3 × $500 = $650" },
      { soal: "A bag is sold for $340 at a 15% loss. What was the cost price?", pilihan: ["$380","$390","$400","$420"], benar: 2, penjelasan: "CP = $340 ÷ (100−15)% = $340 ÷ 0.85 = $400" },
      { soal: "CP $200, SP $170. What happened and what is the percentage?", pilihan: ["15% Profit","15% Loss","17% Profit","17% Loss"], benar: 1, penjelasan: "SP < CP → LOSS. Loss = $200 − $170 = $30. % Loss = $30 ÷ $200 × 100% = 15%" },
      { soal: "A merchant sells a bicycle at 20% profit; the selling price is $480. What was the cost price?", pilihan: ["$380","$390","$400","$420"], benar: 2, penjelasan: "CP = 100/(100+20) × $480 = 100/120 × $480 = $400" },
    ],
    secContohTitle: "Worked Examples",
    badgeMudah: "EASY", badgeSedang: "MEDIUM", badgeSulit: "HARD", badgeBonus: "BONUS",
    pembahasan: "SOLUTION:",
    diketahui: "✦ Given:",
    langkah1: "Step 1 — Find Cost Price:",
    langkah2: "Step 2 — Find Loss in dollars:",
    verifikasi: "✦ Verification:",
    c1Title: "Example 1 – Calculating Profit & Percentage",
    c1Q: "A merchant buys a sack of rice for $180 and sells it for $225. Calculate the profit and profit percentage!",
    c1Known: "CP = $180, SP = $225",
    c1Cond: "Since SP > CP, the merchant made a PROFIT",
    c1Result: "✅ Merchant profits $45, or 25% of capital.",
    c2Title: "Example 2 – Finding the Selling Price from Profit Percentage",
    c2Q: "A fruit merchant buys a durian for $240. He wants a 35% profit from his capital. What selling price should he set?",
    c2Known: "CP = $240, profit U = 35%",
    c2Result: "✅ Selling price to set = $324",
    c3Title: "Example 3 – Finding Cost Price from Selling Price & Loss Percentage",
    c3Q: "A bicycle is sold for $680 and the seller suffers a 15% loss. What was the cost price? What is the loss in dollars?",
    c3Known: "SP = $680, loss R = 15%",
    c3Result: "✅ Cost price of bicycle = $800. Loss = $120.",
    c4Title: "Example 4 – Break-Even Condition",
    c4Q: "A merchant buys 10 mangoes for $50. He sells 7 for $6 each and the rest go bad. Did the merchant profit, lose, or break even?",
    c4Known1: "✦ CP (capital) = $50",
    c4Known2: "✦ SP (total revenue) = 7 × $6 = $42",
    c4Note: "To break even, the merchant needs to earn $50 total → must sell at least ⌈50 ÷ 6⌉ = 9 mangoes.",
    c4Result: "✅ Merchant lost $8. To break even, he must sell at least 9 mangoes.",
    impasBarLabel: "⚖️ BREAK EVEN — No profit, no loss",
    untungBarPrefix: "📈 PROFIT",
    rugiBarPrefix: "📉 LOSS",
  },
  ja: {
    title: "売買・利益と損失",
    subtitle: "中学1年 — 社会算数 — 数学",
    back: "← 社会算数に戻る",
    secIntroTitle: "なぜ利益と損失を理解する必要があるのか？",
    secIntroBody: "靴を$150で買い、友達に$180で売ったとします。利益が出たでしょうか、損失でしょうか？小さな商店から大企業まで、あらゆる売買取引は常に2つの重要な数字を中心に回っています：",
    hbLabel: "仕入れ価格（CP）= 元金",
    hbDesc: "商品を手に入れるまたは製造するために支払う金額。元金とも呼ばれます。すべての計算の基準点です。",
    hjLabel: "売価（SP）",
    hjDesc: "商品を買い手に売ったときに受け取る金額。仕入れ価格より高い、同じ、または低い場合があります。",
    kunciUtama: "🔑 重要なポイント：",
    kunciDesc: "SPとCPの差が、取引が利益・損失・損益分岐のどれになるかを決めます。",
    untungCond: "SP > CP → 利益",
    rugiCond: "SP < CP → 損失",
    impasCond: "SP = CP → 損益分岐",
    secKonsepTitle: "利益と損失の公式",
    untungTitle: "利益",
    untungWhen: "売価が仕入れ価格より高いとき、利益が発生します。",
    untungHJ: "SP = 売価（受け取る金額）",
    untungHB: "CP = 仕入れ価格 / 元金（支払う金額）",
    untungNote: "この公式はSP > CPのときのみ適用されます。結果は常に正の値です。",
    rugiTitle: "損失",
    rugiWhen: "売価が仕入れ価格より低いとき、損失が発生します。",
    rugiHB: "CP = 仕入れ価格 / 元金（支払う金額）",
    rugiHJ: "SP = 売価（受け取る金額）",
    rugiNote: "利益の公式とCPとSPの位置が逆になります！CP > SPなので結果は常に正の値です。",
    cariHJTitle: "割合から売価を求める",
    targetUntung: "目標利益がU%のとき：",
    batasRugi: "最大損失がR%のとき：",
    warningPersen: "注意：利益・損失の割合は常に仕入れ価格（元金）に対して計算します。売価に対してではありません。これが社会算数の問題で最もよくある間違いです！",
    secImpasTitle: "損益分岐点",
    impasDesc: "損益分岐（ブレークイーブン）は売価が仕入れ価格と全く同じ状態です。売り手は利益も損失もありません。",
    impasUntung: "利益",
    impasImpas: "損益分岐",
    impasRugi: "損失",
    impasContoh: "損益分岐の例：本を$25で購入した場合、損失を出さないための最低売価は$25です。この時点で売り手は損益分岐 — 利益はまだないが、元金は回収できます。",
    secPersenTitle: "利益・損失の割合と仕入れ価格の計算",
    persenIntro: "金額だけでは十分でない場合があります。割合は元金に対する利益や損失の大きさを示します。",
    pctUntungTitle: "利益率",
    pctUntungEx: "例：元金$100から$20の利益 →",
    pctRugiTitle: "損失率",
    pctRugiEx: "損失はCP − SPから計算し、元金で割って×100%します。結果は常に正の値です。",
    cariHBTitle: "売価と割合から仕入れ価格を求める",
    jikaUntung: "利益U%がわかっている場合：",
    jikaRugi: "損失R%がわかっている場合：",
    secKalkTitle: "売買インタラクティブ電卓",
    kalkIntro: "この電卓で計算を確認しましょう。モードを選び、既知の値を入力すると結果が自動で表示されます。",
    modeHitung: "利益・損失を計算",
    modeCariHJ: "売価を求める",
    modeCariHB: "仕入れ価格を求める",
    modeCariPersen: "利益・損失%を求める",
    hbInput: "仕入れ価格 / 元金",
    hjInput: "売価",
    persenInput: "割合 (%)",
    hbInputPH: "例：200",
    hjInputPH: "例：250",
    pctPH: "例：25",
    targetUntungBtn: "📈 目標利益",
    batasRugiBtn: "📉 最大損失",
    adaUntungBtn: "📈 利益あり",
    adaRugiBtn: "📉 損失あり",
    modeDeskHitung: "仕入れ価格（元金）と売価を入力 → 電卓が自動で利益・損失・損益分岐と割合を計算します。",
    modeDeskCariHJ: "元金と目標利益・損失の割合を入力 → 適切な売価を計算します。",
    modeDeskCariHB: "売価と利益・損失の割合を入力 → 元の仕入れ価格（元金）を計算します。",
    modeDeskCariPersen: "仕入れ価格と売価を入力 → 元金に対する利益・損失の割合を計算します。",
    hbLabel2: "仕入れ価格",
    hjLabel2: "売価",
    modalLabel: "元金 (CP)",
    impasPct: "⚖️ 損益分岐 — 割合 = 0%",
    impasMsg: "売価が元金と同じです。利益も損失もありません。",
    caraMenghitung: "計算方法：",
    langkahPenyelesaian: "解法手順：",
    pctUntungLabel: "% 利益",
    pctRugiLabel: "% 損失",
    pctImpasLabel: "% 損益分岐",
    rumusRingkasan: "全公式まとめ",
    secTipsTitle: "問題を解くためのヒントと戦略",
    tips: [
      { n: "01", judul: "まず確認：利益か損失か？", isi: "計算前にSPとCPを比較します。SP > CP → 利益の公式。SP < CP → 損失の公式。間違えないように！" },
      { n: "02", judul: "割合は常に元金（CP）に対して", isi: "注意：利益%・損失%はCPで割ります。SPではありません。割る数が間違うと割合も間違います。" },
      { n: "03", judul: "割合からSPを素早く求める方法", isi: "乗数を使います：利益20% → 元金×1.2。損失15% → 元金×0.85。" },
      { n: "04", judul: "簡単なロジックで確認する", isi: "答えを出したら「合理的か？」と自問します。元金$100で20%利益なら、SPは$100より大きくなければなりません。" },
    ],
    secKuisTitle: "ミニクイズ — 理解度をテスト！",
    soalLabel: "問題",
    quizBenar: "✓ 正解！",
    quizSalah: "✗ 惜しい。",
    sebelumnya: "← 前へ",
    lanjut: "次へ →",
    lihatHasil: "結果を見る",
    hasilKuis: "クイズ結果",
    benar: "正解",
    cobaLagi: "もう一度",
    quizPesan: ["すばらしい！利益と損失をよく理解しています。", "よくできました！間違えた部分を復習しましょう。", "頑張って！教材を読み直してもう一度挑戦しましょう。"],
    quiz: [
      { soal: "商人が本を$80で仕入れ、$100で売った。利益率は何%か？", pilihan: ["20%","25%","30%","35%"], benar: 1, penjelasan: "利益 = $100 − $80 = $20。利益率 = $20 ÷ $80 × 100% = 25%" },
      { soal: "元金$500、利益30%を目標とする。売価はいくらか？", pilihan: ["$550","$600","$650","$700"], benar: 2, penjelasan: "SP = (100 + 30)% × $500 = 1.3 × $500 = $650" },
      { soal: "バッグが15%損失で$340で売られた。仕入れ価格は？", pilihan: ["$380","$390","$400","$420"], benar: 2, penjelasan: "CP = $340 ÷ (100−15)% = $340 ÷ 0.85 = $400" },
      { soal: "CP $200、SP $170。何が起きたか、割合は？", pilihan: ["利益15%","損失15%","利益17%","損失17%"], benar: 1, penjelasan: "SP < CP → 損失。損失 = $200 − $170 = $30。損失率 = $30 ÷ $200 × 100% = 15%" },
      { soal: "自転車を20%利益で売り、売価は$480。仕入れ価格は？", pilihan: ["$380","$390","$400","$420"], benar: 2, penjelasan: "CP = 100/(100+20) × $480 = 100/120 × $480 = $400" },
    ],
    secContohTitle: "例題と解説",
    badgeMudah: "基本", badgeSedang: "標準", badgeSulit: "発展", badgeBonus: "ボーナス",
    pembahasan: "解説：",
    diketahui: "✦ 既知：",
    langkah1: "ステップ1 — 仕入れ価格を求める：",
    langkah2: "ステップ2 — 損失額を求める：",
    verifikasi: "✦ 検証：",
    c1Title: "例題1 – 利益と利益率の計算",
    c1Q: "商人が米1袋を$180で仕入れ、$225で売った。利益と利益率を計算しなさい！",
    c1Known: "CP = $180、SP = $225",
    c1Cond: "SP > CPなので、商人は利益を得た",
    c1Result: "✅ 商人は$45の利益、元金の25%の利益率。",
    c2Title: "例題2 – 利益率から売価を求める",
    c2Q: "果物商人がドリアンを1個$240で仕入れた。元金の35%の利益を得たい。売価はいくらに設定すべきか？",
    c2Known: "CP = $240、利益 U = 35%",
    c2Result: "✅ 設定すべき売価 = $324",
    c3Title: "例題3 – 売価と損失率から仕入れ価格を求める",
    c3Q: "自転車が$680で売られ、売り手は15%の損失を被った。仕入れ価格はいくらか？損失額はいくらか？",
    c3Known: "SP = $680、損失 R = 15%",
    c3Result: "✅ 自転車の仕入れ価格 = $800。損失 = $120。",
    c4Title: "例題4 – 損益分岐点",
    c4Q: "商人がマンゴーを10個$50で買った。7個を1個$6で売り、残りは腐った。商人は利益・損失・損益分岐のどれか？",
    c4Known1: "✦ CP（元金）= $50",
    c4Known2: "✦ SP（売上合計）= 7 × $6 = $42",
    c4Note: "損益分岐には売上合計$50が必要 → 最低⌈50 ÷ 6⌉ = 9個のマンゴーを売る必要あり。",
    c4Result: "✅ 商人は$8の損失。損益分岐には最低9個売らなければならない。",
    impasBarLabel: "⚖️ 損益分岐 — 利益も損失もなし",
    untungBarPrefix: "📈 利益",
    rugiBarPrefix: "📉 損失",
  },
};

const UntungRugiBar = ({ hb, hj, lang, t }: { hb: number; hj: number; lang: Lang; t: typeof translations.id }) => {
  const fmt = makeFmt(lang);
  if (hb <= 0 || hj <= 0) return null;
  const max = Math.max(hb, hj);
  const pctHB = (hb / max) * 100;
  const pctHJ = (hj / max) * 100;
  const untung = hj > hb;
  const impas = hj === hb;
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-body text-xs text-blue-300 w-20 shrink-0">{t.hbLabel2}</span>
          <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
            <div className="h-full bg-blue-500/70 rounded-lg transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${pctHB}%` }}>
              <span className="font-body text-[10px] text-white font-bold">{fmt(hb)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-body text-xs w-20 shrink-0 ${untung ? "text-green-300" : impas ? "text-yellow-300" : "text-red-300"}`}>{t.hjLabel2}</span>
          <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
            <div className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 ${untung ? "bg-green-500/70" : impas ? "bg-yellow-500/70" : "bg-red-500/70"}`} style={{ width: `${pctHJ}%` }}>
              <span className="font-body text-[10px] text-white font-bold">{fmt(hj)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`text-center text-xs font-bold font-body py-1 rounded-lg ${untung ? "text-green-400 bg-green-500/10" : impas ? "text-yellow-300 bg-yellow-500/10" : "text-red-400 bg-red-500/10"}`}>
        {impas ? t.impasBarLabel : untung ? `${t.untungBarPrefix} ${fmt(hj - hb)}` : `${t.rugiBarPrefix} ${fmt(hb - hj)}`}
      </div>
    </div>
  );
};

const KalkulatorJualBeli = ({ lang, t }: { lang: Lang; t: typeof translations.id }) => {
  const fmt = makeFmt(lang);
  const [mode, setMode] = useState<"hitung" | "cari-hj" | "cari-hb" | "cari-persen">("hitung");
  const [hb1, setHb1] = useState(""); const [hj1, setHj1] = useState("");
  const [hb2, setHb2] = useState(""); const [pct2, setPct2] = useState(""); const [tipe2, setTipe2] = useState<"untung" | "rugi">("untung");
  const [hj3, setHj3] = useState(""); const [pct3, setPct3] = useState(""); const [tipe3, setTipe3] = useState<"untung" | "rugi">("untung");
  const [hb4, setHb4] = useState(""); const [hj4, setHj4] = useState("");

  const HB1 = parse(hb1), HJ1 = parse(hj1);
  const selisih1 = HJ1 - HB1;
  const pctHitung = HB1 > 0 ? Math.abs(selisih1 / HB1) * 100 : 0;
  const HB2 = parse(hb2), PCT2 = parse(pct2);
  const HJ2 = tipe2 === "untung" ? HB2 * ((100 + PCT2) / 100) : HB2 * ((100 - PCT2) / 100);
  const HJ3 = parse(hj3), PCT3 = parse(pct3);
  const HB3 = tipe3 === "untung" ? HJ3 * (100 / (100 + PCT3)) : PCT3 < 100 ? HJ3 * (100 / (100 - PCT3)) : 0;
  const HB4 = parse(hb4), HJ4 = parse(hj4);
  const selisih4 = HJ4 - HB4;
  const pct4 = HB4 > 0 ? Math.abs(selisih4 / HB4) * 100 : 0;

  const modes = [
    { id: "hitung", label: t.modeHitung, icon: <ShoppingCart className="w-3.5 h-3.5" /> },
    { id: "cari-hj", label: t.modeCariHJ, icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "cari-hb", label: t.modeCariHB, icon: <Search className="w-3.5 h-3.5" /> },
    { id: "cari-persen", label: t.modeCariPersen, icon: <Percent className="w-3.5 h-3.5" /> },
  ] as const;

  const inputCls = "w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary";
  const labelCls = "font-body text-xs text-white/60 mb-1 block";
  const untungLabel = lang === "id" ? "Untung" : lang === "ja" ? "利益" : "Profit";
  const rugiLabel = lang === "id" ? "Rugi" : lang === "ja" ? "損失" : "Loss";
  const impasLabel = lang === "id" ? "Impas" : lang === "ja" ? "損益分岐" : "Break Even";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => (
          <button key={m.id} onClick={() => { playPopSound(); setMode(m.id); }}
            className={`px-2 py-2 rounded-lg text-xs font-semibold font-body transition-all border flex items-center justify-center gap-1.5 ${mode === m.id ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" : "bg-slate-800/60 border-border text-white/60 hover:border-emerald-500/50"}`}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {mode === "hitung" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.modeDeskHitung}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t.hbInput}</label><input type="number" value={hb1} onChange={e => setHb1(e.target.value)} placeholder={t.hbInputPH} className={inputCls} /></div>
            <div><label className={labelCls}>{t.hjInput}</label><input type="number" value={hj1} onChange={e => setHj1(e.target.value)} placeholder={t.hjInputPH} className={inputCls} /></div>
          </div>
          {HB1 > 0 && HJ1 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB1} hj={HJ1} lang={lang} t={t} />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-blue-400 mb-1">{t.hbLabel2}</p>
                  <p className="font-body text-sm font-bold text-blue-300">{fmt(HB1)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <p className="font-body text-xs text-white/50 mb-1">{t.hjLabel2}</p>
                  <p className="font-body text-sm font-bold text-white">{fmt(HJ1)}</p>
                </div>
                <div className={`rounded-lg p-3 ${selisih1 > 0 ? "bg-green-500/10 border border-green-500/30" : selisih1 < 0 ? "bg-red-500/10 border border-red-500/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
                  <p className={`font-body text-xs mb-1 ${selisih1 > 0 ? "text-green-400" : selisih1 < 0 ? "text-red-400" : "text-yellow-400"}`}>
                    {selisih1 > 0 ? untungLabel : selisih1 < 0 ? rugiLabel : impasLabel}
                  </p>
                  <p className={`font-body text-sm font-bold ${selisih1 > 0 ? "text-green-300" : selisih1 < 0 ? "text-red-300" : "text-yellow-300"}`}>
                    {selisih1 === 0 ? "—" : fmt(Math.abs(selisih1))}
                  </p>
                </div>
              </div>
              {selisih1 !== 0 && (
                <div className={`rounded-lg p-3 border text-center space-y-1 ${selisih1 > 0 ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                  <p className="font-body text-xs text-white/50">{selisih1 > 0 ? t.pctUntungLabel : t.pctRugiLabel}:</p>
                  <p className={`font-body text-base font-bold ${selisih1 > 0 ? "text-green-400" : "text-red-400"}`}>{pctHitung.toFixed(2)}%</p>
                  <p className="font-body text-xs text-white/40">= {fmt(Math.abs(selisih1))} ÷ {fmt(HB1)} × 100%</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {mode === "cari-hj" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.modeDeskCariHJ}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t.hbInput}</label><input type="number" value={hb2} onChange={e => setHb2(e.target.value)} placeholder={t.hbInputPH} className={inputCls} /></div>
            <div><label className={labelCls}>{t.persenInput}</label><input type="number" value={pct2} onChange={e => setPct2(e.target.value)} placeholder={t.pctPH} min={0} max={999} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["untung", "rugi"] as const).map(tp => (
              <button key={tp} onClick={() => { playPopSound(); setTipe2(tp); }}
                className={`py-2 rounded-lg text-xs font-semibold font-body border transition-all ${tipe2 === tp ? (tp === "untung" ? "bg-green-500/20 border-green-400 text-green-300" : "bg-red-500/20 border-red-400 text-red-300") : "bg-slate-900/40 border-border text-white/40 hover:border-white/30"}`}>
                {tp === "untung" ? t.targetUntungBtn : t.batasRugiBtn}
              </button>
            ))}
          </div>
          {HB2 > 0 && PCT2 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB2} hj={HJ2} lang={lang} t={t} />
              <div className={`rounded-lg p-3 border ${tipe2 === "untung" ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                <p className="font-body text-xs text-white/50 mb-2">{t.caraMenghitung}</p>
                <p className="font-body text-sm text-white/80">SP = {tipe2 === "untung" ? `(100 + ${PCT2})` : `(100 − ${PCT2})`}% × {fmt(HB2)}</p>
                <p className="font-body text-sm text-white/80">SP = {tipe2 === "untung" ? (100 + PCT2) : (100 - PCT2)}% × {fmt(HB2)} = <strong className={tipe2 === "untung" ? "text-green-300" : "text-red-300"}>{fmt(HJ2)}</strong></p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-blue-400 mb-1">{t.modalLabel}</p>
                  <p className="font-bold text-blue-300">{fmt(HB2)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center">
                  <ArrowRight className={`w-4 h-4 ${tipe2 === "untung" ? "text-green-400" : "text-red-400"}`} />
                </div>
                <div className={`rounded-lg p-2 border ${tipe2 === "untung" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <p className={`mb-1 ${tipe2 === "untung" ? "text-green-400" : "text-red-400"}`}>{t.hjLabel2}</p>
                  <p className={`font-bold ${tipe2 === "untung" ? "text-green-300" : "text-red-300"}`}>{fmt(HJ2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "cari-hb" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.modeDeskCariHB}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t.hjInput}</label><input type="number" value={hj3} onChange={e => setHj3(e.target.value)} placeholder={t.hjInputPH} className={inputCls} /></div>
            <div><label className={labelCls}>{t.persenInput}</label><input type="number" value={pct3} onChange={e => setPct3(e.target.value)} placeholder={t.pctPH} min={0} max={99} className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["untung", "rugi"] as const).map(tp => (
              <button key={tp} onClick={() => { playPopSound(); setTipe3(tp); }}
                className={`py-2 rounded-lg text-xs font-semibold font-body border transition-all ${tipe3 === tp ? (tp === "untung" ? "bg-green-500/20 border-green-400 text-green-300" : "bg-red-500/20 border-red-400 text-red-300") : "bg-slate-900/40 border-border text-white/40 hover:border-white/30"}`}>
                {tp === "untung" ? t.adaUntungBtn : t.adaRugiBtn}
              </button>
            ))}
          </div>
          {HJ3 > 0 && PCT3 > 0 && HB3 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB3} hj={HJ3} lang={lang} t={t} />
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="font-body text-xs text-white/50 mb-2">{t.langkahPenyelesaian}</p>
                <p className="font-body text-sm text-white/80">SP = {tipe3 === "untung" ? `(100+${PCT3})` : `(100−${PCT3})`}% × CP</p>
                <p className="font-body text-sm text-white/80">CP = {fmt(HJ3)} ÷ {tipe3 === "untung" ? `${(100 + PCT3) / 100}` : `${(100 - PCT3) / 100}`} = <strong className="text-primary">{fmt(HB3)}</strong></p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className={`rounded-lg p-2 border ${tipe3 === "untung" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <p className={`mb-1 ${tipe3 === "untung" ? "text-green-400" : "text-red-400"}`}>{t.hjLabel2}</p>
                  <p className={`font-bold ${tipe3 === "untung" ? "text-green-300" : "text-red-300"}`}>{fmt(HJ3)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-blue-400 mb-1">{t.hbLabel2}</p>
                  <p className="font-bold text-blue-300">{fmt(HB3)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "cari-persen" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.modeDeskCariPersen}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t.hbInput}</label><input type="number" value={hb4} onChange={e => setHb4(e.target.value)} placeholder={t.hbInputPH} className={inputCls} /></div>
            <div><label className={labelCls}>{t.hjInput}</label><input type="number" value={hj4} onChange={e => setHj4(e.target.value)} placeholder={t.hjInputPH} className={inputCls} /></div>
          </div>
          {HB4 > 0 && HJ4 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB4} hj={HJ4} lang={lang} t={t} />
              {selisih4 !== 0 && (
                <div className={`rounded-lg p-3 border ${selisih4 > 0 ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                  <p className="font-body text-xs text-white/50 mb-2">{t.caraMenghitung}</p>
                  <p className="font-body text-sm text-white/80">{lang === "id" ? "Selisih" : "Difference"} = {fmt(HJ4)} − {fmt(HB4)} = {selisih4 > 0 ? "" : "−"}{fmt(Math.abs(selisih4))}</p>
                  <p className="font-body text-sm text-white/80">% {selisih4 > 0 ? (lang === "id" ? "Untung" : lang === "ja" ? "利益" : "Profit") : (lang === "id" ? "Rugi" : lang === "ja" ? "損失" : "Loss")} = {fmt(Math.abs(selisih4))} ÷ {fmt(HB4)} × 100% = <strong className={selisih4 > 0 ? "text-green-300" : "text-red-300"}>{pct4.toFixed(2)}%</strong></p>
                </div>
              )}
              {selisih4 === 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                  <p className="font-body text-sm font-bold text-yellow-300">{t.impasPct}</p>
                  <p className="font-body text-xs text-white/50 mt-1">{t.impasMsg}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-blue-400 mb-1">{t.modalLabel}</p>
                  <p className="font-bold text-blue-300">{fmt(HB4)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-2">
                  <p className="text-white/50 mb-1">{t.hjLabel2}</p>
                  <p className="font-bold text-white">{fmt(HJ4)}</p>
                </div>
                <div className={`rounded-lg p-2 border ${selisih4 > 0 ? "bg-green-500/10 border-green-500/30" : selisih4 < 0 ? "bg-red-500/10 border-red-500/30" : "bg-yellow-500/10 border-yellow-500/30"}`}>
                  <p className={`mb-1 ${selisih4 > 0 ? "text-green-400" : selisih4 < 0 ? "text-red-400" : "text-yellow-400"}`}>
                    % {selisih4 > 0 ? untungLabel : selisih4 < 0 ? rugiLabel : impasLabel}
                  </p>
                  <p className={`font-bold ${selisih4 > 0 ? "text-green-300" : selisih4 < 0 ? "text-red-300" : "text-yellow-300"}`}>{pct4.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MiniKuis = ({ t }: { t: typeof translations.id }) => {
  const quizData = t.quiz;
  const [idx, setIdx] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [skor, setSkor] = useState(0);
  const [jawaban, setJawaban] = useState<(number | null)[]>(Array(quizData.length).fill(null));
  const q = quizData[idx];

  const pilih = (i: number) => {
    if (dipilih !== null) return;
    playPopSound();
    setDipilih(i);
    const baru = [...jawaban]; baru[idx] = i; setJawaban(baru);
    if (i === q.benar) setSkor(s => s + 1);
  };
  const lanjut = () => {
    playPopSound();
    if (idx < quizData.length - 1) { setIdx(idx + 1); setDipilih(jawaban[idx + 1]); }
    else setSelesai(true);
  };
  const kembali = () => { playPopSound(); if (idx > 0) { setIdx(idx - 1); setDipilih(jawaban[idx - 1]); } };
  const ulang = () => { playPopSound(); setIdx(0); setDipilih(null); setSelesai(false); setSkor(0); setJawaban(Array(quizData.length).fill(null)); };

  if (selesai) {
    const pct = Math.round((skor / quizData.length) * 100);
    const warna = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
    const pesan = pct >= 80 ? t.quizPesan[0] : pct >= 60 ? t.quizPesan[1] : t.quizPesan[2];
    return (
      <div className="text-center space-y-4 py-4">
        <Star className="w-12 h-12 text-yellow-400 mx-auto" />
        <p className="font-body text-lg font-bold text-white">{t.hasilKuis}</p>
        <p className={`font-display text-4xl font-bold ${warna}`}>{skor}/{quizData.length}</p>
        <p className={`font-body text-sm ${warna}`}>{pct}% {t.benar}</p>
        <p className="font-body text-sm text-white/60">{pesan}</p>
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {quizData.map((q, i) => (
            <div key={i} className={`h-8 rounded-lg flex items-center justify-center ${jawaban[i] === q.benar ? "bg-green-500/30 border border-green-500" : "bg-red-500/30 border border-red-500"}`}>
              {jawaban[i] === q.benar ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            </div>
          ))}
        </div>
        <button onClick={ulang} className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400 text-emerald-300 px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-emerald-500/30 transition-colors">
          <RefreshCw className="w-4 h-4" /> {t.cobaLagi}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {quizData.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-emerald-400" : jawaban[i] !== null ? (jawaban[i] === quizData[i].benar ? "w-3 bg-green-500" : "w-3 bg-red-500") : "w-3 bg-white/20"}`} />
          ))}
        </div>
        <span className="font-body text-xs text-white/40">{t.soalLabel} {idx + 1}/{quizData.length}</span>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-4">
        <p className="font-body text-sm text-white leading-relaxed">{q.soal}</p>
      </div>
      <div className="space-y-2">
        {q.pilihan.map((p, i) => {
          let cls = "bg-slate-800/60 border-border text-white/80 hover:border-emerald-500/50";
          if (dipilih !== null) {
            if (i === q.benar) cls = "bg-green-500/20 border-green-500 text-green-300";
            else if (i === dipilih && i !== q.benar) cls = "bg-red-500/20 border-red-500 text-red-300";
            else cls = "bg-slate-800/30 border-border text-white/30";
          }
          return (
            <button key={i} onClick={() => pilih(i)} className={`w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-all flex items-center gap-3 ${cls}`}>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">{String.fromCharCode(65 + i)}</span>
              {p}
              {dipilih !== null && i === q.benar && <CheckCircle className="w-4 h-4 text-green-400 ml-auto shrink-0" />}
              {dipilih !== null && i === dipilih && i !== q.benar && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>
      {dipilih !== null && (
        <div className={`rounded-lg p-4 border ${dipilih === q.benar ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
          <p className={`font-body text-xs font-semibold mb-1 ${dipilih === q.benar ? "text-green-400" : "text-red-400"}`}>{dipilih === q.benar ? t.quizBenar : t.quizSalah}</p>
          <p className="font-body text-xs text-white/70">{q.penjelasan}</p>
        </div>
      )}
      <div className="flex justify-between gap-3">
        <button onClick={kembali} disabled={idx === 0} className="px-4 py-2 rounded-lg text-sm font-body font-semibold border border-border text-white/60 hover:border-emerald-500/50 disabled:opacity-30 transition-all">{t.sebelumnya}</button>
        <button onClick={lanjut} disabled={dipilih === null} className="flex-1 px-4 py-2 rounded-lg text-sm font-body font-semibold bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-30 transition-all">
          {idx < quizData.length - 1 ? t.lanjut : t.lihatHasil}
        </button>
      </div>
    </div>
  );
};

const Section = ({ id, expanded, onToggle, icon, title, children }: {
  id: string; expanded: boolean; onToggle: (id: string) => void;
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) => (
  <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
    <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">{icon}<span className="font-body font-semibold text-white">{title}</span></div>
      {expanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
    {expanded && <div className="px-5 pb-5">{children}</div>}
  </div>
);

const JualBeliUntungRugiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (language as Lang) ?? "id";
  const t = translations[lang] ?? translations.id;
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro","konsep","impas","persen","tips","kalkulator","kuis","contoh"]);
  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  const profitLabel = lang === "id" ? "Untung" : lang === "ja" ? "利益" : "Profit";
  const lossLabel = lang === "id" ? "Rugi" : lang === "ja" ? "損失" : "Loss";
  const bELabel = lang === "id" ? "Impas" : lang === "ja" ? "損益分岐" : "Break Even";
  const untungMath = lang === "id" ? "\\text{Untung}" : lang === "ja" ? "\\text{利益}" : "\\text{Profit}";
  const rugiMath = lang === "id" ? "\\text{Rugi}" : lang === "ja" ? "\\text{損失}" : "\\text{Loss}";
  const imapasMath = lang === "id" ? "\\text{Impas}" : lang === "ja" ? "\\text{損益分岐}" : "\\text{Break Even}";
  const cpLabel = lang === "id" ? "HB" : "CP";
  const spLabel = lang === "id" ? "HJ" : "SP";
  const hbText = lang === "id" ? "\\text{Untung} = HJ - HB" : lang === "ja" ? "\\text{利益} = SP - CP" : "\\text{Profit} = SP - CP";
  const rugiText = lang === "id" ? "\\text{Rugi} = HB - HJ" : lang === "ja" ? "\\text{損失} = CP - SP" : "\\text{Loss} = CP - SP";
  const pctUText = lang === "id" ? "\\%U = \\frac{\\text{Untung}}{HB} \\times 100\\%" : lang === "ja" ? "\\%P = \\frac{\\text{利益}}{CP} \\times 100\\%" : "\\%P = \\frac{\\text{Profit}}{CP} \\times 100\\%";
  const pctRText = lang === "id" ? "\\%R = \\frac{\\text{Rugi}}{HB} \\times 100\\%" : lang === "ja" ? "\\%L = \\frac{\\text{損失}}{CP} \\times 100\\%" : "\\%L = \\frac{\\text{Loss}}{CP} \\times 100\\%";

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <Section id="intro" expanded={expandedSections.includes("intro")} onToggle={toggleSection}
            icon={<Lightbulb className="w-5 h-5 text-yellow-400" />} title={t.secIntroTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.secIntroBody}</p>
              <figure>
                <img src="/images/image_1775640587265.png" alt={lang === "id" ? "Ilustrasi Jual Beli" : lang === "ja" ? "売買のイラスト" : "Buying & Selling Illustration"} className="w-full rounded-xl object-cover" />
                <figcaption className="font-body text-xs text-white/50 text-center mt-2">
                  <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">https://www.bing.com/images/create</a>
                </figcaption>
              </figure>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-xs font-bold text-blue-300 mb-1 uppercase tracking-wide">{t.hbLabel}</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">{t.hbDesc}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-xs font-bold text-orange-300 mb-1 uppercase tracking-wide">{t.hjLabel}</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">{t.hjDesc}</p>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-border rounded-lg p-4">
                <p className="font-body text-xs font-semibold text-white/70 mb-2">{t.kunciUtama}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.kunciDesc}</p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs font-body">
                  <div className="flex items-center gap-2 text-green-400"><TrendingUp className="w-3 h-3" /> {t.untungCond}</div>
                  <div className="flex items-center gap-2 text-red-400"><TrendingDown className="w-3 h-3" /> {t.rugiCond}</div>
                  <div className="flex items-center gap-2 text-yellow-300"><Minus className="w-3 h-3" /> {t.impasCond}</div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="konsep" expanded={expandedSections.includes("konsep")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-green-400" />} title={t.secKonsepTitle}>
            <div className="space-y-5">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /><p className="font-body text-sm font-bold text-green-300">{t.untungTitle}</p></div>
                <p className="font-body text-xs text-white/60 leading-relaxed">{t.untungWhen}</p>
                <div className="bg-slate-900/60 rounded-lg p-3"><BlockMath math={`\\boxed{${hbText}}`} /></div>
                <div className="bg-green-900/20 rounded p-3 text-xs font-body text-white/70 leading-relaxed space-y-1">
                  <p><strong className="text-green-300">{spLabel}</strong> = {t.untungHJ}</p>
                  <p><strong className="text-green-300">{cpLabel}</strong> = {t.untungHB}</p>
                  <p className="text-white/50 italic">{t.untungNote}</p>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-400" /><p className="font-body text-sm font-bold text-red-300">{t.rugiTitle}</p></div>
                <p className="font-body text-xs text-white/60 leading-relaxed">{t.rugiWhen}</p>
                <div className="bg-slate-900/60 rounded-lg p-3"><BlockMath math={`\\boxed{${rugiText}}`} /></div>
                <div className="bg-red-900/20 rounded p-3 text-xs font-body text-white/70 leading-relaxed space-y-1">
                  <p><strong className="text-red-300">{cpLabel}</strong> = {t.rugiHB}</p>
                  <p><strong className="text-red-300">{spLabel}</strong> = {t.rugiHJ}</p>
                  <p className="text-white/50 italic">{t.rugiNote}</p>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-bold text-blue-300">{t.cariHJTitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-green-300 font-semibold">{t.targetUntung}</p>
                    <BlockMath math={`${spLabel} = \\frac{100 + U}{100} \\times ${cpLabel}`} />
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-red-300 font-semibold">{t.batasRugi}</p>
                    <BlockMath math={`${spLabel} = \\frac{100 - R}{100} \\times ${cpLabel}`} />
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-yellow-200 leading-relaxed">{t.warningPersen}</p>
              </div>
            </div>
          </Section>

          <Section id="impas" expanded={expandedSections.includes("impas")} onToggle={toggleSection}
            icon={<Minus className="w-5 h-5 text-yellow-300" />} title={t.secImpasTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.impasDesc}</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                  <BlockMath math={`\\boxed{${spLabel} = ${cpLabel} \\implies ${imapasMath}}`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <p className="text-white/50 mb-1">{t.impasUntung}</p>
                    <p className="text-green-400 font-bold">&gt; 0</p>
                    <p className="text-white/40">{spLabel} &gt; {cpLabel}</p>
                  </div>
                  <div className="bg-yellow-500/20 rounded p-2 text-center border border-yellow-500/40">
                    <p className="text-white/50 mb-1">{t.impasImpas}</p>
                    <p className="text-yellow-300 font-bold">= 0</p>
                    <p className="text-white/40">{spLabel} = {cpLabel}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <p className="text-white/50 mb-1">{t.impasRugi}</p>
                    <p className="text-red-400 font-bold">&lt; 0</p>
                    <p className="text-white/40">{spLabel} &lt; {cpLabel}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="font-body text-xs text-white/60 leading-relaxed">{t.impasContoh}</p>
              </div>
            </div>
          </Section>

          <Section id="persen" expanded={expandedSections.includes("persen")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-purple-400" />} title={t.secPersenTitle}>
            <div className="space-y-5">
              <p className="font-body text-sm text-white/70 leading-relaxed">{t.persenIntro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-purple-300">{t.pctUntungTitle}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3"><BlockMath math={pctUText} /></div>
                  <p className="font-body text-xs text-white/55 leading-relaxed">{t.pctUntungEx} <InlineMath math="25\%" />.</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-purple-300">{t.pctRugiTitle}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3"><BlockMath math={pctRText} /></div>
                  <p className="font-body text-xs text-white/55 leading-relaxed">{t.pctRugiEx}</p>
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-bold text-cyan-300">{t.cariHBTitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-green-300 font-semibold">{t.jikaUntung}</p>
                    <BlockMath math={`${cpLabel} = \\frac{100}{100 + U} \\times ${spLabel}`} />
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-red-300 font-semibold">{t.jikaRugi}</p>
                    <BlockMath math={`${cpLabel} = \\frac{100}{100 - R} \\times ${spLabel}`} />
                  </div>
                </div>
              </div>
              <WarungAritmetika />
            </div>
          </Section>

          <Section id="kalkulator" expanded={expandedSections.includes("kalkulator")} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-emerald-400" />} title={t.secKalkTitle}>
            <div className="space-y-3">
              <p className="font-body text-xs text-white/50 leading-relaxed">{t.kalkIntro}</p>
              <KalkulatorJualBeli lang={lang} t={t} />
              <div className="bg-slate-900/60 border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-slate-800/80">
                  <p className="font-body text-xs font-bold text-white/70 uppercase tracking-wide">{t.rumusRingkasan}</p>
                </div>
                <div className="p-3 space-y-2 font-body text-xs text-white/70">
                  <div className="flex gap-2 items-start"><span className="text-green-400 shrink-0 font-bold w-28">{profitLabel}</span><span><InlineMath math={`= ${spLabel} - ${cpLabel}`} /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-red-400 shrink-0 font-bold w-28">{lossLabel}</span><span><InlineMath math={`= ${cpLabel} - ${spLabel}`} /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-purple-300 shrink-0 font-bold w-28">% {profitLabel}</span><span><InlineMath math={`= \\frac{${untungMath}}{${cpLabel}} \\times 100\\%`} /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-purple-300 shrink-0 font-bold w-28">% {lossLabel}</span><span><InlineMath math={`= \\frac{${rugiMath}}{${cpLabel}} \\times 100\\%`} /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-blue-300 shrink-0 font-bold w-28">{spLabel} ({profitLabel} U%)</span><span><InlineMath math={`= \\frac{100+U}{100} \\times ${cpLabel}`} /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-blue-300 shrink-0 font-bold w-28">{spLabel} ({lossLabel} R%)</span><span><InlineMath math={`= \\frac{100-R}{100} \\times ${cpLabel}`} /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-cyan-300 shrink-0 font-bold w-28">{cpLabel} ({profitLabel})</span><span><InlineMath math={`= \\frac{100}{100+U} \\times ${spLabel}`} /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-cyan-300 shrink-0 font-bold w-28">{cpLabel} ({lossLabel})</span><span><InlineMath math={`= \\frac{100}{100-R} \\times ${spLabel}`} /></span></div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="tips" expanded={expandedSections.includes("tips")} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-yellow-400" />} title={t.secTipsTitle}>
            <div className="grid grid-cols-1 gap-3">
              {t.tips.map(tip => (
                <div key={tip.n} className="bg-slate-800/60 rounded-lg p-4 flex gap-3">
                  <span className="text-yellow-400 font-bold text-sm shrink-0">{tip.n}</span>
                  <div>
                    <p className="font-body text-xs font-semibold text-white/90 mb-1">{tip.judul}</p>
                    <p className="font-body text-xs text-white/55 leading-relaxed">{tip.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="kuis" expanded={expandedSections.includes("kuis")} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-emerald-400" />} title={t.secKuisTitle}>
            <MiniKuis t={t} />
          </Section>

          <Section id="contoh" expanded={expandedSections.includes("contoh")} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-blue-400" />} title={t.secContohTitle}>
            <div className="space-y-6">

              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMudah}</span>
                  <span className="font-body font-semibold text-white text-sm">{t.c1Title}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">{t.c1Q}</p>
                </div>
                <figure>
                  <img src="/images/image_1775640978525.png" alt={lang === "id" ? "Pedagang beras di pasar" : lang === "ja" ? "市場の米商人" : "Rice merchant at market"} className="w-full rounded-xl object-cover" />
                  <figcaption className="font-body text-xs text-white/50 text-center mt-2">
                    <a href="https://infoburuh.com/wp-content/uploads/2022/12/Harga_Beras_Indonesia_Disebut_Bank_Dunia_Paling_Mahal_di_Asia_Tenggara.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">{lang === "id" ? "sumber gambar" : lang === "ja" ? "画像出典" : "image source"}</a>
                  </figcaption>
                </figure>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.pembahasan}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60 space-y-1">
                      <p>{t.diketahui} {lang === "id" ? "HB = Rp180.000, HJ = Rp225.000" : lang === "ja" ? "CP = $180、SP = $225" : "CP = $180, SP = $225"}</p>
                      <p>✦ {t.c1Cond}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      {lang === "id" ? (
                        <>
                          <BlockMath math="\\text{Untung} = HJ - HB = 225.000 - 180.000 = \\text{Rp}45.000" />
                          <BlockMath math="\\%U = \\frac{\\text{Untung}}{HB} \\times 100\\% = \\frac{45.000}{180.000} \\times 100\\% = 25\\%" />
                        </>
                      ) : lang === "ja" ? (
                        <>
                          <BlockMath math="\\text{利益} = SP - CP = 225 - 180 = \\$45" />
                          <BlockMath math="\\%P = \\frac{45}{180} \\times 100\\% = 25\\%" />
                        </>
                      ) : (
                        <>
                          <BlockMath math="\\text{Profit} = SP - CP = 225 - 180 = \\$45" />
                          <BlockMath math="\\%P = \\frac{45}{180} \\times 100\\% = 25\\%" />
                        </>
                      )}
                    </div>
                    <p className="text-green-300 font-semibold text-xs">✅ {t.c1Result}</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSedang}</span>
                  <span className="font-body font-semibold text-white text-sm">{t.c2Title}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">{t.c2Q}</p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.pembahasan}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60"><p>{t.diketahui} {t.c2Known}</p></div>
                    <div className="bg-slate-900/50 rounded p-3">
                      {lang === "id"
                        ? <BlockMath math="HJ = \\frac{100 + 35}{100} \\times 240.000 = 1{,}35 \\times 240.000 = \\text{Rp}324.000" />
                        : <BlockMath math="SP = \\frac{100 + 35}{100} \\times 240 = 1.35 \\times 240 = \\$324" />}
                    </div>
                    <p className="text-yellow-300 font-semibold text-xs">✅ {t.c2Result}</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSulit}</span>
                  <span className="font-body font-semibold text-white text-sm">{t.c3Title}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">{t.c3Q}</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.pembahasan}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60"><p>{t.diketahui} {t.c3Known}</p></div>
                    <p className="text-xs font-semibold text-white/80">{t.langkah1}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      {lang === "id"
                        ? <BlockMath math="HB = \\frac{100}{100 - 15} \\times 680.000 = \\frac{100}{85} \\times 680.000 = \\text{Rp}800.000" />
                        : <BlockMath math="CP = \\frac{100}{100 - 15} \\times 680 = \\frac{100}{85} \\times 680 = \\$800" />}
                    </div>
                    <p className="text-xs font-semibold text-white/80">{t.langkah2}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      {lang === "id"
                        ? <BlockMath math="\\text{Rugi} = HB - HJ = 800.000 - 680.000 = \\text{Rp}120.000" />
                        : lang === "ja"
                        ? <BlockMath math="\\text{損失} = CP - SP = 800 - 680 = \\$120" />
                        : <BlockMath math="\\text{Loss} = CP - SP = 800 - 680 = \\$120" />}
                    </div>
                    <div className="text-xs text-white/60">
                      <p>✦ {t.verifikasi} <InlineMath math={lang === "id" ? "\\%R = \\frac{120.000}{800.000} \\times 100\\% = 15\\%" : "\\%L = \\frac{120}{800} \\times 100\\% = 15\\%"} /> ✓</p>
                    </div>
                    <p className="text-red-300 font-semibold text-xs">✅ {t.c3Result}</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-400 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-yellow-400/20 text-yellow-300 text-xs font-bold px-2 py-1 rounded">{t.badgeBonus}</span>
                  <span className="font-body font-semibold text-white text-sm">{t.c4Title}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">{t.c4Q}</p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.pembahasan}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60 space-y-1">
                      <p>{t.c4Known1}</p><p>{t.c4Known2}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      {lang === "id" ? (
                        <>
                          <BlockMath math="HJ < HB \\implies \\text{RUGI}" />
                          <BlockMath math="\\text{Rugi} = 50.000 - 42.000 = \\text{Rp}8.000" />
                        </>
                      ) : lang === "ja" ? (
                        <>
                          <BlockMath math="SP < CP \\implies \\text{損失}" />
                          <BlockMath math="\\text{損失} = 50 - 42 = \\$8" />
                        </>
                      ) : (
                        <>
                          <BlockMath math="SP < CP \\implies \\text{LOSS}" />
                          <BlockMath math="\\text{Loss} = 50 - 42 = \\$8" />
                        </>
                      )}
                    </div>
                    <p className="text-xs text-white/60">{t.c4Note}</p>
                    <p className="text-yellow-300 font-semibold text-xs">✅ {t.c4Result}</p>
                  </div>
                </div>
              </div>

            </div>
          </Section>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aritmetika-sosial"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JualBeliUntungRugiPage;
