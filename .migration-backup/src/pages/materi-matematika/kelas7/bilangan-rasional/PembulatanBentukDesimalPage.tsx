import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, AlertCircle, Target, Hash, Circle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PEMBULATAN BENTUK DESIMAL",
    pageSubtitle: "Kelas 7 - Bilangan Rasional",
    summaryLabel: "Ringkasan Intisari",
    tipsLabel: "Tips Penting",
    discuss: "Pembahasan:",
    answer: "Jawaban:",
    step: (n: number) => `Langkah ${n}:`,
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    ex: (n: number) => `Contoh Soal ${n}`,

    sec1Title: "Aturan Dasar Pembulatan Desimal",
    sec1Summary: <><strong>Pembulatan desimal</strong> adalah teknik menyederhanakan angka desimal ke jumlah tempat tertentu. Konsepnya sederhana: lihat angka di belakang posisi yang ingin kamu bulatkan. Jika angka itu <strong>5 atau lebih</strong>, bulatkan ke atas (tambah 1). Kalau <strong>kurang dari 5</strong>, cukup hilangkan saja angka sisanya!</>,
    sec1IllusTitle: "Ilustrasi Pembulatan:",
    sec1IllusCaption: "Contoh: Panjang pensil 9,59 cm dibulatkan menjadi 9,6 cm (karena 9 > 5)",
    sec1RuleTitle: "Aturan Pembulatan:",
    sec1Up: <>Angka {">="} 5</>,
    sec1UpLabel: "Bulatkan ke atas!",
    sec1UpDesc: "Angka di depannya bertambah 1",
    sec1Down: <>Angka {"<"} 5</>,
    sec1DownLabel: "Bulatkan ke bawah!",
    sec1DownDesc: "Angka di depannya tetap (tidak berubah)",
    sec1PosTitle: "Cara Menentukan Posisi Pembulatan:",
    sec1Pos1: <><strong className="text-orange-200">1 desimal:</strong> Lihat angka desimal ke-2</>,
    sec1Pos2: <><strong className="text-orange-200">2 desimal:</strong> Lihat angka desimal ke-3</>,
    sec1Pos3: <><strong className="text-orange-200">3 desimal:</strong> Lihat angka desimal ke-4</>,
    sec1PosEtc: "...dan seterusnya!",
    sec1Tips: [
      "Selalu tentukan dulu: mau dibulatkan sampai berapa desimal?",
      <>Cek angka <strong>tepat setelah</strong> posisi pembulatan</>,
      "Ingat: 5 itu batas! Angka 5, 6, 7, 8, 9 = bulatkan ke atas",
    ],

    ex1Q: <>Bulatkan <InlineMath math="4,638" /> sampai <strong>satu desimal</strong></>,
    ex1s1: "Identifikasi angka yang akan dibulatkan",
    ex1s1desc: <><InlineMath math="4,\underline{6}38" /> - Angka 6 adalah desimal ke-1 (yang akan dipertahankan)</>,
    ex1s2: "Lihat angka desimal ke-2 (setelah posisi pembulatan)",
    ex1s2desc: <>Angka desimal ke-2 adalah <InlineMath math="3" /> (kurang dari 5)</>,
    ex1s3: <>Karena 3 {"<"} 5, maka angka 6 <strong>tetap</strong></>,
    ex1s3desc: "Angka setelahnya dihilangkan",

    ex2Q: <>Bulatkan <InlineMath math="5,70642" /> sampai <strong>dua desimal</strong></>,
    ex2s1: "Identifikasi angka yang akan dibulatkan",
    ex2s1desc: <><InlineMath math="5,7\underline{0}642" /> - Angka 0 adalah desimal ke-2 (yang akan dipertahankan)</>,
    ex2s2: "Lihat angka desimal ke-3 (setelah posisi pembulatan)",
    ex2s2desc: <>Angka desimal ke-3 adalah <InlineMath math="6" /> (lebih dari 5)</>,
    ex2s3: <>Karena 6 {">="} 5, maka angka 0 <strong>bertambah 1</strong></>,
    ex2s3desc: <><InlineMath math="0 + 1 = 1" />, jadi hasilnya adalah 5,71</>,

    ex3Q: <>Bulatkan <InlineMath math="7,638524" /> sampai <strong>tiga desimal</strong></>,
    ex3s1: "Identifikasi angka yang akan dibulatkan",
    ex3s1desc: <><InlineMath math="7,63\underline{8}524" /> - Angka 8 adalah desimal ke-3 (yang akan dipertahankan)</>,
    ex3s2: "Lihat angka desimal ke-4 (setelah posisi pembulatan)",
    ex3s2desc: <>Angka desimal ke-4 adalah <InlineMath math="5" /> (sama dengan 5)</>,
    ex3s3: <>Karena 5 {">="} 5, maka angka 8 <strong>bertambah 1</strong></>,
    ex3s3desc: <><InlineMath math="8 + 1 = 9" />, jadi hasilnya adalah 7,639</>,

    sec2Title: "Pembulatan ke Bilangan Satuan",
    sec2Summary: <>Kadang kita butuh bilangan bulat, bukan desimal. Nah, <strong>pembulatan ke bilangan satuan</strong> akan mengubah angka desimal menjadi bilangan bulat terdekat. Caranya sama: lihat angka desimal pertama (angka persepuluhan). Jika <strong>5 atau lebih</strong>, satuan naik 1. Kalau <strong>kurang dari 5</strong>, satuan tetap!</>,
    sec2RuleTitle: "Aturan Pembulatan ke Satuan:",
    sec2UpLabel: <>Persepuluhan {">="} 5</>,
    sec2UpText: "Satuan bertambah 1",
    sec2UpDesc: "Semua angka desimal dihilangkan",
    sec2DownLabel: <>Persepuluhan {"<"} 5</>,
    sec2DownText: "Satuan tetap",
    sec2DownDesc: "Semua angka desimal dihilangkan",
    sec2Tips: [
      "Perhatikan angka desimal ke-1 saja (angka persepuluhan)",
      "Pembulatan ke satuan = pembulatan ke 0 desimal",
      "Hasil akhir selalu bilangan bulat tanpa koma",
    ],

    ex4Q: <>Bulatkan <InlineMath math="111,48" /> ke bilangan satuan terdekat</>,
    ex4s1: "Identifikasi angka satuan dan persepuluhan",
    ex4s1desc: <><InlineMath math="11\underline{1},48" /> - Satuan = 1, Persepuluhan = 4</>,
    ex4s2: "Cek angka persepuluhan",
    ex4s2desc: <>Angka persepuluhan adalah <InlineMath math="4" /> (kurang dari 5)</>,
    ex4s3: <>Karena 4 {"<"} 5, maka angka satuan <strong>tetap</strong></>,
    ex4s3desc: "Semua angka desimal dihilangkan",

    ex5Q: <>Bulatkan <InlineMath math="613,54" /> ke bilangan satuan terdekat</>,
    ex5s1: "Identifikasi angka satuan dan persepuluhan",
    ex5s1desc: <><InlineMath math="61\underline{3},54" /> - Satuan = 3, Persepuluhan = 5</>,
    ex5s2: "Cek angka persepuluhan",
    ex5s2desc: <>Angka persepuluhan adalah <InlineMath math="5" /> (sama dengan 5)</>,
    ex5s3: <>Karena 5 {">="} 5, maka angka satuan <strong>bertambah 1</strong></>,
    ex5s3desc: <><InlineMath math="3 + 1 = 4" />, jadi hasilnya adalah 614</>,

    ex6Q: <>Bulatkan <InlineMath math="319,837" /> ke bilangan satuan terdekat</>,
    ex6s1: "Identifikasi angka satuan dan persepuluhan",
    ex6s1desc: <><InlineMath math="31\underline{9},837" /> - Satuan = 9, Persepuluhan = 8</>,
    ex6s2: "Cek angka persepuluhan",
    ex6s2desc: <>Angka persepuluhan adalah <InlineMath math="8" /> (lebih dari 5)</>,
    ex6s3: <>Karena 8 {">="} 5, maka angka satuan <strong>bertambah 1</strong></>,
    ex6s3desc: <><InlineMath math="9 + 1 = 10" />, karena hasilnya 10, maka puluhan juga ikut berubah</>,
    ex6s4: "Perhitungan lanjutan",
    ex6s4desc: <><InlineMath math="319 + 1 = 320" /></>,

    sec3Title: "Aplikasi Pembulatan dalam Kehidupan",
    sec3Summary: <>Pembulatan bukan cuma soal matematika di kelas! Dalam kehidupan sehari-hari, pembulatan sering digunakan untuk <strong>memperkirakan harga</strong>, <strong>mengukur jarak</strong>, <strong>menghitung waktu</strong>, dan banyak lagi. Dengan pembulatan, angka jadi lebih mudah dipahami dan dikomunikasikan!</>,
    sec3UsageTitle: "Contoh Penggunaan Sehari-hari:",
    usage: [
      { title: "Belanja", desc: "Total belanja Rp 49.750 dibulatkan jadi Rp 50.000" },
      { title: "Jarak", desc: "Jarak 12,3 km dibulatkan jadi \"sekitar 12 km\"" },
      { title: "Berat Badan", desc: "Berat 65,7 kg sering disebut \"sekitar 66 kg\"" },
      { title: "Waktu", desc: "Perjalanan 2 jam 45 menit = \"sekitar 3 jam\"" },
    ],
    sec3Tips: [
      "Tentukan tingkat ketelitian yang dibutuhkan",
      "Untuk estimasi kasar, bulatkan ke satuan atau puluhan",
      "Untuk perhitungan detail (sains/keuangan), pertahankan lebih banyak desimal",
    ],

    ex7Q: <>Suhu ruangan tercatat <InlineMath math="25,48°C" />. Bulatkan suhu tersebut ke satu desimal untuk laporan harian!</>,
    ex7s1: "Identifikasi angka yang akan dibulatkan",
    ex7s1desc: <><InlineMath math="25,\underline{4}8°C" /> - Angka 4 adalah desimal ke-1</>,
    ex7s2: "Lihat angka desimal ke-2",
    ex7s2desc: <>Angka desimal ke-2 adalah <InlineMath math="8" /> (lebih dari 5)</>,
    ex7s3: <>Karena 8 {">="} 5, maka 4 bertambah 1</>,
    ex7s3desc: <><InlineMath math="4 + 1 = 5" /></>,
    ex7ans: <>Suhu ruangan <InlineMath math="= 25,5°C" /></>,

    ex8Q: <>Seorang atlet berlari sejauh <InlineMath math="10,473" /> km dalam latihan maraton. Untuk catatan pribadi, ia ingin membulatkan jarak tersebut ke dua desimal. Berapa jarak yang dicatat?</>,
    ex8s1: "Identifikasi angka yang akan dibulatkan",
    ex8s1desc: <><InlineMath math="10,4\underline{7}3" /> km - Angka 7 adalah desimal ke-2</>,
    ex8s2: "Lihat angka desimal ke-3",
    ex8s2desc: <>Angka desimal ke-3 adalah <InlineMath math="3" /> (kurang dari 5)</>,
    ex8s3: <>Karena 3 {"<"} 5, maka 7 tetap</>,
    ex8s3desc: "Angka 3 dihilangkan",
    ex8ans: <>Jarak yang dicatat <InlineMath math="= 10,47" /> km</>,

    ex9Q: <>Hasil pengukuran massa suatu benda di laboratorium adalah <InlineMath math="2,99567" /> gram. Untuk laporan ilmiah, massa harus dibulatkan ke tiga desimal. Berapa nilai yang harus ditulis dalam laporan?</>,
    ex9s1: "Identifikasi angka yang akan dibulatkan",
    ex9s1desc: <><InlineMath math="2,99\underline{5}67" /> gram - Angka 5 adalah desimal ke-3</>,
    ex9s2: "Lihat angka desimal ke-4",
    ex9s2desc: <>Angka desimal ke-4 adalah <InlineMath math="6" /> (lebih dari 5)</>,
    ex9s3: <>Karena 6 {">="} 5, maka 5 bertambah 1</>,
    ex9s3desc: <><InlineMath math="5 + 1 = 6" />, sehingga desimal ke-3 menjadi 6</>,
    ex9s4: "Verifikasi hasil",
    ex9s4desc: <><InlineMath math="2,995 \rightarrow 2,996" /> gram</>,
    ex9ans: <>Massa dalam laporan <InlineMath math="= 2,996" /> gram</>,

    sumTitle: "🔢 RANGKUMAN LENGKAP",
    sumSubtitle: "Pembulatan Bilangan Desimal — Kelas 7",
    sumSec1Label: "Aturan Pembulatan Desimal",
    sumGrid: [
      { label: "Digit ≥ 5", aksi: "Bulatkan ke ATAS (+1)", contoh: "3,47 → 3,5 (ke 1 des.)", color: "bg-green-900/50 border-green-500/40 text-green-200" },
      { label: "Digit < 5", aksi: "Bulatkan ke BAWAH (tetap)", contoh: "3,43 → 3,4 (ke 1 des.)", color: "bg-red-900/50 border-red-500/40 text-red-200" },
    ],
    sumCards: [
      { label: "Pembulatan ke satuan", desc: "Perhatikan digit di belakang koma pertama (persepuluhan). ≥5 → satuan +1, <5 → satuan tetap. Contoh: 7,6 → 8; 7,3 → 7", color: "from-rose-900/60 to-rose-800/20 border-rose-500/40 text-rose-200" },
      { label: "Pembulatan ke satu desimal", desc: "Perhatikan digit ke-2 di belakang koma. Contoh: 3,47 → 3,5 (digit ke-2 = 7 ≥ 5, bulatkan atas)", color: "from-pink-900/60 to-pink-800/20 border-pink-500/40 text-pink-200" },
      { label: "Pembulatan ke dua desimal", desc: "Perhatikan digit ke-3 di belakang koma. Contoh: 2,345 → 2,35 (digit ke-3 = 5 ≥ 5, bulatkan atas)", color: "from-fuchsia-900/60 to-fuchsia-800/20 border-fuchsia-500/40 text-fuchsia-200" },
      { label: "Pembulatan ke puluhan/ratusan", desc: "Perhatikan digit di posisi yang dikurangi. Contoh: 3.748 → 3.700 ke ratusan (perhatikan digit puluhan = 4 < 5)", color: "from-purple-900/60 to-purple-800/20 border-purple-500/40 text-purple-200" },
    ],
    sumSec2Label: "Tips & Trik Jitu",
    sumTips: [
      { icon: "👆", tip: "Selalu lihat satu digit SETELAH posisi yang dibulatkan", detail: "Jika membulatkan ke 1 desimal, lihat digit ke-2. Jika membulatkan ke satuan, lihat digit ke-1. Bukan digit di posisi itu sendiri!", color: "bg-rose-900/30 border-rose-500/30" },
      { icon: "⚠️", tip: "Waspada pembulatan berantai (cascading)", detail: "2,995 dibulatkan ke 2 desimal → lihat digit ke-3 = 5 → bulatkan ke atas → 2,996 (bukan 3,00!). Hanya bulatkan satu kali!", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🎯", tip: "Tanda ≥5 naik, <5 tetap — tidak ada pengecualian", detail: "Angka 5 selalu dibulatkan ke atas, bukan ke bawah. Ini aturan internasional (half-up rounding).", color: "bg-fuchsia-900/30 border-fuchsia-500/30" },
      { icon: "💡", tip: "Pembulatan berguna untuk estimasi cepat", detail: "Menghitung 34,7 × 18,3 sulit. Tapi perkiraan 35 × 18 = 630 jauh lebih mudah dan cukup akurat untuk banyak keperluan!", color: "bg-purple-900/30 border-purple-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Pembulatan adalah <strong className="text-rose-300">seni menyederhanakan angka</strong> tanpa kehilangan terlalu banyak akurasi. Aturannya sederhana: <strong className="text-yellow-300">lihat digit berikutnya — ≥5 naik, &lt;5 tetap</strong>. Pembulatan digunakan setiap hari — dari harga supermarket hingga laporan ilmiah — karena angka yang terlalu panjang tidak praktis!</>,
    tags: ["≥5 Naik", "<5 Tetap", "Lihat Digit Berikutnya", "Satuan/Desimal/Ratusan", "Estimasi Cepat"],
    nextLabel: "🎓 Kamu telah menguasai seluruh materi Bilangan Rasional Kelas 7!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "DECIMAL ROUNDING",
    pageSubtitle: "Grade 7 - Rational Numbers",
    summaryLabel: "Key Summary",
    tipsLabel: "Important Tips",
    discuss: "Solution:",
    answer: "Answer:",
    step: (n: number) => `Step ${n}:`,
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    ex: (n: number) => `Example ${n}`,

    sec1Title: "Basic Rules for Decimal Rounding",
    sec1Summary: <><strong>Decimal rounding</strong> is a technique for simplifying a decimal number to a certain number of places. The concept is simple: look at the digit just after the position you want to round to. If that digit is <strong>5 or more</strong>, round up (add 1). If it is <strong>less than 5</strong>, just drop the remaining digits!</>,
    sec1IllusTitle: "Rounding Illustration:",
    sec1IllusCaption: "Example: A pencil length of 9.59 cm is rounded to 9.6 cm (because 9 > 5)",
    sec1RuleTitle: "Rounding Rules:",
    sec1Up: <>Digit {">="} 5</>,
    sec1UpLabel: "Round up!",
    sec1UpDesc: "The preceding digit increases by 1",
    sec1Down: <>Digit {"<"} 5</>,
    sec1DownLabel: "Round down!",
    sec1DownDesc: "The preceding digit stays the same",
    sec1PosTitle: "How to Determine the Rounding Position:",
    sec1Pos1: <><strong className="text-orange-200">1 decimal place:</strong> Look at the 2nd decimal digit</>,
    sec1Pos2: <><strong className="text-orange-200">2 decimal places:</strong> Look at the 3rd decimal digit</>,
    sec1Pos3: <><strong className="text-orange-200">3 decimal places:</strong> Look at the 4th decimal digit</>,
    sec1PosEtc: "...and so on!",
    sec1Tips: [
      "First decide: how many decimal places do you want to round to?",
      <>Check the digit <strong>immediately after</strong> the rounding position</>,
      "Remember: 5 is the boundary! Digits 5, 6, 7, 8, 9 = round up",
    ],

    ex1Q: <>Round <InlineMath math="4,638" /> to <strong>one decimal place</strong></>,
    ex1s1: "Identify the digit to be rounded",
    ex1s1desc: <><InlineMath math="4,\underline{6}38" /> — digit 6 is the 1st decimal (the one to keep)</>,
    ex1s2: "Look at the 2nd decimal digit (after the rounding position)",
    ex1s2desc: <>The 2nd decimal digit is <InlineMath math="3" /> (less than 5)</>,
    ex1s3: <>Since 3 {"<"} 5, the digit 6 <strong>stays</strong></>,
    ex1s3desc: "The remaining digits are dropped",

    ex2Q: <>Round <InlineMath math="5,70642" /> to <strong>two decimal places</strong></>,
    ex2s1: "Identify the digit to be rounded",
    ex2s1desc: <><InlineMath math="5,7\underline{0}642" /> — digit 0 is the 2nd decimal (the one to keep)</>,
    ex2s2: "Look at the 3rd decimal digit (after the rounding position)",
    ex2s2desc: <>The 3rd decimal digit is <InlineMath math="6" /> (greater than 5)</>,
    ex2s3: <>Since 6 {">="} 5, the digit 0 <strong>increases by 1</strong></>,
    ex2s3desc: <><InlineMath math="0 + 1 = 1" />, so the result is 5.71</>,

    ex3Q: <>Round <InlineMath math="7,638524" /> to <strong>three decimal places</strong></>,
    ex3s1: "Identify the digit to be rounded",
    ex3s1desc: <><InlineMath math="7,63\underline{8}524" /> — digit 8 is the 3rd decimal (the one to keep)</>,
    ex3s2: "Look at the 4th decimal digit (after the rounding position)",
    ex3s2desc: <>The 4th decimal digit is <InlineMath math="5" /> (equal to 5)</>,
    ex3s3: <>Since 5 {">="} 5, the digit 8 <strong>increases by 1</strong></>,
    ex3s3desc: <><InlineMath math="8 + 1 = 9" />, so the result is 7.639</>,

    sec2Title: "Rounding to the Nearest Whole Number",
    sec2Summary: <>Sometimes we need a whole number, not a decimal. <strong>Rounding to the nearest whole number</strong> converts a decimal into the closest integer. The method is the same: look at the first decimal digit (the tenths digit). If it is <strong>5 or more</strong>, the ones digit goes up by 1. If it is <strong>less than 5</strong>, the ones digit stays!</>,
    sec2RuleTitle: "Rounding to Whole Number Rules:",
    sec2UpLabel: <>Tenths digit {">="} 5</>,
    sec2UpText: "Ones digit increases by 1",
    sec2UpDesc: "All decimal digits are dropped",
    sec2DownLabel: <>Tenths digit {"<"} 5</>,
    sec2DownText: "Ones digit stays",
    sec2DownDesc: "All decimal digits are dropped",
    sec2Tips: [
      "Look only at the 1st decimal digit (the tenths digit)",
      "Rounding to the nearest whole = rounding to 0 decimal places",
      "The final result is always a whole number with no decimal point",
    ],

    ex4Q: <>Round <InlineMath math="111,48" /> to the nearest whole number</>,
    ex4s1: "Identify the ones and tenths digits",
    ex4s1desc: <><InlineMath math="11\underline{1},48" /> — ones digit = 1, tenths digit = 4</>,
    ex4s2: "Check the tenths digit",
    ex4s2desc: <>The tenths digit is <InlineMath math="4" /> (less than 5)</>,
    ex4s3: <>Since 4 {"<"} 5, the ones digit <strong>stays</strong></>,
    ex4s3desc: "All decimal digits are dropped",

    ex5Q: <>Round <InlineMath math="613,54" /> to the nearest whole number</>,
    ex5s1: "Identify the ones and tenths digits",
    ex5s1desc: <><InlineMath math="61\underline{3},54" /> — ones digit = 3, tenths digit = 5</>,
    ex5s2: "Check the tenths digit",
    ex5s2desc: <>The tenths digit is <InlineMath math="5" /> (equal to 5)</>,
    ex5s3: <>Since 5 {">="} 5, the ones digit <strong>increases by 1</strong></>,
    ex5s3desc: <><InlineMath math="3 + 1 = 4" />, so the result is 614</>,

    ex6Q: <>Round <InlineMath math="319,837" /> to the nearest whole number</>,
    ex6s1: "Identify the ones and tenths digits",
    ex6s1desc: <><InlineMath math="31\underline{9},837" /> — ones digit = 9, tenths digit = 8</>,
    ex6s2: "Check the tenths digit",
    ex6s2desc: <>The tenths digit is <InlineMath math="8" /> (greater than 5)</>,
    ex6s3: <>Since 8 {">="} 5, the ones digit <strong>increases by 1</strong></>,
    ex6s3desc: <><InlineMath math="9 + 1 = 10" />, since the result is 10 the tens digit also changes</>,
    ex6s4: "Continue the calculation",
    ex6s4desc: <><InlineMath math="319 + 1 = 320" /></>,

    sec3Title: "Rounding in Real Life",
    sec3Summary: <>Rounding is not just a classroom concept! In daily life, rounding is often used to <strong>estimate prices</strong>, <strong>measure distances</strong>, <strong>calculate time</strong>, and much more. Rounding makes numbers easier to understand and communicate!</>,
    sec3UsageTitle: "Everyday Examples:",
    usage: [
      { title: "Shopping", desc: "Total of $49,750 rounded to $50,000" },
      { title: "Distance", desc: "12.3 km rounded to \"about 12 km\"" },
      { title: "Body Weight", desc: "65.7 kg often stated as \"about 66 kg\"" },
      { title: "Time", desc: "Journey of 2 hours 45 minutes = \"about 3 hours\"" },
    ],
    sec3Tips: [
      "Determine the level of precision needed",
      "For rough estimates, round to the nearest unit or ten",
      "For detailed calculations (science/finance), keep more decimal places",
    ],

    ex7Q: <>The room temperature is recorded as <InlineMath math="25,48°C" />. Round it to one decimal place for the daily report.</>,
    ex7s1: "Identify the digit to be rounded",
    ex7s1desc: <><InlineMath math="25,\underline{4}8°C" /> — digit 4 is the 1st decimal</>,
    ex7s2: "Look at the 2nd decimal digit",
    ex7s2desc: <>The 2nd decimal digit is <InlineMath math="8" /> (greater than 5)</>,
    ex7s3: <>Since 8 {">="} 5, digit 4 increases by 1</>,
    ex7s3desc: <><InlineMath math="4 + 1 = 5" /></>,
    ex7ans: <>Room temperature <InlineMath math="= 25,5°C" /></>,

    ex8Q: <>An athlete ran <InlineMath math="10,473" /> km in marathon training. For personal records, they want to round the distance to two decimal places. What distance is recorded?</>,
    ex8s1: "Identify the digit to be rounded",
    ex8s1desc: <><InlineMath math="10,4\underline{7}3" /> km — digit 7 is the 2nd decimal</>,
    ex8s2: "Look at the 3rd decimal digit",
    ex8s2desc: <>The 3rd decimal digit is <InlineMath math="3" /> (less than 5)</>,
    ex8s3: <>Since 3 {"<"} 5, digit 7 stays</>,
    ex8s3desc: "Digit 3 is dropped",
    ex8ans: <>Recorded distance <InlineMath math="= 10,47" /> km</>,

    ex9Q: <>The mass of an object measured in a laboratory is <InlineMath math="2,99567" /> grams. For a scientific report, the mass must be rounded to three decimal places. What value should be written in the report?</>,
    ex9s1: "Identify the digit to be rounded",
    ex9s1desc: <><InlineMath math="2,99\underline{5}67" /> grams — digit 5 is the 3rd decimal</>,
    ex9s2: "Look at the 4th decimal digit",
    ex9s2desc: <>The 4th decimal digit is <InlineMath math="6" /> (greater than 5)</>,
    ex9s3: <>Since 6 {">="} 5, digit 5 increases by 1</>,
    ex9s3desc: <><InlineMath math="5 + 1 = 6" />, so the 3rd decimal becomes 6</>,
    ex9s4: "Verify the result",
    ex9s4desc: <><InlineMath math="2,995 \rightarrow 2,996" /> grams</>,
    ex9ans: <>Mass in the report <InlineMath math="= 2,996" /> grams</>,

    sumTitle: "🔢 COMPLETE SUMMARY",
    sumSubtitle: "Decimal Rounding — Grade 7",
    sumSec1Label: "Rules for Decimal Rounding",
    sumGrid: [
      { label: "Digit ≥ 5", aksi: "Round UP (+1)", contoh: "3.47 → 3.5 (to 1 d.p.)", color: "bg-green-900/50 border-green-500/40 text-green-200" },
      { label: "Digit < 5", aksi: "Round DOWN (stays)", contoh: "3.43 → 3.4 (to 1 d.p.)", color: "bg-red-900/50 border-red-500/40 text-red-200" },
    ],
    sumCards: [
      { label: "Rounding to the nearest whole", desc: "Look at the first digit after the decimal (tenths). ≥5 → ones +1, <5 → ones stay. E.g. 7.6 → 8; 7.3 → 7", color: "from-rose-900/60 to-rose-800/20 border-rose-500/40 text-rose-200" },
      { label: "Rounding to 1 decimal place", desc: "Look at the 2nd digit after the decimal. E.g. 3.47 → 3.5 (2nd digit = 7 ≥ 5, round up)", color: "from-pink-900/60 to-pink-800/20 border-pink-500/40 text-pink-200" },
      { label: "Rounding to 2 decimal places", desc: "Look at the 3rd digit after the decimal. E.g. 2.345 → 2.35 (3rd digit = 5 ≥ 5, round up)", color: "from-fuchsia-900/60 to-fuchsia-800/20 border-fuchsia-500/40 text-fuchsia-200" },
      { label: "Rounding to tens/hundreds", desc: "Look at the digit in the position being eliminated. E.g. 3,748 → 3,700 to nearest hundred (tens digit = 4 < 5)", color: "from-purple-900/60 to-purple-800/20 border-purple-500/40 text-purple-200" },
    ],
    sumSec2Label: "Tips & Tricks",
    sumTips: [
      { icon: "👆", tip: "Always look at the digit AFTER the rounding position", detail: "Rounding to 1 decimal → look at the 2nd digit. Rounding to the nearest whole → look at the 1st decimal. Not the digit at the position itself!", color: "bg-rose-900/30 border-rose-500/30" },
      { icon: "⚠️", tip: "Watch out for cascading rounding", detail: "2.995 rounded to 2 d.p. → look at 3rd digit = 5 → round up → 2.996 (not 3.00!). Only round once!", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🎯", tip: "≥5 rounds up, <5 stays — no exceptions", detail: "The digit 5 always rounds up, never down. This is the international standard (half-up rounding).", color: "bg-fuchsia-900/30 border-fuchsia-500/30" },
      { icon: "💡", tip: "Rounding is useful for quick estimation", detail: "Calculating 34.7 × 18.3 is hard. But the estimate 35 × 18 = 630 is much easier and accurate enough for many purposes!", color: "bg-purple-900/30 border-purple-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Rounding is the <strong className="text-rose-300">art of simplifying numbers</strong> without losing too much accuracy. The rule is simple: <strong className="text-yellow-300">look at the next digit — ≥5 round up, &lt;5 stay</strong>. Rounding is used every day — from supermarket prices to scientific reports — because overly long numbers are impractical!</>,
    tags: ["≥5 Round Up", "<5 Stay", "Look at Next Digit", "Whole/Decimal/Hundreds", "Quick Estimate"],
    nextLabel: "🎓 You have mastered all Grade 7 Rational Numbers material!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    pageTitle: "小数の四捨五入",
    pageSubtitle: "中学1年 - 有理数",
    summaryLabel: "要点まとめ",
    tipsLabel: "重要なヒント",
    discuss: "解説：",
    answer: "答え：",
    step: (n: number) => `手順 ${n}：`,
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    ex: (n: number) => `例題 ${n}`,

    sec1Title: "小数の四捨五入の基本ルール",
    sec1Summary: <><strong>小数の四捨五入</strong>とは、小数を特定の桁数に簡略化する方法です。概念はシンプルです：四捨五入したい位の次の数字を見ます。その数字が<strong>5以上</strong>なら切り上げ（+1）、<strong>5未満</strong>なら残りを切り捨てます！</>,
    sec1IllusTitle: "四捨五入の図解：",
    sec1IllusCaption: "例：鉛筆の長さ9.59 cmを9.6 cmに四捨五入する（9 > 5のため）",
    sec1RuleTitle: "四捨五入のルール：",
    sec1Up: <>数字 {">="} 5</>,
    sec1UpLabel: "切り上げ！",
    sec1UpDesc: "前の桁の数字が1増える",
    sec1Down: <>数字 {"<"} 5</>,
    sec1DownLabel: "切り捨て！",
    sec1DownDesc: "前の桁の数字はそのまま",
    sec1PosTitle: "四捨五入する位の決め方：",
    sec1Pos1: <><strong className="text-orange-200">小数1桁：</strong>小数2桁目の数字を見る</>,
    sec1Pos2: <><strong className="text-orange-200">小数2桁：</strong>小数3桁目の数字を見る</>,
    sec1Pos3: <><strong className="text-orange-200">小数3桁：</strong>小数4桁目の数字を見る</>,
    sec1PosEtc: "...以下同様！",
    sec1Tips: [
      "まず決める：何桁まで四捨五入するか？",
      <>四捨五入する位の<strong>すぐ次</strong>の数字を確認する</>,
      "覚える：5が境界線！5、6、7、8、9 = 切り上げ",
    ],

    ex1Q: <><InlineMath math="4,638" /> を<strong>小数第1位</strong>まで四捨五入せよ</>,
    ex1s1: "四捨五入する数字を確認する",
    ex1s1desc: <><InlineMath math="4,\underline{6}38" /> — 6が小数1桁目（保持する桁）</>,
    ex1s2: "小数2桁目の数字を見る（四捨五入する位の次）",
    ex1s2desc: <>小数2桁目は <InlineMath math="3" />（5未満）</>,
    ex1s3: <>3 {"<"} 5なので、6は<strong>そのまま</strong></>,
    ex1s3desc: "残りの数字は切り捨て",

    ex2Q: <><InlineMath math="5,70642" /> を<strong>小数第2位</strong>まで四捨五入せよ</>,
    ex2s1: "四捨五入する数字を確認する",
    ex2s1desc: <><InlineMath math="5,7\underline{0}642" /> — 0が小数2桁目（保持する桁）</>,
    ex2s2: "小数3桁目の数字を見る（四捨五入する位の次）",
    ex2s2desc: <>小数3桁目は <InlineMath math="6" />（5より大きい）</>,
    ex2s3: <>6 {">="} 5なので、0が<strong>1増える</strong></>,
    ex2s3desc: <><InlineMath math="0 + 1 = 1" />、したがって結果は5.71</>,

    ex3Q: <><InlineMath math="7,638524" /> を<strong>小数第3位</strong>まで四捨五入せよ</>,
    ex3s1: "四捨五入する数字を確認する",
    ex3s1desc: <><InlineMath math="7,63\underline{8}524" /> — 8が小数3桁目（保持する桁）</>,
    ex3s2: "小数4桁目の数字を見る（四捨五入する位の次）",
    ex3s2desc: <>小数4桁目は <InlineMath math="5" />（5と等しい）</>,
    ex3s3: <>5 {">="} 5なので、8が<strong>1増える</strong></>,
    ex3s3desc: <><InlineMath math="8 + 1 = 9" />、したがって結果は7.639</>,

    sec2Title: "整数への四捨五入",
    sec2Summary: <>整数が必要なこともあります。<strong>整数への四捨五入</strong>は小数を最も近い整数に変換します。方法は同じ：小数1桁目（十分の一の位）を見ます。<strong>5以上</strong>なら一の位が1増えます。<strong>5未満</strong>なら一の位はそのまま！</>,
    sec2RuleTitle: "整数への四捨五入のルール：",
    sec2UpLabel: <>十分の一の位 {">="} 5</>,
    sec2UpText: "一の位が1増える",
    sec2UpDesc: "すべての小数部分を削除",
    sec2DownLabel: <>十分の一の位 {"<"} 5</>,
    sec2DownText: "一の位はそのまま",
    sec2DownDesc: "すべての小数部分を削除",
    sec2Tips: [
      "小数1桁目（十分の一の位）だけを確認する",
      "整数への四捨五入 = 小数0桁への四捨五入",
      "最終結果は常に小数点のない整数",
    ],

    ex4Q: <><InlineMath math="111,48" /> を最も近い整数に四捨五入せよ</>,
    ex4s1: "一の位と十分の一の位を確認する",
    ex4s1desc: <><InlineMath math="11\underline{1},48" /> — 一の位 = 1、十分の一の位 = 4</>,
    ex4s2: "十分の一の位を確認する",
    ex4s2desc: <>十分の一の位は <InlineMath math="4" />（5未満）</>,
    ex4s3: <>4 {"<"} 5なので、一の位は<strong>そのまま</strong></>,
    ex4s3desc: "すべての小数部分を削除",

    ex5Q: <><InlineMath math="613,54" /> を最も近い整数に四捨五入せよ</>,
    ex5s1: "一の位と十分の一の位を確認する",
    ex5s1desc: <><InlineMath math="61\underline{3},54" /> — 一の位 = 3、十分の一の位 = 5</>,
    ex5s2: "十分の一の位を確認する",
    ex5s2desc: <>十分の一の位は <InlineMath math="5" />（5と等しい）</>,
    ex5s3: <>5 {">="} 5なので、一の位が<strong>1増える</strong></>,
    ex5s3desc: <><InlineMath math="3 + 1 = 4" />、したがって結果は614</>,

    ex6Q: <><InlineMath math="319,837" /> を最も近い整数に四捨五入せよ</>,
    ex6s1: "一の位と十分の一の位を確認する",
    ex6s1desc: <><InlineMath math="31\underline{9},837" /> — 一の位 = 9、十分の一の位 = 8</>,
    ex6s2: "十分の一の位を確認する",
    ex6s2desc: <>十分の一の位は <InlineMath math="8" />（5より大きい）</>,
    ex6s3: <>8 {">="} 5なので、一の位が<strong>1増える</strong></>,
    ex6s3desc: <><InlineMath math="9 + 1 = 10" />、10になったので十の位も変わる</>,
    ex6s4: "計算を続ける",
    ex6s4desc: <><InlineMath math="319 + 1 = 320" /></>,

    sec3Title: "日常生活での四捨五入",
    sec3Summary: <>四捨五入は授業の計算だけではありません！日常生活では<strong>価格の見積もり</strong>、<strong>距離の測定</strong>、<strong>時間の計算</strong>などでよく使われます。四捨五入によって数値が理解しやすくなります！</>,
    sec3UsageTitle: "日常の使用例：",
    usage: [
      { title: "買い物", desc: "合計$49,750を$50,000に四捨五入" },
      { title: "距離", desc: "12.3 kmを「約12 km」に四捨五入" },
      { title: "体重", desc: "65.7 kgを「約66 kg」と表現" },
      { title: "時間", desc: "2時間45分の旅 = 「約3時間」" },
    ],
    sec3Tips: [
      "必要な精度のレベルを決める",
      "大まかな見積もりには一の位や十の位に四捨五入する",
      "詳細な計算（科学・財務）には小数点以下の桁数を多く保持する",
    ],

    ex7Q: <>室温が <InlineMath math="25,48°C" /> と記録されました。日常報告のために小数第1位に四捨五入せよ。</>,
    ex7s1: "四捨五入する数字を確認する",
    ex7s1desc: <><InlineMath math="25,\underline{4}8°C" /> — 4が小数1桁目</>,
    ex7s2: "小数2桁目の数字を見る",
    ex7s2desc: <>小数2桁目は <InlineMath math="8" />（5より大きい）</>,
    ex7s3: <>8 {">="} 5なので、4が1増える</>,
    ex7s3desc: <><InlineMath math="4 + 1 = 5" /></>,
    ex7ans: <>室温 <InlineMath math="= 25,5°C" /></>,

    ex8Q: <>あるアスリートがマラソントレーニングで <InlineMath math="10,473" /> km走りました。個人記録として小数第2位に四捨五入した距離を記録したい。記録される距離は？</>,
    ex8s1: "四捨五入する数字を確認する",
    ex8s1desc: <><InlineMath math="10,4\underline{7}3" /> km — 7が小数2桁目</>,
    ex8s2: "小数3桁目の数字を見る",
    ex8s2desc: <>小数3桁目は <InlineMath math="3" />（5未満）</>,
    ex8s3: <>3 {"<"} 5なので、7はそのまま</>,
    ex8s3desc: "3は切り捨て",
    ex8ans: <>記録される距離 <InlineMath math="= 10,47" /> km</>,

    ex9Q: <>実験室で測定した物体の質量は <InlineMath math="2,99567" /> グラムです。科学レポートのために小数第3位に四捨五入する必要があります。レポートに書く値は？</>,
    ex9s1: "四捨五入する数字を確認する",
    ex9s1desc: <><InlineMath math="2,99\underline{5}67" /> グラム — 5が小数3桁目</>,
    ex9s2: "小数4桁目の数字を見る",
    ex9s2desc: <>小数4桁目は <InlineMath math="6" />（5より大きい）</>,
    ex9s3: <>6 {">="} 5なので、5が1増える</>,
    ex9s3desc: <><InlineMath math="5 + 1 = 6" />、小数3桁目が6になる</>,
    ex9s4: "結果を確認する",
    ex9s4desc: <><InlineMath math="2,995 \rightarrow 2,996" /> グラム</>,
    ex9ans: <>レポートに書く質量 <InlineMath math="= 2,996" /> グラム</>,

    sumTitle: "🔢 完全まとめ",
    sumSubtitle: "小数の四捨五入 — 中学1年",
    sumSec1Label: "小数の四捨五入のルール",
    sumGrid: [
      { label: "数字 ≥ 5", aksi: "切り上げ（+1）", contoh: "3.47 → 3.5（小数1桁）", color: "bg-green-900/50 border-green-500/40 text-green-200" },
      { label: "数字 < 5", aksi: "切り捨て（そのまま）", contoh: "3.43 → 3.4（小数1桁）", color: "bg-red-900/50 border-red-500/40 text-red-200" },
    ],
    sumCards: [
      { label: "整数への四捨五入", desc: "小数1桁目（十分の一の位）を確認。≥5 → 一の位+1、<5 → 一の位そのまま。例：7.6 → 8; 7.3 → 7", color: "from-rose-900/60 to-rose-800/20 border-rose-500/40 text-rose-200" },
      { label: "小数第1位への四捨五入", desc: "小数2桁目を確認。例：3.47 → 3.5（2桁目 = 7 ≥ 5、切り上げ）", color: "from-pink-900/60 to-pink-800/20 border-pink-500/40 text-pink-200" },
      { label: "小数第2位への四捨五入", desc: "小数3桁目を確認。例：2.345 → 2.35（3桁目 = 5 ≥ 5、切り上げ）", color: "from-fuchsia-900/60 to-fuchsia-800/20 border-fuchsia-500/40 text-fuchsia-200" },
      { label: "十の位・百の位への四捨五入", desc: "削除する位の数字を確認。例：3,748 → 3,700（百の位）（十の位 = 4 < 5）", color: "from-purple-900/60 to-purple-800/20 border-purple-500/40 text-purple-200" },
    ],
    sumSec2Label: "ヒントとコツ",
    sumTips: [
      { icon: "👆", tip: "四捨五入する位の次の数字を必ず見る", detail: "小数1桁への四捨五入なら2桁目を見る。整数への四捨五入なら小数1桁目を見る。その位置の数字自体ではない！", color: "bg-rose-900/30 border-rose-500/30" },
      { icon: "⚠️", tip: "連鎖的な四捨五入に注意", detail: "2.995を小数2桁に四捨五入 → 3桁目 = 5 → 切り上げ → 2.996（3.00ではない！）。四捨五入は一度だけ！", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🎯", tip: "≥5は切り上げ、<5は切り捨て — 例外なし", detail: "5は必ず切り上げ、切り捨てではない。これが国際標準（half-up rounding）。", color: "bg-fuchsia-900/30 border-fuchsia-500/30" },
      { icon: "💡", tip: "四捨五入は素早い見積もりに役立つ", detail: "34.7 × 18.3の計算は難しい。でも35 × 18 = 630という見積もりははるかに簡単で、多くの用途には十分！", color: "bg-purple-900/30 border-purple-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>四捨五入は<strong className="text-rose-300">精度を失わずに数値を簡略化する技術</strong>です。ルールはシンプル：<strong className="text-yellow-300">次の数字を見る — ≥5なら切り上げ、&lt;5なら切り捨て</strong>。スーパーの価格から科学レポートまで毎日使われる、なぜなら長すぎる数値は実用的でないから！</>,
    tags: ["≥5 切り上げ", "<5 切り捨て", "次の数字を確認", "整数/小数/百の位", "素早い見積もり"],
    nextLabel: "🎓 中学1年有理数の全単元を制覇しました！",
    backBtn: "有理数に戻る",
  },
};

const PembulatanBentukDesimalPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-4xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.pageSubtitle}</p>

        {/* Section 1: Basic rounding rules */}
        <div className="mb-6 animate-slide-up">
          <div className="w-full flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 text-left">
            <Target className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec1Title}</span>
          </div>
          <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
              </h3>
              <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec1Summary}</p>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="text-slate-300 font-semibold text-sm mb-3">{t.sec1IllusTitle}</h4>
              <div className="overflow-x-auto">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sAb4zSyRJ4SV95WJABkpgzwNQw7fj0.png"
                  alt="Decimal rounding illustration"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
              <p className="text-white/70 text-xs text-center mt-2">{t.sec1IllusCaption}</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec1RuleTitle}</h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded shrink-0">{t.sec1Up}</span>
                  <div className="text-white/80 text-sm">
                    <strong className="text-green-300">{t.sec1UpLabel}</strong>
                    <p className="text-white/70 mt-1">{t.sec1UpDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded shrink-0">{t.sec1Down}</span>
                  <div className="text-white/80 text-sm">
                    <strong className="text-red-300">{t.sec1DownLabel}</strong>
                    <p className="text-white/70 mt-1">{t.sec1DownDesc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-orange-300 font-semibold text-sm mb-3">{t.sec1PosTitle}</h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-2 text-sm text-white/80">
                <p>{t.sec1Pos1}</p>
                <p>{t.sec1Pos2}</p>
                <p>{t.sec1Pos3}</p>
                <p className="text-white/60 italic mt-2">{t.sec1PosEtc}</p>
              </div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {t.tipsLabel}
              </h4>
              <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                {t.sec1Tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
            {/* Example 1 - Easy */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                <span className="text-green-300 font-semibold text-sm">{t.ex(1)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex1Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex1s1}</p>
                  <div className="pl-4">{t.ex1s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                  <div className="pl-4">{t.ex1s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex1s3}</p>
                  <div className="pl-4">{t.ex1s3desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="4,638 \approx 4,6" /></p>
                </div>
              </div>
            </div>
            {/* Example 2 - Medium */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                <span className="text-yellow-300 font-semibold text-sm">{t.ex(2)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex2Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex2s1}</p>
                  <div className="pl-4">{t.ex2s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                  <div className="pl-4">{t.ex2s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex2s3}</p>
                  <div className="pl-4">{t.ex2s3desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="5,70642 \approx 5,71" /></p>
                </div>
              </div>
            </div>
            {/* Example 3 - Hard */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                <span className="text-red-300 font-semibold text-sm">{t.ex(3)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex3Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex3s1}</p>
                  <div className="pl-4">{t.ex3s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                  <div className="pl-4">{t.ex3s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex3s3}</p>
                  <div className="pl-4">{t.ex3s3desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="7,638524 \approx 7,639" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Rounding to whole number */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-full flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 text-left">
            <Circle className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec2Title}</span>
          </div>
          <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
              </h3>
              <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec2Summary}</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec2RuleTitle}</h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded shrink-0">{t.sec2UpLabel}</span>
                  <div className="text-white/80 text-sm">
                    <strong className="text-green-300">{t.sec2UpText}</strong>
                    <p className="text-white/70 mt-1">{t.sec2UpDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded shrink-0">{t.sec2DownLabel}</span>
                  <div className="text-white/80 text-sm">
                    <strong className="text-red-300">{t.sec2DownText}</strong>
                    <p className="text-white/70 mt-1">{t.sec2DownDesc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {t.tipsLabel}
              </h4>
              <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                {t.sec2Tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
            {/* Example 4 - Easy */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                <span className="text-green-300 font-semibold text-sm">{t.ex(1)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex4Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex4s1}</p>
                  <div className="pl-4">{t.ex4s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex4s2}</p>
                  <div className="pl-4">{t.ex4s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex4s3}</p>
                  <div className="pl-4">{t.ex4s3desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="111,48 \approx 111" /></p>
                </div>
              </div>
            </div>
            {/* Example 5 - Medium */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                <span className="text-yellow-300 font-semibold text-sm">{t.ex(2)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex5Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex5s1}</p>
                  <div className="pl-4">{t.ex5s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex5s2}</p>
                  <div className="pl-4">{t.ex5s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex5s3}</p>
                  <div className="pl-4">{t.ex5s3desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="613,54 \approx 614" /></p>
                </div>
              </div>
            </div>
            {/* Example 6 - Hard */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                <span className="text-red-300 font-semibold text-sm">{t.ex(3)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex6Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex6s1}</p>
                  <div className="pl-4">{t.ex6s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex6s2}</p>
                  <div className="pl-4">{t.ex6s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex6s3}</p>
                  <div className="pl-4">{t.ex6s3desc}</div>
                  <p><strong>{t.step(4)}</strong> {t.ex6s4}</p>
                  <div className="pl-4">{t.ex6s4desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="319,837 \approx 320" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Real-life applications */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 text-left">
            <Hash className="w-5 h-5 text-orange-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec3Title}</span>
          </div>
          <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg p-4">
              <h3 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
              </h3>
              <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec3Summary}</p>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="text-slate-300 font-semibold text-sm mb-3">{t.sec3UsageTitle}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {t.usage.map(({ title, desc }) => (
                  <div key={title} className="bg-black/30 rounded p-3">
                    <p className="text-cyan-300 font-semibold">{title}</p>
                    <p className="text-white/70">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {t.tipsLabel}
              </h4>
              <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                {t.sec3Tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
            {/* Example 7 - Easy */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                <span className="text-green-300 font-semibold text-sm">{t.ex(1)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex7Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex7s1}</p>
                  <div className="pl-4">{t.ex7s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex7s2}</p>
                  <div className="pl-4">{t.ex7s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex7s3}</p>
                  <div className="pl-4">{t.ex7s3desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> {t.ex7ans}</p>
                </div>
              </div>
            </div>
            {/* Example 8 - Medium */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                <span className="text-yellow-300 font-semibold text-sm">{t.ex(2)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex8Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex8s1}</p>
                  <div className="pl-4">{t.ex8s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex8s2}</p>
                  <div className="pl-4">{t.ex8s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex8s3}</p>
                  <div className="pl-4">{t.ex8s3desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> {t.ex8ans}</p>
                </div>
              </div>
            </div>
            {/* Example 9 - Hard */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                <span className="text-red-300 font-semibold text-sm">{t.ex(3)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex9Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex9s1}</p>
                  <div className="pl-4">{t.ex9s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex9s2}</p>
                  <div className="pl-4">{t.ex9s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex9s3}</p>
                  <div className="pl-4">{t.ex9s3desc}</div>
                  <p><strong>{t.step(4)}</strong> {t.ex9s4}</p>
                  <div className="pl-4">{t.ex9s4desc}</div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> {t.ex9ans}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-rose-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center text-[10px]">1</span>
                {t.sumSec1Label}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {t.sumGrid.map(({ label, aksi, contoh, color }) => (
                  <div key={label} className={`${color} border rounded-xl px-3 py-2.5`}>
                    <p className="font-body text-xs font-bold">{label}</p>
                    <p className="font-mono text-[11px] text-white/70 mt-0.5">{aksi}</p>
                    <p className="font-body text-[11px] text-white/45 mt-0.5">{contoh}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {t.sumCards.map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div><p className="font-body text-xs font-bold">{label}</p><p className="font-body text-xs text-white/65 mt-0.5">{desc}</p></div>
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
                    <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-fuchsia-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌹</div>
              <p className="font-display text-base font-bold text-white">{t.conclusionTitle}</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.conclusionBody}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {t.tags.map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{t.nextLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
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

export default PembulatanBentukDesimalPage;
