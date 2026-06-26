import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, Lightbulb, Calculator,
  Target, Plus, Minus, Info, ArrowRight, Zap
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PENJUMLAHAN DAN PENGURANGAN BENTUK DESIMAL",
    pageSubtitle: "Kelas 7 – Bilangan Rasional",
    aH: "R", aT: "P", aO: "S", at: "p", ah: "r", am: "b",
    pvHeaders: ["Ribuan","Ratusan","Puluhan","Satuan","⟵ Koma ⟶","Persepuluhan","Perseratusan","Perseribuan"] as string[],
    pvAbbr: ["B","R","P","S",",","p","r","b"] as string[],
    pvValues: ["1000","100","10","1","","0,1","0,01","0,001"] as string[],
    sec0Title: "Konsep Dasar: Nilai Tempat Desimal",
    sec0Intro: <>Sebelum menjumlahkan atau mengurangkan, penting banget buat paham dulu struktur <strong className="text-cyan-300">nilai tempat</strong> desimal. Setiap angka punya "posisi" sendiri yang menentukan nilainya. Kunci utamanya: <strong className="text-yellow-300">tanda koma harus selalu sejajar!</strong></>,
    sec0Caption: <>Contoh Ilustrasi: <InlineMath math="934{,}456 + 70{,}806" /></>,
    sec0Note1: <><strong className="text-green-300">perseribuan (b)</strong>: 6 + 6 = 12 → tulis 2, simpan 1 ke kolom perseratusan</>,
    sec0Note2: <><strong className="text-cyan-300">persepuluhan (p)</strong>: 4 + 8 = 12 → tulis 2, simpan 1 ke kolom satuan</>,
    sec0Note3: <><strong className="text-purple-300">puluhan (P)</strong>: 3 + 7 = 10 → tulis 0, simpan 1 ke kolom ratusan</>,
    conclusionLabel: "Kesimpulan:",
    sec0Conclusion: <>Untuk menjumlahkan atau mengurangkan bilangan desimal, letakkan tanda koma pada satu lajur yang sama agar angka ribuan, ratusan, puluhan, satuan, persepuluhan, dan seterusnya masing-masing berada pada kolom yang tepat!</>,
    summaryLabel: "Ringkasan Intisari",
    examplesLabel: "Contoh Soal dan Pembahasan",
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    discuss: "✦ PEMBAHASAN",
    ex: (n: number) => `Contoh ${n}`,
    step: (n: number) => `Langkah ${n}:`,
    sec1Header: "Penjumlahan Bentuk Desimal",
    sec1Summary: <>Menjumlahkan bilangan desimal itu <strong className="text-green-300">semudah menjumlahkan bilangan bulat</strong> — triknya cuma satu: pastikan <strong className="text-yellow-300">tanda koma selalu sejajar secara vertikal</strong>. Dengan begitu, angka persepuluhan ketemu persepuluhan, perseratusan ketemu perseratusan, dan seterusnya. Kalau jumlah digit di belakang koma berbeda, tinggal tambahkan nol agar sama panjang.</>,
    sec1StepsTitle: "Langkah-Langkah Penjumlahan Desimal",
    sec1Steps: [
      { t: "Susun bilangan secara vertikal", d: "Pastikan tanda koma berada dalam satu kolom (sejajar ke bawah)." },
      { t: "Samakan panjang digit desimal", d: "Tambahkan angka 0 di belakang koma pada bilangan yang digit desimalnya lebih sedikit." },
      { t: "Jumlahkan kolom per kolom", d: "Mulai dari kolom paling kanan (perseribuan), bergerak ke kiri. Jika hasilnya ≥ 10, simpan angka puluhannya ke kolom berikutnya." },
      { t: "Tuliskan tanda koma pada hasil", d: "Posisi koma pada hasil sama persis dengan posisi koma di soal." },
    ] as { t: string; d: string }[],
    s1e1Q: <>Tentukan hasil penjumlahan <InlineMath math="14{,}7 + 8{,}39" /></>,
    s1e1s1: <><strong>Langkah 1:</strong> Samakan digit desimal — <InlineMath math="14{,}7" /> menjadi <InlineMath math="14{,}70" /> (tambah 1 nol)</>,
    s1e1s2: <><strong>Langkah 2:</strong> Susun vertikal dengan koma sejajar, lalu jumlahkan kolom demi kolom:</>,
    s1e1s3: <><strong>Langkah 3:</strong> Koma tetap di posisi yang sama pada hasil.</>,
    s1e1ans: <>∴ Jadi, hasil penjumlahannya adalah <InlineMath math="23{,}09" /></>,
    s1e2Q: <>Tentukan hasil penjumlahan <InlineMath math="9{,}754 + 52{,}18" /></>,
    s1e2s1: <><strong>Langkah 1:</strong> <InlineMath math="52{,}18" /> punya 2 digit desimal, <InlineMath math="9{,}754" /> punya 3 digit. Tambah 1 nol pada <InlineMath math="52{,}18" /> → <InlineMath math="52{,}180" /></>,
    s1e2s2: <><strong>Langkah 2:</strong> Susun vertikal dan hitung:</>,
    s1e2note: <>Perseribuan: 4 + 0 = 4 &nbsp;|&nbsp; Perseratusan: 5 + 8 = 13 (tulis 3, simpan 1) &nbsp;|&nbsp; Persepuluhan: 7 + 1 + 1 = 9</>,
    s1e2ans: <>∴ Jadi, hasil penjumlahannya adalah <InlineMath math="61{,}934" /></>,
    s1e3Q: <>Sebuah proyek jalan membutuhkan 3 gulungan kawat. Gulungan pertama sepanjang <InlineMath math="934{,}456" /> m, gulungan kedua sepanjang <InlineMath math="70{,}806" /> m, dan gulungan ketiga sepanjang <InlineMath math="8{,}34" /> m. Berapa meter total panjang kawat yang dibutuhkan?</>,
    s1e3s1: <><strong>Langkah 1:</strong> Kenali bilangan yang dijumlahkan:</>,
    s1e3katex1: "\\text{Total} = 934{,}456 + 70{,}806 + 8{,}34",
    s1e3s2: <><strong>Langkah 2:</strong> Samakan digit desimal — <InlineMath math="8{,}34" /> menjadi <InlineMath math="8{,}340" /></>,
    s1e3s3: <><strong>Langkah 3:</strong> Susun vertikal dan jumlahkan:</>,
    s1e3ans: <>∴ Jadi, total panjang kawat yang dibutuhkan adalah <InlineMath math="1013{,}602" /> m</>,
    sec2Header: "Pengurangan Bentuk Desimal",
    sec2Summary: <>Pengurangan desimal prinsipnya <strong className="text-red-300">sama persis dengan penjumlahan</strong>: jajarkan koma, samakan panjang digit desimal dengan menambahkan nol. Bedanya, saat kamu mengurangkan kolom dan angka atas lebih kecil dari angka bawah, kamu perlu <strong className="text-orange-300">meminjam 1 nilai dari kolom sebelah kiri</strong> (persis seperti pengurangan bilangan bulat biasa).</>,
    sec2StepsTitle: "Langkah-Langkah Pengurangan Desimal",
    sec2Steps: [
      { t: "Susun vertikal, koma sejajar", d: "Bilangan yang dikurangi di atas, pengurang di bawah." },
      { t: "Samakan panjang digit desimal", d: "Tambahkan nol di posisi yang kurang agar jumlah digit di belakang koma sama." },
      { t: "Kurangkan kolom per kolom dari kanan", d: "Mulai dari kolom paling kanan. Jika angka atas < angka bawah, pinjam 1 dari kolom sebelah kiri (nilainya jadi +10)." },
      { t: "Tuliskan koma pada posisi yang sama", d: "Koma hasil sejajar dengan koma di soal." },
    ] as { t: string; d: string }[],
    sec2Tip: <><strong>Tips:</strong> Kalau bilangan yang dikurangi adalah bilangan bulat (contoh: 467,8 dikurangi sesuatu), kamu bisa tulis bilangan itu dengan nol di belakang koma sesuai kebutuhan. Misal <InlineMath math="467{,}8" /> bisa ditulis <InlineMath math="467{,}800" /> agar punya 3 digit desimal.</>,
    s2e1Q: <>Kurangkan <InlineMath math="23{,}5 - 7{,}25" /></>,
    s2e1s1: <><strong>Langkah 1:</strong> Samakan digit desimal — <InlineMath math="23{,}5" /> menjadi <InlineMath math="23{,}50" /></>,
    s2e1ans: <>∴ Jadi, <InlineMath math="23{,}5 - 7{,}25 = 16{,}25" /></>,
    s2e2Q: <>Kurangkan <InlineMath math="84{,}937" /> dari <InlineMath math="725{,}46" /></>,
    s2e2note: <><strong>Perhatian:</strong> "Kurangkan A dari B" artinya <InlineMath math="B - A" />, jadi soalnya: <InlineMath math="725{,}46 - 84{,}937" /></>,
    s2e2s1: <><strong>Langkah 1:</strong> Samakan digit desimal — <InlineMath math="725{,}46" /> menjadi <InlineMath math="725{,}460" /></>,
    s2e2ans: <>∴ Jadi, hasilnya adalah <InlineMath math="640{,}523" /></>,
    s2e3Q: <>Kurangkan <InlineMath math="89{,}276" /> dari <InlineMath math="467{,}8" />. Kemudian kurangkan lagi hasilnya dengan <InlineMath math="120{,}05" />. Berapa hasil akhirnya?</>,
    s2e3s1: <><strong>Langkah 1:</strong> Operasi pertama — <InlineMath math="467{,}8 - 89{,}276" /></>,
    s2e3s1b: <>Samakan digit desimal: <InlineMath math="467{,}8" /> → <InlineMath math="467{,}800" /></>,
    s2e3s2: <><strong>Langkah 2:</strong> Operasi kedua — <InlineMath math="378{,}524 - 120{,}050" /></>,
    s2e3ans: <>∴ Jadi, hasil akhirnya adalah <InlineMath math="258{,}474" /></>,
    sec3Header: "Gabungan Penjumlahan dan Pengurangan",
    sec3Summary: <>Saat soal menggabungkan penjumlahan <strong className="text-cyan-300">sekaligus</strong> pengurangan, ingat aturan sederhananya: <strong className="text-yellow-300">kerjakan dari kiri ke kanan</strong>. Penjumlahan dan pengurangan memiliki tingkat prioritas yang sama, jadi tidak ada yang didahulukan — cukup ikuti urutan penulisannya.</>,
    sec3Tip: <><strong>Cara Efisien:</strong> Kamu bisa juga mengumpulkan semua yang bernilai positif (+) dulu, lalu kurangkan semua yang bernilai negatif (−) dari totalnya. Hasilnya akan sama!</>,
    s3e1Q: <>Hitunglah <InlineMath math="18{,}6 + 7{,}45 - 9{,}3" /></>,
    s3e1s0: <><strong>Kerjakan dari kiri ke kanan:</strong></>,
    s3e1s1: <><strong>Langkah 1:</strong> Hitung <InlineMath math="18{,}60 + 7{,}45" /> terlebih dahulu:</>,
    s3e1s2: <><strong>Langkah 2:</strong> Lanjutkan <InlineMath math="26{,}05 - 9{,}30" />:</>,
    s3e1ans: <>∴ Jadi, hasilnya adalah <InlineMath math="16{,}75" /></>,
    s3e2Q: <>Hitunglah <InlineMath math="45{,}72 - 18{,}5 + 9{,}384 - 6{,}2" /></>,
    s3e2discuss: "✦ PEMBAHASAN (Cara Efisien)",
    s3e2note: "Kelompokkan yang positif dan negatif terpisah:",
    s3e2posLabel: "Yang dijumlahkan (+)",
    s3e2negLabel: "Yang dikurangkan (−)",
    s3e2finalLabel: "Hasil akhir:",
    s3e2ans: <>∴ Jadi, hasilnya adalah <InlineMath math="30{,}404" /></>,
    s3e3Q: <>Pak Budi memiliki sebidang lahan seluas <InlineMath math="1250{,}75" /> m². Ia menjual <InlineMath math="375{,}5" /> m² kepada tetangganya, kemudian membeli tambahan lahan seluas <InlineMath math="128{,}25" /> m². Berapa luas lahan Pak Budi sekarang?</>,
    s3e3s1: <><strong>Langkah 1:</strong> Susun persamaan (jual = berkurang, beli = bertambah):</>,
    s3e3katex1: "\\text{Luas} = 1250{,}75 - 375{,}5 + 128{,}25",
    s3e3s2: <><strong>Langkah 2:</strong> Kerjakan dari kiri: <InlineMath math="1250{,}75 - 375{,}50" /></>,
    s3e3s3: <><strong>Langkah 3:</strong> Lanjutkan: <InlineMath math="875{,}25 + 128{,}25" /></>,
    s3e3ans: <>∴ Jadi, luas lahan Pak Budi sekarang adalah <InlineMath math="1003{,}5" /> m²</>,
    sumTitle: "➕➖ RANGKUMAN LENGKAP",
    sumSubtitle: "Penjumlahan & Pengurangan Bentuk Desimal — Kelas 7",
    sumSec1Label: "Aturan Penjumlahan & Pengurangan Desimal",
    sumCards: [
      { label: "⭐ Aturan #1: SEJAJARKAN TANDA KOMA!", desc: "Ini adalah aturan paling penting! Kolom satuan sejajar, persepuluhan sejajar, perseratusan sejajar, dan seterusnya.", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "Tambahkan nol jika panjang desimal berbeda", desc: "5,3 + 2,45: ubah menjadi 5,30 + 2,45 agar kolom sejajar. Menambah nol di akhir tidak mengubah nilai!", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
      { label: "Kerjakan kolom per kolom dari kanan ke kiri", desc: "Sama seperti bilangan bulat! Mulai dari kolom paling kanan (nilai paling kecil), lalu ke kiri. Ingat simpan angka bila ≥ 10.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Tanda koma di hasil sejajar dengan yang di soal", desc: "Setelah menghitung, letakkan koma tepat di bawah koma-koma yang disejajarkan di langkah pertama.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
    ] as { label: string; desc: string; color: string }[],
    sumSec2Label: "Tips & Trik Jitu",
    sumTips: [
      { icon: "📐", tip: "Selalu tulis dalam bentuk kolom sejajar", detail: "Menulis 3,14 + 2,5 dalam satu baris sering menyebabkan kesalahan. Tulis dalam kolom bersusun — koma di bawah koma!", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "0️⃣", tip: "Tambahkan nol sebagai placeholder", detail: "3,1 − 1,25 → ubah 3,1 menjadi 3,10 dulu. Nol di akhir tidak mengubah nilai tapi membantu perhitungan!", color: "bg-sky-900/30 border-sky-500/30" },
      { icon: "🎯", tip: "Estimasi dulu: berapa angka sebelum koma?", detail: "12,5 + 7,3 harus sekitar 19 atau 20. Jika dapatmu 192 atau 1,92 → koma di posisi yang salah!", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "✅", tip: "Cek dengan membalik urutan (komutatif)", detail: "3,14 + 2,5 = 5,64. Cek: 2,5 + 3,14 juga harus 5,64. Untuk pengurangan, ubah ke penjumlahan: a − b + b = a.", color: "bg-indigo-900/30 border-indigo-500/30" },
    ] as { icon: string; tip: string; detail: string; color: string }[],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Penjumlahan dan pengurangan desimal sangat mirip dengan bilangan bulat — bedanya hanya pada <strong className="text-cyan-300">posisi koma yang harus disejajarkan</strong>. Ingat satu aturan emas: <strong className="text-yellow-300">koma di bawah koma, kolom per kolom, nol sebagai placeholder</strong>. Dengan disiplin dalam menyejajarkan koma, kamu tidak akan pernah salah!</>,
    tags: ["Sejajarkan Koma!", "Tambah Nol Placeholder", "Kolom Kanan ke Kiri", "Koma Hasil Sejajar", "Estimasi Kewajaran"] as string[],
    nextLabel: "🚀 Lanjut ke Perkalian dan Pembagian Desimal!",
    backBtn: "← Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "ADDITION AND SUBTRACTION OF DECIMALS",
    pageSubtitle: "Grade 7 – Rational Numbers",
    aH: "H", aT: "T", aO: "O", at: "t", ah: "h", am: "m",
    pvHeaders: ["Thousands","Hundreds","Tens","Ones","⟵ Dec. Point ⟶","Tenths","Hundredths","Thousandths"] as string[],
    pvAbbr: ["Th","H","T","O",".","t","h","m"] as string[],
    pvValues: ["1000","100","10","1","","0.1","0.01","0.001"] as string[],
    sec0Title: "Basic Concept: Decimal Place Value",
    sec0Intro: <>Before adding or subtracting, it is crucial to understand the <strong className="text-cyan-300">place value</strong> structure of decimals. Each digit has its own "position" that determines its value. The key rule: <strong className="text-yellow-300">the decimal point must always be aligned vertically!</strong></>,
    sec0Caption: <>Illustration: <InlineMath math="934{,}456 + 70{,}806" /></>,
    sec0Note1: <><strong className="text-green-300">thousandths (m)</strong>: 6 + 6 = 12 → write 2, carry 1 to the hundredths column</>,
    sec0Note2: <><strong className="text-cyan-300">tenths (t)</strong>: 4 + 8 = 12 → write 2, carry 1 to the ones column</>,
    sec0Note3: <><strong className="text-purple-300">tens (T)</strong>: 3 + 7 = 10 → write 0, carry 1 to the hundreds column</>,
    conclusionLabel: "Conclusion:",
    sec0Conclusion: <>When adding or subtracting decimals, align the decimal point in one vertical column so that thousands, hundreds, tens, ones, tenths, and so on are each in the correct column!</>,
    summaryLabel: "Key Summary",
    examplesLabel: "Examples and Solutions",
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    discuss: "✦ SOLUTION",
    ex: (n: number) => `Example ${n}`,
    step: (n: number) => `Step ${n}:`,
    sec1Header: "Addition of Decimals",
    sec1Summary: <>Adding decimal numbers is just as easy as adding whole numbers — the only trick is: always <strong className="text-green-300">align the decimal point vertically</strong>. That way, <strong className="text-yellow-300">tenths meet tenths, hundredths meet hundredths</strong>, and so on. If the number of decimal digits differs, just add zeros to make them the same length.</>,
    sec1StepsTitle: "Steps for Adding Decimals",
    sec1Steps: [
      { t: "Arrange numbers vertically", d: "Make sure the decimal point is in one column (aligned downward)." },
      { t: "Equalize decimal digit lengths", d: "Add 0 after the decimal for the number that has fewer decimal digits." },
      { t: "Add column by column", d: "Start from the rightmost column (thousandths), move left. If the result is ≥ 10, carry the tens digit to the next column." },
      { t: "Write the decimal point in the result", d: "The decimal point position in the result is exactly the same as in the problem." },
    ] as { t: string; d: string }[],
    s1e1Q: <>Find the sum of <InlineMath math="14{,}7 + 8{,}39" /></>,
    s1e1s1: <><strong>Step 1:</strong> Equalize decimal digits — <InlineMath math="14{,}7" /> becomes <InlineMath math="14{,}70" /> (add 1 zero)</>,
    s1e1s2: <><strong>Step 2:</strong> Arrange vertically with the decimal aligned, then add column by column:</>,
    s1e1s3: <><strong>Step 3:</strong> The decimal point stays in the same position in the result.</>,
    s1e1ans: <>∴ Therefore, the sum is <InlineMath math="23{,}09" /></>,
    s1e2Q: <>Find the sum of <InlineMath math="9{,}754 + 52{,}18" /></>,
    s1e2s1: <><strong>Step 1:</strong> <InlineMath math="52{,}18" /> has 2 decimal digits, <InlineMath math="9{,}754" /> has 3. Add 1 zero to <InlineMath math="52{,}18" /> → <InlineMath math="52{,}180" /></>,
    s1e2s2: <><strong>Step 2:</strong> Arrange vertically and calculate:</>,
    s1e2note: <>Thousandths: 4 + 0 = 4 &nbsp;|&nbsp; Hundredths: 5 + 8 = 13 (write 3, carry 1) &nbsp;|&nbsp; Tenths: 7 + 1 + 1 = 9</>,
    s1e2ans: <>∴ Therefore, the sum is <InlineMath math="61{,}934" /></>,
    s1e3Q: <>A road project needs 3 rolls of wire. The first roll is <InlineMath math="934{,}456" /> m long, the second is <InlineMath math="70{,}806" /> m long, and the third is <InlineMath math="8{,}34" /> m long. What is the total length of wire needed?</>,
    s1e3s1: <><strong>Step 1:</strong> Identify the numbers to be added:</>,
    s1e3katex1: "\\text{Total} = 934{,}456 + 70{,}806 + 8{,}34",
    s1e3s2: <><strong>Step 2:</strong> Equalize decimal digits — <InlineMath math="8{,}34" /> becomes <InlineMath math="8{,}340" /></>,
    s1e3s3: <><strong>Step 3:</strong> Arrange vertically and add:</>,
    s1e3ans: <>∴ Therefore, the total length of wire needed is <InlineMath math="1013{,}602" /> m</>,
    sec2Header: "Subtraction of Decimals",
    sec2Summary: <>Decimal subtraction works <strong className="text-red-300">exactly the same way as addition</strong>: align the decimal, equalize the decimal lengths by adding zeros. The difference is that when the top digit is smaller than the bottom digit, you need to <strong className="text-orange-300">borrow 1 from the column to the left</strong> (just like whole number subtraction).</>,
    sec2StepsTitle: "Steps for Subtracting Decimals",
    sec2Steps: [
      { t: "Arrange vertically, decimal aligned", d: "The minuend (number being subtracted from) is on top, the subtrahend is below." },
      { t: "Equalize decimal digit lengths", d: "Add zeros where needed so both numbers have the same number of decimal digits." },
      { t: "Subtract column by column from the right", d: "Start from the rightmost column. If the top digit < bottom digit, borrow 1 from the left column (top becomes +10)." },
      { t: "Write the decimal point in the same position", d: "The decimal point in the result aligns with the decimal points in the problem." },
    ] as { t: string; d: string }[],
    sec2Tip: <><strong>Tip:</strong> If the minuend has fewer decimal places (e.g., 467.8 being subtracted), write it with trailing zeros as needed. For example <InlineMath math="467{,}8" /> can be written as <InlineMath math="467{,}800" /> to have 3 decimal digits.</>,
    s2e1Q: <>Subtract <InlineMath math="23{,}5 - 7{,}25" /></>,
    s2e1s1: <><strong>Step 1:</strong> Equalize decimal digits — <InlineMath math="23{,}5" /> becomes <InlineMath math="23{,}50" /></>,
    s2e1ans: <>∴ Therefore, <InlineMath math="23{,}5 - 7{,}25 = 16{,}25" /></>,
    s2e2Q: <>Subtract <InlineMath math="84{,}937" /> from <InlineMath math="725{,}46" /></>,
    s2e2note: <><strong>Note:</strong> "Subtract A from B" means <InlineMath math="B - A" />, so the problem is: <InlineMath math="725{,}46 - 84{,}937" /></>,
    s2e2s1: <><strong>Step 1:</strong> Equalize decimal digits — <InlineMath math="725{,}46" /> becomes <InlineMath math="725{,}460" /></>,
    s2e2ans: <>∴ Therefore, the result is <InlineMath math="640{,}523" /></>,
    s2e3Q: <>Subtract <InlineMath math="89{,}276" /> from <InlineMath math="467{,}8" />. Then subtract the result by <InlineMath math="120{,}05" />. What is the final answer?</>,
    s2e3s1: <><strong>Step 1:</strong> First operation — <InlineMath math="467{,}8 - 89{,}276" /></>,
    s2e3s1b: <>Equalize decimal digits: <InlineMath math="467{,}8" /> → <InlineMath math="467{,}800" /></>,
    s2e3s2: <><strong>Step 2:</strong> Second operation — <InlineMath math="378{,}524 - 120{,}050" /></>,
    s2e3ans: <>∴ Therefore, the final result is <InlineMath math="258{,}474" /></>,
    sec3Header: "Combined Addition and Subtraction",
    sec3Summary: <>When a problem combines addition <strong className="text-cyan-300">and</strong> subtraction, remember the simple rule: <strong className="text-yellow-300">work from left to right</strong>. Addition and subtraction have the same priority level, so neither goes first — just follow the order they appear.</>,
    sec3Tip: <><strong>Efficient Method:</strong> You can also group all the positive (+) terms first, then subtract all the negative (−) terms from the total. The result will be the same!</>,
    s3e1Q: <>Calculate <InlineMath math="18{,}6 + 7{,}45 - 9{,}3" /></>,
    s3e1s0: <><strong>Work from left to right:</strong></>,
    s3e1s1: <><strong>Step 1:</strong> Calculate <InlineMath math="18{,}60 + 7{,}45" /> first:</>,
    s3e1s2: <><strong>Step 2:</strong> Continue with <InlineMath math="26{,}05 - 9{,}30" />:</>,
    s3e1ans: <>∴ Therefore, the result is <InlineMath math="16{,}75" /></>,
    s3e2Q: <>Calculate <InlineMath math="45{,}72 - 18{,}5 + 9{,}384 - 6{,}2" /></>,
    s3e2discuss: "✦ SOLUTION (Efficient Method)",
    s3e2note: "Group positive and negative terms separately:",
    s3e2posLabel: "To be added (+)",
    s3e2negLabel: "To be subtracted (−)",
    s3e2finalLabel: "Final result:",
    s3e2ans: <>∴ Therefore, the result is <InlineMath math="30{,}404" /></>,
    s3e3Q: <>Alex has a plot of land with an area of <InlineMath math="1250{,}75" /> m². He sells <InlineMath math="375{,}5" /> m² to his neighbor, then buys an additional <InlineMath math="128{,}25" /> m² of land. What is Alex's land area now?</>,
    s3e3s1: <><strong>Step 1:</strong> Set up the equation (selling = decrease, buying = increase):</>,
    s3e3katex1: "\\text{Area} = 1250{,}75 - 375{,}5 + 128{,}25",
    s3e3s2: <><strong>Step 2:</strong> Work from the left: <InlineMath math="1250{,}75 - 375{,}50" /></>,
    s3e3s3: <><strong>Step 3:</strong> Continue: <InlineMath math="875{,}25 + 128{,}25" /></>,
    s3e3ans: <>∴ Therefore, Alex's land area is now <InlineMath math="1003{,}5" /> m²</>,
    sumTitle: "➕➖ COMPLETE SUMMARY",
    sumSubtitle: "Addition & Subtraction of Decimals — Grade 7",
    sumSec1Label: "Rules for Adding & Subtracting Decimals",
    sumCards: [
      { label: "⭐ Rule #1: ALIGN THE DECIMAL POINT!", desc: "This is the most important rule! Ones column aligns, tenths align, hundredths align, and so on.", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "Add zeros if decimal lengths differ", desc: "5.3 + 2.45: change to 5.30 + 2.45 so columns align. Adding a trailing zero does not change the value!", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
      { label: "Work column by column from right to left", desc: "Same as whole numbers! Start from the rightmost column (smallest value), then go left. Remember to carry when ≥ 10.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Decimal point in result aligns with problem", desc: "After calculating, place the decimal directly below the aligned decimal points from step one.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
    ] as { label: string; desc: string; color: string }[],
    sumSec2Label: "Tips & Tricks",
    sumTips: [
      { icon: "📐", tip: "Always write in aligned column form", detail: "Writing 3.14 + 2.5 in one line often causes errors. Write in stacked columns — decimal below decimal!", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "0️⃣", tip: "Add zeros as placeholders", detail: "3.1 − 1.25 → change 3.1 to 3.10 first. A trailing zero doesn't change the value but helps with calculation!", color: "bg-sky-900/30 border-sky-500/30" },
      { icon: "🎯", tip: "Estimate first: how many digits before the decimal?", detail: "12.5 + 7.3 should be around 19 or 20. If you get 192 or 1.92 → the decimal point is in the wrong place!", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "✅", tip: "Check by reversing the order (commutative)", detail: "3.14 + 2.5 = 5.64. Check: 2.5 + 3.14 must also be 5.64. For subtraction: a − b + b = a.", color: "bg-indigo-900/30 border-indigo-500/30" },
    ] as { icon: string; tip: string; detail: string; color: string }[],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Adding and subtracting decimals is very similar to whole numbers — the only difference is that the <strong className="text-cyan-300">decimal point must be aligned</strong>. Remember the golden rule: <strong className="text-yellow-300">decimal below decimal, column by column, zeros as placeholders</strong>. With discipline in aligning the decimal point, you will never make a mistake!</>,
    tags: ["Align Decimal!", "Add Zero Placeholder", "Right to Left Columns", "Result Decimal Aligned", "Reasonableness Estimate"] as string[],
    nextLabel: "🚀 Continue to Decimal Multiplication and Division!",
    backBtn: "← Back to Rational Numbers",
  },
  ja: {
    pageTitle: "小数の加法と減法",
    pageSubtitle: "中学1年 – 有理数",
    aH: "百", aT: "十", aO: "一", at: "分", ah: "厘", am: "毛",
    pvHeaders: ["千の位","百の位","十の位","一の位","⟵ 小数点 ⟶","十分の一の位","百分の一の位","千分の一の位"] as string[],
    pvAbbr: ["千","百","十","一","・","分","厘","毛"] as string[],
    pvValues: ["1000","100","10","1","","0.1","0.01","0.001"] as string[],
    sec0Title: "基本概念：小数の位取り",
    sec0Intro: <>加法や減法を行う前に、小数の<strong className="text-cyan-300">位取り</strong>の構造を理解することがとても大切です。それぞれの数字には「位置」があり、その位置によって値が決まります。最も重要なルール：<strong className="text-yellow-300">小数点は必ず縦に揃えること！</strong></>,
    sec0Caption: <>計算例：<InlineMath math="934{,}456 + 70{,}806" /></>,
    sec0Note1: <><strong className="text-green-300">千分の一の位（毛）</strong>：6 + 6 = 12 → 2を書いて、1を百分の一の位に繰り上げ</>,
    sec0Note2: <><strong className="text-cyan-300">十分の一の位（分）</strong>：4 + 8 = 12 → 2を書いて、1を一の位に繰り上げ</>,
    sec0Note3: <><strong className="text-purple-300">十の位（十）</strong>：3 + 7 = 10 → 0を書いて、1を百の位に繰り上げ</>,
    conclusionLabel: "まとめ：",
    sec0Conclusion: <>小数の加法や減法では、小数点を同じ縦の列に揃えて、千の位・百の位・十の位・一の位・十分の一の位などがそれぞれ正しい列に来るようにしましょう！</>,
    summaryLabel: "要点まとめ",
    examplesLabel: "例題と解説",
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    discuss: "✦ 解説",
    ex: (n: number) => `例題 ${n}`,
    step: (n: number) => `手順 ${n}：`,
    sec1Header: "小数の加法",
    sec1Summary: <>小数の加法は整数の加法と同じくらい簡単です。コツはただ一つ：<strong className="text-green-300">小数点を常に縦に揃えること</strong>。そうすれば、<strong className="text-yellow-300">十分の一の位どうし、百分の一の位どうし</strong>が揃います。小数の桁数が違う場合は、0を補って桁数を合わせましょう。</>,
    sec1StepsTitle: "小数の加法の手順",
    sec1Steps: [
      { t: "数を縦に並べる", d: "小数点が同じ列（縦）に来るように揃える。" },
      { t: "小数の桁数を揃える", d: "桁数が少ない方の数の小数点以下に0を補って桁数を合わせる。" },
      { t: "右の列から順に足す", d: "一番右の列（千分の一の位）から始めて左へ進む。10以上になったら十の位を次の列に繰り上げる。" },
      { t: "結果に小数点を書く", d: "結果の小数点の位置は問題の小数点と全く同じ位置。" },
    ] as { t: string; d: string }[],
    s1e1Q: <><InlineMath math="14{,}7 + 8{,}39" /> の答えを求めなさい</>,
    s1e1s1: <><strong>手順1：</strong>小数の桁数を揃える — <InlineMath math="14{,}7" /> を <InlineMath math="14{,}70" /> にする（0を1つ補う）</>,
    s1e1s2: <><strong>手順2：</strong>小数点を揃えて縦に並べ、列ごとに計算する：</>,
    s1e1s3: <><strong>手順3：</strong>結果の小数点は同じ位置のまま。</>,
    s1e1ans: <>∴ よって、答えは <InlineMath math="23{,}09" /></>,
    s1e2Q: <><InlineMath math="9{,}754 + 52{,}18" /> の答えを求めなさい</>,
    s1e2s1: <><strong>手順1：</strong><InlineMath math="52{,}18" /> は小数2桁、<InlineMath math="9{,}754" /> は3桁。<InlineMath math="52{,}18" /> に0を1つ補う → <InlineMath math="52{,}180" /></>,
    s1e2s2: <><strong>手順2：</strong>縦に並べて計算：</>,
    s1e2note: <>千分の一の位：4 + 0 = 4 &nbsp;|&nbsp; 百分の一の位：5 + 8 = 13（3を書いて1繰り上げ）&nbsp;|&nbsp; 十分の一の位：7 + 1 + 1 = 9</>,
    s1e2ans: <>∴ よって、答えは <InlineMath math="61{,}934" /></>,
    s1e3Q: <>道路工事に針金が3巻き必要です。1巻き目は <InlineMath math="934{,}456" /> m、2巻き目は <InlineMath math="70{,}806" /> m、3巻き目は <InlineMath math="8{,}34" /> m です。針金の合計の長さは何mですか？</>,
    s1e3s1: <><strong>手順1：</strong>足す数を確認する：</>,
    s1e3katex1: "\\text{合計} = 934{,}456 + 70{,}806 + 8{,}34",
    s1e3s2: <><strong>手順2：</strong>小数の桁数を揃える — <InlineMath math="8{,}34" /> を <InlineMath math="8{,}340" /> にする</>,
    s1e3s3: <><strong>手順3：</strong>縦に並べて計算する：</>,
    s1e3ans: <>∴ よって、必要な針金の合計の長さは <InlineMath math="1013{,}602" /> m</>,
    sec2Header: "小数の減法",
    sec2Summary: <>小数の減法の原理は<strong className="text-red-300">加法と全く同じ</strong>です：小数点を揃えて、0を補って桁数を揃えましょう。違いは、上の数が下の数より小さいとき、<strong className="text-orange-300">左の列から1借りる</strong>必要があることです（整数の引き算と全く同じです）。</>,
    sec2StepsTitle: "小数の減法の手順",
    sec2Steps: [
      { t: "縦に並べて小数点を揃える", d: "引かれる数（大きい方）を上に、引く数を下に書く。" },
      { t: "小数の桁数を揃える", d: "小数の桁数が少ない方に0を補って桁数を合わせる。" },
      { t: "右の列から順に引く", d: "一番右の列から始める。上の数が下の数より小さいとき、左の列から1借りる（上の数が+10になる）。" },
      { t: "同じ位置に小数点を書く", d: "結果の小数点は問題の小数点と同じ位置に揃える。" },
    ] as { t: string; d: string }[],
    sec2Tip: <><strong>ヒント：</strong>引かれる数の小数桁数が少ない場合（例：467.8から引く）、必要に応じて0を補って書けます。例えば <InlineMath math="467{,}8" /> を <InlineMath math="467{,}800" /> と書いて小数3桁にできます。</>,
    s2e1Q: <><InlineMath math="23{,}5 - 7{,}25" /> を計算しなさい</>,
    s2e1s1: <><strong>手順1：</strong>小数の桁数を揃える — <InlineMath math="23{,}5" /> を <InlineMath math="23{,}50" /> にする</>,
    s2e1ans: <>∴ よって、<InlineMath math="23{,}5 - 7{,}25 = 16{,}25" /></>,
    s2e2Q: <><InlineMath math="725{,}46" /> から <InlineMath math="84{,}937" /> を引きなさい</>,
    s2e2note: <><strong>注意：</strong>「AからBを引く」は <InlineMath math="A - B" /> を意味するので、計算は <InlineMath math="725{,}46 - 84{,}937" /></>,
    s2e2s1: <><strong>手順1：</strong>小数の桁数を揃える — <InlineMath math="725{,}46" /> を <InlineMath math="725{,}460" /> にする</>,
    s2e2ans: <>∴ よって、答えは <InlineMath math="640{,}523" /></>,
    s2e3Q: <><InlineMath math="467{,}8" /> から <InlineMath math="89{,}276" /> を引き、さらにその結果から <InlineMath math="120{,}05" /> を引きなさい。最終的な答えは何ですか？</>,
    s2e3s1: <><strong>手順1：</strong>1回目の計算 — <InlineMath math="467{,}8 - 89{,}276" /></>,
    s2e3s1b: <>小数の桁数を揃える：<InlineMath math="467{,}8" /> → <InlineMath math="467{,}800" /></>,
    s2e3s2: <><strong>手順2：</strong>2回目の計算 — <InlineMath math="378{,}524 - 120{,}050" /></>,
    s2e3ans: <>∴ よって、最終的な答えは <InlineMath math="258{,}474" /></>,
    sec3Header: "加法と減法の組み合わせ",
    sec3Summary: <>加法と減法が<strong className="text-cyan-300">同時に</strong>混ざっている式では、シンプルなルールを覚えましょう：<strong className="text-yellow-300">左から右へ順番に計算する</strong>。加法と減法は同じ優先順位なので、どちらが先ということはありません — 書いてある順番通りに計算すればよいのです。</>,
    sec3Tip: <><strong>効率的な方法：</strong>正の数（+）をすべて先にまとめてから、負の数（−）をすべてその合計から引くこともできます。結果は同じになります！</>,
    s3e1Q: <><InlineMath math="18{,}6 + 7{,}45 - 9{,}3" /> を計算しなさい</>,
    s3e1s0: <><strong>左から右へ計算する：</strong></>,
    s3e1s1: <><strong>手順1：</strong>まず <InlineMath math="18{,}60 + 7{,}45" /> を計算する：</>,
    s3e1s2: <><strong>手順2：</strong>続いて <InlineMath math="26{,}05 - 9{,}30" /> を計算する：</>,
    s3e1ans: <>∴ よって、答えは <InlineMath math="16{,}75" /></>,
    s3e2Q: <><InlineMath math="45{,}72 - 18{,}5 + 9{,}384 - 6{,}2" /> を計算しなさい</>,
    s3e2discuss: "✦ 解説（効率的な方法）",
    s3e2note: "正の数と負の数をそれぞれまとめる：",
    s3e2posLabel: "足す数（+）",
    s3e2negLabel: "引く数（−）",
    s3e2finalLabel: "最終結果：",
    s3e2ans: <>∴ よって、答えは <InlineMath math="30{,}404" /></>,
    s3e3Q: <>Alexは <InlineMath math="1250{,}75" /> m²の土地を持っています。隣人に <InlineMath math="375{,}5" /> m²を売り、その後 <InlineMath math="128{,}25" /> m²の土地を購入しました。Alexの土地の面積は今何m²ですか？</>,
    s3e3s1: <><strong>手順1：</strong>式を立てる（売る＝減少、買う＝増加）：</>,
    s3e3katex1: "\\text{面積} = 1250{,}75 - 375{,}5 + 128{,}25",
    s3e3s2: <><strong>手順2：</strong>左から計算：<InlineMath math="1250{,}75 - 375{,}50" /></>,
    s3e3s3: <><strong>手順3：</strong>続き：<InlineMath math="875{,}25 + 128{,}25" /></>,
    s3e3ans: <>∴ よって、Alexの土地の面積は <InlineMath math="1003{,}5" /> m²</>,
    sumTitle: "➕➖ まとめ",
    sumSubtitle: "小数の加法と減法 — 中学1年",
    sumSec1Label: "小数の加法・減法のルール",
    sumCards: [
      { label: "⭐ ルール1：小数点を揃えること！", desc: "これが最も重要なルールです！一の位を揃え、十分の一の位を揃え、百分の一の位を揃える、というようにします。", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "小数の桁数が違うときは0を補う", desc: "5.3 + 2.45：5.30 + 2.45 にして列を揃える。末尾に0を加えても値は変わりません！", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
      { label: "右から左へ、列ごとに計算する", desc: "整数と同じです！右端（最も小さい値）の列から始めて左へ。10以上になったら繰り上げを忘れずに。", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "結果の小数点は問題と同じ位置に", desc: "計算後、第一手順で揃えた小数点の真下に小数点を置く。", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
    ] as { label: string; desc: string; color: string }[],
    sumSec2Label: "コツとテクニック",
    sumTips: [
      { icon: "📐", tip: "常に縦に揃えて書く", detail: "3.14 + 2.5 を横書きにすると間違えやすい。縦に並べて書く — 小数点の下に小数点！", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "0️⃣", tip: "プレースホルダーとして0を補う", detail: "3.1 − 1.25 → まず3.1を3.10にする。末尾の0は値を変えないが計算に役立つ！", color: "bg-sky-900/30 border-sky-500/30" },
      { icon: "🎯", tip: "まず見積もる：小数点の前は何桁？", detail: "12.5 + 7.3 は約19か20のはず。192や1.92になったら → 小数点の位置が間違っている！", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "✅", tip: "順序を入れ替えて確認する（交換法則）", detail: "3.14 + 2.5 = 5.64。確認：2.5 + 3.14 も5.64になるはず。減法は a − b + b = a で確認。", color: "bg-indigo-900/30 border-indigo-500/30" },
    ] as { icon: string; tip: string; detail: string; color: string }[],
    conclusionTitle: "まとめ",
    conclusionBody: <>小数の加法と減法は整数の計算とよく似ています — 違いは<strong className="text-cyan-300">小数点を揃えること</strong>だけです。黄金ルールを覚えましょう：<strong className="text-yellow-300">小数点の下に小数点、列ごとに計算、0でプレースホルダー</strong>。小数点を揃える習慣をつければ、絶対に間違えません！</>,
    tags: ["小数点を揃える！", "0でプレースホルダー", "右から左へ列ごと", "結果の小数点揃え", "見積もりで確認"] as string[],
    nextLabel: "🚀 次は小数の乗法と除法へ進もう！",
    backBtn: "← 有理数に戻る",
  },
};

const PenjumlahanPenguranganBentukDesimalPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    playPopSound();
    setActiveSection(activeSection === index ? null : index);
  };

  const ColTable = ({
    rows,
    operator,
    result,
  }: {
    rows: string[][];
    operator: string;
    result: string[];
  }) => {
    const headers = [t.aH, t.aT, t.aO, "", t.at, t.ah, t.am];
    return (
      <div className="overflow-x-auto">
        <table className="mx-auto font-mono text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <td className="w-6" />
              {headers.map((h, i) =>
                h === "" ? (
                  <td key={i} className="w-4 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                ) : (
                  <td key={i} className="w-8 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td className="text-right pr-1 text-white/50 text-xs w-6">
                  {ri === rows.length - 1 ? operator : ""}
                </td>
                {row.map((cell, ci) =>
                  ci === 3 ? (
                    <td key={ci} className="w-4 text-center text-yellow-400 font-bold">,</td>
                  ) : (
                    <td key={ci} className="w-8 text-center text-white px-1">{cell}</td>
                  )
                )}
              </tr>
            ))}
            <tr>
              <td />
              <td colSpan={8} className="pt-0">
                <div className="border-t-2 border-white/40 my-1" />
              </td>
            </tr>
            <tr>
              <td className="text-right pr-1 text-primary text-xs">=</td>
              {result.map((cell, ci) =>
                ci === 3 ? (
                  <td key={ci} className="w-4 text-center text-yellow-400 font-bold">,</td>
                ) : (
                  <td key={ci} className="w-8 text-center text-primary font-bold px-1">{cell}</td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-4xl w-full px-4 py-10">

        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-4 font-body">
          {t.pageSubtitle}
        </p>

        {/* Konsep Awal: Nilai Tempat */}
        <div className="mb-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="font-display text-sm font-bold text-cyan-300">{t.sec0Title}</h2>
          </div>
          <p className="font-body text-sm text-white/80 leading-relaxed mb-4">
            {t.sec0Intro}
          </p>

          {/* Tabel Nilai Tempat */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-center text-xs font-body border-separate border-spacing-1">
              <thead>
                <tr>
                  {t.pvHeaders.map((h, i) => (
                    <th key={i} className={`px-2 py-2 rounded-lg font-semibold ${
                      i === 4 ? "text-yellow-300 bg-yellow-500/10" :
                      i < 4 ? "text-blue-300 bg-blue-500/10" :
                      "text-green-300 bg-green-500/10"
                    }`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {t.pvAbbr.map((v, i) => (
                    <td key={i} className={`px-2 py-2 font-mono font-bold text-base rounded ${
                      i === 4 ? "text-yellow-400" :
                      i < 4 ? "text-blue-200" :
                      "text-green-200"
                    }`}>{v}</td>
                  ))}
                </tr>
                <tr>
                  {t.pvValues.map((v, i) => (
                    <td key={i} className="px-2 py-1 text-white/50 text-xs">{v}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ilustrasi 934,456 + 70,806 */}
          <div className="bg-black/30 rounded-xl p-4">
            <p className="font-body text-xs text-white/60 mb-3 text-center">
              {t.sec0Caption}
            </p>
            <div className="overflow-x-auto">
              <table className="mx-auto font-mono text-sm border-separate border-spacing-0">
                <thead>
                  <tr>
                    <td className="w-6" />
                    {[t.aH, t.aT, t.aO, "", t.at, t.ah, t.am].map((h, i) => h === ""
                      ? <td key={i} className="w-6 text-center text-yellow-400 font-bold text-xs">,</td>
                      : <td key={i} className="w-8 text-center text-white/40 text-xs font-body">{h}</td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td />
                    {["9","3","4","","4","5","6"].map((c, i) => c === ""
                      ? <td key={i} className="text-center text-yellow-400 font-bold">,</td>
                      : <td key={i} className="text-center text-white px-1">{c}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-right pr-1 text-white/50 text-xs">+</td>
                    {["","7","0","","8","0","6"].map((c, i) => c === "" && i === 0
                      ? <td key={i} className="text-center px-1" />
                      : c === "" && i === 3
                        ? <td key={i} className="text-center text-yellow-400 font-bold">,</td>
                        : <td key={i} className="text-center text-white px-1">{c}</td>
                    )}
                  </tr>
                  <tr>
                    <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1" /></td>
                  </tr>
                  <tr>
                    <td className="text-right pr-1 text-primary text-xs">=</td>
                    {["1","0","0","","2","6","2"].map((c, i) => c === ""
                      ? <td key={i} className="text-center text-yellow-400 font-bold">,</td>
                      : <td key={i} className="text-center text-primary font-bold px-1">{c}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-1 text-xs text-white/60 font-body">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                <p>{t.sec0Note1}</p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                <p>{t.sec0Note2}</p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                <p>{t.sec0Note3}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="font-body text-xs text-yellow-200 leading-relaxed">
              <strong>{t.conclusionLabel}</strong> {t.sec0Conclusion}
            </p>
          </div>
        </div>

        {/* ===================== SUB-BAB 1: PENJUMLAHAN ===================== */}
        <div className="mb-6 animate-slide-up">
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Plus className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec1Header}</span>
          </div>

          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-green-500/20 rounded-xl px-5 py-6 space-y-5 animate-slide-up">

              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl p-4">
                <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="font-body text-sm text-white/90 leading-relaxed">
                  {t.sec1Summary}
                </p>
              </div>

              {/* Langkah-Langkah */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {t.sec1StepsTitle}
                </h4>
                <div className="space-y-2">
                  {t.sec1Steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="bg-purple-500/30 text-purple-300 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <div>
                        <p className="font-body text-sm text-white font-semibold">{step.t}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTOH SOAL */}
              <div className="border-t border-white/10 pt-4">
                <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesLabel}
                </p>

                {/* ---- MUDAH ---- */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/40">{t.badgeEasy}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(1)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">{t.s1e1Q}</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s1e1s1}</p>
                    <p className="font-body text-sm text-white/80">{t.s1e1s2}</p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aT, t.aO, "", t.at, t.ah].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["1","4","","7","0"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">+</td>
                              {["","8","","3","9"].map((c, i) => i === 0
                                ? <td key={i} className="w-9 text-center px-1 text-white/30">—</td>
                                : c === ""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={6}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-green-400 text-sm font-bold">=</td>
                              {["2","3","","0","9"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-green-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80">{t.s1e1s3}</p>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="14{,}7 + 8{,}39 = 23{,}09" />
                    </div>
                    <p className="text-green-400 font-semibold font-body text-sm">{t.s1e1ans}</p>
                  </div>
                </div>

                {/* ---- SEDANG ---- */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/40">{t.badgeMedium}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(2)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">{t.s1e2Q}</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s1e2s1}</p>
                    <p className="font-body text-sm text-white/80">{t.s1e2s2}</p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aT, t.aO, "", t.at, t.ah, t.am].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["","9","","7","5","4"].map((c, i) => i === 0
                                ? <td key={i} className="w-9 text-center text-white/30 px-1">—</td>
                                : c === ""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">+</td>
                              {["5","2","","1","8","0"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={7}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-yellow-400 text-sm font-bold">=</td>
                              {["6","1","","9","3","4"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-yellow-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/70 italic">{t.s1e2note}</p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="9{,}754 + 52{,}18 = 61{,}934" />
                    </div>
                    <p className="text-yellow-400 font-semibold font-body text-sm">{t.s1e2ans}</p>
                  </div>
                </div>

                {/* ---- SULIT ---- */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/40">{t.badgeHard}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(3)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s1e3Q}</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s1e3s1}</p>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <BlockMath math={t.s1e3katex1} />
                    </div>
                    <p className="font-body text-sm text-white/80">{t.s1e3s2}</p>
                    <p className="font-body text-sm text-white/80">{t.s1e3s3}</p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aH, t.aT, t.aO, "", t.at, t.ah, t.am].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ["9","3","4","","4","5","6"],
                              ["-","7","0","","8","0","6"],
                              ["-","-","8","","3","4","0"],
                            ].map((row, ri) => (
                              <tr key={ri}>
                                <td className="text-right pr-1 text-white/50 text-xs">{ri === 2 ? "+" : ""}</td>
                                {row.map((c, i) => c === ""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : c === "-"
                                    ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                    : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                                )}
                              </tr>
                            ))}
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-red-400 text-sm font-bold">=</td>
                              {["1","0","1","","6","0","2"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-red-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="934{,}456 + 70{,}806 + 8{,}340 = 1013{,}602" />
                    </div>
                    <p className="text-red-400 font-semibold font-body text-sm">{t.s1e3ans}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================== SUB-BAB 2: PENGURANGAN ===================== */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Minus className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec2Header}</span>
          </div>

          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-red-500/20 rounded-xl px-5 py-6 space-y-5 animate-slide-up">

              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4">
                <h3 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="font-body text-sm text-white/90 leading-relaxed">
                  {t.sec2Summary}
                </p>
              </div>

              {/* Langkah-Langkah */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <h4 className="text-orange-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {t.sec2StepsTitle}
                </h4>
                <div className="space-y-2">
                  {t.sec2Steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="bg-orange-500/30 text-orange-300 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <div>
                        <p className="font-body text-sm text-white font-semibold">{step.t}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-cyan-200 leading-relaxed">{t.sec2Tip}</p>
              </div>

              {/* CONTOH SOAL */}
              <div className="border-t border-white/10 pt-4">
                <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesLabel}
                </p>

                {/* ---- MUDAH ---- */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/40">{t.badgeEasy}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(1)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">{t.s2e1Q}</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s2e1s1}</p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aT, t.aO, "", t.at, t.ah].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["2","3","","5","0"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["","7","","2","5"].map((c, i) => i === 0
                                ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                : c === ""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={6}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-green-400 text-sm font-bold">=</td>
                              {["1","6","","2","5"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-green-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="23{,}50 - 7{,}25 = 16{,}25" />
                    </div>
                    <p className="text-green-400 font-semibold font-body text-sm">{t.s2e1ans}</p>
                  </div>
                </div>

                {/* ---- SEDANG ---- */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/40">{t.badgeMedium}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(2)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">{t.s2e2Q}</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s2e2note}</p>
                    <p className="font-body text-sm text-white/80">{t.s2e2s1}</p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aH, t.aT, t.aO, "", t.at, t.ah, t.am].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["7","2","5","","4","6","0"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["-","8","4","","9","3","7"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c === "-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-yellow-400 text-sm font-bold">=</td>
                              {["6","4","0","","5","2","3"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-yellow-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="725{,}460 - 84{,}937 = 640{,}523" />
                    </div>
                    <p className="text-yellow-400 font-semibold font-body text-sm">{t.s2e2ans}</p>
                  </div>
                </div>

                {/* ---- SULIT ---- */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/40">{t.badgeHard}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(3)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s2e3Q}</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s2e3s1}</p>
                    <p className="font-body text-sm text-white/80">{t.s2e3s1b}</p>
                    <div className="bg-black/40 rounded-xl p-4 my-1">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aH, t.aT, t.aO, "", t.at, t.ah, t.am].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["4","6","7","","8","0","0"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["-","8","9","","2","7","6"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c === "-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-orange-400 text-sm font-bold">=</td>
                              {["3","7","8","","5","2","4"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-orange-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80">{t.s2e3s2}</p>
                    <div className="bg-black/40 rounded-xl p-4 my-1">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aH, t.aT, t.aO, "", t.at, t.ah, t.am].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["3","7","8","","5","2","4"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["1","2","0","","0","5","0"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-red-400 text-sm font-bold">=</td>
                              {["2","5","8","","4","7","4"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-red-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="467{,}800 - 89{,}276 = 378{,}524" />
                      <BlockMath math="378{,}524 - 120{,}050 = 258{,}474" />
                    </div>
                    <p className="text-red-400 font-semibold font-body text-sm">{t.s2e3ans}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================== SUB-BAB 3: GABUNGAN ===================== */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Calculator className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec3Header}</span>
          </div>

          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-cyan-500/20 rounded-xl px-5 py-6 space-y-5 animate-slide-up">

              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4">
                <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="font-body text-sm text-white/90 leading-relaxed">
                  {t.sec3Summary}
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-blue-200 leading-relaxed">{t.sec3Tip}</p>
              </div>

              {/* CONTOH SOAL */}
              <div className="border-t border-white/10 pt-4">
                <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesLabel}
                </p>

                {/* ---- MUDAH ---- */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/40">{t.badgeEasy}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(1)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">{t.s3e1Q}</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s3e1s0}</p>
                    <p className="font-body text-sm text-white/80">{t.s3e1s1}</p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="18{,}60 + 7{,}45 = 26{,}05" />
                    </div>
                    <p className="font-body text-sm text-white/80">{t.s3e1s2}</p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="26{,}05 - 9{,}30 = 16{,}75" />
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="18{,}6 + 7{,}45 - 9{,}3 = 16{,}75" />
                    </div>
                    <p className="text-green-400 font-semibold font-body text-sm">{t.s3e1ans}</p>
                  </div>
                </div>

                {/* ---- SEDANG ---- */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/40">{t.badgeMedium}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(2)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">{t.s3e2Q}</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-400 tracking-wider">{t.s3e2discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s3e2note}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                        <p className="font-body text-xs text-green-400 mb-1">{t.s3e2posLabel}</p>
                        <BlockMath math="45{,}720 + 9{,}384 = 55{,}104" />
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                        <p className="font-body text-xs text-red-400 mb-1">{t.s3e2negLabel}</p>
                        <BlockMath math="18{,}500 + 6{,}200 = 24{,}700" />
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80"><strong>{t.s3e2finalLabel}</strong></p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="55{,}104 - 24{,}700 = 30{,}404" />
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="45{,}72 - 18{,}5 + 9{,}384 - 6{,}2 = 30{,}404" />
                    </div>
                    <p className="text-yellow-400 font-semibold font-body text-sm">{t.s3e2ans}</p>
                  </div>
                </div>

                {/* ---- SULIT ---- */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/40">{t.badgeHard}</span>
                    <span className="font-body font-semibold text-white text-sm">{t.ex(3)}</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s3e3Q}</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-400 tracking-wider">{t.discuss}</p>
                    <p className="font-body text-sm text-white/80">{t.s3e3s1}</p>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <BlockMath math={t.s3e3katex1} />
                    </div>
                    <p className="font-body text-sm text-white/80">{t.s3e3s2}</p>
                    <div className="bg-black/40 rounded-xl p-4">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {[t.aH, t.aT, t.aO, "", t.at, t.ah].map((h, i) => h === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["1","2","5","0","","7","5"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["-","3","7","5","","5","0"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c === "-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-orange-400 text-sm font-bold">=</td>
                              {["-","8","7","5","","2","5"].map((c, i) => c === ""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c === "-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-orange-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80">{t.s3e3s3}</p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="875{,}25 + 128{,}25 = 1003{,}50" />
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="1250{,}75 - 375{,}50 + 128{,}25 = 1003{,}50" />
                    </div>
                    <p className="text-red-400 font-semibold font-body text-sm">{t.s3e3ans}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[10px]">1</span>
                {t.sumSec1Label}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {t.sumCards.map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div>
                      <p className="font-body text-xs font-bold">{label}</p>
                      <p className="font-body text-xs text-white/65 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                {t.sumSec2Label}
              </p>
              <div className="space-y-2">
                {t.sumTips.map(({ icon, tip, detail, color }) => (
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

            <div className="bg-gradient-to-br from-cyan-500/20 via-sky-500/15 to-blue-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">💧</div>
              <p className="font-display text-base font-bold text-white">{t.conclusionTitle}</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {t.conclusionBody}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {t.tags.map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{t.nextLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-rasional"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanPenguranganBentukDesimalPage;
