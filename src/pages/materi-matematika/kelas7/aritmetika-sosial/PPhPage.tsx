import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import KantorPPh from "@/components/KantorPPh";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, AlertCircle, Star, Zap, RotateCcw,
  CheckCircle, XCircle, Percent, Briefcase, FileText, TrendingUp,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const PPhPage = () => {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();

  const makeFmt = (l: string) => (n: number) =>
    (l === "id" ? "Rp" : "$") + Math.round(n).toLocaleString(l === "id" ? "id-ID" : "en-US");
  const formatRupiah = makeFmt(lang);

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "cara", "kalkulator", "kesalahan", "contoh", "rangkuman",
  ]);

  const [bruto, setBruto] = useState("");
  const [ptkp, setPtkp] = useState("54000000");
  const [tarifPPh, setTarifPPh] = useState("5");
  const [periode, setPeriode] = useState<"bulan" | "tahun">("bulan");
  const [kalcResult, setKalcResult] = useState<null | {
    bruto: number; ptkp: number; pkp: number; pph: number; bersih: number;
  }>(null);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const hitungPPh = () => {
    const b = parseFloat(bruto.replace(/[^0-9.]/g, ""));
    const tk = parseFloat(ptkp.replace(/[^0-9.]/g, ""));
    const t = parseFloat(tarifPPh) / 100;
    if (!b || isNaN(b) || isNaN(tk) || !t || isNaN(t)) return;
    const brutoPerTahun = periode === "bulan" ? b * 12 : b;
    const pkp = Math.max(0, brutoPerTahun - tk);
    const pph = pkp * t;
    const bersih = brutoPerTahun - pph;
    setKalcResult({ bruto: brutoPerTahun, ptkp: tk, pkp, pph, bersih });
    playPopSound();
  };

  const resetKalkulator = () => {
    setBruto("");
    setPtkp("54000000");
    setTarifPPh("5");
    setPeriode("bulan");
    setKalcResult(null);
    playPopSound();
  };

  const T = {
    id: {
      pageTitle: "PAJAK PENGHASILAN (PPh)",
      pageSub: "Kelas 7 · Aritmetika Sosial · Materi Matematika",
      taxName: "PPh",
      taxFull: "Pajak Penghasilan",
      note: null as string | null,

      introTitle: "💡 Apa Itu PPh?",
      introText: "PPh (Pajak Penghasilan) adalah pajak yang dikenakan atas setiap tambahan kemampuan ekonomis yang diterima Wajib Pajak — baik yang berasal dari gaji, usaha, investasi, maupun sumber lain.",
      introBullets: [
        "PPh bersifat pajak langsung — dikenakan dan ditanggung oleh penerima penghasilan",
        "Penghasilan di bawah PTKP: tidak kena PPh sama sekali",
        "PKP (Penghasilan Kena Pajak) = Bruto − PTKP",
      ],
      introFormulas: [
        "PKP = Penghasilan Bruto − PTKP",
        "PPh = %PPh × PKP",
        "Gaji Bersih = Gaji Bruto − PPh",
      ],

      konsepTitle: "🔑 Istilah Penting PPh",
      konsep: [
        { icon: "💰", judul: "Penghasilan Bruto",    isi: "Total gaji atau pendapatan sebelum dipotong apapun." },
        { icon: "🛡️", judul: "PTKP",                  isi: "Penghasilan Tidak Kena Pajak — batas penghasilan yang bebas dari PPh." },
        { icon: "🎯", judul: "PKP",                   isi: "Penghasilan Kena Pajak = Bruto − PTKP. PPh dihitung dari PKP ini." },
        { icon: "📊", judul: "Tarif PPh",             isi: "Persentase pajak yang dikenakan. Tarif progresif: 5%, 15%, 25%, 30%." },
        { icon: "🏠", judul: "Gaji Bersih / THP",    isi: "Take Home Pay — yang diterima karyawan setelah dipotong PPh." },
        { icon: "⚖️", judul: "PPh vs PPN",            isi: "PPh dari penghasilan (ada PTKP). PPN dari pembelian barang/jasa." },
      ],

      caraTitle: "📐 Cara Menghitung PPh",
      cara: [
        { step: "1", label: "Tentukan Penghasilan Bruto", desc: "Gaji pokok + tunjangan + bonus (per bulan atau per tahun)." },
        { step: "2", label: "Kurangi dengan PTKP", desc: "PTKP TK/0 = Rp54 jt/tahun. Nilai ini melindungi penghasilan rendah." },
        { step: "3", label: "Hitung PKP", desc: "PKP = Bruto − PTKP. Jika PKP ≤ 0, tidak ada pajak." },
        { step: "4", label: "Kalikan dengan Tarif PPh", desc: "PPh = %Tarif × PKP. Tarif bergantung pada besar PKP." },
        { step: "5", label: "Hitung Gaji Bersih", desc: "Gaji Bersih = Bruto − PPh." },
      ],

      ptkpTableTitle: "📋 Tabel PTKP (per Tahun)",
      ptkpTable: [
        { status: "TK/0 – Lajang, tanpa tanggungan",   nilai: "Rp 54.000.000" },
        { status: "TK/1 – Lajang, 1 tanggungan",       nilai: "Rp 58.500.000" },
        { status: "K/0  – Kawin, tanpa tanggungan",     nilai: "Rp 58.500.000" },
        { status: "K/1  – Kawin, 1 tanggungan",         nilai: "Rp 63.000.000" },
        { status: "K/2  – Kawin, 2 tanggungan",         nilai: "Rp 67.500.000" },
        { status: "K/3  – Kawin, 3 tanggungan",         nilai: "Rp 72.000.000" },
      ],
      tarifTableTitle: "📈 Tarif PPh Progresif (Pasal 17)",
      tarifTable: [
        { pkp: "s.d. Rp60 jt",        tarif: "5%" },
        { pkp: "Rp60 jt – Rp250 jt",  tarif: "15%" },
        { pkp: "Rp250 jt – Rp500 jt", tarif: "25%" },
        { pkp: "di atas Rp500 jt",     tarif: "30%" },
      ],

      kalcTitle: "🧮 Kalkulator PPh",
      kalcPeriode: "Periode Penghasilan:",
      kalcBulan: "Per Bulan",
      kalcTahun: "Per Tahun",
      kalcLabelBruto: (p: string) => `Penghasilan Bruto (${p === "bulan" ? "per bulan" : "per tahun"})`,
      kalcLabelPtkp: "PTKP per Tahun (Rp)",
      kalcLabelTarif: "Tarif PPh (%)",
      kalcPhBruto: "masukkan nominal",
      kalcPhCustomTarif: "lainnya",
      kalcBtnHitung: "Hitung PPh",
      kalcResultTitle: "✅ Hasil Perhitungan (per Tahun):",
      kalcResBruto: "Penghasilan Bruto",
      kalcResPtkp: "PTKP (dikurangi)",
      kalcResPkp: "PKP (Penghasilan Kena Pajak)",
      kalcResPph: (tarif: string) => `Besar PPh (${tarif}% × PKP)`,
      kalcResBersih: "Penghasilan Bersih / Take Home Pay",
      kalcDynZero: "PKP = 0 → Penghasilan di bawah/sama dengan PTKP → Bebas PPh sepenuhnya!",
      kalcDynFormula: (bruto: string, ptkpVal: string, pkp: string, tarif: string, pph: string) =>
        `Cara hitung: PKP = ${bruto} − ${ptkpVal} = ${pkp} → PPh = ${tarif}% × ${pkp} = ${pph}`,

      kesalahanTitle: "⚠️ Kesalahan Umum & Tips Penting",
      kesalahan: [
        {
          salah: "Menghitung PPh dari penghasilan bruto langsung, tanpa mengurangi PTKP terlebih dahulu",
          benar: "PPh = %PPh × PKP. PKP = Bruto − PTKP. Wajib kurangi PTKP dulu sebelum menghitung pajak.",
        },
        {
          salah: "Menganggap penghasilan di bawah PTKP tetap kena pajak (walaupun sangat kecil)",
          benar: "Jika PKP ≤ 0, maka PPh = Rp0. Penghasilan di bawah PTKP sama sekali tidak dikenai pajak.",
        },
        {
          salah: "Mengurangi PTKP dari gaji bersih (netto), bukan dari gaji bruto",
          benar: "PKP = Gaji Bruto − PTKP. Gaji Bersih = Gaji Bruto − PPh. Urutan ini tidak boleh tertukar.",
        },
        {
          salah: "Bingung membedakan PPh dengan PPN — menggunakan rumus PPN untuk soal PPh",
          benar: "PPh ≠ PPN. PPh dari penghasilan (ada PTKP). PPN dari pembelian barang/jasa (tanpa PTKP). Baca soalnya cermat.",
        },
      ],

      contohTitle: "📖 Contoh Soal & Pembahasan",
      contoh: [
        {
          diff: "MUDAH", diffColor: "green",
          judul: "Contoh 1 – Menghitung PPh dan Gaji Bersih",
          soal: "Pak Hendra memiliki penghasilan bruto Rp5.000.000 per bulan. PTKP sebesar Rp3.000.000 per bulan. Tarif PPh 5% dari PKP. Berapa gaji bersih yang diterima Pak Hendra?",
          steps: "📌 Diketahui: Bruto = Rp5.000.000, PTKP = Rp3.000.000, tarif PPh = 5%",
          maths: [
            "PKP = 5.000.000 - 3.000.000 = \\text{Rp}2.000.000",
            "\\text{Besar PPh} = 5\\% \\times 2.000.000 = \\text{Rp}100.000",
            "\\text{Gaji Bersih} = 5.000.000 - 100.000 = \\text{Rp}4.900.000",
          ],
          answer: "✅ Gaji bersih Pak Hendra = Rp4.900.000",
        },
        {
          diff: "SEDANG", diffColor: "yellow",
          judul: "Contoh 2 – Penghasilan di Bawah PTKP",
          soal: "Seorang karyawan part-time berpenghasilan Rp2.200.000 per bulan. Jika PTKP adalah Rp2.500.000 per bulan dan tarif PPh 5%, berapa yang harus dibayarkan sebagai pajak?",
          steps: "📌 Hitung PKP terlebih dahulu",
          maths: ["PKP = 2.200.000 - 2.500.000 = -300.000"],
          midNote: "Karena PKP bernilai negatif (penghasilan di bawah PTKP), maka PKP dianggap Rp0.",
          maths2: ["\\text{Besar PPh} = 5\\% \\times 0 = \\text{Rp}0"],
          answer: "✅ Karyawan ini tidak perlu membayar pajak karena penghasilannya di bawah PTKP.",
        },
        {
          diff: "SULIT", diffColor: "red",
          judul: "Contoh 3 – Mencari Penghasilan Bruto dari Gaji Bersih",
          soal: "Bu Kartini menerima gaji bersih Rp4.400.000 setelah dipotong PPh 5%. PTKP yang berlaku adalah Rp2.500.000. Berapakah penghasilan bruto Bu Kartini sebelum dipotong pajak?",
          warning: "⚡ Misalkan penghasilan bruto = B",
          maths: [
            "PKP = B - 2.500.000",
            "\\text{PPh} = 5\\% \\times (B - 2.500.000)",
            "\\text{Gaji Bersih} = B - \\text{PPh} = 4.400.000",
            "B - 0{,}05(B - 2.500.000) = 4.400.000",
            "B - 0{,}05B + 125.000 = 4.400.000",
            "0{,}95B = 4.275.000",
            "B = \\frac{4.275.000}{0{,}95} = \\text{Rp}4.500.000",
          ],
          answer: "✅ Penghasilan bruto Bu Kartini = Rp4.500.000",
        },
        {
          diff: "BONUS", diffColor: "purple",
          judul: "Contoh 4 – Mencari Tarif PPh",
          soal: "Pak Rudi memiliki penghasilan bruto Rp8.000.000 per bulan dan PTKP Rp3.000.000 per bulan. Setelah dipotong pajak, ia menerima Rp4.750.000. Berapa tarif PPh yang dikenakan?",
          steps: "📌 Diketahui: Bruto = Rp8.000.000, PTKP = Rp3.000.000, Bersih = Rp4.750.000",
          maths: [
            "PKP = 8.000.000 - 3.000.000 = \\text{Rp}5.000.000",
            "\\text{Besar PPh} = 8.000.000 - 4.750.000 = \\text{Rp}3.250.000",
            "\\%\\text{PPh} = \\frac{3.250.000}{5.000.000} \\times 100\\% = 65\\%",
          ],
          warningNote: "⚠️ Tarif 65% tidak realistis! Cek kembali apakah soal PTKP-nya per bulan atau per tahun, atau ada kesalahan data di soal.",
          answer: "✅ Tarif PPh (berdasarkan data soal) = 65% — ini menunjukkan pentingnya memeriksa kewajaran jawaban!",
        },
      ],

      rangkumanTitle: "⭐ Rangkuman Materi PPh",
      rangkuman: [
        "PPh dikenakan atas penghasilan (gaji/usaha), bukan atas pembelian seperti PPN.",
        "PKP = Penghasilan Bruto − PTKP. Jika PKP ≤ 0, tidak ada pajak yang dibayar.",
        "Besar PPh = %PPh × PKP. Gaji Bersih = Gaji Bruto − PPh.",
        "PTKP melindungi penghasilan rendah dari pajak — semakin tinggi PTKP, semakin sedikit yang wajib bayar pajak.",
        "Untuk mencari gaji bruto dari gaji bersih: bentuk persamaan aljabar dan selesaikan.",
        "PPh ≠ PPN. PPh dari penghasilan (ada PTKP & PKP). PPN dari konsumsi barang/jasa (tanpa PTKP).",
      ],
      rumusCards: [
        { label: "PKP",         math: "\\text{Bruto} - PTKP" },
        { label: "Besar PPh",   math: "\\%\\text{PPh} \\times PKP" },
        { label: "Gaji Bersih", math: "\\text{Bruto} - \\text{PPh}" },
        { label: "Tarif PPh",   math: "\\frac{\\text{PPh}}{PKP} \\times 100\\%" },
      ],
      realWorldNote: "🌍 Koneksi ke Kehidupan Nyata: Ketika orang tua atau saudara menerima slip gaji, ada baris "Potongan PPh" yang tertera. Itulah pajak yang langsung dipotong oleh perusahaan sebelum gaji diterima karyawan — disebut sistem withholding tax. Coba minta slip gaji orang tuamu dan temukan baris PPh di sana!",

      backBtn: "← Kembali ke Aritmetika Sosial",
    },

    en: {
      pageTitle: "INCOME TAX (PPh)",
      pageSub: "Grade 7 · Social Arithmetic · Mathematics",
      taxName: "Income Tax",
      taxFull: "Income Tax",
      note: "Note: This page uses Indonesia's income tax system (PPh) as an illustrative example of income tax concepts.",

      introTitle: "💡 What Is Income Tax?",
      introText: "Income tax is a tax levied on every form of economic benefit received by the taxpayer — including salaries, business income, investments, and other sources.",
      introBullets: [
        "Income tax is a direct tax — paid by the person who earns the income",
        "Income below the tax-free threshold (PTKP) is not taxed at all",
        "Taxable Income (PKP) = Gross Income − Tax-Free Threshold",
      ],
      introFormulas: [
        "Taxable Income (PKP) = Gross Income − Tax-Free Threshold (PTKP)",
        "Income Tax = %Rate × Taxable Income",
        "Net Salary = Gross Salary − Income Tax",
      ],

      konsepTitle: "🔑 Key Income Tax Terms",
      konsep: [
        { icon: "💰", judul: "Gross Income",           isi: "Total salary or income before any deductions." },
        { icon: "🛡️", judul: "Tax-Free Threshold (PTKP)", isi: "The income level below which no income tax applies." },
        { icon: "🎯", judul: "Taxable Income (PKP)",   isi: "Taxable Income = Gross − PTKP. Tax is calculated on this amount." },
        { icon: "📊", judul: "Tax Rate",               isi: "Percentage applied to taxable income. Progressive: 5%, 15%, 25%, 30%." },
        { icon: "🏠", judul: "Net Salary / Take-Home Pay", isi: "Amount received after income tax deduction." },
        { icon: "⚖️", judul: "Income Tax vs VAT",      isi: "Income tax: from earnings (has PTKP). VAT: from purchases (no PTKP)." },
      ],

      caraTitle: "📐 How to Calculate Income Tax",
      cara: [
        { step: "1", label: "Determine Gross Income", desc: "Base salary + allowances + bonuses (monthly or yearly)." },
        { step: "2", label: "Subtract Tax-Free Threshold", desc: "PTKP TK/0 = Rp54M/year. This protects lower earners from tax." },
        { step: "3", label: "Calculate Taxable Income", desc: "PKP = Gross − PTKP. If PKP ≤ 0, no tax applies." },
        { step: "4", label: "Apply the Tax Rate", desc: "Income Tax = %Rate × PKP. Rate depends on income bracket." },
        { step: "5", label: "Calculate Net Salary", desc: "Net Salary = Gross − Income Tax." },
      ],

      ptkpTableTitle: "📋 Tax-Free Thresholds (per Year)",
      ptkpTable: [
        { status: "TK/0 – Single, no dependants",   nilai: "Rp 54,000,000" },
        { status: "TK/1 – Single, 1 dependant",     nilai: "Rp 58,500,000" },
        { status: "K/0  – Married, no dependants",  nilai: "Rp 58,500,000" },
        { status: "K/1  – Married, 1 dependant",    nilai: "Rp 63,000,000" },
        { status: "K/2  – Married, 2 dependants",   nilai: "Rp 67,500,000" },
        { status: "K/3  – Married, 3 dependants",   nilai: "Rp 72,000,000" },
      ],
      tarifTableTitle: "📈 Progressive Tax Rates (Article 17)",
      tarifTable: [
        { pkp: "Up to Rp60M",          tarif: "5%" },
        { pkp: "Rp60M – Rp250M",       tarif: "15%" },
        { pkp: "Rp250M – Rp500M",      tarif: "25%" },
        { pkp: "Above Rp500M",         tarif: "30%" },
      ],

      kalcTitle: "🧮 Income Tax Calculator",
      kalcPeriode: "Income Period:",
      kalcBulan: "Per Month",
      kalcTahun: "Per Year",
      kalcLabelBruto: (p: string) => `Gross Income (${p === "bulan" ? "per month" : "per year"})`,
      kalcLabelPtkp: "Tax-Free Threshold per Year",
      kalcLabelTarif: "Income Tax Rate (%)",
      kalcPhBruto: "enter amount",
      kalcPhCustomTarif: "other",
      kalcBtnHitung: "Calculate Income Tax",
      kalcResultTitle: "✅ Calculation Result (per Year):",
      kalcResBruto: "Gross Income",
      kalcResPtkp: "Tax-Free Threshold (deducted)",
      kalcResPkp: "Taxable Income (PKP)",
      kalcResPph: (tarif: string) => `Income Tax (${tarif}% × PKP)`,
      kalcResBersih: "Net Income / Take-Home Pay",
      kalcDynZero: "PKP = 0 → Income at or below tax-free threshold → Completely tax-free!",
      kalcDynFormula: (bruto: string, ptkpVal: string, pkp: string, tarif: string, pph: string) =>
        `Calculation: PKP = ${bruto} − ${ptkpVal} = ${pkp} → Tax = ${tarif}% × ${pkp} = ${pph}`,

      kesalahanTitle: "⚠️ Common Mistakes & Important Tips",
      kesalahan: [
        {
          salah: "Calculating income tax directly from gross income without subtracting the tax-free threshold",
          benar: "Tax = %Rate × PKP. PKP = Gross − PTKP. Always subtract PTKP first before calculating tax.",
        },
        {
          salah: "Assuming that income below the tax-free threshold is still taxed (even if only slightly)",
          benar: "If PKP ≤ 0, then Income Tax = 0. Income below the threshold is completely tax-free.",
        },
        {
          salah: "Subtracting PTKP from net salary instead of gross salary",
          benar: "PKP = Gross Salary − PTKP. Net Salary = Gross Salary − Tax. This order must not be reversed.",
        },
        {
          salah: "Confusing income tax with VAT — using the VAT formula for income tax problems",
          benar: "Income Tax ≠ VAT. Income tax comes from earnings (with PTKP). VAT comes from purchases (no PTKP). Read carefully.",
        },
      ],

      contohTitle: "📖 Example Problems & Solutions",
      contoh: [
        {
          diff: "EASY", diffColor: "green",
          judul: "Example 1 – Calculating Income Tax and Net Salary",
          soal: "Mr. Hendra earns a gross salary of Rp5,000,000 per month. PTKP is Rp3,000,000 per month. Income tax rate is 5% of PKP. What is Mr. Hendra's net salary?",
          steps: "📌 Given: Gross = Rp5,000,000, PTKP = Rp3,000,000, rate = 5%",
          maths: [
            "PKP = 5{,}000{,}000 - 3{,}000{,}000 = \\text{Rp}2{,}000{,}000",
            "\\text{Income Tax} = 5\\% \\times 2{,}000{,}000 = \\text{Rp}100{,}000",
            "\\text{Net Salary} = 5{,}000{,}000 - 100{,}000 = \\text{Rp}4{,}900{,}000",
          ],
          answer: "✅ Net salary = Rp4,900,000",
        },
        {
          diff: "MEDIUM", diffColor: "yellow",
          judul: "Example 2 – Income Below Tax-Free Threshold",
          soal: "A part-time employee earns Rp2,200,000 per month. If PTKP is Rp2,500,000/month and the rate is 5%, how much income tax must be paid?",
          steps: "📌 Calculate PKP first",
          maths: ["PKP = 2{,}200{,}000 - 2{,}500{,}000 = -300{,}000"],
          midNote: "Since PKP is negative (income below PTKP), PKP is treated as 0.",
          maths2: ["\\text{Income Tax} = 5\\% \\times 0 = \\text{Rp}0"],
          answer: "✅ This employee pays no income tax because their income is below the tax-free threshold.",
        },
        {
          diff: "HARD", diffColor: "red",
          judul: "Example 3 – Finding Gross Salary from Net Salary",
          soal: "Mrs. Kartini receives a net salary of Rp4,400,000 after 5% income tax. PTKP is Rp2,500,000. What is Mrs. Kartini's gross salary before tax?",
          warning: "⚡ Let gross salary = B",
          maths: [
            "PKP = B - 2{,}500{,}000",
            "\\text{Tax} = 5\\% \\times (B - 2{,}500{,}000)",
            "\\text{Net Salary} = B - \\text{Tax} = 4{,}400{,}000",
            "B - 0{.}05(B - 2{,}500{,}000) = 4{,}400{,}000",
            "B - 0{.}05B + 125{,}000 = 4{,}400{,}000",
            "0{.}95B = 4{,}275{,}000",
            "B = \\frac{4{,}275{,}000}{0{.}95} = \\text{Rp}4{,}500{,}000",
          ],
          answer: "✅ Mrs. Kartini's gross salary = Rp4,500,000",
        },
        {
          diff: "BONUS", diffColor: "purple",
          judul: "Example 4 – Finding the Tax Rate",
          soal: "Mr. Rudi earns Rp8,000,000/month (gross) and PTKP Rp3,000,000/month. After tax deduction, he receives Rp4,750,000. What income tax rate was applied?",
          steps: "📌 Given: Gross = Rp8,000,000, PTKP = Rp3,000,000, Net = Rp4,750,000",
          maths: [
            "PKP = 8{,}000{,}000 - 3{,}000{,}000 = \\text{Rp}5{,}000{,}000",
            "\\text{Tax} = 8{,}000{,}000 - 4{,}750{,}000 = \\text{Rp}3{,}250{,}000",
            "\\%\\text{Tax} = \\frac{3{,}250{,}000}{5{,}000{,}000} \\times 100\\% = 65\\%",
          ],
          warningNote: "⚠️ A 65% rate is unrealistic! Check whether PTKP values are monthly or yearly, or if there's an error in the problem data.",
          answer: "✅ Tax rate (based on problem data) = 65% — this demonstrates the importance of checking whether your answer is reasonable!",
        },
      ],

      rangkumanTitle: "⭐ Summary: Income Tax",
      rangkuman: [
        "Income tax applies to earnings (salary/business), not to purchases like VAT.",
        "PKP = Gross Income − PTKP. If PKP ≤ 0, no tax is paid.",
        "Income Tax = %Rate × PKP. Net Salary = Gross Salary − Tax.",
        "PTKP protects lower earners from tax — the higher the PTKP, the fewer people pay tax.",
        "To find gross salary from net salary: form an algebraic equation and solve.",
        "Income Tax ≠ VAT. Income tax from earnings (has PTKP & PKP). VAT from consumption (no PTKP).",
      ],
      rumusCards: [
        { label: "Taxable Income", math: "\\text{Gross} - PTKP" },
        { label: "Income Tax",     math: "\\%\\text{Rate} \\times PKP" },
        { label: "Net Salary",     math: "\\text{Gross} - \\text{Tax}" },
        { label: "Tax Rate",       math: "\\frac{\\text{Tax}}{PKP} \\times 100\\%" },
      ],
      realWorldNote: "🌍 Real-World Connection: When parents or siblings receive a payslip, there's a line saying 'Income Tax Deduction'. That's the tax withheld directly by the employer before the employee receives their salary — this is called withholding tax. Ask to see a payslip and find the income tax line!",

      backBtn: "← Back to Social Arithmetic",
    },

    ja: {
      pageTitle: "所得税（PPh）",
      pageSub: "中学1年 · 社会算数 · 数学",
      taxName: "所得税",
      taxFull: "所得税",
      note: "注意：このページはインドネシアの所得税制度（PPh）を所得税概念の学習例として使用しています。",

      introTitle: "💡 所得税とは？",
      introText: "所得税は、給与・事業収入・投資・その他の収入源から得られる経済的利益すべてに課税される税金です。",
      introBullets: [
        "所得税は直接税 — 収入を得た人が直接負担する",
        "非課税基準額（PTKP）以下の収入には税金がかからない",
        "課税所得（PKP）= 額面収入 − 非課税基準額",
      ],
      introFormulas: [
        "課税所得（PKP）= 額面収入 − 非課税基準額（PTKP）",
        "所得税 = 税率% × 課税所得",
        "手取り = 額面 − 所得税",
      ],

      konsepTitle: "🔑 所得税の重要用語",
      konsep: [
        { icon: "💰", judul: "額面収入",         isi: "控除前の給与や収入の合計。" },
        { icon: "🛡️", judul: "非課税基準額（PTKP）", isi: "所得税が免除される収入の基準額。" },
        { icon: "🎯", judul: "課税所得（PKP）",   isi: "課税所得 = 額面 − PTKP。税金はこの金額に対して計算される。" },
        { icon: "📊", judul: "税率",             isi: "課税所得に適用される割合。累進税率：5%、15%、25%、30%。" },
        { icon: "🏠", judul: "手取り",           isi: "所得税を差し引いた後に受け取る金額。" },
        { icon: "⚖️", judul: "所得税 vs 消費税", isi: "所得税：収入から（PTKPあり）。消費税：商品購入から（PTKPなし）。" },
      ],

      caraTitle: "📐 所得税の計算方法",
      cara: [
        { step: "1", label: "額面収入を確認", desc: "基本給 + 手当 + ボーナス（月額または年額）。" },
        { step: "2", label: "非課税基準額を差し引く", desc: "PTKP TK/0 = 5,400万ルピア/年。低所得者を守るための基準。" },
        { step: "3", label: "課税所得を計算", desc: "PKP = 額面 − PTKP。PKP ≤ 0なら税金はかからない。" },
        { step: "4", label: "税率を掛ける", desc: "所得税 = 税率% × PKP。税率は所得ブラケットによって異なる。" },
        { step: "5", label: "手取りを計算", desc: "手取り = 額面 − 所得税。" },
      ],

      ptkpTableTitle: "📋 非課税基準額一覧（年間）",
      ptkpTable: [
        { status: "TK/0 – 独身・扶養なし",   nilai: "Rp 54,000,000" },
        { status: "TK/1 – 独身・扶養1名",   nilai: "Rp 58,500,000" },
        { status: "K/0  – 既婚・扶養なし",  nilai: "Rp 58,500,000" },
        { status: "K/1  – 既婚・扶養1名",   nilai: "Rp 63,000,000" },
        { status: "K/2  – 既婚・扶養2名",   nilai: "Rp 67,500,000" },
        { status: "K/3  – 既婚・扶養3名",   nilai: "Rp 72,000,000" },
      ],
      tarifTableTitle: "📈 累進税率（第17条）",
      tarifTable: [
        { pkp: "6,000万ルピア以下",              tarif: "5%" },
        { pkp: "6,000万〜2億5,000万ルピア",       tarif: "15%" },
        { pkp: "2億5,000万〜5億ルピア",           tarif: "25%" },
        { pkp: "5億ルピア超",                    tarif: "30%" },
      ],

      kalcTitle: "🧮 所得税計算機",
      kalcPeriode: "収入の期間:",
      kalcBulan: "月額",
      kalcTahun: "年額",
      kalcLabelBruto: (p: string) => `額面収入（${p === "bulan" ? "月額" : "年額"}）`,
      kalcLabelPtkp: "非課税基準額（年間）",
      kalcLabelTarif: "所得税率（%）",
      kalcPhBruto: "金額を入力",
      kalcPhCustomTarif: "その他",
      kalcBtnHitung: "所得税を計算",
      kalcResultTitle: "✅ 計算結果（年間）:",
      kalcResBruto: "額面収入",
      kalcResPtkp: "非課税基準額（控除）",
      kalcResPkp: "課税所得（PKP）",
      kalcResPph: (tarif: string) => `所得税（${tarif}% × PKP）`,
      kalcResBersih: "手取り",
      kalcDynZero: "PKP = 0 → 非課税基準額以下の収入 → 所得税免除！",
      kalcDynFormula: (bruto: string, ptkpVal: string, pkp: string, tarif: string, pph: string) =>
        `計算: PKP = ${bruto} − ${ptkpVal} = ${pkp} → 税 = ${tarif}% × ${pkp} = ${pph}`,

      kesalahanTitle: "⚠️ よくある間違いと重要なヒント",
      kesalahan: [
        {
          salah: "非課税基準額を差し引かずに、額面収入に直接税率を掛けてしまう",
          benar: "税 = 税率% × PKP。PKP = 額面 − PTKP。まずPTKPを差し引いてから計算してください。",
        },
        {
          salah: "非課税基準額以下の収入でも税金がかかると思い込む",
          benar: "PKP ≤ 0の場合、所得税 = 0。基準額以下の収入には一切税金はかかりません。",
        },
        {
          salah: "PTKPを手取りから差し引いてしまう（額面からではなく）",
          benar: "PKP = 額面 − PTKP。手取り = 額面 − 税金。この順序は逆にしてはいけません。",
        },
        {
          salah: "所得税と消費税を混同し、消費税の公式を所得税の問題に使ってしまう",
          benar: "所得税 ≠ 消費税。所得税は収入から（PTKPあり）、消費税は購入から（PTKPなし）。問題を丁寧に読んでください。",
        },
      ],

      contohTitle: "📖 例題と解説",
      contoh: [
        {
          diff: "基本", diffColor: "green",
          judul: "例題1 – 所得税と手取りを計算する",
          soal: "Hendraさんの月額給与は500万ルピア（額面）。PTKPは月300万ルピア。所得税率はPKPの5%。手取りはいくらですか？",
          steps: "📌 既知: 額面 = 500万、PTKP = 300万、税率 = 5%",
          maths: [
            "PKP = 5{,}000{,}000 - 3{,}000{,}000 = 2{,}000{,}000",
            "\\text{所得税} = 5\\% \\times 2{,}000{,}000 = 100{,}000",
            "\\text{手取り} = 5{,}000{,}000 - 100{,}000 = 4{,}900{,}000",
          ],
          answer: "✅ Hendraさんの手取り = 4,900,000",
        },
        {
          diff: "標準", diffColor: "yellow",
          judul: "例題2 – 非課税基準額以下の収入",
          soal: "パートタイムの従業員が月に220万ルピア稼いでいます。PTKPが月250万ルピア、税率5%の場合、所得税はいくらですか？",
          steps: "📌 まず課税所得を計算する",
          maths: ["PKP = 2{,}200{,}000 - 2{,}500{,}000 = -300{,}000"],
          midNote: "PKPが負の値（収入がPTKP以下）なので、PKP = 0として扱います。",
          maths2: ["\\text{所得税} = 5\\% \\times 0 = 0"],
          answer: "✅ この従業員は非課税基準額以下のため、所得税は不要です。",
        },
        {
          diff: "発展", diffColor: "red",
          judul: "例題3 – 手取りから額面を求める",
          soal: "Kartiniさんは所得税5%控除後に手取り440万ルピアを受け取っています。PTKPは250万ルピア。控除前の額面はいくらですか？",
          warning: "⚡ 額面をBとする",
          maths: [
            "PKP = B - 2{,}500{,}000",
            "\\text{税} = 5\\% \\times (B - 2{,}500{,}000)",
            "\\text{手取り} = B - \\text{税} = 4{,}400{,}000",
            "B - 0{.}05(B - 2{,}500{,}000) = 4{,}400{,}000",
            "B - 0{.}05B + 125{,}000 = 4{,}400{,}000",
            "0{.}95B = 4{,}275{,}000",
            "B = \\frac{4{,}275{,}000}{0{.}95} = 4{,}500{,}000",
          ],
          answer: "✅ Kartiniさんの額面 = 4,500,000",
        },
        {
          diff: "ボーナス", diffColor: "purple",
          judul: "例題4 – 税率を求める",
          soal: "Rudiさんの月額額面は800万、PTKP月300万。税控除後に475万を受け取っています。適用された税率は？",
          steps: "📌 既知: 額面 = 800万、PTKP = 300万、手取り = 475万",
          maths: [
            "PKP = 8{,}000{,}000 - 3{,}000{,}000 = 5{,}000{,}000",
            "\\text{税} = 8{,}000{,}000 - 4{,}750{,}000 = 3{,}250{,}000",
            "\\text{税率} = \\frac{3{,}250{,}000}{5{,}000{,}000} \\times 100\\% = 65\\%",
          ],
          warningNote: "⚠️ 65%の税率は非現実的です！PTKPが月額か年額か、問題データに誤りがないか確認してください。",
          answer: "✅ 税率（問題データによる）= 65% — これは答えの妥当性を確認することの重要性を示しています！",
        },
      ],

      rangkumanTitle: "⭐ まとめ：所得税",
      rangkuman: [
        "所得税は収入（給与・事業）に課税される。消費税（VAT）のような購入には適用されない。",
        "PKP = 額面収入 − PTKP。PKP ≤ 0なら税金はゼロ。",
        "所得税 = 税率% × PKP。手取り = 額面 − 所得税。",
        "PTKPは低所得者を保護する — PTKPが高いほど、税金を払う人が少なくなる。",
        "手取りから額面を求めるには：代数方程式を立てて解く。",
        "所得税 ≠ 消費税。所得税は収入から（PTKPあり）、消費税は消費から（PTKPなし）。",
      ],
      rumusCards: [
        { label: "課税所得",   math: "\\text{額面} - PTKP" },
        { label: "所得税",     math: "\\text{税率}\\% \\times PKP" },
        { label: "手取り",     math: "\\text{額面} - \\text{税}" },
        { label: "税率",       math: "\\frac{\\text{税}}{PKP} \\times 100\\%" },
      ],
      realWorldNote: "🌍 実生活との繋がり：親や兄弟が給与明細を受け取ると、「所得税控除」という行があります。これは、従業員が給与を受け取る前に会社が代わりに納付する税金です（源泉徴収制度）。給与明細を見せてもらい、所得税の行を探してみましょう！",

      backBtn: "← 社会算数に戻る",
    },
  };

  const Tr = T[lang as keyof typeof T] ?? T.id;
  const curr = lang === "id" ? "Rp" : "$";

  const diffColorMap: Record<string, { bg: string; text: string; border: string }> = {
    green:  { bg: "bg-green-500/20",  text: "text-green-400",  border: "border-green-500" },
    yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500" },
    red:    { bg: "bg-red-500/20",    text: "text-red-400",    border: "border-red-500" },
    purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500" },
  };

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg-primary)" }}>
      <Starfield />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 space-y-4">
        <PageNavigation />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span className="font-body text-xs text-emerald-400 font-semibold">{Tr.taxFull}</span>
          </div>
          <h1 className="font-body font-black text-2xl md:text-3xl text-white">{Tr.pageTitle}</h1>
          <p className="font-body text-sm text-muted-foreground">{Tr.pageSub}</p>
          {Tr.note && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-xs text-blue-200 font-body">
              ℹ️ {Tr.note}
            </div>
          )}
        </div>

        {/* INTRO */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
              <span className="font-body font-semibold text-white">{Tr.introTitle}</span>
            </div>
            {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>
          {expandedSections.includes("intro") && (
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{Tr.introText}</p>
              <div className="space-y-2">
                {Tr.introBullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 text-sm mt-0.5">•</span>
                    <p className="font-body text-sm text-white/70">{b}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {Tr.introFormulas.map((f, i) => (
                  <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 text-center">
                    <p className="font-mono text-xs text-emerald-300">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ANIMATION */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden p-4">
          <KantorPPh />
        </div>

        {/* KONSEP */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="font-body font-semibold text-white">{Tr.konsepTitle}</span>
            </div>
            {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>
          {expandedSections.includes("konsep") && (
            <div className="px-5 pb-5 grid grid-cols-2 gap-3">
              {Tr.konsep.map((k, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                  <span className="text-xl">{k.icon}</span>
                  <p className="font-body font-semibold text-white text-xs">{k.judul}</p>
                  <p className="font-body text-xs text-white/60">{k.isi}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARA HITUNG */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("cara")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-400" />
              <span className="font-body font-semibold text-white">{Tr.caraTitle}</span>
            </div>
            {expandedSections.includes("cara") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>
          {expandedSections.includes("cara") && (
            <div className="px-5 pb-5 space-y-3">
              {Tr.cara.map((c, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-800/40 rounded-xl px-4 py-3">
                  <span className="bg-emerald-500/20 text-emerald-400 font-black text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0">{c.step}</span>
                  <div>
                    <p className="font-body font-semibold text-white text-sm">{c.label}</p>
                    <p className="font-body text-xs text-white/60 mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-emerald-300 mb-2">{Tr.ptkpTableTitle}</p>
                  <div className="space-y-1">
                    {Tr.ptkpTable.map((row, i) => (
                      <div key={i} className="flex justify-between text-[10px] py-1 border-b border-slate-700/50">
                        <span className="text-white/60">{row.status}</span>
                        <span className="font-bold text-emerald-300">{row.nilai}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-blue-300 mb-2">{Tr.tarifTableTitle}</p>
                  <div className="space-y-1">
                    {Tr.tarifTable.map((row, i) => (
                      <div key={i} className="flex justify-between text-[10px] py-1 border-b border-slate-700/50">
                        <span className="text-white/60">{row.pkp}</span>
                        <span className="font-bold text-blue-300">{row.tarif}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KALKULATOR */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("kalkulator")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span className="font-body font-semibold text-white">{Tr.kalcTitle}</span>
            </div>
            {expandedSections.includes("kalkulator") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>
          {true && (
            <div className="px-5 pb-5 space-y-4">

              <div className="space-y-1">
                <label className="font-body text-xs text-emerald-300/80 font-semibold">{Tr.kalcPeriode}</label>
                <div className="flex gap-2">
                  {(["bulan", "tahun"] as const).map((p) => (
                    <button key={p}
                      onClick={() => { setPeriode(p); setKalcResult(null); playPopSound(); }}
                      className="flex-1 py-2 rounded-lg text-xs font-body font-bold transition-all"
                      style={periode === p
                        ? { background: "rgba(52,211,153,0.25)", border: "1.5px solid rgba(52,211,153,0.8)", color: "#34d399" }
                        : { background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.4)" }}>
                      {p === "bulan" ? Tr.kalcBulan : Tr.kalcTahun}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-body text-xs text-emerald-300/80 font-semibold">
                  {Tr.kalcLabelBruto(periode)}
                </label>
                <input type="number" value={bruto}
                  onChange={(e) => { setBruto(e.target.value); setKalcResult(null); }}
                  placeholder={Tr.kalcPhBruto}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none transition-colors"
                  style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }} />
              </div>

              <div className="space-y-1">
                <label className="font-body text-xs text-emerald-300/80 font-semibold">{Tr.kalcLabelPtkp}</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "54 Jt", val: "54000000" },
                    { label: "63 Jt", val: "63000000" },
                    { label: "67,5 Jt", val: "67500000" },
                  ].map((t) => (
                    <button key={t.val} onClick={() => { setPtkp(t.val); setKalcResult(null); playPopSound(); }}
                      className="flex-1 py-2 rounded-lg text-xs font-body font-bold transition-all"
                      style={ptkp === t.val
                        ? { background: "rgba(52,211,153,0.25)", border: "1.5px solid rgba(52,211,153,0.8)", color: "#34d399" }
                        : { background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.4)" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-body text-xs text-emerald-300/80 font-semibold flex items-center gap-1">
                  <Percent className="w-3 h-3" /> {Tr.kalcLabelTarif}
                </label>
                <div className="flex gap-2">
                  {["5", "15", "25"].map((t) => (
                    <button key={t} onClick={() => { setTarifPPh(t); setKalcResult(null); playPopSound(); }}
                      className="flex-1 py-2.5 rounded-lg text-xs font-body font-bold transition-all"
                      style={tarifPPh === t
                        ? { background: "rgba(52,211,153,0.25)", border: "1.5px solid rgba(52,211,153,0.8)", color: "#34d399" }
                        : { background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.4)" }}>
                      {t}%
                    </button>
                  ))}
                  <input type="number" value={!["5","15","25"].includes(tarifPPh) ? tarifPPh : ""}
                    onChange={(e) => { setTarifPPh(e.target.value); setKalcResult(null); }}
                    placeholder={Tr.kalcPhCustomTarif}
                    className="flex-1 rounded-lg px-2 py-2.5 text-xs text-white font-body focus:outline-none text-center"
                    style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }} />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={hitungPPh}
                  className="flex-1 font-body font-bold text-sm py-3 rounded-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(90deg, #059669, #10b981)", color: "#001a0a" }}>
                  <Zap className="w-4 h-4" /> {Tr.kalcBtnHitung}
                </button>
                <button onClick={resetKalkulator}
                  className="px-4 rounded-lg font-body text-sm py-3 transition-colors hover:opacity-80"
                  style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.5)" }}>
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {kalcResult && (
                <div className="rounded-xl p-4 space-y-2 animate-slide-up" style={{ background: "rgba(52,211,153,0.07)", border: "1.5px solid rgba(52,211,153,0.35)" }}>
                  <p className="font-body text-xs font-bold text-emerald-300">{Tr.kalcResultTitle}</p>
                  <div className="space-y-2">
                    {[
                      { label: Tr.kalcResBruto, val: formatRupiah(kalcResult.bruto), color: "text-white" },
                      { label: Tr.kalcResPtkp, val: `−${formatRupiah(kalcResult.ptkp)}`, color: "text-orange-400" },
                      { label: Tr.kalcResPkp, val: formatRupiah(kalcResult.pkp), color: "text-yellow-300" },
                      { label: Tr.kalcResPph(tarifPPh), val: `−${formatRupiah(kalcResult.pph)}`, color: "text-red-400" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "var(--bg-secondary)" }}>
                        <span className="font-body text-xs text-emerald-200/60">{label}</span>
                        <span className={`font-body text-sm font-bold ${color}`}>{val}</span>
                      </div>
                    ))}
                    <div className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.2), rgba(52,211,153,0.1))", border: "1px solid rgba(52,211,153,0.4)" }}>
                      <span className="font-body text-sm font-bold text-emerald-200">{Tr.kalcResBersih}</span>
                      <span className="font-body text-lg font-black text-emerald-300">{formatRupiah(kalcResult.bersih)}</span>
                    </div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px dashed rgba(52,211,153,0.2)" }}>
                    <p className="font-body text-xs text-emerald-300/60 text-center">
                      {kalcResult.pkp === 0
                        ? Tr.kalcDynZero
                        : Tr.kalcDynFormula(
                            formatRupiah(kalcResult.bruto),
                            formatRupiah(kalcResult.ptkp),
                            formatRupiah(kalcResult.pkp),
                            tarifPPh,
                            formatRupiah(kalcResult.pph),
                          )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* KESALAHAN UMUM */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("kesalahan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="font-body font-semibold text-white">{Tr.kesalahanTitle}</span>
            </div>
            <ChevronUp className="w-5 h-5 text-primary" />
          </button>
          {true && (
            <div className="px-5 pb-5 space-y-3">
              {Tr.kesalahan.map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-red-300">{item.salah}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-green-300">{item.benar}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTOH SOAL */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="font-body font-semibold text-white">{Tr.contohTitle}</span>
            </div>
            <ChevronUp className="w-5 h-5 text-primary" />
          </button>
          {true && (
            <div className="px-5 pb-5 space-y-6">
              {Tr.contoh.map((c: any, i: number) => {
                const dc = diffColorMap[c.diffColor] ?? diffColorMap.green;
                return (
                  <div key={i} className={`border-l-4 ${dc.border} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`${dc.bg} ${dc.text} text-xs font-bold px-2 py-1 rounded`}>{c.diff}</span>
                      <span className="font-body font-semibold text-white text-sm">{c.judul}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{c.soal}</p>
                    </div>
                    <div className="rounded-lg p-4 space-y-2" style={{ background: "rgba(30,41,59,0.6)" }}>
                      {c.steps && (
                        <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">{c.steps}</p>
                      )}
                      {c.warning && (
                        <p className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded px-3 py-2">{c.warning}</p>
                      )}
                      {c.maths && (
                        <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                          {c.maths.map((m: string, mi: number) => (
                            <BlockMath key={mi} math={m} />
                          ))}
                        </div>
                      )}
                      {c.midNote && (
                        <p className="font-body text-xs text-white/70">{c.midNote}</p>
                      )}
                      {c.maths2 && (
                        <div className="bg-slate-900/60 rounded-lg p-3">
                          {c.maths2.map((m: string, mi: number) => (
                            <BlockMath key={mi} math={m} />
                          ))}
                        </div>
                      )}
                      {c.warningNote && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded px-3 py-2">
                          <p className="font-body text-xs text-orange-300">{c.warningNote}</p>
                        </div>
                      )}
                      <p className={`${dc.text} font-semibold text-xs bg-green-500/10 border border-green-500/20 rounded px-3 py-2`}>
                        <strong>{c.answer}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RANGKUMAN */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("rangkuman")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-body font-semibold text-white">{Tr.rangkumanTitle}</span>
            </div>
            <ChevronUp className="w-5 h-5 text-primary" />
          </button>
          {true && (
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-slate-800/60 border border-border rounded-xl p-4 space-y-3">
                {Tr.rangkuman.map((poin, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="font-body text-sm text-white/80">{poin}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/60 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-white/60 mb-3 text-center">
                  📐 {lang === "id" ? "Kartu Rumus Singkat" : lang === "ja" ? "公式カード" : "Formula Cards"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Tr.rumusCards.map((r) => (
                    <div key={r.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                      <p className="font-body text-[10px] text-white/40 mb-1">{r.label}</p>
                      <BlockMath math={r.math} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="font-body text-xs text-blue-200 leading-relaxed">{Tr.realWorldNote}</p>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="mt-8 text-center pb-8">
        <button
          onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aritmetika-sosial"); }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
        >
          {Tr.backBtn}
        </button>
      </div>
    </div>
  );
};

export default PPhPage;
