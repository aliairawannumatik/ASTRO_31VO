import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import BankSimulasi from "@/components/BankSimulasi";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, AlertCircle, Star, Zap, RotateCcw, DollarSign,
  Percent, Clock, TrendingUp, CheckCircle, XCircle, RefreshCw
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

const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0;

const translations = {
  id: {
    title: "BUNGA TUNGGAL",
    subtitle: "Kelas 7 · Aritmetika Sosial · Materi Matematika",
    back: "← Kembali ke Aritmetika Sosial",
    secIntroTitle: "Apa itu Bunga Tunggal?",
    introBody: "Saat kamu menabung di bank atau meminjam uang, ada tambahan uang yang disebut bunga. Bunga tunggal (simple interest) adalah bunga yang dihitung hanya dari modal awal — tidak berubah setiap tahun seperti bunga majemuk. Ini adalah jenis bunga paling sederhana dan menjadi dasar pemahaman keuangan.",
    analogiTitle: "💡 Analogi Nyata:",
    analogiBody: "Bayangkan kamu meminjam uang dari teman sebesar Rp500.000 dengan kesepakatan bayar bunga 10% setiap bulan. Bulan pertama bunganya Rp50.000. Bulan kedua? Tetap Rp50.000 — karena dihitung dari modal awal, bukan dari total yang sudah menumpuk. Itulah bunga tunggal.",
    konsepCards: [
      { judul: "Modal (M)", sub: "Capital / Principal", desc: "Uang awal yang ditabung atau dipinjam. Nilai M tidak berubah sepanjang waktu." },
      { judul: "Bunga (B)", sub: "Interest", desc: "Tambahan uang yang diperoleh/dibayarkan. Besarnya tetap setiap periode." },
      { judul: "Persen Bunga (P)", sub: "Interest Rate", desc: "Besar bunga per periode, dinyatakan dalam %. Contoh: 6% per tahun." },
      { judul: "Waktu (W)", sub: "Time Period", desc: "Lama menabung/meminjam. Satuan harus sama dengan satuan P." },
    ],
    secRumusTitle: "Rumus Bunga Tunggal",
    rumusIntro: "Ada 4 rumus penting yang perlu dikuasai:",
    rumus: [
      { warna: "amber", judul: "Menghitung Besar Bunga", rumus: String.raw`B = M \times W \times P`, ket: "B dalam satuan uang (Rp/$). W dalam tahun/bulan (disesuaikan dengan P). P sudah dalam bentuk desimal." },
      { warna: "green", judul: "Menghitung Modal Akhir", rumus: String.raw`M_1 = M + B = M \times (1 + W \times P)`, ket: "Modal akhir = Modal awal + semua bunga yang terkumpul." },
      { warna: "blue", judul: "Mencari Modal Awal", rumus: String.raw`M = \frac{M_1}{1 + W \times P}`, ket: "Gunakan saat modal awal tidak diketahui tapi modal akhir diketahui." },
      { warna: "purple", judul: "Mencari Waktu atau Persentase", rumus: String.raw`W = \frac{B}{M \times P}, \quad P = \frac{B}{M \times W}`, ket: "Mengatur ulang rumus dasar untuk mencari W atau P." },
    ],
    secSatuanTitle: "Satuan Waktu — Jangan Sampai Keliru!",
    satuanIntro: "Ini adalah sumber kesalahan paling umum! Satuan waktu (W) HARUS sama dengan satuan periode bunga (P).",
    satuanTable: [["Per Tahun", "Per Year", "年利", "Tahun","Year","年", "Jika W dalam bulan → ÷ 12. Hari → ÷ 365"],
      ["Per Bulan", "Per Month", "月利", "Bulan","Month","ヶ月", "Jika W dalam tahun → × 12. Hari → ÷ 30"],
      ["Per Hari", "Per Day", "日利", "Hari","Day","日", "Jika W dalam tahun → × 365. Bulan → × 30"]],
    satuanEx: "📝 Contoh Konversi:",
    satuanExContent: "Bunga 12% per tahun selama 9 bulan → W = 9 ÷ 12 = 0,75 tahun\nBunga 2% per bulan selama 1,5 tahun → W = 1,5 × 12 = 18 bulan",
    secKalkTitle: "Kalkulator Bunga Tunggal",
    kalkIntro: "Isi kolom di bawah ini, lalu tekan tombol hitung untuk mendapat hasil secara langsung.",
    modalLabel: "Modal Awal",
    bungaLabel: "Bunga (% per tahun/bulan)",
    waktuLabel: "Waktu (angka saja)",
    satuanLabel: "Satuan Waktu",
    tahunLabel: "Tahun",
    bulanLabel: "Bulan",
    hitungLabel: "Hitung Sekarang",
    resetLabel: "Reset",
    hasilLabel: "Hasil Perhitungan:",
    hasilModal: "Modal Awal",
    hasilBunga: "Bunga yang Diperoleh",
    hasilTotal: "Total Akhir",
    carHitung: "Cara hitung: B =",
    phModal: "contoh: 2000000",
    phBunga: "contoh: 6",
    phWaktu: "contoh: 2",
    secVisualTitle: "Visualisasi Pertumbuhan Uang",
    visualDesc: "dengan bunga tunggal",
    visualCaption: "Modal Awal",
    visualNote: "💡 Perhatikan: Bunga per tahun selalu sama karena dihitung dari modal awal yang tetap. Pertumbuhannya linear (garis lurus), bukan eksponensial.",
    tableTahun: "Tahun ke-",
    tableBunga: "Bunga per Tahun",
    tableTotalBunga: "Total Bunga",
    tableTotalUang: "Total Uang",
    secKesalahanTitle: "Kesalahan Umum & Tips Penting",
    kesalahan: [
      { salah: "Tidak mengonversi satuan waktu — langsung pakai angka 9 padahal bunga per tahun dan W = 9 bulan", benar: "Konversi dulu: W = 9 ÷ 12 = 0,75 tahun. Selalu samakan satuan W dengan periode P." },
      { salah: "Menghitung bunga dari total saldo (modal + bunga sebelumnya) seperti bunga majemuk", benar: "Bunga tunggal: setiap periode bunga dihitung dari modal AWAL yang tetap, bukan dari total saldo." },
      { salah: "Lupa menambahkan bunga ke modal saat mencari modal akhir — hanya melaporkan nilai B saja", benar: "Modal Akhir = Modal Awal + Bunga. Jangan lupa menjumlahkan keduanya." },
      { salah: "Memasukkan P sebagai angka persen (mis. 6) bukan desimal (0,06) ke dalam rumus", benar: "Konversi persen ke desimal: P = 6% = 6/100 = 0,06 sebelum dikalikan." },
    ],
    secContohTitle: "Contoh Soal & Pembahasan Lengkap",
    soalContoh: [
      { level: "MUDAH", warna: "green", no: 1, judul: "Menghitung Bunga & Modal Akhir",
        soal: "Avery menabung Rp2.000.000 di bank dengan bunga tunggal 6% per tahun. Berapa besar bunga yang diperoleh dan berapa total tabungannya setelah 2 tahun?",
        langkah: [
          { label: "Diketahui", isi: "M = Rp2.000.000, P = 6% = 0,06, W = 2 tahun" },
          { label: "Ditanya", isi: "Besar bunga (B) dan modal akhir (M₁)" },
          { label: "Penyelesaian", rumus: String.raw`B = 2.000.000 \times 2 \times 0{,}06 = \text{Rp}240.000` },
          { label: "", rumus: String.raw`M_1 = 2.000.000 + 240.000 = \text{Rp}2.240.000` },
        ],
        jawaban: "Bunga = Rp240.000 · Total tabungan = Rp2.240.000" },
      { level: "SEDANG", warna: "yellow", no: 2, judul: "Waktu dalam Bulan, Bunga per Tahun",
        soal: "Ibu Ani meminjam uang Rp5.000.000 dengan bunga tunggal 18% per tahun. Berapa total yang harus dikembalikan setelah 8 bulan?",
        langkah: [
          { label: "Diketahui", isi: "M = Rp5.000.000, P = 18% = 0,18 per tahun, W = 8 bulan" },
          { label: "Konversi Waktu", isi: "Bunga per tahun → W harus dalam tahun: W = 8 ÷ 12 = 2/3 tahun" },
          { label: "Penyelesaian", rumus: String.raw`B = 5.000.000 \times \frac{2}{3} \times 0{,}18 = \text{Rp}600.000` },
          { label: "", rumus: String.raw`M_1 = 5.000.000 + 600.000 = \text{Rp}5.600.000` },
        ],
        jawaban: "Total yang dikembalikan = Rp5.600.000" },
      { level: "SULIT", warna: "red", no: 3, judul: "Mencari Modal Awal dari Modal Akhir",
        soal: "Setelah 2,5 tahun dengan bunga tunggal 8% per tahun, total tabungan Avery menjadi Rp3.600.000. Berapa modal awal yang ia tabungkan?",
        langkah: [
          { label: "Diketahui", isi: "M₁ = Rp3.600.000, P = 0,08, W = 2,5 tahun · Cari M." },
          { label: "Penyelesaian", rumus: String.raw`M_1 = M \times (1 + W \times P)` },
          { label: "", rumus: String.raw`3.600.000 = M \times (1 + 2{,}5 \times 0{,}08) = M \times 1{,}2` },
          { label: "", rumus: String.raw`M = \frac{3.600.000}{1{,}2} = \text{Rp}3.000.000` },
        ],
        jawaban: "Modal awal = Rp3.000.000" },
    ],
    pembahasan: "LANGKAH PENYELESAIAN:",
    secKuisTitle: "Mini Kuis — Uji Pemahamanmu!",
    kuisIntro: "5 soal tentang Bunga Tunggal. Jawab dan lihat penjelasannya langsung!",
    soalLabel: "Soal",
    quizBenar: "✓ Benar!",
    quizSalah: "✗ Belum tepat.",
    sebelumnya: "← Sebelumnya",
    lanjut: "Lanjut →",
    lihatHasil: "Lihat Hasil",
    hasilKuis: "Hasil Kuis",
    benar: "Benar",
    cobaLagi: "Coba Lagi",
    quizPesan: ["Luar biasa! Kamu sangat memahami Bunga Tunggal.", "Bagus! Baca ulang bagian yang belum tepat.", "Semangat! Pelajari lagi materinya."],
    quiz: [
      { soal: "Modal Rp3.000.000, bunga 10% per tahun, waktu 3 tahun. Berapa total tabungan akhir?", pilihan: ["Rp3.600.000","Rp3.900.000","Rp4.200.000","Rp4.500.000"], benar: 1, penjelasan: "B = 3.000.000 × 3 × 0,10 = Rp900.000. M₁ = 3.000.000 + 900.000 = Rp3.900.000." },
      { soal: "Modal Rp4.000.000, bunga 12% per tahun, waktu 9 bulan. Berapa besar bunga yang diperoleh?", pilihan: ["Rp360.000","Rp400.000","Rp480.000","Rp540.000"], benar: 0, penjelasan: "W = 9 ÷ 12 = 0,75 tahun. B = 4.000.000 × 0,75 × 0,12 = Rp360.000." },
      { soal: "Modal Rp2.500.000 ditabung dengan bunga 8% per tahun. Setelah berapa tahun total tabungannya menjadi Rp3.300.000?", pilihan: ["3 tahun","3,5 tahun","4 tahun","4,5 tahun"], benar: 2, penjelasan: "B = 3.300.000 − 2.500.000 = Rp800.000. W = 800.000 ÷ (2.500.000 × 0,08) = 4 tahun." },
      { soal: "Setelah 5 tahun dengan bunga tunggal 10%/tahun, total tabungan menjadi Rp6.000.000. Berapa modal awalnya?", pilihan: ["Rp3.500.000","Rp3.800.000","Rp4.000.000","Rp4.200.000"], benar: 2, penjelasan: "M₁ = M × (1 + 5 × 0,10) = M × 1,5. M = 6.000.000 ÷ 1,5 = Rp4.000.000." },
      { soal: "Modal Rp5.000.000, bunga 15% per tahun, waktu 2 tahun. Berapa total bunga yang terkumpul?", pilihan: ["Rp1.000.000","Rp1.500.000","Rp2.000.000","Rp2.500.000"], benar: 1, penjelasan: "B = 5.000.000 × 2 × 0,15 = Rp1.500.000." },
    ],
    secRangkumanTitle: "Rangkuman Bunga Tunggal",
    rangkuman: [
      "Bunga tunggal selalu dihitung dari modal AWAL yang tetap — bukan dari akumulasi.",
      "B = M × W × P. Pastikan satuan W sesuai dengan satuan P (tahun vs bulan).",
      "Modal Akhir = Modal Awal + Bunga (jangan lupa dijumlahkan!).",
      "Untuk mencari modal awal: M = M₁ ÷ (1 + W × P).",
      "Konversi waktu: bulan ÷ 12 = tahun; tahun × 12 = bulan.",
      "Bunga tunggal bersifat linear (pertumbuhan sama setiap periode), berbeda dengan bunga majemuk yang eksponensial.",
    ],
    rangkumanKoneksiTitle: "Koneksi ke Kehidupan Nyata:",
    rangkumanKoneksiBody: "Tabungan Bank: Bank memberikan bunga kepada penabung sesuai saldo awal.\nPinjaman/Kredit: Debitur membayar bunga sesuai pinjaman pokok yang tetap.\nInvestasi: Obligasi (bond) menggunakan konsep bunga tunggal dalam perhitungan kuponnya.",
  },
  en: {
    title: "SIMPLE INTEREST",
    subtitle: "Grade 7 · Social Arithmetic · Mathematics",
    back: "← Back to Social Arithmetic",
    secIntroTitle: "What is Simple Interest?",
    introBody: "When you save money at a bank or borrow money, there is an added amount called interest. Simple interest is interest calculated only from the initial capital — it does not change each year like compound interest. This is the simplest type of interest and forms the foundation of financial literacy.",
    analogiTitle: "💡 Real Analogy:",
    analogiBody: "Imagine you borrow $500 from a friend with an agreement to pay 10% interest each month. The first month's interest is $50. The second month? Still $50 — because it's calculated from the original capital, not from the accumulated total. That's simple interest.",
    konsepCards: [
      { judul: "Capital (M)", sub: "Principal", desc: "The initial money saved or borrowed. M does not change throughout the period." },
      { judul: "Interest (B)", sub: "Interest Amount", desc: "The additional money earned/paid. It remains the same each period." },
      { judul: "Interest Rate (P)", sub: "Rate per Period", desc: "The size of interest per period, expressed as %. Example: 6% per year." },
      { judul: "Time (W)", sub: "Time Period", desc: "The duration of saving/borrowing. The unit must match the unit of P." },
    ],
    secRumusTitle: "Simple Interest Formulas",
    rumusIntro: "There are 4 important formulas to master:",
    rumus: [
      { warna: "amber", judul: "Calculating the Interest Amount", rumus: String.raw`I = P \times r \times t`, ket: "I = Interest in dollars. t in years/months (matching r). r in decimal form." },
      { warna: "green", judul: "Calculating the Final Balance", rumus: String.raw`A = P + I = P \times (1 + r \times t)`, ket: "Final balance = Principal + all accumulated interest." },
      { warna: "blue", judul: "Finding the Principal", rumus: String.raw`P = \frac{A}{1 + r \times t}`, ket: "Use when principal is unknown but final balance is known." },
      { warna: "purple", judul: "Finding Time or Rate", rumus: String.raw`t = \frac{I}{P \times r}, \quad r = \frac{I}{P \times t}`, ket: "Rearrange the base formula to find t or r." },
    ],
    secSatuanTitle: "Time Units — Don't Get Confused!",
    satuanIntro: "This is the most common source of errors! The time unit (t) MUST match the interest period unit (r).",
    satuanTable: [["Per Year", "Per Year", "年利", "Year","Year","年", "If t in months → ÷ 12. Days → ÷ 365"],
      ["Per Month", "Per Month", "月利", "Month","Month","ヶ月", "If t in years → × 12. Days → ÷ 30"],
      ["Per Day", "Per Day", "日利", "Day","Day","日", "If t in years → × 365. Months → × 30"]],
    satuanEx: "📝 Conversion Examples:",
    satuanExContent: "12% annual rate for 9 months → t = 9 ÷ 12 = 0.75 years\n2% monthly rate for 1.5 years → t = 1.5 × 12 = 18 months",
    secKalkTitle: "Simple Interest Calculator",
    kalkIntro: "Fill in the fields below, then press Calculate to get results instantly.",
    modalLabel: "Principal (Capital)",
    bungaLabel: "Interest Rate (% per year/month)",
    waktuLabel: "Time (number only)",
    satuanLabel: "Time Unit",
    tahunLabel: "Year",
    bulanLabel: "Month",
    hitungLabel: "Calculate Now",
    resetLabel: "Reset",
    hasilLabel: "Results:",
    hasilModal: "Principal",
    hasilBunga: "Interest Earned",
    hasilTotal: "Final Total",
    carHitung: "Calculation: I =",
    phModal: "e.g. 2000",
    phBunga: "e.g. 6",
    phWaktu: "e.g. 2",
    secVisualTitle: "Money Growth Visualization",
    visualDesc: "with simple interest",
    visualCaption: "Initial Capital",
    visualNote: "💡 Notice: Interest per year is always the same because it is calculated from the fixed initial capital. Growth is linear (straight line), not exponential.",
    tableTahun: "Year",
    tableBunga: "Interest per Year",
    tableTotalBunga: "Total Interest",
    tableTotalUang: "Total Balance",
    secKesalahanTitle: "Common Mistakes & Key Tips",
    kesalahan: [
      { salah: "Not converting time units — using 9 directly when rate is annual and time is 9 months", benar: "Convert first: t = 9 ÷ 12 = 0.75 years. Always match the unit of t with the period of r." },
      { salah: "Calculating interest from the accumulated total (like compound interest)", benar: "Simple interest: each period, interest is calculated from the INITIAL capital, not from the total balance." },
      { salah: "Forgetting to add interest to principal when finding the final balance", benar: "Final Balance = Principal + Interest. Don't forget to add them together." },
      { salah: "Entering r as a percentage (e.g. 6) instead of decimal (0.06) in the formula", benar: "Convert: r = 6% = 6/100 = 0.06 before multiplying." },
    ],
    secContohTitle: "Worked Examples",
    soalContoh: [
      { level: "EASY", warna: "green", no: 1, judul: "Calculating Interest & Final Balance",
        soal: "Avery saves $2,000 in a bank with a simple interest rate of 6% per year. What is the interest earned and the total savings after 2 years?",
        langkah: [
          { label: "Given", isi: "P = $2,000, r = 6% = 0.06, t = 2 years" },
          { label: "Find", isi: "Interest (I) and final balance (A)" },
          { label: "Solution", rumus: String.raw`I = 2000 \times 2 \times 0.06 = \$240` },
          { label: "", rumus: String.raw`A = 2000 + 240 = \$2{,}240` },
        ],
        jawaban: "Interest = $240 · Final balance = $2,240" },
      { level: "MEDIUM", warna: "yellow", no: 2, judul: "Time in Months, Annual Rate",
        soal: "Ms. Ani borrows $5,000 with a simple interest rate of 18% per year. What is the total to be repaid after 8 months?",
        langkah: [
          { label: "Given", isi: "P = $5,000, r = 18% = 0.18 per year, t = 8 months" },
          { label: "Convert Time", isi: "Annual rate → t must be in years: t = 8 ÷ 12 = 2/3 year" },
          { label: "Solution", rumus: String.raw`I = 5000 \times \frac{2}{3} \times 0.18 = \$600` },
          { label: "", rumus: String.raw`A = 5000 + 600 = \$5{,}600` },
        ],
        jawaban: "Total to be repaid = $5,600" },
      { level: "HARD", warna: "red", no: 3, judul: "Finding the Principal from the Final Balance",
        soal: "After 2.5 years with an 8% annual simple interest rate, Avery's total savings became $3,600. What was the original principal?",
        langkah: [
          { label: "Given", isi: "A = $3,600, r = 0.08, t = 2.5 years · Find P." },
          { label: "Solution", rumus: String.raw`A = P \times (1 + t \times r)` },
          { label: "", rumus: String.raw`3600 = P \times (1 + 2.5 \times 0.08) = P \times 1.2` },
          { label: "", rumus: String.raw`P = \frac{3600}{1.2} = \$3{,}000` },
        ],
        jawaban: "Initial principal = $3,000" },
    ],
    pembahasan: "SOLUTION STEPS:",
    secKuisTitle: "Mini Quiz — Test Your Understanding!",
    kuisIntro: "5 questions about Simple Interest. Answer and see explanations immediately!",
    soalLabel: "Question",
    quizBenar: "✓ Correct!",
    quizSalah: "✗ Not quite right.",
    sebelumnya: "← Previous",
    lanjut: "Next →",
    lihatHasil: "See Results",
    hasilKuis: "Quiz Results",
    benar: "Correct",
    cobaLagi: "Try Again",
    quizPesan: ["Excellent! You understand Simple Interest very well.", "Good! Review the parts you got wrong.", "Keep going! Study the material again."],
    quiz: [
      { soal: "Principal $3,000, 10% annual interest, 3 years. What is the final balance?", pilihan: ["$3,600","$3,900","$4,200","$4,500"], benar: 1, penjelasan: "I = 3000 × 3 × 0.10 = $900. A = 3000 + 900 = $3,900." },
      { soal: "Principal $4,000, 12% annual interest, 9 months. What is the interest earned?", pilihan: ["$360","$400","$480","$540"], benar: 0, penjelasan: "t = 9 ÷ 12 = 0.75 years. I = 4000 × 0.75 × 0.12 = $360." },
      { soal: "Principal $2,500 at 8% annual interest. After how many years does the total reach $3,300?", pilihan: ["3 years","3.5 years","4 years","4.5 years"], benar: 2, penjelasan: "I = 3300 − 2500 = $800. t = 800 ÷ (2500 × 0.08) = 4 years." },
      { soal: "After 5 years at 10%/year simple interest, balance is $6,000. What was the principal?", pilihan: ["$3,500","$3,800","$4,000","$4,200"], benar: 2, penjelasan: "A = P × (1 + 5 × 0.10) = 1.5P. P = 6000 ÷ 1.5 = $4,000." },
      { soal: "Principal $5,000, 15% annual interest, 2 years. Total interest accumulated?", pilihan: ["$1,000","$1,500","$2,000","$2,500"], benar: 1, penjelasan: "I = 5000 × 2 × 0.15 = $1,500." },
    ],
    secRangkumanTitle: "Simple Interest Summary",
    rangkuman: [
      "Simple interest is always calculated from the INITIAL capital — it never compounds.",
      "I = P × r × t. Ensure the unit of t matches the unit of r (years vs months).",
      "Final Balance = Principal + Interest (don't forget to add!).",
      "To find the principal: P = A ÷ (1 + r × t).",
      "Time conversion: months ÷ 12 = years; years × 12 = months.",
      "Simple interest grows linearly (equal each period), unlike compound interest which is exponential.",
    ],
    rangkumanKoneksiTitle: "Real-Life Connections:",
    rangkumanKoneksiBody: "Bank Savings: Banks pay interest to depositors based on the initial deposit.\nLoans/Credit: Borrowers pay interest based on a fixed principal amount.\nInvestments: Bonds use simple interest concepts in their coupon calculations.",
  },
  ja: {
    title: "単利",
    subtitle: "中学1年 · 社会算数 · 数学",
    back: "← 社会算数に戻る",
    secIntroTitle: "単利とは？",
    introBody: "銀行にお金を預けたり借りたりすると、利息という追加のお金が発生します。単利（シンプル・インタレスト）は元金だけから計算される利息です — 複利のように毎年変化することはありません。これは最もシンプルな利息の種類で、金融理解の基礎となります。",
    analogiTitle: "💡 具体的な例え：",
    analogiBody: "友達から$500を借りて、毎月10%の利息を払う約束をしたとします。1ヶ月目の利息は$50。2ヶ月目は？やはり$50 — 元金から計算されるため、累積した合計からではありません。これが単利です。",
    konsepCards: [
      { judul: "元金 (M)", sub: "Capital / Principal", desc: "預けたり借りたりする最初のお金。Mは期間中変わらない。" },
      { judul: "利息 (B)", sub: "Interest", desc: "得られる/支払われる追加のお金。毎期間一定。" },
      { judul: "利率 (P)", sub: "Interest Rate", desc: "1期間あたりの利息の大きさ、%で表す。例：年6%。" },
      { judul: "期間 (W)", sub: "Time Period", desc: "預けたり借りたりする期間。単位はPの単位と一致させる。" },
    ],
    secRumusTitle: "単利の公式",
    rumusIntro: "マスターすべき重要な4つの公式：",
    rumus: [
      { warna: "amber", judul: "利息額の計算", rumus: String.raw`I = P \times r \times t`, ket: "I = 利息額（$）。tの単位はrに合わせる（年または月）。rは小数形式。" },
      { warna: "green", judul: "最終残高の計算", rumus: String.raw`A = P + I = P \times (1 + r \times t)`, ket: "最終残高 = 元金 + 累積した利息。" },
      { warna: "blue", judul: "元金を求める", rumus: String.raw`P = \frac{A}{1 + r \times t}`, ket: "元金が不明で最終残高がわかるとき使用。" },
      { warna: "purple", judul: "期間または利率を求める", rumus: String.raw`t = \frac{I}{P \times r}, \quad r = \frac{I}{P \times t}`, ket: "基本公式を整理してtまたはrを求める。" },
    ],
    secSatuanTitle: "時間の単位 — 間違えないように！",
    satuanIntro: "これが最も多い間違いの原因！期間（t）の単位は利率の期間（r）の単位と一致させなければなりません。",
    satuanTable: [["年利", "年利", "年利", "年","年","年", "tが月単位なら ÷ 12。日なら ÷ 365"],
      ["月利", "月利", "月利", "ヶ月","ヶ月","ヶ月", "tが年単位なら × 12。日なら ÷ 30"],
      ["日利", "日利", "日利", "日","日","日", "tが年単位なら × 365。月なら × 30"]],
    satuanEx: "📝 変換の例：",
    satuanExContent: "年利12%で9ヶ月 → t = 9 ÷ 12 = 0.75年\n月利2%で1.5年 → t = 1.5 × 12 = 18ヶ月",
    secKalkTitle: "単利計算機",
    kalkIntro: "以下のフィールドに入力して計算ボタンを押すと、結果がすぐに表示されます。",
    modalLabel: "元金",
    bungaLabel: "利率 (% 年/月)",
    waktuLabel: "期間（数値のみ）",
    satuanLabel: "期間の単位",
    tahunLabel: "年",
    bulanLabel: "ヶ月",
    hitungLabel: "今すぐ計算",
    resetLabel: "リセット",
    hasilLabel: "計算結果：",
    hasilModal: "元金",
    hasilBunga: "得られた利息",
    hasilTotal: "最終合計",
    carHitung: "計算方法：I =",
    phModal: "例：2000",
    phBunga: "例：6",
    phWaktu: "例：2",
    secVisualTitle: "お金の成長の可視化",
    visualDesc: "単利での",
    visualCaption: "元金",
    visualNote: "💡 注目：年ごとの利息は常に同じです。固定された元金から計算されるためです。成長は線形（直線）で、指数関数的ではありません。",
    tableTahun: "年目",
    tableBunga: "年ごとの利息",
    tableTotalBunga: "累積利息",
    tableTotalUang: "合計残高",
    secKesalahanTitle: "よくある間違いと重要なヒント",
    kesalahan: [
      { salah: "時間単位を変換せず、年利で9ヶ月をそのまま9として使う", benar: "まず変換：t = 9 ÷ 12 = 0.75年。tの単位は常にrの期間と一致させる。" },
      { salah: "累積合計（複利のように）から利息を計算する", benar: "単利：毎期間、利息は変わらない元金から計算される。合計残高からではない。" },
      { salah: "最終残高を求める際に元金に利息を加えるのを忘れる", benar: "最終残高 = 元金 + 利息。足し算を忘れずに。" },
      { salah: "公式にrをパーセント（例：6）のまま入れて小数（0.06）に変換しない", benar: "変換：r = 6% = 6/100 = 0.06として掛ける。" },
    ],
    secContohTitle: "例題と解説",
    soalContoh: [
      { level: "基本", warna: "green", no: 1, judul: "利息と最終残高の計算",
        soal: "Averyは年利6%の単利で$2,000を銀行に預けた。2年後の利息と合計残高はいくらか？",
        langkah: [
          { label: "既知", isi: "P = $2,000, r = 6% = 0.06, t = 2年" },
          { label: "求める", isi: "利息（I）と最終残高（A）" },
          { label: "解法", rumus: String.raw`I = 2000 \times 2 \times 0.06 = \$240` },
          { label: "", rumus: String.raw`A = 2000 + 240 = \$2{,}240` },
        ],
        jawaban: "利息 = $240 · 最終残高 = $2,240" },
      { level: "標準", warna: "yellow", no: 2, judul: "月単位の期間、年利",
        soal: "アニさんが年利18%の単利で$5,000を借りた。8ヶ月後の返済総額はいくらか？",
        langkah: [
          { label: "既知", isi: "P = $5,000, r = 18% = 0.18（年利）, t = 8ヶ月" },
          { label: "期間変換", isi: "年利 → tは年単位で：t = 8 ÷ 12 = 2/3年" },
          { label: "解法", rumus: String.raw`I = 5000 \times \frac{2}{3} \times 0.18 = \$600` },
          { label: "", rumus: String.raw`A = 5000 + 600 = \$5{,}600` },
        ],
        jawaban: "返済総額 = $5,600" },
      { level: "発展", warna: "red", no: 3, judul: "最終残高から元金を求める",
        soal: "年利8%の単利で2.5年後、Averyの合計残高が$3,600になった。元金はいくらか？",
        langkah: [
          { label: "既知", isi: "A = $3,600, r = 0.08, t = 2.5年 · Pを求める。" },
          { label: "解法", rumus: String.raw`A = P \times (1 + t \times r)` },
          { label: "", rumus: String.raw`3600 = P \times (1 + 2.5 \times 0.08) = P \times 1.2` },
          { label: "", rumus: String.raw`P = \frac{3600}{1.2} = \$3{,}000` },
        ],
        jawaban: "元金 = $3,000" },
    ],
    pembahasan: "解法ステップ：",
    secKuisTitle: "ミニクイズ — 理解度テスト！",
    kuisIntro: "単利に関する5問。解いてすぐに解説を確認！",
    soalLabel: "問題",
    quizBenar: "✓ 正解！",
    quizSalah: "✗ 惜しい。",
    sebelumnya: "← 前へ",
    lanjut: "次へ →",
    lihatHasil: "結果を見る",
    hasilKuis: "クイズ結果",
    benar: "正解",
    cobaLagi: "もう一度",
    quizPesan: ["すばらしい！単利をよく理解しています。", "よくできました！間違えた部分を復習しましょう。", "頑張って！教材を読み直してもう一度挑戦しましょう。"],
    quiz: [
      { soal: "元金$3,000、年利10%、3年。最終残高はいくらか？", pilihan: ["$3,600","$3,900","$4,200","$4,500"], benar: 1, penjelasan: "I = 3000 × 3 × 0.10 = $900。A = 3000 + 900 = $3,900。" },
      { soal: "元金$4,000、年利12%、9ヶ月。利息はいくらか？", pilihan: ["$360","$400","$480","$540"], benar: 0, penjelasan: "t = 9 ÷ 12 = 0.75年。I = 4000 × 0.75 × 0.12 = $360。" },
      { soal: "元金$2,500、年利8%。合計が$3,300になるまで何年かかるか？", pilihan: ["3年","3.5年","4年","4.5年"], benar: 2, penjelasan: "I = 3300 − 2500 = $800。t = 800 ÷ (2500 × 0.08) = 4年。" },
      { soal: "年利10%の単利で5年後$6,000になった。元金はいくらか？", pilihan: ["$3,500","$3,800","$4,000","$4,200"], benar: 2, penjelasan: "A = P × (1 + 5 × 0.10) = 1.5P。P = 6000 ÷ 1.5 = $4,000。" },
      { soal: "元金$5,000、年利15%、2年。累積利息の合計は？", pilihan: ["$1,000","$1,500","$2,000","$2,500"], benar: 1, penjelasan: "I = 5000 × 2 × 0.15 = $1,500。" },
    ],
    secRangkumanTitle: "単利まとめ",
    rangkuman: [
      "単利は常に変わらない元金から計算される — 複利のように重ならない。",
      "I = P × r × t。tの単位をrに合わせること（年 vs 月）。",
      "最終残高 = 元金 + 利息（足し算を忘れずに！）。",
      "元金を求めるには：P = A ÷ (1 + r × t)。",
      "時間変換：月 ÷ 12 = 年；年 × 12 = 月。",
      "単利は線形成長（各期間で同じ増加）。複利の指数関数的成長とは異なる。",
    ],
    rangkumanKoneksiTitle: "実生活とのつながり：",
    rangkumanKoneksiBody: "銀行預金：銀行は最初の預金額に基づいて預金者に利息を支払う。\nローン・クレジット：借り手は固定された元金に基づいて利息を支払う。\n投資：債券（ボンド）はクーポン計算に単利の概念を使用する。",
  },
};

