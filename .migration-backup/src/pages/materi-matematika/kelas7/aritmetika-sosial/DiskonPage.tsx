import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import WarungDiskon from "@/components/WarungDiskon";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, AlertCircle, Star, HelpCircle,
  CheckCircle, XCircle, RefreshCw, ShoppingBag, TrendingDown,
  Tag, ArrowRight, Percent
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
    title: "DISKON (POTONGAN HARGA)",
    subtitle: "Kelas 7 · Aritmetika Sosial · Materi Matematika",
    back: "← Kembali ke Aritmetika Sosial",
    secIntroTitle: "Apa itu Diskon?",
    introBody: "Saat belanja online atau ke mal, kita sering melihat harga yang dicoret dengan angka baru di bawahnya. Itulah diskon — potongan harga yang diberikan penjual, dinyatakan dalam bentuk persen dari harga asli.",
    cardHargaAwal: "Harga Awal", cardHargaAwalDesc: "Harga sebelum ada potongan (biasanya dicoret)",
    cardBesarDiskon: "Besar Diskon", cardBesarDiskonDesc: "Jumlah rupiah yang dipotong dari harga awal",
    cardHargaBayar: "Harga Bayar", cardHargaBayarDesc: "Harga yang benar-benar harus dibayar pembeli",
    prinsipTitle: "🔑 Prinsip Paling Penting:",
    prinsipBody: "Diskon selalu dihitung dari harga AWAL, bukan dari harga bayar. Ini adalah aturan dasar yang tidak boleh tertukar!",
    contohLabel: "Contoh di kehidupan nyata:",
    hematLabel: "Hemat",
    bayarHanya: "bayar hanya",
    diskonBadge: "DISKON",
    secRumusTitle: "Semua Rumus Diskon",
    rumusIntro: "Ada 4 jenis rumus yang perlu dikuasai:",
    rumus: [
      { no: "1", warna: "green", judul: "Menghitung Besar Diskon (dalam Rupiah)",
        rumus: String.raw`\text{Besar Diskon} = \frac{\%\text{Diskon}}{100} \times \text{Harga Awal}`,
        contoh: "Diskon 25% dari Rp400.000 = 0,25 × Rp400.000 = Rp100.000" },
      { no: "2", warna: "cyan", judul: "Menghitung Harga Bayar",
        rumus: String.raw`\text{Harga Bayar} = \left(1 - \frac{\%\text{Diskon}}{100}\right) \times \text{Harga Awal}`,
        contoh: "Diskon 25%: Harga Bayar = (1 − 0,25) × Rp400.000 = 0,75 × Rp400.000 = Rp300.000" },
      { no: "3", warna: "purple", judul: "Mencari Harga Awal (bila harga bayar diketahui)",
        rumus: String.raw`\text{Harga Awal} = \frac{\text{Harga Bayar}}{1 - \frac{\%\text{Diskon}}{100}}`,
        contoh: "Harga bayar Rp300.000 setelah diskon 25%: Harga Awal = Rp300.000 ÷ 0,75 = Rp400.000" },
      { no: "4", warna: "orange", judul: "Mencari Persen Diskon",
        rumus: String.raw`\%\text{Diskon} = \frac{\text{Harga Awal} - \text{Harga Bayar}}{\text{Harga Awal}} \times 100\%`,
        contoh: "Harga awal Rp400.000, harga bayar Rp300.000: % diskon = (100.000 ÷ 400.000) × 100% = 25%" },
    ],
    tipsCepat: "Tips Cepat: Jika diskon",
    tipsCepatMid: "maka kamu hanya membayar",
    tipsCepatEnd: "dari harga asli. Diskon 30% → bayar 70%. Diskon 15% → bayar 85%. Langsung kalikan saja!",
    secVisualTitle: "Visualisasi: Memahami Diskon Secara Visual",
    visualDesc: "Bayangkan harga asli sebagai 100%. Bagian merah dipotong (diskon), bagian biru yang kamu bayar.",
    visualBarLabel: "Diskon {p}% → Bayar {q}%",
    visualNote: "Perhatikan: Semakin besar diskon (merah), semakin sedikit yang harus dibayar (biru). Totalnya selalu 100% — jumlah diskon dan yang dibayar tidak pernah melebihi atau kurang dari harga asal.",
    secKalkTitle: "Kalkulator Diskon Interaktif",
    kalkIntro: "Coba sendiri! Pilih jenis perhitungan, masukkan angka, dan lihat hasilnya langsung.",
    secGandaTitle: "Diskon Ganda (Double Discount)",
    gandaBody: 'Promo "Diskon 20% + 10%" TIDAK SAMA dengan diskon 30%!',
    gandaRumusTitle: "Rumus Diskon Ganda (Cara Cepat):",
    gandaD1: "diskon pertama (%),",
    gandaD2: "diskon kedua (%)",
    gandaIlust: "ILUSTRASI LENGKAP: Diskon 20% + 10% dari",
    gandaHargaAwal: "Harga Awal",
    gandaSetelah1: "Setelah diskon 20%: 80% ×",
    gandaSetelah2: "Setelah diskon 10%: 90% ×",
    gandaSalahLabel: "Jika dijumlah (SALAH)",
    gandaBenarLabel: "Diskon Ganda (BENAR)",
    gandaSelisih: "Diskon efektif = 28%, bukan 30%! (Selisih",
    secPersenDiskonTitle: "Mencari Persen Diskon dari Dua Harga",
    persenDiskonBody: "Terkadang kita tahu harga awal dan harga jual, lalu perlu mencari berapa persen diskonnya. Ini sering muncul dalam soal cerita.",
    persenDiskonRumusTitle: "Rumus mencari persen diskon:",
    persenDiskonContohLabel: "CONTOH SOAL:",
    persenDiskonContohSoal: "Sepatu seharga Rp750.000 dijual dengan harga Rp525.000. Berapa persen diskonnya?",
    persenDiskonResult: "Diskon sebesar 30%.",
    secContohTitle: "Contoh Soal dan Pembahasan Lengkap",
    soalContoh: [
      { level: "MUDAH", warna: "green", no: 1, judul: "Diskon Tunggal – Mencari Harga Bayar",
        soal: "Sebuah kemeja seharga Rp280.000 mendapat diskon 25%. Berapa harga yang harus dibayar?",
        langkah: [
          { label: "Diketahui", isi: "Harga awal = Rp280.000, Diskon = 25%" },
          { label: "Ditanya", isi: "Harga bayar = ?" },
          { label: "Penyelesaian", rumus: String.raw`\text{Harga Bayar} = (100\% - 25\%) \times 280.000 = 75\% \times 280.000 = \text{Rp}210.000` },
        ],
        jawaban: "Harga bayar = Rp210.000 (hemat Rp70.000)" },
      { level: "MUDAH", warna: "green", no: 2, judul: "Diskon Tunggal – Mencari Persen Diskon",
        soal: "Harga jaket sebelum diskon Rp600.000, setelah diskon harganya menjadi Rp420.000. Berapa persen diskonnya?",
        langkah: [
          { label: "Diketahui", isi: "Harga awal = Rp600.000, Harga bayar = Rp420.000" },
          { label: "Ditanya", isi: "% Diskon = ?" },
          { label: "Penyelesaian", rumus: String.raw`\%\text{Diskon} = \frac{600.000 - 420.000}{600.000} \times 100\% = 30\%` },
        ],
        jawaban: "Diskon sebesar 30%" },
      { level: "SEDANG", warna: "yellow", no: 3, judul: "Mencari Harga Asli dari Harga Bayar",
        soal: "Sebuah tas dijual dengan diskon 35% dan kamu membayar Rp312.000. Berapakah harga asli tas tersebut?",
        langkah: [
          { label: "Diketahui", isi: "Harga bayar = Rp312.000, Diskon = 35%" },
          { label: "Ditanya", isi: "Harga awal = ?" },
          { label: "Penyelesaian", rumus: String.raw`\text{Harga Awal} = \frac{312.000}{0{,}65} = \text{Rp}480.000` },
        ],
        jawaban: "Harga asli tas = Rp480.000" },
      { level: "SEDANG", warna: "yellow", no: 4, judul: "Diskon Ganda",
        soal: 'Sebuah toko memberikan promo "Diskon 15% + 10%" untuk sepatu seharga Rp500.000. Berapa harga yang dibayar? Berapa diskon efektifnya?',
        langkah: [
          { label: "Diketahui", isi: "Harga awal = Rp500.000, d₁ = 15%, d₂ = 10%" },
          { label: "Ditanya", isi: "Harga bayar dan % diskon efektif" },
          { label: "Langkah 1 – Setelah diskon 15%", rumus: String.raw`85\% \times 500.000 = \text{Rp}425.000` },
          { label: "Langkah 2 – Setelah diskon 10%", rumus: String.raw`90\% \times 425.000 = \text{Rp}382.500` },
          { label: "Diskon Efektif", rumus: String.raw`\%\text{efektif} = \frac{500.000 - 382.500}{500.000} \times 100\% = 23{,}5\%` },
        ],
        jawaban: "Harga bayar = Rp382.500 | Diskon efektif = 23,5% (bukan 25%!)" },
      { level: "SULIT", warna: "red", no: 5, judul: "Diskon Ganda + Untung Rugi",
        soal: "Seorang pedagang membeli jaket seharga Rp400.000. Ia menjualnya dengan harga label Rp650.000, lalu memberikan diskon 20% + 10%. Apakah pedagang untung atau rugi? Berapa?",
        langkah: [
          { label: "Diketahui", isi: "Modal = Rp400.000, Harga label = Rp650.000, Diskon ganda 20% + 10%" },
          { label: "Langkah 1 – Harga setelah diskon 20%", rumus: String.raw`80\% \times 650.000 = \text{Rp}520.000` },
          { label: "Langkah 2 – Harga setelah diskon 10%", rumus: String.raw`90\% \times 520.000 = \text{Rp}468.000` },
          { label: "Langkah 3 – Untung/Rugi", rumus: String.raw`\text{Untung} = 468.000 - 400.000 = \text{Rp}68.000` },
        ],
        jawaban: "Pedagang masih UNTUNG Rp68.000 meski memberikan diskon ganda." },
    ],
    pembahasan: "PEMBAHASAN:",
    secKesalahanTitle: "Kesalahan Umum yang Sering Terjadi",
    kesalahan: [
      { salah: "Menganggap diskon 20% + 10% = diskon 30%", benar: "Diskon ganda TIDAK dijumlahkan. Hitung bertahap: diskon kedua dari harga setelah diskon pertama. Diskon efektifnya = 28%, bukan 30%." },
      { salah: "Menghitung diskon dari harga bayar, bukan harga asli", benar: "Diskon selalu dihitung berdasarkan harga AWAL (sebelum diskon). Harga bayar hanya hasil akhir, bukan acuan perhitungan." },
      { salah: "Lupa mengonversi % ke desimal (misal: 25% ditulis langsung 25, bukan 0,25)", benar: "Selalu bagi dengan 100 saat menghitung: diskon 25% = 25 ÷ 100 = 0,25." },
      { salah: "Mencari harga asli dengan mengurangkan diskon dari harga bayar", benar: "Untuk mencari harga asli, gunakan rumus: Harga Asli = Harga Bayar ÷ (1 − %Diskon)." },
    ],
    secKuisTitle: "Uji Pemahamanmu — Mini Kuis (5 Soal)",
    kuisIntro: "Selesaikan 5 soal ini untuk mengecek pemahaman kamu. Jawaban dan penjelasan langsung muncul setelah memilih!",
    soalLabel: "Soal",
    quizBenar: "✓ Benar!",
    quizSalah: "✗ Belum tepat.",
    sebelumnya: "← Sebelumnya",
    lanjut: "Lanjut →",
    lihatHasil: "Lihat Hasil",
    hasilKuis: "Hasil Kuis",
    benar: "Benar",
    cobaLagi: "Coba Lagi",
    quizPesan: ["Luar biasa! Kamu sangat memahami materi diskon.", "Bagus! Coba pelajari lagi bagian yang belum tepat.", "Tetap semangat! Baca kembali materinya dan coba lagi."],
    quiz: [
      { soal: "Sebuah sepatu seharga Rp450.000 mendapat diskon 20%. Berapa harga yang harus dibayar?", pilihan: ["Rp90.000","Rp360.000","Rp380.000","Rp400.000"], benar: 1, penjelasan: "Harga Bayar = (100% − 20%) × Rp450.000 = 80% × Rp450.000 = Rp360.000" },
      { soal: "Sebuah tas dijual seharga Rp312.000 setelah diskon 35%. Berapakah harga asli tas tersebut?", pilihan: ["Rp420.000","Rp460.000","Rp480.000","Rp500.000"], benar: 2, penjelasan: "Harga Asli = Rp312.000 ÷ (100% − 35%) = Rp312.000 ÷ 0,65 = Rp480.000" },
      { soal: 'Promo "Diskon 20% + 10%" dari harga Rp200.000. Berapa harga yang dibayar?', pilihan: ["Rp140.000","Rp144.000","Rp160.000","Rp180.000"], benar: 1, penjelasan: "Diskon 20%: Rp200.000 × 80% = Rp160.000. Diskon 10%: Rp160.000 × 90% = Rp144.000." },
      { soal: "Harga asal sebuah jaket Rp600.000, dijual dengan harga Rp420.000. Berapa persen diskonnya?", pilihan: ["25%","28%","30%","35%"], benar: 2, penjelasan: "Selisih = Rp600.000 − Rp420.000 = Rp180.000. % Diskon = Rp180.000 ÷ Rp600.000 × 100% = 30%" },
      { soal: "Harga celana setelah diskon 25% adalah Rp225.000. Berapa harga aslinya?", pilihan: ["Rp280.000","Rp300.000","Rp320.000","Rp350.000"], benar: 1, penjelasan: "Harga Asli = Rp225.000 ÷ (100% − 25%) = Rp225.000 ÷ 0,75 = Rp300.000" },
    ],
    secRangkumanTitle: "Rangkuman Materi Diskon",
    rangkuman: [
      "Diskon = potongan harga dinyatakan dalam persen, selalu dihitung dari harga AWAL.",
      "Besar Diskon (Rp) = (%Diskon ÷ 100) × Harga Awal.",
      "Harga Bayar = (100% − %Diskon) × Harga Awal. Cara cepat: kalikan sisa persen langsung.",
      "Harga Awal = Harga Bayar ÷ (1 − %Diskon). Dipakai saat harga bayar diketahui.",
      "%Diskon = (Selisih Harga ÷ Harga Awal) × 100%. Dipakai saat dua harga diketahui.",
      "Diskon ganda (mis. 20%+10%) TIDAK sama dengan 30%. Hitung bertahap, diskon efektifnya = 28%.",
      "Diskon sering dikombinasikan dengan PPN (pajak) dan untung-rugi dalam soal cerita.",
    ],
    rangkumanKoneksiTitle: "Koneksi ke Materi Lain:",
    rangkumanKoneksiBody: "PPN: Diskon dihitung dulu, PPN dihitung dari harga SETELAH diskon.\nUntung-Rugi: Pedagang memberikan diskon tapi harga bayar akhir harus lebih besar dari modal.\nPersentase: Diskon adalah aplikasi nyata dari konsep persen dan proporsi.",
    kalkModeHarga: "Hitung Harga Bayar",
    kalkModeCari: "Cari Harga Awal",
    kalkModePersen: "Cari % Diskon",
    kalkModeGanda: "Diskon Ganda",
    kalkHargaAwalLabel: "Harga Awal",
    kalkHargaBayarLabel: "Harga Bayar",
    kalkDiskonLabel: "Diskon (%)",
    kalkD1Label: "Diskon 1 (%)",
    kalkD2Label: "Diskon 2 (%)",
    kalkHasilDiskon: "Diskon",
    kalkHasilBayar: "Harga Bayar",
    kalkHasilAsli: "Harga Asli",
    kalkHasilPersen: "% Diskon",
    kalkEfektif: "Diskon Efektif",
    kalkPH: "mis. 300000",
    kalkPHBayar: "mis. 240000",
    kalkPHPersen: "mis. 25",
    kalkDesc1: "Masukkan harga awal dan persen diskon → dapatkan besar diskon & harga bayar.",
    kalkDesc2: "Masukkan harga bayar dan persen diskon → temukan harga asli sebelum diskon.",
    kalkDesc3: "Masukkan harga awal dan harga bayar → hitung berapa persen diskonnya.",
    kalkDesc4: "Masukkan dua diskon bertahap → lihat diskon efektif sebenarnya.",
    contoRumus: "Contoh:",
  },
  en: {
    title: "DISCOUNT",
    subtitle: "Grade 7 · Social Arithmetic · Mathematics",
    back: "← Back to Social Arithmetic",
    secIntroTitle: "What is a Discount?",
    introBody: "When shopping online or at a mall, we often see a price crossed out with a new price below it. That is a discount — a price reduction given by the seller, expressed as a percentage of the original price.",
    cardHargaAwal: "Original Price", cardHargaAwalDesc: "Price before any reduction (usually crossed out)",
    cardBesarDiskon: "Discount Amount", cardBesarDiskonDesc: "The dollar amount deducted from the original price",
    cardHargaBayar: "Price Paid", cardHargaBayarDesc: "The actual price the buyer pays",
    prinsipTitle: "🔑 Most Important Principle:",
    prinsipBody: "Discounts are always calculated from the ORIGINAL price, not the price paid. This is the fundamental rule that must never be confused!",
    contohLabel: "Real-life example:",
    hematLabel: "Save",
    bayarHanya: "pay only",
    diskonBadge: "DISCOUNT",
    secRumusTitle: "All Discount Formulas",
    rumusIntro: "There are 4 types of formulas to master:",
    rumus: [
      { no: "1", warna: "green", judul: "Calculating the Discount Amount (in dollars)",
        rumus: String.raw`\text{Discount} = \frac{\%\text{Discount}}{100} \times \text{Original Price}`,
        contoh: "25% discount on $400 = 0.25 × $400 = $100" },
      { no: "2", warna: "cyan", judul: "Calculating the Price Paid",
        rumus: String.raw`\text{Price Paid} = \left(1 - \frac{\%\text{Discount}}{100}\right) \times \text{Original Price}`,
        contoh: "25% discount: Price Paid = (1 − 0.25) × $400 = 0.75 × $400 = $300" },
      { no: "3", warna: "purple", judul: "Finding the Original Price (when price paid is known)",
        rumus: String.raw`\text{Original Price} = \frac{\text{Price Paid}}{1 - \frac{\%\text{Discount}}{100}}`,
        contoh: "Price paid $300 after 25% discount: Original = $300 ÷ 0.75 = $400" },
      { no: "4", warna: "orange", judul: "Finding the Discount Percentage",
        rumus: String.raw`\%\text{Discount} = \frac{\text{Original} - \text{Price Paid}}{\text{Original}} \times 100\%`,
        contoh: "Original $400, paid $300: % discount = (100 ÷ 400) × 100% = 25%" },
    ],
    tipsCepat: "Quick Tip: If the discount is",
    tipsCepatMid: "you only pay",
    tipsCepatEnd: "of the original price. 30% off → pay 70%. 15% off → pay 85%. Just multiply directly!",
    secVisualTitle: "Visualization: Understanding Discounts Visually",
    visualDesc: "Think of the original price as 100%. The red part is deducted (discount), the blue part is what you pay.",
    visualBarLabel: "{p}% Discount → Pay {q}%",
    visualNote: "Notice: The larger the discount (red), the less you pay (blue). The total is always 100% — discount + paid never exceeds or falls below the original price.",
    secKalkTitle: "Interactive Discount Calculator",
    kalkIntro: "Try it yourself! Choose the calculation type, enter values, and see the results instantly.",
    secGandaTitle: "Double Discount",
    gandaBody: '"20% + 10% Off" promo is NOT the same as 30% off!',
    gandaRumusTitle: "Double Discount Formula (Quick Method):",
    gandaD1: "first discount (%),",
    gandaD2: "second discount (%)",
    gandaIlust: "FULL ILLUSTRATION: 20% + 10% discount from",
    gandaHargaAwal: "Original Price",
    gandaSetelah1: "After 20% discount: 80% ×",
    gandaSetelah2: "After 10% discount: 90% ×",
    gandaSalahLabel: "If added (WRONG)",
    gandaBenarLabel: "Double Discount (CORRECT)",
    gandaSelisih: "Effective discount = 28%, not 30%! (Difference",
    secPersenDiskonTitle: "Finding the Discount % from Two Prices",
    persenDiskonBody: "Sometimes we know the original and sale price, then need to find the discount percentage. This often appears in word problems.",
    persenDiskonRumusTitle: "Formula to find the discount percentage:",
    persenDiskonContohLabel: "EXAMPLE PROBLEM:",
    persenDiskonContohSoal: "Shoes originally priced at $750 are sold for $525. What is the discount percentage?",
    persenDiskonResult: "Discount is 30%.",
    secContohTitle: "Worked Examples",
    soalContoh: [
      { level: "EASY", warna: "green", no: 1, judul: "Single Discount – Finding the Price Paid",
        soal: "A shirt priced at $280 gets a 25% discount. What is the price to be paid?",
        langkah: [
          { label: "Given", isi: "Original price = $280, Discount = 25%" },
          { label: "Find", isi: "Price paid = ?" },
          { label: "Solution", rumus: String.raw`\text{Price Paid} = (100\% - 25\%) \times 280 = 75\% \times 280 = \$210` },
        ],
        jawaban: "Price paid = $210 (save $70)" },
      { level: "EASY", warna: "green", no: 2, judul: "Single Discount – Finding the Discount %",
        soal: "A jacket's original price is $600 and is sold for $420. What is the discount percentage?",
        langkah: [
          { label: "Given", isi: "Original = $600, Price paid = $420" },
          { label: "Find", isi: "% Discount = ?" },
          { label: "Solution", rumus: String.raw`\%\text{Discount} = \frac{600 - 420}{600} \times 100\% = 30\%` },
        ],
        jawaban: "Discount is 30%" },
      { level: "MEDIUM", warna: "yellow", no: 3, judul: "Finding the Original Price from Price Paid",
        soal: "A bag is sold at 35% off and you pay $312. What was the original price of the bag?",
        langkah: [
          { label: "Given", isi: "Price paid = $312, Discount = 35%" },
          { label: "Find", isi: "Original price = ?" },
          { label: "Solution", rumus: String.raw`\text{Original} = \frac{312}{0.65} = \$480` },
        ],
        jawaban: "Original bag price = $480" },
      { level: "MEDIUM", warna: "yellow", no: 4, judul: "Double Discount",
        soal: 'A store offers "15% + 10% Off" on shoes originally priced at $500. What is the price paid? What is the effective discount?',
        langkah: [
          { label: "Given", isi: "Original = $500, d₁ = 15%, d₂ = 10%" },
          { label: "Find", isi: "Price paid and effective % discount" },
          { label: "Step 1 – After 15% discount", rumus: String.raw`85\% \times 500 = \$425` },
          { label: "Step 2 – After 10% discount", rumus: String.raw`90\% \times 425 = \$382.50` },
          { label: "Effective Discount", rumus: String.raw`\%\text{eff} = \frac{500 - 382.50}{500} \times 100\% = 23.5\%` },
        ],
        jawaban: "Price paid = $382.50 | Effective discount = 23.5% (not 25%!)" },
      { level: "HARD", warna: "red", no: 5, judul: "Double Discount + Profit/Loss",
        soal: "A merchant buys a jacket for $400. He labels it at $650, then offers 20% + 10% off. Did the merchant profit or lose? By how much?",
        langkah: [
          { label: "Given", isi: "Cost = $400, Label price = $650, Double discount 20% + 10%" },
          { label: "Step 1 – After 20% discount", rumus: String.raw`80\% \times 650 = \$520` },
          { label: "Step 2 – After 10% discount", rumus: String.raw`90\% \times 520 = \$468` },
          { label: "Step 3 – Profit/Loss", rumus: String.raw`\text{Profit} = 468 - 400 = \$68` },
        ],
        jawaban: "Merchant still made a PROFIT of $68 despite the double discount." },
    ],
    pembahasan: "SOLUTION:",
    secKesalahanTitle: "Common Mistakes",
    kesalahan: [
      { salah: "Treating 20% + 10% off as 30% off", benar: "Double discounts are NOT added together. Calculate step by step: the second discount applies to the price after the first discount. Effective discount = 28%, not 30%." },
      { salah: "Calculating the discount from the price paid instead of the original price", benar: "Discounts are always calculated from the ORIGINAL (pre-discount) price. The price paid is only the final result." },
      { salah: "Forgetting to convert % to decimal (e.g., writing 25 instead of 0.25)", benar: "Always divide by 100: 25% = 25 ÷ 100 = 0.25. Multiply the original price by 0.25, not 25." },
      { salah: "Finding the original price by adding the discount back to the price paid", benar: "To find the original price: Original = Price Paid ÷ (1 − %Discount). Do not add or subtract directly." },
    ],
    secKuisTitle: "Test Your Understanding — Mini Quiz (5 Questions)",
    kuisIntro: "Complete these 5 questions to check your understanding. Answers and explanations appear immediately after choosing!",
    soalLabel: "Question",
    quizBenar: "✓ Correct!",
    quizSalah: "✗ Not quite right.",
    sebelumnya: "← Previous",
    lanjut: "Next →",
    lihatHasil: "See Results",
    hasilKuis: "Quiz Results",
    benar: "Correct",
    cobaLagi: "Try Again",
    quizPesan: ["Excellent! You understand discounts very well.", "Good! Review the parts you got wrong.", "Keep going! Re-read the material and try again."],
    quiz: [
      { soal: "A pair of shoes priced at $450 gets a 20% discount. What is the price to pay?", pilihan: ["$90","$360","$380","$400"], benar: 1, penjelasan: "Price Paid = (100% − 20%) × $450 = 80% × $450 = $360" },
      { soal: "A bag is sold for $312 after a 35% discount. What was the original price?", pilihan: ["$420","$460","$480","$500"], benar: 2, penjelasan: "Original = $312 ÷ (100% − 35%) = $312 ÷ 0.65 = $480" },
      { soal: '"20% + 10% Off" promo from a $200 price. What is the price paid?', pilihan: ["$140","$144","$160","$180"], benar: 1, penjelasan: "20% off: $200 × 80% = $160. 10% off: $160 × 90% = $144." },
      { soal: "A jacket originally $600 is sold for $420. What is the discount percentage?", pilihan: ["25%","28%","30%","35%"], benar: 2, penjelasan: "Difference = $600 − $420 = $180. % Discount = $180 ÷ $600 × 100% = 30%" },
      { soal: "Pants cost $225 after a 25% discount. What was the original price?", pilihan: ["$280","$300","$320","$350"], benar: 1, penjelasan: "Original = $225 ÷ (100% − 25%) = $225 ÷ 0.75 = $300" },
    ],
    secRangkumanTitle: "Discount Summary",
    rangkuman: [
      "Discount = a price reduction expressed as a percentage, always calculated from the ORIGINAL price.",
      "Discount Amount ($) = (%Discount ÷ 100) × Original Price.",
      "Price Paid = (100% − %Discount) × Original Price. Quick method: multiply by the remaining percent.",
      "Original Price = Price Paid ÷ (1 − %Discount). Use when price paid is known.",
      "%Discount = (Difference ÷ Original Price) × 100%. Use when both prices are known.",
      "Double discount (e.g. 20%+10%) is NOT the same as 30%. Calculate step-by-step; effective discount = 28%.",
      "Discounts are often combined with tax (VAT) and profit/loss in word problems.",
    ],
    rangkumanKoneksiTitle: "Connections to Other Topics:",
    rangkumanKoneksiBody: "VAT: Discount is calculated first, VAT is calculated from the price AFTER discount.\nProfit/Loss: The merchant gives a discount but the final price paid must still exceed capital.\nPercentage: Discounts are a real-life application of percent and proportion.",
    kalkModeHarga: "Calc Price Paid",
    kalkModeCari: "Find Original",
    kalkModePersen: "Find % Discount",
    kalkModeGanda: "Double Discount",
    kalkHargaAwalLabel: "Original Price",
    kalkHargaBayarLabel: "Price Paid",
    kalkDiskonLabel: "Discount (%)",
    kalkD1Label: "Discount 1 (%)",
    kalkD2Label: "Discount 2 (%)",
    kalkHasilDiskon: "Discount",
    kalkHasilBayar: "Price Paid",
    kalkHasilAsli: "Original Price",
    kalkHasilPersen: "% Discount",
    kalkEfektif: "Effective Discount",
    kalkPH: "e.g. 300",
    kalkPHBayar: "e.g. 240",
    kalkPHPersen: "e.g. 25",
    kalkDesc1: "Enter original price and discount % → get discount amount & price paid.",
    kalkDesc2: "Enter price paid and discount % → find original price before discount.",
    kalkDesc3: "Enter original and price paid → calculate discount percentage.",
    kalkDesc4: "Enter two step-by-step discounts → see the true effective discount.",
    contoRumus: "Example:",
  },
  ja: {
    title: "割引",
    subtitle: "中学1年 · 社会算数 · 数学",
    back: "← 社会算数に戻る",
    secIntroTitle: "割引とは？",
    introBody: "オンラインショッピングやモールでよく目にする、取り消し線の入った価格とその下の新しい価格。それが割引です — 売り手が提供する価格の値引きで、元の価格に対する割合（パーセント）で表されます。",
    cardHargaAwal: "元の価格", cardHargaAwalDesc: "割引前の価格（通常は取り消し線が引かれる）",
    cardBesarDiskon: "割引額", cardBesarDiskonDesc: "元の価格から差し引かれる金額",
    cardHargaBayar: "支払額", cardHargaBayarDesc: "買い手が実際に支払う価格",
    prinsipTitle: "🔑 最重要原則：",
    prinsipBody: "割引は常に元の価格から計算します。支払額からではありません。これは絶対に混同してはいけない基本ルールです！",
    contohLabel: "実際の例：",
    hematLabel: "節約",
    bayarHanya: "支払いは",
    diskonBadge: "割引",
    secRumusTitle: "すべての割引公式",
    rumusIntro: "マスターすべき4種類の公式があります：",
    rumus: [
      { no: "1", warna: "green", judul: "割引額の計算（ドル）",
        rumus: String.raw`\text{割引額} = \frac{\%\text{割引}}{100} \times \text{元の価格}`,
        contoh: "$400の25%割引 = 0.25 × $400 = $100" },
      { no: "2", warna: "cyan", judul: "支払額の計算",
        rumus: String.raw`\text{支払額} = \left(1 - \frac{\%\text{割引}}{100}\right) \times \text{元の価格}`,
        contoh: "25%割引：支払額 = (1 − 0.25) × $400 = 0.75 × $400 = $300" },
      { no: "3", warna: "purple", judul: "元の価格を求める（支払額がわかるとき）",
        rumus: String.raw`\text{元の価格} = \frac{\text{支払額}}{1 - \frac{\%\text{割引}}{100}}`,
        contoh: "25%割引後$300支払い：元の価格 = $300 ÷ 0.75 = $400" },
      { no: "4", warna: "orange", judul: "割引率を求める",
        rumus: String.raw`\%\text{割引} = \frac{\text{元の価格} - \text{支払額}}{\text{元の価格}} \times 100\%`,
        contoh: "元の価格$400、支払額$300：割引率 = (100 ÷ 400) × 100% = 25%" },
    ],
    tipsCepat: "クイックヒント：割引が",
    tipsCepatMid: "なら元の価格の",
    tipsCepatEnd: "だけ支払えばよい。30%割引 → 70%支払い。15%割引 → 85%支払い。直接掛け算するだけ！",
    secVisualTitle: "ビジュアル：割引を視覚的に理解する",
    visualDesc: "元の価格を100%と考えます。赤い部分が割引（値引き）、青い部分が支払い分です。",
    visualBarLabel: "{p}%割引 → {q}%支払い",
    visualNote: "注目：割引（赤）が大きいほど支払い（青）が少なくなります。合計は常に100%です。",
    secKalkTitle: "インタラクティブ割引電卓",
    kalkIntro: "試してみよう！計算タイプを選んで、数値を入力すると結果がすぐに表示されます。",
    secGandaTitle: "二重割引（ダブル・ディスカウント）",
    gandaBody: '"20%割引+10%割引"のプロモは30%割引とは異なります！',
    gandaRumusTitle: "二重割引の公式（速算法）：",
    gandaD1: "1つ目の割引（%）、",
    gandaD2: "2つ目の割引（%）",
    gandaIlust: "完全解説：20%+10%割引、元の価格",
    gandaHargaAwal: "元の価格",
    gandaSetelah1: "20%割引後：80% ×",
    gandaSetelah2: "10%割引後：90% ×",
    gandaSalahLabel: "足し算（誤り）",
    gandaBenarLabel: "二重割引（正しい）",
    gandaSelisih: "実効割引 = 28%、30%ではない！（差額",
    secPersenDiskonTitle: "2つの価格から割引率を求める",
    persenDiskonBody: "元の価格と売価がわかっていて、割引率を求める必要がある場合があります。文章問題によく出てきます。",
    persenDiskonRumusTitle: "割引率を求める公式：",
    persenDiskonContohLabel: "例題：",
    persenDiskonContohSoal: "元の価格$750の靴が$525で売られた。割引率は何%か？",
    persenDiskonResult: "割引率は30%。",
    secContohTitle: "例題と解説",
    soalContoh: [
      { level: "基本", warna: "green", no: 1, judul: "単一割引 – 支払額を求める",
        soal: "$280のシャツが25%割引になった。支払額はいくらか？",
        langkah: [
          { label: "既知", isi: "元の価格 = $280、割引 = 25%" },
          { label: "求める", isi: "支払額 = ?" },
          { label: "解法", rumus: String.raw`\text{支払額} = (100\% - 25\%) \times 280 = 75\% \times 280 = \$210` },
        ],
        jawaban: "支払額 = $210（$70の節約）" },
      { level: "基本", warna: "green", no: 2, judul: "単一割引 – 割引率を求める",
        soal: "ジャケットの元の価格は$600で$420で売られた。割引率は何%か？",
        langkah: [
          { label: "既知", isi: "元の価格 = $600、支払額 = $420" },
          { label: "求める", isi: "割引率 = ?" },
          { label: "解法", rumus: String.raw`\%\text{割引} = \frac{600 - 420}{600} \times 100\% = 30\%` },
        ],
        jawaban: "割引率は30%" },
      { level: "標準", warna: "yellow", no: 3, judul: "支払額から元の価格を求める",
        soal: "バッグが35%割引で$312で売られた。元の価格はいくらか？",
        langkah: [
          { label: "既知", isi: "支払額 = $312、割引 = 35%" },
          { label: "求める", isi: "元の価格 = ?" },
          { label: "解法", rumus: String.raw`\text{元の価格} = \frac{312}{0.65} = \$480` },
        ],
        jawaban: "元の価格 = $480" },
      { level: "標準", warna: "yellow", no: 4, judul: "二重割引",
        soal: '店が$500の靴に"15%+10%割引"を提供した。支払額はいくらか？実効割引率は？',
        langkah: [
          { label: "既知", isi: "元の価格 = $500、d₁ = 15%、d₂ = 10%" },
          { label: "求める", isi: "支払額と実効割引率" },
          { label: "ステップ1 – 15%割引後", rumus: String.raw`85\% \times 500 = \$425` },
          { label: "ステップ2 – 10%割引後", rumus: String.raw`90\% \times 425 = \$382.50` },
          { label: "実効割引", rumus: String.raw`\%\text{実効} = \frac{500 - 382.50}{500} \times 100\% = 23.5\%` },
        ],
        jawaban: "支払額 = $382.50 | 実効割引 = 23.5%（25%ではない！）" },
      { level: "発展", warna: "red", no: 5, judul: "二重割引 + 利益・損失",
        soal: "商人がジャケットを$400で仕入れ、定価$650で20%+10%割引を提供した。利益か損失か？",
        langkah: [
          { label: "既知", isi: "仕入れ価格 = $400、定価 = $650、二重割引20%+10%" },
          { label: "ステップ1 – 20%割引後", rumus: String.raw`80\% \times 650 = \$520` },
          { label: "ステップ2 – 10%割引後", rumus: String.raw`90\% \times 520 = \$468` },
          { label: "ステップ3 – 利益・損失", rumus: String.raw`\text{利益} = 468 - 400 = \$68` },
        ],
        jawaban: "二重割引にもかかわらず商人は$68の利益を得た。" },
    ],
    pembahasan: "解説：",
    secKesalahanTitle: "よくある間違い",
    kesalahan: [
      { salah: "20%割引+10%割引を30%割引と考える", benar: "二重割引は足し算しません。段階的に計算します：2つ目の割引は1つ目の割引後の価格に適用。実効割引 = 28%、30%ではありません。" },
      { salah: "支払額から割引を計算する", benar: "割引は常に元の（割引前の）価格から計算します。支払額は最終結果に過ぎません。" },
      { salah: "%を小数に変換し忘れる（例：0.25ではなく25と書く）", benar: "常に100で割ります：25% = 25 ÷ 100 = 0.25。元の価格に25ではなく0.25を掛けます。" },
      { salah: "元の価格を「支払額＋割引額」で求める", benar: "元の価格を求めるには：元の価格 = 支払額 ÷ (1 − %割引)。直接足し引きしないこと。" },
    ],
    secKuisTitle: "理解度チェック — ミニクイズ（5問）",
    kuisIntro: "この5問を解いて理解度を確認しましょう。選択後すぐに答えと解説が表示されます！",
    soalLabel: "問題",
    quizBenar: "✓ 正解！",
    quizSalah: "✗ 惜しい。",
    sebelumnya: "← 前へ",
    lanjut: "次へ →",
    lihatHasil: "結果を見る",
    hasilKuis: "クイズ結果",
    benar: "正解",
    cobaLagi: "もう一度",
    quizPesan: ["すばらしい！割引をよく理解しています。", "よくできました！間違えた部分を復習しましょう。", "頑張って！教材を読み直してもう一度挑戦しましょう。"],
    quiz: [
      { soal: "$450の靴が20%割引になった。支払額はいくらか？", pilihan: ["$90","$360","$380","$400"], benar: 1, penjelasan: "支払額 = (100% − 20%) × $450 = 80% × $450 = $360" },
      { soal: "$312で買えるバッグは35%割引後の価格。元の価格はいくらか？", pilihan: ["$420","$460","$480","$500"], benar: 2, penjelasan: "元の価格 = $312 ÷ (100% − 35%) = $312 ÷ 0.65 = $480" },
      { soal: "$200の商品に「20%+10%割引」。支払額はいくらか？", pilihan: ["$140","$144","$160","$180"], benar: 1, penjelasan: "20%割引：$200 × 80% = $160。10%割引：$160 × 90% = $144。" },
      { soal: "$600のジャケットが$420で売られた。割引率は何%か？", pilihan: ["25%","28%","30%","35%"], benar: 2, penjelasan: "差額 = $600 − $420 = $180。割引率 = $180 ÷ $600 × 100% = 30%" },
      { soal: "25%割引後のズボンの値段は$225。元の価格はいくらか？", pilihan: ["$280","$300","$320","$350"], benar: 1, penjelasan: "元の価格 = $225 ÷ (100% − 25%) = $225 ÷ 0.75 = $300" },
    ],
    secRangkumanTitle: "割引まとめ",
    rangkuman: [
      "割引 = 価格の値引きで割合（%）で表される。常に元の価格から計算。",
      "割引額（$）= (%割引 ÷ 100) × 元の価格。",
      "支払額 = (100% − %割引) × 元の価格。残りの%を直接掛けるだけ。",
      "元の価格 = 支払額 ÷ (1 − %割引)。支払額がわかっているときに使う。",
      "%割引 = (差額 ÷ 元の価格) × 100%。2つの価格がわかっているときに使う。",
      "二重割引（例：20%+10%）は30%と同じではない。段階的に計算；実効割引 = 28%。",
      "割引は文章問題でVATや利益・損失と組み合わさることが多い。",
    ],
    rangkumanKoneksiTitle: "他のトピックとのつながり：",
    rangkumanKoneksiBody: "消費税：割引を先に計算し、消費税は割引後の価格から計算。\n利益・損失：商人が割引を提供しても最終的な支払額は仕入れ価格を上回る必要がある。\n割合：割引は割合と比例の実際の応用例。",
    kalkModeHarga: "支払額を計算",
    kalkModeCari: "元の価格を求める",
    kalkModePersen: "割引率を求める",
    kalkModeGanda: "二重割引",
    kalkHargaAwalLabel: "元の価格",
    kalkHargaBayarLabel: "支払額",
    kalkDiskonLabel: "割引率 (%)",
    kalkD1Label: "割引1 (%)",
    kalkD2Label: "割引2 (%)",
    kalkHasilDiskon: "割引額",
    kalkHasilBayar: "支払額",
    kalkHasilAsli: "元の価格",
    kalkHasilPersen: "割引率",
    kalkEfektif: "実効割引",
    kalkPH: "例：300",
    kalkPHBayar: "例：240",
    kalkPHPersen: "例：25",
    kalkDesc1: "元の価格と割引率を入力 → 割引額と支払額を計算。",
    kalkDesc2: "支払額と割引率を入力 → 割引前の元の価格を計算。",
    kalkDesc3: "元の価格と支払額を入力 → 割引率を計算。",
    kalkDesc4: "2段階の割引率を入力 → 実際の実効割引を確認。",
    contoRumus: "例：",
  },
};

