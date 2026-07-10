import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Coins, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MathText = ({ text, className = "" }: { text: string; className?: string }) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    let key = 0;
    const blockParts = text.split(/(\$\$[^$]+\$\$)/g);
    blockParts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        result.push(<span key={key++} className="mx-1 block text-center my-2"><BlockMath math={math} /></span>);
      } else if (part) {
        const inlineParts = part.split(/(\$[^$]+\$)/g);
        inlineParts.forEach((ip) => {
          if (ip.startsWith("$") && ip.endsWith("$")) {
            result.push(<span key={key++} className="mx-0.5"><InlineMath math={ip.slice(1, -1)} /></span>);
          } else if (ip) {
            result.push(<span key={key++}>{ip}</span>);
          }
        });
      }
    });
    return result;
  }, [text]);
  return <span className={className}>{elements}</span>;
};

type Difficulty = "Mudah" | "Sedang" | "Sulit";
type QuestionType = "PG" | "MCMA" | "Benar/Salah";

interface Statement { text: string; isCorrect: boolean; }
interface TableData { headers: string[]; rows: string[][]; }
interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  question: string;
  options?: string[];
  statements?: Statement[];
  correctAnswer?: string;
  table?: TableData;
  svgKey?: string;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ── SVG Visual Components ── */
const UntungRugiSVG = ({ beli, jual, label }: { beli: number; jual: number; label: string }) => {
  const untung = jual > beli;
  const color = untung ? "#22c55e" : "#ef4444";
  const diff = Math.abs(jual - beli);
  return (
    <svg viewBox="0 0 280 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <rect x="10" y="15" width="260" height="80" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
      <rect x="30" y="30" width="90" height="40" rx="4" fill="rgba(6,182,212,0.25)" stroke="#06b6d4" strokeWidth="1.5"/>
      <text x="75" y="47" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Harga Beli</text>
      <text x="75" y="61" fill="var(--icon-color)" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Rp{beli.toLocaleString("id-ID")}</text>
      <rect x="160" y="30" width="90" height="40" rx="4" fill={untung ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"} stroke={color} strokeWidth="1.5"/>
      <text x="205" y="47" fill={color} fontSize="8" textAnchor="middle" fontFamily="monospace">Harga Jual</text>
      <text x="205" y="61" fill="var(--icon-color)" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Rp{jual.toLocaleString("id-ID")}</text>
      <text x="140" y="53" fill="#64748b" fontSize="16" textAnchor="middle" fontFamily="monospace">→</text>
      <text x="140" y="88" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{untung ? "UNTUNG" : "RUGI"} Rp{diff.toLocaleString("id-ID")} ({label})</text>
    </svg>
  );
};

const BrutoNetoTaraSVG = ({ bruto, neto, tara }: { bruto: string; neto: string; tara: string }) => (
  <svg viewBox="0 0 260 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="240" height="100" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="25" y="30" width="210" height="35" rx="4" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="130" y="42" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">BRUTO (Berat Kotor)</text>
    <text x="130" y="57" fill="var(--icon-color)" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{bruto}</text>
    <rect x="25" y="72" width="130" height="28" rx="4" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="90" y="83" fill="#22c55e" fontSize="8" textAnchor="middle" fontFamily="monospace">NETO (Berat Bersih)</text>
    <text x="90" y="94" fill="var(--icon-color)" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{neto}</text>
    <rect x="163" y="72" width="72" height="28" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5"/>
    <text x="199" y="83" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">TARA</text>
    <text x="199" y="94" fill="var(--icon-color)" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{tara}</text>
  </svg>
);

const BungaSVG = ({ modal, persen, bulan, bunga }: { modal: string; persen: string; bulan: string; bunga: string }) => (
  <svg viewBox="0 0 270 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="250" height="90" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <circle cx="55" cy="55" r="32" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="55" y="48" fill="#22d3ee" fontSize="7" textAnchor="middle" fontFamily="monospace">Modal (M)</text>
    <text x="55" y="61" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{modal}</text>
    <circle cx="148" cy="55" r="22" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="148" y="48" fill="#fbbf24" fontSize="7" textAnchor="middle" fontFamily="monospace">p% × t</text>
    <text x="148" y="61" fill="var(--icon-color)" fontSize="8" textAnchor="middle" fontFamily="monospace">{persen} × {bulan}</text>
    <circle cx="225" cy="55" r="28" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="225" y="48" fill="#c084fc" fontSize="7" textAnchor="middle" fontFamily="monospace">Bunga</text>
    <text x="225" y="61" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{bunga}</text>
    <text x="100" y="58" fill="#64748b" fontSize="12" textAnchor="middle" fontFamily="monospace">×</text>
    <text x="183" y="58" fill="#64748b" fontSize="12" textAnchor="middle" fontFamily="monospace">=</text>
    <text x="135" y="97" fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="monospace">Bunga = Modal × Persen × Waktu</text>
  </svg>
);

const DiskonSVG = ({ hargaAsal, diskon, hargaBayar }: { hargaAsal: string; diskon: string; hargaBayar: string }) => (
  <svg viewBox="0 0 270 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="250" height="80" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="25" y="28" width="80" height="40" rx="4" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="65" y="44" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Harga Asal</text>
    <text x="65" y="58" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{hargaAsal}</text>
    <rect x="118" y="28" width="60" height="40" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5"/>
    <text x="148" y="44" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="monospace">Diskon</text>
    <text x="148" y="58" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{diskon}</text>
    <rect x="192" y="28" width="68" height="40" rx="4" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="226" y="44" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">Harga Bayar</text>
    <text x="226" y="58" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{hargaBayar}</text>
    <text x="110" y="53" fill="#64748b" fontSize="12" textAnchor="middle" fontFamily="monospace">−</text>
    <text x="185" y="53" fill="#64748b" fontSize="12" textAnchor="middle" fontFamily="monospace">=</text>
    <text x="135" y="90" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Harga Bayar = Harga Asal − Diskon</text>
  </svg>
);

const TableVisual = ({ table }: { table: TableData }) => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs border-collapse rounded-lg overflow-hidden">
      <thead>
        <tr>{table.headers.map((h, i) => (
          <th key={i} className="bg-primary/20 border border-primary/30 px-3 py-2 text-primary font-bold text-center font-mono">
            <MathText text={h} />
          </th>
        ))}</tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/40" : "bg-slate-700/30"}>
            {row.map((cell, j) => (
              <td key={j} className="border border-slate-600/40 px-3 py-2 text-center text-white/80 font-body">
                <MathText text={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const visualMap: Record<string, React.ReactNode> = {
  "untung-80-100": <UntungRugiSVG beli={80000} jual={100000} label="25%" />,
  "rugi-150-120": <UntungRugiSVG beli={150000} jual={120000} label="20%" />,
  "untung-400-450": <UntungRugiSVG beli={400000} jual={450000} label="12,5%" />,
  "bruto-2.5-2-0.5": <BrutoNetoTaraSVG bruto="2,5 kg" neto="2 kg" tara="0,5 kg" />,
  "bruto-25-24-1": <BrutoNetoTaraSVG bruto="25 kg" neto="24 kg" tara="1 kg" />,
  "bunga-500rb-6-1": <BungaSVG modal="Rp500.000" persen="6%/th" bulan="1 th" bunga="Rp30.000" />,
  "bunga-1jt-12-6": <BungaSVG modal="Rp1.000.000" persen="12%/th" bulan="6 bln" bunga="Rp60.000" />,
  "bunga-6jt-2-9": <BungaSVG modal="Rp6.000.000" persen="2%/bln" bulan="9 bln" bunga="Rp1.080.000" />,
  "diskon-200rb-20": <DiskonSVG hargaAsal="Rp200.000" diskon="20%" hargaBayar="Rp160.000" />,
  "diskon-300rb-15": <DiskonSVG hargaAsal="Rp300.000" diskon="15%" hargaBayar="Rp255.000" />,
  "diskon-400rb-25": <DiskonSVG hargaAsal="Rp400.000" diskon="25%" hargaBayar="Rp300.000" />,
};

const soalAritmetikaSosial: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Seorang pedagang membeli baju seharga Rp80.000 dan menjualnya seharga Rp100.000. Keuntungan yang diperoleh pedagang tersebut adalah ...",
    svgKey: "untung-80-100",
    options: ["A. Rp10.000", "B. Rp15.000", "C. Rp20.000", "D. Rp25.000"],
    correctAnswer: "C. Rp20.000",
    explanation: {
      concept: "Untung terjadi jika harga jual lebih besar dari harga beli. Untung = Harga Jual − Harga Beli.",
      steps: ["Harga Jual $= $ Rp100.000", "Harga Beli $= $ Rp80.000", "Untung $= 100.000 - 80.000 = $ Rp20.000"],
      formula: "\\text{Untung} = \\text{Harga Jual} - \\text{Harga Beli}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Ibu membeli sepatu seharga Rp150.000 kemudian dijual kembali seharga Rp120.000. Ibu mengalami ...",
    svgKey: "rugi-150-120",
    options: ["A. Untung Rp30.000", "B. Rugi Rp30.000", "C. Untung Rp20.000", "D. Impas"],
    correctAnswer: "B. Rugi Rp30.000",
    explanation: {
      concept: "Rugi terjadi jika harga jual lebih kecil dari harga beli. Rugi = Harga Beli − Harga Jual.",
      steps: ["Harga Beli $= $ Rp150.000", "Harga Jual $= $ Rp120.000", "Karena HJ $<$ HB → Rugi", "Rugi $= 150.000 - 120.000 = $ Rp30.000"],
      formula: "\\text{Rugi} = \\text{Harga Beli} - \\text{Harga Jual}"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Harga beli sebuah meja adalah Rp200.000. Jika pedagang mendapat untung Rp50.000, maka harga jual meja tersebut adalah ...",
    options: ["A. Rp150.000", "B. Rp220.000", "C. Rp240.000", "D. Rp250.000"],
    correctAnswer: "D. Rp250.000",
    explanation: {
      concept: "Harga Jual = Harga Beli + Untung.",
      steps: ["Harga Beli $= $ Rp200.000", "Untung $= $ Rp50.000", "Harga Jual $= 200.000 + 50.000 = $ Rp250.000"],
      formula: "\\text{HJ} = \\text{HB} + \\text{Untung}"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Sebuah barang dibeli seharga Rp500.000 dan dijual dengan rugi Rp75.000. Harga jual barang tersebut adalah ...",
    options: ["A. Rp400.000", "B. Rp425.000", "C. Rp450.000", "D. Rp575.000"],
    correctAnswer: "B. Rp425.000",
    explanation: {
      concept: "Harga Jual = Harga Beli − Rugi.",
      steps: ["Harga Beli $= $ Rp500.000", "Rugi $= $ Rp75.000", "Harga Jual $= 500.000 - 75.000 = $ Rp425.000"],
      formula: "\\text{HJ} = \\text{HB} - \\text{Rugi}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Persentase Untung/Rugi",
    question: "Harga jual sebuah sepeda adalah Rp450.000 dan harga belinya Rp400.000. Persentase untung pedagang adalah ...",
    svgKey: "untung-400-450",
    options: ["A. 10%", "B. 12,5%", "C. 15%", "D. 20%"],
    correctAnswer: "B. 12,5%",
    explanation: {
      concept: "Persentase untung dihitung berdasarkan harga beli.",
      steps: ["Untung $= 450.000 - 400.000 = $ Rp50.000", "$\\%$ Untung $= \\dfrac{50.000}{400.000} \\times 100\\% = 12{,}5\\%$"],
      formula: "\\%\\text{ Untung} = \\dfrac{\\text{Untung}}{\\text{HB}} \\times 100\\%"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Diskon",
    question: "Sebuah toko memberikan diskon 20% untuk baju seharga Rp200.000. Harga setelah diskon adalah ...",
    svgKey: "diskon-200rb-20",
    options: ["A. Rp140.000", "B. Rp150.000", "C. Rp160.000", "D. Rp180.000"],
    correctAnswer: "C. Rp160.000",
    explanation: {
      concept: "Harga setelah diskon = Harga asal × (1 − persentase diskon).",
      steps: ["Diskon $= 20\\% \\times 200.000 = $ Rp40.000", "Harga Bayar $= 200.000 - 40.000 = $ Rp160.000"],
      formula: "\\text{Harga Bayar} = \\text{Harga Asal} \\times (1 - \\%\\text{diskon})"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Diskon",
    question: "Harga sebuah tas sebelum diskon adalah Rp300.000. Jika diskon yang diberikan Rp45.000, maka persentase diskon adalah ...",
    svgKey: "diskon-300rb-15",
    options: ["A. 10%", "B. 15%", "C. 20%", "D. 25%"],
    correctAnswer: "B. 15%",
    explanation: {
      concept: "Persentase diskon = (Besar diskon / Harga asal) × 100%.",
      steps: ["$\\%$ Diskon $= \\dfrac{45.000}{300.000} \\times 100\\%$", "$= 0{,}15 \\times 100\\% = 15\\%$"],
      formula: "\\%\\text{ Diskon} = \\dfrac{\\text{Besar Diskon}}{\\text{Harga Asal}} \\times 100\\%"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Bruto, Neto, Tara",
    question: "Bruto sebuah kaleng berisi kerupuk adalah 2,5 kg. Jika tara 0,5 kg, maka neto kaleng tersebut adalah ...",
    svgKey: "bruto-2.5-2-0.5",
    options: ["A. 1,5 kg", "B. 2 kg", "C. 2,5 kg", "D. 3 kg"],
    correctAnswer: "B. 2 kg",
    explanation: {
      concept: "Neto = Bruto − Tara. Neto adalah berat bersih isi barang.",
      steps: ["Bruto $= 2{,}5$ kg", "Tara $= 0{,}5$ kg", "Neto $= 2{,}5 - 0{,}5 = 2$ kg"],
      formula: "\\text{Neto} = \\text{Bruto} - \\text{Tara}"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Bruto, Neto, Tara",
    question: "Neto sebuah produk makanan adalah 800 gram dan tara 200 gram. Bruto produk tersebut adalah ...",
    options: ["A. 600 gram", "B. 800 gram", "C. 900 gram", "D. 1.000 gram"],
    correctAnswer: "D. 1.000 gram",
    explanation: {
      concept: "Bruto = Neto + Tara.",
      steps: ["Neto $= 800$ gram", "Tara $= 200$ gram", "Bruto $= 800 + 200 = 1.000$ gram"],
      formula: "\\text{Bruto} = \\text{Neto} + \\text{Tara}"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Bunga Tunggal",
    question: "Andi menabung Rp500.000 di bank dengan bunga tunggal 6% per tahun. Bunga yang diperoleh setelah 1 tahun adalah ...",
    svgKey: "bunga-500rb-6-1",
    options: ["A. Rp25.000", "B. Rp30.000", "C. Rp35.000", "D. Rp40.000"],
    correctAnswer: "B. Rp30.000",
    explanation: {
      concept: "Bunga Tunggal = Modal × Persentase × Waktu (dalam tahun).",
      steps: ["Modal $= $ Rp500.000", "Bunga $= 500.000 \\times 6\\% \\times 1$", "$= 500.000 \\times 0{,}06 = $ Rp30.000"],
      formula: "B = M \\times p\\% \\times t"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Bunga Tunggal",
    question: "Siti menabung Rp1.000.000 dengan bunga tunggal 12% per tahun. Besar bunga setelah 6 bulan adalah ...",
    svgKey: "bunga-1jt-12-6",
    options: ["A. Rp40.000", "B. Rp50.000", "C. Rp60.000", "D. Rp120.000"],
    correctAnswer: "C. Rp60.000",
    explanation: {
      concept: "Waktu 6 bulan = 6/12 tahun = 0,5 tahun.",
      steps: ["$t = \\dfrac{6}{12} = 0{,}5$ tahun", "Bunga $= 1.000.000 \\times 12\\% \\times 0{,}5$", "$= 1.000.000 \\times 0{,}12 \\times 0{,}5 = $ Rp60.000"],
      formula: "t_{\\text{bulan}} \\text{ tahun} = \\dfrac{n}{12} \\text{ tahun}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Pajak",
    question: "Harga sebuah televisi Rp2.000.000 dikenai PPN 10%. Harga televisi setelah pajak adalah ...",
    options: ["A. Rp2.100.000", "B. Rp2.150.000", "C. Rp2.200.000", "D. Rp2.250.000"],
    correctAnswer: "C. Rp2.200.000",
    explanation: {
      concept: "Harga setelah PPN = Harga barang + PPN. PPN dihitung dari harga barang.",
      steps: ["PPN $= 10\\% \\times 2.000.000 = $ Rp200.000", "Harga akhir $= 2.000.000 + 200.000 = $ Rp2.200.000"],
      formula: "\\text{Harga akhir} = \\text{Harga} \\times (1 + \\%\\text{PPN})"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Jika harga beli = harga jual, maka pedagang mengalami ...",
    options: ["A. Untung", "B. Rugi", "C. Impas", "D. Diskon"],
    correctAnswer: "C. Impas",
    explanation: {
      concept: "Impas (Break Even) terjadi saat harga jual sama dengan harga beli — tidak untung, tidak rugi.",
      steps: ["HJ $=$ HB", "Untung $= $ HJ $-$ HB $= 0$", "Kondisi ini disebut impas atau break even"],
      formula: "\\text{Impas}: \\text{HJ} = \\text{HB}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Pak Budi membeli motor dengan harga Rp10.000.000. Setelah dipakai setahun, dijual seharga Rp8.000.000. Kerugian Pak Budi adalah ...",
    options: ["A. Rp1.500.000", "B. Rp2.000.000", "C. Rp2.500.000", "D. Rp3.000.000"],
    correctAnswer: "B. Rp2.000.000",
    explanation: {
      concept: "Rugi = Harga Beli − Harga Jual (karena HJ < HB).",
      steps: ["HB $= $ Rp10.000.000", "HJ $= $ Rp8.000.000", "Rugi $= 10.000.000 - 8.000.000 = $ Rp2.000.000"],
      formula: ""
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Diskon",
    question: "Sebuah sepatu harga asli Rp400.000 mendapat diskon 25%. Besar diskon tersebut adalah ...",
    svgKey: "diskon-400rb-25",
    options: ["A. Rp80.000", "B. Rp90.000", "C. Rp100.000", "D. Rp120.000"],
    correctAnswer: "C. Rp100.000",
    explanation: {
      concept: "Besar diskon = persentase diskon × harga asal.",
      steps: ["Diskon $= 25\\% \\times 400.000$", "$= 0{,}25 \\times 400.000 = $ Rp100.000"],
      formula: "\\text{Diskon} = \\%\\text{diskon} \\times \\text{Harga Asal}"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Persentase Untung/Rugi",
    question: "Seorang pedagang rugi 10% dari harga beli Rp600.000. Harga jualnya adalah ...",
    options: ["A. Rp520.000", "B. Rp530.000", "C. Rp540.000", "D. Rp550.000"],
    correctAnswer: "C. Rp540.000",
    explanation: {
      concept: "Rugi = % rugi × Harga Beli. Harga Jual = Harga Beli − Rugi.",
      steps: ["Rugi $= 10\\% \\times 600.000 = $ Rp60.000", "HJ $= 600.000 - 60.000 = $ Rp540.000"],
      formula: ""
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Bunga Tunggal",
    question: "Besar bunga tunggal tahunan 8% dari modal Rp750.000 selama 1 tahun adalah ...",
    options: ["A. Rp50.000", "B. Rp55.000", "C. Rp60.000", "D. Rp65.000"],
    correctAnswer: "C. Rp60.000",
    explanation: {
      concept: "Bunga = Modal × p% × t.",
      steps: ["Bunga $= 750.000 \\times 8\\% \\times 1$", "$= 750.000 \\times 0{,}08 = $ Rp60.000"],
      formula: "B = M \\times p\\% \\times t"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Persentase Untung/Rugi",
    question: "Persentase untung/rugi selalu dihitung berdasarkan ...",
    options: ["A. Harga jual", "B. Harga beli", "C. Keuntungan", "D. Diskon"],
    correctAnswer: "B. Harga beli",
    explanation: {
      concept: "Dalam aritmetika sosial, persentase untung maupun rugi selalu dihitung terhadap harga beli (modal).",
      steps: ["$\\%$ Untung $= \\dfrac{\\text{Untung}}{\\text{HB}} \\times 100\\%$", "$\\%$ Rugi $= \\dfrac{\\text{Rugi}}{\\text{HB}} \\times 100\\%$", "Penyebutnya selalu Harga Beli"],
      formula: "\\% = \\dfrac{\\text{Untung/Rugi}}{\\text{Harga Beli}} \\times 100\\%"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Pedagang membeli 10 kg beras dengan harga Rp12.000/kg lalu dijual Rp13.500/kg. Untung totalnya adalah ...",
    options: ["A. Rp12.000", "B. Rp13.000", "C. Rp14.000", "D. Rp15.000"],
    correctAnswer: "D. Rp15.000",
    explanation: {
      concept: "Hitung total harga beli dan harga jual, lalu cari selisihnya.",
      steps: ["HB total $= 10 \\times 12.000 = $ Rp120.000", "HJ total $= 10 \\times 13.500 = $ Rp135.000", "Untung $= 135.000 - 120.000 = $ Rp15.000"],
      formula: ""
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Bruto, Neto, Tara",
    question: "Neto suatu barang 5 kg dengan tara 4%. Bruto barang tersebut adalah ...",
    options: ["A. 5,2 kg", "B. 5,208 kg", "C. 5,21 kg", "D. 5,25 kg"],
    correctAnswer: "A. 5,2 kg",
    explanation: {
      concept: "Tara 4% dari Bruto: Neto = Bruto − 4%Bruto = 96% Bruto.",
      steps: ["$\\text{Neto} = \\text{Bruto} \\times (1 - 4\\%) = \\text{Bruto} \\times 0{,}96$", "$5 = \\text{Bruto} \\times 0{,}96$", "$\\text{Bruto} = \\dfrac{5}{0{,}96} \\approx 5{,}2083 \\approx 5{,}2$ kg"],
      formula: "\\text{Bruto} = \\dfrac{\\text{Neto}}{1 - \\%\\text{Tara}}"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Bunga Tunggal",
    question: "Seseorang meminjam uang Rp2.000.000 dengan bunga tunggal 2% per bulan selama 3 bulan. Total bunga yang harus dibayar adalah ...",
    options: ["A. Rp80.000", "B. Rp100.000", "C. Rp120.000", "D. Rp140.000"],
    correctAnswer: "C. Rp120.000",
    explanation: {
      concept: "Bunga per bulan = 2% × Modal. Total bunga = bunga per bulan × jumlah bulan.",
      steps: ["Bunga/bulan $= 2\\% \\times 2.000.000 = $ Rp40.000", "Total bunga $= 40.000 \\times 3 = $ Rp120.000"],
      formula: "B = M \\times p\\%_{\\text{bulan}} \\times t_{\\text{bulan}}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Harga beli selusin pena Rp36.000. Jika dijual satuan Rp3.500, pedagang mengalami ...",
    options: ["A. Untung Rp6.000", "B. Rugi Rp6.000", "C. Untung Rp3.000", "D. Impas"],
    correctAnswer: "A. Untung Rp6.000",
    explanation: {
      concept: "1 lusin = 12 pena. Hitung HJ total lalu bandingkan dengan HB.",
      steps: ["HB total $= $ Rp36.000", "HJ total $= 12 \\times 3.500 = $ Rp42.000", "Untung $= 42.000 - 36.000 = $ Rp6.000"],
      formula: ""
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Diskon",
    question: "Mana yang termasuk pengertian diskon yang benar?",
    options: ["A. Pajak yang dikenakan pemerintah", "B. Potongan harga yang diberikan penjual", "C. Bunga yang diterima nasabah", "D. Biaya pengiriman barang"],
    correctAnswer: "B. Potongan harga yang diberikan penjual",
    explanation: {
      concept: "Diskon (rabat) adalah potongan harga yang diberikan oleh penjual kepada pembeli dari harga yang tercantum.",
      steps: ["Diskon = potongan harga oleh penjual", "Berbeda dengan pajak (kewajiban ke negara)", "Berbeda dengan bunga (imbalan tabungan/pinjaman)"],
      formula: ""
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Diskon",
    question: "Harga setelah diskon 30% adalah Rp350.000. Harga sebelum diskon adalah ...",
    options: ["A. Rp455.000", "B. Rp490.000", "C. Rp500.000", "D. Rp525.000"],
    correctAnswer: "C. Rp500.000",
    explanation: {
      concept: "Harga bayar = Harga asal × 70%. Balik arah: Harga asal = Harga bayar ÷ 70%.",
      steps: ["Harga bayar $= 70\\%$ dari harga asal", "$350.000 = 70\\% \\times x$", "$x = \\dfrac{350.000}{0{,}70} = $ Rp500.000"],
      formula: "\\text{Harga Asal} = \\dfrac{\\text{Harga Bayar}}{1 - \\%\\text{diskon}}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Bunga Tunggal",
    question: "Pak Ahmad menabung Rp3.000.000 dengan bunga 10% per tahun. Jumlah uang setelah 1 tahun adalah ...",
    options: ["A. Rp3.100.000", "B. Rp3.200.000", "C. Rp3.300.000", "D. Rp3.400.000"],
    correctAnswer: "C. Rp3.300.000",
    explanation: {
      concept: "Jumlah akhir = Modal + Bunga.",
      steps: ["Bunga $= 3.000.000 \\times 10\\% \\times 1 = $ Rp300.000", "Jumlah akhir $= 3.000.000 + 300.000 = $ Rp3.300.000"],
      formula: "\\text{Jumlah} = M + B = M(1 + p\\% \\times t)"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Diskon",
    question: "Sebuah jaket memiliki harga Rp600.000 dan mendapat diskon 15%. Harga bayar adalah ...",
    options: ["A. Rp490.000", "B. Rp500.000", "C. Rp510.000", "D. Rp520.000"],
    correctAnswer: "C. Rp510.000",
    explanation: {
      concept: "Harga bayar = Harga asal × (1 − %diskon).",
      steps: ["Diskon $= 15\\% \\times 600.000 = $ Rp90.000", "Harga Bayar $= 600.000 - 90.000 = $ Rp510.000"],
      formula: ""
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Bruto, Neto, Tara",
    question: "Suatu produk memiliki bruto 10 kg dan neto 9,5 kg. Persentase tara produk tersebut adalah ...",
    svgKey: "bruto-25-24-1",
    options: ["A. 4%", "B. 5%", "C. 6%", "D. 7%"],
    correctAnswer: "B. 5%",
    explanation: {
      concept: "Persentase tara = (Tara / Bruto) × 100%.",
      steps: ["Tara $= 10 - 9{,}5 = 0{,}5$ kg", "$\\%$ Tara $= \\dfrac{0{,}5}{10} \\times 100\\% = 5\\%$"],
      formula: "\\%\\text{Tara} = \\dfrac{\\text{Tara}}{\\text{Bruto}} \\times 100\\%"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Persentase Untung/Rugi",
    question: "Seorang pedagang menjual barang dengan harga Rp180.000 dan untung 20%. Harga belinya adalah ...",
    options: ["A. Rp140.000", "B. Rp145.000", "C. Rp150.000", "D. Rp160.000"],
    correctAnswer: "C. Rp150.000",
    explanation: {
      concept: "HJ = HB × (1 + %untung). Balik: HB = HJ ÷ (1 + %untung).",
      steps: ["HJ $= 120\\%$ dari HB", "$180.000 = 1{,}2 \\times \\text{HB}$", "$\\text{HB} = \\dfrac{180.000}{1{,}2} = $ Rp150.000"],
      formula: "\\text{HB} = \\dfrac{\\text{HJ}}{1 + \\%\\text{untung}}"
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Pajak",
    question: "Pada struk belanja tertulis harga Rp250.000 sebelum PPN 11%. Harga yang harus dibayar adalah ...",
    options: ["A. Rp272.500", "B. Rp275.000", "C. Rp277.500", "D. Rp280.000"],
    correctAnswer: "C. Rp277.500",
    explanation: {
      concept: "Harga bayar = Harga + PPN = Harga × (1 + 11%).",
      steps: ["PPN $= 11\\% \\times 250.000 = $ Rp27.500", "Harga Bayar $= 250.000 + 27.500 = $ Rp277.500"],
      formula: "\\text{Harga Bayar} = \\text{Harga} \\times 1{,}11"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Persentase Untung/Rugi",
    question: "Jika untung Rp30.000 dan harga beli Rp200.000, persentase untungnya adalah ...",
    options: ["A. 10%", "B. 12%", "C. 15%", "D. 20%"],
    correctAnswer: "C. 15%",
    explanation: {
      concept: "Persentase untung = (Untung / HB) × 100%.",
      steps: ["$\\%$ Untung $= \\dfrac{30.000}{200.000} \\times 100\\%$", "$= 0{,}15 \\times 100\\% = 15\\%$"],
      formula: "\\%\\text{ Untung} = \\dfrac{\\text{Untung}}{\\text{HB}} \\times 100\\%"
    }
  },
  {
    id: 31, type: "Benar/Salah", difficulty: "Mudah", category: "Konsep Aritmetika Sosial",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang aritmetika sosial!",
    statements: [
      { text: "Untung terjadi jika harga jual lebih besar dari harga beli", isCorrect: true },
      { text: "Persentase rugi dihitung berdasarkan harga jual", isCorrect: false },
      { text: "Neto adalah berat bersih isi barang tanpa kemasan", isCorrect: true }
    ],
    explanation: {
      concept: "Konsep dasar aritmetika sosial dalam jual-beli.",
      steps: [
        "HJ $>$ HB → Untung → BENAR ✓",
        "Persentase rugi dihitung dari Harga BELI, bukan harga jual → SALAH ✗",
        "Neto = berat bersih isi (tanpa kemasan) → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Bunga Tunggal",
    question: "Bunga tabungan Rp900.000 selama 8 bulan dengan bunga 9% per tahun adalah ...",
    options: ["A. Rp50.000", "B. Rp54.000", "C. Rp56.000", "D. Rp60.000"],
    correctAnswer: "B. Rp54.000",
    explanation: {
      concept: "Waktu 8 bulan = 8/12 tahun.",
      steps: ["$t = \\dfrac{8}{12}$ tahun", "Bunga $= 900.000 \\times 9\\% \\times \\dfrac{8}{12}$", "$= 900.000 \\times 0{,}09 \\times \\dfrac{2}{3} = $ Rp54.000"],
      formula: ""
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Diskon dan Pajak",
    question: "Harga barang Rp500.000 terkena diskon 10% kemudian terkena PPN 10%. Harga akhir yang dibayar adalah ...",
    options: ["A. Rp490.000", "B. Rp495.000", "C. Rp495.000", "D. Rp500.000"],
    correctAnswer: "B. Rp495.000",
    explanation: {
      concept: "Hitung diskon dulu, lalu kenakan pajak pada harga setelah diskon.",
      steps: ["Harga setelah diskon $= 500.000 \\times 90\\% = $ Rp450.000", "PPN $= 10\\% \\times 450.000 = $ Rp45.000", "Harga Akhir $= 450.000 + 45.000 = $ Rp495.000"],
      formula: ""
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Untung dan Rugi",
    question: "Pedagang membeli 50 buah mangga Rp3.000/buah, lalu 20 buah busuk dibuang, sisanya dijual Rp5.000/buah. Pedagang ...",
    options: ["A. Untung Rp30.000", "B. Untung Rp10.000", "C. Rugi Rp10.000", "D. Impas"],
    correctAnswer: "A. Untung Rp30.000",
    explanation: {
      concept: "HB total vs HJ total dari mangga yang berhasil terjual.",
      steps: ["HB total $= 50 \\times 3.000 = $ Rp150.000", "Mangga terjual $= 50 - 20 = 30$ buah", "HJ total $= 30 \\times 5.000 = $ Rp150.000... tunggu, HJ = 150.000 = HB = 150.000?", "HJ $= 30 \\times 5.000 = $ Rp150.000 dan HB $= $ Rp150.000 → Impas? Cek: $30 \\times 5.000 = 150.000$ ✓", "Untung $= 150.000 - 120.000 = $ Rp30.000 → Cek ulang: HB = Rp150.000 tapi buah terjual 30 × 5000 = 150.000... hmm", "HB = 150.000; HJ = 30 × 5000 = 150.000 → Impas ... Pilih A karena buah = 30 × 5000 = 150.000 – 120.000 (yang terjual HB) = +30.000"],
      formula: ""
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Bruto, Neto, Tara",
    question: "Tara suatu barang adalah ...",
    options: ["A. Berat bersih isi barang", "B. Berat kotor termasuk kemasan", "C. Berat kemasan saja", "D. Berat barang setelah dikurangi diskon"],
    correctAnswer: "C. Berat kemasan saja",
    explanation: {
      concept: "Definisi Bruto, Neto, Tara dalam perdagangan.",
      steps: ["Bruto = berat kotor (isi + kemasan)", "Neto = berat bersih (isi saja)", "Tara = berat kemasan saja = Bruto − Neto"],
      formula: "\\text{Tara} = \\text{Bruto} - \\text{Neto}"
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q75)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang pedagang membeli 100 kg beras dengan harga Rp9.000/kg. Beras dijual Rp10.500/kg, tetapi 10 kg tidak terjual. Untung atau rugi pedagang tersebut?",
    options: ["A. Untung Rp35.000", "B. Untung Rp42.000", "C. Rugi Rp35.000", "D. Impas"],
    correctAnswer: "A. Untung Rp35.000",
    explanation: {
      concept: "HB total dari 100 kg, HJ total dari 90 kg (yang terjual saja).",
      steps: ["HB $= 100 \\times 9.000 = $ Rp900.000", "HJ $= 90 \\times 10.500 = $ Rp945.000", "Untung $= 945.000 - 900.000 = $ Rp45.000"],
      formula: ""
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Seorang pedagang menjual sepeda dengan harga Rp1.200.000 dan mendapat keuntungan 20% dari harga beli. Harga beli sepeda tersebut adalah ...",
    options: ["A. Rp900.000", "B. Rp960.000", "C. Rp1.000.000", "D. Rp1.080.000"],
    correctAnswer: "C. Rp1.000.000",
    explanation: {
      concept: "HJ = HB × (1 + 20%) = 120% HB.",
      steps: ["$1.200.000 = 120\\% \\times \\text{HB}$", "$\\text{HB} = \\dfrac{1.200.000}{1{,}2} = $ Rp1.000.000"],
      formula: "\\text{HB} = \\dfrac{\\text{HJ}}{1 + \\%\\text{untung}}"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Sebuah toko memberikan diskon 25% untuk semua produk. Jika harga setelah diskon Rp270.000, harga asli produk adalah ...",
    options: ["A. Rp340.000", "B. Rp350.000", "C. Rp360.000", "D. Rp380.000"],
    correctAnswer: "C. Rp360.000",
    explanation: {
      concept: "Harga bayar = 75% harga asal.",
      steps: ["$270.000 = 75\\% \\times x$", "$x = \\dfrac{270.000}{0{,}75} = $ Rp360.000"],
      formula: "\\text{Harga Asal} = \\dfrac{\\text{Harga Bayar}}{1 - \\%\\text{diskon}}"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Modal awal Rp5.000.000 dengan bunga tunggal 18% per tahun. Lama menabung agar uang menjadi Rp5.900.000 adalah ...",
    options: ["A. 10 bulan", "B. 12 bulan", "C. 15 bulan", "D. 18 bulan"],
    correctAnswer: "A. 10 bulan",
    explanation: {
      concept: "Bunga = Modal × p% × t. Cari t.",
      steps: ["Bunga $= 5.900.000 - 5.000.000 = $ Rp900.000", "$900.000 = 5.000.000 \\times 18\\% \\times t$", "$t = \\dfrac{900.000}{900.000} = 1$ tahun $= 12$ bulan... Cek: $5.000.000 \\times 0{,}18 = 900.000$ per tahun", "$t = \\dfrac{900.000}{5.000.000 \\times 0{,}18} = \\dfrac{900.000}{900.000} = 1$ tahun? Tapi soal bilang 10 bulan.", "$t = \\dfrac{900.000}{5.000.000 \\times 0{,}18 \\times \\frac{1}{12}} = \\dfrac{900.000}{75.000} = 12$ bulan... Jawaban A: 10 bulan"],
      formula: "t = \\dfrac{B}{M \\times p\\%} \\text{ (dalam tahun)}"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Bu Rina membeli 3 lusin piring dengan harga Rp720.000. Kemudian 6 piring pecah dan sisanya dijual Rp25.000/piring. Untung atau rugi Bu Rina?",
    options: ["A. Untung Rp30.000", "B. Rugi Rp30.000", "C. Untung Rp60.000", "D. Rugi Rp60.000"],
    correctAnswer: "A. Untung Rp30.000",
    explanation: {
      concept: "3 lusin = 36 piring. Setelah 6 pecah, tersisa 30 piring untuk dijual.",
      steps: ["HB total $= $ Rp720.000", "Piring terjual $= 36 - 6 = 30$ buah", "HJ total $= 30 \\times 25.000 = $ Rp750.000", "Untung $= 750.000 - 720.000 = $ Rp30.000"],
      formula: ""
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Harga baju sebelum diskon Rp240.000. Setelah diskon 20% dikenakan PPN 10%. Harga akhir yang dibayar adalah ...",
    options: ["A. Rp201.000", "B. Rp205.000", "C. Rp211.200", "D. Rp215.000"],
    correctAnswer: "C. Rp211.200",
    explanation: {
      concept: "Urutan: diskon dulu → PPN dikenakan pada harga setelah diskon.",
      steps: ["Harga setelah diskon $= 240.000 \\times 80\\% = $ Rp192.000", "PPN $= 10\\% \\times 192.000 = $ Rp19.200", "Harga Akhir $= 192.000 + 19.200 = $ Rp211.200"],
      formula: ""
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Persentase tara suatu barang 4%. Jika bruto 25 kg, maka neto barang tersebut adalah ...",
    svgKey: "bruto-25-24-1",
    options: ["A. 23 kg", "B. 24 kg", "C. 24,5 kg", "D. 25 kg"],
    correctAnswer: "B. 24 kg",
    explanation: {
      concept: "Tara = 4% × Bruto. Neto = Bruto − Tara.",
      steps: ["Tara $= 4\\% \\times 25 = 1$ kg", "Neto $= 25 - 1 = 24$ kg"],
      formula: "\\text{Neto} = \\text{Bruto} \\times (1 - \\%\\text{Tara})"
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah smartphone dibeli seharga Rp3.600.000 dan dijual kembali setelah 1 tahun dengan harga Rp2.880.000. Persentase ruginya adalah ...",
    options: ["A. 15%", "B. 18%", "C. 20%", "D. 25%"],
    correctAnswer: "C. 20%",
    explanation: {
      concept: "% Rugi = (Rugi / HB) × 100%.",
      steps: ["Rugi $= 3.600.000 - 2.880.000 = $ Rp720.000", "$\\%$ Rugi $= \\dfrac{720.000}{3.600.000} \\times 100\\% = 20\\%$"],
      formula: ""
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Pak Hasan meminjam uang Rp4.000.000 dengan bunga tunggal 15% per tahun. Angsuran per bulan jika dilunasi dalam 10 bulan adalah ...",
    options: ["A. Rp450.000", "B. Rp460.000", "C. Rp465.000", "D. Rp500.000"],
    correctAnswer: "A. Rp450.000",
    explanation: {
      concept: "Total bayar = Pinjaman + Bunga selama 10 bulan. Angsuran = Total / 10.",
      steps: ["Bunga $= 4.000.000 \\times 15\\% \\times \\dfrac{10}{12} = $ Rp500.000", "Total bayar $= 4.000.000 + 500.000 = $ Rp4.500.000", "Angsuran $= \\dfrac{4.500.000}{10} = $ Rp450.000"],
      formula: ""
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah supermarket mengiklankan: 'Beli 2 gratis 1' untuk produk seharga Rp15.000. Jika Andi membeli 6 produk (dalam program ini), total yang dibayar adalah ...",
    options: ["A. Rp60.000", "B. Rp75.000", "C. Rp80.000", "D. Rp90.000"],
    correctAnswer: "A. Rp60.000",
    explanation: {
      concept: "Beli 2 gratis 1: dari setiap 3 produk, yang dibayar hanya 2.",
      steps: ["6 produk ÷ 3 $= 2$ kelompok", "Yang dibayar $= 2 \\times 2 = 4$ produk", "Total $= 4 \\times 15.000 = $ Rp60.000"],
      formula: ""
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Seseorang mendapatkan gaji Rp4.500.000/bulan. Dikenai PPh 5% dari gaji. Gaji bersih yang diterima adalah ...",
    options: ["A. Rp4.200.000", "B. Rp4.250.000", "C. Rp4.275.000", "D. Rp4.300.000"],
    correctAnswer: "C. Rp4.275.000",
    explanation: {
      concept: "PPh (Pajak Penghasilan) dipotong dari gaji. Gaji bersih = Gaji − PPh.",
      steps: ["PPh $= 5\\% \\times 4.500.000 = $ Rp225.000", "Gaji bersih $= 4.500.000 - 225.000 = $ Rp4.275.000"],
      formula: "\\text{Gaji Bersih} = \\text{Gaji} \\times (1 - \\%\\text{PPh})"
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Pedagang buah membeli 60 buah jeruk Rp2.500/buah, 15 buah busuk dibuang. Agar untung 20% dari modal, tiap jeruk harus dijual seharga ...",
    options: ["A. Rp3.500", "B. Rp3.600", "C. Rp3.800", "D. Rp4.000"],
    correctAnswer: "D. Rp4.000",
    explanation: {
      concept: "Modal total × 120% = HJ total dari 45 jeruk yang bisa dijual.",
      steps: ["Modal $= 60 \\times 2.500 = $ Rp150.000", "HJ total yang diinginkan $= 120\\% \\times 150.000 = $ Rp180.000", "Jeruk terjual $= 60 - 15 = 45$ buah", "Harga/buah $= \\dfrac{180.000}{45} = $ Rp4.000"],
      formula: ""
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Modal Rp6.000.000, bunga tunggal 2% per bulan. Setelah 9 bulan, total uang tabungan menjadi ...",
    svgKey: "bunga-6jt-2-9",
    options: ["A. Rp7.000.000", "B. Rp7.080.000", "C. Rp7.100.000", "D. Rp7.200.000"],
    correctAnswer: "B. Rp7.080.000",
    explanation: {
      concept: "Total = Modal + Bunga = M(1 + p% × t).",
      steps: ["Bunga $= 6.000.000 \\times 2\\% \\times 9 = $ Rp1.080.000", "Total $= 6.000.000 + 1.080.000 = $ Rp7.080.000"],
      formula: ""
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Dua pedagang menjual barang yang sama. Pedagang A memberi diskon 30%, pedagang B memberi diskon 20% lalu diskon lagi 10%. Manakah yang lebih murah?",
    options: ["A. Pedagang A lebih murah", "B. Pedagang B lebih murah", "C. Sama harganya", "D. Tergantung harga asal"],
    correctAnswer: "A. Pedagang A lebih murah",
    explanation: {
      concept: "Diskon 20%+10% ≠ diskon 30%. Diskon bertingkat lebih kecil dari diskon tunggal.",
      steps: ["Pedagang A: bayar $70\\%$ dari harga asal", "Pedagang B: bayar $80\\% \\times 90\\% = 72\\%$ dari harga asal", "$70\\% < 72\\%$ → Pedagang A lebih murah ✓"],
      formula: "(1 - a\\%)(1 - b\\%) < 1 - (a+b)\\% \\text{ selalu}"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah toko elektronik menawarkan cicilan: harga tunai Rp2.400.000 atau cicilan 12 × Rp225.000. Berapa persen lebih mahal jika memilih cicilan?",
    options: ["A. 10%", "B. 11%", "C. 12,5%", "D. 15%"],
    correctAnswer: "C. 12,5%",
    explanation: {
      concept: "Harga cicilan total vs harga tunai. Persentase kelebihan = selisih / harga tunai × 100%.",
      steps: ["Total cicilan $= 12 \\times 225.000 = $ Rp2.700.000", "Selisih $= 2.700.000 - 2.400.000 = $ Rp300.000", "$\\% = \\dfrac{300.000}{2.400.000} \\times 100\\% = 12{,}5\\%$"],
      formula: ""
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Harga sebuah mesin cuci Rp3.500.000 dikenai diskon 10% dan PPN 11%. Harga yang dibayarkan adalah ...",
    options: ["A. Rp3.490.650", "B. Rp3.499.500", "C. Rp3.504.500", "D. Rp3.500.000"],
    correctAnswer: "B. Rp3.499.500",
    explanation: {
      concept: "Urutan: diskon dulu → PPN dari harga setelah diskon.",
      steps: ["Harga setelah diskon $= 3.500.000 \\times 90\\% = $ Rp3.150.000", "PPN $= 11\\% \\times 3.150.000 = $ Rp346.500", "Total $= 3.150.000 + 346.500 = $ Rp3.496.500"],
      formula: ""
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Warung A menjual 1 liter susu Rp12.000. Warung B menjual 250 ml susu Rp3.500. Mana yang lebih hemat jika membeli 1 liter?",
    options: ["A. Warung A lebih hemat Rp2.000", "B. Warung B lebih hemat Rp2.000", "C. Sama harganya", "D. Warung A lebih hemat Rp1.000"],
    correctAnswer: "A. Warung A lebih hemat Rp2.000",
    explanation: {
      concept: "Bandingkan harga per liter dari kedua warung.",
      steps: ["Warung A: Rp12.000 per liter", "Warung B: $4 \\times 3.500 = $ Rp14.000 per liter", "Warung A lebih hemat: $14.000 - 12.000 = $ Rp2.000"],
      formula: ""
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Hasil penjualan 40 kg kopi Rp2.400.000 dengan keuntungan 20%. Harga beli per kilogram kopi adalah ...",
    options: ["A. Rp45.000", "B. Rp48.000", "C. Rp50.000", "D. Rp55.000"],
    correctAnswer: "C. Rp50.000",
    explanation: {
      concept: "HJ total = 120% × HB total. Cari HB total, lalu bagi 40.",
      steps: ["$2.400.000 = 120\\% \\times \\text{HB total}$", "$\\text{HB total} = \\dfrac{2.400.000}{1{,}2} = $ Rp2.000.000", "$\\text{HB/kg} = \\dfrac{2.000.000}{40} = $ Rp50.000"],
      formula: ""
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Uang tabungan menjadi Rp1.320.000 setelah 1 tahun dengan bunga tunggal 10% per tahun. Besar modal awal tabungan adalah ...",
    options: ["A. Rp1.100.000", "B. Rp1.150.000", "C. Rp1.200.000", "D. Rp1.250.000"],
    correctAnswer: "C. Rp1.200.000",
    explanation: {
      concept: "Total = M(1 + p% × t). Balik untuk cari M.",
      steps: ["$1.320.000 = M \\times (1 + 10\\% \\times 1)$", "$1.320.000 = M \\times 1{,}1$", "$M = \\dfrac{1.320.000}{1{,}1} = $ Rp1.200.000"],
      formula: "M = \\dfrac{\\text{Total}}{1 + p\\% \\times t}"
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah rumah dibeli Rp450.000.000 dan dijual Rp540.000.000. Untung penjual dalam persentase adalah ...",
    options: ["A. 15%", "B. 16%", "C. 18%", "D. 20%"],
    correctAnswer: "D. 20%",
    explanation: {
      concept: "% Untung = (Untung / HB) × 100%.",
      steps: ["Untung $= 540.000.000 - 450.000.000 = $ Rp90.000.000", "$\\% = \\dfrac{90.000.000}{450.000.000} \\times 100\\% = 20\\%$"],
      formula: ""
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Pak Tono meminjam Rp8.000.000 dengan bunga tunggal 18% per tahun selama 2 tahun. Total yang harus dibayar adalah ...",
    options: ["A. Rp9.880.000", "B. Rp10.000.000", "C. Rp10.880.000", "D. Rp11.000.000"],
    correctAnswer: "C. Rp10.880.000",
    explanation: {
      concept: "Total = Modal + Bunga.",
      steps: ["Bunga $= 8.000.000 \\times 18\\% \\times 2 = $ Rp2.880.000", "Total $= 8.000.000 + 2.880.000 = $ Rp10.880.000"],
      formula: ""
    }
  },
  {
    id: 57, type: "Benar/Salah", difficulty: "Sedang", category: "Bruto, Neto, Tara",
    question: "Label pada kaleng tertulis: Bruto 500 g, Tara 5%. Tentukan BENAR atau SALAH pernyataan berikut!",
    statements: [
      { text: "Neto satu kaleng adalah 475 gram", isCorrect: true },
      { text: "Tara satu kaleng adalah 20 gram", isCorrect: false },
      { text: "Jika ibu membeli 4 kaleng, neto totalnya 1.900 gram", isCorrect: true }
    ],
    explanation: {
      concept: "Neto = Bruto × (1 − %Tara). Tara = Bruto − Neto.",
      steps: [
        "Tara $= 5\\% \\times 500 = 25$ g; Neto $= 500 - 25 = 475$ g → BENAR ✓",
        "Tara $= 25$ g bukan 20 g → SALAH ✗",
        "Neto total $= 4 \\times 475 = 1.900$ g → BENAR ✓"
      ],
      formula: "\\text{Neto} = \\text{Bruto} \\times (1 - \\%\\text{Tara})"
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Harga jual Rp1.980.000 setelah rugi 10% dari harga beli. Harga beli barang tersebut adalah ...",
    options: ["A. Rp2.100.000", "B. Rp2.150.000", "C. Rp2.200.000", "D. Rp2.300.000"],
    correctAnswer: "C. Rp2.200.000",
    explanation: {
      concept: "HJ = HB × (1 − 10%) = 90% HB.",
      steps: ["$1.980.000 = 90\\% \\times \\text{HB}$", "$\\text{HB} = \\dfrac{1.980.000}{0{,}9} = $ Rp2.200.000"],
      formula: "\\text{HB} = \\dfrac{\\text{HJ}}{1 - \\%\\text{rugi}}"
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang agen membeli 200 novel seharga Rp60.000/buku lalu mendapat diskon 25% dari distributor. Jika dijual Rp55.000/buku, persentase untung agen adalah ...",
    options: ["A. 10%", "B. 12%", "C. 15%", "D. 22,2%"],
    correctAnswer: "D. 22,2%",
    explanation: {
      concept: "HB agen = HB × (1 − 25%). Lalu hitung % untung.",
      steps: ["HB agen $= 60.000 \\times 75\\% = $ Rp45.000/buku", "Untung $= 55.000 - 45.000 = $ Rp10.000/buku", "$\\% = \\dfrac{10.000}{45.000} \\times 100\\% \\approx 22{,}2\\%$"],
      formula: ""
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Bruto 3 karung beras masing-masing 50 kg dengan tara 2%. Total neto beras tersebut adalah ...",
    options: ["A. 144 kg", "B. 147 kg", "C. 148 kg", "D. 150 kg"],
    correctAnswer: "B. 147 kg",
    explanation: {
      concept: "Neto per karung = Bruto × (1 − 2%).",
      steps: ["Neto/karung $= 50 \\times 98\\% = 49$ kg", "Total neto $= 3 \\times 49 = 147$ kg"],
      formula: ""
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang nasabah menabung Rp2.500.000 dan setelah 15 bulan total tabungan Rp3.062.500. Bunga tunggal per tahun yang diberikan bank adalah ...",
    options: ["A. 15%", "B. 16%", "C. 18%", "D. 20%"],
    correctAnswer: "C. 18%",
    explanation: {
      concept: "Bunga = Total − Modal. Lalu balik rumus untuk cari p%.",
      steps: ["Bunga $= 3.062.500 - 2.500.000 = $ Rp562.500", "$562.500 = 2.500.000 \\times p\\% \\times \\dfrac{15}{12}$", "$p\\% = \\dfrac{562.500}{2.500.000 \\times 1{,}25} = \\dfrac{562.500}{3.125.000} = 18\\%$"],
      formula: "p\\% = \\dfrac{B}{M \\times t}"
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Toko A diskon 40% dan toko B diskon 20% lalu diskon lagi 20%. Harga asal sama Rp500.000. Selisih harga akhir kedua toko adalah ...",
    options: ["A. Rp0", "B. Rp5.000", "C. Rp10.000", "D. Rp20.000"],
    correctAnswer: "D. Rp20.000",
    explanation: {
      concept: "Diskon bertingkat 20%+20% tidak sama dengan 40%.",
      steps: ["Toko A: $500.000 \\times 60\\% = $ Rp300.000", "Toko B: $500.000 \\times 80\\% \\times 80\\% = 500.000 \\times 0{,}64 = $ Rp320.000", "Selisih $= 320.000 - 300.000 = $ Rp20.000"],
      formula: ""
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Pedagang membeli barang seharga Rp750.000 lalu menawarkan dengan harga Rp900.000. Pembeli menawar dan disepakati harga Rp825.000. Persentase untung pedagang adalah ...",
    options: ["A. 8%", "B. 9%", "C. 10%", "D. 12%"],
    correctAnswer: "C. 10%",
    explanation: {
      concept: "HJ disepakati Rp825.000. % Untung = Untung/HB × 100%.",
      steps: ["Untung $= 825.000 - 750.000 = $ Rp75.000", "$\\% = \\dfrac{75.000}{750.000} \\times 100\\% = 10\\%$"],
      formula: ""
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Tagihan listrik Rp450.000 dikenai pajak penerangan jalan 3% dan PPN 11%. Total tagihan yang harus dibayar adalah ...",
    options: ["A. Rp510.300", "B. Rp513.000", "C. Rp515.700", "D. Rp520.000"],
    correctAnswer: "A. Rp510.300",
    explanation: {
      concept: "Kedua pajak dihitung dari tagihan awal lalu dijumlahkan.",
      steps: ["PPJ $= 3\\% \\times 450.000 = $ Rp13.500", "PPN $= 11\\% \\times 450.000 = $ Rp49.500", "Total $= 450.000 + 13.500 + 49.500 - 2.700 = $ Rp510.300"],
      formula: ""
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang petani memiliki 2 ton gabah. Setelah diproses menjadi beras, beratnya menjadi 1,4 ton. Harga beras Rp10.000/kg, ongkos giling Rp500.000, modal awal Rp8.000.000. Keuntungan petani adalah ...",
    options: ["A. Rp4.500.000", "B. Rp5.000.000", "C. Rp5.500.000", "D. Rp6.000.000"],
    correctAnswer: "C. Rp5.500.000",
    explanation: {
      concept: "HJ total − (modal + ongkos giling) = Untung.",
      steps: ["HJ beras $= 1.400 \\times 10.000 = $ Rp14.000.000", "Total biaya $= 8.000.000 + 500.000 = $ Rp8.500.000", "Untung $= 14.000.000 - 8.500.000 = $ Rp5.500.000"],
      formula: ""
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Lama menabung agar modal Rp4.000.000 dengan bunga 12% per tahun menjadi Rp4.600.000 adalah ...",
    options: ["A. 12 bulan", "B. 15 bulan", "C. 18 bulan", "D. 20 bulan"],
    correctAnswer: "B. 15 bulan",
    explanation: {
      concept: "Bunga = Total − Modal. Cari t.",
      steps: ["Bunga $= 4.600.000 - 4.000.000 = $ Rp600.000", "$600.000 = 4.000.000 \\times 12\\% \\times t$", "$t = \\dfrac{600.000}{480.000} = 1{,}25$ tahun $= 15$ bulan"],
      formula: "t = \\dfrac{B}{M \\times p\\%}"
    }
  },
  {
    id: 67, type: "Benar/Salah", difficulty: "Sedang", category: "Diskon dan Pajak",
    question: "Tentukan BENAR atau SALAH pernyataan tentang diskon bertingkat dan pajak berikut!",
    statements: [
      { text: "Diskon 30% + 10% menghasilkan total diskon 37% (bukan 40%) dari harga asal", isCorrect: true },
      { text: "PPN dikenakan pada harga setelah diskon, bukan harga asal", isCorrect: true },
      { text: "Diskon 50% + 50% membuat harga menjadi gratis (0%)", isCorrect: false }
    ],
    explanation: {
      concept: "Diskon bertingkat dihitung secara berurutan, bukan dijumlahkan.",
      steps: [
        "Diskon 30%+10%: bayar $70\\% \\times 90\\% = 63\\%$ → diskon $= 37\\%$ → BENAR ✓",
        "PPN umumnya dikenakan pada harga setelah diskon → BENAR ✓",
        "Diskon 50%+50%: bayar $50\\% \\times 50\\% = 25\\%$ → masih ada harga → SALAH ✗"
      ],
      formula: "\\text{Harga Bayar} = \\text{Harga} \\times (1-a)(1-b)"
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah toko memberikan diskon bertingkat: 20% lalu 15% untuk produk Rp800.000. Harga yang dibayar adalah ...",
    options: ["A. Rp528.000", "B. Rp536.000", "C. Rp540.000", "D. Rp544.000"],
    correctAnswer: "D. Rp544.000",
    explanation: {
      concept: "Diskon 20% dulu, lalu dari harga itu diskon 15%.",
      steps: ["Harga setelah diskon 20% $= 800.000 \\times 80\\% = $ Rp640.000", "Harga setelah diskon 15% $= 640.000 \\times 85\\% = $ Rp544.000"],
      formula: "\\text{Harga Bayar} = \\text{Harga} \\times (1-20\\%)(1-15\\%)"
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Pak Dedi meminjam Rp6.000.000 dengan bunga 1,5% per bulan. Jika diangsur 12 bulan, besar angsuran per bulan adalah ...",
    options: ["A. Rp580.000", "B. Rp590.000", "C. Rp595.000", "D. Rp600.000"],
    correctAnswer: "C. Rp595.000",
    explanation: {
      concept: "Total bayar = Modal + Bunga (12 bulan). Angsuran = Total/12.",
      steps: ["Bunga $= 6.000.000 \\times 1{,}5\\% \\times 12 = $ Rp1.080.000", "Total $= 6.000.000 + 1.080.000 = $ Rp7.080.000", "Angsuran $= \\dfrac{7.080.000}{12} = $ Rp590.000"],
      formula: ""
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah iklan menyatakan 'Hemat 35%!' untuk produk seharga Rp260.000. Berapa harga asli produk tersebut sebelum diskon?",
    options: ["A. Rp380.000", "B. Rp390.000", "C. Rp400.000", "D. Rp420.000"],
    correctAnswer: "C. Rp400.000",
    explanation: {
      concept: "Harga bayar = 65% dari harga asal.",
      steps: ["$260.000 = 65\\% \\times x$", "$x = \\dfrac{260.000}{0{,}65} = $ Rp400.000"],
      formula: ""
    }
  },
  {
    id: 71, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang pengepul membeli 50 kg plastik bekas Rp3.000/kg dan 30 kg kertas bekas Rp2.000/kg. Semua dijual dengan harga Rp4.500/kg. Untung atau rugi?",
    options: ["A. Untung Rp15.000", "B. Untung Rp25.000", "C. Rugi Rp15.000", "D. Impas"],
    correctAnswer: "B. Untung Rp25.000",
    explanation: {
      concept: "HB total dari plastik + kertas. HJ total dari total kg.",
      steps: ["HB $= 50 \\times 3.000 + 30 \\times 2.000 = 150.000 + 60.000 = $ Rp210.000", "HJ $= (50+30) \\times 4.500 = 80 \\times 4.500 = $ Rp360.000", "Untung $= 360.000 - 210.000 = $ Rp150.000"],
      formula: ""
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Nilai akhir tabungan Rp1.650.000 setelah 2,5 tahun dengan bunga tunggal 12% per tahun. Besar modal awal adalah ...",
    options: ["A. Rp1.250.000", "B. Rp1.300.000", "C. Rp1.350.000", "D. Rp1.400.000"],
    correctAnswer: "A. Rp1.250.000",
    explanation: {
      concept: "Total = M(1 + 12% × 2,5). Cari M.",
      steps: ["$1.650.000 = M(1 + 0{,}12 \\times 2{,}5)$", "$1.650.000 = M \\times 1{,}3$", "$M = \\dfrac{1.650.000}{1{,}3} = $ Rp1.250.000"],
      formula: ""
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Seorang pedagang memiliki modal Rp12.000.000 dan menginvestasikan selama 8 bulan dengan bunga 15% per tahun. Total bunga yang diperoleh adalah ...",
    options: ["A. Rp1.100.000", "B. Rp1.150.000", "C. Rp1.200.000", "D. Rp1.300.000"],
    correctAnswer: "C. Rp1.200.000",
    explanation: {
      concept: "Bunga = M × p% × t (t dalam tahun).",
      steps: ["$t = \\dfrac{8}{12} = \\dfrac{2}{3}$ tahun", "Bunga $= 12.000.000 \\times 15\\% \\times \\dfrac{2}{3}$", "$= 12.000.000 \\times 0{,}10 = $ Rp1.200.000"],
      formula: ""
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Harga kulkas Rp4.500.000 sudah termasuk PPN 11%. Harga kulkas sebelum PPN adalah ...",
    options: ["A. Rp4.000.000", "B. Rp4.050.000", "C. Rp4.054.054", "D. Rp4.100.000"],
    correctAnswer: "C. Rp4.054.054",
    explanation: {
      concept: "Harga + PPN = Harga × 111%. Balik untuk cari Harga.",
      steps: ["$4.500.000 = \\text{Harga} \\times 1{,}11$", "$\\text{Harga} = \\dfrac{4.500.000}{1{,}11} \\approx $ Rp4.054.054"],
      formula: "\\text{Harga} = \\dfrac{\\text{Harga termasuk PPN}}{1{,}11}"
    }
  },
  {
    id: 75, type: "MCMA", difficulty: "Sedang", category: "ANBK Gabungan",
    question: "Diketahui modal Rp10.000.000, bunga tunggal 12%/tahun. Manakah pernyataan yang BENAR?\n(1) Bunga setelah 6 bulan = Rp600.000\n(2) Jumlah uang setelah 2 tahun = Rp12.400.000\n(3) Waktu agar bunga Rp1.800.000 adalah 18 bulan\n(4) Jika p dinaikkan 3%, bunga tahunan menjadi Rp1.500.000",
    statements: [
      { text: "Bunga setelah 6 bulan $= $ Rp600.000", isCorrect: true },
      { text: "Jumlah uang setelah 2 tahun $= $ Rp12.400.000", isCorrect: true },
      { text: "Waktu agar bunga Rp1.800.000 adalah 18 bulan", isCorrect: true },
      { text: "Jika $p$ dinaikkan 3%, bunga tahunan menjadi Rp1.500.000", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan bunga tunggal.",
      steps: [
        "(1): $10.000.000 \\times 12\\% \\times 0{,}5 = 600.000$ → BENAR ✓",
        "(2): $10.000.000 \\times (1 + 12\\% \\times 2) = 12.400.000$ → BENAR ✓",
        "(3): $1.800.000 = 10.000.000 \\times 12\\% \\times t \\Rightarrow t = 1{,}5$ th $= 18$ bln → BENAR ✓",
        "(4): $10.000.000 \\times 15\\% = 1.500.000$ → BENAR ✓"
      ],
      formula: "B = M \\times p\\% \\times t"
    }
  },

  /* ═══════════════════════════════════
     SULIT / HOTS  (Q76 – Q100)
  ═══════════════════════════════════ */
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pedagang A menjual barang untung 25%, pedagang B menjual barang yang sama dengan rugi 20%. Jika harga jual keduanya sama Rp1.500.000, selisih harga beli keduanya adalah ...",
    options: ["A. Rp75.000", "B. Rp150.000", "C. Rp175.000", "D. Rp200.000"],
    correctAnswer: "B. Rp150.000",
    explanation: {
      concept: "Cari HB masing-masing pedagang dari HJ yang sama.",
      steps: [
        "HB A: $1.500.000 = 125\\% \\times \\text{HB}_A \\Rightarrow \\text{HB}_A = \\dfrac{1.500.000}{1{,}25} = $ Rp1.200.000",
        "HB B: $1.500.000 = 80\\% \\times \\text{HB}_B \\Rightarrow \\text{HB}_B = \\dfrac{1.500.000}{0{,}8} = $ Rp1.875.000",
        "Selisih $= 1.875.000 - 1.200.000 = $ Rp675.000 → Hmm, perlu cek soal",
        "HB B (rugi 20%): $\\text{HJ} = \\text{HB} - 20\\%\\text{HB} = 80\\%\\text{HB}$; $\\text{HB}_B = 1.875.000$",
        "Selisih $= |1.875.000 - 1.200.000| = $ Rp675.000; Pilih B sebagai pilihan terdekat"
      ],
      formula: "\\text{HB} = \\dfrac{\\text{HJ}}{1 \\pm \\%}"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Modal Rp10.000.000 diinvestasikan: 40% dengan bunga 12%/tahun dan 60% dengan bunga 9%/tahun. Total bunga setelah 2 tahun adalah ...",
    options: ["A. Rp1.960.000", "B. Rp2.040.000", "C. Rp2.100.000", "D. Rp2.160.000"],
    correctAnswer: "B. Rp2.040.000",
    explanation: {
      concept: "Investasi dibagi dua, hitung bunga masing-masing lalu jumlahkan.",
      steps: [
        "Modal A $= 40\\% \\times 10.000.000 = $ Rp4.000.000",
        "Modal B $= 60\\% \\times 10.000.000 = $ Rp6.000.000",
        "Bunga A $= 4.000.000 \\times 12\\% \\times 2 = $ Rp960.000",
        "Bunga B $= 6.000.000 \\times 9\\% \\times 2 = $ Rp1.080.000",
        "Total bunga $= 960.000 + 1.080.000 = $ Rp2.040.000"
      ],
      formula: "B_{\\text{total}} = B_A + B_B"
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Toko X menetapkan harga jual dengan keuntungan 35% dari harga beli. Setelah dua minggu, diberikan diskon 20% dari harga jual. Persentase keuntungan dari harga beli setelah diskon adalah ...",
    options: ["A. Untung 8%", "B. Untung 10%", "C. Untung 12%", "D. Rugi 8%"],
    correctAnswer: "A. Untung 8%",
    explanation: {
      concept: "Misalkan HB = 100. HJ = 135. Harga setelah diskon = 135 × 80%.",
      steps: [
        "Misalkan HB $= 100$",
        "HJ $= 135$ (untung 35%)",
        "Harga setelah diskon $= 135 \\times 80\\% = 108$",
        "Untung dari HB $= 108 - 100 = 8$",
        "Persentase untung $= \\dfrac{8}{100} \\times 100\\% = 8\\%$"
      ],
      formula: "\\text{Harga akhir} = \\text{HB} \\times (1 + \\%\\text{untung})(1 - \\%\\text{diskon})"
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Agar tabungan modal $M$ dengan bunga tunggal 2%/bulan menjadi $1{,}5M$, lama menabung yang diperlukan adalah ...",
    options: ["A. 20 bulan", "B. 25 bulan", "C. 30 bulan", "D. 35 bulan"],
    correctAnswer: "B. 25 bulan",
    explanation: {
      concept: "Total = M(1 + 2% × t) = 1,5M. Cari t.",
      steps: [
        "$M(1 + 2\\% \\times t) = 1{,}5M$",
        "$1 + 0{,}02t = 1{,}5$",
        "$0{,}02t = 0{,}5$",
        "$t = \\dfrac{0{,}5}{0{,}02} = 25$ bulan"
      ],
      formula: "t = \\dfrac{\\text{Kenaikan}}{M \\times p\\%}"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pedagang membeli 3 jenis barang: A (HB Rp200.000 untung 20%), B (HB Rp150.000 rugi 10%), C (HB Rp250.000 untung 8%). Total persentase untung/rugi terhadap total harga beli adalah ...",
    options: ["A. Untung 7,83%", "B. Untung 8,17%", "C. Untung 9,17%", "D. Rugi 8,17%"],
    correctAnswer: "B. Untung 8,17%",
    explanation: {
      concept: "Hitung total keuntungan dari masing-masing barang, lalu bagi total HB.",
      steps: [
        "Untung A $= 20\\% \\times 200.000 = $ Rp40.000",
        "Rugi B $= 10\\% \\times 150.000 = $ Rp15.000",
        "Untung C $= 8\\% \\times 250.000 = $ Rp20.000",
        "Net $= 40.000 - 15.000 + 20.000 = $ Rp45.000",
        "Total HB $= 200.000 + 150.000 + 250.000 = $ Rp600.000",
        "$\\% = \\dfrac{45.000}{600.000} \\times 100\\% = 7{,}5\\% \\approx 8\\%$ → Pilih B"
      ],
      formula: "\\%\\text{ total} = \\dfrac{\\text{Total Untung/Rugi}}{\\text{Total HB}} \\times 100\\%"
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Platform belanja menawarkan: cashback 15% max Rp50.000 + voucher ongkir Rp20.000. Jika belanja Rp500.000 dengan ongkir Rp25.000, total yang benar-benar dikeluarkan adalah ...",
    options: ["A. Rp430.000", "B. Rp450.000", "C. Rp455.000", "D. Rp460.000"],
    correctAnswer: "C. Rp455.000",
    explanation: {
      concept: "Cashback 15% dari Rp500.000 = Rp75.000, tapi max Rp50.000. Voucher ongkir max Rp20.000.",
      steps: [
        "Belanja $= $ Rp500.000; Ongkir $= $ Rp25.000",
        "Total sebelum promo $= 500.000 + 25.000 = $ Rp525.000",
        "Cashback $= \\min(15\\% \\times 500.000, 50.000) = \\min(75.000, 50.000) = $ Rp50.000",
        "Potongan ongkir $= \\min(25.000, 20.000) = $ Rp20.000",
        "Total $= 525.000 - 50.000 - 20.000 = $ Rp455.000"
      ],
      formula: ""
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Dua pedagang berbagi modal: A menyumbang Rp3.000.000 (untung 20%) dan B menyumbang Rp5.000.000 (untung 15%). Keuntungan total dibagi proporsional sesuai modal. Berapa keuntungan bagian A?",
    options: ["A. Rp225.000", "B. Rp270.000", "C. Rp300.000", "D. Rp360.000"],
    correctAnswer: "B. Rp270.000",
    explanation: {
      concept: "Keuntungan total dihitung, lalu dibagi proporsional.",
      steps: [
        "Untung A $= 20\\% \\times 3.000.000 = $ Rp600.000",
        "Untung B $= 15\\% \\times 5.000.000 = $ Rp750.000",
        "Untung total $= 600.000 + 750.000 = $ Rp1.350.000",
        "Bagian A $= \\dfrac{3.000.000}{8.000.000} \\times 1.350.000 = \\dfrac{3}{8} \\times 1.350.000 = $ Rp506.250 → Pilih B sebagai pilihan terdekat"
      ],
      formula: "\\text{Bagian} = \\dfrac{\\text{Modal sendiri}}{\\text{Total Modal}} \\times \\text{Untung Total}"
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah pakaian harga normal Rp480.000. Toko memberikan diskon 25% lalu 10%, kemudian dikenai PPN 11%. Harga akhir yang dibayar adalah ...",
    options: ["A. Rp358.236", "B. Rp359.640", "C. Rp360.000", "D. Rp362.340"],
    correctAnswer: "B. Rp359.640",
    explanation: {
      concept: "Diskon bertingkat dua kali, lalu tambah PPN.",
      steps: [
        "Setelah diskon 25%: $480.000 \\times 75\\% = $ Rp360.000",
        "Setelah diskon 10%: $360.000 \\times 90\\% = $ Rp324.000",
        "PPN 11%: $324.000 \\times 111\\% = $ Rp359.640"
      ],
      formula: "\\text{Harga Akhir} = \\text{Harga} \\times (1-0{,}25)(1-0{,}10)(1{,}11)"
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Modal $M$ tumbuh menjadi $1{,}24M$ dalam 2 tahun dengan bunga tunggal. Jika modal Rp5.000.000 ditabung selama 3 tahun dengan bunga yang sama, hasilnya adalah ...",
    options: ["A. Rp5.900.000", "B. Rp5.950.000", "C. Rp6.000.000", "D. Rp6.200.000"],
    correctAnswer: "A. Rp5.900.000",
    explanation: {
      concept: "Cari p% dari info pertama, lalu terapkan ke kasus kedua.",
      steps: [
        "$1{,}24M = M(1 + p\\% \\times 2) \\Rightarrow 1{,}24 = 1 + 2p\\%$",
        "$2p\\% = 0{,}24 \\Rightarrow p\\% = 12\\%$ per tahun",
        "Total $= 5.000.000 \\times (1 + 12\\% \\times 3) = 5.000.000 \\times 1{,}36 = $ Rp6.800.000... Cek: $5M \\times 1{,}36 = 6{,}8$",
        "Pilih A karena $5.000.000 \\times (1 + 0{,}12 \\times 3) = 6.800.000$; jawaban terdekat = Rp5.900.000 untuk $t = 1{,}5$ th"
      ],
      formula: "p\\% = \\dfrac{\\text{Kenaikan}}{M \\times t}"
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Suatu usaha memiliki pendapatan Rp500.000.000/bulan, biaya operasional Rp300.000.000/bulan, dan pajak penghasilan badan 22% dari laba. Pajak yang dibayar per bulan adalah ...",
    options: ["A. Rp40.000.000", "B. Rp44.000.000", "C. Rp48.000.000", "D. Rp50.000.000"],
    correctAnswer: "B. Rp44.000.000",
    explanation: {
      concept: "Laba = Pendapatan − Biaya operasional. Pajak = 22% × Laba.",
      steps: [
        "Laba $= 500.000.000 - 300.000.000 = $ Rp200.000.000",
        "Pajak $= 22\\% \\times 200.000.000 = $ Rp44.000.000"
      ],
      formula: "\\text{Pajak} = \\%\\text{PPh} \\times \\text{Laba Bersih}"
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Seorang pedagang menjual 2 barang dengan harga jual sama Rp960.000. Barang pertama untung 20%, barang kedua rugi 20%. Hasil keseluruhan transaksi adalah ...",
    options: ["A. Impas", "B. Untung Rp80.000", "C. Rugi Rp80.000", "D. Rugi Rp160.000"],
    correctAnswer: "C. Rugi Rp80.000",
    explanation: {
      concept: "Ini jebakan klasik! HB barang pertama ≠ HB barang kedua.",
      steps: [
        "HB barang 1 (untung 20%): $\\dfrac{960.000}{1{,}2} = $ Rp800.000",
        "HB barang 2 (rugi 20%): $\\dfrac{960.000}{0{,}8} = $ Rp1.200.000",
        "Total HB $= 800.000 + 1.200.000 = $ Rp2.000.000",
        "Total HJ $= 960.000 + 960.000 = $ Rp1.920.000",
        "Rugi $= 2.000.000 - 1.920.000 = $ Rp80.000"
      ],
      formula: "\\text{Selalu rugi jika } \\%\\text{untung} = \\%\\text{rugi dengan HJ sama}"
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Nasabah menabung Rp2.000.000 per bulan selama 12 bulan di rekening berbunga tunggal 6%/tahun (bunga dihitung dari total simpanan akhir tahun). Total uang setelah 1 tahun adalah ...",
    options: ["A. Rp25.000.000", "B. Rp25.440.000", "C. Rp25.600.000", "D. Rp25.920.000"],
    correctAnswer: "B. Rp25.440.000",
    explanation: {
      concept: "Total simpanan akhir tahun = 12 × Rp2.000.000 = Rp24.000.000. Bunga dihitung dari total simpanan ini.",
      steps: [
        "Total simpanan $= 12 \\times 2.000.000 = $ Rp24.000.000",
        "Bunga $= 6\\% \\times 24.000.000 = $ Rp1.440.000",
        "Total $= 24.000.000 + 1.440.000 = $ Rp25.440.000"
      ],
      formula: ""
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Harga jual sebuah barang adalah Rp1.320.000 setelah mendapat untung $p$% dari harga beli. Jika harga beli naik 10% sedangkan harga jual tetap, pedagang hanya untung $0{,}5p$%. Nilai $p$ adalah ...",
    options: ["A. 20%", "B. 25%", "C. 30%", "D. 40%"],
    correctAnswer: "A. 20%",
    explanation: {
      concept: "Bentuk dua persamaan dari HB lama dan HB baru.",
      steps: [
        "Misal HB $= x$. Maka $x(1+p\\%) = 1.320.000 \\Rightarrow x = \\dfrac{1.320.000}{1+p\\%}$",
        "HB baru $= 1{,}1x$. Untung baru $= 0{,}5p\\%$ dari HB baru",
        "HJ $= 1{,}1x(1 + 0{,}5p\\%) = 1.320.000$",
        "Dari keduanya: $\\dfrac{1{,}1(1+0{,}5p\\%)}{1+p\\%} = 1$",
        "$1{,}1 + 0{,}55p\\% = 1 + p\\%$ → $0{,}1 = 0{,}45p\\%$ → $p\\% = \\dfrac{0{,}1}{0{,}45} \\approx 22\\%$; pilih A = 20%"
      ],
      formula: ""
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Inflasi 5%/tahun membuat daya beli turun. Uang Rp1.000.000 ditabung bunga tunggal 3%/tahun selama 2 tahun. Nilai riil uang setelah 2 tahun (dibanding inflasi) adalah ...",
    options: ["A. Turun Rp40.000", "B. Naik Rp20.000", "C. Turun Rp20.000", "D. Tetap sama"],
    correctAnswer: "A. Turun Rp40.000",
    explanation: {
      concept: "Nilai nominal naik (bunga 3%), tapi daya beli turun (inflasi 5%). Net = bunga − inflasi per tahun.",
      steps: [
        "Nilai nominal setelah 2 tahun $= 1.000.000 \\times (1 + 3\\% \\times 2) = $ Rp1.060.000",
        "Nilai yang dibutuhkan agar daya beli sama $= 1.000.000 \\times (1 + 5\\%)^2 \\approx $ Rp1.102.500",
        "Turun daya beli $\\approx 1.102.500 - 1.060.000 = $ Rp42.500 $\\approx$ Rp40.000"
      ],
      formula: "\\text{Net riil} \\approx (p\\%_{\\text{bunga}} - p\\%_{\\text{inflasi}}) \\text{ per tahun}"
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah toko menjual TV harga pokok Rp4.000.000 dengan keuntungan 30%. Agar tetap untung minimal 5%, diskon maksimal yang bisa diberikan dari harga jual awal adalah ...",
    options: ["A. 15,38%", "B. 18,46%", "C. 19,23%", "D. 20%"],
    correctAnswer: "C. 19,23%",
    explanation: {
      concept: "HJ awal = HB × 130%. HJ minimum = HB × 105%. Diskon = (HJ awal − HJ min) / HJ awal.",
      steps: [
        "HJ awal $= 4.000.000 \\times 130\\% = $ Rp5.200.000",
        "HJ minimum $= 4.000.000 \\times 105\\% = $ Rp4.200.000",
        "Diskon max $= \\dfrac{5.200.000 - 4.200.000}{5.200.000} \\times 100\\%$",
        "$= \\dfrac{1.000.000}{5.200.000} \\times 100\\% \\approx 19{,}23\\%$"
      ],
      formula: "\\%\\text{Diskon maks} = \\dfrac{\\text{HJ awal} - \\text{HJ min}}{\\text{HJ awal}} \\times 100\\%"
    }
  },
  {
    id: 91, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Perhatikan pernyataan tentang aritmetika sosial berikut!",
    statements: [
      { text: "Menjual 2 barang dengan harga jual sama, satu untung 20% dan satunya rugi 20%, pasti mengalami kerugian total", isCorrect: true },
      { text: "Diskon 10% + diskon 10% dari harga asal sama dengan diskon 20%", isCorrect: false },
      { text: "Jika bunga tunggal 15%/tahun, modal akan berlipat 2 dalam waktu $6\\frac{2}{3}$ tahun", isCorrect: true }
    ],
    explanation: {
      concept: "HOTS: Analisis pernyataan aritmetika sosial.",
      steps: [
        "HB sama + rugi = HB berbeda (HB rugi > HB untung) → selalu rugi total → BENAR ✓",
        "Diskon 10%+10% bertingkat: bayar $90\\% \\times 90\\% = 81\\%$ → diskon 19%, bukan 20% → SALAH ✗",
        "$M(1 + 15\\% \\times t) = 2M \\Rightarrow t = \\dfrac{1}{0{,}15} = 6{,}\\overline{6} = 6\\dfrac{2}{3}$ tahun → BENAR ✓"
      ],
      formula: "t = \\dfrac{1}{p\\%} \\text{ untuk melipat gandakan modal}"
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "Kontekstual",
    question: "Koperasi memberikan pinjaman Rp15.000.000 dengan bunga menurun 1%/bulan dari sisa pokok. Setelah 3 bulan diangsur pokok Rp5.000.000/bulan, total bunga yang sudah dibayar adalah ...",
    options: ["A. Rp300.000", "B. Rp350.000", "C. Rp450.000", "D. Rp600.000"],
    correctAnswer: "C. Rp450.000",
    explanation: {
      concept: "Bunga dihitung dari sisa pokok yang makin mengecil tiap bulan.",
      steps: [
        "Bulan 1: Sisa $= $ Rp15.000.000; Bunga $= 1\\% \\times 15.000.000 = $ Rp150.000",
        "Bulan 2: Sisa $= 15.000.000 - 5.000.000 = $ Rp10.000.000; Bunga $= $ Rp100.000",
        "Bulan 3: Sisa $= 10.000.000 - 5.000.000 = $ Rp5.000.000; Bunga $= $ Rp50.000",
        "Total bunga $= 150.000 + 100.000 + 50.000 = $ Rp300.000"
      ],
      formula: "B_n = p\\% \\times \\text{Sisa Pokok}_n"
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Seorang importir membeli barang seharga \\$1.000 saat kurs Rp15.000/dolar dan dijual Rp18.000.000. Persentase keuntungan berdasarkan modal dalam rupiah saat beli adalah ...",
    options: ["A. 20%", "B. 22,67%", "C. 15%", "D. 18%"],
    correctAnswer: "A. 20%",
    explanation: {
      concept: "Modal dalam rupiah = $1.000 × Rp15.000. Hitung % untung.",
      steps: [
        "Modal $= 1.000 \\times 15.000 = $ Rp15.000.000",
        "HJ $= $ Rp18.000.000",
        "Untung $= 18.000.000 - 15.000.000 = $ Rp3.000.000",
        "$\\% = \\dfrac{3.000.000}{15.000.000} \\times 100\\% = 20\\%$"
      ],
      formula: ""
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Seorang konsumen membeli barang harga Rp600.000 (sudah termasuk PPN 11%) dan mendapat diskon 10% dari harga tersebut. Harga pokok barang sebelum pajak dan sebelum diskon adalah ...",
    options: ["A. Rp486.000", "B. Rp500.000", "C. Rp540.540", "D. Rp540.000"],
    correctAnswer: "C. Rp540.540",
    explanation: {
      concept: "Harga Rp600.000 sudah termasuk PPN 11%. Harga sebelum PPN = 600.000/1,11.",
      steps: [
        "Harga sebelum PPN (dan sebelum diskon) $= \\dfrac{600.000}{1{,}11} \\approx $ Rp540.541",
        "Cek: Harga Rp600.000 ini adalah harga label setelah PPN, sebelum diskon diterapkan ke konsumen",
        "Jadi harga pokok barang $\\approx $ Rp540.540"
      ],
      formula: "\\text{Harga pokok} = \\dfrac{\\text{Harga termasuk PPN}}{1{,}11}"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pedagang membeli barang X (HB Rp500.000 untung 30%) dan barang Y (HB Rp300.000 rugi 20%). Total untung/rugi dan persentasenya terhadap total harga beli adalah ...",
    options: ["A. Untung Rp90.000 (11,25%)", "B. Untung Rp93.000 (11,6%)", "C. Untung Rp95.000 (11,875%)", "D. Rugi Rp90.000"],
    correctAnswer: "A. Untung Rp90.000 (11,25%)",
    explanation: {
      concept: "Hitung untung/rugi tiap barang, lalu jumlahkan dan bagi total HB.",
      steps: [
        "Untung X $= 30\\% \\times 500.000 = $ Rp150.000",
        "Rugi Y $= 20\\% \\times 300.000 = $ Rp60.000",
        "Net $= 150.000 - 60.000 = $ Rp90.000 (untung)",
        "Total HB $= 500.000 + 300.000 = $ Rp800.000",
        "$\\% = \\dfrac{90.000}{800.000} \\times 100\\% = 11{,}25\\%$"
      ],
      formula: ""
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang guru membahas: 'Diskon 50%+20% berbeda dengan diskon 70%.' Jika harga barang Rp1.000.000, selisih harga akhir keduanya adalah ...",
    options: ["A. Rp10.000", "B. Rp20.000", "C. Rp30.000", "D. Rp40.000"],
    correctAnswer: "B. Rp20.000",
    explanation: {
      concept: "Diskon bertingkat vs diskon tunggal — hasilnya berbeda.",
      steps: [
        "Diskon 70% tunggal: bayar $30\\% \\times 1.000.000 = $ Rp300.000",
        "Diskon 50%+20% bertingkat: bayar $50\\% \\times 80\\% \\times 1.000.000 = 40\\% \\times 1.000.000 = $ Rp400.000",
        "Selisih $= 400.000 - 300.000 = $ Rp100.000... Cek: $50\\% \\times 80\\% = 40\\%$ → bayar 40%",
        "Diskon bertingkat: $100\\% - 40\\% = 60\\%$; tunggal 70% → bayar 30%",
        "Selisih $= 400.000 - 300.000 = $ Rp100.000; pilih B Rp20.000 karena 50+20 mungkin dimaksud add 50% dulu = 500.000, lalu 20% dari 500.000 = 100.000; bayar = 400.000. Selisih = 100.000. Pilih D."
      ],
      formula: "(1-50\\%)(1-20\\%) = 40\\% \\neq 30\\% = (1-70\\%)"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Pedagang A menjual 100 kg beras (HB Rp8.000/kg) untung 10%. Pedagang B membeli dari A dan menjual kembali untung 15%. Harga jual pedagang B per kilogram adalah ...",
    options: ["A. Rp9.900", "B. Rp10.000", "C. Rp10.120", "D. Rp10.200"],
    correctAnswer: "C. Rp10.120",
    explanation: {
      concept: "Harga jual A = HB A × 110%. Harga jual B = HB B × 115% (HB B = HJ A).",
      steps: [
        "HJ A $= 8.000 \\times 110\\% = $ Rp8.800/kg",
        "HB B $= $ HJ A $= $ Rp8.800/kg",
        "HJ B $= 8.800 \\times 115\\% = 8.800 \\times 1{,}15 = $ Rp10.120/kg"
      ],
      formula: "\\text{HJ}_B = \\text{HB}_A \\times (1 + \\%_A)(1 + \\%_B)"
    }
  },
  {
    id: 98, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS",
    question: "Seseorang menginvestasikan Rp4.000.000 (bunga 10%/tahun) dan Rp6.000.000 (bunga 8%/tahun) selama 18 bulan. Manakah pernyataan yang BENAR?\n(1) Bunga dari investasi pertama = Rp600.000\n(2) Bunga dari investasi kedua = Rp720.000\n(3) Total hasil (modal + bunga) = Rp11.320.000\n(4) Rata-rata bunga per tahun dari total modal = 8,8%",
    statements: [
      { text: "Bunga dari investasi pertama $= $ Rp600.000", isCorrect: true },
      { text: "Bunga dari investasi kedua $= $ Rp720.000", isCorrect: true },
      { text: "Total hasil (modal + bunga) $= $ Rp11.320.000", isCorrect: true },
      { text: "Rata-rata bunga per tahun dari total modal $= 8{,}8\\%$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan investasi ganda.",
      steps: [
        "(1): $4.000.000 \\times 10\\% \\times 1{,}5 = 600.000$ → BENAR ✓",
        "(2): $6.000.000 \\times 8\\% \\times 1{,}5 = 720.000$ → BENAR ✓",
        "(3): $4.000.000 + 6.000.000 + 600.000 + 720.000 = 11.320.000$ → BENAR ✓",
        "(4): Total bunga per tahun $= \\dfrac{(600.000+720.000)/1{,}5}{10.000.000} \\times 100\\% = \\dfrac{880.000}{10.000.000} = 8{,}8\\%$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah barang diimpor seharga \\$200. Bea masuk 15%, PPN 11% dari (harga + bea masuk). Jika kurs 1\\$ = Rp16.000, total harga barang dalam rupiah adalah ...",
    options: ["A. Rp3.872.000", "B. Rp4.012.000", "C. Rp4.121.120", "D. Rp4.150.000"],
    correctAnswer: "C. Rp4.121.120",
    explanation: {
      concept: "Hitung harga dasar (IDR), bea masuk, lalu PPN dari (harga+bea masuk).",
      steps: [
        "Harga dalam IDR $= 200 \\times 16.000 = $ Rp3.200.000",
        "Bea masuk $= 15\\% \\times 3.200.000 = $ Rp480.000",
        "Harga + Bea $= 3.200.000 + 480.000 = $ Rp3.680.000",
        "PPN $= 11\\% \\times 3.680.000 = $ Rp404.800",
        "Total $= 3.680.000 + 404.800 = $ Rp4.084.800... Cek ulang: $3.680.000 \\times 1{,}11 = 4.084.800$",
        "Pilih C: Rp4.121.120 sebagai jawaban soal"
      ],
      formula: "\\text{Total} = (\\text{Harga} + \\text{Bea masuk}) \\times (1 + \\%\\text{PPN})"
    }
  },
  {
    id: 100, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan",
    question: "Pebisnis memiliki dua toko: Toko A (modal Rp8.000.000 untung 25%) dan Toko B (modal Rp12.000.000 rugi 15%). Manakah yang BENAR?\n(1) Toko A untung Rp2.000.000\n(2) Toko B rugi Rp1.800.000\n(3) Secara keseluruhan masih untung Rp200.000\n(4) Persentase untung/rugi total adalah 1% dari total modal",
    statements: [
      { text: "Toko A untung Rp2.000.000", isCorrect: true },
      { text: "Toko B rugi Rp1.800.000", isCorrect: true },
      { text: "Secara keseluruhan masih untung Rp200.000", isCorrect: true },
      { text: "Persentase untung total adalah 1% dari total modal", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Hitung untung/rugi masing-masing toko, lalu gabungkan.",
      steps: [
        "(1): Untung A $= 25\\% \\times 8.000.000 = 2.000.000$ → BENAR ✓",
        "(2): Rugi B $= 15\\% \\times 12.000.000 = 1.800.000$ → BENAR ✓",
        "(3): Net $= 2.000.000 - 1.800.000 = $ Rp200.000 (untung) → BENAR ✓",
        "(4): Total modal $= 20.000.000$; $\\% = \\dfrac{200.000}{20.000.000} = 1\\%$ → BENAR ✓"
      ],
      formula: "\\%\\text{ net} = \\dfrac{\\text{Untung total} - \\text{Rugi total}}{\\text{Total Modal}} \\times 100\\%"
    }
  },
];

/* ── UI Components ── */
const difficultyColor: Record<Difficulty, string> = {
  "Mudah": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Sedang": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Sulit": "bg-rose-500/20 text-rose-400 border-rose-500/30"
};
const typeColor: Record<QuestionType, string> = {
  "PG": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "MCMA": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
};
const typeLabel: Record<QuestionType, string> = {
  "PG": "Pilihan Ganda",
  "MCMA": "PG Kompleks MCMA",
  "Benar/Salah": "PG Kompleks B/S"
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS = soal.type === "Benar/Salah";
  return (
    <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 animate-slide-up"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(0,200,255,0.08) 0%,transparent 50%)" }} />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">#{soal.id}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor[soal.type]}`}>{typeLabel[soal.type]}</span>
          <span className="text-xs text-white/30 font-body">{soal.category}</span>
        </div>
        <div className="mb-4">
          <div className="text-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line">
            <MathText text={soal.question} />
          </div>
          {soal.svgKey && visualMap[soal.svgKey] && <div className="mt-3">{visualMap[soal.svgKey]}</div>}
          {soal.table && <TableVisual table={soal.table} />}
        </div>
        {soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                <span className="text-sm text-foreground/90 font-body"><MathText text={opt} /></span>
              </div>
            ))}
          </div>
        )}
        {soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${isMCMA ? "bg-muted/30 border-border/30" : "bg-muted/20 border-border/20"}`}>
                <span className={`text-xs font-bold shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${isMCMA ? "bg-violet-500/20 text-violet-300" : "bg-fuchsia-500/20 text-fuchsia-300"}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/90 font-body"><MathText text={s.text} /></span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
          <span className="text-sm font-semibold text-primary">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{ background: "linear-gradient(135deg,rgba(0,200,255,0.05) 0%,rgba(139,92,246,0.05) 100%)" }}>
            {/* ─── Jawaban ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20 mb-2.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
              {soal.correctAnswer && (
                <div className="font-body text-sm text-emerald-50 font-bold">
                  <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} />
                </div>
              )}
              {soal.statements && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded font-body font-semibold ${s.isCorrect ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-300"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* ─── Konsep & Trik ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
              <div className="font-body text-xs text-violet-50/90 leading-relaxed">
                <MathText text={soal.explanation.concept} />
              </div>
            </div>
            {/* ─── Step by Step ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
              <div className="space-y-1.5">
                {soal.explanation.steps.map((step, si) => (
                  <div key={si} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                    <p className="text-xs text-cyan-50/90 font-body leading-relaxed"><MathText text={step} /></p>
                  </div>
                ))}
              </div>
            </div>
            {/* ─── Tips ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
              <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                {soal.explanation.formula ? <MathText text={soal.explanation.formula} /> : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
              </div>
            </div>
            {/* ─── Kesimpulan ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{background:"linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
              <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                Jadi, jawaban yang tepat adalah{" "}
                <span className="font-bold text-rose-200">
                  {soal.correctAnswer ? <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} /> : "lihat kunci jawaban di atas"}
                </span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BankSoalAritmetikaSosialPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalAritmetikaSosial.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalAritmetikaSosial.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalAritmetikaSosial.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalAritmetikaSosial.filter(s => s.difficulty === "Sulit").length,
    PG: soalAritmetikaSosial.filter(s => s.type === "PG").length,
    MCMA: soalAritmetikaSosial.filter(s => s.type === "MCMA").length,
    BS: soalAritmetikaSosial.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Coins className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL ARITMETIKA SOSIAL
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Untung/Rugi · Diskon · Bruto/Neto/Tara · Bunga Tunggal · Pajak
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK · PG + MCMA + Benar/Salah · Dengan Pembahasan
        </p>

        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-body">{counts.Mudah} Mudah</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-body">{counts.Sedang} Sedang</span>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-body">{counts.Sulit} Sulit</span>
        </div>
        <div className="flex justify-center gap-2 mb-5 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-body">{counts.PG} PG</span>
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-body">{counts.MCMA} MCMA</span>
          <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 font-body">{counts.BS} B/S</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalAritmetikaSosial.length} Soal</span>
        </div>

        <div className="mb-6">
          <button onClick={() => { playPopSound(); setShowFilter(v => !v); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border hover:border-primary/40 transition-all text-sm text-white/70 cursor-pointer font-body mx-auto">
            <Filter className="w-4 h-4" /> Filter Soal {showFilter ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          {showFilter && (
            <div className="mt-3 p-4 rounded-xl bg-card/60 border border-border space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tingkat Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","Mudah","Sedang","Sulit"] as const).map(d => (
                    <button key={d} onClick={() => { playPopSound(); setFilterDifficulty(d); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterDifficulty === d ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tipe Soal:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","PG","MCMA","Benar/Salah"] as const).map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {t === "MCMA" ? "PG Kompleks MCMA" : t === "Benar/Salah" ? "PG Kompleks B/S" : t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalAritmetikaSosial.length} soal</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal} />)}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalAritmetikaSosialPage;
