import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, AlertCircle, Star, Info, Scale, Package,
  ShoppingCart, Truck, CheckCircle, XCircle, RefreshCw
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

type Lang = "id" | "en" | "ja";

const T = {
  id: {
    title: "BRUTO, NETTO, DAN TARA",
    subtitle: "Kelas 7 · Aritmetika Sosial · Materi Matematika",
    back: "← Kembali ke Aritmetika Sosial",
    secIntroTitle: "Berat Kotor vs Berat Bersih — Apa Bedanya?",
    introBody: "Pernahkah kamu memperhatikan label di kemasan makanan? Di sana tertulis \"Berat Bersih: 500 g\". Itu artinya berat isinya saja — tanpa kemasan. Konsep inilah yang disebut netto. Bersama bruto (berat total) dan tara (berat kemasan), ketiganya membentuk sistem penimbangan yang adil dalam dunia perdagangan.",
    figcaption: "Ilustrasi: Bruto (kemasan + isi), Netto (isi), dan Tara (kemasan) pada produk nyata",
    cards: [
      { judul: "BRUTO", sub: "Berat Kotor", desc: "Berat TOTAL: isi + kemasan. Yang pertama ditimbang sebelum kemasan dilepas." },
      { judul: "NETTO", sub: "Berat Bersih", desc: "Berat ISI saja. Yang sebenarnya kamu beli. Tertulis \"Berat Bersih\" pada kemasan." },
      { judul: "TARA", sub: "Berat Kemasan", desc: "Berat KEMASAN saja: kardus, botol, karung, kaleng, plastik pembungkus." },
    ],
    secKonsepTitle: "Semua Rumus Bruto, Netto, dan Tara",
    rumusDasar: "Hubungan Dasar (Rumus Induk):",
    rumusDasarNote: "Semua rumus turunan berasal dari satu persamaan ini.",
    rumusList: [
      { warna: "green", judul: "Mencari Netto", rumus: String.raw`\text{Netto} = \text{Bruto} - \text{Tara}`, ket: "Dipakai saat Bruto & Tara diketahui → cari isi." },
      { warna: "blue", judul: "Mencari Tara", rumus: String.raw`\text{Tara} = \text{Bruto} - \text{Netto}`, ket: "Dipakai saat Bruto & Netto diketahui → cari kemasan." },
      { warna: "orange", judul: "Mencari Bruto", rumus: String.raw`\text{Bruto} = \text{Netto} + \text{Tara}`, ket: "Dipakai saat Netto & Tara diketahui → cari total." },
      { warna: "cyan", judul: "Persen Tara dari Bruto", rumus: String.raw`\%\text{Tara} = \frac{\text{Tara}}{\text{Bruto}} \times 100\%`, ket: "Tara selalu dihitung dari Bruto, bukan Netto!" },
    ],
    persenTaraTitle: "Jika % Tara diketahui → cari nilai Tara & Netto:",
    persenTaraEx: "Contoh: Bruto 60 kg, %Tara 5% → Tara = 3 kg → Netto = 57 kg",
    secKalkulatorTitle: "Kalkulator Bruto, Netto, Tara Interaktif",
    kalkIntro: "Pilih jenis perhitungan, masukkan angka, dan lihat hasilnya beserta visualisasinya langsung.",
    secPersenTitle: "Tara dalam Persentase — Mengapa Penting?",
    persenBody: "Dalam perdagangan besar (grosir) dan ekspor-impor, tara sering dinyatakan dalam bentuk persen dari Bruto. Ini memudahkan penghitungan untuk berbagai ukuran kemasan yang berbeda-beda.",
    persenContohLabel: "CONTOH PENGGUNAAN PERSEN TARA:",
    persenExamples: [
      { konteks: "Karung beras 50 kg, tara 2%", tara: "1 kg", netto: "49 kg", warna: "green" },
      { konteks: "Peti jeruk 30 kg, tara 8%", tara: "2,4 kg", netto: "27,6 kg", warna: "yellow" },
      { konteks: "Drum minyak 200 kg, tara 5%", tara: "10 kg", netto: "190 kg", warna: "orange" },
    ],
    persenWarning: "Penting: % Tara selalu dihitung terhadap Bruto, bukan terhadap Netto! Ini aturan baku dalam dunia perdagangan dan sering jadi sumber kesalahan siswa.",
    secKonteksTitle: "Bruto, Netto, Tara di Kehidupan Nyata",
    konteksBody: "Konsep ini digunakan setiap hari di berbagai bidang. Yuk kenali contoh-contohnya!",
    konteksCards: [
      { judul: "Supermarket & Minimarket", isi: 'Label "Berat Bersih 250 g" pada snack = netto. Berat bungkus plastiknya = tara. Berat total saat ditimbang = bruto.' },
      { judul: "Pasar Tradisional", isi: "Saat membeli buah, pedagang menimbang semuanya (bruto) lalu mengurangi berat plastik/wadah (tara) agar pembeli mendapat harga yang adil." },
      { judul: "Ekspedisi & Kargo", isi: "Pengiriman barang dihitung berdasarkan bruto (termasuk kemasan). Perusahaan logistik mencatat netto isi barang dan tara kemasannya secara terpisah." },
      { judul: "Pertanian & Agribisnis", isi: "Komoditas seperti gabah, kopi, dan kakao dijual per ton netto. Karung/peti (tara) diukur dan dikurangi dari total timbangan (bruto) saat transaksi." },
    ],
    faktaMenarik: "💡 Fakta Menarik:",
    faktaBody: 'Di Indonesia, label "Berat Bersih" pada kemasan makanan diatur oleh Badan Standarisasi Nasional (BSN) dan BPOM. Produsen wajib mencantumkan netto secara akurat agar tidak merugikan konsumen.',
    secMultiTitle: "Simulasi: Menghitung Banyak Kemasan Sekaligus",
    secContohTitle: "Contoh Soal dan Pembahasan Lengkap",
    soalContoh: [
      { level: "MUDAH", warna: "green", no: 1, judul: "Mencari Netto",
        soal: "Sebuah toples kerupuk memiliki bruto 850 gram. Berat toples kosong (tara) adalah 120 gram. Berapa gram netto kerupuknya?",
        langkah: [
          { label: "Diketahui", isi: "Bruto = 850 g, Tara = 120 g" },
          { label: "Ditanya", isi: "Netto = ?" },
          { label: "Penyelesaian", rumus: String.raw`\text{Netto} = \text{Bruto} - \text{Tara} = 850 - 120 = 730 \text{ gram}` },
        ],
        jawaban: "Netto kerupuk = 730 gram" },
      { level: "MUDAH", warna: "green", no: 2, judul: "Mencari Bruto",
        soal: "Satu kotak teh memiliki netto 200 gram dan tara 25 gram. Berapakah bruto kotak teh tersebut?",
        langkah: [
          { label: "Diketahui", isi: "Netto = 200 g, Tara = 25 g" },
          { label: "Ditanya", isi: "Bruto = ?" },
          { label: "Penyelesaian", rumus: String.raw`\text{Bruto} = \text{Netto} + \text{Tara} = 200 + 25 = 225 \text{ gram}` },
        ],
        jawaban: "Bruto kotak teh = 225 gram" },
      { level: "SEDANG", warna: "yellow", no: 3, judul: "Persen Tara → Netto",
        soal: "Seorang pedagang membeli 1 peti mangga dengan bruto 30 kg. Peti tersebut memiliki tara 6%. Berapa kg netto mangga yang didapat?",
        langkah: [
          { label: "Diketahui", isi: "Bruto = 30 kg, %Tara = 6%" },
          { label: "Ditanya", isi: "Tara (kg) dan Netto = ?" },
          { label: "Langkah 1 – Nilai Tara", rumus: String.raw`\text{Tara} = 6\% \times 30 = 1{,}8 \text{ kg}` },
          { label: "Langkah 2 – Netto", rumus: String.raw`\text{Netto} = 30 - 1{,}8 = 28{,}2 \text{ kg}` },
        ],
        jawaban: "Netto mangga = 28,2 kg" },
      { level: "SEDANG", warna: "yellow", no: 4, judul: "Mencari Persen Tara",
        soal: "Sebuah drum minyak memiliki bruto 55 kg. Berat drum kosong adalah 5 kg. Berapa persen tara drum tersebut?",
        langkah: [
          { label: "Diketahui", isi: "Bruto = 55 kg, Tara = 5 kg" },
          { label: "Ditanya", isi: "%Tara = ?" },
          { label: "Penyelesaian", rumus: String.raw`\%\text{Tara} = \frac{5}{55} \times 100\% \approx 9{,}09\%` },
        ],
        jawaban: "% Tara ≈ 9,09%" },
      { level: "SULIT", warna: "red", no: 5, judul: "Gabungan Multi-Kemasan + Jual Beli",
        soal: "Pedagang membeli 6 karung kopi, masing-masing bruto 20 kg dan tara 4%. Harga beli Rp90.000/kg netto. Ia menjual seluruh kopi Rp100.000/kg netto. Berapa total keuntungannya?",
        langkah: [
          { label: "Diketahui", isi: "6 karung, bruto/karung = 20 kg, tara = 4%, beli Rp90.000/kg, jual Rp100.000/kg" },
          { label: "Langkah 1 – Tara & Netto per karung", rumus: String.raw`\text{Tara} = 4\% \times 20 = 0{,}8 \text{ kg},\quad \text{Netto} = 19{,}2 \text{ kg}` },
          { label: "Langkah 2 – Total Netto", rumus: String.raw`\text{Total Netto} = 6 \times 19{,}2 = 115{,}2 \text{ kg}` },
          { label: "Langkah 3 – Keuntungan", rumus: String.raw`\text{Untung} = 115{,}2 \times (100.000 - 90.000) = \text{Rp}1.152.000` },
        ],
        jawaban: "Total keuntungan = Rp1.152.000" },
    ],
    pembahasan: "PEMBAHASAN:",
    secKesalahanTitle: "Kesalahan Umum",
    kesalahan: [
      { salah: "Menghitung %Tara dari Netto bukan dari Bruto", benar: "%Tara selalu dihitung terhadap Bruto! Bagi Tara dengan Bruto × 100%, bukan dengan Netto." },
      { salah: "Menukar posisi Bruto dan Netto dalam rumus", benar: "Bruto > Netto selalu. Rumus: Netto = Bruto − Tara. Jangan sampai terbalik!" },
      { salah: "Lupa mengonversi %Tara ke desimal sebelum dikalikan", benar: "Tara = (%Tara ÷ 100) × Bruto. Kalau lupa dibagi 100, hasilnya 100 kali lebih besar." },
    ],
    secKuisTitle: "Mini Kuis — Uji Pemahamanmu!",
    kuisIntro: "5 soal tentang Bruto, Netto, dan Tara. Jawab dan lihat penjelasannya langsung!",
    soalLabel: "Soal",
    quizBenar: "✓ Benar!",
    quizSalah: "✗ Belum tepat.",
    sebelumnya: "← Sebelumnya",
    lanjut: "Lanjut →",
    lihatHasil: "Lihat Hasil",
    hasilKuis: "Hasil Kuis",
    benar: "Benar",
    cobaLagi: "Coba Lagi",
    quizPesan: ["Kamu sudah sangat paham materi Bruto, Netto, dan Tara!", "Bagus! Baca ulang bagian yang belum tepat.", "Semangat! Pelajari lagi materinya."],
    quiz: [
      { soal: "Sebuah kotak coklat memiliki bruto 500 g dan tara 50 g. Berapakah netto coklat tersebut?", pilihan: ["400 g","450 g","480 g","550 g"], benar: 1, penjelasan: "Netto = Bruto − Tara = 500 − 50 = 450 gram." },
      { soal: "Netto gula 2 kg, tara kemasan 200 g. Berapakah bruto kemasannya?", pilihan: ["1.800 g","2.000 g","2.100 g","2.200 g"], benar: 3, penjelasan: "Bruto = Netto + Tara = 2.000 + 200 = 2.200 gram." },
      { soal: "Bruto peti apel = 25 kg, %Tara = 8%. Berapa kg netto apelnya?", pilihan: ["17 kg","22 kg","23 kg","24,5 kg"], benar: 2, penjelasan: "Tara = 8% × 25 = 2 kg. Netto = 25 − 2 = 23 kg." },
      { soal: "Bruto karung beras 50 kg, netto 47 kg. Berapa persen tara karung tersebut?", pilihan: ["4%","5%","6%","7%"], benar: 2, penjelasan: "Tara = 50 − 47 = 3 kg. %Tara = 3/50 × 100% = 6%." },
      { soal: "10 kotak sabun, bruto tiap kotak 2 kg, tara 5%. Berapa total netto ke-10 kotak?", pilihan: ["18 kg","19 kg","19,5 kg","20 kg"], benar: 1, penjelasan: "Netto 1 kotak = (1 − 0,05) × 2 = 1,9 kg. Total = 10 × 1,9 = 19 kg." },
    ],
    kalkModeNetto: "Cari Netto",
    kalkModeTara: "Cari Tara",
    kalkModeBruto: "Cari Bruto",
    kalkModePersen: "Cari %Tara",
    kalkBrutoLabel: "Bruto (kg/g)",
    kalkNettoLabel: "Netto (kg/g)",
    kalkTaraLabel: "Tara (kg/g)",
    kalkPersenTaraLabel: "%Tara",
    kalkPH: "contoh: 50",
    kalkPHPersen: "contoh: 5",
    multiKemasan: "Simulasi Multi-Kemasan",
    multiJumlah: "Jumlah kemasan",
    multiBruto: "Bruto per kemasan (kg)",
    multiTara: "Tara (%)",
    multiHitung: "Hitung",
    multiResult: "Total Netto",
  },
  en: {
    title: "GROSS, NET AND TARE",
    subtitle: "Grade 7 · Social Arithmetic · Mathematics",
    back: "← Back to Social Arithmetic",
    secIntroTitle: "Gross Weight vs Net Weight — What's the Difference?",
    introBody: "Have you ever looked at the label on a food package? It says \"Net Weight: 500 g\". That means the weight of the contents only — without the packaging. This concept is called the net weight. Together with gross weight (total weight) and tare (packaging weight), the three form a fair weighing system in commerce.",
    figcaption: "Illustration: Gross (packaging + contents), Net (contents), and Tare (packaging) on a real product",
    cards: [
      { judul: "GROSS", sub: "Gross Weight", desc: "TOTAL weight: contents + packaging. The first weight measured before removing the packaging." },
      { judul: "NET", sub: "Net Weight", desc: "Weight of CONTENTS only. What you actually buy. Labeled \"Net Weight\" on the package." },
      { judul: "TARE", sub: "Packaging Weight", desc: "Weight of PACKAGING only: box, bottle, sack, can, plastic wrapper." },
    ],
    secKonsepTitle: "All Gross, Net, and Tare Formulas",
    rumusDasar: "Basic Relationship (Core Formula):",
    rumusDasarNote: "All derived formulas come from this one equation.",
    rumusList: [
      { warna: "green", judul: "Finding Net", rumus: String.raw`\text{Net} = \text{Gross} - \text{Tare}`, ket: "Use when Gross & Tare are known → find contents." },
      { warna: "blue", judul: "Finding Tare", rumus: String.raw`\text{Tare} = \text{Gross} - \text{Net}`, ket: "Use when Gross & Net are known → find packaging." },
      { warna: "orange", judul: "Finding Gross", rumus: String.raw`\text{Gross} = \text{Net} + \text{Tare}`, ket: "Use when Net & Tare are known → find total." },
      { warna: "cyan", judul: "Tare % of Gross", rumus: String.raw`\%\text{Tare} = \frac{\text{Tare}}{\text{Gross}} \times 100\%`, ket: "Tare is always calculated from Gross, not Net!" },
    ],
    persenTaraTitle: "If % Tare is known → find Tare & Net values:",
    persenTaraEx: "Example: Gross 60 kg, %Tare 5% → Tare = 3 kg → Net = 57 kg",
    secKalkulatorTitle: "Interactive Gross, Net, Tare Calculator",
    kalkIntro: "Choose the calculation type, enter values, and see the results with a visualization instantly.",
    secPersenTitle: "Tare as a Percentage — Why Is It Important?",
    persenBody: "In wholesale trade and import/export, tare is often expressed as a percentage of the Gross weight. This simplifies calculations for various packaging sizes.",
    persenContohLabel: "TARE PERCENTAGE EXAMPLES:",
    persenExamples: [
      { konteks: "50 kg rice sack, 2% tare", tara: "1 kg", netto: "49 kg", warna: "green" },
      { konteks: "30 kg orange crate, 8% tare", tara: "2.4 kg", netto: "27.6 kg", warna: "yellow" },
      { konteks: "200 kg oil drum, 5% tare", tara: "10 kg", netto: "190 kg", warna: "orange" },
    ],
    persenWarning: "Important: % Tare is always calculated against the Gross, not the Net! This is a standard rule in commerce and a common source of student errors.",
    secKonteksTitle: "Gross, Net, and Tare in Real Life",
    konteksBody: "This concept is used every day in various fields. Let's explore some examples!",
    konteksCards: [
      { judul: "Supermarkets & Convenience Stores", isi: "The label \"Net Weight 250 g\" on a snack = net. The plastic wrapper weight = tare. Total weight when measured = gross." },
      { judul: "Traditional Markets", isi: "When buying fruit, the merchant weighs everything (gross) then deducts the plastic/container weight (tare) so the buyer gets a fair price." },
      { judul: "Logistics & Cargo", isi: "Shipping costs are calculated based on gross weight (including packaging). Logistics companies record net and tare separately." },
      { judul: "Farming & Agribusiness", isi: "Commodities like rice, coffee, and cocoa are sold by net ton. Sacks/crates (tare) are measured and deducted from total weight (gross) in transactions." },
    ],
    faktaMenarik: "💡 Interesting Fact:",
    faktaBody: "In Indonesia, \"Net Weight\" labels on food packaging are regulated by the National Standardization Body (BSN) and the Food and Drug Authority (BPOM). Producers must accurately state the net weight to protect consumers.",
    secMultiTitle: "Simulation: Calculating Multiple Packages at Once",
    secContohTitle: "Worked Examples",
    soalContoh: [
      { level: "EASY", warna: "green", no: 1, judul: "Finding Net",
        soal: "A cracker jar has a gross weight of 850 g. The empty jar (tare) weighs 120 g. What is the net weight of the crackers?",
        langkah: [
          { label: "Given", isi: "Gross = 850 g, Tare = 120 g" },
          { label: "Find", isi: "Net = ?" },
          { label: "Solution", rumus: String.raw`\text{Net} = \text{Gross} - \text{Tare} = 850 - 120 = 730 \text{ g}` },
        ],
        jawaban: "Net weight of crackers = 730 g" },
      { level: "EASY", warna: "green", no: 2, judul: "Finding Gross",
        soal: "A tea box has a net weight of 200 g and a tare of 25 g. What is the gross weight of the tea box?",
        langkah: [
          { label: "Given", isi: "Net = 200 g, Tare = 25 g" },
          { label: "Find", isi: "Gross = ?" },
          { label: "Solution", rumus: String.raw`\text{Gross} = \text{Net} + \text{Tare} = 200 + 25 = 225 \text{ g}` },
        ],
        jawaban: "Gross weight of tea box = 225 g" },
      { level: "MEDIUM", warna: "yellow", no: 3, judul: "Tare % → Net",
        soal: "A merchant buys 1 crate of mangoes with a gross of 30 kg. The crate has a 6% tare. How many kg of net mangoes does he get?",
        langkah: [
          { label: "Given", isi: "Gross = 30 kg, %Tare = 6%" },
          { label: "Find", isi: "Tare (kg) and Net = ?" },
          { label: "Step 1 – Tare value", rumus: String.raw`\text{Tare} = 6\% \times 30 = 1.8 \text{ kg}` },
          { label: "Step 2 – Net", rumus: String.raw`\text{Net} = 30 - 1.8 = 28.2 \text{ kg}` },
        ],
        jawaban: "Net mangoes = 28.2 kg" },
      { level: "MEDIUM", warna: "yellow", no: 4, judul: "Finding Tare %",
        soal: "An oil drum has a gross of 55 kg. The empty drum weighs 5 kg. What is the tare percentage?",
        langkah: [
          { label: "Given", isi: "Gross = 55 kg, Tare = 5 kg" },
          { label: "Find", isi: "%Tare = ?" },
          { label: "Solution", rumus: String.raw`\%\text{Tare} = \frac{5}{55} \times 100\% \approx 9.09\%` },
        ],
        jawaban: "% Tare ≈ 9.09%" },
      { level: "HARD", warna: "red", no: 5, judul: "Multi-Package + Profit/Loss",
        soal: "A merchant buys 6 sacks of coffee, each with a gross of 20 kg and a 4% tare. Buy price $90/kg net, sell price $100/kg net. What is the total profit?",
        langkah: [
          { label: "Given", isi: "6 sacks, gross/sack = 20 kg, tare = 4%, buy $90/kg, sell $100/kg" },
          { label: "Step 1 – Tare & Net per sack", rumus: String.raw`\text{Tare} = 4\% \times 20 = 0.8 \text{ kg},\quad \text{Net} = 19.2 \text{ kg}` },
          { label: "Step 2 – Total Net", rumus: String.raw`\text{Total Net} = 6 \times 19.2 = 115.2 \text{ kg}` },
          { label: "Step 3 – Profit", rumus: String.raw`\text{Profit} = 115.2 \times (100 - 90) = \$1{,}152` },
        ],
        jawaban: "Total profit = $1,152" },
    ],
    pembahasan: "SOLUTION:",
    secKesalahanTitle: "Common Mistakes",
    kesalahan: [
      { salah: "Calculating %Tare from Net instead of Gross", benar: "%Tare is always calculated from Gross! Divide Tare by Gross × 100%, not by Net." },
      { salah: "Swapping Gross and Net in the formula", benar: "Gross > Net always. Formula: Net = Gross − Tare. Don't mix them up!" },
      { salah: "Forgetting to convert %Tare to decimal before multiplying", benar: "Tare = (%Tare ÷ 100) × Gross. Forgetting to divide by 100 makes the result 100× too large." },
    ],
    secKuisTitle: "Mini Quiz — Test Your Understanding!",
    kuisIntro: "5 questions about Gross, Net, and Tare. Answer and see explanations immediately!",
    soalLabel: "Question",
    quizBenar: "✓ Correct!",
    quizSalah: "✗ Not quite right.",
    sebelumnya: "← Previous",
    lanjut: "Next →",
    lihatHasil: "See Results",
    hasilKuis: "Quiz Results",
    benar: "Correct",
    cobaLagi: "Try Again",
    quizPesan: ["You understand Gross, Net, and Tare very well!", "Good! Review the parts you got wrong.", "Keep going! Study the material again."],
    quiz: [
      { soal: "A chocolate box has a gross of 500 g and a tare of 50 g. What is the net weight?", pilihan: ["400 g","450 g","480 g","550 g"], benar: 1, penjelasan: "Net = Gross − Tare = 500 − 50 = 450 g." },
      { soal: "Sugar net weight 2 kg, packaging tare 200 g. What is the gross weight?", pilihan: ["1,800 g","2,000 g","2,100 g","2,200 g"], benar: 3, penjelasan: "Gross = Net + Tare = 2,000 + 200 = 2,200 g." },
      { soal: "Apple crate gross = 25 kg, %Tare = 8%. What is the net weight of apples?", pilihan: ["17 kg","22 kg","23 kg","24.5 kg"], benar: 2, penjelasan: "Tare = 8% × 25 = 2 kg. Net = 25 − 2 = 23 kg." },
      { soal: "Rice sack gross 50 kg, net 47 kg. What is the tare percentage?", pilihan: ["4%","5%","6%","7%"], benar: 2, penjelasan: "Tare = 50 − 47 = 3 kg. %Tare = 3/50 × 100% = 6%." },
      { soal: "10 soap boxes, gross 2 kg each, 5% tare. Total net weight of all 10 boxes?", pilihan: ["18 kg","19 kg","19.5 kg","20 kg"], benar: 1, penjelasan: "Net per box = (1 − 0.05) × 2 = 1.9 kg. Total = 10 × 1.9 = 19 kg." },
    ],
    kalkModeNetto: "Find Net",
    kalkModeTara: "Find Tare",
    kalkModeBruto: "Find Gross",
    kalkModePersen: "Find %Tare",
    kalkBrutoLabel: "Gross (kg/g)",
    kalkNettoLabel: "Net (kg/g)",
    kalkTaraLabel: "Tare (kg/g)",
    kalkPersenTaraLabel: "%Tare",
    kalkPH: "e.g. 50",
    kalkPHPersen: "e.g. 5",
    multiKemasan: "Multi-Package Simulation",
    multiJumlah: "Number of packages",
    multiBruto: "Gross per package (kg)",
    multiTara: "Tare (%)",
    multiHitung: "Calculate",
    multiResult: "Total Net",
  },
  ja: {
    title: "総量・純量・風袋",
    subtitle: "中学1年 · 社会算数 · 数学",
    back: "← 社会算数に戻る",
    secIntroTitle: "総重量と純重量 — 何が違うのか？",
    introBody: "食品のパッケージのラベルを見たことがありますか？「内容量：500 g」と書かれています。これは包装を除いた中身だけの重さです。これが純量（ネット）です。総量（グロス：包装を含む全重量）と風袋（包装の重さ）と合わせて、この3つが公正な商取引の計量システムを形成しています。",
    figcaption: "イラスト：実際の製品における総量（包装+中身）、純量（中身）、風袋（包装）",
    cards: [
      { judul: "総量（ブルート）", sub: "総重量", desc: "中身＋包装の合計重量。包装を取り除く前に最初に計る重さ。" },
      { judul: "純量（ネット）", sub: "正味重量", desc: "中身だけの重さ。実際に購入する分。パッケージに「内容量」と表示される。" },
      { judul: "風袋（タラ）", sub: "包装の重さ", desc: "包装材だけの重さ：段ボール、瓶、袋、缶、ラップなど。" },
    ],
    secKonsepTitle: "総量・純量・風袋の全公式",
    rumusDasar: "基本関係式（基本公式）：",
    rumusDasarNote: "すべての派生公式はこの1つの式から導かれます。",
    rumusList: [
      { warna: "green", judul: "純量を求める", rumus: String.raw`\text{純量} = \text{総量} - \text{風袋}`, ket: "総量と風袋がわかるとき → 中身の重さを求める。" },
      { warna: "blue", judul: "風袋を求める", rumus: String.raw`\text{風袋} = \text{総量} - \text{純量}`, ket: "総量と純量がわかるとき → 包装の重さを求める。" },
      { warna: "orange", judul: "総量を求める", rumus: String.raw`\text{総量} = \text{純量} + \text{風袋}`, ket: "純量と風袋がわかるとき → 合計を求める。" },
      { warna: "cyan", judul: "総量に対する風袋の割合", rumus: String.raw`\%\text{風袋} = \frac{\text{風袋}}{\text{総量}} \times 100\%`, ket: "風袋は常に総量に対して計算する。純量に対してではない！" },
    ],
    persenTaraTitle: "%風袋がわかるとき → 風袋と純量を求める：",
    persenTaraEx: "例：総量60 kg、%風袋5% → 風袋 = 3 kg → 純量 = 57 kg",
    secKalkulatorTitle: "総量・純量・風袋インタラクティブ電卓",
    kalkIntro: "計算タイプを選び、数値を入力すると結果と可視化が即時に表示されます。",
    secPersenTitle: "割合としての風袋 — なぜ重要か？",
    persenBody: "卸売りや輸出入では、風袋はよく総量のパーセントで表されます。これにより様々な包装サイズの計算が簡単になります。",
    persenContohLabel: "風袋のパーセントの使用例：",
    persenExamples: [
      { konteks: "50 kgの米袋、風袋2%", tara: "1 kg", netto: "49 kg", warna: "green" },
      { konteks: "30 kgのミカン箱、風袋8%", tara: "2.4 kg", netto: "27.6 kg", warna: "yellow" },
      { konteks: "200 kgの油ドラム缶、風袋5%", tara: "10 kg", netto: "190 kg", warna: "orange" },
    ],
    persenWarning: "重要：%風袋は常に総量に対して計算します。純量に対してではありません！これは商取引の標準ルールであり、生徒がよく間違える部分です。",
    secKonteksTitle: "総量・純量・風袋の実際の使い方",
    konteksBody: "この概念はさまざまな分野で毎日使われています。例を見てみましょう！",
    konteksCards: [
      { judul: "スーパー・コンビニ", isi: "スナックの「内容量250 g」= 純量。プラスチック包装の重さ = 風袋。計量時の全重量 = 総量。" },
      { judul: "伝統市場", isi: "果物を買うとき、商人はすべての重量（総量）を計り、プラスチック袋/容器（風袋）を差し引いて、買い手が公正な価格を得られるようにする。" },
      { judul: "物流・カーゴ", isi: "配送費は総量（包装含む）で計算される。物流会社は純量と風袋を別々に記録する。" },
      { judul: "農業・アグリビジネス", isi: "米、コーヒー、カカオなどの商品は純量トンで売られる。袋/箱（風袋）は計測し、取引時に総量から差し引く。" },
    ],
    faktaMenarik: "💡 豆知識：",
    faktaBody: "インドネシアでは、食品包装の「内容量」表示はBSN（国家標準化庁）とBPOM（食品医薬品庁）によって規制されています。生産者は消費者を保護するために正確な純量を記載することが義務付けられています。",
    secMultiTitle: "シミュレーション：複数の包装を一度に計算",
    secContohTitle: "例題と解説",
    soalContoh: [
      { level: "基本", warna: "green", no: 1, judul: "純量を求める",
        soal: "クラッカーの瓶の総量は850 g。空の瓶（風袋）は120 g。クラッカーの純量は何 gか？",
        langkah: [
          { label: "既知", isi: "総量 = 850 g、風袋 = 120 g" },
          { label: "求める", isi: "純量 = ?" },
          { label: "解法", rumus: String.raw`\text{純量} = \text{総量} - \text{風袋} = 850 - 120 = 730 \text{ g}` },
        ],
        jawaban: "クラッカーの純量 = 730 g" },
      { level: "基本", warna: "green", no: 2, judul: "総量を求める",
        soal: "お茶の箱の純量は200 g、風袋は25 g。総量は何 gか？",
        langkah: [
          { label: "既知", isi: "純量 = 200 g、風袋 = 25 g" },
          { label: "求める", isi: "総量 = ?" },
          { label: "解法", rumus: String.raw`\text{総量} = \text{純量} + \text{風袋} = 200 + 25 = 225 \text{ g}` },
        ],
        jawaban: "お茶の箱の総量 = 225 g" },
      { level: "標準", warna: "yellow", no: 3, judul: "%風袋 → 純量",
        soal: "マンゴー1箱の総量30 kg。箱の風袋は6%。純量のマンゴーは何 kgか？",
        langkah: [
          { label: "既知", isi: "総量 = 30 kg、%風袋 = 6%" },
          { label: "求める", isi: "風袋（kg）と純量 = ?" },
          { label: "ステップ1 – 風袋の値", rumus: String.raw`\text{風袋} = 6\% \times 30 = 1.8 \text{ kg}` },
          { label: "ステップ2 – 純量", rumus: String.raw`\text{純量} = 30 - 1.8 = 28.2 \text{ kg}` },
        ],
        jawaban: "マンゴーの純量 = 28.2 kg" },
      { level: "標準", warna: "yellow", no: 4, judul: "%風袋を求める",
        soal: "油のドラム缶の総量は55 kg。空のドラム缶は5 kg。風袋の割合は何%か？",
        langkah: [
          { label: "既知", isi: "総量 = 55 kg、風袋 = 5 kg" },
          { label: "求める", isi: "%風袋 = ?" },
          { label: "解法", rumus: String.raw`\%\text{風袋} = \frac{5}{55} \times 100\% \approx 9.09\%` },
        ],
        jawaban: "% 風袋 ≈ 9.09%" },
      { level: "発展", warna: "red", no: 5, judul: "複数の包装＋利益・損失",
        soal: "商人がコーヒーを6袋購入。各袋の総量20 kg、風袋4%。仕入れ値$90/kg純量、売値$100/kg純量。合計利益はいくらか？",
        langkah: [
          { label: "既知", isi: "6袋、総量/袋 = 20 kg、風袋 = 4%、仕入れ$90/kg、売り$100/kg" },
          { label: "ステップ1 – 風袋と純量/袋", rumus: String.raw`\text{風袋} = 4\% \times 20 = 0.8 \text{ kg},\quad \text{純量} = 19.2 \text{ kg}` },
          { label: "ステップ2 – 合計純量", rumus: String.raw`\text{合計純量} = 6 \times 19.2 = 115.2 \text{ kg}` },
          { label: "ステップ3 – 利益", rumus: String.raw`\text{利益} = 115.2 \times (100 - 90) = \$1{,}152` },
        ],
        jawaban: "合計利益 = $1,152" },
    ],
    pembahasan: "解説：",
    secKesalahanTitle: "よくある間違い",
    kesalahan: [
      { salah: "%風袋を純量から計算する", benar: "%風袋は常に総量から計算します！風袋を総量で割って×100%。純量ではありません。" },
      { salah: "公式で総量と純量を入れ替える", benar: "総量 > 純量は常に成立。公式：純量 = 総量 − 風袋。混同しないこと！" },
      { salah: "%風袋を掛ける前に小数に変換するのを忘れる", benar: "風袋 = (%風袋 ÷ 100) × 総量。100で割るのを忘れると結果が100倍になる。" },
    ],
    secKuisTitle: "ミニクイズ — 理解度テスト！",
    kuisIntro: "総量・純量・風袋に関する5問。解いてすぐに解説を確認！",
    soalLabel: "問題",
    quizBenar: "✓ 正解！",
    quizSalah: "✗ 惜しい。",
    sebelumnya: "← 前へ",
    lanjut: "次へ →",
    lihatHasil: "結果を見る",
    hasilKuis: "クイズ結果",
    benar: "正解",
    cobaLagi: "もう一度",
    quizPesan: ["総量・純量・風袋をよく理解しています！", "よくできました！間違えた部分を復習しましょう。", "頑張って！教材を読み直してもう一度挑戦しましょう。"],
    quiz: [
      { soal: "チョコレートの箱の総量は500 g、風袋は50 g。純量は？", pilihan: ["400 g","450 g","480 g","550 g"], benar: 1, penjelasan: "純量 = 総量 − 風袋 = 500 − 50 = 450 g。" },
      { soal: "砂糖の純量2 kg、包装の風袋200 g。総量は？", pilihan: ["1,800 g","2,000 g","2,100 g","2,200 g"], benar: 3, penjelasan: "総量 = 純量 + 風袋 = 2,000 + 200 = 2,200 g。" },
      { soal: "リンゴ箱の総量 = 25 kg、%風袋 = 8%。リンゴの純量は？", pilihan: ["17 kg","22 kg","23 kg","24.5 kg"], benar: 2, penjelasan: "風袋 = 8% × 25 = 2 kg。純量 = 25 − 2 = 23 kg。" },
      { soal: "米袋の総量50 kg、純量47 kg。風袋の割合は？", pilihan: ["4%","5%","6%","7%"], benar: 2, penjelasan: "風袋 = 50 − 47 = 3 kg。%風袋 = 3/50 × 100% = 6%。" },
      { soal: "石鹸10箱、各2 kg総量、風袋5%。10箱の合計純量は？", pilihan: ["18 kg","19 kg","19.5 kg","20 kg"], benar: 1, penjelasan: "1箱の純量 = (1 − 0.05) × 2 = 1.9 kg。合計 = 10 × 1.9 = 19 kg。" },
    ],
    kalkModeNetto: "純量を求める",
    kalkModeTara: "風袋を求める",
    kalkModeBruto: "総量を求める",
    kalkModePersen: "%風袋を求める",
    kalkBrutoLabel: "総量 (kg/g)",
    kalkNettoLabel: "純量 (kg/g)",
    kalkTaraLabel: "風袋 (kg/g)",
    kalkPersenTaraLabel: "%風袋",
    kalkPH: "例：50",
    kalkPHPersen: "例：5",
    multiKemasan: "複数包装シミュレーション",
    multiJumlah: "包装の数",
    multiBruto: "1個あたりの総量 (kg)",
    multiTara: "風袋 (%)",
    multiHitung: "計算",
    multiResult: "合計純量",
  },
};