const DiskonBar = ({ persen }: { persen: number }) => (
  <div className="flex h-6 rounded-lg overflow-hidden w-full">
    <div className="bg-red-500/70 flex items-center justify-center transition-all duration-500" style={{ width: `${persen}%` }}>
      {persen >= 15 && <span className="text-[10px] text-white font-bold">{persen}%</span>}
    </div>
    <div className="bg-blue-500/70 flex items-center justify-center transition-all duration-500" style={{ width: `${100 - persen}%` }}>
      {(100 - persen) >= 15 && <span className="text-[10px] text-white font-bold">{100 - persen}%</span>}
    </div>
  </div>
);

const KalkulatorDiskon = ({ lang, t }: { lang: Lang; t: typeof translations.id }) => {
  const fmt = makeFmt(lang);
  const [mode, setMode] = useState<"harga" | "cari" | "persen" | "ganda">("harga");
  const [hargaAwal, setHargaAwal] = useState("");
  const [diskon, setDiskon] = useState("");
  const [hargaBayar, setHargaBayar] = useState("");
  const [d1, setD1] = useState(""); const [d2, setD2] = useState("");

  const HA = parse(hargaAwal), D = parse(diskon), HB = parse(hargaBayar);
  const D1 = parse(d1), D2 = parse(d2);
  const bigDiskon = HA * D / 100;
  const bayar = HA * (1 - D / 100);
  const asliDari = D < 100 ? HB / (1 - D / 100) : 0;
  const pctDiskon = HA > 0 ? (HA - HB) / HA * 100 : 0;
  const afterD1 = HA * (1 - D1 / 100);
  const afterD2 = afterD1 * (1 - D2 / 100);
  const efektif = HA > 0 ? (HA - afterD2) / HA * 100 : 0;

  const modes = [
    { id: "harga" as const, label: t.kalkModeHarga },
    { id: "cari" as const, label: t.kalkModeCari },
    { id: "persen" as const, label: t.kalkModePersen },
    { id: "ganda" as const, label: t.kalkModeGanda },
  ];
  const inputCls = "w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary";
  const labelCls = "font-body text-xs text-white/60 mb-1 block";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map(m => (
          <button key={m.id} onClick={() => { playPopSound(); setMode(m.id); }}
            className={`px-2 py-2 rounded-lg text-xs font-semibold font-body transition-all border ${mode === m.id ? "bg-primary/20 border-primary text-primary" : "bg-slate-800/60 border-border text-white/60 hover:border-primary/50"}`}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === "harga" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.kalkDesc1}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t.kalkHargaAwalLabel}</label><input type="number" value={hargaAwal} onChange={e => setHargaAwal(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
            <div><label className={labelCls}>{t.kalkDiskonLabel}</label><input type="number" value={diskon} onChange={e => setDiskon(e.target.value)} placeholder={t.kalkPHPersen} min={0} max={100} className={inputCls} /></div>
          </div>
          {HA > 0 && D > 0 && (
            <div className="space-y-2 pt-1">
              <DiskonBar persen={D} />
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="bg-slate-900/60 rounded-lg p-2">
                  <p className="text-white/50 mb-1">{t.kalkHargaAwalLabel}</p>
                  <p className="font-bold text-white">{fmt(HA)}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                  <p className="text-red-400 mb-1">{t.kalkHasilDiskon}</p>
                  <p className="font-bold text-red-300">{fmt(bigDiskon)}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                  <p className="text-green-400 mb-1">{t.kalkHasilBayar}</p>
                  <p className="font-bold text-green-300">{fmt(bayar)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "cari" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.kalkDesc2}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t.kalkHargaBayarLabel}</label><input type="number" value={hargaBayar} onChange={e => setHargaBayar(e.target.value)} placeholder={t.kalkPHBayar} className={inputCls} /></div>
            <div><label className={labelCls}>{t.kalkDiskonLabel}</label><input type="number" value={diskon} onChange={e => setDiskon(e.target.value)} placeholder={t.kalkPHPersen} min={0} max={99} className={inputCls} /></div>
          </div>
          {HB > 0 && D > 0 && D < 100 && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
              <p className="font-body text-xs text-white/50 mb-1">{t.kalkHasilAsli}:</p>
              <p className="font-body text-lg font-bold text-primary">{fmt(asliDari)}</p>
              <p className="font-body text-xs text-white/40 mt-1">{fmt(HB)} ÷ {(1 - D / 100).toFixed(2)} = {fmt(asliDari)}</p>
            </div>
          )}
        </div>
      )}

      {mode === "persen" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.kalkDesc3}</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>{t.kalkHargaAwalLabel}</label><input type="number" value={hargaAwal} onChange={e => setHargaAwal(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
            <div><label className={labelCls}>{t.kalkHargaBayarLabel}</label><input type="number" value={hargaBayar} onChange={e => setHargaBayar(e.target.value)} placeholder={t.kalkPHBayar} className={inputCls} /></div>
          </div>
          {HA > 0 && HB > 0 && HB < HA && (
            <div className="space-y-2 pt-1">
              <DiskonBar persen={Math.round(pctDiskon)} />
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
                <p className="font-body text-xs text-white/50 mb-1">{t.kalkHasilPersen}:</p>
                <p className="font-body text-xl font-bold text-purple-300">{pctDiskon.toFixed(2)}%</p>
                <p className="font-body text-xs text-white/40 mt-1">({fmt(HA)} − {fmt(HB)}) ÷ {fmt(HA)} × 100%</p>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "ganda" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">{t.kalkDesc4}</p>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={labelCls}>{t.kalkHargaAwalLabel}</label><input type="number" value={hargaAwal} onChange={e => setHargaAwal(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
            <div><label className={labelCls}>{t.kalkD1Label}</label><input type="number" value={d1} onChange={e => setD1(e.target.value)} placeholder={t.kalkPHPersen} min={0} max={100} className={inputCls} /></div>
            <div><label className={labelCls}>{t.kalkD2Label}</label><input type="number" value={d2} onChange={e => setD2(e.target.value)} placeholder={t.kalkPHPersen} min={0} max={100} className={inputCls} /></div>
          </div>
          {HA > 0 && D1 > 0 && D2 > 0 && (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-blue-400 mb-1">{t.kalkHargaAwalLabel}</p>
                  <p className="font-bold text-blue-300">{fmt(HA)}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
                  <p className="text-orange-400 mb-1">{lang === "id" ? "Setelah D1" : lang === "ja" ? "D1後" : "After D1"}</p>
                  <p className="font-bold text-orange-300">{fmt(afterD1)}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                  <p className="text-green-400 mb-1">{lang === "id" ? "Setelah D2" : lang === "ja" ? "D2後" : "After D2"}</p>
                  <p className="font-bold text-green-300">{fmt(afterD2)}</p>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="font-body text-xs text-white/60 mb-1">{lang === "id" ? `Diskon ${D1}% + ${D2}% ≠ diskon ${D1 + D2}%` : lang === "ja" ? `${D1}%割引 + ${D2}%割引 ≠ ${D1+D2}%割引` : `${D1}% + ${D2}% off ≠ ${D1+D2}% off`}</p>
                <p className="font-body text-sm text-red-300 font-semibold">{t.kalkEfektif}: <strong>{efektif.toFixed(2)}%</strong></p>
                <p className="font-body text-xs text-white/40 mt-1">({lang === "id" ? `Bukan ${D1+D2}%` : lang === "ja" ? `${D1+D2}%ではない` : `Not ${D1+D2}%`})</p>
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
  const lanjut = () => { playPopSound(); if (idx < quizData.length - 1) { setIdx(idx + 1); setDipilih(jawaban[idx + 1]); } else setSelesai(true); };
  const kembali = () => { playPopSound(); if (idx > 0) { setIdx(idx - 1); setDipilih(jawaban[idx - 1]); } };
  const ulang = () => { playPopSound(); setIdx(0); setDipilih(null); setSelesai(false); setSkor(0); setJawaban(Array(quizData.length).fill(null)); };

  if (selesai) {
    const pct = Math.round((skor / quizData.length) * 100);
    const warna = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
    return (
      <div className="text-center space-y-4 py-4">
        <Star className="w-12 h-12 text-yellow-400 mx-auto" />
        <p className="font-body text-lg font-bold text-white">{t.hasilKuis}</p>
        <p className={`font-display text-4xl font-bold ${warna}`}>{skor}/{quizData.length}</p>
        <p className={`font-body text-sm ${warna}`}>{pct}% {t.benar}</p>
        <p className="font-body text-sm text-white/60">{pct >= 80 ? t.quizPesan[0] : pct >= 60 ? t.quizPesan[1] : t.quizPesan[2]}</p>
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {quizData.map((q, i) => (
            <div key={i} className={`h-8 rounded-lg flex items-center justify-center ${jawaban[i] === q.benar ? "bg-green-500/30 border border-green-500" : "bg-red-500/30 border border-red-500"}`}>
              {jawaban[i] === q.benar ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            </div>
          ))}
        </div>
        <button onClick={ulang} className="inline-flex items-center gap-2 bg-primary/20 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-primary/30 transition-colors">
          <RefreshCw className="w-4 h-4" /> {t.cobaLagi}
        </button>
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
        <button onClick={kembali} disabled={idx === 0} className="px-4 py-2 rounded-lg text-sm font-body font-semibold border border-border text-white/60 hover:border-primary/50 disabled:opacity-30 transition-all">{t.sebelumnya}</button>
        <button onClick={lanjut} disabled={dipilih === null} className="flex-1 px-4 py-2 rounded-lg text-sm font-body font-semibold bg-primary/20 border border-primary text-primary hover:bg-primary/30 disabled:opacity-30 transition-all">{idx < quizData.length - 1 ? t.lanjut : t.lihatHasil}</button>
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

const DiskonPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (language as Lang) ?? "id";
  const t = translations[lang] ?? translations.id;
  const fmt = makeFmt(lang);
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro","rumus","visual","kalkulator","ganda","persenDiskon","contoh","kesalahan","kuis","rangkuman"]);
  const toggleSection = (s: string) => { playPopSound(); setExpandedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); };

  const sampleOrig = lang === "id" ? 200000 : 200;
  const samplePaid = lang === "id" ? 150000 : 150;
  const sampleSave = lang === "id" ? 50000 : 50;
  const exOrig = lang === "id" ? 500000 : 500;
  const exStep1 = lang === "id" ? 400000 : 400;
  const exStep2 = lang === "id" ? 360000 : 360;
  const exShoeEx = lang === "id" ? 750000 : 750;
  const exShoePaid = lang === "id" ? 525000 : 525;
  const exShoeDisc = lang === "id" ? 225000 : 225;

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
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
              <figure className="rounded-xl overflow-hidden border border-border">
                <img src="/image_diskon.png" alt={lang === "id" ? "Papan diskon 20% di toko pakaian" : lang === "ja" ? "20%割引の看板" : "20% off sign at a clothing store"} className="w-full object-cover max-h-64" />
                <figcaption className="bg-slate-900/70 px-4 py-2 text-center">
                  <a href="https://tirto.id/jenis-jenis-diskon-dan-cara-menghitungnya-dari-harga-jual-f9Ld" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-white/40 hover:text-primary transition-colors">
                    {lang === "id" ? "Sumber: tirto.id" : lang === "ja" ? "出典: tirto.id" : "Source: tirto.id"}
                  </a>
                </figcaption>
              </figure>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <ShoppingBag className="w-5 h-5 text-cyan-400" />, judul: t.cardHargaAwal, desc: t.cardHargaAwalDesc, warna: "cyan" },
                  { icon: <TrendingDown className="w-5 h-5 text-red-400" />, judul: t.cardBesarDiskon, desc: t.cardBesarDiskonDesc, warna: "red" },
                  { icon: <Tag className="w-5 h-5 text-green-400" />, judul: t.cardHargaBayar, desc: t.cardHargaBayarDesc, warna: "green" },
                ].map((c, i) => (
                  <div key={i} className={`bg-${c.warna}-500/10 border border-${c.warna}-500/30 rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">{c.icon}<p className={`font-body text-sm font-semibold text-${c.warna}-300`}>{c.judul}</p></div>
                    <p className="font-body text-xs text-white/60">{c.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-xs font-semibold text-yellow-300 mb-1">{t.prinsipTitle}</p>
                <p className="font-body text-sm text-white/80">{t.prinsipBody}</p>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <p className="font-body text-xs font-semibold text-white/60 mb-2">{t.contohLabel}</p>
                <div className="space-y-2 font-body text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 line-through text-xs">{fmt(sampleOrig)}</span>
                    <ArrowRight className="w-3 h-3 text-white/40" />
                    <span className="text-green-400 font-bold">{fmt(samplePaid)}</span>
                    <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded">{t.diskonBadge} 25%</span>
                  </div>
                  <p className="text-xs text-white/50">{t.hematLabel} {fmt(sampleSave)} → {t.bayarHanya} {fmt(samplePaid)}</p>
                </div>
              </div>
            </div>
          </Section>

          <Section id="rumus" expanded={expandedSections.includes("rumus")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-green-400" />} title={t.secRumusTitle}>
            <div className="space-y-4">
              <p className="font-body text-xs text-white/50 mb-3">{t.rumusIntro}</p>
              {t.rumus.map(r => (
                <div key={r.no} className={`bg-${r.warna}-500/10 border border-${r.warna}-500/30 rounded-xl p-4 space-y-2`}>
                  <div className="flex items-center gap-2">
                    <span className={`bg-${r.warna}-500/20 text-${r.warna}-300 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0`}>{r.no}</span>
                    <p className={`font-body text-sm font-semibold text-${r.warna}-300`}>{r.judul}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3"><BlockMath math={r.rumus} /></div>
                  <p className="font-body text-xs text-white/50 italic">{t.contoRumus} {r.contoh}</p>
                </div>
              ))}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  <strong>{t.tipsCepat}</strong> <InlineMath math="d\%" />{lang === "id" ? "," : ","} {t.tipsCepatMid} <InlineMath math="(100 - d)\%" /> {t.tipsCepatEnd}
                </p>
              </div>
            </div>
          </Section>

          <Section id="visual" expanded={expandedSections.includes("visual")} onToggle={toggleSection}
            icon={<Percent className="w-5 h-5 text-blue-400" />} title={t.secVisualTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/70">{t.visualDesc}</p>
              <div className="space-y-5">
                {[10,25,40,60,75].map(p => (
                  <div key={p} className="space-y-1">
                    <p className="font-body text-xs text-white/50">{lang === "id" ? `Diskon ${p}% → Bayar ${100-p}%` : lang === "ja" ? `${p}%割引 → ${100-p}%支払い` : `${p}% Off → Pay ${100-p}%`}</p>
                    <DiskonBar persen={p} />
                  </div>
                ))}
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <p className="font-body text-xs text-white/60 leading-relaxed">{t.visualNote}</p>
              </div>
            </div>
          </Section>

          <WarungDiskon />

          <Section id="kalkulator" expanded={expandedSections.includes("kalkulator")} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-primary" />} title={t.secKalkTitle}>
            <div className="space-y-2">
              <p className="font-body text-xs text-white/50 mb-3">{t.kalkIntro}</p>
              <KalkulatorDiskon lang={lang} t={t} />
            </div>
          </Section>

          <Section id="ganda" expanded={expandedSections.includes("ganda")} onToggle={toggleSection}
            icon={<Tag className="w-5 h-5 text-orange-400" />} title={t.secGandaTitle}>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {lang === "id" ? (
                    <>Promo <strong className="text-orange-300">"Diskon 20% + 10%"</strong> <strong className="text-red-400">TIDAK SAMA</strong> dengan diskon 30%!</>
                  ) : lang === "ja" ? (
                    <><strong className="text-orange-300">"20%割引+10%割引"</strong>のプロモは<strong className="text-red-400">30%割引とは異なります！</strong></>
                  ) : (
                    <><strong className="text-orange-300">"20% + 10% Off"</strong> promo is <strong className="text-red-400">NOT</strong> the same as 30% off!</>
                  )}
                  <br />{lang === "id" ? "Diskon kedua dihitung dari harga setelah diskon pertama, bukan dari harga aslinya." : lang === "ja" ? "2つ目の割引は1つ目の割引後の価格から計算します。" : "The second discount is applied to the price after the first discount, not the original price."}
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-orange-300">{t.gandaRumusTitle}</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <BlockMath math={lang === "id"
                    ? String.raw`\text{Harga Bayar} = \frac{100 - d_1}{100} \times \frac{100 - d_2}{100} \times \text{Harga Awal}`
                    : lang === "ja"
                    ? String.raw`\text{支払額} = \frac{100 - d_1}{100} \times \frac{100 - d_2}{100} \times \text{元の価格}`
                    : String.raw`\text{Price Paid} = \frac{100 - d_1}{100} \times \frac{100 - d_2}{100} \times \text{Original Price}`} />
                </div>
                <p className="font-body text-xs text-white/50">
                  <InlineMath math="d_1" /> = {t.gandaD1} <InlineMath math="d_2" /> = {t.gandaD2}
                </p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-semibold text-white/60">{t.gandaIlust} {fmt(exOrig)}</p>
                <div className="space-y-3">
                  {[
                    { step: "1", label: t.gandaHargaAwal, val: fmt(exOrig), color: "blue" },
                    { step: "2", label: `${t.gandaSetelah1} ${fmt(exOrig)}`, val: fmt(exStep1), color: "orange" },
                    { step: "3", label: `${t.gandaSetelah2} ${fmt(exStep1)}`, val: fmt(exStep2), color: "yellow" },
                  ].map(s => (
                    <div key={s.step} className="flex items-center gap-3 bg-slate-900/40 rounded-lg p-3">
                      <div className={`w-8 h-8 bg-${s.color}-500/20 rounded-full flex items-center justify-center shrink-0`}>
                        <span className={`text-${s.color}-400 text-xs font-bold`}>{s.step}</span>
                      </div>
                      <div>
                        <p className="font-body text-xs text-white/60">{s.label}</p>
                        <p className={`font-body text-sm font-bold text-${s.color}-300`}>= {s.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="font-body text-xs text-red-400 mb-1">{t.gandaSalahLabel}</p>
                    <p className="font-body text-sm font-bold text-red-300">{lang === "id" ? `Diskon 30% → ${fmt(350000)}` : `30% off → ${fmt(350)}`}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="font-body text-xs text-green-400 mb-1">{t.gandaBenarLabel}</p>
                    <p className="font-body text-sm font-bold text-green-300">{lang === "id" ? `Diskon 28% → ${fmt(360000)}` : `28% eff. → ${fmt(360)}`}</p>
                  </div>
                </div>
                <p className="font-body text-xs text-white/50 text-center">{t.gandaSelisih} {lang === "id" ? `Rp${(10000).toLocaleString("id-ID")}` : `$10`})</p>
              </div>
            </div>
          </Section>

          <Section id="persenDiskon" expanded={expandedSections.includes("persenDiskon")} onToggle={toggleSection}
            icon={<Percent className="w-5 h-5 text-purple-400" />} title={t.secPersenDiskonTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.persenDiskonBody}</p>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-purple-300">{t.persenDiskonRumusTitle}</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <BlockMath math={lang === "id"
                    ? String.raw`\%\text{Diskon} = \frac{\text{Harga Awal} - \text{Harga Bayar}}{\text{Harga Awal}} \times 100\%`
                    : lang === "ja"
                    ? String.raw`\%\text{割引} = \frac{\text{元の価格} - \text{支払額}}{\text{元の価格}} \times 100\%`
                    : String.raw`\%\text{Discount} = \frac{\text{Original} - \text{Paid}}{\text{Original}} \times 100\%`} />
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-semibold text-white/60">{t.persenDiskonContohLabel}</p>
                <p className="font-body text-sm text-white">{t.persenDiskonContohSoal}</p>
                <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                  <BlockMath math={lang === "id"
                    ? String.raw`\text{Selisih} = 750.000 - 525.000 = \text{Rp}225.000`
                    : lang === "ja"
                    ? String.raw`\text{差額} = 750 - 525 = \$225`
                    : String.raw`\text{Difference} = 750 - 525 = \$225`} />
                  <BlockMath math={lang === "id"
                    ? String.raw`\%\text{Diskon} = \frac{225.000}{750.000} \times 100\% = 30\%`
                    : lang === "ja"
                    ? String.raw`\%\text{割引} = \frac{225}{750} \times 100\% = 30\%`
                    : String.raw`\%\text{Discount} = \frac{225}{750} \times 100\% = 30\%`} />
                </div>
                <p className="font-body text-sm text-primary font-semibold">{t.persenDiskonResult}</p>
              </div>
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
                  <div className={`bg-${c.warna}-500/5 border border-${c.warna}-500/20 rounded-lg p-4 space-y-3`}>
                    <p className={`font-body text-xs font-semibold text-${c.warna}-400`}>{t.pembahasan}</p>
                    {c.langkah.map((l, li) => (
                      <div key={li}>
                        <p className="font-body text-xs text-white/50 mb-1">✦ {l.label}:</p>
                        {"rumus" in l ? <div className="bg-slate-900/50 rounded p-3"><BlockMath math={l.rumus} /></div> : <p className="font-body text-sm text-white/80 pl-3">{l.isi}</p>}
                      </div>
                    ))}
                    <div className={`bg-${c.warna}-500/10 rounded-lg p-3`}>
                      <p className={`font-body text-sm font-semibold text-${c.warna}-300`}>✓ {c.jawaban}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="kesalahan" expanded={expandedSections.includes("kesalahan")} onToggle={toggleSection}
            icon={<AlertCircle className="w-5 h-5 text-red-400" />} title={t.secKesalahanTitle}>
            <div className="space-y-3">
              {t.kesalahan.map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="font-body text-xs text-red-300">{item.salah}</p></div>
                  <div className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /><p className="font-body text-xs text-green-300">{item.benar}</p></div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="kuis" expanded={expandedSections.includes("kuis")} onToggle={toggleSection}
            icon={<HelpCircle className="w-5 h-5 text-pink-400" />} title={t.secKuisTitle}>
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
                    <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="font-body text-sm text-white/80">{poin}</p>
                  </div>
                ))}
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.rangkumanKoneksiTitle}</p>
                <p className="font-body text-xs text-white/70 leading-relaxed whitespace-pre-line">{t.rangkumanKoneksiBody}</p>
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

export default DiskonPage;
