import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import RestoranPPN from "@/components/RestoranPPN";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, Receipt, AlertCircle, Star, Zap, RotateCcw,
  CheckCircle, XCircle, Percent, ShoppingCart
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const PPNPage = () => {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();

  const makeFmt = (l: string) => (n: number) =>
    (l === "id" ? "Rp" : "$") + Math.round(n).toLocaleString(l === "id" ? "id-ID" : "en-US");
  const formatRupiah = makeFmt(lang);

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "kapan", "kalkulator", "kesalahan", "contoh", "rangkuman",
  ]);

  const [harga, setHarga] = useState("");
  const [persen, setPersen] = useState("11");
  const [mode, setMode] = useState<"tambah" | "cari">("tambah");
  const [kalcResult, setKalcResult] = useState<null | { ppn: number; total: number; asli: number }>(null);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const hitungPPN = () => {
    const h = parseFloat(harga.replace(/[^0-9.]/g, ""));
    const p = parseFloat(persen) / 100;
    if (!h || !p || isNaN(h) || isNaN(p)) return;
    if (mode === "tambah") {
      const ppn = h * p;
      setKalcResult({ ppn, total: h + ppn, asli: h });
    } else {
      const asli = h / (1 + p);
      const ppn = h - asli;
      setKalcResult({ ppn, total: h, asli });
    }
    playPopSound();
  };

  const T = {
    id: {
      pageTitle: "PAJAK PERTAMBAHAN NILAI (PPN)",
      pageSub: "Kelas 7 · Aritmetika Sosial · Materi Matematika",
      taxName: "PPN",
      taxFull: "Pajak Pertambahan Nilai",
      note: null as string | null,

      introTitle: "💡 Apa Itu PPN?",
      introText: "PPN (Pajak Pertambahan Nilai) adalah pajak yang dikenakan atas konsumsi Barang Kena Pajak (BKP) dan/atau Jasa Kena Pajak (JKP) di dalam negeri. Setiap kali kamu membeli makanan di restoran, belanja online, atau beli gadget, kamu sudah membayar PPN.",
      introBullets: [
        "PPN bersifat pajak tidak langsung — dikenakan ke konsumen, dibayar lewat penjual",
        "Tarif PPN di Indonesia: 11% (barang umum) atau 12% (barang mewah)",
        "PPN sudah termasuk dalam harga jual yang tertera di struk belanja",
      ],
      introFormula1: "Total Bayar = Harga Asli + PPN = Harga Asli × (1 + %PPN)",
      introFormula2: "Harga Asli = Total Bayar ÷ (1 + %PPN)",

      konsepTitle: "🔑 Konsep Dasar PPN",
      konsep: [
        { icon: "💰", judul: "Harga Asli (Before Tax)", isi: "Harga barang/jasa sebelum dikenakan PPN." },
        { icon: "🧾", judul: "Besar PPN",               isi: "Nilai pajak yang ditambahkan = %PPN × Harga Asli." },
        { icon: "🛒", judul: "Total Bayar",             isi: "Jumlah yang dibayar konsumen = Harga Asli + Besar PPN." },
        { icon: "🔍", judul: "Mencari Harga Asli",      isi: "Jika total sudah termasuk PPN: Harga Asli = Total ÷ (1 + %PPN)." },
      ],

      kapanTitle: "📍 Kapan PPN Dikenakan?",
      kapanItems: [
        { icon: "🍽️", label: "Makan di restoran",           yes: true },
        { icon: "🛒", label: "Belanja di supermarket",       yes: true },
        { icon: "📱", label: "Beli gadget/elektronik",       yes: true },
        { icon: "🌾", label: "Bahan pangan pokok (beras, dll)", yes: false },
        { icon: "📚", label: "Buku pelajaran",               yes: false },
        { icon: "💊", label: "Obat-obatan",                  yes: false },
      ],
      kapanYes: "✅ Kena PPN",
      kapanNo:  "❌ Bebas PPN",

      imgCaption: "Struk restoran Burger Express menampilkan baris PPN 11% — perhatikan rincian total bayar!",
      imgAlt: "Struk Burger Express - contoh konsumsi yang dikenai PPN",

      kalcTitle: "🧮 Kalkulator PPN",
      kalcMode1: "➕ Harga Belum PPN → Hitung Total",
      kalcMode2: "🔍 Total Sudah PPN → Cari Harga Asli",
      kalcLabelMode1: "Harga Asli (sebelum PPN)",
      kalcLabelMode2: "Total Bayar (sudah termasuk PPN)",
      kalcPh1: "Masukkan harga awal",
      kalcPh2: "Masukkan total bayar",
      kalcPreset: "Preset tarif:",
      kalcBtnHitung: "Hitung PPN",
      kalcBtnReset: "Reset",
      kalcResHarga: "Harga Asli",
      kalcResPPN: "Besar PPN",
      kalcResTotal: "Total Bayar",
      kalcResAsli: "Harga Asli",
      kalcDynTambah: (asli: string, pct: string, ppn: string, total: string) =>
        `Cara hitung: ${asli} × ${pct}% = ${ppn} (PPN) → Total = ${total}`,
      kalcDynCari: (total: string, pct: string, asli: string) =>
        `Cara hitung: ${total} ÷ 1,${pct} = ${asli} (harga asli)`,

      kesalahanTitle: "⚠️ Kesalahan Umum & Tips Penting",
      kesalahan: [
        {
          salah: "Menghitung PPN dari total bayar yang sudah termasuk PPN",
          benar: "PPN = %PPN × Harga Asli (sebelum PPN). Jika total sudah termasuk PPN, cari dulu harga aslinya dengan membagi (1 + %PPN).",
        },
        {
          salah: "Menghitung PPN dari harga awal ketika ada diskon terlebih dahulu",
          benar: "Urutan wajib: diskon dulu → PPN dari harga setelah diskon. PPN bukan dari harga sebelum diskon!",
        },
        {
          salah: "Lupa menambahkan PPN ke harga asli — hanya melaporkan nilai PPN saja sebagai jawaban",
          benar: "Total Bayar = Harga Asli + Besar PPN. Jika soal menanya 'total bayar', pastikan harga asli sudah ditambah PPN.",
        },
        {
          salah: "Bingung 11% vs 12% dan asal pakai tanpa membaca soal",
          benar: "Baca soal cermat. Tarif harus tertulis di soal. 11% untuk barang umum, 12% untuk yang dikategorikan mewah.",
        },
      ],

      contohTitle: "📖 Contoh Soal & Pembahasan",
      contoh: [
        {
          diff: "MUDAH", diffColor: "green",
          judul: "Contoh 1 – Total Bayar dengan PPN",
          soal: "Sebuah buku elektronik dijual Rp120.000 belum termasuk PPN. Jika PPN yang dikenakan 11%, berapa total yang harus dibayar?",
          steps: "📌 Diketahui: Harga = Rp120.000, PPN = 11%. Harga belum termasuk PPN.",
          maths: [
            "\\text{PPN} = 11\\% \\times 120.000 = \\text{Rp}13.200",
            "\\text{Total} = 120.000 + 13.200 = \\text{Rp}133.200",
          ],
          note: "Cara cepat: 120.000 × 1,11 = Rp133.200",
          noteKatex: "120.000 \\times 1{,}11 = \\text{Rp}133.200",
          answer: "✅ Total yang harus dibayar = Rp133.200",
        },
        {
          diff: "SEDANG", diffColor: "yellow",
          judul: "Contoh 2 – Mencari Harga Sebelum PPN",
          soal: "Dani membayar Rp555.000 untuk sepatu, termasuk PPN 11%. Berapa harga sepatu sebelum PPN?",
          steps: "📌 Total Rp555.000 sudah termasuk PPN. Berarti total = 111% dari harga asli.",
          maths: [
            "\\text{Harga Asli} = \\frac{555.000}{1{,}11} = \\text{Rp}500.000",
          ],
          note: "Verifikasi: 500.000 × 1,11 = Rp555.000 ✓",
          noteKatex: null,
          answer: "✅ Harga sebelum PPN = Rp500.000",
        },
        {
          diff: "SULIT", diffColor: "red",
          judul: "Contoh 3 – Diskon + PPN",
          soal: "Restoran memberi diskon 15% untuk semua menu, lalu dikenakan PPN 11%. Jika harga awal Rp120.000, berapa total bayar?",
          steps: null,
          warning: "⚡ Urutan: diskon dulu → baru PPN dari harga setelah diskon!",
          step1: "Langkah 1: Harga setelah diskon:",
          math1: "120.000 \\times (100\\% - 15\\%) = 120.000 \\times 85\\% = \\text{Rp}102.000",
          step2: "Langkah 2: Total bayar + PPN 11%:",
          math2: "102.000 \\times 1{,}11 = \\text{Rp}113.220",
          answer: "✅ Total yang harus dibayar = Rp113.220",
        },
        {
          diff: "BONUS", diffColor: "purple",
          judul: "Contoh 4 – Mencari Tarif PPN",
          soal: "Siti membeli tas seharga Rp400.000 (harga asli) dan membayar Rp448.000. Berapa persentase PPN yang dibebankan?",
          steps: null,
          maths: [
            "\\text{Besar PPN} = 448.000 - 400.000 = \\text{Rp}48.000",
            "\\%\\text{PPN} = \\frac{48.000}{400.000} \\times 100\\% = 12\\%",
          ],
          answer: "✅ Tarif PPN yang dibebankan = 12%",
        },
      ],

      rangkumanTitle: "⭐ Rangkuman Materi PPN",
      rangkuman: [
        "PPN = pajak yang dikenakan atas konsumsi barang/jasa. Konsumen akhir yang menanggungnya.",
        "Tarif: 11% (umum) atau 12% (mewah). Selalu cek soal untuk tarif yang digunakan.",
        "Total Bayar = Harga Asli × (1 + %PPN). Contoh: ×1,11 untuk PPN 11%.",
        "Harga Asli dari total termasuk PPN = Total Bayar ÷ (1 + %PPN). Contoh: ÷1,11.",
        "Jika ada diskon + PPN: hitung diskon dulu, baru PPN dari harga setelah diskon.",
        "PPN ≠ PPh. PPN dikenakan saat membeli barang/jasa. PPh dikenakan dari penghasilan.",
      ],
      rumusCards: [
        { label: "Besar PPN",   math: "\\%\\text{PPN} \\times \\text{Harga}" },
        { label: "Total Bayar", math: "\\text{Harga} \\times (1 + \\%\\text{PPN})" },
        { label: "Harga Asli",  math: "\\frac{\\text{Total}}{1 + \\%\\text{PPN}}" },
        { label: "Tarif PPN",   math: "\\frac{\\text{PPN}}{\\text{Harga Asli}} \\times 100\\%" },
      ],
      realWorldNote: "🌍 Koneksi ke Kehidupan Nyata: Setiap kali kamu beli makanan di restoran, belanja online, atau beli gadget, PPN sudah termasuk dalam harga yang kamu bayar. Coba cek struk belanjaanmu — ada baris PPN di sana!",

      backBtn: "← Kembali ke Aritmetika Sosial",
    },

    en: {
      pageTitle: "VALUE ADDED TAX (VAT)",
      pageSub: "Grade 7 · Social Arithmetic · Mathematics",
      taxName: "VAT",
      taxFull: "Value Added Tax",
      note: "Note: This page uses Indonesia's VAT system as an illustrative example of consumption tax concepts.",

      introTitle: "💡 What Is VAT?",
      introText: "VAT (Value Added Tax) is a tax levied on the consumption of goods and services. Every time you buy food at a restaurant, shop online, or buy a gadget, you pay VAT.",
      introBullets: [
        "VAT is an indirect tax — charged to the consumer, collected by the seller",
        "In Indonesia: 11% (regular goods) or 12% (luxury goods)",
        "VAT is usually included in the displayed price on your receipt",
      ],
      introFormula1: "Total = Original Price + VAT = Original Price × (1 + %VAT)",
      introFormula2: "Original Price = Total ÷ (1 + %VAT)",

      konsepTitle: "🔑 Key VAT Concepts",
      konsep: [
        { icon: "💰", judul: "Original Price (Before Tax)", isi: "The price before VAT is applied." },
        { icon: "🧾", judul: "VAT Amount",                  isi: "The tax added = %VAT × Original Price." },
        { icon: "🛒", judul: "Total to Pay",                isi: "Amount consumer pays = Original Price + VAT." },
        { icon: "🔍", judul: "Finding Original Price",      isi: "If total already includes VAT: Original = Total ÷ (1 + %VAT)." },
      ],

      kapanTitle: "📍 When Is VAT Applied?",
      kapanItems: [
        { icon: "🍽️", label: "Dining at a restaurant",      yes: true },
        { icon: "🛒", label: "Shopping at a supermarket",   yes: true },
        { icon: "📱", label: "Buying gadgets/electronics",  yes: true },
        { icon: "🌾", label: "Basic staple foods (rice, etc.)", yes: false },
        { icon: "📚", label: "Textbooks",                   yes: false },
        { icon: "💊", label: "Medicines",                   yes: false },
      ],
      kapanYes: "✅ VAT Applied",
      kapanNo:  "❌ VAT Exempt",

      imgCaption: "A Burger Express receipt showing an 11% VAT line — notice the itemized total breakdown!",
      imgAlt: "Burger Express receipt — example of VAT applied to restaurant dining",

      kalcTitle: "🧮 VAT Calculator",
      kalcMode1: "➕ Price Before VAT → Calculate Total",
      kalcMode2: "🔍 Total With VAT → Find Original Price",
      kalcLabelMode1: "Original Price (before VAT)",
      kalcLabelMode2: "Total Paid (VAT included)",
      kalcPh1: "Enter original price",
      kalcPh2: "Enter total paid",
      kalcPreset: "Preset rates:",
      kalcBtnHitung: "Calculate VAT",
      kalcBtnReset: "Reset",
      kalcResHarga: "Original Price",
      kalcResPPN: "VAT Amount",
      kalcResTotal: "Total to Pay",
      kalcResAsli: "Original Price",
      kalcDynTambah: (asli: string, pct: string, ppn: string, total: string) =>
        `Calculation: ${asli} × ${pct}% = ${ppn} (VAT) → Total = ${total}`,
      kalcDynCari: (total: string, pct: string, asli: string) =>
        `Calculation: ${total} ÷ 1.${pct} = ${asli} (original price)`,

      kesalahanTitle: "⚠️ Common Mistakes & Important Tips",
      kesalahan: [
        {
          salah: "Calculating VAT from the total that already includes VAT",
          benar: "VAT = %VAT × Original Price. If the total already includes VAT, divide by (1 + %VAT) first to find the original price.",
        },
        {
          salah: "Applying VAT to the pre-discount price when a discount is given first",
          benar: "Correct order: apply discount first → then apply VAT to the discounted price, NOT the original price!",
        },
        {
          salah: "Forgetting to add VAT to the original price — reporting only the VAT amount as the answer",
          benar: "Total = Original Price + VAT Amount. If the question asks for 'total to pay', make sure VAT is added to the original price.",
        },
        {
          salah: "Confusing 11% and 12% and using the wrong rate without reading the question carefully",
          benar: "Read carefully. The rate must be stated in the question. 11% for regular goods, 12% for luxury goods.",
        },
      ],

      contohTitle: "📖 Example Problems & Solutions",
      contoh: [
        {
          diff: "EASY", diffColor: "green",
          judul: "Example 1 – Total to Pay with VAT",
          soal: "An e-book is sold for Rp120,000 excluding VAT. If the applicable VAT rate is 11%, what is the total amount to be paid?",
          steps: "📌 Given: Price = Rp120,000, VAT = 11%. Price does not include VAT.",
          maths: [
            "\\text{VAT} = 11\\% \\times 120{,}000 = \\text{Rp}13{,}200",
            "\\text{Total} = 120{,}000 + 13{,}200 = \\text{Rp}133{,}200",
          ],
          note: "Quick method: 120,000 × 1.11 = Rp133,200",
          noteKatex: "120{,}000 \\times 1{.}11 = \\text{Rp}133{,}200",
          answer: "✅ Total to pay = Rp133,200",
        },
        {
          diff: "MEDIUM", diffColor: "yellow",
          judul: "Example 2 – Finding the Original Price",
          soal: "Dani paid Rp555,000 for shoes, including 11% VAT. What is the price of the shoes before VAT?",
          steps: "📌 Total Rp555,000 already includes VAT. So the total = 111% of the original price.",
          maths: [
            "\\text{Original Price} = \\frac{555{,}000}{1{.}11} = \\text{Rp}500{,}000",
          ],
          note: "Verification: 500,000 × 1.11 = Rp555,000 ✓",
          noteKatex: null,
          answer: "✅ Price before VAT = Rp500,000",
        },
        {
          diff: "HARD", diffColor: "red",
          judul: "Example 3 – Discount + VAT",
          soal: "A restaurant gives a 15% discount on all menu items, then applies 11% VAT. If the original price is Rp120,000, what is the total to pay?",
          steps: null,
          warning: "⚡ Order: apply discount first → then VAT from the discounted price!",
          step1: "Step 1: Price after discount:",
          math1: "120{,}000 \\times (100\\% - 15\\%) = 120{,}000 \\times 85\\% = \\text{Rp}102{,}000",
          step2: "Step 2: Total with 11% VAT:",
          math2: "102{,}000 \\times 1{.}11 = \\text{Rp}113{,}220",
          answer: "✅ Total to pay = Rp113,220",
        },
        {
          diff: "BONUS", diffColor: "purple",
          judul: "Example 4 – Finding the VAT Rate",
          soal: "Siti bought a bag for Rp400,000 (original price) and paid Rp448,000. What is the VAT rate applied?",
          steps: null,
          maths: [
            "\\text{VAT Amount} = 448{,}000 - 400{,}000 = \\text{Rp}48{,}000",
            "\\%\\text{VAT} = \\frac{48{,}000}{400{,}000} \\times 100\\% = 12\\%",
          ],
          answer: "✅ VAT rate applied = 12%",
        },
      ],

      rangkumanTitle: "⭐ Summary: VAT",
      rangkuman: [
        "VAT is a tax on the consumption of goods and services, paid by the final consumer.",
        "Rates: 11% (regular goods) or 12% (luxury goods). Always check the rate given in the question.",
        "Total = Original Price × (1 + %VAT). For 11% VAT: multiply by 1.11.",
        "To find the original price when total includes VAT: divide by (1 + %VAT). For 11%: ÷1.11.",
        "If discount + VAT: apply discount first, then apply VAT to the discounted price.",
        "VAT ≠ Income Tax (PPh). VAT is on purchasing goods/services; Income Tax is on earnings.",
      ],
      rumusCards: [
        { label: "VAT Amount",      math: "\\%\\text{VAT} \\times \\text{Price}" },
        { label: "Total to Pay",    math: "\\text{Price} \\times (1 + \\%\\text{VAT})" },
        { label: "Original Price",  math: "\\frac{\\text{Total}}{1 + \\%\\text{VAT}}" },
        { label: "VAT Rate",        math: "\\frac{\\text{VAT}}{\\text{Original}} \\times 100\\%" },
      ],
      realWorldNote: "🌍 Real-World Connection: Every time you eat at a restaurant, shop online, or buy a gadget, VAT is included in the price you pay. Check your receipt — there's a VAT line there!",

      backBtn: "← Back to Social Arithmetic",
    },

    ja: {
      pageTitle: "付加価値税（消費税）",
      pageSub: "中学1年 · 社会算数 · 数学",
      taxName: "消費税",
      taxFull: "付加価値税",
      note: "注意：このページはインドネシアの消費税制度を消費課税の学習例として使用しています。",

      introTitle: "💡 消費税とは？",
      introText: "消費税（VAT）は、国内での商品・サービスの消費に課税される税金です。レストランでの食事、ネットショッピング、ガジェット購入など、あらゆる消費活動に適用されます。",
      introBullets: [
        "消費税は間接税 — 消費者が負担し、販売者が代わりに納付する",
        "インドネシアの税率：一般商品11%、奢侈品12%",
        "消費税はレシートの表示価格に含まれていることが多い",
      ],
      introFormula1: "合計 = 定価 + 消費税 = 定価 × (1 + 税率%)",
      introFormula2: "定価 = 合計 ÷ (1 + 税率%)",

      konsepTitle: "🔑 消費税の基本概念",
      konsep: [
        { icon: "💰", judul: "税抜価格",     isi: "消費税が適用される前の価格。" },
        { icon: "🧾", judul: "消費税額",     isi: "加算される税額 = 税率% × 税抜価格。" },
        { icon: "🛒", judul: "税込合計",     isi: "消費者が支払う金額 = 税抜価格 + 消費税額。" },
        { icon: "🔍", judul: "税抜価格の求め方", isi: "合計が税込の場合：税抜価格 = 合計 ÷ (1 + 税率%)。" },
      ],

      kapanTitle: "📍 消費税が課税される場合",
      kapanItems: [
        { icon: "🍽️", label: "レストランでの食事",       yes: true },
        { icon: "🛒", label: "スーパーでの買い物",        yes: true },
        { icon: "📱", label: "ガジェット・電子機器の購入", yes: true },
        { icon: "🌾", label: "主食（米など）",            yes: false },
        { icon: "📚", label: "教科書",                    yes: false },
        { icon: "💊", label: "医薬品",                    yes: false },
      ],
      kapanYes: "✅ 課税対象",
      kapanNo:  "❌ 非課税",

      imgCaption: "Burger Expressのレシートに消費税11%の行が表示されています — 合計内訳をご確認ください！",
      imgAlt: "Burger Expressのレシート — レストランで消費税が適用される例",

      kalcTitle: "🧮 消費税計算機",
      kalcMode1: "➕ 税抜価格 → 税込合計を計算",
      kalcMode2: "🔍 税込合計 → 税抜価格を求める",
      kalcLabelMode1: "税抜価格（消費税前）",
      kalcLabelMode2: "税込合計（消費税込み）",
      kalcPh1: "税抜価格を入力",
      kalcPh2: "税込合計を入力",
      kalcPreset: "税率プリセット:",
      kalcBtnHitung: "消費税を計算",
      kalcBtnReset: "リセット",
      kalcResHarga: "税抜価格",
      kalcResPPN: "消費税額",
      kalcResTotal: "税込合計",
      kalcResAsli: "税抜価格",
      kalcDynTambah: (asli: string, pct: string, ppn: string, total: string) =>
        `計算: ${asli} × ${pct}% = ${ppn}（消費税）→ 合計 = ${total}`,
      kalcDynCari: (total: string, pct: string, asli: string) =>
        `計算: ${total} ÷ 1.${pct} = ${asli}（税抜価格）`,

      kesalahanTitle: "⚠️ よくある間違いと重要なヒント",
      kesalahan: [
        {
          salah: "税込合計から消費税を計算してしまう",
          benar: "消費税 = 税率% × 税抜価格。合計が税込の場合、まず(1 + 税率%)で割って税抜価格を求めてください。",
        },
        {
          salah: "割引がある場合に、割引前の価格に消費税を適用してしまう",
          benar: "正しい順序：割引を先に適用 → 割引後の価格に消費税を適用。割引前の価格には適用しない！",
        },
        {
          salah: "税抜価格に消費税を加算し忘れ、消費税額だけを答えとしてしまう",
          benar: "合計 = 税抜価格 + 消費税額。問題が「支払い合計」を聞いている場合、消費税を加算することを忘れずに。",
        },
        {
          salah: "11%と12%を混同し、問題を読まずに使ってしまう",
          benar: "問題をよく読んでください。税率は問題文に明記されているはずです。11%は一般商品、12%は奢侈品。",
        },
      ],

      contohTitle: "📖 例題と解説",
      contoh: [
        {
          diff: "基本", diffColor: "green",
          judul: "例題1 – 消費税込みの合計を求める",
          soal: "電子書籍が120,000円（税抜）で販売されています。消費税率が11%の場合、支払い合計はいくらですか？",
          steps: "📌 既知: 価格 = 120,000円、消費税 = 11%。税抜価格です。",
          maths: [
            "\\text{消費税} = 11\\% \\times 120{,}000 = 13{,}200",
            "\\text{合計} = 120{,}000 + 13{,}200 = 133{,}200",
          ],
          note: "素早い計算: 120,000 × 1.11 = 133,200",
          noteKatex: "120{,}000 \\times 1{.}11 = 133{,}200",
          answer: "✅ 支払い合計 = 133,200",
        },
        {
          diff: "標準", diffColor: "yellow",
          judul: "例題2 – 税抜価格を求める",
          soal: "Daniさんは靴を555,000円（消費税11%込み）で購入しました。消費税を除いた価格はいくらですか？",
          steps: "📌 合計555,000円は消費税込みです。つまり合計 = 税抜価格の111%。",
          maths: [
            "\\text{税抜価格} = \\frac{555{,}000}{1{.}11} = 500{,}000",
          ],
          note: "確認: 500,000 × 1.11 = 555,000 ✓",
          noteKatex: null,
          answer: "✅ 消費税前の価格 = 500,000",
        },
        {
          diff: "発展", diffColor: "red",
          judul: "例題3 – 割引 + 消費税",
          soal: "レストランが全メニューに15%割引を提供し、さらに11%の消費税が課されます。元の価格が120,000円の場合、支払い合計はいくらですか？",
          steps: null,
          warning: "⚡ 順序：割引を先に適用 → 割引後の価格に消費税を適用！",
          step1: "ステップ1：割引後の価格：",
          math1: "120{,}000 \\times (100\\% - 15\\%) = 120{,}000 \\times 85\\% = 102{,}000",
          step2: "ステップ2：消費税11%込みの合計：",
          math2: "102{,}000 \\times 1{.}11 = 113{,}220",
          answer: "✅ 支払い合計 = 113,220",
        },
        {
          diff: "ボーナス", diffColor: "purple",
          judul: "例題4 – 消費税率を求める",
          soal: "Sitiさんはバッグを400,000円（税抜）で購入し、448,000円支払いました。適用された消費税率は何%ですか？",
          steps: null,
          maths: [
            "\\text{消費税額} = 448{,}000 - 400{,}000 = 48{,}000",
            "\\text{税率} = \\frac{48{,}000}{400{,}000} \\times 100\\% = 12\\%",
          ],
          answer: "✅ 適用された消費税率 = 12%",
        },
      ],

      rangkumanTitle: "⭐ まとめ：消費税",
      rangkuman: [
        "消費税は商品・サービスの消費に課税される税金で、最終消費者が負担します。",
        "税率：11%（一般）または12%（奢侈品）。問題文で確認してください。",
        "合計 = 税抜価格 × (1 + 税率%)。11%の場合：×1.11。",
        "税込合計から税抜価格を求める：÷ (1 + 税率%)。11%の場合：÷1.11。",
        "割引 + 消費税の場合：割引を先に適用し、次に消費税を計算する。",
        "消費税 ≠ 所得税。消費税は商品購入時に、所得税は収入から課税されます。",
      ],
      rumusCards: [
        { label: "消費税額",   math: "\\text{税率}\\% \\times \\text{価格}" },
        { label: "税込合計",   math: "\\text{価格} \\times (1 + \\text{税率}\\%)" },
        { label: "税抜価格",   math: "\\frac{\\text{合計}}{1 + \\text{税率}\\%}" },
        { label: "消費税率",   math: "\\frac{\\text{消費税額}}{\\text{税抜価格}} \\times 100\\%" },
      ],
      realWorldNote: "🌍 実生活との繋がり：レストランで食事をしたり、ネットで買い物したり、ガジェットを購入するたびに、消費税は価格に含まれています。レシートを確認してみましょう — 消費税の行が見つかるはずです！",

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
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span className="font-body text-xs text-amber-400 font-semibold">{Tr.taxFull}</span>
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
              <Lightbulb className="w-5 h-5 text-amber-400" />
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
                    <span className="text-amber-400 text-sm mt-0.5">•</span>
                    <p className="font-body text-sm text-white/70">{b}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[Tr.introFormula1, Tr.introFormula2].map((f, i) => (
                  <div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-center">
                    <p className="font-mono text-xs text-amber-300">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* IMAGE */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 gap-0">
            <div className="p-3">
              <img
                src="/image_ppn_kfc_makan2.png"
                alt={Tr.imgAlt}
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: 180 }}
              />
            </div>
            <div className="p-3">
              <img
                src="/image_ppn_struk3.png"
                alt={`${Tr.taxName} receipt`}
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: 180 }}
              />
            </div>
          </div>
          <div className="px-4 pb-3">
            <p className="font-body text-xs text-white/50 text-center">{Tr.imgCaption}</p>
          </div>
        </div>

        {/* ANIMATION */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden p-4">
          <RestoranPPN />
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

        {/* KAPAN */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("kapan")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-green-400" />
              <span className="font-body font-semibold text-white">{Tr.kapanTitle}</span>
            </div>
            {expandedSections.includes("kapan") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>
          {expandedSections.includes("kapan") && (
            <div className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-2">
                {Tr.kapanItems.map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${item.yes ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="font-body text-xs text-white/80">{item.label}</p>
                      <p className={`font-body text-[10px] font-bold ${item.yes ? "text-green-400" : "text-red-400"}`}>
                        {item.yes ? Tr.kapanYes : Tr.kapanNo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KALKULATOR */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
          <button onClick={() => toggleSection("kalkulator")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-purple-400" />
              <span className="font-body font-semibold text-white">{Tr.kalcTitle}</span>
            </div>
            {expandedSections.includes("kalkulator") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
          </button>
          {true && (
            <div className="px-5 pb-5 space-y-4">
              <div className="flex gap-2">
                {(["tambah", "cari"] as const).map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setKalcResult(null); playPopSound(); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-body font-bold transition-all ${mode === m ? "bg-primary text-primary-foreground" : "bg-slate-800 text-white/60 hover:bg-slate-700"}`}
                  >
                    {idx === 0 ? Tr.kalcMode1 : Tr.kalcMode2}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-body text-xs text-amber-300/80 font-semibold">
                    {mode === "tambah" ? Tr.kalcLabelMode1 : Tr.kalcLabelMode2}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{curr}</span>
                    <input
                      type="number"
                      value={harga}
                      onChange={(e) => { setHarga(e.target.value); setKalcResult(null); }}
                      placeholder={mode === "tambah" ? Tr.kalcPh1 : Tr.kalcPh2}
                      className="w-full pl-10 pr-3 py-2.5 text-sm text-white font-body focus:outline-none rounded-lg"
                      style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)" }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-body text-xs text-amber-300/80 font-semibold flex items-center gap-1">
                    <Percent className="w-3 h-3" /> {Tr.kalcPreset}
                  </label>
                  <div className="flex gap-2">
                    {["10", "11", "12"].map((p) => (
                      <button key={p} onClick={() => { setPersen(p); setKalcResult(null); playPopSound(); }}
                        className="flex-1 py-2 rounded-lg text-xs font-body font-bold transition-all"
                        style={persen === p
                          ? { background: "rgba(251,191,36,0.25)", border: "1.5px solid rgba(251,191,36,0.8)", color: "#fbbf24" }
                          : { background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(251,191,36,0.4)" }}>
                        {p}%
                      </button>
                    ))}
                    <input type="number" value={!["10","11","12"].includes(persen) ? persen : ""}
                      onChange={(e) => { setPersen(e.target.value); setKalcResult(null); }}
                      placeholder="..."
                      className="flex-1 rounded-lg px-2 py-2.5 text-xs text-white font-body focus:outline-none text-center"
                      style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={hitungPPN}
                    className="flex-1 font-body font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(90deg, #d97706, #f59e0b)", color: "#1c1501" }}>
                    <Zap className="w-4 h-4" /> {Tr.kalcBtnHitung}
                  </button>
                  <button onClick={() => { setHarga(""); setKalcResult(null); playPopSound(); }}
                    className="px-4 rounded-lg font-body text-sm py-3 hover:opacity-80"
                    style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(251,191,36,0.5)" }}>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {kalcResult && (
                  <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(251,191,36,0.07)", border: "1.5px solid rgba(251,191,36,0.35)" }}>
                    <p className="font-body text-xs font-bold text-amber-300">✅ {lang === "id" ? "Hasil Perhitungan" : lang === "ja" ? "計算結果" : "Calculation Result"}:</p>
                    <div className="space-y-2">
                      {[
                        { label: Tr.kalcResHarga, val: formatRupiah(kalcResult.asli), color: "text-white" },
                        { label: Tr.kalcResPPN + ` (${persen}%)`, val: formatRupiah(kalcResult.ppn), color: "text-amber-300" },
                        { label: Tr.kalcResTotal, val: formatRupiah(kalcResult.total), color: "text-green-300", big: true },
                      ].map(({ label, val, color, big }) => (
                        <div key={label} className="rounded-lg px-4 py-3 flex justify-between items-center" style={{ background: "var(--bg-secondary)" }}>
                          <span className="font-body text-xs text-amber-200/60">{label}</span>
                          <span className={`font-body font-bold ${big ? "text-base" : "text-sm"} ${color}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px dashed rgba(251,191,36,0.2)" }}>
                      <p className="font-body text-xs text-amber-300/60 text-center">
                        {mode === "tambah"
                          ? Tr.kalcDynTambah(formatRupiah(kalcResult.asli), persen, formatRupiah(kalcResult.ppn), formatRupiah(kalcResult.total))
                          : Tr.kalcDynCari(formatRupiah(kalcResult.total), persen, formatRupiah(kalcResult.asli))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
                    <div className={`${dc.bg.replace("20","5")} border ${dc.border.replace("border-","border-")}/20 rounded-lg p-4 space-y-2`}
                      style={{ background: `var(--bg-card)`, borderLeft: `3px solid` }}>
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
                      {c.step1 && (
                        <>
                          <p className="font-body text-xs text-white/70"><strong>{c.step1}</strong></p>
                          <div className="bg-slate-900/60 rounded-lg p-3">
                            <BlockMath math={c.math1} />
                          </div>
                          <p className="font-body text-xs text-white/70"><strong>{c.step2}</strong></p>
                          <div className="bg-slate-900/60 rounded-lg p-3">
                            <BlockMath math={c.math2} />
                          </div>
                        </>
                      )}
                      {c.note && (
                        <p className="text-xs text-white/50 bg-slate-800/40 rounded px-3 py-2">
                          {c.noteKatex ? <><span>{c.note.split(":")[0]}: </span><InlineMath math={c.noteKatex} /></> : c.note}
                        </p>
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
                <p className="font-body text-xs font-semibold text-white/60 mb-3 text-center">📐 {lang === "id" ? "Kartu Rumus Singkat" : lang === "ja" ? "公式カード" : "Formula Cards"}</p>
                <div className="grid grid-cols-2 gap-2">
                  {Tr.rumusCards.map((r) => (
                    <div key={r.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                      <p className="font-body text-[10px] text-white/40 mb-1">{r.label}</p>
                      <BlockMath math={r.math} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="font-body text-xs text-green-200 leading-relaxed">{Tr.realWorldNote}</p>
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

export default PPNPage;
