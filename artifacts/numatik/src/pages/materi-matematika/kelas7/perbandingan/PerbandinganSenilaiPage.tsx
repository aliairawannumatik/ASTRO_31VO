import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface SenilaiAnimasiProps {
  animLabel: string;
  fuelLabel: string;
  distLabel: string;
  dragLabel: string;
  sameDirLabel: string;
  constRatioLabel: string;
  unitFuel: string;
}

const SenilaiAnimasi = ({ animLabel, fuelLabel, distLabel, dragLabel, sameDirLabel, constRatioLabel, unitFuel }: SenilaiAnimasiProps) => {
  const [v1, setV1] = useState(4);
  const v2 = v1 * 5;
  const maxV2 = 50;
  const pct1 = (v1 / 10) * 100;
  const pct2 = (v2 / maxV2) * 100;

  return (
    <div className="mt-4 bg-black/30 border border-green-500/20 rounded-xl p-4 space-y-4">
      <p className="font-body text-xs font-bold text-green-300 text-center tracking-wide uppercase">
        🎮 {animLabel}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">{fuelLabel}</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-green-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-green-600 to-green-400 transition-all duration-500 ease-in-out"
              style={{ height: `${pct1}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-green-300 tabular-nums">{v1} {unitFuel}</span>
          <TrendingUp className="w-4 h-4 text-green-400" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">{distLabel}</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-green-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-emerald-600 to-emerald-300 transition-all duration-500 ease-in-out"
              style={{ height: `${pct2}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-emerald-300 tabular-nums">{v2} km</span>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      <div className="flex items-center gap-1 justify-center">
        <span className="font-body text-[10px] text-green-400 font-bold">↑↑</span>
        <span className="font-body text-[10px] text-white/50">{sameDirLabel}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between font-body text-[10px] text-white/40">
          <span>1 {unitFuel}</span>
          <span>{dragLabel}</span>
          <span>10 {unitFuel}</span>
        </div>
        <input
          type="range" min={1} max={10} value={v1}
          onChange={(e) => { playPopSound(); setV1(Number(e.target.value)); }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-400"
        />
      </div>

      <div className="bg-green-500/10 rounded-lg p-2 text-center">
        <span className="font-body text-xs text-white/60">{constRatioLabel} </span>
        <span className="font-body text-xs font-bold text-green-300">
          {v1} : {v2} = 1 : 5 ✓
        </span>
      </div>
    </div>
  );
};

interface BerbalikAnimasiProps {
  animLabel: string;
  workerLabel: string;
  daysLabel: string;
  dragLabel: string;
  oppDirLabel: string;
  constProdLabel: string;
  unitWorker: string;
  unitDays: string;
}

const BerbalikAnimasi = ({ animLabel, workerLabel, daysLabel, dragLabel, oppDirLabel, constProdLabel, unitWorker, unitDays }: BerbalikAnimasiProps) => {
  const [v1, setV1] = useState(4);
  const produk = 60;
  const v2 = Math.round(produk / v1);
  const pct1 = (v1 / 10) * 100;
  const pct2 = (v2 / produk) * 100;

  return (
    <div className="mt-4 bg-black/30 border border-red-500/20 rounded-xl p-4 space-y-4">
      <p className="font-body text-xs font-bold text-red-300 text-center tracking-wide uppercase">
        🎮 {animLabel}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">{workerLabel}</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-red-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-red-600 to-red-400 transition-all duration-500 ease-in-out"
              style={{ height: `${pct1}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-red-300 tabular-nums">{v1}{unitWorker}</span>
          <TrendingUp className="w-4 h-4 text-red-400" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">{daysLabel}</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-orange-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-orange-600 to-yellow-400 transition-all duration-500 ease-in-out"
              style={{ height: `${pct2}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-orange-300 tabular-nums">{v2}{unitDays}</span>
          <TrendingDown className="w-4 h-4 text-orange-400" />
        </div>
      </div>

      <div className="flex items-center gap-1 justify-center">
        <span className="font-body text-[10px] text-red-400 font-bold">↑↓</span>
        <span className="font-body text-[10px] text-white/50">{oppDirLabel}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between font-body text-[10px] text-white/40">
          <span>1{unitWorker}</span>
          <span>{dragLabel}</span>
          <span>10{unitWorker}</span>
        </div>
        <input
          type="range" min={1} max={10} value={v1}
          onChange={(e) => { playPopSound(); setV1(Number(e.target.value)); }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-400"
        />
      </div>

      <div className="bg-red-500/10 rounded-lg p-2 text-center">
        <span className="font-body text-xs text-white/60">{constProdLabel} </span>
        <span className="font-body text-xs font-bold text-red-300">
          {v1} × {v2} ≈ {produk} ✓
        </span>
      </div>
    </div>
  );
};

const translations = {
  id: {
    title: "PERBANDINGAN SENILAI & BERBALIK NILAI",
    subtitle: "Kelas 7 · Perbandingan · Materi Matematika",
    back: "← Kembali ke Perbandingan",
    introTitle: "Kunci: Bagaimana Dua Besaran Bergerak Bersama?",
    introBody: "Bayangkan dua skenario berbeda. Pertama, semakin banyak bensin yang kamu isi, semakin jauh kamu bisa berkendara — keduanya naik bersama. Kedua, semakin banyak pekerja yang menggarap suatu proyek, semakin cepat proyek itu selesai — satu naik, yang lain turun.",
    senilaiCardTitle: "↑↑ Senilai (Searah)",
    senilaiDef: "adalah hubungan antara dua variabel di mana jika variabel pertama bertambah, variabel kedua juga akan ikut bertambah dan jika variabel pertama berkurang, variabel kedua juga ikut berkurang secara proporsional.",
    senilaiDefH: "Perbandingan senilai",
    senilaiExample: "Contoh: Bensin ↑ → Jarak tempuh ↑",
    berbalikCardTitle: "↑↓ Berbalik Nilai (Berlawanan)",
    berbalikDef: "adalah hubungan antara dua variabel di mana jika variabel pertama bertambah, variabel kedua justru berkurang, dan sebaliknya — hasil kali keduanya selalu tetap (konstan).",
    berbalikDefH: "Perbandingan berbalik nilai",
    berbalikExample: "Contoh: Pekerja ↑ → Waktu selesai ↓",
    imgSource: "Sumber gambar",
    senilaiAnimLabel: "Animasi Interaktif — Perbandingan Senilai",
    senilaiAnimFuel: "⛽ Bensin (liter)",
    senilaiAnimDist: "🚗 Jarak (km)",
    senilaiAnimDrag: "Geser untuk mengubah bensin",
    senilaiAnimSameDir: "keduanya bergerak searah",
    senilaiAnimConstRatio: "Rasio tetap:",
    senilaiAnimUnitFuel: "L",
    berbalikAnimLabel: "Animasi Interaktif — Perbandingan Berbalik Nilai",
    berbalikAnimWorker: "👷 Pekerja",
    berbalikAnimDays: "📅 Hari selesai",
    berbalikAnimDrag: "Geser untuk mengubah pekerja",
    berbalikAnimOppDir: "keduanya bergerak berlawanan arah",
    berbalikAnimConstProd: "Hasil kali tetap:",
    berbalikAnimUnitWorker: " org",
    berbalikAnimUnitDays: " hari",
    senilaiSectionTitle: "Ringkasan Intisari: Perbandingan Senilai",
    senilaiSectionBody: "Pada perbandingan senilai, rasio antara dua besaran selalu konstan (tetap). Sehingga ketika salah satu berubah, yang lain berubah secara proporsional.",
    senilaiFormTitle: "Rumus Perbandingan Senilai:",
    crossMult: "Kali silang (cross multiplication):",
    senilaiNote: "Di mana",
    senilaiNote2: "dan",
    senilaiNote3: "adalah dua besaran yang bergerak searah (senilai).",
    tblA_up: "Besaran A (naik ↑)",
    tblB_up: "Besaran B (naik ↑)",
    tblRow1a: "Jumlah barang dibeli",
    tblRow1b: "Total harga",
    tblRow2a: "Lama bekerja (jam)",
    tblRow2b: "Jumlah produk yang dibuat",
    tblRow3a: "Jumlah bahan bakar",
    tblRow3b: "Jarak yang ditempuh",
    berbalikSectionTitle: "Ringkasan Intisari: Perbandingan Berbalik Nilai",
    berbalikSectionBody: "Pada perbandingan berbalik nilai, hasil kali kedua besaran selalu konstan. Artinya, saat satu naik dua kali lipat, yang lain turun menjadi setengahnya.",
    berbalikFormTitle: "Rumus Perbandingan Berbalik Nilai:",
    paraMult: "Kali sejajar (tiap baris dikalikan sejajar):",
    paraLabel: "sejajar",
    berbalikNote: "Besaran A dikalikan sejajar, Besaran B dikalikan sejajar — hasilnya selalu sama (konstan).",
    tblA_up2: "Besaran A (naik ↑)",
    tblB_down: "Besaran B (turun ↓)",
    tblRow4a: "Jumlah pekerja",
    tblRow4b: "Waktu penyelesaian proyek",
    tblRow5a: "Kecepatan kendaraan",
    tblRow5b: "Waktu tempuh perjalanan",
    tblRow6a: "Jumlah hewan ternak",
    tblRow6b: "Durasi persediaan pakan",
    kasusTitle: "Kasus Khusus: Proyek yang Terhenti",
    kasusBody: "Soal tingkat lanjut sering menggabungkan berbalik nilai dengan konsep sisa pekerjaan. Strategi penyelesaiannya adalah menghitung \"satuan kerja\" total lalu menggunakan sisanya.",
    kasusStepsLabel: "Langkah Strategis:",
    kasusS1: "Hitung total beban kerja = jumlah pekerja awal × total hari rencana",
    kasusS2: "Hitung pekerjaan yang sudah selesai = pekerja awal × hari yang sudah berjalan",
    kasusS3: "Cari sisa beban kerja = total − yang sudah selesai",
    kasusS4: "Hitung sisa waktu tersedia = total hari − hari sudah berjalan − hari libur",
    kasusS5: "Pekerja yang dibutuhkan = sisa beban ÷ sisa waktu",
    kasusS1h: "① Hitung total beban kerja",
    kasusS2h: "② Hitung pekerjaan yang sudah selesai",
    kasusS3h: "③ Cari sisa beban kerja",
    kasusS4h: "④ Hitung sisa waktu tersedia",
    kasusS5h: "⑤ Pekerja yang dibutuhkan",
    kasusExTitle: "Contoh singkat:",
    kasusExQ: "Proyek 20 hari oleh 15 pekerja. Setelah 8 hari, libur 4 hari. Berapa tambahan pekerja?",
    contohTitle: "Contoh Soal dan Pembahasan",
    badgeMudah: "MUDAH",
    badgeSedang: "SEDANG",
    badgeSulit: "SULIT",
    pembahasan: "PEMBAHASAN:",
    analisis: "Analisis:",
    perhatikan: "Perhatikan:",
    langkah: "Langkah",
    c1Title: "Contoh 1 – Senilai: Harga Buah",
    c1Q: "Harga 5 buah mangga adalah Rp20.000. Berapakah harga 8 buah mangga?",
    c1Analysis: "Makin banyak mangga → harga makin mahal → senilai → gunakan kali silang.",
    c1AnalysisH: "senilai",
    c1Method: "gunakan kali silang",
    c1V1: "buah",
    c1V2hdr: "",
    c1R1c1: "5 buah",
    c1R1c2: "Rp20.000",
    c1R2c1: "8 buah",
    c1CrossLabel: "Kali silang:",
    c1Math1: "5 \\times x = 8 \\times 20.000",
    c1Math2: "5x = 160.000 \\Rightarrow x = 32.000",
    c1Result: "✅ Harga 8 buah mangga = Rp32.000",
    c2Title: "Contoh 2 – Berbalik Nilai: Pakan Ternak",
    c2Q: "Persediaan pakan cukup untuk 20 ekor sapi selama 18 hari. Jika peternak membeli 10 ekor sapi lagi, berapa hari persediaan pakan akan habis?",
    c2Analysis: "Sapi bertambah → hari berkurang → berbalik nilai → gunakan kali sejajar.",
    c2AnalysisH: "berbalik nilai",
    c2Method: "gunakan kali sejajar",
    c2Note: "Total sapi =",
    c2NoteVal: "20 + 10 = 30",
    c2NoteUnit: "ekor.",
    c2R1c1: "20 sapi",
    c2R1c2: "18 hari",
    c2R2c1: "30 sapi",
    c2ParaLabel: "Kali sejajar:",
    c2Math1: "20 \\times 18 = 30 \\times x",
    c2Math2: "360 = 30x \\Rightarrow x = 12 \\text{ hari}",
    c2Result: "✅ Persediaan pakan habis dalam 12 hari.",
    c3Title: "Contoh 3 – Berbalik Nilai: Proyek Terhenti",
    c3Q: "Sebuah jembatan direncanakan selesai dalam 30 hari oleh 20 pekerja. Setelah 12 hari berjalan, proyek libur selama 3 hari karena cuaca buruk. Agar proyek selesai tepat waktu, berapa tambahan pekerja yang harus direkrut?",
    c3Analysis: "Pekerja ↑ → waktu ↓ → berbalik nilai. Soal ini ada proyek terhenti, jadi hitung sisa dulu.",
    c3AnalysisH: "berbalik nilai",
    c3S1: "Total beban kerja:",
    c3S2: "Selesai:",
    c3S2b: "satuan → Sisa:",
    c3S3: "Sisa waktu:",
    c3Method3: "→ Sekarang terapkan kali sejajar (berbalik nilai): 20 pekerja butuh 18 hari, berapa pekerja untuk 15 hari?",
    c3R1c1: "20 pekerja",
    c3R1c2: "18 hari",
    c3R2c1: "x pekerja",
    c3R2c2: "15 hari",
    c3Math1: "20 \\times 18 = x \\times 15",
    c3Math2: "360 = 15x \\Rightarrow x = 24 \\text{ orang}",
    c3Result: "✅ Tambahan pekerja =",
    c3ResultMath: "24 - 20 = 4",
    c3ResultUnit: "orang",
  },
  en: {
    title: "DIRECT & INVERSE PROPORTION",
    subtitle: "Grade 7 · Ratio · Mathematics",
    back: "← Back to Ratio",
    introTitle: "Key: How Do Two Quantities Move Together?",
    introBody: "Imagine two different scenarios. First, the more fuel you fill, the further you can drive — both rise together. Second, the more workers on a project, the faster it finishes — one rises, the other falls.",
    senilaiCardTitle: "↑↑ Direct Proportion",
    senilaiDef: "is a relationship between two variables where if the first variable increases, the second also increases, and if the first decreases, the second also decreases proportionally.",
    senilaiDefH: "Direct proportion",
    senilaiExample: "Example: Fuel ↑ → Distance ↑",
    berbalikCardTitle: "↑↓ Inverse Proportion",
    berbalikDef: "is a relationship between two variables where if the first variable increases, the second decreases, and vice versa — their product is always constant.",
    berbalikDefH: "Inverse proportion",
    berbalikExample: "Example: Workers ↑ → Completion time ↓",
    imgSource: "Image source",
    senilaiAnimLabel: "Interactive Animation — Direct Proportion",
    senilaiAnimFuel: "⛽ Fuel (litres)",
    senilaiAnimDist: "🚗 Distance (km)",
    senilaiAnimDrag: "Drag to change fuel",
    senilaiAnimSameDir: "both move in the same direction",
    senilaiAnimConstRatio: "Constant ratio:",
    senilaiAnimUnitFuel: "L",
    berbalikAnimLabel: "Interactive Animation — Inverse Proportion",
    berbalikAnimWorker: "👷 Workers",
    berbalikAnimDays: "📅 Days to complete",
    berbalikAnimDrag: "Drag to change workers",
    berbalikAnimOppDir: "they move in opposite directions",
    berbalikAnimConstProd: "Constant product:",
    berbalikAnimUnitWorker: "",
    berbalikAnimUnitDays: " d",
    senilaiSectionTitle: "Summary: Direct Proportion",
    senilaiSectionBody: "In direct proportion, the ratio between the two quantities is always constant. So when one changes, the other changes proportionally.",
    senilaiFormTitle: "Direct Proportion Formula:",
    crossMult: "Cross-multiply:",
    senilaiNote: "Where",
    senilaiNote2: "and",
    senilaiNote3: "are two quantities that move in the same direction (direct proportion).",
    tblA_up: "Quantity A (increases ↑)",
    tblB_up: "Quantity B (increases ↑)",
    tblRow1a: "Number of items purchased",
    tblRow1b: "Total price",
    tblRow2a: "Working hours",
    tblRow2b: "Number of products made",
    tblRow3a: "Amount of fuel",
    tblRow3b: "Distance travelled",
    berbalikSectionTitle: "Summary: Inverse Proportion",
    berbalikSectionBody: "In inverse proportion, the product of the two quantities is always constant. So when one doubles, the other halves.",
    berbalikFormTitle: "Inverse Proportion Formula:",
    paraMult: "Parallel multiply:",
    paraLabel: "parallel",
    berbalikNote: "Quantity A is multiplied in parallel, Quantity B is multiplied in parallel — the result is always equal (constant).",
    tblA_up2: "Quantity A (increases ↑)",
    tblB_down: "Quantity B (decreases ↓)",
    tblRow4a: "Number of workers",
    tblRow4b: "Project completion time",
    tblRow5a: "Vehicle speed",
    tblRow5b: "Travel time",
    tblRow6a: "Number of livestock",
    tblRow6b: "Duration of feed supply",
    kasusTitle: "Special Case: Paused Projects",
    kasusBody: "Advanced problems often combine inverse proportion with the concept of remaining work. The strategy is to calculate the total \"work units\", then use the remaining amount.",
    kasusStepsLabel: "Strategic Steps:",
    kasusS1: "Calculate total workload = initial workers × total planned days",
    kasusS2: "Calculate work completed = initial workers × days elapsed",
    kasusS3: "Find remaining workload = total − completed",
    kasusS4: "Calculate remaining time = total days − elapsed days − break days",
    kasusS5: "Workers needed = remaining workload ÷ remaining time",
    kasusS1h: "① Total workload",
    kasusS2h: "② Work completed",
    kasusS3h: "③ Remaining workload",
    kasusS4h: "④ Remaining time available",
    kasusS5h: "⑤ Workers needed",
    kasusExTitle: "Quick example:",
    kasusExQ: "20-day project by 15 workers. After 8 days, 4-day break. How many extra workers needed?",
    contohTitle: "Examples and Solutions",
    badgeMudah: "EASY",
    badgeSedang: "MEDIUM",
    badgeSulit: "HARD",
    pembahasan: "SOLUTION:",
    analisis: "Analysis:",
    perhatikan: "Note:",
    langkah: "Step",
    c1Title: "Example 1 – Direct Proportion: Fruit Price",
    c1Q: "The price of 5 mangoes is $20. What is the price of 8 mangoes?",
    c1Analysis: "More mangoes → higher price → direct proportion → use cross-multiplication.",
    c1AnalysisH: "direct proportion",
    c1Method: "use cross-multiplication",
    c1V1: "mangoes",
    c1V2hdr: "",
    c1R1c1: "5 mangoes",
    c1R1c2: "\\$20",
    c1R2c1: "8 mangoes",
    c1CrossLabel: "Cross-multiply:",
    c1Math1: "5 \\times x = 8 \\times 20",
    c1Math2: "5x = 160 \\Rightarrow x = 32",
    c1Result: "✅ Price of 8 mangoes = $32",
    c2Title: "Example 2 – Inverse Proportion: Livestock Feed",
    c2Q: "A feed supply is enough for 20 cattle for 18 days. If the farmer buys 10 more cattle, how many days will the feed supply last?",
    c2Analysis: "More cattle → fewer days → inverse proportion → use parallel multiplication.",
    c2AnalysisH: "inverse proportion",
    c2Method: "use parallel multiplication",
    c2Note: "Total cattle =",
    c2NoteVal: "20 + 10 = 30",
    c2NoteUnit: "cattle.",
    c2R1c1: "20 cattle",
    c2R1c2: "18 days",
    c2R2c1: "30 cattle",
    c2ParaLabel: "Parallel multiply:",
    c2Math1: "20 \\times 18 = 30 \\times x",
    c2Math2: "360 = 30x \\Rightarrow x = 12 \\text{ days}",
    c2Result: "✅ Feed supply lasts 12 days.",
    c3Title: "Example 3 – Inverse Proportion: Paused Project",
    c3Q: "A bridge is planned to be completed in 30 days by 20 workers. After 12 days, the project pauses for 3 days due to bad weather. To finish on time, how many extra workers must be recruited?",
    c3Analysis: "Workers ↑ → time ↓ → inverse proportion. This problem has a pause, so calculate the remainder first.",
    c3AnalysisH: "inverse proportion",
    c3S1: "Total workload:",
    c3S2: "Completed:",
    c3S2b: "units → Remaining:",
    c3S3: "Remaining time:",
    c3Method3: "→ Now apply parallel multiplication (inverse proportion): 20 workers need 18 days — how many workers for 15 days?",
    c3R1c1: "20 workers",
    c3R1c2: "18 days",
    c3R2c1: "x workers",
    c3R2c2: "15 days",
    c3Math1: "20 \\times 18 = x \\times 15",
    c3Math2: "360 = 15x \\Rightarrow x = 24 \\text{ workers}",
    c3Result: "✅ Extra workers needed =",
    c3ResultMath: "24 - 20 = 4",
    c3ResultUnit: "workers",
  },
  ja: {
    title: "正比例と反比例",
    subtitle: "中学1年 · 比 · 数学",
    back: "← 比に戻る",
    introTitle: "鍵：2つの量はどのように動くか？",
    introBody: "2つの異なるシナリオを想像してください。1つ目：入れる燃料が多いほど、遠くまで走れる — 両方が一緒に上がります。2つ目：プロジェクトに携わる作業員が多いほど、完成が早まる — 一方が上がれば、もう一方が下がります。",
    senilaiCardTitle: "↑↑ 正比例",
    senilaiDef: "は2つの変数の関係で、最初の変数が増えると2番目の変数も比例して増え、最初が減ると2番目も減る関係です。",
    senilaiDefH: "正比例",
    senilaiExample: "例：燃料↑ → 走行距離↑",
    berbalikCardTitle: "↑↓ 反比例",
    berbalikDef: "は2つの変数の関係で、最初の変数が増えると2番目の変数は減り、その逆も然り — 両者の積は常に一定（定数）です。",
    berbalikDefH: "反比例",
    berbalikExample: "例：作業員↑ → 完成までの時間↓",
    imgSource: "画像出典",
    senilaiAnimLabel: "インタラクティブアニメーション — 正比例",
    senilaiAnimFuel: "⛽ 燃料（L）",
    senilaiAnimDist: "🚗 距離（km）",
    senilaiAnimDrag: "ドラッグして燃料を変える",
    senilaiAnimSameDir: "両方が同じ方向に動く",
    senilaiAnimConstRatio: "一定の比：",
    senilaiAnimUnitFuel: "L",
    berbalikAnimLabel: "インタラクティブアニメーション — 反比例",
    berbalikAnimWorker: "👷 作業員",
    berbalikAnimDays: "📅 完成までの日数",
    berbalikAnimDrag: "ドラッグして作業員数を変える",
    berbalikAnimOppDir: "両方が逆方向に動く",
    berbalikAnimConstProd: "一定の積：",
    berbalikAnimUnitWorker: "人",
    berbalikAnimUnitDays: "日",
    senilaiSectionTitle: "まとめ：正比例",
    senilaiSectionBody: "正比例では、2つの量の比は常に一定です。一方が変化すると、もう一方も比例して変化します。",
    senilaiFormTitle: "正比例の公式：",
    crossMult: "交差乗算：",
    senilaiNote: "ここで",
    senilaiNote2: "と",
    senilaiNote3: "は同じ方向に動く2つの量（正比例）です。",
    tblA_up: "量A（増加↑）",
    tblB_up: "量B（増加↑）",
    tblRow1a: "購入品数",
    tblRow1b: "合計金額",
    tblRow2a: "作業時間",
    tblRow2b: "生産数",
    tblRow3a: "燃料量",
    tblRow3b: "移動距離",
    berbalikSectionTitle: "まとめ：反比例",
    berbalikSectionBody: "反比例では、2つの量の積は常に一定です。一方が2倍になると、もう一方は半分になります。",
    berbalikFormTitle: "反比例の公式：",
    paraMult: "並行乗算：",
    paraLabel: "並行",
    berbalikNote: "量Aを並行に掛け、量Bを並行に掛けると — 結果は常に等しい（一定）になります。",
    tblA_up2: "量A（増加↑）",
    tblB_down: "量B（減少↓）",
    tblRow4a: "作業員数",
    tblRow4b: "プロジェクト完成時間",
    tblRow5a: "車両の速度",
    tblRow5b: "移動時間",
    tblRow6a: "家畜の数",
    tblRow6b: "飼料の持続時間",
    kasusTitle: "特別なケース：中断されたプロジェクト",
    kasusBody: "発展問題では、反比例と「残り作業」の概念を組み合わせることが多いです。戦略は、合計「作業単位」を計算し、残りを使います。",
    kasusStepsLabel: "解法の手順：",
    kasusS1: "合計作業量を計算 = 初期作業員数 × 計画総日数",
    kasusS2: "完了した作業量を計算 = 初期作業員数 × 経過日数",
    kasusS3: "残り作業量を求める = 合計 − 完了分",
    kasusS4: "残り利用可能時間を計算 = 総日数 − 経過日数 − 休憩日数",
    kasusS5: "必要な作業員数 = 残り作業量 ÷ 残り時間",
    kasusS1h: "① 合計作業量",
    kasusS2h: "② 完了した作業量",
    kasusS3h: "③ 残り作業量",
    kasusS4h: "④ 残り利用可能時間",
    kasusS5h: "⑤ 必要な作業員数",
    kasusExTitle: "簡単な例：",
    kasusExQ: "15人の作業員による20日間のプロジェクト。8日後、4日間の休憩。追加の作業員は何人必要？",
    contohTitle: "例題と解説",
    badgeMudah: "基本",
    badgeSedang: "標準",
    badgeSulit: "発展",
    pembahasan: "解説：",
    analisis: "分析：",
    perhatikan: "注意：",
    langkah: "ステップ",
    c1Title: "例題1 – 正比例：果物の値段",
    c1Q: "マンゴー5個の値段は$20です。マンゴー8個の値段はいくらですか？",
    c1Analysis: "マンゴーが多い → 値段が高い → 正比例 → 交差乗算を使う。",
    c1AnalysisH: "正比例",
    c1Method: "交差乗算を使う",
    c1V1: "個",
    c1V2hdr: "",
    c1R1c1: "マンゴー5個",
    c1R1c2: "\\$20",
    c1R2c1: "マンゴー8個",
    c1CrossLabel: "交差乗算：",
    c1Math1: "5 \\times x = 8 \\times 20",
    c1Math2: "5x = 160 \\Rightarrow x = 32",
    c1Result: "✅ マンゴー8個の値段 = $32",
    c2Title: "例題2 – 反比例：家畜の飼料",
    c2Q: "飼料は牛20頭に18日間分あります。農家がさらに牛を10頭買ったら、飼料は何日でなくなりますか？",
    c2Analysis: "牛が増える → 日数が減る → 反比例 → 並行乗算を使う。",
    c2AnalysisH: "反比例",
    c2Method: "並行乗算を使う",
    c2Note: "牛の合計 =",
    c2NoteVal: "20 + 10 = 30",
    c2NoteUnit: "頭。",
    c2R1c1: "牛 20頭",
    c2R1c2: "18日",
    c2R2c1: "牛 30頭",
    c2ParaLabel: "並行乗算：",
    c2Math1: "20 \\times 18 = 30 \\times x",
    c2Math2: "360 = 30x \\Rightarrow x = 12 \\text{ 日}",
    c2Result: "✅ 飼料は12日でなくなります。",
    c3Title: "例題3 – 反比例：中断されたプロジェクト",
    c3Q: "ある橋は20人の作業員で30日で完成する予定でした。12日経過後、悪天候のため3日間プロジェクトが中断されました。期限通りに完成させるために、追加の作業員は何人必要ですか？",
    c3Analysis: "作業員↑ → 時間↓ → 反比例。中断があるので、残りを先に計算します。",
    c3AnalysisH: "反比例",
    c3S1: "合計作業量：",
    c3S2: "完了分：",
    c3S2b: "単位 → 残り：",
    c3S3: "残り時間：",
    c3Method3: "→ 次に並行乗算（反比例）を適用：20人の作業員で18日必要 — 15日なら何人必要？",
    c3R1c1: "20人の作業員",
    c3R1c2: "18日",
    c3R2c1: "x人の作業員",
    c3R2c2: "15日",
    c3Math1: "20 \\times 18 = x \\times 15",
    c3Math2: "360 = 15x \\Rightarrow x = 24 \\text{ 人}",
    c3Result: "✅ 追加作業員数 =",
    c3ResultMath: "24 - 20 = 4",
    c3ResultUnit: "人",
  },
};

const PerbandinganSenilaiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "senilai", "berbalik", "kasus", "contoh"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.subtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* SECTION: PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* SENILAI CARD */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-bold text-green-300 mb-2">{t.senilaiCardTitle}</p>
                    <div className="bg-green-500/10 border border-green-400/30 rounded-lg px-3 py-2 mb-3">
                      <p className="font-body text-xs font-semibold text-green-200 leading-relaxed">
                        <span className="text-green-400 font-bold">{t.senilaiDefH}</span> {t.senilaiDef}
                      </p>
                    </div>
                    <p className="font-body text-xs text-green-200 mb-3">{t.senilaiExample}</p>
                    <div className="rounded-lg overflow-hidden border border-green-500/20">
                      <img
                        src={"/images/image_1775451452551.png"}
                        alt="Fuel and distance illustration"
                        className="w-full h-auto object-contain"
                      />
                      <div className="px-2 py-1 bg-black/30">
                        <a
                          href="https://imgx.gridoto.com/crop/0x0:0x0/700x0/filters:watermark(file/2017/gridoto/img/watermark.png,5,5,60)/photo/gridoto/2017/10/20/292677212.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-xs text-primary/60 hover:text-primary underline underline-offset-2 break-all"
                        >
                          {t.imgSource}
                        </a>
                      </div>
                    </div>
                    <SenilaiAnimasi
                      animLabel={t.senilaiAnimLabel}
                      fuelLabel={t.senilaiAnimFuel}
                      distLabel={t.senilaiAnimDist}
                      dragLabel={t.senilaiAnimDrag}
                      sameDirLabel={t.senilaiAnimSameDir}
                      constRatioLabel={t.senilaiAnimConstRatio}
                      unitFuel={t.senilaiAnimUnitFuel}
                    />
                  </div>

                  {/* BERBALIK NILAI CARD */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-bold text-red-300 mb-2">{t.berbalikCardTitle}</p>
                    <div className="bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2 mb-3">
                      <p className="font-body text-xs font-semibold text-red-200 leading-relaxed">
                        <span className="text-red-400 font-bold">{t.berbalikDefH}</span> {t.berbalikDef}
                      </p>
                    </div>
                    <p className="font-body text-xs text-red-200 mb-3">{t.berbalikExample}</p>
                    <div className="rounded-lg overflow-hidden border border-red-500/20">
                      <img
                        src={"/images/image_1775451578472.png"}
                        alt="Workers illustration"
                        className="w-full h-auto object-contain"
                      />
                      <div className="px-2 py-1 bg-black/30">
                        <a
                          href="https://www.emporioarchitect.com/img/blog/siap-membangun-rumah-ketahui-dulu-masalah-umum-dalam-proses-pembangunan-rumah-dan-solusi-mengatasinya-070222103548184287.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-xs text-primary/60 hover:text-primary underline underline-offset-2 break-all"
                        >
                          {t.imgSource}
                        </a>
                      </div>
                    </div>
                    <BerbalikAnimasi
                      animLabel={t.berbalikAnimLabel}
                      workerLabel={t.berbalikAnimWorker}
                      daysLabel={t.berbalikAnimDays}
                      dragLabel={t.berbalikAnimDrag}
                      oppDirLabel={t.berbalikAnimOppDir}
                      constProdLabel={t.berbalikAnimConstProd}
                      unitWorker={t.berbalikAnimUnitWorker}
                      unitDays={t.berbalikAnimUnitDays}
                    />
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* SECTION: SENILAI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("senilai")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.senilaiSectionTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.senilaiSectionBody}
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-green-300">{t.senilaiFormTitle}</p>

                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-sm border-collapse text-center">
                      <thead>
                        <tr className="bg-green-600/30">
                          <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold"><InlineMath math="V_1" /></th>
                          <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold"><InlineMath math="V_2" /></th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="bg-slate-800/40">
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="a_1" /></td>
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="b_1" /></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="a_2" /></td>
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="b_2" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-slate-900/60 rounded-lg p-5 flex flex-col items-center gap-4">
                    <p className="font-body text-xs text-white/50">{t.crossMult}</p>
                    <div className="relative w-full max-w-sm" style={{ height: 140 }}>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 140" preserveAspectRatio="none">
                        <line x1="75" y1="35" x2="225" y2="105" stroke="#facc15" strokeWidth="2.5" strokeDasharray="6 3" />
                        <line x1="225" y1="35" x2="75" y2="105" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="6 3" />
                        <circle cx="150" cy="70" r="5" fill="#ffffff" fillOpacity="0.15" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
                      </svg>
                      <div className="absolute flex flex-col items-center gap-1" style={{ left: '10%', top: 8 }}>
                        <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-green-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="a_1" /></span>
                        </div>
                        <span className="font-body text-[10px] text-green-300 font-semibold">V₁ · A</span>
                      </div>
                      <div className="absolute flex flex-col items-center gap-1" style={{ right: '10%', top: 8 }}>
                        <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-green-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="a_2" /></span>
                        </div>
                        <span className="font-body text-[10px] text-green-300 font-semibold">V₂ · A</span>
                      </div>
                      <div className="absolute flex flex-col items-center gap-1" style={{ left: '10%', bottom: 8 }}>
                        <span className="font-body text-[10px] text-blue-300 font-semibold">V₁ · B</span>
                        <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-blue-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="b_1" /></span>
                        </div>
                      </div>
                      <div className="absolute flex flex-col items-center gap-1" style={{ right: '10%', bottom: 8 }}>
                        <span className="font-body text-[10px] text-blue-300 font-semibold">V₂ · B</span>
                        <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-blue-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="b_2" /></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-[10px] font-body">
                      <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-dashed border-yellow-400"></span><span className="text-yellow-300">a₁ × b₂</span></span>
                      <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-dashed border-orange-400"></span><span className="text-orange-300">a₂ × b₁</span></span>
                    </div>
                    <div className="w-full border-t border-white/10 pt-3 text-center">
                      <BlockMath math="a_1 \times b_2 = a_2 \times b_1" />
                    </div>
                  </div>

                  <p className="font-body text-xs text-white/60">
                    {t.senilaiNote} <InlineMath math="a" /> {t.senilaiNote2} <InlineMath math="b" /> {t.senilaiNote3}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-green-500/20">
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/30">{t.tblA_up}</th>
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/30">{t.tblB_up}</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-green-500/20"><td className="px-3 py-2">{t.tblRow1a}</td><td className="px-3 py-2">{t.tblRow1b}</td></tr>
                      <tr className="border border-green-500/20 bg-slate-800/30"><td className="px-3 py-2">{t.tblRow2a}</td><td className="px-3 py-2">{t.tblRow2b}</td></tr>
                      <tr className="border border-green-500/20"><td className="px-3 py-2">{t.tblRow3a}</td><td className="px-3 py-2">{t.tblRow3b}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: BERBALIK NILAI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("berbalik")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">{t.berbalikSectionTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.berbalikSectionBody}</p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-red-300">{t.berbalikFormTitle}</p>

                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-sm border-collapse text-center">
                      <thead>
                        <tr className="bg-red-600/30">
                          <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_1" /></th>
                          <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_2" /></th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="bg-slate-800/40">
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="a_1" /></td>
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="b_1" /></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="a_2" /></td>
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="b_2" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-slate-900/60 rounded-lg p-4 flex flex-col items-center gap-3">
                    <p className="font-body text-xs text-white/50">{t.paraMult}</p>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-green-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="a_1" /></span>
                        </div>
                        <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                          <span className="absolute font-body text-[9px] text-yellow-300 -top-3">{t.paraLabel}</span>
                        </div>
                        <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-green-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="a_2" /></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-blue-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="b_1" /></span>
                        </div>
                        <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                          <span className="absolute font-body text-[9px] text-yellow-300 -top-3">{t.paraLabel}</span>
                        </div>
                        <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-blue-900/30">
                          <span className="font-body font-bold text-white text-base"><InlineMath math="b_2" /></span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full border-t border-white/10 pt-3 text-center">
                      <BlockMath math="a_1 \times a_2 = b_1 \times b_2" />
                    </div>
                  </div>

                  <p className="font-body text-xs text-white/60">{t.berbalikNote}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-red-500/20">
                        <th className="px-3 py-2 text-red-300 text-left border border-red-500/30">{t.tblA_up2}</th>
                        <th className="px-3 py-2 text-red-300 text-left border border-red-500/30">{t.tblB_down}</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-red-500/20"><td className="px-3 py-2">{t.tblRow4a}</td><td className="px-3 py-2">{t.tblRow4b}</td></tr>
                      <tr className="border border-red-500/20 bg-slate-800/30"><td className="px-3 py-2">{t.tblRow5a}</td><td className="px-3 py-2">{t.tblRow5b}</td></tr>
                      <tr className="border border-red-500/20"><td className="px-3 py-2">{t.tblRow6a}</td><td className="px-3 py-2">{t.tblRow6b}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: KASUS KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kasus")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{t.kasusTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.kasusBody}
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.kasusStepsLabel}</p>
                  <div className="font-body text-sm text-white/80 space-y-1">
                    <p><strong className="text-orange-300">{t.kasusS1h}:</strong> {t.kasusS1.replace(/^① .+?= /, "")}</p>
                    <p><strong className="text-orange-300">{t.kasusS2h}:</strong> {t.kasusS2.replace(/^② .+?= /, "")}</p>
                    <p><strong className="text-orange-300">{t.kasusS3h}:</strong> {t.kasusS3.replace(/^③ .+?= /, "")}</p>
                    <p><strong className="text-orange-300">{t.kasusS4h}:</strong> {t.kasusS4.replace(/^④ .+?= /, "")}</p>
                    <p><strong className="text-orange-300">{t.kasusS5h}:</strong> {t.kasusS5.replace(/^⑤ .+?= /, "")}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white/60 text-xs">{t.kasusExTitle} {t.kasusExQ}</p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>{language === "id" ? "Total beban" : language === "ja" ? "合計作業量" : "Total workload"} = <InlineMath math="20 \times 15 = 300" /> {language === "id" ? "satuan" : language === "ja" ? "単位" : "units"}</p>
                    <p>{language === "id" ? "Selesai" : language === "ja" ? "完了分" : "Completed"} = <InlineMath math="8 \times 15 = 120" /> {language === "id" ? "satuan → Sisa" : language === "ja" ? "単位 → 残り" : "units → Remaining"} = <InlineMath math="300 - 120 = 180" /></p>
                    <p>{language === "id" ? "Sisa waktu" : language === "ja" ? "残り時間" : "Remaining time"} = <InlineMath math="20 - 8 - 4 = 8" /> {language === "id" ? "hari" : language === "ja" ? "日" : "days"}</p>
                    <p>{language === "id" ? "Pekerja dibutuhkan" : language === "ja" ? "必要な作業員数" : "Workers needed"} = <InlineMath math="180 \div 8 = 22{,}5 \approx 23" /> {language === "id" ? "orang" : language === "ja" ? "人" : "workers"}</p>
                    <p className="text-orange-300 font-semibold">{language === "id" ? "Tambahan" : language === "ja" ? "追加" : "Extra"} = <InlineMath math="23 - 15 = 8" /> {language === "id" ? "orang" : language === "ja" ? "人" : "workers"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.contohTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMudah}</span>
                    <span className="font-body font-semibold text-white">{t.c1Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c1Q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-semibold text-green-400">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>{t.analisis}</strong>{" "}
                      {t.c1Analysis.split(t.c1AnalysisH)[0]}
                      <strong className="text-green-400">{t.c1AnalysisH}</strong>
                      {t.c1Analysis.split(t.c1AnalysisH)[1]}
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full font-body text-sm border-collapse text-center">
                        <thead>
                          <tr className="bg-green-600/30">
                            <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold"><InlineMath math="V_1" /></th>
                            <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold"><InlineMath math="V_2" /></th>
                          </tr>
                        </thead>
                        <tbody className="text-white/80">
                          <tr className="bg-slate-800/40">
                            <td className="px-4 py-2 border border-green-500/30 font-bold text-white">{t.c1R1c1}</td>
                            <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math={t.c1R1c2} /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border border-green-500/30 font-bold text-white">{t.c1R2c1}</td>
                            <td className="px-4 py-2 border border-green-500/30 font-bold text-yellow-300"><InlineMath math="x" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 flex flex-col items-center gap-3">
                      <p className="font-body text-xs text-white/50">{t.c1CrossLabel}</p>
                      <div className="relative w-full max-w-xs" style={{ height: 130 }}>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 130" preserveAspectRatio="none">
                          <line x1="70" y1="32" x2="210" y2="98" stroke="#facc15" strokeWidth="2.5" strokeDasharray="6 3" />
                          <line x1="210" y1="32" x2="70" y2="98" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="6 3" />
                          <circle cx="140" cy="65" r="5" fill="#ffffff" fillOpacity="0.12" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
                        </svg>
                        <div className="absolute flex flex-col items-center gap-1" style={{ left: '5%', top: 6 }}>
                          <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-4 py-2 shadow-lg shadow-green-900/30">
                            <span className="font-body font-bold text-white text-sm">5</span>
                          </div>
                          <span className="font-body text-[9px] text-green-300">V₁·A</span>
                        </div>
                        <div className="absolute flex flex-col items-center gap-1" style={{ right: '5%', top: 6 }}>
                          <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-2 py-2 shadow-lg shadow-green-900/30">
                            <span className="font-body font-bold text-white text-sm">{language === "id" ? "20.000" : "20"}</span>
                          </div>
                          <span className="font-body text-[9px] text-green-300">V₂·A</span>
                        </div>
                        <div className="absolute flex flex-col items-center gap-1" style={{ left: '5%', bottom: 6 }}>
                          <span className="font-body text-[9px] text-blue-300">V₁·B</span>
                          <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-4 py-2 shadow-lg shadow-blue-900/30">
                            <span className="font-body font-bold text-white text-sm">8</span>
                          </div>
                        </div>
                        <div className="absolute flex flex-col items-center gap-1" style={{ right: '5%', bottom: 6 }}>
                          <span className="font-body text-[9px] text-blue-300">V₂·B</span>
                          <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-4 py-2 shadow-lg shadow-blue-900/30">
                            <span className="font-body font-bold text-yellow-300 text-sm">x</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full border-t border-white/10 pt-2 space-y-1 text-center">
                        <BlockMath math={t.c1Math1} />
                        <BlockMath math={t.c1Math2} />
                      </div>
                    </div>
                    <p className="font-body text-sm text-primary font-semibold text-center">{t.c1Result}</p>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSedang}</span>
                    <span className="font-body font-semibold text-white">{t.c2Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c2Q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-semibold text-yellow-400">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>{t.analisis}</strong>{" "}
                      {t.c2Analysis.split(t.c2AnalysisH)[0]}
                      <strong className="text-yellow-400">{t.c2AnalysisH}</strong>
                      {t.c2Analysis.split(t.c2AnalysisH)[1]}
                    </p>
                    <p className="font-body text-sm text-white/80">
                      <strong>{t.perhatikan}</strong> {t.c2Note} <InlineMath math={t.c2NoteVal} /> {t.c2NoteUnit}
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full font-body text-sm border-collapse text-center">
                        <thead>
                          <tr className="bg-red-600/30">
                            <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_1" /></th>
                            <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_2" /></th>
                          </tr>
                        </thead>
                        <tbody className="text-white/80">
                          <tr className="bg-slate-800/40">
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-white">{t.c2R1c1}</td>
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-white">{t.c2R1c2}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-white">{t.c2R2c1}</td>
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-yellow-300"><InlineMath math="x" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 flex flex-col items-center gap-3">
                      <p className="font-body text-xs text-white/50">{t.c2ParaLabel}</p>
                      <div className="flex flex-col gap-3 w-full max-w-xs">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-green-900/30">
                            <span className="font-body font-bold text-white text-sm">20</span>
                          </div>
                          <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                            <span className="absolute font-body text-[9px] text-yellow-300 -top-3">{t.paraLabel}</span>
                          </div>
                          <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-green-900/30">
                            <span className="font-body font-bold text-white text-sm">18</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-blue-900/30">
                            <span className="font-body font-bold text-white text-sm">30</span>
                          </div>
                          <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                            <span className="absolute font-body text-[9px] text-yellow-300 -top-3">{t.paraLabel}</span>
                          </div>
                          <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-blue-900/30">
                            <span className="font-body font-bold text-yellow-300 text-sm">x</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full border-t border-white/10 pt-2 text-center space-y-1">
                        <BlockMath math={t.c2Math1} />
                        <BlockMath math={t.c2Math2} />
                      </div>
                    </div>
                    <p className="font-body text-sm text-primary font-semibold text-center">{t.c2Result}</p>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSulit}</span>
                    <span className="font-body font-semibold text-white">{t.c3Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c3Q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-semibold text-red-400">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>{t.analisis}</strong>{" "}
                      {t.c3Analysis.split(t.c3AnalysisH)[0]}
                      <strong className="text-red-400">{t.c3AnalysisH}</strong>
                      {t.c3Analysis.split(t.c3AnalysisH)[1]}
                    </p>

                    <div className="bg-slate-900/50 rounded-lg p-3 space-y-1 font-body text-sm text-white/80">
                      <p><strong className="text-orange-300">①</strong> {t.c3S1} <InlineMath math="30 \times 20 = 600" /> {language === "id" ? "satuan" : language === "ja" ? "単位" : "units"}</p>
                      <p><strong className="text-orange-300">②</strong> {t.c3S2} <InlineMath math="12 \times 20 = 240" /> {t.c3S2b} <InlineMath math="600 - 240 = 360" /> {language === "id" ? "satuan" : language === "ja" ? "単位" : "units"}</p>
                      <p><strong className="text-orange-300">③</strong> {t.c3S3} <InlineMath math="30 - 12 - 3 = 15" /> {language === "id" ? "hari" : language === "ja" ? "日" : "days"}</p>
                    </div>

                    <p className="font-body text-sm text-white/80 font-semibold">{t.c3Method3}</p>

                    <div className="overflow-x-auto">
                      <table className="w-full font-body text-sm border-collapse text-center">
                        <thead>
                          <tr className="bg-red-600/30">
                            <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_1" /></th>
                            <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_2" /></th>
                          </tr>
                        </thead>
                        <tbody className="text-white/80">
                          <tr className="bg-slate-800/40">
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-white">{t.c3R1c1}</td>
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-white">{t.c3R1c2}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-yellow-300">{t.c3R2c1}</td>
                            <td className="px-4 py-2 border border-red-500/30 font-bold text-white">{t.c3R2c2}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-4 flex flex-col items-center gap-3">
                      <p className="font-body text-xs text-white/50">{t.c2ParaLabel}</p>
                      <div className="flex flex-col gap-3 w-full max-w-xs">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-green-900/30">
                            <span className="font-body font-bold text-white text-sm">20</span>
                          </div>
                          <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                            <span className="absolute font-body text-[9px] text-yellow-300 -top-3">{t.paraLabel}</span>
                          </div>
                          <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-green-900/30">
                            <span className="font-body font-bold text-white text-sm">18</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-blue-900/30">
                            <span className="font-body font-bold text-yellow-300 text-sm">x</span>
                          </div>
                          <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                            <span className="absolute font-body text-[9px] text-yellow-300 -top-3">{t.paraLabel}</span>
                          </div>
                          <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-4 py-2 text-center flex-1 shadow-lg shadow-blue-900/30">
                            <span className="font-body font-bold text-white text-sm">15</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full border-t border-white/10 pt-2 text-center space-y-1">
                        <BlockMath math={t.c3Math1} />
                        <BlockMath math={t.c3Math2} />
                      </div>
                    </div>
                    <p className="font-body text-sm text-primary font-semibold text-center">
                      {t.c3Result} <InlineMath math={t.c3ResultMath} /> {t.c3ResultUnit}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/perbandingan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganSenilaiPage;