const parseW = (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0;

const KalkulatorBNT = ({ t }: { t: typeof T.id }) => {
  const [mode, setMode] = useState<"netto"|"tara"|"bruto"|"persen">("netto");
  const [bruto, setBruto] = useState(""); const [netto, setNetto] = useState(""); const [tara, setTara] = useState(""); const [persen, setPersen] = useState("");
  const B = parseW(bruto), N = parseW(netto), Tara = parseW(tara), P = parseW(persen);
  const calcNetto = B - Tara; const calcTara = B - N; const calcBruto = N + Tara;
  const calcNettoFromPct = B * (1 - P / 100); const calcTaraFromPct = B * P / 100;
  const calcPct = B > 0 ? (Tara / B) * 100 : 0;
  const inputCls = "w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary";
  const labelCls = "font-body text-xs text-white/60 mb-1 block";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {([["netto",t.kalkModeNetto],["tara",t.kalkModeTara],["bruto",t.kalkModeBruto],["persen",t.kalkModePersen]] as const).map(([id,label]) => (
          <button key={id} onClick={() => { playPopSound(); setMode(id); }}
            className={`px-2 py-2 rounded-lg text-xs font-semibold font-body border transition-all ${mode === id ? "bg-primary/20 border-primary text-primary" : "bg-slate-800/60 border-border text-white/60 hover:border-primary/50"}`}>{label}</button>
        ))}
      </div>
      <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
        {mode === "netto" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>{t.kalkBrutoLabel}</label><input type="number" value={bruto} onChange={e => setBruto(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
              <div><label className={labelCls}>{t.kalkTaraLabel}</label><input type="number" value={tara} onChange={e => setTara(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
            </div>
            {B > 0 && Tara > 0 && <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center"><p className="font-body text-xs text-green-400 mb-1">{t.kalkModeNetto}:</p><p className="font-body text-xl font-bold text-green-300">{calcNetto.toFixed(2)}</p></div>}
          </>
        )}
        {mode === "tara" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>{t.kalkBrutoLabel}</label><input type="number" value={bruto} onChange={e => setBruto(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
              <div><label className={labelCls}>{t.kalkNettoLabel}</label><input type="number" value={netto} onChange={e => setNetto(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
            </div>
            {B > 0 && N > 0 && <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center"><p className="font-body text-xs text-blue-400 mb-1">{t.kalkModeTara}:</p><p className="font-body text-xl font-bold text-blue-300">{calcTara.toFixed(2)}</p></div>}
          </>
        )}
        {mode === "bruto" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>{t.kalkNettoLabel}</label><input type="number" value={netto} onChange={e => setNetto(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
              <div><label className={labelCls}>{t.kalkTaraLabel}</label><input type="number" value={tara} onChange={e => setTara(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
            </div>
            {N > 0 && Tara > 0 && <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center"><p className="font-body text-xs text-orange-400 mb-1">{t.kalkModeBruto}:</p><p className="font-body text-xl font-bold text-orange-300">{calcBruto.toFixed(2)}</p></div>}
          </>
        )}
        {mode === "persen" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>{t.kalkBrutoLabel}</label><input type="number" value={bruto} onChange={e => setBruto(e.target.value)} placeholder={t.kalkPH} className={inputCls} /></div>
              <div><label className={labelCls}>{t.kalkPersenTaraLabel}</label><input type="number" value={persen} onChange={e => setPersen(e.target.value)} placeholder={t.kalkPHPersen} min={0} max={100} className={inputCls} /></div>
            </div>
            {B > 0 && P > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center"><p className="font-body text-xs text-blue-400 mb-1">{t.kalkModeTara}:</p><p className="font-body text-xl font-bold text-blue-300">{calcTaraFromPct.toFixed(2)}</p></div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center"><p className="font-body text-xs text-green-400 mb-1">{t.kalkModeNetto}:</p><p className="font-body text-xl font-bold text-green-300">{calcNettoFromPct.toFixed(2)}</p></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SimulasiMultiKemasan = ({ t }: { t: typeof T.id }) => {
  const [jumlah, setJumlah] = useState(""); const [brutoPK, setBrutoPK] = useState(""); const [taraPct, setTaraPct] = useState("");
  const J = parseW(jumlah), BpK = parseW(brutoPK), TP = parseW(taraPct);
  const nettoPerKemasan = BpK * (1 - TP / 100);
  const totalNetto = J * nettoPerKemasan;
  const inputCls = "w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary";
  const labelCls = "font-body text-xs text-white/60 mb-1 block";
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className={labelCls}>{t.multiJumlah}</label><input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} placeholder="10" className={inputCls} /></div>
        <div><label className={labelCls}>{t.multiBruto}</label><input type="number" value={brutoPK} onChange={e => setBrutoPK(e.target.value)} placeholder="20" className={inputCls} /></div>
        <div><label className={labelCls}>{t.multiTara}</label><input type="number" value={taraPct} onChange={e => setTaraPct(e.target.value)} placeholder="4" min={0} max={100} className={inputCls} /></div>
      </div>
      {J > 0 && BpK > 0 && TP > 0 && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-body text-center">
            <div className="bg-slate-800/50 rounded p-2"><p className="text-white/50 mb-1">{t.kalkModeNetto}/{t.multiJumlah.split(" ").pop()}</p><p className="font-bold text-white">{nettoPerKemasan.toFixed(2)} kg</p></div>
            <div className="bg-primary/20 rounded p-2 border border-primary/40"><p className="text-primary/80 mb-1">{t.multiResult}</p><p className="font-bold text-primary text-sm">{totalNetto.toFixed(2)} kg</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

const MiniKuis = ({ t }: { t: typeof T.id }) => {
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
        <Scale className="w-12 h-12 text-cyan-400 mx-auto" />
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

const Section = ({ id, expanded, onToggle, icon, title, children }: { id: string; expanded: boolean; onToggle: (id: string) => void; icon: React.ReactNode; title: string; children: React.ReactNode; }) => (
  <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
    <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"><div className="flex items-center gap-3">{icon}<span className="font-body font-semibold text-white">{title}</span></div>{expanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}</button>
    {expanded && <div className="px-5 pb-5">{children}</div>}
  </div>
);

const BrutoNettoTaraPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (language as Lang) ?? "id";
  const t = T[lang] ?? T.id;
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro","konsep","kalkulator","persen","konteks","multikemasan","contoh","kesalahan","kuis","rangkuman"]);
  const toggleSection = (s: string) => { playPopSound(); setExpandedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); };

  const brutoLabel = lang === "id" ? "Bruto" : lang === "ja" ? "総量" : "Gross";
  const nettoLabel = lang === "id" ? "Netto" : lang === "ja" ? "純量" : "Net";
  const taraLabel = lang === "id" ? "Tara" : lang === "ja" ? "風袋" : "Tare";

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Scale className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          <Section id="intro" expanded={expandedSections.includes("intro")} onToggle={toggleSection}
            icon={<Lightbulb className="w-5 h-5 text-yellow-400" />} title={t.secIntroTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
              <figure className="rounded-xl overflow-hidden border border-border">
                <div className="flex items-center justify-center p-3">
                  <img src="/image_bruto_netto_tara.png" alt={t.figcaption} className="object-contain max-h-64 w-auto" />
                </div>
                <figcaption className="bg-slate-900/70 px-4 py-2 text-center"><span className="font-body text-xs text-white/40">{t.figcaption}</span></figcaption>
              </figure>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Package className="w-5 h-5 text-orange-400" />, c: t.cards[0], warna: "orange" },
                  { icon: <Package className="w-5 h-5 text-green-400" />, c: t.cards[1], warna: "green" },
                  { icon: <Package className="w-5 h-5 text-blue-400" />, c: t.cards[2], warna: "blue" },
                ].map(({ icon, c, warna }, i) => (
                  <div key={i} className={`bg-${warna}-500/10 border border-${warna}-500/30 rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-1">{icon}<div><p className={`font-body text-sm font-bold text-${warna}-300`}>{c.judul}</p><p className={`font-body text-xs text-${warna}-400/70`}>{c.sub}</p></div></div>
                    <p className="font-body text-xs text-white/60 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="konsep" expanded={expandedSections.includes("konsep")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-green-400" />} title={t.secKonsepTitle}>
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.rumusDasar}</p>
                <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                  <BlockMath math={lang === "id" ? "\\boxed{\\text{Bruto} = \\text{Netto} + \\text{Tara}}" : lang === "ja" ? "\\boxed{\\text{総量} = \\text{純量} + \\text{風袋}}" : "\\boxed{\\text{Gross} = \\text{Net} + \\text{Tare}}"} />
                </div>
                <p className="font-body text-xs text-white/50 mt-2 text-center">{t.rumusDasarNote}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.rumusList.map((r) => (
                  <div key={r.judul} className={`bg-${r.warna}-500/10 border border-${r.warna}-500/30 rounded-xl p-4`}>
                    <p className={`font-body text-xs font-semibold text-${r.warna}-300 mb-2`}>{r.judul}</p>
                    <div className="bg-slate-900/50 rounded-lg p-2"><BlockMath math={r.rumus} /></div>
                    <p className="font-body text-xs text-white/50 mt-2 italic">{r.ket}</p>
                  </div>
                ))}
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-xs font-semibold text-cyan-300">{t.persenTaraTitle}</p>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <BlockMath math={lang === "id" ? String.raw`\text{Tara} = \%\text{Tara} \times \text{Bruto}` : lang === "ja" ? String.raw`\text{風袋} = \%\text{風袋} \times \text{総量}` : String.raw`\text{Tare} = \%\text{Tare} \times \text{Gross}`} />
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <BlockMath math={lang === "id" ? String.raw`\text{Netto} = \text{Bruto} \times \left(1 - \frac{\%\text{Tara}}{100}\right)` : lang === "ja" ? String.raw`\text{純量} = \text{総量} \times \left(1 - \frac{\%\text{風袋}}{100}\right)` : String.raw`\text{Net} = \text{Gross} \times \left(1 - \frac{\%\text{Tare}}{100}\right)`} />
                </div>
                <p className="font-body text-xs text-white/50">{t.persenTaraEx}</p>
              </div>
            </div>
          </Section>

          <Section id="kalkulator" expanded={expandedSections.includes("kalkulator")} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-primary" />} title={t.secKalkulatorTitle}>
            <div>
              <p className="font-body text-xs text-white/50 mb-4">{t.kalkIntro}</p>
              <KalkulatorBNT t={t} />
            </div>
          </Section>

          <Section id="persen" expanded={expandedSections.includes("persen")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-cyan-400" />} title={t.secPersenTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.persenBody}</p>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-semibold text-white/60">{t.persenContohLabel}</p>
                <div className="space-y-3">
                  {t.persenExamples.map((ex, i) => (
                    <div key={i} className={`bg-${ex.warna}-500/10 border border-${ex.warna}-500/20 rounded-lg p-3 flex items-center justify-between gap-3`}>
                      <p className="font-body text-xs text-white/70">{ex.konteks}</p>
                      <div className="text-right shrink-0">
                        <p className="font-body text-xs text-blue-300">{taraLabel}: {ex.tara}</p>
                        <p className="font-body text-xs text-green-300 font-semibold">{nettoLabel}: {ex.netto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-2"><Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" /><p className="font-body text-sm text-yellow-200 leading-relaxed">{t.persenWarning}</p></div>
              </div>
            </div>
          </Section>

          <Section id="konteks" expanded={expandedSections.includes("konteks")} onToggle={toggleSection}
            icon={<ShoppingCart className="w-5 h-5 text-pink-400" />} title={t.secKonteksTitle}>
            <div className="space-y-4">
              <p className="font-body text-sm text-white/70 leading-relaxed">{t.konteksBody}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.konteksCards.map((k, i) => {
                  const icons = [<ShoppingCart className="w-5 h-5 text-green-400" />, <Scale className="w-5 h-5 text-yellow-400" />, <Truck className="w-5 h-5 text-blue-400" />, <Package className="w-5 h-5 text-orange-400" />];
                  const colors = ["green","yellow","blue","orange"];
                  return (
                    <div key={i} className={`bg-${colors[i]}-500/10 border border-${colors[i]}-500/30 rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">{icons[i]}<p className={`font-body text-sm font-semibold text-${colors[i]}-300`}>{k.judul}</p></div>
                      <p className="font-body text-xs text-white/65 leading-relaxed">{k.isi}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-white/60 mb-2">{t.faktaMenarik}</p>
                <p className="font-body text-xs text-white/70 leading-relaxed">{t.faktaBody}</p>
              </div>
            </div>
          </Section>

          <Section id="multikemasan" expanded={expandedSections.includes("multikemasan")} onToggle={toggleSection}
            icon={<Truck className="w-5 h-5 text-indigo-400" />} title={t.secMultiTitle}>
            <SimulasiMultiKemasan t={t} />
          </Section>

          <Section id="contoh" expanded={expandedSections.includes("contoh")} onToggle={toggleSection}
            icon={<BookOpen className="w-5 h-5 text-blue-400" />} title={t.secContohTitle}>
            <div className="space-y-6">
              {t.soalContoh.map((c) => (
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
                        <p className="font-body text-xs text-white/50 mb-1">✦ {l.label}:</p>
                        {"rumus" in l ? <div className="bg-slate-900/50 rounded p-3"><BlockMath math={l.rumus} /></div> : <p className="font-body text-sm text-white/80 pl-3">{l.isi}</p>}
                      </div>
                    ))}
                    <div className={`bg-${c.warna}-500/10 rounded-lg p-3`}><p className={`font-body text-sm font-semibold text-${c.warna}-300`}>✓ {c.jawaban}</p></div>
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
            icon={<Star className="w-5 h-5 text-yellow-400" />} title={t.secKuisTitle}>
            <div>
              <p className="font-body text-xs text-white/50 mb-4">{t.kuisIntro}</p>
              <MiniKuis t={t} />
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

export default BrutoNettoTaraPage;