const MiniKuis = ({ t }: { t: typeof translations.id }) => {
  const quizData = t.quiz;
  const [idx, setIdx] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [skor, setSkor] = useState(0);
  const [jawaban, setJawaban] = useState<(number | null)[]>(Array(quizData.length).fill(null));
  const q = quizData[idx];
  const pilih = (i: number) => { if (dipilih !== null) return; playPopSound(); setDipilih(i); const b = [...jawaban]; b[idx] = i; setJawaban(b); if (i === q.benar) setSkor(s => s + 1); };
  const lanjut = () => { playPopSound(); if (idx < quizData.length - 1) { setIdx(idx + 1); setDipilih(jawaban[idx + 1]); } else setSelesai(true); };
  const kembali = () => { playPopSound(); if (idx > 0) { setIdx(idx - 1); setDipilih(jawaban[idx - 1]); } };
  const ulang = () => { playPopSound(); setIdx(0); setDipilih(null); setSelesai(false); setSkor(0); setJawaban(Array(quizData.length).fill(null)); };
  if (selesai) {
    const pct = Math.round((skor / quizData.length) * 100);
    const warna = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
    return (
      <div className="text-center space-y-4 py-4">
        <Star className="w-12 h-12 text-amber-400 mx-auto" />
        <p className="font-body text-lg font-bold text-white">{t.hasilKuis}</p>
        <p className={`font-display text-4xl font-bold ${warna}`}>{skor}/{quizData.length}</p>
        <p className={`font-body text-sm ${warna}`}>{pct}% {t.benar}</p>
        <p className="font-body text-sm text-white/60">{pct >= 80 ? t.quizPesan[0] : pct >= 60 ? t.quizPesan[1] : t.quizPesan[2]}</p>
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {quizData.map((q, i) => (<div key={i} className={`h-8 rounded-lg flex items-center justify-center ${jawaban[i] === q.benar ? "bg-green-500/30 border border-green-500" : "bg-red-500/30 border border-red-500"}`}>{jawaban[i] === q.benar ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}</div>))}
        </div>
        <button onClick={ulang} className="inline-flex items-center gap-2 bg-primary/20 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-primary/30 transition-colors"><RefreshCw className="w-4 h-4" /> {t.cobaLagi}</button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">{quizData.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : jawaban[i] !== null ? (jawaban[i] === quizData[i].benar ? "w-3 bg-green-500" : "w-3 bg-red-500") : "w-3 bg-white/20"}`} />))}</div>
        <span className="font-body text-xs text-white/40">{t.soalLabel} {idx + 1}/{quizData.length}</span>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-4"><p className="font-body text-sm text-white leading-relaxed">{q.soal}</p></div>
      <div className="space-y-2">
        {q.pilihan.map((p, i) => {
          let cls = "bg-slate-800/60 border-border text-white/80 hover:border-primary/50";
          if (dipilih !== null) { if (i === q.benar) cls = "bg-green-500/20 border-green-500 text-green-300"; else if (i === dipilih && i !== q.benar) cls = "bg-red-500/20 border-red-500 text-red-300"; else cls = "bg-slate-800/30 border-border text-white/30"; }
          return (<button key={i} onClick={() => pilih(i)} className={`w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-all flex items-center gap-3 ${cls}`}><span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">{String.fromCharCode(65 + i)}</span>{p}{dipilih !== null && i === q.benar && <CheckCircle className="w-4 h-4 text-green-400 ml-auto shrink-0" />}{dipilih !== null && i === dipilih && i !== q.benar && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}</button>);
        })}
      </div>
      {dipilih !== null && (<div className={`rounded-lg p-4 border ${dipilih === q.benar ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}><p className={`font-body text-xs font-semibold mb-1 ${dipilih === q.benar ? "text-green-400" : "text-red-400"}`}>{dipilih === q.benar ? t.quizBenar : t.quizSalah}</p><p className="font-body text-xs text-white/70">{q.penjelasan}</p></div>)}
      <div className="flex justify-between gap-3">
        <button onClick={kembali} disabled={idx === 0} className="px-4 py-2 rounded-lg text-sm font-body font-semibold border border-border text-white/60 hover:border-primary/50 disabled:opacity-30 transition-all">{t.sebelumnya}</button>
        <button onClick={lanjut} disabled={dipilih === null} className="flex-1 px-4 py-2 rounded-lg text-sm font-body font-semibold bg-primary/20 border border-primary text-primary hover:bg-primary/30 disabled:opacity-30 transition-all">{idx < quizData.length - 1 ? t.lanjut : t.lihatHasil}</button>
      </div>
    </div>
  );
};

const Section = ({ id, expanded, onToggle, icon, title, children }: { id: string; expanded: boolean; onToggle: (id: string) => void; icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
    <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"><div className="flex items-center gap-3">{icon}<span className="font-body font-semibold text-white">{title}</span></div>{expanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}</button>
    {expanded && <div className="px-5 pb-5">{children}</div>}
  </div>
);

const BungaTunggalPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (language as Lang) ?? "id";
  const t = translations[lang] ?? translations.id;
  const fmt = makeFmt(lang);
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro","konsep","rumus","satuan","kalkulator","visual","kesalahan","contoh","kuis","rangkuman"]);
  const toggleSection = (s: string) => { playPopSound(); setExpandedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); };

  const [modal, setModal] = useState(""); const [bunga, setBunga] = useState(""); const [waktu, setWaktu] = useState("");
  const [satuanWaktu, setSatuanWaktu] = useState<"tahun"|"bulan">("tahun");
  const [kalcResult, setKalcResult] = useState<{bungaRp:number;totalRp:number;waktuTahun:number}|null>(null);

  const hitungBunga = () => {
    playPopSound();
    const M = parseNum(modal), P = parseNum(bunga) / 100, W = parseNum(waktu);
    if (!M || !P || !W) return;
    const waktuTahun = satuanWaktu === "bulan" ? W / 12 : W;
    const bungaRp = M * waktuTahun * P;
    setKalcResult({ bungaRp, totalRp: M + bungaRp, waktuTahun });
  };
  const resetKalkulator = () => { playPopSound(); setModal(""); setBunga(""); setWaktu(""); setKalcResult(null); };

  const timelineYears = [0, 1, 2, 3, 4, 5];
  const vizBase = lang === "id" ? 1000000 : 1000;
  const vizRate = 0.2;
  const vizMax = vizBase * (1 + 5 * vizRate);

  const satuanRows = t.satuanTable;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <Section id="intro" expanded={expandedSections.includes("intro")} onToggle={toggleSection}
            icon={<Lightbulb className="w-5 h-5 text-yellow-400" />} title={t.secIntroTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.analogiTitle}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.analogiBody}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {t.konsepCards.map((k, i) => {
                  const colors = ["amber","green","blue","purple"];
                  return (
                    <div key={i} className={`bg-${colors[i]}-500/10 border border-${colors[i]}-500/30 rounded-xl p-3`}>
                      <p className={`font-body text-sm font-bold text-${colors[i]}-300 mb-0.5`}>{k.judul}</p>
                      <p className={`font-body text-xs text-${colors[i]}-400/70 mb-2`}>{k.sub}</p>
                      <p className="font-body text-xs text-white/60 leading-relaxed">{k.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          <Section id="rumus" expanded={expandedSections.includes("rumus")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-green-400" />} title={t.secRumusTitle}>
            <div className="space-y-4">
              <p className="font-body text-xs text-white/50 mb-2">{t.rumusIntro}</p>
              {t.rumus.map((r) => (
                <div key={r.judul} className={`bg-${r.warna}-500/10 border border-${r.warna}-500/30 rounded-xl p-4 space-y-2`}>
                  <p className={`font-body text-sm font-semibold text-${r.warna}-300`}>{r.judul}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3"><BlockMath math={r.rumus} /></div>
                  <p className="font-body text-xs text-white/50 italic">{r.ket}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="satuan" expanded={expandedSections.includes("satuan")} onToggle={toggleSection}
            icon={<Clock className="w-5 h-5 text-orange-400" />} title={t.secSatuanTitle}>
            <div className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-orange-200 leading-relaxed">{t.satuanIntro}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-body text-sm border-collapse">
                  <thead>
                    <tr className="bg-orange-500/20">
                      <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30 text-xs">{lang === "id" ? "Bunga Per..." : lang === "ja" ? "利率..." : "Rate Per..."}</th>
                      <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30 text-xs">{lang === "id" ? "Satuan W" : lang === "ja" ? "単位" : "Unit of t"}</th>
                      <th className="px-3 py-2 text-orange-300 text-left border border-orange-500/30 text-xs">{lang === "id" ? "Konversi Jika Perlu" : lang === "ja" ? "変換が必要な場合" : "Conversion if Needed"}</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {satuanRows.map((row, i) => (
                      <tr key={i} className={`border border-orange-500/20 ${i % 2 !== 0 ? "bg-slate-800/30" : ""}`}>
                        <td className="px-3 py-2 text-xs">{lang === "id" ? row[0] : lang === "ja" ? row[2] : row[1]}</td>
                        <td className="px-3 py-2 text-xs font-bold text-orange-300">{lang === "id" ? row[3] : lang === "ja" ? row[5] : row[4]}</td>
                        <td className="px-3 py-2 text-xs">{row[6]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-2">
                <p className="font-body text-xs font-semibold text-yellow-300">{t.satuanEx}</p>
                <div className="space-y-1 font-body text-xs text-white/70 whitespace-pre-line">{t.satuanExContent}</div>
              </div>
            </div>
          </Section>

          <BankSimulasi />

          <div className="rounded-xl overflow-hidden shadow-lg shadow-amber-500/10" style={{background:"linear-gradient(135deg,#1a1200 0%,#2a1a00 40%,#1a1200 100%)",border:"2px solid rgba(251,191,36,0.5)"}}>
            <button onClick={() => toggleSection("kalkulator")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer" style={{background:"linear-gradient(90deg,rgba(251,191,36,0.18) 0%,rgba(251,191,36,0.07) 100%)"}}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:"rgba(251,191,36,0.2)",border:"1px solid rgba(251,191,36,0.4)"}}>
                  <Calculator className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="font-body font-bold text-amber-200 block leading-tight">🧮 {t.secKalkTitle}</span>
                  <span className="font-body text-[10px] text-amber-400/70">{t.kalkIntro}</span>
                </div>
                <span className="ml-1 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">{lang === "id" ? "COBA!" : lang === "ja" ? "試す!" : "TRY!"}</span>
              </div>
              {expandedSections.includes("kalkulator") ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
            </button>
            {expandedSections.includes("kalkulator") && (
              <div className="px-5 pb-5 space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 flex items-center gap-1 font-semibold"><DollarSign className="w-3 h-3" /> {t.modalLabel}</label>
                    <input type="number" value={modal} onChange={e => { setModal(e.target.value); setKalcResult(null); }} placeholder={t.phModal} className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none" style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.3)"}} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 flex items-center gap-1 font-semibold"><Percent className="w-3 h-3" /> {t.bungaLabel}</label>
                    <input type="number" value={bunga} onChange={e => { setBunga(e.target.value); setKalcResult(null); }} placeholder={t.phBunga} className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none" style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.3)"}} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 flex items-center gap-1 font-semibold"><Clock className="w-3 h-3" /> {t.waktuLabel}</label>
                    <input type="number" value={waktu} onChange={e => { setWaktu(e.target.value); setKalcResult(null); }} placeholder={t.phWaktu} className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none" style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.3)"}} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-xs text-amber-300/80 font-semibold">{t.satuanLabel}</label>
                    <div className="flex gap-2">
                      {(["tahun","bulan"] as const).map(s => (
                        <button key={s} onClick={() => { setSatuanWaktu(s); setKalcResult(null); playPopSound(); }} className="flex-1 py-2.5 rounded-lg text-xs font-body font-bold transition-all" style={satuanWaktu === s ? {background:"rgba(251,191,36,0.25)",border:"1.5px solid rgba(251,191,36,0.8)",color:"#fbbf24"} : {background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.2)",color:"rgba(251,191,36,0.4)"}}>
                          {s === "tahun" ? t.tahunLabel : t.bulanLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={hitungBunga} className="flex-1 font-body font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95" style={{background:"linear-gradient(90deg,#d97706,#f59e0b)",color:"#1a1200"}}>
                    <Zap className="w-4 h-4" /> {t.hitungLabel}
                  </button>
                  <button onClick={resetKalkulator} className="px-4 rounded-lg font-body text-sm py-3" style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",color:"rgba(251,191,36,0.5)"}}>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                {kalcResult && (
                  <div className="rounded-xl p-4 space-y-3 animate-slide-up" style={{background:"rgba(251,191,36,0.07)",border:"1.5px solid rgba(251,191,36,0.35)"}}>
                    <p className="font-body text-xs font-bold text-amber-300">✅ {t.hasilLabel}</p>
                    <div className="space-y-2">
                      {[
                        { label: t.hasilModal, val: fmt(parseNum(modal)), cls: "text-white" },
                        { label: t.hasilBunga, val: "+" + fmt(kalcResult.bungaRp), cls: "text-green-400" },
                      ].map((r) => (
                        <div key={r.label} className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background:"var(--bg-secondary)"}}>
                          <span className="font-body text-xs text-amber-200/60">{r.label}</span>
                          <span className={`font-body text-sm font-bold ${r.cls}`}>{r.val}</span>
                        </div>
                      ))}
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{background:"linear-gradient(90deg,rgba(251,191,36,0.2),rgba(251,191,36,0.1))",border:"1px solid rgba(251,191,36,0.4)"}}>
                        <span className="font-body text-sm font-bold text-amber-200">{t.hasilTotal}</span>
                        <span className="font-body text-lg font-black text-amber-300">{fmt(kalcResult.totalRp)}</span>
                      </div>
                    </div>
                    <div className="rounded-lg p-3" style={{background:"var(--bg-secondary)",border:"1px dashed rgba(251,191,36,0.2)"}}>
                      <p className="font-body text-xs text-amber-300/60 text-center">
                        {t.carHitung} {fmt(parseNum(modal))} × {kalcResult.waktuTahun} × {(parseNum(bunga)/100).toFixed(2)} = {fmt(kalcResult.bungaRp)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Section id="visual" expanded={expandedSections.includes("visual")} onToggle={toggleSection}
            icon={<TrendingUp className="w-5 h-5 text-green-400" />} title={t.secVisualTitle}>
            <div className="space-y-4">
              <p className="font-body text-xs text-white/60">
                {lang === "id" ? `Ilustrasi di bawah ini menunjukkan bagaimana uang Rp1.000.000 ${t.visualDesc} 20% per tahun tumbuh selama 5 tahun.` : lang === "ja" ? `$1,000の元金が${t.visualDesc}年利20%で5年間成長する様子。` : `Illustration of how $1,000 grows ${t.visualDesc} at 20% per year over 5 years.`}
              </p>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-end gap-2 h-40 justify-around">
                  {timelineYears.map(y => {
                    const val = vizBase * (1 + y * vizRate);
                    const pct = (val / vizMax) * 100;
                    const label = lang === "id" ? `${(val/1000000).toFixed(1)}jt` : `$${(val/1000).toFixed(1)}k`;
                    return (
                      <div key={y} className="flex flex-col items-center gap-1 flex-1">
                        <span className="font-body text-[10px] text-green-300 font-bold">{label}</span>
                        <div className="w-full rounded-t-md bg-gradient-to-t from-green-600 to-green-400" style={{height:`${pct}%`,minHeight:"8px"}} />
                        <span className="font-body text-[10px] text-white/50">{lang === "id" ? `Th-${y}` : lang === "ja" ? `${y}年` : `Yr ${y}`}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="font-body text-[10px] text-white/40 text-center mt-2">{t.visualCaption} {lang === "id" ? "Rp1.000.000" : "$1,000"} · {lang === "id" ? "Bunga 20%/tahun" : lang === "ja" ? "年利20%" : "20%/year"}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-body text-xs border-collapse">
                  <thead>
                    <tr className="bg-green-500/20">
                      {[t.tableTahun, t.tableBunga, t.tableTotalBunga, t.tableTotalUang].map(h => (
                        <th key={h} className="px-3 py-2 text-green-300 text-left border border-green-500/20">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[1,2,3,4,5].map(y => (
                      <tr key={y} className={`border border-green-500/10 ${y%2===0?"bg-slate-800/30":""}`}>
                        <td className="px-3 py-2 font-bold text-white">{y}</td>
                        <td className="px-3 py-2 text-green-300">{fmt(vizBase * vizRate)}</td>
                        <td className="px-3 py-2 text-green-300">{fmt(y * vizBase * vizRate)}</td>
                        <td className="px-3 py-2 font-bold text-white">{fmt(vizBase + y * vizBase * vizRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-xs text-yellow-200">{t.visualNote}</p>
              </div>
            </div>
          </Section>

          <Section id="kesalahan" expanded={expandedSections.includes("kesalahan")} onToggle={toggleSection}
            icon={<AlertCircle className="w-5 h-5 text-red-400" />} title={t.secKesalahanTitle}>
            <div className="space-y-3">
              {t.kesalahan.map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="font-body text-xs text-red-300">{item.salah}</p></div>
                  <div className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /><p className="font-body text-xs text-green-300">{item.benar}</p></div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="contoh" expanded={expandedSections.includes("contoh")} onToggle={toggleSection}
            icon={<BookOpen className="w-5 h-5 text-blue-400" />} title={t.secContohTitle}>
            <div className="space-y-6">
              {t.soalContoh.map(c => (
                <div key={c.no} className={`border-l-4 border-${c.warna}-500 pl-4 space-y-3`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`bg-${c.warna}-500/20 text-${c.warna}-400 text-xs font-bold px-2 py-1 rounded`}>{c.level}</span>
                    <span className="font-body font-semibold text-white text-sm">{lang === "id" ? `Contoh ${c.no}` : lang === "ja" ? `例題${c.no}` : `Example ${c.no}`} – {c.judul}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4"><p className="font-body text-sm text-white">{c.soal}</p></div>
                  <div className={`bg-${c.warna}-500/5 border border-${c.warna}-500/20 rounded-xl p-4 space-y-3`}>
                    <p className={`font-body text-xs font-semibold text-${c.warna}-400`}>{t.pembahasan}</p>
                    {c.langkah.map((l, li) => (
                      <div key={li}>
                        {l.label && <p className="font-body text-xs text-white/50 mb-1">✦ {l.label}:</p>}
                        {"rumus" in l ? <div className="bg-slate-900/50 rounded p-3"><BlockMath math={l.rumus} /></div> : <p className="font-body text-sm text-white/80 pl-3">{l.isi}</p>}
                      </div>
                    ))}
                    <div className={`bg-${c.warna}-500/10 rounded-lg p-3`}><p className={`font-body text-sm font-semibold text-${c.warna}-300`}>✓ {c.jawaban}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="kuis" expanded={expandedSections.includes("kuis")} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-amber-400" />} title={t.secKuisTitle}>
            <div>
              <p className="font-body text-xs text-white/50 mb-4">{t.kuisIntro}</p>
              <MiniKuis t={t} />
            </div>
          </Section>

          <Section id="rangkuman" expanded={expandedSections.includes("rangkuman")} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-yellow-400" />} title={t.secRangkumanTitle}>
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-border rounded-xl p-4 space-y-3">
                {t.rangkuman.map((poin, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                    <p className="font-body text-sm text-white/80">{poin}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-amber-300 mb-2">{t.rangkumanKoneksiTitle}</p>
                <p className="font-body text-xs text-white/70 whitespace-pre-line">{t.rangkumanKoneksiBody}</p>
              </div>
            </div>
          </Section>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aritmetika-sosial"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">{t.back}</button>
        </div>
      </div>
    </div>
  );
};

export default BungaTunggalPage;
